import CssParseError from './CssParseError';
import Position from './CssPosition';
export declare enum CssTypes {
    stylesheet = "stylesheet",
    rule = "rule",
    declaration = "declaration",
    comment = "comment",
    container = "container",
    charset = "charset",
    document = "document",
    customMedia = "custom-media",
    fontFace = "font-face",
    host = "host",
    import = "import",
    keyframes = "keyframes",
    keyframe = "keyframe",
    layer = "layer",
    media = "media",
    namespace = "namespace",
    page = "page",
    supports = "supports"
}
export type CssCommonAST = {
    type: CssTypes;
};
export type CssCommonPositionAST = CssCommonAST & {
    position?: Position;
    parent?: unknown;
};
export type CssStylesheetAST = CssCommonAST & {
    type: CssTypes.stylesheet;
    stylesheet: {
        source?: string;
        rules: Array<CssAtRuleAST>;
        parsingErrors?: Array<CssParseError>;
    };
};
export type CssRuleAST = CssCommonPositionAST & {
    type: CssTypes.rule;
    selectors: Array<string>;
    declarations: Array<CssDeclarationAST | CssCommentAST>;
};
export type CssDeclarationAST = CssCommonPositionAST & {
    type: CssTypes.declaration;
    property: string;
    value: string;
};
export type CssCommentAST = CssCommonPositionAST & {
    type: CssTypes.comment;
    comment: string;
};
export type CssContainerAST = CssCommonPositionAST & {
    type: CssTypes.container;
    container: string;
    rules: Array<CssAtRuleAST>;
};
export type CssCharsetAST = CssCommonPositionAST & {
    type: CssTypes.charset;
    charset: string;
};
export type CssCustomMediaAST = CssCommonPositionAST & {
    type: CssTypes.customMedia;
    name: string;
    media: string;
};
export type CssDocumentAST = CssCommonPositionAST & {
    type: CssTypes.document;
    document: string;
    vendor?: string;
    rules: Array<CssAtRuleAST>;
};
export type CssFontFaceAST = CssCommonPositionAST & {
    type: CssTypes.fontFace;
    declarations: Array<CssDeclarationAST | CssCommentAST>;
};
export type CssHostAST = CssCommonPositionAST & {
    type: CssTypes.host;
    rules: Array<CssAtRuleAST>;
};
export type CssImportAST = CssCommonPositionAST & {
    type: CssTypes.import;
    import: string;
};
export type CssKeyframesAST = CssCommonPositionAST & {
    type: CssTypes.keyframes;
    name: string;
    vendor?: string;
    keyframes: Array<CssKeyframeAST | CssCommentAST>;
};
export type CssKeyframeAST = CssCommonPositionAST & {
    type: CssTypes.keyframe;
    values: Array<string>;
    declarations: Array<CssDeclarationAST | CssCommentAST>;
};
export type CssLayerAST = CssCommonPositionAST & {
    type: CssTypes.layer;
    layer: string;
    rules?: Array<CssAtRuleAST>;
};
export type CssMediaAST = CssCommonPositionAST & {
    type: CssTypes.media;
    media: string;
    rules: Array<CssAtRuleAST>;
};
export type CssNamespaceAST = CssCommonPositionAST & {
    type: CssTypes.namespace;
    namespace: string;
};
export type CssPageAST = CssCommonPositionAST & {
    type: CssTypes.page;
    selectors: Array<string>;
    declarations: Array<CssDeclarationAST | CssCommentAST>;
};
export type CssSupportsAST = CssCommonPositionAST & {
    type: CssTypes.supports;
    supports: string;
    rules: Array<CssAtRuleAST>;
};
export type CssAtRuleAST = CssRuleAST | CssCommentAST | CssContainerAST | CssCharsetAST | CssCustomMediaAST | CssDocumentAST | CssFontFaceAST | CssHostAST | CssImportAST | CssKeyframesAST | CssLayerAST | CssMediaAST | CssNamespaceAST | CssPageAST | CssSupportsAST;
export type CssAllNodesAST = CssAtRuleAST | CssStylesheetAST | CssDeclarationAST | CssKeyframeAST;
