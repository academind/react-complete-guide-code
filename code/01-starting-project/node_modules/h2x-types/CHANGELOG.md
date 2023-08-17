# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="1.1.0"></a>
# [1.1.0](https://github.com/smooth-code/h2x/tree/master/packages/h2x-types/compare/v1.0.0...v1.1.0) (2018-09-15)


### Features

* upgrade to JSDOM v12 ([#14](https://github.com/smooth-code/h2x/tree/master/packages/h2x-types/issues/14)) ([949a80c](https://github.com/smooth-code/h2x/tree/master/packages/h2x-types/commit/949a80c))





<a name="1.0.0"></a>
# [1.0.0](https://github.com/smooth-code/h2x/tree/master/packages/h2x-types/compare/v0.1.9...v1.0.0) (2018-05-14)


### Features

* upgrade JSDOM ([0fd6741](https://github.com/smooth-code/h2x/tree/master/packages/h2x-types/commit/0fd6741))


### BREAKING CHANGES

* - An AST is now generate from the JSDOM tree.
- You can still access the originalNode using `node.originalNode`.
- You now have to call `fromHtmlAttribute` and `fromHtmlElement` to replace a node.
