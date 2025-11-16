var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
function _mergeNamespaces(n2, m2) {
  for (var i2 = 0; i2 < m2.length; i2++) {
    const e2 = m2[i2];
    if (typeof e2 !== "string" && !Array.isArray(e2)) {
      for (const k2 in e2) {
        if (k2 !== "default" && !(k2 in n2)) {
          const d2 = Object.getOwnPropertyDescriptor(e2, k2);
          if (d2) {
            Object.defineProperty(n2, k2, d2.get ? d2 : {
              enumerable: true,
              get: () => e2[k2]
            });
          }
        }
      }
    }
  }
  return Object.freeze(Object.defineProperty(n2, Symbol.toStringTag, { value: "Module" }));
}
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
var react = { exports: {} };
var react_production_min = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l$4 = Symbol.for("react.element"), n$4 = Symbol.for("react.portal"), p$3 = Symbol.for("react.fragment"), q$2 = Symbol.for("react.strict_mode"), r$2 = Symbol.for("react.profiler"), t$4 = Symbol.for("react.provider"), u$5 = Symbol.for("react.context"), v$3 = Symbol.for("react.forward_ref"), w$2 = Symbol.for("react.suspense"), x$1 = Symbol.for("react.memo"), y$3 = Symbol.for("react.lazy"), z$1 = Symbol.iterator;
function A$1(a2) {
  if (null === a2 || "object" !== typeof a2)
    return null;
  a2 = z$1 && a2[z$1] || a2["@@iterator"];
  return "function" === typeof a2 ? a2 : null;
}
var B$1 = { isMounted: function() {
  return false;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, C$3 = Object.assign, D$3 = {};
function E$1(a2, b2, e2) {
  this.props = a2;
  this.context = b2;
  this.refs = D$3;
  this.updater = e2 || B$1;
}
E$1.prototype.isReactComponent = {};
E$1.prototype.setState = function(a2, b2) {
  if ("object" !== typeof a2 && "function" !== typeof a2 && null != a2)
    throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, a2, b2, "setState");
};
E$1.prototype.forceUpdate = function(a2) {
  this.updater.enqueueForceUpdate(this, a2, "forceUpdate");
};
function F$3() {
}
F$3.prototype = E$1.prototype;
function G$1(a2, b2, e2) {
  this.props = a2;
  this.context = b2;
  this.refs = D$3;
  this.updater = e2 || B$1;
}
var H$2 = G$1.prototype = new F$3();
H$2.constructor = G$1;
C$3(H$2, E$1.prototype);
H$2.isPureReactComponent = true;
var I$4 = Array.isArray, J = Object.prototype.hasOwnProperty, K$1 = { current: null }, L$1 = { key: true, ref: true, __self: true, __source: true };
function M$4(a2, b2, e2) {
  var d2, c2 = {}, k2 = null, h2 = null;
  if (null != b2)
    for (d2 in void 0 !== b2.ref && (h2 = b2.ref), void 0 !== b2.key && (k2 = "" + b2.key), b2)
      J.call(b2, d2) && !L$1.hasOwnProperty(d2) && (c2[d2] = b2[d2]);
  var g2 = arguments.length - 2;
  if (1 === g2)
    c2.children = e2;
  else if (1 < g2) {
    for (var f2 = Array(g2), m2 = 0; m2 < g2; m2++)
      f2[m2] = arguments[m2 + 2];
    c2.children = f2;
  }
  if (a2 && a2.defaultProps)
    for (d2 in g2 = a2.defaultProps, g2)
      void 0 === c2[d2] && (c2[d2] = g2[d2]);
  return { $$typeof: l$4, type: a2, key: k2, ref: h2, props: c2, _owner: K$1.current };
}
function N$2(a2, b2) {
  return { $$typeof: l$4, type: a2.type, key: b2, ref: a2.ref, props: a2.props, _owner: a2._owner };
}
function O$3(a2) {
  return "object" === typeof a2 && null !== a2 && a2.$$typeof === l$4;
}
function escape$1(a2) {
  var b2 = { "=": "=0", ":": "=2" };
  return "$" + a2.replace(/[=:]/g, function(a3) {
    return b2[a3];
  });
}
var P$1 = /\/+/g;
function Q$1(a2, b2) {
  return "object" === typeof a2 && null !== a2 && null != a2.key ? escape$1("" + a2.key) : b2.toString(36);
}
function R$2(a2, b2, e2, d2, c2) {
  var k2 = typeof a2;
  if ("undefined" === k2 || "boolean" === k2)
    a2 = null;
  var h2 = false;
  if (null === a2)
    h2 = true;
  else
    switch (k2) {
      case "string":
      case "number":
        h2 = true;
        break;
      case "object":
        switch (a2.$$typeof) {
          case l$4:
          case n$4:
            h2 = true;
        }
    }
  if (h2)
    return h2 = a2, c2 = c2(h2), a2 = "" === d2 ? "." + Q$1(h2, 0) : d2, I$4(c2) ? (e2 = "", null != a2 && (e2 = a2.replace(P$1, "$&/") + "/"), R$2(c2, b2, e2, "", function(a3) {
      return a3;
    })) : null != c2 && (O$3(c2) && (c2 = N$2(c2, e2 + (!c2.key || h2 && h2.key === c2.key ? "" : ("" + c2.key).replace(P$1, "$&/") + "/") + a2)), b2.push(c2)), 1;
  h2 = 0;
  d2 = "" === d2 ? "." : d2 + ":";
  if (I$4(a2))
    for (var g2 = 0; g2 < a2.length; g2++) {
      k2 = a2[g2];
      var f2 = d2 + Q$1(k2, g2);
      h2 += R$2(k2, b2, e2, f2, c2);
    }
  else if (f2 = A$1(a2), "function" === typeof f2)
    for (a2 = f2.call(a2), g2 = 0; !(k2 = a2.next()).done; )
      k2 = k2.value, f2 = d2 + Q$1(k2, g2++), h2 += R$2(k2, b2, e2, f2, c2);
  else if ("object" === k2)
    throw b2 = String(a2), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b2 ? "object with keys {" + Object.keys(a2).join(", ") + "}" : b2) + "). If you meant to render a collection of children, use an array instead.");
  return h2;
}
function S$3(a2, b2, e2) {
  if (null == a2)
    return a2;
  var d2 = [], c2 = 0;
  R$2(a2, d2, "", "", function(a3) {
    return b2.call(e2, a3, c2++);
  });
  return d2;
}
function T$3(a2) {
  if (-1 === a2._status) {
    var b2 = a2._result;
    b2 = b2();
    b2.then(function(b3) {
      if (0 === a2._status || -1 === a2._status)
        a2._status = 1, a2._result = b3;
    }, function(b3) {
      if (0 === a2._status || -1 === a2._status)
        a2._status = 2, a2._result = b3;
    });
    -1 === a2._status && (a2._status = 0, a2._result = b2);
  }
  if (1 === a2._status)
    return a2._result.default;
  throw a2._result;
}
var U$4 = { current: null }, V$1 = { transition: null }, W$1 = { ReactCurrentDispatcher: U$4, ReactCurrentBatchConfig: V$1, ReactCurrentOwner: K$1 };
function X$1() {
  throw Error("act(...) is not supported in production builds of React.");
}
react_production_min.Children = { map: S$3, forEach: function(a2, b2, e2) {
  S$3(a2, function() {
    b2.apply(this, arguments);
  }, e2);
}, count: function(a2) {
  var b2 = 0;
  S$3(a2, function() {
    b2++;
  });
  return b2;
}, toArray: function(a2) {
  return S$3(a2, function(a3) {
    return a3;
  }) || [];
}, only: function(a2) {
  if (!O$3(a2))
    throw Error("React.Children.only expected to receive a single React element child.");
  return a2;
} };
react_production_min.Component = E$1;
react_production_min.Fragment = p$3;
react_production_min.Profiler = r$2;
react_production_min.PureComponent = G$1;
react_production_min.StrictMode = q$2;
react_production_min.Suspense = w$2;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$1;
react_production_min.act = X$1;
react_production_min.cloneElement = function(a2, b2, e2) {
  if (null === a2 || void 0 === a2)
    throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a2 + ".");
  var d2 = C$3({}, a2.props), c2 = a2.key, k2 = a2.ref, h2 = a2._owner;
  if (null != b2) {
    void 0 !== b2.ref && (k2 = b2.ref, h2 = K$1.current);
    void 0 !== b2.key && (c2 = "" + b2.key);
    if (a2.type && a2.type.defaultProps)
      var g2 = a2.type.defaultProps;
    for (f2 in b2)
      J.call(b2, f2) && !L$1.hasOwnProperty(f2) && (d2[f2] = void 0 === b2[f2] && void 0 !== g2 ? g2[f2] : b2[f2]);
  }
  var f2 = arguments.length - 2;
  if (1 === f2)
    d2.children = e2;
  else if (1 < f2) {
    g2 = Array(f2);
    for (var m2 = 0; m2 < f2; m2++)
      g2[m2] = arguments[m2 + 2];
    d2.children = g2;
  }
  return { $$typeof: l$4, type: a2.type, key: c2, ref: k2, props: d2, _owner: h2 };
};
react_production_min.createContext = function(a2) {
  a2 = { $$typeof: u$5, _currentValue: a2, _currentValue2: a2, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
  a2.Provider = { $$typeof: t$4, _context: a2 };
  return a2.Consumer = a2;
};
react_production_min.createElement = M$4;
react_production_min.createFactory = function(a2) {
  var b2 = M$4.bind(null, a2);
  b2.type = a2;
  return b2;
};
react_production_min.createRef = function() {
  return { current: null };
};
react_production_min.forwardRef = function(a2) {
  return { $$typeof: v$3, render: a2 };
};
react_production_min.isValidElement = O$3;
react_production_min.lazy = function(a2) {
  return { $$typeof: y$3, _payload: { _status: -1, _result: a2 }, _init: T$3 };
};
react_production_min.memo = function(a2, b2) {
  return { $$typeof: x$1, type: a2, compare: void 0 === b2 ? null : b2 };
};
react_production_min.startTransition = function(a2) {
  var b2 = V$1.transition;
  V$1.transition = {};
  try {
    a2();
  } finally {
    V$1.transition = b2;
  }
};
react_production_min.unstable_act = X$1;
react_production_min.useCallback = function(a2, b2) {
  return U$4.current.useCallback(a2, b2);
};
react_production_min.useContext = function(a2) {
  return U$4.current.useContext(a2);
};
react_production_min.useDebugValue = function() {
};
react_production_min.useDeferredValue = function(a2) {
  return U$4.current.useDeferredValue(a2);
};
react_production_min.useEffect = function(a2, b2) {
  return U$4.current.useEffect(a2, b2);
};
react_production_min.useId = function() {
  return U$4.current.useId();
};
react_production_min.useImperativeHandle = function(a2, b2, e2) {
  return U$4.current.useImperativeHandle(a2, b2, e2);
};
react_production_min.useInsertionEffect = function(a2, b2) {
  return U$4.current.useInsertionEffect(a2, b2);
};
react_production_min.useLayoutEffect = function(a2, b2) {
  return U$4.current.useLayoutEffect(a2, b2);
};
react_production_min.useMemo = function(a2, b2) {
  return U$4.current.useMemo(a2, b2);
};
react_production_min.useReducer = function(a2, b2, e2) {
  return U$4.current.useReducer(a2, b2, e2);
};
react_production_min.useRef = function(a2) {
  return U$4.current.useRef(a2);
};
react_production_min.useState = function(a2) {
  return U$4.current.useState(a2);
};
react_production_min.useSyncExternalStore = function(a2, b2, e2) {
  return U$4.current.useSyncExternalStore(a2, b2, e2);
};
react_production_min.useTransition = function() {
  return U$4.current.useTransition();
};
react_production_min.version = "18.3.1";
{
  react.exports = react_production_min;
}
var reactExports = react.exports;
const React = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
const e = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: React
}, [reactExports]);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f$3 = reactExports, k$1 = Symbol.for("react.element"), l$3 = Symbol.for("react.fragment"), m$2 = Object.prototype.hasOwnProperty, n$3 = f$3.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$2 = { key: true, ref: true, __self: true, __source: true };
function q$1(c2, a2, g2) {
  var b2, d2 = {}, e2 = null, h2 = null;
  void 0 !== g2 && (e2 = "" + g2);
  void 0 !== a2.key && (e2 = "" + a2.key);
  void 0 !== a2.ref && (h2 = a2.ref);
  for (b2 in a2)
    m$2.call(a2, b2) && !p$2.hasOwnProperty(b2) && (d2[b2] = a2[b2]);
  if (c2 && c2.defaultProps)
    for (b2 in a2 = c2.defaultProps, a2)
      void 0 === d2[b2] && (d2[b2] = a2[b2]);
  return { $$typeof: k$1, type: c2, key: e2, ref: h2, props: d2, _owner: n$3.current };
}
reactJsxRuntime_production_min.Fragment = l$3;
reactJsxRuntime_production_min.jsx = q$1;
reactJsxRuntime_production_min.jsxs = q$1;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
var jsxRuntimeExports = jsxRuntime.exports;
if (typeof window !== "undefined") {
  if (typeof globalThis.Request === "undefined") {
    if (typeof fetch !== "undefined") {
      globalThis.Request = class Request {
        constructor(input, init) {
          __publicField(this, "url");
          __publicField(this, "method");
          __publicField(this, "headers");
          __publicField(this, "body");
          __publicField(this, "mode");
          __publicField(this, "credentials");
          __publicField(this, "cache");
          __publicField(this, "redirect");
          __publicField(this, "referrer");
          __publicField(this, "integrity");
          if (typeof input === "string") {
            this.url = input;
          } else if (input instanceof URL) {
            this.url = input.href;
          } else {
            this.url = input.url;
          }
          this.method = ((init == null ? void 0 : init.method) || "GET").toUpperCase();
          this.headers = new Headers(init == null ? void 0 : init.headers);
          this.body = init == null ? void 0 : init.body;
          this.mode = (init == null ? void 0 : init.mode) || "cors";
          this.credentials = (init == null ? void 0 : init.credentials) || "same-origin";
          this.cache = (init == null ? void 0 : init.cache) || "default";
          this.redirect = (init == null ? void 0 : init.redirect) || "follow";
          this.referrer = (init == null ? void 0 : init.referrer) || "about:client";
          this.integrity = (init == null ? void 0 : init.integrity) || "";
        }
        clone() {
          return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        }
      };
      window.Request = globalThis.Request;
    } else {
      console.warn("Request and fetch are not available. Some features may not work.");
      globalThis.Request = class Request {
        constructor() {
          throw new Error("Request is not supported in this environment");
        }
      };
      window.Request = globalThis.Request;
    }
  }
  if (typeof globalThis.Response === "undefined" && typeof fetch !== "undefined") {
    globalThis.Response = class Response {
      constructor(body, init) {
        this.body = body;
        this.init = init;
      }
    };
    window.Response = globalThis.Response;
  }
}
var client = {};
var reactDom = { exports: {} };
var reactDom_production_min = {};
var scheduler = { exports: {} };
var scheduler_production_min = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(exports) {
  function f2(a2, b2) {
    var c2 = a2.length;
    a2.push(b2);
    a:
      for (; 0 < c2; ) {
        var d2 = c2 - 1 >>> 1, e2 = a2[d2];
        if (0 < g2(e2, b2))
          a2[d2] = b2, a2[c2] = e2, c2 = d2;
        else
          break a;
      }
  }
  function h2(a2) {
    return 0 === a2.length ? null : a2[0];
  }
  function k2(a2) {
    if (0 === a2.length)
      return null;
    var b2 = a2[0], c2 = a2.pop();
    if (c2 !== b2) {
      a2[0] = c2;
      a:
        for (var d2 = 0, e2 = a2.length, w2 = e2 >>> 1; d2 < w2; ) {
          var m2 = 2 * (d2 + 1) - 1, C2 = a2[m2], n2 = m2 + 1, x2 = a2[n2];
          if (0 > g2(C2, c2))
            n2 < e2 && 0 > g2(x2, C2) ? (a2[d2] = x2, a2[n2] = c2, d2 = n2) : (a2[d2] = C2, a2[m2] = c2, d2 = m2);
          else if (n2 < e2 && 0 > g2(x2, c2))
            a2[d2] = x2, a2[n2] = c2, d2 = n2;
          else
            break a;
        }
    }
    return b2;
  }
  function g2(a2, b2) {
    var c2 = a2.sortIndex - b2.sortIndex;
    return 0 !== c2 ? c2 : a2.id - b2.id;
  }
  if ("object" === typeof performance && "function" === typeof performance.now) {
    var l2 = performance;
    exports.unstable_now = function() {
      return l2.now();
    };
  } else {
    var p2 = Date, q2 = p2.now();
    exports.unstable_now = function() {
      return p2.now() - q2;
    };
  }
  var r2 = [], t2 = [], u2 = 1, v2 = null, y2 = 3, z2 = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E2 = "function" === typeof clearTimeout ? clearTimeout : null, F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
  "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function G2(a2) {
    for (var b2 = h2(t2); null !== b2; ) {
      if (null === b2.callback)
        k2(t2);
      else if (b2.startTime <= a2)
        k2(t2), b2.sortIndex = b2.expirationTime, f2(r2, b2);
      else
        break;
      b2 = h2(t2);
    }
  }
  function H2(a2) {
    B2 = false;
    G2(a2);
    if (!A2)
      if (null !== h2(r2))
        A2 = true, I2(J2);
      else {
        var b2 = h2(t2);
        null !== b2 && K2(H2, b2.startTime - a2);
      }
  }
  function J2(a2, b2) {
    A2 = false;
    B2 && (B2 = false, E2(L2), L2 = -1);
    z2 = true;
    var c2 = y2;
    try {
      G2(b2);
      for (v2 = h2(r2); null !== v2 && (!(v2.expirationTime > b2) || a2 && !M2()); ) {
        var d2 = v2.callback;
        if ("function" === typeof d2) {
          v2.callback = null;
          y2 = v2.priorityLevel;
          var e2 = d2(v2.expirationTime <= b2);
          b2 = exports.unstable_now();
          "function" === typeof e2 ? v2.callback = e2 : v2 === h2(r2) && k2(r2);
          G2(b2);
        } else
          k2(r2);
        v2 = h2(r2);
      }
      if (null !== v2)
        var w2 = true;
      else {
        var m2 = h2(t2);
        null !== m2 && K2(H2, m2.startTime - b2);
        w2 = false;
      }
      return w2;
    } finally {
      v2 = null, y2 = c2, z2 = false;
    }
  }
  var N2 = false, O2 = null, L2 = -1, P2 = 5, Q2 = -1;
  function M2() {
    return exports.unstable_now() - Q2 < P2 ? false : true;
  }
  function R2() {
    if (null !== O2) {
      var a2 = exports.unstable_now();
      Q2 = a2;
      var b2 = true;
      try {
        b2 = O2(true, a2);
      } finally {
        b2 ? S2() : (N2 = false, O2 = null);
      }
    } else
      N2 = false;
  }
  var S2;
  if ("function" === typeof F2)
    S2 = function() {
      F2(R2);
    };
  else if ("undefined" !== typeof MessageChannel) {
    var T2 = new MessageChannel(), U2 = T2.port2;
    T2.port1.onmessage = R2;
    S2 = function() {
      U2.postMessage(null);
    };
  } else
    S2 = function() {
      D2(R2, 0);
    };
  function I2(a2) {
    O2 = a2;
    N2 || (N2 = true, S2());
  }
  function K2(a2, b2) {
    L2 = D2(function() {
      a2(exports.unstable_now());
    }, b2);
  }
  exports.unstable_IdlePriority = 5;
  exports.unstable_ImmediatePriority = 1;
  exports.unstable_LowPriority = 4;
  exports.unstable_NormalPriority = 3;
  exports.unstable_Profiling = null;
  exports.unstable_UserBlockingPriority = 2;
  exports.unstable_cancelCallback = function(a2) {
    a2.callback = null;
  };
  exports.unstable_continueExecution = function() {
    A2 || z2 || (A2 = true, I2(J2));
  };
  exports.unstable_forceFrameRate = function(a2) {
    0 > a2 || 125 < a2 ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a2 ? Math.floor(1e3 / a2) : 5;
  };
  exports.unstable_getCurrentPriorityLevel = function() {
    return y2;
  };
  exports.unstable_getFirstCallbackNode = function() {
    return h2(r2);
  };
  exports.unstable_next = function(a2) {
    switch (y2) {
      case 1:
      case 2:
      case 3:
        var b2 = 3;
        break;
      default:
        b2 = y2;
    }
    var c2 = y2;
    y2 = b2;
    try {
      return a2();
    } finally {
      y2 = c2;
    }
  };
  exports.unstable_pauseExecution = function() {
  };
  exports.unstable_requestPaint = function() {
  };
  exports.unstable_runWithPriority = function(a2, b2) {
    switch (a2) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        a2 = 3;
    }
    var c2 = y2;
    y2 = a2;
    try {
      return b2();
    } finally {
      y2 = c2;
    }
  };
  exports.unstable_scheduleCallback = function(a2, b2, c2) {
    var d2 = exports.unstable_now();
    "object" === typeof c2 && null !== c2 ? (c2 = c2.delay, c2 = "number" === typeof c2 && 0 < c2 ? d2 + c2 : d2) : c2 = d2;
    switch (a2) {
      case 1:
        var e2 = -1;
        break;
      case 2:
        e2 = 250;
        break;
      case 5:
        e2 = 1073741823;
        break;
      case 4:
        e2 = 1e4;
        break;
      default:
        e2 = 5e3;
    }
    e2 = c2 + e2;
    a2 = { id: u2++, callback: b2, priorityLevel: a2, startTime: c2, expirationTime: e2, sortIndex: -1 };
    c2 > d2 ? (a2.sortIndex = c2, f2(t2, a2), null === h2(r2) && a2 === h2(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c2 - d2))) : (a2.sortIndex = e2, f2(r2, a2), A2 || z2 || (A2 = true, I2(J2)));
    return a2;
  };
  exports.unstable_shouldYield = M2;
  exports.unstable_wrapCallback = function(a2) {
    var b2 = y2;
    return function() {
      var c2 = y2;
      y2 = b2;
      try {
        return a2.apply(this, arguments);
      } finally {
        y2 = c2;
      }
    };
  };
})(scheduler_production_min);
{
  scheduler.exports = scheduler_production_min;
}
var schedulerExports = scheduler.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aa = reactExports, ca = schedulerExports;
function p$1(a2) {
  for (var b2 = "https://reactjs.org/docs/error-decoder.html?invariant=" + a2, c2 = 1; c2 < arguments.length; c2++)
    b2 += "&args[]=" + encodeURIComponent(arguments[c2]);
  return "Minified React error #" + a2 + "; visit " + b2 + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var da = /* @__PURE__ */ new Set(), ea = {};
function fa(a2, b2) {
  ha(a2, b2);
  ha(a2 + "Capture", b2);
}
function ha(a2, b2) {
  ea[a2] = b2;
  for (a2 = 0; a2 < b2.length; a2++)
    da.add(b2[a2]);
}
var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
function oa(a2) {
  if (ja.call(ma, a2))
    return true;
  if (ja.call(la, a2))
    return false;
  if (ka.test(a2))
    return ma[a2] = true;
  la[a2] = true;
  return false;
}
function pa(a2, b2, c2, d2) {
  if (null !== c2 && 0 === c2.type)
    return false;
  switch (typeof b2) {
    case "function":
    case "symbol":
      return true;
    case "boolean":
      if (d2)
        return false;
      if (null !== c2)
        return !c2.acceptsBooleans;
      a2 = a2.toLowerCase().slice(0, 5);
      return "data-" !== a2 && "aria-" !== a2;
    default:
      return false;
  }
}
function qa(a2, b2, c2, d2) {
  if (null === b2 || "undefined" === typeof b2 || pa(a2, b2, c2, d2))
    return true;
  if (d2)
    return false;
  if (null !== c2)
    switch (c2.type) {
      case 3:
        return !b2;
      case 4:
        return false === b2;
      case 5:
        return isNaN(b2);
      case 6:
        return isNaN(b2) || 1 > b2;
    }
  return false;
}
function v$2(a2, b2, c2, d2, e2, f2, g2) {
  this.acceptsBooleans = 2 === b2 || 3 === b2 || 4 === b2;
  this.attributeName = d2;
  this.attributeNamespace = e2;
  this.mustUseProperty = c2;
  this.propertyName = a2;
  this.type = b2;
  this.sanitizeURL = f2;
  this.removeEmptyString = g2;
}
var z = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a2) {
  z[a2] = new v$2(a2, 0, false, a2, null, false, false);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a2) {
  var b2 = a2[0];
  z[b2] = new v$2(b2, 1, false, a2[1], null, false, false);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a2) {
  z[a2] = new v$2(a2, 2, false, a2.toLowerCase(), null, false, false);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a2) {
  z[a2] = new v$2(a2, 2, false, a2, null, false, false);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a2) {
  z[a2] = new v$2(a2, 3, false, a2.toLowerCase(), null, false, false);
});
["checked", "multiple", "muted", "selected"].forEach(function(a2) {
  z[a2] = new v$2(a2, 3, true, a2, null, false, false);
});
["capture", "download"].forEach(function(a2) {
  z[a2] = new v$2(a2, 4, false, a2, null, false, false);
});
["cols", "rows", "size", "span"].forEach(function(a2) {
  z[a2] = new v$2(a2, 6, false, a2, null, false, false);
});
["rowSpan", "start"].forEach(function(a2) {
  z[a2] = new v$2(a2, 5, false, a2.toLowerCase(), null, false, false);
});
var ra = /[\-:]([a-z])/g;
function sa(a2) {
  return a2[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a2) {
  var b2 = a2.replace(
    ra,
    sa
  );
  z[b2] = new v$2(b2, 1, false, a2, null, false, false);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a2) {
  var b2 = a2.replace(ra, sa);
  z[b2] = new v$2(b2, 1, false, a2, "http://www.w3.org/1999/xlink", false, false);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(a2) {
  var b2 = a2.replace(ra, sa);
  z[b2] = new v$2(b2, 1, false, a2, "http://www.w3.org/XML/1998/namespace", false, false);
});
["tabIndex", "crossOrigin"].forEach(function(a2) {
  z[a2] = new v$2(a2, 1, false, a2.toLowerCase(), null, false, false);
});
z.xlinkHref = new v$2("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
["src", "href", "action", "formAction"].forEach(function(a2) {
  z[a2] = new v$2(a2, 1, false, a2.toLowerCase(), null, true, true);
});
function ta(a2, b2, c2, d2) {
  var e2 = z.hasOwnProperty(b2) ? z[b2] : null;
  if (null !== e2 ? 0 !== e2.type : d2 || !(2 < b2.length) || "o" !== b2[0] && "O" !== b2[0] || "n" !== b2[1] && "N" !== b2[1])
    qa(b2, c2, e2, d2) && (c2 = null), d2 || null === e2 ? oa(b2) && (null === c2 ? a2.removeAttribute(b2) : a2.setAttribute(b2, "" + c2)) : e2.mustUseProperty ? a2[e2.propertyName] = null === c2 ? 3 === e2.type ? false : "" : c2 : (b2 = e2.attributeName, d2 = e2.attributeNamespace, null === c2 ? a2.removeAttribute(b2) : (e2 = e2.type, c2 = 3 === e2 || 4 === e2 && true === c2 ? "" : "" + c2, d2 ? a2.setAttributeNS(d2, b2, c2) : a2.setAttribute(b2, c2)));
}
var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
var Ia = Symbol.for("react.offscreen");
var Ja = Symbol.iterator;
function Ka(a2) {
  if (null === a2 || "object" !== typeof a2)
    return null;
  a2 = Ja && a2[Ja] || a2["@@iterator"];
  return "function" === typeof a2 ? a2 : null;
}
var A = Object.assign, La;
function Ma(a2) {
  if (void 0 === La)
    try {
      throw Error();
    } catch (c2) {
      var b2 = c2.stack.trim().match(/\n( *(at )?)/);
      La = b2 && b2[1] || "";
    }
  return "\n" + La + a2;
}
var Na = false;
function Oa(a2, b2) {
  if (!a2 || Na)
    return "";
  Na = true;
  var c2 = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (b2)
      if (b2 = function() {
        throw Error();
      }, Object.defineProperty(b2.prototype, "props", { set: function() {
        throw Error();
      } }), "object" === typeof Reflect && Reflect.construct) {
        try {
          Reflect.construct(b2, []);
        } catch (l2) {
          var d2 = l2;
        }
        Reflect.construct(a2, [], b2);
      } else {
        try {
          b2.call();
        } catch (l2) {
          d2 = l2;
        }
        a2.call(b2.prototype);
      }
    else {
      try {
        throw Error();
      } catch (l2) {
        d2 = l2;
      }
      a2();
    }
  } catch (l2) {
    if (l2 && d2 && "string" === typeof l2.stack) {
      for (var e2 = l2.stack.split("\n"), f2 = d2.stack.split("\n"), g2 = e2.length - 1, h2 = f2.length - 1; 1 <= g2 && 0 <= h2 && e2[g2] !== f2[h2]; )
        h2--;
      for (; 1 <= g2 && 0 <= h2; g2--, h2--)
        if (e2[g2] !== f2[h2]) {
          if (1 !== g2 || 1 !== h2) {
            do
              if (g2--, h2--, 0 > h2 || e2[g2] !== f2[h2]) {
                var k2 = "\n" + e2[g2].replace(" at new ", " at ");
                a2.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a2.displayName));
                return k2;
              }
            while (1 <= g2 && 0 <= h2);
          }
          break;
        }
    }
  } finally {
    Na = false, Error.prepareStackTrace = c2;
  }
  return (a2 = a2 ? a2.displayName || a2.name : "") ? Ma(a2) : "";
}
function Pa(a2) {
  switch (a2.tag) {
    case 5:
      return Ma(a2.type);
    case 16:
      return Ma("Lazy");
    case 13:
      return Ma("Suspense");
    case 19:
      return Ma("SuspenseList");
    case 0:
    case 2:
    case 15:
      return a2 = Oa(a2.type, false), a2;
    case 11:
      return a2 = Oa(a2.type.render, false), a2;
    case 1:
      return a2 = Oa(a2.type, true), a2;
    default:
      return "";
  }
}
function Qa(a2) {
  if (null == a2)
    return null;
  if ("function" === typeof a2)
    return a2.displayName || a2.name || null;
  if ("string" === typeof a2)
    return a2;
  switch (a2) {
    case ya:
      return "Fragment";
    case wa:
      return "Portal";
    case Aa:
      return "Profiler";
    case za:
      return "StrictMode";
    case Ea:
      return "Suspense";
    case Fa:
      return "SuspenseList";
  }
  if ("object" === typeof a2)
    switch (a2.$$typeof) {
      case Ca:
        return (a2.displayName || "Context") + ".Consumer";
      case Ba:
        return (a2._context.displayName || "Context") + ".Provider";
      case Da:
        var b2 = a2.render;
        a2 = a2.displayName;
        a2 || (a2 = b2.displayName || b2.name || "", a2 = "" !== a2 ? "ForwardRef(" + a2 + ")" : "ForwardRef");
        return a2;
      case Ga:
        return b2 = a2.displayName || null, null !== b2 ? b2 : Qa(a2.type) || "Memo";
      case Ha:
        b2 = a2._payload;
        a2 = a2._init;
        try {
          return Qa(a2(b2));
        } catch (c2) {
        }
    }
  return null;
}
function Ra(a2) {
  var b2 = a2.type;
  switch (a2.tag) {
    case 24:
      return "Cache";
    case 9:
      return (b2.displayName || "Context") + ".Consumer";
    case 10:
      return (b2._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return a2 = b2.render, a2 = a2.displayName || a2.name || "", b2.displayName || ("" !== a2 ? "ForwardRef(" + a2 + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return b2;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Qa(b2);
    case 8:
      return b2 === za ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if ("function" === typeof b2)
        return b2.displayName || b2.name || null;
      if ("string" === typeof b2)
        return b2;
  }
  return null;
}
function Sa(a2) {
  switch (typeof a2) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return a2;
    case "object":
      return a2;
    default:
      return "";
  }
}
function Ta(a2) {
  var b2 = a2.type;
  return (a2 = a2.nodeName) && "input" === a2.toLowerCase() && ("checkbox" === b2 || "radio" === b2);
}
function Ua(a2) {
  var b2 = Ta(a2) ? "checked" : "value", c2 = Object.getOwnPropertyDescriptor(a2.constructor.prototype, b2), d2 = "" + a2[b2];
  if (!a2.hasOwnProperty(b2) && "undefined" !== typeof c2 && "function" === typeof c2.get && "function" === typeof c2.set) {
    var e2 = c2.get, f2 = c2.set;
    Object.defineProperty(a2, b2, { configurable: true, get: function() {
      return e2.call(this);
    }, set: function(a3) {
      d2 = "" + a3;
      f2.call(this, a3);
    } });
    Object.defineProperty(a2, b2, { enumerable: c2.enumerable });
    return { getValue: function() {
      return d2;
    }, setValue: function(a3) {
      d2 = "" + a3;
    }, stopTracking: function() {
      a2._valueTracker = null;
      delete a2[b2];
    } };
  }
}
function Va(a2) {
  a2._valueTracker || (a2._valueTracker = Ua(a2));
}
function Wa(a2) {
  if (!a2)
    return false;
  var b2 = a2._valueTracker;
  if (!b2)
    return true;
  var c2 = b2.getValue();
  var d2 = "";
  a2 && (d2 = Ta(a2) ? a2.checked ? "true" : "false" : a2.value);
  a2 = d2;
  return a2 !== c2 ? (b2.setValue(a2), true) : false;
}
function Xa(a2) {
  a2 = a2 || ("undefined" !== typeof document ? document : void 0);
  if ("undefined" === typeof a2)
    return null;
  try {
    return a2.activeElement || a2.body;
  } catch (b2) {
    return a2.body;
  }
}
function Ya(a2, b2) {
  var c2 = b2.checked;
  return A({}, b2, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c2 ? c2 : a2._wrapperState.initialChecked });
}
function Za(a2, b2) {
  var c2 = null == b2.defaultValue ? "" : b2.defaultValue, d2 = null != b2.checked ? b2.checked : b2.defaultChecked;
  c2 = Sa(null != b2.value ? b2.value : c2);
  a2._wrapperState = { initialChecked: d2, initialValue: c2, controlled: "checkbox" === b2.type || "radio" === b2.type ? null != b2.checked : null != b2.value };
}
function ab(a2, b2) {
  b2 = b2.checked;
  null != b2 && ta(a2, "checked", b2, false);
}
function bb(a2, b2) {
  ab(a2, b2);
  var c2 = Sa(b2.value), d2 = b2.type;
  if (null != c2)
    if ("number" === d2) {
      if (0 === c2 && "" === a2.value || a2.value != c2)
        a2.value = "" + c2;
    } else
      a2.value !== "" + c2 && (a2.value = "" + c2);
  else if ("submit" === d2 || "reset" === d2) {
    a2.removeAttribute("value");
    return;
  }
  b2.hasOwnProperty("value") ? cb(a2, b2.type, c2) : b2.hasOwnProperty("defaultValue") && cb(a2, b2.type, Sa(b2.defaultValue));
  null == b2.checked && null != b2.defaultChecked && (a2.defaultChecked = !!b2.defaultChecked);
}
function db(a2, b2, c2) {
  if (b2.hasOwnProperty("value") || b2.hasOwnProperty("defaultValue")) {
    var d2 = b2.type;
    if (!("submit" !== d2 && "reset" !== d2 || void 0 !== b2.value && null !== b2.value))
      return;
    b2 = "" + a2._wrapperState.initialValue;
    c2 || b2 === a2.value || (a2.value = b2);
    a2.defaultValue = b2;
  }
  c2 = a2.name;
  "" !== c2 && (a2.name = "");
  a2.defaultChecked = !!a2._wrapperState.initialChecked;
  "" !== c2 && (a2.name = c2);
}
function cb(a2, b2, c2) {
  if ("number" !== b2 || Xa(a2.ownerDocument) !== a2)
    null == c2 ? a2.defaultValue = "" + a2._wrapperState.initialValue : a2.defaultValue !== "" + c2 && (a2.defaultValue = "" + c2);
}
var eb = Array.isArray;
function fb(a2, b2, c2, d2) {
  a2 = a2.options;
  if (b2) {
    b2 = {};
    for (var e2 = 0; e2 < c2.length; e2++)
      b2["$" + c2[e2]] = true;
    for (c2 = 0; c2 < a2.length; c2++)
      e2 = b2.hasOwnProperty("$" + a2[c2].value), a2[c2].selected !== e2 && (a2[c2].selected = e2), e2 && d2 && (a2[c2].defaultSelected = true);
  } else {
    c2 = "" + Sa(c2);
    b2 = null;
    for (e2 = 0; e2 < a2.length; e2++) {
      if (a2[e2].value === c2) {
        a2[e2].selected = true;
        d2 && (a2[e2].defaultSelected = true);
        return;
      }
      null !== b2 || a2[e2].disabled || (b2 = a2[e2]);
    }
    null !== b2 && (b2.selected = true);
  }
}
function gb(a2, b2) {
  if (null != b2.dangerouslySetInnerHTML)
    throw Error(p$1(91));
  return A({}, b2, { value: void 0, defaultValue: void 0, children: "" + a2._wrapperState.initialValue });
}
function hb(a2, b2) {
  var c2 = b2.value;
  if (null == c2) {
    c2 = b2.children;
    b2 = b2.defaultValue;
    if (null != c2) {
      if (null != b2)
        throw Error(p$1(92));
      if (eb(c2)) {
        if (1 < c2.length)
          throw Error(p$1(93));
        c2 = c2[0];
      }
      b2 = c2;
    }
    null == b2 && (b2 = "");
    c2 = b2;
  }
  a2._wrapperState = { initialValue: Sa(c2) };
}
function ib(a2, b2) {
  var c2 = Sa(b2.value), d2 = Sa(b2.defaultValue);
  null != c2 && (c2 = "" + c2, c2 !== a2.value && (a2.value = c2), null == b2.defaultValue && a2.defaultValue !== c2 && (a2.defaultValue = c2));
  null != d2 && (a2.defaultValue = "" + d2);
}
function jb(a2) {
  var b2 = a2.textContent;
  b2 === a2._wrapperState.initialValue && "" !== b2 && null !== b2 && (a2.value = b2);
}
function kb(a2) {
  switch (a2) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function lb(a2, b2) {
  return null == a2 || "http://www.w3.org/1999/xhtml" === a2 ? kb(b2) : "http://www.w3.org/2000/svg" === a2 && "foreignObject" === b2 ? "http://www.w3.org/1999/xhtml" : a2;
}
var mb, nb = function(a2) {
  return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b2, c2, d2, e2) {
    MSApp.execUnsafeLocalFunction(function() {
      return a2(b2, c2, d2, e2);
    });
  } : a2;
}(function(a2, b2) {
  if ("http://www.w3.org/2000/svg" !== a2.namespaceURI || "innerHTML" in a2)
    a2.innerHTML = b2;
  else {
    mb = mb || document.createElement("div");
    mb.innerHTML = "<svg>" + b2.valueOf().toString() + "</svg>";
    for (b2 = mb.firstChild; a2.firstChild; )
      a2.removeChild(a2.firstChild);
    for (; b2.firstChild; )
      a2.appendChild(b2.firstChild);
  }
});
function ob(a2, b2) {
  if (b2) {
    var c2 = a2.firstChild;
    if (c2 && c2 === a2.lastChild && 3 === c2.nodeType) {
      c2.nodeValue = b2;
      return;
    }
  }
  a2.textContent = b2;
}
var pb = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
}, qb = ["Webkit", "ms", "Moz", "O"];
Object.keys(pb).forEach(function(a2) {
  qb.forEach(function(b2) {
    b2 = b2 + a2.charAt(0).toUpperCase() + a2.substring(1);
    pb[b2] = pb[a2];
  });
});
function rb(a2, b2, c2) {
  return null == b2 || "boolean" === typeof b2 || "" === b2 ? "" : c2 || "number" !== typeof b2 || 0 === b2 || pb.hasOwnProperty(a2) && pb[a2] ? ("" + b2).trim() : b2 + "px";
}
function sb(a2, b2) {
  a2 = a2.style;
  for (var c2 in b2)
    if (b2.hasOwnProperty(c2)) {
      var d2 = 0 === c2.indexOf("--"), e2 = rb(c2, b2[c2], d2);
      "float" === c2 && (c2 = "cssFloat");
      d2 ? a2.setProperty(c2, e2) : a2[c2] = e2;
    }
}
var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
function ub(a2, b2) {
  if (b2) {
    if (tb[a2] && (null != b2.children || null != b2.dangerouslySetInnerHTML))
      throw Error(p$1(137, a2));
    if (null != b2.dangerouslySetInnerHTML) {
      if (null != b2.children)
        throw Error(p$1(60));
      if ("object" !== typeof b2.dangerouslySetInnerHTML || !("__html" in b2.dangerouslySetInnerHTML))
        throw Error(p$1(61));
    }
    if (null != b2.style && "object" !== typeof b2.style)
      throw Error(p$1(62));
  }
}
function vb(a2, b2) {
  if (-1 === a2.indexOf("-"))
    return "string" === typeof b2.is;
  switch (a2) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;
    default:
      return true;
  }
}
var wb = null;
function xb(a2) {
  a2 = a2.target || a2.srcElement || window;
  a2.correspondingUseElement && (a2 = a2.correspondingUseElement);
  return 3 === a2.nodeType ? a2.parentNode : a2;
}
var yb = null, zb = null, Ab = null;
function Bb(a2) {
  if (a2 = Cb(a2)) {
    if ("function" !== typeof yb)
      throw Error(p$1(280));
    var b2 = a2.stateNode;
    b2 && (b2 = Db(b2), yb(a2.stateNode, a2.type, b2));
  }
}
function Eb(a2) {
  zb ? Ab ? Ab.push(a2) : Ab = [a2] : zb = a2;
}
function Fb() {
  if (zb) {
    var a2 = zb, b2 = Ab;
    Ab = zb = null;
    Bb(a2);
    if (b2)
      for (a2 = 0; a2 < b2.length; a2++)
        Bb(b2[a2]);
  }
}
function Gb(a2, b2) {
  return a2(b2);
}
function Hb() {
}
var Ib = false;
function Jb(a2, b2, c2) {
  if (Ib)
    return a2(b2, c2);
  Ib = true;
  try {
    return Gb(a2, b2, c2);
  } finally {
    if (Ib = false, null !== zb || null !== Ab)
      Hb(), Fb();
  }
}
function Kb(a2, b2) {
  var c2 = a2.stateNode;
  if (null === c2)
    return null;
  var d2 = Db(c2);
  if (null === d2)
    return null;
  c2 = d2[b2];
  a:
    switch (b2) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (d2 = !d2.disabled) || (a2 = a2.type, d2 = !("button" === a2 || "input" === a2 || "select" === a2 || "textarea" === a2));
        a2 = !d2;
        break a;
      default:
        a2 = false;
    }
  if (a2)
    return null;
  if (c2 && "function" !== typeof c2)
    throw Error(p$1(231, b2, typeof c2));
  return c2;
}
var Lb = false;
if (ia)
  try {
    var Mb = {};
    Object.defineProperty(Mb, "passive", { get: function() {
      Lb = true;
    } });
    window.addEventListener("test", Mb, Mb);
    window.removeEventListener("test", Mb, Mb);
  } catch (a2) {
    Lb = false;
  }
function Nb(a2, b2, c2, d2, e2, f2, g2, h2, k2) {
  var l2 = Array.prototype.slice.call(arguments, 3);
  try {
    b2.apply(c2, l2);
  } catch (m2) {
    this.onError(m2);
  }
}
var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a2) {
  Ob = true;
  Pb = a2;
} };
function Tb(a2, b2, c2, d2, e2, f2, g2, h2, k2) {
  Ob = false;
  Pb = null;
  Nb.apply(Sb, arguments);
}
function Ub(a2, b2, c2, d2, e2, f2, g2, h2, k2) {
  Tb.apply(this, arguments);
  if (Ob) {
    if (Ob) {
      var l2 = Pb;
      Ob = false;
      Pb = null;
    } else
      throw Error(p$1(198));
    Qb || (Qb = true, Rb = l2);
  }
}
function Vb(a2) {
  var b2 = a2, c2 = a2;
  if (a2.alternate)
    for (; b2.return; )
      b2 = b2.return;
  else {
    a2 = b2;
    do
      b2 = a2, 0 !== (b2.flags & 4098) && (c2 = b2.return), a2 = b2.return;
    while (a2);
  }
  return 3 === b2.tag ? c2 : null;
}
function Wb(a2) {
  if (13 === a2.tag) {
    var b2 = a2.memoizedState;
    null === b2 && (a2 = a2.alternate, null !== a2 && (b2 = a2.memoizedState));
    if (null !== b2)
      return b2.dehydrated;
  }
  return null;
}
function Xb(a2) {
  if (Vb(a2) !== a2)
    throw Error(p$1(188));
}
function Yb(a2) {
  var b2 = a2.alternate;
  if (!b2) {
    b2 = Vb(a2);
    if (null === b2)
      throw Error(p$1(188));
    return b2 !== a2 ? null : a2;
  }
  for (var c2 = a2, d2 = b2; ; ) {
    var e2 = c2.return;
    if (null === e2)
      break;
    var f2 = e2.alternate;
    if (null === f2) {
      d2 = e2.return;
      if (null !== d2) {
        c2 = d2;
        continue;
      }
      break;
    }
    if (e2.child === f2.child) {
      for (f2 = e2.child; f2; ) {
        if (f2 === c2)
          return Xb(e2), a2;
        if (f2 === d2)
          return Xb(e2), b2;
        f2 = f2.sibling;
      }
      throw Error(p$1(188));
    }
    if (c2.return !== d2.return)
      c2 = e2, d2 = f2;
    else {
      for (var g2 = false, h2 = e2.child; h2; ) {
        if (h2 === c2) {
          g2 = true;
          c2 = e2;
          d2 = f2;
          break;
        }
        if (h2 === d2) {
          g2 = true;
          d2 = e2;
          c2 = f2;
          break;
        }
        h2 = h2.sibling;
      }
      if (!g2) {
        for (h2 = f2.child; h2; ) {
          if (h2 === c2) {
            g2 = true;
            c2 = f2;
            d2 = e2;
            break;
          }
          if (h2 === d2) {
            g2 = true;
            d2 = f2;
            c2 = e2;
            break;
          }
          h2 = h2.sibling;
        }
        if (!g2)
          throw Error(p$1(189));
      }
    }
    if (c2.alternate !== d2)
      throw Error(p$1(190));
  }
  if (3 !== c2.tag)
    throw Error(p$1(188));
  return c2.stateNode.current === c2 ? a2 : b2;
}
function Zb(a2) {
  a2 = Yb(a2);
  return null !== a2 ? $b(a2) : null;
}
function $b(a2) {
  if (5 === a2.tag || 6 === a2.tag)
    return a2;
  for (a2 = a2.child; null !== a2; ) {
    var b2 = $b(a2);
    if (null !== b2)
      return b2;
    a2 = a2.sibling;
  }
  return null;
}
var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
function mc(a2) {
  if (lc && "function" === typeof lc.onCommitFiberRoot)
    try {
      lc.onCommitFiberRoot(kc, a2, void 0, 128 === (a2.current.flags & 128));
    } catch (b2) {
    }
}
var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
function nc(a2) {
  a2 >>>= 0;
  return 0 === a2 ? 32 : 31 - (pc(a2) / qc | 0) | 0;
}
var rc = 64, sc = 4194304;
function tc(a2) {
  switch (a2 & -a2) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return a2 & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return a2 & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return a2;
  }
}
function uc(a2, b2) {
  var c2 = a2.pendingLanes;
  if (0 === c2)
    return 0;
  var d2 = 0, e2 = a2.suspendedLanes, f2 = a2.pingedLanes, g2 = c2 & 268435455;
  if (0 !== g2) {
    var h2 = g2 & ~e2;
    0 !== h2 ? d2 = tc(h2) : (f2 &= g2, 0 !== f2 && (d2 = tc(f2)));
  } else
    g2 = c2 & ~e2, 0 !== g2 ? d2 = tc(g2) : 0 !== f2 && (d2 = tc(f2));
  if (0 === d2)
    return 0;
  if (0 !== b2 && b2 !== d2 && 0 === (b2 & e2) && (e2 = d2 & -d2, f2 = b2 & -b2, e2 >= f2 || 16 === e2 && 0 !== (f2 & 4194240)))
    return b2;
  0 !== (d2 & 4) && (d2 |= c2 & 16);
  b2 = a2.entangledLanes;
  if (0 !== b2)
    for (a2 = a2.entanglements, b2 &= d2; 0 < b2; )
      c2 = 31 - oc(b2), e2 = 1 << c2, d2 |= a2[c2], b2 &= ~e2;
  return d2;
}
function vc(a2, b2) {
  switch (a2) {
    case 1:
    case 2:
    case 4:
      return b2 + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return b2 + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function wc(a2, b2) {
  for (var c2 = a2.suspendedLanes, d2 = a2.pingedLanes, e2 = a2.expirationTimes, f2 = a2.pendingLanes; 0 < f2; ) {
    var g2 = 31 - oc(f2), h2 = 1 << g2, k2 = e2[g2];
    if (-1 === k2) {
      if (0 === (h2 & c2) || 0 !== (h2 & d2))
        e2[g2] = vc(h2, b2);
    } else
      k2 <= b2 && (a2.expiredLanes |= h2);
    f2 &= ~h2;
  }
}
function xc(a2) {
  a2 = a2.pendingLanes & -1073741825;
  return 0 !== a2 ? a2 : a2 & 1073741824 ? 1073741824 : 0;
}
function yc() {
  var a2 = rc;
  rc <<= 1;
  0 === (rc & 4194240) && (rc = 64);
  return a2;
}
function zc(a2) {
  for (var b2 = [], c2 = 0; 31 > c2; c2++)
    b2.push(a2);
  return b2;
}
function Ac(a2, b2, c2) {
  a2.pendingLanes |= b2;
  536870912 !== b2 && (a2.suspendedLanes = 0, a2.pingedLanes = 0);
  a2 = a2.eventTimes;
  b2 = 31 - oc(b2);
  a2[b2] = c2;
}
function Bc(a2, b2) {
  var c2 = a2.pendingLanes & ~b2;
  a2.pendingLanes = b2;
  a2.suspendedLanes = 0;
  a2.pingedLanes = 0;
  a2.expiredLanes &= b2;
  a2.mutableReadLanes &= b2;
  a2.entangledLanes &= b2;
  b2 = a2.entanglements;
  var d2 = a2.eventTimes;
  for (a2 = a2.expirationTimes; 0 < c2; ) {
    var e2 = 31 - oc(c2), f2 = 1 << e2;
    b2[e2] = 0;
    d2[e2] = -1;
    a2[e2] = -1;
    c2 &= ~f2;
  }
}
function Cc(a2, b2) {
  var c2 = a2.entangledLanes |= b2;
  for (a2 = a2.entanglements; c2; ) {
    var d2 = 31 - oc(c2), e2 = 1 << d2;
    e2 & b2 | a2[d2] & b2 && (a2[d2] |= b2);
    c2 &= ~e2;
  }
}
var C$2 = 0;
function Dc(a2) {
  a2 &= -a2;
  return 1 < a2 ? 4 < a2 ? 0 !== (a2 & 268435455) ? 16 : 536870912 : 4 : 1;
}
var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a2, b2) {
  switch (a2) {
    case "focusin":
    case "focusout":
      Lc = null;
      break;
    case "dragenter":
    case "dragleave":
      Mc = null;
      break;
    case "mouseover":
    case "mouseout":
      Nc = null;
      break;
    case "pointerover":
    case "pointerout":
      Oc.delete(b2.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Pc.delete(b2.pointerId);
  }
}
function Tc(a2, b2, c2, d2, e2, f2) {
  if (null === a2 || a2.nativeEvent !== f2)
    return a2 = { blockedOn: b2, domEventName: c2, eventSystemFlags: d2, nativeEvent: f2, targetContainers: [e2] }, null !== b2 && (b2 = Cb(b2), null !== b2 && Fc(b2)), a2;
  a2.eventSystemFlags |= d2;
  b2 = a2.targetContainers;
  null !== e2 && -1 === b2.indexOf(e2) && b2.push(e2);
  return a2;
}
function Uc(a2, b2, c2, d2, e2) {
  switch (b2) {
    case "focusin":
      return Lc = Tc(Lc, a2, b2, c2, d2, e2), true;
    case "dragenter":
      return Mc = Tc(Mc, a2, b2, c2, d2, e2), true;
    case "mouseover":
      return Nc = Tc(Nc, a2, b2, c2, d2, e2), true;
    case "pointerover":
      var f2 = e2.pointerId;
      Oc.set(f2, Tc(Oc.get(f2) || null, a2, b2, c2, d2, e2));
      return true;
    case "gotpointercapture":
      return f2 = e2.pointerId, Pc.set(f2, Tc(Pc.get(f2) || null, a2, b2, c2, d2, e2)), true;
  }
  return false;
}
function Vc(a2) {
  var b2 = Wc(a2.target);
  if (null !== b2) {
    var c2 = Vb(b2);
    if (null !== c2) {
      if (b2 = c2.tag, 13 === b2) {
        if (b2 = Wb(c2), null !== b2) {
          a2.blockedOn = b2;
          Ic(a2.priority, function() {
            Gc(c2);
          });
          return;
        }
      } else if (3 === b2 && c2.stateNode.current.memoizedState.isDehydrated) {
        a2.blockedOn = 3 === c2.tag ? c2.stateNode.containerInfo : null;
        return;
      }
    }
  }
  a2.blockedOn = null;
}
function Xc(a2) {
  if (null !== a2.blockedOn)
    return false;
  for (var b2 = a2.targetContainers; 0 < b2.length; ) {
    var c2 = Yc(a2.domEventName, a2.eventSystemFlags, b2[0], a2.nativeEvent);
    if (null === c2) {
      c2 = a2.nativeEvent;
      var d2 = new c2.constructor(c2.type, c2);
      wb = d2;
      c2.target.dispatchEvent(d2);
      wb = null;
    } else
      return b2 = Cb(c2), null !== b2 && Fc(b2), a2.blockedOn = c2, false;
    b2.shift();
  }
  return true;
}
function Zc(a2, b2, c2) {
  Xc(a2) && c2.delete(b2);
}
function $c() {
  Jc = false;
  null !== Lc && Xc(Lc) && (Lc = null);
  null !== Mc && Xc(Mc) && (Mc = null);
  null !== Nc && Xc(Nc) && (Nc = null);
  Oc.forEach(Zc);
  Pc.forEach(Zc);
}
function ad(a2, b2) {
  a2.blockedOn === b2 && (a2.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
}
function bd(a2) {
  function b2(b3) {
    return ad(b3, a2);
  }
  if (0 < Kc.length) {
    ad(Kc[0], a2);
    for (var c2 = 1; c2 < Kc.length; c2++) {
      var d2 = Kc[c2];
      d2.blockedOn === a2 && (d2.blockedOn = null);
    }
  }
  null !== Lc && ad(Lc, a2);
  null !== Mc && ad(Mc, a2);
  null !== Nc && ad(Nc, a2);
  Oc.forEach(b2);
  Pc.forEach(b2);
  for (c2 = 0; c2 < Qc.length; c2++)
    d2 = Qc[c2], d2.blockedOn === a2 && (d2.blockedOn = null);
  for (; 0 < Qc.length && (c2 = Qc[0], null === c2.blockedOn); )
    Vc(c2), null === c2.blockedOn && Qc.shift();
}
var cd = ua.ReactCurrentBatchConfig, dd = true;
function ed(a2, b2, c2, d2) {
  var e2 = C$2, f2 = cd.transition;
  cd.transition = null;
  try {
    C$2 = 1, fd(a2, b2, c2, d2);
  } finally {
    C$2 = e2, cd.transition = f2;
  }
}
function gd(a2, b2, c2, d2) {
  var e2 = C$2, f2 = cd.transition;
  cd.transition = null;
  try {
    C$2 = 4, fd(a2, b2, c2, d2);
  } finally {
    C$2 = e2, cd.transition = f2;
  }
}
function fd(a2, b2, c2, d2) {
  if (dd) {
    var e2 = Yc(a2, b2, c2, d2);
    if (null === e2)
      hd(a2, b2, d2, id, c2), Sc(a2, d2);
    else if (Uc(e2, a2, b2, c2, d2))
      d2.stopPropagation();
    else if (Sc(a2, d2), b2 & 4 && -1 < Rc.indexOf(a2)) {
      for (; null !== e2; ) {
        var f2 = Cb(e2);
        null !== f2 && Ec(f2);
        f2 = Yc(a2, b2, c2, d2);
        null === f2 && hd(a2, b2, d2, id, c2);
        if (f2 === e2)
          break;
        e2 = f2;
      }
      null !== e2 && d2.stopPropagation();
    } else
      hd(a2, b2, d2, null, c2);
  }
}
var id = null;
function Yc(a2, b2, c2, d2) {
  id = null;
  a2 = xb(d2);
  a2 = Wc(a2);
  if (null !== a2)
    if (b2 = Vb(a2), null === b2)
      a2 = null;
    else if (c2 = b2.tag, 13 === c2) {
      a2 = Wb(b2);
      if (null !== a2)
        return a2;
      a2 = null;
    } else if (3 === c2) {
      if (b2.stateNode.current.memoizedState.isDehydrated)
        return 3 === b2.tag ? b2.stateNode.containerInfo : null;
      a2 = null;
    } else
      b2 !== a2 && (a2 = null);
  id = a2;
  return null;
}
function jd(a2) {
  switch (a2) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (ec()) {
        case fc:
          return 1;
        case gc:
          return 4;
        case hc:
        case ic:
          return 16;
        case jc:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var kd = null, ld = null, md = null;
function nd() {
  if (md)
    return md;
  var a2, b2 = ld, c2 = b2.length, d2, e2 = "value" in kd ? kd.value : kd.textContent, f2 = e2.length;
  for (a2 = 0; a2 < c2 && b2[a2] === e2[a2]; a2++)
    ;
  var g2 = c2 - a2;
  for (d2 = 1; d2 <= g2 && b2[c2 - d2] === e2[f2 - d2]; d2++)
    ;
  return md = e2.slice(a2, 1 < d2 ? 1 - d2 : void 0);
}
function od(a2) {
  var b2 = a2.keyCode;
  "charCode" in a2 ? (a2 = a2.charCode, 0 === a2 && 13 === b2 && (a2 = 13)) : a2 = b2;
  10 === a2 && (a2 = 13);
  return 32 <= a2 || 13 === a2 ? a2 : 0;
}
function pd() {
  return true;
}
function qd() {
  return false;
}
function rd(a2) {
  function b2(b3, d2, e2, f2, g2) {
    this._reactName = b3;
    this._targetInst = e2;
    this.type = d2;
    this.nativeEvent = f2;
    this.target = g2;
    this.currentTarget = null;
    for (var c2 in a2)
      a2.hasOwnProperty(c2) && (b3 = a2[c2], this[c2] = b3 ? b3(f2) : f2[c2]);
    this.isDefaultPrevented = (null != f2.defaultPrevented ? f2.defaultPrevented : false === f2.returnValue) ? pd : qd;
    this.isPropagationStopped = qd;
    return this;
  }
  A(b2.prototype, { preventDefault: function() {
    this.defaultPrevented = true;
    var a3 = this.nativeEvent;
    a3 && (a3.preventDefault ? a3.preventDefault() : "unknown" !== typeof a3.returnValue && (a3.returnValue = false), this.isDefaultPrevented = pd);
  }, stopPropagation: function() {
    var a3 = this.nativeEvent;
    a3 && (a3.stopPropagation ? a3.stopPropagation() : "unknown" !== typeof a3.cancelBubble && (a3.cancelBubble = true), this.isPropagationStopped = pd);
  }, persist: function() {
  }, isPersistent: pd });
  return b2;
}
var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a2) {
  return a2.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a2) {
  return void 0 === a2.relatedTarget ? a2.fromElement === a2.srcElement ? a2.toElement : a2.fromElement : a2.relatedTarget;
}, movementX: function(a2) {
  if ("movementX" in a2)
    return a2.movementX;
  a2 !== yd && (yd && "mousemove" === a2.type ? (wd = a2.screenX - yd.screenX, xd = a2.screenY - yd.screenY) : xd = wd = 0, yd = a2);
  return wd;
}, movementY: function(a2) {
  return "movementY" in a2 ? a2.movementY : xd;
} }), Bd = rd(Ad), Cd = A({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A({}, sd, { clipboardData: function(a2) {
  return "clipboardData" in a2 ? a2.clipboardData : window.clipboardData;
} }), Jd = rd(Id), Kd = A({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, Nd = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Pd(a2) {
  var b2 = this.nativeEvent;
  return b2.getModifierState ? b2.getModifierState(a2) : (a2 = Od[a2]) ? !!b2[a2] : false;
}
function zd() {
  return Pd;
}
var Qd = A({}, ud, { key: function(a2) {
  if (a2.key) {
    var b2 = Md[a2.key] || a2.key;
    if ("Unidentified" !== b2)
      return b2;
  }
  return "keypress" === a2.type ? (a2 = od(a2), 13 === a2 ? "Enter" : String.fromCharCode(a2)) : "keydown" === a2.type || "keyup" === a2.type ? Nd[a2.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a2) {
  return "keypress" === a2.type ? od(a2) : 0;
}, keyCode: function(a2) {
  return "keydown" === a2.type || "keyup" === a2.type ? a2.keyCode : 0;
}, which: function(a2) {
  return "keypress" === a2.type ? od(a2) : "keydown" === a2.type || "keyup" === a2.type ? a2.keyCode : 0;
} }), Rd = rd(Qd), Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A({}, Ad, {
  deltaX: function(a2) {
    return "deltaX" in a2 ? a2.deltaX : "wheelDeltaX" in a2 ? -a2.wheelDeltaX : 0;
  },
  deltaY: function(a2) {
    return "deltaY" in a2 ? a2.deltaY : "wheelDeltaY" in a2 ? -a2.wheelDeltaY : "wheelDelta" in a2 ? -a2.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Zd = rd(Yd), $d = [9, 13, 27, 32], ae$1 = ia && "CompositionEvent" in window, be$1 = null;
ia && "documentMode" in document && (be$1 = document.documentMode);
var ce = ia && "TextEvent" in window && !be$1, de$1 = ia && (!ae$1 || be$1 && 8 < be$1 && 11 >= be$1), ee = String.fromCharCode(32), fe$1 = false;
function ge$1(a2, b2) {
  switch (a2) {
    case "keyup":
      return -1 !== $d.indexOf(b2.keyCode);
    case "keydown":
      return 229 !== b2.keyCode;
    case "keypress":
    case "mousedown":
    case "focusout":
      return true;
    default:
      return false;
  }
}
function he$1(a2) {
  a2 = a2.detail;
  return "object" === typeof a2 && "data" in a2 ? a2.data : null;
}
var ie = false;
function je(a2, b2) {
  switch (a2) {
    case "compositionend":
      return he$1(b2);
    case "keypress":
      if (32 !== b2.which)
        return null;
      fe$1 = true;
      return ee;
    case "textInput":
      return a2 = b2.data, a2 === ee && fe$1 ? null : a2;
    default:
      return null;
  }
}
function ke(a2, b2) {
  if (ie)
    return "compositionend" === a2 || !ae$1 && ge$1(a2, b2) ? (a2 = nd(), md = ld = kd = null, ie = false, a2) : null;
  switch (a2) {
    case "paste":
      return null;
    case "keypress":
      if (!(b2.ctrlKey || b2.altKey || b2.metaKey) || b2.ctrlKey && b2.altKey) {
        if (b2.char && 1 < b2.char.length)
          return b2.char;
        if (b2.which)
          return String.fromCharCode(b2.which);
      }
      return null;
    case "compositionend":
      return de$1 && "ko" !== b2.locale ? null : b2.data;
    default:
      return null;
  }
}
var le$1 = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
function me$1(a2) {
  var b2 = a2 && a2.nodeName && a2.nodeName.toLowerCase();
  return "input" === b2 ? !!le$1[a2.type] : "textarea" === b2 ? true : false;
}
function ne(a2, b2, c2, d2) {
  Eb(d2);
  b2 = oe(b2, "onChange");
  0 < b2.length && (c2 = new td("onChange", "change", null, c2, d2), a2.push({ event: c2, listeners: b2 }));
}
var pe = null, qe$2 = null;
function re(a2) {
  se$1(a2, 0);
}
function te(a2) {
  var b2 = ue$1(a2);
  if (Wa(b2))
    return a2;
}
function ve$1(a2, b2) {
  if ("change" === a2)
    return b2;
}
var we = false;
if (ia) {
  var xe$2;
  if (ia) {
    var ye$2 = "oninput" in document;
    if (!ye$2) {
      var ze = document.createElement("div");
      ze.setAttribute("oninput", "return;");
      ye$2 = "function" === typeof ze.oninput;
    }
    xe$2 = ye$2;
  } else
    xe$2 = false;
  we = xe$2 && (!document.documentMode || 9 < document.documentMode);
}
function Ae$1() {
  pe && (pe.detachEvent("onpropertychange", Be), qe$2 = pe = null);
}
function Be(a2) {
  if ("value" === a2.propertyName && te(qe$2)) {
    var b2 = [];
    ne(b2, qe$2, a2, xb(a2));
    Jb(re, b2);
  }
}
function Ce(a2, b2, c2) {
  "focusin" === a2 ? (Ae$1(), pe = b2, qe$2 = c2, pe.attachEvent("onpropertychange", Be)) : "focusout" === a2 && Ae$1();
}
function De$2(a2) {
  if ("selectionchange" === a2 || "keyup" === a2 || "keydown" === a2)
    return te(qe$2);
}
function Ee$1(a2, b2) {
  if ("click" === a2)
    return te(b2);
}
function Fe$1(a2, b2) {
  if ("input" === a2 || "change" === a2)
    return te(b2);
}
function Ge(a2, b2) {
  return a2 === b2 && (0 !== a2 || 1 / a2 === 1 / b2) || a2 !== a2 && b2 !== b2;
}
var He$1 = "function" === typeof Object.is ? Object.is : Ge;
function Ie$1(a2, b2) {
  if (He$1(a2, b2))
    return true;
  if ("object" !== typeof a2 || null === a2 || "object" !== typeof b2 || null === b2)
    return false;
  var c2 = Object.keys(a2), d2 = Object.keys(b2);
  if (c2.length !== d2.length)
    return false;
  for (d2 = 0; d2 < c2.length; d2++) {
    var e2 = c2[d2];
    if (!ja.call(b2, e2) || !He$1(a2[e2], b2[e2]))
      return false;
  }
  return true;
}
function Je(a2) {
  for (; a2 && a2.firstChild; )
    a2 = a2.firstChild;
  return a2;
}
function Ke(a2, b2) {
  var c2 = Je(a2);
  a2 = 0;
  for (var d2; c2; ) {
    if (3 === c2.nodeType) {
      d2 = a2 + c2.textContent.length;
      if (a2 <= b2 && d2 >= b2)
        return { node: c2, offset: b2 - a2 };
      a2 = d2;
    }
    a: {
      for (; c2; ) {
        if (c2.nextSibling) {
          c2 = c2.nextSibling;
          break a;
        }
        c2 = c2.parentNode;
      }
      c2 = void 0;
    }
    c2 = Je(c2);
  }
}
function Le$1(a2, b2) {
  return a2 && b2 ? a2 === b2 ? true : a2 && 3 === a2.nodeType ? false : b2 && 3 === b2.nodeType ? Le$1(a2, b2.parentNode) : "contains" in a2 ? a2.contains(b2) : a2.compareDocumentPosition ? !!(a2.compareDocumentPosition(b2) & 16) : false : false;
}
function Me$1() {
  for (var a2 = window, b2 = Xa(); b2 instanceof a2.HTMLIFrameElement; ) {
    try {
      var c2 = "string" === typeof b2.contentWindow.location.href;
    } catch (d2) {
      c2 = false;
    }
    if (c2)
      a2 = b2.contentWindow;
    else
      break;
    b2 = Xa(a2.document);
  }
  return b2;
}
function Ne$1(a2) {
  var b2 = a2 && a2.nodeName && a2.nodeName.toLowerCase();
  return b2 && ("input" === b2 && ("text" === a2.type || "search" === a2.type || "tel" === a2.type || "url" === a2.type || "password" === a2.type) || "textarea" === b2 || "true" === a2.contentEditable);
}
function Oe(a2) {
  var b2 = Me$1(), c2 = a2.focusedElem, d2 = a2.selectionRange;
  if (b2 !== c2 && c2 && c2.ownerDocument && Le$1(c2.ownerDocument.documentElement, c2)) {
    if (null !== d2 && Ne$1(c2)) {
      if (b2 = d2.start, a2 = d2.end, void 0 === a2 && (a2 = b2), "selectionStart" in c2)
        c2.selectionStart = b2, c2.selectionEnd = Math.min(a2, c2.value.length);
      else if (a2 = (b2 = c2.ownerDocument || document) && b2.defaultView || window, a2.getSelection) {
        a2 = a2.getSelection();
        var e2 = c2.textContent.length, f2 = Math.min(d2.start, e2);
        d2 = void 0 === d2.end ? f2 : Math.min(d2.end, e2);
        !a2.extend && f2 > d2 && (e2 = d2, d2 = f2, f2 = e2);
        e2 = Ke(c2, f2);
        var g2 = Ke(
          c2,
          d2
        );
        e2 && g2 && (1 !== a2.rangeCount || a2.anchorNode !== e2.node || a2.anchorOffset !== e2.offset || a2.focusNode !== g2.node || a2.focusOffset !== g2.offset) && (b2 = b2.createRange(), b2.setStart(e2.node, e2.offset), a2.removeAllRanges(), f2 > d2 ? (a2.addRange(b2), a2.extend(g2.node, g2.offset)) : (b2.setEnd(g2.node, g2.offset), a2.addRange(b2)));
      }
    }
    b2 = [];
    for (a2 = c2; a2 = a2.parentNode; )
      1 === a2.nodeType && b2.push({ element: a2, left: a2.scrollLeft, top: a2.scrollTop });
    "function" === typeof c2.focus && c2.focus();
    for (c2 = 0; c2 < b2.length; c2++)
      a2 = b2[c2], a2.element.scrollLeft = a2.left, a2.element.scrollTop = a2.top;
  }
}
var Pe$2 = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re$2 = null, Se$2 = null, Te$1 = false;
function Ue(a2, b2, c2) {
  var d2 = c2.window === c2 ? c2.document : 9 === c2.nodeType ? c2 : c2.ownerDocument;
  Te$1 || null == Qe || Qe !== Xa(d2) || (d2 = Qe, "selectionStart" in d2 && Ne$1(d2) ? d2 = { start: d2.selectionStart, end: d2.selectionEnd } : (d2 = (d2.ownerDocument && d2.ownerDocument.defaultView || window).getSelection(), d2 = { anchorNode: d2.anchorNode, anchorOffset: d2.anchorOffset, focusNode: d2.focusNode, focusOffset: d2.focusOffset }), Se$2 && Ie$1(Se$2, d2) || (Se$2 = d2, d2 = oe(Re$2, "onSelect"), 0 < d2.length && (b2 = new td("onSelect", "select", null, b2, c2), a2.push({ event: b2, listeners: d2 }), b2.target = Qe)));
}
function Ve(a2, b2) {
  var c2 = {};
  c2[a2.toLowerCase()] = b2.toLowerCase();
  c2["Webkit" + a2] = "webkit" + b2;
  c2["Moz" + a2] = "moz" + b2;
  return c2;
}
var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") }, Xe = {}, Ye = {};
ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
function Ze(a2) {
  if (Xe[a2])
    return Xe[a2];
  if (!We[a2])
    return a2;
  var b2 = We[a2], c2;
  for (c2 in b2)
    if (b2.hasOwnProperty(c2) && c2 in Ye)
      return Xe[a2] = b2[c2];
  return a2;
}
var $e = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a2, b2) {
  df.set(a2, b2);
  fa(b2, [a2]);
}
for (var gf = 0; gf < ef.length; gf++) {
  var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
  ff(jf, "on" + kf);
}
ff($e, "onAnimationEnd");
ff(af, "onAnimationIteration");
ff(bf, "onAnimationStart");
ff("dblclick", "onDoubleClick");
ff("focusin", "onFocus");
ff("focusout", "onBlur");
ff(cf, "onTransitionEnd");
ha("onMouseEnter", ["mouseout", "mouseover"]);
ha("onMouseLeave", ["mouseout", "mouseover"]);
ha("onPointerEnter", ["pointerout", "pointerover"]);
ha("onPointerLeave", ["pointerout", "pointerover"]);
fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a2, b2, c2) {
  var d2 = a2.type || "unknown-event";
  a2.currentTarget = c2;
  Ub(d2, b2, void 0, a2);
  a2.currentTarget = null;
}
function se$1(a2, b2) {
  b2 = 0 !== (b2 & 4);
  for (var c2 = 0; c2 < a2.length; c2++) {
    var d2 = a2[c2], e2 = d2.event;
    d2 = d2.listeners;
    a: {
      var f2 = void 0;
      if (b2)
        for (var g2 = d2.length - 1; 0 <= g2; g2--) {
          var h2 = d2[g2], k2 = h2.instance, l2 = h2.currentTarget;
          h2 = h2.listener;
          if (k2 !== f2 && e2.isPropagationStopped())
            break a;
          nf(e2, h2, l2);
          f2 = k2;
        }
      else
        for (g2 = 0; g2 < d2.length; g2++) {
          h2 = d2[g2];
          k2 = h2.instance;
          l2 = h2.currentTarget;
          h2 = h2.listener;
          if (k2 !== f2 && e2.isPropagationStopped())
            break a;
          nf(e2, h2, l2);
          f2 = k2;
        }
    }
  }
  if (Qb)
    throw a2 = Rb, Qb = false, Rb = null, a2;
}
function D$2(a2, b2) {
  var c2 = b2[of];
  void 0 === c2 && (c2 = b2[of] = /* @__PURE__ */ new Set());
  var d2 = a2 + "__bubble";
  c2.has(d2) || (pf(b2, a2, 2, false), c2.add(d2));
}
function qf(a2, b2, c2) {
  var d2 = 0;
  b2 && (d2 |= 4);
  pf(c2, a2, d2, b2);
}
var rf = "_reactListening" + Math.random().toString(36).slice(2);
function sf(a2) {
  if (!a2[rf]) {
    a2[rf] = true;
    da.forEach(function(b3) {
      "selectionchange" !== b3 && (mf.has(b3) || qf(b3, false, a2), qf(b3, true, a2));
    });
    var b2 = 9 === a2.nodeType ? a2 : a2.ownerDocument;
    null === b2 || b2[rf] || (b2[rf] = true, qf("selectionchange", false, b2));
  }
}
function pf(a2, b2, c2, d2) {
  switch (jd(b2)) {
    case 1:
      var e2 = ed;
      break;
    case 4:
      e2 = gd;
      break;
    default:
      e2 = fd;
  }
  c2 = e2.bind(null, b2, c2, a2);
  e2 = void 0;
  !Lb || "touchstart" !== b2 && "touchmove" !== b2 && "wheel" !== b2 || (e2 = true);
  d2 ? void 0 !== e2 ? a2.addEventListener(b2, c2, { capture: true, passive: e2 }) : a2.addEventListener(b2, c2, true) : void 0 !== e2 ? a2.addEventListener(b2, c2, { passive: e2 }) : a2.addEventListener(b2, c2, false);
}
function hd(a2, b2, c2, d2, e2) {
  var f2 = d2;
  if (0 === (b2 & 1) && 0 === (b2 & 2) && null !== d2)
    a:
      for (; ; ) {
        if (null === d2)
          return;
        var g2 = d2.tag;
        if (3 === g2 || 4 === g2) {
          var h2 = d2.stateNode.containerInfo;
          if (h2 === e2 || 8 === h2.nodeType && h2.parentNode === e2)
            break;
          if (4 === g2)
            for (g2 = d2.return; null !== g2; ) {
              var k2 = g2.tag;
              if (3 === k2 || 4 === k2) {
                if (k2 = g2.stateNode.containerInfo, k2 === e2 || 8 === k2.nodeType && k2.parentNode === e2)
                  return;
              }
              g2 = g2.return;
            }
          for (; null !== h2; ) {
            g2 = Wc(h2);
            if (null === g2)
              return;
            k2 = g2.tag;
            if (5 === k2 || 6 === k2) {
              d2 = f2 = g2;
              continue a;
            }
            h2 = h2.parentNode;
          }
        }
        d2 = d2.return;
      }
  Jb(function() {
    var d3 = f2, e3 = xb(c2), g3 = [];
    a: {
      var h3 = df.get(a2);
      if (void 0 !== h3) {
        var k3 = td, n2 = a2;
        switch (a2) {
          case "keypress":
            if (0 === od(c2))
              break a;
          case "keydown":
          case "keyup":
            k3 = Rd;
            break;
          case "focusin":
            n2 = "focus";
            k3 = Fd;
            break;
          case "focusout":
            n2 = "blur";
            k3 = Fd;
            break;
          case "beforeblur":
          case "afterblur":
            k3 = Fd;
            break;
          case "click":
            if (2 === c2.button)
              break a;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            k3 = Bd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k3 = Dd;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k3 = Vd;
            break;
          case $e:
          case af:
          case bf:
            k3 = Hd;
            break;
          case cf:
            k3 = Xd;
            break;
          case "scroll":
            k3 = vd;
            break;
          case "wheel":
            k3 = Zd;
            break;
          case "copy":
          case "cut":
          case "paste":
            k3 = Jd;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k3 = Td;
        }
        var t2 = 0 !== (b2 & 4), J2 = !t2 && "scroll" === a2, x2 = t2 ? null !== h3 ? h3 + "Capture" : null : h3;
        t2 = [];
        for (var w2 = d3, u2; null !== w2; ) {
          u2 = w2;
          var F2 = u2.stateNode;
          5 === u2.tag && null !== F2 && (u2 = F2, null !== x2 && (F2 = Kb(w2, x2), null != F2 && t2.push(tf(w2, F2, u2))));
          if (J2)
            break;
          w2 = w2.return;
        }
        0 < t2.length && (h3 = new k3(h3, n2, null, c2, e3), g3.push({ event: h3, listeners: t2 }));
      }
    }
    if (0 === (b2 & 7)) {
      a: {
        h3 = "mouseover" === a2 || "pointerover" === a2;
        k3 = "mouseout" === a2 || "pointerout" === a2;
        if (h3 && c2 !== wb && (n2 = c2.relatedTarget || c2.fromElement) && (Wc(n2) || n2[uf]))
          break a;
        if (k3 || h3) {
          h3 = e3.window === e3 ? e3 : (h3 = e3.ownerDocument) ? h3.defaultView || h3.parentWindow : window;
          if (k3) {
            if (n2 = c2.relatedTarget || c2.toElement, k3 = d3, n2 = n2 ? Wc(n2) : null, null !== n2 && (J2 = Vb(n2), n2 !== J2 || 5 !== n2.tag && 6 !== n2.tag))
              n2 = null;
          } else
            k3 = null, n2 = d3;
          if (k3 !== n2) {
            t2 = Bd;
            F2 = "onMouseLeave";
            x2 = "onMouseEnter";
            w2 = "mouse";
            if ("pointerout" === a2 || "pointerover" === a2)
              t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
            J2 = null == k3 ? h3 : ue$1(k3);
            u2 = null == n2 ? h3 : ue$1(n2);
            h3 = new t2(F2, w2 + "leave", k3, c2, e3);
            h3.target = J2;
            h3.relatedTarget = u2;
            F2 = null;
            Wc(e3) === d3 && (t2 = new t2(x2, w2 + "enter", n2, c2, e3), t2.target = u2, t2.relatedTarget = J2, F2 = t2);
            J2 = F2;
            if (k3 && n2)
              b: {
                t2 = k3;
                x2 = n2;
                w2 = 0;
                for (u2 = t2; u2; u2 = vf(u2))
                  w2++;
                u2 = 0;
                for (F2 = x2; F2; F2 = vf(F2))
                  u2++;
                for (; 0 < w2 - u2; )
                  t2 = vf(t2), w2--;
                for (; 0 < u2 - w2; )
                  x2 = vf(x2), u2--;
                for (; w2--; ) {
                  if (t2 === x2 || null !== x2 && t2 === x2.alternate)
                    break b;
                  t2 = vf(t2);
                  x2 = vf(x2);
                }
                t2 = null;
              }
            else
              t2 = null;
            null !== k3 && wf(g3, h3, k3, t2, false);
            null !== n2 && null !== J2 && wf(g3, J2, n2, t2, true);
          }
        }
      }
      a: {
        h3 = d3 ? ue$1(d3) : window;
        k3 = h3.nodeName && h3.nodeName.toLowerCase();
        if ("select" === k3 || "input" === k3 && "file" === h3.type)
          var na = ve$1;
        else if (me$1(h3))
          if (we)
            na = Fe$1;
          else {
            na = De$2;
            var xa = Ce;
          }
        else
          (k3 = h3.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h3.type || "radio" === h3.type) && (na = Ee$1);
        if (na && (na = na(a2, d3))) {
          ne(g3, na, c2, e3);
          break a;
        }
        xa && xa(a2, h3, d3);
        "focusout" === a2 && (xa = h3._wrapperState) && xa.controlled && "number" === h3.type && cb(h3, "number", h3.value);
      }
      xa = d3 ? ue$1(d3) : window;
      switch (a2) {
        case "focusin":
          if (me$1(xa) || "true" === xa.contentEditable)
            Qe = xa, Re$2 = d3, Se$2 = null;
          break;
        case "focusout":
          Se$2 = Re$2 = Qe = null;
          break;
        case "mousedown":
          Te$1 = true;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Te$1 = false;
          Ue(g3, c2, e3);
          break;
        case "selectionchange":
          if (Pe$2)
            break;
        case "keydown":
        case "keyup":
          Ue(g3, c2, e3);
      }
      var $a;
      if (ae$1)
        b: {
          switch (a2) {
            case "compositionstart":
              var ba = "onCompositionStart";
              break b;
            case "compositionend":
              ba = "onCompositionEnd";
              break b;
            case "compositionupdate":
              ba = "onCompositionUpdate";
              break b;
          }
          ba = void 0;
        }
      else
        ie ? ge$1(a2, c2) && (ba = "onCompositionEnd") : "keydown" === a2 && 229 === c2.keyCode && (ba = "onCompositionStart");
      ba && (de$1 && "ko" !== c2.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e3, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d3, ba), 0 < xa.length && (ba = new Ld(ba, a2, null, c2, e3), g3.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he$1(c2), null !== $a && (ba.data = $a))));
      if ($a = ce ? je(a2, c2) : ke(a2, c2))
        d3 = oe(d3, "onBeforeInput"), 0 < d3.length && (e3 = new Ld("onBeforeInput", "beforeinput", null, c2, e3), g3.push({ event: e3, listeners: d3 }), e3.data = $a);
    }
    se$1(g3, b2);
  });
}
function tf(a2, b2, c2) {
  return { instance: a2, listener: b2, currentTarget: c2 };
}
function oe(a2, b2) {
  for (var c2 = b2 + "Capture", d2 = []; null !== a2; ) {
    var e2 = a2, f2 = e2.stateNode;
    5 === e2.tag && null !== f2 && (e2 = f2, f2 = Kb(a2, c2), null != f2 && d2.unshift(tf(a2, f2, e2)), f2 = Kb(a2, b2), null != f2 && d2.push(tf(a2, f2, e2)));
    a2 = a2.return;
  }
  return d2;
}
function vf(a2) {
  if (null === a2)
    return null;
  do
    a2 = a2.return;
  while (a2 && 5 !== a2.tag);
  return a2 ? a2 : null;
}
function wf(a2, b2, c2, d2, e2) {
  for (var f2 = b2._reactName, g2 = []; null !== c2 && c2 !== d2; ) {
    var h2 = c2, k2 = h2.alternate, l2 = h2.stateNode;
    if (null !== k2 && k2 === d2)
      break;
    5 === h2.tag && null !== l2 && (h2 = l2, e2 ? (k2 = Kb(c2, f2), null != k2 && g2.unshift(tf(c2, k2, h2))) : e2 || (k2 = Kb(c2, f2), null != k2 && g2.push(tf(c2, k2, h2))));
    c2 = c2.return;
  }
  0 !== g2.length && a2.push({ event: b2, listeners: g2 });
}
var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
function zf(a2) {
  return ("string" === typeof a2 ? a2 : "" + a2).replace(xf, "\n").replace(yf, "");
}
function Af(a2, b2, c2) {
  b2 = zf(b2);
  if (zf(a2) !== b2 && c2)
    throw Error(p$1(425));
}
function Bf() {
}
var Cf = null, Df = null;
function Ef(a2, b2) {
  return "textarea" === a2 || "noscript" === a2 || "string" === typeof b2.children || "number" === typeof b2.children || "object" === typeof b2.dangerouslySetInnerHTML && null !== b2.dangerouslySetInnerHTML && null != b2.dangerouslySetInnerHTML.__html;
}
var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a2) {
  return Hf.resolve(null).then(a2).catch(If);
} : Ff;
function If(a2) {
  setTimeout(function() {
    throw a2;
  });
}
function Kf(a2, b2) {
  var c2 = b2, d2 = 0;
  do {
    var e2 = c2.nextSibling;
    a2.removeChild(c2);
    if (e2 && 8 === e2.nodeType)
      if (c2 = e2.data, "/$" === c2) {
        if (0 === d2) {
          a2.removeChild(e2);
          bd(b2);
          return;
        }
        d2--;
      } else
        "$" !== c2 && "$?" !== c2 && "$!" !== c2 || d2++;
    c2 = e2;
  } while (c2);
  bd(b2);
}
function Lf(a2) {
  for (; null != a2; a2 = a2.nextSibling) {
    var b2 = a2.nodeType;
    if (1 === b2 || 3 === b2)
      break;
    if (8 === b2) {
      b2 = a2.data;
      if ("$" === b2 || "$!" === b2 || "$?" === b2)
        break;
      if ("/$" === b2)
        return null;
    }
  }
  return a2;
}
function Mf(a2) {
  a2 = a2.previousSibling;
  for (var b2 = 0; a2; ) {
    if (8 === a2.nodeType) {
      var c2 = a2.data;
      if ("$" === c2 || "$!" === c2 || "$?" === c2) {
        if (0 === b2)
          return a2;
        b2--;
      } else
        "/$" === c2 && b2++;
    }
    a2 = a2.previousSibling;
  }
  return null;
}
var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
function Wc(a2) {
  var b2 = a2[Of];
  if (b2)
    return b2;
  for (var c2 = a2.parentNode; c2; ) {
    if (b2 = c2[uf] || c2[Of]) {
      c2 = b2.alternate;
      if (null !== b2.child || null !== c2 && null !== c2.child)
        for (a2 = Mf(a2); null !== a2; ) {
          if (c2 = a2[Of])
            return c2;
          a2 = Mf(a2);
        }
      return b2;
    }
    a2 = c2;
    c2 = a2.parentNode;
  }
  return null;
}
function Cb(a2) {
  a2 = a2[Of] || a2[uf];
  return !a2 || 5 !== a2.tag && 6 !== a2.tag && 13 !== a2.tag && 3 !== a2.tag ? null : a2;
}
function ue$1(a2) {
  if (5 === a2.tag || 6 === a2.tag)
    return a2.stateNode;
  throw Error(p$1(33));
}
function Db(a2) {
  return a2[Pf] || null;
}
var Sf = [], Tf = -1;
function Uf(a2) {
  return { current: a2 };
}
function E(a2) {
  0 > Tf || (a2.current = Sf[Tf], Sf[Tf] = null, Tf--);
}
function G(a2, b2) {
  Tf++;
  Sf[Tf] = a2.current;
  a2.current = b2;
}
var Vf = {}, H$1 = Uf(Vf), Wf = Uf(false), Xf = Vf;
function Yf(a2, b2) {
  var c2 = a2.type.contextTypes;
  if (!c2)
    return Vf;
  var d2 = a2.stateNode;
  if (d2 && d2.__reactInternalMemoizedUnmaskedChildContext === b2)
    return d2.__reactInternalMemoizedMaskedChildContext;
  var e2 = {}, f2;
  for (f2 in c2)
    e2[f2] = b2[f2];
  d2 && (a2 = a2.stateNode, a2.__reactInternalMemoizedUnmaskedChildContext = b2, a2.__reactInternalMemoizedMaskedChildContext = e2);
  return e2;
}
function Zf(a2) {
  a2 = a2.childContextTypes;
  return null !== a2 && void 0 !== a2;
}
function $f() {
  E(Wf);
  E(H$1);
}
function ag(a2, b2, c2) {
  if (H$1.current !== Vf)
    throw Error(p$1(168));
  G(H$1, b2);
  G(Wf, c2);
}
function bg(a2, b2, c2) {
  var d2 = a2.stateNode;
  b2 = b2.childContextTypes;
  if ("function" !== typeof d2.getChildContext)
    return c2;
  d2 = d2.getChildContext();
  for (var e2 in d2)
    if (!(e2 in b2))
      throw Error(p$1(108, Ra(a2) || "Unknown", e2));
  return A({}, c2, d2);
}
function cg(a2) {
  a2 = (a2 = a2.stateNode) && a2.__reactInternalMemoizedMergedChildContext || Vf;
  Xf = H$1.current;
  G(H$1, a2);
  G(Wf, Wf.current);
  return true;
}
function dg(a2, b2, c2) {
  var d2 = a2.stateNode;
  if (!d2)
    throw Error(p$1(169));
  c2 ? (a2 = bg(a2, b2, Xf), d2.__reactInternalMemoizedMergedChildContext = a2, E(Wf), E(H$1), G(H$1, a2)) : E(Wf);
  G(Wf, c2);
}
var eg = null, fg = false, gg = false;
function hg(a2) {
  null === eg ? eg = [a2] : eg.push(a2);
}
function ig(a2) {
  fg = true;
  hg(a2);
}
function jg() {
  if (!gg && null !== eg) {
    gg = true;
    var a2 = 0, b2 = C$2;
    try {
      var c2 = eg;
      for (C$2 = 1; a2 < c2.length; a2++) {
        var d2 = c2[a2];
        do
          d2 = d2(true);
        while (null !== d2);
      }
      eg = null;
      fg = false;
    } catch (e2) {
      throw null !== eg && (eg = eg.slice(a2 + 1)), ac(fc, jg), e2;
    } finally {
      C$2 = b2, gg = false;
    }
  }
  return null;
}
var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
function tg(a2, b2) {
  kg[lg++] = ng;
  kg[lg++] = mg;
  mg = a2;
  ng = b2;
}
function ug(a2, b2, c2) {
  og[pg++] = rg;
  og[pg++] = sg;
  og[pg++] = qg;
  qg = a2;
  var d2 = rg;
  a2 = sg;
  var e2 = 32 - oc(d2) - 1;
  d2 &= ~(1 << e2);
  c2 += 1;
  var f2 = 32 - oc(b2) + e2;
  if (30 < f2) {
    var g2 = e2 - e2 % 5;
    f2 = (d2 & (1 << g2) - 1).toString(32);
    d2 >>= g2;
    e2 -= g2;
    rg = 1 << 32 - oc(b2) + e2 | c2 << e2 | d2;
    sg = f2 + a2;
  } else
    rg = 1 << f2 | c2 << e2 | d2, sg = a2;
}
function vg(a2) {
  null !== a2.return && (tg(a2, 1), ug(a2, 1, 0));
}
function wg(a2) {
  for (; a2 === mg; )
    mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
  for (; a2 === qg; )
    qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
}
var xg = null, yg = null, I$3 = false, zg = null;
function Ag(a2, b2) {
  var c2 = Bg(5, null, null, 0);
  c2.elementType = "DELETED";
  c2.stateNode = b2;
  c2.return = a2;
  b2 = a2.deletions;
  null === b2 ? (a2.deletions = [c2], a2.flags |= 16) : b2.push(c2);
}
function Cg(a2, b2) {
  switch (a2.tag) {
    case 5:
      var c2 = a2.type;
      b2 = 1 !== b2.nodeType || c2.toLowerCase() !== b2.nodeName.toLowerCase() ? null : b2;
      return null !== b2 ? (a2.stateNode = b2, xg = a2, yg = Lf(b2.firstChild), true) : false;
    case 6:
      return b2 = "" === a2.pendingProps || 3 !== b2.nodeType ? null : b2, null !== b2 ? (a2.stateNode = b2, xg = a2, yg = null, true) : false;
    case 13:
      return b2 = 8 !== b2.nodeType ? null : b2, null !== b2 ? (c2 = null !== qg ? { id: rg, overflow: sg } : null, a2.memoizedState = { dehydrated: b2, treeContext: c2, retryLane: 1073741824 }, c2 = Bg(18, null, null, 0), c2.stateNode = b2, c2.return = a2, a2.child = c2, xg = a2, yg = null, true) : false;
    default:
      return false;
  }
}
function Dg(a2) {
  return 0 !== (a2.mode & 1) && 0 === (a2.flags & 128);
}
function Eg(a2) {
  if (I$3) {
    var b2 = yg;
    if (b2) {
      var c2 = b2;
      if (!Cg(a2, b2)) {
        if (Dg(a2))
          throw Error(p$1(418));
        b2 = Lf(c2.nextSibling);
        var d2 = xg;
        b2 && Cg(a2, b2) ? Ag(d2, c2) : (a2.flags = a2.flags & -4097 | 2, I$3 = false, xg = a2);
      }
    } else {
      if (Dg(a2))
        throw Error(p$1(418));
      a2.flags = a2.flags & -4097 | 2;
      I$3 = false;
      xg = a2;
    }
  }
}
function Fg(a2) {
  for (a2 = a2.return; null !== a2 && 5 !== a2.tag && 3 !== a2.tag && 13 !== a2.tag; )
    a2 = a2.return;
  xg = a2;
}
function Gg(a2) {
  if (a2 !== xg)
    return false;
  if (!I$3)
    return Fg(a2), I$3 = true, false;
  var b2;
  (b2 = 3 !== a2.tag) && !(b2 = 5 !== a2.tag) && (b2 = a2.type, b2 = "head" !== b2 && "body" !== b2 && !Ef(a2.type, a2.memoizedProps));
  if (b2 && (b2 = yg)) {
    if (Dg(a2))
      throw Hg(), Error(p$1(418));
    for (; b2; )
      Ag(a2, b2), b2 = Lf(b2.nextSibling);
  }
  Fg(a2);
  if (13 === a2.tag) {
    a2 = a2.memoizedState;
    a2 = null !== a2 ? a2.dehydrated : null;
    if (!a2)
      throw Error(p$1(317));
    a: {
      a2 = a2.nextSibling;
      for (b2 = 0; a2; ) {
        if (8 === a2.nodeType) {
          var c2 = a2.data;
          if ("/$" === c2) {
            if (0 === b2) {
              yg = Lf(a2.nextSibling);
              break a;
            }
            b2--;
          } else
            "$" !== c2 && "$!" !== c2 && "$?" !== c2 || b2++;
        }
        a2 = a2.nextSibling;
      }
      yg = null;
    }
  } else
    yg = xg ? Lf(a2.stateNode.nextSibling) : null;
  return true;
}
function Hg() {
  for (var a2 = yg; a2; )
    a2 = Lf(a2.nextSibling);
}
function Ig() {
  yg = xg = null;
  I$3 = false;
}
function Jg(a2) {
  null === zg ? zg = [a2] : zg.push(a2);
}
var Kg = ua.ReactCurrentBatchConfig;
function Lg(a2, b2, c2) {
  a2 = c2.ref;
  if (null !== a2 && "function" !== typeof a2 && "object" !== typeof a2) {
    if (c2._owner) {
      c2 = c2._owner;
      if (c2) {
        if (1 !== c2.tag)
          throw Error(p$1(309));
        var d2 = c2.stateNode;
      }
      if (!d2)
        throw Error(p$1(147, a2));
      var e2 = d2, f2 = "" + a2;
      if (null !== b2 && null !== b2.ref && "function" === typeof b2.ref && b2.ref._stringRef === f2)
        return b2.ref;
      b2 = function(a3) {
        var b3 = e2.refs;
        null === a3 ? delete b3[f2] : b3[f2] = a3;
      };
      b2._stringRef = f2;
      return b2;
    }
    if ("string" !== typeof a2)
      throw Error(p$1(284));
    if (!c2._owner)
      throw Error(p$1(290, a2));
  }
  return a2;
}
function Mg(a2, b2) {
  a2 = Object.prototype.toString.call(b2);
  throw Error(p$1(31, "[object Object]" === a2 ? "object with keys {" + Object.keys(b2).join(", ") + "}" : a2));
}
function Ng(a2) {
  var b2 = a2._init;
  return b2(a2._payload);
}
function Og(a2) {
  function b2(b3, c3) {
    if (a2) {
      var d3 = b3.deletions;
      null === d3 ? (b3.deletions = [c3], b3.flags |= 16) : d3.push(c3);
    }
  }
  function c2(c3, d3) {
    if (!a2)
      return null;
    for (; null !== d3; )
      b2(c3, d3), d3 = d3.sibling;
    return null;
  }
  function d2(a3, b3) {
    for (a3 = /* @__PURE__ */ new Map(); null !== b3; )
      null !== b3.key ? a3.set(b3.key, b3) : a3.set(b3.index, b3), b3 = b3.sibling;
    return a3;
  }
  function e2(a3, b3) {
    a3 = Pg(a3, b3);
    a3.index = 0;
    a3.sibling = null;
    return a3;
  }
  function f2(b3, c3, d3) {
    b3.index = d3;
    if (!a2)
      return b3.flags |= 1048576, c3;
    d3 = b3.alternate;
    if (null !== d3)
      return d3 = d3.index, d3 < c3 ? (b3.flags |= 2, c3) : d3;
    b3.flags |= 2;
    return c3;
  }
  function g2(b3) {
    a2 && null === b3.alternate && (b3.flags |= 2);
    return b3;
  }
  function h2(a3, b3, c3, d3) {
    if (null === b3 || 6 !== b3.tag)
      return b3 = Qg(c3, a3.mode, d3), b3.return = a3, b3;
    b3 = e2(b3, c3);
    b3.return = a3;
    return b3;
  }
  function k2(a3, b3, c3, d3) {
    var f3 = c3.type;
    if (f3 === ya)
      return m2(a3, b3, c3.props.children, d3, c3.key);
    if (null !== b3 && (b3.elementType === f3 || "object" === typeof f3 && null !== f3 && f3.$$typeof === Ha && Ng(f3) === b3.type))
      return d3 = e2(b3, c3.props), d3.ref = Lg(a3, b3, c3), d3.return = a3, d3;
    d3 = Rg(c3.type, c3.key, c3.props, null, a3.mode, d3);
    d3.ref = Lg(a3, b3, c3);
    d3.return = a3;
    return d3;
  }
  function l2(a3, b3, c3, d3) {
    if (null === b3 || 4 !== b3.tag || b3.stateNode.containerInfo !== c3.containerInfo || b3.stateNode.implementation !== c3.implementation)
      return b3 = Sg(c3, a3.mode, d3), b3.return = a3, b3;
    b3 = e2(b3, c3.children || []);
    b3.return = a3;
    return b3;
  }
  function m2(a3, b3, c3, d3, f3) {
    if (null === b3 || 7 !== b3.tag)
      return b3 = Tg(c3, a3.mode, d3, f3), b3.return = a3, b3;
    b3 = e2(b3, c3);
    b3.return = a3;
    return b3;
  }
  function q2(a3, b3, c3) {
    if ("string" === typeof b3 && "" !== b3 || "number" === typeof b3)
      return b3 = Qg("" + b3, a3.mode, c3), b3.return = a3, b3;
    if ("object" === typeof b3 && null !== b3) {
      switch (b3.$$typeof) {
        case va:
          return c3 = Rg(b3.type, b3.key, b3.props, null, a3.mode, c3), c3.ref = Lg(a3, null, b3), c3.return = a3, c3;
        case wa:
          return b3 = Sg(b3, a3.mode, c3), b3.return = a3, b3;
        case Ha:
          var d3 = b3._init;
          return q2(a3, d3(b3._payload), c3);
      }
      if (eb(b3) || Ka(b3))
        return b3 = Tg(b3, a3.mode, c3, null), b3.return = a3, b3;
      Mg(a3, b3);
    }
    return null;
  }
  function r2(a3, b3, c3, d3) {
    var e3 = null !== b3 ? b3.key : null;
    if ("string" === typeof c3 && "" !== c3 || "number" === typeof c3)
      return null !== e3 ? null : h2(a3, b3, "" + c3, d3);
    if ("object" === typeof c3 && null !== c3) {
      switch (c3.$$typeof) {
        case va:
          return c3.key === e3 ? k2(a3, b3, c3, d3) : null;
        case wa:
          return c3.key === e3 ? l2(a3, b3, c3, d3) : null;
        case Ha:
          return e3 = c3._init, r2(
            a3,
            b3,
            e3(c3._payload),
            d3
          );
      }
      if (eb(c3) || Ka(c3))
        return null !== e3 ? null : m2(a3, b3, c3, d3, null);
      Mg(a3, c3);
    }
    return null;
  }
  function y2(a3, b3, c3, d3, e3) {
    if ("string" === typeof d3 && "" !== d3 || "number" === typeof d3)
      return a3 = a3.get(c3) || null, h2(b3, a3, "" + d3, e3);
    if ("object" === typeof d3 && null !== d3) {
      switch (d3.$$typeof) {
        case va:
          return a3 = a3.get(null === d3.key ? c3 : d3.key) || null, k2(b3, a3, d3, e3);
        case wa:
          return a3 = a3.get(null === d3.key ? c3 : d3.key) || null, l2(b3, a3, d3, e3);
        case Ha:
          var f3 = d3._init;
          return y2(a3, b3, c3, f3(d3._payload), e3);
      }
      if (eb(d3) || Ka(d3))
        return a3 = a3.get(c3) || null, m2(b3, a3, d3, e3, null);
      Mg(b3, d3);
    }
    return null;
  }
  function n2(e3, g3, h3, k3) {
    for (var l3 = null, m3 = null, u2 = g3, w2 = g3 = 0, x2 = null; null !== u2 && w2 < h3.length; w2++) {
      u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
      var n3 = r2(e3, u2, h3[w2], k3);
      if (null === n3) {
        null === u2 && (u2 = x2);
        break;
      }
      a2 && u2 && null === n3.alternate && b2(e3, u2);
      g3 = f2(n3, g3, w2);
      null === m3 ? l3 = n3 : m3.sibling = n3;
      m3 = n3;
      u2 = x2;
    }
    if (w2 === h3.length)
      return c2(e3, u2), I$3 && tg(e3, w2), l3;
    if (null === u2) {
      for (; w2 < h3.length; w2++)
        u2 = q2(e3, h3[w2], k3), null !== u2 && (g3 = f2(u2, g3, w2), null === m3 ? l3 = u2 : m3.sibling = u2, m3 = u2);
      I$3 && tg(e3, w2);
      return l3;
    }
    for (u2 = d2(e3, u2); w2 < h3.length; w2++)
      x2 = y2(u2, e3, w2, h3[w2], k3), null !== x2 && (a2 && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g3 = f2(x2, g3, w2), null === m3 ? l3 = x2 : m3.sibling = x2, m3 = x2);
    a2 && u2.forEach(function(a3) {
      return b2(e3, a3);
    });
    I$3 && tg(e3, w2);
    return l3;
  }
  function t2(e3, g3, h3, k3) {
    var l3 = Ka(h3);
    if ("function" !== typeof l3)
      throw Error(p$1(150));
    h3 = l3.call(h3);
    if (null == h3)
      throw Error(p$1(151));
    for (var u2 = l3 = null, m3 = g3, w2 = g3 = 0, x2 = null, n3 = h3.next(); null !== m3 && !n3.done; w2++, n3 = h3.next()) {
      m3.index > w2 ? (x2 = m3, m3 = null) : x2 = m3.sibling;
      var t3 = r2(e3, m3, n3.value, k3);
      if (null === t3) {
        null === m3 && (m3 = x2);
        break;
      }
      a2 && m3 && null === t3.alternate && b2(e3, m3);
      g3 = f2(t3, g3, w2);
      null === u2 ? l3 = t3 : u2.sibling = t3;
      u2 = t3;
      m3 = x2;
    }
    if (n3.done)
      return c2(
        e3,
        m3
      ), I$3 && tg(e3, w2), l3;
    if (null === m3) {
      for (; !n3.done; w2++, n3 = h3.next())
        n3 = q2(e3, n3.value, k3), null !== n3 && (g3 = f2(n3, g3, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
      I$3 && tg(e3, w2);
      return l3;
    }
    for (m3 = d2(e3, m3); !n3.done; w2++, n3 = h3.next())
      n3 = y2(m3, e3, w2, n3.value, k3), null !== n3 && (a2 && null !== n3.alternate && m3.delete(null === n3.key ? w2 : n3.key), g3 = f2(n3, g3, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
    a2 && m3.forEach(function(a3) {
      return b2(e3, a3);
    });
    I$3 && tg(e3, w2);
    return l3;
  }
  function J2(a3, d3, f3, h3) {
    "object" === typeof f3 && null !== f3 && f3.type === ya && null === f3.key && (f3 = f3.props.children);
    if ("object" === typeof f3 && null !== f3) {
      switch (f3.$$typeof) {
        case va:
          a: {
            for (var k3 = f3.key, l3 = d3; null !== l3; ) {
              if (l3.key === k3) {
                k3 = f3.type;
                if (k3 === ya) {
                  if (7 === l3.tag) {
                    c2(a3, l3.sibling);
                    d3 = e2(l3, f3.props.children);
                    d3.return = a3;
                    a3 = d3;
                    break a;
                  }
                } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && Ng(k3) === l3.type) {
                  c2(a3, l3.sibling);
                  d3 = e2(l3, f3.props);
                  d3.ref = Lg(a3, l3, f3);
                  d3.return = a3;
                  a3 = d3;
                  break a;
                }
                c2(a3, l3);
                break;
              } else
                b2(a3, l3);
              l3 = l3.sibling;
            }
            f3.type === ya ? (d3 = Tg(f3.props.children, a3.mode, h3, f3.key), d3.return = a3, a3 = d3) : (h3 = Rg(f3.type, f3.key, f3.props, null, a3.mode, h3), h3.ref = Lg(a3, d3, f3), h3.return = a3, a3 = h3);
          }
          return g2(a3);
        case wa:
          a: {
            for (l3 = f3.key; null !== d3; ) {
              if (d3.key === l3)
                if (4 === d3.tag && d3.stateNode.containerInfo === f3.containerInfo && d3.stateNode.implementation === f3.implementation) {
                  c2(a3, d3.sibling);
                  d3 = e2(d3, f3.children || []);
                  d3.return = a3;
                  a3 = d3;
                  break a;
                } else {
                  c2(a3, d3);
                  break;
                }
              else
                b2(a3, d3);
              d3 = d3.sibling;
            }
            d3 = Sg(f3, a3.mode, h3);
            d3.return = a3;
            a3 = d3;
          }
          return g2(a3);
        case Ha:
          return l3 = f3._init, J2(a3, d3, l3(f3._payload), h3);
      }
      if (eb(f3))
        return n2(a3, d3, f3, h3);
      if (Ka(f3))
        return t2(a3, d3, f3, h3);
      Mg(a3, f3);
    }
    return "string" === typeof f3 && "" !== f3 || "number" === typeof f3 ? (f3 = "" + f3, null !== d3 && 6 === d3.tag ? (c2(a3, d3.sibling), d3 = e2(d3, f3), d3.return = a3, a3 = d3) : (c2(a3, d3), d3 = Qg(f3, a3.mode, h3), d3.return = a3, a3 = d3), g2(a3)) : c2(a3, d3);
  }
  return J2;
}
var Ug = Og(true), Vg = Og(false), Wg = Uf(null), Xg = null, Yg = null, Zg = null;
function $g() {
  Zg = Yg = Xg = null;
}
function ah(a2) {
  var b2 = Wg.current;
  E(Wg);
  a2._currentValue = b2;
}
function bh(a2, b2, c2) {
  for (; null !== a2; ) {
    var d2 = a2.alternate;
    (a2.childLanes & b2) !== b2 ? (a2.childLanes |= b2, null !== d2 && (d2.childLanes |= b2)) : null !== d2 && (d2.childLanes & b2) !== b2 && (d2.childLanes |= b2);
    if (a2 === c2)
      break;
    a2 = a2.return;
  }
}
function ch(a2, b2) {
  Xg = a2;
  Zg = Yg = null;
  a2 = a2.dependencies;
  null !== a2 && null !== a2.firstContext && (0 !== (a2.lanes & b2) && (dh = true), a2.firstContext = null);
}
function eh(a2) {
  var b2 = a2._currentValue;
  if (Zg !== a2)
    if (a2 = { context: a2, memoizedValue: b2, next: null }, null === Yg) {
      if (null === Xg)
        throw Error(p$1(308));
      Yg = a2;
      Xg.dependencies = { lanes: 0, firstContext: a2 };
    } else
      Yg = Yg.next = a2;
  return b2;
}
var fh = null;
function gh(a2) {
  null === fh ? fh = [a2] : fh.push(a2);
}
function hh(a2, b2, c2, d2) {
  var e2 = b2.interleaved;
  null === e2 ? (c2.next = c2, gh(b2)) : (c2.next = e2.next, e2.next = c2);
  b2.interleaved = c2;
  return ih(a2, d2);
}
function ih(a2, b2) {
  a2.lanes |= b2;
  var c2 = a2.alternate;
  null !== c2 && (c2.lanes |= b2);
  c2 = a2;
  for (a2 = a2.return; null !== a2; )
    a2.childLanes |= b2, c2 = a2.alternate, null !== c2 && (c2.childLanes |= b2), c2 = a2, a2 = a2.return;
  return 3 === c2.tag ? c2.stateNode : null;
}
var jh = false;
function kh(a2) {
  a2.updateQueue = { baseState: a2.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function lh(a2, b2) {
  a2 = a2.updateQueue;
  b2.updateQueue === a2 && (b2.updateQueue = { baseState: a2.baseState, firstBaseUpdate: a2.firstBaseUpdate, lastBaseUpdate: a2.lastBaseUpdate, shared: a2.shared, effects: a2.effects });
}
function mh(a2, b2) {
  return { eventTime: a2, lane: b2, tag: 0, payload: null, callback: null, next: null };
}
function nh(a2, b2, c2) {
  var d2 = a2.updateQueue;
  if (null === d2)
    return null;
  d2 = d2.shared;
  if (0 !== (K & 2)) {
    var e2 = d2.pending;
    null === e2 ? b2.next = b2 : (b2.next = e2.next, e2.next = b2);
    d2.pending = b2;
    return ih(a2, c2);
  }
  e2 = d2.interleaved;
  null === e2 ? (b2.next = b2, gh(d2)) : (b2.next = e2.next, e2.next = b2);
  d2.interleaved = b2;
  return ih(a2, c2);
}
function oh(a2, b2, c2) {
  b2 = b2.updateQueue;
  if (null !== b2 && (b2 = b2.shared, 0 !== (c2 & 4194240))) {
    var d2 = b2.lanes;
    d2 &= a2.pendingLanes;
    c2 |= d2;
    b2.lanes = c2;
    Cc(a2, c2);
  }
}
function ph(a2, b2) {
  var c2 = a2.updateQueue, d2 = a2.alternate;
  if (null !== d2 && (d2 = d2.updateQueue, c2 === d2)) {
    var e2 = null, f2 = null;
    c2 = c2.firstBaseUpdate;
    if (null !== c2) {
      do {
        var g2 = { eventTime: c2.eventTime, lane: c2.lane, tag: c2.tag, payload: c2.payload, callback: c2.callback, next: null };
        null === f2 ? e2 = f2 = g2 : f2 = f2.next = g2;
        c2 = c2.next;
      } while (null !== c2);
      null === f2 ? e2 = f2 = b2 : f2 = f2.next = b2;
    } else
      e2 = f2 = b2;
    c2 = { baseState: d2.baseState, firstBaseUpdate: e2, lastBaseUpdate: f2, shared: d2.shared, effects: d2.effects };
    a2.updateQueue = c2;
    return;
  }
  a2 = c2.lastBaseUpdate;
  null === a2 ? c2.firstBaseUpdate = b2 : a2.next = b2;
  c2.lastBaseUpdate = b2;
}
function qh(a2, b2, c2, d2) {
  var e2 = a2.updateQueue;
  jh = false;
  var f2 = e2.firstBaseUpdate, g2 = e2.lastBaseUpdate, h2 = e2.shared.pending;
  if (null !== h2) {
    e2.shared.pending = null;
    var k2 = h2, l2 = k2.next;
    k2.next = null;
    null === g2 ? f2 = l2 : g2.next = l2;
    g2 = k2;
    var m2 = a2.alternate;
    null !== m2 && (m2 = m2.updateQueue, h2 = m2.lastBaseUpdate, h2 !== g2 && (null === h2 ? m2.firstBaseUpdate = l2 : h2.next = l2, m2.lastBaseUpdate = k2));
  }
  if (null !== f2) {
    var q2 = e2.baseState;
    g2 = 0;
    m2 = l2 = k2 = null;
    h2 = f2;
    do {
      var r2 = h2.lane, y2 = h2.eventTime;
      if ((d2 & r2) === r2) {
        null !== m2 && (m2 = m2.next = {
          eventTime: y2,
          lane: 0,
          tag: h2.tag,
          payload: h2.payload,
          callback: h2.callback,
          next: null
        });
        a: {
          var n2 = a2, t2 = h2;
          r2 = b2;
          y2 = c2;
          switch (t2.tag) {
            case 1:
              n2 = t2.payload;
              if ("function" === typeof n2) {
                q2 = n2.call(y2, q2, r2);
                break a;
              }
              q2 = n2;
              break a;
            case 3:
              n2.flags = n2.flags & -65537 | 128;
            case 0:
              n2 = t2.payload;
              r2 = "function" === typeof n2 ? n2.call(y2, q2, r2) : n2;
              if (null === r2 || void 0 === r2)
                break a;
              q2 = A({}, q2, r2);
              break a;
            case 2:
              jh = true;
          }
        }
        null !== h2.callback && 0 !== h2.lane && (a2.flags |= 64, r2 = e2.effects, null === r2 ? e2.effects = [h2] : r2.push(h2));
      } else
        y2 = { eventTime: y2, lane: r2, tag: h2.tag, payload: h2.payload, callback: h2.callback, next: null }, null === m2 ? (l2 = m2 = y2, k2 = q2) : m2 = m2.next = y2, g2 |= r2;
      h2 = h2.next;
      if (null === h2)
        if (h2 = e2.shared.pending, null === h2)
          break;
        else
          r2 = h2, h2 = r2.next, r2.next = null, e2.lastBaseUpdate = r2, e2.shared.pending = null;
    } while (1);
    null === m2 && (k2 = q2);
    e2.baseState = k2;
    e2.firstBaseUpdate = l2;
    e2.lastBaseUpdate = m2;
    b2 = e2.shared.interleaved;
    if (null !== b2) {
      e2 = b2;
      do
        g2 |= e2.lane, e2 = e2.next;
      while (e2 !== b2);
    } else
      null === f2 && (e2.shared.lanes = 0);
    rh |= g2;
    a2.lanes = g2;
    a2.memoizedState = q2;
  }
}
function sh(a2, b2, c2) {
  a2 = b2.effects;
  b2.effects = null;
  if (null !== a2)
    for (b2 = 0; b2 < a2.length; b2++) {
      var d2 = a2[b2], e2 = d2.callback;
      if (null !== e2) {
        d2.callback = null;
        d2 = c2;
        if ("function" !== typeof e2)
          throw Error(p$1(191, e2));
        e2.call(d2);
      }
    }
}
var th = {}, uh = Uf(th), vh = Uf(th), wh = Uf(th);
function xh(a2) {
  if (a2 === th)
    throw Error(p$1(174));
  return a2;
}
function yh(a2, b2) {
  G(wh, b2);
  G(vh, a2);
  G(uh, th);
  a2 = b2.nodeType;
  switch (a2) {
    case 9:
    case 11:
      b2 = (b2 = b2.documentElement) ? b2.namespaceURI : lb(null, "");
      break;
    default:
      a2 = 8 === a2 ? b2.parentNode : b2, b2 = a2.namespaceURI || null, a2 = a2.tagName, b2 = lb(b2, a2);
  }
  E(uh);
  G(uh, b2);
}
function zh() {
  E(uh);
  E(vh);
  E(wh);
}
function Ah(a2) {
  xh(wh.current);
  var b2 = xh(uh.current);
  var c2 = lb(b2, a2.type);
  b2 !== c2 && (G(vh, a2), G(uh, c2));
}
function Bh(a2) {
  vh.current === a2 && (E(uh), E(vh));
}
var L = Uf(0);
function Ch(a2) {
  for (var b2 = a2; null !== b2; ) {
    if (13 === b2.tag) {
      var c2 = b2.memoizedState;
      if (null !== c2 && (c2 = c2.dehydrated, null === c2 || "$?" === c2.data || "$!" === c2.data))
        return b2;
    } else if (19 === b2.tag && void 0 !== b2.memoizedProps.revealOrder) {
      if (0 !== (b2.flags & 128))
        return b2;
    } else if (null !== b2.child) {
      b2.child.return = b2;
      b2 = b2.child;
      continue;
    }
    if (b2 === a2)
      break;
    for (; null === b2.sibling; ) {
      if (null === b2.return || b2.return === a2)
        return null;
      b2 = b2.return;
    }
    b2.sibling.return = b2.return;
    b2 = b2.sibling;
  }
  return null;
}
var Dh = [];
function Eh() {
  for (var a2 = 0; a2 < Dh.length; a2++)
    Dh[a2]._workInProgressVersionPrimary = null;
  Dh.length = 0;
}
var Fh = ua.ReactCurrentDispatcher, Gh = ua.ReactCurrentBatchConfig, Hh = 0, M$3 = null, N$1 = null, O$2 = null, Ih = false, Jh = false, Kh = 0, Lh = 0;
function P() {
  throw Error(p$1(321));
}
function Mh(a2, b2) {
  if (null === b2)
    return false;
  for (var c2 = 0; c2 < b2.length && c2 < a2.length; c2++)
    if (!He$1(a2[c2], b2[c2]))
      return false;
  return true;
}
function Nh(a2, b2, c2, d2, e2, f2) {
  Hh = f2;
  M$3 = b2;
  b2.memoizedState = null;
  b2.updateQueue = null;
  b2.lanes = 0;
  Fh.current = null === a2 || null === a2.memoizedState ? Oh : Ph;
  a2 = c2(d2, e2);
  if (Jh) {
    f2 = 0;
    do {
      Jh = false;
      Kh = 0;
      if (25 <= f2)
        throw Error(p$1(301));
      f2 += 1;
      O$2 = N$1 = null;
      b2.updateQueue = null;
      Fh.current = Qh;
      a2 = c2(d2, e2);
    } while (Jh);
  }
  Fh.current = Rh;
  b2 = null !== N$1 && null !== N$1.next;
  Hh = 0;
  O$2 = N$1 = M$3 = null;
  Ih = false;
  if (b2)
    throw Error(p$1(300));
  return a2;
}
function Sh() {
  var a2 = 0 !== Kh;
  Kh = 0;
  return a2;
}
function Th() {
  var a2 = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  null === O$2 ? M$3.memoizedState = O$2 = a2 : O$2 = O$2.next = a2;
  return O$2;
}
function Uh() {
  if (null === N$1) {
    var a2 = M$3.alternate;
    a2 = null !== a2 ? a2.memoizedState : null;
  } else
    a2 = N$1.next;
  var b2 = null === O$2 ? M$3.memoizedState : O$2.next;
  if (null !== b2)
    O$2 = b2, N$1 = a2;
  else {
    if (null === a2)
      throw Error(p$1(310));
    N$1 = a2;
    a2 = { memoizedState: N$1.memoizedState, baseState: N$1.baseState, baseQueue: N$1.baseQueue, queue: N$1.queue, next: null };
    null === O$2 ? M$3.memoizedState = O$2 = a2 : O$2 = O$2.next = a2;
  }
  return O$2;
}
function Vh(a2, b2) {
  return "function" === typeof b2 ? b2(a2) : b2;
}
function Wh(a2) {
  var b2 = Uh(), c2 = b2.queue;
  if (null === c2)
    throw Error(p$1(311));
  c2.lastRenderedReducer = a2;
  var d2 = N$1, e2 = d2.baseQueue, f2 = c2.pending;
  if (null !== f2) {
    if (null !== e2) {
      var g2 = e2.next;
      e2.next = f2.next;
      f2.next = g2;
    }
    d2.baseQueue = e2 = f2;
    c2.pending = null;
  }
  if (null !== e2) {
    f2 = e2.next;
    d2 = d2.baseState;
    var h2 = g2 = null, k2 = null, l2 = f2;
    do {
      var m2 = l2.lane;
      if ((Hh & m2) === m2)
        null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d2 = l2.hasEagerState ? l2.eagerState : a2(d2, l2.action);
      else {
        var q2 = {
          lane: m2,
          action: l2.action,
          hasEagerState: l2.hasEagerState,
          eagerState: l2.eagerState,
          next: null
        };
        null === k2 ? (h2 = k2 = q2, g2 = d2) : k2 = k2.next = q2;
        M$3.lanes |= m2;
        rh |= m2;
      }
      l2 = l2.next;
    } while (null !== l2 && l2 !== f2);
    null === k2 ? g2 = d2 : k2.next = h2;
    He$1(d2, b2.memoizedState) || (dh = true);
    b2.memoizedState = d2;
    b2.baseState = g2;
    b2.baseQueue = k2;
    c2.lastRenderedState = d2;
  }
  a2 = c2.interleaved;
  if (null !== a2) {
    e2 = a2;
    do
      f2 = e2.lane, M$3.lanes |= f2, rh |= f2, e2 = e2.next;
    while (e2 !== a2);
  } else
    null === e2 && (c2.lanes = 0);
  return [b2.memoizedState, c2.dispatch];
}
function Xh(a2) {
  var b2 = Uh(), c2 = b2.queue;
  if (null === c2)
    throw Error(p$1(311));
  c2.lastRenderedReducer = a2;
  var d2 = c2.dispatch, e2 = c2.pending, f2 = b2.memoizedState;
  if (null !== e2) {
    c2.pending = null;
    var g2 = e2 = e2.next;
    do
      f2 = a2(f2, g2.action), g2 = g2.next;
    while (g2 !== e2);
    He$1(f2, b2.memoizedState) || (dh = true);
    b2.memoizedState = f2;
    null === b2.baseQueue && (b2.baseState = f2);
    c2.lastRenderedState = f2;
  }
  return [f2, d2];
}
function Yh() {
}
function Zh(a2, b2) {
  var c2 = M$3, d2 = Uh(), e2 = b2(), f2 = !He$1(d2.memoizedState, e2);
  f2 && (d2.memoizedState = e2, dh = true);
  d2 = d2.queue;
  $h(ai.bind(null, c2, d2, a2), [a2]);
  if (d2.getSnapshot !== b2 || f2 || null !== O$2 && O$2.memoizedState.tag & 1) {
    c2.flags |= 2048;
    bi(9, ci.bind(null, c2, d2, e2, b2), void 0, null);
    if (null === Q)
      throw Error(p$1(349));
    0 !== (Hh & 30) || di(c2, b2, e2);
  }
  return e2;
}
function di(a2, b2, c2) {
  a2.flags |= 16384;
  a2 = { getSnapshot: b2, value: c2 };
  b2 = M$3.updateQueue;
  null === b2 ? (b2 = { lastEffect: null, stores: null }, M$3.updateQueue = b2, b2.stores = [a2]) : (c2 = b2.stores, null === c2 ? b2.stores = [a2] : c2.push(a2));
}
function ci(a2, b2, c2, d2) {
  b2.value = c2;
  b2.getSnapshot = d2;
  ei(b2) && fi(a2);
}
function ai(a2, b2, c2) {
  return c2(function() {
    ei(b2) && fi(a2);
  });
}
function ei(a2) {
  var b2 = a2.getSnapshot;
  a2 = a2.value;
  try {
    var c2 = b2();
    return !He$1(a2, c2);
  } catch (d2) {
    return true;
  }
}
function fi(a2) {
  var b2 = ih(a2, 1);
  null !== b2 && gi(b2, a2, 1, -1);
}
function hi(a2) {
  var b2 = Th();
  "function" === typeof a2 && (a2 = a2());
  b2.memoizedState = b2.baseState = a2;
  a2 = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a2 };
  b2.queue = a2;
  a2 = a2.dispatch = ii.bind(null, M$3, a2);
  return [b2.memoizedState, a2];
}
function bi(a2, b2, c2, d2) {
  a2 = { tag: a2, create: b2, destroy: c2, deps: d2, next: null };
  b2 = M$3.updateQueue;
  null === b2 ? (b2 = { lastEffect: null, stores: null }, M$3.updateQueue = b2, b2.lastEffect = a2.next = a2) : (c2 = b2.lastEffect, null === c2 ? b2.lastEffect = a2.next = a2 : (d2 = c2.next, c2.next = a2, a2.next = d2, b2.lastEffect = a2));
  return a2;
}
function ji() {
  return Uh().memoizedState;
}
function ki(a2, b2, c2, d2) {
  var e2 = Th();
  M$3.flags |= a2;
  e2.memoizedState = bi(1 | b2, c2, void 0, void 0 === d2 ? null : d2);
}
function li(a2, b2, c2, d2) {
  var e2 = Uh();
  d2 = void 0 === d2 ? null : d2;
  var f2 = void 0;
  if (null !== N$1) {
    var g2 = N$1.memoizedState;
    f2 = g2.destroy;
    if (null !== d2 && Mh(d2, g2.deps)) {
      e2.memoizedState = bi(b2, c2, f2, d2);
      return;
    }
  }
  M$3.flags |= a2;
  e2.memoizedState = bi(1 | b2, c2, f2, d2);
}
function mi(a2, b2) {
  return ki(8390656, 8, a2, b2);
}
function $h(a2, b2) {
  return li(2048, 8, a2, b2);
}
function ni(a2, b2) {
  return li(4, 2, a2, b2);
}
function oi(a2, b2) {
  return li(4, 4, a2, b2);
}
function pi(a2, b2) {
  if ("function" === typeof b2)
    return a2 = a2(), b2(a2), function() {
      b2(null);
    };
  if (null !== b2 && void 0 !== b2)
    return a2 = a2(), b2.current = a2, function() {
      b2.current = null;
    };
}
function qi(a2, b2, c2) {
  c2 = null !== c2 && void 0 !== c2 ? c2.concat([a2]) : null;
  return li(4, 4, pi.bind(null, b2, a2), c2);
}
function ri() {
}
function si(a2, b2) {
  var c2 = Uh();
  b2 = void 0 === b2 ? null : b2;
  var d2 = c2.memoizedState;
  if (null !== d2 && null !== b2 && Mh(b2, d2[1]))
    return d2[0];
  c2.memoizedState = [a2, b2];
  return a2;
}
function ti(a2, b2) {
  var c2 = Uh();
  b2 = void 0 === b2 ? null : b2;
  var d2 = c2.memoizedState;
  if (null !== d2 && null !== b2 && Mh(b2, d2[1]))
    return d2[0];
  a2 = a2();
  c2.memoizedState = [a2, b2];
  return a2;
}
function ui(a2, b2, c2) {
  if (0 === (Hh & 21))
    return a2.baseState && (a2.baseState = false, dh = true), a2.memoizedState = c2;
  He$1(c2, b2) || (c2 = yc(), M$3.lanes |= c2, rh |= c2, a2.baseState = true);
  return b2;
}
function vi(a2, b2) {
  var c2 = C$2;
  C$2 = 0 !== c2 && 4 > c2 ? c2 : 4;
  a2(true);
  var d2 = Gh.transition;
  Gh.transition = {};
  try {
    a2(false), b2();
  } finally {
    C$2 = c2, Gh.transition = d2;
  }
}
function wi() {
  return Uh().memoizedState;
}
function xi(a2, b2, c2) {
  var d2 = yi(a2);
  c2 = { lane: d2, action: c2, hasEagerState: false, eagerState: null, next: null };
  if (zi(a2))
    Ai(b2, c2);
  else if (c2 = hh(a2, b2, c2, d2), null !== c2) {
    var e2 = R$1();
    gi(c2, a2, d2, e2);
    Bi(c2, b2, d2);
  }
}
function ii(a2, b2, c2) {
  var d2 = yi(a2), e2 = { lane: d2, action: c2, hasEagerState: false, eagerState: null, next: null };
  if (zi(a2))
    Ai(b2, e2);
  else {
    var f2 = a2.alternate;
    if (0 === a2.lanes && (null === f2 || 0 === f2.lanes) && (f2 = b2.lastRenderedReducer, null !== f2))
      try {
        var g2 = b2.lastRenderedState, h2 = f2(g2, c2);
        e2.hasEagerState = true;
        e2.eagerState = h2;
        if (He$1(h2, g2)) {
          var k2 = b2.interleaved;
          null === k2 ? (e2.next = e2, gh(b2)) : (e2.next = k2.next, k2.next = e2);
          b2.interleaved = e2;
          return;
        }
      } catch (l2) {
      } finally {
      }
    c2 = hh(a2, b2, e2, d2);
    null !== c2 && (e2 = R$1(), gi(c2, a2, d2, e2), Bi(c2, b2, d2));
  }
}
function zi(a2) {
  var b2 = a2.alternate;
  return a2 === M$3 || null !== b2 && b2 === M$3;
}
function Ai(a2, b2) {
  Jh = Ih = true;
  var c2 = a2.pending;
  null === c2 ? b2.next = b2 : (b2.next = c2.next, c2.next = b2);
  a2.pending = b2;
}
function Bi(a2, b2, c2) {
  if (0 !== (c2 & 4194240)) {
    var d2 = b2.lanes;
    d2 &= a2.pendingLanes;
    c2 |= d2;
    b2.lanes = c2;
    Cc(a2, c2);
  }
}
var Rh = { readContext: eh, useCallback: P, useContext: P, useEffect: P, useImperativeHandle: P, useInsertionEffect: P, useLayoutEffect: P, useMemo: P, useReducer: P, useRef: P, useState: P, useDebugValue: P, useDeferredValue: P, useTransition: P, useMutableSource: P, useSyncExternalStore: P, useId: P, unstable_isNewReconciler: false }, Oh = { readContext: eh, useCallback: function(a2, b2) {
  Th().memoizedState = [a2, void 0 === b2 ? null : b2];
  return a2;
}, useContext: eh, useEffect: mi, useImperativeHandle: function(a2, b2, c2) {
  c2 = null !== c2 && void 0 !== c2 ? c2.concat([a2]) : null;
  return ki(
    4194308,
    4,
    pi.bind(null, b2, a2),
    c2
  );
}, useLayoutEffect: function(a2, b2) {
  return ki(4194308, 4, a2, b2);
}, useInsertionEffect: function(a2, b2) {
  return ki(4, 2, a2, b2);
}, useMemo: function(a2, b2) {
  var c2 = Th();
  b2 = void 0 === b2 ? null : b2;
  a2 = a2();
  c2.memoizedState = [a2, b2];
  return a2;
}, useReducer: function(a2, b2, c2) {
  var d2 = Th();
  b2 = void 0 !== c2 ? c2(b2) : b2;
  d2.memoizedState = d2.baseState = b2;
  a2 = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a2, lastRenderedState: b2 };
  d2.queue = a2;
  a2 = a2.dispatch = xi.bind(null, M$3, a2);
  return [d2.memoizedState, a2];
}, useRef: function(a2) {
  var b2 = Th();
  a2 = { current: a2 };
  return b2.memoizedState = a2;
}, useState: hi, useDebugValue: ri, useDeferredValue: function(a2) {
  return Th().memoizedState = a2;
}, useTransition: function() {
  var a2 = hi(false), b2 = a2[0];
  a2 = vi.bind(null, a2[1]);
  Th().memoizedState = a2;
  return [b2, a2];
}, useMutableSource: function() {
}, useSyncExternalStore: function(a2, b2, c2) {
  var d2 = M$3, e2 = Th();
  if (I$3) {
    if (void 0 === c2)
      throw Error(p$1(407));
    c2 = c2();
  } else {
    c2 = b2();
    if (null === Q)
      throw Error(p$1(349));
    0 !== (Hh & 30) || di(d2, b2, c2);
  }
  e2.memoizedState = c2;
  var f2 = { value: c2, getSnapshot: b2 };
  e2.queue = f2;
  mi(ai.bind(
    null,
    d2,
    f2,
    a2
  ), [a2]);
  d2.flags |= 2048;
  bi(9, ci.bind(null, d2, f2, c2, b2), void 0, null);
  return c2;
}, useId: function() {
  var a2 = Th(), b2 = Q.identifierPrefix;
  if (I$3) {
    var c2 = sg;
    var d2 = rg;
    c2 = (d2 & ~(1 << 32 - oc(d2) - 1)).toString(32) + c2;
    b2 = ":" + b2 + "R" + c2;
    c2 = Kh++;
    0 < c2 && (b2 += "H" + c2.toString(32));
    b2 += ":";
  } else
    c2 = Lh++, b2 = ":" + b2 + "r" + c2.toString(32) + ":";
  return a2.memoizedState = b2;
}, unstable_isNewReconciler: false }, Ph = {
  readContext: eh,
  useCallback: si,
  useContext: eh,
  useEffect: $h,
  useImperativeHandle: qi,
  useInsertionEffect: ni,
  useLayoutEffect: oi,
  useMemo: ti,
  useReducer: Wh,
  useRef: ji,
  useState: function() {
    return Wh(Vh);
  },
  useDebugValue: ri,
  useDeferredValue: function(a2) {
    var b2 = Uh();
    return ui(b2, N$1.memoizedState, a2);
  },
  useTransition: function() {
    var a2 = Wh(Vh)[0], b2 = Uh().memoizedState;
    return [a2, b2];
  },
  useMutableSource: Yh,
  useSyncExternalStore: Zh,
  useId: wi,
  unstable_isNewReconciler: false
}, Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
  return Xh(Vh);
}, useDebugValue: ri, useDeferredValue: function(a2) {
  var b2 = Uh();
  return null === N$1 ? b2.memoizedState = a2 : ui(b2, N$1.memoizedState, a2);
}, useTransition: function() {
  var a2 = Xh(Vh)[0], b2 = Uh().memoizedState;
  return [a2, b2];
}, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
function Ci(a2, b2) {
  if (a2 && a2.defaultProps) {
    b2 = A({}, b2);
    a2 = a2.defaultProps;
    for (var c2 in a2)
      void 0 === b2[c2] && (b2[c2] = a2[c2]);
    return b2;
  }
  return b2;
}
function Di(a2, b2, c2, d2) {
  b2 = a2.memoizedState;
  c2 = c2(d2, b2);
  c2 = null === c2 || void 0 === c2 ? b2 : A({}, b2, c2);
  a2.memoizedState = c2;
  0 === a2.lanes && (a2.updateQueue.baseState = c2);
}
var Ei = { isMounted: function(a2) {
  return (a2 = a2._reactInternals) ? Vb(a2) === a2 : false;
}, enqueueSetState: function(a2, b2, c2) {
  a2 = a2._reactInternals;
  var d2 = R$1(), e2 = yi(a2), f2 = mh(d2, e2);
  f2.payload = b2;
  void 0 !== c2 && null !== c2 && (f2.callback = c2);
  b2 = nh(a2, f2, e2);
  null !== b2 && (gi(b2, a2, e2, d2), oh(b2, a2, e2));
}, enqueueReplaceState: function(a2, b2, c2) {
  a2 = a2._reactInternals;
  var d2 = R$1(), e2 = yi(a2), f2 = mh(d2, e2);
  f2.tag = 1;
  f2.payload = b2;
  void 0 !== c2 && null !== c2 && (f2.callback = c2);
  b2 = nh(a2, f2, e2);
  null !== b2 && (gi(b2, a2, e2, d2), oh(b2, a2, e2));
}, enqueueForceUpdate: function(a2, b2) {
  a2 = a2._reactInternals;
  var c2 = R$1(), d2 = yi(a2), e2 = mh(c2, d2);
  e2.tag = 2;
  void 0 !== b2 && null !== b2 && (e2.callback = b2);
  b2 = nh(a2, e2, d2);
  null !== b2 && (gi(b2, a2, d2, c2), oh(b2, a2, d2));
} };
function Fi(a2, b2, c2, d2, e2, f2, g2) {
  a2 = a2.stateNode;
  return "function" === typeof a2.shouldComponentUpdate ? a2.shouldComponentUpdate(d2, f2, g2) : b2.prototype && b2.prototype.isPureReactComponent ? !Ie$1(c2, d2) || !Ie$1(e2, f2) : true;
}
function Gi(a2, b2, c2) {
  var d2 = false, e2 = Vf;
  var f2 = b2.contextType;
  "object" === typeof f2 && null !== f2 ? f2 = eh(f2) : (e2 = Zf(b2) ? Xf : H$1.current, d2 = b2.contextTypes, f2 = (d2 = null !== d2 && void 0 !== d2) ? Yf(a2, e2) : Vf);
  b2 = new b2(c2, f2);
  a2.memoizedState = null !== b2.state && void 0 !== b2.state ? b2.state : null;
  b2.updater = Ei;
  a2.stateNode = b2;
  b2._reactInternals = a2;
  d2 && (a2 = a2.stateNode, a2.__reactInternalMemoizedUnmaskedChildContext = e2, a2.__reactInternalMemoizedMaskedChildContext = f2);
  return b2;
}
function Hi(a2, b2, c2, d2) {
  a2 = b2.state;
  "function" === typeof b2.componentWillReceiveProps && b2.componentWillReceiveProps(c2, d2);
  "function" === typeof b2.UNSAFE_componentWillReceiveProps && b2.UNSAFE_componentWillReceiveProps(c2, d2);
  b2.state !== a2 && Ei.enqueueReplaceState(b2, b2.state, null);
}
function Ii(a2, b2, c2, d2) {
  var e2 = a2.stateNode;
  e2.props = c2;
  e2.state = a2.memoizedState;
  e2.refs = {};
  kh(a2);
  var f2 = b2.contextType;
  "object" === typeof f2 && null !== f2 ? e2.context = eh(f2) : (f2 = Zf(b2) ? Xf : H$1.current, e2.context = Yf(a2, f2));
  e2.state = a2.memoizedState;
  f2 = b2.getDerivedStateFromProps;
  "function" === typeof f2 && (Di(a2, b2, f2, c2), e2.state = a2.memoizedState);
  "function" === typeof b2.getDerivedStateFromProps || "function" === typeof e2.getSnapshotBeforeUpdate || "function" !== typeof e2.UNSAFE_componentWillMount && "function" !== typeof e2.componentWillMount || (b2 = e2.state, "function" === typeof e2.componentWillMount && e2.componentWillMount(), "function" === typeof e2.UNSAFE_componentWillMount && e2.UNSAFE_componentWillMount(), b2 !== e2.state && Ei.enqueueReplaceState(e2, e2.state, null), qh(a2, c2, e2, d2), e2.state = a2.memoizedState);
  "function" === typeof e2.componentDidMount && (a2.flags |= 4194308);
}
function Ji(a2, b2) {
  try {
    var c2 = "", d2 = b2;
    do
      c2 += Pa(d2), d2 = d2.return;
    while (d2);
    var e2 = c2;
  } catch (f2) {
    e2 = "\nError generating stack: " + f2.message + "\n" + f2.stack;
  }
  return { value: a2, source: b2, stack: e2, digest: null };
}
function Ki(a2, b2, c2) {
  return { value: a2, source: null, stack: null != c2 ? c2 : null, digest: null != b2 ? b2 : null };
}
function Li(a2, b2) {
  try {
    console.error(b2.value);
  } catch (c2) {
    setTimeout(function() {
      throw c2;
    });
  }
}
var Mi = "function" === typeof WeakMap ? WeakMap : Map;
function Ni(a2, b2, c2) {
  c2 = mh(-1, c2);
  c2.tag = 3;
  c2.payload = { element: null };
  var d2 = b2.value;
  c2.callback = function() {
    Oi || (Oi = true, Pi = d2);
    Li(a2, b2);
  };
  return c2;
}
function Qi(a2, b2, c2) {
  c2 = mh(-1, c2);
  c2.tag = 3;
  var d2 = a2.type.getDerivedStateFromError;
  if ("function" === typeof d2) {
    var e2 = b2.value;
    c2.payload = function() {
      return d2(e2);
    };
    c2.callback = function() {
      Li(a2, b2);
    };
  }
  var f2 = a2.stateNode;
  null !== f2 && "function" === typeof f2.componentDidCatch && (c2.callback = function() {
    Li(a2, b2);
    "function" !== typeof d2 && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
    var c3 = b2.stack;
    this.componentDidCatch(b2.value, { componentStack: null !== c3 ? c3 : "" });
  });
  return c2;
}
function Si(a2, b2, c2) {
  var d2 = a2.pingCache;
  if (null === d2) {
    d2 = a2.pingCache = new Mi();
    var e2 = /* @__PURE__ */ new Set();
    d2.set(b2, e2);
  } else
    e2 = d2.get(b2), void 0 === e2 && (e2 = /* @__PURE__ */ new Set(), d2.set(b2, e2));
  e2.has(c2) || (e2.add(c2), a2 = Ti.bind(null, a2, b2, c2), b2.then(a2, a2));
}
function Ui(a2) {
  do {
    var b2;
    if (b2 = 13 === a2.tag)
      b2 = a2.memoizedState, b2 = null !== b2 ? null !== b2.dehydrated ? true : false : true;
    if (b2)
      return a2;
    a2 = a2.return;
  } while (null !== a2);
  return null;
}
function Vi(a2, b2, c2, d2, e2) {
  if (0 === (a2.mode & 1))
    return a2 === b2 ? a2.flags |= 65536 : (a2.flags |= 128, c2.flags |= 131072, c2.flags &= -52805, 1 === c2.tag && (null === c2.alternate ? c2.tag = 17 : (b2 = mh(-1, 1), b2.tag = 2, nh(c2, b2, 1))), c2.lanes |= 1), a2;
  a2.flags |= 65536;
  a2.lanes = e2;
  return a2;
}
var Wi = ua.ReactCurrentOwner, dh = false;
function Xi(a2, b2, c2, d2) {
  b2.child = null === a2 ? Vg(b2, null, c2, d2) : Ug(b2, a2.child, c2, d2);
}
function Yi(a2, b2, c2, d2, e2) {
  c2 = c2.render;
  var f2 = b2.ref;
  ch(b2, e2);
  d2 = Nh(a2, b2, c2, d2, f2, e2);
  c2 = Sh();
  if (null !== a2 && !dh)
    return b2.updateQueue = a2.updateQueue, b2.flags &= -2053, a2.lanes &= ~e2, Zi(a2, b2, e2);
  I$3 && c2 && vg(b2);
  b2.flags |= 1;
  Xi(a2, b2, d2, e2);
  return b2.child;
}
function $i(a2, b2, c2, d2, e2) {
  if (null === a2) {
    var f2 = c2.type;
    if ("function" === typeof f2 && !aj(f2) && void 0 === f2.defaultProps && null === c2.compare && void 0 === c2.defaultProps)
      return b2.tag = 15, b2.type = f2, bj(a2, b2, f2, d2, e2);
    a2 = Rg(c2.type, null, d2, b2, b2.mode, e2);
    a2.ref = b2.ref;
    a2.return = b2;
    return b2.child = a2;
  }
  f2 = a2.child;
  if (0 === (a2.lanes & e2)) {
    var g2 = f2.memoizedProps;
    c2 = c2.compare;
    c2 = null !== c2 ? c2 : Ie$1;
    if (c2(g2, d2) && a2.ref === b2.ref)
      return Zi(a2, b2, e2);
  }
  b2.flags |= 1;
  a2 = Pg(f2, d2);
  a2.ref = b2.ref;
  a2.return = b2;
  return b2.child = a2;
}
function bj(a2, b2, c2, d2, e2) {
  if (null !== a2) {
    var f2 = a2.memoizedProps;
    if (Ie$1(f2, d2) && a2.ref === b2.ref)
      if (dh = false, b2.pendingProps = d2 = f2, 0 !== (a2.lanes & e2))
        0 !== (a2.flags & 131072) && (dh = true);
      else
        return b2.lanes = a2.lanes, Zi(a2, b2, e2);
  }
  return cj(a2, b2, c2, d2, e2);
}
function dj(a2, b2, c2) {
  var d2 = b2.pendingProps, e2 = d2.children, f2 = null !== a2 ? a2.memoizedState : null;
  if ("hidden" === d2.mode)
    if (0 === (b2.mode & 1))
      b2.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c2;
    else {
      if (0 === (c2 & 1073741824))
        return a2 = null !== f2 ? f2.baseLanes | c2 : c2, b2.lanes = b2.childLanes = 1073741824, b2.memoizedState = { baseLanes: a2, cachePool: null, transitions: null }, b2.updateQueue = null, G(ej, fj), fj |= a2, null;
      b2.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
      d2 = null !== f2 ? f2.baseLanes : c2;
      G(ej, fj);
      fj |= d2;
    }
  else
    null !== f2 ? (d2 = f2.baseLanes | c2, b2.memoizedState = null) : d2 = c2, G(ej, fj), fj |= d2;
  Xi(a2, b2, e2, c2);
  return b2.child;
}
function gj(a2, b2) {
  var c2 = b2.ref;
  if (null === a2 && null !== c2 || null !== a2 && a2.ref !== c2)
    b2.flags |= 512, b2.flags |= 2097152;
}
function cj(a2, b2, c2, d2, e2) {
  var f2 = Zf(c2) ? Xf : H$1.current;
  f2 = Yf(b2, f2);
  ch(b2, e2);
  c2 = Nh(a2, b2, c2, d2, f2, e2);
  d2 = Sh();
  if (null !== a2 && !dh)
    return b2.updateQueue = a2.updateQueue, b2.flags &= -2053, a2.lanes &= ~e2, Zi(a2, b2, e2);
  I$3 && d2 && vg(b2);
  b2.flags |= 1;
  Xi(a2, b2, c2, e2);
  return b2.child;
}
function hj(a2, b2, c2, d2, e2) {
  if (Zf(c2)) {
    var f2 = true;
    cg(b2);
  } else
    f2 = false;
  ch(b2, e2);
  if (null === b2.stateNode)
    ij(a2, b2), Gi(b2, c2, d2), Ii(b2, c2, d2, e2), d2 = true;
  else if (null === a2) {
    var g2 = b2.stateNode, h2 = b2.memoizedProps;
    g2.props = h2;
    var k2 = g2.context, l2 = c2.contextType;
    "object" === typeof l2 && null !== l2 ? l2 = eh(l2) : (l2 = Zf(c2) ? Xf : H$1.current, l2 = Yf(b2, l2));
    var m2 = c2.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g2.getSnapshotBeforeUpdate;
    q2 || "function" !== typeof g2.UNSAFE_componentWillReceiveProps && "function" !== typeof g2.componentWillReceiveProps || (h2 !== d2 || k2 !== l2) && Hi(b2, g2, d2, l2);
    jh = false;
    var r2 = b2.memoizedState;
    g2.state = r2;
    qh(b2, d2, g2, e2);
    k2 = b2.memoizedState;
    h2 !== d2 || r2 !== k2 || Wf.current || jh ? ("function" === typeof m2 && (Di(b2, c2, m2, d2), k2 = b2.memoizedState), (h2 = jh || Fi(b2, c2, h2, d2, r2, k2, l2)) ? (q2 || "function" !== typeof g2.UNSAFE_componentWillMount && "function" !== typeof g2.componentWillMount || ("function" === typeof g2.componentWillMount && g2.componentWillMount(), "function" === typeof g2.UNSAFE_componentWillMount && g2.UNSAFE_componentWillMount()), "function" === typeof g2.componentDidMount && (b2.flags |= 4194308)) : ("function" === typeof g2.componentDidMount && (b2.flags |= 4194308), b2.memoizedProps = d2, b2.memoizedState = k2), g2.props = d2, g2.state = k2, g2.context = l2, d2 = h2) : ("function" === typeof g2.componentDidMount && (b2.flags |= 4194308), d2 = false);
  } else {
    g2 = b2.stateNode;
    lh(a2, b2);
    h2 = b2.memoizedProps;
    l2 = b2.type === b2.elementType ? h2 : Ci(b2.type, h2);
    g2.props = l2;
    q2 = b2.pendingProps;
    r2 = g2.context;
    k2 = c2.contextType;
    "object" === typeof k2 && null !== k2 ? k2 = eh(k2) : (k2 = Zf(c2) ? Xf : H$1.current, k2 = Yf(b2, k2));
    var y2 = c2.getDerivedStateFromProps;
    (m2 = "function" === typeof y2 || "function" === typeof g2.getSnapshotBeforeUpdate) || "function" !== typeof g2.UNSAFE_componentWillReceiveProps && "function" !== typeof g2.componentWillReceiveProps || (h2 !== q2 || r2 !== k2) && Hi(b2, g2, d2, k2);
    jh = false;
    r2 = b2.memoizedState;
    g2.state = r2;
    qh(b2, d2, g2, e2);
    var n2 = b2.memoizedState;
    h2 !== q2 || r2 !== n2 || Wf.current || jh ? ("function" === typeof y2 && (Di(b2, c2, y2, d2), n2 = b2.memoizedState), (l2 = jh || Fi(b2, c2, l2, d2, r2, n2, k2) || false) ? (m2 || "function" !== typeof g2.UNSAFE_componentWillUpdate && "function" !== typeof g2.componentWillUpdate || ("function" === typeof g2.componentWillUpdate && g2.componentWillUpdate(d2, n2, k2), "function" === typeof g2.UNSAFE_componentWillUpdate && g2.UNSAFE_componentWillUpdate(d2, n2, k2)), "function" === typeof g2.componentDidUpdate && (b2.flags |= 4), "function" === typeof g2.getSnapshotBeforeUpdate && (b2.flags |= 1024)) : ("function" !== typeof g2.componentDidUpdate || h2 === a2.memoizedProps && r2 === a2.memoizedState || (b2.flags |= 4), "function" !== typeof g2.getSnapshotBeforeUpdate || h2 === a2.memoizedProps && r2 === a2.memoizedState || (b2.flags |= 1024), b2.memoizedProps = d2, b2.memoizedState = n2), g2.props = d2, g2.state = n2, g2.context = k2, d2 = l2) : ("function" !== typeof g2.componentDidUpdate || h2 === a2.memoizedProps && r2 === a2.memoizedState || (b2.flags |= 4), "function" !== typeof g2.getSnapshotBeforeUpdate || h2 === a2.memoizedProps && r2 === a2.memoizedState || (b2.flags |= 1024), d2 = false);
  }
  return jj(a2, b2, c2, d2, f2, e2);
}
function jj(a2, b2, c2, d2, e2, f2) {
  gj(a2, b2);
  var g2 = 0 !== (b2.flags & 128);
  if (!d2 && !g2)
    return e2 && dg(b2, c2, false), Zi(a2, b2, f2);
  d2 = b2.stateNode;
  Wi.current = b2;
  var h2 = g2 && "function" !== typeof c2.getDerivedStateFromError ? null : d2.render();
  b2.flags |= 1;
  null !== a2 && g2 ? (b2.child = Ug(b2, a2.child, null, f2), b2.child = Ug(b2, null, h2, f2)) : Xi(a2, b2, h2, f2);
  b2.memoizedState = d2.state;
  e2 && dg(b2, c2, true);
  return b2.child;
}
function kj(a2) {
  var b2 = a2.stateNode;
  b2.pendingContext ? ag(a2, b2.pendingContext, b2.pendingContext !== b2.context) : b2.context && ag(a2, b2.context, false);
  yh(a2, b2.containerInfo);
}
function lj(a2, b2, c2, d2, e2) {
  Ig();
  Jg(e2);
  b2.flags |= 256;
  Xi(a2, b2, c2, d2);
  return b2.child;
}
var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
function nj(a2) {
  return { baseLanes: a2, cachePool: null, transitions: null };
}
function oj(a2, b2, c2) {
  var d2 = b2.pendingProps, e2 = L.current, f2 = false, g2 = 0 !== (b2.flags & 128), h2;
  (h2 = g2) || (h2 = null !== a2 && null === a2.memoizedState ? false : 0 !== (e2 & 2));
  if (h2)
    f2 = true, b2.flags &= -129;
  else if (null === a2 || null !== a2.memoizedState)
    e2 |= 1;
  G(L, e2 & 1);
  if (null === a2) {
    Eg(b2);
    a2 = b2.memoizedState;
    if (null !== a2 && (a2 = a2.dehydrated, null !== a2))
      return 0 === (b2.mode & 1) ? b2.lanes = 1 : "$!" === a2.data ? b2.lanes = 8 : b2.lanes = 1073741824, null;
    g2 = d2.children;
    a2 = d2.fallback;
    return f2 ? (d2 = b2.mode, f2 = b2.child, g2 = { mode: "hidden", children: g2 }, 0 === (d2 & 1) && null !== f2 ? (f2.childLanes = 0, f2.pendingProps = g2) : f2 = pj(g2, d2, 0, null), a2 = Tg(a2, d2, c2, null), f2.return = b2, a2.return = b2, f2.sibling = a2, b2.child = f2, b2.child.memoizedState = nj(c2), b2.memoizedState = mj, a2) : qj(b2, g2);
  }
  e2 = a2.memoizedState;
  if (null !== e2 && (h2 = e2.dehydrated, null !== h2))
    return rj(a2, b2, g2, d2, h2, e2, c2);
  if (f2) {
    f2 = d2.fallback;
    g2 = b2.mode;
    e2 = a2.child;
    h2 = e2.sibling;
    var k2 = { mode: "hidden", children: d2.children };
    0 === (g2 & 1) && b2.child !== e2 ? (d2 = b2.child, d2.childLanes = 0, d2.pendingProps = k2, b2.deletions = null) : (d2 = Pg(e2, k2), d2.subtreeFlags = e2.subtreeFlags & 14680064);
    null !== h2 ? f2 = Pg(h2, f2) : (f2 = Tg(f2, g2, c2, null), f2.flags |= 2);
    f2.return = b2;
    d2.return = b2;
    d2.sibling = f2;
    b2.child = d2;
    d2 = f2;
    f2 = b2.child;
    g2 = a2.child.memoizedState;
    g2 = null === g2 ? nj(c2) : { baseLanes: g2.baseLanes | c2, cachePool: null, transitions: g2.transitions };
    f2.memoizedState = g2;
    f2.childLanes = a2.childLanes & ~c2;
    b2.memoizedState = mj;
    return d2;
  }
  f2 = a2.child;
  a2 = f2.sibling;
  d2 = Pg(f2, { mode: "visible", children: d2.children });
  0 === (b2.mode & 1) && (d2.lanes = c2);
  d2.return = b2;
  d2.sibling = null;
  null !== a2 && (c2 = b2.deletions, null === c2 ? (b2.deletions = [a2], b2.flags |= 16) : c2.push(a2));
  b2.child = d2;
  b2.memoizedState = null;
  return d2;
}
function qj(a2, b2) {
  b2 = pj({ mode: "visible", children: b2 }, a2.mode, 0, null);
  b2.return = a2;
  return a2.child = b2;
}
function sj(a2, b2, c2, d2) {
  null !== d2 && Jg(d2);
  Ug(b2, a2.child, null, c2);
  a2 = qj(b2, b2.pendingProps.children);
  a2.flags |= 2;
  b2.memoizedState = null;
  return a2;
}
function rj(a2, b2, c2, d2, e2, f2, g2) {
  if (c2) {
    if (b2.flags & 256)
      return b2.flags &= -257, d2 = Ki(Error(p$1(422))), sj(a2, b2, g2, d2);
    if (null !== b2.memoizedState)
      return b2.child = a2.child, b2.flags |= 128, null;
    f2 = d2.fallback;
    e2 = b2.mode;
    d2 = pj({ mode: "visible", children: d2.children }, e2, 0, null);
    f2 = Tg(f2, e2, g2, null);
    f2.flags |= 2;
    d2.return = b2;
    f2.return = b2;
    d2.sibling = f2;
    b2.child = d2;
    0 !== (b2.mode & 1) && Ug(b2, a2.child, null, g2);
    b2.child.memoizedState = nj(g2);
    b2.memoizedState = mj;
    return f2;
  }
  if (0 === (b2.mode & 1))
    return sj(a2, b2, g2, null);
  if ("$!" === e2.data) {
    d2 = e2.nextSibling && e2.nextSibling.dataset;
    if (d2)
      var h2 = d2.dgst;
    d2 = h2;
    f2 = Error(p$1(419));
    d2 = Ki(f2, d2, void 0);
    return sj(a2, b2, g2, d2);
  }
  h2 = 0 !== (g2 & a2.childLanes);
  if (dh || h2) {
    d2 = Q;
    if (null !== d2) {
      switch (g2 & -g2) {
        case 4:
          e2 = 2;
          break;
        case 16:
          e2 = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          e2 = 32;
          break;
        case 536870912:
          e2 = 268435456;
          break;
        default:
          e2 = 0;
      }
      e2 = 0 !== (e2 & (d2.suspendedLanes | g2)) ? 0 : e2;
      0 !== e2 && e2 !== f2.retryLane && (f2.retryLane = e2, ih(a2, e2), gi(d2, a2, e2, -1));
    }
    tj();
    d2 = Ki(Error(p$1(421)));
    return sj(a2, b2, g2, d2);
  }
  if ("$?" === e2.data)
    return b2.flags |= 128, b2.child = a2.child, b2 = uj.bind(null, a2), e2._reactRetry = b2, null;
  a2 = f2.treeContext;
  yg = Lf(e2.nextSibling);
  xg = b2;
  I$3 = true;
  zg = null;
  null !== a2 && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a2.id, sg = a2.overflow, qg = b2);
  b2 = qj(b2, d2.children);
  b2.flags |= 4096;
  return b2;
}
function vj(a2, b2, c2) {
  a2.lanes |= b2;
  var d2 = a2.alternate;
  null !== d2 && (d2.lanes |= b2);
  bh(a2.return, b2, c2);
}
function wj(a2, b2, c2, d2, e2) {
  var f2 = a2.memoizedState;
  null === f2 ? a2.memoizedState = { isBackwards: b2, rendering: null, renderingStartTime: 0, last: d2, tail: c2, tailMode: e2 } : (f2.isBackwards = b2, f2.rendering = null, f2.renderingStartTime = 0, f2.last = d2, f2.tail = c2, f2.tailMode = e2);
}
function xj(a2, b2, c2) {
  var d2 = b2.pendingProps, e2 = d2.revealOrder, f2 = d2.tail;
  Xi(a2, b2, d2.children, c2);
  d2 = L.current;
  if (0 !== (d2 & 2))
    d2 = d2 & 1 | 2, b2.flags |= 128;
  else {
    if (null !== a2 && 0 !== (a2.flags & 128))
      a:
        for (a2 = b2.child; null !== a2; ) {
          if (13 === a2.tag)
            null !== a2.memoizedState && vj(a2, c2, b2);
          else if (19 === a2.tag)
            vj(a2, c2, b2);
          else if (null !== a2.child) {
            a2.child.return = a2;
            a2 = a2.child;
            continue;
          }
          if (a2 === b2)
            break a;
          for (; null === a2.sibling; ) {
            if (null === a2.return || a2.return === b2)
              break a;
            a2 = a2.return;
          }
          a2.sibling.return = a2.return;
          a2 = a2.sibling;
        }
    d2 &= 1;
  }
  G(L, d2);
  if (0 === (b2.mode & 1))
    b2.memoizedState = null;
  else
    switch (e2) {
      case "forwards":
        c2 = b2.child;
        for (e2 = null; null !== c2; )
          a2 = c2.alternate, null !== a2 && null === Ch(a2) && (e2 = c2), c2 = c2.sibling;
        c2 = e2;
        null === c2 ? (e2 = b2.child, b2.child = null) : (e2 = c2.sibling, c2.sibling = null);
        wj(b2, false, e2, c2, f2);
        break;
      case "backwards":
        c2 = null;
        e2 = b2.child;
        for (b2.child = null; null !== e2; ) {
          a2 = e2.alternate;
          if (null !== a2 && null === Ch(a2)) {
            b2.child = e2;
            break;
          }
          a2 = e2.sibling;
          e2.sibling = c2;
          c2 = e2;
          e2 = a2;
        }
        wj(b2, true, c2, null, f2);
        break;
      case "together":
        wj(b2, false, null, null, void 0);
        break;
      default:
        b2.memoizedState = null;
    }
  return b2.child;
}
function ij(a2, b2) {
  0 === (b2.mode & 1) && null !== a2 && (a2.alternate = null, b2.alternate = null, b2.flags |= 2);
}
function Zi(a2, b2, c2) {
  null !== a2 && (b2.dependencies = a2.dependencies);
  rh |= b2.lanes;
  if (0 === (c2 & b2.childLanes))
    return null;
  if (null !== a2 && b2.child !== a2.child)
    throw Error(p$1(153));
  if (null !== b2.child) {
    a2 = b2.child;
    c2 = Pg(a2, a2.pendingProps);
    b2.child = c2;
    for (c2.return = b2; null !== a2.sibling; )
      a2 = a2.sibling, c2 = c2.sibling = Pg(a2, a2.pendingProps), c2.return = b2;
    c2.sibling = null;
  }
  return b2.child;
}
function yj(a2, b2, c2) {
  switch (b2.tag) {
    case 3:
      kj(b2);
      Ig();
      break;
    case 5:
      Ah(b2);
      break;
    case 1:
      Zf(b2.type) && cg(b2);
      break;
    case 4:
      yh(b2, b2.stateNode.containerInfo);
      break;
    case 10:
      var d2 = b2.type._context, e2 = b2.memoizedProps.value;
      G(Wg, d2._currentValue);
      d2._currentValue = e2;
      break;
    case 13:
      d2 = b2.memoizedState;
      if (null !== d2) {
        if (null !== d2.dehydrated)
          return G(L, L.current & 1), b2.flags |= 128, null;
        if (0 !== (c2 & b2.child.childLanes))
          return oj(a2, b2, c2);
        G(L, L.current & 1);
        a2 = Zi(a2, b2, c2);
        return null !== a2 ? a2.sibling : null;
      }
      G(L, L.current & 1);
      break;
    case 19:
      d2 = 0 !== (c2 & b2.childLanes);
      if (0 !== (a2.flags & 128)) {
        if (d2)
          return xj(a2, b2, c2);
        b2.flags |= 128;
      }
      e2 = b2.memoizedState;
      null !== e2 && (e2.rendering = null, e2.tail = null, e2.lastEffect = null);
      G(L, L.current);
      if (d2)
        break;
      else
        return null;
    case 22:
    case 23:
      return b2.lanes = 0, dj(a2, b2, c2);
  }
  return Zi(a2, b2, c2);
}
var zj, Aj, Bj, Cj;
zj = function(a2, b2) {
  for (var c2 = b2.child; null !== c2; ) {
    if (5 === c2.tag || 6 === c2.tag)
      a2.appendChild(c2.stateNode);
    else if (4 !== c2.tag && null !== c2.child) {
      c2.child.return = c2;
      c2 = c2.child;
      continue;
    }
    if (c2 === b2)
      break;
    for (; null === c2.sibling; ) {
      if (null === c2.return || c2.return === b2)
        return;
      c2 = c2.return;
    }
    c2.sibling.return = c2.return;
    c2 = c2.sibling;
  }
};
Aj = function() {
};
Bj = function(a2, b2, c2, d2) {
  var e2 = a2.memoizedProps;
  if (e2 !== d2) {
    a2 = b2.stateNode;
    xh(uh.current);
    var f2 = null;
    switch (c2) {
      case "input":
        e2 = Ya(a2, e2);
        d2 = Ya(a2, d2);
        f2 = [];
        break;
      case "select":
        e2 = A({}, e2, { value: void 0 });
        d2 = A({}, d2, { value: void 0 });
        f2 = [];
        break;
      case "textarea":
        e2 = gb(a2, e2);
        d2 = gb(a2, d2);
        f2 = [];
        break;
      default:
        "function" !== typeof e2.onClick && "function" === typeof d2.onClick && (a2.onclick = Bf);
    }
    ub(c2, d2);
    var g2;
    c2 = null;
    for (l2 in e2)
      if (!d2.hasOwnProperty(l2) && e2.hasOwnProperty(l2) && null != e2[l2])
        if ("style" === l2) {
          var h2 = e2[l2];
          for (g2 in h2)
            h2.hasOwnProperty(g2) && (c2 || (c2 = {}), c2[g2] = "");
        } else
          "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f2 || (f2 = []) : (f2 = f2 || []).push(l2, null));
    for (l2 in d2) {
      var k2 = d2[l2];
      h2 = null != e2 ? e2[l2] : void 0;
      if (d2.hasOwnProperty(l2) && k2 !== h2 && (null != k2 || null != h2))
        if ("style" === l2)
          if (h2) {
            for (g2 in h2)
              !h2.hasOwnProperty(g2) || k2 && k2.hasOwnProperty(g2) || (c2 || (c2 = {}), c2[g2] = "");
            for (g2 in k2)
              k2.hasOwnProperty(g2) && h2[g2] !== k2[g2] && (c2 || (c2 = {}), c2[g2] = k2[g2]);
          } else
            c2 || (f2 || (f2 = []), f2.push(
              l2,
              c2
            )), c2 = k2;
        else
          "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h2 = h2 ? h2.__html : void 0, null != k2 && h2 !== k2 && (f2 = f2 || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f2 = f2 || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D$2("scroll", a2), f2 || h2 === k2 || (f2 = [])) : (f2 = f2 || []).push(l2, k2));
    }
    c2 && (f2 = f2 || []).push("style", c2);
    var l2 = f2;
    if (b2.updateQueue = l2)
      b2.flags |= 4;
  }
};
Cj = function(a2, b2, c2, d2) {
  c2 !== d2 && (b2.flags |= 4);
};
function Dj(a2, b2) {
  if (!I$3)
    switch (a2.tailMode) {
      case "hidden":
        b2 = a2.tail;
        for (var c2 = null; null !== b2; )
          null !== b2.alternate && (c2 = b2), b2 = b2.sibling;
        null === c2 ? a2.tail = null : c2.sibling = null;
        break;
      case "collapsed":
        c2 = a2.tail;
        for (var d2 = null; null !== c2; )
          null !== c2.alternate && (d2 = c2), c2 = c2.sibling;
        null === d2 ? b2 || null === a2.tail ? a2.tail = null : a2.tail.sibling = null : d2.sibling = null;
    }
}
function S$2(a2) {
  var b2 = null !== a2.alternate && a2.alternate.child === a2.child, c2 = 0, d2 = 0;
  if (b2)
    for (var e2 = a2.child; null !== e2; )
      c2 |= e2.lanes | e2.childLanes, d2 |= e2.subtreeFlags & 14680064, d2 |= e2.flags & 14680064, e2.return = a2, e2 = e2.sibling;
  else
    for (e2 = a2.child; null !== e2; )
      c2 |= e2.lanes | e2.childLanes, d2 |= e2.subtreeFlags, d2 |= e2.flags, e2.return = a2, e2 = e2.sibling;
  a2.subtreeFlags |= d2;
  a2.childLanes = c2;
  return b2;
}
function Ej(a2, b2, c2) {
  var d2 = b2.pendingProps;
  wg(b2);
  switch (b2.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return S$2(b2), null;
    case 1:
      return Zf(b2.type) && $f(), S$2(b2), null;
    case 3:
      d2 = b2.stateNode;
      zh();
      E(Wf);
      E(H$1);
      Eh();
      d2.pendingContext && (d2.context = d2.pendingContext, d2.pendingContext = null);
      if (null === a2 || null === a2.child)
        Gg(b2) ? b2.flags |= 4 : null === a2 || a2.memoizedState.isDehydrated && 0 === (b2.flags & 256) || (b2.flags |= 1024, null !== zg && (Fj(zg), zg = null));
      Aj(a2, b2);
      S$2(b2);
      return null;
    case 5:
      Bh(b2);
      var e2 = xh(wh.current);
      c2 = b2.type;
      if (null !== a2 && null != b2.stateNode)
        Bj(a2, b2, c2, d2, e2), a2.ref !== b2.ref && (b2.flags |= 512, b2.flags |= 2097152);
      else {
        if (!d2) {
          if (null === b2.stateNode)
            throw Error(p$1(166));
          S$2(b2);
          return null;
        }
        a2 = xh(uh.current);
        if (Gg(b2)) {
          d2 = b2.stateNode;
          c2 = b2.type;
          var f2 = b2.memoizedProps;
          d2[Of] = b2;
          d2[Pf] = f2;
          a2 = 0 !== (b2.mode & 1);
          switch (c2) {
            case "dialog":
              D$2("cancel", d2);
              D$2("close", d2);
              break;
            case "iframe":
            case "object":
            case "embed":
              D$2("load", d2);
              break;
            case "video":
            case "audio":
              for (e2 = 0; e2 < lf.length; e2++)
                D$2(lf[e2], d2);
              break;
            case "source":
              D$2("error", d2);
              break;
            case "img":
            case "image":
            case "link":
              D$2(
                "error",
                d2
              );
              D$2("load", d2);
              break;
            case "details":
              D$2("toggle", d2);
              break;
            case "input":
              Za(d2, f2);
              D$2("invalid", d2);
              break;
            case "select":
              d2._wrapperState = { wasMultiple: !!f2.multiple };
              D$2("invalid", d2);
              break;
            case "textarea":
              hb(d2, f2), D$2("invalid", d2);
          }
          ub(c2, f2);
          e2 = null;
          for (var g2 in f2)
            if (f2.hasOwnProperty(g2)) {
              var h2 = f2[g2];
              "children" === g2 ? "string" === typeof h2 ? d2.textContent !== h2 && (true !== f2.suppressHydrationWarning && Af(d2.textContent, h2, a2), e2 = ["children", h2]) : "number" === typeof h2 && d2.textContent !== "" + h2 && (true !== f2.suppressHydrationWarning && Af(
                d2.textContent,
                h2,
                a2
              ), e2 = ["children", "" + h2]) : ea.hasOwnProperty(g2) && null != h2 && "onScroll" === g2 && D$2("scroll", d2);
            }
          switch (c2) {
            case "input":
              Va(d2);
              db(d2, f2, true);
              break;
            case "textarea":
              Va(d2);
              jb(d2);
              break;
            case "select":
            case "option":
              break;
            default:
              "function" === typeof f2.onClick && (d2.onclick = Bf);
          }
          d2 = e2;
          b2.updateQueue = d2;
          null !== d2 && (b2.flags |= 4);
        } else {
          g2 = 9 === e2.nodeType ? e2 : e2.ownerDocument;
          "http://www.w3.org/1999/xhtml" === a2 && (a2 = kb(c2));
          "http://www.w3.org/1999/xhtml" === a2 ? "script" === c2 ? (a2 = g2.createElement("div"), a2.innerHTML = "<script><\/script>", a2 = a2.removeChild(a2.firstChild)) : "string" === typeof d2.is ? a2 = g2.createElement(c2, { is: d2.is }) : (a2 = g2.createElement(c2), "select" === c2 && (g2 = a2, d2.multiple ? g2.multiple = true : d2.size && (g2.size = d2.size))) : a2 = g2.createElementNS(a2, c2);
          a2[Of] = b2;
          a2[Pf] = d2;
          zj(a2, b2, false, false);
          b2.stateNode = a2;
          a: {
            g2 = vb(c2, d2);
            switch (c2) {
              case "dialog":
                D$2("cancel", a2);
                D$2("close", a2);
                e2 = d2;
                break;
              case "iframe":
              case "object":
              case "embed":
                D$2("load", a2);
                e2 = d2;
                break;
              case "video":
              case "audio":
                for (e2 = 0; e2 < lf.length; e2++)
                  D$2(lf[e2], a2);
                e2 = d2;
                break;
              case "source":
                D$2("error", a2);
                e2 = d2;
                break;
              case "img":
              case "image":
              case "link":
                D$2(
                  "error",
                  a2
                );
                D$2("load", a2);
                e2 = d2;
                break;
              case "details":
                D$2("toggle", a2);
                e2 = d2;
                break;
              case "input":
                Za(a2, d2);
                e2 = Ya(a2, d2);
                D$2("invalid", a2);
                break;
              case "option":
                e2 = d2;
                break;
              case "select":
                a2._wrapperState = { wasMultiple: !!d2.multiple };
                e2 = A({}, d2, { value: void 0 });
                D$2("invalid", a2);
                break;
              case "textarea":
                hb(a2, d2);
                e2 = gb(a2, d2);
                D$2("invalid", a2);
                break;
              default:
                e2 = d2;
            }
            ub(c2, e2);
            h2 = e2;
            for (f2 in h2)
              if (h2.hasOwnProperty(f2)) {
                var k2 = h2[f2];
                "style" === f2 ? sb(a2, k2) : "dangerouslySetInnerHTML" === f2 ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a2, k2)) : "children" === f2 ? "string" === typeof k2 ? ("textarea" !== c2 || "" !== k2) && ob(a2, k2) : "number" === typeof k2 && ob(a2, "" + k2) : "suppressContentEditableWarning" !== f2 && "suppressHydrationWarning" !== f2 && "autoFocus" !== f2 && (ea.hasOwnProperty(f2) ? null != k2 && "onScroll" === f2 && D$2("scroll", a2) : null != k2 && ta(a2, f2, k2, g2));
              }
            switch (c2) {
              case "input":
                Va(a2);
                db(a2, d2, false);
                break;
              case "textarea":
                Va(a2);
                jb(a2);
                break;
              case "option":
                null != d2.value && a2.setAttribute("value", "" + Sa(d2.value));
                break;
              case "select":
                a2.multiple = !!d2.multiple;
                f2 = d2.value;
                null != f2 ? fb(a2, !!d2.multiple, f2, false) : null != d2.defaultValue && fb(
                  a2,
                  !!d2.multiple,
                  d2.defaultValue,
                  true
                );
                break;
              default:
                "function" === typeof e2.onClick && (a2.onclick = Bf);
            }
            switch (c2) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                d2 = !!d2.autoFocus;
                break a;
              case "img":
                d2 = true;
                break a;
              default:
                d2 = false;
            }
          }
          d2 && (b2.flags |= 4);
        }
        null !== b2.ref && (b2.flags |= 512, b2.flags |= 2097152);
      }
      S$2(b2);
      return null;
    case 6:
      if (a2 && null != b2.stateNode)
        Cj(a2, b2, a2.memoizedProps, d2);
      else {
        if ("string" !== typeof d2 && null === b2.stateNode)
          throw Error(p$1(166));
        c2 = xh(wh.current);
        xh(uh.current);
        if (Gg(b2)) {
          d2 = b2.stateNode;
          c2 = b2.memoizedProps;
          d2[Of] = b2;
          if (f2 = d2.nodeValue !== c2) {
            if (a2 = xg, null !== a2)
              switch (a2.tag) {
                case 3:
                  Af(d2.nodeValue, c2, 0 !== (a2.mode & 1));
                  break;
                case 5:
                  true !== a2.memoizedProps.suppressHydrationWarning && Af(d2.nodeValue, c2, 0 !== (a2.mode & 1));
              }
          }
          f2 && (b2.flags |= 4);
        } else
          d2 = (9 === c2.nodeType ? c2 : c2.ownerDocument).createTextNode(d2), d2[Of] = b2, b2.stateNode = d2;
      }
      S$2(b2);
      return null;
    case 13:
      E(L);
      d2 = b2.memoizedState;
      if (null === a2 || null !== a2.memoizedState && null !== a2.memoizedState.dehydrated) {
        if (I$3 && null !== yg && 0 !== (b2.mode & 1) && 0 === (b2.flags & 128))
          Hg(), Ig(), b2.flags |= 98560, f2 = false;
        else if (f2 = Gg(b2), null !== d2 && null !== d2.dehydrated) {
          if (null === a2) {
            if (!f2)
              throw Error(p$1(318));
            f2 = b2.memoizedState;
            f2 = null !== f2 ? f2.dehydrated : null;
            if (!f2)
              throw Error(p$1(317));
            f2[Of] = b2;
          } else
            Ig(), 0 === (b2.flags & 128) && (b2.memoizedState = null), b2.flags |= 4;
          S$2(b2);
          f2 = false;
        } else
          null !== zg && (Fj(zg), zg = null), f2 = true;
        if (!f2)
          return b2.flags & 65536 ? b2 : null;
      }
      if (0 !== (b2.flags & 128))
        return b2.lanes = c2, b2;
      d2 = null !== d2;
      d2 !== (null !== a2 && null !== a2.memoizedState) && d2 && (b2.child.flags |= 8192, 0 !== (b2.mode & 1) && (null === a2 || 0 !== (L.current & 1) ? 0 === T$2 && (T$2 = 3) : tj()));
      null !== b2.updateQueue && (b2.flags |= 4);
      S$2(b2);
      return null;
    case 4:
      return zh(), Aj(a2, b2), null === a2 && sf(b2.stateNode.containerInfo), S$2(b2), null;
    case 10:
      return ah(b2.type._context), S$2(b2), null;
    case 17:
      return Zf(b2.type) && $f(), S$2(b2), null;
    case 19:
      E(L);
      f2 = b2.memoizedState;
      if (null === f2)
        return S$2(b2), null;
      d2 = 0 !== (b2.flags & 128);
      g2 = f2.rendering;
      if (null === g2)
        if (d2)
          Dj(f2, false);
        else {
          if (0 !== T$2 || null !== a2 && 0 !== (a2.flags & 128))
            for (a2 = b2.child; null !== a2; ) {
              g2 = Ch(a2);
              if (null !== g2) {
                b2.flags |= 128;
                Dj(f2, false);
                d2 = g2.updateQueue;
                null !== d2 && (b2.updateQueue = d2, b2.flags |= 4);
                b2.subtreeFlags = 0;
                d2 = c2;
                for (c2 = b2.child; null !== c2; )
                  f2 = c2, a2 = d2, f2.flags &= 14680066, g2 = f2.alternate, null === g2 ? (f2.childLanes = 0, f2.lanes = a2, f2.child = null, f2.subtreeFlags = 0, f2.memoizedProps = null, f2.memoizedState = null, f2.updateQueue = null, f2.dependencies = null, f2.stateNode = null) : (f2.childLanes = g2.childLanes, f2.lanes = g2.lanes, f2.child = g2.child, f2.subtreeFlags = 0, f2.deletions = null, f2.memoizedProps = g2.memoizedProps, f2.memoizedState = g2.memoizedState, f2.updateQueue = g2.updateQueue, f2.type = g2.type, a2 = g2.dependencies, f2.dependencies = null === a2 ? null : { lanes: a2.lanes, firstContext: a2.firstContext }), c2 = c2.sibling;
                G(L, L.current & 1 | 2);
                return b2.child;
              }
              a2 = a2.sibling;
            }
          null !== f2.tail && B() > Gj && (b2.flags |= 128, d2 = true, Dj(f2, false), b2.lanes = 4194304);
        }
      else {
        if (!d2)
          if (a2 = Ch(g2), null !== a2) {
            if (b2.flags |= 128, d2 = true, c2 = a2.updateQueue, null !== c2 && (b2.updateQueue = c2, b2.flags |= 4), Dj(f2, true), null === f2.tail && "hidden" === f2.tailMode && !g2.alternate && !I$3)
              return S$2(b2), null;
          } else
            2 * B() - f2.renderingStartTime > Gj && 1073741824 !== c2 && (b2.flags |= 128, d2 = true, Dj(f2, false), b2.lanes = 4194304);
        f2.isBackwards ? (g2.sibling = b2.child, b2.child = g2) : (c2 = f2.last, null !== c2 ? c2.sibling = g2 : b2.child = g2, f2.last = g2);
      }
      if (null !== f2.tail)
        return b2 = f2.tail, f2.rendering = b2, f2.tail = b2.sibling, f2.renderingStartTime = B(), b2.sibling = null, c2 = L.current, G(L, d2 ? c2 & 1 | 2 : c2 & 1), b2;
      S$2(b2);
      return null;
    case 22:
    case 23:
      return Hj(), d2 = null !== b2.memoizedState, null !== a2 && null !== a2.memoizedState !== d2 && (b2.flags |= 8192), d2 && 0 !== (b2.mode & 1) ? 0 !== (fj & 1073741824) && (S$2(b2), b2.subtreeFlags & 6 && (b2.flags |= 8192)) : S$2(b2), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(p$1(156, b2.tag));
}
function Ij(a2, b2) {
  wg(b2);
  switch (b2.tag) {
    case 1:
      return Zf(b2.type) && $f(), a2 = b2.flags, a2 & 65536 ? (b2.flags = a2 & -65537 | 128, b2) : null;
    case 3:
      return zh(), E(Wf), E(H$1), Eh(), a2 = b2.flags, 0 !== (a2 & 65536) && 0 === (a2 & 128) ? (b2.flags = a2 & -65537 | 128, b2) : null;
    case 5:
      return Bh(b2), null;
    case 13:
      E(L);
      a2 = b2.memoizedState;
      if (null !== a2 && null !== a2.dehydrated) {
        if (null === b2.alternate)
          throw Error(p$1(340));
        Ig();
      }
      a2 = b2.flags;
      return a2 & 65536 ? (b2.flags = a2 & -65537 | 128, b2) : null;
    case 19:
      return E(L), null;
    case 4:
      return zh(), null;
    case 10:
      return ah(b2.type._context), null;
    case 22:
    case 23:
      return Hj(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Jj = false, U$3 = false, Kj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
function Lj(a2, b2) {
  var c2 = a2.ref;
  if (null !== c2)
    if ("function" === typeof c2)
      try {
        c2(null);
      } catch (d2) {
        W(a2, b2, d2);
      }
    else
      c2.current = null;
}
function Mj(a2, b2, c2) {
  try {
    c2();
  } catch (d2) {
    W(a2, b2, d2);
  }
}
var Nj = false;
function Oj(a2, b2) {
  Cf = dd;
  a2 = Me$1();
  if (Ne$1(a2)) {
    if ("selectionStart" in a2)
      var c2 = { start: a2.selectionStart, end: a2.selectionEnd };
    else
      a: {
        c2 = (c2 = a2.ownerDocument) && c2.defaultView || window;
        var d2 = c2.getSelection && c2.getSelection();
        if (d2 && 0 !== d2.rangeCount) {
          c2 = d2.anchorNode;
          var e2 = d2.anchorOffset, f2 = d2.focusNode;
          d2 = d2.focusOffset;
          try {
            c2.nodeType, f2.nodeType;
          } catch (F2) {
            c2 = null;
            break a;
          }
          var g2 = 0, h2 = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a2, r2 = null;
          b:
            for (; ; ) {
              for (var y2; ; ) {
                q2 !== c2 || 0 !== e2 && 3 !== q2.nodeType || (h2 = g2 + e2);
                q2 !== f2 || 0 !== d2 && 3 !== q2.nodeType || (k2 = g2 + d2);
                3 === q2.nodeType && (g2 += q2.nodeValue.length);
                if (null === (y2 = q2.firstChild))
                  break;
                r2 = q2;
                q2 = y2;
              }
              for (; ; ) {
                if (q2 === a2)
                  break b;
                r2 === c2 && ++l2 === e2 && (h2 = g2);
                r2 === f2 && ++m2 === d2 && (k2 = g2);
                if (null !== (y2 = q2.nextSibling))
                  break;
                q2 = r2;
                r2 = q2.parentNode;
              }
              q2 = y2;
            }
          c2 = -1 === h2 || -1 === k2 ? null : { start: h2, end: k2 };
        } else
          c2 = null;
      }
    c2 = c2 || { start: 0, end: 0 };
  } else
    c2 = null;
  Df = { focusedElem: a2, selectionRange: c2 };
  dd = false;
  for (V = b2; null !== V; )
    if (b2 = V, a2 = b2.child, 0 !== (b2.subtreeFlags & 1028) && null !== a2)
      a2.return = b2, V = a2;
    else
      for (; null !== V; ) {
        b2 = V;
        try {
          var n2 = b2.alternate;
          if (0 !== (b2.flags & 1024))
            switch (b2.tag) {
              case 0:
              case 11:
              case 15:
                break;
              case 1:
                if (null !== n2) {
                  var t2 = n2.memoizedProps, J2 = n2.memoizedState, x2 = b2.stateNode, w2 = x2.getSnapshotBeforeUpdate(b2.elementType === b2.type ? t2 : Ci(b2.type, t2), J2);
                  x2.__reactInternalSnapshotBeforeUpdate = w2;
                }
                break;
              case 3:
                var u2 = b2.stateNode.containerInfo;
                1 === u2.nodeType ? u2.textContent = "" : 9 === u2.nodeType && u2.documentElement && u2.removeChild(u2.documentElement);
                break;
              case 5:
              case 6:
              case 4:
              case 17:
                break;
              default:
                throw Error(p$1(163));
            }
        } catch (F2) {
          W(b2, b2.return, F2);
        }
        a2 = b2.sibling;
        if (null !== a2) {
          a2.return = b2.return;
          V = a2;
          break;
        }
        V = b2.return;
      }
  n2 = Nj;
  Nj = false;
  return n2;
}
function Pj(a2, b2, c2) {
  var d2 = b2.updateQueue;
  d2 = null !== d2 ? d2.lastEffect : null;
  if (null !== d2) {
    var e2 = d2 = d2.next;
    do {
      if ((e2.tag & a2) === a2) {
        var f2 = e2.destroy;
        e2.destroy = void 0;
        void 0 !== f2 && Mj(b2, c2, f2);
      }
      e2 = e2.next;
    } while (e2 !== d2);
  }
}
function Qj(a2, b2) {
  b2 = b2.updateQueue;
  b2 = null !== b2 ? b2.lastEffect : null;
  if (null !== b2) {
    var c2 = b2 = b2.next;
    do {
      if ((c2.tag & a2) === a2) {
        var d2 = c2.create;
        c2.destroy = d2();
      }
      c2 = c2.next;
    } while (c2 !== b2);
  }
}
function Rj(a2) {
  var b2 = a2.ref;
  if (null !== b2) {
    var c2 = a2.stateNode;
    switch (a2.tag) {
      case 5:
        a2 = c2;
        break;
      default:
        a2 = c2;
    }
    "function" === typeof b2 ? b2(a2) : b2.current = a2;
  }
}
function Sj(a2) {
  var b2 = a2.alternate;
  null !== b2 && (a2.alternate = null, Sj(b2));
  a2.child = null;
  a2.deletions = null;
  a2.sibling = null;
  5 === a2.tag && (b2 = a2.stateNode, null !== b2 && (delete b2[Of], delete b2[Pf], delete b2[of], delete b2[Qf], delete b2[Rf]));
  a2.stateNode = null;
  a2.return = null;
  a2.dependencies = null;
  a2.memoizedProps = null;
  a2.memoizedState = null;
  a2.pendingProps = null;
  a2.stateNode = null;
  a2.updateQueue = null;
}
function Tj(a2) {
  return 5 === a2.tag || 3 === a2.tag || 4 === a2.tag;
}
function Uj(a2) {
  a:
    for (; ; ) {
      for (; null === a2.sibling; ) {
        if (null === a2.return || Tj(a2.return))
          return null;
        a2 = a2.return;
      }
      a2.sibling.return = a2.return;
      for (a2 = a2.sibling; 5 !== a2.tag && 6 !== a2.tag && 18 !== a2.tag; ) {
        if (a2.flags & 2)
          continue a;
        if (null === a2.child || 4 === a2.tag)
          continue a;
        else
          a2.child.return = a2, a2 = a2.child;
      }
      if (!(a2.flags & 2))
        return a2.stateNode;
    }
}
function Vj(a2, b2, c2) {
  var d2 = a2.tag;
  if (5 === d2 || 6 === d2)
    a2 = a2.stateNode, b2 ? 8 === c2.nodeType ? c2.parentNode.insertBefore(a2, b2) : c2.insertBefore(a2, b2) : (8 === c2.nodeType ? (b2 = c2.parentNode, b2.insertBefore(a2, c2)) : (b2 = c2, b2.appendChild(a2)), c2 = c2._reactRootContainer, null !== c2 && void 0 !== c2 || null !== b2.onclick || (b2.onclick = Bf));
  else if (4 !== d2 && (a2 = a2.child, null !== a2))
    for (Vj(a2, b2, c2), a2 = a2.sibling; null !== a2; )
      Vj(a2, b2, c2), a2 = a2.sibling;
}
function Wj(a2, b2, c2) {
  var d2 = a2.tag;
  if (5 === d2 || 6 === d2)
    a2 = a2.stateNode, b2 ? c2.insertBefore(a2, b2) : c2.appendChild(a2);
  else if (4 !== d2 && (a2 = a2.child, null !== a2))
    for (Wj(a2, b2, c2), a2 = a2.sibling; null !== a2; )
      Wj(a2, b2, c2), a2 = a2.sibling;
}
var X = null, Xj = false;
function Yj(a2, b2, c2) {
  for (c2 = c2.child; null !== c2; )
    Zj(a2, b2, c2), c2 = c2.sibling;
}
function Zj(a2, b2, c2) {
  if (lc && "function" === typeof lc.onCommitFiberUnmount)
    try {
      lc.onCommitFiberUnmount(kc, c2);
    } catch (h2) {
    }
  switch (c2.tag) {
    case 5:
      U$3 || Lj(c2, b2);
    case 6:
      var d2 = X, e2 = Xj;
      X = null;
      Yj(a2, b2, c2);
      X = d2;
      Xj = e2;
      null !== X && (Xj ? (a2 = X, c2 = c2.stateNode, 8 === a2.nodeType ? a2.parentNode.removeChild(c2) : a2.removeChild(c2)) : X.removeChild(c2.stateNode));
      break;
    case 18:
      null !== X && (Xj ? (a2 = X, c2 = c2.stateNode, 8 === a2.nodeType ? Kf(a2.parentNode, c2) : 1 === a2.nodeType && Kf(a2, c2), bd(a2)) : Kf(X, c2.stateNode));
      break;
    case 4:
      d2 = X;
      e2 = Xj;
      X = c2.stateNode.containerInfo;
      Xj = true;
      Yj(a2, b2, c2);
      X = d2;
      Xj = e2;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!U$3 && (d2 = c2.updateQueue, null !== d2 && (d2 = d2.lastEffect, null !== d2))) {
        e2 = d2 = d2.next;
        do {
          var f2 = e2, g2 = f2.destroy;
          f2 = f2.tag;
          void 0 !== g2 && (0 !== (f2 & 2) ? Mj(c2, b2, g2) : 0 !== (f2 & 4) && Mj(c2, b2, g2));
          e2 = e2.next;
        } while (e2 !== d2);
      }
      Yj(a2, b2, c2);
      break;
    case 1:
      if (!U$3 && (Lj(c2, b2), d2 = c2.stateNode, "function" === typeof d2.componentWillUnmount))
        try {
          d2.props = c2.memoizedProps, d2.state = c2.memoizedState, d2.componentWillUnmount();
        } catch (h2) {
          W(c2, b2, h2);
        }
      Yj(a2, b2, c2);
      break;
    case 21:
      Yj(a2, b2, c2);
      break;
    case 22:
      c2.mode & 1 ? (U$3 = (d2 = U$3) || null !== c2.memoizedState, Yj(a2, b2, c2), U$3 = d2) : Yj(a2, b2, c2);
      break;
    default:
      Yj(a2, b2, c2);
  }
}
function ak(a2) {
  var b2 = a2.updateQueue;
  if (null !== b2) {
    a2.updateQueue = null;
    var c2 = a2.stateNode;
    null === c2 && (c2 = a2.stateNode = new Kj());
    b2.forEach(function(b3) {
      var d2 = bk.bind(null, a2, b3);
      c2.has(b3) || (c2.add(b3), b3.then(d2, d2));
    });
  }
}
function ck(a2, b2) {
  var c2 = b2.deletions;
  if (null !== c2)
    for (var d2 = 0; d2 < c2.length; d2++) {
      var e2 = c2[d2];
      try {
        var f2 = a2, g2 = b2, h2 = g2;
        a:
          for (; null !== h2; ) {
            switch (h2.tag) {
              case 5:
                X = h2.stateNode;
                Xj = false;
                break a;
              case 3:
                X = h2.stateNode.containerInfo;
                Xj = true;
                break a;
              case 4:
                X = h2.stateNode.containerInfo;
                Xj = true;
                break a;
            }
            h2 = h2.return;
          }
        if (null === X)
          throw Error(p$1(160));
        Zj(f2, g2, e2);
        X = null;
        Xj = false;
        var k2 = e2.alternate;
        null !== k2 && (k2.return = null);
        e2.return = null;
      } catch (l2) {
        W(e2, b2, l2);
      }
    }
  if (b2.subtreeFlags & 12854)
    for (b2 = b2.child; null !== b2; )
      dk(b2, a2), b2 = b2.sibling;
}
function dk(a2, b2) {
  var c2 = a2.alternate, d2 = a2.flags;
  switch (a2.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      ck(b2, a2);
      ek(a2);
      if (d2 & 4) {
        try {
          Pj(3, a2, a2.return), Qj(3, a2);
        } catch (t2) {
          W(a2, a2.return, t2);
        }
        try {
          Pj(5, a2, a2.return);
        } catch (t2) {
          W(a2, a2.return, t2);
        }
      }
      break;
    case 1:
      ck(b2, a2);
      ek(a2);
      d2 & 512 && null !== c2 && Lj(c2, c2.return);
      break;
    case 5:
      ck(b2, a2);
      ek(a2);
      d2 & 512 && null !== c2 && Lj(c2, c2.return);
      if (a2.flags & 32) {
        var e2 = a2.stateNode;
        try {
          ob(e2, "");
        } catch (t2) {
          W(a2, a2.return, t2);
        }
      }
      if (d2 & 4 && (e2 = a2.stateNode, null != e2)) {
        var f2 = a2.memoizedProps, g2 = null !== c2 ? c2.memoizedProps : f2, h2 = a2.type, k2 = a2.updateQueue;
        a2.updateQueue = null;
        if (null !== k2)
          try {
            "input" === h2 && "radio" === f2.type && null != f2.name && ab(e2, f2);
            vb(h2, g2);
            var l2 = vb(h2, f2);
            for (g2 = 0; g2 < k2.length; g2 += 2) {
              var m2 = k2[g2], q2 = k2[g2 + 1];
              "style" === m2 ? sb(e2, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e2, q2) : "children" === m2 ? ob(e2, q2) : ta(e2, m2, q2, l2);
            }
            switch (h2) {
              case "input":
                bb(e2, f2);
                break;
              case "textarea":
                ib(e2, f2);
                break;
              case "select":
                var r2 = e2._wrapperState.wasMultiple;
                e2._wrapperState.wasMultiple = !!f2.multiple;
                var y2 = f2.value;
                null != y2 ? fb(e2, !!f2.multiple, y2, false) : r2 !== !!f2.multiple && (null != f2.defaultValue ? fb(
                  e2,
                  !!f2.multiple,
                  f2.defaultValue,
                  true
                ) : fb(e2, !!f2.multiple, f2.multiple ? [] : "", false));
            }
            e2[Pf] = f2;
          } catch (t2) {
            W(a2, a2.return, t2);
          }
      }
      break;
    case 6:
      ck(b2, a2);
      ek(a2);
      if (d2 & 4) {
        if (null === a2.stateNode)
          throw Error(p$1(162));
        e2 = a2.stateNode;
        f2 = a2.memoizedProps;
        try {
          e2.nodeValue = f2;
        } catch (t2) {
          W(a2, a2.return, t2);
        }
      }
      break;
    case 3:
      ck(b2, a2);
      ek(a2);
      if (d2 & 4 && null !== c2 && c2.memoizedState.isDehydrated)
        try {
          bd(b2.containerInfo);
        } catch (t2) {
          W(a2, a2.return, t2);
        }
      break;
    case 4:
      ck(b2, a2);
      ek(a2);
      break;
    case 13:
      ck(b2, a2);
      ek(a2);
      e2 = a2.child;
      e2.flags & 8192 && (f2 = null !== e2.memoizedState, e2.stateNode.isHidden = f2, !f2 || null !== e2.alternate && null !== e2.alternate.memoizedState || (fk = B()));
      d2 & 4 && ak(a2);
      break;
    case 22:
      m2 = null !== c2 && null !== c2.memoizedState;
      a2.mode & 1 ? (U$3 = (l2 = U$3) || m2, ck(b2, a2), U$3 = l2) : ck(b2, a2);
      ek(a2);
      if (d2 & 8192) {
        l2 = null !== a2.memoizedState;
        if ((a2.stateNode.isHidden = l2) && !m2 && 0 !== (a2.mode & 1))
          for (V = a2, m2 = a2.child; null !== m2; ) {
            for (q2 = V = m2; null !== V; ) {
              r2 = V;
              y2 = r2.child;
              switch (r2.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Pj(4, r2, r2.return);
                  break;
                case 1:
                  Lj(r2, r2.return);
                  var n2 = r2.stateNode;
                  if ("function" === typeof n2.componentWillUnmount) {
                    d2 = r2;
                    c2 = r2.return;
                    try {
                      b2 = d2, n2.props = b2.memoizedProps, n2.state = b2.memoizedState, n2.componentWillUnmount();
                    } catch (t2) {
                      W(d2, c2, t2);
                    }
                  }
                  break;
                case 5:
                  Lj(r2, r2.return);
                  break;
                case 22:
                  if (null !== r2.memoizedState) {
                    gk(q2);
                    continue;
                  }
              }
              null !== y2 ? (y2.return = r2, V = y2) : gk(q2);
            }
            m2 = m2.sibling;
          }
        a:
          for (m2 = null, q2 = a2; ; ) {
            if (5 === q2.tag) {
              if (null === m2) {
                m2 = q2;
                try {
                  e2 = q2.stateNode, l2 ? (f2 = e2.style, "function" === typeof f2.setProperty ? f2.setProperty("display", "none", "important") : f2.display = "none") : (h2 = q2.stateNode, k2 = q2.memoizedProps.style, g2 = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h2.style.display = rb("display", g2));
                } catch (t2) {
                  W(a2, a2.return, t2);
                }
              }
            } else if (6 === q2.tag) {
              if (null === m2)
                try {
                  q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
                } catch (t2) {
                  W(a2, a2.return, t2);
                }
            } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a2) && null !== q2.child) {
              q2.child.return = q2;
              q2 = q2.child;
              continue;
            }
            if (q2 === a2)
              break a;
            for (; null === q2.sibling; ) {
              if (null === q2.return || q2.return === a2)
                break a;
              m2 === q2 && (m2 = null);
              q2 = q2.return;
            }
            m2 === q2 && (m2 = null);
            q2.sibling.return = q2.return;
            q2 = q2.sibling;
          }
      }
      break;
    case 19:
      ck(b2, a2);
      ek(a2);
      d2 & 4 && ak(a2);
      break;
    case 21:
      break;
    default:
      ck(
        b2,
        a2
      ), ek(a2);
  }
}
function ek(a2) {
  var b2 = a2.flags;
  if (b2 & 2) {
    try {
      a: {
        for (var c2 = a2.return; null !== c2; ) {
          if (Tj(c2)) {
            var d2 = c2;
            break a;
          }
          c2 = c2.return;
        }
        throw Error(p$1(160));
      }
      switch (d2.tag) {
        case 5:
          var e2 = d2.stateNode;
          d2.flags & 32 && (ob(e2, ""), d2.flags &= -33);
          var f2 = Uj(a2);
          Wj(a2, f2, e2);
          break;
        case 3:
        case 4:
          var g2 = d2.stateNode.containerInfo, h2 = Uj(a2);
          Vj(a2, h2, g2);
          break;
        default:
          throw Error(p$1(161));
      }
    } catch (k2) {
      W(a2, a2.return, k2);
    }
    a2.flags &= -3;
  }
  b2 & 4096 && (a2.flags &= -4097);
}
function hk(a2, b2, c2) {
  V = a2;
  ik(a2);
}
function ik(a2, b2, c2) {
  for (var d2 = 0 !== (a2.mode & 1); null !== V; ) {
    var e2 = V, f2 = e2.child;
    if (22 === e2.tag && d2) {
      var g2 = null !== e2.memoizedState || Jj;
      if (!g2) {
        var h2 = e2.alternate, k2 = null !== h2 && null !== h2.memoizedState || U$3;
        h2 = Jj;
        var l2 = U$3;
        Jj = g2;
        if ((U$3 = k2) && !l2)
          for (V = e2; null !== V; )
            g2 = V, k2 = g2.child, 22 === g2.tag && null !== g2.memoizedState ? jk(e2) : null !== k2 ? (k2.return = g2, V = k2) : jk(e2);
        for (; null !== f2; )
          V = f2, ik(f2), f2 = f2.sibling;
        V = e2;
        Jj = h2;
        U$3 = l2;
      }
      kk(a2);
    } else
      0 !== (e2.subtreeFlags & 8772) && null !== f2 ? (f2.return = e2, V = f2) : kk(a2);
  }
}
function kk(a2) {
  for (; null !== V; ) {
    var b2 = V;
    if (0 !== (b2.flags & 8772)) {
      var c2 = b2.alternate;
      try {
        if (0 !== (b2.flags & 8772))
          switch (b2.tag) {
            case 0:
            case 11:
            case 15:
              U$3 || Qj(5, b2);
              break;
            case 1:
              var d2 = b2.stateNode;
              if (b2.flags & 4 && !U$3)
                if (null === c2)
                  d2.componentDidMount();
                else {
                  var e2 = b2.elementType === b2.type ? c2.memoizedProps : Ci(b2.type, c2.memoizedProps);
                  d2.componentDidUpdate(e2, c2.memoizedState, d2.__reactInternalSnapshotBeforeUpdate);
                }
              var f2 = b2.updateQueue;
              null !== f2 && sh(b2, f2, d2);
              break;
            case 3:
              var g2 = b2.updateQueue;
              if (null !== g2) {
                c2 = null;
                if (null !== b2.child)
                  switch (b2.child.tag) {
                    case 5:
                      c2 = b2.child.stateNode;
                      break;
                    case 1:
                      c2 = b2.child.stateNode;
                  }
                sh(b2, g2, c2);
              }
              break;
            case 5:
              var h2 = b2.stateNode;
              if (null === c2 && b2.flags & 4) {
                c2 = h2;
                var k2 = b2.memoizedProps;
                switch (b2.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    k2.autoFocus && c2.focus();
                    break;
                  case "img":
                    k2.src && (c2.src = k2.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (null === b2.memoizedState) {
                var l2 = b2.alternate;
                if (null !== l2) {
                  var m2 = l2.memoizedState;
                  if (null !== m2) {
                    var q2 = m2.dehydrated;
                    null !== q2 && bd(q2);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(p$1(163));
          }
        U$3 || b2.flags & 512 && Rj(b2);
      } catch (r2) {
        W(b2, b2.return, r2);
      }
    }
    if (b2 === a2) {
      V = null;
      break;
    }
    c2 = b2.sibling;
    if (null !== c2) {
      c2.return = b2.return;
      V = c2;
      break;
    }
    V = b2.return;
  }
}
function gk(a2) {
  for (; null !== V; ) {
    var b2 = V;
    if (b2 === a2) {
      V = null;
      break;
    }
    var c2 = b2.sibling;
    if (null !== c2) {
      c2.return = b2.return;
      V = c2;
      break;
    }
    V = b2.return;
  }
}
function jk(a2) {
  for (; null !== V; ) {
    var b2 = V;
    try {
      switch (b2.tag) {
        case 0:
        case 11:
        case 15:
          var c2 = b2.return;
          try {
            Qj(4, b2);
          } catch (k2) {
            W(b2, c2, k2);
          }
          break;
        case 1:
          var d2 = b2.stateNode;
          if ("function" === typeof d2.componentDidMount) {
            var e2 = b2.return;
            try {
              d2.componentDidMount();
            } catch (k2) {
              W(b2, e2, k2);
            }
          }
          var f2 = b2.return;
          try {
            Rj(b2);
          } catch (k2) {
            W(b2, f2, k2);
          }
          break;
        case 5:
          var g2 = b2.return;
          try {
            Rj(b2);
          } catch (k2) {
            W(b2, g2, k2);
          }
      }
    } catch (k2) {
      W(b2, b2.return, k2);
    }
    if (b2 === a2) {
      V = null;
      break;
    }
    var h2 = b2.sibling;
    if (null !== h2) {
      h2.return = b2.return;
      V = h2;
      break;
    }
    V = b2.return;
  }
}
var lk = Math.ceil, mk = ua.ReactCurrentDispatcher, nk = ua.ReactCurrentOwner, ok = ua.ReactCurrentBatchConfig, K = 0, Q = null, Y = null, Z = 0, fj = 0, ej = Uf(0), T$2 = 0, pk = null, rh = 0, qk = 0, rk = 0, sk = null, tk = null, fk = 0, Gj = Infinity, uk = null, Oi = false, Pi = null, Ri = null, vk = false, wk = null, xk = 0, yk = 0, zk = null, Ak = -1, Bk = 0;
function R$1() {
  return 0 !== (K & 6) ? B() : -1 !== Ak ? Ak : Ak = B();
}
function yi(a2) {
  if (0 === (a2.mode & 1))
    return 1;
  if (0 !== (K & 2) && 0 !== Z)
    return Z & -Z;
  if (null !== Kg.transition)
    return 0 === Bk && (Bk = yc()), Bk;
  a2 = C$2;
  if (0 !== a2)
    return a2;
  a2 = window.event;
  a2 = void 0 === a2 ? 16 : jd(a2.type);
  return a2;
}
function gi(a2, b2, c2, d2) {
  if (50 < yk)
    throw yk = 0, zk = null, Error(p$1(185));
  Ac(a2, c2, d2);
  if (0 === (K & 2) || a2 !== Q)
    a2 === Q && (0 === (K & 2) && (qk |= c2), 4 === T$2 && Ck(a2, Z)), Dk(a2, d2), 1 === c2 && 0 === K && 0 === (b2.mode & 1) && (Gj = B() + 500, fg && jg());
}
function Dk(a2, b2) {
  var c2 = a2.callbackNode;
  wc(a2, b2);
  var d2 = uc(a2, a2 === Q ? Z : 0);
  if (0 === d2)
    null !== c2 && bc(c2), a2.callbackNode = null, a2.callbackPriority = 0;
  else if (b2 = d2 & -d2, a2.callbackPriority !== b2) {
    null != c2 && bc(c2);
    if (1 === b2)
      0 === a2.tag ? ig(Ek.bind(null, a2)) : hg(Ek.bind(null, a2)), Jf(function() {
        0 === (K & 6) && jg();
      }), c2 = null;
    else {
      switch (Dc(d2)) {
        case 1:
          c2 = fc;
          break;
        case 4:
          c2 = gc;
          break;
        case 16:
          c2 = hc;
          break;
        case 536870912:
          c2 = jc;
          break;
        default:
          c2 = hc;
      }
      c2 = Fk(c2, Gk.bind(null, a2));
    }
    a2.callbackPriority = b2;
    a2.callbackNode = c2;
  }
}
function Gk(a2, b2) {
  Ak = -1;
  Bk = 0;
  if (0 !== (K & 6))
    throw Error(p$1(327));
  var c2 = a2.callbackNode;
  if (Hk() && a2.callbackNode !== c2)
    return null;
  var d2 = uc(a2, a2 === Q ? Z : 0);
  if (0 === d2)
    return null;
  if (0 !== (d2 & 30) || 0 !== (d2 & a2.expiredLanes) || b2)
    b2 = Ik(a2, d2);
  else {
    b2 = d2;
    var e2 = K;
    K |= 2;
    var f2 = Jk();
    if (Q !== a2 || Z !== b2)
      uk = null, Gj = B() + 500, Kk(a2, b2);
    do
      try {
        Lk();
        break;
      } catch (h2) {
        Mk(a2, h2);
      }
    while (1);
    $g();
    mk.current = f2;
    K = e2;
    null !== Y ? b2 = 0 : (Q = null, Z = 0, b2 = T$2);
  }
  if (0 !== b2) {
    2 === b2 && (e2 = xc(a2), 0 !== e2 && (d2 = e2, b2 = Nk(a2, e2)));
    if (1 === b2)
      throw c2 = pk, Kk(a2, 0), Ck(a2, d2), Dk(a2, B()), c2;
    if (6 === b2)
      Ck(a2, d2);
    else {
      e2 = a2.current.alternate;
      if (0 === (d2 & 30) && !Ok(e2) && (b2 = Ik(a2, d2), 2 === b2 && (f2 = xc(a2), 0 !== f2 && (d2 = f2, b2 = Nk(a2, f2))), 1 === b2))
        throw c2 = pk, Kk(a2, 0), Ck(a2, d2), Dk(a2, B()), c2;
      a2.finishedWork = e2;
      a2.finishedLanes = d2;
      switch (b2) {
        case 0:
        case 1:
          throw Error(p$1(345));
        case 2:
          Pk(a2, tk, uk);
          break;
        case 3:
          Ck(a2, d2);
          if ((d2 & 130023424) === d2 && (b2 = fk + 500 - B(), 10 < b2)) {
            if (0 !== uc(a2, 0))
              break;
            e2 = a2.suspendedLanes;
            if ((e2 & d2) !== d2) {
              R$1();
              a2.pingedLanes |= a2.suspendedLanes & e2;
              break;
            }
            a2.timeoutHandle = Ff(Pk.bind(null, a2, tk, uk), b2);
            break;
          }
          Pk(a2, tk, uk);
          break;
        case 4:
          Ck(a2, d2);
          if ((d2 & 4194240) === d2)
            break;
          b2 = a2.eventTimes;
          for (e2 = -1; 0 < d2; ) {
            var g2 = 31 - oc(d2);
            f2 = 1 << g2;
            g2 = b2[g2];
            g2 > e2 && (e2 = g2);
            d2 &= ~f2;
          }
          d2 = e2;
          d2 = B() - d2;
          d2 = (120 > d2 ? 120 : 480 > d2 ? 480 : 1080 > d2 ? 1080 : 1920 > d2 ? 1920 : 3e3 > d2 ? 3e3 : 4320 > d2 ? 4320 : 1960 * lk(d2 / 1960)) - d2;
          if (10 < d2) {
            a2.timeoutHandle = Ff(Pk.bind(null, a2, tk, uk), d2);
            break;
          }
          Pk(a2, tk, uk);
          break;
        case 5:
          Pk(a2, tk, uk);
          break;
        default:
          throw Error(p$1(329));
      }
    }
  }
  Dk(a2, B());
  return a2.callbackNode === c2 ? Gk.bind(null, a2) : null;
}
function Nk(a2, b2) {
  var c2 = sk;
  a2.current.memoizedState.isDehydrated && (Kk(a2, b2).flags |= 256);
  a2 = Ik(a2, b2);
  2 !== a2 && (b2 = tk, tk = c2, null !== b2 && Fj(b2));
  return a2;
}
function Fj(a2) {
  null === tk ? tk = a2 : tk.push.apply(tk, a2);
}
function Ok(a2) {
  for (var b2 = a2; ; ) {
    if (b2.flags & 16384) {
      var c2 = b2.updateQueue;
      if (null !== c2 && (c2 = c2.stores, null !== c2))
        for (var d2 = 0; d2 < c2.length; d2++) {
          var e2 = c2[d2], f2 = e2.getSnapshot;
          e2 = e2.value;
          try {
            if (!He$1(f2(), e2))
              return false;
          } catch (g2) {
            return false;
          }
        }
    }
    c2 = b2.child;
    if (b2.subtreeFlags & 16384 && null !== c2)
      c2.return = b2, b2 = c2;
    else {
      if (b2 === a2)
        break;
      for (; null === b2.sibling; ) {
        if (null === b2.return || b2.return === a2)
          return true;
        b2 = b2.return;
      }
      b2.sibling.return = b2.return;
      b2 = b2.sibling;
    }
  }
  return true;
}
function Ck(a2, b2) {
  b2 &= ~rk;
  b2 &= ~qk;
  a2.suspendedLanes |= b2;
  a2.pingedLanes &= ~b2;
  for (a2 = a2.expirationTimes; 0 < b2; ) {
    var c2 = 31 - oc(b2), d2 = 1 << c2;
    a2[c2] = -1;
    b2 &= ~d2;
  }
}
function Ek(a2) {
  if (0 !== (K & 6))
    throw Error(p$1(327));
  Hk();
  var b2 = uc(a2, 0);
  if (0 === (b2 & 1))
    return Dk(a2, B()), null;
  var c2 = Ik(a2, b2);
  if (0 !== a2.tag && 2 === c2) {
    var d2 = xc(a2);
    0 !== d2 && (b2 = d2, c2 = Nk(a2, d2));
  }
  if (1 === c2)
    throw c2 = pk, Kk(a2, 0), Ck(a2, b2), Dk(a2, B()), c2;
  if (6 === c2)
    throw Error(p$1(345));
  a2.finishedWork = a2.current.alternate;
  a2.finishedLanes = b2;
  Pk(a2, tk, uk);
  Dk(a2, B());
  return null;
}
function Qk(a2, b2) {
  var c2 = K;
  K |= 1;
  try {
    return a2(b2);
  } finally {
    K = c2, 0 === K && (Gj = B() + 500, fg && jg());
  }
}
function Rk(a2) {
  null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
  var b2 = K;
  K |= 1;
  var c2 = ok.transition, d2 = C$2;
  try {
    if (ok.transition = null, C$2 = 1, a2)
      return a2();
  } finally {
    C$2 = d2, ok.transition = c2, K = b2, 0 === (K & 6) && jg();
  }
}
function Hj() {
  fj = ej.current;
  E(ej);
}
function Kk(a2, b2) {
  a2.finishedWork = null;
  a2.finishedLanes = 0;
  var c2 = a2.timeoutHandle;
  -1 !== c2 && (a2.timeoutHandle = -1, Gf(c2));
  if (null !== Y)
    for (c2 = Y.return; null !== c2; ) {
      var d2 = c2;
      wg(d2);
      switch (d2.tag) {
        case 1:
          d2 = d2.type.childContextTypes;
          null !== d2 && void 0 !== d2 && $f();
          break;
        case 3:
          zh();
          E(Wf);
          E(H$1);
          Eh();
          break;
        case 5:
          Bh(d2);
          break;
        case 4:
          zh();
          break;
        case 13:
          E(L);
          break;
        case 19:
          E(L);
          break;
        case 10:
          ah(d2.type._context);
          break;
        case 22:
        case 23:
          Hj();
      }
      c2 = c2.return;
    }
  Q = a2;
  Y = a2 = Pg(a2.current, null);
  Z = fj = b2;
  T$2 = 0;
  pk = null;
  rk = qk = rh = 0;
  tk = sk = null;
  if (null !== fh) {
    for (b2 = 0; b2 < fh.length; b2++)
      if (c2 = fh[b2], d2 = c2.interleaved, null !== d2) {
        c2.interleaved = null;
        var e2 = d2.next, f2 = c2.pending;
        if (null !== f2) {
          var g2 = f2.next;
          f2.next = e2;
          d2.next = g2;
        }
        c2.pending = d2;
      }
    fh = null;
  }
  return a2;
}
function Mk(a2, b2) {
  do {
    var c2 = Y;
    try {
      $g();
      Fh.current = Rh;
      if (Ih) {
        for (var d2 = M$3.memoizedState; null !== d2; ) {
          var e2 = d2.queue;
          null !== e2 && (e2.pending = null);
          d2 = d2.next;
        }
        Ih = false;
      }
      Hh = 0;
      O$2 = N$1 = M$3 = null;
      Jh = false;
      Kh = 0;
      nk.current = null;
      if (null === c2 || null === c2.return) {
        T$2 = 1;
        pk = b2;
        Y = null;
        break;
      }
      a: {
        var f2 = a2, g2 = c2.return, h2 = c2, k2 = b2;
        b2 = Z;
        h2.flags |= 32768;
        if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
          var l2 = k2, m2 = h2, q2 = m2.tag;
          if (0 === (m2.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
            var r2 = m2.alternate;
            r2 ? (m2.updateQueue = r2.updateQueue, m2.memoizedState = r2.memoizedState, m2.lanes = r2.lanes) : (m2.updateQueue = null, m2.memoizedState = null);
          }
          var y2 = Ui(g2);
          if (null !== y2) {
            y2.flags &= -257;
            Vi(y2, g2, h2, f2, b2);
            y2.mode & 1 && Si(f2, l2, b2);
            b2 = y2;
            k2 = l2;
            var n2 = b2.updateQueue;
            if (null === n2) {
              var t2 = /* @__PURE__ */ new Set();
              t2.add(k2);
              b2.updateQueue = t2;
            } else
              n2.add(k2);
            break a;
          } else {
            if (0 === (b2 & 1)) {
              Si(f2, l2, b2);
              tj();
              break a;
            }
            k2 = Error(p$1(426));
          }
        } else if (I$3 && h2.mode & 1) {
          var J2 = Ui(g2);
          if (null !== J2) {
            0 === (J2.flags & 65536) && (J2.flags |= 256);
            Vi(J2, g2, h2, f2, b2);
            Jg(Ji(k2, h2));
            break a;
          }
        }
        f2 = k2 = Ji(k2, h2);
        4 !== T$2 && (T$2 = 2);
        null === sk ? sk = [f2] : sk.push(f2);
        f2 = g2;
        do {
          switch (f2.tag) {
            case 3:
              f2.flags |= 65536;
              b2 &= -b2;
              f2.lanes |= b2;
              var x2 = Ni(f2, k2, b2);
              ph(f2, x2);
              break a;
            case 1:
              h2 = k2;
              var w2 = f2.type, u2 = f2.stateNode;
              if (0 === (f2.flags & 128) && ("function" === typeof w2.getDerivedStateFromError || null !== u2 && "function" === typeof u2.componentDidCatch && (null === Ri || !Ri.has(u2)))) {
                f2.flags |= 65536;
                b2 &= -b2;
                f2.lanes |= b2;
                var F2 = Qi(f2, h2, b2);
                ph(f2, F2);
                break a;
              }
          }
          f2 = f2.return;
        } while (null !== f2);
      }
      Sk(c2);
    } catch (na) {
      b2 = na;
      Y === c2 && null !== c2 && (Y = c2 = c2.return);
      continue;
    }
    break;
  } while (1);
}
function Jk() {
  var a2 = mk.current;
  mk.current = Rh;
  return null === a2 ? Rh : a2;
}
function tj() {
  if (0 === T$2 || 3 === T$2 || 2 === T$2)
    T$2 = 4;
  null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
}
function Ik(a2, b2) {
  var c2 = K;
  K |= 2;
  var d2 = Jk();
  if (Q !== a2 || Z !== b2)
    uk = null, Kk(a2, b2);
  do
    try {
      Tk();
      break;
    } catch (e2) {
      Mk(a2, e2);
    }
  while (1);
  $g();
  K = c2;
  mk.current = d2;
  if (null !== Y)
    throw Error(p$1(261));
  Q = null;
  Z = 0;
  return T$2;
}
function Tk() {
  for (; null !== Y; )
    Uk(Y);
}
function Lk() {
  for (; null !== Y && !cc(); )
    Uk(Y);
}
function Uk(a2) {
  var b2 = Vk(a2.alternate, a2, fj);
  a2.memoizedProps = a2.pendingProps;
  null === b2 ? Sk(a2) : Y = b2;
  nk.current = null;
}
function Sk(a2) {
  var b2 = a2;
  do {
    var c2 = b2.alternate;
    a2 = b2.return;
    if (0 === (b2.flags & 32768)) {
      if (c2 = Ej(c2, b2, fj), null !== c2) {
        Y = c2;
        return;
      }
    } else {
      c2 = Ij(c2, b2);
      if (null !== c2) {
        c2.flags &= 32767;
        Y = c2;
        return;
      }
      if (null !== a2)
        a2.flags |= 32768, a2.subtreeFlags = 0, a2.deletions = null;
      else {
        T$2 = 6;
        Y = null;
        return;
      }
    }
    b2 = b2.sibling;
    if (null !== b2) {
      Y = b2;
      return;
    }
    Y = b2 = a2;
  } while (null !== b2);
  0 === T$2 && (T$2 = 5);
}
function Pk(a2, b2, c2) {
  var d2 = C$2, e2 = ok.transition;
  try {
    ok.transition = null, C$2 = 1, Wk(a2, b2, c2, d2);
  } finally {
    ok.transition = e2, C$2 = d2;
  }
  return null;
}
function Wk(a2, b2, c2, d2) {
  do
    Hk();
  while (null !== wk);
  if (0 !== (K & 6))
    throw Error(p$1(327));
  c2 = a2.finishedWork;
  var e2 = a2.finishedLanes;
  if (null === c2)
    return null;
  a2.finishedWork = null;
  a2.finishedLanes = 0;
  if (c2 === a2.current)
    throw Error(p$1(177));
  a2.callbackNode = null;
  a2.callbackPriority = 0;
  var f2 = c2.lanes | c2.childLanes;
  Bc(a2, f2);
  a2 === Q && (Y = Q = null, Z = 0);
  0 === (c2.subtreeFlags & 2064) && 0 === (c2.flags & 2064) || vk || (vk = true, Fk(hc, function() {
    Hk();
    return null;
  }));
  f2 = 0 !== (c2.flags & 15990);
  if (0 !== (c2.subtreeFlags & 15990) || f2) {
    f2 = ok.transition;
    ok.transition = null;
    var g2 = C$2;
    C$2 = 1;
    var h2 = K;
    K |= 4;
    nk.current = null;
    Oj(a2, c2);
    dk(c2, a2);
    Oe(Df);
    dd = !!Cf;
    Df = Cf = null;
    a2.current = c2;
    hk(c2);
    dc();
    K = h2;
    C$2 = g2;
    ok.transition = f2;
  } else
    a2.current = c2;
  vk && (vk = false, wk = a2, xk = e2);
  f2 = a2.pendingLanes;
  0 === f2 && (Ri = null);
  mc(c2.stateNode);
  Dk(a2, B());
  if (null !== b2)
    for (d2 = a2.onRecoverableError, c2 = 0; c2 < b2.length; c2++)
      e2 = b2[c2], d2(e2.value, { componentStack: e2.stack, digest: e2.digest });
  if (Oi)
    throw Oi = false, a2 = Pi, Pi = null, a2;
  0 !== (xk & 1) && 0 !== a2.tag && Hk();
  f2 = a2.pendingLanes;
  0 !== (f2 & 1) ? a2 === zk ? yk++ : (yk = 0, zk = a2) : yk = 0;
  jg();
  return null;
}
function Hk() {
  if (null !== wk) {
    var a2 = Dc(xk), b2 = ok.transition, c2 = C$2;
    try {
      ok.transition = null;
      C$2 = 16 > a2 ? 16 : a2;
      if (null === wk)
        var d2 = false;
      else {
        a2 = wk;
        wk = null;
        xk = 0;
        if (0 !== (K & 6))
          throw Error(p$1(331));
        var e2 = K;
        K |= 4;
        for (V = a2.current; null !== V; ) {
          var f2 = V, g2 = f2.child;
          if (0 !== (V.flags & 16)) {
            var h2 = f2.deletions;
            if (null !== h2) {
              for (var k2 = 0; k2 < h2.length; k2++) {
                var l2 = h2[k2];
                for (V = l2; null !== V; ) {
                  var m2 = V;
                  switch (m2.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Pj(8, m2, f2);
                  }
                  var q2 = m2.child;
                  if (null !== q2)
                    q2.return = m2, V = q2;
                  else
                    for (; null !== V; ) {
                      m2 = V;
                      var r2 = m2.sibling, y2 = m2.return;
                      Sj(m2);
                      if (m2 === l2) {
                        V = null;
                        break;
                      }
                      if (null !== r2) {
                        r2.return = y2;
                        V = r2;
                        break;
                      }
                      V = y2;
                    }
                }
              }
              var n2 = f2.alternate;
              if (null !== n2) {
                var t2 = n2.child;
                if (null !== t2) {
                  n2.child = null;
                  do {
                    var J2 = t2.sibling;
                    t2.sibling = null;
                    t2 = J2;
                  } while (null !== t2);
                }
              }
              V = f2;
            }
          }
          if (0 !== (f2.subtreeFlags & 2064) && null !== g2)
            g2.return = f2, V = g2;
          else
            b:
              for (; null !== V; ) {
                f2 = V;
                if (0 !== (f2.flags & 2048))
                  switch (f2.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Pj(9, f2, f2.return);
                  }
                var x2 = f2.sibling;
                if (null !== x2) {
                  x2.return = f2.return;
                  V = x2;
                  break b;
                }
                V = f2.return;
              }
        }
        var w2 = a2.current;
        for (V = w2; null !== V; ) {
          g2 = V;
          var u2 = g2.child;
          if (0 !== (g2.subtreeFlags & 2064) && null !== u2)
            u2.return = g2, V = u2;
          else
            b:
              for (g2 = w2; null !== V; ) {
                h2 = V;
                if (0 !== (h2.flags & 2048))
                  try {
                    switch (h2.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Qj(9, h2);
                    }
                  } catch (na) {
                    W(h2, h2.return, na);
                  }
                if (h2 === g2) {
                  V = null;
                  break b;
                }
                var F2 = h2.sibling;
                if (null !== F2) {
                  F2.return = h2.return;
                  V = F2;
                  break b;
                }
                V = h2.return;
              }
        }
        K = e2;
        jg();
        if (lc && "function" === typeof lc.onPostCommitFiberRoot)
          try {
            lc.onPostCommitFiberRoot(kc, a2);
          } catch (na) {
          }
        d2 = true;
      }
      return d2;
    } finally {
      C$2 = c2, ok.transition = b2;
    }
  }
  return false;
}
function Xk(a2, b2, c2) {
  b2 = Ji(c2, b2);
  b2 = Ni(a2, b2, 1);
  a2 = nh(a2, b2, 1);
  b2 = R$1();
  null !== a2 && (Ac(a2, 1, b2), Dk(a2, b2));
}
function W(a2, b2, c2) {
  if (3 === a2.tag)
    Xk(a2, a2, c2);
  else
    for (; null !== b2; ) {
      if (3 === b2.tag) {
        Xk(b2, a2, c2);
        break;
      } else if (1 === b2.tag) {
        var d2 = b2.stateNode;
        if ("function" === typeof b2.type.getDerivedStateFromError || "function" === typeof d2.componentDidCatch && (null === Ri || !Ri.has(d2))) {
          a2 = Ji(c2, a2);
          a2 = Qi(b2, a2, 1);
          b2 = nh(b2, a2, 1);
          a2 = R$1();
          null !== b2 && (Ac(b2, 1, a2), Dk(b2, a2));
          break;
        }
      }
      b2 = b2.return;
    }
}
function Ti(a2, b2, c2) {
  var d2 = a2.pingCache;
  null !== d2 && d2.delete(b2);
  b2 = R$1();
  a2.pingedLanes |= a2.suspendedLanes & c2;
  Q === a2 && (Z & c2) === c2 && (4 === T$2 || 3 === T$2 && (Z & 130023424) === Z && 500 > B() - fk ? Kk(a2, 0) : rk |= c2);
  Dk(a2, b2);
}
function Yk(a2, b2) {
  0 === b2 && (0 === (a2.mode & 1) ? b2 = 1 : (b2 = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
  var c2 = R$1();
  a2 = ih(a2, b2);
  null !== a2 && (Ac(a2, b2, c2), Dk(a2, c2));
}
function uj(a2) {
  var b2 = a2.memoizedState, c2 = 0;
  null !== b2 && (c2 = b2.retryLane);
  Yk(a2, c2);
}
function bk(a2, b2) {
  var c2 = 0;
  switch (a2.tag) {
    case 13:
      var d2 = a2.stateNode;
      var e2 = a2.memoizedState;
      null !== e2 && (c2 = e2.retryLane);
      break;
    case 19:
      d2 = a2.stateNode;
      break;
    default:
      throw Error(p$1(314));
  }
  null !== d2 && d2.delete(b2);
  Yk(a2, c2);
}
var Vk;
Vk = function(a2, b2, c2) {
  if (null !== a2)
    if (a2.memoizedProps !== b2.pendingProps || Wf.current)
      dh = true;
    else {
      if (0 === (a2.lanes & c2) && 0 === (b2.flags & 128))
        return dh = false, yj(a2, b2, c2);
      dh = 0 !== (a2.flags & 131072) ? true : false;
    }
  else
    dh = false, I$3 && 0 !== (b2.flags & 1048576) && ug(b2, ng, b2.index);
  b2.lanes = 0;
  switch (b2.tag) {
    case 2:
      var d2 = b2.type;
      ij(a2, b2);
      a2 = b2.pendingProps;
      var e2 = Yf(b2, H$1.current);
      ch(b2, c2);
      e2 = Nh(null, b2, d2, a2, e2, c2);
      var f2 = Sh();
      b2.flags |= 1;
      "object" === typeof e2 && null !== e2 && "function" === typeof e2.render && void 0 === e2.$$typeof ? (b2.tag = 1, b2.memoizedState = null, b2.updateQueue = null, Zf(d2) ? (f2 = true, cg(b2)) : f2 = false, b2.memoizedState = null !== e2.state && void 0 !== e2.state ? e2.state : null, kh(b2), e2.updater = Ei, b2.stateNode = e2, e2._reactInternals = b2, Ii(b2, d2, a2, c2), b2 = jj(null, b2, d2, true, f2, c2)) : (b2.tag = 0, I$3 && f2 && vg(b2), Xi(null, b2, e2, c2), b2 = b2.child);
      return b2;
    case 16:
      d2 = b2.elementType;
      a: {
        ij(a2, b2);
        a2 = b2.pendingProps;
        e2 = d2._init;
        d2 = e2(d2._payload);
        b2.type = d2;
        e2 = b2.tag = Zk(d2);
        a2 = Ci(d2, a2);
        switch (e2) {
          case 0:
            b2 = cj(null, b2, d2, a2, c2);
            break a;
          case 1:
            b2 = hj(null, b2, d2, a2, c2);
            break a;
          case 11:
            b2 = Yi(null, b2, d2, a2, c2);
            break a;
          case 14:
            b2 = $i(null, b2, d2, Ci(d2.type, a2), c2);
            break a;
        }
        throw Error(p$1(
          306,
          d2,
          ""
        ));
      }
      return b2;
    case 0:
      return d2 = b2.type, e2 = b2.pendingProps, e2 = b2.elementType === d2 ? e2 : Ci(d2, e2), cj(a2, b2, d2, e2, c2);
    case 1:
      return d2 = b2.type, e2 = b2.pendingProps, e2 = b2.elementType === d2 ? e2 : Ci(d2, e2), hj(a2, b2, d2, e2, c2);
    case 3:
      a: {
        kj(b2);
        if (null === a2)
          throw Error(p$1(387));
        d2 = b2.pendingProps;
        f2 = b2.memoizedState;
        e2 = f2.element;
        lh(a2, b2);
        qh(b2, d2, null, c2);
        var g2 = b2.memoizedState;
        d2 = g2.element;
        if (f2.isDehydrated)
          if (f2 = { element: d2, isDehydrated: false, cache: g2.cache, pendingSuspenseBoundaries: g2.pendingSuspenseBoundaries, transitions: g2.transitions }, b2.updateQueue.baseState = f2, b2.memoizedState = f2, b2.flags & 256) {
            e2 = Ji(Error(p$1(423)), b2);
            b2 = lj(a2, b2, d2, c2, e2);
            break a;
          } else if (d2 !== e2) {
            e2 = Ji(Error(p$1(424)), b2);
            b2 = lj(a2, b2, d2, c2, e2);
            break a;
          } else
            for (yg = Lf(b2.stateNode.containerInfo.firstChild), xg = b2, I$3 = true, zg = null, c2 = Vg(b2, null, d2, c2), b2.child = c2; c2; )
              c2.flags = c2.flags & -3 | 4096, c2 = c2.sibling;
        else {
          Ig();
          if (d2 === e2) {
            b2 = Zi(a2, b2, c2);
            break a;
          }
          Xi(a2, b2, d2, c2);
        }
        b2 = b2.child;
      }
      return b2;
    case 5:
      return Ah(b2), null === a2 && Eg(b2), d2 = b2.type, e2 = b2.pendingProps, f2 = null !== a2 ? a2.memoizedProps : null, g2 = e2.children, Ef(d2, e2) ? g2 = null : null !== f2 && Ef(d2, f2) && (b2.flags |= 32), gj(a2, b2), Xi(a2, b2, g2, c2), b2.child;
    case 6:
      return null === a2 && Eg(b2), null;
    case 13:
      return oj(a2, b2, c2);
    case 4:
      return yh(b2, b2.stateNode.containerInfo), d2 = b2.pendingProps, null === a2 ? b2.child = Ug(b2, null, d2, c2) : Xi(a2, b2, d2, c2), b2.child;
    case 11:
      return d2 = b2.type, e2 = b2.pendingProps, e2 = b2.elementType === d2 ? e2 : Ci(d2, e2), Yi(a2, b2, d2, e2, c2);
    case 7:
      return Xi(a2, b2, b2.pendingProps, c2), b2.child;
    case 8:
      return Xi(a2, b2, b2.pendingProps.children, c2), b2.child;
    case 12:
      return Xi(a2, b2, b2.pendingProps.children, c2), b2.child;
    case 10:
      a: {
        d2 = b2.type._context;
        e2 = b2.pendingProps;
        f2 = b2.memoizedProps;
        g2 = e2.value;
        G(Wg, d2._currentValue);
        d2._currentValue = g2;
        if (null !== f2)
          if (He$1(f2.value, g2)) {
            if (f2.children === e2.children && !Wf.current) {
              b2 = Zi(a2, b2, c2);
              break a;
            }
          } else
            for (f2 = b2.child, null !== f2 && (f2.return = b2); null !== f2; ) {
              var h2 = f2.dependencies;
              if (null !== h2) {
                g2 = f2.child;
                for (var k2 = h2.firstContext; null !== k2; ) {
                  if (k2.context === d2) {
                    if (1 === f2.tag) {
                      k2 = mh(-1, c2 & -c2);
                      k2.tag = 2;
                      var l2 = f2.updateQueue;
                      if (null !== l2) {
                        l2 = l2.shared;
                        var m2 = l2.pending;
                        null === m2 ? k2.next = k2 : (k2.next = m2.next, m2.next = k2);
                        l2.pending = k2;
                      }
                    }
                    f2.lanes |= c2;
                    k2 = f2.alternate;
                    null !== k2 && (k2.lanes |= c2);
                    bh(
                      f2.return,
                      c2,
                      b2
                    );
                    h2.lanes |= c2;
                    break;
                  }
                  k2 = k2.next;
                }
              } else if (10 === f2.tag)
                g2 = f2.type === b2.type ? null : f2.child;
              else if (18 === f2.tag) {
                g2 = f2.return;
                if (null === g2)
                  throw Error(p$1(341));
                g2.lanes |= c2;
                h2 = g2.alternate;
                null !== h2 && (h2.lanes |= c2);
                bh(g2, c2, b2);
                g2 = f2.sibling;
              } else
                g2 = f2.child;
              if (null !== g2)
                g2.return = f2;
              else
                for (g2 = f2; null !== g2; ) {
                  if (g2 === b2) {
                    g2 = null;
                    break;
                  }
                  f2 = g2.sibling;
                  if (null !== f2) {
                    f2.return = g2.return;
                    g2 = f2;
                    break;
                  }
                  g2 = g2.return;
                }
              f2 = g2;
            }
        Xi(a2, b2, e2.children, c2);
        b2 = b2.child;
      }
      return b2;
    case 9:
      return e2 = b2.type, d2 = b2.pendingProps.children, ch(b2, c2), e2 = eh(e2), d2 = d2(e2), b2.flags |= 1, Xi(a2, b2, d2, c2), b2.child;
    case 14:
      return d2 = b2.type, e2 = Ci(d2, b2.pendingProps), e2 = Ci(d2.type, e2), $i(a2, b2, d2, e2, c2);
    case 15:
      return bj(a2, b2, b2.type, b2.pendingProps, c2);
    case 17:
      return d2 = b2.type, e2 = b2.pendingProps, e2 = b2.elementType === d2 ? e2 : Ci(d2, e2), ij(a2, b2), b2.tag = 1, Zf(d2) ? (a2 = true, cg(b2)) : a2 = false, ch(b2, c2), Gi(b2, d2, e2), Ii(b2, d2, e2, c2), jj(null, b2, d2, true, a2, c2);
    case 19:
      return xj(a2, b2, c2);
    case 22:
      return dj(a2, b2, c2);
  }
  throw Error(p$1(156, b2.tag));
};
function Fk(a2, b2) {
  return ac(a2, b2);
}
function $k(a2, b2, c2, d2) {
  this.tag = a2;
  this.key = c2;
  this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = b2;
  this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
  this.mode = d2;
  this.subtreeFlags = this.flags = 0;
  this.deletions = null;
  this.childLanes = this.lanes = 0;
  this.alternate = null;
}
function Bg(a2, b2, c2, d2) {
  return new $k(a2, b2, c2, d2);
}
function aj(a2) {
  a2 = a2.prototype;
  return !(!a2 || !a2.isReactComponent);
}
function Zk(a2) {
  if ("function" === typeof a2)
    return aj(a2) ? 1 : 0;
  if (void 0 !== a2 && null !== a2) {
    a2 = a2.$$typeof;
    if (a2 === Da)
      return 11;
    if (a2 === Ga)
      return 14;
  }
  return 2;
}
function Pg(a2, b2) {
  var c2 = a2.alternate;
  null === c2 ? (c2 = Bg(a2.tag, b2, a2.key, a2.mode), c2.elementType = a2.elementType, c2.type = a2.type, c2.stateNode = a2.stateNode, c2.alternate = a2, a2.alternate = c2) : (c2.pendingProps = b2, c2.type = a2.type, c2.flags = 0, c2.subtreeFlags = 0, c2.deletions = null);
  c2.flags = a2.flags & 14680064;
  c2.childLanes = a2.childLanes;
  c2.lanes = a2.lanes;
  c2.child = a2.child;
  c2.memoizedProps = a2.memoizedProps;
  c2.memoizedState = a2.memoizedState;
  c2.updateQueue = a2.updateQueue;
  b2 = a2.dependencies;
  c2.dependencies = null === b2 ? null : { lanes: b2.lanes, firstContext: b2.firstContext };
  c2.sibling = a2.sibling;
  c2.index = a2.index;
  c2.ref = a2.ref;
  return c2;
}
function Rg(a2, b2, c2, d2, e2, f2) {
  var g2 = 2;
  d2 = a2;
  if ("function" === typeof a2)
    aj(a2) && (g2 = 1);
  else if ("string" === typeof a2)
    g2 = 5;
  else
    a:
      switch (a2) {
        case ya:
          return Tg(c2.children, e2, f2, b2);
        case za:
          g2 = 8;
          e2 |= 8;
          break;
        case Aa:
          return a2 = Bg(12, c2, b2, e2 | 2), a2.elementType = Aa, a2.lanes = f2, a2;
        case Ea:
          return a2 = Bg(13, c2, b2, e2), a2.elementType = Ea, a2.lanes = f2, a2;
        case Fa:
          return a2 = Bg(19, c2, b2, e2), a2.elementType = Fa, a2.lanes = f2, a2;
        case Ia:
          return pj(c2, e2, f2, b2);
        default:
          if ("object" === typeof a2 && null !== a2)
            switch (a2.$$typeof) {
              case Ba:
                g2 = 10;
                break a;
              case Ca:
                g2 = 9;
                break a;
              case Da:
                g2 = 11;
                break a;
              case Ga:
                g2 = 14;
                break a;
              case Ha:
                g2 = 16;
                d2 = null;
                break a;
            }
          throw Error(p$1(130, null == a2 ? a2 : typeof a2, ""));
      }
  b2 = Bg(g2, c2, b2, e2);
  b2.elementType = a2;
  b2.type = d2;
  b2.lanes = f2;
  return b2;
}
function Tg(a2, b2, c2, d2) {
  a2 = Bg(7, a2, d2, b2);
  a2.lanes = c2;
  return a2;
}
function pj(a2, b2, c2, d2) {
  a2 = Bg(22, a2, d2, b2);
  a2.elementType = Ia;
  a2.lanes = c2;
  a2.stateNode = { isHidden: false };
  return a2;
}
function Qg(a2, b2, c2) {
  a2 = Bg(6, a2, null, b2);
  a2.lanes = c2;
  return a2;
}
function Sg(a2, b2, c2) {
  b2 = Bg(4, null !== a2.children ? a2.children : [], a2.key, b2);
  b2.lanes = c2;
  b2.stateNode = { containerInfo: a2.containerInfo, pendingChildren: null, implementation: a2.implementation };
  return b2;
}
function al(a2, b2, c2, d2, e2) {
  this.tag = b2;
  this.containerInfo = a2;
  this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
  this.timeoutHandle = -1;
  this.callbackNode = this.pendingContext = this.context = null;
  this.callbackPriority = 0;
  this.eventTimes = zc(0);
  this.expirationTimes = zc(-1);
  this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
  this.entanglements = zc(0);
  this.identifierPrefix = d2;
  this.onRecoverableError = e2;
  this.mutableSourceEagerHydrationData = null;
}
function bl(a2, b2, c2, d2, e2, f2, g2, h2, k2) {
  a2 = new al(a2, b2, c2, h2, k2);
  1 === b2 ? (b2 = 1, true === f2 && (b2 |= 8)) : b2 = 0;
  f2 = Bg(3, null, null, b2);
  a2.current = f2;
  f2.stateNode = a2;
  f2.memoizedState = { element: d2, isDehydrated: c2, cache: null, transitions: null, pendingSuspenseBoundaries: null };
  kh(f2);
  return a2;
}
function cl(a2, b2, c2) {
  var d2 = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
  return { $$typeof: wa, key: null == d2 ? null : "" + d2, children: a2, containerInfo: b2, implementation: c2 };
}
function dl(a2) {
  if (!a2)
    return Vf;
  a2 = a2._reactInternals;
  a: {
    if (Vb(a2) !== a2 || 1 !== a2.tag)
      throw Error(p$1(170));
    var b2 = a2;
    do {
      switch (b2.tag) {
        case 3:
          b2 = b2.stateNode.context;
          break a;
        case 1:
          if (Zf(b2.type)) {
            b2 = b2.stateNode.__reactInternalMemoizedMergedChildContext;
            break a;
          }
      }
      b2 = b2.return;
    } while (null !== b2);
    throw Error(p$1(171));
  }
  if (1 === a2.tag) {
    var c2 = a2.type;
    if (Zf(c2))
      return bg(a2, c2, b2);
  }
  return b2;
}
function el(a2, b2, c2, d2, e2, f2, g2, h2, k2) {
  a2 = bl(c2, d2, true, a2, e2, f2, g2, h2, k2);
  a2.context = dl(null);
  c2 = a2.current;
  d2 = R$1();
  e2 = yi(c2);
  f2 = mh(d2, e2);
  f2.callback = void 0 !== b2 && null !== b2 ? b2 : null;
  nh(c2, f2, e2);
  a2.current.lanes = e2;
  Ac(a2, e2, d2);
  Dk(a2, d2);
  return a2;
}
function fl(a2, b2, c2, d2) {
  var e2 = b2.current, f2 = R$1(), g2 = yi(e2);
  c2 = dl(c2);
  null === b2.context ? b2.context = c2 : b2.pendingContext = c2;
  b2 = mh(f2, g2);
  b2.payload = { element: a2 };
  d2 = void 0 === d2 ? null : d2;
  null !== d2 && (b2.callback = d2);
  a2 = nh(e2, b2, g2);
  null !== a2 && (gi(a2, e2, g2, f2), oh(a2, e2, g2));
  return g2;
}
function gl(a2) {
  a2 = a2.current;
  if (!a2.child)
    return null;
  switch (a2.child.tag) {
    case 5:
      return a2.child.stateNode;
    default:
      return a2.child.stateNode;
  }
}
function hl(a2, b2) {
  a2 = a2.memoizedState;
  if (null !== a2 && null !== a2.dehydrated) {
    var c2 = a2.retryLane;
    a2.retryLane = 0 !== c2 && c2 < b2 ? c2 : b2;
  }
}
function il(a2, b2) {
  hl(a2, b2);
  (a2 = a2.alternate) && hl(a2, b2);
}
function jl() {
  return null;
}
var kl = "function" === typeof reportError ? reportError : function(a2) {
  console.error(a2);
};
function ll(a2) {
  this._internalRoot = a2;
}
ml.prototype.render = ll.prototype.render = function(a2) {
  var b2 = this._internalRoot;
  if (null === b2)
    throw Error(p$1(409));
  fl(a2, b2, null, null);
};
ml.prototype.unmount = ll.prototype.unmount = function() {
  var a2 = this._internalRoot;
  if (null !== a2) {
    this._internalRoot = null;
    var b2 = a2.containerInfo;
    Rk(function() {
      fl(null, a2, null, null);
    });
    b2[uf] = null;
  }
};
function ml(a2) {
  this._internalRoot = a2;
}
ml.prototype.unstable_scheduleHydration = function(a2) {
  if (a2) {
    var b2 = Hc();
    a2 = { blockedOn: null, target: a2, priority: b2 };
    for (var c2 = 0; c2 < Qc.length && 0 !== b2 && b2 < Qc[c2].priority; c2++)
      ;
    Qc.splice(c2, 0, a2);
    0 === c2 && Vc(a2);
  }
};
function nl(a2) {
  return !(!a2 || 1 !== a2.nodeType && 9 !== a2.nodeType && 11 !== a2.nodeType);
}
function ol(a2) {
  return !(!a2 || 1 !== a2.nodeType && 9 !== a2.nodeType && 11 !== a2.nodeType && (8 !== a2.nodeType || " react-mount-point-unstable " !== a2.nodeValue));
}
function pl() {
}
function ql(a2, b2, c2, d2, e2) {
  if (e2) {
    if ("function" === typeof d2) {
      var f2 = d2;
      d2 = function() {
        var a3 = gl(g2);
        f2.call(a3);
      };
    }
    var g2 = el(b2, d2, a2, 0, null, false, false, "", pl);
    a2._reactRootContainer = g2;
    a2[uf] = g2.current;
    sf(8 === a2.nodeType ? a2.parentNode : a2);
    Rk();
    return g2;
  }
  for (; e2 = a2.lastChild; )
    a2.removeChild(e2);
  if ("function" === typeof d2) {
    var h2 = d2;
    d2 = function() {
      var a3 = gl(k2);
      h2.call(a3);
    };
  }
  var k2 = bl(a2, 0, false, null, null, false, false, "", pl);
  a2._reactRootContainer = k2;
  a2[uf] = k2.current;
  sf(8 === a2.nodeType ? a2.parentNode : a2);
  Rk(function() {
    fl(b2, k2, c2, d2);
  });
  return k2;
}
function rl(a2, b2, c2, d2, e2) {
  var f2 = c2._reactRootContainer;
  if (f2) {
    var g2 = f2;
    if ("function" === typeof e2) {
      var h2 = e2;
      e2 = function() {
        var a3 = gl(g2);
        h2.call(a3);
      };
    }
    fl(b2, g2, a2, e2);
  } else
    g2 = ql(c2, b2, a2, e2, d2);
  return gl(g2);
}
Ec = function(a2) {
  switch (a2.tag) {
    case 3:
      var b2 = a2.stateNode;
      if (b2.current.memoizedState.isDehydrated) {
        var c2 = tc(b2.pendingLanes);
        0 !== c2 && (Cc(b2, c2 | 1), Dk(b2, B()), 0 === (K & 6) && (Gj = B() + 500, jg()));
      }
      break;
    case 13:
      Rk(function() {
        var b3 = ih(a2, 1);
        if (null !== b3) {
          var c3 = R$1();
          gi(b3, a2, 1, c3);
        }
      }), il(a2, 1);
  }
};
Fc = function(a2) {
  if (13 === a2.tag) {
    var b2 = ih(a2, 134217728);
    if (null !== b2) {
      var c2 = R$1();
      gi(b2, a2, 134217728, c2);
    }
    il(a2, 134217728);
  }
};
Gc = function(a2) {
  if (13 === a2.tag) {
    var b2 = yi(a2), c2 = ih(a2, b2);
    if (null !== c2) {
      var d2 = R$1();
      gi(c2, a2, b2, d2);
    }
    il(a2, b2);
  }
};
Hc = function() {
  return C$2;
};
Ic = function(a2, b2) {
  var c2 = C$2;
  try {
    return C$2 = a2, b2();
  } finally {
    C$2 = c2;
  }
};
yb = function(a2, b2, c2) {
  switch (b2) {
    case "input":
      bb(a2, c2);
      b2 = c2.name;
      if ("radio" === c2.type && null != b2) {
        for (c2 = a2; c2.parentNode; )
          c2 = c2.parentNode;
        c2 = c2.querySelectorAll("input[name=" + JSON.stringify("" + b2) + '][type="radio"]');
        for (b2 = 0; b2 < c2.length; b2++) {
          var d2 = c2[b2];
          if (d2 !== a2 && d2.form === a2.form) {
            var e2 = Db(d2);
            if (!e2)
              throw Error(p$1(90));
            Wa(d2);
            bb(d2, e2);
          }
        }
      }
      break;
    case "textarea":
      ib(a2, c2);
      break;
    case "select":
      b2 = c2.value, null != b2 && fb(a2, !!c2.multiple, b2, false);
  }
};
Gb = Qk;
Hb = Rk;
var sl = { usingClientEntryPoint: false, Events: [Cb, ue$1, Db, Eb, Fb, Qk] }, tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a2) {
  a2 = Zb(a2);
  return null === a2 ? null : a2.stateNode;
}, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
  var vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!vl.isDisabled && vl.supportsFiber)
    try {
      kc = vl.inject(ul), lc = vl;
    } catch (a2) {
    }
}
reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
reactDom_production_min.createPortal = function(a2, b2) {
  var c2 = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
  if (!nl(b2))
    throw Error(p$1(200));
  return cl(a2, b2, null, c2);
};
reactDom_production_min.createRoot = function(a2, b2) {
  if (!nl(a2))
    throw Error(p$1(299));
  var c2 = false, d2 = "", e2 = kl;
  null !== b2 && void 0 !== b2 && (true === b2.unstable_strictMode && (c2 = true), void 0 !== b2.identifierPrefix && (d2 = b2.identifierPrefix), void 0 !== b2.onRecoverableError && (e2 = b2.onRecoverableError));
  b2 = bl(a2, 1, false, null, null, c2, false, d2, e2);
  a2[uf] = b2.current;
  sf(8 === a2.nodeType ? a2.parentNode : a2);
  return new ll(b2);
};
reactDom_production_min.findDOMNode = function(a2) {
  if (null == a2)
    return null;
  if (1 === a2.nodeType)
    return a2;
  var b2 = a2._reactInternals;
  if (void 0 === b2) {
    if ("function" === typeof a2.render)
      throw Error(p$1(188));
    a2 = Object.keys(a2).join(",");
    throw Error(p$1(268, a2));
  }
  a2 = Zb(b2);
  a2 = null === a2 ? null : a2.stateNode;
  return a2;
};
reactDom_production_min.flushSync = function(a2) {
  return Rk(a2);
};
reactDom_production_min.hydrate = function(a2, b2, c2) {
  if (!ol(b2))
    throw Error(p$1(200));
  return rl(null, a2, b2, true, c2);
};
reactDom_production_min.hydrateRoot = function(a2, b2, c2) {
  if (!nl(a2))
    throw Error(p$1(405));
  var d2 = null != c2 && c2.hydratedSources || null, e2 = false, f2 = "", g2 = kl;
  null !== c2 && void 0 !== c2 && (true === c2.unstable_strictMode && (e2 = true), void 0 !== c2.identifierPrefix && (f2 = c2.identifierPrefix), void 0 !== c2.onRecoverableError && (g2 = c2.onRecoverableError));
  b2 = el(b2, null, a2, 1, null != c2 ? c2 : null, e2, false, f2, g2);
  a2[uf] = b2.current;
  sf(a2);
  if (d2)
    for (a2 = 0; a2 < d2.length; a2++)
      c2 = d2[a2], e2 = c2._getVersion, e2 = e2(c2._source), null == b2.mutableSourceEagerHydrationData ? b2.mutableSourceEagerHydrationData = [c2, e2] : b2.mutableSourceEagerHydrationData.push(
        c2,
        e2
      );
  return new ml(b2);
};
reactDom_production_min.render = function(a2, b2, c2) {
  if (!ol(b2))
    throw Error(p$1(200));
  return rl(null, a2, b2, false, c2);
};
reactDom_production_min.unmountComponentAtNode = function(a2) {
  if (!ol(a2))
    throw Error(p$1(40));
  return a2._reactRootContainer ? (Rk(function() {
    rl(null, null, a2, false, function() {
      a2._reactRootContainer = null;
      a2[uf] = null;
    });
  }), true) : false;
};
reactDom_production_min.unstable_batchedUpdates = Qk;
reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a2, b2, c2, d2) {
  if (!ol(c2))
    throw Error(p$1(200));
  if (null == a2 || void 0 === a2._reactInternals)
    throw Error(p$1(38));
  return rl(a2, b2, c2, false, d2);
};
reactDom_production_min.version = "18.3.1-next-f1338f8080-20240426";
function checkDCE() {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
    return;
  }
  try {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    console.error(err);
  }
}
{
  checkDCE();
  reactDom.exports = reactDom_production_min;
}
var reactDomExports = reactDom.exports;
var m$1 = reactDomExports;
{
  client.createRoot = m$1.createRoot;
  client.hydrateRoot = m$1.hydrateRoot;
}
/**
 * @remix-run/router v1.23.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends$2() {
  _extends$2 = Object.assign ? Object.assign.bind() : function(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = arguments[i2];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$2.apply(this, arguments);
}
var Action;
(function(Action2) {
  Action2["Pop"] = "POP";
  Action2["Push"] = "PUSH";
  Action2["Replace"] = "REPLACE";
})(Action || (Action = {}));
const PopStateEventType = "popstate";
function createBrowserHistory(options) {
  if (options === void 0) {
    options = {};
  }
  function createBrowserLocation(window2, globalHistory) {
    let {
      pathname,
      search,
      hash
    } = window2.location;
    return createLocation(
      "",
      {
        pathname,
        search,
        hash
      },
      // state defaults to `null` because `window.history.state` does
      globalHistory.state && globalHistory.state.usr || null,
      globalHistory.state && globalHistory.state.key || "default"
    );
  }
  function createBrowserHref(window2, to) {
    return typeof to === "string" ? to : createPath(to);
  }
  return getUrlBasedHistory(createBrowserLocation, createBrowserHref, null, options);
}
function invariant(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
function warning(cond, message) {
  if (!cond) {
    if (typeof console !== "undefined")
      console.warn(message);
    try {
      throw new Error(message);
    } catch (e2) {
    }
  }
}
function createKey() {
  return Math.random().toString(36).substr(2, 8);
}
function getHistoryState(location2, index2) {
  return {
    usr: location2.state,
    key: location2.key,
    idx: index2
  };
}
function createLocation(current, to, state, key) {
  if (state === void 0) {
    state = null;
  }
  let location2 = _extends$2({
    pathname: typeof current === "string" ? current : current.pathname,
    search: "",
    hash: ""
  }, typeof to === "string" ? parsePath(to) : to, {
    state,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: to && to.key || key || createKey()
  });
  return location2;
}
function createPath(_ref) {
  let {
    pathname = "/",
    search = "",
    hash = ""
  } = _ref;
  if (search && search !== "?")
    pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#")
    pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
function parsePath(path) {
  let parsedPath = {};
  if (path) {
    let hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }
    let searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
}
function getUrlBasedHistory(getLocation, createHref, validateLocation, options) {
  if (options === void 0) {
    options = {};
  }
  let {
    window: window2 = document.defaultView,
    v5Compat = false
  } = options;
  let globalHistory = window2.history;
  let action = Action.Pop;
  let listener = null;
  let index2 = getIndex();
  if (index2 == null) {
    index2 = 0;
    globalHistory.replaceState(_extends$2({}, globalHistory.state, {
      idx: index2
    }), "");
  }
  function getIndex() {
    let state = globalHistory.state || {
      idx: null
    };
    return state.idx;
  }
  function handlePop() {
    action = Action.Pop;
    let nextIndex = getIndex();
    let delta = nextIndex == null ? null : nextIndex - index2;
    index2 = nextIndex;
    if (listener) {
      listener({
        action,
        location: history.location,
        delta
      });
    }
  }
  function push(to, state) {
    action = Action.Push;
    let location2 = createLocation(history.location, to, state);
    if (validateLocation)
      validateLocation(location2, to);
    index2 = getIndex() + 1;
    let historyState = getHistoryState(location2, index2);
    let url2 = history.createHref(location2);
    try {
      globalHistory.pushState(historyState, "", url2);
    } catch (error) {
      if (error instanceof DOMException && error.name === "DataCloneError") {
        throw error;
      }
      window2.location.assign(url2);
    }
    if (v5Compat && listener) {
      listener({
        action,
        location: history.location,
        delta: 1
      });
    }
  }
  function replace(to, state) {
    action = Action.Replace;
    let location2 = createLocation(history.location, to, state);
    if (validateLocation)
      validateLocation(location2, to);
    index2 = getIndex();
    let historyState = getHistoryState(location2, index2);
    let url2 = history.createHref(location2);
    globalHistory.replaceState(historyState, "", url2);
    if (v5Compat && listener) {
      listener({
        action,
        location: history.location,
        delta: 0
      });
    }
  }
  function createURL(to) {
    let base = window2.location.origin !== "null" ? window2.location.origin : window2.location.href;
    let href = typeof to === "string" ? to : createPath(to);
    href = href.replace(/ $/, "%20");
    invariant(base, "No window.location.(origin|href) available to create URL for href: " + href);
    return new URL(href, base);
  }
  let history = {
    get action() {
      return action;
    },
    get location() {
      return getLocation(window2, globalHistory);
    },
    listen(fn) {
      if (listener) {
        throw new Error("A history only accepts one active listener");
      }
      window2.addEventListener(PopStateEventType, handlePop);
      listener = fn;
      return () => {
        window2.removeEventListener(PopStateEventType, handlePop);
        listener = null;
      };
    },
    createHref(to) {
      return createHref(window2, to);
    },
    createURL,
    encodeLocation(to) {
      let url2 = createURL(to);
      return {
        pathname: url2.pathname,
        search: url2.search,
        hash: url2.hash
      };
    },
    push,
    replace,
    go(n2) {
      return globalHistory.go(n2);
    }
  };
  return history;
}
var ResultType;
(function(ResultType2) {
  ResultType2["data"] = "data";
  ResultType2["deferred"] = "deferred";
  ResultType2["redirect"] = "redirect";
  ResultType2["error"] = "error";
})(ResultType || (ResultType = {}));
function matchRoutes(routes, locationArg, basename) {
  if (basename === void 0) {
    basename = "/";
  }
  return matchRoutesImpl(routes, locationArg, basename, false);
}
function matchRoutesImpl(routes, locationArg, basename, allowPartial) {
  let location2 = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
  let pathname = stripBasename(location2.pathname || "/", basename);
  if (pathname == null) {
    return null;
  }
  let branches = flattenRoutes(routes);
  rankRouteBranches(branches);
  let matches = null;
  for (let i2 = 0; matches == null && i2 < branches.length; ++i2) {
    let decoded = decodePath(pathname);
    matches = matchRouteBranch(branches[i2], decoded, allowPartial);
  }
  return matches;
}
function flattenRoutes(routes, branches, parentsMeta, parentPath) {
  if (branches === void 0) {
    branches = [];
  }
  if (parentsMeta === void 0) {
    parentsMeta = [];
  }
  if (parentPath === void 0) {
    parentPath = "";
  }
  let flattenRoute = (route, index2, relativePath) => {
    let meta = {
      relativePath: relativePath === void 0 ? route.path || "" : relativePath,
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index2,
      route
    };
    if (meta.relativePath.startsWith("/")) {
      invariant(meta.relativePath.startsWith(parentPath), 'Absolute route path "' + meta.relativePath + '" nested under path ' + ('"' + parentPath + '" is not valid. An absolute child route path ') + "must start with the combined path of all its parent routes.");
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }
    let path = joinPaths([parentPath, meta.relativePath]);
    let routesMeta = parentsMeta.concat(meta);
    if (route.children && route.children.length > 0) {
      invariant(
        // Our types know better, but runtime JS may not!
        // @ts-expect-error
        route.index !== true,
        "Index routes must not have child routes. Please remove " + ('all child routes from route path "' + path + '".')
      );
      flattenRoutes(route.children, branches, routesMeta, path);
    }
    if (route.path == null && !route.index) {
      return;
    }
    branches.push({
      path,
      score: computeScore(path, route.index),
      routesMeta
    });
  };
  routes.forEach((route, index2) => {
    var _route$path;
    if (route.path === "" || !((_route$path = route.path) != null && _route$path.includes("?"))) {
      flattenRoute(route, index2);
    } else {
      for (let exploded of explodeOptionalSegments(route.path)) {
        flattenRoute(route, index2, exploded);
      }
    }
  });
  return branches;
}
function explodeOptionalSegments(path) {
  let segments = path.split("/");
  if (segments.length === 0)
    return [];
  let [first, ...rest] = segments;
  let isOptional = first.endsWith("?");
  let required3 = first.replace(/\?$/, "");
  if (rest.length === 0) {
    return isOptional ? [required3, ""] : [required3];
  }
  let restExploded = explodeOptionalSegments(rest.join("/"));
  let result = [];
  result.push(...restExploded.map((subpath) => subpath === "" ? required3 : [required3, subpath].join("/")));
  if (isOptional) {
    result.push(...restExploded);
  }
  return result.map((exploded) => path.startsWith("/") && exploded === "" ? "/" : exploded);
}
function rankRouteBranches(branches) {
  branches.sort((a2, b2) => a2.score !== b2.score ? b2.score - a2.score : compareIndexes(a2.routesMeta.map((meta) => meta.childrenIndex), b2.routesMeta.map((meta) => meta.childrenIndex)));
}
const paramRe = /^:[\w-]+$/;
const dynamicSegmentValue = 3;
const indexRouteValue = 2;
const emptySegmentValue = 1;
const staticSegmentValue = 10;
const splatPenalty = -2;
const isSplat = (s2) => s2 === "*";
function computeScore(path, index2) {
  let segments = path.split("/");
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }
  if (index2) {
    initialScore += indexRouteValue;
  }
  return segments.filter((s2) => !isSplat(s2)).reduce((score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue), initialScore);
}
function compareIndexes(a2, b2) {
  let siblings = a2.length === b2.length && a2.slice(0, -1).every((n2, i2) => n2 === b2[i2]);
  return siblings ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    a2[a2.length - 1] - b2[b2.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function matchRouteBranch(branch, pathname, allowPartial) {
  if (allowPartial === void 0) {
    allowPartial = false;
  }
  let {
    routesMeta
  } = branch;
  let matchedParams = {};
  let matchedPathname = "/";
  let matches = [];
  for (let i2 = 0; i2 < routesMeta.length; ++i2) {
    let meta = routesMeta[i2];
    let end = i2 === routesMeta.length - 1;
    let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
    let match = matchPath({
      path: meta.relativePath,
      caseSensitive: meta.caseSensitive,
      end
    }, remainingPathname);
    let route = meta.route;
    if (!match && end && allowPartial && !routesMeta[routesMeta.length - 1].route.index) {
      match = matchPath({
        path: meta.relativePath,
        caseSensitive: meta.caseSensitive,
        end: false
      }, remainingPathname);
    }
    if (!match) {
      return null;
    }
    Object.assign(matchedParams, match.params);
    matches.push({
      // TODO: Can this as be avoided?
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(joinPaths([matchedPathname, match.pathnameBase])),
      route
    });
    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }
  return matches;
}
function matchPath(pattern, pathname) {
  if (typeof pattern === "string") {
    pattern = {
      path: pattern,
      caseSensitive: false,
      end: true
    };
  }
  let [matcher, compiledParams] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);
  let match = pathname.match(matcher);
  if (!match)
    return null;
  let matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  let captureGroups = match.slice(1);
  let params = compiledParams.reduce((memo, _ref, index2) => {
    let {
      paramName,
      isOptional
    } = _ref;
    if (paramName === "*") {
      let splatValue = captureGroups[index2] || "";
      pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
    }
    const value = captureGroups[index2];
    if (isOptional && !value) {
      memo[paramName] = void 0;
    } else {
      memo[paramName] = (value || "").replace(/%2F/g, "/");
    }
    return memo;
  }, {});
  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}
function compilePath(path, caseSensitive, end) {
  if (caseSensitive === void 0) {
    caseSensitive = false;
  }
  if (end === void 0) {
    end = true;
  }
  warning(path === "*" || !path.endsWith("*") || path.endsWith("/*"), 'Route path "' + path + '" will be treated as if it were ' + ('"' + path.replace(/\*$/, "/*") + '" because the `*` character must ') + "always follow a `/` in the pattern. To get rid of this warning, " + ('please change the route path to "' + path.replace(/\*$/, "/*") + '".'));
  let params = [];
  let regexpSource = "^" + path.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(/\/:([\w-]+)(\?)?/g, (_2, paramName, isOptional) => {
    params.push({
      paramName,
      isOptional: isOptional != null
    });
    return isOptional ? "/?([^\\/]+)?" : "/([^\\/]+)";
  });
  if (path.endsWith("*")) {
    params.push({
      paramName: "*"
    });
    regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
  } else if (end) {
    regexpSource += "\\/*$";
  } else if (path !== "" && path !== "/") {
    regexpSource += "(?:(?=\\/|$))";
  } else
    ;
  let matcher = new RegExp(regexpSource, caseSensitive ? void 0 : "i");
  return [matcher, params];
}
function decodePath(value) {
  try {
    return value.split("/").map((v2) => decodeURIComponent(v2).replace(/\//g, "%2F")).join("/");
  } catch (error) {
    warning(false, 'The URL path "' + value + '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' + ("encoding (" + error + ")."));
    return value;
  }
}
function stripBasename(pathname, basename) {
  if (basename === "/")
    return pathname;
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }
  let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
  let nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    return null;
  }
  return pathname.slice(startIndex) || "/";
}
function resolvePath(to, fromPathname) {
  if (fromPathname === void 0) {
    fromPathname = "/";
  }
  let {
    pathname: toPathname,
    search = "",
    hash = ""
  } = typeof to === "string" ? parsePath(to) : to;
  let pathname = toPathname ? toPathname.startsWith("/") ? toPathname : resolvePathname(toPathname, fromPathname) : fromPathname;
  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash)
  };
}
function resolvePathname(relativePath, fromPathname) {
  let segments = fromPathname.replace(/\/+$/, "").split("/");
  let relativeSegments = relativePath.split("/");
  relativeSegments.forEach((segment) => {
    if (segment === "..") {
      if (segments.length > 1)
        segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });
  return segments.length > 1 ? segments.join("/") : "/";
}
function getInvalidPathError(char, field, dest, path) {
  return "Cannot include a '" + char + "' character in a manually specified " + ("`to." + field + "` field [" + JSON.stringify(path) + "].  Please separate it out to the ") + ("`to." + dest + "` field. Alternatively you may provide the full path as ") + 'a string in <Link to="..."> and the router will parse it for you.';
}
function getPathContributingMatches(matches) {
  return matches.filter((match, index2) => index2 === 0 || match.route.path && match.route.path.length > 0);
}
function getResolveToMatches(matches, v7_relativeSplatPath) {
  let pathMatches = getPathContributingMatches(matches);
  if (v7_relativeSplatPath) {
    return pathMatches.map((match, idx) => idx === pathMatches.length - 1 ? match.pathname : match.pathnameBase);
  }
  return pathMatches.map((match) => match.pathnameBase);
}
function resolveTo(toArg, routePathnames, locationPathname, isPathRelative) {
  if (isPathRelative === void 0) {
    isPathRelative = false;
  }
  let to;
  if (typeof toArg === "string") {
    to = parsePath(toArg);
  } else {
    to = _extends$2({}, toArg);
    invariant(!to.pathname || !to.pathname.includes("?"), getInvalidPathError("?", "pathname", "search", to));
    invariant(!to.pathname || !to.pathname.includes("#"), getInvalidPathError("#", "pathname", "hash", to));
    invariant(!to.search || !to.search.includes("#"), getInvalidPathError("#", "search", "hash", to));
  }
  let isEmptyPath = toArg === "" || to.pathname === "";
  let toPathname = isEmptyPath ? "/" : to.pathname;
  let from;
  if (toPathname == null) {
    from = locationPathname;
  } else {
    let routePathnameIndex = routePathnames.length - 1;
    if (!isPathRelative && toPathname.startsWith("..")) {
      let toSegments = toPathname.split("/");
      while (toSegments[0] === "..") {
        toSegments.shift();
        routePathnameIndex -= 1;
      }
      to.pathname = toSegments.join("/");
    }
    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
  }
  let path = resolvePath(to, from);
  let hasExplicitTrailingSlash = toPathname && toPathname !== "/" && toPathname.endsWith("/");
  let hasCurrentTrailingSlash = (isEmptyPath || toPathname === ".") && locationPathname.endsWith("/");
  if (!path.pathname.endsWith("/") && (hasExplicitTrailingSlash || hasCurrentTrailingSlash)) {
    path.pathname += "/";
  }
  return path;
}
const joinPaths = (paths) => paths.join("/").replace(/\/\/+/g, "/");
const normalizePathname = (pathname) => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
const normalizeSearch = (search) => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;
const normalizeHash = (hash) => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
function isRouteErrorResponse(error) {
  return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}
const validMutationMethodsArr = ["post", "put", "patch", "delete"];
new Set(validMutationMethodsArr);
const validRequestMethodsArr = ["get", ...validMutationMethodsArr];
new Set(validRequestMethodsArr);
/**
 * React Router v6.30.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends$1() {
  _extends$1 = Object.assign ? Object.assign.bind() : function(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = arguments[i2];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$1.apply(this, arguments);
}
const DataRouterContext = /* @__PURE__ */ reactExports.createContext(null);
const DataRouterStateContext = /* @__PURE__ */ reactExports.createContext(null);
const NavigationContext = /* @__PURE__ */ reactExports.createContext(null);
const LocationContext = /* @__PURE__ */ reactExports.createContext(null);
const RouteContext = /* @__PURE__ */ reactExports.createContext({
  outlet: null,
  matches: [],
  isDataRoute: false
});
const RouteErrorContext = /* @__PURE__ */ reactExports.createContext(null);
function useHref(to, _temp) {
  let {
    relative
  } = _temp === void 0 ? {} : _temp;
  !useInRouterContext() ? invariant(false) : void 0;
  let {
    basename,
    navigator: navigator2
  } = reactExports.useContext(NavigationContext);
  let {
    hash,
    pathname,
    search
  } = useResolvedPath(to, {
    relative
  });
  let joinedPathname = pathname;
  if (basename !== "/") {
    joinedPathname = pathname === "/" ? basename : joinPaths([basename, pathname]);
  }
  return navigator2.createHref({
    pathname: joinedPathname,
    search,
    hash
  });
}
function useInRouterContext() {
  return reactExports.useContext(LocationContext) != null;
}
function useLocation() {
  !useInRouterContext() ? invariant(false) : void 0;
  return reactExports.useContext(LocationContext).location;
}
function useIsomorphicLayoutEffect(cb2) {
  let isStatic = reactExports.useContext(NavigationContext).static;
  if (!isStatic) {
    reactExports.useLayoutEffect(cb2);
  }
}
function useNavigate() {
  let {
    isDataRoute
  } = reactExports.useContext(RouteContext);
  return isDataRoute ? useNavigateStable() : useNavigateUnstable();
}
function useNavigateUnstable() {
  !useInRouterContext() ? invariant(false) : void 0;
  let dataRouterContext = reactExports.useContext(DataRouterContext);
  let {
    basename,
    future,
    navigator: navigator2
  } = reactExports.useContext(NavigationContext);
  let {
    matches
  } = reactExports.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches, future.v7_relativeSplatPath));
  let activeRef = reactExports.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = reactExports.useCallback(function(to, options) {
    if (options === void 0) {
      options = {};
    }
    if (!activeRef.current)
      return;
    if (typeof to === "number") {
      navigator2.go(to);
      return;
    }
    let path = resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, options.relative === "path");
    if (dataRouterContext == null && basename !== "/") {
      path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
    }
    (!!options.replace ? navigator2.replace : navigator2.push)(path, options.state, options);
  }, [basename, navigator2, routePathnamesJson, locationPathname, dataRouterContext]);
  return navigate;
}
function useParams() {
  let {
    matches
  } = reactExports.useContext(RouteContext);
  let routeMatch = matches[matches.length - 1];
  return routeMatch ? routeMatch.params : {};
}
function useResolvedPath(to, _temp2) {
  let {
    relative
  } = _temp2 === void 0 ? {} : _temp2;
  let {
    future
  } = reactExports.useContext(NavigationContext);
  let {
    matches
  } = reactExports.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches, future.v7_relativeSplatPath));
  return reactExports.useMemo(() => resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, relative === "path"), [to, routePathnamesJson, locationPathname, relative]);
}
function useRoutes(routes, locationArg) {
  return useRoutesImpl(routes, locationArg);
}
function useRoutesImpl(routes, locationArg, dataRouterState, future) {
  !useInRouterContext() ? invariant(false) : void 0;
  let {
    navigator: navigator2
  } = reactExports.useContext(NavigationContext);
  let {
    matches: parentMatches
  } = reactExports.useContext(RouteContext);
  let routeMatch = parentMatches[parentMatches.length - 1];
  let parentParams = routeMatch ? routeMatch.params : {};
  routeMatch ? routeMatch.pathname : "/";
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  routeMatch && routeMatch.route;
  let locationFromContext = useLocation();
  let location2;
  if (locationArg) {
    var _parsedLocationArg$pa;
    let parsedLocationArg = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
    !(parentPathnameBase === "/" || ((_parsedLocationArg$pa = parsedLocationArg.pathname) == null ? void 0 : _parsedLocationArg$pa.startsWith(parentPathnameBase))) ? invariant(false) : void 0;
    location2 = parsedLocationArg;
  } else {
    location2 = locationFromContext;
  }
  let pathname = location2.pathname || "/";
  let remainingPathname = pathname;
  if (parentPathnameBase !== "/") {
    let parentSegments = parentPathnameBase.replace(/^\//, "").split("/");
    let segments = pathname.replace(/^\//, "").split("/");
    remainingPathname = "/" + segments.slice(parentSegments.length).join("/");
  }
  let matches = matchRoutes(routes, {
    pathname: remainingPathname
  });
  let renderedMatches = _renderMatches(matches && matches.map((match) => Object.assign({}, match, {
    params: Object.assign({}, parentParams, match.params),
    pathname: joinPaths([
      parentPathnameBase,
      // Re-encode pathnames that were decoded inside matchRoutes
      navigator2.encodeLocation ? navigator2.encodeLocation(match.pathname).pathname : match.pathname
    ]),
    pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : joinPaths([
      parentPathnameBase,
      // Re-encode pathnames that were decoded inside matchRoutes
      navigator2.encodeLocation ? navigator2.encodeLocation(match.pathnameBase).pathname : match.pathnameBase
    ])
  })), parentMatches, dataRouterState, future);
  if (locationArg && renderedMatches) {
    return /* @__PURE__ */ reactExports.createElement(LocationContext.Provider, {
      value: {
        location: _extends$1({
          pathname: "/",
          search: "",
          hash: "",
          state: null,
          key: "default"
        }, location2),
        navigationType: Action.Pop
      }
    }, renderedMatches);
  }
  return renderedMatches;
}
function DefaultErrorComponent() {
  let error = useRouteError();
  let message = isRouteErrorResponse(error) ? error.status + " " + error.statusText : error instanceof Error ? error.message : JSON.stringify(error);
  let stack = error instanceof Error ? error.stack : null;
  let lightgrey = "rgba(200,200,200, 0.5)";
  let preStyles = {
    padding: "0.5rem",
    backgroundColor: lightgrey
  };
  let devInfo = null;
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, /* @__PURE__ */ reactExports.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ reactExports.createElement("h3", {
    style: {
      fontStyle: "italic"
    }
  }, message), stack ? /* @__PURE__ */ reactExports.createElement("pre", {
    style: preStyles
  }, stack) : null, devInfo);
}
const defaultErrorElement = /* @__PURE__ */ reactExports.createElement(DefaultErrorComponent, null);
class RenderErrorBoundary extends reactExports.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      revalidation: props.revalidation,
      error: props.error
    };
  }
  static getDerivedStateFromError(error) {
    return {
      error
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (state.location !== props.location || state.revalidation !== "idle" && props.revalidation === "idle") {
      return {
        error: props.error,
        location: props.location,
        revalidation: props.revalidation
      };
    }
    return {
      error: props.error !== void 0 ? props.error : state.error,
      location: state.location,
      revalidation: props.revalidation || state.revalidation
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error("React Router caught the following error during render", error, errorInfo);
  }
  render() {
    return this.state.error !== void 0 ? /* @__PURE__ */ reactExports.createElement(RouteContext.Provider, {
      value: this.props.routeContext
    }, /* @__PURE__ */ reactExports.createElement(RouteErrorContext.Provider, {
      value: this.state.error,
      children: this.props.component
    })) : this.props.children;
  }
}
function RenderedRoute(_ref) {
  let {
    routeContext,
    match,
    children
  } = _ref;
  let dataRouterContext = reactExports.useContext(DataRouterContext);
  if (dataRouterContext && dataRouterContext.static && dataRouterContext.staticContext && (match.route.errorElement || match.route.ErrorBoundary)) {
    dataRouterContext.staticContext._deepestRenderedBoundaryId = match.route.id;
  }
  return /* @__PURE__ */ reactExports.createElement(RouteContext.Provider, {
    value: routeContext
  }, children);
}
function _renderMatches(matches, parentMatches, dataRouterState, future) {
  var _dataRouterState;
  if (parentMatches === void 0) {
    parentMatches = [];
  }
  if (dataRouterState === void 0) {
    dataRouterState = null;
  }
  if (future === void 0) {
    future = null;
  }
  if (matches == null) {
    var _future;
    if (!dataRouterState) {
      return null;
    }
    if (dataRouterState.errors) {
      matches = dataRouterState.matches;
    } else if ((_future = future) != null && _future.v7_partialHydration && parentMatches.length === 0 && !dataRouterState.initialized && dataRouterState.matches.length > 0) {
      matches = dataRouterState.matches;
    } else {
      return null;
    }
  }
  let renderedMatches = matches;
  let errors = (_dataRouterState = dataRouterState) == null ? void 0 : _dataRouterState.errors;
  if (errors != null) {
    let errorIndex = renderedMatches.findIndex((m2) => m2.route.id && (errors == null ? void 0 : errors[m2.route.id]) !== void 0);
    !(errorIndex >= 0) ? invariant(false) : void 0;
    renderedMatches = renderedMatches.slice(0, Math.min(renderedMatches.length, errorIndex + 1));
  }
  let renderFallback = false;
  let fallbackIndex = -1;
  if (dataRouterState && future && future.v7_partialHydration) {
    for (let i2 = 0; i2 < renderedMatches.length; i2++) {
      let match = renderedMatches[i2];
      if (match.route.HydrateFallback || match.route.hydrateFallbackElement) {
        fallbackIndex = i2;
      }
      if (match.route.id) {
        let {
          loaderData,
          errors: errors2
        } = dataRouterState;
        let needsToRunLoader = match.route.loader && loaderData[match.route.id] === void 0 && (!errors2 || errors2[match.route.id] === void 0);
        if (match.route.lazy || needsToRunLoader) {
          renderFallback = true;
          if (fallbackIndex >= 0) {
            renderedMatches = renderedMatches.slice(0, fallbackIndex + 1);
          } else {
            renderedMatches = [renderedMatches[0]];
          }
          break;
        }
      }
    }
  }
  return renderedMatches.reduceRight((outlet, match, index2) => {
    let error;
    let shouldRenderHydrateFallback = false;
    let errorElement = null;
    let hydrateFallbackElement = null;
    if (dataRouterState) {
      error = errors && match.route.id ? errors[match.route.id] : void 0;
      errorElement = match.route.errorElement || defaultErrorElement;
      if (renderFallback) {
        if (fallbackIndex < 0 && index2 === 0) {
          warningOnce("route-fallback", false);
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = null;
        } else if (fallbackIndex === index2) {
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = match.route.hydrateFallbackElement || null;
        }
      }
    }
    let matches2 = parentMatches.concat(renderedMatches.slice(0, index2 + 1));
    let getChildren = () => {
      let children;
      if (error) {
        children = errorElement;
      } else if (shouldRenderHydrateFallback) {
        children = hydrateFallbackElement;
      } else if (match.route.Component) {
        children = /* @__PURE__ */ reactExports.createElement(match.route.Component, null);
      } else if (match.route.element) {
        children = match.route.element;
      } else {
        children = outlet;
      }
      return /* @__PURE__ */ reactExports.createElement(RenderedRoute, {
        match,
        routeContext: {
          outlet,
          matches: matches2,
          isDataRoute: dataRouterState != null
        },
        children
      });
    };
    return dataRouterState && (match.route.ErrorBoundary || match.route.errorElement || index2 === 0) ? /* @__PURE__ */ reactExports.createElement(RenderErrorBoundary, {
      location: dataRouterState.location,
      revalidation: dataRouterState.revalidation,
      component: errorElement,
      error,
      children: getChildren(),
      routeContext: {
        outlet: null,
        matches: matches2,
        isDataRoute: true
      }
    }) : getChildren();
  }, null);
}
var DataRouterHook$1 = /* @__PURE__ */ function(DataRouterHook2) {
  DataRouterHook2["UseBlocker"] = "useBlocker";
  DataRouterHook2["UseRevalidator"] = "useRevalidator";
  DataRouterHook2["UseNavigateStable"] = "useNavigate";
  return DataRouterHook2;
}(DataRouterHook$1 || {});
var DataRouterStateHook$1 = /* @__PURE__ */ function(DataRouterStateHook2) {
  DataRouterStateHook2["UseBlocker"] = "useBlocker";
  DataRouterStateHook2["UseLoaderData"] = "useLoaderData";
  DataRouterStateHook2["UseActionData"] = "useActionData";
  DataRouterStateHook2["UseRouteError"] = "useRouteError";
  DataRouterStateHook2["UseNavigation"] = "useNavigation";
  DataRouterStateHook2["UseRouteLoaderData"] = "useRouteLoaderData";
  DataRouterStateHook2["UseMatches"] = "useMatches";
  DataRouterStateHook2["UseRevalidator"] = "useRevalidator";
  DataRouterStateHook2["UseNavigateStable"] = "useNavigate";
  DataRouterStateHook2["UseRouteId"] = "useRouteId";
  return DataRouterStateHook2;
}(DataRouterStateHook$1 || {});
function useDataRouterContext$1(hookName) {
  let ctx = reactExports.useContext(DataRouterContext);
  !ctx ? invariant(false) : void 0;
  return ctx;
}
function useDataRouterState(hookName) {
  let state = reactExports.useContext(DataRouterStateContext);
  !state ? invariant(false) : void 0;
  return state;
}
function useRouteContext(hookName) {
  let route = reactExports.useContext(RouteContext);
  !route ? invariant(false) : void 0;
  return route;
}
function useCurrentRouteId(hookName) {
  let route = useRouteContext();
  let thisRoute = route.matches[route.matches.length - 1];
  !thisRoute.route.id ? invariant(false) : void 0;
  return thisRoute.route.id;
}
function useRouteError() {
  var _state$errors;
  let error = reactExports.useContext(RouteErrorContext);
  let state = useDataRouterState(DataRouterStateHook$1.UseRouteError);
  let routeId = useCurrentRouteId(DataRouterStateHook$1.UseRouteError);
  if (error !== void 0) {
    return error;
  }
  return (_state$errors = state.errors) == null ? void 0 : _state$errors[routeId];
}
function useNavigateStable() {
  let {
    router
  } = useDataRouterContext$1(DataRouterHook$1.UseNavigateStable);
  let id2 = useCurrentRouteId(DataRouterStateHook$1.UseNavigateStable);
  let activeRef = reactExports.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = reactExports.useCallback(function(to, options) {
    if (options === void 0) {
      options = {};
    }
    if (!activeRef.current)
      return;
    if (typeof to === "number") {
      router.navigate(to);
    } else {
      router.navigate(to, _extends$1({
        fromRouteId: id2
      }, options));
    }
  }, [router, id2]);
  return navigate;
}
const alreadyWarned$1 = {};
function warningOnce(key, cond, message) {
  if (!cond && !alreadyWarned$1[key]) {
    alreadyWarned$1[key] = true;
  }
}
function logV6DeprecationWarnings(renderFuture, routerFuture) {
  if ((renderFuture == null ? void 0 : renderFuture.v7_startTransition) === void 0)
    ;
  if ((renderFuture == null ? void 0 : renderFuture.v7_relativeSplatPath) === void 0 && (!routerFuture || routerFuture.v7_relativeSplatPath === void 0))
    ;
  if (routerFuture) {
    if (routerFuture.v7_fetcherPersist === void 0)
      ;
    if (routerFuture.v7_normalizeFormMethod === void 0)
      ;
    if (routerFuture.v7_partialHydration === void 0)
      ;
    if (routerFuture.v7_skipActionErrorRevalidation === void 0)
      ;
  }
}
function Navigate(_ref4) {
  let {
    to,
    replace,
    state,
    relative
  } = _ref4;
  !useInRouterContext() ? invariant(false) : void 0;
  let {
    future,
    static: isStatic
  } = reactExports.useContext(NavigationContext);
  let {
    matches
  } = reactExports.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let navigate = useNavigate();
  let path = resolveTo(to, getResolveToMatches(matches, future.v7_relativeSplatPath), locationPathname, relative === "path");
  let jsonPath = JSON.stringify(path);
  reactExports.useEffect(() => navigate(JSON.parse(jsonPath), {
    replace,
    state,
    relative
  }), [navigate, jsonPath, relative, replace, state]);
  return null;
}
function Route(_props) {
  invariant(false);
}
function Router(_ref5) {
  let {
    basename: basenameProp = "/",
    children = null,
    location: locationProp,
    navigationType = Action.Pop,
    navigator: navigator2,
    static: staticProp = false,
    future
  } = _ref5;
  !!useInRouterContext() ? invariant(false) : void 0;
  let basename = basenameProp.replace(/^\/*/, "/");
  let navigationContext = reactExports.useMemo(() => ({
    basename,
    navigator: navigator2,
    static: staticProp,
    future: _extends$1({
      v7_relativeSplatPath: false
    }, future)
  }), [basename, future, navigator2, staticProp]);
  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }
  let {
    pathname = "/",
    search = "",
    hash = "",
    state = null,
    key = "default"
  } = locationProp;
  let locationContext = reactExports.useMemo(() => {
    let trailingPathname = stripBasename(pathname, basename);
    if (trailingPathname == null) {
      return null;
    }
    return {
      location: {
        pathname: trailingPathname,
        search,
        hash,
        state,
        key
      },
      navigationType
    };
  }, [basename, pathname, search, hash, state, key, navigationType]);
  if (locationContext == null) {
    return null;
  }
  return /* @__PURE__ */ reactExports.createElement(NavigationContext.Provider, {
    value: navigationContext
  }, /* @__PURE__ */ reactExports.createElement(LocationContext.Provider, {
    children,
    value: locationContext
  }));
}
function Routes(_ref6) {
  let {
    children,
    location: location2
  } = _ref6;
  return useRoutes(createRoutesFromChildren(children), location2);
}
new Promise(() => {
});
function createRoutesFromChildren(children, parentPath) {
  if (parentPath === void 0) {
    parentPath = [];
  }
  let routes = [];
  reactExports.Children.forEach(children, (element, index2) => {
    if (!/* @__PURE__ */ reactExports.isValidElement(element)) {
      return;
    }
    let treePath = [...parentPath, index2];
    if (element.type === reactExports.Fragment) {
      routes.push.apply(routes, createRoutesFromChildren(element.props.children, treePath));
      return;
    }
    !(element.type === Route) ? invariant(false) : void 0;
    !(!element.props.index || !element.props.children) ? invariant(false) : void 0;
    let route = {
      id: element.props.id || treePath.join("-"),
      caseSensitive: element.props.caseSensitive,
      element: element.props.element,
      Component: element.props.Component,
      index: element.props.index,
      path: element.props.path,
      loader: element.props.loader,
      action: element.props.action,
      errorElement: element.props.errorElement,
      ErrorBoundary: element.props.ErrorBoundary,
      hasErrorBoundary: element.props.ErrorBoundary != null || element.props.errorElement != null,
      shouldRevalidate: element.props.shouldRevalidate,
      handle: element.props.handle,
      lazy: element.props.lazy
    };
    if (element.props.children) {
      route.children = createRoutesFromChildren(element.props.children, treePath);
    }
    routes.push(route);
  });
  return routes;
}
/**
 * React Router DOM v6.30.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = arguments[i2];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i2;
  for (i2 = 0; i2 < sourceKeys.length; i2++) {
    key = sourceKeys[i2];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}
function isModifiedEvent(event2) {
  return !!(event2.metaKey || event2.altKey || event2.ctrlKey || event2.shiftKey);
}
function shouldProcessLinkClick(event2, target) {
  return event2.button === 0 && // Ignore everything but left clicks
  (!target || target === "_self") && // Let browser handle "target=_blank" etc.
  !isModifiedEvent(event2);
}
function createSearchParams(init) {
  if (init === void 0) {
    init = "";
  }
  return new URLSearchParams(typeof init === "string" || Array.isArray(init) || init instanceof URLSearchParams ? init : Object.keys(init).reduce((memo, key) => {
    let value = init[key];
    return memo.concat(Array.isArray(value) ? value.map((v2) => [key, v2]) : [[key, value]]);
  }, []));
}
function getSearchParamsForLocation(locationSearch, defaultSearchParams) {
  let searchParams = createSearchParams(locationSearch);
  if (defaultSearchParams) {
    defaultSearchParams.forEach((_2, key) => {
      if (!searchParams.has(key)) {
        defaultSearchParams.getAll(key).forEach((value) => {
          searchParams.append(key, value);
        });
      }
    });
  }
  return searchParams;
}
const _excluded = ["onClick", "relative", "reloadDocument", "replace", "state", "target", "to", "preventScrollReset", "viewTransition"], _excluded2 = ["aria-current", "caseSensitive", "className", "end", "style", "to", "viewTransition", "children"];
const REACT_ROUTER_VERSION = "6";
try {
  window.__reactRouterVersion = REACT_ROUTER_VERSION;
} catch (e2) {
}
const ViewTransitionContext = /* @__PURE__ */ reactExports.createContext({
  isTransitioning: false
});
const START_TRANSITION = "startTransition";
const startTransitionImpl = e[START_TRANSITION];
function BrowserRouter(_ref4) {
  let {
    basename,
    children,
    future,
    window: window2
  } = _ref4;
  let historyRef = reactExports.useRef();
  if (historyRef.current == null) {
    historyRef.current = createBrowserHistory({
      window: window2,
      v5Compat: true
    });
  }
  let history = historyRef.current;
  let [state, setStateImpl] = reactExports.useState({
    action: history.action,
    location: history.location
  });
  let {
    v7_startTransition
  } = future || {};
  let setState = reactExports.useCallback((newState) => {
    v7_startTransition && startTransitionImpl ? startTransitionImpl(() => setStateImpl(newState)) : setStateImpl(newState);
  }, [setStateImpl, v7_startTransition]);
  reactExports.useLayoutEffect(() => history.listen(setState), [history, setState]);
  reactExports.useEffect(() => logV6DeprecationWarnings(future), [future]);
  return /* @__PURE__ */ reactExports.createElement(Router, {
    basename,
    children,
    location: state.location,
    navigationType: state.action,
    navigator: history,
    future
  });
}
const isBrowser$1 = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
const ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const Link = /* @__PURE__ */ reactExports.forwardRef(function LinkWithRef(_ref7, ref) {
  let {
    onClick,
    relative,
    reloadDocument,
    replace,
    state,
    target,
    to,
    preventScrollReset,
    viewTransition
  } = _ref7, rest = _objectWithoutPropertiesLoose(_ref7, _excluded);
  let {
    basename
  } = reactExports.useContext(NavigationContext);
  let absoluteHref;
  let isExternal = false;
  if (typeof to === "string" && ABSOLUTE_URL_REGEX.test(to)) {
    absoluteHref = to;
    if (isBrowser$1) {
      try {
        let currentUrl = new URL(window.location.href);
        let targetUrl = to.startsWith("//") ? new URL(currentUrl.protocol + to) : new URL(to);
        let path = stripBasename(targetUrl.pathname, basename);
        if (targetUrl.origin === currentUrl.origin && path != null) {
          to = path + targetUrl.search + targetUrl.hash;
        } else {
          isExternal = true;
        }
      } catch (e2) {
      }
    }
  }
  let href = useHref(to, {
    relative
  });
  let internalOnClick = useLinkClickHandler(to, {
    replace,
    state,
    target,
    preventScrollReset,
    relative,
    viewTransition
  });
  function handleClick(event2) {
    if (onClick)
      onClick(event2);
    if (!event2.defaultPrevented) {
      internalOnClick(event2);
    }
  }
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    /* @__PURE__ */ reactExports.createElement("a", _extends({}, rest, {
      href: absoluteHref || href,
      onClick: isExternal || reloadDocument ? onClick : handleClick,
      ref,
      target
    }))
  );
});
const NavLink = /* @__PURE__ */ reactExports.forwardRef(function NavLinkWithRef(_ref8, ref) {
  let {
    "aria-current": ariaCurrentProp = "page",
    caseSensitive = false,
    className: classNameProp = "",
    end = false,
    style: styleProp,
    to,
    viewTransition,
    children
  } = _ref8, rest = _objectWithoutPropertiesLoose(_ref8, _excluded2);
  let path = useResolvedPath(to, {
    relative: rest.relative
  });
  let location2 = useLocation();
  let routerState = reactExports.useContext(DataRouterStateContext);
  let {
    navigator: navigator2,
    basename
  } = reactExports.useContext(NavigationContext);
  let isTransitioning = routerState != null && // Conditional usage is OK here because the usage of a data router is static
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useViewTransitionState(path) && viewTransition === true;
  let toPathname = navigator2.encodeLocation ? navigator2.encodeLocation(path).pathname : path.pathname;
  let locationPathname = location2.pathname;
  let nextLocationPathname = routerState && routerState.navigation && routerState.navigation.location ? routerState.navigation.location.pathname : null;
  if (!caseSensitive) {
    locationPathname = locationPathname.toLowerCase();
    nextLocationPathname = nextLocationPathname ? nextLocationPathname.toLowerCase() : null;
    toPathname = toPathname.toLowerCase();
  }
  if (nextLocationPathname && basename) {
    nextLocationPathname = stripBasename(nextLocationPathname, basename) || nextLocationPathname;
  }
  const endSlashPosition = toPathname !== "/" && toPathname.endsWith("/") ? toPathname.length - 1 : toPathname.length;
  let isActive = locationPathname === toPathname || !end && locationPathname.startsWith(toPathname) && locationPathname.charAt(endSlashPosition) === "/";
  let isPending = nextLocationPathname != null && (nextLocationPathname === toPathname || !end && nextLocationPathname.startsWith(toPathname) && nextLocationPathname.charAt(toPathname.length) === "/");
  let renderProps = {
    isActive,
    isPending,
    isTransitioning
  };
  let ariaCurrent = isActive ? ariaCurrentProp : void 0;
  let className;
  if (typeof classNameProp === "function") {
    className = classNameProp(renderProps);
  } else {
    className = [classNameProp, isActive ? "active" : null, isPending ? "pending" : null, isTransitioning ? "transitioning" : null].filter(Boolean).join(" ");
  }
  let style = typeof styleProp === "function" ? styleProp(renderProps) : styleProp;
  return /* @__PURE__ */ reactExports.createElement(Link, _extends({}, rest, {
    "aria-current": ariaCurrent,
    className,
    ref,
    style,
    to,
    viewTransition
  }), typeof children === "function" ? children(renderProps) : children);
});
var DataRouterHook;
(function(DataRouterHook2) {
  DataRouterHook2["UseScrollRestoration"] = "useScrollRestoration";
  DataRouterHook2["UseSubmit"] = "useSubmit";
  DataRouterHook2["UseSubmitFetcher"] = "useSubmitFetcher";
  DataRouterHook2["UseFetcher"] = "useFetcher";
  DataRouterHook2["useViewTransitionState"] = "useViewTransitionState";
})(DataRouterHook || (DataRouterHook = {}));
var DataRouterStateHook;
(function(DataRouterStateHook2) {
  DataRouterStateHook2["UseFetcher"] = "useFetcher";
  DataRouterStateHook2["UseFetchers"] = "useFetchers";
  DataRouterStateHook2["UseScrollRestoration"] = "useScrollRestoration";
})(DataRouterStateHook || (DataRouterStateHook = {}));
function useDataRouterContext(hookName) {
  let ctx = reactExports.useContext(DataRouterContext);
  !ctx ? invariant(false) : void 0;
  return ctx;
}
function useLinkClickHandler(to, _temp) {
  let {
    target,
    replace: replaceProp,
    state,
    preventScrollReset,
    relative,
    viewTransition
  } = _temp === void 0 ? {} : _temp;
  let navigate = useNavigate();
  let location2 = useLocation();
  let path = useResolvedPath(to, {
    relative
  });
  return reactExports.useCallback((event2) => {
    if (shouldProcessLinkClick(event2, target)) {
      event2.preventDefault();
      let replace = replaceProp !== void 0 ? replaceProp : createPath(location2) === createPath(path);
      navigate(to, {
        replace,
        state,
        preventScrollReset,
        relative,
        viewTransition
      });
    }
  }, [location2, navigate, path, replaceProp, state, target, to, preventScrollReset, relative, viewTransition]);
}
function useSearchParams(defaultInit) {
  let defaultSearchParamsRef = reactExports.useRef(createSearchParams(defaultInit));
  let hasSetSearchParamsRef = reactExports.useRef(false);
  let location2 = useLocation();
  let searchParams = reactExports.useMemo(() => (
    // Only merge in the defaults if we haven't yet called setSearchParams.
    // Once we call that we want those to take precedence, otherwise you can't
    // remove a param with setSearchParams({}) if it has an initial value
    getSearchParamsForLocation(location2.search, hasSetSearchParamsRef.current ? null : defaultSearchParamsRef.current)
  ), [location2.search]);
  let navigate = useNavigate();
  let setSearchParams = reactExports.useCallback((nextInit, navigateOptions) => {
    const newSearchParams = createSearchParams(typeof nextInit === "function" ? nextInit(searchParams) : nextInit);
    hasSetSearchParamsRef.current = true;
    navigate("?" + newSearchParams, navigateOptions);
  }, [navigate, searchParams]);
  return [searchParams, setSearchParams];
}
function useViewTransitionState(to, opts) {
  if (opts === void 0) {
    opts = {};
  }
  let vtContext = reactExports.useContext(ViewTransitionContext);
  !(vtContext != null) ? invariant(false) : void 0;
  let {
    basename
  } = useDataRouterContext(DataRouterHook.useViewTransitionState);
  let path = useResolvedPath(to, {
    relative: opts.relative
  });
  if (!vtContext.isTransitioning) {
    return false;
  }
  let currentPath = stripBasename(vtContext.currentLocation.pathname, basename) || vtContext.currentLocation.pathname;
  let nextPath = stripBasename(vtContext.nextLocation.pathname, basename) || vtContext.nextLocation.pathname;
  return matchPath(path.pathname, nextPath) != null || matchPath(path.pathname, currentPath) != null;
}
class Subscribable {
  constructor() {
    this.listeners = /* @__PURE__ */ new Set();
    this.subscribe = this.subscribe.bind(this);
  }
  subscribe(listener) {
    const identity = {
      listener
    };
    this.listeners.add(identity);
    this.onSubscribe();
    return () => {
      this.listeners.delete(identity);
      this.onUnsubscribe();
    };
  }
  hasListeners() {
    return this.listeners.size > 0;
  }
  onSubscribe() {
  }
  onUnsubscribe() {
  }
}
const isServer = typeof window === "undefined" || "Deno" in window;
function noop$1() {
  return void 0;
}
function functionalUpdate(updater, input) {
  return typeof updater === "function" ? updater(input) : updater;
}
function isValidTimeout(value) {
  return typeof value === "number" && value >= 0 && value !== Infinity;
}
function timeUntilStale(updatedAt, staleTime) {
  return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
}
function parseQueryArgs(arg1, arg2, arg3) {
  if (!isQueryKey(arg1)) {
    return arg1;
  }
  if (typeof arg2 === "function") {
    return {
      ...arg3,
      queryKey: arg1,
      queryFn: arg2
    };
  }
  return {
    ...arg2,
    queryKey: arg1
  };
}
function parseMutationArgs(arg1, arg2, arg3) {
  if (isQueryKey(arg1)) {
    if (typeof arg2 === "function") {
      return {
        ...arg3,
        mutationKey: arg1,
        mutationFn: arg2
      };
    }
    return {
      ...arg2,
      mutationKey: arg1
    };
  }
  if (typeof arg1 === "function") {
    return {
      ...arg2,
      mutationFn: arg1
    };
  }
  return {
    ...arg1
  };
}
function parseFilterArgs(arg1, arg2, arg3) {
  return isQueryKey(arg1) ? [{
    ...arg2,
    queryKey: arg1
  }, arg3] : [arg1 || {}, arg2];
}
function matchQuery(filters, query) {
  const {
    type = "all",
    exact,
    fetchStatus,
    predicate,
    queryKey,
    stale
  } = filters;
  if (isQueryKey(queryKey)) {
    if (exact) {
      if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) {
        return false;
      }
    } else if (!partialMatchKey(query.queryKey, queryKey)) {
      return false;
    }
  }
  if (type !== "all") {
    const isActive = query.isActive();
    if (type === "active" && !isActive) {
      return false;
    }
    if (type === "inactive" && isActive) {
      return false;
    }
  }
  if (typeof stale === "boolean" && query.isStale() !== stale) {
    return false;
  }
  if (typeof fetchStatus !== "undefined" && fetchStatus !== query.state.fetchStatus) {
    return false;
  }
  if (predicate && !predicate(query)) {
    return false;
  }
  return true;
}
function matchMutation(filters, mutation) {
  const {
    exact,
    fetching,
    predicate,
    mutationKey
  } = filters;
  if (isQueryKey(mutationKey)) {
    if (!mutation.options.mutationKey) {
      return false;
    }
    if (exact) {
      if (hashQueryKey(mutation.options.mutationKey) !== hashQueryKey(mutationKey)) {
        return false;
      }
    } else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) {
      return false;
    }
  }
  if (typeof fetching === "boolean" && mutation.state.status === "loading" !== fetching) {
    return false;
  }
  if (predicate && !predicate(mutation)) {
    return false;
  }
  return true;
}
function hashQueryKeyByOptions(queryKey, options) {
  const hashFn = (options == null ? void 0 : options.queryKeyHashFn) || hashQueryKey;
  return hashFn(queryKey);
}
function hashQueryKey(queryKey) {
  return JSON.stringify(queryKey, (_2, val) => isPlainObject$1(val) ? Object.keys(val).sort().reduce((result, key) => {
    result[key] = val[key];
    return result;
  }, {}) : val);
}
function partialMatchKey(a2, b2) {
  return partialDeepEqual(a2, b2);
}
function partialDeepEqual(a2, b2) {
  if (a2 === b2) {
    return true;
  }
  if (typeof a2 !== typeof b2) {
    return false;
  }
  if (a2 && b2 && typeof a2 === "object" && typeof b2 === "object") {
    return !Object.keys(b2).some((key) => !partialDeepEqual(a2[key], b2[key]));
  }
  return false;
}
function replaceEqualDeep(a2, b2) {
  if (a2 === b2) {
    return a2;
  }
  const array = isPlainArray(a2) && isPlainArray(b2);
  if (array || isPlainObject$1(a2) && isPlainObject$1(b2)) {
    const aSize = array ? a2.length : Object.keys(a2).length;
    const bItems = array ? b2 : Object.keys(b2);
    const bSize = bItems.length;
    const copy = array ? [] : {};
    let equalItems = 0;
    for (let i2 = 0; i2 < bSize; i2++) {
      const key = array ? i2 : bItems[i2];
      copy[key] = replaceEqualDeep(a2[key], b2[key]);
      if (copy[key] === a2[key]) {
        equalItems++;
      }
    }
    return aSize === bSize && equalItems === aSize ? a2 : copy;
  }
  return b2;
}
function shallowEqualObjects(a2, b2) {
  if (a2 && !b2 || b2 && !a2) {
    return false;
  }
  for (const key in a2) {
    if (a2[key] !== b2[key]) {
      return false;
    }
  }
  return true;
}
function isPlainArray(value) {
  return Array.isArray(value) && value.length === Object.keys(value).length;
}
function isPlainObject$1(o3) {
  if (!hasObjectPrototype(o3)) {
    return false;
  }
  const ctor = o3.constructor;
  if (typeof ctor === "undefined") {
    return true;
  }
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }
  if (!prot.hasOwnProperty("isPrototypeOf")) {
    return false;
  }
  return true;
}
function hasObjectPrototype(o3) {
  return Object.prototype.toString.call(o3) === "[object Object]";
}
function isQueryKey(value) {
  return Array.isArray(value);
}
function sleep(timeout) {
  return new Promise((resolve2) => {
    setTimeout(resolve2, timeout);
  });
}
function scheduleMicrotask(callback) {
  sleep(0).then(callback);
}
function getAbortController() {
  if (typeof AbortController === "function") {
    return new AbortController();
  }
  return;
}
function replaceData(prevData, data, options) {
  if (options.isDataEqual != null && options.isDataEqual(prevData, data)) {
    return prevData;
  } else if (typeof options.structuralSharing === "function") {
    return options.structuralSharing(prevData, data);
  } else if (options.structuralSharing !== false) {
    return replaceEqualDeep(prevData, data);
  }
  return data;
}
class FocusManager extends Subscribable {
  constructor() {
    super();
    this.setup = (onFocus) => {
      if (!isServer && window.addEventListener) {
        const listener = () => onFocus();
        window.addEventListener("visibilitychange", listener, false);
        window.addEventListener("focus", listener, false);
        return () => {
          window.removeEventListener("visibilitychange", listener);
          window.removeEventListener("focus", listener);
        };
      }
      return;
    };
  }
  onSubscribe() {
    if (!this.cleanup) {
      this.setEventListener(this.setup);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      var _this$cleanup;
      (_this$cleanup = this.cleanup) == null ? void 0 : _this$cleanup.call(this);
      this.cleanup = void 0;
    }
  }
  setEventListener(setup) {
    var _this$cleanup2;
    this.setup = setup;
    (_this$cleanup2 = this.cleanup) == null ? void 0 : _this$cleanup2.call(this);
    this.cleanup = setup((focused) => {
      if (typeof focused === "boolean") {
        this.setFocused(focused);
      } else {
        this.onFocus();
      }
    });
  }
  setFocused(focused) {
    const changed = this.focused !== focused;
    if (changed) {
      this.focused = focused;
      this.onFocus();
    }
  }
  onFocus() {
    this.listeners.forEach(({
      listener
    }) => {
      listener();
    });
  }
  isFocused() {
    if (typeof this.focused === "boolean") {
      return this.focused;
    }
    if (typeof document === "undefined") {
      return true;
    }
    return [void 0, "visible", "prerender"].includes(document.visibilityState);
  }
}
const focusManager = new FocusManager();
const onlineEvents = ["online", "offline"];
class OnlineManager extends Subscribable {
  constructor() {
    super();
    this.setup = (onOnline) => {
      if (!isServer && window.addEventListener) {
        const listener = () => onOnline();
        onlineEvents.forEach((event2) => {
          window.addEventListener(event2, listener, false);
        });
        return () => {
          onlineEvents.forEach((event2) => {
            window.removeEventListener(event2, listener);
          });
        };
      }
      return;
    };
  }
  onSubscribe() {
    if (!this.cleanup) {
      this.setEventListener(this.setup);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      var _this$cleanup;
      (_this$cleanup = this.cleanup) == null ? void 0 : _this$cleanup.call(this);
      this.cleanup = void 0;
    }
  }
  setEventListener(setup) {
    var _this$cleanup2;
    this.setup = setup;
    (_this$cleanup2 = this.cleanup) == null ? void 0 : _this$cleanup2.call(this);
    this.cleanup = setup((online) => {
      if (typeof online === "boolean") {
        this.setOnline(online);
      } else {
        this.onOnline();
      }
    });
  }
  setOnline(online) {
    const changed = this.online !== online;
    if (changed) {
      this.online = online;
      this.onOnline();
    }
  }
  onOnline() {
    this.listeners.forEach(({
      listener
    }) => {
      listener();
    });
  }
  isOnline() {
    if (typeof this.online === "boolean") {
      return this.online;
    }
    if (typeof navigator === "undefined" || typeof navigator.onLine === "undefined") {
      return true;
    }
    return navigator.onLine;
  }
}
const onlineManager = new OnlineManager();
function defaultRetryDelay(failureCount) {
  return Math.min(1e3 * 2 ** failureCount, 3e4);
}
function canFetch(networkMode) {
  return (networkMode != null ? networkMode : "online") === "online" ? onlineManager.isOnline() : true;
}
class CancelledError {
  constructor(options) {
    this.revert = options == null ? void 0 : options.revert;
    this.silent = options == null ? void 0 : options.silent;
  }
}
function isCancelledError(value) {
  return value instanceof CancelledError;
}
function createRetryer(config) {
  let isRetryCancelled = false;
  let failureCount = 0;
  let isResolved = false;
  let continueFn;
  let promiseResolve;
  let promiseReject;
  const promise = new Promise((outerResolve, outerReject) => {
    promiseResolve = outerResolve;
    promiseReject = outerReject;
  });
  const cancel = (cancelOptions) => {
    if (!isResolved) {
      reject(new CancelledError(cancelOptions));
      config.abort == null ? void 0 : config.abort();
    }
  };
  const cancelRetry = () => {
    isRetryCancelled = true;
  };
  const continueRetry = () => {
    isRetryCancelled = false;
  };
  const shouldPause = () => !focusManager.isFocused() || config.networkMode !== "always" && !onlineManager.isOnline();
  const resolve2 = (value) => {
    if (!isResolved) {
      isResolved = true;
      config.onSuccess == null ? void 0 : config.onSuccess(value);
      continueFn == null ? void 0 : continueFn();
      promiseResolve(value);
    }
  };
  const reject = (value) => {
    if (!isResolved) {
      isResolved = true;
      config.onError == null ? void 0 : config.onError(value);
      continueFn == null ? void 0 : continueFn();
      promiseReject(value);
    }
  };
  const pause = () => {
    return new Promise((continueResolve) => {
      continueFn = (value) => {
        const canContinue = isResolved || !shouldPause();
        if (canContinue) {
          continueResolve(value);
        }
        return canContinue;
      };
      config.onPause == null ? void 0 : config.onPause();
    }).then(() => {
      continueFn = void 0;
      if (!isResolved) {
        config.onContinue == null ? void 0 : config.onContinue();
      }
    });
  };
  const run = () => {
    if (isResolved) {
      return;
    }
    let promiseOrValue;
    try {
      promiseOrValue = config.fn();
    } catch (error) {
      promiseOrValue = Promise.reject(error);
    }
    Promise.resolve(promiseOrValue).then(resolve2).catch((error) => {
      var _config$retry, _config$retryDelay;
      if (isResolved) {
        return;
      }
      const retry = (_config$retry = config.retry) != null ? _config$retry : 3;
      const retryDelay = (_config$retryDelay = config.retryDelay) != null ? _config$retryDelay : defaultRetryDelay;
      const delay = typeof retryDelay === "function" ? retryDelay(failureCount, error) : retryDelay;
      const shouldRetry = retry === true || typeof retry === "number" && failureCount < retry || typeof retry === "function" && retry(failureCount, error);
      if (isRetryCancelled || !shouldRetry) {
        reject(error);
        return;
      }
      failureCount++;
      config.onFail == null ? void 0 : config.onFail(failureCount, error);
      sleep(delay).then(() => {
        if (shouldPause()) {
          return pause();
        }
        return;
      }).then(() => {
        if (isRetryCancelled) {
          reject(error);
        } else {
          run();
        }
      });
    });
  };
  if (canFetch(config.networkMode)) {
    run();
  } else {
    pause().then(run);
  }
  return {
    promise,
    cancel,
    continue: () => {
      const didContinue = continueFn == null ? void 0 : continueFn();
      return didContinue ? promise : Promise.resolve();
    },
    cancelRetry,
    continueRetry
  };
}
const defaultLogger = console;
function createNotifyManager() {
  let queue = [];
  let transactions = 0;
  let notifyFn = (callback) => {
    callback();
  };
  let batchNotifyFn = (callback) => {
    callback();
  };
  const batch = (callback) => {
    let result;
    transactions++;
    try {
      result = callback();
    } finally {
      transactions--;
      if (!transactions) {
        flush();
      }
    }
    return result;
  };
  const schedule = (callback) => {
    if (transactions) {
      queue.push(callback);
    } else {
      scheduleMicrotask(() => {
        notifyFn(callback);
      });
    }
  };
  const batchCalls = (callback) => {
    return (...args) => {
      schedule(() => {
        callback(...args);
      });
    };
  };
  const flush = () => {
    const originalQueue = queue;
    queue = [];
    if (originalQueue.length) {
      scheduleMicrotask(() => {
        batchNotifyFn(() => {
          originalQueue.forEach((callback) => {
            notifyFn(callback);
          });
        });
      });
    }
  };
  const setNotifyFunction = (fn) => {
    notifyFn = fn;
  };
  const setBatchNotifyFunction = (fn) => {
    batchNotifyFn = fn;
  };
  return {
    batch,
    batchCalls,
    schedule,
    setNotifyFunction,
    setBatchNotifyFunction
  };
}
const notifyManager = createNotifyManager();
class Removable {
  destroy() {
    this.clearGcTimeout();
  }
  scheduleGc() {
    this.clearGcTimeout();
    if (isValidTimeout(this.cacheTime)) {
      this.gcTimeout = setTimeout(() => {
        this.optionalRemove();
      }, this.cacheTime);
    }
  }
  updateCacheTime(newCacheTime) {
    this.cacheTime = Math.max(this.cacheTime || 0, newCacheTime != null ? newCacheTime : isServer ? Infinity : 5 * 60 * 1e3);
  }
  clearGcTimeout() {
    if (this.gcTimeout) {
      clearTimeout(this.gcTimeout);
      this.gcTimeout = void 0;
    }
  }
}
class Query extends Removable {
  constructor(config) {
    super();
    this.abortSignalConsumed = false;
    this.defaultOptions = config.defaultOptions;
    this.setOptions(config.options);
    this.observers = [];
    this.cache = config.cache;
    this.logger = config.logger || defaultLogger;
    this.queryKey = config.queryKey;
    this.queryHash = config.queryHash;
    this.initialState = config.state || getDefaultState$1(this.options);
    this.state = this.initialState;
    this.scheduleGc();
  }
  get meta() {
    return this.options.meta;
  }
  setOptions(options) {
    this.options = {
      ...this.defaultOptions,
      ...options
    };
    this.updateCacheTime(this.options.cacheTime);
  }
  optionalRemove() {
    if (!this.observers.length && this.state.fetchStatus === "idle") {
      this.cache.remove(this);
    }
  }
  setData(newData, options) {
    const data = replaceData(this.state.data, newData, this.options);
    this.dispatch({
      data,
      type: "success",
      dataUpdatedAt: options == null ? void 0 : options.updatedAt,
      manual: options == null ? void 0 : options.manual
    });
    return data;
  }
  setState(state, setStateOptions) {
    this.dispatch({
      type: "setState",
      state,
      setStateOptions
    });
  }
  cancel(options) {
    var _this$retryer;
    const promise = this.promise;
    (_this$retryer = this.retryer) == null ? void 0 : _this$retryer.cancel(options);
    return promise ? promise.then(noop$1).catch(noop$1) : Promise.resolve();
  }
  destroy() {
    super.destroy();
    this.cancel({
      silent: true
    });
  }
  reset() {
    this.destroy();
    this.setState(this.initialState);
  }
  isActive() {
    return this.observers.some((observer) => observer.options.enabled !== false);
  }
  isDisabled() {
    return this.getObserversCount() > 0 && !this.isActive();
  }
  isStale() {
    return this.state.isInvalidated || !this.state.dataUpdatedAt || this.observers.some((observer) => observer.getCurrentResult().isStale);
  }
  isStaleByTime(staleTime = 0) {
    return this.state.isInvalidated || !this.state.dataUpdatedAt || !timeUntilStale(this.state.dataUpdatedAt, staleTime);
  }
  onFocus() {
    var _this$retryer2;
    const observer = this.observers.find((x2) => x2.shouldFetchOnWindowFocus());
    if (observer) {
      observer.refetch({
        cancelRefetch: false
      });
    }
    (_this$retryer2 = this.retryer) == null ? void 0 : _this$retryer2.continue();
  }
  onOnline() {
    var _this$retryer3;
    const observer = this.observers.find((x2) => x2.shouldFetchOnReconnect());
    if (observer) {
      observer.refetch({
        cancelRefetch: false
      });
    }
    (_this$retryer3 = this.retryer) == null ? void 0 : _this$retryer3.continue();
  }
  addObserver(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      this.clearGcTimeout();
      this.cache.notify({
        type: "observerAdded",
        query: this,
        observer
      });
    }
  }
  removeObserver(observer) {
    if (this.observers.includes(observer)) {
      this.observers = this.observers.filter((x2) => x2 !== observer);
      if (!this.observers.length) {
        if (this.retryer) {
          if (this.abortSignalConsumed) {
            this.retryer.cancel({
              revert: true
            });
          } else {
            this.retryer.cancelRetry();
          }
        }
        this.scheduleGc();
      }
      this.cache.notify({
        type: "observerRemoved",
        query: this,
        observer
      });
    }
  }
  getObserversCount() {
    return this.observers.length;
  }
  invalidate() {
    if (!this.state.isInvalidated) {
      this.dispatch({
        type: "invalidate"
      });
    }
  }
  fetch(options, fetchOptions) {
    var _this$options$behavio, _context$fetchOptions;
    if (this.state.fetchStatus !== "idle") {
      if (this.state.dataUpdatedAt && fetchOptions != null && fetchOptions.cancelRefetch) {
        this.cancel({
          silent: true
        });
      } else if (this.promise) {
        var _this$retryer4;
        (_this$retryer4 = this.retryer) == null ? void 0 : _this$retryer4.continueRetry();
        return this.promise;
      }
    }
    if (options) {
      this.setOptions(options);
    }
    if (!this.options.queryFn) {
      const observer = this.observers.find((x2) => x2.options.queryFn);
      if (observer) {
        this.setOptions(observer.options);
      }
    }
    const abortController = getAbortController();
    const queryFnContext = {
      queryKey: this.queryKey,
      pageParam: void 0,
      meta: this.meta
    };
    const addSignalProperty = (object2) => {
      Object.defineProperty(object2, "signal", {
        enumerable: true,
        get: () => {
          if (abortController) {
            this.abortSignalConsumed = true;
            return abortController.signal;
          }
          return void 0;
        }
      });
    };
    addSignalProperty(queryFnContext);
    const fetchFn = () => {
      if (!this.options.queryFn) {
        return Promise.reject("Missing queryFn for queryKey '" + this.options.queryHash + "'");
      }
      this.abortSignalConsumed = false;
      return this.options.queryFn(queryFnContext);
    };
    const context = {
      fetchOptions,
      options: this.options,
      queryKey: this.queryKey,
      state: this.state,
      fetchFn
    };
    addSignalProperty(context);
    (_this$options$behavio = this.options.behavior) == null ? void 0 : _this$options$behavio.onFetch(context);
    this.revertState = this.state;
    if (this.state.fetchStatus === "idle" || this.state.fetchMeta !== ((_context$fetchOptions = context.fetchOptions) == null ? void 0 : _context$fetchOptions.meta)) {
      var _context$fetchOptions2;
      this.dispatch({
        type: "fetch",
        meta: (_context$fetchOptions2 = context.fetchOptions) == null ? void 0 : _context$fetchOptions2.meta
      });
    }
    const onError = (error) => {
      if (!(isCancelledError(error) && error.silent)) {
        this.dispatch({
          type: "error",
          error
        });
      }
      if (!isCancelledError(error)) {
        var _this$cache$config$on, _this$cache$config, _this$cache$config$on2, _this$cache$config2;
        (_this$cache$config$on = (_this$cache$config = this.cache.config).onError) == null ? void 0 : _this$cache$config$on.call(_this$cache$config, error, this);
        (_this$cache$config$on2 = (_this$cache$config2 = this.cache.config).onSettled) == null ? void 0 : _this$cache$config$on2.call(_this$cache$config2, this.state.data, error, this);
      }
      if (!this.isFetchingOptimistic) {
        this.scheduleGc();
      }
      this.isFetchingOptimistic = false;
    };
    this.retryer = createRetryer({
      fn: context.fetchFn,
      abort: abortController == null ? void 0 : abortController.abort.bind(abortController),
      onSuccess: (data) => {
        var _this$cache$config$on3, _this$cache$config3, _this$cache$config$on4, _this$cache$config4;
        if (typeof data === "undefined") {
          onError(new Error(this.queryHash + " data is undefined"));
          return;
        }
        this.setData(data);
        (_this$cache$config$on3 = (_this$cache$config3 = this.cache.config).onSuccess) == null ? void 0 : _this$cache$config$on3.call(_this$cache$config3, data, this);
        (_this$cache$config$on4 = (_this$cache$config4 = this.cache.config).onSettled) == null ? void 0 : _this$cache$config$on4.call(_this$cache$config4, data, this.state.error, this);
        if (!this.isFetchingOptimistic) {
          this.scheduleGc();
        }
        this.isFetchingOptimistic = false;
      },
      onError,
      onFail: (failureCount, error) => {
        this.dispatch({
          type: "failed",
          failureCount,
          error
        });
      },
      onPause: () => {
        this.dispatch({
          type: "pause"
        });
      },
      onContinue: () => {
        this.dispatch({
          type: "continue"
        });
      },
      retry: context.options.retry,
      retryDelay: context.options.retryDelay,
      networkMode: context.options.networkMode
    });
    this.promise = this.retryer.promise;
    return this.promise;
  }
  dispatch(action) {
    const reducer = (state) => {
      var _action$meta, _action$dataUpdatedAt;
      switch (action.type) {
        case "failed":
          return {
            ...state,
            fetchFailureCount: action.failureCount,
            fetchFailureReason: action.error
          };
        case "pause":
          return {
            ...state,
            fetchStatus: "paused"
          };
        case "continue":
          return {
            ...state,
            fetchStatus: "fetching"
          };
        case "fetch":
          return {
            ...state,
            fetchFailureCount: 0,
            fetchFailureReason: null,
            fetchMeta: (_action$meta = action.meta) != null ? _action$meta : null,
            fetchStatus: canFetch(this.options.networkMode) ? "fetching" : "paused",
            ...!state.dataUpdatedAt && {
              error: null,
              status: "loading"
            }
          };
        case "success":
          return {
            ...state,
            data: action.data,
            dataUpdateCount: state.dataUpdateCount + 1,
            dataUpdatedAt: (_action$dataUpdatedAt = action.dataUpdatedAt) != null ? _action$dataUpdatedAt : Date.now(),
            error: null,
            isInvalidated: false,
            status: "success",
            ...!action.manual && {
              fetchStatus: "idle",
              fetchFailureCount: 0,
              fetchFailureReason: null
            }
          };
        case "error":
          const error = action.error;
          if (isCancelledError(error) && error.revert && this.revertState) {
            return {
              ...this.revertState,
              fetchStatus: "idle"
            };
          }
          return {
            ...state,
            error,
            errorUpdateCount: state.errorUpdateCount + 1,
            errorUpdatedAt: Date.now(),
            fetchFailureCount: state.fetchFailureCount + 1,
            fetchFailureReason: error,
            fetchStatus: "idle",
            status: "error"
          };
        case "invalidate":
          return {
            ...state,
            isInvalidated: true
          };
        case "setState":
          return {
            ...state,
            ...action.state
          };
      }
    };
    this.state = reducer(this.state);
    notifyManager.batch(() => {
      this.observers.forEach((observer) => {
        observer.onQueryUpdate(action);
      });
      this.cache.notify({
        query: this,
        type: "updated",
        action
      });
    });
  }
}
function getDefaultState$1(options) {
  const data = typeof options.initialData === "function" ? options.initialData() : options.initialData;
  const hasData = typeof data !== "undefined";
  const initialDataUpdatedAt = hasData ? typeof options.initialDataUpdatedAt === "function" ? options.initialDataUpdatedAt() : options.initialDataUpdatedAt : 0;
  return {
    data,
    dataUpdateCount: 0,
    dataUpdatedAt: hasData ? initialDataUpdatedAt != null ? initialDataUpdatedAt : Date.now() : 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchMeta: null,
    isInvalidated: false,
    status: hasData ? "success" : "loading",
    fetchStatus: "idle"
  };
}
class QueryCache extends Subscribable {
  constructor(config) {
    super();
    this.config = config || {};
    this.queries = [];
    this.queriesMap = {};
  }
  build(client2, options, state) {
    var _options$queryHash;
    const queryKey = options.queryKey;
    const queryHash = (_options$queryHash = options.queryHash) != null ? _options$queryHash : hashQueryKeyByOptions(queryKey, options);
    let query = this.get(queryHash);
    if (!query) {
      query = new Query({
        cache: this,
        logger: client2.getLogger(),
        queryKey,
        queryHash,
        options: client2.defaultQueryOptions(options),
        state,
        defaultOptions: client2.getQueryDefaults(queryKey)
      });
      this.add(query);
    }
    return query;
  }
  add(query) {
    if (!this.queriesMap[query.queryHash]) {
      this.queriesMap[query.queryHash] = query;
      this.queries.push(query);
      this.notify({
        type: "added",
        query
      });
    }
  }
  remove(query) {
    const queryInMap = this.queriesMap[query.queryHash];
    if (queryInMap) {
      query.destroy();
      this.queries = this.queries.filter((x2) => x2 !== query);
      if (queryInMap === query) {
        delete this.queriesMap[query.queryHash];
      }
      this.notify({
        type: "removed",
        query
      });
    }
  }
  clear() {
    notifyManager.batch(() => {
      this.queries.forEach((query) => {
        this.remove(query);
      });
    });
  }
  get(queryHash) {
    return this.queriesMap[queryHash];
  }
  getAll() {
    return this.queries;
  }
  /**
   * @deprecated This method should be used with only one object argument.
   */
  find(arg1, arg2) {
    const [filters] = parseFilterArgs(arg1, arg2);
    if (typeof filters.exact === "undefined") {
      filters.exact = true;
    }
    return this.queries.find((query) => matchQuery(filters, query));
  }
  /**
   * @deprecated This method should be used with only one object argument.
   */
  findAll(arg1, arg2) {
    const [filters] = parseFilterArgs(arg1, arg2);
    return Object.keys(filters).length > 0 ? this.queries.filter((query) => matchQuery(filters, query)) : this.queries;
  }
  notify(event2) {
    notifyManager.batch(() => {
      this.listeners.forEach(({
        listener
      }) => {
        listener(event2);
      });
    });
  }
  onFocus() {
    notifyManager.batch(() => {
      this.queries.forEach((query) => {
        query.onFocus();
      });
    });
  }
  onOnline() {
    notifyManager.batch(() => {
      this.queries.forEach((query) => {
        query.onOnline();
      });
    });
  }
}
class Mutation extends Removable {
  constructor(config) {
    super();
    this.defaultOptions = config.defaultOptions;
    this.mutationId = config.mutationId;
    this.mutationCache = config.mutationCache;
    this.logger = config.logger || defaultLogger;
    this.observers = [];
    this.state = config.state || getDefaultState();
    this.setOptions(config.options);
    this.scheduleGc();
  }
  setOptions(options) {
    this.options = {
      ...this.defaultOptions,
      ...options
    };
    this.updateCacheTime(this.options.cacheTime);
  }
  get meta() {
    return this.options.meta;
  }
  setState(state) {
    this.dispatch({
      type: "setState",
      state
    });
  }
  addObserver(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      this.clearGcTimeout();
      this.mutationCache.notify({
        type: "observerAdded",
        mutation: this,
        observer
      });
    }
  }
  removeObserver(observer) {
    this.observers = this.observers.filter((x2) => x2 !== observer);
    this.scheduleGc();
    this.mutationCache.notify({
      type: "observerRemoved",
      mutation: this,
      observer
    });
  }
  optionalRemove() {
    if (!this.observers.length) {
      if (this.state.status === "loading") {
        this.scheduleGc();
      } else {
        this.mutationCache.remove(this);
      }
    }
  }
  continue() {
    var _this$retryer$continu, _this$retryer;
    return (_this$retryer$continu = (_this$retryer = this.retryer) == null ? void 0 : _this$retryer.continue()) != null ? _this$retryer$continu : this.execute();
  }
  async execute() {
    const executeMutation = () => {
      var _this$options$retry;
      this.retryer = createRetryer({
        fn: () => {
          if (!this.options.mutationFn) {
            return Promise.reject("No mutationFn found");
          }
          return this.options.mutationFn(this.state.variables);
        },
        onFail: (failureCount, error) => {
          this.dispatch({
            type: "failed",
            failureCount,
            error
          });
        },
        onPause: () => {
          this.dispatch({
            type: "pause"
          });
        },
        onContinue: () => {
          this.dispatch({
            type: "continue"
          });
        },
        retry: (_this$options$retry = this.options.retry) != null ? _this$options$retry : 0,
        retryDelay: this.options.retryDelay,
        networkMode: this.options.networkMode
      });
      return this.retryer.promise;
    };
    const restored = this.state.status === "loading";
    try {
      var _this$mutationCache$c3, _this$mutationCache$c4, _this$options$onSucce, _this$options2, _this$mutationCache$c5, _this$mutationCache$c6, _this$options$onSettl, _this$options3;
      if (!restored) {
        var _this$mutationCache$c, _this$mutationCache$c2, _this$options$onMutat, _this$options;
        this.dispatch({
          type: "loading",
          variables: this.options.variables
        });
        await ((_this$mutationCache$c = (_this$mutationCache$c2 = this.mutationCache.config).onMutate) == null ? void 0 : _this$mutationCache$c.call(_this$mutationCache$c2, this.state.variables, this));
        const context = await ((_this$options$onMutat = (_this$options = this.options).onMutate) == null ? void 0 : _this$options$onMutat.call(_this$options, this.state.variables));
        if (context !== this.state.context) {
          this.dispatch({
            type: "loading",
            context,
            variables: this.state.variables
          });
        }
      }
      const data = await executeMutation();
      await ((_this$mutationCache$c3 = (_this$mutationCache$c4 = this.mutationCache.config).onSuccess) == null ? void 0 : _this$mutationCache$c3.call(_this$mutationCache$c4, data, this.state.variables, this.state.context, this));
      await ((_this$options$onSucce = (_this$options2 = this.options).onSuccess) == null ? void 0 : _this$options$onSucce.call(_this$options2, data, this.state.variables, this.state.context));
      await ((_this$mutationCache$c5 = (_this$mutationCache$c6 = this.mutationCache.config).onSettled) == null ? void 0 : _this$mutationCache$c5.call(_this$mutationCache$c6, data, null, this.state.variables, this.state.context, this));
      await ((_this$options$onSettl = (_this$options3 = this.options).onSettled) == null ? void 0 : _this$options$onSettl.call(_this$options3, data, null, this.state.variables, this.state.context));
      this.dispatch({
        type: "success",
        data
      });
      return data;
    } catch (error) {
      try {
        var _this$mutationCache$c7, _this$mutationCache$c8, _this$options$onError, _this$options4, _this$mutationCache$c9, _this$mutationCache$c10, _this$options$onSettl2, _this$options5;
        await ((_this$mutationCache$c7 = (_this$mutationCache$c8 = this.mutationCache.config).onError) == null ? void 0 : _this$mutationCache$c7.call(_this$mutationCache$c8, error, this.state.variables, this.state.context, this));
        if (false)
          ;
        await ((_this$options$onError = (_this$options4 = this.options).onError) == null ? void 0 : _this$options$onError.call(_this$options4, error, this.state.variables, this.state.context));
        await ((_this$mutationCache$c9 = (_this$mutationCache$c10 = this.mutationCache.config).onSettled) == null ? void 0 : _this$mutationCache$c9.call(_this$mutationCache$c10, void 0, error, this.state.variables, this.state.context, this));
        await ((_this$options$onSettl2 = (_this$options5 = this.options).onSettled) == null ? void 0 : _this$options$onSettl2.call(_this$options5, void 0, error, this.state.variables, this.state.context));
        throw error;
      } finally {
        this.dispatch({
          type: "error",
          error
        });
      }
    }
  }
  dispatch(action) {
    const reducer = (state) => {
      switch (action.type) {
        case "failed":
          return {
            ...state,
            failureCount: action.failureCount,
            failureReason: action.error
          };
        case "pause":
          return {
            ...state,
            isPaused: true
          };
        case "continue":
          return {
            ...state,
            isPaused: false
          };
        case "loading":
          return {
            ...state,
            context: action.context,
            data: void 0,
            failureCount: 0,
            failureReason: null,
            error: null,
            isPaused: !canFetch(this.options.networkMode),
            status: "loading",
            variables: action.variables
          };
        case "success":
          return {
            ...state,
            data: action.data,
            failureCount: 0,
            failureReason: null,
            error: null,
            status: "success",
            isPaused: false
          };
        case "error":
          return {
            ...state,
            data: void 0,
            error: action.error,
            failureCount: state.failureCount + 1,
            failureReason: action.error,
            isPaused: false,
            status: "error"
          };
        case "setState":
          return {
            ...state,
            ...action.state
          };
      }
    };
    this.state = reducer(this.state);
    notifyManager.batch(() => {
      this.observers.forEach((observer) => {
        observer.onMutationUpdate(action);
      });
      this.mutationCache.notify({
        mutation: this,
        type: "updated",
        action
      });
    });
  }
}
function getDefaultState() {
  return {
    context: void 0,
    data: void 0,
    error: null,
    failureCount: 0,
    failureReason: null,
    isPaused: false,
    status: "idle",
    variables: void 0
  };
}
class MutationCache extends Subscribable {
  constructor(config) {
    super();
    this.config = config || {};
    this.mutations = [];
    this.mutationId = 0;
  }
  build(client2, options, state) {
    const mutation = new Mutation({
      mutationCache: this,
      logger: client2.getLogger(),
      mutationId: ++this.mutationId,
      options: client2.defaultMutationOptions(options),
      state,
      defaultOptions: options.mutationKey ? client2.getMutationDefaults(options.mutationKey) : void 0
    });
    this.add(mutation);
    return mutation;
  }
  add(mutation) {
    this.mutations.push(mutation);
    this.notify({
      type: "added",
      mutation
    });
  }
  remove(mutation) {
    this.mutations = this.mutations.filter((x2) => x2 !== mutation);
    this.notify({
      type: "removed",
      mutation
    });
  }
  clear() {
    notifyManager.batch(() => {
      this.mutations.forEach((mutation) => {
        this.remove(mutation);
      });
    });
  }
  getAll() {
    return this.mutations;
  }
  find(filters) {
    if (typeof filters.exact === "undefined") {
      filters.exact = true;
    }
    return this.mutations.find((mutation) => matchMutation(filters, mutation));
  }
  findAll(filters) {
    return this.mutations.filter((mutation) => matchMutation(filters, mutation));
  }
  notify(event2) {
    notifyManager.batch(() => {
      this.listeners.forEach(({
        listener
      }) => {
        listener(event2);
      });
    });
  }
  resumePausedMutations() {
    var _this$resuming;
    this.resuming = ((_this$resuming = this.resuming) != null ? _this$resuming : Promise.resolve()).then(() => {
      const pausedMutations = this.mutations.filter((x2) => x2.state.isPaused);
      return notifyManager.batch(() => pausedMutations.reduce((promise, mutation) => promise.then(() => mutation.continue().catch(noop$1)), Promise.resolve()));
    }).then(() => {
      this.resuming = void 0;
    });
    return this.resuming;
  }
}
function infiniteQueryBehavior() {
  return {
    onFetch: (context) => {
      context.fetchFn = () => {
        var _context$fetchOptions, _context$fetchOptions2, _context$fetchOptions3, _context$fetchOptions4, _context$state$data, _context$state$data2;
        const refetchPage = (_context$fetchOptions = context.fetchOptions) == null ? void 0 : (_context$fetchOptions2 = _context$fetchOptions.meta) == null ? void 0 : _context$fetchOptions2.refetchPage;
        const fetchMore = (_context$fetchOptions3 = context.fetchOptions) == null ? void 0 : (_context$fetchOptions4 = _context$fetchOptions3.meta) == null ? void 0 : _context$fetchOptions4.fetchMore;
        const pageParam = fetchMore == null ? void 0 : fetchMore.pageParam;
        const isFetchingNextPage = (fetchMore == null ? void 0 : fetchMore.direction) === "forward";
        const isFetchingPreviousPage = (fetchMore == null ? void 0 : fetchMore.direction) === "backward";
        const oldPages = ((_context$state$data = context.state.data) == null ? void 0 : _context$state$data.pages) || [];
        const oldPageParams = ((_context$state$data2 = context.state.data) == null ? void 0 : _context$state$data2.pageParams) || [];
        let newPageParams = oldPageParams;
        let cancelled = false;
        const addSignalProperty = (object2) => {
          Object.defineProperty(object2, "signal", {
            enumerable: true,
            get: () => {
              var _context$signal;
              if ((_context$signal = context.signal) != null && _context$signal.aborted) {
                cancelled = true;
              } else {
                var _context$signal2;
                (_context$signal2 = context.signal) == null ? void 0 : _context$signal2.addEventListener("abort", () => {
                  cancelled = true;
                });
              }
              return context.signal;
            }
          });
        };
        const queryFn = context.options.queryFn || (() => Promise.reject("Missing queryFn for queryKey '" + context.options.queryHash + "'"));
        const buildNewPages = (pages, param, page, previous) => {
          newPageParams = previous ? [param, ...newPageParams] : [...newPageParams, param];
          return previous ? [page, ...pages] : [...pages, page];
        };
        const fetchPage = (pages, manual, param, previous) => {
          if (cancelled) {
            return Promise.reject("Cancelled");
          }
          if (typeof param === "undefined" && !manual && pages.length) {
            return Promise.resolve(pages);
          }
          const queryFnContext = {
            queryKey: context.queryKey,
            pageParam: param,
            meta: context.options.meta
          };
          addSignalProperty(queryFnContext);
          const queryFnResult = queryFn(queryFnContext);
          const promise2 = Promise.resolve(queryFnResult).then((page) => buildNewPages(pages, param, page, previous));
          return promise2;
        };
        let promise;
        if (!oldPages.length) {
          promise = fetchPage([]);
        } else if (isFetchingNextPage) {
          const manual = typeof pageParam !== "undefined";
          const param = manual ? pageParam : getNextPageParam(context.options, oldPages);
          promise = fetchPage(oldPages, manual, param);
        } else if (isFetchingPreviousPage) {
          const manual = typeof pageParam !== "undefined";
          const param = manual ? pageParam : getPreviousPageParam(context.options, oldPages);
          promise = fetchPage(oldPages, manual, param, true);
        } else {
          newPageParams = [];
          const manual = typeof context.options.getNextPageParam === "undefined";
          const shouldFetchFirstPage = refetchPage && oldPages[0] ? refetchPage(oldPages[0], 0, oldPages) : true;
          promise = shouldFetchFirstPage ? fetchPage([], manual, oldPageParams[0]) : Promise.resolve(buildNewPages([], oldPageParams[0], oldPages[0]));
          for (let i2 = 1; i2 < oldPages.length; i2++) {
            promise = promise.then((pages) => {
              const shouldFetchNextPage = refetchPage && oldPages[i2] ? refetchPage(oldPages[i2], i2, oldPages) : true;
              if (shouldFetchNextPage) {
                const param = manual ? oldPageParams[i2] : getNextPageParam(context.options, pages);
                return fetchPage(pages, manual, param);
              }
              return Promise.resolve(buildNewPages(pages, oldPageParams[i2], oldPages[i2]));
            });
          }
        }
        const finalPromise = promise.then((pages) => ({
          pages,
          pageParams: newPageParams
        }));
        return finalPromise;
      };
    }
  };
}
function getNextPageParam(options, pages) {
  return options.getNextPageParam == null ? void 0 : options.getNextPageParam(pages[pages.length - 1], pages);
}
function getPreviousPageParam(options, pages) {
  return options.getPreviousPageParam == null ? void 0 : options.getPreviousPageParam(pages[0], pages);
}
class QueryClient {
  constructor(config = {}) {
    this.queryCache = config.queryCache || new QueryCache();
    this.mutationCache = config.mutationCache || new MutationCache();
    this.logger = config.logger || defaultLogger;
    this.defaultOptions = config.defaultOptions || {};
    this.queryDefaults = [];
    this.mutationDefaults = [];
    this.mountCount = 0;
  }
  mount() {
    this.mountCount++;
    if (this.mountCount !== 1)
      return;
    this.unsubscribeFocus = focusManager.subscribe(() => {
      if (focusManager.isFocused()) {
        this.resumePausedMutations();
        this.queryCache.onFocus();
      }
    });
    this.unsubscribeOnline = onlineManager.subscribe(() => {
      if (onlineManager.isOnline()) {
        this.resumePausedMutations();
        this.queryCache.onOnline();
      }
    });
  }
  unmount() {
    var _this$unsubscribeFocu, _this$unsubscribeOnli;
    this.mountCount--;
    if (this.mountCount !== 0)
      return;
    (_this$unsubscribeFocu = this.unsubscribeFocus) == null ? void 0 : _this$unsubscribeFocu.call(this);
    this.unsubscribeFocus = void 0;
    (_this$unsubscribeOnli = this.unsubscribeOnline) == null ? void 0 : _this$unsubscribeOnli.call(this);
    this.unsubscribeOnline = void 0;
  }
  /**
   * @deprecated This method should be used with only one object argument.
   */
  isFetching(arg1, arg2) {
    const [filters] = parseFilterArgs(arg1, arg2);
    filters.fetchStatus = "fetching";
    return this.queryCache.findAll(filters).length;
  }
  isMutating(filters) {
    return this.mutationCache.findAll({
      ...filters,
      fetching: true
    }).length;
  }
  /**
   * @deprecated This method will accept only queryKey in the next major version.
   */
  getQueryData(queryKey, filters) {
    var _this$queryCache$find;
    return (_this$queryCache$find = this.queryCache.find(queryKey, filters)) == null ? void 0 : _this$queryCache$find.state.data;
  }
  /**
   * @deprecated This method should be used with only one object argument.
   */
  ensureQueryData(arg1, arg2, arg3) {
    const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
    const cachedData = this.getQueryData(parsedOptions.queryKey);
    return cachedData ? Promise.resolve(cachedData) : this.fetchQuery(parsedOptions);
  }
  /**
   * @deprecated This method should be used with only one object argument.
   */
  getQueriesData(queryKeyOrFilters) {
    return this.getQueryCache().findAll(queryKeyOrFilters).map(({
      queryKey,
      state
    }) => {
      const data = state.data;
      return [queryKey, data];
    });
  }
  setQueryData(queryKey, updater, options) {
    const query = this.queryCache.find(queryKey);
    const prevData = query == null ? void 0 : query.state.data;
    const data = functionalUpdate(updater, prevData);
    if (typeof data === "undefined") {
      return void 0;
    }
    const parsedOptions = parseQueryArgs(queryKey);
    const defaultedOptions = this.defaultQueryOptions(parsedOptions);
    return this.queryCache.build(this, defaultedOptions).setData(data, {
      ...options,
      manual: true
    });
  }
  /**
   * @deprecated This method should be used with only one object argument.
   */
  setQueriesData(queryKeyOrFilters, updater, options) {
    return notifyManager.batch(() => this.getQueryCache().findAll(queryKeyOrFilters).map(({
      queryKey
    }) => [queryKey, this.setQueryData(queryKey, updater, options)]));
  }
  getQueryState(queryKey, filters) {
    var _this$queryCache$find2;
    return (_this$queryCache$find2 = this.queryCache.find(queryKey, filters)) == null ? void 0 : _this$queryCache$find2.state;
  }
  /**
   * @deprecated This method should be used with only one object argument.
   */
  removeQueries(arg1, arg2) {
    const [filters] = parseFilterArgs(arg1, arg2);
    const queryCache = this.queryCache;
    notifyManager.batch(() => {
      queryCache.findAll(filters).forEach((query) => {
        queryCache.remove(query);
      });
    });
  }
  /**
   * @deprecated This method should be used with only one object argument.
   */
  resetQueries(arg1, arg2, arg3) {
    const [filters, options] = parseFilterArgs(arg1, arg2, arg3);
    const queryCache = this.queryCache;
    const refetchFilters = {
      type: "active",
      ...filters
    };
    return notifyManager.batch(() => {
      queryCache.findAll(filters).forEach((query) => {
        query.reset();
      });
      return this.refetchQueries(refetchFilters, options);
    });
  }
  /**
   * @deprecated This method should be used with only one object argument.
   */
  cancelQueries(arg1, arg2, arg3) {
    const [filters, cancelOptions = {}] = parseFilterArgs(arg1, arg2, arg3);
    if (typeof cancelOptions.revert === "undefined") {
      cancelOptions.revert = true;
    }
    const promises = notifyManager.batch(() => this.queryCache.findAll(filters).map((query) => query.cancel(cancelOptions)));
    return Promise.all(promises).then(noop$1).catch(noop$1);
  }
  /**
   * @deprecated This method should be used with only one object argument.
   */
  invalidateQueries(arg1, arg2, arg3) {
    const [filters, options] = parseFilterArgs(arg1, arg2, arg3);
    return notifyManager.batch(() => {
      var _ref, _filters$refetchType;
      this.queryCache.findAll(filters).forEach((query) => {
        query.invalidate();
      });
      if (filters.refetchType === "none") {
        return Promise.resolve();
      }
      const refetchFilters = {
        ...filters,
        type: (_ref = (_filters$refetchType = filters.refetchType) != null ? _filters$refetchType : filters.type) != null ? _ref : "active"
      };
      return this.refetchQueries(refetchFilters, options);
    });
  }
  /**
   * @deprecated This method should be used with only one object argument.
   */
  refetchQueries(arg1, arg2, arg3) {
    const [filters, options] = parseFilterArgs(arg1, arg2, arg3);
    const promises = notifyManager.batch(() => this.queryCache.findAll(filters).filter((query) => !query.isDisabled()).map((query) => {
      var _options$cancelRefetc;
      return query.fetch(void 0, {
        ...options,
        cancelRefetch: (_options$cancelRefetc = options == null ? void 0 : options.cancelRefetch) != null ? _options$cancelRefetc : true,
        meta: {
          refetchPage: filters.refetchPage
        }
      });
    }));
    let promise = Promise.all(promises).then(noop$1);
    if (!(options != null && options.throwOnError)) {
      promise = promise.catch(noop$1);
    }
    return promise;
  }
  /**
   * @deprecated This method should be used with only one object argument.
   */
  fetchQuery(arg1, arg2, arg3) {
    const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
    const defaultedOptions = this.defaultQueryOptions(parsedOptions);
    if (typeof defaultedOptions.retry === "undefined") {
      defaultedOptions.retry = false;
    }
    const query = this.queryCache.build(this, defaultedOptions);
    return query.isStaleByTime(defaultedOptions.staleTime) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
  }
  /**
   * @deprecated This method should be used with only one object argument.
   */
  prefetchQuery(arg1, arg2, arg3) {
    return this.fetchQuery(arg1, arg2, arg3).then(noop$1).catch(noop$1);
  }
  /**
   * @deprecated This method should be used with only one object argument.
   */
  fetchInfiniteQuery(arg1, arg2, arg3) {
    const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
    parsedOptions.behavior = infiniteQueryBehavior();
    return this.fetchQuery(parsedOptions);
  }
  /**
   * @deprecated This method should be used with only one object argument.
   */
  prefetchInfiniteQuery(arg1, arg2, arg3) {
    return this.fetchInfiniteQuery(arg1, arg2, arg3).then(noop$1).catch(noop$1);
  }
  resumePausedMutations() {
    return this.mutationCache.resumePausedMutations();
  }
  getQueryCache() {
    return this.queryCache;
  }
  getMutationCache() {
    return this.mutationCache;
  }
  getLogger() {
    return this.logger;
  }
  getDefaultOptions() {
    return this.defaultOptions;
  }
  setDefaultOptions(options) {
    this.defaultOptions = options;
  }
  setQueryDefaults(queryKey, options) {
    const result = this.queryDefaults.find((x2) => hashQueryKey(queryKey) === hashQueryKey(x2.queryKey));
    if (result) {
      result.defaultOptions = options;
    } else {
      this.queryDefaults.push({
        queryKey,
        defaultOptions: options
      });
    }
  }
  getQueryDefaults(queryKey) {
    if (!queryKey) {
      return void 0;
    }
    const firstMatchingDefaults = this.queryDefaults.find((x2) => partialMatchKey(queryKey, x2.queryKey));
    return firstMatchingDefaults == null ? void 0 : firstMatchingDefaults.defaultOptions;
  }
  setMutationDefaults(mutationKey, options) {
    const result = this.mutationDefaults.find((x2) => hashQueryKey(mutationKey) === hashQueryKey(x2.mutationKey));
    if (result) {
      result.defaultOptions = options;
    } else {
      this.mutationDefaults.push({
        mutationKey,
        defaultOptions: options
      });
    }
  }
  getMutationDefaults(mutationKey) {
    if (!mutationKey) {
      return void 0;
    }
    const firstMatchingDefaults = this.mutationDefaults.find((x2) => partialMatchKey(mutationKey, x2.mutationKey));
    return firstMatchingDefaults == null ? void 0 : firstMatchingDefaults.defaultOptions;
  }
  defaultQueryOptions(options) {
    if (options != null && options._defaulted) {
      return options;
    }
    const defaultedOptions = {
      ...this.defaultOptions.queries,
      ...this.getQueryDefaults(options == null ? void 0 : options.queryKey),
      ...options,
      _defaulted: true
    };
    if (!defaultedOptions.queryHash && defaultedOptions.queryKey) {
      defaultedOptions.queryHash = hashQueryKeyByOptions(defaultedOptions.queryKey, defaultedOptions);
    }
    if (typeof defaultedOptions.refetchOnReconnect === "undefined") {
      defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== "always";
    }
    if (typeof defaultedOptions.useErrorBoundary === "undefined") {
      defaultedOptions.useErrorBoundary = !!defaultedOptions.suspense;
    }
    return defaultedOptions;
  }
  defaultMutationOptions(options) {
    if (options != null && options._defaulted) {
      return options;
    }
    return {
      ...this.defaultOptions.mutations,
      ...this.getMutationDefaults(options == null ? void 0 : options.mutationKey),
      ...options,
      _defaulted: true
    };
  }
  clear() {
    this.queryCache.clear();
    this.mutationCache.clear();
  }
}
const defaultContext = /* @__PURE__ */ reactExports.createContext(void 0);
const QueryClientSharingContext = /* @__PURE__ */ reactExports.createContext(false);
function getQueryClientContext(context, contextSharing) {
  if (context) {
    return context;
  }
  if (contextSharing && typeof window !== "undefined") {
    if (!window.ReactQueryClientContext) {
      window.ReactQueryClientContext = defaultContext;
    }
    return window.ReactQueryClientContext;
  }
  return defaultContext;
}
const useQueryClient = ({
  context
} = {}) => {
  const queryClient2 = reactExports.useContext(getQueryClientContext(context, reactExports.useContext(QueryClientSharingContext)));
  if (!queryClient2) {
    throw new Error("No QueryClient set, use QueryClientProvider to set one");
  }
  return queryClient2;
};
const QueryClientProvider = ({
  client: client2,
  children,
  context,
  contextSharing = false
}) => {
  reactExports.useEffect(() => {
    client2.mount();
    return () => {
      client2.unmount();
    };
  }, [client2]);
  const Context = getQueryClientContext(context, contextSharing);
  return /* @__PURE__ */ reactExports.createElement(QueryClientSharingContext.Provider, {
    value: !context && contextSharing
  }, /* @__PURE__ */ reactExports.createElement(Context.Provider, {
    value: client2
  }, children));
};
const scriptRel = "modulepreload";
const assetsURL = function(dep) {
  return "/" + dep;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  if (!deps || deps.length === 0) {
    return baseModule();
  }
  const links = document.getElementsByTagName("link");
  return Promise.all(deps.map((dep) => {
    dep = assetsURL(dep);
    if (dep in seen)
      return;
    seen[dep] = true;
    const isCss = dep.endsWith(".css");
    const cssSelector = isCss ? '[rel="stylesheet"]' : "";
    const isBaseRelative = !!importerUrl;
    if (isBaseRelative) {
      for (let i2 = links.length - 1; i2 >= 0; i2--) {
        const link2 = links[i2];
        if (link2.href === dep && (!isCss || link2.rel === "stylesheet")) {
          return;
        }
      }
    } else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
      return;
    }
    const link = document.createElement("link");
    link.rel = isCss ? "stylesheet" : scriptRel;
    if (!isCss) {
      link.as = "script";
      link.crossOrigin = "";
    }
    link.href = dep;
    document.head.appendChild(link);
    if (isCss) {
      return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(new Error(`Unable to preload CSS for ${dep}`)));
      });
    }
  })).then(() => baseModule()).catch((err) => {
    const e2 = new Event("vite:preloadError", { cancelable: true });
    e2.payload = err;
    window.dispatchEvent(e2);
    if (!e2.defaultPrevented) {
      throw err;
    }
  });
};
const DashboardPage = reactExports.lazy(() => __vitePreload(() => import("./DashboardPage-aa041665.js"), true ? ["assets/DashboardPage-aa041665.js","assets/Breadcrumbs-efb8820d.js","assets/useEvents-248c8050.js","assets/StatusBadge-acb5659e.js","assets/MapPinIcon-0b58321d.js","assets/index-40c20874.js","assets/eventService-3ce97835.js","assets/usePaginatedQuery-9f703e2a.js","assets/useQuery-9e6818c0.js","assets/utils-814f13d4.js","assets/EmptyState-cbe24938.js","assets/notificationService-c1b9e504.js","assets/formatters-dc58be6b.js","assets/SparklesIcon-5e13cb87.js","assets/TrophyIcon-68cfba8d.js"] : void 0));
const EventsPage = reactExports.lazy(() => __vitePreload(() => import("./EventListPage-7ea313cb.js"), true ? ["assets/EventListPage-7ea313cb.js","assets/Breadcrumbs-efb8820d.js","assets/useEvents-248c8050.js","assets/StatusBadge-acb5659e.js","assets/MapPinIcon-0b58321d.js","assets/index-40c20874.js","assets/eventService-3ce97835.js","assets/usePaginatedQuery-9f703e2a.js","assets/useQuery-9e6818c0.js","assets/utils-814f13d4.js","assets/EmptyState-cbe24938.js","assets/PaginationControls-e16a2223.js","assets/SelectField-59bf6ec7.js","assets/TextField-8bd0f895.js","assets/PlusIcon-34f32654.js"] : void 0));
const EventDetailPage = reactExports.lazy(() => __vitePreload(() => import("./EventDetailPage-93222b9d.js"), true ? ["assets/EventDetailPage-93222b9d.js","assets/Breadcrumbs-efb8820d.js","assets/EmptyState-cbe24938.js","assets/StatusBadge-acb5659e.js","assets/useQuery-9e6818c0.js","assets/utils-814f13d4.js","assets/index-40c20874.js","assets/PaperClipIcon-328e4719.js","assets/PhotoIcon-382c3ecc.js","assets/eventService-3ce97835.js","assets/registrationService-2550b869.js","assets/formatters-dc58be6b.js","assets/useMutation-64b1a4ee.js","assets/MapPinIcon-0b58321d.js"] : void 0));
const CreateEventPage = reactExports.lazy(() => __vitePreload(() => import("./CreateEventPage-c51922c5.js"), true ? ["assets/CreateEventPage-c51922c5.js","assets/index.esm-0ed2c915.js","assets/types-b8c6b9bb.js","assets/Breadcrumbs-efb8820d.js","assets/TextField-8bd0f895.js","assets/SelectField-59bf6ec7.js","assets/SubmitButton-51e46fc3.js","assets/eventService-3ce97835.js","assets/useMutation-64b1a4ee.js","assets/utils-814f13d4.js","assets/PlusIcon-34f32654.js"] : void 0));
const CheckInPage = reactExports.lazy(() => __vitePreload(() => import("./CheckInPage-9efcbb48.js"), true ? ["assets/CheckInPage-9efcbb48.js","assets/Breadcrumbs-efb8820d.js","assets/SubmitButton-51e46fc3.js","assets/useMutation-64b1a4ee.js","assets/utils-814f13d4.js"] : void 0));
const GroupsPage = reactExports.lazy(() => __vitePreload(() => import("./GroupsPage-7b7dba6a.js"), true ? ["assets/GroupsPage-7b7dba6a.js","assets/index.esm-0ed2c915.js","assets/types-b8c6b9bb.js","assets/Breadcrumbs-efb8820d.js","assets/EmptyState-cbe24938.js","assets/PaginationControls-e16a2223.js","assets/TextField-8bd0f895.js","assets/SubmitButton-51e46fc3.js","assets/usePaginatedQuery-9f703e2a.js","assets/useQuery-9e6818c0.js","assets/utils-814f13d4.js","assets/groupService-7d8a3f1e.js","assets/useMutation-64b1a4ee.js","assets/PlusIcon-34f32654.js"] : void 0));
const NotificationsPage = reactExports.lazy(() => __vitePreload(() => import("./NotificationsPage-44a68daf.js"), true ? ["assets/NotificationsPage-44a68daf.js","assets/Breadcrumbs-efb8820d.js","assets/EmptyState-cbe24938.js","assets/PaginationControls-e16a2223.js","assets/usePaginatedQuery-9f703e2a.js","assets/useQuery-9e6818c0.js","assets/utils-814f13d4.js","assets/notificationService-c1b9e504.js","assets/userService-663d9ae7.js","assets/TextField-8bd0f895.js","assets/SelectField-59bf6ec7.js","assets/SubmitButton-51e46fc3.js","assets/index.esm-0ed2c915.js","assets/formatters-dc58be6b.js","assets/index-40c20874.js"] : void 0));
const ProfilePage = reactExports.lazy(() => __vitePreload(() => import("./ProfilePage-0233c11a.js"), true ? ["assets/ProfilePage-0233c11a.js","assets/Breadcrumbs-efb8820d.js","assets/TextField-8bd0f895.js","assets/SubmitButton-51e46fc3.js","assets/PhotoIcon-382c3ecc.js","assets/socialService-5a59fc5f.js","assets/useQuery-9e6818c0.js","assets/utils-814f13d4.js","assets/TrophyIcon-68cfba8d.js","assets/index.esm-0ed2c915.js","assets/types-b8c6b9bb.js"] : void 0));
const SettingsPage = reactExports.lazy(() => __vitePreload(() => import("./SettingsPage-d164b3a9.js"), true ? ["assets/SettingsPage-d164b3a9.js","assets/Breadcrumbs-efb8820d.js","assets/SubmitButton-51e46fc3.js"] : void 0));
const SurveyPage = reactExports.lazy(() => __vitePreload(() => import("./SurveyPage-bb4b8000.js"), true ? ["assets/SurveyPage-bb4b8000.js","assets/index.esm-0ed2c915.js","assets/Breadcrumbs-efb8820d.js","assets/EmptyState-cbe24938.js","assets/TextField-8bd0f895.js","assets/SelectField-59bf6ec7.js","assets/SubmitButton-51e46fc3.js","assets/surveyService-252277d9.js","assets/eventService-3ce97835.js","assets/useQuery-9e6818c0.js","assets/utils-814f13d4.js","assets/useMutation-64b1a4ee.js"] : void 0));
const FriendsPage = reactExports.lazy(() => __vitePreload(() => import("./FriendsPage-b08394ed.js"), true ? ["assets/FriendsPage-b08394ed.js","assets/Breadcrumbs-efb8820d.js","assets/EmptyState-cbe24938.js","assets/TextField-8bd0f895.js","assets/SubmitButton-51e46fc3.js","assets/socialService-5a59fc5f.js","assets/useQuery-9e6818c0.js","assets/utils-814f13d4.js","assets/useMutation-64b1a4ee.js"] : void 0));
const PrivateChatPage = reactExports.lazy(() => __vitePreload(() => import("./PrivateChatPage-18b8c619.js"), true ? ["assets/PrivateChatPage-18b8c619.js","assets/Breadcrumbs-efb8820d.js","assets/EmptyState-cbe24938.js","assets/socialService-5a59fc5f.js","assets/useQuery-9e6818c0.js","assets/utils-814f13d4.js","assets/PaperClipIcon-328e4719.js","assets/index-40c20874.js","assets/PhotoIcon-382c3ecc.js"] : void 0));
const GroupDetailPage = reactExports.lazy(() => __vitePreload(() => import("./GroupDetailPage-71cd979e.js"), true ? ["assets/GroupDetailPage-71cd979e.js","assets/index.esm-0ed2c915.js","assets/Breadcrumbs-efb8820d.js","assets/EmptyState-cbe24938.js","assets/groupService-7d8a3f1e.js","assets/useQuery-9e6818c0.js","assets/utils-814f13d4.js","assets/index-40c20874.js","assets/PaperClipIcon-328e4719.js","assets/PhotoIcon-382c3ecc.js","assets/TextField-8bd0f895.js","assets/SubmitButton-51e46fc3.js","assets/surveyService-252277d9.js","assets/SelectField-59bf6ec7.js","assets/registrationService-2550b869.js","assets/formatters-dc58be6b.js","assets/StatusBadge-acb5659e.js","assets/useMutation-64b1a4ee.js","assets/PlusIcon-34f32654.js"] : void 0));
const AdminUsersPage = reactExports.lazy(() => __vitePreload(() => import("./AdminUsersPage-ef451989.js"), true ? ["assets/AdminUsersPage-ef451989.js","assets/usePaginatedQuery-9f703e2a.js","assets/useQuery-9e6818c0.js","assets/utils-814f13d4.js","assets/userService-663d9ae7.js","assets/Breadcrumbs-efb8820d.js","assets/PaginationControls-e16a2223.js","assets/EmptyState-cbe24938.js","assets/SelectField-59bf6ec7.js","assets/TextField-8bd0f895.js"] : void 0));
const LoginPage = reactExports.lazy(() => __vitePreload(() => import("./LoginPage-7be2049d.js"), true ? ["assets/LoginPage-7be2049d.js","assets/index.esm-0ed2c915.js","assets/types-b8c6b9bb.js","assets/TextField-8bd0f895.js","assets/SubmitButton-51e46fc3.js","assets/SparklesIcon-5e13cb87.js"] : void 0));
const RegisterPage = reactExports.lazy(() => __vitePreload(() => import("./RegisterPage-b540ce8b.js"), true ? ["assets/RegisterPage-b540ce8b.js","assets/index.esm-0ed2c915.js","assets/types-b8c6b9bb.js","assets/TextField-8bd0f895.js","assets/SubmitButton-51e46fc3.js"] : void 0));
const NotFoundPage = reactExports.lazy(() => __vitePreload(() => import("./NotFoundPage-5715a439.js"), true ? ["assets/NotFoundPage-5715a439.js","assets/EmptyState-cbe24938.js"] : void 0));
const publicRoutes = [
  { path: "/login", element: /* @__PURE__ */ jsxRuntimeExports.jsx(LoginPage, {}) },
  { path: "/register", element: /* @__PURE__ */ jsxRuntimeExports.jsx(RegisterPage, {}) }
];
const privateRoutes = [
  { path: "/", element: /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardPage, {}) },
  { path: "/events", element: /* @__PURE__ */ jsxRuntimeExports.jsx(EventsPage, {}) },
  { path: "/events/new", element: /* @__PURE__ */ jsxRuntimeExports.jsx(CreateEventPage, {}) },
  { path: "/events/:eventId", element: /* @__PURE__ */ jsxRuntimeExports.jsx(EventDetailPage, {}) },
  { path: "/checkin", element: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckInPage, {}) },
  { path: "/groups", element: /* @__PURE__ */ jsxRuntimeExports.jsx(GroupsPage, {}) },
  { path: "/groups/:groupId", element: /* @__PURE__ */ jsxRuntimeExports.jsx(GroupDetailPage, {}) },
  { path: "/notifications", element: /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationsPage, {}) },
  { path: "/profile", element: /* @__PURE__ */ jsxRuntimeExports.jsx(ProfilePage, {}) },
  { path: "/settings", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsPage, {}) },
  { path: "/surveys", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SurveyPage, {}) },
  { path: "/friends", element: /* @__PURE__ */ jsxRuntimeExports.jsx(FriendsPage, {}) },
  { path: "/chat", element: /* @__PURE__ */ jsxRuntimeExports.jsx(PrivateChatPage, {}) },
  { path: "/chat/:userId", element: /* @__PURE__ */ jsxRuntimeExports.jsx(PrivateChatPage, {}) },
  { path: "/admin/users", element: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminUsersPage, {}) }
];
const fallbackRoute = { path: "*", element: /* @__PURE__ */ jsxRuntimeExports.jsx(NotFoundPage, {}) };
const PREFIX = "univibe";
const isBrowser = typeof window !== "undefined";
const storage = {
  get(key) {
    if (!isBrowser)
      return null;
    return window.localStorage.getItem(`${PREFIX}:${key}`);
  },
  set(key, value) {
    if (!isBrowser)
      return;
    window.localStorage.setItem(`${PREFIX}:${key}`, value);
  },
  remove(key) {
    if (!isBrowser)
      return;
    window.localStorage.removeItem(`${PREFIX}:${key}`);
  }
};
const tokenStorageKey = "token";
const themeStorageKey = "theme";
function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}
const { toString: toString$1 } = Object.prototype;
const { getPrototypeOf } = Object;
const { iterator, toStringTag } = Symbol;
const kindOf = ((cache) => (thing) => {
  const str = toString$1.call(thing);
  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null));
const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type;
};
const typeOfTest = (type) => (thing) => typeof thing === type;
const { isArray: isArray$1 } = Array;
const isUndefined = typeOfTest("undefined");
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction$2(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}
const isArrayBuffer = kindOfTest("ArrayBuffer");
function isArrayBufferView(val) {
  let result;
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }
  return result;
}
const isString$1 = typeOfTest("string");
const isFunction$2 = typeOfTest("function");
const isNumber = typeOfTest("number");
const isObject = (thing) => thing !== null && typeof thing === "object";
const isBoolean = (thing) => thing === true || thing === false;
const isPlainObject = (val) => {
  if (kindOf(val) !== "object") {
    return false;
  }
  const prototype2 = getPrototypeOf(val);
  return (prototype2 === null || prototype2 === Object.prototype || Object.getPrototypeOf(prototype2) === null) && !(toStringTag in val) && !(iterator in val);
};
const isEmptyObject = (val) => {
  if (!isObject(val) || isBuffer(val)) {
    return false;
  }
  try {
    return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
  } catch (e2) {
    return false;
  }
};
const isDate = kindOfTest("Date");
const isFile = kindOfTest("File");
const isBlob = kindOfTest("Blob");
const isFileList = kindOfTest("FileList");
const isStream = (val) => isObject(val) && isFunction$2(val.pipe);
const isFormData = (thing) => {
  let kind;
  return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction$2(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
  kind === "object" && isFunction$2(thing.toString) && thing.toString() === "[object FormData]"));
};
const isURLSearchParams = kindOfTest("URLSearchParams");
const [isReadableStream, isRequest, isResponse, isHeaders] = ["ReadableStream", "Request", "Response", "Headers"].map(kindOfTest);
const trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function forEach(obj, fn, { allOwnKeys = false } = {}) {
  if (obj === null || typeof obj === "undefined") {
    return;
  }
  let i2;
  let l2;
  if (typeof obj !== "object") {
    obj = [obj];
  }
  if (isArray$1(obj)) {
    for (i2 = 0, l2 = obj.length; i2 < l2; i2++) {
      fn.call(null, obj[i2], i2, obj);
    }
  } else {
    if (isBuffer(obj)) {
      return;
    }
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;
    for (i2 = 0; i2 < len; i2++) {
      key = keys[i2];
      fn.call(null, obj[key], key, obj);
    }
  }
}
function findKey(obj, key) {
  if (isBuffer(obj)) {
    return null;
  }
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i2 = keys.length;
  let _key;
  while (i2-- > 0) {
    _key = keys[i2];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}
const _global = (() => {
  if (typeof globalThis !== "undefined")
    return globalThis;
  return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : globalThis;
})();
const isContextDefined = (context) => !isUndefined(context) && context !== _global;
function merge() {
  const { caseless, skipUndefined } = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray$1(val)) {
      result[targetKey] = val.slice();
    } else if (!skipUndefined || !isUndefined(val)) {
      result[targetKey] = val;
    }
  };
  for (let i2 = 0, l2 = arguments.length; i2 < l2; i2++) {
    arguments[i2] && forEach(arguments[i2], assignValue);
  }
  return result;
}
const extend = (a2, b2, thisArg, { allOwnKeys } = {}) => {
  forEach(b2, (val, key) => {
    if (thisArg && isFunction$2(val)) {
      a2[key] = bind(val, thisArg);
    } else {
      a2[key] = val;
    }
  }, { allOwnKeys });
  return a2;
};
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 65279) {
    content = content.slice(1);
  }
  return content;
};
const inherits$v = (constructor, superConstructor, props, descriptors2) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, "super", {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};
const toFlatObject = (sourceObj, destObj, filter2, propFilter) => {
  let props;
  let i2;
  let prop;
  const merged = {};
  destObj = destObj || {};
  if (sourceObj == null)
    return destObj;
  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i2 = props.length;
    while (i2-- > 0) {
      prop = props[i2];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter2 !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter2 || filter2(sourceObj, destObj)) && sourceObj !== Object.prototype);
  return destObj;
};
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === void 0 || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};
const toArray = (thing) => {
  if (!thing)
    return null;
  if (isArray$1(thing))
    return thing;
  let i2 = thing.length;
  if (!isNumber(i2))
    return null;
  const arr = new Array(i2);
  while (i2-- > 0) {
    arr[i2] = thing[i2];
  }
  return arr;
};
const isTypedArray = ((TypedArray) => {
  return (thing) => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[iterator];
  const _iterator = generator.call(obj);
  let result;
  while ((result = _iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];
  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }
  return arr;
};
const isHTMLForm = kindOfTest("HTMLFormElement");
const toCamelCase = (str) => {
  return str.toLowerCase().replace(
    /[-_\s]([a-z\d])(\w*)/g,
    function replacer(m2, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};
const hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
const isRegExp = kindOfTest("RegExp");
const reduceDescriptors = (obj, reducer) => {
  const descriptors2 = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};
  forEach(descriptors2, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });
  Object.defineProperties(obj, reducedDescriptors);
};
const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    if (isFunction$2(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
      return false;
    }
    const value = obj[name];
    if (!isFunction$2(value))
      return;
    descriptor.enumerable = false;
    if ("writable" in descriptor) {
      descriptor.writable = false;
      return;
    }
    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error("Can not rewrite read-only method '" + name + "'");
      };
    }
  });
};
const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};
  const define = (arr) => {
    arr.forEach((value) => {
      obj[value] = true;
    });
  };
  isArray$1(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
  return obj;
};
const noop = () => {
};
const toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
};
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction$2(thing.append) && thing[toStringTag] === "FormData" && thing[iterator]);
}
const toJSONObject = (obj) => {
  const stack = new Array(10);
  const visit = (source, i2) => {
    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }
      if (isBuffer(source)) {
        return source;
      }
      if (!("toJSON" in source)) {
        stack[i2] = source;
        const target = isArray$1(source) ? [] : {};
        forEach(source, (value, key) => {
          const reducedValue = visit(value, i2 + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });
        stack[i2] = void 0;
        return target;
      }
    }
    return source;
  };
  return visit(obj, 0);
};
const isAsyncFn = kindOfTest("AsyncFunction");
const isThenable = (thing) => thing && (isObject(thing) || isFunction$2(thing)) && isFunction$2(thing.then) && isFunction$2(thing.catch);
const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
  if (setImmediateSupported) {
    return setImmediate;
  }
  return postMessageSupported ? ((token, callbacks) => {
    _global.addEventListener("message", ({ source, data }) => {
      if (source === _global && data === token) {
        callbacks.length && callbacks.shift()();
      }
    }, false);
    return (cb2) => {
      callbacks.push(cb2);
      _global.postMessage(token, "*");
    };
  })(`axios@${Math.random()}`, []) : (cb2) => setTimeout(cb2);
})(
  typeof setImmediate === "function",
  isFunction$2(_global.postMessage)
);
const asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
const isIterable = (thing) => thing != null && isFunction$2(thing[iterator]);
const utils$5 = {
  isArray: isArray$1,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString: isString$1,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isEmptyObject,
  isReadableStream,
  isRequest,
  isResponse,
  isHeaders,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction: isFunction$2,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits: inherits$v,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  globalThis: _global,
  isContextDefined,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable,
  setImmediate: _setImmediate,
  asap,
  isIterable
};
function AxiosError(message, code, config, request, response) {
  Error.call(this);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack;
  }
  this.message = message;
  this.name = "AxiosError";
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  if (response) {
    this.response = response;
    this.status = response.status ? response.status : null;
  }
}
utils$5.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils$5.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});
const prototype$1 = AxiosError.prototype;
const descriptors = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach((code) => {
  descriptors[code] = { value: code };
});
Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype$1, "isAxiosError", { value: true });
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype$1);
  utils$5.toFlatObject(error, axiosError, function filter2(obj) {
    return obj !== Error.prototype;
  }, (prop) => {
    return prop !== "isAxiosError";
  });
  const msg = error && error.message ? error.message : "Error";
  const errCode = code == null && error ? error.code : code;
  AxiosError.call(axiosError, msg, errCode, config, request, response);
  if (error && axiosError.cause == null) {
    Object.defineProperty(axiosError, "cause", { value: error, configurable: true });
  }
  axiosError.name = error && error.name || "Error";
  customProps && Object.assign(axiosError, customProps);
  return axiosError;
};
const httpAdapter = null;
function isVisitable(thing) {
  return utils$5.isPlainObject(thing) || utils$5.isArray(thing);
}
function removeBrackets(key) {
  return utils$5.endsWith(key, "[]") ? key.slice(0, -2) : key;
}
function renderKey(path, key, dots) {
  if (!path)
    return key;
  return path.concat(key).map(function each(token, i2) {
    token = removeBrackets(token);
    return !dots && i2 ? "[" + token + "]" : token;
  }).join(dots ? "." : "");
}
function isFlatArray(arr) {
  return utils$5.isArray(arr) && !arr.some(isVisitable);
}
const predicates = utils$5.toFlatObject(utils$5, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});
function toFormData(obj, formData, options) {
  if (!utils$5.isObject(obj)) {
    throw new TypeError("target must be an object");
  }
  formData = formData || new FormData();
  options = utils$5.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    return !utils$5.isUndefined(source[option]);
  });
  const metaTokens = options.metaTokens;
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
  const useBlob = _Blob && utils$5.isSpecCompliantForm(formData);
  if (!utils$5.isFunction(visitor)) {
    throw new TypeError("visitor must be a function");
  }
  function convertValue(value) {
    if (value === null)
      return "";
    if (utils$5.isDate(value)) {
      return value.toISOString();
    }
    if (utils$5.isBoolean(value)) {
      return value.toString();
    }
    if (!useBlob && utils$5.isBlob(value)) {
      throw new AxiosError("Blob is not supported. Use a Buffer instead.");
    }
    if (utils$5.isArrayBuffer(value) || utils$5.isTypedArray(value)) {
      return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
    }
    return value;
  }
  function defaultVisitor(value, key, path) {
    let arr = value;
    if (value && !path && typeof value === "object") {
      if (utils$5.endsWith(key, "{}")) {
        key = metaTokens ? key : key.slice(0, -2);
        value = JSON.stringify(value);
      } else if (utils$5.isArray(value) && isFlatArray(value) || (utils$5.isFileList(value) || utils$5.endsWith(key, "[]")) && (arr = utils$5.toArray(value))) {
        key = removeBrackets(key);
        arr.forEach(function each(el2, index2) {
          !(utils$5.isUndefined(el2) || el2 === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index2, dots) : indexes === null ? key : key + "[]",
            convertValue(el2)
          );
        });
        return false;
      }
    }
    if (isVisitable(value)) {
      return true;
    }
    formData.append(renderKey(path, key, dots), convertValue(value));
    return false;
  }
  const stack = [];
  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });
  function build(value, path) {
    if (utils$5.isUndefined(value))
      return;
    if (stack.indexOf(value) !== -1) {
      throw Error("Circular reference detected in " + path.join("."));
    }
    stack.push(value);
    utils$5.forEach(value, function each(el2, key) {
      const result = !(utils$5.isUndefined(el2) || el2 === null) && visitor.call(
        formData,
        el2,
        utils$5.isString(key) ? key.trim() : key,
        path,
        exposedHelpers
      );
      if (result === true) {
        build(el2, path ? path.concat(key) : [key]);
      }
    });
    stack.pop();
  }
  if (!utils$5.isObject(obj)) {
    throw new TypeError("data must be an object");
  }
  build(obj);
  return formData;
}
function encode$2(str) {
  const charMap = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}
function AxiosURLSearchParams(params, options) {
  this._pairs = [];
  params && toFormData(params, this, options);
}
const prototype = AxiosURLSearchParams.prototype;
prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};
prototype.toString = function toString(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode$2);
  } : encode$2;
  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + "=" + _encode(pair[1]);
  }, "").join("&");
};
function encode$1(val) {
  return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
}
function buildURL(url2, params, options) {
  if (!params) {
    return url2;
  }
  const _encode = options && options.encode || encode$1;
  if (utils$5.isFunction(options)) {
    options = {
      serialize: options
    };
  }
  const serializeFn = options && options.serialize;
  let serializedParams;
  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils$5.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, options).toString(_encode);
  }
  if (serializedParams) {
    const hashmarkIndex = url2.indexOf("#");
    if (hashmarkIndex !== -1) {
      url2 = url2.slice(0, hashmarkIndex);
    }
    url2 += (url2.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url2;
}
class InterceptorManager {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {void}
   */
  eject(id2) {
    if (this.handlers[id2]) {
      this.handlers[id2] = null;
    }
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils$5.forEach(this.handlers, function forEachHandler(h2) {
      if (h2 !== null) {
        fn(h2);
      }
    });
  }
}
const InterceptorManager$1 = InterceptorManager;
const transitionalDefaults = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};
const URLSearchParams$1 = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams;
const FormData$1 = typeof FormData !== "undefined" ? FormData : null;
const Blob$1 = typeof Blob !== "undefined" ? Blob : null;
const platform$1 = {
  isBrowser: true,
  classes: {
    URLSearchParams: URLSearchParams$1,
    FormData: FormData$1,
    Blob: Blob$1
  },
  protocols: ["http", "https", "file", "blob", "url", "data"]
};
const hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
const _navigator = typeof navigator === "object" && navigator || void 0;
const hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || ["ReactNative", "NativeScript", "NS"].indexOf(_navigator.product) < 0);
const hasStandardBrowserWebWorkerEnv = (() => {
  return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
  self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
})();
const origin = hasBrowserEnv && window.location.href || "http://localhost";
const utils$4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasBrowserEnv,
  hasStandardBrowserEnv,
  hasStandardBrowserWebWorkerEnv,
  navigator: _navigator,
  origin
}, Symbol.toStringTag, { value: "Module" }));
const platform = {
  ...utils$4,
  ...platform$1
};
function toURLEncodedForm(data, options) {
  return toFormData(data, new platform.classes.URLSearchParams(), {
    visitor: function(value, key, path, helpers) {
      if (platform.isNode && utils$5.isBuffer(value)) {
        this.append(key, value.toString("base64"));
        return false;
      }
      return helpers.defaultVisitor.apply(this, arguments);
    },
    ...options
  });
}
function parsePropPath(name) {
  return utils$5.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
    return match[0] === "[]" ? "" : match[1] || match[0];
  });
}
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i2;
  const len = keys.length;
  let key;
  for (i2 = 0; i2 < len; i2++) {
    key = keys[i2];
    obj[key] = arr[key];
  }
  return obj;
}
function formDataToJSON(formData) {
  function buildPath(path, value, target, index2) {
    let name = path[index2++];
    if (name === "__proto__")
      return true;
    const isNumericKey = Number.isFinite(+name);
    const isLast = index2 >= path.length;
    name = !name && utils$5.isArray(target) ? target.length : name;
    if (isLast) {
      if (utils$5.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }
      return !isNumericKey;
    }
    if (!target[name] || !utils$5.isObject(target[name])) {
      target[name] = [];
    }
    const result = buildPath(path, value, target[name], index2);
    if (result && utils$5.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }
    return !isNumericKey;
  }
  if (utils$5.isFormData(formData) && utils$5.isFunction(formData.entries)) {
    const obj = {};
    utils$5.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });
    return obj;
  }
  return null;
}
function stringifySafely(rawValue, parser, encoder) {
  if (utils$5.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils$5.trim(rawValue);
    } catch (e2) {
      if (e2.name !== "SyntaxError") {
        throw e2;
      }
    }
  }
  return (encoder || JSON.stringify)(rawValue);
}
const defaults = {
  transitional: transitionalDefaults,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || "";
    const hasJSONContentType = contentType.indexOf("application/json") > -1;
    const isObjectPayload = utils$5.isObject(data);
    if (isObjectPayload && utils$5.isHTMLForm(data)) {
      data = new FormData(data);
    }
    const isFormData2 = utils$5.isFormData(data);
    if (isFormData2) {
      return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
    }
    if (utils$5.isArrayBuffer(data) || utils$5.isBuffer(data) || utils$5.isStream(data) || utils$5.isFile(data) || utils$5.isBlob(data) || utils$5.isReadableStream(data)) {
      return data;
    }
    if (utils$5.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils$5.isURLSearchParams(data)) {
      headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
      return data.toString();
    }
    let isFileList2;
    if (isObjectPayload) {
      if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }
      if ((isFileList2 = utils$5.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
        const _FormData = this.env && this.env.FormData;
        return toFormData(
          isFileList2 ? { "files[]": data } : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }
    if (isObjectPayload || hasJSONContentType) {
      headers.setContentType("application/json", false);
      return stringifySafely(data);
    }
    return data;
  }],
  transformResponse: [function transformResponse(data) {
    const transitional2 = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
    const JSONRequested = this.responseType === "json";
    if (utils$5.isResponse(data) || utils$5.isReadableStream(data)) {
      return data;
    }
    if (data && utils$5.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
      const silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;
      try {
        return JSON.parse(data, this.parseReviver);
      } catch (e2) {
        if (strictJSONParsing) {
          if (e2.name === "SyntaxError") {
            throw AxiosError.from(e2, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e2;
        }
      }
    }
    return data;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: platform.classes.FormData,
    Blob: platform.classes.Blob
  },
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
  headers: {
    common: {
      "Accept": "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
utils$5.forEach(["delete", "get", "head", "post", "put", "patch"], (method) => {
  defaults.headers[method] = {};
});
const defaults$1 = defaults;
const ignoreDuplicateOf = utils$5.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]);
const parseHeaders = (rawHeaders) => {
  const parsed = {};
  let key;
  let val;
  let i2;
  rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
    i2 = line.indexOf(":");
    key = line.substring(0, i2).trim().toLowerCase();
    val = line.substring(i2 + 1).trim();
    if (!key || parsed[key] && ignoreDuplicateOf[key]) {
      return;
    }
    if (key === "set-cookie") {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
    }
  });
  return parsed;
};
const $internals = Symbol("internals");
function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}
function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }
  return utils$5.isArray(value) ? value.map(normalizeValue) : String(value);
}
function parseTokens(str) {
  const tokens = /* @__PURE__ */ Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;
  while (match = tokensRE.exec(str)) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}
const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
function matchHeaderValue(context, value, header, filter2, isHeaderNameFilter) {
  if (utils$5.isFunction(filter2)) {
    return filter2.call(this, value, header);
  }
  if (isHeaderNameFilter) {
    value = header;
  }
  if (!utils$5.isString(value))
    return;
  if (utils$5.isString(filter2)) {
    return value.indexOf(filter2) !== -1;
  }
  if (utils$5.isRegExp(filter2)) {
    return filter2.test(value);
  }
}
function formatHeader(header) {
  return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w2, char, str) => {
    return char.toUpperCase() + str;
  });
}
function buildAccessors(obj, header) {
  const accessorName = utils$5.toCamelCase(" " + header);
  ["get", "set", "has"].forEach((methodName) => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}
class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }
  set(header, valueOrRewrite, rewrite) {
    const self2 = this;
    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);
      if (!lHeader) {
        throw new Error("header name must be a non-empty string");
      }
      const key = utils$5.findKey(self2, lHeader);
      if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
        self2[key || _header] = normalizeValue(_value);
      }
    }
    const setHeaders = (headers, _rewrite) => utils$5.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
    if (utils$5.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if (utils$5.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else if (utils$5.isObject(header) && utils$5.isIterable(header)) {
      let obj = {}, dest, key;
      for (const entry2 of header) {
        if (!utils$5.isArray(entry2)) {
          throw TypeError("Object iterator must return a key-value pair");
        }
        obj[key = entry2[0]] = (dest = obj[key]) ? utils$5.isArray(dest) ? [...dest, entry2[1]] : [dest, entry2[1]] : entry2[1];
      }
      setHeaders(obj, valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }
    return this;
  }
  get(header, parser) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils$5.findKey(this, header);
      if (key) {
        const value = this[key];
        if (!parser) {
          return value;
        }
        if (parser === true) {
          return parseTokens(value);
        }
        if (utils$5.isFunction(parser)) {
          return parser.call(this, value, key);
        }
        if (utils$5.isRegExp(parser)) {
          return parser.exec(value);
        }
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(header, matcher) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils$5.findKey(this, header);
      return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }
    return false;
  }
  delete(header, matcher) {
    const self2 = this;
    let deleted = false;
    function deleteHeader(_header) {
      _header = normalizeHeader(_header);
      if (_header) {
        const key = utils$5.findKey(self2, _header);
        if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
          delete self2[key];
          deleted = true;
        }
      }
    }
    if (utils$5.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }
    return deleted;
  }
  clear(matcher) {
    const keys = Object.keys(this);
    let i2 = keys.length;
    let deleted = false;
    while (i2--) {
      const key = keys[i2];
      if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }
    return deleted;
  }
  normalize(format) {
    const self2 = this;
    const headers = {};
    utils$5.forEach(this, (value, header) => {
      const key = utils$5.findKey(headers, header);
      if (key) {
        self2[key] = normalizeValue(value);
        delete self2[header];
        return;
      }
      const normalized = format ? formatHeader(header) : String(header).trim();
      if (normalized !== header) {
        delete self2[header];
      }
      self2[normalized] = normalizeValue(value);
      headers[normalized] = true;
    });
    return this;
  }
  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }
  toJSON(asStrings) {
    const obj = /* @__PURE__ */ Object.create(null);
    utils$5.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils$5.isArray(value) ? value.join(", ") : value);
    });
    return obj;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
  }
  getSetCookie() {
    return this.get("set-cookie") || [];
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }
  static concat(first, ...targets) {
    const computed = new this(first);
    targets.forEach((target) => computed.set(target));
    return computed;
  }
  static accessor(header) {
    const internals = this[$internals] = this[$internals] = {
      accessors: {}
    };
    const accessors = internals.accessors;
    const prototype2 = this.prototype;
    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);
      if (!accessors[lHeader]) {
        buildAccessors(prototype2, _header);
        accessors[lHeader] = true;
      }
    }
    utils$5.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
    return this;
  }
}
AxiosHeaders.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
utils$5.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1);
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  };
});
utils$5.freezeMethods(AxiosHeaders);
const AxiosHeaders$1 = AxiosHeaders;
function transformData(fns, response) {
  const config = this || defaults$1;
  const context = response || config;
  const headers = AxiosHeaders$1.from(context.headers);
  let data = context.data;
  utils$5.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
  });
  headers.normalize();
  return data;
}
function isCancel(value) {
  return !!(value && value.__CANCEL__);
}
function CanceledError(message, config, request) {
  AxiosError.call(this, message == null ? "canceled" : message, AxiosError.ERR_CANCELED, config, request);
  this.name = "CanceledError";
}
utils$5.inherits(CanceledError, AxiosError, {
  __CANCEL__: true
});
function settle(resolve2, reject, response) {
  const validateStatus2 = response.config.validateStatus;
  if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
    resolve2(response);
  } else {
    reject(new AxiosError(
      "Request failed with status code " + response.status,
      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}
function parseProtocol(url2) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url2);
  return match && match[1] || "";
}
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;
  min = min !== void 0 ? min : 1e3;
  return function push(chunkLength) {
    const now = Date.now();
    const startedAt = timestamps[tail];
    if (!firstSampleTS) {
      firstSampleTS = now;
    }
    bytes[head] = chunkLength;
    timestamps[head] = now;
    let i2 = tail;
    let bytesCount = 0;
    while (i2 !== head) {
      bytesCount += bytes[i2++];
      i2 = i2 % samplesCount;
    }
    head = (head + 1) % samplesCount;
    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }
    if (now - firstSampleTS < min) {
      return;
    }
    const passed = startedAt && now - startedAt;
    return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
  };
}
function throttle(fn, freq) {
  let timestamp = 0;
  let threshold = 1e3 / freq;
  let lastArgs;
  let timer;
  const invoke = (args, now = Date.now()) => {
    timestamp = now;
    lastArgs = null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    fn(...args);
  };
  const throttled = (...args) => {
    const now = Date.now();
    const passed = now - timestamp;
    if (passed >= threshold) {
      invoke(args, now);
    } else {
      lastArgs = args;
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          invoke(lastArgs);
        }, threshold - passed);
      }
    }
  };
  const flush = () => lastArgs && invoke(lastArgs);
  return [throttled, flush];
}
const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = speedometer(50, 250);
  return throttle((e2) => {
    const loaded = e2.loaded;
    const total = e2.lengthComputable ? e2.total : void 0;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;
    bytesNotified = loaded;
    const data = {
      loaded,
      total,
      progress: total ? loaded / total : void 0,
      bytes: progressBytes,
      rate: rate ? rate : void 0,
      estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
      event: e2,
      lengthComputable: total != null,
      [isDownloadStream ? "download" : "upload"]: true
    };
    listener(data);
  }, freq);
};
const progressEventDecorator = (total, throttled) => {
  const lengthComputable = total != null;
  return [(loaded) => throttled[0]({
    lengthComputable,
    total,
    loaded
  }), throttled[1]];
};
const asyncDecorator = (fn) => (...args) => utils$5.asap(() => fn(...args));
const isURLSameOrigin = platform.hasStandardBrowserEnv ? ((origin2, isMSIE) => (url2) => {
  url2 = new URL(url2, platform.origin);
  return origin2.protocol === url2.protocol && origin2.host === url2.host && (isMSIE || origin2.port === url2.port);
})(
  new URL(platform.origin),
  platform.navigator && /(msie|trident)/i.test(platform.navigator.userAgent)
) : () => true;
const cookies = platform.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(name, value, expires, path, domain, secure, sameSite) {
      if (typeof document === "undefined")
        return;
      const cookie = [`${name}=${encodeURIComponent(value)}`];
      if (utils$5.isNumber(expires)) {
        cookie.push(`expires=${new Date(expires).toUTCString()}`);
      }
      if (utils$5.isString(path)) {
        cookie.push(`path=${path}`);
      }
      if (utils$5.isString(domain)) {
        cookie.push(`domain=${domain}`);
      }
      if (secure === true) {
        cookie.push("secure");
      }
      if (utils$5.isString(sameSite)) {
        cookie.push(`SameSite=${sameSite}`);
      }
      document.cookie = cookie.join("; ");
    },
    read(name) {
      if (typeof document === "undefined")
        return null;
      const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
      return match ? decodeURIComponent(match[1]) : null;
    },
    remove(name) {
      this.write(name, "", Date.now() - 864e5, "/");
    }
  }
) : (
  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {
    },
    read() {
      return null;
    },
    remove() {
    }
  }
);
function isAbsoluteURL(url2) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url2);
}
function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
}
function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
  let isRelativeUrl = !isAbsoluteURL(requestedURL);
  if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}
const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? { ...thing } : thing;
function mergeConfig(config1, config2) {
  config2 = config2 || {};
  const config = {};
  function getMergedValue(target, source, prop, caseless) {
    if (utils$5.isPlainObject(target) && utils$5.isPlainObject(source)) {
      return utils$5.merge.call({ caseless }, target, source);
    } else if (utils$5.isPlainObject(source)) {
      return utils$5.merge({}, source);
    } else if (utils$5.isArray(source)) {
      return source.slice();
    }
    return source;
  }
  function mergeDeepProperties(a2, b2, prop, caseless) {
    if (!utils$5.isUndefined(b2)) {
      return getMergedValue(a2, b2, prop, caseless);
    } else if (!utils$5.isUndefined(a2)) {
      return getMergedValue(void 0, a2, prop, caseless);
    }
  }
  function valueFromConfig2(a2, b2) {
    if (!utils$5.isUndefined(b2)) {
      return getMergedValue(void 0, b2);
    }
  }
  function defaultToConfig2(a2, b2) {
    if (!utils$5.isUndefined(b2)) {
      return getMergedValue(void 0, b2);
    } else if (!utils$5.isUndefined(a2)) {
      return getMergedValue(void 0, a2);
    }
  }
  function mergeDirectKeys(a2, b2, prop) {
    if (prop in config2) {
      return getMergedValue(a2, b2);
    } else if (prop in config1) {
      return getMergedValue(void 0, a2);
    }
  }
  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a2, b2, prop) => mergeDeepProperties(headersToObject(a2), headersToObject(b2), prop, true)
  };
  utils$5.forEach(Object.keys({ ...config1, ...config2 }), function computeConfigValue(prop) {
    const merge2 = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge2(config1[prop], config2[prop], prop);
    utils$5.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
  });
  return config;
}
const resolveConfig = (config) => {
  const newConfig = mergeConfig({}, config);
  let { data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;
  newConfig.headers = headers = AxiosHeaders$1.from(headers);
  newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);
  if (auth) {
    headers.set(
      "Authorization",
      "Basic " + btoa((auth.username || "") + ":" + (auth.password ? unescape(encodeURIComponent(auth.password)) : ""))
    );
  }
  if (utils$5.isFormData(data)) {
    if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
      headers.setContentType(void 0);
    } else if (utils$5.isFunction(data.getHeaders)) {
      const formHeaders = data.getHeaders();
      const allowedHeaders = ["content-type", "content-length"];
      Object.entries(formHeaders).forEach(([key, val]) => {
        if (allowedHeaders.includes(key.toLowerCase())) {
          headers.set(key, val);
        }
      });
    }
  }
  if (platform.hasStandardBrowserEnv) {
    withXSRFToken && utils$5.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
    if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin(newConfig.url)) {
      const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);
      if (xsrfValue) {
        headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }
  return newConfig;
};
const isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
const xhrAdapter = isXHRAdapterSupported && function(config) {
  return new Promise(function dispatchXhrRequest(resolve2, reject) {
    const _config = resolveConfig(config);
    let requestData = _config.data;
    const requestHeaders = AxiosHeaders$1.from(_config.headers).normalize();
    let { responseType, onUploadProgress, onDownloadProgress } = _config;
    let onCanceled;
    let uploadThrottled, downloadThrottled;
    let flushUpload, flushDownload;
    function done() {
      flushUpload && flushUpload();
      flushDownload && flushDownload();
      _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
      _config.signal && _config.signal.removeEventListener("abort", onCanceled);
    }
    let request = new XMLHttpRequest();
    request.open(_config.method.toUpperCase(), _config.url, true);
    request.timeout = _config.timeout;
    function onloadend() {
      if (!request) {
        return;
      }
      const responseHeaders = AxiosHeaders$1.from(
        "getAllResponseHeaders" in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };
      settle(function _resolve(value) {
        resolve2(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);
      request = null;
    }
    if ("onloadend" in request) {
      request.onloadend = onloadend;
    } else {
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
          return;
        }
        setTimeout(onloadend);
      };
    }
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }
      reject(new AxiosError("Request aborted", AxiosError.ECONNABORTED, config, request));
      request = null;
    };
    request.onerror = function handleError(event2) {
      const msg = event2 && event2.message ? event2.message : "Network Error";
      const err = new AxiosError(msg, AxiosError.ERR_NETWORK, config, request);
      err.event = event2 || null;
      reject(err);
      request = null;
    };
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
      const transitional2 = _config.transitional || transitionalDefaults;
      if (_config.timeoutErrorMessage) {
        timeoutErrorMessage = _config.timeoutErrorMessage;
      }
      reject(new AxiosError(
        timeoutErrorMessage,
        transitional2.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
        config,
        request
      ));
      request = null;
    };
    requestData === void 0 && requestHeaders.setContentType(null);
    if ("setRequestHeader" in request) {
      utils$5.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }
    if (!utils$5.isUndefined(_config.withCredentials)) {
      request.withCredentials = !!_config.withCredentials;
    }
    if (responseType && responseType !== "json") {
      request.responseType = _config.responseType;
    }
    if (onDownloadProgress) {
      [downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
      request.addEventListener("progress", downloadThrottled);
    }
    if (onUploadProgress && request.upload) {
      [uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
      request.upload.addEventListener("progress", uploadThrottled);
      request.upload.addEventListener("loadend", flushUpload);
    }
    if (_config.cancelToken || _config.signal) {
      onCanceled = (cancel) => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
        request.abort();
        request = null;
      };
      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
      if (_config.signal) {
        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
      }
    }
    const protocol = parseProtocol(_config.url);
    if (protocol && platform.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError("Unsupported protocol " + protocol + ":", AxiosError.ERR_BAD_REQUEST, config));
      return;
    }
    request.send(requestData || null);
  });
};
const composeSignals = (signals, timeout) => {
  const { length } = signals = signals ? signals.filter(Boolean) : [];
  if (timeout || length) {
    let controller = new AbortController();
    let aborted;
    const onabort = function(reason) {
      if (!aborted) {
        aborted = true;
        unsubscribe();
        const err = reason instanceof Error ? reason : this.reason;
        controller.abort(err instanceof AxiosError ? err : new CanceledError(err instanceof Error ? err.message : err));
      }
    };
    let timer = timeout && setTimeout(() => {
      timer = null;
      onabort(new AxiosError(`timeout ${timeout} of ms exceeded`, AxiosError.ETIMEDOUT));
    }, timeout);
    const unsubscribe = () => {
      if (signals) {
        timer && clearTimeout(timer);
        timer = null;
        signals.forEach((signal2) => {
          signal2.unsubscribe ? signal2.unsubscribe(onabort) : signal2.removeEventListener("abort", onabort);
        });
        signals = null;
      }
    };
    signals.forEach((signal2) => signal2.addEventListener("abort", onabort));
    const { signal } = controller;
    signal.unsubscribe = () => utils$5.asap(unsubscribe);
    return signal;
  }
};
const composeSignals$1 = composeSignals;
const streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;
  if (!chunkSize || len < chunkSize) {
    yield chunk;
    return;
  }
  let pos = 0;
  let end;
  while (pos < len) {
    end = pos + chunkSize;
    yield chunk.slice(pos, end);
    pos = end;
  }
};
const readBytes = async function* (iterable, chunkSize) {
  for await (const chunk of readStream(iterable)) {
    yield* streamChunk(chunk, chunkSize);
  }
};
const readStream = async function* (stream) {
  if (stream[Symbol.asyncIterator]) {
    yield* stream;
    return;
  }
  const reader = stream.getReader();
  try {
    for (; ; ) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      yield value;
    }
  } finally {
    await reader.cancel();
  }
};
const trackStream = (stream, chunkSize, onProgress, onFinish) => {
  const iterator2 = readBytes(stream, chunkSize);
  let bytes = 0;
  let done;
  let _onFinish = (e2) => {
    if (!done) {
      done = true;
      onFinish && onFinish(e2);
    }
  };
  return new ReadableStream({
    async pull(controller) {
      try {
        const { done: done2, value } = await iterator2.next();
        if (done2) {
          _onFinish();
          controller.close();
          return;
        }
        let len = value.byteLength;
        if (onProgress) {
          let loadedBytes = bytes += len;
          onProgress(loadedBytes);
        }
        controller.enqueue(new Uint8Array(value));
      } catch (err) {
        _onFinish(err);
        throw err;
      }
    },
    cancel(reason) {
      _onFinish(reason);
      return iterator2.return();
    }
  }, {
    highWaterMark: 2
  });
};
const DEFAULT_CHUNK_SIZE = 64 * 1024;
const { isFunction: isFunction$1 } = utils$5;
const globalFetchAPI = (({ Request, Response }) => ({
  Request,
  Response
}))(utils$5.global);
const {
  ReadableStream: ReadableStream$1,
  TextEncoder: TextEncoder$1
} = utils$5.global;
const test = (fn, ...args) => {
  try {
    return !!fn(...args);
  } catch (e2) {
    return false;
  }
};
const factory = (env) => {
  env = utils$5.merge.call({
    skipUndefined: true
  }, globalFetchAPI, env);
  const { fetch: envFetch, Request, Response } = env;
  const isFetchSupported = envFetch ? isFunction$1(envFetch) : typeof fetch === "function";
  const isRequestSupported = isFunction$1(Request);
  const isResponseSupported = isFunction$1(Response);
  if (!isFetchSupported) {
    return false;
  }
  const isReadableStreamSupported = isFetchSupported && isFunction$1(ReadableStream$1);
  const encodeText = isFetchSupported && (typeof TextEncoder$1 === "function" ? ((encoder) => (str) => encoder.encode(str))(new TextEncoder$1()) : async (str) => new Uint8Array(await new Request(str).arrayBuffer()));
  const supportsRequestStream = isRequestSupported && isReadableStreamSupported && test(() => {
    let duplexAccessed = false;
    const hasContentType = new Request(platform.origin, {
      body: new ReadableStream$1(),
      method: "POST",
      get duplex() {
        duplexAccessed = true;
        return "half";
      }
    }).headers.has("Content-Type");
    return duplexAccessed && !hasContentType;
  });
  const supportsResponseStream = isResponseSupported && isReadableStreamSupported && test(() => utils$5.isReadableStream(new Response("").body));
  const resolvers = {
    stream: supportsResponseStream && ((res) => res.body)
  };
  isFetchSupported && (() => {
    ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type) => {
      !resolvers[type] && (resolvers[type] = (res, config) => {
        let method = res && res[type];
        if (method) {
          return method.call(res);
        }
        throw new AxiosError(`Response type '${type}' is not supported`, AxiosError.ERR_NOT_SUPPORT, config);
      });
    });
  })();
  const getBodyLength = async (body) => {
    if (body == null) {
      return 0;
    }
    if (utils$5.isBlob(body)) {
      return body.size;
    }
    if (utils$5.isSpecCompliantForm(body)) {
      const _request = new Request(platform.origin, {
        method: "POST",
        body
      });
      return (await _request.arrayBuffer()).byteLength;
    }
    if (utils$5.isArrayBufferView(body) || utils$5.isArrayBuffer(body)) {
      return body.byteLength;
    }
    if (utils$5.isURLSearchParams(body)) {
      body = body + "";
    }
    if (utils$5.isString(body)) {
      return (await encodeText(body)).byteLength;
    }
  };
  const resolveBodyLength = async (headers, body) => {
    const length = utils$5.toFiniteNumber(headers.getContentLength());
    return length == null ? getBodyLength(body) : length;
  };
  return async (config) => {
    let {
      url: url2,
      method,
      data,
      signal,
      cancelToken,
      timeout,
      onDownloadProgress,
      onUploadProgress,
      responseType,
      headers,
      withCredentials = "same-origin",
      fetchOptions
    } = resolveConfig(config);
    let _fetch = envFetch || fetch;
    responseType = responseType ? (responseType + "").toLowerCase() : "text";
    let composedSignal = composeSignals$1([signal, cancelToken && cancelToken.toAbortSignal()], timeout);
    let request = null;
    const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
      composedSignal.unsubscribe();
    });
    let requestContentLength;
    try {
      if (onUploadProgress && supportsRequestStream && method !== "get" && method !== "head" && (requestContentLength = await resolveBodyLength(headers, data)) !== 0) {
        let _request = new Request(url2, {
          method: "POST",
          body: data,
          duplex: "half"
        });
        let contentTypeHeader;
        if (utils$5.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type"))) {
          headers.setContentType(contentTypeHeader);
        }
        if (_request.body) {
          const [onProgress, flush] = progressEventDecorator(
            requestContentLength,
            progressEventReducer(asyncDecorator(onUploadProgress))
          );
          data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
        }
      }
      if (!utils$5.isString(withCredentials)) {
        withCredentials = withCredentials ? "include" : "omit";
      }
      const isCredentialsSupported = isRequestSupported && "credentials" in Request.prototype;
      const resolvedOptions = {
        ...fetchOptions,
        signal: composedSignal,
        method: method.toUpperCase(),
        headers: headers.normalize().toJSON(),
        body: data,
        duplex: "half",
        credentials: isCredentialsSupported ? withCredentials : void 0
      };
      request = isRequestSupported && new Request(url2, resolvedOptions);
      let response = await (isRequestSupported ? _fetch(request, fetchOptions) : _fetch(url2, resolvedOptions));
      const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
      if (supportsResponseStream && (onDownloadProgress || isStreamResponse && unsubscribe)) {
        const options = {};
        ["status", "statusText", "headers"].forEach((prop) => {
          options[prop] = response[prop];
        });
        const responseContentLength = utils$5.toFiniteNumber(response.headers.get("content-length"));
        const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
          responseContentLength,
          progressEventReducer(asyncDecorator(onDownloadProgress), true)
        ) || [];
        response = new Response(
          trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
            flush && flush();
            unsubscribe && unsubscribe();
          }),
          options
        );
      }
      responseType = responseType || "text";
      let responseData = await resolvers[utils$5.findKey(resolvers, responseType) || "text"](response, config);
      !isStreamResponse && unsubscribe && unsubscribe();
      return await new Promise((resolve2, reject) => {
        settle(resolve2, reject, {
          data: responseData,
          headers: AxiosHeaders$1.from(response.headers),
          status: response.status,
          statusText: response.statusText,
          config,
          request
        });
      });
    } catch (err) {
      unsubscribe && unsubscribe();
      if (err && err.name === "TypeError" && /Load failed|fetch/i.test(err.message)) {
        throw Object.assign(
          new AxiosError("Network Error", AxiosError.ERR_NETWORK, config, request),
          {
            cause: err.cause || err
          }
        );
      }
      throw AxiosError.from(err, err && err.code, config, request);
    }
  };
};
const seedCache = /* @__PURE__ */ new Map();
const getFetch = (config) => {
  let env = config && config.env || {};
  const { fetch: fetch2, Request, Response } = env;
  const seeds = [
    Request,
    Response,
    fetch2
  ];
  let len = seeds.length, i2 = len, seed, target, map = seedCache;
  while (i2--) {
    seed = seeds[i2];
    target = map.get(seed);
    target === void 0 && map.set(seed, target = i2 ? /* @__PURE__ */ new Map() : factory(env));
    map = target;
  }
  return target;
};
getFetch();
const knownAdapters = {
  http: httpAdapter,
  xhr: xhrAdapter,
  fetch: {
    get: getFetch
  }
};
utils$5.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, "name", { value });
    } catch (e2) {
    }
    Object.defineProperty(fn, "adapterName", { value });
  }
});
const renderReason = (reason) => `- ${reason}`;
const isResolvedHandle = (adapter) => utils$5.isFunction(adapter) || adapter === null || adapter === false;
function getAdapter(adapters2, config) {
  adapters2 = utils$5.isArray(adapters2) ? adapters2 : [adapters2];
  const { length } = adapters2;
  let nameOrAdapter;
  let adapter;
  const rejectedReasons = {};
  for (let i2 = 0; i2 < length; i2++) {
    nameOrAdapter = adapters2[i2];
    let id2;
    adapter = nameOrAdapter;
    if (!isResolvedHandle(nameOrAdapter)) {
      adapter = knownAdapters[(id2 = String(nameOrAdapter)).toLowerCase()];
      if (adapter === void 0) {
        throw new AxiosError(`Unknown adapter '${id2}'`);
      }
    }
    if (adapter && (utils$5.isFunction(adapter) || (adapter = adapter.get(config)))) {
      break;
    }
    rejectedReasons[id2 || "#" + i2] = adapter;
  }
  if (!adapter) {
    const reasons = Object.entries(rejectedReasons).map(
      ([id2, state]) => `adapter ${id2} ` + (state === false ? "is not supported by the environment" : "is not available in the build")
    );
    let s2 = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
    throw new AxiosError(
      `There is no suitable adapter to dispatch the request ` + s2,
      "ERR_NOT_SUPPORT"
    );
  }
  return adapter;
}
const adapters = {
  /**
   * Resolve an adapter from a list of adapter names or functions.
   * @type {Function}
   */
  getAdapter,
  /**
   * Exposes all known adapters
   * @type {Object<string, Function|Object>}
   */
  adapters: knownAdapters
};
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
  if (config.signal && config.signal.aborted) {
    throw new CanceledError(null, config);
  }
}
function dispatchRequest(config) {
  throwIfCancellationRequested(config);
  config.headers = AxiosHeaders$1.from(config.headers);
  config.data = transformData.call(
    config,
    config.transformRequest
  );
  if (["post", "put", "patch"].indexOf(config.method) !== -1) {
    config.headers.setContentType("application/x-www-form-urlencoded", false);
  }
  const adapter = adapters.getAdapter(config.adapter || defaults$1.adapter, config);
  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );
    response.headers = AxiosHeaders$1.from(response.headers);
    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
      }
    }
    return Promise.reject(reason);
  });
}
const VERSION = "1.13.2";
const validators$1 = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i2) => {
  validators$1[type] = function validator2(thing) {
    return typeof thing === type || "a" + (i2 < 1 ? "n " : " ") + type;
  };
});
const deprecatedWarnings = {};
validators$1.transitional = function transitional(validator2, version2, message) {
  function formatMessage(opt, desc) {
    return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
  }
  return (value, opt, opts) => {
    if (validator2 === false) {
      throw new AxiosError(
        formatMessage(opt, " has been removed" + (version2 ? " in " + version2 : "")),
        AxiosError.ERR_DEPRECATED
      );
    }
    if (version2 && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      console.warn(
        formatMessage(
          opt,
          " has been deprecated since v" + version2 + " and will be removed in the near future"
        )
      );
    }
    return validator2 ? validator2(value, opt, opts) : true;
  };
};
validators$1.spelling = function spelling(correctSpelling) {
  return (value, opt) => {
    console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
    return true;
  };
};
function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== "object") {
    throw new AxiosError("options must be an object", AxiosError.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i2 = keys.length;
  while (i2-- > 0) {
    const opt = keys[i2];
    const validator2 = schema[opt];
    if (validator2) {
      const value = options[opt];
      const result = value === void 0 || validator2(value, opt, options);
      if (result !== true) {
        throw new AxiosError("option " + opt + " must be " + result, AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError("Unknown option " + opt, AxiosError.ERR_BAD_OPTION);
    }
  }
}
const validator = {
  assertOptions,
  validators: validators$1
};
const validators = validator.validators;
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig || {};
    this.interceptors = {
      request: new InterceptorManager$1(),
      response: new InterceptorManager$1()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      if (err instanceof Error) {
        let dummy = {};
        Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = new Error();
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
        try {
          if (!err.stack) {
            err.stack = stack;
          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ""))) {
            err.stack += "\n" + stack;
          }
        } catch (e2) {
        }
      }
      throw err;
    }
  }
  _request(configOrUrl, config) {
    if (typeof configOrUrl === "string") {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }
    config = mergeConfig(this.defaults, config);
    const { transitional: transitional2, paramsSerializer, headers } = config;
    if (transitional2 !== void 0) {
      validator.assertOptions(transitional2, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }
    if (paramsSerializer != null) {
      if (utils$5.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        validator.assertOptions(paramsSerializer, {
          encode: validators.function,
          serialize: validators.function
        }, true);
      }
    }
    if (config.allowAbsoluteUrls !== void 0)
      ;
    else if (this.defaults.allowAbsoluteUrls !== void 0) {
      config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
    } else {
      config.allowAbsoluteUrls = true;
    }
    validator.assertOptions(config, {
      baseUrl: validators.spelling("baseURL"),
      withXsrfToken: validators.spelling("withXSRFToken")
    }, true);
    config.method = (config.method || this.defaults.method || "get").toLowerCase();
    let contextHeaders = headers && utils$5.merge(
      headers.common,
      headers[config.method]
    );
    headers && utils$5.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (method) => {
        delete headers[method];
      }
    );
    config.headers = AxiosHeaders$1.concat(contextHeaders, headers);
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
        return;
      }
      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });
    let promise;
    let i2 = 0;
    let len;
    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), void 0];
      chain.unshift(...requestInterceptorChain);
      chain.push(...responseInterceptorChain);
      len = chain.length;
      promise = Promise.resolve(config);
      while (i2 < len) {
        promise = promise.then(chain[i2++], chain[i2++]);
      }
      return promise;
    }
    len = requestInterceptorChain.length;
    let newConfig = config;
    while (i2 < len) {
      const onFulfilled = requestInterceptorChain[i2++];
      const onRejected = requestInterceptorChain[i2++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }
    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }
    i2 = 0;
    len = responseInterceptorChain.length;
    while (i2 < len) {
      promise = promise.then(responseInterceptorChain[i2++], responseInterceptorChain[i2++]);
    }
    return promise;
  }
  getUri(config) {
    config = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
}
utils$5.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
  Axios.prototype[method] = function(url2, config) {
    return this.request(mergeConfig(config || {}, {
      method,
      url: url2,
      data: (config || {}).data
    }));
  };
});
utils$5.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
  function generateHTTPMethod(isForm) {
    return function httpMethod(url2, data, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        headers: isForm ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: url2,
        data
      }));
    };
  }
  Axios.prototype[method] = generateHTTPMethod();
  Axios.prototype[method + "Form"] = generateHTTPMethod(true);
});
const Axios$1 = Axios;
class CancelToken {
  constructor(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("executor must be a function.");
    }
    let resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve2) {
      resolvePromise = resolve2;
    });
    const token = this;
    this.promise.then((cancel) => {
      if (!token._listeners)
        return;
      let i2 = token._listeners.length;
      while (i2-- > 0) {
        token._listeners[i2](cancel);
      }
      token._listeners = null;
    });
    this.promise.then = (onfulfilled) => {
      let _resolve;
      const promise = new Promise((resolve2) => {
        token.subscribe(resolve2);
        _resolve = resolve2;
      }).then(onfulfilled);
      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };
      return promise;
    };
    executor(function cancel(message, config, request) {
      if (token.reason) {
        return;
      }
      token.reason = new CanceledError(message, config, request);
      resolvePromise(token.reason);
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }
    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index2 = this._listeners.indexOf(listener);
    if (index2 !== -1) {
      this._listeners.splice(index2, 1);
    }
  }
  toAbortSignal() {
    const controller = new AbortController();
    const abort = (err) => {
      controller.abort(err);
    };
    this.subscribe(abort);
    controller.signal.unsubscribe = () => this.unsubscribe(abort);
    return controller.signal;
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c2) {
      cancel = c2;
    });
    return {
      token,
      cancel
    };
  }
}
const CancelToken$1 = CancelToken;
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}
function isAxiosError(payload) {
  return utils$5.isObject(payload) && payload.isAxiosError === true;
}
const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
  WebServerIsDown: 521,
  ConnectionTimedOut: 522,
  OriginIsUnreachable: 523,
  TimeoutOccurred: 524,
  SslHandshakeFailed: 525,
  InvalidSslCertificate: 526
};
Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});
const HttpStatusCode$1 = HttpStatusCode;
function createInstance(defaultConfig) {
  const context = new Axios$1(defaultConfig);
  const instance = bind(Axios$1.prototype.request, context);
  utils$5.extend(instance, Axios$1.prototype, context, { allOwnKeys: true });
  utils$5.extend(instance, context, null, { allOwnKeys: true });
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };
  return instance;
}
const axios = createInstance(defaults$1);
axios.Axios = Axios$1;
axios.CanceledError = CanceledError;
axios.CancelToken = CancelToken$1;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData;
axios.AxiosError = AxiosError;
axios.Cancel = axios.CanceledError;
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = spread;
axios.isAxiosError = isAxiosError;
axios.mergeConfig = mergeConfig;
axios.AxiosHeaders = AxiosHeaders$1;
axios.formToJSON = (thing) => formDataToJSON(utils$5.isHTMLForm(thing) ? new FormData(thing) : thing);
axios.getAdapter = adapters.getAdapter;
axios.HttpStatusCode = HttpStatusCode$1;
axios.default = axios;
const axios$1 = axios;
const API_TIMEOUT = 15e3;
const PAGINATION_SIZES = [10, 25, 50, 100];
const getApiBaseUrl = () => {
  const envUrl = {}.VITE_API_BASE_URL;
  if (envUrl && envUrl !== "") {
    return envUrl;
  }
  return "http://localhost:8080";
};
const apiClient = axios$1.create({
  baseURL: getApiBaseUrl(),
  timeout: API_TIMEOUT
});
apiClient.interceptors.request.use((config) => {
  const token = storage.get(tokenStorageKey);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...config.headers
  };
  return config;
});
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    var _a, _b, _c;
    const status = (_a = error.response) == null ? void 0 : _a.status;
    const data = (_b = error.response) == null ? void 0 : _b.data;
    if (status === 401) {
      storage.remove(tokenStorageKey);
      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.href = "/login";
      }
    }
    let message = "Ocurrió un error inesperado";
    if (data == null ? void 0 : data.message) {
      message = data.message;
    } else if (error.code === "ECONNABORTED" || ((_c = error.message) == null ? void 0 : _c.includes("timeout"))) {
      message = "La solicitud tardó demasiado. Por favor, verifica tu conexión e intenta nuevamente.";
    } else if (error.message === "Network Error" || !error.response) {
      message = "No se pudo conectar con el servidor. Verifica tu conexión a internet.";
    } else if (status === 400) {
      message = "Los datos proporcionados no son válidos. Por favor, revisa la información.";
    } else if (status === 403) {
      message = "No tienes permisos para realizar esta acción.";
    } else if (status === 404) {
      message = "El recurso solicitado no fue encontrado.";
    } else if (status === 409) {
      message = "Ya existe un recurso con estos datos.";
    } else if (status === 500) {
      message = "Error interno del servidor. Por favor, intenta más tarde.";
    } else if (status) {
      message = `Error ${status}: ${error.message || "Error desconocido"}`;
    }
    return Promise.reject({ ...error, message, status });
  }
);
const login = (email, password, signal) => apiClient.post("/api/auth/login", { email, password }, { signal }).then((res) => res.data);
const register = (payload, signal) => apiClient.post("/api/auth/register", payload, { signal }).then((res) => res.data);
const fetchProfile = (signal) => apiClient.get("/api/users/me", { signal }).then((res) => res.data);
const updateProfile = (payload, signal) => apiClient.put("/api/users/me", payload, { signal }).then((res) => res.data);
let nanoid = (size = 21) => crypto.getRandomValues(new Uint8Array(size)).reduce((id2, byte) => {
  byte &= 63;
  if (byte < 36) {
    id2 += byte.toString(36);
  } else if (byte < 62) {
    id2 += (byte - 26).toString(36).toUpperCase();
  } else if (byte > 62) {
    id2 += "-";
  } else {
    id2 += "_";
  }
  return id2;
}, "");
const ToastContext = reactExports.createContext(void 0);
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = reactExports.useState([]);
  const pushToast = reactExports.useCallback((toast) => {
    const id2 = nanoid();
    const payload = { duration: 5e3, ...toast, id: id2 };
    setToasts((prev) => [...prev, payload]);
    if (payload.duration) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== id2));
      }, payload.duration);
    }
  }, []);
  const dismissToast = reactExports.useCallback((id2) => {
    setToasts((prev) => prev.filter((item) => item.id !== id2));
  }, []);
  const value = reactExports.useMemo(
    () => ({
      toasts,
      pushToast,
      dismissToast
    }),
    [toasts, pushToast, dismissToast]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ToastContext.Provider, { value, children });
};
const useToast = () => {
  const ctx = reactExports.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
};
var event$1 = { exports: {} };
var browserCrypto = {};
if (globalThis.crypto && globalThis.crypto.getRandomValues) {
  browserCrypto.randomBytes = function(length) {
    var bytes = new Uint8Array(length);
    globalThis.crypto.getRandomValues(bytes);
    return bytes;
  };
} else {
  browserCrypto.randomBytes = function(length) {
    var bytes = new Array(length);
    for (var i2 = 0; i2 < length; i2++) {
      bytes[i2] = Math.floor(Math.random() * 256);
    }
    return bytes;
  };
}
var crypto$1 = browserCrypto;
var _randomStringChars = "abcdefghijklmnopqrstuvwxyz012345";
var random$5 = {
  string: function(length) {
    var max = _randomStringChars.length;
    var bytes = crypto$1.randomBytes(length);
    var ret = [];
    for (var i2 = 0; i2 < length; i2++) {
      ret.push(_randomStringChars.substr(bytes[i2] % max, 1));
    }
    return ret.join("");
  },
  number: function(max) {
    return Math.floor(Math.random() * max);
  },
  numberString: function(max) {
    var t2 = ("" + (max - 1)).length;
    var p2 = new Array(t2 + 1).join("0");
    return (p2 + this.number(max)).slice(-t2);
  }
};
(function(module) {
  var random2 = random$5;
  var onUnload = {}, afterUnload = false, isChromePackagedApp = globalThis.chrome && globalThis.chrome.app && globalThis.chrome.app.runtime;
  module.exports = {
    attachEvent: function(event2, listener) {
      if (typeof globalThis.addEventListener !== "undefined") {
        globalThis.addEventListener(event2, listener, false);
      } else if (globalThis.document && globalThis.attachEvent) {
        globalThis.document.attachEvent("on" + event2, listener);
        globalThis.attachEvent("on" + event2, listener);
      }
    },
    detachEvent: function(event2, listener) {
      if (typeof globalThis.addEventListener !== "undefined") {
        globalThis.removeEventListener(event2, listener, false);
      } else if (globalThis.document && globalThis.detachEvent) {
        globalThis.document.detachEvent("on" + event2, listener);
        globalThis.detachEvent("on" + event2, listener);
      }
    },
    unloadAdd: function(listener) {
      if (isChromePackagedApp) {
        return null;
      }
      var ref = random2.string(8);
      onUnload[ref] = listener;
      if (afterUnload) {
        setTimeout(this.triggerUnloadCallbacks, 0);
      }
      return ref;
    },
    unloadDel: function(ref) {
      if (ref in onUnload) {
        delete onUnload[ref];
      }
    },
    triggerUnloadCallbacks: function() {
      for (var ref in onUnload) {
        onUnload[ref]();
        delete onUnload[ref];
      }
    }
  };
  var unloadTriggered = function() {
    if (afterUnload) {
      return;
    }
    afterUnload = true;
    module.exports.triggerUnloadCallbacks();
  };
  if (!isChromePackagedApp) {
    module.exports.attachEvent("unload", unloadTriggered);
  }
})(event$1);
var eventExports = event$1.exports;
var requiresPort = function required(port2, protocol) {
  protocol = protocol.split(":")[0];
  port2 = +port2;
  if (!port2)
    return false;
  switch (protocol) {
    case "http":
    case "ws":
      return port2 !== 80;
    case "https":
    case "wss":
      return port2 !== 443;
    case "ftp":
      return port2 !== 21;
    case "gopher":
      return port2 !== 70;
    case "file":
      return false;
  }
  return port2 !== 0;
};
var querystringify$1 = {};
var has = Object.prototype.hasOwnProperty, undef;
function decode(input) {
  try {
    return decodeURIComponent(input.replace(/\+/g, " "));
  } catch (e2) {
    return null;
  }
}
function encode(input) {
  try {
    return encodeURIComponent(input);
  } catch (e2) {
    return null;
  }
}
function querystring(query) {
  var parser = /([^=?#&]+)=?([^&]*)/g, result = {}, part;
  while (part = parser.exec(query)) {
    var key = decode(part[1]), value = decode(part[2]);
    if (key === null || value === null || key in result)
      continue;
    result[key] = value;
  }
  return result;
}
function querystringify(obj, prefix) {
  prefix = prefix || "";
  var pairs = [], value, key;
  if ("string" !== typeof prefix)
    prefix = "?";
  for (key in obj) {
    if (has.call(obj, key)) {
      value = obj[key];
      if (!value && (value === null || value === undef || isNaN(value))) {
        value = "";
      }
      key = encode(key);
      value = encode(value);
      if (key === null || value === null)
        continue;
      pairs.push(key + "=" + value);
    }
  }
  return pairs.length ? prefix + pairs.join("&") : "";
}
querystringify$1.stringify = querystringify;
querystringify$1.parse = querystring;
var required2 = requiresPort, qs = querystringify$1, controlOrWhitespace = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/, CRHTLF = /[\n\r\t]/g, slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//, port = /:\d+$/, protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\\/]+)?([\S\s]*)/i, windowsDriveLetter = /^[a-zA-Z]:/;
function trimLeft(str) {
  return (str ? str : "").toString().replace(controlOrWhitespace, "");
}
var rules = [
  ["#", "hash"],
  // Extract from the back.
  ["?", "query"],
  // Extract from the back.
  function sanitize(address, url2) {
    return isSpecial(url2.protocol) ? address.replace(/\\/g, "/") : address;
  },
  ["/", "pathname"],
  // Extract from the back.
  ["@", "auth", 1],
  // Extract from the front.
  [NaN, "host", void 0, 1, 1],
  // Set left over value.
  [/:(\d*)$/, "port", void 0, 1],
  // RegExp the back.
  [NaN, "hostname", void 0, 1, 1]
  // Set left over.
];
var ignore = { hash: 1, query: 1 };
function lolcation(loc2) {
  var globalVar;
  if (typeof window !== "undefined")
    globalVar = window;
  else if (typeof globalThis !== "undefined")
    globalVar = globalThis;
  else if (typeof self !== "undefined")
    globalVar = self;
  else
    globalVar = {};
  var location2 = globalVar.location || {};
  loc2 = loc2 || location2;
  var finaldestination = {}, type = typeof loc2, key;
  if ("blob:" === loc2.protocol) {
    finaldestination = new Url(unescape(loc2.pathname), {});
  } else if ("string" === type) {
    finaldestination = new Url(loc2, {});
    for (key in ignore)
      delete finaldestination[key];
  } else if ("object" === type) {
    for (key in loc2) {
      if (key in ignore)
        continue;
      finaldestination[key] = loc2[key];
    }
    if (finaldestination.slashes === void 0) {
      finaldestination.slashes = slashes.test(loc2.href);
    }
  }
  return finaldestination;
}
function isSpecial(scheme) {
  return scheme === "file:" || scheme === "ftp:" || scheme === "http:" || scheme === "https:" || scheme === "ws:" || scheme === "wss:";
}
function extractProtocol(address, location2) {
  address = trimLeft(address);
  address = address.replace(CRHTLF, "");
  location2 = location2 || {};
  var match = protocolre.exec(address);
  var protocol = match[1] ? match[1].toLowerCase() : "";
  var forwardSlashes = !!match[2];
  var otherSlashes = !!match[3];
  var slashesCount = 0;
  var rest;
  if (forwardSlashes) {
    if (otherSlashes) {
      rest = match[2] + match[3] + match[4];
      slashesCount = match[2].length + match[3].length;
    } else {
      rest = match[2] + match[4];
      slashesCount = match[2].length;
    }
  } else {
    if (otherSlashes) {
      rest = match[3] + match[4];
      slashesCount = match[3].length;
    } else {
      rest = match[4];
    }
  }
  if (protocol === "file:") {
    if (slashesCount >= 2) {
      rest = rest.slice(2);
    }
  } else if (isSpecial(protocol)) {
    rest = match[4];
  } else if (protocol) {
    if (forwardSlashes) {
      rest = rest.slice(2);
    }
  } else if (slashesCount >= 2 && isSpecial(location2.protocol)) {
    rest = match[4];
  }
  return {
    protocol,
    slashes: forwardSlashes || isSpecial(protocol),
    slashesCount,
    rest
  };
}
function resolve(relative, base) {
  if (relative === "")
    return base;
  var path = (base || "/").split("/").slice(0, -1).concat(relative.split("/")), i2 = path.length, last = path[i2 - 1], unshift = false, up = 0;
  while (i2--) {
    if (path[i2] === ".") {
      path.splice(i2, 1);
    } else if (path[i2] === "..") {
      path.splice(i2, 1);
      up++;
    } else if (up) {
      if (i2 === 0)
        unshift = true;
      path.splice(i2, 1);
      up--;
    }
  }
  if (unshift)
    path.unshift("");
  if (last === "." || last === "..")
    path.push("");
  return path.join("/");
}
function Url(address, location2, parser) {
  address = trimLeft(address);
  address = address.replace(CRHTLF, "");
  if (!(this instanceof Url)) {
    return new Url(address, location2, parser);
  }
  var relative, extracted, parse, instruction, index2, key, instructions = rules.slice(), type = typeof location2, url2 = this, i2 = 0;
  if ("object" !== type && "string" !== type) {
    parser = location2;
    location2 = null;
  }
  if (parser && "function" !== typeof parser)
    parser = qs.parse;
  location2 = lolcation(location2);
  extracted = extractProtocol(address || "", location2);
  relative = !extracted.protocol && !extracted.slashes;
  url2.slashes = extracted.slashes || relative && location2.slashes;
  url2.protocol = extracted.protocol || location2.protocol || "";
  address = extracted.rest;
  if (extracted.protocol === "file:" && (extracted.slashesCount !== 2 || windowsDriveLetter.test(address)) || !extracted.slashes && (extracted.protocol || extracted.slashesCount < 2 || !isSpecial(url2.protocol))) {
    instructions[3] = [/(.*)/, "pathname"];
  }
  for (; i2 < instructions.length; i2++) {
    instruction = instructions[i2];
    if (typeof instruction === "function") {
      address = instruction(address, url2);
      continue;
    }
    parse = instruction[0];
    key = instruction[1];
    if (parse !== parse) {
      url2[key] = address;
    } else if ("string" === typeof parse) {
      index2 = parse === "@" ? address.lastIndexOf(parse) : address.indexOf(parse);
      if (~index2) {
        if ("number" === typeof instruction[2]) {
          url2[key] = address.slice(0, index2);
          address = address.slice(index2 + instruction[2]);
        } else {
          url2[key] = address.slice(index2);
          address = address.slice(0, index2);
        }
      }
    } else if (index2 = parse.exec(address)) {
      url2[key] = index2[1];
      address = address.slice(0, index2.index);
    }
    url2[key] = url2[key] || (relative && instruction[3] ? location2[key] || "" : "");
    if (instruction[4])
      url2[key] = url2[key].toLowerCase();
  }
  if (parser)
    url2.query = parser(url2.query);
  if (relative && location2.slashes && url2.pathname.charAt(0) !== "/" && (url2.pathname !== "" || location2.pathname !== "")) {
    url2.pathname = resolve(url2.pathname, location2.pathname);
  }
  if (url2.pathname.charAt(0) !== "/" && isSpecial(url2.protocol)) {
    url2.pathname = "/" + url2.pathname;
  }
  if (!required2(url2.port, url2.protocol)) {
    url2.host = url2.hostname;
    url2.port = "";
  }
  url2.username = url2.password = "";
  if (url2.auth) {
    index2 = url2.auth.indexOf(":");
    if (~index2) {
      url2.username = url2.auth.slice(0, index2);
      url2.username = encodeURIComponent(decodeURIComponent(url2.username));
      url2.password = url2.auth.slice(index2 + 1);
      url2.password = encodeURIComponent(decodeURIComponent(url2.password));
    } else {
      url2.username = encodeURIComponent(decodeURIComponent(url2.auth));
    }
    url2.auth = url2.password ? url2.username + ":" + url2.password : url2.username;
  }
  url2.origin = url2.protocol !== "file:" && isSpecial(url2.protocol) && url2.host ? url2.protocol + "//" + url2.host : "null";
  url2.href = url2.toString();
}
function set(part, value, fn) {
  var url2 = this;
  switch (part) {
    case "query":
      if ("string" === typeof value && value.length) {
        value = (fn || qs.parse)(value);
      }
      url2[part] = value;
      break;
    case "port":
      url2[part] = value;
      if (!required2(value, url2.protocol)) {
        url2.host = url2.hostname;
        url2[part] = "";
      } else if (value) {
        url2.host = url2.hostname + ":" + value;
      }
      break;
    case "hostname":
      url2[part] = value;
      if (url2.port)
        value += ":" + url2.port;
      url2.host = value;
      break;
    case "host":
      url2[part] = value;
      if (port.test(value)) {
        value = value.split(":");
        url2.port = value.pop();
        url2.hostname = value.join(":");
      } else {
        url2.hostname = value;
        url2.port = "";
      }
      break;
    case "protocol":
      url2.protocol = value.toLowerCase();
      url2.slashes = !fn;
      break;
    case "pathname":
    case "hash":
      if (value) {
        var char = part === "pathname" ? "/" : "#";
        url2[part] = value.charAt(0) !== char ? char + value : value;
      } else {
        url2[part] = value;
      }
      break;
    case "username":
    case "password":
      url2[part] = encodeURIComponent(value);
      break;
    case "auth":
      var index2 = value.indexOf(":");
      if (~index2) {
        url2.username = value.slice(0, index2);
        url2.username = encodeURIComponent(decodeURIComponent(url2.username));
        url2.password = value.slice(index2 + 1);
        url2.password = encodeURIComponent(decodeURIComponent(url2.password));
      } else {
        url2.username = encodeURIComponent(decodeURIComponent(value));
      }
  }
  for (var i2 = 0; i2 < rules.length; i2++) {
    var ins = rules[i2];
    if (ins[4])
      url2[ins[1]] = url2[ins[1]].toLowerCase();
  }
  url2.auth = url2.password ? url2.username + ":" + url2.password : url2.username;
  url2.origin = url2.protocol !== "file:" && isSpecial(url2.protocol) && url2.host ? url2.protocol + "//" + url2.host : "null";
  url2.href = url2.toString();
  return url2;
}
function toString2(stringify) {
  if (!stringify || "function" !== typeof stringify)
    stringify = qs.stringify;
  var query, url2 = this, host = url2.host, protocol = url2.protocol;
  if (protocol && protocol.charAt(protocol.length - 1) !== ":")
    protocol += ":";
  var result = protocol + (url2.protocol && url2.slashes || isSpecial(url2.protocol) ? "//" : "");
  if (url2.username) {
    result += url2.username;
    if (url2.password)
      result += ":" + url2.password;
    result += "@";
  } else if (url2.password) {
    result += ":" + url2.password;
    result += "@";
  } else if (url2.protocol !== "file:" && isSpecial(url2.protocol) && !host && url2.pathname !== "/") {
    result += "@";
  }
  if (host[host.length - 1] === ":" || port.test(url2.hostname) && !url2.port) {
    host += ":";
  }
  result += host + url2.pathname;
  query = "object" === typeof url2.query ? stringify(url2.query) : url2.query;
  if (query)
    result += "?" !== query.charAt(0) ? "?" + query : query;
  if (url2.hash)
    result += url2.hash;
  return result;
}
Url.prototype = { set, toString: toString2 };
Url.extractProtocol = extractProtocol;
Url.location = lolcation;
Url.trimLeft = trimLeft;
Url.qs = qs;
var urlParse = Url;
var URL$2 = urlParse;
var url = {
  getOrigin: function(url2) {
    if (!url2) {
      return null;
    }
    var p2 = new URL$2(url2);
    if (p2.protocol === "file:") {
      return null;
    }
    var port2 = p2.port;
    if (!port2) {
      port2 = p2.protocol === "https:" ? "443" : "80";
    }
    return p2.protocol + "//" + p2.hostname + ":" + port2;
  },
  isOriginEqual: function(a2, b2) {
    var res = this.getOrigin(a2) === this.getOrigin(b2);
    return res;
  },
  isSchemeEqual: function(a2, b2) {
    return a2.split(":")[0] === b2.split(":")[0];
  },
  addPath: function(url2, path) {
    var qs2 = url2.split("?");
    return qs2[0] + path + (qs2[1] ? "?" + qs2[1] : "");
  },
  addQuery: function(url2, q2) {
    return url2 + (url2.indexOf("?") === -1 ? "?" + q2 : "&" + q2);
  },
  isLoopbackAddr: function(addr) {
    return /^127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) || /^\[::1\]$/.test(addr);
  }
};
var inherits_browser = { exports: {} };
if (typeof Object.create === "function") {
  inherits_browser.exports = function inherits2(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    }
  };
} else {
  inherits_browser.exports = function inherits2(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      var TempCtor = function() {
      };
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    }
  };
}
var inherits_browserExports = inherits_browser.exports;
var emitter = {};
function EventTarget$2() {
  this._listeners = {};
}
EventTarget$2.prototype.addEventListener = function(eventType, listener) {
  if (!(eventType in this._listeners)) {
    this._listeners[eventType] = [];
  }
  var arr = this._listeners[eventType];
  if (arr.indexOf(listener) === -1) {
    arr = arr.concat([listener]);
  }
  this._listeners[eventType] = arr;
};
EventTarget$2.prototype.removeEventListener = function(eventType, listener) {
  var arr = this._listeners[eventType];
  if (!arr) {
    return;
  }
  var idx = arr.indexOf(listener);
  if (idx !== -1) {
    if (arr.length > 1) {
      this._listeners[eventType] = arr.slice(0, idx).concat(arr.slice(idx + 1));
    } else {
      delete this._listeners[eventType];
    }
    return;
  }
};
EventTarget$2.prototype.dispatchEvent = function() {
  var event2 = arguments[0];
  var t2 = event2.type;
  var args = arguments.length === 1 ? [event2] : Array.apply(null, arguments);
  if (this["on" + t2]) {
    this["on" + t2].apply(this, args);
  }
  if (t2 in this._listeners) {
    var listeners = this._listeners[t2];
    for (var i2 = 0; i2 < listeners.length; i2++) {
      listeners[i2].apply(this, args);
    }
  }
};
var eventtarget = EventTarget$2;
var inherits$u = inherits_browserExports, EventTarget$1 = eventtarget;
function EventEmitter$f() {
  EventTarget$1.call(this);
}
inherits$u(EventEmitter$f, EventTarget$1);
EventEmitter$f.prototype.removeAllListeners = function(type) {
  if (type) {
    delete this._listeners[type];
  } else {
    this._listeners = {};
  }
};
EventEmitter$f.prototype.once = function(type, listener) {
  var self2 = this, fired = false;
  function g2() {
    self2.removeListener(type, g2);
    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }
  this.on(type, g2);
};
EventEmitter$f.prototype.emit = function() {
  var type = arguments[0];
  var listeners = this._listeners[type];
  if (!listeners) {
    return;
  }
  var l2 = arguments.length;
  var args = new Array(l2 - 1);
  for (var ai2 = 1; ai2 < l2; ai2++) {
    args[ai2 - 1] = arguments[ai2];
  }
  for (var i2 = 0; i2 < listeners.length; i2++) {
    listeners[i2].apply(this, args);
  }
};
EventEmitter$f.prototype.on = EventEmitter$f.prototype.addListener = EventTarget$1.prototype.addEventListener;
EventEmitter$f.prototype.removeListener = EventTarget$1.prototype.removeEventListener;
emitter.EventEmitter = EventEmitter$f;
var websocket$1 = { exports: {} };
var Driver = globalThis.WebSocket || globalThis.MozWebSocket;
if (Driver) {
  websocket$1.exports = function WebSocketBrowserDriver(url2) {
    return new Driver(url2);
  };
} else {
  websocket$1.exports = void 0;
}
var websocketExports = websocket$1.exports;
var utils$3 = eventExports, urlUtils$b = url, inherits$t = inherits_browserExports, EventEmitter$e = emitter.EventEmitter, WebsocketDriver = websocketExports;
var debug$c = function() {
};
function WebSocketTransport(transUrl, ignore2, options) {
  if (!WebSocketTransport.enabled()) {
    throw new Error("Transport created when disabled");
  }
  EventEmitter$e.call(this);
  var self2 = this;
  var url2 = urlUtils$b.addPath(transUrl, "/websocket");
  if (url2.slice(0, 5) === "https") {
    url2 = "wss" + url2.slice(5);
  } else {
    url2 = "ws" + url2.slice(4);
  }
  this.url = url2;
  this.ws = new WebsocketDriver(this.url, [], options);
  this.ws.onmessage = function(e2) {
    debug$c("message event", e2.data);
    self2.emit("message", e2.data);
  };
  this.unloadRef = utils$3.unloadAdd(function() {
    self2.ws.close();
  });
  this.ws.onclose = function(e2) {
    debug$c("close event", e2.code, e2.reason);
    self2.emit("close", e2.code, e2.reason);
    self2._cleanup();
  };
  this.ws.onerror = function(e2) {
    self2.emit("close", 1006, "WebSocket connection broken");
    self2._cleanup();
  };
}
inherits$t(WebSocketTransport, EventEmitter$e);
WebSocketTransport.prototype.send = function(data) {
  var msg = "[" + data + "]";
  this.ws.send(msg);
};
WebSocketTransport.prototype.close = function() {
  var ws = this.ws;
  this._cleanup();
  if (ws) {
    ws.close();
  }
};
WebSocketTransport.prototype._cleanup = function() {
  var ws = this.ws;
  if (ws) {
    ws.onmessage = ws.onclose = ws.onerror = null;
  }
  utils$3.unloadDel(this.unloadRef);
  this.unloadRef = this.ws = null;
  this.removeAllListeners();
};
WebSocketTransport.enabled = function() {
  return !!WebsocketDriver;
};
WebSocketTransport.transportName = "websocket";
WebSocketTransport.roundTrips = 2;
var websocket = WebSocketTransport;
var inherits$s = inherits_browserExports, EventEmitter$d = emitter.EventEmitter;
var debug$b = function() {
};
function BufferedSender$1(url2, sender) {
  EventEmitter$d.call(this);
  this.sendBuffer = [];
  this.sender = sender;
  this.url = url2;
}
inherits$s(BufferedSender$1, EventEmitter$d);
BufferedSender$1.prototype.send = function(message) {
  this.sendBuffer.push(message);
  if (!this.sendStop) {
    this.sendSchedule();
  }
};
BufferedSender$1.prototype.sendScheduleWait = function() {
  var self2 = this;
  var tref;
  this.sendStop = function() {
    self2.sendStop = null;
    clearTimeout(tref);
  };
  tref = setTimeout(function() {
    self2.sendStop = null;
    self2.sendSchedule();
  }, 25);
};
BufferedSender$1.prototype.sendSchedule = function() {
  debug$b("sendSchedule", this.sendBuffer.length);
  var self2 = this;
  if (this.sendBuffer.length > 0) {
    var payload = "[" + this.sendBuffer.join(",") + "]";
    this.sendStop = this.sender(this.url, payload, function(err) {
      self2.sendStop = null;
      if (err) {
        self2.emit("close", err.code || 1006, "Sending error: " + err);
        self2.close();
      } else {
        self2.sendScheduleWait();
      }
    });
    this.sendBuffer = [];
  }
};
BufferedSender$1.prototype._cleanup = function() {
  this.removeAllListeners();
};
BufferedSender$1.prototype.close = function() {
  this._cleanup();
  if (this.sendStop) {
    this.sendStop();
    this.sendStop = null;
  }
};
var bufferedSender = BufferedSender$1;
var inherits$r = inherits_browserExports, EventEmitter$c = emitter.EventEmitter;
var debug$a = function() {
};
function Polling$1(Receiver, receiveUrl, AjaxObject) {
  EventEmitter$c.call(this);
  this.Receiver = Receiver;
  this.receiveUrl = receiveUrl;
  this.AjaxObject = AjaxObject;
  this._scheduleReceiver();
}
inherits$r(Polling$1, EventEmitter$c);
Polling$1.prototype._scheduleReceiver = function() {
  var self2 = this;
  var poll = this.poll = new this.Receiver(this.receiveUrl, this.AjaxObject);
  poll.on("message", function(msg) {
    self2.emit("message", msg);
  });
  poll.once("close", function(code, reason) {
    debug$a("close", code, reason, self2.pollIsClosing);
    self2.poll = poll = null;
    if (!self2.pollIsClosing) {
      if (reason === "network") {
        self2._scheduleReceiver();
      } else {
        self2.emit("close", code || 1006, reason);
        self2.removeAllListeners();
      }
    }
  });
};
Polling$1.prototype.abort = function() {
  this.removeAllListeners();
  this.pollIsClosing = true;
  if (this.poll) {
    this.poll.abort();
  }
};
var polling = Polling$1;
var inherits$q = inherits_browserExports, urlUtils$a = url, BufferedSender = bufferedSender, Polling = polling;
function SenderReceiver$2(transUrl, urlSuffix, senderFunc, Receiver, AjaxObject) {
  var pollUrl = urlUtils$a.addPath(transUrl, urlSuffix);
  var self2 = this;
  BufferedSender.call(this, transUrl, senderFunc);
  this.poll = new Polling(Receiver, pollUrl, AjaxObject);
  this.poll.on("message", function(msg) {
    self2.emit("message", msg);
  });
  this.poll.once("close", function(code, reason) {
    self2.poll = null;
    self2.emit("close", code, reason);
    self2.close();
  });
}
inherits$q(SenderReceiver$2, BufferedSender);
SenderReceiver$2.prototype.close = function() {
  BufferedSender.prototype.close.call(this);
  this.removeAllListeners();
  if (this.poll) {
    this.poll.abort();
    this.poll = null;
  }
};
var senderReceiver = SenderReceiver$2;
var inherits$p = inherits_browserExports, urlUtils$9 = url, SenderReceiver$1 = senderReceiver;
function createAjaxSender(AjaxObject) {
  return function(url2, payload, callback) {
    var opt = {};
    if (typeof payload === "string") {
      opt.headers = { "Content-type": "text/plain" };
    }
    var ajaxUrl = urlUtils$9.addPath(url2, "/xhr_send");
    var xo = new AjaxObject("POST", ajaxUrl, payload, opt);
    xo.once("finish", function(status) {
      xo = null;
      if (status !== 200 && status !== 204) {
        return callback(new Error("http status " + status));
      }
      callback();
    });
    return function() {
      xo.close();
      xo = null;
      var err = new Error("Aborted");
      err.code = 1e3;
      callback(err);
    };
  };
}
function AjaxBasedTransport$6(transUrl, urlSuffix, Receiver, AjaxObject) {
  SenderReceiver$1.call(this, transUrl, urlSuffix, createAjaxSender(AjaxObject), Receiver, AjaxObject);
}
inherits$p(AjaxBasedTransport$6, SenderReceiver$1);
var ajaxBased = AjaxBasedTransport$6;
var inherits$o = inherits_browserExports, EventEmitter$b = emitter.EventEmitter;
function XhrReceiver$4(url2, AjaxObject) {
  EventEmitter$b.call(this);
  var self2 = this;
  this.bufferPosition = 0;
  this.xo = new AjaxObject("POST", url2, null);
  this.xo.on("chunk", this._chunkHandler.bind(this));
  this.xo.once("finish", function(status, text) {
    self2._chunkHandler(status, text);
    self2.xo = null;
    var reason = status === 200 ? "network" : "permanent";
    self2.emit("close", null, reason);
    self2._cleanup();
  });
}
inherits$o(XhrReceiver$4, EventEmitter$b);
XhrReceiver$4.prototype._chunkHandler = function(status, text) {
  if (status !== 200 || !text) {
    return;
  }
  for (var idx = -1; ; this.bufferPosition += idx + 1) {
    var buf = text.slice(this.bufferPosition);
    idx = buf.indexOf("\n");
    if (idx === -1) {
      break;
    }
    var msg = buf.slice(0, idx);
    if (msg) {
      this.emit("message", msg);
    }
  }
};
XhrReceiver$4.prototype._cleanup = function() {
  this.removeAllListeners();
};
XhrReceiver$4.prototype.abort = function() {
  if (this.xo) {
    this.xo.close();
    this.emit("close", null, "user");
    this.xo = null;
  }
  this._cleanup();
};
var xhr = XhrReceiver$4;
var EventEmitter$a = emitter.EventEmitter, inherits$n = inherits_browserExports, utils$2 = eventExports, urlUtils$8 = url, XHR = globalThis.XMLHttpRequest;
var debug$9 = function() {
};
function AbstractXHRObject(method, url2, payload, opts) {
  var self2 = this;
  EventEmitter$a.call(this);
  setTimeout(function() {
    self2._start(method, url2, payload, opts);
  }, 0);
}
inherits$n(AbstractXHRObject, EventEmitter$a);
AbstractXHRObject.prototype._start = function(method, url2, payload, opts) {
  var self2 = this;
  try {
    this.xhr = new XHR();
  } catch (x2) {
  }
  if (!this.xhr) {
    this.emit("finish", 0, "no xhr support");
    this._cleanup();
    return;
  }
  url2 = urlUtils$8.addQuery(url2, "t=" + +/* @__PURE__ */ new Date());
  this.unloadRef = utils$2.unloadAdd(function() {
    self2._cleanup(true);
  });
  try {
    this.xhr.open(method, url2, true);
    if (this.timeout && "timeout" in this.xhr) {
      this.xhr.timeout = this.timeout;
      this.xhr.ontimeout = function() {
        debug$9("xhr timeout");
        self2.emit("finish", 0, "");
        self2._cleanup(false);
      };
    }
  } catch (e2) {
    this.emit("finish", 0, "");
    this._cleanup(false);
    return;
  }
  if ((!opts || !opts.noCredentials) && AbstractXHRObject.supportsCORS) {
    this.xhr.withCredentials = true;
  }
  if (opts && opts.headers) {
    for (var key in opts.headers) {
      this.xhr.setRequestHeader(key, opts.headers[key]);
    }
  }
  this.xhr.onreadystatechange = function() {
    if (self2.xhr) {
      var x2 = self2.xhr;
      var text, status;
      debug$9("readyState", x2.readyState);
      switch (x2.readyState) {
        case 3:
          try {
            status = x2.status;
            text = x2.responseText;
          } catch (e2) {
          }
          if (status === 1223) {
            status = 204;
          }
          if (status === 200 && text && text.length > 0) {
            self2.emit("chunk", status, text);
          }
          break;
        case 4:
          status = x2.status;
          if (status === 1223) {
            status = 204;
          }
          if (status === 12005 || status === 12029) {
            status = 0;
          }
          debug$9("finish", status, x2.responseText);
          self2.emit("finish", status, x2.responseText);
          self2._cleanup(false);
          break;
      }
    }
  };
  try {
    self2.xhr.send(payload);
  } catch (e2) {
    self2.emit("finish", 0, "");
    self2._cleanup(false);
  }
};
AbstractXHRObject.prototype._cleanup = function(abort) {
  if (!this.xhr) {
    return;
  }
  this.removeAllListeners();
  utils$2.unloadDel(this.unloadRef);
  this.xhr.onreadystatechange = function() {
  };
  if (this.xhr.ontimeout) {
    this.xhr.ontimeout = null;
  }
  if (abort) {
    try {
      this.xhr.abort();
    } catch (x2) {
    }
  }
  this.unloadRef = this.xhr = null;
};
AbstractXHRObject.prototype.close = function() {
  this._cleanup(true);
};
AbstractXHRObject.enabled = !!XHR;
var axo$1 = ["Active"].concat("Object").join("X");
if (!AbstractXHRObject.enabled && axo$1 in globalThis) {
  XHR = function() {
    try {
      return new globalThis[axo$1]("Microsoft.XMLHTTP");
    } catch (e2) {
      return null;
    }
  };
  AbstractXHRObject.enabled = !!new XHR();
}
var cors = false;
try {
  cors = "withCredentials" in new XHR();
} catch (ignored) {
}
AbstractXHRObject.supportsCORS = cors;
var abstractXhr = AbstractXHRObject;
var inherits$m = inherits_browserExports, XhrDriver$1 = abstractXhr;
function XHRCorsObject$3(method, url2, payload, opts) {
  XhrDriver$1.call(this, method, url2, payload, opts);
}
inherits$m(XHRCorsObject$3, XhrDriver$1);
XHRCorsObject$3.enabled = XhrDriver$1.enabled && XhrDriver$1.supportsCORS;
var xhrCors = XHRCorsObject$3;
var inherits$l = inherits_browserExports, XhrDriver = abstractXhr;
function XHRLocalObject$4(method, url2, payload) {
  XhrDriver.call(this, method, url2, payload, {
    noCredentials: true
  });
}
inherits$l(XHRLocalObject$4, XhrDriver);
XHRLocalObject$4.enabled = XhrDriver.enabled;
var xhrLocal = XHRLocalObject$4;
var browser$4 = {
  isOpera: function() {
    return globalThis.navigator && /opera/i.test(globalThis.navigator.userAgent);
  },
  isKonqueror: function() {
    return globalThis.navigator && /konqueror/i.test(globalThis.navigator.userAgent);
  },
  hasDomain: function() {
    if (!globalThis.document) {
      return true;
    }
    try {
      return !!globalThis.document.domain;
    } catch (e2) {
      return false;
    }
  }
};
var inherits$k = inherits_browserExports, AjaxBasedTransport$5 = ajaxBased, XhrReceiver$3 = xhr, XHRCorsObject$2 = xhrCors, XHRLocalObject$3 = xhrLocal, browser$3 = browser$4;
function XhrStreamingTransport(transUrl) {
  if (!XHRLocalObject$3.enabled && !XHRCorsObject$2.enabled) {
    throw new Error("Transport created when disabled");
  }
  AjaxBasedTransport$5.call(this, transUrl, "/xhr_streaming", XhrReceiver$3, XHRCorsObject$2);
}
inherits$k(XhrStreamingTransport, AjaxBasedTransport$5);
XhrStreamingTransport.enabled = function(info) {
  if (info.nullOrigin) {
    return false;
  }
  if (browser$3.isOpera()) {
    return false;
  }
  return XHRCorsObject$2.enabled;
};
XhrStreamingTransport.transportName = "xhr-streaming";
XhrStreamingTransport.roundTrips = 2;
XhrStreamingTransport.needBody = !!globalThis.document;
var xhrStreaming = XhrStreamingTransport;
var EventEmitter$9 = emitter.EventEmitter, inherits$j = inherits_browserExports, eventUtils$3 = eventExports, browser$2 = browser$4, urlUtils$7 = url;
var debug$8 = function() {
};
function XDRObject$2(method, url2, payload) {
  var self2 = this;
  EventEmitter$9.call(this);
  setTimeout(function() {
    self2._start(method, url2, payload);
  }, 0);
}
inherits$j(XDRObject$2, EventEmitter$9);
XDRObject$2.prototype._start = function(method, url2, payload) {
  var self2 = this;
  var xdr2 = new globalThis.XDomainRequest();
  url2 = urlUtils$7.addQuery(url2, "t=" + +/* @__PURE__ */ new Date());
  xdr2.onerror = function() {
    self2._error();
  };
  xdr2.ontimeout = function() {
    self2._error();
  };
  xdr2.onprogress = function() {
    debug$8("progress", xdr2.responseText);
    self2.emit("chunk", 200, xdr2.responseText);
  };
  xdr2.onload = function() {
    self2.emit("finish", 200, xdr2.responseText);
    self2._cleanup(false);
  };
  this.xdr = xdr2;
  this.unloadRef = eventUtils$3.unloadAdd(function() {
    self2._cleanup(true);
  });
  try {
    this.xdr.open(method, url2);
    if (this.timeout) {
      this.xdr.timeout = this.timeout;
    }
    this.xdr.send(payload);
  } catch (x2) {
    this._error();
  }
};
XDRObject$2.prototype._error = function() {
  this.emit("finish", 0, "");
  this._cleanup(false);
};
XDRObject$2.prototype._cleanup = function(abort) {
  if (!this.xdr) {
    return;
  }
  this.removeAllListeners();
  eventUtils$3.unloadDel(this.unloadRef);
  this.xdr.ontimeout = this.xdr.onerror = this.xdr.onprogress = this.xdr.onload = null;
  if (abort) {
    try {
      this.xdr.abort();
    } catch (x2) {
    }
  }
  this.unloadRef = this.xdr = null;
};
XDRObject$2.prototype.close = function() {
  this._cleanup(true);
};
XDRObject$2.enabled = !!(globalThis.XDomainRequest && browser$2.hasDomain());
var xdr = XDRObject$2;
var inherits$i = inherits_browserExports, AjaxBasedTransport$4 = ajaxBased, XhrReceiver$2 = xhr, XDRObject$1 = xdr;
function XdrStreamingTransport$1(transUrl) {
  if (!XDRObject$1.enabled) {
    throw new Error("Transport created when disabled");
  }
  AjaxBasedTransport$4.call(this, transUrl, "/xhr_streaming", XhrReceiver$2, XDRObject$1);
}
inherits$i(XdrStreamingTransport$1, AjaxBasedTransport$4);
XdrStreamingTransport$1.enabled = function(info) {
  if (info.cookie_needed || info.nullOrigin) {
    return false;
  }
  return XDRObject$1.enabled && info.sameScheme;
};
XdrStreamingTransport$1.transportName = "xdr-streaming";
XdrStreamingTransport$1.roundTrips = 2;
var xdrStreaming = XdrStreamingTransport$1;
var eventsource$2 = globalThis.EventSource;
var inherits$h = inherits_browserExports, EventEmitter$8 = emitter.EventEmitter, EventSourceDriver$1 = eventsource$2;
var debug$7 = function() {
};
function EventSourceReceiver$1(url2) {
  EventEmitter$8.call(this);
  var self2 = this;
  var es = this.es = new EventSourceDriver$1(url2);
  es.onmessage = function(e2) {
    debug$7("message", e2.data);
    self2.emit("message", decodeURI(e2.data));
  };
  es.onerror = function(e2) {
    debug$7("error", es.readyState);
    var reason = es.readyState !== 2 ? "network" : "permanent";
    self2._cleanup();
    self2._close(reason);
  };
}
inherits$h(EventSourceReceiver$1, EventEmitter$8);
EventSourceReceiver$1.prototype.abort = function() {
  this._cleanup();
  this._close("user");
};
EventSourceReceiver$1.prototype._cleanup = function() {
  var es = this.es;
  if (es) {
    es.onmessage = es.onerror = null;
    es.close();
    this.es = null;
  }
};
EventSourceReceiver$1.prototype._close = function(reason) {
  var self2 = this;
  setTimeout(function() {
    self2.emit("close", null, reason);
    self2.removeAllListeners();
  }, 200);
};
var eventsource$1 = EventSourceReceiver$1;
var inherits$g = inherits_browserExports, AjaxBasedTransport$3 = ajaxBased, EventSourceReceiver = eventsource$1, XHRCorsObject$1 = xhrCors, EventSourceDriver = eventsource$2;
function EventSourceTransport(transUrl) {
  if (!EventSourceTransport.enabled()) {
    throw new Error("Transport created when disabled");
  }
  AjaxBasedTransport$3.call(this, transUrl, "/eventsource", EventSourceReceiver, XHRCorsObject$1);
}
inherits$g(EventSourceTransport, AjaxBasedTransport$3);
EventSourceTransport.enabled = function() {
  return !!EventSourceDriver;
};
EventSourceTransport.transportName = "eventsource";
EventSourceTransport.roundTrips = 2;
var eventsource = EventSourceTransport;
var version$1 = "1.6.1";
var iframe$1 = { exports: {} };
(function(module) {
  var eventUtils2 = eventExports, browser2 = browser$4;
  module.exports = {
    WPrefix: "_jp",
    currentWindowId: null,
    polluteGlobalNamespace: function() {
      if (!(module.exports.WPrefix in globalThis)) {
        globalThis[module.exports.WPrefix] = {};
      }
    },
    postMessage: function(type, data) {
      if (globalThis.parent !== globalThis) {
        globalThis.parent.postMessage(JSON.stringify({
          windowId: module.exports.currentWindowId,
          type,
          data: data || ""
        }), "*");
      }
    },
    createIframe: function(iframeUrl, errorCallback) {
      var iframe2 = globalThis.document.createElement("iframe");
      var tref, unloadRef;
      var unattach = function() {
        clearTimeout(tref);
        try {
          iframe2.onload = null;
        } catch (x2) {
        }
        iframe2.onerror = null;
      };
      var cleanup = function() {
        if (iframe2) {
          unattach();
          setTimeout(function() {
            if (iframe2) {
              iframe2.parentNode.removeChild(iframe2);
            }
            iframe2 = null;
          }, 0);
          eventUtils2.unloadDel(unloadRef);
        }
      };
      var onerror = function(err) {
        if (iframe2) {
          cleanup();
          errorCallback(err);
        }
      };
      var post = function(msg, origin2) {
        setTimeout(function() {
          try {
            if (iframe2 && iframe2.contentWindow) {
              iframe2.contentWindow.postMessage(msg, origin2);
            }
          } catch (x2) {
          }
        }, 0);
      };
      iframe2.src = iframeUrl;
      iframe2.style.display = "none";
      iframe2.style.position = "absolute";
      iframe2.onerror = function() {
        onerror("onerror");
      };
      iframe2.onload = function() {
        clearTimeout(tref);
        tref = setTimeout(function() {
          onerror("onload timeout");
        }, 2e3);
      };
      globalThis.document.body.appendChild(iframe2);
      tref = setTimeout(function() {
        onerror("timeout");
      }, 15e3);
      unloadRef = eventUtils2.unloadAdd(cleanup);
      return {
        post,
        cleanup,
        loaded: unattach
      };
    },
    createHtmlfile: function(iframeUrl, errorCallback) {
      var axo2 = ["Active"].concat("Object").join("X");
      var doc = new globalThis[axo2]("htmlfile");
      var tref, unloadRef;
      var iframe2;
      var unattach = function() {
        clearTimeout(tref);
        iframe2.onerror = null;
      };
      var cleanup = function() {
        if (doc) {
          unattach();
          eventUtils2.unloadDel(unloadRef);
          iframe2.parentNode.removeChild(iframe2);
          iframe2 = doc = null;
          CollectGarbage();
        }
      };
      var onerror = function(r2) {
        if (doc) {
          cleanup();
          errorCallback(r2);
        }
      };
      var post = function(msg, origin2) {
        try {
          setTimeout(function() {
            if (iframe2 && iframe2.contentWindow) {
              iframe2.contentWindow.postMessage(msg, origin2);
            }
          }, 0);
        } catch (x2) {
        }
      };
      doc.open();
      doc.write('<html><script>document.domain="' + globalThis.document.domain + '";<\/script></html>');
      doc.close();
      doc.parentWindow[module.exports.WPrefix] = globalThis[module.exports.WPrefix];
      var c2 = doc.createElement("div");
      doc.body.appendChild(c2);
      iframe2 = doc.createElement("iframe");
      c2.appendChild(iframe2);
      iframe2.src = iframeUrl;
      iframe2.onerror = function() {
        onerror("onerror");
      };
      tref = setTimeout(function() {
        onerror("timeout");
      }, 15e3);
      unloadRef = eventUtils2.unloadAdd(cleanup);
      return {
        post,
        cleanup,
        loaded: unattach
      };
    }
  };
  module.exports.iframeEnabled = false;
  if (globalThis.document) {
    module.exports.iframeEnabled = (typeof globalThis.postMessage === "function" || typeof globalThis.postMessage === "object") && !browser2.isKonqueror();
  }
})(iframe$1);
var iframeExports = iframe$1.exports;
var inherits$f = inherits_browserExports, EventEmitter$7 = emitter.EventEmitter, version = version$1, urlUtils$6 = url, iframeUtils$3 = iframeExports, eventUtils$2 = eventExports, random$4 = random$5;
var debug$6 = function() {
};
function IframeTransport$2(transport2, transUrl, baseUrl) {
  if (!IframeTransport$2.enabled()) {
    throw new Error("Transport created when disabled");
  }
  EventEmitter$7.call(this);
  var self2 = this;
  this.origin = urlUtils$6.getOrigin(baseUrl);
  this.baseUrl = baseUrl;
  this.transUrl = transUrl;
  this.transport = transport2;
  this.windowId = random$4.string(8);
  var iframeUrl = urlUtils$6.addPath(baseUrl, "/iframe.html") + "#" + this.windowId;
  this.iframeObj = iframeUtils$3.createIframe(iframeUrl, function(r2) {
    self2.emit("close", 1006, "Unable to load an iframe (" + r2 + ")");
    self2.close();
  });
  this.onmessageCallback = this._message.bind(this);
  eventUtils$2.attachEvent("message", this.onmessageCallback);
}
inherits$f(IframeTransport$2, EventEmitter$7);
IframeTransport$2.prototype.close = function() {
  this.removeAllListeners();
  if (this.iframeObj) {
    eventUtils$2.detachEvent("message", this.onmessageCallback);
    try {
      this.postMessage("c");
    } catch (x2) {
    }
    this.iframeObj.cleanup();
    this.iframeObj = null;
    this.onmessageCallback = this.iframeObj = null;
  }
};
IframeTransport$2.prototype._message = function(e2) {
  debug$6("message", e2.data);
  if (!urlUtils$6.isOriginEqual(e2.origin, this.origin)) {
    debug$6("not same origin", e2.origin, this.origin);
    return;
  }
  var iframeMessage;
  try {
    iframeMessage = JSON.parse(e2.data);
  } catch (ignored) {
    debug$6("bad json", e2.data);
    return;
  }
  if (iframeMessage.windowId !== this.windowId) {
    debug$6("mismatched window id", iframeMessage.windowId, this.windowId);
    return;
  }
  switch (iframeMessage.type) {
    case "s":
      this.iframeObj.loaded();
      this.postMessage("s", JSON.stringify([
        version,
        this.transport,
        this.transUrl,
        this.baseUrl
      ]));
      break;
    case "t":
      this.emit("message", iframeMessage.data);
      break;
    case "c":
      var cdata;
      try {
        cdata = JSON.parse(iframeMessage.data);
      } catch (ignored) {
        debug$6("bad json", iframeMessage.data);
        return;
      }
      this.emit("close", cdata[0], cdata[1]);
      this.close();
      break;
  }
};
IframeTransport$2.prototype.postMessage = function(type, data) {
  this.iframeObj.post(JSON.stringify({
    windowId: this.windowId,
    type,
    data: data || ""
  }), this.origin);
};
IframeTransport$2.prototype.send = function(message) {
  this.postMessage("m", message);
};
IframeTransport$2.enabled = function() {
  return iframeUtils$3.iframeEnabled;
};
IframeTransport$2.transportName = "iframe";
IframeTransport$2.roundTrips = 2;
var iframe = IframeTransport$2;
var object = {
  isObject: function(obj) {
    var type = typeof obj;
    return type === "function" || type === "object" && !!obj;
  },
  extend: function(obj) {
    if (!this.isObject(obj)) {
      return obj;
    }
    var source, prop;
    for (var i2 = 1, length = arguments.length; i2 < length; i2++) {
      source = arguments[i2];
      for (prop in source) {
        if (Object.prototype.hasOwnProperty.call(source, prop)) {
          obj[prop] = source[prop];
        }
      }
    }
    return obj;
  }
};
var inherits$e = inherits_browserExports, IframeTransport$1 = iframe, objectUtils$2 = object;
var iframeWrap = function(transport2) {
  function IframeWrapTransport(transUrl, baseUrl) {
    IframeTransport$1.call(this, transport2.transportName, transUrl, baseUrl);
  }
  inherits$e(IframeWrapTransport, IframeTransport$1);
  IframeWrapTransport.enabled = function(url2, info) {
    if (!globalThis.document) {
      return false;
    }
    var iframeInfo = objectUtils$2.extend({}, info);
    iframeInfo.sameOrigin = true;
    return transport2.enabled(iframeInfo) && IframeTransport$1.enabled();
  };
  IframeWrapTransport.transportName = "iframe-" + transport2.transportName;
  IframeWrapTransport.needBody = true;
  IframeWrapTransport.roundTrips = IframeTransport$1.roundTrips + transport2.roundTrips - 1;
  IframeWrapTransport.facadeTransport = transport2;
  return IframeWrapTransport;
};
var inherits$d = inherits_browserExports, iframeUtils$2 = iframeExports, urlUtils$5 = url, EventEmitter$6 = emitter.EventEmitter, random$3 = random$5;
var debug$5 = function() {
};
function HtmlfileReceiver$1(url2) {
  EventEmitter$6.call(this);
  var self2 = this;
  iframeUtils$2.polluteGlobalNamespace();
  this.id = "a" + random$3.string(6);
  url2 = urlUtils$5.addQuery(url2, "c=" + decodeURIComponent(iframeUtils$2.WPrefix + "." + this.id));
  debug$5("using htmlfile", HtmlfileReceiver$1.htmlfileEnabled);
  var constructFunc = HtmlfileReceiver$1.htmlfileEnabled ? iframeUtils$2.createHtmlfile : iframeUtils$2.createIframe;
  globalThis[iframeUtils$2.WPrefix][this.id] = {
    start: function() {
      self2.iframeObj.loaded();
    },
    message: function(data) {
      self2.emit("message", data);
    },
    stop: function() {
      self2._cleanup();
      self2._close("network");
    }
  };
  this.iframeObj = constructFunc(url2, function() {
    self2._cleanup();
    self2._close("permanent");
  });
}
inherits$d(HtmlfileReceiver$1, EventEmitter$6);
HtmlfileReceiver$1.prototype.abort = function() {
  this._cleanup();
  this._close("user");
};
HtmlfileReceiver$1.prototype._cleanup = function() {
  if (this.iframeObj) {
    this.iframeObj.cleanup();
    this.iframeObj = null;
  }
  delete globalThis[iframeUtils$2.WPrefix][this.id];
};
HtmlfileReceiver$1.prototype._close = function(reason) {
  this.emit("close", null, reason);
  this.removeAllListeners();
};
HtmlfileReceiver$1.htmlfileEnabled = false;
var axo = ["Active"].concat("Object").join("X");
if (axo in globalThis) {
  try {
    HtmlfileReceiver$1.htmlfileEnabled = !!new globalThis[axo]("htmlfile");
  } catch (x2) {
  }
}
HtmlfileReceiver$1.enabled = HtmlfileReceiver$1.htmlfileEnabled || iframeUtils$2.iframeEnabled;
var htmlfile$1 = HtmlfileReceiver$1;
var inherits$c = inherits_browserExports, HtmlfileReceiver = htmlfile$1, XHRLocalObject$2 = xhrLocal, AjaxBasedTransport$2 = ajaxBased;
function HtmlFileTransport(transUrl) {
  if (!HtmlfileReceiver.enabled) {
    throw new Error("Transport created when disabled");
  }
  AjaxBasedTransport$2.call(this, transUrl, "/htmlfile", HtmlfileReceiver, XHRLocalObject$2);
}
inherits$c(HtmlFileTransport, AjaxBasedTransport$2);
HtmlFileTransport.enabled = function(info) {
  return HtmlfileReceiver.enabled && info.sameOrigin;
};
HtmlFileTransport.transportName = "htmlfile";
HtmlFileTransport.roundTrips = 2;
var htmlfile = HtmlFileTransport;
var inherits$b = inherits_browserExports, AjaxBasedTransport$1 = ajaxBased, XhrReceiver$1 = xhr, XHRCorsObject = xhrCors, XHRLocalObject$1 = xhrLocal;
function XhrPollingTransport(transUrl) {
  if (!XHRLocalObject$1.enabled && !XHRCorsObject.enabled) {
    throw new Error("Transport created when disabled");
  }
  AjaxBasedTransport$1.call(this, transUrl, "/xhr", XhrReceiver$1, XHRCorsObject);
}
inherits$b(XhrPollingTransport, AjaxBasedTransport$1);
XhrPollingTransport.enabled = function(info) {
  if (info.nullOrigin) {
    return false;
  }
  if (XHRLocalObject$1.enabled && info.sameOrigin) {
    return true;
  }
  return XHRCorsObject.enabled;
};
XhrPollingTransport.transportName = "xhr-polling";
XhrPollingTransport.roundTrips = 2;
var xhrPolling = XhrPollingTransport;
var inherits$a = inherits_browserExports, AjaxBasedTransport = ajaxBased, XdrStreamingTransport = xdrStreaming, XhrReceiver = xhr, XDRObject = xdr;
function XdrPollingTransport(transUrl) {
  if (!XDRObject.enabled) {
    throw new Error("Transport created when disabled");
  }
  AjaxBasedTransport.call(this, transUrl, "/xhr", XhrReceiver, XDRObject);
}
inherits$a(XdrPollingTransport, AjaxBasedTransport);
XdrPollingTransport.enabled = XdrStreamingTransport.enabled;
XdrPollingTransport.transportName = "xdr-polling";
XdrPollingTransport.roundTrips = 2;
var xdrPolling = XdrPollingTransport;
var utils$1 = iframeExports, random$2 = random$5, browser$1 = browser$4, urlUtils$4 = url, inherits$9 = inherits_browserExports, EventEmitter$5 = emitter.EventEmitter;
var debug$4 = function() {
};
function JsonpReceiver$1(url2) {
  var self2 = this;
  EventEmitter$5.call(this);
  utils$1.polluteGlobalNamespace();
  this.id = "a" + random$2.string(6);
  var urlWithId = urlUtils$4.addQuery(url2, "c=" + encodeURIComponent(utils$1.WPrefix + "." + this.id));
  globalThis[utils$1.WPrefix][this.id] = this._callback.bind(this);
  this._createScript(urlWithId);
  this.timeoutId = setTimeout(function() {
    self2._abort(new Error("JSONP script loaded abnormally (timeout)"));
  }, JsonpReceiver$1.timeout);
}
inherits$9(JsonpReceiver$1, EventEmitter$5);
JsonpReceiver$1.prototype.abort = function() {
  if (globalThis[utils$1.WPrefix][this.id]) {
    var err = new Error("JSONP user aborted read");
    err.code = 1e3;
    this._abort(err);
  }
};
JsonpReceiver$1.timeout = 35e3;
JsonpReceiver$1.scriptErrorTimeout = 1e3;
JsonpReceiver$1.prototype._callback = function(data) {
  this._cleanup();
  if (this.aborting) {
    return;
  }
  if (data) {
    this.emit("message", data);
  }
  this.emit("close", null, "network");
  this.removeAllListeners();
};
JsonpReceiver$1.prototype._abort = function(err) {
  this._cleanup();
  this.aborting = true;
  this.emit("close", err.code, err.message);
  this.removeAllListeners();
};
JsonpReceiver$1.prototype._cleanup = function() {
  clearTimeout(this.timeoutId);
  if (this.script2) {
    this.script2.parentNode.removeChild(this.script2);
    this.script2 = null;
  }
  if (this.script) {
    var script = this.script;
    script.parentNode.removeChild(script);
    script.onreadystatechange = script.onerror = script.onload = script.onclick = null;
    this.script = null;
  }
  delete globalThis[utils$1.WPrefix][this.id];
};
JsonpReceiver$1.prototype._scriptError = function() {
  var self2 = this;
  if (this.errorTimer) {
    return;
  }
  this.errorTimer = setTimeout(function() {
    if (!self2.loadedOkay) {
      self2._abort(new Error("JSONP script loaded abnormally (onerror)"));
    }
  }, JsonpReceiver$1.scriptErrorTimeout);
};
JsonpReceiver$1.prototype._createScript = function(url2) {
  var self2 = this;
  var script = this.script = globalThis.document.createElement("script");
  var script2;
  script.id = "a" + random$2.string(8);
  script.src = url2;
  script.type = "text/javascript";
  script.charset = "UTF-8";
  script.onerror = this._scriptError.bind(this);
  script.onload = function() {
    self2._abort(new Error("JSONP script loaded abnormally (onload)"));
  };
  script.onreadystatechange = function() {
    debug$4("onreadystatechange", script.readyState);
    if (/loaded|closed/.test(script.readyState)) {
      if (script && script.htmlFor && script.onclick) {
        self2.loadedOkay = true;
        try {
          script.onclick();
        } catch (x2) {
        }
      }
      if (script) {
        self2._abort(new Error("JSONP script loaded abnormally (onreadystatechange)"));
      }
    }
  };
  if (typeof script.async === "undefined" && globalThis.document.attachEvent) {
    if (!browser$1.isOpera()) {
      try {
        script.htmlFor = script.id;
        script.event = "onclick";
      } catch (x2) {
      }
      script.async = true;
    } else {
      script2 = this.script2 = globalThis.document.createElement("script");
      script2.text = "try{var a = document.getElementById('" + script.id + "'); if(a)a.onerror();}catch(x){};";
      script.async = script2.async = false;
    }
  }
  if (typeof script.async !== "undefined") {
    script.async = true;
  }
  var head = globalThis.document.getElementsByTagName("head")[0];
  head.insertBefore(script, head.firstChild);
  if (script2) {
    head.insertBefore(script2, head.firstChild);
  }
};
var jsonp$1 = JsonpReceiver$1;
var random$1 = random$5, urlUtils$3 = url;
var debug$3 = function() {
};
var form, area;
function createIframe(id2) {
  try {
    return globalThis.document.createElement('<iframe name="' + id2 + '">');
  } catch (x2) {
    var iframe2 = globalThis.document.createElement("iframe");
    iframe2.name = id2;
    return iframe2;
  }
}
function createForm() {
  form = globalThis.document.createElement("form");
  form.style.display = "none";
  form.style.position = "absolute";
  form.method = "POST";
  form.enctype = "application/x-www-form-urlencoded";
  form.acceptCharset = "UTF-8";
  area = globalThis.document.createElement("textarea");
  area.name = "d";
  form.appendChild(area);
  globalThis.document.body.appendChild(form);
}
var jsonp = function(url2, payload, callback) {
  if (!form) {
    createForm();
  }
  var id2 = "a" + random$1.string(8);
  form.target = id2;
  form.action = urlUtils$3.addQuery(urlUtils$3.addPath(url2, "/jsonp_send"), "i=" + id2);
  var iframe2 = createIframe(id2);
  iframe2.id = id2;
  iframe2.style.display = "none";
  form.appendChild(iframe2);
  try {
    area.value = payload;
  } catch (e2) {
  }
  form.submit();
  var completed = function(err) {
    if (!iframe2.onerror) {
      return;
    }
    iframe2.onreadystatechange = iframe2.onerror = iframe2.onload = null;
    setTimeout(function() {
      iframe2.parentNode.removeChild(iframe2);
      iframe2 = null;
    }, 500);
    area.value = "";
    callback(err);
  };
  iframe2.onerror = function() {
    completed();
  };
  iframe2.onload = function() {
    completed();
  };
  iframe2.onreadystatechange = function(e2) {
    debug$3("onreadystatechange", id2, iframe2.readyState);
    if (iframe2.readyState === "complete") {
      completed();
    }
  };
  return function() {
    completed(new Error("Aborted"));
  };
};
var inherits$8 = inherits_browserExports, SenderReceiver = senderReceiver, JsonpReceiver = jsonp$1, jsonpSender = jsonp;
function JsonPTransport(transUrl) {
  if (!JsonPTransport.enabled()) {
    throw new Error("Transport created when disabled");
  }
  SenderReceiver.call(this, transUrl, "/jsonp", jsonpSender, JsonpReceiver);
}
inherits$8(JsonPTransport, SenderReceiver);
JsonPTransport.enabled = function() {
  return !!globalThis.document;
};
JsonPTransport.transportName = "jsonp-polling";
JsonPTransport.roundTrips = 1;
JsonPTransport.needBody = true;
var jsonpPolling = JsonPTransport;
var transportList$1 = [
  // streaming transports
  websocket,
  xhrStreaming,
  xdrStreaming,
  eventsource,
  iframeWrap(eventsource),
  htmlfile,
  iframeWrap(htmlfile),
  xhrPolling,
  xdrPolling,
  iframeWrap(xhrPolling),
  jsonpPolling
];
var ArrayPrototype = Array.prototype;
var ObjectPrototype = Object.prototype;
var FunctionPrototype = Function.prototype;
var StringPrototype = String.prototype;
var array_slice = ArrayPrototype.slice;
var _toString = ObjectPrototype.toString;
var isFunction = function(val) {
  return ObjectPrototype.toString.call(val) === "[object Function]";
};
var isArray = function isArray2(obj) {
  return _toString.call(obj) === "[object Array]";
};
var isString = function isString2(obj) {
  return _toString.call(obj) === "[object String]";
};
var supportsDescriptors = Object.defineProperty && function() {
  try {
    Object.defineProperty({}, "x", {});
    return true;
  } catch (e2) {
    return false;
  }
}();
var defineProperty;
if (supportsDescriptors) {
  defineProperty = function(object2, name, method, forceAssign) {
    if (!forceAssign && name in object2) {
      return;
    }
    Object.defineProperty(object2, name, {
      configurable: true,
      enumerable: false,
      writable: true,
      value: method
    });
  };
} else {
  defineProperty = function(object2, name, method, forceAssign) {
    if (!forceAssign && name in object2) {
      return;
    }
    object2[name] = method;
  };
}
var defineProperties = function(object2, map, forceAssign) {
  for (var name in map) {
    if (ObjectPrototype.hasOwnProperty.call(map, name)) {
      defineProperty(object2, name, map[name], forceAssign);
    }
  }
};
var toObject = function(o3) {
  if (o3 == null) {
    throw new TypeError("can't convert " + o3 + " to object");
  }
  return Object(o3);
};
function toInteger(num) {
  var n2 = +num;
  if (n2 !== n2) {
    n2 = 0;
  } else if (n2 !== 0 && n2 !== 1 / 0 && n2 !== -(1 / 0)) {
    n2 = (n2 > 0 || -1) * Math.floor(Math.abs(n2));
  }
  return n2;
}
function ToUint32(x2) {
  return x2 >>> 0;
}
function Empty() {
}
defineProperties(FunctionPrototype, {
  bind: function bind2(that) {
    var target = this;
    if (!isFunction(target)) {
      throw new TypeError("Function.prototype.bind called on incompatible " + target);
    }
    var args = array_slice.call(arguments, 1);
    var binder = function() {
      if (this instanceof bound) {
        var result = target.apply(
          this,
          args.concat(array_slice.call(arguments))
        );
        if (Object(result) === result) {
          return result;
        }
        return this;
      } else {
        return target.apply(
          that,
          args.concat(array_slice.call(arguments))
        );
      }
    };
    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i2 = 0; i2 < boundLength; i2++) {
      boundArgs.push("$" + i2);
    }
    var bound = Function("binder", "return function (" + boundArgs.join(",") + "){ return binder.apply(this, arguments); }")(binder);
    if (target.prototype) {
      Empty.prototype = target.prototype;
      bound.prototype = new Empty();
      Empty.prototype = null;
    }
    return bound;
  }
});
defineProperties(Array, { isArray });
var boxedString = Object("a");
var splitString = boxedString[0] !== "a" || !(0 in boxedString);
var properlyBoxesContext = function properlyBoxed(method) {
  var properlyBoxesNonStrict = true;
  var properlyBoxesStrict = true;
  if (method) {
    method.call("foo", function(_2, __, context) {
      if (typeof context !== "object") {
        properlyBoxesNonStrict = false;
      }
    });
    method.call([1], function() {
      properlyBoxesStrict = typeof this === "string";
    }, "x");
  }
  return !!method && properlyBoxesNonStrict && properlyBoxesStrict;
};
defineProperties(ArrayPrototype, {
  forEach: function forEach2(fun) {
    var object2 = toObject(this), self2 = splitString && isString(this) ? this.split("") : object2, thisp = arguments[1], i2 = -1, length = self2.length >>> 0;
    if (!isFunction(fun)) {
      throw new TypeError();
    }
    while (++i2 < length) {
      if (i2 in self2) {
        fun.call(thisp, self2[i2], i2, object2);
      }
    }
  }
}, !properlyBoxesContext(ArrayPrototype.forEach));
var hasFirefox2IndexOfBug = Array.prototype.indexOf && [0, 1].indexOf(1, 2) !== -1;
defineProperties(ArrayPrototype, {
  indexOf: function indexOf(sought) {
    var self2 = splitString && isString(this) ? this.split("") : toObject(this), length = self2.length >>> 0;
    if (!length) {
      return -1;
    }
    var i2 = 0;
    if (arguments.length > 1) {
      i2 = toInteger(arguments[1]);
    }
    i2 = i2 >= 0 ? i2 : Math.max(0, length + i2);
    for (; i2 < length; i2++) {
      if (i2 in self2 && self2[i2] === sought) {
        return i2;
      }
    }
    return -1;
  }
}, hasFirefox2IndexOfBug);
var string_split = StringPrototype.split;
if ("ab".split(/(?:ab)*/).length !== 2 || ".".split(/(.?)(.?)/).length !== 4 || "tesst".split(/(s)*/)[1] === "t" || "test".split(/(?:)/, -1).length !== 4 || "".split(/.?/).length || ".".split(/()()/).length > 1) {
  (function() {
    var compliantExecNpcg = /()??/.exec("")[1] === void 0;
    StringPrototype.split = function(separator, limit) {
      var string = this;
      if (separator === void 0 && limit === 0) {
        return [];
      }
      if (_toString.call(separator) !== "[object RegExp]") {
        return string_split.call(this, separator, limit);
      }
      var output = [], flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""), lastLastIndex = 0, separator2, match, lastIndex, lastLength;
      separator = new RegExp(separator.source, flags + "g");
      string += "";
      if (!compliantExecNpcg) {
        separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
      }
      limit = limit === void 0 ? -1 >>> 0 : (
        // Math.pow(2, 32) - 1
        ToUint32(limit)
      );
      while (match = separator.exec(string)) {
        lastIndex = match.index + match[0].length;
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (!compliantExecNpcg && match.length > 1) {
            match[0].replace(separator2, function() {
              for (var i2 = 1; i2 < arguments.length - 2; i2++) {
                if (arguments[i2] === void 0) {
                  match[i2] = void 0;
                }
              }
            });
          }
          if (match.length > 1 && match.index < string.length) {
            ArrayPrototype.push.apply(output, match.slice(1));
          }
          lastLength = match[0].length;
          lastLastIndex = lastIndex;
          if (output.length >= limit) {
            break;
          }
        }
        if (separator.lastIndex === match.index) {
          separator.lastIndex++;
        }
      }
      if (lastLastIndex === string.length) {
        if (lastLength || !separator.test("")) {
          output.push("");
        }
      } else {
        output.push(string.slice(lastLastIndex));
      }
      return output.length > limit ? output.slice(0, limit) : output;
    };
  })();
} else if ("0".split(void 0, 0).length) {
  StringPrototype.split = function split(separator, limit) {
    if (separator === void 0 && limit === 0) {
      return [];
    }
    return string_split.call(this, separator, limit);
  };
}
var string_substr = StringPrototype.substr;
var hasNegativeSubstrBug = "".substr && "0b".substr(-1) !== "b";
defineProperties(StringPrototype, {
  substr: function substr(start, length) {
    return string_substr.call(
      this,
      start < 0 ? (start = this.length + start) < 0 ? 0 : start : start,
      length
    );
  }
}, hasNegativeSubstrBug);
var extraEscapable = /[\x00-\x1f\ud800-\udfff\ufffe\uffff\u0300-\u0333\u033d-\u0346\u034a-\u034c\u0350-\u0352\u0357-\u0358\u035c-\u0362\u0374\u037e\u0387\u0591-\u05af\u05c4\u0610-\u0617\u0653-\u0654\u0657-\u065b\u065d-\u065e\u06df-\u06e2\u06eb-\u06ec\u0730\u0732-\u0733\u0735-\u0736\u073a\u073d\u073f-\u0741\u0743\u0745\u0747\u07eb-\u07f1\u0951\u0958-\u095f\u09dc-\u09dd\u09df\u0a33\u0a36\u0a59-\u0a5b\u0a5e\u0b5c-\u0b5d\u0e38-\u0e39\u0f43\u0f4d\u0f52\u0f57\u0f5c\u0f69\u0f72-\u0f76\u0f78\u0f80-\u0f83\u0f93\u0f9d\u0fa2\u0fa7\u0fac\u0fb9\u1939-\u193a\u1a17\u1b6b\u1cda-\u1cdb\u1dc0-\u1dcf\u1dfc\u1dfe\u1f71\u1f73\u1f75\u1f77\u1f79\u1f7b\u1f7d\u1fbb\u1fbe\u1fc9\u1fcb\u1fd3\u1fdb\u1fe3\u1feb\u1fee-\u1fef\u1ff9\u1ffb\u1ffd\u2000-\u2001\u20d0-\u20d1\u20d4-\u20d7\u20e7-\u20e9\u2126\u212a-\u212b\u2329-\u232a\u2adc\u302b-\u302c\uaab2-\uaab3\uf900-\ufa0d\ufa10\ufa12\ufa15-\ufa1e\ufa20\ufa22\ufa25-\ufa26\ufa2a-\ufa2d\ufa30-\ufa6d\ufa70-\ufad9\ufb1d\ufb1f\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4e\ufff0-\uffff]/g, extraLookup;
var unrollLookup = function(escapable) {
  var i2;
  var unrolled = {};
  var c2 = [];
  for (i2 = 0; i2 < 65536; i2++) {
    c2.push(String.fromCharCode(i2));
  }
  escapable.lastIndex = 0;
  c2.join("").replace(escapable, function(a2) {
    unrolled[a2] = "\\u" + ("0000" + a2.charCodeAt(0).toString(16)).slice(-4);
    return "";
  });
  escapable.lastIndex = 0;
  return unrolled;
};
var _escape = {
  quote: function(string) {
    var quoted = JSON.stringify(string);
    extraEscapable.lastIndex = 0;
    if (!extraEscapable.test(quoted)) {
      return quoted;
    }
    if (!extraLookup) {
      extraLookup = unrollLookup(extraEscapable);
    }
    return quoted.replace(extraEscapable, function(a2) {
      return extraLookup[a2];
    });
  }
};
var debug$2 = function() {
};
var transport$1 = function(availableTransports) {
  return {
    filterToEnabled: function(transportsWhitelist, info) {
      var transports2 = {
        main: [],
        facade: []
      };
      if (!transportsWhitelist) {
        transportsWhitelist = [];
      } else if (typeof transportsWhitelist === "string") {
        transportsWhitelist = [transportsWhitelist];
      }
      availableTransports.forEach(function(trans) {
        if (!trans) {
          return;
        }
        if (trans.transportName === "websocket" && info.websocket === false) {
          return;
        }
        if (transportsWhitelist.length && transportsWhitelist.indexOf(trans.transportName) === -1) {
          debug$2("not in whitelist", trans.transportName);
          return;
        }
        if (trans.enabled(info)) {
          debug$2("enabled", trans.transportName);
          transports2.main.push(trans);
          if (trans.facadeTransport) {
            transports2.facade.push(trans.facadeTransport);
          }
        } else {
          debug$2("disabled", trans.transportName);
        }
      });
      return transports2;
    }
  };
};
var logObject = {};
["log", "debug", "warn"].forEach(function(level) {
  var levelExists;
  try {
    levelExists = globalThis.console && globalThis.console[level] && globalThis.console[level].apply;
  } catch (e2) {
  }
  logObject[level] = levelExists ? function() {
    return globalThis.console[level].apply(globalThis.console, arguments);
  } : level === "log" ? function() {
  } : logObject.log;
});
var log$1 = logObject;
function Event$4(eventType) {
  this.type = eventType;
}
Event$4.prototype.initEvent = function(eventType, canBubble, cancelable) {
  this.type = eventType;
  this.bubbles = canBubble;
  this.cancelable = cancelable;
  this.timeStamp = +/* @__PURE__ */ new Date();
  return this;
};
Event$4.prototype.stopPropagation = function() {
};
Event$4.prototype.preventDefault = function() {
};
Event$4.CAPTURING_PHASE = 1;
Event$4.AT_TARGET = 2;
Event$4.BUBBLING_PHASE = 3;
var event = Event$4;
var location = globalThis.location || {
  origin: "http://localhost:80",
  protocol: "http:",
  host: "localhost",
  port: 80,
  href: "http://localhost/",
  hash: ""
};
var inherits$7 = inherits_browserExports, Event$3 = event;
function CloseEvent$1() {
  Event$3.call(this);
  this.initEvent("close", false, false);
  this.wasClean = false;
  this.code = 0;
  this.reason = "";
}
inherits$7(CloseEvent$1, Event$3);
var close = CloseEvent$1;
var inherits$6 = inherits_browserExports, Event$2 = event;
function TransportMessageEvent$1(data) {
  Event$2.call(this);
  this.initEvent("message", false, false);
  this.data = data;
}
inherits$6(TransportMessageEvent$1, Event$2);
var transMessage = TransportMessageEvent$1;
var EventEmitter$4 = emitter.EventEmitter, inherits$5 = inherits_browserExports;
function XHRFake$1() {
  var self2 = this;
  EventEmitter$4.call(this);
  this.to = setTimeout(function() {
    self2.emit("finish", 200, "{}");
  }, XHRFake$1.timeout);
}
inherits$5(XHRFake$1, EventEmitter$4);
XHRFake$1.prototype.close = function() {
  clearTimeout(this.to);
};
XHRFake$1.timeout = 2e3;
var xhrFake = XHRFake$1;
var EventEmitter$3 = emitter.EventEmitter, inherits$4 = inherits_browserExports, objectUtils$1 = object;
function InfoAjax$2(url2, AjaxObject) {
  EventEmitter$3.call(this);
  var self2 = this;
  var t0 = +/* @__PURE__ */ new Date();
  this.xo = new AjaxObject("GET", url2);
  this.xo.once("finish", function(status, text) {
    var info, rtt;
    if (status === 200) {
      rtt = +/* @__PURE__ */ new Date() - t0;
      if (text) {
        try {
          info = JSON.parse(text);
        } catch (e2) {
        }
      }
      if (!objectUtils$1.isObject(info)) {
        info = {};
      }
    }
    self2.emit("finish", info, rtt);
    self2.removeAllListeners();
  });
}
inherits$4(InfoAjax$2, EventEmitter$3);
InfoAjax$2.prototype.close = function() {
  this.removeAllListeners();
  this.xo.close();
};
var infoAjax = InfoAjax$2;
var inherits$3 = inherits_browserExports, EventEmitter$2 = emitter.EventEmitter, XHRLocalObject = xhrLocal, InfoAjax$1 = infoAjax;
function InfoReceiverIframe$1(transUrl) {
  var self2 = this;
  EventEmitter$2.call(this);
  this.ir = new InfoAjax$1(transUrl, XHRLocalObject);
  this.ir.once("finish", function(info, rtt) {
    self2.ir = null;
    self2.emit("message", JSON.stringify([info, rtt]));
  });
}
inherits$3(InfoReceiverIframe$1, EventEmitter$2);
InfoReceiverIframe$1.transportName = "iframe-info-receiver";
InfoReceiverIframe$1.prototype.close = function() {
  if (this.ir) {
    this.ir.close();
    this.ir = null;
  }
  this.removeAllListeners();
};
var infoIframeReceiver = InfoReceiverIframe$1;
var EventEmitter$1 = emitter.EventEmitter, inherits$2 = inherits_browserExports, utils = eventExports, IframeTransport = iframe, InfoReceiverIframe = infoIframeReceiver;
function InfoIframe$1(baseUrl, url2) {
  var self2 = this;
  EventEmitter$1.call(this);
  var go = function() {
    var ifr = self2.ifr = new IframeTransport(InfoReceiverIframe.transportName, url2, baseUrl);
    ifr.once("message", function(msg) {
      if (msg) {
        var d2;
        try {
          d2 = JSON.parse(msg);
        } catch (e2) {
          self2.emit("finish");
          self2.close();
          return;
        }
        var info = d2[0], rtt = d2[1];
        self2.emit("finish", info, rtt);
      }
      self2.close();
    });
    ifr.once("close", function() {
      self2.emit("finish");
      self2.close();
    });
  };
  if (!globalThis.document.body) {
    utils.attachEvent("load", go);
  } else {
    go();
  }
}
inherits$2(InfoIframe$1, EventEmitter$1);
InfoIframe$1.enabled = function() {
  return IframeTransport.enabled();
};
InfoIframe$1.prototype.close = function() {
  if (this.ifr) {
    this.ifr.close();
  }
  this.removeAllListeners();
  this.ifr = null;
};
var infoIframe = InfoIframe$1;
var EventEmitter = emitter.EventEmitter, inherits$1 = inherits_browserExports, urlUtils$2 = url, XDR = xdr, XHRCors = xhrCors, XHRLocal = xhrLocal, XHRFake = xhrFake, InfoIframe = infoIframe, InfoAjax = infoAjax;
function InfoReceiver$1(baseUrl, urlInfo) {
  var self2 = this;
  EventEmitter.call(this);
  setTimeout(function() {
    self2.doXhr(baseUrl, urlInfo);
  }, 0);
}
inherits$1(InfoReceiver$1, EventEmitter);
InfoReceiver$1._getReceiver = function(baseUrl, url2, urlInfo) {
  if (urlInfo.sameOrigin) {
    return new InfoAjax(url2, XHRLocal);
  }
  if (XHRCors.enabled) {
    return new InfoAjax(url2, XHRCors);
  }
  if (XDR.enabled && urlInfo.sameScheme) {
    return new InfoAjax(url2, XDR);
  }
  if (InfoIframe.enabled()) {
    return new InfoIframe(baseUrl, url2);
  }
  return new InfoAjax(url2, XHRFake);
};
InfoReceiver$1.prototype.doXhr = function(baseUrl, urlInfo) {
  var self2 = this, url2 = urlUtils$2.addPath(baseUrl, "/info");
  this.xo = InfoReceiver$1._getReceiver(baseUrl, url2, urlInfo);
  this.timeoutRef = setTimeout(function() {
    self2._cleanup(false);
    self2.emit("finish");
  }, InfoReceiver$1.timeout);
  this.xo.once("finish", function(info, rtt) {
    self2._cleanup(true);
    self2.emit("finish", info, rtt);
  });
};
InfoReceiver$1.prototype._cleanup = function(wasClean) {
  clearTimeout(this.timeoutRef);
  this.timeoutRef = null;
  if (!wasClean && this.xo) {
    this.xo.close();
  }
  this.xo = null;
};
InfoReceiver$1.prototype.close = function() {
  this.removeAllListeners();
  this._cleanup(false);
};
InfoReceiver$1.timeout = 8e3;
var infoReceiver = InfoReceiver$1;
var iframeUtils$1 = iframeExports;
function FacadeJS$1(transport2) {
  this._transport = transport2;
  transport2.on("message", this._transportMessage.bind(this));
  transport2.on("close", this._transportClose.bind(this));
}
FacadeJS$1.prototype._transportClose = function(code, reason) {
  iframeUtils$1.postMessage("c", JSON.stringify([code, reason]));
};
FacadeJS$1.prototype._transportMessage = function(frame) {
  iframeUtils$1.postMessage("t", frame);
};
FacadeJS$1.prototype._send = function(data) {
  this._transport.send(data);
};
FacadeJS$1.prototype._close = function() {
  this._transport.close();
  this._transport.removeAllListeners();
};
var facade = FacadeJS$1;
var urlUtils$1 = url, eventUtils$1 = eventExports, FacadeJS = facade, InfoIframeReceiver = infoIframeReceiver, iframeUtils = iframeExports, loc$1 = location;
var debug$1 = function() {
};
var iframeBootstrap = function(SockJS2, availableTransports) {
  var transportMap = {};
  availableTransports.forEach(function(at) {
    if (at.facadeTransport) {
      transportMap[at.facadeTransport.transportName] = at.facadeTransport;
    }
  });
  transportMap[InfoIframeReceiver.transportName] = InfoIframeReceiver;
  var parentOrigin;
  SockJS2.bootstrap_iframe = function() {
    var facade2;
    iframeUtils.currentWindowId = loc$1.hash.slice(1);
    var onMessage = function(e2) {
      if (e2.source !== parent) {
        return;
      }
      if (typeof parentOrigin === "undefined") {
        parentOrigin = e2.origin;
      }
      if (e2.origin !== parentOrigin) {
        return;
      }
      var iframeMessage;
      try {
        iframeMessage = JSON.parse(e2.data);
      } catch (ignored) {
        debug$1("bad json", e2.data);
        return;
      }
      if (iframeMessage.windowId !== iframeUtils.currentWindowId) {
        return;
      }
      switch (iframeMessage.type) {
        case "s":
          var p2;
          try {
            p2 = JSON.parse(iframeMessage.data);
          } catch (ignored) {
            debug$1("bad json", iframeMessage.data);
            break;
          }
          var version2 = p2[0];
          var transport2 = p2[1];
          var transUrl = p2[2];
          var baseUrl = p2[3];
          if (version2 !== SockJS2.version) {
            throw new Error('Incompatible SockJS! Main site uses: "' + version2 + '", the iframe: "' + SockJS2.version + '".');
          }
          if (!urlUtils$1.isOriginEqual(transUrl, loc$1.href) || !urlUtils$1.isOriginEqual(baseUrl, loc$1.href)) {
            throw new Error("Can't connect to different domain from within an iframe. (" + loc$1.href + ", " + transUrl + ", " + baseUrl + ")");
          }
          facade2 = new FacadeJS(new transportMap[transport2](transUrl, baseUrl));
          break;
        case "m":
          facade2._send(iframeMessage.data);
          break;
        case "c":
          if (facade2) {
            facade2._close();
          }
          facade2 = null;
          break;
      }
    };
    eventUtils$1.attachEvent("message", onMessage);
    iframeUtils.postMessage("s");
  };
};
var URL$1 = urlParse, inherits = inherits_browserExports, random = random$5, escape = _escape, urlUtils = url, eventUtils = eventExports, transport = transport$1, objectUtils = object, browser = browser$4, log = log$1, Event$1 = event, EventTarget = eventtarget, loc = location, CloseEvent = close, TransportMessageEvent = transMessage, InfoReceiver = infoReceiver;
var debug = function() {
};
var transports;
function SockJS$1(url2, protocols, options) {
  if (!(this instanceof SockJS$1)) {
    return new SockJS$1(url2, protocols, options);
  }
  if (arguments.length < 1) {
    throw new TypeError("Failed to construct 'SockJS: 1 argument required, but only 0 present");
  }
  EventTarget.call(this);
  this.readyState = SockJS$1.CONNECTING;
  this.extensions = "";
  this.protocol = "";
  options = options || {};
  if (options.protocols_whitelist) {
    log.warn("'protocols_whitelist' is DEPRECATED. Use 'transports' instead.");
  }
  this._transportsWhitelist = options.transports;
  this._transportOptions = options.transportOptions || {};
  this._timeout = options.timeout || 0;
  var sessionId = options.sessionId || 8;
  if (typeof sessionId === "function") {
    this._generateSessionId = sessionId;
  } else if (typeof sessionId === "number") {
    this._generateSessionId = function() {
      return random.string(sessionId);
    };
  } else {
    throw new TypeError("If sessionId is used in the options, it needs to be a number or a function.");
  }
  this._server = options.server || random.numberString(1e3);
  var parsedUrl = new URL$1(url2);
  if (!parsedUrl.host || !parsedUrl.protocol) {
    throw new SyntaxError("The URL '" + url2 + "' is invalid");
  } else if (parsedUrl.hash) {
    throw new SyntaxError("The URL must not contain a fragment");
  } else if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new SyntaxError("The URL's scheme must be either 'http:' or 'https:'. '" + parsedUrl.protocol + "' is not allowed.");
  }
  var secure = parsedUrl.protocol === "https:";
  if (loc.protocol === "https:" && !secure) {
    if (!urlUtils.isLoopbackAddr(parsedUrl.hostname)) {
      throw new Error("SecurityError: An insecure SockJS connection may not be initiated from a page loaded over HTTPS");
    }
  }
  if (!protocols) {
    protocols = [];
  } else if (!Array.isArray(protocols)) {
    protocols = [protocols];
  }
  var sortedProtocols = protocols.sort();
  sortedProtocols.forEach(function(proto, i2) {
    if (!proto) {
      throw new SyntaxError("The protocols entry '" + proto + "' is invalid.");
    }
    if (i2 < sortedProtocols.length - 1 && proto === sortedProtocols[i2 + 1]) {
      throw new SyntaxError("The protocols entry '" + proto + "' is duplicated.");
    }
  });
  var o3 = urlUtils.getOrigin(loc.href);
  this._origin = o3 ? o3.toLowerCase() : null;
  parsedUrl.set("pathname", parsedUrl.pathname.replace(/\/+$/, ""));
  this.url = parsedUrl.href;
  debug("using url", this.url);
  this._urlInfo = {
    nullOrigin: !browser.hasDomain(),
    sameOrigin: urlUtils.isOriginEqual(this.url, loc.href),
    sameScheme: urlUtils.isSchemeEqual(this.url, loc.href)
  };
  this._ir = new InfoReceiver(this.url, this._urlInfo);
  this._ir.once("finish", this._receiveInfo.bind(this));
}
inherits(SockJS$1, EventTarget);
function userSetCode(code) {
  return code === 1e3 || code >= 3e3 && code <= 4999;
}
SockJS$1.prototype.close = function(code, reason) {
  if (code && !userSetCode(code)) {
    throw new Error("InvalidAccessError: Invalid code");
  }
  if (reason && reason.length > 123) {
    throw new SyntaxError("reason argument has an invalid length");
  }
  if (this.readyState === SockJS$1.CLOSING || this.readyState === SockJS$1.CLOSED) {
    return;
  }
  var wasClean = true;
  this._close(code || 1e3, reason || "Normal closure", wasClean);
};
SockJS$1.prototype.send = function(data) {
  if (typeof data !== "string") {
    data = "" + data;
  }
  if (this.readyState === SockJS$1.CONNECTING) {
    throw new Error("InvalidStateError: The connection has not been established yet");
  }
  if (this.readyState !== SockJS$1.OPEN) {
    return;
  }
  this._transport.send(escape.quote(data));
};
SockJS$1.version = version$1;
SockJS$1.CONNECTING = 0;
SockJS$1.OPEN = 1;
SockJS$1.CLOSING = 2;
SockJS$1.CLOSED = 3;
SockJS$1.prototype._receiveInfo = function(info, rtt) {
  this._ir = null;
  if (!info) {
    this._close(1002, "Cannot connect to server");
    return;
  }
  this._rto = this.countRTO(rtt);
  this._transUrl = info.base_url ? info.base_url : this.url;
  info = objectUtils.extend(info, this._urlInfo);
  var enabledTransports = transports.filterToEnabled(this._transportsWhitelist, info);
  this._transports = enabledTransports.main;
  debug(this._transports.length + " enabled transports");
  this._connect();
};
SockJS$1.prototype._connect = function() {
  for (var Transport = this._transports.shift(); Transport; Transport = this._transports.shift()) {
    debug("attempt", Transport.transportName);
    if (Transport.needBody) {
      if (!globalThis.document.body || typeof globalThis.document.readyState !== "undefined" && globalThis.document.readyState !== "complete" && globalThis.document.readyState !== "interactive") {
        this._transports.unshift(Transport);
        eventUtils.attachEvent("load", this._connect.bind(this));
        return;
      }
    }
    var timeoutMs = Math.max(this._timeout, this._rto * Transport.roundTrips || 5e3);
    this._transportTimeoutId = setTimeout(this._transportTimeout.bind(this), timeoutMs);
    var transportUrl = urlUtils.addPath(this._transUrl, "/" + this._server + "/" + this._generateSessionId());
    var options = this._transportOptions[Transport.transportName];
    var transportObj = new Transport(transportUrl, this._transUrl, options);
    transportObj.on("message", this._transportMessage.bind(this));
    transportObj.once("close", this._transportClose.bind(this));
    transportObj.transportName = Transport.transportName;
    this._transport = transportObj;
    return;
  }
  this._close(2e3, "All transports failed", false);
};
SockJS$1.prototype._transportTimeout = function() {
  if (this.readyState === SockJS$1.CONNECTING) {
    if (this._transport) {
      this._transport.close();
    }
    this._transportClose(2007, "Transport timed out");
  }
};
SockJS$1.prototype._transportMessage = function(msg) {
  var self2 = this, type = msg.slice(0, 1), content = msg.slice(1), payload;
  switch (type) {
    case "o":
      this._open();
      return;
    case "h":
      this.dispatchEvent(new Event$1("heartbeat"));
      debug("heartbeat", this.transport);
      return;
  }
  if (content) {
    try {
      payload = JSON.parse(content);
    } catch (e2) {
    }
  }
  if (typeof payload === "undefined") {
    return;
  }
  switch (type) {
    case "a":
      if (Array.isArray(payload)) {
        payload.forEach(function(p2) {
          debug("message", self2.transport);
          self2.dispatchEvent(new TransportMessageEvent(p2));
        });
      }
      break;
    case "m":
      debug("message", this.transport);
      this.dispatchEvent(new TransportMessageEvent(payload));
      break;
    case "c":
      if (Array.isArray(payload) && payload.length === 2) {
        this._close(payload[0], payload[1], true);
      }
      break;
  }
};
SockJS$1.prototype._transportClose = function(code, reason) {
  debug("_transportClose", this.transport);
  if (this._transport) {
    this._transport.removeAllListeners();
    this._transport = null;
    this.transport = null;
  }
  if (!userSetCode(code) && code !== 2e3 && this.readyState === SockJS$1.CONNECTING) {
    this._connect();
    return;
  }
  this._close(code, reason);
};
SockJS$1.prototype._open = function() {
  debug("_open", this._transport && this._transport.transportName, this.readyState);
  if (this.readyState === SockJS$1.CONNECTING) {
    if (this._transportTimeoutId) {
      clearTimeout(this._transportTimeoutId);
      this._transportTimeoutId = null;
    }
    this.readyState = SockJS$1.OPEN;
    this.transport = this._transport.transportName;
    this.dispatchEvent(new Event$1("open"));
    debug("connected", this.transport);
  } else {
    this._close(1006, "Server lost session");
  }
};
SockJS$1.prototype._close = function(code, reason, wasClean) {
  debug("_close", this.transport, code, reason, wasClean, this.readyState);
  var forceFail = false;
  if (this._ir) {
    forceFail = true;
    this._ir.close();
    this._ir = null;
  }
  if (this._transport) {
    this._transport.close();
    this._transport = null;
    this.transport = null;
  }
  if (this.readyState === SockJS$1.CLOSED) {
    throw new Error("InvalidStateError: SockJS has already been closed");
  }
  this.readyState = SockJS$1.CLOSING;
  setTimeout((function() {
    this.readyState = SockJS$1.CLOSED;
    if (forceFail) {
      this.dispatchEvent(new Event$1("error"));
    }
    var e2 = new CloseEvent();
    e2.wasClean = wasClean || false;
    e2.code = code || 1e3;
    e2.reason = reason;
    this.dispatchEvent(e2);
    this.onmessage = this.onclose = this.onerror = null;
  }).bind(this), 0);
};
SockJS$1.prototype.countRTO = function(rtt) {
  if (rtt > 100) {
    return 4 * rtt;
  }
  return 300 + rtt;
};
var main = function(availableTransports) {
  transports = transport(availableTransports);
  iframeBootstrap(SockJS$1, availableTransports);
  return SockJS$1;
};
var transportList = transportList$1;
var entry = main(transportList);
if ("_sockjs_onload" in globalThis) {
  setTimeout(globalThis._sockjs_onload, 1);
}
const SockJS = /* @__PURE__ */ getDefaultExportFromCjs(entry);
function augmentWebsocket(webSocket, debug2) {
  webSocket.terminate = function() {
    const noOp = () => {
    };
    this.onerror = noOp;
    this.onmessage = noOp;
    this.onopen = noOp;
    const ts = /* @__PURE__ */ new Date();
    const id2 = Math.random().toString().substring(2, 8);
    const origOnClose = this.onclose;
    this.onclose = (closeEvent) => {
      const delay = (/* @__PURE__ */ new Date()).getTime() - ts.getTime();
      debug2(`Discarded socket (#${id2})  closed after ${delay}ms, with code/reason: ${closeEvent.code}/${closeEvent.reason}`);
    };
    this.close();
    origOnClose == null ? void 0 : origOnClose.call(webSocket, {
      code: 4001,
      reason: `Quick discarding socket (#${id2}) without waiting for the shutdown sequence.`,
      wasClean: false
    });
  };
}
const BYTE = {
  // LINEFEED byte (octet 10)
  LF: "\n",
  // NULL byte (octet 0)
  NULL: "\0"
};
class FrameImpl {
  /**
   * body of the frame
   */
  get body() {
    if (!this._body && this.isBinaryBody) {
      this._body = new TextDecoder().decode(this._binaryBody);
    }
    return this._body || "";
  }
  /**
   * body as Uint8Array
   */
  get binaryBody() {
    if (!this._binaryBody && !this.isBinaryBody) {
      this._binaryBody = new TextEncoder().encode(this._body);
    }
    return this._binaryBody;
  }
  /**
   * Frame constructor. `command`, `headers` and `body` are available as properties.
   *
   * @internal
   */
  constructor(params) {
    const { command, headers, body, binaryBody, escapeHeaderValues, skipContentLengthHeader } = params;
    this.command = command;
    this.headers = Object.assign({}, headers || {});
    if (binaryBody) {
      this._binaryBody = binaryBody;
      this.isBinaryBody = true;
    } else {
      this._body = body || "";
      this.isBinaryBody = false;
    }
    this.escapeHeaderValues = escapeHeaderValues || false;
    this.skipContentLengthHeader = skipContentLengthHeader || false;
  }
  /**
   * deserialize a STOMP Frame from raw data.
   *
   * @internal
   */
  static fromRawFrame(rawFrame, escapeHeaderValues) {
    const headers = {};
    const trim2 = (str) => str.replace(/^\s+|\s+$/g, "");
    for (const header of rawFrame.headers.reverse()) {
      header.indexOf(":");
      const key = trim2(header[0]);
      let value = trim2(header[1]);
      if (escapeHeaderValues && rawFrame.command !== "CONNECT" && rawFrame.command !== "CONNECTED") {
        value = FrameImpl.hdrValueUnEscape(value);
      }
      headers[key] = value;
    }
    return new FrameImpl({
      command: rawFrame.command,
      headers,
      binaryBody: rawFrame.binaryBody,
      escapeHeaderValues
    });
  }
  /**
   * @internal
   */
  toString() {
    return this.serializeCmdAndHeaders();
  }
  /**
   * serialize this Frame in a format suitable to be passed to WebSocket.
   * If the body is string the output will be string.
   * If the body is binary (i.e. of type Unit8Array) it will be serialized to ArrayBuffer.
   *
   * @internal
   */
  serialize() {
    const cmdAndHeaders = this.serializeCmdAndHeaders();
    if (this.isBinaryBody) {
      return FrameImpl.toUnit8Array(cmdAndHeaders, this._binaryBody).buffer;
    } else {
      return cmdAndHeaders + this._body + BYTE.NULL;
    }
  }
  serializeCmdAndHeaders() {
    const lines = [this.command];
    if (this.skipContentLengthHeader) {
      delete this.headers["content-length"];
    }
    for (const name of Object.keys(this.headers || {})) {
      const value = this.headers[name];
      if (this.escapeHeaderValues && this.command !== "CONNECT" && this.command !== "CONNECTED") {
        lines.push(`${name}:${FrameImpl.hdrValueEscape(`${value}`)}`);
      } else {
        lines.push(`${name}:${value}`);
      }
    }
    if (this.isBinaryBody || !this.isBodyEmpty() && !this.skipContentLengthHeader) {
      lines.push(`content-length:${this.bodyLength()}`);
    }
    return lines.join(BYTE.LF) + BYTE.LF + BYTE.LF;
  }
  isBodyEmpty() {
    return this.bodyLength() === 0;
  }
  bodyLength() {
    const binaryBody = this.binaryBody;
    return binaryBody ? binaryBody.length : 0;
  }
  /**
   * Compute the size of a UTF-8 string by counting its number of bytes
   * (and not the number of characters composing the string)
   */
  static sizeOfUTF8(s2) {
    return s2 ? new TextEncoder().encode(s2).length : 0;
  }
  static toUnit8Array(cmdAndHeaders, binaryBody) {
    const uint8CmdAndHeaders = new TextEncoder().encode(cmdAndHeaders);
    const nullTerminator = new Uint8Array([0]);
    const uint8Frame = new Uint8Array(uint8CmdAndHeaders.length + binaryBody.length + nullTerminator.length);
    uint8Frame.set(uint8CmdAndHeaders);
    uint8Frame.set(binaryBody, uint8CmdAndHeaders.length);
    uint8Frame.set(nullTerminator, uint8CmdAndHeaders.length + binaryBody.length);
    return uint8Frame;
  }
  /**
   * Serialize a STOMP frame as per STOMP standards, suitable to be sent to the STOMP broker.
   *
   * @internal
   */
  static marshall(params) {
    const frame = new FrameImpl(params);
    return frame.serialize();
  }
  /**
   *  Escape header values
   */
  static hdrValueEscape(str) {
    return str.replace(/\\/g, "\\\\").replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/:/g, "\\c");
  }
  /**
   * UnEscape header values
   */
  static hdrValueUnEscape(str) {
    return str.replace(/\\r/g, "\r").replace(/\\n/g, "\n").replace(/\\c/g, ":").replace(/\\\\/g, "\\");
  }
}
const NULL = 0;
const LF = 10;
const CR = 13;
const COLON = 58;
class Parser {
  constructor(onFrame, onIncomingPing) {
    this.onFrame = onFrame;
    this.onIncomingPing = onIncomingPing;
    this._encoder = new TextEncoder();
    this._decoder = new TextDecoder();
    this._token = [];
    this._initState();
  }
  parseChunk(segment, appendMissingNULLonIncoming = false) {
    let chunk;
    if (typeof segment === "string") {
      chunk = this._encoder.encode(segment);
    } else {
      chunk = new Uint8Array(segment);
    }
    if (appendMissingNULLonIncoming && chunk[chunk.length - 1] !== 0) {
      const chunkWithNull = new Uint8Array(chunk.length + 1);
      chunkWithNull.set(chunk, 0);
      chunkWithNull[chunk.length] = 0;
      chunk = chunkWithNull;
    }
    for (let i2 = 0; i2 < chunk.length; i2++) {
      const byte = chunk[i2];
      this._onByte(byte);
    }
  }
  // The following implements a simple Rec Descent Parser.
  // The grammar is simple and just one byte tells what should be the next state
  _collectFrame(byte) {
    if (byte === NULL) {
      return;
    }
    if (byte === CR) {
      return;
    }
    if (byte === LF) {
      this.onIncomingPing();
      return;
    }
    this._onByte = this._collectCommand;
    this._reinjectByte(byte);
  }
  _collectCommand(byte) {
    if (byte === CR) {
      return;
    }
    if (byte === LF) {
      this._results.command = this._consumeTokenAsUTF8();
      this._onByte = this._collectHeaders;
      return;
    }
    this._consumeByte(byte);
  }
  _collectHeaders(byte) {
    if (byte === CR) {
      return;
    }
    if (byte === LF) {
      this._setupCollectBody();
      return;
    }
    this._onByte = this._collectHeaderKey;
    this._reinjectByte(byte);
  }
  _reinjectByte(byte) {
    this._onByte(byte);
  }
  _collectHeaderKey(byte) {
    if (byte === COLON) {
      this._headerKey = this._consumeTokenAsUTF8();
      this._onByte = this._collectHeaderValue;
      return;
    }
    this._consumeByte(byte);
  }
  _collectHeaderValue(byte) {
    if (byte === CR) {
      return;
    }
    if (byte === LF) {
      this._results.headers.push([
        this._headerKey,
        this._consumeTokenAsUTF8()
      ]);
      this._headerKey = void 0;
      this._onByte = this._collectHeaders;
      return;
    }
    this._consumeByte(byte);
  }
  _setupCollectBody() {
    const contentLengthHeader = this._results.headers.filter((header) => {
      return header[0] === "content-length";
    })[0];
    if (contentLengthHeader) {
      this._bodyBytesRemaining = parseInt(contentLengthHeader[1], 10);
      this._onByte = this._collectBodyFixedSize;
    } else {
      this._onByte = this._collectBodyNullTerminated;
    }
  }
  _collectBodyNullTerminated(byte) {
    if (byte === NULL) {
      this._retrievedBody();
      return;
    }
    this._consumeByte(byte);
  }
  _collectBodyFixedSize(byte) {
    if (this._bodyBytesRemaining-- === 0) {
      this._retrievedBody();
      return;
    }
    this._consumeByte(byte);
  }
  _retrievedBody() {
    this._results.binaryBody = this._consumeTokenAsRaw();
    try {
      this.onFrame(this._results);
    } catch (e2) {
      console.log(`Ignoring an exception thrown by a frame handler. Original exception: `, e2);
    }
    this._initState();
  }
  // Rec Descent Parser helpers
  _consumeByte(byte) {
    this._token.push(byte);
  }
  _consumeTokenAsUTF8() {
    return this._decoder.decode(this._consumeTokenAsRaw());
  }
  _consumeTokenAsRaw() {
    const rawResult = new Uint8Array(this._token);
    this._token = [];
    return rawResult;
  }
  _initState() {
    this._results = {
      command: void 0,
      headers: [],
      binaryBody: void 0
    };
    this._token = [];
    this._headerKey = void 0;
    this._onByte = this._collectFrame;
  }
}
var StompSocketState;
(function(StompSocketState2) {
  StompSocketState2[StompSocketState2["CONNECTING"] = 0] = "CONNECTING";
  StompSocketState2[StompSocketState2["OPEN"] = 1] = "OPEN";
  StompSocketState2[StompSocketState2["CLOSING"] = 2] = "CLOSING";
  StompSocketState2[StompSocketState2["CLOSED"] = 3] = "CLOSED";
})(StompSocketState || (StompSocketState = {}));
var ActivationState;
(function(ActivationState2) {
  ActivationState2[ActivationState2["ACTIVE"] = 0] = "ACTIVE";
  ActivationState2[ActivationState2["DEACTIVATING"] = 1] = "DEACTIVATING";
  ActivationState2[ActivationState2["INACTIVE"] = 2] = "INACTIVE";
})(ActivationState || (ActivationState = {}));
var ReconnectionTimeMode;
(function(ReconnectionTimeMode2) {
  ReconnectionTimeMode2[ReconnectionTimeMode2["LINEAR"] = 0] = "LINEAR";
  ReconnectionTimeMode2[ReconnectionTimeMode2["EXPONENTIAL"] = 1] = "EXPONENTIAL";
})(ReconnectionTimeMode || (ReconnectionTimeMode = {}));
var TickerStrategy;
(function(TickerStrategy2) {
  TickerStrategy2["Interval"] = "interval";
  TickerStrategy2["Worker"] = "worker";
})(TickerStrategy || (TickerStrategy = {}));
class Ticker {
  constructor(_interval, _strategy = TickerStrategy.Interval, _debug) {
    this._interval = _interval;
    this._strategy = _strategy;
    this._debug = _debug;
    this._workerScript = `
    var startTime = Date.now();
    setInterval(function() {
        self.postMessage(Date.now() - startTime);
    }, ${this._interval});
  `;
  }
  start(tick) {
    this.stop();
    if (this.shouldUseWorker()) {
      this.runWorker(tick);
    } else {
      this.runInterval(tick);
    }
  }
  stop() {
    this.disposeWorker();
    this.disposeInterval();
  }
  shouldUseWorker() {
    return typeof Worker !== "undefined" && this._strategy === TickerStrategy.Worker;
  }
  runWorker(tick) {
    this._debug("Using runWorker for outgoing pings");
    if (!this._worker) {
      this._worker = new Worker(URL.createObjectURL(new Blob([this._workerScript], { type: "text/javascript" })));
      this._worker.onmessage = (message) => tick(message.data);
    }
  }
  runInterval(tick) {
    this._debug("Using runInterval for outgoing pings");
    if (!this._timer) {
      const startTime = Date.now();
      this._timer = setInterval(() => {
        tick(Date.now() - startTime);
      }, this._interval);
    }
  }
  disposeWorker() {
    if (this._worker) {
      this._worker.terminate();
      delete this._worker;
      this._debug("Outgoing ping disposeWorker");
    }
  }
  disposeInterval() {
    if (this._timer) {
      clearInterval(this._timer);
      delete this._timer;
      this._debug("Outgoing ping disposeInterval");
    }
  }
}
class Versions {
  /**
   * Takes an array of versions, typical elements '1.2', '1.1', or '1.0'
   *
   * You will be creating an instance of this class if you want to override
   * supported versions to be declared during STOMP handshake.
   */
  constructor(versions) {
    this.versions = versions;
  }
  /**
   * Used as part of CONNECT STOMP Frame
   */
  supportedVersions() {
    return this.versions.join(",");
  }
  /**
   * Used while creating a WebSocket
   */
  protocolVersions() {
    return this.versions.map((x2) => `v${x2.replace(".", "")}.stomp`);
  }
}
Versions.V1_0 = "1.0";
Versions.V1_1 = "1.1";
Versions.V1_2 = "1.2";
Versions.default = new Versions([
  Versions.V1_2,
  Versions.V1_1,
  Versions.V1_0
]);
class StompHandler {
  get connectedVersion() {
    return this._connectedVersion;
  }
  get connected() {
    return this._connected;
  }
  constructor(_client, _webSocket, config) {
    this._client = _client;
    this._webSocket = _webSocket;
    this._connected = false;
    this._serverFrameHandlers = {
      // [CONNECTED Frame](https://stomp.github.com/stomp-specification-1.2.html#CONNECTED_Frame)
      CONNECTED: (frame) => {
        this.debug(`connected to server ${frame.headers.server}`);
        this._connected = true;
        this._connectedVersion = frame.headers.version;
        if (this._connectedVersion === Versions.V1_2) {
          this._escapeHeaderValues = true;
        }
        this._setupHeartbeat(frame.headers);
        this.onConnect(frame);
      },
      // [MESSAGE Frame](https://stomp.github.com/stomp-specification-1.2.html#MESSAGE)
      MESSAGE: (frame) => {
        const subscription = frame.headers.subscription;
        const onReceive = this._subscriptions[subscription] || this.onUnhandledMessage;
        const message = frame;
        const client2 = this;
        const messageId = this._connectedVersion === Versions.V1_2 ? message.headers.ack : message.headers["message-id"];
        message.ack = (headers = {}) => {
          return client2.ack(messageId, subscription, headers);
        };
        message.nack = (headers = {}) => {
          return client2.nack(messageId, subscription, headers);
        };
        onReceive(message);
      },
      // [RECEIPT Frame](https://stomp.github.com/stomp-specification-1.2.html#RECEIPT)
      RECEIPT: (frame) => {
        const callback = this._receiptWatchers[frame.headers["receipt-id"]];
        if (callback) {
          callback(frame);
          delete this._receiptWatchers[frame.headers["receipt-id"]];
        } else {
          this.onUnhandledReceipt(frame);
        }
      },
      // [ERROR Frame](https://stomp.github.com/stomp-specification-1.2.html#ERROR)
      ERROR: (frame) => {
        this.onStompError(frame);
      }
    };
    this._counter = 0;
    this._subscriptions = {};
    this._receiptWatchers = {};
    this._partialData = "";
    this._escapeHeaderValues = false;
    this._lastServerActivityTS = Date.now();
    this.debug = config.debug;
    this.stompVersions = config.stompVersions;
    this.connectHeaders = config.connectHeaders;
    this.disconnectHeaders = config.disconnectHeaders;
    this.heartbeatIncoming = config.heartbeatIncoming;
    this.heartbeatToleranceMultiplier = config.heartbeatGracePeriods;
    this.heartbeatOutgoing = config.heartbeatOutgoing;
    this.splitLargeFrames = config.splitLargeFrames;
    this.maxWebSocketChunkSize = config.maxWebSocketChunkSize;
    this.forceBinaryWSFrames = config.forceBinaryWSFrames;
    this.logRawCommunication = config.logRawCommunication;
    this.appendMissingNULLonIncoming = config.appendMissingNULLonIncoming;
    this.discardWebsocketOnCommFailure = config.discardWebsocketOnCommFailure;
    this.onConnect = config.onConnect;
    this.onDisconnect = config.onDisconnect;
    this.onStompError = config.onStompError;
    this.onWebSocketClose = config.onWebSocketClose;
    this.onWebSocketError = config.onWebSocketError;
    this.onUnhandledMessage = config.onUnhandledMessage;
    this.onUnhandledReceipt = config.onUnhandledReceipt;
    this.onUnhandledFrame = config.onUnhandledFrame;
    this.onHeartbeatReceived = config.onHeartbeatReceived;
    this.onHeartbeatLost = config.onHeartbeatLost;
  }
  start() {
    const parser = new Parser(
      // On Frame
      (rawFrame) => {
        const frame = FrameImpl.fromRawFrame(rawFrame, this._escapeHeaderValues);
        if (!this.logRawCommunication) {
          this.debug(`<<< ${frame}`);
        }
        const serverFrameHandler = this._serverFrameHandlers[frame.command] || this.onUnhandledFrame;
        serverFrameHandler(frame);
      },
      // On Incoming Ping
      () => {
        this.debug("<<< PONG");
        this.onHeartbeatReceived();
      }
    );
    this._webSocket.onmessage = (evt) => {
      this.debug("Received data");
      this._lastServerActivityTS = Date.now();
      if (this.logRawCommunication) {
        const rawChunkAsString = evt.data instanceof ArrayBuffer ? new TextDecoder().decode(evt.data) : evt.data;
        this.debug(`<<< ${rawChunkAsString}`);
      }
      parser.parseChunk(evt.data, this.appendMissingNULLonIncoming);
    };
    this._webSocket.onclose = (closeEvent) => {
      this.debug(`Connection closed to ${this._webSocket.url}`);
      this._cleanUp();
      this.onWebSocketClose(closeEvent);
    };
    this._webSocket.onerror = (errorEvent) => {
      this.onWebSocketError(errorEvent);
    };
    this._webSocket.onopen = () => {
      const connectHeaders = Object.assign({}, this.connectHeaders);
      this.debug("Web Socket Opened...");
      connectHeaders["accept-version"] = this.stompVersions.supportedVersions();
      connectHeaders["heart-beat"] = [
        this.heartbeatOutgoing,
        this.heartbeatIncoming
      ].join(",");
      this._transmit({ command: "CONNECT", headers: connectHeaders });
    };
  }
  _setupHeartbeat(headers) {
    if (headers.version !== Versions.V1_1 && headers.version !== Versions.V1_2) {
      return;
    }
    if (!headers["heart-beat"]) {
      return;
    }
    const [serverOutgoing, serverIncoming] = headers["heart-beat"].split(",").map((v2) => parseInt(v2, 10));
    if (this.heartbeatOutgoing !== 0 && serverIncoming !== 0) {
      const ttl = Math.max(this.heartbeatOutgoing, serverIncoming);
      this.debug(`send PING every ${ttl}ms`);
      this._pinger = new Ticker(ttl, this._client.heartbeatStrategy, this.debug);
      this._pinger.start(() => {
        if (this._webSocket.readyState === StompSocketState.OPEN) {
          this._webSocket.send(BYTE.LF);
          this.debug(">>> PING");
        }
      });
    }
    if (this.heartbeatIncoming !== 0 && serverOutgoing !== 0) {
      const ttl = Math.max(this.heartbeatIncoming, serverOutgoing);
      this.debug(`check PONG every ${ttl}ms`);
      this._ponger = setInterval(() => {
        const delta = Date.now() - this._lastServerActivityTS;
        if (delta > ttl * this.heartbeatToleranceMultiplier) {
          this.debug(`did not receive server activity for the last ${delta}ms`);
          this.onHeartbeatLost();
          this._closeOrDiscardWebsocket();
        }
      }, ttl);
    }
  }
  _closeOrDiscardWebsocket() {
    if (this.discardWebsocketOnCommFailure) {
      this.debug("Discarding websocket, the underlying socket may linger for a while");
      this.discardWebsocket();
    } else {
      this.debug("Issuing close on the websocket");
      this._closeWebsocket();
    }
  }
  forceDisconnect() {
    if (this._webSocket) {
      if (this._webSocket.readyState === StompSocketState.CONNECTING || this._webSocket.readyState === StompSocketState.OPEN) {
        this._closeOrDiscardWebsocket();
      }
    }
  }
  _closeWebsocket() {
    this._webSocket.onmessage = () => {
    };
    this._webSocket.close();
  }
  discardWebsocket() {
    if (typeof this._webSocket.terminate !== "function") {
      augmentWebsocket(this._webSocket, (msg) => this.debug(msg));
    }
    this._webSocket.terminate();
  }
  _transmit(params) {
    const { command, headers, body, binaryBody, skipContentLengthHeader } = params;
    const frame = new FrameImpl({
      command,
      headers,
      body,
      binaryBody,
      escapeHeaderValues: this._escapeHeaderValues,
      skipContentLengthHeader
    });
    let rawChunk = frame.serialize();
    if (this.logRawCommunication) {
      this.debug(`>>> ${rawChunk}`);
    } else {
      this.debug(`>>> ${frame}`);
    }
    if (this.forceBinaryWSFrames && typeof rawChunk === "string") {
      rawChunk = new TextEncoder().encode(rawChunk);
    }
    if (typeof rawChunk !== "string" || !this.splitLargeFrames) {
      this._webSocket.send(rawChunk);
    } else {
      let out = rawChunk;
      while (out.length > 0) {
        const chunk = out.substring(0, this.maxWebSocketChunkSize);
        out = out.substring(this.maxWebSocketChunkSize);
        this._webSocket.send(chunk);
        this.debug(`chunk sent = ${chunk.length}, remaining = ${out.length}`);
      }
    }
  }
  dispose() {
    if (this.connected) {
      try {
        const disconnectHeaders = Object.assign({}, this.disconnectHeaders);
        if (!disconnectHeaders.receipt) {
          disconnectHeaders.receipt = `close-${this._counter++}`;
        }
        this.watchForReceipt(disconnectHeaders.receipt, (frame) => {
          this._closeWebsocket();
          this._cleanUp();
          this.onDisconnect(frame);
        });
        this._transmit({ command: "DISCONNECT", headers: disconnectHeaders });
      } catch (error) {
        this.debug(`Ignoring error during disconnect ${error}`);
      }
    } else {
      if (this._webSocket.readyState === StompSocketState.CONNECTING || this._webSocket.readyState === StompSocketState.OPEN) {
        this._closeWebsocket();
      }
    }
  }
  _cleanUp() {
    this._connected = false;
    if (this._pinger) {
      this._pinger.stop();
      this._pinger = void 0;
    }
    if (this._ponger) {
      clearInterval(this._ponger);
      this._ponger = void 0;
    }
  }
  publish(params) {
    const { destination, headers, body, binaryBody, skipContentLengthHeader } = params;
    const hdrs = Object.assign({ destination }, headers);
    this._transmit({
      command: "SEND",
      headers: hdrs,
      body,
      binaryBody,
      skipContentLengthHeader
    });
  }
  watchForReceipt(receiptId, callback) {
    this._receiptWatchers[receiptId] = callback;
  }
  subscribe(destination, callback, headers = {}) {
    headers = Object.assign({}, headers);
    if (!headers.id) {
      headers.id = `sub-${this._counter++}`;
    }
    headers.destination = destination;
    this._subscriptions[headers.id] = callback;
    this._transmit({ command: "SUBSCRIBE", headers });
    const client2 = this;
    return {
      id: headers.id,
      unsubscribe(hdrs) {
        return client2.unsubscribe(headers.id, hdrs);
      }
    };
  }
  unsubscribe(id2, headers = {}) {
    headers = Object.assign({}, headers);
    delete this._subscriptions[id2];
    headers.id = id2;
    this._transmit({ command: "UNSUBSCRIBE", headers });
  }
  begin(transactionId) {
    const txId = transactionId || `tx-${this._counter++}`;
    this._transmit({
      command: "BEGIN",
      headers: {
        transaction: txId
      }
    });
    const client2 = this;
    return {
      id: txId,
      commit() {
        client2.commit(txId);
      },
      abort() {
        client2.abort(txId);
      }
    };
  }
  commit(transactionId) {
    this._transmit({
      command: "COMMIT",
      headers: {
        transaction: transactionId
      }
    });
  }
  abort(transactionId) {
    this._transmit({
      command: "ABORT",
      headers: {
        transaction: transactionId
      }
    });
  }
  ack(messageId, subscriptionId, headers = {}) {
    headers = Object.assign({}, headers);
    if (this._connectedVersion === Versions.V1_2) {
      headers.id = messageId;
    } else {
      headers["message-id"] = messageId;
    }
    headers.subscription = subscriptionId;
    this._transmit({ command: "ACK", headers });
  }
  nack(messageId, subscriptionId, headers = {}) {
    headers = Object.assign({}, headers);
    if (this._connectedVersion === Versions.V1_2) {
      headers.id = messageId;
    } else {
      headers["message-id"] = messageId;
    }
    headers.subscription = subscriptionId;
    return this._transmit({ command: "NACK", headers });
  }
}
class Client {
  /**
   * Provides access to the underlying WebSocket instance.
   * This property is **read-only**.
   *
   * Example:
   * ```javascript
   * const webSocket = client.webSocket;
   * if (webSocket) {
   *   console.log('WebSocket is connected:', webSocket.readyState === WebSocket.OPEN);
   * }
   * ```
   *
   * **Caution:**
   * Directly interacting with the WebSocket instance (e.g., sending or receiving frames)
   * can interfere with the proper functioning of this library. Such actions may cause
   * unexpected behavior, disconnections, or invalid state in the library's internal mechanisms.
   *
   * Instead, use the library's provided methods to manage STOMP communication.
   *
   * @returns The WebSocket instance used by the STOMP handler, or `undefined` if not connected.
   */
  get webSocket() {
    var _a;
    return (_a = this._stompHandler) == null ? void 0 : _a._webSocket;
  }
  /**
   * Allows customization of the disconnection headers.
   *
   * Any changes made during an active session will also be applied immediately.
   *
   * Example:
   * ```javascript
   * client.disconnectHeaders = {
   *   receipt: 'custom-receipt-id'
   * };
   * ```
   */
  get disconnectHeaders() {
    return this._disconnectHeaders;
  }
  set disconnectHeaders(value) {
    this._disconnectHeaders = value;
    if (this._stompHandler) {
      this._stompHandler.disconnectHeaders = this._disconnectHeaders;
    }
  }
  /**
   * Indicates whether there is an active connection to the STOMP broker.
   *
   * Usage:
   * ```javascript
   * if (client.connected) {
   *   console.log('Client is connected to the broker.');
   * } else {
   *   console.log('No connection to the broker.');
   * }
   * ```
   *
   * @returns `true` if the client is currently connected, `false` otherwise.
   */
  get connected() {
    return !!this._stompHandler && this._stompHandler.connected;
  }
  /**
   * The version of the STOMP protocol negotiated with the server during connection.
   *
   * This is a **read-only** property and reflects the negotiated protocol version after
   * a successful connection.
   *
   * Example:
   * ```javascript
   * console.log('Connected STOMP version:', client.connectedVersion);
   * ```
   *
   * @returns The negotiated STOMP protocol version or `undefined` if not connected.
   */
  get connectedVersion() {
    return this._stompHandler ? this._stompHandler.connectedVersion : void 0;
  }
  /**
   * Indicates whether the client is currently active.
   *
   * A client is considered active if it is connected or actively attempting to reconnect.
   *
   * Example:
   * ```javascript
   * if (client.active) {
   *   console.log('The client is active.');
   * } else {
   *   console.log('The client is inactive.');
   * }
   * ```
   *
   * @returns `true` if the client is active, otherwise `false`.
   */
  get active() {
    return this.state === ActivationState.ACTIVE;
  }
  _changeState(state) {
    this.state = state;
    this.onChangeState(state);
  }
  /**
   * Constructs a new STOMP client instance.
   *
   * The constructor initializes default values and sets up no-op callbacks for all events.
   * Configuration can be passed during construction, or updated later using `configure`.
   *
   * Example:
   * ```javascript
   * const client = new Client({
   *   brokerURL: 'wss://broker.example.com',
   *   reconnectDelay: 5000
   * });
   * ```
   *
   * @param conf Optional configuration object to initialize the client with.
   */
  constructor(conf = {}) {
    this.stompVersions = Versions.default;
    this.connectionTimeout = 0;
    this.reconnectDelay = 5e3;
    this._nextReconnectDelay = 0;
    this.maxReconnectDelay = 15 * 60 * 1e3;
    this.reconnectTimeMode = ReconnectionTimeMode.LINEAR;
    this.heartbeatIncoming = 1e4;
    this.heartbeatToleranceMultiplier = 2;
    this.heartbeatOutgoing = 1e4;
    this.heartbeatStrategy = TickerStrategy.Interval;
    this.splitLargeFrames = false;
    this.maxWebSocketChunkSize = 8 * 1024;
    this.forceBinaryWSFrames = false;
    this.appendMissingNULLonIncoming = false;
    this.discardWebsocketOnCommFailure = false;
    this.state = ActivationState.INACTIVE;
    const noOp = () => {
    };
    this.debug = noOp;
    this.beforeConnect = noOp;
    this.onConnect = noOp;
    this.onDisconnect = noOp;
    this.onUnhandledMessage = noOp;
    this.onUnhandledReceipt = noOp;
    this.onUnhandledFrame = noOp;
    this.onHeartbeatReceived = noOp;
    this.onHeartbeatLost = noOp;
    this.onStompError = noOp;
    this.onWebSocketClose = noOp;
    this.onWebSocketError = noOp;
    this.logRawCommunication = false;
    this.onChangeState = noOp;
    this.connectHeaders = {};
    this._disconnectHeaders = {};
    this.configure(conf);
  }
  /**
   * Updates the client's configuration.
   *
   * All properties in the provided configuration object will override the current settings.
   *
   * Additionally, a warning is logged if `maxReconnectDelay` is configured to a
   * value lower than `reconnectDelay`, and `maxReconnectDelay` is adjusted to match `reconnectDelay`.
   *
   * Example:
   * ```javascript
   * client.configure({
   *   reconnectDelay: 3000,
   *   maxReconnectDelay: 10000
   * });
   * ```
   *
   * @param conf Configuration object containing the new settings.
   */
  configure(conf) {
    Object.assign(this, conf);
    if (this.maxReconnectDelay > 0 && this.maxReconnectDelay < this.reconnectDelay) {
      this.debug(`Warning: maxReconnectDelay (${this.maxReconnectDelay}ms) is less than reconnectDelay (${this.reconnectDelay}ms). Using reconnectDelay as the maxReconnectDelay delay.`);
      this.maxReconnectDelay = this.reconnectDelay;
    }
  }
  /**
   * Activates the client, initiating a connection to the STOMP broker.
   *
   * On activation, the client attempts to connect and sets its state to `ACTIVE`. If the connection
   * is lost, it will automatically retry based on `reconnectDelay` or `maxReconnectDelay`. If
   * `reconnectTimeMode` is set to `EXPONENTIAL`, the reconnect delay increases exponentially.
   *
   * To stop reconnection attempts and disconnect, call [Client#deactivate]{@link Client#deactivate}.
   *
   * Example:
   * ```javascript
   * client.activate(); // Connect to the broker
   * ```
   *
   * If the client is currently `DEACTIVATING`, connection is delayed until the deactivation process completes.
   */
  activate() {
    const _activate = () => {
      if (this.active) {
        this.debug("Already ACTIVE, ignoring request to activate");
        return;
      }
      this._changeState(ActivationState.ACTIVE);
      this._nextReconnectDelay = this.reconnectDelay;
      this._connect();
    };
    if (this.state === ActivationState.DEACTIVATING) {
      this.debug("Waiting for deactivation to finish before activating");
      this.deactivate().then(() => {
        _activate();
      });
    } else {
      _activate();
    }
  }
  async _connect() {
    await this.beforeConnect(this);
    if (this._stompHandler) {
      this.debug("There is already a stompHandler, skipping the call to connect");
      return;
    }
    if (!this.active) {
      this.debug("Client has been marked inactive, will not attempt to connect");
      return;
    }
    if (this.connectionTimeout > 0) {
      if (this._connectionWatcher) {
        clearTimeout(this._connectionWatcher);
      }
      this._connectionWatcher = setTimeout(() => {
        if (this.connected) {
          return;
        }
        this.debug(`Connection not established in ${this.connectionTimeout}ms, closing socket`);
        this.forceDisconnect();
      }, this.connectionTimeout);
    }
    this.debug("Opening Web Socket...");
    const webSocket = this._createWebSocket();
    this._stompHandler = new StompHandler(this, webSocket, {
      debug: this.debug,
      stompVersions: this.stompVersions,
      connectHeaders: this.connectHeaders,
      disconnectHeaders: this._disconnectHeaders,
      heartbeatIncoming: this.heartbeatIncoming,
      heartbeatGracePeriods: this.heartbeatToleranceMultiplier,
      heartbeatOutgoing: this.heartbeatOutgoing,
      heartbeatStrategy: this.heartbeatStrategy,
      splitLargeFrames: this.splitLargeFrames,
      maxWebSocketChunkSize: this.maxWebSocketChunkSize,
      forceBinaryWSFrames: this.forceBinaryWSFrames,
      logRawCommunication: this.logRawCommunication,
      appendMissingNULLonIncoming: this.appendMissingNULLonIncoming,
      discardWebsocketOnCommFailure: this.discardWebsocketOnCommFailure,
      onConnect: (frame) => {
        if (this._connectionWatcher) {
          clearTimeout(this._connectionWatcher);
          this._connectionWatcher = void 0;
        }
        this._nextReconnectDelay = this.reconnectDelay;
        if (!this.active) {
          this.debug("STOMP got connected while deactivate was issued, will disconnect now");
          this._disposeStompHandler();
          return;
        }
        this.onConnect(frame);
      },
      onDisconnect: (frame) => {
        this.onDisconnect(frame);
      },
      onStompError: (frame) => {
        this.onStompError(frame);
      },
      onWebSocketClose: (evt) => {
        this._stompHandler = void 0;
        if (this.state === ActivationState.DEACTIVATING) {
          this._changeState(ActivationState.INACTIVE);
        }
        this.onWebSocketClose(evt);
        if (this.active) {
          this._schedule_reconnect();
        }
      },
      onWebSocketError: (evt) => {
        this.onWebSocketError(evt);
      },
      onUnhandledMessage: (message) => {
        this.onUnhandledMessage(message);
      },
      onUnhandledReceipt: (frame) => {
        this.onUnhandledReceipt(frame);
      },
      onUnhandledFrame: (frame) => {
        this.onUnhandledFrame(frame);
      },
      onHeartbeatReceived: () => {
        this.onHeartbeatReceived();
      },
      onHeartbeatLost: () => {
        this.onHeartbeatLost();
      }
    });
    this._stompHandler.start();
  }
  _createWebSocket() {
    let webSocket;
    if (this.webSocketFactory) {
      webSocket = this.webSocketFactory();
    } else if (this.brokerURL) {
      webSocket = new WebSocket(this.brokerURL, this.stompVersions.protocolVersions());
    } else {
      throw new Error("Either brokerURL or webSocketFactory must be provided");
    }
    webSocket.binaryType = "arraybuffer";
    return webSocket;
  }
  _schedule_reconnect() {
    if (this._nextReconnectDelay > 0) {
      this.debug(`STOMP: scheduling reconnection in ${this._nextReconnectDelay}ms`);
      this._reconnector = setTimeout(() => {
        if (this.reconnectTimeMode === ReconnectionTimeMode.EXPONENTIAL) {
          this._nextReconnectDelay = this._nextReconnectDelay * 2;
          if (this.maxReconnectDelay !== 0) {
            this._nextReconnectDelay = Math.min(this._nextReconnectDelay, this.maxReconnectDelay);
          }
        }
        this._connect();
      }, this._nextReconnectDelay);
    }
  }
  /**
   * Disconnects the client and stops the automatic reconnection loop.
   *
   * If there is an active STOMP connection at the time of invocation, the appropriate callbacks
   * will be triggered during the shutdown sequence. Once deactivated, the client will enter the
   * `INACTIVE` state, and no further reconnection attempts will be made.
   *
   * **Behavior**:
   * - If there is no active WebSocket connection, this method resolves immediately.
   * - If there is an active connection, the method waits for the underlying WebSocket
   *   to properly close before resolving.
   * - Multiple calls to this method are safe. Each invocation resolves upon completion.
   * - To reactivate, call [Client#activate]{@link Client#activate}.
   *
   * **Experimental Option:**
   * - By specifying the `force: true` option, the WebSocket connection is discarded immediately,
   *   bypassing both the STOMP and WebSocket shutdown sequences.
   * - **Caution:** Using `force: true` may leave the WebSocket in an inconsistent state,
   *   and brokers may not immediately detect the termination.
   *
   * Example:
   * ```javascript
   * // Graceful disconnect
   * await client.deactivate();
   *
   * // Forced disconnect to speed up shutdown when the connection is stale
   * await client.deactivate({ force: true });
   * ```
   *
   * @param options Configuration options for deactivation. Use `force: true` for immediate shutdown.
   * @returns A Promise that resolves when the deactivation process completes.
   */
  async deactivate(options = {}) {
    var _a;
    const force = options.force || false;
    const needToDispose = this.active;
    let retPromise;
    if (this.state === ActivationState.INACTIVE) {
      this.debug(`Already INACTIVE, nothing more to do`);
      return Promise.resolve();
    }
    this._changeState(ActivationState.DEACTIVATING);
    this._nextReconnectDelay = 0;
    if (this._reconnector) {
      clearTimeout(this._reconnector);
      this._reconnector = void 0;
    }
    if (this._stompHandler && // @ts-ignore - if there is a _stompHandler, there is the webSocket
    this.webSocket.readyState !== StompSocketState.CLOSED) {
      const origOnWebSocketClose = this._stompHandler.onWebSocketClose;
      retPromise = new Promise((resolve2, reject) => {
        this._stompHandler.onWebSocketClose = (evt) => {
          origOnWebSocketClose(evt);
          resolve2();
        };
      });
    } else {
      this._changeState(ActivationState.INACTIVE);
      return Promise.resolve();
    }
    if (force) {
      (_a = this._stompHandler) == null ? void 0 : _a.discardWebsocket();
    } else if (needToDispose) {
      this._disposeStompHandler();
    }
    return retPromise;
  }
  /**
   * Forces a disconnect by directly closing the WebSocket.
   *
   * Unlike a normal disconnect, this does not send a DISCONNECT sequence to the broker but
   * instead closes the WebSocket connection directly. After forcing a disconnect, the client
   * will automatically attempt to reconnect based on its `reconnectDelay` configuration.
   *
   * **Note:** To prevent further reconnect attempts, call [Client#deactivate]{@link Client#deactivate}.
   *
   * Example:
   * ```javascript
   * client.forceDisconnect();
   * ```
   */
  forceDisconnect() {
    if (this._stompHandler) {
      this._stompHandler.forceDisconnect();
    }
  }
  _disposeStompHandler() {
    if (this._stompHandler) {
      this._stompHandler.dispose();
    }
  }
  /**
   * Sends a message to the specified destination on the STOMP broker.
   *
   * The `body` must be a `string`. For non-string payloads (e.g., JSON), encode it as a string before sending.
   * If sending binary data, use the `binaryBody` parameter as a [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array).
   *
   * **Content-Length Behavior**:
   * - For non-binary messages, the `content-length` header is added by default.
   * - The `content-length` header can be skipped for text frames by setting `skipContentLengthHeader: true` in the parameters.
   * - For binary messages, the `content-length` header is always included.
   *
   * **Notes**:
   * - Ensure that brokers support binary frames before using `binaryBody`.
   * - Sending messages with NULL octets and missing `content-length` headers can cause brokers to disconnect and throw errors.
   *
   * Example:
   * ```javascript
   * // Basic text message
   * client.publish({ destination: "/queue/test", body: "Hello, STOMP" });
   *
   * // Text message with additional headers
   * client.publish({ destination: "/queue/test", headers: { priority: 9 }, body: "Hello, STOMP" });
   *
   * // Skip content-length header
   * client.publish({ destination: "/queue/test", body: "Hello, STOMP", skipContentLengthHeader: true });
   *
   * // Binary message
   * const binaryData = new Uint8Array([1, 2, 3, 4]);
   * client.publish({
   *   destination: '/topic/special',
   *   binaryBody: binaryData,
   *   headers: { 'content-type': 'application/octet-stream' }
   * });
   * ```
   */
  publish(params) {
    this._checkConnection();
    this._stompHandler.publish(params);
  }
  _checkConnection() {
    if (!this.connected) {
      throw new TypeError("There is no underlying STOMP connection");
    }
  }
  /**
   * Monitors for a receipt acknowledgment from the broker for specific operations.
   *
   * Add a `receipt` header to the operation (like subscribe or publish), and use this method with
   * the same receipt ID to detect when the broker has acknowledged the operation's completion.
   *
   * The callback is invoked with the corresponding {@link IFrame} when the receipt is received.
   *
   * Example:
   * ```javascript
   * const receiptId = "unique-receipt-id";
   *
   * client.watchForReceipt(receiptId, (frame) => {
   *   console.log("Operation acknowledged by the broker:", frame);
   * });
   *
   * // Attach the receipt header to an operation
   * client.publish({ destination: "/queue/test", headers: { receipt: receiptId }, body: "Hello" });
   * ```
   *
   * @param receiptId Unique identifier for the receipt.
   * @param callback Callback function invoked on receiving the RECEIPT frame.
   */
  watchForReceipt(receiptId, callback) {
    this._checkConnection();
    this._stompHandler.watchForReceipt(receiptId, callback);
  }
  /**
   * Subscribes to a destination on the STOMP broker.
   *
   * The callback is triggered for each message received from the subscribed destination. The message
   * is passed as an {@link IMessage} instance.
   *
   * **Subscription ID**:
   * - If no `id` is provided in `headers`, the library generates a unique subscription ID automatically.
   * - Provide an explicit `id` in `headers` if you wish to manage the subscription ID manually.
   *
   * Example:
   * ```javascript
   * const callback = (message) => {
   *   console.log("Received message:", message.body);
   * };
   *
   * // Auto-generated subscription ID
   * const subscription = client.subscribe("/queue/test", callback);
   *
   * // Explicit subscription ID
   * const mySubId = "my-subscription-id";
   * const subscription = client.subscribe("/queue/test", callback, { id: mySubId });
   * ```
   *
   * @param destination Destination to subscribe to.
   * @param callback Function invoked for each received message.
   * @param headers Optional headers for subscription, such as `id`.
   * @returns A {@link StompSubscription} which can be used to manage the subscription.
   */
  subscribe(destination, callback, headers = {}) {
    this._checkConnection();
    return this._stompHandler.subscribe(destination, callback, headers);
  }
  /**
   * Unsubscribes from a subscription on the STOMP broker.
   *
   * Prefer using the `unsubscribe` method directly on the {@link StompSubscription} returned from `subscribe` for cleaner management:
   * ```javascript
   * const subscription = client.subscribe("/queue/test", callback);
   * // Unsubscribe using the subscription object
   * subscription.unsubscribe();
   * ```
   *
   * This method can also be used directly with the subscription ID.
   *
   * Example:
   * ```javascript
   * client.unsubscribe("my-subscription-id");
   * ```
   *
   * @param id Subscription ID to unsubscribe.
   * @param headers Optional headers to pass for the UNSUBSCRIBE frame.
   */
  unsubscribe(id2, headers = {}) {
    this._checkConnection();
    this._stompHandler.unsubscribe(id2, headers);
  }
  /**
   * Starts a new transaction. The returned {@link ITransaction} object provides
   * methods for [commit]{@link ITransaction#commit} and [abort]{@link ITransaction#abort}.
   *
   * If `transactionId` is not provided, the library generates a unique ID internally.
   *
   * Example:
   * ```javascript
   * const tx = client.begin(); // Auto-generated ID
   *
   * // Or explicitly specify a transaction ID
   * const tx = client.begin("my-transaction-id");
   * ```
   *
   * @param transactionId Optional transaction ID.
   * @returns An instance of {@link ITransaction}.
   */
  begin(transactionId) {
    this._checkConnection();
    return this._stompHandler.begin(transactionId);
  }
  /**
   * Commits a transaction.
   *
   * It is strongly recommended to call [commit]{@link ITransaction#commit} on
   * the transaction object returned by [client#begin]{@link Client#begin}.
   *
   * Example:
   * ```javascript
   * const tx = client.begin();
   * // Perform operations under this transaction
   * tx.commit();
   * ```
   *
   * @param transactionId The ID of the transaction to commit.
   */
  commit(transactionId) {
    this._checkConnection();
    this._stompHandler.commit(transactionId);
  }
  /**
   * Aborts a transaction.
   *
   * It is strongly recommended to call [abort]{@link ITransaction#abort} directly
   * on the transaction object returned by [client#begin]{@link Client#begin}.
   *
   * Example:
   * ```javascript
   * const tx = client.begin();
   * // Perform operations under this transaction
   * tx.abort(); // Abort the transaction
   * ```
   *
   * @param transactionId The ID of the transaction to abort.
   */
  abort(transactionId) {
    this._checkConnection();
    this._stompHandler.abort(transactionId);
  }
  /**
   * Acknowledges receipt of a message. Typically, this should be done by calling
   * [ack]{@link IMessage#ack} directly on the {@link IMessage} instance passed
   * to the subscription callback.
   *
   * Example:
   * ```javascript
   * const callback = (message) => {
   *   // Process the message
   *   message.ack(); // Acknowledge the message
   * };
   *
   * client.subscribe("/queue/example", callback, { ack: "client" });
   * ```
   *
   * @param messageId The ID of the message to acknowledge.
   * @param subscriptionId The ID of the subscription.
   * @param headers Optional headers for the acknowledgment frame.
   */
  ack(messageId, subscriptionId, headers = {}) {
    this._checkConnection();
    this._stompHandler.ack(messageId, subscriptionId, headers);
  }
  /**
   * Rejects a message (negative acknowledgment). Like acknowledgments, this should
   * typically be done by calling [nack]{@link IMessage#nack} directly on the {@link IMessage}
   * instance passed to the subscription callback.
   *
   * Example:
   * ```javascript
   * const callback = (message) => {
   *   // Process the message
   *   if (isError(message)) {
   *     message.nack(); // Reject the message
   *   }
   * };
   *
   * client.subscribe("/queue/example", callback, { ack: "client" });
   * ```
   *
   * @param messageId The ID of the message to negatively acknowledge.
   * @param subscriptionId The ID of the subscription.
   * @param headers Optional headers for the NACK frame.
   */
  nack(messageId, subscriptionId, headers = {}) {
    this._checkConnection();
    this._stompHandler.nack(messageId, subscriptionId, headers);
  }
}
const getWsBaseUrl = () => {
  const envUrl = {}.VITE_WS_BASE_URL;
  if (envUrl && envUrl !== "") {
    return envUrl;
  }
  return "http://localhost:8080";
};
const WS_BASE_URL = getWsBaseUrl();
class PresenceService {
  constructor() {
    __publicField(this, "client", null);
    __publicField(this, "subscribers", /* @__PURE__ */ new Set());
    __publicField(this, "onlineUsers", /* @__PURE__ */ new Set());
  }
  connect(onPresenceUpdate) {
    if (this.client) {
      this.subscribers.add(onPresenceUpdate);
      return () => this.subscribers.delete(onPresenceUpdate);
    }
    const token = storage.get(tokenStorageKey);
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${WS_BASE_URL}/ws`),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      debug: (str) => {
      },
      reconnectDelay: 5e3,
      heartbeatIncoming: 4e3,
      heartbeatOutgoing: 4e3,
      onConnect: () => {
        var _a;
        console.log("[Presence] Connected");
        (_a = this.client) == null ? void 0 : _a.subscribe("/topic/presence", (message) => {
          try {
            const update = JSON.parse(message.body);
            if (update.online) {
              this.onlineUsers.add(update.userId);
            } else {
              this.onlineUsers.delete(update.userId);
            }
            this.subscribers.forEach((callback) => callback(update));
          } catch (error) {
            console.error("[Presence] Error parsing update:", error);
          }
        });
      },
      onStompError: (frame) => {
        console.error("[Presence] STOMP error:", frame);
      },
      onWebSocketError: (event2) => {
        console.error("[Presence] WebSocket error:", event2);
      }
    });
    this.subscribers.add(onPresenceUpdate);
    this.client.activate();
    return () => {
      this.subscribers.delete(onPresenceUpdate);
      if (this.subscribers.size === 0) {
        this.disconnect();
      }
    };
  }
  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.subscribers.clear();
      this.onlineUsers.clear();
      console.log("[Presence] Disconnected");
    }
  }
  isUserOnline(userId) {
    return this.onlineUsers.has(userId);
  }
  async checkPresence(userId) {
    try {
      const response = await apiClient.get(`/api/presence/user/${userId}`);
      if (response.data.online) {
        this.onlineUsers.add(userId);
      } else {
        this.onlineUsers.delete(userId);
      }
      return response.data.online;
    } catch (error) {
      console.error("[Presence] Error checking presence:", error);
      return false;
    }
  }
}
const presenceService = new PresenceService();
const AuthContext = reactExports.createContext(void 0);
const AuthProvider = ({ children }) => {
  const [user, setUser] = reactExports.useState(null);
  const [token, setToken] = reactExports.useState(() => storage.get(tokenStorageKey));
  const [isAuthenticating, setIsAuthenticating] = reactExports.useState(false);
  const { pushToast } = useToast();
  const bootstrap = reactExports.useCallback(async () => {
    const storedToken = storage.get(tokenStorageKey);
    if (!storedToken) {
      setUser(null);
      setToken(null);
      return;
    }
    try {
      setIsAuthenticating(true);
      const profile = await fetchProfile();
      setUser(profile);
      setToken(storedToken);
    } catch (error) {
      storage.remove(tokenStorageKey);
      setUser(null);
      setToken(null);
    } finally {
      setIsAuthenticating(false);
    }
  }, []);
  reactExports.useEffect(() => {
    bootstrap();
  }, [bootstrap]);
  reactExports.useEffect(() => {
    if (user) {
      const disconnectPresence = presenceService.connect(() => {
      });
      return () => {
        disconnectPresence();
      };
    } else {
      presenceService.disconnect();
    }
  }, [user]);
  const login$1 = reactExports.useCallback(
    async ({ email, password }) => {
      setIsAuthenticating(true);
      try {
        const { token: receivedToken } = await login(email, password);
        storage.set(tokenStorageKey, receivedToken);
        setToken(receivedToken);
        const profile = await fetchProfile();
        setUser(profile);
        pushToast({ type: "success", title: "Welcome back", description: `Hola ${profile.name}!` });
      } catch (error) {
        pushToast({ type: "error", title: "Login failed", description: error.message });
        throw error;
      } finally {
        setIsAuthenticating(false);
      }
    },
    [pushToast]
  );
  const register$1 = reactExports.useCallback(
    async (payload) => {
      setIsAuthenticating(true);
      try {
        const { token: receivedToken } = await register(payload);
        storage.set(tokenStorageKey, receivedToken);
        setToken(receivedToken);
        const profile = await fetchProfile();
        setUser(profile);
        pushToast({ type: "success", title: "Cuenta creada", description: "Tu perfil está listo." });
      } catch (error) {
        pushToast({ type: "error", title: "Registro fallido", description: error.message });
        throw error;
      } finally {
        setIsAuthenticating(false);
      }
    },
    [pushToast]
  );
  const logout = reactExports.useCallback(() => {
    storage.remove(tokenStorageKey);
    setUser(null);
    setToken(null);
  }, []);
  const refreshProfile = reactExports.useCallback(async () => {
    if (!token)
      return;
    const profile = await fetchProfile();
    setUser(profile);
  }, [token]);
  const value = reactExports.useMemo(
    () => ({
      user,
      token,
      isAuthenticating,
      login: login$1,
      register: register$1,
      logout,
      refreshProfile
    }),
    [isAuthenticating, login$1, logout, refreshProfile, register$1, token, user]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthContext.Provider, { value, children });
};
const useAuthContext = () => {
  const ctx = reactExports.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }
  return ctx;
};
const useAuth = () => useAuthContext();
const LoadingOverlay = ({ message = "Loading data…" }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex w-full items-center justify-center py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm text-slate-500 dark:text-slate-300", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "h-5 w-5 animate-spin text-primary-500", viewBox: "0 0 24 24", fill: "none", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" })
  ] }),
  message
] }) });
const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticating } = useAuth();
  const location2 = useLocation();
  if (isAuthenticating) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingOverlay, { message: "Validando sesión" });
  }
  if (!user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login", replace: true, state: { from: location2 } });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
};
function ArrowRightOnRectangleIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /* @__PURE__ */ reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ reactExports.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
  }));
}
const ForwardRef$g = /* @__PURE__ */ reactExports.forwardRef(ArrowRightOnRectangleIcon);
const ArrowRightOnRectangleIcon$1 = ForwardRef$g;
function BellAlertIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /* @__PURE__ */ reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ reactExports.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
  }));
}
const ForwardRef$f = /* @__PURE__ */ reactExports.forwardRef(BellAlertIcon);
const BellAlertIcon$1 = ForwardRef$f;
function CalendarDaysIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /* @__PURE__ */ reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ reactExports.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
  }));
}
const ForwardRef$e = /* @__PURE__ */ reactExports.forwardRef(CalendarDaysIcon);
const CalendarDaysIcon$1 = ForwardRef$e;
function ChatBubbleLeftRightIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /* @__PURE__ */ reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ reactExports.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
  }));
}
const ForwardRef$d = /* @__PURE__ */ reactExports.forwardRef(ChatBubbleLeftRightIcon);
const ChatBubbleLeftRightIcon$1 = ForwardRef$d;
function ClipboardDocumentListIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /* @__PURE__ */ reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ reactExports.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
  }));
}
const ForwardRef$c = /* @__PURE__ */ reactExports.forwardRef(ClipboardDocumentListIcon);
const ClipboardDocumentListIcon$1 = ForwardRef$c;
function Cog6ToothIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /* @__PURE__ */ reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ reactExports.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
  }), /* @__PURE__ */ reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
  }));
}
const ForwardRef$b = /* @__PURE__ */ reactExports.forwardRef(Cog6ToothIcon);
const Cog6ToothIcon$1 = ForwardRef$b;
function ExclamationTriangleIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /* @__PURE__ */ reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ reactExports.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
  }));
}
const ForwardRef$a = /* @__PURE__ */ reactExports.forwardRef(ExclamationTriangleIcon);
const ExclamationTriangleIcon$1 = ForwardRef$a;
function HomeIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /* @__PURE__ */ reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ reactExports.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
  }));
}
const ForwardRef$9 = /* @__PURE__ */ reactExports.forwardRef(HomeIcon);
const HomeIcon$1 = ForwardRef$9;
function MagnifyingGlassIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /* @__PURE__ */ reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ reactExports.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
  }));
}
const ForwardRef$8 = /* @__PURE__ */ reactExports.forwardRef(MagnifyingGlassIcon);
const MagnifyingGlassIcon$1 = ForwardRef$8;
function QrCodeIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /* @__PURE__ */ reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ reactExports.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"
  }), /* @__PURE__ */ reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z"
  }));
}
const ForwardRef$7 = /* @__PURE__ */ reactExports.forwardRef(QrCodeIcon);
const QrCodeIcon$1 = ForwardRef$7;
function ShieldCheckIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /* @__PURE__ */ reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ reactExports.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
  }));
}
const ForwardRef$6 = /* @__PURE__ */ reactExports.forwardRef(ShieldCheckIcon);
const ShieldCheckIcon$1 = ForwardRef$6;
function UserCircleIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /* @__PURE__ */ reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ reactExports.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
  }));
}
const ForwardRef$5 = /* @__PURE__ */ reactExports.forwardRef(UserCircleIcon);
const UserCircleIcon$1 = ForwardRef$5;
function UserGroupIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /* @__PURE__ */ reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ reactExports.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
  }));
}
const ForwardRef$4 = /* @__PURE__ */ reactExports.forwardRef(UserGroupIcon);
const UserGroupIcon$1 = ForwardRef$4;
function UserPlusIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /* @__PURE__ */ reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ reactExports.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
  }));
}
const ForwardRef$3 = /* @__PURE__ */ reactExports.forwardRef(UserPlusIcon);
const UserPlusIcon$1 = ForwardRef$3;
function XMarkIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /* @__PURE__ */ reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ reactExports.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M6 18 18 6M6 6l12 12"
  }));
}
const ForwardRef$2 = /* @__PURE__ */ reactExports.forwardRef(XMarkIcon);
const XMarkIcon$1 = ForwardRef$2;
var classnames = { exports: {} };
/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
(function(module) {
  (function() {
    var hasOwn = {}.hasOwnProperty;
    function classNames2() {
      var classes = "";
      for (var i2 = 0; i2 < arguments.length; i2++) {
        var arg = arguments[i2];
        if (arg) {
          classes = appendClass(classes, parseValue(arg));
        }
      }
      return classes;
    }
    function parseValue(arg) {
      if (typeof arg === "string" || typeof arg === "number") {
        return arg;
      }
      if (typeof arg !== "object") {
        return "";
      }
      if (Array.isArray(arg)) {
        return classNames2.apply(null, arg);
      }
      if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes("[native code]")) {
        return arg.toString();
      }
      var classes = "";
      for (var key in arg) {
        if (hasOwn.call(arg, key) && arg[key]) {
          classes = appendClass(classes, key);
        }
      }
      return classes;
    }
    function appendClass(value, newClass) {
      if (!newClass) {
        return value;
      }
      if (value) {
        return value + " " + newClass;
      }
      return value + newClass;
    }
    if (module.exports) {
      classNames2.default = classNames2;
      module.exports = classNames2;
    } else {
      window.classNames = classNames2;
    }
  })();
})(classnames);
var classnamesExports = classnames.exports;
const classNames = /* @__PURE__ */ getDefaultExportFromCjs(classnamesExports);
const navigation = [
  { name: "Overview", to: "/", icon: HomeIcon$1 },
  { name: "Events", to: "/events", icon: CalendarDaysIcon$1 },
  { name: "Check-in", to: "/checkin", icon: QrCodeIcon$1 },
  { name: "Notifications", to: "/notifications", icon: BellAlertIcon$1 },
  { name: "Groups", to: "/groups", icon: UserGroupIcon$1 },
  { name: "Surveys", to: "/surveys", icon: ClipboardDocumentListIcon$1 },
  { name: "Friends", to: "/friends", icon: UserPlusIcon$1 },
  { name: "Chat", to: "/chat", icon: ChatBubbleLeftRightIcon$1 },
  { name: "Profile", to: "/profile", icon: UserCircleIcon$1 },
  { name: "Settings", to: "/settings", icon: Cog6ToothIcon$1 }
];
const adminNavigation = [{ name: "Admin", to: "/admin/users", icon: ShieldCheckIcon$1, roles: ["ADMIN"] }];
const Sidebar = () => {
  const { user } = useAuth();
  const items = (user == null ? void 0 : user.role) === "ADMIN" ? [...navigation, ...adminNavigation] : navigation;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden lg:flex lg:flex-col w-64 border-r border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 border-b border-slate-100 dark:border-slate-800", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-semibold text-primary-600", children: "UniVibe" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 mt-1", children: "University experiences, reimagined" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 px-4 py-6 space-y-1", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      NavLink,
      {
        to: item.to,
        className: ({ isActive }) => classNames(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isActive ? "bg-primary-50 text-primary-600 dark:bg-primary-600/10 dark:text-primary-200" : "text-slate-600 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/60"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "h-5 w-5" }),
          item.name
        ]
      },
      item.to
    )) })
  ] });
};
function MoonIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /* @__PURE__ */ reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ reactExports.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ reactExports.createElement("path", {
    fillRule: "evenodd",
    d: "M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z",
    clipRule: "evenodd"
  }));
}
const ForwardRef$1 = /* @__PURE__ */ reactExports.forwardRef(MoonIcon);
const MoonIcon$1 = ForwardRef$1;
function SunIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /* @__PURE__ */ reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ reactExports.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ reactExports.createElement("path", {
    d: "M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z"
  }));
}
const ForwardRef = /* @__PURE__ */ reactExports.forwardRef(SunIcon);
const SunIcon$1 = ForwardRef;
const ThemeContext = reactExports.createContext(void 0);
const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = reactExports.useState(() => {
    const stored = storage.get(themeStorageKey);
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });
  reactExports.useEffect(() => {
    storage.set(themeStorageKey, theme);
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);
  const value = reactExports.useMemo(
    () => ({
      theme,
      toggleTheme: () => setThemeState((prev) => prev === "dark" ? "light" : "dark"),
      setTheme: (value2) => setThemeState(value2)
    }),
    [theme]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeContext.Provider, { value, children });
};
const useTheme = () => {
  const ctx = reactExports.useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
};
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: toggleTheme,
      className: "flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/70 text-slate-600 dark:text-slate-200",
      "aria-label": "Toggle theme",
      children: theme === "dark" ? /* @__PURE__ */ jsxRuntimeExports.jsx(SunIcon$1, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MoonIcon$1, { className: "h-5 w-5" })
    }
  );
};
var i$3 = Object.defineProperty;
var d$2 = (t2, e2, n2) => e2 in t2 ? i$3(t2, e2, { enumerable: true, configurable: true, writable: true, value: n2 }) : t2[e2] = n2;
var r$1 = (t2, e2, n2) => (d$2(t2, typeof e2 != "symbol" ? e2 + "" : e2, n2), n2);
let o$6 = class o {
  constructor() {
    r$1(this, "current", this.detect());
    r$1(this, "handoffState", "pending");
    r$1(this, "currentId", 0);
  }
  set(e2) {
    this.current !== e2 && (this.handoffState = "pending", this.currentId = 0, this.current = e2);
  }
  reset() {
    this.set(this.detect());
  }
  nextId() {
    return ++this.currentId;
  }
  get isServer() {
    return this.current === "server";
  }
  get isClient() {
    return this.current === "client";
  }
  detect() {
    return typeof window == "undefined" || typeof document == "undefined" ? "server" : "client";
  }
  handoff() {
    this.handoffState === "pending" && (this.handoffState = "complete");
  }
  get isHandoffComplete() {
    return this.handoffState === "complete";
  }
};
let s$5 = new o$6();
let l$2 = (e2, f2) => {
  s$5.isServer ? reactExports.useEffect(e2, f2) : reactExports.useLayoutEffect(e2, f2);
};
function s$4(e2) {
  let r2 = reactExports.useRef(e2);
  return l$2(() => {
    r2.current = e2;
  }, [e2]), r2;
}
let o$5 = function(t2) {
  let e2 = s$4(t2);
  return React.useCallback((...r2) => e2.current(...r2), [e2]);
};
function t$3(e2) {
  typeof queueMicrotask == "function" ? queueMicrotask(e2) : Promise.resolve().then(e2).catch((o3) => setTimeout(() => {
    throw o3;
  }));
}
function o$4() {
  let n2 = [], r2 = { addEventListener(e2, t2, s2, a2) {
    return e2.addEventListener(t2, s2, a2), r2.add(() => e2.removeEventListener(t2, s2, a2));
  }, requestAnimationFrame(...e2) {
    let t2 = requestAnimationFrame(...e2);
    return r2.add(() => cancelAnimationFrame(t2));
  }, nextFrame(...e2) {
    return r2.requestAnimationFrame(() => r2.requestAnimationFrame(...e2));
  }, setTimeout(...e2) {
    let t2 = setTimeout(...e2);
    return r2.add(() => clearTimeout(t2));
  }, microTask(...e2) {
    let t2 = { current: true };
    return t$3(() => {
      t2.current && e2[0]();
    }), r2.add(() => {
      t2.current = false;
    });
  }, style(e2, t2, s2) {
    let a2 = e2.style.getPropertyValue(t2);
    return Object.assign(e2.style, { [t2]: s2 }), this.add(() => {
      Object.assign(e2.style, { [t2]: a2 });
    });
  }, group(e2) {
    let t2 = o$4();
    return e2(t2), this.add(() => t2.dispose());
  }, add(e2) {
    return n2.push(e2), () => {
      let t2 = n2.indexOf(e2);
      if (t2 >= 0)
        for (let s2 of n2.splice(t2, 1))
          s2();
    };
  }, dispose() {
    for (let e2 of n2.splice(0))
      e2();
  } };
  return r2;
}
function p() {
  let [e2] = reactExports.useState(o$4);
  return reactExports.useEffect(() => () => e2.dispose(), [e2]), e2;
}
function s$3() {
  let r2 = typeof document == "undefined";
  return "useSyncExternalStore" in e ? ((o3) => o3.useSyncExternalStore)(e)(() => () => {
  }, () => false, () => !r2) : false;
}
function l$1() {
  let r2 = s$3(), [e$1, n2] = reactExports.useState(s$5.isHandoffComplete);
  return e$1 && s$5.isHandoffComplete === false && n2(false), reactExports.useEffect(() => {
    e$1 !== true && n2(true);
  }, [e$1]), reactExports.useEffect(() => s$5.handoff(), []), r2 ? false : e$1;
}
var o$3;
let I$2 = (o$3 = React.useId) != null ? o$3 : function() {
  let n2 = l$1(), [e2, u2] = React.useState(n2 ? () => s$5.nextId() : null);
  return l$2(() => {
    e2 === null && u2(s$5.nextId());
  }, [e2]), e2 != null ? "" + e2 : void 0;
};
function u$4(r2, n2, ...a2) {
  if (r2 in n2) {
    let e2 = n2[r2];
    return typeof e2 == "function" ? e2(...a2) : e2;
  }
  let t2 = new Error(`Tried to handle "${r2}" but there is no handler defined. Only defined handlers are: ${Object.keys(n2).map((e2) => `"${e2}"`).join(", ")}.`);
  throw Error.captureStackTrace && Error.captureStackTrace(t2, u$4), t2;
}
function o$2(r2) {
  return s$5.isServer ? null : r2 instanceof Node ? r2.ownerDocument : r2 != null && r2.hasOwnProperty("current") && r2.current instanceof Node ? r2.current.ownerDocument : document;
}
let c$2 = ["[contentEditable=true]", "[tabindex]", "a[href]", "area[href]", "button:not([disabled])", "iframe", "input:not([disabled])", "select:not([disabled])", "textarea:not([disabled])"].map((e2) => `${e2}:not([tabindex='-1'])`).join(",");
var M$2 = ((n2) => (n2[n2.First = 1] = "First", n2[n2.Previous = 2] = "Previous", n2[n2.Next = 4] = "Next", n2[n2.Last = 8] = "Last", n2[n2.WrapAround = 16] = "WrapAround", n2[n2.NoScroll = 32] = "NoScroll", n2))(M$2 || {}), N = ((o3) => (o3[o3.Error = 0] = "Error", o3[o3.Overflow = 1] = "Overflow", o3[o3.Success = 2] = "Success", o3[o3.Underflow = 3] = "Underflow", o3))(N || {}), F$2 = ((t2) => (t2[t2.Previous = -1] = "Previous", t2[t2.Next = 1] = "Next", t2))(F$2 || {});
function f$2(e2 = document.body) {
  return e2 == null ? [] : Array.from(e2.querySelectorAll(c$2)).sort((r2, t2) => Math.sign((r2.tabIndex || Number.MAX_SAFE_INTEGER) - (t2.tabIndex || Number.MAX_SAFE_INTEGER)));
}
var T$1 = ((t2) => (t2[t2.Strict = 0] = "Strict", t2[t2.Loose = 1] = "Loose", t2))(T$1 || {});
function h(e2, r2 = 0) {
  var t2;
  return e2 === ((t2 = o$2(e2)) == null ? void 0 : t2.body) ? false : u$4(r2, { [0]() {
    return e2.matches(c$2);
  }, [1]() {
    let l2 = e2;
    for (; l2 !== null; ) {
      if (l2.matches(c$2))
        return true;
      l2 = l2.parentElement;
    }
    return false;
  } });
}
function D$1(e2) {
  let r2 = o$2(e2);
  o$4().nextFrame(() => {
    r2 && !h(r2.activeElement, 0) && y$2(e2);
  });
}
var w$1 = ((t2) => (t2[t2.Keyboard = 0] = "Keyboard", t2[t2.Mouse = 1] = "Mouse", t2))(w$1 || {});
typeof window != "undefined" && typeof document != "undefined" && (document.addEventListener("keydown", (e2) => {
  e2.metaKey || e2.altKey || e2.ctrlKey || (document.documentElement.dataset.headlessuiFocusVisible = "");
}, true), document.addEventListener("click", (e2) => {
  e2.detail === 1 ? delete document.documentElement.dataset.headlessuiFocusVisible : e2.detail === 0 && (document.documentElement.dataset.headlessuiFocusVisible = "");
}, true));
function y$2(e2) {
  e2 == null || e2.focus({ preventScroll: true });
}
let S$1 = ["textarea", "input"].join(",");
function H(e2) {
  var r2, t2;
  return (t2 = (r2 = e2 == null ? void 0 : e2.matches) == null ? void 0 : r2.call(e2, S$1)) != null ? t2 : false;
}
function I$1(e2, r2 = (t2) => t2) {
  return e2.slice().sort((t2, l2) => {
    let o3 = r2(t2), i2 = r2(l2);
    if (o3 === null || i2 === null)
      return 0;
    let n2 = o3.compareDocumentPosition(i2);
    return n2 & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : n2 & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
  });
}
function _(e2, r2) {
  return O$1(f$2(), r2, { relativeTo: e2 });
}
function O$1(e2, r2, { sorted: t2 = true, relativeTo: l2 = null, skipElements: o3 = [] } = {}) {
  let i2 = Array.isArray(e2) ? e2.length > 0 ? e2[0].ownerDocument : document : e2.ownerDocument, n2 = Array.isArray(e2) ? t2 ? I$1(e2) : e2 : f$2(e2);
  o3.length > 0 && n2.length > 1 && (n2 = n2.filter((s2) => !o3.includes(s2))), l2 = l2 != null ? l2 : i2.activeElement;
  let E2 = (() => {
    if (r2 & 5)
      return 1;
    if (r2 & 10)
      return -1;
    throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last");
  })(), x2 = (() => {
    if (r2 & 1)
      return 0;
    if (r2 & 2)
      return Math.max(0, n2.indexOf(l2)) - 1;
    if (r2 & 4)
      return Math.max(0, n2.indexOf(l2)) + 1;
    if (r2 & 8)
      return n2.length - 1;
    throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last");
  })(), p2 = r2 & 32 ? { preventScroll: true } : {}, d2 = 0, a2 = n2.length, u2;
  do {
    if (d2 >= a2 || d2 + a2 <= 0)
      return 0;
    let s2 = x2 + d2;
    if (r2 & 16)
      s2 = (s2 + a2) % a2;
    else {
      if (s2 < 0)
        return 3;
      if (s2 >= a2)
        return 1;
    }
    u2 = n2[s2], u2 == null || u2.focus(p2), d2 += E2;
  } while (u2 !== i2.activeElement);
  return r2 & 6 && H(u2) && u2.select(), 2;
}
function t$2() {
  return /iPhone/gi.test(window.navigator.platform) || /Mac/gi.test(window.navigator.platform) && window.navigator.maxTouchPoints > 0;
}
function i$2() {
  return /Android/gi.test(window.navigator.userAgent);
}
function n$2() {
  return t$2() || i$2();
}
function d$1(e2, r2, n2) {
  let o3 = s$4(r2);
  reactExports.useEffect(() => {
    function t2(u2) {
      o3.current(u2);
    }
    return document.addEventListener(e2, t2, n2), () => document.removeEventListener(e2, t2, n2);
  }, [e2, n2]);
}
function s$2(e2, r2, n2) {
  let o3 = s$4(r2);
  reactExports.useEffect(() => {
    function t2(i2) {
      o3.current(i2);
    }
    return window.addEventListener(e2, t2, n2), () => window.removeEventListener(e2, t2, n2);
  }, [e2, n2]);
}
function y$1(s2, m2, a2 = true) {
  let i2 = reactExports.useRef(false);
  reactExports.useEffect(() => {
    requestAnimationFrame(() => {
      i2.current = a2;
    });
  }, [a2]);
  function c2(e2, r2) {
    if (!i2.current || e2.defaultPrevented)
      return;
    let t2 = r2(e2);
    if (t2 === null || !t2.getRootNode().contains(t2) || !t2.isConnected)
      return;
    let E2 = function u2(n2) {
      return typeof n2 == "function" ? u2(n2()) : Array.isArray(n2) || n2 instanceof Set ? n2 : [n2];
    }(s2);
    for (let u2 of E2) {
      if (u2 === null)
        continue;
      let n2 = u2 instanceof HTMLElement ? u2 : u2.current;
      if (n2 != null && n2.contains(t2) || e2.composed && e2.composedPath().includes(n2))
        return;
    }
    return !h(t2, T$1.Loose) && t2.tabIndex !== -1 && e2.preventDefault(), m2(e2, t2);
  }
  let o3 = reactExports.useRef(null);
  d$1("pointerdown", (e2) => {
    var r2, t2;
    i2.current && (o3.current = ((t2 = (r2 = e2.composedPath) == null ? void 0 : r2.call(e2)) == null ? void 0 : t2[0]) || e2.target);
  }, true), d$1("mousedown", (e2) => {
    var r2, t2;
    i2.current && (o3.current = ((t2 = (r2 = e2.composedPath) == null ? void 0 : r2.call(e2)) == null ? void 0 : t2[0]) || e2.target);
  }, true), d$1("click", (e2) => {
    n$2() || o3.current && (c2(e2, () => o3.current), o3.current = null);
  }, true), d$1("touchend", (e2) => c2(e2, () => e2.target instanceof HTMLElement ? e2.target : null), true), s$2("blur", (e2) => c2(e2, () => window.document.activeElement instanceof HTMLIFrameElement ? window.document.activeElement : null), true);
}
function n$1(...e2) {
  return reactExports.useMemo(() => o$2(...e2), [...e2]);
}
function i$1(t2) {
  var n2;
  if (t2.type)
    return t2.type;
  let e2 = (n2 = t2.as) != null ? n2 : "button";
  if (typeof e2 == "string" && e2.toLowerCase() === "button")
    return "button";
}
function T(t2, e2) {
  let [n2, u2] = reactExports.useState(() => i$1(t2));
  return l$2(() => {
    u2(i$1(t2));
  }, [t2.type, t2.as]), l$2(() => {
    n2 || e2.current && e2.current instanceof HTMLButtonElement && !e2.current.hasAttribute("type") && u2("button");
  }, [n2, e2]), n2;
}
let u$3 = Symbol();
function y(...t2) {
  let n2 = reactExports.useRef(t2);
  reactExports.useEffect(() => {
    n2.current = t2;
  }, [t2]);
  let c2 = o$5((e2) => {
    for (let o3 of n2.current)
      o3 != null && (typeof o3 == "function" ? o3(e2) : o3.current = e2);
  });
  return t2.every((e2) => e2 == null || (e2 == null ? void 0 : e2[u$3])) ? void 0 : c2;
}
function t$1(e2) {
  return [e2.screenX, e2.screenY];
}
function u$2() {
  let e2 = reactExports.useRef([-1, -1]);
  return { wasMoved(r2) {
    let n2 = t$1(r2);
    return e2.current[0] === n2[0] && e2.current[1] === n2[1] ? false : (e2.current = n2, true);
  }, update(r2) {
    e2.current = t$1(r2);
  } };
}
function F$1({ container: e2, accept: t2, walk: r2, enabled: c2 = true }) {
  let o3 = reactExports.useRef(t2), l2 = reactExports.useRef(r2);
  reactExports.useEffect(() => {
    o3.current = t2, l2.current = r2;
  }, [t2, r2]), l$2(() => {
    if (!e2 || !c2)
      return;
    let n2 = o$2(e2);
    if (!n2)
      return;
    let f2 = o3.current, p2 = l2.current, d2 = Object.assign((i2) => f2(i2), { acceptNode: f2 }), u2 = n2.createTreeWalker(e2, NodeFilter.SHOW_ELEMENT, d2, false);
    for (; u2.nextNode(); )
      p2(u2.currentNode);
  }, [e2, c2, o3, l2]);
}
function t(...r2) {
  return Array.from(new Set(r2.flatMap((n2) => typeof n2 == "string" ? n2.split(" ") : []))).filter(Boolean).join(" ");
}
var O = ((n2) => (n2[n2.None = 0] = "None", n2[n2.RenderStrategy = 1] = "RenderStrategy", n2[n2.Static = 2] = "Static", n2))(O || {}), v$1 = ((e2) => (e2[e2.Unmount = 0] = "Unmount", e2[e2.Hidden = 1] = "Hidden", e2))(v$1 || {});
function C$1({ ourProps: r2, theirProps: t2, slot: e2, defaultTag: n2, features: o3, visible: a2 = true, name: f2, mergeRefs: l2 }) {
  l2 = l2 != null ? l2 : k;
  let s2 = R(t2, r2);
  if (a2)
    return m(s2, e2, n2, f2, l2);
  let y2 = o3 != null ? o3 : 0;
  if (y2 & 2) {
    let { static: u2 = false, ...d2 } = s2;
    if (u2)
      return m(d2, e2, n2, f2, l2);
  }
  if (y2 & 1) {
    let { unmount: u2 = true, ...d2 } = s2;
    return u$4(u2 ? 0 : 1, { [0]() {
      return null;
    }, [1]() {
      return m({ ...d2, hidden: true, style: { display: "none" } }, e2, n2, f2, l2);
    } });
  }
  return m(s2, e2, n2, f2, l2);
}
function m(r2, t$12 = {}, e2, n2, o3) {
  let { as: a2 = e2, children: f2, refName: l2 = "ref", ...s2 } = F(r2, ["unmount", "static"]), y2 = r2.ref !== void 0 ? { [l2]: r2.ref } : {}, u2 = typeof f2 == "function" ? f2(t$12) : f2;
  "className" in s2 && s2.className && typeof s2.className == "function" && (s2.className = s2.className(t$12));
  let d2 = {};
  if (t$12) {
    let i2 = false, c2 = [];
    for (let [T2, p2] of Object.entries(t$12))
      typeof p2 == "boolean" && (i2 = true), p2 === true && c2.push(T2);
    i2 && (d2["data-headlessui-state"] = c2.join(" "));
  }
  if (a2 === reactExports.Fragment && Object.keys(x(s2)).length > 0) {
    if (!reactExports.isValidElement(u2) || Array.isArray(u2) && u2.length > 1)
      throw new Error(['Passing props on "Fragment"!', "", `The current component <${n2} /> is rendering a "Fragment".`, "However we need to passthrough the following props:", Object.keys(s2).map((p2) => `  - ${p2}`).join(`
`), "", "You can apply a few solutions:", ['Add an `as="..."` prop, to ensure that we render an actual element instead of a "Fragment".', "Render a single element as the child so that we can forward the props onto that element."].map((p2) => `  - ${p2}`).join(`
`)].join(`
`));
    let i2 = u2.props, c2 = typeof (i2 == null ? void 0 : i2.className) == "function" ? (...p2) => t(i2 == null ? void 0 : i2.className(...p2), s2.className) : t(i2 == null ? void 0 : i2.className, s2.className), T2 = c2 ? { className: c2 } : {};
    return reactExports.cloneElement(u2, Object.assign({}, R(u2.props, x(F(s2, ["ref"]))), d2, y2, { ref: o3(u2.ref, y2.ref) }, T2));
  }
  return reactExports.createElement(a2, Object.assign({}, F(s2, ["ref"]), a2 !== reactExports.Fragment && y2, a2 !== reactExports.Fragment && d2), u2);
}
function k(...r2) {
  return r2.every((t2) => t2 == null) ? void 0 : (t2) => {
    for (let e2 of r2)
      e2 != null && (typeof e2 == "function" ? e2(t2) : e2.current = t2);
  };
}
function R(...r2) {
  if (r2.length === 0)
    return {};
  if (r2.length === 1)
    return r2[0];
  let t2 = {}, e2 = {};
  for (let o3 of r2)
    for (let a2 in o3)
      a2.startsWith("on") && typeof o3[a2] == "function" ? (e2[a2] != null || (e2[a2] = []), e2[a2].push(o3[a2])) : t2[a2] = o3[a2];
  if (t2.disabled || t2["aria-disabled"])
    return Object.assign(t2, Object.fromEntries(Object.keys(e2).map((o3) => [o3, void 0])));
  for (let o3 in e2)
    Object.assign(t2, { [o3](a2, ...f2) {
      let l2 = e2[o3];
      for (let s2 of l2) {
        if ((a2 instanceof Event || (a2 == null ? void 0 : a2.nativeEvent) instanceof Event) && a2.defaultPrevented)
          return;
        s2(a2, ...f2);
      }
    } });
  return t2;
}
function U$2(r2) {
  var t2;
  return Object.assign(reactExports.forwardRef(r2), { displayName: (t2 = r2.displayName) != null ? t2 : r2.name });
}
function x(r2) {
  let t2 = Object.assign({}, r2);
  for (let e2 in t2)
    t2[e2] === void 0 && delete t2[e2];
  return t2;
}
function F(r2, t2 = []) {
  let e2 = Object.assign({}, r2);
  for (let n2 of t2)
    n2 in e2 && delete e2[n2];
  return e2;
}
let n = reactExports.createContext(null);
n.displayName = "OpenClosedContext";
var d = ((e2) => (e2[e2.Open = 1] = "Open", e2[e2.Closed = 2] = "Closed", e2[e2.Closing = 4] = "Closing", e2[e2.Opening = 8] = "Opening", e2))(d || {});
function u$1() {
  return reactExports.useContext(n);
}
function s$1({ value: o3, children: r2 }) {
  return React.createElement(n.Provider, { value: o3 }, r2);
}
function r(n2) {
  let e2 = n2.parentElement, l2 = null;
  for (; e2 && !(e2 instanceof HTMLFieldSetElement); )
    e2 instanceof HTMLLegendElement && (l2 = e2), e2 = e2.parentElement;
  let t2 = (e2 == null ? void 0 : e2.getAttribute("disabled")) === "";
  return t2 && i(l2) ? false : t2;
}
function i(n2) {
  if (!n2)
    return false;
  let e2 = n2.previousElementSibling;
  for (; e2 !== null; ) {
    if (e2 instanceof HTMLLegendElement)
      return false;
    e2 = e2.previousElementSibling;
  }
  return true;
}
function u(l2) {
  throw new Error("Unexpected object: " + l2);
}
var c$1 = ((i2) => (i2[i2.First = 0] = "First", i2[i2.Previous = 1] = "Previous", i2[i2.Next = 2] = "Next", i2[i2.Last = 3] = "Last", i2[i2.Specific = 4] = "Specific", i2[i2.Nothing = 5] = "Nothing", i2))(c$1 || {});
function f$1(l2, n2) {
  let t2 = n2.resolveItems();
  if (t2.length <= 0)
    return null;
  let r2 = n2.resolveActiveIndex(), s2 = r2 != null ? r2 : -1;
  switch (l2.focus) {
    case 0: {
      for (let e2 = 0; e2 < t2.length; ++e2)
        if (!n2.resolveDisabled(t2[e2], e2, t2))
          return e2;
      return r2;
    }
    case 1: {
      for (let e2 = s2 - 1; e2 >= 0; --e2)
        if (!n2.resolveDisabled(t2[e2], e2, t2))
          return e2;
      return r2;
    }
    case 2: {
      for (let e2 = s2 + 1; e2 < t2.length; ++e2)
        if (!n2.resolveDisabled(t2[e2], e2, t2))
          return e2;
      return r2;
    }
    case 3: {
      for (let e2 = t2.length - 1; e2 >= 0; --e2)
        if (!n2.resolveDisabled(t2[e2], e2, t2))
          return e2;
      return r2;
    }
    case 4: {
      for (let e2 = 0; e2 < t2.length; ++e2)
        if (n2.resolveId(t2[e2], e2, t2) === l2.id)
          return e2;
      return r2;
    }
    case 5:
      return null;
    default:
      u(l2);
  }
}
var o$1 = ((r2) => (r2.Space = " ", r2.Enter = "Enter", r2.Escape = "Escape", r2.Backspace = "Backspace", r2.Delete = "Delete", r2.ArrowLeft = "ArrowLeft", r2.ArrowUp = "ArrowUp", r2.ArrowRight = "ArrowRight", r2.ArrowDown = "ArrowDown", r2.Home = "Home", r2.End = "End", r2.PageUp = "PageUp", r2.PageDown = "PageDown", r2.Tab = "Tab", r2))(o$1 || {});
function f() {
  let e2 = reactExports.useRef(false);
  return l$2(() => (e2.current = true, () => {
    e2.current = false;
  }), []), e2;
}
let a = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
function o2(e2) {
  var r2, i2;
  let n2 = (r2 = e2.innerText) != null ? r2 : "", t2 = e2.cloneNode(true);
  if (!(t2 instanceof HTMLElement))
    return n2;
  let u2 = false;
  for (let f2 of t2.querySelectorAll('[hidden],[aria-hidden],[role="img"]'))
    f2.remove(), u2 = true;
  let l2 = u2 ? (i2 = t2.innerText) != null ? i2 : "" : n2;
  return a.test(l2) && (l2 = l2.replace(a, "")), l2;
}
function g$1(e2) {
  let n2 = e2.getAttribute("aria-label");
  if (typeof n2 == "string")
    return n2.trim();
  let t2 = e2.getAttribute("aria-labelledby");
  if (t2) {
    let u2 = t2.split(" ").map((l2) => {
      let r2 = document.getElementById(l2);
      if (r2) {
        let i2 = r2.getAttribute("aria-label");
        return typeof i2 == "string" ? i2.trim() : o2(r2).trim();
      }
      return null;
    }).filter(Boolean);
    if (u2.length > 0)
      return u2.join(", ");
  }
  return o2(e2).trim();
}
function s(c2) {
  let t2 = reactExports.useRef(""), r2 = reactExports.useRef("");
  return o$5(() => {
    let e2 = c2.current;
    if (!e2)
      return "";
    let u2 = e2.innerText;
    if (t2.current === u2)
      return r2.current;
    let n2 = g$1(e2).trim().toLowerCase();
    return t2.current = u2, r2.current = n2, n2;
  });
}
var me = ((r2) => (r2[r2.Open = 0] = "Open", r2[r2.Closed = 1] = "Closed", r2))(me || {}), de = ((r2) => (r2[r2.Pointer = 0] = "Pointer", r2[r2.Other = 1] = "Other", r2))(de || {}), fe = ((a2) => (a2[a2.OpenMenu = 0] = "OpenMenu", a2[a2.CloseMenu = 1] = "CloseMenu", a2[a2.GoToItem = 2] = "GoToItem", a2[a2.Search = 3] = "Search", a2[a2.ClearSearch = 4] = "ClearSearch", a2[a2.RegisterItem = 5] = "RegisterItem", a2[a2.UnregisterItem = 6] = "UnregisterItem", a2))(fe || {});
function w(e2, u2 = (r2) => r2) {
  let r2 = e2.activeItemIndex !== null ? e2.items[e2.activeItemIndex] : null, s2 = I$1(u2(e2.items.slice()), (t2) => t2.dataRef.current.domRef.current), i2 = r2 ? s2.indexOf(r2) : null;
  return i2 === -1 && (i2 = null), { items: s2, activeItemIndex: i2 };
}
let Te = { [1](e2) {
  return e2.menuState === 1 ? e2 : { ...e2, activeItemIndex: null, menuState: 1 };
}, [0](e2) {
  return e2.menuState === 0 ? e2 : { ...e2, __demoMode: false, menuState: 0 };
}, [2]: (e2, u2) => {
  var i2;
  let r2 = w(e2), s2 = f$1(u2, { resolveItems: () => r2.items, resolveActiveIndex: () => r2.activeItemIndex, resolveId: (t2) => t2.id, resolveDisabled: (t2) => t2.dataRef.current.disabled });
  return { ...e2, ...r2, searchQuery: "", activeItemIndex: s2, activationTrigger: (i2 = u2.trigger) != null ? i2 : 1 };
}, [3]: (e2, u2) => {
  let s2 = e2.searchQuery !== "" ? 0 : 1, i2 = e2.searchQuery + u2.value.toLowerCase(), o3 = (e2.activeItemIndex !== null ? e2.items.slice(e2.activeItemIndex + s2).concat(e2.items.slice(0, e2.activeItemIndex + s2)) : e2.items).find((l2) => {
    var m2;
    return ((m2 = l2.dataRef.current.textValue) == null ? void 0 : m2.startsWith(i2)) && !l2.dataRef.current.disabled;
  }), a2 = o3 ? e2.items.indexOf(o3) : -1;
  return a2 === -1 || a2 === e2.activeItemIndex ? { ...e2, searchQuery: i2 } : { ...e2, searchQuery: i2, activeItemIndex: a2, activationTrigger: 1 };
}, [4](e2) {
  return e2.searchQuery === "" ? e2 : { ...e2, searchQuery: "", searchActiveItemIndex: null };
}, [5]: (e2, u2) => {
  let r2 = w(e2, (s2) => [...s2, { id: u2.id, dataRef: u2.dataRef }]);
  return { ...e2, ...r2 };
}, [6]: (e2, u2) => {
  let r2 = w(e2, (s2) => {
    let i2 = s2.findIndex((t2) => t2.id === u2.id);
    return i2 !== -1 && s2.splice(i2, 1), s2;
  });
  return { ...e2, ...r2, activationTrigger: 1 };
} }, U$1 = reactExports.createContext(null);
U$1.displayName = "MenuContext";
function C(e2) {
  let u2 = reactExports.useContext(U$1);
  if (u2 === null) {
    let r2 = new Error(`<${e2} /> is missing a parent <Menu /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(r2, C), r2;
  }
  return u2;
}
function ye$1(e2, u2) {
  return u$4(u2.type, Te, e2, u2);
}
let Ie = reactExports.Fragment;
function Me(e2, u2) {
  let { __demoMode: r2 = false, ...s2 } = e2, i2 = reactExports.useReducer(ye$1, { __demoMode: r2, menuState: r2 ? 0 : 1, buttonRef: reactExports.createRef(), itemsRef: reactExports.createRef(), items: [], searchQuery: "", activeItemIndex: null, activationTrigger: 1 }), [{ menuState: t2, itemsRef: o3, buttonRef: a2 }, l2] = i2, m2 = y(u2);
  y$1([a2, o3], (g2, R2) => {
    var p2;
    l2({ type: 1 }), h(R2, T$1.Loose) || (g2.preventDefault(), (p2 = a2.current) == null || p2.focus());
  }, t2 === 0);
  let I2 = o$5(() => {
    l2({ type: 1 });
  }), A2 = reactExports.useMemo(() => ({ open: t2 === 0, close: I2 }), [t2, I2]), f2 = { ref: m2 };
  return React.createElement(U$1.Provider, { value: i2 }, React.createElement(s$1, { value: u$4(t2, { [0]: d.Open, [1]: d.Closed }) }, C$1({ ourProps: f2, theirProps: s2, slot: A2, defaultTag: Ie, name: "Menu" })));
}
let ge = "button";
function Re$1(e2, u2) {
  var R2;
  let r$12 = I$2(), { id: s2 = `headlessui-menu-button-${r$12}`, ...i2 } = e2, [t2, o3] = C("Menu.Button"), a2 = y(t2.buttonRef, u2), l2 = p(), m2 = o$5((p2) => {
    switch (p2.key) {
      case o$1.Space:
      case o$1.Enter:
      case o$1.ArrowDown:
        p2.preventDefault(), p2.stopPropagation(), o3({ type: 0 }), l2.nextFrame(() => o3({ type: 2, focus: c$1.First }));
        break;
      case o$1.ArrowUp:
        p2.preventDefault(), p2.stopPropagation(), o3({ type: 0 }), l2.nextFrame(() => o3({ type: 2, focus: c$1.Last }));
        break;
    }
  }), I2 = o$5((p2) => {
    switch (p2.key) {
      case o$1.Space:
        p2.preventDefault();
        break;
    }
  }), A2 = o$5((p2) => {
    if (r(p2.currentTarget))
      return p2.preventDefault();
    e2.disabled || (t2.menuState === 0 ? (o3({ type: 1 }), l2.nextFrame(() => {
      var M2;
      return (M2 = t2.buttonRef.current) == null ? void 0 : M2.focus({ preventScroll: true });
    })) : (p2.preventDefault(), o3({ type: 0 })));
  }), f2 = reactExports.useMemo(() => ({ open: t2.menuState === 0 }), [t2]), g2 = { ref: a2, id: s2, type: T(e2, t2.buttonRef), "aria-haspopup": "menu", "aria-controls": (R2 = t2.itemsRef.current) == null ? void 0 : R2.id, "aria-expanded": t2.menuState === 0, onKeyDown: m2, onKeyUp: I2, onClick: A2 };
  return C$1({ ourProps: g2, theirProps: i2, slot: f2, defaultTag: ge, name: "Menu.Button" });
}
let Ae = "div", be = O.RenderStrategy | O.Static;
function Ee(e2, u2) {
  var M2, b2;
  let r2 = I$2(), { id: s2 = `headlessui-menu-items-${r2}`, ...i2 } = e2, [t2, o3] = C("Menu.Items"), a2 = y(t2.itemsRef, u2), l2 = n$1(t2.itemsRef), m2 = p(), I2 = u$1(), A2 = (() => I2 !== null ? (I2 & d.Open) === d.Open : t2.menuState === 0)();
  reactExports.useEffect(() => {
    let n2 = t2.itemsRef.current;
    n2 && t2.menuState === 0 && n2 !== (l2 == null ? void 0 : l2.activeElement) && n2.focus({ preventScroll: true });
  }, [t2.menuState, t2.itemsRef, l2]), F$1({ container: t2.itemsRef.current, enabled: t2.menuState === 0, accept(n2) {
    return n2.getAttribute("role") === "menuitem" ? NodeFilter.FILTER_REJECT : n2.hasAttribute("role") ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT;
  }, walk(n2) {
    n2.setAttribute("role", "none");
  } });
  let f2 = o$5((n2) => {
    var E2, x2;
    switch (m2.dispose(), n2.key) {
      case o$1.Space:
        if (t2.searchQuery !== "")
          return n2.preventDefault(), n2.stopPropagation(), o3({ type: 3, value: n2.key });
      case o$1.Enter:
        if (n2.preventDefault(), n2.stopPropagation(), o3({ type: 1 }), t2.activeItemIndex !== null) {
          let { dataRef: S2 } = t2.items[t2.activeItemIndex];
          (x2 = (E2 = S2.current) == null ? void 0 : E2.domRef.current) == null || x2.click();
        }
        D$1(t2.buttonRef.current);
        break;
      case o$1.ArrowDown:
        return n2.preventDefault(), n2.stopPropagation(), o3({ type: 2, focus: c$1.Next });
      case o$1.ArrowUp:
        return n2.preventDefault(), n2.stopPropagation(), o3({ type: 2, focus: c$1.Previous });
      case o$1.Home:
      case o$1.PageUp:
        return n2.preventDefault(), n2.stopPropagation(), o3({ type: 2, focus: c$1.First });
      case o$1.End:
      case o$1.PageDown:
        return n2.preventDefault(), n2.stopPropagation(), o3({ type: 2, focus: c$1.Last });
      case o$1.Escape:
        n2.preventDefault(), n2.stopPropagation(), o3({ type: 1 }), o$4().nextFrame(() => {
          var S2;
          return (S2 = t2.buttonRef.current) == null ? void 0 : S2.focus({ preventScroll: true });
        });
        break;
      case o$1.Tab:
        n2.preventDefault(), n2.stopPropagation(), o3({ type: 1 }), o$4().nextFrame(() => {
          _(t2.buttonRef.current, n2.shiftKey ? M$2.Previous : M$2.Next);
        });
        break;
      default:
        n2.key.length === 1 && (o3({ type: 3, value: n2.key }), m2.setTimeout(() => o3({ type: 4 }), 350));
        break;
    }
  }), g2 = o$5((n2) => {
    switch (n2.key) {
      case o$1.Space:
        n2.preventDefault();
        break;
    }
  }), R2 = reactExports.useMemo(() => ({ open: t2.menuState === 0 }), [t2]), p$12 = { "aria-activedescendant": t2.activeItemIndex === null || (M2 = t2.items[t2.activeItemIndex]) == null ? void 0 : M2.id, "aria-labelledby": (b2 = t2.buttonRef.current) == null ? void 0 : b2.id, id: s2, onKeyDown: f2, onKeyUp: g2, role: "menu", tabIndex: 0, ref: a2 };
  return C$1({ ourProps: p$12, theirProps: i2, slot: R2, defaultTag: Ae, features: be, visible: A2, name: "Menu.Items" });
}
let Se$1 = reactExports.Fragment;
function xe$1(e2, u2) {
  let r2 = I$2(), { id: s$12 = `headlessui-menu-item-${r2}`, disabled: i2 = false, ...t2 } = e2, [o3, a2] = C("Menu.Item"), l2 = o3.activeItemIndex !== null ? o3.items[o3.activeItemIndex].id === s$12 : false, m2 = reactExports.useRef(null), I2 = y(u2, m2);
  l$2(() => {
    if (o3.__demoMode || o3.menuState !== 0 || !l2 || o3.activationTrigger === 0)
      return;
    let T2 = o$4();
    return T2.requestAnimationFrame(() => {
      var P2, B2;
      (B2 = (P2 = m2.current) == null ? void 0 : P2.scrollIntoView) == null || B2.call(P2, { block: "nearest" });
    }), T2.dispose;
  }, [o3.__demoMode, m2, l2, o3.menuState, o3.activationTrigger, o3.activeItemIndex]);
  let A2 = s(m2), f2 = reactExports.useRef({ disabled: i2, domRef: m2, get textValue() {
    return A2();
  } });
  l$2(() => {
    f2.current.disabled = i2;
  }, [f2, i2]), l$2(() => (a2({ type: 5, id: s$12, dataRef: f2 }), () => a2({ type: 6, id: s$12 })), [f2, s$12]);
  let g2 = o$5(() => {
    a2({ type: 1 });
  }), R2 = o$5((T2) => {
    if (i2)
      return T2.preventDefault();
    a2({ type: 1 }), D$1(o3.buttonRef.current);
  }), p2 = o$5(() => {
    if (i2)
      return a2({ type: 2, focus: c$1.Nothing });
    a2({ type: 2, focus: c$1.Specific, id: s$12 });
  }), M2 = u$2(), b2 = o$5((T2) => M2.update(T2)), n2 = o$5((T2) => {
    M2.wasMoved(T2) && (i2 || l2 || a2({ type: 2, focus: c$1.Specific, id: s$12, trigger: 0 }));
  }), E2 = o$5((T2) => {
    M2.wasMoved(T2) && (i2 || l2 && a2({ type: 2, focus: c$1.Nothing }));
  }), x2 = reactExports.useMemo(() => ({ active: l2, disabled: i2, close: g2 }), [l2, i2, g2]);
  return C$1({ ourProps: { id: s$12, ref: I2, role: "menuitem", tabIndex: i2 === true ? void 0 : -1, "aria-disabled": i2 === true ? true : void 0, disabled: void 0, onClick: R2, onFocus: p2, onPointerEnter: b2, onMouseEnter: b2, onPointerMove: n2, onMouseMove: n2, onPointerLeave: E2, onMouseLeave: E2 }, theirProps: t2, slot: x2, defaultTag: Se$1, name: "Menu.Item" });
}
let Pe$1 = U$2(Me), ve = U$2(Re$1), he = U$2(Ee), De$1 = U$2(xe$1), qe$1 = Object.assign(Pe$1, { Button: ve, Items: he, Item: De$1 });
function c(a2 = 0) {
  let [l2, r2] = reactExports.useState(a2), t2 = f(), o3 = reactExports.useCallback((e2) => {
    t2.current && r2((u2) => u2 | e2);
  }, [l2, t2]), m2 = reactExports.useCallback((e2) => Boolean(l2 & e2), [l2]), s2 = reactExports.useCallback((e2) => {
    t2.current && r2((u2) => u2 & ~e2);
  }, [r2, t2]), g2 = reactExports.useCallback((e2) => {
    t2.current && r2((u2) => u2 ^ e2);
  }, [r2]);
  return { flags: l2, addFlag: o3, hasFlag: m2, removeFlag: s2, toggleFlag: g2 };
}
function l(r2) {
  let e2 = { called: false };
  return (...t2) => {
    if (!e2.called)
      return e2.called = true, r2(...t2);
  };
}
function g(t2, ...e2) {
  t2 && e2.length > 0 && t2.classList.add(...e2);
}
function v(t2, ...e2) {
  t2 && e2.length > 0 && t2.classList.remove(...e2);
}
function b(t2, e2) {
  let n2 = o$4();
  if (!t2)
    return n2.dispose;
  let { transitionDuration: m2, transitionDelay: a2 } = getComputedStyle(t2), [u2, p2] = [m2, a2].map((l2) => {
    let [r2 = 0] = l2.split(",").filter(Boolean).map((i2) => i2.includes("ms") ? parseFloat(i2) : parseFloat(i2) * 1e3).sort((i2, T2) => T2 - i2);
    return r2;
  }), o3 = u2 + p2;
  if (o3 !== 0) {
    n2.group((r2) => {
      r2.setTimeout(() => {
        e2(), r2.dispose();
      }, o3), r2.addEventListener(t2, "transitionrun", (i2) => {
        i2.target === i2.currentTarget && r2.dispose();
      });
    });
    let l2 = n2.addEventListener(t2, "transitionend", (r2) => {
      r2.target === r2.currentTarget && (e2(), l2());
    });
  } else
    e2();
  return n2.add(() => e2()), n2.dispose;
}
function M$1(t2, e2, n2, m2) {
  let a2 = n2 ? "enter" : "leave", u2 = o$4(), p2 = m2 !== void 0 ? l(m2) : () => {
  };
  a2 === "enter" && (t2.removeAttribute("hidden"), t2.style.display = "");
  let o3 = u$4(a2, { enter: () => e2.enter, leave: () => e2.leave }), l$12 = u$4(a2, { enter: () => e2.enterTo, leave: () => e2.leaveTo }), r2 = u$4(a2, { enter: () => e2.enterFrom, leave: () => e2.leaveFrom });
  return v(t2, ...e2.base, ...e2.enter, ...e2.enterTo, ...e2.enterFrom, ...e2.leave, ...e2.leaveFrom, ...e2.leaveTo, ...e2.entered), g(t2, ...e2.base, ...o3, ...r2), u2.nextFrame(() => {
    v(t2, ...e2.base, ...o3, ...r2), g(t2, ...e2.base, ...o3, ...l$12), b(t2, () => (v(t2, ...e2.base, ...o3), g(t2, ...e2.base, ...e2.entered), p2()));
  }), u2.dispose;
}
function D({ immediate: t2, container: s2, direction: n2, classes: u2, onStart: a2, onStop: c2 }) {
  let l2 = f(), d2 = p(), e2 = s$4(n2);
  l$2(() => {
    t2 && (e2.current = "enter");
  }, [t2]), l$2(() => {
    let r2 = o$4();
    d2.add(r2.dispose);
    let i2 = s2.current;
    if (i2 && e2.current !== "idle" && l2.current)
      return r2.dispose(), a2.current(e2.current), r2.add(M$1(i2, u2.current, e2.current === "enter", () => {
        r2.dispose(), c2.current(e2.current);
      })), r2.dispose;
  }, [n2]);
}
function S(t2 = "") {
  return t2.split(/\s+/).filter((n2) => n2.length > 1);
}
let I = reactExports.createContext(null);
I.displayName = "TransitionContext";
var Se = ((r2) => (r2.Visible = "visible", r2.Hidden = "hidden", r2))(Se || {});
function ye() {
  let t2 = reactExports.useContext(I);
  if (t2 === null)
    throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");
  return t2;
}
function xe() {
  let t2 = reactExports.useContext(M);
  if (t2 === null)
    throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");
  return t2;
}
let M = reactExports.createContext(null);
M.displayName = "NestingContext";
function U(t2) {
  return "children" in t2 ? U(t2.children) : t2.current.filter(({ el: n2 }) => n2.current !== null).filter(({ state: n2 }) => n2 === "visible").length > 0;
}
function se(t2, n2) {
  let r2 = s$4(t2), s2 = reactExports.useRef([]), R2 = f(), D2 = p(), p$12 = o$5((i2, e2 = v$1.Hidden) => {
    let a2 = s2.current.findIndex(({ el: o3 }) => o3 === i2);
    a2 !== -1 && (u$4(e2, { [v$1.Unmount]() {
      s2.current.splice(a2, 1);
    }, [v$1.Hidden]() {
      s2.current[a2].state = "hidden";
    } }), D2.microTask(() => {
      var o3;
      !U(s2) && R2.current && ((o3 = r2.current) == null || o3.call(r2));
    }));
  }), x2 = o$5((i2) => {
    let e2 = s2.current.find(({ el: a2 }) => a2 === i2);
    return e2 ? e2.state !== "visible" && (e2.state = "visible") : s2.current.push({ el: i2, state: "visible" }), () => p$12(i2, v$1.Unmount);
  }), h2 = reactExports.useRef([]), v2 = reactExports.useRef(Promise.resolve()), u2 = reactExports.useRef({ enter: [], leave: [], idle: [] }), g2 = o$5((i2, e2, a2) => {
    h2.current.splice(0), n2 && (n2.chains.current[e2] = n2.chains.current[e2].filter(([o3]) => o3 !== i2)), n2 == null || n2.chains.current[e2].push([i2, new Promise((o3) => {
      h2.current.push(o3);
    })]), n2 == null || n2.chains.current[e2].push([i2, new Promise((o3) => {
      Promise.all(u2.current[e2].map(([f2, N2]) => N2)).then(() => o3());
    })]), e2 === "enter" ? v2.current = v2.current.then(() => n2 == null ? void 0 : n2.wait.current).then(() => a2(e2)) : a2(e2);
  }), d2 = o$5((i2, e2, a2) => {
    Promise.all(u2.current[e2].splice(0).map(([o3, f2]) => f2)).then(() => {
      var o3;
      (o3 = h2.current.shift()) == null || o3();
    }).then(() => a2(e2));
  });
  return reactExports.useMemo(() => ({ children: s2, register: x2, unregister: p$12, onStart: g2, onStop: d2, wait: v2, chains: u2 }), [x2, p$12, s2, g2, d2, u2, v2]);
}
function Ne() {
}
let Pe = ["beforeEnter", "afterEnter", "beforeLeave", "afterLeave"];
function ae(t2) {
  var r2;
  let n2 = {};
  for (let s2 of Pe)
    n2[s2] = (r2 = t2[s2]) != null ? r2 : Ne;
  return n2;
}
function Re(t2) {
  let n2 = reactExports.useRef(ae(t2));
  return reactExports.useEffect(() => {
    n2.current = ae(t2);
  }, [t2]), n2;
}
let De = "div", le = O.RenderStrategy;
function He(t$12, n2) {
  var Q2, Y2;
  let { beforeEnter: r2, afterEnter: s2, beforeLeave: R2, afterLeave: D$12, enter: p2, enterFrom: x2, enterTo: h2, entered: v2, leave: u2, leaveFrom: g2, leaveTo: d$12, ...i2 } = t$12, e2 = reactExports.useRef(null), a2 = y(e2, n2), o3 = (Q2 = i2.unmount) == null || Q2 ? v$1.Unmount : v$1.Hidden, { show: f2, appear: N2, initial: T2 } = ye(), [l2, j] = reactExports.useState(f2 ? "visible" : "hidden"), z2 = xe(), { register: L2, unregister: O2 } = z2;
  reactExports.useEffect(() => L2(e2), [L2, e2]), reactExports.useEffect(() => {
    if (o3 === v$1.Hidden && e2.current) {
      if (f2 && l2 !== "visible") {
        j("visible");
        return;
      }
      return u$4(l2, { ["hidden"]: () => O2(e2), ["visible"]: () => L2(e2) });
    }
  }, [l2, e2, L2, O2, f2, o3]);
  let k2 = s$4({ base: S(i2.className), enter: S(p2), enterFrom: S(x2), enterTo: S(h2), entered: S(v2), leave: S(u2), leaveFrom: S(g2), leaveTo: S(d$12) }), V2 = Re({ beforeEnter: r2, afterEnter: s2, beforeLeave: R2, afterLeave: D$12 }), G2 = l$1();
  reactExports.useEffect(() => {
    if (G2 && l2 === "visible" && e2.current === null)
      throw new Error("Did you forget to passthrough the `ref` to the actual DOM node?");
  }, [e2, l2, G2]);
  let Te2 = T2 && !N2, K2 = N2 && f2 && T2, de2 = (() => !G2 || Te2 ? "idle" : f2 ? "enter" : "leave")(), H2 = c(0), fe2 = o$5((C2) => u$4(C2, { enter: () => {
    H2.addFlag(d.Opening), V2.current.beforeEnter();
  }, leave: () => {
    H2.addFlag(d.Closing), V2.current.beforeLeave();
  }, idle: () => {
  } })), me2 = o$5((C2) => u$4(C2, { enter: () => {
    H2.removeFlag(d.Opening), V2.current.afterEnter();
  }, leave: () => {
    H2.removeFlag(d.Closing), V2.current.afterLeave();
  }, idle: () => {
  } })), w2 = se(() => {
    j("hidden"), O2(e2);
  }, z2), B2 = reactExports.useRef(false);
  D({ immediate: K2, container: e2, classes: k2, direction: de2, onStart: s$4((C2) => {
    B2.current = true, w2.onStart(e2, C2, fe2);
  }), onStop: s$4((C2) => {
    B2.current = false, w2.onStop(e2, C2, me2), C2 === "leave" && !U(w2) && (j("hidden"), O2(e2));
  }) });
  let P2 = i2, ce2 = { ref: a2 };
  return K2 ? P2 = { ...P2, className: t(i2.className, ...k2.current.enter, ...k2.current.enterFrom) } : B2.current && (P2.className = t(i2.className, (Y2 = e2.current) == null ? void 0 : Y2.className), P2.className === "" && delete P2.className), React.createElement(M.Provider, { value: w2 }, React.createElement(s$1, { value: u$4(l2, { ["visible"]: d.Open, ["hidden"]: d.Closed }) | H2.flags }, C$1({ ourProps: ce2, theirProps: P2, defaultTag: De, features: le, visible: l2 === "visible", name: "Transition.Child" })));
}
function Fe(t2, n2) {
  let { show: r2, appear: s2 = false, unmount: R2 = true, ...D2 } = t2, p2 = reactExports.useRef(null), x2 = y(p2, n2);
  l$1();
  let h2 = u$1();
  if (r2 === void 0 && h2 !== null && (r2 = (h2 & d.Open) === d.Open), ![true, false].includes(r2))
    throw new Error("A <Transition /> is used but it is missing a `show={true | false}` prop.");
  let [v2, u2] = reactExports.useState(r2 ? "visible" : "hidden"), g2 = se(() => {
    u2("hidden");
  }), [d$12, i2] = reactExports.useState(true), e2 = reactExports.useRef([r2]);
  l$2(() => {
    d$12 !== false && e2.current[e2.current.length - 1] !== r2 && (e2.current.push(r2), i2(false));
  }, [e2, r2]);
  let a2 = reactExports.useMemo(() => ({ show: r2, appear: s2, initial: d$12 }), [r2, s2, d$12]);
  reactExports.useEffect(() => {
    if (r2)
      u2("visible");
    else if (!U(g2))
      u2("hidden");
    else {
      let T2 = p2.current;
      if (!T2)
        return;
      let l2 = T2.getBoundingClientRect();
      l2.x === 0 && l2.y === 0 && l2.width === 0 && l2.height === 0 && u2("hidden");
    }
  }, [r2, g2]);
  let o3 = { unmount: R2 }, f2 = o$5(() => {
    var T2;
    d$12 && i2(false), (T2 = t2.beforeEnter) == null || T2.call(t2);
  }), N2 = o$5(() => {
    var T2;
    d$12 && i2(false), (T2 = t2.beforeLeave) == null || T2.call(t2);
  });
  return React.createElement(M.Provider, { value: g2 }, React.createElement(I.Provider, { value: a2 }, C$1({ ourProps: { ...o3, as: reactExports.Fragment, children: React.createElement(ue, { ref: x2, ...o3, ...D2, beforeEnter: f2, beforeLeave: N2 }) }, theirProps: {}, defaultTag: reactExports.Fragment, features: le, visible: v2 === "visible", name: "Transition" })));
}
function _e(t2, n2) {
  let r2 = reactExports.useContext(I) !== null, s2 = u$1() !== null;
  return React.createElement(React.Fragment, null, !r2 && s2 ? React.createElement(q, { ref: n2, ...t2 }) : React.createElement(ue, { ref: n2, ...t2 }));
}
let q = U$2(Fe), ue = U$2(He), Le = U$2(_e), qe = Object.assign(q, { Child: Le, Root: q });
const sizeClasses = {
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-16 w-16 text-xl",
  xl: "h-24 w-24 text-2xl"
};
const Avatar = ({ user, size = "md", className, showOnline }) => {
  const sizeClass = sizeClasses[size];
  const hasPicture = user == null ? void 0 : user.profilePictureUrl;
  const getInitials = (name) => {
    return name.split(" ").map((n2) => n2[0]).join("").toUpperCase().slice(0, 2);
  };
  if (hasPicture) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: classNames("relative inline-flex items-center justify-center", className), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: user.profilePictureUrl,
          alt: user.name,
          className: classNames(
            "rounded-full object-cover border-2 border-white dark:border-slate-800",
            sizeClass
          ),
          onError: (e2) => {
            const target = e2.target;
            target.style.display = "none";
            const parent2 = target.parentElement;
            if (parent2) {
              parent2.innerHTML = `
                <div class="${sizeClass} rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-semibold border-2 border-white dark:border-slate-800">
                  ${getInitials(user.name)}
                </div>
              `;
            }
          }
        }
      ),
      showOnline && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-0 right-0 h-3 w-3 bg-success-500 border-2 border-white dark:border-slate-800 rounded-full" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: classNames("relative inline-flex items-center justify-center", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: classNames(
          "rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-semibold border-2 border-white dark:border-slate-800 shadow-md",
          sizeClass
        ),
        children: user ? getInitials(user.name) : /* @__PURE__ */ jsxRuntimeExports.jsx(UserCircleIcon$1, { className: "h-full w-full" })
      }
    ),
    showOnline && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-0 right-0 h-3 w-3 bg-success-500 border-2 border-white dark:border-slate-800 rounded-full" })
  ] });
};
const UserMenu = () => {
  const { user, logout } = useAuth();
  if (!user)
    return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(qe$1, { as: "div", className: "relative inline-block text-left", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(qe$1.Button, { className: "flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/70 px-3 py-1.5 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { user, size: "sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "hidden sm:flex flex-col items-start leading-tight", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-900 dark:text-slate-100 font-medium", children: user.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 dark:text-slate-400", children: user.role })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      qe,
      {
        as: reactExports.Fragment,
        enter: "transition ease-out duration-100",
        enterFrom: "transform opacity-0 scale-95",
        enterTo: "transform opacity-100 scale-100",
        leave: "transition ease-in duration-75",
        leaveFrom: "transform opacity-100 scale-100",
        leaveTo: "transform opacity-0 scale-95",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(qe$1.Items, { className: "absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-soft-lg focus:outline-none z-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 border-b border-slate-200 dark:border-slate-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { user, size: "md" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-slate-900 dark:text-slate-100 truncate", children: user.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 truncate", children: user.email })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(qe$1.Item, { children: ({ active }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/profile",
                className: classNames(
                  "flex items-center gap-3 w-full px-4 py-2 text-sm",
                  active ? "bg-primary-50 dark:bg-primary-600/10 text-primary-600 dark:text-primary-200" : "text-slate-700 dark:text-slate-200"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(UserCircleIcon$1, { className: "h-5 w-5" }),
                  "Mi Perfil"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(qe$1.Item, { children: ({ active }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: logout,
                className: classNames(
                  "flex items-center gap-3 w-full px-4 py-2 text-sm rounded-b-xl",
                  active ? "bg-error-50 dark:bg-error-900/20 text-error-600 dark:text-error-400" : "text-slate-700 dark:text-slate-200"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightOnRectangleIcon$1, { className: "h-5 w-5" }),
                  "Cerrar Sesión"
                ]
              }
            ) })
          ] })
        ] })
      }
    )
  ] });
};
const useDebouncedValue = (value, delay = 400) => {
  const [debounced, setDebounced] = reactExports.useState(value);
  reactExports.useEffect(() => {
    const id2 = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id2);
  }, [value, delay]);
  return debounced;
};
const TopBar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = reactExports.useState(searchParams.get("search") ?? "");
  const debounced = useDebouncedValue(query);
  const onSubmit = (event2) => {
    event2.preventDefault();
    navigate({ pathname: "/events", search: debounced ? `?search=${encodeURIComponent(debounced)}` : "" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-100 dark:border-slate-800", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "relative flex-1 max-w-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MagnifyingGlassIcon$1, { className: "h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "search",
          name: "search",
          value: query,
          onChange: (event2) => setQuery(event2.target.value),
          placeholder: "Search events, groups or notifications",
          className: "w-full rounded-full border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(UserMenu, {})
    ] })
  ] }) });
};
const PageContainer = ({ children }) => /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 px-4 py-6 md:px-8 lg:px-12 space-y-6 bg-surface-light/60 dark:bg-slate-950/60 min-h-[calc(100vh-64px)]", children });
const AUTH_ROUTES = ["/login", "/register"];
const AppShell = ({ children }) => {
  const location2 = useLocation();
  const { user } = useAuth();
  const isAuthRoute = reactExports.useMemo(() => AUTH_ROUTES.includes(location2.pathname), [location2.pathname]);
  if (!user && isAuthRoute) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
  }
  if (!user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center", children });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-surface-light dark:bg-surface-dark text-slate-900 dark:text-slate-100 flex", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TopBar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageContainer, { children })
    ] })
  ] });
};
const variants = {
  success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-200 border-emerald-200 dark:border-emerald-700",
  error: "bg-rose-500/10 text-rose-700 dark:text-rose-200 border-rose-200 dark:border-rose-700",
  info: "bg-primary-500/10 text-primary-700 dark:text-primary-200 border-primary-200 dark:border-primary-700"
};
const Toast = ({ toast, onDismiss }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  "div",
  {
    className: classNames(
      "w-80 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur",
      "flex flex-col gap-1",
      variants[toast.type]
    ),
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: toast.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onDismiss(toast.id), className: "text-xs text-slate-400 hover:text-slate-600", "aria-label": "Dismiss", children: /* @__PURE__ */ jsxRuntimeExports.jsx(XMarkIcon$1, { className: "h-4 w-4" }) })
      ] }),
      toast.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 dark:text-slate-300", children: toast.description })
    ]
  }
);
const NotificationCenter = ({ toasts }) => {
  const { dismissToast } = useToast();
  const stack = toasts ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-4 right-4 flex flex-col gap-3 z-50", children: stack.map((toast) => /* @__PURE__ */ jsxRuntimeExports.jsx(Toast, { toast, onDismiss: dismissToast }, toast.id)) });
};
class ErrorBoundary extends reactExports.Component {
  constructor() {
    super(...arguments);
    __publicField(this, "state", { hasError: false, error: null });
    __publicField(this, "handleReset", () => {
      this.setState({ hasError: false, error: null });
    });
    __publicField(this, "handleGoHome", () => {
      this.handleReset();
      window.location.href = "/";
    });
    __publicField(this, "handleReload", () => {
      window.location.href = "/";
    });
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary captured an error", error, errorInfo);
  }
  render() {
    var _a;
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card max-w-md w-full text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-full bg-error-100 dark:bg-error-900/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExclamationTriangleIcon$1, { className: "h-8 w-8 text-error-600 dark:text-error-400" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-slate-900 dark:text-white mb-2", children: "Algo salió mal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400 mb-6", children: ((_a = this.state.error) == null ? void 0 : _a.message) || "Ocurrió un error inesperado. Serás redirigido al inicio." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: this.handleGoHome, className: "btn-primary w-full", children: "Ir al Inicio" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: this.handleReload, className: "btn-secondary w-full", children: "Recargar Aplicación" })
        ] })
      ] }) });
    }
    return this.props.children;
  }
}
const App = () => {
  const { toasts } = useToast();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ErrorBoundary, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingOverlay, { message: "Cargando interfaz" }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Routes, { children: [
      publicRoutes.map((route) => /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: route.path, element: route.element }, route.path)),
      privateRoutes.map((route) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Route,
        {
          path: route.path,
          element: /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { children: route.element })
        },
        route.path
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: fallbackRoute.path, element: fallbackRoute.element })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationCenter, { toasts })
  ] });
};
const index = "";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});
client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ToastProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BrowserRouter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) }) }) }) }) }) })
);
export {
  Avatar as A,
  BellAlertIcon$1 as B,
  CalendarDaysIcon$1 as C,
  noop$1 as D,
  isServer as E,
  isValidTimeout as F,
  timeUntilStale as G,
  focusManager as H,
  canFetch as I,
  replaceData as J,
  isCancelledError as K,
  LoadingOverlay as L,
  MagnifyingGlassIcon$1 as M,
  parseQueryArgs as N,
  useLocation as O,
  PAGINATION_SIZES as P,
  QrCodeIcon$1 as Q,
  React as R,
  SockJS as S,
  UserPlusIcon$1 as U,
  XMarkIcon$1 as X,
  Link as a,
  useSearchParams as b,
  classNames as c,
  useDebouncedValue as d,
  Client as e,
  apiClient as f,
  useToast as g,
  useParams as h,
  useQueryClient as i,
  jsxRuntimeExports as j,
  ChatBubbleLeftRightIcon$1 as k,
  useNavigate as l,
  updateProfile as m,
  useTheme as n,
  UserCircleIcon$1 as o,
  presenceService as p,
  ClipboardDocumentListIcon$1 as q,
  reactExports as r,
  storage as s,
  tokenStorageKey as t,
  useAuth as u,
  Subscribable as v,
  shallowEqualObjects as w,
  getDefaultState as x,
  notifyManager as y,
  parseMutationArgs as z
};
