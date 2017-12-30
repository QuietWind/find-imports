import * as babylon from "babylon";
import { default as traverse } from "babel-traverse";
import * as ts from "typescript";

/**
 *
 * @param ts_str typescript string
 * @param filename filename
 */
function transferTsToJs(ts_str: string, filename: string = "demo.ts"): string {
  const tsConfig: ts.CompilerOptions = {
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

export interface TFindImportsByStrOptions {
  isTS: boolean;
  filename: string;
}

export function findImportsByStr(
  str: string,
  options: TFindImportsByStrOptions
): string[] {
  const strImports: string[] = [];
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

  traverse(astTree, {
    enter(path: any) {
      if (path.node.type === "CallExpression") {
        const callee = path.get("callee");
        const isDynamicImport = callee.isImport(); // dynamic import
        if (callee.isIdentifier({ name: "require" }) || isDynamicImport) {
          const arg = path.node.arguments[0];
          if (ARG_TYPES.find(t => t === arg.type)) {
            strImports.push(arg.value);
          }
        }
      } else if (NODE_TYPES.find(t => t === path.node.type)) {
        const { source } = path.node;
        if (source && source.value) {
          strImports.push(source.value);
        }
      }
    }
  });

  return strImports;
}
