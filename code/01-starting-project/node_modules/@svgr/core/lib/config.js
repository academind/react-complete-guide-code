"use strict";

exports.__esModule = true;
exports.resolveConfig = resolveConfig;
exports.resolveConfigFile = resolveConfigFile;
exports.DEFAULT_CONFIG = void 0;

var _cosmiconfig = _interopRequireDefault(require("cosmiconfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DEFAULT_CONFIG = {
  h2xConfig: null,
  dimensions: true,
  expandProps: true,
  icon: false,
  native: false,
  prettier: true,
  prettierConfig: null,
  ref: false,
  replaceAttrValues: null,
  svgAttributes: null,
  svgProps: null,
  svgo: true,
  svgoConfig: null,
  template: null,
  titleProp: false
};
exports.DEFAULT_CONFIG = DEFAULT_CONFIG;
const explorer = (0, _cosmiconfig.default)('svgr', {
  sync: true,
  cache: true,
  rcExtensions: true
});

async function resolveConfig(searchFrom, configFile) {
  if (configFile == null) {
    const result = await explorer.search(searchFrom);
    return result ? result.config : null;
  }

  const result = await explorer.load(configFile);
  return result ? result.config : null;
}

async function resolveConfigFile(filePath) {
  const result = await explorer.search(filePath);
  return result ? result.filepath : null;
}