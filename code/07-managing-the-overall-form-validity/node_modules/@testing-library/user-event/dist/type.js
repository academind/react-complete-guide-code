"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.type = type;
exports.specialCharMap = void 0;

var _dom = require("@testing-library/dom");

var _utils = require("./utils");

var _click = require("./click");

var _navigationKey = require("./keys/navigation-key");

// TODO: wrap in asyncWrapper
const modifierCallbackMap = { ...createModifierCallbackEntries({
    name: 'shift',
    key: 'Shift',
    keyCode: 16,
    modifierProperty: 'shiftKey'
  }),
  ...createModifierCallbackEntries({
    name: 'ctrl',
    key: 'Control',
    keyCode: 17,
    modifierProperty: 'ctrlKey'
  }),
  ...createModifierCallbackEntries({
    name: 'alt',
    key: 'Alt',
    keyCode: 18,
    modifierProperty: 'altKey'
  }),
  ...createModifierCallbackEntries({
    name: 'meta',
    key: 'Meta',
    keyCode: 93,
    modifierProperty: 'metaKey'
  }),
  // capslock is inline because of the need to fire both keydown and keyup on use, while preserving the modifier state.
  '{capslock}': function capslockOn({
    currentElement,
    eventOverrides
  }) {
    const newEventOverrides = {
      modifierCapsLock: true
    };

    _dom.fireEvent.keyDown(currentElement(), {
      key: 'CapsLock',
      keyCode: 20,
      which: 20,
      ...eventOverrides,
      ...newEventOverrides
    });

    _dom.fireEvent.keyUp(currentElement(), {
      key: 'CapsLock',
      keyCode: 20,
      which: 20,
      ...eventOverrides,
      ...newEventOverrides
    });

    return {
      eventOverrides: newEventOverrides
    };
  },
  '{/capslock}': function capslockOff({
    currentElement,
    eventOverrides
  }) {
    const newEventOverrides = {
      modifierCapsLock: false
    };

    _dom.fireEvent.keyDown(currentElement(), {
      key: 'CapsLock',
      keyCode: 20,
      which: 20,
      ...eventOverrides,
      ...newEventOverrides
    });

    _dom.fireEvent.keyUp(currentElement(), {
      key: 'CapsLock',
      keyCode: 20,
      which: 20,
      ...eventOverrides,
      ...newEventOverrides
    });

    return {
      eventOverrides: newEventOverrides
    };
  }
};
const specialCharMap = {
  arrowLeft: '{arrowleft}',
  arrowRight: '{arrowright}',
  arrowDown: '{arrowdown}',
  arrowUp: '{arrowup}',
  enter: '{enter}',
  escape: '{esc}',
  delete: '{del}',
  backspace: '{backspace}',
  home: '{home}',
  end: '{end}',
  selectAll: '{selectall}',
  space: '{space}',
  whitespace: ' '
};
exports.specialCharMap = specialCharMap;
const specialCharCallbackMap = {
  [specialCharMap.arrowLeft]: (0, _navigationKey.navigationKey)('ArrowLeft'),
  [specialCharMap.arrowRight]: (0, _navigationKey.navigationKey)('ArrowRight'),
  [specialCharMap.arrowDown]: handleArrowDown,
  [specialCharMap.arrowUp]: handleArrowUp,
  [specialCharMap.home]: (0, _navigationKey.navigationKey)('Home'),
  [specialCharMap.end]: (0, _navigationKey.navigationKey)('End'),
  [specialCharMap.enter]: handleEnter,
  [specialCharMap.escape]: handleEsc,
  [specialCharMap.delete]: handleDel,
  [specialCharMap.backspace]: handleBackspace,
  [specialCharMap.selectAll]: handleSelectall,
  [specialCharMap.space]: handleSpace,
  [specialCharMap.whitespace]: handleSpace
};

function wait(time) {
  return new Promise(resolve => setTimeout(() => resolve(), time));
} // this needs to be wrapped in the event/asyncWrapper for React's act and angular's change detection
// depending on whether it will be async.


async function type(element, text, {
  delay = 0,
  ...options
} = {}) {
  // we do not want to wrap in the asyncWrapper if we're not
  // going to actually be doing anything async, so we only wrap
  // if the delay is greater than 0
  let result;

  if (delay > 0) {
    await (0, _dom.getConfig)().asyncWrapper(async () => {
      result = await typeImpl(element, text, {
        delay,
        ...options
      });
    });
  } else {
    result = typeImpl(element, text, {
      delay,
      ...options
    });
  }

  return result;
}

async function typeImpl(element, text, {
  delay,
  skipClick = false,
  skipAutoClose = false,
  initialSelectionStart,
  initialSelectionEnd
}) {
  if (element.disabled) return;
  if (!skipClick) (0, _click.click)(element);

  if ((0, _utils.isContentEditable)(element) && document.getSelection().rangeCount === 0) {
    const range = document.createRange();
    range.setStart(element, 0);
    range.setEnd(element, 0);
    document.getSelection().addRange(range);
  } // The focused element could change between each event, so get the currently active element each time


  const currentElement = () => (0, _utils.getActiveElement)(element.ownerDocument); // by default, a new element has it's selection start and end at 0
  // but most of the time when people call "type", they expect it to type
  // at the end of the current input value. So, if the selection start
  // and end are both the default of 0, then we'll go ahead and change
  // them to the length of the current value.
  // the only time it would make sense to pass the initialSelectionStart or
  // initialSelectionEnd is if you have an input with a value and want to
  // explicitely start typing with the cursor at 0. Not super common.


  const value = (0, _utils.getValue)(currentElement());
  const {
    selectionStart,
    selectionEnd
  } = (0, _utils.getSelectionRange)(element);

  if (value != null && selectionStart === 0 && selectionEnd === 0) {
    (0, _utils.setSelectionRangeIfNecessary)(currentElement(), initialSelectionStart != null ? initialSelectionStart : value.length, initialSelectionEnd != null ? initialSelectionEnd : value.length);
  }

  const eventCallbacks = queueCallbacks();
  await runCallbacks(eventCallbacks);

  function queueCallbacks() {
    const callbacks = [];
    let remainingString = text;

    while (remainingString) {
      const {
        callback,
        remainingString: newRemainingString
      } = getNextCallback(remainingString, skipAutoClose);
      callbacks.push(callback);
      remainingString = newRemainingString;
    }

    return callbacks;
  }

  async function runCallbacks(callbacks) {
    const eventOverrides = {};
    let prevWasMinus, prevWasPeriod, prevValue, typedValue;

    for (const callback of callbacks) {
      if (delay > 0) await wait(delay);

      if (!currentElement().disabled) {
        const returnValue = callback({
          currentElement,
          prevWasMinus,
          prevWasPeriod,
          prevValue,
          eventOverrides,
          typedValue
        });
        Object.assign(eventOverrides, returnValue == null ? void 0 : returnValue.eventOverrides);
        prevWasMinus = returnValue == null ? void 0 : returnValue.prevWasMinus;
        prevWasPeriod = returnValue == null ? void 0 : returnValue.prevWasPeriod;
        prevValue = returnValue == null ? void 0 : returnValue.prevValue;
        typedValue = returnValue == null ? void 0 : returnValue.typedValue;
      }
    }
  }
}

function getNextCallback(remainingString, skipAutoClose) {
  const modifierCallback = getModifierCallback(remainingString, skipAutoClose);

  if (modifierCallback) {
    return modifierCallback;
  }

  const specialCharCallback = getSpecialCharCallback(remainingString);

  if (specialCharCallback) {
    return specialCharCallback;
  }

  return getTypeCallback(remainingString);
}

function getModifierCallback(remainingString, skipAutoClose) {
  const modifierKey = Object.keys(modifierCallbackMap).find(key => remainingString.startsWith(key));

  if (!modifierKey) {
    return null;
  }

  const callback = modifierCallbackMap[modifierKey]; // if this modifier has an associated "close" callback and the developer
  // doesn't close it themselves, then we close it for them automatically
  // Effectively if they send in: '{alt}a' then we type: '{alt}a{/alt}'

  if (!skipAutoClose && callback.closeName && !remainingString.includes(callback.closeName)) {
    remainingString += callback.closeName;
  }

  remainingString = remainingString.slice(modifierKey.length);
  return {
    callback,
    remainingString
  };
}

function getSpecialCharCallback(remainingString) {
  const specialChar = Object.keys(specialCharCallbackMap).find(key => remainingString.startsWith(key));

  if (!specialChar) {
    return null;
  }

  return {
    callback: specialCharCallbackMap[specialChar],
    remainingString: remainingString.slice(specialChar.length)
  };
}

function getTypeCallback(remainingString) {
  const character = remainingString[0];

  const callback = context => typeCharacter(character, context);

  return {
    callback,
    remainingString: remainingString.slice(1)
  };
}

function setSelectionRange({
  currentElement,
  newValue,
  newSelectionStart
}) {
  // if we *can* change the selection start, then we will if the new value
  // is the same as the current value (so it wasn't programatically changed
  // when the fireEvent.input was triggered).
  // The reason we have to do this at all is because it actually *is*
  // programmatically changed by fireEvent.input, so we have to simulate the
  // browser's default behavior
  const value = (0, _utils.getValue)(currentElement());

  if (value === newValue) {
    (0, _utils.setSelectionRangeIfNecessary)(currentElement(), newSelectionStart, newSelectionStart);
  } else {
    // If the currentValue is different than the expected newValue and we *can*
    // change the selection range, than we should set it to the length of the
    // currentValue to ensure that the browser behavior is mimicked.
    (0, _utils.setSelectionRangeIfNecessary)(currentElement(), value.length, value.length);
  }
}

function fireInputEventIfNeeded({
  currentElement,
  newValue,
  newSelectionStart,
  eventOverrides
}) {
  const prevValue = (0, _utils.getValue)(currentElement());

  if (!currentElement().readOnly && !(0, _utils.isClickableInput)(currentElement()) && newValue !== prevValue) {
    if ((0, _utils.isContentEditable)(currentElement())) {
      _dom.fireEvent.input(currentElement(), {
        target: {
          textContent: newValue
        },
        ...eventOverrides
      });
    } else {
      _dom.fireEvent.input(currentElement(), {
        target: {
          value: newValue
        },
        ...eventOverrides
      });
    }

    setSelectionRange({
      currentElement,
      newValue,
      newSelectionStart
    });
  }

  return {
    prevValue
  };
}

function typeCharacter(char, {
  currentElement,
  prevWasMinus = false,
  prevWasPeriod = false,
  prevValue = '',
  typedValue = '',
  eventOverrides
}) {
  const key = char; // TODO: check if this also valid for characters with diacritic markers e.g. úé etc

  const keyCode = char.charCodeAt(0);
  let nextPrevWasMinus, nextPrevWasPeriod;
  const textToBeTyped = typedValue + char;

  const keyDownDefaultNotPrevented = _dom.fireEvent.keyDown(currentElement(), {
    key,
    keyCode,
    which: keyCode,
    ...eventOverrides
  });

  if (keyDownDefaultNotPrevented) {
    const keyPressDefaultNotPrevented = _dom.fireEvent.keyPress(currentElement(), {
      key,
      keyCode,
      charCode: keyCode,
      ...eventOverrides
    });

    if ((0, _utils.getValue)(currentElement()) != null && keyPressDefaultNotPrevented) {
      let newEntry = char;

      if (prevWasMinus) {
        newEntry = `-${char}`;
      } else if (prevWasPeriod) {
        newEntry = `${prevValue}.${char}`;
      }

      if ((0, _utils.isValidDateValue)(currentElement(), textToBeTyped)) {
        newEntry = textToBeTyped;
      }

      const timeNewEntry = (0, _utils.buildTimeValue)(textToBeTyped);

      if ((0, _utils.isValidInputTimeValue)(currentElement(), timeNewEntry)) {
        newEntry = timeNewEntry;
      }

      const inputEvent = fireInputEventIfNeeded({ ...(0, _utils.calculateNewValue)(newEntry, currentElement()),
        eventOverrides: {
          data: key,
          inputType: 'insertText',
          ...eventOverrides
        },
        currentElement
      });
      prevValue = inputEvent.prevValue;

      if ((0, _utils.isValidDateValue)(currentElement(), textToBeTyped)) {
        _dom.fireEvent.change(currentElement(), {
          target: {
            value: textToBeTyped
          }
        });
      }

      fireChangeForInputTimeIfValid(currentElement, prevValue, timeNewEntry); // typing "-" into a number input will not actually update the value
      // so for the next character we type, the value should be set to
      // `-${newEntry}`
      // we also preserve the prevWasMinus when the value is unchanged due
      // to typing an invalid character (typing "-a3" results in "-3")
      // same applies for the decimal character.

      if (currentElement().type === 'number') {
        const newValue = (0, _utils.getValue)(currentElement());

        if (newValue === prevValue && newEntry !== '-') {
          nextPrevWasMinus = prevWasMinus;
        } else {
          nextPrevWasMinus = newEntry === '-';
        }

        if (newValue === prevValue && newEntry !== '.') {
          nextPrevWasPeriod = prevWasPeriod;
        } else {
          nextPrevWasPeriod = newEntry === '.';
        }
      }
    }
  }

  _dom.fireEvent.keyUp(currentElement(), {
    key,
    keyCode,
    which: keyCode,
    ...eventOverrides
  });

  return {
    prevWasMinus: nextPrevWasMinus,
    prevWasPeriod: nextPrevWasPeriod,
    prevValue,
    typedValue: textToBeTyped
  };
}

function fireChangeForInputTimeIfValid(currentElement, prevValue, timeNewEntry) {
  if ((0, _utils.isValidInputTimeValue)(currentElement(), timeNewEntry) && prevValue !== timeNewEntry) {
    _dom.fireEvent.change(currentElement(), {
      target: {
        value: timeNewEntry
      }
    });
  }
} // yes, calculateNewBackspaceValue and calculateNewValue look extremely similar
// and you may be tempted to create a shared abstraction.
// If you, brave soul, decide to so endevor, please increment this count
// when you inevitably fail: 1


function calculateNewBackspaceValue(element) {
  const {
    selectionStart,
    selectionEnd
  } = (0, _utils.getSelectionRange)(element);
  const value = (0, _utils.getValue)(element);
  let newValue, newSelectionStart;

  if (selectionStart === null) {
    // at the end of an input type that does not support selection ranges
    // https://github.com/testing-library/user-event/issues/316#issuecomment-639744793
    newValue = value.slice(0, value.length - 1);
    newSelectionStart = selectionStart - 1;
  } else if (selectionStart === selectionEnd) {
    if (selectionStart === 0) {
      // at the beginning of the input
      newValue = value;
      newSelectionStart = selectionStart;
    } else if (selectionStart === value.length) {
      // at the end of the input
      newValue = value.slice(0, value.length - 1);
      newSelectionStart = selectionStart - 1;
    } else {
      // in the middle of the input
      newValue = value.slice(0, selectionStart - 1) + value.slice(selectionEnd);
      newSelectionStart = selectionStart - 1;
    }
  } else {
    // we have something selected
    const firstPart = value.slice(0, selectionStart);
    newValue = firstPart + value.slice(selectionEnd);
    newSelectionStart = firstPart.length;
  }

  return {
    newValue,
    newSelectionStart
  };
}

function calculateNewDeleteValue(element) {
  const {
    selectionStart,
    selectionEnd
  } = (0, _utils.getSelectionRange)(element);
  const value = (0, _utils.getValue)(element);
  let newValue;

  if (selectionStart === null) {
    // at the end of an input type that does not support selection ranges
    // https://github.com/testing-library/user-event/issues/316#issuecomment-639744793
    newValue = value;
  } else if (selectionStart === selectionEnd) {
    if (selectionStart === 0) {
      // at the beginning of the input
      newValue = value.slice(1);
    } else if (selectionStart === value.length) {
      // at the end of the input
      newValue = value;
    } else {
      // in the middle of the input
      newValue = value.slice(0, selectionStart) + value.slice(selectionEnd + 1);
    }
  } else {
    // we have something selected
    const firstPart = value.slice(0, selectionStart);
    newValue = firstPart + value.slice(selectionEnd);
  }

  return {
    newValue,
    newSelectionStart: selectionStart
  };
}

function createModifierCallbackEntries({
  name,
  key,
  keyCode,
  modifierProperty
}) {
  const openName = `{${name}}`;
  const closeName = `{/${name}}`;

  function open({
    currentElement,
    eventOverrides
  }) {
    const newEventOverrides = {
      [modifierProperty]: true
    };

    _dom.fireEvent.keyDown(currentElement(), {
      key,
      keyCode,
      which: keyCode,
      ...eventOverrides,
      ...newEventOverrides
    });

    return {
      eventOverrides: newEventOverrides
    };
  }

  open.closeName = closeName;

  function close({
    currentElement,
    eventOverrides
  }) {
    const newEventOverrides = {
      [modifierProperty]: false
    };

    _dom.fireEvent.keyUp(currentElement(), {
      key,
      keyCode,
      which: keyCode,
      ...eventOverrides,
      ...newEventOverrides
    });

    return {
      eventOverrides: newEventOverrides
    };
  }

  return {
    [openName]: open,
    [closeName]: close
  };
}

function handleEnter({
  currentElement,
  eventOverrides
}) {
  const key = 'Enter';
  const keyCode = 13;

  const keyDownDefaultNotPrevented = _dom.fireEvent.keyDown(currentElement(), {
    key,
    keyCode,
    which: keyCode,
    ...eventOverrides
  });

  if (keyDownDefaultNotPrevented) {
    const keyPressDefaultNotPrevented = _dom.fireEvent.keyPress(currentElement(), {
      key,
      keyCode,
      charCode: keyCode,
      ...eventOverrides
    });

    if (keyPressDefaultNotPrevented) {
      if ((0, _utils.isClickableInput)(currentElement()) || // Links with href defined should handle Enter the same as a click
      (0, _utils.isInstanceOfElement)(currentElement(), 'HTMLAnchorElement') && currentElement().href) {
        _dom.fireEvent.click(currentElement(), { ...eventOverrides
        });
      }

      if (currentElement().tagName === 'TEXTAREA') {
        const {
          newValue,
          newSelectionStart
        } = (0, _utils.calculateNewValue)('\n', currentElement());

        _dom.fireEvent.input(currentElement(), {
          target: {
            value: newValue
          },
          inputType: 'insertLineBreak',
          ...eventOverrides
        });

        setSelectionRange({
          currentElement,
          newValue,
          newSelectionStart
        });
      }

      if (currentElement().tagName === 'INPUT' && currentElement().form && (currentElement().form.querySelectorAll('input').length === 1 || currentElement().form.querySelector('input[type="submit"]') || currentElement().form.querySelector('button[type="submit"]'))) {
        _dom.fireEvent.submit(currentElement().form);
      }
    }
  }

  _dom.fireEvent.keyUp(currentElement(), {
    key,
    keyCode,
    which: keyCode,
    ...eventOverrides
  });
}

function handleEsc({
  currentElement,
  eventOverrides
}) {
  const key = 'Escape';
  const keyCode = 27;

  _dom.fireEvent.keyDown(currentElement(), {
    key,
    keyCode,
    which: keyCode,
    ...eventOverrides
  }); // NOTE: Browsers do not fire a keypress on meta key presses


  _dom.fireEvent.keyUp(currentElement(), {
    key,
    keyCode,
    which: keyCode,
    ...eventOverrides
  });
}

function handleDel({
  currentElement,
  eventOverrides
}) {
  const key = 'Delete';
  const keyCode = 46;

  const keyPressDefaultNotPrevented = _dom.fireEvent.keyDown(currentElement(), {
    key,
    keyCode,
    which: keyCode,
    ...eventOverrides
  });

  if (keyPressDefaultNotPrevented) {
    fireInputEventIfNeeded({ ...calculateNewDeleteValue(currentElement()),
      eventOverrides: {
        inputType: 'deleteContentForward',
        ...eventOverrides
      },
      currentElement
    });
  }

  _dom.fireEvent.keyUp(currentElement(), {
    key,
    keyCode,
    which: keyCode,
    ...eventOverrides
  });
}

function handleBackspace({
  currentElement,
  eventOverrides
}) {
  const key = 'Backspace';
  const keyCode = 8;

  const keyPressDefaultNotPrevented = _dom.fireEvent.keyDown(currentElement(), {
    key,
    keyCode,
    which: keyCode,
    ...eventOverrides
  });

  if (keyPressDefaultNotPrevented) {
    fireInputEventIfNeeded({ ...calculateNewBackspaceValue(currentElement()),
      eventOverrides: {
        inputType: 'deleteContentBackward',
        ...eventOverrides
      },
      currentElement
    });
  }

  _dom.fireEvent.keyUp(currentElement(), {
    key,
    keyCode,
    which: keyCode,
    ...eventOverrides
  });
}

function handleSelectall({
  currentElement
}) {
  currentElement().setSelectionRange(0, (0, _utils.getValue)(currentElement()).length);
}

function handleSpace(context) {
  if ((0, _utils.isClickableInput)(context.currentElement())) {
    handleSpaceOnClickable(context);
    return;
  }

  typeCharacter(' ', context);
}

function handleSpaceOnClickable({
  currentElement,
  eventOverrides
}) {
  const key = ' ';
  const keyCode = 32;

  const keyDownDefaultNotPrevented = _dom.fireEvent.keyDown(currentElement(), {
    key,
    keyCode,
    which: keyCode,
    ...eventOverrides
  });

  if (keyDownDefaultNotPrevented) {
    _dom.fireEvent.keyPress(currentElement(), {
      key,
      keyCode,
      charCode: keyCode,
      ...eventOverrides
    });
  }

  const keyUpDefaultNotPrevented = _dom.fireEvent.keyUp(currentElement(), {
    key,
    keyCode,
    which: keyCode,
    ...eventOverrides
  });

  if (keyDownDefaultNotPrevented && keyUpDefaultNotPrevented) {
    _dom.fireEvent.click(currentElement(), { ...eventOverrides
    });
  }
}

function handleArrowDown({
  currentElement,
  eventOverrides
}) {
  const key = 'ArrowDown';
  const keyCode = 40;

  _dom.fireEvent.keyDown(currentElement(), {
    key,
    keyCode,
    which: keyCode,
    ...eventOverrides
  });

  _dom.fireEvent.keyUp(currentElement(), {
    key,
    keyCode,
    which: keyCode,
    ...eventOverrides
  });
}

function handleArrowUp({
  currentElement,
  eventOverrides
}) {
  const key = 'ArrowUp';
  const keyCode = 38;

  _dom.fireEvent.keyDown(currentElement(), {
    key,
    keyCode,
    which: keyCode,
    ...eventOverrides
  });

  _dom.fireEvent.keyUp(currentElement(), {
    key,
    keyCode,
    which: keyCode,
    ...eventOverrides
  });
}