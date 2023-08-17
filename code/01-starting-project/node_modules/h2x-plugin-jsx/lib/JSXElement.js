"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _h2xTypes = require("h2x-types");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class JSXElement {
  constructor() {
    _defineProperty(this, "name", null);

    _defineProperty(this, "children", []);

    _defineProperty(this, "attributes", []);
  }

}

_defineProperty(JSXElement, _h2xTypes.NODE_TYPE, 'JSXElement');

_defineProperty(JSXElement, _h2xTypes.VISITOR_KEYS, ['children', 'attributes']);

var _default = JSXElement;
exports.default = _default;