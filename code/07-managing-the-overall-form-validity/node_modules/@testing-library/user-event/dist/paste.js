"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.paste = paste;

var _dom = require("@testing-library/dom");

var _utils = require("./utils");

function paste(element, text, init, {
  initialSelectionStart,
  initialSelectionEnd
} = {}) {
  if (element.disabled) return;

  if (typeof element.value === 'undefined') {
    throw new TypeError(`the current element is of type ${element.tagName} and doesn't have a valid value`);
  }

  (0, _utils.eventWrapper)(() => element.focus()); // by default, a new element has it's selection start and end at 0
  // but most of the time when people call "paste", they expect it to paste
  // at the end of the current input value. So, if the selection start
  // and end are both the default of 0, then we'll go ahead and change
  // them to the length of the current value.
  // the only time it would make sense to pass the initialSelectionStart or
  // initialSelectionEnd is if you have an input with a value and want to
  // explicitely start typing with the cursor at 0. Not super common.

  if (element.selectionStart === 0 && element.selectionEnd === 0) {
    (0, _utils.setSelectionRangeIfNecessary)(element, initialSelectionStart != null ? initialSelectionStart : element.value.length, initialSelectionEnd != null ? initialSelectionEnd : element.value.length);
  }

  _dom.fireEvent.paste(element, init);

  if (!element.readOnly) {
    const {
      newValue,
      newSelectionStart
    } = (0, _utils.calculateNewValue)(text, element);

    _dom.fireEvent.input(element, {
      inputType: 'insertFromPaste',
      target: {
        value: newValue
      }
    });

    (0, _utils.setSelectionRangeIfNecessary)(element, {
      newSelectionStart,
      newSelectionEnd: newSelectionStart
    });
  }
}