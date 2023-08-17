"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _h2xTypes = require("h2x-types");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class JSXText {
  constructor() {
    _defineProperty(this, "text", null);
  }

}

_defineProperty(JSXText, _h2xTypes.NODE_TYPE, 'JSXText');

_defineProperty(JSXText, _h2xTypes.VISITOR_KEYS, null);

var _default = JSXText;
exports.default = _default;