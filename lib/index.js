"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs = require("fs");
const store = require("data-store");
const file_1 = require("./file");
const find_by_name_1 = require("./find.by.name");
function logStrings(strs) {
    console.log(strs.join("\n"));
}
function filenamekey(filename) {
    return file_1.digest(filename);
}
const findStore = store("FINDIMPORTS");
findStore.clear(); // clear memory data
const uniqueArray = function (arrArg) {
    return arrArg.filter(function (elem, pos, arr) {
        return arr.indexOf(elem) === pos;
    });
};
function findAllImports(filename, options) {
    if (!filename || !fs.existsSync(filename)) {
        console.log(`${filename} not find.`);
        return [];
    }
    const { findChild, log, baseUrl } = options;
    const key = filenamekey(filename);
    const storeItems = findStore.get(key);
    const dataImports = storeItems || find_by_name_1.findImportsByName(filename);
    if (log) {
        logStrings(dataImports);
    }
    const abPaths = (items) => {
        const strs = [];
        items.forEach(p => {
            const r = file_1.findModulePath(filename, p, {
                baseUrl
            });
            if (r) {
                strs.push(r);
            }
            else if (!path_1.extname(p)) {
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
            if (s)
                return [...prev];
            if (!fs.existsSync(next) ||
                file_1.extensions.findIndex(e => e === path_1.extname(next)) < 0) {
                return [...prev];
            }
            return [...prev, ...findImports(next, options)];
        }, dataImports);
        return uniqueArray(abPaths(items));
    }
    else {
        return uniqueArray(abPaths(dataImports));
    }
}
function findImports(filename, options) {
    const paths = findAllImports(filename, options);
    return paths.map(ele => {
        if (path_1.isAbsolute(ele)) {
            return path_1.relative(options.baseUrl[0], ele);
        }
        return ele;
    });
}
exports.findImports = findImports;
exports.default = {
    findImports,
    findImportsByName: find_by_name_1.findImportsByName,
    findImportsByNameAsync: find_by_name_1.findImportsByNameAsync
};
