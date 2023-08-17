# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.1.2](https://github.com/ljharb/util.promisify/compare/v1.1.1...v1.1.2) - 2023-04-20

### Fixed

- [Fix] avoid crashing with `--disable-proto=throw` [`#26`](https://github.com/ljharb/util.promisify/issues/26)

### Commits

- [actions] reuse common workflows [`2736cb6`](https://github.com/ljharb/util.promisify/commit/2736cb6c8ea7c1cfeca6ddc3c9cf1615aab9a1a8)
- [meta] use `npmignore` to autogenerate an npmignore file [`0eb5abb`](https://github.com/ljharb/util.promisify/commit/0eb5abbe3d3e78fccd20c9f6cac665a7687b54b8)
- [meta] reorganize package.json [`e610642`](https://github.com/ljharb/util.promisify/commit/e610642b27f1498a2114d970ce327b29cfd3bde6)
- [Fix] proper error name [`727c30c`](https://github.com/ljharb/util.promisify/commit/727c30c330b829ee5946226f69b114fae9c761cf)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `@es-shims/api`, `aud`, `auto-changelog`, `safe-publish-latest`, `tape` [`ecc9281`](https://github.com/ljharb/util.promisify/commit/ecc9281821e111f04c3f57e5f28e01386721da30)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `aud`, `auto-changelog`, `tape` [`91c385d`](https://github.com/ljharb/util.promisify/commit/91c385d7c500678ae87c9b022cc5003815b2bf89)
- [actions] update rebase action [`c62f4bf`](https://github.com/ljharb/util.promisify/commit/c62f4bfac476b1cdf4836d2e554dca712e2552b8)
- [Refactor] use `has-proto` [`e423ed0`](https://github.com/ljharb/util.promisify/commit/e423ed024de422aa75264f2cfd13a16455da2fc4)
- [Dev Deps] update `@es-shims/api`, `ljharb/eslint-config`,` aud`, `tape` [`62717c1`](https://github.com/ljharb/util.promisify/commit/62717c13f97227771f0b72c3d0638976d04e472a)
- [Refactor] use `safe-array-concat` [`d068529`](https://github.com/ljharb/util.promisify/commit/d068529b46fbff46960111dfe857d43734f3a0f1)
- [Deps] update `define-properties`, `has-symbols`, `object.getownpropertydescriptors` [`bd8a7be`](https://github.com/ljharb/util.promisify/commit/bd8a7be795d349176a667a69755a6472facbb2af)
- [Deps] update `call-bind`, `has-symbols`, `object.getownpropertydescriptors` [`7473409`](https://github.com/ljharb/util.promisify/commit/7473409dbc10974549a869c8bed8172342a40728)
- [Deps] update `define-properties`, `object.getownpropertydescriptors` [`4f244be`](https://github.com/ljharb/util.promisify/commit/4f244beb8e8f51011f265bef0bb87e2a8972f320)

## [v1.1.1](https://github.com/ljharb/util.promisify/compare/v1.1.0...v1.1.1) - 2021-01-08

### Commits

- [Fix] add missing runtime dependency `has-symbols` [`9b45a3b`](https://github.com/ljharb/util.promisify/commit/9b45a3bfbc0bcf5e474e1d045aacca3dc9609e54)

## [v1.1.0](https://github.com/ljharb/util.promisify/compare/v1.0.1...v1.1.0) - 2021-01-06

### Commits

- [Tests] migrate tests to Github Actions [`a09e2f5`](https://github.com/ljharb/util.promisify/commit/a09e2f5cc3590c3098681c98b08dcb15b5c0877b)
- [Tests] add tests [`5162b64`](https://github.com/ljharb/util.promisify/commit/5162b642805030b7d83e978e73392213d0b2431a)
- [meta] do not publish github action workflow files [`4b5a39e`](https://github.com/ljharb/util.promisify/commit/4b5a39ed1df1c6ce86fb687f7494882fd29099ba)
- [Fix] handle nonconfigurable own function properties, in older engines [`07693ae`](https://github.com/ljharb/util.promisify/commit/07693ae63cdc71d88c2203d62aca53623fba4815)
- [New] use a global symbol for `util.promisify.custom` [`8f8631b`](https://github.com/ljharb/util.promisify/commit/8f8631b04c3f2cf1bd082837c8d73431e356eb2f)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `aud`, `auto-changelog` [`83e7267`](https://github.com/ljharb/util.promisify/commit/83e7267f27e38a9abcba6803f945c71a68255ff9)
- [actions] add "Allow Edits" workflow [`e2a92ae`](https://github.com/ljharb/util.promisify/commit/e2a92ae988554713f89e62fcbf0ac602f76976f6)
- [Tests] move `es-shim-api` to `postlint` [`7b93efa`](https://github.com/ljharb/util.promisify/commit/7b93efacd4c978b76d02be9b33b94b61ee366e65)
- [Deps] use `call-bind` instead of `es-abstract` [`e68f500`](https://github.com/ljharb/util.promisify/commit/e68f500d9dd0cdd0563d72b758e34bdf1bed0d6c)
- [actions] switch Automatic Rebase workflow to `pull_request_target` event [`7da936c`](https://github.com/ljharb/util.promisify/commit/7da936c0681062c5eb812185ebc9ccf4d86851c5)
- [Dev Deps] update `aud`, `auto-changelog` [`88465d4`](https://github.com/ljharb/util.promisify/commit/88465d4202969895123e3113db3e8b45972ca2f6)
- [Tests] only audit prod deps [`8a13dc5`](https://github.com/ljharb/util.promisify/commit/8a13dc5192ab899034e1f78151324ea06fb381b1)
- [Deps] update `object.getownpropertydescriptors` [`899d30b`](https://github.com/ljharb/util.promisify/commit/899d30b3389b033b3964dd0e7faa0469db8b3ba4)
- [Deps] update `es-abstract` [`552d18b`](https://github.com/ljharb/util.promisify/commit/552d18b34ebc0eda0d0bc33a84ca1827aa86aaf9)
- [Dev Deps] update `auto-changelog` [`dd61917`](https://github.com/ljharb/util.promisify/commit/dd61917fabad7c8c4c52807ca4b5b40611a14e62)
- [Deps] update `es-abstract` [`40a839a`](https://github.com/ljharb/util.promisify/commit/40a839a8db3d79699688d27f6613a827056428c8)
- [Dev Deps] update `@ljharb/eslint-config` [`07c3b39`](https://github.com/ljharb/util.promisify/commit/07c3b3952682e9c4d58b6bfb9404049827b5c523)

## [v1.0.1](https://github.com/ljharb/util.promisify/compare/v1.0.0...v1.0.1) - 2020-01-16

### Fixed

- [Refactor] remove unnecessary duplication. Fixes #3. [`#3`](https://github.com/ljharb/util.promisify/issues/3)

### Commits

- [Tests] use shared travis-ci configs [`f1b5e43`](https://github.com/ljharb/util.promisify/commit/f1b5e43359e74a30f35bd10a33be765de73917c6)
- [Tests] up to `node` `v10.0`, `v9.11`, `v8.11`, `v6.14`, `4.9`; use `nvm install-latest-npm`; pin included builds to LTS [`e89390f`](https://github.com/ljharb/util.promisify/commit/e89390f498f7eb5111188fff5260cbb9f5216cd3)
- [meta] add `auto-changelog` [`fe8e751`](https://github.com/ljharb/util.promisify/commit/fe8e751819a1318d3c929b086c70308aed50715d)
- [Tests] up to `node` `v11.0`, `v10.12`, `v8.12` [`e09b894`](https://github.com/ljharb/util.promisify/commit/e09b894291aef2991e5c553f0b64968e03b58262)
- [Refactor] use `callBound` helper from `es-abstract` for robustness [`baa0cf6`](https://github.com/ljharb/util.promisify/commit/baa0cf697068573cbe650e01aa6774154dd3f454)
- [actions] add automatic rebasing / merge commit blocking [`24912f4`](https://github.com/ljharb/util.promisify/commit/24912f41b30d88b8984fb07307f737de6f576873)
- [Docs] Add usage information for the shim/monkey-patch [`38b1ee5`](https://github.com/ljharb/util.promisify/commit/38b1ee56b558019213a6fdc2553796e8cdaf773e)
- [Refactor] use `__proto__` instead of ES6’s `Object.setPrototypeOf` [`02ec7e2`](https://github.com/ljharb/util.promisify/commit/02ec7e241caf8848c1e141c801f98ed31325b59a)
- [meta] create FUNDING.yml [`076b8b5`](https://github.com/ljharb/util.promisify/commit/076b8b5d19783a0e4c932e41782846e431deeb7d)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `safe-publish-latest` [`4cedaa9`](https://github.com/ljharb/util.promisify/commit/4cedaa9c6b0a77a0416b69d480b3b806c00dec6e)
- Adds usage information to the README [`ddb4556`](https://github.com/ljharb/util.promisify/commit/ddb45562320ab8aea93dc0364640ea21ab68bfbb)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `safe-publish-latest` [`95362c0`](https://github.com/ljharb/util.promisify/commit/95362c0e93186a30ede6333430ddfa0606a769b4)
- [Dev Deps] update `@es-shims/api`, `@ljharb/eslint-config`, `eslint` [`fd79a58`](https://github.com/ljharb/util.promisify/commit/fd79a58573186c83d81777fa0b1ad293b2f475e3)
- [Dev Deps] update `eslint`, `@ljharb/eslint-config` [`2cf792b`](https://github.com/ljharb/util.promisify/commit/2cf792b9dcaab24b642ef1de8239ceb089fc5d38)
- [Docs] Link to util.promisify-all [`032ff5c`](https://github.com/ljharb/util.promisify/commit/032ff5c6ee2958a02f56c770337441c3a587b88c)
- [Tests] allow node 0.10 and 0.8 to fail again [`c2f8418`](https://github.com/ljharb/util.promisify/commit/c2f8418dfc36b83cd8a18b86a735c2936c6f5f9e)
- [Tests] remove mistakenly added travis jobs [`13a242f`](https://github.com/ljharb/util.promisify/commit/13a242fb33dcbd4e2872436f2e430e62526fb147)
- [Tests] on `node` `v10.1` [`8244578`](https://github.com/ljharb/util.promisify/commit/82445786197fd3e54aeffaa2fe0f1da38bcafec4)
- [meta] add `funding` field [`e1645ca`](https://github.com/ljharb/util.promisify/commit/e1645ca10648d1ae917e3f5ae954b37de338dc20)
- [New] add `auto` entry point [`2c48047`](https://github.com/ljharb/util.promisify/commit/2c480479d67646fb2bfb92a4e5d50ff14bcdca3c)
- [Fix] use `has-symbols` package to ensure we support Symbol shams too. [`75135c8`](https://github.com/ljharb/util.promisify/commit/75135c8a48ea4e1be1cfe7a95af11905818303e7)
- [Deps] update `es-abstract` [`32aa5cc`](https://github.com/ljharb/util.promisify/commit/32aa5ccd3ee7513edef99ed7d516d6c0f4901883)
- [Dev Deps] update `eslint` [`c3043e6`](https://github.com/ljharb/util.promisify/commit/c3043e6e562847102e9136479268777bc07e9b26)
- [Deps] update `object.getownpropertydescriptors` [`521ed25`](https://github.com/ljharb/util.promisify/commit/521ed25d40dc230b38ac3755036219fbaf94694c)
- [Deps] update `has-symbol` [`16d91ec`](https://github.com/ljharb/util.promisify/commit/16d91ecc0016c31e49b7c3da938c19132c243732)
- [Deps] update `define-properties` [`532915e`](https://github.com/ljharb/util.promisify/commit/532915ed58fe6f0edc3670837b510e09fb39b99a)
- [Tests] `npm` v5+ breaks on node &lt; v4 [`0647c63`](https://github.com/ljharb/util.promisify/commit/0647c63d932451c043c3e8f3b003c636057f035a)

## v1.0.0 - 2017-05-30

### Commits

- Dotfiles. [`02c20cb`](https://github.com/ljharb/util.promisify/commit/02c20cb4eb01cf656102f57f71635785114f1d09)
- Initial implementation. [`05ff048`](https://github.com/ljharb/util.promisify/commit/05ff0480448f019a85675ce81ecc4e9bdc099286)
- Initial commit [`9472155`](https://github.com/ljharb/util.promisify/commit/947215502491bb1b3238aa0ac5c67258e41db3a8)
- package.json [`e0302c0`](https://github.com/ljharb/util.promisify/commit/e0302c01e5e3b1dd78647303f9a4337b5bb63196)
- Initial readme. [`5df78e1`](https://github.com/ljharb/util.promisify/commit/5df78e16e89e8328c61d6bbac85409a36560fe3b)
- [Dev Deps] add `safe-publish-latest` [`596b6b4`](https://github.com/ljharb/util.promisify/commit/596b6b4fbce79dbaf5fff366454ab5b31d2eb993)
- [Tests] add `npm run lint` [`54c2ccb`](https://github.com/ljharb/util.promisify/commit/54c2ccb85db682fc293b30a0bfece76d0a5c7c60)
- [Dev Deps] add `@es-shims/api` [`d9014f1`](https://github.com/ljharb/util.promisify/commit/d9014f12add2fb3fe743647df614c69ed305a824)
- [Tests] allow 0.10 and 0.8 to fail, for now. [`c5c7b61`](https://github.com/ljharb/util.promisify/commit/c5c7b619b88878fc715d1768b48bd45378c9f807)
