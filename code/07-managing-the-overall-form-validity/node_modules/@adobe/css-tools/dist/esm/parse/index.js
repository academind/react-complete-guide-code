import CssParseError from '../CssParseError';
import Position from '../CssPosition';
import { CssTypes, } from '../type';
// http://www.w3.org/TR/CSS21/grammar.html
// https://github.com/visionmedia/css-parse/pull/49#issuecomment-30088027
const commentre = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
export const parse = (css, options) => {
    options = options || {};
    /**
     * Positional.
     */
    let lineno = 1;
    let column = 1;
    /**
     * Update lineno and column based on `str`.
     */
    function updatePosition(str) {
        const lines = str.match(/\n/g);
        if (lines)
            lineno += lines.length;
        const i = str.lastIndexOf('\n');
        column = ~i ? str.length - i : column + str.length;
    }
    /**
     * Mark position and patch `node.position`.
     */
    function position() {
        const start = { line: lineno, column: column };
        return function (node) {
            node.position = new Position(start, { line: lineno, column: column }, options?.source || '');
            whitespace();
            return node;
        };
    }
    /**
     * Error `msg`.
     */
    const errorsList = [];
    function error(msg) {
        const err = new CssParseError(options?.source || '', msg, lineno, column, css);
        if (options?.silent) {
            errorsList.push(err);
        }
        else {
            throw err;
        }
    }
    /**
     * Parse stylesheet.
     */
    function stylesheet() {
        const rulesList = rules();
        const result = {
            type: CssTypes.stylesheet,
            stylesheet: {
                source: options?.source,
                rules: rulesList,
                parsingErrors: errorsList,
            },
        };
        return result;
    }
    /**
     * Opening brace.
     */
    function open() {
        return match(/^{\s*/);
    }
    /**
     * Closing brace.
     */
    function close() {
        return match(/^}/);
    }
    /**
     * Parse ruleset.
     */
    function rules() {
        let node;
        const rules = [];
        whitespace();
        comments(rules);
        while (css.length && css.charAt(0) !== '}' && (node = atrule() || rule())) {
            if (node) {
                rules.push(node);
                comments(rules);
            }
        }
        return rules;
    }
    /**
     * Match `re` and return captures.
     */
    function match(re) {
        const m = re.exec(css);
        if (!m) {
            return;
        }
        const str = m[0];
        updatePosition(str);
        css = css.slice(str.length);
        return m;
    }
    /**
     * Parse whitespace.
     */
    function whitespace() {
        match(/^\s*/);
    }
    /**
     * Parse comments;
     */
    function comments(rules) {
        let c;
        rules = rules || [];
        while ((c = comment())) {
            if (c) {
                rules.push(c);
            }
        }
        return rules;
    }
    /**
     * Parse comment.
     */
    function comment() {
        const pos = position();
        if ('/' !== css.charAt(0) || '*' !== css.charAt(1)) {
            return;
        }
        const m = match(/^\/\*[^]*?\*\//);
        if (!m) {
            return error('End of comment missing');
        }
        return pos({
            type: CssTypes.comment,
            comment: m[0].slice(2, -2),
        });
    }
    /**
     * Parse selector.
     */
    function selector() {
        const m = match(/^([^{]+)/);
        if (!m) {
            return;
        }
        // remove comment in selector; [^] is equivalent to [.\n\r]
        const res = trim(m[0]).replace(/\/\*[^]*?\*\//gm, '');
        // Optimisation: If there is no ',' no need to split or post-process (this is less costly)
        if (res.indexOf(',') === -1) {
            return [res];
        }
        return (res
            /**
             * replace ',' by \u200C for data selector (div[data-lang="fr,de,us"])
             * replace ',' by \u200C for nthChild and other selector (div:nth-child(2,3,4))
             *
             * Examples:
             * div[data-lang="fr,\"de,us"]
             * div[data-lang='fr,\'de,us']
             * div:matches(.toto, .titi:matches(.toto, .titi))
             *
             * Regex logic:
             *  ("|')(?:\\\1|.)*?\1 => Handle the " and '
             *  \(.*?\)  => Handle the ()
             *
             * Optimization 1:
             * No greedy capture (see docs about the difference between .* and .*?)
             *
             * Optimization 2:
             * ("|')(?:\\\1|.)*?\1 this use reference to capture group, it work faster.
             */
            .replace(/("|')(?:\\\1|.)*?\1|\(.*?\)/g, m => m.replace(/,/g, '\u200C'))
            // Split the selector by ','
            .split(',')
            // Replace back \u200C by ','
            .map(s => {
            return trim(s.replace(/\u200C/g, ','));
        }));
    }
    /**
     * Parse declaration.
     */
    function declaration() {
        const pos = position();
        // prop
        const propMatch = match(/^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/);
        if (!propMatch) {
            return;
        }
        const propValue = trim(propMatch[0]);
        // :
        if (!match(/^:\s*/)) {
            return error("property missing ':'");
        }
        // val
        const val = match(/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/);
        const ret = pos({
            type: CssTypes.declaration,
            property: propValue.replace(commentre, ''),
            value: val ? trim(val[0]).replace(commentre, '') : '',
        });
        // ;
        match(/^[;\s]*/);
        return ret;
    }
    /**
     * Parse declarations.
     */
    function declarations() {
        const decls = [];
        if (!open()) {
            return error("missing '{'");
        }
        comments(decls);
        // declarations
        let decl;
        while ((decl = declaration())) {
            if (decl) {
                decls.push(decl);
                comments(decls);
            }
        }
        if (!close()) {
            return error("missing '}'");
        }
        return decls;
    }
    /**
     * Parse keyframe.
     */
    function keyframe() {
        let m;
        const vals = [];
        const pos = position();
        while ((m = match(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/))) {
            vals.push(m[1]);
            match(/^,\s*/);
        }
        if (!vals.length) {
            return;
        }
        return pos({
            type: CssTypes.keyframe,
            values: vals,
            declarations: declarations() || [],
        });
    }
    /**
     * Parse keyframes.
     */
    function atkeyframes() {
        const pos = position();
        const m1 = match(/^@([-\w]+)?keyframes\s*/);
        if (!m1) {
            return;
        }
        const vendor = m1[1];
        // identifier
        const m2 = match(/^([-\w]+)\s*/);
        if (!m2) {
            return error('@keyframes missing name');
        }
        const name = m2[1];
        if (!open()) {
            return error("@keyframes missing '{'");
        }
        let frame;
        let frames = comments();
        while ((frame = keyframe())) {
            frames.push(frame);
            frames = frames.concat(comments());
        }
        if (!close()) {
            return error("@keyframes missing '}'");
        }
        return pos({
            type: CssTypes.keyframes,
            name: name,
            vendor: vendor,
            keyframes: frames,
        });
    }
    /**
     * Parse supports.
     */
    function atsupports() {
        const pos = position();
        const m = match(/^@supports *([^{]+)/);
        if (!m) {
            return;
        }
        const supports = trim(m[1]);
        if (!open()) {
            return error("@supports missing '{'");
        }
        const style = comments().concat(rules());
        if (!close()) {
            return error("@supports missing '}'");
        }
        return pos({
            type: CssTypes.supports,
            supports: supports,
            rules: style,
        });
    }
    /**
     * Parse host.
     */
    function athost() {
        const pos = position();
        const m = match(/^@host\s*/);
        if (!m) {
            return;
        }
        if (!open()) {
            return error("@host missing '{'");
        }
        const style = comments().concat(rules());
        if (!close()) {
            return error("@host missing '}'");
        }
        return pos({
            type: CssTypes.host,
            rules: style,
        });
    }
    /**
     * Parse container.
     */
    function atcontainer() {
        const pos = position();
        const m = match(/^@container *([^{]+)/);
        if (!m) {
            return;
        }
        const container = trim(m[1]);
        if (!open()) {
            return error("@container missing '{'");
        }
        const style = comments().concat(rules());
        if (!close()) {
            return error("@container missing '}'");
        }
        return pos({
            type: CssTypes.container,
            container: container,
            rules: style,
        });
    }
    /**
     * Parse container.
     */
    function atlayer() {
        const pos = position();
        const m = match(/^@layer *([^{;@]+)/);
        if (!m) {
            return;
        }
        const layer = trim(m[1]);
        if (!open()) {
            match(/^[;\s]*/);
            return pos({
                type: CssTypes.layer,
                layer: layer,
            });
        }
        const style = comments().concat(rules());
        if (!close()) {
            return error("@layer missing '}'");
        }
        return pos({
            type: CssTypes.layer,
            layer: layer,
            rules: style,
        });
    }
    /**
     * Parse media.
     */
    function atmedia() {
        const pos = position();
        const m = match(/^@media *([^{]+)/);
        if (!m) {
            return;
        }
        const media = trim(m[1]);
        if (!open()) {
            return error("@media missing '{'");
        }
        const style = comments().concat(rules());
        if (!close()) {
            return error("@media missing '}'");
        }
        return pos({
            type: CssTypes.media,
            media: media,
            rules: style,
        });
    }
    /**
     * Parse custom-media.
     */
    function atcustommedia() {
        const pos = position();
        const m = match(/^@custom-media\s+(--[^\s]+)\s*([^{;]+);/);
        if (!m) {
            return;
        }
        return pos({
            type: CssTypes.customMedia,
            name: trim(m[1]),
            media: trim(m[2]),
        });
    }
    /**
     * Parse paged media.
     */
    function atpage() {
        const pos = position();
        const m = match(/^@page */);
        if (!m) {
            return;
        }
        const sel = selector() || [];
        if (!open()) {
            return error("@page missing '{'");
        }
        let decls = comments();
        // declarations
        let decl;
        while ((decl = declaration())) {
            decls.push(decl);
            decls = decls.concat(comments());
        }
        if (!close()) {
            return error("@page missing '}'");
        }
        return pos({
            type: CssTypes.page,
            selectors: sel,
            declarations: decls,
        });
    }
    /**
     * Parse document.
     */
    function atdocument() {
        const pos = position();
        const m = match(/^@([-\w]+)?document *([^{]+)/);
        if (!m) {
            return;
        }
        const vendor = trim(m[1]);
        const doc = trim(m[2]);
        if (!open()) {
            return error("@document missing '{'");
        }
        const style = comments().concat(rules());
        if (!close()) {
            return error("@document missing '}'");
        }
        return pos({
            type: CssTypes.document,
            document: doc,
            vendor: vendor,
            rules: style,
        });
    }
    /**
     * Parse font-face.
     */
    function atfontface() {
        const pos = position();
        const m = match(/^@font-face\s*/);
        if (!m) {
            return;
        }
        if (!open()) {
            return error("@font-face missing '{'");
        }
        let decls = comments();
        // declarations
        let decl;
        while ((decl = declaration())) {
            decls.push(decl);
            decls = decls.concat(comments());
        }
        if (!close()) {
            return error("@font-face missing '}'");
        }
        return pos({
            type: CssTypes.fontFace,
            declarations: decls,
        });
    }
    /**
     * Parse import
     */
    const atimport = _compileAtrule('import');
    /**
     * Parse charset
     */
    const atcharset = _compileAtrule('charset');
    /**
     * Parse namespace
     */
    const atnamespace = _compileAtrule('namespace');
    /**
     * Parse non-block at-rules
     */
    function _compileAtrule(name) {
        const re = new RegExp('^@' +
            name +
            '\\s*((:?[^;\'"]|"(?:\\\\"|[^"])*?"|\'(?:\\\\\'|[^\'])*?\')+);');
        // ^@import\s*([^;"']|("|')(?:\\\2|.)*?\2)+;
        return function () {
            const pos = position();
            const m = match(re);
            if (!m) {
                return;
            }
            const ret = { type: name };
            ret[name] = m[1].trim();
            return pos(ret);
        };
    }
    /**
     * Parse at rule.
     */
    function atrule() {
        if (css[0] !== '@') {
            return;
        }
        return (atkeyframes() ||
            atmedia() ||
            atcustommedia() ||
            atsupports() ||
            atimport() ||
            atcharset() ||
            atnamespace() ||
            atdocument() ||
            atpage() ||
            athost() ||
            atfontface() ||
            atcontainer() ||
            atlayer());
    }
    /**
     * Parse rule.
     */
    function rule() {
        const pos = position();
        const sel = selector();
        if (!sel) {
            return error('selector missing');
        }
        comments();
        return pos({
            type: CssTypes.rule,
            selectors: sel,
            declarations: declarations() || [],
        });
    }
    return addParent(stylesheet());
};
/**
 * Trim `str`.
 */
function trim(str) {
    return str ? str.trim() : '';
}
/**
 * Adds non-enumerable parent node reference to each node.
 */
function addParent(obj, parent) {
    const isNode = obj && typeof obj.type === 'string';
    const childParent = isNode ? obj : parent;
    for (const k in obj) {
        const value = obj[k];
        if (Array.isArray(value)) {
            value.forEach(v => {
                addParent(v, childParent);
            });
        }
        else if (value && typeof value === 'object') {
            addParent(value, childParent);
        }
    }
    if (isNode) {
        Object.defineProperty(obj, 'parent', {
            configurable: true,
            writable: true,
            enumerable: false,
            value: parent || null,
        });
    }
    return obj;
}
export default parse;
