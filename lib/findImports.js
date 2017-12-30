"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const glob_1 = require("glob");
const babylon = require("babylon");
const babel_traverse_1 = require("babel-traverse");
const store = require("store");
const ts = require("typescript");
const file_1 = require("./file");
const ignoreReg = /(\.d\.ts|\.png|\.jpg|\.json|\.svg|\.scss|\.css|\.less)$/i;
const tsConfig = {
    jsx: ts.JsxEmit.Preserve,
    target: ts.ScriptTarget.ES2015,
    sourceMap: false,
    module: ts.ModuleKind.CommonJS
};
let i = 0;
/**
 *
 * @param codeStr 代码str
 */
function findModules(codeStr, filename) {
    // i++;
    const saveData = store.get(filename);
    if (saveData) {
        return saveData;
    }
    const modules = [];
    try {
        const estree = babylon.parse(codeStr, {
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
        const strings = [];
        const expressions = [];
        const src = "./";
        if (i === 0) {
            fs.writeFileSync("./ast.json", JSON.stringify(estree, null, 2));
            i++;
        }
        babel_traverse_1.default(estree, {
            enter(path) {
                if (path.node.type === "CallExpression") {
                    const callee = path.get("callee");
                    const isDynamicImport = callee.isImport(); // dynamic import
                    if (callee.isIdentifier({ name: "require" }) || isDynamicImport) {
                        const arg = path.node.arguments[0];
                        if (arg.type === "StringLiteral" || arg.type === "Literal") {
                            strings.push(arg.value);
                        }
                        else {
                            expressions.push(src.slice(arg.start, arg.end));
                        }
                    }
                }
                else if (path.node.type === "ImportDeclaration" ||
                    path.node.type === "ExportNamedDeclaration" ||
                    path.node.type === "ExportAllDeclaration") {
                    const { source } = path.node;
                    if (source && source.value) {
                        strings.push(source.value);
                    }
                }
            }
        });
        return strings;
    }
    catch (err) {
        console.log(err);
        return modules;
    }
}
const defaultItem = {
    file: "",
    name: "",
    modules: [],
    count: 0
};
function findFileModules(file, item = Object.assign({}, defaultItem, { modules: [] }), options) {
    if (ignoreReg.test(file) || !fs.existsSync(file)) {
        return null;
    }
    let str = "";
    try {
        str = fs.readFileSync(file, "utf8");
    }
    catch (err) {
        console.log(file);
        console.log(err);
        process.exit(0);
    }
    const filename = path.resolve(process.cwd(), file);
    if (!item.file) {
        item.file = filename;
        item.name = path.basename(filename, path.extname(filename));
    }
    if (/tsx?$/i.test(file)) {
        str = ts.transpileModule(str, {
            fileName: filename,
            compilerOptions: tsConfig
        }).outputText;
    }
    function addModuleToImport(moduleFile) {
        const modulePath = file_1.findModulePath(file, moduleFile, options) || moduleFile;
        if (item.modules.findIndex(ele => ele === modulePath) === -1) {
            item.modules.push(modulePath);
            item.count += 1;
            findFileModules(modulePath, item, options);
        }
    }
    const modules = findModules(str, filename);
    modules.forEach(ele => {
        addModuleToImport(ele);
    });
    return item;
}
exports.defaultOptions = {
    baseUrl: [process.cwd(), `${process.cwd()}/node_modules`],
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    node_modules: false
};
function findImports(patterns, options = exports.defaultOptions, filterNames = []) {
    const Imports = [];
    const files = glob_1.sync(patterns);
    if (files.length === 0) {
        console.log(`${patterns} error, cannot find any file.`);
        process.exit(0);
    }
    files.forEach(function (file) {
        const name = path.basename(file, path.extname(file));
        if (filterNames.length > 0 && filterNames.indexOf(name) === -1) {
            return;
        }
        const item = findFileModules(file, undefined, options);
        if (item !== null) {
            Imports.push(item);
        }
    });
    fs.writeFileSync(`${process.cwd()}/imports.json`, JSON.stringify(Imports, null, 4));
    return Imports;
}
exports.findImports = findImports;
exports.default = findImports;
findImports("/Users/chenhuan/www/65Page/src/src-react/pages/pay3.0/index.js", {
    baseUrl: [
        "/Users/chenhuan/www/65Page/src",
        `/Users/chenhuan/www/65Page/node_modules`
    ],
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    node_modules: true
}, []);
