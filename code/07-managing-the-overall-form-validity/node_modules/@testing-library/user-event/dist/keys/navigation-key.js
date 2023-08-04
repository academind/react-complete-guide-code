"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.navigationKey = navigationKey;

var _dom = require("@testing-library/dom");

var _utils = require("../utils");

const keys = {
  Home: {
    keyCode: 36
  },
  End: {
    keyCode: 35
  },
  ArrowLeft: {
    keyCode: 37
  },
  ArrowRight: {
    keyCode: 39
  }
};

function getSelectionRange(currentElement, key) {
  const {
    selectionStart,
    selectionEnd
  } = currentElement();

  if (key === 'Home') {
    return {
      selectionStart: 0,
      selectionEnd: 0
    };
  }

  if (key === 'End') {
    return {
      selectionStart: selectionEnd + 1,
      selectionEnd: selectionEnd + 1
    };
  }

  const cursorChange = Number(key in keys) * (key === 'ArrowLeft' ? -1 : 1);
  return {
    selectionStart: selectionStart + cursorChange,
    selectionEnd: selectionEnd + cursorChange
  };
}

function navigationKey(key) {
  const event = {
    key,
    keyCode: keys[key].keyCode,
    which: keys[key].keyCode
  };
  return ({
    currentElement,
    eventOverrides
  }) => {
    _dom.fireEvent.keyDown(currentElement(), { ...event,
      ...eventOverrides
    });

    const range = getSelectionRange(currentElement, key);
    (0, _utils.setSelectionRangeIfNecessary)(currentElement(), range.selectionStart, range.selectionEnd);

    _dom.fireEvent.keyUp(currentElement(), { ...event,
      ...eventOverrides
    });
  };
}