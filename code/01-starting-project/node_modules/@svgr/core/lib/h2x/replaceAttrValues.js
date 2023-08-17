"use strict";

exports.__esModule = true;
exports.default = void 0;

const replaceAttrValues = (attributes = {}) => () => ({
  visitor: {
    JSXAttribute: {
      enter(path) {
        Object.keys(attributes).forEach(key => {
          if (path.node.value === key) {
            path.node.value = attributes[key];
          }
        });
      }

    }
  }
});

var _default = replaceAttrValues;
exports.default = _default;