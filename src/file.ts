import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import * as Dstore from "data-store";

const store = Dstore("FILENAME");

store.clear();

export interface PathOption {
  baseUrl: string[];
}

export function digest(str: string): string {
  return crypto
    .createHash("md5")
    .update(str)
    .digest("hex");
}

export function genPath(root: string, filename: string): string | null {
  const abPath = path.resolve(root, filename);

  if (fs.existsSync(abPath) && fs.lstatSync(abPath).isFile()) {
    return abPath;
  }

  return null;
}

function storePathKey(rootfile: string, filename: string) {
  return digest(`path_${rootfile}_${filename}`);
}

const DEFAULT_OPTIONS = {
  baseUrl: [process.cwd(), `${process.cwd()}/node_modules`],
  node_modules: false
};

/**
 * node_modules do not thinks
 * @param filename_rootfile
 * @param filename
 * @param options
 */
export function findModulePath(
  filename_rootfile: string,
  filename: string,
  options: PathOption = DEFAULT_OPTIONS
): string | null {
  /**
   * . 相对路径
   * . 绝对路径
   */
  const ext = path.extname(filename);
  const extensions = [".js", ".jsx", ".ts", ".tsx"];
  if (ext && extensions.indexOf(ext) === -1) {
    return null;
  }

  if (path.dirname(filename_rootfile) !== filename_rootfile) {
    filename_rootfile = path.dirname(filename_rootfile);
  }

  const storeKey = storePathKey(filename_rootfile, filename);
  const storeKeyVal = store.get(storeKey);
  const { baseUrl = DEFAULT_OPTIONS.baseUrl } = options;

  if (storeKeyVal) {
    return storeKeyVal === "null" ? null : storeKeyVal;
  }

  // save result path and return pathname
  const storeAndReturn = (rpath: string | null) => {
    store.set(storeKey, String(rpath));
    return rpath;
  };

  const roots = baseUrl.concat(filename_rootfile);
  let r: string | null = null;

  roots.some(baseRoot => {
    if (ext) {
      const namepath = genPath(baseRoot, filename);

      r = namepath;

      return !!namepath;
    }

    let namepath2: string | null = null;
    extensions.some(extname => {
      namepath2 = genPath(baseRoot, `${filename}${extname}`);
      if (!namepath2) {
        namepath2 = genPath(baseRoot, `${filename}/index${extname}`);
      }
      return !!namepath2;
    });

    if (namepath2) {
      r = namepath2;
      return true;
    }

    return false;
  });

  return storeAndReturn(r);
}
