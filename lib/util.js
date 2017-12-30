"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require("colors");
function msgError(text) {
    console.log(colors.red(text));
}
exports.msgError = msgError;
function msgSuccess(text) {
    console.log(colors.green(text));
}
exports.msgSuccess = msgSuccess;
