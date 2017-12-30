"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const babylon = require("babylon");
const babel_traverse_1 = require("babel-traverse");
const ts = require("typescript");
/**
 *
 * @param ts_str typescript string
 * @param filename filename
 */
function transferTsToJs(ts_str, filename = "demo.ts") {
    const tsConfig = {
        jsx: ts.JsxEmit.Preserve,
        target: ts.ScriptTarget.ES2015,
        sourceMap: false,
        module: ts.ModuleKind.CommonJS
    };
    return ts.transpileModule(ts_str, {
        fileName: filename,
        compilerOptions: tsConfig
    }).outputText;
}
const ARG_TYPES = ["StringLiteral", "Literal"];
const NODE_TYPES = [
    "ImportDeclaration",
    "ExportNamedDeclaration",
    "ExportAllDeclaration"
];
function findImportsByStr(str, options) {
    const strImports = [];
    const parseStr = options.isTS ? transferTsToJs(str, options.filename) : str;
    const astTree = babylon.parse(parseStr, {
        sourceType: "module",
        allowImportExportEverywhere: true,
        plugins: [
            "estree",
            "decorators",
            "classProperties",
            "jsx",
            "flow",
            "dynamicImport",
            "objectRestSpread",
            "exportExtensions"
        ]
    });
    babel_traverse_1.default(astTree, {
        enter(path) {
            if (path.node.type === "CallExpression") {
                const callee = path.get("callee");
                const isDynamicImport = callee.isImport(); // dynamic import
                if (callee.isIdentifier({ name: "require" }) || isDynamicImport) {
                    const arg = path.node.arguments[0];
                    if (ARG_TYPES.find(t => t === arg.type)) {
                        strImports.push(arg.value);
                    }
                }
            }
            else if (NODE_TYPES.find(t => t === path.node.type)) {
                const { source } = path.node;
                if (source && source.value) {
                    strImports.push(source.value);
                }
            }
        }
    });
    return strImports;
}
exports.findImportsByStr = findImportsByStr;
