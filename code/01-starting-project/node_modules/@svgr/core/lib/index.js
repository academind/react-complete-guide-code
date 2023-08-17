"use strict";

exports.__esModule = true;
var _exportNames = {
  emSize: true,
  expandProps: true,
  removeComments: true,
  removeDimensions: true,
  removeStyle: true,
  replaceAttrValues: true,
  stripAttribute: true,
  svgAttributes: true,
  svgProps: true,
  svgRef: true,
  titleProp: true,
  toReactNative: true,
  reactDomTemplate: true,
  reactNativeTemplate: true
};
exports.reactNativeTemplate = exports.reactDomTemplate = exports.toReactNative = exports.titleProp = exports.svgRef = exports.svgProps = exports.svgAttributes = exports.stripAttribute = exports.replaceAttrValues = exports.removeStyle = exports.removeDimensions = exports.removeComments = exports.expandProps = exports.emSize = exports.default = void 0;

var _convert = _interopRequireDefault(require("./convert"));

exports.default = _convert.default;

var _config = require("./config");

Object.keys(_config).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _config[key];
});

var _util = require("./util");

Object.keys(_util).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _util[key];
});

var _emSize = _interopRequireDefault(require("./h2x/emSize"));

exports.emSize = _emSize.default;

var _expandProps = _interopRequireDefault(require("./h2x/expandProps"));

exports.expandProps = _expandProps.default;

var _removeComments = _interopRequireDefault(require("./h2x/removeComments"));

exports.removeComments = _removeComments.default;

var _removeDimensions = _interopRequireDefault(require("./h2x/removeDimensions"));

exports.removeDimensions = _removeDimensions.default;

var _removeStyle = _interopRequireDefault(require("./h2x/removeStyle"));

exports.removeStyle = _removeStyle.default;

var _replaceAttrValues = _interopRequireDefault(require("./h2x/replaceAttrValues"));

exports.replaceAttrValues = _replaceAttrValues.default;

var _stripAttribute = _interopRequireDefault(require("./h2x/stripAttribute"));

exports.stripAttribute = _stripAttribute.default;

var _svgAttributes = _interopRequireDefault(require("./h2x/svgAttributes"));

exports.svgAttributes = _svgAttributes.default;

var _svgProps = _interopRequireDefault(require("./h2x/svgProps"));

exports.svgProps = _svgProps.default;

var _svgRef = _interopRequireDefault(require("./h2x/svgRef"));

exports.svgRef = _svgRef.default;

var _titleProp = _interopRequireDefault(require("./h2x/titleProp"));

exports.titleProp = _titleProp.default;

var _toReactNative = _interopRequireDefault(require("./h2x/toReactNative"));

exports.toReactNative = _toReactNative.default;

var _reactDomTemplate = _interopRequireDefault(require("./templates/reactDomTemplate"));

exports.reactDomTemplate = _reactDomTemplate.default;

var _reactNativeTemplate = _interopRequireDefault(require("./templates/reactNativeTemplate"));

exports.reactNativeTemplate = _reactNativeTemplate.default;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }