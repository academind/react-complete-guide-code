import _indexOfInstanceProperty from "core-js-pure/features/instance/index-of.js";
export default function _isNativeFunction(fn) {
  var _context;
  return _indexOfInstanceProperty(_context = Function.toString.call(fn)).call(_context, "[native code]") !== -1;
}