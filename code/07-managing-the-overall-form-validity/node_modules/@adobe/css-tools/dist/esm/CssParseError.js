export default class CssParseError extends Error {
    reason;
    filename;
    line;
    column;
    source;
    constructor(filename, msg, lineno, column, css) {
        super(filename + ':' + lineno + ':' + column + ': ' + msg);
        this.reason = msg;
        this.filename = filename;
        this.line = lineno;
        this.column = column;
        this.source = css;
    }
}
