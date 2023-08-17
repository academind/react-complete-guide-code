"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _symbols = require("./symbols");

function getNodeVisitorKeys(node) {
  return node.constructor[_symbols.VISITOR_KEYS] || null;
}

var _default = getNodeVisitorKeys;
exports.default = _default;