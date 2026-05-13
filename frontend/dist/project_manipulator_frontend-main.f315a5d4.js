// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (
  modules,
  entry,
  mainEntry,
  parcelRequireName,
  externals,
  distDir,
  publicUrl,
  devServer
) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var importMap = previousRequire.i || {};
  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        if (externals[name]) {
          return externals[name];
        }
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      if (res === false) {
        return {};
      }
      // Synthesize a module to follow re-exports.
      if (Array.isArray(res)) {
        var m = {__esModule: true};
        res.forEach(function (v) {
          var key = v[0];
          var id = v[1];
          var exp = v[2] || v[0];
          var x = newRequire(id);
          if (key === '*') {
            Object.keys(x).forEach(function (key) {
              if (
                key === 'default' ||
                key === '__esModule' ||
                Object.prototype.hasOwnProperty.call(m, key)
              ) {
                return;
              }

              Object.defineProperty(m, key, {
                enumerable: true,
                get: function () {
                  return x[key];
                },
              });
            });
          } else if (exp === '*') {
            Object.defineProperty(m, key, {
              enumerable: true,
              value: x,
            });
          } else {
            Object.defineProperty(m, key, {
              enumerable: true,
              get: function () {
                if (exp === 'default') {
                  return x.__esModule ? x.default : x;
                }
                return x[exp];
              },
            });
          }
        });
        return m;
      }
      return newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.require = nodeRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.distDir = distDir;
  newRequire.publicUrl = publicUrl;
  newRequire.devServer = devServer;
  newRequire.i = importMap;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  // Only insert newRequire.load when it is actually used.
  // The code in this file is linted against ES5, so dynamic import is not allowed.
  // INSERT_LOAD_HERE

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });
    }
  }
})({"aZpYj":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SERVER_PORT = 3000;
var HMR_SECURE = false;
var HMR_ENV_HASH = "439701173a9199ea";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "943fa854f315a5d4";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_SERVER_PORT, HMR_ENV_HASH, HMR_SECURE, HMR_USE_SSE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_SERVER_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var HMR_USE_SSE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , disposedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ , bundleNotFound = false;
function getHostname() {
    return HMR_HOST || (typeof location !== 'undefined' && location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || (typeof location !== 'undefined' ? location.port : HMR_SERVER_PORT);
}
// eslint-disable-next-line no-redeclare
let WebSocket = globalThis.WebSocket;
if (!WebSocket && typeof module.bundle.root === 'function') try {
    // eslint-disable-next-line no-global-assign
    WebSocket = module.bundle.root('ws');
} catch  {
// ignore.
}
var hostname = getHostname();
var port = getPort();
var protocol = HMR_SECURE || typeof location !== 'undefined' && location.protocol === 'https:' && ![
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
].includes(hostname) ? 'wss' : 'ws';
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if (!parent || !parent.isParcelRequire) {
    // Web extension context
    var extCtx = typeof browser === 'undefined' ? typeof chrome === 'undefined' ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes('test.js');
    }
    var ws;
    if (HMR_USE_SSE) ws = new EventSource('/__parcel_hmr');
    else try {
        // If we're running in the dev server's node runner, listen for messages on the parent port.
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) {
            parentPort.on('message', async (message)=>{
                try {
                    await handleMessage(message);
                    parentPort.postMessage('updated');
                } catch  {
                    parentPort.postMessage('restart');
                }
            });
            // After the bundle has finished running, notify the dev server that the HMR update is complete.
            queueMicrotask(()=>parentPort.postMessage('ready'));
        }
    } catch  {
        if (typeof WebSocket !== 'undefined') try {
            ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');
        } catch (err) {
            // Ignore cloudflare workers error.
            if (err.message && !err.message.includes('Disallowed operation called within global scope')) console.error(err.message);
        }
    }
    if (ws) {
        // $FlowFixMe
        ws.onmessage = async function(event /*: {data: string, ...} */ ) {
            var data /*: HMRMessage */  = JSON.parse(event.data);
            await handleMessage(data);
        };
        if (ws instanceof WebSocket) {
            ws.onerror = function(e) {
                if (e.message) console.error(e.message);
            };
            ws.onclose = function() {
                console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
            };
        }
    }
}
async function handleMessage(data /*: HMRMessage */ ) {
    checkedAssets = {} /*: {|[string]: boolean|} */ ;
    disposedAssets = {} /*: {|[string]: boolean|} */ ;
    assetsToAccept = [];
    assetsToDispose = [];
    bundleNotFound = false;
    if (data.type === 'reload') fullReload();
    else if (data.type === 'update') {
        // Remove error overlay if there is one
        if (typeof document !== 'undefined') removeErrorOverlay();
        let assets = data.assets;
        // Handle HMR Update
        let handled = assets.every((asset)=>{
            return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
        });
        // Dispatch a custom event in case a bundle was not found. This might mean
        // an asset on the server changed and we should reload the page. This event
        // gives the client an opportunity to refresh without losing state
        // (e.g. via React Server Components). If e.preventDefault() is not called,
        // we will trigger a full page reload.
        if (handled && bundleNotFound && assets.some((a)=>a.envHash !== HMR_ENV_HASH) && typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') handled = !window.dispatchEvent(new CustomEvent('parcelhmrreload', {
            cancelable: true
        }));
        if (handled) {
            console.clear();
            // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
            if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') window.dispatchEvent(new CustomEvent('parcelhmraccept'));
            await hmrApplyUpdates(assets);
            hmrDisposeQueue();
            // Run accept callbacks. This will also re-execute other disposed assets in topological order.
            let processedAssets = {};
            for(let i = 0; i < assetsToAccept.length; i++){
                let id = assetsToAccept[i][1];
                if (!processedAssets[id]) {
                    hmrAccept(assetsToAccept[i][0], id);
                    processedAssets[id] = true;
                }
            }
        } else fullReload();
    }
    if (data.type === 'error') {
        // Log parcel errors to console
        for (let ansiDiagnostic of data.diagnostics.ansi){
            let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
            console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
        }
        if (typeof document !== 'undefined') {
            // Render the fancy html overlay
            removeErrorOverlay();
            var overlay = createErrorOverlay(data.diagnostics.html);
            // $FlowFixMe
            document.body.appendChild(overlay);
        }
    }
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="${protocol === 'wss' ? 'https' : 'http'}://${hostname}:${port}/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, '') : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + '</div>').join('')}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ''}
      </div>
    `;
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if (typeof location !== 'undefined' && 'reload' in location) location.reload();
    else if (typeof extCtx !== 'undefined' && extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
    else try {
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) parentPort.postMessage('restart');
    } catch (err) {
        console.error("[parcel] \u26A0\uFE0F An HMR update was not accepted. Please restart the process.");
    }
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', // $FlowFixMe
    href.split('?')[0] + '?' + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout || typeof document === 'undefined') return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === 'js') {
        if (typeof document !== 'undefined') {
            let script = document.createElement('script');
            script.src = asset.url + '?t=' + Date.now();
            if (asset.outputFormat === 'esmodule') script.type = 'module';
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === 'function') {
            // Worker scripts
            if (asset.outputFormat === 'esmodule') return import(asset.url + '?t=' + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + '?t=' + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != 'undefined' && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        }
        // Always traverse to the parent bundle, even if we already replaced the asset in this bundle.
        // This is required in case modules are duplicated. We need to ensure all instances have the updated code.
        if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    checkedAssets = {};
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else if (a !== null) {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) {
            bundleNotFound = true;
            return true;
        }
        return hmrAcceptCheckOne(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return null;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    if (!cached) return true;
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
    return false;
}
function hmrDisposeQueue() {
    // Dispose all old assets.
    for(let i = 0; i < assetsToDispose.length; i++){
        let id = assetsToDispose[i][1];
        if (!disposedAssets[id]) {
            hmrDispose(assetsToDispose[i][0], id);
            disposedAssets[id] = true;
        }
    }
    assetsToDispose = [];
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        let assetsToAlsoAccept = [];
        cached.hot._acceptCallbacks.forEach(function(cb) {
            let additionalAssets = cb(function() {
                return getParents(module.bundle.root, id);
            });
            if (Array.isArray(additionalAssets) && additionalAssets.length) assetsToAlsoAccept.push(...additionalAssets);
        });
        if (assetsToAlsoAccept.length) {
            let handled = assetsToAlsoAccept.every(function(a) {
                return hmrAcceptCheck(a[0], a[1]);
            });
            if (!handled) return fullReload();
            hmrDisposeQueue();
        }
    }
}

},{}],"50W2s":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _gamesManagerJs = require("./GamesManager.js");
var _gamesManagerJsDefault = parcelHelpers.interopDefault(_gamesManagerJs);
var _moverJs = require("./games/Mover.js");
var _moverJsDefault = parcelHelpers.interopDefault(_moverJs);
var _mover2Js = require("./games/Mover2.js");
var _mover2JsDefault = parcelHelpers.interopDefault(_mover2Js);
var _chessJs = require("./games/Chess.js");
var _chessJsDefault = parcelHelpers.interopDefault(_chessJs);
const gameList = [
    [
        (0, _chessJsDefault.default),
        "\u0428\u0430\u0445\u043C\u0430\u0442\u044B"
    ],
    [
        (0, _moverJsDefault.default),
        'Mover'
    ],
    [
        (0, _mover2JsDefault.default),
        'Mover2'
    ]
];
new (0, _gamesManagerJsDefault.default)(gameList);

},{"./GamesManager.js":"5lxyy","./games/Mover.js":"eezKy","./games/Mover2.js":"22uZo","./games/Chess.js":"eXmjW","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"5lxyy":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
class GamesManager {
    selectors = {
        menuList: '[data-js-menu-list]',
        desks: '[data-js-desks]'
    };
    stateClasses = {
        isActive: 'is-active',
        isChosen: 'is-chosen'
    };
    constructor(gameList){
        this.menuListElement = document.querySelector(this.selectors.menuList);
        this.gameObjects = [];
        gameList.forEach((game, index)=>{
            this.injectGame(game, index);
        });
        this.gameObjects[0].object.activateGame();
        this.buttonList = document.querySelectorAll('[data-game-name]');
    }
    injectGame(game, index) {
        const gameName = game[1];
        const gameObject = game[0];
        this.gameObjects[index] = {
            object: new gameObject(),
            name: gameName
        };
        this.gameObjects[index].object.deactivateGame();
        this.addGameButton(gameName);
        console.log('Game "' + gameName + '" injected');
    }
    setGameActive(gameName) {
        this.gameObjects.forEach((game)=>{
            game.name === gameName ? game.object.activateGame() : game.object.deactivateGame();
        });
    }
    addGameButton(gameName) {
        const menuItem = document.createElement('li');
        menuItem.className = 'left-panel__menu-item';
        const menuButton = document.createElement('button');
        menuButton.className = 'left-panel__menu-button';
        menuButton.innerHTML = gameName;
        menuButton.setAttribute('data-game-name', gameName);
        menuItem.append(menuButton);
        this.menuListElement.append(menuItem);
        menuButton.addEventListener('click', (e)=>{
            const gameName = e.target.getAttribute('data-game-name');
            this.buttonList.forEach((el)=>{
                el.classList.remove(this.stateClasses.isChosen);
            });
            e.target.classList.add(this.stateClasses.isChosen);
            this.setGameActive(gameName);
        });
    }
}
exports.default = GamesManager;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"jnFvT":[function(require,module,exports,__globalThis) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || Object.prototype.hasOwnProperty.call(dest, key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"eezKy":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _gameBaseJs = require("../GameBase.js");
var _gameBaseJsDefault = parcelHelpers.interopDefault(_gameBaseJs);
const BACKEND = 'http://127.0.0.1:8081';
const SYMBOLS = {
    white: {
        king: "\u2654",
        queen: "\u2655",
        rook: "\u2656",
        bishop: "\u2657",
        knight: "\u2658",
        pawn: "\u2659"
    },
    black: {
        king: "\u265A",
        queen: "\u265B",
        rook: "\u265C",
        bishop: "\u265D",
        knight: "\u265E",
        pawn: "\u265F"
    }
};
class Mover extends (0, _gameBaseJsDefault.default) {
    initDesks() {
        this.deskCount = 2;
        this.deskColumns = 8;
        this.deskRows = 8;
    }
    gameInit() {
        this.board1 = [];
        this.board2 = [];
        this.selectedPiece = null;
        this.selectedCell = null;
        this.isDirty = false;
        this._injectCSS();
        this._buildUI();
    }
    activateGame() {
        super.activateGame();
        const ctrl = document.querySelector('.controls');
        if (ctrl) ctrl.style.display = 'flex';
        this._loadBoardsFromBackend();
    }
    deactivateGame() {
        super.deactivateGame();
    }
    async _loadBoardsFromBackend() {
        try {
            const res = await fetch(`${BACKEND}/api/chess/boards`);
            const data = await res.json();
            if (data.ok) {
                this.board1 = data.board1;
                this.board2 = data.board2;
                this.isDirty = false;
            }
        } catch (e) {
            console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0434\u043E\u0441\u043E\u043A:", e);
        }
        this.selectedPiece = null;
        this.selectedCell = null;
        this.setCanSend(false);
        this._render();
    }
    async _saveBoardsToBackend() {
        try {
            const res = await fetch(`${BACKEND}/api/chess/boards-update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    board1: this.board1,
                    board2: this.board2
                })
            });
            const data = await res.json();
            if (data.ok) {
                this.isDirty = false;
                console.log("\u0411\u044D\u043A\u0435\u043D\u0434 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D (\u0431\u0435\u0437 \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u044F \u043C\u0430\u043D\u0438\u043F\u0443\u043B\u044F\u0442\u043E\u0440\u0430).");
            } else alert("\u041E\u0448\u0438\u0431\u043A\u0430 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F \u043D\u0430 \u0431\u044D\u043A\u0435\u043D\u0434\u0435: " + data.error);
        } catch (e) {
            console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u0434\u043E\u0441\u043E\u043A:", e);
        }
    }
    gameLogic(row, column, deskNum) {
        const pieces = deskNum === 0 ? this.board1 : this.board2;
        const piece = pieces.find((p)=>p.row === row && p.col === column);
        if (piece) {
            if (this.selectedPiece && this.selectedPiece.deskNum === deskNum && this.selectedPiece.row === row && this.selectedPiece.col === column) this.selectedPiece = null;
            else this.selectedPiece = {
                row,
                col: column,
                deskNum,
                data: piece
            };
            this.selectedCell = null;
        } else if (this.selectedPiece) this.selectedCell = {
            row,
            col: column,
            deskNum
        };
        else this.selectedCell = null;
        if (this.selectedPiece && this.selectedCell) this.setCanSend(true);
        else this.setCanSend(false);
        this._render();
    }
    async makeMove() {
        if (!this.canSend) return;
        this._movePieceLocal(this.selectedPiece.deskNum, this.selectedPiece.row, this.selectedPiece.col, this.selectedCell.deskNum, this.selectedCell.row, this.selectedCell.col);
        await this._saveBoardsToBackend();
        this.selectedPiece = null;
        this.selectedCell = null;
        this.setCanSend(false);
        this._render();
    }
    _movePieceLocal(fromBoard, fromRow, fromCol, toBoard, toRow, toCol) {
        const pieces = fromBoard === 0 ? this.board1 : this.board2;
        const pieceFinder = pieces.findIndex((p)=>p.row === fromRow && p.col === fromCol);
        if (pieceFinder === -1) return;
        const piece = pieces[pieceFinder];
        pieces.splice(pieceFinder, 1);
        const targetPieces = toBoard === 0 ? this.board1 : this.board2;
        const targetIdx = targetPieces.findIndex((p)=>p.row === toRow && p.col === toCol);
        if (targetIdx !== -1) targetPieces.splice(targetIdx, 1);
        targetPieces.push({
            row: toRow,
            col: toCol,
            color: piece.color,
            type: piece.type
        });
    }
    onCommandSent() {}
    _render() {
        for(let deskNum = 0; deskNum < 2; deskNum++){
            for(let row = 0; row < 8; row++)for(let col = 0; col < 8; col++){
                const cell = this._cell(row, col, deskNum);
                cell.style.backgroundColor = (row + col) % 2 === 0 ? '#f0d9b5' : '#b58863';
                cell.classList.remove('mover-selected', 'mover-target');
                cell.textContent = '';
                cell.style.cursor = 'pointer';
                if (this.selectedPiece && this.selectedPiece.deskNum === deskNum && this.selectedPiece.row === row && this.selectedPiece.col === col) {
                    cell.style.backgroundColor = (row + col) % 2 === 0 ? '#cdd26a' : '#aaa23a';
                    cell.classList.add('mover-selected');
                }
                if (this.selectedCell && this.selectedCell.deskNum === deskNum && this.selectedCell.row === row && this.selectedCell.col === col) {
                    cell.style.backgroundColor = (row + col) % 2 === 0 ? '#b5cde8' : '#8bb8e8';
                    cell.classList.add('mover-target');
                }
            }
            const pieces = deskNum === 0 ? this.board1 : this.board2;
            pieces.forEach((piece)=>{
                const cell = this._cell(piece.row, piece.col, deskNum);
                cell.textContent = SYMBOLS[piece.color][piece.type];
            });
        }
        this._updatePanelInfo();
    }
    _cell(row, col, deskNum) {
        return this.desk[deskNum].cells[(this.deskRows - 1 - row) * this.deskColumns + col];
    }
    _buildUI() {
        this.gameScreen.classList.add('mover-mode');
        const panel = document.createElement('div');
        this._panelEl = panel;
        panel.className = 'mover-panel';
        panel.innerHTML = `
      <div class="mover-panel-header">
        <h2>\u{41C}\u{430}\u{441}\u{441}\u{438}\u{432}\u{44B} \u{411}\u{44D}\u{43A}\u{435}\u{43D}\u{434}\u{430}</h2>
      </div>
      <div class="mover-panel-content">
        <div class="mover-board-info">
          <div class="mover-board-title">\u{414}\u{43E}\u{441}\u{43A}\u{430} 2 (\u{418}\u{433}\u{440}\u{43E}\u{432}\u{430}\u{44F})</div>
          <div class="mover-board-count" id="mover-board2-count">\u{424}\u{438}\u{433}\u{443}\u{440}: 32</div>
        </div>
        <div class="mover-board-info" style="border-left-color: #8bb8e8;">
          <div class="mover-board-title">\u{414}\u{43E}\u{441}\u{43A}\u{430} 1 (\u{421}\u{44A}\u{435}\u{434}\u{435}\u{43D}\u{43D}\u{44B}\u{435})</div>
          <div class="mover-board-count" id="mover-board1-count">\u{424}\u{438}\u{433}\u{443}\u{440}: 0</div>
        </div>
      </div>
      <div class="mover-panel-help">
        <p style="font-size: 12px; color: #666; margin: 10px 0;">
          <b>\u{421}\u{438}\u{43D}\u{445}\u{440}\u{43E}\u{43D}\u{438}\u{437}\u{430}\u{446}\u{438}\u{44F}:</b> \u{412}\u{44B}\u{434}\u{435}\u{43B}\u{438}\u{442}\u{435} \u{444}\u{438}\u{433}\u{443}\u{440}\u{443}, \u{437}\u{430}\u{442}\u{435}\u{43C} \u{43A}\u{43B}\u{435}\u{442}\u{43A}\u{443} \u{438} \u{43D}\u{430}\u{436}\u{43C}\u{438}\u{442}\u{435} <b>MOVE</b> \u{432}\u{43D}\u{438}\u{437}\u{443} \u{44D}\u{43A}\u{440}\u{430}\u{43D}\u{430}.
        </p>
      </div>
      <div class="mover-panel-footer">
        <button class="mover-btn mover-btn-reload" id="mover-reload-btn">\u{1F504} \u{41E}\u{431}\u{43D}\u{43E}\u{432}\u{438}\u{442}\u{44C} \u{441} \u{431}\u{44D}\u{43A}\u{435}\u{43D}\u{434}\u{430}</button>
      </div>
    `;
        this.gameScreen.appendChild(panel);
        document.getElementById('mover-reload-btn').addEventListener('click', ()=>this._loadBoardsFromBackend());
    }
    _updatePanelInfo() {
        const b1 = document.getElementById('mover-board1-count');
        const b2 = document.getElementById('mover-board2-count');
        if (b1) b1.textContent = `\u{424}\u{438}\u{433}\u{443}\u{440}: ${this.board1.length}`;
        if (b2) b2.textContent = `\u{424}\u{438}\u{433}\u{443}\u{440}: ${this.board2.length}`;
    }
    _injectCSS() {
        if (document.getElementById('mover-styles')) return;
        const s = document.createElement('style');
        s.id = 'mover-styles';
        s.textContent = `
      .mover-mode {
        flex-direction: row !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 3vw !important;
        width: 100% !important;
        height: 100% !important;
      }

      /* \u{41C}\u{430}\u{442}\u{435}\u{43C}\u{430}\u{442}\u{438}\u{447}\u{435}\u{441}\u{43A}\u{438} \u{432}\u{44B}\u{432}\u{435}\u{440}\u{435}\u{43D}\u{43D}\u{44B}\u{435} \u{43A}\u{432}\u{430}\u{434}\u{440}\u{430}\u{442}\u{43D}\u{44B}\u{435} \u{434}\u{43E}\u{441}\u{43A}\u{438} */
      .mover-mode .desk__wrapper {
        /* \u{428}\u{438}\u{440}\u{438}\u{43D}\u{430} \u{432}\u{44B}\u{447}\u{438}\u{441}\u{43B}\u{44F}\u{435}\u{442}\u{441}\u{44F} \u{43A}\u{430}\u{43A} \u{43C}\u{438}\u{43D}\u{438}\u{43C}\u{443}\u{43C} \u{43C}\u{435}\u{436}\u{434}\u{443} (\u{43F}\u{43E}\u{43B}\u{43E}\u{432}\u{438}\u{43D}\u{430} \u{441}\u{432}\u{43E}\u{431}\u{43E}\u{434}\u{43D}\u{43E}\u{433}\u{43E} \u{43C}\u{435}\u{441}\u{442}\u{430} \u{431}\u{435}\u{437} \u{43F}\u{430}\u{43D}\u{435}\u{43B}\u{438}) \u{438} (60% \u{432}\u{44B}\u{441}\u{43E}\u{442}\u{44B} \u{44D}\u{43A}\u{440}\u{430}\u{43D}\u{430}) */
        width: min(calc((100% - 320px) / 2), 60vh) !important;
        height: auto !important; 
        aspect-ratio: 1 / 1 !important; /* \u{421}\u{442}\u{440}\u{43E}\u{433}\u{438}\u{439} \u{43A}\u{432}\u{430}\u{434}\u{440}\u{430}\u{442} */
        flex: 0 0 auto !important;
        position: relative;
        overflow: visible !important;
        container-type: inline-size; /* \u{41F}\u{43E}\u{437}\u{432}\u{43E}\u{43B}\u{44F}\u{435}\u{442} \u{448}\u{440}\u{438}\u{444}\u{442}\u{443} \u{432}\u{43D}\u{443}\u{442}\u{440}\u{438} \u{434}\u{43E}\u{441}\u{43A}\u{438} \u{437}\u{430}\u{432}\u{438}\u{441}\u{435}\u{442}\u{44C} \u{43E}\u{442} \u{435}\u{451} \u{448}\u{438}\u{440}\u{438}\u{43D}\u{44B} */
        margin-top: 30px; /* \u{41C}\u{435}\u{441}\u{442}\u{43E} \u{43F}\u{43E}\u{434} \u{437}\u{430}\u{433}\u{43E}\u{43B}\u{43E}\u{432}\u{43A}\u{438} */
        min-width: 220px;
      }

      /* \u{412}\u{44B}\u{441}\u{442}\u{440}\u{430}\u{438}\u{432}\u{430}\u{435}\u{43C} \u{44D}\u{43B}\u{435}\u{43C}\u{435}\u{43D}\u{442}\u{44B}: \u{414}\u{43E}\u{441}\u{43A}\u{430} 2 -> \u{414}\u{43E}\u{441}\u{43A}\u{430} 1 -> \u{41F}\u{430}\u{43D}\u{435}\u{43B}\u{44C} */
      .mover-mode .desk__wrapper[data-index="2"] { order: 1; }
      .mover-mode .desk__wrapper[data-index="1"] { order: 2; }
      .mover-panel { order: 3; }

      /* \u{417}\u{430}\u{433}\u{43E}\u{43B}\u{43E}\u{432}\u{43A}\u{438} \u{434}\u{43E}\u{441}\u{43E}\u{43A} */
      .mover-mode .desk__wrapper[data-index="2"]::before {
        content: "\u{414}\u{43E}\u{441}\u{43A}\u{430} 2 (\u{418}\u{433}\u{440}\u{43E}\u{432}\u{430}\u{44F})";
        position: absolute; top: -30px; left: 50%; transform: translateX(-50%);
        font-weight: 800; font-size: clamp(14px, 5cqw, 18px); color: #3d2410; white-space: nowrap;
      }
      .mover-mode .desk__wrapper[data-index="1"]::before {
        content: "\u{414}\u{43E}\u{441}\u{43A}\u{430} 1 (\u{421}\u{44A}\u{435}\u{434}\u{435}\u{43D}\u{43D}\u{44B}\u{435} \u{444}\u{438}\u{433}\u{443}\u{440}\u{44B})";
        position: absolute; top: -30px; left: 50%; transform: translateX(-50%);
        font-weight: 800; font-size: clamp(14px, 5cqw, 18px); color: #3d2410; white-space: nowrap;
      }

      .mover-mode .desk__cells {
        gap: 0 !important;
        padding: 6px !important;
        background: #3d2410 !important;
        border-radius: 6px !important;
        box-shadow: 0 0 0 2px #5c3a20, 0 10px 36px rgba(0,0,0,.45) !important;
      }

      .desk__cell {
        display: flex !important; align-items: center !important;
        justify-content: center !important; overflow: hidden;
        transition: filter .1s !important; border-radius: 3px !important;
        font-size: 10cqw !important; /* \u{420}\u{430}\u{437}\u{43C}\u{435}\u{440} \u{448}\u{430}\u{445}\u{43C}\u{430}\u{442}\u{43D}\u{44B}\u{445} \u{444}\u{438}\u{433}\u{443}\u{440}\u{43E}\u{43A} \u{438}\u{434}\u{435}\u{430}\u{43B}\u{44C}\u{43D}\u{43E} \u{432}\u{43F}\u{438}\u{441}\u{44B}\u{432}\u{430}\u{435}\u{442}\u{441}\u{44F} \u{432} \u{44F}\u{447}\u{435}\u{439}\u{43A}\u{443} */
      }
      .desk__cell:hover { filter: brightness(1.15) !important; }

      .mover-panel {
        width: 260px; flex-shrink: 0;
        display: flex; flex-direction: column; gap: 12px;
        align-self: center;
      }
      .mover-panel-header, .mover-panel-content, .mover-panel-help, .mover-panel-footer {
        background: #fff; border-radius: 12px;
        padding: 16px; box-shadow: 0 4px 12px rgba(0,0,0,.08);
      }
      .mover-panel-header h2 { margin: 0; font-size: 16px; color: #222; text-align: center; }
      .mover-panel-content { display: flex; flex-direction: column; gap: 10px; padding: 12px; }
      
      .mover-board-info {
        padding: 10px; background: #f5f5f5;
        border-radius: 8px; border-left: 3px solid #5c7a5c;
      }
      .mover-board-title { font-weight: 700; font-size: 12px; color: #333; margin-bottom: 4px; }
      .mover-board-count { font-size: 13px; color: #666; }

      .mover-btn {
        width: 100%; border: none; border-radius: 8px;
        padding: 12px; font-size: 13px; font-weight: 700;
        cursor: pointer; transition: background .15s;
        color: #fff; background: #5c6a7a;
      }
      .mover-btn:hover { background: #4a5a6a; }

      .mover-selected { box-shadow: inset 0 0 0 3px #7bc67e !important; }
      .mover-target { box-shadow: inset 0 0 0 3px #4a90e2 !important; }
    `;
        document.head.appendChild(s);
    }
}
exports.default = Mover;

},{"../GameBase.js":"lzUhs","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"lzUhs":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
class GameBase {
    selectors = {
        desk: '[data-js-desk]',
        cell: '[data-js-cell]',
        item: '[data-js-item]',
        moveButton: '[data-js-move-button]',
        desks: '[data-js-desks]'
    };
    stateClasses = {
        inactive: 'inactive',
        image: 'image'
    };
    colors = {
        accent: 'var(--color-accent)',
        accentDarker: 'var(--color-accent-darker)',
        creamDarker: 'var(--color-cream-darker)',
        black: 'var(--color-black)',
        white: 'var(--color-white)'
    };
    decorations = {
        cross: 'cross',
        grayPoint: 'gray-point',
        borderAccent: 'border-accent',
        borderCreamDarker: 'border-cream-darker'
    };
    constructor(){
        this.url = 'http://127.0.0.1:8000/api/move/';
        this.desks = document.querySelector(this.selectors.desks);
        this.deskCount = 2;
        this.deskColumns = 8;
        this.deskRows = 8;
        this.initDesks();
        this.gameScreen = null;
        this.desk = [];
        this.generateDesks();
        this.gameInit();
        this.moveButtonElement = document.querySelector(this.selectors.moveButton);
        this.canSend = false;
        this.stringToSend = '';
        this.updateSizes();
        this.bindEvents();
        this.moveButtonElement.classList.toggle(this.stateClasses.inactive, !this.canSend);
    }
    generateDesks() {
        document.documentElement.style.setProperty('--cell-rows', this.deskRows);
        document.documentElement.style.setProperty('--cell-colunms', this.deskColumns);
        //this.desks.innerHTML = "";
        const cellsCount = this.deskColumns * this.deskRows;
        this.gameScreen = document.createElement("div");
        this.gameScreen.className = "desk__game";
        for(let deskIndex = 0; deskIndex < this.deskCount; deskIndex++){
            const wrapper = document.createElement("div");
            wrapper.className = "desk__wrapper";
            wrapper.dataset.index = deskIndex + 1;
            const desk = document.createElement("div");
            desk.className = "desk";
            desk.dataset.index = deskIndex + 1;
            desk.dataset.jsDesk = "";
            const cellsContainer = document.createElement("div");
            cellsContainer.className = "desk__cells";
            cellsContainer.dataset.jsCells = "";
            for(let cellIndex = 0; cellIndex < cellsCount; cellIndex++){
                const cell = document.createElement("div");
                cell.className = "desk__cell";
                cell.dataset.jsCell = "";
                cell.dataset.index = cellIndex;
                cellsContainer.append(cell);
            }
            desk.append(cellsContainer);
            wrapper.append(desk);
            this.gameScreen.append(wrapper);
            this.desk[deskIndex] = {
                deskElement: desk,
                cells: desk.querySelectorAll(this.selectors.cell)
            };
        }
        this.desks.append(this.gameScreen);
    }
    activateGame() {
        this.gameScreen.classList.remove(this.stateClasses.inactive);
    }
    deactivateGame() {
        this.gameScreen.classList.add(this.stateClasses.inactive);
    }
    updateSizes() {
        if (this.desk) {
            this.deskRect = this.desk[0].deskElement.getBoundingClientRect();
            this.cellHeight = this.deskRect.height / (this.deskRows + 1);
            this.cellWidth = this.deskRect.width / (this.deskColumns + 1);
            this.rowGap = this.cellHeight / (this.deskRows + 1);
            this.columnGap = this.cellWidth / (this.deskColumns + 1);
        }
    }
    handleClickCell(e) {
        const index = e.target.getAttribute('data-index');
        const row = this.deskRows - 1 - Math.floor(index / this.deskColumns);
        const column = index % this.deskColumns;
        const deskNum = e.target.closest(this.selectors.desk).getAttribute('data-index') - 1;
        //console.log(row, column, deskNum)
        this.gameLogic(row, column, deskNum);
        this.moveButtonElement.classList.toggle(this.stateClasses.inactive, !this.canSend);
    }
    processLogic(row, column, deskNum) {
        if (this.chosenEntity[0] === -1) {
            // начальная точка не выбрана
            // выбор точки отправки
            const entityNum = this.findEntity(row, column, deskNum);
            if (entityNum !== -1) // есть что отправлять
            this.chosenEntity = [
                entityNum,
                deskNum
            ];
            else {
                // иначе нечего отправлять
                const cellNum = this.findCell(row, column);
                this.chosenCell = [
                    cellNum,
                    deskNum
                ];
            }
        } else {
            // начальная точка выбрана
            // выбор точки назначения
            const entityNum = this.findEntity(row, column, deskNum);
            if (entityNum !== -1) // поле уже занято
            this.chosenEntity = [
                entityNum,
                deskNum
            ];
            else {
                // есть куда отправить
                const cellNum = this.findCell(row, column);
                this.chosenCell = [
                    cellNum,
                    deskNum
                ];
            }
        }
        if (this.chosenEntity[0] != -1 && this.chosenEntity[1] != -1 && this.chosenCell[0] != -1 && this.chosenCell[1] != -1) this.canSend = true;
        else this.canSend = false;
        //console.log(this.chosenEntity, this.chosenCell)
        this.updateDesk();
    }
    bindEvents() {
        // this.deskElement2.addEventListener('click', (e) => {
        //   this.handleClickDesk(e, this.deskElement2)
        // })
        // this.deskElement1.addEventListener('click', (e) => {
        //   this.handleClickDesk(e, this.deskElement1)
        // })
        this.desk.forEach((desk)=>{
            desk.cells.forEach((cell)=>{
                cell.addEventListener('click', (e)=>{
                    this.handleClickCell(e);
                });
            });
        });
        this.moveButtonElement.addEventListener('click', ()=>{
            this.makeMove();
        });
        window.addEventListener('resize', ()=>{
            this.updateSizes();
        });
    }
    async sendComand() {
        // 0 - успешная отправка команды
        // 1 - ошибка бэкенда
        // 2 - ошибка связи с бэкендом
        try {
            console.log(this.stringToSend);
            const response = await fetch(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: this.stringToSend
            });
            // Получаем тело ответа
            const result = await response.json();
            if (response.ok && result.ok) {
                console.log("\u0425\u043E\u0434 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D \u0443\u0441\u043F\u0435\u0448\u043D\u043E:", result.command);
                return [
                    0,
                    result
                ];
            } else {
                // Тут обрабатываем ошибки 400, 502 и логику "ok: false"
                console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0431\u0435\u043A\u0435\u043D\u0434\u0430:", result.error);
                alert(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430}: ${result.error}`);
                return [
                    1,
                    result
                ];
            }
        } catch (error) {
            // Если сервер упал или нет интернета
            console.error("\u0421\u0435\u0442\u0435\u0432\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430 \u0438\u043B\u0438 \u0441\u0435\u0440\u0432\u0435\u0440 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D:", error);
            return [
                2,
                error
            ];
        }
    }
    async makeMove() {
        if (!this.canSend) return;
        const result = await this.sendComand();
        this.onCommandSent(result);
    }
    // by engine
    setColor(row, column, deskNum, color = this.colors.creamDarker) {
        if (deskNum < this.deskCount && deskNum >= 0) {
            if (row < this.deskRows && row >= 0) {
                if (column < this.deskColumns && column >= 0) this.desk[deskNum].cells[(this.deskRows - 1 - row) * this.deskColumns + column].style.setProperty('background-color', color);
            }
        }
    }
    setDecoration(row, column, deskNum, decoration = this.decorations.grayPoint) {
        if (deskNum < this.deskCount && deskNum >= 0) {
            if (row < this.deskRows && row >= 0) {
                if (column < this.deskColumns && column >= 0) {
                    Object.values(this.decorations).forEach((decor)=>{
                        this.desk[deskNum].cells[(this.deskRows - 1 - row) * this.deskColumns + column].classList.remove(decor);
                    });
                    this.desk[deskNum].cells[(this.deskRows - 1 - row) * this.deskColumns + column].classList.add(decoration);
                }
            }
        }
    }
    setCanSend(flag) {
        this.canSend = flag;
        this.moveButtonElement.classList.toggle(this.stateClasses.inactive, !this.canSend);
    }
    setImage(row, column, deskNum, imageLink = '') {
        const link = `url("${imageLink}")`;
        if (deskNum < this.deskCount && deskNum >= 0) {
            if (row < this.deskRows && row >= 0) {
                if (column < this.deskColumns && column >= 0) {
                    if (imageLink === '') this.desk[deskNum].cells[(this.deskRows - 1 - row) * this.deskColumns + column].classList.remove('image');
                    else {
                        this.desk[deskNum].cells[(this.deskRows - 1 - row) * this.deskColumns + column].classList.add('image');
                        this.desk[deskNum].cells[(this.deskRows - 1 - row) * this.deskColumns + column].style.setProperty('--background-image', link);
                    }
                }
            }
        }
    }
    initDesks() {
        console.error('initDesks has to be initialised!');
    }
    gameInit() {
        console.error('gameInit has to be initialised!');
    }
    gameLogic(row, column, deskNum) {
        console.error('gameLogic has to be initialised!');
    }
    onCommandSent(params) {
        console.error('onCommandSent has to be initialised!');
    }
}
exports.default = GameBase;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"22uZo":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _gameBaseJs = require("../GameBase.js");
var _gameBaseJsDefault = parcelHelpers.interopDefault(_gameBaseJs);
const BACKEND = 'http://127.0.0.1:8081';
const SYMBOLS = {
    white: {
        king: "\u2654",
        queen: "\u2655",
        rook: "\u2656",
        bishop: "\u2657",
        knight: "\u2658",
        pawn: "\u2659"
    },
    black: {
        king: "\u265A",
        queen: "\u265B",
        rook: "\u265C",
        bishop: "\u265D",
        knight: "\u265E",
        pawn: "\u265F"
    }
};
class Mover2 extends (0, _gameBaseJsDefault.default) {
    initDesks() {
        this.deskCount = 2;
        this.deskColumns = 8;
        this.deskRows = 8;
    }
    gameInit() {
        this.board1 = [] // съеденные фигуры
        ;
        this.board2 = [] // активная партия
        ;
        this.selectedPiece = null;
        this.selectedCell = null;
        this.isDirty = false;
        this._injectCSS();
        this._buildUI();
    }
    activateGame() {
        super.activateGame();
        const ctrl = document.querySelector('.controls');
        if (ctrl) ctrl.style.display = 'flex';
        this._loadBoardsFromBackend();
    }
    deactivateGame() {
        super.deactivateGame();
    }
    async _loadBoardsFromBackend() {
        try {
            const res = await fetch(`${BACKEND}/api/chess/boards`);
            const data = await res.json();
            if (data.ok) {
                this.board1 = data.board1;
                this.board2 = data.board2;
                this.isDirty = false;
            }
        } catch (e) {
            console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0434\u043E\u0441\u043E\u043A:", e);
        }
        this.selectedPiece = null;
        this.selectedCell = null;
        this.setCanSend(false);
        this._render();
    }
    async _saveBoardsToBackend() {
        try {
            const res = await fetch(`${BACKEND}/api/chess/boards-update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    board1: this.board1,
                    board2: this.board2
                })
            });
            const data = await res.json();
            if (data.ok) {
                this.isDirty = false;
                console.log("\u0411\u044D\u043A\u0435\u043D\u0434 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D.");
            } else alert("\u041E\u0448\u0438\u0431\u043A\u0430 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F \u043D\u0430 \u0431\u044D\u043A\u0435\u043D\u0434\u0435: " + data.error);
        } catch (e) {
            console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u0434\u043E\u0441\u043E\u043A:", e);
        }
    }
    gameLogic(row, column, deskNum) {
        const pieces = deskNum === 0 ? this.board1 : this.board2;
        const piece = pieces.find((p)=>p.row === row && p.col === column);
        if (piece) {
            if (this.selectedPiece && this.selectedPiece.deskNum === deskNum && this.selectedPiece.row === row && this.selectedPiece.col === column) this.selectedPiece = null;
            else this.selectedPiece = {
                row,
                col: column,
                deskNum,
                data: piece
            };
            this.selectedCell = null;
        } else if (this.selectedPiece) this.selectedCell = {
            row,
            col: column,
            deskNum
        };
        else this.selectedCell = null;
        if (this.selectedPiece && this.selectedCell) this.setCanSend(true);
        else this.setCanSend(false);
        this._render();
    }
    // ─── ГЛАВНОЕ ОТЛИЧИЕ ОТ MOVER 1 ────────────────────────────────────
    async makeMove() {
        if (!this.canSend) return;
        // 1. Считаем координаты 1..64 для манипулятора
        const fromBoard = this.selectedPiece.deskNum + 1; // 1 (Съеденные) или 2 (Игровая)
        const toBoard = this.selectedCell.deskNum + 1;
        const posFrom = this.selectedPiece.row * 8 + this.selectedPiece.col + 1;
        const posTo = this.selectedCell.row * 8 + this.selectedCell.col + 1;
        console.log(`[Mover2] \u{41E}\u{442}\u{43F}\u{440}\u{430}\u{432}\u{43A}\u{430} \u{43D}\u{430} \u{43C}\u{430}\u{43D}\u{438}\u{43F}\u{443}\u{43B}\u{44F}\u{442}\u{43E}\u{440}: \u{414}\u{43E}\u{441}\u{43A}\u{430} ${fromBoard} \u{41F}\u{43E}\u{437} ${posFrom} -> \u{414}\u{43E}\u{441}\u{43A}\u{430} ${toBoard} \u{41F}\u{43E}\u{437} ${posTo}`);
        try {
            // 2. Делаем физический ход манипулятором
            const res = await fetch(`${BACKEND}/api/move`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    board_from: fromBoard,
                    pos_from: posFrom,
                    board_to: toBoard,
                    pos_to: posTo
                })
            });
            const data = await res.json();
            if (!data.ok) {
                alert("\u041E\u0448\u0438\u0431\u043A\u0430 \u043C\u0430\u043D\u0438\u043F\u0443\u043B\u044F\u0442\u043E\u0440\u0430: " + data.error);
                return; // Если физически не удалось переместить — прерываемся и ничего не сохраняем
            }
        } catch (e) {
            console.error("\u0421\u0435\u0442\u0435\u0432\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u0435\u0440\u0435\u043C\u0435\u0449\u0435\u043D\u0438\u0438:", e);
            alert("\u0421\u0435\u0442\u0435\u0432\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u0438 \u043A \u043C\u0430\u043D\u0438\u043F\u0443\u043B\u044F\u0442\u043E\u0440\u0443");
            return;
        }
        // 3. Манипулятор походил! Теперь двигаем фишку локально в массивах
        this._movePieceLocal(this.selectedPiece.deskNum, this.selectedPiece.row, this.selectedPiece.col, this.selectedCell.deskNum, this.selectedCell.row, this.selectedCell.col);
        // 4. Обновляем память бэкенда
        await this._saveBoardsToBackend();
        // 5. Сбрасываем состояния
        this.selectedPiece = null;
        this.selectedCell = null;
        this.setCanSend(false);
        this._render();
    }
    // ───────────────────────────────────────────────────────────────────
    _movePieceLocal(fromBoard, fromRow, fromCol, toBoard, toRow, toCol) {
        const pieces = fromBoard === 0 ? this.board1 : this.board2;
        const pieceFinder = pieces.findIndex((p)=>p.row === fromRow && p.col === fromCol);
        if (pieceFinder === -1) return;
        const piece = pieces[pieceFinder];
        pieces.splice(pieceFinder, 1);
        const targetPieces = toBoard === 0 ? this.board1 : this.board2;
        const targetIdx = targetPieces.findIndex((p)=>p.row === toRow && p.col === toCol);
        if (targetIdx !== -1) targetPieces.splice(targetIdx, 1);
        targetPieces.push({
            row: toRow,
            col: toCol,
            color: piece.color,
            type: piece.type
        });
    }
    onCommandSent() {}
    _render() {
        for(let deskNum = 0; deskNum < 2; deskNum++){
            for(let row = 0; row < 8; row++)for(let col = 0; col < 8; col++){
                const cell = this._cell(row, col, deskNum);
                cell.style.backgroundColor = (row + col) % 2 === 0 ? '#f0d9b5' : '#b58863';
                cell.classList.remove('mover-selected', 'mover-target');
                cell.textContent = '';
                cell.style.cursor = 'pointer';
                if (this.selectedPiece && this.selectedPiece.deskNum === deskNum && this.selectedPiece.row === row && this.selectedPiece.col === col) {
                    cell.style.backgroundColor = (row + col) % 2 === 0 ? '#cdd26a' : '#aaa23a';
                    cell.classList.add('mover-selected');
                }
                if (this.selectedCell && this.selectedCell.deskNum === deskNum && this.selectedCell.row === row && this.selectedCell.col === col) {
                    cell.style.backgroundColor = (row + col) % 2 === 0 ? '#b5cde8' : '#8bb8e8';
                    cell.classList.add('mover-target');
                }
            }
            const pieces = deskNum === 0 ? this.board1 : this.board2;
            pieces.forEach((piece)=>{
                const cell = this._cell(piece.row, piece.col, deskNum);
                cell.textContent = SYMBOLS[piece.color][piece.type];
            });
        }
        this._updatePanelInfo();
    }
    _cell(row, col, deskNum) {
        return this.desk[deskNum].cells[(this.deskRows - 1 - row) * this.deskColumns + col];
    }
    _buildUI() {
        this.gameScreen.classList.add('mover-mode') // Используем те же стили, что и в Mover 1
        ;
        const panel = document.createElement('div');
        this._panelEl = panel;
        panel.className = 'mover-panel';
        // Обновили заголовок и описание, чтобы было понятно, где мы находимся
        panel.innerHTML = `
      <div class="mover-panel-header">
        <h2>Mover 2 (\u{421} \u{43C}\u{430}\u{43D}\u{438}\u{43F}\u{443}\u{43B}\u{44F}\u{442}\u{43E}\u{440}\u{43E}\u{43C})</h2>
      </div>
      <div class="mover-panel-content">
        <div class="mover-board-info">
          <div class="mover-board-title">\u{414}\u{43E}\u{441}\u{43A}\u{430} 2 (\u{418}\u{433}\u{440}\u{43E}\u{432}\u{430}\u{44F})</div>
          <div class="mover-board-count" id="mover-board2-count">\u{424}\u{438}\u{433}\u{443}\u{440}: 32</div>
        </div>
        <div class="mover-board-info" style="border-left-color: #8bb8e8;">
          <div class="mover-board-title">\u{414}\u{43E}\u{441}\u{43A}\u{430} 1 (\u{421}\u{44A}\u{435}\u{434}\u{435}\u{43D}\u{43D}\u{44B}\u{435})</div>
          <div class="mover-board-count" id="mover-board1-count">\u{424}\u{438}\u{433}\u{443}\u{440}: 0</div>
        </div>
      </div>
      <div class="mover-panel-help">
        <p style="font-size: 12px; color: #ff4a4a; margin: 10px 0; font-weight: bold;">
          \u{41E}\u{421}\u{422}\u{41E}\u{420}\u{41E}\u{416}\u{41D}\u{41E}: \u{41D}\u{430}\u{436}\u{430}\u{442}\u{438}\u{435} \u{43A}\u{43D}\u{43E}\u{43F}\u{43A}\u{438} MOVE \u{43F}\u{440}\u{438}\u{432}\u{435}\u{434}\u{451}\u{442} \u{43A} \u{444}\u{438}\u{437}\u{438}\u{447}\u{435}\u{441}\u{43A}\u{43E}\u{43C}\u{443} \u{434}\u{432}\u{438}\u{436}\u{435}\u{43D}\u{438}\u{44E} \u{43C}\u{430}\u{43D}\u{438}\u{43F}\u{443}\u{43B}\u{44F}\u{442}\u{43E}\u{440}\u{430}!
        </p>
      </div>
      <div class="mover-panel-footer">
        <button class="mover-btn mover-btn-reload" id="mover-reload-btn">\u{1F504} \u{41E}\u{431}\u{43D}\u{43E}\u{432}\u{438}\u{442}\u{44C} \u{441} \u{431}\u{44D}\u{43A}\u{435}\u{43D}\u{434}\u{430}</button>
      </div>
    `;
        this.gameScreen.appendChild(panel);
        document.getElementById('mover-reload-btn').addEventListener('click', ()=>this._loadBoardsFromBackend());
    }
    _updatePanelInfo() {
        const b1 = document.getElementById('mover-board1-count');
        const b2 = document.getElementById('mover-board2-count');
        if (b1) b1.textContent = `\u{424}\u{438}\u{433}\u{443}\u{440}: ${this.board1.length}`;
        if (b2) b2.textContent = `\u{424}\u{438}\u{433}\u{443}\u{440}: ${this.board2.length}`;
    }
    _injectCSS() {
        // Не инжектим CSS повторно, если он уже был добавлен Mover.js
        if (document.getElementById('mover2-styles')) return;
        const s = document.createElement('style');
        s.id = 'mover2-styles';
        // Стили наследуются от Mover 1, так как используется тот же класс .mover-mode
        document.head.appendChild(s);
    }
}
exports.default = Mover2;

},{"../GameBase.js":"lzUhs","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"eXmjW":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _gameBaseJs = require("../GameBase.js");
var _gameBaseJsDefault = parcelHelpers.interopDefault(_gameBaseJs);
const BACKEND = 'http://127.0.0.1:8081';
const FILES = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h'
];
const SYMBOLS = {
    white: {
        king: "\u2654",
        queen: "\u2655",
        rook: "\u2656",
        bishop: "\u2657",
        knight: "\u2658",
        pawn: "\u2659"
    },
    black: {
        king: "\u265A",
        queen: "\u265B",
        rook: "\u265C",
        bishop: "\u265D",
        knight: "\u265E",
        pawn: "\u265F"
    }
};
class Chess extends (0, _gameBaseJsDefault.default) {
    initDesks() {
        this.deskCount = 1 // Строго одна доска
        ;
        this.deskColumns = 8;
        this.deskRows = 8;
    }
    gameInit() {
        this.gameId = null;
        this.selectedFrom = null;
        this.validMoves = [];
        this.piecesState = [];
        this.turnState = 'white';
        this.statusState = 'ongoing';
        this.inCheck = false;
        this.uciHistory = [];
        this.capturedWhite = [];
        this.capturedBlack = [];
        this._injectCSS();
        this._buildUI();
        this._createGame();
    }
    activateGame() {
        super.activateGame();
        const ctrl = document.querySelector('.controls');
        if (ctrl) ctrl.style.display = 'none';
        this._loadBoardStateFromBackend();
    }
    deactivateGame() {
        super.deactivateGame();
    }
    async gameLogic(row, column) {
        if (this.statusState !== 'ongoing') return;
        const piece = this._pieceAt(row, column);
        if (this.selectedFrom) {
            const isValid = this.validMoves.some((m)=>m.row === row && m.col === column);
            if (isValid) {
                await this._sendMove(this.selectedFrom.row, this.selectedFrom.col, row, column);
                return;
            }
            if (piece && piece.color === this.turnState) {
                await this._selectPiece(row, column);
                return;
            }
            this._deselect();
            return;
        }
        if (piece && piece.color === this.turnState) await this._selectPiece(row, column);
    }
    onCommandSent() {}
    async _createGame() {
        try {
            const res = await fetch(`${BACKEND}/api/chess/new`, {
                method: 'POST'
            });
            const data = await res.json();
            this.gameId = data.game_id;
            this._applyState(data.state);
        } catch (e) {
            console.error("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u043F\u0430\u0440\u0442\u0438\u044E:", e);
        }
    }
    async _loadBoardStateFromBackend() {
        try {
            const res = await fetch(`${BACKEND}/api/chess/boards`);
            const data = await res.json();
            if (data.ok) console.log("\u0421\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0434\u043E\u0441\u043A\u0438 2 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u043E \u0441 \u0431\u044D\u043A\u0430");
        } catch (e) {
            console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F \u0434\u043E\u0441\u043A\u0438:", e);
        }
    }
    async _selectPiece(row, col) {
        this.selectedFrom = {
            row,
            col
        };
        try {
            const res = await fetch(`${BACKEND}/api/chess/moves?game_id=${this.gameId}&from_row=${row}&from_col=${col}`);
            const data = await res.json();
            this.validMoves = data.moves || [];
        } catch  {
            this.validMoves = [];
        }
        this._render();
    }
    async _sendMove(fr, fc, tr, tc) {
        const piece = this._pieceAt(fr, fc);
        const isPromo = piece?.type === 'pawn' && (tr === 7 || tr === 0);
        const promotion = isPromo ? await this._askPromotion() : null;
        try {
            const res = await fetch(`${BACKEND}/api/chess/move`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    game_id: this.gameId,
                    from_row: fr,
                    from_col: fc,
                    to_row: tr,
                    to_col: tc,
                    promotion
                })
            });
            const data = await res.json();
            if (data.ok) {
                this._trackCapture(fr, fc, tr, tc);
                this._applyState(data.state);
                if (data.state.status !== 'ongoing') this._showModal(data.state);
            }
        } catch (e) {
            console.error("\u0421\u0435\u0442\u0435\u0432\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430:", e);
        }
        this.selectedFrom = null;
        this.validMoves = [];
    }
    _deselect() {
        this.selectedFrom = null;
        this.validMoves = [];
        this._render();
    }
    _applyState(state) {
        this.piecesState = state.pieces;
        this.turnState = state.turn;
        this.statusState = state.status;
        this.inCheck = state.in_check;
        this.uciHistory = state.history || [];
        this.selectedFrom = null;
        this.validMoves = [];
        this._render();
        this._updatePanel();
    }
    _pieceAt(row, col) {
        return this.piecesState.find((p)=>p.row === row && p.col === col) ?? null;
    }
    _trackCapture(fr, fc, tr, tc) {
        const captured = this._pieceAt(tr, tc);
        if (captured) (captured.color === 'black' ? this.capturedWhite : this.capturedBlack).push(captured.type);
        const moving = this._pieceAt(fr, fc);
        if (moving?.type === 'pawn' && fc !== tc && !captured) (moving.color === 'white' ? this.capturedWhite : this.capturedBlack).push('pawn');
    }
    _render() {
        for(let row = 0; row < 8; row++)for(let col = 0; col < 8; col++){
            const cell = this._cell(row, col);
            cell.style.setProperty('background-color', (row + col) % 2 === 0 ? '#f0d9b5' : '#b58863');
            cell.style.setProperty('--background-image', '');
            cell.classList.remove('image', 'chess-dot', 'chess-ring', 'chess-check');
        }
        this.validMoves.forEach(({ row, col })=>{
            this._cell(row, col).classList.add(this._pieceAt(row, col) ? 'chess-ring' : 'chess-dot');
        });
        if (this.selectedFrom) {
            const { row, col } = this.selectedFrom;
            this._cell(row, col).style.setProperty('background-color', (row + col) % 2 === 0 ? '#cdd26a' : '#aaa23a');
        }
        if (this.inCheck) {
            const king = this.piecesState.find((p)=>p.color === this.turnState && p.type === 'king');
            if (king) this._cell(king.row, king.col).classList.add('chess-check');
        }
        this.piecesState.forEach(({ row, col, color, type })=>{
            const cell = this._cell(row, col);
            cell.classList.add('image');
            cell.style.setProperty('--background-image', `url("${this._pieceSvg(color, type)}")`);
        });
    }
    _cell(row, col) {
        return this.desk[0].cells[(this.deskRows - 1 - row) * this.deskColumns + col];
    }
    _updatePanel() {
        const isWhite = this.turnState === 'white';
        const ongoing = this.statusState === 'ongoing';
        document.getElementById('cp-white')?.classList.toggle('cp-active', isWhite && ongoing);
        document.getElementById('cp-black')?.classList.toggle('cp-active', !isWhite && ongoing);
        const ws = document.getElementById('cp-white-status');
        const bs = document.getElementById('cp-black-status');
        if (ws) ws.textContent = ongoing ? isWhite ? "\u25CF \u0445\u043E\u0434" : '' : '';
        if (bs) bs.textContent = ongoing ? !isWhite ? "\u25CF \u0445\u043E\u0434" : '' : '';
        const wc = document.getElementById('cp-white-cap');
        const bc = document.getElementById('cp-black-cap');
        if (wc) wc.textContent = this._formatCap(this.capturedWhite);
        if (bc) bc.textContent = this._formatCap(this.capturedBlack);
        const list = document.getElementById('cp-history');
        if (!list) return;
        list.innerHTML = '';
        for(let i = 0; i < this.uciHistory.length; i += 2){
            const row = document.createElement('div');
            row.className = 'cp-hist-row';
            row.innerHTML = `
        <span class="cp-hist-num">${Math.floor(i / 2) + 1}.</span>
        <span>${this.uciHistory[i] ?? ''}</span>
        <span>${this.uciHistory[i + 1] ?? ''}</span>`;
            list.appendChild(row);
        }
        list.scrollTop = list.scrollHeight;
    }
    _formatCap(list) {
        const map = {
            queen: "\u265B",
            rook: "\u265C",
            bishop: "\u265D",
            knight: "\u265E",
            pawn: "\u265F"
        };
        return [
            'queen',
            'rook',
            'bishop',
            'knight',
            'pawn'
        ].flatMap((t)=>{
            const n = list.filter((x)=>x === t).length;
            return n ? [
                map[t].repeat(n)
            ] : [];
        }).join(' ');
    }
    _askPromotion() {
        return new Promise((resolve)=>{
            const overlay = document.createElement('div');
            overlay.className = 'chess-modal-overlay';
            overlay.innerHTML = `
        <div class="chess-modal-box">
          <div class="chess-modal-title" style="margin-bottom:20px">\u{41F}\u{440}\u{435}\u{432}\u{440}\u{430}\u{449}\u{435}\u{43D}\u{438}\u{435} \u{43F}\u{435}\u{448}\u{43A}\u{438}</div>
          <div style="display:flex;gap:12px;justify-content:center">
            ${[
                'queen',
                'rook',
                'bishop',
                'knight'
            ].map((t)=>`<button class="chess-promo-btn" data-type="${t}">${SYMBOLS.white[t]}</button>`).join('')}
          </div>
        </div>`;
            document.body.appendChild(overlay);
            overlay.querySelectorAll('.chess-promo-btn').forEach((btn)=>btn.addEventListener('click', ()=>{
                    document.body.removeChild(overlay);
                    resolve(btn.dataset.type);
                }));
        });
    }
    _showModal(state) {
        const isCheckmate = state.status === 'checkmate';
        const winner = state.winner === 'white' ? "\u0411\u0435\u043B\u044B\u0435" : "\u0427\u0451\u0440\u043D\u044B\u0435";
        const overlay = document.createElement('div');
        overlay.className = 'chess-modal-overlay';
        overlay.innerHTML = `
      <div class="chess-modal-box">
        <div class="chess-modal-icon">${isCheckmate ? state.winner === 'white' ? "\u2654" : "\u265A" : "\uD83E\uDD1D"}</div>
        <div class="chess-modal-title">${isCheckmate ? `\u{41C}\u{430}\u{442}! \u{41F}\u{43E}\u{431}\u{435}\u{434}\u{438}\u{43B}\u{438} ${winner}` : "\u041F\u0430\u0442 \u2014 \u043D\u0438\u0447\u044C\u044F"}</div>
        <div class="chess-modal-sub">${isCheckmate ? `${winner} \u{43F}\u{43E}\u{441}\u{442}\u{430}\u{432}\u{438}\u{43B}\u{438} \u{43C}\u{430}\u{442}` : "\u041D\u0435\u0442 \u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u044B\u0445 \u0445\u043E\u0434\u043E\u0432"}</div>
        <button class="chess-modal-btn" id="chess-modal-restart">\u{41D}\u{43E}\u{432}\u{430}\u{44F} \u{43F}\u{430}\u{440}\u{442}\u{438}\u{44F}</button>
      </div>`;
        document.body.appendChild(overlay);
        document.getElementById('chess-modal-restart').addEventListener('click', ()=>{
            document.body.removeChild(overlay);
            this._newGame();
        });
    }
    async _newGame() {
        this.capturedWhite = [];
        this.capturedBlack = [];
        this.uciHistory = [];
        await this._createGame();
    }
    async _savePhysicalBoard(pieces) {
        try {
            const res = await fetch(`${BACKEND}/api/chess/update-physical-board`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pieces
                })
            });
            const data = await res.json();
            return data.ok;
        } catch (e) {
            return false;
        }
    }
    _showPhysicalBoardEditor() {
        const overlay = document.createElement('div');
        overlay.className = 'chess-editor-overlay';
        const self = this;
        let editingPieces = [];
        const buildEditor = ()=>{
            const board = document.createElement('div');
            board.className = 'chess-editor-board';
            for(let row = 7; row >= 0; row--)for(let col = 0; col < 8; col++){
                const cell = document.createElement('div');
                cell.className = 'chess-editor-cell';
                cell.style.backgroundColor = (row + col) % 2 === 0 ? '#f0d9b5' : '#b58863';
                const piece = editingPieces.find((p)=>p.row === row && p.col === col);
                if (piece) {
                    cell.textContent = SYMBOLS[piece.color][piece.type];
                    cell.classList.add('chess-editor-piece');
                }
                cell.addEventListener('click', ()=>_showPieceMenu(row, col, piece, cell));
                board.appendChild(cell);
            }
            return board;
        };
        const _showPieceMenu = (row, col, currentPiece, cell)=>{
            const menu = document.createElement('div');
            menu.className = 'chess-editor-menu';
            menu.innerHTML = `
        <div class="chess-editor-menu-title">\u{41A}\u{43B}\u{435}\u{442}\u{43A}\u{430} ${String.fromCharCode(65 + col)}${row + 1}</div>
        <button class="chess-editor-menu-btn" data-action="remove">\u{423}\u{431}\u{440}\u{430}\u{442}\u{44C} \u{444}\u{438}\u{433}\u{443}\u{440}\u{443}</button>
        <div style="margin: 8px 0; border-top: 1px solid #ddd;"></div>
        <div class="chess-editor-menu-pieces">
          ${[
                'white',
                'black'
            ].map((color)=>`
            <div class="chess-editor-color-group">
              <div class="chess-editor-color-label">${color === 'white' ? "\u0411\u0435\u043B\u044B\u0435" : "\u0427\u0451\u0440\u043D\u044B\u0435"}</div>
              ${[
                    'king',
                    'queen',
                    'rook',
                    'bishop',
                    'knight',
                    'pawn'
                ].map((type)=>`
                <button class="chess-editor-piece-btn" data-row="${row}" data-col="${col}" data-color="${color}" data-type="${type}">
                  ${SYMBOLS[color][type]}
                </button>
              `).join('')}
            </div>
          `).join('')}
        </div>
      `;
            menu.querySelector('[data-action="remove"]').addEventListener('click', ()=>{
                editingPieces = editingPieces.filter((p)=>!(p.row === row && p.col === col));
                boardContainer.innerHTML = '';
                boardContainer.appendChild(buildEditor());
                document.body.removeChild(menu);
            });
            menu.querySelectorAll('.chess-editor-piece-btn').forEach((btn)=>{
                btn.addEventListener('click', (e)=>{
                    const r = parseInt(e.target.dataset.row), c = parseInt(e.target.dataset.col);
                    editingPieces = editingPieces.filter((p)=>!(p.row === r && p.col === c));
                    editingPieces.push({
                        row: r,
                        col: c,
                        color: e.target.dataset.color,
                        type: e.target.dataset.type
                    });
                    boardContainer.innerHTML = '';
                    boardContainer.appendChild(buildEditor());
                    document.body.removeChild(menu);
                });
            });
            document.body.appendChild(menu);
        };
        const boardContainer = document.createElement('div');
        boardContainer.appendChild(buildEditor());
        overlay.innerHTML = `
      <div class="chess-editor-modal">
        <div class="chess-editor-modal-header">
          <h2>\u{420}\u{435}\u{434}\u{430}\u{43A}\u{442}\u{438}\u{440}\u{43E}\u{432}\u{430}\u{43D}\u{438}\u{435} \u{444}\u{438}\u{437}\u{438}\u{447}\u{435}\u{441}\u{43A}\u{43E}\u{439} \u{434}\u{43E}\u{441}\u{43A}\u{438}</h2>
          <button class="chess-editor-close" id="chess-editor-close">\u{2715}</button>
        </div>
        <div class="chess-editor-modal-body" id="chess-editor-body"></div>
        <div class="chess-editor-modal-footer">
          <button class="chess-editor-btn chess-editor-cancel" id="chess-editor-cancel">\u{41E}\u{442}\u{43C}\u{435}\u{43D}\u{430}</button>
          <button class="chess-editor-btn chess-editor-save" id="chess-editor-save">\u{421}\u{43E}\u{445}\u{440}\u{430}\u{43D}\u{438}\u{442}\u{44C}</button>
        </div>
      </div>
    `;
        overlay.querySelector('#chess-editor-body').appendChild(boardContainer);
        overlay.querySelector('#chess-editor-close').addEventListener('click', ()=>document.body.removeChild(overlay));
        overlay.querySelector('#chess-editor-cancel').addEventListener('click', ()=>document.body.removeChild(overlay));
        overlay.querySelector('#chess-editor-save').addEventListener('click', async ()=>{
            const saved = await self._savePhysicalBoard(editingPieces);
            if (saved) document.body.removeChild(overlay);
            else alert("\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F");
        });
        document.body.appendChild(overlay);
    }
    _pieceSvg(color, type) {
        const sym = SYMBOLS[color][type];
        const fill = color === 'white' ? 'white' : '%23222';
        const strk = color === 'white' ? '%23555' : 'white';
        return `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 44 44'><text x='22' y='36' font-size='32' text-anchor='middle' fill='${fill}' stroke='${strk}' stroke-width='1.2' paint-order='stroke' font-family='serif'>${sym}</text></svg>`;
    }
    _buildUI() {
        this.gameScreen.classList.add('chess-mode');
        const boardContainer = document.createElement('div');
        boardContainer.className = 'chess-board-wrapper';
        const deskWrapper = this.gameScreen.querySelector('.desk__wrapper');
        if (deskWrapper) boardContainer.appendChild(deskWrapper);
        const filesBar = document.createElement('div');
        filesBar.className = 'cp-files';
        FILES.forEach((f)=>{
            const s = document.createElement('span');
            s.textContent = f;
            filesBar.appendChild(s);
        });
        boardContainer.appendChild(filesBar);
        this.gameScreen.appendChild(boardContainer);
        const panel = document.createElement('div');
        this._panelEl = panel;
        panel.className = 'cp-panel';
        panel.innerHTML = `
      <div class="cp-player" id="cp-black">
        <span class="cp-piece">\u{265A}</span>
        <div class="cp-info">
          <div class="cp-name">\u{427}\u{451}\u{440}\u{43D}\u{44B}\u{435}</div>
          <div class="cp-cap" id="cp-black-cap"></div>
        </div>
        <div class="cp-indicator" id="cp-black-status"></div>
      </div>
      <div class="cp-history-wrap">
        <div class="cp-hist-header">\u{418}\u{441}\u{442}\u{43E}\u{440}\u{438}\u{44F} \u{445}\u{43E}\u{434}\u{43E}\u{432}</div>
        <div class="cp-history" id="cp-history"></div>
      </div>
      <div class="cp-player" id="cp-white">
        <span class="cp-piece">\u{2654}</span>
        <div class="cp-info">
          <div class="cp-name">\u{411}\u{435}\u{43B}\u{44B}\u{435}</div>
          <div class="cp-cap" id="cp-white-cap"></div>
        </div>
        <div class="cp-indicator" id="cp-white-status"></div>
      </div>
      <button class="cp-new-btn" id="cp-new-btn">\u{21BA} \u{41D}\u{43E}\u{432}\u{430}\u{44F} \u{43F}\u{430}\u{440}\u{442}\u{438}\u{44F}</button>
      <button class="cp-new-btn" id="cp-edit-board-btn" style="background: #5c5c7a;">\u{2699} \u{420}\u{435}\u{434}\u{430}\u{43A}\u{442}. \u{434}\u{43E}\u{441}\u{43A}\u{443}</button>
    `;
        this.gameScreen.appendChild(panel);
        document.getElementById('cp-new-btn').addEventListener('click', ()=>this._newGame());
        document.getElementById('cp-edit-board-btn').addEventListener('click', ()=>this._showPhysicalBoardEditor());
    }
    _injectCSS() {
        if (document.getElementById('chess-styles')) return;
        const s = document.createElement('style');
        s.id = 'chess-styles';
        s.textContent = `
      .chess-mode {
        flex-direction: row !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 40px !important;
        width: 100% !important;
        height: 100% !important;
      }
      .chess-board-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        /* \u{41C}\u{430}\u{43A}\u{441}\u{438}\u{43C}\u{430}\u{43B}\u{44C}\u{43D}\u{430}\u{44F} \u{448}\u{438}\u{440}\u{438}\u{43D}\u{430}: \u{432}\u{441}\u{435} \u{441}\u{432}\u{43E}\u{431}\u{43E}\u{434}\u{43D}\u{43E}\u{435} \u{43C}\u{435}\u{441}\u{442}\u{43E} (\u{43C}\u{438}\u{43D}\u{443}\u{441} \u{43F}\u{430}\u{43D}\u{435}\u{43B}\u{44C} 320px), \u{43D}\u{43E} \u{432}\u{44B}\u{441}\u{43E}\u{442}\u{430} \u{43D}\u{435} \u{431}\u{43E}\u{43B}\u{44C}\u{448}\u{435} 75vh */
        width: min(calc(100% - 320px), 75vh) !important;
        min-width: 280px;
      }

      /* \u{41C}\u{430}\u{442}\u{435}\u{43C}\u{430}\u{442}\u{438}\u{447}\u{435}\u{441}\u{43A}\u{438} \u{432}\u{44B}\u{432}\u{435}\u{440}\u{435}\u{43D}\u{43D}\u{430}\u{44F} \u{430}\u{434}\u{430}\u{43F}\u{442}\u{438}\u{432}\u{43D}\u{430}\u{44F} \u{434}\u{43E}\u{441}\u{43A}\u{430} */
      .chess-board-wrapper .desk__wrapper {
        width: 100% !important;
        height: auto !important;
        aspect-ratio: 1 / 1 !important;
        flex: 0 0 auto !important;
        container-type: inline-size;
      }

      .chess-mode .desk__cells {
        gap: 0 !important;
        padding: 6px !important;
        background: #3d2410 !important;
        border-radius: 6px !important;
        box-shadow: 0 0 0 2px #5c3a20, 0 10px 36px rgba(0,0,0,.45) !important;
      }
      .chess-mode .desk__cell {
        border-radius: 3px !important;
        cursor: pointer !important;
        transition: filter .1s !important;
      }
      .chess-mode .desk__cell:hover { filter: brightness(1.18) !important; }
      .chess-mode .desk__cell.image {
        background-size: 86% 86% !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
      }

      /* \u{2500}\u{2500} Move indicators \u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500}\u{2500} */
      .chess-dot::after {
        content: ''; position: absolute; width: 30%; height: 30%;
        background: rgba(0,0,0,.22); border-radius: 50%;
        top: 50%; left: 50%; transform: translate(-50%,-50%);
        z-index: 10; pointer-events: none;
      }
      .chess-ring::after {
        content: ''; position: absolute; inset: 3px;
        border: 4px solid rgba(0,0,0,.28); border-radius: 3px;
        z-index: 10; pointer-events: none;
      }
      .chess-check { background: radial-gradient(circle, #ff6b6b 0%, #c00 80%) !important; }

      .cp-files {
        display: flex; width: 100%;
        padding: 0 6px; box-sizing: border-box;
      }
      .cp-files span {
        flex: 1; text-align: center; font-size: 14px; font-weight: 700;
        color: #8b7355; letter-spacing: .05em; user-select: none;
      }

      .cp-panel {
        width: 260px; flex-shrink: 0;
        display: flex; flex-direction: column; gap: 14px;
        align-self: center;
      }

      .cp-player {
        background: #fff; border-radius: 12px; padding: 14px 18px;
        display: flex; align-items: center; gap: 12px;
        border: 2px solid transparent; box-shadow: 0 4px 12px rgba(0,0,0,.08);
        transition: border-color .2s, box-shadow .2s;
      }
      .cp-player.cp-active { border-color: #7bc67e; box-shadow: 0 2px 14px rgba(123,198,126,.35); }
      .cp-piece { font-size: 32px; line-height: 1; user-select: none; }
      .cp-info  { flex: 1; overflow: hidden; }
      .cp-name  { font-weight: 700; font-size: 15px; color: #2c2c2c; }
      .cp-cap   { font-size: 13px; color: #888; margin-top: 2px; min-height: 16px; }
      .cp-indicator { font-size: 13px; font-weight: 700; color: #7bc67e; white-space: nowrap; }

      .cp-history-wrap {
        flex: 1; background: #fff; border-radius: 12px; padding: 14px 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,.08); display: flex; flex-direction: column;
        min-height: 120px; overflow: hidden; max-height: 250px;
      }
      .cp-hist-header {
        font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em;
        color: #bbb; margin-bottom: 10px;
      }
      .cp-history {
        flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; scrollbar-width: thin;
      }
      .cp-hist-row { display: grid; grid-template-columns: 26px 1fr 1fr; gap: 6px; font-size: 14px; font-family: monospace; align-items: baseline; }
      .cp-hist-num { color: #ccc; }
      .cp-hist-row span { color: #555; }
      .cp-hist-row:last-child span { font-weight: 700; color: #222; }

      .cp-new-btn {
        background: #5c7a5c; color: #fff; border: none; border-radius: 10px; padding: 14px;
        font-size: 15px; font-weight: 700; cursor: pointer; transition: background .15s; width: 100%;
      }
      .cp-new-btn:hover { background: #4a6a4a; }

      /* Modals */
      .chess-modal-overlay {
        position: fixed; inset: 0; background: rgba(0,0,0,.6);
        display: flex; align-items: center; justify-content: center;
        z-index: 3000; backdrop-filter: blur(4px);
      }
      .chess-modal-box {
        background: #fff; border-radius: 20px; padding: 44px 52px;
        text-align: center; box-shadow: 0 24px 64px rgba(0,0,0,.35);
        animation: chess-pop .3s cubic-bezier(.34,1.56,.64,1);
      }
      @keyframes chess-pop { from { transform: scale(.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      .chess-modal-icon  { font-size: 60px; margin-bottom: 12px; }
      .chess-modal-title { font-size: 26px; font-weight: 800; color: #222; margin-bottom: 6px; }
      .chess-modal-sub   { font-size: 15px; color: #888; margin-bottom: 28px; }
      .chess-modal-btn {
        background: #5c7a5c; color: #fff; border: none;
        border-radius: 12px; padding: 13px 30px;
        font-size: 15px; font-weight: 700; cursor: pointer; transition: background .15s;
      }
      .chess-modal-btn:hover { background: #4a6a4a; }

      .chess-promo-btn {
        font-size: 40px; background: #f5f5f5;
        border: 2px solid #ddd; border-radius: 10px;
        padding: 10px 14px; cursor: pointer; transition: all .12s;
      }
      .chess-promo-btn:hover { background: #e8f5e9; border-color: #7bc67e; transform: scale(1.1); }

      /* Editor */
      .chess-editor-overlay {
        position: fixed; inset: 0; background: rgba(0,0,0,.6);
        display: flex; align-items: center; justify-content: center;
        z-index: 3000; backdrop-filter: blur(4px);
      }
      .chess-editor-modal {
        background: #fff; border-radius: 20px; width: 90%; max-width: 600px;
        display: flex; flex-direction: column; max-height: 90vh; overflow: hidden;
        box-shadow: 0 24px 64px rgba(0,0,0,.35);
      }
      .chess-editor-modal-header {
        padding: 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;
      }
      .chess-editor-modal-header h2 { margin: 0; font-size: 20px; }
      .chess-editor-close {
        background: none; border: none; font-size: 28px; cursor: pointer; color: #999; transition: color .2s;
      }
      .chess-editor-close:hover { color: #333; }
      .chess-editor-modal-body {
        padding: 20px; overflow-y: auto; flex: 1; display: flex; justify-content: center;
      }
      .chess-editor-board {
        display: grid; grid-template-columns: repeat(8, 1fr); gap: 0; background: #3d2410; padding: 6px; border-radius: 6px; box-shadow: 0 0 0 2px #5c3a20;
        container-type: inline-size;
      }
      .chess-editor-cell {
        aspect-ratio: 1; display: flex; align-items: center; justify-content: center; position: relative; border-radius: 3px; cursor: pointer; font-size: 10cqw; user-select: none; transition: filter .1s;
      }
      .chess-editor-cell:hover { filter: brightness(1.18); }
      .chess-editor-menu {
        position: fixed; background: #fff; border-radius: 12px; padding: 12px; box-shadow: 0 8px 24px rgba(0,0,0,.3); z-index: 3001; min-width: 250px; animation: chess-pop .2s cubic-bezier(.34,1.56,.64,1);
      }
      .chess-editor-menu-title { font-weight: 700; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #eee; font-size: 12px; }
      .chess-editor-menu-btn { display: block; width: 100%; background: #f5f5f5; border: 1px solid #ddd; border-radius: 6px; padding: 8px; cursor: pointer; font-size: 12px; margin-bottom: 8px; transition: background .15s; }
      .chess-editor-menu-btn:hover { background: #efefef; }
      .chess-editor-color-group { margin-bottom: 10px; }
      .chess-editor-color-label { font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 6px; }
      .chess-editor-piece-btn { background: #f5f5f5; border: 1px solid #ddd; border-radius: 6px; padding: 6px; cursor: pointer; font-size: 20px; margin-right: 4px; margin-bottom: 4px; transition: all .12s; display: inline-block; }
      .chess-editor-piece-btn:hover { background: #e8f5e9; border-color: #7bc67e; transform: scale(1.15); }
      .chess-editor-modal-footer { padding: 16px; border-top: 1px solid #eee; display: flex; gap: 12px; justify-content: flex-end; }
      .chess-editor-btn { border: none; border-radius: 8px; padding: 10px 20px; font-size: 14px; font-weight: 700; cursor: pointer; transition: background .15s; }
      .chess-editor-cancel { background: #f5f5f5; color: #333; }
      .chess-editor-cancel:hover { background: #efefef; }
      .chess-editor-save { background: #5c7a5c; color: #fff; }
      .chess-editor-save:hover { background: #4a6a4a; }
    `;
        document.head.appendChild(s);
    }
}
exports.default = Chess;

},{"../GameBase.js":"lzUhs","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}]},["aZpYj","50W2s"], "50W2s", "parcelRequirec09b", {})

//# sourceMappingURL=project_manipulator_frontend-main.f315a5d4.js.map
