import _Object$defineProperty from "core-js-pure/features/object/define-property.js";
export default function _defineAccessor(type, obj, key, fn) {
  var desc = {
    configurable: !0,
    enumerable: !0
  };
  return desc[type] = fn, _Object$defineProperty(obj, key, desc);
}