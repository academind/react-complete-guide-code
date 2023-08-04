import _typeof from "./typeof.js";
import _Symbol$asyncDispose from "core-js-pure/features/symbol/async-dispose.js";
import _Symbol$for from "core-js-pure/features/symbol/for.js";
import _Symbol$dispose from "core-js-pure/features/symbol/dispose.js";
import _pushInstanceProperty from "core-js-pure/features/instance/push.js";
export default function _using(stack, value, isAwait) {
  if (null == value) return value;
  if ("object" != _typeof(value)) throw new TypeError("using declarations can only be used with objects, null, or undefined.");
  if (isAwait) var dispose = value[_Symbol$asyncDispose || _Symbol$for("Symbol.asyncDispose")];
  if (null == dispose && (dispose = value[_Symbol$dispose || _Symbol$for("Symbol.dispose")]), "function" != typeof dispose) throw new TypeError("Property [Symbol.dispose] is not a function.");
  return _pushInstanceProperty(stack).call(stack, {
    v: value,
    d: dispose,
    a: isAwait
  }), value;
}