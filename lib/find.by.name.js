"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const find_by_str_1 = require("./find.by.str");
const r = (str, filename) => {
    const ext = path.extname(filename);
    const options = {
        isTS: /\.tsx?$/i.test(ext),
        filename
    };
    return find_by_str_1.findImportsByStr(str, options);
};
function findImportsByName(filename) {
    const data_str = fs.readFileSync(filename, "utf8");
    return r(data_str, filename);
}
exports.findImportsByName = findImportsByName;
function findImportsByNameAsync(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, "utf8", (err, data_str) => {
            if (err) {
                console.log(err);
                reject([]);
                return;
            }
            resolve(r(data_str, filename));
        });
    });
}
exports.findImportsByNameAsync = findImportsByNameAsync;
