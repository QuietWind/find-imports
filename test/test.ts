import { findImports } from "qw-find-imports";


const strs2 = findImports(
  "XXXXXXXXXsrc-react/pages/pay3.0/index.js",
  {
    findChild: true,
    log: false,
    baseUrl: ["XXXXXXXXX"]
  }
);

console.log(JSON.stringify(strs2, null, 2));
