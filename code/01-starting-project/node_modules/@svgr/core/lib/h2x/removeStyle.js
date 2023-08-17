"use strict";

exports.__esModule = true;
exports.default = void 0;

const removeStyle = () => () => ({
  visitor: {
    JSXElement: {
      enter(path) {
        if (path.node.name === 'style') {
          path.remove();
        }
      }

    }
  }
});

var _default = removeStyle;
exports.default = _default;