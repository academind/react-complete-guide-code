"use strict";

exports.__esModule = true;
exports.default = void 0;

var _reactDomTemplate = _interopRequireDefault(require("../templates/reactDomTemplate"));

var _reactNativeTemplate = _interopRequireDefault(require("../templates/reactNativeTemplate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (code, config, state) => {
  let transform = _reactDomTemplate.default;
  if (config.native) transform = _reactNativeTemplate.default;
  if (config.template) transform = config.template;
  return transform(code, config, state);
};

exports.default = _default;