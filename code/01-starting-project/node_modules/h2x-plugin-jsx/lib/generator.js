"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _stringToObjectStyle = _interopRequireDefault(require("./stringToObjectStyle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const formatAttribute = jsxAttribute => {
  if (jsxAttribute.spread) return `{...${jsxAttribute.name}}`;
  if (jsxAttribute.literal) return `${jsxAttribute.name}={${jsxAttribute.value}}`;
  if (jsxAttribute.name === 'style') return `${jsxAttribute.name}={${JSON.stringify((0, _stringToObjectStyle.default)(jsxAttribute.value))}}`;
  return `${jsxAttribute.name}="${jsxAttribute.value}"`;
};

const formatElementOpen = jsxElement => {
  const attributes = jsxElement.attributes.map(formatAttribute).join(' ');
  const end = jsxElement.children.length === 0 ? ' />' : '>';
  return `<${jsxElement.name}${attributes.length ? ` ${attributes}` : ''}${end}`;
};

const formatElementClose = jsxElement => `</${jsxElement.name}>`;

const formatComment = jsxComment => `{/*${jsxComment.text.replace(/\*\//g, '* /')}*/}`;

const formatText = jsxText => jsxText.text.replace(/`/g, '\\`');

var _default = {
  JSXElement: {
    enter(path, generator) {
      generator.writeLine(formatElementOpen(path.node));
      generator.indent();
    },

    exit(path, generator) {
      generator.deindent();
      if (path.node.children.length !== 0) generator.writeLine(formatElementClose(path.node));
    }

  },
  JSXComment: {
    enter(path, generator) {
      generator.writeLine(formatComment(path.node));
    }

  },
  JSXText: {
    enter(path, generator) {
      const trimmedText = path.node.text.trim();
      if (trimmedText) generator.writeLine(`{\`${formatText(path.node)}\`}`);
    }

  },
  JSXInterpolation: {
    enter(path, generator) {
      generator.writeLine(`{${path.node.value}}`);
    }

  }
};
exports.default = _default;