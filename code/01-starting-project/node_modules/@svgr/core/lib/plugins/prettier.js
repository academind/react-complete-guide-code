"use strict";

exports.__esModule = true;
exports.default = void 0;

var _prettier = _interopRequireDefault(require("prettier"));

var _mergeDeep = _interopRequireDefault(require("merge-deep"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = async (code, config = {}, state = {}) => {
  if (!config.prettier) return code;
  const filePath = state.filePath || process.cwd();
  const prettierRcConfig = await _prettier.default.resolveConfig(filePath, {
    editorconfig: true
  });
  return _prettier.default.format(code, (0, _mergeDeep.default)({
    parser: 'babylon'
  }, prettierRcConfig, config.prettierConfig || {}));
};

exports.default = _default;