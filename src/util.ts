import * as colors from "colors";

export function msgError(text: string) {
  console.log(colors.red(text));
}

export function msgSuccess(text: string) {
  console.log(colors.green(text));
}
