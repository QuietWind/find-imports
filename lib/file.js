"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const Dstore = require("data-store");
const store = Dstore("FILENAME");
store.clear();
exports.extensions = [".js", ".jsx", ".ts", ".tsx"];
function digest(str) {
    return crypto
        .createHash("md5")
        .update(str)
        .digest("hex");
}
exports.digest = digest;
function genPath(root, filename) {
    const abPath = path.resolve(root, filename);
    if (fs.existsSync(abPath) && fs.lstatSync(abPath).isFile()) {
        return abPath;
    }
    return null;
}
exports.genPath = genPath;
function storePathKey(rootfile, filename) {
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
function findModulePath(filename_rootfile, filename, options = DEFAULT_OPTIONS) {
    /**
     * . 相对路径
     * . 绝对路径
     */
    const ext = path.extname(filename);
    if (ext && exports.extensions.indexOf(ext) === -1) {
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
    const storeAndReturn = (rpath) => {
        store.set(storeKey, String(rpath));
        return rpath;
    };
    const roots = baseUrl.concat(filename_rootfile);
    let r = null;
    roots.some(baseRoot => {
        if (ext) {
            const namepath = genPath(baseRoot, filename);
            r = namepath;
            return !!namepath;
        }
        let namepath2 = null;
        exports.extensions.some(extname => {
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
exports.findModulePath = findModulePath;
