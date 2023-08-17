"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsdom = require("jsdom");

var _h2xTypes = require("h2x-types");

/* eslint-disable no-restricted-syntax */
function parse(code) {
  return (0, _h2xTypes.fromHtmlElement)(_jsdom.JSDOM.fragment(code));
}

var _default = parse;
exports.default = _default;