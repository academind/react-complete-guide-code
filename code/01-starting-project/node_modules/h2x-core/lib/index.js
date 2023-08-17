"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transform = transform;
Object.defineProperty(exports, "generate", {
  enumerable: true,
  get: function get() {
    return _h2xGenerate.default;
  }
});
Object.defineProperty(exports, "traverse", {
  enumerable: true,
  get: function get() {
    return _h2xTraverse.default;
  }
});

var _h2xParse = _interopRequireDefault(require("h2x-parse"));

var _h2xGenerate = _interopRequireDefault(require("h2x-generate"));

var _h2xTraverse = _interopRequireDefault(require("h2x-traverse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-restricted-syntax */
const reduceVisitors = (visitors, opts) => {
  Object.keys(visitors).forEach(key => {
    const visitor = visitors[key];

    if (typeof visitor === 'function') {
      opts[key] = opts[key] || [];
      opts[key].push(visitor);
    } else {
      opts[key] = opts[key] || {};
      reduceVisitors(visitor, opts[key]);
    }

    return opts;
  });
};

const mergePlugins = plugins => plugins.reduce((opts, plugin) => {
  const _plugin = plugin(),
        _plugin$visitor = _plugin.visitor,
        visitor = _plugin$visitor === void 0 ? {} : _plugin$visitor,
        _plugin$generator = _plugin.generator,
        generator = _plugin$generator === void 0 ? {} : _plugin$generator;

  reduceVisitors(visitor, opts.visitor);
  reduceVisitors(generator, opts.generator);
  return opts;
}, {
  visitor: {},
  generator: {}
});

function transform(code, {
  plugins = [],
  state = {}
} = {}) {
  const ast = (0, _h2xParse.default)(code);

  const _mergePlugins = mergePlugins(plugins),
        visitor = _mergePlugins.visitor,
        generator = _mergePlugins.generator;

  (0, _h2xTraverse.default)(ast, visitor, state);
  return (0, _h2xGenerate.default)(ast, generator);
}