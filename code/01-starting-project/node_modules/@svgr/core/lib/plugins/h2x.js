"use strict";

exports.__esModule = true;
exports.default = void 0;

var _h2xCore = require("h2x-core");

var _h2xPluginJsx = _interopRequireDefault(require("h2x-plugin-jsx"));

var _ = require("..");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function configToPlugins(config) {
  const plugins = [_h2xPluginJsx.default, (0, _.stripAttribute)('xmlns'), (0, _.removeComments)(), (0, _.removeStyle)()];
  if (config.replaceAttrValues) plugins.push((0, _.replaceAttrValues)(config.replaceAttrValues));
  if (!config.dimensions) plugins.push((0, _.removeDimensions)());
  if (config.icon) plugins.push((0, _.emSize)());
  if (config.ref) plugins.push((0, _.svgRef)());
  if (config.svgAttributes) plugins.push((0, _.svgAttributes)(config.svgAttributes));
  if (config.svgProps) plugins.push((0, _.svgProps)(config.svgProps)); // TODO remove boolean value in the next major release

  if (config.expandProps) plugins.push((0, _.expandProps)(config.expandProps === true ? 'end' : config.expandProps));
  if (config.native) plugins.push((0, _.toReactNative)());
  if (config.titleProp) plugins.push((0, _.titleProp)());
  return plugins;
}

var _default = (code, config = {}, state = {}) => {
  const plugins = configToPlugins(config);
  return (0, _h2xCore.transform)(code, _extends({
    plugins,
    state
  }, config.h2xConfig));
};

exports.default = _default;