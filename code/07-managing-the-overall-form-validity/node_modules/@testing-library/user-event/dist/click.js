"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.click = click;
exports.dblClick = dblClick;

var _dom = require("@testing-library/dom");

var _utils = require("./utils");

var _hover = require("./hover");

var _blur = require("./blur");

var _focus = require("./focus");

function getPreviouslyFocusedElement(element) {
  const focusedElement = element.ownerDocument.activeElement;
  const wasAnotherElementFocused = focusedElement && focusedElement !== element.ownerDocument.body && focusedElement !== element;
  return wasAnotherElementFocused ? focusedElement : null;
}

function clickLabel(label, init, {
  clickCount
}) {
  if ((0, _utils.isLabelWithInternallyDisabledControl)(label)) return;

  _dom.fireEvent.pointerDown(label, init);

  _dom.fireEvent.mouseDown(label, (0, _utils.getMouseEventOptions)('mousedown', init, clickCount));

  _dom.fireEvent.pointerUp(label, init);

  _dom.fireEvent.mouseUp(label, (0, _utils.getMouseEventOptions)('mouseup', init, clickCount));

  _dom.fireEvent.click(label, (0, _utils.getMouseEventOptions)('click', init, clickCount)); // clicking the label will trigger a click of the label.control
  // however, it will not focus the label.control so we have to do it
  // ourselves.


  if (label.control) (0, _focus.focus)(label.control);
}

function clickBooleanElement(element, init, clickCount) {
  _dom.fireEvent.pointerDown(element, init);

  if (!element.disabled) {
    _dom.fireEvent.mouseDown(element, (0, _utils.getMouseEventOptions)('mousedown', init, clickCount));
  }

  (0, _focus.focus)(element, init);

  _dom.fireEvent.pointerUp(element, init);

  if (!element.disabled) {
    _dom.fireEvent.mouseUp(element, (0, _utils.getMouseEventOptions)('mouseup', init, clickCount));

    _dom.fireEvent.click(element, (0, _utils.getMouseEventOptions)('click', init, clickCount));
  }
}

function clickElement(element, init, {
  clickCount
}) {
  const previousElement = getPreviouslyFocusedElement(element);

  _dom.fireEvent.pointerDown(element, init);

  if (!element.disabled) {
    const continueDefaultHandling = _dom.fireEvent.mouseDown(element, (0, _utils.getMouseEventOptions)('mousedown', init, clickCount));

    if (continueDefaultHandling) {
      const closestFocusable = findClosest(element, _utils.isFocusable);

      if (previousElement && !closestFocusable) {
        (0, _blur.blur)(previousElement, init);
      } else if (closestFocusable) {
        (0, _focus.focus)(closestFocusable, init);
      }
    }
  }

  _dom.fireEvent.pointerUp(element, init);

  if (!element.disabled) {
    _dom.fireEvent.mouseUp(element, (0, _utils.getMouseEventOptions)('mouseup', init, clickCount));

    _dom.fireEvent.click(element, (0, _utils.getMouseEventOptions)('click', init, clickCount));

    const parentLabel = element.closest('label');
    if (parentLabel != null && parentLabel.control) (0, _focus.focus)(parentLabel.control, init);
  }
}

function findClosest(el, callback) {
  do {
    if (callback(el)) {
      return el;
    }

    el = el.parentElement;
  } while (el && el !== document.body);

  return undefined;
}

function click(element, init, {
  skipHover = false,
  clickCount = 0
} = {}) {
  if (!skipHover) (0, _hover.hover)(element, init);

  switch (element.tagName) {
    case 'LABEL':
      clickLabel(element, init, {
        clickCount
      });
      break;

    case 'INPUT':
      if (element.type === 'checkbox' || element.type === 'radio') {
        clickBooleanElement(element, init, {
          clickCount
        });
      } else {
        clickElement(element, init, {
          clickCount
        });
      }

      break;

    default:
      clickElement(element, init, {
        clickCount
      });
  }
}

function dblClick(element, init) {
  (0, _hover.hover)(element, init);
  click(element, init, {
    skipHover: true,
    clickCount: 0
  });
  click(element, init, {
    skipHover: true,
    clickCount: 1
  });

  _dom.fireEvent.dblClick(element, (0, _utils.getMouseEventOptions)('dblclick', init, 2));
}