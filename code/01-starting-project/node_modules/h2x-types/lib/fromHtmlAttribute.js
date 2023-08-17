"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _symbols = require("./symbols");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const HTML_ELEMENT_PROPERTIES = ['name', 'value'];

class HTMLAttributeNode {
  constructor(originalNode) {
    this.originalNode = originalNode;
    HTML_ELEMENT_PROPERTIES.forEach(property => {
      this[property] = originalNode[property];
    });
  }

}

_defineProperty(HTMLAttributeNode, _symbols.VISITOR_KEYS, null);

function fromHtmlAttribute(attribute) {
  return new HTMLAttributeNode(attribute);
}

var _default = fromHtmlAttribute;
exports.default = _default;