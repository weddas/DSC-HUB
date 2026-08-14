var y0 = Object.defineProperty;
var b0 = (i, r, o) => r in i ? y0(i, r, { enumerable: !0, configurable: !0, writable: !0, value: o }) : i[r] = o;
var Gs = (i, r, o) => b0(i, typeof r != "symbol" ? r + "" : r, o);
var wr = { exports: {} }, mi = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Fh;
function _0() {
  if (Fh) return mi;
  Fh = 1;
  var i = Symbol.for("react.transitional.element"), r = Symbol.for("react.fragment");
  function o(u, f, h) {
    var g = null;
    if (h !== void 0 && (g = "" + h), f.key !== void 0 && (g = "" + f.key), "key" in f) {
      h = {};
      for (var x in f)
        x !== "key" && (h[x] = f[x]);
    } else h = f;
    return f = h.ref, {
      $$typeof: i,
      type: u,
      key: g,
      ref: f !== void 0 ? f : null,
      props: h
    };
  }
  return mi.Fragment = r, mi.jsx = o, mi.jsxs = o, mi;
}
var Wh;
function S0() {
  return Wh || (Wh = 1, wr.exports = _0()), wr.exports;
}
var c = S0(), Nr = { exports: {} }, de = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ph;
function j0() {
  if (Ph) return de;
  Ph = 1;
  var i = Symbol.for("react.transitional.element"), r = Symbol.for("react.portal"), o = Symbol.for("react.fragment"), u = Symbol.for("react.strict_mode"), f = Symbol.for("react.profiler"), h = Symbol.for("react.consumer"), g = Symbol.for("react.context"), x = Symbol.for("react.forward_ref"), v = Symbol.for("react.suspense"), m = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), b = Symbol.for("react.activity"), N = Symbol.iterator;
  function L(S) {
    return S === null || typeof S != "object" ? null : (S = N && S[N] || S["@@iterator"], typeof S == "function" ? S : null);
  }
  var G = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, Y = Object.assign, O = {};
  function V(S, D, X) {
    this.props = S, this.context = D, this.refs = O, this.updater = X || G;
  }
  V.prototype.isReactComponent = {}, V.prototype.setState = function(S, D) {
    if (typeof S != "object" && typeof S != "function" && S != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, S, D, "setState");
  }, V.prototype.forceUpdate = function(S) {
    this.updater.enqueueForceUpdate(this, S, "forceUpdate");
  };
  function $() {
  }
  $.prototype = V.prototype;
  function q(S, D, X) {
    this.props = S, this.context = D, this.refs = O, this.updater = X || G;
  }
  var le = q.prototype = new $();
  le.constructor = q, Y(le, V.prototype), le.isPureReactComponent = !0;
  var se = Array.isArray;
  function re() {
  }
  var F = { H: null, A: null, T: null, S: null }, oe = Object.prototype.hasOwnProperty;
  function pe(S, D, X) {
    var K = X.ref;
    return {
      $$typeof: i,
      type: S,
      key: D,
      ref: K !== void 0 ? K : null,
      props: X
    };
  }
  function _e(S, D) {
    return pe(S.type, D, S.props);
  }
  function Ee(S) {
    return typeof S == "object" && S !== null && S.$$typeof === i;
  }
  function Se(S) {
    var D = { "=": "=0", ":": "=2" };
    return "$" + S.replace(/[=:]/g, function(X) {
      return D[X];
    });
  }
  var z = /\/+/g;
  function te(S, D) {
    return typeof S == "object" && S !== null && S.key != null ? Se("" + S.key) : D.toString(36);
  }
  function ee(S) {
    switch (S.status) {
      case "fulfilled":
        return S.value;
      case "rejected":
        throw S.reason;
      default:
        switch (typeof S.status == "string" ? S.then(re, re) : (S.status = "pending", S.then(
          function(D) {
            S.status === "pending" && (S.status = "fulfilled", S.value = D);
          },
          function(D) {
            S.status === "pending" && (S.status = "rejected", S.reason = D);
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
  function M(S, D, X, K, ae) {
    var Z = typeof S;
    (Z === "undefined" || Z === "boolean") && (S = null);
    var he = !1;
    if (S === null) he = !0;
    else
      switch (Z) {
        case "bigint":
        case "string":
        case "number":
          he = !0;
          break;
        case "object":
          switch (S.$$typeof) {
            case i:
            case r:
              he = !0;
              break;
            case y:
              return he = S._init, M(
                he(S._payload),
                D,
                X,
                K,
                ae
              );
          }
      }
    if (he)
      return ae = ae(S), he = K === "" ? "." + te(S, 0) : K, se(ae) ? (X = "", he != null && (X = he.replace(z, "$&/") + "/"), M(ae, D, X, "", function(mt) {
        return mt;
      })) : ae != null && (Ee(ae) && (ae = _e(
        ae,
        X + (ae.key == null || S && S.key === ae.key ? "" : ("" + ae.key).replace(
          z,
          "$&/"
        ) + "/") + he
      )), D.push(ae)), 1;
    he = 0;
    var lt = K === "" ? "." : K + ":";
    if (se(S))
      for (var Ye = 0; Ye < S.length; Ye++)
        K = S[Ye], Z = lt + te(K, Ye), he += M(
          K,
          D,
          X,
          Z,
          ae
        );
    else if (Ye = L(S), typeof Ye == "function")
      for (S = Ye.call(S), Ye = 0; !(K = S.next()).done; )
        K = K.value, Z = lt + te(K, Ye++), he += M(
          K,
          D,
          X,
          Z,
          ae
        );
    else if (Z === "object") {
      if (typeof S.then == "function")
        return M(
          ee(S),
          D,
          X,
          K,
          ae
        );
      throw D = String(S), Error(
        "Objects are not valid as a React child (found: " + (D === "[object Object]" ? "object with keys {" + Object.keys(S).join(", ") + "}" : D) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return he;
  }
  function U(S, D, X) {
    if (S == null) return S;
    var K = [], ae = 0;
    return M(S, K, "", "", function(Z) {
      return D.call(X, Z, ae++);
    }), K;
  }
  function Q(S) {
    if (S._status === -1) {
      var D = S._result;
      D = D(), D.then(
        function(X) {
          (S._status === 0 || S._status === -1) && (S._status = 1, S._result = X);
        },
        function(X) {
          (S._status === 0 || S._status === -1) && (S._status = 2, S._result = X);
        }
      ), S._status === -1 && (S._status = 0, S._result = D);
    }
    if (S._status === 1) return S._result.default;
    throw S._result;
  }
  var P = typeof reportError == "function" ? reportError : function(S) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var D = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof S == "object" && S !== null && typeof S.message == "string" ? String(S.message) : String(S),
        error: S
      });
      if (!window.dispatchEvent(D)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", S);
      return;
    }
    console.error(S);
  }, ue = {
    map: U,
    forEach: function(S, D, X) {
      U(
        S,
        function() {
          D.apply(this, arguments);
        },
        X
      );
    },
    count: function(S) {
      var D = 0;
      return U(S, function() {
        D++;
      }), D;
    },
    toArray: function(S) {
      return U(S, function(D) {
        return D;
      }) || [];
    },
    only: function(S) {
      if (!Ee(S))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return S;
    }
  };
  return de.Activity = b, de.Children = ue, de.Component = V, de.Fragment = o, de.Profiler = f, de.PureComponent = q, de.StrictMode = u, de.Suspense = v, de.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = F, de.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(S) {
      return F.H.useMemoCache(S);
    }
  }, de.cache = function(S) {
    return function() {
      return S.apply(null, arguments);
    };
  }, de.cacheSignal = function() {
    return null;
  }, de.cloneElement = function(S, D, X) {
    if (S == null)
      throw Error(
        "The argument must be a React element, but you passed " + S + "."
      );
    var K = Y({}, S.props), ae = S.key;
    if (D != null)
      for (Z in D.key !== void 0 && (ae = "" + D.key), D)
        !oe.call(D, Z) || Z === "key" || Z === "__self" || Z === "__source" || Z === "ref" && D.ref === void 0 || (K[Z] = D[Z]);
    var Z = arguments.length - 2;
    if (Z === 1) K.children = X;
    else if (1 < Z) {
      for (var he = Array(Z), lt = 0; lt < Z; lt++)
        he[lt] = arguments[lt + 2];
      K.children = he;
    }
    return pe(S.type, ae, K);
  }, de.createContext = function(S) {
    return S = {
      $$typeof: g,
      _currentValue: S,
      _currentValue2: S,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, S.Provider = S, S.Consumer = {
      $$typeof: h,
      _context: S
    }, S;
  }, de.createElement = function(S, D, X) {
    var K, ae = {}, Z = null;
    if (D != null)
      for (K in D.key !== void 0 && (Z = "" + D.key), D)
        oe.call(D, K) && K !== "key" && K !== "__self" && K !== "__source" && (ae[K] = D[K]);
    var he = arguments.length - 2;
    if (he === 1) ae.children = X;
    else if (1 < he) {
      for (var lt = Array(he), Ye = 0; Ye < he; Ye++)
        lt[Ye] = arguments[Ye + 2];
      ae.children = lt;
    }
    if (S && S.defaultProps)
      for (K in he = S.defaultProps, he)
        ae[K] === void 0 && (ae[K] = he[K]);
    return pe(S, Z, ae);
  }, de.createRef = function() {
    return { current: null };
  }, de.forwardRef = function(S) {
    return { $$typeof: x, render: S };
  }, de.isValidElement = Ee, de.lazy = function(S) {
    return {
      $$typeof: y,
      _payload: { _status: -1, _result: S },
      _init: Q
    };
  }, de.memo = function(S, D) {
    return {
      $$typeof: m,
      type: S,
      compare: D === void 0 ? null : D
    };
  }, de.startTransition = function(S) {
    var D = F.T, X = {};
    F.T = X;
    try {
      var K = S(), ae = F.S;
      ae !== null && ae(X, K), typeof K == "object" && K !== null && typeof K.then == "function" && K.then(re, P);
    } catch (Z) {
      P(Z);
    } finally {
      D !== null && X.types !== null && (D.types = X.types), F.T = D;
    }
  }, de.unstable_useCacheRefresh = function() {
    return F.H.useCacheRefresh();
  }, de.use = function(S) {
    return F.H.use(S);
  }, de.useActionState = function(S, D, X) {
    return F.H.useActionState(S, D, X);
  }, de.useCallback = function(S, D) {
    return F.H.useCallback(S, D);
  }, de.useContext = function(S) {
    return F.H.useContext(S);
  }, de.useDebugValue = function() {
  }, de.useDeferredValue = function(S, D) {
    return F.H.useDeferredValue(S, D);
  }, de.useEffect = function(S, D) {
    return F.H.useEffect(S, D);
  }, de.useEffectEvent = function(S) {
    return F.H.useEffectEvent(S);
  }, de.useId = function() {
    return F.H.useId();
  }, de.useImperativeHandle = function(S, D, X) {
    return F.H.useImperativeHandle(S, D, X);
  }, de.useInsertionEffect = function(S, D) {
    return F.H.useInsertionEffect(S, D);
  }, de.useLayoutEffect = function(S, D) {
    return F.H.useLayoutEffect(S, D);
  }, de.useMemo = function(S, D) {
    return F.H.useMemo(S, D);
  }, de.useOptimistic = function(S, D) {
    return F.H.useOptimistic(S, D);
  }, de.useReducer = function(S, D, X) {
    return F.H.useReducer(S, D, X);
  }, de.useRef = function(S) {
    return F.H.useRef(S);
  }, de.useState = function(S) {
    return F.H.useState(S);
  }, de.useSyncExternalStore = function(S, D, X) {
    return F.H.useSyncExternalStore(
      S,
      D,
      X
    );
  }, de.useTransition = function() {
    return F.H.useTransition();
  }, de.version = "19.2.8", de;
}
var Ih;
function Hr() {
  return Ih || (Ih = 1, Nr.exports = j0()), Nr.exports;
}
var j = Hr(), Er = { exports: {} }, pi = {}, Mr = { exports: {} }, Cr = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var em;
function w0() {
  return em || (em = 1, (function(i) {
    function r(M, U) {
      var Q = M.length;
      M.push(U);
      e: for (; 0 < Q; ) {
        var P = Q - 1 >>> 1, ue = M[P];
        if (0 < f(ue, U))
          M[P] = U, M[Q] = ue, Q = P;
        else break e;
      }
    }
    function o(M) {
      return M.length === 0 ? null : M[0];
    }
    function u(M) {
      if (M.length === 0) return null;
      var U = M[0], Q = M.pop();
      if (Q !== U) {
        M[0] = Q;
        e: for (var P = 0, ue = M.length, S = ue >>> 1; P < S; ) {
          var D = 2 * (P + 1) - 1, X = M[D], K = D + 1, ae = M[K];
          if (0 > f(X, Q))
            K < ue && 0 > f(ae, X) ? (M[P] = ae, M[K] = Q, P = K) : (M[P] = X, M[D] = Q, P = D);
          else if (K < ue && 0 > f(ae, Q))
            M[P] = ae, M[K] = Q, P = K;
          else break e;
        }
      }
      return U;
    }
    function f(M, U) {
      var Q = M.sortIndex - U.sortIndex;
      return Q !== 0 ? Q : M.id - U.id;
    }
    if (i.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var h = performance;
      i.unstable_now = function() {
        return h.now();
      };
    } else {
      var g = Date, x = g.now();
      i.unstable_now = function() {
        return g.now() - x;
      };
    }
    var v = [], m = [], y = 1, b = null, N = 3, L = !1, G = !1, Y = !1, O = !1, V = typeof setTimeout == "function" ? setTimeout : null, $ = typeof clearTimeout == "function" ? clearTimeout : null, q = typeof setImmediate < "u" ? setImmediate : null;
    function le(M) {
      for (var U = o(m); U !== null; ) {
        if (U.callback === null) u(m);
        else if (U.startTime <= M)
          u(m), U.sortIndex = U.expirationTime, r(v, U);
        else break;
        U = o(m);
      }
    }
    function se(M) {
      if (Y = !1, le(M), !G)
        if (o(v) !== null)
          G = !0, re || (re = !0, Se());
        else {
          var U = o(m);
          U !== null && ee(se, U.startTime - M);
        }
    }
    var re = !1, F = -1, oe = 5, pe = -1;
    function _e() {
      return O ? !0 : !(i.unstable_now() - pe < oe);
    }
    function Ee() {
      if (O = !1, re) {
        var M = i.unstable_now();
        pe = M;
        var U = !0;
        try {
          e: {
            G = !1, Y && (Y = !1, $(F), F = -1), L = !0;
            var Q = N;
            try {
              t: {
                for (le(M), b = o(v); b !== null && !(b.expirationTime > M && _e()); ) {
                  var P = b.callback;
                  if (typeof P == "function") {
                    b.callback = null, N = b.priorityLevel;
                    var ue = P(
                      b.expirationTime <= M
                    );
                    if (M = i.unstable_now(), typeof ue == "function") {
                      b.callback = ue, le(M), U = !0;
                      break t;
                    }
                    b === o(v) && u(v), le(M);
                  } else u(v);
                  b = o(v);
                }
                if (b !== null) U = !0;
                else {
                  var S = o(m);
                  S !== null && ee(
                    se,
                    S.startTime - M
                  ), U = !1;
                }
              }
              break e;
            } finally {
              b = null, N = Q, L = !1;
            }
            U = void 0;
          }
        } finally {
          U ? Se() : re = !1;
        }
      }
    }
    var Se;
    if (typeof q == "function")
      Se = function() {
        q(Ee);
      };
    else if (typeof MessageChannel < "u") {
      var z = new MessageChannel(), te = z.port2;
      z.port1.onmessage = Ee, Se = function() {
        te.postMessage(null);
      };
    } else
      Se = function() {
        V(Ee, 0);
      };
    function ee(M, U) {
      F = V(function() {
        M(i.unstable_now());
      }, U);
    }
    i.unstable_IdlePriority = 5, i.unstable_ImmediatePriority = 1, i.unstable_LowPriority = 4, i.unstable_NormalPriority = 3, i.unstable_Profiling = null, i.unstable_UserBlockingPriority = 2, i.unstable_cancelCallback = function(M) {
      M.callback = null;
    }, i.unstable_forceFrameRate = function(M) {
      0 > M || 125 < M ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : oe = 0 < M ? Math.floor(1e3 / M) : 5;
    }, i.unstable_getCurrentPriorityLevel = function() {
      return N;
    }, i.unstable_next = function(M) {
      switch (N) {
        case 1:
        case 2:
        case 3:
          var U = 3;
          break;
        default:
          U = N;
      }
      var Q = N;
      N = U;
      try {
        return M();
      } finally {
        N = Q;
      }
    }, i.unstable_requestPaint = function() {
      O = !0;
    }, i.unstable_runWithPriority = function(M, U) {
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
      var Q = N;
      N = M;
      try {
        return U();
      } finally {
        N = Q;
      }
    }, i.unstable_scheduleCallback = function(M, U, Q) {
      var P = i.unstable_now();
      switch (typeof Q == "object" && Q !== null ? (Q = Q.delay, Q = typeof Q == "number" && 0 < Q ? P + Q : P) : Q = P, M) {
        case 1:
          var ue = -1;
          break;
        case 2:
          ue = 250;
          break;
        case 5:
          ue = 1073741823;
          break;
        case 4:
          ue = 1e4;
          break;
        default:
          ue = 5e3;
      }
      return ue = Q + ue, M = {
        id: y++,
        callback: U,
        priorityLevel: M,
        startTime: Q,
        expirationTime: ue,
        sortIndex: -1
      }, Q > P ? (M.sortIndex = Q, r(m, M), o(v) === null && M === o(m) && (Y ? ($(F), F = -1) : Y = !0, ee(se, Q - P))) : (M.sortIndex = ue, r(v, M), G || L || (G = !0, re || (re = !0, Se()))), M;
    }, i.unstable_shouldYield = _e, i.unstable_wrapCallback = function(M) {
      var U = N;
      return function() {
        var Q = N;
        N = U;
        try {
          return M.apply(this, arguments);
        } finally {
          N = Q;
        }
      };
    };
  })(Cr)), Cr;
}
var tm;
function N0() {
  return tm || (tm = 1, Mr.exports = w0()), Mr.exports;
}
var Tr = { exports: {} }, dt = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var lm;
function E0() {
  if (lm) return dt;
  lm = 1;
  var i = Hr();
  function r(v) {
    var m = "https://react.dev/errors/" + v;
    if (1 < arguments.length) {
      m += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var y = 2; y < arguments.length; y++)
        m += "&args[]=" + encodeURIComponent(arguments[y]);
    }
    return "Minified React error #" + v + "; visit " + m + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function o() {
  }
  var u = {
    d: {
      f: o,
      r: function() {
        throw Error(r(522));
      },
      D: o,
      C: o,
      L: o,
      m: o,
      X: o,
      S: o,
      M: o
    },
    p: 0,
    findDOMNode: null
  }, f = Symbol.for("react.portal");
  function h(v, m, y) {
    var b = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: f,
      key: b == null ? null : "" + b,
      children: v,
      containerInfo: m,
      implementation: y
    };
  }
  var g = i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function x(v, m) {
    if (v === "font") return "";
    if (typeof m == "string")
      return m === "use-credentials" ? m : "";
  }
  return dt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = u, dt.createPortal = function(v, m) {
    var y = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!m || m.nodeType !== 1 && m.nodeType !== 9 && m.nodeType !== 11)
      throw Error(r(299));
    return h(v, m, null, y);
  }, dt.flushSync = function(v) {
    var m = g.T, y = u.p;
    try {
      if (g.T = null, u.p = 2, v) return v();
    } finally {
      g.T = m, u.p = y, u.d.f();
    }
  }, dt.preconnect = function(v, m) {
    typeof v == "string" && (m ? (m = m.crossOrigin, m = typeof m == "string" ? m === "use-credentials" ? m : "" : void 0) : m = null, u.d.C(v, m));
  }, dt.prefetchDNS = function(v) {
    typeof v == "string" && u.d.D(v);
  }, dt.preinit = function(v, m) {
    if (typeof v == "string" && m && typeof m.as == "string") {
      var y = m.as, b = x(y, m.crossOrigin), N = typeof m.integrity == "string" ? m.integrity : void 0, L = typeof m.fetchPriority == "string" ? m.fetchPriority : void 0;
      y === "style" ? u.d.S(
        v,
        typeof m.precedence == "string" ? m.precedence : void 0,
        {
          crossOrigin: b,
          integrity: N,
          fetchPriority: L
        }
      ) : y === "script" && u.d.X(v, {
        crossOrigin: b,
        integrity: N,
        fetchPriority: L,
        nonce: typeof m.nonce == "string" ? m.nonce : void 0
      });
    }
  }, dt.preinitModule = function(v, m) {
    if (typeof v == "string")
      if (typeof m == "object" && m !== null) {
        if (m.as == null || m.as === "script") {
          var y = x(
            m.as,
            m.crossOrigin
          );
          u.d.M(v, {
            crossOrigin: y,
            integrity: typeof m.integrity == "string" ? m.integrity : void 0,
            nonce: typeof m.nonce == "string" ? m.nonce : void 0
          });
        }
      } else m == null && u.d.M(v);
  }, dt.preload = function(v, m) {
    if (typeof v == "string" && typeof m == "object" && m !== null && typeof m.as == "string") {
      var y = m.as, b = x(y, m.crossOrigin);
      u.d.L(v, y, {
        crossOrigin: b,
        integrity: typeof m.integrity == "string" ? m.integrity : void 0,
        nonce: typeof m.nonce == "string" ? m.nonce : void 0,
        type: typeof m.type == "string" ? m.type : void 0,
        fetchPriority: typeof m.fetchPriority == "string" ? m.fetchPriority : void 0,
        referrerPolicy: typeof m.referrerPolicy == "string" ? m.referrerPolicy : void 0,
        imageSrcSet: typeof m.imageSrcSet == "string" ? m.imageSrcSet : void 0,
        imageSizes: typeof m.imageSizes == "string" ? m.imageSizes : void 0,
        media: typeof m.media == "string" ? m.media : void 0
      });
    }
  }, dt.preloadModule = function(v, m) {
    if (typeof v == "string")
      if (m) {
        var y = x(m.as, m.crossOrigin);
        u.d.m(v, {
          as: typeof m.as == "string" && m.as !== "script" ? m.as : void 0,
          crossOrigin: y,
          integrity: typeof m.integrity == "string" ? m.integrity : void 0
        });
      } else u.d.m(v);
  }, dt.requestFormReset = function(v) {
    u.d.r(v);
  }, dt.unstable_batchedUpdates = function(v, m) {
    return v(m);
  }, dt.useFormState = function(v, m, y) {
    return g.H.useFormState(v, m, y);
  }, dt.useFormStatus = function() {
    return g.H.useHostTransitionStatus();
  }, dt.version = "19.2.8", dt;
}
var am;
function M0() {
  if (am) return Tr.exports;
  am = 1;
  function i() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i);
      } catch (r) {
        console.error(r);
      }
  }
  return i(), Tr.exports = E0(), Tr.exports;
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
var nm;
function C0() {
  if (nm) return pi;
  nm = 1;
  var i = N0(), r = Hr(), o = M0();
  function u(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var l = 2; l < arguments.length; l++)
        t += "&args[]=" + encodeURIComponent(arguments[l]);
    }
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function f(e) {
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
  function g(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function x(e) {
    if (e.tag === 31) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function v(e) {
    if (h(e) !== e)
      throw Error(u(188));
  }
  function m(e) {
    var t = e.alternate;
    if (!t) {
      if (t = h(e), t === null) throw Error(u(188));
      return t !== e ? null : e;
    }
    for (var l = e, a = t; ; ) {
      var n = l.return;
      if (n === null) break;
      var s = n.alternate;
      if (s === null) {
        if (a = n.return, a !== null) {
          l = a;
          continue;
        }
        break;
      }
      if (n.child === s.child) {
        for (s = n.child; s; ) {
          if (s === l) return v(n), e;
          if (s === a) return v(n), t;
          s = s.sibling;
        }
        throw Error(u(188));
      }
      if (l.return !== a.return) l = n, a = s;
      else {
        for (var d = !1, p = n.child; p; ) {
          if (p === l) {
            d = !0, l = n, a = s;
            break;
          }
          if (p === a) {
            d = !0, a = n, l = s;
            break;
          }
          p = p.sibling;
        }
        if (!d) {
          for (p = s.child; p; ) {
            if (p === l) {
              d = !0, l = s, a = n;
              break;
            }
            if (p === a) {
              d = !0, a = s, l = n;
              break;
            }
            p = p.sibling;
          }
          if (!d) throw Error(u(189));
        }
      }
      if (l.alternate !== a) throw Error(u(190));
    }
    if (l.tag !== 3) throw Error(u(188));
    return l.stateNode.current === l ? e : t;
  }
  function y(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null; ) {
      if (t = y(e), t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var b = Object.assign, N = Symbol.for("react.element"), L = Symbol.for("react.transitional.element"), G = Symbol.for("react.portal"), Y = Symbol.for("react.fragment"), O = Symbol.for("react.strict_mode"), V = Symbol.for("react.profiler"), $ = Symbol.for("react.consumer"), q = Symbol.for("react.context"), le = Symbol.for("react.forward_ref"), se = Symbol.for("react.suspense"), re = Symbol.for("react.suspense_list"), F = Symbol.for("react.memo"), oe = Symbol.for("react.lazy"), pe = Symbol.for("react.activity"), _e = Symbol.for("react.memo_cache_sentinel"), Ee = Symbol.iterator;
  function Se(e) {
    return e === null || typeof e != "object" ? null : (e = Ee && e[Ee] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var z = Symbol.for("react.client.reference");
  function te(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === z ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case Y:
        return "Fragment";
      case V:
        return "Profiler";
      case O:
        return "StrictMode";
      case se:
        return "Suspense";
      case re:
        return "SuspenseList";
      case pe:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case G:
          return "Portal";
        case q:
          return e.displayName || "Context";
        case $:
          return (e._context.displayName || "Context") + ".Consumer";
        case le:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case F:
          return t = e.displayName || null, t !== null ? t : te(e.type) || "Memo";
        case oe:
          t = e._payload, e = e._init;
          try {
            return te(e(t));
          } catch {
          }
      }
    return null;
  }
  var ee = Array.isArray, M = r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, U = o.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Q = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, P = [], ue = -1;
  function S(e) {
    return { current: e };
  }
  function D(e) {
    0 > ue || (e.current = P[ue], P[ue] = null, ue--);
  }
  function X(e, t) {
    ue++, P[ue] = e.current, e.current = t;
  }
  var K = S(null), ae = S(null), Z = S(null), he = S(null);
  function lt(e, t) {
    switch (X(Z, t), X(ae, e), X(K, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? yh(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = yh(t), e = bh(t, e);
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
    D(K), X(K, e);
  }
  function Ye() {
    D(K), D(ae), D(Z);
  }
  function mt(e) {
    e.memoizedState !== null && X(he, e);
    var t = K.current, l = bh(t, e.type);
    t !== l && (X(ae, e), X(K, l));
  }
  function Ft(e) {
    ae.current === e && (D(K), D(ae)), he.current === e && (D(he), oi._currentValue = Q);
  }
  var wt, Cl;
  function tl(e) {
    if (wt === void 0)
      try {
        throw Error();
      } catch (l) {
        var t = l.stack.trim().match(/\n( *(at )?)/);
        wt = t && t[1] || "", Cl = -1 < l.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < l.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + wt + e + Cl;
  }
  var ll = !1;
  function Tl(e, t) {
    if (!e || ll) return "";
    ll = !0;
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
                } catch (A) {
                  var R = A;
                }
                Reflect.construct(e, [], B);
              } else {
                try {
                  B.call();
                } catch (A) {
                  R = A;
                }
                e.call(B.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (A) {
                R = A;
              }
              (B = e()) && typeof B.catch == "function" && B.catch(function() {
              });
            }
          } catch (A) {
            if (A && R && typeof A.stack == "string")
              return [A.stack, R.stack];
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
      var s = a.DetermineComponentFrameRoot(), d = s[0], p = s[1];
      if (d && p) {
        var _ = d.split(`
`), T = p.split(`
`);
        for (n = a = 0; a < _.length && !_[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; n < T.length && !T[n].includes(
          "DetermineComponentFrameRoot"
        ); )
          n++;
        if (a === _.length || n === T.length)
          for (a = _.length - 1, n = T.length - 1; 1 <= a && 0 <= n && _[a] !== T[n]; )
            n--;
        for (; 1 <= a && 0 <= n; a--, n--)
          if (_[a] !== T[n]) {
            if (a !== 1 || n !== 1)
              do
                if (a--, n--, 0 > n || _[a] !== T[n]) {
                  var k = `
` + _[a].replace(" at new ", " at ");
                  return e.displayName && k.includes("<anonymous>") && (k = k.replace("<anonymous>", e.displayName)), k;
                }
              while (1 <= a && 0 <= n);
            break;
          }
      }
    } finally {
      ll = !1, Error.prepareStackTrace = l;
    }
    return (l = e ? e.displayName || e.name : "") ? tl(l) : "";
  }
  function Ni(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return tl(e.type);
      case 16:
        return tl("Lazy");
      case 13:
        return e.child !== t && t !== null ? tl("Suspense Fallback") : tl("Suspense");
      case 19:
        return tl("SuspenseList");
      case 0:
      case 15:
        return Tl(e.type, !1);
      case 11:
        return Tl(e.type.render, !1);
      case 1:
        return Tl(e.type, !0);
      case 31:
        return tl("Activity");
      default:
        return "";
    }
  }
  function Ca(e) {
    try {
      var t = "", l = null;
      do
        t += Ni(e, l), l = e, e = e.return;
      while (e);
      return t;
    } catch (a) {
      return `
Error generating stack: ` + a.message + `
` + a.stack;
    }
  }
  var Rl = Object.prototype.hasOwnProperty, _n = i.unstable_scheduleCallback, aa = i.unstable_cancelCallback, oc = i.unstable_shouldYield, dc = i.unstable_requestPaint, Fe = i.unstable_now, Me = i.unstable_getCurrentPriorityLevel, Ta = i.unstable_ImmediatePriority, na = i.unstable_UserBlockingPriority, Ra = i.unstable_NormalPriority, ep = i.unstable_LowPriority, Wr = i.unstable_IdlePriority, tp = i.log, lp = i.unstable_setDisableYieldValue, Sn = null, Nt = null;
  function Al(e) {
    if (typeof tp == "function" && lp(e), Nt && typeof Nt.setStrictMode == "function")
      try {
        Nt.setStrictMode(Sn, e);
      } catch {
      }
  }
  var Et = Math.clz32 ? Math.clz32 : ip, ap = Math.log, np = Math.LN2;
  function ip(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (ap(e) / np | 0) | 0;
  }
  var Ei = 256, Mi = 262144, Ci = 4194304;
  function ia(e) {
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
  function Ti(e, t, l) {
    var a = e.pendingLanes;
    if (a === 0) return 0;
    var n = 0, s = e.suspendedLanes, d = e.pingedLanes;
    e = e.warmLanes;
    var p = a & 134217727;
    return p !== 0 ? (a = p & ~s, a !== 0 ? n = ia(a) : (d &= p, d !== 0 ? n = ia(d) : l || (l = p & ~e, l !== 0 && (n = ia(l))))) : (p = a & ~s, p !== 0 ? n = ia(p) : d !== 0 ? n = ia(d) : l || (l = a & ~e, l !== 0 && (n = ia(l)))), n === 0 ? 0 : t !== 0 && t !== n && (t & s) === 0 && (s = n & -n, l = t & -t, s >= l || s === 32 && (l & 4194048) !== 0) ? t : n;
  }
  function jn(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function sp(e, t) {
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
  function Pr() {
    var e = Ci;
    return Ci <<= 1, (Ci & 62914560) === 0 && (Ci = 4194304), e;
  }
  function fc(e) {
    for (var t = [], l = 0; 31 > l; l++) t.push(e);
    return t;
  }
  function wn(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function cp(e, t, l, a, n, s) {
    var d = e.pendingLanes;
    e.pendingLanes = l, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= l, e.entangledLanes &= l, e.errorRecoveryDisabledLanes &= l, e.shellSuspendCounter = 0;
    var p = e.entanglements, _ = e.expirationTimes, T = e.hiddenUpdates;
    for (l = d & ~l; 0 < l; ) {
      var k = 31 - Et(l), B = 1 << k;
      p[k] = 0, _[k] = -1;
      var R = T[k];
      if (R !== null)
        for (T[k] = null, k = 0; k < R.length; k++) {
          var A = R[k];
          A !== null && (A.lane &= -536870913);
        }
      l &= ~B;
    }
    a !== 0 && Ir(e, a, 0), s !== 0 && n === 0 && e.tag !== 0 && (e.suspendedLanes |= s & ~(d & ~t));
  }
  function Ir(e, t, l) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var a = 31 - Et(t);
    e.entangledLanes |= t, e.entanglements[a] = e.entanglements[a] | 1073741824 | l & 261930;
  }
  function eo(e, t) {
    var l = e.entangledLanes |= t;
    for (e = e.entanglements; l; ) {
      var a = 31 - Et(l), n = 1 << a;
      n & t | e[a] & t && (e[a] |= t), l &= ~n;
    }
  }
  function to(e, t) {
    var l = t & -t;
    return l = (l & 42) !== 0 ? 1 : hc(l), (l & (e.suspendedLanes | t)) !== 0 ? 0 : l;
  }
  function hc(e) {
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
  function mc(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function lo() {
    var e = U.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : Vh(e.type));
  }
  function ao(e, t) {
    var l = U.p;
    try {
      return U.p = e, t();
    } finally {
      U.p = l;
    }
  }
  var zl = Math.random().toString(36).slice(2), st = "__reactFiber$" + zl, pt = "__reactProps$" + zl, Aa = "__reactContainer$" + zl, pc = "__reactEvents$" + zl, up = "__reactListeners$" + zl, rp = "__reactHandles$" + zl, no = "__reactResources$" + zl, Nn = "__reactMarker$" + zl;
  function vc(e) {
    delete e[st], delete e[pt], delete e[pc], delete e[up], delete e[rp];
  }
  function za(e) {
    var t = e[st];
    if (t) return t;
    for (var l = e.parentNode; l; ) {
      if (t = l[Aa] || l[st]) {
        if (l = t.alternate, t.child !== null || l !== null && l.child !== null)
          for (e = Mh(e); e !== null; ) {
            if (l = e[st]) return l;
            e = Mh(e);
          }
        return t;
      }
      e = l, l = e.parentNode;
    }
    return null;
  }
  function Oa(e) {
    if (e = e[st] || e[Aa]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function En(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(u(33));
  }
  function Da(e) {
    var t = e[no];
    return t || (t = e[no] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function nt(e) {
    e[Nn] = !0;
  }
  var io = /* @__PURE__ */ new Set(), so = {};
  function sa(e, t) {
    ka(e, t), ka(e + "Capture", t);
  }
  function ka(e, t) {
    for (so[e] = t, e = 0; e < t.length; e++)
      io.add(t[e]);
  }
  var op = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), co = {}, uo = {};
  function dp(e) {
    return Rl.call(uo, e) ? !0 : Rl.call(co, e) ? !1 : op.test(e) ? uo[e] = !0 : (co[e] = !0, !1);
  }
  function Ri(e, t, l) {
    if (dp(t))
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
  function Ai(e, t, l) {
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
  function ul(e, t, l, a) {
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
  function Bt(e) {
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
  function ro(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function fp(e, t, l) {
    var a = Object.getOwnPropertyDescriptor(
      e.constructor.prototype,
      t
    );
    if (!e.hasOwnProperty(t) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
      var n = a.get, s = a.set;
      return Object.defineProperty(e, t, {
        configurable: !0,
        get: function() {
          return n.call(this);
        },
        set: function(d) {
          l = "" + d, s.call(this, d);
        }
      }), Object.defineProperty(e, t, {
        enumerable: a.enumerable
      }), {
        getValue: function() {
          return l;
        },
        setValue: function(d) {
          l = "" + d;
        },
        stopTracking: function() {
          e._valueTracker = null, delete e[t];
        }
      };
    }
  }
  function gc(e) {
    if (!e._valueTracker) {
      var t = ro(e) ? "checked" : "value";
      e._valueTracker = fp(
        e,
        t,
        "" + e[t]
      );
    }
  }
  function oo(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var l = t.getValue(), a = "";
    return e && (a = ro(e) ? e.checked ? "true" : "false" : e.value), e = a, e !== l ? (t.setValue(e), !0) : !1;
  }
  function zi(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var hp = /[\n"\\]/g;
  function Lt(e) {
    return e.replace(
      hp,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function xc(e, t, l, a, n, s, d, p) {
    e.name = "", d != null && typeof d != "function" && typeof d != "symbol" && typeof d != "boolean" ? e.type = d : e.removeAttribute("type"), t != null ? d === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Bt(t)) : e.value !== "" + Bt(t) && (e.value = "" + Bt(t)) : d !== "submit" && d !== "reset" || e.removeAttribute("value"), t != null ? yc(e, d, Bt(t)) : l != null ? yc(e, d, Bt(l)) : a != null && e.removeAttribute("value"), n == null && s != null && (e.defaultChecked = !!s), n != null && (e.checked = n && typeof n != "function" && typeof n != "symbol"), p != null && typeof p != "function" && typeof p != "symbol" && typeof p != "boolean" ? e.name = "" + Bt(p) : e.removeAttribute("name");
  }
  function fo(e, t, l, a, n, s, d, p) {
    if (s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" && (e.type = s), t != null || l != null) {
      if (!(s !== "submit" && s !== "reset" || t != null)) {
        gc(e);
        return;
      }
      l = l != null ? "" + Bt(l) : "", t = t != null ? "" + Bt(t) : l, p || t === e.value || (e.value = t), e.defaultValue = t;
    }
    a = a ?? n, a = typeof a != "function" && typeof a != "symbol" && !!a, e.checked = p ? e.checked : !!a, e.defaultChecked = !!a, d != null && typeof d != "function" && typeof d != "symbol" && typeof d != "boolean" && (e.name = d), gc(e);
  }
  function yc(e, t, l) {
    t === "number" && zi(e.ownerDocument) === e || e.defaultValue === "" + l || (e.defaultValue = "" + l);
  }
  function Ha(e, t, l, a) {
    if (e = e.options, t) {
      t = {};
      for (var n = 0; n < l.length; n++)
        t["$" + l[n]] = !0;
      for (l = 0; l < e.length; l++)
        n = t.hasOwnProperty("$" + e[l].value), e[l].selected !== n && (e[l].selected = n), n && a && (e[l].defaultSelected = !0);
    } else {
      for (l = "" + Bt(l), t = null, n = 0; n < e.length; n++) {
        if (e[n].value === l) {
          e[n].selected = !0, a && (e[n].defaultSelected = !0);
          return;
        }
        t !== null || e[n].disabled || (t = e[n]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function ho(e, t, l) {
    if (t != null && (t = "" + Bt(t), t !== e.value && (e.value = t), l == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = l != null ? "" + Bt(l) : "";
  }
  function mo(e, t, l, a) {
    if (t == null) {
      if (a != null) {
        if (l != null) throw Error(u(92));
        if (ee(a)) {
          if (1 < a.length) throw Error(u(93));
          a = a[0];
        }
        l = a;
      }
      l == null && (l = ""), t = l;
    }
    l = Bt(t), e.defaultValue = l, a = e.textContent, a === l && a !== "" && a !== null && (e.value = a), gc(e);
  }
  function Ua(e, t) {
    if (t) {
      var l = e.firstChild;
      if (l && l === e.lastChild && l.nodeType === 3) {
        l.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var mp = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function po(e, t, l) {
    var a = t.indexOf("--") === 0;
    l == null || typeof l == "boolean" || l === "" ? a ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : a ? e.setProperty(t, l) : typeof l != "number" || l === 0 || mp.has(t) ? t === "float" ? e.cssFloat = l : e[t] = ("" + l).trim() : e[t] = l + "px";
  }
  function vo(e, t, l) {
    if (t != null && typeof t != "object")
      throw Error(u(62));
    if (e = e.style, l != null) {
      for (var a in l)
        !l.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf("--") === 0 ? e.setProperty(a, "") : a === "float" ? e.cssFloat = "" : e[a] = "");
      for (var n in t)
        a = t[n], t.hasOwnProperty(n) && l[n] !== a && po(e, n, a);
    } else
      for (var s in t)
        t.hasOwnProperty(s) && po(e, s, t[s]);
  }
  function bc(e) {
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
  var pp = /* @__PURE__ */ new Map([
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
  ]), vp = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Oi(e) {
    return vp.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  function rl() {
  }
  var _c = null;
  function Sc(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Ba = null, La = null;
  function go(e) {
    var t = Oa(e);
    if (t && (e = t.stateNode)) {
      var l = e[pt] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (xc(
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
              'input[name="' + Lt(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < l.length; t++) {
              var a = l[t];
              if (a !== e && a.form === e.form) {
                var n = a[pt] || null;
                if (!n) throw Error(u(90));
                xc(
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
              a = l[t], a.form === e.form && oo(a);
          }
          break e;
        case "textarea":
          ho(e, l.value, l.defaultValue);
          break e;
        case "select":
          t = l.value, t != null && Ha(e, !!l.multiple, t, !1);
      }
    }
  }
  var jc = !1;
  function xo(e, t, l) {
    if (jc) return e(t, l);
    jc = !0;
    try {
      var a = e(t);
      return a;
    } finally {
      if (jc = !1, (Ba !== null || La !== null) && (bs(), Ba && (t = Ba, e = La, La = Ba = null, go(t), e)))
        for (t = 0; t < e.length; t++) go(e[t]);
    }
  }
  function Mn(e, t) {
    var l = e.stateNode;
    if (l === null) return null;
    var a = l[pt] || null;
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
        u(231, t, typeof l)
      );
    return l;
  }
  var ol = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), wc = !1;
  if (ol)
    try {
      var Cn = {};
      Object.defineProperty(Cn, "passive", {
        get: function() {
          wc = !0;
        }
      }), window.addEventListener("test", Cn, Cn), window.removeEventListener("test", Cn, Cn);
    } catch {
      wc = !1;
    }
  var Ol = null, Nc = null, Di = null;
  function yo() {
    if (Di) return Di;
    var e, t = Nc, l = t.length, a, n = "value" in Ol ? Ol.value : Ol.textContent, s = n.length;
    for (e = 0; e < l && t[e] === n[e]; e++) ;
    var d = l - e;
    for (a = 1; a <= d && t[l - a] === n[s - a]; a++) ;
    return Di = n.slice(e, 1 < a ? 1 - a : void 0);
  }
  function ki(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Hi() {
    return !0;
  }
  function bo() {
    return !1;
  }
  function vt(e) {
    function t(l, a, n, s, d) {
      this._reactName = l, this._targetInst = n, this.type = a, this.nativeEvent = s, this.target = d, this.currentTarget = null;
      for (var p in e)
        e.hasOwnProperty(p) && (l = e[p], this[p] = l ? l(s) : s[p]);
      return this.isDefaultPrevented = (s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1) ? Hi : bo, this.isPropagationStopped = bo, this;
    }
    return b(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var l = this.nativeEvent;
        l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = Hi);
      },
      stopPropagation: function() {
        var l = this.nativeEvent;
        l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = Hi);
      },
      persist: function() {
      },
      isPersistent: Hi
    }), t;
  }
  var ca = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, Ui = vt(ca), Tn = b({}, ca, { view: 0, detail: 0 }), gp = vt(Tn), Ec, Mc, Rn, Bi = b({}, Tn, {
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
    getModifierState: Tc,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== Rn && (Rn && e.type === "mousemove" ? (Ec = e.screenX - Rn.screenX, Mc = e.screenY - Rn.screenY) : Mc = Ec = 0, Rn = e), Ec);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : Mc;
    }
  }), _o = vt(Bi), xp = b({}, Bi, { dataTransfer: 0 }), yp = vt(xp), bp = b({}, Tn, { relatedTarget: 0 }), Cc = vt(bp), _p = b({}, ca, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Sp = vt(_p), jp = b({}, ca, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), wp = vt(jp), Np = b({}, ca, { data: 0 }), So = vt(Np), Ep = {
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
  }, Mp = {
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
  }, Cp = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function Tp(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Cp[e]) ? !!t[e] : !1;
  }
  function Tc() {
    return Tp;
  }
  var Rp = b({}, Tn, {
    key: function(e) {
      if (e.key) {
        var t = Ep[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = ki(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Mp[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Tc,
    charCode: function(e) {
      return e.type === "keypress" ? ki(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? ki(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), Ap = vt(Rp), zp = b({}, Bi, {
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
  }), jo = vt(zp), Op = b({}, Tn, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Tc
  }), Dp = vt(Op), kp = b({}, ca, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Hp = vt(kp), Up = b({}, Bi, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Bp = vt(Up), Lp = b({}, ca, {
    newState: 0,
    oldState: 0
  }), qp = vt(Lp), Yp = [9, 13, 27, 32], Rc = ol && "CompositionEvent" in window, An = null;
  ol && "documentMode" in document && (An = document.documentMode);
  var Gp = ol && "TextEvent" in window && !An, wo = ol && (!Rc || An && 8 < An && 11 >= An), No = " ", Eo = !1;
  function Mo(e, t) {
    switch (e) {
      case "keyup":
        return Yp.indexOf(t.keyCode) !== -1;
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
  function Co(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var qa = !1;
  function Vp(e, t) {
    switch (e) {
      case "compositionend":
        return Co(t);
      case "keypress":
        return t.which !== 32 ? null : (Eo = !0, No);
      case "textInput":
        return e = t.data, e === No && Eo ? null : e;
      default:
        return null;
    }
  }
  function Xp(e, t) {
    if (qa)
      return e === "compositionend" || !Rc && Mo(e, t) ? (e = yo(), Di = Nc = Ol = null, qa = !1, e) : null;
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
        return wo && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Qp = {
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
  function To(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Qp[e.type] : t === "textarea";
  }
  function Ro(e, t, l, a) {
    Ba ? La ? La.push(a) : La = [a] : Ba = a, t = Ms(t, "onChange"), 0 < t.length && (l = new Ui(
      "onChange",
      "change",
      null,
      l,
      a
    ), e.push({ event: l, listeners: t }));
  }
  var zn = null, On = null;
  function Zp(e) {
    hh(e, 0);
  }
  function Li(e) {
    var t = En(e);
    if (oo(t)) return e;
  }
  function Ao(e, t) {
    if (e === "change") return t;
  }
  var zo = !1;
  if (ol) {
    var Ac;
    if (ol) {
      var zc = "oninput" in document;
      if (!zc) {
        var Oo = document.createElement("div");
        Oo.setAttribute("oninput", "return;"), zc = typeof Oo.oninput == "function";
      }
      Ac = zc;
    } else Ac = !1;
    zo = Ac && (!document.documentMode || 9 < document.documentMode);
  }
  function Do() {
    zn && (zn.detachEvent("onpropertychange", ko), On = zn = null);
  }
  function ko(e) {
    if (e.propertyName === "value" && Li(On)) {
      var t = [];
      Ro(
        t,
        On,
        e,
        Sc(e)
      ), xo(Zp, t);
    }
  }
  function $p(e, t, l) {
    e === "focusin" ? (Do(), zn = t, On = l, zn.attachEvent("onpropertychange", ko)) : e === "focusout" && Do();
  }
  function Kp(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return Li(On);
  }
  function Jp(e, t) {
    if (e === "click") return Li(t);
  }
  function Fp(e, t) {
    if (e === "input" || e === "change")
      return Li(t);
  }
  function Wp(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var Mt = typeof Object.is == "function" ? Object.is : Wp;
  function Dn(e, t) {
    if (Mt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var l = Object.keys(e), a = Object.keys(t);
    if (l.length !== a.length) return !1;
    for (a = 0; a < l.length; a++) {
      var n = l[a];
      if (!Rl.call(t, n) || !Mt(e[n], t[n]))
        return !1;
    }
    return !0;
  }
  function Ho(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Uo(e, t) {
    var l = Ho(e);
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
      l = Ho(l);
    }
  }
  function Bo(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Bo(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Lo(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = zi(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var l = typeof t.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) e = t.contentWindow;
      else break;
      t = zi(e.document);
    }
    return t;
  }
  function Oc(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var Pp = ol && "documentMode" in document && 11 >= document.documentMode, Ya = null, Dc = null, kn = null, kc = !1;
  function qo(e, t, l) {
    var a = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    kc || Ya == null || Ya !== zi(a) || (a = Ya, "selectionStart" in a && Oc(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), kn && Dn(kn, a) || (kn = a, a = Ms(Dc, "onSelect"), 0 < a.length && (t = new Ui(
      "onSelect",
      "select",
      null,
      t,
      l
    ), e.push({ event: t, listeners: a }), t.target = Ya)));
  }
  function ua(e, t) {
    var l = {};
    return l[e.toLowerCase()] = t.toLowerCase(), l["Webkit" + e] = "webkit" + t, l["Moz" + e] = "moz" + t, l;
  }
  var Ga = {
    animationend: ua("Animation", "AnimationEnd"),
    animationiteration: ua("Animation", "AnimationIteration"),
    animationstart: ua("Animation", "AnimationStart"),
    transitionrun: ua("Transition", "TransitionRun"),
    transitionstart: ua("Transition", "TransitionStart"),
    transitioncancel: ua("Transition", "TransitionCancel"),
    transitionend: ua("Transition", "TransitionEnd")
  }, Hc = {}, Yo = {};
  ol && (Yo = document.createElement("div").style, "AnimationEvent" in window || (delete Ga.animationend.animation, delete Ga.animationiteration.animation, delete Ga.animationstart.animation), "TransitionEvent" in window || delete Ga.transitionend.transition);
  function ra(e) {
    if (Hc[e]) return Hc[e];
    if (!Ga[e]) return e;
    var t = Ga[e], l;
    for (l in t)
      if (t.hasOwnProperty(l) && l in Yo)
        return Hc[e] = t[l];
    return e;
  }
  var Go = ra("animationend"), Vo = ra("animationiteration"), Xo = ra("animationstart"), Ip = ra("transitionrun"), ev = ra("transitionstart"), tv = ra("transitioncancel"), Qo = ra("transitionend"), Zo = /* @__PURE__ */ new Map(), Uc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Uc.push("scrollEnd");
  function Wt(e, t) {
    Zo.set(e, t), sa(t, [e]);
  }
  var qi = typeof reportError == "function" ? reportError : function(e) {
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
  }, qt = [], Va = 0, Bc = 0;
  function Yi() {
    for (var e = Va, t = Bc = Va = 0; t < e; ) {
      var l = qt[t];
      qt[t++] = null;
      var a = qt[t];
      qt[t++] = null;
      var n = qt[t];
      qt[t++] = null;
      var s = qt[t];
      if (qt[t++] = null, a !== null && n !== null) {
        var d = a.pending;
        d === null ? n.next = n : (n.next = d.next, d.next = n), a.pending = n;
      }
      s !== 0 && $o(l, n, s);
    }
  }
  function Gi(e, t, l, a) {
    qt[Va++] = e, qt[Va++] = t, qt[Va++] = l, qt[Va++] = a, Bc |= a, e.lanes |= a, e = e.alternate, e !== null && (e.lanes |= a);
  }
  function Lc(e, t, l, a) {
    return Gi(e, t, l, a), Vi(e);
  }
  function oa(e, t) {
    return Gi(e, null, null, t), Vi(e);
  }
  function $o(e, t, l) {
    e.lanes |= l;
    var a = e.alternate;
    a !== null && (a.lanes |= l);
    for (var n = !1, s = e.return; s !== null; )
      s.childLanes |= l, a = s.alternate, a !== null && (a.childLanes |= l), s.tag === 22 && (e = s.stateNode, e === null || e._visibility & 1 || (n = !0)), e = s, s = s.return;
    return e.tag === 3 ? (s = e.stateNode, n && t !== null && (n = 31 - Et(l), e = s.hiddenUpdates, a = e[n], a === null ? e[n] = [t] : a.push(t), t.lane = l | 536870912), s) : null;
  }
  function Vi(e) {
    if (50 < ai)
      throw ai = 0, Ku = null, Error(u(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var Xa = {};
  function lv(e, t, l, a) {
    this.tag = e, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Ct(e, t, l, a) {
    return new lv(e, t, l, a);
  }
  function qc(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function dl(e, t) {
    var l = e.alternate;
    return l === null ? (l = Ct(
      e.tag,
      t,
      e.key,
      e.mode
    ), l.elementType = e.elementType, l.type = e.type, l.stateNode = e.stateNode, l.alternate = e, e.alternate = l) : (l.pendingProps = t, l.type = e.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = e.flags & 65011712, l.childLanes = e.childLanes, l.lanes = e.lanes, l.child = e.child, l.memoizedProps = e.memoizedProps, l.memoizedState = e.memoizedState, l.updateQueue = e.updateQueue, t = e.dependencies, l.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, l.sibling = e.sibling, l.index = e.index, l.ref = e.ref, l.refCleanup = e.refCleanup, l;
  }
  function Ko(e, t) {
    e.flags &= 65011714;
    var l = e.alternate;
    return l === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = l.childLanes, e.lanes = l.lanes, e.child = l.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = l.memoizedProps, e.memoizedState = l.memoizedState, e.updateQueue = l.updateQueue, e.type = l.type, t = l.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function Xi(e, t, l, a, n, s) {
    var d = 0;
    if (a = e, typeof e == "function") qc(e) && (d = 1);
    else if (typeof e == "string")
      d = c0(
        e,
        l,
        K.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case pe:
          return e = Ct(31, l, t, n), e.elementType = pe, e.lanes = s, e;
        case Y:
          return da(l.children, n, s, t);
        case O:
          d = 8, n |= 24;
          break;
        case V:
          return e = Ct(12, l, t, n | 2), e.elementType = V, e.lanes = s, e;
        case se:
          return e = Ct(13, l, t, n), e.elementType = se, e.lanes = s, e;
        case re:
          return e = Ct(19, l, t, n), e.elementType = re, e.lanes = s, e;
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case q:
                d = 10;
                break e;
              case $:
                d = 9;
                break e;
              case le:
                d = 11;
                break e;
              case F:
                d = 14;
                break e;
              case oe:
                d = 16, a = null;
                break e;
            }
          d = 29, l = Error(
            u(130, e === null ? "null" : typeof e, "")
          ), a = null;
      }
    return t = Ct(d, l, t, n), t.elementType = e, t.type = a, t.lanes = s, t;
  }
  function da(e, t, l, a) {
    return e = Ct(7, e, a, t), e.lanes = l, e;
  }
  function Yc(e, t, l) {
    return e = Ct(6, e, null, t), e.lanes = l, e;
  }
  function Jo(e) {
    var t = Ct(18, null, null, 0);
    return t.stateNode = e, t;
  }
  function Gc(e, t, l) {
    return t = Ct(
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
  var Fo = /* @__PURE__ */ new WeakMap();
  function Yt(e, t) {
    if (typeof e == "object" && e !== null) {
      var l = Fo.get(e);
      return l !== void 0 ? l : (t = {
        value: e,
        source: t,
        stack: Ca(t)
      }, Fo.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: Ca(t)
    };
  }
  var Qa = [], Za = 0, Qi = null, Hn = 0, Gt = [], Vt = 0, Dl = null, al = 1, nl = "";
  function fl(e, t) {
    Qa[Za++] = Hn, Qa[Za++] = Qi, Qi = e, Hn = t;
  }
  function Wo(e, t, l) {
    Gt[Vt++] = al, Gt[Vt++] = nl, Gt[Vt++] = Dl, Dl = e;
    var a = al;
    e = nl;
    var n = 32 - Et(a) - 1;
    a &= ~(1 << n), l += 1;
    var s = 32 - Et(t) + n;
    if (30 < s) {
      var d = n - n % 5;
      s = (a & (1 << d) - 1).toString(32), a >>= d, n -= d, al = 1 << 32 - Et(t) + n | l << n | a, nl = s + e;
    } else
      al = 1 << s | l << n | a, nl = e;
  }
  function Vc(e) {
    e.return !== null && (fl(e, 1), Wo(e, 1, 0));
  }
  function Xc(e) {
    for (; e === Qi; )
      Qi = Qa[--Za], Qa[Za] = null, Hn = Qa[--Za], Qa[Za] = null;
    for (; e === Dl; )
      Dl = Gt[--Vt], Gt[Vt] = null, nl = Gt[--Vt], Gt[Vt] = null, al = Gt[--Vt], Gt[Vt] = null;
  }
  function Po(e, t) {
    Gt[Vt++] = al, Gt[Vt++] = nl, Gt[Vt++] = Dl, al = t.id, nl = t.overflow, Dl = e;
  }
  var ct = null, Be = null, be = !1, kl = null, Xt = !1, Qc = Error(u(519));
  function Hl(e) {
    var t = Error(
      u(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw Un(Yt(t, e)), Qc;
  }
  function Io(e) {
    var t = e.stateNode, l = e.type, a = e.memoizedProps;
    switch (t[st] = e, t[pt] = a, l) {
      case "dialog":
        ge("cancel", t), ge("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        ge("load", t);
        break;
      case "video":
      case "audio":
        for (l = 0; l < ii.length; l++)
          ge(ii[l], t);
        break;
      case "source":
        ge("error", t);
        break;
      case "img":
      case "image":
      case "link":
        ge("error", t), ge("load", t);
        break;
      case "details":
        ge("toggle", t);
        break;
      case "input":
        ge("invalid", t), fo(
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
        ge("invalid", t);
        break;
      case "textarea":
        ge("invalid", t), mo(t, a.value, a.defaultValue, a.children);
    }
    l = a.children, typeof l != "string" && typeof l != "number" && typeof l != "bigint" || t.textContent === "" + l || a.suppressHydrationWarning === !0 || gh(t.textContent, l) ? (a.popover != null && (ge("beforetoggle", t), ge("toggle", t)), a.onScroll != null && ge("scroll", t), a.onScrollEnd != null && ge("scrollend", t), a.onClick != null && (t.onclick = rl), t = !0) : t = !1, t || Hl(e, !0);
  }
  function ed(e) {
    for (ct = e.return; ct; )
      switch (ct.tag) {
        case 5:
        case 31:
        case 13:
          Xt = !1;
          return;
        case 27:
        case 3:
          Xt = !0;
          return;
        default:
          ct = ct.return;
      }
  }
  function $a(e) {
    if (e !== ct) return !1;
    if (!be) return ed(e), be = !0, !1;
    var t = e.tag, l;
    if ((l = t !== 3 && t !== 27) && ((l = t === 5) && (l = e.type, l = !(l !== "form" && l !== "button") || rr(e.type, e.memoizedProps)), l = !l), l && Be && Hl(e), ed(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(u(317));
      Be = Eh(e);
    } else if (t === 31) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(u(317));
      Be = Eh(e);
    } else
      t === 27 ? (t = Be, Fl(e.type) ? (e = mr, mr = null, Be = e) : Be = t) : Be = ct ? Zt(e.stateNode.nextSibling) : null;
    return !0;
  }
  function fa() {
    Be = ct = null, be = !1;
  }
  function Zc() {
    var e = kl;
    return e !== null && (bt === null ? bt = e : bt.push.apply(
      bt,
      e
    ), kl = null), e;
  }
  function Un(e) {
    kl === null ? kl = [e] : kl.push(e);
  }
  var $c = S(null), ha = null, hl = null;
  function Ul(e, t, l) {
    X($c, t._currentValue), t._currentValue = l;
  }
  function ml(e) {
    e._currentValue = $c.current, D($c);
  }
  function Kc(e, t, l) {
    for (; e !== null; ) {
      var a = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, a !== null && (a.childLanes |= t)) : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t), e === l) break;
      e = e.return;
    }
  }
  function Jc(e, t, l, a) {
    var n = e.child;
    for (n !== null && (n.return = e); n !== null; ) {
      var s = n.dependencies;
      if (s !== null) {
        var d = n.child;
        s = s.firstContext;
        e: for (; s !== null; ) {
          var p = s;
          s = n;
          for (var _ = 0; _ < t.length; _++)
            if (p.context === t[_]) {
              s.lanes |= l, p = s.alternate, p !== null && (p.lanes |= l), Kc(
                s.return,
                l,
                e
              ), a || (d = null);
              break e;
            }
          s = p.next;
        }
      } else if (n.tag === 18) {
        if (d = n.return, d === null) throw Error(u(341));
        d.lanes |= l, s = d.alternate, s !== null && (s.lanes |= l), Kc(d, l, e), d = null;
      } else d = n.child;
      if (d !== null) d.return = n;
      else
        for (d = n; d !== null; ) {
          if (d === e) {
            d = null;
            break;
          }
          if (n = d.sibling, n !== null) {
            n.return = d.return, d = n;
            break;
          }
          d = d.return;
        }
      n = d;
    }
  }
  function Ka(e, t, l, a) {
    e = null;
    for (var n = t, s = !1; n !== null; ) {
      if (!s) {
        if ((n.flags & 524288) !== 0) s = !0;
        else if ((n.flags & 262144) !== 0) break;
      }
      if (n.tag === 10) {
        var d = n.alternate;
        if (d === null) throw Error(u(387));
        if (d = d.memoizedProps, d !== null) {
          var p = n.type;
          Mt(n.pendingProps.value, d.value) || (e !== null ? e.push(p) : e = [p]);
        }
      } else if (n === he.current) {
        if (d = n.alternate, d === null) throw Error(u(387));
        d.memoizedState.memoizedState !== n.memoizedState.memoizedState && (e !== null ? e.push(oi) : e = [oi]);
      }
      n = n.return;
    }
    e !== null && Jc(
      t,
      e,
      l,
      a
    ), t.flags |= 262144;
  }
  function Zi(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!Mt(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function ma(e) {
    ha = e, hl = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function ut(e) {
    return td(ha, e);
  }
  function $i(e, t) {
    return ha === null && ma(e), td(e, t);
  }
  function td(e, t) {
    var l = t._currentValue;
    if (t = { context: t, memoizedValue: l, next: null }, hl === null) {
      if (e === null) throw Error(u(308));
      hl = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else hl = hl.next = t;
    return l;
  }
  var av = typeof AbortController < "u" ? AbortController : function() {
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
  }, nv = i.unstable_scheduleCallback, iv = i.unstable_NormalPriority, We = {
    $$typeof: q,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Fc() {
    return {
      controller: new av(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Bn(e) {
    e.refCount--, e.refCount === 0 && nv(iv, function() {
      e.controller.abort();
    });
  }
  var Ln = null, Wc = 0, Ja = 0, Fa = null;
  function sv(e, t) {
    if (Ln === null) {
      var l = Ln = [];
      Wc = 0, Ja = er(), Fa = {
        status: "pending",
        value: void 0,
        then: function(a) {
          l.push(a);
        }
      };
    }
    return Wc++, t.then(ld, ld), t;
  }
  function ld() {
    if (--Wc === 0 && Ln !== null) {
      Fa !== null && (Fa.status = "fulfilled");
      var e = Ln;
      Ln = null, Ja = 0, Fa = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function cv(e, t) {
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
  var ad = M.S;
  M.S = function(e, t) {
    Yf = Fe(), typeof t == "object" && t !== null && typeof t.then == "function" && sv(e, t), ad !== null && ad(e, t);
  };
  var pa = S(null);
  function Pc() {
    var e = pa.current;
    return e !== null ? e : De.pooledCache;
  }
  function Ki(e, t) {
    t === null ? X(pa, pa.current) : X(pa, t.pool);
  }
  function nd() {
    var e = Pc();
    return e === null ? null : { parent: We._currentValue, pool: e };
  }
  var Wa = Error(u(460)), Ic = Error(u(474)), Ji = Error(u(542)), Fi = { then: function() {
  } };
  function id(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function sd(e, t, l) {
    switch (l = e[l], l === void 0 ? e.push(t) : l !== t && (t.then(rl, rl), t = l), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, ud(e), e;
      default:
        if (typeof t.status == "string") t.then(rl, rl);
        else {
          if (e = De, e !== null && 100 < e.shellSuspendCounter)
            throw Error(u(482));
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
            throw e = t.reason, ud(e), e;
        }
        throw ga = t, Wa;
    }
  }
  function va(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (l) {
      throw l !== null && typeof l == "object" && typeof l.then == "function" ? (ga = l, Wa) : l;
    }
  }
  var ga = null;
  function cd() {
    if (ga === null) throw Error(u(459));
    var e = ga;
    return ga = null, e;
  }
  function ud(e) {
    if (e === Wa || e === Ji)
      throw Error(u(483));
  }
  var Pa = null, qn = 0;
  function Wi(e) {
    var t = qn;
    return qn += 1, Pa === null && (Pa = []), sd(Pa, e, t);
  }
  function Yn(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function Pi(e, t) {
    throw t.$$typeof === N ? Error(u(525)) : (e = Object.prototype.toString.call(t), Error(
      u(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function rd(e) {
    function t(E, w) {
      if (e) {
        var C = E.deletions;
        C === null ? (E.deletions = [w], E.flags |= 16) : C.push(w);
      }
    }
    function l(E, w) {
      if (!e) return null;
      for (; w !== null; )
        t(E, w), w = w.sibling;
      return null;
    }
    function a(E) {
      for (var w = /* @__PURE__ */ new Map(); E !== null; )
        E.key !== null ? w.set(E.key, E) : w.set(E.index, E), E = E.sibling;
      return w;
    }
    function n(E, w) {
      return E = dl(E, w), E.index = 0, E.sibling = null, E;
    }
    function s(E, w, C) {
      return E.index = C, e ? (C = E.alternate, C !== null ? (C = C.index, C < w ? (E.flags |= 67108866, w) : C) : (E.flags |= 67108866, w)) : (E.flags |= 1048576, w);
    }
    function d(E) {
      return e && E.alternate === null && (E.flags |= 67108866), E;
    }
    function p(E, w, C, H) {
      return w === null || w.tag !== 6 ? (w = Yc(C, E.mode, H), w.return = E, w) : (w = n(w, C), w.return = E, w);
    }
    function _(E, w, C, H) {
      var ne = C.type;
      return ne === Y ? k(
        E,
        w,
        C.props.children,
        H,
        C.key
      ) : w !== null && (w.elementType === ne || typeof ne == "object" && ne !== null && ne.$$typeof === oe && va(ne) === w.type) ? (w = n(w, C.props), Yn(w, C), w.return = E, w) : (w = Xi(
        C.type,
        C.key,
        C.props,
        null,
        E.mode,
        H
      ), Yn(w, C), w.return = E, w);
    }
    function T(E, w, C, H) {
      return w === null || w.tag !== 4 || w.stateNode.containerInfo !== C.containerInfo || w.stateNode.implementation !== C.implementation ? (w = Gc(C, E.mode, H), w.return = E, w) : (w = n(w, C.children || []), w.return = E, w);
    }
    function k(E, w, C, H, ne) {
      return w === null || w.tag !== 7 ? (w = da(
        C,
        E.mode,
        H,
        ne
      ), w.return = E, w) : (w = n(w, C), w.return = E, w);
    }
    function B(E, w, C) {
      if (typeof w == "string" && w !== "" || typeof w == "number" || typeof w == "bigint")
        return w = Yc(
          "" + w,
          E.mode,
          C
        ), w.return = E, w;
      if (typeof w == "object" && w !== null) {
        switch (w.$$typeof) {
          case L:
            return C = Xi(
              w.type,
              w.key,
              w.props,
              null,
              E.mode,
              C
            ), Yn(C, w), C.return = E, C;
          case G:
            return w = Gc(
              w,
              E.mode,
              C
            ), w.return = E, w;
          case oe:
            return w = va(w), B(E, w, C);
        }
        if (ee(w) || Se(w))
          return w = da(
            w,
            E.mode,
            C,
            null
          ), w.return = E, w;
        if (typeof w.then == "function")
          return B(E, Wi(w), C);
        if (w.$$typeof === q)
          return B(
            E,
            $i(E, w),
            C
          );
        Pi(E, w);
      }
      return null;
    }
    function R(E, w, C, H) {
      var ne = w !== null ? w.key : null;
      if (typeof C == "string" && C !== "" || typeof C == "number" || typeof C == "bigint")
        return ne !== null ? null : p(E, w, "" + C, H);
      if (typeof C == "object" && C !== null) {
        switch (C.$$typeof) {
          case L:
            return C.key === ne ? _(E, w, C, H) : null;
          case G:
            return C.key === ne ? T(E, w, C, H) : null;
          case oe:
            return C = va(C), R(E, w, C, H);
        }
        if (ee(C) || Se(C))
          return ne !== null ? null : k(E, w, C, H, null);
        if (typeof C.then == "function")
          return R(
            E,
            w,
            Wi(C),
            H
          );
        if (C.$$typeof === q)
          return R(
            E,
            w,
            $i(E, C),
            H
          );
        Pi(E, C);
      }
      return null;
    }
    function A(E, w, C, H, ne) {
      if (typeof H == "string" && H !== "" || typeof H == "number" || typeof H == "bigint")
        return E = E.get(C) || null, p(w, E, "" + H, ne);
      if (typeof H == "object" && H !== null) {
        switch (H.$$typeof) {
          case L:
            return E = E.get(
              H.key === null ? C : H.key
            ) || null, _(w, E, H, ne);
          case G:
            return E = E.get(
              H.key === null ? C : H.key
            ) || null, T(w, E, H, ne);
          case oe:
            return H = va(H), A(
              E,
              w,
              C,
              H,
              ne
            );
        }
        if (ee(H) || Se(H))
          return E = E.get(C) || null, k(w, E, H, ne, null);
        if (typeof H.then == "function")
          return A(
            E,
            w,
            C,
            Wi(H),
            ne
          );
        if (H.$$typeof === q)
          return A(
            E,
            w,
            C,
            $i(w, H),
            ne
          );
        Pi(w, H);
      }
      return null;
    }
    function J(E, w, C, H) {
      for (var ne = null, je = null, I = w, me = w = 0, ye = null; I !== null && me < C.length; me++) {
        I.index > me ? (ye = I, I = null) : ye = I.sibling;
        var we = R(
          E,
          I,
          C[me],
          H
        );
        if (we === null) {
          I === null && (I = ye);
          break;
        }
        e && I && we.alternate === null && t(E, I), w = s(we, w, me), je === null ? ne = we : je.sibling = we, je = we, I = ye;
      }
      if (me === C.length)
        return l(E, I), be && fl(E, me), ne;
      if (I === null) {
        for (; me < C.length; me++)
          I = B(E, C[me], H), I !== null && (w = s(
            I,
            w,
            me
          ), je === null ? ne = I : je.sibling = I, je = I);
        return be && fl(E, me), ne;
      }
      for (I = a(I); me < C.length; me++)
        ye = A(
          I,
          E,
          me,
          C[me],
          H
        ), ye !== null && (e && ye.alternate !== null && I.delete(
          ye.key === null ? me : ye.key
        ), w = s(
          ye,
          w,
          me
        ), je === null ? ne = ye : je.sibling = ye, je = ye);
      return e && I.forEach(function(ta) {
        return t(E, ta);
      }), be && fl(E, me), ne;
    }
    function ce(E, w, C, H) {
      if (C == null) throw Error(u(151));
      for (var ne = null, je = null, I = w, me = w = 0, ye = null, we = C.next(); I !== null && !we.done; me++, we = C.next()) {
        I.index > me ? (ye = I, I = null) : ye = I.sibling;
        var ta = R(E, I, we.value, H);
        if (ta === null) {
          I === null && (I = ye);
          break;
        }
        e && I && ta.alternate === null && t(E, I), w = s(ta, w, me), je === null ? ne = ta : je.sibling = ta, je = ta, I = ye;
      }
      if (we.done)
        return l(E, I), be && fl(E, me), ne;
      if (I === null) {
        for (; !we.done; me++, we = C.next())
          we = B(E, we.value, H), we !== null && (w = s(we, w, me), je === null ? ne = we : je.sibling = we, je = we);
        return be && fl(E, me), ne;
      }
      for (I = a(I); !we.done; me++, we = C.next())
        we = A(I, E, me, we.value, H), we !== null && (e && we.alternate !== null && I.delete(we.key === null ? me : we.key), w = s(we, w, me), je === null ? ne = we : je.sibling = we, je = we);
      return e && I.forEach(function(x0) {
        return t(E, x0);
      }), be && fl(E, me), ne;
    }
    function Oe(E, w, C, H) {
      if (typeof C == "object" && C !== null && C.type === Y && C.key === null && (C = C.props.children), typeof C == "object" && C !== null) {
        switch (C.$$typeof) {
          case L:
            e: {
              for (var ne = C.key; w !== null; ) {
                if (w.key === ne) {
                  if (ne = C.type, ne === Y) {
                    if (w.tag === 7) {
                      l(
                        E,
                        w.sibling
                      ), H = n(
                        w,
                        C.props.children
                      ), H.return = E, E = H;
                      break e;
                    }
                  } else if (w.elementType === ne || typeof ne == "object" && ne !== null && ne.$$typeof === oe && va(ne) === w.type) {
                    l(
                      E,
                      w.sibling
                    ), H = n(w, C.props), Yn(H, C), H.return = E, E = H;
                    break e;
                  }
                  l(E, w);
                  break;
                } else t(E, w);
                w = w.sibling;
              }
              C.type === Y ? (H = da(
                C.props.children,
                E.mode,
                H,
                C.key
              ), H.return = E, E = H) : (H = Xi(
                C.type,
                C.key,
                C.props,
                null,
                E.mode,
                H
              ), Yn(H, C), H.return = E, E = H);
            }
            return d(E);
          case G:
            e: {
              for (ne = C.key; w !== null; ) {
                if (w.key === ne)
                  if (w.tag === 4 && w.stateNode.containerInfo === C.containerInfo && w.stateNode.implementation === C.implementation) {
                    l(
                      E,
                      w.sibling
                    ), H = n(w, C.children || []), H.return = E, E = H;
                    break e;
                  } else {
                    l(E, w);
                    break;
                  }
                else t(E, w);
                w = w.sibling;
              }
              H = Gc(C, E.mode, H), H.return = E, E = H;
            }
            return d(E);
          case oe:
            return C = va(C), Oe(
              E,
              w,
              C,
              H
            );
        }
        if (ee(C))
          return J(
            E,
            w,
            C,
            H
          );
        if (Se(C)) {
          if (ne = Se(C), typeof ne != "function") throw Error(u(150));
          return C = ne.call(C), ce(
            E,
            w,
            C,
            H
          );
        }
        if (typeof C.then == "function")
          return Oe(
            E,
            w,
            Wi(C),
            H
          );
        if (C.$$typeof === q)
          return Oe(
            E,
            w,
            $i(E, C),
            H
          );
        Pi(E, C);
      }
      return typeof C == "string" && C !== "" || typeof C == "number" || typeof C == "bigint" ? (C = "" + C, w !== null && w.tag === 6 ? (l(E, w.sibling), H = n(w, C), H.return = E, E = H) : (l(E, w), H = Yc(C, E.mode, H), H.return = E, E = H), d(E)) : l(E, w);
    }
    return function(E, w, C, H) {
      try {
        qn = 0;
        var ne = Oe(
          E,
          w,
          C,
          H
        );
        return Pa = null, ne;
      } catch (I) {
        if (I === Wa || I === Ji) throw I;
        var je = Ct(29, I, null, E.mode);
        return je.lanes = H, je.return = E, je;
      } finally {
      }
    };
  }
  var xa = rd(!0), od = rd(!1), Bl = !1;
  function eu(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function tu(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function Ll(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function ql(e, t, l) {
    var a = e.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (Ne & 2) !== 0) {
      var n = a.pending;
      return n === null ? t.next = t : (t.next = n.next, n.next = t), a.pending = t, t = Vi(e), $o(e, null, l), t;
    }
    return Gi(e, a, t, l), Vi(e);
  }
  function Gn(e, t, l) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (l & 4194048) !== 0)) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, eo(e, l);
    }
  }
  function lu(e, t) {
    var l = e.updateQueue, a = e.alternate;
    if (a !== null && (a = a.updateQueue, l === a)) {
      var n = null, s = null;
      if (l = l.firstBaseUpdate, l !== null) {
        do {
          var d = {
            lane: l.lane,
            tag: l.tag,
            payload: l.payload,
            callback: null,
            next: null
          };
          s === null ? n = s = d : s = s.next = d, l = l.next;
        } while (l !== null);
        s === null ? n = s = t : s = s.next = t;
      } else n = s = t;
      l = {
        baseState: a.baseState,
        firstBaseUpdate: n,
        lastBaseUpdate: s,
        shared: a.shared,
        callbacks: a.callbacks
      }, e.updateQueue = l;
      return;
    }
    e = l.lastBaseUpdate, e === null ? l.firstBaseUpdate = t : e.next = t, l.lastBaseUpdate = t;
  }
  var au = !1;
  function Vn() {
    if (au) {
      var e = Fa;
      if (e !== null) throw e;
    }
  }
  function Xn(e, t, l, a) {
    au = !1;
    var n = e.updateQueue;
    Bl = !1;
    var s = n.firstBaseUpdate, d = n.lastBaseUpdate, p = n.shared.pending;
    if (p !== null) {
      n.shared.pending = null;
      var _ = p, T = _.next;
      _.next = null, d === null ? s = T : d.next = T, d = _;
      var k = e.alternate;
      k !== null && (k = k.updateQueue, p = k.lastBaseUpdate, p !== d && (p === null ? k.firstBaseUpdate = T : p.next = T, k.lastBaseUpdate = _));
    }
    if (s !== null) {
      var B = n.baseState;
      d = 0, k = T = _ = null, p = s;
      do {
        var R = p.lane & -536870913, A = R !== p.lane;
        if (A ? (xe & R) === R : (a & R) === R) {
          R !== 0 && R === Ja && (au = !0), k !== null && (k = k.next = {
            lane: 0,
            tag: p.tag,
            payload: p.payload,
            callback: null,
            next: null
          });
          e: {
            var J = e, ce = p;
            R = t;
            var Oe = l;
            switch (ce.tag) {
              case 1:
                if (J = ce.payload, typeof J == "function") {
                  B = J.call(Oe, B, R);
                  break e;
                }
                B = J;
                break e;
              case 3:
                J.flags = J.flags & -65537 | 128;
              case 0:
                if (J = ce.payload, R = typeof J == "function" ? J.call(Oe, B, R) : J, R == null) break e;
                B = b({}, B, R);
                break e;
              case 2:
                Bl = !0;
            }
          }
          R = p.callback, R !== null && (e.flags |= 64, A && (e.flags |= 8192), A = n.callbacks, A === null ? n.callbacks = [R] : A.push(R));
        } else
          A = {
            lane: R,
            tag: p.tag,
            payload: p.payload,
            callback: p.callback,
            next: null
          }, k === null ? (T = k = A, _ = B) : k = k.next = A, d |= R;
        if (p = p.next, p === null) {
          if (p = n.shared.pending, p === null)
            break;
          A = p, p = A.next, A.next = null, n.lastBaseUpdate = A, n.shared.pending = null;
        }
      } while (!0);
      k === null && (_ = B), n.baseState = _, n.firstBaseUpdate = T, n.lastBaseUpdate = k, s === null && (n.shared.lanes = 0), Ql |= d, e.lanes = d, e.memoizedState = B;
    }
  }
  function dd(e, t) {
    if (typeof e != "function")
      throw Error(u(191, e));
    e.call(t);
  }
  function fd(e, t) {
    var l = e.callbacks;
    if (l !== null)
      for (e.callbacks = null, e = 0; e < l.length; e++)
        dd(l[e], t);
  }
  var Ia = S(null), Ii = S(0);
  function hd(e, t) {
    e = jl, X(Ii, e), X(Ia, t), jl = e | t.baseLanes;
  }
  function nu() {
    X(Ii, jl), X(Ia, Ia.current);
  }
  function iu() {
    jl = Ii.current, D(Ia), D(Ii);
  }
  var Tt = S(null), Qt = null;
  function Yl(e) {
    var t = e.alternate;
    X(Ke, Ke.current & 1), X(Tt, e), Qt === null && (t === null || Ia.current !== null || t.memoizedState !== null) && (Qt = e);
  }
  function su(e) {
    X(Ke, Ke.current), X(Tt, e), Qt === null && (Qt = e);
  }
  function md(e) {
    e.tag === 22 ? (X(Ke, Ke.current), X(Tt, e), Qt === null && (Qt = e)) : Gl();
  }
  function Gl() {
    X(Ke, Ke.current), X(Tt, Tt.current);
  }
  function Rt(e) {
    D(Tt), Qt === e && (Qt = null), D(Ke);
  }
  var Ke = S(0);
  function es(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var l = t.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || fr(l) || hr(l)))
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
  var pl = 0, fe = null, Ae = null, Pe = null, ts = !1, en = !1, ya = !1, ls = 0, Qn = 0, tn = null, uv = 0;
  function Ze() {
    throw Error(u(321));
  }
  function cu(e, t) {
    if (t === null) return !1;
    for (var l = 0; l < t.length && l < e.length; l++)
      if (!Mt(e[l], t[l])) return !1;
    return !0;
  }
  function uu(e, t, l, a, n, s) {
    return pl = s, fe = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, M.H = e === null || e.memoizedState === null ? Wd : ju, ya = !1, s = l(a, n), ya = !1, en && (s = vd(
      t,
      l,
      a,
      n
    )), pd(e), s;
  }
  function pd(e) {
    M.H = Kn;
    var t = Ae !== null && Ae.next !== null;
    if (pl = 0, Pe = Ae = fe = null, ts = !1, Qn = 0, tn = null, t) throw Error(u(300));
    e === null || Ie || (e = e.dependencies, e !== null && Zi(e) && (Ie = !0));
  }
  function vd(e, t, l, a) {
    fe = e;
    var n = 0;
    do {
      if (en && (tn = null), Qn = 0, en = !1, 25 <= n) throw Error(u(301));
      if (n += 1, Pe = Ae = null, e.updateQueue != null) {
        var s = e.updateQueue;
        s.lastEffect = null, s.events = null, s.stores = null, s.memoCache != null && (s.memoCache.index = 0);
      }
      M.H = Pd, s = t(l, a);
    } while (en);
    return s;
  }
  function rv() {
    var e = M.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? Zn(t) : t, e = e.useState()[0], (Ae !== null ? Ae.memoizedState : null) !== e && (fe.flags |= 1024), t;
  }
  function ru() {
    var e = ls !== 0;
    return ls = 0, e;
  }
  function ou(e, t, l) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l;
  }
  function du(e) {
    if (ts) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      ts = !1;
    }
    pl = 0, Pe = Ae = fe = null, en = !1, Qn = ls = 0, tn = null;
  }
  function ht() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Pe === null ? fe.memoizedState = Pe = e : Pe = Pe.next = e, Pe;
  }
  function Je() {
    if (Ae === null) {
      var e = fe.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Ae.next;
    var t = Pe === null ? fe.memoizedState : Pe.next;
    if (t !== null)
      Pe = t, Ae = e;
    else {
      if (e === null)
        throw fe.alternate === null ? Error(u(467)) : Error(u(310));
      Ae = e, e = {
        memoizedState: Ae.memoizedState,
        baseState: Ae.baseState,
        baseQueue: Ae.baseQueue,
        queue: Ae.queue,
        next: null
      }, Pe === null ? fe.memoizedState = Pe = e : Pe = Pe.next = e;
    }
    return Pe;
  }
  function as() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Zn(e) {
    var t = Qn;
    return Qn += 1, tn === null && (tn = []), e = sd(tn, e, t), t = fe, (Pe === null ? t.memoizedState : Pe.next) === null && (t = t.alternate, M.H = t === null || t.memoizedState === null ? Wd : ju), e;
  }
  function ns(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return Zn(e);
      if (e.$$typeof === q) return ut(e);
    }
    throw Error(u(438, String(e)));
  }
  function fu(e) {
    var t = null, l = fe.updateQueue;
    if (l !== null && (t = l.memoCache), t == null) {
      var a = fe.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (t = {
        data: a.data.map(function(n) {
          return n.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), l === null && (l = as(), fe.updateQueue = l), l.memoCache = t, l = t.data[t.index], l === void 0)
      for (l = t.data[t.index] = Array(e), a = 0; a < e; a++)
        l[a] = _e;
    return t.index++, l;
  }
  function vl(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function is(e) {
    var t = Je();
    return hu(t, Ae, e);
  }
  function hu(e, t, l) {
    var a = e.queue;
    if (a === null) throw Error(u(311));
    a.lastRenderedReducer = l;
    var n = e.baseQueue, s = a.pending;
    if (s !== null) {
      if (n !== null) {
        var d = n.next;
        n.next = s.next, s.next = d;
      }
      t.baseQueue = n = s, a.pending = null;
    }
    if (s = e.baseState, n === null) e.memoizedState = s;
    else {
      t = n.next;
      var p = d = null, _ = null, T = t, k = !1;
      do {
        var B = T.lane & -536870913;
        if (B !== T.lane ? (xe & B) === B : (pl & B) === B) {
          var R = T.revertLane;
          if (R === 0)
            _ !== null && (_ = _.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: T.action,
              hasEagerState: T.hasEagerState,
              eagerState: T.eagerState,
              next: null
            }), B === Ja && (k = !0);
          else if ((pl & R) === R) {
            T = T.next, R === Ja && (k = !0);
            continue;
          } else
            B = {
              lane: 0,
              revertLane: T.revertLane,
              gesture: null,
              action: T.action,
              hasEagerState: T.hasEagerState,
              eagerState: T.eagerState,
              next: null
            }, _ === null ? (p = _ = B, d = s) : _ = _.next = B, fe.lanes |= R, Ql |= R;
          B = T.action, ya && l(s, B), s = T.hasEagerState ? T.eagerState : l(s, B);
        } else
          R = {
            lane: B,
            revertLane: T.revertLane,
            gesture: T.gesture,
            action: T.action,
            hasEagerState: T.hasEagerState,
            eagerState: T.eagerState,
            next: null
          }, _ === null ? (p = _ = R, d = s) : _ = _.next = R, fe.lanes |= B, Ql |= B;
        T = T.next;
      } while (T !== null && T !== t);
      if (_ === null ? d = s : _.next = p, !Mt(s, e.memoizedState) && (Ie = !0, k && (l = Fa, l !== null)))
        throw l;
      e.memoizedState = s, e.baseState = d, e.baseQueue = _, a.lastRenderedState = s;
    }
    return n === null && (a.lanes = 0), [e.memoizedState, a.dispatch];
  }
  function mu(e) {
    var t = Je(), l = t.queue;
    if (l === null) throw Error(u(311));
    l.lastRenderedReducer = e;
    var a = l.dispatch, n = l.pending, s = t.memoizedState;
    if (n !== null) {
      l.pending = null;
      var d = n = n.next;
      do
        s = e(s, d.action), d = d.next;
      while (d !== n);
      Mt(s, t.memoizedState) || (Ie = !0), t.memoizedState = s, t.baseQueue === null && (t.baseState = s), l.lastRenderedState = s;
    }
    return [s, a];
  }
  function gd(e, t, l) {
    var a = fe, n = Je(), s = be;
    if (s) {
      if (l === void 0) throw Error(u(407));
      l = l();
    } else l = t();
    var d = !Mt(
      (Ae || n).memoizedState,
      l
    );
    if (d && (n.memoizedState = l, Ie = !0), n = n.queue, gu(bd.bind(null, a, n, e), [
      e
    ]), n.getSnapshot !== t || d || Pe !== null && Pe.memoizedState.tag & 1) {
      if (a.flags |= 2048, ln(
        9,
        { destroy: void 0 },
        yd.bind(
          null,
          a,
          n,
          l,
          t
        ),
        null
      ), De === null) throw Error(u(349));
      s || (pl & 127) !== 0 || xd(a, t, l);
    }
    return l;
  }
  function xd(e, t, l) {
    e.flags |= 16384, e = { getSnapshot: t, value: l }, t = fe.updateQueue, t === null ? (t = as(), fe.updateQueue = t, t.stores = [e]) : (l = t.stores, l === null ? t.stores = [e] : l.push(e));
  }
  function yd(e, t, l, a) {
    t.value = l, t.getSnapshot = a, _d(t) && Sd(e);
  }
  function bd(e, t, l) {
    return l(function() {
      _d(t) && Sd(e);
    });
  }
  function _d(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var l = t();
      return !Mt(e, l);
    } catch {
      return !0;
    }
  }
  function Sd(e) {
    var t = oa(e, 2);
    t !== null && _t(t, e, 2);
  }
  function pu(e) {
    var t = ht();
    if (typeof e == "function") {
      var l = e;
      if (e = l(), ya) {
        Al(!0);
        try {
          l();
        } finally {
          Al(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = e, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: vl,
      lastRenderedState: e
    }, t;
  }
  function jd(e, t, l, a) {
    return e.baseState = l, hu(
      e,
      Ae,
      typeof a == "function" ? a : vl
    );
  }
  function ov(e, t, l, a, n) {
    if (us(e)) throw Error(u(485));
    if (e = t.action, e !== null) {
      var s = {
        payload: n,
        action: e,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(d) {
          s.listeners.push(d);
        }
      };
      M.T !== null ? l(!0) : s.isTransition = !1, a(s), l = t.pending, l === null ? (s.next = t.pending = s, wd(t, s)) : (s.next = l.next, t.pending = l.next = s);
    }
  }
  function wd(e, t) {
    var l = t.action, a = t.payload, n = e.state;
    if (t.isTransition) {
      var s = M.T, d = {};
      M.T = d;
      try {
        var p = l(n, a), _ = M.S;
        _ !== null && _(d, p), Nd(e, t, p);
      } catch (T) {
        vu(e, t, T);
      } finally {
        s !== null && d.types !== null && (s.types = d.types), M.T = s;
      }
    } else
      try {
        s = l(n, a), Nd(e, t, s);
      } catch (T) {
        vu(e, t, T);
      }
  }
  function Nd(e, t, l) {
    l !== null && typeof l == "object" && typeof l.then == "function" ? l.then(
      function(a) {
        Ed(e, t, a);
      },
      function(a) {
        return vu(e, t, a);
      }
    ) : Ed(e, t, l);
  }
  function Ed(e, t, l) {
    t.status = "fulfilled", t.value = l, Md(t), e.state = l, t = e.pending, t !== null && (l = t.next, l === t ? e.pending = null : (l = l.next, t.next = l, wd(e, l)));
  }
  function vu(e, t, l) {
    var a = e.pending;
    if (e.pending = null, a !== null) {
      a = a.next;
      do
        t.status = "rejected", t.reason = l, Md(t), t = t.next;
      while (t !== a);
    }
    e.action = null;
  }
  function Md(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function Cd(e, t) {
    return t;
  }
  function Td(e, t) {
    if (be) {
      var l = De.formState;
      if (l !== null) {
        e: {
          var a = fe;
          if (be) {
            if (Be) {
              t: {
                for (var n = Be, s = Xt; n.nodeType !== 8; ) {
                  if (!s) {
                    n = null;
                    break t;
                  }
                  if (n = Zt(
                    n.nextSibling
                  ), n === null) {
                    n = null;
                    break t;
                  }
                }
                s = n.data, n = s === "F!" || s === "F" ? n : null;
              }
              if (n) {
                Be = Zt(
                  n.nextSibling
                ), a = n.data === "F!";
                break e;
              }
            }
            Hl(a);
          }
          a = !1;
        }
        a && (t = l[0]);
      }
    }
    return l = ht(), l.memoizedState = l.baseState = t, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Cd,
      lastRenderedState: t
    }, l.queue = a, l = Kd.bind(
      null,
      fe,
      a
    ), a.dispatch = l, a = pu(!1), s = Su.bind(
      null,
      fe,
      !1,
      a.queue
    ), a = ht(), n = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, a.queue = n, l = ov.bind(
      null,
      fe,
      n,
      s,
      l
    ), n.dispatch = l, a.memoizedState = e, [t, l, !1];
  }
  function Rd(e) {
    var t = Je();
    return Ad(t, Ae, e);
  }
  function Ad(e, t, l) {
    if (t = hu(
      e,
      t,
      Cd
    )[0], e = is(vl)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var a = Zn(t);
      } catch (d) {
        throw d === Wa ? Ji : d;
      }
    else a = t;
    t = Je();
    var n = t.queue, s = n.dispatch;
    return l !== t.memoizedState && (fe.flags |= 2048, ln(
      9,
      { destroy: void 0 },
      dv.bind(null, n, l),
      null
    )), [a, s, e];
  }
  function dv(e, t) {
    e.action = t;
  }
  function zd(e) {
    var t = Je(), l = Ae;
    if (l !== null)
      return Ad(t, l, e);
    Je(), t = t.memoizedState, l = Je();
    var a = l.queue.dispatch;
    return l.memoizedState = e, [t, a, !1];
  }
  function ln(e, t, l, a) {
    return e = { tag: e, create: l, deps: a, inst: t, next: null }, t = fe.updateQueue, t === null && (t = as(), fe.updateQueue = t), l = t.lastEffect, l === null ? t.lastEffect = e.next = e : (a = l.next, l.next = e, e.next = a, t.lastEffect = e), e;
  }
  function Od() {
    return Je().memoizedState;
  }
  function ss(e, t, l, a) {
    var n = ht();
    fe.flags |= e, n.memoizedState = ln(
      1 | t,
      { destroy: void 0 },
      l,
      a === void 0 ? null : a
    );
  }
  function cs(e, t, l, a) {
    var n = Je();
    a = a === void 0 ? null : a;
    var s = n.memoizedState.inst;
    Ae !== null && a !== null && cu(a, Ae.memoizedState.deps) ? n.memoizedState = ln(t, s, l, a) : (fe.flags |= e, n.memoizedState = ln(
      1 | t,
      s,
      l,
      a
    ));
  }
  function Dd(e, t) {
    ss(8390656, 8, e, t);
  }
  function gu(e, t) {
    cs(2048, 8, e, t);
  }
  function fv(e) {
    fe.flags |= 4;
    var t = fe.updateQueue;
    if (t === null)
      t = as(), fe.updateQueue = t, t.events = [e];
    else {
      var l = t.events;
      l === null ? t.events = [e] : l.push(e);
    }
  }
  function kd(e) {
    var t = Je().memoizedState;
    return fv({ ref: t, nextImpl: e }), function() {
      if ((Ne & 2) !== 0) throw Error(u(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function Hd(e, t) {
    return cs(4, 2, e, t);
  }
  function Ud(e, t) {
    return cs(4, 4, e, t);
  }
  function Bd(e, t) {
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
  function Ld(e, t, l) {
    l = l != null ? l.concat([e]) : null, cs(4, 4, Bd.bind(null, t, e), l);
  }
  function xu() {
  }
  function qd(e, t) {
    var l = Je();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    return t !== null && cu(t, a[1]) ? a[0] : (l.memoizedState = [e, t], e);
  }
  function Yd(e, t) {
    var l = Je();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    if (t !== null && cu(t, a[1]))
      return a[0];
    if (a = e(), ya) {
      Al(!0);
      try {
        e();
      } finally {
        Al(!1);
      }
    }
    return l.memoizedState = [a, t], a;
  }
  function yu(e, t, l) {
    return l === void 0 || (pl & 1073741824) !== 0 && (xe & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = l, e = Vf(), fe.lanes |= e, Ql |= e, l);
  }
  function Gd(e, t, l, a) {
    return Mt(l, t) ? l : Ia.current !== null ? (e = yu(e, l, a), Mt(e, t) || (Ie = !0), e) : (pl & 42) === 0 || (pl & 1073741824) !== 0 && (xe & 261930) === 0 ? (Ie = !0, e.memoizedState = l) : (e = Vf(), fe.lanes |= e, Ql |= e, t);
  }
  function Vd(e, t, l, a, n) {
    var s = U.p;
    U.p = s !== 0 && 8 > s ? s : 8;
    var d = M.T, p = {};
    M.T = p, Su(e, !1, t, l);
    try {
      var _ = n(), T = M.S;
      if (T !== null && T(p, _), _ !== null && typeof _ == "object" && typeof _.then == "function") {
        var k = cv(
          _,
          a
        );
        $n(
          e,
          t,
          k,
          Ot(e)
        );
      } else
        $n(
          e,
          t,
          a,
          Ot(e)
        );
    } catch (B) {
      $n(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: B },
        Ot()
      );
    } finally {
      U.p = s, d !== null && p.types !== null && (d.types = p.types), M.T = d;
    }
  }
  function hv() {
  }
  function bu(e, t, l, a) {
    if (e.tag !== 5) throw Error(u(476));
    var n = Xd(e).queue;
    Vd(
      e,
      n,
      t,
      Q,
      l === null ? hv : function() {
        return Qd(e), l(a);
      }
    );
  }
  function Xd(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: Q,
      baseState: Q,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: vl,
        lastRenderedState: Q
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
        lastRenderedReducer: vl,
        lastRenderedState: l
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function Qd(e) {
    var t = Xd(e);
    t.next === null && (t = e.alternate.memoizedState), $n(
      e,
      t.next.queue,
      {},
      Ot()
    );
  }
  function _u() {
    return ut(oi);
  }
  function Zd() {
    return Je().memoizedState;
  }
  function $d() {
    return Je().memoizedState;
  }
  function mv(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var l = Ot();
          e = Ll(l);
          var a = ql(t, e, l);
          a !== null && (_t(a, t, l), Gn(a, t, l)), t = { cache: Fc() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function pv(e, t, l) {
    var a = Ot();
    l = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, us(e) ? Jd(t, l) : (l = Lc(e, t, l, a), l !== null && (_t(l, e, a), Fd(l, t, a)));
  }
  function Kd(e, t, l) {
    var a = Ot();
    $n(e, t, l, a);
  }
  function $n(e, t, l, a) {
    var n = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (us(e)) Jd(t, n);
    else {
      var s = e.alternate;
      if (e.lanes === 0 && (s === null || s.lanes === 0) && (s = t.lastRenderedReducer, s !== null))
        try {
          var d = t.lastRenderedState, p = s(d, l);
          if (n.hasEagerState = !0, n.eagerState = p, Mt(p, d))
            return Gi(e, t, n, 0), De === null && Yi(), !1;
        } catch {
        } finally {
        }
      if (l = Lc(e, t, n, a), l !== null)
        return _t(l, e, a), Fd(l, t, a), !0;
    }
    return !1;
  }
  function Su(e, t, l, a) {
    if (a = {
      lane: 2,
      revertLane: er(),
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, us(e)) {
      if (t) throw Error(u(479));
    } else
      t = Lc(
        e,
        l,
        a,
        2
      ), t !== null && _t(t, e, 2);
  }
  function us(e) {
    var t = e.alternate;
    return e === fe || t !== null && t === fe;
  }
  function Jd(e, t) {
    en = ts = !0;
    var l = e.pending;
    l === null ? t.next = t : (t.next = l.next, l.next = t), e.pending = t;
  }
  function Fd(e, t, l) {
    if ((l & 4194048) !== 0) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, eo(e, l);
    }
  }
  var Kn = {
    readContext: ut,
    use: ns,
    useCallback: Ze,
    useContext: Ze,
    useEffect: Ze,
    useImperativeHandle: Ze,
    useLayoutEffect: Ze,
    useInsertionEffect: Ze,
    useMemo: Ze,
    useReducer: Ze,
    useRef: Ze,
    useState: Ze,
    useDebugValue: Ze,
    useDeferredValue: Ze,
    useTransition: Ze,
    useSyncExternalStore: Ze,
    useId: Ze,
    useHostTransitionStatus: Ze,
    useFormState: Ze,
    useActionState: Ze,
    useOptimistic: Ze,
    useMemoCache: Ze,
    useCacheRefresh: Ze
  };
  Kn.useEffectEvent = Ze;
  var Wd = {
    readContext: ut,
    use: ns,
    useCallback: function(e, t) {
      return ht().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: ut,
    useEffect: Dd,
    useImperativeHandle: function(e, t, l) {
      l = l != null ? l.concat([e]) : null, ss(
        4194308,
        4,
        Bd.bind(null, t, e),
        l
      );
    },
    useLayoutEffect: function(e, t) {
      return ss(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      ss(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var l = ht();
      t = t === void 0 ? null : t;
      var a = e();
      if (ya) {
        Al(!0);
        try {
          e();
        } finally {
          Al(!1);
        }
      }
      return l.memoizedState = [a, t], a;
    },
    useReducer: function(e, t, l) {
      var a = ht();
      if (l !== void 0) {
        var n = l(t);
        if (ya) {
          Al(!0);
          try {
            l(t);
          } finally {
            Al(!1);
          }
        }
      } else n = t;
      return a.memoizedState = a.baseState = n, e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: n
      }, a.queue = e, e = e.dispatch = pv.bind(
        null,
        fe,
        e
      ), [a.memoizedState, e];
    },
    useRef: function(e) {
      var t = ht();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = pu(e);
      var t = e.queue, l = Kd.bind(null, fe, t);
      return t.dispatch = l, [e.memoizedState, l];
    },
    useDebugValue: xu,
    useDeferredValue: function(e, t) {
      var l = ht();
      return yu(l, e, t);
    },
    useTransition: function() {
      var e = pu(!1);
      return e = Vd.bind(
        null,
        fe,
        e.queue,
        !0,
        !1
      ), ht().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, l) {
      var a = fe, n = ht();
      if (be) {
        if (l === void 0)
          throw Error(u(407));
        l = l();
      } else {
        if (l = t(), De === null)
          throw Error(u(349));
        (xe & 127) !== 0 || xd(a, t, l);
      }
      n.memoizedState = l;
      var s = { value: l, getSnapshot: t };
      return n.queue = s, Dd(bd.bind(null, a, s, e), [
        e
      ]), a.flags |= 2048, ln(
        9,
        { destroy: void 0 },
        yd.bind(
          null,
          a,
          s,
          l,
          t
        ),
        null
      ), l;
    },
    useId: function() {
      var e = ht(), t = De.identifierPrefix;
      if (be) {
        var l = nl, a = al;
        l = (a & ~(1 << 32 - Et(a) - 1)).toString(32) + l, t = "_" + t + "R_" + l, l = ls++, 0 < l && (t += "H" + l.toString(32)), t += "_";
      } else
        l = uv++, t = "_" + t + "r_" + l.toString(32) + "_";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: _u,
    useFormState: Td,
    useActionState: Td,
    useOptimistic: function(e) {
      var t = ht();
      t.memoizedState = t.baseState = e;
      var l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = l, t = Su.bind(
        null,
        fe,
        !0,
        l
      ), l.dispatch = t, [e, t];
    },
    useMemoCache: fu,
    useCacheRefresh: function() {
      return ht().memoizedState = mv.bind(
        null,
        fe
      );
    },
    useEffectEvent: function(e) {
      var t = ht(), l = { impl: e };
      return t.memoizedState = l, function() {
        if ((Ne & 2) !== 0)
          throw Error(u(440));
        return l.impl.apply(void 0, arguments);
      };
    }
  }, ju = {
    readContext: ut,
    use: ns,
    useCallback: qd,
    useContext: ut,
    useEffect: gu,
    useImperativeHandle: Ld,
    useInsertionEffect: Hd,
    useLayoutEffect: Ud,
    useMemo: Yd,
    useReducer: is,
    useRef: Od,
    useState: function() {
      return is(vl);
    },
    useDebugValue: xu,
    useDeferredValue: function(e, t) {
      var l = Je();
      return Gd(
        l,
        Ae.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = is(vl)[0], t = Je().memoizedState;
      return [
        typeof e == "boolean" ? e : Zn(e),
        t
      ];
    },
    useSyncExternalStore: gd,
    useId: Zd,
    useHostTransitionStatus: _u,
    useFormState: Rd,
    useActionState: Rd,
    useOptimistic: function(e, t) {
      var l = Je();
      return jd(l, Ae, e, t);
    },
    useMemoCache: fu,
    useCacheRefresh: $d
  };
  ju.useEffectEvent = kd;
  var Pd = {
    readContext: ut,
    use: ns,
    useCallback: qd,
    useContext: ut,
    useEffect: gu,
    useImperativeHandle: Ld,
    useInsertionEffect: Hd,
    useLayoutEffect: Ud,
    useMemo: Yd,
    useReducer: mu,
    useRef: Od,
    useState: function() {
      return mu(vl);
    },
    useDebugValue: xu,
    useDeferredValue: function(e, t) {
      var l = Je();
      return Ae === null ? yu(l, e, t) : Gd(
        l,
        Ae.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = mu(vl)[0], t = Je().memoizedState;
      return [
        typeof e == "boolean" ? e : Zn(e),
        t
      ];
    },
    useSyncExternalStore: gd,
    useId: Zd,
    useHostTransitionStatus: _u,
    useFormState: zd,
    useActionState: zd,
    useOptimistic: function(e, t) {
      var l = Je();
      return Ae !== null ? jd(l, Ae, e, t) : (l.baseState = e, [e, l.queue.dispatch]);
    },
    useMemoCache: fu,
    useCacheRefresh: $d
  };
  Pd.useEffectEvent = kd;
  function wu(e, t, l, a) {
    t = e.memoizedState, l = l(a, t), l = l == null ? t : b({}, t, l), e.memoizedState = l, e.lanes === 0 && (e.updateQueue.baseState = l);
  }
  var Nu = {
    enqueueSetState: function(e, t, l) {
      e = e._reactInternals;
      var a = Ot(), n = Ll(a);
      n.payload = t, l != null && (n.callback = l), t = ql(e, n, a), t !== null && (_t(t, e, a), Gn(t, e, a));
    },
    enqueueReplaceState: function(e, t, l) {
      e = e._reactInternals;
      var a = Ot(), n = Ll(a);
      n.tag = 1, n.payload = t, l != null && (n.callback = l), t = ql(e, n, a), t !== null && (_t(t, e, a), Gn(t, e, a));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var l = Ot(), a = Ll(l);
      a.tag = 2, t != null && (a.callback = t), t = ql(e, a, l), t !== null && (_t(t, e, l), Gn(t, e, l));
    }
  };
  function Id(e, t, l, a, n, s, d) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(a, s, d) : t.prototype && t.prototype.isPureReactComponent ? !Dn(l, a) || !Dn(n, s) : !0;
  }
  function ef(e, t, l, a) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(l, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(l, a), t.state !== e && Nu.enqueueReplaceState(t, t.state, null);
  }
  function ba(e, t) {
    var l = t;
    if ("ref" in t) {
      l = {};
      for (var a in t)
        a !== "ref" && (l[a] = t[a]);
    }
    if (e = e.defaultProps) {
      l === t && (l = b({}, l));
      for (var n in e)
        l[n] === void 0 && (l[n] = e[n]);
    }
    return l;
  }
  function tf(e) {
    qi(e);
  }
  function lf(e) {
    console.error(e);
  }
  function af(e) {
    qi(e);
  }
  function rs(e, t) {
    try {
      var l = e.onUncaughtError;
      l(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function nf(e, t, l) {
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
  function Eu(e, t, l) {
    return l = Ll(l), l.tag = 3, l.payload = { element: null }, l.callback = function() {
      rs(e, t);
    }, l;
  }
  function sf(e) {
    return e = Ll(e), e.tag = 3, e;
  }
  function cf(e, t, l, a) {
    var n = l.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var s = a.value;
      e.payload = function() {
        return n(s);
      }, e.callback = function() {
        nf(t, l, a);
      };
    }
    var d = l.stateNode;
    d !== null && typeof d.componentDidCatch == "function" && (e.callback = function() {
      nf(t, l, a), typeof n != "function" && (Zl === null ? Zl = /* @__PURE__ */ new Set([this]) : Zl.add(this));
      var p = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: p !== null ? p : ""
      });
    });
  }
  function vv(e, t, l, a, n) {
    if (l.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (t = l.alternate, t !== null && Ka(
        t,
        l,
        n,
        !0
      ), l = Tt.current, l !== null) {
        switch (l.tag) {
          case 31:
          case 13:
            return Qt === null ? _s() : l.alternate === null && $e === 0 && ($e = 3), l.flags &= -257, l.flags |= 65536, l.lanes = n, a === Fi ? l.flags |= 16384 : (t = l.updateQueue, t === null ? l.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), Wu(e, a, n)), !1;
          case 22:
            return l.flags |= 65536, a === Fi ? l.flags |= 16384 : (t = l.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, l.updateQueue = t) : (l = t.retryQueue, l === null ? t.retryQueue = /* @__PURE__ */ new Set([a]) : l.add(a)), Wu(e, a, n)), !1;
        }
        throw Error(u(435, l.tag));
      }
      return Wu(e, a, n), _s(), !1;
    }
    if (be)
      return t = Tt.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = n, a !== Qc && (e = Error(u(422), { cause: a }), Un(Yt(e, l)))) : (a !== Qc && (t = Error(u(423), {
        cause: a
      }), Un(
        Yt(t, l)
      )), e = e.current.alternate, e.flags |= 65536, n &= -n, e.lanes |= n, a = Yt(a, l), n = Eu(
        e.stateNode,
        a,
        n
      ), lu(e, n), $e !== 4 && ($e = 2)), !1;
    var s = Error(u(520), { cause: a });
    if (s = Yt(s, l), li === null ? li = [s] : li.push(s), $e !== 4 && ($e = 2), t === null) return !0;
    a = Yt(a, l), l = t;
    do {
      switch (l.tag) {
        case 3:
          return l.flags |= 65536, e = n & -n, l.lanes |= e, e = Eu(l.stateNode, a, e), lu(l, e), !1;
        case 1:
          if (t = l.type, s = l.stateNode, (l.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || s !== null && typeof s.componentDidCatch == "function" && (Zl === null || !Zl.has(s))))
            return l.flags |= 65536, n &= -n, l.lanes |= n, n = sf(n), cf(
              n,
              e,
              l,
              a
            ), lu(l, n), !1;
      }
      l = l.return;
    } while (l !== null);
    return !1;
  }
  var Mu = Error(u(461)), Ie = !1;
  function rt(e, t, l, a) {
    t.child = e === null ? od(t, null, l, a) : xa(
      t,
      e.child,
      l,
      a
    );
  }
  function uf(e, t, l, a, n) {
    l = l.render;
    var s = t.ref;
    if ("ref" in a) {
      var d = {};
      for (var p in a)
        p !== "ref" && (d[p] = a[p]);
    } else d = a;
    return ma(t), a = uu(
      e,
      t,
      l,
      d,
      s,
      n
    ), p = ru(), e !== null && !Ie ? (ou(e, t, n), gl(e, t, n)) : (be && p && Vc(t), t.flags |= 1, rt(e, t, a, n), t.child);
  }
  function rf(e, t, l, a, n) {
    if (e === null) {
      var s = l.type;
      return typeof s == "function" && !qc(s) && s.defaultProps === void 0 && l.compare === null ? (t.tag = 15, t.type = s, of(
        e,
        t,
        s,
        a,
        n
      )) : (e = Xi(
        l.type,
        null,
        a,
        t,
        t.mode,
        n
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (s = e.child, !ku(e, n)) {
      var d = s.memoizedProps;
      if (l = l.compare, l = l !== null ? l : Dn, l(d, a) && e.ref === t.ref)
        return gl(e, t, n);
    }
    return t.flags |= 1, e = dl(s, a), e.ref = t.ref, e.return = t, t.child = e;
  }
  function of(e, t, l, a, n) {
    if (e !== null) {
      var s = e.memoizedProps;
      if (Dn(s, a) && e.ref === t.ref)
        if (Ie = !1, t.pendingProps = a = s, ku(e, n))
          (e.flags & 131072) !== 0 && (Ie = !0);
        else
          return t.lanes = e.lanes, gl(e, t, n);
    }
    return Cu(
      e,
      t,
      l,
      a,
      n
    );
  }
  function df(e, t, l, a) {
    var n = a.children, s = e !== null ? e.memoizedState : null;
    if (e === null && t.stateNode === null && (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), a.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (s = s !== null ? s.baseLanes | l : l, e !== null) {
          for (a = t.child = e.child, n = 0; a !== null; )
            n = n | a.lanes | a.childLanes, a = a.sibling;
          a = n & ~s;
        } else a = 0, t.child = null;
        return ff(
          e,
          t,
          s,
          l,
          a
        );
      }
      if ((l & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && Ki(
          t,
          s !== null ? s.cachePool : null
        ), s !== null ? hd(t, s) : nu(), md(t);
      else
        return a = t.lanes = 536870912, ff(
          e,
          t,
          s !== null ? s.baseLanes | l : l,
          l,
          a
        );
    } else
      s !== null ? (Ki(t, s.cachePool), hd(t, s), Gl(), t.memoizedState = null) : (e !== null && Ki(t, null), nu(), Gl());
    return rt(e, t, n, l), t.child;
  }
  function Jn(e, t) {
    return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function ff(e, t, l, a, n) {
    var s = Pc();
    return s = s === null ? null : { parent: We._currentValue, pool: s }, t.memoizedState = {
      baseLanes: l,
      cachePool: s
    }, e !== null && Ki(t, null), nu(), md(t), e !== null && Ka(e, t, a, !0), t.childLanes = n, null;
  }
  function os(e, t) {
    return t = fs(
      { mode: t.mode, children: t.children },
      e.mode
    ), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function hf(e, t, l) {
    return xa(t, e.child, null, l), e = os(t, t.pendingProps), e.flags |= 2, Rt(t), t.memoizedState = null, e;
  }
  function gv(e, t, l) {
    var a = t.pendingProps, n = (t.flags & 128) !== 0;
    if (t.flags &= -129, e === null) {
      if (be) {
        if (a.mode === "hidden")
          return e = os(t, a), t.lanes = 536870912, Jn(null, e);
        if (su(t), (e = Be) ? (e = Nh(
          e,
          Xt
        ), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: Dl !== null ? { id: al, overflow: nl } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, l = Jo(e), l.return = t, t.child = l, ct = t, Be = null)) : e = null, e === null) throw Hl(t);
        return t.lanes = 536870912, null;
      }
      return os(t, a);
    }
    var s = e.memoizedState;
    if (s !== null) {
      var d = s.dehydrated;
      if (su(t), n)
        if (t.flags & 256)
          t.flags &= -257, t = hf(
            e,
            t,
            l
          );
        else if (t.memoizedState !== null)
          t.child = e.child, t.flags |= 128, t = null;
        else throw Error(u(558));
      else if (Ie || Ka(e, t, l, !1), n = (l & e.childLanes) !== 0, Ie || n) {
        if (a = De, a !== null && (d = to(a, l), d !== 0 && d !== s.retryLane))
          throw s.retryLane = d, oa(e, d), _t(a, e, d), Mu;
        _s(), t = hf(
          e,
          t,
          l
        );
      } else
        e = s.treeContext, Be = Zt(d.nextSibling), ct = t, be = !0, kl = null, Xt = !1, e !== null && Po(t, e), t = os(t, a), t.flags |= 4096;
      return t;
    }
    return e = dl(e.child, {
      mode: a.mode,
      children: a.children
    }), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function ds(e, t) {
    var l = t.ref;
    if (l === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof l != "function" && typeof l != "object")
        throw Error(u(284));
      (e === null || e.ref !== l) && (t.flags |= 4194816);
    }
  }
  function Cu(e, t, l, a, n) {
    return ma(t), l = uu(
      e,
      t,
      l,
      a,
      void 0,
      n
    ), a = ru(), e !== null && !Ie ? (ou(e, t, n), gl(e, t, n)) : (be && a && Vc(t), t.flags |= 1, rt(e, t, l, n), t.child);
  }
  function mf(e, t, l, a, n, s) {
    return ma(t), t.updateQueue = null, l = vd(
      t,
      a,
      l,
      n
    ), pd(e), a = ru(), e !== null && !Ie ? (ou(e, t, s), gl(e, t, s)) : (be && a && Vc(t), t.flags |= 1, rt(e, t, l, s), t.child);
  }
  function pf(e, t, l, a, n) {
    if (ma(t), t.stateNode === null) {
      var s = Xa, d = l.contextType;
      typeof d == "object" && d !== null && (s = ut(d)), s = new l(a, s), t.memoizedState = s.state !== null && s.state !== void 0 ? s.state : null, s.updater = Nu, t.stateNode = s, s._reactInternals = t, s = t.stateNode, s.props = a, s.state = t.memoizedState, s.refs = {}, eu(t), d = l.contextType, s.context = typeof d == "object" && d !== null ? ut(d) : Xa, s.state = t.memoizedState, d = l.getDerivedStateFromProps, typeof d == "function" && (wu(
        t,
        l,
        d,
        a
      ), s.state = t.memoizedState), typeof l.getDerivedStateFromProps == "function" || typeof s.getSnapshotBeforeUpdate == "function" || typeof s.UNSAFE_componentWillMount != "function" && typeof s.componentWillMount != "function" || (d = s.state, typeof s.componentWillMount == "function" && s.componentWillMount(), typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount(), d !== s.state && Nu.enqueueReplaceState(s, s.state, null), Xn(t, a, s, n), Vn(), s.state = t.memoizedState), typeof s.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (e === null) {
      s = t.stateNode;
      var p = t.memoizedProps, _ = ba(l, p);
      s.props = _;
      var T = s.context, k = l.contextType;
      d = Xa, typeof k == "object" && k !== null && (d = ut(k));
      var B = l.getDerivedStateFromProps;
      k = typeof B == "function" || typeof s.getSnapshotBeforeUpdate == "function", p = t.pendingProps !== p, k || typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function" || (p || T !== d) && ef(
        t,
        s,
        a,
        d
      ), Bl = !1;
      var R = t.memoizedState;
      s.state = R, Xn(t, a, s, n), Vn(), T = t.memoizedState, p || R !== T || Bl ? (typeof B == "function" && (wu(
        t,
        l,
        B,
        a
      ), T = t.memoizedState), (_ = Bl || Id(
        t,
        l,
        _,
        a,
        R,
        T,
        d
      )) ? (k || typeof s.UNSAFE_componentWillMount != "function" && typeof s.componentWillMount != "function" || (typeof s.componentWillMount == "function" && s.componentWillMount(), typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount()), typeof s.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof s.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = T), s.props = a, s.state = T, s.context = d, a = _) : (typeof s.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      s = t.stateNode, tu(e, t), d = t.memoizedProps, k = ba(l, d), s.props = k, B = t.pendingProps, R = s.context, T = l.contextType, _ = Xa, typeof T == "object" && T !== null && (_ = ut(T)), p = l.getDerivedStateFromProps, (T = typeof p == "function" || typeof s.getSnapshotBeforeUpdate == "function") || typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function" || (d !== B || R !== _) && ef(
        t,
        s,
        a,
        _
      ), Bl = !1, R = t.memoizedState, s.state = R, Xn(t, a, s, n), Vn();
      var A = t.memoizedState;
      d !== B || R !== A || Bl || e !== null && e.dependencies !== null && Zi(e.dependencies) ? (typeof p == "function" && (wu(
        t,
        l,
        p,
        a
      ), A = t.memoizedState), (k = Bl || Id(
        t,
        l,
        k,
        a,
        R,
        A,
        _
      ) || e !== null && e.dependencies !== null && Zi(e.dependencies)) ? (T || typeof s.UNSAFE_componentWillUpdate != "function" && typeof s.componentWillUpdate != "function" || (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(a, A, _), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(
        a,
        A,
        _
      )), typeof s.componentDidUpdate == "function" && (t.flags |= 4), typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof s.componentDidUpdate != "function" || d === e.memoizedProps && R === e.memoizedState || (t.flags |= 4), typeof s.getSnapshotBeforeUpdate != "function" || d === e.memoizedProps && R === e.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = A), s.props = a, s.state = A, s.context = _, a = k) : (typeof s.componentDidUpdate != "function" || d === e.memoizedProps && R === e.memoizedState || (t.flags |= 4), typeof s.getSnapshotBeforeUpdate != "function" || d === e.memoizedProps && R === e.memoizedState || (t.flags |= 1024), a = !1);
    }
    return s = a, ds(e, t), a = (t.flags & 128) !== 0, s || a ? (s = t.stateNode, l = a && typeof l.getDerivedStateFromError != "function" ? null : s.render(), t.flags |= 1, e !== null && a ? (t.child = xa(
      t,
      e.child,
      null,
      n
    ), t.child = xa(
      t,
      null,
      l,
      n
    )) : rt(e, t, l, n), t.memoizedState = s.state, e = t.child) : e = gl(
      e,
      t,
      n
    ), e;
  }
  function vf(e, t, l, a) {
    return fa(), t.flags |= 256, rt(e, t, l, a), t.child;
  }
  var Tu = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function Ru(e) {
    return { baseLanes: e, cachePool: nd() };
  }
  function Au(e, t, l) {
    return e = e !== null ? e.childLanes & ~l : 0, t && (e |= zt), e;
  }
  function gf(e, t, l) {
    var a = t.pendingProps, n = !1, s = (t.flags & 128) !== 0, d;
    if ((d = s) || (d = e !== null && e.memoizedState === null ? !1 : (Ke.current & 2) !== 0), d && (n = !0, t.flags &= -129), d = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (be) {
        if (n ? Yl(t) : Gl(), (e = Be) ? (e = Nh(
          e,
          Xt
        ), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: Dl !== null ? { id: al, overflow: nl } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, l = Jo(e), l.return = t, t.child = l, ct = t, Be = null)) : e = null, e === null) throw Hl(t);
        return hr(e) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      var p = a.children;
      return a = a.fallback, n ? (Gl(), n = t.mode, p = fs(
        { mode: "hidden", children: p },
        n
      ), a = da(
        a,
        n,
        l,
        null
      ), p.return = t, a.return = t, p.sibling = a, t.child = p, a = t.child, a.memoizedState = Ru(l), a.childLanes = Au(
        e,
        d,
        l
      ), t.memoizedState = Tu, Jn(null, a)) : (Yl(t), zu(t, p));
    }
    var _ = e.memoizedState;
    if (_ !== null && (p = _.dehydrated, p !== null)) {
      if (s)
        t.flags & 256 ? (Yl(t), t.flags &= -257, t = Ou(
          e,
          t,
          l
        )) : t.memoizedState !== null ? (Gl(), t.child = e.child, t.flags |= 128, t = null) : (Gl(), p = a.fallback, n = t.mode, a = fs(
          { mode: "visible", children: a.children },
          n
        ), p = da(
          p,
          n,
          l,
          null
        ), p.flags |= 2, a.return = t, p.return = t, a.sibling = p, t.child = a, xa(
          t,
          e.child,
          null,
          l
        ), a = t.child, a.memoizedState = Ru(l), a.childLanes = Au(
          e,
          d,
          l
        ), t.memoizedState = Tu, t = Jn(null, a));
      else if (Yl(t), hr(p)) {
        if (d = p.nextSibling && p.nextSibling.dataset, d) var T = d.dgst;
        d = T, a = Error(u(419)), a.stack = "", a.digest = d, Un({ value: a, source: null, stack: null }), t = Ou(
          e,
          t,
          l
        );
      } else if (Ie || Ka(e, t, l, !1), d = (l & e.childLanes) !== 0, Ie || d) {
        if (d = De, d !== null && (a = to(d, l), a !== 0 && a !== _.retryLane))
          throw _.retryLane = a, oa(e, a), _t(d, e, a), Mu;
        fr(p) || _s(), t = Ou(
          e,
          t,
          l
        );
      } else
        fr(p) ? (t.flags |= 192, t.child = e.child, t = null) : (e = _.treeContext, Be = Zt(
          p.nextSibling
        ), ct = t, be = !0, kl = null, Xt = !1, e !== null && Po(t, e), t = zu(
          t,
          a.children
        ), t.flags |= 4096);
      return t;
    }
    return n ? (Gl(), p = a.fallback, n = t.mode, _ = e.child, T = _.sibling, a = dl(_, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = _.subtreeFlags & 65011712, T !== null ? p = dl(
      T,
      p
    ) : (p = da(
      p,
      n,
      l,
      null
    ), p.flags |= 2), p.return = t, a.return = t, a.sibling = p, t.child = a, Jn(null, a), a = t.child, p = e.child.memoizedState, p === null ? p = Ru(l) : (n = p.cachePool, n !== null ? (_ = We._currentValue, n = n.parent !== _ ? { parent: _, pool: _ } : n) : n = nd(), p = {
      baseLanes: p.baseLanes | l,
      cachePool: n
    }), a.memoizedState = p, a.childLanes = Au(
      e,
      d,
      l
    ), t.memoizedState = Tu, Jn(e.child, a)) : (Yl(t), l = e.child, e = l.sibling, l = dl(l, {
      mode: "visible",
      children: a.children
    }), l.return = t, l.sibling = null, e !== null && (d = t.deletions, d === null ? (t.deletions = [e], t.flags |= 16) : d.push(e)), t.child = l, t.memoizedState = null, l);
  }
  function zu(e, t) {
    return t = fs(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function fs(e, t) {
    return e = Ct(22, e, null, t), e.lanes = 0, e;
  }
  function Ou(e, t, l) {
    return xa(t, e.child, null, l), e = zu(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function xf(e, t, l) {
    e.lanes |= t;
    var a = e.alternate;
    a !== null && (a.lanes |= t), Kc(e.return, t, l);
  }
  function Du(e, t, l, a, n, s) {
    var d = e.memoizedState;
    d === null ? e.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: a,
      tail: l,
      tailMode: n,
      treeForkCount: s
    } : (d.isBackwards = t, d.rendering = null, d.renderingStartTime = 0, d.last = a, d.tail = l, d.tailMode = n, d.treeForkCount = s);
  }
  function yf(e, t, l) {
    var a = t.pendingProps, n = a.revealOrder, s = a.tail;
    a = a.children;
    var d = Ke.current, p = (d & 2) !== 0;
    if (p ? (d = d & 1 | 2, t.flags |= 128) : d &= 1, X(Ke, d), rt(e, t, a, l), a = be ? Hn : 0, !p && e !== null && (e.flags & 128) !== 0)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13)
          e.memoizedState !== null && xf(e, l, t);
        else if (e.tag === 19)
          xf(e, l, t);
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
          e = l.alternate, e !== null && es(e) === null && (n = l), l = l.sibling;
        l = n, l === null ? (n = t.child, t.child = null) : (n = l.sibling, l.sibling = null), Du(
          t,
          !1,
          n,
          l,
          s,
          a
        );
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (l = null, n = t.child, t.child = null; n !== null; ) {
          if (e = n.alternate, e !== null && es(e) === null) {
            t.child = n;
            break;
          }
          e = n.sibling, n.sibling = l, l = n, n = e;
        }
        Du(
          t,
          !0,
          l,
          null,
          s,
          a
        );
        break;
      case "together":
        Du(
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
  function gl(e, t, l) {
    if (e !== null && (t.dependencies = e.dependencies), Ql |= t.lanes, (l & t.childLanes) === 0)
      if (e !== null) {
        if (Ka(
          e,
          t,
          l,
          !1
        ), (l & t.childLanes) === 0)
          return null;
      } else return null;
    if (e !== null && t.child !== e.child)
      throw Error(u(153));
    if (t.child !== null) {
      for (e = t.child, l = dl(e, e.pendingProps), t.child = l, l.return = t; e.sibling !== null; )
        e = e.sibling, l = l.sibling = dl(e, e.pendingProps), l.return = t;
      l.sibling = null;
    }
    return t.child;
  }
  function ku(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && Zi(e)));
  }
  function xv(e, t, l) {
    switch (t.tag) {
      case 3:
        lt(t, t.stateNode.containerInfo), Ul(t, We, e.memoizedState.cache), fa();
        break;
      case 27:
      case 5:
        mt(t);
        break;
      case 4:
        lt(t, t.stateNode.containerInfo);
        break;
      case 10:
        Ul(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 31:
        if (t.memoizedState !== null)
          return t.flags |= 128, su(t), null;
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null)
          return a.dehydrated !== null ? (Yl(t), t.flags |= 128, null) : (l & t.child.childLanes) !== 0 ? gf(e, t, l) : (Yl(t), e = gl(
            e,
            t,
            l
          ), e !== null ? e.sibling : null);
        Yl(t);
        break;
      case 19:
        var n = (e.flags & 128) !== 0;
        if (a = (l & t.childLanes) !== 0, a || (Ka(
          e,
          t,
          l,
          !1
        ), a = (l & t.childLanes) !== 0), n) {
          if (a)
            return yf(
              e,
              t,
              l
            );
          t.flags |= 128;
        }
        if (n = t.memoizedState, n !== null && (n.rendering = null, n.tail = null, n.lastEffect = null), X(Ke, Ke.current), a) break;
        return null;
      case 22:
        return t.lanes = 0, df(
          e,
          t,
          l,
          t.pendingProps
        );
      case 24:
        Ul(t, We, e.memoizedState.cache);
    }
    return gl(e, t, l);
  }
  function bf(e, t, l) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        Ie = !0;
      else {
        if (!ku(e, l) && (t.flags & 128) === 0)
          return Ie = !1, xv(
            e,
            t,
            l
          );
        Ie = (e.flags & 131072) !== 0;
      }
    else
      Ie = !1, be && (t.flags & 1048576) !== 0 && Wo(t, Hn, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          var a = t.pendingProps;
          if (e = va(t.elementType), t.type = e, typeof e == "function")
            qc(e) ? (a = ba(e, a), t.tag = 1, t = pf(
              null,
              t,
              e,
              a,
              l
            )) : (t.tag = 0, t = Cu(
              null,
              t,
              e,
              a,
              l
            ));
          else {
            if (e != null) {
              var n = e.$$typeof;
              if (n === le) {
                t.tag = 11, t = uf(
                  null,
                  t,
                  e,
                  a,
                  l
                );
                break e;
              } else if (n === F) {
                t.tag = 14, t = rf(
                  null,
                  t,
                  e,
                  a,
                  l
                );
                break e;
              }
            }
            throw t = te(e) || e, Error(u(306, t, ""));
          }
        }
        return t;
      case 0:
        return Cu(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 1:
        return a = t.type, n = ba(
          a,
          t.pendingProps
        ), pf(
          e,
          t,
          a,
          n,
          l
        );
      case 3:
        e: {
          if (lt(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(u(387));
          a = t.pendingProps;
          var s = t.memoizedState;
          n = s.element, tu(e, t), Xn(t, a, null, l);
          var d = t.memoizedState;
          if (a = d.cache, Ul(t, We, a), a !== s.cache && Jc(
            t,
            [We],
            l,
            !0
          ), Vn(), a = d.element, s.isDehydrated)
            if (s = {
              element: a,
              isDehydrated: !1,
              cache: d.cache
            }, t.updateQueue.baseState = s, t.memoizedState = s, t.flags & 256) {
              t = vf(
                e,
                t,
                a,
                l
              );
              break e;
            } else if (a !== n) {
              n = Yt(
                Error(u(424)),
                t
              ), Un(n), t = vf(
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
              for (Be = Zt(e.firstChild), ct = t, be = !0, kl = null, Xt = !0, l = od(
                t,
                null,
                a,
                l
              ), t.child = l; l; )
                l.flags = l.flags & -3 | 4096, l = l.sibling;
            }
          else {
            if (fa(), a === n) {
              t = gl(
                e,
                t,
                l
              );
              break e;
            }
            rt(e, t, a, l);
          }
          t = t.child;
        }
        return t;
      case 26:
        return ds(e, t), e === null ? (l = Ah(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = l : be || (l = t.type, e = t.pendingProps, a = Cs(
          Z.current
        ).createElement(l), a[st] = t, a[pt] = e, ot(a, l, e), nt(a), t.stateNode = a) : t.memoizedState = Ah(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return mt(t), e === null && be && (a = t.stateNode = Ch(
          t.type,
          t.pendingProps,
          Z.current
        ), ct = t, Xt = !0, n = Be, Fl(t.type) ? (mr = n, Be = Zt(a.firstChild)) : Be = n), rt(
          e,
          t,
          t.pendingProps.children,
          l
        ), ds(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && be && ((n = a = Be) && (a = Kv(
          a,
          t.type,
          t.pendingProps,
          Xt
        ), a !== null ? (t.stateNode = a, ct = t, Be = Zt(a.firstChild), Xt = !1, n = !0) : n = !1), n || Hl(t)), mt(t), n = t.type, s = t.pendingProps, d = e !== null ? e.memoizedProps : null, a = s.children, rr(n, s) ? a = null : d !== null && rr(n, d) && (t.flags |= 32), t.memoizedState !== null && (n = uu(
          e,
          t,
          rv,
          null,
          null,
          l
        ), oi._currentValue = n), ds(e, t), rt(e, t, a, l), t.child;
      case 6:
        return e === null && be && ((e = l = Be) && (l = Jv(
          l,
          t.pendingProps,
          Xt
        ), l !== null ? (t.stateNode = l, ct = t, Be = null, e = !0) : e = !1), e || Hl(t)), null;
      case 13:
        return gf(e, t, l);
      case 4:
        return lt(
          t,
          t.stateNode.containerInfo
        ), a = t.pendingProps, e === null ? t.child = xa(
          t,
          null,
          a,
          l
        ) : rt(e, t, a, l), t.child;
      case 11:
        return uf(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 7:
        return rt(
          e,
          t,
          t.pendingProps,
          l
        ), t.child;
      case 8:
        return rt(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 12:
        return rt(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 10:
        return a = t.pendingProps, Ul(t, t.type, a.value), rt(e, t, a.children, l), t.child;
      case 9:
        return n = t.type._context, a = t.pendingProps.children, ma(t), n = ut(n), a = a(n), t.flags |= 1, rt(e, t, a, l), t.child;
      case 14:
        return rf(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 15:
        return of(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 19:
        return yf(e, t, l);
      case 31:
        return gv(e, t, l);
      case 22:
        return df(
          e,
          t,
          l,
          t.pendingProps
        );
      case 24:
        return ma(t), a = ut(We), e === null ? (n = Pc(), n === null && (n = De, s = Fc(), n.pooledCache = s, s.refCount++, s !== null && (n.pooledCacheLanes |= l), n = s), t.memoizedState = { parent: a, cache: n }, eu(t), Ul(t, We, n)) : ((e.lanes & l) !== 0 && (tu(e, t), Xn(t, null, null, l), Vn()), n = e.memoizedState, s = t.memoizedState, n.parent !== a ? (n = { parent: a, cache: a }, t.memoizedState = n, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = n), Ul(t, We, a)) : (a = s.cache, Ul(t, We, a), a !== n.cache && Jc(
          t,
          [We],
          l,
          !0
        ))), rt(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(u(156, t.tag));
  }
  function xl(e) {
    e.flags |= 4;
  }
  function Hu(e, t, l, a, n) {
    if ((t = (e.mode & 32) !== 0) && (t = !1), t) {
      if (e.flags |= 16777216, (n & 335544128) === n)
        if (e.stateNode.complete) e.flags |= 8192;
        else if ($f()) e.flags |= 8192;
        else
          throw ga = Fi, Ic;
    } else e.flags &= -16777217;
  }
  function _f(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !Hh(t))
      if ($f()) e.flags |= 8192;
      else
        throw ga = Fi, Ic;
  }
  function hs(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? Pr() : 536870912, e.lanes |= t, cn |= t);
  }
  function Fn(e, t) {
    if (!be)
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
  function Le(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, l = 0, a = 0;
    if (t)
      for (var n = e.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags & 65011712, a |= n.flags & 65011712, n.return = e, n = n.sibling;
    else
      for (n = e.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags, a |= n.flags, n.return = e, n = n.sibling;
    return e.subtreeFlags |= a, e.childLanes = l, t;
  }
  function yv(e, t, l) {
    var a = t.pendingProps;
    switch (Xc(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Le(t), null;
      case 1:
        return Le(t), null;
      case 3:
        return l = t.stateNode, a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), ml(We), Ye(), l.pendingContext && (l.context = l.pendingContext, l.pendingContext = null), (e === null || e.child === null) && ($a(t) ? xl(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Zc())), Le(t), null;
      case 26:
        var n = t.type, s = t.memoizedState;
        return e === null ? (xl(t), s !== null ? (Le(t), _f(t, s)) : (Le(t), Hu(
          t,
          n,
          null,
          a,
          l
        ))) : s ? s !== e.memoizedState ? (xl(t), Le(t), _f(t, s)) : (Le(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== a && xl(t), Le(t), Hu(
          t,
          n,
          e,
          a,
          l
        )), null;
      case 27:
        if (Ft(t), l = Z.current, n = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && xl(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(u(166));
            return Le(t), null;
          }
          e = K.current, $a(t) ? Io(t) : (e = Ch(n, a, l), t.stateNode = e, xl(t));
        }
        return Le(t), null;
      case 5:
        if (Ft(t), n = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && xl(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(u(166));
            return Le(t), null;
          }
          if (s = K.current, $a(t))
            Io(t);
          else {
            var d = Cs(
              Z.current
            );
            switch (s) {
              case 1:
                s = d.createElementNS(
                  "http://www.w3.org/2000/svg",
                  n
                );
                break;
              case 2:
                s = d.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  n
                );
                break;
              default:
                switch (n) {
                  case "svg":
                    s = d.createElementNS(
                      "http://www.w3.org/2000/svg",
                      n
                    );
                    break;
                  case "math":
                    s = d.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      n
                    );
                    break;
                  case "script":
                    s = d.createElement("div"), s.innerHTML = "<script><\/script>", s = s.removeChild(
                      s.firstChild
                    );
                    break;
                  case "select":
                    s = typeof a.is == "string" ? d.createElement("select", {
                      is: a.is
                    }) : d.createElement("select"), a.multiple ? s.multiple = !0 : a.size && (s.size = a.size);
                    break;
                  default:
                    s = typeof a.is == "string" ? d.createElement(n, { is: a.is }) : d.createElement(n);
                }
            }
            s[st] = t, s[pt] = a;
            e: for (d = t.child; d !== null; ) {
              if (d.tag === 5 || d.tag === 6)
                s.appendChild(d.stateNode);
              else if (d.tag !== 4 && d.tag !== 27 && d.child !== null) {
                d.child.return = d, d = d.child;
                continue;
              }
              if (d === t) break e;
              for (; d.sibling === null; ) {
                if (d.return === null || d.return === t)
                  break e;
                d = d.return;
              }
              d.sibling.return = d.return, d = d.sibling;
            }
            t.stateNode = s;
            e: switch (ot(s, n, a), n) {
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
            a && xl(t);
          }
        }
        return Le(t), Hu(
          t,
          t.type,
          e === null ? null : e.memoizedProps,
          t.pendingProps,
          l
        ), null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== a && xl(t);
        else {
          if (typeof a != "string" && t.stateNode === null)
            throw Error(u(166));
          if (e = Z.current, $a(t)) {
            if (e = t.stateNode, l = t.memoizedProps, a = null, n = ct, n !== null)
              switch (n.tag) {
                case 27:
                case 5:
                  a = n.memoizedProps;
              }
            e[st] = t, e = !!(e.nodeValue === l || a !== null && a.suppressHydrationWarning === !0 || gh(e.nodeValue, l)), e || Hl(t, !0);
          } else
            e = Cs(e).createTextNode(
              a
            ), e[st] = t, t.stateNode = e;
        }
        return Le(t), null;
      case 31:
        if (l = t.memoizedState, e === null || e.memoizedState !== null) {
          if (a = $a(t), l !== null) {
            if (e === null) {
              if (!a) throw Error(u(318));
              if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(u(557));
              e[st] = t;
            } else
              fa(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Le(t), e = !1;
          } else
            l = Zc(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = l), e = !0;
          if (!e)
            return t.flags & 256 ? (Rt(t), t) : (Rt(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(u(558));
        }
        return Le(t), null;
      case 13:
        if (a = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (n = $a(t), a !== null && a.dehydrated !== null) {
            if (e === null) {
              if (!n) throw Error(u(318));
              if (n = t.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(u(317));
              n[st] = t;
            } else
              fa(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Le(t), n = !1;
          } else
            n = Zc(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), n = !0;
          if (!n)
            return t.flags & 256 ? (Rt(t), t) : (Rt(t), null);
        }
        return Rt(t), (t.flags & 128) !== 0 ? (t.lanes = l, t) : (l = a !== null, e = e !== null && e.memoizedState !== null, l && (a = t.child, n = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (n = a.alternate.memoizedState.cachePool.pool), s = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (s = a.memoizedState.cachePool.pool), s !== n && (a.flags |= 2048)), l !== e && l && (t.child.flags |= 8192), hs(t, t.updateQueue), Le(t), null);
      case 4:
        return Ye(), e === null && nr(t.stateNode.containerInfo), Le(t), null;
      case 10:
        return ml(t.type), Le(t), null;
      case 19:
        if (D(Ke), a = t.memoizedState, a === null) return Le(t), null;
        if (n = (t.flags & 128) !== 0, s = a.rendering, s === null)
          if (n) Fn(a, !1);
          else {
            if ($e !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (s = es(e), s !== null) {
                  for (t.flags |= 128, Fn(a, !1), e = s.updateQueue, t.updateQueue = e, hs(t, e), t.subtreeFlags = 0, e = l, l = t.child; l !== null; )
                    Ko(l, e), l = l.sibling;
                  return X(
                    Ke,
                    Ke.current & 1 | 2
                  ), be && fl(t, a.treeForkCount), t.child;
                }
                e = e.sibling;
              }
            a.tail !== null && Fe() > xs && (t.flags |= 128, n = !0, Fn(a, !1), t.lanes = 4194304);
          }
        else {
          if (!n)
            if (e = es(s), e !== null) {
              if (t.flags |= 128, n = !0, e = e.updateQueue, t.updateQueue = e, hs(t, e), Fn(a, !0), a.tail === null && a.tailMode === "hidden" && !s.alternate && !be)
                return Le(t), null;
            } else
              2 * Fe() - a.renderingStartTime > xs && l !== 536870912 && (t.flags |= 128, n = !0, Fn(a, !1), t.lanes = 4194304);
          a.isBackwards ? (s.sibling = t.child, t.child = s) : (e = a.last, e !== null ? e.sibling = s : t.child = s, a.last = s);
        }
        return a.tail !== null ? (e = a.tail, a.rendering = e, a.tail = e.sibling, a.renderingStartTime = Fe(), e.sibling = null, l = Ke.current, X(
          Ke,
          n ? l & 1 | 2 : l & 1
        ), be && fl(t, a.treeForkCount), e) : (Le(t), null);
      case 22:
      case 23:
        return Rt(t), iu(), a = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (l & 536870912) !== 0 && (t.flags & 128) === 0 && (Le(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Le(t), l = t.updateQueue, l !== null && hs(t, l.retryQueue), l = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== l && (t.flags |= 2048), e !== null && D(pa), null;
      case 24:
        return l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), ml(We), Le(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(u(156, t.tag));
  }
  function bv(e, t) {
    switch (Xc(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return ml(We), Ye(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return Ft(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (Rt(t), t.alternate === null)
            throw Error(u(340));
          fa();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 13:
        if (Rt(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(u(340));
          fa();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return D(Ke), null;
      case 4:
        return Ye(), null;
      case 10:
        return ml(t.type), null;
      case 22:
      case 23:
        return Rt(t), iu(), e !== null && D(pa), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return ml(We), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Sf(e, t) {
    switch (Xc(t), t.tag) {
      case 3:
        ml(We), Ye();
        break;
      case 26:
      case 27:
      case 5:
        Ft(t);
        break;
      case 4:
        Ye();
        break;
      case 31:
        t.memoizedState !== null && Rt(t);
        break;
      case 13:
        Rt(t);
        break;
      case 19:
        D(Ke);
        break;
      case 10:
        ml(t.type);
        break;
      case 22:
      case 23:
        Rt(t), iu(), e !== null && D(pa);
        break;
      case 24:
        ml(We);
    }
  }
  function Wn(e, t) {
    try {
      var l = t.updateQueue, a = l !== null ? l.lastEffect : null;
      if (a !== null) {
        var n = a.next;
        l = n;
        do {
          if ((l.tag & e) === e) {
            a = void 0;
            var s = l.create, d = l.inst;
            a = s(), d.destroy = a;
          }
          l = l.next;
        } while (l !== n);
      }
    } catch (p) {
      Te(t, t.return, p);
    }
  }
  function Vl(e, t, l) {
    try {
      var a = t.updateQueue, n = a !== null ? a.lastEffect : null;
      if (n !== null) {
        var s = n.next;
        a = s;
        do {
          if ((a.tag & e) === e) {
            var d = a.inst, p = d.destroy;
            if (p !== void 0) {
              d.destroy = void 0, n = t;
              var _ = l, T = p;
              try {
                T();
              } catch (k) {
                Te(
                  n,
                  _,
                  k
                );
              }
            }
          }
          a = a.next;
        } while (a !== s);
      }
    } catch (k) {
      Te(t, t.return, k);
    }
  }
  function jf(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var l = e.stateNode;
      try {
        fd(t, l);
      } catch (a) {
        Te(e, e.return, a);
      }
    }
  }
  function wf(e, t, l) {
    l.props = ba(
      e.type,
      e.memoizedProps
    ), l.state = e.memoizedState;
    try {
      l.componentWillUnmount();
    } catch (a) {
      Te(e, t, a);
    }
  }
  function Pn(e, t) {
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
      Te(e, t, n);
    }
  }
  function il(e, t) {
    var l = e.ref, a = e.refCleanup;
    if (l !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (n) {
          Te(e, t, n);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof l == "function")
        try {
          l(null);
        } catch (n) {
          Te(e, t, n);
        }
      else l.current = null;
  }
  function Nf(e) {
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
      Te(e, e.return, n);
    }
  }
  function Uu(e, t, l) {
    try {
      var a = e.stateNode;
      Gv(a, e.type, l, t), a[pt] = t;
    } catch (n) {
      Te(e, e.return, n);
    }
  }
  function Ef(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Fl(e.type) || e.tag === 4;
  }
  function Bu(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Ef(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && Fl(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Lu(e, t, l) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? (l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l).insertBefore(e, t) : (t = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, t.appendChild(e), l = l._reactRootContainer, l != null || t.onclick !== null || (t.onclick = rl));
    else if (a !== 4 && (a === 27 && Fl(e.type) && (l = e.stateNode, t = null), e = e.child, e !== null))
      for (Lu(e, t, l), e = e.sibling; e !== null; )
        Lu(e, t, l), e = e.sibling;
  }
  function ms(e, t, l) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? l.insertBefore(e, t) : l.appendChild(e);
    else if (a !== 4 && (a === 27 && Fl(e.type) && (l = e.stateNode), e = e.child, e !== null))
      for (ms(e, t, l), e = e.sibling; e !== null; )
        ms(e, t, l), e = e.sibling;
  }
  function Mf(e) {
    var t = e.stateNode, l = e.memoizedProps;
    try {
      for (var a = e.type, n = t.attributes; n.length; )
        t.removeAttributeNode(n[0]);
      ot(t, a, l), t[st] = e, t[pt] = l;
    } catch (s) {
      Te(e, e.return, s);
    }
  }
  var yl = !1, et = !1, qu = !1, Cf = typeof WeakSet == "function" ? WeakSet : Set, it = null;
  function _v(e, t) {
    if (e = e.containerInfo, cr = ks, e = Lo(e), Oc(e)) {
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
            var n = a.anchorOffset, s = a.focusNode;
            a = a.focusOffset;
            try {
              l.nodeType, s.nodeType;
            } catch {
              l = null;
              break e;
            }
            var d = 0, p = -1, _ = -1, T = 0, k = 0, B = e, R = null;
            t: for (; ; ) {
              for (var A; B !== l || n !== 0 && B.nodeType !== 3 || (p = d + n), B !== s || a !== 0 && B.nodeType !== 3 || (_ = d + a), B.nodeType === 3 && (d += B.nodeValue.length), (A = B.firstChild) !== null; )
                R = B, B = A;
              for (; ; ) {
                if (B === e) break t;
                if (R === l && ++T === n && (p = d), R === s && ++k === a && (_ = d), (A = B.nextSibling) !== null) break;
                B = R, R = B.parentNode;
              }
              B = A;
            }
            l = p === -1 || _ === -1 ? null : { start: p, end: _ };
          } else l = null;
        }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (ur = { focusedElem: e, selectionRange: l }, ks = !1, it = t; it !== null; )
      if (t = it, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null)
        e.return = t, it = e;
      else
        for (; it !== null; ) {
          switch (t = it, s = t.alternate, e = t.flags, t.tag) {
            case 0:
              if ((e & 4) !== 0 && (e = t.updateQueue, e = e !== null ? e.events : null, e !== null))
                for (l = 0; l < e.length; l++)
                  n = e[l], n.ref.impl = n.nextImpl;
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && s !== null) {
                e = void 0, l = t, n = s.memoizedProps, s = s.memoizedState, a = l.stateNode;
                try {
                  var J = ba(
                    l.type,
                    n
                  );
                  e = a.getSnapshotBeforeUpdate(
                    J,
                    s
                  ), a.__reactInternalSnapshotBeforeUpdate = e;
                } catch (ce) {
                  Te(
                    l,
                    l.return,
                    ce
                  );
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (e = t.stateNode.containerInfo, l = e.nodeType, l === 9)
                  dr(e);
                else if (l === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      dr(e);
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
              if ((e & 1024) !== 0) throw Error(u(163));
          }
          if (e = t.sibling, e !== null) {
            e.return = t.return, it = e;
            break;
          }
          it = t.return;
        }
  }
  function Tf(e, t, l) {
    var a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        _l(e, l), a & 4 && Wn(5, l);
        break;
      case 1:
        if (_l(e, l), a & 4)
          if (e = l.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (d) {
              Te(l, l.return, d);
            }
          else {
            var n = ba(
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
            } catch (d) {
              Te(
                l,
                l.return,
                d
              );
            }
          }
        a & 64 && jf(l), a & 512 && Pn(l, l.return);
        break;
      case 3:
        if (_l(e, l), a & 64 && (e = l.updateQueue, e !== null)) {
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
            fd(e, t);
          } catch (d) {
            Te(l, l.return, d);
          }
        }
        break;
      case 27:
        t === null && a & 4 && Mf(l);
      case 26:
      case 5:
        _l(e, l), t === null && a & 4 && Nf(l), a & 512 && Pn(l, l.return);
        break;
      case 12:
        _l(e, l);
        break;
      case 31:
        _l(e, l), a & 4 && zf(e, l);
        break;
      case 13:
        _l(e, l), a & 4 && Of(e, l), a & 64 && (e = l.memoizedState, e !== null && (e = e.dehydrated, e !== null && (l = Rv.bind(
          null,
          l
        ), Fv(e, l))));
        break;
      case 22:
        if (a = l.memoizedState !== null || yl, !a) {
          t = t !== null && t.memoizedState !== null || et, n = yl;
          var s = et;
          yl = a, (et = t) && !s ? Sl(
            e,
            l,
            (l.subtreeFlags & 8772) !== 0
          ) : _l(e, l), yl = n, et = s;
        }
        break;
      case 30:
        break;
      default:
        _l(e, l);
    }
  }
  function Rf(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Rf(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && vc(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var Ge = null, gt = !1;
  function bl(e, t, l) {
    for (l = l.child; l !== null; )
      Af(e, t, l), l = l.sibling;
  }
  function Af(e, t, l) {
    if (Nt && typeof Nt.onCommitFiberUnmount == "function")
      try {
        Nt.onCommitFiberUnmount(Sn, l);
      } catch {
      }
    switch (l.tag) {
      case 26:
        et || il(l, t), bl(
          e,
          t,
          l
        ), l.memoizedState ? l.memoizedState.count-- : l.stateNode && (l = l.stateNode, l.parentNode.removeChild(l));
        break;
      case 27:
        et || il(l, t);
        var a = Ge, n = gt;
        Fl(l.type) && (Ge = l.stateNode, gt = !1), bl(
          e,
          t,
          l
        ), ci(l.stateNode), Ge = a, gt = n;
        break;
      case 5:
        et || il(l, t);
      case 6:
        if (a = Ge, n = gt, Ge = null, bl(
          e,
          t,
          l
        ), Ge = a, gt = n, Ge !== null)
          if (gt)
            try {
              (Ge.nodeType === 9 ? Ge.body : Ge.nodeName === "HTML" ? Ge.ownerDocument.body : Ge).removeChild(l.stateNode);
            } catch (s) {
              Te(
                l,
                t,
                s
              );
            }
          else
            try {
              Ge.removeChild(l.stateNode);
            } catch (s) {
              Te(
                l,
                t,
                s
              );
            }
        break;
      case 18:
        Ge !== null && (gt ? (e = Ge, jh(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          l.stateNode
        ), pn(e)) : jh(Ge, l.stateNode));
        break;
      case 4:
        a = Ge, n = gt, Ge = l.stateNode.containerInfo, gt = !0, bl(
          e,
          t,
          l
        ), Ge = a, gt = n;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Vl(2, l, t), et || Vl(4, l, t), bl(
          e,
          t,
          l
        );
        break;
      case 1:
        et || (il(l, t), a = l.stateNode, typeof a.componentWillUnmount == "function" && wf(
          l,
          t,
          a
        )), bl(
          e,
          t,
          l
        );
        break;
      case 21:
        bl(
          e,
          t,
          l
        );
        break;
      case 22:
        et = (a = et) || l.memoizedState !== null, bl(
          e,
          t,
          l
        ), et = a;
        break;
      default:
        bl(
          e,
          t,
          l
        );
    }
  }
  function zf(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
      e = e.dehydrated;
      try {
        pn(e);
      } catch (l) {
        Te(t, t.return, l);
      }
    }
  }
  function Of(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        pn(e);
      } catch (l) {
        Te(t, t.return, l);
      }
  }
  function Sv(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new Cf()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new Cf()), t;
      default:
        throw Error(u(435, e.tag));
    }
  }
  function ps(e, t) {
    var l = Sv(e);
    t.forEach(function(a) {
      if (!l.has(a)) {
        l.add(a);
        var n = Av.bind(null, e, a);
        a.then(n, n);
      }
    });
  }
  function xt(e, t) {
    var l = t.deletions;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var n = l[a], s = e, d = t, p = d;
        e: for (; p !== null; ) {
          switch (p.tag) {
            case 27:
              if (Fl(p.type)) {
                Ge = p.stateNode, gt = !1;
                break e;
              }
              break;
            case 5:
              Ge = p.stateNode, gt = !1;
              break e;
            case 3:
            case 4:
              Ge = p.stateNode.containerInfo, gt = !0;
              break e;
          }
          p = p.return;
        }
        if (Ge === null) throw Error(u(160));
        Af(s, d, n), Ge = null, gt = !1, s = n.alternate, s !== null && (s.return = null), n.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        Df(t, e), t = t.sibling;
  }
  var Pt = null;
  function Df(e, t) {
    var l = e.alternate, a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        xt(t, e), yt(e), a & 4 && (Vl(3, e, e.return), Wn(3, e), Vl(5, e, e.return));
        break;
      case 1:
        xt(t, e), yt(e), a & 512 && (et || l === null || il(l, l.return)), a & 64 && yl && (e = e.updateQueue, e !== null && (a = e.callbacks, a !== null && (l = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = l === null ? a : l.concat(a))));
        break;
      case 26:
        var n = Pt;
        if (xt(t, e), yt(e), a & 512 && (et || l === null || il(l, l.return)), a & 4) {
          var s = l !== null ? l.memoizedState : null;
          if (a = e.memoizedState, l === null)
            if (a === null)
              if (e.stateNode === null) {
                e: {
                  a = e.type, l = e.memoizedProps, n = n.ownerDocument || n;
                  t: switch (a) {
                    case "title":
                      s = n.getElementsByTagName("title")[0], (!s || s[Nn] || s[st] || s.namespaceURI === "http://www.w3.org/2000/svg" || s.hasAttribute("itemprop")) && (s = n.createElement(a), n.head.insertBefore(
                        s,
                        n.querySelector("head > title")
                      )), ot(s, a, l), s[st] = e, nt(s), a = s;
                      break e;
                    case "link":
                      var d = Dh(
                        "link",
                        "href",
                        n
                      ).get(a + (l.href || ""));
                      if (d) {
                        for (var p = 0; p < d.length; p++)
                          if (s = d[p], s.getAttribute("href") === (l.href == null || l.href === "" ? null : l.href) && s.getAttribute("rel") === (l.rel == null ? null : l.rel) && s.getAttribute("title") === (l.title == null ? null : l.title) && s.getAttribute("crossorigin") === (l.crossOrigin == null ? null : l.crossOrigin)) {
                            d.splice(p, 1);
                            break t;
                          }
                      }
                      s = n.createElement(a), ot(s, a, l), n.head.appendChild(s);
                      break;
                    case "meta":
                      if (d = Dh(
                        "meta",
                        "content",
                        n
                      ).get(a + (l.content || ""))) {
                        for (p = 0; p < d.length; p++)
                          if (s = d[p], s.getAttribute("content") === (l.content == null ? null : "" + l.content) && s.getAttribute("name") === (l.name == null ? null : l.name) && s.getAttribute("property") === (l.property == null ? null : l.property) && s.getAttribute("http-equiv") === (l.httpEquiv == null ? null : l.httpEquiv) && s.getAttribute("charset") === (l.charSet == null ? null : l.charSet)) {
                            d.splice(p, 1);
                            break t;
                          }
                      }
                      s = n.createElement(a), ot(s, a, l), n.head.appendChild(s);
                      break;
                    default:
                      throw Error(u(468, a));
                  }
                  s[st] = e, nt(s), a = s;
                }
                e.stateNode = a;
              } else
                kh(
                  n,
                  e.type,
                  e.stateNode
                );
            else
              e.stateNode = Oh(
                n,
                a,
                e.memoizedProps
              );
          else
            s !== a ? (s === null ? l.stateNode !== null && (l = l.stateNode, l.parentNode.removeChild(l)) : s.count--, a === null ? kh(
              n,
              e.type,
              e.stateNode
            ) : Oh(
              n,
              a,
              e.memoizedProps
            )) : a === null && e.stateNode !== null && Uu(
              e,
              e.memoizedProps,
              l.memoizedProps
            );
        }
        break;
      case 27:
        xt(t, e), yt(e), a & 512 && (et || l === null || il(l, l.return)), l !== null && a & 4 && Uu(
          e,
          e.memoizedProps,
          l.memoizedProps
        );
        break;
      case 5:
        if (xt(t, e), yt(e), a & 512 && (et || l === null || il(l, l.return)), e.flags & 32) {
          n = e.stateNode;
          try {
            Ua(n, "");
          } catch (J) {
            Te(e, e.return, J);
          }
        }
        a & 4 && e.stateNode != null && (n = e.memoizedProps, Uu(
          e,
          n,
          l !== null ? l.memoizedProps : n
        )), a & 1024 && (qu = !0);
        break;
      case 6:
        if (xt(t, e), yt(e), a & 4) {
          if (e.stateNode === null)
            throw Error(u(162));
          a = e.memoizedProps, l = e.stateNode;
          try {
            l.nodeValue = a;
          } catch (J) {
            Te(e, e.return, J);
          }
        }
        break;
      case 3:
        if (As = null, n = Pt, Pt = Ts(t.containerInfo), xt(t, e), Pt = n, yt(e), a & 4 && l !== null && l.memoizedState.isDehydrated)
          try {
            pn(t.containerInfo);
          } catch (J) {
            Te(e, e.return, J);
          }
        qu && (qu = !1, kf(e));
        break;
      case 4:
        a = Pt, Pt = Ts(
          e.stateNode.containerInfo
        ), xt(t, e), yt(e), Pt = a;
        break;
      case 12:
        xt(t, e), yt(e);
        break;
      case 31:
        xt(t, e), yt(e), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, ps(e, a)));
        break;
      case 13:
        xt(t, e), yt(e), e.child.flags & 8192 && e.memoizedState !== null != (l !== null && l.memoizedState !== null) && (gs = Fe()), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, ps(e, a)));
        break;
      case 22:
        n = e.memoizedState !== null;
        var _ = l !== null && l.memoizedState !== null, T = yl, k = et;
        if (yl = T || n, et = k || _, xt(t, e), et = k, yl = T, yt(e), a & 8192)
          e: for (t = e.stateNode, t._visibility = n ? t._visibility & -2 : t._visibility | 1, n && (l === null || _ || yl || et || _a(e)), l = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (l === null) {
                _ = l = t;
                try {
                  if (s = _.stateNode, n)
                    d = s.style, typeof d.setProperty == "function" ? d.setProperty("display", "none", "important") : d.display = "none";
                  else {
                    p = _.stateNode;
                    var B = _.memoizedProps.style, R = B != null && B.hasOwnProperty("display") ? B.display : null;
                    p.style.display = R == null || typeof R == "boolean" ? "" : ("" + R).trim();
                  }
                } catch (J) {
                  Te(_, _.return, J);
                }
              }
            } else if (t.tag === 6) {
              if (l === null) {
                _ = t;
                try {
                  _.stateNode.nodeValue = n ? "" : _.memoizedProps;
                } catch (J) {
                  Te(_, _.return, J);
                }
              }
            } else if (t.tag === 18) {
              if (l === null) {
                _ = t;
                try {
                  var A = _.stateNode;
                  n ? wh(A, !0) : wh(_.stateNode, !1);
                } catch (J) {
                  Te(_, _.return, J);
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
        a & 4 && (a = e.updateQueue, a !== null && (l = a.retryQueue, l !== null && (a.retryQueue = null, ps(e, l))));
        break;
      case 19:
        xt(t, e), yt(e), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, ps(e, a)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        xt(t, e), yt(e);
    }
  }
  function yt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var l, a = e.return; a !== null; ) {
          if (Ef(a)) {
            l = a;
            break;
          }
          a = a.return;
        }
        if (l == null) throw Error(u(160));
        switch (l.tag) {
          case 27:
            var n = l.stateNode, s = Bu(e);
            ms(e, s, n);
            break;
          case 5:
            var d = l.stateNode;
            l.flags & 32 && (Ua(d, ""), l.flags &= -33);
            var p = Bu(e);
            ms(e, p, d);
            break;
          case 3:
          case 4:
            var _ = l.stateNode.containerInfo, T = Bu(e);
            Lu(
              e,
              T,
              _
            );
            break;
          default:
            throw Error(u(161));
        }
      } catch (k) {
        Te(e, e.return, k);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function kf(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        kf(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
  }
  function _l(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        Tf(e, t.alternate, t), t = t.sibling;
  }
  function _a(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Vl(4, t, t.return), _a(t);
          break;
        case 1:
          il(t, t.return);
          var l = t.stateNode;
          typeof l.componentWillUnmount == "function" && wf(
            t,
            t.return,
            l
          ), _a(t);
          break;
        case 27:
          ci(t.stateNode);
        case 26:
        case 5:
          il(t, t.return), _a(t);
          break;
        case 22:
          t.memoizedState === null && _a(t);
          break;
        case 30:
          _a(t);
          break;
        default:
          _a(t);
      }
      e = e.sibling;
    }
  }
  function Sl(e, t, l) {
    for (l = l && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var a = t.alternate, n = e, s = t, d = s.flags;
      switch (s.tag) {
        case 0:
        case 11:
        case 15:
          Sl(
            n,
            s,
            l
          ), Wn(4, s);
          break;
        case 1:
          if (Sl(
            n,
            s,
            l
          ), a = s, n = a.stateNode, typeof n.componentDidMount == "function")
            try {
              n.componentDidMount();
            } catch (T) {
              Te(a, a.return, T);
            }
          if (a = s, n = a.updateQueue, n !== null) {
            var p = a.stateNode;
            try {
              var _ = n.shared.hiddenCallbacks;
              if (_ !== null)
                for (n.shared.hiddenCallbacks = null, n = 0; n < _.length; n++)
                  dd(_[n], p);
            } catch (T) {
              Te(a, a.return, T);
            }
          }
          l && d & 64 && jf(s), Pn(s, s.return);
          break;
        case 27:
          Mf(s);
        case 26:
        case 5:
          Sl(
            n,
            s,
            l
          ), l && a === null && d & 4 && Nf(s), Pn(s, s.return);
          break;
        case 12:
          Sl(
            n,
            s,
            l
          );
          break;
        case 31:
          Sl(
            n,
            s,
            l
          ), l && d & 4 && zf(n, s);
          break;
        case 13:
          Sl(
            n,
            s,
            l
          ), l && d & 4 && Of(n, s);
          break;
        case 22:
          s.memoizedState === null && Sl(
            n,
            s,
            l
          ), Pn(s, s.return);
          break;
        case 30:
          break;
        default:
          Sl(
            n,
            s,
            l
          );
      }
      t = t.sibling;
    }
  }
  function Yu(e, t) {
    var l = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== l && (e != null && e.refCount++, l != null && Bn(l));
  }
  function Gu(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Bn(e));
  }
  function It(e, t, l, a) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        Hf(
          e,
          t,
          l,
          a
        ), t = t.sibling;
  }
  function Hf(e, t, l, a) {
    var n = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        It(
          e,
          t,
          l,
          a
        ), n & 2048 && Wn(9, t);
        break;
      case 1:
        It(
          e,
          t,
          l,
          a
        );
        break;
      case 3:
        It(
          e,
          t,
          l,
          a
        ), n & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Bn(e)));
        break;
      case 12:
        if (n & 2048) {
          It(
            e,
            t,
            l,
            a
          ), e = t.stateNode;
          try {
            var s = t.memoizedProps, d = s.id, p = s.onPostCommit;
            typeof p == "function" && p(
              d,
              t.alternate === null ? "mount" : "update",
              e.passiveEffectDuration,
              -0
            );
          } catch (_) {
            Te(t, t.return, _);
          }
        } else
          It(
            e,
            t,
            l,
            a
          );
        break;
      case 31:
        It(
          e,
          t,
          l,
          a
        );
        break;
      case 13:
        It(
          e,
          t,
          l,
          a
        );
        break;
      case 23:
        break;
      case 22:
        s = t.stateNode, d = t.alternate, t.memoizedState !== null ? s._visibility & 2 ? It(
          e,
          t,
          l,
          a
        ) : In(e, t) : s._visibility & 2 ? It(
          e,
          t,
          l,
          a
        ) : (s._visibility |= 2, an(
          e,
          t,
          l,
          a,
          (t.subtreeFlags & 10256) !== 0 || !1
        )), n & 2048 && Yu(d, t);
        break;
      case 24:
        It(
          e,
          t,
          l,
          a
        ), n & 2048 && Gu(t.alternate, t);
        break;
      default:
        It(
          e,
          t,
          l,
          a
        );
    }
  }
  function an(e, t, l, a, n) {
    for (n = n && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var s = e, d = t, p = l, _ = a, T = d.flags;
      switch (d.tag) {
        case 0:
        case 11:
        case 15:
          an(
            s,
            d,
            p,
            _,
            n
          ), Wn(8, d);
          break;
        case 23:
          break;
        case 22:
          var k = d.stateNode;
          d.memoizedState !== null ? k._visibility & 2 ? an(
            s,
            d,
            p,
            _,
            n
          ) : In(
            s,
            d
          ) : (k._visibility |= 2, an(
            s,
            d,
            p,
            _,
            n
          )), n && T & 2048 && Yu(
            d.alternate,
            d
          );
          break;
        case 24:
          an(
            s,
            d,
            p,
            _,
            n
          ), n && T & 2048 && Gu(d.alternate, d);
          break;
        default:
          an(
            s,
            d,
            p,
            _,
            n
          );
      }
      t = t.sibling;
    }
  }
  function In(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var l = e, a = t, n = a.flags;
        switch (a.tag) {
          case 22:
            In(l, a), n & 2048 && Yu(
              a.alternate,
              a
            );
            break;
          case 24:
            In(l, a), n & 2048 && Gu(a.alternate, a);
            break;
          default:
            In(l, a);
        }
        t = t.sibling;
      }
  }
  var ei = 8192;
  function nn(e, t, l) {
    if (e.subtreeFlags & ei)
      for (e = e.child; e !== null; )
        Uf(
          e,
          t,
          l
        ), e = e.sibling;
  }
  function Uf(e, t, l) {
    switch (e.tag) {
      case 26:
        nn(
          e,
          t,
          l
        ), e.flags & ei && e.memoizedState !== null && u0(
          l,
          Pt,
          e.memoizedState,
          e.memoizedProps
        );
        break;
      case 5:
        nn(
          e,
          t,
          l
        );
        break;
      case 3:
      case 4:
        var a = Pt;
        Pt = Ts(e.stateNode.containerInfo), nn(
          e,
          t,
          l
        ), Pt = a;
        break;
      case 22:
        e.memoizedState === null && (a = e.alternate, a !== null && a.memoizedState !== null ? (a = ei, ei = 16777216, nn(
          e,
          t,
          l
        ), ei = a) : nn(
          e,
          t,
          l
        ));
        break;
      default:
        nn(
          e,
          t,
          l
        );
    }
  }
  function Bf(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function ti(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          it = a, qf(
            a,
            e
          );
        }
      Bf(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        Lf(e), e = e.sibling;
  }
  function Lf(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        ti(e), e.flags & 2048 && Vl(9, e, e.return);
        break;
      case 3:
        ti(e);
        break;
      case 12:
        ti(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, vs(e)) : ti(e);
        break;
      default:
        ti(e);
    }
  }
  function vs(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          it = a, qf(
            a,
            e
          );
        }
      Bf(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          Vl(8, t, t.return), vs(t);
          break;
        case 22:
          l = t.stateNode, l._visibility & 2 && (l._visibility &= -3, vs(t));
          break;
        default:
          vs(t);
      }
      e = e.sibling;
    }
  }
  function qf(e, t) {
    for (; it !== null; ) {
      var l = it;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          Vl(8, l, t);
          break;
        case 23:
        case 22:
          if (l.memoizedState !== null && l.memoizedState.cachePool !== null) {
            var a = l.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          Bn(l.memoizedState.cache);
      }
      if (a = l.child, a !== null) a.return = l, it = a;
      else
        e: for (l = e; it !== null; ) {
          a = it;
          var n = a.sibling, s = a.return;
          if (Rf(a), a === l) {
            it = null;
            break e;
          }
          if (n !== null) {
            n.return = s, it = n;
            break e;
          }
          it = s;
        }
    }
  }
  var jv = {
    getCacheForType: function(e) {
      var t = ut(We), l = t.data.get(e);
      return l === void 0 && (l = e(), t.data.set(e, l)), l;
    },
    cacheSignal: function() {
      return ut(We).controller.signal;
    }
  }, wv = typeof WeakMap == "function" ? WeakMap : Map, Ne = 0, De = null, ve = null, xe = 0, Ce = 0, At = null, Xl = !1, sn = !1, Vu = !1, jl = 0, $e = 0, Ql = 0, Sa = 0, Xu = 0, zt = 0, cn = 0, li = null, bt = null, Qu = !1, gs = 0, Yf = 0, xs = 1 / 0, ys = null, Zl = null, at = 0, $l = null, un = null, wl = 0, Zu = 0, $u = null, Gf = null, ai = 0, Ku = null;
  function Ot() {
    return (Ne & 2) !== 0 && xe !== 0 ? xe & -xe : M.T !== null ? er() : lo();
  }
  function Vf() {
    if (zt === 0)
      if ((xe & 536870912) === 0 || be) {
        var e = Mi;
        Mi <<= 1, (Mi & 3932160) === 0 && (Mi = 262144), zt = e;
      } else zt = 536870912;
    return e = Tt.current, e !== null && (e.flags |= 32), zt;
  }
  function _t(e, t, l) {
    (e === De && (Ce === 2 || Ce === 9) || e.cancelPendingCommit !== null) && (rn(e, 0), Kl(
      e,
      xe,
      zt,
      !1
    )), wn(e, l), ((Ne & 2) === 0 || e !== De) && (e === De && ((Ne & 2) === 0 && (Sa |= l), $e === 4 && Kl(
      e,
      xe,
      zt,
      !1
    )), sl(e));
  }
  function Xf(e, t, l) {
    if ((Ne & 6) !== 0) throw Error(u(327));
    var a = !l && (t & 127) === 0 && (t & e.expiredLanes) === 0 || jn(e, t), n = a ? Mv(e, t) : Fu(e, t, !0), s = a;
    do {
      if (n === 0) {
        sn && !a && Kl(e, t, 0, !1);
        break;
      } else {
        if (l = e.current.alternate, s && !Nv(l)) {
          n = Fu(e, t, !1), s = !1;
          continue;
        }
        if (n === 2) {
          if (s = t, e.errorRecoveryDisabledLanes & s)
            var d = 0;
          else
            d = e.pendingLanes & -536870913, d = d !== 0 ? d : d & 536870912 ? 536870912 : 0;
          if (d !== 0) {
            t = d;
            e: {
              var p = e;
              n = li;
              var _ = p.current.memoizedState.isDehydrated;
              if (_ && (rn(p, d).flags |= 256), d = Fu(
                p,
                d,
                !1
              ), d !== 2) {
                if (Vu && !_) {
                  p.errorRecoveryDisabledLanes |= s, Sa |= s, n = 4;
                  break e;
                }
                s = bt, bt = n, s !== null && (bt === null ? bt = s : bt.push.apply(
                  bt,
                  s
                ));
              }
              n = d;
            }
            if (s = !1, n !== 2) continue;
          }
        }
        if (n === 1) {
          rn(e, 0), Kl(e, t, 0, !0);
          break;
        }
        e: {
          switch (a = e, s = n, s) {
            case 0:
            case 1:
              throw Error(u(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              Kl(
                a,
                t,
                zt,
                !Xl
              );
              break e;
            case 2:
              bt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(u(329));
          }
          if ((t & 62914560) === t && (n = gs + 300 - Fe(), 10 < n)) {
            if (Kl(
              a,
              t,
              zt,
              !Xl
            ), Ti(a, 0, !0) !== 0) break e;
            wl = t, a.timeoutHandle = _h(
              Qf.bind(
                null,
                a,
                l,
                bt,
                ys,
                Qu,
                t,
                zt,
                Sa,
                cn,
                Xl,
                s,
                "Throttled",
                -0,
                0
              ),
              n
            );
            break e;
          }
          Qf(
            a,
            l,
            bt,
            ys,
            Qu,
            t,
            zt,
            Sa,
            cn,
            Xl,
            s,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    sl(e);
  }
  function Qf(e, t, l, a, n, s, d, p, _, T, k, B, R, A) {
    if (e.timeoutHandle = -1, B = t.subtreeFlags, B & 8192 || (B & 16785408) === 16785408) {
      B = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: rl
      }, Uf(
        t,
        s,
        B
      );
      var J = (s & 62914560) === s ? gs - Fe() : (s & 4194048) === s ? Yf - Fe() : 0;
      if (J = r0(
        B,
        J
      ), J !== null) {
        wl = s, e.cancelPendingCommit = J(
          If.bind(
            null,
            e,
            t,
            s,
            l,
            a,
            n,
            d,
            p,
            _,
            k,
            B,
            null,
            R,
            A
          )
        ), Kl(e, s, d, !T);
        return;
      }
    }
    If(
      e,
      t,
      s,
      l,
      a,
      n,
      d,
      p,
      _
    );
  }
  function Nv(e) {
    for (var t = e; ; ) {
      var l = t.tag;
      if ((l === 0 || l === 11 || l === 15) && t.flags & 16384 && (l = t.updateQueue, l !== null && (l = l.stores, l !== null)))
        for (var a = 0; a < l.length; a++) {
          var n = l[a], s = n.getSnapshot;
          n = n.value;
          try {
            if (!Mt(s(), n)) return !1;
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
  function Kl(e, t, l, a) {
    t &= ~Xu, t &= ~Sa, e.suspendedLanes |= t, e.pingedLanes &= ~t, a && (e.warmLanes |= t), a = e.expirationTimes;
    for (var n = t; 0 < n; ) {
      var s = 31 - Et(n), d = 1 << s;
      a[s] = -1, n &= ~d;
    }
    l !== 0 && Ir(e, l, t);
  }
  function bs() {
    return (Ne & 6) === 0 ? (ni(0), !1) : !0;
  }
  function Ju() {
    if (ve !== null) {
      if (Ce === 0)
        var e = ve.return;
      else
        e = ve, hl = ha = null, du(e), Pa = null, qn = 0, e = ve;
      for (; e !== null; )
        Sf(e.alternate, e), e = e.return;
      ve = null;
    }
  }
  function rn(e, t) {
    var l = e.timeoutHandle;
    l !== -1 && (e.timeoutHandle = -1, Qv(l)), l = e.cancelPendingCommit, l !== null && (e.cancelPendingCommit = null, l()), wl = 0, Ju(), De = e, ve = l = dl(e.current, null), xe = t, Ce = 0, At = null, Xl = !1, sn = jn(e, t), Vu = !1, cn = zt = Xu = Sa = Ql = $e = 0, bt = li = null, Qu = !1, (t & 8) !== 0 && (t |= t & 32);
    var a = e.entangledLanes;
    if (a !== 0)
      for (e = e.entanglements, a &= t; 0 < a; ) {
        var n = 31 - Et(a), s = 1 << n;
        t |= e[n], a &= ~s;
      }
    return jl = t, Yi(), l;
  }
  function Zf(e, t) {
    fe = null, M.H = Kn, t === Wa || t === Ji ? (t = cd(), Ce = 3) : t === Ic ? (t = cd(), Ce = 4) : Ce = t === Mu ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, At = t, ve === null && ($e = 1, rs(
      e,
      Yt(t, e.current)
    ));
  }
  function $f() {
    var e = Tt.current;
    return e === null ? !0 : (xe & 4194048) === xe ? Qt === null : (xe & 62914560) === xe || (xe & 536870912) !== 0 ? e === Qt : !1;
  }
  function Kf() {
    var e = M.H;
    return M.H = Kn, e === null ? Kn : e;
  }
  function Jf() {
    var e = M.A;
    return M.A = jv, e;
  }
  function _s() {
    $e = 4, Xl || (xe & 4194048) !== xe && Tt.current !== null || (sn = !0), (Ql & 134217727) === 0 && (Sa & 134217727) === 0 || De === null || Kl(
      De,
      xe,
      zt,
      !1
    );
  }
  function Fu(e, t, l) {
    var a = Ne;
    Ne |= 2;
    var n = Kf(), s = Jf();
    (De !== e || xe !== t) && (ys = null, rn(e, t)), t = !1;
    var d = $e;
    e: do
      try {
        if (Ce !== 0 && ve !== null) {
          var p = ve, _ = At;
          switch (Ce) {
            case 8:
              Ju(), d = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              Tt.current === null && (t = !0);
              var T = Ce;
              if (Ce = 0, At = null, on(e, p, _, T), l && sn) {
                d = 0;
                break e;
              }
              break;
            default:
              T = Ce, Ce = 0, At = null, on(e, p, _, T);
          }
        }
        Ev(), d = $e;
        break;
      } catch (k) {
        Zf(e, k);
      }
    while (!0);
    return t && e.shellSuspendCounter++, hl = ha = null, Ne = a, M.H = n, M.A = s, ve === null && (De = null, xe = 0, Yi()), d;
  }
  function Ev() {
    for (; ve !== null; ) Ff(ve);
  }
  function Mv(e, t) {
    var l = Ne;
    Ne |= 2;
    var a = Kf(), n = Jf();
    De !== e || xe !== t ? (ys = null, xs = Fe() + 500, rn(e, t)) : sn = jn(
      e,
      t
    );
    e: do
      try {
        if (Ce !== 0 && ve !== null) {
          t = ve;
          var s = At;
          t: switch (Ce) {
            case 1:
              Ce = 0, At = null, on(e, t, s, 1);
              break;
            case 2:
            case 9:
              if (id(s)) {
                Ce = 0, At = null, Wf(t);
                break;
              }
              t = function() {
                Ce !== 2 && Ce !== 9 || De !== e || (Ce = 7), sl(e);
              }, s.then(t, t);
              break e;
            case 3:
              Ce = 7;
              break e;
            case 4:
              Ce = 5;
              break e;
            case 7:
              id(s) ? (Ce = 0, At = null, Wf(t)) : (Ce = 0, At = null, on(e, t, s, 7));
              break;
            case 5:
              var d = null;
              switch (ve.tag) {
                case 26:
                  d = ve.memoizedState;
                case 5:
                case 27:
                  var p = ve;
                  if (d ? Hh(d) : p.stateNode.complete) {
                    Ce = 0, At = null;
                    var _ = p.sibling;
                    if (_ !== null) ve = _;
                    else {
                      var T = p.return;
                      T !== null ? (ve = T, Ss(T)) : ve = null;
                    }
                    break t;
                  }
              }
              Ce = 0, At = null, on(e, t, s, 5);
              break;
            case 6:
              Ce = 0, At = null, on(e, t, s, 6);
              break;
            case 8:
              Ju(), $e = 6;
              break e;
            default:
              throw Error(u(462));
          }
        }
        Cv();
        break;
      } catch (k) {
        Zf(e, k);
      }
    while (!0);
    return hl = ha = null, M.H = a, M.A = n, Ne = l, ve !== null ? 0 : (De = null, xe = 0, Yi(), $e);
  }
  function Cv() {
    for (; ve !== null && !oc(); )
      Ff(ve);
  }
  function Ff(e) {
    var t = bf(e.alternate, e, jl);
    e.memoizedProps = e.pendingProps, t === null ? Ss(e) : ve = t;
  }
  function Wf(e) {
    var t = e, l = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = mf(
          l,
          t,
          t.pendingProps,
          t.type,
          void 0,
          xe
        );
        break;
      case 11:
        t = mf(
          l,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          xe
        );
        break;
      case 5:
        du(t);
      default:
        Sf(l, t), t = ve = Ko(t, jl), t = bf(l, t, jl);
    }
    e.memoizedProps = e.pendingProps, t === null ? Ss(e) : ve = t;
  }
  function on(e, t, l, a) {
    hl = ha = null, du(t), Pa = null, qn = 0;
    var n = t.return;
    try {
      if (vv(
        e,
        n,
        t,
        l,
        xe
      )) {
        $e = 1, rs(
          e,
          Yt(l, e.current)
        ), ve = null;
        return;
      }
    } catch (s) {
      if (n !== null) throw ve = n, s;
      $e = 1, rs(
        e,
        Yt(l, e.current)
      ), ve = null;
      return;
    }
    t.flags & 32768 ? (be || a === 1 ? e = !0 : sn || (xe & 536870912) !== 0 ? e = !1 : (Xl = e = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = Tt.current, a !== null && a.tag === 13 && (a.flags |= 16384))), Pf(t, e)) : Ss(t);
  }
  function Ss(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        Pf(
          t,
          Xl
        );
        return;
      }
      e = t.return;
      var l = yv(
        t.alternate,
        t,
        jl
      );
      if (l !== null) {
        ve = l;
        return;
      }
      if (t = t.sibling, t !== null) {
        ve = t;
        return;
      }
      ve = t = e;
    } while (t !== null);
    $e === 0 && ($e = 5);
  }
  function Pf(e, t) {
    do {
      var l = bv(e.alternate, e);
      if (l !== null) {
        l.flags &= 32767, ve = l;
        return;
      }
      if (l = e.return, l !== null && (l.flags |= 32768, l.subtreeFlags = 0, l.deletions = null), !t && (e = e.sibling, e !== null)) {
        ve = e;
        return;
      }
      ve = e = l;
    } while (e !== null);
    $e = 6, ve = null;
  }
  function If(e, t, l, a, n, s, d, p, _) {
    e.cancelPendingCommit = null;
    do
      js();
    while (at !== 0);
    if ((Ne & 6) !== 0) throw Error(u(327));
    if (t !== null) {
      if (t === e.current) throw Error(u(177));
      if (s = t.lanes | t.childLanes, s |= Bc, cp(
        e,
        l,
        s,
        d,
        p,
        _
      ), e === De && (ve = De = null, xe = 0), un = t, $l = e, wl = l, Zu = s, $u = n, Gf = a, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, zv(Ra, function() {
        return nh(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
        a = M.T, M.T = null, n = U.p, U.p = 2, d = Ne, Ne |= 4;
        try {
          _v(e, t, l);
        } finally {
          Ne = d, U.p = n, M.T = a;
        }
      }
      at = 1, eh(), th(), lh();
    }
  }
  function eh() {
    if (at === 1) {
      at = 0;
      var e = $l, t = un, l = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || l) {
        l = M.T, M.T = null;
        var a = U.p;
        U.p = 2;
        var n = Ne;
        Ne |= 4;
        try {
          Df(t, e);
          var s = ur, d = Lo(e.containerInfo), p = s.focusedElem, _ = s.selectionRange;
          if (d !== p && p && p.ownerDocument && Bo(
            p.ownerDocument.documentElement,
            p
          )) {
            if (_ !== null && Oc(p)) {
              var T = _.start, k = _.end;
              if (k === void 0 && (k = T), "selectionStart" in p)
                p.selectionStart = T, p.selectionEnd = Math.min(
                  k,
                  p.value.length
                );
              else {
                var B = p.ownerDocument || document, R = B && B.defaultView || window;
                if (R.getSelection) {
                  var A = R.getSelection(), J = p.textContent.length, ce = Math.min(_.start, J), Oe = _.end === void 0 ? ce : Math.min(_.end, J);
                  !A.extend && ce > Oe && (d = Oe, Oe = ce, ce = d);
                  var E = Uo(
                    p,
                    ce
                  ), w = Uo(
                    p,
                    Oe
                  );
                  if (E && w && (A.rangeCount !== 1 || A.anchorNode !== E.node || A.anchorOffset !== E.offset || A.focusNode !== w.node || A.focusOffset !== w.offset)) {
                    var C = B.createRange();
                    C.setStart(E.node, E.offset), A.removeAllRanges(), ce > Oe ? (A.addRange(C), A.extend(w.node, w.offset)) : (C.setEnd(w.node, w.offset), A.addRange(C));
                  }
                }
              }
            }
            for (B = [], A = p; A = A.parentNode; )
              A.nodeType === 1 && B.push({
                element: A,
                left: A.scrollLeft,
                top: A.scrollTop
              });
            for (typeof p.focus == "function" && p.focus(), p = 0; p < B.length; p++) {
              var H = B[p];
              H.element.scrollLeft = H.left, H.element.scrollTop = H.top;
            }
          }
          ks = !!cr, ur = cr = null;
        } finally {
          Ne = n, U.p = a, M.T = l;
        }
      }
      e.current = t, at = 2;
    }
  }
  function th() {
    if (at === 2) {
      at = 0;
      var e = $l, t = un, l = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || l) {
        l = M.T, M.T = null;
        var a = U.p;
        U.p = 2;
        var n = Ne;
        Ne |= 4;
        try {
          Tf(e, t.alternate, t);
        } finally {
          Ne = n, U.p = a, M.T = l;
        }
      }
      at = 3;
    }
  }
  function lh() {
    if (at === 4 || at === 3) {
      at = 0, dc();
      var e = $l, t = un, l = wl, a = Gf;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? at = 5 : (at = 0, un = $l = null, ah(e, e.pendingLanes));
      var n = e.pendingLanes;
      if (n === 0 && (Zl = null), mc(l), t = t.stateNode, Nt && typeof Nt.onCommitFiberRoot == "function")
        try {
          Nt.onCommitFiberRoot(
            Sn,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (a !== null) {
        t = M.T, n = U.p, U.p = 2, M.T = null;
        try {
          for (var s = e.onRecoverableError, d = 0; d < a.length; d++) {
            var p = a[d];
            s(p.value, {
              componentStack: p.stack
            });
          }
        } finally {
          M.T = t, U.p = n;
        }
      }
      (wl & 3) !== 0 && js(), sl(e), n = e.pendingLanes, (l & 261930) !== 0 && (n & 42) !== 0 ? e === Ku ? ai++ : (ai = 0, Ku = e) : ai = 0, ni(0);
    }
  }
  function ah(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Bn(t)));
  }
  function js() {
    return eh(), th(), lh(), nh();
  }
  function nh() {
    if (at !== 5) return !1;
    var e = $l, t = Zu;
    Zu = 0;
    var l = mc(wl), a = M.T, n = U.p;
    try {
      U.p = 32 > l ? 32 : l, M.T = null, l = $u, $u = null;
      var s = $l, d = wl;
      if (at = 0, un = $l = null, wl = 0, (Ne & 6) !== 0) throw Error(u(331));
      var p = Ne;
      if (Ne |= 4, Lf(s.current), Hf(
        s,
        s.current,
        d,
        l
      ), Ne = p, ni(0, !1), Nt && typeof Nt.onPostCommitFiberRoot == "function")
        try {
          Nt.onPostCommitFiberRoot(Sn, s);
        } catch {
        }
      return !0;
    } finally {
      U.p = n, M.T = a, ah(e, t);
    }
  }
  function ih(e, t, l) {
    t = Yt(l, t), t = Eu(e.stateNode, t, 2), e = ql(e, t, 2), e !== null && (wn(e, 2), sl(e));
  }
  function Te(e, t, l) {
    if (e.tag === 3)
      ih(e, e, l);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          ih(
            t,
            e,
            l
          );
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (Zl === null || !Zl.has(a))) {
            e = Yt(l, e), l = sf(2), a = ql(t, l, 2), a !== null && (cf(
              l,
              a,
              t,
              e
            ), wn(a, 2), sl(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function Wu(e, t, l) {
    var a = e.pingCache;
    if (a === null) {
      a = e.pingCache = new wv();
      var n = /* @__PURE__ */ new Set();
      a.set(t, n);
    } else
      n = a.get(t), n === void 0 && (n = /* @__PURE__ */ new Set(), a.set(t, n));
    n.has(l) || (Vu = !0, n.add(l), e = Tv.bind(null, e, t, l), t.then(e, e));
  }
  function Tv(e, t, l) {
    var a = e.pingCache;
    a !== null && a.delete(t), e.pingedLanes |= e.suspendedLanes & l, e.warmLanes &= ~l, De === e && (xe & l) === l && ($e === 4 || $e === 3 && (xe & 62914560) === xe && 300 > Fe() - gs ? (Ne & 2) === 0 && rn(e, 0) : Xu |= l, cn === xe && (cn = 0)), sl(e);
  }
  function sh(e, t) {
    t === 0 && (t = Pr()), e = oa(e, t), e !== null && (wn(e, t), sl(e));
  }
  function Rv(e) {
    var t = e.memoizedState, l = 0;
    t !== null && (l = t.retryLane), sh(e, l);
  }
  function Av(e, t) {
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
        throw Error(u(314));
    }
    a !== null && a.delete(t), sh(e, l);
  }
  function zv(e, t) {
    return _n(e, t);
  }
  var ws = null, dn = null, Pu = !1, Ns = !1, Iu = !1, Jl = 0;
  function sl(e) {
    e !== dn && e.next === null && (dn === null ? ws = dn = e : dn = dn.next = e), Ns = !0, Pu || (Pu = !0, Dv());
  }
  function ni(e, t) {
    if (!Iu && Ns) {
      Iu = !0;
      do
        for (var l = !1, a = ws; a !== null; ) {
          if (e !== 0) {
            var n = a.pendingLanes;
            if (n === 0) var s = 0;
            else {
              var d = a.suspendedLanes, p = a.pingedLanes;
              s = (1 << 31 - Et(42 | e) + 1) - 1, s &= n & ~(d & ~p), s = s & 201326741 ? s & 201326741 | 1 : s ? s | 2 : 0;
            }
            s !== 0 && (l = !0, oh(a, s));
          } else
            s = xe, s = Ti(
              a,
              a === De ? s : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (s & 3) === 0 || jn(a, s) || (l = !0, oh(a, s));
          a = a.next;
        }
      while (l);
      Iu = !1;
    }
  }
  function Ov() {
    ch();
  }
  function ch() {
    Ns = Pu = !1;
    var e = 0;
    Jl !== 0 && Xv() && (e = Jl);
    for (var t = Fe(), l = null, a = ws; a !== null; ) {
      var n = a.next, s = uh(a, t);
      s === 0 ? (a.next = null, l === null ? ws = n : l.next = n, n === null && (dn = l)) : (l = a, (e !== 0 || (s & 3) !== 0) && (Ns = !0)), a = n;
    }
    at !== 0 && at !== 5 || ni(e), Jl !== 0 && (Jl = 0);
  }
  function uh(e, t) {
    for (var l = e.suspendedLanes, a = e.pingedLanes, n = e.expirationTimes, s = e.pendingLanes & -62914561; 0 < s; ) {
      var d = 31 - Et(s), p = 1 << d, _ = n[d];
      _ === -1 ? ((p & l) === 0 || (p & a) !== 0) && (n[d] = sp(p, t)) : _ <= t && (e.expiredLanes |= p), s &= ~p;
    }
    if (t = De, l = xe, l = Ti(
      e,
      e === t ? l : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a = e.callbackNode, l === 0 || e === t && (Ce === 2 || Ce === 9) || e.cancelPendingCommit !== null)
      return a !== null && a !== null && aa(a), e.callbackNode = null, e.callbackPriority = 0;
    if ((l & 3) === 0 || jn(e, l)) {
      if (t = l & -l, t === e.callbackPriority) return t;
      switch (a !== null && aa(a), mc(l)) {
        case 2:
        case 8:
          l = na;
          break;
        case 32:
          l = Ra;
          break;
        case 268435456:
          l = Wr;
          break;
        default:
          l = Ra;
      }
      return a = rh.bind(null, e), l = _n(l, a), e.callbackPriority = t, e.callbackNode = l, t;
    }
    return a !== null && a !== null && aa(a), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function rh(e, t) {
    if (at !== 0 && at !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var l = e.callbackNode;
    if (js() && e.callbackNode !== l)
      return null;
    var a = xe;
    return a = Ti(
      e,
      e === De ? a : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a === 0 ? null : (Xf(e, a, t), uh(e, Fe()), e.callbackNode != null && e.callbackNode === l ? rh.bind(null, e) : null);
  }
  function oh(e, t) {
    if (js()) return null;
    Xf(e, t, !0);
  }
  function Dv() {
    Zv(function() {
      (Ne & 6) !== 0 ? _n(
        Ta,
        Ov
      ) : ch();
    });
  }
  function er() {
    if (Jl === 0) {
      var e = Ja;
      e === 0 && (e = Ei, Ei <<= 1, (Ei & 261888) === 0 && (Ei = 256)), Jl = e;
    }
    return Jl;
  }
  function dh(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Oi("" + e);
  }
  function fh(e, t) {
    var l = t.ownerDocument.createElement("input");
    return l.name = t.name, l.value = t.value, e.id && l.setAttribute("form", e.id), t.parentNode.insertBefore(l, t), e = new FormData(e), l.parentNode.removeChild(l), e;
  }
  function kv(e, t, l, a, n) {
    if (t === "submit" && l && l.stateNode === n) {
      var s = dh(
        (n[pt] || null).action
      ), d = a.submitter;
      d && (t = (t = d[pt] || null) ? dh(t.formAction) : d.getAttribute("formAction"), t !== null && (s = t, d = null));
      var p = new Ui(
        "action",
        "action",
        null,
        a,
        n
      );
      e.push({
        event: p,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (Jl !== 0) {
                  var _ = d ? fh(n, d) : new FormData(n);
                  bu(
                    l,
                    {
                      pending: !0,
                      data: _,
                      method: n.method,
                      action: s
                    },
                    null,
                    _
                  );
                }
              } else
                typeof s == "function" && (p.preventDefault(), _ = d ? fh(n, d) : new FormData(n), bu(
                  l,
                  {
                    pending: !0,
                    data: _,
                    method: n.method,
                    action: s
                  },
                  s,
                  _
                ));
            },
            currentTarget: n
          }
        ]
      });
    }
  }
  for (var tr = 0; tr < Uc.length; tr++) {
    var lr = Uc[tr], Hv = lr.toLowerCase(), Uv = lr[0].toUpperCase() + lr.slice(1);
    Wt(
      Hv,
      "on" + Uv
    );
  }
  Wt(Go, "onAnimationEnd"), Wt(Vo, "onAnimationIteration"), Wt(Xo, "onAnimationStart"), Wt("dblclick", "onDoubleClick"), Wt("focusin", "onFocus"), Wt("focusout", "onBlur"), Wt(Ip, "onTransitionRun"), Wt(ev, "onTransitionStart"), Wt(tv, "onTransitionCancel"), Wt(Qo, "onTransitionEnd"), ka("onMouseEnter", ["mouseout", "mouseover"]), ka("onMouseLeave", ["mouseout", "mouseover"]), ka("onPointerEnter", ["pointerout", "pointerover"]), ka("onPointerLeave", ["pointerout", "pointerover"]), sa(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), sa(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), sa("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), sa(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), sa(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), sa(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var ii = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), Bv = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(ii)
  );
  function hh(e, t) {
    t = (t & 4) !== 0;
    for (var l = 0; l < e.length; l++) {
      var a = e[l], n = a.event;
      a = a.listeners;
      e: {
        var s = void 0;
        if (t)
          for (var d = a.length - 1; 0 <= d; d--) {
            var p = a[d], _ = p.instance, T = p.currentTarget;
            if (p = p.listener, _ !== s && n.isPropagationStopped())
              break e;
            s = p, n.currentTarget = T;
            try {
              s(n);
            } catch (k) {
              qi(k);
            }
            n.currentTarget = null, s = _;
          }
        else
          for (d = 0; d < a.length; d++) {
            if (p = a[d], _ = p.instance, T = p.currentTarget, p = p.listener, _ !== s && n.isPropagationStopped())
              break e;
            s = p, n.currentTarget = T;
            try {
              s(n);
            } catch (k) {
              qi(k);
            }
            n.currentTarget = null, s = _;
          }
      }
    }
  }
  function ge(e, t) {
    var l = t[pc];
    l === void 0 && (l = t[pc] = /* @__PURE__ */ new Set());
    var a = e + "__bubble";
    l.has(a) || (mh(t, e, 2, !1), l.add(a));
  }
  function ar(e, t, l) {
    var a = 0;
    t && (a |= 4), mh(
      l,
      e,
      a,
      t
    );
  }
  var Es = "_reactListening" + Math.random().toString(36).slice(2);
  function nr(e) {
    if (!e[Es]) {
      e[Es] = !0, io.forEach(function(l) {
        l !== "selectionchange" && (Bv.has(l) || ar(l, !1, e), ar(l, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Es] || (t[Es] = !0, ar("selectionchange", !1, t));
    }
  }
  function mh(e, t, l, a) {
    switch (Vh(t)) {
      case 2:
        var n = f0;
        break;
      case 8:
        n = h0;
        break;
      default:
        n = yr;
    }
    l = n.bind(
      null,
      t,
      l,
      e
    ), n = void 0, !wc || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (n = !0), a ? n !== void 0 ? e.addEventListener(t, l, {
      capture: !0,
      passive: n
    }) : e.addEventListener(t, l, !0) : n !== void 0 ? e.addEventListener(t, l, {
      passive: n
    }) : e.addEventListener(t, l, !1);
  }
  function ir(e, t, l, a, n) {
    var s = a;
    if ((t & 1) === 0 && (t & 2) === 0 && a !== null)
      e: for (; ; ) {
        if (a === null) return;
        var d = a.tag;
        if (d === 3 || d === 4) {
          var p = a.stateNode.containerInfo;
          if (p === n) break;
          if (d === 4)
            for (d = a.return; d !== null; ) {
              var _ = d.tag;
              if ((_ === 3 || _ === 4) && d.stateNode.containerInfo === n)
                return;
              d = d.return;
            }
          for (; p !== null; ) {
            if (d = za(p), d === null) return;
            if (_ = d.tag, _ === 5 || _ === 6 || _ === 26 || _ === 27) {
              a = s = d;
              continue e;
            }
            p = p.parentNode;
          }
        }
        a = a.return;
      }
    xo(function() {
      var T = s, k = Sc(l), B = [];
      e: {
        var R = Zo.get(e);
        if (R !== void 0) {
          var A = Ui, J = e;
          switch (e) {
            case "keypress":
              if (ki(l) === 0) break e;
            case "keydown":
            case "keyup":
              A = Ap;
              break;
            case "focusin":
              J = "focus", A = Cc;
              break;
            case "focusout":
              J = "blur", A = Cc;
              break;
            case "beforeblur":
            case "afterblur":
              A = Cc;
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
              A = _o;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              A = yp;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              A = Dp;
              break;
            case Go:
            case Vo:
            case Xo:
              A = Sp;
              break;
            case Qo:
              A = Hp;
              break;
            case "scroll":
            case "scrollend":
              A = gp;
              break;
            case "wheel":
              A = Bp;
              break;
            case "copy":
            case "cut":
            case "paste":
              A = wp;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              A = jo;
              break;
            case "toggle":
            case "beforetoggle":
              A = qp;
          }
          var ce = (t & 4) !== 0, Oe = !ce && (e === "scroll" || e === "scrollend"), E = ce ? R !== null ? R + "Capture" : null : R;
          ce = [];
          for (var w = T, C; w !== null; ) {
            var H = w;
            if (C = H.stateNode, H = H.tag, H !== 5 && H !== 26 && H !== 27 || C === null || E === null || (H = Mn(w, E), H != null && ce.push(
              si(w, H, C)
            )), Oe) break;
            w = w.return;
          }
          0 < ce.length && (R = new A(
            R,
            J,
            null,
            l,
            k
          ), B.push({ event: R, listeners: ce }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (R = e === "mouseover" || e === "pointerover", A = e === "mouseout" || e === "pointerout", R && l !== _c && (J = l.relatedTarget || l.fromElement) && (za(J) || J[Aa]))
            break e;
          if ((A || R) && (R = k.window === k ? k : (R = k.ownerDocument) ? R.defaultView || R.parentWindow : window, A ? (J = l.relatedTarget || l.toElement, A = T, J = J ? za(J) : null, J !== null && (Oe = h(J), ce = J.tag, J !== Oe || ce !== 5 && ce !== 27 && ce !== 6) && (J = null)) : (A = null, J = T), A !== J)) {
            if (ce = _o, H = "onMouseLeave", E = "onMouseEnter", w = "mouse", (e === "pointerout" || e === "pointerover") && (ce = jo, H = "onPointerLeave", E = "onPointerEnter", w = "pointer"), Oe = A == null ? R : En(A), C = J == null ? R : En(J), R = new ce(
              H,
              w + "leave",
              A,
              l,
              k
            ), R.target = Oe, R.relatedTarget = C, H = null, za(k) === T && (ce = new ce(
              E,
              w + "enter",
              J,
              l,
              k
            ), ce.target = C, ce.relatedTarget = Oe, H = ce), Oe = H, A && J)
              t: {
                for (ce = Lv, E = A, w = J, C = 0, H = E; H; H = ce(H))
                  C++;
                H = 0;
                for (var ne = w; ne; ne = ce(ne))
                  H++;
                for (; 0 < C - H; )
                  E = ce(E), C--;
                for (; 0 < H - C; )
                  w = ce(w), H--;
                for (; C--; ) {
                  if (E === w || w !== null && E === w.alternate) {
                    ce = E;
                    break t;
                  }
                  E = ce(E), w = ce(w);
                }
                ce = null;
              }
            else ce = null;
            A !== null && ph(
              B,
              R,
              A,
              ce,
              !1
            ), J !== null && Oe !== null && ph(
              B,
              Oe,
              J,
              ce,
              !0
            );
          }
        }
        e: {
          if (R = T ? En(T) : window, A = R.nodeName && R.nodeName.toLowerCase(), A === "select" || A === "input" && R.type === "file")
            var je = Ao;
          else if (To(R))
            if (zo)
              je = Fp;
            else {
              je = Kp;
              var I = $p;
            }
          else
            A = R.nodeName, !A || A.toLowerCase() !== "input" || R.type !== "checkbox" && R.type !== "radio" ? T && bc(T.elementType) && (je = Ao) : je = Jp;
          if (je && (je = je(e, T))) {
            Ro(
              B,
              je,
              l,
              k
            );
            break e;
          }
          I && I(e, R, T), e === "focusout" && T && R.type === "number" && T.memoizedProps.value != null && yc(R, "number", R.value);
        }
        switch (I = T ? En(T) : window, e) {
          case "focusin":
            (To(I) || I.contentEditable === "true") && (Ya = I, Dc = T, kn = null);
            break;
          case "focusout":
            kn = Dc = Ya = null;
            break;
          case "mousedown":
            kc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            kc = !1, qo(B, l, k);
            break;
          case "selectionchange":
            if (Pp) break;
          case "keydown":
          case "keyup":
            qo(B, l, k);
        }
        var me;
        if (Rc)
          e: {
            switch (e) {
              case "compositionstart":
                var ye = "onCompositionStart";
                break e;
              case "compositionend":
                ye = "onCompositionEnd";
                break e;
              case "compositionupdate":
                ye = "onCompositionUpdate";
                break e;
            }
            ye = void 0;
          }
        else
          qa ? Mo(e, l) && (ye = "onCompositionEnd") : e === "keydown" && l.keyCode === 229 && (ye = "onCompositionStart");
        ye && (wo && l.locale !== "ko" && (qa || ye !== "onCompositionStart" ? ye === "onCompositionEnd" && qa && (me = yo()) : (Ol = k, Nc = "value" in Ol ? Ol.value : Ol.textContent, qa = !0)), I = Ms(T, ye), 0 < I.length && (ye = new So(
          ye,
          e,
          null,
          l,
          k
        ), B.push({ event: ye, listeners: I }), me ? ye.data = me : (me = Co(l), me !== null && (ye.data = me)))), (me = Gp ? Vp(e, l) : Xp(e, l)) && (ye = Ms(T, "onBeforeInput"), 0 < ye.length && (I = new So(
          "onBeforeInput",
          "beforeinput",
          null,
          l,
          k
        ), B.push({
          event: I,
          listeners: ye
        }), I.data = me)), kv(
          B,
          e,
          T,
          l,
          k
        );
      }
      hh(B, t);
    });
  }
  function si(e, t, l) {
    return {
      instance: e,
      listener: t,
      currentTarget: l
    };
  }
  function Ms(e, t) {
    for (var l = t + "Capture", a = []; e !== null; ) {
      var n = e, s = n.stateNode;
      if (n = n.tag, n !== 5 && n !== 26 && n !== 27 || s === null || (n = Mn(e, l), n != null && a.unshift(
        si(e, n, s)
      ), n = Mn(e, t), n != null && a.push(
        si(e, n, s)
      )), e.tag === 3) return a;
      e = e.return;
    }
    return [];
  }
  function Lv(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function ph(e, t, l, a, n) {
    for (var s = t._reactName, d = []; l !== null && l !== a; ) {
      var p = l, _ = p.alternate, T = p.stateNode;
      if (p = p.tag, _ !== null && _ === a) break;
      p !== 5 && p !== 26 && p !== 27 || T === null || (_ = T, n ? (T = Mn(l, s), T != null && d.unshift(
        si(l, T, _)
      )) : n || (T = Mn(l, s), T != null && d.push(
        si(l, T, _)
      ))), l = l.return;
    }
    d.length !== 0 && e.push({ event: t, listeners: d });
  }
  var qv = /\r\n?/g, Yv = /\u0000|\uFFFD/g;
  function vh(e) {
    return (typeof e == "string" ? e : "" + e).replace(qv, `
`).replace(Yv, "");
  }
  function gh(e, t) {
    return t = vh(t), vh(e) === t;
  }
  function ze(e, t, l, a, n, s) {
    switch (l) {
      case "children":
        typeof a == "string" ? t === "body" || t === "textarea" && a === "" || Ua(e, a) : (typeof a == "number" || typeof a == "bigint") && t !== "body" && Ua(e, "" + a);
        break;
      case "className":
        Ai(e, "class", a);
        break;
      case "tabIndex":
        Ai(e, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Ai(e, l, a);
        break;
      case "style":
        vo(e, a, s);
        break;
      case "data":
        if (t !== "object") {
          Ai(e, "data", a);
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
        a = Oi("" + a), e.setAttribute(l, a);
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
          typeof s == "function" && (l === "formAction" ? (t !== "input" && ze(e, t, "name", n.name, n, null), ze(
            e,
            t,
            "formEncType",
            n.formEncType,
            n,
            null
          ), ze(
            e,
            t,
            "formMethod",
            n.formMethod,
            n,
            null
          ), ze(
            e,
            t,
            "formTarget",
            n.formTarget,
            n,
            null
          )) : (ze(e, t, "encType", n.encType, n, null), ze(e, t, "method", n.method, n, null), ze(e, t, "target", n.target, n, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(l);
          break;
        }
        a = Oi("" + a), e.setAttribute(l, a);
        break;
      case "onClick":
        a != null && (e.onclick = rl);
        break;
      case "onScroll":
        a != null && ge("scroll", e);
        break;
      case "onScrollEnd":
        a != null && ge("scrollend", e);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(u(61));
          if (l = a.__html, l != null) {
            if (n.children != null) throw Error(u(60));
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
        l = Oi("" + a), e.setAttributeNS(
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
        ge("beforetoggle", e), ge("toggle", e), Ri(e, "popover", a);
        break;
      case "xlinkActuate":
        ul(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        ul(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        ul(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        ul(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        ul(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        ul(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        ul(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        ul(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        ul(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        Ri(e, "is", a);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < l.length) || l[0] !== "o" && l[0] !== "O" || l[1] !== "n" && l[1] !== "N") && (l = pp.get(l) || l, Ri(e, l, a));
    }
  }
  function sr(e, t, l, a, n, s) {
    switch (l) {
      case "style":
        vo(e, a, s);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(u(61));
          if (l = a.__html, l != null) {
            if (n.children != null) throw Error(u(60));
            e.innerHTML = l;
          }
        }
        break;
      case "children":
        typeof a == "string" ? Ua(e, a) : (typeof a == "number" || typeof a == "bigint") && Ua(e, "" + a);
        break;
      case "onScroll":
        a != null && ge("scroll", e);
        break;
      case "onScrollEnd":
        a != null && ge("scrollend", e);
        break;
      case "onClick":
        a != null && (e.onclick = rl);
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
        if (!so.hasOwnProperty(l))
          e: {
            if (l[0] === "o" && l[1] === "n" && (n = l.endsWith("Capture"), t = l.slice(2, n ? l.length - 7 : void 0), s = e[pt] || null, s = s != null ? s[l] : null, typeof s == "function" && e.removeEventListener(t, s, n), typeof a == "function")) {
              typeof s != "function" && s !== null && (l in e ? e[l] = null : e.hasAttribute(l) && e.removeAttribute(l)), e.addEventListener(t, a, n);
              break e;
            }
            l in e ? e[l] = a : a === !0 ? e.setAttribute(l, "") : Ri(e, l, a);
          }
    }
  }
  function ot(e, t, l) {
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
        ge("error", e), ge("load", e);
        var a = !1, n = !1, s;
        for (s in l)
          if (l.hasOwnProperty(s)) {
            var d = l[s];
            if (d != null)
              switch (s) {
                case "src":
                  a = !0;
                  break;
                case "srcSet":
                  n = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(u(137, t));
                default:
                  ze(e, t, s, d, l, null);
              }
          }
        n && ze(e, t, "srcSet", l.srcSet, l, null), a && ze(e, t, "src", l.src, l, null);
        return;
      case "input":
        ge("invalid", e);
        var p = s = d = n = null, _ = null, T = null;
        for (a in l)
          if (l.hasOwnProperty(a)) {
            var k = l[a];
            if (k != null)
              switch (a) {
                case "name":
                  n = k;
                  break;
                case "type":
                  d = k;
                  break;
                case "checked":
                  _ = k;
                  break;
                case "defaultChecked":
                  T = k;
                  break;
                case "value":
                  s = k;
                  break;
                case "defaultValue":
                  p = k;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (k != null)
                    throw Error(u(137, t));
                  break;
                default:
                  ze(e, t, a, k, l, null);
              }
          }
        fo(
          e,
          s,
          p,
          _,
          T,
          d,
          n,
          !1
        );
        return;
      case "select":
        ge("invalid", e), a = d = s = null;
        for (n in l)
          if (l.hasOwnProperty(n) && (p = l[n], p != null))
            switch (n) {
              case "value":
                s = p;
                break;
              case "defaultValue":
                d = p;
                break;
              case "multiple":
                a = p;
              default:
                ze(e, t, n, p, l, null);
            }
        t = s, l = d, e.multiple = !!a, t != null ? Ha(e, !!a, t, !1) : l != null && Ha(e, !!a, l, !0);
        return;
      case "textarea":
        ge("invalid", e), s = n = a = null;
        for (d in l)
          if (l.hasOwnProperty(d) && (p = l[d], p != null))
            switch (d) {
              case "value":
                a = p;
                break;
              case "defaultValue":
                n = p;
                break;
              case "children":
                s = p;
                break;
              case "dangerouslySetInnerHTML":
                if (p != null) throw Error(u(91));
                break;
              default:
                ze(e, t, d, p, l, null);
            }
        mo(e, a, n, s);
        return;
      case "option":
        for (_ in l)
          if (l.hasOwnProperty(_) && (a = l[_], a != null))
            switch (_) {
              case "selected":
                e.selected = a && typeof a != "function" && typeof a != "symbol";
                break;
              default:
                ze(e, t, _, a, l, null);
            }
        return;
      case "dialog":
        ge("beforetoggle", e), ge("toggle", e), ge("cancel", e), ge("close", e);
        break;
      case "iframe":
      case "object":
        ge("load", e);
        break;
      case "video":
      case "audio":
        for (a = 0; a < ii.length; a++)
          ge(ii[a], e);
        break;
      case "image":
        ge("error", e), ge("load", e);
        break;
      case "details":
        ge("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        ge("error", e), ge("load", e);
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
        for (T in l)
          if (l.hasOwnProperty(T) && (a = l[T], a != null))
            switch (T) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(u(137, t));
              default:
                ze(e, t, T, a, l, null);
            }
        return;
      default:
        if (bc(t)) {
          for (k in l)
            l.hasOwnProperty(k) && (a = l[k], a !== void 0 && sr(
              e,
              t,
              k,
              a,
              l,
              void 0
            ));
          return;
        }
    }
    for (p in l)
      l.hasOwnProperty(p) && (a = l[p], a != null && ze(e, t, p, a, l, null));
  }
  function Gv(e, t, l, a) {
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
        var n = null, s = null, d = null, p = null, _ = null, T = null, k = null;
        for (A in l) {
          var B = l[A];
          if (l.hasOwnProperty(A) && B != null)
            switch (A) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                _ = B;
              default:
                a.hasOwnProperty(A) || ze(e, t, A, null, a, B);
            }
        }
        for (var R in a) {
          var A = a[R];
          if (B = l[R], a.hasOwnProperty(R) && (A != null || B != null))
            switch (R) {
              case "type":
                s = A;
                break;
              case "name":
                n = A;
                break;
              case "checked":
                T = A;
                break;
              case "defaultChecked":
                k = A;
                break;
              case "value":
                d = A;
                break;
              case "defaultValue":
                p = A;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (A != null)
                  throw Error(u(137, t));
                break;
              default:
                A !== B && ze(
                  e,
                  t,
                  R,
                  A,
                  a,
                  B
                );
            }
        }
        xc(
          e,
          d,
          p,
          _,
          T,
          k,
          s,
          n
        );
        return;
      case "select":
        A = d = p = R = null;
        for (s in l)
          if (_ = l[s], l.hasOwnProperty(s) && _ != null)
            switch (s) {
              case "value":
                break;
              case "multiple":
                A = _;
              default:
                a.hasOwnProperty(s) || ze(
                  e,
                  t,
                  s,
                  null,
                  a,
                  _
                );
            }
        for (n in a)
          if (s = a[n], _ = l[n], a.hasOwnProperty(n) && (s != null || _ != null))
            switch (n) {
              case "value":
                R = s;
                break;
              case "defaultValue":
                p = s;
                break;
              case "multiple":
                d = s;
              default:
                s !== _ && ze(
                  e,
                  t,
                  n,
                  s,
                  a,
                  _
                );
            }
        t = p, l = d, a = A, R != null ? Ha(e, !!l, R, !1) : !!a != !!l && (t != null ? Ha(e, !!l, t, !0) : Ha(e, !!l, l ? [] : "", !1));
        return;
      case "textarea":
        A = R = null;
        for (p in l)
          if (n = l[p], l.hasOwnProperty(p) && n != null && !a.hasOwnProperty(p))
            switch (p) {
              case "value":
                break;
              case "children":
                break;
              default:
                ze(e, t, p, null, a, n);
            }
        for (d in a)
          if (n = a[d], s = l[d], a.hasOwnProperty(d) && (n != null || s != null))
            switch (d) {
              case "value":
                R = n;
                break;
              case "defaultValue":
                A = n;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (n != null) throw Error(u(91));
                break;
              default:
                n !== s && ze(e, t, d, n, a, s);
            }
        ho(e, R, A);
        return;
      case "option":
        for (var J in l)
          if (R = l[J], l.hasOwnProperty(J) && R != null && !a.hasOwnProperty(J))
            switch (J) {
              case "selected":
                e.selected = !1;
                break;
              default:
                ze(
                  e,
                  t,
                  J,
                  null,
                  a,
                  R
                );
            }
        for (_ in a)
          if (R = a[_], A = l[_], a.hasOwnProperty(_) && R !== A && (R != null || A != null))
            switch (_) {
              case "selected":
                e.selected = R && typeof R != "function" && typeof R != "symbol";
                break;
              default:
                ze(
                  e,
                  t,
                  _,
                  R,
                  a,
                  A
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
        for (var ce in l)
          R = l[ce], l.hasOwnProperty(ce) && R != null && !a.hasOwnProperty(ce) && ze(e, t, ce, null, a, R);
        for (T in a)
          if (R = a[T], A = l[T], a.hasOwnProperty(T) && R !== A && (R != null || A != null))
            switch (T) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (R != null)
                  throw Error(u(137, t));
                break;
              default:
                ze(
                  e,
                  t,
                  T,
                  R,
                  a,
                  A
                );
            }
        return;
      default:
        if (bc(t)) {
          for (var Oe in l)
            R = l[Oe], l.hasOwnProperty(Oe) && R !== void 0 && !a.hasOwnProperty(Oe) && sr(
              e,
              t,
              Oe,
              void 0,
              a,
              R
            );
          for (k in a)
            R = a[k], A = l[k], !a.hasOwnProperty(k) || R === A || R === void 0 && A === void 0 || sr(
              e,
              t,
              k,
              R,
              a,
              A
            );
          return;
        }
    }
    for (var E in l)
      R = l[E], l.hasOwnProperty(E) && R != null && !a.hasOwnProperty(E) && ze(e, t, E, null, a, R);
    for (B in a)
      R = a[B], A = l[B], !a.hasOwnProperty(B) || R === A || R == null && A == null || ze(e, t, B, R, a, A);
  }
  function xh(e) {
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
  function Vv() {
    if (typeof performance.getEntriesByType == "function") {
      for (var e = 0, t = 0, l = performance.getEntriesByType("resource"), a = 0; a < l.length; a++) {
        var n = l[a], s = n.transferSize, d = n.initiatorType, p = n.duration;
        if (s && p && xh(d)) {
          for (d = 0, p = n.responseEnd, a += 1; a < l.length; a++) {
            var _ = l[a], T = _.startTime;
            if (T > p) break;
            var k = _.transferSize, B = _.initiatorType;
            k && xh(B) && (_ = _.responseEnd, d += k * (_ < p ? 1 : (p - T) / (_ - T)));
          }
          if (--a, t += 8 * (s + d) / (n.duration / 1e3), e++, 10 < e) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
  }
  var cr = null, ur = null;
  function Cs(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function yh(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function bh(e, t) {
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
  function rr(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var or = null;
  function Xv() {
    var e = window.event;
    return e && e.type === "popstate" ? e === or ? !1 : (or = e, !0) : (or = null, !1);
  }
  var _h = typeof setTimeout == "function" ? setTimeout : void 0, Qv = typeof clearTimeout == "function" ? clearTimeout : void 0, Sh = typeof Promise == "function" ? Promise : void 0, Zv = typeof queueMicrotask == "function" ? queueMicrotask : typeof Sh < "u" ? function(e) {
    return Sh.resolve(null).then(e).catch($v);
  } : _h;
  function $v(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Fl(e) {
    return e === "head";
  }
  function jh(e, t) {
    var l = t, a = 0;
    do {
      var n = l.nextSibling;
      if (e.removeChild(l), n && n.nodeType === 8)
        if (l = n.data, l === "/$" || l === "/&") {
          if (a === 0) {
            e.removeChild(n), pn(t);
            return;
          }
          a--;
        } else if (l === "$" || l === "$?" || l === "$~" || l === "$!" || l === "&")
          a++;
        else if (l === "html")
          ci(e.ownerDocument.documentElement);
        else if (l === "head") {
          l = e.ownerDocument.head, ci(l);
          for (var s = l.firstChild; s; ) {
            var d = s.nextSibling, p = s.nodeName;
            s[Nn] || p === "SCRIPT" || p === "STYLE" || p === "LINK" && s.rel.toLowerCase() === "stylesheet" || l.removeChild(s), s = d;
          }
        } else
          l === "body" && ci(e.ownerDocument.body);
      l = n;
    } while (l);
    pn(t);
  }
  function wh(e, t) {
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
  function dr(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var l = t;
      switch (t = t.nextSibling, l.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          dr(l), vc(l);
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
  function Kv(e, t, l, a) {
    for (; e.nodeType === 1; ) {
      var n = l;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!a && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (a) {
        if (!e[Nn])
          switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (s = e.getAttribute("rel"), s === "stylesheet" && e.hasAttribute("data-precedence"))
                break;
              if (s !== n.rel || e.getAttribute("href") !== (n.href == null || n.href === "" ? null : n.href) || e.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin) || e.getAttribute("title") !== (n.title == null ? null : n.title))
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (s = e.getAttribute("src"), (s !== (n.src == null ? null : n.src) || e.getAttribute("type") !== (n.type == null ? null : n.type) || e.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin)) && s && e.hasAttribute("async") && !e.hasAttribute("itemprop"))
                break;
              return e;
            default:
              return e;
          }
      } else if (t === "input" && e.type === "hidden") {
        var s = n.name == null ? null : "" + n.name;
        if (n.type === "hidden" && e.getAttribute("name") === s)
          return e;
      } else return e;
      if (e = Zt(e.nextSibling), e === null) break;
    }
    return null;
  }
  function Jv(e, t, l) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !l || (e = Zt(e.nextSibling), e === null)) return null;
    return e;
  }
  function Nh(e, t) {
    for (; e.nodeType !== 8; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = Zt(e.nextSibling), e === null)) return null;
    return e;
  }
  function fr(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function hr(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
  }
  function Fv(e, t) {
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
  function Zt(e) {
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
  var mr = null;
  function Eh(e) {
    e = e.nextSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var l = e.data;
        if (l === "/$" || l === "/&") {
          if (t === 0)
            return Zt(e.nextSibling);
          t--;
        } else
          l !== "$" && l !== "$!" && l !== "$?" && l !== "$~" && l !== "&" || t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function Mh(e) {
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
  function Ch(e, t, l) {
    switch (t = Cs(l), e) {
      case "html":
        if (e = t.documentElement, !e) throw Error(u(452));
        return e;
      case "head":
        if (e = t.head, !e) throw Error(u(453));
        return e;
      case "body":
        if (e = t.body, !e) throw Error(u(454));
        return e;
      default:
        throw Error(u(451));
    }
  }
  function ci(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    vc(e);
  }
  var $t = /* @__PURE__ */ new Map(), Th = /* @__PURE__ */ new Set();
  function Ts(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var Nl = U.d;
  U.d = {
    f: Wv,
    r: Pv,
    D: Iv,
    C: e0,
    L: t0,
    m: l0,
    X: n0,
    S: a0,
    M: i0
  };
  function Wv() {
    var e = Nl.f(), t = bs();
    return e || t;
  }
  function Pv(e) {
    var t = Oa(e);
    t !== null && t.tag === 5 && t.type === "form" ? Qd(t) : Nl.r(e);
  }
  var fn = typeof document > "u" ? null : document;
  function Rh(e, t, l) {
    var a = fn;
    if (a && typeof t == "string" && t) {
      var n = Lt(t);
      n = 'link[rel="' + e + '"][href="' + n + '"]', typeof l == "string" && (n += '[crossorigin="' + l + '"]'), Th.has(n) || (Th.add(n), e = { rel: e, crossOrigin: l, href: t }, a.querySelector(n) === null && (t = a.createElement("link"), ot(t, "link", e), nt(t), a.head.appendChild(t)));
    }
  }
  function Iv(e) {
    Nl.D(e), Rh("dns-prefetch", e, null);
  }
  function e0(e, t) {
    Nl.C(e, t), Rh("preconnect", e, t);
  }
  function t0(e, t, l) {
    Nl.L(e, t, l);
    var a = fn;
    if (a && e && t) {
      var n = 'link[rel="preload"][as="' + Lt(t) + '"]';
      t === "image" && l && l.imageSrcSet ? (n += '[imagesrcset="' + Lt(
        l.imageSrcSet
      ) + '"]', typeof l.imageSizes == "string" && (n += '[imagesizes="' + Lt(
        l.imageSizes
      ) + '"]')) : n += '[href="' + Lt(e) + '"]';
      var s = n;
      switch (t) {
        case "style":
          s = hn(e);
          break;
        case "script":
          s = mn(e);
      }
      $t.has(s) || (e = b(
        {
          rel: "preload",
          href: t === "image" && l && l.imageSrcSet ? void 0 : e,
          as: t
        },
        l
      ), $t.set(s, e), a.querySelector(n) !== null || t === "style" && a.querySelector(ui(s)) || t === "script" && a.querySelector(ri(s)) || (t = a.createElement("link"), ot(t, "link", e), nt(t), a.head.appendChild(t)));
    }
  }
  function l0(e, t) {
    Nl.m(e, t);
    var l = fn;
    if (l && e) {
      var a = t && typeof t.as == "string" ? t.as : "script", n = 'link[rel="modulepreload"][as="' + Lt(a) + '"][href="' + Lt(e) + '"]', s = n;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          s = mn(e);
      }
      if (!$t.has(s) && (e = b({ rel: "modulepreload", href: e }, t), $t.set(s, e), l.querySelector(n) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (l.querySelector(ri(s)))
              return;
        }
        a = l.createElement("link"), ot(a, "link", e), nt(a), l.head.appendChild(a);
      }
    }
  }
  function a0(e, t, l) {
    Nl.S(e, t, l);
    var a = fn;
    if (a && e) {
      var n = Da(a).hoistableStyles, s = hn(e);
      t = t || "default";
      var d = n.get(s);
      if (!d) {
        var p = { loading: 0, preload: null };
        if (d = a.querySelector(
          ui(s)
        ))
          p.loading = 5;
        else {
          e = b(
            { rel: "stylesheet", href: e, "data-precedence": t },
            l
          ), (l = $t.get(s)) && pr(e, l);
          var _ = d = a.createElement("link");
          nt(_), ot(_, "link", e), _._p = new Promise(function(T, k) {
            _.onload = T, _.onerror = k;
          }), _.addEventListener("load", function() {
            p.loading |= 1;
          }), _.addEventListener("error", function() {
            p.loading |= 2;
          }), p.loading |= 4, Rs(d, t, a);
        }
        d = {
          type: "stylesheet",
          instance: d,
          count: 1,
          state: p
        }, n.set(s, d);
      }
    }
  }
  function n0(e, t) {
    Nl.X(e, t);
    var l = fn;
    if (l && e) {
      var a = Da(l).hoistableScripts, n = mn(e), s = a.get(n);
      s || (s = l.querySelector(ri(n)), s || (e = b({ src: e, async: !0 }, t), (t = $t.get(n)) && vr(e, t), s = l.createElement("script"), nt(s), ot(s, "link", e), l.head.appendChild(s)), s = {
        type: "script",
        instance: s,
        count: 1,
        state: null
      }, a.set(n, s));
    }
  }
  function i0(e, t) {
    Nl.M(e, t);
    var l = fn;
    if (l && e) {
      var a = Da(l).hoistableScripts, n = mn(e), s = a.get(n);
      s || (s = l.querySelector(ri(n)), s || (e = b({ src: e, async: !0, type: "module" }, t), (t = $t.get(n)) && vr(e, t), s = l.createElement("script"), nt(s), ot(s, "link", e), l.head.appendChild(s)), s = {
        type: "script",
        instance: s,
        count: 1,
        state: null
      }, a.set(n, s));
    }
  }
  function Ah(e, t, l, a) {
    var n = (n = Z.current) ? Ts(n) : null;
    if (!n) throw Error(u(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof l.precedence == "string" && typeof l.href == "string" ? (t = hn(l.href), l = Da(
          n
        ).hoistableStyles, a = l.get(t), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, l.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (l.rel === "stylesheet" && typeof l.href == "string" && typeof l.precedence == "string") {
          e = hn(l.href);
          var s = Da(
            n
          ).hoistableStyles, d = s.get(e);
          if (d || (n = n.ownerDocument || n, d = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, s.set(e, d), (s = n.querySelector(
            ui(e)
          )) && !s._p && (d.instance = s, d.state.loading = 5), $t.has(e) || (l = {
            rel: "preload",
            as: "style",
            href: l.href,
            crossOrigin: l.crossOrigin,
            integrity: l.integrity,
            media: l.media,
            hrefLang: l.hrefLang,
            referrerPolicy: l.referrerPolicy
          }, $t.set(e, l), s || s0(
            n,
            e,
            l,
            d.state
          ))), t && a === null)
            throw Error(u(528, ""));
          return d;
        }
        if (t && a !== null)
          throw Error(u(529, ""));
        return null;
      case "script":
        return t = l.async, l = l.src, typeof l == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = mn(l), l = Da(
          n
        ).hoistableScripts, a = l.get(t), a || (a = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, l.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(u(444, e));
    }
  }
  function hn(e) {
    return 'href="' + Lt(e) + '"';
  }
  function ui(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function zh(e) {
    return b({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function s0(e, t, l, a) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? a.loading = 1 : (t = e.createElement("link"), a.preload = t, t.addEventListener("load", function() {
      return a.loading |= 1;
    }), t.addEventListener("error", function() {
      return a.loading |= 2;
    }), ot(t, "link", l), nt(t), e.head.appendChild(t));
  }
  function mn(e) {
    return '[src="' + Lt(e) + '"]';
  }
  function ri(e) {
    return "script[async]" + e;
  }
  function Oh(e, t, l) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var a = e.querySelector(
            'style[data-href~="' + Lt(l.href) + '"]'
          );
          if (a)
            return t.instance = a, nt(a), a;
          var n = b({}, l, {
            "data-href": l.href,
            "data-precedence": l.precedence,
            href: null,
            precedence: null
          });
          return a = (e.ownerDocument || e).createElement(
            "style"
          ), nt(a), ot(a, "style", n), Rs(a, l.precedence, e), t.instance = a;
        case "stylesheet":
          n = hn(l.href);
          var s = e.querySelector(
            ui(n)
          );
          if (s)
            return t.state.loading |= 4, t.instance = s, nt(s), s;
          a = zh(l), (n = $t.get(n)) && pr(a, n), s = (e.ownerDocument || e).createElement("link"), nt(s);
          var d = s;
          return d._p = new Promise(function(p, _) {
            d.onload = p, d.onerror = _;
          }), ot(s, "link", a), t.state.loading |= 4, Rs(s, l.precedence, e), t.instance = s;
        case "script":
          return s = mn(l.src), (n = e.querySelector(
            ri(s)
          )) ? (t.instance = n, nt(n), n) : (a = l, (n = $t.get(s)) && (a = b({}, l), vr(a, n)), e = e.ownerDocument || e, n = e.createElement("script"), nt(n), ot(n, "link", a), e.head.appendChild(n), t.instance = n);
        case "void":
          return null;
        default:
          throw Error(u(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (a = t.instance, t.state.loading |= 4, Rs(a, l.precedence, e));
    return t.instance;
  }
  function Rs(e, t, l) {
    for (var a = l.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), n = a.length ? a[a.length - 1] : null, s = n, d = 0; d < a.length; d++) {
      var p = a[d];
      if (p.dataset.precedence === t) s = p;
      else if (s !== n) break;
    }
    s ? s.parentNode.insertBefore(e, s.nextSibling) : (t = l.nodeType === 9 ? l.head : l, t.insertBefore(e, t.firstChild));
  }
  function pr(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function vr(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var As = null;
  function Dh(e, t, l) {
    if (As === null) {
      var a = /* @__PURE__ */ new Map(), n = As = /* @__PURE__ */ new Map();
      n.set(l, a);
    } else
      n = As, a = n.get(l), a || (a = /* @__PURE__ */ new Map(), n.set(l, a));
    if (a.has(e)) return a;
    for (a.set(e, null), l = l.getElementsByTagName(e), n = 0; n < l.length; n++) {
      var s = l[n];
      if (!(s[Nn] || s[st] || e === "link" && s.getAttribute("rel") === "stylesheet") && s.namespaceURI !== "http://www.w3.org/2000/svg") {
        var d = s.getAttribute(t) || "";
        d = e + d;
        var p = a.get(d);
        p ? p.push(s) : a.set(d, [s]);
      }
    }
    return a;
  }
  function kh(e, t, l) {
    e = e.ownerDocument || e, e.head.insertBefore(
      l,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function c0(e, t, l) {
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
  function Hh(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function u0(e, t, l, a) {
    if (l.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && (l.state.loading & 4) === 0) {
      if (l.instance === null) {
        var n = hn(a.href), s = t.querySelector(
          ui(n)
        );
        if (s) {
          t = s._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = zs.bind(e), t.then(e, e)), l.state.loading |= 4, l.instance = s, nt(s);
          return;
        }
        s = t.ownerDocument || t, a = zh(a), (n = $t.get(n)) && pr(a, n), s = s.createElement("link"), nt(s);
        var d = s;
        d._p = new Promise(function(p, _) {
          d.onload = p, d.onerror = _;
        }), ot(s, "link", a), l.instance = s;
      }
      e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(l, t), (t = l.state.preload) && (l.state.loading & 3) === 0 && (e.count++, l = zs.bind(e), t.addEventListener("load", l), t.addEventListener("error", l));
    }
  }
  var gr = 0;
  function r0(e, t) {
    return e.stylesheets && e.count === 0 && Ds(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(l) {
      var a = setTimeout(function() {
        if (e.stylesheets && Ds(e, e.stylesheets), e.unsuspend) {
          var s = e.unsuspend;
          e.unsuspend = null, s();
        }
      }, 6e4 + t);
      0 < e.imgBytes && gr === 0 && (gr = 62500 * Vv());
      var n = setTimeout(
        function() {
          if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && Ds(e, e.stylesheets), e.unsuspend)) {
            var s = e.unsuspend;
            e.unsuspend = null, s();
          }
        },
        (e.imgBytes > gr ? 50 : 800) + t
      );
      return e.unsuspend = l, function() {
        e.unsuspend = null, clearTimeout(a), clearTimeout(n);
      };
    } : null;
  }
  function zs() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) Ds(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var Os = null;
  function Ds(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, Os = /* @__PURE__ */ new Map(), t.forEach(o0, e), Os = null, zs.call(e));
  }
  function o0(e, t) {
    if (!(t.state.loading & 4)) {
      var l = Os.get(e);
      if (l) var a = l.get(null);
      else {
        l = /* @__PURE__ */ new Map(), Os.set(e, l);
        for (var n = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), s = 0; s < n.length; s++) {
          var d = n[s];
          (d.nodeName === "LINK" || d.getAttribute("media") !== "not all") && (l.set(d.dataset.precedence, d), a = d);
        }
        a && l.set(null, a);
      }
      n = t.instance, d = n.getAttribute("data-precedence"), s = l.get(d) || a, s === a && l.set(null, n), l.set(d, n), this.count++, a = zs.bind(this), n.addEventListener("load", a), n.addEventListener("error", a), s ? s.parentNode.insertBefore(n, s.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(n, e.firstChild)), t.state.loading |= 4;
    }
  }
  var oi = {
    $$typeof: q,
    Provider: null,
    Consumer: null,
    _currentValue: Q,
    _currentValue2: Q,
    _threadCount: 0
  };
  function d0(e, t, l, a, n, s, d, p, _) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = fc(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = fc(0), this.hiddenUpdates = fc(null), this.identifierPrefix = a, this.onUncaughtError = n, this.onCaughtError = s, this.onRecoverableError = d, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = _, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function Uh(e, t, l, a, n, s, d, p, _, T, k, B) {
    return e = new d0(
      e,
      t,
      l,
      d,
      _,
      T,
      k,
      B,
      p
    ), t = 1, s === !0 && (t |= 24), s = Ct(3, null, null, t), e.current = s, s.stateNode = e, t = Fc(), t.refCount++, e.pooledCache = t, t.refCount++, s.memoizedState = {
      element: a,
      isDehydrated: l,
      cache: t
    }, eu(s), e;
  }
  function Bh(e) {
    return e ? (e = Xa, e) : Xa;
  }
  function Lh(e, t, l, a, n, s) {
    n = Bh(n), a.context === null ? a.context = n : a.pendingContext = n, a = Ll(t), a.payload = { element: l }, s = s === void 0 ? null : s, s !== null && (a.callback = s), l = ql(e, a, t), l !== null && (_t(l, e, t), Gn(l, e, t));
  }
  function qh(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var l = e.retryLane;
      e.retryLane = l !== 0 && l < t ? l : t;
    }
  }
  function xr(e, t) {
    qh(e, t), (e = e.alternate) && qh(e, t);
  }
  function Yh(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = oa(e, 67108864);
      t !== null && _t(t, e, 67108864), xr(e, 67108864);
    }
  }
  function Gh(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Ot();
      t = hc(t);
      var l = oa(e, t);
      l !== null && _t(l, e, t), xr(e, t);
    }
  }
  var ks = !0;
  function f0(e, t, l, a) {
    var n = M.T;
    M.T = null;
    var s = U.p;
    try {
      U.p = 2, yr(e, t, l, a);
    } finally {
      U.p = s, M.T = n;
    }
  }
  function h0(e, t, l, a) {
    var n = M.T;
    M.T = null;
    var s = U.p;
    try {
      U.p = 8, yr(e, t, l, a);
    } finally {
      U.p = s, M.T = n;
    }
  }
  function yr(e, t, l, a) {
    if (ks) {
      var n = br(a);
      if (n === null)
        ir(
          e,
          t,
          a,
          Hs,
          l
        ), Xh(e, a);
      else if (p0(
        n,
        e,
        t,
        l,
        a
      ))
        a.stopPropagation();
      else if (Xh(e, a), t & 4 && -1 < m0.indexOf(e)) {
        for (; n !== null; ) {
          var s = Oa(n);
          if (s !== null)
            switch (s.tag) {
              case 3:
                if (s = s.stateNode, s.current.memoizedState.isDehydrated) {
                  var d = ia(s.pendingLanes);
                  if (d !== 0) {
                    var p = s;
                    for (p.pendingLanes |= 2, p.entangledLanes |= 2; d; ) {
                      var _ = 1 << 31 - Et(d);
                      p.entanglements[1] |= _, d &= ~_;
                    }
                    sl(s), (Ne & 6) === 0 && (xs = Fe() + 500, ni(0));
                  }
                }
                break;
              case 31:
              case 13:
                p = oa(s, 2), p !== null && _t(p, s, 2), bs(), xr(s, 2);
            }
          if (s = br(a), s === null && ir(
            e,
            t,
            a,
            Hs,
            l
          ), s === n) break;
          n = s;
        }
        n !== null && a.stopPropagation();
      } else
        ir(
          e,
          t,
          a,
          null,
          l
        );
    }
  }
  function br(e) {
    return e = Sc(e), _r(e);
  }
  var Hs = null;
  function _r(e) {
    if (Hs = null, e = za(e), e !== null) {
      var t = h(e);
      if (t === null) e = null;
      else {
        var l = t.tag;
        if (l === 13) {
          if (e = g(t), e !== null) return e;
          e = null;
        } else if (l === 31) {
          if (e = x(t), e !== null) return e;
          e = null;
        } else if (l === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return Hs = e, null;
  }
  function Vh(e) {
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
        switch (Me()) {
          case Ta:
            return 2;
          case na:
            return 8;
          case Ra:
          case ep:
            return 32;
          case Wr:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Sr = !1, Wl = null, Pl = null, Il = null, di = /* @__PURE__ */ new Map(), fi = /* @__PURE__ */ new Map(), ea = [], m0 = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function Xh(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Wl = null;
        break;
      case "dragenter":
      case "dragleave":
        Pl = null;
        break;
      case "mouseover":
      case "mouseout":
        Il = null;
        break;
      case "pointerover":
      case "pointerout":
        di.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        fi.delete(t.pointerId);
    }
  }
  function hi(e, t, l, a, n, s) {
    return e === null || e.nativeEvent !== s ? (e = {
      blockedOn: t,
      domEventName: l,
      eventSystemFlags: a,
      nativeEvent: s,
      targetContainers: [n]
    }, t !== null && (t = Oa(t), t !== null && Yh(t)), e) : (e.eventSystemFlags |= a, t = e.targetContainers, n !== null && t.indexOf(n) === -1 && t.push(n), e);
  }
  function p0(e, t, l, a, n) {
    switch (t) {
      case "focusin":
        return Wl = hi(
          Wl,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "dragenter":
        return Pl = hi(
          Pl,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "mouseover":
        return Il = hi(
          Il,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "pointerover":
        var s = n.pointerId;
        return di.set(
          s,
          hi(
            di.get(s) || null,
            e,
            t,
            l,
            a,
            n
          )
        ), !0;
      case "gotpointercapture":
        return s = n.pointerId, fi.set(
          s,
          hi(
            fi.get(s) || null,
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
  function Qh(e) {
    var t = za(e.target);
    if (t !== null) {
      var l = h(t);
      if (l !== null) {
        if (t = l.tag, t === 13) {
          if (t = g(l), t !== null) {
            e.blockedOn = t, ao(e.priority, function() {
              Gh(l);
            });
            return;
          }
        } else if (t === 31) {
          if (t = x(l), t !== null) {
            e.blockedOn = t, ao(e.priority, function() {
              Gh(l);
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
  function Us(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var l = br(e.nativeEvent);
      if (l === null) {
        l = e.nativeEvent;
        var a = new l.constructor(
          l.type,
          l
        );
        _c = a, l.target.dispatchEvent(a), _c = null;
      } else
        return t = Oa(l), t !== null && Yh(t), e.blockedOn = l, !1;
      t.shift();
    }
    return !0;
  }
  function Zh(e, t, l) {
    Us(e) && l.delete(t);
  }
  function v0() {
    Sr = !1, Wl !== null && Us(Wl) && (Wl = null), Pl !== null && Us(Pl) && (Pl = null), Il !== null && Us(Il) && (Il = null), di.forEach(Zh), fi.forEach(Zh);
  }
  function Bs(e, t) {
    e.blockedOn === t && (e.blockedOn = null, Sr || (Sr = !0, i.unstable_scheduleCallback(
      i.unstable_NormalPriority,
      v0
    )));
  }
  var Ls = null;
  function $h(e) {
    Ls !== e && (Ls = e, i.unstable_scheduleCallback(
      i.unstable_NormalPriority,
      function() {
        Ls === e && (Ls = null);
        for (var t = 0; t < e.length; t += 3) {
          var l = e[t], a = e[t + 1], n = e[t + 2];
          if (typeof a != "function") {
            if (_r(a || l) === null)
              continue;
            break;
          }
          var s = Oa(l);
          s !== null && (e.splice(t, 3), t -= 3, bu(
            s,
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
  function pn(e) {
    function t(_) {
      return Bs(_, e);
    }
    Wl !== null && Bs(Wl, e), Pl !== null && Bs(Pl, e), Il !== null && Bs(Il, e), di.forEach(t), fi.forEach(t);
    for (var l = 0; l < ea.length; l++) {
      var a = ea[l];
      a.blockedOn === e && (a.blockedOn = null);
    }
    for (; 0 < ea.length && (l = ea[0], l.blockedOn === null); )
      Qh(l), l.blockedOn === null && ea.shift();
    if (l = (e.ownerDocument || e).$$reactFormReplay, l != null)
      for (a = 0; a < l.length; a += 3) {
        var n = l[a], s = l[a + 1], d = n[pt] || null;
        if (typeof s == "function")
          d || $h(l);
        else if (d) {
          var p = null;
          if (s && s.hasAttribute("formAction")) {
            if (n = s, d = s[pt] || null)
              p = d.formAction;
            else if (_r(n) !== null) continue;
          } else p = d.action;
          typeof p == "function" ? l[a + 1] = p : (l.splice(a, 3), a -= 3), $h(l);
        }
      }
  }
  function Kh() {
    function e(s) {
      s.canIntercept && s.info === "react-transition" && s.intercept({
        handler: function() {
          return new Promise(function(d) {
            return n = d;
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
        var s = navigation.currentEntry;
        s && s.url != null && navigation.navigate(s.url, {
          state: s.getState(),
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
  function jr(e) {
    this._internalRoot = e;
  }
  qs.prototype.render = jr.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(u(409));
    var l = t.current, a = Ot();
    Lh(l, a, e, t, null, null);
  }, qs.prototype.unmount = jr.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      Lh(e.current, 2, null, e, null, null), bs(), t[Aa] = null;
    }
  };
  function qs(e) {
    this._internalRoot = e;
  }
  qs.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = lo();
      e = { blockedOn: null, target: e, priority: t };
      for (var l = 0; l < ea.length && t !== 0 && t < ea[l].priority; l++) ;
      ea.splice(l, 0, e), l === 0 && Qh(e);
    }
  };
  var Jh = r.version;
  if (Jh !== "19.2.8")
    throw Error(
      u(
        527,
        Jh,
        "19.2.8"
      )
    );
  U.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(u(188)) : (e = Object.keys(e).join(","), Error(u(268, e)));
    return e = m(t), e = e !== null ? y(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var g0 = {
    bundleType: 0,
    version: "19.2.8",
    rendererPackageName: "react-dom",
    currentDispatcherRef: M,
    reconcilerVersion: "19.2.8"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Ys = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Ys.isDisabled && Ys.supportsFiber)
      try {
        Sn = Ys.inject(
          g0
        ), Nt = Ys;
      } catch {
      }
  }
  return pi.createRoot = function(e, t) {
    if (!f(e)) throw Error(u(299));
    var l = !1, a = "", n = tf, s = lf, d = af;
    return t != null && (t.unstable_strictMode === !0 && (l = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (n = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (d = t.onRecoverableError)), t = Uh(
      e,
      1,
      !1,
      null,
      null,
      l,
      a,
      null,
      n,
      s,
      d,
      Kh
    ), e[Aa] = t.current, nr(e), new jr(t);
  }, pi.hydrateRoot = function(e, t, l) {
    if (!f(e)) throw Error(u(299));
    var a = !1, n = "", s = tf, d = lf, p = af, _ = null;
    return l != null && (l.unstable_strictMode === !0 && (a = !0), l.identifierPrefix !== void 0 && (n = l.identifierPrefix), l.onUncaughtError !== void 0 && (s = l.onUncaughtError), l.onCaughtError !== void 0 && (d = l.onCaughtError), l.onRecoverableError !== void 0 && (p = l.onRecoverableError), l.formState !== void 0 && (_ = l.formState)), t = Uh(
      e,
      1,
      !0,
      t,
      l ?? null,
      a,
      n,
      _,
      s,
      d,
      p,
      Kh
    ), t.context = Bh(null), l = t.current, a = Ot(), a = hc(a), n = Ll(a), n.callback = null, ql(l, n, a), l = a, t.current.lanes = l, wn(t, l), sl(t), e[Aa] = t.current, nr(e), new qs(t);
  }, pi.version = "19.2.8", pi;
}
var im;
function T0() {
  if (im) return Er.exports;
  im = 1;
  function i() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i);
      } catch (r) {
        console.error(r);
      }
  }
  return i(), Er.exports = C0(), Er.exports;
}
var R0 = T0();
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
var Ur = /^(?:[a-z][a-z0-9+.-]*:|[\\/]{2})/i, Sm = /^[\\/]{2}/;
function A0(i, r) {
  return r + i.replace(/\\/g, "/");
}
var sm = "popstate";
function cm(i) {
  return typeof i == "object" && i != null && "pathname" in i && "search" in i && "hash" in i && "state" in i && "key" in i;
}
function z0(i = {}) {
  function r(f, h) {
    let {
      pathname: g = "/",
      search: x = "",
      hash: v = ""
    } = Ma(f.location.hash.substring(1));
    return !g.startsWith("/") && !g.startsWith(".") && (g = "/" + g), Or(
      "",
      { pathname: g, search: x, hash: v },
      // state defaults to `null` because `window.history.state` does
      h.state && h.state.usr || null,
      h.state && h.state.key || "default"
    );
  }
  function o(f, h) {
    let g = f.document.querySelector("base"), x = "";
    if (g && g.getAttribute("href")) {
      let v = f.location.href, m = v.indexOf("#");
      x = m === -1 ? v : v.slice(0, m);
    }
    return x + "#" + (typeof h == "string" ? h : yi(h));
  }
  function u(f, h) {
    kt(
      f.pathname.charAt(0) === "/",
      `relative pathnames are not supported in hash history.push(${JSON.stringify(
        h
      )})`
    );
  }
  return D0(
    r,
    o,
    u,
    i
  );
}
function Ve(i, r) {
  if (i === !1 || i === null || typeof i > "u")
    throw new Error(r);
}
function kt(i, r) {
  if (!i) {
    typeof console < "u" && console.warn(r);
    try {
      throw new Error(r);
    } catch {
    }
  }
}
function O0() {
  return Math.random().toString(36).substring(2, 10);
}
function um(i, r) {
  return {
    usr: i.state,
    key: i.key,
    idx: r,
    masked: i.mask ? {
      pathname: i.pathname,
      search: i.search,
      hash: i.hash
    } : void 0
  };
}
function Or(i, r, o = null, u, f) {
  return {
    pathname: typeof i == "string" ? i : i.pathname,
    search: "",
    hash: "",
    ...typeof r == "string" ? Ma(r) : r,
    state: o,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: r && r.key || u || O0(),
    mask: f
  };
}
function yi({
  pathname: i = "/",
  search: r = "",
  hash: o = ""
}) {
  return r && r !== "?" && (i += r.charAt(0) === "?" ? r : "?" + r), o && o !== "#" && (i += o.charAt(0) === "#" ? o : "#" + o), i;
}
function Ma(i) {
  let r = {};
  if (i) {
    let o = i.indexOf("#");
    o >= 0 && (r.hash = i.substring(o), i = i.substring(0, o));
    let u = i.indexOf("?");
    u >= 0 && (r.search = i.substring(u), i = i.substring(0, u)), i && (r.pathname = i);
  }
  return r;
}
function D0(i, r, o, u = {}) {
  let { window: f = document.defaultView, v5Compat: h = !1 } = u, g = f.history, x = "POP", v = null, m = y();
  m == null && (m = 0, g.replaceState({ ...g.state, idx: m }, ""));
  function y() {
    return (g.state || { idx: null }).idx;
  }
  function b() {
    x = "POP";
    let O = y(), V = O == null ? null : O - m;
    m = O, v && v({ action: x, location: Y.location, delta: V });
  }
  function N(O, V) {
    x = "PUSH";
    let $ = cm(O) ? O : Or(Y.location, O, V);
    o && o($, O), m = y() + 1;
    let q = um($, m), le = Y.createHref($.mask || $);
    try {
      g.pushState(q, "", le);
    } catch (se) {
      if (se instanceof DOMException && se.name === "DataCloneError")
        throw se;
      f.location.assign(le);
    }
    h && v && v({ action: x, location: Y.location, delta: 1 });
  }
  function L(O, V) {
    x = "REPLACE";
    let $ = cm(O) ? O : Or(Y.location, O, V);
    o && o($, O), m = y();
    let q = um($, m), le = Y.createHref($.mask || $);
    g.replaceState(q, "", le), h && v && v({ action: x, location: Y.location, delta: 0 });
  }
  function G(O) {
    return k0(f, O);
  }
  let Y = {
    get action() {
      return x;
    },
    get location() {
      return i(f, g);
    },
    listen(O) {
      if (v)
        throw new Error("A history only accepts one active listener");
      return f.addEventListener(sm, b), v = O, () => {
        f.removeEventListener(sm, b), v = null;
      };
    },
    createHref(O) {
      return r(f, O);
    },
    createURL: G,
    encodeLocation(O) {
      let V = G(O);
      return {
        pathname: V.pathname,
        search: V.search,
        hash: V.hash
      };
    },
    push: N,
    replace: L,
    go(O) {
      return g.go(O);
    }
  };
  return Y;
}
function k0(i, r, o = !1) {
  let u = "http://localhost";
  i && (u = i.location.origin !== "null" ? i.location.origin : i.location.href), Ve(u, "No window.location.(origin|href) available to create URL");
  let f = typeof r == "string" ? r : yi(r);
  return f = f.replace(/ $/, "%20"), !o && Sm.test(f) && (f = u + f), new URL(f, u);
}
function jm(i, r, o = "/") {
  return H0(i, r, o, !1);
}
function H0(i, r, o, u, f) {
  let h = typeof r == "string" ? Ma(r) : r, g = Ml(h.pathname || "/", o);
  if (g == null)
    return null;
  let x = U0(i), v = null, m = K0(g);
  for (let y = 0; v == null && y < x.length; ++y)
    v = $0(
      x[y],
      m,
      u
    );
  return v;
}
function U0(i) {
  let r = wm(i);
  return B0(r), r;
}
function wm(i, r = [], o = [], u = "", f = !1) {
  let h = (g, x, v = f, m) => {
    let y = {
      relativePath: m === void 0 ? g.path || "" : m,
      caseSensitive: g.caseSensitive === !0,
      childrenIndex: x,
      route: g
    };
    if (y.relativePath.startsWith("/")) {
      if (!y.relativePath.startsWith(u) && v)
        return;
      Ve(
        y.relativePath.startsWith(u),
        `Absolute route path "${y.relativePath}" nested under path "${u}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
      ), y.relativePath = y.relativePath.slice(u.length);
    }
    let b = el([u, y.relativePath]), N = o.concat(y);
    g.children && g.children.length > 0 && (Ve(
      // Our types know better, but runtime JS may not!
      // @ts-expect-error
      g.index !== !0,
      `Index routes must not have child routes. Please remove all child routes from route path "${b}".`
    ), wm(
      g.children,
      r,
      N,
      b,
      v
    )), !(g.path == null && !g.index) && r.push({
      path: b,
      score: Q0(b, g.index),
      routesMeta: N.map((L, G) => {
        let [Y, O] = Mm(
          L.relativePath,
          L.caseSensitive,
          G === N.length - 1
        );
        return {
          ...L,
          matcher: Y,
          compiledParams: O
        };
      })
    });
  };
  return i.forEach((g, x) => {
    if (g.path === "" || !g.path?.includes("?"))
      h(g, x);
    else
      for (let v of Nm(g.path))
        h(g, x, !0, v);
  }), r;
}
function Nm(i) {
  let r = i.split("/");
  if (r.length === 0) return [];
  let [o, ...u] = r, f = o.endsWith("?"), h = o.replace(/\?$/, "");
  if (u.length === 0)
    return f ? [h, ""] : [h];
  let g = Nm(u.join("/")), x = [];
  return x.push(
    ...g.map(
      (v) => v === "" ? h : [h, v].join("/")
    )
  ), f && x.push(...g), x.map(
    (v) => i.startsWith("/") && v === "" ? "/" : v
  );
}
function B0(i) {
  i.sort(
    (r, o) => r.score !== o.score ? o.score - r.score : Z0(
      r.routesMeta.map((u) => u.childrenIndex),
      o.routesMeta.map((u) => u.childrenIndex)
    )
  );
}
var L0 = /^:[\w-]+$/, q0 = 3, Y0 = 2, G0 = 1, V0 = 10, X0 = -2, rm = (i) => i === "*";
function Q0(i, r) {
  let o = i.split("/"), u = o.length;
  return o.some(rm) && (u += X0), r && (u += Y0), o.filter((f) => !rm(f)).reduce(
    (f, h) => f + (L0.test(h) ? q0 : h === "" ? G0 : V0),
    u
  );
}
function Z0(i, r) {
  return i.length === r.length && i.slice(0, -1).every((u, f) => u === r[f]) ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    i[i.length - 1] - r[r.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function $0(i, r, o = !1) {
  let { routesMeta: u } = i, f = {}, h = "/", g = [];
  for (let x = 0; x < u.length; ++x) {
    let v = u[x], m = x === u.length - 1, y = h === "/" ? r : r.slice(h.length) || "/", b = {
      path: v.relativePath,
      caseSensitive: v.caseSensitive,
      end: m
    }, N = (
      // Use precomputed matcher if it exists
      v.matcher && v.compiledParams ? Em(
        b,
        y,
        v.matcher,
        v.compiledParams
      ) : Fs(b, y)
    ), L = v.route;
    if (!N && m && o && !u[u.length - 1].route.index && (N = Fs(
      {
        path: v.relativePath,
        caseSensitive: v.caseSensitive,
        end: !1
      },
      y
    )), !N)
      return null;
    Object.assign(f, N.params), g.push({
      // TODO: Can this as be avoided?
      params: f,
      pathname: el([h, N.pathname]),
      pathnameBase: W0(
        el([h, N.pathnameBase])
      ),
      route: L
    }), N.pathnameBase !== "/" && (h = el([h, N.pathnameBase]));
  }
  return g;
}
function Fs(i, r) {
  typeof i == "string" && (i = { path: i, caseSensitive: !1, end: !0 });
  let [o, u] = Mm(
    i.path,
    i.caseSensitive,
    i.end
  );
  return Em(i, r, o, u);
}
function Em(i, r, o, u) {
  let f = r.match(o);
  if (!f) return null;
  let h = f[0], g = h.replace(/(.)\/+$/, "$1"), x = f.slice(1);
  return {
    params: u.reduce(
      (m, { paramName: y, isOptional: b }, N) => {
        if (y === "*") {
          let G = x[N] || "";
          g = h.slice(0, h.length - G.length).replace(/(.)\/+$/, "$1");
        }
        const L = x[N];
        return b && !L ? m[y] = void 0 : m[y] = (L || "").replace(/%2F/g, "/"), m;
      },
      {}
    ),
    pathname: h,
    pathnameBase: g,
    pattern: i
  };
}
function Mm(i, r = !1, o = !0) {
  kt(
    i === "*" || !i.endsWith("*") || i.endsWith("/*"),
    `Route path "${i}" will be treated as if it were "${i.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${i.replace(/\*$/, "/*")}".`
  );
  let u = [], f = "^" + i.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(
    /\/:([\w-]+)(\?)?/g,
    (g, x, v, m, y) => {
      if (u.push({ paramName: x, isOptional: v != null }), v) {
        let b = y.charAt(m + g.length);
        return b && b !== "/" ? "/([^\\/]*)" : "(?:/([^\\/]*))?";
      }
      return "/([^\\/]+)";
    }
  ).replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
  return i.endsWith("*") ? (u.push({ paramName: "*" }), f += i === "*" || i === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$") : o ? f += "\\/*$" : i !== "" && i !== "/" && (f += "(?:(?=\\/|$))"), [new RegExp(f, r ? void 0 : "i"), u];
}
function K0(i) {
  try {
    return i.split("/").map((r) => decodeURIComponent(r).replace(/\//g, "%2F")).join("/");
  } catch (r) {
    return kt(
      !1,
      `The URL path "${i}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${r}).`
    ), i;
  }
}
function Ml(i, r) {
  if (r === "/") return i;
  if (!i.toLowerCase().startsWith(r.toLowerCase()))
    return null;
  let o = r.endsWith("/") ? r.length - 1 : r.length, u = i.charAt(o);
  return u && u !== "/" ? null : i.slice(o) || "/";
}
function J0(i, r = "/") {
  let {
    pathname: o,
    search: u = "",
    hash: f = ""
  } = typeof i == "string" ? Ma(i) : i, h;
  return o ? (o = Cm(o), o.startsWith("/") ? h = om(o.substring(1), "/") : h = om(o, r)) : h = r, {
    pathname: h,
    search: P0(u),
    hash: I0(f)
  };
}
function om(i, r) {
  let o = Ws(r).split("/");
  return i.split("/").forEach((f) => {
    f === ".." ? o.length > 1 && o.pop() : f !== "." && o.push(f);
  }), o.length > 1 ? o.join("/") : "/";
}
function Rr(i, r, o, u) {
  return `Cannot include a '${i}' character in a manually specified \`to.${r}\` field [${JSON.stringify(
    u
  )}].  Please separate it out to the \`to.${o}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function F0(i) {
  return i.filter(
    (r, o) => o === 0 || r.route.path && r.route.path.length > 0
  );
}
function Br(i) {
  let r = F0(i);
  return r.map(
    (o, u) => u === r.length - 1 ? o.pathname : o.pathnameBase
  );
}
function ec(i, r, o, u = !1) {
  let f;
  typeof i == "string" ? f = Ma(i) : (f = { ...i }, Ve(
    !f.pathname || !f.pathname.includes("?"),
    Rr("?", "pathname", "search", f)
  ), Ve(
    !f.pathname || !f.pathname.includes("#"),
    Rr("#", "pathname", "hash", f)
  ), Ve(
    !f.search || !f.search.includes("#"),
    Rr("#", "search", "hash", f)
  ));
  let h = i === "" || f.pathname === "", g = h ? "/" : f.pathname, x;
  if (g == null)
    x = o;
  else {
    let b = r.length - 1;
    if (!u && g.startsWith("..")) {
      let N = g.split("/");
      for (; N[0] === ".."; )
        N.shift(), b -= 1;
      f.pathname = N.join("/");
    }
    x = b >= 0 ? r[b] : "/";
  }
  let v = J0(f, x), m = g && g !== "/" && g.endsWith("/"), y = (h || g === ".") && o.endsWith("/");
  return !v.pathname.endsWith("/") && (m || y) && (v.pathname += "/"), v;
}
var Cm = (i) => i.replace(/[\\/]{2,}/g, "/"), el = (i) => Cm(i.join("/")), Ws = (i) => i.replace(/\/+$/, ""), W0 = (i) => Ws(i).replace(/^\/*/, "/"), P0 = (i) => !i || i === "?" ? "" : i.startsWith("?") ? i : "?" + i, I0 = (i) => !i || i === "#" ? "" : i.startsWith("#") ? i : "#" + i, eg = class {
  constructor(i, r, o, u = !1) {
    this.status = i, this.statusText = r || "", this.internal = u, o instanceof Error ? (this.data = o.toString(), this.error = o) : this.data = o;
  }
};
function tg(i) {
  return i != null && typeof i.status == "number" && typeof i.statusText == "string" && typeof i.internal == "boolean" && "data" in i;
}
function lg(i) {
  let r = i.map((o) => o.route.path).filter(Boolean);
  return el(r) || "/";
}
var Tm = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
function Rm(i, r) {
  let o = i;
  if (typeof o != "string" || !Ur.test(o))
    return {
      absoluteURL: void 0,
      isExternal: !1,
      to: o
    };
  let u = o, f = !1;
  if (Tm)
    try {
      let h = new URL(window.location.href), g = Sm.test(o) ? new URL(A0(o, h.protocol)) : new URL(o), x = Ml(g.pathname, r);
      g.origin === h.origin && x != null ? o = x + g.search + g.hash : f = !0;
    } catch {
      kt(
        !1,
        `<Link to="${o}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`
      );
    }
  return {
    absoluteURL: u,
    isExternal: f,
    to: o
  };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
var Am = [
  "POST",
  "PUT",
  "PATCH",
  "DELETE"
];
new Set(
  Am
);
var ag = [
  "GET",
  ...Am
];
new Set(ag);
var ng = [
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
function ig(i) {
  try {
    return ng.includes(new URL(i).protocol);
  } catch {
    return !1;
  }
}
var yn = j.createContext(null);
yn.displayName = "DataRouter";
var tc = j.createContext(null);
tc.displayName = "DataRouterState";
var zm = j.createContext(!1);
function sg() {
  return j.useContext(zm);
}
var Om = j.createContext({
  isTransitioning: !1
});
Om.displayName = "ViewTransition";
var cg = j.createContext(
  /* @__PURE__ */ new Map()
);
cg.displayName = "Fetchers";
var ug = j.createContext(null);
ug.displayName = "Await";
var Ht = j.createContext(
  null
);
Ht.displayName = "Navigation";
var _i = j.createContext(
  null
);
_i.displayName = "Location";
var cl = j.createContext({
  outlet: null,
  matches: [],
  isDataRoute: !1
});
cl.displayName = "Route";
var Lr = j.createContext(null);
Lr.displayName = "RouteError";
var Dm = "REACT_ROUTER_ERROR", rg = "REDIRECT", og = "ROUTE_ERROR_RESPONSE";
function dg(i) {
  if (i.startsWith(`${Dm}:${rg}:{`))
    try {
      let r = JSON.parse(i.slice(28));
      if (typeof r == "object" && r && typeof r.status == "number" && typeof r.statusText == "string" && typeof r.location == "string" && typeof r.reloadDocument == "boolean" && typeof r.replace == "boolean")
        return r;
    } catch {
    }
}
function fg(i) {
  if (i.startsWith(
    `${Dm}:${og}:{`
  ))
    try {
      let r = JSON.parse(i.slice(40));
      if (typeof r == "object" && r && typeof r.status == "number" && typeof r.statusText == "string")
        return new eg(
          r.status,
          r.statusText,
          r.data
        );
    } catch {
    }
}
function hg(i, { relative: r } = {}) {
  Ve(
    bn(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useHref() may be used only in the context of a <Router> component."
  );
  let { basename: o, navigator: u } = j.useContext(Ht), { hash: f, pathname: h, search: g } = Si(i, { relative: r }), x = h;
  return o !== "/" && (x = h === "/" ? o : el([o, h])), u.createHref({ pathname: x, search: g, hash: f });
}
function bn() {
  return j.useContext(_i) != null;
}
function jt() {
  return Ve(
    bn(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useLocation() may be used only in the context of a <Router> component."
  ), j.useContext(_i).location;
}
var km = "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function Hm(i) {
  j.useContext(Ht).static || j.useLayoutEffect(i);
}
function Ut() {
  let { isDataRoute: i } = j.useContext(cl);
  return i ? Eg() : mg();
}
function mg() {
  Ve(
    bn(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useNavigate() may be used only in the context of a <Router> component."
  );
  let i = j.useContext(yn), { basename: r, navigator: o } = j.useContext(Ht), { matches: u } = j.useContext(cl), { pathname: f } = jt(), h = JSON.stringify(Br(u)), g = j.useRef(!1);
  return Hm(() => {
    g.current = !0;
  }), j.useCallback(
    (v, m = {}) => {
      if (kt(g.current, km), !g.current) return;
      if (typeof v == "number") {
        o.go(v);
        return;
      }
      let y = ec(
        v,
        JSON.parse(h),
        f,
        m.relative === "path"
      );
      i == null && r !== "/" && (y.pathname = y.pathname === "/" ? r : el([r, y.pathname])), (m.replace ? o.replace : o.push)(
        y,
        m.state,
        m
      );
    },
    [
      r,
      o,
      h,
      f,
      i
    ]
  );
}
j.createContext(null);
function Si(i, { relative: r } = {}) {
  let { matches: o } = j.useContext(cl), { pathname: u } = jt(), f = JSON.stringify(Br(o));
  return j.useMemo(
    () => ec(
      i,
      JSON.parse(f),
      u,
      r === "path"
    ),
    [i, f, u, r]
  );
}
function pg(i, r) {
  return Um(i, r);
}
function Um(i, r, o) {
  Ve(
    bn(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useRoutes() may be used only in the context of a <Router> component."
  );
  let { navigator: u } = j.useContext(Ht), { matches: f } = j.useContext(cl), h = f[f.length - 1], g = h ? h.params : {}, x = h ? h.pathname : "/", v = h ? h.pathnameBase : "/", m = h && h.route;
  {
    let O = m && m.path || "";
    Lm(
      x,
      !m || O.endsWith("*") || O.endsWith("*?"),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${x}" (under <Route path="${O}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${O}"> to <Route path="${O === "/" ? "*" : `${O}/*`}">.`
    );
  }
  let y = jt(), b;
  if (r) {
    let O = typeof r == "string" ? Ma(r) : r;
    Ve(
      v === "/" || O.pathname?.startsWith(v),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${v}" but pathname "${O.pathname}" was given in the \`location\` prop.`
    ), b = O;
  } else
    b = y;
  let N = b.pathname || "/", L = N;
  if (v !== "/") {
    let O = v.replace(/^\//, "").split("/");
    L = "/" + N.replace(/^\//, "").split("/").slice(O.length).join("/");
  }
  let G = o && o.state.matches.length ? (
    // If we're in a data router, use the matches we've already identified but ensure
    // we have the latest route instances from the manifest in case elements have changed
    o.state.matches.map(
      (O) => Object.assign(O, {
        route: o.manifest[O.route.id] || O.route
      })
    )
  ) : jm(i, { pathname: L });
  kt(
    m || G != null,
    `No routes matched location "${b.pathname}${b.search}${b.hash}" `
  ), kt(
    G == null || G[G.length - 1].route.element !== void 0 || G[G.length - 1].route.Component !== void 0 || G[G.length - 1].route.lazy !== void 0,
    `Matched leaf route at location "${b.pathname}${b.search}${b.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`
  );
  let Y = bg(
    G && G.map(
      (O) => Object.assign({}, O, {
        params: Object.assign({}, g, O.params),
        pathname: el([
          v,
          // Re-encode pathnames that were decoded inside matchRoutes.
          // Pre-encode `%`, `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          u.encodeLocation ? u.encodeLocation(
            O.pathname.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : O.pathname
        ]),
        pathnameBase: O.pathnameBase === "/" ? v : el([
          v,
          // Re-encode pathnames that were decoded inside matchRoutes
          // Pre-encode `%`, `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          u.encodeLocation ? u.encodeLocation(
            O.pathnameBase.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : O.pathnameBase
        ])
      })
    ),
    f,
    o
  );
  return r && Y ? /* @__PURE__ */ j.createElement(
    _i.Provider,
    {
      value: {
        location: {
          pathname: "/",
          search: "",
          hash: "",
          state: null,
          key: "default",
          mask: void 0,
          ...b
        },
        navigationType: "POP"
        /* Pop */
      }
    },
    Y
  ) : Y;
}
function vg() {
  let i = Ng(), r = tg(i) ? `${i.status} ${i.statusText}` : i instanceof Error ? i.message : JSON.stringify(i), o = i instanceof Error ? i.stack : null, u = "rgba(200,200,200, 0.5)", f = { padding: "0.5rem", backgroundColor: u }, h = { padding: "2px 4px", backgroundColor: u }, g = null;
  return console.error(
    "Error handled by React Router default ErrorBoundary:",
    i
  ), g = /* @__PURE__ */ j.createElement(j.Fragment, null, /* @__PURE__ */ j.createElement("p", null, "💿 Hey developer 👋"), /* @__PURE__ */ j.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /* @__PURE__ */ j.createElement("code", { style: h }, "ErrorBoundary"), " or", " ", /* @__PURE__ */ j.createElement("code", { style: h }, "errorElement"), " prop on your route.")), /* @__PURE__ */ j.createElement(j.Fragment, null, /* @__PURE__ */ j.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ j.createElement("h3", { style: { fontStyle: "italic" } }, r), o ? /* @__PURE__ */ j.createElement("pre", { style: f }, o) : null, g);
}
var gg = /* @__PURE__ */ j.createElement(vg, null), Bm = class extends j.Component {
  constructor(i) {
    super(i), this.state = {
      location: i.location,
      revalidation: i.revalidation,
      error: i.error
    };
  }
  static getDerivedStateFromError(i) {
    return { error: i };
  }
  static getDerivedStateFromProps(i, r) {
    return r.location !== i.location || r.revalidation !== "idle" && i.revalidation === "idle" ? {
      error: i.error,
      location: i.location,
      revalidation: i.revalidation
    } : {
      error: i.error !== void 0 ? i.error : r.error,
      location: r.location,
      revalidation: i.revalidation || r.revalidation
    };
  }
  componentDidCatch(i, r) {
    this.props.onError ? this.props.onError(i, r) : console.error(
      "React Router caught the following error during render",
      i
    );
  }
  render() {
    let i = this.state.error;
    if (this.context && typeof i == "object" && i && "digest" in i && typeof i.digest == "string") {
      const o = fg(i.digest);
      o && (i = o);
    }
    let r = i !== void 0 ? /* @__PURE__ */ j.createElement(cl.Provider, { value: this.props.routeContext }, /* @__PURE__ */ j.createElement(
      Lr.Provider,
      {
        value: i,
        children: this.props.component
      }
    )) : this.props.children;
    return this.context ? /* @__PURE__ */ j.createElement(xg, { error: i }, r) : r;
  }
};
Bm.contextType = zm;
var Ar = /* @__PURE__ */ new WeakMap();
function xg({
  children: i,
  error: r
}) {
  let { basename: o } = j.useContext(Ht);
  if (typeof r == "object" && r && "digest" in r && typeof r.digest == "string") {
    let u = dg(r.digest);
    if (u) {
      let f = Ar.get(r);
      if (f) throw f;
      let h = Rm(u.location, o), g = h.absoluteURL || h.to;
      if (ig(g))
        throw new Error("Invalid redirect location");
      if (Tm && !Ar.get(r))
        if (h.isExternal || u.reloadDocument)
          window.location.href = g;
        else {
          const x = Promise.resolve().then(
            () => window.__reactRouterDataRouter.navigate(h.to, {
              replace: u.replace
            })
          );
          throw Ar.set(r, x), x;
        }
      return /* @__PURE__ */ j.createElement("meta", { httpEquiv: "refresh", content: `0;url=${g}` });
    }
  }
  return i;
}
function yg({ routeContext: i, match: r, children: o }) {
  let u = j.useContext(yn);
  return u && u.static && u.staticContext && (r.route.errorElement || r.route.ErrorBoundary) && (u.staticContext._deepestRenderedBoundaryId = r.route.id), /* @__PURE__ */ j.createElement(cl.Provider, { value: i }, o);
}
function bg(i, r = [], o) {
  let u = o?.state;
  if (i == null) {
    if (!u)
      return null;
    if (u.errors)
      i = u.matches;
    else if (r.length === 0 && !u.initialized && u.matches.length > 0)
      i = u.matches;
    else
      return null;
  }
  let f = i, h = u?.errors;
  if (h != null) {
    let y = f.findIndex(
      (b) => b.route.id && h?.[b.route.id] !== void 0
    );
    Ve(
      y >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(
        h
      ).join(",")}`
    ), f = f.slice(
      0,
      Math.min(f.length, y + 1)
    );
  }
  let g = !1, x = -1;
  if (o && u) {
    g = u.renderFallback;
    for (let y = 0; y < f.length; y++) {
      let b = f[y];
      if ((b.route.HydrateFallback || b.route.hydrateFallbackElement) && (x = y), b.route.id) {
        let { loaderData: N, errors: L } = u, G = b.route.loader && !N.hasOwnProperty(b.route.id) && (!L || L[b.route.id] === void 0);
        if (b.route.lazy || G) {
          o.isStatic && (g = !0), x >= 0 ? f = f.slice(0, x + 1) : f = [f[0]];
          break;
        }
      }
    }
  }
  let v = o?.onError, m = u && v ? (y, b) => {
    v(y, {
      location: u.location,
      params: u.matches?.[0]?.params ?? {},
      pattern: lg(u.matches),
      errorInfo: b
    });
  } : void 0;
  return f.reduceRight(
    (y, b, N) => {
      let L, G = !1, Y = null, O = null;
      u && (L = h && b.route.id ? h[b.route.id] : void 0, Y = b.route.errorElement || gg, g && (x < 0 && N === 0 ? (Lm(
        "route-fallback",
        !1,
        "No `HydrateFallback` element provided to render during initial hydration"
      ), G = !0, O = null) : x === N && (G = !0, O = b.route.hydrateFallbackElement || null)));
      let V = r.concat(f.slice(0, N + 1)), $ = () => {
        let q;
        return L ? q = Y : G ? q = O : b.route.Component ? q = /* @__PURE__ */ j.createElement(b.route.Component, null) : b.route.element ? q = b.route.element : q = y, /* @__PURE__ */ j.createElement(
          yg,
          {
            match: b,
            routeContext: {
              outlet: y,
              matches: V,
              isDataRoute: u != null
            },
            children: q
          }
        );
      };
      return u && (b.route.ErrorBoundary || b.route.errorElement || N === 0) ? /* @__PURE__ */ j.createElement(
        Bm,
        {
          location: u.location,
          revalidation: u.revalidation,
          component: Y,
          error: L,
          children: $(),
          routeContext: { outlet: null, matches: V, isDataRoute: !0 },
          onError: m
        }
      ) : $();
    },
    null
  );
}
function qr(i) {
  return `${i} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function _g(i) {
  let r = j.useContext(yn);
  return Ve(r, qr(i)), r;
}
function Sg(i) {
  let r = j.useContext(tc);
  return Ve(r, qr(i)), r;
}
function jg(i) {
  let r = j.useContext(cl);
  return Ve(r, qr(i)), r;
}
function Yr(i) {
  let r = jg(i), o = r.matches[r.matches.length - 1];
  return Ve(
    o.route.id,
    `${i} can only be used on routes that contain a unique "id"`
  ), o.route.id;
}
function wg() {
  return Yr(
    "useRouteId"
    /* UseRouteId */
  );
}
function Ng() {
  let i = j.useContext(Lr), r = Sg(
    "useRouteError"
    /* UseRouteError */
  ), o = Yr(
    "useRouteError"
    /* UseRouteError */
  );
  return i !== void 0 ? i : r.errors?.[o];
}
function Eg() {
  let { router: i } = _g(
    "useNavigate"
    /* UseNavigateStable */
  ), r = Yr(
    "useNavigate"
    /* UseNavigateStable */
  ), o = j.useRef(!1);
  return Hm(() => {
    o.current = !0;
  }), j.useCallback(
    async (f, h = {}) => {
      kt(o.current, km), o.current && (typeof f == "number" ? await i.navigate(f) : await i.navigate(f, { fromRouteId: r, ...h }));
    },
    [i, r]
  );
}
var dm = {};
function Lm(i, r, o) {
  !r && !dm[i] && (dm[i] = !0, kt(!1, o));
}
j.memo(Mg);
function Mg({
  routes: i,
  manifest: r,
  future: o,
  state: u,
  isStatic: f,
  onError: h
}) {
  return Um(i, void 0, {
    manifest: r,
    state: u,
    isStatic: f,
    onError: h
  });
}
function Na({
  to: i,
  replace: r,
  state: o,
  relative: u
}) {
  Ve(
    bn(),
    // TODO: This error is probably because they somehow have 2 versions of
    // the router loaded. We can help them understand how to avoid that.
    "<Navigate> may be used only in the context of a <Router> component."
  );
  let { static: f } = j.useContext(Ht);
  kt(
    !f,
    "<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change."
  );
  let { matches: h } = j.useContext(cl), { pathname: g } = jt(), x = Ut(), v = ec(
    i,
    Br(h),
    g,
    u === "path"
  ), m = JSON.stringify(v);
  return j.useEffect(() => {
    x(JSON.parse(m), { replace: r, state: o, relative: u });
  }, [x, m, u, r, o]), null;
}
function He(i) {
  Ve(
    !1,
    "A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>."
  );
}
function Cg({
  basename: i = "/",
  children: r = null,
  location: o,
  navigationType: u = "POP",
  navigator: f,
  static: h = !1,
  useTransitions: g
}) {
  Ve(
    !bn(),
    "You cannot render a <Router> inside another <Router>. You should never have more than one in your app."
  );
  let x = i.replace(/^\/*/, "/"), v = j.useMemo(
    () => ({
      basename: x,
      navigator: f,
      static: h,
      useTransitions: g,
      future: {}
    }),
    [x, f, h, g]
  );
  typeof o == "string" && (o = Ma(o));
  let {
    pathname: m = "/",
    search: y = "",
    hash: b = "",
    state: N = null,
    key: L = "default",
    mask: G
  } = o, Y = j.useMemo(() => {
    let O = Ml(m, x);
    return O == null ? null : {
      location: {
        pathname: O,
        search: y,
        hash: b,
        state: N,
        key: L,
        mask: G
      },
      navigationType: u
    };
  }, [x, m, y, b, N, L, u, G]);
  return kt(
    Y != null,
    `<Router basename="${x}"> is not able to match the URL "${m}${y}${b}" because it does not start with the basename, so the <Router> won't render anything.`
  ), Y == null ? null : /* @__PURE__ */ j.createElement(Ht.Provider, { value: v }, /* @__PURE__ */ j.createElement(_i.Provider, { children: r, value: Y }));
}
function Tg({
  children: i,
  location: r
}) {
  return pg(Dr(i), r);
}
function Dr(i, r = []) {
  let o = [];
  return j.Children.forEach(i, (u, f) => {
    if (!j.isValidElement(u))
      return;
    let h = [...r, f];
    if (u.type === j.Fragment) {
      o.push.apply(
        o,
        Dr(u.props.children, h)
      );
      return;
    }
    Ve(
      u.type === He,
      `[${typeof u.type == "string" ? u.type : u.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`
    ), Ve(
      !u.props.index || !u.props.children,
      "An index route cannot have child routes."
    );
    let g = {
      id: u.props.id || h.join("-"),
      caseSensitive: u.props.caseSensitive,
      element: u.props.element,
      Component: u.props.Component,
      index: u.props.index,
      path: u.props.path,
      middleware: u.props.middleware,
      loader: u.props.loader,
      action: u.props.action,
      hydrateFallbackElement: u.props.hydrateFallbackElement,
      HydrateFallback: u.props.HydrateFallback,
      errorElement: u.props.errorElement,
      ErrorBoundary: u.props.ErrorBoundary,
      hasErrorBoundary: u.props.hasErrorBoundary === !0 || u.props.ErrorBoundary != null || u.props.errorElement != null,
      shouldRevalidate: u.props.shouldRevalidate,
      handle: u.props.handle,
      lazy: u.props.lazy
    };
    u.props.children && (g.children = Dr(
      u.props.children,
      h
    )), o.push(g);
  }), o;
}
var Zs = "get", $s = "application/x-www-form-urlencoded";
function lc(i) {
  return typeof HTMLElement < "u" && i instanceof HTMLElement;
}
function Rg(i) {
  return lc(i) && i.tagName.toLowerCase() === "button";
}
function Ag(i) {
  return lc(i) && i.tagName.toLowerCase() === "form";
}
function zg(i) {
  return lc(i) && i.tagName.toLowerCase() === "input";
}
function Og(i) {
  return !!(i.metaKey || i.altKey || i.ctrlKey || i.shiftKey);
}
function Dg(i, r) {
  return i.button === 0 && // Ignore everything but left clicks
  (!r || r === "_self") && // Let browser handle "target=_blank" etc.
  !Og(i);
}
function kr(i = "") {
  return new URLSearchParams(
    typeof i == "string" || Array.isArray(i) || i instanceof URLSearchParams ? i : Object.keys(i).reduce((r, o) => {
      let u = i[o];
      return r.concat(
        Array.isArray(u) ? u.map((f) => [o, f]) : [[o, u]]
      );
    }, [])
  );
}
function kg(i, r) {
  let o = kr(i);
  return r && r.forEach((u, f) => {
    o.has(f) || r.getAll(f).forEach((h) => {
      o.append(f, h);
    });
  }), o;
}
var Vs = null;
function Hg() {
  if (Vs === null)
    try {
      new FormData(
        document.createElement("form"),
        // @ts-expect-error if FormData supports the submitter parameter, this will throw
        0
      ), Vs = !1;
    } catch {
      Vs = !0;
    }
  return Vs;
}
var Ug = /* @__PURE__ */ new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
]);
function zr(i) {
  return i != null && !Ug.has(i) ? (kt(
    !1,
    `"${i}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${$s}"`
  ), null) : i;
}
function Bg(i, r) {
  let o, u, f, h, g;
  if (Ag(i)) {
    let x = i.getAttribute("action");
    u = x ? Ml(x, r) : null, o = i.getAttribute("method") || Zs, f = zr(i.getAttribute("enctype")) || $s, h = new FormData(i);
  } else if (Rg(i) || zg(i) && (i.type === "submit" || i.type === "image")) {
    let x = i.form;
    if (x == null)
      throw new Error(
        'Cannot submit a <button> or <input type="submit"> without a <form>'
      );
    let v = i.getAttribute("formaction") || x.getAttribute("action");
    if (u = v ? Ml(v, r) : null, o = i.getAttribute("formmethod") || x.getAttribute("method") || Zs, f = zr(i.getAttribute("formenctype")) || zr(x.getAttribute("enctype")) || $s, h = new FormData(x, i), !Hg()) {
      let { name: m, type: y, value: b } = i;
      if (y === "image") {
        let N = m ? `${m}.` : "";
        h.append(`${N}x`, "0"), h.append(`${N}y`, "0");
      } else m && h.append(m, b);
    }
  } else {
    if (lc(i))
      throw new Error(
        'Cannot submit element that is not <form>, <button>, or <input type="submit|image">'
      );
    o = Zs, u = null, f = $s, g = i;
  }
  return h && f === "text/plain" && (g = h, h = void 0), { action: u, method: o.toLowerCase(), encType: f, formData: h, body: g };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function Gr(i, r) {
  if (i === !1 || i === null || typeof i > "u")
    throw new Error(r);
}
function qm(i, r, o, u) {
  let f = typeof i == "string" ? new URL(
    i,
    // This can be called during the SSR flow via PrefetchPageLinksImpl so
    // don't assume window is available
    typeof window > "u" ? "server://singlefetch/" : window.location.origin
  ) : i;
  return o ? f.pathname.endsWith("/") ? f.pathname = `${f.pathname}_.${u}` : f.pathname = `${f.pathname}.${u}` : f.pathname === "/" ? f.pathname = `_root.${u}` : r && Ml(f.pathname, r) === "/" ? f.pathname = `${Ws(r)}/_root.${u}` : f.pathname = `${Ws(f.pathname)}.${u}`, f;
}
async function Lg(i, r) {
  if (i.id in r)
    return r[i.id];
  try {
    let o = await import(
      /* @vite-ignore */
      /* webpackIgnore: true */
      i.module
    );
    return r[i.id] = o, o;
  } catch (o) {
    return console.error(
      `Error loading route module \`${i.module}\`, reloading page...`
    ), console.error(o), window.__reactRouterContext && window.__reactRouterContext.isSpaMode, window.location.reload(), new Promise(() => {
    });
  }
}
function qg(i) {
  return i == null ? !1 : i.href == null ? i.rel === "preload" && typeof i.imageSrcSet == "string" && typeof i.imageSizes == "string" : typeof i.rel == "string" && typeof i.href == "string";
}
async function Yg(i, r, o) {
  let u = await Promise.all(
    i.map(async (f) => {
      let h = r.routes[f.route.id];
      if (h) {
        let g = await Lg(h, o);
        return g.links ? g.links() : [];
      }
      return [];
    })
  );
  return Qg(
    u.flat(1).filter(qg).filter((f) => f.rel === "stylesheet" || f.rel === "preload").map(
      (f) => f.rel === "stylesheet" ? { ...f, rel: "prefetch", as: "style" } : { ...f, rel: "prefetch" }
    )
  );
}
function fm(i, r, o, u, f, h) {
  let g = (v, m) => o[m] ? v.route.id !== o[m].route.id : !0, x = (v, m) => (
    // param change, /users/123 -> /users/456
    o[m].pathname !== v.pathname || // splat param changed, which is not present in match.path
    // e.g. /files/images/avatar.jpg -> files/finances.xls
    o[m].route.path?.endsWith("*") && o[m].params["*"] !== v.params["*"]
  );
  return h === "assets" ? r.filter(
    (v, m) => g(v, m) || x(v, m)
  ) : h === "data" ? r.filter((v, m) => {
    let y = u.routes[v.route.id];
    if (!y || !y.hasLoader)
      return !1;
    if (g(v, m) || x(v, m))
      return !0;
    if (v.route.shouldRevalidate) {
      let b = v.route.shouldRevalidate({
        currentUrl: new URL(
          f.pathname + f.search + f.hash,
          window.origin
        ),
        currentParams: o[0]?.params || {},
        nextUrl: new URL(i, window.origin),
        nextParams: v.params,
        defaultShouldRevalidate: !0
      });
      if (typeof b == "boolean")
        return b;
    }
    return !0;
  }) : [];
}
function Gg(i, r, { includeHydrateFallback: o } = {}) {
  return Vg(
    i.map((u) => {
      let f = r.routes[u.route.id];
      if (!f) return [];
      let h = [f.module];
      return f.clientActionModule && (h = h.concat(f.clientActionModule)), f.clientLoaderModule && (h = h.concat(f.clientLoaderModule)), o && f.hydrateFallbackModule && (h = h.concat(f.hydrateFallbackModule)), f.imports && (h = h.concat(f.imports)), h;
    }).flat(1)
  );
}
function Vg(i) {
  return [...new Set(i)];
}
function Xg(i) {
  let r = {}, o = Object.keys(i).sort();
  for (let u of o)
    r[u] = i[u];
  return r;
}
function Qg(i, r) {
  let o = /* @__PURE__ */ new Set();
  return new Set(r), i.reduce((u, f) => {
    let h = JSON.stringify(Xg(f));
    return o.has(h) || (o.add(h), u.push({ key: h, link: f })), u;
  }, []);
}
function Vr() {
  let i = j.useContext(yn);
  return Gr(
    i,
    "You must render this element inside a <DataRouterContext.Provider> element"
  ), i;
}
function Zg() {
  let i = j.useContext(tc);
  return Gr(
    i,
    "You must render this element inside a <DataRouterStateContext.Provider> element"
  ), i;
}
var Xr = j.createContext(void 0);
Xr.displayName = "FrameworkContext";
function ac() {
  let i = j.useContext(Xr);
  return Gr(
    i,
    "You must render this element inside a <HydratedRouter> element"
  ), i;
}
function $g(i, r) {
  let o = j.useContext(Xr), [u, f] = j.useState(!1), [h, g] = j.useState(!1), { onFocus: x, onBlur: v, onMouseEnter: m, onMouseLeave: y, onTouchStart: b } = r, N = j.useRef(null);
  j.useEffect(() => {
    if (i === "render" && g(!0), i === "viewport") {
      let Y = (V) => {
        V.forEach(($) => {
          g($.isIntersecting);
        });
      }, O = new IntersectionObserver(Y, { threshold: 0.5 });
      return N.current && O.observe(N.current), () => {
        O.disconnect();
      };
    }
  }, [i]), j.useEffect(() => {
    if (u) {
      let Y = setTimeout(() => {
        g(!0);
      }, 100);
      return () => {
        clearTimeout(Y);
      };
    }
  }, [u]);
  let L = () => {
    f(!0);
  }, G = () => {
    f(!1), g(!1);
  };
  return o ? i !== "intent" ? [h, N, {}] : [
    h,
    N,
    {
      onFocus: vi(x, L),
      onBlur: vi(v, G),
      onMouseEnter: vi(m, L),
      onMouseLeave: vi(y, G),
      onTouchStart: vi(b, L)
    }
  ] : [!1, N, {}];
}
function vi(i, r) {
  return (o) => {
    i && i(o), o.defaultPrevented || r(o);
  };
}
function Kg({ page: i, ...r }) {
  let o = sg(), { nonce: u } = ac(), { router: f } = Vr(), h = j.useMemo(
    () => jm(f.routes, i, f.basename),
    [f.routes, i, f.basename]
  );
  return h ? (r.nonce == null && u && (r = { ...r, nonce: u }), o ? /* @__PURE__ */ j.createElement(Fg, { page: i, matches: h, ...r }) : /* @__PURE__ */ j.createElement(Wg, { page: i, matches: h, ...r })) : null;
}
function Jg(i) {
  let { manifest: r, routeModules: o } = ac(), [u, f] = j.useState([]);
  return j.useEffect(() => {
    let h = !1;
    return Yg(i, r, o).then(
      (g) => {
        h || f(g);
      }
    ), () => {
      h = !0;
    };
  }, [i, r, o]), u;
}
function Fg({
  page: i,
  matches: r,
  ...o
}) {
  let u = jt(), { future: f } = ac(), { basename: h } = Vr(), g = j.useMemo(() => {
    if (i === u.pathname + u.search + u.hash)
      return [];
    let x = qm(
      i,
      h,
      f.v8_trailingSlashAwareDataRequests,
      "rsc"
    ), v = !1, m = [];
    for (let y of r)
      typeof y.route.shouldRevalidate == "function" ? v = !0 : m.push(y.route.id);
    return v && m.length > 0 && x.searchParams.set("_routes", m.join(",")), [x.pathname + x.search];
  }, [
    h,
    f.v8_trailingSlashAwareDataRequests,
    i,
    u,
    r
  ]);
  return /* @__PURE__ */ j.createElement(j.Fragment, null, g.map((x) => /* @__PURE__ */ j.createElement("link", { key: x, rel: "prefetch", as: "fetch", href: x, ...o })));
}
function Wg({
  page: i,
  matches: r,
  ...o
}) {
  let u = jt(), { future: f, manifest: h, routeModules: g } = ac(), { basename: x } = Vr(), { loaderData: v, matches: m } = Zg(), y = j.useMemo(
    () => fm(
      i,
      r,
      m,
      h,
      u,
      "data"
    ),
    [i, r, m, h, u]
  ), b = j.useMemo(
    () => fm(
      i,
      r,
      m,
      h,
      u,
      "assets"
    ),
    [i, r, m, h, u]
  ), N = j.useMemo(() => {
    if (i === u.pathname + u.search + u.hash)
      return [];
    let Y = /* @__PURE__ */ new Set(), O = !1;
    if (r.forEach(($) => {
      let q = h.routes[$.route.id];
      !q || !q.hasLoader || (!y.some((le) => le.route.id === $.route.id) && $.route.id in v && g[$.route.id]?.shouldRevalidate || q.hasClientLoader ? O = !0 : Y.add($.route.id));
    }), Y.size === 0)
      return [];
    let V = qm(
      i,
      x,
      f.v8_trailingSlashAwareDataRequests,
      "data"
    );
    return O && Y.size > 0 && V.searchParams.set(
      "_routes",
      r.filter(($) => Y.has($.route.id)).map(($) => $.route.id).join(",")
    ), [V.pathname + V.search];
  }, [
    x,
    f.v8_trailingSlashAwareDataRequests,
    v,
    u,
    h,
    y,
    r,
    i,
    g
  ]), L = j.useMemo(
    () => Gg(b, h),
    [b, h]
  ), G = Jg(b);
  return /* @__PURE__ */ j.createElement(j.Fragment, null, N.map((Y) => /* @__PURE__ */ j.createElement("link", { key: Y, rel: "prefetch", as: "fetch", href: Y, ...o })), L.map((Y) => /* @__PURE__ */ j.createElement("link", { key: Y, rel: "modulepreload", href: Y, ...o })), G.map(({ key: Y, link: O }) => (
    // these don't spread `linkProps` because they are full link descriptors
    // already with their own props
    /* @__PURE__ */ j.createElement(
      "link",
      {
        key: Y,
        nonce: o.nonce,
        ...O,
        crossOrigin: O.crossOrigin ?? o.crossOrigin
      }
    )
  )));
}
function Pg(...i) {
  return (r) => {
    i.forEach((o) => {
      typeof o == "function" ? o(r) : o != null && (o.current = r);
    });
  };
}
var Ig = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
try {
  Ig && (window.__reactRouterVersion = // @ts-expect-error
  "7.18.2");
} catch {
}
function ex({
  basename: i,
  children: r,
  useTransitions: o,
  window: u
}) {
  let f = j.useRef();
  f.current == null && (f.current = z0({ window: u, v5Compat: !0 }));
  let h = f.current, [g, x] = j.useState({
    action: h.action,
    location: h.location
  }), v = j.useCallback(
    (m) => {
      o === !1 ? x(m) : j.startTransition(() => x(m));
    },
    [o]
  );
  return j.useLayoutEffect(() => h.listen(v), [h, v]), /* @__PURE__ */ j.createElement(
    Cg,
    {
      basename: i,
      children: r,
      location: g.location,
      navigationType: g.action,
      navigator: h,
      useTransitions: o
    }
  );
}
var bi = j.forwardRef(
  function({
    onClick: r,
    discover: o = "render",
    prefetch: u = "none",
    relative: f,
    reloadDocument: h,
    replace: g,
    mask: x,
    state: v,
    target: m,
    to: y,
    preventScrollReset: b,
    viewTransition: N,
    defaultShouldRevalidate: L,
    ...G
  }, Y) {
    let { basename: O, navigator: V, useTransitions: $ } = j.useContext(Ht), q = typeof y == "string" && Ur.test(y), le = Rm(y, O);
    y = le.to;
    let se = hg(y, { relative: f }), re = jt(), F = null;
    if (x) {
      let ee = ec(
        x,
        [],
        re.mask ? re.mask.pathname : "/",
        !0
      );
      O !== "/" && (ee.pathname = ee.pathname === "/" ? O : el([O, ee.pathname])), F = V.createHref(ee);
    }
    let [oe, pe, _e] = $g(
      u,
      G
    ), Ee = ax(y, {
      replace: g,
      mask: x,
      state: v,
      target: m,
      preventScrollReset: b,
      relative: f,
      viewTransition: N,
      defaultShouldRevalidate: L,
      useTransitions: $
    });
    function Se(ee) {
      r && r(ee), ee.defaultPrevented || Ee(ee);
    }
    let z = !(le.isExternal || h), te = (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      /* @__PURE__ */ j.createElement(
        "a",
        {
          ...G,
          ..._e,
          href: (z ? F : void 0) || le.absoluteURL || se,
          onClick: z ? Se : r,
          ref: Pg(Y, pe),
          target: m,
          "data-discover": !q && o === "render" ? "true" : void 0
        }
      )
    );
    return oe && !q ? /* @__PURE__ */ j.createElement(j.Fragment, null, te, /* @__PURE__ */ j.createElement(Kg, { page: se })) : te;
  }
);
bi.displayName = "Link";
var Ks = j.forwardRef(
  function({
    "aria-current": r = "page",
    caseSensitive: o = !1,
    className: u = "",
    end: f = !1,
    style: h,
    to: g,
    viewTransition: x,
    children: v,
    ...m
  }, y) {
    let b = Si(g, { relative: m.relative }), N = jt(), L = j.useContext(tc), { navigator: G, basename: Y } = j.useContext(Ht), O = L != null && // Conditional usage is OK here because the usage of a data router is static
    // eslint-disable-next-line react-hooks/rules-of-hooks
    ux(b) && x === !0, V = G.encodeLocation ? G.encodeLocation(b).pathname : b.pathname, $ = N.pathname, q = L && L.navigation && L.navigation.location ? L.navigation.location.pathname : null;
    o || ($ = $.toLowerCase(), q = q ? q.toLowerCase() : null, V = V.toLowerCase()), q && Y && (q = Ml(q, Y) || q);
    const le = V !== "/" && V.endsWith("/") ? V.length - 1 : V.length;
    let se = $ === V || !f && $.startsWith(V) && $.charAt(le) === "/", re = q != null && (q === V || !f && q.startsWith(V) && q.charAt(V.length) === "/"), F = {
      isActive: se,
      isPending: re,
      isTransitioning: O
    }, oe = se ? r : void 0, pe;
    typeof u == "function" ? pe = u(F) : pe = [
      u,
      se ? "active" : null,
      re ? "pending" : null,
      O ? "transitioning" : null
    ].filter(Boolean).join(" ");
    let _e = typeof h == "function" ? h(F) : h;
    return /* @__PURE__ */ j.createElement(
      bi,
      {
        ...m,
        "aria-current": oe,
        className: pe,
        ref: y,
        style: _e,
        to: g,
        viewTransition: x
      },
      typeof v == "function" ? v(F) : v
    );
  }
);
Ks.displayName = "NavLink";
var tx = j.forwardRef(
  ({
    discover: i = "render",
    fetcherKey: r,
    navigate: o,
    reloadDocument: u,
    replace: f,
    state: h,
    method: g = Zs,
    action: x,
    onSubmit: v,
    relative: m,
    preventScrollReset: y,
    viewTransition: b,
    defaultShouldRevalidate: N,
    ...L
  }, G) => {
    let { useTransitions: Y } = j.useContext(Ht), O = sx(), V = cx(x, { relative: m }), $ = g.toLowerCase() === "get" ? "get" : "post", q = typeof x == "string" && Ur.test(x), le = (se) => {
      if (v && v(se), se.defaultPrevented) return;
      se.preventDefault();
      let re = se.nativeEvent.submitter, F = re?.getAttribute("formmethod") || g, oe = () => O(re || se.currentTarget, {
        fetcherKey: r,
        method: F,
        navigate: o,
        replace: f,
        state: h,
        relative: m,
        preventScrollReset: y,
        viewTransition: b,
        defaultShouldRevalidate: N
      });
      Y && o !== !1 ? j.startTransition(() => oe()) : oe();
    };
    return /* @__PURE__ */ j.createElement(
      "form",
      {
        ref: G,
        method: $,
        action: V,
        onSubmit: u ? v : le,
        ...L,
        "data-discover": !q && i === "render" ? "true" : void 0
      }
    );
  }
);
tx.displayName = "Form";
function lx(i) {
  return `${i} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function Ym(i) {
  let r = j.useContext(yn);
  return Ve(r, lx(i)), r;
}
function ax(i, {
  target: r,
  replace: o,
  mask: u,
  state: f,
  preventScrollReset: h,
  relative: g,
  viewTransition: x,
  defaultShouldRevalidate: v,
  useTransitions: m
} = {}) {
  let y = Ut(), b = jt(), N = Si(i, { relative: g });
  return j.useCallback(
    (L) => {
      if (Dg(L, r)) {
        L.preventDefault();
        let G = o !== void 0 ? o : yi(b) === yi(N), Y = () => y(i, {
          replace: G,
          mask: u,
          state: f,
          preventScrollReset: h,
          relative: g,
          viewTransition: x,
          defaultShouldRevalidate: v
        });
        m ? j.startTransition(() => Y()) : Y();
      }
    },
    [
      b,
      y,
      N,
      o,
      u,
      f,
      r,
      i,
      h,
      g,
      x,
      v,
      m
    ]
  );
}
function nc(i) {
  kt(
    typeof URLSearchParams < "u",
    "You cannot use the `useSearchParams` hook in a browser that does not support the URLSearchParams API. If you need to support Internet Explorer 11, we recommend you load a polyfill such as https://github.com/ungap/url-search-params."
  );
  let r = j.useRef(kr(i)), o = j.useRef(!1), u = jt(), f = j.useMemo(
    () => (
      // Only merge in the defaults if we haven't yet called setSearchParams.
      // Once we call that we want those to take precedence, otherwise you can't
      // remove a param with setSearchParams({}) if it has an initial value
      kg(
        u.search,
        o.current ? null : r.current
      )
    ),
    [u.search]
  ), h = Ut(), g = j.useCallback(
    (x, v) => {
      const m = kr(
        typeof x == "function" ? x(new URLSearchParams(f)) : x
      );
      o.current = !0, h("?" + m, v);
    },
    [h, f]
  );
  return [f, g];
}
var nx = 0, ix = () => `__${String(++nx)}__`;
function sx() {
  let { router: i } = Ym(
    "useSubmit"
    /* UseSubmit */
  ), { basename: r } = j.useContext(Ht), o = wg(), u = i.fetch, f = i.navigate;
  return j.useCallback(
    async (h, g = {}) => {
      let { action: x, method: v, encType: m, formData: y, body: b } = Bg(
        h,
        r
      );
      if (g.navigate === !1) {
        let N = g.fetcherKey || ix();
        await u(N, o, g.action || x, {
          defaultShouldRevalidate: g.defaultShouldRevalidate,
          preventScrollReset: g.preventScrollReset,
          formData: y,
          body: b,
          formMethod: g.method || v,
          formEncType: g.encType || m,
          flushSync: g.flushSync
        });
      } else
        await f(g.action || x, {
          defaultShouldRevalidate: g.defaultShouldRevalidate,
          preventScrollReset: g.preventScrollReset,
          formData: y,
          body: b,
          formMethod: g.method || v,
          formEncType: g.encType || m,
          replace: g.replace,
          state: g.state,
          fromRouteId: o,
          flushSync: g.flushSync,
          viewTransition: g.viewTransition
        });
    },
    [u, f, r, o]
  );
}
function cx(i, { relative: r } = {}) {
  let { basename: o } = j.useContext(Ht), u = j.useContext(cl);
  Ve(u, "useFormAction must be used inside a RouteContext");
  let [f] = u.matches.slice(-1), h = { ...Si(i || ".", { relative: r }) }, g = jt();
  if (i == null) {
    h.search = g.search;
    let x = new URLSearchParams(h.search), v = x.getAll("index");
    if (v.some((y) => y === "")) {
      x.delete("index"), v.filter((b) => b).forEach((b) => x.append("index", b));
      let y = x.toString();
      h.search = y ? `?${y}` : "";
    }
  }
  return (!i || i === ".") && f.route.index && (h.search = h.search ? h.search.replace(/^\?/, "?index&") : "?index"), o !== "/" && (h.pathname = h.pathname === "/" ? o : el([o, h.pathname])), yi(h);
}
function ux(i, { relative: r } = {}) {
  let o = j.useContext(Om);
  Ve(
    o != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?"
  );
  let { basename: u } = Ym(
    "useViewTransitionState"
    /* useViewTransitionState */
  ), f = Si(i, { relative: r });
  if (!o.isTransitioning)
    return !1;
  let h = Ml(o.currentLocation.pathname, u) || o.currentLocation.pathname, g = Ml(o.nextLocation.pathname, u) || o.nextLocation.pathname;
  return Fs(f.pathname, g) != null || Fs(f.pathname, h) != null;
}
const rx = {
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
  trends: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/>
</svg>`
};
function ox(i) {
  return rx[i];
}
const Gm = j.createContext(null);
function dx(i) {
  if (!i) return !1;
  const r = i.toLowerCase();
  return r.includes("dsc_") || r.includes("dsc-") || r.startsWith("sensor.dsc") || r.startsWith("switch.dsc") || r.startsWith("binary_sensor.dsc") || r.startsWith("number.dsc") || r.startsWith("light.dsc") || r.startsWith("fan.dsc") || r.startsWith("select.dsc") || r.startsWith("input_");
}
function fx({
  hass: i,
  children: r
}) {
  const [o, u] = j.useState(0);
  j.useEffect(() => {
    if (!i) return;
    u((m) => m + 1);
    const h = i.connection;
    if (!h?.subscribeEvents) return;
    let g, x = !1;
    const v = (m) => {
      const y = m.data?.entity_id;
      dx(y) && u((b) => b + 1);
    };
    return Promise.resolve(h.subscribeEvents(v, "state_changed")).then((m) => {
      if (x) {
        m();
        return;
      }
      g = m;
    }).catch(() => {
    }), () => {
      x = !0, g?.();
    };
  }, [i]);
  const f = j.useMemo(() => {
    const h = (b) => i?.states?.[b], g = (b) => {
      const N = h(b)?.state;
      return !!N && N !== "unavailable" && N !== "unknown";
    }, x = (b, N = "—") => g(b) ? h(b)?.state ?? N : N;
    return { hass: i, entity: h, state: x, num: (b, N = NaN) => {
      const L = Number(x(b, ""));
      return Number.isFinite(L) ? L : N;
    }, available: g, callService: (b, N, L) => i?.callService ? i.callService(b, N, L) : Promise.resolve(null), callWS: (b) => {
      if (i?.callWS) return i.callWS(b);
      const N = i?.connection;
      return N?.sendMessagePromise ? N.sendMessagePromise(b) : Promise.resolve(null);
    }, tick: o };
  }, [i, o]);
  return j.createElement(Gm.Provider, { value: f }, r);
}
function Qe() {
  const i = j.useContext(Gm);
  if (!i) throw new Error("useHass outside HassProvider");
  return i;
}
function El({
  name: i,
  size: r = 16,
  className: o,
  color: u = "currentColor"
}) {
  return /* @__PURE__ */ c.jsx(
    "span",
    {
      className: `dsc-icon${o ? ` ${o}` : ""}`,
      role: "img",
      "aria-hidden": !0,
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: r,
        height: r,
        color: u,
        flexShrink: 0,
        lineHeight: 0
      },
      dangerouslySetInnerHTML: { __html: ox(i) }
    }
  );
}
function ie({
  title: i,
  children: r,
  className: o = "",
  style: u,
  icon: f
}) {
  return /* @__PURE__ */ c.jsxs("section", { className: `dsc-card ${o}`.trim(), style: u, children: [
    i ? /* @__PURE__ */ c.jsxs("h3", { className: "dsc-card-title", children: [
      f ? /* @__PURE__ */ c.jsx(El, { name: f, size: 14, color: "var(--dsc-teal)" }) : null,
      i
    ] }) : null,
    r
  ] });
}
function Ue({
  children: i,
  primary: r,
  teal: o,
  onClick: u,
  type: f = "button",
  disabled: h
}) {
  const g = ["dsc-btn"];
  return r && g.push("primary"), o && g.push("teal"), /* @__PURE__ */ c.jsx("button", { type: f, className: g.join(" "), onClick: u, disabled: h, children: i });
}
function Xe({
  label: i,
  value: r,
  unit: o,
  sub: u,
  tone: f = "normal",
  stale: h,
  onClick: g
}) {
  const x = f === "ok" ? "dsc-status-ok" : f === "bad" ? "dsc-status-bad" : f === "muted" || h ? "dsc-status-muted" : "", v = /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
    /* @__PURE__ */ c.jsxs("div", { className: `dsc-kpi-value ${x}`.trim(), children: [
      r,
      o ? /* @__PURE__ */ c.jsx("span", { className: "dsc-kpi-unit", children: o }) : null,
      h ? /* @__PURE__ */ c.jsx("span", { className: "dsc-held-tag", children: "HELD" }) : null
    ] }),
    u ? /* @__PURE__ */ c.jsx("div", { className: "dsc-kpi-sub", children: u }) : null
  ] });
  return g ? /* @__PURE__ */ c.jsx("button", { type: "button", className: "dsc-kpi-hit", onClick: g, title: `History · ${i}`, children: /* @__PURE__ */ c.jsx(ie, { title: i, className: h ? "is-stale" : void 0, children: v }) }) : /* @__PURE__ */ c.jsx(ie, { title: i, className: h ? "is-stale" : void 0, children: v });
}
function Jt({
  title: i,
  subtitle: r,
  icon: o,
  primaryAction: u,
  actions: f
}) {
  const h = u || f ? /* @__PURE__ */ c.jsxs("div", { className: "dsc-page-header-actions", children: [
    u,
    f
  ] }) : null;
  return /* @__PURE__ */ c.jsxs("header", { className: "dsc-page-header", children: [
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-page-header-main", children: [
      o ? /* @__PURE__ */ c.jsx(El, { name: o, size: 22, color: "var(--dsc-teal)" }) : null,
      /* @__PURE__ */ c.jsxs("div", { children: [
        /* @__PURE__ */ c.jsx("h1", { className: "dsc-page-title", children: i }),
        r ? /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: r }) : null
      ] })
    ] }),
    h
  ] });
}
function W({
  label: i,
  tone: r = "muted",
  pulse: o,
  icon: u
}) {
  return /* @__PURE__ */ c.jsxs("span", { className: `dsc-chip dsc-chip--${r}${o ? " dsc-chip--pulse" : ""}`, children: [
    u ? /* @__PURE__ */ c.jsx(El, { name: u, size: 11 }) : null,
    i
  ] });
}
function ke({
  entityId: i,
  label: r,
  warnWhenMissing: o,
  icon: u,
  showBrightness: f
}) {
  const { state: h, available: g, callService: x, entity: v } = Qe(), m = h(i, "off") === "on", y = g(i), b = i.split(".")[0], N = () => {
    if (y) {
      if (b === "switch" || b === "input_boolean") {
        x("homeassistant", "toggle", { entity_id: i });
        return;
      }
      b === "light" && x("light", m ? "turn_off" : "turn_on", { entity_id: i });
    }
  }, L = f !== !1 && b === "light" && m ? Math.round(Number(v(i)?.attributes?.brightness ?? 0) / 255 * 100) : null;
  return /* @__PURE__ */ c.jsxs(
    "button",
    {
      type: "button",
      className: `dsc-demand${m ? " is-on" : ""}${y ? "" : " is-missing"}`,
      onClick: N,
      disabled: !y && !o,
      title: y ? i : o || `${i} unavailable`,
      children: [
        u ? /* @__PURE__ */ c.jsx(El, { name: u, size: 22, color: "var(--dsc-teal)", className: "dsc-demand-icon" }) : null,
        /* @__PURE__ */ c.jsx("span", { className: "dsc-demand-label", children: r }),
        /* @__PURE__ */ c.jsx("span", { className: "dsc-demand-state", children: y ? L != null ? `${L}%` : m ? "ON" : "OFF" : o || "—" })
      ]
    }
  );
}
function Ps({
  entityId: i,
  label: r,
  icon: o
}) {
  const { state: u, available: f, callService: h, entity: g } = Qe(), x = f(i), v = u(i, ""), m = g(i)?.attributes?.options || [], y = i.split(".")[0], b = (N) => {
    !x || !N || (y === "select" ? h("select", "select_option", { entity_id: i, option: N }) : y === "input_select" && h("input_select", "select_option", { entity_id: i, option: N }));
  };
  return /* @__PURE__ */ c.jsxs("label", { className: `dsc-entity-select${x ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ c.jsxs("span", { className: "dsc-entity-select-label", children: [
      o ? /* @__PURE__ */ c.jsx(El, { name: o, size: 13, color: "var(--dsc-teal)" }) : null,
      r
    ] }),
    /* @__PURE__ */ c.jsxs("select", { value: v, disabled: !x, onChange: (N) => b(N.target.value), children: [
      !m.includes(v) && v ? /* @__PURE__ */ c.jsx("option", { value: v, children: v }) : null,
      m.map((N) => /* @__PURE__ */ c.jsx("option", { value: N, children: N }, N))
    ] })
  ] });
}
function Kt({
  entityId: i,
  label: r,
  disabled: o
}) {
  const { available: u, callService: f, entity: h, state: g } = Qe(), x = u(i), v = Number(h(i)?.attributes?.percentage ?? 0), m = g(i) === "on", y = o || !x, b = (N) => {
    y || f("fan", "set_percentage", { entity_id: i, percentage: N });
  };
  return /* @__PURE__ */ c.jsxs("label", { className: `dsc-fan-slider${y ? " is-disabled" : ""}`, children: [
    /* @__PURE__ */ c.jsxs("span", { className: "dsc-fan-slider-label", children: [
      r,
      /* @__PURE__ */ c.jsx("strong", { children: x ? `${Math.round(v)}%` : "—" }),
      !m && x ? /* @__PURE__ */ c.jsx("em", { className: "dsc-muted", children: "off" }) : null
    ] }),
    /* @__PURE__ */ c.jsx(
      "input",
      {
        type: "range",
        min: 0,
        max: 100,
        step: 1,
        value: Number.isFinite(v) ? v : 0,
        disabled: y,
        onChange: (N) => b(Number(N.target.value))
      }
    )
  ] });
}
function hx(i) {
  const r = [], o = (g, x = "unknown") => i.state(g, x), u = (g) => o(g) === "on", f = i.entity?.("sensor.dsc_keepup_gaps")?.attributes ?? {}, h = String(f.full_auto_honesty ?? "").trim();
  if (i.available && !i.available("sensor.dsc_hub_uptime")) {
    const g = i.entity?.("sensor.dsc_hub_uptime")?.last_changed;
    let x = "";
    if (g) {
      const v = Date.now() - Date.parse(g);
      if (Number.isFinite(v) && v >= 0) {
        const m = Math.floor(v / 6e4);
        x = m < 60 ? ` · offline ${Math.max(1, m)}m` : ` · offline ${(m / 60).toFixed(1)}h`;
      }
    }
    r.push({
      id: "hub-dark",
      label: "Hub offline",
      detail: `Showing last good vitals${x}. Reconnect snaps to live.`,
      tone: "bad",
      href: "/fleet",
      cta: "Open Fleet",
      priority: 10
    });
  }
  return i.available && !i.available("sensor.dsc_hub_heartbeat") && r.push({
    id: "beat-dark",
    label: "Beat dark",
    detail: "Hub heartbeat unavailable — Mission shows BEAT OFF duration; vitals stay held.",
    tone: "bad",
    href: "/live/mission",
    cta: "Mission",
    priority: 12
  }), i.available && !i.available("binary_sensor.dsc_hub_panel_link") && r.push({
    id: "panel-dark",
    label: "Panel link dark",
    detail: "Panel link dark — Mission shows PANEL OFF duration; do not invent Got.",
    tone: "warn",
    href: "/fleet",
    cta: "Open Fleet",
    priority: 14
  }), u("binary_sensor.dsc_reduced_kit") && r.push({
    id: "reduced-kit",
    label: "Reduced kit",
    detail: "Full Auto keep-up is honesty-limited while kit is reduced.",
    tone: "warn",
    href: "/fleet",
    cta: "Review kit",
    priority: 20
  }), h && u("switch.dsc_hub_tent_full_auto_mode") && r.push({
    id: "keepup",
    label: "Keep-up gaps",
    detail: h,
    tone: "warn",
    href: "/live/climate",
    cta: "Fix Climate",
    priority: 30
  }), u("binary_sensor.dsc_clone_dark_period_violation") && r.push({
    id: "dark-viol",
    label: "Clone dark violation",
    detail: "Photoperiod honesty — check Light Cycle.",
    tone: "bad",
    href: "/live/light",
    cta: "Open Light",
    priority: 25
  }), u("binary_sensor.dsc_hub_climate_sensor_fault") && r.push({
    id: "climate-fault",
    label: "Climate sensor fault",
    detail: "Trust the honesty rail — do not invent Got.",
    tone: "bad",
    href: "/live/climate",
    cta: "Open Climate",
    priority: 15
  }), u("binary_sensor.dsc_hub_emergency_failsafe") && r.push({
    id: "failsafe",
    label: "Emergency failsafe",
    detail: "Hub failsafe active.",
    tone: "bad",
    href: "/live/mission",
    cta: "Mission",
    priority: 5
  }), r.sort((g, x) => g.priority - x.priority);
}
function mx(i) {
  return i[0] ?? null;
}
function Vm() {
  const i = Qe();
  return j.useMemo(
    () => hx({
      state: i.state,
      available: i.available,
      entity: i.entity
    }),
    [i.state, i.available, i.entity, i.tick]
  );
}
function px({ gaps: i }) {
  const r = Vm(), o = i ?? r;
  return o.length ? /* @__PURE__ */ c.jsx("div", { className: "dsc-honesty-rail", "aria-label": "Honesty gaps", children: o.slice(0, 6).map((u) => /* @__PURE__ */ c.jsx(W, { icon: "alert", label: u.label, tone: u.tone === "bad" ? "bad" : "warn" }, u.id)) }) : /* @__PURE__ */ c.jsx("div", { className: "dsc-honesty-rail", "aria-label": "Honesty", children: /* @__PURE__ */ c.jsx(W, { icon: "ok", label: "Kit honest", tone: "ok" }) });
}
function vx({ gaps: i }) {
  const r = Vm(), u = mx(i ?? r), f = Ut();
  return u ? /* @__PURE__ */ c.jsxs(ie, { className: "dsc-glass dsc-next-rec", title: "Do this next", icon: "alert", children: [
    /* @__PURE__ */ c.jsxs("p", { style: { margin: "0 0 8px" }, children: [
      /* @__PURE__ */ c.jsx("strong", { children: u.label }),
      " — ",
      u.detail
    ] }),
    /* @__PURE__ */ c.jsx(Ue, { primary: !0, onClick: () => f(u.href), children: u.cta })
  ] }) : /* @__PURE__ */ c.jsxs(ie, { className: "dsc-glass dsc-next-rec", title: "Next", icon: "ok", children: [
    /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: "No critical gaps — fly Live or open Twin." }),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-row-actions", children: [
      /* @__PURE__ */ c.jsx(Ue, { primary: !0, onClick: () => f("/live/twin"), children: "Open Twin" }),
      /* @__PURE__ */ c.jsx(Ue, { teal: !0, onClick: () => f("/live/climate"), children: "Climate Want" })
    ] })
  ] });
}
const Ea = "7.1.4-corpus-chip2", Qr = [
  `/local/DSC-HUB.js?v=${Ea}`,
  `/hacsfiles/DSC-HUB/DSC-HUB.js?v=${Ea}`
], Xm = {
  "dsc-catalog-browse-card": [`/local/dsc-catalog-browse-card.js?v=${Ea}`],
  "dsc-build-plant-card": [`/local/dsc-build-plant-card.js?v=${Ea}`],
  "dsc-the-dash-card": [`/local/dsc-the-dash-card.js?v=${Ea}`],
  "dsc-airflow-map-card": [`/local/dsc-airflow-map-card.js?v=${Ea}`],
  "dsc-system-map-card": [
    `/local/dsc-system-map-card.js?v=${Ea}`,
    ...Qr
  ]
}, Xs = /* @__PURE__ */ new Map();
function hm(i) {
  if (document.querySelector(`script[data-dsc-autoload="${i}"]`))
    return Xs.get(i) ?? Promise.resolve();
  if (Xs.has(i)) return Xs.get(i);
  const o = new Promise((u, f) => {
    const h = document.createElement("script");
    h.src = i, h.async = !0, h.dataset.dscAutoload = i, h.onload = () => u(), h.onerror = () => f(new Error(`Failed to load ${i}`)), document.head.appendChild(h);
  });
  return Xs.set(i, o), o;
}
function gx(i) {
  const r = Xm[i] ?? [], o = [];
  for (const u of [...r, ...Qr])
    o.includes(u) || o.push(u);
  return o;
}
async function Qm(i, r = 12e3) {
  const o = Xm[i] ?? [];
  for (const u of o)
    try {
      await hm(u);
    } catch {
    }
  if (customElements.get(i)) return !0;
  for (const u of Qr) {
    try {
      await hm(u);
    } catch {
    }
    if (customElements.get(i)) return !0;
  }
  try {
    return await Promise.race([
      customElements.whenDefined(i),
      new Promise(
        (u, f) => window.setTimeout(() => f(new Error("timeout")), r)
      )
    ]), !!customElements.get(i);
  } catch {
    return !!customElements.get(i);
  }
}
function xx(i) {
  return gx(i).map((r) => r.split("?")[0]);
}
function yx(i) {
  return i === "/live/main" ? "main" : i === "/live/clone" ? "clone" : null;
}
function bx() {
  const i = jt(), { hass: r } = Qe(), o = j.useRef(null), u = j.useRef(
    null
  ), [f, h] = j.useState("loading"), g = yx(i.pathname), x = i.pathname === "/live/twin" || i.pathname === "/ops/dash" || i.pathname === "/live/main" || i.pathname === "/live/clone";
  return j.useEffect(() => {
    const v = o.current;
    if (!v || u.current) return;
    let m = !1;
    return (async () => {
      h("loading");
      const y = await Qm("dsc-the-dash-card");
      if (m || !o.current) return;
      if (!y) {
        h("missing");
        return;
      }
      const b = document.createElement("dsc-the-dash-card");
      typeof b.setConfig == "function" && b.setConfig({ type: "custom:dsc-the-dash-card", focusTent: g }), r && (b.hass = r), v.appendChild(b), u.current = b, h("ready");
    })(), () => {
      m = !0;
    };
  }, []), j.useEffect(() => {
    u.current && r && (u.current.hass = r);
  }, [r]), j.useEffect(() => {
    const v = u.current;
    !v || typeof v.setConfig != "function" || v.setConfig({ type: "custom:dsc-the-dash-card", focusTent: g });
  }, [g, x]), /* @__PURE__ */ c.jsxs(
    "div",
    {
      className: `dsc-twin-keepalive${x ? " is-active" : ""}`,
      "aria-hidden": !x,
      "data-status": f,
      "data-focus-tent": g || "both",
      children: [
        /* @__PURE__ */ c.jsx("div", { className: "dsc-twin-keepalive-host", ref: o }),
        f === "missing" ? /* @__PURE__ */ c.jsxs("div", { className: "dsc-empty", children: [
          /* @__PURE__ */ c.jsx("strong", { children: "dsc-the-dash-card" }),
          " did not register. Deploy /local/DSC-HUB.js and hard-refresh."
        ] }) : null
      ]
    }
  );
}
const Zm = j.createContext(null);
function _x(i) {
  return i === "clone" || i === "compare" || i === "room" || i === "main" ? i : "main";
}
function Sx({ children: i }) {
  const [r, o] = nc(), u = _x(r.get("tent") ?? r.get("zone")), f = j.useCallback(
    (g) => {
      const x = new URLSearchParams(r);
      x.set("tent", g), x.delete("zone"), o(x, { replace: !0 });
    },
    [r, o]
  ), h = j.useMemo(() => ({ focus: u, setFocus: f }), [u, f]);
  return /* @__PURE__ */ c.jsx(Zm.Provider, { value: h, children: i });
}
function $m() {
  const i = j.useContext(Zm);
  return i || {
    focus: "main",
    setFocus: () => {
    }
  };
}
function Zr({
  label: i,
  icon: r,
  onClick: o,
  className: u = ""
}) {
  return /* @__PURE__ */ c.jsx(
    "button",
    {
      type: "button",
      className: `dsc-icon-btn ${u}`.trim(),
      "aria-label": i,
      title: i,
      onClick: o,
      children: /* @__PURE__ */ c.jsx(El, { name: r, size: 16 })
    }
  );
}
function ic({
  items: i,
  label: r = "More actions"
}) {
  const [o, u] = j.useState(!1), f = j.useRef(null);
  return j.useEffect(() => {
    if (!o) return;
    const h = (g) => {
      f.current?.contains(g.target) || u(!1);
    };
    return document.addEventListener("mousedown", h), () => document.removeEventListener("mousedown", h);
  }, [o]), /* @__PURE__ */ c.jsxs("div", { className: "dsc-overflow", ref: f, children: [
    /* @__PURE__ */ c.jsx(Zr, { label: r, icon: "more", onClick: () => u((h) => !h) }),
    o ? /* @__PURE__ */ c.jsx("div", { className: "dsc-overflow-menu", role: "menu", children: i.map((h) => /* @__PURE__ */ c.jsx(
      "button",
      {
        type: "button",
        role: "menuitem",
        onClick: () => {
          u(!1), h.onSelect();
        },
        children: h.label
      },
      h.id
    )) }) : null
  ] });
}
function ji({
  open: i,
  onClose: r,
  title: o,
  side: u = "right",
  children: f
}) {
  const h = j.useId();
  return j.useEffect(() => {
    if (!i) return;
    const g = (x) => {
      x.key === "Escape" && r();
    };
    return window.addEventListener("keydown", g), () => window.removeEventListener("keydown", g);
  }, [i, r]), /* @__PURE__ */ c.jsxs("div", { className: `dsc-drawer-root${i ? " is-open" : ""}`, "aria-hidden": !i, children: [
    /* @__PURE__ */ c.jsx("div", { className: "dsc-drawer-scrim", onClick: r }),
    /* @__PURE__ */ c.jsxs(
      "aside",
      {
        className: `dsc-drawer-panel ${u}`,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": h,
        children: [
          /* @__PURE__ */ c.jsx(
            "button",
            {
              type: "button",
              className: "dsc-drawer-rail",
              "aria-label": "Close panel",
              onClick: r,
              children: u === "right" ? ">" : "<"
            }
          ),
          /* @__PURE__ */ c.jsxs("div", { className: "dsc-drawer-head", children: [
            /* @__PURE__ */ c.jsx("h2", { id: h, children: o }),
            /* @__PURE__ */ c.jsx(Zr, { label: "Close", icon: "close", onClick: r })
          ] }),
          /* @__PURE__ */ c.jsx("div", { className: "dsc-drawer-body", children: f })
        ]
      }
    )
  ] });
}
const mm = [
  "var(--dsc-soil-1)",
  "var(--dsc-soil-2)",
  "var(--dsc-soil-3)",
  "var(--dsc-soil-4)"
];
function jx(i) {
  if (!i || !i.trim()) return [];
  const r = i.split(/[|/·]/).map((u) => u.trim()).filter(Boolean), o = [];
  for (const u of r) {
    const f = u.match(/^(.+?)\s*[·:]?\s*(\d+(?:\.\d+)?)\s*%?$/);
    if (f) {
      o.push({ name: f[1].trim(), pct: Number(f[2]) });
      continue;
    }
    const h = u.match(/(\d+(?:\.\d+)?)\s*%\s*(.+)$/);
    if (h) {
      o.push({ name: h[2].trim(), pct: Number(h[1]) });
      continue;
    }
    u && o.push({ name: u, pct: 0 });
  }
  if (o.length && o.every((u) => u.pct === 0)) {
    const u = 100 / o.length;
    return o.map((f) => ({ ...f, pct: u }));
  }
  return o.filter((u) => u.pct > 0);
}
function wx({
  layers: i,
  valid: r,
  emptyLabel: o = "No blend on roster seat"
}) {
  const u = i.reduce((g, x) => g + x.pct, 0), f = r ?? (i.length > 0 && Math.round(u) === 100);
  let h = 0;
  return /* @__PURE__ */ c.jsx("div", { className: "dsc-soil", children: /* @__PURE__ */ c.jsx("div", { className: `dsc-soil-pot${f && i.length ? " is-valid" : ""}`, children: i.length ? i.map((g, x) => {
    const v = h;
    return h += g.pct, /* @__PURE__ */ c.jsx(
      "div",
      {
        className: "dsc-soil-layer",
        style: {
          bottom: `${v}%`,
          height: `${g.pct}%`,
          background: g.color || mm[x % mm.length]
        },
        title: `${g.name} ${g.pct}%`,
        children: g.pct >= 12 ? `${g.name} ${Math.round(g.pct)}%` : ""
      },
      `${g.name}-${x}`
    );
  }) : /* @__PURE__ */ c.jsx("div", { className: "dsc-soil-empty", children: o }) }) });
}
const Nx = {
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
function gi({
  entityId: i,
  label: r,
  step: o
}) {
  const { num: u, available: f, callService: h, entity: g } = Qe(), x = f(i), v = g(i), m = u(i, NaN), y = Number(v?.attributes?.min ?? 0), b = Number(v?.attributes?.max ?? 100), N = o ?? Number(v?.attributes?.step ?? 0.1), [L, G] = j.useState(String(Number.isFinite(m) ? m : ""));
  j.useEffect(() => {
    Number.isFinite(m) && G(String(m));
  }, [m]);
  const Y = () => {
    if (!x) return;
    const O = Number(L);
    if (!Number.isFinite(O)) {
      G(String(Number.isFinite(m) ? m : ""));
      return;
    }
    const V = Math.min(b, Math.max(y, O));
    h("number", "set_value", { entity_id: i, value: V }), G(String(V));
  };
  return /* @__PURE__ */ c.jsxs("label", { className: `dsc-target-num${x ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ c.jsx("span", { className: "dsc-target-num-label", children: r }),
    /* @__PURE__ */ c.jsx(
      "input",
      {
        type: "number",
        value: L,
        disabled: !x,
        min: y,
        max: b,
        step: N,
        onChange: (O) => G(O.target.value),
        onBlur: Y,
        onKeyDown: (O) => {
          O.key === "Enter" && O.target.blur();
        }
      }
    )
  ] });
}
function Ex({ tent: i, title: r }) {
  const { num: o, available: u } = Qe(), f = Nx[i], h = o(f.gotTemp), g = o(f.gotRh), x = u(f.gotVpd) ? o(f.gotVpd) : NaN, v = o(f.temp), m = o(f.rhMin), y = o(f.rhMax), b = (N) => {
    const L = new CustomEvent("hass-more-info", {
      detail: { entityId: N },
      bubbles: !0,
      composed: !0
    });
    document.querySelector("home-assistant")?.dispatchEvent(L);
  };
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-tent-targets", children: [
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-tent-targets-head", children: [
      /* @__PURE__ */ c.jsx("strong", { children: r }),
      /* @__PURE__ */ c.jsx(
        ic,
        {
          label: `${r} more`,
          items: [
            {
              id: "temp",
              label: "More info · temp target",
              onSelect: () => b(f.temp)
            },
            {
              id: "rh",
              label: "More info · RH band",
              onSelect: () => b(f.rhMin)
            },
            {
              id: "vpd",
              label: "More info · VPD band",
              onSelect: () => b(f.vpdMin)
            }
          ]
        }
      )
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-got-want", children: [
      /* @__PURE__ */ c.jsxs("span", { children: [
        "Got ",
        Number.isFinite(h) ? h.toFixed(1) : "—",
        "°C /",
        " ",
        Number.isFinite(g) ? g.toFixed(0) : "—",
        "%",
        Number.isFinite(x) ? ` / ${x.toFixed(2)} kPa` : ""
      ] }),
      /* @__PURE__ */ c.jsxs("span", { className: "dsc-muted", children: [
        "Want ",
        Number.isFinite(v) ? v.toFixed(1) : "—",
        "°C · RH",
        " ",
        Number.isFinite(m) ? m.toFixed(0) : "—",
        "–",
        Number.isFinite(y) ? y.toFixed(0) : "—",
        "%"
      ] })
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-target-grid", children: [
      /* @__PURE__ */ c.jsx(gi, { entityId: f.temp, label: "Temp °C", step: 0.5 }),
      /* @__PURE__ */ c.jsx(gi, { entityId: f.rhMin, label: "RH min %", step: 1 }),
      /* @__PURE__ */ c.jsx(gi, { entityId: f.rhMax, label: "RH max %", step: 1 }),
      /* @__PURE__ */ c.jsx(gi, { entityId: f.vpdMin, label: "VPD min", step: 0.01 }),
      /* @__PURE__ */ c.jsx(gi, { entityId: f.vpdMax, label: "VPD max", step: 0.01 })
    ] })
  ] });
}
function $r({
  compact: i,
  emphasize: r,
  only: o
}) {
  const u = o ? [o] : r === "clone" ? ["clone", "main"] : ["main", "clone"];
  return /* @__PURE__ */ c.jsx("div", { className: `dsc-target-panel${i ? " is-compact" : ""}`, children: u.map((f) => /* @__PURE__ */ c.jsx(Ex, { tent: f, title: f === "main" ? "Main 4×8" : "Clone 2×4" }, f)) });
}
function Mx(i) {
  if (typeof i.lu == "number" && Number.isFinite(i.lu))
    return i.lu * 1e3;
  const r = i.last_changed || i.last_updated;
  if (r) {
    const o = Date.parse(r);
    return Number.isFinite(o) ? o : null;
  }
  return null;
}
function Cx(i) {
  const r = i.s ?? i.state, o = typeof r == "number" ? r : Number(r);
  return Number.isFinite(o) ? o : null;
}
function Tx(i, r) {
  if (i.length <= r) return i;
  const o = [], u = (i.length - 1) / (r - 1);
  for (let f = 0; f < r; f++)
    o.push(i[Math.round(f * u)]);
  return o;
}
function Rx(i, r = 6, o = 96) {
  const { hass: u, callWS: f, available: h } = Qe(), [g, x] = j.useState([]), [v, m] = j.useState(!0), [y, b] = j.useState(null);
  return j.useEffect(() => {
    let N = !1;
    async function L() {
      if (!i) {
        x([]), m(!1);
        return;
      }
      if (!u || !u.callWS && !u.connection) {
        x([]), m(!1);
        return;
      }
      m(!0), b(null);
      const G = /* @__PURE__ */ new Date(), Y = new Date(G.getTime() - r * 3600 * 1e3);
      try {
        const O = await f({
          type: "history/history_during_period",
          start_time: Y.toISOString(),
          end_time: G.toISOString(),
          significant_changes_only: !1,
          minimal_response: !0,
          no_attributes: !0,
          entity_ids: [i]
        });
        if (N) return;
        if (O == null) {
          x([]), b("history unavailable");
          return;
        }
        let V = [];
        Array.isArray(O) ? V = O[0] || [] : O && typeof O == "object" && (V = O[i] || []);
        const $ = [];
        for (const q of V) {
          const le = Mx(q), se = Cx(q);
          le == null || se == null || $.push({ t: le, v: se });
        }
        $.sort((q, le) => q.t - le.t), x(Tx($, o));
      } catch (O) {
        N || (b(O instanceof Error ? O.message : "history unavailable"), x([]));
      } finally {
        N || m(!1);
      }
    }
    return L(), () => {
      N = !0;
    };
  }, [u, f, i, r, o, h]), { points: g, loading: v, error: y };
}
function Re(i, r) {
  const o = r?.maxPoints ?? 96, u = r?.hours ?? 6, { num: f, available: h, tick: g } = Qe(), { points: x } = Rx(i, u, o), [v, m] = j.useState([]), [y, b] = j.useState(void 0), N = j.useRef(null), L = j.useRef(!1);
  return j.useEffect(() => {
    L.current = !1, m([]), N.current = null, b(void 0);
  }, [i, u, o]), j.useEffect(() => {
    if (x.length && !L.current) {
      L.current = !0;
      const Y = x[x.length - 1]?.v;
      Number.isFinite(Y) && (N.current = Y);
    }
  }, [x]), j.useEffect(() => {
    if (!i || !h(i)) return;
    const Y = f(i);
    if (!Number.isFinite(Y)) return;
    if (N.current === Y && v.length > 0) {
      const V = Date.now(), $ = v[v.length - 1]?.t ?? 0;
      if (V - $ < 4e3) return;
    }
    N.current = Y;
    const O = Date.now();
    m((V) => [...V, { t: O, v: Y }].slice(-o)), b(O);
  }, [i, g, h, f, o]), { series: j.useMemo(() => {
    if (!x.length && !v.length) return v;
    if (!v.length) return x;
    if (!x.length) return v;
    const Y = v[0]?.t ?? 0, V = [...x.filter(($) => $.t < Y - 500), ...v];
    return V.length > o ? V.slice(-o) : V;
  }, [x, v, o]), lastSyncAt: y };
}
const Km = [1, 6, 24, 48], Jm = "dsc_chart_hours";
function Ax() {
  try {
    const i = sessionStorage.getItem(Jm), r = Number(i);
    if (Km.includes(r)) return r;
  } catch {
  }
  return 6;
}
function sc(i = 6) {
  const [r, o] = j.useState(() => Ax() || i), u = j.useCallback((h) => {
    o(h);
    try {
      sessionStorage.setItem(Jm, String(h));
    } catch {
    }
  }, []), f = r <= 1 ? 60 : r <= 6 ? 96 : r <= 24 ? 144 : 192;
  return { hours: r, setHours: u, maxPoints: f };
}
const Qs = [
  "var(--dsc-neon)",
  "var(--dsc-teal)",
  "var(--dsc-amber)",
  "var(--dsc-gray-5)"
];
function pm(i) {
  const r = Math.max(...i, 1), o = 10 ** Math.floor(Math.log10(r));
  return Math.ceil(r / o) * o;
}
function vm(i, r = !1) {
  const o = Math.min(...i);
  if (r && o >= 0) return 0;
  const u = Math.abs(o) || 1, f = 10 ** Math.floor(Math.log10(u));
  return Math.floor(o / f) * f;
}
function gm(i, r, o = 0.08) {
  if (!Number.isFinite(i) || !Number.isFinite(r)) return { min: 0, max: 1 };
  if (r <= i) return { min: i - 1, max: r + 1 };
  const f = (r - i) * o || 1;
  return { min: i - f, max: r + f };
}
function zx(i, r, o, u, f, h, g, x) {
  if (!i.length) return "";
  const v = Math.max(h - f, 1e-6), m = Math.max(x - g, 1), y = r - u.l - u.r, b = o - u.t - u.b;
  return i.map((N, L) => {
    const G = u.l + (N.t - g) / m * y, Y = u.t + (1 - (N.v - f) / v) * b;
    return `${L === 0 ? "M" : "L"}${G.toFixed(1)} ${Y.toFixed(1)}`;
  }).join(" ");
}
function xm(i) {
  const r = new Date(i), o = String(r.getHours()).padStart(2, "0"), u = String(r.getMinutes()).padStart(2, "0");
  return `${o}:${u}`;
}
function xi(i, r, o, u, f) {
  const h = Math.max(o - r, 1e-6);
  return f.t + (1 - (i - r) / h) * (u - f.t - f.b);
}
function ym(i, r, o) {
  const u = i.filter((f) => (f.axis || "left") === r).flatMap((f) => f.series.map((h) => h.v));
  if (!u.length)
    return r === "right" ? { min: 0, max: 100 } : { min: 0, max: 1 };
  if (r === "right") {
    const f = Math.min(...u, 0);
    return Math.max(...u, 100) <= 100 && f >= 0 ? { min: 0, max: 100 } : gm(vm(u, !0), pm(u));
  }
  return gm(vm(u), pm(u));
}
function Dt({
  series: i,
  height: r = 180,
  unit: o = "",
  live: u = !0,
  emptyLabel: f = "No history yet",
  lastSyncAt: h,
  targets: g = []
}) {
  const x = j.useId().replace(/:/g, ""), v = 640, m = i.some((z) => z.axis === "right"), y = { l: 40, r: m ? 40 : 14, t: 16, b: 28 }, b = j.useRef(null), [N, L] = j.useState(null), [G, Y] = j.useState(!1), [O, V] = j.useState(0), $ = j.useRef(void 0);
  j.useEffect(() => {
    h != null && $.current !== h && ($.current = h, V((z) => z + 1));
  }, [h]);
  const q = j.useMemo(() => {
    const z = i.flatMap((P) => P.series);
    if (!z.length) return null;
    const te = ym(i, "left"), ee = ym(i, "right"), M = Math.min(...z.map((P) => P.t)), U = Math.max(...z.map((P) => P.t)), Q = i.map((P, ue) => {
      const S = P.axis || "left", D = S === "right" ? ee : te;
      return {
        ...P,
        axis: S,
        color: P.color || Qs[ue % Qs.length],
        d: zx(P.series, v, r, y, D.min, D.max, M, U),
        last: P.series.length ? P.series[P.series.length - 1] : null,
        dom: D
      };
    });
    return { left: te, right: ee, t0: M, t1: U, paths: Q };
  }, [i, r, m]), le = j.useMemo(() => {
    if (!q) return [];
    const z = 4, te = [];
    for (let ee = 0; ee <= z; ee++) {
      const M = ee / z, U = q.left.max - M * (q.left.max - q.left.min), Q = y.t + M * (r - y.t - y.b);
      te.push({ y: Q, label: U.toFixed(Math.abs(U) >= 100 ? 0 : 1) });
    }
    return te;
  }, [q, r]), se = j.useMemo(() => {
    if (!q || !m) return [];
    const z = 4, te = [];
    for (let ee = 0; ee <= z; ee++) {
      const M = ee / z, U = q.right.max - M * (q.right.max - q.right.min), Q = y.t + M * (r - y.t - y.b);
      te.push({ y: Q, label: U.toFixed(Math.abs(U) >= 100 ? 0 : 1) });
    }
    return te;
  }, [q, r, m]), re = j.useMemo(() => {
    if (!q) return [];
    const z = 5, te = [], ee = Math.max(q.t1 - q.t0, 1), M = v - y.l - y.r;
    for (let U = 0; U < z; U++) {
      const Q = U / (z - 1), P = q.t0 + Q * ee;
      te.push({ x: y.l + Q * M, label: xm(P) });
    }
    return te;
  }, [q]), F = j.useCallback(
    (z) => {
      const te = b.current;
      if (!te || !q) return null;
      const ee = te.getBoundingClientRect(), M = (z - ee.left) / Math.max(ee.width, 1) * v, U = v - y.l - y.r, Q = Math.min(v - y.r, Math.max(y.l, M)), P = (Q - y.l) / Math.max(U, 1);
      return { t: q.t0 + P * Math.max(q.t1 - q.t0, 1), x: Q };
    },
    [q]
  ), oe = (z) => {
    if (G) return;
    const te = F(z.clientX);
    te && L(te);
  }, pe = () => {
    G || L(null);
  }, _e = (z) => {
    const te = F(z.clientX);
    if (te) {
      if (G && N && Math.abs(N.x - te.x) < 8) {
        Y(!1), L(null);
        return;
      }
      Y(!0), L(te);
    }
  }, Ee = j.useMemo(() => !q || !N ? [] : q.paths.map((z) => {
    if (!z.series.length) return { id: z.id, label: z.label, color: z.color, v: null, unit: z.unit || "" };
    let te = z.series[0], ee = Math.abs(te.t - N.t);
    for (const U of z.series) {
      const Q = Math.abs(U.t - N.t);
      Q < ee && (te = U, ee = Q);
    }
    const M = xi(te.v, z.dom.min, z.dom.max, r, y);
    return {
      id: z.id,
      label: z.label,
      color: z.color,
      v: te.v,
      unit: z.unit || "",
      y: M,
      x: y.l + (te.t - q.t0) / Math.max(q.t1 - q.t0, 1) * (v - y.l - y.r)
    };
  }), [q, N, r]), Se = q?.paths[0]?.last?.v ?? null;
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-chart", style: { position: "relative", width: "100%" }, children: [
    /* @__PURE__ */ c.jsxs(
      "svg",
      {
        ref: b,
        viewBox: `0 0 ${v} ${r}`,
        width: "100%",
        height: r,
        role: "img",
        "aria-label": "Live chart",
        className: "dsc-chart-svg",
        onPointerMove: oe,
        onPointerLeave: pe,
        onPointerDown: _e,
        children: [
          /* @__PURE__ */ c.jsxs("defs", { children: [
            q?.paths.map((z) => /* @__PURE__ */ c.jsxs("linearGradient", { id: `fill-${x}-${z.id}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ c.jsx("stop", { offset: "0%", stopColor: z.color, stopOpacity: "0.28" }),
              /* @__PURE__ */ c.jsx("stop", { offset: "100%", stopColor: z.color, stopOpacity: "0" })
            ] }, z.id)),
            /* @__PURE__ */ c.jsxs("filter", { id: `glow-${x}`, x: "-40%", y: "-40%", width: "180%", height: "180%", children: [
              /* @__PURE__ */ c.jsx("feGaussianBlur", { stdDeviation: "2.8", result: "b" }),
              /* @__PURE__ */ c.jsxs("feMerge", { children: [
                /* @__PURE__ */ c.jsx("feMergeNode", { in: "b" }),
                /* @__PURE__ */ c.jsx("feMergeNode", { in: "SourceGraphic" })
              ] })
            ] }),
            /* @__PURE__ */ c.jsxs("filter", { id: `glow-soft-${x}`, x: "-50%", y: "-50%", width: "200%", height: "200%", children: [
              /* @__PURE__ */ c.jsx("feGaussianBlur", { stdDeviation: "4.2", result: "b" }),
              /* @__PURE__ */ c.jsx("feMerge", { children: /* @__PURE__ */ c.jsx("feMergeNode", { in: "b" }) })
            ] })
          ] }),
          le.map((z) => /* @__PURE__ */ c.jsxs("g", { children: [
            /* @__PURE__ */ c.jsx(
              "line",
              {
                x1: y.l,
                x2: v - y.r,
                y1: z.y,
                y2: z.y,
                stroke: "var(--dsc-gray-3)",
                strokeWidth: "1",
                strokeDasharray: "3 4"
              }
            ),
            /* @__PURE__ */ c.jsx(
              "text",
              {
                x: y.l - 6,
                y: z.y + 3,
                textAnchor: "end",
                fill: "var(--dsc-gray-5)",
                fontSize: "9",
                fontFamily: "var(--dsc-mono)",
                children: z.label
              }
            )
          ] }, `L${z.y}`)),
          se.map((z) => /* @__PURE__ */ c.jsx(
            "text",
            {
              x: v - y.r + 6,
              y: z.y + 3,
              textAnchor: "start",
              fill: "var(--dsc-teal)",
              fontSize: "9",
              fontFamily: "var(--dsc-mono)",
              opacity: 0.85,
              children: z.label
            },
            `R${z.y}`
          )),
          re.map((z) => /* @__PURE__ */ c.jsx(
            "text",
            {
              x: z.x,
              y: r - 8,
              textAnchor: "middle",
              fill: "var(--dsc-gray-5)",
              fontSize: "9",
              fontFamily: "var(--dsc-mono)",
              children: z.label
            },
            z.x
          )),
          q ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
            g.map((z, te) => {
              const ee = z.axis || "left", M = ee === "right" ? q.right : q.left, U = z.color || (ee === "right" ? "var(--dsc-teal)" : "var(--dsc-amber)");
              if (z.min != null && z.max != null) {
                const P = xi(z.max, M.min, M.max, r, y), ue = xi(z.min, M.min, M.max, r, y);
                return /* @__PURE__ */ c.jsxs("g", { children: [
                  /* @__PURE__ */ c.jsx(
                    "rect",
                    {
                      x: y.l,
                      y: Math.min(P, ue),
                      width: v - y.l - y.r,
                      height: Math.abs(ue - P),
                      fill: U,
                      opacity: 0.08
                    }
                  ),
                  /* @__PURE__ */ c.jsx(
                    "line",
                    {
                      x1: y.l,
                      x2: v - y.r,
                      y1: P,
                      y2: P,
                      stroke: U,
                      strokeWidth: "1",
                      strokeDasharray: "4 4",
                      opacity: 0.7
                    }
                  ),
                  /* @__PURE__ */ c.jsx(
                    "line",
                    {
                      x1: y.l,
                      x2: v - y.r,
                      y1: ue,
                      y2: ue,
                      stroke: U,
                      strokeWidth: "1",
                      strokeDasharray: "4 4",
                      opacity: 0.7
                    }
                  )
                ] }, `tg-${te}`);
              }
              if (z.value == null || !Number.isFinite(z.value)) return null;
              const Q = xi(z.value, M.min, M.max, r, y);
              return /* @__PURE__ */ c.jsxs("g", { children: [
                /* @__PURE__ */ c.jsx(
                  "line",
                  {
                    x1: y.l,
                    x2: v - y.r,
                    y1: Q,
                    y2: Q,
                    stroke: U,
                    strokeWidth: "1.2",
                    strokeDasharray: "5 4",
                    opacity: 0.85
                  }
                ),
                z.label ? /* @__PURE__ */ c.jsx(
                  "text",
                  {
                    x: v - y.r - 2,
                    y: Q - 4,
                    textAnchor: "end",
                    fill: U,
                    fontSize: "8",
                    fontFamily: "var(--dsc-mono)",
                    children: z.label
                  }
                ) : null
              ] }, `tg-${te}`);
            }),
            q.paths.map((z) => {
              if (!z.d || z.series.length === 0) return null;
              const te = z.series.length >= 2 ? `${z.d} L${v - y.r} ${r - y.b} L${y.l} ${r - y.b} Z` : "", ee = z.last, M = ee && q ? y.l + (ee.t - q.t0) / Math.max(q.t1 - q.t0, 1) * (v - y.l - y.r) : 0, U = ee ? xi(ee.v, z.dom.min, z.dom.max, r, y) : 0;
              return /* @__PURE__ */ c.jsxs("g", { className: "dsc-chart-series", children: [
                te ? /* @__PURE__ */ c.jsx("path", { d: te, fill: `url(#fill-${x}-${z.id})`, opacity: 0.9, className: "dsc-chart-fill" }) : null,
                /* @__PURE__ */ c.jsx(
                  "path",
                  {
                    d: z.d,
                    fill: "none",
                    stroke: z.color,
                    strokeWidth: "4.5",
                    strokeLinejoin: "round",
                    strokeLinecap: "round",
                    filter: `url(#glow-soft-${x})`,
                    opacity: 0.35,
                    className: "dsc-chart-glow"
                  }
                ),
                /* @__PURE__ */ c.jsx(
                  "path",
                  {
                    d: z.d,
                    fill: "none",
                    stroke: z.color,
                    strokeWidth: "2.2",
                    strokeLinejoin: "round",
                    strokeLinecap: "round",
                    filter: `url(#glow-${x})`,
                    opacity: 0.95,
                    className: "dsc-chart-core"
                  }
                ),
                u && ee && z.series.length >= 2 ? /* @__PURE__ */ c.jsxs("g", { className: "dsc-chart-pulse-wrap", children: [
                  /* @__PURE__ */ c.jsx(
                    "path",
                    {
                      className: "dsc-chart-pulse",
                      d: z.d,
                      fill: "none",
                      stroke: z.color,
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
                  /* @__PURE__ */ c.jsx(
                    "circle",
                    {
                      cx: M,
                      cy: U,
                      r: 4,
                      fill: z.color,
                      className: "dsc-chart-tip",
                      filter: `url(#glow-${x})`
                    }
                  )
                ] }, `pulse-${O}-${z.id}`) : ee ? /* @__PURE__ */ c.jsx("circle", { cx: M, cy: U, r: 3.2, fill: z.color, opacity: 0.9 }) : null
              ] }, z.id);
            }),
            N ? /* @__PURE__ */ c.jsxs("g", { className: "dsc-chart-crosshair", children: [
              /* @__PURE__ */ c.jsx(
                "line",
                {
                  x1: N.x,
                  x2: N.x,
                  y1: y.t,
                  y2: r - y.b,
                  stroke: "var(--dsc-white)",
                  strokeOpacity: 0.35,
                  strokeWidth: "1"
                }
              ),
              Ee.map(
                (z) => z.v == null || z.y == null ? null : /* @__PURE__ */ c.jsx(
                  "circle",
                  {
                    cx: z.x ?? N.x,
                    cy: z.y,
                    r: 4,
                    fill: z.color,
                    stroke: "var(--dsc-black)",
                    strokeWidth: "1"
                  },
                  z.id
                )
              )
            ] }) : null
          ] }) : /* @__PURE__ */ c.jsx(
            "text",
            {
              x: v / 2,
              y: r / 2,
              textAnchor: "middle",
              fill: "var(--dsc-gray-5)",
              fontSize: "12",
              children: f
            }
          )
        ]
      }
    ),
    N && q ? /* @__PURE__ */ c.jsxs(
      "div",
      {
        className: "dsc-chart-tooltip",
        style: {
          left: `${Math.min(92, Math.max(8, N.x / v * 100))}%`
        },
        children: [
          /* @__PURE__ */ c.jsx("div", { className: "dsc-chart-tooltip-time", children: xm(N.t) }),
          Ee.map(
            (z) => z.v == null ? null : /* @__PURE__ */ c.jsxs("div", { className: "dsc-chart-tooltip-row", children: [
              /* @__PURE__ */ c.jsx("i", { style: { background: z.color } }),
              /* @__PURE__ */ c.jsxs("span", { children: [
                z.label || z.id,
                " ",
                z.v.toFixed(z.v >= 100 ? 0 : 1),
                z.unit ? ` ${z.unit}` : ""
              ] })
            ] }, z.id)
          )
        ]
      }
    ) : null,
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-chart-legend", children: [
      i.filter((z) => z.label).map((z, te) => /* @__PURE__ */ c.jsxs("span", { className: "dsc-chart-legend-item", children: [
        /* @__PURE__ */ c.jsx("i", { style: { background: z.color || Qs[te % Qs.length] } }),
        z.label
      ] }, z.id)),
      Se != null ? /* @__PURE__ */ c.jsxs("span", { className: "dsc-chart-last", children: [
        Se.toFixed(1),
        o ? ` ${o}` : i[0]?.unit ? ` ${i[0].unit}` : ""
      ] }) : null
    ] })
  ] });
}
function Ox(i, r = 280) {
  const [o, u] = j.useState(i);
  return j.useEffect(() => {
    if (!Number.isFinite(i)) {
      u(i);
      return;
    }
    const f = Number.isFinite(o) ? o : i, h = performance.now();
    let g = 0;
    const x = (v) => {
      const m = Math.min(1, (v - h) / r), y = 1 - (1 - m) ** 3;
      u(f + (i - f) * y), m < 1 && (g = requestAnimationFrame(x));
    };
    return g = requestAnimationFrame(x), () => cancelAnimationFrame(g);
  }, [i, r]), o;
}
function bm(i, r, o, u) {
  return { x: i + o * Math.cos(u), y: r + o * Math.sin(u) };
}
function St({
  value: i,
  min: r = 0,
  max: o = 100,
  label: u,
  unit: f = "",
  target: h,
  band: g,
  extrema: x,
  stale: v,
  onClick: m
}) {
  const y = Number.isFinite(i) ? i : NaN, b = Ox(Number.isFinite(y) ? y : r), N = Number.isFinite(y) ? b : r, L = Math.min(o, Math.max(r, N)), G = Math.max(o - r, 1e-6), Y = Number.isFinite(y) ? (L - r) / G : 0, O = 46, V = 2 * Math.PI * O * 0.75, $ = V * Y, q = (oe) => {
    const pe = Math.min(1, Math.max(0, (oe - r) / G));
    return Math.PI - pe * Math.PI;
  }, le = g && Number.isFinite(y) ? y >= g.min && y <= g.max : !0, se = Number.isFinite(y) ? v ? "var(--dsc-amber)" : le ? "var(--dsc-teal)" : "var(--dsc-amber)" : "var(--dsc-gray-4)", re = [];
  g && re.push({ v: g.min, kind: "band" }, { v: g.max, kind: "band" }), x?.min != null && re.push({ v: x.min, kind: "ext" }), x?.max != null && re.push({ v: x.max, kind: "ext" }), h != null && Number.isFinite(h) && re.push({ v: h, kind: "target" });
  const F = /* @__PURE__ */ c.jsxs(
    "div",
    {
      className: `dsc-gauge${!le && Number.isFinite(y) ? " is-warn" : ""}${v ? " is-stale" : ""}${m ? " is-clickable" : ""}`,
      children: [
        /* @__PURE__ */ c.jsxs("svg", { viewBox: "0 0 120 90", width: "140", height: "105", "aria-label": u, children: [
          /* @__PURE__ */ c.jsx("defs", { children: /* @__PURE__ */ c.jsxs("filter", { id: "dsc-gauge-glow", x: "-40%", y: "-40%", width: "180%", height: "180%", children: [
            /* @__PURE__ */ c.jsx("feGaussianBlur", { stdDeviation: "3.2", result: "b" }),
            /* @__PURE__ */ c.jsxs("feMerge", { children: [
              /* @__PURE__ */ c.jsx("feMergeNode", { in: "b" }),
              /* @__PURE__ */ c.jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] }) }),
          /* @__PURE__ */ c.jsx(
            "path",
            {
              d: "M18 72 A46 46 0 1 1 102 72",
              fill: "none",
              stroke: "var(--dsc-gray-3)",
              strokeWidth: "10",
              strokeLinecap: "round"
            }
          ),
          /* @__PURE__ */ c.jsx(
            "path",
            {
              d: "M18 72 A46 46 0 1 1 102 72",
              fill: "none",
              stroke: se,
              strokeWidth: "10",
              strokeLinecap: "round",
              strokeDasharray: `${$} ${V}`,
              filter: "url(#dsc-gauge-glow)",
              style: { transition: "stroke-dasharray 220ms ease, stroke 220ms ease" }
            }
          ),
          re.map((oe, pe) => {
            const _e = q(oe.v), Ee = bm(60, 72, oe.kind === "ext" ? O - 2 : O + 1, _e), Se = bm(60, 72, O - (oe.kind === "target" ? 14 : 10), _e), z = oe.kind === "target" ? "var(--dsc-teal)" : oe.kind === "band" ? "var(--dsc-amber)" : "var(--dsc-gray-5)";
            return /* @__PURE__ */ c.jsx(
              "line",
              {
                x1: Se.x,
                y1: Se.y,
                x2: Ee.x,
                y2: Ee.y,
                stroke: z,
                strokeWidth: oe.kind === "target" ? 2.4 : 1.6,
                strokeLinecap: "round",
                opacity: oe.kind === "ext" ? 0.65 : 0.95
              },
              `${oe.kind}-${pe}`
            );
          }),
          /* @__PURE__ */ c.jsx(
            "text",
            {
              x: "60",
              y: "58",
              textAnchor: "middle",
              fill: "var(--dsc-white)",
              fontSize: "20",
              fontWeight: "700",
              fontFamily: "var(--dsc-mono)",
              children: Number.isFinite(y) ? y.toFixed(y >= 100 ? 0 : y < 10 ? 2 : 1) : "—"
            }
          ),
          /* @__PURE__ */ c.jsx("text", { x: "60", y: "74", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: v ? "HELD" : f })
        ] }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-gauge-label", children: u })
      ]
    }
  );
  return m ? /* @__PURE__ */ c.jsx("button", { type: "button", className: "dsc-gauge-hit", onClick: m, title: `History · ${u}`, children: F }) : F;
}
function wa({
  series: i,
  color: r = "var(--dsc-blue)",
  width: o = 120,
  height: u = 28
}) {
  if (i.length < 2)
    return /* @__PURE__ */ c.jsx("div", { className: "dsc-sparkline dsc-muted", style: { width: o, height: u } });
  const f = i.map((N) => N.v), h = Math.min(...f), g = Math.max(...f), x = Math.max(g - h, 1e-6), v = i[0].t, m = i[i.length - 1].t, y = Math.max(m - v, 1), b = i.map((N, L) => {
    const G = (N.t - v) / y * o, Y = u - (N.v - h) / x * (u - 4) - 2;
    return `${L === 0 ? "M" : "L"}${G.toFixed(1)} ${Y.toFixed(1)}`;
  }).join(" ");
  return /* @__PURE__ */ c.jsx("svg", { className: "dsc-sparkline", width: o, height: u, "aria-hidden": !0, children: /* @__PURE__ */ c.jsx("path", { d: b, fill: "none", stroke: r, strokeWidth: "1.6", strokeLinecap: "round" }) });
}
function Dx({
  rows: i
}) {
  return /* @__PURE__ */ c.jsx("div", { className: "dsc-gotwant", children: i.map((r) => {
    const o = r.want != null ? r.want : r.wantMin != null && r.wantMax != null ? (r.wantMin + r.wantMax) / 2 : NaN, u = Math.max(
      Number.isFinite(r.got) ? r.got : 0,
      Number.isFinite(o) ? o : 0,
      r.wantMax ?? 0,
      1
    ), f = Number.isFinite(r.got) ? r.got / u * 100 : 0, h = Number.isFinite(o) ? o / u * 100 : 0;
    return /* @__PURE__ */ c.jsxs("div", { className: "dsc-gotwant-row", children: [
      /* @__PURE__ */ c.jsx("div", { className: "dsc-gotwant-label", children: r.label }),
      /* @__PURE__ */ c.jsxs("div", { className: "dsc-gotwant-track", children: [
        Number.isFinite(o) ? /* @__PURE__ */ c.jsx("div", { className: "dsc-gotwant-want", style: { width: `${h}%` } }) : null,
        /* @__PURE__ */ c.jsx("div", { className: "dsc-gotwant-got", style: { width: `${f}%` } })
      ] }),
      /* @__PURE__ */ c.jsxs("div", { className: "dsc-gotwant-vals", children: [
        /* @__PURE__ */ c.jsxs("span", { children: [
          "Got ",
          Number.isFinite(r.got) ? r.got.toFixed(1) : "—",
          r.unit || ""
        ] }),
        /* @__PURE__ */ c.jsxs("span", { className: "dsc-muted", children: [
          "Want",
          " ",
          r.wantMin != null && r.wantMax != null ? `${r.wantMin}–${r.wantMax}` : Number.isFinite(o) ? o.toFixed(1) : "—"
        ] })
      ] })
    ] }, r.label);
  }) });
}
function Is(i) {
  if (!i.length) return {};
  let r = i[0].v, o = i[0].v;
  for (const u of i)
    u.v < r && (r = u.v), u.v > o && (o = u.v);
  return { min: r, max: o };
}
function cc({
  hours: i,
  setHours: r
}) {
  return /* @__PURE__ */ c.jsx("div", { className: "dsc-timespan", role: "group", "aria-label": "Chart timespan", children: Km.map((o) => /* @__PURE__ */ c.jsxs(
    "button",
    {
      type: "button",
      className: `dsc-chip${i === o ? " dsc-chip--ok" : ""}`,
      onClick: () => r(o),
      children: [
        o,
        "h"
      ]
    },
    o
  )) });
}
function Kr({
  open: i,
  onClose: r,
  entityId: o,
  label: u,
  unit: f = "",
  color: h = "var(--dsc-blue)"
}) {
  const { hours: g, setHours: x, maxPoints: v } = sc(6), m = Re(o || "", { hours: g, maxPoints: v }), y = !o || m.series.length < 2;
  return /* @__PURE__ */ c.jsxs(
    ji,
    {
      open: i && !!o,
      onClose: r,
      title: u ? `History · ${u}` : "History",
      children: [
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: [
          /* @__PURE__ */ c.jsx(cc, { hours: g, setHours: x }),
          y ? /* @__PURE__ */ c.jsx(W, { label: "Thin recorder", tone: "warn" }) : null
        ] }),
        o ? /* @__PURE__ */ c.jsx(
          Dt,
          {
            live: !0,
            unit: f,
            lastSyncAt: m.lastSyncAt,
            series: [
              {
                id: o,
                label: u,
                series: m.series,
                color: h,
                unit: f
              }
            ]
          }
        ) : null,
        /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { marginTop: 10, fontSize: 12 }, children: o })
      ]
    }
  );
}
const Fm = "sensor.dsc_hub_uptime", Wm = "sensor.dsc_hub_heartbeat";
function tt(i) {
  const { num: r, available: o, tick: u, entity: f } = Qe(), h = j.useRef(null), [, g] = j.useState(0), x = !o(Fm) || !o(Wm), v = o(i), m = r(i);
  return j.useEffect(() => {
    if (v && Number.isFinite(m)) {
      if (x && m === 0 && h.current != null) {
        g((y) => y + 1);
        return;
      }
      h.current = { value: m, at: Date.now() }, g((y) => y + 1);
      return;
    }
    g((y) => y + 1);
  }, [i, v, m, x, u, f]), v && Number.isFinite(m) && !(x && m === 0 && h.current != null) ? { value: m, stale: !1, heldAt: h.current?.at, live: !0 } : h.current != null ? {
    value: h.current.value,
    stale: !0,
    heldAt: h.current.at,
    live: !1
  } : { value: NaN, stale: !v, heldAt: void 0, live: !1 };
}
function Jr(i) {
  const { available: r, entity: o, tick: u } = Qe();
  if (r(i)) return null;
  const f = o(i)?.last_changed;
  if (!f) return null;
  const h = Date.parse(f);
  return Number.isFinite(h) ? Date.now() - h : null;
}
function kx() {
  return Jr(Fm);
}
function Hx() {
  return Jr(Wm);
}
function Ux() {
  return Jr("binary_sensor.dsc_hub_panel_link");
}
function Js(i) {
  if (!Number.isFinite(i) || i < 0) return "—";
  const r = Math.floor(i / 1e3);
  if (r < 60) return `${Math.max(1, r)}S`;
  const o = Math.floor(r / 60);
  if (o < 60) return `${o}M`;
  const u = Math.floor(o / 60), f = o % 60;
  return u < 48 ? f > 0 ? `${u}H ${f}M` : `${u}H` : `${(u / 24).toFixed(1)}D`;
}
function Bx(i) {
  return !Number.isFinite(i) || i <= 0 ? "—" : Js(i * 1e3);
}
function ft(i, r = "—") {
  return !i || i === "unknown" || i === "unavailable" || i === "none" ? r : i;
}
function Pm(i, r) {
  const o = i(`input_select.dsc_pot${r}_tent`, "unassigned");
  return o === "clone" || o === "main" || o === "unassigned" ? o : "unassigned";
}
function uc(i) {
  switch (i) {
    case "clone":
      return "Clone 2×4";
    case "main":
      return "Main 4×8";
    case "unassigned":
      return "Unassigned";
    default:
      return i;
  }
}
function wi(i, r) {
  const { state: o, entity: u } = r, f = u("sensor.dsc_plant_roster_summary")?.attributes?.slots || [], h = Array.isArray(f) ? f.find((v) => String(v.pot) === String(i)) : void 0, g = (v, m) => {
    const y = ft(o(v, ""));
    return y !== "—" ? y : ft(o(m, ""));
  }, x = ft(h?.blend, "");
  return {
    pot: i,
    plantName: ft(o(`text.dsc_pot${i}_plant_name`, "")),
    strainDisplay: ft(o(`sensor.dsc_pot${i}_strain_display`, "")),
    sprout: ft(o(`datetime.dsc_pot${i}_sprout_date`, ""), "—").slice(0, 10),
    days: ft(o(`sensor.dsc_pot${i}_days_since_sprout`, "")),
    stage: ft(o(`sensor.dsc_pot${i}_expected_stage`, "")),
    growthStage: ft(o(`select.dsc_pot${i}_growth_stage`, "")),
    tent: Pm(o, i),
    blend: x,
    recipe: ft(h?.recipe, ""),
    notes: ft(h?.notes, ""),
    layers: jx(x),
    moisture: g(`sensor.dsc_pot${i}_got_moisture`, `sensor.dsc_pot${i}_soil_moisture`),
    soilTemp: ft(o(`sensor.dsc_pot${i}_soil_temperature`, "")),
    ec: g(`sensor.dsc_pot${i}_got_ec`, `sensor.dsc_pot${i}_soil_conductivity`),
    ph: g(`sensor.dsc_pot${i}_got_ph`, `sensor.dsc_pot${i}_soil_ph`),
    n: ft(o(`sensor.dsc_pot${i}_soil_nitrogen`, "")),
    p: ft(o(`sensor.dsc_pot${i}_soil_phosphorus`, "")),
    k: ft(o(`sensor.dsc_pot${i}_soil_potassium`, "")),
    need: ft(o(`sensor.dsc_pot${i}_need_summary`, "")),
    rosterSlot: h?.slot ?? null
  };
}
function la(i, r, o) {
  const u = `sensor.dsc_pot${i}_got_${r}`, f = r === "moisture" ? `sensor.dsc_pot${i}_soil_moisture` : r === "ec" ? `sensor.dsc_pot${i}_soil_conductivity` : `sensor.dsc_pot${i}_soil_ph`, h = o(u, "");
  return h && h !== "unavailable" && h !== "unknown" ? u : f;
}
function Lx(i, r, o) {
  return xn(r).map((u) => wi(u, { state: r, entity: o })).filter((u) => u.tent === i);
}
function gn(i, r) {
  const o = `input_boolean.dsc_pot${i}_in_service`, u = r(o, "on");
  return u === "unavailable" || u === "unknown" || u === "" ? !0 : u === "on";
}
function xn(i, r = [1, 2, 3, 4]) {
  return r.filter((o) => gn(o, i));
}
function qx(i) {
  const r = i("sensor.dsc_plant_roster_summary")?.attributes?.slots;
  return Array.isArray(r) ? r : [];
}
const Yx = [
  { id: "binary_sensor.dsc_hub_emergency_failsafe", label: "Emergency failsafe" },
  { id: "binary_sensor.dsc_hub_climate_sensor_fault", label: "Climate sensor fault" },
  { id: "binary_sensor.dsc_hub_aux_sensor_fault", label: "Aux sensor fault" },
  { id: "binary_sensor.dsc_hub_root_zone_sensor_fault", label: "Root-zone probes" },
  { id: "binary_sensor.dsc_clone_dark_period_violation", label: "Clone dark violation" },
  { id: "binary_sensor.dsc_reduced_kit", label: "Reduced kit" }
];
function _m(i, r = 1) {
  return Number.isFinite(i) ? i.toFixed(r) : "—";
}
function Gx() {
  const { state: i, num: r, available: o, entity: u, tick: f } = Qe(), h = Ut(), [g, x] = j.useState(!1), [v, m] = j.useState(null), { hours: y, setHours: b, maxPoints: N } = sc(6), L = o("sensor.dsc_hub_uptime"), G = kx(), Y = Hx(), O = Ux(), V = r("sensor.dsc_active_alert_count", 0), $ = tt("sensor.dsc_hub_tent_temperature"), q = tt("sensor.dsc_hub_tent_humidity"), le = tt("sensor.dsc_hub_vpd_kpa"), se = tt("sensor.dsc_hub_room_temperature"), re = tt("sensor.dsc_hub_clone_temperature"), F = tt("sensor.dsc_hub_clone_humidity"), oe = tt("sensor.dsc_hub_clone_vpd_kpa"), pe = Re("sensor.dsc_hub_tent_temperature", { hours: y, maxPoints: N }), _e = Re("sensor.dsc_hub_tent_humidity", { hours: y, maxPoints: N }), Ee = Re("sensor.dsc_hub_vpd_kpa", {
    hours: y,
    maxPoints: Math.min(N, 64)
  }), Se = Re("sensor.dsc_hub_clone_temperature", {
    hours: y,
    maxPoints: Math.min(N, 64)
  }), z = Re("sensor.dsc_hub_clone_humidity", {
    hours: y,
    maxPoints: Math.min(N, 64)
  }), te = Re("sensor.dsc_hub_clone_vpd_kpa", {
    hours: y,
    maxPoints: Math.min(N, 64)
  }), ee = r("number.dsc_hub_target_temp"), M = r("number.dsc_hub_rh_target_min"), U = r("number.dsc_hub_rh_target_max"), Q = r("number.dsc_hub_vpd_target_min"), P = r("number.dsc_hub_vpd_target_max"), ue = r("number.dsc_hub_clone_target_temp"), S = r("number.dsc_hub_clone_rh_min"), D = r("number.dsc_hub_clone_rh_max"), X = r("number.dsc_hub_clone_vpd_min"), K = r("number.dsc_hub_clone_vpd_max"), ae = j.useMemo(() => Is(pe.series), [pe.series]), Z = j.useMemo(() => Is(_e.series), [_e.series]), he = i("light.dsc_hub_sf1000_dimmer") === "on", lt = i("binary_sensor.dsc_hub_4x8_window_open") === "on", mt = i("binary_sensor.dsc_hub_panel_link") === "on", Ft = i("sensor.dsc_hub_heartbeat", "NO BEAT"), wt = o("sensor.dsc_hub_heartbeat"), Cl = i("sensor.dsc_fleet_version_status", "—"), tl = i("switch.dsc_hub_manual_takeover") === "on", ll = i("switch.dsc_hub_tent_manual_override") === "on", Tl = i("switch.dsc_hub_tent_full_auto_mode") === "on", Ni = i("binary_sensor.dsc_reduced_kit") === "on", Ca = String(u("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? ""), Rl = Tl && !tl, _n = i("binary_sensor.dsc_hub_climate_sensor_fault") === "on", aa = Yx.filter((Me) => i(Me.id) === "on"), oc = xn(i).map((Me) => wi(Me, { state: i, entity: u })), dc = $.stale || q.stale || le.stale || re.stale || F.stale || oe.stale, Fe = (Me, Ta, na, Ra) => m({ entityId: Me, label: Ta, unit: na, color: Ra });
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      Jt,
      {
        icon: "mission",
        title: "Mission",
        subtitle: "Job line — mode, vitals, seats, demands. Click a gauge for history.",
        primaryAction: /* @__PURE__ */ c.jsx(Ue, { teal: !0, onClick: () => h("/live/twin"), children: "Open Twin" }),
        actions: /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsx(Ue, { primary: !0, onClick: () => h("/live/climate"), children: "Climate Want" }),
          /* @__PURE__ */ c.jsx(Zr, { label: "Search", icon: "search", onClick: () => x(!0) }),
          /* @__PURE__ */ c.jsx(
            ic,
            {
              label: "Mission settings",
              items: [
                {
                  id: "climate",
                  label: "Open Climate",
                  onSelect: () => h("/live/climate")
                },
                { id: "main", label: "Main cockpit", onSelect: () => h("/live/main") },
                { id: "clone", label: "Clone cockpit", onSelect: () => h("/live/clone") },
                { id: "fleet", label: "Open Fleet", onSelect: () => h("/fleet") }
              ]
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-status-strip", children: [
      /* @__PURE__ */ c.jsx(
        W,
        {
          icon: L ? "ok" : "alert",
          label: L ? "HUB ONLINE" : "HUB OFFLINE",
          tone: L ? "ok" : "bad"
        }
      ),
      L ? null : /* @__PURE__ */ c.jsx(
        W,
        {
          label: `OFF ${G != null ? Js(G) : "—"}`,
          tone: "bad",
          pulse: !0
        }
      ),
      dc ? /* @__PURE__ */ c.jsx(W, { label: "HELD VITALS", tone: "warn" }) : null,
      /* @__PURE__ */ c.jsx(
        W,
        {
          label: mt ? "PANEL ESP-NOW" : o("sensor.dsc_control_wifi_rssi") ? "PANEL HA-ONLY" : "PANEL OFFLINE",
          tone: mt ? "ok" : o("sensor.dsc_control_wifi_rssi") ? "warn" : "bad"
        }
      ),
      !mt && !o("sensor.dsc_control_wifi_rssi") ? /* @__PURE__ */ c.jsx(
        W,
        {
          label: `PANEL OFF ${O != null ? Js(O) : "—"}`,
          tone: "bad",
          pulse: !0
        }
      ) : null,
      /* @__PURE__ */ c.jsx(
        W,
        {
          icon: wt ? "ok" : "alert",
          label: wt ? `BEAT ${Ft}` : "NO BEAT",
          tone: wt ? "ok" : "bad"
        }
      ),
      wt ? null : /* @__PURE__ */ c.jsx(W, { label: `BEAT OFF ${Y != null ? Js(Y) : "—"}`, tone: "bad", pulse: !0 }),
      /* @__PURE__ */ c.jsx(
        W,
        {
          label: `UP ${Bx(r("sensor.dsc_hub_uptime"))}`,
          tone: L ? "ok" : "muted"
        }
      ),
      /* @__PURE__ */ c.jsx(
        W,
        {
          icon: V === 0 ? "ok" : "alert",
          label: V === 0 ? "All clear" : `${V} alert(s)`,
          tone: V === 0 ? "ok" : "bad",
          pulse: V > 0
        }
      ),
      /* @__PURE__ */ c.jsx(
        W,
        {
          label: Cl === "ok" ? "FLEET OK" : Cl === "warn" ? "FLEET WARN" : "FLEET DRIFT",
          tone: Cl === "ok" ? "ok" : Cl === "warn" ? "warn" : "bad"
        }
      ),
      Tl ? /* @__PURE__ */ c.jsx(W, { icon: "ok", label: "FULL AUTO", tone: "ok", pulse: !0 }) : null,
      Rl ? /* @__PURE__ */ c.jsx(W, { label: "AUTO-DRIVEN", tone: "ok" }) : null,
      tl ? /* @__PURE__ */ c.jsx(W, { icon: "alert", label: "MANUAL TAKEOVER", tone: "warn", pulse: !0 }) : null,
      ll ? /* @__PURE__ */ c.jsx(W, { icon: "alert", label: "FAN OVERRIDE", tone: "warn", pulse: !0 }) : null,
      Tl && Ni ? /* @__PURE__ */ c.jsx(W, { icon: "alert", label: Ca || "REDUCED KIT", tone: "warn", pulse: !0 }) : null
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-grid dsc-mission-modern", children: [
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(vx, {}) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ c.jsx(ie, { className: "dsc-glass", title: "Live gauges", icon: "gauge", children: /* @__PURE__ */ c.jsxs("div", { className: "dsc-gauge-matrix", children: [
        /* @__PURE__ */ c.jsxs("div", { className: `dsc-gauge-row-3${he ? " is-lit" : ""}`, children: [
          /* @__PURE__ */ c.jsx("div", { className: "dsc-gauge-row-tag", children: "2×4" }),
          /* @__PURE__ */ c.jsxs("div", { className: "dsc-gauge-cell", children: [
            /* @__PURE__ */ c.jsx(
              St,
              {
                label: "Temp",
                value: re.value,
                min: 15,
                max: 35,
                unit: "°C",
                target: ue,
                stale: re.stale,
                onClick: () => Fe("sensor.dsc_hub_clone_temperature", "2×4 Temp", "°C", "var(--dsc-teal)")
              }
            ),
            /* @__PURE__ */ c.jsx(wa, { series: Se.series, color: "var(--dsc-teal)", width: 88, height: 18 })
          ] }),
          /* @__PURE__ */ c.jsxs("div", { className: "dsc-gauge-cell", children: [
            /* @__PURE__ */ c.jsx(
              St,
              {
                label: "RH",
                value: F.value,
                min: 0,
                max: 100,
                unit: "%",
                band: { min: S, max: D },
                stale: F.stale,
                onClick: () => Fe("sensor.dsc_hub_clone_humidity", "2×4 Humidity", "%", "var(--dsc-teal)")
              }
            ),
            /* @__PURE__ */ c.jsx(wa, { series: z.series, color: "var(--dsc-teal)", width: 88, height: 18 })
          ] }),
          /* @__PURE__ */ c.jsxs("div", { className: "dsc-gauge-cell", children: [
            /* @__PURE__ */ c.jsx(
              St,
              {
                label: "VPD",
                value: oe.value,
                min: 0,
                max: 2.5,
                unit: "kPa",
                band: { min: X, max: K },
                stale: oe.stale,
                onClick: () => Fe("sensor.dsc_hub_clone_vpd_kpa", "2×4 VPD", "kPa", "var(--dsc-teal)")
              }
            ),
            /* @__PURE__ */ c.jsx(wa, { series: te.series, color: "var(--dsc-teal)", width: 88, height: 18 })
          ] })
        ] }),
        /* @__PURE__ */ c.jsxs("div", { className: `dsc-gauge-row-3${lt ? " is-lit" : ""}`, children: [
          /* @__PURE__ */ c.jsx("div", { className: "dsc-gauge-row-tag", children: "4×8" }),
          /* @__PURE__ */ c.jsxs("div", { className: "dsc-gauge-cell", children: [
            /* @__PURE__ */ c.jsx(
              St,
              {
                label: "Temp",
                value: $.value,
                min: 15,
                max: 35,
                unit: "°C",
                target: ee,
                extrema: ae,
                stale: $.stale,
                onClick: () => Fe("sensor.dsc_hub_tent_temperature", "4×8 Temp", "°C", "var(--dsc-blue)")
              }
            ),
            /* @__PURE__ */ c.jsx(wa, { series: pe.series, color: "var(--dsc-blue)", width: 88, height: 18 })
          ] }),
          /* @__PURE__ */ c.jsxs("div", { className: "dsc-gauge-cell", children: [
            /* @__PURE__ */ c.jsx(
              St,
              {
                label: "RH",
                value: q.value,
                min: 0,
                max: 100,
                unit: "%",
                band: { min: M, max: U },
                extrema: Z,
                stale: q.stale,
                onClick: () => Fe("sensor.dsc_hub_tent_humidity", "4×8 Humidity", "%", "var(--dsc-blue)")
              }
            ),
            /* @__PURE__ */ c.jsx(wa, { series: _e.series, color: "var(--dsc-blue)", width: 88, height: 18 })
          ] }),
          /* @__PURE__ */ c.jsxs("div", { className: "dsc-gauge-cell", children: [
            /* @__PURE__ */ c.jsx(
              St,
              {
                label: "VPD",
                value: le.value,
                min: 0,
                max: 2.5,
                unit: "kPa",
                band: { min: Q, max: P },
                stale: le.stale,
                onClick: () => Fe("sensor.dsc_hub_vpd_kpa", "4×8 VPD", "kPa", "var(--dsc-blue)")
              }
            ),
            /* @__PURE__ */ c.jsx(wa, { series: Ee.series, color: "var(--dsc-blue)", width: 88, height: 18 })
          ] })
        ] })
      ] }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ c.jsxs(ie, { className: `dsc-glass${Rl ? " is-auto" : ""}`, title: "Control Center", icon: "climate", children: [
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-mode-row", children: [
          /* @__PURE__ */ c.jsx(
            ke,
            {
              entityId: "switch.dsc_hub_tent_full_auto_mode",
              label: "Full Auto",
              icon: "ok"
            }
          ),
          /* @__PURE__ */ c.jsx(
            ke,
            {
              entityId: "switch.dsc_hub_manual_takeover",
              label: "Manual takeover",
              icon: "alert"
            }
          ),
          /* @__PURE__ */ c.jsx(
            ke,
            {
              entityId: "switch.dsc_hub_tent_manual_override",
              label: "Fan override",
              icon: "climate"
            }
          ),
          /* @__PURE__ */ c.jsx(
            ke,
            {
              entityId: "switch.dsc_hub_humidifier_intake_routing",
              label: "Hum intake routing",
              icon: "climate"
            }
          ),
          /* @__PURE__ */ c.jsx(
            ke,
            {
              entityId: "switch.dsc_hub_recirc_de_strat_pulse",
              label: "RECIRC de-strat",
              icon: "climate"
            }
          )
        ] }),
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-mode-selects", children: [
          /* @__PURE__ */ c.jsx(
            Ps,
            {
              entityId: "select.dsc_hub_control_strategy",
              label: "Strategy",
              icon: "climate"
            }
          ),
          /* @__PURE__ */ c.jsx(
            Ps,
            {
              entityId: "select.dsc_hub_priority_tent",
              label: "Priority tent",
              icon: "tent"
            }
          )
        ] }),
        Tl && (Ni || Ca) ? /* @__PURE__ */ c.jsxs("p", { className: "dsc-honesty", children: [
          /* @__PURE__ */ c.jsx(W, { icon: "alert", label: "Honesty", tone: "warn" }),
          " ",
          Ca || "Full Auto armed on reduced kit — capacity offline paths apply."
        ] }) : null,
        _n ? /* @__PURE__ */ c.jsxs("p", { className: "dsc-honesty", children: [
          /* @__PURE__ */ c.jsx(W, { label: "Climate fault", tone: "bad" }),
          " Do not invent Got — trust held/—."
        ] }) : null
      ] }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ c.jsxs(ie, { className: "dsc-glass", title: "Got vs Want", icon: "gauge", children: [
        /* @__PURE__ */ c.jsx(
          Dx,
          {
            rows: [
              {
                label: "Main T",
                got: $.value,
                want: ee,
                unit: "°C"
              },
              {
                label: "Main RH",
                got: q.value,
                wantMin: M,
                wantMax: U,
                unit: "%"
              },
              {
                label: "Clone T",
                got: re.value,
                want: ue,
                unit: "°C"
              },
              {
                label: "Clone RH",
                got: F.value,
                wantMin: S,
                wantMax: D,
                unit: "%"
              }
            ]
          }
        ),
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-kpi-sub", style: { marginTop: 8 }, children: [
          "Room ",
          _m(se.value),
          " °C · VPD ",
          _m(le.value, 2),
          " kPa",
          le.stale || se.stale ? " · HELD" : ""
        ] }),
        /* @__PURE__ */ c.jsx(
          Xe,
          {
            label: "Surface",
            value: i("sensor.dsc_ha_surface_version", "7.1.1"),
            sub: `Fleet ${Cl}`,
            tone: "ok"
          }
        )
      ] }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ie, { className: "dsc-glass", title: "Targets", icon: "gauge", children: /* @__PURE__ */ c.jsx($r, { compact: !0 }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ie, { className: "dsc-glass", title: "Plant seats", icon: "seat", children: /* @__PURE__ */ c.jsx("div", { className: "dsc-chip-row", children: oc.map((Me) => /* @__PURE__ */ c.jsxs(
        "button",
        {
          type: "button",
          className: "dsc-chip dsc-chip--ok",
          onClick: () => h(`/live/root?pot=${Me.pot}`),
          title: Me.blend || "Open plant seat",
          children: [
            "P",
            Me.pot,
            " ",
            Me.plantName !== "—" ? Me.plantName : "—",
            " · ",
            uc(Me.tent),
            Me.blend ? ` · ${Me.blend.slice(0, 28)}` : ""
          ]
        },
        Me.pot
      )) }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsxs(ie, { className: "dsc-glass", title: "Live climate trend", icon: "climate", children: [
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
          /* @__PURE__ */ c.jsx(cc, { hours: y, setHours: b }),
          /* @__PURE__ */ c.jsx(Ue, { onClick: () => h("/live/climate"), children: "Open Climate" })
        ] }),
        /* @__PURE__ */ c.jsx(
          Dt,
          {
            live: !0,
            lastSyncAt: Math.max(pe.lastSyncAt ?? 0, _e.lastSyncAt ?? 0) || void 0,
            series: [
              {
                id: "t",
                label: "Temp °C",
                series: pe.series,
                color: "var(--dsc-blue)",
                axis: "left",
                unit: "°C"
              },
              {
                id: "rh",
                label: "RH %",
                series: _e.series,
                color: "var(--dsc-teal)",
                axis: "right",
                unit: "%"
              }
            ],
            targets: [
              { axis: "left", value: ee, color: "var(--dsc-amber)", label: "Want T" },
              { axis: "right", min: M, max: U, color: "var(--dsc-teal)" }
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsxs(ie, { className: `dsc-glass${Rl ? " is-auto" : ""}`, title: "Demands", icon: "climate", children: [
        Rl ? /* @__PURE__ */ c.jsx("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: /* @__PURE__ */ c.jsx(W, { label: "AUTO", tone: "ok", icon: "ok" }) }) : null,
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-demand-row", children: [
          /* @__PURE__ */ c.jsx(ke, { entityId: "switch.dsc_hub_heater_demand", label: "Heat", icon: "climate" }),
          /* @__PURE__ */ c.jsx(
            ke,
            {
              entityId: "switch.dsc_hub_ac_demand",
              label: "Cool",
              icon: "climate",
              warnWhenMissing: i("binary_sensor.dsc_ac_capacity_offline") === "on" ? "AC ○" : void 0
            }
          ),
          /* @__PURE__ */ c.jsx(ke, { entityId: "switch.dsc_hub_humidifier_demand", label: "Hum", icon: "climate" }),
          /* @__PURE__ */ c.jsx(
            ke,
            {
              entityId: "switch.dsc_hub_dehumidifier_demand",
              label: "Dehum",
              icon: "climate"
            }
          ),
          /* @__PURE__ */ c.jsx(ke, { entityId: "switch.dsc_hub_grow_mat_demand", label: "Mat", icon: "root" }),
          /* @__PURE__ */ c.jsx(
            ke,
            {
              entityId: "switch.dsc_hub_clone_humidifier_demand",
              label: "C-Hum",
              icon: "clone"
            }
          ),
          /* @__PURE__ */ c.jsx(
            ke,
            {
              entityId: "light.dsc_hub_sf1000_dimmer",
              label: "SF1000",
              icon: "lighting",
              showBrightness: !0
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsxs(ie, { className: "dsc-glass", title: "Fans", icon: "climate", children: [
        /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { margin: "0 0 8px" }, children: ll ? "Fan override ON — sliders write percentage." : "Enable Fan override to set duty." }),
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-fan-stack", children: [
          /* @__PURE__ */ c.jsx(
            Kt,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_main",
              label: "Intake Main",
              disabled: !ll
            }
          ),
          /* @__PURE__ */ c.jsx(
            Kt,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_2x4",
              label: "Intake 2×4",
              disabled: !ll
            }
          ),
          /* @__PURE__ */ c.jsx(
            Kt,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_room",
              label: "Exhaust room",
              disabled: !ll
            }
          ),
          /* @__PURE__ */ c.jsx(
            Kt,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_outside",
              label: "Exhaust outside",
              disabled: !ll
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsx(ie, { className: "dsc-glass", title: "Pot ESP-NOW", icon: "root", children: /* @__PURE__ */ c.jsx("div", { className: "dsc-chip-row", children: xn(i).map((Me) => {
        const Ta = `binary_sensor.dsc_hub_pot${Me}_esp_now_link`, na = i(Ta) === "on";
        return /* @__PURE__ */ c.jsx(W, { label: `P${Me} ${na ? "ON" : "OFF"}`, tone: na ? "ok" : "muted" }, Me);
      }) }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsx(ie, { className: "dsc-glass", title: "Faults / alerts", icon: "alert", children: aa.length === 0 && V === 0 ? /* @__PURE__ */ c.jsx("div", { className: "dsc-empty dsc-empty--ok", children: "No active faults — all clear." }) : /* @__PURE__ */ c.jsxs("ul", { className: "dsc-fault-list", children: [
        aa.map((Me) => /* @__PURE__ */ c.jsxs("li", { children: [
          /* @__PURE__ */ c.jsx(W, { label: Me.label, tone: "bad", pulse: !0, icon: "alert" }),
          /* @__PURE__ */ c.jsx("span", { className: "dsc-muted", children: Me.id })
        ] }, Me.id)),
        V > 0 && aa.length === 0 ? /* @__PURE__ */ c.jsxs("li", { children: [
          /* @__PURE__ */ c.jsx(W, { label: `${V} system alert(s)`, tone: "bad", pulse: !0, icon: "alert" }),
          /* @__PURE__ */ c.jsx("span", { className: "dsc-muted", children: "See Fleet for entity detail" })
        ] }) : null
      ] }) }) })
    ] }),
    /* @__PURE__ */ c.jsx(ji, { open: g, onClose: () => x(!1), title: "Quick jump", children: /* @__PURE__ */ c.jsx("div", { className: "dsc-chip-row", children: [
      { path: "/live/climate", label: "Climate" },
      { path: "/live/twin", label: "Twin" },
      { path: "/live/main", label: "Main" },
      { path: "/live/clone", label: "Clone" },
      { path: "/live/root", label: "Root" },
      { path: "/live/light", label: "Light" },
      { path: "/grow/compose", label: "Compose" },
      { path: "/fleet", label: "Fleet" }
    ].map((Me) => /* @__PURE__ */ c.jsx(
      "button",
      {
        type: "button",
        className: "dsc-btn teal",
        onClick: () => {
          x(!1), h(Me.path);
        },
        children: Me.label
      },
      Me.path
    )) }) }),
    /* @__PURE__ */ c.jsx(
      Kr,
      {
        open: v != null,
        onClose: () => m(null),
        entityId: v?.entityId ?? null,
        label: v?.label ?? "",
        unit: v?.unit,
        color: v?.color
      }
    )
  ] });
}
function rc({
  tag: i,
  config: r
}) {
  const o = j.useRef(null), { hass: u } = Qe(), [f, h] = j.useState("loading"), g = j.useRef(
    null
  ), x = JSON.stringify(r ?? {});
  return j.useEffect(() => {
    const v = o.current;
    if (!v) return;
    let m = !1;
    const y = x ? JSON.parse(x) : {};
    return (async () => {
      h("loading"), v.innerHTML = "";
      const b = await Qm(i);
      if (m || !o.current) return;
      if (!b) {
        h("missing");
        const L = document.createElement("div");
        L.className = "dsc-empty";
        const G = xx(i).join(", ");
        L.innerHTML = `<strong>${i}</strong> did not register.<br/>Tried ${G}. Deploy the card IIFE under /config/www (or add a Lovelace resource), then hard-refresh.`, v.appendChild(L);
        return;
      }
      const N = document.createElement(i);
      typeof N.setConfig == "function" && N.setConfig({ type: `custom:${i}`, ...y }), u && (N.hass = u), v.appendChild(N), g.current = N, h("ready");
    })(), () => {
      m = !0, g.current = null, v.innerHTML = "";
    };
  }, [i, x]), j.useEffect(() => {
    g.current && u && (g.current.hass = u);
  }, [u]), /* @__PURE__ */ c.jsx(
    "div",
    {
      className: `dsc-legacy-host${f === "missing" ? " dsc-legacy-host--empty" : ""}`,
      ref: o,
      "data-status": f
    }
  );
}
function Fr({
  pot: i,
  onSelectPot: r
}) {
  const { state: o, entity: u, callService: f, available: h, tick: g, num: x } = Qe(), v = Ut(), m = wi(i, { state: o, entity: u }), [y, b] = j.useState(m.plantName === "—" ? "" : m.plantName), [N, L] = j.useState(m.sprout === "—" ? "" : m.sprout), [G, Y] = j.useState(m.growthStage === "—" ? "" : m.growthStage), [O, V] = j.useState(m.notes === "—" ? "" : m.notes), [$, q] = j.useState(null), [le, se] = j.useState(null);
  j.useEffect(() => {
    b(m.plantName === "—" ? "" : m.plantName), L(m.sprout === "—" ? "" : m.sprout), Y(m.growthStage === "—" ? "" : m.growthStage), V(m.notes === "—" ? "" : m.notes);
  }, [i, m.plantName, m.sprout, m.growthStage, m.notes]);
  const re = la(i, "moisture", o), F = la(i, "ec", o), oe = la(i, "ph", o), pe = `sensor.dsc_pot${i}_dryback_pct`, _e = tt(re), Ee = tt(pe), Se = Re(re, { hours: 6, maxPoints: 72 }), z = Re(F, { hours: 6, maxPoints: 72 }), te = x(`input_number.dsc_pot${i}_learned_ec_per_moisture`), ee = h(`input_number.dsc_pot${i}_learned_ec_per_moisture`) && Number.isFinite(te) && te !== 0 ? te : NaN, M = x(`number.dsc_pot${i}_want_moisture_min`), U = x(`number.dsc_pot${i}_want_moisture_max`), Q = Number.isFinite(M) && Number.isFinite(U) && h(`number.dsc_pot${i}_want_moisture_min`), P = !m.strainDisplay || m.strainDisplay === "—" || /generic/i.test(m.strainDisplay), ue = async (Z) => {
    q(null);
    try {
      await f("input_select", "select_option", {
        entity_id: `input_select.dsc_pot${i}_tent`,
        option: Z
      }), window.setTimeout(() => {
        o(`input_select.dsc_pot${i}_tent`, "") !== Z && q("Tent apply failed — check helper options (clone|main|unassigned).");
      }, 400);
    } catch {
      q("Tent apply failed — check helper options (clone|main|unassigned).");
    }
  }, S = () => {
    h(`text.dsc_pot${i}_plant_name`) && f("text", "set_value", {
      entity_id: `text.dsc_pot${i}_plant_name`,
      value: y
    });
  }, D = () => {
    const Z = `datetime.dsc_pot${i}_sprout_date`;
    if (!h(Z) || !N) return;
    const he = N.length === 10 ? `${N}T00:00:00` : N;
    f("datetime", "set_value", { entity_id: Z, datetime: he });
  }, X = () => {
    const Z = `select.dsc_pot${i}_growth_stage`;
    !h(Z) || !G || f("select", "select_option", { entity_id: Z, option: G });
  }, K = () => {
    if (m.rosterSlot == null) return;
    const Z = `input_text.dsc_plant_roster_${m.rosterSlot}_notes`;
    !h(Z) && u(Z), f("input_text", "set_value", { entity_id: Z, value: O });
  }, ae = u(`select.dsc_pot${i}_growth_stage`)?.attributes?.options || [];
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-seat-panel", children: [
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 14 }, children: [
      xn(o).map((Z) => /* @__PURE__ */ c.jsxs(
        "button",
        {
          type: "button",
          className: `dsc-chip${Z === i ? " dsc-chip--ok" : ""}`,
          onClick: () => r?.(Z),
          children: [
            "P",
            Z
          ]
        },
        Z
      )),
      /* @__PURE__ */ c.jsx(W, { label: uc(m.tent), tone: m.tent === "unassigned" ? "muted" : "ok" }),
      m.rosterSlot != null ? /* @__PURE__ */ c.jsx(W, { label: `Roster #${m.rosterSlot}`, tone: "muted" }) : /* @__PURE__ */ c.jsx(W, { label: "No roster join", tone: "warn" }),
      _e.stale ? /* @__PURE__ */ c.jsx(W, { label: "HELD Got", tone: "warn" }) : null
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-seat-layout", children: [
      /* @__PURE__ */ c.jsxs(ie, { className: "dsc-glass dsc-glass--glow", title: "Medium", children: [
        /* @__PURE__ */ c.jsx(wx, { layers: m.layers }),
        /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { marginTop: 10, fontSize: 12 }, children: m.blend || "Blend lives on roster after commit — not invented here." })
      ] }),
      /* @__PURE__ */ c.jsxs("div", { className: "dsc-grid", style: { gap: 14 }, children: [
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ie, { className: "dsc-glass", title: "Identity", children: /* @__PURE__ */ c.jsxs("div", { className: "dsc-seat-editors", children: [
          /* @__PURE__ */ c.jsxs("label", { children: [
            "Nickname",
            /* @__PURE__ */ c.jsx(
              "input",
              {
                value: y,
                onChange: (Z) => b(Z.target.value),
                onBlur: S,
                disabled: !h(`text.dsc_pot${i}_plant_name`)
              }
            )
          ] }),
          /* @__PURE__ */ c.jsxs("label", { children: [
            "Sprout date",
            /* @__PURE__ */ c.jsx(
              "input",
              {
                type: "date",
                value: N.slice(0, 10),
                onChange: (Z) => L(Z.target.value),
                onBlur: D,
                disabled: !h(`datetime.dsc_pot${i}_sprout_date`)
              }
            )
          ] }),
          /* @__PURE__ */ c.jsxs("label", { children: [
            "Growth stage",
            /* @__PURE__ */ c.jsxs(
              "select",
              {
                value: G,
                onChange: (Z) => {
                  Y(Z.target.value);
                },
                onBlur: X,
                disabled: !h(`select.dsc_pot${i}_growth_stage`),
                children: [
                  /* @__PURE__ */ c.jsx("option", { value: "", children: "—" }),
                  ae.map((Z) => /* @__PURE__ */ c.jsx("option", { value: Z, children: Z }, Z))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ c.jsxs("div", { className: "dsc-chip-row", children: [
            /* @__PURE__ */ c.jsx(W, { label: `Day ${m.days}`, tone: "ok" }),
            /* @__PURE__ */ c.jsx(W, { label: m.stage, tone: "muted" }),
            /* @__PURE__ */ c.jsx(W, { label: m.strainDisplay, tone: "muted" })
          ] }),
          /* @__PURE__ */ c.jsx(
            ic,
            {
              items: [
                {
                  id: "compose",
                  label: "Open Compose (strain/catalog)",
                  onSelect: () => v("/grow/compose")
                },
                {
                  id: "root",
                  label: "Root zone",
                  onSelect: () => v("/live/root")
                },
                {
                  id: "twin",
                  label: "Open Twin",
                  onSelect: () => v("/live/twin")
                }
              ]
            }
          )
        ] }) }) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsxs(ie, { className: "dsc-glass", title: "Want · Got · Need", children: [
          /* @__PURE__ */ c.jsxs("div", { className: "dsc-chip-row", children: [
            /* @__PURE__ */ c.jsx(
              W,
              {
                label: `Got M ${_e.stale ? `${Number.isFinite(_e.value) ? _e.value.toFixed(0) : "—"}*` : m.moisture}`,
                tone: _e.stale ? "warn" : "ok"
              }
            ),
            /* @__PURE__ */ c.jsx(W, { label: `EC ${m.ec}`, tone: "muted" }),
            /* @__PURE__ */ c.jsx(W, { label: `pH ${m.ph}`, tone: "muted" }),
            /* @__PURE__ */ c.jsx(
              W,
              {
                label: m.need,
                tone: m.need !== "—" && m.need !== "OK" ? "warn" : "ok"
              }
            )
          ] }),
          Q && !P ? /* @__PURE__ */ c.jsxs("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: [
            "Want moisture ",
            M,
            "–",
            U,
            "%"
          ] }) : /* @__PURE__ */ c.jsxs("p", { className: "dsc-honesty", style: { margin: "8px 0 0" }, children: [
            /* @__PURE__ */ c.jsx(W, { label: "No catalog Want", tone: "warn" }),
            " ",
            P ? "Generic / empty strain — Want bands not invented." : "Custom Want helpers missing — Got + Need only."
          ] })
        ] }) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsx(ie, { className: "dsc-glass", title: "Dryback", children: /* @__PURE__ */ c.jsx(
          St,
          {
            label: "Dryback",
            value: Ee.value,
            min: 0,
            max: 100,
            unit: "%",
            stale: Ee.stale,
            band: { min: 0, max: 45 },
            onClick: () => se({ id: pe, label: "Dryback", unit: "%" })
          }
        ) }) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsxs(ie, { className: "dsc-glass", title: "Got history", children: [
          /* @__PURE__ */ c.jsx(
            Dt,
            {
              live: !0,
              lastSyncAt: Math.max(Se.lastSyncAt ?? 0, z.lastSyncAt ?? 0) || void 0,
              series: [
                {
                  id: "m",
                  label: "Moisture",
                  series: Se.series,
                  color: "var(--dsc-blue)",
                  axis: "left",
                  unit: "%"
                },
                {
                  id: "ec",
                  label: "EC",
                  series: z.series,
                  color: "var(--dsc-amber)",
                  axis: "right",
                  unit: ""
                }
              ]
            }
          ),
          /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: Number.isFinite(ee) ? `EC consumption honesty: learned ${ee.toFixed(3)} EC per moisture (not feed invent).` : "EC over time shown — no learned_ec_per_moisture yet (not invented)." }),
          /* @__PURE__ */ c.jsxs("div", { className: "dsc-chip-row", style: { marginTop: 8 }, children: [
            /* @__PURE__ */ c.jsx(Ue, { onClick: () => se({ id: re, label: "Moisture", unit: "%" }), children: "Moisture hist" }),
            /* @__PURE__ */ c.jsx(Ue, { onClick: () => se({ id: F, label: "EC", unit: "" }), children: "EC hist" }),
            /* @__PURE__ */ c.jsx(Ue, { onClick: () => se({ id: oe, label: "pH", unit: "" }), children: "pH hist" })
          ] })
        ] }) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsxs(ie, { className: "dsc-glass", title: "Nutrition", children: [
          /* @__PURE__ */ c.jsx("p", { style: { margin: "0 0 6px" }, children: m.recipe || "No roster recipe — catalog doses only, never invented." }),
          /* @__PURE__ */ c.jsxs("label", { className: "dsc-seat-editors", children: [
            "Roster notes",
            /* @__PURE__ */ c.jsx(
              "textarea",
              {
                rows: 3,
                value: O,
                onChange: (Z) => V(Z.target.value),
                onBlur: K,
                disabled: m.rosterSlot == null
              }
            )
          ] }),
          /* @__PURE__ */ c.jsx("div", { style: { marginTop: 10 }, children: /* @__PURE__ */ c.jsx(bi, { to: "/grow/compose", children: /* @__PURE__ */ c.jsx(Ue, { teal: !0, children: "Mix in Compose" }) }) })
        ] }) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsxs(ie, { className: "dsc-glass", title: "Live Got chips", children: [
          /* @__PURE__ */ c.jsxs("div", { className: "dsc-chip-row", children: [
            /* @__PURE__ */ c.jsx(W, { label: `M ${m.moisture}`, tone: "muted" }),
            /* @__PURE__ */ c.jsx(W, { label: `T ${m.soilTemp}`, tone: "muted" }),
            /* @__PURE__ */ c.jsx(W, { label: `EC ${m.ec}`, tone: "muted" }),
            /* @__PURE__ */ c.jsx(W, { label: `pH ${m.ph}`, tone: "muted" }),
            /* @__PURE__ */ c.jsx(W, { label: `N ${m.n}`, tone: "muted" }),
            /* @__PURE__ */ c.jsx(W, { label: `P ${m.p}`, tone: "muted" }),
            /* @__PURE__ */ c.jsx(W, { label: `K ${m.k}`, tone: "muted" })
          ] }),
          /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: "NPK = trend indicators. Unavailable stays —. Held shows last good on blip." })
        ] }) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsxs(ie, { className: "dsc-glass", title: "Apply to tent", children: [
          /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "Digital-twin placement. Moves the plant on Twin; does not rewrite climate Want." }),
          /* @__PURE__ */ c.jsxs("div", { className: "dsc-seat-actions", children: [
            /* @__PURE__ */ c.jsx(Ue, { primary: m.tent === "clone", onClick: () => void ue("clone"), children: "Clone 2×4" }),
            /* @__PURE__ */ c.jsx(Ue, { primary: m.tent === "main", onClick: () => void ue("main"), children: "Main 4×8" }),
            /* @__PURE__ */ c.jsx(Ue, { onClick: () => void ue("unassigned"), children: "Unassigned" }),
            /* @__PURE__ */ c.jsx(bi, { to: "/live/twin", children: /* @__PURE__ */ c.jsx(Ue, { children: "Open Twin" }) })
          ] }),
          $ ? /* @__PURE__ */ c.jsxs("p", { className: "dsc-honesty", children: [
            /* @__PURE__ */ c.jsx(W, { label: "Tent apply failed", tone: "bad" }),
            " ",
            $
          ] }) : null
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ c.jsx(
      Kr,
      {
        open: le != null,
        onClose: () => se(null),
        entityId: le?.id ?? null,
        label: le?.label ?? "",
        unit: le?.unit
      }
    )
  ] });
}
function Vx() {
  const i = Ut();
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      Jt,
      {
        icon: "compose",
        title: "Compose",
        subtitle: "Build soil blend, roster commit, and Want handoff.",
        primaryAction: /* @__PURE__ */ c.jsx(Ue, { teal: !0, onClick: () => i("/grow/roster"), children: "Open Roster / Seat" }),
        actions: /* @__PURE__ */ c.jsx(Ue, { primary: !0, onClick: () => i("/grow/research"), children: "Browse Catalog" })
      }
    ),
    /* @__PURE__ */ c.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Densified catalog traits (height / flowering / chem) show when the index has them. Empty catalog fields stay empty — Compose does not invent Want bands or strain genetics. After commit, open Roster to assign a seat." }),
    /* @__PURE__ */ c.jsx(rc, { tag: "dsc-build-plant-card", config: {} })
  ] });
}
function Xx() {
  const i = Ut();
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      Jt,
      {
        icon: "research",
        title: "Research",
        subtitle: "Catalog browser over /local/dsc-catalog indexes.",
        actions: /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsx(Ue, { primary: !0, onClick: () => i("/grow/compose"), children: "Use in Compose" }),
          /* @__PURE__ */ c.jsx(Ue, { teal: !0, onClick: () => i("/grow/roster"), children: "Open Seat" })
        ] })
      }
    ),
    /* @__PURE__ */ c.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Catalog gaps are honesty, not placeholders. Height / flowering / chem chips come from densified indexes when present. Use in Compose to draft a plant; Open Seat to assign an existing roster row — neither invents missing Want/Got." }),
    /* @__PURE__ */ c.jsx(rc, { tag: "dsc-catalog-browse-card", config: {} })
  ] });
}
function Qx() {
  const { entity: i, state: r, tick: o } = Qe(), [u, f] = nc(), h = qx(i), g = Number(u.get("pot") || 0), x = g >= 1 && g <= 4 && gn(g, r) ? g : null, v = (y) => {
    if (!gn(y, r)) return;
    const b = new URLSearchParams(u);
    b.set("pot", String(y)), f(b, { replace: !0 });
  }, m = () => {
    const y = new URLSearchParams(u);
    y.delete("pot"), f(y, { replace: !0 });
  };
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      Jt,
      {
        icon: "roster",
        title: "Roster",
        subtitle: "Seats — open a row for Plant Seat drawer. Nutrient mix lives in Compose.",
        primaryAction: /* @__PURE__ */ c.jsx(bi, { to: "/grow/compose", children: /* @__PURE__ */ c.jsx(Ue, { primary: !0, children: "Use in Compose" }) })
      }
    ),
    /* @__PURE__ */ c.jsx(ie, { className: "dsc-glass", title: "Roster", icon: "roster", children: h.length ? /* @__PURE__ */ c.jsxs("table", { className: "dsc-table", children: [
      /* @__PURE__ */ c.jsx("thead", { children: /* @__PURE__ */ c.jsxs("tr", { children: [
        /* @__PURE__ */ c.jsx("th", { children: "Slot" }),
        /* @__PURE__ */ c.jsx("th", { children: "Name" }),
        /* @__PURE__ */ c.jsx("th", { children: "Strain" }),
        /* @__PURE__ */ c.jsx("th", { children: "Status" }),
        /* @__PURE__ */ c.jsx("th", { children: "Pot" }),
        /* @__PURE__ */ c.jsx("th", { children: "Tent" })
      ] }) }),
      /* @__PURE__ */ c.jsx("tbody", { children: h.map((y) => {
        const b = Number(y.pot), N = b >= 1 && b <= 4 && gn(b, r), L = N ? uc(Pm(r, b)) : "—";
        return /* @__PURE__ */ c.jsxs(
          "tr",
          {
            onClick: () => {
              N && v(b);
            },
            style: N ? { cursor: "pointer" } : void 0,
            children: [
              /* @__PURE__ */ c.jsxs("td", { children: [
                "#",
                y.slot
              ] }),
              /* @__PURE__ */ c.jsx("td", { children: y.nickname || "—" }),
              /* @__PURE__ */ c.jsx("td", { children: y.strain || "—" }),
              /* @__PURE__ */ c.jsx("td", { children: y.status || "—" }),
              /* @__PURE__ */ c.jsx("td", { children: N ? `P${b}` : "—" }),
              /* @__PURE__ */ c.jsx("td", { children: /* @__PURE__ */ c.jsx(W, { label: L, tone: "muted" }) })
            ]
          },
          y.slot
        );
      }) })
    ] }) : /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "No plants in roster yet. Commit from Compose, then assign a pot." }) }),
    /* @__PURE__ */ c.jsx(
      ji,
      {
        open: x != null,
        onClose: m,
        title: x != null ? `Plant seat · POT${x}` : "Plant seat",
        children: x != null ? /* @__PURE__ */ c.jsx(Fr, { pot: x, onSelectPot: v }) : null
      }
    )
  ] });
}
function qe(i, r = 1) {
  return Number.isFinite(i) ? i.toFixed(r) : "—";
}
const Zx = [
  { id: "main", label: "Main" },
  { id: "clone", label: "Clone" },
  { id: "compare", label: "Compare" }
];
function $x() {
  const i = Ut();
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page dsc-page--twin-chrome", children: [
    /* @__PURE__ */ c.jsx(
      Jt,
      {
        icon: "twin",
        title: "Twin",
        subtitle: "Cinematic digital twin — pick a pot to open Root seat.",
        primaryAction: /* @__PURE__ */ c.jsx(Ue, { teal: !0, onClick: () => i("/live/climate"), children: "Set Climate Want" }),
        actions: /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsx(Ue, { onClick: () => i("/live/main"), children: "Main cockpit" }),
          /* @__PURE__ */ c.jsx(Ue, { onClick: () => i("/live/clone"), children: "Clone cockpit" })
        ] })
      }
    ),
    /* @__PURE__ */ c.jsx("p", { className: "dsc-honesty dsc-muted", style: { marginTop: 0 }, children: "Pick a pot in the twin to open its seat. Twin stays warm across Twin / Main / Clone. 4×8 fixture glow follows photoperiod window until a main lamp is wired." })
  ] });
}
function Kx() {
  const { num: i, state: r, entity: o, available: u } = Qe(), f = Ut(), { focus: h, setFocus: g } = $m(), { hours: x, setHours: v, maxPoints: m } = sc(6), [y, b] = j.useState(null), N = r("switch.dsc_hub_tent_manual_override") === "on", L = r("switch.dsc_hub_tent_full_auto_mode") === "on", G = String(o("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? ""), Y = tt("sensor.dsc_hub_tent_temperature"), O = tt("sensor.dsc_hub_tent_humidity"), V = tt("sensor.dsc_hub_clone_temperature"), $ = tt("sensor.dsc_hub_clone_humidity"), q = tt("sensor.dsc_hub_vpd_kpa"), le = Re("sensor.dsc_hub_tent_temperature", { hours: x, maxPoints: m }), se = Re("sensor.dsc_hub_tent_humidity", { hours: x, maxPoints: m }), re = Re("sensor.dsc_hub_clone_temperature", { hours: x, maxPoints: m }), F = Re("sensor.dsc_hub_clone_humidity", { hours: x, maxPoints: m }), oe = u("sensor.dsc_cfm_exhaust_out_allocated") ? "sensor.dsc_cfm_exhaust_out_allocated" : "sensor.dsc_cfm_exhaust_out", pe = u("sensor.dsc_cfm_exhaust_recirc_allocated") ? "sensor.dsc_cfm_exhaust_recirc_allocated" : "sensor.dsc_cfm_exhaust_recirc", _e = Re(oe, { hours: x, maxPoints: m }), Ee = Re(pe, { hours: x, maxPoints: m }), Se = Re("sensor.dsc_fan_exhaust_outside_pct", { hours: x, maxPoints: m }), z = Re("sensor.dsc_fan_exhaust_room_pct", { hours: x, maxPoints: m }), te = i("sensor.dsc_cfm_exhaust_out"), ee = i(oe), M = i("sensor.dsc_cfm_exhaust_recirc"), U = i(pe), Q = i("number.dsc_hub_target_temp"), P = i("number.dsc_hub_rh_target_min"), ue = i("number.dsc_hub_rh_target_max"), S = i("number.dsc_hub_vpd_target_min"), D = i("number.dsc_hub_vpd_target_max"), X = i("number.dsc_hub_clone_target_temp"), K = i("number.dsc_hub_clone_rh_min"), ae = i("number.dsc_hub_clone_rh_max"), Z = i("number.dsc_hub_clone_vpd_min"), he = i("number.dsc_hub_clone_vpd_max"), lt = j.useMemo(() => Is(le.series), [le.series]), Ye = j.useMemo(() => Is(se.series), [se.series]), mt = h === "main" || h === "compare" || h === "room", Ft = h === "clone" || h === "compare";
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      Jt,
      {
        icon: "climate",
        title: "Climate",
        subtitle: "Command, Want targets, zone traces, VPD, airflow honesty.",
        actions: /* @__PURE__ */ c.jsx(
          ic,
          {
            label: "Climate settings",
            items: [
              { id: "mission", label: "Mission", onSelect: () => f("/live/mission") },
              { id: "main", label: "Main cockpit", onSelect: () => f("/live/main") },
              { id: "clone", label: "Clone cockpit", onSelect: () => f("/live/clone") },
              { id: "fleet", label: "Fleet kit", onSelect: () => f("/fleet") }
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 14 }, role: "group", "aria-label": "Tent focus", children: [
      Zx.map((wt) => /* @__PURE__ */ c.jsx(
        "button",
        {
          type: "button",
          className: `dsc-chip${h === wt.id ? " dsc-chip--ok" : ""}`,
          onClick: () => g(wt.id),
          children: wt.label
        },
        wt.id
      )),
      /* @__PURE__ */ c.jsx(cc, { hours: x, setHours: v }),
      /* @__PURE__ */ c.jsx(Ue, { teal: !0, onClick: () => f("/fleet"), children: "Kit / Fleet" })
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsxs(ie, { className: "dsc-glass", title: "Command", icon: "climate", children: [
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-mode-row", children: [
          /* @__PURE__ */ c.jsx(ke, { entityId: "switch.dsc_hub_tent_full_auto_mode", label: "Full Auto", icon: "ok" }),
          /* @__PURE__ */ c.jsx(ke, { entityId: "switch.dsc_hub_manual_takeover", label: "Master takeover", icon: "alert" }),
          /* @__PURE__ */ c.jsx(ke, { entityId: "switch.dsc_hub_tent_manual_override", label: "Fan override", icon: "climate" }),
          /* @__PURE__ */ c.jsx(
            ke,
            {
              entityId: "switch.dsc_hub_humidifier_intake_routing",
              label: "Hum intake routing",
              icon: "climate"
            }
          ),
          /* @__PURE__ */ c.jsx(
            ke,
            {
              entityId: "switch.dsc_hub_recirc_de_strat_pulse",
              label: "RECIRC de-strat",
              icon: "climate"
            }
          )
        ] }),
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-mode-selects", children: [
          /* @__PURE__ */ c.jsx(Ps, { entityId: "select.dsc_hub_control_strategy", label: "Strategy", icon: "climate" }),
          /* @__PURE__ */ c.jsx(Ps, { entityId: "select.dsc_hub_priority_tent", label: "Priority tent", icon: "tent" })
        ] }),
        L ? /* @__PURE__ */ c.jsxs("p", { className: "dsc-honesty", children: [
          /* @__PURE__ */ c.jsx(
            W,
            {
              icon: "alert",
              label: r("binary_sensor.dsc_reduced_kit") === "on" ? "Reduced kit" : "Full Auto",
              tone: r("binary_sensor.dsc_reduced_kit") === "on" ? "warn" : "ok"
            }
          ),
          " ",
          G || "Hub owns fans + appliance Autos when Full Auto is on."
        ] }) : null
      ] }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ie, { className: "dsc-glass", title: "Targets", icon: "gauge", children: /* @__PURE__ */ c.jsx($r, { emphasize: h === "clone" ? "clone" : "main" }) }) }),
      mt ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(
          Xe,
          {
            label: "Tent °C",
            value: qe(Y.value),
            unit: "°C",
            stale: Y.stale,
            onClick: () => b({ id: "sensor.dsc_hub_tent_temperature", label: "Tent T", unit: "°C" })
          }
        ) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(
          Xe,
          {
            label: "Tent RH",
            value: qe(O.value, 0),
            unit: "%",
            stale: O.stale,
            onClick: () => b({ id: "sensor.dsc_hub_tent_humidity", label: "Tent RH", unit: "%" })
          }
        ) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(
          Xe,
          {
            label: "VPD",
            value: qe(q.value, 2),
            unit: "kPa",
            stale: q.stale,
            onClick: () => b({ id: "sensor.dsc_hub_vpd_kpa", label: "VPD", unit: "kPa" })
          }
        ) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(Xe, { label: "Room °C", value: qe(i("sensor.dsc_hub_room_temperature")), unit: "°C" }) })
      ] }) : null,
      Ft ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(
          Xe,
          {
            label: "Clone °C",
            value: qe(V.value),
            unit: "°C",
            stale: V.stale
          }
        ) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(
          Xe,
          {
            label: "Clone RH",
            value: qe($.value, 0),
            unit: "%",
            stale: $.stale
          }
        ) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(Xe, { label: "Clone VPD", value: qe(i("sensor.dsc_hub_clone_vpd_kpa"), 2), unit: "kPa" }) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(Xe, { label: "Room °C", value: qe(i("sensor.dsc_hub_room_temperature")), unit: "°C" }) })
      ] }) : null,
      mt ? /* @__PURE__ */ c.jsx("div", { className: Ft ? "dsc-col-6" : "dsc-col-12", children: /* @__PURE__ */ c.jsx(ie, { className: "dsc-glass", title: "Main tent T + RH", icon: "tent", children: /* @__PURE__ */ c.jsx(
        Dt,
        {
          lastSyncAt: Math.max(le.lastSyncAt ?? 0, se.lastSyncAt ?? 0) || void 0,
          series: [
            {
              id: "t",
              label: "Temp °C",
              series: le.series,
              color: "var(--dsc-blue)",
              axis: "left",
              unit: "°C"
            },
            {
              id: "rh",
              label: "RH %",
              series: se.series,
              color: "var(--dsc-teal)",
              axis: "right",
              unit: "%"
            }
          ],
          targets: [
            { axis: "left", value: Q, color: "var(--dsc-amber)", label: "Want T" },
            { axis: "right", min: P, max: ue, color: "var(--dsc-teal)" }
          ]
        }
      ) }) }) : null,
      Ft ? /* @__PURE__ */ c.jsx("div", { className: mt ? "dsc-col-6" : "dsc-col-12", children: /* @__PURE__ */ c.jsx(ie, { className: "dsc-glass", title: "Clone tent T + RH", icon: "clone", children: /* @__PURE__ */ c.jsx(
        Dt,
        {
          lastSyncAt: Math.max(re.lastSyncAt ?? 0, F.lastSyncAt ?? 0) || void 0,
          series: [
            {
              id: "t",
              label: "Temp °C",
              series: re.series,
              color: "var(--dsc-blue)",
              axis: "left",
              unit: "°C"
            },
            {
              id: "rh",
              label: "RH %",
              series: F.series,
              color: "var(--dsc-teal)",
              axis: "right",
              unit: "%"
            }
          ],
          targets: [
            {
              axis: "left",
              value: X,
              color: "var(--dsc-amber)",
              label: "Want T"
            },
            { axis: "right", min: K, max: ae, color: "var(--dsc-teal)" }
          ]
        }
      ) }) }) : null,
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(
        Xe,
        {
          label: "CFM OUT",
          value: qe(ee, 0),
          unit: "cfm",
          sub: `Alloc · nameplate ${qe(te, 0)}`
        }
      ) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(
        Xe,
        {
          label: "CFM RECIRC",
          value: qe(U, 0),
          unit: "cfm",
          sub: `Alloc · nameplate ${qe(M, 0)}`
        }
      ) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(Xe, { label: "Intake main", value: qe(i("sensor.dsc_cfm_intake_main"), 0), unit: "cfm" }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(Xe, { label: "Intake 2×4", value: qe(i("sensor.dsc_cfm_intake_2x4"), 0), unit: "cfm" }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsxs(ie, { className: "dsc-glass", title: "Airflow honesty", icon: "climate", children: [
        /* @__PURE__ */ c.jsxs("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: [
          /* @__PURE__ */ c.jsx(W, { label: "Allocated", tone: "ok" }),
          " Prefer allocated CFM over nameplate capacity. Blend OUT/RECIRC is normal — map shows topology. 4×8 LIGHT mark tracks photoperiod window (no main lamp entity yet); 2×4 tracks SF1000."
        ] }),
        /* @__PURE__ */ c.jsx(rc, { tag: "dsc-airflow-map-card", config: {} })
      ] }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsx(ie, { className: "dsc-glass", title: "Exhaust CFM (allocated)", icon: "climate", children: /* @__PURE__ */ c.jsx(
        Dt,
        {
          unit: "cfm",
          lastSyncAt: Math.max(_e.lastSyncAt ?? 0, Ee.lastSyncAt ?? 0) || void 0,
          series: [
            {
              id: "out",
              label: "OUT",
              series: _e.series,
              color: "var(--dsc-blue)",
              unit: "cfm"
            },
            {
              id: "recirc",
              label: "RECIRC",
              series: Ee.series,
              color: "var(--dsc-purple)",
              unit: "cfm"
            }
          ]
        }
      ) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsxs(ie, { className: "dsc-glass", title: "Fan duty %", icon: "climate", children: [
        /* @__PURE__ */ c.jsx(
          Dt,
          {
            unit: "%",
            lastSyncAt: Math.max(Se.lastSyncAt ?? 0, z.lastSyncAt ?? 0) || void 0,
            series: [
              {
                id: "fout",
                label: "OUT %",
                series: Se.series,
                color: "var(--dsc-teal)",
                unit: "%"
              },
              {
                id: "frec",
                label: "RECIRC %",
                series: z.series,
                color: "var(--dsc-amber)",
                unit: "%"
              }
            ]
          }
        ),
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-fan-stack", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ c.jsx(
            Kt,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_main",
              label: "Intake Main",
              disabled: !N
            }
          ),
          /* @__PURE__ */ c.jsx(
            Kt,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_2x4",
              label: "Intake 2×4",
              disabled: !N
            }
          ),
          /* @__PURE__ */ c.jsx(
            Kt,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_room",
              label: "Exhaust room",
              disabled: !N
            }
          ),
          /* @__PURE__ */ c.jsx(
            Kt,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_outside",
              label: "Exhaust outside",
              disabled: !N
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ie, { className: "dsc-glass", title: "Zone gauges", icon: "gauge", children: /* @__PURE__ */ c.jsxs("div", { className: "dsc-gauge-row", children: [
        mt ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsx(
            St,
            {
              label: "Tent T",
              value: Y.value,
              min: 15,
              max: 35,
              unit: "°C",
              target: Q,
              extrema: lt,
              stale: Y.stale,
              onClick: () => b({
                id: "sensor.dsc_hub_tent_temperature",
                label: "Tent T",
                unit: "°C"
              })
            }
          ),
          /* @__PURE__ */ c.jsx(
            St,
            {
              label: "Tent RH",
              value: O.value,
              min: 0,
              max: 100,
              unit: "%",
              band: { min: P, max: ue },
              extrema: Ye,
              stale: O.stale
            }
          ),
          /* @__PURE__ */ c.jsx(
            St,
            {
              label: "VPD",
              value: q.value,
              min: 0,
              max: 2.5,
              unit: "kPa",
              band: { min: S, max: D },
              stale: q.stale
            }
          )
        ] }) : null,
        Ft ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsx(
            St,
            {
              label: "Clone T",
              value: V.value,
              min: 15,
              max: 35,
              unit: "°C",
              target: X,
              stale: V.stale
            }
          ),
          /* @__PURE__ */ c.jsx(
            St,
            {
              label: "Clone RH",
              value: $.value,
              min: 0,
              max: 100,
              unit: "%",
              band: { min: K, max: ae },
              stale: $.stale
            }
          ),
          /* @__PURE__ */ c.jsx(
            St,
            {
              label: "Clone VPD",
              value: i("sensor.dsc_hub_clone_vpd_kpa"),
              min: 0,
              max: 2.5,
              unit: "kPa",
              band: { min: Z, max: he }
            }
          )
        ] }) : null
      ] }) }) })
    ] }),
    /* @__PURE__ */ c.jsx(
      Kr,
      {
        open: y != null,
        onClose: () => b(null),
        entityId: y?.id ?? null,
        label: y?.label ?? "",
        unit: y?.unit
      }
    )
  ] });
}
function Im({ tent: i }) {
  const { state: r, entity: o, num: u, tick: f, callWS: h } = Qe(), g = Ut(), { setFocus: x } = $m(), [v, m] = nc(), [y, b] = j.useState([]);
  j.useEffect(() => {
    x(i);
  }, [i, x]);
  const N = Lx(i, r, o), L = Number(v.get("pot") || 0), G = L >= 1 && L <= 4 && gn(L, r) && N.some((M) => M.pot === L) ? L : null, Y = i === "main" ? "sensor.dsc_hub_tent_temperature" : "sensor.dsc_hub_clone_temperature", O = i === "main" ? "sensor.dsc_hub_tent_humidity" : "sensor.dsc_hub_clone_humidity", V = i === "main" ? "sensor.dsc_hub_vpd_kpa" : "sensor.dsc_hub_clone_vpd_kpa", $ = Re(Y, { hours: 6 }), q = Re(O, { hours: 6 }), le = tt(Y), se = tt(O), re = tt(V), F = r(
    i === "main" ? "binary_sensor.dsc_hub_4x8_window_open" : "binary_sensor.dsc_hub_2x4_window_open"
  ) === "on", oe = r("light.dsc_hub_sf1000_dimmer") === "on", pe = i === "clone" ? oe : F, _e = u(i === "main" ? "sensor.dsc_cfm_intake_main" : "sensor.dsc_cfm_intake_2x4"), Ee = u("sensor.dsc_cfm_exhaust_out_allocated") || u("sensor.dsc_cfm_exhaust_out"), Se = u("sensor.dsc_cfm_exhaust_recirc_allocated") || u("sensor.dsc_cfm_exhaust_recirc"), z = r("switch.dsc_hub_tent_manual_override") === "on";
  j.useEffect(() => {
    let M = !1;
    async function U() {
      if (!h || N.length === 0) {
        b([]);
        return;
      }
      const Q = N.flatMap((S) => [
        `text.dsc_pot${S.pot}_plant_name`,
        `input_select.dsc_pot${S.pot}_tent`,
        `select.dsc_pot${S.pot}_growth_stage`
      ]), P = /* @__PURE__ */ new Date(), ue = new Date(P.getTime() - 48 * 3600 * 1e3);
      try {
        const S = await h({
          type: "history/history_during_period",
          start_time: ue.toISOString(),
          end_time: P.toISOString(),
          significant_changes_only: !0,
          minimal_response: !0,
          no_attributes: !0,
          entity_ids: Q.slice(0, 8)
        });
        if (M || !S) return;
        const D = [];
        for (const [X, K] of Object.entries(S))
          for (const ae of K || []) {
            const Z = typeof ae.lu == "number" ? ae.lu * 1e3 : ae.last_changed ? Date.parse(ae.last_changed) : NaN, he = String(ae.s ?? ae.state ?? "");
            !Number.isFinite(Z) || !he || he === "unavailable" || D.push({ t: Z, text: `${new Date(Z).toLocaleString()} · ${X.split(".").pop()} → ${he}` });
          }
        D.sort((X, K) => K.t - X.t), b(D.slice(0, 40).map((X) => X.text));
      } catch {
        M || b([]);
      }
    }
    return U(), () => {
      M = !0;
    };
  }, [h, N, i]);
  const te = i === "main" ? "Main 4×8" : "Clone 2×4", ee = i === "main" ? "Intake main + cascade in · OUT / RECIRC" : "Intake 2×4 + cascade out · clone mister path";
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      Jt,
      {
        icon: i === "main" ? "tent" : "clone",
        title: te,
        subtitle: `Tent cockpit — ${N.length} seat(s). ${ee}`,
        primaryAction: /* @__PURE__ */ c.jsx(Ue, { teal: !0, onClick: () => g("/live/twin"), children: "Both tents" }),
        actions: /* @__PURE__ */ c.jsx(Ue, { primary: !0, onClick: () => g(`/live/climate?tent=${i}`), children: "Climate Want" })
      }
    ),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-tent-cockpit-strip", children: [
      /* @__PURE__ */ c.jsx(W, { label: `${N.length} plants`, tone: "ok" }),
      /* @__PURE__ */ c.jsx(
        W,
        {
          label: `T ${qe(le.value)}°C`,
          tone: le.stale ? "warn" : "ok"
        }
      ),
      /* @__PURE__ */ c.jsx(
        W,
        {
          label: `RH ${qe(se.value, 0)}%`,
          tone: se.stale ? "warn" : "ok"
        }
      ),
      /* @__PURE__ */ c.jsx(
        W,
        {
          label: `VPD ${qe(re.value, 2)}`,
          tone: re.stale ? "warn" : "ok"
        }
      ),
      /* @__PURE__ */ c.jsx(
        W,
        {
          label: i === "clone" ? pe ? "SF1000 ON" : "SF1000 OFF" : F ? "PHOTO ON" : "PHOTO OFF",
          tone: pe ? "ok" : "muted"
        }
      ),
      /* @__PURE__ */ c.jsx(W, { label: `IN ${qe(_e, 0)} cfm`, tone: "muted" }),
      i === "main" ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
        /* @__PURE__ */ c.jsx(W, { label: `OUT ${qe(Ee, 0)}`, tone: "muted" }),
        /* @__PURE__ */ c.jsx(W, { label: `RECIRC ${qe(Se, 0)}`, tone: "muted" })
      ] }) : /* @__PURE__ */ c.jsx(W, { label: `CFM OUT ${qe(Ee, 0)}`, tone: "muted" })
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ie, { className: "dsc-glass", title: "Want targets", icon: "climate", children: /* @__PURE__ */ c.jsx($r, { only: i, compact: !0 }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ie, { className: "dsc-glass", title: "Seat strip", icon: "seat", children: /* @__PURE__ */ c.jsx("div", { className: "dsc-chip-row", children: N.length === 0 ? /* @__PURE__ */ c.jsx("div", { className: "dsc-empty", children: "No pots assigned — Apply to tent from a seat." }) : N.map((M) => /* @__PURE__ */ c.jsxs(
        "button",
        {
          type: "button",
          className: "dsc-chip dsc-chip--ok",
          onClick: () => {
            const U = new URLSearchParams(v);
            U.set("pot", String(M.pot)), m(U, { replace: !0 });
          },
          children: [
            "P",
            M.pot,
            " ",
            M.plantName,
            " · M ",
            M.moisture,
            " · EC ",
            M.ec
          ]
        },
        M.pot
      )) }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ie, { className: "dsc-glass", title: "Tent history", icon: "climate", children: /* @__PURE__ */ c.jsx(
        Dt,
        {
          live: !0,
          lastSyncAt: Math.max($.lastSyncAt ?? 0, q.lastSyncAt ?? 0) || void 0,
          series: [
            {
              id: "t",
              label: "Temp",
              series: $.series,
              color: "var(--dsc-blue)",
              axis: "left",
              unit: "°C"
            },
            {
              id: "rh",
              label: "RH",
              series: q.series,
              color: "var(--dsc-teal)",
              axis: "right",
              unit: "%"
            }
          ]
        }
      ) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsxs(ie, { className: "dsc-glass", title: "Fans (this tent)", icon: "climate", children: [
        z ? null : /* @__PURE__ */ c.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Fan sliders locked until Fan override is on (Climate → Command)." }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-fan-stack", children: i === "main" ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsx(
            Kt,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_main",
              label: "Intake Main",
              disabled: !z
            }
          ),
          /* @__PURE__ */ c.jsx(
            Kt,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_room",
              label: "Exhaust room (RECIRC)",
              disabled: !z
            }
          ),
          /* @__PURE__ */ c.jsx(
            Kt,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_outside",
              label: "Exhaust outside (OUT)",
              disabled: !z
            }
          )
        ] }) : /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsx(
            Kt,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_2x4",
              label: "Intake 2×4",
              disabled: !z
            }
          ),
          /* @__PURE__ */ c.jsx(
            ke,
            {
              entityId: "light.dsc_hub_sf1000_dimmer",
              label: "SF1000",
              icon: "lighting"
            }
          )
        ] }) })
      ] }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ie, { className: "dsc-glass", title: "Plant log (48h)", icon: "roster", children: y.length === 0 ? /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: "Thin recorder / no recent identity changes — honesty empty, not invented." }) : /* @__PURE__ */ c.jsx("ul", { className: "dsc-fault-list", children: y.map((M) => /* @__PURE__ */ c.jsx("li", { children: /* @__PURE__ */ c.jsx("span", { className: "dsc-muted", style: { fontFamily: "var(--dsc-mono)", fontSize: 12 }, children: M }) }, M)) }) }) })
    ] }),
    /* @__PURE__ */ c.jsx(
      ji,
      {
        open: G != null,
        onClose: () => {
          const M = new URLSearchParams(v);
          M.delete("pot"), m(M, { replace: !0 });
        },
        title: G != null ? `Plant seat · POT${G}` : "Plant seat",
        children: G != null ? /* @__PURE__ */ c.jsx(
          Fr,
          {
            pot: G,
            onSelectPot: (M) => {
              const U = new URLSearchParams(v);
              U.set("pot", String(M)), m(U, { replace: !0 });
            }
          }
        ) : null
      }
    )
  ] });
}
function Jx() {
  return /* @__PURE__ */ c.jsx(Im, { tent: "main" });
}
function Fx() {
  return /* @__PURE__ */ c.jsx(Im, { tent: "clone" });
}
function Wx() {
  const { state: i, entity: r, tick: o, num: u } = Qe(), [f, h] = nc(), g = xn(i).map((b) => wi(b, { state: i, entity: r })), x = Number(f.get("pot") || 0), v = x >= 1 && x <= 4 && gn(x, i) ? x : null, m = (b) => {
    const N = new URLSearchParams(f);
    N.set("pot", String(b)), h(N, { replace: !0 });
  }, y = () => {
    const b = new URLSearchParams(f);
    b.delete("pot"), h(b, { replace: !0 });
  };
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      Jt,
      {
        icon: "root",
        title: "Root",
        subtitle: "Fleet glance — dryback / nutrition / Need. Click a row for seat + history."
      }
    ),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ c.jsx(Xe, { label: "Coldest root", value: qe(u("sensor.dsc_coldest_root_zone_temp")), unit: "°C" }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ c.jsx(Xe, { label: "Heat mat on time", value: qe(u("sensor.dsc_heatmat_relay_on_time"), 0), unit: "s" }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ c.jsx(ie, { title: "Notes", children: /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: "Mat loop uses per-pot sense with plausibility filter." }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ie, { className: "dsc-glass", title: "Dryback strip", icon: "gauge", children: /* @__PURE__ */ c.jsx("div", { className: "dsc-gauge-row", children: xn(i).map((b) => /* @__PURE__ */ c.jsx(Px, { pot: b, onOpen: () => m(b) }, b)) }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ie, { className: "dsc-glass dsc-root-matrix", title: "Fleet matrix", icon: "root", children: /* @__PURE__ */ c.jsxs("table", { className: "dsc-table", children: [
        /* @__PURE__ */ c.jsx("thead", { children: /* @__PURE__ */ c.jsxs("tr", { children: [
          /* @__PURE__ */ c.jsx("th", { children: "Pot" }),
          /* @__PURE__ */ c.jsx("th", { children: "Name" }),
          /* @__PURE__ */ c.jsx("th", { children: "Tent" }),
          /* @__PURE__ */ c.jsx("th", { children: "M%" }),
          /* @__PURE__ */ c.jsx("th", { children: "Dryback" }),
          /* @__PURE__ */ c.jsx("th", { children: "EC" }),
          /* @__PURE__ */ c.jsx("th", { children: "pH" }),
          /* @__PURE__ */ c.jsx("th", { children: "Need" }),
          /* @__PURE__ */ c.jsx("th", { children: "Rate" }),
          /* @__PURE__ */ c.jsx("th", { children: "Trend" })
        ] }) }),
        /* @__PURE__ */ c.jsx("tbody", { children: g.map((b) => /* @__PURE__ */ c.jsx(Ix, { pot: b.pot, onOpen: () => m(b.pot) }, b.pot)) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ c.jsx(
      ji,
      {
        open: v != null,
        onClose: y,
        title: v != null ? `Plant seat · POT${v}` : "Plant seat",
        children: v != null ? /* @__PURE__ */ c.jsx(Fr, { pot: v, onSelectPot: m }) : null
      }
    )
  ] });
}
function Px({ pot: i, onOpen: r }) {
  const o = tt(`sensor.dsc_pot${i}_dryback_pct`);
  return /* @__PURE__ */ c.jsx(
    St,
    {
      label: `P${i}`,
      value: o.value,
      min: 0,
      max: 100,
      unit: "%",
      stale: o.stale,
      band: { min: 0, max: 45 },
      onClick: r
    }
  );
}
function Ix({ pot: i, onOpen: r }) {
  const { state: o, entity: u, available: f } = Qe(), h = wi(i, { state: o, entity: u }), g = la(i, "moisture", o), x = Re(g, { hours: 6, maxPoints: 48 }), v = tt(`sensor.dsc_pot${i}_dryback_pct`), m = `sensor.dsc_pot${i}_soil_moisture_rate`, y = tt(m), b = f(m) || y.stale ? y.value : NaN, N = v.stale ? "dsc-tone-stale" : Number.isFinite(v.value) && v.value > 55 ? "dsc-tone-bad" : Number.isFinite(v.value) && v.value > 40 ? "dsc-tone-warn" : "dsc-tone-ok";
  return /* @__PURE__ */ c.jsxs("tr", { onClick: r, style: { cursor: "pointer" }, children: [
    /* @__PURE__ */ c.jsxs("td", { children: [
      "P",
      i
    ] }),
    /* @__PURE__ */ c.jsx("td", { children: h.plantName }),
    /* @__PURE__ */ c.jsx("td", { children: /* @__PURE__ */ c.jsx(W, { label: uc(h.tent), tone: h.tent === "unassigned" ? "muted" : "ok" }) }),
    /* @__PURE__ */ c.jsx("td", { children: h.moisture }),
    /* @__PURE__ */ c.jsx("td", { className: N, children: qe(v.value, 0) }),
    /* @__PURE__ */ c.jsx("td", { children: h.ec }),
    /* @__PURE__ */ c.jsx("td", { children: h.ph }),
    /* @__PURE__ */ c.jsx("td", { children: h.need }),
    /* @__PURE__ */ c.jsx("td", { className: y.stale ? "dsc-tone-stale" : void 0, children: Number.isFinite(b) ? b.toFixed(2) : "—" }),
    /* @__PURE__ */ c.jsx("td", { children: /* @__PURE__ */ c.jsx(wa, { series: x.series, color: "var(--dsc-blue)", width: 90, height: 24 }) })
  ] });
}
function ey() {
  const { state: i, num: r } = Qe(), o = Ut(), u = i("binary_sensor.dsc_clone_dark_period_violation") === "on", f = i("light.dsc_hub_sf1000_dimmer") === "on";
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      Jt,
      {
        icon: "lighting",
        title: "Light",
        subtitle: "Photoperiod, SF1000, expected hours — Want stays on Climate.",
        primaryAction: /* @__PURE__ */ c.jsx(Ue, { teal: !0, onClick: () => o("/live/climate"), children: "Climate Want" })
      }
    ),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-status-strip", children: [
      /* @__PURE__ */ c.jsx(
        W,
        {
          icon: u ? "alert" : "ok",
          label: u ? "CLONE DARK VIOLATION" : "Dark period OK",
          tone: u ? "bad" : "ok",
          pulse: u
        }
      ),
      /* @__PURE__ */ c.jsx(W, { label: f ? "SF1000 ON" : "SF1000 OFF", tone: f ? "ok" : "muted" })
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ c.jsx(
        Xe,
        {
          label: "Expected light hours",
          value: qe(r("sensor.dsc_expected_light_hours"), 1),
          unit: "h"
        }
      ) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-8", children: /* @__PURE__ */ c.jsxs(ie, { className: "dsc-glass", title: "SF1000", icon: "lighting", children: [
        /* @__PURE__ */ c.jsx("div", { className: "dsc-demand-row", children: /* @__PURE__ */ c.jsx(
          ke,
          {
            entityId: "light.dsc_hub_sf1000_dimmer",
            label: "SF1000",
            icon: "lighting",
            showBrightness: !0
          }
        ) }),
        /* @__PURE__ */ c.jsxs("p", { className: "dsc-muted", style: { margin: "8px 0 0" }, children: [
          "Expected: ",
          i("sensor.dsc_expected_light_hours", "—"),
          ". Clone dark violation is binary — schedule edits belong on Climate / packages, not invented here."
        ] })
      ] }) })
    ] })
  ] });
}
function vn(i, r = 1) {
  return Number.isFinite(i) ? i.toFixed(r) : "—";
}
function ty() {
  const { state: i, num: r, available: o, entity: u } = Qe(), f = o("sensor.dsc_cfm_exhaust_out_allocated") ? r("sensor.dsc_cfm_exhaust_out_allocated") : r("sensor.dsc_cfm_exhaust_out"), h = o("sensor.dsc_cfm_exhaust_recirc_allocated") ? r("sensor.dsc_cfm_exhaust_recirc_allocated") : r("sensor.dsc_cfm_exhaust_recirc"), g = i("sensor.dsc_learn_status", "—"), x = i("binary_sensor.dsc_learn_gate", i("sensor.dsc_learn_gate", "—")), v = String(u("sensor.dsc_cfm_exhaust_out")?.attributes?.cal_curve ?? "");
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      Jt,
      {
        icon: "learning",
        title: "Learning",
        subtitle: "Learn status, CFM honesty, kit — wizard math stays in Lovelace/brain."
      }
    ),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(
        Xe,
        {
          label: "CFM OUT alloc",
          value: vn(f, 0),
          unit: "cfm",
          sub: `Nameplate ${vn(r("sensor.dsc_cfm_exhaust_out"), 0)}`
        }
      ) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(
        Xe,
        {
          label: "CFM RECIRC alloc",
          value: vn(h, 0),
          unit: "cfm",
          sub: `Nameplate ${vn(r("sensor.dsc_cfm_exhaust_recirc"), 0)}`
        }
      ) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(Xe, { label: "Intake main", value: vn(r("sensor.dsc_cfm_intake_main"), 0), unit: "cfm" }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(Xe, { label: "Intake 2×4", value: vn(r("sensor.dsc_cfm_intake_2x4"), 0), unit: "cfm" }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsxs(ie, { className: "dsc-glass", title: "Learn status", icon: "learning", children: [
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-chip-row", children: [
          /* @__PURE__ */ c.jsx(W, { label: `Status ${g}`, tone: g === "—" ? "muted" : "ok" }),
          /* @__PURE__ */ c.jsx(W, { label: `Gate ${x}`, tone: "muted" }),
          /* @__PURE__ */ c.jsx(
            W,
            {
              label: `Beat ${i("sensor.dsc_hub_heartbeat", "—")}`,
              tone: o("sensor.dsc_hub_heartbeat") ? "ok" : "bad"
            }
          )
        ] }),
        /* @__PURE__ */ c.jsxs("p", { className: "dsc-honesty", style: { marginBottom: 0 }, children: [
          /* @__PURE__ */ c.jsx(W, { icon: "alert", label: "Nameplate", tone: "warn" }),
          " CFM figures are allocated / nameplate proxies unless cal curves exist",
          v ? ` (${v})` : " (no curve attrs)",
          "."
        ] }),
        /* @__PURE__ */ c.jsxs("p", { className: "dsc-muted", style: { marginBottom: 0 }, children: [
          "Surface: ",
          i("sensor.dsc_ha_surface_version", "7.1.1"),
          ". Full anemometer wizard remains on Lovelace Learning — open dsc-hub-pro Learning for unported steps."
        ] })
      ] }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsx(ie, { className: "dsc-glass", title: "Kit / In service", icon: "settings", children: /* @__PURE__ */ c.jsxs("div", { className: "dsc-mode-row", children: [
        /* @__PURE__ */ c.jsx(ke, { entityId: "input_boolean.dsc_ac_in_service", label: "AC in service", icon: "climate" }),
        /* @__PURE__ */ c.jsx(
          ke,
          {
            entityId: "input_boolean.dsc_clone_humidifier_in_service",
            label: "Clone mister",
            icon: "clone"
          }
        )
      ] }) }) })
    ] })
  ] });
}
function ly() {
  const { state: i, num: r, available: o } = Qe(), { hours: u, setHours: f, maxPoints: h } = sc(6), g = Re("sensor.dsc_hub_tent_temperature", { maxPoints: h, hours: u }), x = Re("sensor.dsc_hub_tent_humidity", { maxPoints: h, hours: u }), v = Re(
    "sensor.dsc_cfm_exhaust_out_allocated",
    { maxPoints: h, hours: u }
  ), m = Re(
    "sensor.dsc_cfm_exhaust_recirc_allocated",
    { maxPoints: h, hours: u }
  ), y = Re(la(1, "moisture", i), { maxPoints: h, hours: u }), b = Re("sensor.dsc_pot1_dryback_pct", { maxPoints: h, hours: u }), N = Re(la(2, "moisture", i), { maxPoints: h, hours: u }), L = Re(la(4, "moisture", i), { maxPoints: h, hours: u }), G = Re(la(1, "ec", i), { maxPoints: h, hours: u }), Y = r("input_number.dsc_pot1_learned_ec_per_moisture"), O = o("input_number.dsc_pot1_learned_ec_per_moisture") && Number.isFinite(Y) && Y !== 0 ? Y : NaN;
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      Jt,
      {
        icon: "analytics",
        title: "Analytics",
        subtitle: "History-seeded trends — climate + root pack. Change timespan to zoom."
      }
    ),
    /* @__PURE__ */ c.jsx("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: /* @__PURE__ */ c.jsx(cc, { hours: u, setHours: f }) }),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ie, { className: "dsc-glass", title: "Tent T + RH", icon: "climate", children: /* @__PURE__ */ c.jsx(
        Dt,
        {
          live: !0,
          lastSyncAt: Math.max(g.lastSyncAt ?? 0, x.lastSyncAt ?? 0) || void 0,
          series: [
            {
              id: "t",
              label: "Temp °C",
              series: g.series,
              color: "var(--dsc-blue)",
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
          ]
        }
      ) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ie, { className: "dsc-glass", title: "Exhaust CFM (allocated)", icon: "climate", children: /* @__PURE__ */ c.jsx(
        Dt,
        {
          live: !0,
          unit: "cfm",
          lastSyncAt: Math.max(v.lastSyncAt ?? 0, m.lastSyncAt ?? 0) || void 0,
          series: [
            {
              id: "out",
              label: "OUT",
              series: v.series,
              color: "var(--dsc-blue)",
              unit: "cfm"
            },
            {
              id: "recirc",
              label: "RECIRC",
              series: m.series,
              color: "var(--dsc-purple)",
              unit: "cfm"
            }
          ]
        }
      ) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ie, { className: "dsc-glass", title: "Root pack — moisture", icon: "root", children: /* @__PURE__ */ c.jsx(
        Dt,
        {
          live: !0,
          unit: "%",
          lastSyncAt: Math.max(y.lastSyncAt ?? 0, N.lastSyncAt ?? 0, L.lastSyncAt ?? 0) || void 0,
          series: [
            { id: "p1", label: "P1", series: y.series, color: "var(--dsc-blue)", unit: "%" },
            { id: "p2", label: "P2", series: N.series, color: "var(--dsc-teal)", unit: "%" },
            { id: "p4", label: "P4", series: L.series, color: "var(--dsc-purple)", unit: "%" }
          ]
        }
      ) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ie, { className: "dsc-glass", title: "P1 dryback", icon: "root", children: /* @__PURE__ */ c.jsx(
        Dt,
        {
          live: !0,
          unit: "%",
          lastSyncAt: b.lastSyncAt,
          series: [
            {
              id: "db",
              label: "Dryback",
              series: b.series,
              color: "var(--dsc-amber)",
              unit: "%"
            }
          ]
        }
      ) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsxs(ie, { className: "dsc-glass", title: "P1 EC", icon: "root", children: [
        /* @__PURE__ */ c.jsx(
          Dt,
          {
            live: !0,
            lastSyncAt: G.lastSyncAt,
            series: [
              {
                id: "ec",
                label: "EC",
                series: G.series,
                color: "var(--dsc-amber)",
                unit: ""
              }
            ]
          }
        ),
        /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: Number.isFinite(O) ? `EC consumption honesty: learned ${O.toFixed(3)} EC per moisture (not feed invent).` : "EC over time shown — no learned_ec_per_moisture yet (not invented)." })
      ] }) })
    ] })
  ] });
}
function ay() {
  const { state: i, available: r, num: o } = Qe(), u = r("sensor.dsc_hub_uptime");
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      Jt,
      {
        icon: "fleet",
        title: "Fleet",
        subtitle: "Diagnostics, versions, kit densify, system map, tank note."
      }
    ),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ c.jsx(
        Xe,
        {
          label: "Hub link",
          value: u ? "OK" : "DOWN",
          tone: u ? "ok" : "bad",
          sub: `Uptime raw ${i("sensor.dsc_hub_uptime", "—")}`
        }
      ) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ c.jsx(
        Xe,
        {
          label: "Surface",
          value: i("sensor.dsc_ha_surface_version", "7.1.1"),
          sub: "Panel product shell"
        }
      ) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ c.jsx(
        Xe,
        {
          label: "Alerts",
          value: Number.isFinite(o("sensor.dsc_active_alert_count")) ? o("sensor.dsc_active_alert_count") : "—",
          tone: o("sensor.dsc_active_alert_count", 0) === 0 ? "ok" : "bad"
        }
      ) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ie, { className: "dsc-glass", title: "Kit / In service", icon: "settings", children: /* @__PURE__ */ c.jsxs("div", { className: "dsc-mode-row", children: [
        /* @__PURE__ */ c.jsx(ke, { entityId: "input_boolean.dsc_ac_in_service", label: "AC in service", icon: "climate" }),
        /* @__PURE__ */ c.jsx(
          ke,
          {
            entityId: "input_boolean.dsc_clone_humidifier_in_service",
            label: "Clone mister",
            icon: "clone"
          }
        ),
        /* @__PURE__ */ c.jsx(ke, { entityId: "input_boolean.dsc_pot1_in_service", label: "Pot 1", icon: "root" }),
        /* @__PURE__ */ c.jsx(ke, { entityId: "input_boolean.dsc_pot2_in_service", label: "Pot 2", icon: "root" }),
        /* @__PURE__ */ c.jsx(ke, { entityId: "input_boolean.dsc_pot3_in_service", label: "Pot 3", icon: "root" }),
        /* @__PURE__ */ c.jsx(ke, { entityId: "input_boolean.dsc_pot4_in_service", label: "Pot 4", icon: "root" })
      ] }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ie, { className: "dsc-glass", title: "System map", icon: "system", children: /* @__PURE__ */ c.jsx(rc, { tag: "dsc-system-map-card", config: {} }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsx(ie, { className: "dsc-glass", title: "Fleet version", icon: "fleet", children: /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: i("sensor.dsc_fleet_version_status", "—") }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsx(ie, { className: "dsc-glass", title: "Tank", icon: "tank", children: /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "Reservoir / tank vitals land here as hardware comes online. Map above stays the topology view; do not invent tank sensors." }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ie, { className: "dsc-glass", title: "Panel", icon: "system", children: /* @__PURE__ */ c.jsxs("p", { className: "dsc-muted", style: { marginTop: 0 }, children: [
        "Custom panel ",
        /* @__PURE__ */ c.jsx("code", { children: "/dsc-hub" }),
        " · React + Vite · assets under",
        " ",
        /* @__PURE__ */ c.jsx("code", { children: "/dsc_hub/assets" }),
        "."
      ] }) }) })
    ] })
  ] });
}
const ny = [
  { id: "live", label: "Live", path: "/live/mission", icon: "live" },
  { id: "grow", label: "Grow", path: "/grow/compose", icon: "grow" },
  { id: "tune", label: "Tune", path: "/tune/learning", icon: "tune" },
  { id: "fleet", label: "Fleet", path: "/fleet", icon: "fleet" }
], iy = {
  live: [
    { id: "mission", label: "Mission", path: "/live/mission", icon: "mission" },
    { id: "twin", label: "Twin", path: "/live/twin", icon: "twin" },
    { id: "climate", label: "Climate", path: "/live/climate", icon: "climate" },
    { id: "main", label: "Main", path: "/live/main", icon: "tent" },
    { id: "clone", label: "Clone", path: "/live/clone", icon: "clone" },
    { id: "root", label: "Root", path: "/live/root", icon: "root" },
    { id: "light", label: "Light", path: "/live/light", icon: "lighting" }
  ],
  grow: [
    { id: "compose", label: "Compose", path: "/grow/compose", icon: "compose" },
    { id: "research", label: "Research", path: "/grow/research", icon: "research" },
    { id: "roster", label: "Roster", path: "/grow/roster", icon: "roster" }
  ],
  tune: [
    { id: "learning", label: "Learning", path: "/tune/learning", icon: "learning" },
    { id: "analytics", label: "Analytics", path: "/tune/analytics", icon: "analytics" }
  ],
  fleet: [{ id: "overview", label: "Overview", path: "/fleet", icon: "fleet" }]
}, sy = {
  "/": "/live/mission",
  "/ops": "/live/mission",
  "/ops/home": "/live/mission",
  "/ops/dash": "/live/twin",
  "/ops/climate": "/live/climate",
  "/ops/main-4x8": "/live/main",
  "/ops/clone-2x4": "/live/clone",
  "/ops/root-zone": "/live/root",
  "/ops/plant-seat": "/live/root",
  "/ops/tank": "/fleet",
  "/ops/lighting": "/live/light",
  "/plant": "/grow/roster",
  "/plant/build": "/grow/compose",
  "/plant/catalog": "/grow/research",
  "/plant/seat": "/grow/roster",
  "/plant/strains": "/grow/roster",
  "/plant/nutrient": "/grow/compose",
  "/advanced": "/tune/learning",
  "/advanced/learning": "/tune/learning",
  "/advanced/trends": "/tune/analytics",
  "/advanced/history": "/tune/analytics",
  "/system": "/fleet"
};
function cy(i) {
  return i.startsWith("/grow") || i.startsWith("/plant") ? "grow" : i.startsWith("/tune") || i.startsWith("/advanced") ? "tune" : i.startsWith("/fleet") || i.startsWith("/system") ? "fleet" : "live";
}
function uy(i, r) {
  const o = sy[i];
  return o ? o.includes("?") ? o : `${o}${r || ""}` : null;
}
const ry = ':host,.dsc-root{--dsc-black: #0c1220;--dsc-black-2: #121a2c;--dsc-gray-1: #182238;--dsc-gray-2: #22304c;--dsc-gray-3: #334566;--dsc-gray-4: #8b95ab;--dsc-gray-5: #b6bfd4;--dsc-blue: #5b9bff;--dsc-blue-dim: rgba(91, 155, 255, .4);--dsc-purple: #a78bfa;--dsc-purple-dim: rgba(167, 139, 250, .35);--dsc-neon: #3dde7a;--dsc-neon-dim: rgba(61, 222, 122, .32);--dsc-neon-glow: rgba(61, 222, 122, .4);--dsc-teal: #2ec4d6;--dsc-teal-dim: rgba(46, 196, 214, .45);--dsc-teal-glow: rgba(46, 196, 214, .55);--dsc-amber: #ffb74d;--dsc-bad: #ff6b8a;--dsc-bad-soft: #ff8aa3;--dsc-soil-1: #5b9f6b;--dsc-soil-2: #4a8f9f;--dsc-soil-3: #c4a35a;--dsc-soil-4: #8d6e63;--dsc-glass: rgba(18, 26, 44, .78);--dsc-glass-border: rgba(130, 165, 230, .34);--dsc-white: #f2f5fb;--dsc-shadow: 0 8px 24px rgba(0, 0, 0, .45);--dsc-shadow-tight: 0 2px 8px rgba(0, 0, 0, .55);--dsc-radius: 10px;--dsc-radius-lg: 14px;--dsc-font: "Segoe UI", "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;--dsc-mono: "Cascadia Code", "IBM Plex Mono", ui-monospace, monospace;color:var(--dsc-white);background:var(--dsc-black);font-family:var(--dsc-font);display:block;height:100%;box-sizing:border-box}*,*:before,*:after{box-sizing:border-box}.dsc-root{height:100%;min-height:100%;overflow:auto;background:radial-gradient(1100px 560px at 8% -12%,rgba(91,155,255,.18),transparent 55%),radial-gradient(900px 520px at 92% -8%,rgba(46,196,214,.12),transparent 50%),radial-gradient(700px 420px at 70% 100%,rgba(61,222,122,.05),transparent 55%),var(--dsc-black)}.dsc-honesty-rail{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}.dsc-row-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.dsc-next-rec{border-color:var(--dsc-blue-dim)}.dsc-twin-keepalive{display:none;margin-bottom:12px;min-height:0}.dsc-twin-keepalive.is-active{display:block;min-height:min(70vh,720px)}.dsc-twin-keepalive-host{min-height:min(68vh,700px)}.dsc-twin-keepalive-host>*{min-height:min(68vh,700px)}.dsc-tab--live.active{color:var(--dsc-blue);border-color:var(--dsc-blue-dim)}.dsc-tab--grow.active{color:var(--dsc-teal);border-color:var(--dsc-teal-dim)}.dsc-tab--tune.active{color:var(--dsc-purple);border-color:var(--dsc-purple-dim)}.dsc-tab--fleet.active{color:var(--dsc-blue);border-color:var(--dsc-blue-dim)}.dsc-secondary-tabs .dsc-tab.active{color:var(--dsc-teal);border-color:var(--dsc-teal-dim);box-shadow:0 0 0 1px var(--dsc-blue-dim)}.dsc-tent-segment{display:inline-flex;gap:4px;padding:3px;border-radius:999px;background:var(--dsc-gray-1);border:1px solid var(--dsc-glass-border)}.dsc-tent-segment button{appearance:none;border:0;background:transparent;color:var(--dsc-gray-5);padding:6px 12px;border-radius:999px;cursor:pointer;font:inherit;font-size:.85rem}.dsc-tent-segment button.is-active{background:var(--dsc-gray-2);color:var(--dsc-white);box-shadow:var(--dsc-shadow-tight)}.dsc-tent-segment button[data-tent=main].is-active{color:var(--dsc-blue)}.dsc-tent-segment button[data-tent=clone].is-active{color:var(--dsc-purple)}.dsc-tent-segment button[data-tent=compare].is-active{color:var(--dsc-teal)}.dsc-shell{display:flex;flex-direction:column;min-height:100%;max-width:1600px;margin:0 auto;padding:16px 20px 28px}.dsc-brand-row{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:10px}.dsc-brand{display:flex;align-items:center;gap:12px;color:var(--dsc-white);text-decoration:none}.dsc-brand img,.dsc-brand svg{width:36px;height:36px;color:var(--dsc-neon)}.dsc-brand-title{display:flex;flex-direction:column;gap:2px}.dsc-brand-title strong{font-size:1.05rem;letter-spacing:.04em;font-weight:700;line-height:1.25;max-width:min(52vw,28rem)}.dsc-brand-wordmark{height:18px;width:auto;max-width:160px;display:block;color:var(--dsc-text, #eef1f8);line-height:0}.dsc-brand-wordmark svg{width:auto;height:18px;display:block}.dsc-icon svg{width:100%;height:100%;display:block}.dsc-brand-title span{font-size:.72rem;color:var(--dsc-gray-5);letter-spacing:.08em;text-transform:uppercase}.dsc-page-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px}.dsc-page-header-main{display:flex;align-items:flex-start;gap:10px}.dsc-page-header-actions{display:flex;align-items:center;gap:6px;flex-shrink:0}.dsc-card-title{display:inline-flex;align-items:center;gap:8px}.dsc-primary-tabs,.dsc-secondary-tabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:thin;padding-bottom:2px;-webkit-overflow-scrolling:touch}.dsc-primary-tabs{border-bottom:1px solid var(--dsc-gray-3);margin-bottom:8px}.dsc-secondary-tabs{margin-bottom:16px;mask-image:linear-gradient(90deg,#000 85%,transparent)}.dsc-secondary-tabs:after{content:"";flex:0 0 12px}.dsc-tab{appearance:none;border:1px solid transparent;background:transparent;color:var(--dsc-gray-5);padding:10px 14px;min-height:44px;border-radius:8px 8px 0 0;cursor:pointer;font:inherit;font-size:.92rem;letter-spacing:.04em;white-space:nowrap;display:inline-flex;align-items:center;gap:8px;transition:transform .1s ease,box-shadow .1s ease,color .15s ease,border-color .15s ease,background .15s ease;text-decoration:none}.dsc-tab span[role=img]{opacity:.9;flex-shrink:0}.dsc-tab:hover{color:var(--dsc-white);background:var(--dsc-gray-1)}.dsc-tab:focus-visible{outline:2px solid var(--dsc-neon);outline-offset:2px}.dsc-tab.active{color:var(--dsc-white);border-bottom:2px solid var(--dsc-neon);box-shadow:0 6px 18px #39ff1414}.dsc-secondary-tabs .dsc-tab{border-radius:999px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-1);min-height:40px;padding:8px 14px}.dsc-secondary-tabs .dsc-tab.active{border-color:var(--dsc-neon-dim);color:var(--dsc-neon);background:#39ff1414;box-shadow:var(--dsc-shadow-tight)}.dsc-btn{appearance:none;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);border-radius:8px;padding:10px 16px;min-height:40px;font:inherit;cursor:pointer;box-shadow:var(--dsc-shadow-tight);transition:transform .1s ease,box-shadow .1s ease,border-color .12s ease,background .12s ease}.dsc-btn:hover{border-color:var(--dsc-neon-dim)}.dsc-btn:active,.dsc-tab:active{transform:translateY(1px);box-shadow:0 1px 3px #000000a6}.dsc-btn.primary{border-color:var(--dsc-neon-dim);color:var(--dsc-black);background:var(--dsc-neon);font-weight:650}.dsc-page{animation:dsc-fade .18s ease}@keyframes dsc-fade{0%{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.dsc-page,.dsc-btn,.dsc-tab,.dsc-live-pulse{animation:none!important;transition:none!important}}.dsc-grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:14px}.dsc-col-3{grid-column:span 3}.dsc-col-4{grid-column:span 4}.dsc-col-6{grid-column:span 6}.dsc-col-8{grid-column:span 8}.dsc-col-12{grid-column:span 12}@media(max-width:1100px){.dsc-col-3,.dsc-col-4{grid-column:span 6}.dsc-col-8{grid-column:span 12}}@media(max-width:720px){.dsc-shell{padding:12px}.dsc-col-3,.dsc-col-4,.dsc-col-6,.dsc-col-8{grid-column:span 12}}.dsc-card{background:linear-gradient(165deg,var(--dsc-gray-1),var(--dsc-black-2));border:1px solid var(--dsc-gray-3);border-radius:var(--dsc-radius);box-shadow:var(--dsc-shadow);padding:14px 16px;min-height:88px}.dsc-card h2,.dsc-card h3{margin:0 0 8px;font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;color:var(--dsc-gray-5);font-weight:600}.dsc-kpi-value{font-size:1.85rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:.02em;color:var(--dsc-white)}.dsc-kpi-unit{margin-left:6px;font-size:.85rem;color:var(--dsc-gray-5)}.dsc-kpi-sub{margin-top:6px;color:var(--dsc-gray-5);font-size:.82rem}.dsc-status-ok{color:var(--dsc-neon)}.dsc-status-bad{color:var(--dsc-bad)}.dsc-status-muted{color:var(--dsc-gray-5)}.dsc-page-title{margin:0 0 14px;font-size:1.35rem;letter-spacing:.04em}.dsc-muted{color:var(--dsc-gray-5)}.dsc-legacy-host{min-height:420px;border-radius:var(--dsc-radius);overflow:hidden;border:1px solid var(--dsc-gray-3);background:#000}.dsc-legacy-host--empty{background:var(--dsc-gray-1);min-height:160px}.dsc-legacy-host>*{display:block;width:100%}.dsc-status-strip{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}.dsc-chip-row{display:flex;flex-wrap:wrap;gap:8px}.dsc-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-1);font-size:.75rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-chip--ok{color:var(--dsc-neon);border-color:var(--dsc-neon-dim);background:#39ff1414;box-shadow:0 0 12px #39ff141f}.dsc-chip--bad{color:var(--dsc-bad-soft);border-color:color-mix(in srgb,var(--dsc-bad) 45%,transparent);background:color-mix(in srgb,var(--dsc-bad) 12%,transparent)}.dsc-chip--warn{color:var(--dsc-amber);border-color:color-mix(in srgb,var(--dsc-amber) 45%,transparent);background:color-mix(in srgb,var(--dsc-amber) 12%,transparent)}.dsc-chip--muted{color:var(--dsc-gray-5)}.dsc-chip--pulse{animation:dsc-chip-pulse 1.6s ease-in-out infinite}@keyframes dsc-chip-pulse{0%,to{box-shadow:0 0 #39ff1400}50%{box-shadow:0 0 14px #39ff1459}}.dsc-demand-row{display:flex;flex-wrap:wrap;gap:8px}.dsc-demand-row--stack{flex-direction:column}.dsc-demand{appearance:none;flex:1 1 110px;min-height:52px;padding:10px 12px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);font:inherit;cursor:pointer;display:flex;flex-direction:column;align-items:flex-start;gap:4px;box-shadow:var(--dsc-shadow-tight);transition:transform .1s ease,box-shadow .1s ease,border-color .12s ease,background .12s ease}.dsc-demand:hover{border-color:var(--dsc-neon-dim)}.dsc-demand:active{transform:translateY(1px);box-shadow:0 1px 3px #000000a6}.dsc-demand.is-on{border-color:var(--dsc-neon);background:#39ff141a;box-shadow:0 0 0 1px #39ff1440,0 0 18px #39ff1433}.dsc-demand.is-missing{opacity:.55;cursor:not-allowed}.dsc-demand-label{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-demand.is-on .dsc-demand-label{color:var(--dsc-neon)}.dsc-demand-state{font-weight:700;font-variant-numeric:tabular-nums;font-size:1rem}.dsc-demand-icon{margin-bottom:4px;opacity:.95}.dsc-mode-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}.dsc-mode-selects{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}.dsc-entity-select{display:flex;flex-direction:column;gap:6px;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-entity-select-label{display:inline-flex;align-items:center;gap:6px}.dsc-entity-select select{appearance:none;min-height:40px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);padding:8px 12px;font:inherit;text-transform:none;letter-spacing:0}.dsc-entity-select.is-disabled{opacity:.55}.dsc-fan-stack{display:flex;flex-direction:column;gap:10px}.dsc-fan-slider{display:flex;flex-direction:column;gap:4px}.dsc-fan-slider-label{display:flex;align-items:baseline;gap:8px;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-fan-slider-label strong{color:var(--dsc-teal);font-variant-numeric:tabular-nums}.dsc-fan-slider input[type=range]{width:100%;accent-color:var(--dsc-teal)}.dsc-fan-slider.is-disabled{opacity:.5}.dsc-honesty{margin:10px 0 0;font-size:.85rem;color:var(--dsc-gray-5);display:flex;flex-wrap:wrap;align-items:center;gap:8px}.dsc-target-panel{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}.dsc-target-panel.is-compact .dsc-target-grid{grid-template-columns:repeat(auto-fit,minmax(90px,1fr))}.dsc-tent-targets{border:1px solid var(--dsc-glass-border);border-radius:var(--dsc-radius);padding:10px 12px;background:#0000002e}.dsc-tent-targets-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}.dsc-got-want{display:flex;flex-direction:column;gap:2px;font-size:.82rem;margin-bottom:10px}.dsc-target-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px}.dsc-target-num{display:flex;flex-direction:column;gap:4px;font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-target-num input{min-height:36px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);padding:6px 8px;font:inherit;font-variant-numeric:tabular-nums}.dsc-target-num.is-disabled{opacity:.55}.dsc-chart{position:relative}.dsc-chart-svg{cursor:crosshair;touch-action:none}.dsc-chart-tooltip{position:absolute;top:8px;transform:translate(-50%);pointer-events:none;z-index:2;min-width:120px;padding:8px 10px;border-radius:8px;border:1px solid var(--dsc-glass-border);background:var(--dsc-glass);backdrop-filter:blur(10px);box-shadow:var(--dsc-shadow-tight);font-size:.75rem}.dsc-chart-tooltip-time{color:var(--dsc-teal);font-family:var(--dsc-mono);margin-bottom:4px}.dsc-chart-tooltip-row{display:flex;align-items:center;gap:6px;color:var(--dsc-white)}.dsc-chart-tooltip-row i{width:7px;height:7px;border-radius:50%;display:inline-block}@keyframes dsc-sync-pulse{0%{stroke-dashoffset:1;opacity:.2}35%{opacity:1}to{stroke-dashoffset:0;opacity:0}}@media(prefers-reduced-motion:reduce){.dsc-chart-pulse{animation:none!important;opacity:.85}}.dsc-gauge.is-warn .dsc-gauge-label{color:var(--dsc-amber)}.dsc-gauge-row{display:flex;justify-content:space-around;flex-wrap:wrap;gap:8px}.dsc-gauge-matrix{display:flex;flex-direction:column;gap:8px}.dsc-gauge-row-3{display:grid;grid-template-columns:14px repeat(3,minmax(0,1fr));align-items:center;gap:2px 4px;border:1px solid transparent;border-radius:12px;padding:2px 4px 4px;transition:box-shadow .25s ease,border-color .25s ease,background .25s ease}.dsc-gauge-row-3.is-lit{border-color:#ffd54f80;background:linear-gradient(180deg,#ffc1071a,#0c121c59);box-shadow:0 0 28px #ffc10747,inset 0 0 16px #ffd54f12}.dsc-gauge-row-tag{font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--dsc-gray-5);writing-mode:vertical-rl;transform:rotate(180deg);justify-self:center;padding:2px 0}.dsc-gauge-row-3 .dsc-gauge{min-width:0}.dsc-gauge-cell{min-width:0;display:flex;flex-direction:column;align-items:center;gap:2px}.dsc-gauge-cell .dsc-sparkline{width:100%;max-width:88px;opacity:.9}.dsc-gauge-row-3 .dsc-gauge svg{width:100%;max-width:96px;height:auto;max-height:72px}.dsc-gauge-row-3 .dsc-gauge-label{font-size:10px}.dsc-gauge-zone{border:1px solid transparent;border-radius:12px;padding:8px 6px 10px;transition:box-shadow .25s ease,border-color .25s ease,background .25s ease}.dsc-gauge-zone.is-lit{border-color:#ffd54f80;background:linear-gradient(180deg,#ffc1071a,#0c121c59);box-shadow:0 0 28px #ffc10747,inset 0 0 16px #ffd54f12}.dsc-gauge-zone-label{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5);margin:0 4px 6px}.dsc-gauge{display:flex;flex-direction:column;align-items:center;gap:4px}.dsc-gauge-label{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-chart-legend{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:4px;min-height:20px}.dsc-chart-legend-item{display:inline-flex;align-items:center;gap:6px;font-size:.75rem;color:var(--dsc-gray-5)}.dsc-chart-legend-item i{width:8px;height:8px;border-radius:50%;display:inline-block;box-shadow:0 0 6px currentColor}.dsc-chart-last{margin-left:auto;font-variant-numeric:tabular-nums;color:var(--dsc-neon);font-size:13px;font-weight:650}.dsc-fault-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.dsc-fault-list li{display:flex;flex-wrap:wrap;align-items:center;gap:10px}.dsc-empty{padding:18px 14px;border:1px dashed var(--dsc-gray-3);border-radius:8px;color:var(--dsc-gray-5);background:#00000040;font-size:.9rem;line-height:1.45}.dsc-empty--ok{border-style:solid;border-color:var(--dsc-neon-dim);color:var(--dsc-neon)}.dsc-btn:disabled{opacity:.45;cursor:not-allowed}.dsc-glass{background:var(--dsc-glass);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid var(--dsc-glass-border);border-radius:var(--dsc-radius-lg);box-shadow:var(--dsc-shadow)}.dsc-glass--glow{border-color:var(--dsc-teal-dim);box-shadow:0 0 0 1px #26c6da26,0 0 24px #26c6da1f}.dsc-icon-btn{appearance:none;width:36px;height:36px;padding:0;display:inline-flex;align-items:center;justify-content:center;border-radius:10px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);cursor:pointer;box-shadow:var(--dsc-shadow-tight);transition:border-color .12s ease,background .12s ease,transform .1s ease}.dsc-icon-btn:hover{border-color:var(--dsc-teal-dim);color:var(--dsc-teal)}.dsc-icon-btn:active{transform:translateY(1px)}.dsc-result-chip{display:inline-flex;align-items:center;gap:8px;max-width:100%;padding:8px 12px;border-radius:999px;border:1px solid var(--dsc-teal-dim);background:#26c6da1a;color:var(--dsc-white);font-size:.9rem}.dsc-result-chip span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dsc-overflow{position:relative;display:inline-block}.dsc-overflow-menu{position:absolute;right:0;top:calc(100% + 6px);z-index:40;min-width:180px;padding:6px;background:var(--dsc-black-2);border:1px solid var(--dsc-gray-3);border-radius:10px;box-shadow:var(--dsc-shadow)}.dsc-overflow-menu button{appearance:none;width:100%;text-align:left;border:0;background:transparent;color:var(--dsc-white);font:inherit;font-size:.88rem;padding:10px 12px;border-radius:8px;cursor:pointer}.dsc-overflow-menu button:hover{background:#26c6da1f;color:var(--dsc-teal)}.dsc-drawer-root{position:fixed;inset:0;z-index:80;pointer-events:none}.dsc-drawer-root.is-open{pointer-events:auto}.dsc-drawer-scrim{position:absolute;inset:0;background:#00000073;opacity:0;transition:opacity .18s ease}.dsc-drawer-root.is-open .dsc-drawer-scrim{opacity:1}.dsc-drawer-panel{position:absolute;top:0;bottom:0;width:min(380px,92vw);background:linear-gradient(165deg,#121a16,#0a100e);border:1px solid var(--dsc-glass-border);box-shadow:-12px 0 40px #0000008c;display:flex;flex-direction:column;transition:transform .22s ease}.dsc-drawer-panel.right{right:0;transform:translate(105%);border-radius:14px 0 0 14px}.dsc-drawer-panel.left{left:0;transform:translate(-105%);border-radius:0 14px 14px 0}.dsc-drawer-root.is-open .dsc-drawer-panel.right,.dsc-drawer-root.is-open .dsc-drawer-panel.left{transform:none}.dsc-drawer-rail{position:absolute;top:50%;transform:translateY(-50%);width:28px;height:64px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:2}.dsc-drawer-panel.right .dsc-drawer-rail{left:-28px;border-radius:10px 0 0 10px}.dsc-drawer-panel.left .dsc-drawer-rail{right:-28px;border-radius:0 10px 10px 0}.dsc-drawer-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid var(--dsc-gray-3)}.dsc-drawer-head h2{margin:0;font-size:.85rem;letter-spacing:.12em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-drawer-body{flex:1;overflow:auto;padding:14px 16px}.dsc-soil{width:100%;max-width:280px;margin:0 auto}.dsc-soil-pot{position:relative;width:100%;aspect-ratio:4 / 5;border-radius:12px 12px 28px 28px;border:2px solid rgba(120,160,130,.45);background:linear-gradient(180deg,#1a1410,#0e0c0a);overflow:hidden;box-shadow:inset 0 0 24px #0000008c,0 0 20px #26c6da14}.dsc-soil-pot.is-valid{border-color:var(--dsc-teal-dim);box-shadow:inset 0 0 24px #0000008c,0 0 28px #26c6da47,0 0 42px #39ff141f}.dsc-soil-layer{position:absolute;left:8%;right:8%;display:flex;align-items:center;justify-content:center;font-size:.72rem;letter-spacing:.04em;color:#f4f7f4eb;text-shadow:0 1px 2px rgba(0,0,0,.65);border-top:1px solid rgba(255,255,255,.08)}.dsc-soil-empty{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--dsc-gray-5);font-size:.85rem;padding:16px;text-align:center}.dsc-seat-layout{display:grid;grid-template-columns:minmax(200px,320px) 1fr;gap:18px;align-items:start}@media(max-width:900px){.dsc-seat-layout{grid-template-columns:1fr}}.dsc-seat-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.dsc-table{width:100%;border-collapse:collapse;font-size:.88rem}.dsc-table th,.dsc-table td{text-align:left;padding:8px 6px;border-bottom:1px solid var(--dsc-gray-3)}.dsc-table th{font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--dsc-gray-5);font-weight:600}.dsc-table tr{cursor:pointer}.dsc-table tr:hover td{background:#26c6da0f}.dsc-btn.teal{border-color:var(--dsc-teal-dim);background:#26c6da2e;color:var(--dsc-white);box-shadow:0 0 18px #26c6da33}.dsc-btn.teal.primary{background:var(--dsc-teal);color:#041018;font-weight:650}.dsc-held-tag{margin-left:8px;font-size:.65rem;letter-spacing:.08em;color:var(--dsc-amber);vertical-align:middle}.dsc-kpi-hit,.dsc-gauge-hit{appearance:none;border:0;background:transparent;padding:0;margin:0;color:inherit;font:inherit;text-align:left;cursor:pointer;width:100%;display:block}.dsc-card.is-stale,.dsc-gauge.is-stale{opacity:.88;border-color:var(--dsc-amber)}.dsc-gauge.is-clickable:hover,.dsc-kpi-hit:hover .dsc-card{border-color:var(--dsc-blue-dim)}.dsc-timespan{display:inline-flex;flex-wrap:wrap;gap:6px}.dsc-spark-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}.dsc-sparkline{display:block;margin-top:4px}.dsc-gotwant{display:flex;flex-direction:column;gap:10px}.dsc-gotwant-row{display:grid;grid-template-columns:64px 1fr;gap:6px 10px;align-items:center}.dsc-gotwant-label{font-size:.75rem;color:var(--dsc-gray-5);letter-spacing:.04em}.dsc-gotwant-track{position:relative;height:10px;border-radius:999px;background:#ffffff0f;overflow:hidden;grid-column:2}.dsc-gotwant-want{position:absolute;inset:0 auto 0 0;background:#2ec4d647;border-right:1px solid var(--dsc-teal)}.dsc-gotwant-got{position:absolute;inset:2px auto 2px 0;background:linear-gradient(90deg,var(--dsc-blue),var(--dsc-teal));border-radius:999px}.dsc-gotwant-vals{grid-column:2;display:flex;justify-content:space-between;font-size:.72rem;font-family:var(--dsc-mono)}.dsc-seat-editors{display:grid;gap:10px}.dsc-seat-editors label{display:flex;flex-direction:column;gap:4px;font-size:.75rem;color:var(--dsc-gray-5)}.dsc-seat-editors input,.dsc-seat-editors select,.dsc-seat-editors textarea{background:var(--dsc-gray-1);border:1px solid var(--dsc-glass-border);border-radius:8px;color:var(--dsc-white);padding:8px 10px;font:inherit}.dsc-root-matrix .dsc-tone-ok{color:var(--dsc-neon)}.dsc-root-matrix .dsc-tone-warn{color:var(--dsc-amber)}.dsc-root-matrix .dsc-tone-bad{color:var(--dsc-bad)}.dsc-root-matrix .dsc-tone-stale{color:var(--dsc-amber);opacity:.85}.dsc-tent-cockpit-strip{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}@media(prefers-reduced-motion:reduce){.dsc-drawer-panel,.dsc-drawer-scrim{transition:none!important}}', oy = ry;
function ja() {
  const i = jt(), r = uy(i.pathname, i.search);
  return r ? /* @__PURE__ */ c.jsx(Na, { to: r, replace: !0 }) : /* @__PURE__ */ c.jsx(Na, { to: "/live/mission", replace: !0 });
}
function dy() {
  const i = jt(), r = Ut(), o = cy(i.pathname), u = iy[o];
  return j.useEffect(() => {
    const f = (h) => {
      const g = h.detail, x = Number(g?.pot);
      x >= 1 && x <= 4 && r(`/live/root?pot=${x}`);
    };
    return window.addEventListener("dsc-dash-select-pot", f), () => window.removeEventListener("dsc-dash-select-pot", f);
  }, [r]), /* @__PURE__ */ c.jsxs("div", { className: "dsc-shell", children: [
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-brand-row", children: [
      /* @__PURE__ */ c.jsxs(Ks, { className: "dsc-brand", to: "/live/mission", children: [
        /* @__PURE__ */ c.jsx(El, { name: "brand", size: 36, color: "var(--dsc-blue)" }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-brand-title", children: /* @__PURE__ */ c.jsx("strong", { children: "DSC - A Plausible Deniability Project." }) })
      ] }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-muted", style: { fontSize: 12, letterSpacing: "0.08em" }, children: "SURFACE 7.1.4" })
    ] }),
    /* @__PURE__ */ c.jsx(px, {}),
    /* @__PURE__ */ c.jsx("nav", { className: "dsc-primary-tabs", "aria-label": "Primary", children: ny.map((f) => /* @__PURE__ */ c.jsxs(
      Ks,
      {
        to: f.path,
        className: ({ isActive: h }) => `dsc-tab dsc-tab--${f.id}${h || o === f.id ? " active" : ""}`,
        children: [
          /* @__PURE__ */ c.jsx(El, { name: f.icon, size: 15 }),
          f.label
        ]
      },
      f.id
    )) }),
    u.length > 1 ? /* @__PURE__ */ c.jsx("nav", { className: "dsc-secondary-tabs", "aria-label": "Section pages", children: u.map((f) => /* @__PURE__ */ c.jsxs(
      Ks,
      {
        to: f.path,
        end: f.path === "/fleet",
        className: ({ isActive: h }) => `dsc-tab${h ? " active" : ""}`,
        children: [
          /* @__PURE__ */ c.jsx(El, { name: f.icon, size: 14 }),
          f.label
        ]
      },
      f.id
    )) }) : null,
    /* @__PURE__ */ c.jsx(bx, {}),
    /* @__PURE__ */ c.jsxs(Tg, { children: [
      /* @__PURE__ */ c.jsx(He, { path: "/", element: /* @__PURE__ */ c.jsx(Na, { to: "/live/mission", replace: !0 }) }),
      /* @__PURE__ */ c.jsx(He, { path: "/live", element: /* @__PURE__ */ c.jsx(Na, { to: "/live/mission", replace: !0 }) }),
      /* @__PURE__ */ c.jsx(He, { path: "/live/mission", element: /* @__PURE__ */ c.jsx(Gx, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/live/twin", element: /* @__PURE__ */ c.jsx($x, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/live/climate", element: /* @__PURE__ */ c.jsx(Kx, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/live/main", element: /* @__PURE__ */ c.jsx(Jx, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/live/clone", element: /* @__PURE__ */ c.jsx(Fx, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/live/root", element: /* @__PURE__ */ c.jsx(Wx, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/live/light", element: /* @__PURE__ */ c.jsx(ey, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/grow", element: /* @__PURE__ */ c.jsx(Na, { to: "/grow/compose", replace: !0 }) }),
      /* @__PURE__ */ c.jsx(He, { path: "/grow/compose", element: /* @__PURE__ */ c.jsx(Vx, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/grow/research", element: /* @__PURE__ */ c.jsx(Xx, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/grow/roster", element: /* @__PURE__ */ c.jsx(Qx, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/tune", element: /* @__PURE__ */ c.jsx(Na, { to: "/tune/learning", replace: !0 }) }),
      /* @__PURE__ */ c.jsx(He, { path: "/tune/learning", element: /* @__PURE__ */ c.jsx(ty, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/tune/analytics", element: /* @__PURE__ */ c.jsx(ly, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/fleet", element: /* @__PURE__ */ c.jsx(ay, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/ops/*", element: /* @__PURE__ */ c.jsx(ja, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/ops", element: /* @__PURE__ */ c.jsx(ja, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/plant/*", element: /* @__PURE__ */ c.jsx(ja, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/plant", element: /* @__PURE__ */ c.jsx(ja, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/advanced/*", element: /* @__PURE__ */ c.jsx(ja, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/advanced", element: /* @__PURE__ */ c.jsx(ja, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "/system", element: /* @__PURE__ */ c.jsx(ja, {}) }),
      /* @__PURE__ */ c.jsx(He, { path: "*", element: /* @__PURE__ */ c.jsx(Na, { to: "/live/mission", replace: !0 }) })
    ] })
  ] });
}
function fy({ hass: i }) {
  return /* @__PURE__ */ c.jsx(fx, { hass: i, children: /* @__PURE__ */ c.jsx(Sx, { children: /* @__PURE__ */ c.jsx(dy, {}) }) });
}
function hy({
  panel: i
}) {
  const [r, o] = j.useState(() => i.hass);
  return j.useEffect(() => {
    const u = () => o(i.hass);
    return u(), i.addEventListener("hass-updated", u), () => {
      i.removeEventListener("hass-updated", u);
    };
  }, [i]), /* @__PURE__ */ c.jsx(ex, { children: /* @__PURE__ */ c.jsx(fy, { hass: r }) });
}
class my extends HTMLElement {
  constructor() {
    super(...arguments);
    Gs(this, "_root", null);
    Gs(this, "_hass", null);
    Gs(this, "_mounted", !1);
  }
  set hass(o) {
    this._hass = o, this.dispatchEvent(new Event("hass-updated"));
  }
  get hass() {
    return this._hass;
  }
  connectedCallback() {
    if (this.shadowRoot || this.attachShadow({ mode: "open" }), !this._mounted) {
      const o = document.createElement("style");
      o.textContent = `:host{display:block;height:100%;background:#0a0e18;color:#eef1f8;}
${oy}`, this.shadowRoot.appendChild(o);
      const u = document.createElement("div");
      u.className = "dsc-root", u.style.height = "100%", this.shadowRoot.appendChild(u), this._root = R0.createRoot(u), this._root.render(/* @__PURE__ */ c.jsx(hy, { panel: this })), this._mounted = !0;
    }
  }
  disconnectedCallback() {
    this._root?.unmount(), this._root = null, this._mounted = !1;
  }
}
customElements.get("dsc-hub-panel") || customElements.define("dsc-hub-panel", my);
export {
  my as default
};
//# sourceMappingURL=dsc-hub-panel.js.map
