import _Symbol from "core-js-pure/features/symbol/index.js";
import _getIteratorMethod from "core-js-pure/features/get-iterator-method.js";
import _pushInstanceProperty from "core-js-pure/features/instance/push.js";
export default function _iterableToArrayLimitLoose(arr, i) {
  var _i = arr && ("undefined" != typeof _Symbol && _getIteratorMethod(arr) || arr["@@iterator"]);
  if (null != _i) {
    var _s,
      _arr = [];
    for (_i = _i.call(arr); arr.length < i && !(_s = _i.next()).done;) _pushInstanceProperty(_arr).call(_arr, _s.value);
    return _arr;
  }
}