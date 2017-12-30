import { findImports } from "qw-find-imports";

const strs2 = findImports(
  "XXXXXXXX/index.js",
  {
    findChild: true,
    log: false,
    baseUrl: ["XXXXXXXX"]
  }
);

console.log(JSON.stringify(strs2, null, 2));
