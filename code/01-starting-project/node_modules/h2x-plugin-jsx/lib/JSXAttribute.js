"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _h2xTypes = require("h2x-types");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class JSXAttribute {
  constructor() {
    _defineProperty(this, "name", null);

    _defineProperty(this, "value", null);

    _defineProperty(this, "literal", false);

    _defineProperty(this, "spread", false);
  }

}

_defineProperty(JSXAttribute, _h2xTypes.NODE_TYPE, 'JSXAttribute');

_defineProperty(JSXAttribute, _h2xTypes.VISITOR_KEYS, null);

var _default = JSXAttribute;
exports.default = _default;