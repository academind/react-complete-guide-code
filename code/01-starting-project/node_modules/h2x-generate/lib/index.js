"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _h2xTraverse = _interopRequireDefault(require("h2x-traverse"));

var _Generator = _interopRequireDefault(require("./Generator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generate(ast, opts) {
  const generator = new _Generator.default();
  (0, _h2xTraverse.default)(ast, opts, generator);
  return generator.output;
}

var _default = generate;
exports.default = _default;