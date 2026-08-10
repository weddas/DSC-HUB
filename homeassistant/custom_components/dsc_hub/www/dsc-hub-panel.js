var Fv = Object.defineProperty;
var Wv = (u, o, f) => o in u ? Fv(u, o, { enumerable: !0, configurable: !0, writable: !0, value: f }) : u[o] = f;
var Su = (u, o, f) => Wv(u, typeof o != "symbol" ? o + "" : o, f);
var ir = { exports: {} }, Jn = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Cm;
function Pv() {
  if (Cm) return Jn;
  Cm = 1;
  var u = Symbol.for("react.transitional.element"), o = Symbol.for("react.fragment");
  function f(c, d, h) {
    var p = null;
    if (h !== void 0 && (p = "" + h), d.key !== void 0 && (p = "" + d.key), "key" in d) {
      h = {};
      for (var y in d)
        y !== "key" && (h[y] = d[y]);
    } else h = d;
    return d = h.ref, {
      $$typeof: u,
      type: c,
      key: p,
      ref: d !== void 0 ? d : null,
      props: h
    };
  }
  return Jn.Fragment = o, Jn.jsx = f, Jn.jsxs = f, Jn;
}
var Om;
function Iv() {
  return Om || (Om = 1, ir.exports = Pv()), ir.exports;
}
var s = Iv(), ur = { exports: {} }, ie = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Dm;
function eg() {
  if (Dm) return ie;
  Dm = 1;
  var u = Symbol.for("react.transitional.element"), o = Symbol.for("react.portal"), f = Symbol.for("react.fragment"), c = Symbol.for("react.strict_mode"), d = Symbol.for("react.profiler"), h = Symbol.for("react.consumer"), p = Symbol.for("react.context"), y = Symbol.for("react.forward_ref"), g = Symbol.for("react.suspense"), v = Symbol.for("react.memo"), x = Symbol.for("react.lazy"), j = Symbol.for("react.activity"), T = Symbol.iterator;
  function Y(S) {
    return S === null || typeof S != "object" ? null : (S = T && S[T] || S["@@iterator"], typeof S == "function" ? S : null);
  }
  var X = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, G = Object.assign, D = {};
  function Q(S, w, k) {
    this.props = S, this.context = w, this.refs = D, this.updater = k || X;
  }
  Q.prototype.isReactComponent = {}, Q.prototype.setState = function(S, w) {
    if (typeof S != "object" && typeof S != "function" && S != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, S, w, "setState");
  }, Q.prototype.forceUpdate = function(S) {
    this.updater.enqueueForceUpdate(this, S, "forceUpdate");
  };
  function V() {
  }
  V.prototype = Q.prototype;
  function L(S, w, k) {
    this.props = S, this.context = w, this.refs = D, this.updater = k || X;
  }
  var ae = L.prototype = new V();
  ae.constructor = L, G(ae, Q.prototype), ae.isPureReactComponent = !0;
  var ne = Array.isArray;
  function ve() {
  }
  var P = { H: null, A: null, T: null, S: null }, _e = Object.prototype.hasOwnProperty;
  function we(S, w, k) {
    var J = k.ref;
    return {
      $$typeof: u,
      type: S,
      key: w,
      ref: J !== void 0 ? J : null,
      props: k
    };
  }
  function it(S, w) {
    return we(S.type, w, S.props);
  }
  function We(S) {
    return typeof S == "object" && S !== null && S.$$typeof === u;
  }
  function Xe(S) {
    var w = { "=": "=0", ":": "=2" };
    return "$" + S.replace(/[=:]/g, function(k) {
      return w[k];
    });
  }
  var U = /\/+/g;
  function le(S, w) {
    return typeof S == "object" && S !== null && S.key != null ? Xe("" + S.key) : w.toString(36);
  }
  function ee(S) {
    switch (S.status) {
      case "fulfilled":
        return S.value;
      case "rejected":
        throw S.reason;
      default:
        switch (typeof S.status == "string" ? S.then(ve, ve) : (S.status = "pending", S.then(
          function(w) {
            S.status === "pending" && (S.status = "fulfilled", S.value = w);
          },
          function(w) {
            S.status === "pending" && (S.status = "rejected", S.reason = w);
          }
        )), S.status) {
          case "fulfilled":
            return S.value;
          case "rejected":
            throw S.reason;
        }
    }
    throw S;
  }
  function M(S, w, k, J, $) {
    var oe = typeof S;
    (oe === "undefined" || oe === "boolean") && (S = null);
    var Se = !1;
    if (S === null) Se = !0;
    else
      switch (oe) {
        case "bigint":
        case "string":
        case "number":
          Se = !0;
          break;
        case "object":
          switch (S.$$typeof) {
            case u:
            case o:
              Se = !0;
              break;
            case x:
              return Se = S._init, M(
                Se(S._payload),
                w,
                k,
                J,
                $
              );
          }
      }
    if (Se)
      return $ = $(S), Se = J === "" ? "." + le(S, 0) : J, ne($) ? (k = "", Se != null && (k = Se.replace(U, "$&/") + "/"), M($, w, k, "", function(en) {
        return en;
      })) : $ != null && (We($) && ($ = it(
        $,
        k + ($.key == null || S && S.key === $.key ? "" : ("" + $.key).replace(
          U,
          "$&/"
        ) + "/") + Se
      )), w.push($)), 1;
    Se = 0;
    var ct = J === "" ? "." : J + ":";
    if (ne(S))
      for (var qe = 0; qe < S.length; qe++)
        J = S[qe], oe = ct + le(J, qe), Se += M(
          J,
          w,
          k,
          oe,
          $
        );
    else if (qe = Y(S), typeof qe == "function")
      for (S = qe.call(S), qe = 0; !(J = S.next()).done; )
        J = J.value, oe = ct + le(J, qe++), Se += M(
          J,
          w,
          k,
          oe,
          $
        );
    else if (oe === "object") {
      if (typeof S.then == "function")
        return M(
          ee(S),
          w,
          k,
          J,
          $
        );
      throw w = String(S), Error(
        "Objects are not valid as a React child (found: " + (w === "[object Object]" ? "object with keys {" + Object.keys(S).join(", ") + "}" : w) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return Se;
  }
  function q(S, w, k) {
    if (S == null) return S;
    var J = [], $ = 0;
    return M(S, J, "", "", function(oe) {
      return w.call(k, oe, $++);
    }), J;
  }
  function Z(S) {
    if (S._status === -1) {
      var w = S._result;
      w = w(), w.then(
        function(k) {
          (S._status === 0 || S._status === -1) && (S._status = 1, S._result = k);
        },
        function(k) {
          (S._status === 0 || S._status === -1) && (S._status = 2, S._result = k);
        }
      ), S._status === -1 && (S._status = 0, S._result = w);
    }
    if (S._status === 1) return S._result.default;
    throw S._result;
  }
  var W = typeof reportError == "function" ? reportError : function(S) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var w = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof S == "object" && S !== null && typeof S.message == "string" ? String(S.message) : String(S),
        error: S
      });
      if (!window.dispatchEvent(w)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", S);
      return;
    }
    console.error(S);
  }, re = {
    map: q,
    forEach: function(S, w, k) {
      q(
        S,
        function() {
          w.apply(this, arguments);
        },
        k
      );
    },
    count: function(S) {
      var w = 0;
      return q(S, function() {
        w++;
      }), w;
    },
    toArray: function(S) {
      return q(S, function(w) {
        return w;
      }) || [];
    },
    only: function(S) {
      if (!We(S))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return S;
    }
  };
  return ie.Activity = j, ie.Children = re, ie.Component = Q, ie.Fragment = f, ie.Profiler = d, ie.PureComponent = L, ie.StrictMode = c, ie.Suspense = g, ie.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = P, ie.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(S) {
      return P.H.useMemoCache(S);
    }
  }, ie.cache = function(S) {
    return function() {
      return S.apply(null, arguments);
    };
  }, ie.cacheSignal = function() {
    return null;
  }, ie.cloneElement = function(S, w, k) {
    if (S == null)
      throw Error(
        "The argument must be a React element, but you passed " + S + "."
      );
    var J = G({}, S.props), $ = S.key;
    if (w != null)
      for (oe in w.key !== void 0 && ($ = "" + w.key), w)
        !_e.call(w, oe) || oe === "key" || oe === "__self" || oe === "__source" || oe === "ref" && w.ref === void 0 || (J[oe] = w[oe]);
    var oe = arguments.length - 2;
    if (oe === 1) J.children = k;
    else if (1 < oe) {
      for (var Se = Array(oe), ct = 0; ct < oe; ct++)
        Se[ct] = arguments[ct + 2];
      J.children = Se;
    }
    return we(S.type, $, J);
  }, ie.createContext = function(S) {
    return S = {
      $$typeof: p,
      _currentValue: S,
      _currentValue2: S,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, S.Provider = S, S.Consumer = {
      $$typeof: h,
      _context: S
    }, S;
  }, ie.createElement = function(S, w, k) {
    var J, $ = {}, oe = null;
    if (w != null)
      for (J in w.key !== void 0 && (oe = "" + w.key), w)
        _e.call(w, J) && J !== "key" && J !== "__self" && J !== "__source" && ($[J] = w[J]);
    var Se = arguments.length - 2;
    if (Se === 1) $.children = k;
    else if (1 < Se) {
      for (var ct = Array(Se), qe = 0; qe < Se; qe++)
        ct[qe] = arguments[qe + 2];
      $.children = ct;
    }
    if (S && S.defaultProps)
      for (J in Se = S.defaultProps, Se)
        $[J] === void 0 && ($[J] = Se[J]);
    return we(S, oe, $);
  }, ie.createRef = function() {
    return { current: null };
  }, ie.forwardRef = function(S) {
    return { $$typeof: y, render: S };
  }, ie.isValidElement = We, ie.lazy = function(S) {
    return {
      $$typeof: x,
      _payload: { _status: -1, _result: S },
      _init: Z
    };
  }, ie.memo = function(S, w) {
    return {
      $$typeof: v,
      type: S,
      compare: w === void 0 ? null : w
    };
  }, ie.startTransition = function(S) {
    var w = P.T, k = {};
    P.T = k;
    try {
      var J = S(), $ = P.S;
      $ !== null && $(k, J), typeof J == "object" && J !== null && typeof J.then == "function" && J.then(ve, W);
    } catch (oe) {
      W(oe);
    } finally {
      w !== null && k.types !== null && (w.types = k.types), P.T = w;
    }
  }, ie.unstable_useCacheRefresh = function() {
    return P.H.useCacheRefresh();
  }, ie.use = function(S) {
    return P.H.use(S);
  }, ie.useActionState = function(S, w, k) {
    return P.H.useActionState(S, w, k);
  }, ie.useCallback = function(S, w) {
    return P.H.useCallback(S, w);
  }, ie.useContext = function(S) {
    return P.H.useContext(S);
  }, ie.useDebugValue = function() {
  }, ie.useDeferredValue = function(S, w) {
    return P.H.useDeferredValue(S, w);
  }, ie.useEffect = function(S, w) {
    return P.H.useEffect(S, w);
  }, ie.useEffectEvent = function(S) {
    return P.H.useEffectEvent(S);
  }, ie.useId = function() {
    return P.H.useId();
  }, ie.useImperativeHandle = function(S, w, k) {
    return P.H.useImperativeHandle(S, w, k);
  }, ie.useInsertionEffect = function(S, w) {
    return P.H.useInsertionEffect(S, w);
  }, ie.useLayoutEffect = function(S, w) {
    return P.H.useLayoutEffect(S, w);
  }, ie.useMemo = function(S, w) {
    return P.H.useMemo(S, w);
  }, ie.useOptimistic = function(S, w) {
    return P.H.useOptimistic(S, w);
  }, ie.useReducer = function(S, w, k) {
    return P.H.useReducer(S, w, k);
  }, ie.useRef = function(S) {
    return P.H.useRef(S);
  }, ie.useState = function(S) {
    return P.H.useState(S);
  }, ie.useSyncExternalStore = function(S, w, k) {
    return P.H.useSyncExternalStore(
      S,
      w,
      k
    );
  }, ie.useTransition = function() {
    return P.H.useTransition();
  }, ie.version = "19.2.8", ie;
}
var Um;
function gr() {
  return Um || (Um = 1, ur.exports = eg()), ur.exports;
}
var E = gr(), sr = { exports: {} }, $n = {}, cr = { exports: {} }, rr = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var wm;
function tg() {
  return wm || (wm = 1, (function(u) {
    function o(M, q) {
      var Z = M.length;
      M.push(q);
      e: for (; 0 < Z; ) {
        var W = Z - 1 >>> 1, re = M[W];
        if (0 < d(re, q))
          M[W] = q, M[Z] = re, Z = W;
        else break e;
      }
    }
    function f(M) {
      return M.length === 0 ? null : M[0];
    }
    function c(M) {
      if (M.length === 0) return null;
      var q = M[0], Z = M.pop();
      if (Z !== q) {
        M[0] = Z;
        e: for (var W = 0, re = M.length, S = re >>> 1; W < S; ) {
          var w = 2 * (W + 1) - 1, k = M[w], J = w + 1, $ = M[J];
          if (0 > d(k, Z))
            J < re && 0 > d($, k) ? (M[W] = $, M[J] = Z, W = J) : (M[W] = k, M[w] = Z, W = w);
          else if (J < re && 0 > d($, Z))
            M[W] = $, M[J] = Z, W = J;
          else break e;
        }
      }
      return q;
    }
    function d(M, q) {
      var Z = M.sortIndex - q.sortIndex;
      return Z !== 0 ? Z : M.id - q.id;
    }
    if (u.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var h = performance;
      u.unstable_now = function() {
        return h.now();
      };
    } else {
      var p = Date, y = p.now();
      u.unstable_now = function() {
        return p.now() - y;
      };
    }
    var g = [], v = [], x = 1, j = null, T = 3, Y = !1, X = !1, G = !1, D = !1, Q = typeof setTimeout == "function" ? setTimeout : null, V = typeof clearTimeout == "function" ? clearTimeout : null, L = typeof setImmediate < "u" ? setImmediate : null;
    function ae(M) {
      for (var q = f(v); q !== null; ) {
        if (q.callback === null) c(v);
        else if (q.startTime <= M)
          c(v), q.sortIndex = q.expirationTime, o(g, q);
        else break;
        q = f(v);
      }
    }
    function ne(M) {
      if (G = !1, ae(M), !X)
        if (f(g) !== null)
          X = !0, ve || (ve = !0, Xe());
        else {
          var q = f(v);
          q !== null && ee(ne, q.startTime - M);
        }
    }
    var ve = !1, P = -1, _e = 5, we = -1;
    function it() {
      return D ? !0 : !(u.unstable_now() - we < _e);
    }
    function We() {
      if (D = !1, ve) {
        var M = u.unstable_now();
        we = M;
        var q = !0;
        try {
          e: {
            X = !1, G && (G = !1, V(P), P = -1), Y = !0;
            var Z = T;
            try {
              t: {
                for (ae(M), j = f(g); j !== null && !(j.expirationTime > M && it()); ) {
                  var W = j.callback;
                  if (typeof W == "function") {
                    j.callback = null, T = j.priorityLevel;
                    var re = W(
                      j.expirationTime <= M
                    );
                    if (M = u.unstable_now(), typeof re == "function") {
                      j.callback = re, ae(M), q = !0;
                      break t;
                    }
                    j === f(g) && c(g), ae(M);
                  } else c(g);
                  j = f(g);
                }
                if (j !== null) q = !0;
                else {
                  var S = f(v);
                  S !== null && ee(
                    ne,
                    S.startTime - M
                  ), q = !1;
                }
              }
              break e;
            } finally {
              j = null, T = Z, Y = !1;
            }
            q = void 0;
          }
        } finally {
          q ? Xe() : ve = !1;
        }
      }
    }
    var Xe;
    if (typeof L == "function")
      Xe = function() {
        L(We);
      };
    else if (typeof MessageChannel < "u") {
      var U = new MessageChannel(), le = U.port2;
      U.port1.onmessage = We, Xe = function() {
        le.postMessage(null);
      };
    } else
      Xe = function() {
        Q(We, 0);
      };
    function ee(M, q) {
      P = Q(function() {
        M(u.unstable_now());
      }, q);
    }
    u.unstable_IdlePriority = 5, u.unstable_ImmediatePriority = 1, u.unstable_LowPriority = 4, u.unstable_NormalPriority = 3, u.unstable_Profiling = null, u.unstable_UserBlockingPriority = 2, u.unstable_cancelCallback = function(M) {
      M.callback = null;
    }, u.unstable_forceFrameRate = function(M) {
      0 > M || 125 < M ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : _e = 0 < M ? Math.floor(1e3 / M) : 5;
    }, u.unstable_getCurrentPriorityLevel = function() {
      return T;
    }, u.unstable_next = function(M) {
      switch (T) {
        case 1:
        case 2:
        case 3:
          var q = 3;
          break;
        default:
          q = T;
      }
      var Z = T;
      T = q;
      try {
        return M();
      } finally {
        T = Z;
      }
    }, u.unstable_requestPaint = function() {
      D = !0;
    }, u.unstable_runWithPriority = function(M, q) {
      switch (M) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          M = 3;
      }
      var Z = T;
      T = M;
      try {
        return q();
      } finally {
        T = Z;
      }
    }, u.unstable_scheduleCallback = function(M, q, Z) {
      var W = u.unstable_now();
      switch (typeof Z == "object" && Z !== null ? (Z = Z.delay, Z = typeof Z == "number" && 0 < Z ? W + Z : W) : Z = W, M) {
        case 1:
          var re = -1;
          break;
        case 2:
          re = 250;
          break;
        case 5:
          re = 1073741823;
          break;
        case 4:
          re = 1e4;
          break;
        default:
          re = 5e3;
      }
      return re = Z + re, M = {
        id: x++,
        callback: q,
        priorityLevel: M,
        startTime: Z,
        expirationTime: re,
        sortIndex: -1
      }, Z > W ? (M.sortIndex = Z, o(v, M), f(g) === null && M === f(v) && (G ? (V(P), P = -1) : G = !0, ee(ne, Z - W))) : (M.sortIndex = re, o(g, M), X || Y || (X = !0, ve || (ve = !0, Xe()))), M;
    }, u.unstable_shouldYield = it, u.unstable_wrapCallback = function(M) {
      var q = T;
      return function() {
        var Z = T;
        T = q;
        try {
          return M.apply(this, arguments);
        } finally {
          T = Z;
        }
      };
    };
  })(rr)), rr;
}
var Hm;
function lg() {
  return Hm || (Hm = 1, cr.exports = tg()), cr.exports;
}
var or = { exports: {} }, ut = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Bm;
function ag() {
  if (Bm) return ut;
  Bm = 1;
  var u = gr();
  function o(g) {
    var v = "https://react.dev/errors/" + g;
    if (1 < arguments.length) {
      v += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var x = 2; x < arguments.length; x++)
        v += "&args[]=" + encodeURIComponent(arguments[x]);
    }
    return "Minified React error #" + g + "; visit " + v + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function f() {
  }
  var c = {
    d: {
      f,
      r: function() {
        throw Error(o(522));
      },
      D: f,
      C: f,
      L: f,
      m: f,
      X: f,
      S: f,
      M: f
    },
    p: 0,
    findDOMNode: null
  }, d = Symbol.for("react.portal");
  function h(g, v, x) {
    var j = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: d,
      key: j == null ? null : "" + j,
      children: g,
      containerInfo: v,
      implementation: x
    };
  }
  var p = u.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function y(g, v) {
    if (g === "font") return "";
    if (typeof v == "string")
      return v === "use-credentials" ? v : "";
  }
  return ut.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = c, ut.createPortal = function(g, v) {
    var x = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!v || v.nodeType !== 1 && v.nodeType !== 9 && v.nodeType !== 11)
      throw Error(o(299));
    return h(g, v, null, x);
  }, ut.flushSync = function(g) {
    var v = p.T, x = c.p;
    try {
      if (p.T = null, c.p = 2, g) return g();
    } finally {
      p.T = v, c.p = x, c.d.f();
    }
  }, ut.preconnect = function(g, v) {
    typeof g == "string" && (v ? (v = v.crossOrigin, v = typeof v == "string" ? v === "use-credentials" ? v : "" : void 0) : v = null, c.d.C(g, v));
  }, ut.prefetchDNS = function(g) {
    typeof g == "string" && c.d.D(g);
  }, ut.preinit = function(g, v) {
    if (typeof g == "string" && v && typeof v.as == "string") {
      var x = v.as, j = y(x, v.crossOrigin), T = typeof v.integrity == "string" ? v.integrity : void 0, Y = typeof v.fetchPriority == "string" ? v.fetchPriority : void 0;
      x === "style" ? c.d.S(
        g,
        typeof v.precedence == "string" ? v.precedence : void 0,
        {
          crossOrigin: j,
          integrity: T,
          fetchPriority: Y
        }
      ) : x === "script" && c.d.X(g, {
        crossOrigin: j,
        integrity: T,
        fetchPriority: Y,
        nonce: typeof v.nonce == "string" ? v.nonce : void 0
      });
    }
  }, ut.preinitModule = function(g, v) {
    if (typeof g == "string")
      if (typeof v == "object" && v !== null) {
        if (v.as == null || v.as === "script") {
          var x = y(
            v.as,
            v.crossOrigin
          );
          c.d.M(g, {
            crossOrigin: x,
            integrity: typeof v.integrity == "string" ? v.integrity : void 0,
            nonce: typeof v.nonce == "string" ? v.nonce : void 0
          });
        }
      } else v == null && c.d.M(g);
  }, ut.preload = function(g, v) {
    if (typeof g == "string" && typeof v == "object" && v !== null && typeof v.as == "string") {
      var x = v.as, j = y(x, v.crossOrigin);
      c.d.L(g, x, {
        crossOrigin: j,
        integrity: typeof v.integrity == "string" ? v.integrity : void 0,
        nonce: typeof v.nonce == "string" ? v.nonce : void 0,
        type: typeof v.type == "string" ? v.type : void 0,
        fetchPriority: typeof v.fetchPriority == "string" ? v.fetchPriority : void 0,
        referrerPolicy: typeof v.referrerPolicy == "string" ? v.referrerPolicy : void 0,
        imageSrcSet: typeof v.imageSrcSet == "string" ? v.imageSrcSet : void 0,
        imageSizes: typeof v.imageSizes == "string" ? v.imageSizes : void 0,
        media: typeof v.media == "string" ? v.media : void 0
      });
    }
  }, ut.preloadModule = function(g, v) {
    if (typeof g == "string")
      if (v) {
        var x = y(v.as, v.crossOrigin);
        c.d.m(g, {
          as: typeof v.as == "string" && v.as !== "script" ? v.as : void 0,
          crossOrigin: x,
          integrity: typeof v.integrity == "string" ? v.integrity : void 0
        });
      } else c.d.m(g);
  }, ut.requestFormReset = function(g) {
    c.d.r(g);
  }, ut.unstable_batchedUpdates = function(g, v) {
    return g(v);
  }, ut.useFormState = function(g, v, x) {
    return p.H.useFormState(g, v, x);
  }, ut.useFormStatus = function() {
    return p.H.useHostTransitionStatus();
  }, ut.version = "19.2.8", ut;
}
var Lm;
function ng() {
  if (Lm) return or.exports;
  Lm = 1;
  function u() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u);
      } catch (o) {
        console.error(o);
      }
  }
  return u(), or.exports = ag(), or.exports;
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
var qm;
function ig() {
  if (qm) return $n;
  qm = 1;
  var u = lg(), o = gr(), f = ng();
  function c(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var l = 2; l < arguments.length; l++)
        t += "&args[]=" + encodeURIComponent(arguments[l]);
    }
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function d(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function h(e) {
    var t = e, l = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
      e = t;
      do
        t = e, (t.flags & 4098) !== 0 && (l = t.return), e = t.return;
      while (e);
    }
    return t.tag === 3 ? l : null;
  }
  function p(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function y(e) {
    if (e.tag === 31) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function g(e) {
    if (h(e) !== e)
      throw Error(c(188));
  }
  function v(e) {
    var t = e.alternate;
    if (!t) {
      if (t = h(e), t === null) throw Error(c(188));
      return t !== e ? null : e;
    }
    for (var l = e, a = t; ; ) {
      var n = l.return;
      if (n === null) break;
      var i = n.alternate;
      if (i === null) {
        if (a = n.return, a !== null) {
          l = a;
          continue;
        }
        break;
      }
      if (n.child === i.child) {
        for (i = n.child; i; ) {
          if (i === l) return g(n), e;
          if (i === a) return g(n), t;
          i = i.sibling;
        }
        throw Error(c(188));
      }
      if (l.return !== a.return) l = n, a = i;
      else {
        for (var r = !1, m = n.child; m; ) {
          if (m === l) {
            r = !0, l = n, a = i;
            break;
          }
          if (m === a) {
            r = !0, a = n, l = i;
            break;
          }
          m = m.sibling;
        }
        if (!r) {
          for (m = i.child; m; ) {
            if (m === l) {
              r = !0, l = i, a = n;
              break;
            }
            if (m === a) {
              r = !0, a = i, l = n;
              break;
            }
            m = m.sibling;
          }
          if (!r) throw Error(c(189));
        }
      }
      if (l.alternate !== a) throw Error(c(190));
    }
    if (l.tag !== 3) throw Error(c(188));
    return l.stateNode.current === l ? e : t;
  }
  function x(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null; ) {
      if (t = x(e), t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var j = Object.assign, T = Symbol.for("react.element"), Y = Symbol.for("react.transitional.element"), X = Symbol.for("react.portal"), G = Symbol.for("react.fragment"), D = Symbol.for("react.strict_mode"), Q = Symbol.for("react.profiler"), V = Symbol.for("react.consumer"), L = Symbol.for("react.context"), ae = Symbol.for("react.forward_ref"), ne = Symbol.for("react.suspense"), ve = Symbol.for("react.suspense_list"), P = Symbol.for("react.memo"), _e = Symbol.for("react.lazy"), we = Symbol.for("react.activity"), it = Symbol.for("react.memo_cache_sentinel"), We = Symbol.iterator;
  function Xe(e) {
    return e === null || typeof e != "object" ? null : (e = We && e[We] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var U = Symbol.for("react.client.reference");
  function le(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === U ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case G:
        return "Fragment";
      case Q:
        return "Profiler";
      case D:
        return "StrictMode";
      case ne:
        return "Suspense";
      case ve:
        return "SuspenseList";
      case we:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case X:
          return "Portal";
        case L:
          return e.displayName || "Context";
        case V:
          return (e._context.displayName || "Context") + ".Consumer";
        case ae:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case P:
          return t = e.displayName || null, t !== null ? t : le(e.type) || "Memo";
        case _e:
          t = e._payload, e = e._init;
          try {
            return le(e(t));
          } catch {
          }
      }
    return null;
  }
  var ee = Array.isArray, M = o.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, q = f.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Z = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, W = [], re = -1;
  function S(e) {
    return { current: e };
  }
  function w(e) {
    0 > re || (e.current = W[re], W[re] = null, re--);
  }
  function k(e, t) {
    re++, W[re] = e.current, e.current = t;
  }
  var J = S(null), $ = S(null), oe = S(null), Se = S(null);
  function ct(e, t) {
    switch (k(oe, t), k($, e), k(J, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? em(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = em(t), e = tm(t, e);
        else
          switch (e) {
            case "svg":
              e = 1;
              break;
            case "math":
              e = 2;
              break;
            default:
              e = 0;
          }
    }
    w(J), k(J, e);
  }
  function qe() {
    w(J), w($), w(oe);
  }
  function en(e) {
    e.memoizedState !== null && k(Se, e);
    var t = J.current, l = tm(t, e.type);
    t !== l && (k($, e), k(J, l));
  }
  function ni(e) {
    $.current === e && (w(J), w($)), Se.current === e && (w(Se), Qn._currentValue = Z);
  }
  var Gu, zr;
  function Vl(e) {
    if (Gu === void 0)
      try {
        throw Error();
      } catch (l) {
        var t = l.stack.trim().match(/\n( *(at )?)/);
        Gu = t && t[1] || "", zr = -1 < l.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < l.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + Gu + e + zr;
  }
  var Xu = !1;
  function ku(e, t) {
    if (!e || Xu) return "";
    Xu = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var B = function() {
                throw Error();
              };
              if (Object.defineProperty(B.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(B, []);
                } catch (C) {
                  var R = C;
                }
                Reflect.construct(e, [], B);
              } else {
                try {
                  B.call();
                } catch (C) {
                  R = C;
                }
                e.call(B.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (C) {
                R = C;
              }
              (B = e()) && typeof B.catch == "function" && B.catch(function() {
              });
            }
          } catch (C) {
            if (C && R && typeof C.stack == "string")
              return [C.stack, R.stack];
          }
          return [null, null];
        }
      };
      a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var n = Object.getOwnPropertyDescriptor(
        a.DetermineComponentFrameRoot,
        "name"
      );
      n && n.configurable && Object.defineProperty(
        a.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var i = a.DetermineComponentFrameRoot(), r = i[0], m = i[1];
      if (r && m) {
        var b = r.split(`
`), z = m.split(`
`);
        for (n = a = 0; a < b.length && !b[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; n < z.length && !z[n].includes(
          "DetermineComponentFrameRoot"
        ); )
          n++;
        if (a === b.length || n === z.length)
          for (a = b.length - 1, n = z.length - 1; 1 <= a && 0 <= n && b[a] !== z[n]; )
            n--;
        for (; 1 <= a && 0 <= n; a--, n--)
          if (b[a] !== z[n]) {
            if (a !== 1 || n !== 1)
              do
                if (a--, n--, 0 > n || b[a] !== z[n]) {
                  var O = `
` + b[a].replace(" at new ", " at ");
                  return e.displayName && O.includes("<anonymous>") && (O = O.replace("<anonymous>", e.displayName)), O;
                }
              while (1 <= a && 0 <= n);
            break;
          }
      }
    } finally {
      Xu = !1, Error.prepareStackTrace = l;
    }
    return (l = e ? e.displayName || e.name : "") ? Vl(l) : "";
  }
  function Ah(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return Vl(e.type);
      case 16:
        return Vl("Lazy");
      case 13:
        return e.child !== t && t !== null ? Vl("Suspense Fallback") : Vl("Suspense");
      case 19:
        return Vl("SuspenseList");
      case 0:
      case 15:
        return ku(e.type, !1);
      case 11:
        return ku(e.type.render, !1);
      case 1:
        return ku(e.type, !0);
      case 31:
        return Vl("Activity");
      default:
        return "";
    }
  }
  function Mr(e) {
    try {
      var t = "", l = null;
      do
        t += Ah(e, l), l = e, e = e.return;
      while (e);
      return t;
    } catch (a) {
      return `
Error generating stack: ` + a.message + `
` + a.stack;
    }
  }
  var Qu = Object.prototype.hasOwnProperty, Zu = u.unstable_scheduleCallback, Vu = u.unstable_cancelCallback, zh = u.unstable_shouldYield, Mh = u.unstable_requestPaint, yt = u.unstable_now, Rh = u.unstable_getCurrentPriorityLevel, Rr = u.unstable_ImmediatePriority, Cr = u.unstable_UserBlockingPriority, ii = u.unstable_NormalPriority, Ch = u.unstable_LowPriority, Or = u.unstable_IdlePriority, Oh = u.log, Dh = u.unstable_setDisableYieldValue, tn = null, bt = null;
  function bl(e) {
    if (typeof Oh == "function" && Dh(e), bt && typeof bt.setStrictMode == "function")
      try {
        bt.setStrictMode(tn, e);
      } catch {
      }
  }
  var xt = Math.clz32 ? Math.clz32 : Hh, Uh = Math.log, wh = Math.LN2;
  function Hh(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Uh(e) / wh | 0) | 0;
  }
  var ui = 256, si = 262144, ci = 4194304;
  function Kl(e) {
    var t = e & 42;
    if (t !== 0) return t;
    switch (e & -e) {
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
        return e & 261888;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return e & 62914560;
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
        return e;
    }
  }
  function ri(e, t, l) {
    var a = e.pendingLanes;
    if (a === 0) return 0;
    var n = 0, i = e.suspendedLanes, r = e.pingedLanes;
    e = e.warmLanes;
    var m = a & 134217727;
    return m !== 0 ? (a = m & ~i, a !== 0 ? n = Kl(a) : (r &= m, r !== 0 ? n = Kl(r) : l || (l = m & ~e, l !== 0 && (n = Kl(l))))) : (m = a & ~i, m !== 0 ? n = Kl(m) : r !== 0 ? n = Kl(r) : l || (l = a & ~e, l !== 0 && (n = Kl(l)))), n === 0 ? 0 : t !== 0 && t !== n && (t & i) === 0 && (i = n & -n, l = t & -t, i >= l || i === 32 && (l & 4194048) !== 0) ? t : n;
  }
  function ln(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function Bh(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return t + 250;
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
        return t + 5e3;
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
  function Dr() {
    var e = ci;
    return ci <<= 1, (ci & 62914560) === 0 && (ci = 4194304), e;
  }
  function Ku(e) {
    for (var t = [], l = 0; 31 > l; l++) t.push(e);
    return t;
  }
  function an(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function Lh(e, t, l, a, n, i) {
    var r = e.pendingLanes;
    e.pendingLanes = l, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= l, e.entangledLanes &= l, e.errorRecoveryDisabledLanes &= l, e.shellSuspendCounter = 0;
    var m = e.entanglements, b = e.expirationTimes, z = e.hiddenUpdates;
    for (l = r & ~l; 0 < l; ) {
      var O = 31 - xt(l), B = 1 << O;
      m[O] = 0, b[O] = -1;
      var R = z[O];
      if (R !== null)
        for (z[O] = null, O = 0; O < R.length; O++) {
          var C = R[O];
          C !== null && (C.lane &= -536870913);
        }
      l &= ~B;
    }
    a !== 0 && Ur(e, a, 0), i !== 0 && n === 0 && e.tag !== 0 && (e.suspendedLanes |= i & ~(r & ~t));
  }
  function Ur(e, t, l) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var a = 31 - xt(t);
    e.entangledLanes |= t, e.entanglements[a] = e.entanglements[a] | 1073741824 | l & 261930;
  }
  function wr(e, t) {
    var l = e.entangledLanes |= t;
    for (e = e.entanglements; l; ) {
      var a = 31 - xt(l), n = 1 << a;
      n & t | e[a] & t && (e[a] |= t), l &= ~n;
    }
  }
  function Hr(e, t) {
    var l = t & -t;
    return l = (l & 42) !== 0 ? 1 : Ju(l), (l & (e.suspendedLanes | t)) !== 0 ? 0 : l;
  }
  function Ju(e) {
    switch (e) {
      case 2:
        e = 1;
        break;
      case 8:
        e = 4;
        break;
      case 32:
        e = 16;
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
        e = 128;
        break;
      case 268435456:
        e = 134217728;
        break;
      default:
        e = 0;
    }
    return e;
  }
  function $u(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Br() {
    var e = q.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : Em(e.type));
  }
  function Lr(e, t) {
    var l = q.p;
    try {
      return q.p = e, t();
    } finally {
      q.p = l;
    }
  }
  var xl = Math.random().toString(36).slice(2), Pe = "__reactFiber$" + xl, ot = "__reactProps$" + xl, ma = "__reactContainer$" + xl, Fu = "__reactEvents$" + xl, qh = "__reactListeners$" + xl, Yh = "__reactHandles$" + xl, qr = "__reactResources$" + xl, nn = "__reactMarker$" + xl;
  function Wu(e) {
    delete e[Pe], delete e[ot], delete e[Fu], delete e[qh], delete e[Yh];
  }
  function ha(e) {
    var t = e[Pe];
    if (t) return t;
    for (var l = e.parentNode; l; ) {
      if (t = l[ma] || l[Pe]) {
        if (l = t.alternate, t.child !== null || l !== null && l.child !== null)
          for (e = cm(e); e !== null; ) {
            if (l = e[Pe]) return l;
            e = cm(e);
          }
        return t;
      }
      e = l, l = e.parentNode;
    }
    return null;
  }
  function pa(e) {
    if (e = e[Pe] || e[ma]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function un(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(c(33));
  }
  function va(e) {
    var t = e[qr];
    return t || (t = e[qr] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function Je(e) {
    e[nn] = !0;
  }
  var Yr = /* @__PURE__ */ new Set(), Gr = {};
  function Jl(e, t) {
    ga(e, t), ga(e + "Capture", t);
  }
  function ga(e, t) {
    for (Gr[e] = t, e = 0; e < t.length; e++)
      Yr.add(t[e]);
  }
  var Gh = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Xr = {}, kr = {};
  function Xh(e) {
    return Qu.call(kr, e) ? !0 : Qu.call(Xr, e) ? !1 : Gh.test(e) ? kr[e] = !0 : (Xr[e] = !0, !1);
  }
  function oi(e, t, l) {
    if (Xh(t))
      if (l === null) e.removeAttribute(t);
      else {
        switch (typeof l) {
          case "undefined":
          case "function":
          case "symbol":
            e.removeAttribute(t);
            return;
          case "boolean":
            var a = t.toLowerCase().slice(0, 5);
            if (a !== "data-" && a !== "aria-") {
              e.removeAttribute(t);
              return;
            }
        }
        e.setAttribute(t, "" + l);
      }
  }
  function fi(e, t, l) {
    if (l === null) e.removeAttribute(t);
    else {
      switch (typeof l) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(t);
          return;
      }
      e.setAttribute(t, "" + l);
    }
  }
  function el(e, t, l, a) {
    if (a === null) e.removeAttribute(l);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(l);
          return;
      }
      e.setAttributeNS(t, l, "" + a);
    }
  }
  function Rt(e) {
    switch (typeof e) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function Qr(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function kh(e, t, l) {
    var a = Object.getOwnPropertyDescriptor(
      e.constructor.prototype,
      t
    );
    if (!e.hasOwnProperty(t) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
      var n = a.get, i = a.set;
      return Object.defineProperty(e, t, {
        configurable: !0,
        get: function() {
          return n.call(this);
        },
        set: function(r) {
          l = "" + r, i.call(this, r);
        }
      }), Object.defineProperty(e, t, {
        enumerable: a.enumerable
      }), {
        getValue: function() {
          return l;
        },
        setValue: function(r) {
          l = "" + r;
        },
        stopTracking: function() {
          e._valueTracker = null, delete e[t];
        }
      };
    }
  }
  function Pu(e) {
    if (!e._valueTracker) {
      var t = Qr(e) ? "checked" : "value";
      e._valueTracker = kh(
        e,
        t,
        "" + e[t]
      );
    }
  }
  function Zr(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var l = t.getValue(), a = "";
    return e && (a = Qr(e) ? e.checked ? "true" : "false" : e.value), e = a, e !== l ? (t.setValue(e), !0) : !1;
  }
  function di(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var Qh = /[\n"\\]/g;
  function Ct(e) {
    return e.replace(
      Qh,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Iu(e, t, l, a, n, i, r, m) {
    e.name = "", r != null && typeof r != "function" && typeof r != "symbol" && typeof r != "boolean" ? e.type = r : e.removeAttribute("type"), t != null ? r === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Rt(t)) : e.value !== "" + Rt(t) && (e.value = "" + Rt(t)) : r !== "submit" && r !== "reset" || e.removeAttribute("value"), t != null ? es(e, r, Rt(t)) : l != null ? es(e, r, Rt(l)) : a != null && e.removeAttribute("value"), n == null && i != null && (e.defaultChecked = !!i), n != null && (e.checked = n && typeof n != "function" && typeof n != "symbol"), m != null && typeof m != "function" && typeof m != "symbol" && typeof m != "boolean" ? e.name = "" + Rt(m) : e.removeAttribute("name");
  }
  function Vr(e, t, l, a, n, i, r, m) {
    if (i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" && (e.type = i), t != null || l != null) {
      if (!(i !== "submit" && i !== "reset" || t != null)) {
        Pu(e);
        return;
      }
      l = l != null ? "" + Rt(l) : "", t = t != null ? "" + Rt(t) : l, m || t === e.value || (e.value = t), e.defaultValue = t;
    }
    a = a ?? n, a = typeof a != "function" && typeof a != "symbol" && !!a, e.checked = m ? e.checked : !!a, e.defaultChecked = !!a, r != null && typeof r != "function" && typeof r != "symbol" && typeof r != "boolean" && (e.name = r), Pu(e);
  }
  function es(e, t, l) {
    t === "number" && di(e.ownerDocument) === e || e.defaultValue === "" + l || (e.defaultValue = "" + l);
  }
  function ya(e, t, l, a) {
    if (e = e.options, t) {
      t = {};
      for (var n = 0; n < l.length; n++)
        t["$" + l[n]] = !0;
      for (l = 0; l < e.length; l++)
        n = t.hasOwnProperty("$" + e[l].value), e[l].selected !== n && (e[l].selected = n), n && a && (e[l].defaultSelected = !0);
    } else {
      for (l = "" + Rt(l), t = null, n = 0; n < e.length; n++) {
        if (e[n].value === l) {
          e[n].selected = !0, a && (e[n].defaultSelected = !0);
          return;
        }
        t !== null || e[n].disabled || (t = e[n]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Kr(e, t, l) {
    if (t != null && (t = "" + Rt(t), t !== e.value && (e.value = t), l == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = l != null ? "" + Rt(l) : "";
  }
  function Jr(e, t, l, a) {
    if (t == null) {
      if (a != null) {
        if (l != null) throw Error(c(92));
        if (ee(a)) {
          if (1 < a.length) throw Error(c(93));
          a = a[0];
        }
        l = a;
      }
      l == null && (l = ""), t = l;
    }
    l = Rt(t), e.defaultValue = l, a = e.textContent, a === l && a !== "" && a !== null && (e.value = a), Pu(e);
  }
  function ba(e, t) {
    if (t) {
      var l = e.firstChild;
      if (l && l === e.lastChild && l.nodeType === 3) {
        l.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Zh = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function $r(e, t, l) {
    var a = t.indexOf("--") === 0;
    l == null || typeof l == "boolean" || l === "" ? a ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : a ? e.setProperty(t, l) : typeof l != "number" || l === 0 || Zh.has(t) ? t === "float" ? e.cssFloat = l : e[t] = ("" + l).trim() : e[t] = l + "px";
  }
  function Fr(e, t, l) {
    if (t != null && typeof t != "object")
      throw Error(c(62));
    if (e = e.style, l != null) {
      for (var a in l)
        !l.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf("--") === 0 ? e.setProperty(a, "") : a === "float" ? e.cssFloat = "" : e[a] = "");
      for (var n in t)
        a = t[n], t.hasOwnProperty(n) && l[n] !== a && $r(e, n, a);
    } else
      for (var i in t)
        t.hasOwnProperty(i) && $r(e, i, t[i]);
  }
  function ts(e) {
    if (e.indexOf("-") === -1) return !1;
    switch (e) {
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
  var Vh = /* @__PURE__ */ new Map([
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
  ]), Kh = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function mi(e) {
    return Kh.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  function tl() {
  }
  var ls = null;
  function as(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var xa = null, _a = null;
  function Wr(e) {
    var t = pa(e);
    if (t && (e = t.stateNode)) {
      var l = e[ot] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (Iu(
            e,
            l.value,
            l.defaultValue,
            l.defaultValue,
            l.checked,
            l.defaultChecked,
            l.type,
            l.name
          ), t = l.name, l.type === "radio" && t != null) {
            for (l = e; l.parentNode; ) l = l.parentNode;
            for (l = l.querySelectorAll(
              'input[name="' + Ct(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < l.length; t++) {
              var a = l[t];
              if (a !== e && a.form === e.form) {
                var n = a[ot] || null;
                if (!n) throw Error(c(90));
                Iu(
                  a,
                  n.value,
                  n.defaultValue,
                  n.defaultValue,
                  n.checked,
                  n.defaultChecked,
                  n.type,
                  n.name
                );
              }
            }
            for (t = 0; t < l.length; t++)
              a = l[t], a.form === e.form && Zr(a);
          }
          break e;
        case "textarea":
          Kr(e, l.value, l.defaultValue);
          break e;
        case "select":
          t = l.value, t != null && ya(e, !!l.multiple, t, !1);
      }
    }
  }
  var ns = !1;
  function Pr(e, t, l) {
    if (ns) return e(t, l);
    ns = !0;
    try {
      var a = e(t);
      return a;
    } finally {
      if (ns = !1, (xa !== null || _a !== null) && (eu(), xa && (t = xa, e = _a, _a = xa = null, Wr(t), e)))
        for (t = 0; t < e.length; t++) Wr(e[t]);
    }
  }
  function sn(e, t) {
    var l = e.stateNode;
    if (l === null) return null;
    var a = l[ot] || null;
    if (a === null) return null;
    l = a[t];
    e: switch (t) {
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
        (a = !a.disabled) || (e = e.type, a = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !a;
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (l && typeof l != "function")
      throw Error(
        c(231, t, typeof l)
      );
    return l;
  }
  var ll = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), is = !1;
  if (ll)
    try {
      var cn = {};
      Object.defineProperty(cn, "passive", {
        get: function() {
          is = !0;
        }
      }), window.addEventListener("test", cn, cn), window.removeEventListener("test", cn, cn);
    } catch {
      is = !1;
    }
  var _l = null, us = null, hi = null;
  function Ir() {
    if (hi) return hi;
    var e, t = us, l = t.length, a, n = "value" in _l ? _l.value : _l.textContent, i = n.length;
    for (e = 0; e < l && t[e] === n[e]; e++) ;
    var r = l - e;
    for (a = 1; a <= r && t[l - a] === n[i - a]; a++) ;
    return hi = n.slice(e, 1 < a ? 1 - a : void 0);
  }
  function pi(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function vi() {
    return !0;
  }
  function eo() {
    return !1;
  }
  function ft(e) {
    function t(l, a, n, i, r) {
      this._reactName = l, this._targetInst = n, this.type = a, this.nativeEvent = i, this.target = r, this.currentTarget = null;
      for (var m in e)
        e.hasOwnProperty(m) && (l = e[m], this[m] = l ? l(i) : i[m]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? vi : eo, this.isPropagationStopped = eo, this;
    }
    return j(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var l = this.nativeEvent;
        l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = vi);
      },
      stopPropagation: function() {
        var l = this.nativeEvent;
        l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = vi);
      },
      persist: function() {
      },
      isPersistent: vi
    }), t;
  }
  var $l = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, gi = ft($l), rn = j({}, $l, { view: 0, detail: 0 }), Jh = ft(rn), ss, cs, on, yi = j({}, rn, {
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
    getModifierState: os,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== on && (on && e.type === "mousemove" ? (ss = e.screenX - on.screenX, cs = e.screenY - on.screenY) : cs = ss = 0, on = e), ss);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : cs;
    }
  }), to = ft(yi), $h = j({}, yi, { dataTransfer: 0 }), Fh = ft($h), Wh = j({}, rn, { relatedTarget: 0 }), rs = ft(Wh), Ph = j({}, $l, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Ih = ft(Ph), ep = j({}, $l, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), tp = ft(ep), lp = j({}, $l, { data: 0 }), lo = ft(lp), ap = {
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
  }, np = {
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
  }, ip = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function up(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = ip[e]) ? !!t[e] : !1;
  }
  function os() {
    return up;
  }
  var sp = j({}, rn, {
    key: function(e) {
      if (e.key) {
        var t = ap[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = pi(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? np[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: os,
    charCode: function(e) {
      return e.type === "keypress" ? pi(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? pi(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), cp = ft(sp), rp = j({}, yi, {
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
  }), ao = ft(rp), op = j({}, rn, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: os
  }), fp = ft(op), dp = j({}, $l, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), mp = ft(dp), hp = j({}, yi, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), pp = ft(hp), vp = j({}, $l, {
    newState: 0,
    oldState: 0
  }), gp = ft(vp), yp = [9, 13, 27, 32], fs = ll && "CompositionEvent" in window, fn = null;
  ll && "documentMode" in document && (fn = document.documentMode);
  var bp = ll && "TextEvent" in window && !fn, no = ll && (!fs || fn && 8 < fn && 11 >= fn), io = " ", uo = !1;
  function so(e, t) {
    switch (e) {
      case "keyup":
        return yp.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function co(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Sa = !1;
  function xp(e, t) {
    switch (e) {
      case "compositionend":
        return co(t);
      case "keypress":
        return t.which !== 32 ? null : (uo = !0, io);
      case "textInput":
        return e = t.data, e === io && uo ? null : e;
      default:
        return null;
    }
  }
  function _p(e, t) {
    if (Sa)
      return e === "compositionend" || !fs && so(e, t) ? (e = Ir(), hi = us = _l = null, Sa = !1, e) : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
          if (t.char && 1 < t.char.length)
            return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return no && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Sp = {
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
  function ro(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Sp[e.type] : t === "textarea";
  }
  function oo(e, t, l, a) {
    xa ? _a ? _a.push(a) : _a = [a] : xa = a, t = su(t, "onChange"), 0 < t.length && (l = new gi(
      "onChange",
      "change",
      null,
      l,
      a
    ), e.push({ event: l, listeners: t }));
  }
  var dn = null, mn = null;
  function jp(e) {
    Jd(e, 0);
  }
  function bi(e) {
    var t = un(e);
    if (Zr(t)) return e;
  }
  function fo(e, t) {
    if (e === "change") return t;
  }
  var mo = !1;
  if (ll) {
    var ds;
    if (ll) {
      var ms = "oninput" in document;
      if (!ms) {
        var ho = document.createElement("div");
        ho.setAttribute("oninput", "return;"), ms = typeof ho.oninput == "function";
      }
      ds = ms;
    } else ds = !1;
    mo = ds && (!document.documentMode || 9 < document.documentMode);
  }
  function po() {
    dn && (dn.detachEvent("onpropertychange", vo), mn = dn = null);
  }
  function vo(e) {
    if (e.propertyName === "value" && bi(mn)) {
      var t = [];
      oo(
        t,
        mn,
        e,
        as(e)
      ), Pr(jp, t);
    }
  }
  function Ep(e, t, l) {
    e === "focusin" ? (po(), dn = t, mn = l, dn.attachEvent("onpropertychange", vo)) : e === "focusout" && po();
  }
  function Np(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return bi(mn);
  }
  function Tp(e, t) {
    if (e === "click") return bi(t);
  }
  function Ap(e, t) {
    if (e === "input" || e === "change")
      return bi(t);
  }
  function zp(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var _t = typeof Object.is == "function" ? Object.is : zp;
  function hn(e, t) {
    if (_t(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var l = Object.keys(e), a = Object.keys(t);
    if (l.length !== a.length) return !1;
    for (a = 0; a < l.length; a++) {
      var n = l[a];
      if (!Qu.call(t, n) || !_t(e[n], t[n]))
        return !1;
    }
    return !0;
  }
  function go(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function yo(e, t) {
    var l = go(e);
    e = 0;
    for (var a; l; ) {
      if (l.nodeType === 3) {
        if (a = e + l.textContent.length, e <= t && a >= t)
          return { node: l, offset: t - e };
        e = a;
      }
      e: {
        for (; l; ) {
          if (l.nextSibling) {
            l = l.nextSibling;
            break e;
          }
          l = l.parentNode;
        }
        l = void 0;
      }
      l = go(l);
    }
  }
  function bo(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? bo(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function xo(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = di(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var l = typeof t.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) e = t.contentWindow;
      else break;
      t = di(e.document);
    }
    return t;
  }
  function hs(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var Mp = ll && "documentMode" in document && 11 >= document.documentMode, ja = null, ps = null, pn = null, vs = !1;
  function _o(e, t, l) {
    var a = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    vs || ja == null || ja !== di(a) || (a = ja, "selectionStart" in a && hs(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), pn && hn(pn, a) || (pn = a, a = su(ps, "onSelect"), 0 < a.length && (t = new gi(
      "onSelect",
      "select",
      null,
      t,
      l
    ), e.push({ event: t, listeners: a }), t.target = ja)));
  }
  function Fl(e, t) {
    var l = {};
    return l[e.toLowerCase()] = t.toLowerCase(), l["Webkit" + e] = "webkit" + t, l["Moz" + e] = "moz" + t, l;
  }
  var Ea = {
    animationend: Fl("Animation", "AnimationEnd"),
    animationiteration: Fl("Animation", "AnimationIteration"),
    animationstart: Fl("Animation", "AnimationStart"),
    transitionrun: Fl("Transition", "TransitionRun"),
    transitionstart: Fl("Transition", "TransitionStart"),
    transitioncancel: Fl("Transition", "TransitionCancel"),
    transitionend: Fl("Transition", "TransitionEnd")
  }, gs = {}, So = {};
  ll && (So = document.createElement("div").style, "AnimationEvent" in window || (delete Ea.animationend.animation, delete Ea.animationiteration.animation, delete Ea.animationstart.animation), "TransitionEvent" in window || delete Ea.transitionend.transition);
  function Wl(e) {
    if (gs[e]) return gs[e];
    if (!Ea[e]) return e;
    var t = Ea[e], l;
    for (l in t)
      if (t.hasOwnProperty(l) && l in So)
        return gs[e] = t[l];
    return e;
  }
  var jo = Wl("animationend"), Eo = Wl("animationiteration"), No = Wl("animationstart"), Rp = Wl("transitionrun"), Cp = Wl("transitionstart"), Op = Wl("transitioncancel"), To = Wl("transitionend"), Ao = /* @__PURE__ */ new Map(), ys = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  ys.push("scrollEnd");
  function Qt(e, t) {
    Ao.set(e, t), Jl(t, [e]);
  }
  var xi = typeof reportError == "function" ? reportError : function(e) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var t = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof e == "object" && e !== null && typeof e.message == "string" ? String(e.message) : String(e),
        error: e
      });
      if (!window.dispatchEvent(t)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", e);
      return;
    }
    console.error(e);
  }, Ot = [], Na = 0, bs = 0;
  function _i() {
    for (var e = Na, t = bs = Na = 0; t < e; ) {
      var l = Ot[t];
      Ot[t++] = null;
      var a = Ot[t];
      Ot[t++] = null;
      var n = Ot[t];
      Ot[t++] = null;
      var i = Ot[t];
      if (Ot[t++] = null, a !== null && n !== null) {
        var r = a.pending;
        r === null ? n.next = n : (n.next = r.next, r.next = n), a.pending = n;
      }
      i !== 0 && zo(l, n, i);
    }
  }
  function Si(e, t, l, a) {
    Ot[Na++] = e, Ot[Na++] = t, Ot[Na++] = l, Ot[Na++] = a, bs |= a, e.lanes |= a, e = e.alternate, e !== null && (e.lanes |= a);
  }
  function xs(e, t, l, a) {
    return Si(e, t, l, a), ji(e);
  }
  function Pl(e, t) {
    return Si(e, null, null, t), ji(e);
  }
  function zo(e, t, l) {
    e.lanes |= l;
    var a = e.alternate;
    a !== null && (a.lanes |= l);
    for (var n = !1, i = e.return; i !== null; )
      i.childLanes |= l, a = i.alternate, a !== null && (a.childLanes |= l), i.tag === 22 && (e = i.stateNode, e === null || e._visibility & 1 || (n = !0)), e = i, i = i.return;
    return e.tag === 3 ? (i = e.stateNode, n && t !== null && (n = 31 - xt(l), e = i.hiddenUpdates, a = e[n], a === null ? e[n] = [t] : a.push(t), t.lane = l | 536870912), i) : null;
  }
  function ji(e) {
    if (50 < Bn)
      throw Bn = 0, Mc = null, Error(c(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var Ta = {};
  function Dp(e, t, l, a) {
    this.tag = e, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function St(e, t, l, a) {
    return new Dp(e, t, l, a);
  }
  function _s(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function al(e, t) {
    var l = e.alternate;
    return l === null ? (l = St(
      e.tag,
      t,
      e.key,
      e.mode
    ), l.elementType = e.elementType, l.type = e.type, l.stateNode = e.stateNode, l.alternate = e, e.alternate = l) : (l.pendingProps = t, l.type = e.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = e.flags & 65011712, l.childLanes = e.childLanes, l.lanes = e.lanes, l.child = e.child, l.memoizedProps = e.memoizedProps, l.memoizedState = e.memoizedState, l.updateQueue = e.updateQueue, t = e.dependencies, l.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, l.sibling = e.sibling, l.index = e.index, l.ref = e.ref, l.refCleanup = e.refCleanup, l;
  }
  function Mo(e, t) {
    e.flags &= 65011714;
    var l = e.alternate;
    return l === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = l.childLanes, e.lanes = l.lanes, e.child = l.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = l.memoizedProps, e.memoizedState = l.memoizedState, e.updateQueue = l.updateQueue, e.type = l.type, t = l.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function Ei(e, t, l, a, n, i) {
    var r = 0;
    if (a = e, typeof e == "function") _s(e) && (r = 1);
    else if (typeof e == "string")
      r = Lv(
        e,
        l,
        J.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case we:
          return e = St(31, l, t, n), e.elementType = we, e.lanes = i, e;
        case G:
          return Il(l.children, n, i, t);
        case D:
          r = 8, n |= 24;
          break;
        case Q:
          return e = St(12, l, t, n | 2), e.elementType = Q, e.lanes = i, e;
        case ne:
          return e = St(13, l, t, n), e.elementType = ne, e.lanes = i, e;
        case ve:
          return e = St(19, l, t, n), e.elementType = ve, e.lanes = i, e;
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case L:
                r = 10;
                break e;
              case V:
                r = 9;
                break e;
              case ae:
                r = 11;
                break e;
              case P:
                r = 14;
                break e;
              case _e:
                r = 16, a = null;
                break e;
            }
          r = 29, l = Error(
            c(130, e === null ? "null" : typeof e, "")
          ), a = null;
      }
    return t = St(r, l, t, n), t.elementType = e, t.type = a, t.lanes = i, t;
  }
  function Il(e, t, l, a) {
    return e = St(7, e, a, t), e.lanes = l, e;
  }
  function Ss(e, t, l) {
    return e = St(6, e, null, t), e.lanes = l, e;
  }
  function Ro(e) {
    var t = St(18, null, null, 0);
    return t.stateNode = e, t;
  }
  function js(e, t, l) {
    return t = St(
      4,
      e.children !== null ? e.children : [],
      e.key,
      t
    ), t.lanes = l, t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation
    }, t;
  }
  var Co = /* @__PURE__ */ new WeakMap();
  function Dt(e, t) {
    if (typeof e == "object" && e !== null) {
      var l = Co.get(e);
      return l !== void 0 ? l : (t = {
        value: e,
        source: t,
        stack: Mr(t)
      }, Co.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: Mr(t)
    };
  }
  var Aa = [], za = 0, Ni = null, vn = 0, Ut = [], wt = 0, Sl = null, $t = 1, Ft = "";
  function nl(e, t) {
    Aa[za++] = vn, Aa[za++] = Ni, Ni = e, vn = t;
  }
  function Oo(e, t, l) {
    Ut[wt++] = $t, Ut[wt++] = Ft, Ut[wt++] = Sl, Sl = e;
    var a = $t;
    e = Ft;
    var n = 32 - xt(a) - 1;
    a &= ~(1 << n), l += 1;
    var i = 32 - xt(t) + n;
    if (30 < i) {
      var r = n - n % 5;
      i = (a & (1 << r) - 1).toString(32), a >>= r, n -= r, $t = 1 << 32 - xt(t) + n | l << n | a, Ft = i + e;
    } else
      $t = 1 << i | l << n | a, Ft = e;
  }
  function Es(e) {
    e.return !== null && (nl(e, 1), Oo(e, 1, 0));
  }
  function Ns(e) {
    for (; e === Ni; )
      Ni = Aa[--za], Aa[za] = null, vn = Aa[--za], Aa[za] = null;
    for (; e === Sl; )
      Sl = Ut[--wt], Ut[wt] = null, Ft = Ut[--wt], Ut[wt] = null, $t = Ut[--wt], Ut[wt] = null;
  }
  function Do(e, t) {
    Ut[wt++] = $t, Ut[wt++] = Ft, Ut[wt++] = Sl, $t = t.id, Ft = t.overflow, Sl = e;
  }
  var Ie = null, Re = null, pe = !1, jl = null, Ht = !1, Ts = Error(c(519));
  function El(e) {
    var t = Error(
      c(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw gn(Dt(t, e)), Ts;
  }
  function Uo(e) {
    var t = e.stateNode, l = e.type, a = e.memoizedProps;
    switch (t[Pe] = e, t[ot] = a, l) {
      case "dialog":
        de("cancel", t), de("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        de("load", t);
        break;
      case "video":
      case "audio":
        for (l = 0; l < qn.length; l++)
          de(qn[l], t);
        break;
      case "source":
        de("error", t);
        break;
      case "img":
      case "image":
      case "link":
        de("error", t), de("load", t);
        break;
      case "details":
        de("toggle", t);
        break;
      case "input":
        de("invalid", t), Vr(
          t,
          a.value,
          a.defaultValue,
          a.checked,
          a.defaultChecked,
          a.type,
          a.name,
          !0
        );
        break;
      case "select":
        de("invalid", t);
        break;
      case "textarea":
        de("invalid", t), Jr(t, a.value, a.defaultValue, a.children);
    }
    l = a.children, typeof l != "string" && typeof l != "number" && typeof l != "bigint" || t.textContent === "" + l || a.suppressHydrationWarning === !0 || Pd(t.textContent, l) ? (a.popover != null && (de("beforetoggle", t), de("toggle", t)), a.onScroll != null && de("scroll", t), a.onScrollEnd != null && de("scrollend", t), a.onClick != null && (t.onclick = tl), t = !0) : t = !1, t || El(e, !0);
  }
  function wo(e) {
    for (Ie = e.return; Ie; )
      switch (Ie.tag) {
        case 5:
        case 31:
        case 13:
          Ht = !1;
          return;
        case 27:
        case 3:
          Ht = !0;
          return;
        default:
          Ie = Ie.return;
      }
  }
  function Ma(e) {
    if (e !== Ie) return !1;
    if (!pe) return wo(e), pe = !0, !1;
    var t = e.tag, l;
    if ((l = t !== 3 && t !== 27) && ((l = t === 5) && (l = e.type, l = !(l !== "form" && l !== "button") || Qc(e.type, e.memoizedProps)), l = !l), l && Re && El(e), wo(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(c(317));
      Re = sm(e);
    } else if (t === 31) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(c(317));
      Re = sm(e);
    } else
      t === 27 ? (t = Re, Ll(e.type) ? (e = $c, $c = null, Re = e) : Re = t) : Re = Ie ? Lt(e.stateNode.nextSibling) : null;
    return !0;
  }
  function ea() {
    Re = Ie = null, pe = !1;
  }
  function As() {
    var e = jl;
    return e !== null && (pt === null ? pt = e : pt.push.apply(
      pt,
      e
    ), jl = null), e;
  }
  function gn(e) {
    jl === null ? jl = [e] : jl.push(e);
  }
  var zs = S(null), ta = null, il = null;
  function Nl(e, t, l) {
    k(zs, t._currentValue), t._currentValue = l;
  }
  function ul(e) {
    e._currentValue = zs.current, w(zs);
  }
  function Ms(e, t, l) {
    for (; e !== null; ) {
      var a = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, a !== null && (a.childLanes |= t)) : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t), e === l) break;
      e = e.return;
    }
  }
  function Rs(e, t, l, a) {
    var n = e.child;
    for (n !== null && (n.return = e); n !== null; ) {
      var i = n.dependencies;
      if (i !== null) {
        var r = n.child;
        i = i.firstContext;
        e: for (; i !== null; ) {
          var m = i;
          i = n;
          for (var b = 0; b < t.length; b++)
            if (m.context === t[b]) {
              i.lanes |= l, m = i.alternate, m !== null && (m.lanes |= l), Ms(
                i.return,
                l,
                e
              ), a || (r = null);
              break e;
            }
          i = m.next;
        }
      } else if (n.tag === 18) {
        if (r = n.return, r === null) throw Error(c(341));
        r.lanes |= l, i = r.alternate, i !== null && (i.lanes |= l), Ms(r, l, e), r = null;
      } else r = n.child;
      if (r !== null) r.return = n;
      else
        for (r = n; r !== null; ) {
          if (r === e) {
            r = null;
            break;
          }
          if (n = r.sibling, n !== null) {
            n.return = r.return, r = n;
            break;
          }
          r = r.return;
        }
      n = r;
    }
  }
  function Ra(e, t, l, a) {
    e = null;
    for (var n = t, i = !1; n !== null; ) {
      if (!i) {
        if ((n.flags & 524288) !== 0) i = !0;
        else if ((n.flags & 262144) !== 0) break;
      }
      if (n.tag === 10) {
        var r = n.alternate;
        if (r === null) throw Error(c(387));
        if (r = r.memoizedProps, r !== null) {
          var m = n.type;
          _t(n.pendingProps.value, r.value) || (e !== null ? e.push(m) : e = [m]);
        }
      } else if (n === Se.current) {
        if (r = n.alternate, r === null) throw Error(c(387));
        r.memoizedState.memoizedState !== n.memoizedState.memoizedState && (e !== null ? e.push(Qn) : e = [Qn]);
      }
      n = n.return;
    }
    e !== null && Rs(
      t,
      e,
      l,
      a
    ), t.flags |= 262144;
  }
  function Ti(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!_t(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function la(e) {
    ta = e, il = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function et(e) {
    return Ho(ta, e);
  }
  function Ai(e, t) {
    return ta === null && la(e), Ho(e, t);
  }
  function Ho(e, t) {
    var l = t._currentValue;
    if (t = { context: t, memoizedValue: l, next: null }, il === null) {
      if (e === null) throw Error(c(308));
      il = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else il = il.next = t;
    return l;
  }
  var Up = typeof AbortController < "u" ? AbortController : function() {
    var e = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(l, a) {
        e.push(a);
      }
    };
    this.abort = function() {
      t.aborted = !0, e.forEach(function(l) {
        return l();
      });
    };
  }, wp = u.unstable_scheduleCallback, Hp = u.unstable_NormalPriority, ke = {
    $$typeof: L,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Cs() {
    return {
      controller: new Up(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function yn(e) {
    e.refCount--, e.refCount === 0 && wp(Hp, function() {
      e.controller.abort();
    });
  }
  var bn = null, Os = 0, Ca = 0, Oa = null;
  function Bp(e, t) {
    if (bn === null) {
      var l = bn = [];
      Os = 0, Ca = wc(), Oa = {
        status: "pending",
        value: void 0,
        then: function(a) {
          l.push(a);
        }
      };
    }
    return Os++, t.then(Bo, Bo), t;
  }
  function Bo() {
    if (--Os === 0 && bn !== null) {
      Oa !== null && (Oa.status = "fulfilled");
      var e = bn;
      bn = null, Ca = 0, Oa = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function Lp(e, t) {
    var l = [], a = {
      status: "pending",
      value: null,
      reason: null,
      then: function(n) {
        l.push(n);
      }
    };
    return e.then(
      function() {
        a.status = "fulfilled", a.value = t;
        for (var n = 0; n < l.length; n++) (0, l[n])(t);
      },
      function(n) {
        for (a.status = "rejected", a.reason = n, n = 0; n < l.length; n++)
          (0, l[n])(void 0);
      }
    ), a;
  }
  var Lo = M.S;
  M.S = function(e, t) {
    Sd = yt(), typeof t == "object" && t !== null && typeof t.then == "function" && Bp(e, t), Lo !== null && Lo(e, t);
  };
  var aa = S(null);
  function Ds() {
    var e = aa.current;
    return e !== null ? e : Me.pooledCache;
  }
  function zi(e, t) {
    t === null ? k(aa, aa.current) : k(aa, t.pool);
  }
  function qo() {
    var e = Ds();
    return e === null ? null : { parent: ke._currentValue, pool: e };
  }
  var Da = Error(c(460)), Us = Error(c(474)), Mi = Error(c(542)), Ri = { then: function() {
  } };
  function Yo(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function Go(e, t, l) {
    switch (l = e[l], l === void 0 ? e.push(t) : l !== t && (t.then(tl, tl), t = l), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, ko(e), e;
      default:
        if (typeof t.status == "string") t.then(tl, tl);
        else {
          if (e = Me, e !== null && 100 < e.shellSuspendCounter)
            throw Error(c(482));
          e = t, e.status = "pending", e.then(
            function(a) {
              if (t.status === "pending") {
                var n = t;
                n.status = "fulfilled", n.value = a;
              }
            },
            function(a) {
              if (t.status === "pending") {
                var n = t;
                n.status = "rejected", n.reason = a;
              }
            }
          );
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw e = t.reason, ko(e), e;
        }
        throw ia = t, Da;
    }
  }
  function na(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (l) {
      throw l !== null && typeof l == "object" && typeof l.then == "function" ? (ia = l, Da) : l;
    }
  }
  var ia = null;
  function Xo() {
    if (ia === null) throw Error(c(459));
    var e = ia;
    return ia = null, e;
  }
  function ko(e) {
    if (e === Da || e === Mi)
      throw Error(c(483));
  }
  var Ua = null, xn = 0;
  function Ci(e) {
    var t = xn;
    return xn += 1, Ua === null && (Ua = []), Go(Ua, e, t);
  }
  function _n(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function Oi(e, t) {
    throw t.$$typeof === T ? Error(c(525)) : (e = Object.prototype.toString.call(t), Error(
      c(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function Qo(e) {
    function t(N, _) {
      if (e) {
        var A = N.deletions;
        A === null ? (N.deletions = [_], N.flags |= 16) : A.push(_);
      }
    }
    function l(N, _) {
      if (!e) return null;
      for (; _ !== null; )
        t(N, _), _ = _.sibling;
      return null;
    }
    function a(N) {
      for (var _ = /* @__PURE__ */ new Map(); N !== null; )
        N.key !== null ? _.set(N.key, N) : _.set(N.index, N), N = N.sibling;
      return _;
    }
    function n(N, _) {
      return N = al(N, _), N.index = 0, N.sibling = null, N;
    }
    function i(N, _, A) {
      return N.index = A, e ? (A = N.alternate, A !== null ? (A = A.index, A < _ ? (N.flags |= 67108866, _) : A) : (N.flags |= 67108866, _)) : (N.flags |= 1048576, _);
    }
    function r(N) {
      return e && N.alternate === null && (N.flags |= 67108866), N;
    }
    function m(N, _, A, H) {
      return _ === null || _.tag !== 6 ? (_ = Ss(A, N.mode, H), _.return = N, _) : (_ = n(_, A), _.return = N, _);
    }
    function b(N, _, A, H) {
      var I = A.type;
      return I === G ? O(
        N,
        _,
        A.props.children,
        H,
        A.key
      ) : _ !== null && (_.elementType === I || typeof I == "object" && I !== null && I.$$typeof === _e && na(I) === _.type) ? (_ = n(_, A.props), _n(_, A), _.return = N, _) : (_ = Ei(
        A.type,
        A.key,
        A.props,
        null,
        N.mode,
        H
      ), _n(_, A), _.return = N, _);
    }
    function z(N, _, A, H) {
      return _ === null || _.tag !== 4 || _.stateNode.containerInfo !== A.containerInfo || _.stateNode.implementation !== A.implementation ? (_ = js(A, N.mode, H), _.return = N, _) : (_ = n(_, A.children || []), _.return = N, _);
    }
    function O(N, _, A, H, I) {
      return _ === null || _.tag !== 7 ? (_ = Il(
        A,
        N.mode,
        H,
        I
      ), _.return = N, _) : (_ = n(_, A), _.return = N, _);
    }
    function B(N, _, A) {
      if (typeof _ == "string" && _ !== "" || typeof _ == "number" || typeof _ == "bigint")
        return _ = Ss(
          "" + _,
          N.mode,
          A
        ), _.return = N, _;
      if (typeof _ == "object" && _ !== null) {
        switch (_.$$typeof) {
          case Y:
            return A = Ei(
              _.type,
              _.key,
              _.props,
              null,
              N.mode,
              A
            ), _n(A, _), A.return = N, A;
          case X:
            return _ = js(
              _,
              N.mode,
              A
            ), _.return = N, _;
          case _e:
            return _ = na(_), B(N, _, A);
        }
        if (ee(_) || Xe(_))
          return _ = Il(
            _,
            N.mode,
            A,
            null
          ), _.return = N, _;
        if (typeof _.then == "function")
          return B(N, Ci(_), A);
        if (_.$$typeof === L)
          return B(
            N,
            Ai(N, _),
            A
          );
        Oi(N, _);
      }
      return null;
    }
    function R(N, _, A, H) {
      var I = _ !== null ? _.key : null;
      if (typeof A == "string" && A !== "" || typeof A == "number" || typeof A == "bigint")
        return I !== null ? null : m(N, _, "" + A, H);
      if (typeof A == "object" && A !== null) {
        switch (A.$$typeof) {
          case Y:
            return A.key === I ? b(N, _, A, H) : null;
          case X:
            return A.key === I ? z(N, _, A, H) : null;
          case _e:
            return A = na(A), R(N, _, A, H);
        }
        if (ee(A) || Xe(A))
          return I !== null ? null : O(N, _, A, H, null);
        if (typeof A.then == "function")
          return R(
            N,
            _,
            Ci(A),
            H
          );
        if (A.$$typeof === L)
          return R(
            N,
            _,
            Ai(N, A),
            H
          );
        Oi(N, A);
      }
      return null;
    }
    function C(N, _, A, H, I) {
      if (typeof H == "string" && H !== "" || typeof H == "number" || typeof H == "bigint")
        return N = N.get(A) || null, m(_, N, "" + H, I);
      if (typeof H == "object" && H !== null) {
        switch (H.$$typeof) {
          case Y:
            return N = N.get(
              H.key === null ? A : H.key
            ) || null, b(_, N, H, I);
          case X:
            return N = N.get(
              H.key === null ? A : H.key
            ) || null, z(_, N, H, I);
          case _e:
            return H = na(H), C(
              N,
              _,
              A,
              H,
              I
            );
        }
        if (ee(H) || Xe(H))
          return N = N.get(A) || null, O(_, N, H, I, null);
        if (typeof H.then == "function")
          return C(
            N,
            _,
            A,
            Ci(H),
            I
          );
        if (H.$$typeof === L)
          return C(
            N,
            _,
            A,
            Ai(_, H),
            I
          );
        Oi(_, H);
      }
      return null;
    }
    function K(N, _, A, H) {
      for (var I = null, ge = null, F = _, ce = _ = 0, he = null; F !== null && ce < A.length; ce++) {
        F.index > ce ? (he = F, F = null) : he = F.sibling;
        var ye = R(
          N,
          F,
          A[ce],
          H
        );
        if (ye === null) {
          F === null && (F = he);
          break;
        }
        e && F && ye.alternate === null && t(N, F), _ = i(ye, _, ce), ge === null ? I = ye : ge.sibling = ye, ge = ye, F = he;
      }
      if (ce === A.length)
        return l(N, F), pe && nl(N, ce), I;
      if (F === null) {
        for (; ce < A.length; ce++)
          F = B(N, A[ce], H), F !== null && (_ = i(
            F,
            _,
            ce
          ), ge === null ? I = F : ge.sibling = F, ge = F);
        return pe && nl(N, ce), I;
      }
      for (F = a(F); ce < A.length; ce++)
        he = C(
          F,
          N,
          ce,
          A[ce],
          H
        ), he !== null && (e && he.alternate !== null && F.delete(
          he.key === null ? ce : he.key
        ), _ = i(
          he,
          _,
          ce
        ), ge === null ? I = he : ge.sibling = he, ge = he);
      return e && F.forEach(function(kl) {
        return t(N, kl);
      }), pe && nl(N, ce), I;
    }
    function te(N, _, A, H) {
      if (A == null) throw Error(c(151));
      for (var I = null, ge = null, F = _, ce = _ = 0, he = null, ye = A.next(); F !== null && !ye.done; ce++, ye = A.next()) {
        F.index > ce ? (he = F, F = null) : he = F.sibling;
        var kl = R(N, F, ye.value, H);
        if (kl === null) {
          F === null && (F = he);
          break;
        }
        e && F && kl.alternate === null && t(N, F), _ = i(kl, _, ce), ge === null ? I = kl : ge.sibling = kl, ge = kl, F = he;
      }
      if (ye.done)
        return l(N, F), pe && nl(N, ce), I;
      if (F === null) {
        for (; !ye.done; ce++, ye = A.next())
          ye = B(N, ye.value, H), ye !== null && (_ = i(ye, _, ce), ge === null ? I = ye : ge.sibling = ye, ge = ye);
        return pe && nl(N, ce), I;
      }
      for (F = a(F); !ye.done; ce++, ye = A.next())
        ye = C(F, N, ce, ye.value, H), ye !== null && (e && ye.alternate !== null && F.delete(ye.key === null ? ce : ye.key), _ = i(ye, _, ce), ge === null ? I = ye : ge.sibling = ye, ge = ye);
      return e && F.forEach(function($v) {
        return t(N, $v);
      }), pe && nl(N, ce), I;
    }
    function ze(N, _, A, H) {
      if (typeof A == "object" && A !== null && A.type === G && A.key === null && (A = A.props.children), typeof A == "object" && A !== null) {
        switch (A.$$typeof) {
          case Y:
            e: {
              for (var I = A.key; _ !== null; ) {
                if (_.key === I) {
                  if (I = A.type, I === G) {
                    if (_.tag === 7) {
                      l(
                        N,
                        _.sibling
                      ), H = n(
                        _,
                        A.props.children
                      ), H.return = N, N = H;
                      break e;
                    }
                  } else if (_.elementType === I || typeof I == "object" && I !== null && I.$$typeof === _e && na(I) === _.type) {
                    l(
                      N,
                      _.sibling
                    ), H = n(_, A.props), _n(H, A), H.return = N, N = H;
                    break e;
                  }
                  l(N, _);
                  break;
                } else t(N, _);
                _ = _.sibling;
              }
              A.type === G ? (H = Il(
                A.props.children,
                N.mode,
                H,
                A.key
              ), H.return = N, N = H) : (H = Ei(
                A.type,
                A.key,
                A.props,
                null,
                N.mode,
                H
              ), _n(H, A), H.return = N, N = H);
            }
            return r(N);
          case X:
            e: {
              for (I = A.key; _ !== null; ) {
                if (_.key === I)
                  if (_.tag === 4 && _.stateNode.containerInfo === A.containerInfo && _.stateNode.implementation === A.implementation) {
                    l(
                      N,
                      _.sibling
                    ), H = n(_, A.children || []), H.return = N, N = H;
                    break e;
                  } else {
                    l(N, _);
                    break;
                  }
                else t(N, _);
                _ = _.sibling;
              }
              H = js(A, N.mode, H), H.return = N, N = H;
            }
            return r(N);
          case _e:
            return A = na(A), ze(
              N,
              _,
              A,
              H
            );
        }
        if (ee(A))
          return K(
            N,
            _,
            A,
            H
          );
        if (Xe(A)) {
          if (I = Xe(A), typeof I != "function") throw Error(c(150));
          return A = I.call(A), te(
            N,
            _,
            A,
            H
          );
        }
        if (typeof A.then == "function")
          return ze(
            N,
            _,
            Ci(A),
            H
          );
        if (A.$$typeof === L)
          return ze(
            N,
            _,
            Ai(N, A),
            H
          );
        Oi(N, A);
      }
      return typeof A == "string" && A !== "" || typeof A == "number" || typeof A == "bigint" ? (A = "" + A, _ !== null && _.tag === 6 ? (l(N, _.sibling), H = n(_, A), H.return = N, N = H) : (l(N, _), H = Ss(A, N.mode, H), H.return = N, N = H), r(N)) : l(N, _);
    }
    return function(N, _, A, H) {
      try {
        xn = 0;
        var I = ze(
          N,
          _,
          A,
          H
        );
        return Ua = null, I;
      } catch (F) {
        if (F === Da || F === Mi) throw F;
        var ge = St(29, F, null, N.mode);
        return ge.lanes = H, ge.return = N, ge;
      } finally {
      }
    };
  }
  var ua = Qo(!0), Zo = Qo(!1), Tl = !1;
  function ws(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Hs(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function Al(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function zl(e, t, l) {
    var a = e.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (xe & 2) !== 0) {
      var n = a.pending;
      return n === null ? t.next = t : (t.next = n.next, n.next = t), a.pending = t, t = ji(e), zo(e, null, l), t;
    }
    return Si(e, a, t, l), ji(e);
  }
  function Sn(e, t, l) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (l & 4194048) !== 0)) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, wr(e, l);
    }
  }
  function Bs(e, t) {
    var l = e.updateQueue, a = e.alternate;
    if (a !== null && (a = a.updateQueue, l === a)) {
      var n = null, i = null;
      if (l = l.firstBaseUpdate, l !== null) {
        do {
          var r = {
            lane: l.lane,
            tag: l.tag,
            payload: l.payload,
            callback: null,
            next: null
          };
          i === null ? n = i = r : i = i.next = r, l = l.next;
        } while (l !== null);
        i === null ? n = i = t : i = i.next = t;
      } else n = i = t;
      l = {
        baseState: a.baseState,
        firstBaseUpdate: n,
        lastBaseUpdate: i,
        shared: a.shared,
        callbacks: a.callbacks
      }, e.updateQueue = l;
      return;
    }
    e = l.lastBaseUpdate, e === null ? l.firstBaseUpdate = t : e.next = t, l.lastBaseUpdate = t;
  }
  var Ls = !1;
  function jn() {
    if (Ls) {
      var e = Oa;
      if (e !== null) throw e;
    }
  }
  function En(e, t, l, a) {
    Ls = !1;
    var n = e.updateQueue;
    Tl = !1;
    var i = n.firstBaseUpdate, r = n.lastBaseUpdate, m = n.shared.pending;
    if (m !== null) {
      n.shared.pending = null;
      var b = m, z = b.next;
      b.next = null, r === null ? i = z : r.next = z, r = b;
      var O = e.alternate;
      O !== null && (O = O.updateQueue, m = O.lastBaseUpdate, m !== r && (m === null ? O.firstBaseUpdate = z : m.next = z, O.lastBaseUpdate = b));
    }
    if (i !== null) {
      var B = n.baseState;
      r = 0, O = z = b = null, m = i;
      do {
        var R = m.lane & -536870913, C = R !== m.lane;
        if (C ? (me & R) === R : (a & R) === R) {
          R !== 0 && R === Ca && (Ls = !0), O !== null && (O = O.next = {
            lane: 0,
            tag: m.tag,
            payload: m.payload,
            callback: null,
            next: null
          });
          e: {
            var K = e, te = m;
            R = t;
            var ze = l;
            switch (te.tag) {
              case 1:
                if (K = te.payload, typeof K == "function") {
                  B = K.call(ze, B, R);
                  break e;
                }
                B = K;
                break e;
              case 3:
                K.flags = K.flags & -65537 | 128;
              case 0:
                if (K = te.payload, R = typeof K == "function" ? K.call(ze, B, R) : K, R == null) break e;
                B = j({}, B, R);
                break e;
              case 2:
                Tl = !0;
            }
          }
          R = m.callback, R !== null && (e.flags |= 64, C && (e.flags |= 8192), C = n.callbacks, C === null ? n.callbacks = [R] : C.push(R));
        } else
          C = {
            lane: R,
            tag: m.tag,
            payload: m.payload,
            callback: m.callback,
            next: null
          }, O === null ? (z = O = C, b = B) : O = O.next = C, r |= R;
        if (m = m.next, m === null) {
          if (m = n.shared.pending, m === null)
            break;
          C = m, m = C.next, C.next = null, n.lastBaseUpdate = C, n.shared.pending = null;
        }
      } while (!0);
      O === null && (b = B), n.baseState = b, n.firstBaseUpdate = z, n.lastBaseUpdate = O, i === null && (n.shared.lanes = 0), Dl |= r, e.lanes = r, e.memoizedState = B;
    }
  }
  function Vo(e, t) {
    if (typeof e != "function")
      throw Error(c(191, e));
    e.call(t);
  }
  function Ko(e, t) {
    var l = e.callbacks;
    if (l !== null)
      for (e.callbacks = null, e = 0; e < l.length; e++)
        Vo(l[e], t);
  }
  var wa = S(null), Di = S(0);
  function Jo(e, t) {
    e = pl, k(Di, e), k(wa, t), pl = e | t.baseLanes;
  }
  function qs() {
    k(Di, pl), k(wa, wa.current);
  }
  function Ys() {
    pl = Di.current, w(wa), w(Di);
  }
  var jt = S(null), Bt = null;
  function Ml(e) {
    var t = e.alternate;
    k(Ye, Ye.current & 1), k(jt, e), Bt === null && (t === null || wa.current !== null || t.memoizedState !== null) && (Bt = e);
  }
  function Gs(e) {
    k(Ye, Ye.current), k(jt, e), Bt === null && (Bt = e);
  }
  function $o(e) {
    e.tag === 22 ? (k(Ye, Ye.current), k(jt, e), Bt === null && (Bt = e)) : Rl();
  }
  function Rl() {
    k(Ye, Ye.current), k(jt, jt.current);
  }
  function Et(e) {
    w(jt), Bt === e && (Bt = null), w(Ye);
  }
  var Ye = S(0);
  function Ui(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var l = t.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || Kc(l) || Jc(l)))
          return t;
      } else if (t.tag === 19 && (t.memoizedProps.revealOrder === "forwards" || t.memoizedProps.revealOrder === "backwards" || t.memoizedProps.revealOrder === "unstable_legacy-backwards" || t.memoizedProps.revealOrder === "together")) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    return null;
  }
  var sl = 0, se = null, Te = null, Qe = null, wi = !1, Ha = !1, sa = !1, Hi = 0, Nn = 0, Ba = null, qp = 0;
  function He() {
    throw Error(c(321));
  }
  function Xs(e, t) {
    if (t === null) return !1;
    for (var l = 0; l < t.length && l < e.length; l++)
      if (!_t(e[l], t[l])) return !1;
    return !0;
  }
  function ks(e, t, l, a, n, i) {
    return sl = i, se = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, M.H = e === null || e.memoizedState === null ? Df : nc, sa = !1, i = l(a, n), sa = !1, Ha && (i = Wo(
      t,
      l,
      a,
      n
    )), Fo(e), i;
  }
  function Fo(e) {
    M.H = zn;
    var t = Te !== null && Te.next !== null;
    if (sl = 0, Qe = Te = se = null, wi = !1, Nn = 0, Ba = null, t) throw Error(c(300));
    e === null || Ze || (e = e.dependencies, e !== null && Ti(e) && (Ze = !0));
  }
  function Wo(e, t, l, a) {
    se = e;
    var n = 0;
    do {
      if (Ha && (Ba = null), Nn = 0, Ha = !1, 25 <= n) throw Error(c(301));
      if (n += 1, Qe = Te = null, e.updateQueue != null) {
        var i = e.updateQueue;
        i.lastEffect = null, i.events = null, i.stores = null, i.memoCache != null && (i.memoCache.index = 0);
      }
      M.H = Uf, i = t(l, a);
    } while (Ha);
    return i;
  }
  function Yp() {
    var e = M.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? Tn(t) : t, e = e.useState()[0], (Te !== null ? Te.memoizedState : null) !== e && (se.flags |= 1024), t;
  }
  function Qs() {
    var e = Hi !== 0;
    return Hi = 0, e;
  }
  function Zs(e, t, l) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l;
  }
  function Vs(e) {
    if (wi) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      wi = !1;
    }
    sl = 0, Qe = Te = se = null, Ha = !1, Nn = Hi = 0, Ba = null;
  }
  function rt() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Qe === null ? se.memoizedState = Qe = e : Qe = Qe.next = e, Qe;
  }
  function Ge() {
    if (Te === null) {
      var e = se.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Te.next;
    var t = Qe === null ? se.memoizedState : Qe.next;
    if (t !== null)
      Qe = t, Te = e;
    else {
      if (e === null)
        throw se.alternate === null ? Error(c(467)) : Error(c(310));
      Te = e, e = {
        memoizedState: Te.memoizedState,
        baseState: Te.baseState,
        baseQueue: Te.baseQueue,
        queue: Te.queue,
        next: null
      }, Qe === null ? se.memoizedState = Qe = e : Qe = Qe.next = e;
    }
    return Qe;
  }
  function Bi() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Tn(e) {
    var t = Nn;
    return Nn += 1, Ba === null && (Ba = []), e = Go(Ba, e, t), t = se, (Qe === null ? t.memoizedState : Qe.next) === null && (t = t.alternate, M.H = t === null || t.memoizedState === null ? Df : nc), e;
  }
  function Li(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return Tn(e);
      if (e.$$typeof === L) return et(e);
    }
    throw Error(c(438, String(e)));
  }
  function Ks(e) {
    var t = null, l = se.updateQueue;
    if (l !== null && (t = l.memoCache), t == null) {
      var a = se.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (t = {
        data: a.data.map(function(n) {
          return n.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), l === null && (l = Bi(), se.updateQueue = l), l.memoCache = t, l = t.data[t.index], l === void 0)
      for (l = t.data[t.index] = Array(e), a = 0; a < e; a++)
        l[a] = it;
    return t.index++, l;
  }
  function cl(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function qi(e) {
    var t = Ge();
    return Js(t, Te, e);
  }
  function Js(e, t, l) {
    var a = e.queue;
    if (a === null) throw Error(c(311));
    a.lastRenderedReducer = l;
    var n = e.baseQueue, i = a.pending;
    if (i !== null) {
      if (n !== null) {
        var r = n.next;
        n.next = i.next, i.next = r;
      }
      t.baseQueue = n = i, a.pending = null;
    }
    if (i = e.baseState, n === null) e.memoizedState = i;
    else {
      t = n.next;
      var m = r = null, b = null, z = t, O = !1;
      do {
        var B = z.lane & -536870913;
        if (B !== z.lane ? (me & B) === B : (sl & B) === B) {
          var R = z.revertLane;
          if (R === 0)
            b !== null && (b = b.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: z.action,
              hasEagerState: z.hasEagerState,
              eagerState: z.eagerState,
              next: null
            }), B === Ca && (O = !0);
          else if ((sl & R) === R) {
            z = z.next, R === Ca && (O = !0);
            continue;
          } else
            B = {
              lane: 0,
              revertLane: z.revertLane,
              gesture: null,
              action: z.action,
              hasEagerState: z.hasEagerState,
              eagerState: z.eagerState,
              next: null
            }, b === null ? (m = b = B, r = i) : b = b.next = B, se.lanes |= R, Dl |= R;
          B = z.action, sa && l(i, B), i = z.hasEagerState ? z.eagerState : l(i, B);
        } else
          R = {
            lane: B,
            revertLane: z.revertLane,
            gesture: z.gesture,
            action: z.action,
            hasEagerState: z.hasEagerState,
            eagerState: z.eagerState,
            next: null
          }, b === null ? (m = b = R, r = i) : b = b.next = R, se.lanes |= B, Dl |= B;
        z = z.next;
      } while (z !== null && z !== t);
      if (b === null ? r = i : b.next = m, !_t(i, e.memoizedState) && (Ze = !0, O && (l = Oa, l !== null)))
        throw l;
      e.memoizedState = i, e.baseState = r, e.baseQueue = b, a.lastRenderedState = i;
    }
    return n === null && (a.lanes = 0), [e.memoizedState, a.dispatch];
  }
  function $s(e) {
    var t = Ge(), l = t.queue;
    if (l === null) throw Error(c(311));
    l.lastRenderedReducer = e;
    var a = l.dispatch, n = l.pending, i = t.memoizedState;
    if (n !== null) {
      l.pending = null;
      var r = n = n.next;
      do
        i = e(i, r.action), r = r.next;
      while (r !== n);
      _t(i, t.memoizedState) || (Ze = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), l.lastRenderedState = i;
    }
    return [i, a];
  }
  function Po(e, t, l) {
    var a = se, n = Ge(), i = pe;
    if (i) {
      if (l === void 0) throw Error(c(407));
      l = l();
    } else l = t();
    var r = !_t(
      (Te || n).memoizedState,
      l
    );
    if (r && (n.memoizedState = l, Ze = !0), n = n.queue, Ps(tf.bind(null, a, n, e), [
      e
    ]), n.getSnapshot !== t || r || Qe !== null && Qe.memoizedState.tag & 1) {
      if (a.flags |= 2048, La(
        9,
        { destroy: void 0 },
        ef.bind(
          null,
          a,
          n,
          l,
          t
        ),
        null
      ), Me === null) throw Error(c(349));
      i || (sl & 127) !== 0 || Io(a, t, l);
    }
    return l;
  }
  function Io(e, t, l) {
    e.flags |= 16384, e = { getSnapshot: t, value: l }, t = se.updateQueue, t === null ? (t = Bi(), se.updateQueue = t, t.stores = [e]) : (l = t.stores, l === null ? t.stores = [e] : l.push(e));
  }
  function ef(e, t, l, a) {
    t.value = l, t.getSnapshot = a, lf(t) && af(e);
  }
  function tf(e, t, l) {
    return l(function() {
      lf(t) && af(e);
    });
  }
  function lf(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var l = t();
      return !_t(e, l);
    } catch {
      return !0;
    }
  }
  function af(e) {
    var t = Pl(e, 2);
    t !== null && vt(t, e, 2);
  }
  function Fs(e) {
    var t = rt();
    if (typeof e == "function") {
      var l = e;
      if (e = l(), sa) {
        bl(!0);
        try {
          l();
        } finally {
          bl(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = e, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: cl,
      lastRenderedState: e
    }, t;
  }
  function nf(e, t, l, a) {
    return e.baseState = l, Js(
      e,
      Te,
      typeof a == "function" ? a : cl
    );
  }
  function Gp(e, t, l, a, n) {
    if (Xi(e)) throw Error(c(485));
    if (e = t.action, e !== null) {
      var i = {
        payload: n,
        action: e,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(r) {
          i.listeners.push(r);
        }
      };
      M.T !== null ? l(!0) : i.isTransition = !1, a(i), l = t.pending, l === null ? (i.next = t.pending = i, uf(t, i)) : (i.next = l.next, t.pending = l.next = i);
    }
  }
  function uf(e, t) {
    var l = t.action, a = t.payload, n = e.state;
    if (t.isTransition) {
      var i = M.T, r = {};
      M.T = r;
      try {
        var m = l(n, a), b = M.S;
        b !== null && b(r, m), sf(e, t, m);
      } catch (z) {
        Ws(e, t, z);
      } finally {
        i !== null && r.types !== null && (i.types = r.types), M.T = i;
      }
    } else
      try {
        i = l(n, a), sf(e, t, i);
      } catch (z) {
        Ws(e, t, z);
      }
  }
  function sf(e, t, l) {
    l !== null && typeof l == "object" && typeof l.then == "function" ? l.then(
      function(a) {
        cf(e, t, a);
      },
      function(a) {
        return Ws(e, t, a);
      }
    ) : cf(e, t, l);
  }
  function cf(e, t, l) {
    t.status = "fulfilled", t.value = l, rf(t), e.state = l, t = e.pending, t !== null && (l = t.next, l === t ? e.pending = null : (l = l.next, t.next = l, uf(e, l)));
  }
  function Ws(e, t, l) {
    var a = e.pending;
    if (e.pending = null, a !== null) {
      a = a.next;
      do
        t.status = "rejected", t.reason = l, rf(t), t = t.next;
      while (t !== a);
    }
    e.action = null;
  }
  function rf(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function of(e, t) {
    return t;
  }
  function ff(e, t) {
    if (pe) {
      var l = Me.formState;
      if (l !== null) {
        e: {
          var a = se;
          if (pe) {
            if (Re) {
              t: {
                for (var n = Re, i = Ht; n.nodeType !== 8; ) {
                  if (!i) {
                    n = null;
                    break t;
                  }
                  if (n = Lt(
                    n.nextSibling
                  ), n === null) {
                    n = null;
                    break t;
                  }
                }
                i = n.data, n = i === "F!" || i === "F" ? n : null;
              }
              if (n) {
                Re = Lt(
                  n.nextSibling
                ), a = n.data === "F!";
                break e;
              }
            }
            El(a);
          }
          a = !1;
        }
        a && (t = l[0]);
      }
    }
    return l = rt(), l.memoizedState = l.baseState = t, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: of,
      lastRenderedState: t
    }, l.queue = a, l = Rf.bind(
      null,
      se,
      a
    ), a.dispatch = l, a = Fs(!1), i = ac.bind(
      null,
      se,
      !1,
      a.queue
    ), a = rt(), n = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, a.queue = n, l = Gp.bind(
      null,
      se,
      n,
      i,
      l
    ), n.dispatch = l, a.memoizedState = e, [t, l, !1];
  }
  function df(e) {
    var t = Ge();
    return mf(t, Te, e);
  }
  function mf(e, t, l) {
    if (t = Js(
      e,
      t,
      of
    )[0], e = qi(cl)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var a = Tn(t);
      } catch (r) {
        throw r === Da ? Mi : r;
      }
    else a = t;
    t = Ge();
    var n = t.queue, i = n.dispatch;
    return l !== t.memoizedState && (se.flags |= 2048, La(
      9,
      { destroy: void 0 },
      Xp.bind(null, n, l),
      null
    )), [a, i, e];
  }
  function Xp(e, t) {
    e.action = t;
  }
  function hf(e) {
    var t = Ge(), l = Te;
    if (l !== null)
      return mf(t, l, e);
    Ge(), t = t.memoizedState, l = Ge();
    var a = l.queue.dispatch;
    return l.memoizedState = e, [t, a, !1];
  }
  function La(e, t, l, a) {
    return e = { tag: e, create: l, deps: a, inst: t, next: null }, t = se.updateQueue, t === null && (t = Bi(), se.updateQueue = t), l = t.lastEffect, l === null ? t.lastEffect = e.next = e : (a = l.next, l.next = e, e.next = a, t.lastEffect = e), e;
  }
  function pf() {
    return Ge().memoizedState;
  }
  function Yi(e, t, l, a) {
    var n = rt();
    se.flags |= e, n.memoizedState = La(
      1 | t,
      { destroy: void 0 },
      l,
      a === void 0 ? null : a
    );
  }
  function Gi(e, t, l, a) {
    var n = Ge();
    a = a === void 0 ? null : a;
    var i = n.memoizedState.inst;
    Te !== null && a !== null && Xs(a, Te.memoizedState.deps) ? n.memoizedState = La(t, i, l, a) : (se.flags |= e, n.memoizedState = La(
      1 | t,
      i,
      l,
      a
    ));
  }
  function vf(e, t) {
    Yi(8390656, 8, e, t);
  }
  function Ps(e, t) {
    Gi(2048, 8, e, t);
  }
  function kp(e) {
    se.flags |= 4;
    var t = se.updateQueue;
    if (t === null)
      t = Bi(), se.updateQueue = t, t.events = [e];
    else {
      var l = t.events;
      l === null ? t.events = [e] : l.push(e);
    }
  }
  function gf(e) {
    var t = Ge().memoizedState;
    return kp({ ref: t, nextImpl: e }), function() {
      if ((xe & 2) !== 0) throw Error(c(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function yf(e, t) {
    return Gi(4, 2, e, t);
  }
  function bf(e, t) {
    return Gi(4, 4, e, t);
  }
  function xf(e, t) {
    if (typeof t == "function") {
      e = e();
      var l = t(e);
      return function() {
        typeof l == "function" ? l() : t(null);
      };
    }
    if (t != null)
      return e = e(), t.current = e, function() {
        t.current = null;
      };
  }
  function _f(e, t, l) {
    l = l != null ? l.concat([e]) : null, Gi(4, 4, xf.bind(null, t, e), l);
  }
  function Is() {
  }
  function Sf(e, t) {
    var l = Ge();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    return t !== null && Xs(t, a[1]) ? a[0] : (l.memoizedState = [e, t], e);
  }
  function jf(e, t) {
    var l = Ge();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    if (t !== null && Xs(t, a[1]))
      return a[0];
    if (a = e(), sa) {
      bl(!0);
      try {
        e();
      } finally {
        bl(!1);
      }
    }
    return l.memoizedState = [a, t], a;
  }
  function ec(e, t, l) {
    return l === void 0 || (sl & 1073741824) !== 0 && (me & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = l, e = Ed(), se.lanes |= e, Dl |= e, l);
  }
  function Ef(e, t, l, a) {
    return _t(l, t) ? l : wa.current !== null ? (e = ec(e, l, a), _t(e, t) || (Ze = !0), e) : (sl & 42) === 0 || (sl & 1073741824) !== 0 && (me & 261930) === 0 ? (Ze = !0, e.memoizedState = l) : (e = Ed(), se.lanes |= e, Dl |= e, t);
  }
  function Nf(e, t, l, a, n) {
    var i = q.p;
    q.p = i !== 0 && 8 > i ? i : 8;
    var r = M.T, m = {};
    M.T = m, ac(e, !1, t, l);
    try {
      var b = n(), z = M.S;
      if (z !== null && z(m, b), b !== null && typeof b == "object" && typeof b.then == "function") {
        var O = Lp(
          b,
          a
        );
        An(
          e,
          t,
          O,
          At(e)
        );
      } else
        An(
          e,
          t,
          a,
          At(e)
        );
    } catch (B) {
      An(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: B },
        At()
      );
    } finally {
      q.p = i, r !== null && m.types !== null && (r.types = m.types), M.T = r;
    }
  }
  function Qp() {
  }
  function tc(e, t, l, a) {
    if (e.tag !== 5) throw Error(c(476));
    var n = Tf(e).queue;
    Nf(
      e,
      n,
      t,
      Z,
      l === null ? Qp : function() {
        return Af(e), l(a);
      }
    );
  }
  function Tf(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: Z,
      baseState: Z,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: cl,
        lastRenderedState: Z
      },
      next: null
    };
    var l = {};
    return t.next = {
      memoizedState: l,
      baseState: l,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: cl,
        lastRenderedState: l
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function Af(e) {
    var t = Tf(e);
    t.next === null && (t = e.alternate.memoizedState), An(
      e,
      t.next.queue,
      {},
      At()
    );
  }
  function lc() {
    return et(Qn);
  }
  function zf() {
    return Ge().memoizedState;
  }
  function Mf() {
    return Ge().memoizedState;
  }
  function Zp(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var l = At();
          e = Al(l);
          var a = zl(t, e, l);
          a !== null && (vt(a, t, l), Sn(a, t, l)), t = { cache: Cs() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function Vp(e, t, l) {
    var a = At();
    l = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Xi(e) ? Cf(t, l) : (l = xs(e, t, l, a), l !== null && (vt(l, e, a), Of(l, t, a)));
  }
  function Rf(e, t, l) {
    var a = At();
    An(e, t, l, a);
  }
  function An(e, t, l, a) {
    var n = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (Xi(e)) Cf(t, n);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null))
        try {
          var r = t.lastRenderedState, m = i(r, l);
          if (n.hasEagerState = !0, n.eagerState = m, _t(m, r))
            return Si(e, t, n, 0), Me === null && _i(), !1;
        } catch {
        } finally {
        }
      if (l = xs(e, t, n, a), l !== null)
        return vt(l, e, a), Of(l, t, a), !0;
    }
    return !1;
  }
  function ac(e, t, l, a) {
    if (a = {
      lane: 2,
      revertLane: wc(),
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Xi(e)) {
      if (t) throw Error(c(479));
    } else
      t = xs(
        e,
        l,
        a,
        2
      ), t !== null && vt(t, e, 2);
  }
  function Xi(e) {
    var t = e.alternate;
    return e === se || t !== null && t === se;
  }
  function Cf(e, t) {
    Ha = wi = !0;
    var l = e.pending;
    l === null ? t.next = t : (t.next = l.next, l.next = t), e.pending = t;
  }
  function Of(e, t, l) {
    if ((l & 4194048) !== 0) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, wr(e, l);
    }
  }
  var zn = {
    readContext: et,
    use: Li,
    useCallback: He,
    useContext: He,
    useEffect: He,
    useImperativeHandle: He,
    useLayoutEffect: He,
    useInsertionEffect: He,
    useMemo: He,
    useReducer: He,
    useRef: He,
    useState: He,
    useDebugValue: He,
    useDeferredValue: He,
    useTransition: He,
    useSyncExternalStore: He,
    useId: He,
    useHostTransitionStatus: He,
    useFormState: He,
    useActionState: He,
    useOptimistic: He,
    useMemoCache: He,
    useCacheRefresh: He
  };
  zn.useEffectEvent = He;
  var Df = {
    readContext: et,
    use: Li,
    useCallback: function(e, t) {
      return rt().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: et,
    useEffect: vf,
    useImperativeHandle: function(e, t, l) {
      l = l != null ? l.concat([e]) : null, Yi(
        4194308,
        4,
        xf.bind(null, t, e),
        l
      );
    },
    useLayoutEffect: function(e, t) {
      return Yi(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      Yi(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var l = rt();
      t = t === void 0 ? null : t;
      var a = e();
      if (sa) {
        bl(!0);
        try {
          e();
        } finally {
          bl(!1);
        }
      }
      return l.memoizedState = [a, t], a;
    },
    useReducer: function(e, t, l) {
      var a = rt();
      if (l !== void 0) {
        var n = l(t);
        if (sa) {
          bl(!0);
          try {
            l(t);
          } finally {
            bl(!1);
          }
        }
      } else n = t;
      return a.memoizedState = a.baseState = n, e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: n
      }, a.queue = e, e = e.dispatch = Vp.bind(
        null,
        se,
        e
      ), [a.memoizedState, e];
    },
    useRef: function(e) {
      var t = rt();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = Fs(e);
      var t = e.queue, l = Rf.bind(null, se, t);
      return t.dispatch = l, [e.memoizedState, l];
    },
    useDebugValue: Is,
    useDeferredValue: function(e, t) {
      var l = rt();
      return ec(l, e, t);
    },
    useTransition: function() {
      var e = Fs(!1);
      return e = Nf.bind(
        null,
        se,
        e.queue,
        !0,
        !1
      ), rt().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, l) {
      var a = se, n = rt();
      if (pe) {
        if (l === void 0)
          throw Error(c(407));
        l = l();
      } else {
        if (l = t(), Me === null)
          throw Error(c(349));
        (me & 127) !== 0 || Io(a, t, l);
      }
      n.memoizedState = l;
      var i = { value: l, getSnapshot: t };
      return n.queue = i, vf(tf.bind(null, a, i, e), [
        e
      ]), a.flags |= 2048, La(
        9,
        { destroy: void 0 },
        ef.bind(
          null,
          a,
          i,
          l,
          t
        ),
        null
      ), l;
    },
    useId: function() {
      var e = rt(), t = Me.identifierPrefix;
      if (pe) {
        var l = Ft, a = $t;
        l = (a & ~(1 << 32 - xt(a) - 1)).toString(32) + l, t = "_" + t + "R_" + l, l = Hi++, 0 < l && (t += "H" + l.toString(32)), t += "_";
      } else
        l = qp++, t = "_" + t + "r_" + l.toString(32) + "_";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: lc,
    useFormState: ff,
    useActionState: ff,
    useOptimistic: function(e) {
      var t = rt();
      t.memoizedState = t.baseState = e;
      var l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = l, t = ac.bind(
        null,
        se,
        !0,
        l
      ), l.dispatch = t, [e, t];
    },
    useMemoCache: Ks,
    useCacheRefresh: function() {
      return rt().memoizedState = Zp.bind(
        null,
        se
      );
    },
    useEffectEvent: function(e) {
      var t = rt(), l = { impl: e };
      return t.memoizedState = l, function() {
        if ((xe & 2) !== 0)
          throw Error(c(440));
        return l.impl.apply(void 0, arguments);
      };
    }
  }, nc = {
    readContext: et,
    use: Li,
    useCallback: Sf,
    useContext: et,
    useEffect: Ps,
    useImperativeHandle: _f,
    useInsertionEffect: yf,
    useLayoutEffect: bf,
    useMemo: jf,
    useReducer: qi,
    useRef: pf,
    useState: function() {
      return qi(cl);
    },
    useDebugValue: Is,
    useDeferredValue: function(e, t) {
      var l = Ge();
      return Ef(
        l,
        Te.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = qi(cl)[0], t = Ge().memoizedState;
      return [
        typeof e == "boolean" ? e : Tn(e),
        t
      ];
    },
    useSyncExternalStore: Po,
    useId: zf,
    useHostTransitionStatus: lc,
    useFormState: df,
    useActionState: df,
    useOptimistic: function(e, t) {
      var l = Ge();
      return nf(l, Te, e, t);
    },
    useMemoCache: Ks,
    useCacheRefresh: Mf
  };
  nc.useEffectEvent = gf;
  var Uf = {
    readContext: et,
    use: Li,
    useCallback: Sf,
    useContext: et,
    useEffect: Ps,
    useImperativeHandle: _f,
    useInsertionEffect: yf,
    useLayoutEffect: bf,
    useMemo: jf,
    useReducer: $s,
    useRef: pf,
    useState: function() {
      return $s(cl);
    },
    useDebugValue: Is,
    useDeferredValue: function(e, t) {
      var l = Ge();
      return Te === null ? ec(l, e, t) : Ef(
        l,
        Te.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = $s(cl)[0], t = Ge().memoizedState;
      return [
        typeof e == "boolean" ? e : Tn(e),
        t
      ];
    },
    useSyncExternalStore: Po,
    useId: zf,
    useHostTransitionStatus: lc,
    useFormState: hf,
    useActionState: hf,
    useOptimistic: function(e, t) {
      var l = Ge();
      return Te !== null ? nf(l, Te, e, t) : (l.baseState = e, [e, l.queue.dispatch]);
    },
    useMemoCache: Ks,
    useCacheRefresh: Mf
  };
  Uf.useEffectEvent = gf;
  function ic(e, t, l, a) {
    t = e.memoizedState, l = l(a, t), l = l == null ? t : j({}, t, l), e.memoizedState = l, e.lanes === 0 && (e.updateQueue.baseState = l);
  }
  var uc = {
    enqueueSetState: function(e, t, l) {
      e = e._reactInternals;
      var a = At(), n = Al(a);
      n.payload = t, l != null && (n.callback = l), t = zl(e, n, a), t !== null && (vt(t, e, a), Sn(t, e, a));
    },
    enqueueReplaceState: function(e, t, l) {
      e = e._reactInternals;
      var a = At(), n = Al(a);
      n.tag = 1, n.payload = t, l != null && (n.callback = l), t = zl(e, n, a), t !== null && (vt(t, e, a), Sn(t, e, a));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var l = At(), a = Al(l);
      a.tag = 2, t != null && (a.callback = t), t = zl(e, a, l), t !== null && (vt(t, e, l), Sn(t, e, l));
    }
  };
  function wf(e, t, l, a, n, i, r) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(a, i, r) : t.prototype && t.prototype.isPureReactComponent ? !hn(l, a) || !hn(n, i) : !0;
  }
  function Hf(e, t, l, a) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(l, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(l, a), t.state !== e && uc.enqueueReplaceState(t, t.state, null);
  }
  function ca(e, t) {
    var l = t;
    if ("ref" in t) {
      l = {};
      for (var a in t)
        a !== "ref" && (l[a] = t[a]);
    }
    if (e = e.defaultProps) {
      l === t && (l = j({}, l));
      for (var n in e)
        l[n] === void 0 && (l[n] = e[n]);
    }
    return l;
  }
  function Bf(e) {
    xi(e);
  }
  function Lf(e) {
    console.error(e);
  }
  function qf(e) {
    xi(e);
  }
  function ki(e, t) {
    try {
      var l = e.onUncaughtError;
      l(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function Yf(e, t, l) {
    try {
      var a = e.onCaughtError;
      a(l.value, {
        componentStack: l.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  function sc(e, t, l) {
    return l = Al(l), l.tag = 3, l.payload = { element: null }, l.callback = function() {
      ki(e, t);
    }, l;
  }
  function Gf(e) {
    return e = Al(e), e.tag = 3, e;
  }
  function Xf(e, t, l, a) {
    var n = l.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var i = a.value;
      e.payload = function() {
        return n(i);
      }, e.callback = function() {
        Yf(t, l, a);
      };
    }
    var r = l.stateNode;
    r !== null && typeof r.componentDidCatch == "function" && (e.callback = function() {
      Yf(t, l, a), typeof n != "function" && (Ul === null ? Ul = /* @__PURE__ */ new Set([this]) : Ul.add(this));
      var m = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: m !== null ? m : ""
      });
    });
  }
  function Kp(e, t, l, a, n) {
    if (l.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (t = l.alternate, t !== null && Ra(
        t,
        l,
        n,
        !0
      ), l = jt.current, l !== null) {
        switch (l.tag) {
          case 31:
          case 13:
            return Bt === null ? tu() : l.alternate === null && Be === 0 && (Be = 3), l.flags &= -257, l.flags |= 65536, l.lanes = n, a === Ri ? l.flags |= 16384 : (t = l.updateQueue, t === null ? l.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), Oc(e, a, n)), !1;
          case 22:
            return l.flags |= 65536, a === Ri ? l.flags |= 16384 : (t = l.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, l.updateQueue = t) : (l = t.retryQueue, l === null ? t.retryQueue = /* @__PURE__ */ new Set([a]) : l.add(a)), Oc(e, a, n)), !1;
        }
        throw Error(c(435, l.tag));
      }
      return Oc(e, a, n), tu(), !1;
    }
    if (pe)
      return t = jt.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = n, a !== Ts && (e = Error(c(422), { cause: a }), gn(Dt(e, l)))) : (a !== Ts && (t = Error(c(423), {
        cause: a
      }), gn(
        Dt(t, l)
      )), e = e.current.alternate, e.flags |= 65536, n &= -n, e.lanes |= n, a = Dt(a, l), n = sc(
        e.stateNode,
        a,
        n
      ), Bs(e, n), Be !== 4 && (Be = 2)), !1;
    var i = Error(c(520), { cause: a });
    if (i = Dt(i, l), Hn === null ? Hn = [i] : Hn.push(i), Be !== 4 && (Be = 2), t === null) return !0;
    a = Dt(a, l), l = t;
    do {
      switch (l.tag) {
        case 3:
          return l.flags |= 65536, e = n & -n, l.lanes |= e, e = sc(l.stateNode, a, e), Bs(l, e), !1;
        case 1:
          if (t = l.type, i = l.stateNode, (l.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || i !== null && typeof i.componentDidCatch == "function" && (Ul === null || !Ul.has(i))))
            return l.flags |= 65536, n &= -n, l.lanes |= n, n = Gf(n), Xf(
              n,
              e,
              l,
              a
            ), Bs(l, n), !1;
      }
      l = l.return;
    } while (l !== null);
    return !1;
  }
  var cc = Error(c(461)), Ze = !1;
  function tt(e, t, l, a) {
    t.child = e === null ? Zo(t, null, l, a) : ua(
      t,
      e.child,
      l,
      a
    );
  }
  function kf(e, t, l, a, n) {
    l = l.render;
    var i = t.ref;
    if ("ref" in a) {
      var r = {};
      for (var m in a)
        m !== "ref" && (r[m] = a[m]);
    } else r = a;
    return la(t), a = ks(
      e,
      t,
      l,
      r,
      i,
      n
    ), m = Qs(), e !== null && !Ze ? (Zs(e, t, n), rl(e, t, n)) : (pe && m && Es(t), t.flags |= 1, tt(e, t, a, n), t.child);
  }
  function Qf(e, t, l, a, n) {
    if (e === null) {
      var i = l.type;
      return typeof i == "function" && !_s(i) && i.defaultProps === void 0 && l.compare === null ? (t.tag = 15, t.type = i, Zf(
        e,
        t,
        i,
        a,
        n
      )) : (e = Ei(
        l.type,
        null,
        a,
        t,
        t.mode,
        n
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (i = e.child, !vc(e, n)) {
      var r = i.memoizedProps;
      if (l = l.compare, l = l !== null ? l : hn, l(r, a) && e.ref === t.ref)
        return rl(e, t, n);
    }
    return t.flags |= 1, e = al(i, a), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Zf(e, t, l, a, n) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (hn(i, a) && e.ref === t.ref)
        if (Ze = !1, t.pendingProps = a = i, vc(e, n))
          (e.flags & 131072) !== 0 && (Ze = !0);
        else
          return t.lanes = e.lanes, rl(e, t, n);
    }
    return rc(
      e,
      t,
      l,
      a,
      n
    );
  }
  function Vf(e, t, l, a) {
    var n = a.children, i = e !== null ? e.memoizedState : null;
    if (e === null && t.stateNode === null && (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), a.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (i = i !== null ? i.baseLanes | l : l, e !== null) {
          for (a = t.child = e.child, n = 0; a !== null; )
            n = n | a.lanes | a.childLanes, a = a.sibling;
          a = n & ~i;
        } else a = 0, t.child = null;
        return Kf(
          e,
          t,
          i,
          l,
          a
        );
      }
      if ((l & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && zi(
          t,
          i !== null ? i.cachePool : null
        ), i !== null ? Jo(t, i) : qs(), $o(t);
      else
        return a = t.lanes = 536870912, Kf(
          e,
          t,
          i !== null ? i.baseLanes | l : l,
          l,
          a
        );
    } else
      i !== null ? (zi(t, i.cachePool), Jo(t, i), Rl(), t.memoizedState = null) : (e !== null && zi(t, null), qs(), Rl());
    return tt(e, t, n, l), t.child;
  }
  function Mn(e, t) {
    return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function Kf(e, t, l, a, n) {
    var i = Ds();
    return i = i === null ? null : { parent: ke._currentValue, pool: i }, t.memoizedState = {
      baseLanes: l,
      cachePool: i
    }, e !== null && zi(t, null), qs(), $o(t), e !== null && Ra(e, t, a, !0), t.childLanes = n, null;
  }
  function Qi(e, t) {
    return t = Vi(
      { mode: t.mode, children: t.children },
      e.mode
    ), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function Jf(e, t, l) {
    return ua(t, e.child, null, l), e = Qi(t, t.pendingProps), e.flags |= 2, Et(t), t.memoizedState = null, e;
  }
  function Jp(e, t, l) {
    var a = t.pendingProps, n = (t.flags & 128) !== 0;
    if (t.flags &= -129, e === null) {
      if (pe) {
        if (a.mode === "hidden")
          return e = Qi(t, a), t.lanes = 536870912, Mn(null, e);
        if (Gs(t), (e = Re) ? (e = um(
          e,
          Ht
        ), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: Sl !== null ? { id: $t, overflow: Ft } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, l = Ro(e), l.return = t, t.child = l, Ie = t, Re = null)) : e = null, e === null) throw El(t);
        return t.lanes = 536870912, null;
      }
      return Qi(t, a);
    }
    var i = e.memoizedState;
    if (i !== null) {
      var r = i.dehydrated;
      if (Gs(t), n)
        if (t.flags & 256)
          t.flags &= -257, t = Jf(
            e,
            t,
            l
          );
        else if (t.memoizedState !== null)
          t.child = e.child, t.flags |= 128, t = null;
        else throw Error(c(558));
      else if (Ze || Ra(e, t, l, !1), n = (l & e.childLanes) !== 0, Ze || n) {
        if (a = Me, a !== null && (r = Hr(a, l), r !== 0 && r !== i.retryLane))
          throw i.retryLane = r, Pl(e, r), vt(a, e, r), cc;
        tu(), t = Jf(
          e,
          t,
          l
        );
      } else
        e = i.treeContext, Re = Lt(r.nextSibling), Ie = t, pe = !0, jl = null, Ht = !1, e !== null && Do(t, e), t = Qi(t, a), t.flags |= 4096;
      return t;
    }
    return e = al(e.child, {
      mode: a.mode,
      children: a.children
    }), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function Zi(e, t) {
    var l = t.ref;
    if (l === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof l != "function" && typeof l != "object")
        throw Error(c(284));
      (e === null || e.ref !== l) && (t.flags |= 4194816);
    }
  }
  function rc(e, t, l, a, n) {
    return la(t), l = ks(
      e,
      t,
      l,
      a,
      void 0,
      n
    ), a = Qs(), e !== null && !Ze ? (Zs(e, t, n), rl(e, t, n)) : (pe && a && Es(t), t.flags |= 1, tt(e, t, l, n), t.child);
  }
  function $f(e, t, l, a, n, i) {
    return la(t), t.updateQueue = null, l = Wo(
      t,
      a,
      l,
      n
    ), Fo(e), a = Qs(), e !== null && !Ze ? (Zs(e, t, i), rl(e, t, i)) : (pe && a && Es(t), t.flags |= 1, tt(e, t, l, i), t.child);
  }
  function Ff(e, t, l, a, n) {
    if (la(t), t.stateNode === null) {
      var i = Ta, r = l.contextType;
      typeof r == "object" && r !== null && (i = et(r)), i = new l(a, i), t.memoizedState = i.state !== null && i.state !== void 0 ? i.state : null, i.updater = uc, t.stateNode = i, i._reactInternals = t, i = t.stateNode, i.props = a, i.state = t.memoizedState, i.refs = {}, ws(t), r = l.contextType, i.context = typeof r == "object" && r !== null ? et(r) : Ta, i.state = t.memoizedState, r = l.getDerivedStateFromProps, typeof r == "function" && (ic(
        t,
        l,
        r,
        a
      ), i.state = t.memoizedState), typeof l.getDerivedStateFromProps == "function" || typeof i.getSnapshotBeforeUpdate == "function" || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (r = i.state, typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount(), r !== i.state && uc.enqueueReplaceState(i, i.state, null), En(t, a, i, n), jn(), i.state = t.memoizedState), typeof i.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (e === null) {
      i = t.stateNode;
      var m = t.memoizedProps, b = ca(l, m);
      i.props = b;
      var z = i.context, O = l.contextType;
      r = Ta, typeof O == "object" && O !== null && (r = et(O));
      var B = l.getDerivedStateFromProps;
      O = typeof B == "function" || typeof i.getSnapshotBeforeUpdate == "function", m = t.pendingProps !== m, O || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (m || z !== r) && Hf(
        t,
        i,
        a,
        r
      ), Tl = !1;
      var R = t.memoizedState;
      i.state = R, En(t, a, i, n), jn(), z = t.memoizedState, m || R !== z || Tl ? (typeof B == "function" && (ic(
        t,
        l,
        B,
        a
      ), z = t.memoizedState), (b = Tl || wf(
        t,
        l,
        b,
        a,
        R,
        z,
        r
      )) ? (O || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = z), i.props = a, i.state = z, i.context = r, a = b) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      i = t.stateNode, Hs(e, t), r = t.memoizedProps, O = ca(l, r), i.props = O, B = t.pendingProps, R = i.context, z = l.contextType, b = Ta, typeof z == "object" && z !== null && (b = et(z)), m = l.getDerivedStateFromProps, (z = typeof m == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (r !== B || R !== b) && Hf(
        t,
        i,
        a,
        b
      ), Tl = !1, R = t.memoizedState, i.state = R, En(t, a, i, n), jn();
      var C = t.memoizedState;
      r !== B || R !== C || Tl || e !== null && e.dependencies !== null && Ti(e.dependencies) ? (typeof m == "function" && (ic(
        t,
        l,
        m,
        a
      ), C = t.memoizedState), (O = Tl || wf(
        t,
        l,
        O,
        a,
        R,
        C,
        b
      ) || e !== null && e.dependencies !== null && Ti(e.dependencies)) ? (z || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(a, C, b), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(
        a,
        C,
        b
      )), typeof i.componentDidUpdate == "function" && (t.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof i.componentDidUpdate != "function" || r === e.memoizedProps && R === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || r === e.memoizedProps && R === e.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = C), i.props = a, i.state = C, i.context = b, a = O) : (typeof i.componentDidUpdate != "function" || r === e.memoizedProps && R === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || r === e.memoizedProps && R === e.memoizedState || (t.flags |= 1024), a = !1);
    }
    return i = a, Zi(e, t), a = (t.flags & 128) !== 0, i || a ? (i = t.stateNode, l = a && typeof l.getDerivedStateFromError != "function" ? null : i.render(), t.flags |= 1, e !== null && a ? (t.child = ua(
      t,
      e.child,
      null,
      n
    ), t.child = ua(
      t,
      null,
      l,
      n
    )) : tt(e, t, l, n), t.memoizedState = i.state, e = t.child) : e = rl(
      e,
      t,
      n
    ), e;
  }
  function Wf(e, t, l, a) {
    return ea(), t.flags |= 256, tt(e, t, l, a), t.child;
  }
  var oc = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function fc(e) {
    return { baseLanes: e, cachePool: qo() };
  }
  function dc(e, t, l) {
    return e = e !== null ? e.childLanes & ~l : 0, t && (e |= Tt), e;
  }
  function Pf(e, t, l) {
    var a = t.pendingProps, n = !1, i = (t.flags & 128) !== 0, r;
    if ((r = i) || (r = e !== null && e.memoizedState === null ? !1 : (Ye.current & 2) !== 0), r && (n = !0, t.flags &= -129), r = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (pe) {
        if (n ? Ml(t) : Rl(), (e = Re) ? (e = um(
          e,
          Ht
        ), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: Sl !== null ? { id: $t, overflow: Ft } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, l = Ro(e), l.return = t, t.child = l, Ie = t, Re = null)) : e = null, e === null) throw El(t);
        return Jc(e) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      var m = a.children;
      return a = a.fallback, n ? (Rl(), n = t.mode, m = Vi(
        { mode: "hidden", children: m },
        n
      ), a = Il(
        a,
        n,
        l,
        null
      ), m.return = t, a.return = t, m.sibling = a, t.child = m, a = t.child, a.memoizedState = fc(l), a.childLanes = dc(
        e,
        r,
        l
      ), t.memoizedState = oc, Mn(null, a)) : (Ml(t), mc(t, m));
    }
    var b = e.memoizedState;
    if (b !== null && (m = b.dehydrated, m !== null)) {
      if (i)
        t.flags & 256 ? (Ml(t), t.flags &= -257, t = hc(
          e,
          t,
          l
        )) : t.memoizedState !== null ? (Rl(), t.child = e.child, t.flags |= 128, t = null) : (Rl(), m = a.fallback, n = t.mode, a = Vi(
          { mode: "visible", children: a.children },
          n
        ), m = Il(
          m,
          n,
          l,
          null
        ), m.flags |= 2, a.return = t, m.return = t, a.sibling = m, t.child = a, ua(
          t,
          e.child,
          null,
          l
        ), a = t.child, a.memoizedState = fc(l), a.childLanes = dc(
          e,
          r,
          l
        ), t.memoizedState = oc, t = Mn(null, a));
      else if (Ml(t), Jc(m)) {
        if (r = m.nextSibling && m.nextSibling.dataset, r) var z = r.dgst;
        r = z, a = Error(c(419)), a.stack = "", a.digest = r, gn({ value: a, source: null, stack: null }), t = hc(
          e,
          t,
          l
        );
      } else if (Ze || Ra(e, t, l, !1), r = (l & e.childLanes) !== 0, Ze || r) {
        if (r = Me, r !== null && (a = Hr(r, l), a !== 0 && a !== b.retryLane))
          throw b.retryLane = a, Pl(e, a), vt(r, e, a), cc;
        Kc(m) || tu(), t = hc(
          e,
          t,
          l
        );
      } else
        Kc(m) ? (t.flags |= 192, t.child = e.child, t = null) : (e = b.treeContext, Re = Lt(
          m.nextSibling
        ), Ie = t, pe = !0, jl = null, Ht = !1, e !== null && Do(t, e), t = mc(
          t,
          a.children
        ), t.flags |= 4096);
      return t;
    }
    return n ? (Rl(), m = a.fallback, n = t.mode, b = e.child, z = b.sibling, a = al(b, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = b.subtreeFlags & 65011712, z !== null ? m = al(
      z,
      m
    ) : (m = Il(
      m,
      n,
      l,
      null
    ), m.flags |= 2), m.return = t, a.return = t, a.sibling = m, t.child = a, Mn(null, a), a = t.child, m = e.child.memoizedState, m === null ? m = fc(l) : (n = m.cachePool, n !== null ? (b = ke._currentValue, n = n.parent !== b ? { parent: b, pool: b } : n) : n = qo(), m = {
      baseLanes: m.baseLanes | l,
      cachePool: n
    }), a.memoizedState = m, a.childLanes = dc(
      e,
      r,
      l
    ), t.memoizedState = oc, Mn(e.child, a)) : (Ml(t), l = e.child, e = l.sibling, l = al(l, {
      mode: "visible",
      children: a.children
    }), l.return = t, l.sibling = null, e !== null && (r = t.deletions, r === null ? (t.deletions = [e], t.flags |= 16) : r.push(e)), t.child = l, t.memoizedState = null, l);
  }
  function mc(e, t) {
    return t = Vi(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function Vi(e, t) {
    return e = St(22, e, null, t), e.lanes = 0, e;
  }
  function hc(e, t, l) {
    return ua(t, e.child, null, l), e = mc(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function If(e, t, l) {
    e.lanes |= t;
    var a = e.alternate;
    a !== null && (a.lanes |= t), Ms(e.return, t, l);
  }
  function pc(e, t, l, a, n, i) {
    var r = e.memoizedState;
    r === null ? e.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: a,
      tail: l,
      tailMode: n,
      treeForkCount: i
    } : (r.isBackwards = t, r.rendering = null, r.renderingStartTime = 0, r.last = a, r.tail = l, r.tailMode = n, r.treeForkCount = i);
  }
  function ed(e, t, l) {
    var a = t.pendingProps, n = a.revealOrder, i = a.tail;
    a = a.children;
    var r = Ye.current, m = (r & 2) !== 0;
    if (m ? (r = r & 1 | 2, t.flags |= 128) : r &= 1, k(Ye, r), tt(e, t, a, l), a = pe ? vn : 0, !m && e !== null && (e.flags & 128) !== 0)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13)
          e.memoizedState !== null && If(e, l, t);
        else if (e.tag === 19)
          If(e, l, t);
        else if (e.child !== null) {
          e.child.return = e, e = e.child;
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t)
            break e;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
    switch (n) {
      case "forwards":
        for (l = t.child, n = null; l !== null; )
          e = l.alternate, e !== null && Ui(e) === null && (n = l), l = l.sibling;
        l = n, l === null ? (n = t.child, t.child = null) : (n = l.sibling, l.sibling = null), pc(
          t,
          !1,
          n,
          l,
          i,
          a
        );
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (l = null, n = t.child, t.child = null; n !== null; ) {
          if (e = n.alternate, e !== null && Ui(e) === null) {
            t.child = n;
            break;
          }
          e = n.sibling, n.sibling = l, l = n, n = e;
        }
        pc(
          t,
          !0,
          l,
          null,
          i,
          a
        );
        break;
      case "together":
        pc(
          t,
          !1,
          null,
          null,
          void 0,
          a
        );
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function rl(e, t, l) {
    if (e !== null && (t.dependencies = e.dependencies), Dl |= t.lanes, (l & t.childLanes) === 0)
      if (e !== null) {
        if (Ra(
          e,
          t,
          l,
          !1
        ), (l & t.childLanes) === 0)
          return null;
      } else return null;
    if (e !== null && t.child !== e.child)
      throw Error(c(153));
    if (t.child !== null) {
      for (e = t.child, l = al(e, e.pendingProps), t.child = l, l.return = t; e.sibling !== null; )
        e = e.sibling, l = l.sibling = al(e, e.pendingProps), l.return = t;
      l.sibling = null;
    }
    return t.child;
  }
  function vc(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && Ti(e)));
  }
  function $p(e, t, l) {
    switch (t.tag) {
      case 3:
        ct(t, t.stateNode.containerInfo), Nl(t, ke, e.memoizedState.cache), ea();
        break;
      case 27:
      case 5:
        en(t);
        break;
      case 4:
        ct(t, t.stateNode.containerInfo);
        break;
      case 10:
        Nl(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 31:
        if (t.memoizedState !== null)
          return t.flags |= 128, Gs(t), null;
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null)
          return a.dehydrated !== null ? (Ml(t), t.flags |= 128, null) : (l & t.child.childLanes) !== 0 ? Pf(e, t, l) : (Ml(t), e = rl(
            e,
            t,
            l
          ), e !== null ? e.sibling : null);
        Ml(t);
        break;
      case 19:
        var n = (e.flags & 128) !== 0;
        if (a = (l & t.childLanes) !== 0, a || (Ra(
          e,
          t,
          l,
          !1
        ), a = (l & t.childLanes) !== 0), n) {
          if (a)
            return ed(
              e,
              t,
              l
            );
          t.flags |= 128;
        }
        if (n = t.memoizedState, n !== null && (n.rendering = null, n.tail = null, n.lastEffect = null), k(Ye, Ye.current), a) break;
        return null;
      case 22:
        return t.lanes = 0, Vf(
          e,
          t,
          l,
          t.pendingProps
        );
      case 24:
        Nl(t, ke, e.memoizedState.cache);
    }
    return rl(e, t, l);
  }
  function td(e, t, l) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        Ze = !0;
      else {
        if (!vc(e, l) && (t.flags & 128) === 0)
          return Ze = !1, $p(
            e,
            t,
            l
          );
        Ze = (e.flags & 131072) !== 0;
      }
    else
      Ze = !1, pe && (t.flags & 1048576) !== 0 && Oo(t, vn, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          var a = t.pendingProps;
          if (e = na(t.elementType), t.type = e, typeof e == "function")
            _s(e) ? (a = ca(e, a), t.tag = 1, t = Ff(
              null,
              t,
              e,
              a,
              l
            )) : (t.tag = 0, t = rc(
              null,
              t,
              e,
              a,
              l
            ));
          else {
            if (e != null) {
              var n = e.$$typeof;
              if (n === ae) {
                t.tag = 11, t = kf(
                  null,
                  t,
                  e,
                  a,
                  l
                );
                break e;
              } else if (n === P) {
                t.tag = 14, t = Qf(
                  null,
                  t,
                  e,
                  a,
                  l
                );
                break e;
              }
            }
            throw t = le(e) || e, Error(c(306, t, ""));
          }
        }
        return t;
      case 0:
        return rc(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 1:
        return a = t.type, n = ca(
          a,
          t.pendingProps
        ), Ff(
          e,
          t,
          a,
          n,
          l
        );
      case 3:
        e: {
          if (ct(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(c(387));
          a = t.pendingProps;
          var i = t.memoizedState;
          n = i.element, Hs(e, t), En(t, a, null, l);
          var r = t.memoizedState;
          if (a = r.cache, Nl(t, ke, a), a !== i.cache && Rs(
            t,
            [ke],
            l,
            !0
          ), jn(), a = r.element, i.isDehydrated)
            if (i = {
              element: a,
              isDehydrated: !1,
              cache: r.cache
            }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
              t = Wf(
                e,
                t,
                a,
                l
              );
              break e;
            } else if (a !== n) {
              n = Dt(
                Error(c(424)),
                t
              ), gn(n), t = Wf(
                e,
                t,
                a,
                l
              );
              break e;
            } else {
              switch (e = t.stateNode.containerInfo, e.nodeType) {
                case 9:
                  e = e.body;
                  break;
                default:
                  e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
              }
              for (Re = Lt(e.firstChild), Ie = t, pe = !0, jl = null, Ht = !0, l = Zo(
                t,
                null,
                a,
                l
              ), t.child = l; l; )
                l.flags = l.flags & -3 | 4096, l = l.sibling;
            }
          else {
            if (ea(), a === n) {
              t = rl(
                e,
                t,
                l
              );
              break e;
            }
            tt(e, t, a, l);
          }
          t = t.child;
        }
        return t;
      case 26:
        return Zi(e, t), e === null ? (l = dm(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = l : pe || (l = t.type, e = t.pendingProps, a = cu(
          oe.current
        ).createElement(l), a[Pe] = t, a[ot] = e, lt(a, l, e), Je(a), t.stateNode = a) : t.memoizedState = dm(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return en(t), e === null && pe && (a = t.stateNode = rm(
          t.type,
          t.pendingProps,
          oe.current
        ), Ie = t, Ht = !0, n = Re, Ll(t.type) ? ($c = n, Re = Lt(a.firstChild)) : Re = n), tt(
          e,
          t,
          t.pendingProps.children,
          l
        ), Zi(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && pe && ((n = a = Re) && (a = Nv(
          a,
          t.type,
          t.pendingProps,
          Ht
        ), a !== null ? (t.stateNode = a, Ie = t, Re = Lt(a.firstChild), Ht = !1, n = !0) : n = !1), n || El(t)), en(t), n = t.type, i = t.pendingProps, r = e !== null ? e.memoizedProps : null, a = i.children, Qc(n, i) ? a = null : r !== null && Qc(n, r) && (t.flags |= 32), t.memoizedState !== null && (n = ks(
          e,
          t,
          Yp,
          null,
          null,
          l
        ), Qn._currentValue = n), Zi(e, t), tt(e, t, a, l), t.child;
      case 6:
        return e === null && pe && ((e = l = Re) && (l = Tv(
          l,
          t.pendingProps,
          Ht
        ), l !== null ? (t.stateNode = l, Ie = t, Re = null, e = !0) : e = !1), e || El(t)), null;
      case 13:
        return Pf(e, t, l);
      case 4:
        return ct(
          t,
          t.stateNode.containerInfo
        ), a = t.pendingProps, e === null ? t.child = ua(
          t,
          null,
          a,
          l
        ) : tt(e, t, a, l), t.child;
      case 11:
        return kf(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 7:
        return tt(
          e,
          t,
          t.pendingProps,
          l
        ), t.child;
      case 8:
        return tt(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 12:
        return tt(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 10:
        return a = t.pendingProps, Nl(t, t.type, a.value), tt(e, t, a.children, l), t.child;
      case 9:
        return n = t.type._context, a = t.pendingProps.children, la(t), n = et(n), a = a(n), t.flags |= 1, tt(e, t, a, l), t.child;
      case 14:
        return Qf(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 15:
        return Zf(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 19:
        return ed(e, t, l);
      case 31:
        return Jp(e, t, l);
      case 22:
        return Vf(
          e,
          t,
          l,
          t.pendingProps
        );
      case 24:
        return la(t), a = et(ke), e === null ? (n = Ds(), n === null && (n = Me, i = Cs(), n.pooledCache = i, i.refCount++, i !== null && (n.pooledCacheLanes |= l), n = i), t.memoizedState = { parent: a, cache: n }, ws(t), Nl(t, ke, n)) : ((e.lanes & l) !== 0 && (Hs(e, t), En(t, null, null, l), jn()), n = e.memoizedState, i = t.memoizedState, n.parent !== a ? (n = { parent: a, cache: a }, t.memoizedState = n, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = n), Nl(t, ke, a)) : (a = i.cache, Nl(t, ke, a), a !== n.cache && Rs(
          t,
          [ke],
          l,
          !0
        ))), tt(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(c(156, t.tag));
  }
  function ol(e) {
    e.flags |= 4;
  }
  function gc(e, t, l, a, n) {
    if ((t = (e.mode & 32) !== 0) && (t = !1), t) {
      if (e.flags |= 16777216, (n & 335544128) === n)
        if (e.stateNode.complete) e.flags |= 8192;
        else if (zd()) e.flags |= 8192;
        else
          throw ia = Ri, Us;
    } else e.flags &= -16777217;
  }
  function ld(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !gm(t))
      if (zd()) e.flags |= 8192;
      else
        throw ia = Ri, Us;
  }
  function Ki(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? Dr() : 536870912, e.lanes |= t, Xa |= t);
  }
  function Rn(e, t) {
    if (!pe)
      switch (e.tailMode) {
        case "hidden":
          t = e.tail;
          for (var l = null; t !== null; )
            t.alternate !== null && (l = t), t = t.sibling;
          l === null ? e.tail = null : l.sibling = null;
          break;
        case "collapsed":
          l = e.tail;
          for (var a = null; l !== null; )
            l.alternate !== null && (a = l), l = l.sibling;
          a === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : a.sibling = null;
      }
  }
  function Ce(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, l = 0, a = 0;
    if (t)
      for (var n = e.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags & 65011712, a |= n.flags & 65011712, n.return = e, n = n.sibling;
    else
      for (n = e.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags, a |= n.flags, n.return = e, n = n.sibling;
    return e.subtreeFlags |= a, e.childLanes = l, t;
  }
  function Fp(e, t, l) {
    var a = t.pendingProps;
    switch (Ns(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Ce(t), null;
      case 1:
        return Ce(t), null;
      case 3:
        return l = t.stateNode, a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), ul(ke), qe(), l.pendingContext && (l.context = l.pendingContext, l.pendingContext = null), (e === null || e.child === null) && (Ma(t) ? ol(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, As())), Ce(t), null;
      case 26:
        var n = t.type, i = t.memoizedState;
        return e === null ? (ol(t), i !== null ? (Ce(t), ld(t, i)) : (Ce(t), gc(
          t,
          n,
          null,
          a,
          l
        ))) : i ? i !== e.memoizedState ? (ol(t), Ce(t), ld(t, i)) : (Ce(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== a && ol(t), Ce(t), gc(
          t,
          n,
          e,
          a,
          l
        )), null;
      case 27:
        if (ni(t), l = oe.current, n = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && ol(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(c(166));
            return Ce(t), null;
          }
          e = J.current, Ma(t) ? Uo(t) : (e = rm(n, a, l), t.stateNode = e, ol(t));
        }
        return Ce(t), null;
      case 5:
        if (ni(t), n = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && ol(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(c(166));
            return Ce(t), null;
          }
          if (i = J.current, Ma(t))
            Uo(t);
          else {
            var r = cu(
              oe.current
            );
            switch (i) {
              case 1:
                i = r.createElementNS(
                  "http://www.w3.org/2000/svg",
                  n
                );
                break;
              case 2:
                i = r.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  n
                );
                break;
              default:
                switch (n) {
                  case "svg":
                    i = r.createElementNS(
                      "http://www.w3.org/2000/svg",
                      n
                    );
                    break;
                  case "math":
                    i = r.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      n
                    );
                    break;
                  case "script":
                    i = r.createElement("div"), i.innerHTML = "<script><\/script>", i = i.removeChild(
                      i.firstChild
                    );
                    break;
                  case "select":
                    i = typeof a.is == "string" ? r.createElement("select", {
                      is: a.is
                    }) : r.createElement("select"), a.multiple ? i.multiple = !0 : a.size && (i.size = a.size);
                    break;
                  default:
                    i = typeof a.is == "string" ? r.createElement(n, { is: a.is }) : r.createElement(n);
                }
            }
            i[Pe] = t, i[ot] = a;
            e: for (r = t.child; r !== null; ) {
              if (r.tag === 5 || r.tag === 6)
                i.appendChild(r.stateNode);
              else if (r.tag !== 4 && r.tag !== 27 && r.child !== null) {
                r.child.return = r, r = r.child;
                continue;
              }
              if (r === t) break e;
              for (; r.sibling === null; ) {
                if (r.return === null || r.return === t)
                  break e;
                r = r.return;
              }
              r.sibling.return = r.return, r = r.sibling;
            }
            t.stateNode = i;
            e: switch (lt(i, n, a), n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                a = !!a.autoFocus;
                break e;
              case "img":
                a = !0;
                break e;
              default:
                a = !1;
            }
            a && ol(t);
          }
        }
        return Ce(t), gc(
          t,
          t.type,
          e === null ? null : e.memoizedProps,
          t.pendingProps,
          l
        ), null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== a && ol(t);
        else {
          if (typeof a != "string" && t.stateNode === null)
            throw Error(c(166));
          if (e = oe.current, Ma(t)) {
            if (e = t.stateNode, l = t.memoizedProps, a = null, n = Ie, n !== null)
              switch (n.tag) {
                case 27:
                case 5:
                  a = n.memoizedProps;
              }
            e[Pe] = t, e = !!(e.nodeValue === l || a !== null && a.suppressHydrationWarning === !0 || Pd(e.nodeValue, l)), e || El(t, !0);
          } else
            e = cu(e).createTextNode(
              a
            ), e[Pe] = t, t.stateNode = e;
        }
        return Ce(t), null;
      case 31:
        if (l = t.memoizedState, e === null || e.memoizedState !== null) {
          if (a = Ma(t), l !== null) {
            if (e === null) {
              if (!a) throw Error(c(318));
              if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(c(557));
              e[Pe] = t;
            } else
              ea(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Ce(t), e = !1;
          } else
            l = As(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = l), e = !0;
          if (!e)
            return t.flags & 256 ? (Et(t), t) : (Et(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(c(558));
        }
        return Ce(t), null;
      case 13:
        if (a = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (n = Ma(t), a !== null && a.dehydrated !== null) {
            if (e === null) {
              if (!n) throw Error(c(318));
              if (n = t.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(c(317));
              n[Pe] = t;
            } else
              ea(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Ce(t), n = !1;
          } else
            n = As(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), n = !0;
          if (!n)
            return t.flags & 256 ? (Et(t), t) : (Et(t), null);
        }
        return Et(t), (t.flags & 128) !== 0 ? (t.lanes = l, t) : (l = a !== null, e = e !== null && e.memoizedState !== null, l && (a = t.child, n = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (n = a.alternate.memoizedState.cachePool.pool), i = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (i = a.memoizedState.cachePool.pool), i !== n && (a.flags |= 2048)), l !== e && l && (t.child.flags |= 8192), Ki(t, t.updateQueue), Ce(t), null);
      case 4:
        return qe(), e === null && qc(t.stateNode.containerInfo), Ce(t), null;
      case 10:
        return ul(t.type), Ce(t), null;
      case 19:
        if (w(Ye), a = t.memoizedState, a === null) return Ce(t), null;
        if (n = (t.flags & 128) !== 0, i = a.rendering, i === null)
          if (n) Rn(a, !1);
          else {
            if (Be !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (i = Ui(e), i !== null) {
                  for (t.flags |= 128, Rn(a, !1), e = i.updateQueue, t.updateQueue = e, Ki(t, e), t.subtreeFlags = 0, e = l, l = t.child; l !== null; )
                    Mo(l, e), l = l.sibling;
                  return k(
                    Ye,
                    Ye.current & 1 | 2
                  ), pe && nl(t, a.treeForkCount), t.child;
                }
                e = e.sibling;
              }
            a.tail !== null && yt() > Pi && (t.flags |= 128, n = !0, Rn(a, !1), t.lanes = 4194304);
          }
        else {
          if (!n)
            if (e = Ui(i), e !== null) {
              if (t.flags |= 128, n = !0, e = e.updateQueue, t.updateQueue = e, Ki(t, e), Rn(a, !0), a.tail === null && a.tailMode === "hidden" && !i.alternate && !pe)
                return Ce(t), null;
            } else
              2 * yt() - a.renderingStartTime > Pi && l !== 536870912 && (t.flags |= 128, n = !0, Rn(a, !1), t.lanes = 4194304);
          a.isBackwards ? (i.sibling = t.child, t.child = i) : (e = a.last, e !== null ? e.sibling = i : t.child = i, a.last = i);
        }
        return a.tail !== null ? (e = a.tail, a.rendering = e, a.tail = e.sibling, a.renderingStartTime = yt(), e.sibling = null, l = Ye.current, k(
          Ye,
          n ? l & 1 | 2 : l & 1
        ), pe && nl(t, a.treeForkCount), e) : (Ce(t), null);
      case 22:
      case 23:
        return Et(t), Ys(), a = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (l & 536870912) !== 0 && (t.flags & 128) === 0 && (Ce(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Ce(t), l = t.updateQueue, l !== null && Ki(t, l.retryQueue), l = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== l && (t.flags |= 2048), e !== null && w(aa), null;
      case 24:
        return l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), ul(ke), Ce(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(c(156, t.tag));
  }
  function Wp(e, t) {
    switch (Ns(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return ul(ke), qe(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return ni(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (Et(t), t.alternate === null)
            throw Error(c(340));
          ea();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 13:
        if (Et(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(c(340));
          ea();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return w(Ye), null;
      case 4:
        return qe(), null;
      case 10:
        return ul(t.type), null;
      case 22:
      case 23:
        return Et(t), Ys(), e !== null && w(aa), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return ul(ke), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function ad(e, t) {
    switch (Ns(t), t.tag) {
      case 3:
        ul(ke), qe();
        break;
      case 26:
      case 27:
      case 5:
        ni(t);
        break;
      case 4:
        qe();
        break;
      case 31:
        t.memoizedState !== null && Et(t);
        break;
      case 13:
        Et(t);
        break;
      case 19:
        w(Ye);
        break;
      case 10:
        ul(t.type);
        break;
      case 22:
      case 23:
        Et(t), Ys(), e !== null && w(aa);
        break;
      case 24:
        ul(ke);
    }
  }
  function Cn(e, t) {
    try {
      var l = t.updateQueue, a = l !== null ? l.lastEffect : null;
      if (a !== null) {
        var n = a.next;
        l = n;
        do {
          if ((l.tag & e) === e) {
            a = void 0;
            var i = l.create, r = l.inst;
            a = i(), r.destroy = a;
          }
          l = l.next;
        } while (l !== n);
      }
    } catch (m) {
      Ne(t, t.return, m);
    }
  }
  function Cl(e, t, l) {
    try {
      var a = t.updateQueue, n = a !== null ? a.lastEffect : null;
      if (n !== null) {
        var i = n.next;
        a = i;
        do {
          if ((a.tag & e) === e) {
            var r = a.inst, m = r.destroy;
            if (m !== void 0) {
              r.destroy = void 0, n = t;
              var b = l, z = m;
              try {
                z();
              } catch (O) {
                Ne(
                  n,
                  b,
                  O
                );
              }
            }
          }
          a = a.next;
        } while (a !== i);
      }
    } catch (O) {
      Ne(t, t.return, O);
    }
  }
  function nd(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var l = e.stateNode;
      try {
        Ko(t, l);
      } catch (a) {
        Ne(e, e.return, a);
      }
    }
  }
  function id(e, t, l) {
    l.props = ca(
      e.type,
      e.memoizedProps
    ), l.state = e.memoizedState;
    try {
      l.componentWillUnmount();
    } catch (a) {
      Ne(e, t, a);
    }
  }
  function On(e, t) {
    try {
      var l = e.ref;
      if (l !== null) {
        switch (e.tag) {
          case 26:
          case 27:
          case 5:
            var a = e.stateNode;
            break;
          case 30:
            a = e.stateNode;
            break;
          default:
            a = e.stateNode;
        }
        typeof l == "function" ? e.refCleanup = l(a) : l.current = a;
      }
    } catch (n) {
      Ne(e, t, n);
    }
  }
  function Wt(e, t) {
    var l = e.ref, a = e.refCleanup;
    if (l !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (n) {
          Ne(e, t, n);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof l == "function")
        try {
          l(null);
        } catch (n) {
          Ne(e, t, n);
        }
      else l.current = null;
  }
  function ud(e) {
    var t = e.type, l = e.memoizedProps, a = e.stateNode;
    try {
      e: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          l.autoFocus && a.focus();
          break e;
        case "img":
          l.src ? a.src = l.src : l.srcSet && (a.srcset = l.srcSet);
      }
    } catch (n) {
      Ne(e, e.return, n);
    }
  }
  function yc(e, t, l) {
    try {
      var a = e.stateNode;
      bv(a, e.type, l, t), a[ot] = t;
    } catch (n) {
      Ne(e, e.return, n);
    }
  }
  function sd(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Ll(e.type) || e.tag === 4;
  }
  function bc(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || sd(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && Ll(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function xc(e, t, l) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? (l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l).insertBefore(e, t) : (t = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, t.appendChild(e), l = l._reactRootContainer, l != null || t.onclick !== null || (t.onclick = tl));
    else if (a !== 4 && (a === 27 && Ll(e.type) && (l = e.stateNode, t = null), e = e.child, e !== null))
      for (xc(e, t, l), e = e.sibling; e !== null; )
        xc(e, t, l), e = e.sibling;
  }
  function Ji(e, t, l) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? l.insertBefore(e, t) : l.appendChild(e);
    else if (a !== 4 && (a === 27 && Ll(e.type) && (l = e.stateNode), e = e.child, e !== null))
      for (Ji(e, t, l), e = e.sibling; e !== null; )
        Ji(e, t, l), e = e.sibling;
  }
  function cd(e) {
    var t = e.stateNode, l = e.memoizedProps;
    try {
      for (var a = e.type, n = t.attributes; n.length; )
        t.removeAttributeNode(n[0]);
      lt(t, a, l), t[Pe] = e, t[ot] = l;
    } catch (i) {
      Ne(e, e.return, i);
    }
  }
  var fl = !1, Ve = !1, _c = !1, rd = typeof WeakSet == "function" ? WeakSet : Set, $e = null;
  function Pp(e, t) {
    if (e = e.containerInfo, Xc = pu, e = xo(e), hs(e)) {
      if ("selectionStart" in e)
        var l = {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      else
        e: {
          l = (l = e.ownerDocument) && l.defaultView || window;
          var a = l.getSelection && l.getSelection();
          if (a && a.rangeCount !== 0) {
            l = a.anchorNode;
            var n = a.anchorOffset, i = a.focusNode;
            a = a.focusOffset;
            try {
              l.nodeType, i.nodeType;
            } catch {
              l = null;
              break e;
            }
            var r = 0, m = -1, b = -1, z = 0, O = 0, B = e, R = null;
            t: for (; ; ) {
              for (var C; B !== l || n !== 0 && B.nodeType !== 3 || (m = r + n), B !== i || a !== 0 && B.nodeType !== 3 || (b = r + a), B.nodeType === 3 && (r += B.nodeValue.length), (C = B.firstChild) !== null; )
                R = B, B = C;
              for (; ; ) {
                if (B === e) break t;
                if (R === l && ++z === n && (m = r), R === i && ++O === a && (b = r), (C = B.nextSibling) !== null) break;
                B = R, R = B.parentNode;
              }
              B = C;
            }
            l = m === -1 || b === -1 ? null : { start: m, end: b };
          } else l = null;
        }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (kc = { focusedElem: e, selectionRange: l }, pu = !1, $e = t; $e !== null; )
      if (t = $e, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null)
        e.return = t, $e = e;
      else
        for (; $e !== null; ) {
          switch (t = $e, i = t.alternate, e = t.flags, t.tag) {
            case 0:
              if ((e & 4) !== 0 && (e = t.updateQueue, e = e !== null ? e.events : null, e !== null))
                for (l = 0; l < e.length; l++)
                  n = e[l], n.ref.impl = n.nextImpl;
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && i !== null) {
                e = void 0, l = t, n = i.memoizedProps, i = i.memoizedState, a = l.stateNode;
                try {
                  var K = ca(
                    l.type,
                    n
                  );
                  e = a.getSnapshotBeforeUpdate(
                    K,
                    i
                  ), a.__reactInternalSnapshotBeforeUpdate = e;
                } catch (te) {
                  Ne(
                    l,
                    l.return,
                    te
                  );
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (e = t.stateNode.containerInfo, l = e.nodeType, l === 9)
                  Vc(e);
                else if (l === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      Vc(e);
                      break;
                    default:
                      e.textContent = "";
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
              if ((e & 1024) !== 0) throw Error(c(163));
          }
          if (e = t.sibling, e !== null) {
            e.return = t.return, $e = e;
            break;
          }
          $e = t.return;
        }
  }
  function od(e, t, l) {
    var a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        ml(e, l), a & 4 && Cn(5, l);
        break;
      case 1:
        if (ml(e, l), a & 4)
          if (e = l.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (r) {
              Ne(l, l.return, r);
            }
          else {
            var n = ca(
              l.type,
              t.memoizedProps
            );
            t = t.memoizedState;
            try {
              e.componentDidUpdate(
                n,
                t,
                e.__reactInternalSnapshotBeforeUpdate
              );
            } catch (r) {
              Ne(
                l,
                l.return,
                r
              );
            }
          }
        a & 64 && nd(l), a & 512 && On(l, l.return);
        break;
      case 3:
        if (ml(e, l), a & 64 && (e = l.updateQueue, e !== null)) {
          if (t = null, l.child !== null)
            switch (l.child.tag) {
              case 27:
              case 5:
                t = l.child.stateNode;
                break;
              case 1:
                t = l.child.stateNode;
            }
          try {
            Ko(e, t);
          } catch (r) {
            Ne(l, l.return, r);
          }
        }
        break;
      case 27:
        t === null && a & 4 && cd(l);
      case 26:
      case 5:
        ml(e, l), t === null && a & 4 && ud(l), a & 512 && On(l, l.return);
        break;
      case 12:
        ml(e, l);
        break;
      case 31:
        ml(e, l), a & 4 && md(e, l);
        break;
      case 13:
        ml(e, l), a & 4 && hd(e, l), a & 64 && (e = l.memoizedState, e !== null && (e = e.dehydrated, e !== null && (l = sv.bind(
          null,
          l
        ), Av(e, l))));
        break;
      case 22:
        if (a = l.memoizedState !== null || fl, !a) {
          t = t !== null && t.memoizedState !== null || Ve, n = fl;
          var i = Ve;
          fl = a, (Ve = t) && !i ? hl(
            e,
            l,
            (l.subtreeFlags & 8772) !== 0
          ) : ml(e, l), fl = n, Ve = i;
        }
        break;
      case 30:
        break;
      default:
        ml(e, l);
    }
  }
  function fd(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, fd(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && Wu(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var Oe = null, dt = !1;
  function dl(e, t, l) {
    for (l = l.child; l !== null; )
      dd(e, t, l), l = l.sibling;
  }
  function dd(e, t, l) {
    if (bt && typeof bt.onCommitFiberUnmount == "function")
      try {
        bt.onCommitFiberUnmount(tn, l);
      } catch {
      }
    switch (l.tag) {
      case 26:
        Ve || Wt(l, t), dl(
          e,
          t,
          l
        ), l.memoizedState ? l.memoizedState.count-- : l.stateNode && (l = l.stateNode, l.parentNode.removeChild(l));
        break;
      case 27:
        Ve || Wt(l, t);
        var a = Oe, n = dt;
        Ll(l.type) && (Oe = l.stateNode, dt = !1), dl(
          e,
          t,
          l
        ), Gn(l.stateNode), Oe = a, dt = n;
        break;
      case 5:
        Ve || Wt(l, t);
      case 6:
        if (a = Oe, n = dt, Oe = null, dl(
          e,
          t,
          l
        ), Oe = a, dt = n, Oe !== null)
          if (dt)
            try {
              (Oe.nodeType === 9 ? Oe.body : Oe.nodeName === "HTML" ? Oe.ownerDocument.body : Oe).removeChild(l.stateNode);
            } catch (i) {
              Ne(
                l,
                t,
                i
              );
            }
          else
            try {
              Oe.removeChild(l.stateNode);
            } catch (i) {
              Ne(
                l,
                t,
                i
              );
            }
        break;
      case 18:
        Oe !== null && (dt ? (e = Oe, nm(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          l.stateNode
        ), Fa(e)) : nm(Oe, l.stateNode));
        break;
      case 4:
        a = Oe, n = dt, Oe = l.stateNode.containerInfo, dt = !0, dl(
          e,
          t,
          l
        ), Oe = a, dt = n;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Cl(2, l, t), Ve || Cl(4, l, t), dl(
          e,
          t,
          l
        );
        break;
      case 1:
        Ve || (Wt(l, t), a = l.stateNode, typeof a.componentWillUnmount == "function" && id(
          l,
          t,
          a
        )), dl(
          e,
          t,
          l
        );
        break;
      case 21:
        dl(
          e,
          t,
          l
        );
        break;
      case 22:
        Ve = (a = Ve) || l.memoizedState !== null, dl(
          e,
          t,
          l
        ), Ve = a;
        break;
      default:
        dl(
          e,
          t,
          l
        );
    }
  }
  function md(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
      e = e.dehydrated;
      try {
        Fa(e);
      } catch (l) {
        Ne(t, t.return, l);
      }
    }
  }
  function hd(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        Fa(e);
      } catch (l) {
        Ne(t, t.return, l);
      }
  }
  function Ip(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new rd()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new rd()), t;
      default:
        throw Error(c(435, e.tag));
    }
  }
  function $i(e, t) {
    var l = Ip(e);
    t.forEach(function(a) {
      if (!l.has(a)) {
        l.add(a);
        var n = cv.bind(null, e, a);
        a.then(n, n);
      }
    });
  }
  function mt(e, t) {
    var l = t.deletions;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var n = l[a], i = e, r = t, m = r;
        e: for (; m !== null; ) {
          switch (m.tag) {
            case 27:
              if (Ll(m.type)) {
                Oe = m.stateNode, dt = !1;
                break e;
              }
              break;
            case 5:
              Oe = m.stateNode, dt = !1;
              break e;
            case 3:
            case 4:
              Oe = m.stateNode.containerInfo, dt = !0;
              break e;
          }
          m = m.return;
        }
        if (Oe === null) throw Error(c(160));
        dd(i, r, n), Oe = null, dt = !1, i = n.alternate, i !== null && (i.return = null), n.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        pd(t, e), t = t.sibling;
  }
  var Zt = null;
  function pd(e, t) {
    var l = e.alternate, a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        mt(t, e), ht(e), a & 4 && (Cl(3, e, e.return), Cn(3, e), Cl(5, e, e.return));
        break;
      case 1:
        mt(t, e), ht(e), a & 512 && (Ve || l === null || Wt(l, l.return)), a & 64 && fl && (e = e.updateQueue, e !== null && (a = e.callbacks, a !== null && (l = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = l === null ? a : l.concat(a))));
        break;
      case 26:
        var n = Zt;
        if (mt(t, e), ht(e), a & 512 && (Ve || l === null || Wt(l, l.return)), a & 4) {
          var i = l !== null ? l.memoizedState : null;
          if (a = e.memoizedState, l === null)
            if (a === null)
              if (e.stateNode === null) {
                e: {
                  a = e.type, l = e.memoizedProps, n = n.ownerDocument || n;
                  t: switch (a) {
                    case "title":
                      i = n.getElementsByTagName("title")[0], (!i || i[nn] || i[Pe] || i.namespaceURI === "http://www.w3.org/2000/svg" || i.hasAttribute("itemprop")) && (i = n.createElement(a), n.head.insertBefore(
                        i,
                        n.querySelector("head > title")
                      )), lt(i, a, l), i[Pe] = e, Je(i), a = i;
                      break e;
                    case "link":
                      var r = pm(
                        "link",
                        "href",
                        n
                      ).get(a + (l.href || ""));
                      if (r) {
                        for (var m = 0; m < r.length; m++)
                          if (i = r[m], i.getAttribute("href") === (l.href == null || l.href === "" ? null : l.href) && i.getAttribute("rel") === (l.rel == null ? null : l.rel) && i.getAttribute("title") === (l.title == null ? null : l.title) && i.getAttribute("crossorigin") === (l.crossOrigin == null ? null : l.crossOrigin)) {
                            r.splice(m, 1);
                            break t;
                          }
                      }
                      i = n.createElement(a), lt(i, a, l), n.head.appendChild(i);
                      break;
                    case "meta":
                      if (r = pm(
                        "meta",
                        "content",
                        n
                      ).get(a + (l.content || ""))) {
                        for (m = 0; m < r.length; m++)
                          if (i = r[m], i.getAttribute("content") === (l.content == null ? null : "" + l.content) && i.getAttribute("name") === (l.name == null ? null : l.name) && i.getAttribute("property") === (l.property == null ? null : l.property) && i.getAttribute("http-equiv") === (l.httpEquiv == null ? null : l.httpEquiv) && i.getAttribute("charset") === (l.charSet == null ? null : l.charSet)) {
                            r.splice(m, 1);
                            break t;
                          }
                      }
                      i = n.createElement(a), lt(i, a, l), n.head.appendChild(i);
                      break;
                    default:
                      throw Error(c(468, a));
                  }
                  i[Pe] = e, Je(i), a = i;
                }
                e.stateNode = a;
              } else
                vm(
                  n,
                  e.type,
                  e.stateNode
                );
            else
              e.stateNode = hm(
                n,
                a,
                e.memoizedProps
              );
          else
            i !== a ? (i === null ? l.stateNode !== null && (l = l.stateNode, l.parentNode.removeChild(l)) : i.count--, a === null ? vm(
              n,
              e.type,
              e.stateNode
            ) : hm(
              n,
              a,
              e.memoizedProps
            )) : a === null && e.stateNode !== null && yc(
              e,
              e.memoizedProps,
              l.memoizedProps
            );
        }
        break;
      case 27:
        mt(t, e), ht(e), a & 512 && (Ve || l === null || Wt(l, l.return)), l !== null && a & 4 && yc(
          e,
          e.memoizedProps,
          l.memoizedProps
        );
        break;
      case 5:
        if (mt(t, e), ht(e), a & 512 && (Ve || l === null || Wt(l, l.return)), e.flags & 32) {
          n = e.stateNode;
          try {
            ba(n, "");
          } catch (K) {
            Ne(e, e.return, K);
          }
        }
        a & 4 && e.stateNode != null && (n = e.memoizedProps, yc(
          e,
          n,
          l !== null ? l.memoizedProps : n
        )), a & 1024 && (_c = !0);
        break;
      case 6:
        if (mt(t, e), ht(e), a & 4) {
          if (e.stateNode === null)
            throw Error(c(162));
          a = e.memoizedProps, l = e.stateNode;
          try {
            l.nodeValue = a;
          } catch (K) {
            Ne(e, e.return, K);
          }
        }
        break;
      case 3:
        if (fu = null, n = Zt, Zt = ru(t.containerInfo), mt(t, e), Zt = n, ht(e), a & 4 && l !== null && l.memoizedState.isDehydrated)
          try {
            Fa(t.containerInfo);
          } catch (K) {
            Ne(e, e.return, K);
          }
        _c && (_c = !1, vd(e));
        break;
      case 4:
        a = Zt, Zt = ru(
          e.stateNode.containerInfo
        ), mt(t, e), ht(e), Zt = a;
        break;
      case 12:
        mt(t, e), ht(e);
        break;
      case 31:
        mt(t, e), ht(e), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, $i(e, a)));
        break;
      case 13:
        mt(t, e), ht(e), e.child.flags & 8192 && e.memoizedState !== null != (l !== null && l.memoizedState !== null) && (Wi = yt()), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, $i(e, a)));
        break;
      case 22:
        n = e.memoizedState !== null;
        var b = l !== null && l.memoizedState !== null, z = fl, O = Ve;
        if (fl = z || n, Ve = O || b, mt(t, e), Ve = O, fl = z, ht(e), a & 8192)
          e: for (t = e.stateNode, t._visibility = n ? t._visibility & -2 : t._visibility | 1, n && (l === null || b || fl || Ve || ra(e)), l = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (l === null) {
                b = l = t;
                try {
                  if (i = b.stateNode, n)
                    r = i.style, typeof r.setProperty == "function" ? r.setProperty("display", "none", "important") : r.display = "none";
                  else {
                    m = b.stateNode;
                    var B = b.memoizedProps.style, R = B != null && B.hasOwnProperty("display") ? B.display : null;
                    m.style.display = R == null || typeof R == "boolean" ? "" : ("" + R).trim();
                  }
                } catch (K) {
                  Ne(b, b.return, K);
                }
              }
            } else if (t.tag === 6) {
              if (l === null) {
                b = t;
                try {
                  b.stateNode.nodeValue = n ? "" : b.memoizedProps;
                } catch (K) {
                  Ne(b, b.return, K);
                }
              }
            } else if (t.tag === 18) {
              if (l === null) {
                b = t;
                try {
                  var C = b.stateNode;
                  n ? im(C, !0) : im(b.stateNode, !1);
                } catch (K) {
                  Ne(b, b.return, K);
                }
              }
            } else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === e) && t.child !== null) {
              t.child.return = t, t = t.child;
              continue;
            }
            if (t === e) break e;
            for (; t.sibling === null; ) {
              if (t.return === null || t.return === e) break e;
              l === t && (l = null), t = t.return;
            }
            l === t && (l = null), t.sibling.return = t.return, t = t.sibling;
          }
        a & 4 && (a = e.updateQueue, a !== null && (l = a.retryQueue, l !== null && (a.retryQueue = null, $i(e, l))));
        break;
      case 19:
        mt(t, e), ht(e), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, $i(e, a)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        mt(t, e), ht(e);
    }
  }
  function ht(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var l, a = e.return; a !== null; ) {
          if (sd(a)) {
            l = a;
            break;
          }
          a = a.return;
        }
        if (l == null) throw Error(c(160));
        switch (l.tag) {
          case 27:
            var n = l.stateNode, i = bc(e);
            Ji(e, i, n);
            break;
          case 5:
            var r = l.stateNode;
            l.flags & 32 && (ba(r, ""), l.flags &= -33);
            var m = bc(e);
            Ji(e, m, r);
            break;
          case 3:
          case 4:
            var b = l.stateNode.containerInfo, z = bc(e);
            xc(
              e,
              z,
              b
            );
            break;
          default:
            throw Error(c(161));
        }
      } catch (O) {
        Ne(e, e.return, O);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function vd(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        vd(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
  }
  function ml(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        od(e, t.alternate, t), t = t.sibling;
  }
  function ra(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Cl(4, t, t.return), ra(t);
          break;
        case 1:
          Wt(t, t.return);
          var l = t.stateNode;
          typeof l.componentWillUnmount == "function" && id(
            t,
            t.return,
            l
          ), ra(t);
          break;
        case 27:
          Gn(t.stateNode);
        case 26:
        case 5:
          Wt(t, t.return), ra(t);
          break;
        case 22:
          t.memoizedState === null && ra(t);
          break;
        case 30:
          ra(t);
          break;
        default:
          ra(t);
      }
      e = e.sibling;
    }
  }
  function hl(e, t, l) {
    for (l = l && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var a = t.alternate, n = e, i = t, r = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          hl(
            n,
            i,
            l
          ), Cn(4, i);
          break;
        case 1:
          if (hl(
            n,
            i,
            l
          ), a = i, n = a.stateNode, typeof n.componentDidMount == "function")
            try {
              n.componentDidMount();
            } catch (z) {
              Ne(a, a.return, z);
            }
          if (a = i, n = a.updateQueue, n !== null) {
            var m = a.stateNode;
            try {
              var b = n.shared.hiddenCallbacks;
              if (b !== null)
                for (n.shared.hiddenCallbacks = null, n = 0; n < b.length; n++)
                  Vo(b[n], m);
            } catch (z) {
              Ne(a, a.return, z);
            }
          }
          l && r & 64 && nd(i), On(i, i.return);
          break;
        case 27:
          cd(i);
        case 26:
        case 5:
          hl(
            n,
            i,
            l
          ), l && a === null && r & 4 && ud(i), On(i, i.return);
          break;
        case 12:
          hl(
            n,
            i,
            l
          );
          break;
        case 31:
          hl(
            n,
            i,
            l
          ), l && r & 4 && md(n, i);
          break;
        case 13:
          hl(
            n,
            i,
            l
          ), l && r & 4 && hd(n, i);
          break;
        case 22:
          i.memoizedState === null && hl(
            n,
            i,
            l
          ), On(i, i.return);
          break;
        case 30:
          break;
        default:
          hl(
            n,
            i,
            l
          );
      }
      t = t.sibling;
    }
  }
  function Sc(e, t) {
    var l = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== l && (e != null && e.refCount++, l != null && yn(l));
  }
  function jc(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && yn(e));
  }
  function Vt(e, t, l, a) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        gd(
          e,
          t,
          l,
          a
        ), t = t.sibling;
  }
  function gd(e, t, l, a) {
    var n = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Vt(
          e,
          t,
          l,
          a
        ), n & 2048 && Cn(9, t);
        break;
      case 1:
        Vt(
          e,
          t,
          l,
          a
        );
        break;
      case 3:
        Vt(
          e,
          t,
          l,
          a
        ), n & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && yn(e)));
        break;
      case 12:
        if (n & 2048) {
          Vt(
            e,
            t,
            l,
            a
          ), e = t.stateNode;
          try {
            var i = t.memoizedProps, r = i.id, m = i.onPostCommit;
            typeof m == "function" && m(
              r,
              t.alternate === null ? "mount" : "update",
              e.passiveEffectDuration,
              -0
            );
          } catch (b) {
            Ne(t, t.return, b);
          }
        } else
          Vt(
            e,
            t,
            l,
            a
          );
        break;
      case 31:
        Vt(
          e,
          t,
          l,
          a
        );
        break;
      case 13:
        Vt(
          e,
          t,
          l,
          a
        );
        break;
      case 23:
        break;
      case 22:
        i = t.stateNode, r = t.alternate, t.memoizedState !== null ? i._visibility & 2 ? Vt(
          e,
          t,
          l,
          a
        ) : Dn(e, t) : i._visibility & 2 ? Vt(
          e,
          t,
          l,
          a
        ) : (i._visibility |= 2, qa(
          e,
          t,
          l,
          a,
          (t.subtreeFlags & 10256) !== 0 || !1
        )), n & 2048 && Sc(r, t);
        break;
      case 24:
        Vt(
          e,
          t,
          l,
          a
        ), n & 2048 && jc(t.alternate, t);
        break;
      default:
        Vt(
          e,
          t,
          l,
          a
        );
    }
  }
  function qa(e, t, l, a, n) {
    for (n = n && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var i = e, r = t, m = l, b = a, z = r.flags;
      switch (r.tag) {
        case 0:
        case 11:
        case 15:
          qa(
            i,
            r,
            m,
            b,
            n
          ), Cn(8, r);
          break;
        case 23:
          break;
        case 22:
          var O = r.stateNode;
          r.memoizedState !== null ? O._visibility & 2 ? qa(
            i,
            r,
            m,
            b,
            n
          ) : Dn(
            i,
            r
          ) : (O._visibility |= 2, qa(
            i,
            r,
            m,
            b,
            n
          )), n && z & 2048 && Sc(
            r.alternate,
            r
          );
          break;
        case 24:
          qa(
            i,
            r,
            m,
            b,
            n
          ), n && z & 2048 && jc(r.alternate, r);
          break;
        default:
          qa(
            i,
            r,
            m,
            b,
            n
          );
      }
      t = t.sibling;
    }
  }
  function Dn(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var l = e, a = t, n = a.flags;
        switch (a.tag) {
          case 22:
            Dn(l, a), n & 2048 && Sc(
              a.alternate,
              a
            );
            break;
          case 24:
            Dn(l, a), n & 2048 && jc(a.alternate, a);
            break;
          default:
            Dn(l, a);
        }
        t = t.sibling;
      }
  }
  var Un = 8192;
  function Ya(e, t, l) {
    if (e.subtreeFlags & Un)
      for (e = e.child; e !== null; )
        yd(
          e,
          t,
          l
        ), e = e.sibling;
  }
  function yd(e, t, l) {
    switch (e.tag) {
      case 26:
        Ya(
          e,
          t,
          l
        ), e.flags & Un && e.memoizedState !== null && qv(
          l,
          Zt,
          e.memoizedState,
          e.memoizedProps
        );
        break;
      case 5:
        Ya(
          e,
          t,
          l
        );
        break;
      case 3:
      case 4:
        var a = Zt;
        Zt = ru(e.stateNode.containerInfo), Ya(
          e,
          t,
          l
        ), Zt = a;
        break;
      case 22:
        e.memoizedState === null && (a = e.alternate, a !== null && a.memoizedState !== null ? (a = Un, Un = 16777216, Ya(
          e,
          t,
          l
        ), Un = a) : Ya(
          e,
          t,
          l
        ));
        break;
      default:
        Ya(
          e,
          t,
          l
        );
    }
  }
  function bd(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function wn(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          $e = a, _d(
            a,
            e
          );
        }
      bd(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        xd(e), e = e.sibling;
  }
  function xd(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        wn(e), e.flags & 2048 && Cl(9, e, e.return);
        break;
      case 3:
        wn(e);
        break;
      case 12:
        wn(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Fi(e)) : wn(e);
        break;
      default:
        wn(e);
    }
  }
  function Fi(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          $e = a, _d(
            a,
            e
          );
        }
      bd(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          Cl(8, t, t.return), Fi(t);
          break;
        case 22:
          l = t.stateNode, l._visibility & 2 && (l._visibility &= -3, Fi(t));
          break;
        default:
          Fi(t);
      }
      e = e.sibling;
    }
  }
  function _d(e, t) {
    for (; $e !== null; ) {
      var l = $e;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          Cl(8, l, t);
          break;
        case 23:
        case 22:
          if (l.memoizedState !== null && l.memoizedState.cachePool !== null) {
            var a = l.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          yn(l.memoizedState.cache);
      }
      if (a = l.child, a !== null) a.return = l, $e = a;
      else
        e: for (l = e; $e !== null; ) {
          a = $e;
          var n = a.sibling, i = a.return;
          if (fd(a), a === l) {
            $e = null;
            break e;
          }
          if (n !== null) {
            n.return = i, $e = n;
            break e;
          }
          $e = i;
        }
    }
  }
  var ev = {
    getCacheForType: function(e) {
      var t = et(ke), l = t.data.get(e);
      return l === void 0 && (l = e(), t.data.set(e, l)), l;
    },
    cacheSignal: function() {
      return et(ke).controller.signal;
    }
  }, tv = typeof WeakMap == "function" ? WeakMap : Map, xe = 0, Me = null, fe = null, me = 0, Ee = 0, Nt = null, Ol = !1, Ga = !1, Ec = !1, pl = 0, Be = 0, Dl = 0, oa = 0, Nc = 0, Tt = 0, Xa = 0, Hn = null, pt = null, Tc = !1, Wi = 0, Sd = 0, Pi = 1 / 0, Ii = null, Ul = null, Ke = 0, wl = null, ka = null, vl = 0, Ac = 0, zc = null, jd = null, Bn = 0, Mc = null;
  function At() {
    return (xe & 2) !== 0 && me !== 0 ? me & -me : M.T !== null ? wc() : Br();
  }
  function Ed() {
    if (Tt === 0)
      if ((me & 536870912) === 0 || pe) {
        var e = si;
        si <<= 1, (si & 3932160) === 0 && (si = 262144), Tt = e;
      } else Tt = 536870912;
    return e = jt.current, e !== null && (e.flags |= 32), Tt;
  }
  function vt(e, t, l) {
    (e === Me && (Ee === 2 || Ee === 9) || e.cancelPendingCommit !== null) && (Qa(e, 0), Hl(
      e,
      me,
      Tt,
      !1
    )), an(e, l), ((xe & 2) === 0 || e !== Me) && (e === Me && ((xe & 2) === 0 && (oa |= l), Be === 4 && Hl(
      e,
      me,
      Tt,
      !1
    )), Pt(e));
  }
  function Nd(e, t, l) {
    if ((xe & 6) !== 0) throw Error(c(327));
    var a = !l && (t & 127) === 0 && (t & e.expiredLanes) === 0 || ln(e, t), n = a ? nv(e, t) : Cc(e, t, !0), i = a;
    do {
      if (n === 0) {
        Ga && !a && Hl(e, t, 0, !1);
        break;
      } else {
        if (l = e.current.alternate, i && !lv(l)) {
          n = Cc(e, t, !1), i = !1;
          continue;
        }
        if (n === 2) {
          if (i = t, e.errorRecoveryDisabledLanes & i)
            var r = 0;
          else
            r = e.pendingLanes & -536870913, r = r !== 0 ? r : r & 536870912 ? 536870912 : 0;
          if (r !== 0) {
            t = r;
            e: {
              var m = e;
              n = Hn;
              var b = m.current.memoizedState.isDehydrated;
              if (b && (Qa(m, r).flags |= 256), r = Cc(
                m,
                r,
                !1
              ), r !== 2) {
                if (Ec && !b) {
                  m.errorRecoveryDisabledLanes |= i, oa |= i, n = 4;
                  break e;
                }
                i = pt, pt = n, i !== null && (pt === null ? pt = i : pt.push.apply(
                  pt,
                  i
                ));
              }
              n = r;
            }
            if (i = !1, n !== 2) continue;
          }
        }
        if (n === 1) {
          Qa(e, 0), Hl(e, t, 0, !0);
          break;
        }
        e: {
          switch (a = e, i = n, i) {
            case 0:
            case 1:
              throw Error(c(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              Hl(
                a,
                t,
                Tt,
                !Ol
              );
              break e;
            case 2:
              pt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(c(329));
          }
          if ((t & 62914560) === t && (n = Wi + 300 - yt(), 10 < n)) {
            if (Hl(
              a,
              t,
              Tt,
              !Ol
            ), ri(a, 0, !0) !== 0) break e;
            vl = t, a.timeoutHandle = lm(
              Td.bind(
                null,
                a,
                l,
                pt,
                Ii,
                Tc,
                t,
                Tt,
                oa,
                Xa,
                Ol,
                i,
                "Throttled",
                -0,
                0
              ),
              n
            );
            break e;
          }
          Td(
            a,
            l,
            pt,
            Ii,
            Tc,
            t,
            Tt,
            oa,
            Xa,
            Ol,
            i,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Pt(e);
  }
  function Td(e, t, l, a, n, i, r, m, b, z, O, B, R, C) {
    if (e.timeoutHandle = -1, B = t.subtreeFlags, B & 8192 || (B & 16785408) === 16785408) {
      B = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: tl
      }, yd(
        t,
        i,
        B
      );
      var K = (i & 62914560) === i ? Wi - yt() : (i & 4194048) === i ? Sd - yt() : 0;
      if (K = Yv(
        B,
        K
      ), K !== null) {
        vl = i, e.cancelPendingCommit = K(
          Ud.bind(
            null,
            e,
            t,
            i,
            l,
            a,
            n,
            r,
            m,
            b,
            O,
            B,
            null,
            R,
            C
          )
        ), Hl(e, i, r, !z);
        return;
      }
    }
    Ud(
      e,
      t,
      i,
      l,
      a,
      n,
      r,
      m,
      b
    );
  }
  function lv(e) {
    for (var t = e; ; ) {
      var l = t.tag;
      if ((l === 0 || l === 11 || l === 15) && t.flags & 16384 && (l = t.updateQueue, l !== null && (l = l.stores, l !== null)))
        for (var a = 0; a < l.length; a++) {
          var n = l[a], i = n.getSnapshot;
          n = n.value;
          try {
            if (!_t(i(), n)) return !1;
          } catch {
            return !1;
          }
        }
      if (l = t.child, t.subtreeFlags & 16384 && l !== null)
        l.return = t, t = l;
      else {
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    }
    return !0;
  }
  function Hl(e, t, l, a) {
    t &= ~Nc, t &= ~oa, e.suspendedLanes |= t, e.pingedLanes &= ~t, a && (e.warmLanes |= t), a = e.expirationTimes;
    for (var n = t; 0 < n; ) {
      var i = 31 - xt(n), r = 1 << i;
      a[i] = -1, n &= ~r;
    }
    l !== 0 && Ur(e, l, t);
  }
  function eu() {
    return (xe & 6) === 0 ? (Ln(0), !1) : !0;
  }
  function Rc() {
    if (fe !== null) {
      if (Ee === 0)
        var e = fe.return;
      else
        e = fe, il = ta = null, Vs(e), Ua = null, xn = 0, e = fe;
      for (; e !== null; )
        ad(e.alternate, e), e = e.return;
      fe = null;
    }
  }
  function Qa(e, t) {
    var l = e.timeoutHandle;
    l !== -1 && (e.timeoutHandle = -1, Sv(l)), l = e.cancelPendingCommit, l !== null && (e.cancelPendingCommit = null, l()), vl = 0, Rc(), Me = e, fe = l = al(e.current, null), me = t, Ee = 0, Nt = null, Ol = !1, Ga = ln(e, t), Ec = !1, Xa = Tt = Nc = oa = Dl = Be = 0, pt = Hn = null, Tc = !1, (t & 8) !== 0 && (t |= t & 32);
    var a = e.entangledLanes;
    if (a !== 0)
      for (e = e.entanglements, a &= t; 0 < a; ) {
        var n = 31 - xt(a), i = 1 << n;
        t |= e[n], a &= ~i;
      }
    return pl = t, _i(), l;
  }
  function Ad(e, t) {
    se = null, M.H = zn, t === Da || t === Mi ? (t = Xo(), Ee = 3) : t === Us ? (t = Xo(), Ee = 4) : Ee = t === cc ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, Nt = t, fe === null && (Be = 1, ki(
      e,
      Dt(t, e.current)
    ));
  }
  function zd() {
    var e = jt.current;
    return e === null ? !0 : (me & 4194048) === me ? Bt === null : (me & 62914560) === me || (me & 536870912) !== 0 ? e === Bt : !1;
  }
  function Md() {
    var e = M.H;
    return M.H = zn, e === null ? zn : e;
  }
  function Rd() {
    var e = M.A;
    return M.A = ev, e;
  }
  function tu() {
    Be = 4, Ol || (me & 4194048) !== me && jt.current !== null || (Ga = !0), (Dl & 134217727) === 0 && (oa & 134217727) === 0 || Me === null || Hl(
      Me,
      me,
      Tt,
      !1
    );
  }
  function Cc(e, t, l) {
    var a = xe;
    xe |= 2;
    var n = Md(), i = Rd();
    (Me !== e || me !== t) && (Ii = null, Qa(e, t)), t = !1;
    var r = Be;
    e: do
      try {
        if (Ee !== 0 && fe !== null) {
          var m = fe, b = Nt;
          switch (Ee) {
            case 8:
              Rc(), r = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              jt.current === null && (t = !0);
              var z = Ee;
              if (Ee = 0, Nt = null, Za(e, m, b, z), l && Ga) {
                r = 0;
                break e;
              }
              break;
            default:
              z = Ee, Ee = 0, Nt = null, Za(e, m, b, z);
          }
        }
        av(), r = Be;
        break;
      } catch (O) {
        Ad(e, O);
      }
    while (!0);
    return t && e.shellSuspendCounter++, il = ta = null, xe = a, M.H = n, M.A = i, fe === null && (Me = null, me = 0, _i()), r;
  }
  function av() {
    for (; fe !== null; ) Cd(fe);
  }
  function nv(e, t) {
    var l = xe;
    xe |= 2;
    var a = Md(), n = Rd();
    Me !== e || me !== t ? (Ii = null, Pi = yt() + 500, Qa(e, t)) : Ga = ln(
      e,
      t
    );
    e: do
      try {
        if (Ee !== 0 && fe !== null) {
          t = fe;
          var i = Nt;
          t: switch (Ee) {
            case 1:
              Ee = 0, Nt = null, Za(e, t, i, 1);
              break;
            case 2:
            case 9:
              if (Yo(i)) {
                Ee = 0, Nt = null, Od(t);
                break;
              }
              t = function() {
                Ee !== 2 && Ee !== 9 || Me !== e || (Ee = 7), Pt(e);
              }, i.then(t, t);
              break e;
            case 3:
              Ee = 7;
              break e;
            case 4:
              Ee = 5;
              break e;
            case 7:
              Yo(i) ? (Ee = 0, Nt = null, Od(t)) : (Ee = 0, Nt = null, Za(e, t, i, 7));
              break;
            case 5:
              var r = null;
              switch (fe.tag) {
                case 26:
                  r = fe.memoizedState;
                case 5:
                case 27:
                  var m = fe;
                  if (r ? gm(r) : m.stateNode.complete) {
                    Ee = 0, Nt = null;
                    var b = m.sibling;
                    if (b !== null) fe = b;
                    else {
                      var z = m.return;
                      z !== null ? (fe = z, lu(z)) : fe = null;
                    }
                    break t;
                  }
              }
              Ee = 0, Nt = null, Za(e, t, i, 5);
              break;
            case 6:
              Ee = 0, Nt = null, Za(e, t, i, 6);
              break;
            case 8:
              Rc(), Be = 6;
              break e;
            default:
              throw Error(c(462));
          }
        }
        iv();
        break;
      } catch (O) {
        Ad(e, O);
      }
    while (!0);
    return il = ta = null, M.H = a, M.A = n, xe = l, fe !== null ? 0 : (Me = null, me = 0, _i(), Be);
  }
  function iv() {
    for (; fe !== null && !zh(); )
      Cd(fe);
  }
  function Cd(e) {
    var t = td(e.alternate, e, pl);
    e.memoizedProps = e.pendingProps, t === null ? lu(e) : fe = t;
  }
  function Od(e) {
    var t = e, l = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = $f(
          l,
          t,
          t.pendingProps,
          t.type,
          void 0,
          me
        );
        break;
      case 11:
        t = $f(
          l,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          me
        );
        break;
      case 5:
        Vs(t);
      default:
        ad(l, t), t = fe = Mo(t, pl), t = td(l, t, pl);
    }
    e.memoizedProps = e.pendingProps, t === null ? lu(e) : fe = t;
  }
  function Za(e, t, l, a) {
    il = ta = null, Vs(t), Ua = null, xn = 0;
    var n = t.return;
    try {
      if (Kp(
        e,
        n,
        t,
        l,
        me
      )) {
        Be = 1, ki(
          e,
          Dt(l, e.current)
        ), fe = null;
        return;
      }
    } catch (i) {
      if (n !== null) throw fe = n, i;
      Be = 1, ki(
        e,
        Dt(l, e.current)
      ), fe = null;
      return;
    }
    t.flags & 32768 ? (pe || a === 1 ? e = !0 : Ga || (me & 536870912) !== 0 ? e = !1 : (Ol = e = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = jt.current, a !== null && a.tag === 13 && (a.flags |= 16384))), Dd(t, e)) : lu(t);
  }
  function lu(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        Dd(
          t,
          Ol
        );
        return;
      }
      e = t.return;
      var l = Fp(
        t.alternate,
        t,
        pl
      );
      if (l !== null) {
        fe = l;
        return;
      }
      if (t = t.sibling, t !== null) {
        fe = t;
        return;
      }
      fe = t = e;
    } while (t !== null);
    Be === 0 && (Be = 5);
  }
  function Dd(e, t) {
    do {
      var l = Wp(e.alternate, e);
      if (l !== null) {
        l.flags &= 32767, fe = l;
        return;
      }
      if (l = e.return, l !== null && (l.flags |= 32768, l.subtreeFlags = 0, l.deletions = null), !t && (e = e.sibling, e !== null)) {
        fe = e;
        return;
      }
      fe = e = l;
    } while (e !== null);
    Be = 6, fe = null;
  }
  function Ud(e, t, l, a, n, i, r, m, b) {
    e.cancelPendingCommit = null;
    do
      au();
    while (Ke !== 0);
    if ((xe & 6) !== 0) throw Error(c(327));
    if (t !== null) {
      if (t === e.current) throw Error(c(177));
      if (i = t.lanes | t.childLanes, i |= bs, Lh(
        e,
        l,
        i,
        r,
        m,
        b
      ), e === Me && (fe = Me = null, me = 0), ka = t, wl = e, vl = l, Ac = i, zc = n, jd = a, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, rv(ii, function() {
        return qd(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
        a = M.T, M.T = null, n = q.p, q.p = 2, r = xe, xe |= 4;
        try {
          Pp(e, t, l);
        } finally {
          xe = r, q.p = n, M.T = a;
        }
      }
      Ke = 1, wd(), Hd(), Bd();
    }
  }
  function wd() {
    if (Ke === 1) {
      Ke = 0;
      var e = wl, t = ka, l = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || l) {
        l = M.T, M.T = null;
        var a = q.p;
        q.p = 2;
        var n = xe;
        xe |= 4;
        try {
          pd(t, e);
          var i = kc, r = xo(e.containerInfo), m = i.focusedElem, b = i.selectionRange;
          if (r !== m && m && m.ownerDocument && bo(
            m.ownerDocument.documentElement,
            m
          )) {
            if (b !== null && hs(m)) {
              var z = b.start, O = b.end;
              if (O === void 0 && (O = z), "selectionStart" in m)
                m.selectionStart = z, m.selectionEnd = Math.min(
                  O,
                  m.value.length
                );
              else {
                var B = m.ownerDocument || document, R = B && B.defaultView || window;
                if (R.getSelection) {
                  var C = R.getSelection(), K = m.textContent.length, te = Math.min(b.start, K), ze = b.end === void 0 ? te : Math.min(b.end, K);
                  !C.extend && te > ze && (r = ze, ze = te, te = r);
                  var N = yo(
                    m,
                    te
                  ), _ = yo(
                    m,
                    ze
                  );
                  if (N && _ && (C.rangeCount !== 1 || C.anchorNode !== N.node || C.anchorOffset !== N.offset || C.focusNode !== _.node || C.focusOffset !== _.offset)) {
                    var A = B.createRange();
                    A.setStart(N.node, N.offset), C.removeAllRanges(), te > ze ? (C.addRange(A), C.extend(_.node, _.offset)) : (A.setEnd(_.node, _.offset), C.addRange(A));
                  }
                }
              }
            }
            for (B = [], C = m; C = C.parentNode; )
              C.nodeType === 1 && B.push({
                element: C,
                left: C.scrollLeft,
                top: C.scrollTop
              });
            for (typeof m.focus == "function" && m.focus(), m = 0; m < B.length; m++) {
              var H = B[m];
              H.element.scrollLeft = H.left, H.element.scrollTop = H.top;
            }
          }
          pu = !!Xc, kc = Xc = null;
        } finally {
          xe = n, q.p = a, M.T = l;
        }
      }
      e.current = t, Ke = 2;
    }
  }
  function Hd() {
    if (Ke === 2) {
      Ke = 0;
      var e = wl, t = ka, l = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || l) {
        l = M.T, M.T = null;
        var a = q.p;
        q.p = 2;
        var n = xe;
        xe |= 4;
        try {
          od(e, t.alternate, t);
        } finally {
          xe = n, q.p = a, M.T = l;
        }
      }
      Ke = 3;
    }
  }
  function Bd() {
    if (Ke === 4 || Ke === 3) {
      Ke = 0, Mh();
      var e = wl, t = ka, l = vl, a = jd;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? Ke = 5 : (Ke = 0, ka = wl = null, Ld(e, e.pendingLanes));
      var n = e.pendingLanes;
      if (n === 0 && (Ul = null), $u(l), t = t.stateNode, bt && typeof bt.onCommitFiberRoot == "function")
        try {
          bt.onCommitFiberRoot(
            tn,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (a !== null) {
        t = M.T, n = q.p, q.p = 2, M.T = null;
        try {
          for (var i = e.onRecoverableError, r = 0; r < a.length; r++) {
            var m = a[r];
            i(m.value, {
              componentStack: m.stack
            });
          }
        } finally {
          M.T = t, q.p = n;
        }
      }
      (vl & 3) !== 0 && au(), Pt(e), n = e.pendingLanes, (l & 261930) !== 0 && (n & 42) !== 0 ? e === Mc ? Bn++ : (Bn = 0, Mc = e) : Bn = 0, Ln(0);
    }
  }
  function Ld(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, yn(t)));
  }
  function au() {
    return wd(), Hd(), Bd(), qd();
  }
  function qd() {
    if (Ke !== 5) return !1;
    var e = wl, t = Ac;
    Ac = 0;
    var l = $u(vl), a = M.T, n = q.p;
    try {
      q.p = 32 > l ? 32 : l, M.T = null, l = zc, zc = null;
      var i = wl, r = vl;
      if (Ke = 0, ka = wl = null, vl = 0, (xe & 6) !== 0) throw Error(c(331));
      var m = xe;
      if (xe |= 4, xd(i.current), gd(
        i,
        i.current,
        r,
        l
      ), xe = m, Ln(0, !1), bt && typeof bt.onPostCommitFiberRoot == "function")
        try {
          bt.onPostCommitFiberRoot(tn, i);
        } catch {
        }
      return !0;
    } finally {
      q.p = n, M.T = a, Ld(e, t);
    }
  }
  function Yd(e, t, l) {
    t = Dt(l, t), t = sc(e.stateNode, t, 2), e = zl(e, t, 2), e !== null && (an(e, 2), Pt(e));
  }
  function Ne(e, t, l) {
    if (e.tag === 3)
      Yd(e, e, l);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Yd(
            t,
            e,
            l
          );
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (Ul === null || !Ul.has(a))) {
            e = Dt(l, e), l = Gf(2), a = zl(t, l, 2), a !== null && (Xf(
              l,
              a,
              t,
              e
            ), an(a, 2), Pt(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function Oc(e, t, l) {
    var a = e.pingCache;
    if (a === null) {
      a = e.pingCache = new tv();
      var n = /* @__PURE__ */ new Set();
      a.set(t, n);
    } else
      n = a.get(t), n === void 0 && (n = /* @__PURE__ */ new Set(), a.set(t, n));
    n.has(l) || (Ec = !0, n.add(l), e = uv.bind(null, e, t, l), t.then(e, e));
  }
  function uv(e, t, l) {
    var a = e.pingCache;
    a !== null && a.delete(t), e.pingedLanes |= e.suspendedLanes & l, e.warmLanes &= ~l, Me === e && (me & l) === l && (Be === 4 || Be === 3 && (me & 62914560) === me && 300 > yt() - Wi ? (xe & 2) === 0 && Qa(e, 0) : Nc |= l, Xa === me && (Xa = 0)), Pt(e);
  }
  function Gd(e, t) {
    t === 0 && (t = Dr()), e = Pl(e, t), e !== null && (an(e, t), Pt(e));
  }
  function sv(e) {
    var t = e.memoizedState, l = 0;
    t !== null && (l = t.retryLane), Gd(e, l);
  }
  function cv(e, t) {
    var l = 0;
    switch (e.tag) {
      case 31:
      case 13:
        var a = e.stateNode, n = e.memoizedState;
        n !== null && (l = n.retryLane);
        break;
      case 19:
        a = e.stateNode;
        break;
      case 22:
        a = e.stateNode._retryCache;
        break;
      default:
        throw Error(c(314));
    }
    a !== null && a.delete(t), Gd(e, l);
  }
  function rv(e, t) {
    return Zu(e, t);
  }
  var nu = null, Va = null, Dc = !1, iu = !1, Uc = !1, Bl = 0;
  function Pt(e) {
    e !== Va && e.next === null && (Va === null ? nu = Va = e : Va = Va.next = e), iu = !0, Dc || (Dc = !0, fv());
  }
  function Ln(e, t) {
    if (!Uc && iu) {
      Uc = !0;
      do
        for (var l = !1, a = nu; a !== null; ) {
          if (e !== 0) {
            var n = a.pendingLanes;
            if (n === 0) var i = 0;
            else {
              var r = a.suspendedLanes, m = a.pingedLanes;
              i = (1 << 31 - xt(42 | e) + 1) - 1, i &= n & ~(r & ~m), i = i & 201326741 ? i & 201326741 | 1 : i ? i | 2 : 0;
            }
            i !== 0 && (l = !0, Zd(a, i));
          } else
            i = me, i = ri(
              a,
              a === Me ? i : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (i & 3) === 0 || ln(a, i) || (l = !0, Zd(a, i));
          a = a.next;
        }
      while (l);
      Uc = !1;
    }
  }
  function ov() {
    Xd();
  }
  function Xd() {
    iu = Dc = !1;
    var e = 0;
    Bl !== 0 && _v() && (e = Bl);
    for (var t = yt(), l = null, a = nu; a !== null; ) {
      var n = a.next, i = kd(a, t);
      i === 0 ? (a.next = null, l === null ? nu = n : l.next = n, n === null && (Va = l)) : (l = a, (e !== 0 || (i & 3) !== 0) && (iu = !0)), a = n;
    }
    Ke !== 0 && Ke !== 5 || Ln(e), Bl !== 0 && (Bl = 0);
  }
  function kd(e, t) {
    for (var l = e.suspendedLanes, a = e.pingedLanes, n = e.expirationTimes, i = e.pendingLanes & -62914561; 0 < i; ) {
      var r = 31 - xt(i), m = 1 << r, b = n[r];
      b === -1 ? ((m & l) === 0 || (m & a) !== 0) && (n[r] = Bh(m, t)) : b <= t && (e.expiredLanes |= m), i &= ~m;
    }
    if (t = Me, l = me, l = ri(
      e,
      e === t ? l : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a = e.callbackNode, l === 0 || e === t && (Ee === 2 || Ee === 9) || e.cancelPendingCommit !== null)
      return a !== null && a !== null && Vu(a), e.callbackNode = null, e.callbackPriority = 0;
    if ((l & 3) === 0 || ln(e, l)) {
      if (t = l & -l, t === e.callbackPriority) return t;
      switch (a !== null && Vu(a), $u(l)) {
        case 2:
        case 8:
          l = Cr;
          break;
        case 32:
          l = ii;
          break;
        case 268435456:
          l = Or;
          break;
        default:
          l = ii;
      }
      return a = Qd.bind(null, e), l = Zu(l, a), e.callbackPriority = t, e.callbackNode = l, t;
    }
    return a !== null && a !== null && Vu(a), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function Qd(e, t) {
    if (Ke !== 0 && Ke !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var l = e.callbackNode;
    if (au() && e.callbackNode !== l)
      return null;
    var a = me;
    return a = ri(
      e,
      e === Me ? a : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a === 0 ? null : (Nd(e, a, t), kd(e, yt()), e.callbackNode != null && e.callbackNode === l ? Qd.bind(null, e) : null);
  }
  function Zd(e, t) {
    if (au()) return null;
    Nd(e, t, !0);
  }
  function fv() {
    jv(function() {
      (xe & 6) !== 0 ? Zu(
        Rr,
        ov
      ) : Xd();
    });
  }
  function wc() {
    if (Bl === 0) {
      var e = Ca;
      e === 0 && (e = ui, ui <<= 1, (ui & 261888) === 0 && (ui = 256)), Bl = e;
    }
    return Bl;
  }
  function Vd(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : mi("" + e);
  }
  function Kd(e, t) {
    var l = t.ownerDocument.createElement("input");
    return l.name = t.name, l.value = t.value, e.id && l.setAttribute("form", e.id), t.parentNode.insertBefore(l, t), e = new FormData(e), l.parentNode.removeChild(l), e;
  }
  function dv(e, t, l, a, n) {
    if (t === "submit" && l && l.stateNode === n) {
      var i = Vd(
        (n[ot] || null).action
      ), r = a.submitter;
      r && (t = (t = r[ot] || null) ? Vd(t.formAction) : r.getAttribute("formAction"), t !== null && (i = t, r = null));
      var m = new gi(
        "action",
        "action",
        null,
        a,
        n
      );
      e.push({
        event: m,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (Bl !== 0) {
                  var b = r ? Kd(n, r) : new FormData(n);
                  tc(
                    l,
                    {
                      pending: !0,
                      data: b,
                      method: n.method,
                      action: i
                    },
                    null,
                    b
                  );
                }
              } else
                typeof i == "function" && (m.preventDefault(), b = r ? Kd(n, r) : new FormData(n), tc(
                  l,
                  {
                    pending: !0,
                    data: b,
                    method: n.method,
                    action: i
                  },
                  i,
                  b
                ));
            },
            currentTarget: n
          }
        ]
      });
    }
  }
  for (var Hc = 0; Hc < ys.length; Hc++) {
    var Bc = ys[Hc], mv = Bc.toLowerCase(), hv = Bc[0].toUpperCase() + Bc.slice(1);
    Qt(
      mv,
      "on" + hv
    );
  }
  Qt(jo, "onAnimationEnd"), Qt(Eo, "onAnimationIteration"), Qt(No, "onAnimationStart"), Qt("dblclick", "onDoubleClick"), Qt("focusin", "onFocus"), Qt("focusout", "onBlur"), Qt(Rp, "onTransitionRun"), Qt(Cp, "onTransitionStart"), Qt(Op, "onTransitionCancel"), Qt(To, "onTransitionEnd"), ga("onMouseEnter", ["mouseout", "mouseover"]), ga("onMouseLeave", ["mouseout", "mouseover"]), ga("onPointerEnter", ["pointerout", "pointerover"]), ga("onPointerLeave", ["pointerout", "pointerover"]), Jl(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), Jl(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), Jl("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), Jl(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), Jl(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), Jl(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var qn = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), pv = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(qn)
  );
  function Jd(e, t) {
    t = (t & 4) !== 0;
    for (var l = 0; l < e.length; l++) {
      var a = e[l], n = a.event;
      a = a.listeners;
      e: {
        var i = void 0;
        if (t)
          for (var r = a.length - 1; 0 <= r; r--) {
            var m = a[r], b = m.instance, z = m.currentTarget;
            if (m = m.listener, b !== i && n.isPropagationStopped())
              break e;
            i = m, n.currentTarget = z;
            try {
              i(n);
            } catch (O) {
              xi(O);
            }
            n.currentTarget = null, i = b;
          }
        else
          for (r = 0; r < a.length; r++) {
            if (m = a[r], b = m.instance, z = m.currentTarget, m = m.listener, b !== i && n.isPropagationStopped())
              break e;
            i = m, n.currentTarget = z;
            try {
              i(n);
            } catch (O) {
              xi(O);
            }
            n.currentTarget = null, i = b;
          }
      }
    }
  }
  function de(e, t) {
    var l = t[Fu];
    l === void 0 && (l = t[Fu] = /* @__PURE__ */ new Set());
    var a = e + "__bubble";
    l.has(a) || ($d(t, e, 2, !1), l.add(a));
  }
  function Lc(e, t, l) {
    var a = 0;
    t && (a |= 4), $d(
      l,
      e,
      a,
      t
    );
  }
  var uu = "_reactListening" + Math.random().toString(36).slice(2);
  function qc(e) {
    if (!e[uu]) {
      e[uu] = !0, Yr.forEach(function(l) {
        l !== "selectionchange" && (pv.has(l) || Lc(l, !1, e), Lc(l, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[uu] || (t[uu] = !0, Lc("selectionchange", !1, t));
    }
  }
  function $d(e, t, l, a) {
    switch (Em(t)) {
      case 2:
        var n = kv;
        break;
      case 8:
        n = Qv;
        break;
      default:
        n = er;
    }
    l = n.bind(
      null,
      t,
      l,
      e
    ), n = void 0, !is || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (n = !0), a ? n !== void 0 ? e.addEventListener(t, l, {
      capture: !0,
      passive: n
    }) : e.addEventListener(t, l, !0) : n !== void 0 ? e.addEventListener(t, l, {
      passive: n
    }) : e.addEventListener(t, l, !1);
  }
  function Yc(e, t, l, a, n) {
    var i = a;
    if ((t & 1) === 0 && (t & 2) === 0 && a !== null)
      e: for (; ; ) {
        if (a === null) return;
        var r = a.tag;
        if (r === 3 || r === 4) {
          var m = a.stateNode.containerInfo;
          if (m === n) break;
          if (r === 4)
            for (r = a.return; r !== null; ) {
              var b = r.tag;
              if ((b === 3 || b === 4) && r.stateNode.containerInfo === n)
                return;
              r = r.return;
            }
          for (; m !== null; ) {
            if (r = ha(m), r === null) return;
            if (b = r.tag, b === 5 || b === 6 || b === 26 || b === 27) {
              a = i = r;
              continue e;
            }
            m = m.parentNode;
          }
        }
        a = a.return;
      }
    Pr(function() {
      var z = i, O = as(l), B = [];
      e: {
        var R = Ao.get(e);
        if (R !== void 0) {
          var C = gi, K = e;
          switch (e) {
            case "keypress":
              if (pi(l) === 0) break e;
            case "keydown":
            case "keyup":
              C = cp;
              break;
            case "focusin":
              K = "focus", C = rs;
              break;
            case "focusout":
              K = "blur", C = rs;
              break;
            case "beforeblur":
            case "afterblur":
              C = rs;
              break;
            case "click":
              if (l.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              C = to;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              C = Fh;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              C = fp;
              break;
            case jo:
            case Eo:
            case No:
              C = Ih;
              break;
            case To:
              C = mp;
              break;
            case "scroll":
            case "scrollend":
              C = Jh;
              break;
            case "wheel":
              C = pp;
              break;
            case "copy":
            case "cut":
            case "paste":
              C = tp;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              C = ao;
              break;
            case "toggle":
            case "beforetoggle":
              C = gp;
          }
          var te = (t & 4) !== 0, ze = !te && (e === "scroll" || e === "scrollend"), N = te ? R !== null ? R + "Capture" : null : R;
          te = [];
          for (var _ = z, A; _ !== null; ) {
            var H = _;
            if (A = H.stateNode, H = H.tag, H !== 5 && H !== 26 && H !== 27 || A === null || N === null || (H = sn(_, N), H != null && te.push(
              Yn(_, H, A)
            )), ze) break;
            _ = _.return;
          }
          0 < te.length && (R = new C(
            R,
            K,
            null,
            l,
            O
          ), B.push({ event: R, listeners: te }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (R = e === "mouseover" || e === "pointerover", C = e === "mouseout" || e === "pointerout", R && l !== ls && (K = l.relatedTarget || l.fromElement) && (ha(K) || K[ma]))
            break e;
          if ((C || R) && (R = O.window === O ? O : (R = O.ownerDocument) ? R.defaultView || R.parentWindow : window, C ? (K = l.relatedTarget || l.toElement, C = z, K = K ? ha(K) : null, K !== null && (ze = h(K), te = K.tag, K !== ze || te !== 5 && te !== 27 && te !== 6) && (K = null)) : (C = null, K = z), C !== K)) {
            if (te = to, H = "onMouseLeave", N = "onMouseEnter", _ = "mouse", (e === "pointerout" || e === "pointerover") && (te = ao, H = "onPointerLeave", N = "onPointerEnter", _ = "pointer"), ze = C == null ? R : un(C), A = K == null ? R : un(K), R = new te(
              H,
              _ + "leave",
              C,
              l,
              O
            ), R.target = ze, R.relatedTarget = A, H = null, ha(O) === z && (te = new te(
              N,
              _ + "enter",
              K,
              l,
              O
            ), te.target = A, te.relatedTarget = ze, H = te), ze = H, C && K)
              t: {
                for (te = vv, N = C, _ = K, A = 0, H = N; H; H = te(H))
                  A++;
                H = 0;
                for (var I = _; I; I = te(I))
                  H++;
                for (; 0 < A - H; )
                  N = te(N), A--;
                for (; 0 < H - A; )
                  _ = te(_), H--;
                for (; A--; ) {
                  if (N === _ || _ !== null && N === _.alternate) {
                    te = N;
                    break t;
                  }
                  N = te(N), _ = te(_);
                }
                te = null;
              }
            else te = null;
            C !== null && Fd(
              B,
              R,
              C,
              te,
              !1
            ), K !== null && ze !== null && Fd(
              B,
              ze,
              K,
              te,
              !0
            );
          }
        }
        e: {
          if (R = z ? un(z) : window, C = R.nodeName && R.nodeName.toLowerCase(), C === "select" || C === "input" && R.type === "file")
            var ge = fo;
          else if (ro(R))
            if (mo)
              ge = Ap;
            else {
              ge = Np;
              var F = Ep;
            }
          else
            C = R.nodeName, !C || C.toLowerCase() !== "input" || R.type !== "checkbox" && R.type !== "radio" ? z && ts(z.elementType) && (ge = fo) : ge = Tp;
          if (ge && (ge = ge(e, z))) {
            oo(
              B,
              ge,
              l,
              O
            );
            break e;
          }
          F && F(e, R, z), e === "focusout" && z && R.type === "number" && z.memoizedProps.value != null && es(R, "number", R.value);
        }
        switch (F = z ? un(z) : window, e) {
          case "focusin":
            (ro(F) || F.contentEditable === "true") && (ja = F, ps = z, pn = null);
            break;
          case "focusout":
            pn = ps = ja = null;
            break;
          case "mousedown":
            vs = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            vs = !1, _o(B, l, O);
            break;
          case "selectionchange":
            if (Mp) break;
          case "keydown":
          case "keyup":
            _o(B, l, O);
        }
        var ce;
        if (fs)
          e: {
            switch (e) {
              case "compositionstart":
                var he = "onCompositionStart";
                break e;
              case "compositionend":
                he = "onCompositionEnd";
                break e;
              case "compositionupdate":
                he = "onCompositionUpdate";
                break e;
            }
            he = void 0;
          }
        else
          Sa ? so(e, l) && (he = "onCompositionEnd") : e === "keydown" && l.keyCode === 229 && (he = "onCompositionStart");
        he && (no && l.locale !== "ko" && (Sa || he !== "onCompositionStart" ? he === "onCompositionEnd" && Sa && (ce = Ir()) : (_l = O, us = "value" in _l ? _l.value : _l.textContent, Sa = !0)), F = su(z, he), 0 < F.length && (he = new lo(
          he,
          e,
          null,
          l,
          O
        ), B.push({ event: he, listeners: F }), ce ? he.data = ce : (ce = co(l), ce !== null && (he.data = ce)))), (ce = bp ? xp(e, l) : _p(e, l)) && (he = su(z, "onBeforeInput"), 0 < he.length && (F = new lo(
          "onBeforeInput",
          "beforeinput",
          null,
          l,
          O
        ), B.push({
          event: F,
          listeners: he
        }), F.data = ce)), dv(
          B,
          e,
          z,
          l,
          O
        );
      }
      Jd(B, t);
    });
  }
  function Yn(e, t, l) {
    return {
      instance: e,
      listener: t,
      currentTarget: l
    };
  }
  function su(e, t) {
    for (var l = t + "Capture", a = []; e !== null; ) {
      var n = e, i = n.stateNode;
      if (n = n.tag, n !== 5 && n !== 26 && n !== 27 || i === null || (n = sn(e, l), n != null && a.unshift(
        Yn(e, n, i)
      ), n = sn(e, t), n != null && a.push(
        Yn(e, n, i)
      )), e.tag === 3) return a;
      e = e.return;
    }
    return [];
  }
  function vv(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function Fd(e, t, l, a, n) {
    for (var i = t._reactName, r = []; l !== null && l !== a; ) {
      var m = l, b = m.alternate, z = m.stateNode;
      if (m = m.tag, b !== null && b === a) break;
      m !== 5 && m !== 26 && m !== 27 || z === null || (b = z, n ? (z = sn(l, i), z != null && r.unshift(
        Yn(l, z, b)
      )) : n || (z = sn(l, i), z != null && r.push(
        Yn(l, z, b)
      ))), l = l.return;
    }
    r.length !== 0 && e.push({ event: t, listeners: r });
  }
  var gv = /\r\n?/g, yv = /\u0000|\uFFFD/g;
  function Wd(e) {
    return (typeof e == "string" ? e : "" + e).replace(gv, `
`).replace(yv, "");
  }
  function Pd(e, t) {
    return t = Wd(t), Wd(e) === t;
  }
  function Ae(e, t, l, a, n, i) {
    switch (l) {
      case "children":
        typeof a == "string" ? t === "body" || t === "textarea" && a === "" || ba(e, a) : (typeof a == "number" || typeof a == "bigint") && t !== "body" && ba(e, "" + a);
        break;
      case "className":
        fi(e, "class", a);
        break;
      case "tabIndex":
        fi(e, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        fi(e, l, a);
        break;
      case "style":
        Fr(e, a, i);
        break;
      case "data":
        if (t !== "object") {
          fi(e, "data", a);
          break;
        }
      case "src":
      case "href":
        if (a === "" && (t !== "a" || l !== "href")) {
          e.removeAttribute(l);
          break;
        }
        if (a == null || typeof a == "function" || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(l);
          break;
        }
        a = mi("" + a), e.setAttribute(l, a);
        break;
      case "action":
      case "formAction":
        if (typeof a == "function") {
          e.setAttribute(
            l,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof i == "function" && (l === "formAction" ? (t !== "input" && Ae(e, t, "name", n.name, n, null), Ae(
            e,
            t,
            "formEncType",
            n.formEncType,
            n,
            null
          ), Ae(
            e,
            t,
            "formMethod",
            n.formMethod,
            n,
            null
          ), Ae(
            e,
            t,
            "formTarget",
            n.formTarget,
            n,
            null
          )) : (Ae(e, t, "encType", n.encType, n, null), Ae(e, t, "method", n.method, n, null), Ae(e, t, "target", n.target, n, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(l);
          break;
        }
        a = mi("" + a), e.setAttribute(l, a);
        break;
      case "onClick":
        a != null && (e.onclick = tl);
        break;
      case "onScroll":
        a != null && de("scroll", e);
        break;
      case "onScrollEnd":
        a != null && de("scrollend", e);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(c(61));
          if (l = a.__html, l != null) {
            if (n.children != null) throw Error(c(60));
            e.innerHTML = l;
          }
        }
        break;
      case "multiple":
        e.multiple = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "muted":
        e.muted = a && typeof a != "function" && typeof a != "symbol";
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
        if (a == null || typeof a == "function" || typeof a == "boolean" || typeof a == "symbol") {
          e.removeAttribute("xlink:href");
          break;
        }
        l = mi("" + a), e.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          l
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
        a != null && typeof a != "function" && typeof a != "symbol" ? e.setAttribute(l, "" + a) : e.removeAttribute(l);
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
        a && typeof a != "function" && typeof a != "symbol" ? e.setAttribute(l, "") : e.removeAttribute(l);
        break;
      case "capture":
      case "download":
        a === !0 ? e.setAttribute(l, "") : a !== !1 && a != null && typeof a != "function" && typeof a != "symbol" ? e.setAttribute(l, a) : e.removeAttribute(l);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        a != null && typeof a != "function" && typeof a != "symbol" && !isNaN(a) && 1 <= a ? e.setAttribute(l, a) : e.removeAttribute(l);
        break;
      case "rowSpan":
      case "start":
        a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a) ? e.removeAttribute(l) : e.setAttribute(l, a);
        break;
      case "popover":
        de("beforetoggle", e), de("toggle", e), oi(e, "popover", a);
        break;
      case "xlinkActuate":
        el(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        el(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        el(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        el(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        el(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        el(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        el(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        el(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        el(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        oi(e, "is", a);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < l.length) || l[0] !== "o" && l[0] !== "O" || l[1] !== "n" && l[1] !== "N") && (l = Vh.get(l) || l, oi(e, l, a));
    }
  }
  function Gc(e, t, l, a, n, i) {
    switch (l) {
      case "style":
        Fr(e, a, i);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(c(61));
          if (l = a.__html, l != null) {
            if (n.children != null) throw Error(c(60));
            e.innerHTML = l;
          }
        }
        break;
      case "children":
        typeof a == "string" ? ba(e, a) : (typeof a == "number" || typeof a == "bigint") && ba(e, "" + a);
        break;
      case "onScroll":
        a != null && de("scroll", e);
        break;
      case "onScrollEnd":
        a != null && de("scrollend", e);
        break;
      case "onClick":
        a != null && (e.onclick = tl);
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
        if (!Gr.hasOwnProperty(l))
          e: {
            if (l[0] === "o" && l[1] === "n" && (n = l.endsWith("Capture"), t = l.slice(2, n ? l.length - 7 : void 0), i = e[ot] || null, i = i != null ? i[l] : null, typeof i == "function" && e.removeEventListener(t, i, n), typeof a == "function")) {
              typeof i != "function" && i !== null && (l in e ? e[l] = null : e.hasAttribute(l) && e.removeAttribute(l)), e.addEventListener(t, a, n);
              break e;
            }
            l in e ? e[l] = a : a === !0 ? e.setAttribute(l, "") : oi(e, l, a);
          }
    }
  }
  function lt(e, t, l) {
    switch (t) {
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
        de("error", e), de("load", e);
        var a = !1, n = !1, i;
        for (i in l)
          if (l.hasOwnProperty(i)) {
            var r = l[i];
            if (r != null)
              switch (i) {
                case "src":
                  a = !0;
                  break;
                case "srcSet":
                  n = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(c(137, t));
                default:
                  Ae(e, t, i, r, l, null);
              }
          }
        n && Ae(e, t, "srcSet", l.srcSet, l, null), a && Ae(e, t, "src", l.src, l, null);
        return;
      case "input":
        de("invalid", e);
        var m = i = r = n = null, b = null, z = null;
        for (a in l)
          if (l.hasOwnProperty(a)) {
            var O = l[a];
            if (O != null)
              switch (a) {
                case "name":
                  n = O;
                  break;
                case "type":
                  r = O;
                  break;
                case "checked":
                  b = O;
                  break;
                case "defaultChecked":
                  z = O;
                  break;
                case "value":
                  i = O;
                  break;
                case "defaultValue":
                  m = O;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (O != null)
                    throw Error(c(137, t));
                  break;
                default:
                  Ae(e, t, a, O, l, null);
              }
          }
        Vr(
          e,
          i,
          m,
          b,
          z,
          r,
          n,
          !1
        );
        return;
      case "select":
        de("invalid", e), a = r = i = null;
        for (n in l)
          if (l.hasOwnProperty(n) && (m = l[n], m != null))
            switch (n) {
              case "value":
                i = m;
                break;
              case "defaultValue":
                r = m;
                break;
              case "multiple":
                a = m;
              default:
                Ae(e, t, n, m, l, null);
            }
        t = i, l = r, e.multiple = !!a, t != null ? ya(e, !!a, t, !1) : l != null && ya(e, !!a, l, !0);
        return;
      case "textarea":
        de("invalid", e), i = n = a = null;
        for (r in l)
          if (l.hasOwnProperty(r) && (m = l[r], m != null))
            switch (r) {
              case "value":
                a = m;
                break;
              case "defaultValue":
                n = m;
                break;
              case "children":
                i = m;
                break;
              case "dangerouslySetInnerHTML":
                if (m != null) throw Error(c(91));
                break;
              default:
                Ae(e, t, r, m, l, null);
            }
        Jr(e, a, n, i);
        return;
      case "option":
        for (b in l)
          if (l.hasOwnProperty(b) && (a = l[b], a != null))
            switch (b) {
              case "selected":
                e.selected = a && typeof a != "function" && typeof a != "symbol";
                break;
              default:
                Ae(e, t, b, a, l, null);
            }
        return;
      case "dialog":
        de("beforetoggle", e), de("toggle", e), de("cancel", e), de("close", e);
        break;
      case "iframe":
      case "object":
        de("load", e);
        break;
      case "video":
      case "audio":
        for (a = 0; a < qn.length; a++)
          de(qn[a], e);
        break;
      case "image":
        de("error", e), de("load", e);
        break;
      case "details":
        de("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        de("error", e), de("load", e);
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
        for (z in l)
          if (l.hasOwnProperty(z) && (a = l[z], a != null))
            switch (z) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(c(137, t));
              default:
                Ae(e, t, z, a, l, null);
            }
        return;
      default:
        if (ts(t)) {
          for (O in l)
            l.hasOwnProperty(O) && (a = l[O], a !== void 0 && Gc(
              e,
              t,
              O,
              a,
              l,
              void 0
            ));
          return;
        }
    }
    for (m in l)
      l.hasOwnProperty(m) && (a = l[m], a != null && Ae(e, t, m, a, l, null));
  }
  function bv(e, t, l, a) {
    switch (t) {
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
        var n = null, i = null, r = null, m = null, b = null, z = null, O = null;
        for (C in l) {
          var B = l[C];
          if (l.hasOwnProperty(C) && B != null)
            switch (C) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                b = B;
              default:
                a.hasOwnProperty(C) || Ae(e, t, C, null, a, B);
            }
        }
        for (var R in a) {
          var C = a[R];
          if (B = l[R], a.hasOwnProperty(R) && (C != null || B != null))
            switch (R) {
              case "type":
                i = C;
                break;
              case "name":
                n = C;
                break;
              case "checked":
                z = C;
                break;
              case "defaultChecked":
                O = C;
                break;
              case "value":
                r = C;
                break;
              case "defaultValue":
                m = C;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (C != null)
                  throw Error(c(137, t));
                break;
              default:
                C !== B && Ae(
                  e,
                  t,
                  R,
                  C,
                  a,
                  B
                );
            }
        }
        Iu(
          e,
          r,
          m,
          b,
          z,
          O,
          i,
          n
        );
        return;
      case "select":
        C = r = m = R = null;
        for (i in l)
          if (b = l[i], l.hasOwnProperty(i) && b != null)
            switch (i) {
              case "value":
                break;
              case "multiple":
                C = b;
              default:
                a.hasOwnProperty(i) || Ae(
                  e,
                  t,
                  i,
                  null,
                  a,
                  b
                );
            }
        for (n in a)
          if (i = a[n], b = l[n], a.hasOwnProperty(n) && (i != null || b != null))
            switch (n) {
              case "value":
                R = i;
                break;
              case "defaultValue":
                m = i;
                break;
              case "multiple":
                r = i;
              default:
                i !== b && Ae(
                  e,
                  t,
                  n,
                  i,
                  a,
                  b
                );
            }
        t = m, l = r, a = C, R != null ? ya(e, !!l, R, !1) : !!a != !!l && (t != null ? ya(e, !!l, t, !0) : ya(e, !!l, l ? [] : "", !1));
        return;
      case "textarea":
        C = R = null;
        for (m in l)
          if (n = l[m], l.hasOwnProperty(m) && n != null && !a.hasOwnProperty(m))
            switch (m) {
              case "value":
                break;
              case "children":
                break;
              default:
                Ae(e, t, m, null, a, n);
            }
        for (r in a)
          if (n = a[r], i = l[r], a.hasOwnProperty(r) && (n != null || i != null))
            switch (r) {
              case "value":
                R = n;
                break;
              case "defaultValue":
                C = n;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (n != null) throw Error(c(91));
                break;
              default:
                n !== i && Ae(e, t, r, n, a, i);
            }
        Kr(e, R, C);
        return;
      case "option":
        for (var K in l)
          if (R = l[K], l.hasOwnProperty(K) && R != null && !a.hasOwnProperty(K))
            switch (K) {
              case "selected":
                e.selected = !1;
                break;
              default:
                Ae(
                  e,
                  t,
                  K,
                  null,
                  a,
                  R
                );
            }
        for (b in a)
          if (R = a[b], C = l[b], a.hasOwnProperty(b) && R !== C && (R != null || C != null))
            switch (b) {
              case "selected":
                e.selected = R && typeof R != "function" && typeof R != "symbol";
                break;
              default:
                Ae(
                  e,
                  t,
                  b,
                  R,
                  a,
                  C
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
        for (var te in l)
          R = l[te], l.hasOwnProperty(te) && R != null && !a.hasOwnProperty(te) && Ae(e, t, te, null, a, R);
        for (z in a)
          if (R = a[z], C = l[z], a.hasOwnProperty(z) && R !== C && (R != null || C != null))
            switch (z) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (R != null)
                  throw Error(c(137, t));
                break;
              default:
                Ae(
                  e,
                  t,
                  z,
                  R,
                  a,
                  C
                );
            }
        return;
      default:
        if (ts(t)) {
          for (var ze in l)
            R = l[ze], l.hasOwnProperty(ze) && R !== void 0 && !a.hasOwnProperty(ze) && Gc(
              e,
              t,
              ze,
              void 0,
              a,
              R
            );
          for (O in a)
            R = a[O], C = l[O], !a.hasOwnProperty(O) || R === C || R === void 0 && C === void 0 || Gc(
              e,
              t,
              O,
              R,
              a,
              C
            );
          return;
        }
    }
    for (var N in l)
      R = l[N], l.hasOwnProperty(N) && R != null && !a.hasOwnProperty(N) && Ae(e, t, N, null, a, R);
    for (B in a)
      R = a[B], C = l[B], !a.hasOwnProperty(B) || R === C || R == null && C == null || Ae(e, t, B, R, a, C);
  }
  function Id(e) {
    switch (e) {
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
  function xv() {
    if (typeof performance.getEntriesByType == "function") {
      for (var e = 0, t = 0, l = performance.getEntriesByType("resource"), a = 0; a < l.length; a++) {
        var n = l[a], i = n.transferSize, r = n.initiatorType, m = n.duration;
        if (i && m && Id(r)) {
          for (r = 0, m = n.responseEnd, a += 1; a < l.length; a++) {
            var b = l[a], z = b.startTime;
            if (z > m) break;
            var O = b.transferSize, B = b.initiatorType;
            O && Id(B) && (b = b.responseEnd, r += O * (b < m ? 1 : (m - z) / (b - z)));
          }
          if (--a, t += 8 * (i + r) / (n.duration / 1e3), e++, 10 < e) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
  }
  var Xc = null, kc = null;
  function cu(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function em(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function tm(e, t) {
    if (e === 0)
      switch (t) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return e === 1 && t === "foreignObject" ? 0 : e;
  }
  function Qc(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Zc = null;
  function _v() {
    var e = window.event;
    return e && e.type === "popstate" ? e === Zc ? !1 : (Zc = e, !0) : (Zc = null, !1);
  }
  var lm = typeof setTimeout == "function" ? setTimeout : void 0, Sv = typeof clearTimeout == "function" ? clearTimeout : void 0, am = typeof Promise == "function" ? Promise : void 0, jv = typeof queueMicrotask == "function" ? queueMicrotask : typeof am < "u" ? function(e) {
    return am.resolve(null).then(e).catch(Ev);
  } : lm;
  function Ev(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Ll(e) {
    return e === "head";
  }
  function nm(e, t) {
    var l = t, a = 0;
    do {
      var n = l.nextSibling;
      if (e.removeChild(l), n && n.nodeType === 8)
        if (l = n.data, l === "/$" || l === "/&") {
          if (a === 0) {
            e.removeChild(n), Fa(t);
            return;
          }
          a--;
        } else if (l === "$" || l === "$?" || l === "$~" || l === "$!" || l === "&")
          a++;
        else if (l === "html")
          Gn(e.ownerDocument.documentElement);
        else if (l === "head") {
          l = e.ownerDocument.head, Gn(l);
          for (var i = l.firstChild; i; ) {
            var r = i.nextSibling, m = i.nodeName;
            i[nn] || m === "SCRIPT" || m === "STYLE" || m === "LINK" && i.rel.toLowerCase() === "stylesheet" || l.removeChild(i), i = r;
          }
        } else
          l === "body" && Gn(e.ownerDocument.body);
      l = n;
    } while (l);
    Fa(t);
  }
  function im(e, t) {
    var l = e;
    e = 0;
    do {
      var a = l.nextSibling;
      if (l.nodeType === 1 ? t ? (l._stashedDisplay = l.style.display, l.style.display = "none") : (l.style.display = l._stashedDisplay || "", l.getAttribute("style") === "" && l.removeAttribute("style")) : l.nodeType === 3 && (t ? (l._stashedText = l.nodeValue, l.nodeValue = "") : l.nodeValue = l._stashedText || ""), a && a.nodeType === 8)
        if (l = a.data, l === "/$") {
          if (e === 0) break;
          e--;
        } else
          l !== "$" && l !== "$?" && l !== "$~" && l !== "$!" || e++;
      l = a;
    } while (l);
  }
  function Vc(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var l = t;
      switch (t = t.nextSibling, l.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Vc(l), Wu(l);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (l.rel.toLowerCase() === "stylesheet") continue;
      }
      e.removeChild(l);
    }
  }
  function Nv(e, t, l, a) {
    for (; e.nodeType === 1; ) {
      var n = l;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!a && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (a) {
        if (!e[nn])
          switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (i = e.getAttribute("rel"), i === "stylesheet" && e.hasAttribute("data-precedence"))
                break;
              if (i !== n.rel || e.getAttribute("href") !== (n.href == null || n.href === "" ? null : n.href) || e.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin) || e.getAttribute("title") !== (n.title == null ? null : n.title))
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (i = e.getAttribute("src"), (i !== (n.src == null ? null : n.src) || e.getAttribute("type") !== (n.type == null ? null : n.type) || e.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin)) && i && e.hasAttribute("async") && !e.hasAttribute("itemprop"))
                break;
              return e;
            default:
              return e;
          }
      } else if (t === "input" && e.type === "hidden") {
        var i = n.name == null ? null : "" + n.name;
        if (n.type === "hidden" && e.getAttribute("name") === i)
          return e;
      } else return e;
      if (e = Lt(e.nextSibling), e === null) break;
    }
    return null;
  }
  function Tv(e, t, l) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !l || (e = Lt(e.nextSibling), e === null)) return null;
    return e;
  }
  function um(e, t) {
    for (; e.nodeType !== 8; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = Lt(e.nextSibling), e === null)) return null;
    return e;
  }
  function Kc(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function Jc(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
  }
  function Av(e, t) {
    var l = e.ownerDocument;
    if (e.data === "$~") e._reactRetry = t;
    else if (e.data !== "$?" || l.readyState !== "loading")
      t();
    else {
      var a = function() {
        t(), l.removeEventListener("DOMContentLoaded", a);
      };
      l.addEventListener("DOMContentLoaded", a), e._reactRetry = a;
    }
  }
  function Lt(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F")
          break;
        if (t === "/$" || t === "/&") return null;
      }
    }
    return e;
  }
  var $c = null;
  function sm(e) {
    e = e.nextSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var l = e.data;
        if (l === "/$" || l === "/&") {
          if (t === 0)
            return Lt(e.nextSibling);
          t--;
        } else
          l !== "$" && l !== "$!" && l !== "$?" && l !== "$~" && l !== "&" || t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function cm(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var l = e.data;
        if (l === "$" || l === "$!" || l === "$?" || l === "$~" || l === "&") {
          if (t === 0) return e;
          t--;
        } else l !== "/$" && l !== "/&" || t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  function rm(e, t, l) {
    switch (t = cu(l), e) {
      case "html":
        if (e = t.documentElement, !e) throw Error(c(452));
        return e;
      case "head":
        if (e = t.head, !e) throw Error(c(453));
        return e;
      case "body":
        if (e = t.body, !e) throw Error(c(454));
        return e;
      default:
        throw Error(c(451));
    }
  }
  function Gn(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    Wu(e);
  }
  var qt = /* @__PURE__ */ new Map(), om = /* @__PURE__ */ new Set();
  function ru(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var gl = q.d;
  q.d = {
    f: zv,
    r: Mv,
    D: Rv,
    C: Cv,
    L: Ov,
    m: Dv,
    X: wv,
    S: Uv,
    M: Hv
  };
  function zv() {
    var e = gl.f(), t = eu();
    return e || t;
  }
  function Mv(e) {
    var t = pa(e);
    t !== null && t.tag === 5 && t.type === "form" ? Af(t) : gl.r(e);
  }
  var Ka = typeof document > "u" ? null : document;
  function fm(e, t, l) {
    var a = Ka;
    if (a && typeof t == "string" && t) {
      var n = Ct(t);
      n = 'link[rel="' + e + '"][href="' + n + '"]', typeof l == "string" && (n += '[crossorigin="' + l + '"]'), om.has(n) || (om.add(n), e = { rel: e, crossOrigin: l, href: t }, a.querySelector(n) === null && (t = a.createElement("link"), lt(t, "link", e), Je(t), a.head.appendChild(t)));
    }
  }
  function Rv(e) {
    gl.D(e), fm("dns-prefetch", e, null);
  }
  function Cv(e, t) {
    gl.C(e, t), fm("preconnect", e, t);
  }
  function Ov(e, t, l) {
    gl.L(e, t, l);
    var a = Ka;
    if (a && e && t) {
      var n = 'link[rel="preload"][as="' + Ct(t) + '"]';
      t === "image" && l && l.imageSrcSet ? (n += '[imagesrcset="' + Ct(
        l.imageSrcSet
      ) + '"]', typeof l.imageSizes == "string" && (n += '[imagesizes="' + Ct(
        l.imageSizes
      ) + '"]')) : n += '[href="' + Ct(e) + '"]';
      var i = n;
      switch (t) {
        case "style":
          i = Ja(e);
          break;
        case "script":
          i = $a(e);
      }
      qt.has(i) || (e = j(
        {
          rel: "preload",
          href: t === "image" && l && l.imageSrcSet ? void 0 : e,
          as: t
        },
        l
      ), qt.set(i, e), a.querySelector(n) !== null || t === "style" && a.querySelector(Xn(i)) || t === "script" && a.querySelector(kn(i)) || (t = a.createElement("link"), lt(t, "link", e), Je(t), a.head.appendChild(t)));
    }
  }
  function Dv(e, t) {
    gl.m(e, t);
    var l = Ka;
    if (l && e) {
      var a = t && typeof t.as == "string" ? t.as : "script", n = 'link[rel="modulepreload"][as="' + Ct(a) + '"][href="' + Ct(e) + '"]', i = n;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          i = $a(e);
      }
      if (!qt.has(i) && (e = j({ rel: "modulepreload", href: e }, t), qt.set(i, e), l.querySelector(n) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (l.querySelector(kn(i)))
              return;
        }
        a = l.createElement("link"), lt(a, "link", e), Je(a), l.head.appendChild(a);
      }
    }
  }
  function Uv(e, t, l) {
    gl.S(e, t, l);
    var a = Ka;
    if (a && e) {
      var n = va(a).hoistableStyles, i = Ja(e);
      t = t || "default";
      var r = n.get(i);
      if (!r) {
        var m = { loading: 0, preload: null };
        if (r = a.querySelector(
          Xn(i)
        ))
          m.loading = 5;
        else {
          e = j(
            { rel: "stylesheet", href: e, "data-precedence": t },
            l
          ), (l = qt.get(i)) && Fc(e, l);
          var b = r = a.createElement("link");
          Je(b), lt(b, "link", e), b._p = new Promise(function(z, O) {
            b.onload = z, b.onerror = O;
          }), b.addEventListener("load", function() {
            m.loading |= 1;
          }), b.addEventListener("error", function() {
            m.loading |= 2;
          }), m.loading |= 4, ou(r, t, a);
        }
        r = {
          type: "stylesheet",
          instance: r,
          count: 1,
          state: m
        }, n.set(i, r);
      }
    }
  }
  function wv(e, t) {
    gl.X(e, t);
    var l = Ka;
    if (l && e) {
      var a = va(l).hoistableScripts, n = $a(e), i = a.get(n);
      i || (i = l.querySelector(kn(n)), i || (e = j({ src: e, async: !0 }, t), (t = qt.get(n)) && Wc(e, t), i = l.createElement("script"), Je(i), lt(i, "link", e), l.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, a.set(n, i));
    }
  }
  function Hv(e, t) {
    gl.M(e, t);
    var l = Ka;
    if (l && e) {
      var a = va(l).hoistableScripts, n = $a(e), i = a.get(n);
      i || (i = l.querySelector(kn(n)), i || (e = j({ src: e, async: !0, type: "module" }, t), (t = qt.get(n)) && Wc(e, t), i = l.createElement("script"), Je(i), lt(i, "link", e), l.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, a.set(n, i));
    }
  }
  function dm(e, t, l, a) {
    var n = (n = oe.current) ? ru(n) : null;
    if (!n) throw Error(c(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof l.precedence == "string" && typeof l.href == "string" ? (t = Ja(l.href), l = va(
          n
        ).hoistableStyles, a = l.get(t), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, l.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (l.rel === "stylesheet" && typeof l.href == "string" && typeof l.precedence == "string") {
          e = Ja(l.href);
          var i = va(
            n
          ).hoistableStyles, r = i.get(e);
          if (r || (n = n.ownerDocument || n, r = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, i.set(e, r), (i = n.querySelector(
            Xn(e)
          )) && !i._p && (r.instance = i, r.state.loading = 5), qt.has(e) || (l = {
            rel: "preload",
            as: "style",
            href: l.href,
            crossOrigin: l.crossOrigin,
            integrity: l.integrity,
            media: l.media,
            hrefLang: l.hrefLang,
            referrerPolicy: l.referrerPolicy
          }, qt.set(e, l), i || Bv(
            n,
            e,
            l,
            r.state
          ))), t && a === null)
            throw Error(c(528, ""));
          return r;
        }
        if (t && a !== null)
          throw Error(c(529, ""));
        return null;
      case "script":
        return t = l.async, l = l.src, typeof l == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = $a(l), l = va(
          n
        ).hoistableScripts, a = l.get(t), a || (a = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, l.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(c(444, e));
    }
  }
  function Ja(e) {
    return 'href="' + Ct(e) + '"';
  }
  function Xn(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function mm(e) {
    return j({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function Bv(e, t, l, a) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? a.loading = 1 : (t = e.createElement("link"), a.preload = t, t.addEventListener("load", function() {
      return a.loading |= 1;
    }), t.addEventListener("error", function() {
      return a.loading |= 2;
    }), lt(t, "link", l), Je(t), e.head.appendChild(t));
  }
  function $a(e) {
    return '[src="' + Ct(e) + '"]';
  }
  function kn(e) {
    return "script[async]" + e;
  }
  function hm(e, t, l) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var a = e.querySelector(
            'style[data-href~="' + Ct(l.href) + '"]'
          );
          if (a)
            return t.instance = a, Je(a), a;
          var n = j({}, l, {
            "data-href": l.href,
            "data-precedence": l.precedence,
            href: null,
            precedence: null
          });
          return a = (e.ownerDocument || e).createElement(
            "style"
          ), Je(a), lt(a, "style", n), ou(a, l.precedence, e), t.instance = a;
        case "stylesheet":
          n = Ja(l.href);
          var i = e.querySelector(
            Xn(n)
          );
          if (i)
            return t.state.loading |= 4, t.instance = i, Je(i), i;
          a = mm(l), (n = qt.get(n)) && Fc(a, n), i = (e.ownerDocument || e).createElement("link"), Je(i);
          var r = i;
          return r._p = new Promise(function(m, b) {
            r.onload = m, r.onerror = b;
          }), lt(i, "link", a), t.state.loading |= 4, ou(i, l.precedence, e), t.instance = i;
        case "script":
          return i = $a(l.src), (n = e.querySelector(
            kn(i)
          )) ? (t.instance = n, Je(n), n) : (a = l, (n = qt.get(i)) && (a = j({}, l), Wc(a, n)), e = e.ownerDocument || e, n = e.createElement("script"), Je(n), lt(n, "link", a), e.head.appendChild(n), t.instance = n);
        case "void":
          return null;
        default:
          throw Error(c(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (a = t.instance, t.state.loading |= 4, ou(a, l.precedence, e));
    return t.instance;
  }
  function ou(e, t, l) {
    for (var a = l.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), n = a.length ? a[a.length - 1] : null, i = n, r = 0; r < a.length; r++) {
      var m = a[r];
      if (m.dataset.precedence === t) i = m;
      else if (i !== n) break;
    }
    i ? i.parentNode.insertBefore(e, i.nextSibling) : (t = l.nodeType === 9 ? l.head : l, t.insertBefore(e, t.firstChild));
  }
  function Fc(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function Wc(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var fu = null;
  function pm(e, t, l) {
    if (fu === null) {
      var a = /* @__PURE__ */ new Map(), n = fu = /* @__PURE__ */ new Map();
      n.set(l, a);
    } else
      n = fu, a = n.get(l), a || (a = /* @__PURE__ */ new Map(), n.set(l, a));
    if (a.has(e)) return a;
    for (a.set(e, null), l = l.getElementsByTagName(e), n = 0; n < l.length; n++) {
      var i = l[n];
      if (!(i[nn] || i[Pe] || e === "link" && i.getAttribute("rel") === "stylesheet") && i.namespaceURI !== "http://www.w3.org/2000/svg") {
        var r = i.getAttribute(t) || "";
        r = e + r;
        var m = a.get(r);
        m ? m.push(i) : a.set(r, [i]);
      }
    }
    return a;
  }
  function vm(e, t, l) {
    e = e.ownerDocument || e, e.head.insertBefore(
      l,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function Lv(e, t, l) {
    if (l === 1 || t.itemProp != null) return !1;
    switch (e) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "")
          break;
        return !0;
      case "link":
        if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError)
          break;
        switch (t.rel) {
          case "stylesheet":
            return e = t.disabled, typeof t.precedence == "string" && e == null;
          default:
            return !0;
        }
      case "script":
        if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string")
          return !0;
    }
    return !1;
  }
  function gm(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function qv(e, t, l, a) {
    if (l.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && (l.state.loading & 4) === 0) {
      if (l.instance === null) {
        var n = Ja(a.href), i = t.querySelector(
          Xn(n)
        );
        if (i) {
          t = i._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = du.bind(e), t.then(e, e)), l.state.loading |= 4, l.instance = i, Je(i);
          return;
        }
        i = t.ownerDocument || t, a = mm(a), (n = qt.get(n)) && Fc(a, n), i = i.createElement("link"), Je(i);
        var r = i;
        r._p = new Promise(function(m, b) {
          r.onload = m, r.onerror = b;
        }), lt(i, "link", a), l.instance = i;
      }
      e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(l, t), (t = l.state.preload) && (l.state.loading & 3) === 0 && (e.count++, l = du.bind(e), t.addEventListener("load", l), t.addEventListener("error", l));
    }
  }
  var Pc = 0;
  function Yv(e, t) {
    return e.stylesheets && e.count === 0 && hu(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(l) {
      var a = setTimeout(function() {
        if (e.stylesheets && hu(e, e.stylesheets), e.unsuspend) {
          var i = e.unsuspend;
          e.unsuspend = null, i();
        }
      }, 6e4 + t);
      0 < e.imgBytes && Pc === 0 && (Pc = 62500 * xv());
      var n = setTimeout(
        function() {
          if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && hu(e, e.stylesheets), e.unsuspend)) {
            var i = e.unsuspend;
            e.unsuspend = null, i();
          }
        },
        (e.imgBytes > Pc ? 50 : 800) + t
      );
      return e.unsuspend = l, function() {
        e.unsuspend = null, clearTimeout(a), clearTimeout(n);
      };
    } : null;
  }
  function du() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) hu(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var mu = null;
  function hu(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, mu = /* @__PURE__ */ new Map(), t.forEach(Gv, e), mu = null, du.call(e));
  }
  function Gv(e, t) {
    if (!(t.state.loading & 4)) {
      var l = mu.get(e);
      if (l) var a = l.get(null);
      else {
        l = /* @__PURE__ */ new Map(), mu.set(e, l);
        for (var n = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), i = 0; i < n.length; i++) {
          var r = n[i];
          (r.nodeName === "LINK" || r.getAttribute("media") !== "not all") && (l.set(r.dataset.precedence, r), a = r);
        }
        a && l.set(null, a);
      }
      n = t.instance, r = n.getAttribute("data-precedence"), i = l.get(r) || a, i === a && l.set(null, n), l.set(r, n), this.count++, a = du.bind(this), n.addEventListener("load", a), n.addEventListener("error", a), i ? i.parentNode.insertBefore(n, i.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(n, e.firstChild)), t.state.loading |= 4;
    }
  }
  var Qn = {
    $$typeof: L,
    Provider: null,
    Consumer: null,
    _currentValue: Z,
    _currentValue2: Z,
    _threadCount: 0
  };
  function Xv(e, t, l, a, n, i, r, m, b) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Ku(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Ku(0), this.hiddenUpdates = Ku(null), this.identifierPrefix = a, this.onUncaughtError = n, this.onCaughtError = i, this.onRecoverableError = r, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = b, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function ym(e, t, l, a, n, i, r, m, b, z, O, B) {
    return e = new Xv(
      e,
      t,
      l,
      r,
      b,
      z,
      O,
      B,
      m
    ), t = 1, i === !0 && (t |= 24), i = St(3, null, null, t), e.current = i, i.stateNode = e, t = Cs(), t.refCount++, e.pooledCache = t, t.refCount++, i.memoizedState = {
      element: a,
      isDehydrated: l,
      cache: t
    }, ws(i), e;
  }
  function bm(e) {
    return e ? (e = Ta, e) : Ta;
  }
  function xm(e, t, l, a, n, i) {
    n = bm(n), a.context === null ? a.context = n : a.pendingContext = n, a = Al(t), a.payload = { element: l }, i = i === void 0 ? null : i, i !== null && (a.callback = i), l = zl(e, a, t), l !== null && (vt(l, e, t), Sn(l, e, t));
  }
  function _m(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var l = e.retryLane;
      e.retryLane = l !== 0 && l < t ? l : t;
    }
  }
  function Ic(e, t) {
    _m(e, t), (e = e.alternate) && _m(e, t);
  }
  function Sm(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Pl(e, 67108864);
      t !== null && vt(t, e, 67108864), Ic(e, 67108864);
    }
  }
  function jm(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = At();
      t = Ju(t);
      var l = Pl(e, t);
      l !== null && vt(l, e, t), Ic(e, t);
    }
  }
  var pu = !0;
  function kv(e, t, l, a) {
    var n = M.T;
    M.T = null;
    var i = q.p;
    try {
      q.p = 2, er(e, t, l, a);
    } finally {
      q.p = i, M.T = n;
    }
  }
  function Qv(e, t, l, a) {
    var n = M.T;
    M.T = null;
    var i = q.p;
    try {
      q.p = 8, er(e, t, l, a);
    } finally {
      q.p = i, M.T = n;
    }
  }
  function er(e, t, l, a) {
    if (pu) {
      var n = tr(a);
      if (n === null)
        Yc(
          e,
          t,
          a,
          vu,
          l
        ), Nm(e, a);
      else if (Vv(
        n,
        e,
        t,
        l,
        a
      ))
        a.stopPropagation();
      else if (Nm(e, a), t & 4 && -1 < Zv.indexOf(e)) {
        for (; n !== null; ) {
          var i = pa(n);
          if (i !== null)
            switch (i.tag) {
              case 3:
                if (i = i.stateNode, i.current.memoizedState.isDehydrated) {
                  var r = Kl(i.pendingLanes);
                  if (r !== 0) {
                    var m = i;
                    for (m.pendingLanes |= 2, m.entangledLanes |= 2; r; ) {
                      var b = 1 << 31 - xt(r);
                      m.entanglements[1] |= b, r &= ~b;
                    }
                    Pt(i), (xe & 6) === 0 && (Pi = yt() + 500, Ln(0));
                  }
                }
                break;
              case 31:
              case 13:
                m = Pl(i, 2), m !== null && vt(m, i, 2), eu(), Ic(i, 2);
            }
          if (i = tr(a), i === null && Yc(
            e,
            t,
            a,
            vu,
            l
          ), i === n) break;
          n = i;
        }
        n !== null && a.stopPropagation();
      } else
        Yc(
          e,
          t,
          a,
          null,
          l
        );
    }
  }
  function tr(e) {
    return e = as(e), lr(e);
  }
  var vu = null;
  function lr(e) {
    if (vu = null, e = ha(e), e !== null) {
      var t = h(e);
      if (t === null) e = null;
      else {
        var l = t.tag;
        if (l === 13) {
          if (e = p(t), e !== null) return e;
          e = null;
        } else if (l === 31) {
          if (e = y(t), e !== null) return e;
          e = null;
        } else if (l === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return vu = e, null;
  }
  function Em(e) {
    switch (e) {
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
        switch (Rh()) {
          case Rr:
            return 2;
          case Cr:
            return 8;
          case ii:
          case Ch:
            return 32;
          case Or:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var ar = !1, ql = null, Yl = null, Gl = null, Zn = /* @__PURE__ */ new Map(), Vn = /* @__PURE__ */ new Map(), Xl = [], Zv = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function Nm(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        ql = null;
        break;
      case "dragenter":
      case "dragleave":
        Yl = null;
        break;
      case "mouseover":
      case "mouseout":
        Gl = null;
        break;
      case "pointerover":
      case "pointerout":
        Zn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Vn.delete(t.pointerId);
    }
  }
  function Kn(e, t, l, a, n, i) {
    return e === null || e.nativeEvent !== i ? (e = {
      blockedOn: t,
      domEventName: l,
      eventSystemFlags: a,
      nativeEvent: i,
      targetContainers: [n]
    }, t !== null && (t = pa(t), t !== null && Sm(t)), e) : (e.eventSystemFlags |= a, t = e.targetContainers, n !== null && t.indexOf(n) === -1 && t.push(n), e);
  }
  function Vv(e, t, l, a, n) {
    switch (t) {
      case "focusin":
        return ql = Kn(
          ql,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "dragenter":
        return Yl = Kn(
          Yl,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "mouseover":
        return Gl = Kn(
          Gl,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "pointerover":
        var i = n.pointerId;
        return Zn.set(
          i,
          Kn(
            Zn.get(i) || null,
            e,
            t,
            l,
            a,
            n
          )
        ), !0;
      case "gotpointercapture":
        return i = n.pointerId, Vn.set(
          i,
          Kn(
            Vn.get(i) || null,
            e,
            t,
            l,
            a,
            n
          )
        ), !0;
    }
    return !1;
  }
  function Tm(e) {
    var t = ha(e.target);
    if (t !== null) {
      var l = h(t);
      if (l !== null) {
        if (t = l.tag, t === 13) {
          if (t = p(l), t !== null) {
            e.blockedOn = t, Lr(e.priority, function() {
              jm(l);
            });
            return;
          }
        } else if (t === 31) {
          if (t = y(l), t !== null) {
            e.blockedOn = t, Lr(e.priority, function() {
              jm(l);
            });
            return;
          }
        } else if (t === 3 && l.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = l.tag === 3 ? l.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function gu(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var l = tr(e.nativeEvent);
      if (l === null) {
        l = e.nativeEvent;
        var a = new l.constructor(
          l.type,
          l
        );
        ls = a, l.target.dispatchEvent(a), ls = null;
      } else
        return t = pa(l), t !== null && Sm(t), e.blockedOn = l, !1;
      t.shift();
    }
    return !0;
  }
  function Am(e, t, l) {
    gu(e) && l.delete(t);
  }
  function Kv() {
    ar = !1, ql !== null && gu(ql) && (ql = null), Yl !== null && gu(Yl) && (Yl = null), Gl !== null && gu(Gl) && (Gl = null), Zn.forEach(Am), Vn.forEach(Am);
  }
  function yu(e, t) {
    e.blockedOn === t && (e.blockedOn = null, ar || (ar = !0, u.unstable_scheduleCallback(
      u.unstable_NormalPriority,
      Kv
    )));
  }
  var bu = null;
  function zm(e) {
    bu !== e && (bu = e, u.unstable_scheduleCallback(
      u.unstable_NormalPriority,
      function() {
        bu === e && (bu = null);
        for (var t = 0; t < e.length; t += 3) {
          var l = e[t], a = e[t + 1], n = e[t + 2];
          if (typeof a != "function") {
            if (lr(a || l) === null)
              continue;
            break;
          }
          var i = pa(l);
          i !== null && (e.splice(t, 3), t -= 3, tc(
            i,
            {
              pending: !0,
              data: n,
              method: l.method,
              action: a
            },
            a,
            n
          ));
        }
      }
    ));
  }
  function Fa(e) {
    function t(b) {
      return yu(b, e);
    }
    ql !== null && yu(ql, e), Yl !== null && yu(Yl, e), Gl !== null && yu(Gl, e), Zn.forEach(t), Vn.forEach(t);
    for (var l = 0; l < Xl.length; l++) {
      var a = Xl[l];
      a.blockedOn === e && (a.blockedOn = null);
    }
    for (; 0 < Xl.length && (l = Xl[0], l.blockedOn === null); )
      Tm(l), l.blockedOn === null && Xl.shift();
    if (l = (e.ownerDocument || e).$$reactFormReplay, l != null)
      for (a = 0; a < l.length; a += 3) {
        var n = l[a], i = l[a + 1], r = n[ot] || null;
        if (typeof i == "function")
          r || zm(l);
        else if (r) {
          var m = null;
          if (i && i.hasAttribute("formAction")) {
            if (n = i, r = i[ot] || null)
              m = r.formAction;
            else if (lr(n) !== null) continue;
          } else m = r.action;
          typeof m == "function" ? l[a + 1] = m : (l.splice(a, 3), a -= 3), zm(l);
        }
      }
  }
  function Mm() {
    function e(i) {
      i.canIntercept && i.info === "react-transition" && i.intercept({
        handler: function() {
          return new Promise(function(r) {
            return n = r;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function t() {
      n !== null && (n(), n = null), a || setTimeout(l, 20);
    }
    function l() {
      if (!a && !navigation.transition) {
        var i = navigation.currentEntry;
        i && i.url != null && navigation.navigate(i.url, {
          state: i.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var a = !1, n = null;
      return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(l, 100), function() {
        a = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), n !== null && (n(), n = null);
      };
    }
  }
  function nr(e) {
    this._internalRoot = e;
  }
  xu.prototype.render = nr.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(c(409));
    var l = t.current, a = At();
    xm(l, a, e, t, null, null);
  }, xu.prototype.unmount = nr.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      xm(e.current, 2, null, e, null, null), eu(), t[ma] = null;
    }
  };
  function xu(e) {
    this._internalRoot = e;
  }
  xu.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Br();
      e = { blockedOn: null, target: e, priority: t };
      for (var l = 0; l < Xl.length && t !== 0 && t < Xl[l].priority; l++) ;
      Xl.splice(l, 0, e), l === 0 && Tm(e);
    }
  };
  var Rm = o.version;
  if (Rm !== "19.2.8")
    throw Error(
      c(
        527,
        Rm,
        "19.2.8"
      )
    );
  q.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(c(188)) : (e = Object.keys(e).join(","), Error(c(268, e)));
    return e = v(t), e = e !== null ? x(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var Jv = {
    bundleType: 0,
    version: "19.2.8",
    rendererPackageName: "react-dom",
    currentDispatcherRef: M,
    reconcilerVersion: "19.2.8"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var _u = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!_u.isDisabled && _u.supportsFiber)
      try {
        tn = _u.inject(
          Jv
        ), bt = _u;
      } catch {
      }
  }
  return $n.createRoot = function(e, t) {
    if (!d(e)) throw Error(c(299));
    var l = !1, a = "", n = Bf, i = Lf, r = qf;
    return t != null && (t.unstable_strictMode === !0 && (l = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (n = t.onUncaughtError), t.onCaughtError !== void 0 && (i = t.onCaughtError), t.onRecoverableError !== void 0 && (r = t.onRecoverableError)), t = ym(
      e,
      1,
      !1,
      null,
      null,
      l,
      a,
      null,
      n,
      i,
      r,
      Mm
    ), e[ma] = t.current, qc(e), new nr(t);
  }, $n.hydrateRoot = function(e, t, l) {
    if (!d(e)) throw Error(c(299));
    var a = !1, n = "", i = Bf, r = Lf, m = qf, b = null;
    return l != null && (l.unstable_strictMode === !0 && (a = !0), l.identifierPrefix !== void 0 && (n = l.identifierPrefix), l.onUncaughtError !== void 0 && (i = l.onUncaughtError), l.onCaughtError !== void 0 && (r = l.onCaughtError), l.onRecoverableError !== void 0 && (m = l.onRecoverableError), l.formState !== void 0 && (b = l.formState)), t = ym(
      e,
      1,
      !0,
      t,
      l ?? null,
      a,
      n,
      b,
      i,
      r,
      m,
      Mm
    ), t.context = bm(null), l = t.current, a = At(), a = Ju(a), n = Al(a), n.callback = null, zl(l, n, a), l = a, t.current.lanes = l, an(t, l), Pt(t), e[ma] = t.current, qc(e), new xu(t);
  }, $n.version = "19.2.8", $n;
}
var Ym;
function ug() {
  if (Ym) return sr.exports;
  Ym = 1;
  function u() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u);
      } catch (o) {
        console.error(o);
      }
  }
  return u(), sr.exports = ig(), sr.exports;
}
var sg = ug();
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
var yr = /^(?:[a-z][a-z0-9+.-]*:|[\\/]{2})/i, nh = /^[\\/]{2}/;
function cg(u, o) {
  return o + u.replace(/\\/g, "/");
}
var Gm = "popstate";
function Xm(u) {
  return typeof u == "object" && u != null && "pathname" in u && "search" in u && "hash" in u && "state" in u && "key" in u;
}
function rg(u = {}) {
  function o(d, h) {
    let {
      pathname: p = "/",
      search: y = "",
      hash: g = ""
    } = da(d.location.hash.substring(1));
    return !p.startsWith("/") && !p.startsWith(".") && (p = "/" + p), hr(
      "",
      { pathname: p, search: y, hash: g },
      // state defaults to `null` because `window.history.state` does
      h.state && h.state.usr || null,
      h.state && h.state.key || "default"
    );
  }
  function f(d, h) {
    let p = d.document.querySelector("base"), y = "";
    if (p && p.getAttribute("href")) {
      let g = d.location.href, v = g.indexOf("#");
      y = v === -1 ? g : g.slice(0, v);
    }
    return y + "#" + (typeof h == "string" ? h : ei(h));
  }
  function c(d, h) {
    zt(
      d.pathname.charAt(0) === "/",
      `relative pathnames are not supported in hash history.push(${JSON.stringify(
        h
      )})`
    );
  }
  return fg(
    o,
    f,
    c,
    u
  );
}
function Ue(u, o) {
  if (u === !1 || u === null || typeof u > "u")
    throw new Error(o);
}
function zt(u, o) {
  if (!u) {
    typeof console < "u" && console.warn(o);
    try {
      throw new Error(o);
    } catch {
    }
  }
}
function og() {
  return Math.random().toString(36).substring(2, 10);
}
function km(u, o) {
  return {
    usr: u.state,
    key: u.key,
    idx: o,
    masked: u.mask ? {
      pathname: u.pathname,
      search: u.search,
      hash: u.hash
    } : void 0
  };
}
function hr(u, o, f = null, c, d) {
  return {
    pathname: typeof u == "string" ? u : u.pathname,
    search: "",
    hash: "",
    ...typeof o == "string" ? da(o) : o,
    state: f,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: o && o.key || c || og(),
    mask: d
  };
}
function ei({
  pathname: u = "/",
  search: o = "",
  hash: f = ""
}) {
  return o && o !== "?" && (u += o.charAt(0) === "?" ? o : "?" + o), f && f !== "#" && (u += f.charAt(0) === "#" ? f : "#" + f), u;
}
function da(u) {
  let o = {};
  if (u) {
    let f = u.indexOf("#");
    f >= 0 && (o.hash = u.substring(f), u = u.substring(0, f));
    let c = u.indexOf("?");
    c >= 0 && (o.search = u.substring(c), u = u.substring(0, c)), u && (o.pathname = u);
  }
  return o;
}
function fg(u, o, f, c = {}) {
  let { window: d = document.defaultView, v5Compat: h = !1 } = c, p = d.history, y = "POP", g = null, v = x();
  v == null && (v = 0, p.replaceState({ ...p.state, idx: v }, ""));
  function x() {
    return (p.state || { idx: null }).idx;
  }
  function j() {
    y = "POP";
    let D = x(), Q = D == null ? null : D - v;
    v = D, g && g({ action: y, location: G.location, delta: Q });
  }
  function T(D, Q) {
    y = "PUSH";
    let V = Xm(D) ? D : hr(G.location, D, Q);
    f && f(V, D), v = x() + 1;
    let L = km(V, v), ae = G.createHref(V.mask || V);
    try {
      p.pushState(L, "", ae);
    } catch (ne) {
      if (ne instanceof DOMException && ne.name === "DataCloneError")
        throw ne;
      d.location.assign(ae);
    }
    h && g && g({ action: y, location: G.location, delta: 1 });
  }
  function Y(D, Q) {
    y = "REPLACE";
    let V = Xm(D) ? D : hr(G.location, D, Q);
    f && f(V, D), v = x();
    let L = km(V, v), ae = G.createHref(V.mask || V);
    p.replaceState(L, "", ae), h && g && g({ action: y, location: G.location, delta: 0 });
  }
  function X(D) {
    return dg(d, D);
  }
  let G = {
    get action() {
      return y;
    },
    get location() {
      return u(d, p);
    },
    listen(D) {
      if (g)
        throw new Error("A history only accepts one active listener");
      return d.addEventListener(Gm, j), g = D, () => {
        d.removeEventListener(Gm, j), g = null;
      };
    },
    createHref(D) {
      return o(d, D);
    },
    createURL: X,
    encodeLocation(D) {
      let Q = X(D);
      return {
        pathname: Q.pathname,
        search: Q.search,
        hash: Q.hash
      };
    },
    push: T,
    replace: Y,
    go(D) {
      return p.go(D);
    }
  };
  return G;
}
function dg(u, o, f = !1) {
  let c = "http://localhost";
  u && (c = u.location.origin !== "null" ? u.location.origin : u.location.href), Ue(c, "No window.location.(origin|href) available to create URL");
  let d = typeof o == "string" ? o : ei(o);
  return d = d.replace(/ $/, "%20"), !f && nh.test(d) && (d = c + d), new URL(d, c);
}
function ih(u, o, f = "/") {
  return mg(u, o, f, !1);
}
function mg(u, o, f, c, d) {
  let h = typeof o == "string" ? da(o) : o, p = yl(h.pathname || "/", f);
  if (p == null)
    return null;
  let y = hg(u), g = null, v = Ng(p);
  for (let x = 0; g == null && x < y.length; ++x)
    g = Eg(
      y[x],
      v,
      c
    );
  return g;
}
function hg(u) {
  let o = uh(u);
  return pg(o), o;
}
function uh(u, o = [], f = [], c = "", d = !1) {
  let h = (p, y, g = d, v) => {
    let x = {
      relativePath: v === void 0 ? p.path || "" : v,
      caseSensitive: p.caseSensitive === !0,
      childrenIndex: y,
      route: p
    };
    if (x.relativePath.startsWith("/")) {
      if (!x.relativePath.startsWith(c) && g)
        return;
      Ue(
        x.relativePath.startsWith(c),
        `Absolute route path "${x.relativePath}" nested under path "${c}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
      ), x.relativePath = x.relativePath.slice(c.length);
    }
    let j = Kt([c, x.relativePath]), T = f.concat(x);
    p.children && p.children.length > 0 && (Ue(
      // Our types know better, but runtime JS may not!
      // @ts-expect-error
      p.index !== !0,
      `Index routes must not have child routes. Please remove all child routes from route path "${j}".`
    ), uh(
      p.children,
      o,
      T,
      j,
      g
    )), !(p.path == null && !p.index) && o.push({
      path: j,
      score: Sg(j, p.index),
      routesMeta: T.map((Y, X) => {
        let [G, D] = rh(
          Y.relativePath,
          Y.caseSensitive,
          X === T.length - 1
        );
        return {
          ...Y,
          matcher: G,
          compiledParams: D
        };
      })
    });
  };
  return u.forEach((p, y) => {
    if (p.path === "" || !p.path?.includes("?"))
      h(p, y);
    else
      for (let g of sh(p.path))
        h(p, y, !0, g);
  }), o;
}
function sh(u) {
  let o = u.split("/");
  if (o.length === 0) return [];
  let [f, ...c] = o, d = f.endsWith("?"), h = f.replace(/\?$/, "");
  if (c.length === 0)
    return d ? [h, ""] : [h];
  let p = sh(c.join("/")), y = [];
  return y.push(
    ...p.map(
      (g) => g === "" ? h : [h, g].join("/")
    )
  ), d && y.push(...p), y.map(
    (g) => u.startsWith("/") && g === "" ? "/" : g
  );
}
function pg(u) {
  u.sort(
    (o, f) => o.score !== f.score ? f.score - o.score : jg(
      o.routesMeta.map((c) => c.childrenIndex),
      f.routesMeta.map((c) => c.childrenIndex)
    )
  );
}
var vg = /^:[\w-]+$/, gg = 3, yg = 2, bg = 1, xg = 10, _g = -2, Qm = (u) => u === "*";
function Sg(u, o) {
  let f = u.split("/"), c = f.length;
  return f.some(Qm) && (c += _g), o && (c += yg), f.filter((d) => !Qm(d)).reduce(
    (d, h) => d + (vg.test(h) ? gg : h === "" ? bg : xg),
    c
  );
}
function jg(u, o) {
  return u.length === o.length && u.slice(0, -1).every((c, d) => c === o[d]) ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    u[u.length - 1] - o[o.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function Eg(u, o, f = !1) {
  let { routesMeta: c } = u, d = {}, h = "/", p = [];
  for (let y = 0; y < c.length; ++y) {
    let g = c[y], v = y === c.length - 1, x = h === "/" ? o : o.slice(h.length) || "/", j = {
      path: g.relativePath,
      caseSensitive: g.caseSensitive,
      end: v
    }, T = (
      // Use precomputed matcher if it exists
      g.matcher && g.compiledParams ? ch(
        j,
        x,
        g.matcher,
        g.compiledParams
      ) : Ru(j, x)
    ), Y = g.route;
    if (!T && v && f && !c[c.length - 1].route.index && (T = Ru(
      {
        path: g.relativePath,
        caseSensitive: g.caseSensitive,
        end: !1
      },
      x
    )), !T)
      return null;
    Object.assign(d, T.params), p.push({
      // TODO: Can this as be avoided?
      params: d,
      pathname: Kt([h, T.pathname]),
      pathnameBase: zg(
        Kt([h, T.pathnameBase])
      ),
      route: Y
    }), T.pathnameBase !== "/" && (h = Kt([h, T.pathnameBase]));
  }
  return p;
}
function Ru(u, o) {
  typeof u == "string" && (u = { path: u, caseSensitive: !1, end: !0 });
  let [f, c] = rh(
    u.path,
    u.caseSensitive,
    u.end
  );
  return ch(u, o, f, c);
}
function ch(u, o, f, c) {
  let d = o.match(f);
  if (!d) return null;
  let h = d[0], p = h.replace(/(.)\/+$/, "$1"), y = d.slice(1);
  return {
    params: c.reduce(
      (v, { paramName: x, isOptional: j }, T) => {
        if (x === "*") {
          let X = y[T] || "";
          p = h.slice(0, h.length - X.length).replace(/(.)\/+$/, "$1");
        }
        const Y = y[T];
        return j && !Y ? v[x] = void 0 : v[x] = (Y || "").replace(/%2F/g, "/"), v;
      },
      {}
    ),
    pathname: h,
    pathnameBase: p,
    pattern: u
  };
}
function rh(u, o = !1, f = !0) {
  zt(
    u === "*" || !u.endsWith("*") || u.endsWith("/*"),
    `Route path "${u}" will be treated as if it were "${u.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${u.replace(/\*$/, "/*")}".`
  );
  let c = [], d = "^" + u.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(
    /\/:([\w-]+)(\?)?/g,
    (p, y, g, v, x) => {
      if (c.push({ paramName: y, isOptional: g != null }), g) {
        let j = x.charAt(v + p.length);
        return j && j !== "/" ? "/([^\\/]*)" : "(?:/([^\\/]*))?";
      }
      return "/([^\\/]+)";
    }
  ).replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
  return u.endsWith("*") ? (c.push({ paramName: "*" }), d += u === "*" || u === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$") : f ? d += "\\/*$" : u !== "" && u !== "/" && (d += "(?:(?=\\/|$))"), [new RegExp(d, o ? void 0 : "i"), c];
}
function Ng(u) {
  try {
    return u.split("/").map((o) => decodeURIComponent(o).replace(/\//g, "%2F")).join("/");
  } catch (o) {
    return zt(
      !1,
      `The URL path "${u}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${o}).`
    ), u;
  }
}
function yl(u, o) {
  if (o === "/") return u;
  if (!u.toLowerCase().startsWith(o.toLowerCase()))
    return null;
  let f = o.endsWith("/") ? o.length - 1 : o.length, c = u.charAt(f);
  return c && c !== "/" ? null : u.slice(f) || "/";
}
function Tg(u, o = "/") {
  let {
    pathname: f,
    search: c = "",
    hash: d = ""
  } = typeof u == "string" ? da(u) : u, h;
  return f ? (f = oh(f), f.startsWith("/") ? h = Zm(f.substring(1), "/") : h = Zm(f, o)) : h = o, {
    pathname: h,
    search: Mg(c),
    hash: Rg(d)
  };
}
function Zm(u, o) {
  let f = Cu(o).split("/");
  return u.split("/").forEach((d) => {
    d === ".." ? f.length > 1 && f.pop() : d !== "." && f.push(d);
  }), f.length > 1 ? f.join("/") : "/";
}
function fr(u, o, f, c) {
  return `Cannot include a '${u}' character in a manually specified \`to.${o}\` field [${JSON.stringify(
    c
  )}].  Please separate it out to the \`to.${f}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function Ag(u) {
  return u.filter(
    (o, f) => f === 0 || o.route.path && o.route.path.length > 0
  );
}
function br(u) {
  let o = Ag(u);
  return o.map(
    (f, c) => c === o.length - 1 ? f.pathname : f.pathnameBase
  );
}
function Uu(u, o, f, c = !1) {
  let d;
  typeof u == "string" ? d = da(u) : (d = { ...u }, Ue(
    !d.pathname || !d.pathname.includes("?"),
    fr("?", "pathname", "search", d)
  ), Ue(
    !d.pathname || !d.pathname.includes("#"),
    fr("#", "pathname", "hash", d)
  ), Ue(
    !d.search || !d.search.includes("#"),
    fr("#", "search", "hash", d)
  ));
  let h = u === "" || d.pathname === "", p = h ? "/" : d.pathname, y;
  if (p == null)
    y = f;
  else {
    let j = o.length - 1;
    if (!c && p.startsWith("..")) {
      let T = p.split("/");
      for (; T[0] === ".."; )
        T.shift(), j -= 1;
      d.pathname = T.join("/");
    }
    y = j >= 0 ? o[j] : "/";
  }
  let g = Tg(d, y), v = p && p !== "/" && p.endsWith("/"), x = (h || p === ".") && f.endsWith("/");
  return !g.pathname.endsWith("/") && (v || x) && (g.pathname += "/"), g;
}
var oh = (u) => u.replace(/[\\/]{2,}/g, "/"), Kt = (u) => oh(u.join("/")), Cu = (u) => u.replace(/\/+$/, ""), zg = (u) => Cu(u).replace(/^\/*/, "/"), Mg = (u) => !u || u === "?" ? "" : u.startsWith("?") ? u : "?" + u, Rg = (u) => !u || u === "#" ? "" : u.startsWith("#") ? u : "#" + u, Cg = class {
  constructor(u, o, f, c = !1) {
    this.status = u, this.statusText = o || "", this.internal = c, f instanceof Error ? (this.data = f.toString(), this.error = f) : this.data = f;
  }
};
function Og(u) {
  return u != null && typeof u.status == "number" && typeof u.statusText == "string" && typeof u.internal == "boolean" && "data" in u;
}
function Dg(u) {
  let o = u.map((f) => f.route.path).filter(Boolean);
  return Kt(o) || "/";
}
var fh = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
function dh(u, o) {
  let f = u;
  if (typeof f != "string" || !yr.test(f))
    return {
      absoluteURL: void 0,
      isExternal: !1,
      to: f
    };
  let c = f, d = !1;
  if (fh)
    try {
      let h = new URL(window.location.href), p = nh.test(f) ? new URL(cg(f, h.protocol)) : new URL(f), y = yl(p.pathname, o);
      p.origin === h.origin && y != null ? f = y + p.search + p.hash : d = !0;
    } catch {
      zt(
        !1,
        `<Link to="${f}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`
      );
    }
  return {
    absoluteURL: c,
    isExternal: d,
    to: f
  };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
var mh = [
  "POST",
  "PUT",
  "PATCH",
  "DELETE"
];
new Set(
  mh
);
var Ug = [
  "GET",
  ...mh
];
new Set(Ug);
var wg = [
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
function Hg(u) {
  try {
    return wg.includes(new URL(u).protocol);
  } catch {
    return !1;
  }
}
var Pa = E.createContext(null);
Pa.displayName = "DataRouter";
var wu = E.createContext(null);
wu.displayName = "DataRouterState";
var hh = E.createContext(!1);
function Bg() {
  return E.useContext(hh);
}
var ph = E.createContext({
  isTransitioning: !1
});
ph.displayName = "ViewTransition";
var Lg = E.createContext(
  /* @__PURE__ */ new Map()
);
Lg.displayName = "Fetchers";
var qg = E.createContext(null);
qg.displayName = "Await";
var Mt = E.createContext(
  null
);
Mt.displayName = "Navigation";
var li = E.createContext(
  null
);
li.displayName = "Location";
var It = E.createContext({
  outlet: null,
  matches: [],
  isDataRoute: !1
});
It.displayName = "Route";
var xr = E.createContext(null);
xr.displayName = "RouteError";
var vh = "REACT_ROUTER_ERROR", Yg = "REDIRECT", Gg = "ROUTE_ERROR_RESPONSE";
function Xg(u) {
  if (u.startsWith(`${vh}:${Yg}:{`))
    try {
      let o = JSON.parse(u.slice(28));
      if (typeof o == "object" && o && typeof o.status == "number" && typeof o.statusText == "string" && typeof o.location == "string" && typeof o.reloadDocument == "boolean" && typeof o.replace == "boolean")
        return o;
    } catch {
    }
}
function kg(u) {
  if (u.startsWith(
    `${vh}:${Gg}:{`
  ))
    try {
      let o = JSON.parse(u.slice(40));
      if (typeof o == "object" && o && typeof o.status == "number" && typeof o.statusText == "string")
        return new Cg(
          o.status,
          o.statusText,
          o.data
        );
    } catch {
    }
}
function Qg(u, { relative: o } = {}) {
  Ue(
    Ia(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useHref() may be used only in the context of a <Router> component."
  );
  let { basename: f, navigator: c } = E.useContext(Mt), { hash: d, pathname: h, search: p } = ai(u, { relative: o }), y = h;
  return f !== "/" && (y = h === "/" ? f : Kt([f, h])), c.createHref({ pathname: y, search: p, hash: d });
}
function Ia() {
  return E.useContext(li) != null;
}
function kt() {
  return Ue(
    Ia(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useLocation() may be used only in the context of a <Router> component."
  ), E.useContext(li).location;
}
var gh = "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function yh(u) {
  E.useContext(Mt).static || E.useLayoutEffect(u);
}
function Zl() {
  let { isDataRoute: u } = E.useContext(It);
  return u ? ay() : Zg();
}
function Zg() {
  Ue(
    Ia(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useNavigate() may be used only in the context of a <Router> component."
  );
  let u = E.useContext(Pa), { basename: o, navigator: f } = E.useContext(Mt), { matches: c } = E.useContext(It), { pathname: d } = kt(), h = JSON.stringify(br(c)), p = E.useRef(!1);
  return yh(() => {
    p.current = !0;
  }), E.useCallback(
    (g, v = {}) => {
      if (zt(p.current, gh), !p.current) return;
      if (typeof g == "number") {
        f.go(g);
        return;
      }
      let x = Uu(
        g,
        JSON.parse(h),
        d,
        v.relative === "path"
      );
      u == null && o !== "/" && (x.pathname = x.pathname === "/" ? o : Kt([o, x.pathname])), (v.replace ? f.replace : f.push)(
        x,
        v.state,
        v
      );
    },
    [
      o,
      f,
      h,
      d,
      u
    ]
  );
}
E.createContext(null);
function ai(u, { relative: o } = {}) {
  let { matches: f } = E.useContext(It), { pathname: c } = kt(), d = JSON.stringify(br(f));
  return E.useMemo(
    () => Uu(
      u,
      JSON.parse(d),
      c,
      o === "path"
    ),
    [u, d, c, o]
  );
}
function Vg(u, o) {
  return bh(u, o);
}
function bh(u, o, f) {
  Ue(
    Ia(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useRoutes() may be used only in the context of a <Router> component."
  );
  let { navigator: c } = E.useContext(Mt), { matches: d } = E.useContext(It), h = d[d.length - 1], p = h ? h.params : {}, y = h ? h.pathname : "/", g = h ? h.pathnameBase : "/", v = h && h.route;
  {
    let D = v && v.path || "";
    _h(
      y,
      !v || D.endsWith("*") || D.endsWith("*?"),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${y}" (under <Route path="${D}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${D}"> to <Route path="${D === "/" ? "*" : `${D}/*`}">.`
    );
  }
  let x = kt(), j;
  if (o) {
    let D = typeof o == "string" ? da(o) : o;
    Ue(
      g === "/" || D.pathname?.startsWith(g),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${g}" but pathname "${D.pathname}" was given in the \`location\` prop.`
    ), j = D;
  } else
    j = x;
  let T = j.pathname || "/", Y = T;
  if (g !== "/") {
    let D = g.replace(/^\//, "").split("/");
    Y = "/" + T.replace(/^\//, "").split("/").slice(D.length).join("/");
  }
  let X = f && f.state.matches.length ? (
    // If we're in a data router, use the matches we've already identified but ensure
    // we have the latest route instances from the manifest in case elements have changed
    f.state.matches.map(
      (D) => Object.assign(D, {
        route: f.manifest[D.route.id] || D.route
      })
    )
  ) : ih(u, { pathname: Y });
  zt(
    v || X != null,
    `No routes matched location "${j.pathname}${j.search}${j.hash}" `
  ), zt(
    X == null || X[X.length - 1].route.element !== void 0 || X[X.length - 1].route.Component !== void 0 || X[X.length - 1].route.lazy !== void 0,
    `Matched leaf route at location "${j.pathname}${j.search}${j.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`
  );
  let G = Wg(
    X && X.map(
      (D) => Object.assign({}, D, {
        params: Object.assign({}, p, D.params),
        pathname: Kt([
          g,
          // Re-encode pathnames that were decoded inside matchRoutes.
          // Pre-encode `%`, `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          c.encodeLocation ? c.encodeLocation(
            D.pathname.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : D.pathname
        ]),
        pathnameBase: D.pathnameBase === "/" ? g : Kt([
          g,
          // Re-encode pathnames that were decoded inside matchRoutes
          // Pre-encode `%`, `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          c.encodeLocation ? c.encodeLocation(
            D.pathnameBase.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : D.pathnameBase
        ])
      })
    ),
    d,
    f
  );
  return o && G ? /* @__PURE__ */ E.createElement(
    li.Provider,
    {
      value: {
        location: {
          pathname: "/",
          search: "",
          hash: "",
          state: null,
          key: "default",
          mask: void 0,
          ...j
        },
        navigationType: "POP"
        /* Pop */
      }
    },
    G
  ) : G;
}
function Kg() {
  let u = ly(), o = Og(u) ? `${u.status} ${u.statusText}` : u instanceof Error ? u.message : JSON.stringify(u), f = u instanceof Error ? u.stack : null, c = "rgba(200,200,200, 0.5)", d = { padding: "0.5rem", backgroundColor: c }, h = { padding: "2px 4px", backgroundColor: c }, p = null;
  return console.error(
    "Error handled by React Router default ErrorBoundary:",
    u
  ), p = /* @__PURE__ */ E.createElement(E.Fragment, null, /* @__PURE__ */ E.createElement("p", null, "💿 Hey developer 👋"), /* @__PURE__ */ E.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /* @__PURE__ */ E.createElement("code", { style: h }, "ErrorBoundary"), " or", " ", /* @__PURE__ */ E.createElement("code", { style: h }, "errorElement"), " prop on your route.")), /* @__PURE__ */ E.createElement(E.Fragment, null, /* @__PURE__ */ E.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ E.createElement("h3", { style: { fontStyle: "italic" } }, o), f ? /* @__PURE__ */ E.createElement("pre", { style: d }, f) : null, p);
}
var Jg = /* @__PURE__ */ E.createElement(Kg, null), xh = class extends E.Component {
  constructor(u) {
    super(u), this.state = {
      location: u.location,
      revalidation: u.revalidation,
      error: u.error
    };
  }
  static getDerivedStateFromError(u) {
    return { error: u };
  }
  static getDerivedStateFromProps(u, o) {
    return o.location !== u.location || o.revalidation !== "idle" && u.revalidation === "idle" ? {
      error: u.error,
      location: u.location,
      revalidation: u.revalidation
    } : {
      error: u.error !== void 0 ? u.error : o.error,
      location: o.location,
      revalidation: u.revalidation || o.revalidation
    };
  }
  componentDidCatch(u, o) {
    this.props.onError ? this.props.onError(u, o) : console.error(
      "React Router caught the following error during render",
      u
    );
  }
  render() {
    let u = this.state.error;
    if (this.context && typeof u == "object" && u && "digest" in u && typeof u.digest == "string") {
      const f = kg(u.digest);
      f && (u = f);
    }
    let o = u !== void 0 ? /* @__PURE__ */ E.createElement(It.Provider, { value: this.props.routeContext }, /* @__PURE__ */ E.createElement(
      xr.Provider,
      {
        value: u,
        children: this.props.component
      }
    )) : this.props.children;
    return this.context ? /* @__PURE__ */ E.createElement($g, { error: u }, o) : o;
  }
};
xh.contextType = hh;
var dr = /* @__PURE__ */ new WeakMap();
function $g({
  children: u,
  error: o
}) {
  let { basename: f } = E.useContext(Mt);
  if (typeof o == "object" && o && "digest" in o && typeof o.digest == "string") {
    let c = Xg(o.digest);
    if (c) {
      let d = dr.get(o);
      if (d) throw d;
      let h = dh(c.location, f), p = h.absoluteURL || h.to;
      if (Hg(p))
        throw new Error("Invalid redirect location");
      if (fh && !dr.get(o))
        if (h.isExternal || c.reloadDocument)
          window.location.href = p;
        else {
          const y = Promise.resolve().then(
            () => window.__reactRouterDataRouter.navigate(h.to, {
              replace: c.replace
            })
          );
          throw dr.set(o, y), y;
        }
      return /* @__PURE__ */ E.createElement("meta", { httpEquiv: "refresh", content: `0;url=${p}` });
    }
  }
  return u;
}
function Fg({ routeContext: u, match: o, children: f }) {
  let c = E.useContext(Pa);
  return c && c.static && c.staticContext && (o.route.errorElement || o.route.ErrorBoundary) && (c.staticContext._deepestRenderedBoundaryId = o.route.id), /* @__PURE__ */ E.createElement(It.Provider, { value: u }, f);
}
function Wg(u, o = [], f) {
  let c = f?.state;
  if (u == null) {
    if (!c)
      return null;
    if (c.errors)
      u = c.matches;
    else if (o.length === 0 && !c.initialized && c.matches.length > 0)
      u = c.matches;
    else
      return null;
  }
  let d = u, h = c?.errors;
  if (h != null) {
    let x = d.findIndex(
      (j) => j.route.id && h?.[j.route.id] !== void 0
    );
    Ue(
      x >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(
        h
      ).join(",")}`
    ), d = d.slice(
      0,
      Math.min(d.length, x + 1)
    );
  }
  let p = !1, y = -1;
  if (f && c) {
    p = c.renderFallback;
    for (let x = 0; x < d.length; x++) {
      let j = d[x];
      if ((j.route.HydrateFallback || j.route.hydrateFallbackElement) && (y = x), j.route.id) {
        let { loaderData: T, errors: Y } = c, X = j.route.loader && !T.hasOwnProperty(j.route.id) && (!Y || Y[j.route.id] === void 0);
        if (j.route.lazy || X) {
          f.isStatic && (p = !0), y >= 0 ? d = d.slice(0, y + 1) : d = [d[0]];
          break;
        }
      }
    }
  }
  let g = f?.onError, v = c && g ? (x, j) => {
    g(x, {
      location: c.location,
      params: c.matches?.[0]?.params ?? {},
      pattern: Dg(c.matches),
      errorInfo: j
    });
  } : void 0;
  return d.reduceRight(
    (x, j, T) => {
      let Y, X = !1, G = null, D = null;
      c && (Y = h && j.route.id ? h[j.route.id] : void 0, G = j.route.errorElement || Jg, p && (y < 0 && T === 0 ? (_h(
        "route-fallback",
        !1,
        "No `HydrateFallback` element provided to render during initial hydration"
      ), X = !0, D = null) : y === T && (X = !0, D = j.route.hydrateFallbackElement || null)));
      let Q = o.concat(d.slice(0, T + 1)), V = () => {
        let L;
        return Y ? L = G : X ? L = D : j.route.Component ? L = /* @__PURE__ */ E.createElement(j.route.Component, null) : j.route.element ? L = j.route.element : L = x, /* @__PURE__ */ E.createElement(
          Fg,
          {
            match: j,
            routeContext: {
              outlet: x,
              matches: Q,
              isDataRoute: c != null
            },
            children: L
          }
        );
      };
      return c && (j.route.ErrorBoundary || j.route.errorElement || T === 0) ? /* @__PURE__ */ E.createElement(
        xh,
        {
          location: c.location,
          revalidation: c.revalidation,
          component: G,
          error: Y,
          children: V(),
          routeContext: { outlet: null, matches: Q, isDataRoute: !0 },
          onError: v
        }
      ) : V();
    },
    null
  );
}
function _r(u) {
  return `${u} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function Pg(u) {
  let o = E.useContext(Pa);
  return Ue(o, _r(u)), o;
}
function Ig(u) {
  let o = E.useContext(wu);
  return Ue(o, _r(u)), o;
}
function ey(u) {
  let o = E.useContext(It);
  return Ue(o, _r(u)), o;
}
function Sr(u) {
  let o = ey(u), f = o.matches[o.matches.length - 1];
  return Ue(
    f.route.id,
    `${u} can only be used on routes that contain a unique "id"`
  ), f.route.id;
}
function ty() {
  return Sr(
    "useRouteId"
    /* UseRouteId */
  );
}
function ly() {
  let u = E.useContext(xr), o = Ig(
    "useRouteError"
    /* UseRouteError */
  ), f = Sr(
    "useRouteError"
    /* UseRouteError */
  );
  return u !== void 0 ? u : o.errors?.[f];
}
function ay() {
  let { router: u } = Pg(
    "useNavigate"
    /* UseNavigateStable */
  ), o = Sr(
    "useNavigate"
    /* UseNavigateStable */
  ), f = E.useRef(!1);
  return yh(() => {
    f.current = !0;
  }), E.useCallback(
    async (d, h = {}) => {
      zt(f.current, gh), f.current && (typeof d == "number" ? await u.navigate(d) : await u.navigate(d, { fromRouteId: o, ...h }));
    },
    [u, o]
  );
}
var Vm = {};
function _h(u, o, f) {
  !o && !Vm[u] && (Vm[u] = !0, zt(!1, f));
}
E.memo(ny);
function ny({
  routes: u,
  manifest: o,
  future: f,
  state: c,
  isStatic: d,
  onError: h
}) {
  return bh(u, void 0, {
    manifest: o,
    state: c,
    isStatic: d,
    onError: h
  });
}
function ju({
  to: u,
  replace: o,
  state: f,
  relative: c
}) {
  Ue(
    Ia(),
    // TODO: This error is probably because they somehow have 2 versions of
    // the router loaded. We can help them understand how to avoid that.
    "<Navigate> may be used only in the context of a <Router> component."
  );
  let { static: d } = E.useContext(Mt);
  zt(
    !d,
    "<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change."
  );
  let { matches: h } = E.useContext(It), { pathname: p } = kt(), y = Zl(), g = Uu(
    u,
    br(h),
    p,
    c === "path"
  ), v = JSON.stringify(g);
  return E.useEffect(() => {
    y(JSON.parse(v), { replace: o, state: f, relative: c });
  }, [y, v, c, o, f]), null;
}
function De(u) {
  Ue(
    !1,
    "A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>."
  );
}
function iy({
  basename: u = "/",
  children: o = null,
  location: f,
  navigationType: c = "POP",
  navigator: d,
  static: h = !1,
  useTransitions: p
}) {
  Ue(
    !Ia(),
    "You cannot render a <Router> inside another <Router>. You should never have more than one in your app."
  );
  let y = u.replace(/^\/*/, "/"), g = E.useMemo(
    () => ({
      basename: y,
      navigator: d,
      static: h,
      useTransitions: p,
      future: {}
    }),
    [y, d, h, p]
  );
  typeof f == "string" && (f = da(f));
  let {
    pathname: v = "/",
    search: x = "",
    hash: j = "",
    state: T = null,
    key: Y = "default",
    mask: X
  } = f, G = E.useMemo(() => {
    let D = yl(v, y);
    return D == null ? null : {
      location: {
        pathname: D,
        search: x,
        hash: j,
        state: T,
        key: Y,
        mask: X
      },
      navigationType: c
    };
  }, [y, v, x, j, T, Y, c, X]);
  return zt(
    G != null,
    `<Router basename="${y}"> is not able to match the URL "${v}${x}${j}" because it does not start with the basename, so the <Router> won't render anything.`
  ), G == null ? null : /* @__PURE__ */ E.createElement(Mt.Provider, { value: g }, /* @__PURE__ */ E.createElement(li.Provider, { children: o, value: G }));
}
function uy({
  children: u,
  location: o
}) {
  return Vg(pr(u), o);
}
function pr(u, o = []) {
  let f = [];
  return E.Children.forEach(u, (c, d) => {
    if (!E.isValidElement(c))
      return;
    let h = [...o, d];
    if (c.type === E.Fragment) {
      f.push.apply(
        f,
        pr(c.props.children, h)
      );
      return;
    }
    Ue(
      c.type === De,
      `[${typeof c.type == "string" ? c.type : c.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`
    ), Ue(
      !c.props.index || !c.props.children,
      "An index route cannot have child routes."
    );
    let p = {
      id: c.props.id || h.join("-"),
      caseSensitive: c.props.caseSensitive,
      element: c.props.element,
      Component: c.props.Component,
      index: c.props.index,
      path: c.props.path,
      middleware: c.props.middleware,
      loader: c.props.loader,
      action: c.props.action,
      hydrateFallbackElement: c.props.hydrateFallbackElement,
      HydrateFallback: c.props.HydrateFallback,
      errorElement: c.props.errorElement,
      ErrorBoundary: c.props.ErrorBoundary,
      hasErrorBoundary: c.props.hasErrorBoundary === !0 || c.props.ErrorBoundary != null || c.props.errorElement != null,
      shouldRevalidate: c.props.shouldRevalidate,
      handle: c.props.handle,
      lazy: c.props.lazy
    };
    c.props.children && (p.children = pr(
      c.props.children,
      h
    )), f.push(p);
  }), f;
}
var Au = "get", zu = "application/x-www-form-urlencoded";
function Hu(u) {
  return typeof HTMLElement < "u" && u instanceof HTMLElement;
}
function sy(u) {
  return Hu(u) && u.tagName.toLowerCase() === "button";
}
function cy(u) {
  return Hu(u) && u.tagName.toLowerCase() === "form";
}
function ry(u) {
  return Hu(u) && u.tagName.toLowerCase() === "input";
}
function oy(u) {
  return !!(u.metaKey || u.altKey || u.ctrlKey || u.shiftKey);
}
function fy(u, o) {
  return u.button === 0 && // Ignore everything but left clicks
  (!o || o === "_self") && // Let browser handle "target=_blank" etc.
  !oy(u);
}
function vr(u = "") {
  return new URLSearchParams(
    typeof u == "string" || Array.isArray(u) || u instanceof URLSearchParams ? u : Object.keys(u).reduce((o, f) => {
      let c = u[f];
      return o.concat(
        Array.isArray(c) ? c.map((d) => [f, d]) : [[f, c]]
      );
    }, [])
  );
}
function dy(u, o) {
  let f = vr(u);
  return o && o.forEach((c, d) => {
    f.has(d) || o.getAll(d).forEach((h) => {
      f.append(d, h);
    });
  }), f;
}
var Eu = null;
function my() {
  if (Eu === null)
    try {
      new FormData(
        document.createElement("form"),
        // @ts-expect-error if FormData supports the submitter parameter, this will throw
        0
      ), Eu = !1;
    } catch {
      Eu = !0;
    }
  return Eu;
}
var hy = /* @__PURE__ */ new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
]);
function mr(u) {
  return u != null && !hy.has(u) ? (zt(
    !1,
    `"${u}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${zu}"`
  ), null) : u;
}
function py(u, o) {
  let f, c, d, h, p;
  if (cy(u)) {
    let y = u.getAttribute("action");
    c = y ? yl(y, o) : null, f = u.getAttribute("method") || Au, d = mr(u.getAttribute("enctype")) || zu, h = new FormData(u);
  } else if (sy(u) || ry(u) && (u.type === "submit" || u.type === "image")) {
    let y = u.form;
    if (y == null)
      throw new Error(
        'Cannot submit a <button> or <input type="submit"> without a <form>'
      );
    let g = u.getAttribute("formaction") || y.getAttribute("action");
    if (c = g ? yl(g, o) : null, f = u.getAttribute("formmethod") || y.getAttribute("method") || Au, d = mr(u.getAttribute("formenctype")) || mr(y.getAttribute("enctype")) || zu, h = new FormData(y, u), !my()) {
      let { name: v, type: x, value: j } = u;
      if (x === "image") {
        let T = v ? `${v}.` : "";
        h.append(`${T}x`, "0"), h.append(`${T}y`, "0");
      } else v && h.append(v, j);
    }
  } else {
    if (Hu(u))
      throw new Error(
        'Cannot submit element that is not <form>, <button>, or <input type="submit|image">'
      );
    f = Au, c = null, d = zu, p = u;
  }
  return h && d === "text/plain" && (p = h, h = void 0), { action: c, method: f.toLowerCase(), encType: d, formData: h, body: p };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function jr(u, o) {
  if (u === !1 || u === null || typeof u > "u")
    throw new Error(o);
}
function Sh(u, o, f, c) {
  let d = typeof u == "string" ? new URL(
    u,
    // This can be called during the SSR flow via PrefetchPageLinksImpl so
    // don't assume window is available
    typeof window > "u" ? "server://singlefetch/" : window.location.origin
  ) : u;
  return f ? d.pathname.endsWith("/") ? d.pathname = `${d.pathname}_.${c}` : d.pathname = `${d.pathname}.${c}` : d.pathname === "/" ? d.pathname = `_root.${c}` : o && yl(d.pathname, o) === "/" ? d.pathname = `${Cu(o)}/_root.${c}` : d.pathname = `${Cu(d.pathname)}.${c}`, d;
}
async function vy(u, o) {
  if (u.id in o)
    return o[u.id];
  try {
    let f = await import(
      /* @vite-ignore */
      /* webpackIgnore: true */
      u.module
    );
    return o[u.id] = f, f;
  } catch (f) {
    return console.error(
      `Error loading route module \`${u.module}\`, reloading page...`
    ), console.error(f), window.__reactRouterContext && window.__reactRouterContext.isSpaMode, window.location.reload(), new Promise(() => {
    });
  }
}
function gy(u) {
  return u == null ? !1 : u.href == null ? u.rel === "preload" && typeof u.imageSrcSet == "string" && typeof u.imageSizes == "string" : typeof u.rel == "string" && typeof u.href == "string";
}
async function yy(u, o, f) {
  let c = await Promise.all(
    u.map(async (d) => {
      let h = o.routes[d.route.id];
      if (h) {
        let p = await vy(h, f);
        return p.links ? p.links() : [];
      }
      return [];
    })
  );
  return Sy(
    c.flat(1).filter(gy).filter((d) => d.rel === "stylesheet" || d.rel === "preload").map(
      (d) => d.rel === "stylesheet" ? { ...d, rel: "prefetch", as: "style" } : { ...d, rel: "prefetch" }
    )
  );
}
function Km(u, o, f, c, d, h) {
  let p = (g, v) => f[v] ? g.route.id !== f[v].route.id : !0, y = (g, v) => (
    // param change, /users/123 -> /users/456
    f[v].pathname !== g.pathname || // splat param changed, which is not present in match.path
    // e.g. /files/images/avatar.jpg -> files/finances.xls
    f[v].route.path?.endsWith("*") && f[v].params["*"] !== g.params["*"]
  );
  return h === "assets" ? o.filter(
    (g, v) => p(g, v) || y(g, v)
  ) : h === "data" ? o.filter((g, v) => {
    let x = c.routes[g.route.id];
    if (!x || !x.hasLoader)
      return !1;
    if (p(g, v) || y(g, v))
      return !0;
    if (g.route.shouldRevalidate) {
      let j = g.route.shouldRevalidate({
        currentUrl: new URL(
          d.pathname + d.search + d.hash,
          window.origin
        ),
        currentParams: f[0]?.params || {},
        nextUrl: new URL(u, window.origin),
        nextParams: g.params,
        defaultShouldRevalidate: !0
      });
      if (typeof j == "boolean")
        return j;
    }
    return !0;
  }) : [];
}
function by(u, o, { includeHydrateFallback: f } = {}) {
  return xy(
    u.map((c) => {
      let d = o.routes[c.route.id];
      if (!d) return [];
      let h = [d.module];
      return d.clientActionModule && (h = h.concat(d.clientActionModule)), d.clientLoaderModule && (h = h.concat(d.clientLoaderModule)), f && d.hydrateFallbackModule && (h = h.concat(d.hydrateFallbackModule)), d.imports && (h = h.concat(d.imports)), h;
    }).flat(1)
  );
}
function xy(u) {
  return [...new Set(u)];
}
function _y(u) {
  let o = {}, f = Object.keys(u).sort();
  for (let c of f)
    o[c] = u[c];
  return o;
}
function Sy(u, o) {
  let f = /* @__PURE__ */ new Set();
  return new Set(o), u.reduce((c, d) => {
    let h = JSON.stringify(_y(d));
    return f.has(h) || (f.add(h), c.push({ key: h, link: d })), c;
  }, []);
}
function Er() {
  let u = E.useContext(Pa);
  return jr(
    u,
    "You must render this element inside a <DataRouterContext.Provider> element"
  ), u;
}
function jy() {
  let u = E.useContext(wu);
  return jr(
    u,
    "You must render this element inside a <DataRouterStateContext.Provider> element"
  ), u;
}
var Nr = E.createContext(void 0);
Nr.displayName = "FrameworkContext";
function Bu() {
  let u = E.useContext(Nr);
  return jr(
    u,
    "You must render this element inside a <HydratedRouter> element"
  ), u;
}
function Ey(u, o) {
  let f = E.useContext(Nr), [c, d] = E.useState(!1), [h, p] = E.useState(!1), { onFocus: y, onBlur: g, onMouseEnter: v, onMouseLeave: x, onTouchStart: j } = o, T = E.useRef(null);
  E.useEffect(() => {
    if (u === "render" && p(!0), u === "viewport") {
      let G = (Q) => {
        Q.forEach((V) => {
          p(V.isIntersecting);
        });
      }, D = new IntersectionObserver(G, { threshold: 0.5 });
      return T.current && D.observe(T.current), () => {
        D.disconnect();
      };
    }
  }, [u]), E.useEffect(() => {
    if (c) {
      let G = setTimeout(() => {
        p(!0);
      }, 100);
      return () => {
        clearTimeout(G);
      };
    }
  }, [c]);
  let Y = () => {
    d(!0);
  }, X = () => {
    d(!1), p(!1);
  };
  return f ? u !== "intent" ? [h, T, {}] : [
    h,
    T,
    {
      onFocus: Fn(y, Y),
      onBlur: Fn(g, X),
      onMouseEnter: Fn(v, Y),
      onMouseLeave: Fn(x, X),
      onTouchStart: Fn(j, Y)
    }
  ] : [!1, T, {}];
}
function Fn(u, o) {
  return (f) => {
    u && u(f), f.defaultPrevented || o(f);
  };
}
function Ny({ page: u, ...o }) {
  let f = Bg(), { nonce: c } = Bu(), { router: d } = Er(), h = E.useMemo(
    () => ih(d.routes, u, d.basename),
    [d.routes, u, d.basename]
  );
  return h ? (o.nonce == null && c && (o = { ...o, nonce: c }), f ? /* @__PURE__ */ E.createElement(Ay, { page: u, matches: h, ...o }) : /* @__PURE__ */ E.createElement(zy, { page: u, matches: h, ...o })) : null;
}
function Ty(u) {
  let { manifest: o, routeModules: f } = Bu(), [c, d] = E.useState([]);
  return E.useEffect(() => {
    let h = !1;
    return yy(u, o, f).then(
      (p) => {
        h || d(p);
      }
    ), () => {
      h = !0;
    };
  }, [u, o, f]), c;
}
function Ay({
  page: u,
  matches: o,
  ...f
}) {
  let c = kt(), { future: d } = Bu(), { basename: h } = Er(), p = E.useMemo(() => {
    if (u === c.pathname + c.search + c.hash)
      return [];
    let y = Sh(
      u,
      h,
      d.v8_trailingSlashAwareDataRequests,
      "rsc"
    ), g = !1, v = [];
    for (let x of o)
      typeof x.route.shouldRevalidate == "function" ? g = !0 : v.push(x.route.id);
    return g && v.length > 0 && y.searchParams.set("_routes", v.join(",")), [y.pathname + y.search];
  }, [
    h,
    d.v8_trailingSlashAwareDataRequests,
    u,
    c,
    o
  ]);
  return /* @__PURE__ */ E.createElement(E.Fragment, null, p.map((y) => /* @__PURE__ */ E.createElement("link", { key: y, rel: "prefetch", as: "fetch", href: y, ...f })));
}
function zy({
  page: u,
  matches: o,
  ...f
}) {
  let c = kt(), { future: d, manifest: h, routeModules: p } = Bu(), { basename: y } = Er(), { loaderData: g, matches: v } = jy(), x = E.useMemo(
    () => Km(
      u,
      o,
      v,
      h,
      c,
      "data"
    ),
    [u, o, v, h, c]
  ), j = E.useMemo(
    () => Km(
      u,
      o,
      v,
      h,
      c,
      "assets"
    ),
    [u, o, v, h, c]
  ), T = E.useMemo(() => {
    if (u === c.pathname + c.search + c.hash)
      return [];
    let G = /* @__PURE__ */ new Set(), D = !1;
    if (o.forEach((V) => {
      let L = h.routes[V.route.id];
      !L || !L.hasLoader || (!x.some((ae) => ae.route.id === V.route.id) && V.route.id in g && p[V.route.id]?.shouldRevalidate || L.hasClientLoader ? D = !0 : G.add(V.route.id));
    }), G.size === 0)
      return [];
    let Q = Sh(
      u,
      y,
      d.v8_trailingSlashAwareDataRequests,
      "data"
    );
    return D && G.size > 0 && Q.searchParams.set(
      "_routes",
      o.filter((V) => G.has(V.route.id)).map((V) => V.route.id).join(",")
    ), [Q.pathname + Q.search];
  }, [
    y,
    d.v8_trailingSlashAwareDataRequests,
    g,
    c,
    h,
    x,
    o,
    u,
    p
  ]), Y = E.useMemo(
    () => by(j, h),
    [j, h]
  ), X = Ty(j);
  return /* @__PURE__ */ E.createElement(E.Fragment, null, T.map((G) => /* @__PURE__ */ E.createElement("link", { key: G, rel: "prefetch", as: "fetch", href: G, ...f })), Y.map((G) => /* @__PURE__ */ E.createElement("link", { key: G, rel: "modulepreload", href: G, ...f })), X.map(({ key: G, link: D }) => (
    // these don't spread `linkProps` because they are full link descriptors
    // already with their own props
    /* @__PURE__ */ E.createElement(
      "link",
      {
        key: G,
        nonce: f.nonce,
        ...D,
        crossOrigin: D.crossOrigin ?? f.crossOrigin
      }
    )
  )));
}
function My(...u) {
  return (o) => {
    u.forEach((f) => {
      typeof f == "function" ? f(o) : f != null && (f.current = o);
    });
  };
}
var Ry = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
try {
  Ry && (window.__reactRouterVersion = // @ts-expect-error
  "7.18.2");
} catch {
}
function Cy({
  basename: u,
  children: o,
  useTransitions: f,
  window: c
}) {
  let d = E.useRef();
  d.current == null && (d.current = rg({ window: c, v5Compat: !0 }));
  let h = d.current, [p, y] = E.useState({
    action: h.action,
    location: h.location
  }), g = E.useCallback(
    (v) => {
      f === !1 ? y(v) : E.startTransition(() => y(v));
    },
    [f]
  );
  return E.useLayoutEffect(() => h.listen(g), [h, g]), /* @__PURE__ */ E.createElement(
    iy,
    {
      basename: u,
      children: o,
      location: p.location,
      navigationType: p.action,
      navigator: h,
      useTransitions: f
    }
  );
}
var Gt = E.forwardRef(
  function({
    onClick: o,
    discover: f = "render",
    prefetch: c = "none",
    relative: d,
    reloadDocument: h,
    replace: p,
    mask: y,
    state: g,
    target: v,
    to: x,
    preventScrollReset: j,
    viewTransition: T,
    defaultShouldRevalidate: Y,
    ...X
  }, G) {
    let { basename: D, navigator: Q, useTransitions: V } = E.useContext(Mt), L = typeof x == "string" && yr.test(x), ae = dh(x, D);
    x = ae.to;
    let ne = Qg(x, { relative: d }), ve = kt(), P = null;
    if (y) {
      let ee = Uu(
        y,
        [],
        ve.mask ? ve.mask.pathname : "/",
        !0
      );
      D !== "/" && (ee.pathname = ee.pathname === "/" ? D : Kt([D, ee.pathname])), P = Q.createHref(ee);
    }
    let [_e, we, it] = Ey(
      c,
      X
    ), We = Uy(x, {
      replace: p,
      mask: y,
      state: g,
      target: v,
      preventScrollReset: j,
      relative: d,
      viewTransition: T,
      defaultShouldRevalidate: Y,
      useTransitions: V
    });
    function Xe(ee) {
      o && o(ee), ee.defaultPrevented || We(ee);
    }
    let U = !(ae.isExternal || h), le = (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      /* @__PURE__ */ E.createElement(
        "a",
        {
          ...X,
          ...it,
          href: (U ? P : void 0) || ae.absoluteURL || ne,
          onClick: U ? Xe : o,
          ref: My(G, we),
          target: v,
          "data-discover": !L && f === "render" ? "true" : void 0
        }
      )
    );
    return _e && !L ? /* @__PURE__ */ E.createElement(E.Fragment, null, le, /* @__PURE__ */ E.createElement(Ny, { page: ne })) : le;
  }
);
Gt.displayName = "Link";
var Mu = E.forwardRef(
  function({
    "aria-current": o = "page",
    caseSensitive: f = !1,
    className: c = "",
    end: d = !1,
    style: h,
    to: p,
    viewTransition: y,
    children: g,
    ...v
  }, x) {
    let j = ai(p, { relative: v.relative }), T = kt(), Y = E.useContext(wu), { navigator: X, basename: G } = E.useContext(Mt), D = Y != null && // Conditional usage is OK here because the usage of a data router is static
    // eslint-disable-next-line react-hooks/rules-of-hooks
    Yy(j) && y === !0, Q = X.encodeLocation ? X.encodeLocation(j).pathname : j.pathname, V = T.pathname, L = Y && Y.navigation && Y.navigation.location ? Y.navigation.location.pathname : null;
    f || (V = V.toLowerCase(), L = L ? L.toLowerCase() : null, Q = Q.toLowerCase()), L && G && (L = yl(L, G) || L);
    const ae = Q !== "/" && Q.endsWith("/") ? Q.length - 1 : Q.length;
    let ne = V === Q || !d && V.startsWith(Q) && V.charAt(ae) === "/", ve = L != null && (L === Q || !d && L.startsWith(Q) && L.charAt(Q.length) === "/"), P = {
      isActive: ne,
      isPending: ve,
      isTransitioning: D
    }, _e = ne ? o : void 0, we;
    typeof c == "function" ? we = c(P) : we = [
      c,
      ne ? "active" : null,
      ve ? "pending" : null,
      D ? "transitioning" : null
    ].filter(Boolean).join(" ");
    let it = typeof h == "function" ? h(P) : h;
    return /* @__PURE__ */ E.createElement(
      Gt,
      {
        ...v,
        "aria-current": _e,
        className: we,
        ref: x,
        style: it,
        to: p,
        viewTransition: y
      },
      typeof g == "function" ? g(P) : g
    );
  }
);
Mu.displayName = "NavLink";
var Oy = E.forwardRef(
  ({
    discover: u = "render",
    fetcherKey: o,
    navigate: f,
    reloadDocument: c,
    replace: d,
    state: h,
    method: p = Au,
    action: y,
    onSubmit: g,
    relative: v,
    preventScrollReset: x,
    viewTransition: j,
    defaultShouldRevalidate: T,
    ...Y
  }, X) => {
    let { useTransitions: G } = E.useContext(Mt), D = Ly(), Q = qy(y, { relative: v }), V = p.toLowerCase() === "get" ? "get" : "post", L = typeof y == "string" && yr.test(y), ae = (ne) => {
      if (g && g(ne), ne.defaultPrevented) return;
      ne.preventDefault();
      let ve = ne.nativeEvent.submitter, P = ve?.getAttribute("formmethod") || p, _e = () => D(ve || ne.currentTarget, {
        fetcherKey: o,
        method: P,
        navigate: f,
        replace: d,
        state: h,
        relative: v,
        preventScrollReset: x,
        viewTransition: j,
        defaultShouldRevalidate: T
      });
      G && f !== !1 ? E.startTransition(() => _e()) : _e();
    };
    return /* @__PURE__ */ E.createElement(
      "form",
      {
        ref: X,
        method: V,
        action: Q,
        onSubmit: c ? g : ae,
        ...Y,
        "data-discover": !L && u === "render" ? "true" : void 0
      }
    );
  }
);
Oy.displayName = "Form";
function Dy(u) {
  return `${u} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function jh(u) {
  let o = E.useContext(Pa);
  return Ue(o, Dy(u)), o;
}
function Uy(u, {
  target: o,
  replace: f,
  mask: c,
  state: d,
  preventScrollReset: h,
  relative: p,
  viewTransition: y,
  defaultShouldRevalidate: g,
  useTransitions: v
} = {}) {
  let x = Zl(), j = kt(), T = ai(u, { relative: p });
  return E.useCallback(
    (Y) => {
      if (fy(Y, o)) {
        Y.preventDefault();
        let X = f !== void 0 ? f : ei(j) === ei(T), G = () => x(u, {
          replace: X,
          mask: c,
          state: d,
          preventScrollReset: h,
          relative: p,
          viewTransition: y,
          defaultShouldRevalidate: g
        });
        v ? E.startTransition(() => G()) : G();
      }
    },
    [
      j,
      x,
      T,
      f,
      c,
      d,
      o,
      u,
      h,
      p,
      y,
      g,
      v
    ]
  );
}
function wy(u) {
  zt(
    typeof URLSearchParams < "u",
    "You cannot use the `useSearchParams` hook in a browser that does not support the URLSearchParams API. If you need to support Internet Explorer 11, we recommend you load a polyfill such as https://github.com/ungap/url-search-params."
  );
  let o = E.useRef(vr(u)), f = E.useRef(!1), c = kt(), d = E.useMemo(
    () => (
      // Only merge in the defaults if we haven't yet called setSearchParams.
      // Once we call that we want those to take precedence, otherwise you can't
      // remove a param with setSearchParams({}) if it has an initial value
      dy(
        c.search,
        f.current ? null : o.current
      )
    ),
    [c.search]
  ), h = Zl(), p = E.useCallback(
    (y, g) => {
      const v = vr(
        typeof y == "function" ? y(new URLSearchParams(d)) : y
      );
      f.current = !0, h("?" + v, g);
    },
    [h, d]
  );
  return [d, p];
}
var Hy = 0, By = () => `__${String(++Hy)}__`;
function Ly() {
  let { router: u } = jh(
    "useSubmit"
    /* UseSubmit */
  ), { basename: o } = E.useContext(Mt), f = ty(), c = u.fetch, d = u.navigate;
  return E.useCallback(
    async (h, p = {}) => {
      let { action: y, method: g, encType: v, formData: x, body: j } = py(
        h,
        o
      );
      if (p.navigate === !1) {
        let T = p.fetcherKey || By();
        await c(T, f, p.action || y, {
          defaultShouldRevalidate: p.defaultShouldRevalidate,
          preventScrollReset: p.preventScrollReset,
          formData: x,
          body: j,
          formMethod: p.method || g,
          formEncType: p.encType || v,
          flushSync: p.flushSync
        });
      } else
        await d(p.action || y, {
          defaultShouldRevalidate: p.defaultShouldRevalidate,
          preventScrollReset: p.preventScrollReset,
          formData: x,
          body: j,
          formMethod: p.method || g,
          formEncType: p.encType || v,
          replace: p.replace,
          state: p.state,
          fromRouteId: f,
          flushSync: p.flushSync,
          viewTransition: p.viewTransition
        });
    },
    [c, d, o, f]
  );
}
function qy(u, { relative: o } = {}) {
  let { basename: f } = E.useContext(Mt), c = E.useContext(It);
  Ue(c, "useFormAction must be used inside a RouteContext");
  let [d] = c.matches.slice(-1), h = { ...ai(u || ".", { relative: o }) }, p = kt();
  if (u == null) {
    h.search = p.search;
    let y = new URLSearchParams(h.search), g = y.getAll("index");
    if (g.some((x) => x === "")) {
      y.delete("index"), g.filter((j) => j).forEach((j) => y.append("index", j));
      let x = y.toString();
      h.search = x ? `?${x}` : "";
    }
  }
  return (!u || u === ".") && d.route.index && (h.search = h.search ? h.search.replace(/^\?/, "?index&") : "?index"), f !== "/" && (h.pathname = h.pathname === "/" ? f : Kt([f, h.pathname])), ei(h);
}
function Yy(u, { relative: o } = {}) {
  let f = E.useContext(ph);
  Ue(
    f != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?"
  );
  let { basename: c } = jh(
    "useViewTransitionState"
    /* useViewTransitionState */
  ), d = ai(u, { relative: o });
  if (!f.isTransitioning)
    return !1;
  let h = yl(f.currentLocation.pathname, c) || f.currentLocation.pathname, p = yl(f.nextLocation.pathname, c) || f.nextLocation.pathname;
  return Ru(d.pathname, p) != null || Ru(d.pathname, h) != null;
}
const Gy = "/dsc_hub/assets", Xy = {
  ops: "icons/dsc-icon-ops.svg",
  plant: "icons/dsc-icon-plant.svg",
  advanced: "icons/dsc-icon-advanced.svg",
  system: "icons/dsc-icon-system.svg",
  home: "icons/dsc-icon-home.svg",
  dash: "icons/dsc-icon-dash.svg",
  climate: "icons/dsc-icon-climate.svg",
  tent: "icons/dsc-icon-tent.svg",
  clone: "icons/dsc-icon-clone.svg",
  root: "icons/dsc-icon-root.svg",
  tank: "icons/dsc-icon-tank.svg",
  lighting: "icons/dsc-icon-lighting.svg",
  build: "icons/dsc-icon-build.svg",
  catalog: "icons/dsc-icon-catalog.svg",
  strains: "icons/dsc-icon-strains.svg",
  nutrient: "icons/dsc-icon-nutrient.svg",
  learning: "icons/dsc-icon-learning.svg",
  trends: "icons/dsc-icon-trends.svg",
  history: "icons/dsc-icon-history.svg",
  alert: "icons/dsc-icon-alert.svg",
  ok: "icons/dsc-icon-ok.svg",
  settings: "icons/dsc-icon-settings.svg",
  brand: "brand/dsc-brand-mark.svg",
  wordmark: "brand/dsc-brand-wordmark.svg",
  gauge: "gauges/dsc-gauge-arc.svg",
  more: "icons/dsc-icon-more.svg",
  search: "icons/dsc-icon-search.svg",
  close: "icons/dsc-icon-close.svg",
  seat: "icons/dsc-icon-seat.svg"
};
function Jm(u) {
  return `${Gy}/${Xy[u]}`;
}
const Eh = E.createContext(null);
function ky(u) {
  if (!u) return !1;
  const o = u.toLowerCase();
  return o.includes("dsc_") || o.includes("dsc-") || o.startsWith("sensor.dsc") || o.startsWith("switch.dsc") || o.startsWith("binary_sensor.dsc") || o.startsWith("number.dsc") || o.startsWith("light.dsc") || o.startsWith("fan.dsc") || o.startsWith("select.dsc") || o.startsWith("input_");
}
function Qy({
  hass: u,
  children: o
}) {
  const [f, c] = E.useState(0);
  E.useEffect(() => {
    if (!u) return;
    c((v) => v + 1);
    const h = u.connection;
    if (!h?.subscribeEvents) return;
    let p, y = !1;
    const g = (v) => {
      const x = v.data?.entity_id;
      ky(x) && c((j) => j + 1);
    };
    return Promise.resolve(h.subscribeEvents(g, "state_changed")).then((v) => {
      if (y) {
        v();
        return;
      }
      p = v;
    }).catch(() => {
    }), () => {
      y = !0, p?.();
    };
  }, [u]);
  const d = E.useMemo(() => {
    const h = (j) => u?.states?.[j], p = (j) => {
      const T = h(j)?.state;
      return !!T && T !== "unavailable" && T !== "unknown";
    }, y = (j, T = "—") => p(j) ? h(j)?.state ?? T : T;
    return { hass: u, entity: h, state: y, num: (j, T = NaN) => {
      const Y = Number(y(j, ""));
      return Number.isFinite(Y) ? Y : T;
    }, available: p, callService: (j, T, Y) => u?.callService ? u.callService(j, T, Y) : Promise.resolve(null), callWS: (j) => u?.callWS ? u.callWS(j) : Promise.resolve(null), tick: f };
  }, [u, f]);
  return E.createElement(Eh.Provider, { value: d }, o);
}
function Fe() {
  const u = E.useContext(Eh);
  if (!u) throw new Error("useHass outside HassProvider");
  return u;
}
function Jt({
  name: u,
  size: o = 16,
  className: f,
  color: c = "currentColor"
}) {
  return /* @__PURE__ */ s.jsx(
    "span",
    {
      className: f,
      role: "img",
      "aria-hidden": !0,
      style: {
        display: "inline-block",
        width: o,
        height: o,
        backgroundColor: c,
        WebkitMaskImage: `url(${Jm(u)})`,
        maskImage: `url(${Jm(u)})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        flexShrink: 0
      }
    }
  );
}
function ue({
  title: u,
  children: o,
  className: f = "",
  style: c,
  icon: d
}) {
  return /* @__PURE__ */ s.jsxs("section", { className: `dsc-card ${f}`.trim(), style: c, children: [
    u ? /* @__PURE__ */ s.jsxs("h3", { className: "dsc-card-title", children: [
      d ? /* @__PURE__ */ s.jsx(Jt, { name: d, size: 14, color: "var(--dsc-teal)" }) : null,
      u
    ] }) : null,
    o
  ] });
}
function Xt({
  children: u,
  primary: o,
  teal: f,
  onClick: c,
  type: d = "button",
  disabled: h
}) {
  const p = ["dsc-btn"];
  return o && p.push("primary"), f && p.push("teal"), /* @__PURE__ */ s.jsx("button", { type: d, className: p.join(" "), onClick: c, disabled: h, children: u });
}
function Le({
  label: u,
  value: o,
  unit: f,
  sub: c,
  tone: d = "normal"
}) {
  const h = d === "ok" ? "dsc-status-ok" : d === "bad" ? "dsc-status-bad" : d === "muted" ? "dsc-status-muted" : "";
  return /* @__PURE__ */ s.jsxs(ue, { title: u, children: [
    /* @__PURE__ */ s.jsxs("div", { className: `dsc-kpi-value ${h}`.trim(), children: [
      o,
      f ? /* @__PURE__ */ s.jsx("span", { className: "dsc-kpi-unit", children: f }) : null
    ] }),
    c ? /* @__PURE__ */ s.jsx("div", { className: "dsc-kpi-sub", children: c }) : null
  ] });
}
function nt({
  title: u,
  subtitle: o,
  icon: f,
  actions: c
}) {
  return /* @__PURE__ */ s.jsxs("header", { className: "dsc-page-header", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-page-header-main", children: [
      f ? /* @__PURE__ */ s.jsx(Jt, { name: f, size: 22, color: "var(--dsc-teal)" }) : null,
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("h1", { className: "dsc-page-title", children: u }),
        o ? /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: o }) : null
      ] })
    ] }),
    c ? /* @__PURE__ */ s.jsx("div", { className: "dsc-page-header-actions", children: c }) : null
  ] });
}
function be({
  label: u,
  tone: o = "muted",
  pulse: f,
  icon: c
}) {
  return /* @__PURE__ */ s.jsxs("span", { className: `dsc-chip dsc-chip--${o}${f ? " dsc-chip--pulse" : ""}`, children: [
    c ? /* @__PURE__ */ s.jsx(Jt, { name: c, size: 11 }) : null,
    u
  ] });
}
function je({
  entityId: u,
  label: o,
  warnWhenMissing: f,
  icon: c,
  showBrightness: d
}) {
  const { state: h, available: p, callService: y, entity: g } = Fe(), v = h(u, "off") === "on", x = p(u), j = u.split(".")[0], T = () => {
    if (x) {
      if (j === "switch" || j === "input_boolean") {
        y("homeassistant", "toggle", { entity_id: u });
        return;
      }
      j === "light" && y("light", v ? "turn_off" : "turn_on", { entity_id: u });
    }
  }, Y = d !== !1 && j === "light" && v ? Math.round(Number(g(u)?.attributes?.brightness ?? 0) / 255 * 100) : null;
  return /* @__PURE__ */ s.jsxs(
    "button",
    {
      type: "button",
      className: `dsc-demand${v ? " is-on" : ""}${x ? "" : " is-missing"}`,
      onClick: T,
      disabled: !x && !f,
      title: x ? u : f || `${u} unavailable`,
      children: [
        c ? /* @__PURE__ */ s.jsx(Jt, { name: c, size: 14, className: "dsc-demand-icon" }) : null,
        /* @__PURE__ */ s.jsx("span", { className: "dsc-demand-label", children: o }),
        /* @__PURE__ */ s.jsx("span", { className: "dsc-demand-state", children: x ? Y != null ? `${Y}%` : v ? "ON" : "OFF" : f || "—" })
      ]
    }
  );
}
function Ou({
  entityId: u,
  label: o,
  icon: f
}) {
  const { state: c, available: d, callService: h, entity: p } = Fe(), y = d(u), g = c(u, ""), v = p(u)?.attributes?.options || [], x = u.split(".")[0], j = (T) => {
    !y || !T || (x === "select" ? h("select", "select_option", { entity_id: u, option: T }) : x === "input_select" && h("input_select", "select_option", { entity_id: u, option: T }));
  };
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-entity-select${y ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ s.jsxs("span", { className: "dsc-entity-select-label", children: [
      f ? /* @__PURE__ */ s.jsx(Jt, { name: f, size: 13, color: "var(--dsc-teal)" }) : null,
      o
    ] }),
    /* @__PURE__ */ s.jsxs("select", { value: g, disabled: !y, onChange: (T) => j(T.target.value), children: [
      !v.includes(g) && g ? /* @__PURE__ */ s.jsx("option", { value: g, children: g }) : null,
      v.map((T) => /* @__PURE__ */ s.jsx("option", { value: T, children: T }, T))
    ] })
  ] });
}
function Ql({
  entityId: u,
  label: o,
  disabled: f
}) {
  const { available: c, callService: d, entity: h, state: p } = Fe(), y = c(u), g = Number(h(u)?.attributes?.percentage ?? 0), v = p(u) === "on", x = f || !y, j = (T) => {
    x || d("fan", "set_percentage", { entity_id: u, percentage: T });
  };
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-fan-slider${x ? " is-disabled" : ""}`, children: [
    /* @__PURE__ */ s.jsxs("span", { className: "dsc-fan-slider-label", children: [
      o,
      /* @__PURE__ */ s.jsx("strong", { children: y ? `${Math.round(g)}%` : "—" }),
      !v && y ? /* @__PURE__ */ s.jsx("em", { className: "dsc-muted", children: "off" }) : null
    ] }),
    /* @__PURE__ */ s.jsx(
      "input",
      {
        type: "range",
        min: 0,
        max: 100,
        step: 1,
        value: Number.isFinite(g) ? g : 0,
        disabled: x,
        onChange: (T) => j(Number(T.target.value))
      }
    )
  ] });
}
function Nu({
  entityId: u,
  label: o,
  icon: f
}) {
  const { state: c, available: d } = Fe(), h = d(u) && c(u) === "on";
  return /* @__PURE__ */ s.jsxs("span", { className: `dsc-chip ${h ? "dsc-chip--ok dsc-chip--pulse" : "dsc-chip--muted"}`, children: [
    f ? /* @__PURE__ */ s.jsx(Jt, { name: f, size: 11 }) : null,
    o,
    " ",
    h ? "ESP" : "HA"
  ] });
}
function ti({
  label: u,
  icon: o,
  onClick: f,
  className: c = ""
}) {
  return /* @__PURE__ */ s.jsx(
    "button",
    {
      type: "button",
      className: `dsc-icon-btn ${c}`.trim(),
      "aria-label": u,
      title: u,
      onClick: f,
      children: /* @__PURE__ */ s.jsx(Jt, { name: o, size: 16 })
    }
  );
}
function Lu({
  items: u,
  label: o = "More actions"
}) {
  const [f, c] = E.useState(!1), d = E.useRef(null);
  return E.useEffect(() => {
    if (!f) return;
    const h = (p) => {
      d.current?.contains(p.target) || c(!1);
    };
    return document.addEventListener("mousedown", h), () => document.removeEventListener("mousedown", h);
  }, [f]), /* @__PURE__ */ s.jsxs("div", { className: "dsc-overflow", ref: d, children: [
    /* @__PURE__ */ s.jsx(ti, { label: o, icon: "more", onClick: () => c((h) => !h) }),
    f ? /* @__PURE__ */ s.jsx("div", { className: "dsc-overflow-menu", role: "menu", children: u.map((h) => /* @__PURE__ */ s.jsx(
      "button",
      {
        type: "button",
        role: "menuitem",
        onClick: () => {
          c(!1), h.onSelect();
        },
        children: h.label
      },
      h.id
    )) }) : null
  ] });
}
function Zy({
  open: u,
  onClose: o,
  title: f,
  side: c = "right",
  children: d
}) {
  const h = E.useId();
  return E.useEffect(() => {
    if (!u) return;
    const p = (y) => {
      y.key === "Escape" && o();
    };
    return window.addEventListener("keydown", p), () => window.removeEventListener("keydown", p);
  }, [u, o]), /* @__PURE__ */ s.jsxs("div", { className: `dsc-drawer-root${u ? " is-open" : ""}`, "aria-hidden": !u, children: [
    /* @__PURE__ */ s.jsx("div", { className: "dsc-drawer-scrim", onClick: o }),
    /* @__PURE__ */ s.jsxs(
      "aside",
      {
        className: `dsc-drawer-panel ${c}`,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": h,
        children: [
          /* @__PURE__ */ s.jsx(
            "button",
            {
              type: "button",
              className: "dsc-drawer-rail",
              "aria-label": "Close panel",
              onClick: o,
              children: c === "right" ? ">" : "<"
            }
          ),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-drawer-head", children: [
            /* @__PURE__ */ s.jsx("h2", { id: h, children: f }),
            /* @__PURE__ */ s.jsx(ti, { label: "Close", icon: "close", onClick: o })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "dsc-drawer-body", children: d })
        ]
      }
    )
  ] });
}
const $m = [
  "var(--dsc-soil-1)",
  "var(--dsc-soil-2)",
  "var(--dsc-soil-3)",
  "var(--dsc-soil-4)"
];
function Vy(u) {
  if (!u || !u.trim()) return [];
  const o = u.split(/[|/·]/).map((c) => c.trim()).filter(Boolean), f = [];
  for (const c of o) {
    const d = c.match(/^(.+?)\s*[·:]?\s*(\d+(?:\.\d+)?)\s*%?$/);
    if (d) {
      f.push({ name: d[1].trim(), pct: Number(d[2]) });
      continue;
    }
    const h = c.match(/(\d+(?:\.\d+)?)\s*%\s*(.+)$/);
    if (h) {
      f.push({ name: h[2].trim(), pct: Number(h[1]) });
      continue;
    }
    c && f.push({ name: c, pct: 0 });
  }
  if (f.length && f.every((c) => c.pct === 0)) {
    const c = 100 / f.length;
    return f.map((d) => ({ ...d, pct: c }));
  }
  return f.filter((c) => c.pct > 0);
}
function Ky({
  layers: u,
  valid: o,
  emptyLabel: f = "No blend on roster seat"
}) {
  const c = u.reduce((p, y) => p + y.pct, 0), d = o ?? (u.length > 0 && Math.round(c) === 100);
  let h = 0;
  return /* @__PURE__ */ s.jsx("div", { className: "dsc-soil", children: /* @__PURE__ */ s.jsx("div", { className: `dsc-soil-pot${d && u.length ? " is-valid" : ""}`, children: u.length ? u.map((p, y) => {
    const g = h;
    return h += p.pct, /* @__PURE__ */ s.jsx(
      "div",
      {
        className: "dsc-soil-layer",
        style: {
          bottom: `${g}%`,
          height: `${p.pct}%`,
          background: p.color || $m[y % $m.length]
        },
        title: `${p.name} ${p.pct}%`,
        children: p.pct >= 12 ? `${p.name} ${Math.round(p.pct)}%` : ""
      },
      `${p.name}-${y}`
    );
  }) : /* @__PURE__ */ s.jsx("div", { className: "dsc-soil-empty", children: f }) }) });
}
const Jy = {
  main: {
    temp: "number.dsc_hub_target_temp",
    rhMin: "number.dsc_hub_rh_target_min",
    rhMax: "number.dsc_hub_rh_target_max",
    vpdMin: "number.dsc_hub_vpd_target_min",
    vpdMax: "number.dsc_hub_vpd_target_max",
    gotTemp: "sensor.dsc_hub_tent_temperature",
    gotRh: "sensor.dsc_hub_tent_humidity",
    gotVpd: "sensor.dsc_hub_vpd_kpa"
  },
  clone: {
    temp: "number.dsc_hub_clone_target_temp",
    rhMin: "number.dsc_hub_clone_rh_min",
    rhMax: "number.dsc_hub_clone_rh_max",
    vpdMin: "number.dsc_hub_clone_vpd_min",
    vpdMax: "number.dsc_hub_clone_vpd_max",
    gotTemp: "sensor.dsc_hub_clone_temperature",
    gotRh: "sensor.dsc_hub_clone_humidity",
    gotVpd: "sensor.dsc_hub_clone_vpd_kpa"
  }
};
function Wn({
  entityId: u,
  label: o,
  step: f
}) {
  const { num: c, available: d, callService: h, entity: p } = Fe(), y = d(u), g = p(u), v = c(u, NaN), x = Number(g?.attributes?.min ?? 0), j = Number(g?.attributes?.max ?? 100), T = f ?? Number(g?.attributes?.step ?? 0.1), [Y, X] = E.useState(String(Number.isFinite(v) ? v : ""));
  E.useEffect(() => {
    Number.isFinite(v) && X(String(v));
  }, [v]);
  const G = () => {
    if (!y) return;
    const D = Number(Y);
    if (!Number.isFinite(D)) {
      X(String(Number.isFinite(v) ? v : ""));
      return;
    }
    const Q = Math.min(j, Math.max(x, D));
    h("number", "set_value", { entity_id: u, value: Q }), X(String(Q));
  };
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-target-num${y ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ s.jsx("span", { className: "dsc-target-num-label", children: o }),
    /* @__PURE__ */ s.jsx(
      "input",
      {
        type: "number",
        value: Y,
        disabled: !y,
        min: x,
        max: j,
        step: T,
        onChange: (D) => X(D.target.value),
        onBlur: G,
        onKeyDown: (D) => {
          D.key === "Enter" && D.target.blur();
        }
      }
    )
  ] });
}
function $y({ tent: u, title: o }) {
  const { num: f, available: c } = Fe(), d = Jy[u], h = f(d.gotTemp), p = f(d.gotRh), y = c(d.gotVpd) ? f(d.gotVpd) : NaN, g = f(d.temp), v = f(d.rhMin), x = f(d.rhMax), j = (T) => {
    const Y = new CustomEvent("hass-more-info", {
      detail: { entityId: T },
      bubbles: !0,
      composed: !0
    });
    document.querySelector("home-assistant")?.dispatchEvent(Y);
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-tent-targets", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-tent-targets-head", children: [
      /* @__PURE__ */ s.jsx("strong", { children: o }),
      /* @__PURE__ */ s.jsx(
        Lu,
        {
          label: `${o} more`,
          items: [
            {
              id: "temp",
              label: "More info · temp target",
              onSelect: () => j(d.temp)
            },
            {
              id: "rh",
              label: "More info · RH band",
              onSelect: () => j(d.rhMin)
            },
            {
              id: "vpd",
              label: "More info · VPD band",
              onSelect: () => j(d.vpdMin)
            }
          ]
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-got-want", children: [
      /* @__PURE__ */ s.jsxs("span", { children: [
        "Got ",
        Number.isFinite(h) ? h.toFixed(1) : "—",
        "°C /",
        " ",
        Number.isFinite(p) ? p.toFixed(0) : "—",
        "%",
        Number.isFinite(y) ? ` / ${y.toFixed(2)} kPa` : ""
      ] }),
      /* @__PURE__ */ s.jsxs("span", { className: "dsc-muted", children: [
        "Want ",
        Number.isFinite(g) ? g.toFixed(1) : "—",
        "°C · RH",
        " ",
        Number.isFinite(v) ? v.toFixed(0) : "—",
        "–",
        Number.isFinite(x) ? x.toFixed(0) : "—",
        "%"
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
      /* @__PURE__ */ s.jsx(Wn, { entityId: d.temp, label: "Temp °C", step: 0.5 }),
      /* @__PURE__ */ s.jsx(Wn, { entityId: d.rhMin, label: "RH min %", step: 1 }),
      /* @__PURE__ */ s.jsx(Wn, { entityId: d.rhMax, label: "RH max %", step: 1 }),
      /* @__PURE__ */ s.jsx(Wn, { entityId: d.vpdMin, label: "VPD min", step: 0.01 }),
      /* @__PURE__ */ s.jsx(Wn, { entityId: d.vpdMax, label: "VPD max", step: 0.01 })
    ] })
  ] });
}
function Tr({
  compact: u,
  emphasize: o
}) {
  const f = o === "clone" ? ["clone", "main"] : ["main", "clone"];
  return /* @__PURE__ */ s.jsx("div", { className: `dsc-target-panel${u ? " is-compact" : ""}`, children: f.map((c) => /* @__PURE__ */ s.jsx($y, { tent: c, title: c === "main" ? "Main 4×8" : "Clone 2×4" }, c)) });
}
function Fy(u) {
  if (typeof u.lu == "number" && Number.isFinite(u.lu))
    return u.lu * 1e3;
  const o = u.last_changed || u.last_updated;
  if (o) {
    const f = Date.parse(o);
    return Number.isFinite(f) ? f : null;
  }
  return null;
}
function Wy(u) {
  const o = u.s ?? u.state, f = typeof o == "number" ? o : Number(o);
  return Number.isFinite(f) ? f : null;
}
function Py(u, o) {
  if (u.length <= o) return u;
  const f = [], c = (u.length - 1) / (o - 1);
  for (let d = 0; d < o; d++)
    f.push(u[Math.round(d * c)]);
  return f;
}
function Iy(u, o = 6, f = 96) {
  const { hass: c, callWS: d, available: h } = Fe(), [p, y] = E.useState([]), [g, v] = E.useState(!0), [x, j] = E.useState(null);
  return E.useEffect(() => {
    let T = !1;
    async function Y() {
      if (!c?.callWS || !u) {
        y([]), v(!1);
        return;
      }
      v(!0), j(null);
      const X = /* @__PURE__ */ new Date(), G = new Date(X.getTime() - o * 3600 * 1e3);
      try {
        const D = await d({
          type: "history/history_during_period",
          start_time: G.toISOString(),
          end_time: X.toISOString(),
          significant_changes_only: !1,
          minimal_response: !0,
          no_attributes: !0,
          entity_ids: [u]
        });
        if (T) return;
        let Q = [];
        Array.isArray(D) ? Q = D[0] || [] : D && typeof D == "object" && (Q = D[u] || []);
        const V = [];
        for (const L of Q) {
          const ae = Fy(L), ne = Wy(L);
          ae == null || ne == null || V.push({ t: ae, v: ne });
        }
        V.sort((L, ae) => L.t - ae.t), y(Py(V, f));
      } catch (D) {
        T || (j(D instanceof Error ? D.message : "history unavailable"), y([]));
      } finally {
        T || v(!1);
      }
    }
    return Y(), () => {
      T = !0;
    };
  }, [c, d, u, o, f, h]), { points: p, loading: g, error: x };
}
function gt(u, o) {
  const f = o?.maxPoints ?? 96, c = o?.hours ?? 6, { num: d, available: h, tick: p } = Fe(), { points: y } = Iy(u, c, f), [g, v] = E.useState([]), [x, j] = E.useState(void 0), T = E.useRef(null), Y = E.useRef(!1);
  return E.useEffect(() => {
    Y.current = !1, v([]), T.current = null, j(void 0);
  }, [u]), E.useEffect(() => {
    if (y.length && !Y.current) {
      Y.current = !0;
      const G = y[y.length - 1]?.v;
      Number.isFinite(G) && (T.current = G);
    }
  }, [y]), E.useEffect(() => {
    if (!u || !h(u)) return;
    const G = d(u);
    if (!Number.isFinite(G)) return;
    if (T.current === G && g.length > 0) {
      const Q = Date.now(), V = g[g.length - 1]?.t ?? 0;
      if (Q - V < 4e3) return;
    }
    T.current = G;
    const D = Date.now();
    v((Q) => [...Q, { t: D, v: G }].slice(-f)), j(D);
  }, [u, p, h, d, f]), { series: E.useMemo(() => {
    if (!y.length && !g.length) return g;
    if (!g.length) return y;
    if (!y.length) return g;
    const G = g[0]?.t ?? 0, Q = [...y.filter((V) => V.t < G - 500), ...g];
    return Q.length > f ? Q.slice(-f) : Q;
  }, [y, g, f]), lastSyncAt: x };
}
const Tu = [
  "var(--dsc-neon)",
  "var(--dsc-teal)",
  "var(--dsc-amber)",
  "var(--dsc-gray-5)"
];
function Fm(u) {
  const o = Math.max(...u, 1), f = 10 ** Math.floor(Math.log10(o));
  return Math.ceil(o / f) * f;
}
function Wm(u, o = !1) {
  const f = Math.min(...u);
  if (o && f >= 0) return 0;
  const c = Math.abs(f) || 1, d = 10 ** Math.floor(Math.log10(c));
  return Math.floor(f / d) * d;
}
function Pm(u, o, f = 0.08) {
  if (!Number.isFinite(u) || !Number.isFinite(o)) return { min: 0, max: 1 };
  if (o <= u) return { min: u - 1, max: o + 1 };
  const d = (o - u) * f || 1;
  return { min: u - d, max: o + d };
}
function e0(u, o, f, c, d, h, p, y) {
  if (!u.length) return "";
  const g = Math.max(h - d, 1e-6), v = Math.max(y - p, 1), x = o - c.l - c.r, j = f - c.t - c.b;
  return u.map((T, Y) => {
    const X = c.l + (T.t - p) / v * x, G = c.t + (1 - (T.v - d) / g) * j;
    return `${Y === 0 ? "M" : "L"}${X.toFixed(1)} ${G.toFixed(1)}`;
  }).join(" ");
}
function Im(u) {
  const o = new Date(u), f = String(o.getHours()).padStart(2, "0"), c = String(o.getMinutes()).padStart(2, "0");
  return `${f}:${c}`;
}
function Pn(u, o, f, c, d) {
  const h = Math.max(f - o, 1e-6);
  return d.t + (1 - (u - o) / h) * (c - d.t - d.b);
}
function eh(u, o, f) {
  const c = u.filter((d) => (d.axis || "left") === o).flatMap((d) => d.series.map((h) => h.v));
  if (!c.length)
    return o === "right" ? { min: 0, max: 100 } : { min: 0, max: 1 };
  if (o === "right") {
    const d = Math.min(...c, 0);
    return Math.max(...c, 100) <= 100 && d >= 0 ? { min: 0, max: 100 } : Pm(Wm(c, !0), Fm(c));
  }
  return Pm(Wm(c), Fm(c));
}
function Du({
  series: u,
  height: o = 160,
  unit: f = "",
  live: c = !0,
  color: d = "var(--dsc-neon)",
  emptyLabel: h = "No history yet",
  lastSyncAt: p,
  targets: y
}) {
  return /* @__PURE__ */ s.jsx(
    fa,
    {
      series: [{ id: "main", label: "", series: u, color: d, unit: f, axis: "left" }],
      height: o,
      unit: f,
      live: c,
      emptyLabel: h,
      lastSyncAt: p,
      targets: y
    }
  );
}
function fa({
  series: u,
  height: o = 180,
  unit: f = "",
  live: c = !0,
  emptyLabel: d = "No history yet",
  lastSyncAt: h,
  targets: p = []
}) {
  const y = E.useId().replace(/:/g, ""), g = 640, v = u.some((U) => U.axis === "right"), x = { l: 40, r: v ? 40 : 14, t: 16, b: 28 }, j = E.useRef(null), [T, Y] = E.useState(null), [X, G] = E.useState(!1), [D, Q] = E.useState(0), V = E.useRef(void 0);
  E.useEffect(() => {
    h != null && V.current !== h && (V.current = h, Q((U) => U + 1));
  }, [h]);
  const L = E.useMemo(() => {
    const U = u.flatMap((W) => W.series);
    if (!U.length) return null;
    const le = eh(u, "left"), ee = eh(u, "right"), M = Math.min(...U.map((W) => W.t)), q = Math.max(...U.map((W) => W.t)), Z = u.map((W, re) => {
      const S = W.axis || "left", w = S === "right" ? ee : le;
      return {
        ...W,
        axis: S,
        color: W.color || Tu[re % Tu.length],
        d: e0(W.series, g, o, x, w.min, w.max, M, q),
        last: W.series.length ? W.series[W.series.length - 1] : null,
        dom: w
      };
    });
    return { left: le, right: ee, t0: M, t1: q, paths: Z };
  }, [u, o, v]), ae = E.useMemo(() => {
    if (!L) return [];
    const U = 4, le = [];
    for (let ee = 0; ee <= U; ee++) {
      const M = ee / U, q = L.left.max - M * (L.left.max - L.left.min), Z = x.t + M * (o - x.t - x.b);
      le.push({ y: Z, label: q.toFixed(Math.abs(q) >= 100 ? 0 : 1) });
    }
    return le;
  }, [L, o]), ne = E.useMemo(() => {
    if (!L || !v) return [];
    const U = 4, le = [];
    for (let ee = 0; ee <= U; ee++) {
      const M = ee / U, q = L.right.max - M * (L.right.max - L.right.min), Z = x.t + M * (o - x.t - x.b);
      le.push({ y: Z, label: q.toFixed(Math.abs(q) >= 100 ? 0 : 1) });
    }
    return le;
  }, [L, o, v]), ve = E.useMemo(() => {
    if (!L) return [];
    const U = 5, le = [], ee = Math.max(L.t1 - L.t0, 1), M = g - x.l - x.r;
    for (let q = 0; q < U; q++) {
      const Z = q / (U - 1), W = L.t0 + Z * ee;
      le.push({ x: x.l + Z * M, label: Im(W) });
    }
    return le;
  }, [L]), P = E.useCallback(
    (U) => {
      const le = j.current;
      if (!le || !L) return null;
      const ee = le.getBoundingClientRect(), M = (U - ee.left) / Math.max(ee.width, 1) * g, q = g - x.l - x.r, Z = Math.min(g - x.r, Math.max(x.l, M)), W = (Z - x.l) / Math.max(q, 1);
      return { t: L.t0 + W * Math.max(L.t1 - L.t0, 1), x: Z };
    },
    [L]
  ), _e = (U) => {
    if (X) return;
    const le = P(U.clientX);
    le && Y(le);
  }, we = () => {
    X || Y(null);
  }, it = (U) => {
    const le = P(U.clientX);
    if (le) {
      if (X && T && Math.abs(T.x - le.x) < 8) {
        G(!1), Y(null);
        return;
      }
      G(!0), Y(le);
    }
  }, We = E.useMemo(() => !L || !T ? [] : L.paths.map((U) => {
    if (!U.series.length) return { id: U.id, label: U.label, color: U.color, v: null, unit: U.unit || "" };
    let le = U.series[0], ee = Math.abs(le.t - T.t);
    for (const q of U.series) {
      const Z = Math.abs(q.t - T.t);
      Z < ee && (le = q, ee = Z);
    }
    const M = Pn(le.v, U.dom.min, U.dom.max, o, x);
    return {
      id: U.id,
      label: U.label,
      color: U.color,
      v: le.v,
      unit: U.unit || "",
      y: M,
      x: x.l + (le.t - L.t0) / Math.max(L.t1 - L.t0, 1) * (g - x.l - x.r)
    };
  }), [L, T, o]), Xe = L?.paths[0]?.last?.v ?? null;
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-chart", style: { position: "relative", width: "100%" }, children: [
    /* @__PURE__ */ s.jsxs(
      "svg",
      {
        ref: j,
        viewBox: `0 0 ${g} ${o}`,
        width: "100%",
        height: o,
        role: "img",
        "aria-label": "Live chart",
        className: "dsc-chart-svg",
        onPointerMove: _e,
        onPointerLeave: we,
        onPointerDown: it,
        children: [
          /* @__PURE__ */ s.jsxs("defs", { children: [
            L?.paths.map((U) => /* @__PURE__ */ s.jsxs("linearGradient", { id: `fill-${y}-${U.id}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ s.jsx("stop", { offset: "0%", stopColor: U.color, stopOpacity: "0.28" }),
              /* @__PURE__ */ s.jsx("stop", { offset: "100%", stopColor: U.color, stopOpacity: "0" })
            ] }, U.id)),
            /* @__PURE__ */ s.jsxs("filter", { id: `glow-${y}`, x: "-40%", y: "-40%", width: "180%", height: "180%", children: [
              /* @__PURE__ */ s.jsx("feGaussianBlur", { stdDeviation: "2.8", result: "b" }),
              /* @__PURE__ */ s.jsxs("feMerge", { children: [
                /* @__PURE__ */ s.jsx("feMergeNode", { in: "b" }),
                /* @__PURE__ */ s.jsx("feMergeNode", { in: "SourceGraphic" })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("filter", { id: `glow-soft-${y}`, x: "-50%", y: "-50%", width: "200%", height: "200%", children: [
              /* @__PURE__ */ s.jsx("feGaussianBlur", { stdDeviation: "4.2", result: "b" }),
              /* @__PURE__ */ s.jsx("feMerge", { children: /* @__PURE__ */ s.jsx("feMergeNode", { in: "b" }) })
            ] })
          ] }),
          ae.map((U) => /* @__PURE__ */ s.jsxs("g", { children: [
            /* @__PURE__ */ s.jsx(
              "line",
              {
                x1: x.l,
                x2: g - x.r,
                y1: U.y,
                y2: U.y,
                stroke: "var(--dsc-gray-3)",
                strokeWidth: "1",
                strokeDasharray: "3 4"
              }
            ),
            /* @__PURE__ */ s.jsx(
              "text",
              {
                x: x.l - 6,
                y: U.y + 3,
                textAnchor: "end",
                fill: "var(--dsc-gray-5)",
                fontSize: "9",
                fontFamily: "var(--dsc-mono)",
                children: U.label
              }
            )
          ] }, `L${U.y}`)),
          ne.map((U) => /* @__PURE__ */ s.jsx(
            "text",
            {
              x: g - x.r + 6,
              y: U.y + 3,
              textAnchor: "start",
              fill: "var(--dsc-teal)",
              fontSize: "9",
              fontFamily: "var(--dsc-mono)",
              opacity: 0.85,
              children: U.label
            },
            `R${U.y}`
          )),
          ve.map((U) => /* @__PURE__ */ s.jsx(
            "text",
            {
              x: U.x,
              y: o - 8,
              textAnchor: "middle",
              fill: "var(--dsc-gray-5)",
              fontSize: "9",
              fontFamily: "var(--dsc-mono)",
              children: U.label
            },
            U.x
          )),
          L ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            p.map((U, le) => {
              const ee = U.axis || "left", M = ee === "right" ? L.right : L.left, q = U.color || (ee === "right" ? "var(--dsc-teal)" : "var(--dsc-amber)");
              if (U.min != null && U.max != null) {
                const W = Pn(U.max, M.min, M.max, o, x), re = Pn(U.min, M.min, M.max, o, x);
                return /* @__PURE__ */ s.jsxs("g", { children: [
                  /* @__PURE__ */ s.jsx(
                    "rect",
                    {
                      x: x.l,
                      y: Math.min(W, re),
                      width: g - x.l - x.r,
                      height: Math.abs(re - W),
                      fill: q,
                      opacity: 0.08
                    }
                  ),
                  /* @__PURE__ */ s.jsx(
                    "line",
                    {
                      x1: x.l,
                      x2: g - x.r,
                      y1: W,
                      y2: W,
                      stroke: q,
                      strokeWidth: "1",
                      strokeDasharray: "4 4",
                      opacity: 0.7
                    }
                  ),
                  /* @__PURE__ */ s.jsx(
                    "line",
                    {
                      x1: x.l,
                      x2: g - x.r,
                      y1: re,
                      y2: re,
                      stroke: q,
                      strokeWidth: "1",
                      strokeDasharray: "4 4",
                      opacity: 0.7
                    }
                  )
                ] }, `tg-${le}`);
              }
              if (U.value == null || !Number.isFinite(U.value)) return null;
              const Z = Pn(U.value, M.min, M.max, o, x);
              return /* @__PURE__ */ s.jsxs("g", { children: [
                /* @__PURE__ */ s.jsx(
                  "line",
                  {
                    x1: x.l,
                    x2: g - x.r,
                    y1: Z,
                    y2: Z,
                    stroke: q,
                    strokeWidth: "1.2",
                    strokeDasharray: "5 4",
                    opacity: 0.85
                  }
                ),
                U.label ? /* @__PURE__ */ s.jsx(
                  "text",
                  {
                    x: g - x.r - 2,
                    y: Z - 4,
                    textAnchor: "end",
                    fill: q,
                    fontSize: "8",
                    fontFamily: "var(--dsc-mono)",
                    children: U.label
                  }
                ) : null
              ] }, `tg-${le}`);
            }),
            L.paths.map((U) => {
              if (!U.d || U.series.length === 0) return null;
              const le = U.series.length >= 2 ? `${U.d} L${g - x.r} ${o - x.b} L${x.l} ${o - x.b} Z` : "", ee = U.last, M = ee && L ? x.l + (ee.t - L.t0) / Math.max(L.t1 - L.t0, 1) * (g - x.l - x.r) : 0, q = ee ? Pn(ee.v, U.dom.min, U.dom.max, o, x) : 0;
              return /* @__PURE__ */ s.jsxs("g", { className: "dsc-chart-series", children: [
                le ? /* @__PURE__ */ s.jsx("path", { d: le, fill: `url(#fill-${y}-${U.id})`, opacity: 0.9, className: "dsc-chart-fill" }) : null,
                /* @__PURE__ */ s.jsx(
                  "path",
                  {
                    d: U.d,
                    fill: "none",
                    stroke: U.color,
                    strokeWidth: "4.5",
                    strokeLinejoin: "round",
                    strokeLinecap: "round",
                    filter: `url(#glow-soft-${y})`,
                    opacity: 0.35,
                    className: "dsc-chart-glow"
                  }
                ),
                /* @__PURE__ */ s.jsx(
                  "path",
                  {
                    d: U.d,
                    fill: "none",
                    stroke: U.color,
                    strokeWidth: "2.2",
                    strokeLinejoin: "round",
                    strokeLinecap: "round",
                    filter: `url(#glow-${y})`,
                    opacity: 0.95,
                    className: "dsc-chart-core"
                  }
                ),
                c && ee && U.series.length >= 2 ? /* @__PURE__ */ s.jsxs("g", { className: "dsc-chart-pulse-wrap", children: [
                  /* @__PURE__ */ s.jsx(
                    "path",
                    {
                      className: "dsc-chart-pulse",
                      d: U.d,
                      fill: "none",
                      stroke: U.color,
                      strokeWidth: "2.6",
                      strokeLinejoin: "round",
                      strokeLinecap: "round",
                      pathLength: 1,
                      style: {
                        strokeDasharray: "0.18 0.82",
                        animation: "dsc-sync-pulse 900ms ease-out 1"
                      }
                    }
                  ),
                  /* @__PURE__ */ s.jsx(
                    "circle",
                    {
                      cx: M,
                      cy: q,
                      r: 4,
                      fill: U.color,
                      className: "dsc-chart-tip",
                      filter: `url(#glow-${y})`
                    }
                  )
                ] }, `pulse-${D}-${U.id}`) : ee ? /* @__PURE__ */ s.jsx("circle", { cx: M, cy: q, r: 3.2, fill: U.color, opacity: 0.9 }) : null
              ] }, U.id);
            }),
            T ? /* @__PURE__ */ s.jsxs("g", { className: "dsc-chart-crosshair", children: [
              /* @__PURE__ */ s.jsx(
                "line",
                {
                  x1: T.x,
                  x2: T.x,
                  y1: x.t,
                  y2: o - x.b,
                  stroke: "var(--dsc-white)",
                  strokeOpacity: 0.35,
                  strokeWidth: "1"
                }
              ),
              We.map(
                (U) => U.v == null || U.y == null ? null : /* @__PURE__ */ s.jsx(
                  "circle",
                  {
                    cx: U.x ?? T.x,
                    cy: U.y,
                    r: 4,
                    fill: U.color,
                    stroke: "var(--dsc-black)",
                    strokeWidth: "1"
                  },
                  U.id
                )
              )
            ] }) : null
          ] }) : /* @__PURE__ */ s.jsx(
            "text",
            {
              x: g / 2,
              y: o / 2,
              textAnchor: "middle",
              fill: "var(--dsc-gray-5)",
              fontSize: "12",
              children: d
            }
          )
        ]
      }
    ),
    T && L ? /* @__PURE__ */ s.jsxs(
      "div",
      {
        className: "dsc-chart-tooltip",
        style: {
          left: `${Math.min(92, Math.max(8, T.x / g * 100))}%`
        },
        children: [
          /* @__PURE__ */ s.jsx("div", { className: "dsc-chart-tooltip-time", children: Im(T.t) }),
          We.map(
            (U) => U.v == null ? null : /* @__PURE__ */ s.jsxs("div", { className: "dsc-chart-tooltip-row", children: [
              /* @__PURE__ */ s.jsx("i", { style: { background: U.color } }),
              /* @__PURE__ */ s.jsxs("span", { children: [
                U.label || U.id,
                " ",
                U.v.toFixed(U.v >= 100 ? 0 : 1),
                U.unit ? ` ${U.unit}` : ""
              ] })
            ] }, U.id)
          )
        ]
      }
    ) : null,
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chart-legend", children: [
      u.filter((U) => U.label).map((U, le) => /* @__PURE__ */ s.jsxs("span", { className: "dsc-chart-legend-item", children: [
        /* @__PURE__ */ s.jsx("i", { style: { background: U.color || Tu[le % Tu.length] } }),
        U.label
      ] }, U.id)),
      Xe != null ? /* @__PURE__ */ s.jsxs("span", { className: "dsc-chart-last", children: [
        Xe.toFixed(1),
        f ? ` ${f}` : u[0]?.unit ? ` ${u[0].unit}` : ""
      ] }) : null
    ] })
  ] });
}
function t0(u, o = 280) {
  const [f, c] = E.useState(u);
  return E.useEffect(() => {
    if (!Number.isFinite(u)) {
      c(u);
      return;
    }
    const d = Number.isFinite(f) ? f : u, h = performance.now();
    let p = 0;
    const y = (g) => {
      const v = Math.min(1, (g - h) / o), x = 1 - (1 - v) ** 3;
      c(d + (u - d) * x), v < 1 && (p = requestAnimationFrame(y));
    };
    return p = requestAnimationFrame(y), () => cancelAnimationFrame(p);
  }, [u, o]), f;
}
function th(u, o, f, c) {
  return { x: u + f * Math.cos(c), y: o + f * Math.sin(c) };
}
function Yt({
  value: u,
  min: o = 0,
  max: f = 100,
  label: c,
  unit: d = "",
  target: h,
  band: p,
  extrema: y
}) {
  const g = t0(Number.isFinite(u) ? u : o), v = Math.min(f, Math.max(o, Number.isFinite(g) ? g : o)), x = Math.max(f - o, 1e-6), j = (v - o) / x, T = 46, Y = 2 * Math.PI * T * 0.75, X = Y * j, G = (L) => {
    const ae = Math.min(1, Math.max(0, (L - o) / x));
    return Math.PI - ae * Math.PI;
  }, D = p && Number.isFinite(u) ? u >= p.min && u <= p.max : !0, Q = Number.isFinite(u) ? D ? "var(--dsc-neon)" : "var(--dsc-amber)" : "var(--dsc-gray-4)", V = [];
  return p && V.push({ v: p.min, kind: "band" }, { v: p.max, kind: "band" }), y?.min != null && V.push({ v: y.min, kind: "ext" }), y?.max != null && V.push({ v: y.max, kind: "ext" }), h != null && Number.isFinite(h) && V.push({ v: h, kind: "target" }), /* @__PURE__ */ s.jsxs("div", { className: `dsc-gauge${!D && Number.isFinite(u) ? " is-warn" : ""}`, children: [
    /* @__PURE__ */ s.jsxs("svg", { viewBox: "0 0 120 90", width: "140", height: "105", "aria-label": c, children: [
      /* @__PURE__ */ s.jsx("defs", { children: /* @__PURE__ */ s.jsxs("filter", { id: "dsc-gauge-glow", x: "-40%", y: "-40%", width: "180%", height: "180%", children: [
        /* @__PURE__ */ s.jsx("feGaussianBlur", { stdDeviation: "3.2", result: "b" }),
        /* @__PURE__ */ s.jsxs("feMerge", { children: [
          /* @__PURE__ */ s.jsx("feMergeNode", { in: "b" }),
          /* @__PURE__ */ s.jsx("feMergeNode", { in: "SourceGraphic" })
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsx(
        "path",
        {
          d: "M18 72 A46 46 0 1 1 102 72",
          fill: "none",
          stroke: "var(--dsc-gray-3)",
          strokeWidth: "10",
          strokeLinecap: "round"
        }
      ),
      /* @__PURE__ */ s.jsx(
        "path",
        {
          d: "M18 72 A46 46 0 1 1 102 72",
          fill: "none",
          stroke: Q,
          strokeWidth: "10",
          strokeLinecap: "round",
          strokeDasharray: `${X} ${Y}`,
          filter: "url(#dsc-gauge-glow)",
          style: { transition: "stroke-dasharray 220ms ease, stroke 220ms ease" }
        }
      ),
      V.map((L, ae) => {
        const ne = G(L.v), ve = th(60, 72, L.kind === "ext" ? T - 2 : T + 1, ne), P = th(60, 72, T - (L.kind === "target" ? 14 : 10), ne), _e = L.kind === "target" ? "var(--dsc-teal)" : L.kind === "band" ? "var(--dsc-amber)" : "var(--dsc-gray-5)";
        return /* @__PURE__ */ s.jsx(
          "line",
          {
            x1: P.x,
            y1: P.y,
            x2: ve.x,
            y2: ve.y,
            stroke: _e,
            strokeWidth: L.kind === "target" ? 2.4 : 1.6,
            strokeLinecap: "round",
            opacity: L.kind === "ext" ? 0.65 : 0.95
          },
          `${L.kind}-${ae}`
        );
      }),
      /* @__PURE__ */ s.jsx(
        "text",
        {
          x: "60",
          y: "58",
          textAnchor: "middle",
          fill: "var(--dsc-white)",
          fontSize: "20",
          fontWeight: "700",
          fontFamily: "var(--dsc-mono)",
          children: Number.isFinite(u) ? u.toFixed(u >= 100 ? 0 : u < 10 ? 2 : 1) : "—"
        }
      ),
      /* @__PURE__ */ s.jsx("text", { x: "60", y: "74", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: d })
    ] }),
    /* @__PURE__ */ s.jsx("div", { className: "dsc-gauge-label", children: c })
  ] });
}
function Wa(u) {
  if (!u.length) return {};
  let o = u[0].v, f = u[0].v;
  for (const c of u)
    c.v < o && (o = c.v), c.v > f && (f = c.v);
  return { min: o, max: f };
}
function at(u, o = "—") {
  return !u || u === "unknown" || u === "unavailable" || u === "none" ? o : u;
}
function Nh(u, o) {
  const f = u(`input_select.dsc_pot${o}_tent`, "unassigned");
  return f === "clone" || f === "main" || f === "unassigned" ? f : "unassigned";
}
function qu(u) {
  switch (u) {
    case "clone":
      return "Clone 2×4";
    case "main":
      return "Main 4×8";
    case "unassigned":
      return "Unassigned";
    default:
      return u;
  }
}
function Ar(u, o) {
  const { state: f, entity: c } = o, d = c("sensor.dsc_plant_roster_summary")?.attributes?.slots || [], h = Array.isArray(d) ? d.find((y) => String(y.pot) === String(u)) : void 0, p = at(h?.blend, "");
  return {
    pot: u,
    plantName: at(f(`text.dsc_pot${u}_plant_name`, "")),
    strainDisplay: at(f(`sensor.dsc_pot${u}_strain_display`, "")),
    sprout: at(f(`datetime.dsc_pot${u}_sprout_date`, ""), "—").slice(0, 10),
    days: at(f(`sensor.dsc_pot${u}_days_since_sprout`, "")),
    stage: at(f(`sensor.dsc_pot${u}_expected_stage`, "")),
    growthStage: at(f(`select.dsc_pot${u}_growth_stage`, "")),
    tent: Nh(f, u),
    blend: p,
    recipe: at(h?.recipe, ""),
    notes: at(h?.notes, ""),
    layers: Vy(p),
    moisture: at(f(`sensor.dsc_pot${u}_soil_moisture`, "")),
    soilTemp: at(f(`sensor.dsc_pot${u}_soil_temperature`, "")),
    ec: at(f(`sensor.dsc_pot${u}_soil_conductivity`, "")),
    ph: at(f(`sensor.dsc_pot${u}_soil_ph`, "")),
    n: at(f(`sensor.dsc_pot${u}_soil_nitrogen`, "")),
    p: at(f(`sensor.dsc_pot${u}_soil_phosphorus`, "")),
    k: at(f(`sensor.dsc_pot${u}_soil_potassium`, "")),
    need: at(f(`sensor.dsc_pot${u}_need_summary`, "")),
    rosterSlot: h?.slot ?? null
  };
}
function l0(u) {
  const o = u("sensor.dsc_plant_roster_summary")?.attributes?.slots;
  return Array.isArray(o) ? o : [];
}
function a0(u) {
  return !Number.isFinite(u) || u <= 0 ? "—" : u >= 86400 ? `${(u / 86400).toFixed(1)}d` : u >= 3600 ? `${(u / 3600).toFixed(1)}h` : `${Math.round(u / 60)}m`;
}
const n0 = [
  { id: "binary_sensor.dsc_hub_emergency_failsafe", label: "Emergency failsafe" },
  { id: "binary_sensor.dsc_hub_climate_sensor_fault", label: "Climate sensor fault" },
  { id: "binary_sensor.dsc_hub_aux_sensor_fault", label: "Aux sensor fault" },
  { id: "binary_sensor.dsc_hub_root_zone_sensor_fault", label: "Root-zone probes" },
  { id: "binary_sensor.dsc_clone_dark_period_violation", label: "Clone dark violation" },
  { id: "binary_sensor.dsc_reduced_kit", label: "Reduced kit" }
];
function i0() {
  const { state: u, num: o, available: f, entity: c, tick: d } = Fe(), h = Zl(), [p, y] = E.useState(!1), g = f("sensor.dsc_hub_uptime"), v = o("sensor.dsc_active_alert_count", 0), x = o("sensor.dsc_hub_tent_temperature"), j = o("sensor.dsc_hub_tent_humidity"), T = o("sensor.dsc_hub_vpd_kpa"), Y = o("sensor.dsc_hub_room_temperature"), X = o("sensor.dsc_hub_clone_temperature"), G = o("sensor.dsc_hub_clone_humidity"), { series: D, lastSyncAt: Q } = gt(
    "sensor.dsc_hub_tent_temperature"
  ), { series: V, lastSyncAt: L } = gt(
    "sensor.dsc_hub_tent_humidity"
  ), ae = Math.max(Q ?? 0, L ?? 0) || void 0, ne = o("number.dsc_hub_target_temp"), ve = o("number.dsc_hub_rh_target_min"), P = o("number.dsc_hub_rh_target_max"), _e = o("number.dsc_hub_vpd_target_min"), we = o("number.dsc_hub_vpd_target_max"), it = E.useMemo(() => Wa(D), [D]), We = E.useMemo(() => Wa(V), [V]), U = u("binary_sensor.dsc_hub_panel_link") === "on", le = u("sensor.dsc_hub_heartbeat", "NO BEAT"), ee = f("sensor.dsc_hub_heartbeat"), M = u("sensor.dsc_fleet_version_status", "—"), q = u("switch.dsc_hub_manual_takeover") === "on", Z = u("switch.dsc_hub_tent_manual_override") === "on", W = u("switch.dsc_hub_tent_full_auto_mode") === "on", re = u("binary_sensor.dsc_reduced_kit") === "on", S = String(c("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? ""), w = W && !q, k = n0.filter(($) => u($.id) === "on"), J = [1, 2, 3, 4].map(($) => Ar($, { state: u, entity: c }));
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      nt,
      {
        icon: "home",
        title: "Ops · Home",
        subtitle: "Live vitals — mode, targets, faults, demands, climate.",
        actions: /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(ti, { label: "Search", icon: "search", onClick: () => y(!0) }),
          /* @__PURE__ */ s.jsx(
            Lu,
            {
              label: "Home settings",
              items: [
                {
                  id: "climate",
                  label: "Open Climate",
                  onSelect: () => h("/ops/climate")
                },
                {
                  id: "system",
                  label: "Open System",
                  onSelect: () => h("/system")
                }
              ]
            }
          ),
          /* @__PURE__ */ s.jsx(ti, { label: "Settings", icon: "settings", onClick: () => h("/ops/climate") })
        ] })
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-status-strip", children: [
      /* @__PURE__ */ s.jsx(
        be,
        {
          icon: g ? "ok" : "alert",
          label: g ? "HUB ONLINE" : "HUB OFFLINE",
          tone: g ? "ok" : "bad"
        }
      ),
      /* @__PURE__ */ s.jsx(
        be,
        {
          label: U ? "PANEL ESP-NOW" : f("sensor.dsc_control_wifi_rssi") ? "PANEL HA-ONLY" : "PANEL OFFLINE",
          tone: U ? "ok" : f("sensor.dsc_control_wifi_rssi") ? "warn" : "bad"
        }
      ),
      /* @__PURE__ */ s.jsx(
        be,
        {
          icon: ee ? "ok" : "alert",
          label: ee ? `BEAT ${le}` : "NO BEAT",
          tone: ee ? "ok" : "bad"
        }
      ),
      /* @__PURE__ */ s.jsx(
        be,
        {
          label: `UP ${a0(o("sensor.dsc_hub_uptime"))}`,
          tone: g ? "ok" : "muted"
        }
      ),
      /* @__PURE__ */ s.jsx(
        be,
        {
          icon: v === 0 ? "ok" : "alert",
          label: v === 0 ? "All clear" : `${v} alert(s)`,
          tone: v === 0 ? "ok" : "bad",
          pulse: v > 0
        }
      ),
      /* @__PURE__ */ s.jsx(
        be,
        {
          label: M === "ok" ? "FLEET OK" : M === "warn" ? "FLEET WARN" : "FLEET DRIFT",
          tone: M === "ok" ? "ok" : M === "warn" ? "warn" : "bad"
        }
      ),
      W ? /* @__PURE__ */ s.jsx(be, { icon: "ok", label: "FULL AUTO", tone: "ok", pulse: !0 }) : null,
      w ? /* @__PURE__ */ s.jsx(be, { label: "AUTO-DRIVEN", tone: "ok" }) : null,
      q ? /* @__PURE__ */ s.jsx(be, { icon: "alert", label: "MANUAL TAKEOVER", tone: "warn", pulse: !0 }) : null,
      Z ? /* @__PURE__ */ s.jsx(be, { icon: "alert", label: "FAN OVERRIDE", tone: "warn", pulse: !0 }) : null,
      W && re ? /* @__PURE__ */ s.jsx(be, { icon: "alert", label: S || "REDUCED KIT", tone: "warn", pulse: !0 }) : null
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(
        Le,
        {
          label: "Tent temp",
          value: Number.isFinite(x) ? x.toFixed(1) : "—",
          unit: "°C",
          sub: `Room ${Number.isFinite(Y) ? Y.toFixed(1) : "—"} °C`
        }
      ) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(
        Le,
        {
          label: "Tent RH",
          value: Number.isFinite(j) ? j.toFixed(0) : "—",
          unit: "%",
          sub: `VPD ${Number.isFinite(T) ? T.toFixed(2) : "—"} kPa`
        }
      ) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(
        Le,
        {
          label: "Clone",
          value: Number.isFinite(X) ? X.toFixed(1) : "—",
          unit: "°C",
          sub: `RH ${Number.isFinite(G) ? G.toFixed(0) : "—"}%`
        }
      ) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(
        Le,
        {
          label: "Surface",
          value: u("sensor.dsc_ha_surface_version", "6.3.0"),
          sub: `Fleet ${M}`,
          tone: "ok"
        }
      ) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ue, { className: "dsc-glass", title: "Mode", icon: "climate", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-row", children: [
          /* @__PURE__ */ s.jsx(
            je,
            {
              entityId: "switch.dsc_hub_tent_full_auto_mode",
              label: "Full Auto",
              icon: "ok"
            }
          ),
          /* @__PURE__ */ s.jsx(
            je,
            {
              entityId: "switch.dsc_hub_manual_takeover",
              label: "Manual takeover",
              icon: "alert"
            }
          ),
          /* @__PURE__ */ s.jsx(
            je,
            {
              entityId: "switch.dsc_hub_tent_manual_override",
              label: "Fan override",
              icon: "climate"
            }
          ),
          /* @__PURE__ */ s.jsx(
            je,
            {
              entityId: "switch.dsc_hub_humidifier_intake_routing",
              label: "Hum intake routing",
              icon: "climate"
            }
          ),
          /* @__PURE__ */ s.jsx(
            je,
            {
              entityId: "switch.dsc_hub_recirc_de_strat_pulse",
              label: "RECIRC de-strat",
              icon: "climate"
            }
          )
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-selects", children: [
          /* @__PURE__ */ s.jsx(
            Ou,
            {
              entityId: "select.dsc_hub_control_strategy",
              label: "Strategy",
              icon: "climate"
            }
          ),
          /* @__PURE__ */ s.jsx(
            Ou,
            {
              entityId: "select.dsc_hub_priority_tent",
              label: "Priority tent",
              icon: "tent"
            }
          )
        ] }),
        W && (re || S) ? /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
          /* @__PURE__ */ s.jsx(be, { icon: "alert", label: "Honesty", tone: "warn" }),
          " ",
          S || "Full Auto armed on reduced kit — capacity offline paths apply."
        ] }) : null
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ue, { className: "dsc-glass", title: "Targets", icon: "gauge", children: /* @__PURE__ */ s.jsx(Tr, { compact: !0 }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ue, { className: "dsc-glass", title: "Plant seats", icon: "seat", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: J.map(($) => /* @__PURE__ */ s.jsxs(
        "button",
        {
          type: "button",
          className: "dsc-chip dsc-chip--ok",
          onClick: () => h(`/ops/plant-seat?pot=${$.pot}`),
          title: $.blend || "Open plant seat",
          children: [
            "P",
            $.pot,
            " ",
            $.plantName !== "—" ? $.plantName : "—",
            " · ",
            qu($.tent),
            $.blend ? ` · ${$.blend.slice(0, 28)}` : ""
          ]
        },
        $.pot
      )) }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-8", children: /* @__PURE__ */ s.jsx(ue, { className: "dsc-glass", title: "Live climate — tent T + RH", icon: "climate", children: /* @__PURE__ */ s.jsx(
        fa,
        {
          live: !0,
          lastSyncAt: ae,
          series: [
            {
              id: "temp",
              label: "Temp °C",
              series: D,
              color: "var(--dsc-neon)",
              axis: "left",
              unit: "°C"
            },
            {
              id: "rh",
              label: "RH %",
              series: V,
              color: "var(--dsc-teal)",
              axis: "right",
              unit: "%"
            }
          ],
          targets: [
            {
              axis: "left",
              value: ne,
              color: "var(--dsc-amber)",
              label: "Want T"
            },
            {
              axis: "right",
              min: ve,
              max: P,
              color: "var(--dsc-teal)",
              label: "RH band"
            }
          ]
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(ue, { className: "dsc-glass", title: "Gauges", icon: "gauge", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-gauge-row", children: [
        /* @__PURE__ */ s.jsx(
          Yt,
          {
            label: "Temp",
            value: x,
            min: 10,
            max: 40,
            unit: "°C",
            target: ne,
            band: Number.isFinite(ne) ? { min: ne - 2, max: ne + 2 } : void 0,
            extrema: it
          }
        ),
        /* @__PURE__ */ s.jsx(
          Yt,
          {
            label: "RH",
            value: j,
            min: 0,
            max: 100,
            unit: "%",
            band: { min: ve, max: P },
            extrema: We
          }
        ),
        /* @__PURE__ */ s.jsx(
          Yt,
          {
            label: "VPD",
            value: T,
            min: 0,
            max: 2.5,
            unit: "kPa",
            band: { min: _e, max: we },
            target: (_e + we) / 2
          }
        )
      ] }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(ue, { className: `dsc-glass${w ? " is-auto" : ""}`, title: "Demands", icon: "climate", children: [
        w ? /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: /* @__PURE__ */ s.jsx(be, { label: "AUTO", tone: "ok", icon: "ok" }) }) : null,
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-demand-row", children: [
          /* @__PURE__ */ s.jsx(je, { entityId: "switch.dsc_hub_heater_demand", label: "Heat", icon: "climate" }),
          /* @__PURE__ */ s.jsx(
            je,
            {
              entityId: "switch.dsc_hub_ac_demand",
              label: "Cool",
              icon: "climate",
              warnWhenMissing: u("binary_sensor.dsc_ac_capacity_offline") === "on" ? "AC ○" : void 0
            }
          ),
          /* @__PURE__ */ s.jsx(je, { entityId: "switch.dsc_hub_humidifier_demand", label: "Hum", icon: "climate" }),
          /* @__PURE__ */ s.jsx(
            je,
            {
              entityId: "switch.dsc_hub_dehumidifier_demand",
              label: "Dehum",
              icon: "climate"
            }
          ),
          /* @__PURE__ */ s.jsx(je, { entityId: "switch.dsc_hub_grow_mat_demand", label: "Mat", icon: "root" }),
          /* @__PURE__ */ s.jsx(
            je,
            {
              entityId: "switch.dsc_hub_clone_humidifier_demand",
              label: "C-Hum",
              icon: "clone"
            }
          ),
          /* @__PURE__ */ s.jsx(
            je,
            {
              entityId: "light.dsc_hub_sf1000_dimmer",
              label: "SF1000",
              icon: "lighting",
              showBrightness: !0
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(ue, { className: "dsc-glass", title: "Fans", icon: "climate", children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: "0 0 8px" }, children: Z ? "Fan override ON — sliders write percentage." : "Enable Fan override to set duty." }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-fan-stack", children: [
          /* @__PURE__ */ s.jsx(
            Ql,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_main",
              label: "Intake Main",
              disabled: !Z
            }
          ),
          /* @__PURE__ */ s.jsx(
            Ql,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_2x4",
              label: "Intake 2×4",
              disabled: !Z
            }
          ),
          /* @__PURE__ */ s.jsx(
            Ql,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_room",
              label: "Exhaust room",
              disabled: !Z
            }
          ),
          /* @__PURE__ */ s.jsx(
            Ql,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_outside",
              label: "Exhaust outside",
              disabled: !Z
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(ue, { className: "dsc-glass", title: "Pot ESP-NOW", icon: "root", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ s.jsx(Nu, { entityId: "binary_sensor.dsc_hub_pot1_esp_now_link", label: "P1", icon: "ok" }),
        /* @__PURE__ */ s.jsx(Nu, { entityId: "binary_sensor.dsc_hub_pot2_esp_now_link", label: "P2", icon: "ok" }),
        /* @__PURE__ */ s.jsx(Nu, { entityId: "binary_sensor.dsc_hub_pot3_esp_now_link", label: "P3", icon: "ok" }),
        /* @__PURE__ */ s.jsx(Nu, { entityId: "binary_sensor.dsc_hub_pot4_esp_now_link", label: "P4", icon: "ok" })
      ] }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(ue, { className: "dsc-glass", title: "Faults / alerts", icon: "alert", children: k.length === 0 && v === 0 ? /* @__PURE__ */ s.jsx("div", { className: "dsc-empty dsc-empty--ok", children: "No active faults — all clear." }) : /* @__PURE__ */ s.jsxs("ul", { className: "dsc-fault-list", children: [
        k.map(($) => /* @__PURE__ */ s.jsxs("li", { children: [
          /* @__PURE__ */ s.jsx(be, { label: $.label, tone: "bad", pulse: !0, icon: "alert" }),
          /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", children: $.id })
        ] }, $.id)),
        v > 0 && k.length === 0 ? /* @__PURE__ */ s.jsxs("li", { children: [
          /* @__PURE__ */ s.jsx(be, { label: `${v} system alert(s)`, tone: "bad", pulse: !0, icon: "alert" }),
          /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", children: "See System for entity detail" })
        ] }) : null
      ] }) }) })
    ] }),
    /* @__PURE__ */ s.jsx(Zy, { open: p, onClose: () => y(!1), title: "Quick jump", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: [
      { path: "/ops/climate", label: "Climate" },
      { path: "/ops/dash", label: "Dash" },
      { path: "/ops/main-4x8", label: "Main 4×8" },
      { path: "/ops/clone-2x4", label: "Clone 2×4" },
      { path: "/ops/plant-seat", label: "Plant seat" },
      { path: "/plant/build", label: "Build" },
      { path: "/system", label: "System" }
    ].map(($) => /* @__PURE__ */ s.jsx(
      "button",
      {
        type: "button",
        className: "dsc-btn teal",
        onClick: () => {
          y(!1), h($.path);
        },
        children: $.label
      },
      $.path
    )) }) })
  ] });
}
const u0 = [
  "/local/DSC-HUB.js",
  "/local/dsc-system-map-card.js",
  "/hacsfiles/DSC-HUB/DSC-HUB.js"
], In = /* @__PURE__ */ new Map();
let lh = !1;
function s0(u) {
  if (document.querySelector(`script[data-dsc-autoload="${u}"]`))
    return In.get(u) ?? Promise.resolve();
  if (In.has(u)) return In.get(u);
  const f = new Promise((c, d) => {
    const h = document.createElement("script");
    h.src = u, h.async = !0, h.dataset.dscAutoload = u, h.onload = () => c(), h.onerror = () => d(new Error(`Failed to load ${u}`)), document.head.appendChild(h);
  });
  return In.set(u, f), f;
}
async function c0(u, o = 12e3) {
  if (customElements.get(u)) return !0;
  if (lh)
    await Promise.allSettled([...In.values()]);
  else {
    lh = !0;
    for (const f of u0)
      try {
        if (await s0(f), customElements.get(u)) return !0;
      } catch {
      }
  }
  try {
    return await Promise.race([
      customElements.whenDefined(u),
      new Promise(
        (f, c) => window.setTimeout(() => c(new Error("timeout")), o)
      )
    ]), !!customElements.get(u);
  } catch {
    return !!customElements.get(u);
  }
}
function Yu({
  tag: u,
  config: o
}) {
  const f = E.useRef(null), { hass: c } = Fe(), [d, h] = E.useState("loading"), p = E.useRef(
    null
  ), y = JSON.stringify(o ?? {});
  return E.useEffect(() => {
    const g = f.current;
    if (!g) return;
    let v = !1;
    const x = y ? JSON.parse(y) : {};
    return (async () => {
      h("loading"), g.innerHTML = "";
      const j = await c0(u);
      if (v || !f.current) return;
      if (!j) {
        h("missing");
        const Y = document.createElement("div");
        Y.className = "dsc-empty", Y.innerHTML = `<strong>${u}</strong> did not register.<br/>Tried /local/DSC-HUB.js and /local/dsc-system-map-card.js. Deploy the IIFE bundle or add it as a Lovelace resource, then hard-refresh.`, g.appendChild(Y);
        return;
      }
      const T = document.createElement(u);
      typeof T.setConfig == "function" && T.setConfig({ type: `custom:${u}`, ...x }), c && (T.hass = c), g.appendChild(T), p.current = T, h("ready");
    })(), () => {
      v = !0, p.current = null, g.innerHTML = "";
    };
  }, [u, y]), E.useEffect(() => {
    p.current && c && (p.current.hass = c);
  }, [c]), /* @__PURE__ */ s.jsx(
    "div",
    {
      className: `dsc-legacy-host${d === "missing" ? " dsc-legacy-host--empty" : ""}`,
      ref: f,
      "data-status": d
    }
  );
}
function st(u, o = 1) {
  return Number.isFinite(u) ? u.toFixed(o) : "—";
}
function r0() {
  const u = Zl();
  return E.useEffect(() => {
    const o = (f) => {
      const c = f.detail, d = Number(c?.pot);
      d >= 1 && d <= 4 && u(`/ops/plant-seat?pot=${d}`);
    };
    return window.addEventListener("dsc-dash-select-pot", o), () => window.removeEventListener("dsc-dash-select-pot", o);
  }, [u]), /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      nt,
      {
        icon: "dash",
        title: "Ops · Dash",
        subtitle: "Cinematic digital twin — pick a pot to open Plant Seat.",
        actions: /* @__PURE__ */ s.jsx(ti, { label: "Climate editors", icon: "settings", onClick: () => u("/ops/climate") })
      }
    ),
    /* @__PURE__ */ s.jsx(Yu, { tag: "dsc-the-dash-card", config: {} })
  ] });
}
function o0() {
  const { num: u, state: o, entity: f } = Fe(), c = Zl(), d = o("switch.dsc_hub_tent_manual_override") === "on", h = o("switch.dsc_hub_tent_full_auto_mode") === "on", p = String(f("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? ""), y = gt("sensor.dsc_hub_tent_temperature"), g = gt("sensor.dsc_hub_tent_humidity"), v = gt("sensor.dsc_hub_clone_temperature"), x = gt("sensor.dsc_hub_clone_humidity"), j = gt("sensor.dsc_cfm_exhaust_out"), T = gt("sensor.dsc_cfm_exhaust_recirc"), Y = gt("sensor.dsc_fan_exhaust_outside_pct"), X = gt("sensor.dsc_fan_exhaust_room_pct"), G = u("number.dsc_hub_target_temp"), D = u("number.dsc_hub_rh_target_min"), Q = u("number.dsc_hub_rh_target_max"), V = u("number.dsc_hub_vpd_target_min"), L = u("number.dsc_hub_vpd_target_max"), ae = u("number.dsc_hub_clone_target_temp"), ne = u("number.dsc_hub_clone_rh_min"), ve = u("number.dsc_hub_clone_rh_max"), P = u("number.dsc_hub_clone_vpd_min"), _e = u("number.dsc_hub_clone_vpd_max"), we = E.useMemo(() => Wa(y.series), [y.series]), it = E.useMemo(() => Wa(g.series), [g.series]);
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      nt,
      {
        icon: "climate",
        title: "Ops · Climate",
        subtitle: "Command, Want targets, zones, VPD, airflow.",
        actions: /* @__PURE__ */ s.jsx(
          Lu,
          {
            label: "Climate settings",
            items: [
              { id: "main", label: "Main 4×8", onSelect: () => c("/ops/main-4x8") },
              { id: "clone", label: "Clone 2×4", onSelect: () => c("/ops/clone-2x4") },
              { id: "home", label: "Ops Home", onSelect: () => c("/ops/home") }
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ue, { className: "dsc-glass", title: "Command", icon: "climate", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-row", children: [
          /* @__PURE__ */ s.jsx(je, { entityId: "switch.dsc_hub_tent_full_auto_mode", label: "Full Auto", icon: "ok" }),
          /* @__PURE__ */ s.jsx(je, { entityId: "switch.dsc_hub_manual_takeover", label: "Master takeover", icon: "alert" }),
          /* @__PURE__ */ s.jsx(je, { entityId: "switch.dsc_hub_tent_manual_override", label: "Fan override", icon: "climate" }),
          /* @__PURE__ */ s.jsx(
            je,
            {
              entityId: "switch.dsc_hub_humidifier_intake_routing",
              label: "Hum intake routing",
              icon: "climate"
            }
          ),
          /* @__PURE__ */ s.jsx(
            je,
            {
              entityId: "switch.dsc_hub_recirc_de_strat_pulse",
              label: "RECIRC de-strat",
              icon: "climate"
            }
          )
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-selects", children: [
          /* @__PURE__ */ s.jsx(Ou, { entityId: "select.dsc_hub_control_strategy", label: "Strategy", icon: "climate" }),
          /* @__PURE__ */ s.jsx(Ou, { entityId: "select.dsc_hub_priority_tent", label: "Priority tent", icon: "tent" })
        ] }),
        h ? /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
          /* @__PURE__ */ s.jsx(
            be,
            {
              icon: "alert",
              label: o("binary_sensor.dsc_reduced_kit") === "on" ? "Reduced kit" : "Full Auto",
              tone: o("binary_sensor.dsc_reduced_kit") === "on" ? "warn" : "ok"
            }
          ),
          " ",
          p || "Hub owns fans + appliance Autos when Full Auto is on."
        ] }) : null
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ue, { className: "dsc-glass", title: "Targets", icon: "gauge", children: /* @__PURE__ */ s.jsx(Tr, {}) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ue, { className: "dsc-glass", title: "Kit / In service", icon: "settings", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-row", children: [
        /* @__PURE__ */ s.jsx(je, { entityId: "input_boolean.dsc_ac_in_service", label: "AC in service", icon: "climate" }),
        /* @__PURE__ */ s.jsx(
          je,
          {
            entityId: "input_boolean.dsc_clone_humidifier_in_service",
            label: "Clone mister",
            icon: "clone"
          }
        ),
        /* @__PURE__ */ s.jsx(je, { entityId: "input_boolean.dsc_pot1_in_service", label: "Pot 1", icon: "root" }),
        /* @__PURE__ */ s.jsx(je, { entityId: "input_boolean.dsc_pot2_in_service", label: "Pot 2", icon: "root" }),
        /* @__PURE__ */ s.jsx(je, { entityId: "input_boolean.dsc_pot3_in_service", label: "Pot 3", icon: "root" }),
        /* @__PURE__ */ s.jsx(je, { entityId: "input_boolean.dsc_pot4_in_service", label: "Pot 4", icon: "root" })
      ] }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(Le, { label: "Tent °C", value: st(u("sensor.dsc_hub_tent_temperature")), unit: "°C" }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(Le, { label: "Tent RH", value: st(u("sensor.dsc_hub_tent_humidity"), 0), unit: "%" }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(Le, { label: "VPD", value: st(u("sensor.dsc_hub_vpd_kpa"), 2), unit: "kPa" }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(Le, { label: "Room °C", value: st(u("sensor.dsc_hub_room_temperature")), unit: "°C" }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(
        Le,
        {
          label: "CFM OUT",
          value: st(u("sensor.dsc_cfm_exhaust_out"), 0),
          unit: "cfm",
          sub: `Fan ${st(u("sensor.dsc_fan_exhaust_outside_pct"), 0)}%`
        }
      ) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(
        Le,
        {
          label: "CFM RECIRC",
          value: st(u("sensor.dsc_cfm_exhaust_recirc"), 0),
          unit: "cfm",
          sub: `Fan ${st(u("sensor.dsc_fan_exhaust_room_pct"), 0)}%`
        }
      ) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(Le, { label: "Intake main", value: st(u("sensor.dsc_cfm_intake_main"), 0), unit: "cfm" }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(Le, { label: "Intake 2×4", value: st(u("sensor.dsc_cfm_intake_2x4"), 0), unit: "cfm" }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(ue, { className: "dsc-glass", title: "Main tent T + RH", icon: "tent", children: /* @__PURE__ */ s.jsx(
        fa,
        {
          lastSyncAt: Math.max(y.lastSyncAt ?? 0, g.lastSyncAt ?? 0) || void 0,
          series: [
            {
              id: "t",
              label: "Temp °C",
              series: y.series,
              color: "var(--dsc-neon)",
              axis: "left",
              unit: "°C"
            },
            {
              id: "rh",
              label: "RH %",
              series: g.series,
              color: "var(--dsc-teal)",
              axis: "right",
              unit: "%"
            }
          ],
          targets: [
            { axis: "left", value: G, color: "var(--dsc-amber)", label: "Want T" },
            { axis: "right", min: D, max: Q, color: "var(--dsc-teal)" }
          ]
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(ue, { className: "dsc-glass", title: "Clone tent T + RH", icon: "clone", children: /* @__PURE__ */ s.jsx(
        fa,
        {
          lastSyncAt: Math.max(v.lastSyncAt ?? 0, x.lastSyncAt ?? 0) || void 0,
          series: [
            {
              id: "t",
              label: "Temp °C",
              series: v.series,
              color: "var(--dsc-neon)",
              axis: "left",
              unit: "°C"
            },
            {
              id: "rh",
              label: "RH %",
              series: x.series,
              color: "var(--dsc-teal)",
              axis: "right",
              unit: "%"
            }
          ],
          targets: [
            {
              axis: "left",
              value: ae,
              color: "var(--dsc-amber)",
              label: "Want T"
            },
            { axis: "right", min: ne, max: ve, color: "var(--dsc-teal)" }
          ]
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(ue, { className: "dsc-glass", title: "Exhaust CFM", icon: "climate", children: /* @__PURE__ */ s.jsx(
        fa,
        {
          unit: "cfm",
          lastSyncAt: Math.max(j.lastSyncAt ?? 0, T.lastSyncAt ?? 0) || void 0,
          series: [
            {
              id: "out",
              label: "OUT",
              series: j.series,
              color: "var(--dsc-neon)",
              unit: "cfm"
            },
            {
              id: "recirc",
              label: "RECIRC",
              series: T.series,
              color: "var(--dsc-amber)",
              unit: "cfm"
            }
          ]
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(ue, { className: "dsc-glass", title: "Fan duty %", icon: "climate", children: [
        /* @__PURE__ */ s.jsx(
          fa,
          {
            unit: "%",
            lastSyncAt: Math.max(Y.lastSyncAt ?? 0, X.lastSyncAt ?? 0) || void 0,
            series: [
              {
                id: "fout",
                label: "OUT %",
                series: Y.series,
                color: "var(--dsc-teal)",
                unit: "%"
              },
              {
                id: "frec",
                label: "RECIRC %",
                series: X.series,
                color: "var(--dsc-amber)",
                unit: "%"
              }
            ]
          }
        ),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-fan-stack", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ s.jsx(
            Ql,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_main",
              label: "Intake Main",
              disabled: !d
            }
          ),
          /* @__PURE__ */ s.jsx(
            Ql,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_2x4",
              label: "Intake 2×4",
              disabled: !d
            }
          ),
          /* @__PURE__ */ s.jsx(
            Ql,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_room",
              label: "Exhaust room",
              disabled: !d
            }
          ),
          /* @__PURE__ */ s.jsx(
            Ql,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_outside",
              label: "Exhaust outside",
              disabled: !d
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ue, { className: "dsc-glass", title: "Zone gauges", icon: "gauge", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-gauge-row", children: [
        /* @__PURE__ */ s.jsx(
          Yt,
          {
            label: "Tent T",
            value: u("sensor.dsc_hub_tent_temperature"),
            min: 15,
            max: 35,
            unit: "°C",
            target: G,
            extrema: we
          }
        ),
        /* @__PURE__ */ s.jsx(
          Yt,
          {
            label: "Tent RH",
            value: u("sensor.dsc_hub_tent_humidity"),
            min: 0,
            max: 100,
            unit: "%",
            band: { min: D, max: Q },
            extrema: it
          }
        ),
        /* @__PURE__ */ s.jsx(
          Yt,
          {
            label: "VPD",
            value: u("sensor.dsc_hub_vpd_kpa"),
            min: 0,
            max: 2.5,
            unit: "kPa",
            band: { min: V, max: L }
          }
        ),
        /* @__PURE__ */ s.jsx(
          Yt,
          {
            label: "Clone T",
            value: u("sensor.dsc_hub_clone_temperature"),
            min: 15,
            max: 35,
            unit: "°C",
            target: ae
          }
        ),
        /* @__PURE__ */ s.jsx(
          Yt,
          {
            label: "Clone RH",
            value: u("sensor.dsc_hub_clone_humidity"),
            min: 0,
            max: 100,
            unit: "%",
            band: { min: ne, max: ve }
          }
        ),
        /* @__PURE__ */ s.jsx(
          Yt,
          {
            label: "Clone VPD",
            value: u("sensor.dsc_hub_clone_vpd_kpa"),
            min: 0,
            max: 2.5,
            unit: "kPa",
            band: { min: P, max: _e }
          }
        )
      ] }) }) })
    ] })
  ] });
}
function Th({
  title: u,
  icon: o,
  tempId: f,
  rhId: c,
  vpdId: d,
  tent: h
}) {
  const { num: p } = Fe(), y = gt(f), g = gt(c), v = h === "main" ? "number.dsc_hub_target_temp" : "number.dsc_hub_clone_target_temp", x = h === "main" ? "number.dsc_hub_rh_target_min" : "number.dsc_hub_clone_rh_min", j = h === "main" ? "number.dsc_hub_rh_target_max" : "number.dsc_hub_clone_rh_max", T = h === "main" ? "number.dsc_hub_vpd_target_min" : "number.dsc_hub_clone_vpd_min", Y = h === "main" ? "number.dsc_hub_vpd_target_max" : "number.dsc_hub_clone_vpd_max", X = p(v), G = p(x), D = p(j), Q = p(T), V = p(Y), L = E.useMemo(() => Wa(y.series), [y.series]), ae = E.useMemo(() => Wa(g.series), [g.series]);
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(nt, { icon: o, title: u }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ue, { className: "dsc-glass", title: "Targets", icon: "gauge", children: /* @__PURE__ */ s.jsx(Tr, { emphasize: h }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(Le, { label: "Temperature", value: st(p(f)), unit: "°C" }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(Le, { label: "Humidity", value: st(p(c), 0), unit: "%" }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(
        Le,
        {
          label: "VPD",
          value: d ? st(p(d), 2) : "—",
          unit: "kPa",
          tone: d ? "normal" : "muted"
        }
      ) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ue, { className: "dsc-glass", title: "Temp + RH", icon: "climate", children: /* @__PURE__ */ s.jsx(
        fa,
        {
          lastSyncAt: Math.max(y.lastSyncAt ?? 0, g.lastSyncAt ?? 0) || void 0,
          series: [
            {
              id: "t",
              label: "Temp °C",
              series: y.series,
              color: "var(--dsc-neon)",
              axis: "left",
              unit: "°C"
            },
            {
              id: "rh",
              label: "RH %",
              series: g.series,
              color: "var(--dsc-teal)",
              axis: "right",
              unit: "%"
            }
          ],
          targets: [
            { axis: "left", value: X, color: "var(--dsc-amber)", label: "Want T" },
            { axis: "right", min: G, max: D, color: "var(--dsc-teal)" }
          ]
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(ue, { title: "Temp trace", children: /* @__PURE__ */ s.jsx(
        Du,
        {
          series: y.series,
          unit: "°C",
          lastSyncAt: y.lastSyncAt,
          targets: [{ value: X, color: "var(--dsc-amber)", label: "Want" }]
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(ue, { title: "RH trace", children: /* @__PURE__ */ s.jsx(
        Du,
        {
          series: g.series,
          unit: "%",
          color: "var(--dsc-teal)",
          lastSyncAt: g.lastSyncAt,
          targets: [{ min: G, max: D, color: "var(--dsc-teal)" }]
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ue, { className: "dsc-glass", title: "Gauges", icon: "gauge", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-gauge-row", children: [
        /* @__PURE__ */ s.jsx(
          Yt,
          {
            label: "Temp",
            value: p(f),
            min: 15,
            max: 35,
            unit: "°C",
            target: X,
            extrema: L
          }
        ),
        /* @__PURE__ */ s.jsx(
          Yt,
          {
            label: "RH",
            value: p(c),
            min: 0,
            max: 100,
            unit: "%",
            band: { min: G, max: D },
            extrema: ae
          }
        ),
        d ? /* @__PURE__ */ s.jsx(
          Yt,
          {
            label: "VPD",
            value: p(d),
            min: 0,
            max: 2.5,
            unit: "kPa",
            band: { min: Q, max: V }
          }
        ) : null
      ] }) }) })
    ] })
  ] });
}
function f0() {
  return /* @__PURE__ */ s.jsx(
    Th,
    {
      title: "Ops · Main 4×8",
      icon: "tent",
      tempId: "sensor.dsc_hub_tent_temperature",
      rhId: "sensor.dsc_hub_tent_humidity",
      vpdId: "sensor.dsc_hub_vpd_kpa",
      tent: "main"
    }
  );
}
function d0() {
  return /* @__PURE__ */ s.jsx(
    Th,
    {
      title: "Ops · Clone 2×4",
      icon: "clone",
      tempId: "sensor.dsc_hub_clone_temperature",
      rhId: "sensor.dsc_hub_clone_humidity",
      vpdId: "sensor.dsc_hub_clone_vpd_kpa",
      tent: "clone"
    }
  );
}
function m0() {
  const { num: u, state: o, entity: f, tick: c } = Fe(), d = Zl(), h = [1, 2, 3, 4].map((p) => Ar(p, { state: o, entity: f }));
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      nt,
      {
        icon: "root",
        title: "Ops · Root zone",
        subtitle: "Per-pot soil Got + roster blend — click a row for Plant Seat."
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(Le, { label: "Coldest root", value: st(u("sensor.dsc_coldest_root_zone_temp")), unit: "°C" }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(Le, { label: "Heat mat on time", value: st(u("sensor.dsc_heatmat_relay_on_time"), 0), unit: "s" }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(ue, { title: "Notes", children: /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { margin: 0 }, children: [
        "Mat loop uses per-pot sense with plausibility filter. State:",
        " ",
        o("sensor.dsc_coldest_root_zone_temp", "—")
      ] }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ue, { className: "dsc-glass", title: "Pots", icon: "root", children: /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "Pot" }),
          /* @__PURE__ */ s.jsx("th", { children: "Name" }),
          /* @__PURE__ */ s.jsx("th", { children: "Tent" }),
          /* @__PURE__ */ s.jsx("th", { children: "M" }),
          /* @__PURE__ */ s.jsx("th", { children: "T" }),
          /* @__PURE__ */ s.jsx("th", { children: "EC" }),
          /* @__PURE__ */ s.jsx("th", { children: "pH" }),
          /* @__PURE__ */ s.jsx("th", { children: "NPK" }),
          /* @__PURE__ */ s.jsx("th", { children: "Blend" })
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: h.map((p) => /* @__PURE__ */ s.jsxs("tr", { onClick: () => d(`/ops/plant-seat?pot=${p.pot}`), children: [
          /* @__PURE__ */ s.jsxs("td", { children: [
            "P",
            p.pot
          ] }),
          /* @__PURE__ */ s.jsx("td", { children: p.plantName }),
          /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx(
            be,
            {
              label: qu(p.tent),
              tone: p.tent === "unassigned" ? "muted" : "ok"
            }
          ) }),
          /* @__PURE__ */ s.jsx("td", { children: p.moisture }),
          /* @__PURE__ */ s.jsx("td", { children: p.soilTemp }),
          /* @__PURE__ */ s.jsx("td", { children: p.ec }),
          /* @__PURE__ */ s.jsx("td", { children: p.ph }),
          /* @__PURE__ */ s.jsxs("td", { children: [
            p.n,
            "/",
            p.p,
            "/",
            p.k
          ] }),
          /* @__PURE__ */ s.jsx("td", { className: "dsc-muted", children: p.blend || "—" })
        ] }, p.pot)) })
      ] }) }) })
    ] })
  ] });
}
function h0() {
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(nt, { icon: "tank", title: "Ops · Tank", subtitle: "Reservoir / tank vitals + system map." }),
    /* @__PURE__ */ s.jsx("div", { className: "dsc-grid", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ue, { className: "dsc-glass", title: "System map", icon: "system", children: /* @__PURE__ */ s.jsx(Yu, { tag: "dsc-system-map-card", config: {} }) }) }) })
  ] });
}
function p0() {
  const { state: u, num: o } = Fe();
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      nt,
      {
        icon: "lighting",
        title: "Ops · Lighting",
        subtitle: "Photoperiod and expected light hours."
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(
        Le,
        {
          label: "Expected light hours",
          value: st(o("sensor.dsc_expected_light_hours"), 1),
          unit: "h"
        }
      ) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-8", children: /* @__PURE__ */ s.jsxs(ue, { className: "dsc-glass", title: "SF1000", icon: "lighting", children: [
        /* @__PURE__ */ s.jsx("div", { className: "dsc-demand-row", children: /* @__PURE__ */ s.jsx(
          je,
          {
            entityId: "light.dsc_hub_sf1000_dimmer",
            label: "SF1000",
            icon: "lighting",
            showBrightness: !0
          }
        ) }),
        /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { margin: "8px 0 0" }, children: [
          "Expected: ",
          u("sensor.dsc_expected_light_hours", "—"),
          ". Fixture detail remains on firmware / packages."
        ] })
      ] }) })
    ] })
  ] });
}
function v0() {
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      nt,
      {
        icon: "plant",
        title: "Plant",
        subtitle: "Build, catalog research, roster seats, and mix tools."
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsxs(ue, { className: "dsc-glass", title: "Build a Plant", icon: "build", children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Compose soil blend, roster, and climate Want." }),
        /* @__PURE__ */ s.jsx(Gt, { to: "/plant/build", children: /* @__PURE__ */ s.jsx(Xt, { primary: !0, children: "Open Build" }) })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsxs(ue, { className: "dsc-glass", title: "Catalog Explorer", icon: "catalog", children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Browse strains, nutrients, mediums, lights." }),
        /* @__PURE__ */ s.jsx(Gt, { to: "/plant/catalog", children: /* @__PURE__ */ s.jsx(Xt, { primary: !0, children: "Open Catalog" }) })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsxs(ue, { className: "dsc-glass", title: "Plant seat", icon: "seat", children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Soil, age, nutrients, tent apply." }),
        /* @__PURE__ */ s.jsxs("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ s.jsx(Gt, { to: "/plant/seat?pot=1", children: /* @__PURE__ */ s.jsx(Xt, { primary: !0, children: "Open Seat" }) }),
          /* @__PURE__ */ s.jsx(Gt, { to: "/plant/strains", children: /* @__PURE__ */ s.jsx(Xt, { teal: !0, children: "Strains" }) }),
          /* @__PURE__ */ s.jsx(Gt, { to: "/plant/nutrient", children: /* @__PURE__ */ s.jsx(Xt, { teal: !0, children: "Nutrient" }) })
        ] })
      ] }) })
    ] })
  ] });
}
function g0() {
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(nt, { icon: "build", title: "Plant · Build", subtitle: "Compose mode — result-first glass card." }),
    /* @__PURE__ */ s.jsx(Yu, { tag: "dsc-build-plant-card", config: {} })
  ] });
}
function y0() {
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(nt, { icon: "catalog", title: "Plant · Catalog", subtitle: "Research browser over /local/dsc-catalog indexes." }),
    /* @__PURE__ */ s.jsx(Yu, { tag: "dsc-catalog-browse-card", config: {} })
  ] });
}
function b0() {
  const { entity: u, state: o, tick: f } = Fe(), c = l0(u);
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(nt, { icon: "strains", title: "Plant · Strains", subtitle: "Roster seats — open a row for Plant Seat." }),
    /* @__PURE__ */ s.jsxs(ue, { className: "dsc-glass", title: "Roster", icon: "strains", children: [
      c.length ? /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "Slot" }),
          /* @__PURE__ */ s.jsx("th", { children: "Name" }),
          /* @__PURE__ */ s.jsx("th", { children: "Strain" }),
          /* @__PURE__ */ s.jsx("th", { children: "Status" }),
          /* @__PURE__ */ s.jsx("th", { children: "Pot" }),
          /* @__PURE__ */ s.jsx("th", { children: "Tent" })
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: c.map((d) => {
          const h = Number(d.pot), p = h >= 1 && h <= 4 ? qu(Nh(o, h)) : "—";
          return /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsxs("td", { children: [
              "#",
              d.slot
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: d.nickname || "—" }),
            /* @__PURE__ */ s.jsx("td", { children: d.strain || "—" }),
            /* @__PURE__ */ s.jsx("td", { children: d.status || "—" }),
            /* @__PURE__ */ s.jsx("td", { children: h >= 1 && h <= 4 ? /* @__PURE__ */ s.jsxs(Gt, { to: `/plant/seat?pot=${h}`, children: [
              "P",
              h
            ] }) : "—" }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx(be, { label: p, tone: "muted" }) })
          ] }, d.slot);
        }) })
      ] }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "No plants in roster yet. Commit from Build, then assign a pot." }),
      /* @__PURE__ */ s.jsx("div", { style: { marginTop: 12 }, children: /* @__PURE__ */ s.jsx(Gt, { to: "/plant/build", children: /* @__PURE__ */ s.jsx(Xt, { primary: !0, children: /* @__PURE__ */ s.jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ s.jsx(Jt, { name: "build", size: 14 }),
        " Use in Build"
      ] }) }) }) })
    ] })
  ] });
}
function x0() {
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(nt, { icon: "nutrient", title: "Plant · Nutrient science", subtitle: "Mix lab / dose tools." }),
    /* @__PURE__ */ s.jsxs(ue, { title: "Mix lab", children: [
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "Nutrient dose and stage tools — open Build for the interactive mixer, Catalog for SKU research." }),
      /* @__PURE__ */ s.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ s.jsx(Gt, { to: "/plant/build", children: /* @__PURE__ */ s.jsx(Xt, { primary: !0, children: "Build mixer" }) }),
        /* @__PURE__ */ s.jsx(Gt, { to: "/plant/catalog", children: /* @__PURE__ */ s.jsx(Xt, { children: "Catalog nutrients" }) })
      ] })
    ] })
  ] });
}
function _0(u = 1) {
  const [o, f] = wy(), c = Number(o.get("pot") || u);
  return [c >= 1 && c <= 4 ? c : u, (p) => {
    const y = new URLSearchParams(o);
    y.set("pot", String(p)), f(y, { replace: !0 });
  }];
}
function ah() {
  const { state: u, entity: o, callService: f, tick: c } = Fe(), [d, h] = _0(1), p = Zl(), y = Ar(d, { state: u, entity: o }), g = (v) => {
    f("script", "turn_on", {
      entity_id: "script.dsc_apply_pot_to_tent",
      variables: { pot: String(d), tent: v }
    });
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      nt,
      {
        icon: "seat",
        title: `Plant seat · POT${d}`,
        subtitle: "Soil, age, nutrients, live Got — apply tent to move on The Dash."
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 14 }, children: [
      [1, 2, 3, 4].map((v) => /* @__PURE__ */ s.jsxs(
        "button",
        {
          type: "button",
          className: `dsc-chip${v === d ? " dsc-chip--ok" : ""}`,
          onClick: () => h(v),
          children: [
            "P",
            v
          ]
        },
        v
      )),
      /* @__PURE__ */ s.jsx(be, { label: qu(y.tent), tone: y.tent === "unassigned" ? "muted" : "ok" }),
      y.rosterSlot != null ? /* @__PURE__ */ s.jsx(be, { label: `Roster #${y.rosterSlot}`, tone: "muted" }) : /* @__PURE__ */ s.jsx(be, { label: "No roster join", tone: "warn" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-seat-layout", children: [
      /* @__PURE__ */ s.jsxs(ue, { className: "dsc-glass dsc-glass--glow", title: "Medium", children: [
        /* @__PURE__ */ s.jsx(Ky, { layers: y.layers }),
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 10, fontSize: 12 }, children: y.blend || "Blend lives on roster after commit — not invented here." })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", style: { gap: 14 }, children: [
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(
          ue,
          {
            className: "dsc-glass",
            title: "Identity",
            children: /* @__PURE__ */ s.jsxs("div", { style: { display: "flex", justifyContent: "space-between", gap: 12 }, children: [
              /* @__PURE__ */ s.jsxs("div", { children: [
                /* @__PURE__ */ s.jsx("div", { className: "dsc-kpi-value", style: { fontSize: "1.45rem" }, children: y.plantName !== "—" ? y.plantName : `POT${d}` }),
                /* @__PURE__ */ s.jsx("div", { className: "dsc-kpi-sub", children: y.strainDisplay }),
                /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginTop: 10 }, children: [
                  /* @__PURE__ */ s.jsx(be, { label: `Day ${y.days}`, tone: "ok" }),
                  /* @__PURE__ */ s.jsx(be, { label: y.stage, tone: "muted" }),
                  /* @__PURE__ */ s.jsx(be, { label: `Sprout ${y.sprout}`, tone: "muted" })
                ] })
              ] }),
              /* @__PURE__ */ s.jsx(
                Lu,
                {
                  items: [
                    {
                      id: "build",
                      label: "Open Build",
                      onSelect: () => p("/plant/build")
                    },
                    {
                      id: "root",
                      label: "Root zone",
                      onSelect: () => p("/ops/root-zone")
                    },
                    {
                      id: "dash",
                      label: "Open Dash",
                      onSelect: () => p("/ops/dash")
                    }
                  ]
                }
              )
            ] })
          }
        ) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(ue, { title: "Nutrition", children: [
          /* @__PURE__ */ s.jsx("p", { style: { margin: "0 0 6px" }, children: y.recipe || "No roster recipe — catalog doses only, never invented." }),
          y.notes ? /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: y.notes }) : null
        ] }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(ue, { title: "Live Got", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
            /* @__PURE__ */ s.jsx(be, { label: `M ${y.moisture}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(be, { label: `T ${y.soilTemp}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(be, { label: `EC ${y.ec}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(be, { label: `pH ${y.ph}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(be, { label: `N ${y.n}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(be, { label: `P ${y.p}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(be, { label: `K ${y.k}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(
              be,
              {
                label: y.need,
                tone: y.need !== "—" && y.need !== "OK" ? "warn" : "ok"
              }
            )
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: "NPK = trend indicators. Unavailable stays —." })
        ] }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ue, { className: "dsc-glass", title: "Apply to tent", children: [
          /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "Digital-twin placement. Moves the plant on The Dash; does not rewrite climate Want." }),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-seat-actions", children: [
            /* @__PURE__ */ s.jsx(Xt, { primary: y.tent === "clone", onClick: () => g("clone"), children: "Clone 2×4" }),
            /* @__PURE__ */ s.jsx(Xt, { primary: y.tent === "main", onClick: () => g("main"), children: "Main 4×8" }),
            /* @__PURE__ */ s.jsx(Xt, { onClick: () => g("unassigned"), children: "Unassigned" }),
            /* @__PURE__ */ s.jsx(Gt, { to: "/ops/dash", children: /* @__PURE__ */ s.jsx(Xt, { children: "Open Dash" }) })
          ] })
        ] }) })
      ] })
    ] })
  ] });
}
function S0() {
  const { state: u } = Fe();
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(nt, { icon: "learning", title: "Advanced · Learning", subtitle: "Learning loop status and notes." }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(ue, { className: "dsc-glass", title: "Status", icon: "learning", children: /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { marginTop: 0 }, children: [
        "Surface: ",
        u("sensor.dsc_ha_surface_version", "6.3.0"),
        ". Durable learning math belongs in brain/."
      ] }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(Le, { label: "Hub beat", value: u("sensor.dsc_hub_heartbeat", "—") }) })
    ] })
  ] });
}
function j0() {
  const u = gt("sensor.dsc_hub_tent_temperature", { maxPoints: 96 }), o = gt("sensor.dsc_hub_tent_humidity", { maxPoints: 96 });
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(nt, { icon: "trends", title: "Advanced · Trends", subtitle: "History-seeded trends with live append." }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(ue, { className: "dsc-glass", title: "Tent temperature", icon: "climate", children: /* @__PURE__ */ s.jsx(
        Du,
        {
          series: u.series,
          unit: "°C",
          live: !0,
          lastSyncAt: u.lastSyncAt
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(ue, { className: "dsc-glass", title: "Tent humidity", icon: "climate", children: /* @__PURE__ */ s.jsx(
        Du,
        {
          series: o.series,
          unit: "%",
          color: "var(--dsc-teal)",
          live: !0,
          lastSyncAt: o.lastSyncAt
        }
      ) }) })
    ] })
  ] });
}
function E0() {
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      nt,
      {
        icon: "history",
        title: "Advanced · History",
        subtitle: "HA Recorder remains the lab history store for now."
      }
    ),
    /* @__PURE__ */ s.jsx(ue, { className: "dsc-glass", title: "History", icon: "history", children: /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "Deep history charts stay on HA recorder / Trends while brain history matures. Use Trends for live session traces." }) })
  ] });
}
function N0() {
  const { state: u, available: o, num: f } = Fe(), c = o("sensor.dsc_hub_uptime");
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(nt, { icon: "system", title: "System", subtitle: "Diagnostics, versions, kit, and panel health." }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(
        Le,
        {
          label: "Hub link",
          value: c ? "OK" : "DOWN",
          tone: c ? "ok" : "bad",
          sub: `Uptime raw ${u("sensor.dsc_hub_uptime", "—")}`
        }
      ) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(Le, { label: "Surface", value: u("sensor.dsc_ha_surface_version", "6.3.0"), sub: "Panel product shell" }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(
        Le,
        {
          label: "Alerts",
          value: Number.isFinite(f("sensor.dsc_active_alert_count")) ? f("sensor.dsc_active_alert_count") : "—",
          tone: f("sensor.dsc_active_alert_count", 0) === 0 ? "ok" : "bad"
        }
      ) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ue, { className: "dsc-glass", title: "Kit / In service", icon: "settings", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-row", children: [
        /* @__PURE__ */ s.jsx(je, { entityId: "input_boolean.dsc_ac_in_service", label: "AC in service", icon: "climate" }),
        /* @__PURE__ */ s.jsx(
          je,
          {
            entityId: "input_boolean.dsc_clone_humidifier_in_service",
            label: "Clone mister",
            icon: "clone"
          }
        ),
        /* @__PURE__ */ s.jsx(je, { entityId: "input_boolean.dsc_pot1_in_service", label: "Pot 1", icon: "root" }),
        /* @__PURE__ */ s.jsx(je, { entityId: "input_boolean.dsc_pot2_in_service", label: "Pot 2", icon: "root" }),
        /* @__PURE__ */ s.jsx(je, { entityId: "input_boolean.dsc_pot3_in_service", label: "Pot 3", icon: "root" }),
        /* @__PURE__ */ s.jsx(je, { entityId: "input_boolean.dsc_pot4_in_service", label: "Pot 4", icon: "root" })
      ] }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(ue, { className: "dsc-glass", title: "Fleet", icon: "system", children: /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: u("sensor.dsc_fleet_version_status", "—") }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(ue, { className: "dsc-glass", title: "Panel", icon: "system", children: /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { marginTop: 0 }, children: [
        "Custom panel ",
        /* @__PURE__ */ s.jsx("code", { children: "/dsc-hub" }),
        " · React + Vite · assets under",
        " ",
        /* @__PURE__ */ s.jsx("code", { children: "/dsc_hub/assets" }),
        "."
      ] }) }) })
    ] })
  ] });
}
const T0 = [
  { id: "ops", label: "Ops", path: "/ops", icon: "ops" },
  { id: "plant", label: "Plant", path: "/plant", icon: "plant" },
  { id: "advanced", label: "Advanced", path: "/advanced", icon: "advanced" },
  { id: "system", label: "System", path: "/system", icon: "system" }
], A0 = {
  ops: [
    { id: "home", label: "Home", path: "/ops/home", icon: "home" },
    { id: "dash", label: "Dash", path: "/ops/dash", icon: "dash" },
    { id: "climate", label: "Climate", path: "/ops/climate", icon: "climate" },
    { id: "main-4x8", label: "Main 4×8", path: "/ops/main-4x8", icon: "tent" },
    { id: "clone-2x4", label: "Clone 2×4", path: "/ops/clone-2x4", icon: "clone" },
    { id: "root-zone", label: "Root zone", path: "/ops/root-zone", icon: "root" },
    { id: "plant-seat", label: "Plant seat", path: "/ops/plant-seat", icon: "seat" },
    { id: "tank", label: "Tank", path: "/ops/tank", icon: "tank" },
    { id: "lighting", label: "Lighting", path: "/ops/lighting", icon: "lighting" }
  ],
  plant: [
    { id: "hub", label: "Hub", path: "/plant", icon: "plant" },
    { id: "build", label: "Build", path: "/plant/build", icon: "build" },
    { id: "catalog", label: "Catalog", path: "/plant/catalog", icon: "catalog" },
    { id: "seat", label: "Seat", path: "/plant/seat", icon: "seat" },
    { id: "strains", label: "Strains", path: "/plant/strains", icon: "strains" },
    { id: "nutrient", label: "Nutrient science", path: "/plant/nutrient", icon: "nutrient" }
  ],
  advanced: [
    { id: "learning", label: "Learning", path: "/advanced/learning", icon: "learning" },
    { id: "trends", label: "Trends", path: "/advanced/trends", icon: "trends" },
    { id: "history", label: "History", path: "/advanced/history", icon: "history" }
  ],
  system: [{ id: "overview", label: "Overview", path: "/system", icon: "system" }]
};
function z0(u) {
  return u.includes("/plant") ? "plant" : u.includes("/advanced") ? "advanced" : u.includes("/system") ? "system" : "ops";
}
const M0 = ':host,.dsc-root{--dsc-black: #070907;--dsc-black-2: #0c100d;--dsc-gray-1: #151a16;--dsc-gray-2: #1c241e;--dsc-gray-3: #2a342c;--dsc-gray-4: #6b7a6e;--dsc-gray-5: #9aab9e;--dsc-neon: #39ff14;--dsc-neon-dim: rgba(57, 255, 20, .35);--dsc-neon-glow: rgba(57, 255, 20, .55);--dsc-teal: #26c6da;--dsc-teal-dim: rgba(38, 198, 218, .4);--dsc-teal-glow: rgba(38, 198, 218, .55);--dsc-amber: #ffb74d;--dsc-bad: #ff6b6b;--dsc-bad-soft: #ff8a8a;--dsc-soil-1: #5b9f6b;--dsc-soil-2: #4a8f9f;--dsc-soil-3: #c4a35a;--dsc-soil-4: #8d6e63;--dsc-glass: rgba(12, 18, 16, .72);--dsc-glass-border: rgba(120, 180, 160, .28);--dsc-white: #f4f7f4;--dsc-shadow: 0 8px 24px rgba(0, 0, 0, .45);--dsc-shadow-tight: 0 2px 8px rgba(0, 0, 0, .55);--dsc-radius: 10px;--dsc-radius-lg: 14px;--dsc-font: "Segoe UI", "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;--dsc-mono: "Cascadia Code", "IBM Plex Mono", ui-monospace, monospace;color:var(--dsc-white);background:var(--dsc-black);font-family:var(--dsc-font);display:block;height:100%;box-sizing:border-box}*,*:before,*:after{box-sizing:border-box}.dsc-root{height:100%;min-height:100%;overflow:auto;background:radial-gradient(1200px 600px at 10% -10%,rgba(57,255,20,.06),transparent 55%),radial-gradient(900px 500px at 90% 0%,rgba(255,255,255,.03),transparent 50%),var(--dsc-black)}.dsc-shell{display:flex;flex-direction:column;min-height:100%;max-width:1600px;margin:0 auto;padding:16px 20px 28px}.dsc-brand-row{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:10px}.dsc-brand{display:flex;align-items:center;gap:12px;color:var(--dsc-white);text-decoration:none}.dsc-brand img,.dsc-brand svg{width:36px;height:36px;color:var(--dsc-neon)}.dsc-brand-title{display:flex;flex-direction:column;gap:2px}.dsc-brand-title strong{font-size:1.15rem;letter-spacing:.14em;font-weight:700}.dsc-brand-wordmark{height:18px;width:auto;max-width:160px;display:block;filter:brightness(0) invert(1)}.dsc-brand-title span{font-size:.72rem;color:var(--dsc-gray-5);letter-spacing:.08em;text-transform:uppercase}.dsc-page-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px}.dsc-page-header-main{display:flex;align-items:flex-start;gap:10px}.dsc-page-header-actions{display:flex;align-items:center;gap:6px;flex-shrink:0}.dsc-card-title{display:inline-flex;align-items:center;gap:8px}.dsc-primary-tabs,.dsc-secondary-tabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:thin;padding-bottom:2px;-webkit-overflow-scrolling:touch}.dsc-primary-tabs{border-bottom:1px solid var(--dsc-gray-3);margin-bottom:8px}.dsc-secondary-tabs{margin-bottom:16px;mask-image:linear-gradient(90deg,#000 85%,transparent)}.dsc-secondary-tabs:after{content:"";flex:0 0 12px}.dsc-tab{appearance:none;border:1px solid transparent;background:transparent;color:var(--dsc-gray-5);padding:10px 14px;min-height:44px;border-radius:8px 8px 0 0;cursor:pointer;font:inherit;font-size:.92rem;letter-spacing:.04em;white-space:nowrap;display:inline-flex;align-items:center;gap:8px;transition:transform .1s ease,box-shadow .1s ease,color .15s ease,border-color .15s ease,background .15s ease;text-decoration:none}.dsc-tab span[role=img]{opacity:.9;flex-shrink:0}.dsc-tab:hover{color:var(--dsc-white);background:var(--dsc-gray-1)}.dsc-tab:focus-visible{outline:2px solid var(--dsc-neon);outline-offset:2px}.dsc-tab.active{color:var(--dsc-white);border-bottom:2px solid var(--dsc-neon);box-shadow:0 6px 18px #39ff1414}.dsc-secondary-tabs .dsc-tab{border-radius:999px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-1);min-height:40px;padding:8px 14px}.dsc-secondary-tabs .dsc-tab.active{border-color:var(--dsc-neon-dim);color:var(--dsc-neon);background:#39ff1414;box-shadow:var(--dsc-shadow-tight)}.dsc-btn{appearance:none;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);border-radius:8px;padding:10px 16px;min-height:40px;font:inherit;cursor:pointer;box-shadow:var(--dsc-shadow-tight);transition:transform .1s ease,box-shadow .1s ease,border-color .12s ease,background .12s ease}.dsc-btn:hover{border-color:var(--dsc-neon-dim)}.dsc-btn:active,.dsc-tab:active{transform:translateY(1px);box-shadow:0 1px 3px #000000a6}.dsc-btn.primary{border-color:var(--dsc-neon-dim);color:var(--dsc-black);background:var(--dsc-neon);font-weight:650}.dsc-page{animation:dsc-fade .18s ease}@keyframes dsc-fade{0%{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.dsc-page,.dsc-btn,.dsc-tab,.dsc-live-pulse{animation:none!important;transition:none!important}}.dsc-grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:14px}.dsc-col-3{grid-column:span 3}.dsc-col-4{grid-column:span 4}.dsc-col-6{grid-column:span 6}.dsc-col-8{grid-column:span 8}.dsc-col-12{grid-column:span 12}@media(max-width:1100px){.dsc-col-3,.dsc-col-4{grid-column:span 6}.dsc-col-8{grid-column:span 12}}@media(max-width:720px){.dsc-shell{padding:12px}.dsc-col-3,.dsc-col-4,.dsc-col-6,.dsc-col-8{grid-column:span 12}}.dsc-card{background:linear-gradient(165deg,var(--dsc-gray-1),var(--dsc-black-2));border:1px solid var(--dsc-gray-3);border-radius:var(--dsc-radius);box-shadow:var(--dsc-shadow);padding:14px 16px;min-height:88px}.dsc-card h2,.dsc-card h3{margin:0 0 8px;font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;color:var(--dsc-gray-5);font-weight:600}.dsc-kpi-value{font-size:1.85rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:.02em;color:var(--dsc-white)}.dsc-kpi-unit{margin-left:6px;font-size:.85rem;color:var(--dsc-gray-5)}.dsc-kpi-sub{margin-top:6px;color:var(--dsc-gray-5);font-size:.82rem}.dsc-status-ok{color:var(--dsc-neon)}.dsc-status-bad{color:var(--dsc-bad)}.dsc-status-muted{color:var(--dsc-gray-5)}.dsc-page-title{margin:0 0 14px;font-size:1.35rem;letter-spacing:.04em}.dsc-muted{color:var(--dsc-gray-5)}.dsc-legacy-host{min-height:420px;border-radius:var(--dsc-radius);overflow:hidden;border:1px solid var(--dsc-gray-3);background:#000}.dsc-legacy-host--empty{background:var(--dsc-gray-1);min-height:160px}.dsc-legacy-host>*{display:block;width:100%}.dsc-status-strip{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}.dsc-chip-row{display:flex;flex-wrap:wrap;gap:8px}.dsc-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-1);font-size:.75rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-chip--ok{color:var(--dsc-neon);border-color:var(--dsc-neon-dim);background:#39ff1414;box-shadow:0 0 12px #39ff141f}.dsc-chip--bad{color:var(--dsc-bad-soft);border-color:color-mix(in srgb,var(--dsc-bad) 45%,transparent);background:color-mix(in srgb,var(--dsc-bad) 12%,transparent)}.dsc-chip--warn{color:var(--dsc-amber);border-color:color-mix(in srgb,var(--dsc-amber) 45%,transparent);background:color-mix(in srgb,var(--dsc-amber) 12%,transparent)}.dsc-chip--muted{color:var(--dsc-gray-5)}.dsc-chip--pulse{animation:dsc-chip-pulse 1.6s ease-in-out infinite}@keyframes dsc-chip-pulse{0%,to{box-shadow:0 0 #39ff1400}50%{box-shadow:0 0 14px #39ff1459}}.dsc-demand-row{display:flex;flex-wrap:wrap;gap:8px}.dsc-demand-row--stack{flex-direction:column}.dsc-demand{appearance:none;flex:1 1 110px;min-height:52px;padding:10px 12px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);font:inherit;cursor:pointer;display:flex;flex-direction:column;align-items:flex-start;gap:4px;box-shadow:var(--dsc-shadow-tight);transition:transform .1s ease,box-shadow .1s ease,border-color .12s ease,background .12s ease}.dsc-demand:hover{border-color:var(--dsc-neon-dim)}.dsc-demand:active{transform:translateY(1px);box-shadow:0 1px 3px #000000a6}.dsc-demand.is-on{border-color:var(--dsc-neon);background:#39ff141a;box-shadow:0 0 0 1px #39ff1440,0 0 18px #39ff1433}.dsc-demand.is-missing{opacity:.55;cursor:not-allowed}.dsc-demand-label{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-demand.is-on .dsc-demand-label{color:var(--dsc-neon)}.dsc-demand-state{font-weight:700;font-variant-numeric:tabular-nums;font-size:1rem}.dsc-demand-icon{margin-bottom:2px}.dsc-mode-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}.dsc-mode-selects{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}.dsc-entity-select{display:flex;flex-direction:column;gap:6px;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-entity-select-label{display:inline-flex;align-items:center;gap:6px}.dsc-entity-select select{appearance:none;min-height:40px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);padding:8px 12px;font:inherit;text-transform:none;letter-spacing:0}.dsc-entity-select.is-disabled{opacity:.55}.dsc-fan-stack{display:flex;flex-direction:column;gap:10px}.dsc-fan-slider{display:flex;flex-direction:column;gap:4px}.dsc-fan-slider-label{display:flex;align-items:baseline;gap:8px;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-fan-slider-label strong{color:var(--dsc-teal);font-variant-numeric:tabular-nums}.dsc-fan-slider input[type=range]{width:100%;accent-color:var(--dsc-teal)}.dsc-fan-slider.is-disabled{opacity:.5}.dsc-honesty{margin:10px 0 0;font-size:.85rem;color:var(--dsc-gray-5);display:flex;flex-wrap:wrap;align-items:center;gap:8px}.dsc-target-panel{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}.dsc-target-panel.is-compact .dsc-target-grid{grid-template-columns:repeat(auto-fit,minmax(90px,1fr))}.dsc-tent-targets{border:1px solid var(--dsc-glass-border);border-radius:var(--dsc-radius);padding:10px 12px;background:#0000002e}.dsc-tent-targets-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}.dsc-got-want{display:flex;flex-direction:column;gap:2px;font-size:.82rem;margin-bottom:10px}.dsc-target-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px}.dsc-target-num{display:flex;flex-direction:column;gap:4px;font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-target-num input{min-height:36px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);padding:6px 8px;font:inherit;font-variant-numeric:tabular-nums}.dsc-target-num.is-disabled{opacity:.55}.dsc-chart{position:relative}.dsc-chart-svg{cursor:crosshair;touch-action:none}.dsc-chart-tooltip{position:absolute;top:8px;transform:translate(-50%);pointer-events:none;z-index:2;min-width:120px;padding:8px 10px;border-radius:8px;border:1px solid var(--dsc-glass-border);background:var(--dsc-glass);backdrop-filter:blur(10px);box-shadow:var(--dsc-shadow-tight);font-size:.75rem}.dsc-chart-tooltip-time{color:var(--dsc-teal);font-family:var(--dsc-mono);margin-bottom:4px}.dsc-chart-tooltip-row{display:flex;align-items:center;gap:6px;color:var(--dsc-white)}.dsc-chart-tooltip-row i{width:7px;height:7px;border-radius:50%;display:inline-block}@keyframes dsc-sync-pulse{0%{stroke-dashoffset:1;opacity:.2}35%{opacity:1}to{stroke-dashoffset:0;opacity:0}}@media(prefers-reduced-motion:reduce){.dsc-chart-pulse{animation:none!important;opacity:.85}}.dsc-gauge.is-warn .dsc-gauge-label{color:var(--dsc-amber)}.dsc-gauge-row{display:flex;justify-content:space-around;flex-wrap:wrap;gap:8px}.dsc-gauge{display:flex;flex-direction:column;align-items:center;gap:4px}.dsc-gauge-label{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-chart-legend{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:4px;min-height:20px}.dsc-chart-legend-item{display:inline-flex;align-items:center;gap:6px;font-size:.75rem;color:var(--dsc-gray-5)}.dsc-chart-legend-item i{width:8px;height:8px;border-radius:50%;display:inline-block;box-shadow:0 0 6px currentColor}.dsc-chart-last{margin-left:auto;font-variant-numeric:tabular-nums;color:var(--dsc-neon);font-size:13px;font-weight:650}.dsc-fault-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.dsc-fault-list li{display:flex;flex-wrap:wrap;align-items:center;gap:10px}.dsc-empty{padding:18px 14px;border:1px dashed var(--dsc-gray-3);border-radius:8px;color:var(--dsc-gray-5);background:#00000040;font-size:.9rem;line-height:1.45}.dsc-empty--ok{border-style:solid;border-color:var(--dsc-neon-dim);color:var(--dsc-neon)}.dsc-btn:disabled{opacity:.45;cursor:not-allowed}.dsc-glass{background:var(--dsc-glass);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid var(--dsc-glass-border);border-radius:var(--dsc-radius-lg);box-shadow:var(--dsc-shadow)}.dsc-glass--glow{border-color:var(--dsc-teal-dim);box-shadow:0 0 0 1px #26c6da26,0 0 24px #26c6da1f}.dsc-icon-btn{appearance:none;width:36px;height:36px;padding:0;display:inline-flex;align-items:center;justify-content:center;border-radius:10px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);cursor:pointer;box-shadow:var(--dsc-shadow-tight);transition:border-color .12s ease,background .12s ease,transform .1s ease}.dsc-icon-btn:hover{border-color:var(--dsc-teal-dim);color:var(--dsc-teal)}.dsc-icon-btn:active{transform:translateY(1px)}.dsc-result-chip{display:inline-flex;align-items:center;gap:8px;max-width:100%;padding:8px 12px;border-radius:999px;border:1px solid var(--dsc-teal-dim);background:#26c6da1a;color:var(--dsc-white);font-size:.9rem}.dsc-result-chip span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dsc-overflow{position:relative;display:inline-block}.dsc-overflow-menu{position:absolute;right:0;top:calc(100% + 6px);z-index:40;min-width:180px;padding:6px;background:var(--dsc-black-2);border:1px solid var(--dsc-gray-3);border-radius:10px;box-shadow:var(--dsc-shadow)}.dsc-overflow-menu button{appearance:none;width:100%;text-align:left;border:0;background:transparent;color:var(--dsc-white);font:inherit;font-size:.88rem;padding:10px 12px;border-radius:8px;cursor:pointer}.dsc-overflow-menu button:hover{background:#26c6da1f;color:var(--dsc-teal)}.dsc-drawer-root{position:fixed;inset:0;z-index:80;pointer-events:none}.dsc-drawer-root.is-open{pointer-events:auto}.dsc-drawer-scrim{position:absolute;inset:0;background:#00000073;opacity:0;transition:opacity .18s ease}.dsc-drawer-root.is-open .dsc-drawer-scrim{opacity:1}.dsc-drawer-panel{position:absolute;top:0;bottom:0;width:min(380px,92vw);background:linear-gradient(165deg,#121a16,#0a100e);border:1px solid var(--dsc-glass-border);box-shadow:-12px 0 40px #0000008c;display:flex;flex-direction:column;transition:transform .22s ease}.dsc-drawer-panel.right{right:0;transform:translate(105%);border-radius:14px 0 0 14px}.dsc-drawer-panel.left{left:0;transform:translate(-105%);border-radius:0 14px 14px 0}.dsc-drawer-root.is-open .dsc-drawer-panel.right,.dsc-drawer-root.is-open .dsc-drawer-panel.left{transform:none}.dsc-drawer-rail{position:absolute;top:50%;transform:translateY(-50%);width:28px;height:64px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:2}.dsc-drawer-panel.right .dsc-drawer-rail{left:-28px;border-radius:10px 0 0 10px}.dsc-drawer-panel.left .dsc-drawer-rail{right:-28px;border-radius:0 10px 10px 0}.dsc-drawer-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid var(--dsc-gray-3)}.dsc-drawer-head h2{margin:0;font-size:.85rem;letter-spacing:.12em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-drawer-body{flex:1;overflow:auto;padding:14px 16px}.dsc-soil{width:100%;max-width:280px;margin:0 auto}.dsc-soil-pot{position:relative;width:100%;aspect-ratio:4 / 5;border-radius:12px 12px 28px 28px;border:2px solid rgba(120,160,130,.45);background:linear-gradient(180deg,#1a1410,#0e0c0a);overflow:hidden;box-shadow:inset 0 0 24px #0000008c,0 0 20px #26c6da14}.dsc-soil-pot.is-valid{border-color:var(--dsc-teal-dim);box-shadow:inset 0 0 24px #0000008c,0 0 28px #26c6da47,0 0 42px #39ff141f}.dsc-soil-layer{position:absolute;left:8%;right:8%;display:flex;align-items:center;justify-content:center;font-size:.72rem;letter-spacing:.04em;color:#f4f7f4eb;text-shadow:0 1px 2px rgba(0,0,0,.65);border-top:1px solid rgba(255,255,255,.08)}.dsc-soil-empty{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--dsc-gray-5);font-size:.85rem;padding:16px;text-align:center}.dsc-seat-layout{display:grid;grid-template-columns:minmax(200px,320px) 1fr;gap:18px;align-items:start}@media(max-width:900px){.dsc-seat-layout{grid-template-columns:1fr}}.dsc-seat-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.dsc-table{width:100%;border-collapse:collapse;font-size:.88rem}.dsc-table th,.dsc-table td{text-align:left;padding:8px 6px;border-bottom:1px solid var(--dsc-gray-3)}.dsc-table th{font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--dsc-gray-5);font-weight:600}.dsc-table tr{cursor:pointer}.dsc-table tr:hover td{background:#26c6da0f}.dsc-btn.teal{border-color:var(--dsc-teal-dim);background:#26c6da2e;color:var(--dsc-white);box-shadow:0 0 18px #26c6da33}.dsc-btn.teal.primary{background:var(--dsc-teal);color:#041018;font-weight:650}@media(prefers-reduced-motion:reduce){.dsc-drawer-panel,.dsc-drawer-scrim{transition:none!important}}', R0 = M0;
function C0() {
  const u = kt(), o = z0(u.pathname), f = A0[o];
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-shell", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-brand-row", children: [
      /* @__PURE__ */ s.jsxs(Mu, { className: "dsc-brand", to: "/ops/home", children: [
        /* @__PURE__ */ s.jsx(Jt, { name: "brand", size: 36, color: "var(--dsc-neon)" }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-brand-title", children: [
          /* @__PURE__ */ s.jsx(
            "img",
            {
              className: "dsc-brand-wordmark",
              src: "/dsc_hub/assets/brand/dsc-brand-wordmark.svg",
              alt: "DSC-HUB"
            }
          ),
          /* @__PURE__ */ s.jsx("span", { children: "Grow operations panel" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-muted", style: { fontSize: 12, letterSpacing: "0.08em" }, children: "SURFACE 6.3.0" })
    ] }),
    /* @__PURE__ */ s.jsx("nav", { className: "dsc-primary-tabs", "aria-label": "Primary", children: T0.map((c) => /* @__PURE__ */ s.jsxs(
      Mu,
      {
        to: c.path,
        className: ({ isActive: d }) => `dsc-tab${d || o === c.id ? " active" : ""}`,
        children: [
          /* @__PURE__ */ s.jsx(Jt, { name: c.icon, size: 15 }),
          c.label
        ]
      },
      c.id
    )) }),
    /* @__PURE__ */ s.jsx("nav", { className: "dsc-secondary-tabs", "aria-label": "Section pages", children: f.map((c) => /* @__PURE__ */ s.jsxs(
      Mu,
      {
        to: c.path,
        end: c.path === "/plant" || c.path === "/system",
        className: ({ isActive: d }) => `dsc-tab${d ? " active" : ""}`,
        children: [
          /* @__PURE__ */ s.jsx(Jt, { name: c.icon, size: 14 }),
          c.label
        ]
      },
      c.id
    )) }),
    /* @__PURE__ */ s.jsxs(uy, { children: [
      /* @__PURE__ */ s.jsx(De, { path: "/", element: /* @__PURE__ */ s.jsx(ju, { to: "/ops/home", replace: !0 }) }),
      /* @__PURE__ */ s.jsx(De, { path: "/ops", element: /* @__PURE__ */ s.jsx(ju, { to: "/ops/home", replace: !0 }) }),
      /* @__PURE__ */ s.jsx(De, { path: "/ops/home", element: /* @__PURE__ */ s.jsx(i0, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/ops/dash", element: /* @__PURE__ */ s.jsx(r0, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/ops/climate", element: /* @__PURE__ */ s.jsx(o0, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/ops/main-4x8", element: /* @__PURE__ */ s.jsx(f0, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/ops/clone-2x4", element: /* @__PURE__ */ s.jsx(d0, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/ops/root-zone", element: /* @__PURE__ */ s.jsx(m0, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/ops/plant-seat", element: /* @__PURE__ */ s.jsx(ah, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/ops/tank", element: /* @__PURE__ */ s.jsx(h0, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/ops/lighting", element: /* @__PURE__ */ s.jsx(p0, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/plant", element: /* @__PURE__ */ s.jsx(v0, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/plant/build", element: /* @__PURE__ */ s.jsx(g0, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/plant/catalog", element: /* @__PURE__ */ s.jsx(y0, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/plant/seat", element: /* @__PURE__ */ s.jsx(ah, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/plant/strains", element: /* @__PURE__ */ s.jsx(b0, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/plant/nutrient", element: /* @__PURE__ */ s.jsx(x0, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/advanced", element: /* @__PURE__ */ s.jsx(ju, { to: "/advanced/learning", replace: !0 }) }),
      /* @__PURE__ */ s.jsx(De, { path: "/advanced/learning", element: /* @__PURE__ */ s.jsx(S0, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/advanced/trends", element: /* @__PURE__ */ s.jsx(j0, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/advanced/history", element: /* @__PURE__ */ s.jsx(E0, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/system", element: /* @__PURE__ */ s.jsx(N0, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "*", element: /* @__PURE__ */ s.jsx(ju, { to: "/ops/home", replace: !0 }) })
    ] })
  ] });
}
function O0({ hass: u }) {
  return /* @__PURE__ */ s.jsx(Qy, { hass: u, children: /* @__PURE__ */ s.jsx(C0, {}) });
}
function D0({
  panel: u
}) {
  const [o, f] = E.useState(() => u.hass);
  return E.useEffect(() => {
    const c = () => f(u.hass);
    return c(), u.addEventListener("hass-updated", c), () => {
      u.removeEventListener("hass-updated", c);
    };
  }, [u]), /* @__PURE__ */ s.jsx(Cy, { children: /* @__PURE__ */ s.jsx(O0, { hass: o }) });
}
class U0 extends HTMLElement {
  constructor() {
    super(...arguments);
    Su(this, "_root", null);
    Su(this, "_hass", null);
    Su(this, "_mounted", !1);
  }
  set hass(f) {
    this._hass = f, this.dispatchEvent(new Event("hass-updated"));
  }
  get hass() {
    return this._hass;
  }
  connectedCallback() {
    if (this.shadowRoot || this.attachShadow({ mode: "open" }), !this._mounted) {
      const f = document.createElement("style");
      f.textContent = `:host{display:block;height:100%;background:#070907;color:#f4f7f4;}
${R0}`, this.shadowRoot.appendChild(f);
      const c = document.createElement("div");
      c.className = "dsc-root", c.style.height = "100%", this.shadowRoot.appendChild(c), this._root = sg.createRoot(c), this._root.render(/* @__PURE__ */ s.jsx(D0, { panel: this })), this._mounted = !0;
    }
  }
  disconnectedCallback() {
    this._root?.unmount(), this._root = null, this._mounted = !1;
  }
}
customElements.get("dsc-hub-panel") || customElements.define("dsc-hub-panel", U0);
export {
  U0 as default
};
//# sourceMappingURL=dsc-hub-panel.js.map
