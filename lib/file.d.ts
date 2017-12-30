export declare const extensions: string[];
export interface PathOption {
    baseUrl: string[];
}
export declare function digest(str: string): string;
export declare function genPath(root: string, filename: string): string | null;
/**
 * node_modules do not thinks
 * @param filename_rootfile
 * @param filename
 * @param options
 */
export declare function findModulePath(filename_rootfile: string, filename: string, options?: PathOption): string | null;
