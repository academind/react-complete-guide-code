"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformJsx;
Object.defineProperty(exports, "JSXElement", {
  enumerable: true,
  get: function get() {
    return _JSXElement.default;
  }
});
Object.defineProperty(exports, "JSXAttribute", {
  enumerable: true,
  get: function get() {
    return _JSXAttribute.default;
  }
});
Object.defineProperty(exports, "JSXComment", {
  enumerable: true,
  get: function get() {
    return _JSXComment.default;
  }
});
Object.defineProperty(exports, "JSXText", {
  enumerable: true,
  get: function get() {
    return _JSXText.default;
  }
});
Object.defineProperty(exports, "JSXInterpolation", {
  enumerable: true,
  get: function get() {
    return _JSXInterpolation.default;
  }
});

var _visitor = _interopRequireDefault(require("./visitor"));

var _generator = _interopRequireDefault(require("./generator"));

var _JSXElement = _interopRequireDefault(require("./JSXElement"));

var _JSXAttribute = _interopRequireDefault(require("./JSXAttribute"));

var _JSXComment = _interopRequireDefault(require("./JSXComment"));

var _JSXText = _interopRequireDefault(require("./JSXText"));

var _JSXInterpolation = _interopRequireDefault(require("./JSXInterpolation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformJsx() {
  return {
    visitor: _visitor.default,
    generator: _generator.default
  };
}