import { CssStylesheetAST } from '../type';
export declare const parse: (css: string, options?: {
    source?: string;
    silent?: boolean;
}) => CssStylesheetAST;
export default parse;
