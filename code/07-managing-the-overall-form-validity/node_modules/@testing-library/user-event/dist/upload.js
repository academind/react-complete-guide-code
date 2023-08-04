"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upload = upload;

var _dom = require("@testing-library/dom");

var _click = require("./click");

var _blur = require("./blur");

var _focus = require("./focus");

function upload(element, fileOrFiles, init, {
  applyAccept = false
} = {}) {
  if (element.disabled) return;
  (0, _click.click)(element, init);
  const input = element.tagName === 'LABEL' ? element.control : element;
  const files = (Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles]).filter(file => !applyAccept || isAcceptableFile(file, element.accept)).slice(0, input.multiple ? undefined : 1); // blur fires when the file selector pops up

  (0, _blur.blur)(element, init); // focus fires when they make their selection

  (0, _focus.focus)(element, init); // do not fire an input event if the file selection does not change

  if (files.length === input.files.length && files.every((f, i) => f === input.files.item(i))) {
    return;
  } // the event fired in the browser isn't actually an "input" or "change" event
  // but a new Event with a type set to "input" and "change"
  // Kinda odd...


  const inputFiles = {
    length: files.length,
    item: index => files[index],
    ...files
  };
  (0, _dom.fireEvent)(input, (0, _dom.createEvent)('input', input, {
    target: {
      files: inputFiles
    },
    bubbles: true,
    cancelable: false,
    composed: true,
    ...init
  }));

  _dom.fireEvent.change(input, {
    target: {
      files: inputFiles
    },
    ...init
  });
}

function isAcceptableFile(file, accept) {
  if (!accept) {
    return true;
  }

  const wildcards = ['audio/*', 'image/*', 'video/*'];
  return accept.split(',').some(acceptToken => {
    if (acceptToken[0] === '.') {
      // tokens starting with a dot represent a file extension
      return file.name.endsWith(acceptToken);
    } else if (wildcards.includes(acceptToken)) {
      return file.type.startsWith(acceptToken.substr(0, acceptToken.length - 1));
    }

    return file.type === acceptToken;
  });
}