"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _symbols = require("./symbols");

var _fromHtmlAttribute = _interopRequireDefault(require("./fromHtmlAttribute"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const HTML_ELEMENT_PROPERTIES = ['tagName', 'ownerDocument', 'textContent'];

class HTMLElementNode {
  constructor(originalNode) {
    this.originalNode = originalNode;
    this.childNodes = originalNode.childNodes ? Array.from(originalNode.childNodes).map(childNode => fromHtmlElement(childNode)) : null;
    this.attributes = originalNode.attributes ? Array.from(originalNode.attributes).map(attribute => (0, _fromHtmlAttribute.default)(attribute)) : null;
    HTML_ELEMENT_PROPERTIES.forEach(property => {
      this[property] = originalNode[property];
    });
  }

}

_defineProperty(HTMLElementNode, _symbols.VISITOR_KEYS, ['childNodes', 'attributes']);

function fromHtmlElement(htmlNode) {
  return new HTMLElementNode(htmlNode);
}

var _default = fromHtmlElement;
exports.default = _default;