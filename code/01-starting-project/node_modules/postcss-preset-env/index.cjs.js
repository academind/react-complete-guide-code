'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var autoprefixer = _interopDefault(require('autoprefixer'));
var browserslist = _interopDefault(require('browserslist'));
var cssdb = _interopDefault(require('cssdb'));
var postcssAttributeCaseInsensitive = _interopDefault(require('postcss-attribute-case-insensitive'));
var postcssColorFunctionalNotation = _interopDefault(require('postcss-color-functional-notation'));
var postcssColorGray = _interopDefault(require('postcss-color-gray'));
var postcssColorHexAlpha = _interopDefault(require('postcss-color-hex-alpha'));
var postcssColorModFunction = _interopDefault(require('postcss-color-mod-function'));
var postcssColorRebeccapurple = _interopDefault(require('postcss-color-rebeccapurple'));
var postcssCustomMedia = _interopDefault(require('postcss-custom-media'));
var postcssCustomProperties = _interopDefault(require('postcss-custom-properties'));
var postcssCustomSelectors = _interopDefault(require('postcss-custom-selectors'));
var postcssDirPseudoClass = _interopDefault(require('postcss-dir-pseudo-class'));
var postcssDoublePositionGradients = _interopDefault(require('postcss-double-position-gradients'));
var postcssEnvFunction = _interopDefault(require('postcss-env-function'));
var postcssFocusVisible = _interopDefault(require('postcss-focus-visible'));
var postcssFocusWithin = _interopDefault(require('postcss-focus-within'));
var postcssFontVariant = _interopDefault(require('postcss-font-variant'));
var postcss = _interopDefault(require('postcss'));
var postcssGapProperties = _interopDefault(require('postcss-gap-properties'));
var postcssImageSetPolyfill = _interopDefault(require('postcss-image-set-function'));
var postcssInitial = _interopDefault(require('postcss-initial'));
var postcssLabFunction = _interopDefault(require('postcss-lab-function'));
var postcssLogical = _interopDefault(require('postcss-logical'));
var postcssMediaMinmax = _interopDefault(require('postcss-media-minmax'));
var postcssNesting = _interopDefault(require('postcss-nesting'));
var postcssOverflowShorthand = _interopDefault(require('postcss-overflow-shorthand'));
var postcssPageBreak = _interopDefault(require('postcss-page-break'));
var postcssPlace = _interopDefault(require('postcss-place'));
var postcssPseudoClassAnyLink = _interopDefault(require('postcss-pseudo-class-any-link'));
var postcssReplaceOverflowWrap = _interopDefault(require('postcss-replace-overflow-wrap'));
var postcssSelectorMatches = _interopDefault(require('postcss-selector-matches'));
var postcssSelectorNot = _interopDefault(require('postcss-selector-not'));
var caniuse = require('caniuse-lite');

var postcssFontFamilySystemUi = postcss.plugin('postcss-system-ui-font', () => root => {
  root.walkDecls(propertyRegExp, decl => {
    decl.value = decl.value.replace(systemUiMatch, systemUiReplace);
  });
});
const propertyRegExp = /(?:^(?:-|\\002d){2})|(?:^font(?:-family)?$)/i;
const whitespace = '[\\f\\n\\r\\x09\\x20]';
const systemUiFamily = ['system-ui',
/* macOS 10.11-10.12 */
'-apple-system',
/* Windows 6+ */
'Segoe UI',
/* Android 4+ */
'Roboto',
/* Ubuntu 10.10+ */
'Ubuntu',
/* Gnome 3+ */
'Cantarell',
/* KDE Plasma 5+ */
'Noto Sans',
/* fallback */
'sans-serif'];
const systemUiMatch = new RegExp(`(^|,|${whitespace}+)(?:system-ui${whitespace}*)(?:,${whitespace}*(?:${systemUiFamily.join('|')})${whitespace}*)?(,|$)`, 'i');
const systemUiReplace = `$1${systemUiFamily.join(', ')}$2`;

var plugins = {
  'all-property': postcssInitial,
  'any-link-pseudo-class': postcssPseudoClassAnyLink,
  'break-properties': postcssPageBreak,
  'case-insensitive-attributes': postcssAttributeCaseInsensitive,
  'color-functional-notation': postcssColorFunctionalNotation,
  'color-mod-function': postcssColorModFunction,
  'custom-media-queries': postcssCustomMedia,
  'custom-properties': postcssCustomProperties,
  'custom-selectors': postcssCustomSelectors,
  'dir-pseudo-class': postcssDirPseudoClass,
  'double-position-gradients': postcssDoublePositionGradients,
  'environment-variables': postcssEnvFunction,
  'focus-visible-pseudo-class': postcssFocusVisible,
  'focus-within-pseudo-class': postcssFocusWithin,
  'font-variant-property': postcssFontVariant,
  'gap-properties': postcssGapProperties,
  'gray-function': postcssColorGray,
  'hexadecimal-alpha-notation': postcssColorHexAlpha,
  'image-set-function': postcssImageSetPolyfill,
  'lab-function': postcssLabFunction,
  'logical-properties-and-values': postcssLogical,
  'matches-pseudo-class': postcssSelectorMatches,
  'media-query-ranges': postcssMediaMinmax,
  'nesting-rules': postcssNesting,
  'not-pseudo-class': postcssSelectorNot,
  'overflow-property': postcssOverflowShorthand,
  'overflow-wrap-property': postcssReplaceOverflowWrap,
  'place-properties': postcssPlace,
  'rebeccapurple-color': postcssColorRebeccapurple,
  'system-ui-font-family': postcssFontFamilySystemUi
};

// return a list of features to be inserted before or after cssdb features
function getTransformedInsertions(insertions, placement) {
  return Object.keys(insertions).map(id => [].concat(insertions[id]).map(plugin => ({
    [placement]: true,
    plugin,
    id
  }))).reduce((array, feature) => array.concat(feature), []);
}

function getUnsupportedBrowsersByFeature(feature) {
  const caniuseFeature = caniuse.features[feature]; // if feature support can be determined

  if (caniuseFeature) {
    const stats = caniuse.feature(caniuseFeature).stats; // return an array of browsers and versions that do not support the feature

    const results = Object.keys(stats).reduce((browsers, browser) => browsers.concat(Object.keys(stats[browser]).filter(version => stats[browser][version].indexOf('y') !== 0).map(version => `${browser} ${version}`)), []);
    return results;
  } else {
    // otherwise, return that the feature does not work in any browser
    return ['> 0%'];
  }
}

// ids ordered by required execution, then alphabetically
var idsByExecutionOrder = ['custom-media-queries', 'custom-properties', 'environment-variables', // run environment-variables here to access transpiled custom media params and properties
'image-set-function', // run images-set-function before nesting-rules so that it may fix nested media
'media-query-ranges', // run media-query-range here to prevent duplicate transpilation after nesting-rules
'nesting-rules', 'custom-selectors', // run custom-selectors after nesting-rules to correctly transpile &:--custom-selector
'any-link-pseudo-class', 'case-insensitive-attributes', 'focus-visible-pseudo-class', 'focus-within-pseudo-class', 'matches-pseudo-class', 'not-pseudo-class', // run matches-pseudo-class and bit-pseudo-class after other selectors have been transpiled
'logical-properties-and-values', // run logical-properties-and-values before dir-pseudo-class
'dir-pseudo-class', 'all-property', // run all-property before other property polyfills
'color-functional-notation', 'double-position-gradients', 'gray-function', 'hexadecimal-alpha-notation', 'lab-function', 'rebeccapurple-color', 'color-mod-function', // run color-mod after other color modifications have finished
'break-properties', 'font-variant-property', 'gap-properties', 'overflow-property', 'overflow-wrap-property', 'place-properties', 'system-ui-font-family'];

var index = postcss.plugin('postcss-preset-env', opts => {
  // initialize options
  const features = Object(Object(opts).features);
  const insertBefore = Object(Object(opts).insertBefore);
  const insertAfter = Object(Object(opts).insertAfter);
  const browsers = Object(opts).browsers;
  const stage = 'stage' in Object(opts) ? opts.stage === false ? 5 : parseInt(opts.stage) || 0 : 2;
  const autoprefixerOptions = Object(opts).autoprefixer;
  const sharedOpts = initializeSharedOpts(Object(opts));
  const stagedAutoprefixer = autoprefixerOptions === false ? () => {} : autoprefixer(Object.assign({
    browsers
  }, autoprefixerOptions)); // polyfillable features (those with an available postcss plugin)

  const polyfillableFeatures = cssdb.concat( // additional features to be inserted before cssdb features
  getTransformedInsertions(insertBefore, 'insertBefore'), // additional features to be inserted after cssdb features
  getTransformedInsertions(insertAfter, 'insertAfter')).filter( // inserted features or features with an available postcss plugin
  feature => feature.insertBefore || feature.id in plugins).sort( // features sorted by execution order and then insertion order
  (a, b) => idsByExecutionOrder.indexOf(a.id) - idsByExecutionOrder.indexOf(b.id) || (a.insertBefore ? -1 : b.insertBefore ? 1 : 0) || (a.insertAfter ? 1 : b.insertAfter ? -1 : 0)).map( // polyfillable features as an object
  feature => {
    // target browsers for the polyfill
    const unsupportedBrowsers = getUnsupportedBrowsersByFeature(feature.caniuse);
    return feature.insertBefore || feature.insertAfter ? {
      browsers: unsupportedBrowsers,
      plugin: feature.plugin,
      id: `${feature.insertBefore ? 'before' : 'after'}-${feature.id}`,
      stage: 6
    } : {
      browsers: unsupportedBrowsers,
      plugin: plugins[feature.id],
      id: feature.id,
      stage: feature.stage
    };
  }); // staged features (those at or above the selected stage)

  const stagedFeatures = polyfillableFeatures.filter(feature => feature.id in features ? features[feature.id] : feature.stage >= stage).map(feature => ({
    browsers: feature.browsers,
    plugin: typeof feature.plugin.process === 'function' ? features[feature.id] === true ? sharedOpts // if the plugin is enabled and has shared options
    ? feature.plugin(Object.assign({}, sharedOpts)) // otherwise, if the plugin is enabled
    : feature.plugin() : sharedOpts // if the plugin has shared options and individual options
    ? feature.plugin(Object.assign({}, sharedOpts, features[feature.id])) // if the plugin has individual options
    : feature.plugin(Object.assign({}, features[feature.id])) // if the plugin is already initialized
    : feature.plugin,
    id: feature.id
  }));
  return (root, result) => {
    // browsers supported by the configuration
    const supportedBrowsers = browserslist(browsers, {
      path: result.root.source && result.root.source.input && result.root.source.input.file,
      ignoreUnknownVersions: true
    }); // features supported by the stage and browsers

    const supportedFeatures = stagedFeatures.filter(feature => supportedBrowsers.some(supportedBrowser => browserslist(feature.browsers, {
      ignoreUnknownVersions: true
    }).some(polyfillBrowser => polyfillBrowser === supportedBrowser))); // polyfills run in execution order

    const polyfills = supportedFeatures.reduce((promise, feature) => promise.then(() => feature.plugin(result.root, result)), Promise.resolve()).then(() => stagedAutoprefixer(result.root, result));
    return polyfills;
  };
});

const initializeSharedOpts = opts => {
  if ('importFrom' in opts || 'exportTo' in opts || 'preserve' in opts) {
    const sharedOpts = {};

    if ('importFrom' in opts) {
      sharedOpts.importFrom = opts.importFrom;
    }

    if ('exportTo' in opts) {
      sharedOpts.exportTo = opts.exportTo;
    }

    if ('preserve' in opts) {
      sharedOpts.preserve = opts.preserve;
    }

    return sharedOpts;
  }

  return false;
};

module.exports = index;
