import _bindInstanceProperty from "core-js-pure/features/instance/bind.js";
import _Reflect$construct from "core-js-pure/features/reflect/construct.js";
import _pushInstanceProperty from "core-js-pure/features/instance/push.js";
import setPrototypeOf from "./setPrototypeOf.js";
import isNativeReflectConstruct from "./isNativeReflectConstruct.js";
export default function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    var _context;
    _construct = _bindInstanceProperty(_context = _Reflect$construct).call(_context);
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      _pushInstanceProperty(a).apply(a, args);
      var Constructor = _bindInstanceProperty(Function).apply(Parent, a);
      var instance = new Constructor();
      if (Class) setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }
  return _construct.apply(null, arguments);
}