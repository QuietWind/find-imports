# find-imports

Find  require and import dynamic-import files of JavaScript file by ast

## Feature

1. find imports by filename
1. support dynamic import
1. support files `js` `jsx` `ts` `tsx`
1. find imports files and child by entry file, eg: webpack entry


## Usage

Install package `npm install qw-find-imports`

``` ts

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

```