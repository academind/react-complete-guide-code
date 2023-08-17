"use strict";

exports.__esModule = true;
exports.default = void 0;

var _svgo = _interopRequireDefault(require("./plugins/svgo"));

var _h2x = _interopRequireDefault(require("./plugins/h2x"));

var _prettier = _interopRequireDefault(require("./plugins/prettier"));

var _transform = _interopRequireDefault(require("./plugins/transform"));

var _util = require("./util");

var _config = require("./config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

async function convert(code, config = {}, state = {}) {
  config = _extends({}, _config.DEFAULT_CONFIG, config);
  state = (0, _util.expandState)(state);
  let result = code; // Remove null-byte character (copy/paste from Illustrator)

  result = String(result).replace('\0', '');
  result = await (0, _svgo.default)(result, config, state);
  result = await (0, _h2x.default)(result, config, state);
  result = await (0, _transform.default)(result, config, state);
  result = await (0, _prettier.default)(result, config, state);
  return result;
}

var _default = convert;
exports.default = _default;