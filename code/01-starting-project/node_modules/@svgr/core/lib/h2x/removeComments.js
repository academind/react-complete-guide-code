"use strict";

exports.__esModule = true;
exports.default = void 0;

const removeComments = () => () => ({
  visitor: {
    JSXComment: {
      enter(path) {
        path.remove();
      }

    }
  }
});

var _default = removeComments;
exports.default = _default;