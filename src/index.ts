import { extname, relative, isAbsolute } from "path";
import * as fs from "fs";
import * as store from "data-store";
import { digest, findModulePath, extensions } from "./file";
import { findImportsByName, findImportsByNameAsync } from "./find.by.name";

export interface TFindImportsOptions {
  findChild: boolean;
  log: boolean; // log result imports
  baseUrl: string[];
}

function logStrings(strs: string[]) {
  console.log(strs.join("\n"));
}

function filenamekey(filename: string) {
  return digest(filename);
}

const findStore = store("FINDIMPORTS");

findStore.clear(); // clear memory data

const uniqueArray = function(arrArg: string[]) {
  return arrArg.filter(function(elem, pos, arr) {
    return arr.indexOf(elem) === pos;
  });
};

function findAllImports(
  filename: string,
  options: TFindImportsOptions
): string[] {
  if (!filename || !fs.existsSync(filename)) {
    console.log(`${filename} not find.`);
    return [];
  }

  const { findChild, log, baseUrl } = options;
  const key = filenamekey(filename);
  const storeItems = findStore.get(key);
  const dataImports: string[] = storeItems || findImportsByName(filename);

  if (log) {
    logStrings(dataImports);
  }

  const abPaths = (items: string[]): string[] => {
    const strs: string[] = [];
    items.forEach(p => {
      const r = findModulePath(filename, p, {
        baseUrl
      });

      if (r) {
        strs.push(r);
      } else if (!extname(p)) {
        // filter not in extensions
        strs.push(p);
      }
    });

    findStore.set(key, [...strs]);

    return strs;
  };

  if (findChild) {
    const items = abPaths(dataImports).reduce((prev, next) => {
      const s = findStore.get(filenamekey(next));
      if (s) return [...prev];
      if (
        !fs.existsSync(next) ||
        extensions.findIndex(e => e === extname(next)) < 0
      ) {
        return [...prev];
      }

      return [...prev, ...findImports(next, options)];
    }, dataImports);

    return uniqueArray(abPaths(items));
  } else {
    return uniqueArray(abPaths(dataImports));
  }
}

export function findImports(filename: string, options: TFindImportsOptions) {
  const paths = findAllImports(filename, options);

  return paths.map(ele => {
    if (isAbsolute(ele)) {
      return relative(options.baseUrl[0], ele);
    }

    return ele;
  });
}

export default {
  findImports,
  findImportsByName,
  findImportsByNameAsync
};
