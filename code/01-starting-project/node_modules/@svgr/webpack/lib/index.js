"use strict";

exports.__esModule = true;
exports.default = void 0;

var _loaderUtils = require("loader-utils");

var _core = require("@babel/core");

var _core2 = _interopRequireDefault(require("@svgr/core"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function svgrLoader(source) {
  const callback = this.async();

  const _ref = (0, _loaderUtils.getOptions)(this) || {},
        {
    babel = true
  } = _ref,
        options = _objectWithoutPropertiesLoose(_ref, ["babel"]);

  const readSvg = () => new Promise((resolve, reject) => {
    this.fs.readFile(this.resourcePath, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });

  const exportMatches = source.toString('utf-8').match(/^module.exports\s*=\s*(.*)/);
  const previousExport = exportMatches ? exportMatches[1] : null;

  const pBabelTransform = async jsCode => new Promise((resolve, reject) => {
    (0, _core.transform)(jsCode, {
      babelrc: false,
      presets: ['@babel/preset-react', ['@babel/preset-env', {
        modules: false
      }]],
      plugins: ['@babel/plugin-transform-react-constant-elements']
    }, (err, result) => {
      if (err) reject(err);else resolve(result.code);
    });
  });

  const tranformSvg = svg => (0, _core2.default)(svg, options, {
    webpack: {
      previousExport
    }
  }).then(jsCode => babel ? pBabelTransform(jsCode) : jsCode).then(result => callback(null, result)).catch(err => callback(err));

  if (exportMatches) {
    readSvg().then(tranformSvg);
  } else {
    tranformSvg(source);
  }
}

var _default = svgrLoader;
exports.default = _default;