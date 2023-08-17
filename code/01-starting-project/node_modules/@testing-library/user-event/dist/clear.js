"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clear = clear;

var _type = require("./type");

function clear(element) {
  if (element.tagName !== 'INPUT' && element.tagName !== 'TEXTAREA') {
    // TODO: support contenteditable
    throw new Error('clear currently only supports input and textarea elements.');
  }

  if (element.disabled) return; // TODO: track the selection range ourselves so we don't have to do this input "type" trickery
  // just like cypress does: https://github.com/cypress-io/cypress/blob/8d7f1a0bedc3c45a2ebf1ff50324b34129fdc683/packages/driver/src/dom/selection.ts#L16-L37

  const elementType = element.type; // type is a readonly property on textarea, so check if element is an input before trying to modify it

  if (element.tagName === 'INPUT') {
    // setSelectionRange is not supported on certain types of inputs, e.g. "number" or "email"
    element.type = 'text';
  }

  (0, _type.type)(element, '{selectall}{del}', {
    delay: 0,
    initialSelectionStart: element.selectionStart,
    initialSelectionEnd: element.selectionEnd
  });

  if (element.tagName === 'INPUT') {
    element.type = elementType;
  }
}