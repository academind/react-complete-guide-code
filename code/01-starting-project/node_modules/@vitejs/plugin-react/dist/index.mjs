import path from 'node:path';
import * as babel from '@babel/core';
import { createFilter, normalizePath } from 'vite';
import MagicString from 'magic-string';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const runtimePublicPath = "/@react-refresh";
const _require = createRequire(import.meta.url);
const reactRefreshDir = path.dirname(
  _require.resolve("react-refresh/package.json")
);
const runtimeFilePath = path.join(
  reactRefreshDir,
  "cjs/react-refresh-runtime.development.js"
);
const runtimeCode = `
const exports = {}
${fs.readFileSync(runtimeFilePath, "utf-8")}
function debounce(fn, delay) {
  let handle
  return () => {
    clearTimeout(handle)
    handle = setTimeout(fn, delay)
  }
}
exports.performReactRefresh = debounce(exports.performReactRefresh, 16)
export default exports
`;
const preambleCode = `
import RefreshRuntime from "__BASE__${runtimePublicPath.slice(1)}"
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_react_preamble_installed__ = true
`;
const header = `
import RefreshRuntime from "${runtimePublicPath}";

let prevRefreshReg;
let prevRefreshSig;

if (import.meta.hot) {
  if (!window.__vite_plugin_react_preamble_installed__) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong. " +
      "See https://github.com/vitejs/vite-plugin-react/pull/11#discussion_r430879201"
    );
  }

  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    RefreshRuntime.register(type, __SOURCE__ + " " + id)
  };
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}`.replace(/[\n]+/gm, "");
const timeout = `
  if (!window.__vite_plugin_react_timeout) {
    window.__vite_plugin_react_timeout = setTimeout(() => {
      window.__vite_plugin_react_timeout = 0;
      RefreshRuntime.performReactRefresh();
    }, 30);
  }
`;
const footer = `
if (import.meta.hot) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;

  __ACCEPT__
}`;
const checkAndAccept = `
function isReactRefreshBoundary(mod) {
  if (mod == null || typeof mod !== 'object') {
    return false;
  }
  let hasExports = false;
  let areAllExportsComponents = true;
  for (const exportName in mod) {
    hasExports = true;
    if (exportName === '__esModule') {
      continue;
    }
    const desc = Object.getOwnPropertyDescriptor(mod, exportName);
    if (desc && desc.get) {
      // Don't invoke getters as they may have side effects.
      return false;
    }
    const exportValue = mod[exportName];
    if (!RefreshRuntime.isLikelyComponentType(exportValue)) {
      areAllExportsComponents = false;
    }
  }
  return hasExports && areAllExportsComponents;
}

import.meta.hot.accept(mod => {
  if (isReactRefreshBoundary(mod)) {
    ${timeout}
  } else {
    import.meta.hot.invalidate();
  }
});
`;
function addRefreshWrapper(code, id, accept) {
  return header.replace("__SOURCE__", JSON.stringify(id)) + code + footer.replace("__ACCEPT__", accept ? checkAndAccept : timeout);
}
function isRefreshBoundary(ast) {
  return ast.program.body.every((node) => {
    if (node.type !== "ExportNamedDeclaration") {
      return true;
    }
    const { declaration, specifiers } = node;
    if (declaration) {
      if (declaration.type === "ClassDeclaration")
        return false;
      if (declaration.type === "VariableDeclaration") {
        return declaration.declarations.every(
          (variable) => isComponentLikeIdentifier(variable.id)
        );
      }
      if (declaration.type === "FunctionDeclaration") {
        return !!declaration.id && isComponentLikeIdentifier(declaration.id);
      }
    }
    return specifiers.every((spec) => {
      return isComponentLikeIdentifier(spec.exported);
    });
  });
}
function isComponentLikeIdentifier(node) {
  return node.type === "Identifier" && isComponentLikeName(node.name);
}
function isComponentLikeName(name) {
  return typeof name === "string" && name[0] >= "A" && name[0] <= "Z";
}

function babelImportToRequire({ types: t }) {
  return {
    visitor: {
      ImportDeclaration(path) {
        const decl = path.node;
        const spec = decl.specifiers[0];
        path.replaceWith(
          t.variableDeclaration("var", [
            t.variableDeclarator(
              spec.local,
              t.memberExpression(
                t.callExpression(t.identifier("require"), [decl.source]),
                spec.imported
              )
            )
          ])
        );
      }
    }
  };
}

let babelRestoreJSX;
const jsxNotFound = [null, false];
async function getBabelRestoreJSX() {
  if (!babelRestoreJSX)
    babelRestoreJSX = import('./chunks/babel-restore-jsx.mjs').then((r) => {
      const fn = r.default;
      if ("default" in fn)
        return fn.default;
      return fn;
    });
  return babelRestoreJSX;
}
async function restoreJSX(babel, code, filename) {
  const [reactAlias, isCommonJS] = parseReactAlias(code);
  if (!reactAlias) {
    return jsxNotFound;
  }
  const reactJsxRE = new RegExp(
    `\\b${reactAlias}\\.(createElement|Fragment)\\b`,
    "g"
  );
  if (!reactJsxRE.test(code)) {
    return jsxNotFound;
  }
  const result = await babel.transformAsync(code, {
    babelrc: false,
    configFile: false,
    ast: true,
    code: false,
    filename,
    parserOpts: {
      plugins: ["jsx"]
    },
    plugins: [[await getBabelRestoreJSX(), { reactAlias }]]
  });
  return [result?.ast, isCommonJS];
}
function parseReactAlias(code) {
  let match = code.match(
    /\b(var|let|const)\s+([^=\{\s]+)\s*=\s*require\(["']react["']\)/
  );
  if (match) {
    return [match[2], true];
  }
  match = code.match(/^import\s+(?:\*\s+as\s+)?(\w+).+?\bfrom\s*["']react["']/m);
  if (match) {
    return [match[1], false];
  }
  return [void 0, false];
}

const prependReactImportCode = "import React from 'react'; ";
function viteReact(opts = {}) {
  let devBase = "/";
  let resolvedCacheDir;
  let filter = createFilter(opts.include, opts.exclude);
  let needHiresSourcemap = false;
  let isProduction = true;
  let projectRoot = process.cwd();
  let skipFastRefresh = opts.fastRefresh === false;
  let skipReactImport = false;
  let runPluginOverrides = (options, context) => false;
  let staticBabelOptions;
  const useAutomaticRuntime = opts.jsxRuntime !== "classic";
  const importReactRE = /(^|\n)import\s+(\*\s+as\s+)?React(,|\s+)/;
  const fileExtensionRE = /\.[^\/\s\?]+$/;
  const viteBabel = {
    name: "vite:react-babel",
    enforce: "pre",
    config() {
      if (opts.jsxRuntime === "classic") {
        return {
          esbuild: {
            logOverride: {
              "this-is-undefined-in-esm": "silent"
            }
          }
        };
      }
    },
    configResolved(config) {
      devBase = config.base;
      projectRoot = config.root;
      resolvedCacheDir = normalizePath(path.resolve(config.cacheDir));
      filter = createFilter(opts.include, opts.exclude, {
        resolve: projectRoot
      });
      needHiresSourcemap = config.command === "build" && !!config.build.sourcemap;
      isProduction = config.isProduction;
      skipFastRefresh || (skipFastRefresh = isProduction || config.command === "build");
      const jsxInject = config.esbuild && config.esbuild.jsxInject;
      if (jsxInject && importReactRE.test(jsxInject)) {
        skipReactImport = true;
        config.logger.warn(
          "[@vitejs/plugin-react] This plugin imports React for you automatically, so you can stop using `esbuild.jsxInject` for that purpose."
        );
      }
      config.plugins.forEach((plugin) => {
        const hasConflict = plugin.name === "react-refresh" || plugin !== viteReactJsx && plugin.name === "vite:react-jsx";
        if (hasConflict)
          return config.logger.warn(
            `[@vitejs/plugin-react] You should stop using "${plugin.name}" since this plugin conflicts with it.`
          );
      });
      runPluginOverrides = (babelOptions, context) => {
        const hooks = config.plugins.map((plugin) => plugin.api?.reactBabel).filter(Boolean);
        if (hooks.length > 0) {
          return (runPluginOverrides = (babelOptions2, context2) => {
            hooks.forEach((hook) => hook(babelOptions2, context2, config));
            return true;
          })(babelOptions, context);
        }
        runPluginOverrides = () => false;
        return false;
      };
    },
    async transform(code, id, options) {
      const ssr = options?.ssr === true;
      const [filepath, querystring = ""] = id.split("?");
      const [extension = ""] = querystring.match(fileExtensionRE) || filepath.match(fileExtensionRE) || [];
      if (/\.(mjs|[tj]sx?)$/.test(extension)) {
        const isJSX = extension.endsWith("x");
        const isNodeModules = id.includes("/node_modules/");
        const isProjectFile = !isNodeModules && (id[0] === "\0" || id.startsWith(projectRoot + "/"));
        let babelOptions = staticBabelOptions;
        if (typeof opts.babel === "function") {
          const rawOptions = opts.babel(id, { ssr });
          babelOptions = createBabelOptions(rawOptions);
          runPluginOverrides(babelOptions, { ssr, id });
        } else if (!babelOptions) {
          babelOptions = createBabelOptions(opts.babel);
          if (!runPluginOverrides(babelOptions, { ssr, id })) {
            staticBabelOptions = babelOptions;
          }
        }
        const plugins = isProjectFile ? [...babelOptions.plugins] : [];
        let useFastRefresh = false;
        if (!skipFastRefresh && !ssr && !isNodeModules) {
          const isReactModule = isJSX || importReactRE.test(code);
          if (isReactModule && filter(id)) {
            useFastRefresh = true;
            plugins.push([
              await loadPlugin("react-refresh/babel"),
              { skipEnvCheck: true }
            ]);
          }
        }
        let ast;
        let prependReactImport = false;
        if (!isProjectFile || isJSX) {
          if (useAutomaticRuntime) {
            const isOptimizedReactDom = id.startsWith(resolvedCacheDir) && id.includes("/react-dom.js");
            const [restoredAst, isCommonJS] = !isProjectFile && !isJSX && !isOptimizedReactDom ? await restoreJSX(babel, code, id) : [null, false];
            if (isJSX || (ast = restoredAst)) {
              plugins.push([
                await loadPlugin(
                  "@babel/plugin-transform-react-jsx" + (isProduction ? "" : "-development")
                ),
                {
                  runtime: "automatic",
                  importSource: opts.jsxImportSource,
                  pure: opts.jsxPure !== false,
                  throwIfNamespace: opts.jsxThrowIfNamespace
                }
              ]);
              if (isCommonJS) {
                plugins.push(babelImportToRequire);
              }
            }
          } else if (isProjectFile) {
            if (!isProduction) {
              plugins.push(
                await loadPlugin("@babel/plugin-transform-react-jsx-self"),
                await loadPlugin("@babel/plugin-transform-react-jsx-source")
              );
            }
            if (!skipReactImport && !importReactRE.test(code)) {
              prependReactImport = true;
            }
          }
        }
        let inputMap;
        if (prependReactImport) {
          if (needHiresSourcemap) {
            const s = new MagicString(code);
            s.prepend(prependReactImportCode);
            code = s.toString();
            inputMap = s.generateMap({ hires: true, source: id });
          } else {
            code = prependReactImportCode + code;
          }
        }
        const shouldSkip = !plugins.length && !babelOptions.configFile && !(isProjectFile && babelOptions.babelrc);
        if (shouldSkip) {
          return {
            code,
            map: inputMap ?? null
          };
        }
        const parserPlugins = [
          ...babelOptions.parserOpts.plugins,
          "importMeta",
          "topLevelAwait",
          "classProperties",
          "classPrivateProperties",
          "classPrivateMethods"
        ];
        if (!extension.endsWith(".ts")) {
          parserPlugins.push("jsx");
        }
        if (/\.tsx?$/.test(extension)) {
          parserPlugins.push("typescript");
        }
        const transformAsync = ast ? babel.transformFromAstAsync.bind(babel, ast, code) : babel.transformAsync.bind(babel, code);
        const isReasonReact = extension.endsWith(".bs.js");
        const result = await transformAsync({
          ...babelOptions,
          ast: !isReasonReact,
          root: projectRoot,
          filename: id,
          sourceFileName: filepath,
          parserOpts: {
            ...babelOptions.parserOpts,
            sourceType: "module",
            allowAwaitOutsideFunction: true,
            plugins: parserPlugins
          },
          generatorOpts: {
            ...babelOptions.generatorOpts,
            decoratorsBeforeExport: true
          },
          plugins,
          sourceMaps: true,
          inputSourceMap: inputMap ?? false
        });
        if (result) {
          let code2 = result.code;
          if (useFastRefresh && /\$RefreshReg\$\(/.test(code2)) {
            const accept = isReasonReact || isRefreshBoundary(result.ast);
            code2 = addRefreshWrapper(code2, id, accept);
          }
          return {
            code: code2,
            map: result.map
          };
        }
      }
    }
  };
  const viteReactRefresh = {
    name: "vite:react-refresh",
    enforce: "pre",
    config: () => ({
      resolve: {
        dedupe: ["react", "react-dom"]
      }
    }),
    resolveId(id) {
      if (id === runtimePublicPath) {
        return id;
      }
    },
    load(id) {
      if (id === runtimePublicPath) {
        return runtimeCode;
      }
    },
    transformIndexHtml() {
      if (!skipFastRefresh)
        return [
          {
            tag: "script",
            attrs: { type: "module" },
            children: preambleCode.replace(`__BASE__`, devBase)
          }
        ];
    }
  };
  const reactJsxRuntimeId = "react/jsx-runtime";
  const reactJsxDevRuntimeId = "react/jsx-dev-runtime";
  const virtualReactJsxRuntimeId = "\0" + reactJsxRuntimeId;
  const virtualReactJsxDevRuntimeId = "\0" + reactJsxDevRuntimeId;
  const viteReactJsx = {
    name: "vite:react-jsx",
    enforce: "pre",
    config() {
      return {
        optimizeDeps: {
          include: [reactJsxRuntimeId, reactJsxDevRuntimeId, "react"]
        }
      };
    },
    resolveId(id, importer) {
      if (id === reactJsxRuntimeId && importer !== virtualReactJsxRuntimeId) {
        return virtualReactJsxRuntimeId;
      }
      if (id === reactJsxDevRuntimeId && importer !== virtualReactJsxDevRuntimeId) {
        return virtualReactJsxDevRuntimeId;
      }
    },
    load(id) {
      if (id === virtualReactJsxRuntimeId) {
        return [
          `import * as jsxRuntime from ${JSON.stringify(reactJsxRuntimeId)}`,
          `export const Fragment = jsxRuntime.Fragment`,
          `export const jsx = jsxRuntime.jsx`,
          `export const jsxs = jsxRuntime.jsxs`
        ].join("\n");
      }
      if (id === virtualReactJsxDevRuntimeId) {
        return [
          `import * as jsxRuntime from ${JSON.stringify(reactJsxDevRuntimeId)}`,
          `export const Fragment = jsxRuntime.Fragment`,
          `export const jsxDEV = jsxRuntime.jsxDEV`
        ].join("\n");
      }
    }
  };
  return [viteBabel, viteReactRefresh, useAutomaticRuntime && viteReactJsx];
}
viteReact.preambleCode = preambleCode;
function loadPlugin(path2) {
  return import(path2).then((module) => module.default || module);
}
function createBabelOptions(rawOptions) {
  var _a;
  const babelOptions = {
    babelrc: false,
    configFile: false,
    ...rawOptions
  };
  babelOptions.plugins || (babelOptions.plugins = []);
  babelOptions.presets || (babelOptions.presets = []);
  babelOptions.overrides || (babelOptions.overrides = []);
  babelOptions.parserOpts || (babelOptions.parserOpts = {});
  (_a = babelOptions.parserOpts).plugins || (_a.plugins = []);
  return babelOptions;
}

export { viteReact as default };
