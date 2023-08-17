"use strict";

exports.__esModule = true;
exports.default = void 0;

var _svgo = _interopRequireDefault(require("svgo"));

var _cosmiconfig = _interopRequireDefault(require("cosmiconfig"));

var _mergeDeep = _interopRequireDefault(require("merge-deep"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const explorer = (0, _cosmiconfig.default)('svgo', {
  searchPlaces: ['package.json', `.svgorc`, `.svgorc.json`, `.svgorc.yaml`, `.svgorc.yml`, `svgo.config.js`, '.svgo.yml'],
  transform: result => result && result.config
});

function getBaseSvgoConfig(config) {
  const baseSvgoConfig = {
    plugins: []
  };
  if (config.icon) baseSvgoConfig.plugins.push({
    removeViewBox: false
  });
  return baseSvgoConfig;
}

var _default = async (code, config = {}, state = {}) => {
  if (!config.svgo) return code;
  const filePath = state.filePath || process.cwd();
  const svgoRcConfig = await explorer.search(filePath);
  const svgo = new _svgo.default((0, _mergeDeep.default)(getBaseSvgoConfig(config), svgoRcConfig, config.svgoConfig));
  const info = state.filePath ? {
    input: 'file',
    path: state.filePath
  } : {
    input: 'string'
  };
  const {
    data
  } = await svgo.optimize(code, info);
  return data;
};

exports.default = _default;