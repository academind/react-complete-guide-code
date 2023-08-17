var _Object$keys = require("core-js-pure/features/object/keys.js");
var _Object$getOwnPropertySymbols = require("core-js-pure/features/object/get-own-property-symbols.js");
var _filterInstanceProperty = require("core-js-pure/features/instance/filter.js");
var _Object$getOwnPropertyDescriptor = require("core-js-pure/features/object/get-own-property-descriptor.js");
var _pushInstanceProperty = require("core-js-pure/features/instance/push.js");
var _forEachInstanceProperty = require("core-js-pure/features/instance/for-each.js");
var _Object$getOwnPropertyDescriptors = require("core-js-pure/features/object/get-own-property-descriptors.js");
var _Object$defineProperties = require("core-js-pure/features/object/define-properties.js");
var _Object$defineProperty = require("core-js-pure/features/object/define-property.js");
var defineProperty = require("./defineProperty.js");
function ownKeys(object, enumerableOnly) {
  var keys = _Object$keys(object);
  if (_Object$getOwnPropertySymbols) {
    var symbols = _Object$getOwnPropertySymbols(object);
    enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) {
      return _Object$getOwnPropertyDescriptor(object, sym).enumerable;
    })), _pushInstanceProperty(keys).apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var _context, _context2;
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? _forEachInstanceProperty(_context = ownKeys(Object(source), !0)).call(_context, function (key) {
      defineProperty(target, key, source[key]);
    }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context2 = ownKeys(Object(source))).call(_context2, function (key) {
      _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
module.exports = _objectSpread2, module.exports.__esModule = true, module.exports["default"] = module.exports;