"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFocusable = isFocusable;
exports.isClickableInput = isClickableInput;
exports.getMouseEventOptions = getMouseEventOptions;
exports.isLabelWithInternallyDisabledControl = isLabelWithInternallyDisabledControl;
exports.getActiveElement = getActiveElement;
exports.calculateNewValue = calculateNewValue;
exports.setSelectionRangeIfNecessary = setSelectionRangeIfNecessary;
exports.eventWrapper = eventWrapper;
exports.isValidDateValue = isValidDateValue;
exports.isValidInputTimeValue = isValidInputTimeValue;
exports.buildTimeValue = buildTimeValue;
exports.getValue = getValue;
exports.getSelectionRange = getSelectionRange;
exports.isContentEditable = isContentEditable;
exports.isInstanceOfElement = isInstanceOfElement;
exports.isVisible = isVisible;
exports.FOCUSABLE_SELECTOR = void 0;

var _dom = require("@testing-library/dom");

var _helpers = require("@testing-library/dom/dist/helpers");

// isInstanceOfElement can be removed once the peerDependency for @testing-library/dom is bumped to a version that includes https://github.com/testing-library/dom-testing-library/pull/885

/**
 * Check if an element is of a given type.
 *
 * @param {Element} element The element to test
 * @param {string} elementType Constructor name. E.g. 'HTMLSelectElement'
 */
function isInstanceOfElement(element, elementType) {
  try {
    const window = (0, _helpers.getWindowFromNode)(element); // Window usually has the element constructors as properties but is not required to do so per specs

    if (typeof window[elementType] === 'function') {
      return element instanceof window[elementType];
    }
  } catch (e) {// The document might not be associated with a window
  } // Fall back to the constructor name as workaround for test environments that
  // a) not associate the document with a window
  // b) not provide the constructor as property of window


  if (/^HTML(\w+)Element$/.test(element.constructor.name)) {
    return element.constructor.name === elementType;
  } // The user passed some node that is not created in a browser-like environment


  throw new Error(`Unable to verify if element is instance of ${elementType}. Please file an issue describing your test environment: https://github.com/testing-library/dom-testing-library/issues/new`);
}

function isMousePressEvent(event) {
  return event === 'mousedown' || event === 'mouseup' || event === 'click' || event === 'dblclick';
}

function invert(map) {
  const res = {};

  for (const key of Object.keys(map)) {
    res[map[key]] = key;
  }

  return res;
} // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons


const BUTTONS_TO_NAMES = {
  0: 'none',
  1: 'primary',
  2: 'secondary',
  4: 'auxiliary'
};
const NAMES_TO_BUTTONS = invert(BUTTONS_TO_NAMES); // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button

const BUTTON_TO_NAMES = {
  0: 'primary',
  1: 'auxiliary',
  2: 'secondary'
};
const NAMES_TO_BUTTON = invert(BUTTON_TO_NAMES);

function convertMouseButtons(event, init, property, mapping) {
  if (!isMousePressEvent(event)) {
    return 0;
  }

  if (init[property] != null) {
    return init[property];
  }

  if (init.buttons != null) {
    // not sure how to test this. Feel free to try and add a test if you want.
    // istanbul ignore next
    return mapping[BUTTONS_TO_NAMES[init.buttons]] || 0;
  }

  if (init.button != null) {
    // not sure how to test this. Feel free to try and add a test if you want.
    // istanbul ignore next
    return mapping[BUTTON_TO_NAMES[init.button]] || 0;
  }

  return property != 'button' && isMousePressEvent(event) ? 1 : 0;
}

function getMouseEventOptions(event, init, clickCount = 0) {
  init = init || {};
  return { ...init,
    // https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail
    detail: event === 'mousedown' || event === 'mouseup' || event === 'click' ? 1 + clickCount : clickCount,
    buttons: convertMouseButtons(event, init, 'buttons', NAMES_TO_BUTTONS),
    button: convertMouseButtons(event, init, 'button', NAMES_TO_BUTTON)
  };
} // Absolutely NO events fire on label elements that contain their control
// if that control is disabled. NUTS!
// no joke. There are NO events for: <label><input disabled /><label>


function isLabelWithInternallyDisabledControl(element) {
  var _element$control;

  return element.tagName === 'LABEL' && ((_element$control = element.control) == null ? void 0 : _element$control.disabled) && element.contains(element.control);
}

function getActiveElement(document) {
  const activeElement = document.activeElement;

  if (activeElement != null && activeElement.shadowRoot) {
    return getActiveElement(activeElement.shadowRoot);
  } else {
    return activeElement;
  }
}

function supportsMaxLength(element) {
  if (element.tagName === 'TEXTAREA') return true;

  if (element.tagName === 'INPUT') {
    const type = element.getAttribute('type'); // Missing value default is "text"

    if (!type) return true; // https://html.spec.whatwg.org/multipage/input.html#concept-input-apply

    if (type.match(/email|password|search|telephone|text|url/)) return true;
  }

  return false;
}

function getSelectionRange(element) {
  if (isContentEditable(element)) {
    const range = element.ownerDocument.getSelection().getRangeAt(0);
    return {
      selectionStart: range.startOffset,
      selectionEnd: range.endOffset
    };
  }

  return {
    selectionStart: element.selectionStart,
    selectionEnd: element.selectionEnd
  };
} //jsdom is not supporting isContentEditable


function isContentEditable(element) {
  return element.hasAttribute('contenteditable') && (element.getAttribute('contenteditable') == 'true' || element.getAttribute('contenteditable') == '');
}

function getValue(element) {
  if (isContentEditable(element)) {
    return element.textContent;
  }

  return element.value;
}

function calculateNewValue(newEntry, element) {
  var _element$getAttribute;

  const {
    selectionStart,
    selectionEnd
  } = getSelectionRange(element);
  const value = getValue(element); // can't use .maxLength property because of a jsdom bug:
  // https://github.com/jsdom/jsdom/issues/2927

  const maxLength = Number((_element$getAttribute = element.getAttribute('maxlength')) != null ? _element$getAttribute : -1);
  let newValue, newSelectionStart;

  if (selectionStart === null) {
    // at the end of an input type that does not support selection ranges
    // https://github.com/testing-library/user-event/issues/316#issuecomment-639744793
    newValue = value + newEntry;
  } else if (selectionStart === selectionEnd) {
    if (selectionStart === 0) {
      // at the beginning of the input
      newValue = newEntry + value;
    } else if (selectionStart === value.length) {
      // at the end of the input
      newValue = value + newEntry;
    } else {
      // in the middle of the input
      newValue = value.slice(0, selectionStart) + newEntry + value.slice(selectionEnd);
    }

    newSelectionStart = selectionStart + newEntry.length;
  } else {
    // we have something selected
    const firstPart = value.slice(0, selectionStart) + newEntry;
    newValue = firstPart + value.slice(selectionEnd);
    newSelectionStart = firstPart.length;
  }

  if (element.type === 'date' && !isValidDateValue(element, newValue)) {
    newValue = value;
  }

  if (element.type === 'time' && !isValidInputTimeValue(element, newValue)) {
    if (isValidInputTimeValue(element, newEntry)) {
      newValue = newEntry;
    } else {
      newValue = value;
    }
  }

  if (!supportsMaxLength(element) || maxLength < 0) {
    return {
      newValue,
      newSelectionStart
    };
  } else {
    return {
      newValue: newValue.slice(0, maxLength),
      newSelectionStart: newSelectionStart > maxLength ? maxLength : newSelectionStart
    };
  }
}

function setSelectionRangeIfNecessary(element, newSelectionStart, newSelectionEnd) {
  const {
    selectionStart,
    selectionEnd
  } = getSelectionRange(element);

  if (!isContentEditable(element) && (!element.setSelectionRange || selectionStart === null)) {
    // cannot set selection
    return;
  }

  if (selectionStart !== newSelectionStart || selectionEnd !== newSelectionStart) {
    if (isContentEditable(element)) {
      const range = element.ownerDocument.createRange();
      range.selectNodeContents(element);
      range.setStart(element.firstChild, newSelectionStart);
      range.setEnd(element.firstChild, newSelectionEnd);
      element.ownerDocument.getSelection().removeAllRanges();
      element.ownerDocument.getSelection().addRange(range);
    } else {
      element.setSelectionRange(newSelectionStart, newSelectionEnd);
    }
  }
}

const FOCUSABLE_SELECTOR = ['input:not([type=hidden]):not([disabled])', 'button:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', '[contenteditable=""]', '[contenteditable="true"]', 'a[href]', '[tabindex]:not([disabled])'].join(', ');
exports.FOCUSABLE_SELECTOR = FOCUSABLE_SELECTOR;

function isFocusable(element) {
  return !isLabelWithInternallyDisabledControl(element) && (element == null ? void 0 : element.matches(FOCUSABLE_SELECTOR));
}

const CLICKABLE_INPUT_TYPES = ['button', 'color', 'file', 'image', 'reset', 'submit'];

function isClickableInput(element) {
  return element.tagName === 'BUTTON' || isInstanceOfElement(element, 'HTMLInputElement') && CLICKABLE_INPUT_TYPES.includes(element.type);
}

function isVisible(element) {
  const getComputedStyle = (0, _helpers.getWindowFromNode)(element).getComputedStyle;

  for (; element && element.ownerDocument; element = element.parentNode) {
    const display = getComputedStyle(element).display;

    if (display === 'none') {
      return false;
    }
  }

  return true;
}

function eventWrapper(cb) {
  let result;
  (0, _dom.getConfig)().eventWrapper(() => {
    result = cb();
  });
  return result;
}

function isValidDateValue(element, value) {
  if (element.type !== 'date') return false;
  const clone = element.cloneNode();
  clone.value = value;
  return clone.value === value;
}

function buildTimeValue(value) {
  function build(onlyDigitsValue, index) {
    const hours = onlyDigitsValue.slice(0, index);
    const validHours = Math.min(parseInt(hours, 10), 23);
    const minuteCharacters = onlyDigitsValue.slice(index);
    const parsedMinutes = parseInt(minuteCharacters, 10);
    const validMinutes = Math.min(parsedMinutes, 59);
    return `${validHours.toString().padStart(2, '0')}:${validMinutes.toString().padStart(2, '0')}`;
  }

  const onlyDigitsValue = value.replace(/\D/g, '');

  if (onlyDigitsValue.length < 2) {
    return value;
  }

  const firstDigit = parseInt(onlyDigitsValue[0], 10);
  const secondDigit = parseInt(onlyDigitsValue[1], 10);

  if (firstDigit >= 3 || firstDigit === 2 && secondDigit >= 4) {
    let index;

    if (firstDigit >= 3) {
      index = 1;
    } else {
      index = 2;
    }

    return build(onlyDigitsValue, index);
  }

  if (value.length === 2) {
    return value;
  }

  return build(onlyDigitsValue, 2);
}

function isValidInputTimeValue(element, timeValue) {
  if (element.type !== 'time') return false;
  const clone = element.cloneNode();
  clone.value = timeValue;
  return clone.value === timeValue;
}