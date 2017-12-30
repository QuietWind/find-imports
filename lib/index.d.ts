export interface TFindImportsOptions {
    findChild: boolean;
    log: boolean;
    baseUrl: string[];
}
export declare function findImports(filename: string, options: TFindImportsOptions): string[];
declare const _default: {
    findImports: (filename: string, options: TFindImportsOptions) => string[];
    findImportsByName: (filename: string) => string[];
    findImportsByNameAsync: (filename: string) => Promise<string[]>;
};
export default _default;
