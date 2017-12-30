import * as assert from "assert";
import * as path from "path";
import f, { findImports } from "./../src/index";

describe("findImports", () => {
  describe("#findImports fixture", () => {
    const strs = f.findImportsByName(
      path.resolve(__dirname, "./files/fixture.js")
    );

    it("find all require files", () => {
      assert.deepEqual(strs, [
        "foo",
        "vue/dist/vue",
        "wow",
        "baby",
        "./async-module"
      ]);
    });
  });

  describe("#findImports fixture-export", () => {
    const strs = f.findImportsByName(
      path.resolve(__dirname, "./files/fixture-export.js")
    );

    it("find all require files", () => {
      assert.deepEqual(strs, ["./util", "./temporary", "./persistent", "all"]);
    });
  });

  describe("#findImports App.tsx", () => {
    const strs = f.findImportsByName(
      path.resolve(__dirname, "./files/App.tsx")
    );

    it("find all require files", () => {
      assert.deepEqual(strs, [
        "react",
        "react-router-dom",
        "./Todo",
        "./NormalTodo",
        "./Home",
        "./App.css",
        "./logo.svg"
      ]);
    });
  });

  describe("#findImports App.tsx and child", () => {
    const strs = findImports(path.resolve(__dirname, "./files/App.tsx"), {
      findChild: true,
      log: false,
      baseUrl: [process.cwd(), process.cwd() + "node_modules"]
    });

    it("find all require files", () => {
      assert.deepEqual(strs, [
        "react",
        "react-router-dom",
        "test/files/Todo.tsx",
        "test/files/NormalTodo.tsx",
        "test/files/Home.tsx",
        "react-addons-perf",
        "test/files/TodoItem.tsx",
        "immutable",
        "test/files/data.ts"
      ]);
    });
  });
});
