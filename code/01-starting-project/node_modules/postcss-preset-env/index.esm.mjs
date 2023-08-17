import autoprefixer from 'autoprefixer';
import browserslist from 'browserslist';
import cssdb from 'cssdb';
import postcssAttributeCaseInsensitive from 'postcss-attribute-case-insensitive';
import postcssColorFunctionalNotation from 'postcss-color-functional-notation';
import postcssColorGray from 'postcss-color-gray';
import postcssColorHexAlpha from 'postcss-color-hex-alpha';
import postcssColorModFunction from 'postcss-color-mod-function';
import postcssColorRebeccapurple from 'postcss-color-rebeccapurple';
import postcssCustomMedia from 'postcss-custom-media';
import postcssCustomProperties from 'postcss-custom-properties';
import postcssCustomSelectors from 'postcss-custom-selectors';
import postcssDirPseudoClass from 'postcss-dir-pseudo-class';
import postcssDoublePositionGradients from 'postcss-double-position-gradients';
import postcssEnvFunction from 'postcss-env-function';
import postcssFocusVisible from 'postcss-focus-visible';
import postcssFocusWithin from 'postcss-focus-within';
import postcssFontVariant from 'postcss-font-variant';
import postcss from 'postcss';
import postcssGapProperties from 'postcss-gap-properties';
import postcssImageSetPolyfill from 'postcss-image-set-function';
import postcssInitial from 'postcss-initial';
import postcssLabFunction from 'postcss-lab-function';
import postcssLogical from 'postcss-logical';
import postcssMediaMinmax from 'postcss-media-minmax';
import postcssNesting from 'postcss-nesting';
import postcssOverflowShorthand from 'postcss-overflow-shorthand';
import postcssPageBreak from 'postcss-page-break';
import postcssPlace from 'postcss-place';
import postcssPseudoClassAnyLink from 'postcss-pseudo-class-any-link';
import postcssReplaceOverflowWrap from 'postcss-replace-overflow-wrap';
import postcssSelectorMatches from 'postcss-selector-matches';
import postcssSelectorNot from 'postcss-selector-not';
import { features, feature } from 'caniuse-lite';

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
  }))).reduce((array, feature$$1) => array.concat(feature$$1), []);
}

function getUnsupportedBrowsersByFeature(feature$$1) {
  const caniuseFeature = features[feature$$1]; // if feature support can be determined

  if (caniuseFeature) {
    const stats = feature(caniuseFeature).stats; // return an array of browsers and versions that do not support the feature

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
  const features$$1 = Object(Object(opts).features);
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
  feature$$1 => feature$$1.insertBefore || feature$$1.id in plugins).sort( // features sorted by execution order and then insertion order
  (a, b) => idsByExecutionOrder.indexOf(a.id) - idsByExecutionOrder.indexOf(b.id) || (a.insertBefore ? -1 : b.insertBefore ? 1 : 0) || (a.insertAfter ? 1 : b.insertAfter ? -1 : 0)).map( // polyfillable features as an object
  feature$$1 => {
    // target browsers for the polyfill
    const unsupportedBrowsers = getUnsupportedBrowsersByFeature(feature$$1.caniuse);
    return feature$$1.insertBefore || feature$$1.insertAfter ? {
      browsers: unsupportedBrowsers,
      plugin: feature$$1.plugin,
      id: `${feature$$1.insertBefore ? 'before' : 'after'}-${feature$$1.id}`,
      stage: 6
    } : {
      browsers: unsupportedBrowsers,
      plugin: plugins[feature$$1.id],
      id: feature$$1.id,
      stage: feature$$1.stage
    };
  }); // staged features (those at or above the selected stage)

  const stagedFeatures = polyfillableFeatures.filter(feature$$1 => feature$$1.id in features$$1 ? features$$1[feature$$1.id] : feature$$1.stage >= stage).map(feature$$1 => ({
    browsers: feature$$1.browsers,
    plugin: typeof feature$$1.plugin.process === 'function' ? features$$1[feature$$1.id] === true ? sharedOpts // if the plugin is enabled and has shared options
    ? feature$$1.plugin(Object.assign({}, sharedOpts)) // otherwise, if the plugin is enabled
    : feature$$1.plugin() : sharedOpts // if the plugin has shared options and individual options
    ? feature$$1.plugin(Object.assign({}, sharedOpts, features$$1[feature$$1.id])) // if the plugin has individual options
    : feature$$1.plugin(Object.assign({}, features$$1[feature$$1.id])) // if the plugin is already initialized
    : feature$$1.plugin,
    id: feature$$1.id
  }));
  return (root, result) => {
    // browsers supported by the configuration
    const supportedBrowsers = browserslist(browsers, {
      path: result.root.source && result.root.source.input && result.root.source.input.file,
      ignoreUnknownVersions: true
    }); // features supported by the stage and browsers

    const supportedFeatures = stagedFeatures.filter(feature$$1 => supportedBrowsers.some(supportedBrowser => browserslist(feature$$1.browsers, {
      ignoreUnknownVersions: true
    }).some(polyfillBrowser => polyfillBrowser === supportedBrowser))); // polyfills run in execution order

    const polyfills = supportedFeatures.reduce((promise, feature$$1) => promise.then(() => feature$$1.plugin(result.root, result)), Promise.resolve()).then(() => stagedAutoprefixer(result.root, result));
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

export default index;
