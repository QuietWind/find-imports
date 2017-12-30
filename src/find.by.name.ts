import * as fs from "fs";
import * as path from "path";
import { findImportsByStr } from "./find.by.str";

const r = (str: string, filename: string): string[] => {
  const ext = path.extname(filename);
  const options = {
    isTS: /\.tsx?$/i.test(ext),
    filename
  };

  return findImportsByStr(str, options);
};

export function findImportsByName(filename: string): string[] {
  const data_str = fs.readFileSync(filename, "utf8");

  return r(data_str, filename);
}

export function findImportsByNameAsync(filename: string): Promise<string[]> {
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
