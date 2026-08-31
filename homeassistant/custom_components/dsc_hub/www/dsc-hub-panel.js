var nq = Object.defineProperty;
var iq = (n, e, t) => e in n ? nq(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var rb = (n, e, t) => iq(n, typeof e != "symbol" ? e + "" : e, t);
function ZP(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var TN = { exports: {} }, ab = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var B2;
function rq() {
  if (B2) return ab;
  B2 = 1;
  var n = Symbol.for("react.transitional.element"), e = Symbol.for("react.fragment");
  function t(i, r, a) {
    var s = null;
    if (a !== void 0 && (s = "" + a), r.key !== void 0 && (s = "" + r.key), "key" in r) {
      a = {};
      for (var o in r)
        o !== "key" && (a[o] = r[o]);
    } else a = r;
    return r = a.ref, {
      $$typeof: n,
      type: i,
      key: s,
      ref: r !== void 0 ? r : null,
      props: a
    };
  }
  return ab.Fragment = e, ab.jsx = t, ab.jsxs = t, ab;
}
var U2;
function aq() {
  return U2 || (U2 = 1, TN.exports = rq()), TN.exports;
}
var g = aq(), EN = { exports: {} }, vn = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var j2;
function sq() {
  if (j2) return vn;
  j2 = 1;
  var n = Symbol.for("react.transitional.element"), e = Symbol.for("react.portal"), t = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), r = Symbol.for("react.profiler"), a = Symbol.for("react.consumer"), s = Symbol.for("react.context"), o = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), c = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), h = Symbol.for("react.activity"), p = Symbol.iterator;
  function v($) {
    return $ === null || typeof $ != "object" ? null : ($ = p && $[p] || $["@@iterator"], typeof $ == "function" ? $ : null);
  }
  var y = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, w = Object.assign, S = {};
  function x($, re, ce) {
    this.props = $, this.context = re, this.refs = S, this.updater = ce || y;
  }
  x.prototype.isReactComponent = {}, x.prototype.setState = function($, re) {
    if (typeof $ != "object" && typeof $ != "function" && $ != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, $, re, "setState");
  }, x.prototype.forceUpdate = function($) {
    this.updater.enqueueForceUpdate(this, $, "forceUpdate");
  };
  function E() {
  }
  E.prototype = x.prototype;
  function C($, re, ce) {
    this.props = $, this.context = re, this.refs = S, this.updater = ce || y;
  }
  var A = C.prototype = new E();
  A.constructor = C, w(A, x.prototype), A.isPureReactComponent = !0;
  var k = Array.isArray;
  function D() {
  }
  var O = { H: null, A: null, T: null, S: null }, F = Object.prototype.hasOwnProperty;
  function P($, re, ce) {
    var ie = ce.ref;
    return {
      $$typeof: n,
      type: $,
      key: re,
      ref: ie !== void 0 ? ie : null,
      props: ce
    };
  }
  function I($, re) {
    return P($.type, re, $.props);
  }
  function U($) {
    return typeof $ == "object" && $ !== null && $.$$typeof === n;
  }
  function W($) {
    var re = { "=": "=0", ":": "=2" };
    return "$" + $.replace(/[=:]/g, function(ce) {
      return re[ce];
    });
  }
  var V = /\/+/g;
  function Y($, re) {
    return typeof $ == "object" && $ !== null && $.key != null ? W("" + $.key) : re.toString(36);
  }
  function q($) {
    switch ($.status) {
      case "fulfilled":
        return $.value;
      case "rejected":
        throw $.reason;
      default:
        switch (typeof $.status == "string" ? $.then(D, D) : ($.status = "pending", $.then(
          function(re) {
            $.status === "pending" && ($.status = "fulfilled", $.value = re);
          },
          function(re) {
            $.status === "pending" && ($.status = "rejected", $.reason = re);
          }
        )), $.status) {
          case "fulfilled":
            return $.value;
          case "rejected":
            throw $.reason;
        }
    }
    throw $;
  }
  function G($, re, ce, ie, he) {
    var _e = typeof $;
    (_e === "undefined" || _e === "boolean") && ($ = null);
    var ye = !1;
    if ($ === null) ye = !0;
    else
      switch (_e) {
        case "bigint":
        case "string":
        case "number":
          ye = !0;
          break;
        case "object":
          switch ($.$$typeof) {
            case n:
            case e:
              ye = !0;
              break;
            case d:
              return ye = $._init, G(
                ye($._payload),
                re,
                ce,
                ie,
                he
              );
          }
      }
    if (ye)
      return he = he($), ye = ie === "" ? "." + Y($, 0) : ie, k(he) ? (ce = "", ye != null && (ce = ye.replace(V, "$&/") + "/"), G(he, re, ce, "", function(qe) {
        return qe;
      })) : he != null && (U(he) && (he = I(
        he,
        ce + (he.key == null || $ && $.key === he.key ? "" : ("" + he.key).replace(
          V,
          "$&/"
        ) + "/") + ye
      )), re.push(he)), 1;
    ye = 0;
    var Ve = ie === "" ? "." : ie + ":";
    if (k($))
      for (var je = 0; je < $.length; je++)
        ie = $[je], _e = Ve + Y(ie, je), ye += G(
          ie,
          re,
          ce,
          _e,
          he
        );
    else if (je = v($), typeof je == "function")
      for ($ = je.call($), je = 0; !(ie = $.next()).done; )
        ie = ie.value, _e = Ve + Y(ie, je++), ye += G(
          ie,
          re,
          ce,
          _e,
          he
        );
    else if (_e === "object") {
      if (typeof $.then == "function")
        return G(
          q($),
          re,
          ce,
          ie,
          he
        );
      throw re = String($), Error(
        "Objects are not valid as a React child (found: " + (re === "[object Object]" ? "object with keys {" + Object.keys($).join(", ") + "}" : re) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return ye;
  }
  function Z($, re, ce) {
    if ($ == null) return $;
    var ie = [], he = 0;
    return G($, ie, "", "", function(_e) {
      return re.call(ce, _e, he++);
    }), ie;
  }
  function J($) {
    if ($._status === -1) {
      var re = $._result;
      re = re(), re.then(
        function(ce) {
          ($._status === 0 || $._status === -1) && ($._status = 1, $._result = ce);
        },
        function(ce) {
          ($._status === 0 || $._status === -1) && ($._status = 2, $._result = ce);
        }
      ), $._status === -1 && ($._status = 0, $._result = re);
    }
    if ($._status === 1) return $._result.default;
    throw $._result;
  }
  var se = typeof reportError == "function" ? reportError : function($) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var re = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof $ == "object" && $ !== null && typeof $.message == "string" ? String($.message) : String($),
        error: $
      });
      if (!window.dispatchEvent(re)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", $);
      return;
    }
    console.error($);
  }, le = {
    map: Z,
    forEach: function($, re, ce) {
      Z(
        $,
        function() {
          re.apply(this, arguments);
        },
        ce
      );
    },
    count: function($) {
      var re = 0;
      return Z($, function() {
        re++;
      }), re;
    },
    toArray: function($) {
      return Z($, function(re) {
        return re;
      }) || [];
    },
    only: function($) {
      if (!U($))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return $;
    }
  };
  return vn.Activity = h, vn.Children = le, vn.Component = x, vn.Fragment = t, vn.Profiler = r, vn.PureComponent = C, vn.StrictMode = i, vn.Suspense = l, vn.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = O, vn.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function($) {
      return O.H.useMemoCache($);
    }
  }, vn.cache = function($) {
    return function() {
      return $.apply(null, arguments);
    };
  }, vn.cacheSignal = function() {
    return null;
  }, vn.cloneElement = function($, re, ce) {
    if ($ == null)
      throw Error(
        "The argument must be a React element, but you passed " + $ + "."
      );
    var ie = w({}, $.props), he = $.key;
    if (re != null)
      for (_e in re.key !== void 0 && (he = "" + re.key), re)
        !F.call(re, _e) || _e === "key" || _e === "__self" || _e === "__source" || _e === "ref" && re.ref === void 0 || (ie[_e] = re[_e]);
    var _e = arguments.length - 2;
    if (_e === 1) ie.children = ce;
    else if (1 < _e) {
      for (var ye = Array(_e), Ve = 0; Ve < _e; Ve++)
        ye[Ve] = arguments[Ve + 2];
      ie.children = ye;
    }
    return P($.type, he, ie);
  }, vn.createContext = function($) {
    return $ = {
      $$typeof: s,
      _currentValue: $,
      _currentValue2: $,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, $.Provider = $, $.Consumer = {
      $$typeof: a,
      _context: $
    }, $;
  }, vn.createElement = function($, re, ce) {
    var ie, he = {}, _e = null;
    if (re != null)
      for (ie in re.key !== void 0 && (_e = "" + re.key), re)
        F.call(re, ie) && ie !== "key" && ie !== "__self" && ie !== "__source" && (he[ie] = re[ie]);
    var ye = arguments.length - 2;
    if (ye === 1) he.children = ce;
    else if (1 < ye) {
      for (var Ve = Array(ye), je = 0; je < ye; je++)
        Ve[je] = arguments[je + 2];
      he.children = Ve;
    }
    if ($ && $.defaultProps)
      for (ie in ye = $.defaultProps, ye)
        he[ie] === void 0 && (he[ie] = ye[ie]);
    return P($, _e, he);
  }, vn.createRef = function() {
    return { current: null };
  }, vn.forwardRef = function($) {
    return { $$typeof: o, render: $ };
  }, vn.isValidElement = U, vn.lazy = function($) {
    return {
      $$typeof: d,
      _payload: { _status: -1, _result: $ },
      _init: J
    };
  }, vn.memo = function($, re) {
    return {
      $$typeof: c,
      type: $,
      compare: re === void 0 ? null : re
    };
  }, vn.startTransition = function($) {
    var re = O.T, ce = {};
    O.T = ce;
    try {
      var ie = $(), he = O.S;
      he !== null && he(ce, ie), typeof ie == "object" && ie !== null && typeof ie.then == "function" && ie.then(D, se);
    } catch (_e) {
      se(_e);
    } finally {
      re !== null && ce.types !== null && (re.types = ce.types), O.T = re;
    }
  }, vn.unstable_useCacheRefresh = function() {
    return O.H.useCacheRefresh();
  }, vn.use = function($) {
    return O.H.use($);
  }, vn.useActionState = function($, re, ce) {
    return O.H.useActionState($, re, ce);
  }, vn.useCallback = function($, re) {
    return O.H.useCallback($, re);
  }, vn.useContext = function($) {
    return O.H.useContext($);
  }, vn.useDebugValue = function() {
  }, vn.useDeferredValue = function($, re) {
    return O.H.useDeferredValue($, re);
  }, vn.useEffect = function($, re) {
    return O.H.useEffect($, re);
  }, vn.useEffectEvent = function($) {
    return O.H.useEffectEvent($);
  }, vn.useId = function() {
    return O.H.useId();
  }, vn.useImperativeHandle = function($, re, ce) {
    return O.H.useImperativeHandle($, re, ce);
  }, vn.useInsertionEffect = function($, re) {
    return O.H.useInsertionEffect($, re);
  }, vn.useLayoutEffect = function($, re) {
    return O.H.useLayoutEffect($, re);
  }, vn.useMemo = function($, re) {
    return O.H.useMemo($, re);
  }, vn.useOptimistic = function($, re) {
    return O.H.useOptimistic($, re);
  }, vn.useReducer = function($, re, ce) {
    return O.H.useReducer($, re, ce);
  }, vn.useRef = function($) {
    return O.H.useRef($);
  }, vn.useState = function($) {
    return O.H.useState($);
  }, vn.useSyncExternalStore = function($, re, ce) {
    return O.H.useSyncExternalStore(
      $,
      re,
      ce
    );
  }, vn.useTransition = function() {
    return O.H.useTransition();
  }, vn.version = "19.2.8", vn;
}
var H2;
function MS() {
  return H2 || (H2 = 1, EN.exports = sq()), EN.exports;
}
var j = MS();
const j8 = /* @__PURE__ */ ZP(j);
var CN = { exports: {} }, sb = {}, AN = { exports: {} }, RN = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var V2;
function oq() {
  return V2 || (V2 = 1, (function(n) {
    function e(G, Z) {
      var J = G.length;
      G.push(Z);
      e: for (; 0 < J; ) {
        var se = J - 1 >>> 1, le = G[se];
        if (0 < r(le, Z))
          G[se] = Z, G[J] = le, J = se;
        else break e;
      }
    }
    function t(G) {
      return G.length === 0 ? null : G[0];
    }
    function i(G) {
      if (G.length === 0) return null;
      var Z = G[0], J = G.pop();
      if (J !== Z) {
        G[0] = J;
        e: for (var se = 0, le = G.length, $ = le >>> 1; se < $; ) {
          var re = 2 * (se + 1) - 1, ce = G[re], ie = re + 1, he = G[ie];
          if (0 > r(ce, J))
            ie < le && 0 > r(he, ce) ? (G[se] = he, G[ie] = J, se = ie) : (G[se] = ce, G[re] = J, se = re);
          else if (ie < le && 0 > r(he, J))
            G[se] = he, G[ie] = J, se = ie;
          else break e;
        }
      }
      return Z;
    }
    function r(G, Z) {
      var J = G.sortIndex - Z.sortIndex;
      return J !== 0 ? J : G.id - Z.id;
    }
    if (n.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var a = performance;
      n.unstable_now = function() {
        return a.now();
      };
    } else {
      var s = Date, o = s.now();
      n.unstable_now = function() {
        return s.now() - o;
      };
    }
    var l = [], c = [], d = 1, h = null, p = 3, v = !1, y = !1, w = !1, S = !1, x = typeof setTimeout == "function" ? setTimeout : null, E = typeof clearTimeout == "function" ? clearTimeout : null, C = typeof setImmediate < "u" ? setImmediate : null;
    function A(G) {
      for (var Z = t(c); Z !== null; ) {
        if (Z.callback === null) i(c);
        else if (Z.startTime <= G)
          i(c), Z.sortIndex = Z.expirationTime, e(l, Z);
        else break;
        Z = t(c);
      }
    }
    function k(G) {
      if (w = !1, A(G), !y)
        if (t(l) !== null)
          y = !0, D || (D = !0, W());
        else {
          var Z = t(c);
          Z !== null && q(k, Z.startTime - G);
        }
    }
    var D = !1, O = -1, F = 5, P = -1;
    function I() {
      return S ? !0 : !(n.unstable_now() - P < F);
    }
    function U() {
      if (S = !1, D) {
        var G = n.unstable_now();
        P = G;
        var Z = !0;
        try {
          e: {
            y = !1, w && (w = !1, E(O), O = -1), v = !0;
            var J = p;
            try {
              t: {
                for (A(G), h = t(l); h !== null && !(h.expirationTime > G && I()); ) {
                  var se = h.callback;
                  if (typeof se == "function") {
                    h.callback = null, p = h.priorityLevel;
                    var le = se(
                      h.expirationTime <= G
                    );
                    if (G = n.unstable_now(), typeof le == "function") {
                      h.callback = le, A(G), Z = !0;
                      break t;
                    }
                    h === t(l) && i(l), A(G);
                  } else i(l);
                  h = t(l);
                }
                if (h !== null) Z = !0;
                else {
                  var $ = t(c);
                  $ !== null && q(
                    k,
                    $.startTime - G
                  ), Z = !1;
                }
              }
              break e;
            } finally {
              h = null, p = J, v = !1;
            }
            Z = void 0;
          }
        } finally {
          Z ? W() : D = !1;
        }
      }
    }
    var W;
    if (typeof C == "function")
      W = function() {
        C(U);
      };
    else if (typeof MessageChannel < "u") {
      var V = new MessageChannel(), Y = V.port2;
      V.port1.onmessage = U, W = function() {
        Y.postMessage(null);
      };
    } else
      W = function() {
        x(U, 0);
      };
    function q(G, Z) {
      O = x(function() {
        G(n.unstable_now());
      }, Z);
    }
    n.unstable_IdlePriority = 5, n.unstable_ImmediatePriority = 1, n.unstable_LowPriority = 4, n.unstable_NormalPriority = 3, n.unstable_Profiling = null, n.unstable_UserBlockingPriority = 2, n.unstable_cancelCallback = function(G) {
      G.callback = null;
    }, n.unstable_forceFrameRate = function(G) {
      0 > G || 125 < G ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : F = 0 < G ? Math.floor(1e3 / G) : 5;
    }, n.unstable_getCurrentPriorityLevel = function() {
      return p;
    }, n.unstable_next = function(G) {
      switch (p) {
        case 1:
        case 2:
        case 3:
          var Z = 3;
          break;
        default:
          Z = p;
      }
      var J = p;
      p = Z;
      try {
        return G();
      } finally {
        p = J;
      }
    }, n.unstable_requestPaint = function() {
      S = !0;
    }, n.unstable_runWithPriority = function(G, Z) {
      switch (G) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          G = 3;
      }
      var J = p;
      p = G;
      try {
        return Z();
      } finally {
        p = J;
      }
    }, n.unstable_scheduleCallback = function(G, Z, J) {
      var se = n.unstable_now();
      switch (typeof J == "object" && J !== null ? (J = J.delay, J = typeof J == "number" && 0 < J ? se + J : se) : J = se, G) {
        case 1:
          var le = -1;
          break;
        case 2:
          le = 250;
          break;
        case 5:
          le = 1073741823;
          break;
        case 4:
          le = 1e4;
          break;
        default:
          le = 5e3;
      }
      return le = J + le, G = {
        id: d++,
        callback: Z,
        priorityLevel: G,
        startTime: J,
        expirationTime: le,
        sortIndex: -1
      }, J > se ? (G.sortIndex = J, e(c, G), t(l) === null && G === t(c) && (w ? (E(O), O = -1) : w = !0, q(k, J - se))) : (G.sortIndex = le, e(l, G), y || v || (y = !0, D || (D = !0, W()))), G;
    }, n.unstable_shouldYield = I, n.unstable_wrapCallback = function(G) {
      var Z = p;
      return function() {
        var J = p;
        p = Z;
        try {
          return G.apply(this, arguments);
        } finally {
          p = J;
        }
      };
    };
  })(RN)), RN;
}
var G2;
function H8() {
  return G2 || (G2 = 1, AN.exports = oq()), AN.exports;
}
var NN = { exports: {} }, rs = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var W2;
function lq() {
  if (W2) return rs;
  W2 = 1;
  var n = MS();
  function e(l) {
    var c = "https://react.dev/errors/" + l;
    if (1 < arguments.length) {
      c += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var d = 2; d < arguments.length; d++)
        c += "&args[]=" + encodeURIComponent(arguments[d]);
    }
    return "Minified React error #" + l + "; visit " + c + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function t() {
  }
  var i = {
    d: {
      f: t,
      r: function() {
        throw Error(e(522));
      },
      D: t,
      C: t,
      L: t,
      m: t,
      X: t,
      S: t,
      M: t
    },
    p: 0,
    findDOMNode: null
  }, r = Symbol.for("react.portal");
  function a(l, c, d) {
    var h = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: r,
      key: h == null ? null : "" + h,
      children: l,
      containerInfo: c,
      implementation: d
    };
  }
  var s = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function o(l, c) {
    if (l === "font") return "";
    if (typeof c == "string")
      return c === "use-credentials" ? c : "";
  }
  return rs.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i, rs.createPortal = function(l, c) {
    var d = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!c || c.nodeType !== 1 && c.nodeType !== 9 && c.nodeType !== 11)
      throw Error(e(299));
    return a(l, c, null, d);
  }, rs.flushSync = function(l) {
    var c = s.T, d = i.p;
    try {
      if (s.T = null, i.p = 2, l) return l();
    } finally {
      s.T = c, i.p = d, i.d.f();
    }
  }, rs.preconnect = function(l, c) {
    typeof l == "string" && (c ? (c = c.crossOrigin, c = typeof c == "string" ? c === "use-credentials" ? c : "" : void 0) : c = null, i.d.C(l, c));
  }, rs.prefetchDNS = function(l) {
    typeof l == "string" && i.d.D(l);
  }, rs.preinit = function(l, c) {
    if (typeof l == "string" && c && typeof c.as == "string") {
      var d = c.as, h = o(d, c.crossOrigin), p = typeof c.integrity == "string" ? c.integrity : void 0, v = typeof c.fetchPriority == "string" ? c.fetchPriority : void 0;
      d === "style" ? i.d.S(
        l,
        typeof c.precedence == "string" ? c.precedence : void 0,
        {
          crossOrigin: h,
          integrity: p,
          fetchPriority: v
        }
      ) : d === "script" && i.d.X(l, {
        crossOrigin: h,
        integrity: p,
        fetchPriority: v,
        nonce: typeof c.nonce == "string" ? c.nonce : void 0
      });
    }
  }, rs.preinitModule = function(l, c) {
    if (typeof l == "string")
      if (typeof c == "object" && c !== null) {
        if (c.as == null || c.as === "script") {
          var d = o(
            c.as,
            c.crossOrigin
          );
          i.d.M(l, {
            crossOrigin: d,
            integrity: typeof c.integrity == "string" ? c.integrity : void 0,
            nonce: typeof c.nonce == "string" ? c.nonce : void 0
          });
        }
      } else c == null && i.d.M(l);
  }, rs.preload = function(l, c) {
    if (typeof l == "string" && typeof c == "object" && c !== null && typeof c.as == "string") {
      var d = c.as, h = o(d, c.crossOrigin);
      i.d.L(l, d, {
        crossOrigin: h,
        integrity: typeof c.integrity == "string" ? c.integrity : void 0,
        nonce: typeof c.nonce == "string" ? c.nonce : void 0,
        type: typeof c.type == "string" ? c.type : void 0,
        fetchPriority: typeof c.fetchPriority == "string" ? c.fetchPriority : void 0,
        referrerPolicy: typeof c.referrerPolicy == "string" ? c.referrerPolicy : void 0,
        imageSrcSet: typeof c.imageSrcSet == "string" ? c.imageSrcSet : void 0,
        imageSizes: typeof c.imageSizes == "string" ? c.imageSizes : void 0,
        media: typeof c.media == "string" ? c.media : void 0
      });
    }
  }, rs.preloadModule = function(l, c) {
    if (typeof l == "string")
      if (c) {
        var d = o(c.as, c.crossOrigin);
        i.d.m(l, {
          as: typeof c.as == "string" && c.as !== "script" ? c.as : void 0,
          crossOrigin: d,
          integrity: typeof c.integrity == "string" ? c.integrity : void 0
        });
      } else i.d.m(l);
  }, rs.requestFormReset = function(l) {
    i.d.r(l);
  }, rs.unstable_batchedUpdates = function(l, c) {
    return l(c);
  }, rs.useFormState = function(l, c, d) {
    return s.H.useFormState(l, c, d);
  }, rs.useFormStatus = function() {
    return s.H.useHostTransitionStatus();
  }, rs.version = "19.2.8", rs;
}
var $2;
function V8() {
  if ($2) return NN.exports;
  $2 = 1;
  function n() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
      } catch (e) {
        console.error(e);
      }
  }
  return n(), NN.exports = lq(), NN.exports;
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var X2;
function cq() {
  if (X2) return sb;
  X2 = 1;
  var n = H8(), e = MS(), t = V8();
  function i(u) {
    var f = "https://react.dev/errors/" + u;
    if (1 < arguments.length) {
      f += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var b = 2; b < arguments.length; b++)
        f += "&args[]=" + encodeURIComponent(arguments[b]);
    }
    return "Minified React error #" + u + "; visit " + f + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function r(u) {
    return !(!u || u.nodeType !== 1 && u.nodeType !== 9 && u.nodeType !== 11);
  }
  function a(u) {
    var f = u, b = u;
    if (u.alternate) for (; f.return; ) f = f.return;
    else {
      u = f;
      do
        f = u, (f.flags & 4098) !== 0 && (b = f.return), u = f.return;
      while (u);
    }
    return f.tag === 3 ? b : null;
  }
  function s(u) {
    if (u.tag === 13) {
      var f = u.memoizedState;
      if (f === null && (u = u.alternate, u !== null && (f = u.memoizedState)), f !== null) return f.dehydrated;
    }
    return null;
  }
  function o(u) {
    if (u.tag === 31) {
      var f = u.memoizedState;
      if (f === null && (u = u.alternate, u !== null && (f = u.memoizedState)), f !== null) return f.dehydrated;
    }
    return null;
  }
  function l(u) {
    if (a(u) !== u)
      throw Error(i(188));
  }
  function c(u) {
    var f = u.alternate;
    if (!f) {
      if (f = a(u), f === null) throw Error(i(188));
      return f !== u ? null : u;
    }
    for (var b = u, M = f; ; ) {
      var N = b.return;
      if (N === null) break;
      var L = N.alternate;
      if (L === null) {
        if (M = N.return, M !== null) {
          b = M;
          continue;
        }
        break;
      }
      if (N.child === L.child) {
        for (L = N.child; L; ) {
          if (L === b) return l(N), u;
          if (L === M) return l(N), f;
          L = L.sibling;
        }
        throw Error(i(188));
      }
      if (b.return !== M.return) b = N, M = L;
      else {
        for (var H = !1, ee = N.child; ee; ) {
          if (ee === b) {
            H = !0, b = N, M = L;
            break;
          }
          if (ee === M) {
            H = !0, M = N, b = L;
            break;
          }
          ee = ee.sibling;
        }
        if (!H) {
          for (ee = L.child; ee; ) {
            if (ee === b) {
              H = !0, b = L, M = N;
              break;
            }
            if (ee === M) {
              H = !0, M = L, b = N;
              break;
            }
            ee = ee.sibling;
          }
          if (!H) throw Error(i(189));
        }
      }
      if (b.alternate !== M) throw Error(i(190));
    }
    if (b.tag !== 3) throw Error(i(188));
    return b.stateNode.current === b ? u : f;
  }
  function d(u) {
    var f = u.tag;
    if (f === 5 || f === 26 || f === 27 || f === 6) return u;
    for (u = u.child; u !== null; ) {
      if (f = d(u), f !== null) return f;
      u = u.sibling;
    }
    return null;
  }
  var h = Object.assign, p = Symbol.for("react.element"), v = Symbol.for("react.transitional.element"), y = Symbol.for("react.portal"), w = Symbol.for("react.fragment"), S = Symbol.for("react.strict_mode"), x = Symbol.for("react.profiler"), E = Symbol.for("react.consumer"), C = Symbol.for("react.context"), A = Symbol.for("react.forward_ref"), k = Symbol.for("react.suspense"), D = Symbol.for("react.suspense_list"), O = Symbol.for("react.memo"), F = Symbol.for("react.lazy"), P = Symbol.for("react.activity"), I = Symbol.for("react.memo_cache_sentinel"), U = Symbol.iterator;
  function W(u) {
    return u === null || typeof u != "object" ? null : (u = U && u[U] || u["@@iterator"], typeof u == "function" ? u : null);
  }
  var V = Symbol.for("react.client.reference");
  function Y(u) {
    if (u == null) return null;
    if (typeof u == "function")
      return u.$$typeof === V ? null : u.displayName || u.name || null;
    if (typeof u == "string") return u;
    switch (u) {
      case w:
        return "Fragment";
      case x:
        return "Profiler";
      case S:
        return "StrictMode";
      case k:
        return "Suspense";
      case D:
        return "SuspenseList";
      case P:
        return "Activity";
    }
    if (typeof u == "object")
      switch (u.$$typeof) {
        case y:
          return "Portal";
        case C:
          return u.displayName || "Context";
        case E:
          return (u._context.displayName || "Context") + ".Consumer";
        case A:
          var f = u.render;
          return u = u.displayName, u || (u = f.displayName || f.name || "", u = u !== "" ? "ForwardRef(" + u + ")" : "ForwardRef"), u;
        case O:
          return f = u.displayName || null, f !== null ? f : Y(u.type) || "Memo";
        case F:
          f = u._payload, u = u._init;
          try {
            return Y(u(f));
          } catch {
          }
      }
    return null;
  }
  var q = Array.isArray, G = e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Z = t.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, J = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, se = [], le = -1;
  function $(u) {
    return { current: u };
  }
  function re(u) {
    0 > le || (u.current = se[le], se[le] = null, le--);
  }
  function ce(u, f) {
    le++, se[le] = u.current, u.current = f;
  }
  var ie = $(null), he = $(null), _e = $(null), ye = $(null);
  function Ve(u, f) {
    switch (ce(_e, f), ce(he, u), ce(ie, null), f.nodeType) {
      case 9:
      case 11:
        u = (u = f.documentElement) && (u = u.namespaceURI) ? l2(u) : 0;
        break;
      default:
        if (u = f.tagName, f = f.namespaceURI)
          f = l2(f), u = c2(f, u);
        else
          switch (u) {
            case "svg":
              u = 1;
              break;
            case "math":
              u = 2;
              break;
            default:
              u = 0;
          }
    }
    re(ie), ce(ie, u);
  }
  function je() {
    re(ie), re(he), re(_e);
  }
  function qe(u) {
    u.memoizedState !== null && ce(ye, u);
    var f = ie.current, b = c2(f, u.type);
    f !== b && (ce(he, u), ce(ie, b));
  }
  function Ke(u) {
    he.current === u && (re(ie), re(he)), ye.current === u && (re(ye), eb._currentValue = J);
  }
  var Je, Fe;
  function K(u) {
    if (Je === void 0)
      try {
        throw Error();
      } catch (b) {
        var f = b.stack.trim().match(/\n( *(at )?)/);
        Je = f && f[1] || "", Fe = -1 < b.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < b.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + Je + u + Fe;
  }
  var _t = !1;
  function Ne(u, f) {
    if (!u || _t) return "";
    _t = !0;
    var b = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var M = {
        DetermineComponentFrameRoot: function() {
          try {
            if (f) {
              var Qe = function() {
                throw Error();
              };
              if (Object.defineProperty(Qe.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(Qe, []);
                } catch (Ge) {
                  var Pe = Ge;
                }
                Reflect.construct(u, [], Qe);
              } else {
                try {
                  Qe.call();
                } catch (Ge) {
                  Pe = Ge;
                }
                u.call(Qe.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (Ge) {
                Pe = Ge;
              }
              (Qe = u()) && typeof Qe.catch == "function" && Qe.catch(function() {
              });
            }
          } catch (Ge) {
            if (Ge && Pe && typeof Ge.stack == "string")
              return [Ge.stack, Pe.stack];
          }
          return [null, null];
        }
      };
      M.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var N = Object.getOwnPropertyDescriptor(
        M.DetermineComponentFrameRoot,
        "name"
      );
      N && N.configurable && Object.defineProperty(
        M.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var L = M.DetermineComponentFrameRoot(), H = L[0], ee = L[1];
      if (H && ee) {
        var ue = H.split(`
`), De = ee.split(`
`);
        for (N = M = 0; M < ue.length && !ue[M].includes("DetermineComponentFrameRoot"); )
          M++;
        for (; N < De.length && !De[N].includes(
          "DetermineComponentFrameRoot"
        ); )
          N++;
        if (M === ue.length || N === De.length)
          for (M = ue.length - 1, N = De.length - 1; 1 <= M && 0 <= N && ue[M] !== De[N]; )
            N--;
        for (; 1 <= M && 0 <= N; M--, N--)
          if (ue[M] !== De[N]) {
            if (M !== 1 || N !== 1)
              do
                if (M--, N--, 0 > N || ue[M] !== De[N]) {
                  var $e = `
` + ue[M].replace(" at new ", " at ");
                  return u.displayName && $e.includes("<anonymous>") && ($e = $e.replace("<anonymous>", u.displayName)), $e;
                }
              while (1 <= M && 0 <= N);
            break;
          }
      }
    } finally {
      _t = !1, Error.prepareStackTrace = b;
    }
    return (b = u ? u.displayName || u.name : "") ? K(b) : "";
  }
  function Be(u, f) {
    switch (u.tag) {
      case 26:
      case 27:
      case 5:
        return K(u.type);
      case 16:
        return K("Lazy");
      case 13:
        return u.child !== f && f !== null ? K("Suspense Fallback") : K("Suspense");
      case 19:
        return K("SuspenseList");
      case 0:
      case 15:
        return Ne(u.type, !1);
      case 11:
        return Ne(u.type.render, !1);
      case 1:
        return Ne(u.type, !0);
      case 31:
        return K("Activity");
      default:
        return "";
    }
  }
  function Ee(u) {
    try {
      var f = "", b = null;
      do
        f += Be(u, b), b = u, u = u.return;
      while (u);
      return f;
    } catch (M) {
      return `
Error generating stack: ` + M.message + `
` + M.stack;
    }
  }
  var tt = Object.prototype.hasOwnProperty, Re = n.unstable_scheduleCallback, te = n.unstable_cancelCallback, X = n.unstable_shouldYield, me = n.unstable_requestPaint, Ce = n.unstable_now, Ae = n.unstable_getCurrentPriorityLevel, xe = n.unstable_ImmediatePriority, ft = n.unstable_UserBlockingPriority, Me = n.unstable_NormalPriority, et = n.unstable_LowPriority, St = n.unstable_IdlePriority, nt = n.log, Tt = n.unstable_setDisableYieldValue, It = null, kt = null;
  function vt(u) {
    if (typeof nt == "function" && Tt(u), kt && typeof kt.setStrictMode == "function")
      try {
        kt.setStrictMode(It, u);
      } catch {
      }
  }
  var Wt = Math.clz32 ? Math.clz32 : pe, Se = Math.log, gt = Math.LN2;
  function pe(u) {
    return u >>>= 0, u === 0 ? 32 : 31 - (Se(u) / gt | 0) | 0;
  }
  var Ye = 256, Le = 262144, We = 4194304;
  function ct(u) {
    var f = u & 42;
    if (f !== 0) return f;
    switch (u & -u) {
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
        return 64;
      case 128:
        return 128;
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
        return u & 261888;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return u & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return u & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return u;
    }
  }
  function at(u, f, b) {
    var M = u.pendingLanes;
    if (M === 0) return 0;
    var N = 0, L = u.suspendedLanes, H = u.pingedLanes;
    u = u.warmLanes;
    var ee = M & 134217727;
    return ee !== 0 ? (M = ee & ~L, M !== 0 ? N = ct(M) : (H &= ee, H !== 0 ? N = ct(H) : b || (b = ee & ~u, b !== 0 && (N = ct(b))))) : (ee = M & ~L, ee !== 0 ? N = ct(ee) : H !== 0 ? N = ct(H) : b || (b = M & ~u, b !== 0 && (N = ct(b)))), N === 0 ? 0 : f !== 0 && f !== N && (f & L) === 0 && (L = N & -N, b = f & -f, L >= b || L === 32 && (b & 4194048) !== 0) ? f : N;
  }
  function At(u, f) {
    return (u.pendingLanes & ~(u.suspendedLanes & ~u.pingedLanes) & f) === 0;
  }
  function en(u, f) {
    switch (u) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return f + 250;
      case 16:
      case 32:
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
        return f + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function hn() {
    var u = We;
    return We <<= 1, (We & 62914560) === 0 && (We = 4194304), u;
  }
  function bn(u) {
    for (var f = [], b = 0; 31 > b; b++) f.push(u);
    return f;
  }
  function Fi(u, f) {
    u.pendingLanes |= f, f !== 268435456 && (u.suspendedLanes = 0, u.pingedLanes = 0, u.warmLanes = 0);
  }
  function Wi(u, f, b, M, N, L) {
    var H = u.pendingLanes;
    u.pendingLanes = b, u.suspendedLanes = 0, u.pingedLanes = 0, u.warmLanes = 0, u.expiredLanes &= b, u.entangledLanes &= b, u.errorRecoveryDisabledLanes &= b, u.shellSuspendCounter = 0;
    var ee = u.entanglements, ue = u.expirationTimes, De = u.hiddenUpdates;
    for (b = H & ~b; 0 < b; ) {
      var $e = 31 - Wt(b), Qe = 1 << $e;
      ee[$e] = 0, ue[$e] = -1;
      var Pe = De[$e];
      if (Pe !== null)
        for (De[$e] = null, $e = 0; $e < Pe.length; $e++) {
          var Ge = Pe[$e];
          Ge !== null && (Ge.lane &= -536870913);
        }
      b &= ~Qe;
    }
    M !== 0 && Or(u, M, 0), L !== 0 && N === 0 && u.tag !== 0 && (u.suspendedLanes |= L & ~(H & ~f));
  }
  function Or(u, f, b) {
    u.pendingLanes |= f, u.suspendedLanes &= ~f;
    var M = 31 - Wt(f);
    u.entangledLanes |= f, u.entanglements[M] = u.entanglements[M] | 1073741824 | b & 261930;
  }
  function gr(u, f) {
    var b = u.entangledLanes |= f;
    for (u = u.entanglements; b; ) {
      var M = 31 - Wt(b), N = 1 << M;
      N & f | u[M] & f && (u[M] |= f), b &= ~N;
    }
  }
  function Bi(u, f) {
    var b = f & -f;
    return b = (b & 42) !== 0 ? 1 : st(b), (b & (u.suspendedLanes | f)) !== 0 ? 0 : b;
  }
  function st(u) {
    switch (u) {
      case 2:
        u = 1;
        break;
      case 8:
        u = 4;
        break;
      case 32:
        u = 16;
        break;
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
        u = 128;
        break;
      case 268435456:
        u = 134217728;
        break;
      default:
        u = 0;
    }
    return u;
  }
  function wt(u) {
    return u &= -u, 2 < u ? 8 < u ? (u & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Bn() {
    var u = Z.p;
    return u !== 0 ? u : (u = window.event, u === void 0 ? 32 : D2(u.type));
  }
  function Ti(u, f) {
    var b = Z.p;
    try {
      return Z.p = u, f();
    } finally {
      Z.p = b;
    }
  }
  var Xr = Math.random().toString(36).slice(2), pi = "__reactFiber$" + Xr, _r = "__reactProps$" + Xr, Xa = "__reactContainer$" + Xr, Vs = "__reactEvents$" + Xr, Ho = "__reactListeners$" + Xr, Pu = "__reactHandles$" + Xr, Kd = "__reactResources$" + Xr, So = "__reactMarker$" + Xr;
  function Bl(u) {
    delete u[pi], delete u[_r], delete u[Vs], delete u[Ho], delete u[Pu];
  }
  function ne(u) {
    var f = u[pi];
    if (f) return f;
    for (var b = u.parentNode; b; ) {
      if (f = b[Xa] || b[pi]) {
        if (b = f.alternate, f.child !== null || b !== null && b.child !== null)
          for (u = v2(u); u !== null; ) {
            if (b = u[pi]) return b;
            u = v2(u);
          }
        return f;
      }
      u = b, b = u.parentNode;
    }
    return null;
  }
  function be(u) {
    if (u = u[pi] || u[Xa]) {
      var f = u.tag;
      if (f === 5 || f === 6 || f === 13 || f === 31 || f === 26 || f === 27 || f === 3)
        return u;
    }
    return null;
  }
  function Oe(u) {
    var f = u.tag;
    if (f === 5 || f === 26 || f === 27 || f === 6) return u.stateNode;
    throw Error(i(33));
  }
  function ze(u) {
    var f = u[Kd];
    return f || (f = u[Kd] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), f;
  }
  function ge(u) {
    u[So] = !0;
  }
  var ot = /* @__PURE__ */ new Set(), yt = {};
  function Et(u, f) {
    bt(u, f), bt(u + "Capture", f);
  }
  function bt(u, f) {
    for (yt[u] = f, u = 0; u < f.length; u++)
      ot.add(f[u]);
  }
  var Bt = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), qt = {}, xt = {};
  function In(u) {
    return tt.call(xt, u) ? !0 : tt.call(qt, u) ? !1 : Bt.test(u) ? xt[u] = !0 : (qt[u] = !0, !1);
  }
  function Pn(u, f, b) {
    if (In(f))
      if (b === null) u.removeAttribute(f);
      else {
        switch (typeof b) {
          case "undefined":
          case "function":
          case "symbol":
            u.removeAttribute(f);
            return;
          case "boolean":
            var M = f.toLowerCase().slice(0, 5);
            if (M !== "data-" && M !== "aria-") {
              u.removeAttribute(f);
              return;
            }
        }
        u.setAttribute(f, "" + b);
      }
  }
  function Ai(u, f, b) {
    if (b === null) u.removeAttribute(f);
    else {
      switch (typeof b) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          u.removeAttribute(f);
          return;
      }
      u.setAttribute(f, "" + b);
    }
  }
  function Zn(u, f, b, M) {
    if (M === null) u.removeAttribute(b);
    else {
      switch (typeof M) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          u.removeAttribute(b);
          return;
      }
      u.setAttributeNS(f, b, "" + M);
    }
  }
  function un(u) {
    switch (typeof u) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return u;
      case "object":
        return u;
      default:
        return "";
    }
  }
  function $t(u) {
    var f = u.type;
    return (u = u.nodeName) && u.toLowerCase() === "input" && (f === "checkbox" || f === "radio");
  }
  function yr(u, f, b) {
    var M = Object.getOwnPropertyDescriptor(
      u.constructor.prototype,
      f
    );
    if (!u.hasOwnProperty(f) && typeof M < "u" && typeof M.get == "function" && typeof M.set == "function") {
      var N = M.get, L = M.set;
      return Object.defineProperty(u, f, {
        configurable: !0,
        get: function() {
          return N.call(this);
        },
        set: function(H) {
          b = "" + H, L.call(this, H);
        }
      }), Object.defineProperty(u, f, {
        enumerable: M.enumerable
      }), {
        getValue: function() {
          return b;
        },
        setValue: function(H) {
          b = "" + H;
        },
        stopTracking: function() {
          u._valueTracker = null, delete u[f];
        }
      };
    }
  }
  function Un(u) {
    if (!u._valueTracker) {
      var f = $t(u) ? "checked" : "value";
      u._valueTracker = yr(
        u,
        f,
        "" + u[f]
      );
    }
  }
  function bi(u) {
    if (!u) return !1;
    var f = u._valueTracker;
    if (!f) return !0;
    var b = f.getValue(), M = "";
    return u && (M = $t(u) ? u.checked ? "true" : "false" : u.value), u = M, u !== b ? (f.setValue(u), !0) : !1;
  }
  function ri(u) {
    if (u = u || (typeof document < "u" ? document : void 0), typeof u > "u") return null;
    try {
      return u.activeElement || u.body;
    } catch {
      return u.body;
    }
  }
  var Yr = /[\n"\\]/g;
  function ur(u) {
    return u.replace(
      Yr,
      function(f) {
        return "\\" + f.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function ai(u, f, b, M, N, L, H, ee) {
    u.name = "", H != null && typeof H != "function" && typeof H != "symbol" && typeof H != "boolean" ? u.type = H : u.removeAttribute("type"), f != null ? H === "number" ? (f === 0 && u.value === "" || u.value != f) && (u.value = "" + un(f)) : u.value !== "" + un(f) && (u.value = "" + un(f)) : H !== "submit" && H !== "reset" || u.removeAttribute("value"), f != null ? $i(u, H, un(f)) : b != null ? $i(u, H, un(b)) : M != null && u.removeAttribute("value"), N == null && L != null && (u.defaultChecked = !!L), N != null && (u.checked = N && typeof N != "function" && typeof N != "symbol"), ee != null && typeof ee != "function" && typeof ee != "symbol" && typeof ee != "boolean" ? u.name = "" + un(ee) : u.removeAttribute("name");
  }
  function sa(u, f, b, M, N, L, H, ee) {
    if (L != null && typeof L != "function" && typeof L != "symbol" && typeof L != "boolean" && (u.type = L), f != null || b != null) {
      if (!(L !== "submit" && L !== "reset" || f != null)) {
        Un(u);
        return;
      }
      b = b != null ? "" + un(b) : "", f = f != null ? "" + un(f) : b, ee || f === u.value || (u.value = f), u.defaultValue = f;
    }
    M = M ?? N, M = typeof M != "function" && typeof M != "symbol" && !!M, u.checked = ee ? u.checked : !!M, u.defaultChecked = !!M, H != null && typeof H != "function" && typeof H != "symbol" && typeof H != "boolean" && (u.name = H), Un(u);
  }
  function $i(u, f, b) {
    f === "number" && ri(u.ownerDocument) === u || u.defaultValue === "" + b || (u.defaultValue = "" + b);
  }
  function Ui(u, f, b, M) {
    if (u = u.options, f) {
      f = {};
      for (var N = 0; N < b.length; N++)
        f["$" + b[N]] = !0;
      for (b = 0; b < u.length; b++)
        N = f.hasOwnProperty("$" + u[b].value), u[b].selected !== N && (u[b].selected = N), N && M && (u[b].defaultSelected = !0);
    } else {
      for (b = "" + un(b), f = null, N = 0; N < u.length; N++) {
        if (u[N].value === b) {
          u[N].selected = !0, M && (u[N].defaultSelected = !0);
          return;
        }
        f !== null || u[N].disabled || (f = u[N]);
      }
      f !== null && (f.selected = !0);
    }
  }
  function zr(u, f, b) {
    if (f != null && (f = "" + un(f), f !== u.value && (u.value = f), b == null)) {
      u.defaultValue !== f && (u.defaultValue = f);
      return;
    }
    u.defaultValue = b != null ? "" + un(b) : "";
  }
  function Ec(u, f, b, M) {
    if (f == null) {
      if (M != null) {
        if (b != null) throw Error(i(92));
        if (q(M)) {
          if (1 < M.length) throw Error(i(93));
          M = M[0];
        }
        b = M;
      }
      b == null && (b = ""), f = b;
    }
    b = un(f), u.defaultValue = b, M = u.textContent, M === b && M !== "" && M !== null && (u.value = M), Un(u);
  }
  function Da(u, f) {
    if (f) {
      var b = u.firstChild;
      if (b && b === u.lastChild && b.nodeType === 3) {
        b.nodeValue = f;
        return;
      }
    }
    u.textContent = f;
  }
  var t1 = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Dy(u, f, b) {
    var M = f.indexOf("--") === 0;
    b == null || typeof b == "boolean" || b === "" ? M ? u.setProperty(f, "") : f === "float" ? u.cssFloat = "" : u[f] = "" : M ? u.setProperty(f, b) : typeof b != "number" || b === 0 || t1.has(f) ? f === "float" ? u.cssFloat = b : u[f] = ("" + b).trim() : u[f] = b + "px";
  }
  function Ly(u, f, b) {
    if (f != null && typeof f != "object")
      throw Error(i(62));
    if (u = u.style, b != null) {
      for (var M in b)
        !b.hasOwnProperty(M) || f != null && f.hasOwnProperty(M) || (M.indexOf("--") === 0 ? u.setProperty(M, "") : M === "float" ? u.cssFloat = "" : u[M] = "");
      for (var N in f)
        M = f[N], f.hasOwnProperty(N) && b[N] !== M && Dy(u, N, M);
    } else
      for (var L in f)
        f.hasOwnProperty(L) && Dy(u, L, f[L]);
  }
  function gv(u) {
    if (u.indexOf("-") === -1) return !1;
    switch (u) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var n1 = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), Iy = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Wf(u) {
    return Iy.test("" + u) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : u;
  }
  function Ul() {
  }
  var _v = null;
  function yv(u) {
    return u = u.target || u.srcElement || window, u.correspondingUseElement && (u = u.correspondingUseElement), u.nodeType === 3 ? u.parentNode : u;
  }
  var Ou = null, Cc = null;
  function Py(u) {
    var f = be(u);
    if (f && (u = f.stateNode)) {
      var b = u[_r] || null;
      e: switch (u = f.stateNode, f.type) {
        case "input":
          if (ai(
            u,
            b.value,
            b.defaultValue,
            b.defaultValue,
            b.checked,
            b.defaultChecked,
            b.type,
            b.name
          ), f = b.name, b.type === "radio" && f != null) {
            for (b = u; b.parentNode; ) b = b.parentNode;
            for (b = b.querySelectorAll(
              'input[name="' + ur(
                "" + f
              ) + '"][type="radio"]'
            ), f = 0; f < b.length; f++) {
              var M = b[f];
              if (M !== u && M.form === u.form) {
                var N = M[_r] || null;
                if (!N) throw Error(i(90));
                ai(
                  M,
                  N.value,
                  N.defaultValue,
                  N.defaultValue,
                  N.checked,
                  N.defaultChecked,
                  N.type,
                  N.name
                );
              }
            }
            for (f = 0; f < b.length; f++)
              M = b[f], M.form === u.form && bi(M);
          }
          break e;
        case "textarea":
          zr(u, b.value, b.defaultValue);
          break e;
        case "select":
          f = b.value, f != null && Ui(u, !!b.multiple, f, !1);
      }
    }
  }
  var bv = !1;
  function Oy(u, f, b) {
    if (bv) return u(f, b);
    bv = !0;
    try {
      var M = u(f);
      return M;
    } finally {
      if (bv = !1, (Ou !== null || Cc !== null) && (Co(), Ou && (f = Ou, u = Cc, Cc = Ou = null, Py(f), u)))
        for (f = 0; f < u.length; f++) Py(u[f]);
    }
  }
  function Qd(u, f) {
    var b = u.stateNode;
    if (b === null) return null;
    var M = b[_r] || null;
    if (M === null) return null;
    b = M[f];
    e: switch (f) {
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
        (M = !M.disabled) || (u = u.type, M = !(u === "button" || u === "input" || u === "select" || u === "textarea")), u = !M;
        break e;
      default:
        u = !1;
    }
    if (u) return null;
    if (b && typeof b != "function")
      throw Error(
        i(231, f, typeof b)
      );
    return b;
  }
  var Vo = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), zy = !1;
  if (Vo)
    try {
      var Jd = {};
      Object.defineProperty(Jd, "passive", {
        get: function() {
          zy = !0;
        }
      }), window.addEventListener("test", Jd, Jd), window.removeEventListener("test", Jd, Jd);
    } catch {
      zy = !1;
    }
  var xs = null, xv = null, zu = null;
  function $f() {
    if (zu) return zu;
    var u, f = xv, b = f.length, M, N = "value" in xs ? xs.value : xs.textContent, L = N.length;
    for (u = 0; u < b && f[u] === N[u]; u++) ;
    var H = b - u;
    for (M = 1; M <= H && f[b - M] === N[L - M]; M++) ;
    return zu = N.slice(u, 1 < M ? 1 - M : void 0);
  }
  function Xf(u) {
    var f = u.keyCode;
    return "charCode" in u ? (u = u.charCode, u === 0 && f === 13 && (u = 13)) : u = f, u === 10 && (u = 13), 32 <= u || u === 13 ? u : 0;
  }
  function eh() {
    return !0;
  }
  function i1() {
    return !1;
  }
  function La(u) {
    function f(b, M, N, L, H) {
      this._reactName = b, this._targetInst = N, this.type = M, this.nativeEvent = L, this.target = H, this.currentTarget = null;
      for (var ee in u)
        u.hasOwnProperty(ee) && (b = u[ee], this[ee] = b ? b(L) : L[ee]);
      return this.isDefaultPrevented = (L.defaultPrevented != null ? L.defaultPrevented : L.returnValue === !1) ? eh : i1, this.isPropagationStopped = i1, this;
    }
    return h(f.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var b = this.nativeEvent;
        b && (b.preventDefault ? b.preventDefault() : typeof b.returnValue != "unknown" && (b.returnValue = !1), this.isDefaultPrevented = eh);
      },
      stopPropagation: function() {
        var b = this.nativeEvent;
        b && (b.stopPropagation ? b.stopPropagation() : typeof b.cancelBubble != "unknown" && (b.cancelBubble = !0), this.isPropagationStopped = eh);
      },
      persist: function() {
      },
      isPersistent: eh
    }), f;
  }
  var Ac = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(u) {
      return u.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, Yf = La(Ac), th = h({}, Ac, { view: 0, detail: 0 }), r1 = La(th), qf, Sv, nh, ih = h({}, th, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: Ev,
    button: 0,
    buttons: 0,
    relatedTarget: function(u) {
      return u.relatedTarget === void 0 ? u.fromElement === u.srcElement ? u.toElement : u.fromElement : u.relatedTarget;
    },
    movementX: function(u) {
      return "movementX" in u ? u.movementX : (u !== nh && (nh && u.type === "mousemove" ? (qf = u.screenX - nh.screenX, Sv = u.screenY - nh.screenY) : Sv = qf = 0, nh = u), qf);
    },
    movementY: function(u) {
      return "movementY" in u ? u.movementY : Sv;
    }
  }), Fy = La(ih), a1 = h({}, ih, { dataTransfer: 0 }), s1 = La(a1), By = h({}, th, { relatedTarget: 0 }), wv = La(By), o1 = h({}, Ac, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), WR = La(o1), $R = h({}, Ac, {
    clipboardData: function(u) {
      return "clipboardData" in u ? u.clipboardData : window.clipboardData;
    }
  }), l1 = La($R), Zf = h({}, Ac, { data: 0 }), Mv = La(Zf), Tv = {
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
  }, c1 = {
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
  }, u1 = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function Uy(u) {
    var f = this.nativeEvent;
    return f.getModifierState ? f.getModifierState(u) : (u = u1[u]) ? !!f[u] : !1;
  }
  function Ev() {
    return Uy;
  }
  var d1 = h({}, th, {
    key: function(u) {
      if (u.key) {
        var f = Tv[u.key] || u.key;
        if (f !== "Unidentified") return f;
      }
      return u.type === "keypress" ? (u = Xf(u), u === 13 ? "Enter" : String.fromCharCode(u)) : u.type === "keydown" || u.type === "keyup" ? c1[u.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Ev,
    charCode: function(u) {
      return u.type === "keypress" ? Xf(u) : 0;
    },
    keyCode: function(u) {
      return u.type === "keydown" || u.type === "keyup" ? u.keyCode : 0;
    },
    which: function(u) {
      return u.type === "keypress" ? Xf(u) : u.type === "keydown" || u.type === "keyup" ? u.keyCode : 0;
    }
  }), Fu = La(d1), Cv = h({}, ih, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), jy = La(Cv), Hy = h({}, th, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Ev
  }), h1 = La(Hy), f1 = h({}, Ac, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), XR = La(f1), oa = h({}, ih, {
    deltaX: function(u) {
      return "deltaX" in u ? u.deltaX : "wheelDeltaX" in u ? -u.wheelDeltaX : 0;
    },
    deltaY: function(u) {
      return "deltaY" in u ? u.deltaY : "wheelDeltaY" in u ? -u.wheelDeltaY : "wheelDelta" in u ? -u.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), p1 = La(oa), m1 = h({}, Ac, {
    newState: 0,
    oldState: 0
  }), v1 = La(m1), g1 = [9, 13, 27, 32], Bu = Vo && "CompositionEvent" in window, rh = null;
  Vo && "documentMode" in document && (rh = document.documentMode);
  var Av = Vo && "TextEvent" in window && !rh, Vy = Vo && (!Bu || rh && 8 < rh && 11 >= rh), _1 = " ", Kf = !1;
  function Rv(u, f) {
    switch (u) {
      case "keyup":
        return g1.indexOf(f.keyCode) !== -1;
      case "keydown":
        return f.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Gy(u) {
    return u = u.detail, typeof u == "object" && "data" in u ? u.data : null;
  }
  var Uu = !1;
  function y1(u, f) {
    switch (u) {
      case "compositionend":
        return Gy(f);
      case "keypress":
        return f.which !== 32 ? null : (Kf = !0, _1);
      case "textInput":
        return u = f.data, u === _1 && Kf ? null : u;
      default:
        return null;
    }
  }
  function Wy(u, f) {
    if (Uu)
      return u === "compositionend" || !Bu && Rv(u, f) ? (u = $f(), zu = xv = xs = null, Uu = !1, u) : null;
    switch (u) {
      case "paste":
        return null;
      case "keypress":
        if (!(f.ctrlKey || f.altKey || f.metaKey) || f.ctrlKey && f.altKey) {
          if (f.char && 1 < f.char.length)
            return f.char;
          if (f.which) return String.fromCharCode(f.which);
        }
        return null;
      case "compositionend":
        return Vy && f.locale !== "ko" ? null : f.data;
      default:
        return null;
    }
  }
  var $y = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  function Xy(u) {
    var f = u && u.nodeName && u.nodeName.toLowerCase();
    return f === "input" ? !!$y[u.type] : f === "textarea";
  }
  function Nv(u, f, b, M) {
    Ou ? Cc ? Cc.push(M) : Cc = [M] : Ou = M, f = Mw(f, "onChange"), 0 < f.length && (b = new Yf(
      "onChange",
      "change",
      null,
      b,
      M
    ), u.push({ event: b, listeners: f }));
  }
  var Rc = null, ju = null;
  function b1(u) {
    n2(u, 0);
  }
  function ah(u) {
    var f = Oe(u);
    if (bi(f)) return u;
  }
  function Yy(u, f) {
    if (u === "change") return f;
  }
  var Go = !1;
  if (Vo) {
    var Qf;
    if (Vo) {
      var qy = "oninput" in document;
      if (!qy) {
        var Zy = document.createElement("div");
        Zy.setAttribute("oninput", "return;"), qy = typeof Zy.oninput == "function";
      }
      Qf = qy;
    } else Qf = !1;
    Go = Qf && (!document.documentMode || 9 < document.documentMode);
  }
  function Gs() {
    Rc && (Rc.detachEvent("onpropertychange", Jf), ju = Rc = null);
  }
  function Jf(u) {
    if (u.propertyName === "value" && ah(ju)) {
      var f = [];
      Nv(
        f,
        ju,
        u,
        yv(u)
      ), Oy(b1, f);
    }
  }
  function x1(u, f, b) {
    u === "focusin" ? (Gs(), Rc = f, ju = b, Rc.attachEvent("onpropertychange", Jf)) : u === "focusout" && Gs();
  }
  function Ky(u) {
    if (u === "selectionchange" || u === "keyup" || u === "keydown")
      return ah(ju);
  }
  function S1(u, f) {
    if (u === "click") return ah(f);
  }
  function w1(u, f) {
    if (u === "input" || u === "change")
      return ah(f);
  }
  function Qy(u, f) {
    return u === f && (u !== 0 || 1 / u === 1 / f) || u !== u && f !== f;
  }
  var Ia = typeof Object.is == "function" ? Object.is : Qy;
  function sh(u, f) {
    if (Ia(u, f)) return !0;
    if (typeof u != "object" || u === null || typeof f != "object" || f === null)
      return !1;
    var b = Object.keys(u), M = Object.keys(f);
    if (b.length !== M.length) return !1;
    for (M = 0; M < b.length; M++) {
      var N = b[M];
      if (!tt.call(f, N) || !Ia(u[N], f[N]))
        return !1;
    }
    return !0;
  }
  function ep(u) {
    for (; u && u.firstChild; ) u = u.firstChild;
    return u;
  }
  function oh(u, f) {
    var b = ep(u);
    u = 0;
    for (var M; b; ) {
      if (b.nodeType === 3) {
        if (M = u + b.textContent.length, u <= f && M >= f)
          return { node: b, offset: f - u };
        u = M;
      }
      e: {
        for (; b; ) {
          if (b.nextSibling) {
            b = b.nextSibling;
            break e;
          }
          b = b.parentNode;
        }
        b = void 0;
      }
      b = ep(b);
    }
  }
  function Ri(u, f) {
    return u && f ? u === f ? !0 : u && u.nodeType === 3 ? !1 : f && f.nodeType === 3 ? Ri(u, f.parentNode) : "contains" in u ? u.contains(f) : u.compareDocumentPosition ? !!(u.compareDocumentPosition(f) & 16) : !1 : !1;
  }
  function M1(u) {
    u = u != null && u.ownerDocument != null && u.ownerDocument.defaultView != null ? u.ownerDocument.defaultView : window;
    for (var f = ri(u.document); f instanceof u.HTMLIFrameElement; ) {
      try {
        var b = typeof f.contentWindow.location.href == "string";
      } catch {
        b = !1;
      }
      if (b) u = f.contentWindow;
      else break;
      f = ri(u.document);
    }
    return f;
  }
  function Jy(u) {
    var f = u && u.nodeName && u.nodeName.toLowerCase();
    return f && (f === "input" && (u.type === "text" || u.type === "search" || u.type === "tel" || u.type === "url" || u.type === "password") || f === "textarea" || u.contentEditable === "true");
  }
  var T1 = Vo && "documentMode" in document && 11 >= document.documentMode, Wo = null, $o = null, lh = null, kv = !1;
  function ch(u, f, b) {
    var M = b.window === b ? b.document : b.nodeType === 9 ? b : b.ownerDocument;
    kv || Wo == null || Wo !== ri(M) || (M = Wo, "selectionStart" in M && Jy(M) ? M = { start: M.selectionStart, end: M.selectionEnd } : (M = (M.ownerDocument && M.ownerDocument.defaultView || window).getSelection(), M = {
      anchorNode: M.anchorNode,
      anchorOffset: M.anchorOffset,
      focusNode: M.focusNode,
      focusOffset: M.focusOffset
    }), lh && sh(lh, M) || (lh = M, M = Mw($o, "onSelect"), 0 < M.length && (f = new Yf(
      "onSelect",
      "select",
      null,
      f,
      b
    ), u.push({ event: f, listeners: M }), f.target = Wo)));
  }
  function ba(u, f) {
    var b = {};
    return b[u.toLowerCase()] = f.toLowerCase(), b["Webkit" + u] = "webkit" + f, b["Moz" + u] = "moz" + f, b;
  }
  var Hu = {
    animationend: ba("Animation", "AnimationEnd"),
    animationiteration: ba("Animation", "AnimationIteration"),
    animationstart: ba("Animation", "AnimationStart"),
    transitionrun: ba("Transition", "TransitionRun"),
    transitionstart: ba("Transition", "TransitionStart"),
    transitioncancel: ba("Transition", "TransitionCancel"),
    transitionend: ba("Transition", "TransitionEnd")
  }, tp = {}, e0 = {};
  Vo && (e0 = document.createElement("div").style, "AnimationEvent" in window || (delete Hu.animationend.animation, delete Hu.animationiteration.animation, delete Hu.animationstart.animation), "TransitionEvent" in window || delete Hu.transitionend.transition);
  function jl(u) {
    if (tp[u]) return tp[u];
    if (!Hu[u]) return u;
    var f = Hu[u], b;
    for (b in f)
      if (f.hasOwnProperty(b) && b in e0)
        return tp[u] = f[b];
    return u;
  }
  var Dv = jl("animationend"), np = jl("animationiteration"), t0 = jl("animationstart"), E1 = jl("transitionrun"), YR = jl("transitionstart"), C1 = jl("transitioncancel"), n0 = jl("transitionend"), Ws = /* @__PURE__ */ new Map(), ip = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  ip.push("scrollEnd");
  function $s(u, f) {
    Ws.set(u, f), Et(f, [u]);
  }
  var rp = typeof reportError == "function" ? reportError : function(u) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var f = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof u == "object" && u !== null && typeof u.message == "string" ? String(u.message) : String(u),
        error: u
      });
      if (!window.dispatchEvent(f)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", u);
      return;
    }
    console.error(u);
  }, Xs = [], Hl = 0, qr = 0;
  function ap() {
    for (var u = Hl, f = qr = Hl = 0; f < u; ) {
      var b = Xs[f];
      Xs[f++] = null;
      var M = Xs[f];
      Xs[f++] = null;
      var N = Xs[f];
      Xs[f++] = null;
      var L = Xs[f];
      if (Xs[f++] = null, M !== null && N !== null) {
        var H = M.pending;
        H === null ? N.next = N : (N.next = H.next, H.next = N), M.pending = N;
      }
      L !== 0 && Nc(b, N, L);
    }
  }
  function Zr(u, f, b, M) {
    Xs[Hl++] = u, Xs[Hl++] = f, Xs[Hl++] = b, Xs[Hl++] = M, qr |= M, u.lanes |= M, u = u.alternate, u !== null && (u.lanes |= M);
  }
  function Lv(u, f, b, M) {
    return Zr(u, f, b, M), Ys(u);
  }
  function Pa(u, f) {
    return Zr(u, null, null, f), Ys(u);
  }
  function Nc(u, f, b) {
    u.lanes |= b;
    var M = u.alternate;
    M !== null && (M.lanes |= b);
    for (var N = !1, L = u.return; L !== null; )
      L.childLanes |= b, M = L.alternate, M !== null && (M.childLanes |= b), L.tag === 22 && (u = L.stateNode, u === null || u._visibility & 1 || (N = !0)), u = L, L = L.return;
    return u.tag === 3 ? (L = u.stateNode, N && f !== null && (N = 31 - Wt(b), u = L.hiddenUpdates, M = u[N], M === null ? u[N] = [f] : M.push(f), f.lane = b | 536870912), L) : null;
  }
  function Ys(u) {
    if (50 < qc)
      throw qc = 0, od = null, Error(i(185));
    for (var f = u.return; f !== null; )
      u = f, f = u.return;
    return u.tag === 3 ? u.stateNode : null;
  }
  var kc = {};
  function i0(u, f, b, M) {
    this.tag = u, this.key = b, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = f, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = M, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function er(u, f, b, M) {
    return new i0(u, f, b, M);
  }
  function Iv(u) {
    return u = u.prototype, !(!u || !u.isReactComponent);
  }
  function Ya(u, f) {
    var b = u.alternate;
    return b === null ? (b = er(
      u.tag,
      f,
      u.key,
      u.mode
    ), b.elementType = u.elementType, b.type = u.type, b.stateNode = u.stateNode, b.alternate = u, u.alternate = b) : (b.pendingProps = f, b.type = u.type, b.flags = 0, b.subtreeFlags = 0, b.deletions = null), b.flags = u.flags & 65011712, b.childLanes = u.childLanes, b.lanes = u.lanes, b.child = u.child, b.memoizedProps = u.memoizedProps, b.memoizedState = u.memoizedState, b.updateQueue = u.updateQueue, f = u.dependencies, b.dependencies = f === null ? null : { lanes: f.lanes, firstContext: f.firstContext }, b.sibling = u.sibling, b.index = u.index, b.ref = u.ref, b.refCleanup = u.refCleanup, b;
  }
  function uh(u, f) {
    u.flags &= 65011714;
    var b = u.alternate;
    return b === null ? (u.childLanes = 0, u.lanes = f, u.child = null, u.subtreeFlags = 0, u.memoizedProps = null, u.memoizedState = null, u.updateQueue = null, u.dependencies = null, u.stateNode = null) : (u.childLanes = b.childLanes, u.lanes = b.lanes, u.child = b.child, u.subtreeFlags = 0, u.deletions = null, u.memoizedProps = b.memoizedProps, u.memoizedState = b.memoizedState, u.updateQueue = b.updateQueue, u.type = b.type, f = b.dependencies, u.dependencies = f === null ? null : {
      lanes: f.lanes,
      firstContext: f.firstContext
    }), u;
  }
  function Xo(u, f, b, M, N, L) {
    var H = 0;
    if (M = u, typeof u == "function") Iv(u) && (H = 1);
    else if (typeof u == "string")
      H = GY(
        u,
        b,
        ie.current
      ) ? 26 : u === "html" || u === "head" || u === "body" ? 27 : 5;
    else
      e: switch (u) {
        case P:
          return u = er(31, b, f, N), u.elementType = P, u.lanes = L, u;
        case w:
          return Dc(b.children, N, L, f);
        case S:
          H = 8, N |= 24;
          break;
        case x:
          return u = er(12, b, f, N | 2), u.elementType = x, u.lanes = L, u;
        case k:
          return u = er(13, b, f, N), u.elementType = k, u.lanes = L, u;
        case D:
          return u = er(19, b, f, N), u.elementType = D, u.lanes = L, u;
        default:
          if (typeof u == "object" && u !== null)
            switch (u.$$typeof) {
              case C:
                H = 10;
                break e;
              case E:
                H = 9;
                break e;
              case A:
                H = 11;
                break e;
              case O:
                H = 14;
                break e;
              case F:
                H = 16, M = null;
                break e;
            }
          H = 29, b = Error(
            i(130, u === null ? "null" : typeof u, "")
          ), M = null;
      }
    return f = er(H, b, f, N), f.elementType = u, f.type = M, f.lanes = L, f;
  }
  function Dc(u, f, b, M) {
    return u = er(7, u, M, f), u.lanes = b, u;
  }
  function Pv(u, f, b) {
    return u = er(6, u, null, f), u.lanes = b, u;
  }
  function dh(u) {
    var f = er(18, null, null, 0);
    return f.stateNode = u, f;
  }
  function Ov(u, f, b) {
    return f = er(
      4,
      u.children !== null ? u.children : [],
      u.key,
      f
    ), f.lanes = b, f.stateNode = {
      containerInfo: u.containerInfo,
      pendingChildren: null,
      implementation: u.implementation
    }, f;
  }
  var sp = /* @__PURE__ */ new WeakMap();
  function Ss(u, f) {
    if (typeof u == "object" && u !== null) {
      var b = sp.get(u);
      return b !== void 0 ? b : (f = {
        value: u,
        source: f,
        stack: Ee(f)
      }, sp.set(u, f), f);
    }
    return {
      value: u,
      source: f,
      stack: Ee(f)
    };
  }
  var Lc = [], Ic = 0, hh = null, fh = 0, qa = [], Xi = 0, Vl = null, tr = 1, wo = "";
  function Yo(u, f) {
    Lc[Ic++] = fh, Lc[Ic++] = hh, hh = u, fh = f;
  }
  function A1(u, f, b) {
    qa[Xi++] = tr, qa[Xi++] = wo, qa[Xi++] = Vl, Vl = u;
    var M = tr;
    u = wo;
    var N = 32 - Wt(M) - 1;
    M &= ~(1 << N), b += 1;
    var L = 32 - Wt(f) + N;
    if (30 < L) {
      var H = N - N % 5;
      L = (M & (1 << H) - 1).toString(32), M >>= H, N -= H, tr = 1 << 32 - Wt(f) + N | b << N | M, wo = L + u;
    } else
      tr = 1 << L | b << N | M, wo = u;
  }
  function qo(u) {
    u.return !== null && (Yo(u, 1), A1(u, 1, 0));
  }
  function zv(u) {
    for (; u === hh; )
      hh = Lc[--Ic], Lc[Ic] = null, fh = Lc[--Ic], Lc[Ic] = null;
    for (; u === Vl; )
      Vl = qa[--Xi], qa[Xi] = null, wo = qa[--Xi], qa[Xi] = null, tr = qa[--Xi], qa[Xi] = null;
  }
  function Fv(u, f) {
    qa[Xi++] = tr, qa[Xi++] = wo, qa[Xi++] = Vl, tr = f.id, wo = f.overflow, Vl = u;
  }
  var dr = null, Ni = null, jn = !1, Gl = null, ws = !1, ph = Error(i(519));
  function Zo(u) {
    var f = Error(
      i(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw Ko(Ss(f, u)), ph;
  }
  function R1(u) {
    var f = u.stateNode, b = u.type, M = u.memoizedProps;
    switch (f[pi] = u, f[_r] = M, b) {
      case "dialog":
        Gn("cancel", f), Gn("close", f);
        break;
      case "iframe":
      case "object":
      case "embed":
        Gn("load", f);
        break;
      case "video":
      case "audio":
        for (b = 0; b < oo.length; b++)
          Gn(oo[b], f);
        break;
      case "source":
        Gn("error", f);
        break;
      case "img":
      case "image":
      case "link":
        Gn("error", f), Gn("load", f);
        break;
      case "details":
        Gn("toggle", f);
        break;
      case "input":
        Gn("invalid", f), sa(
          f,
          M.value,
          M.defaultValue,
          M.checked,
          M.defaultChecked,
          M.type,
          M.name,
          !0
        );
        break;
      case "select":
        Gn("invalid", f);
        break;
      case "textarea":
        Gn("invalid", f), Ec(f, M.value, M.defaultValue, M.children);
    }
    b = M.children, typeof b != "string" && typeof b != "number" && typeof b != "bigint" || f.textContent === "" + b || M.suppressHydrationWarning === !0 || s2(f.textContent, b) ? (M.popover != null && (Gn("beforetoggle", f), Gn("toggle", f)), M.onScroll != null && Gn("scroll", f), M.onScrollEnd != null && Gn("scrollend", f), M.onClick != null && (f.onclick = Ul), f = !0) : f = !1, f || Zo(u, !0);
  }
  function N1(u) {
    for (dr = u.return; dr; )
      switch (dr.tag) {
        case 5:
        case 31:
        case 13:
          ws = !1;
          return;
        case 27:
        case 3:
          ws = !0;
          return;
        default:
          dr = dr.return;
      }
  }
  function mh(u) {
    if (u !== dr) return !1;
    if (!jn) return N1(u), jn = !0, !1;
    var f = u.tag, b;
    if ((b = f !== 3 && f !== 27) && ((b = f === 5) && (b = u.type, b = !(b !== "form" && b !== "button") || uN(u.type, u.memoizedProps)), b = !b), b && Ni && Zo(u), N1(u), f === 13) {
      if (u = u.memoizedState, u = u !== null ? u.dehydrated : null, !u) throw Error(i(317));
      Ni = m2(u);
    } else if (f === 31) {
      if (u = u.memoizedState, u = u !== null ? u.dehydrated : null, !u) throw Error(i(317));
      Ni = m2(u);
    } else
      f === 27 ? (f = Ni, Ph(u.type) ? (u = mN, mN = null, Ni = u) : Ni = f) : Ni = dr ? dl(u.stateNode.nextSibling) : null;
    return !0;
  }
  function Pc() {
    Ni = dr = null, jn = !1;
  }
  function Bv() {
    var u = Gl;
    return u !== null && (fr === null ? fr = u : fr.push.apply(
      fr,
      u
    ), Gl = null), u;
  }
  function Ko(u) {
    Gl === null ? Gl = [u] : Gl.push(u);
  }
  var vh = $(null), Oc = null, Qo = null;
  function Wl(u, f, b) {
    ce(vh, f._currentValue), f._currentValue = b;
  }
  function Jo(u) {
    u._currentValue = vh.current, re(vh);
  }
  function Uv(u, f, b) {
    for (; u !== null; ) {
      var M = u.alternate;
      if ((u.childLanes & f) !== f ? (u.childLanes |= f, M !== null && (M.childLanes |= f)) : M !== null && (M.childLanes & f) !== f && (M.childLanes |= f), u === b) break;
      u = u.return;
    }
  }
  function jv(u, f, b, M) {
    var N = u.child;
    for (N !== null && (N.return = u); N !== null; ) {
      var L = N.dependencies;
      if (L !== null) {
        var H = N.child;
        L = L.firstContext;
        e: for (; L !== null; ) {
          var ee = L;
          L = N;
          for (var ue = 0; ue < f.length; ue++)
            if (ee.context === f[ue]) {
              L.lanes |= b, ee = L.alternate, ee !== null && (ee.lanes |= b), Uv(
                L.return,
                b,
                u
              ), M || (H = null);
              break e;
            }
          L = ee.next;
        }
      } else if (N.tag === 18) {
        if (H = N.return, H === null) throw Error(i(341));
        H.lanes |= b, L = H.alternate, L !== null && (L.lanes |= b), Uv(H, b, u), H = null;
      } else H = N.child;
      if (H !== null) H.return = N;
      else
        for (H = N; H !== null; ) {
          if (H === u) {
            H = null;
            break;
          }
          if (N = H.sibling, N !== null) {
            N.return = H.return, H = N;
            break;
          }
          H = H.return;
        }
      N = H;
    }
  }
  function el(u, f, b, M) {
    u = null;
    for (var N = f, L = !1; N !== null; ) {
      if (!L) {
        if ((N.flags & 524288) !== 0) L = !0;
        else if ((N.flags & 262144) !== 0) break;
      }
      if (N.tag === 10) {
        var H = N.alternate;
        if (H === null) throw Error(i(387));
        if (H = H.memoizedProps, H !== null) {
          var ee = N.type;
          Ia(N.pendingProps.value, H.value) || (u !== null ? u.push(ee) : u = [ee]);
        }
      } else if (N === ye.current) {
        if (H = N.alternate, H === null) throw Error(i(387));
        H.memoizedState.memoizedState !== N.memoizedState.memoizedState && (u !== null ? u.push(eb) : u = [eb]);
      }
      N = N.return;
    }
    u !== null && jv(
      f,
      u,
      b,
      M
    ), f.flags |= 262144;
  }
  function op(u) {
    for (u = u.firstContext; u !== null; ) {
      if (!Ia(
        u.context._currentValue,
        u.memoizedValue
      ))
        return !0;
      u = u.next;
    }
    return !1;
  }
  function zc(u) {
    Oc = u, Qo = null, u = u.dependencies, u !== null && (u.firstContext = null);
  }
  function tn(u) {
    return k1(Oc, u);
  }
  function gh(u, f) {
    return Oc === null && zc(u), k1(u, f);
  }
  function k1(u, f) {
    var b = f._currentValue;
    if (f = { context: f, memoizedValue: b, next: null }, Qo === null) {
      if (u === null) throw Error(i(308));
      Qo = f, u.dependencies = { lanes: 0, firstContext: f }, u.flags |= 524288;
    } else Qo = Qo.next = f;
    return b;
  }
  var D1 = typeof AbortController < "u" ? AbortController : function() {
    var u = [], f = this.signal = {
      aborted: !1,
      addEventListener: function(b, M) {
        u.push(M);
      }
    };
    this.abort = function() {
      f.aborted = !0, u.forEach(function(b) {
        return b();
      });
    };
  }, qR = n.unstable_scheduleCallback, ZR = n.unstable_NormalPriority, Ar = {
    $$typeof: C,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function r0() {
    return {
      controller: new D1(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Vu(u) {
    u.refCount--, u.refCount === 0 && qR(ZR, function() {
      u.controller.abort();
    });
  }
  var Ms = null, Hv = 0, $l = 0, qs = null;
  function a0(u, f) {
    if (Ms === null) {
      var b = Ms = [];
      Hv = 0, $l = Ue(), qs = {
        status: "pending",
        value: void 0,
        then: function(M) {
          b.push(M);
        }
      };
    }
    return Hv++, f.then(s0, s0), f;
  }
  function s0() {
    if (--Hv === 0 && Ms !== null) {
      qs !== null && (qs.status = "fulfilled");
      var u = Ms;
      Ms = null, $l = 0, qs = null;
      for (var f = 0; f < u.length; f++) (0, u[f])();
    }
  }
  function o0(u, f) {
    var b = [], M = {
      status: "pending",
      value: null,
      reason: null,
      then: function(N) {
        b.push(N);
      }
    };
    return u.then(
      function() {
        M.status = "fulfilled", M.value = f;
        for (var N = 0; N < b.length; N++) (0, b[N])(f);
      },
      function(N) {
        for (M.status = "rejected", M.reason = N, N = 0; N < b.length; N++)
          (0, b[N])(void 0);
      }
    ), M;
  }
  var L1 = G.S;
  G.S = function(u, f) {
    Y0 = Ce(), typeof f == "object" && f !== null && typeof f.then == "function" && a0(u, f), L1 !== null && L1(u, f);
  };
  var Fc = $(null);
  function Vv() {
    var u = Fc.current;
    return u !== null ? u : ln.pooledCache;
  }
  function lp(u, f) {
    f === null ? ce(Fc, Fc.current) : ce(Fc, f.pool);
  }
  function l0() {
    var u = Vv();
    return u === null ? null : { parent: Ar._currentValue, pool: u };
  }
  var Gu = Error(i(460)), cp = Error(i(474)), Mn = Error(i(542)), Gv = { then: function() {
  } };
  function Za(u) {
    return u = u.status, u === "fulfilled" || u === "rejected";
  }
  function Wv(u, f, b) {
    switch (b = u[b], b === void 0 ? u.push(f) : b !== f && (f.then(Ul, Ul), f = b), f.status) {
      case "fulfilled":
        return f.value;
      case "rejected":
        throw u = f.reason, Xu(u), u;
      default:
        if (typeof f.status == "string") f.then(Ul, Ul);
        else {
          if (u = ln, u !== null && 100 < u.shellSuspendCounter)
            throw Error(i(482));
          u = f, u.status = "pending", u.then(
            function(M) {
              if (f.status === "pending") {
                var N = f;
                N.status = "fulfilled", N.value = M;
              }
            },
            function(M) {
              if (f.status === "pending") {
                var N = f;
                N.status = "rejected", N.reason = M;
              }
            }
          );
        }
        switch (f.status) {
          case "fulfilled":
            return f.value;
          case "rejected":
            throw u = f.reason, Xu(u), u;
        }
        throw tl = f, Gu;
    }
  }
  function Wu(u) {
    try {
      var f = u._init;
      return f(u._payload);
    } catch (b) {
      throw b !== null && typeof b == "object" && typeof b.then == "function" ? (tl = b, Gu) : b;
    }
  }
  var tl = null;
  function $u() {
    if (tl === null) throw Error(i(459));
    var u = tl;
    return tl = null, u;
  }
  function Xu(u) {
    if (u === Gu || u === Mn)
      throw Error(i(483));
  }
  var Yu = null, qu = 0;
  function up(u) {
    var f = qu;
    return qu += 1, Yu === null && (Yu = []), Wv(Yu, u, f);
  }
  function Zs(u, f) {
    f = f.props.ref, u.ref = f !== void 0 ? f : null;
  }
  function _h(u, f) {
    throw f.$$typeof === p ? Error(i(525)) : (u = Object.prototype.toString.call(f), Error(
      i(
        31,
        u === "[object Object]" ? "object with keys {" + Object.keys(f).join(", ") + "}" : u
      )
    ));
  }
  function $v(u) {
    function f(we, ve) {
      if (u) {
        var ke = we.deletions;
        ke === null ? (we.deletions = [ve], we.flags |= 16) : ke.push(ve);
      }
    }
    function b(we, ve) {
      if (!u) return null;
      for (; ve !== null; )
        f(we, ve), ve = ve.sibling;
      return null;
    }
    function M(we) {
      for (var ve = /* @__PURE__ */ new Map(); we !== null; )
        we.key !== null ? ve.set(we.key, we) : ve.set(we.index, we), we = we.sibling;
      return ve;
    }
    function N(we, ve) {
      return we = Ya(we, ve), we.index = 0, we.sibling = null, we;
    }
    function L(we, ve, ke) {
      return we.index = ke, u ? (ke = we.alternate, ke !== null ? (ke = ke.index, ke < ve ? (we.flags |= 67108866, ve) : ke) : (we.flags |= 67108866, ve)) : (we.flags |= 1048576, ve);
    }
    function H(we) {
      return u && we.alternate === null && (we.flags |= 67108866), we;
    }
    function ee(we, ve, ke, Ze) {
      return ve === null || ve.tag !== 6 ? (ve = Pv(ke, we.mode, Ze), ve.return = we, ve) : (ve = N(ve, ke), ve.return = we, ve);
    }
    function ue(we, ve, ke, Ze) {
      var Yt = ke.type;
      return Yt === w ? $e(
        we,
        ve,
        ke.props.children,
        Ze,
        ke.key
      ) : ve !== null && (ve.elementType === Yt || typeof Yt == "object" && Yt !== null && Yt.$$typeof === F && Wu(Yt) === ve.type) ? (ve = N(ve, ke.props), Zs(ve, ke), ve.return = we, ve) : (ve = Xo(
        ke.type,
        ke.key,
        ke.props,
        null,
        we.mode,
        Ze
      ), Zs(ve, ke), ve.return = we, ve);
    }
    function De(we, ve, ke, Ze) {
      return ve === null || ve.tag !== 4 || ve.stateNode.containerInfo !== ke.containerInfo || ve.stateNode.implementation !== ke.implementation ? (ve = Ov(ke, we.mode, Ze), ve.return = we, ve) : (ve = N(ve, ke.children || []), ve.return = we, ve);
    }
    function $e(we, ve, ke, Ze, Yt) {
      return ve === null || ve.tag !== 7 ? (ve = Dc(
        ke,
        we.mode,
        Ze,
        Yt
      ), ve.return = we, ve) : (ve = N(ve, ke), ve.return = we, ve);
    }
    function Qe(we, ve, ke) {
      if (typeof ve == "string" && ve !== "" || typeof ve == "number" || typeof ve == "bigint")
        return ve = Pv(
          "" + ve,
          we.mode,
          ke
        ), ve.return = we, ve;
      if (typeof ve == "object" && ve !== null) {
        switch (ve.$$typeof) {
          case v:
            return ke = Xo(
              ve.type,
              ve.key,
              ve.props,
              null,
              we.mode,
              ke
            ), Zs(ke, ve), ke.return = we, ke;
          case y:
            return ve = Ov(
              ve,
              we.mode,
              ke
            ), ve.return = we, ve;
          case F:
            return ve = Wu(ve), Qe(we, ve, ke);
        }
        if (q(ve) || W(ve))
          return ve = Dc(
            ve,
            we.mode,
            ke,
            null
          ), ve.return = we, ve;
        if (typeof ve.then == "function")
          return Qe(we, up(ve), ke);
        if (ve.$$typeof === C)
          return Qe(
            we,
            gh(we, ve),
            ke
          );
        _h(we, ve);
      }
      return null;
    }
    function Pe(we, ve, ke, Ze) {
      var Yt = ve !== null ? ve.key : null;
      if (typeof ke == "string" && ke !== "" || typeof ke == "number" || typeof ke == "bigint")
        return Yt !== null ? null : ee(we, ve, "" + ke, Ze);
      if (typeof ke == "object" && ke !== null) {
        switch (ke.$$typeof) {
          case v:
            return ke.key === Yt ? ue(we, ve, ke, Ze) : null;
          case y:
            return ke.key === Yt ? De(we, ve, ke, Ze) : null;
          case F:
            return ke = Wu(ke), Pe(we, ve, ke, Ze);
        }
        if (q(ke) || W(ke))
          return Yt !== null ? null : $e(we, ve, ke, Ze, null);
        if (typeof ke.then == "function")
          return Pe(
            we,
            ve,
            up(ke),
            Ze
          );
        if (ke.$$typeof === C)
          return Pe(
            we,
            ve,
            gh(we, ke),
            Ze
          );
        _h(we, ke);
      }
      return null;
    }
    function Ge(we, ve, ke, Ze, Yt) {
      if (typeof Ze == "string" && Ze !== "" || typeof Ze == "number" || typeof Ze == "bigint")
        return we = we.get(ke) || null, ee(ve, we, "" + Ze, Yt);
      if (typeof Ze == "object" && Ze !== null) {
        switch (Ze.$$typeof) {
          case v:
            return we = we.get(
              Ze.key === null ? ke : Ze.key
            ) || null, ue(ve, we, Ze, Yt);
          case y:
            return we = we.get(
              Ze.key === null ? ke : Ze.key
            ) || null, De(ve, we, Ze, Yt);
          case F:
            return Ze = Wu(Ze), Ge(
              we,
              ve,
              ke,
              Ze,
              Yt
            );
        }
        if (q(Ze) || W(Ze))
          return we = we.get(ke) || null, $e(ve, we, Ze, Yt, null);
        if (typeof Ze.then == "function")
          return Ge(
            we,
            ve,
            ke,
            up(Ze),
            Yt
          );
        if (Ze.$$typeof === C)
          return Ge(
            we,
            ve,
            ke,
            gh(ve, Ze),
            Yt
          );
        _h(ve, Ze);
      }
      return null;
    }
    function Pt(we, ve, ke, Ze) {
      for (var Yt = null, di = null, Ut = ve, An = ve = 0, Yn = null; Ut !== null && An < ke.length; An++) {
        Ut.index > An ? (Yn = Ut, Ut = null) : Yn = Ut.sibling;
        var hi = Pe(
          we,
          Ut,
          ke[An],
          Ze
        );
        if (hi === null) {
          Ut === null && (Ut = Yn);
          break;
        }
        u && Ut && hi.alternate === null && f(we, Ut), ve = L(hi, ve, An), di === null ? Yt = hi : di.sibling = hi, di = hi, Ut = Yn;
      }
      if (An === ke.length)
        return b(we, Ut), jn && Yo(we, An), Yt;
      if (Ut === null) {
        for (; An < ke.length; An++)
          Ut = Qe(we, ke[An], Ze), Ut !== null && (ve = L(
            Ut,
            ve,
            An
          ), di === null ? Yt = Ut : di.sibling = Ut, di = Ut);
        return jn && Yo(we, An), Yt;
      }
      for (Ut = M(Ut); An < ke.length; An++)
        Yn = Ge(
          Ut,
          we,
          An,
          ke[An],
          Ze
        ), Yn !== null && (u && Yn.alternate !== null && Ut.delete(
          Yn.key === null ? An : Yn.key
        ), ve = L(
          Yn,
          ve,
          An
        ), di === null ? Yt = Yn : di.sibling = Yn, di = Yn);
      return u && Ut.forEach(function(Uh) {
        return f(we, Uh);
      }), jn && Yo(we, An), Yt;
    }
    function Jt(we, ve, ke, Ze) {
      if (ke == null) throw Error(i(151));
      for (var Yt = null, di = null, Ut = ve, An = ve = 0, Yn = null, hi = ke.next(); Ut !== null && !hi.done; An++, hi = ke.next()) {
        Ut.index > An ? (Yn = Ut, Ut = null) : Yn = Ut.sibling;
        var Uh = Pe(we, Ut, hi.value, Ze);
        if (Uh === null) {
          Ut === null && (Ut = Yn);
          break;
        }
        u && Ut && Uh.alternate === null && f(we, Ut), ve = L(Uh, ve, An), di === null ? Yt = Uh : di.sibling = Uh, di = Uh, Ut = Yn;
      }
      if (hi.done)
        return b(we, Ut), jn && Yo(we, An), Yt;
      if (Ut === null) {
        for (; !hi.done; An++, hi = ke.next())
          hi = Qe(we, hi.value, Ze), hi !== null && (ve = L(hi, ve, An), di === null ? Yt = hi : di.sibling = hi, di = hi);
        return jn && Yo(we, An), Yt;
      }
      for (Ut = M(Ut); !hi.done; An++, hi = ke.next())
        hi = Ge(Ut, we, An, hi.value, Ze), hi !== null && (u && hi.alternate !== null && Ut.delete(hi.key === null ? An : hi.key), ve = L(hi, ve, An), di === null ? Yt = hi : di.sibling = hi, di = hi);
      return u && Ut.forEach(function(tq) {
        return f(we, tq);
      }), jn && Yo(we, An), Yt;
    }
    function Li(we, ve, ke, Ze) {
      if (typeof ke == "object" && ke !== null && ke.type === w && ke.key === null && (ke = ke.props.children), typeof ke == "object" && ke !== null) {
        switch (ke.$$typeof) {
          case v:
            e: {
              for (var Yt = ke.key; ve !== null; ) {
                if (ve.key === Yt) {
                  if (Yt = ke.type, Yt === w) {
                    if (ve.tag === 7) {
                      b(
                        we,
                        ve.sibling
                      ), Ze = N(
                        ve,
                        ke.props.children
                      ), Ze.return = we, we = Ze;
                      break e;
                    }
                  } else if (ve.elementType === Yt || typeof Yt == "object" && Yt !== null && Yt.$$typeof === F && Wu(Yt) === ve.type) {
                    b(
                      we,
                      ve.sibling
                    ), Ze = N(ve, ke.props), Zs(Ze, ke), Ze.return = we, we = Ze;
                    break e;
                  }
                  b(we, ve);
                  break;
                } else f(we, ve);
                ve = ve.sibling;
              }
              ke.type === w ? (Ze = Dc(
                ke.props.children,
                we.mode,
                Ze,
                ke.key
              ), Ze.return = we, we = Ze) : (Ze = Xo(
                ke.type,
                ke.key,
                ke.props,
                null,
                we.mode,
                Ze
              ), Zs(Ze, ke), Ze.return = we, we = Ze);
            }
            return H(we);
          case y:
            e: {
              for (Yt = ke.key; ve !== null; ) {
                if (ve.key === Yt)
                  if (ve.tag === 4 && ve.stateNode.containerInfo === ke.containerInfo && ve.stateNode.implementation === ke.implementation) {
                    b(
                      we,
                      ve.sibling
                    ), Ze = N(ve, ke.children || []), Ze.return = we, we = Ze;
                    break e;
                  } else {
                    b(we, ve);
                    break;
                  }
                else f(we, ve);
                ve = ve.sibling;
              }
              Ze = Ov(ke, we.mode, Ze), Ze.return = we, we = Ze;
            }
            return H(we);
          case F:
            return ke = Wu(ke), Li(
              we,
              ve,
              ke,
              Ze
            );
        }
        if (q(ke))
          return Pt(
            we,
            ve,
            ke,
            Ze
          );
        if (W(ke)) {
          if (Yt = W(ke), typeof Yt != "function") throw Error(i(150));
          return ke = Yt.call(ke), Jt(
            we,
            ve,
            ke,
            Ze
          );
        }
        if (typeof ke.then == "function")
          return Li(
            we,
            ve,
            up(ke),
            Ze
          );
        if (ke.$$typeof === C)
          return Li(
            we,
            ve,
            gh(we, ke),
            Ze
          );
        _h(we, ke);
      }
      return typeof ke == "string" && ke !== "" || typeof ke == "number" || typeof ke == "bigint" ? (ke = "" + ke, ve !== null && ve.tag === 6 ? (b(we, ve.sibling), Ze = N(ve, ke), Ze.return = we, we = Ze) : (b(we, ve), Ze = Pv(ke, we.mode, Ze), Ze.return = we, we = Ze), H(we)) : b(we, ve);
    }
    return function(we, ve, ke, Ze) {
      try {
        qu = 0;
        var Yt = Li(
          we,
          ve,
          ke,
          Ze
        );
        return Yu = null, Yt;
      } catch (Ut) {
        if (Ut === Gu || Ut === Mn) throw Ut;
        var di = er(29, Ut, null, we.mode);
        return di.lanes = Ze, di.return = we, di;
      } finally {
      }
    };
  }
  var Xl = $v(!0), Xv = $v(!1), Oa = !1;
  function dp(u) {
    u.updateQueue = {
      baseState: u.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function c0(u, f) {
    u = u.updateQueue, f.updateQueue === u && (f.updateQueue = {
      baseState: u.baseState,
      firstBaseUpdate: u.firstBaseUpdate,
      lastBaseUpdate: u.lastBaseUpdate,
      shared: u.shared,
      callbacks: null
    });
  }
  function Yl(u) {
    return { lane: u, tag: 0, payload: null, callback: null, next: null };
  }
  function Bc(u, f, b) {
    var M = u.updateQueue;
    if (M === null) return null;
    if (M = M.shared, (Vt & 2) !== 0) {
      var N = M.pending;
      return N === null ? f.next = f : (f.next = N.next, N.next = f), M.pending = f, f = Ys(u), Nc(u, null, b), f;
    }
    return Zr(u, M, f, b), Ys(u);
  }
  function Uc(u, f, b) {
    if (f = f.updateQueue, f !== null && (f = f.shared, (b & 4194048) !== 0)) {
      var M = f.lanes;
      M &= u.pendingLanes, b |= M, f.lanes = b, gr(u, b);
    }
  }
  function Xt(u, f) {
    var b = u.updateQueue, M = u.alternate;
    if (M !== null && (M = M.updateQueue, b === M)) {
      var N = null, L = null;
      if (b = b.firstBaseUpdate, b !== null) {
        do {
          var H = {
            lane: b.lane,
            tag: b.tag,
            payload: b.payload,
            callback: null,
            next: null
          };
          L === null ? N = L = H : L = L.next = H, b = b.next;
        } while (b !== null);
        L === null ? N = L = f : L = L.next = f;
      } else N = L = f;
      b = {
        baseState: M.baseState,
        firstBaseUpdate: N,
        lastBaseUpdate: L,
        shared: M.shared,
        callbacks: M.callbacks
      }, u.updateQueue = b;
      return;
    }
    u = b.lastBaseUpdate, u === null ? b.firstBaseUpdate = f : u.next = f, b.lastBaseUpdate = f;
  }
  var u0 = !1;
  function hp() {
    if (u0) {
      var u = qs;
      if (u !== null) throw u;
    }
  }
  function yh(u, f, b, M) {
    u0 = !1;
    var N = u.updateQueue;
    Oa = !1;
    var L = N.firstBaseUpdate, H = N.lastBaseUpdate, ee = N.shared.pending;
    if (ee !== null) {
      N.shared.pending = null;
      var ue = ee, De = ue.next;
      ue.next = null, H === null ? L = De : H.next = De, H = ue;
      var $e = u.alternate;
      $e !== null && ($e = $e.updateQueue, ee = $e.lastBaseUpdate, ee !== H && (ee === null ? $e.firstBaseUpdate = De : ee.next = De, $e.lastBaseUpdate = ue));
    }
    if (L !== null) {
      var Qe = N.baseState;
      H = 0, $e = De = ue = null, ee = L;
      do {
        var Pe = ee.lane & -536870913, Ge = Pe !== ee.lane;
        if (Ge ? (xn & Pe) === Pe : (M & Pe) === Pe) {
          Pe !== 0 && Pe === $l && (u0 = !0), $e !== null && ($e = $e.next = {
            lane: 0,
            tag: ee.tag,
            payload: ee.payload,
            callback: null,
            next: null
          });
          e: {
            var Pt = u, Jt = ee;
            Pe = f;
            var Li = b;
            switch (Jt.tag) {
              case 1:
                if (Pt = Jt.payload, typeof Pt == "function") {
                  Qe = Pt.call(Li, Qe, Pe);
                  break e;
                }
                Qe = Pt;
                break e;
              case 3:
                Pt.flags = Pt.flags & -65537 | 128;
              case 0:
                if (Pt = Jt.payload, Pe = typeof Pt == "function" ? Pt.call(Li, Qe, Pe) : Pt, Pe == null) break e;
                Qe = h({}, Qe, Pe);
                break e;
              case 2:
                Oa = !0;
            }
          }
          Pe = ee.callback, Pe !== null && (u.flags |= 64, Ge && (u.flags |= 8192), Ge = N.callbacks, Ge === null ? N.callbacks = [Pe] : Ge.push(Pe));
        } else
          Ge = {
            lane: Pe,
            tag: ee.tag,
            payload: ee.payload,
            callback: ee.callback,
            next: null
          }, $e === null ? (De = $e = Ge, ue = Qe) : $e = $e.next = Ge, H |= Pe;
        if (ee = ee.next, ee === null) {
          if (ee = N.shared.pending, ee === null)
            break;
          Ge = ee, ee = Ge.next, Ge.next = null, N.lastBaseUpdate = Ge, N.shared.pending = null;
        }
      } while (!0);
      $e === null && (ue = Qe), N.baseState = ue, N.firstBaseUpdate = De, N.lastBaseUpdate = $e, L === null && (N.shared.lanes = 0), ll |= H, u.lanes = H, u.memoizedState = Qe;
    }
  }
  function bh(u, f) {
    if (typeof u != "function")
      throw Error(i(191, u));
    u.call(f);
  }
  function I1(u, f) {
    var b = u.callbacks;
    if (b !== null)
      for (u.callbacks = null, u = 0; u < b.length; u++)
        bh(b[u], f);
  }
  var xh = $(null), Yv = $(0);
  function P1(u, f) {
    u = As, ce(Yv, u), ce(xh, f), As = u | f.baseLanes;
  }
  function d0() {
    ce(Yv, As), ce(xh, xh.current);
  }
  function fp() {
    As = Yv.current, re(xh), re(Yv);
  }
  var Ka = $(null), za = null;
  function ql(u) {
    var f = u.alternate;
    ce(Hn, Hn.current & 1), ce(Ka, u), za === null && (f === null || xh.current !== null || f.memoizedState !== null) && (za = u);
  }
  function h0(u) {
    ce(Hn, Hn.current), ce(Ka, u), za === null && (za = u);
  }
  function O1(u) {
    u.tag === 22 ? (ce(Hn, Hn.current), ce(Ka, u), za === null && (za = u)) : Qa();
  }
  function Qa() {
    ce(Hn, Hn.current), ce(Ka, Ka.current);
  }
  function br(u) {
    re(Ka), za === u && (za = null), re(Hn);
  }
  var Hn = $(0);
  function Ts(u) {
    for (var f = u; f !== null; ) {
      if (f.tag === 13) {
        var b = f.memoizedState;
        if (b !== null && (b = b.dehydrated, b === null || fN(b) || pN(b)))
          return f;
      } else if (f.tag === 19 && (f.memoizedProps.revealOrder === "forwards" || f.memoizedProps.revealOrder === "backwards" || f.memoizedProps.revealOrder === "unstable_legacy-backwards" || f.memoizedProps.revealOrder === "together")) {
        if ((f.flags & 128) !== 0) return f;
      } else if (f.child !== null) {
        f.child.return = f, f = f.child;
        continue;
      }
      if (f === u) break;
      for (; f.sibling === null; ) {
        if (f.return === null || f.return === u) return null;
        f = f.return;
      }
      f.sibling.return = f.return, f = f.sibling;
    }
    return null;
  }
  var Yi = 0, pn = null, xi = null, On = null, Ks = !1, Sh = !1, Zu = !1, qv = 0, pp = 0, wh = null, f0 = 0;
  function nr() {
    throw Error(i(321));
  }
  function p0(u, f) {
    if (f === null) return !1;
    for (var b = 0; b < f.length && b < u.length; b++)
      if (!Ia(u[b], f[b])) return !1;
    return !0;
  }
  function Zv(u, f, b, M, N, L) {
    return Yi = L, pn = f, f.memoizedState = null, f.updateQueue = null, f.lanes = 0, G.H = u === null || u.memoizedState === null ? pw : I0, Zu = !1, L = b(M, N), Zu = !1, Sh && (L = Ku(
      f,
      b,
      M,
      N
    )), z1(u), L;
  }
  function z1(u) {
    G.H = Mh;
    var f = xi !== null && xi.next !== null;
    if (Yi = 0, On = xi = pn = null, Ks = !1, pp = 0, wh = null, f) throw Error(i(300));
    u === null || Rr || (u = u.dependencies, u !== null && op(u) && (Rr = !0));
  }
  function Ku(u, f, b, M) {
    pn = u;
    var N = 0;
    do {
      if (Sh && (wh = null), pp = 0, Sh = !1, 25 <= N) throw Error(i(301));
      if (N += 1, On = xi = null, u.updateQueue != null) {
        var L = u.updateQueue;
        L.lastEffect = null, L.events = null, L.stores = null, L.memoCache != null && (L.memoCache.index = 0);
      }
      G.H = Qs, L = f(b, M);
    } while (Sh);
    return L;
  }
  function Qu() {
    var u = G.H, f = u.useState()[0];
    return f = typeof f.then == "function" ? mp(f) : f, u = u.useState()[0], (xi !== null ? xi.memoizedState : null) !== u && (pn.flags |= 1024), f;
  }
  function m0() {
    var u = qv !== 0;
    return qv = 0, u;
  }
  function v0(u, f, b) {
    f.updateQueue = u.updateQueue, f.flags &= -2053, u.lanes &= ~b;
  }
  function g0(u) {
    if (Ks) {
      for (u = u.memoizedState; u !== null; ) {
        var f = u.queue;
        f !== null && (f.pending = null), u = u.next;
      }
      Ks = !1;
    }
    Yi = 0, On = xi = pn = null, Sh = !1, pp = qv = 0, wh = null;
  }
  function Fr() {
    var u = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return On === null ? pn.memoizedState = On = u : On = On.next = u, On;
  }
  function xr() {
    if (xi === null) {
      var u = pn.alternate;
      u = u !== null ? u.memoizedState : null;
    } else u = xi.next;
    var f = On === null ? pn.memoizedState : On.next;
    if (f !== null)
      On = f, xi = u;
    else {
      if (u === null)
        throw pn.alternate === null ? Error(i(467)) : Error(i(310));
      xi = u, u = {
        memoizedState: xi.memoizedState,
        baseState: xi.baseState,
        baseQueue: xi.baseQueue,
        queue: xi.queue,
        next: null
      }, On === null ? pn.memoizedState = On = u : On = On.next = u;
    }
    return On;
  }
  function Kv() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function mp(u) {
    var f = pp;
    return pp += 1, wh === null && (wh = []), u = Wv(wh, u, f), f = pn, (On === null ? f.memoizedState : On.next) === null && (f = f.alternate, G.H = f === null || f.memoizedState === null ? pw : I0), u;
  }
  function jc(u) {
    if (u !== null && typeof u == "object") {
      if (typeof u.then == "function") return mp(u);
      if (u.$$typeof === C) return tn(u);
    }
    throw Error(i(438, String(u)));
  }
  function _0(u) {
    var f = null, b = pn.updateQueue;
    if (b !== null && (f = b.memoCache), f == null) {
      var M = pn.alternate;
      M !== null && (M = M.updateQueue, M !== null && (M = M.memoCache, M != null && (f = {
        data: M.data.map(function(N) {
          return N.slice();
        }),
        index: 0
      })));
    }
    if (f == null && (f = { data: [], index: 0 }), b === null && (b = Kv(), pn.updateQueue = b), b.memoCache = f, b = f.data[f.index], b === void 0)
      for (b = f.data[f.index] = Array(u), M = 0; M < u; M++)
        b[M] = I;
    return f.index++, b;
  }
  function Zl(u, f) {
    return typeof f == "function" ? f(u) : f;
  }
  function Qv(u) {
    var f = xr();
    return y0(f, xi, u);
  }
  function y0(u, f, b) {
    var M = u.queue;
    if (M === null) throw Error(i(311));
    M.lastRenderedReducer = b;
    var N = u.baseQueue, L = M.pending;
    if (L !== null) {
      if (N !== null) {
        var H = N.next;
        N.next = L.next, L.next = H;
      }
      f.baseQueue = N = L, M.pending = null;
    }
    if (L = u.baseState, N === null) u.memoizedState = L;
    else {
      f = N.next;
      var ee = H = null, ue = null, De = f, $e = !1;
      do {
        var Qe = De.lane & -536870913;
        if (Qe !== De.lane ? (xn & Qe) === Qe : (Yi & Qe) === Qe) {
          var Pe = De.revertLane;
          if (Pe === 0)
            ue !== null && (ue = ue.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: De.action,
              hasEagerState: De.hasEagerState,
              eagerState: De.eagerState,
              next: null
            }), Qe === $l && ($e = !0);
          else if ((Yi & Pe) === Pe) {
            De = De.next, Pe === $l && ($e = !0);
            continue;
          } else
            Qe = {
              lane: 0,
              revertLane: De.revertLane,
              gesture: null,
              action: De.action,
              hasEagerState: De.hasEagerState,
              eagerState: De.eagerState,
              next: null
            }, ue === null ? (ee = ue = Qe, H = L) : ue = ue.next = Qe, pn.lanes |= Pe, ll |= Pe;
          Qe = De.action, Zu && b(L, Qe), L = De.hasEagerState ? De.eagerState : b(L, Qe);
        } else
          Pe = {
            lane: Qe,
            revertLane: De.revertLane,
            gesture: De.gesture,
            action: De.action,
            hasEagerState: De.hasEagerState,
            eagerState: De.eagerState,
            next: null
          }, ue === null ? (ee = ue = Pe, H = L) : ue = ue.next = Pe, pn.lanes |= Qe, ll |= Qe;
        De = De.next;
      } while (De !== null && De !== f);
      if (ue === null ? H = L : ue.next = ee, !Ia(L, u.memoizedState) && (Rr = !0, $e && (b = qs, b !== null)))
        throw b;
      u.memoizedState = L, u.baseState = H, u.baseQueue = ue, M.lastRenderedState = L;
    }
    return N === null && (M.lanes = 0), [u.memoizedState, M.dispatch];
  }
  function b0(u) {
    var f = xr(), b = f.queue;
    if (b === null) throw Error(i(311));
    b.lastRenderedReducer = u;
    var M = b.dispatch, N = b.pending, L = f.memoizedState;
    if (N !== null) {
      b.pending = null;
      var H = N = N.next;
      do
        L = u(L, H.action), H = H.next;
      while (H !== N);
      Ia(L, f.memoizedState) || (Rr = !0), f.memoizedState = L, f.baseQueue === null && (f.baseState = L), b.lastRenderedState = L;
    }
    return [L, M];
  }
  function F1(u, f, b) {
    var M = pn, N = xr(), L = jn;
    if (L) {
      if (b === void 0) throw Error(i(407));
      b = b();
    } else b = f();
    var H = !Ia(
      (xi || N).memoizedState,
      b
    );
    if (H && (N.memoizedState = b, Rr = !0), N = N.queue, A0(j1.bind(null, M, N, u), [
      u
    ]), N.getSnapshot !== f || H || On !== null && On.memoizedState.tag & 1) {
      if (M.flags |= 2048, Hc(
        9,
        { destroy: void 0 },
        U1.bind(
          null,
          M,
          N,
          b,
          f
        ),
        null
      ), ln === null) throw Error(i(349));
      L || (Yi & 127) !== 0 || B1(M, f, b);
    }
    return b;
  }
  function B1(u, f, b) {
    u.flags |= 16384, u = { getSnapshot: f, value: b }, f = pn.updateQueue, f === null ? (f = Kv(), pn.updateQueue = f, f.stores = [u]) : (b = f.stores, b === null ? f.stores = [u] : b.push(u));
  }
  function U1(u, f, b, M) {
    f.value = b, f.getSnapshot = M, H1(f) && V1(u);
  }
  function j1(u, f, b) {
    return b(function() {
      H1(f) && V1(u);
    });
  }
  function H1(u) {
    var f = u.getSnapshot;
    u = u.value;
    try {
      var b = f();
      return !Ia(u, b);
    } catch {
      return !0;
    }
  }
  function V1(u) {
    var f = Pa(u, 2);
    f !== null && En(f, u, 2);
  }
  function x0(u) {
    var f = Fr();
    if (typeof u == "function") {
      var b = u;
      if (u = b(), Zu) {
        vt(!0);
        try {
          b();
        } finally {
          vt(!1);
        }
      }
    }
    return f.memoizedState = f.baseState = u, f.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Zl,
      lastRenderedState: u
    }, f;
  }
  function S0(u, f, b, M) {
    return u.baseState = b, y0(
      u,
      xi,
      typeof M == "function" ? M : Zl
    );
  }
  function KR(u, f, b, M, N) {
    if (ng(u)) throw Error(i(485));
    if (u = f.action, u !== null) {
      var L = {
        payload: N,
        action: u,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(H) {
          L.listeners.push(H);
        }
      };
      G.T !== null ? b(!0) : L.isTransition = !1, M(L), b = f.pending, b === null ? (L.next = f.pending = L, G1(f, L)) : (L.next = b.next, f.pending = b.next = L);
    }
  }
  function G1(u, f) {
    var b = f.action, M = f.payload, N = u.state;
    if (f.isTransition) {
      var L = G.T, H = {};
      G.T = H;
      try {
        var ee = b(N, M), ue = G.S;
        ue !== null && ue(H, ee), W1(u, f, ee);
      } catch (De) {
        w0(u, f, De);
      } finally {
        L !== null && H.types !== null && (L.types = H.types), G.T = L;
      }
    } else
      try {
        L = b(N, M), W1(u, f, L);
      } catch (De) {
        w0(u, f, De);
      }
  }
  function W1(u, f, b) {
    b !== null && typeof b == "object" && typeof b.then == "function" ? b.then(
      function(M) {
        $1(u, f, M);
      },
      function(M) {
        return w0(u, f, M);
      }
    ) : $1(u, f, b);
  }
  function $1(u, f, b) {
    f.status = "fulfilled", f.value = b, X1(f), u.state = b, f = u.pending, f !== null && (b = f.next, b === f ? u.pending = null : (b = b.next, f.next = b, G1(u, b)));
  }
  function w0(u, f, b) {
    var M = u.pending;
    if (u.pending = null, M !== null) {
      M = M.next;
      do
        f.status = "rejected", f.reason = b, X1(f), f = f.next;
      while (f !== M);
    }
    u.action = null;
  }
  function X1(u) {
    u = u.listeners;
    for (var f = 0; f < u.length; f++) (0, u[f])();
  }
  function M0(u, f) {
    return f;
  }
  function T0(u, f) {
    if (jn) {
      var b = ln.formState;
      if (b !== null) {
        e: {
          var M = pn;
          if (jn) {
            if (Ni) {
              t: {
                for (var N = Ni, L = ws; N.nodeType !== 8; ) {
                  if (!L) {
                    N = null;
                    break t;
                  }
                  if (N = dl(
                    N.nextSibling
                  ), N === null) {
                    N = null;
                    break t;
                  }
                }
                L = N.data, N = L === "F!" || L === "F" ? N : null;
              }
              if (N) {
                Ni = dl(
                  N.nextSibling
                ), M = N.data === "F!";
                break e;
              }
            }
            Zo(M);
          }
          M = !1;
        }
        M && (f = b[0]);
      }
    }
    return b = Fr(), b.memoizedState = b.baseState = f, M = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: M0,
      lastRenderedState: f
    }, b.queue = M, b = dw.bind(
      null,
      pn,
      M
    ), M.dispatch = b, M = x0(!1), L = L0.bind(
      null,
      pn,
      !1,
      M.queue
    ), M = Fr(), N = {
      state: f,
      dispatch: null,
      action: u,
      pending: null
    }, M.queue = N, b = KR.bind(
      null,
      pn,
      N,
      L,
      b
    ), N.dispatch = b, M.memoizedState = u, [f, b, !1];
  }
  function Y1(u) {
    var f = xr();
    return E0(f, xi, u);
  }
  function E0(u, f, b) {
    if (f = y0(
      u,
      f,
      M0
    )[0], u = Qv(Zl)[0], typeof f == "object" && f !== null && typeof f.then == "function")
      try {
        var M = mp(f);
      } catch (H) {
        throw H === Gu ? Mn : H;
      }
    else M = f;
    f = xr();
    var N = f.queue, L = N.dispatch;
    return b !== f.memoizedState && (pn.flags |= 2048, Hc(
      9,
      { destroy: void 0 },
      q1.bind(null, N, b),
      null
    )), [M, L, u];
  }
  function q1(u, f) {
    u.action = f;
  }
  function C0(u) {
    var f = xr(), b = xi;
    if (b !== null)
      return E0(f, b, u);
    xr(), f = f.memoizedState, b = xr();
    var M = b.queue.dispatch;
    return b.memoizedState = u, [f, M, !1];
  }
  function Hc(u, f, b, M) {
    return u = { tag: u, create: b, deps: M, inst: f, next: null }, f = pn.updateQueue, f === null && (f = Kv(), pn.updateQueue = f), b = f.lastEffect, b === null ? f.lastEffect = u.next = u : (M = b.next, b.next = u, u.next = M, f.lastEffect = u), u;
  }
  function Jv() {
    return xr().memoizedState;
  }
  function eg(u, f, b, M) {
    var N = Fr();
    pn.flags |= u, N.memoizedState = Hc(
      1 | f,
      { destroy: void 0 },
      b,
      M === void 0 ? null : M
    );
  }
  function tg(u, f, b, M) {
    var N = xr();
    M = M === void 0 ? null : M;
    var L = N.memoizedState.inst;
    xi !== null && M !== null && p0(M, xi.memoizedState.deps) ? N.memoizedState = Hc(f, L, b, M) : (pn.flags |= u, N.memoizedState = Hc(
      1 | f,
      L,
      b,
      M
    ));
  }
  function Z1(u, f) {
    eg(8390656, 8, u, f);
  }
  function A0(u, f) {
    tg(2048, 8, u, f);
  }
  function K1(u) {
    pn.flags |= 4;
    var f = pn.updateQueue;
    if (f === null)
      f = Kv(), pn.updateQueue = f, f.events = [u];
    else {
      var b = f.events;
      b === null ? f.events = [u] : b.push(u);
    }
  }
  function Q1(u) {
    var f = xr().memoizedState;
    return K1({ ref: f, nextImpl: u }), function() {
      if ((Vt & 2) !== 0) throw Error(i(440));
      return f.impl.apply(void 0, arguments);
    };
  }
  function J1(u, f) {
    return tg(4, 2, u, f);
  }
  function ew(u, f) {
    return tg(4, 4, u, f);
  }
  function tw(u, f) {
    if (typeof f == "function") {
      u = u();
      var b = f(u);
      return function() {
        typeof b == "function" ? b() : f(null);
      };
    }
    if (f != null)
      return u = u(), f.current = u, function() {
        f.current = null;
      };
  }
  function nw(u, f, b) {
    b = b != null ? b.concat([u]) : null, tg(4, 4, tw.bind(null, f, u), b);
  }
  function R0() {
  }
  function iw(u, f) {
    var b = xr();
    f = f === void 0 ? null : f;
    var M = b.memoizedState;
    return f !== null && p0(f, M[1]) ? M[0] : (b.memoizedState = [u, f], u);
  }
  function rw(u, f) {
    var b = xr();
    f = f === void 0 ? null : f;
    var M = b.memoizedState;
    if (f !== null && p0(f, M[1]))
      return M[0];
    if (M = u(), Zu) {
      vt(!0);
      try {
        u();
      } finally {
        vt(!1);
      }
    }
    return b.memoizedState = [M, f], M;
  }
  function N0(u, f, b) {
    return b === void 0 || (Yi & 1073741824) !== 0 && (xn & 261930) === 0 ? u.memoizedState = f : (u.memoizedState = b, u = Dn(), pn.lanes |= u, ll |= u, b);
  }
  function aw(u, f, b, M) {
    return Ia(b, f) ? b : xh.current !== null ? (u = N0(u, b, M), Ia(u, f) || (Rr = !0), u) : (Yi & 42) === 0 || (Yi & 1073741824) !== 0 && (xn & 261930) === 0 ? (Rr = !0, u.memoizedState = b) : (u = Dn(), pn.lanes |= u, ll |= u, f);
  }
  function sw(u, f, b, M, N) {
    var L = Z.p;
    Z.p = L !== 0 && 8 > L ? L : 8;
    var H = G.T, ee = {};
    G.T = ee, L0(u, !1, f, b);
    try {
      var ue = N(), De = G.S;
      if (De !== null && De(ee, ue), ue !== null && typeof ue == "object" && typeof ue.then == "function") {
        var $e = o0(
          ue,
          M
        );
        vp(
          u,
          f,
          $e,
          Ns(u)
        );
      } else
        vp(
          u,
          f,
          M,
          Ns(u)
        );
    } catch (Qe) {
      vp(
        u,
        f,
        { then: function() {
        }, status: "rejected", reason: Qe },
        Ns()
      );
    } finally {
      Z.p = L, H !== null && ee.types !== null && (H.types = ee.types), G.T = H;
    }
  }
  function QR() {
  }
  function k0(u, f, b, M) {
    if (u.tag !== 5) throw Error(i(476));
    var N = ow(u).queue;
    sw(
      u,
      N,
      f,
      J,
      b === null ? QR : function() {
        return lw(u), b(M);
      }
    );
  }
  function ow(u) {
    var f = u.memoizedState;
    if (f !== null) return f;
    f = {
      memoizedState: J,
      baseState: J,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Zl,
        lastRenderedState: J
      },
      next: null
    };
    var b = {};
    return f.next = {
      memoizedState: b,
      baseState: b,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Zl,
        lastRenderedState: b
      },
      next: null
    }, u.memoizedState = f, u = u.alternate, u !== null && (u.memoizedState = f), f;
  }
  function lw(u) {
    var f = ow(u);
    f.next === null && (f = u.alternate.memoizedState), vp(
      u,
      f.next.queue,
      {},
      Ns()
    );
  }
  function D0() {
    return tn(eb);
  }
  function cw() {
    return xr().memoizedState;
  }
  function uw() {
    return xr().memoizedState;
  }
  function JR(u) {
    for (var f = u.return; f !== null; ) {
      switch (f.tag) {
        case 24:
        case 3:
          var b = Ns();
          u = Yl(b);
          var M = Bc(f, u, b);
          M !== null && (En(M, f, b), Uc(M, f, b)), f = { cache: r0() }, u.payload = f;
          return;
      }
      f = f.return;
    }
  }
  function eN(u, f, b) {
    var M = Ns();
    b = {
      lane: M,
      revertLane: 0,
      gesture: null,
      action: b,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, ng(u) ? hw(f, b) : (b = Lv(u, f, b, M), b !== null && (En(b, u, M), fw(b, f, M)));
  }
  function dw(u, f, b) {
    var M = Ns();
    vp(u, f, b, M);
  }
  function vp(u, f, b, M) {
    var N = {
      lane: M,
      revertLane: 0,
      gesture: null,
      action: b,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (ng(u)) hw(f, N);
    else {
      var L = u.alternate;
      if (u.lanes === 0 && (L === null || L.lanes === 0) && (L = f.lastRenderedReducer, L !== null))
        try {
          var H = f.lastRenderedState, ee = L(H, b);
          if (N.hasEagerState = !0, N.eagerState = ee, Ia(ee, H))
            return Zr(u, f, N, 0), ln === null && ap(), !1;
        } catch {
        } finally {
        }
      if (b = Lv(u, f, N, M), b !== null)
        return En(b, u, M), fw(b, f, M), !0;
    }
    return !1;
  }
  function L0(u, f, b, M) {
    if (M = {
      lane: 2,
      revertLane: Ue(),
      gesture: null,
      action: M,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, ng(u)) {
      if (f) throw Error(i(479));
    } else
      f = Lv(
        u,
        b,
        M,
        2
      ), f !== null && En(f, u, 2);
  }
  function ng(u) {
    var f = u.alternate;
    return u === pn || f !== null && f === pn;
  }
  function hw(u, f) {
    Sh = Ks = !0;
    var b = u.pending;
    b === null ? f.next = f : (f.next = b.next, b.next = f), u.pending = f;
  }
  function fw(u, f, b) {
    if ((b & 4194048) !== 0) {
      var M = f.lanes;
      M &= u.pendingLanes, b |= M, f.lanes = b, gr(u, b);
    }
  }
  var Mh = {
    readContext: tn,
    use: jc,
    useCallback: nr,
    useContext: nr,
    useEffect: nr,
    useImperativeHandle: nr,
    useLayoutEffect: nr,
    useInsertionEffect: nr,
    useMemo: nr,
    useReducer: nr,
    useRef: nr,
    useState: nr,
    useDebugValue: nr,
    useDeferredValue: nr,
    useTransition: nr,
    useSyncExternalStore: nr,
    useId: nr,
    useHostTransitionStatus: nr,
    useFormState: nr,
    useActionState: nr,
    useOptimistic: nr,
    useMemoCache: nr,
    useCacheRefresh: nr
  };
  Mh.useEffectEvent = nr;
  var pw = {
    readContext: tn,
    use: jc,
    useCallback: function(u, f) {
      return Fr().memoizedState = [
        u,
        f === void 0 ? null : f
      ], u;
    },
    useContext: tn,
    useEffect: Z1,
    useImperativeHandle: function(u, f, b) {
      b = b != null ? b.concat([u]) : null, eg(
        4194308,
        4,
        tw.bind(null, f, u),
        b
      );
    },
    useLayoutEffect: function(u, f) {
      return eg(4194308, 4, u, f);
    },
    useInsertionEffect: function(u, f) {
      eg(4, 2, u, f);
    },
    useMemo: function(u, f) {
      var b = Fr();
      f = f === void 0 ? null : f;
      var M = u();
      if (Zu) {
        vt(!0);
        try {
          u();
        } finally {
          vt(!1);
        }
      }
      return b.memoizedState = [M, f], M;
    },
    useReducer: function(u, f, b) {
      var M = Fr();
      if (b !== void 0) {
        var N = b(f);
        if (Zu) {
          vt(!0);
          try {
            b(f);
          } finally {
            vt(!1);
          }
        }
      } else N = f;
      return M.memoizedState = M.baseState = N, u = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: u,
        lastRenderedState: N
      }, M.queue = u, u = u.dispatch = eN.bind(
        null,
        pn,
        u
      ), [M.memoizedState, u];
    },
    useRef: function(u) {
      var f = Fr();
      return u = { current: u }, f.memoizedState = u;
    },
    useState: function(u) {
      u = x0(u);
      var f = u.queue, b = dw.bind(null, pn, f);
      return f.dispatch = b, [u.memoizedState, b];
    },
    useDebugValue: R0,
    useDeferredValue: function(u, f) {
      var b = Fr();
      return N0(b, u, f);
    },
    useTransition: function() {
      var u = x0(!1);
      return u = sw.bind(
        null,
        pn,
        u.queue,
        !0,
        !1
      ), Fr().memoizedState = u, [!1, u];
    },
    useSyncExternalStore: function(u, f, b) {
      var M = pn, N = Fr();
      if (jn) {
        if (b === void 0)
          throw Error(i(407));
        b = b();
      } else {
        if (b = f(), ln === null)
          throw Error(i(349));
        (xn & 127) !== 0 || B1(M, f, b);
      }
      N.memoizedState = b;
      var L = { value: b, getSnapshot: f };
      return N.queue = L, Z1(j1.bind(null, M, L, u), [
        u
      ]), M.flags |= 2048, Hc(
        9,
        { destroy: void 0 },
        U1.bind(
          null,
          M,
          L,
          b,
          f
        ),
        null
      ), b;
    },
    useId: function() {
      var u = Fr(), f = ln.identifierPrefix;
      if (jn) {
        var b = wo, M = tr;
        b = (M & ~(1 << 32 - Wt(M) - 1)).toString(32) + b, f = "_" + f + "R_" + b, b = qv++, 0 < b && (f += "H" + b.toString(32)), f += "_";
      } else
        b = f0++, f = "_" + f + "r_" + b.toString(32) + "_";
      return u.memoizedState = f;
    },
    useHostTransitionStatus: D0,
    useFormState: T0,
    useActionState: T0,
    useOptimistic: function(u) {
      var f = Fr();
      f.memoizedState = f.baseState = u;
      var b = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return f.queue = b, f = L0.bind(
        null,
        pn,
        !0,
        b
      ), b.dispatch = f, [u, f];
    },
    useMemoCache: _0,
    useCacheRefresh: function() {
      return Fr().memoizedState = JR.bind(
        null,
        pn
      );
    },
    useEffectEvent: function(u) {
      var f = Fr(), b = { impl: u };
      return f.memoizedState = b, function() {
        if ((Vt & 2) !== 0)
          throw Error(i(440));
        return b.impl.apply(void 0, arguments);
      };
    }
  }, I0 = {
    readContext: tn,
    use: jc,
    useCallback: iw,
    useContext: tn,
    useEffect: A0,
    useImperativeHandle: nw,
    useInsertionEffect: J1,
    useLayoutEffect: ew,
    useMemo: rw,
    useReducer: Qv,
    useRef: Jv,
    useState: function() {
      return Qv(Zl);
    },
    useDebugValue: R0,
    useDeferredValue: function(u, f) {
      var b = xr();
      return aw(
        b,
        xi.memoizedState,
        u,
        f
      );
    },
    useTransition: function() {
      var u = Qv(Zl)[0], f = xr().memoizedState;
      return [
        typeof u == "boolean" ? u : mp(u),
        f
      ];
    },
    useSyncExternalStore: F1,
    useId: cw,
    useHostTransitionStatus: D0,
    useFormState: Y1,
    useActionState: Y1,
    useOptimistic: function(u, f) {
      var b = xr();
      return S0(b, xi, u, f);
    },
    useMemoCache: _0,
    useCacheRefresh: uw
  };
  I0.useEffectEvent = Q1;
  var Qs = {
    readContext: tn,
    use: jc,
    useCallback: iw,
    useContext: tn,
    useEffect: A0,
    useImperativeHandle: nw,
    useInsertionEffect: J1,
    useLayoutEffect: ew,
    useMemo: rw,
    useReducer: b0,
    useRef: Jv,
    useState: function() {
      return b0(Zl);
    },
    useDebugValue: R0,
    useDeferredValue: function(u, f) {
      var b = xr();
      return xi === null ? N0(b, u, f) : aw(
        b,
        xi.memoizedState,
        u,
        f
      );
    },
    useTransition: function() {
      var u = b0(Zl)[0], f = xr().memoizedState;
      return [
        typeof u == "boolean" ? u : mp(u),
        f
      ];
    },
    useSyncExternalStore: F1,
    useId: cw,
    useHostTransitionStatus: D0,
    useFormState: C0,
    useActionState: C0,
    useOptimistic: function(u, f) {
      var b = xr();
      return xi !== null ? S0(b, xi, u, f) : (b.baseState = u, [u, b.queue.dispatch]);
    },
    useMemoCache: _0,
    useCacheRefresh: uw
  };
  Qs.useEffectEvent = Q1;
  function ig(u, f, b, M) {
    f = u.memoizedState, b = b(M, f), b = b == null ? f : h({}, f, b), u.memoizedState = b, u.lanes === 0 && (u.updateQueue.baseState = b);
  }
  var gp = {
    enqueueSetState: function(u, f, b) {
      u = u._reactInternals;
      var M = Ns(), N = Yl(M);
      N.payload = f, b != null && (N.callback = b), f = Bc(u, N, M), f !== null && (En(f, u, M), Uc(f, u, M));
    },
    enqueueReplaceState: function(u, f, b) {
      u = u._reactInternals;
      var M = Ns(), N = Yl(M);
      N.tag = 1, N.payload = f, b != null && (N.callback = b), f = Bc(u, N, M), f !== null && (En(f, u, M), Uc(f, u, M));
    },
    enqueueForceUpdate: function(u, f) {
      u = u._reactInternals;
      var b = Ns(), M = Yl(b);
      M.tag = 2, f != null && (M.callback = f), f = Bc(u, M, b), f !== null && (En(f, u, b), Uc(f, u, b));
    }
  };
  function P0(u, f, b, M, N, L, H) {
    return u = u.stateNode, typeof u.shouldComponentUpdate == "function" ? u.shouldComponentUpdate(M, L, H) : f.prototype && f.prototype.isPureReactComponent ? !sh(b, M) || !sh(N, L) : !0;
  }
  function O0(u, f, b, M) {
    u = f.state, typeof f.componentWillReceiveProps == "function" && f.componentWillReceiveProps(b, M), typeof f.UNSAFE_componentWillReceiveProps == "function" && f.UNSAFE_componentWillReceiveProps(b, M), f.state !== u && gp.enqueueReplaceState(f, f.state, null);
  }
  function Vc(u, f) {
    var b = f;
    if ("ref" in f) {
      b = {};
      for (var M in f)
        M !== "ref" && (b[M] = f[M]);
    }
    if (u = u.defaultProps) {
      b === f && (b = h({}, b));
      for (var N in u)
        b[N] === void 0 && (b[N] = u[N]);
    }
    return b;
  }
  function mw(u) {
    rp(u);
  }
  function z0(u) {
    console.error(u);
  }
  function F0(u) {
    rp(u);
  }
  function rg(u, f) {
    try {
      var b = u.onUncaughtError;
      b(f.value, { componentStack: f.stack });
    } catch (M) {
      setTimeout(function() {
        throw M;
      });
    }
  }
  function vw(u, f, b) {
    try {
      var M = u.onCaughtError;
      M(b.value, {
        componentStack: b.stack,
        errorBoundary: f.tag === 1 ? f.stateNode : null
      });
    } catch (N) {
      setTimeout(function() {
        throw N;
      });
    }
  }
  function B0(u, f, b) {
    return b = Yl(b), b.tag = 3, b.payload = { element: null }, b.callback = function() {
      rg(u, f);
    }, b;
  }
  function U0(u) {
    return u = Yl(u), u.tag = 3, u;
  }
  function gw(u, f, b, M) {
    var N = b.type.getDerivedStateFromError;
    if (typeof N == "function") {
      var L = M.value;
      u.payload = function() {
        return N(L);
      }, u.callback = function() {
        vw(f, b, M);
      };
    }
    var H = b.stateNode;
    H !== null && typeof H.componentDidCatch == "function" && (u.callback = function() {
      vw(f, b, M), typeof N != "function" && (Mr === null ? Mr = /* @__PURE__ */ new Set([this]) : Mr.add(this));
      var ee = M.stack;
      this.componentDidCatch(M.value, {
        componentStack: ee !== null ? ee : ""
      });
    });
  }
  function Br(u, f, b, M, N) {
    if (b.flags |= 32768, M !== null && typeof M == "object" && typeof M.then == "function") {
      if (f = b.alternate, f !== null && el(
        f,
        b,
        N,
        !0
      ), b = Ka.current, b !== null) {
        switch (b.tag) {
          case 31:
          case 13:
            return za === null ? kh() : b.alternate === null && ir === 0 && (ir = 3), b.flags &= -257, b.flags |= 65536, b.lanes = N, M === Gv ? b.flags |= 16384 : (f = b.updateQueue, f === null ? b.updateQueue = /* @__PURE__ */ new Set([M]) : f.add(M), Rp(u, M, N)), !1;
          case 22:
            return b.flags |= 65536, M === Gv ? b.flags |= 16384 : (f = b.updateQueue, f === null ? (f = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([M])
            }, b.updateQueue = f) : (b = f.retryQueue, b === null ? f.retryQueue = /* @__PURE__ */ new Set([M]) : b.add(M)), Rp(u, M, N)), !1;
        }
        throw Error(i(435, b.tag));
      }
      return Rp(u, M, N), kh(), !1;
    }
    if (jn)
      return f = Ka.current, f !== null ? ((f.flags & 65536) === 0 && (f.flags |= 256), f.flags |= 65536, f.lanes = N, M !== ph && (u = Error(i(422), { cause: M }), Ko(Ss(u, b)))) : (M !== ph && (f = Error(i(423), {
        cause: M
      }), Ko(
        Ss(f, b)
      )), u = u.current.alternate, u.flags |= 65536, N &= -N, u.lanes |= N, M = Ss(M, b), N = B0(
        u.stateNode,
        M,
        N
      ), Xt(u, N), ir !== 4 && (ir = 2)), !1;
    var L = Error(i(520), { cause: M });
    if (L = Ss(L, b), sd === null ? sd = [L] : sd.push(L), ir !== 4 && (ir = 2), f === null) return !0;
    M = Ss(M, b), b = f;
    do {
      switch (b.tag) {
        case 3:
          return b.flags |= 65536, u = N & -N, b.lanes |= u, u = B0(b.stateNode, M, u), Xt(b, u), !1;
        case 1:
          if (f = b.type, L = b.stateNode, (b.flags & 128) === 0 && (typeof f.getDerivedStateFromError == "function" || L !== null && typeof L.componentDidCatch == "function" && (Mr === null || !Mr.has(L))))
            return b.flags |= 65536, N &= -N, b.lanes |= N, N = U0(N), gw(
              N,
              u,
              b,
              M
            ), Xt(b, N), !1;
      }
      b = b.return;
    } while (b !== null);
    return !1;
  }
  var ag = Error(i(461)), Rr = !1;
  function Kr(u, f, b, M) {
    f.child = u === null ? Xv(f, null, b, M) : Xl(
      f,
      u.child,
      b,
      M
    );
  }
  function j0(u, f, b, M, N) {
    b = b.render;
    var L = f.ref;
    if ("ref" in M) {
      var H = {};
      for (var ee in M)
        ee !== "ref" && (H[ee] = M[ee]);
    } else H = M;
    return zc(f), M = Zv(
      u,
      f,
      b,
      H,
      L,
      N
    ), ee = m0(), u !== null && !Rr ? (v0(u, f, N), Sr(u, f, N)) : (jn && ee && qo(f), f.flags |= 1, Kr(u, f, M, N), f.child);
  }
  function Ju(u, f, b, M, N) {
    if (u === null) {
      var L = b.type;
      return typeof L == "function" && !Iv(L) && L.defaultProps === void 0 && b.compare === null ? (f.tag = 15, f.type = L, sg(
        u,
        f,
        L,
        M,
        N
      )) : (u = Xo(
        b.type,
        null,
        M,
        f,
        f.mode,
        N
      ), u.ref = f.ref, u.return = f, f.child = u);
    }
    if (L = u.child, !hg(u, N)) {
      var H = L.memoizedProps;
      if (b = b.compare, b = b !== null ? b : sh, b(H, M) && u.ref === f.ref)
        return Sr(u, f, N);
    }
    return f.flags |= 1, u = Ya(L, M), u.ref = f.ref, u.return = f, f.child = u;
  }
  function sg(u, f, b, M, N) {
    if (u !== null) {
      var L = u.memoizedProps;
      if (sh(L, M) && u.ref === f.ref)
        if (Rr = !1, f.pendingProps = M = L, hg(u, N))
          (u.flags & 131072) !== 0 && (Rr = !0);
        else
          return f.lanes = u.lanes, Sr(u, f, N);
    }
    return Th(
      u,
      f,
      b,
      M,
      N
    );
  }
  function ed(u, f, b, M) {
    var N = M.children, L = u !== null ? u.memoizedState : null;
    if (u === null && f.stateNode === null && (f.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), M.mode === "hidden") {
      if ((f.flags & 128) !== 0) {
        if (L = L !== null ? L.baseLanes | b : b, u !== null) {
          for (M = f.child = u.child, N = 0; M !== null; )
            N = N | M.lanes | M.childLanes, M = M.sibling;
          M = N & ~L;
        } else M = 0, f.child = null;
        return Ja(
          u,
          f,
          L,
          b,
          M
        );
      }
      if ((b & 536870912) !== 0)
        f.memoizedState = { baseLanes: 0, cachePool: null }, u !== null && lp(
          f,
          L !== null ? L.cachePool : null
        ), L !== null ? P1(f, L) : d0(), O1(f);
      else
        return M = f.lanes = 536870912, Ja(
          u,
          f,
          L !== null ? L.baseLanes | b : b,
          b,
          M
        );
    } else
      L !== null ? (lp(f, L.cachePool), P1(f, L), Qa(), f.memoizedState = null) : (u !== null && lp(f, null), d0(), Qa());
    return Kr(u, f, N, b), f.child;
  }
  function nl(u, f) {
    return u !== null && u.tag === 22 || f.stateNode !== null || (f.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), f.sibling;
  }
  function Ja(u, f, b, M, N) {
    var L = Vv();
    return L = L === null ? null : { parent: Ar._currentValue, pool: L }, f.memoizedState = {
      baseLanes: b,
      cachePool: L
    }, u !== null && lp(f, null), d0(), O1(f), u !== null && el(u, f, M, !0), f.childLanes = N, null;
  }
  function og(u, f) {
    return f = dg(
      { mode: f.mode, children: f.children },
      u.mode
    ), f.ref = u.ref, u.child = f, f.return = u, f;
  }
  function _w(u, f, b) {
    return Xl(f, u.child, null, b), u = og(f, f.pendingProps), u.flags |= 2, br(f), f.memoizedState = null, u;
  }
  function lg(u, f, b) {
    var M = f.pendingProps, N = (f.flags & 128) !== 0;
    if (f.flags &= -129, u === null) {
      if (jn) {
        if (M.mode === "hidden")
          return u = og(f, M), f.lanes = 536870912, nl(null, u);
        if (h0(f), (u = Ni) ? (u = p2(
          u,
          ws
        ), u = u !== null && u.data === "&" ? u : null, u !== null && (f.memoizedState = {
          dehydrated: u,
          treeContext: Vl !== null ? { id: tr, overflow: wo } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, b = dh(u), b.return = f, f.child = b, dr = f, Ni = null)) : u = null, u === null) throw Zo(f);
        return f.lanes = 536870912, null;
      }
      return og(f, M);
    }
    var L = u.memoizedState;
    if (L !== null) {
      var H = L.dehydrated;
      if (h0(f), N)
        if (f.flags & 256)
          f.flags &= -257, f = _w(
            u,
            f,
            b
          );
        else if (f.memoizedState !== null)
          f.child = u.child, f.flags |= 128, f = null;
        else throw Error(i(558));
      else if (Rr || el(u, f, b, !1), N = (b & u.childLanes) !== 0, Rr || N) {
        if (M = ln, M !== null && (H = Bi(M, b), H !== 0 && H !== L.retryLane))
          throw L.retryLane = H, Pa(u, H), En(M, u, H), ag;
        kh(), f = _w(
          u,
          f,
          b
        );
      } else
        u = L.treeContext, Ni = dl(H.nextSibling), dr = f, jn = !0, Gl = null, ws = !1, u !== null && Fv(f, u), f = og(f, M), f.flags |= 4096;
      return f;
    }
    return u = Ya(u.child, {
      mode: M.mode,
      children: M.children
    }), u.ref = f.ref, f.child = u, u.return = f, u;
  }
  function td(u, f) {
    var b = f.ref;
    if (b === null)
      u !== null && u.ref !== null && (f.flags |= 4194816);
    else {
      if (typeof b != "function" && typeof b != "object")
        throw Error(i(284));
      (u === null || u.ref !== b) && (f.flags |= 4194816);
    }
  }
  function Th(u, f, b, M, N) {
    return zc(f), b = Zv(
      u,
      f,
      b,
      M,
      void 0,
      N
    ), M = m0(), u !== null && !Rr ? (v0(u, f, N), Sr(u, f, N)) : (jn && M && qo(f), f.flags |= 1, Kr(u, f, b, N), f.child);
  }
  function _p(u, f, b, M, N, L) {
    return zc(f), f.updateQueue = null, b = Ku(
      f,
      M,
      b,
      N
    ), z1(u), M = m0(), u !== null && !Rr ? (v0(u, f, L), Sr(u, f, L)) : (jn && M && qo(f), f.flags |= 1, Kr(u, f, b, L), f.child);
  }
  function cg(u, f, b, M, N) {
    if (zc(f), f.stateNode === null) {
      var L = kc, H = b.contextType;
      typeof H == "object" && H !== null && (L = tn(H)), L = new b(M, L), f.memoizedState = L.state !== null && L.state !== void 0 ? L.state : null, L.updater = gp, f.stateNode = L, L._reactInternals = f, L = f.stateNode, L.props = M, L.state = f.memoizedState, L.refs = {}, dp(f), H = b.contextType, L.context = typeof H == "object" && H !== null ? tn(H) : kc, L.state = f.memoizedState, H = b.getDerivedStateFromProps, typeof H == "function" && (ig(
        f,
        b,
        H,
        M
      ), L.state = f.memoizedState), typeof b.getDerivedStateFromProps == "function" || typeof L.getSnapshotBeforeUpdate == "function" || typeof L.UNSAFE_componentWillMount != "function" && typeof L.componentWillMount != "function" || (H = L.state, typeof L.componentWillMount == "function" && L.componentWillMount(), typeof L.UNSAFE_componentWillMount == "function" && L.UNSAFE_componentWillMount(), H !== L.state && gp.enqueueReplaceState(L, L.state, null), yh(f, M, L, N), hp(), L.state = f.memoizedState), typeof L.componentDidMount == "function" && (f.flags |= 4194308), M = !0;
    } else if (u === null) {
      L = f.stateNode;
      var ee = f.memoizedProps, ue = Vc(b, ee);
      L.props = ue;
      var De = L.context, $e = b.contextType;
      H = kc, typeof $e == "object" && $e !== null && (H = tn($e));
      var Qe = b.getDerivedStateFromProps;
      $e = typeof Qe == "function" || typeof L.getSnapshotBeforeUpdate == "function", ee = f.pendingProps !== ee, $e || typeof L.UNSAFE_componentWillReceiveProps != "function" && typeof L.componentWillReceiveProps != "function" || (ee || De !== H) && O0(
        f,
        L,
        M,
        H
      ), Oa = !1;
      var Pe = f.memoizedState;
      L.state = Pe, yh(f, M, L, N), hp(), De = f.memoizedState, ee || Pe !== De || Oa ? (typeof Qe == "function" && (ig(
        f,
        b,
        Qe,
        M
      ), De = f.memoizedState), (ue = Oa || P0(
        f,
        b,
        ue,
        M,
        Pe,
        De,
        H
      )) ? ($e || typeof L.UNSAFE_componentWillMount != "function" && typeof L.componentWillMount != "function" || (typeof L.componentWillMount == "function" && L.componentWillMount(), typeof L.UNSAFE_componentWillMount == "function" && L.UNSAFE_componentWillMount()), typeof L.componentDidMount == "function" && (f.flags |= 4194308)) : (typeof L.componentDidMount == "function" && (f.flags |= 4194308), f.memoizedProps = M, f.memoizedState = De), L.props = M, L.state = De, L.context = H, M = ue) : (typeof L.componentDidMount == "function" && (f.flags |= 4194308), M = !1);
    } else {
      L = f.stateNode, c0(u, f), H = f.memoizedProps, $e = Vc(b, H), L.props = $e, Qe = f.pendingProps, Pe = L.context, De = b.contextType, ue = kc, typeof De == "object" && De !== null && (ue = tn(De)), ee = b.getDerivedStateFromProps, (De = typeof ee == "function" || typeof L.getSnapshotBeforeUpdate == "function") || typeof L.UNSAFE_componentWillReceiveProps != "function" && typeof L.componentWillReceiveProps != "function" || (H !== Qe || Pe !== ue) && O0(
        f,
        L,
        M,
        ue
      ), Oa = !1, Pe = f.memoizedState, L.state = Pe, yh(f, M, L, N), hp();
      var Ge = f.memoizedState;
      H !== Qe || Pe !== Ge || Oa || u !== null && u.dependencies !== null && op(u.dependencies) ? (typeof ee == "function" && (ig(
        f,
        b,
        ee,
        M
      ), Ge = f.memoizedState), ($e = Oa || P0(
        f,
        b,
        $e,
        M,
        Pe,
        Ge,
        ue
      ) || u !== null && u.dependencies !== null && op(u.dependencies)) ? (De || typeof L.UNSAFE_componentWillUpdate != "function" && typeof L.componentWillUpdate != "function" || (typeof L.componentWillUpdate == "function" && L.componentWillUpdate(M, Ge, ue), typeof L.UNSAFE_componentWillUpdate == "function" && L.UNSAFE_componentWillUpdate(
        M,
        Ge,
        ue
      )), typeof L.componentDidUpdate == "function" && (f.flags |= 4), typeof L.getSnapshotBeforeUpdate == "function" && (f.flags |= 1024)) : (typeof L.componentDidUpdate != "function" || H === u.memoizedProps && Pe === u.memoizedState || (f.flags |= 4), typeof L.getSnapshotBeforeUpdate != "function" || H === u.memoizedProps && Pe === u.memoizedState || (f.flags |= 1024), f.memoizedProps = M, f.memoizedState = Ge), L.props = M, L.state = Ge, L.context = ue, M = $e) : (typeof L.componentDidUpdate != "function" || H === u.memoizedProps && Pe === u.memoizedState || (f.flags |= 4), typeof L.getSnapshotBeforeUpdate != "function" || H === u.memoizedProps && Pe === u.memoizedState || (f.flags |= 1024), M = !1);
    }
    return L = M, td(u, f), M = (f.flags & 128) !== 0, L || M ? (L = f.stateNode, b = M && typeof b.getDerivedStateFromError != "function" ? null : L.render(), f.flags |= 1, u !== null && M ? (f.child = Xl(
      f,
      u.child,
      null,
      N
    ), f.child = Xl(
      f,
      null,
      b,
      N
    )) : Kr(u, f, b, N), f.memoizedState = L.state, u = f.child) : u = Sr(
      u,
      f,
      N
    ), u;
  }
  function yw(u, f, b, M) {
    return Pc(), f.flags |= 256, Kr(u, f, b, M), f.child;
  }
  var H0 = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function xa(u) {
    return { baseLanes: u, cachePool: l0() };
  }
  function ug(u, f, b) {
    return u = u !== null ? u.childLanes & ~b : 0, f && (u |= Ua), u;
  }
  function bw(u, f, b) {
    var M = f.pendingProps, N = !1, L = (f.flags & 128) !== 0, H;
    if ((H = L) || (H = u !== null && u.memoizedState === null ? !1 : (Hn.current & 2) !== 0), H && (N = !0, f.flags &= -129), H = (f.flags & 32) !== 0, f.flags &= -33, u === null) {
      if (jn) {
        if (N ? ql(f) : Qa(), (u = Ni) ? (u = p2(
          u,
          ws
        ), u = u !== null && u.data !== "&" ? u : null, u !== null && (f.memoizedState = {
          dehydrated: u,
          treeContext: Vl !== null ? { id: tr, overflow: wo } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, b = dh(u), b.return = f, f.child = b, dr = f, Ni = null)) : u = null, u === null) throw Zo(f);
        return pN(u) ? f.lanes = 32 : f.lanes = 536870912, null;
      }
      var ee = M.children;
      return M = M.fallback, N ? (Qa(), N = f.mode, ee = dg(
        { mode: "hidden", children: ee },
        N
      ), M = Dc(
        M,
        N,
        b,
        null
      ), ee.return = f, M.return = f, ee.sibling = M, f.child = ee, M = f.child, M.memoizedState = xa(b), M.childLanes = ug(
        u,
        H,
        b
      ), f.memoizedState = H0, nl(null, M)) : (ql(f), yp(f, ee));
    }
    var ue = u.memoizedState;
    if (ue !== null && (ee = ue.dehydrated, ee !== null)) {
      if (L)
        f.flags & 256 ? (ql(f), f.flags &= -257, f = V0(
          u,
          f,
          b
        )) : f.memoizedState !== null ? (Qa(), f.child = u.child, f.flags |= 128, f = null) : (Qa(), ee = M.fallback, N = f.mode, M = dg(
          { mode: "visible", children: M.children },
          N
        ), ee = Dc(
          ee,
          N,
          b,
          null
        ), ee.flags |= 2, M.return = f, ee.return = f, M.sibling = ee, f.child = M, Xl(
          f,
          u.child,
          null,
          b
        ), M = f.child, M.memoizedState = xa(b), M.childLanes = ug(
          u,
          H,
          b
        ), f.memoizedState = H0, f = nl(null, M));
      else if (ql(f), pN(ee)) {
        if (H = ee.nextSibling && ee.nextSibling.dataset, H) var De = H.dgst;
        H = De, M = Error(i(419)), M.stack = "", M.digest = H, Ko({ value: M, source: null, stack: null }), f = V0(
          u,
          f,
          b
        );
      } else if (Rr || el(u, f, b, !1), H = (b & u.childLanes) !== 0, Rr || H) {
        if (H = ln, H !== null && (M = Bi(H, b), M !== 0 && M !== ue.retryLane))
          throw ue.retryLane = M, Pa(u, M), En(H, u, M), ag;
        fN(ee) || kh(), f = V0(
          u,
          f,
          b
        );
      } else
        fN(ee) ? (f.flags |= 192, f.child = u.child, f = null) : (u = ue.treeContext, Ni = dl(
          ee.nextSibling
        ), dr = f, jn = !0, Gl = null, ws = !1, u !== null && Fv(f, u), f = yp(
          f,
          M.children
        ), f.flags |= 4096);
      return f;
    }
    return N ? (Qa(), ee = M.fallback, N = f.mode, ue = u.child, De = ue.sibling, M = Ya(ue, {
      mode: "hidden",
      children: M.children
    }), M.subtreeFlags = ue.subtreeFlags & 65011712, De !== null ? ee = Ya(
      De,
      ee
    ) : (ee = Dc(
      ee,
      N,
      b,
      null
    ), ee.flags |= 2), ee.return = f, M.return = f, M.sibling = ee, f.child = M, nl(null, M), M = f.child, ee = u.child.memoizedState, ee === null ? ee = xa(b) : (N = ee.cachePool, N !== null ? (ue = Ar._currentValue, N = N.parent !== ue ? { parent: ue, pool: ue } : N) : N = l0(), ee = {
      baseLanes: ee.baseLanes | b,
      cachePool: N
    }), M.memoizedState = ee, M.childLanes = ug(
      u,
      H,
      b
    ), f.memoizedState = H0, nl(u.child, M)) : (ql(f), b = u.child, u = b.sibling, b = Ya(b, {
      mode: "visible",
      children: M.children
    }), b.return = f, b.sibling = null, u !== null && (H = f.deletions, H === null ? (f.deletions = [u], f.flags |= 16) : H.push(u)), f.child = b, f.memoizedState = null, b);
  }
  function yp(u, f) {
    return f = dg(
      { mode: "visible", children: f },
      u.mode
    ), f.return = u, u.child = f;
  }
  function dg(u, f) {
    return u = er(22, u, null, f), u.lanes = 0, u;
  }
  function V0(u, f, b) {
    return Xl(f, u.child, null, b), u = yp(
      f,
      f.pendingProps.children
    ), u.flags |= 2, f.memoizedState = null, u;
  }
  function xw(u, f, b) {
    u.lanes |= f;
    var M = u.alternate;
    M !== null && (M.lanes |= f), Uv(u.return, f, b);
  }
  function nd(u, f, b, M, N, L) {
    var H = u.memoizedState;
    H === null ? u.memoizedState = {
      isBackwards: f,
      rendering: null,
      renderingStartTime: 0,
      last: M,
      tail: b,
      tailMode: N,
      treeForkCount: L
    } : (H.isBackwards = f, H.rendering = null, H.renderingStartTime = 0, H.last = M, H.tail = b, H.tailMode = N, H.treeForkCount = L);
  }
  function es(u, f, b) {
    var M = f.pendingProps, N = M.revealOrder, L = M.tail;
    M = M.children;
    var H = Hn.current, ee = (H & 2) !== 0;
    if (ee ? (H = H & 1 | 2, f.flags |= 128) : H &= 1, ce(Hn, H), Kr(u, f, M, b), M = jn ? fh : 0, !ee && u !== null && (u.flags & 128) !== 0)
      e: for (u = f.child; u !== null; ) {
        if (u.tag === 13)
          u.memoizedState !== null && xw(u, b, f);
        else if (u.tag === 19)
          xw(u, b, f);
        else if (u.child !== null) {
          u.child.return = u, u = u.child;
          continue;
        }
        if (u === f) break e;
        for (; u.sibling === null; ) {
          if (u.return === null || u.return === f)
            break e;
          u = u.return;
        }
        u.sibling.return = u.return, u = u.sibling;
      }
    switch (N) {
      case "forwards":
        for (b = f.child, N = null; b !== null; )
          u = b.alternate, u !== null && Ts(u) === null && (N = b), b = b.sibling;
        b = N, b === null ? (N = f.child, f.child = null) : (N = b.sibling, b.sibling = null), nd(
          f,
          !1,
          N,
          b,
          L,
          M
        );
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (b = null, N = f.child, f.child = null; N !== null; ) {
          if (u = N.alternate, u !== null && Ts(u) === null) {
            f.child = N;
            break;
          }
          u = N.sibling, N.sibling = b, b = N, N = u;
        }
        nd(
          f,
          !0,
          b,
          null,
          L,
          M
        );
        break;
      case "together":
        nd(
          f,
          !1,
          null,
          null,
          void 0,
          M
        );
        break;
      default:
        f.memoizedState = null;
    }
    return f.child;
  }
  function Sr(u, f, b) {
    if (u !== null && (f.dependencies = u.dependencies), ll |= f.lanes, (b & f.childLanes) === 0)
      if (u !== null) {
        if (el(
          u,
          f,
          b,
          !1
        ), (b & f.childLanes) === 0)
          return null;
      } else return null;
    if (u !== null && f.child !== u.child)
      throw Error(i(153));
    if (f.child !== null) {
      for (u = f.child, b = Ya(u, u.pendingProps), f.child = b, b.return = f; u.sibling !== null; )
        u = u.sibling, b = b.sibling = Ya(u, u.pendingProps), b.return = f;
      b.sibling = null;
    }
    return f.child;
  }
  function hg(u, f) {
    return (u.lanes & f) !== 0 ? !0 : (u = u.dependencies, !!(u !== null && op(u)));
  }
  function tN(u, f, b) {
    switch (f.tag) {
      case 3:
        Ve(f, f.stateNode.containerInfo), Wl(f, Ar, u.memoizedState.cache), Pc();
        break;
      case 27:
      case 5:
        qe(f);
        break;
      case 4:
        Ve(f, f.stateNode.containerInfo);
        break;
      case 10:
        Wl(
          f,
          f.type,
          f.memoizedProps.value
        );
        break;
      case 31:
        if (f.memoizedState !== null)
          return f.flags |= 128, h0(f), null;
        break;
      case 13:
        var M = f.memoizedState;
        if (M !== null)
          return M.dehydrated !== null ? (ql(f), f.flags |= 128, null) : (b & f.child.childLanes) !== 0 ? bw(u, f, b) : (ql(f), u = Sr(
            u,
            f,
            b
          ), u !== null ? u.sibling : null);
        ql(f);
        break;
      case 19:
        var N = (u.flags & 128) !== 0;
        if (M = (b & f.childLanes) !== 0, M || (el(
          u,
          f,
          b,
          !1
        ), M = (b & f.childLanes) !== 0), N) {
          if (M)
            return es(
              u,
              f,
              b
            );
          f.flags |= 128;
        }
        if (N = f.memoizedState, N !== null && (N.rendering = null, N.tail = null, N.lastEffect = null), ce(Hn, Hn.current), M) break;
        return null;
      case 22:
        return f.lanes = 0, ed(
          u,
          f,
          b,
          f.pendingProps
        );
      case 24:
        Wl(f, Ar, u.memoizedState.cache);
    }
    return Sr(u, f, b);
  }
  function fg(u, f, b) {
    if (u !== null)
      if (u.memoizedProps !== f.pendingProps)
        Rr = !0;
      else {
        if (!hg(u, b) && (f.flags & 128) === 0)
          return Rr = !1, tN(
            u,
            f,
            b
          );
        Rr = (u.flags & 131072) !== 0;
      }
    else
      Rr = !1, jn && (f.flags & 1048576) !== 0 && A1(f, fh, f.index);
    switch (f.lanes = 0, f.tag) {
      case 16:
        e: {
          var M = f.pendingProps;
          if (u = Wu(f.elementType), f.type = u, typeof u == "function")
            Iv(u) ? (M = Vc(u, M), f.tag = 1, f = cg(
              null,
              f,
              u,
              M,
              b
            )) : (f.tag = 0, f = Th(
              null,
              f,
              u,
              M,
              b
            ));
          else {
            if (u != null) {
              var N = u.$$typeof;
              if (N === A) {
                f.tag = 11, f = j0(
                  null,
                  f,
                  u,
                  M,
                  b
                );
                break e;
              } else if (N === O) {
                f.tag = 14, f = Ju(
                  null,
                  f,
                  u,
                  M,
                  b
                );
                break e;
              }
            }
            throw f = Y(u) || u, Error(i(306, f, ""));
          }
        }
        return f;
      case 0:
        return Th(
          u,
          f,
          f.type,
          f.pendingProps,
          b
        );
      case 1:
        return M = f.type, N = Vc(
          M,
          f.pendingProps
        ), cg(
          u,
          f,
          M,
          N,
          b
        );
      case 3:
        e: {
          if (Ve(
            f,
            f.stateNode.containerInfo
          ), u === null) throw Error(i(387));
          M = f.pendingProps;
          var L = f.memoizedState;
          N = L.element, c0(u, f), yh(f, M, null, b);
          var H = f.memoizedState;
          if (M = H.cache, Wl(f, Ar, M), M !== L.cache && jv(
            f,
            [Ar],
            b,
            !0
          ), hp(), M = H.element, L.isDehydrated)
            if (L = {
              element: M,
              isDehydrated: !1,
              cache: H.cache
            }, f.updateQueue.baseState = L, f.memoizedState = L, f.flags & 256) {
              f = yw(
                u,
                f,
                M,
                b
              );
              break e;
            } else if (M !== N) {
              N = Ss(
                Error(i(424)),
                f
              ), Ko(N), f = yw(
                u,
                f,
                M,
                b
              );
              break e;
            } else {
              switch (u = f.stateNode.containerInfo, u.nodeType) {
                case 9:
                  u = u.body;
                  break;
                default:
                  u = u.nodeName === "HTML" ? u.ownerDocument.body : u;
              }
              for (Ni = dl(u.firstChild), dr = f, jn = !0, Gl = null, ws = !0, b = Xv(
                f,
                null,
                M,
                b
              ), f.child = b; b; )
                b.flags = b.flags & -3 | 4096, b = b.sibling;
            }
          else {
            if (Pc(), M === N) {
              f = Sr(
                u,
                f,
                b
              );
              break e;
            }
            Kr(u, f, M, b);
          }
          f = f.child;
        }
        return f;
      case 26:
        return td(u, f), u === null ? (b = b2(
          f.type,
          null,
          f.pendingProps,
          null
        )) ? f.memoizedState = b : jn || (b = f.type, u = f.pendingProps, M = Tw(
          _e.current
        ).createElement(b), M[pi] = f, M[_r] = u, Ha(M, b, u), ge(M), f.stateNode = M) : f.memoizedState = b2(
          f.type,
          u.memoizedProps,
          f.pendingProps,
          u.memoizedState
        ), null;
      case 27:
        return qe(f), u === null && jn && (M = f.stateNode = g2(
          f.type,
          f.pendingProps,
          _e.current
        ), dr = f, ws = !0, N = Ni, Ph(f.type) ? (mN = N, Ni = dl(M.firstChild)) : Ni = N), Kr(
          u,
          f,
          f.pendingProps.children,
          b
        ), td(u, f), u === null && (f.flags |= 4194304), f.child;
      case 5:
        return u === null && jn && ((N = M = Ni) && (M = kY(
          M,
          f.type,
          f.pendingProps,
          ws
        ), M !== null ? (f.stateNode = M, dr = f, Ni = dl(M.firstChild), ws = !1, N = !0) : N = !1), N || Zo(f)), qe(f), N = f.type, L = f.pendingProps, H = u !== null ? u.memoizedProps : null, M = L.children, uN(N, L) ? M = null : H !== null && uN(N, H) && (f.flags |= 32), f.memoizedState !== null && (N = Zv(
          u,
          f,
          Qu,
          null,
          null,
          b
        ), eb._currentValue = N), td(u, f), Kr(u, f, M, b), f.child;
      case 6:
        return u === null && jn && ((u = b = Ni) && (b = DY(
          b,
          f.pendingProps,
          ws
        ), b !== null ? (f.stateNode = b, dr = f, Ni = null, u = !0) : u = !1), u || Zo(f)), null;
      case 13:
        return bw(u, f, b);
      case 4:
        return Ve(
          f,
          f.stateNode.containerInfo
        ), M = f.pendingProps, u === null ? f.child = Xl(
          f,
          null,
          M,
          b
        ) : Kr(u, f, M, b), f.child;
      case 11:
        return j0(
          u,
          f,
          f.type,
          f.pendingProps,
          b
        );
      case 7:
        return Kr(
          u,
          f,
          f.pendingProps,
          b
        ), f.child;
      case 8:
        return Kr(
          u,
          f,
          f.pendingProps.children,
          b
        ), f.child;
      case 12:
        return Kr(
          u,
          f,
          f.pendingProps.children,
          b
        ), f.child;
      case 10:
        return M = f.pendingProps, Wl(f, f.type, M.value), Kr(u, f, M.children, b), f.child;
      case 9:
        return N = f.type._context, M = f.pendingProps.children, zc(f), N = tn(N), M = M(N), f.flags |= 1, Kr(u, f, M, b), f.child;
      case 14:
        return Ju(
          u,
          f,
          f.type,
          f.pendingProps,
          b
        );
      case 15:
        return sg(
          u,
          f,
          f.type,
          f.pendingProps,
          b
        );
      case 19:
        return es(u, f, b);
      case 31:
        return lg(u, f, b);
      case 22:
        return ed(
          u,
          f,
          b,
          f.pendingProps
        );
      case 24:
        return zc(f), M = tn(Ar), u === null ? (N = Vv(), N === null && (N = ln, L = r0(), N.pooledCache = L, L.refCount++, L !== null && (N.pooledCacheLanes |= b), N = L), f.memoizedState = { parent: M, cache: N }, dp(f), Wl(f, Ar, N)) : ((u.lanes & b) !== 0 && (c0(u, f), yh(f, null, null, b), hp()), N = u.memoizedState, L = f.memoizedState, N.parent !== M ? (N = { parent: M, cache: M }, f.memoizedState = N, f.lanes === 0 && (f.memoizedState = f.updateQueue.baseState = N), Wl(f, Ar, M)) : (M = L.cache, Wl(f, Ar, M), M !== N.cache && jv(
          f,
          [Ar],
          b,
          !0
        ))), Kr(
          u,
          f,
          f.pendingProps.children,
          b
        ), f.child;
      case 29:
        throw f.pendingProps;
    }
    throw Error(i(156, f.tag));
  }
  function il(u) {
    u.flags |= 4;
  }
  function bp(u, f, b, M, N) {
    if ((f = (u.mode & 32) !== 0) && (f = !1), f) {
      if (u.flags |= 16777216, (N & 335544128) === N)
        if (u.stateNode.complete) u.flags |= 8192;
        else if (ar()) u.flags |= 8192;
        else
          throw tl = Gv, cp;
    } else u.flags &= -16777217;
  }
  function G0(u, f) {
    if (f.type !== "stylesheet" || (f.state.loading & 4) !== 0)
      u.flags &= -16777217;
    else if (u.flags |= 16777216, !T2(f))
      if (ar()) u.flags |= 8192;
      else
        throw tl = Gv, cp;
  }
  function Kl(u, f) {
    f !== null && (u.flags |= 4), u.flags & 16384 && (f = u.tag !== 22 ? hn() : 536870912, u.lanes |= f, ji |= f);
  }
  function rl(u, f) {
    if (!jn)
      switch (u.tailMode) {
        case "hidden":
          f = u.tail;
          for (var b = null; f !== null; )
            f.alternate !== null && (b = f), f = f.sibling;
          b === null ? u.tail = null : b.sibling = null;
          break;
        case "collapsed":
          b = u.tail;
          for (var M = null; b !== null; )
            b.alternate !== null && (M = b), b = b.sibling;
          M === null ? f || u.tail === null ? u.tail = null : u.tail.sibling = null : M.sibling = null;
      }
  }
  function Si(u) {
    var f = u.alternate !== null && u.alternate.child === u.child, b = 0, M = 0;
    if (f)
      for (var N = u.child; N !== null; )
        b |= N.lanes | N.childLanes, M |= N.subtreeFlags & 65011712, M |= N.flags & 65011712, N.return = u, N = N.sibling;
    else
      for (N = u.child; N !== null; )
        b |= N.lanes | N.childLanes, M |= N.subtreeFlags, M |= N.flags, N.return = u, N = N.sibling;
    return u.subtreeFlags |= M, u.childLanes = b, f;
  }
  function xp(u, f, b) {
    var M = f.pendingProps;
    switch (zv(f), f.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Si(f), null;
      case 1:
        return Si(f), null;
      case 3:
        return b = f.stateNode, M = null, u !== null && (M = u.memoizedState.cache), f.memoizedState.cache !== M && (f.flags |= 2048), Jo(Ar), je(), b.pendingContext && (b.context = b.pendingContext, b.pendingContext = null), (u === null || u.child === null) && (mh(f) ? il(f) : u === null || u.memoizedState.isDehydrated && (f.flags & 256) === 0 || (f.flags |= 1024, Bv())), Si(f), null;
      case 26:
        var N = f.type, L = f.memoizedState;
        return u === null ? (il(f), L !== null ? (Si(f), G0(f, L)) : (Si(f), bp(
          f,
          N,
          null,
          M,
          b
        ))) : L ? L !== u.memoizedState ? (il(f), Si(f), G0(f, L)) : (Si(f), f.flags &= -16777217) : (u = u.memoizedProps, u !== M && il(f), Si(f), bp(
          f,
          N,
          u,
          M,
          b
        )), null;
      case 27:
        if (Ke(f), b = _e.current, N = f.type, u !== null && f.stateNode != null)
          u.memoizedProps !== M && il(f);
        else {
          if (!M) {
            if (f.stateNode === null)
              throw Error(i(166));
            return Si(f), null;
          }
          u = ie.current, mh(f) ? R1(f) : (u = g2(N, M, b), f.stateNode = u, il(f));
        }
        return Si(f), null;
      case 5:
        if (Ke(f), N = f.type, u !== null && f.stateNode != null)
          u.memoizedProps !== M && il(f);
        else {
          if (!M) {
            if (f.stateNode === null)
              throw Error(i(166));
            return Si(f), null;
          }
          if (L = ie.current, mh(f))
            R1(f);
          else {
            var H = Tw(
              _e.current
            );
            switch (L) {
              case 1:
                L = H.createElementNS(
                  "http://www.w3.org/2000/svg",
                  N
                );
                break;
              case 2:
                L = H.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  N
                );
                break;
              default:
                switch (N) {
                  case "svg":
                    L = H.createElementNS(
                      "http://www.w3.org/2000/svg",
                      N
                    );
                    break;
                  case "math":
                    L = H.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      N
                    );
                    break;
                  case "script":
                    L = H.createElement("div"), L.innerHTML = "<script><\/script>", L = L.removeChild(
                      L.firstChild
                    );
                    break;
                  case "select":
                    L = typeof M.is == "string" ? H.createElement("select", {
                      is: M.is
                    }) : H.createElement("select"), M.multiple ? L.multiple = !0 : M.size && (L.size = M.size);
                    break;
                  default:
                    L = typeof M.is == "string" ? H.createElement(N, { is: M.is }) : H.createElement(N);
                }
            }
            L[pi] = f, L[_r] = M;
            e: for (H = f.child; H !== null; ) {
              if (H.tag === 5 || H.tag === 6)
                L.appendChild(H.stateNode);
              else if (H.tag !== 4 && H.tag !== 27 && H.child !== null) {
                H.child.return = H, H = H.child;
                continue;
              }
              if (H === f) break e;
              for (; H.sibling === null; ) {
                if (H.return === null || H.return === f)
                  break e;
                H = H.return;
              }
              H.sibling.return = H.return, H = H.sibling;
            }
            f.stateNode = L;
            e: switch (Ha(L, N, M), N) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                M = !!M.autoFocus;
                break e;
              case "img":
                M = !0;
                break e;
              default:
                M = !1;
            }
            M && il(f);
          }
        }
        return Si(f), bp(
          f,
          f.type,
          u === null ? null : u.memoizedProps,
          f.pendingProps,
          b
        ), null;
      case 6:
        if (u && f.stateNode != null)
          u.memoizedProps !== M && il(f);
        else {
          if (typeof M != "string" && f.stateNode === null)
            throw Error(i(166));
          if (u = _e.current, mh(f)) {
            if (u = f.stateNode, b = f.memoizedProps, M = null, N = dr, N !== null)
              switch (N.tag) {
                case 27:
                case 5:
                  M = N.memoizedProps;
              }
            u[pi] = f, u = !!(u.nodeValue === b || M !== null && M.suppressHydrationWarning === !0 || s2(u.nodeValue, b)), u || Zo(f, !0);
          } else
            u = Tw(u).createTextNode(
              M
            ), u[pi] = f, f.stateNode = u;
        }
        return Si(f), null;
      case 31:
        if (b = f.memoizedState, u === null || u.memoizedState !== null) {
          if (M = mh(f), b !== null) {
            if (u === null) {
              if (!M) throw Error(i(318));
              if (u = f.memoizedState, u = u !== null ? u.dehydrated : null, !u) throw Error(i(557));
              u[pi] = f;
            } else
              Pc(), (f.flags & 128) === 0 && (f.memoizedState = null), f.flags |= 4;
            Si(f), u = !1;
          } else
            b = Bv(), u !== null && u.memoizedState !== null && (u.memoizedState.hydrationErrors = b), u = !0;
          if (!u)
            return f.flags & 256 ? (br(f), f) : (br(f), null);
          if ((f.flags & 128) !== 0)
            throw Error(i(558));
        }
        return Si(f), null;
      case 13:
        if (M = f.memoizedState, u === null || u.memoizedState !== null && u.memoizedState.dehydrated !== null) {
          if (N = mh(f), M !== null && M.dehydrated !== null) {
            if (u === null) {
              if (!N) throw Error(i(318));
              if (N = f.memoizedState, N = N !== null ? N.dehydrated : null, !N) throw Error(i(317));
              N[pi] = f;
            } else
              Pc(), (f.flags & 128) === 0 && (f.memoizedState = null), f.flags |= 4;
            Si(f), N = !1;
          } else
            N = Bv(), u !== null && u.memoizedState !== null && (u.memoizedState.hydrationErrors = N), N = !0;
          if (!N)
            return f.flags & 256 ? (br(f), f) : (br(f), null);
        }
        return br(f), (f.flags & 128) !== 0 ? (f.lanes = b, f) : (b = M !== null, u = u !== null && u.memoizedState !== null, b && (M = f.child, N = null, M.alternate !== null && M.alternate.memoizedState !== null && M.alternate.memoizedState.cachePool !== null && (N = M.alternate.memoizedState.cachePool.pool), L = null, M.memoizedState !== null && M.memoizedState.cachePool !== null && (L = M.memoizedState.cachePool.pool), L !== N && (M.flags |= 2048)), b !== u && b && (f.child.flags |= 8192), Kl(f, f.updateQueue), Si(f), null);
      case 4:
        return je(), u === null && aN(f.stateNode.containerInfo), Si(f), null;
      case 10:
        return Jo(f.type), Si(f), null;
      case 19:
        if (re(Hn), M = f.memoizedState, M === null) return Si(f), null;
        if (N = (f.flags & 128) !== 0, L = M.rendering, L === null)
          if (N) rl(M, !1);
          else {
            if (ir !== 0 || u !== null && (u.flags & 128) !== 0)
              for (u = f.child; u !== null; ) {
                if (L = Ts(u), L !== null) {
                  for (f.flags |= 128, rl(M, !1), u = L.updateQueue, f.updateQueue = u, Kl(f, u), f.subtreeFlags = 0, u = b, b = f.child; b !== null; )
                    uh(b, u), b = b.sibling;
                  return ce(
                    Hn,
                    Hn.current & 1 | 2
                  ), jn && Yo(f, M.treeForkCount), f.child;
                }
                u = u.sibling;
              }
            M.tail !== null && Ce() > wr && (f.flags |= 128, N = !0, rl(M, !1), f.lanes = 4194304);
          }
        else {
          if (!N)
            if (u = Ts(L), u !== null) {
              if (f.flags |= 128, N = !0, u = u.updateQueue, f.updateQueue = u, Kl(f, u), rl(M, !0), M.tail === null && M.tailMode === "hidden" && !L.alternate && !jn)
                return Si(f), null;
            } else
              2 * Ce() - M.renderingStartTime > wr && b !== 536870912 && (f.flags |= 128, N = !0, rl(M, !1), f.lanes = 4194304);
          M.isBackwards ? (L.sibling = f.child, f.child = L) : (u = M.last, u !== null ? u.sibling = L : f.child = L, M.last = L);
        }
        return M.tail !== null ? (u = M.tail, M.rendering = u, M.tail = u.sibling, M.renderingStartTime = Ce(), u.sibling = null, b = Hn.current, ce(
          Hn,
          N ? b & 1 | 2 : b & 1
        ), jn && Yo(f, M.treeForkCount), u) : (Si(f), null);
      case 22:
      case 23:
        return br(f), fp(), M = f.memoizedState !== null, u !== null ? u.memoizedState !== null !== M && (f.flags |= 8192) : M && (f.flags |= 8192), M ? (b & 536870912) !== 0 && (f.flags & 128) === 0 && (Si(f), f.subtreeFlags & 6 && (f.flags |= 8192)) : Si(f), b = f.updateQueue, b !== null && Kl(f, b.retryQueue), b = null, u !== null && u.memoizedState !== null && u.memoizedState.cachePool !== null && (b = u.memoizedState.cachePool.pool), M = null, f.memoizedState !== null && f.memoizedState.cachePool !== null && (M = f.memoizedState.cachePool.pool), M !== b && (f.flags |= 2048), u !== null && re(Fc), null;
      case 24:
        return b = null, u !== null && (b = u.memoizedState.cache), f.memoizedState.cache !== b && (f.flags |= 2048), Jo(Ar), Si(f), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(i(156, f.tag));
  }
  function Js(u, f) {
    switch (zv(f), f.tag) {
      case 1:
        return u = f.flags, u & 65536 ? (f.flags = u & -65537 | 128, f) : null;
      case 3:
        return Jo(Ar), je(), u = f.flags, (u & 65536) !== 0 && (u & 128) === 0 ? (f.flags = u & -65537 | 128, f) : null;
      case 26:
      case 27:
      case 5:
        return Ke(f), null;
      case 31:
        if (f.memoizedState !== null) {
          if (br(f), f.alternate === null)
            throw Error(i(340));
          Pc();
        }
        return u = f.flags, u & 65536 ? (f.flags = u & -65537 | 128, f) : null;
      case 13:
        if (br(f), u = f.memoizedState, u !== null && u.dehydrated !== null) {
          if (f.alternate === null)
            throw Error(i(340));
          Pc();
        }
        return u = f.flags, u & 65536 ? (f.flags = u & -65537 | 128, f) : null;
      case 19:
        return re(Hn), null;
      case 4:
        return je(), null;
      case 10:
        return Jo(f.type), null;
      case 22:
      case 23:
        return br(f), fp(), u !== null && re(Fc), u = f.flags, u & 65536 ? (f.flags = u & -65537 | 128, f) : null;
      case 24:
        return Jo(Ar), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Es(u, f) {
    switch (zv(f), f.tag) {
      case 3:
        Jo(Ar), je();
        break;
      case 26:
      case 27:
      case 5:
        Ke(f);
        break;
      case 4:
        je();
        break;
      case 31:
        f.memoizedState !== null && br(f);
        break;
      case 13:
        br(f);
        break;
      case 19:
        re(Hn);
        break;
      case 10:
        Jo(f.type);
        break;
      case 22:
      case 23:
        br(f), fp(), u !== null && re(Fc);
        break;
      case 24:
        Jo(Ar);
    }
  }
  function eo(u, f) {
    try {
      var b = f.updateQueue, M = b !== null ? b.lastEffect : null;
      if (M !== null) {
        var N = M.next;
        b = N;
        do {
          if ((b.tag & u) === u) {
            M = void 0;
            var L = b.create, H = b.inst;
            M = L(), H.destroy = M;
          }
          b = b.next;
        } while (b !== N);
      }
    } catch (ee) {
      Kn(f, f.return, ee);
    }
  }
  function la(u, f, b) {
    try {
      var M = f.updateQueue, N = M !== null ? M.lastEffect : null;
      if (N !== null) {
        var L = N.next;
        M = L;
        do {
          if ((M.tag & u) === u) {
            var H = M.inst, ee = H.destroy;
            if (ee !== void 0) {
              H.destroy = void 0, N = f;
              var ue = b, De = ee;
              try {
                De();
              } catch ($e) {
                Kn(
                  N,
                  ue,
                  $e
                );
              }
            }
          }
          M = M.next;
        } while (M !== L);
      }
    } catch ($e) {
      Kn(f, f.return, $e);
    }
  }
  function Mo(u) {
    var f = u.updateQueue;
    if (f !== null) {
      var b = u.stateNode;
      try {
        I1(f, b);
      } catch (M) {
        Kn(u, u.return, M);
      }
    }
  }
  function Qr(u, f, b) {
    b.props = Vc(
      u.type,
      u.memoizedProps
    ), b.state = u.memoizedState;
    try {
      b.componentWillUnmount();
    } catch (M) {
      Kn(u, f, M);
    }
  }
  function Ql(u, f) {
    try {
      var b = u.ref;
      if (b !== null) {
        switch (u.tag) {
          case 26:
          case 27:
          case 5:
            var M = u.stateNode;
            break;
          case 30:
            M = u.stateNode;
            break;
          default:
            M = u.stateNode;
        }
        typeof b == "function" ? u.refCleanup = b(M) : b.current = M;
      }
    } catch (N) {
      Kn(u, f, N);
    }
  }
  function ca(u, f) {
    var b = u.ref, M = u.refCleanup;
    if (b !== null)
      if (typeof M == "function")
        try {
          M();
        } catch (N) {
          Kn(u, f, N);
        } finally {
          u.refCleanup = null, u = u.alternate, u != null && (u.refCleanup = null);
        }
      else if (typeof b == "function")
        try {
          b(null);
        } catch (N) {
          Kn(u, f, N);
        }
      else b.current = null;
  }
  function Sp(u) {
    var f = u.type, b = u.memoizedProps, M = u.stateNode;
    try {
      e: switch (f) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          b.autoFocus && M.focus();
          break e;
        case "img":
          b.src ? M.src = b.src : b.srcSet && (M.srcset = b.srcSet);
      }
    } catch (N) {
      Kn(u, u.return, N);
    }
  }
  function Ur(u, f, b) {
    try {
      var M = u.stateNode;
      TY(M, u.type, b, f), M[_r] = f;
    } catch (N) {
      Kn(u, u.return, N);
    }
  }
  function qi(u) {
    return u.tag === 5 || u.tag === 3 || u.tag === 26 || u.tag === 27 && Ph(u.type) || u.tag === 4;
  }
  function zn(u) {
    e: for (; ; ) {
      for (; u.sibling === null; ) {
        if (u.return === null || qi(u.return)) return null;
        u = u.return;
      }
      for (u.sibling.return = u.return, u = u.sibling; u.tag !== 5 && u.tag !== 6 && u.tag !== 18; ) {
        if (u.tag === 27 && Ph(u.type) || u.flags & 2 || u.child === null || u.tag === 4) continue e;
        u.child.return = u, u = u.child;
      }
      if (!(u.flags & 2)) return u.stateNode;
    }
  }
  function al(u, f, b) {
    var M = u.tag;
    if (M === 5 || M === 6)
      u = u.stateNode, f ? (b.nodeType === 9 ? b.body : b.nodeName === "HTML" ? b.ownerDocument.body : b).insertBefore(u, f) : (f = b.nodeType === 9 ? b.body : b.nodeName === "HTML" ? b.ownerDocument.body : b, f.appendChild(u), b = b._reactRootContainer, b != null || f.onclick !== null || (f.onclick = Ul));
    else if (M !== 4 && (M === 27 && Ph(u.type) && (b = u.stateNode, f = null), u = u.child, u !== null))
      for (al(u, f, b), u = u.sibling; u !== null; )
        al(u, f, b), u = u.sibling;
  }
  function Fa(u, f, b) {
    var M = u.tag;
    if (M === 5 || M === 6)
      u = u.stateNode, f ? b.insertBefore(u, f) : b.appendChild(u);
    else if (M !== 4 && (M === 27 && Ph(u.type) && (b = u.stateNode), u = u.child, u !== null))
      for (Fa(u, f, b), u = u.sibling; u !== null; )
        Fa(u, f, b), u = u.sibling;
  }
  function pg(u) {
    var f = u.stateNode, b = u.memoizedProps;
    try {
      for (var M = u.type, N = f.attributes; N.length; )
        f.removeAttributeNode(N[0]);
      Ha(f, M, b), f[pi] = u, f[_r] = b;
    } catch (L) {
      Kn(u, u.return, L);
    }
  }
  var to = !1, ki = !1, To = !1, Sw = typeof WeakSet == "function" ? WeakSet : Set, Jr = null;
  function nN(u, f) {
    if (u = u.containerInfo, lN = Dw, u = M1(u), Jy(u)) {
      if ("selectionStart" in u)
        var b = {
          start: u.selectionStart,
          end: u.selectionEnd
        };
      else
        e: {
          b = (b = u.ownerDocument) && b.defaultView || window;
          var M = b.getSelection && b.getSelection();
          if (M && M.rangeCount !== 0) {
            b = M.anchorNode;
            var N = M.anchorOffset, L = M.focusNode;
            M = M.focusOffset;
            try {
              b.nodeType, L.nodeType;
            } catch {
              b = null;
              break e;
            }
            var H = 0, ee = -1, ue = -1, De = 0, $e = 0, Qe = u, Pe = null;
            t: for (; ; ) {
              for (var Ge; Qe !== b || N !== 0 && Qe.nodeType !== 3 || (ee = H + N), Qe !== L || M !== 0 && Qe.nodeType !== 3 || (ue = H + M), Qe.nodeType === 3 && (H += Qe.nodeValue.length), (Ge = Qe.firstChild) !== null; )
                Pe = Qe, Qe = Ge;
              for (; ; ) {
                if (Qe === u) break t;
                if (Pe === b && ++De === N && (ee = H), Pe === L && ++$e === M && (ue = H), (Ge = Qe.nextSibling) !== null) break;
                Qe = Pe, Pe = Qe.parentNode;
              }
              Qe = Ge;
            }
            b = ee === -1 || ue === -1 ? null : { start: ee, end: ue };
          } else b = null;
        }
      b = b || { start: 0, end: 0 };
    } else b = null;
    for (cN = { focusedElem: u, selectionRange: b }, Dw = !1, Jr = f; Jr !== null; )
      if (f = Jr, u = f.child, (f.subtreeFlags & 1028) !== 0 && u !== null)
        u.return = f, Jr = u;
      else
        for (; Jr !== null; ) {
          switch (f = Jr, L = f.alternate, u = f.flags, f.tag) {
            case 0:
              if ((u & 4) !== 0 && (u = f.updateQueue, u = u !== null ? u.events : null, u !== null))
                for (b = 0; b < u.length; b++)
                  N = u[b], N.ref.impl = N.nextImpl;
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((u & 1024) !== 0 && L !== null) {
                u = void 0, b = f, N = L.memoizedProps, L = L.memoizedState, M = b.stateNode;
                try {
                  var Pt = Vc(
                    b.type,
                    N
                  );
                  u = M.getSnapshotBeforeUpdate(
                    Pt,
                    L
                  ), M.__reactInternalSnapshotBeforeUpdate = u;
                } catch (Jt) {
                  Kn(
                    b,
                    b.return,
                    Jt
                  );
                }
              }
              break;
            case 3:
              if ((u & 1024) !== 0) {
                if (u = f.stateNode.containerInfo, b = u.nodeType, b === 9)
                  hN(u);
                else if (b === 1)
                  switch (u.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      hN(u);
                      break;
                    default:
                      u.textContent = "";
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((u & 1024) !== 0) throw Error(i(163));
          }
          if (u = f.sibling, u !== null) {
            u.return = f.return, Jr = u;
            break;
          }
          Jr = f.return;
        }
  }
  function Zi(u, f, b) {
    var M = b.flags;
    switch (b.tag) {
      case 0:
      case 11:
      case 15:
        ro(u, b), M & 4 && eo(5, b);
        break;
      case 1:
        if (ro(u, b), M & 4)
          if (u = b.stateNode, f === null)
            try {
              u.componentDidMount();
            } catch (H) {
              Kn(b, b.return, H);
            }
          else {
            var N = Vc(
              b.type,
              f.memoizedProps
            );
            f = f.memoizedState;
            try {
              u.componentDidUpdate(
                N,
                f,
                u.__reactInternalSnapshotBeforeUpdate
              );
            } catch (H) {
              Kn(
                b,
                b.return,
                H
              );
            }
          }
        M & 64 && Mo(b), M & 512 && Ql(b, b.return);
        break;
      case 3:
        if (ro(u, b), M & 64 && (u = b.updateQueue, u !== null)) {
          if (f = null, b.child !== null)
            switch (b.child.tag) {
              case 27:
              case 5:
                f = b.child.stateNode;
                break;
              case 1:
                f = b.child.stateNode;
            }
          try {
            I1(u, f);
          } catch (H) {
            Kn(b, b.return, H);
          }
        }
        break;
      case 27:
        f === null && M & 4 && pg(b);
      case 26:
      case 5:
        ro(u, b), f === null && M & 4 && Sp(b), M & 512 && Ql(b, b.return);
        break;
      case 12:
        ro(u, b);
        break;
      case 31:
        ro(u, b), M & 4 && Gc(u, b);
        break;
      case 13:
        ro(u, b), M & 4 && Eh(u, b), M & 64 && (u = b.memoizedState, u !== null && (u = u.dehydrated, u !== null && (b = T.bind(
          null,
          b
        ), LY(u, b))));
        break;
      case 22:
        if (M = b.memoizedState !== null || to, !M) {
          f = f !== null && f.memoizedState !== null || ki, N = to;
          var L = ki;
          to = M, (ki = f) && !L ? Ba(
            u,
            b,
            (b.subtreeFlags & 8772) !== 0
          ) : ro(u, b), to = N, ki = L;
        }
        break;
      case 30:
        break;
      default:
        ro(u, b);
    }
  }
  function wp(u) {
    var f = u.alternate;
    f !== null && (u.alternate = null, wp(f)), u.child = null, u.deletions = null, u.sibling = null, u.tag === 5 && (f = u.stateNode, f !== null && Bl(f)), u.stateNode = null, u.return = null, u.dependencies = null, u.memoizedProps = null, u.memoizedState = null, u.pendingProps = null, u.stateNode = null, u.updateQueue = null;
  }
  var mi = null, Sa = !1;
  function no(u, f, b) {
    for (b = b.child; b !== null; )
      mg(u, f, b), b = b.sibling;
  }
  function mg(u, f, b) {
    if (kt && typeof kt.onCommitFiberUnmount == "function")
      try {
        kt.onCommitFiberUnmount(It, b);
      } catch {
      }
    switch (b.tag) {
      case 26:
        ki || ca(b, f), no(
          u,
          f,
          b
        ), b.memoizedState ? b.memoizedState.count-- : b.stateNode && (b = b.stateNode, b.parentNode.removeChild(b));
        break;
      case 27:
        ki || ca(b, f);
        var M = mi, N = Sa;
        Ph(b.type) && (mi = b.stateNode, Sa = !1), no(
          u,
          f,
          b
        ), K0(b.stateNode), mi = M, Sa = N;
        break;
      case 5:
        ki || ca(b, f);
      case 6:
        if (M = mi, N = Sa, mi = null, no(
          u,
          f,
          b
        ), mi = M, Sa = N, mi !== null)
          if (Sa)
            try {
              (mi.nodeType === 9 ? mi.body : mi.nodeName === "HTML" ? mi.ownerDocument.body : mi).removeChild(b.stateNode);
            } catch (L) {
              Kn(
                b,
                f,
                L
              );
            }
          else
            try {
              mi.removeChild(b.stateNode);
            } catch (L) {
              Kn(
                b,
                f,
                L
              );
            }
        break;
      case 18:
        mi !== null && (Sa ? (u = mi, h2(
          u.nodeType === 9 ? u.body : u.nodeName === "HTML" ? u.ownerDocument.body : u,
          b.stateNode
        ), wg(u)) : h2(mi, b.stateNode));
        break;
      case 4:
        M = mi, N = Sa, mi = b.stateNode.containerInfo, Sa = !0, no(
          u,
          f,
          b
        ), mi = M, Sa = N;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        la(2, b, f), ki || la(4, b, f), no(
          u,
          f,
          b
        );
        break;
      case 1:
        ki || (ca(b, f), M = b.stateNode, typeof M.componentWillUnmount == "function" && Qr(
          b,
          f,
          M
        )), no(
          u,
          f,
          b
        );
        break;
      case 21:
        no(
          u,
          f,
          b
        );
        break;
      case 22:
        ki = (M = ki) || b.memoizedState !== null, no(
          u,
          f,
          b
        ), ki = M;
        break;
      default:
        no(
          u,
          f,
          b
        );
    }
  }
  function Gc(u, f) {
    if (f.memoizedState === null && (u = f.alternate, u !== null && (u = u.memoizedState, u !== null))) {
      u = u.dehydrated;
      try {
        wg(u);
      } catch (b) {
        Kn(f, f.return, b);
      }
    }
  }
  function Eh(u, f) {
    if (f.memoizedState === null && (u = f.alternate, u !== null && (u = u.memoizedState, u !== null && (u = u.dehydrated, u !== null))))
      try {
        wg(u);
      } catch (b) {
        Kn(f, f.return, b);
      }
  }
  function W0(u) {
    switch (u.tag) {
      case 31:
      case 13:
      case 19:
        var f = u.stateNode;
        return f === null && (f = u.stateNode = new Sw()), f;
      case 22:
        return u = u.stateNode, f = u._retryCache, f === null && (f = u._retryCache = new Sw()), f;
      default:
        throw Error(i(435, u.tag));
    }
  }
  function Jl(u, f) {
    var b = W0(u);
    f.forEach(function(M) {
      if (!b.has(M)) {
        b.add(M);
        var N = R.bind(null, u, M);
        M.then(N, N);
      }
    });
  }
  function jr(u, f) {
    var b = f.deletions;
    if (b !== null)
      for (var M = 0; M < b.length; M++) {
        var N = b[M], L = u, H = f, ee = H;
        e: for (; ee !== null; ) {
          switch (ee.tag) {
            case 27:
              if (Ph(ee.type)) {
                mi = ee.stateNode, Sa = !1;
                break e;
              }
              break;
            case 5:
              mi = ee.stateNode, Sa = !1;
              break e;
            case 3:
            case 4:
              mi = ee.stateNode.containerInfo, Sa = !0;
              break e;
          }
          ee = ee.return;
        }
        if (mi === null) throw Error(i(160));
        mg(L, H, N), mi = null, Sa = !1, L = N.alternate, L !== null && (L.return = null), N.return = null;
      }
    if (f.subtreeFlags & 13886)
      for (f = f.child; f !== null; )
        Wc(f, u), f = f.sibling;
  }
  var io = null;
  function Wc(u, f) {
    var b = u.alternate, M = u.flags;
    switch (u.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        jr(f, u), Hr(u), M & 4 && (la(3, u, u.return), eo(3, u), la(5, u, u.return));
        break;
      case 1:
        jr(f, u), Hr(u), M & 512 && (ki || b === null || ca(b, b.return)), M & 64 && to && (u = u.updateQueue, u !== null && (M = u.callbacks, M !== null && (b = u.shared.hiddenCallbacks, u.shared.hiddenCallbacks = b === null ? M : b.concat(M))));
        break;
      case 26:
        var N = io;
        if (jr(f, u), Hr(u), M & 512 && (ki || b === null || ca(b, b.return)), M & 4) {
          var L = b !== null ? b.memoizedState : null;
          if (M = u.memoizedState, b === null)
            if (M === null)
              if (u.stateNode === null) {
                e: {
                  M = u.type, b = u.memoizedProps, N = N.ownerDocument || N;
                  t: switch (M) {
                    case "title":
                      L = N.getElementsByTagName("title")[0], (!L || L[So] || L[pi] || L.namespaceURI === "http://www.w3.org/2000/svg" || L.hasAttribute("itemprop")) && (L = N.createElement(M), N.head.insertBefore(
                        L,
                        N.querySelector("head > title")
                      )), Ha(L, M, b), L[pi] = u, ge(L), M = L;
                      break e;
                    case "link":
                      var H = w2(
                        "link",
                        "href",
                        N
                      ).get(M + (b.href || ""));
                      if (H) {
                        for (var ee = 0; ee < H.length; ee++)
                          if (L = H[ee], L.getAttribute("href") === (b.href == null || b.href === "" ? null : b.href) && L.getAttribute("rel") === (b.rel == null ? null : b.rel) && L.getAttribute("title") === (b.title == null ? null : b.title) && L.getAttribute("crossorigin") === (b.crossOrigin == null ? null : b.crossOrigin)) {
                            H.splice(ee, 1);
                            break t;
                          }
                      }
                      L = N.createElement(M), Ha(L, M, b), N.head.appendChild(L);
                      break;
                    case "meta":
                      if (H = w2(
                        "meta",
                        "content",
                        N
                      ).get(M + (b.content || ""))) {
                        for (ee = 0; ee < H.length; ee++)
                          if (L = H[ee], L.getAttribute("content") === (b.content == null ? null : "" + b.content) && L.getAttribute("name") === (b.name == null ? null : b.name) && L.getAttribute("property") === (b.property == null ? null : b.property) && L.getAttribute("http-equiv") === (b.httpEquiv == null ? null : b.httpEquiv) && L.getAttribute("charset") === (b.charSet == null ? null : b.charSet)) {
                            H.splice(ee, 1);
                            break t;
                          }
                      }
                      L = N.createElement(M), Ha(L, M, b), N.head.appendChild(L);
                      break;
                    default:
                      throw Error(i(468, M));
                  }
                  L[pi] = u, ge(L), M = L;
                }
                u.stateNode = M;
              } else
                M2(
                  N,
                  u.type,
                  u.stateNode
                );
            else
              u.stateNode = S2(
                N,
                M,
                u.memoizedProps
              );
          else
            L !== M ? (L === null ? b.stateNode !== null && (b = b.stateNode, b.parentNode.removeChild(b)) : L.count--, M === null ? M2(
              N,
              u.type,
              u.stateNode
            ) : S2(
              N,
              M,
              u.memoizedProps
            )) : M === null && u.stateNode !== null && Ur(
              u,
              u.memoizedProps,
              b.memoizedProps
            );
        }
        break;
      case 27:
        jr(f, u), Hr(u), M & 512 && (ki || b === null || ca(b, b.return)), b !== null && M & 4 && Ur(
          u,
          u.memoizedProps,
          b.memoizedProps
        );
        break;
      case 5:
        if (jr(f, u), Hr(u), M & 512 && (ki || b === null || ca(b, b.return)), u.flags & 32) {
          N = u.stateNode;
          try {
            Da(N, "");
          } catch (Pt) {
            Kn(u, u.return, Pt);
          }
        }
        M & 4 && u.stateNode != null && (N = u.memoizedProps, Ur(
          u,
          N,
          b !== null ? b.memoizedProps : N
        )), M & 1024 && (To = !0);
        break;
      case 6:
        if (jr(f, u), Hr(u), M & 4) {
          if (u.stateNode === null)
            throw Error(i(162));
          M = u.memoizedProps, b = u.stateNode;
          try {
            b.nodeValue = M;
          } catch (Pt) {
            Kn(u, u.return, Pt);
          }
        }
        break;
      case 3:
        if (Aw = null, N = io, io = Ew(f.containerInfo), jr(f, u), io = N, Hr(u), M & 4 && b !== null && b.memoizedState.isDehydrated)
          try {
            wg(f.containerInfo);
          } catch (Pt) {
            Kn(u, u.return, Pt);
          }
        To && (To = !1, vg(u));
        break;
      case 4:
        M = io, io = Ew(
          u.stateNode.containerInfo
        ), jr(f, u), Hr(u), io = M;
        break;
      case 12:
        jr(f, u), Hr(u);
        break;
      case 31:
        jr(f, u), Hr(u), M & 4 && (M = u.updateQueue, M !== null && (u.updateQueue = null, Jl(u, M)));
        break;
      case 13:
        jr(f, u), Hr(u), u.child.flags & 8192 && u.memoizedState !== null != (b !== null && b.memoizedState !== null) && (Ch = Ce()), M & 4 && (M = u.updateQueue, M !== null && (u.updateQueue = null, Jl(u, M)));
        break;
      case 22:
        N = u.memoizedState !== null;
        var ue = b !== null && b.memoizedState !== null, De = to, $e = ki;
        if (to = De || N, ki = $e || ue, jr(f, u), ki = $e, to = De, Hr(u), M & 8192)
          e: for (f = u.stateNode, f._visibility = N ? f._visibility & -2 : f._visibility | 1, N && (b === null || ue || to || ki || sl(u)), b = null, f = u; ; ) {
            if (f.tag === 5 || f.tag === 26) {
              if (b === null) {
                ue = b = f;
                try {
                  if (L = ue.stateNode, N)
                    H = L.style, typeof H.setProperty == "function" ? H.setProperty("display", "none", "important") : H.display = "none";
                  else {
                    ee = ue.stateNode;
                    var Qe = ue.memoizedProps.style, Pe = Qe != null && Qe.hasOwnProperty("display") ? Qe.display : null;
                    ee.style.display = Pe == null || typeof Pe == "boolean" ? "" : ("" + Pe).trim();
                  }
                } catch (Pt) {
                  Kn(ue, ue.return, Pt);
                }
              }
            } else if (f.tag === 6) {
              if (b === null) {
                ue = f;
                try {
                  ue.stateNode.nodeValue = N ? "" : ue.memoizedProps;
                } catch (Pt) {
                  Kn(ue, ue.return, Pt);
                }
              }
            } else if (f.tag === 18) {
              if (b === null) {
                ue = f;
                try {
                  var Ge = ue.stateNode;
                  N ? f2(Ge, !0) : f2(ue.stateNode, !1);
                } catch (Pt) {
                  Kn(ue, ue.return, Pt);
                }
              }
            } else if ((f.tag !== 22 && f.tag !== 23 || f.memoizedState === null || f === u) && f.child !== null) {
              f.child.return = f, f = f.child;
              continue;
            }
            if (f === u) break e;
            for (; f.sibling === null; ) {
              if (f.return === null || f.return === u) break e;
              b === f && (b = null), f = f.return;
            }
            b === f && (b = null), f.sibling.return = f.return, f = f.sibling;
          }
        M & 4 && (M = u.updateQueue, M !== null && (b = M.retryQueue, b !== null && (M.retryQueue = null, Jl(u, b))));
        break;
      case 19:
        jr(f, u), Hr(u), M & 4 && (M = u.updateQueue, M !== null && (u.updateQueue = null, Jl(u, M)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        jr(f, u), Hr(u);
    }
  }
  function Hr(u) {
    var f = u.flags;
    if (f & 2) {
      try {
        for (var b, M = u.return; M !== null; ) {
          if (qi(M)) {
            b = M;
            break;
          }
          M = M.return;
        }
        if (b == null) throw Error(i(160));
        switch (b.tag) {
          case 27:
            var N = b.stateNode, L = zn(u);
            Fa(u, L, N);
            break;
          case 5:
            var H = b.stateNode;
            b.flags & 32 && (Da(H, ""), b.flags &= -33);
            var ee = zn(u);
            Fa(u, ee, H);
            break;
          case 3:
          case 4:
            var ue = b.stateNode.containerInfo, De = zn(u);
            al(
              u,
              De,
              ue
            );
            break;
          default:
            throw Error(i(161));
        }
      } catch ($e) {
        Kn(u, u.return, $e);
      }
      u.flags &= -3;
    }
    f & 4096 && (u.flags &= -4097);
  }
  function vg(u) {
    if (u.subtreeFlags & 1024)
      for (u = u.child; u !== null; ) {
        var f = u;
        vg(f), f.tag === 5 && f.flags & 1024 && f.stateNode.reset(), u = u.sibling;
      }
  }
  function ro(u, f) {
    if (f.subtreeFlags & 8772)
      for (f = f.child; f !== null; )
        Zi(u, f.alternate, f), f = f.sibling;
  }
  function sl(u) {
    for (u = u.child; u !== null; ) {
      var f = u;
      switch (f.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          la(4, f, f.return), sl(f);
          break;
        case 1:
          ca(f, f.return);
          var b = f.stateNode;
          typeof b.componentWillUnmount == "function" && Qr(
            f,
            f.return,
            b
          ), sl(f);
          break;
        case 27:
          K0(f.stateNode);
        case 26:
        case 5:
          ca(f, f.return), sl(f);
          break;
        case 22:
          f.memoizedState === null && sl(f);
          break;
        case 30:
          sl(f);
          break;
        default:
          sl(f);
      }
      u = u.sibling;
    }
  }
  function Ba(u, f, b) {
    for (b = b && (f.subtreeFlags & 8772) !== 0, f = f.child; f !== null; ) {
      var M = f.alternate, N = u, L = f, H = L.flags;
      switch (L.tag) {
        case 0:
        case 11:
        case 15:
          Ba(
            N,
            L,
            b
          ), eo(4, L);
          break;
        case 1:
          if (Ba(
            N,
            L,
            b
          ), M = L, N = M.stateNode, typeof N.componentDidMount == "function")
            try {
              N.componentDidMount();
            } catch (De) {
              Kn(M, M.return, De);
            }
          if (M = L, N = M.updateQueue, N !== null) {
            var ee = M.stateNode;
            try {
              var ue = N.shared.hiddenCallbacks;
              if (ue !== null)
                for (N.shared.hiddenCallbacks = null, N = 0; N < ue.length; N++)
                  bh(ue[N], ee);
            } catch (De) {
              Kn(M, M.return, De);
            }
          }
          b && H & 64 && Mo(L), Ql(L, L.return);
          break;
        case 27:
          pg(L);
        case 26:
        case 5:
          Ba(
            N,
            L,
            b
          ), b && M === null && H & 4 && Sp(L), Ql(L, L.return);
          break;
        case 12:
          Ba(
            N,
            L,
            b
          );
          break;
        case 31:
          Ba(
            N,
            L,
            b
          ), b && H & 4 && Gc(N, L);
          break;
        case 13:
          Ba(
            N,
            L,
            b
          ), b && H & 4 && Eh(N, L);
          break;
        case 22:
          L.memoizedState === null && Ba(
            N,
            L,
            b
          ), Ql(L, L.return);
          break;
        case 30:
          break;
        default:
          Ba(
            N,
            L,
            b
          );
      }
      f = f.sibling;
    }
  }
  function $c(u, f) {
    var b = null;
    u !== null && u.memoizedState !== null && u.memoizedState.cachePool !== null && (b = u.memoizedState.cachePool.pool), u = null, f.memoizedState !== null && f.memoizedState.cachePool !== null && (u = f.memoizedState.cachePool.pool), u !== b && (u != null && u.refCount++, b != null && Vu(b));
  }
  function id(u, f) {
    u = null, f.alternate !== null && (u = f.alternate.memoizedState.cache), f = f.memoizedState.cache, f !== u && (f.refCount++, u != null && Vu(u));
  }
  function ua(u, f, b, M) {
    if (f.subtreeFlags & 10256)
      for (f = f.child; f !== null; )
        $0(
          u,
          f,
          b,
          M
        ), f = f.sibling;
  }
  function $0(u, f, b, M) {
    var N = f.flags;
    switch (f.tag) {
      case 0:
      case 11:
      case 15:
        ua(
          u,
          f,
          b,
          M
        ), N & 2048 && eo(9, f);
        break;
      case 1:
        ua(
          u,
          f,
          b,
          M
        );
        break;
      case 3:
        ua(
          u,
          f,
          b,
          M
        ), N & 2048 && (u = null, f.alternate !== null && (u = f.alternate.memoizedState.cache), f = f.memoizedState.cache, f !== u && (f.refCount++, u != null && Vu(u)));
        break;
      case 12:
        if (N & 2048) {
          ua(
            u,
            f,
            b,
            M
          ), u = f.stateNode;
          try {
            var L = f.memoizedProps, H = L.id, ee = L.onPostCommit;
            typeof ee == "function" && ee(
              H,
              f.alternate === null ? "mount" : "update",
              u.passiveEffectDuration,
              -0
            );
          } catch (ue) {
            Kn(f, f.return, ue);
          }
        } else
          ua(
            u,
            f,
            b,
            M
          );
        break;
      case 31:
        ua(
          u,
          f,
          b,
          M
        );
        break;
      case 13:
        ua(
          u,
          f,
          b,
          M
        );
        break;
      case 23:
        break;
      case 22:
        L = f.stateNode, H = f.alternate, f.memoizedState !== null ? L._visibility & 2 ? ua(
          u,
          f,
          b,
          M
        ) : ol(u, f) : L._visibility & 2 ? ua(
          u,
          f,
          b,
          M
        ) : (L._visibility |= 2, da(
          u,
          f,
          b,
          M,
          (f.subtreeFlags & 10256) !== 0 || !1
        )), N & 2048 && $c(H, f);
        break;
      case 24:
        ua(
          u,
          f,
          b,
          M
        ), N & 2048 && id(f.alternate, f);
        break;
      default:
        ua(
          u,
          f,
          b,
          M
        );
    }
  }
  function da(u, f, b, M, N) {
    for (N = N && ((f.subtreeFlags & 10256) !== 0 || !1), f = f.child; f !== null; ) {
      var L = u, H = f, ee = b, ue = M, De = H.flags;
      switch (H.tag) {
        case 0:
        case 11:
        case 15:
          da(
            L,
            H,
            ee,
            ue,
            N
          ), eo(8, H);
          break;
        case 23:
          break;
        case 22:
          var $e = H.stateNode;
          H.memoizedState !== null ? $e._visibility & 2 ? da(
            L,
            H,
            ee,
            ue,
            N
          ) : ol(
            L,
            H
          ) : ($e._visibility |= 2, da(
            L,
            H,
            ee,
            ue,
            N
          )), N && De & 2048 && $c(
            H.alternate,
            H
          );
          break;
        case 24:
          da(
            L,
            H,
            ee,
            ue,
            N
          ), N && De & 2048 && id(H.alternate, H);
          break;
        default:
          da(
            L,
            H,
            ee,
            ue,
            N
          );
      }
      f = f.sibling;
    }
  }
  function ol(u, f) {
    if (f.subtreeFlags & 10256)
      for (f = f.child; f !== null; ) {
        var b = u, M = f, N = M.flags;
        switch (M.tag) {
          case 22:
            ol(b, M), N & 2048 && $c(
              M.alternate,
              M
            );
            break;
          case 24:
            ol(b, M), N & 2048 && id(M.alternate, M);
            break;
          default:
            ol(b, M);
        }
        f = f.sibling;
      }
  }
  var rd = 8192;
  function Cs(u, f, b) {
    if (u.subtreeFlags & rd)
      for (u = u.child; u !== null; )
        gg(
          u,
          f,
          b
        ), u = u.sibling;
  }
  function gg(u, f, b) {
    switch (u.tag) {
      case 26:
        Cs(
          u,
          f,
          b
        ), u.flags & rd && u.memoizedState !== null && WY(
          b,
          io,
          u.memoizedState,
          u.memoizedProps
        );
        break;
      case 5:
        Cs(
          u,
          f,
          b
        );
        break;
      case 3:
      case 4:
        var M = io;
        io = Ew(u.stateNode.containerInfo), Cs(
          u,
          f,
          b
        ), io = M;
        break;
      case 22:
        u.memoizedState === null && (M = u.alternate, M !== null && M.memoizedState !== null ? (M = rd, rd = 16777216, Cs(
          u,
          f,
          b
        ), rd = M) : Cs(
          u,
          f,
          b
        ));
        break;
      default:
        Cs(
          u,
          f,
          b
        );
    }
  }
  function ad(u) {
    var f = u.alternate;
    if (f !== null && (u = f.child, u !== null)) {
      f.child = null;
      do
        f = u.sibling, u.sibling = null, u = f;
      while (u !== null);
    }
  }
  function Xc(u) {
    var f = u.deletions;
    if ((u.flags & 16) !== 0) {
      if (f !== null)
        for (var b = 0; b < f.length; b++) {
          var M = f[b];
          Jr = M, hr(
            M,
            u
          );
        }
      ad(u);
    }
    if (u.subtreeFlags & 10256)
      for (u = u.child; u !== null; )
        ts(u), u = u.sibling;
  }
  function ts(u) {
    switch (u.tag) {
      case 0:
      case 11:
      case 15:
        Xc(u), u.flags & 2048 && la(9, u, u.return);
        break;
      case 3:
        Xc(u);
        break;
      case 12:
        Xc(u);
        break;
      case 22:
        var f = u.stateNode;
        u.memoizedState !== null && f._visibility & 2 && (u.return === null || u.return.tag !== 13) ? (f._visibility &= -3, ns(u)) : Xc(u);
        break;
      default:
        Xc(u);
    }
  }
  function ns(u) {
    var f = u.deletions;
    if ((u.flags & 16) !== 0) {
      if (f !== null)
        for (var b = 0; b < f.length; b++) {
          var M = f[b];
          Jr = M, hr(
            M,
            u
          );
        }
      ad(u);
    }
    for (u = u.child; u !== null; ) {
      switch (f = u, f.tag) {
        case 0:
        case 11:
        case 15:
          la(8, f, f.return), ns(f);
          break;
        case 22:
          b = f.stateNode, b._visibility & 2 && (b._visibility &= -3, ns(f));
          break;
        default:
          ns(f);
      }
      u = u.sibling;
    }
  }
  function hr(u, f) {
    for (; Jr !== null; ) {
      var b = Jr;
      switch (b.tag) {
        case 0:
        case 11:
        case 15:
          la(8, b, f);
          break;
        case 23:
        case 22:
          if (b.memoizedState !== null && b.memoizedState.cachePool !== null) {
            var M = b.memoizedState.cachePool.pool;
            M != null && M.refCount++;
          }
          break;
        case 24:
          Vu(b.memoizedState.cache);
      }
      if (M = b.child, M !== null) M.return = b, Jr = M;
      else
        e: for (b = u; Jr !== null; ) {
          M = Jr;
          var N = M.sibling, L = M.return;
          if (wp(M), M === b) {
            Jr = null;
            break e;
          }
          if (N !== null) {
            N.return = L, Jr = N;
            break e;
          }
          Jr = L;
        }
    }
  }
  var ec = {
    getCacheForType: function(u) {
      var f = tn(Ar), b = f.data.get(u);
      return b === void 0 && (b = u(), f.data.set(u, b)), b;
    },
    cacheSignal: function() {
      return tn(Ar).controller.signal;
    }
  }, mn = typeof WeakMap == "function" ? WeakMap : Map, Vt = 0, ln = null, Tn = null, xn = 0, Vn = 0, wa = null, ao = !1, Eo = !1, X0 = !1, As = 0, ir = 0, ll = 0, Yc = 0, Mp = 0, Ua = 0, ji = 0, sd = null, fr = null, pr = !1, Ch = 0, Y0 = 0, wr = 1 / 0, rr = null, Mr = null, vi = 0, Rs = null, Ah = null, so = 0, Rh = 0, Nh = null, Tp = null, qc = 0, od = null;
  function Ns() {
    return (Vt & 2) !== 0 && xn !== 0 ? xn & -xn : G.T !== null ? Ue() : Bn();
  }
  function Dn() {
    if (Ua === 0)
      if ((xn & 536870912) === 0 || jn) {
        var u = Le;
        Le <<= 1, (Le & 3932160) === 0 && (Le = 262144), Ua = u;
      } else Ua = 536870912;
    return u = Ka.current, u !== null && (u.flags |= 32), Ua;
  }
  function En(u, f, b) {
    (u === ln && (Vn === 2 || Vn === 9) || u.cancelPendingCommit !== null) && (Kc(u, 0), Nr(
      u,
      xn,
      Ua,
      !1
    )), Fi(u, b), ((Vt & 2) === 0 || u !== ln) && (u === ln && ((Vt & 2) === 0 && (Yc |= b), ir === 4 && Nr(
      u,
      xn,
      Ua,
      !1
    )), lt(u));
  }
  function Ln(u, f, b) {
    if ((Vt & 6) !== 0) throw Error(i(327));
    var M = !b && (f & 127) === 0 && (f & u.expiredLanes) === 0 || At(u, f), N = M ? Ep(u, f) : ja(u, f, !0), L = M;
    do {
      if (N === 0) {
        Eo && !M && Nr(u, f, 0, !1);
        break;
      } else {
        if (b = u.current.alternate, L && !gi(b)) {
          N = ja(u, f, !1), L = !1;
          continue;
        }
        if (N === 2) {
          if (L = f, u.errorRecoveryDisabledLanes & L)
            var H = 0;
          else
            H = u.pendingLanes & -536870913, H = H !== 0 ? H : H & 536870912 ? 536870912 : 0;
          if (H !== 0) {
            f = H;
            e: {
              var ee = u;
              N = sd;
              var ue = ee.current.memoizedState.isDehydrated;
              if (ue && (Kc(ee, H).flags |= 256), H = ja(
                ee,
                H,
                !1
              ), H !== 2) {
                if (X0 && !ue) {
                  ee.errorRecoveryDisabledLanes |= L, Yc |= L, N = 4;
                  break e;
                }
                L = fr, fr = N, L !== null && (fr === null ? fr = L : fr.push.apply(
                  fr,
                  L
                ));
              }
              N = H;
            }
            if (L = !1, N !== 2) continue;
          }
        }
        if (N === 1) {
          Kc(u, 0), Nr(u, f, 0, !0);
          break;
        }
        e: {
          switch (M = u, L = N, L) {
            case 0:
            case 1:
              throw Error(i(345));
            case 4:
              if ((f & 4194048) !== f) break;
            case 6:
              Nr(
                M,
                f,
                Ua,
                !ao
              );
              break e;
            case 2:
              fr = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(i(329));
          }
          if ((f & 62914560) === f && (N = Ch + 300 - Ce(), 10 < N)) {
            if (Nr(
              M,
              f,
              Ua,
              !ao
            ), at(M, 0, !0) !== 0) break e;
            so = f, M.timeoutHandle = u2(
              Fn.bind(
                null,
                M,
                b,
                fr,
                rr,
                pr,
                f,
                Ua,
                Yc,
                ji,
                ao,
                L,
                "Throttled",
                -0,
                0
              ),
              N
            );
            break e;
          }
          Fn(
            M,
            b,
            fr,
            rr,
            pr,
            f,
            Ua,
            Yc,
            ji,
            ao,
            L,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    lt(u);
  }
  function Fn(u, f, b, M, N, L, H, ee, ue, De, $e, Qe, Pe, Ge) {
    if (u.timeoutHandle = -1, Qe = f.subtreeFlags, Qe & 8192 || (Qe & 16785408) === 16785408) {
      Qe = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: Ul
      }, gg(
        f,
        L,
        Qe
      );
      var Pt = (L & 62914560) === L ? Ch - Ce() : (L & 4194048) === L ? Y0 - Ce() : 0;
      if (Pt = $Y(
        Qe,
        Pt
      ), Pt !== null) {
        so = L, u.cancelPendingCommit = Pt(
          nc.bind(
            null,
            u,
            f,
            L,
            b,
            M,
            N,
            H,
            ee,
            ue,
            $e,
            Qe,
            null,
            Pe,
            Ge
          )
        ), Nr(u, L, H, !De);
        return;
      }
    }
    nc(
      u,
      f,
      L,
      b,
      M,
      N,
      H,
      ee,
      ue
    );
  }
  function gi(u) {
    for (var f = u; ; ) {
      var b = f.tag;
      if ((b === 0 || b === 11 || b === 15) && f.flags & 16384 && (b = f.updateQueue, b !== null && (b = b.stores, b !== null)))
        for (var M = 0; M < b.length; M++) {
          var N = b[M], L = N.getSnapshot;
          N = N.value;
          try {
            if (!Ia(L(), N)) return !1;
          } catch {
            return !1;
          }
        }
      if (b = f.child, f.subtreeFlags & 16384 && b !== null)
        b.return = f, f = b;
      else {
        if (f === u) break;
        for (; f.sibling === null; ) {
          if (f.return === null || f.return === u) return !0;
          f = f.return;
        }
        f.sibling.return = f.return, f = f.sibling;
      }
    }
    return !0;
  }
  function Nr(u, f, b, M) {
    f &= ~Mp, f &= ~Yc, u.suspendedLanes |= f, u.pingedLanes &= ~f, M && (u.warmLanes |= f), M = u.expirationTimes;
    for (var N = f; 0 < N; ) {
      var L = 31 - Wt(N), H = 1 << L;
      M[L] = -1, N &= ~H;
    }
    b !== 0 && Or(u, b, f);
  }
  function Co() {
    return (Vt & 6) === 0 ? (Nt(0), !1) : !0;
  }
  function Zc() {
    if (Tn !== null) {
      if (Vn === 0)
        var u = Tn.return;
      else
        u = Tn, Qo = Oc = null, g0(u), Yu = null, qu = 0, u = Tn;
      for (; u !== null; )
        Es(u.alternate, u), u = u.return;
      Tn = null;
    }
  }
  function Kc(u, f) {
    var b = u.timeoutHandle;
    b !== -1 && (u.timeoutHandle = -1, AY(b)), b = u.cancelPendingCommit, b !== null && (u.cancelPendingCommit = null, b()), so = 0, Zc(), ln = u, Tn = b = Ya(u.current, null), xn = f, Vn = 0, wa = null, ao = !1, Eo = At(u, f), X0 = !1, ji = Ua = Mp = Yc = ll = ir = 0, fr = sd = null, pr = !1, (f & 8) !== 0 && (f |= f & 32);
    var M = u.entangledLanes;
    if (M !== 0)
      for (u = u.entanglements, M &= f; 0 < M; ) {
        var N = 31 - Wt(M), L = 1 << N;
        f |= u[N], M &= ~L;
      }
    return As = f, ap(), b;
  }
  function cl(u, f) {
    pn = null, G.H = Mh, f === Gu || f === Mn ? (f = $u(), Vn = 3) : f === cp ? (f = $u(), Vn = 4) : Vn = f === ag ? 8 : f !== null && typeof f == "object" && typeof f.then == "function" ? 6 : 1, wa = f, Tn === null && (ir = 1, rg(
      u,
      Ss(f, u.current)
    ));
  }
  function ar() {
    var u = Ka.current;
    return u === null ? !0 : (xn & 4194048) === xn ? za === null : (xn & 62914560) === xn || (xn & 536870912) !== 0 ? u === za : !1;
  }
  function tc() {
    var u = G.H;
    return G.H = Mh, u === null ? Mh : u;
  }
  function Qc() {
    var u = G.A;
    return G.A = ec, u;
  }
  function kh() {
    ir = 4, ao || (xn & 4194048) !== xn && Ka.current !== null || (Eo = !0), (ll & 134217727) === 0 && (Yc & 134217727) === 0 || ln === null || Nr(
      ln,
      xn,
      Ua,
      !1
    );
  }
  function ja(u, f, b) {
    var M = Vt;
    Vt |= 2;
    var N = tc(), L = Qc();
    (ln !== u || xn !== f) && (rr = null, Kc(u, f)), f = !1;
    var H = ir;
    e: do
      try {
        if (Vn !== 0 && Tn !== null) {
          var ee = Tn, ue = wa;
          switch (Vn) {
            case 8:
              Zc(), H = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              Ka.current === null && (f = !0);
              var De = Vn;
              if (Vn = 0, wa = null, ld(u, ee, ue, De), b && Eo) {
                H = 0;
                break e;
              }
              break;
            default:
              De = Vn, Vn = 0, wa = null, ld(u, ee, ue, De);
          }
        }
        Dh(), H = ir;
        break;
      } catch ($e) {
        cl(u, $e);
      }
    while (!0);
    return f && u.shellSuspendCounter++, Qo = Oc = null, Vt = M, G.H = N, G.A = L, Tn === null && (ln = null, xn = 0, ap()), H;
  }
  function Dh() {
    for (; Tn !== null; ) _g(Tn);
  }
  function Ep(u, f) {
    var b = Vt;
    Vt |= 2;
    var M = tc(), N = Qc();
    ln !== u || xn !== f ? (rr = null, wr = Ce() + 500, Kc(u, f)) : Eo = At(
      u,
      f
    );
    e: do
      try {
        if (Vn !== 0 && Tn !== null) {
          f = Tn;
          var L = wa;
          t: switch (Vn) {
            case 1:
              Vn = 0, wa = null, ld(u, f, L, 1);
              break;
            case 2:
            case 9:
              if (Za(L)) {
                Vn = 0, wa = null, Cp(f);
                break;
              }
              f = function() {
                Vn !== 2 && Vn !== 9 || ln !== u || (Vn = 7), lt(u);
              }, L.then(f, f);
              break e;
            case 3:
              Vn = 7;
              break e;
            case 4:
              Vn = 5;
              break e;
            case 7:
              Za(L) ? (Vn = 0, wa = null, Cp(f)) : (Vn = 0, wa = null, ld(u, f, L, 7));
              break;
            case 5:
              var H = null;
              switch (Tn.tag) {
                case 26:
                  H = Tn.memoizedState;
                case 5:
                case 27:
                  var ee = Tn;
                  if (H ? T2(H) : ee.stateNode.complete) {
                    Vn = 0, wa = null;
                    var ue = ee.sibling;
                    if (ue !== null) Tn = ue;
                    else {
                      var De = ee.return;
                      De !== null ? (Tn = De, Jc(De)) : Tn = null;
                    }
                    break t;
                  }
              }
              Vn = 0, wa = null, ld(u, f, L, 5);
              break;
            case 6:
              Vn = 0, wa = null, ld(u, f, L, 6);
              break;
            case 8:
              Zc(), ir = 6;
              break e;
            default:
              throw Error(i(462));
          }
        }
        is();
        break;
      } catch ($e) {
        cl(u, $e);
      }
    while (!0);
    return Qo = Oc = null, G.H = M, G.A = N, Vt = b, Tn !== null ? 0 : (ln = null, xn = 0, ap(), ir);
  }
  function is() {
    for (; Tn !== null && !X(); )
      _g(Tn);
  }
  function _g(u) {
    var f = fg(u.alternate, u, As);
    u.memoizedProps = u.pendingProps, f === null ? Jc(u) : Tn = f;
  }
  function Cp(u) {
    var f = u, b = f.alternate;
    switch (f.tag) {
      case 15:
      case 0:
        f = _p(
          b,
          f,
          f.pendingProps,
          f.type,
          void 0,
          xn
        );
        break;
      case 11:
        f = _p(
          b,
          f,
          f.pendingProps,
          f.type.render,
          f.ref,
          xn
        );
        break;
      case 5:
        g0(f);
      default:
        Es(b, f), f = Tn = uh(f, As), f = fg(b, f, As);
    }
    u.memoizedProps = u.pendingProps, f === null ? Jc(u) : Tn = f;
  }
  function ld(u, f, b, M) {
    Qo = Oc = null, g0(f), Yu = null, qu = 0;
    var N = f.return;
    try {
      if (Br(
        u,
        N,
        f,
        b,
        xn
      )) {
        ir = 1, rg(
          u,
          Ss(b, u.current)
        ), Tn = null;
        return;
      }
    } catch (L) {
      if (N !== null) throw Tn = N, L;
      ir = 1, rg(
        u,
        Ss(b, u.current)
      ), Tn = null;
      return;
    }
    f.flags & 32768 ? (jn || M === 1 ? u = !0 : Eo || (xn & 536870912) !== 0 ? u = !1 : (ao = u = !0, (M === 2 || M === 9 || M === 3 || M === 6) && (M = Ka.current, M !== null && M.tag === 13 && (M.flags |= 16384))), Ap(f, u)) : Jc(f);
  }
  function Jc(u) {
    var f = u;
    do {
      if ((f.flags & 32768) !== 0) {
        Ap(
          f,
          ao
        );
        return;
      }
      u = f.return;
      var b = xp(
        f.alternate,
        f,
        As
      );
      if (b !== null) {
        Tn = b;
        return;
      }
      if (f = f.sibling, f !== null) {
        Tn = f;
        return;
      }
      Tn = f = u;
    } while (f !== null);
    ir === 0 && (ir = 5);
  }
  function Ap(u, f) {
    do {
      var b = Js(u.alternate, u);
      if (b !== null) {
        b.flags &= 32767, Tn = b;
        return;
      }
      if (b = u.return, b !== null && (b.flags |= 32768, b.subtreeFlags = 0, b.deletions = null), !f && (u = u.sibling, u !== null)) {
        Tn = u;
        return;
      }
      Tn = u = b;
    } while (u !== null);
    ir = 6, Tn = null;
  }
  function nc(u, f, b, M, N, L, H, ee, ue) {
    u.cancelPendingCommit = null;
    do
      Lh();
    while (vi !== 0);
    if ((Vt & 6) !== 0) throw Error(i(327));
    if (f !== null) {
      if (f === u.current) throw Error(i(177));
      if (L = f.lanes | f.childLanes, L |= qr, Wi(
        u,
        b,
        L,
        H,
        ee,
        ue
      ), u === ln && (Tn = ln = null, xn = 0), Ah = f, Rs = u, so = b, Rh = L, Nh = N, Tp = M, (f.subtreeFlags & 10256) !== 0 || (f.flags & 10256) !== 0 ? (u.callbackNode = null, u.callbackPriority = 0, z(Me, function() {
        return yg(), null;
      })) : (u.callbackNode = null, u.callbackPriority = 0), M = (f.flags & 13878) !== 0, (f.subtreeFlags & 13878) !== 0 || M) {
        M = G.T, G.T = null, N = Z.p, Z.p = 2, H = Vt, Vt |= 4;
        try {
          nN(u, f, b);
        } finally {
          Vt = H, Z.p = N, G.T = M;
        }
      }
      vi = 1, kr(), ic(), cd();
    }
  }
  function kr() {
    if (vi === 1) {
      vi = 0;
      var u = Rs, f = Ah, b = (f.flags & 13878) !== 0;
      if ((f.subtreeFlags & 13878) !== 0 || b) {
        b = G.T, G.T = null;
        var M = Z.p;
        Z.p = 2;
        var N = Vt;
        Vt |= 4;
        try {
          Wc(f, u);
          var L = cN, H = M1(u.containerInfo), ee = L.focusedElem, ue = L.selectionRange;
          if (H !== ee && ee && ee.ownerDocument && Ri(
            ee.ownerDocument.documentElement,
            ee
          )) {
            if (ue !== null && Jy(ee)) {
              var De = ue.start, $e = ue.end;
              if ($e === void 0 && ($e = De), "selectionStart" in ee)
                ee.selectionStart = De, ee.selectionEnd = Math.min(
                  $e,
                  ee.value.length
                );
              else {
                var Qe = ee.ownerDocument || document, Pe = Qe && Qe.defaultView || window;
                if (Pe.getSelection) {
                  var Ge = Pe.getSelection(), Pt = ee.textContent.length, Jt = Math.min(ue.start, Pt), Li = ue.end === void 0 ? Jt : Math.min(ue.end, Pt);
                  !Ge.extend && Jt > Li && (H = Li, Li = Jt, Jt = H);
                  var we = oh(
                    ee,
                    Jt
                  ), ve = oh(
                    ee,
                    Li
                  );
                  if (we && ve && (Ge.rangeCount !== 1 || Ge.anchorNode !== we.node || Ge.anchorOffset !== we.offset || Ge.focusNode !== ve.node || Ge.focusOffset !== ve.offset)) {
                    var ke = Qe.createRange();
                    ke.setStart(we.node, we.offset), Ge.removeAllRanges(), Jt > Li ? (Ge.addRange(ke), Ge.extend(ve.node, ve.offset)) : (ke.setEnd(ve.node, ve.offset), Ge.addRange(ke));
                  }
                }
              }
            }
            for (Qe = [], Ge = ee; Ge = Ge.parentNode; )
              Ge.nodeType === 1 && Qe.push({
                element: Ge,
                left: Ge.scrollLeft,
                top: Ge.scrollTop
              });
            for (typeof ee.focus == "function" && ee.focus(), ee = 0; ee < Qe.length; ee++) {
              var Ze = Qe[ee];
              Ze.element.scrollLeft = Ze.left, Ze.element.scrollTop = Ze.top;
            }
          }
          Dw = !!lN, cN = lN = null;
        } finally {
          Vt = N, Z.p = M, G.T = b;
        }
      }
      u.current = f, vi = 2;
    }
  }
  function ic() {
    if (vi === 2) {
      vi = 0;
      var u = Rs, f = Ah, b = (f.flags & 8772) !== 0;
      if ((f.subtreeFlags & 8772) !== 0 || b) {
        b = G.T, G.T = null;
        var M = Z.p;
        Z.p = 2;
        var N = Vt;
        Vt |= 4;
        try {
          Zi(u, f.alternate, f);
        } finally {
          Vt = N, Z.p = M, G.T = b;
        }
      }
      vi = 3;
    }
  }
  function cd() {
    if (vi === 4 || vi === 3) {
      vi = 0, me();
      var u = Rs, f = Ah, b = so, M = Tp;
      (f.subtreeFlags & 10256) !== 0 || (f.flags & 10256) !== 0 ? vi = 5 : (vi = 0, Ah = Rs = null, ul(u, u.pendingLanes));
      var N = u.pendingLanes;
      if (N === 0 && (Mr = null), wt(b), f = f.stateNode, kt && typeof kt.onCommitFiberRoot == "function")
        try {
          kt.onCommitFiberRoot(
            It,
            f,
            void 0,
            (f.current.flags & 128) === 128
          );
        } catch {
        }
      if (M !== null) {
        f = G.T, N = Z.p, Z.p = 2, G.T = null;
        try {
          for (var L = u.onRecoverableError, H = 0; H < M.length; H++) {
            var ee = M[H];
            L(ee.value, {
              componentStack: ee.stack
            });
          }
        } finally {
          G.T = f, Z.p = N;
        }
      }
      (so & 3) !== 0 && Lh(), lt(u), N = u.pendingLanes, (b & 261930) !== 0 && (N & 42) !== 0 ? u === od ? qc++ : (qc = 0, od = u) : qc = 0, Nt(0);
    }
  }
  function ul(u, f) {
    (u.pooledCacheLanes &= f) === 0 && (f = u.pooledCache, f != null && (u.pooledCache = null, Vu(f)));
  }
  function Lh() {
    return kr(), ic(), cd(), yg();
  }
  function yg() {
    if (vi !== 5) return !1;
    var u = Rs, f = Rh;
    Rh = 0;
    var b = wt(so), M = G.T, N = Z.p;
    try {
      Z.p = 32 > b ? 32 : b, G.T = null, b = Nh, Nh = null;
      var L = Rs, H = so;
      if (vi = 0, Ah = Rs = null, so = 0, (Vt & 6) !== 0) throw Error(i(331));
      var ee = Vt;
      if (Vt |= 4, ts(L.current), $0(
        L,
        L.current,
        H,
        b
      ), Vt = ee, Nt(0, !1), kt && typeof kt.onPostCommitFiberRoot == "function")
        try {
          kt.onPostCommitFiberRoot(It, L);
        } catch {
        }
      return !0;
    } finally {
      Z.p = N, G.T = M, ul(u, f);
    }
  }
  function q0(u, f, b) {
    f = Ss(b, f), f = B0(u.stateNode, f, 2), u = Bc(u, f, 2), u !== null && (Fi(u, 2), lt(u));
  }
  function Kn(u, f, b) {
    if (u.tag === 3)
      q0(u, u, b);
    else
      for (; f !== null; ) {
        if (f.tag === 3) {
          q0(
            f,
            u,
            b
          );
          break;
        } else if (f.tag === 1) {
          var M = f.stateNode;
          if (typeof f.type.getDerivedStateFromError == "function" || typeof M.componentDidCatch == "function" && (Mr === null || !Mr.has(M))) {
            u = Ss(b, u), b = U0(2), M = Bc(f, b, 2), M !== null && (gw(
              b,
              M,
              f,
              u
            ), Fi(M, 2), lt(M));
            break;
          }
        }
        f = f.return;
      }
  }
  function Rp(u, f, b) {
    var M = u.pingCache;
    if (M === null) {
      M = u.pingCache = new mn();
      var N = /* @__PURE__ */ new Set();
      M.set(f, N);
    } else
      N = M.get(f), N === void 0 && (N = /* @__PURE__ */ new Set(), M.set(f, N));
    N.has(b) || (X0 = !0, N.add(b), u = m.bind(null, u, f, b), f.then(u, u));
  }
  function m(u, f, b) {
    var M = u.pingCache;
    M !== null && M.delete(f), u.pingedLanes |= u.suspendedLanes & b, u.warmLanes &= ~b, ln === u && (xn & b) === b && (ir === 4 || ir === 3 && (xn & 62914560) === xn && 300 > Ce() - Ch ? (Vt & 2) === 0 && Kc(u, 0) : Mp |= b, ji === xn && (ji = 0)), lt(u);
  }
  function _(u, f) {
    f === 0 && (f = hn()), u = Pa(u, f), u !== null && (Fi(u, f), lt(u));
  }
  function T(u) {
    var f = u.memoizedState, b = 0;
    f !== null && (b = f.retryLane), _(u, b);
  }
  function R(u, f) {
    var b = 0;
    switch (u.tag) {
      case 31:
      case 13:
        var M = u.stateNode, N = u.memoizedState;
        N !== null && (b = N.retryLane);
        break;
      case 19:
        M = u.stateNode;
        break;
      case 22:
        M = u.stateNode._retryCache;
        break;
      default:
        throw Error(i(314));
    }
    M !== null && M.delete(f), _(u, b);
  }
  function z(u, f) {
    return Re(u, f);
  }
  var B = null, Q = null, fe = !1, He = !1, it = !1, pt = 0;
  function lt(u) {
    u !== Q && u.next === null && (Q === null ? B = Q = u : Q = Q.next = u), He = !0, fe || (fe = !0, Te());
  }
  function Nt(u, f) {
    if (!it && He) {
      it = !0;
      do
        for (var b = !1, M = B; M !== null; ) {
          if (u !== 0) {
            var N = M.pendingLanes;
            if (N === 0) var L = 0;
            else {
              var H = M.suspendedLanes, ee = M.pingedLanes;
              L = (1 << 31 - Wt(42 | u) + 1) - 1, L &= N & ~(H & ~ee), L = L & 201326741 ? L & 201326741 | 1 : L ? L | 2 : 0;
            }
            L !== 0 && (b = !0, Ie(M, L));
          } else
            L = xn, L = at(
              M,
              M === ln ? L : 0,
              M.cancelPendingCommit !== null || M.timeoutHandle !== -1
            ), (L & 3) === 0 || At(M, L) || (b = !0, Ie(M, L));
          M = M.next;
        }
      while (b);
      it = !1;
    }
  }
  function fn() {
    Tr();
  }
  function Tr() {
    He = fe = !1;
    var u = 0;
    pt !== 0 && CY() && (u = pt);
    for (var f = Ce(), b = null, M = B; M !== null; ) {
      var N = M.next, L = Ih(M, f);
      L === 0 ? (M.next = null, b === null ? B = N : b.next = N, N === null && (Q = b)) : (b = M, (u !== 0 || (L & 3) !== 0) && (He = !0)), M = N;
    }
    vi !== 0 && vi !== 5 || Nt(u), pt !== 0 && (pt = 0);
  }
  function Ih(u, f) {
    for (var b = u.suspendedLanes, M = u.pingedLanes, N = u.expirationTimes, L = u.pendingLanes & -62914561; 0 < L; ) {
      var H = 31 - Wt(L), ee = 1 << H, ue = N[H];
      ue === -1 ? ((ee & b) === 0 || (ee & M) !== 0) && (N[H] = en(ee, f)) : ue <= f && (u.expiredLanes |= ee), L &= ~ee;
    }
    if (f = ln, b = xn, b = at(
      u,
      u === f ? b : 0,
      u.cancelPendingCommit !== null || u.timeoutHandle !== -1
    ), M = u.callbackNode, b === 0 || u === f && (Vn === 2 || Vn === 9) || u.cancelPendingCommit !== null)
      return M !== null && M !== null && te(M), u.callbackNode = null, u.callbackPriority = 0;
    if ((b & 3) === 0 || At(u, b)) {
      if (f = b & -b, f === u.callbackPriority) return f;
      switch (M !== null && te(M), wt(b)) {
        case 2:
        case 8:
          b = ft;
          break;
        case 32:
          b = Me;
          break;
        case 268435456:
          b = St;
          break;
        default:
          b = Me;
      }
      return M = eu.bind(null, u), b = Re(b, M), u.callbackPriority = f, u.callbackNode = b, f;
    }
    return M !== null && M !== null && te(M), u.callbackPriority = 2, u.callbackNode = null, 2;
  }
  function eu(u, f) {
    if (vi !== 0 && vi !== 5)
      return u.callbackNode = null, u.callbackPriority = 0, null;
    var b = u.callbackNode;
    if (Lh() && u.callbackNode !== b)
      return null;
    var M = xn;
    return M = at(
      u,
      u === ln ? M : 0,
      u.cancelPendingCommit !== null || u.timeoutHandle !== -1
    ), M === 0 ? null : (Ln(u, M, f), Ih(u, Ce()), u.callbackNode != null && u.callbackNode === b ? eu.bind(null, u) : null);
  }
  function Ie(u, f) {
    if (Lh()) return null;
    Ln(u, f, !0);
  }
  function Te() {
    RY(function() {
      (Vt & 6) !== 0 ? Re(
        xe,
        fn
      ) : Tr();
    });
  }
  function Ue() {
    if (pt === 0) {
      var u = $l;
      u === 0 && (u = Ye, Ye <<= 1, (Ye & 261888) === 0 && (Ye = 256)), pt = u;
    }
    return pt;
  }
  function dt(u) {
    return u == null || typeof u == "symbol" || typeof u == "boolean" ? null : typeof u == "function" ? u : Wf("" + u);
  }
  function Zt(u, f) {
    var b = f.ownerDocument.createElement("input");
    return b.name = f.name, b.value = f.value, u.id && b.setAttribute("form", u.id), f.parentNode.insertBefore(b, f), u = new FormData(u), b.parentNode.removeChild(b), u;
  }
  function sr(u, f, b, M, N) {
    if (f === "submit" && b && b.stateNode === N) {
      var L = dt(
        (N[_r] || null).action
      ), H = M.submitter;
      H && (f = (f = H[_r] || null) ? dt(f.formAction) : H.getAttribute("formAction"), f !== null && (L = f, H = null));
      var ee = new Yf(
        "action",
        "action",
        null,
        M,
        N
      );
      u.push({
        event: ee,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (M.defaultPrevented) {
                if (pt !== 0) {
                  var ue = H ? Zt(N, H) : new FormData(N);
                  k0(
                    b,
                    {
                      pending: !0,
                      data: ue,
                      method: N.method,
                      action: L
                    },
                    null,
                    ue
                  );
                }
              } else
                typeof L == "function" && (ee.preventDefault(), ue = H ? Zt(N, H) : new FormData(N), k0(
                  b,
                  {
                    pending: !0,
                    data: ue,
                    method: N.method,
                    action: L
                  },
                  L,
                  ue
                ));
            },
            currentTarget: N
          }
        ]
      });
    }
  }
  for (var Qt = 0; Qt < ip.length; Qt++) {
    var Xn = ip[Qt], ea = Xn.toLowerCase(), ei = Xn[0].toUpperCase() + Xn.slice(1);
    $s(
      ea,
      "on" + ei
    );
  }
  $s(Dv, "onAnimationEnd"), $s(np, "onAnimationIteration"), $s(t0, "onAnimationStart"), $s("dblclick", "onDoubleClick"), $s("focusin", "onFocus"), $s("focusout", "onBlur"), $s(E1, "onTransitionRun"), $s(YR, "onTransitionStart"), $s(C1, "onTransitionCancel"), $s(n0, "onTransitionEnd"), bt("onMouseEnter", ["mouseout", "mouseover"]), bt("onMouseLeave", ["mouseout", "mouseover"]), bt("onPointerEnter", ["pointerout", "pointerover"]), bt("onPointerLeave", ["pointerout", "pointerover"]), Et(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), Et(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), Et("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), Et(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), Et(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), Et(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var oo = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), iN = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(oo)
  );
  function n2(u, f) {
    f = (f & 4) !== 0;
    for (var b = 0; b < u.length; b++) {
      var M = u[b], N = M.event;
      M = M.listeners;
      e: {
        var L = void 0;
        if (f)
          for (var H = M.length - 1; 0 <= H; H--) {
            var ee = M[H], ue = ee.instance, De = ee.currentTarget;
            if (ee = ee.listener, ue !== L && N.isPropagationStopped())
              break e;
            L = ee, N.currentTarget = De;
            try {
              L(N);
            } catch ($e) {
              rp($e);
            }
            N.currentTarget = null, L = ue;
          }
        else
          for (H = 0; H < M.length; H++) {
            if (ee = M[H], ue = ee.instance, De = ee.currentTarget, ee = ee.listener, ue !== L && N.isPropagationStopped())
              break e;
            L = ee, N.currentTarget = De;
            try {
              L(N);
            } catch ($e) {
              rp($e);
            }
            N.currentTarget = null, L = ue;
          }
      }
    }
  }
  function Gn(u, f) {
    var b = f[Vs];
    b === void 0 && (b = f[Vs] = /* @__PURE__ */ new Set());
    var M = u + "__bubble";
    b.has(M) || (i2(f, u, 2, !1), b.add(M));
  }
  function rN(u, f, b) {
    var M = 0;
    f && (M |= 4), i2(
      b,
      u,
      M,
      f
    );
  }
  var ww = "_reactListening" + Math.random().toString(36).slice(2);
  function aN(u) {
    if (!u[ww]) {
      u[ww] = !0, ot.forEach(function(b) {
        b !== "selectionchange" && (iN.has(b) || rN(b, !1, u), rN(b, !0, u));
      });
      var f = u.nodeType === 9 ? u : u.ownerDocument;
      f === null || f[ww] || (f[ww] = !0, rN("selectionchange", !1, f));
    }
  }
  function i2(u, f, b, M) {
    switch (D2(f)) {
      case 2:
        var N = qY;
        break;
      case 8:
        N = ZY;
        break;
      default:
        N = bN;
    }
    b = N.bind(
      null,
      f,
      b,
      u
    ), N = void 0, !zy || f !== "touchstart" && f !== "touchmove" && f !== "wheel" || (N = !0), M ? N !== void 0 ? u.addEventListener(f, b, {
      capture: !0,
      passive: N
    }) : u.addEventListener(f, b, !0) : N !== void 0 ? u.addEventListener(f, b, {
      passive: N
    }) : u.addEventListener(f, b, !1);
  }
  function sN(u, f, b, M, N) {
    var L = M;
    if ((f & 1) === 0 && (f & 2) === 0 && M !== null)
      e: for (; ; ) {
        if (M === null) return;
        var H = M.tag;
        if (H === 3 || H === 4) {
          var ee = M.stateNode.containerInfo;
          if (ee === N) break;
          if (H === 4)
            for (H = M.return; H !== null; ) {
              var ue = H.tag;
              if ((ue === 3 || ue === 4) && H.stateNode.containerInfo === N)
                return;
              H = H.return;
            }
          for (; ee !== null; ) {
            if (H = ne(ee), H === null) return;
            if (ue = H.tag, ue === 5 || ue === 6 || ue === 26 || ue === 27) {
              M = L = H;
              continue e;
            }
            ee = ee.parentNode;
          }
        }
        M = M.return;
      }
    Oy(function() {
      var De = L, $e = yv(b), Qe = [];
      e: {
        var Pe = Ws.get(u);
        if (Pe !== void 0) {
          var Ge = Yf, Pt = u;
          switch (u) {
            case "keypress":
              if (Xf(b) === 0) break e;
            case "keydown":
            case "keyup":
              Ge = Fu;
              break;
            case "focusin":
              Pt = "focus", Ge = wv;
              break;
            case "focusout":
              Pt = "blur", Ge = wv;
              break;
            case "beforeblur":
            case "afterblur":
              Ge = wv;
              break;
            case "click":
              if (b.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              Ge = Fy;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              Ge = s1;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              Ge = h1;
              break;
            case Dv:
            case np:
            case t0:
              Ge = WR;
              break;
            case n0:
              Ge = XR;
              break;
            case "scroll":
            case "scrollend":
              Ge = r1;
              break;
            case "wheel":
              Ge = p1;
              break;
            case "copy":
            case "cut":
            case "paste":
              Ge = l1;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              Ge = jy;
              break;
            case "toggle":
            case "beforetoggle":
              Ge = v1;
          }
          var Jt = (f & 4) !== 0, Li = !Jt && (u === "scroll" || u === "scrollend"), we = Jt ? Pe !== null ? Pe + "Capture" : null : Pe;
          Jt = [];
          for (var ve = De, ke; ve !== null; ) {
            var Ze = ve;
            if (ke = Ze.stateNode, Ze = Ze.tag, Ze !== 5 && Ze !== 26 && Ze !== 27 || ke === null || we === null || (Ze = Qd(ve, we), Ze != null && Jt.push(
              Z0(ve, Ze, ke)
            )), Li) break;
            ve = ve.return;
          }
          0 < Jt.length && (Pe = new Ge(
            Pe,
            Pt,
            null,
            b,
            $e
          ), Qe.push({ event: Pe, listeners: Jt }));
        }
      }
      if ((f & 7) === 0) {
        e: {
          if (Pe = u === "mouseover" || u === "pointerover", Ge = u === "mouseout" || u === "pointerout", Pe && b !== _v && (Pt = b.relatedTarget || b.fromElement) && (ne(Pt) || Pt[Xa]))
            break e;
          if ((Ge || Pe) && (Pe = $e.window === $e ? $e : (Pe = $e.ownerDocument) ? Pe.defaultView || Pe.parentWindow : window, Ge ? (Pt = b.relatedTarget || b.toElement, Ge = De, Pt = Pt ? ne(Pt) : null, Pt !== null && (Li = a(Pt), Jt = Pt.tag, Pt !== Li || Jt !== 5 && Jt !== 27 && Jt !== 6) && (Pt = null)) : (Ge = null, Pt = De), Ge !== Pt)) {
            if (Jt = Fy, Ze = "onMouseLeave", we = "onMouseEnter", ve = "mouse", (u === "pointerout" || u === "pointerover") && (Jt = jy, Ze = "onPointerLeave", we = "onPointerEnter", ve = "pointer"), Li = Ge == null ? Pe : Oe(Ge), ke = Pt == null ? Pe : Oe(Pt), Pe = new Jt(
              Ze,
              ve + "leave",
              Ge,
              b,
              $e
            ), Pe.target = Li, Pe.relatedTarget = ke, Ze = null, ne($e) === De && (Jt = new Jt(
              we,
              ve + "enter",
              Pt,
              b,
              $e
            ), Jt.target = ke, Jt.relatedTarget = Li, Ze = Jt), Li = Ze, Ge && Pt)
              t: {
                for (Jt = SY, we = Ge, ve = Pt, ke = 0, Ze = we; Ze; Ze = Jt(Ze))
                  ke++;
                Ze = 0;
                for (var Yt = ve; Yt; Yt = Jt(Yt))
                  Ze++;
                for (; 0 < ke - Ze; )
                  we = Jt(we), ke--;
                for (; 0 < Ze - ke; )
                  ve = Jt(ve), Ze--;
                for (; ke--; ) {
                  if (we === ve || ve !== null && we === ve.alternate) {
                    Jt = we;
                    break t;
                  }
                  we = Jt(we), ve = Jt(ve);
                }
                Jt = null;
              }
            else Jt = null;
            Ge !== null && r2(
              Qe,
              Pe,
              Ge,
              Jt,
              !1
            ), Pt !== null && Li !== null && r2(
              Qe,
              Li,
              Pt,
              Jt,
              !0
            );
          }
        }
        e: {
          if (Pe = De ? Oe(De) : window, Ge = Pe.nodeName && Pe.nodeName.toLowerCase(), Ge === "select" || Ge === "input" && Pe.type === "file")
            var di = Yy;
          else if (Xy(Pe))
            if (Go)
              di = w1;
            else {
              di = Ky;
              var Ut = x1;
            }
          else
            Ge = Pe.nodeName, !Ge || Ge.toLowerCase() !== "input" || Pe.type !== "checkbox" && Pe.type !== "radio" ? De && gv(De.elementType) && (di = Yy) : di = S1;
          if (di && (di = di(u, De))) {
            Nv(
              Qe,
              di,
              b,
              $e
            );
            break e;
          }
          Ut && Ut(u, Pe, De), u === "focusout" && De && Pe.type === "number" && De.memoizedProps.value != null && $i(Pe, "number", Pe.value);
        }
        switch (Ut = De ? Oe(De) : window, u) {
          case "focusin":
            (Xy(Ut) || Ut.contentEditable === "true") && (Wo = Ut, $o = De, lh = null);
            break;
          case "focusout":
            lh = $o = Wo = null;
            break;
          case "mousedown":
            kv = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            kv = !1, ch(Qe, b, $e);
            break;
          case "selectionchange":
            if (T1) break;
          case "keydown":
          case "keyup":
            ch(Qe, b, $e);
        }
        var An;
        if (Bu)
          e: {
            switch (u) {
              case "compositionstart":
                var Yn = "onCompositionStart";
                break e;
              case "compositionend":
                Yn = "onCompositionEnd";
                break e;
              case "compositionupdate":
                Yn = "onCompositionUpdate";
                break e;
            }
            Yn = void 0;
          }
        else
          Uu ? Rv(u, b) && (Yn = "onCompositionEnd") : u === "keydown" && b.keyCode === 229 && (Yn = "onCompositionStart");
        Yn && (Vy && b.locale !== "ko" && (Uu || Yn !== "onCompositionStart" ? Yn === "onCompositionEnd" && Uu && (An = $f()) : (xs = $e, xv = "value" in xs ? xs.value : xs.textContent, Uu = !0)), Ut = Mw(De, Yn), 0 < Ut.length && (Yn = new Mv(
          Yn,
          u,
          null,
          b,
          $e
        ), Qe.push({ event: Yn, listeners: Ut }), An ? Yn.data = An : (An = Gy(b), An !== null && (Yn.data = An)))), (An = Av ? y1(u, b) : Wy(u, b)) && (Yn = Mw(De, "onBeforeInput"), 0 < Yn.length && (Ut = new Mv(
          "onBeforeInput",
          "beforeinput",
          null,
          b,
          $e
        ), Qe.push({
          event: Ut,
          listeners: Yn
        }), Ut.data = An)), sr(
          Qe,
          u,
          De,
          b,
          $e
        );
      }
      n2(Qe, f);
    });
  }
  function Z0(u, f, b) {
    return {
      instance: u,
      listener: f,
      currentTarget: b
    };
  }
  function Mw(u, f) {
    for (var b = f + "Capture", M = []; u !== null; ) {
      var N = u, L = N.stateNode;
      if (N = N.tag, N !== 5 && N !== 26 && N !== 27 || L === null || (N = Qd(u, b), N != null && M.unshift(
        Z0(u, N, L)
      ), N = Qd(u, f), N != null && M.push(
        Z0(u, N, L)
      )), u.tag === 3) return M;
      u = u.return;
    }
    return [];
  }
  function SY(u) {
    if (u === null) return null;
    do
      u = u.return;
    while (u && u.tag !== 5 && u.tag !== 27);
    return u || null;
  }
  function r2(u, f, b, M, N) {
    for (var L = f._reactName, H = []; b !== null && b !== M; ) {
      var ee = b, ue = ee.alternate, De = ee.stateNode;
      if (ee = ee.tag, ue !== null && ue === M) break;
      ee !== 5 && ee !== 26 && ee !== 27 || De === null || (ue = De, N ? (De = Qd(b, L), De != null && H.unshift(
        Z0(b, De, ue)
      )) : N || (De = Qd(b, L), De != null && H.push(
        Z0(b, De, ue)
      ))), b = b.return;
    }
    H.length !== 0 && u.push({ event: f, listeners: H });
  }
  var wY = /\r\n?/g, MY = /\u0000|\uFFFD/g;
  function a2(u) {
    return (typeof u == "string" ? u : "" + u).replace(wY, `
`).replace(MY, "");
  }
  function s2(u, f) {
    return f = a2(f), a2(u) === f;
  }
  function Di(u, f, b, M, N, L) {
    switch (b) {
      case "children":
        typeof M == "string" ? f === "body" || f === "textarea" && M === "" || Da(u, M) : (typeof M == "number" || typeof M == "bigint") && f !== "body" && Da(u, "" + M);
        break;
      case "className":
        Ai(u, "class", M);
        break;
      case "tabIndex":
        Ai(u, "tabindex", M);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Ai(u, b, M);
        break;
      case "style":
        Ly(u, M, L);
        break;
      case "data":
        if (f !== "object") {
          Ai(u, "data", M);
          break;
        }
      case "src":
      case "href":
        if (M === "" && (f !== "a" || b !== "href")) {
          u.removeAttribute(b);
          break;
        }
        if (M == null || typeof M == "function" || typeof M == "symbol" || typeof M == "boolean") {
          u.removeAttribute(b);
          break;
        }
        M = Wf("" + M), u.setAttribute(b, M);
        break;
      case "action":
      case "formAction":
        if (typeof M == "function") {
          u.setAttribute(
            b,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof L == "function" && (b === "formAction" ? (f !== "input" && Di(u, f, "name", N.name, N, null), Di(
            u,
            f,
            "formEncType",
            N.formEncType,
            N,
            null
          ), Di(
            u,
            f,
            "formMethod",
            N.formMethod,
            N,
            null
          ), Di(
            u,
            f,
            "formTarget",
            N.formTarget,
            N,
            null
          )) : (Di(u, f, "encType", N.encType, N, null), Di(u, f, "method", N.method, N, null), Di(u, f, "target", N.target, N, null)));
        if (M == null || typeof M == "symbol" || typeof M == "boolean") {
          u.removeAttribute(b);
          break;
        }
        M = Wf("" + M), u.setAttribute(b, M);
        break;
      case "onClick":
        M != null && (u.onclick = Ul);
        break;
      case "onScroll":
        M != null && Gn("scroll", u);
        break;
      case "onScrollEnd":
        M != null && Gn("scrollend", u);
        break;
      case "dangerouslySetInnerHTML":
        if (M != null) {
          if (typeof M != "object" || !("__html" in M))
            throw Error(i(61));
          if (b = M.__html, b != null) {
            if (N.children != null) throw Error(i(60));
            u.innerHTML = b;
          }
        }
        break;
      case "multiple":
        u.multiple = M && typeof M != "function" && typeof M != "symbol";
        break;
      case "muted":
        u.muted = M && typeof M != "function" && typeof M != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (M == null || typeof M == "function" || typeof M == "boolean" || typeof M == "symbol") {
          u.removeAttribute("xlink:href");
          break;
        }
        b = Wf("" + M), u.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          b
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        M != null && typeof M != "function" && typeof M != "symbol" ? u.setAttribute(b, "" + M) : u.removeAttribute(b);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        M && typeof M != "function" && typeof M != "symbol" ? u.setAttribute(b, "") : u.removeAttribute(b);
        break;
      case "capture":
      case "download":
        M === !0 ? u.setAttribute(b, "") : M !== !1 && M != null && typeof M != "function" && typeof M != "symbol" ? u.setAttribute(b, M) : u.removeAttribute(b);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        M != null && typeof M != "function" && typeof M != "symbol" && !isNaN(M) && 1 <= M ? u.setAttribute(b, M) : u.removeAttribute(b);
        break;
      case "rowSpan":
      case "start":
        M == null || typeof M == "function" || typeof M == "symbol" || isNaN(M) ? u.removeAttribute(b) : u.setAttribute(b, M);
        break;
      case "popover":
        Gn("beforetoggle", u), Gn("toggle", u), Pn(u, "popover", M);
        break;
      case "xlinkActuate":
        Zn(
          u,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          M
        );
        break;
      case "xlinkArcrole":
        Zn(
          u,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          M
        );
        break;
      case "xlinkRole":
        Zn(
          u,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          M
        );
        break;
      case "xlinkShow":
        Zn(
          u,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          M
        );
        break;
      case "xlinkTitle":
        Zn(
          u,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          M
        );
        break;
      case "xlinkType":
        Zn(
          u,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          M
        );
        break;
      case "xmlBase":
        Zn(
          u,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          M
        );
        break;
      case "xmlLang":
        Zn(
          u,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          M
        );
        break;
      case "xmlSpace":
        Zn(
          u,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          M
        );
        break;
      case "is":
        Pn(u, "is", M);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < b.length) || b[0] !== "o" && b[0] !== "O" || b[1] !== "n" && b[1] !== "N") && (b = n1.get(b) || b, Pn(u, b, M));
    }
  }
  function oN(u, f, b, M, N, L) {
    switch (b) {
      case "style":
        Ly(u, M, L);
        break;
      case "dangerouslySetInnerHTML":
        if (M != null) {
          if (typeof M != "object" || !("__html" in M))
            throw Error(i(61));
          if (b = M.__html, b != null) {
            if (N.children != null) throw Error(i(60));
            u.innerHTML = b;
          }
        }
        break;
      case "children":
        typeof M == "string" ? Da(u, M) : (typeof M == "number" || typeof M == "bigint") && Da(u, "" + M);
        break;
      case "onScroll":
        M != null && Gn("scroll", u);
        break;
      case "onScrollEnd":
        M != null && Gn("scrollend", u);
        break;
      case "onClick":
        M != null && (u.onclick = Ul);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!yt.hasOwnProperty(b))
          e: {
            if (b[0] === "o" && b[1] === "n" && (N = b.endsWith("Capture"), f = b.slice(2, N ? b.length - 7 : void 0), L = u[_r] || null, L = L != null ? L[b] : null, typeof L == "function" && u.removeEventListener(f, L, N), typeof M == "function")) {
              typeof L != "function" && L !== null && (b in u ? u[b] = null : u.hasAttribute(b) && u.removeAttribute(b)), u.addEventListener(f, M, N);
              break e;
            }
            b in u ? u[b] = M : M === !0 ? u.setAttribute(b, "") : Pn(u, b, M);
          }
    }
  }
  function Ha(u, f, b) {
    switch (f) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        Gn("error", u), Gn("load", u);
        var M = !1, N = !1, L;
        for (L in b)
          if (b.hasOwnProperty(L)) {
            var H = b[L];
            if (H != null)
              switch (L) {
                case "src":
                  M = !0;
                  break;
                case "srcSet":
                  N = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(i(137, f));
                default:
                  Di(u, f, L, H, b, null);
              }
          }
        N && Di(u, f, "srcSet", b.srcSet, b, null), M && Di(u, f, "src", b.src, b, null);
        return;
      case "input":
        Gn("invalid", u);
        var ee = L = H = N = null, ue = null, De = null;
        for (M in b)
          if (b.hasOwnProperty(M)) {
            var $e = b[M];
            if ($e != null)
              switch (M) {
                case "name":
                  N = $e;
                  break;
                case "type":
                  H = $e;
                  break;
                case "checked":
                  ue = $e;
                  break;
                case "defaultChecked":
                  De = $e;
                  break;
                case "value":
                  L = $e;
                  break;
                case "defaultValue":
                  ee = $e;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if ($e != null)
                    throw Error(i(137, f));
                  break;
                default:
                  Di(u, f, M, $e, b, null);
              }
          }
        sa(
          u,
          L,
          ee,
          ue,
          De,
          H,
          N,
          !1
        );
        return;
      case "select":
        Gn("invalid", u), M = H = L = null;
        for (N in b)
          if (b.hasOwnProperty(N) && (ee = b[N], ee != null))
            switch (N) {
              case "value":
                L = ee;
                break;
              case "defaultValue":
                H = ee;
                break;
              case "multiple":
                M = ee;
              default:
                Di(u, f, N, ee, b, null);
            }
        f = L, b = H, u.multiple = !!M, f != null ? Ui(u, !!M, f, !1) : b != null && Ui(u, !!M, b, !0);
        return;
      case "textarea":
        Gn("invalid", u), L = N = M = null;
        for (H in b)
          if (b.hasOwnProperty(H) && (ee = b[H], ee != null))
            switch (H) {
              case "value":
                M = ee;
                break;
              case "defaultValue":
                N = ee;
                break;
              case "children":
                L = ee;
                break;
              case "dangerouslySetInnerHTML":
                if (ee != null) throw Error(i(91));
                break;
              default:
                Di(u, f, H, ee, b, null);
            }
        Ec(u, M, N, L);
        return;
      case "option":
        for (ue in b)
          if (b.hasOwnProperty(ue) && (M = b[ue], M != null))
            switch (ue) {
              case "selected":
                u.selected = M && typeof M != "function" && typeof M != "symbol";
                break;
              default:
                Di(u, f, ue, M, b, null);
            }
        return;
      case "dialog":
        Gn("beforetoggle", u), Gn("toggle", u), Gn("cancel", u), Gn("close", u);
        break;
      case "iframe":
      case "object":
        Gn("load", u);
        break;
      case "video":
      case "audio":
        for (M = 0; M < oo.length; M++)
          Gn(oo[M], u);
        break;
      case "image":
        Gn("error", u), Gn("load", u);
        break;
      case "details":
        Gn("toggle", u);
        break;
      case "embed":
      case "source":
      case "link":
        Gn("error", u), Gn("load", u);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (De in b)
          if (b.hasOwnProperty(De) && (M = b[De], M != null))
            switch (De) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(i(137, f));
              default:
                Di(u, f, De, M, b, null);
            }
        return;
      default:
        if (gv(f)) {
          for ($e in b)
            b.hasOwnProperty($e) && (M = b[$e], M !== void 0 && oN(
              u,
              f,
              $e,
              M,
              b,
              void 0
            ));
          return;
        }
    }
    for (ee in b)
      b.hasOwnProperty(ee) && (M = b[ee], M != null && Di(u, f, ee, M, b, null));
  }
  function TY(u, f, b, M) {
    switch (f) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var N = null, L = null, H = null, ee = null, ue = null, De = null, $e = null;
        for (Ge in b) {
          var Qe = b[Ge];
          if (b.hasOwnProperty(Ge) && Qe != null)
            switch (Ge) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                ue = Qe;
              default:
                M.hasOwnProperty(Ge) || Di(u, f, Ge, null, M, Qe);
            }
        }
        for (var Pe in M) {
          var Ge = M[Pe];
          if (Qe = b[Pe], M.hasOwnProperty(Pe) && (Ge != null || Qe != null))
            switch (Pe) {
              case "type":
                L = Ge;
                break;
              case "name":
                N = Ge;
                break;
              case "checked":
                De = Ge;
                break;
              case "defaultChecked":
                $e = Ge;
                break;
              case "value":
                H = Ge;
                break;
              case "defaultValue":
                ee = Ge;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (Ge != null)
                  throw Error(i(137, f));
                break;
              default:
                Ge !== Qe && Di(
                  u,
                  f,
                  Pe,
                  Ge,
                  M,
                  Qe
                );
            }
        }
        ai(
          u,
          H,
          ee,
          ue,
          De,
          $e,
          L,
          N
        );
        return;
      case "select":
        Ge = H = ee = Pe = null;
        for (L in b)
          if (ue = b[L], b.hasOwnProperty(L) && ue != null)
            switch (L) {
              case "value":
                break;
              case "multiple":
                Ge = ue;
              default:
                M.hasOwnProperty(L) || Di(
                  u,
                  f,
                  L,
                  null,
                  M,
                  ue
                );
            }
        for (N in M)
          if (L = M[N], ue = b[N], M.hasOwnProperty(N) && (L != null || ue != null))
            switch (N) {
              case "value":
                Pe = L;
                break;
              case "defaultValue":
                ee = L;
                break;
              case "multiple":
                H = L;
              default:
                L !== ue && Di(
                  u,
                  f,
                  N,
                  L,
                  M,
                  ue
                );
            }
        f = ee, b = H, M = Ge, Pe != null ? Ui(u, !!b, Pe, !1) : !!M != !!b && (f != null ? Ui(u, !!b, f, !0) : Ui(u, !!b, b ? [] : "", !1));
        return;
      case "textarea":
        Ge = Pe = null;
        for (ee in b)
          if (N = b[ee], b.hasOwnProperty(ee) && N != null && !M.hasOwnProperty(ee))
            switch (ee) {
              case "value":
                break;
              case "children":
                break;
              default:
                Di(u, f, ee, null, M, N);
            }
        for (H in M)
          if (N = M[H], L = b[H], M.hasOwnProperty(H) && (N != null || L != null))
            switch (H) {
              case "value":
                Pe = N;
                break;
              case "defaultValue":
                Ge = N;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (N != null) throw Error(i(91));
                break;
              default:
                N !== L && Di(u, f, H, N, M, L);
            }
        zr(u, Pe, Ge);
        return;
      case "option":
        for (var Pt in b)
          if (Pe = b[Pt], b.hasOwnProperty(Pt) && Pe != null && !M.hasOwnProperty(Pt))
            switch (Pt) {
              case "selected":
                u.selected = !1;
                break;
              default:
                Di(
                  u,
                  f,
                  Pt,
                  null,
                  M,
                  Pe
                );
            }
        for (ue in M)
          if (Pe = M[ue], Ge = b[ue], M.hasOwnProperty(ue) && Pe !== Ge && (Pe != null || Ge != null))
            switch (ue) {
              case "selected":
                u.selected = Pe && typeof Pe != "function" && typeof Pe != "symbol";
                break;
              default:
                Di(
                  u,
                  f,
                  ue,
                  Pe,
                  M,
                  Ge
                );
            }
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var Jt in b)
          Pe = b[Jt], b.hasOwnProperty(Jt) && Pe != null && !M.hasOwnProperty(Jt) && Di(u, f, Jt, null, M, Pe);
        for (De in M)
          if (Pe = M[De], Ge = b[De], M.hasOwnProperty(De) && Pe !== Ge && (Pe != null || Ge != null))
            switch (De) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (Pe != null)
                  throw Error(i(137, f));
                break;
              default:
                Di(
                  u,
                  f,
                  De,
                  Pe,
                  M,
                  Ge
                );
            }
        return;
      default:
        if (gv(f)) {
          for (var Li in b)
            Pe = b[Li], b.hasOwnProperty(Li) && Pe !== void 0 && !M.hasOwnProperty(Li) && oN(
              u,
              f,
              Li,
              void 0,
              M,
              Pe
            );
          for ($e in M)
            Pe = M[$e], Ge = b[$e], !M.hasOwnProperty($e) || Pe === Ge || Pe === void 0 && Ge === void 0 || oN(
              u,
              f,
              $e,
              Pe,
              M,
              Ge
            );
          return;
        }
    }
    for (var we in b)
      Pe = b[we], b.hasOwnProperty(we) && Pe != null && !M.hasOwnProperty(we) && Di(u, f, we, null, M, Pe);
    for (Qe in M)
      Pe = M[Qe], Ge = b[Qe], !M.hasOwnProperty(Qe) || Pe === Ge || Pe == null && Ge == null || Di(u, f, Qe, Pe, M, Ge);
  }
  function o2(u) {
    switch (u) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function EY() {
    if (typeof performance.getEntriesByType == "function") {
      for (var u = 0, f = 0, b = performance.getEntriesByType("resource"), M = 0; M < b.length; M++) {
        var N = b[M], L = N.transferSize, H = N.initiatorType, ee = N.duration;
        if (L && ee && o2(H)) {
          for (H = 0, ee = N.responseEnd, M += 1; M < b.length; M++) {
            var ue = b[M], De = ue.startTime;
            if (De > ee) break;
            var $e = ue.transferSize, Qe = ue.initiatorType;
            $e && o2(Qe) && (ue = ue.responseEnd, H += $e * (ue < ee ? 1 : (ee - De) / (ue - De)));
          }
          if (--M, f += 8 * (L + H) / (N.duration / 1e3), u++, 10 < u) break;
        }
      }
      if (0 < u) return f / u / 1e6;
    }
    return navigator.connection && (u = navigator.connection.downlink, typeof u == "number") ? u : 5;
  }
  var lN = null, cN = null;
  function Tw(u) {
    return u.nodeType === 9 ? u : u.ownerDocument;
  }
  function l2(u) {
    switch (u) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function c2(u, f) {
    if (u === 0)
      switch (f) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return u === 1 && f === "foreignObject" ? 0 : u;
  }
  function uN(u, f) {
    return u === "textarea" || u === "noscript" || typeof f.children == "string" || typeof f.children == "number" || typeof f.children == "bigint" || typeof f.dangerouslySetInnerHTML == "object" && f.dangerouslySetInnerHTML !== null && f.dangerouslySetInnerHTML.__html != null;
  }
  var dN = null;
  function CY() {
    var u = window.event;
    return u && u.type === "popstate" ? u === dN ? !1 : (dN = u, !0) : (dN = null, !1);
  }
  var u2 = typeof setTimeout == "function" ? setTimeout : void 0, AY = typeof clearTimeout == "function" ? clearTimeout : void 0, d2 = typeof Promise == "function" ? Promise : void 0, RY = typeof queueMicrotask == "function" ? queueMicrotask : typeof d2 < "u" ? function(u) {
    return d2.resolve(null).then(u).catch(NY);
  } : u2;
  function NY(u) {
    setTimeout(function() {
      throw u;
    });
  }
  function Ph(u) {
    return u === "head";
  }
  function h2(u, f) {
    var b = f, M = 0;
    do {
      var N = b.nextSibling;
      if (u.removeChild(b), N && N.nodeType === 8)
        if (b = N.data, b === "/$" || b === "/&") {
          if (M === 0) {
            u.removeChild(N), wg(f);
            return;
          }
          M--;
        } else if (b === "$" || b === "$?" || b === "$~" || b === "$!" || b === "&")
          M++;
        else if (b === "html")
          K0(u.ownerDocument.documentElement);
        else if (b === "head") {
          b = u.ownerDocument.head, K0(b);
          for (var L = b.firstChild; L; ) {
            var H = L.nextSibling, ee = L.nodeName;
            L[So] || ee === "SCRIPT" || ee === "STYLE" || ee === "LINK" && L.rel.toLowerCase() === "stylesheet" || b.removeChild(L), L = H;
          }
        } else
          b === "body" && K0(u.ownerDocument.body);
      b = N;
    } while (b);
    wg(f);
  }
  function f2(u, f) {
    var b = u;
    u = 0;
    do {
      var M = b.nextSibling;
      if (b.nodeType === 1 ? f ? (b._stashedDisplay = b.style.display, b.style.display = "none") : (b.style.display = b._stashedDisplay || "", b.getAttribute("style") === "" && b.removeAttribute("style")) : b.nodeType === 3 && (f ? (b._stashedText = b.nodeValue, b.nodeValue = "") : b.nodeValue = b._stashedText || ""), M && M.nodeType === 8)
        if (b = M.data, b === "/$") {
          if (u === 0) break;
          u--;
        } else
          b !== "$" && b !== "$?" && b !== "$~" && b !== "$!" || u++;
      b = M;
    } while (b);
  }
  function hN(u) {
    var f = u.firstChild;
    for (f && f.nodeType === 10 && (f = f.nextSibling); f; ) {
      var b = f;
      switch (f = f.nextSibling, b.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          hN(b), Bl(b);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (b.rel.toLowerCase() === "stylesheet") continue;
      }
      u.removeChild(b);
    }
  }
  function kY(u, f, b, M) {
    for (; u.nodeType === 1; ) {
      var N = b;
      if (u.nodeName.toLowerCase() !== f.toLowerCase()) {
        if (!M && (u.nodeName !== "INPUT" || u.type !== "hidden"))
          break;
      } else if (M) {
        if (!u[So])
          switch (f) {
            case "meta":
              if (!u.hasAttribute("itemprop")) break;
              return u;
            case "link":
              if (L = u.getAttribute("rel"), L === "stylesheet" && u.hasAttribute("data-precedence"))
                break;
              if (L !== N.rel || u.getAttribute("href") !== (N.href == null || N.href === "" ? null : N.href) || u.getAttribute("crossorigin") !== (N.crossOrigin == null ? null : N.crossOrigin) || u.getAttribute("title") !== (N.title == null ? null : N.title))
                break;
              return u;
            case "style":
              if (u.hasAttribute("data-precedence")) break;
              return u;
            case "script":
              if (L = u.getAttribute("src"), (L !== (N.src == null ? null : N.src) || u.getAttribute("type") !== (N.type == null ? null : N.type) || u.getAttribute("crossorigin") !== (N.crossOrigin == null ? null : N.crossOrigin)) && L && u.hasAttribute("async") && !u.hasAttribute("itemprop"))
                break;
              return u;
            default:
              return u;
          }
      } else if (f === "input" && u.type === "hidden") {
        var L = N.name == null ? null : "" + N.name;
        if (N.type === "hidden" && u.getAttribute("name") === L)
          return u;
      } else return u;
      if (u = dl(u.nextSibling), u === null) break;
    }
    return null;
  }
  function DY(u, f, b) {
    if (f === "") return null;
    for (; u.nodeType !== 3; )
      if ((u.nodeType !== 1 || u.nodeName !== "INPUT" || u.type !== "hidden") && !b || (u = dl(u.nextSibling), u === null)) return null;
    return u;
  }
  function p2(u, f) {
    for (; u.nodeType !== 8; )
      if ((u.nodeType !== 1 || u.nodeName !== "INPUT" || u.type !== "hidden") && !f || (u = dl(u.nextSibling), u === null)) return null;
    return u;
  }
  function fN(u) {
    return u.data === "$?" || u.data === "$~";
  }
  function pN(u) {
    return u.data === "$!" || u.data === "$?" && u.ownerDocument.readyState !== "loading";
  }
  function LY(u, f) {
    var b = u.ownerDocument;
    if (u.data === "$~") u._reactRetry = f;
    else if (u.data !== "$?" || b.readyState !== "loading")
      f();
    else {
      var M = function() {
        f(), b.removeEventListener("DOMContentLoaded", M);
      };
      b.addEventListener("DOMContentLoaded", M), u._reactRetry = M;
    }
  }
  function dl(u) {
    for (; u != null; u = u.nextSibling) {
      var f = u.nodeType;
      if (f === 1 || f === 3) break;
      if (f === 8) {
        if (f = u.data, f === "$" || f === "$!" || f === "$?" || f === "$~" || f === "&" || f === "F!" || f === "F")
          break;
        if (f === "/$" || f === "/&") return null;
      }
    }
    return u;
  }
  var mN = null;
  function m2(u) {
    u = u.nextSibling;
    for (var f = 0; u; ) {
      if (u.nodeType === 8) {
        var b = u.data;
        if (b === "/$" || b === "/&") {
          if (f === 0)
            return dl(u.nextSibling);
          f--;
        } else
          b !== "$" && b !== "$!" && b !== "$?" && b !== "$~" && b !== "&" || f++;
      }
      u = u.nextSibling;
    }
    return null;
  }
  function v2(u) {
    u = u.previousSibling;
    for (var f = 0; u; ) {
      if (u.nodeType === 8) {
        var b = u.data;
        if (b === "$" || b === "$!" || b === "$?" || b === "$~" || b === "&") {
          if (f === 0) return u;
          f--;
        } else b !== "/$" && b !== "/&" || f++;
      }
      u = u.previousSibling;
    }
    return null;
  }
  function g2(u, f, b) {
    switch (f = Tw(b), u) {
      case "html":
        if (u = f.documentElement, !u) throw Error(i(452));
        return u;
      case "head":
        if (u = f.head, !u) throw Error(i(453));
        return u;
      case "body":
        if (u = f.body, !u) throw Error(i(454));
        return u;
      default:
        throw Error(i(451));
    }
  }
  function K0(u) {
    for (var f = u.attributes; f.length; )
      u.removeAttributeNode(f[0]);
    Bl(u);
  }
  var hl = /* @__PURE__ */ new Map(), _2 = /* @__PURE__ */ new Set();
  function Ew(u) {
    return typeof u.getRootNode == "function" ? u.getRootNode() : u.nodeType === 9 ? u : u.ownerDocument;
  }
  var ud = Z.d;
  Z.d = {
    f: IY,
    r: PY,
    D: OY,
    C: zY,
    L: FY,
    m: BY,
    X: jY,
    S: UY,
    M: HY
  };
  function IY() {
    var u = ud.f(), f = Co();
    return u || f;
  }
  function PY(u) {
    var f = be(u);
    f !== null && f.tag === 5 && f.type === "form" ? lw(f) : ud.r(u);
  }
  var bg = typeof document > "u" ? null : document;
  function y2(u, f, b) {
    var M = bg;
    if (M && typeof f == "string" && f) {
      var N = ur(f);
      N = 'link[rel="' + u + '"][href="' + N + '"]', typeof b == "string" && (N += '[crossorigin="' + b + '"]'), _2.has(N) || (_2.add(N), u = { rel: u, crossOrigin: b, href: f }, M.querySelector(N) === null && (f = M.createElement("link"), Ha(f, "link", u), ge(f), M.head.appendChild(f)));
    }
  }
  function OY(u) {
    ud.D(u), y2("dns-prefetch", u, null);
  }
  function zY(u, f) {
    ud.C(u, f), y2("preconnect", u, f);
  }
  function FY(u, f, b) {
    ud.L(u, f, b);
    var M = bg;
    if (M && u && f) {
      var N = 'link[rel="preload"][as="' + ur(f) + '"]';
      f === "image" && b && b.imageSrcSet ? (N += '[imagesrcset="' + ur(
        b.imageSrcSet
      ) + '"]', typeof b.imageSizes == "string" && (N += '[imagesizes="' + ur(
        b.imageSizes
      ) + '"]')) : N += '[href="' + ur(u) + '"]';
      var L = N;
      switch (f) {
        case "style":
          L = xg(u);
          break;
        case "script":
          L = Sg(u);
      }
      hl.has(L) || (u = h(
        {
          rel: "preload",
          href: f === "image" && b && b.imageSrcSet ? void 0 : u,
          as: f
        },
        b
      ), hl.set(L, u), M.querySelector(N) !== null || f === "style" && M.querySelector(Q0(L)) || f === "script" && M.querySelector(J0(L)) || (f = M.createElement("link"), Ha(f, "link", u), ge(f), M.head.appendChild(f)));
    }
  }
  function BY(u, f) {
    ud.m(u, f);
    var b = bg;
    if (b && u) {
      var M = f && typeof f.as == "string" ? f.as : "script", N = 'link[rel="modulepreload"][as="' + ur(M) + '"][href="' + ur(u) + '"]', L = N;
      switch (M) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          L = Sg(u);
      }
      if (!hl.has(L) && (u = h({ rel: "modulepreload", href: u }, f), hl.set(L, u), b.querySelector(N) === null)) {
        switch (M) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (b.querySelector(J0(L)))
              return;
        }
        M = b.createElement("link"), Ha(M, "link", u), ge(M), b.head.appendChild(M);
      }
    }
  }
  function UY(u, f, b) {
    ud.S(u, f, b);
    var M = bg;
    if (M && u) {
      var N = ze(M).hoistableStyles, L = xg(u);
      f = f || "default";
      var H = N.get(L);
      if (!H) {
        var ee = { loading: 0, preload: null };
        if (H = M.querySelector(
          Q0(L)
        ))
          ee.loading = 5;
        else {
          u = h(
            { rel: "stylesheet", href: u, "data-precedence": f },
            b
          ), (b = hl.get(L)) && vN(u, b);
          var ue = H = M.createElement("link");
          ge(ue), Ha(ue, "link", u), ue._p = new Promise(function(De, $e) {
            ue.onload = De, ue.onerror = $e;
          }), ue.addEventListener("load", function() {
            ee.loading |= 1;
          }), ue.addEventListener("error", function() {
            ee.loading |= 2;
          }), ee.loading |= 4, Cw(H, f, M);
        }
        H = {
          type: "stylesheet",
          instance: H,
          count: 1,
          state: ee
        }, N.set(L, H);
      }
    }
  }
  function jY(u, f) {
    ud.X(u, f);
    var b = bg;
    if (b && u) {
      var M = ze(b).hoistableScripts, N = Sg(u), L = M.get(N);
      L || (L = b.querySelector(J0(N)), L || (u = h({ src: u, async: !0 }, f), (f = hl.get(N)) && gN(u, f), L = b.createElement("script"), ge(L), Ha(L, "link", u), b.head.appendChild(L)), L = {
        type: "script",
        instance: L,
        count: 1,
        state: null
      }, M.set(N, L));
    }
  }
  function HY(u, f) {
    ud.M(u, f);
    var b = bg;
    if (b && u) {
      var M = ze(b).hoistableScripts, N = Sg(u), L = M.get(N);
      L || (L = b.querySelector(J0(N)), L || (u = h({ src: u, async: !0, type: "module" }, f), (f = hl.get(N)) && gN(u, f), L = b.createElement("script"), ge(L), Ha(L, "link", u), b.head.appendChild(L)), L = {
        type: "script",
        instance: L,
        count: 1,
        state: null
      }, M.set(N, L));
    }
  }
  function b2(u, f, b, M) {
    var N = (N = _e.current) ? Ew(N) : null;
    if (!N) throw Error(i(446));
    switch (u) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof b.precedence == "string" && typeof b.href == "string" ? (f = xg(b.href), b = ze(
          N
        ).hoistableStyles, M = b.get(f), M || (M = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, b.set(f, M)), M) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (b.rel === "stylesheet" && typeof b.href == "string" && typeof b.precedence == "string") {
          u = xg(b.href);
          var L = ze(
            N
          ).hoistableStyles, H = L.get(u);
          if (H || (N = N.ownerDocument || N, H = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, L.set(u, H), (L = N.querySelector(
            Q0(u)
          )) && !L._p && (H.instance = L, H.state.loading = 5), hl.has(u) || (b = {
            rel: "preload",
            as: "style",
            href: b.href,
            crossOrigin: b.crossOrigin,
            integrity: b.integrity,
            media: b.media,
            hrefLang: b.hrefLang,
            referrerPolicy: b.referrerPolicy
          }, hl.set(u, b), L || VY(
            N,
            u,
            b,
            H.state
          ))), f && M === null)
            throw Error(i(528, ""));
          return H;
        }
        if (f && M !== null)
          throw Error(i(529, ""));
        return null;
      case "script":
        return f = b.async, b = b.src, typeof b == "string" && f && typeof f != "function" && typeof f != "symbol" ? (f = Sg(b), b = ze(
          N
        ).hoistableScripts, M = b.get(f), M || (M = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, b.set(f, M)), M) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(i(444, u));
    }
  }
  function xg(u) {
    return 'href="' + ur(u) + '"';
  }
  function Q0(u) {
    return 'link[rel="stylesheet"][' + u + "]";
  }
  function x2(u) {
    return h({}, u, {
      "data-precedence": u.precedence,
      precedence: null
    });
  }
  function VY(u, f, b, M) {
    u.querySelector('link[rel="preload"][as="style"][' + f + "]") ? M.loading = 1 : (f = u.createElement("link"), M.preload = f, f.addEventListener("load", function() {
      return M.loading |= 1;
    }), f.addEventListener("error", function() {
      return M.loading |= 2;
    }), Ha(f, "link", b), ge(f), u.head.appendChild(f));
  }
  function Sg(u) {
    return '[src="' + ur(u) + '"]';
  }
  function J0(u) {
    return "script[async]" + u;
  }
  function S2(u, f, b) {
    if (f.count++, f.instance === null)
      switch (f.type) {
        case "style":
          var M = u.querySelector(
            'style[data-href~="' + ur(b.href) + '"]'
          );
          if (M)
            return f.instance = M, ge(M), M;
          var N = h({}, b, {
            "data-href": b.href,
            "data-precedence": b.precedence,
            href: null,
            precedence: null
          });
          return M = (u.ownerDocument || u).createElement(
            "style"
          ), ge(M), Ha(M, "style", N), Cw(M, b.precedence, u), f.instance = M;
        case "stylesheet":
          N = xg(b.href);
          var L = u.querySelector(
            Q0(N)
          );
          if (L)
            return f.state.loading |= 4, f.instance = L, ge(L), L;
          M = x2(b), (N = hl.get(N)) && vN(M, N), L = (u.ownerDocument || u).createElement("link"), ge(L);
          var H = L;
          return H._p = new Promise(function(ee, ue) {
            H.onload = ee, H.onerror = ue;
          }), Ha(L, "link", M), f.state.loading |= 4, Cw(L, b.precedence, u), f.instance = L;
        case "script":
          return L = Sg(b.src), (N = u.querySelector(
            J0(L)
          )) ? (f.instance = N, ge(N), N) : (M = b, (N = hl.get(L)) && (M = h({}, b), gN(M, N)), u = u.ownerDocument || u, N = u.createElement("script"), ge(N), Ha(N, "link", M), u.head.appendChild(N), f.instance = N);
        case "void":
          return null;
        default:
          throw Error(i(443, f.type));
      }
    else
      f.type === "stylesheet" && (f.state.loading & 4) === 0 && (M = f.instance, f.state.loading |= 4, Cw(M, b.precedence, u));
    return f.instance;
  }
  function Cw(u, f, b) {
    for (var M = b.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), N = M.length ? M[M.length - 1] : null, L = N, H = 0; H < M.length; H++) {
      var ee = M[H];
      if (ee.dataset.precedence === f) L = ee;
      else if (L !== N) break;
    }
    L ? L.parentNode.insertBefore(u, L.nextSibling) : (f = b.nodeType === 9 ? b.head : b, f.insertBefore(u, f.firstChild));
  }
  function vN(u, f) {
    u.crossOrigin == null && (u.crossOrigin = f.crossOrigin), u.referrerPolicy == null && (u.referrerPolicy = f.referrerPolicy), u.title == null && (u.title = f.title);
  }
  function gN(u, f) {
    u.crossOrigin == null && (u.crossOrigin = f.crossOrigin), u.referrerPolicy == null && (u.referrerPolicy = f.referrerPolicy), u.integrity == null && (u.integrity = f.integrity);
  }
  var Aw = null;
  function w2(u, f, b) {
    if (Aw === null) {
      var M = /* @__PURE__ */ new Map(), N = Aw = /* @__PURE__ */ new Map();
      N.set(b, M);
    } else
      N = Aw, M = N.get(b), M || (M = /* @__PURE__ */ new Map(), N.set(b, M));
    if (M.has(u)) return M;
    for (M.set(u, null), b = b.getElementsByTagName(u), N = 0; N < b.length; N++) {
      var L = b[N];
      if (!(L[So] || L[pi] || u === "link" && L.getAttribute("rel") === "stylesheet") && L.namespaceURI !== "http://www.w3.org/2000/svg") {
        var H = L.getAttribute(f) || "";
        H = u + H;
        var ee = M.get(H);
        ee ? ee.push(L) : M.set(H, [L]);
      }
    }
    return M;
  }
  function M2(u, f, b) {
    u = u.ownerDocument || u, u.head.insertBefore(
      b,
      f === "title" ? u.querySelector("head > title") : null
    );
  }
  function GY(u, f, b) {
    if (b === 1 || f.itemProp != null) return !1;
    switch (u) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof f.precedence != "string" || typeof f.href != "string" || f.href === "")
          break;
        return !0;
      case "link":
        if (typeof f.rel != "string" || typeof f.href != "string" || f.href === "" || f.onLoad || f.onError)
          break;
        switch (f.rel) {
          case "stylesheet":
            return u = f.disabled, typeof f.precedence == "string" && u == null;
          default:
            return !0;
        }
      case "script":
        if (f.async && typeof f.async != "function" && typeof f.async != "symbol" && !f.onLoad && !f.onError && f.src && typeof f.src == "string")
          return !0;
    }
    return !1;
  }
  function T2(u) {
    return !(u.type === "stylesheet" && (u.state.loading & 3) === 0);
  }
  function WY(u, f, b, M) {
    if (b.type === "stylesheet" && (typeof M.media != "string" || matchMedia(M.media).matches !== !1) && (b.state.loading & 4) === 0) {
      if (b.instance === null) {
        var N = xg(M.href), L = f.querySelector(
          Q0(N)
        );
        if (L) {
          f = L._p, f !== null && typeof f == "object" && typeof f.then == "function" && (u.count++, u = Rw.bind(u), f.then(u, u)), b.state.loading |= 4, b.instance = L, ge(L);
          return;
        }
        L = f.ownerDocument || f, M = x2(M), (N = hl.get(N)) && vN(M, N), L = L.createElement("link"), ge(L);
        var H = L;
        H._p = new Promise(function(ee, ue) {
          H.onload = ee, H.onerror = ue;
        }), Ha(L, "link", M), b.instance = L;
      }
      u.stylesheets === null && (u.stylesheets = /* @__PURE__ */ new Map()), u.stylesheets.set(b, f), (f = b.state.preload) && (b.state.loading & 3) === 0 && (u.count++, b = Rw.bind(u), f.addEventListener("load", b), f.addEventListener("error", b));
    }
  }
  var _N = 0;
  function $Y(u, f) {
    return u.stylesheets && u.count === 0 && kw(u, u.stylesheets), 0 < u.count || 0 < u.imgCount ? function(b) {
      var M = setTimeout(function() {
        if (u.stylesheets && kw(u, u.stylesheets), u.unsuspend) {
          var L = u.unsuspend;
          u.unsuspend = null, L();
        }
      }, 6e4 + f);
      0 < u.imgBytes && _N === 0 && (_N = 62500 * EY());
      var N = setTimeout(
        function() {
          if (u.waitingForImages = !1, u.count === 0 && (u.stylesheets && kw(u, u.stylesheets), u.unsuspend)) {
            var L = u.unsuspend;
            u.unsuspend = null, L();
          }
        },
        (u.imgBytes > _N ? 50 : 800) + f
      );
      return u.unsuspend = b, function() {
        u.unsuspend = null, clearTimeout(M), clearTimeout(N);
      };
    } : null;
  }
  function Rw() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) kw(this, this.stylesheets);
      else if (this.unsuspend) {
        var u = this.unsuspend;
        this.unsuspend = null, u();
      }
    }
  }
  var Nw = null;
  function kw(u, f) {
    u.stylesheets = null, u.unsuspend !== null && (u.count++, Nw = /* @__PURE__ */ new Map(), f.forEach(XY, u), Nw = null, Rw.call(u));
  }
  function XY(u, f) {
    if (!(f.state.loading & 4)) {
      var b = Nw.get(u);
      if (b) var M = b.get(null);
      else {
        b = /* @__PURE__ */ new Map(), Nw.set(u, b);
        for (var N = u.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), L = 0; L < N.length; L++) {
          var H = N[L];
          (H.nodeName === "LINK" || H.getAttribute("media") !== "not all") && (b.set(H.dataset.precedence, H), M = H);
        }
        M && b.set(null, M);
      }
      N = f.instance, H = N.getAttribute("data-precedence"), L = b.get(H) || M, L === M && b.set(null, N), b.set(H, N), this.count++, M = Rw.bind(this), N.addEventListener("load", M), N.addEventListener("error", M), L ? L.parentNode.insertBefore(N, L.nextSibling) : (u = u.nodeType === 9 ? u.head : u, u.insertBefore(N, u.firstChild)), f.state.loading |= 4;
    }
  }
  var eb = {
    $$typeof: C,
    Provider: null,
    Consumer: null,
    _currentValue: J,
    _currentValue2: J,
    _threadCount: 0
  };
  function YY(u, f, b, M, N, L, H, ee, ue) {
    this.tag = 1, this.containerInfo = u, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = bn(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = bn(0), this.hiddenUpdates = bn(null), this.identifierPrefix = M, this.onUncaughtError = N, this.onCaughtError = L, this.onRecoverableError = H, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = ue, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function E2(u, f, b, M, N, L, H, ee, ue, De, $e, Qe) {
    return u = new YY(
      u,
      f,
      b,
      H,
      ue,
      De,
      $e,
      Qe,
      ee
    ), f = 1, L === !0 && (f |= 24), L = er(3, null, null, f), u.current = L, L.stateNode = u, f = r0(), f.refCount++, u.pooledCache = f, f.refCount++, L.memoizedState = {
      element: M,
      isDehydrated: b,
      cache: f
    }, dp(L), u;
  }
  function C2(u) {
    return u ? (u = kc, u) : kc;
  }
  function A2(u, f, b, M, N, L) {
    N = C2(N), M.context === null ? M.context = N : M.pendingContext = N, M = Yl(f), M.payload = { element: b }, L = L === void 0 ? null : L, L !== null && (M.callback = L), b = Bc(u, M, f), b !== null && (En(b, u, f), Uc(b, u, f));
  }
  function R2(u, f) {
    if (u = u.memoizedState, u !== null && u.dehydrated !== null) {
      var b = u.retryLane;
      u.retryLane = b !== 0 && b < f ? b : f;
    }
  }
  function yN(u, f) {
    R2(u, f), (u = u.alternate) && R2(u, f);
  }
  function N2(u) {
    if (u.tag === 13 || u.tag === 31) {
      var f = Pa(u, 67108864);
      f !== null && En(f, u, 67108864), yN(u, 67108864);
    }
  }
  function k2(u) {
    if (u.tag === 13 || u.tag === 31) {
      var f = Ns();
      f = st(f);
      var b = Pa(u, f);
      b !== null && En(b, u, f), yN(u, f);
    }
  }
  var Dw = !0;
  function qY(u, f, b, M) {
    var N = G.T;
    G.T = null;
    var L = Z.p;
    try {
      Z.p = 2, bN(u, f, b, M);
    } finally {
      Z.p = L, G.T = N;
    }
  }
  function ZY(u, f, b, M) {
    var N = G.T;
    G.T = null;
    var L = Z.p;
    try {
      Z.p = 8, bN(u, f, b, M);
    } finally {
      Z.p = L, G.T = N;
    }
  }
  function bN(u, f, b, M) {
    if (Dw) {
      var N = xN(M);
      if (N === null)
        sN(
          u,
          f,
          M,
          Lw,
          b
        ), L2(u, M);
      else if (QY(
        N,
        u,
        f,
        b,
        M
      ))
        M.stopPropagation();
      else if (L2(u, M), f & 4 && -1 < KY.indexOf(u)) {
        for (; N !== null; ) {
          var L = be(N);
          if (L !== null)
            switch (L.tag) {
              case 3:
                if (L = L.stateNode, L.current.memoizedState.isDehydrated) {
                  var H = ct(L.pendingLanes);
                  if (H !== 0) {
                    var ee = L;
                    for (ee.pendingLanes |= 2, ee.entangledLanes |= 2; H; ) {
                      var ue = 1 << 31 - Wt(H);
                      ee.entanglements[1] |= ue, H &= ~ue;
                    }
                    lt(L), (Vt & 6) === 0 && (wr = Ce() + 500, Nt(0));
                  }
                }
                break;
              case 31:
              case 13:
                ee = Pa(L, 2), ee !== null && En(ee, L, 2), Co(), yN(L, 2);
            }
          if (L = xN(M), L === null && sN(
            u,
            f,
            M,
            Lw,
            b
          ), L === N) break;
          N = L;
        }
        N !== null && M.stopPropagation();
      } else
        sN(
          u,
          f,
          M,
          null,
          b
        );
    }
  }
  function xN(u) {
    return u = yv(u), SN(u);
  }
  var Lw = null;
  function SN(u) {
    if (Lw = null, u = ne(u), u !== null) {
      var f = a(u);
      if (f === null) u = null;
      else {
        var b = f.tag;
        if (b === 13) {
          if (u = s(f), u !== null) return u;
          u = null;
        } else if (b === 31) {
          if (u = o(f), u !== null) return u;
          u = null;
        } else if (b === 3) {
          if (f.stateNode.current.memoizedState.isDehydrated)
            return f.tag === 3 ? f.stateNode.containerInfo : null;
          u = null;
        } else f !== u && (u = null);
      }
    }
    return Lw = u, null;
  }
  function D2(u) {
    switch (u) {
      case "beforetoggle":
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
      case "toggle":
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
        return 2;
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
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (Ae()) {
          case xe:
            return 2;
          case ft:
            return 8;
          case Me:
          case et:
            return 32;
          case St:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var wN = !1, Oh = null, zh = null, Fh = null, tb = /* @__PURE__ */ new Map(), nb = /* @__PURE__ */ new Map(), Bh = [], KY = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function L2(u, f) {
    switch (u) {
      case "focusin":
      case "focusout":
        Oh = null;
        break;
      case "dragenter":
      case "dragleave":
        zh = null;
        break;
      case "mouseover":
      case "mouseout":
        Fh = null;
        break;
      case "pointerover":
      case "pointerout":
        tb.delete(f.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        nb.delete(f.pointerId);
    }
  }
  function ib(u, f, b, M, N, L) {
    return u === null || u.nativeEvent !== L ? (u = {
      blockedOn: f,
      domEventName: b,
      eventSystemFlags: M,
      nativeEvent: L,
      targetContainers: [N]
    }, f !== null && (f = be(f), f !== null && N2(f)), u) : (u.eventSystemFlags |= M, f = u.targetContainers, N !== null && f.indexOf(N) === -1 && f.push(N), u);
  }
  function QY(u, f, b, M, N) {
    switch (f) {
      case "focusin":
        return Oh = ib(
          Oh,
          u,
          f,
          b,
          M,
          N
        ), !0;
      case "dragenter":
        return zh = ib(
          zh,
          u,
          f,
          b,
          M,
          N
        ), !0;
      case "mouseover":
        return Fh = ib(
          Fh,
          u,
          f,
          b,
          M,
          N
        ), !0;
      case "pointerover":
        var L = N.pointerId;
        return tb.set(
          L,
          ib(
            tb.get(L) || null,
            u,
            f,
            b,
            M,
            N
          )
        ), !0;
      case "gotpointercapture":
        return L = N.pointerId, nb.set(
          L,
          ib(
            nb.get(L) || null,
            u,
            f,
            b,
            M,
            N
          )
        ), !0;
    }
    return !1;
  }
  function I2(u) {
    var f = ne(u.target);
    if (f !== null) {
      var b = a(f);
      if (b !== null) {
        if (f = b.tag, f === 13) {
          if (f = s(b), f !== null) {
            u.blockedOn = f, Ti(u.priority, function() {
              k2(b);
            });
            return;
          }
        } else if (f === 31) {
          if (f = o(b), f !== null) {
            u.blockedOn = f, Ti(u.priority, function() {
              k2(b);
            });
            return;
          }
        } else if (f === 3 && b.stateNode.current.memoizedState.isDehydrated) {
          u.blockedOn = b.tag === 3 ? b.stateNode.containerInfo : null;
          return;
        }
      }
    }
    u.blockedOn = null;
  }
  function Iw(u) {
    if (u.blockedOn !== null) return !1;
    for (var f = u.targetContainers; 0 < f.length; ) {
      var b = xN(u.nativeEvent);
      if (b === null) {
        b = u.nativeEvent;
        var M = new b.constructor(
          b.type,
          b
        );
        _v = M, b.target.dispatchEvent(M), _v = null;
      } else
        return f = be(b), f !== null && N2(f), u.blockedOn = b, !1;
      f.shift();
    }
    return !0;
  }
  function P2(u, f, b) {
    Iw(u) && b.delete(f);
  }
  function JY() {
    wN = !1, Oh !== null && Iw(Oh) && (Oh = null), zh !== null && Iw(zh) && (zh = null), Fh !== null && Iw(Fh) && (Fh = null), tb.forEach(P2), nb.forEach(P2);
  }
  function Pw(u, f) {
    u.blockedOn === f && (u.blockedOn = null, wN || (wN = !0, n.unstable_scheduleCallback(
      n.unstable_NormalPriority,
      JY
    )));
  }
  var Ow = null;
  function O2(u) {
    Ow !== u && (Ow = u, n.unstable_scheduleCallback(
      n.unstable_NormalPriority,
      function() {
        Ow === u && (Ow = null);
        for (var f = 0; f < u.length; f += 3) {
          var b = u[f], M = u[f + 1], N = u[f + 2];
          if (typeof M != "function") {
            if (SN(M || b) === null)
              continue;
            break;
          }
          var L = be(b);
          L !== null && (u.splice(f, 3), f -= 3, k0(
            L,
            {
              pending: !0,
              data: N,
              method: b.method,
              action: M
            },
            M,
            N
          ));
        }
      }
    ));
  }
  function wg(u) {
    function f(ue) {
      return Pw(ue, u);
    }
    Oh !== null && Pw(Oh, u), zh !== null && Pw(zh, u), Fh !== null && Pw(Fh, u), tb.forEach(f), nb.forEach(f);
    for (var b = 0; b < Bh.length; b++) {
      var M = Bh[b];
      M.blockedOn === u && (M.blockedOn = null);
    }
    for (; 0 < Bh.length && (b = Bh[0], b.blockedOn === null); )
      I2(b), b.blockedOn === null && Bh.shift();
    if (b = (u.ownerDocument || u).$$reactFormReplay, b != null)
      for (M = 0; M < b.length; M += 3) {
        var N = b[M], L = b[M + 1], H = N[_r] || null;
        if (typeof L == "function")
          H || O2(b);
        else if (H) {
          var ee = null;
          if (L && L.hasAttribute("formAction")) {
            if (N = L, H = L[_r] || null)
              ee = H.formAction;
            else if (SN(N) !== null) continue;
          } else ee = H.action;
          typeof ee == "function" ? b[M + 1] = ee : (b.splice(M, 3), M -= 3), O2(b);
        }
      }
  }
  function z2() {
    function u(L) {
      L.canIntercept && L.info === "react-transition" && L.intercept({
        handler: function() {
          return new Promise(function(H) {
            return N = H;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function f() {
      N !== null && (N(), N = null), M || setTimeout(b, 20);
    }
    function b() {
      if (!M && !navigation.transition) {
        var L = navigation.currentEntry;
        L && L.url != null && navigation.navigate(L.url, {
          state: L.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var M = !1, N = null;
      return navigation.addEventListener("navigate", u), navigation.addEventListener("navigatesuccess", f), navigation.addEventListener("navigateerror", f), setTimeout(b, 100), function() {
        M = !0, navigation.removeEventListener("navigate", u), navigation.removeEventListener("navigatesuccess", f), navigation.removeEventListener("navigateerror", f), N !== null && (N(), N = null);
      };
    }
  }
  function MN(u) {
    this._internalRoot = u;
  }
  zw.prototype.render = MN.prototype.render = function(u) {
    var f = this._internalRoot;
    if (f === null) throw Error(i(409));
    var b = f.current, M = Ns();
    A2(b, M, u, f, null, null);
  }, zw.prototype.unmount = MN.prototype.unmount = function() {
    var u = this._internalRoot;
    if (u !== null) {
      this._internalRoot = null;
      var f = u.containerInfo;
      A2(u.current, 2, null, u, null, null), Co(), f[Xa] = null;
    }
  };
  function zw(u) {
    this._internalRoot = u;
  }
  zw.prototype.unstable_scheduleHydration = function(u) {
    if (u) {
      var f = Bn();
      u = { blockedOn: null, target: u, priority: f };
      for (var b = 0; b < Bh.length && f !== 0 && f < Bh[b].priority; b++) ;
      Bh.splice(b, 0, u), b === 0 && I2(u);
    }
  };
  var F2 = e.version;
  if (F2 !== "19.2.8")
    throw Error(
      i(
        527,
        F2,
        "19.2.8"
      )
    );
  Z.findDOMNode = function(u) {
    var f = u._reactInternals;
    if (f === void 0)
      throw typeof u.render == "function" ? Error(i(188)) : (u = Object.keys(u).join(","), Error(i(268, u)));
    return u = c(f), u = u !== null ? d(u) : null, u = u === null ? null : u.stateNode, u;
  };
  var eq = {
    bundleType: 0,
    version: "19.2.8",
    rendererPackageName: "react-dom",
    currentDispatcherRef: G,
    reconcilerVersion: "19.2.8"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Fw = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Fw.isDisabled && Fw.supportsFiber)
      try {
        It = Fw.inject(
          eq
        ), kt = Fw;
      } catch {
      }
  }
  return sb.createRoot = function(u, f) {
    if (!r(u)) throw Error(i(299));
    var b = !1, M = "", N = mw, L = z0, H = F0;
    return f != null && (f.unstable_strictMode === !0 && (b = !0), f.identifierPrefix !== void 0 && (M = f.identifierPrefix), f.onUncaughtError !== void 0 && (N = f.onUncaughtError), f.onCaughtError !== void 0 && (L = f.onCaughtError), f.onRecoverableError !== void 0 && (H = f.onRecoverableError)), f = E2(
      u,
      1,
      !1,
      null,
      null,
      b,
      M,
      null,
      N,
      L,
      H,
      z2
    ), u[Xa] = f.current, aN(u), new MN(f);
  }, sb.hydrateRoot = function(u, f, b) {
    if (!r(u)) throw Error(i(299));
    var M = !1, N = "", L = mw, H = z0, ee = F0, ue = null;
    return b != null && (b.unstable_strictMode === !0 && (M = !0), b.identifierPrefix !== void 0 && (N = b.identifierPrefix), b.onUncaughtError !== void 0 && (L = b.onUncaughtError), b.onCaughtError !== void 0 && (H = b.onCaughtError), b.onRecoverableError !== void 0 && (ee = b.onRecoverableError), b.formState !== void 0 && (ue = b.formState)), f = E2(
      u,
      1,
      !0,
      f,
      b ?? null,
      M,
      N,
      ue,
      L,
      H,
      ee,
      z2
    ), f.context = C2(null), b = f.current, M = Ns(), M = st(M), N = Yl(M), N.callback = null, Bc(b, N, M), b = M, f.current.lanes = b, Fi(f, b), lt(f), u[Xa] = f.current, aN(u), new zw(f);
  }, sb.version = "19.2.8", sb;
}
var Y2;
function uq() {
  if (Y2) return CN.exports;
  Y2 = 1;
  function n() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
      } catch (e) {
        console.error(e);
      }
  }
  return n(), CN.exports = cq(), CN.exports;
}
var dq = uq();
/**
 * react-router v7.18.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
var KP = /^(?:[a-z][a-z0-9+.-]*:|[\\/]{2})/i, G8 = /^[\\/]{2}/;
function hq(n, e) {
  return e + n.replace(/\\/g, "/");
}
var q2 = "popstate";
function Z2(n) {
  return typeof n == "object" && n != null && "pathname" in n && "search" in n && "hash" in n && "state" in n && "key" in n;
}
function fq(n = {}) {
  function e(r, a) {
    let {
      pathname: s = "/",
      search: o = "",
      hash: l = ""
    } = av(r.location.hash.substring(1));
    return !s.startsWith("/") && !s.startsWith(".") && (s = "/" + s), UL(
      "",
      { pathname: s, search: o, hash: l },
      // state defaults to `null` because `window.history.state` does
      a.state && a.state.usr || null,
      a.state && a.state.key || "default"
    );
  }
  function t(r, a) {
    let s = r.document.querySelector("base"), o = "";
    if (s && s.getAttribute("href")) {
      let l = r.location.href, c = l.indexOf("#");
      o = c === -1 ? l : l.slice(0, c);
    }
    return o + "#" + (typeof a == "string" ? a : Ix(a));
  }
  function i(r, a) {
    Po(
      r.pathname.charAt(0) === "/",
      `relative pathnames are not supported in hash history.push(${JSON.stringify(
        a
      )})`
    );
  }
  return mq(
    e,
    t,
    i,
    n
  );
}
function vr(n, e) {
  if (n === !1 || n === null || typeof n > "u")
    throw new Error(e);
}
function Po(n, e) {
  if (!n) {
    typeof console < "u" && console.warn(e);
    try {
      throw new Error(e);
    } catch {
    }
  }
}
function pq() {
  return Math.random().toString(36).substring(2, 10);
}
function K2(n, e) {
  return {
    usr: n.state,
    key: n.key,
    idx: e,
    masked: n.mask ? {
      pathname: n.pathname,
      search: n.search,
      hash: n.hash
    } : void 0
  };
}
function UL(n, e, t = null, i, r) {
  return {
    pathname: typeof n == "string" ? n : n.pathname,
    search: "",
    hash: "",
    ...typeof e == "string" ? av(e) : e,
    state: t,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: e && e.key || i || pq(),
    mask: r
  };
}
function Ix({
  pathname: n = "/",
  search: e = "",
  hash: t = ""
}) {
  return e && e !== "?" && (n += e.charAt(0) === "?" ? e : "?" + e), t && t !== "#" && (n += t.charAt(0) === "#" ? t : "#" + t), n;
}
function av(n) {
  let e = {};
  if (n) {
    let t = n.indexOf("#");
    t >= 0 && (e.hash = n.substring(t), n = n.substring(0, t));
    let i = n.indexOf("?");
    i >= 0 && (e.search = n.substring(i), n = n.substring(0, i)), n && (e.pathname = n);
  }
  return e;
}
function mq(n, e, t, i = {}) {
  let { window: r = document.defaultView, v5Compat: a = !1 } = i, s = r.history, o = "POP", l = null, c = d();
  c == null && (c = 0, s.replaceState({ ...s.state, idx: c }, ""));
  function d() {
    return (s.state || { idx: null }).idx;
  }
  function h() {
    o = "POP";
    let S = d(), x = S == null ? null : S - c;
    c = S, l && l({ action: o, location: w.location, delta: x });
  }
  function p(S, x) {
    o = "PUSH";
    let E = Z2(S) ? S : UL(w.location, S, x);
    t && t(E, S), c = d() + 1;
    let C = K2(E, c), A = w.createHref(E.mask || E);
    try {
      s.pushState(C, "", A);
    } catch (k) {
      if (k instanceof DOMException && k.name === "DataCloneError")
        throw k;
      r.location.assign(A);
    }
    a && l && l({ action: o, location: w.location, delta: 1 });
  }
  function v(S, x) {
    o = "REPLACE";
    let E = Z2(S) ? S : UL(w.location, S, x);
    t && t(E, S), c = d();
    let C = K2(E, c), A = w.createHref(E.mask || E);
    s.replaceState(C, "", A), a && l && l({ action: o, location: w.location, delta: 0 });
  }
  function y(S) {
    return vq(r, S);
  }
  let w = {
    get action() {
      return o;
    },
    get location() {
      return n(r, s);
    },
    listen(S) {
      if (l)
        throw new Error("A history only accepts one active listener");
      return r.addEventListener(q2, h), l = S, () => {
        r.removeEventListener(q2, h), l = null;
      };
    },
    createHref(S) {
      return e(r, S);
    },
    createURL: y,
    encodeLocation(S) {
      let x = y(S);
      return {
        pathname: x.pathname,
        search: x.search,
        hash: x.hash
      };
    },
    push: p,
    replace: v,
    go(S) {
      return s.go(S);
    }
  };
  return w;
}
function vq(n, e, t = !1) {
  let i = "http://localhost";
  n && (i = n.location.origin !== "null" ? n.location.origin : n.location.href), vr(i, "No window.location.(origin|href) available to create URL");
  let r = typeof e == "string" ? e : Ix(e);
  return r = r.replace(/ $/, "%20"), !t && G8.test(r) && (r = i + r), new URL(r, i);
}
function W8(n, e, t = "/") {
  return gq(n, e, t, !1);
}
function gq(n, e, t, i, r) {
  let a = typeof e == "string" ? av(e) : e, s = Od(a.pathname || "/", t);
  if (s == null)
    return null;
  let o = _q(n), l = null, c = Rq(s);
  for (let d = 0; l == null && d < o.length; ++d)
    l = Aq(
      o[d],
      c,
      i
    );
  return l;
}
function _q(n) {
  let e = $8(n);
  return yq(e), e;
}
function $8(n, e = [], t = [], i = "", r = !1) {
  let a = (s, o, l = r, c) => {
    let d = {
      relativePath: c === void 0 ? s.path || "" : c,
      caseSensitive: s.caseSensitive === !0,
      childrenIndex: o,
      route: s
    };
    if (d.relativePath.startsWith("/")) {
      if (!d.relativePath.startsWith(i) && l)
        return;
      vr(
        d.relativePath.startsWith(i),
        `Absolute route path "${d.relativePath}" nested under path "${i}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
      ), d.relativePath = d.relativePath.slice(i.length);
    }
    let h = pc([i, d.relativePath]), p = t.concat(d);
    s.children && s.children.length > 0 && (vr(
      // Our types know better, but runtime JS may not!
      // @ts-expect-error
      s.index !== !0,
      `Index routes must not have child routes. Please remove all child routes from route path "${h}".`
    ), $8(
      s.children,
      e,
      p,
      h,
      l
    )), !(s.path == null && !s.index) && e.push({
      path: h,
      score: Eq(h, s.index),
      routesMeta: p.map((v, y) => {
        let [w, S] = q8(
          v.relativePath,
          v.caseSensitive,
          y === p.length - 1
        );
        return {
          ...v,
          matcher: w,
          compiledParams: S
        };
      })
    });
  };
  return n.forEach((s, o) => {
    if (s.path === "" || !s.path?.includes("?"))
      a(s, o);
    else
      for (let l of X8(s.path))
        a(s, o, !0, l);
  }), e;
}
function X8(n) {
  let e = n.split("/");
  if (e.length === 0) return [];
  let [t, ...i] = e, r = t.endsWith("?"), a = t.replace(/\?$/, "");
  if (i.length === 0)
    return r ? [a, ""] : [a];
  let s = X8(i.join("/")), o = [];
  return o.push(
    ...s.map(
      (l) => l === "" ? a : [a, l].join("/")
    )
  ), r && o.push(...s), o.map(
    (l) => n.startsWith("/") && l === "" ? "/" : l
  );
}
function yq(n) {
  n.sort(
    (e, t) => e.score !== t.score ? t.score - e.score : Cq(
      e.routesMeta.map((i) => i.childrenIndex),
      t.routesMeta.map((i) => i.childrenIndex)
    )
  );
}
var bq = /^:[\w-]+$/, xq = 3, Sq = 2, wq = 1, Mq = 10, Tq = -2, Q2 = (n) => n === "*";
function Eq(n, e) {
  let t = n.split("/"), i = t.length;
  return t.some(Q2) && (i += Tq), e && (i += Sq), t.filter((r) => !Q2(r)).reduce(
    (r, a) => r + (bq.test(a) ? xq : a === "" ? wq : Mq),
    i
  );
}
function Cq(n, e) {
  return n.length === e.length && n.slice(0, -1).every((i, r) => i === e[r]) ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    n[n.length - 1] - e[e.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function Aq(n, e, t = !1) {
  let { routesMeta: i } = n, r = {}, a = "/", s = [];
  for (let o = 0; o < i.length; ++o) {
    let l = i[o], c = o === i.length - 1, d = a === "/" ? e : e.slice(a.length) || "/", h = {
      path: l.relativePath,
      caseSensitive: l.caseSensitive,
      end: c
    }, p = (
      // Use precomputed matcher if it exists
      l.matcher && l.compiledParams ? Y8(
        h,
        d,
        l.matcher,
        l.compiledParams
      ) : TE(h, d)
    ), v = l.route;
    if (!p && c && t && !i[i.length - 1].route.index && (p = TE(
      {
        path: l.relativePath,
        caseSensitive: l.caseSensitive,
        end: !1
      },
      d
    )), !p)
      return null;
    Object.assign(r, p.params), s.push({
      // TODO: Can this as be avoided?
      params: r,
      pathname: pc([a, p.pathname]),
      pathnameBase: Dq(
        pc([a, p.pathnameBase])
      ),
      route: v
    }), p.pathnameBase !== "/" && (a = pc([a, p.pathnameBase]));
  }
  return s;
}
function TE(n, e) {
  typeof n == "string" && (n = { path: n, caseSensitive: !1, end: !0 });
  let [t, i] = q8(
    n.path,
    n.caseSensitive,
    n.end
  );
  return Y8(n, e, t, i);
}
function Y8(n, e, t, i) {
  let r = e.match(t);
  if (!r) return null;
  let a = r[0], s = a.replace(/(.)\/+$/, "$1"), o = r.slice(1);
  return {
    params: i.reduce(
      (c, { paramName: d, isOptional: h }, p) => {
        if (d === "*") {
          let y = o[p] || "";
          s = a.slice(0, a.length - y.length).replace(/(.)\/+$/, "$1");
        }
        const v = o[p];
        return h && !v ? c[d] = void 0 : c[d] = (v || "").replace(/%2F/g, "/"), c;
      },
      {}
    ),
    pathname: a,
    pathnameBase: s,
    pattern: n
  };
}
function q8(n, e = !1, t = !0) {
  Po(
    n === "*" || !n.endsWith("*") || n.endsWith("/*"),
    `Route path "${n}" will be treated as if it were "${n.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${n.replace(/\*$/, "/*")}".`
  );
  let i = [], r = "^" + n.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(
    /\/:([\w-]+)(\?)?/g,
    (s, o, l, c, d) => {
      if (i.push({ paramName: o, isOptional: l != null }), l) {
        let h = d.charAt(c + s.length);
        return h && h !== "/" ? "/([^\\/]*)" : "(?:/([^\\/]*))?";
      }
      return "/([^\\/]+)";
    }
  ).replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
  return n.endsWith("*") ? (i.push({ paramName: "*" }), r += n === "*" || n === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$") : t ? r += "\\/*$" : n !== "" && n !== "/" && (r += "(?:(?=\\/|$))"), [new RegExp(r, e ? void 0 : "i"), i];
}
function Rq(n) {
  try {
    return n.split("/").map((e) => decodeURIComponent(e).replace(/\//g, "%2F")).join("/");
  } catch (e) {
    return Po(
      !1,
      `The URL path "${n}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${e}).`
    ), n;
  }
}
function Od(n, e) {
  if (e === "/") return n;
  if (!n.toLowerCase().startsWith(e.toLowerCase()))
    return null;
  let t = e.endsWith("/") ? e.length - 1 : e.length, i = n.charAt(t);
  return i && i !== "/" ? null : n.slice(t) || "/";
}
function Nq(n, e = "/") {
  let {
    pathname: t,
    search: i = "",
    hash: r = ""
  } = typeof n == "string" ? av(n) : n, a;
  return t ? (t = Z8(t), t.startsWith("/") ? a = J2(t.substring(1), "/") : a = J2(t, e)) : a = e, {
    pathname: a,
    search: Lq(i),
    hash: Iq(r)
  };
}
function J2(n, e) {
  let t = EE(e).split("/");
  return n.split("/").forEach((r) => {
    r === ".." ? t.length > 1 && t.pop() : r !== "." && t.push(r);
  }), t.length > 1 ? t.join("/") : "/";
}
function kN(n, e, t, i) {
  return `Cannot include a '${n}' character in a manually specified \`to.${e}\` field [${JSON.stringify(
    i
  )}].  Please separate it out to the \`to.${t}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function kq(n) {
  return n.filter(
    (e, t) => t === 0 || e.route.path && e.route.path.length > 0
  );
}
function QP(n) {
  let e = kq(n);
  return e.map(
    (t, i) => i === e.length - 1 ? t.pathname : t.pathnameBase
  );
}
function dA(n, e, t, i = !1) {
  let r;
  typeof n == "string" ? r = av(n) : (r = { ...n }, vr(
    !r.pathname || !r.pathname.includes("?"),
    kN("?", "pathname", "search", r)
  ), vr(
    !r.pathname || !r.pathname.includes("#"),
    kN("#", "pathname", "hash", r)
  ), vr(
    !r.search || !r.search.includes("#"),
    kN("#", "search", "hash", r)
  ));
  let a = n === "" || r.pathname === "", s = a ? "/" : r.pathname, o;
  if (s == null)
    o = t;
  else {
    let h = e.length - 1;
    if (!i && s.startsWith("..")) {
      let p = s.split("/");
      for (; p[0] === ".."; )
        p.shift(), h -= 1;
      r.pathname = p.join("/");
    }
    o = h >= 0 ? e[h] : "/";
  }
  let l = Nq(r, o), c = s && s !== "/" && s.endsWith("/"), d = (a || s === ".") && t.endsWith("/");
  return !l.pathname.endsWith("/") && (c || d) && (l.pathname += "/"), l;
}
var Z8 = (n) => n.replace(/[\\/]{2,}/g, "/"), pc = (n) => Z8(n.join("/")), EE = (n) => n.replace(/\/+$/, ""), Dq = (n) => EE(n).replace(/^\/*/, "/"), Lq = (n) => !n || n === "?" ? "" : n.startsWith("?") ? n : "?" + n, Iq = (n) => !n || n === "#" ? "" : n.startsWith("#") ? n : "#" + n, Pq = class {
  constructor(n, e, t, i = !1) {
    this.status = n, this.statusText = e || "", this.internal = i, t instanceof Error ? (this.data = t.toString(), this.error = t) : this.data = t;
  }
};
function Oq(n) {
  return n != null && typeof n.status == "number" && typeof n.statusText == "string" && typeof n.internal == "boolean" && "data" in n;
}
function zq(n) {
  let e = n.map((t) => t.route.path).filter(Boolean);
  return pc(e) || "/";
}
var K8 = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
function Q8(n, e) {
  let t = n;
  if (typeof t != "string" || !KP.test(t))
    return {
      absoluteURL: void 0,
      isExternal: !1,
      to: t
    };
  let i = t, r = !1;
  if (K8)
    try {
      let a = new URL(window.location.href), s = G8.test(t) ? new URL(hq(t, a.protocol)) : new URL(t), o = Od(s.pathname, e);
      s.origin === a.origin && o != null ? t = o + s.search + s.hash : r = !0;
    } catch {
      Po(
        !1,
        `<Link to="${t}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`
      );
    }
  return {
    absoluteURL: i,
    isExternal: r,
    to: t
  };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
var J8 = [
  "POST",
  "PUT",
  "PATCH",
  "DELETE"
];
new Set(
  J8
);
var Fq = [
  "GET",
  ...J8
];
new Set(Fq);
var Bq = [
  "about:",
  "blob:",
  "chrome:",
  "chrome-untrusted:",
  "content:",
  "data:",
  "devtools:",
  "file:",
  "filesystem:",
  // eslint-disable-next-line no-script-url
  "javascript:"
];
function Uq(n) {
  try {
    return Bq.includes(new URL(n).protocol);
  } catch {
    return !1;
  }
}
var py = j.createContext(null);
py.displayName = "DataRouter";
var hA = j.createContext(null);
hA.displayName = "DataRouterState";
var eV = j.createContext(!1);
function jq() {
  return j.useContext(eV);
}
var tV = j.createContext({
  isTransitioning: !1
});
tV.displayName = "ViewTransition";
var Hq = j.createContext(
  /* @__PURE__ */ new Map()
);
Hq.displayName = "Fetchers";
var Vq = j.createContext(null);
Vq.displayName = "Await";
var Bo = j.createContext(
  null
);
Bo.displayName = "Navigation";
var TS = j.createContext(
  null
);
TS.displayName = "Location";
var Ru = j.createContext({
  outlet: null,
  matches: [],
  isDataRoute: !1
});
Ru.displayName = "Route";
var JP = j.createContext(null);
JP.displayName = "RouteError";
var nV = "REACT_ROUTER_ERROR", Gq = "REDIRECT", Wq = "ROUTE_ERROR_RESPONSE";
function $q(n) {
  if (n.startsWith(`${nV}:${Gq}:{`))
    try {
      let e = JSON.parse(n.slice(28));
      if (typeof e == "object" && e && typeof e.status == "number" && typeof e.statusText == "string" && typeof e.location == "string" && typeof e.reloadDocument == "boolean" && typeof e.replace == "boolean")
        return e;
    } catch {
    }
}
function Xq(n) {
  if (n.startsWith(
    `${nV}:${Wq}:{`
  ))
    try {
      let e = JSON.parse(n.slice(40));
      if (typeof e == "object" && e && typeof e.status == "number" && typeof e.statusText == "string")
        return new Pq(
          e.status,
          e.statusText,
          e.data
        );
    } catch {
    }
}
function Yq(n, { relative: e } = {}) {
  vr(
    my(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useHref() may be used only in the context of a <Router> component."
  );
  let { basename: t, navigator: i } = j.useContext(Bo), { hash: r, pathname: a, search: s } = ES(n, { relative: e }), o = a;
  return t !== "/" && (o = a === "/" ? t : pc([t, a])), i.createHref({ pathname: o, search: s, hash: r });
}
function my() {
  return j.useContext(TS) != null;
}
function ka() {
  return vr(
    my(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useLocation() may be used only in the context of a <Router> component."
  ), j.useContext(TS).location;
}
var iV = "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function rV(n) {
  j.useContext(Bo).static || j.useLayoutEffect(n);
}
function aa() {
  let { isDataRoute: n } = j.useContext(Ru);
  return n ? oZ() : qq();
}
function qq() {
  vr(
    my(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useNavigate() may be used only in the context of a <Router> component."
  );
  let n = j.useContext(py), { basename: e, navigator: t } = j.useContext(Bo), { matches: i } = j.useContext(Ru), { pathname: r } = ka(), a = JSON.stringify(QP(i)), s = j.useRef(!1);
  return rV(() => {
    s.current = !0;
  }), j.useCallback(
    (l, c = {}) => {
      if (Po(s.current, iV), !s.current) return;
      if (typeof l == "number") {
        t.go(l);
        return;
      }
      let d = dA(
        l,
        JSON.parse(a),
        r,
        c.relative === "path"
      );
      n == null && e !== "/" && (d.pathname = d.pathname === "/" ? e : pc([e, d.pathname])), (c.replace ? t.replace : t.push)(
        d,
        c.state,
        c
      );
    },
    [
      e,
      t,
      a,
      r,
      n
    ]
  );
}
j.createContext(null);
function ES(n, { relative: e } = {}) {
  let { matches: t } = j.useContext(Ru), { pathname: i } = ka(), r = JSON.stringify(QP(t));
  return j.useMemo(
    () => dA(
      n,
      JSON.parse(r),
      i,
      e === "path"
    ),
    [n, r, i, e]
  );
}
function Zq(n, e) {
  return aV(n, e);
}
function aV(n, e, t) {
  vr(
    my(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useRoutes() may be used only in the context of a <Router> component."
  );
  let { navigator: i } = j.useContext(Bo), { matches: r } = j.useContext(Ru), a = r[r.length - 1], s = a ? a.params : {}, o = a ? a.pathname : "/", l = a ? a.pathnameBase : "/", c = a && a.route;
  {
    let S = c && c.path || "";
    oV(
      o,
      !c || S.endsWith("*") || S.endsWith("*?"),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${o}" (under <Route path="${S}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${S}"> to <Route path="${S === "/" ? "*" : `${S}/*`}">.`
    );
  }
  let d = ka(), h;
  if (e) {
    let S = typeof e == "string" ? av(e) : e;
    vr(
      l === "/" || S.pathname?.startsWith(l),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${l}" but pathname "${S.pathname}" was given in the \`location\` prop.`
    ), h = S;
  } else
    h = d;
  let p = h.pathname || "/", v = p;
  if (l !== "/") {
    let S = l.replace(/^\//, "").split("/");
    v = "/" + p.replace(/^\//, "").split("/").slice(S.length).join("/");
  }
  let y = t && t.state.matches.length ? (
    // If we're in a data router, use the matches we've already identified but ensure
    // we have the latest route instances from the manifest in case elements have changed
    t.state.matches.map(
      (S) => Object.assign(S, {
        route: t.manifest[S.route.id] || S.route
      })
    )
  ) : W8(n, { pathname: v });
  Po(
    c || y != null,
    `No routes matched location "${h.pathname}${h.search}${h.hash}" `
  ), Po(
    y == null || y[y.length - 1].route.element !== void 0 || y[y.length - 1].route.Component !== void 0 || y[y.length - 1].route.lazy !== void 0,
    `Matched leaf route at location "${h.pathname}${h.search}${h.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`
  );
  let w = tZ(
    y && y.map(
      (S) => Object.assign({}, S, {
        params: Object.assign({}, s, S.params),
        pathname: pc([
          l,
          // Re-encode pathnames that were decoded inside matchRoutes.
          // Pre-encode `%`, `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          i.encodeLocation ? i.encodeLocation(
            S.pathname.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : S.pathname
        ]),
        pathnameBase: S.pathnameBase === "/" ? l : pc([
          l,
          // Re-encode pathnames that were decoded inside matchRoutes
          // Pre-encode `%`, `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          i.encodeLocation ? i.encodeLocation(
            S.pathnameBase.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : S.pathnameBase
        ])
      })
    ),
    r,
    t
  );
  return e && w ? /* @__PURE__ */ j.createElement(
    TS.Provider,
    {
      value: {
        location: {
          pathname: "/",
          search: "",
          hash: "",
          state: null,
          key: "default",
          mask: void 0,
          ...h
        },
        navigationType: "POP"
        /* Pop */
      }
    },
    w
  ) : w;
}
function Kq() {
  let n = sZ(), e = Oq(n) ? `${n.status} ${n.statusText}` : n instanceof Error ? n.message : JSON.stringify(n), t = n instanceof Error ? n.stack : null, i = "rgba(200,200,200, 0.5)", r = { padding: "0.5rem", backgroundColor: i }, a = { padding: "2px 4px", backgroundColor: i }, s = null;
  return console.error(
    "Error handled by React Router default ErrorBoundary:",
    n
  ), s = /* @__PURE__ */ j.createElement(j.Fragment, null, /* @__PURE__ */ j.createElement("p", null, "💿 Hey developer 👋"), /* @__PURE__ */ j.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /* @__PURE__ */ j.createElement("code", { style: a }, "ErrorBoundary"), " or", " ", /* @__PURE__ */ j.createElement("code", { style: a }, "errorElement"), " prop on your route.")), /* @__PURE__ */ j.createElement(j.Fragment, null, /* @__PURE__ */ j.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ j.createElement("h3", { style: { fontStyle: "italic" } }, e), t ? /* @__PURE__ */ j.createElement("pre", { style: r }, t) : null, s);
}
var Qq = /* @__PURE__ */ j.createElement(Kq, null), sV = class extends j.Component {
  constructor(n) {
    super(n), this.state = {
      location: n.location,
      revalidation: n.revalidation,
      error: n.error
    };
  }
  static getDerivedStateFromError(n) {
    return { error: n };
  }
  static getDerivedStateFromProps(n, e) {
    return e.location !== n.location || e.revalidation !== "idle" && n.revalidation === "idle" ? {
      error: n.error,
      location: n.location,
      revalidation: n.revalidation
    } : {
      error: n.error !== void 0 ? n.error : e.error,
      location: e.location,
      revalidation: n.revalidation || e.revalidation
    };
  }
  componentDidCatch(n, e) {
    this.props.onError ? this.props.onError(n, e) : console.error(
      "React Router caught the following error during render",
      n
    );
  }
  render() {
    let n = this.state.error;
    if (this.context && typeof n == "object" && n && "digest" in n && typeof n.digest == "string") {
      const t = Xq(n.digest);
      t && (n = t);
    }
    let e = n !== void 0 ? /* @__PURE__ */ j.createElement(Ru.Provider, { value: this.props.routeContext }, /* @__PURE__ */ j.createElement(
      JP.Provider,
      {
        value: n,
        children: this.props.component
      }
    )) : this.props.children;
    return this.context ? /* @__PURE__ */ j.createElement(Jq, { error: n }, e) : e;
  }
};
sV.contextType = eV;
var DN = /* @__PURE__ */ new WeakMap();
function Jq({
  children: n,
  error: e
}) {
  let { basename: t } = j.useContext(Bo);
  if (typeof e == "object" && e && "digest" in e && typeof e.digest == "string") {
    let i = $q(e.digest);
    if (i) {
      let r = DN.get(e);
      if (r) throw r;
      let a = Q8(i.location, t), s = a.absoluteURL || a.to;
      if (Uq(s))
        throw new Error("Invalid redirect location");
      if (K8 && !DN.get(e))
        if (a.isExternal || i.reloadDocument)
          window.location.href = s;
        else {
          const o = Promise.resolve().then(
            () => window.__reactRouterDataRouter.navigate(a.to, {
              replace: i.replace
            })
          );
          throw DN.set(e, o), o;
        }
      return /* @__PURE__ */ j.createElement("meta", { httpEquiv: "refresh", content: `0;url=${s}` });
    }
  }
  return n;
}
function eZ({ routeContext: n, match: e, children: t }) {
  let i = j.useContext(py);
  return i && i.static && i.staticContext && (e.route.errorElement || e.route.ErrorBoundary) && (i.staticContext._deepestRenderedBoundaryId = e.route.id), /* @__PURE__ */ j.createElement(Ru.Provider, { value: n }, t);
}
function tZ(n, e = [], t) {
  let i = t?.state;
  if (n == null) {
    if (!i)
      return null;
    if (i.errors)
      n = i.matches;
    else if (e.length === 0 && !i.initialized && i.matches.length > 0)
      n = i.matches;
    else
      return null;
  }
  let r = n, a = i?.errors;
  if (a != null) {
    let d = r.findIndex(
      (h) => h.route.id && a?.[h.route.id] !== void 0
    );
    vr(
      d >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(
        a
      ).join(",")}`
    ), r = r.slice(
      0,
      Math.min(r.length, d + 1)
    );
  }
  let s = !1, o = -1;
  if (t && i) {
    s = i.renderFallback;
    for (let d = 0; d < r.length; d++) {
      let h = r[d];
      if ((h.route.HydrateFallback || h.route.hydrateFallbackElement) && (o = d), h.route.id) {
        let { loaderData: p, errors: v } = i, y = h.route.loader && !p.hasOwnProperty(h.route.id) && (!v || v[h.route.id] === void 0);
        if (h.route.lazy || y) {
          t.isStatic && (s = !0), o >= 0 ? r = r.slice(0, o + 1) : r = [r[0]];
          break;
        }
      }
    }
  }
  let l = t?.onError, c = i && l ? (d, h) => {
    l(d, {
      location: i.location,
      params: i.matches?.[0]?.params ?? {},
      pattern: zq(i.matches),
      errorInfo: h
    });
  } : void 0;
  return r.reduceRight(
    (d, h, p) => {
      let v, y = !1, w = null, S = null;
      i && (v = a && h.route.id ? a[h.route.id] : void 0, w = h.route.errorElement || Qq, s && (o < 0 && p === 0 ? (oV(
        "route-fallback",
        !1,
        "No `HydrateFallback` element provided to render during initial hydration"
      ), y = !0, S = null) : o === p && (y = !0, S = h.route.hydrateFallbackElement || null)));
      let x = e.concat(r.slice(0, p + 1)), E = () => {
        let C;
        return v ? C = w : y ? C = S : h.route.Component ? C = /* @__PURE__ */ j.createElement(h.route.Component, null) : h.route.element ? C = h.route.element : C = d, /* @__PURE__ */ j.createElement(
          eZ,
          {
            match: h,
            routeContext: {
              outlet: d,
              matches: x,
              isDataRoute: i != null
            },
            children: C
          }
        );
      };
      return i && (h.route.ErrorBoundary || h.route.errorElement || p === 0) ? /* @__PURE__ */ j.createElement(
        sV,
        {
          location: i.location,
          revalidation: i.revalidation,
          component: w,
          error: v,
          children: E(),
          routeContext: { outlet: null, matches: x, isDataRoute: !0 },
          onError: c
        }
      ) : E();
    },
    null
  );
}
function e3(n) {
  return `${n} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function nZ(n) {
  let e = j.useContext(py);
  return vr(e, e3(n)), e;
}
function iZ(n) {
  let e = j.useContext(hA);
  return vr(e, e3(n)), e;
}
function rZ(n) {
  let e = j.useContext(Ru);
  return vr(e, e3(n)), e;
}
function t3(n) {
  let e = rZ(n), t = e.matches[e.matches.length - 1];
  return vr(
    t.route.id,
    `${n} can only be used on routes that contain a unique "id"`
  ), t.route.id;
}
function aZ() {
  return t3(
    "useRouteId"
    /* UseRouteId */
  );
}
function sZ() {
  let n = j.useContext(JP), e = iZ(
    "useRouteError"
    /* UseRouteError */
  ), t = t3(
    "useRouteError"
    /* UseRouteError */
  );
  return n !== void 0 ? n : e.errors?.[t];
}
function oZ() {
  let { router: n } = nZ(
    "useNavigate"
    /* UseNavigateStable */
  ), e = t3(
    "useNavigate"
    /* UseNavigateStable */
  ), t = j.useRef(!1);
  return rV(() => {
    t.current = !0;
  }), j.useCallback(
    async (r, a = {}) => {
      Po(t.current, iV), t.current && (typeof r == "number" ? await n.navigate(r) : await n.navigate(r, { fromRouteId: e, ...a }));
    },
    [n, e]
  );
}
var e4 = {};
function oV(n, e, t) {
  !e && !e4[n] && (e4[n] = !0, Po(!1, t));
}
j.memo(lZ);
function lZ({
  routes: n,
  manifest: e,
  future: t,
  state: i,
  isStatic: r,
  onError: a
}) {
  return aV(n, void 0, {
    manifest: e,
    state: i,
    isStatic: r,
    onError: a
  });
}
function wd({
  to: n,
  replace: e,
  state: t,
  relative: i
}) {
  vr(
    my(),
    // TODO: This error is probably because they somehow have 2 versions of
    // the router loaded. We can help them understand how to avoid that.
    "<Navigate> may be used only in the context of a <Router> component."
  );
  let { static: r } = j.useContext(Bo);
  Po(
    !r,
    "<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change."
  );
  let { matches: a } = j.useContext(Ru), { pathname: s } = ka(), o = aa(), l = dA(
    n,
    QP(a),
    s,
    i === "path"
  ), c = JSON.stringify(l);
  return j.useEffect(() => {
    o(JSON.parse(c), { replace: e, state: t, relative: i });
  }, [o, c, i, e, t]), null;
}
function ti(n) {
  vr(
    !1,
    "A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>."
  );
}
function cZ({
  basename: n = "/",
  children: e = null,
  location: t,
  navigationType: i = "POP",
  navigator: r,
  static: a = !1,
  useTransitions: s
}) {
  vr(
    !my(),
    "You cannot render a <Router> inside another <Router>. You should never have more than one in your app."
  );
  let o = n.replace(/^\/*/, "/"), l = j.useMemo(
    () => ({
      basename: o,
      navigator: r,
      static: a,
      useTransitions: s,
      future: {}
    }),
    [o, r, a, s]
  );
  typeof t == "string" && (t = av(t));
  let {
    pathname: c = "/",
    search: d = "",
    hash: h = "",
    state: p = null,
    key: v = "default",
    mask: y
  } = t, w = j.useMemo(() => {
    let S = Od(c, o);
    return S == null ? null : {
      location: {
        pathname: S,
        search: d,
        hash: h,
        state: p,
        key: v,
        mask: y
      },
      navigationType: i
    };
  }, [o, c, d, h, p, v, i, y]);
  return Po(
    w != null,
    `<Router basename="${o}"> is not able to match the URL "${c}${d}${h}" because it does not start with the basename, so the <Router> won't render anything.`
  ), w == null ? null : /* @__PURE__ */ j.createElement(Bo.Provider, { value: l }, /* @__PURE__ */ j.createElement(TS.Provider, { children: e, value: w }));
}
function uZ({
  children: n,
  location: e
}) {
  return Zq(jL(n), e);
}
function jL(n, e = []) {
  let t = [];
  return j.Children.forEach(n, (i, r) => {
    if (!j.isValidElement(i))
      return;
    let a = [...e, r];
    if (i.type === j.Fragment) {
      t.push.apply(
        t,
        jL(i.props.children, a)
      );
      return;
    }
    vr(
      i.type === ti,
      `[${typeof i.type == "string" ? i.type : i.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`
    ), vr(
      !i.props.index || !i.props.children,
      "An index route cannot have child routes."
    );
    let s = {
      id: i.props.id || a.join("-"),
      caseSensitive: i.props.caseSensitive,
      element: i.props.element,
      Component: i.props.Component,
      index: i.props.index,
      path: i.props.path,
      middleware: i.props.middleware,
      loader: i.props.loader,
      action: i.props.action,
      hydrateFallbackElement: i.props.hydrateFallbackElement,
      HydrateFallback: i.props.HydrateFallback,
      errorElement: i.props.errorElement,
      ErrorBoundary: i.props.ErrorBoundary,
      hasErrorBoundary: i.props.hasErrorBoundary === !0 || i.props.ErrorBoundary != null || i.props.errorElement != null,
      shouldRevalidate: i.props.shouldRevalidate,
      handle: i.props.handle,
      lazy: i.props.lazy
    };
    i.props.children && (s.children = jL(
      i.props.children,
      a
    )), t.push(s);
  }), t;
}
var VT = "get", GT = "application/x-www-form-urlencoded";
function fA(n) {
  return typeof HTMLElement < "u" && n instanceof HTMLElement;
}
function dZ(n) {
  return fA(n) && n.tagName.toLowerCase() === "button";
}
function hZ(n) {
  return fA(n) && n.tagName.toLowerCase() === "form";
}
function fZ(n) {
  return fA(n) && n.tagName.toLowerCase() === "input";
}
function pZ(n) {
  return !!(n.metaKey || n.altKey || n.ctrlKey || n.shiftKey);
}
function mZ(n, e) {
  return n.button === 0 && // Ignore everything but left clicks
  (!e || e === "_self") && // Let browser handle "target=_blank" etc.
  !pZ(n);
}
function HL(n = "") {
  return new URLSearchParams(
    typeof n == "string" || Array.isArray(n) || n instanceof URLSearchParams ? n : Object.keys(n).reduce((e, t) => {
      let i = n[t];
      return e.concat(
        Array.isArray(i) ? i.map((r) => [t, r]) : [[t, i]]
      );
    }, [])
  );
}
function vZ(n, e) {
  let t = HL(n);
  return e && e.forEach((i, r) => {
    t.has(r) || e.getAll(r).forEach((a) => {
      t.append(r, a);
    });
  }), t;
}
var Bw = null;
function gZ() {
  if (Bw === null)
    try {
      new FormData(
        document.createElement("form"),
        // @ts-expect-error if FormData supports the submitter parameter, this will throw
        0
      ), Bw = !1;
    } catch {
      Bw = !0;
    }
  return Bw;
}
var _Z = /* @__PURE__ */ new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
]);
function LN(n) {
  return n != null && !_Z.has(n) ? (Po(
    !1,
    `"${n}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${GT}"`
  ), null) : n;
}
function yZ(n, e) {
  let t, i, r, a, s;
  if (hZ(n)) {
    let o = n.getAttribute("action");
    i = o ? Od(o, e) : null, t = n.getAttribute("method") || VT, r = LN(n.getAttribute("enctype")) || GT, a = new FormData(n);
  } else if (dZ(n) || fZ(n) && (n.type === "submit" || n.type === "image")) {
    let o = n.form;
    if (o == null)
      throw new Error(
        'Cannot submit a <button> or <input type="submit"> without a <form>'
      );
    let l = n.getAttribute("formaction") || o.getAttribute("action");
    if (i = l ? Od(l, e) : null, t = n.getAttribute("formmethod") || o.getAttribute("method") || VT, r = LN(n.getAttribute("formenctype")) || LN(o.getAttribute("enctype")) || GT, a = new FormData(o, n), !gZ()) {
      let { name: c, type: d, value: h } = n;
      if (d === "image") {
        let p = c ? `${c}.` : "";
        a.append(`${p}x`, "0"), a.append(`${p}y`, "0");
      } else c && a.append(c, h);
    }
  } else {
    if (fA(n))
      throw new Error(
        'Cannot submit element that is not <form>, <button>, or <input type="submit|image">'
      );
    t = VT, i = null, r = GT, s = n;
  }
  return a && r === "text/plain" && (s = a, a = void 0), { action: i, method: t.toLowerCase(), encType: r, formData: a, body: s };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function n3(n, e) {
  if (n === !1 || n === null || typeof n > "u")
    throw new Error(e);
}
function lV(n, e, t, i) {
  let r = typeof n == "string" ? new URL(
    n,
    // This can be called during the SSR flow via PrefetchPageLinksImpl so
    // don't assume window is available
    typeof window > "u" ? "server://singlefetch/" : window.location.origin
  ) : n;
  return t ? r.pathname.endsWith("/") ? r.pathname = `${r.pathname}_.${i}` : r.pathname = `${r.pathname}.${i}` : r.pathname === "/" ? r.pathname = `_root.${i}` : e && Od(r.pathname, e) === "/" ? r.pathname = `${EE(e)}/_root.${i}` : r.pathname = `${EE(r.pathname)}.${i}`, r;
}
async function bZ(n, e) {
  if (n.id in e)
    return e[n.id];
  try {
    let t = await import(
      /* @vite-ignore */
      /* webpackIgnore: true */
      n.module
    );
    return e[n.id] = t, t;
  } catch (t) {
    return console.error(
      `Error loading route module \`${n.module}\`, reloading page...`
    ), console.error(t), window.__reactRouterContext && window.__reactRouterContext.isSpaMode, window.location.reload(), new Promise(() => {
    });
  }
}
function xZ(n) {
  return n == null ? !1 : n.href == null ? n.rel === "preload" && typeof n.imageSrcSet == "string" && typeof n.imageSizes == "string" : typeof n.rel == "string" && typeof n.href == "string";
}
async function SZ(n, e, t) {
  let i = await Promise.all(
    n.map(async (r) => {
      let a = e.routes[r.route.id];
      if (a) {
        let s = await bZ(a, t);
        return s.links ? s.links() : [];
      }
      return [];
    })
  );
  return EZ(
    i.flat(1).filter(xZ).filter((r) => r.rel === "stylesheet" || r.rel === "preload").map(
      (r) => r.rel === "stylesheet" ? { ...r, rel: "prefetch", as: "style" } : { ...r, rel: "prefetch" }
    )
  );
}
function t4(n, e, t, i, r, a) {
  let s = (l, c) => t[c] ? l.route.id !== t[c].route.id : !0, o = (l, c) => (
    // param change, /users/123 -> /users/456
    t[c].pathname !== l.pathname || // splat param changed, which is not present in match.path
    // e.g. /files/images/avatar.jpg -> files/finances.xls
    t[c].route.path?.endsWith("*") && t[c].params["*"] !== l.params["*"]
  );
  return a === "assets" ? e.filter(
    (l, c) => s(l, c) || o(l, c)
  ) : a === "data" ? e.filter((l, c) => {
    let d = i.routes[l.route.id];
    if (!d || !d.hasLoader)
      return !1;
    if (s(l, c) || o(l, c))
      return !0;
    if (l.route.shouldRevalidate) {
      let h = l.route.shouldRevalidate({
        currentUrl: new URL(
          r.pathname + r.search + r.hash,
          window.origin
        ),
        currentParams: t[0]?.params || {},
        nextUrl: new URL(n, window.origin),
        nextParams: l.params,
        defaultShouldRevalidate: !0
      });
      if (typeof h == "boolean")
        return h;
    }
    return !0;
  }) : [];
}
function wZ(n, e, { includeHydrateFallback: t } = {}) {
  return MZ(
    n.map((i) => {
      let r = e.routes[i.route.id];
      if (!r) return [];
      let a = [r.module];
      return r.clientActionModule && (a = a.concat(r.clientActionModule)), r.clientLoaderModule && (a = a.concat(r.clientLoaderModule)), t && r.hydrateFallbackModule && (a = a.concat(r.hydrateFallbackModule)), r.imports && (a = a.concat(r.imports)), a;
    }).flat(1)
  );
}
function MZ(n) {
  return [...new Set(n)];
}
function TZ(n) {
  let e = {}, t = Object.keys(n).sort();
  for (let i of t)
    e[i] = n[i];
  return e;
}
function EZ(n, e) {
  let t = /* @__PURE__ */ new Set();
  return new Set(e), n.reduce((i, r) => {
    let a = JSON.stringify(TZ(r));
    return t.has(a) || (t.add(a), i.push({ key: a, link: r })), i;
  }, []);
}
function i3() {
  let n = j.useContext(py);
  return n3(
    n,
    "You must render this element inside a <DataRouterContext.Provider> element"
  ), n;
}
function CZ() {
  let n = j.useContext(hA);
  return n3(
    n,
    "You must render this element inside a <DataRouterStateContext.Provider> element"
  ), n;
}
var r3 = j.createContext(void 0);
r3.displayName = "FrameworkContext";
function pA() {
  let n = j.useContext(r3);
  return n3(
    n,
    "You must render this element inside a <HydratedRouter> element"
  ), n;
}
function AZ(n, e) {
  let t = j.useContext(r3), [i, r] = j.useState(!1), [a, s] = j.useState(!1), { onFocus: o, onBlur: l, onMouseEnter: c, onMouseLeave: d, onTouchStart: h } = e, p = j.useRef(null);
  j.useEffect(() => {
    if (n === "render" && s(!0), n === "viewport") {
      let w = (x) => {
        x.forEach((E) => {
          s(E.isIntersecting);
        });
      }, S = new IntersectionObserver(w, { threshold: 0.5 });
      return p.current && S.observe(p.current), () => {
        S.disconnect();
      };
    }
  }, [n]), j.useEffect(() => {
    if (i) {
      let w = setTimeout(() => {
        s(!0);
      }, 100);
      return () => {
        clearTimeout(w);
      };
    }
  }, [i]);
  let v = () => {
    r(!0);
  }, y = () => {
    r(!1), s(!1);
  };
  return t ? n !== "intent" ? [a, p, {}] : [
    a,
    p,
    {
      onFocus: ob(o, v),
      onBlur: ob(l, y),
      onMouseEnter: ob(c, v),
      onMouseLeave: ob(d, y),
      onTouchStart: ob(h, v)
    }
  ] : [!1, p, {}];
}
function ob(n, e) {
  return (t) => {
    n && n(t), t.defaultPrevented || e(t);
  };
}
function RZ({ page: n, ...e }) {
  let t = jq(), { nonce: i } = pA(), { router: r } = i3(), a = j.useMemo(
    () => W8(r.routes, n, r.basename),
    [r.routes, n, r.basename]
  );
  return a ? (e.nonce == null && i && (e = { ...e, nonce: i }), t ? /* @__PURE__ */ j.createElement(kZ, { page: n, matches: a, ...e }) : /* @__PURE__ */ j.createElement(DZ, { page: n, matches: a, ...e })) : null;
}
function NZ(n) {
  let { manifest: e, routeModules: t } = pA(), [i, r] = j.useState([]);
  return j.useEffect(() => {
    let a = !1;
    return SZ(n, e, t).then(
      (s) => {
        a || r(s);
      }
    ), () => {
      a = !0;
    };
  }, [n, e, t]), i;
}
function kZ({
  page: n,
  matches: e,
  ...t
}) {
  let i = ka(), { future: r } = pA(), { basename: a } = i3(), s = j.useMemo(() => {
    if (n === i.pathname + i.search + i.hash)
      return [];
    let o = lV(
      n,
      a,
      r.v8_trailingSlashAwareDataRequests,
      "rsc"
    ), l = !1, c = [];
    for (let d of e)
      typeof d.route.shouldRevalidate == "function" ? l = !0 : c.push(d.route.id);
    return l && c.length > 0 && o.searchParams.set("_routes", c.join(",")), [o.pathname + o.search];
  }, [
    a,
    r.v8_trailingSlashAwareDataRequests,
    n,
    i,
    e
  ]);
  return /* @__PURE__ */ j.createElement(j.Fragment, null, s.map((o) => /* @__PURE__ */ j.createElement("link", { key: o, rel: "prefetch", as: "fetch", href: o, ...t })));
}
function DZ({
  page: n,
  matches: e,
  ...t
}) {
  let i = ka(), { future: r, manifest: a, routeModules: s } = pA(), { basename: o } = i3(), { loaderData: l, matches: c } = CZ(), d = j.useMemo(
    () => t4(
      n,
      e,
      c,
      a,
      i,
      "data"
    ),
    [n, e, c, a, i]
  ), h = j.useMemo(
    () => t4(
      n,
      e,
      c,
      a,
      i,
      "assets"
    ),
    [n, e, c, a, i]
  ), p = j.useMemo(() => {
    if (n === i.pathname + i.search + i.hash)
      return [];
    let w = /* @__PURE__ */ new Set(), S = !1;
    if (e.forEach((E) => {
      let C = a.routes[E.route.id];
      !C || !C.hasLoader || (!d.some((A) => A.route.id === E.route.id) && E.route.id in l && s[E.route.id]?.shouldRevalidate || C.hasClientLoader ? S = !0 : w.add(E.route.id));
    }), w.size === 0)
      return [];
    let x = lV(
      n,
      o,
      r.v8_trailingSlashAwareDataRequests,
      "data"
    );
    return S && w.size > 0 && x.searchParams.set(
      "_routes",
      e.filter((E) => w.has(E.route.id)).map((E) => E.route.id).join(",")
    ), [x.pathname + x.search];
  }, [
    o,
    r.v8_trailingSlashAwareDataRequests,
    l,
    i,
    a,
    d,
    e,
    n,
    s
  ]), v = j.useMemo(
    () => wZ(h, a),
    [h, a]
  ), y = NZ(h);
  return /* @__PURE__ */ j.createElement(j.Fragment, null, p.map((w) => /* @__PURE__ */ j.createElement("link", { key: w, rel: "prefetch", as: "fetch", href: w, ...t })), v.map((w) => /* @__PURE__ */ j.createElement("link", { key: w, rel: "modulepreload", href: w, ...t })), y.map(({ key: w, link: S }) => (
    // these don't spread `linkProps` because they are full link descriptors
    // already with their own props
    /* @__PURE__ */ j.createElement(
      "link",
      {
        key: w,
        nonce: t.nonce,
        ...S,
        crossOrigin: S.crossOrigin ?? t.crossOrigin
      }
    )
  )));
}
function LZ(...n) {
  return (e) => {
    n.forEach((t) => {
      typeof t == "function" ? t(e) : t != null && (t.current = e);
    });
  };
}
var IZ = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
try {
  IZ && (window.__reactRouterVersion = // @ts-expect-error
  "7.18.2");
} catch {
}
function PZ({
  basename: n,
  children: e,
  useTransitions: t,
  window: i
}) {
  let r = j.useRef();
  r.current == null && (r.current = fq({ window: i, v5Compat: !0 }));
  let a = r.current, [s, o] = j.useState({
    action: a.action,
    location: a.location
  }), l = j.useCallback(
    (c) => {
      t === !1 ? o(c) : j.startTransition(() => o(c));
    },
    [t]
  );
  return j.useLayoutEffect(() => a.listen(l), [a, l]), /* @__PURE__ */ j.createElement(
    cZ,
    {
      basename: n,
      children: e,
      location: s.location,
      navigationType: s.action,
      navigator: a,
      useTransitions: t
    }
  );
}
var B_ = j.forwardRef(
  function({
    onClick: e,
    discover: t = "render",
    prefetch: i = "none",
    relative: r,
    reloadDocument: a,
    replace: s,
    mask: o,
    state: l,
    target: c,
    to: d,
    preventScrollReset: h,
    viewTransition: p,
    defaultShouldRevalidate: v,
    ...y
  }, w) {
    let { basename: S, navigator: x, useTransitions: E } = j.useContext(Bo), C = typeof d == "string" && KP.test(d), A = Q8(d, S);
    d = A.to;
    let k = Yq(d, { relative: r }), D = ka(), O = null;
    if (o) {
      let q = dA(
        o,
        [],
        D.mask ? D.mask.pathname : "/",
        !0
      );
      S !== "/" && (q.pathname = q.pathname === "/" ? S : pc([S, q.pathname])), O = x.createHref(q);
    }
    let [F, P, I] = AZ(
      i,
      y
    ), U = FZ(d, {
      replace: s,
      mask: o,
      state: l,
      target: c,
      preventScrollReset: h,
      relative: r,
      viewTransition: p,
      defaultShouldRevalidate: v,
      useTransitions: E
    });
    function W(q) {
      e && e(q), q.defaultPrevented || U(q);
    }
    let V = !(A.isExternal || a), Y = (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      /* @__PURE__ */ j.createElement(
        "a",
        {
          ...y,
          ...I,
          href: (V ? O : void 0) || A.absoluteURL || k,
          onClick: V ? W : e,
          ref: LZ(w, P),
          target: c,
          "data-discover": !C && t === "render" ? "true" : void 0
        }
      )
    );
    return F && !C ? /* @__PURE__ */ j.createElement(j.Fragment, null, Y, /* @__PURE__ */ j.createElement(RZ, { page: k })) : Y;
  }
);
B_.displayName = "Link";
var WT = j.forwardRef(
  function({
    "aria-current": e = "page",
    caseSensitive: t = !1,
    className: i = "",
    end: r = !1,
    style: a,
    to: s,
    viewTransition: o,
    children: l,
    ...c
  }, d) {
    let h = ES(s, { relative: c.relative }), p = ka(), v = j.useContext(hA), { navigator: y, basename: w } = j.useContext(Bo), S = v != null && // Conditional usage is OK here because the usage of a data router is static
    // eslint-disable-next-line react-hooks/rules-of-hooks
    VZ(h) && o === !0, x = y.encodeLocation ? y.encodeLocation(h).pathname : h.pathname, E = p.pathname, C = v && v.navigation && v.navigation.location ? v.navigation.location.pathname : null;
    t || (E = E.toLowerCase(), C = C ? C.toLowerCase() : null, x = x.toLowerCase()), C && w && (C = Od(C, w) || C);
    const A = x !== "/" && x.endsWith("/") ? x.length - 1 : x.length;
    let k = E === x || !r && E.startsWith(x) && E.charAt(A) === "/", D = C != null && (C === x || !r && C.startsWith(x) && C.charAt(x.length) === "/"), O = {
      isActive: k,
      isPending: D,
      isTransitioning: S
    }, F = k ? e : void 0, P;
    typeof i == "function" ? P = i(O) : P = [
      i,
      k ? "active" : null,
      D ? "pending" : null,
      S ? "transitioning" : null
    ].filter(Boolean).join(" ");
    let I = typeof a == "function" ? a(O) : a;
    return /* @__PURE__ */ j.createElement(
      B_,
      {
        ...c,
        "aria-current": F,
        className: P,
        ref: d,
        style: I,
        to: s,
        viewTransition: o
      },
      typeof l == "function" ? l(O) : l
    );
  }
);
WT.displayName = "NavLink";
var OZ = j.forwardRef(
  ({
    discover: n = "render",
    fetcherKey: e,
    navigate: t,
    reloadDocument: i,
    replace: r,
    state: a,
    method: s = VT,
    action: o,
    onSubmit: l,
    relative: c,
    preventScrollReset: d,
    viewTransition: h,
    defaultShouldRevalidate: p,
    ...v
  }, y) => {
    let { useTransitions: w } = j.useContext(Bo), S = jZ(), x = HZ(o, { relative: c }), E = s.toLowerCase() === "get" ? "get" : "post", C = typeof o == "string" && KP.test(o), A = (k) => {
      if (l && l(k), k.defaultPrevented) return;
      k.preventDefault();
      let D = k.nativeEvent.submitter, O = D?.getAttribute("formmethod") || s, F = () => S(D || k.currentTarget, {
        fetcherKey: e,
        method: O,
        navigate: t,
        replace: r,
        state: a,
        relative: c,
        preventScrollReset: d,
        viewTransition: h,
        defaultShouldRevalidate: p
      });
      w && t !== !1 ? j.startTransition(() => F()) : F();
    };
    return /* @__PURE__ */ j.createElement(
      "form",
      {
        ref: y,
        method: E,
        action: x,
        onSubmit: i ? l : A,
        ...v,
        "data-discover": !C && n === "render" ? "true" : void 0
      }
    );
  }
);
OZ.displayName = "Form";
function zZ(n) {
  return `${n} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function cV(n) {
  let e = j.useContext(py);
  return vr(e, zZ(n)), e;
}
function FZ(n, {
  target: e,
  replace: t,
  mask: i,
  state: r,
  preventScrollReset: a,
  relative: s,
  viewTransition: o,
  defaultShouldRevalidate: l,
  useTransitions: c
} = {}) {
  let d = aa(), h = ka(), p = ES(n, { relative: s });
  return j.useCallback(
    (v) => {
      if (mZ(v, e)) {
        v.preventDefault();
        let y = t !== void 0 ? t : Ix(h) === Ix(p), w = () => d(n, {
          replace: y,
          mask: i,
          state: r,
          preventScrollReset: a,
          relative: s,
          viewTransition: o,
          defaultShouldRevalidate: l
        });
        c ? j.startTransition(() => w()) : w();
      }
    },
    [
      h,
      d,
      p,
      t,
      i,
      r,
      e,
      n,
      a,
      s,
      o,
      l,
      c
    ]
  );
}
function mA(n) {
  Po(
    typeof URLSearchParams < "u",
    "You cannot use the `useSearchParams` hook in a browser that does not support the URLSearchParams API. If you need to support Internet Explorer 11, we recommend you load a polyfill such as https://github.com/ungap/url-search-params."
  );
  let e = j.useRef(HL(n)), t = j.useRef(!1), i = ka(), r = j.useMemo(
    () => (
      // Only merge in the defaults if we haven't yet called setSearchParams.
      // Once we call that we want those to take precedence, otherwise you can't
      // remove a param with setSearchParams({}) if it has an initial value
      vZ(
        i.search,
        t.current ? null : e.current
      )
    ),
    [i.search]
  ), a = aa(), s = j.useCallback(
    (o, l) => {
      const c = HL(
        typeof o == "function" ? o(new URLSearchParams(r)) : o
      );
      t.current = !0, a("?" + c, l);
    },
    [a, r]
  );
  return [r, s];
}
var BZ = 0, UZ = () => `__${String(++BZ)}__`;
function jZ() {
  let { router: n } = cV(
    "useSubmit"
    /* UseSubmit */
  ), { basename: e } = j.useContext(Bo), t = aZ(), i = n.fetch, r = n.navigate;
  return j.useCallback(
    async (a, s = {}) => {
      let { action: o, method: l, encType: c, formData: d, body: h } = yZ(
        a,
        e
      );
      if (s.navigate === !1) {
        let p = s.fetcherKey || UZ();
        await i(p, t, s.action || o, {
          defaultShouldRevalidate: s.defaultShouldRevalidate,
          preventScrollReset: s.preventScrollReset,
          formData: d,
          body: h,
          formMethod: s.method || l,
          formEncType: s.encType || c,
          flushSync: s.flushSync
        });
      } else
        await r(s.action || o, {
          defaultShouldRevalidate: s.defaultShouldRevalidate,
          preventScrollReset: s.preventScrollReset,
          formData: d,
          body: h,
          formMethod: s.method || l,
          formEncType: s.encType || c,
          replace: s.replace,
          state: s.state,
          fromRouteId: t,
          flushSync: s.flushSync,
          viewTransition: s.viewTransition
        });
    },
    [i, r, e, t]
  );
}
function HZ(n, { relative: e } = {}) {
  let { basename: t } = j.useContext(Bo), i = j.useContext(Ru);
  vr(i, "useFormAction must be used inside a RouteContext");
  let [r] = i.matches.slice(-1), a = { ...ES(n || ".", { relative: e }) }, s = ka();
  if (n == null) {
    a.search = s.search;
    let o = new URLSearchParams(a.search), l = o.getAll("index");
    if (l.some((d) => d === "")) {
      o.delete("index"), l.filter((h) => h).forEach((h) => o.append("index", h));
      let d = o.toString();
      a.search = d ? `?${d}` : "";
    }
  }
  return (!n || n === ".") && r.route.index && (a.search = a.search ? a.search.replace(/^\?/, "?index&") : "?index"), t !== "/" && (a.pathname = a.pathname === "/" ? t : pc([t, a.pathname])), Ix(a);
}
function VZ(n, { relative: e } = {}) {
  let t = j.useContext(tV);
  vr(
    t != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?"
  );
  let { basename: i } = cV(
    "useViewTransitionState"
    /* useViewTransitionState */
  ), r = ES(n, { relative: e });
  if (!t.isTransitioning)
    return !1;
  let a = Od(t.currentLocation.pathname, i) || t.currentLocation.pathname, s = Od(t.nextLocation.pathname, i) || t.nextLocation.pathname;
  return TE(r.pathname, s) != null || TE(r.pathname, a) != null;
}
var GZ = V8();
const E_ = [];
function a3() {
  const n = Symbol("modal-layer");
  return E_.push(n), n;
}
function s3(n) {
  const e = E_.lastIndexOf(n);
  e >= 0 && E_.splice(e, 1);
}
function Px(n) {
  return E_.length > 0 && E_[E_.length - 1] === n;
}
function n4(n) {
  return Array.from(
    n.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((e) => !e.hasAttribute("disabled") && e.tabIndex !== -1);
}
function oi({
  open: n,
  onDismiss: e,
  onConfirm: t,
  title: i,
  confirmLabel: r = "Confirm",
  help: a,
  children: s
}) {
  const o = j.useId(), l = j.useRef(null), c = j.useRef(null);
  if (j.useEffect(() => {
    if (!n) return;
    c.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const h = document.querySelector(".dsc-shell");
    h instanceof HTMLElement && (h.inert = !0);
    const p = l.current;
    (p ? n4(p)[0] : null)?.focus();
    const y = a3(), w = (S) => {
      if (S.key === "Escape") {
        if (!Px(y)) return;
        S.preventDefault(), S.stopPropagation(), e();
        return;
      }
      if (S.key !== "Tab" || !p || !Px(y)) return;
      const x = n4(p);
      if (!x.length) return;
      const E = x[0], C = x[x.length - 1];
      S.shiftKey && document.activeElement === E ? (S.preventDefault(), C.focus()) : !S.shiftKey && document.activeElement === C && (S.preventDefault(), E.focus());
    };
    return window.addEventListener("keydown", w, !0), () => {
      window.removeEventListener("keydown", w, !0), s3(y), h instanceof HTMLElement && (h.inert = !1), c.current?.focus?.();
    };
  }, [n, e]), !n) return null;
  const d = /* @__PURE__ */ g.jsxs("div", { className: "dsc-decision-root is-open", role: "presentation", children: [
    /* @__PURE__ */ g.jsx("div", { className: "dsc-decision-scrim", "aria-hidden": "true", onClick: e }),
    /* @__PURE__ */ g.jsxs(
      "aside",
      {
        ref: l,
        className: "dsc-decision-panel",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": o,
        children: [
          /* @__PURE__ */ g.jsxs("header", { className: "dsc-decision-head", children: [
            /* @__PURE__ */ g.jsx("h2", { id: o, children: i }),
            /* @__PURE__ */ g.jsx("button", { type: "button", className: "dsc-icon-btn", "aria-label": "Dismiss", onClick: e, children: /* @__PURE__ */ g.jsx(cr, { name: "close", size: 16 }) })
          ] }),
          /* @__PURE__ */ g.jsx("div", { className: "dsc-decision-body", children: s }),
          a ? /* @__PURE__ */ g.jsx("div", { className: "dsc-decision-help", children: a }) : /* @__PURE__ */ g.jsx("div", { className: "dsc-decision-help is-empty" }),
          /* @__PURE__ */ g.jsxs("footer", { className: "dsc-decision-foot", children: [
            /* @__PURE__ */ g.jsx(Xe, { onClick: e, children: "Dismiss" }),
            t ? /* @__PURE__ */ g.jsx(Xe, { primary: !0, onClick: t, children: r }) : null
          ] })
        ]
      }
    )
  ] });
  return GZ.createPortal(d, document.body);
}
const WZ = {
  live: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
</svg>`,
  grow: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<path d="M12 22v-7"/><path d="M12 15c-4 0-7-2.5-7-6 3 0 7 1.5 7 6z"/><path d="M12 15c4 0 7-2.5 7-6-3 0-7 1.5-7 6z"/><path d="M12 8c-2.5-3-1-5.5 0-6 1 .5 2.5 3 0 6z"/>
</svg>`,
  tune: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
</svg>`,
  fleet: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/>
</svg>`,
  mission: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<path d="M3 11.5L12 4l9 7.5"/><path d="M6 10.5V20h12v-9.5"/>
</svg>`,
  twin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<path d="M4 19V5"/><path d="M4 19h16"/><path d="M7 15l3-4 3 2 4-6"/>
</svg>`,
  climate: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<path d="M12 3v18"/><path d="M8 7c2 0 4-1.5 4-4"/><path d="M16 7c-2 0-4-1.5-4-4"/><path d="M8 12c2 0 4-1.5 4-4"/><path d="M16 12c-2 0-4-1.5-4-4"/><path d="M8 17c2 0 4-1.5 4-4"/><path d="M16 17c-2 0-4-1.5-4-4"/>
</svg>`,
  fan: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<circle cx="12" cy="12" r="1.75" fill="currentColor" stroke="none"/><path d="M12 12V4"/><path d="M12 12L7.5 7.5"/><path d="M12 12L16.5 7.5"/><path d="M12 12L7.5 16.5"/><path d="M12 12L16.5 16.5"/>
</svg>`,
  root: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<path d="M12 3v8"/><path d="M12 11c-3 2-5 5-5 8"/><path d="M12 11c3 2 5 5 5 8"/><path d="M12 14c-2 1-3 3-3 5"/><path d="M12 14c2 1 3 3 3 5"/>
</svg>`,
  lighting: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
</svg>`,
  tent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<path d="M3 20L12 4l9 16H3z"/><path d="M12 4v16"/>
</svg>`,
  clone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<rect x="5" y="8" width="14" height="12" rx="1"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/>
</svg>`,
  tank: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<path d="M5 8h14v12H5z"/><path d="M5 12h14"/><path d="M8 5h8"/>
</svg>`,
  seat: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
  <path d="M5 20h14"/>
  <path d="M7 20V10l5-6 5 6v10"/>
  <path d="M10 20v-5h4v5"/>
  <circle cx="12" cy="12" r="1.5"/>
</svg>`,
  compose: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-1.4-1.4 2.1-2.1z"/>
</svg>`,
  research: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<path d="M4 5h7a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4V5z"/><path d="M20 5h-7a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h7V5z"/>
</svg>`,
  roster: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<path d="M12 22V12"/><path d="M7 8c3 1 5 3 5 4 0-1 2-3 5-4-2-3-5-4-5-4s-3 1-5 4z"/><path d="M9 14c2 .5 3 1.5 3 2 0-.5 1-1.5 3-2"/>
</svg>`,
  nutrient: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<path d="M12 3c-2 4-6 6-6 10a6 6 0 0 0 12 0c0-4-4-6-6-10z"/>
</svg>`,
  learning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<path d="M4 19V6l8-3 8 3v13"/><path d="M12 3v16"/><path d="M4 19l8 2 8-2"/>
</svg>`,
  analytics: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/>
</svg>`,
  history: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
</svg>`,
  alert: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<path d="M12 3L2 21h20L12 3z"/><path d="M12 10v4"/><path d="M12 17h.01"/>
</svg>`,
  ok: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>
</svg>`,
  settings: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
</svg>`,
  brand: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" aria-hidden="true" width="100%" height="100%">
  <rect x="4" y="4" width="56" height="56" rx="12" stroke="currentColor" stroke-width="3"/>
  <path d="M32 14c-6 10-14 14-14 24a14 14 0 0 0 28 0c0-10-8-14-14-24z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
  <path d="M32 38v12" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
</svg>`,
  wordmark: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 48" fill="none" aria-hidden="true" width="100%" height="100%">
  <text x="0" y="34" font-family="Segoe UI, ui-sans-serif, system-ui" font-size="32" font-weight="700" letter-spacing="0.12em" fill="currentColor">DSC-HUB</text>
</svg>`,
  gauge: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 70" fill="none" aria-hidden="true" width="100%" height="100%">
  <path d="M10 60 A50 50 0 0 1 110 60" stroke="currentColor" stroke-width="8" stroke-linecap="round" opacity="0.25"/>
  <path d="M10 60 A50 50 0 0 1 90 18" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>
</svg>`,
  more: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
  <circle cx="5" cy="12" r="2"/>
  <circle cx="12" cy="12" r="2"/>
  <circle cx="19" cy="12" r="2"/>
</svg>`,
  search: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="100%" height="100%">
  <circle cx="11" cy="11" r="7"/>
  <path d="M20 20l-3.5-3.5"/>
</svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
  <path d="M6 6l12 12"/>
  <path d="M18 6L6 18"/>
</svg>`,
  ops: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
</svg>`,
  plant: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<path d="M12 22v-7"/><path d="M12 15c-4 0-7-2.5-7-6 3 0 7 1.5 7 6z"/><path d="M12 15c4 0 7-2.5 7-6-3 0-7 1.5-7 6z"/><path d="M12 8c-2.5-3-1-5.5 0-6 1 .5 2.5 3 0 6z"/>
</svg>`,
  advanced: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
</svg>`,
  system: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/>
</svg>`,
  home: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<path d="M3 11.5L12 4l9 7.5"/><path d="M6 10.5V20h12v-9.5"/>
</svg>`,
  dash: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<path d="M4 19V5"/><path d="M4 19h16"/><path d="M7 15l3-4 3 2 4-6"/>
</svg>`,
  build: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-1.4-1.4 2.1-2.1z"/>
</svg>`,
  catalog: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<path d="M4 5h7a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4V5z"/><path d="M20 5h-7a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h7V5z"/>
</svg>`,
  strains: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<path d="M12 22V12"/><path d="M7 8c3 1 5 3 5 4 0-1 2-3 5-4-2-3-5-4-5-4s-3 1-5 4z"/><path d="M9 14c2 .5 3 1.5 3 2 0-.5 1-1.5 3-2"/>
</svg>`,
  strainIndica: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<path d="M12 21V11"/><path d="M7 9c2.5.8 4 2.5 5 3.5 1-1 2.5-2.7 5-3.5-1.8-2.2-4-3.2-5-3.2S8.8 6.8 7 9z"/><ellipse cx="12" cy="7" rx="3.2" ry="2.2"/>
</svg>`,
  strainSativa: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<path d="M12 22V10"/><path d="M12 10c-3.5-1-5.5-4-5.5-7 2.5 1 4.5 3.5 5.5 7z"/><path d="M12 10c3.5-1 5.5-4 5.5-7-2.5 1-4.5 3.5-5.5 7z"/><path d="M12 14c-2 .4-3.2 1.4-3.2 2.2"/><path d="M12 14c2 .4 3.2 1.4 3.2 2.2"/>
</svg>`,
  strainHybrid: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<path d="M12 22V12"/><path d="M7 8c3 1 5 3 5 4 0-1 2-3 5-4-2-3-5-4-5-4s-3 1-5 4z"/><path d="M8 16h8"/><path d="M10 18h4"/>
</svg>`,
  strainAuto: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<path d="M12 22V13"/><path d="M8 10c2 .8 3.5 2 4 2.8.5-.8 2-2 4-2.8-1.5-2-3.2-3-4-3s-2.5 1-4 3z"/><circle cx="17" cy="6" r="2.25"/><path d="M17 4.2V3M17 9v-.8M15.2 6H14M20 6h-.8"/>
</svg>`,
  trends: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/>
</svg>`
};
function $Z(n) {
  return WZ[n];
}
const uV = j.createContext(null), XZ = /* @__PURE__ */ new Set([
  "input_boolean",
  "input_number",
  "input_select",
  "input_text",
  "input_datetime",
  "input_button"
]);
function YZ(n) {
  if (!n) return !1;
  const e = n.toLowerCase(), t = e.indexOf("."), i = t >= 0 ? e.slice(0, t) : "", r = t >= 0 ? e.slice(t + 1) : e;
  return r.startsWith("dsc_") || r.startsWith("dsc-") || r.includes("_dsc_") || e.includes("dsc_") || e.includes("dsc-") ? !0 : XZ.has(i) ? r.startsWith("dsc_") || r.includes("dsc_") : e.startsWith("sensor.dsc") || e.startsWith("switch.dsc") || e.startsWith("binary_sensor.dsc") || e.startsWith("number.dsc") || e.startsWith("light.dsc") || e.startsWith("fan.dsc") || e.startsWith("select.dsc") || e.startsWith("text.dsc") || e.startsWith("datetime.dsc") || e.startsWith("time.dsc");
}
const qZ = 150;
function ZZ({
  hass: n,
  revision: e = 0,
  children: t
}) {
  const [i, r] = j.useState(0), a = j.useRef(null), s = j.useRef(n);
  j.useLayoutEffect(() => {
    s.current = n;
  }, [n]);
  const o = n?.connection, l = !!n, c = () => {
    a.current || (a.current = setTimeout(() => {
      a.current = null, r((v) => v + 1);
    }, qZ));
  };
  j.useEffect(() => () => {
    a.current && (clearTimeout(a.current), a.current = null);
  }, []), j.useEffect(() => {
    l && c();
  }, [l]), j.useEffect(() => {
    e > 0 && c();
  }, [e]), j.useEffect(() => {
    if (!o?.subscribeEvents) return;
    let v, y = !1;
    const w = (S) => {
      const x = S.data?.entity_id;
      YZ(x) && c();
    };
    return Promise.resolve(o.subscribeEvents(w, "state_changed")).then((S) => {
      if (y) {
        S();
        return;
      }
      v = S;
    }).catch(() => {
    }), () => {
      y = !0, v?.(), a.current && (clearTimeout(a.current), a.current = null);
    };
  }, [o]);
  const d = j.useMemo(
    () => (v, y, w) => {
      const S = s.current;
      return S?.callService ? S.callService(v, y, w) : Promise.resolve(null);
    },
    []
  ), h = j.useMemo(
    () => (v) => {
      const y = s.current;
      if (y?.callWS) return y.callWS(v);
      const w = y?.connection;
      return w?.sendMessagePromise ? w.sendMessagePromise(v) : Promise.resolve(null);
    },
    []
  ), p = j.useMemo(() => {
    const v = (x) => s.current?.states?.[x], y = (x) => {
      const E = v(x)?.state;
      return E === void 0 ? !1 : E !== "unavailable" && E !== "unknown";
    }, w = (x, E = "—") => y(x) ? v(x)?.state ?? E : E, S = (x, E = NaN) => {
      if (!y(x)) return E;
      const C = Number(v(x)?.state);
      return Number.isFinite(C) ? C : E;
    };
    return { hass: s.current, entity: v, state: w, num: S, available: y, callService: d, callWS: h, tick: i };
  }, [i, d, h]);
  return j.createElement(uV.Provider, { value: p }, t);
}
function vA() {
  const n = j.useContext(uV);
  if (!n) throw new Error("useHass outside HassProvider");
  return n;
}
const VL = (n) => ({
  seat_id: n,
  online: !1,
  firmware: null,
  values: {},
  last_seen: null
}), pf = {
  version: "7.0.0.0",
  surface: "7.0.0",
  expected_firmware: "7.0.0.0",
  hub: VL("hub"),
  panel: VL("panel"),
  pots: {},
  sonoffs: {},
  canopy: {},
  system: {},
  updated_at: 0
};
function Uw(n, e) {
  if (!n || typeof n != "object") return VL(e);
  const t = n;
  return {
    seat_id: String(t.seat_id ?? e),
    online: !!t.online,
    firmware: t.firmware != null ? String(t.firmware) : null,
    values: t.values ?? {},
    last_seen: typeof t.last_seen == "number" ? t.last_seen : null
  };
}
function dV(n) {
  if (!n) return { ...pf };
  const e = {}, t = n.pots;
  if (t)
    for (const [s, o] of Object.entries(t))
      e[s] = Uw(o, s);
  const i = {}, r = n.sonoffs;
  if (r)
    for (const [s, o] of Object.entries(r))
      i[s] = Uw(o, s);
  const a = Array.isArray(n.inventory) ? n.inventory : void 0;
  return {
    version: String(n.version ?? pf.version),
    surface: String(n.surface ?? pf.surface),
    expected_firmware: String(n.expected_firmware ?? pf.expected_firmware),
    hub: Uw(n.hub, "hub"),
    panel: Uw(n.panel, "panel"),
    pots: e,
    sonoffs: i,
    canopy: n.canopy ?? {},
    system: n.system ?? {},
    updated_at: typeof n.updated_at == "number" ? n.updated_at : 0,
    inventory: a,
    root_steering: n.root_steering && typeof n.root_steering == "object" ? n.root_steering : void 0
  };
}
function KZ(n) {
  const e = n.hub.values;
  return {
    temp_c: e.temp_c != null ? Number(e.temp_c) : null,
    rh_pct: e.rh_pct != null ? Number(e.rh_pct) : null,
    vpd_kpa: e.vpd_kpa != null ? Number(e.vpd_kpa) : e.vd_kpa != null ? Number(e.vd_kpa) : null,
    heartbeat: e.heartbeat ?? null,
    uptime: e.uptime ?? null
  };
}
function QZ(n, e) {
  const t = n.hub.values;
  return e === "clone" ? {
    temp_c: t.clone_temp_c != null ? Number(t.clone_temp_c) : null,
    rh_pct: t.clone_rh_pct != null ? Number(t.clone_rh_pct) : null,
    vpd_kpa: t.clone_vpd_kpa != null ? Number(t.clone_vpd_kpa) : t.clone_vd_kpa != null ? Number(t.clone_vd_kpa) : null
  } : {
    temp_c: t.temp_c != null ? Number(t.temp_c) : null,
    rh_pct: t.rh_pct != null ? Number(t.rh_pct) : null,
    vpd_kpa: t.vpd_kpa != null ? Number(t.vpd_kpa) : t.vd_kpa != null ? Number(t.vd_kpa) : null
  };
}
function Mm(n, e, t = !1) {
  const i = n.inventory?.find((r) => r.seat_id === e);
  return i && i.in_service != null ? !!i.in_service : t;
}
const CS = {
  "sensor.dsc_hub_tent_temperature": { seatId: "hub", metric: "temp_c" },
  "sensor.dsc_hub_temperature": { seatId: "hub", metric: "temp_c" },
  "sensor.dsc_hub_tent_humidity": { seatId: "hub", metric: "rh_pct" },
  "sensor.dsc_hub_humidity": { seatId: "hub", metric: "rh_pct" },
  "sensor.dsc_hub_vpd_kpa": { seatId: "hub", metric: "vpd_kpa" },
  "sensor.dsc_hub_vpd": { seatId: "hub", metric: "vpd_kpa" },
  "sensor.dsc_hub_heartbeat": { seatId: "hub", metric: "heartbeat" },
  "sensor.dsc_hub_uptime": { seatId: "hub", metric: "uptime" },
  "sensor.dsc_hub_room_temperature": { seatId: "hub", metric: "room_temp_c" },
  "sensor.dsc_hub_room_humidity": { seatId: "hub", metric: "room_rh_pct" },
  "sensor.dsc_hub_room_vpd_kpa": { seatId: "hub", metric: "room_vpd_kpa" },
  "sensor.dsc_hub_room_vpd": { seatId: "hub", metric: "room_vpd_kpa" },
  "sensor.dsc_hub_clone_temperature": { seatId: "hub", metric: "clone_temp_c" },
  "sensor.dsc_hub_clone_humidity": { seatId: "hub", metric: "clone_rh_pct" },
  "sensor.dsc_hub_clone_vpd_kpa": { seatId: "hub", metric: "clone_vpd_kpa" },
  "sensor.dsc_hub_clone_vpd": { seatId: "hub", metric: "clone_vpd_kpa" },
  "sensor.dsc_coldest_root_zone_temp": { seatId: "hub", metric: "coldest_root_c" },
  "sensor.dsc_hub_humidifier_fire_countdown": { seatId: "hub", metric: "humidifier_fire_countdown" },
  "sensor.dsc_hub_dehumidifier_fire_countdown": { seatId: "hub", metric: "dehumidifier_fire_countdown" },
  "sensor.dsc_hub_heater_fire_countdown": { seatId: "hub", metric: "heater_fire_countdown" },
  "sensor.dsc_hub_ac_fire_countdown": { seatId: "hub", metric: "ac_fire_countdown" },
  "sensor.dsc_hub_grow_mat_fire_countdown": { seatId: "hub", metric: "grow_mat_fire_countdown" },
  "sensor.dsc_hub_clone_humidifier_fire_countdown": { seatId: "hub", metric: "clone_humidifier_fire_countdown" },
  "sensor.dsc_hub_firmware_version": { seatId: "hub", metric: "firmware_version" },
  "sensor.dsc_probe1_got_moisture": { seatId: "pot1", metric: "moisture_pct" },
  "sensor.dsc_probe1_soil_moisture": { seatId: "pot1", metric: "moisture_pct" },
  "sensor.dsc_probe2_soil_moisture": { seatId: "pot2", metric: "moisture_pct" },
  "sensor.dsc_probe2_got_moisture": { seatId: "pot2", metric: "moisture_pct" },
  "sensor.dsc_probe3_soil_moisture": { seatId: "pot3", metric: "moisture_pct" },
  "sensor.dsc_probe3_got_moisture": { seatId: "pot3", metric: "moisture_pct" },
  "sensor.dsc_probe4_soil_moisture": { seatId: "pot4", metric: "moisture_pct" },
  "sensor.dsc_probe4_got_moisture": { seatId: "pot4", metric: "moisture_pct" },
  "sensor.dsc_probe1_soil_temperature": { seatId: "pot1", metric: "soil_temp_c" },
  "sensor.dsc_probe2_soil_temperature": { seatId: "pot2", metric: "soil_temp_c" },
  "sensor.dsc_probe3_soil_temperature": { seatId: "pot3", metric: "soil_temp_c" },
  "sensor.dsc_probe4_soil_temperature": { seatId: "pot4", metric: "soil_temp_c" },
  "sensor.dsc_probe1_soil_ec": { seatId: "pot1", metric: "ec_us" },
  "sensor.dsc_probe2_soil_ec": { seatId: "pot2", metric: "ec_us" },
  "sensor.dsc_probe3_soil_ec": { seatId: "pot3", metric: "ec_us" },
  "sensor.dsc_probe4_soil_ec": { seatId: "pot4", metric: "ec_us" },
  "sensor.dsc_probe1_got_ec": { seatId: "pot1", metric: "ec_us" },
  "sensor.dsc_probe2_got_ec": { seatId: "pot2", metric: "ec_us" },
  "sensor.dsc_probe3_got_ec": { seatId: "pot3", metric: "ec_us" },
  "sensor.dsc_probe4_got_ec": { seatId: "pot4", metric: "ec_us" },
  "sensor.dsc_probe1_soil_conductivity": { seatId: "pot1", metric: "ec_us" },
  "sensor.dsc_probe2_soil_conductivity": { seatId: "pot2", metric: "ec_us" },
  "sensor.dsc_probe3_soil_conductivity": { seatId: "pot3", metric: "ec_us" },
  "sensor.dsc_probe4_soil_conductivity": { seatId: "pot4", metric: "ec_us" },
  "sensor.dsc_probe1_soil_ph": { seatId: "pot1", metric: "ph" },
  "sensor.dsc_probe2_soil_ph": { seatId: "pot2", metric: "ph" },
  "sensor.dsc_probe3_soil_ph": { seatId: "pot3", metric: "ph" },
  "sensor.dsc_probe4_soil_ph": { seatId: "pot4", metric: "ph" },
  "sensor.dsc_probe1_got_ph": { seatId: "pot1", metric: "ph" },
  "sensor.dsc_probe2_got_ph": { seatId: "pot2", metric: "ph" },
  "sensor.dsc_probe3_got_ph": { seatId: "pot3", metric: "ph" },
  "sensor.dsc_probe4_got_ph": { seatId: "pot4", metric: "ph" },
  "sensor.dsc_probe1_dryback_pct": { seatId: "pot1", metric: "dryback_pct" },
  "sensor.dsc_probe2_dryback_pct": { seatId: "pot2", metric: "dryback_pct" },
  "sensor.dsc_probe3_dryback_pct": { seatId: "pot3", metric: "dryback_pct" },
  "sensor.dsc_probe4_dryback_pct": { seatId: "pot4", metric: "dryback_pct" },
  "sensor.dsc_probe1_soil_moisture_rate": { seatId: "pot1", metric: "moisture_rate" },
  "sensor.dsc_probe2_soil_moisture_rate": { seatId: "pot2", metric: "moisture_rate" },
  "sensor.dsc_probe3_soil_moisture_rate": { seatId: "pot3", metric: "moisture_rate" },
  "sensor.dsc_probe4_soil_moisture_rate": { seatId: "pot4", metric: "moisture_rate" },
  // Match brain / ESPHome pot values keys (nitrogen|phosphorus|potassium), not short n|p|k.
  "sensor.dsc_probe1_soil_nitrogen": { seatId: "pot1", metric: "nitrogen" },
  "sensor.dsc_probe2_soil_nitrogen": { seatId: "pot2", metric: "nitrogen" },
  "sensor.dsc_probe3_soil_nitrogen": { seatId: "pot3", metric: "nitrogen" },
  "sensor.dsc_probe4_soil_nitrogen": { seatId: "pot4", metric: "nitrogen" },
  "sensor.dsc_probe1_soil_phosphorus": { seatId: "pot1", metric: "phosphorus" },
  "sensor.dsc_probe2_soil_phosphorus": { seatId: "pot2", metric: "phosphorus" },
  "sensor.dsc_probe3_soil_phosphorus": { seatId: "pot3", metric: "phosphorus" },
  "sensor.dsc_probe4_soil_phosphorus": { seatId: "pot4", metric: "phosphorus" },
  "sensor.dsc_probe1_soil_potassium": { seatId: "pot1", metric: "potassium" },
  "sensor.dsc_probe2_soil_potassium": { seatId: "pot2", metric: "potassium" },
  "sensor.dsc_probe3_soil_potassium": { seatId: "pot3", metric: "potassium" },
  "sensor.dsc_probe4_soil_potassium": { seatId: "pot4", metric: "potassium" },
  "binary_sensor.dsc_probe1_clock_valid": { seatId: "pot1", metric: "clock_valid", binary: !0 },
  "binary_sensor.dsc_probe2_clock_valid": { seatId: "pot2", metric: "clock_valid", binary: !0 },
  "binary_sensor.dsc_probe3_clock_valid": { seatId: "pot3", metric: "clock_valid", binary: !0 },
  "binary_sensor.dsc_probe4_clock_valid": { seatId: "pot4", metric: "clock_valid", binary: !0 },
  "binary_sensor.dsc_probe1_modbus_probe_online": { seatId: "pot1", metric: "modbus_probe_online", binary: !0 },
  "binary_sensor.dsc_probe2_modbus_probe_online": { seatId: "pot2", metric: "modbus_probe_online", binary: !0 },
  "binary_sensor.dsc_probe3_modbus_probe_online": { seatId: "pot3", metric: "modbus_probe_online", binary: !0 },
  "binary_sensor.dsc_probe4_modbus_probe_online": { seatId: "pot4", metric: "modbus_probe_online", binary: !0 },
  "binary_sensor.dsc_probe1_sensor_fault": { seatId: "pot1", metric: "sensor_fault", binary: !0 },
  "binary_sensor.dsc_probe2_sensor_fault": { seatId: "pot2", metric: "sensor_fault", binary: !0 },
  "binary_sensor.dsc_probe3_sensor_fault": { seatId: "pot3", metric: "sensor_fault", binary: !0 },
  "binary_sensor.dsc_probe4_sensor_fault": { seatId: "pot4", metric: "sensor_fault", binary: !0 },
  "switch.dsc_heater_main_relay": { seatId: "heater", metric: "relay_on", binary: !0 },
  "switch.dsc_heatmat_main_relay": { seatId: "heatmat", metric: "relay_on", binary: !0 },
  "switch.dsc_humidifier_main_relay": { seatId: "humidifier", metric: "relay_on", binary: !0 },
  "switch.dsc_de_humidifier_main_relay": { seatId: "dehumidifier", metric: "relay_on", binary: !0 }
};
function hV(n, e) {
  return e === "hub" ? n.hub.values : e === "panel" ? n.panel.values : e.startsWith("pot") ? n.pots[e]?.values : n.sonoffs[e]?.values;
}
function AS(n, e) {
  const t = CS[n];
  if (!t) return null;
  const i = hV(e, t.seatId);
  if (!i) return null;
  let r = i[t.metric];
  if (t.binary && t.seatId.startsWith("pot") && r == null && (r = i.binaries?.[t.metric]), r == null) return null;
  if (t.binary) return r === !0 || r === "on" || r === 1 || r === "1" ? 1 : 0;
  const a = Number(r);
  return Number.isFinite(a) ? a : null;
}
function JZ(n, e) {
  const t = CS[n];
  if (!t) return null;
  const i = AS(n, e);
  return i == null || !Number.isFinite(i) ? null : t.binary ? i > 0 ? "on" : "off" : String(i);
}
function eK(n, e) {
  const t = CS[n];
  if (!t) return !1;
  if (t.binary) {
    const i = hV(e, t.seatId);
    if (!i) return !1;
    let r = i[t.metric];
    return r == null && t.seatId.startsWith("pot") && (r = i.binaries?.[t.metric]), r != null;
  }
  return AS(n, e) != null;
}
function o3(n, e) {
  const t = CS[n];
  if (!t) return !1;
  if (t.seatId === "hub") return e.hub.online;
  if (t.seatId === "panel") return e.panel.online;
  if (t.seatId.startsWith("pot")) {
    const i = !!e.pots[t.seatId]?.online;
    return t.metric === "dryback_pct" || t.metric === "moisture_rate" || t.metric === "nitrogen" || t.metric === "phosphorus" || t.metric === "potassium" ? i && eK(n, e) : i;
  }
  return !!e.sonoffs[t.seatId]?.online;
}
function tK(n) {
  return !n.hub.online;
}
const fV = {
  ac: "input_boolean.dsc_ac_in_service",
  mister: "input_boolean.dsc_clone_humidifier_in_service",
  pot1: "input_boolean.dsc_probe1_in_service",
  pot2: "input_boolean.dsc_probe2_in_service",
  pot3: "input_boolean.dsc_probe3_in_service",
  pot4: "input_boolean.dsc_probe4_in_service",
  tank: "input_boolean.dsc_tank_in_service"
}, pV = {
  heater: "sensor.dsc_heater_firmware_version",
  heatmat: "sensor.dsc_heatmat_firmware_version",
  humidifier: "sensor.dsc_humidifier_firmware_version",
  dehumidifier: "sensor.dsc_dehumidifier_firmware_version"
};
function Ds(n, e) {
  return n.states[e]?.state ?? "unavailable";
}
function as(n, e) {
  const t = n.states[e]?.state;
  return t != null && t !== "unavailable" && t !== "unknown";
}
function Vr(n, e) {
  const t = Number(Ds(n, e));
  return Number.isFinite(t) ? t : null;
}
function nK(n, e) {
  if (!n) return { ...pf, inventory: e };
  const i = as(n, "binary_sensor.dsc_hub_link") && Ds(n, "binary_sensor.dsc_hub_link") === "on", r = {
    seat_id: "hub",
    online: i,
    firmware: as(n, "sensor.dsc_hub_firmware_version") ? Ds(n, "sensor.dsc_hub_firmware_version") : null,
    values: {
      temp_c: Vr(n, "sensor.dsc_hub_tent_temperature") ?? Vr(n, "sensor.dsc_hub_temperature"),
      rh_pct: Vr(n, "sensor.dsc_hub_tent_humidity") ?? Vr(n, "sensor.dsc_hub_humidity"),
      vpd_kpa: Vr(n, "sensor.dsc_hub_vpd_kpa") ?? Vr(n, "sensor.dsc_hub_vpd"),
      heartbeat: as(n, "sensor.dsc_hub_heartbeat") ? Ds(n, "sensor.dsc_hub_heartbeat") : null,
      uptime: as(n, "sensor.dsc_hub_uptime") ? Ds(n, "sensor.dsc_hub_uptime") : null
    },
    last_seen: i ? Date.now() / 1e3 : null
  }, a = as(n, "binary_sensor.dsc_hub_panel_link") && Ds(n, "binary_sensor.dsc_hub_panel_link") === "on", s = {
    seat_id: "panel",
    online: a,
    firmware: as(n, "sensor.dsc_control_firmware_version") ? Ds(n, "sensor.dsc_control_firmware_version") : null,
    values: {},
    last_seen: a ? Date.now() / 1e3 : null
  }, o = {};
  for (const p of [1, 2, 3, 4]) {
    const v = `pot${p}`, y = `sensor.dsc_probe${p}_firmware_version`, w = as(n, y);
    o[v] = {
      seat_id: v,
      online: w,
      firmware: w ? Ds(n, y) : null,
      values: {
        moisture_pct: Vr(n, `sensor.dsc_probe${p}_got_moisture`) ?? Vr(n, `sensor.dsc_probe${p}_soil_moisture`),
        soil_temp_c: Vr(n, `sensor.dsc_probe${p}_soil_temperature`),
        ec_us: Vr(n, `sensor.dsc_probe${p}_got_ec`) ?? Vr(n, `sensor.dsc_probe${p}_soil_conductivity`) ?? Vr(n, `sensor.dsc_probe${p}_soil_ec`),
        ph: Vr(n, `sensor.dsc_probe${p}_got_ph`) ?? Vr(n, `sensor.dsc_probe${p}_soil_ph`),
        nitrogen: Vr(n, `sensor.dsc_probe${p}_soil_nitrogen`),
        phosphorus: Vr(n, `sensor.dsc_probe${p}_soil_phosphorus`),
        potassium: Vr(n, `sensor.dsc_probe${p}_soil_potassium`),
        dryback_pct: Vr(n, `sensor.dsc_probe${p}_dryback_pct`),
        moisture_rate: Vr(n, `sensor.dsc_probe${p}_soil_moisture_rate`)
      },
      last_seen: w ? Date.now() / 1e3 : null
    };
  }
  const l = {}, c = {
    heater: "switch.dsc_heater_main_relay",
    heatmat: "switch.dsc_heatmat_main_relay",
    humidifier: "switch.dsc_humidifier_main_relay",
    dehumidifier: "switch.dsc_de_humidifier_main_relay"
  };
  for (const [p, v] of Object.entries(c)) {
    const y = pV[p], w = as(n, v) || as(n, y);
    l[p] = {
      seat_id: p,
      online: w,
      firmware: y && as(n, y) ? Ds(n, y) : null,
      values: {
        relay_on: as(n, v) ? Ds(n, v) === "on" : null
      },
      last_seen: w ? Date.now() / 1e3 : null
    };
  }
  const d = e ?? Object.entries(fV).map(([p, v]) => ({
    seat_id: p,
    in_service: as(n, v) ? Ds(n, v) === "on" : !1
  })), h = {};
  return as(n, "sensor.dsc_canopy_temperature") && (h.temp_c = Vr(n, "sensor.dsc_canopy_temperature")), as(n, "sensor.dsc_canopy_humidity") && (h.rh_pct = Vr(n, "sensor.dsc_canopy_humidity")), {
    version: Ds(n, "sensor.dsc_fleet_version_status") || pf.version,
    surface: Ds(n, "sensor.dsc_ha_surface_version") || pf.surface,
    expected_firmware: pf.expected_firmware,
    hub: r,
    panel: s,
    pots: o,
    sonoffs: l,
    canopy: h,
    system: {
      appliance_link: as(n, "binary_sensor.dsc_pi_appliance_link") && Ds(n, "binary_sensor.dsc_pi_appliance_link") === "on",
      reduced_kit: as(n, "binary_sensor.dsc_reduced_kit") && Ds(n, "binary_sensor.dsc_reduced_kit") === "on"
    },
    updated_at: Date.now() / 1e3,
    inventory: d
  };
}
function iK(n) {
  const e = {}, t = (o, l, c = !0) => {
    e[o] = {
      entity_id: o,
      state: c ? l : "unavailable",
      attributes: {},
      last_changed: (/* @__PURE__ */ new Date()).toISOString()
    };
  }, i = n.hub.values;
  t("binary_sensor.dsc_hub_link", n.hub.online ? "on" : "off", !0), t("binary_sensor.dsc_hub_panel_link", n.panel.online ? "on" : "off", !0), i.temp_c != null && (t("sensor.dsc_hub_tent_temperature", String(i.temp_c), n.hub.online), t("sensor.dsc_hub_temperature", String(i.temp_c), n.hub.online)), i.rh_pct != null && (t("sensor.dsc_hub_tent_humidity", String(i.rh_pct), n.hub.online), t("sensor.dsc_hub_humidity", String(i.rh_pct), n.hub.online)), i.vpd_kpa != null && (t("sensor.dsc_hub_vpd_kpa", String(i.vpd_kpa), n.hub.online), t("sensor.dsc_hub_vpd", String(i.vpd_kpa), n.hub.online)), i.heartbeat != null && t("sensor.dsc_hub_heartbeat", String(i.heartbeat), n.hub.online), i.uptime != null && t("sensor.dsc_hub_uptime", String(i.uptime), n.hub.online), n.hub.firmware && t("sensor.dsc_hub_firmware_version", n.hub.firmware, n.hub.online), n.panel.firmware && t("sensor.dsc_control_firmware_version", n.panel.firmware, n.panel.online), t("sensor.dsc_ha_surface_version", n.surface), t("sensor.dsc_fleet_version_status", n.version), t("sensor.dsc_active_alert_count", "0"), t("binary_sensor.dsc_pi_appliance_link", n.system.appliance_link ? "on" : "off", !0), t("binary_sensor.dsc_reduced_kit", n.system.reduced_kit ? "on" : "off", !0);
  const r = n.hub.online;
  if (i.room_temp_c != null && t("sensor.dsc_hub_room_temperature", String(i.room_temp_c), r), i.room_rh_pct != null && t("sensor.dsc_hub_room_humidity", String(i.room_rh_pct), r), i.room_temp_c != null && i.room_rh_pct != null) {
    const o = rK(Number(i.room_temp_c), Number(i.room_rh_pct));
    Number.isFinite(o) && (t("sensor.dsc_hub_room_vpd_kpa", o.toFixed(2), r), t("sensor.dsc_hub_room_vpd", o.toFixed(2), r));
  }
  i.clone_temp_c != null && t("sensor.dsc_hub_clone_temperature", String(i.clone_temp_c), r), i.clone_rh_pct != null && t("sensor.dsc_hub_clone_humidity", String(i.clone_rh_pct), r), i.clone_vpd_kpa != null && (t("sensor.dsc_hub_clone_vpd_kpa", String(i.clone_vpd_kpa), r), t("sensor.dsc_hub_clone_vpd", String(i.clone_vpd_kpa), r)), i.leaf_vpd_kpa != null && t("sensor.dsc_leaf_vpd_kpa", String(i.leaf_vpd_kpa), r), i.clone_leaf_vpd_kpa != null && t("sensor.dsc_clone_leaf_vpd_kpa", String(i.clone_leaf_vpd_kpa), r);
  const a = i.binaries;
  if (a)
    for (const [o, l] of Object.entries(a))
      t(o, l ? "on" : "off", r);
  for (const [o, l] of Object.entries(fV)) {
    const c = aK(n, o);
    t(l, c ? "on" : "off");
  }
  for (const [o, l] of Object.entries(n.pots)) {
    const c = o.replace("pot", ""), d = l.online, h = l.values.moisture_pct;
    if (h != null) {
      const k = String(h);
      t(`sensor.dsc_probe${c}_soil_moisture`, k, d), t(`sensor.dsc_probe${c}_got_moisture`, k, d);
    }
    const p = l.values.soil_temp_c;
    p != null && t(`sensor.dsc_probe${c}_soil_temperature`, String(p), d);
    const v = l.values.ec_us;
    v != null && (t(`sensor.dsc_probe${c}_soil_ec`, String(v), d), t(`sensor.dsc_probe${c}_soil_conductivity`, String(v), d), t(`sensor.dsc_probe${c}_got_ec`, String(v), d));
    const y = l.values.ph;
    y != null && (t(`sensor.dsc_probe${c}_soil_ph`, String(y), d), t(`sensor.dsc_probe${c}_got_ph`, String(y), d));
    const w = l.values.nitrogen ?? l.values.n;
    w != null && t(`sensor.dsc_probe${c}_soil_nitrogen`, String(w), d);
    const S = l.values.phosphorus ?? l.values.p;
    S != null && t(`sensor.dsc_probe${c}_soil_phosphorus`, String(S), d);
    const x = l.values.potassium ?? l.values.k;
    x != null && t(`sensor.dsc_probe${c}_soil_potassium`, String(x), d);
    const E = l.values.dryback_pct;
    E != null && t(`sensor.dsc_probe${c}_dryback_pct`, String(E), d);
    const C = l.values.moisture_rate;
    C != null && t(`sensor.dsc_probe${c}_soil_moisture_rate`, String(C), d), l.firmware && t(`sensor.dsc_probe${c}_firmware_version`, l.firmware, d);
    const A = l.values.binaries;
    A && (A.clock_valid != null && t(`binary_sensor.dsc_probe${c}_clock_valid`, A.clock_valid ? "on" : "off", d), A.modbus_probe_online != null && t(
      `binary_sensor.dsc_probe${c}_modbus_probe_online`,
      A.modbus_probe_online ? "on" : "off",
      d
    ), A.sensor_fault != null && t(`binary_sensor.dsc_probe${c}_sensor_fault`, A.sensor_fault ? "on" : "off", d));
  }
  for (const [o, l] of Object.entries(n.sonoffs)) {
    const d = {
      heater: "switch.dsc_heater_main_relay",
      heatmat: "switch.dsc_heatmat_main_relay",
      humidifier: "switch.dsc_humidifier_main_relay",
      dehumidifier: "switch.dsc_de_humidifier_main_relay"
    }[o];
    d && l.values.relay_on != null && t(d, l.values.relay_on ? "on" : "off", l.online);
    const h = pV[o];
    h && l.firmware && t(h, l.firmware, l.online);
  }
  const s = n.hub.values.controls;
  if (s)
    for (const [o, l] of Object.entries(s)) {
      const c = {};
      l.options?.length && (c.options = l.options), l.percentage != null && (c.percentage = l.percentage), l.brightness != null && (c.brightness = l.brightness), e[o] = {
        entity_id: o,
        state: n.hub.online ? l.state : "unavailable",
        attributes: c,
        last_changed: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
  return e;
}
function rK(n, e) {
  if (!Number.isFinite(n) || !Number.isFinite(e) || e <= 0) return NaN;
  const t = 0.6108 * Math.exp(17.27 * n / (n + 237.3)), i = t * (e / 100);
  return t - i;
}
function aK(n, e) {
  return Mm(n, e, !1);
}
function sK(n, e) {
  if (!e) return n;
  const t = { ...n.hub.values }, i = { ...n.pots };
  for (const [r, a] of Object.entries(CS)) {
    const s = e[r];
    if (!s || s.state === "unavailable" || s.state === "unknown") continue;
    const o = s.state, l = Number(o);
    if (!Number.isFinite(l) && a.binary !== !0) continue;
    const c = a.binary ? o === "on" || o === "1" || o === "true" : l;
    if (a.seatId === "hub") {
      t[a.metric] == null && (t[a.metric] = c);
      continue;
    }
    if (a.seatId.startsWith("pot")) {
      const d = i[a.seatId];
      if (!d || d.values[a.metric] != null) continue;
      i[a.seatId] = {
        ...d,
        values: { ...d.values, [a.metric]: c }
      };
    }
  }
  return {
    ...n,
    hub: { ...n.hub, values: t },
    pots: i
  };
}
const mV = j.createContext(null);
function oK({
  children: n,
  fleetRaw: e,
  hass: t,
  tick: i = 0,
  source: r,
  loading: a = !1,
  error: s = null,
  refresh: o,
  inventory: l
}) {
  const c = j.useMemo(() => {
    if (r === "pi" && e) {
      let h = dV(e);
      const p = e.hass_states;
      return h = sK(h, p), Array.isArray(e?.inventory) ? { ...h, inventory: e.inventory } : l?.length ? { ...h, inventory: l } : h;
    }
    return nK(t ?? null, l);
  }, [r, e, t, l, i]), d = j.useMemo(
    () => ({ fleet: c, tick: i, source: r, loading: a, error: s, refresh: o }),
    [c, i, r, a, s, o]
  );
  return /* @__PURE__ */ g.jsx(mV.Provider, { value: d, children: n });
}
function l3() {
  const n = j.useContext(mV);
  if (!n) throw new Error("useFleet outside FleetProvider");
  return n;
}
function Pr() {
  return l3().fleet;
}
function lK() {
  return l3().tick;
}
function qd() {
  return l3().source;
}
function vV() {
  const n = Pr();
  return { ...KZ(n), online: n.hub.online };
}
function cK(n) {
  const e = Pr();
  return { ...QZ(e, n), online: e.hub.online };
}
function c3(n) {
  const e = n.hub.values.controls;
  if (!(!e || typeof e != "object"))
    return e;
}
function $T(n, e) {
  return e.hub.online ? c3(e)?.[n]?.state ?? null : null;
}
function gV(n, e) {
  return e.hub.online && !!c3(e)?.[n];
}
function _V(n, e) {
  const t = c3(e)?.[n];
  if (!t) return {};
  const i = {};
  return t.options?.length && (i.options = t.options), t.percentage != null && (i.percentage = t.percentage), t.brightness != null && (i.brightness = t.brightness), i;
}
function wn() {
  const n = vA(), e = Pr(), t = qd(), i = j.useMemo(
    () => t === "pi" ? iK(e) : null,
    [t, e]
  );
  return j.useMemo(() => t !== "pi" ? n : { ...n, entity: (l) => {
    const c = n.entity(l);
    if (c) return c;
    const d = $T(l, e);
    return d != null ? {
      entity_id: l,
      state: d,
      attributes: _V(l, e),
      last_changed: (/* @__PURE__ */ new Date()).toISOString()
    } : i?.[l];
  }, available: (l) => gV(l, e) || o3(l, e) ? !0 : n.available(l), state: (l, c = "—") => {
    const d = $T(l, e);
    if (d != null) return d;
    const h = JZ(l, e);
    return h ?? n.state(l, c);
  }, num: (l, c = NaN) => {
    const d = $T(l, e);
    if (d != null) {
      const p = Number(d);
      if (Number.isFinite(p)) return p;
    }
    const h = AS(l, e);
    return h != null && Number.isFinite(h) ? h : n.num(l, c);
  } }, [n, e, t, i]);
}
function vy(n, e = "Request failed") {
  const t = (n || "").trim();
  if (!t) return e;
  try {
    const i = JSON.parse(t), r = i.detail ?? i.message;
    if (typeof r == "string" && r.trim()) return r.trim();
    if (Array.isArray(r)) {
      const a = r.map((s) => typeof s == "string" ? s : s && typeof s == "object" && "msg" in s ? String(s.msg) : "").filter(Boolean);
      if (a.length) return a.join("; ");
    }
  } catch {
  }
  return t.length > 180 ? `${t.slice(0, 177)}…` : t;
}
async function uK(n, e = 6) {
  const t = await fetch(`/history?entity_id=${encodeURIComponent(n)}&hours=${e}`);
  return t.ok ? (await t.json()).points ?? [] : [];
}
async function dK(n = 24, e = 100) {
  const t = await fetch(`/grow-log?hours=${n}&limit=${e}`);
  return t.ok ? (await t.json()).events ?? [] : [];
}
async function hK(n, e, t = {}) {
  const i = await fetch("/control/service", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain: n, service: e, data: t })
  });
  if (!i.ok) {
    const r = await i.text();
    throw new Error(r || "service call failed");
  }
  return i.json();
}
async function fK(n, e) {
  const t = await fetch("/control/demand", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ seat: n, on: e })
  });
  if (!t.ok) {
    const i = await t.text();
    throw new Error(i || "demand call failed");
  }
  return t.json();
}
async function pK() {
  const n = await fetch("/fleet");
  if (!n.ok) throw new Error("fleet fetch failed");
  return n.json();
}
async function mK() {
  const n = await fetch("/settings");
  if (!n.ok) throw new Error("settings fetch failed");
  return n.json();
}
async function i4(n) {
  if (!(await fetch("/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ settings: n })
  })).ok) throw new Error("settings patch failed");
}
async function GL(n, e) {
  const t = await fetch(`/settings/inventory/${n}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(e)
  });
  if (!t.ok) throw new Error("inventory patch failed");
  return t.json();
}
async function vK() {
  const n = await fetch("/settings/network");
  if (!n.ok) throw new Error("network status failed");
  return n.json();
}
async function gK() {
  const n = await fetch("/settings/network/apply", { method: "POST" });
  if (!n.ok) throw new Error("network apply failed");
  return n.json();
}
async function IN() {
  const n = await fetch("/settings/catalog/status");
  if (!n.ok) throw new Error("catalog status failed");
  return n.json();
}
async function _K() {
  const n = await fetch("/admin/reload-catalogs", { method: "POST" });
  if (!n.ok) throw new Error("catalog reload failed");
  return n.json();
}
async function yK() {
  const n = await fetch("/settings/esphome/devices");
  if (!n.ok) throw new Error("esphome devices failed");
  return n.json();
}
async function bK(n, e) {
  const t = await fetch("/settings/esphome/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ seat_id: n, action: e })
  });
  if (!t.ok) throw new Error("esphome job failed");
  return t.json();
}
async function xK() {
  const n = await fetch("/settings/esphome/jobs");
  if (!n.ok) throw new Error("esphome jobs failed");
  return (await n.json()).jobs;
}
async function SK() {
  return (await fetch("/settings/integrations/test-ollama", { method: "POST" })).json();
}
async function wK() {
  return (await fetch("/settings/integrations/test-cannalib", { method: "POST" })).json();
}
async function MK(n, e = 254) {
  await fetch("/settings/zigbee/permit-join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enabled: n, duration_s: n ? e : 0 })
  });
}
async function r4() {
  const n = await fetch("/settings/zigbee/devices");
  if (!n.ok) throw new Error("zigbee devices failed");
  return n.json();
}
async function a4() {
  const n = await fetch("/settings/zigbee/health");
  if (!n.ok) throw new Error("zigbee health failed");
  return n.json();
}
const TK = {
  climate: /* @__PURE__ */ new Set(["climate"]),
  liquid: /* @__PURE__ */ new Set(["safety"]),
  safety: /* @__PURE__ */ new Set(["safety"]),
  plug: /* @__PURE__ */ new Set(["plug"]),
  motion: /* @__PURE__ */ new Set(),
  other: /* @__PURE__ */ new Set()
};
function XT(n, e) {
  const t = String(n || "").trim().toLowerCase(), i = String(e || "active").trim().toLowerCase();
  return t === "humidifier" ? i === "inactive" ? "Humidifier EMPTY - refill" : "Humidifier tank FULL - empty tank" : i === "inactive" ? "Dehumidifier tank EMPTY - refill" : "Dehumidifier tank FULL - empty tank";
}
function EK(n, e) {
  const t = TK[String(n).toLowerCase()] ?? /* @__PURE__ */ new Set();
  return e.filter((i) => {
    const r = String(i.kind ?? "none");
    return String(i.id ?? "") === "unbound" || t.has(r);
  });
}
function CK(n, e) {
  const t = String(n).toLowerCase();
  return e.filter((i) => {
    if (String(i.id ?? "") === "none") return !0;
    const a = i.device_classes;
    return Array.isArray(a) ? a.some((s) => String(s).toLowerCase() === t) : !1;
  });
}
function CE(n) {
  const e = String(n || "");
  return e === "leak_tank" || e === "leak_floor" || e.startsWith("leak_floor_");
}
function YT(n) {
  return String(n || "active").toLowerCase() === "inactive" ? "Floor dry alarm — check sensor" : "Floor water detected";
}
async function AK() {
  const n = await fetch("/settings/zigbee/roles");
  if (!n.ok) throw new Error("zigbee roles failed");
  return n.json();
}
async function RK(n) {
  const e = await fetch("/settings/zigbee/bindings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bindings: n })
  });
  if (!e.ok) throw new Error("zigbee bindings save failed");
  return e.json();
}
async function NK() {
  const n = await fetch("/settings/zigbee/recipes");
  if (!n.ok) throw new Error("zigbee recipes failed");
  return n.json();
}
async function s4() {
  const n = await fetch("/settings/zigbee/policies");
  if (!n.ok) throw new Error("zigbee policies failed");
  return n.json();
}
async function kK(n) {
  const e = await fetch("/settings/zigbee/policies", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ policies: n })
  });
  if (!e.ok) throw new Error("zigbee policies save failed");
  return e.json();
}
async function yV(n, e, t) {
  const i = await fetch(`/settings/calibration/${encodeURIComponent(n)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cal_type: e, steps: t })
  });
  if (!i.ok) throw new Error("calibration save failed");
  return i.json();
}
function DK() {
  return "/settings/backup/export";
}
async function LK(n) {
  const e = new FormData();
  e.append("file", n);
  const t = await fetch("/settings/backup/import", { method: "POST", body: e });
  if (!t.ok) throw new Error("backup import failed");
  return t.json();
}
async function IK() {
  const n = await fetch("/settings/global-modifiers");
  if (!n.ok) throw new Error("global modifiers fetch failed");
  return (await n.json()).modifiers;
}
async function PK(n) {
  const e = await fetch("/settings/global-modifiers", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(n)
  });
  if (!e.ok) throw new Error("global modifiers patch failed");
  return (await e.json()).modifiers;
}
async function OK(n) {
  const e = await fetch("/ai/soft-cal-advice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(n)
  });
  if (!e.ok) throw new Error("soft-cal advice failed");
  return e.json();
}
async function u3() {
  const n = await fetch("/settings/probe-stations");
  if (!n.ok) throw new Error("probe stations fetch failed");
  return (await n.json()).stations ?? [];
}
async function PN(n, e) {
  const t = await fetch(`/settings/probe-stations/${encodeURIComponent(n)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(e)
  });
  if (!t.ok)
    throw new Error(vy(await t.text(), "probe station patch failed"));
  return t.json();
}
async function zK(n, e) {
  const t = await fetch(`/roster/pots/${n}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(e)
  });
  if (!t.ok)
    throw new Error(vy(await t.text(), "plant edit failed"));
  return t.json();
}
async function bV(n) {
  const e = await fetch(`/roster/detach/${n}`, { method: "POST" });
  if (!e.ok)
    throw new Error(vy(await e.text(), "detach failed"));
  return e.json();
}
async function FK(n) {
  const e = await fetch(`/roster/slots/${n}/retire`, { method: "POST" });
  if (!e.ok)
    throw new Error(vy(await e.text(), "retire failed"));
  return e.json();
}
async function BK(n, e) {
  const t = await fetch("/roster/assign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slot: n, pot: e })
  });
  if (!t.ok)
    throw new Error(vy(await t.text(), "assign failed"));
  return t.json();
}
async function UK(n, e) {
  const t = await fetch("/roster/move", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ from_pot: n, to_pot: e })
  });
  if (!t.ok)
    throw new Error(vy(await t.text(), "move failed"));
  return t.json();
}
async function jK(n) {
  const e = await fetch("/soil-tests/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(n)
  });
  if (!e.ok) {
    const t = await e.text();
    throw new Error(t || "soil test start failed");
  }
  return e.json();
}
async function HK(n) {
  const e = await fetch(`/soil-tests/${encodeURIComponent(n)}`);
  if (!e.ok) throw new Error("soil test poll failed");
  return e.json();
}
async function VK(n) {
  const e = await fetch(`/soil-tests/${encodeURIComponent(n)}/confirm`, { method: "POST" });
  if (!e.ok) {
    const t = await e.text();
    throw new Error(t || "soil test confirm failed");
  }
  return e.json();
}
async function GK(n) {
  const e = await fetch(`/soil-tests/${encodeURIComponent(n)}/cancel`, { method: "POST" });
  if (!e.ok) throw new Error("soil test cancel failed");
  return e.json();
}
const WK = {
  heater: "switch.dsc_hub_heater_demand",
  heatmat: "switch.dsc_hub_grow_mat_demand",
  humidifier: "switch.dsc_hub_humidifier_demand",
  dehumidifier: "switch.dsc_hub_dehumidifier_demand",
  ac: "switch.dsc_hub_ac_demand",
  clone_humidifier: "switch.dsc_hub_clone_humidifier_demand"
};
function ya() {
  const n = vA(), e = qd(), t = j.useCallback(
    async (r, a, s) => e === "pi" ? hK(r, a, s ?? {}) : n.callService(r, a, s),
    [n, e]
  ), i = j.useCallback(
    async (r, a) => {
      if (e === "pi")
        return fK(r, a);
      const s = WK[r];
      return n.callService("switch", a ? "turn_on" : "turn_off", { entity_id: s });
    },
    [n, e]
  );
  return { callService: t, setDemand: i };
}
function xf(n) {
  const { state: e, available: t, entity: i } = vA(), r = Pr();
  if (qd() === "pi") {
    const s = $T(n, r);
    if (s != null)
      return {
        state: s,
        available: gV(n, r),
        attributes: _V(n, r)
      };
  }
  return {
    state: e(n, "unavailable"),
    available: t(n),
    attributes: i(n)?.attributes ?? {}
  };
}
function cr({
  name: n,
  size: e = 16,
  className: t,
  color: i = "currentColor",
  motion: r
}) {
  const a = r ? ` dsc-icon--${r}` : "";
  return /* @__PURE__ */ g.jsx(
    "span",
    {
      className: `dsc-icon${a}${t ? ` ${t}` : ""}`,
      role: "img",
      "aria-hidden": !0,
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: e,
        height: e,
        color: i,
        flexShrink: 0,
        lineHeight: 0
      },
      dangerouslySetInnerHTML: { __html: $Z(n) }
    }
  );
}
function ht({
  title: n,
  children: e,
  className: t = "",
  style: i,
  icon: r
}) {
  return /* @__PURE__ */ g.jsxs("section", { className: `dsc-card ${t}`.trim(), style: i, children: [
    n ? /* @__PURE__ */ g.jsxs("h3", { className: "dsc-card-title", children: [
      r ? /* @__PURE__ */ g.jsx(cr, { name: r, size: 14, color: "var(--dsc-teal)" }) : null,
      n
    ] }) : null,
    e
  ] });
}
function Xe({
  children: n,
  primary: e,
  teal: t,
  variant: i,
  onClick: r,
  type: a = "button",
  disabled: s,
  icon: o,
  iconMotion: l
}) {
  const c = ["dsc-btn"];
  if (e && c.push("primary"), t && c.push("teal"), i)
    switch (i) {
      case "primary":
        c.push("dsc-btn-primary");
        break;
      case "secondary":
        c.push("dsc-btn-secondary");
        break;
      case "danger":
        c.push("dsc-btn-danger");
        break;
    }
  return /* @__PURE__ */ g.jsxs("button", { type: a, className: c.join(" "), onClick: r, disabled: s, children: [
    o ? /* @__PURE__ */ g.jsx(cr, { name: o, size: 14, motion: l }) : null,
    n
  ] });
}
function fa({
  label: n,
  value: e,
  unit: t,
  sub: i,
  tone: r = "normal",
  stale: a,
  onClick: s,
  icon: o
}) {
  const l = (() => {
    switch (r) {
      case "ok":
        return "dsc-status-ok";
      case "warn":
        return "dsc-status-warn";
      case "bad":
        return "dsc-status-bad";
      case "muted":
        return "dsc-status-muted";
      case "normal":
        return a ? "dsc-status-muted" : "";
      default:
        return r;
    }
  })(), c = /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
    /* @__PURE__ */ g.jsxs("div", { className: `dsc-kpi-value ${l}`.trim(), children: [
      e,
      t ? /* @__PURE__ */ g.jsx("span", { className: "dsc-kpi-unit", children: t }) : null,
      a ? /* @__PURE__ */ g.jsx("span", { className: "dsc-held-tag", children: "HELD" }) : null
    ] }),
    i ? /* @__PURE__ */ g.jsx("div", { className: "dsc-kpi-sub", children: i }) : null
  ] });
  return s ? /* @__PURE__ */ g.jsx("button", { type: "button", className: "dsc-kpi-hit", onClick: s, title: `History · ${n}`, children: /* @__PURE__ */ g.jsx(ht, { title: n, className: a ? "is-stale" : void 0, icon: o, children: c }) }) : /* @__PURE__ */ g.jsx(ht, { title: n, className: a ? "is-stale" : void 0, icon: o, children: c });
}
function $a({
  title: n,
  subtitle: e,
  icon: t,
  primaryAction: i,
  actions: r
}) {
  const a = i || r ? /* @__PURE__ */ g.jsxs("div", { className: "dsc-page-header-actions", children: [
    i,
    r
  ] }) : null;
  return /* @__PURE__ */ g.jsxs("header", { className: "dsc-page-header", children: [
    /* @__PURE__ */ g.jsxs("div", { className: "dsc-page-header-main", children: [
      t ? /* @__PURE__ */ g.jsx(cr, { name: t, size: 22, color: "var(--dsc-teal)" }) : null,
      /* @__PURE__ */ g.jsxs("div", { children: [
        /* @__PURE__ */ g.jsx("h1", { className: "dsc-page-title", children: n }),
        e ? /* @__PURE__ */ g.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: e }) : null
      ] })
    ] }),
    a
  ] });
}
function de({
  label: n,
  tone: e = "muted",
  pulse: t,
  motion: i,
  icon: r,
  onClick: a,
  title: s
}) {
  const o = i ?? (t ? "pulse" : void 0), l = `dsc-chip dsc-chip--${e}${o ? ` dsc-chip--${o}` : ""}`, c = i === "fan" ? /* @__PURE__ */ g.jsx(cr, { name: "fan", size: 11, className: "dsc-fan-spin" }) : r ? /* @__PURE__ */ g.jsx(
    cr,
    {
      name: r,
      size: 11,
      motion: i === "glow" || i === "duty" || i === "breathe" ? i : t ? "pulse" : void 0
    }
  ) : null;
  return a ? /* @__PURE__ */ g.jsxs("button", { type: "button", className: `${l} is-clickable`, title: s, onClick: a, children: [
    c,
    n
  ] }) : /* @__PURE__ */ g.jsxs("span", { className: l, title: s, children: [
    c,
    n
  ] });
}
function ha({
  entityId: n,
  label: e,
  warnWhenMissing: t,
  icon: i,
  showBrightness: r,
  confirm: a
}) {
  const { state: s, available: o, attributes: l } = xf(n), { callService: c } = ya(), [d, h] = j.useState(!1), p = s === "on", v = o, y = n.split(".")[0], w = () => {
    if (v) {
      if (y === "switch" || y === "input_boolean") {
        c(y, p ? "turn_off" : "turn_on", { entity_id: n });
        return;
      }
      y === "light" && c("light", p ? "turn_off" : "turn_on", { entity_id: n });
    }
  }, S = () => {
    if (!(!v && !t)) {
      if (a) {
        h(!0);
        return;
      }
      w();
    }
  }, x = a === !0 ? {
    title: p ? `Turn off ${e}` : `Turn on ${e}`,
    body: `This writes ${n} on the hub immediately.`,
    confirmLabel: p ? "Turn off" : "Turn on"
  } : a ? {
    title: a.title ?? (p ? `Turn off ${e}` : `Turn on ${e}`),
    body: a.body ?? `This writes ${n} on the hub immediately.`,
    confirmLabel: a.confirmLabel ?? (p ? "Turn off" : "Turn on")
  } : null, E = r !== !1 && y === "light" && p ? Math.round(Number(l?.brightness ?? 0) / 255 * 100) : null;
  return /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
    /* @__PURE__ */ g.jsxs(
      "button",
      {
        type: "button",
        className: `dsc-demand${p ? " is-on" : ""}${v ? "" : " is-missing"}`,
        onClick: S,
        disabled: !v && !t,
        title: v ? n : t || `${n} unavailable`,
        children: [
          i ? /* @__PURE__ */ g.jsx(
            cr,
            {
              name: i,
              size: 22,
              color: "var(--dsc-teal)",
              className: "dsc-demand-icon",
              motion: p ? y === "light" ? "glow" : "duty" : void 0
            }
          ) : null,
          /* @__PURE__ */ g.jsx("span", { className: "dsc-demand-label", children: e }),
          /* @__PURE__ */ g.jsx("span", { className: "dsc-demand-state", children: v ? E != null ? `${E}%` : p ? "ON" : "OFF" : t || "—" })
        ]
      }
    ),
    x ? /* @__PURE__ */ g.jsx(
      oi,
      {
        open: d,
        onDismiss: () => h(!1),
        onConfirm: () => {
          h(!1), w();
        },
        title: x.title,
        confirmLabel: x.confirmLabel,
        help: null,
        children: /* @__PURE__ */ g.jsx("p", { children: x.body })
      }
    ) : null
  ] });
}
function Sf({
  entityId: n,
  label: e,
  icon: t,
  disabled: i,
  filterOptions: r
}) {
  const { state: a, available: s, attributes: o } = xf(n), { callService: l } = ya(), c = s && !i, d = a, h = o?.options || [], p = r ? r(h) : h, v = n.split(".")[0], [y, w] = j.useState(!1), S = j.useRef(!1), [x, E] = j.useState(d);
  j.useEffect(() => {
    !S.current && !y && E(d);
  }, [d, y, n]);
  const C = (k) => {
    E(k), w(!1), !(!c || !k) && (v === "select" ? l("select", "select_option", { entity_id: n, option: k }) : v === "input_select" && l("input_select", "select_option", { entity_id: n, option: k }));
  }, A = y ? x : d;
  return /* @__PURE__ */ g.jsxs("label", { className: `dsc-entity-select${c ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ g.jsxs("span", { className: "dsc-entity-select-label", children: [
      t ? /* @__PURE__ */ g.jsx(cr, { name: t, size: 13, color: "var(--dsc-teal)" }) : null,
      e
    ] }),
    /* @__PURE__ */ g.jsxs(
      "select",
      {
        value: A,
        disabled: !c,
        onFocus: () => {
          S.current = !0, w(!0);
        },
        onBlur: () => {
          S.current = !1, w(!1);
        },
        onChange: (k) => C(k.target.value),
        children: [
          !p.includes(A) && A ? /* @__PURE__ */ g.jsx("option", { value: A, children: A }) : null,
          p.map((k) => /* @__PURE__ */ g.jsx("option", { value: k, children: k }, k))
        ]
      }
    )
  ] });
}
function mf({
  entityId: n,
  label: e,
  disabled: t
}) {
  const { available: i, attributes: r, state: a } = xf(n), { callService: s } = ya(), o = i, l = Number(r?.percentage ?? 0), c = a === "on", d = t || !o, [h, p] = j.useState(!1), v = j.useRef(!1), [y, w] = j.useState(Number.isFinite(l) ? l : 0);
  j.useEffect(() => {
    !v.current && !h && Number.isFinite(l) && w(l);
  }, [l, h, n]);
  const S = (E) => {
    d || s("fan", "set_percentage", { entity_id: n, percentage: E });
  }, x = h ? y : Number.isFinite(l) ? l : 0;
  return /* @__PURE__ */ g.jsxs("label", { className: `dsc-fan-slider${d ? " is-disabled" : ""}`, children: [
    /* @__PURE__ */ g.jsxs("span", { className: "dsc-fan-slider-label", children: [
      e,
      /* @__PURE__ */ g.jsx("strong", { children: o ? `${Math.round(x)}%` : "—" }),
      !c && o ? /* @__PURE__ */ g.jsx("em", { className: "dsc-muted", children: "off" }) : null
    ] }),
    /* @__PURE__ */ g.jsx(
      "input",
      {
        type: "range",
        min: 0,
        max: 100,
        step: 1,
        value: x,
        disabled: d,
        onPointerDown: (E) => {
          E.target.setPointerCapture(E.pointerId), v.current = !0, p(!0);
        },
        onPointerUp: (E) => {
          v.current = !1, p(!1), S(Number(E.target.value));
        },
        onPointerCancel: () => {
          v.current = !1, p(!1);
        },
        onLostPointerCapture: () => {
          v.current = !1, p(!1);
        },
        onChange: (E) => {
          const C = Number(E.target.value);
          w(C), v.current || S(C);
        }
      }
    )
  ] });
}
function d3(n) {
  return !n || n === "unknown" || n === "unavailable" ? "" : n;
}
const Dm = /* @__PURE__ */ new Map();
function $K(n) {
  return Dm.has(n) ? Dm.get(n) : void 0;
}
async function XK(n) {
  document.querySelectorAll("[data-entity-id]").forEach((i) => {
    const r = i.getAttribute("data-entity-id");
    r && (i instanceof HTMLInputElement || i instanceof HTMLTextAreaElement) && Dm.set(r, i.value);
  });
  const e = document.activeElement;
  e instanceof HTMLElement && e.blur();
  const t = [...Dm.entries()];
  for (const [i, r] of t)
    if (String(r || "").trim())
      if (i.startsWith("input_datetime.")) {
        const a = { entity_id: i };
        r.includes("T") ? a.datetime = r.replace("T", " ") : a.date = r, await n("input_datetime", "set_datetime", a);
      } else
        await n("input_text", "set_value", { entity_id: i, value: r });
  await Promise.resolve();
}
function qT({
  entityId: n,
  label: e,
  multiline: t = !1,
  rows: i = 2
}) {
  const { available: r, state: a } = wn(), { callService: s } = ya(), o = r(n), l = d3(a(n, "")), [c, d] = j.useState(l), h = j.useRef(!1);
  j.useEffect(() => {
    h.current || (d(l), Dm.set(n, l));
  }, [l, n]);
  const p = () => {
    o && (Dm.set(n, c), s("input_text", "set_value", { entity_id: n, value: c }));
  }, v = {
    value: c,
    disabled: !o,
    onFocus: () => {
      h.current = !0;
    },
    onChange: (y) => {
      d(y.target.value), Dm.set(n, y.target.value);
    },
    onBlur: () => {
      h.current = !1, p();
    },
    onKeyDown: (y) => {
      y.key === "Enter" && !t && y.currentTarget.blur();
    }
  };
  return /* @__PURE__ */ g.jsxs("label", { className: `dsc-target-num${o ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ g.jsx("span", { className: "dsc-target-num-label", children: e }),
    t ? /* @__PURE__ */ g.jsx("textarea", { rows: i, "data-entity-id": n, ...v }) : /* @__PURE__ */ g.jsx("input", { type: "text", "data-entity-id": n, ...v })
  ] });
}
function YK(n) {
  const e = d3(n);
  return e ? e.slice(0, 5) : "";
}
function qK(n) {
  return n ? n.length === 5 ? `${n}:00` : n : "00:00:00";
}
function o4({
  entityId: n,
  label: e,
  disabled: t,
  hint: i
}) {
  const { entity: r } = wn(), { state: a, available: s } = xf(n), { callService: o } = ya(), c = (!!r(n) || s) && !t, d = YK(a === "unavailable" || a === "unknown" ? "" : a), [h, p] = j.useState(d), v = j.useRef(!1);
  j.useEffect(() => {
    v.current || p(d);
  }, [d]);
  const y = () => {
    !c || !h || o("time", "set_value", { entity_id: n, time: qK(h) });
  };
  return /* @__PURE__ */ g.jsxs("label", { className: `dsc-target-num${c ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ g.jsx("span", { className: "dsc-target-num-label", children: e }),
    /* @__PURE__ */ g.jsx(
      "input",
      {
        type: "time",
        value: h,
        disabled: !c,
        onFocus: () => {
          v.current = !0;
        },
        onChange: (w) => p(w.target.value),
        onBlur: () => {
          v.current = !1, y();
        }
      }
    ),
    i ? /* @__PURE__ */ g.jsx("span", { className: "dsc-target-hint", children: i }) : null
  ] });
}
function ZK({ entityId: n, label: e }) {
  const { available: t, entity: i, state: r } = wn(), { callService: a } = ya(), s = t(n), o = !!i(n)?.attributes?.has_time, l = d3(r(n, "")), c = (y) => y ? o ? y.slice(0, 16).replace(" ", "T") : y.slice(0, 10) : "", [d, h] = j.useState(c(l)), p = j.useRef(!1);
  j.useEffect(() => {
    p.current || h(c(l));
  }, [l, o]);
  const v = () => {
    if (!s || !d) return;
    const y = o ? d.replace("T", " ") : d;
    o ? a("input_datetime", "set_datetime", { entity_id: n, datetime: y }) : a("input_datetime", "set_datetime", { entity_id: n, date: d });
  };
  return /* @__PURE__ */ g.jsxs("label", { className: `dsc-target-num${s ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ g.jsx("span", { className: "dsc-target-num-label", children: e }),
    /* @__PURE__ */ g.jsx(
      "input",
      {
        type: o ? "datetime-local" : "date",
        "data-entity-id": n,
        value: d,
        disabled: !s,
        onFocus: () => {
          p.current = !0;
        },
        onChange: (y) => h(y.target.value),
        onBlur: () => {
          p.current = !1, v();
        }
      }
    )
  ] });
}
let xV = class extends j.Component {
  constructor() {
    super(...arguments);
    rb(this, "state", { error: null });
  }
  static getDerivedStateFromError(t) {
    return { error: t };
  }
  componentDidCatch(t, i) {
    console.error("DSC panel error", t, i.componentStack);
  }
  render() {
    return this.state.error ? /* @__PURE__ */ g.jsxs("div", { className: "dsc-shell", style: { padding: 24 }, children: [
      /* @__PURE__ */ g.jsx("p", { className: "dsc-honesty", children: "Something went wrong loading this view." }),
      /* @__PURE__ */ g.jsx("p", { className: "dsc-muted", style: { fontSize: 13 }, children: this.state.error.message }),
      /* @__PURE__ */ g.jsxs("div", { className: "dsc-chip-row", style: { marginTop: 12 }, children: [
        /* @__PURE__ */ g.jsx(
          Xe,
          {
            primary: !0,
            onClick: () => {
              this.setState({ error: null }), this.props.onRetry?.();
            },
            children: "Retry"
          }
        ),
        /* @__PURE__ */ g.jsx(Xe, { onClick: () => window.location.reload(), children: "Reload page" })
      ] })
    ] }) : this.props.children;
  }
};
const KK = "_allocated";
function Ca(n, e, t) {
  const i = t.num(e);
  return t.forceKind === "mass-balance" ? {
    value: t.num(n, i),
    kind: "mass-balance",
    entityId: n,
    nameplate: Number.isFinite(i) ? i : void 0
  } : t.available(n) && Number.isFinite(t.num(n)) ? {
    value: t.num(n),
    kind: n.endsWith(KK) ? "allocated" : "nameplate",
    entityId: n,
    nameplate: Number.isFinite(i) ? i : void 0
  } : {
    value: i,
    kind: "nameplate",
    entityId: e,
    nameplate: Number.isFinite(i) ? i : void 0
  };
}
function QK(n) {
  switch (n) {
    case "allocated":
      return "Allocated";
    case "nameplate":
      return "Nameplate";
    case "mass-balance":
      return "Mass-balance";
    default:
      return n;
  }
}
const h3 = [
  {
    id: "generic_fabric_25l",
    label: "25L Generic Fabric Grow Bag",
    volumeL: 25,
    material: "fabric",
    silhouette: "bag"
  },
  {
    id: "generic_tall_pet_20l",
    label: "20L Generic Tall PET",
    volumeL: 20,
    material: "pet",
    silhouette: "tall"
  },
  {
    id: "generic_fabric_20l",
    label: "20L Generic Fabric Grow Bag",
    volumeL: 20,
    material: "fabric",
    silhouette: "bag"
  },
  {
    id: "airpot_20l",
    label: "20L Air-Pot",
    volumeL: 20,
    material: "airpot",
    silhouette: "airpot"
  },
  {
    id: "felt_15l",
    label: "15L Felt Pot",
    volumeL: 15,
    material: "felt",
    silhouette: "bag"
  },
  {
    id: "plastic_taper_15l",
    label: "15L Taper Plastic",
    volumeL: 15,
    material: "plastic",
    silhouette: "taper"
  }
], SV = new Map(h3.map((n) => [n.id, n])), RS = h3[2];
function wV(n) {
  return `input_select.dsc_probe${n}_vessel`;
}
function JK(n) {
  const e = String(n || "").trim();
  return SV.has(e) ? e : RS.id;
}
function WL(n, e) {
  const t = SV.get(JK(n)) ?? RS;
  return Number.isFinite(e) && e > 0 ? { ...t, volumeL: e } : t;
}
function Rf(n, e, t) {
  const i = wV(n), r = e(i, "");
  if (r && r !== "unknown" && r !== "unavailable")
    return WL(r);
  const a = t?.("sensor.dsc_plant_roster_summary")?.attributes?.slots;
  if (Array.isArray(a)) {
    const s = a.find((o) => String(o.pot) === String(n));
    if (s?.vessel) return WL(s.vessel);
  }
  return RS;
}
function eQ(n) {
  switch (n) {
    case "fabric":
      return "rgba(180, 210, 190, 0.85)";
    case "felt":
      return "rgba(160, 190, 170, 0.9)";
    case "pet":
      return "rgba(120, 210, 230, 0.95)";
    case "plastic":
      return "rgba(170, 200, 220, 0.9)";
    case "airpot":
      return "rgba(90, 200, 170, 0.95)";
    default:
      return n;
  }
}
const l4 = [
  "var(--dsc-soil-1)",
  "var(--dsc-soil-2)",
  "var(--dsc-soil-3)",
  "var(--dsc-soil-4)"
];
function c4(n) {
  switch (n) {
    case "bag":
      return "M18 8 Q18 4 32 4 L68 4 Q82 4 82 8 L86 88 Q86 96 50 96 Q14 96 14 88 Z";
    case "taper":
      return "M24 6 L76 6 L88 92 Q88 98 50 98 Q12 98 12 92 Z";
    case "tall":
      return "M28 4 L72 4 L78 94 Q78 98 50 98 Q22 98 22 94 Z";
    case "airpot":
      return "M26 6 L74 6 L84 90 Q84 96 50 96 Q16 96 16 90 Z";
    default:
      return n;
  }
}
function wu({
  spec: n,
  layers: e = [],
  size: t = 56,
  label: i
}) {
  const r = `vclip-${n.id}-${n.silhouette}`, a = e.reduce((o, l) => o + l.pct, 0) || 1;
  let s = 0;
  return /* @__PURE__ */ g.jsxs("span", { className: "dsc-vessel-glyph", title: n.label, children: [
    /* @__PURE__ */ g.jsxs("svg", { width: t, height: t * 1.15, viewBox: "0 0 100 100", "aria-hidden": !0, children: [
      /* @__PURE__ */ g.jsx("defs", { children: /* @__PURE__ */ g.jsx("clipPath", { id: r, children: /* @__PURE__ */ g.jsx("path", { d: c4(n.silhouette) }) }) }),
      /* @__PURE__ */ g.jsx(
        "path",
        {
          d: c4(n.silhouette),
          fill: "rgba(8,12,10,0.85)",
          stroke: eQ(n.material),
          strokeWidth: "2.4",
          strokeDasharray: n.silhouette === "airpot" ? "5 3" : void 0
        }
      ),
      /* @__PURE__ */ g.jsx("g", { clipPath: `url(#${r})`, children: e.map((o, l) => {
        const c = o.pct / a * 88, d = 96 - s - c;
        return s += c, /* @__PURE__ */ g.jsx(
          "rect",
          {
            x: "12",
            y: d,
            width: "76",
            height: c,
            fill: o.color || l4[l % l4.length]
          },
          `${o.name}-${l}`
        );
      }) })
    ] }),
    i ? /* @__PURE__ */ g.jsxs("span", { className: "dsc-vessel-glyph-label", children: [
      n.volumeL,
      "L"
    ] }) : null
  ] });
}
function f3({
  label: n,
  icon: e,
  onClick: t,
  className: i = "",
  expanded: r
}) {
  return /* @__PURE__ */ g.jsx(
    "button",
    {
      type: "button",
      className: `dsc-icon-btn ${i}`.trim(),
      "aria-label": n,
      title: n,
      "aria-expanded": r,
      onClick: t,
      children: /* @__PURE__ */ g.jsx(cr, { name: e, size: 16 })
    }
  );
}
function tQ(n) {
  return n instanceof Element ? !!n.closest(
    "ha-more-info-dialog, ha-dialog, ha-more-info-info, .ha-more-info, home-assistant-dialog"
  ) : !1;
}
function gA({
  items: n,
  label: e = "More actions"
}) {
  const [t, i] = j.useState(!1), r = j.useRef(null);
  return j.useEffect(() => {
    if (!t) return;
    const a = (o) => {
      tQ(o.target) || r.current?.contains(o.target) || i(!1);
    }, s = (o) => {
      o.key === "Escape" && i(!1);
    };
    return document.addEventListener("mousedown", a), window.addEventListener("keydown", s), () => {
      document.removeEventListener("mousedown", a), window.removeEventListener("keydown", s);
    };
  }, [t]), /* @__PURE__ */ g.jsxs("div", { className: "dsc-overflow", ref: r, children: [
    /* @__PURE__ */ g.jsx(
      f3,
      {
        label: e,
        icon: "more",
        expanded: t,
        onClick: () => i((a) => !a)
      }
    ),
    t ? /* @__PURE__ */ g.jsx("div", { className: "dsc-overflow-menu", role: "menu", children: n.map((a) => /* @__PURE__ */ g.jsx(
      "button",
      {
        type: "button",
        role: "menuitem",
        onClick: () => {
          i(!1), a.onSelect();
        },
        children: a.label
      },
      a.id
    )) }) : null
  ] });
}
function u4(n) {
  return Array.from(
    n.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((e) => !e.hasAttribute("disabled") && e.tabIndex !== -1);
}
function Nf({
  open: n,
  onClose: e,
  title: t,
  side: i = "right",
  wide: r = !1,
  children: a
}) {
  const s = j.useId(), o = j.useRef(null), l = j.useRef(null);
  return j.useEffect(() => {
    if (!n) return;
    l.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const c = o.current;
    (c ? u4(c)[0] : null)?.focus();
    const h = a3(), p = (v) => {
      if (v.key === "Escape") {
        if (!Px(h)) return;
        v.preventDefault(), v.stopPropagation(), e();
        return;
      }
      if (v.key !== "Tab" || !c || !Px(h)) return;
      const y = u4(c);
      if (!y.length) return;
      const w = y[0], S = y[y.length - 1];
      v.shiftKey && document.activeElement === w ? (v.preventDefault(), S.focus()) : !v.shiftKey && document.activeElement === S && (v.preventDefault(), w.focus());
    };
    return window.addEventListener("keydown", p, !0), () => {
      window.removeEventListener("keydown", p, !0), s3(h), l.current?.focus?.();
    };
  }, [n, e]), /* @__PURE__ */ g.jsxs(
    "div",
    {
      className: `dsc-drawer-root${n ? " is-open" : ""}`,
      "aria-hidden": !n,
      inert: n ? void 0 : !0,
      children: [
        /* @__PURE__ */ g.jsx("div", { className: "dsc-drawer-scrim", "aria-hidden": "true", onClick: e }),
        /* @__PURE__ */ g.jsxs(
          "aside",
          {
            ref: o,
            className: `dsc-drawer-panel ${i}${r ? " dsc-drawer-panel--wide" : ""}`,
            role: "dialog",
            "aria-modal": n ? "true" : void 0,
            "aria-labelledby": s,
            "aria-hidden": !n,
            inert: n ? void 0 : !0,
            hidden: n ? void 0 : !0,
            children: [
              n ? /* @__PURE__ */ g.jsx(
                "button",
                {
                  type: "button",
                  className: "dsc-drawer-rail",
                  "aria-label": "Close",
                  title: "Close",
                  onClick: e,
                  children: "Close"
                }
              ) : null,
              /* @__PURE__ */ g.jsxs("div", { className: "dsc-drawer-head", children: [
                /* @__PURE__ */ g.jsx("h2", { id: s, children: t }),
                /* @__PURE__ */ g.jsx(f3, { label: "Close", icon: "close", onClick: e })
              ] }),
              /* @__PURE__ */ g.jsx("div", { className: "dsc-drawer-body", children: a })
            ]
          }
        )
      ]
    }
  );
}
function nQ(n) {
  if (!n || !n.trim()) return [];
  const e = n.split(/[|/·]/).map((i) => i.trim()).filter(Boolean), t = [];
  for (const i of e) {
    const r = i.match(/^(.+?)\s*[·:]?\s*(\d+(?:\.\d+)?)\s*%?$/);
    if (r) {
      t.push({ name: r[1].trim(), pct: Number(r[2]) });
      continue;
    }
    const a = i.match(/(\d+(?:\.\d+)?)\s*%\s*(.+)$/);
    if (a) {
      t.push({ name: a[2].trim(), pct: Number(a[1]) });
      continue;
    }
    i && t.push({ name: i, pct: 0 });
  }
  if (t.length && t.every((i) => i.pct === 0)) {
    const i = 100 / t.length;
    return t.map((r) => ({ ...r, pct: i }));
  }
  return t.filter((i) => i.pct > 0);
}
function iQ({
  layers: n,
  valid: e,
  emptyLabel: t = "No blend on roster seat",
  spec: i
}) {
  const r = i ?? RS, a = n.reduce((o, l) => o + l.pct, 0), s = e ?? (n.length > 0 && Math.round(a) === 100);
  return n.length ? /* @__PURE__ */ g.jsx("div", { className: `dsc-soil${s ? " is-valid" : ""}`, children: /* @__PURE__ */ g.jsx(wu, { spec: r, layers: n, size: 180, label: !0 }) }) : /* @__PURE__ */ g.jsxs("div", { className: "dsc-soil dsc-soil--empty", children: [
    /* @__PURE__ */ g.jsx(wu, { spec: r, size: 140 }),
    /* @__PURE__ */ g.jsx("p", { className: "dsc-soil-empty-caption", children: t })
  ] });
}
function fu(n, e = 1) {
  if (n == null || n === "" || n === "—" || n === "unknown" || n === "unavailable")
    return "—";
  const t = typeof n == "number" ? n : Number(String(n).replace(/[^\d.eE+-]/g, ""));
  return Number.isFinite(t) ? t.toFixed(e) : String(n);
}
function ds(n, e = "—") {
  return !n || n === "unknown" || n === "unavailable" || n === "none" ? e : n;
}
function rQ(n, e, t) {
  const i = ds(n, "—");
  return fu(i !== "—" ? i : ds(e, "—"), t);
}
function p3(n) {
  const e = String(n || "").trim().toLowerCase();
  return e === "clone" || e === "2x4" || e === "2×4" ? "clone" : e === "main" || e === "4x8" || e === "4×8" ? "main" : "unassigned";
}
function MV(n, e) {
  return p3(n(`input_select.dsc_probe${e}_tent`, "unassigned"));
}
function Gm(n) {
  switch (n) {
    case "clone":
      return "2×4";
    case "main":
      return "4×8";
    case "unassigned":
      return "Unassigned";
    default:
      return n;
  }
}
function gy(n, e) {
  const { state: t, entity: i } = e, r = i("sensor.dsc_plant_roster_summary")?.attributes?.slots || [], a = Array.isArray(r) ? r.find((l) => String(l.pot) === String(n)) : void 0, s = (l, c, d = 1) => rQ(t(l, ""), t(c, ""), d), o = ds(a?.blend, "");
  return {
    pot: n,
    plantName: ds(t(`text.dsc_probe${n}_plant_name`, "")),
    strainDisplay: ds(t(`sensor.dsc_probe${n}_strain_display`, "")),
    sprout: ds(t(`datetime.dsc_probe${n}_sprout_date`, ""), "—").slice(0, 10),
    days: ds(t(`sensor.dsc_probe${n}_days_since_sprout`, "")),
    stage: ds(t(`sensor.dsc_probe${n}_expected_stage`, "")),
    growthStage: ds(t(`select.dsc_probe${n}_growth_stage`, "")),
    tent: MV(t, n),
    blend: o,
    recipe: ds(a?.recipe, ""),
    notes: ds(a?.notes, ""),
    layers: nQ(o),
    moisture: s(`sensor.dsc_probe${n}_got_moisture`, `sensor.dsc_probe${n}_soil_moisture`, 0),
    soilTemp: fu(ds(t(`sensor.dsc_probe${n}_soil_temperature`, "")), 1),
    ec: s(`sensor.dsc_probe${n}_got_ec`, `sensor.dsc_probe${n}_soil_ec`, 0),
    ph: s(`sensor.dsc_probe${n}_got_ph`, `sensor.dsc_probe${n}_soil_ph`, 2),
    n: fu(ds(t(`sensor.dsc_probe${n}_soil_nitrogen`, "")), 0),
    p: fu(ds(t(`sensor.dsc_probe${n}_soil_phosphorus`, "")), 0),
    k: fu(ds(t(`sensor.dsc_probe${n}_soil_potassium`, "")), 0),
    need: ds(t(`sensor.dsc_probe${n}_need_summary`, "")),
    rosterSlot: a?.slot ?? null
  };
}
function ON(n, e) {
  const t = n(e, "");
  return !!t && t !== "unavailable" && t !== "unknown";
}
function wf(n, e, t) {
  const i = `sensor.dsc_probe${n}_got_${e}`;
  if (ON(t, i)) return i;
  if (e === "moisture") return `sensor.dsc_probe${n}_soil_moisture`;
  if (e === "ph") return `sensor.dsc_probe${n}_soil_ph`;
  const r = `sensor.dsc_probe${n}_soil_ec`;
  if (ON(t, r)) return r;
  const a = `sensor.dsc_probe${n}_soil_conductivity`;
  return ON(t, a) ? a : r;
}
function m3(n, e, t) {
  return $L(e).map((i) => gy(i, { state: e, entity: t })).filter((i) => i.tent === n && i.plantName !== "—" && i.plantName.trim() !== "");
}
const Qi = [1, 2];
function ii(n) {
  return `Probe ${n}`;
}
function Do(n, e) {
  const t = `input_boolean.dsc_probe${n}_in_service`, i = e(t, "off");
  return i === "unavailable" || i === "unknown" || i === "" ? !1 : i === "on";
}
function Ox(n, e, t) {
  return t?.inventory?.length ? Mm(t, `pot${n}`, !1) : Do(n, e);
}
function $L(n, e = [...Qi]) {
  return e.filter((t) => Do(t, n));
}
function aQ(n, e, t = [...Qi]) {
  return {
    inService: t.filter((i) => Ox(i, n, e)).length,
    total: t.length
  };
}
function _A(n) {
  const e = n("sensor.dsc_plant_roster_summary")?.attributes?.slots;
  return Array.isArray(e) ? e : [];
}
function sQ(n, e) {
  const t = [], i = (l, c = "unknown") => n.state(l, c), r = (l) => i(l) === "on", a = n.entity?.("sensor.dsc_keepup_gaps")?.attributes ?? {}, s = String(a.full_auto_honesty ?? "").trim();
  if (n.available && n.available("binary_sensor.dsc_hub_link") && !r("binary_sensor.dsc_hub_link") && t.push({
    id: "hub-link",
    label: "Hub link down",
    detail: "The hub link is down — readings are held at their last known values.",
    tone: "bad",
    href: "/fleet",
    cta: "Open Fleet",
    priority: 9
  }), n.available && !n.available("sensor.dsc_hub_uptime")) {
    const l = n.entity?.("sensor.dsc_hub_uptime")?.last_changed;
    let c = "";
    if (l) {
      const d = Date.now() - Date.parse(l);
      if (Number.isFinite(d) && d >= 0) {
        const h = Math.floor(d / 6e4);
        c = h < 60 ? ` · offline ${Math.max(1, h)}m` : ` · offline ${(h / 60).toFixed(1)}h`;
      }
    }
    t.push({
      id: "hub-dark",
      label: "Hub offline",
      detail: `Showing last good vitals${c}. Reconnect snaps to live.`,
      tone: "bad",
      href: "/fleet",
      cta: "Open Fleet",
      priority: 10
    });
  }
  if (n.available && !n.available("sensor.dsc_hub_heartbeat") && t.push({
    id: "beat-dark",
    label: "Heartbeat missing",
    detail: "The hub's heartbeat has stopped arriving — readings stay held until it returns.",
    tone: "bad",
    href: "/fleet",
    cta: "Open Fleet",
    priority: 12
  }), n.available && !n.available("binary_sensor.dsc_hub_panel_link")) {
    const l = n.available("sensor.dsc_control_wifi_rssi");
    t.push({
      id: "panel-dark",
      label: l ? "Panel limited link" : "Panel link down",
      detail: l ? "Panel Wi‑Fi RSSI is present but panel link is off — treat as limited, not a full outage." : "The control panel link is down — check Fleet link chips for how long.",
      tone: "warn",
      href: "/fleet",
      cta: "Open Fleet",
      priority: 14
    });
  }
  if (r("binary_sensor.dsc_reduced_kit")) {
    const l = n.entity?.("binary_sensor.dsc_reduced_kit")?.attributes ?? {}, c = String(l.offline ?? "").trim();
    t.push({
      id: "reduced-kit",
      label: "Capacity offline",
      detail: c || "A device that should be running is temporarily out of service or locked out.",
      tone: "warn",
      href: "/fleet",
      cta: "Review kit",
      priority: 20
    });
  }
  s && r("switch.dsc_hub_tent_full_auto_mode") && t.push({
    id: "keepup",
    label: "Keep-up gaps",
    detail: s,
    tone: "warn",
    href: "/live/climate",
    cta: "Fix Climate",
    priority: 30
  });
  const o = [...Qi].filter(
    (l) => !Ox(l, i, e ?? null)
  );
  if (o.length && t.push({
    id: "oos-pots",
    label: o.length === 1 ? `Probe ${o[0]} OOS` : `${o.length} probes OOS`,
    detail: `Probe${o.length === 1 ? "" : "s"} ${o.join(", ")} out of service — omitted from Live on purpose. Open Root or Settings to put back in service.`,
    tone: "muted",
    href: "/live/root",
    cta: "Open Root",
    priority: 50
  }), r("binary_sensor.dsc_clone_dark_period_violation") && t.push({
    id: "dark-viol",
    label: "2×4 dark violation",
    detail: "The lamp is on during the dark period — check Light.",
    tone: "bad",
    href: "/live/light",
    cta: "Open Light",
    priority: 25
  }), r("binary_sensor.dsc_clone_light_missing_in_window") && t.push({
    id: "photo-missing",
    label: "Light missing in window",
    detail: "The lamp did not deliver its hours in the open window.",
    tone: "bad",
    href: "/live/light",
    cta: "Open Light",
    priority: 24
  }), r("binary_sensor.dsc_hub_light_catchup_active") && t.push({
    id: "photo-catchup",
    label: "Light catch-up",
    detail: "Light catch-up is running — the hours gauge shows what was actually delivered.",
    tone: "warn",
    href: "/live/light",
    cta: "Open Light",
    priority: 28
  }), r("binary_sensor.dsc_hub_climate_sensor_fault") && t.push({
    id: "climate-fault",
    label: "Climate sensor fault",
    detail: "A climate sensor cannot be trusted right now — its readings are held.",
    tone: "bad",
    href: "/live/climate",
    cta: "Open Climate",
    priority: 15
  }), r("binary_sensor.dsc_hub_emergency_failsafe") && t.push({
    id: "failsafe",
    label: "Emergency failsafe",
    detail: "Hub failsafe active — Overview shows Next Recommended; Climate owns command.",
    tone: "bad",
    href: "/live/overview",
    cta: "Open Overview",
    priority: 5
  }), n.available) {
    const l = n.available.bind(n), c = (p, v = NaN) => {
      const y = Number(n.state(p, "nan"));
      return Number.isFinite(y) ? y : v;
    };
    [
      ["sensor.dsc_cfm_intake_main_allocated", "sensor.dsc_cfm_intake_main"],
      ["sensor.dsc_cfm_intake_2x4_allocated", "sensor.dsc_cfm_intake_2x4"],
      ["sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out"],
      ["sensor.dsc_cfm_exhaust_recirc_allocated", "sensor.dsc_cfm_exhaust_recirc"]
    ].some(
      ([p, v]) => Ca(p, v, { available: l, num: c }).kind === "nameplate"
    ) && t.push({
      id: "cfm-nameplate",
      label: "CFM nameplate",
      detail: "One or more ducts still guess CFM from fan % × nameplate — Learning measures real flow.",
      tone: "warn",
      href: "/tune/learning",
      cta: "Open Learning",
      priority: 40
    });
  }
  return t.sort((l, c) => l.priority - c.priority);
}
function oQ(n, e) {
  const t = [];
  if (n.hub.online || t.push({
    id: "hub-link",
    label: "Hub offline",
    detail: "The hub is offline — readings are held at their last known values. Reconnect snaps to live.",
    tone: "bad",
    href: "/fleet",
    cta: "Open Fleet",
    priority: 9
  }), n.hub.online && n.hub.values.heartbeat == null && t.push({
    id: "beat-dark",
    label: "Heartbeat missing",
    detail: "The hub's heartbeat has stopped arriving — readings stay held until it returns.",
    tone: "bad",
    href: "/fleet",
    cta: "Open Fleet",
    priority: 12
  }), !n.panel.online) {
    const i = e?.available?.("sensor.dsc_control_wifi_rssi") === !0;
    t.push({
      id: "panel-dark",
      label: i ? "Panel limited link" : "Panel link down",
      detail: i ? "Panel Wi‑Fi is up but the panel link binary is off — treat as limited, not a full outage." : "The control panel link is down — check Fleet link chips for how long.",
      tone: "warn",
      href: "/fleet",
      cta: "Open Fleet",
      priority: 14
    });
  }
  return n.system.reduced_kit && t.push({
    id: "reduced-kit",
    label: "Capacity offline",
    detail: "A device that should be running is temporarily out of service or locked out.",
    tone: "warn",
    href: "/fleet",
    cta: "Review kit",
    priority: 20
  }), e && t.push(
    ...sQ(e, n).filter(
      (i) => !["hub-link", "hub-dark", "beat-dark", "panel-dark", "reduced-kit"].includes(i.id)
    )
  ), t.sort((i, r) => i.priority - r.priority);
}
function lQ(n) {
  return n[0] ?? null;
}
function TV() {
  const n = wn(), e = Pr();
  return j.useMemo(
    () => oQ(e, {
      state: n.state,
      available: n.available,
      entity: n.entity
    }),
    [e, n.state, n.available, n.entity, n.tick]
  );
}
function cQ({ gaps: n }) {
  const e = TV(), t = n ?? e, [i, r] = j.useState(null), [a, s] = j.useState(!1), o = aa(), l = t.length > 6 ? t.slice(6) : [];
  return t.length ? /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
    /* @__PURE__ */ g.jsxs("div", { className: "dsc-honesty-rail", "aria-label": "Honesty gaps", children: [
      t.slice(0, 6).map((c) => /* @__PURE__ */ g.jsx(
        "button",
        {
          type: "button",
          className: "dsc-honesty-hit",
          onClick: () => r(c),
          children: /* @__PURE__ */ g.jsx(de, { icon: "alert", label: c.label, tone: c.tone === "bad" ? "bad" : "warn" })
        },
        c.id
      )),
      l.length ? /* @__PURE__ */ g.jsx(
        "button",
        {
          type: "button",
          className: "dsc-honesty-hit",
          onClick: () => s(!0),
          title: `${l.length} more honesty gap(s)`,
          "aria-label": `Show ${l.length} more honesty gaps`,
          children: /* @__PURE__ */ g.jsx(de, { label: `+${l.length}`, tone: "muted" })
        }
      ) : null
    ] }),
    /* @__PURE__ */ g.jsx(
      oi,
      {
        open: i != null,
        onDismiss: () => r(null),
        onConfirm: i ? () => {
          o(i.href), r(null);
        } : void 0,
        title: i?.label ?? "Honesty",
        confirmLabel: i?.cta ?? "Go",
        help: null,
        children: /* @__PURE__ */ g.jsx("p", { children: i?.detail })
      }
    ),
    /* @__PURE__ */ g.jsx(
      oi,
      {
        open: a,
        onDismiss: () => s(!1),
        title: `${l.length} more honesty gap${l.length === 1 ? "" : "s"}`,
        help: null,
        children: /* @__PURE__ */ g.jsx("ul", { className: "dsc-honesty-overflow-list", children: l.map((c) => /* @__PURE__ */ g.jsx("li", { children: /* @__PURE__ */ g.jsxs(
          "button",
          {
            type: "button",
            className: "dsc-honesty-overflow-item",
            onClick: () => {
              s(!1), r(c);
            },
            children: [
              /* @__PURE__ */ g.jsx(de, { icon: "alert", label: c.label, tone: c.tone === "bad" ? "bad" : "warn" }),
              /* @__PURE__ */ g.jsx("span", { className: "dsc-muted", children: c.detail })
            ]
          }
        ) }, c.id)) })
      }
    )
  ] }) : /* @__PURE__ */ g.jsx("div", { className: "dsc-honesty-rail", "aria-label": "Honesty", children: /* @__PURE__ */ g.jsx(de, { icon: "ok", label: "Kit honest", tone: "ok" }) });
}
function uQ({ gaps: n }) {
  const e = TV(), i = lQ(n ?? e), r = aa();
  return i ? /* @__PURE__ */ g.jsxs(ht, { className: "dsc-glass dsc-next-rec", title: "Do this next", icon: "alert", children: [
    /* @__PURE__ */ g.jsxs("p", { style: { margin: "0 0 8px" }, children: [
      /* @__PURE__ */ g.jsx("strong", { children: i.label }),
      " — ",
      i.detail
    ] }),
    /* @__PURE__ */ g.jsx(Xe, { primary: !0, onClick: () => r(i.href), children: i.cta })
  ] }) : /* @__PURE__ */ g.jsxs(ht, { className: "dsc-glass dsc-next-rec", title: "Next", icon: "ok", children: [
    /* @__PURE__ */ g.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: "No critical gaps — fly Live or open Twin." }),
    /* @__PURE__ */ g.jsxs("div", { className: "dsc-row-actions", children: [
      /* @__PURE__ */ g.jsx(Xe, { primary: !0, onClick: () => r("/live/twin"), children: "Open Twin" }),
      /* @__PURE__ */ g.jsx(Xe, { teal: !0, onClick: () => r("/live/climate"), children: "Climate Want" })
    ] })
  ] });
}
function dQ() {
  const [n, e] = j.useState(null), t = typeof window < "u" && window.self !== window.top;
  return j.useEffect(() => {
    if (t) return;
    let i = !1;
    return fetch("/health").then((r) => r.ok ? r.json() : null).then((r) => {
      !i && r?.mode === "demo" && e(r);
    }).catch(() => {
    }), () => {
      i = !0;
    };
  }, [t]), t || !n ? null : /* @__PURE__ */ g.jsxs("div", { className: "dsc-demo-banner", role: "status", "aria-live": "polite", children: [
    /* @__PURE__ */ g.jsx(de, { icon: "alert", label: "Simulated room", tone: "warn" }),
    /* @__PURE__ */ g.jsxs("span", { children: [
      "Software-only WiP demo. No hardware, LAN, or live grow room connected.",
      n.detail ? ` ${n.detail}` : ""
    ] })
  ] });
}
const hQ = !1;
function fQ(n) {
  return hQ;
}
function v3(n, e) {
  const t = Do(n, e), i = lb(e(`binary_sensor.dsc_probe${n}_sensor_stuck`)), r = lb(e(`binary_sensor.dsc_probe${n}_untrusted`)), a = lb(e(`binary_sensor.dsc_probe${n}_sensor_fault`)), s = `binary_sensor.dsc_probe${n}_modbus_probe_online`, o = e(s, ""), c = o !== "" && o !== "unavailable" && o !== "—" && !lb(o), d = t && lb(e("binary_sensor.dsc_peer_mad_alert", "off")), h = [];
  i && h.push("stuck"), r && h.push("untrusted"), a && h.push("sensor fault"), c && h.push("probe dark"), d && h.push("peer divergence");
  let p = "ok";
  return r || i || a ? p = "bad" : (d || c) && (p = "warn"), {
    stuck: i,
    untrusted: r,
    peerDivergence: d,
    blockNeedAct: r || i || a || c,
    tone: p,
    labels: h
  };
}
function lb(n) {
  const e = (n || "").trim().toLowerCase();
  return e === "on" || e === "true" || e === "1";
}
function zN(n, e) {
  return !Number.isFinite(n) || !Number.isFinite(e) ? NaN : 6.112 * Math.exp(17.67 * n / (n + 243.5)) * e * 2.1674 / (273.15 + n);
}
j.lazy(
  () => Promise.resolve().then(() => cMe).then((n) => ({ default: n.DscTwinCanvas }))
);
function pQ(n) {
  return n === "/live/main" || n === "/live/4x8" ? "main" : n === "/live/clone" || n === "/live/2x4" ? "clone" : null;
}
function mQ() {
  const n = ka(), { hass: e, available: t, num: i, state: r, entity: a, tick: s } = wn();
  j.useRef(null), j.useRef(null);
  const [o, l] = j.useState("loading"), [c, d] = j.useState(null), h = pQ(n.pathname), p = !1, v = !1, y = t("binary_sensor.dsc_hub_link") ? r("binary_sensor.dsc_hub_link") !== "on" : !t("sensor.dsc_hub_uptime"), w = j.useMemo(
    () => [],
    [r, a, i, y, s]
  );
  return j.useLayoutEffect(() => {
    {
      d(null);
      return;
    }
  }, [p, n.pathname]), j.useEffect(() => {
  }, []), j.useEffect(() => {
  }, [e, s]), j.useEffect(() => {
  }, [h, n.pathname, o]), j.useEffect(() => {
  }, [v, o]), j.useEffect(() => {
  }, [y, o]), j.useEffect(() => {
  }, [w, o]), null;
}
const vQ = "https://cannalib.plausible-deniability.net", gQ = {
  strain: "/local/dsc-catalog/dsc_strains_search_index.json",
  medium: "/local/dsc-catalog/dsc_mediums_search_index.json",
  nutrient: "/local/dsc-catalog/dsc_nutrients_search_index.json",
  light: "/local/dsc-catalog/dsc_lights_search_index.json"
}, _Q = {
  strain: "strains",
  medium: "mediums",
  nutrient: "nutrients",
  light: "lights"
};
function g3(n) {
  return (n("input_text.dsc_cannalib_base_url", "") || vQ).replace(/\/$/, "");
}
function yQ(n) {
  return g3(n);
}
function EV(n) {
  const e = { Accept: "application/json" }, t = n("input_text.dsc_cannalib_api_key", "");
  return t && t !== "unknown" && t !== "unavailable" && (e["X-Cannalib-Key"] = t), e;
}
function CV(n) {
  if (Array.isArray(n)) return n;
  if (n && typeof n == "object") {
    const e = n;
    if (Array.isArray(e.items)) return e.items;
    if (Array.isArray(e.strains)) return e.strains;
  }
  return [];
}
function yA(n) {
  return String(n.name || n.id || "").trim();
}
const bQ = {
  type: "all",
  format: "all",
  breeder: ""
};
function xQ(n) {
  const e = yA(n).toLowerCase();
  return /\bauto[\s-]?(flower|fem|seeds?)?s?\b/.test(e) ? "auto" : /\b(fem|regular|photoperiod)\b/.test(e) ? "photo" : "unknown";
}
function SQ(n, e) {
  const t = e.breeder.trim().toLowerCase();
  return n.filter((i) => {
    if (e.type !== "all" && !String(i.type ?? "").toLowerCase().includes(e.type))
      return !1;
    const r = xQ(i);
    if (e.format === "auto" && r !== "auto" || e.format === "photo" && r === "auto") return !1;
    if (t) {
      const a = String(i.breeder ?? i.brand ?? "").toLowerCase(), s = yA(i).toLowerCase();
      if (!a.includes(t) && !s.includes(t)) return !1;
    }
    return !0;
  });
}
function wQ(n) {
  const e = String(n.kind ?? "").trim().toLowerCase();
  if (e && e !== "strain" && e !== "cultivar") return !1;
  const t = yA(n), i = t.toLowerCase();
  return !(/\bcapsules?\b/.test(i) || /\brosin\b/.test(i) || /\blubricant\b/.test(i) || /\bthca\s+pebbles?\b/.test(i) || /\d+\s*mg\b/.test(i) || /^#+\s*\d+/.test(t.trim()));
}
function d4(n, e) {
  return n !== "strain" ? e : e.filter(wQ);
}
function h4(n, e) {
  const t = e.trim().toLowerCase();
  if (!t || n.length < 2) return n;
  const i = (r) => {
    if (String(r.matched_via ?? "").toLowerCase() === "science_alias") return 0;
    const s = String(r.science_alias ?? "").toLowerCase();
    return s && s.split(/[,;/|]/).some((o) => o.trim() === t || o.trim().includes(t)) ? 1 : 2;
  };
  return [...n].sort((r, a) => i(r) - i(a));
}
async function MQ(n, e, t = 50, i = 0) {
  const r = await fetch(gQ[n], { cache: "no-store" });
  if (!r.ok) return [];
  const a = CV(await r.json()), s = e.trim().toLowerCase();
  return (s ? a.filter((l) => {
    const c = yA(l).toLowerCase(), d = String(l.type ?? "").toLowerCase(), h = String(l.breeder ?? l.brand ?? "").toLowerCase(), p = String(l.summary ?? "").toLowerCase();
    return c.includes(s) || d.includes(s) || h.includes(s) || p.includes(s);
  }) : a).slice(i, i + t);
}
async function XL(n, e, t, i = 50, r = 0) {
  const a = r > 0 ? ` · offset ${r}` : "";
  try {
    const o = _Q[n], l = `${g3(t)}/v1/catalogs/${o}?q=${encodeURIComponent(e || "")}&limit=${i}&offset=${r}`, c = await fetch(l, { headers: EV(t), cache: "no-store" });
    if (!c.ok) throw new Error(`cannalib ${c.status}`);
    const d = h4(d4(n, CV(await c.json())), e);
    if (d.length || n === "strain")
      return {
        items: d,
        source: "cannalib",
        note: `CannaLib live${a}`
      };
  } catch {
  }
  return {
    items: h4(d4(n, await MQ(n, e, i, r)), e),
    source: "local",
    note: `CannaLib unreachable — local JSON index${a}`
  };
}
async function TQ(n, e) {
  const t = encodeURIComponent(n);
  try {
    const i = await fetch(`${g3(e)}/v1/catalogs/strains/${t}`, {
      headers: EV(e),
      cache: "no-store"
    });
    return i.ok ? await i.json() : null;
  } catch {
    return null;
  }
}
function AV(n) {
  if (!n) return null;
  const e = [n.ppfd_url, n.spectrum_url, n.ppfd_local_url].map((t) => String(t ?? "").trim()).filter(Boolean);
  for (const t of e) {
    if (t.startsWith("/local/dsc-catalog/ppfd/") || t.startsWith("/dsc-catalog/ppfd/") || t.startsWith("/media/ppfd/"))
      return t.startsWith("/local/dsc-catalog/") ? t.replace("/local/dsc-catalog/", "/dsc-catalog/") : t;
    if (t.startsWith("ppfd/") || t.startsWith("./ppfd/"))
      return `/dsc-catalog/${t.replace(/^\.\//, "")}`;
  }
  return null;
}
function EQ(n) {
  return AV(n) != null;
}
let Np = null;
async function CQ() {
  if (Np) return Np;
  try {
    const n = await fetch("/dsc-catalog/ppfd/manifest.json", { cache: "no-store" });
    if (!n.ok)
      return Np = {}, Np;
    Np = await n.json();
  } catch {
    Np = {};
  }
  return Np;
}
function AQ(n, e) {
  const t = AV(n);
  if (t) return t;
  if (!n || !e) return null;
  const i = String(n.name || "").toLowerCase(), r = String(n.id || "").toLowerCase(), a = [
    ["spider_farmer_sf1000", /sf[\s_-]?1000/],
    ["spider_farmer_sf2000", /sf[\s_-]?2000/],
    ["spider_farmer_se7000", /se[\s_-]?7000/],
    ["mars_hydro_ts1000", /ts[\s_-]?1000/]
  ];
  for (const [s, o] of a)
    if (o.test(i) || o.test(r)) {
      const l = e[s];
      if (!l) continue;
      if (l.file) return `/dsc-catalog/ppfd/${l.file}`;
      if (l.local_path)
        return String(l.local_path).replace("/local/dsc-catalog/", "/dsc-catalog/");
    }
  return null;
}
const cb = 50;
function f4(n) {
  switch (n) {
    case "strain":
      return "roster";
    case "medium":
      return "root";
    case "nutrient":
      return "nutrient";
    case "light":
      return "lighting";
    default:
      return n;
  }
}
function RQ(n) {
  const e = String(n.type ?? "").toLowerCase(), t = String(n.name ?? "").toLowerCase();
  return /\bauto/.test(t) || e.includes("auto") ? "strainAuto" : e.includes("indica") && !e.includes("sativa") ? "strainIndica" : e.includes("sativa") && !e.includes("indica") ? "strainSativa" : e.includes("hybrid") || e.includes("indica") && e.includes("sativa") ? "strainHybrid" : "roster";
}
function FN(n) {
  return String(n.id || n.name_norm || n.name || "");
}
function Yb({
  kind: n,
  onPick: e,
  placeholder: t
}) {
  const { state: i } = wn(), [r, a] = j.useState(""), [s, o] = j.useState([]), [l, c] = j.useState("local"), [d, h] = j.useState(""), [p, v] = j.useState(!1), [y, w] = j.useState(!1), [S, x] = j.useState(0), [E, C] = j.useState(!1), [A, k] = j.useState(bQ), D = j.useRef(null);
  j.useEffect(() => {
    let I = !1;
    const U = window.setTimeout(() => {
      v(!0), x(0), XL(n, r, i, cb, 0).then((W) => {
        I || (o(W.items), c(W.source), h(W.note), C(W.items.length >= cb), v(!1));
      }).catch(() => {
        I || (o([]), C(!1), h("Catalog search failed — try again."), v(!1));
      });
    }, 200);
    return () => {
      I = !0, window.clearTimeout(U);
    };
  }, [n, r]);
  const O = async () => {
    const I = s.length;
    w(!0);
    try {
      const U = await XL(n, r, i, cb, I);
      c(U.source), h(U.note), o((W) => {
        const V = new Set(W.map(FN)), Y = U.items.filter((q) => {
          const G = FN(q);
          return !G || V.has(G) ? !1 : (V.add(G), !0);
        });
        return Y.length ? (C(U.items.length >= cb), x(I), [...W, ...Y]) : (C(!1), W);
      });
    } catch {
      C(!1);
    } finally {
      w(!1);
    }
  }, F = j.useMemo(() => n !== "strain" ? s : SQ(s, A), [s, n, A]);
  j.useEffect(() => {
    D.current?.scrollTo({ top: 0 });
  }, [r, A, n]);
  const P = n === "strain" && F.length !== s.length ? `${F.length} of ${s.length} hits after filters` : F.length ? `${F.length} hit${F.length === 1 ? "" : "s"}${E ? "+" : ""}` : "";
  return /* @__PURE__ */ g.jsxs("div", { className: "dsc-catalog-picker", children: [
    /* @__PURE__ */ g.jsxs("div", { className: "dsc-catalog-picker-head", children: [
      /* @__PURE__ */ g.jsx(cr, { name: f4(n), size: 16, color: "var(--dsc-teal)" }),
      /* @__PURE__ */ g.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 0, flex: 1 }, children: [
        /* @__PURE__ */ g.jsx(
          de,
          {
            icon: l === "cannalib" ? "research" : "catalog",
            label: l === "cannalib" ? "Cannalib" : "Local JSON",
            tone: l === "cannalib" ? "ok" : "warn"
          }
        ),
        p ? /* @__PURE__ */ g.jsx(de, { icon: "search", motion: "breathe", label: "Searching…", tone: "muted" }) : null,
        d ? /* @__PURE__ */ g.jsx("span", { className: "dsc-muted", style: { fontSize: 12 }, children: d }) : null,
        P ? /* @__PURE__ */ g.jsx("span", { className: "dsc-muted", style: { fontSize: 12 }, children: P }) : null
      ] })
    ] }),
    /* @__PURE__ */ g.jsxs("label", { className: "dsc-catalog-search", children: [
      /* @__PURE__ */ g.jsx(cr, { name: "search", size: 14, color: "var(--dsc-gray-5)", motion: p ? "spin" : void 0 }),
      /* @__PURE__ */ g.jsx(
        "input",
        {
          type: "search",
          value: r,
          placeholder: t || (n === "strain" ? "Search name, type, breeder, summary…" : "Type to search — options are not culled"),
          onChange: (I) => a(I.target.value),
          autoComplete: "off"
        }
      )
    ] }),
    n === "strain" ? /* @__PURE__ */ g.jsxs("div", { className: "dsc-catalog-filters", "aria-label": "Strain search filters", children: [
      /* @__PURE__ */ g.jsxs("label", { children: [
        "Type",
        /* @__PURE__ */ g.jsxs(
          "select",
          {
            value: A.type,
            onChange: (I) => k((U) => ({ ...U, type: I.target.value })),
            children: [
              /* @__PURE__ */ g.jsx("option", { value: "all", children: "All types" }),
              /* @__PURE__ */ g.jsx("option", { value: "indica", children: "Indica" }),
              /* @__PURE__ */ g.jsx("option", { value: "sativa", children: "Sativa" }),
              /* @__PURE__ */ g.jsx("option", { value: "hybrid", children: "Hybrid" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ g.jsxs("label", { children: [
        "Format",
        /* @__PURE__ */ g.jsxs(
          "select",
          {
            value: A.format,
            onChange: (I) => k((U) => ({ ...U, format: I.target.value })),
            children: [
              /* @__PURE__ */ g.jsx("option", { value: "all", children: "All formats" }),
              /* @__PURE__ */ g.jsx("option", { value: "auto", children: "Autoflower" }),
              /* @__PURE__ */ g.jsx("option", { value: "photo", children: "Photoperiod" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ g.jsxs("label", { className: "dsc-catalog-filter-breeder", children: [
        "Seed bank / breeder",
        /* @__PURE__ */ g.jsx(
          "input",
          {
            type: "search",
            value: A.breeder,
            placeholder: "e.g. Herbies, Barney's",
            onChange: (I) => k((U) => ({ ...U, breeder: I.target.value })),
            autoComplete: "off"
          }
        )
      ] })
    ] }) : null,
    /* @__PURE__ */ g.jsxs("ul", { className: "dsc-catalog-hits", ref: D, children: [
      p && !F.length ? /* @__PURE__ */ g.jsx("li", { className: "dsc-muted", children: "Searching…" }) : null,
      !p && !F.length ? /* @__PURE__ */ g.jsx("li", { className: "dsc-muted", children: n === "strain" && s.length ? "No hits match filters — widen type/format or clear breeder." : "No catalog hits — empty is honesty, not a placeholder." }) : null,
      F.map((I, U) => /* @__PURE__ */ g.jsx("li", { children: /* @__PURE__ */ g.jsxs("button", { type: "button", onClick: () => e(I), children: [
        /* @__PURE__ */ g.jsx(
          cr,
          {
            name: n === "strain" ? RQ(I) : f4(n),
            size: 13,
            color: "var(--dsc-teal)"
          }
        ),
        /* @__PURE__ */ g.jsx("strong", { children: I.name }),
        I.type ? /* @__PURE__ */ g.jsx("em", { children: String(I.type) }) : null,
        I.breeder ? /* @__PURE__ */ g.jsx("span", { className: "dsc-muted", children: String(I.breeder) }) : null
      ] }) }, `${FN(I)}-${U}`))
    ] }),
    E && !p ? /* @__PURE__ */ g.jsxs("div", { className: "dsc-row-actions", style: { marginTop: 8 }, children: [
      /* @__PURE__ */ g.jsx(Xe, { variant: "secondary", disabled: y, onClick: () => void O(), children: y ? "Loading…" : `Load more (${cb})` }),
      S > 0 ? /* @__PURE__ */ g.jsxs("span", { className: "dsc-muted", style: { fontSize: 12 }, children: [
        "Showing ",
        s.length
      ] }) : null
    ] }) : null
  ] });
}
const Td = [1, 2, 3];
function RV(n, e) {
  return Td.find((i) => !n[i] && i !== e) ?? Td.find((i) => !n[i]) ?? 3;
}
function BN(n, e, t, i) {
  const r = RV(i, n), a = Td.filter((h) => h !== n && h !== r), s = a.reduce((h, p) => h + (Number.isFinite(t[p]) ? Math.round(t[p]) : 0), 0), o = Math.max(0, 100 - s), l = Math.max(0, Math.min(o, Math.round(e))), c = o - l, d = { ...t, [n]: l, [r]: c };
  return a.forEach((h) => {
    d[h] = Math.round(Number.isFinite(t[h]) ? t[h] : 0);
  }), d;
}
function NQ({ volumeL: n }) {
  const { state: e, num: t, available: i } = wn(), { callService: r } = ya(), [a, s] = j.useState({ 1: !1, 2: !1, 3: !1 }), [o, l] = j.useState(null), [c, d] = j.useState(null), h = {
    1: t("input_number.dsc_blend_pct_1", 0),
    2: t("input_number.dsc_blend_pct_2", 0),
    3: t("input_number.dsc_blend_pct_3", 0)
  }, p = c ?? h, v = Td.map((D) => ({
    n: D,
    name: e(`input_text.dsc_blend_component_${D}_name`, ""),
    pct: Number.isFinite(p[D]) ? p[D] : 0
  })), y = Td.filter((D) => a[D]).length, w = RV(a), S = Number.isFinite(n) && n > 0 ? n : t("input_number.dsc_blend_total_l", 20), x = v.reduce((D, O) => D + (Number.isFinite(O.pct) ? O.pct : 0), 0), E = (D) => {
    Td.forEach((O) => {
      i(`input_number.dsc_blend_pct_${O}`) && r("input_number", "set_value", {
        entity_id: `input_number.dsc_blend_pct_${O}`,
        value: D[O]
      });
    });
  }, C = (D, O) => {
    const F = BN(D, O, c ?? p, a);
    d(null), l(null), E(F);
  }, A = (D) => {
    s((O) => {
      const F = { ...O, [D]: !O[D] };
      return Td.filter((I) => F[I]).length >= Td.length ? O : F;
    });
  }, k = j.useMemo(
    () => v.filter((D) => D.pct > 0 && D.name && D.name !== "unknown").map((D) => `${D.name} ${(S * D.pct / 100).toFixed(1)}L (${Math.round(D.pct)}%)`).join(" · "),
    [v, S]
  );
  return /* @__PURE__ */ g.jsxs("div", { className: "dsc-coupled-mix", children: [
    /* @__PURE__ */ g.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ g.jsx(de, { label: `Σ ${Math.round(x)}%`, tone: Math.round(x) === 100 ? "ok" : "warn", icon: "compose" }),
      /* @__PURE__ */ g.jsx(de, { label: `${S} L vessel`, tone: "muted", icon: "tank" }),
      /* @__PURE__ */ g.jsx("span", { className: "dsc-muted", style: { fontSize: 12 }, children: "Lock the layers you want to keep — the remainder layer soaks up the rest so the total is always 100%." })
    ] }),
    Td.map((D) => {
      const O = v[D - 1], F = D === w && !a[D];
      return /* @__PURE__ */ g.jsxs("div", { className: "dsc-mix-row", children: [
        /* @__PURE__ */ g.jsx(qT, { entityId: `input_text.dsc_blend_component_${D}_name`, label: `Layer ${D}` }),
        /* @__PURE__ */ g.jsx(
          "input",
          {
            type: "range",
            min: 0,
            max: 100,
            value: Math.round(O.pct),
            disabled: a[D] || F,
            onPointerDown: (P) => {
              a[D] || F || (P.target.setPointerCapture(P.pointerId), l(D), d({ ...p }));
            },
            onPointerUp: (P) => {
              o === D && C(D, Number(P.target.value));
            },
            onPointerCancel: () => {
              d(null), l(null);
            },
            onLostPointerCapture: (P) => {
              o === D && C(D, Number(P.target.value));
            },
            onChange: (P) => {
              const I = Number(P.target.value);
              if (o === D) {
                d(BN(D, I, c ?? p, a));
                return;
              }
              E(BN(D, I, p, a));
            }
          }
        ),
        /* @__PURE__ */ g.jsxs("strong", { children: [
          Math.round(O.pct),
          "%"
        ] }),
        /* @__PURE__ */ g.jsxs("span", { className: "dsc-mono", children: [
          (S * O.pct / 100).toFixed(1),
          " L"
        ] }),
        /* @__PURE__ */ g.jsx(Xe, { disabled: y >= 2 && !a[D], onClick: () => A(D), children: a[D] ? "Unlock" : F ? "Remainder" : "Lock" })
      ] }, D);
    }),
    /* @__PURE__ */ g.jsxs("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: [
      "Recipe: ",
      k || "Mix not set yet."
    ] })
  ] });
}
const _3 = "sensor.dsc_hub_uptime", NV = "sensor.dsc_hub_heartbeat";
function kQ(n, e) {
  if (!e || n == null || n === "") return NaN;
  const t = n.trim().toLowerCase();
  if (t === "unavailable" || t === "unknown" || t === "none") return NaN;
  const i = Number(n);
  return Number.isFinite(i) ? i : NaN;
}
function jt(n) {
  const { available: e, tick: t, entity: i } = wn(), r = Pr(), a = qd(), s = j.useRef({}), [, o] = j.useState(0), l = a === "pi" ? AS(n, r) : null, c = a === "pi" ? o3(n, r) : !1, d = a === "pi" ? tK(r) : !e(_3) || !e(NV), h = a === "pi" && c || e(n), p = l != null && Number.isFinite(l) ? l : kQ(i(n)?.state, h), v = d && p === 0, y = s.current[n];
  return j.useEffect(() => {
    if (h && Number.isFinite(p) && !v) {
      s.current[n] = { value: p, at: Date.now() }, o((w) => w + 1);
      return;
    }
    o((w) => w + 1);
  }, [n, h, p, v, t, i]), h && Number.isFinite(p) && !v ? { value: p, stale: !1, heldAt: y?.at, live: !0 } : y != null ? {
    value: y.value,
    stale: !0,
    heldAt: y.at,
    live: !1
  } : { value: NaN, stale: !1, heldAt: void 0, live: !1 };
}
function y3(n) {
  const { available: e, entity: t, tick: i } = wn(), r = Pr();
  if (qd() === "pi" && n === _3 && r.hub.online || e(n)) return null;
  const s = t(n)?.last_changed;
  if (!s) return null;
  const o = Date.parse(s);
  return Number.isFinite(o) ? Date.now() - o : null;
}
function kV() {
  const n = Pr(), e = qd(), t = y3(_3);
  return e === "pi" && !n.hub.online && n.hub.last_seen ? Date.now() - n.hub.last_seen * 1e3 : t;
}
function DV() {
  return y3(NV);
}
function LV() {
  const n = Pr(), e = qd(), t = y3("binary_sensor.dsc_hub_panel_link");
  return e === "pi" && !n.panel.online && n.panel.last_seen ? Date.now() - n.panel.last_seen * 1e3 : t;
}
function b3(n) {
  return !!n && Number.isFinite(n.min) && Number.isFinite(n.max) && n.max > n.min;
}
function NS(n) {
  if (n.available === !1 || !Number.isFinite(n.value)) return "muted";
  if (n.stale) return "stale";
  if (n.fault) return "critical";
  if (b3(n.band)) {
    const e = n.margin ?? 0;
    if (n.value < n.band.min - e || n.value > n.band.max + e)
      return n.value < n.band.min - e * 3 || n.value > n.band.max + e * 3 ? "critical" : "warn";
  }
  return "ok";
}
function DQ(n) {
  switch (n) {
    case "ok":
      return "is-ok";
    case "warn":
      return "is-warn";
    case "critical":
      return "is-bad";
    case "stale":
      return "is-stale";
    case "muted":
      return "is-muted";
    default:
      return n;
  }
}
function x3(n) {
  switch (n) {
    case "ok":
      return "var(--dsc-neon)";
    case "warn":
    case "stale":
      return "var(--dsc-amber)";
    case "critical":
      return "var(--dsc-bad)";
    case "muted":
      return "var(--dsc-gray-5)";
    default:
      return n;
  }
}
function bA(n, e) {
  if (!b3(n)) return;
  const t = e === "°C" ? 1 : 0.05;
  return Math.max((n.max - n.min) * 0.12, t);
}
const ZT = [
  "Germination",
  "Seedling",
  "Early Vegetative",
  "Vegetative",
  "Late (Push) Vegetative",
  "Early Flowering",
  "Flowering",
  "Late Flowering",
  "Final 48-72h Flowering",
  "Dry Mode"
], UN = {
  Germination: { temp: 25, vpdMin: 0.4, vpdMax: 0.8, rhMin: 70, rhMax: 80, lightHours: 18, short: "Germ" },
  Seedling: { temp: 24, vpdMin: 0.5, vpdMax: 0.8, rhMin: 65, rhMax: 75, lightHours: 18, short: "Seedling" },
  "Early Vegetative": { temp: 25, vpdMin: 0.7, vpdMax: 1, rhMin: 60, rhMax: 70, lightHours: 18, short: "Early Veg" },
  Vegetative: { temp: 26, vpdMin: 0.8, vpdMax: 1.1, rhMin: 55, rhMax: 65, lightHours: 18, short: "Veg" },
  "Late (Push) Vegetative": { temp: 26, vpdMin: 1, vpdMax: 1.2, rhMin: 50, rhMax: 60, lightHours: 18, short: "Push Veg" },
  "Early Flowering": { temp: 25, vpdMin: 1, vpdMax: 1.2, rhMin: 50, rhMax: 55, lightHours: 12, short: "Early Flwr" },
  Flowering: { temp: 24, vpdMin: 1.2, vpdMax: 1.4, rhMin: 45, rhMax: 50, lightHours: 12, short: "Flower" },
  "Late Flowering": { temp: 22, vpdMin: 1.3, vpdMax: 1.5, rhMin: 40, rhMax: 45, lightHours: 12, short: "Late Flwr" },
  "Final 48-72h Flowering": { temp: 21, vpdMin: 1.4, vpdMax: 1.6, rhMin: 35, rhMax: 45, lightHours: 12, short: "Flush" },
  "Dry Mode": { temp: 19, vpdMin: 0.8, vpdMax: 1, rhMin: 55, rhMax: 62, lightHours: 0, short: "Dry" }
};
function jw(n, e) {
  const t = Number(n(e, ""));
  return Number.isFinite(t) && t > 0 ? t : NaN;
}
function YL(n) {
  if (!n || n === "—" || n === "Off" || n === "Custom") return null;
  const e = UN[n];
  if (e) return e;
  const t = Object.keys(UN).find((i) => n.indexOf(i) >= 0);
  return t ? UN[t] : null;
}
function jN(n, e) {
  return !Number.isFinite(e.min) || !Number.isFinite(e.max) ? n : n ? {
    min: Math.max(n.min, e.min),
    max: Math.min(n.max, e.max),
    source: n.source === "plant" || e.source === "plant" ? "plant" : "stage",
    mixed: n.source !== e.source || n.mixed
  } : { ...e, mixed: !1 };
}
function qL(n, e) {
  const t = m3(n, e.state, e.entity).filter((p) => Do(p.pot, e.state));
  let i = null, r = null, a = null, s = null;
  const o = [], l = [];
  let c = !1;
  for (const p of t) {
    p.stage && p.stage !== "—" && (o.length && !o.includes(p.stage) && (c = !0), o.includes(p.stage) || o.push(p.stage)), p.need && p.need !== "—" && p.need !== "ok" && !l.includes(p.need) && l.push(p.need);
    const v = jw(e.state, `sensor.dsc_probe${p.pot}_want_temp_min`), y = jw(e.state, `sensor.dsc_probe${p.pot}_want_temp_max`);
    Number.isFinite(v) && Number.isFinite(y) && (i = jN(i, { min: v, max: y, source: "plant" }));
    const w = jw(e.state, `sensor.dsc_probe${p.pot}_want_rh_min`), S = jw(e.state, `sensor.dsc_probe${p.pot}_want_rh_max`);
    Number.isFinite(w) && Number.isFinite(S) && (r = jN(r, { min: w, max: S, source: "plant" }));
    const x = YL(p.stage);
    x && (i || (i = { min: x.temp - 1.5, max: x.temp + 1.5, source: "stage", mixed: !1 }), r || (r = { min: x.rhMin, max: x.rhMax, source: "stage", mixed: !1 }), a = jN(a, { min: x.vpdMin, max: x.vpdMax, source: "stage" }), s = s == null ? x.lightHours : Math.min(s, x.lightHours));
  }
  const d = n === "main" ? e.state("select.dsc_hub_grow_stage", "") : e.state("select.dsc_hub_clone_mode", "");
  if (!t.length || !i && !r && !a) {
    const p = n === "clone" ? d === "Follow Plants" || d === "Clones & Seedlings" ? "Seedling" : d === "Custom" || d === "Mother" ? "Vegetative" : "" : d, v = YL(p);
    v && (i || (i = { min: v.temp - 1.5, max: v.temp + 1.5, source: "stage", mixed: !1 }), r || (r = { min: v.rhMin, max: v.rhMax, source: "stage", mixed: !1 }), a || (a = { min: v.vpdMin, max: v.vpdMax, source: "stage", mixed: !1 }), s == null && (s = v.lightHours), p && !o.includes(p) && o.push(p));
  }
  return i && i.min > i.max && (i = { ...i, min: i.max, max: i.min, mixed: !0 }), r && r.min > r.max && (r = { ...r, min: r.max, max: r.min, mixed: !0 }), a && a.min > a.max && (a = { ...a, min: a.max, max: a.min, mixed: !0 }), {
    temp: i,
    rh: r,
    vpd: a,
    lightHours: s,
    mixed: c,
    stages: o,
    needs: l,
    emptyLabel: !i && !r && !a ? "no plant/stage rail" : null
  };
}
function LQ(n) {
  if (n.stages.length === 1) {
    const e = n.stages[0];
    return n.lightHours != null ? `${e} · ${n.lightHours}h rail` : `${e} · stage rail`;
  }
  return null;
}
function IQ(n, e, t) {
  const i = LQ(n);
  if (!i) return t;
  switch (e) {
    case "ok":
      return i;
    case "warn":
    case "stale":
      return `approaching · ${i}`;
    case "critical":
      return `outside · ${i}`;
    case "muted":
      return n.emptyLabel ?? i;
    default:
      return e;
  }
}
function uf(n, e, t, i) {
  if (t) return { tone: "critical", label: "min > max" };
  if (!e) return { tone: "muted", label: i?.emptyLabel ?? "no plant/stage rail" };
  const r = NS({ value: n, band: e, margin: (e.max - e.min) * 0.12 }), a = e.source === "plant" ? "plant Want" : "stage rail", s = r === "ok" ? `in-band · ${a}` : r === "warn" || r === "stale" ? `approaching · ${a}` : r === "critical" ? `outside · ${a}` : a;
  if (i && e.source === "stage")
    return { tone: r, label: IQ(i, r, s) };
  switch (r) {
    case "ok":
      return { tone: r, label: s };
    case "warn":
    case "stale":
      return { tone: "warn", label: s };
    case "critical":
      return { tone: r, label: s };
    case "muted":
      return { tone: r, label: s };
    default:
      return r;
  }
}
function HN(n, e, t) {
  const i = Number(t(`sensor.dsc_probe${n}_want_${e}_min`, "")), r = Number(t(`sensor.dsc_probe${n}_want_${e}_max`, ""));
  if (Number.isFinite(i) && Number.isFinite(r) && r >= i) return { min: i, max: r };
}
function ZL(n, e) {
  if (n.stages.length === 1) {
    const t = n.lightHours != null ? `${n.lightHours}h rail` : "stage rail";
    return `${n.stages[0]} · ${t}`;
  }
  return n.stages.length > 1 ? `Mixed stages · ${n.stages.join(", ")}` : e === "clone" ? "2×4 empty · assign pots or set clone mode" : e === "main" ? "4×8 empty · assign pots or grow stage" : n.emptyLabel ?? "no plant/stage rail";
}
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var KL = function(n, e) {
  return KL = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var r in i) Object.prototype.hasOwnProperty.call(i, r) && (t[r] = i[r]);
  }, KL(n, e);
};
function Ft(n, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  KL(n, e);
  function t() {
    this.constructor = n;
  }
  n.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var S3 = 12, PQ = "sans-serif", kf = S3 + "px " + PQ, OQ = 20, zQ = 100, FQ = "007LLmW'55;N0500LLLLLLLLLL00NNNLzWW\\\\WQb\\0FWLg\\bWb\\WQ\\WrWWQ000CL5LLFLL0LL**F*gLLLL5F0LF\\FFF5.5N";
function BQ(n) {
  var e = {};
  if (typeof JSON > "u")
    return e;
  for (var t = 0; t < n.length; t++) {
    var i = String.fromCharCode(t + 32), r = (n.charCodeAt(t) - OQ) / zQ;
    e[i] = r;
  }
  return e;
}
var UQ = BQ(FQ), Lo = {
  createCanvas: function() {
    return typeof document < "u" && document.createElement("canvas");
  },
  measureText: /* @__PURE__ */ (function() {
    var n, e;
    return function(t, i) {
      if (!n) {
        var r = Lo.createCanvas();
        n = r && r.getContext("2d");
      }
      if (n)
        return e !== i && (e = n.font = i || kf), n.measureText(t);
      t = t || "", i = i || kf;
      var a = /((?:\d+)?\.?\d*)px/.exec(i), s = a && +a[1] || S3, o = 0;
      if (i.indexOf("mono") >= 0)
        o = s * t.length;
      else
        for (var l = 0; l < t.length; l++) {
          var c = UQ[t[l]];
          o += c == null ? s : c * s;
        }
      return { width: o };
    };
  })(),
  loadImage: function(n, e, t) {
    var i = new Image();
    return i.onload = e, i.onerror = t, i.src = n, i;
  },
  getTime: function() {
    return Date.now ? Date.now() : +/* @__PURE__ */ new Date();
  }
}, IV = sv([
  "Function",
  "RegExp",
  "Date",
  "Error",
  "CanvasGradient",
  "CanvasPattern",
  "Image",
  "Canvas"
], function(n, e) {
  return n["[object " + e + "]"] = !0, n;
}, {}), PV = sv([
  "Int8",
  "Uint8",
  "Uint8Clamped",
  "Int16",
  "Uint16",
  "Int32",
  "Uint32",
  "Float32",
  "Float64"
], function(n, e) {
  return n["[object " + e + "Array]"] = !0, n;
}, {}), kS = Object.prototype.toString, xA = Array.prototype, jQ = xA.forEach, HQ = xA.filter, w3 = xA.slice, VQ = xA.map, p4 = function() {
}.constructor, Hw = p4 ? p4.prototype : null, M3 = "__proto__", VN = 2311, GQ = Math.pow(2, 53) - 1;
function OV() {
  return VN >= GQ && (VN = 0), VN++;
}
function T3() {
  for (var n = [], e = 0; e < arguments.length; e++)
    n[e] = arguments[e];
  typeof console < "u" && console.error.apply(console, n);
}
function sn(n) {
  if (n == null || typeof n != "object")
    return n;
  var e = n, t = kS.call(n);
  if (t === "[object Array]") {
    if (!sx(n)) {
      e = [];
      for (var i = 0, r = n.length; i < r; i++)
        e[i] = sn(n[i]);
    }
  } else if (PV[t]) {
    if (!sx(n)) {
      var a = n.constructor;
      if (a.from)
        e = a.from(n);
      else {
        e = new a(n.length);
        for (var i = 0, r = n.length; i < r; i++)
          e[i] = n[i];
      }
    }
  } else if (!IV[t] && !sx(n) && !zx(n)) {
    e = {};
    for (var s in n)
      n.hasOwnProperty(s) && s !== M3 && (e[s] = sn(n[s]));
  }
  return e;
}
function Jn(n, e, t) {
  if (!Gt(e) || !Gt(n))
    return t ? sn(e) : n;
  for (var i in e)
    if (e.hasOwnProperty(i) && i !== M3) {
      var r = n[i], a = e[i];
      Gt(a) && Gt(r) && !mt(a) && !mt(r) && !zx(a) && !zx(r) && !m4(a) && !m4(r) && !sx(a) && !sx(r) ? Jn(r, a, t) : (t || !(i in n)) && (n[i] = sn(e[i]));
    }
  return n;
}
function WQ(n, e) {
  for (var t = n[0], i = 1, r = n.length; i < r; i++)
    t = Jn(t, n[i], e);
  return t;
}
function ut(n, e) {
  if (Object.assign)
    Object.assign(n, e);
  else
    for (var t in e)
      e.hasOwnProperty(t) && t !== M3 && (n[t] = e[t]);
  return n;
}
function $Q(n, e, t) {
  n = n || {};
  for (var i = 0; i < t.length; i++) {
    var r = t[i];
    n[r] = e[r];
  }
  return n;
}
function yi(n, e, t) {
  for (var i = ci(e), r = 0, a = i.length; r < a; r++) {
    var s = i[r];
    n[s] == null && (n[s] = e[s]);
  }
  return n;
}
function Nn(n, e) {
  if (n) {
    if (n.indexOf)
      return n.indexOf(e);
    for (var t = 0, i = n.length; t < i; t++)
      if (n[t] === e)
        return t;
  }
  return -1;
}
function XQ(n, e) {
  var t = n.prototype;
  function i() {
  }
  i.prototype = e.prototype, n.prototype = new i();
  for (var r in t)
    t.hasOwnProperty(r) && (n.prototype[r] = t[r]);
  n.prototype.constructor = n, n.superClass = e;
}
function Uo(n, e, t) {
  if (n = "prototype" in n ? n.prototype : n, e = "prototype" in e ? e.prototype : e, Object.getOwnPropertyNames)
    for (var i = Object.getOwnPropertyNames(e), r = 0; r < i.length; r++) {
      var a = i[r];
      a !== "constructor" && n[a] == null && (n[a] = e[a]);
    }
  else
    yi(n, e);
}
function Us(n) {
  return !n || typeof n == "string" ? !1 : typeof n.length == "number";
}
function ae(n, e, t) {
  if (n && e)
    if (n.forEach && n.forEach === jQ)
      n.forEach(e, t);
    else if (n.length === +n.length)
      for (var i = 0, r = n.length; i < r; i++)
        e.call(t, n[i], i, n);
    else
      for (var a in n)
        n.hasOwnProperty(a) && e.call(t, n[a], a, n);
}
function zt(n, e, t) {
  if (!n)
    return [];
  if (!e)
    return E3(n);
  if (n.map && n.map === VQ)
    return n.map(e, t);
  for (var i = [], r = 0, a = n.length; r < a; r++)
    i.push(e.call(t, n[r], r, n));
  return i;
}
function sv(n, e, t, i) {
  if (n && e) {
    for (var r = 0, a = n.length; r < a; r++)
      t = e.call(i, t, n[r], r, n);
    return t;
  }
}
function $r(n, e, t) {
  if (!n)
    return [];
  if (!e)
    return E3(n);
  if (n.filter && n.filter === HQ)
    return n.filter(e, t);
  for (var i = [], r = 0, a = n.length; r < a; r++)
    e.call(t, n[r], r, n) && i.push(n[r]);
  return i;
}
function zV(n, e, t) {
  if (n && e) {
    for (var i = 0, r = n.length; i < r; i++)
      if (e.call(t, n[i], i, n))
        return n[i];
  }
}
function ci(n) {
  if (!n)
    return [];
  if (Object.keys)
    return Object.keys(n);
  var e = [];
  for (var t in n)
    n.hasOwnProperty(t) && e.push(t);
  return e;
}
function YQ(n, e) {
  for (var t = [], i = 2; i < arguments.length; i++)
    t[i - 2] = arguments[i];
  return function() {
    return n.apply(e, t.concat(w3.call(arguments)));
  };
}
var yn = Hw && on(Hw.bind) ? Hw.call.bind(Hw.bind) : YQ;
function Mi(n) {
  for (var e = [], t = 1; t < arguments.length; t++)
    e[t - 1] = arguments[t];
  return function() {
    return n.apply(this, e.concat(w3.call(arguments)));
  };
}
function mt(n) {
  return Array.isArray ? Array.isArray(n) : kS.call(n) === "[object Array]";
}
function on(n) {
  return typeof n == "function";
}
function Lt(n) {
  return typeof n == "string";
}
function QL(n) {
  return kS.call(n) === "[object String]";
}
function Ci(n) {
  return typeof n == "number";
}
function Gt(n) {
  var e = typeof n;
  return e === "function" || !!n && e === "object";
}
function m4(n) {
  return !!IV[kS.call(n)];
}
function bo(n) {
  return !!PV[kS.call(n)];
}
function zx(n) {
  return typeof n == "object" && typeof n.nodeType == "number" && typeof n.ownerDocument == "object";
}
function SA(n) {
  return n.colorStops != null;
}
function qQ(n) {
  return n.image != null;
}
function Fx(n) {
  return n !== n;
}
function Al() {
  for (var n = [], e = 0; e < arguments.length; e++)
    n[e] = arguments[e];
  for (var t = 0, i = n.length; t < i; t++)
    if (n[t] != null)
      return n[t];
}
function Ot(n, e) {
  return n ?? e;
}
function Lm(n, e, t) {
  return n ?? e ?? t;
}
function E3(n) {
  for (var e = [], t = 1; t < arguments.length; t++)
    e[t - 1] = arguments[t];
  return w3.apply(n, e);
}
function C3(n) {
  if (typeof n == "number")
    return [n, n, n, n];
  var e = n.length;
  return e === 2 ? [n[0], n[1], n[0], n[1]] : e === 3 ? [n[0], n[1], n[2], n[1]] : n;
}
function vc(n, e) {
  if (!n)
    throw new Error(e);
}
function pu(n) {
  return n == null ? null : typeof n.trim == "function" ? n.trim() : n.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
}
var FV = "__ec_primitive__";
function JL(n) {
  n[FV] = !0;
}
function sx(n) {
  return n[FV];
}
var ZQ = (function() {
  function n() {
    this.data = {};
  }
  return n.prototype.delete = function(e) {
    var t = this.has(e);
    return t && delete this.data[e], t;
  }, n.prototype.has = function(e) {
    return this.data.hasOwnProperty(e);
  }, n.prototype.get = function(e) {
    return this.data[e];
  }, n.prototype.set = function(e, t) {
    return this.data[e] = t, this;
  }, n.prototype.keys = function() {
    return ci(this.data);
  }, n.prototype.forEach = function(e) {
    var t = this.data;
    for (var i in t)
      t.hasOwnProperty(i) && e(t[i], i);
  }, n;
})(), BV = typeof Map == "function";
function KQ() {
  return BV ? /* @__PURE__ */ new Map() : new ZQ();
}
var QQ = (function() {
  function n(e) {
    var t = mt(e);
    this.data = KQ();
    var i = this;
    e instanceof n ? e.each(r) : e && ae(e, r);
    function r(a, s) {
      t ? i.set(a, s) : i.set(s, a);
    }
  }
  return n.prototype.hasKey = function(e) {
    return this.data.has(e);
  }, n.prototype.get = function(e) {
    return this.data.get(e);
  }, n.prototype.set = function(e, t) {
    return this.data.set(e, t), t;
  }, n.prototype.each = function(e, t) {
    this.data.forEach(function(i, r) {
      e.call(t, i, r);
    });
  }, n.prototype.keys = function() {
    var e = this.data.keys();
    return BV ? Array.from(e) : e;
  }, n.prototype.removeKey = function(e) {
    this.data.delete(e);
  }, n;
})();
function Kt(n) {
  return new QQ(n);
}
function JQ(n, e) {
  for (var t = new n.constructor(n.length + e.length), i = 0; i < n.length; i++)
    t[i] = n[i];
  for (var r = n.length, i = 0; i < e.length; i++)
    t[i + r] = e[i];
  return t;
}
function wA(n, e) {
  var t;
  if (Object.create)
    t = Object.create(n);
  else {
    var i = function() {
    };
    i.prototype = n, t = new i();
  }
  return e && ut(t, e), t;
}
function UV(n) {
  var e = n.style;
  e.webkitUserSelect = "none", e.userSelect = "none", e.webkitTapHighlightColor = "rgba(0,0,0,0)", e["-webkit-touch-callout"] = "none";
}
function an(n, e) {
  return n.hasOwnProperty(e);
}
function Na() {
}
var eJ = 180 / Math.PI, tJ = /* @__PURE__ */ (function() {
  function n() {
    this.firefox = !1, this.ie = !1, this.edge = !1, this.newEdge = !1, this.weChat = !1;
  }
  return n;
})(), nJ = /* @__PURE__ */ (function() {
  function n() {
    this.browser = new tJ(), this.node = !1, this.wxa = !1, this.worker = !1, this.svgSupported = !1, this.touchEventsSupported = !1, this.pointerEventsSupported = !1, this.domSupported = !1, this.transformSupported = !1, this.transform3dSupported = !1, this.hasGlobalWindow = typeof window < "u";
  }
  return n;
})(), _n = new nJ();
typeof wx == "object" && typeof wx.getSystemInfoSync == "function" ? (_n.wxa = !0, _n.touchEventsSupported = !0) : typeof document > "u" && typeof self < "u" ? _n.worker = !0 : !_n.hasGlobalWindow || "Deno" in window || typeof navigator < "u" && typeof navigator.userAgent == "string" && navigator.userAgent.indexOf("Node.js") > -1 ? (_n.node = !0, _n.svgSupported = !0) : iJ(navigator.userAgent, _n);
function iJ(n, e) {
  var t = e.browser, i = n.match(/Firefox\/([\d.]+)/), r = n.match(/MSIE\s([\d.]+)/) || n.match(/Trident\/.+?rv:(([\d.]+))/), a = n.match(/Edge?\/([\d.]+)/), s = /micromessenger/i.test(n);
  i && (t.firefox = !0, t.version = i[1]), r && (t.ie = !0, t.version = r[1]), a && (t.edge = !0, t.version = a[1], t.newEdge = +a[1].split(".")[0] > 18), s && (t.weChat = !0), e.svgSupported = typeof SVGRect < "u", e.touchEventsSupported = "ontouchstart" in window && !t.ie && !t.edge, e.pointerEventsSupported = "onpointerdown" in window && (t.edge || t.ie && +t.version >= 11);
  var o = e.domSupported = typeof document < "u";
  if (o) {
    var l = document.documentElement.style;
    e.transform3dSupported = (t.ie && "transition" in l || t.edge || "WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix() || "MozPerspective" in l) && !("OTransition" in l), e.transformSupported = e.transform3dSupported || t.ie && +t.version >= 9;
  }
}
var rJ = ".", kp = "___EC__COMPONENT__CONTAINER___", jV = "___EC__EXTENDED_CLASS___";
function mu(n) {
  var e = {
    main: "",
    sub: ""
  };
  if (n) {
    var t = n.split(rJ);
    e.main = t[0] || "", e.sub = t[1] || "";
  }
  return e;
}
function aJ(n) {
  vc(/^[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)?$/.test(n), 'componentType "' + n + '" illegal');
}
function sJ(n) {
  return !!(n && n[jV]);
}
function A3(n, e) {
  n.$constructor = n, n.extend = function(t) {
    var i = this, r;
    return oJ(i) ? r = /** @class */
    (function(a) {
      Ft(s, a);
      function s() {
        return a.apply(this, arguments) || this;
      }
      return s;
    })(i) : (r = function() {
      (t.$constructor || i).apply(this, arguments);
    }, XQ(r, this)), ut(r.prototype, t), r[jV] = !0, r.extend = this.extend, r.superCall = uJ, r.superApply = dJ, r.superClass = i, r;
  };
}
function oJ(n) {
  return on(n) && /^class\s/.test(Function.prototype.toString.call(n));
}
function HV(n, e) {
  n.extend = e.extend;
}
var lJ = Math.round(Math.random() * 10);
function cJ(n) {
  var e = ["__\0is_clz", lJ++].join("_");
  n.prototype[e] = !0, n.isInstance = function(t) {
    return !!(t && t[e]);
  };
}
function uJ(n, e) {
  for (var t = [], i = 2; i < arguments.length; i++)
    t[i - 2] = arguments[i];
  return this.superClass.prototype[e].apply(n, t);
}
function dJ(n, e, t) {
  return this.superClass.prototype[e].apply(n, t);
}
function MA(n) {
  var e = {};
  n.registerClass = function(i) {
    var r = i.type || i.prototype.type;
    if (r) {
      aJ(r), i.prototype.type = r;
      var a = mu(r);
      if (!a.sub)
        e[a.main] = i;
      else if (a.sub !== kp) {
        var s = t(a);
        s[a.sub] = i;
      }
    }
    return i;
  }, n.getClass = function(i, r, a) {
    var s = e[i];
    if (s && s[kp] && (s = r ? s[r] : null), a && !s)
      throw new Error(r ? "Component " + i + "." + (r || "") + " is used but not imported." : i + ".type should be specified.");
    return s;
  }, n.getClassesByMainType = function(i) {
    var r = mu(i), a = [], s = e[r.main];
    return s && s[kp] ? ae(s, function(o, l) {
      l !== kp && a.push(o);
    }) : a.push(s), a;
  }, n.hasClass = function(i) {
    var r = mu(i);
    return !!e[r.main];
  }, n.getAllClassMainTypes = function() {
    var i = [];
    return ae(e, function(r, a) {
      i.push(a);
    }), i;
  }, n.hasSubTypes = function(i) {
    var r = mu(i), a = e[r.main];
    return a && a[kp];
  };
  function t(i) {
    var r = e[i.main];
    return (!r || !r[kp]) && (r = e[i.main] = {}, r[kp] = !0), r;
  }
}
function Bx(n, e) {
  for (var t = 0; t < n.length; t++)
    n[t][1] || (n[t][1] = n[t][0]);
  return e = e || !1, function(i, r, a) {
    for (var s = {}, o = 0; o < n.length; o++) {
      var l = n[o][1];
      if (!(r && Nn(r, l) >= 0 || a && Nn(a, l) < 0)) {
        var c = i.getShallow(l, e);
        c != null && (s[n[o][0]] = c);
      }
    }
    return s;
  };
}
var hJ = [
  ["fill", "color"],
  ["shadowBlur"],
  ["shadowOffsetX"],
  ["shadowOffsetY"],
  ["opacity"],
  ["shadowColor"]
  // Option decal is in `DecalObject` but style.decal is in `PatternObject`.
  // So do not transfer decal directly.
], fJ = Bx(hJ), pJ = (
  /** @class */
  (function() {
    function n() {
    }
    return n.prototype.getAreaStyle = function(e, t) {
      return fJ(this, e, t);
    }, n;
  })()
);
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var eI = function(n, e) {
  return eI = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, i) {
    t.__proto__ = i;
  } || function(t, i) {
    for (var r in i) Object.prototype.hasOwnProperty.call(i, r) && (t[r] = i[r]);
  }, eI(n, e);
};
function Oi(n, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  eI(n, e);
  function t() {
    this.constructor = n;
  }
  n.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var VV = /* @__PURE__ */ (function() {
  function n(e) {
    this.value = e;
  }
  return n;
})(), mJ = (function() {
  function n() {
    this._len = 0;
  }
  return n.prototype.insert = function(e) {
    var t = new VV(e);
    return this.insertEntry(t), t;
  }, n.prototype.insertEntry = function(e) {
    this.head ? (this.tail.next = e, e.prev = this.tail, e.next = null, this.tail = e) : this.head = this.tail = e, this._len++;
  }, n.prototype.remove = function(e) {
    var t = e.prev, i = e.next;
    t ? t.next = i : this.head = i, i ? i.prev = t : this.tail = t, e.next = e.prev = null, this._len--;
  }, n.prototype.len = function() {
    return this._len;
  }, n.prototype.clear = function() {
    this.head = this.tail = null, this._len = 0;
  }, n;
})(), U_ = (function() {
  function n(e) {
    this._list = new mJ(), this._maxSize = 10, this._map = {}, this._maxSize = e;
  }
  return n.prototype.put = function(e, t) {
    var i = this._list, r = this._map, a = null;
    if (r[e] == null) {
      var s = i.len(), o = this._lastRemovedEntry;
      if (s >= this._maxSize && s > 0) {
        var l = i.head;
        i.remove(l), delete r[l.key], a = l.value, this._lastRemovedEntry = l;
      }
      o ? o.value = t : o = new VV(t), o.key = e, i.insertEntry(o), r[e] = o;
    }
    return a;
  }, n.prototype.get = function(e) {
    var t = this._map[e], i = this._list;
    if (t != null)
      return t !== i.tail && (i.remove(t), i.insertEntry(t)), t.value;
  }, n.prototype.clear = function() {
    this._list.clear(), this._map = {};
  }, n.prototype.len = function() {
    return this._list.len();
  }, n;
})(), tI = new U_(50);
function vJ(n) {
  if (typeof n == "string") {
    var e = tI.get(n);
    return e && e.image;
  } else
    return n;
}
function GV(n, e, t, i, r) {
  if (n)
    if (typeof n == "string") {
      if (e && e.__zrImageSrc === n || !t)
        return e;
      var a = tI.get(n), s = { hostEl: t, cb: i, cbPayload: r };
      return a ? (e = a.image, !TA(e) && a.pending.push(s)) : (e = Lo.loadImage(n, v4, v4), e.__zrImageSrc = n, tI.put(n, e.__cachedImgObj = {
        image: e,
