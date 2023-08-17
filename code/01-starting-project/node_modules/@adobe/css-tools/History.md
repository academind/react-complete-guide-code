4.3.1 / 2023-03-14
==================

 * Fix redos vulnerability with specific crafted css string - CVE-2023-26364

4.3.0 / 2023-03-07
==================

 * Update build tools
 * Update exports path and files

4.2.0 / 2023-02-21
==================

 * Add @container support
 * Add @layer support

4.1.0 / 2023-01-25
==================

 * Support ESM Modules

4.0.2 / 2023-01-12
==================

 * #71 : @import does not work if url contains ';'
 * #77 : Regression in selector parsing: Attribute selectors not parsed correctly

4.0.1 / 2022-08-03
==================

 * Change globalThis configuration for webpack so UMD module could be used in nodejs (jest-dom)

4.0.0 / 2022-06-09
==================

 * Adobe fork of css into @adobe/css
 * Convert the project into typescript
 * Optimization of performance (+25% in some cases)
 * Update all deps
 * Remove sourcemap support

2.2.1 / 2015-06-17
==================

 * fix parsing escaped quotes in quoted strings

2.2.0 / 2015-02-18
==================

 * add `parsingErrors` to list errors when parsing with `silent: true`
 * accept EOL characters and all other whitespace characters in `@` rules such
   as `@media`

2.1.0 / 2014-08-05
==================

  * change error message format and add `.reason` property to errors
  * add `inputSourcemaps` option to disable input source map processing
  * use `inherits` for inheritance (fixes some browsers)
  * add `sourcemap: 'generator'` option to return the `SourceMapGenerator`
    object

2.0.0 / 2014-06-18
==================

  * add non-enumerable parent reference to each node
  * drop Component(1) support
  * add support for @custom-media, @host, and @font-face
  * allow commas inside selector functions
  * allow empty property values
  * changed default options.position value to true
  * remove comments from properties and values
  * asserts when selectors are missing
  * added node.position.content property
  * absorb css-parse and css-stringify libraries
  * apply original source maps from source files

1.6.1 / 2014-01-02
==================

  * fix component.json

1.6.0 / 2013-12-21
==================

  * update deps

1.5.0 / 2013-12-03
==================

  * update deps

1.1.0 / 2013-04-04
==================

  * update deps

1.0.7 / 2012-11-21
==================

  * fix component.json

1.0.4 / 2012-11-15
==================

  * update css-stringify

1.0.3 / 2012-09-01
==================

  * add component support

0.0.1 / 2010-01-03
==================

  * Initial release
