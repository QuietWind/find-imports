import { PathOption } from "./file";
export interface ImportItem {
    file: string;
    name: string;
    modules: string[];
    count: number;
}
export interface Options extends PathOption {
}
export declare const defaultOptions: Options;
export declare function findImports(patterns: string, options?: PathOption, filterNames?: string[]): ImportItem[];
export default findImports;
