"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
function findImports(filename, options) {
    if (!filename || !fs.existsSync(filename)) {
        console.log(`${filename} not find.`);
        return [];
    }
    const { findChild, log, baseUrl } = options;
    const key = filenamekey(filename);
    const storeItems = findStore.get(key);
    const dataImports = storeItems || find_by_name_1.findImportsByName(filename);
    findStore.set(key, [...dataImports]);
    if (log) {
        logStrings(dataImports);
    }
    if (findChild) {
        const items = dataImports.reduce((prev, next) => {
            const newFilename = file_1.findModulePath(filename, next, {
                baseUrl
            });
            if (!newFilename)
                return [...prev];
            if (typeof newFilename !== "string") {
                console.log(newFilename, filename, next);
            }
            const s = findStore.get(filenamekey(newFilename));
            if (s)
                return [...prev];
            return [...prev, ...findImports(newFilename, options)];
        }, dataImports);
        return uniqueArray(items);
    }
    else {
        return uniqueArray(dataImports);
    }
}
exports.findImports = findImports;
exports.default = {
    findImports,
    findImportsByName: find_by_name_1.findImportsByName,
    findImportsByNameAsync: find_by_name_1.findImportsByNameAsync
};
