"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _h2xTypes = require("h2x-types");

var _TraversalContext = _interopRequireDefault(require("./TraversalContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-restricted-syntax */
function traverse(ast, opts = {}, state = {}) {
  if (!ast) return;
  const keys = (0, _h2xTypes.getNodeVisitorKeys)(ast);
  if (!keys) return;
  const context = new _TraversalContext.default({
    opts,
    state
  });
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      const key = _step.value;
      if (context.visit(ast, key)) return;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

var _default = traverse;
exports.default = _default;