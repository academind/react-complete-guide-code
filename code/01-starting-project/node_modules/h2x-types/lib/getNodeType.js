"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var HTMLNodeTypes = _interopRequireWildcard(require("./HTMLNodeTypes"));

var _symbols = require("./symbols");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const getHTMLNodeType = node => {
  const originalNode = node.originalNode;
  if (!originalNode) return null;
  if (originalNode.constructor.name === 'Attr') return 'HTMLAttribute';

  switch (originalNode.nodeType) {
    case HTMLNodeTypes.TEXT_NODE:
      return 'HTMLText';

    case HTMLNodeTypes.ELEMENT_NODE:
    case HTMLNodeTypes.FRAGMENT_NODE:
      return 'HTMLElement';

    case HTMLNodeTypes.COMMENT_NODE:
      return 'HTMLComment';

    default:
      return null;
  }
};

function getNodeType(node) {
  if (node.constructor[_symbols.NODE_TYPE]) return node.constructor[_symbols.NODE_TYPE];
  const htmlNodeType = getHTMLNodeType(node);
  if (htmlNodeType) return htmlNodeType;
  throw new Error(`Unknown node ${node}`);
}

var _default = getNodeType;
exports.default = _default;