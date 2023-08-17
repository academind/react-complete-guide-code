"use strict";

exports.__esModule = true;
exports.default = void 0;

const stripAttribute = attribute => () => ({
  visitor: {
    JSXAttribute: {
      enter(path) {
        if (path.node.name === attribute) {
          path.remove();
        }
      }

    }
  }
});

var _default = stripAttribute;
exports.default = _default;