# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.1.1](https://github.com/smooth-code/h2x/tree/master/packages/h2x-parse/compare/v1.1.0...v1.1.1) (2018-10-05)

**Note:** Version bump only for package h2x-parse





<a name="1.1.0"></a>
# [1.1.0](https://github.com/smooth-code/h2x/tree/master/packages/h2x-parse/compare/v1.0.0...v1.1.0) (2018-09-15)


### Features

* upgrade to JSDOM v12 ([#14](https://github.com/smooth-code/h2x/tree/master/packages/h2x-parse/issues/14)) ([949a80c](https://github.com/smooth-code/h2x/tree/master/packages/h2x-parse/commit/949a80c))





<a name="1.0.0"></a>
# [1.0.0](https://github.com/smooth-code/h2x/tree/master/packages/h2x-parse/compare/v0.1.9...v1.0.0) (2018-05-14)


### Features

* upgrade JSDOM ([0fd6741](https://github.com/smooth-code/h2x/tree/master/packages/h2x-parse/commit/0fd6741))


### BREAKING CHANGES

* - An AST is now generate from the JSDOM tree.
- You can still access the originalNode using `node.originalNode`.
- You now have to call `fromHtmlAttribute` and `fromHtmlElement` to replace a node.
