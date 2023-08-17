import _Object$keys from "core-js-pure/features/object/keys.js";
import _Object$getOwnPropertySymbols from "core-js-pure/features/object/get-own-property-symbols.js";
import _filterInstanceProperty from "core-js-pure/features/instance/filter.js";
import _Object$getOwnPropertyDescriptor from "core-js-pure/features/object/get-own-property-descriptor.js";
import _pushInstanceProperty from "core-js-pure/features/instance/push.js";
import _forEachInstanceProperty from "core-js-pure/features/instance/for-each.js";
import _Object$getOwnPropertyDescriptors from "core-js-pure/features/object/get-own-property-descriptors.js";
import _Object$defineProperties from "core-js-pure/features/object/define-properties.js";
import _Object$defineProperty from "core-js-pure/features/object/define-property.js";
import defineProperty from "./defineProperty.js";
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
export default function _objectSpread2(target) {
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