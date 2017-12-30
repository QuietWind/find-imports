import * as fs from "fs";
import * as store from "data-store";
import { digest, findModulePath } from "./file";
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

export function findImports(
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

  findStore.set(key, [...dataImports]);

  if (log) {
    logStrings(dataImports);
  }

  if (findChild) {
    const items = dataImports.reduce((prev, next) => {
      const newFilename = findModulePath(filename, next, {
        baseUrl
      });

      if (!newFilename) return [...prev];
      if (typeof newFilename !== "string") {
        console.log(newFilename, filename, next);
      }

      const s = findStore.get(filenamekey(newFilename));
      if (s) return [...prev];

      return [...prev, ...findImports(newFilename, options)];
    }, dataImports);

    return uniqueArray(items);
  } else {
    return uniqueArray(dataImports);
  }
}

export default {
  findImports,
  findImportsByName,
  findImportsByNameAsync
};
