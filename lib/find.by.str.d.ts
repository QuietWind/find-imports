export interface TFindImportsByStrOptions {
    isTS: boolean;
    filename: string;
}
export declare function findImportsByStr(str: string, options: TFindImportsByStrOptions): string[];
