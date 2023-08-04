import { CssAllNodesAST, CssCharsetAST, CssCommentAST, CssCommonPositionAST, CssContainerAST, CssCustomMediaAST, CssDeclarationAST, CssDocumentAST, CssFontFaceAST, CssHostAST, CssImportAST, CssKeyframeAST, CssKeyframesAST, CssLayerAST, CssMediaAST, CssNamespaceAST, CssPageAST, CssRuleAST, CssStylesheetAST, CssSupportsAST } from '../type';
declare class Compiler {
    level: number;
    indentation: string;
    compress: boolean;
    constructor(options?: {
        indent?: string;
        compress?: boolean;
    });
    emit(str: string, _position?: CssCommonPositionAST['position']): string;
    /**
     * Increase, decrease or return current indentation.
     */
    indent(level?: number): string;
    visit(node: CssAllNodesAST): string;
    mapVisit(nodes: Array<CssAllNodesAST>, delim?: string): string;
    compile(node: CssStylesheetAST): string;
    /**
     * Visit stylesheet node.
     */
    stylesheet(node: CssStylesheetAST): string;
    /**
     * Visit comment node.
     */
    comment(node: CssCommentAST): string;
    /**
     * Visit container node.
     */
    container(node: CssContainerAST): string;
    /**
     * Visit container node.
     */
    layer(node: CssLayerAST): string;
    /**
     * Visit import node.
     */
    import(node: CssImportAST): string;
    /**
     * Visit media node.
     */
    media(node: CssMediaAST): string;
    /**
     * Visit document node.
     */
    document(node: CssDocumentAST): string;
    /**
     * Visit charset node.
     */
    charset(node: CssCharsetAST): string;
    /**
     * Visit namespace node.
     */
    namespace(node: CssNamespaceAST): string;
    /**
     * Visit supports node.
     */
    supports(node: CssSupportsAST): string;
    /**
     * Visit keyframes node.
     */
    keyframes(node: CssKeyframesAST): string;
    /**
     * Visit keyframe node.
     */
    keyframe(node: CssKeyframeAST): string;
    /**
     * Visit page node.
     */
    page(node: CssPageAST): string;
    /**
     * Visit font-face node.
     */
    fontFace(node: CssFontFaceAST): string;
    /**
     * Visit host node.
     */
    host(node: CssHostAST): string;
    /**
     * Visit custom-media node.
     */
    customMedia(node: CssCustomMediaAST): string;
    /**
     * Visit rule node.
     */
    rule(node: CssRuleAST): string;
    /**
     * Visit declaration node.
     */
    declaration(node: CssDeclarationAST): string;
}
export default Compiler;
