<div align="center">
<h1>@testing-library/user-event</h1>

<a href="https://www.joypixels.com/profiles/emoji/1f415">
  <img
    height="80"
    width="80"
    alt="dog"
    src="https://raw.githubusercontent.com/testing-library/user-event/master/other/dog.png"
  />
</a>

<p>Fire events the same way the user does</p>
</div>

---

<!-- prettier-ignore-start -->
[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npmtrends]
[![MIT License][license-badge]][license]
[![All Contributors][all-contributors-badge]](#contributors)
[![PRs Welcome][prs-badge]][prs]
[![Code of Conduct][coc-badge]][coc]
<!-- prettier-ignore-end -->

## The problem

From
[testing-library/dom-testing-library#107](https://github.com/testing-library/dom-testing-library/issues/107):

> [...] it is becoming apparent the need to express user actions on a web page
> using a higher-level abstraction than `fireEvent`

## The solution

`user-event` tries to simulate the real events that would happen in the browser
as the user interacts with it. For example `userEvent.click(checkbox)` would
change the state of the checkbox.

**The library is still a work in progress and any help is appreciated.**

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [API](#api)
  - [`click(element, eventInit, options)`](#clickelement-eventinit-options)
  - [`dblClick(element, eventInit, options)`](#dblclickelement-eventinit-options)
  - [`type(element, text, [options])`](#typeelement-text-options)
  - [`upload(element, file, [{ clickInit, changeInit }])`](#uploadelement-file--clickinit-changeinit-)
  - [`clear(element)`](#clearelement)
  - [`selectOptions(element, values)`](#selectoptionselement-values)
  - [`deselectOptions(element, values)`](#deselectoptionselement-values)
  - [`tab({shift, focusTrap})`](#tabshift-focustrap)
  - [`hover(element)`](#hoverelement)
  - [`unhover(element)`](#unhoverelement)
  - [`paste(element, text, eventInit, options)`](#pasteelement-text-eventinit-options)
  - [`specialChars`](#specialchars)
- [Issues](#issues)
  - [🐛 Bugs](#-bugs)
  - [💡 Feature Requests](#-feature-requests)
- [Contributors ✨](#contributors-)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

With NPM:

```sh
npm install @testing-library/user-event @testing-library/dom --save-dev
```

With Yarn:

```sh
yarn add @testing-library/user-event @testing-library/dom --dev
```

Now simply import it in your tests:

```js
import userEvent from '@testing-library/user-event'

// or

const {default: userEvent} = require('@testing-library/user-event')
```

## API

Note: All userEvent methods are synchronous with one exception: when `delay`
with `userEvent.type` as described below). We also discourage using `userEvent`
inside `before/after` blocks at all, for important reasons described in
["Avoid Nesting When You're Testing"](https://kentcdodds.com/blog/avoid-nesting-when-youre-testing).

### `click(element, eventInit, options)`

Clicks `element`, depending on what `element` is it can have different side
effects.

```jsx
import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('click', () => {
  render(
    <div>
      <label htmlFor="checkbox">Check</label>
      <input id="checkbox" type="checkbox" />
    </div>,
  )

  userEvent.click(screen.getByText('Check'))
  expect(screen.getByLabelText('Check')).toBeChecked()
})
```

You can also ctrlClick / shiftClick etc with

```js
userEvent.click(elem, {ctrlKey: true, shiftKey: true})
```

See the
[`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent)
constructor documentation for more options.

Note that `click` will trigger hover events before clicking. To disable this,
set the `skipHover` option to `true`.

### `dblClick(element, eventInit, options)`

Clicks `element` twice, depending on what `element` is it can have different
side effects.

```jsx
import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('double click', () => {
  const onChange = jest.fn()
  render(<input type="checkbox" onChange={onChange} />)
  const checkbox = screen.getByRole('checkbox')
  userEvent.dblClick(checkbox)
  expect(onChange).toHaveBeenCalledTimes(2)
  expect(checkbox).not.toBeChecked()
})
```

### `type(element, text, [options])`

Writes `text` inside an `<input>` or a `<textarea>`.

```jsx
import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('type', () => {
  render(<textarea />)

  userEvent.type(screen.getByRole('textbox'), 'Hello,{enter}World!')
  expect(screen.getByRole('textbox')).toHaveValue('Hello,\nWorld!')
})
```

`options.delay` is the number of milliseconds that pass between two characters
are typed. By default it's 0. You can use this option if your component has a
different behavior for fast or slow users. If you do this, you need to make sure
to `await`!

> To be clear, `userEvent.type` _always_ returns a promise, but you _only_ need
> to `await` the promise it returns if you're using the `delay` option.
> Otherwise everything runs synchronously and you can ignore the promise.

`type` will click the element before typing. To disable this, set the
`skipClick` option to `true`.

#### Special characters

The following special character strings are supported:

| Text string    | Key        | Modifier           | Notes                                                                                                                                                               |
| -------------- | ---------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{enter}`      | Enter      | N/A                | Will insert a newline character (`<textarea />` only).                                                                                                              |
| `{space}`      | `' '`      | N/A                |                                                                                                                                                                     |
| `{esc}`        | Escape     | N/A                |                                                                                                                                                                     |
| `{backspace}`  | Backspace  | N/A                | Will delete the previous character (or the characters within the `selectedRange`, see example below).                                                               |
| `{del}`        | Delete     | N/A                | Will delete the next character (or the characters within the `selectedRange`, see example below)                                                                    |
| `{selectall}`  | N/A        | N/A                | Selects all the text of the element. Note that this will only work for elements that support selection ranges (so, not `email`, `password`, `number`, among others) |
| `{arrowleft}`  | ArrowLeft  | N/A                |                                                                                                                                                                     |
| `{arrowright}` | ArrowRight | N/A                |                                                                                                                                                                     |
| `{arrowup}`    | ArrowUp    | N/A                |                                                                                                                                                                     |
| `{arrowdown}`  | ArrowDown  | N/A                |                                                                                                                                                                     |
| `{home}`       | Home       | N/A                |                                                                                                                                                                     |
| `{end}`        | End        | N/A                |                                                                                                                                                                     |
| `{shift}`      | Shift      | `shiftKey`         | Does **not** capitalize following characters.                                                                                                                       |
| `{ctrl}`       | Control    | `ctrlKey`          |                                                                                                                                                                     |
| `{alt}`        | Alt        | `altKey`           |                                                                                                                                                                     |
| `{meta}`       | OS         | `metaKey`          |                                                                                                                                                                     |
| `{capslock}`   | CapsLock   | `modifierCapsLock` | Fires both keydown and keyup when used (simulates a user clicking their "Caps Lock" button to enable caps lock).                                                    |

> **A note about modifiers:** Modifier keys (`{shift}`, `{ctrl}`, `{alt}`,
> `{meta}`) will activate their corresponding event modifiers for the duration
> of type command or until they are closed (via `{/shift}`, `{/ctrl}`, etc.). If
> they are not closed explicitly, then events will be fired to close them
> automatically (to disable this, set the `skipAutoClose` option to `true`).

<!-- space out these notes -->

> We take the same
> [stance as Cypress](https://docs.cypress.io/api/commands/type.html#Modifiers)
> in that we do not simulate the behavior that happens with modifier key
> combinations as different operating systems function differently in this
> regard.

An example of an usage with a selection range:

```jsx
import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('delete characters within the selectedRange', () => {
  render(
    <div>
      <label htmlFor="my-input">Example:</label>
      <input id="my-input" type="text" value="This is a bad example" />
    </div>,
  )
  const input = screen.getByLabelText(/example/i)
  input.setSelectionRange(10, 13)
  userEvent.type(input, '{backspace}good')

  expect(input).toHaveValue('This is a good example')
})
```

#### <input type="time" /> support

The following is an example of usage of this library with
`<input type="time" />`

```jsx
import React from 'react
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('types into the input', () => {
  render(
    <>
      <label for="time">Enter a time</label>
      <input
        type="time"
        id="time"
      />
    </>
  )
  const input = screen.getByLabelText(/enter a time/i)
  userEvent.type(input, '13:58')
  expect(input.value).toBe('13:58')
})
```

### `upload(element, file, [{ clickInit, changeInit }], [options])`

Uploads file to an `<input>`. For uploading multiple files use `<input>` with
`multiple` attribute and the second `upload` argument must be array then. Also
it's possible to initialize click or change event with using third argument.

If `options.applyAccept` is set to `true` and there is an `accept` attribute on
the element, files that don't match will be discarded.

```jsx
import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('upload file', () => {
  const file = new File(['hello'], 'hello.png', {type: 'image/png'})

  render(
    <div>
      <label htmlFor="file-uploader">Upload file:</label>
      <input id="file-uploader" type="file" />
    </div>,
  )
  const input = screen.getByLabelText(/upload file/i)
  userEvent.upload(input, file)

  expect(input.files[0]).toStrictEqual(file)
  expect(input.files.item(0)).toStrictEqual(file)
  expect(input.files).toHaveLength(1)
})

test('upload multiple files', () => {
  const files = [
    new File(['hello'], 'hello.png', {type: 'image/png'}),
    new File(['there'], 'there.png', {type: 'image/png'}),
  ]

  render(
    <div>
      <label htmlFor="file-uploader">Upload file:</label>
      <input id="file-uploader" type="file" multiple />
    </div>,
  )
  const input = screen.getByLabelText(/upload file/i)
  userEvent.upload(input, files)

  expect(input.files).toHaveLength(2)
  expect(input.files[0]).toStrictEqual(files[0])
  expect(input.files[1]).toStrictEqual(files[1])
})
```

### `clear(element)`

Selects the text inside an `<input>` or `<textarea>` and deletes it.

```jsx
import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('clear', () => {
  render(<textarea value="Hello, World!" />)

  userEvent.clear(screen.getByRole('textbox', 'email'))
  expect(screen.getByRole('textbox', 'email')).toHaveAttribute('value', '')
})
```

### `selectOptions(element, values)`

Selects the specified option(s) of a `<select>` or a `<select multiple>`
element.

```jsx
import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('selectOptions', () => {
  render(
    <select multiple data-testid="select-multiple">
      <option data-testid="val1" value="1">
        A
      </option>
      <option data-testid="val2" value="2">
        B
      </option>
      <option data-testid="val3" value="3">
        C
      </option>
    </select>,
  )

  userEvent.selectOptions(screen.getByTestId('select-multiple'), ['1', '3'])

  expect(screen.getByTestId('val1').selected).toBe(true)
  expect(screen.getByTestId('val2').selected).toBe(false)
  expect(screen.getByTestId('val3').selected).toBe(true)
})
```

The `values` parameter can be either an array of values or a singular scalar
value.

It also accepts option nodes:

```js
userEvent.selectOptions(screen.getByTestId('select-multiple'), [
  screen.getByText('A'),
  screen.getByText('B'),
])
```

### `deselectOptions(element, values)`

Remove the selection for the specified option(s) of a `<select multiple>`
element.

```jsx
import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('deselectOptions', () => {
  render(
    <select multiple>
      <option value="1">A</option>
      <option value="2">B</option>
      <option value="3">C</option>
    </select>,
  )

  userEvent.selectOptions(screen.getByRole('listbox'), '2')
  expect(screen.getByText('B').selected).toBe(true)
  userEvent.deselectOptions(screen.getByRole('listbox'), '2')
  expect(screen.getByText('B').selected).toBe(false)
  // can do multiple at once as well:
  // userEvent.deselectOptions(screen.getByRole('listbox'), ['1', '2'])
})
```

The `values` parameter can be either an array of values or a singular scalar
value.

### `tab({shift, focusTrap})`

Fires a tab event changing the document.activeElement in the same way the
browser does.

Options:

- `shift` (default `false`) can be true or false to invert tab direction.
- `focusTrap` (default `document`) a container element to restrict the tabbing
  within.

> **A note about tab**:
> [jsdom does not support tabbing](https://github.com/jsdom/jsdom/issues/2102),
> so this feature is a way to enable tests to verify tabbing from the end user's
> perspective. However, this limitation in jsdom will mean that components like
> [focus-trap-react](https://github.com/davidtheclark/focus-trap-react) will not
> work with `userEvent.tab()` or jsdom. For that reason, the `focusTrap` option
> is available to let you ensure your user is restricted within a focus-trap.

```jsx
import React from 'react'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'

it('should cycle elements in document tab order', () => {
  render(
    <div>
      <input data-testid="element" type="checkbox" />
      <input data-testid="element" type="radio" />
      <input data-testid="element" type="number" />
    </div>,
  )

  const [checkbox, radio, number] = screen.getAllByTestId('element')

  expect(document.body).toHaveFocus()

  userEvent.tab()

  expect(checkbox).toHaveFocus()

  userEvent.tab()

  expect(radio).toHaveFocus()

  userEvent.tab()

  expect(number).toHaveFocus()

  userEvent.tab()

  // cycle goes back to the body element
  expect(document.body).toHaveFocus()

  userEvent.tab()

  expect(checkbox).toHaveFocus()
})
```

### `hover(element)`

Hovers over `element`.

```jsx
import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Tooltip from '../tooltip'

test('hover', () => {
  const messageText = 'Hello'
  render(
    <Tooltip messageText={messageText}>
      <TrashIcon aria-label="Delete" />
    </Tooltip>,
  )

  userEvent.hover(screen.getByLabelText(/delete/i))
  expect(screen.getByText(messageText)).toBeInTheDocument()
  userEvent.unhover(screen.getByLabelText(/delete/i))
  expect(screen.queryByText(messageText)).not.toBeInTheDocument()
})
```

### `unhover(element)`

Unhovers out of `element`.

> See [above](#hoverelement) for an example

### `paste(element, text, eventInit, options)`

Allows you to simulate the user pasting some text into an input.

```javascript
test('should paste text in input', () => {
  render(<MyInput />)

  const text = 'Hello, world!'
  userEvent.paste(getByRole('textbox', {name: /paste your greeting/i}), text)
  expect(element).toHaveValue(text)
})
```

You can use the `eventInit` if what you're pasting should have `clipboardData`
(like `files`).

### `specialChars`

A handful set of special characters used in [type](#typeelement-text-options)
method.

| Key        | Character      |
| ---------- | -------------- |
| arrowLeft  | `{arrowleft}`  |
| arrowRight | `{arrowright}` |
| arrowDown  | `{arrowdown}`  |
| arrowUp    | `{arrowup}`    |
| home       | `{home}`       |
| end        | `{end}`        |
| enter      | `{enter}`      |
| escape     | `{esc}`        |
| delete     | `{del}`        |
| backspace  | `{backspace}`  |
| selectAll  | `{selectall}`  |
| space      | `{space}`      |
| whitespace | `' '`          |

Usage example:

```jsx
import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent, {specialChars} from '@testing-library/user-event'

test('delete characters within the selectedRange', () => {
  render(
    <div>
      <label htmlFor="my-input">Example:</label>
      <input id="my-input" type="text" value="This is a bad example" />
    </div>,
  )
  const input = screen.getByLabelText(/example/i)
  input.setSelectionRange(10, 13)
  userEvent.type(input, `${specialChars.backspace}good`)

  expect(input).toHaveValue('This is a good example')
})
```

## Issues

_Looking to contribute? Look for the [Good First Issue][good-first-issue]
label._

### 🐛 Bugs

Please file an issue for bugs, missing documentation, or unexpected behavior.

[**See Bugs**][bugs]

### 💡 Feature Requests

Please file an issue to suggest new features. Vote on feature requests by adding
a 👍. This helps maintainers prioritize what to work on.

[**See Feature Requests**][requests]

## Contributors ✨

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://twitter.com/Gpx"><img src="https://avatars0.githubusercontent.com/u/767959?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Giorgio Polvara</b></sub></a><br /><a href="https://github.com/testing-library/user-event/issues?q=author%3AGpx" title="Bug reports">🐛</a> <a href="https://github.com/testing-library/user-event/commits?author=Gpx" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=Gpx" title="Documentation">📖</a> <a href="#ideas-Gpx" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-Gpx" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/testing-library/user-event/pulls?q=is%3Apr+reviewed-by%3AGpx" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/testing-library/user-event/commits?author=Gpx" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/weyert"><img src="https://avatars3.githubusercontent.com/u/7049?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Weyert de Boer</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=weyert" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=weyert" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/twhitbeck"><img src="https://avatars2.githubusercontent.com/u/762471?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tim Whitbeck</b></sub></a><br /><a href="https://github.com/testing-library/user-event/issues?q=author%3Atwhitbeck" title="Bug reports">🐛</a> <a href="https://github.com/testing-library/user-event/commits?author=twhitbeck" title="Code">💻</a></td>
    <td align="center"><a href="https://michaeldeboey.be"><img src="https://avatars3.githubusercontent.com/u/6643991?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Michaël De Boey</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=MichaelDeBoey" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/michaellasky"><img src="https://avatars2.githubusercontent.com/u/6646599?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Michael Lasky</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=michaellasky" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=michaellasky" title="Documentation">📖</a> <a href="#ideas-michaellasky" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/shomalgan"><img src="https://avatars0.githubusercontent.com/u/2883620?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ahmad Esmaeilzadeh</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=shomalgan" title="Documentation">📖</a></td>
    <td align="center"><a href="https://calebeby.ml"><img src="https://avatars1.githubusercontent.com/u/13206945?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Caleb Eby</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=calebeby" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/issues?q=author%3Acalebeby" title="Bug reports">🐛</a> <a href="https://github.com/testing-library/user-event/pulls?q=is%3Apr+reviewed-by%3Acalebeby" title="Reviewed Pull Requests">👀</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://afontcu.dev"><img src="https://avatars0.githubusercontent.com/u/9197791?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Adrià Fontcuberta</b></sub></a><br /><a href="https://github.com/testing-library/user-event/issues?q=author%3Aafontcu" title="Bug reports">🐛</a> <a href="https://github.com/testing-library/user-event/commits?author=afontcu" title="Tests">⚠️</a> <a href="https://github.com/testing-library/user-event/commits?author=afontcu" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/skywickenden"><img src="https://avatars2.githubusercontent.com/u/4930551?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sky Wickenden</b></sub></a><br /><a href="https://github.com/testing-library/user-event/issues?q=author%3Askywickenden" title="Bug reports">🐛</a> <a href="https://github.com/testing-library/user-event/commits?author=skywickenden" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/bogdanbodnar"><img src="https://avatars2.githubusercontent.com/u/9034868?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Bodnar Bogdan</b></sub></a><br /><a href="https://github.com/testing-library/user-event/issues?q=author%3Abogdanbodnar" title="Bug reports">🐛</a> <a href="https://github.com/testing-library/user-event/commits?author=bogdanbodnar" title="Code">💻</a></td>
    <td align="center"><a href="https://zach.website"><img src="https://avatars0.githubusercontent.com/u/1699281?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Zach Perrault</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=zperrault" title="Documentation">📖</a></td>
    <td align="center"><a href="https://twitter.com/ryanastelly"><img src="https://avatars1.githubusercontent.com/u/4138357?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ryan Stelly</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=FLGMwt" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/benmonro"><img src="https://avatars3.githubusercontent.com/u/399236?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ben Monro</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=benmonro" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/GentlemanHal"><img src="https://avatars2.githubusercontent.com/u/415521?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Christopher Martin</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=GentlemanHal" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://fullgallop.me"><img src="https://avatars0.githubusercontent.com/u/32252769?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Yuancheng Wu</b></sub></a><br /><a href="https://github.com/testing-library/user-event/pulls?q=is%3Apr+reviewed-by%3AYuanchengWu" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/maheshjag"><img src="https://avatars0.githubusercontent.com/u/1705603?v=4?s=100" width="100px;" alt=""/><br /><sub><b>MJ</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=maheshjag" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/jmcriffey"><img src="https://avatars0.githubusercontent.com/u/2831294?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jeff McRiffey</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=jmcriffey" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=jmcriffey" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://jagascript.com"><img src="https://avatars0.githubusercontent.com/u/4562878?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jaga Santagostino</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=kandros" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=kandros" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://jordy.app"><img src="https://avatars3.githubusercontent.com/u/12712484?v=4?s=100" width="100px;" alt=""/><br /><sub><b>jordyvandomselaar</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=jordyvandomselaar" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=jordyvandomselaar" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://lyamkin.com"><img src="https://avatars2.githubusercontent.com/u/3854930?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ilya Lyamkin</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=ilyamkin" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=ilyamkin" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://todofullstack.com"><img src="https://avatars2.githubusercontent.com/u/4474353?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kenneth Luján Rosas</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=klujanrosas" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=klujanrosas" title="Tests">⚠️</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://thejoemorgan.com"><img src="https://avatars1.githubusercontent.com/u/2388943?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Joe Morgan</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=jsmapr1" title="Code">💻</a></td>
    <td align="center"><a href="https://twitter.com/wachunga"><img src="https://avatars0.githubusercontent.com/u/438545?v=4?s=100" width="100px;" alt=""/><br /><sub><b>David Hirtle</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=wachunga" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/bdh1011"><img src="https://avatars2.githubusercontent.com/u/8446067?v=4?s=100" width="100px;" alt=""/><br /><sub><b>whiteUnicorn</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=bdh1011" title="Code">💻</a></td>
    <td align="center"><a href="https://www.matej.snuderl.si/"><img src="https://avatars3.githubusercontent.com/u/8524109?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Matej Šnuderl</b></sub></a><br /><a href="https://github.com/testing-library/user-event/pulls?q=is%3Apr+reviewed-by%3AMeemaw" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://pomb.us"><img src="https://avatars1.githubusercontent.com/u/1911623?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Rodrigo Pombo</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=pomber" title="Code">💻</a></td>
    <td align="center"><a href="http://github.com/Raynos"><img src="https://avatars3.githubusercontent.com/u/479538?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jake Verbaten</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=Raynos" title="Code">💻</a></td>
    <td align="center"><a href="https://skovy.dev"><img src="https://avatars1.githubusercontent.com/u/5247455?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Spencer Miskoviak</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=skovy" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://proling.ru/"><img src="https://avatars2.githubusercontent.com/u/16336572?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Vadim Shvetsov</b></sub></a><br /><a href="#ideas-vadimshvetsov" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/testing-library/user-event/commits?author=vadimshvetsov" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=vadimshvetsov" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/9still"><img src="https://avatars0.githubusercontent.com/u/4924760?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Greg Shtilman</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=9still" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=9still" title="Tests">⚠️</a> <a href="https://github.com/testing-library/user-event/issues?q=author%3A9still" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/rbusquet"><img src="https://avatars1.githubusercontent.com/u/7198302?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ricardo Busquet</b></sub></a><br /><a href="https://github.com/testing-library/user-event/issues?q=author%3Arbusquet" title="Bug reports">🐛</a> <a href="https://github.com/testing-library/user-event/commits?author=rbusquet" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=rbusquet" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://www.linkedin.com/in/dougbacelar/en"><img src="https://avatars3.githubusercontent.com/u/9267678?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Doug Bacelar</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=dougbacelar" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=dougbacelar" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/kayleighridd"><img src="https://avatars3.githubusercontent.com/u/36446015?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kayleigh Ridd</b></sub></a><br /><a href="https://github.com/testing-library/user-event/issues?q=author%3Akayleighridd" title="Bug reports">🐛</a> <a href="https://github.com/testing-library/user-event/commits?author=kayleighridd" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=kayleighridd" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://malcolmkee.com"><img src="https://avatars0.githubusercontent.com/u/24528512?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Malcolm Kee</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=malcolm-kee" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=malcolm-kee" title="Documentation">📖</a> <a href="https://github.com/testing-library/user-event/commits?author=malcolm-kee" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/kelvinlzhang"><img src="https://avatars3.githubusercontent.com/u/8291294?v=4?s=100" width="100px;" alt=""/><br /><sub><b>kelvinlzhang</b></sub></a><br /><a href="https://github.com/testing-library/user-event/issues?q=author%3Akelvinlzhang" title="Bug reports">🐛</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/krzysztof-hellostudio"><img src="https://avatars3.githubusercontent.com/u/1942664?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Krzysztof</b></sub></a><br /><a href="https://github.com/testing-library/user-event/issues?q=author%3Akrzysztof-hellostudio" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/hontas"><img src="https://avatars2.githubusercontent.com/u/1521113?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Pontus Lundin</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=hontas" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=hontas" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://hudochenkov.com/"><img src="https://avatars2.githubusercontent.com/u/654597?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Aleks Hudochenkov</b></sub></a><br /><a href="https://github.com/testing-library/user-event/issues?q=author%3Ahudochenkov" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/nanivijay"><img src="https://avatars0.githubusercontent.com/u/5945591?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Vijay Kumar Otti</b></sub></a><br /><a href="https://github.com/testing-library/user-event/issues?q=author%3Ananivijay" title="Bug reports">🐛</a></td>
    <td align="center"><a href="http://tompicton.com"><img src="https://avatars2.githubusercontent.com/u/12588098?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tom Picton</b></sub></a><br /><a href="https://github.com/testing-library/user-event/issues?q=author%3Atpict" title="Bug reports">🐛</a> <a href="https://github.com/testing-library/user-event/commits?author=tpict" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=tpict" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://hung.dev"><img src="https://avatars3.githubusercontent.com/u/8603085?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Hung Viet Nguyen</b></sub></a><br /><a href="https://github.com/testing-library/user-event/issues?q=author%3Anvh95" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://nickmccurdy.com/"><img src="https://avatars0.githubusercontent.com/u/927220?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nick McCurdy</b></sub></a><br /><a href="#projectManagement-nickmccurdy" title="Project Management">📆</a> <a href="#question-nickmccurdy" title="Answering Questions">💬</a> <a href="https://github.com/testing-library/user-event/commits?author=nickmccurdy" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=nickmccurdy" title="Tests">⚠️</a> <a href="https://github.com/testing-library/user-event/commits?author=nickmccurdy" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://timdeschryver.dev"><img src="https://avatars1.githubusercontent.com/u/28659384?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tim Deschryver</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=timdeschryver" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/ben-dyer"><img src="https://avatars2.githubusercontent.com/u/43922444?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ben Dyer</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=ben-dyer" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=ben-dyer" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://twitter.com/herecydev"><img src="https://avatars1.githubusercontent.com/u/11328618?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Dan Kirkham</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=herecydev" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Johannesklint"><img src="https://avatars3.githubusercontent.com/u/16774845?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Johannesklint</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=Johannesklint" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/juanca"><img src="https://avatars0.githubusercontent.com/u/841084?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Juan Carlos Medina</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=juanca" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=juanca" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/WretchedDade"><img src="https://avatars0.githubusercontent.com/u/17183431?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Dade Cook</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=WretchedDade" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=WretchedDade" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://blog.lourenci.com/"><img src="https://avatars3.githubusercontent.com/u/2339362?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Leandro Lourenci</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=lourenci" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=lourenci" title="Tests">⚠️</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/marcosvega91"><img src="https://avatars2.githubusercontent.com/u/5365582?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Marco Moretti</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=marcosvega91" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=marcosvega91" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/ybentz"><img src="https://avatars3.githubusercontent.com/u/14811577?v=4?s=100" width="100px;" alt=""/><br /><sub><b>ybentz</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=ybentz" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=ybentz" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://www.lemoncode.net/"><img src="https://avatars2.githubusercontent.com/u/4374977?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nasdan</b></sub></a><br /><a href="https://github.com/testing-library/user-event/issues?q=author%3ANasdan" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/JavierMartinz"><img src="https://avatars1.githubusercontent.com/u/1155507?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Javier Martínez</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=JavierMartinz" title="Documentation">📖</a></td>
    <td align="center"><a href="http://www.visualjerk.de"><img src="https://avatars0.githubusercontent.com/u/28823153?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jörg Bayreuther</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=visualjerk" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=visualjerk" title="Tests">⚠️</a> <a href="https://github.com/testing-library/user-event/commits?author=visualjerk" title="Documentation">📖</a></td>
    <td align="center"><a href="https://ko-fi.com/thislucas"><img src="https://avatars0.githubusercontent.com/u/8645841?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lucas Bernalte</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=lucbpz" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/maxnewlands"><img src="https://avatars3.githubusercontent.com/u/1304166?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Maxwell Newlands</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=maxnewlands" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=maxnewlands" title="Tests">⚠️</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/ph-fritsche"><img src="https://avatars3.githubusercontent.com/u/39068198?v=4?s=100" width="100px;" alt=""/><br /><sub><b>ph-fritsche</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=ph-fritsche" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=ph-fritsche" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/reywright"><img src="https://avatars3.githubusercontent.com/u/708820?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Rey Wright</b></sub></a><br /><a href="https://github.com/testing-library/user-event/issues?q=author%3Areywright" title="Bug reports">🐛</a> <a href="https://github.com/testing-library/user-event/commits?author=reywright" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/mischnic"><img src="https://avatars1.githubusercontent.com/u/4586894?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Niklas Mischkulnig</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=mischnic" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=mischnic" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://pascalduez.me"><img src="https://avatars3.githubusercontent.com/u/335467?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Pascal Duez</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=pascalduez" title="Code">💻</a></td>
    <td align="center"><a href="http://malachi.dev"><img src="https://avatars3.githubusercontent.com/u/10888943?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Malachi Willey</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=malwilley" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=malwilley" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://clarkwinters.com"><img src="https://avatars2.githubusercontent.com/u/40615752?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Clark Winters</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=cwinters8" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/lazytype"><img src="https://avatars1.githubusercontent.com/u/840985?v=4?s=100" width="100px;" alt=""/><br /><sub><b>lazytype</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=lazytype" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=lazytype" title="Tests">⚠️</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://www.linkedin.com/in/luis-takahashi/"><img src="https://avatars0.githubusercontent.com/u/19766035?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Luís Takahashi</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=luistak" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=luistak" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/jesujcastillom"><img src="https://avatars3.githubusercontent.com/u/7827281?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jesu Castillo</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=jesujcastillom" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=jesujcastillom" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://sarahdayan.dev"><img src="https://avatars1.githubusercontent.com/u/5370675?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sarah Dayan</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=sarahdayan" title="Documentation">📖</a></td>
    <td align="center"><a href="http://saul-mirone.github.io/"><img src="https://avatars0.githubusercontent.com/u/10047788?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mirone</b></sub></a><br /><a href="https://github.com/testing-library/user-event/issues?q=author%3ASaul-Mirone" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/amandapouget"><img src="https://avatars3.githubusercontent.com/u/12855692?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Amanda Pouget</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=amandapouget" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/Sonic12040"><img src="https://avatars3.githubusercontent.com/u/21055893?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sonic12040</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=Sonic12040" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=Sonic12040" title="Tests">⚠️</a> <a href="https://github.com/testing-library/user-event/commits?author=Sonic12040" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/gndelia"><img src="https://avatars1.githubusercontent.com/u/352474?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Gonzalo D'Elia</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=gndelia" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=gndelia" title="Tests">⚠️</a> <a href="https://github.com/testing-library/user-event/commits?author=gndelia" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/vasilii-kovalev"><img src="https://avatars0.githubusercontent.com/u/10310491?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Vasilii Kovalev</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=vasilii-kovalev" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=vasilii-kovalev" title="Documentation">📖</a></td>
    <td align="center"><a href="https://www.daleseo.com"><img src="https://avatars1.githubusercontent.com/u/5466341?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Dale Seo</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=daleseo" title="Documentation">📖</a></td>
    <td align="center"><a href="http://www.alex-boyce.me/"><img src="https://avatars.githubusercontent.com/u/4050934?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alex Boyce</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=curiosity26" title="Code">💻</a></td>
    <td align="center"><a href="https://benadamstyles.com"><img src="https://avatars.githubusercontent.com/u/4380655?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ben Styles</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=benadamstyles" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=benadamstyles" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://laurabeatris.com"><img src="https://avatars.githubusercontent.com/u/48022589?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Laura Beatris</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=LauraBeatris" title="Code">💻</a> <a href="https://github.com/testing-library/user-event/commits?author=LauraBeatris" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://twitter.com/boriscoder"><img src="https://avatars.githubusercontent.com/u/812240?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Boris Serdiuk</b></sub></a><br /><a href="https://github.com/testing-library/user-event/issues?q=author%3Ajust-boris" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://bozdoz.com"><img src="https://avatars.githubusercontent.com/u/1410985?v=4?s=100" width="100px;" alt=""/><br /><sub><b>bozdoz</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=bozdoz" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/jKatt"><img src="https://avatars.githubusercontent.com/u/5550790?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jan Kattelans</b></sub></a><br /><a href="https://github.com/testing-library/user-event/commits?author=jKatt" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/schoeneu"><img src="https://avatars.githubusercontent.com/u/3261341?v=4?s=100" width="100px;" alt=""/><br /><sub><b>schoeneu</b></sub></a><br /><a href="https://github.com/testing-library/user-event/issues?q=author%3Aschoeneu" title="Bug reports">🐛</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## LICENSE

MIT

<!-- prettier-ignore-start -->
[npm]: https://www.npmjs.com
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/github/workflow/status/testing-library/user-event/validate/master?logo=github&style=flat-square
[build]: https://github.com/testing-library/user-event/actions?query=workflow%3Avalidate
[coverage-badge]: https://img.shields.io/codecov/c/github/testing-library/user-event.svg?style=flat-square
[coverage]: https://codecov.io/github/testing-library/user-event
[version-badge]: https://img.shields.io/npm/v/@testing-library/user-event.svg?style=flat-square
[package]: https://www.npmjs.com/package/@testing-library/user-event
[downloads-badge]: https://img.shields.io/npm/dm/@testing-library/user-event.svg?style=flat-square
[npmtrends]: http://www.npmtrends.com/@testing-library/user-event
[license-badge]: https://img.shields.io/npm/l/@testing-library/user-event.svg?style=flat-square
[license]: https://github.com/testing-library/user-event/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/testing-library/user-event/blob/master/other/CODE_OF_CONDUCT.md
[emojis]: https://github.com/all-contributors/all-contributors#emoji-key
[all-contributors]: https://github.com/all-contributors/all-contributors
[all-contributors-badge]: https://img.shields.io/github/all-contributors/testing-library/user-event?color=orange&style=flat-square
[bugs]: https://github.com/testing-library/user-event/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+sort%3Acreated-desc+label%3Abug
[requests]: https://github.com/testing-library/user-event/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc+label%3Aenhancement
[good-first-issue]: https://github.com/testing-library/user-event/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc+label%3Aenhancement+label%3A%22good+first+issue%22
<!-- prettier-ignore-end -->
