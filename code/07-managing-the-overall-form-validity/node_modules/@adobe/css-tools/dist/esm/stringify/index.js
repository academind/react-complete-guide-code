import Compiler from './compiler';
export default (node, options) => {
    const compiler = new Compiler(options || {});
    return compiler.compile(node);
};
