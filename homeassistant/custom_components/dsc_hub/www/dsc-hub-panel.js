var lx = Object.defineProperty;
var ix = (a, i, r) => i in a ? lx(a, i, { enumerable: !0, configurable: !0, writable: !0, value: r }) : a[i] = r;
var Tr = (a, i, r) => ix(a, typeof i != "symbol" ? i + "" : i, r);
var zu = { exports: {} }, Il = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Mp;
function rx() {
  if (Mp) return Il;
  Mp = 1;
  var a = Symbol.for("react.transitional.element"), i = Symbol.for("react.fragment");
  function r(o, d, h) {
    var f = null;
    if (h !== void 0 && (f = "" + h), d.key !== void 0 && (f = "" + d.key), "key" in d) {
      h = {};
      for (var m in d)
        m !== "key" && (h[m] = d[m]);
    } else h = d;
    return d = h.ref, {
      $$typeof: a,
      type: o,
      key: f,
      ref: d !== void 0 ? d : null,
      props: h
    };
  }
  return Il.Fragment = i, Il.jsx = r, Il.jsxs = r, Il;
}
var Tp;
function cx() {
  return Tp || (Tp = 1, zu.exports = rx()), zu.exports;
}
var s = cx(), Ou = { exports: {} }, ve = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Rp;
function ox() {
  if (Rp) return ve;
  Rp = 1;
  var a = Symbol.for("react.transitional.element"), i = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), o = Symbol.for("react.strict_mode"), d = Symbol.for("react.profiler"), h = Symbol.for("react.consumer"), f = Symbol.for("react.context"), m = Symbol.for("react.forward_ref"), _ = Symbol.for("react.suspense"), b = Symbol.for("react.memo"), v = Symbol.for("react.lazy"), g = Symbol.for("react.activity"), j = Symbol.iterator;
  function w(k) {
    return k === null || typeof k != "object" ? null : (k = j && k[j] || k["@@iterator"], typeof k == "function" ? k : null);
  }
  var S = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, N = Object.assign, C = {};
  function E(k, G, ee) {
    this.props = k, this.context = G, this.refs = C, this.updater = ee || S;
  }
  E.prototype.isReactComponent = {}, E.prototype.setState = function(k, G) {
    if (typeof k != "object" && typeof k != "function" && k != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, k, G, "setState");
  }, E.prototype.forceUpdate = function(k) {
    this.updater.enqueueForceUpdate(this, k, "forceUpdate");
  };
  function z() {
  }
  z.prototype = E.prototype;
  function U(k, G, ee) {
    this.props = k, this.context = G, this.refs = C, this.updater = ee || S;
  }
  var Q = U.prototype = new z();
  Q.constructor = U, N(Q, E.prototype), Q.isPureReactComponent = !0;
  var X = Array.isArray;
  function F() {
  }
  var Z = { H: null, A: null, T: null, S: null }, I = Object.prototype.hasOwnProperty;
  function ae(k, G, ee) {
    var ne = ee.ref;
    return {
      $$typeof: a,
      type: k,
      key: G,
      ref: ne !== void 0 ? ne : null,
      props: ee
    };
  }
  function ie(k, G) {
    return ae(k.type, G, k.props);
  }
  function de(k) {
    return typeof k == "object" && k !== null && k.$$typeof === a;
  }
  function re(k) {
    var G = { "=": "=0", ":": "=2" };
    return "$" + k.replace(/[=:]/g, function(ee) {
      return G[ee];
    });
  }
  var ce = /\/+/g;
  function oe(k, G) {
    return typeof k == "object" && k !== null && k.key != null ? re("" + k.key) : G.toString(36);
  }
  function M(k) {
    switch (k.status) {
      case "fulfilled":
        return k.value;
      case "rejected":
        throw k.reason;
      default:
        switch (typeof k.status == "string" ? k.then(F, F) : (k.status = "pending", k.then(
          function(G) {
            k.status === "pending" && (k.status = "fulfilled", k.value = G);
          },
          function(G) {
            k.status === "pending" && (k.status = "rejected", k.reason = G);
          }
        )), k.status) {
          case "fulfilled":
            return k.value;
          case "rejected":
            throw k.reason;
        }
    }
    throw k;
  }
  function R(k, G, ee, ne, me) {
    var fe = typeof k;
    (fe === "undefined" || fe === "boolean") && (k = null);
    var ge = !1;
    if (k === null) ge = !0;
    else
      switch (fe) {
        case "bigint":
        case "string":
        case "number":
          ge = !0;
          break;
        case "object":
          switch (k.$$typeof) {
            case a:
            case i:
              ge = !0;
              break;
            case v:
              return ge = k._init, R(
                ge(k._payload),
                G,
                ee,
                ne,
                me
              );
          }
      }
    if (ge)
      return me = me(k), ge = ne === "" ? "." + oe(k, 0) : ne, X(me) ? (ee = "", ge != null && (ee = ge.replace(ce, "$&/") + "/"), R(me, G, ee, "", function(nt) {
        return nt;
      })) : me != null && (de(me) && (me = ie(
        me,
        ee + (me.key == null || k && k.key === me.key ? "" : ("" + me.key).replace(
          ce,
          "$&/"
        ) + "/") + ge
      )), G.push(me)), 1;
    ge = 0;
    var $e = ne === "" ? "." : ne + ":";
    if (X(k))
      for (var ye = 0; ye < k.length; ye++)
        ne = k[ye], fe = $e + oe(ne, ye), ge += R(
          ne,
          G,
          ee,
          fe,
          me
        );
    else if (ye = w(k), typeof ye == "function")
      for (k = ye.call(k), ye = 0; !(ne = k.next()).done; )
        ne = ne.value, fe = $e + oe(ne, ye++), ge += R(
          ne,
          G,
          ee,
          fe,
          me
        );
    else if (fe === "object") {
      if (typeof k.then == "function")
        return R(
          M(k),
          G,
          ee,
          ne,
          me
        );
      throw G = String(k), Error(
        "Objects are not valid as a React child (found: " + (G === "[object Object]" ? "object with keys {" + Object.keys(k).join(", ") + "}" : G) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return ge;
  }
  function D(k, G, ee) {
    if (k == null) return k;
    var ne = [], me = 0;
    return R(k, ne, "", "", function(fe) {
      return G.call(ee, fe, me++);
    }), ne;
  }
  function q(k) {
    if (k._status === -1) {
      var G = k._result;
      G = G(), G.then(
        function(ee) {
          (k._status === 0 || k._status === -1) && (k._status = 1, k._result = ee);
        },
        function(ee) {
          (k._status === 0 || k._status === -1) && (k._status = 2, k._result = ee);
        }
      ), k._status === -1 && (k._status = 0, k._result = G);
    }
    if (k._status === 1) return k._result.default;
    throw k._result;
  }
  var P = typeof reportError == "function" ? reportError : function(k) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var G = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof k == "object" && k !== null && typeof k.message == "string" ? String(k.message) : String(k),
        error: k
      });
      if (!window.dispatchEvent(G)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", k);
      return;
    }
    console.error(k);
  }, W = {
    map: D,
    forEach: function(k, G, ee) {
      D(
        k,
        function() {
          G.apply(this, arguments);
        },
        ee
      );
    },
    count: function(k) {
      var G = 0;
      return D(k, function() {
        G++;
      }), G;
    },
    toArray: function(k) {
      return D(k, function(G) {
        return G;
      }) || [];
    },
    only: function(k) {
      if (!de(k))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return k;
    }
  };
  return ve.Activity = g, ve.Children = W, ve.Component = E, ve.Fragment = r, ve.Profiler = d, ve.PureComponent = U, ve.StrictMode = o, ve.Suspense = _, ve.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Z, ve.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(k) {
      return Z.H.useMemoCache(k);
    }
  }, ve.cache = function(k) {
    return function() {
      return k.apply(null, arguments);
    };
  }, ve.cacheSignal = function() {
    return null;
  }, ve.cloneElement = function(k, G, ee) {
    if (k == null)
      throw Error(
        "The argument must be a React element, but you passed " + k + "."
      );
    var ne = N({}, k.props), me = k.key;
    if (G != null)
      for (fe in G.key !== void 0 && (me = "" + G.key), G)
        !I.call(G, fe) || fe === "key" || fe === "__self" || fe === "__source" || fe === "ref" && G.ref === void 0 || (ne[fe] = G[fe]);
    var fe = arguments.length - 2;
    if (fe === 1) ne.children = ee;
    else if (1 < fe) {
      for (var ge = Array(fe), $e = 0; $e < fe; $e++)
        ge[$e] = arguments[$e + 2];
      ne.children = ge;
    }
    return ae(k.type, me, ne);
  }, ve.createContext = function(k) {
    return k = {
      $$typeof: f,
      _currentValue: k,
      _currentValue2: k,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, k.Provider = k, k.Consumer = {
      $$typeof: h,
      _context: k
    }, k;
  }, ve.createElement = function(k, G, ee) {
    var ne, me = {}, fe = null;
    if (G != null)
      for (ne in G.key !== void 0 && (fe = "" + G.key), G)
        I.call(G, ne) && ne !== "key" && ne !== "__self" && ne !== "__source" && (me[ne] = G[ne]);
    var ge = arguments.length - 2;
    if (ge === 1) me.children = ee;
    else if (1 < ge) {
      for (var $e = Array(ge), ye = 0; ye < ge; ye++)
        $e[ye] = arguments[ye + 2];
      me.children = $e;
    }
    if (k && k.defaultProps)
      for (ne in ge = k.defaultProps, ge)
        me[ne] === void 0 && (me[ne] = ge[ne]);
    return ae(k, fe, me);
  }, ve.createRef = function() {
    return { current: null };
  }, ve.forwardRef = function(k) {
    return { $$typeof: m, render: k };
  }, ve.isValidElement = de, ve.lazy = function(k) {
    return {
      $$typeof: v,
      _payload: { _status: -1, _result: k },
      _init: q
    };
  }, ve.memo = function(k, G) {
    return {
      $$typeof: b,
      type: k,
      compare: G === void 0 ? null : G
    };
  }, ve.startTransition = function(k) {
    var G = Z.T, ee = {};
    Z.T = ee;
    try {
      var ne = k(), me = Z.S;
      me !== null && me(ee, ne), typeof ne == "object" && ne !== null && typeof ne.then == "function" && ne.then(F, P);
    } catch (fe) {
      P(fe);
    } finally {
      G !== null && ee.types !== null && (G.types = ee.types), Z.T = G;
    }
  }, ve.unstable_useCacheRefresh = function() {
    return Z.H.useCacheRefresh();
  }, ve.use = function(k) {
    return Z.H.use(k);
  }, ve.useActionState = function(k, G, ee) {
    return Z.H.useActionState(k, G, ee);
  }, ve.useCallback = function(k, G) {
    return Z.H.useCallback(k, G);
  }, ve.useContext = function(k) {
    return Z.H.useContext(k);
  }, ve.useDebugValue = function() {
  }, ve.useDeferredValue = function(k, G) {
    return Z.H.useDeferredValue(k, G);
  }, ve.useEffect = function(k, G) {
    return Z.H.useEffect(k, G);
  }, ve.useEffectEvent = function(k) {
    return Z.H.useEffectEvent(k);
  }, ve.useId = function() {
    return Z.H.useId();
  }, ve.useImperativeHandle = function(k, G, ee) {
    return Z.H.useImperativeHandle(k, G, ee);
  }, ve.useInsertionEffect = function(k, G) {
    return Z.H.useInsertionEffect(k, G);
  }, ve.useLayoutEffect = function(k, G) {
    return Z.H.useLayoutEffect(k, G);
  }, ve.useMemo = function(k, G) {
    return Z.H.useMemo(k, G);
  }, ve.useOptimistic = function(k, G) {
    return Z.H.useOptimistic(k, G);
  }, ve.useReducer = function(k, G, ee) {
    return Z.H.useReducer(k, G, ee);
  }, ve.useRef = function(k) {
    return Z.H.useRef(k);
  }, ve.useState = function(k) {
    return Z.H.useState(k);
  }, ve.useSyncExternalStore = function(k, G, ee) {
    return Z.H.useSyncExternalStore(
      k,
      G,
      ee
    );
  }, ve.useTransition = function() {
    return Z.H.useTransition();
  }, ve.version = "19.2.8", ve;
}
var Ap;
function ld() {
  return Ap || (Ap = 1, Ou.exports = ox()), Ou.exports;
}
var x = ld(), Du = { exports: {} }, ei = {}, Hu = { exports: {} }, Lu = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var zp;
function ux() {
  return zp || (zp = 1, (function(a) {
    function i(R, D) {
      var q = R.length;
      R.push(D);
      e: for (; 0 < q; ) {
        var P = q - 1 >>> 1, W = R[P];
        if (0 < d(W, D))
          R[P] = D, R[q] = W, q = P;
        else break e;
      }
    }
    function r(R) {
      return R.length === 0 ? null : R[0];
    }
    function o(R) {
      if (R.length === 0) return null;
      var D = R[0], q = R.pop();
      if (q !== D) {
        R[0] = q;
        e: for (var P = 0, W = R.length, k = W >>> 1; P < k; ) {
          var G = 2 * (P + 1) - 1, ee = R[G], ne = G + 1, me = R[ne];
          if (0 > d(ee, q))
            ne < W && 0 > d(me, ee) ? (R[P] = me, R[ne] = q, P = ne) : (R[P] = ee, R[G] = q, P = G);
          else if (ne < W && 0 > d(me, q))
            R[P] = me, R[ne] = q, P = ne;
          else break e;
        }
      }
      return D;
    }
    function d(R, D) {
      var q = R.sortIndex - D.sortIndex;
      return q !== 0 ? q : R.id - D.id;
    }
    if (a.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var h = performance;
      a.unstable_now = function() {
        return h.now();
      };
    } else {
      var f = Date, m = f.now();
      a.unstable_now = function() {
        return f.now() - m;
      };
    }
    var _ = [], b = [], v = 1, g = null, j = 3, w = !1, S = !1, N = !1, C = !1, E = typeof setTimeout == "function" ? setTimeout : null, z = typeof clearTimeout == "function" ? clearTimeout : null, U = typeof setImmediate < "u" ? setImmediate : null;
    function Q(R) {
      for (var D = r(b); D !== null; ) {
        if (D.callback === null) o(b);
        else if (D.startTime <= R)
          o(b), D.sortIndex = D.expirationTime, i(_, D);
        else break;
        D = r(b);
      }
    }
    function X(R) {
      if (N = !1, Q(R), !S)
        if (r(_) !== null)
          S = !0, F || (F = !0, re());
        else {
          var D = r(b);
          D !== null && M(X, D.startTime - R);
        }
    }
    var F = !1, Z = -1, I = 5, ae = -1;
    function ie() {
      return C ? !0 : !(a.unstable_now() - ae < I);
    }
    function de() {
      if (C = !1, F) {
        var R = a.unstable_now();
        ae = R;
        var D = !0;
        try {
          e: {
            S = !1, N && (N = !1, z(Z), Z = -1), w = !0;
            var q = j;
            try {
              t: {
                for (Q(R), g = r(_); g !== null && !(g.expirationTime > R && ie()); ) {
                  var P = g.callback;
                  if (typeof P == "function") {
                    g.callback = null, j = g.priorityLevel;
                    var W = P(
                      g.expirationTime <= R
                    );
                    if (R = a.unstable_now(), typeof W == "function") {
                      g.callback = W, Q(R), D = !0;
                      break t;
                    }
                    g === r(_) && o(_), Q(R);
                  } else o(_);
                  g = r(_);
                }
                if (g !== null) D = !0;
                else {
                  var k = r(b);
                  k !== null && M(
                    X,
                    k.startTime - R
                  ), D = !1;
                }
              }
              break e;
            } finally {
              g = null, j = q, w = !1;
            }
            D = void 0;
          }
        } finally {
          D ? re() : F = !1;
        }
      }
    }
    var re;
    if (typeof U == "function")
      re = function() {
        U(de);
      };
    else if (typeof MessageChannel < "u") {
      var ce = new MessageChannel(), oe = ce.port2;
      ce.port1.onmessage = de, re = function() {
        oe.postMessage(null);
      };
    } else
      re = function() {
        E(de, 0);
      };
    function M(R, D) {
      Z = E(function() {
        R(a.unstable_now());
      }, D);
    }
    a.unstable_IdlePriority = 5, a.unstable_ImmediatePriority = 1, a.unstable_LowPriority = 4, a.unstable_NormalPriority = 3, a.unstable_Profiling = null, a.unstable_UserBlockingPriority = 2, a.unstable_cancelCallback = function(R) {
      R.callback = null;
    }, a.unstable_forceFrameRate = function(R) {
      0 > R || 125 < R ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : I = 0 < R ? Math.floor(1e3 / R) : 5;
    }, a.unstable_getCurrentPriorityLevel = function() {
      return j;
    }, a.unstable_next = function(R) {
      switch (j) {
        case 1:
        case 2:
        case 3:
          var D = 3;
          break;
        default:
          D = j;
      }
      var q = j;
      j = D;
      try {
        return R();
      } finally {
        j = q;
      }
    }, a.unstable_requestPaint = function() {
      C = !0;
    }, a.unstable_runWithPriority = function(R, D) {
      switch (R) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          R = 3;
      }
      var q = j;
      j = R;
      try {
        return D();
      } finally {
        j = q;
      }
    }, a.unstable_scheduleCallback = function(R, D, q) {
      var P = a.unstable_now();
      switch (typeof q == "object" && q !== null ? (q = q.delay, q = typeof q == "number" && 0 < q ? P + q : P) : q = P, R) {
        case 1:
          var W = -1;
          break;
        case 2:
          W = 250;
          break;
        case 5:
          W = 1073741823;
          break;
        case 4:
          W = 1e4;
          break;
        default:
          W = 5e3;
      }
      return W = q + W, R = {
        id: v++,
        callback: D,
        priorityLevel: R,
        startTime: q,
        expirationTime: W,
        sortIndex: -1
      }, q > P ? (R.sortIndex = q, i(b, R), r(_) === null && R === r(b) && (N ? (z(Z), Z = -1) : N = !0, M(X, q - P))) : (R.sortIndex = W, i(_, R), S || w || (S = !0, F || (F = !0, re()))), R;
    }, a.unstable_shouldYield = ie, a.unstable_wrapCallback = function(R) {
      var D = j;
      return function() {
        var q = j;
        j = D;
        try {
          return R.apply(this, arguments);
        } finally {
          j = q;
        }
      };
    };
  })(Lu)), Lu;
}
var Op;
function dx() {
  return Op || (Op = 1, Hu.exports = ux()), Hu.exports;
}
var $u = { exports: {} }, Et = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Dp;
function hx() {
  if (Dp) return Et;
  Dp = 1;
  var a = ld();
  function i(_) {
    var b = "https://react.dev/errors/" + _;
    if (1 < arguments.length) {
      b += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var v = 2; v < arguments.length; v++)
        b += "&args[]=" + encodeURIComponent(arguments[v]);
    }
    return "Minified React error #" + _ + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function r() {
  }
  var o = {
    d: {
      f: r,
      r: function() {
        throw Error(i(522));
      },
      D: r,
      C: r,
      L: r,
      m: r,
      X: r,
      S: r,
      M: r
    },
    p: 0,
    findDOMNode: null
  }, d = Symbol.for("react.portal");
  function h(_, b, v) {
    var g = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: d,
      key: g == null ? null : "" + g,
      children: _,
      containerInfo: b,
      implementation: v
    };
  }
  var f = a.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function m(_, b) {
    if (_ === "font") return "";
    if (typeof b == "string")
      return b === "use-credentials" ? b : "";
  }
  return Et.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o, Et.createPortal = function(_, b) {
    var v = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!b || b.nodeType !== 1 && b.nodeType !== 9 && b.nodeType !== 11)
      throw Error(i(299));
    return h(_, b, null, v);
  }, Et.flushSync = function(_) {
    var b = f.T, v = o.p;
    try {
      if (f.T = null, o.p = 2, _) return _();
    } finally {
      f.T = b, o.p = v, o.d.f();
    }
  }, Et.preconnect = function(_, b) {
    typeof _ == "string" && (b ? (b = b.crossOrigin, b = typeof b == "string" ? b === "use-credentials" ? b : "" : void 0) : b = null, o.d.C(_, b));
  }, Et.prefetchDNS = function(_) {
    typeof _ == "string" && o.d.D(_);
  }, Et.preinit = function(_, b) {
    if (typeof _ == "string" && b && typeof b.as == "string") {
      var v = b.as, g = m(v, b.crossOrigin), j = typeof b.integrity == "string" ? b.integrity : void 0, w = typeof b.fetchPriority == "string" ? b.fetchPriority : void 0;
      v === "style" ? o.d.S(
        _,
        typeof b.precedence == "string" ? b.precedence : void 0,
        {
          crossOrigin: g,
          integrity: j,
          fetchPriority: w
        }
      ) : v === "script" && o.d.X(_, {
        crossOrigin: g,
        integrity: j,
        fetchPriority: w,
        nonce: typeof b.nonce == "string" ? b.nonce : void 0
      });
    }
  }, Et.preinitModule = function(_, b) {
    if (typeof _ == "string")
      if (typeof b == "object" && b !== null) {
        if (b.as == null || b.as === "script") {
          var v = m(
            b.as,
            b.crossOrigin
          );
          o.d.M(_, {
            crossOrigin: v,
            integrity: typeof b.integrity == "string" ? b.integrity : void 0,
            nonce: typeof b.nonce == "string" ? b.nonce : void 0
          });
        }
      } else b == null && o.d.M(_);
  }, Et.preload = function(_, b) {
    if (typeof _ == "string" && typeof b == "object" && b !== null && typeof b.as == "string") {
      var v = b.as, g = m(v, b.crossOrigin);
      o.d.L(_, v, {
        crossOrigin: g,
        integrity: typeof b.integrity == "string" ? b.integrity : void 0,
        nonce: typeof b.nonce == "string" ? b.nonce : void 0,
        type: typeof b.type == "string" ? b.type : void 0,
        fetchPriority: typeof b.fetchPriority == "string" ? b.fetchPriority : void 0,
        referrerPolicy: typeof b.referrerPolicy == "string" ? b.referrerPolicy : void 0,
        imageSrcSet: typeof b.imageSrcSet == "string" ? b.imageSrcSet : void 0,
        imageSizes: typeof b.imageSizes == "string" ? b.imageSizes : void 0,
        media: typeof b.media == "string" ? b.media : void 0
      });
    }
  }, Et.preloadModule = function(_, b) {
    if (typeof _ == "string")
      if (b) {
        var v = m(b.as, b.crossOrigin);
        o.d.m(_, {
          as: typeof b.as == "string" && b.as !== "script" ? b.as : void 0,
          crossOrigin: v,
          integrity: typeof b.integrity == "string" ? b.integrity : void 0
        });
      } else o.d.m(_);
  }, Et.requestFormReset = function(_) {
    o.d.r(_);
  }, Et.unstable_batchedUpdates = function(_, b) {
    return _(b);
  }, Et.useFormState = function(_, b, v) {
    return f.H.useFormState(_, b, v);
  }, Et.useFormStatus = function() {
    return f.H.useHostTransitionStatus();
  }, Et.version = "19.2.8", Et;
}
var Hp;
function fx() {
  if (Hp) return $u.exports;
  Hp = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (i) {
        console.error(i);
      }
  }
  return a(), $u.exports = hx(), $u.exports;
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
var Lp;
function mx() {
  if (Lp) return ei;
  Lp = 1;
  var a = dx(), i = ld(), r = fx();
  function o(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var n = 2; n < arguments.length; n++)
        t += "&args[]=" + encodeURIComponent(arguments[n]);
    }
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function d(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function h(e) {
    var t = e, n = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
      e = t;
      do
        t = e, (t.flags & 4098) !== 0 && (n = t.return), e = t.return;
      while (e);
    }
    return t.tag === 3 ? n : null;
  }
  function f(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function m(e) {
    if (e.tag === 31) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function _(e) {
    if (h(e) !== e)
      throw Error(o(188));
  }
  function b(e) {
    var t = e.alternate;
    if (!t) {
      if (t = h(e), t === null) throw Error(o(188));
      return t !== e ? null : e;
    }
    for (var n = e, l = t; ; ) {
      var c = n.return;
      if (c === null) break;
      var u = c.alternate;
      if (u === null) {
        if (l = c.return, l !== null) {
          n = l;
          continue;
        }
        break;
      }
      if (c.child === u.child) {
        for (u = c.child; u; ) {
          if (u === n) return _(c), e;
          if (u === l) return _(c), t;
          u = u.sibling;
        }
        throw Error(o(188));
      }
      if (n.return !== l.return) n = c, l = u;
      else {
        for (var p = !1, y = c.child; y; ) {
          if (y === n) {
            p = !0, n = c, l = u;
            break;
          }
          if (y === l) {
            p = !0, l = c, n = u;
            break;
          }
          y = y.sibling;
        }
        if (!p) {
          for (y = u.child; y; ) {
            if (y === n) {
              p = !0, n = u, l = c;
              break;
            }
            if (y === l) {
              p = !0, l = u, n = c;
              break;
            }
            y = y.sibling;
          }
          if (!p) throw Error(o(189));
        }
      }
      if (n.alternate !== l) throw Error(o(190));
    }
    if (n.tag !== 3) throw Error(o(188));
    return n.stateNode.current === n ? e : t;
  }
  function v(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null; ) {
      if (t = v(e), t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var g = Object.assign, j = Symbol.for("react.element"), w = Symbol.for("react.transitional.element"), S = Symbol.for("react.portal"), N = Symbol.for("react.fragment"), C = Symbol.for("react.strict_mode"), E = Symbol.for("react.profiler"), z = Symbol.for("react.consumer"), U = Symbol.for("react.context"), Q = Symbol.for("react.forward_ref"), X = Symbol.for("react.suspense"), F = Symbol.for("react.suspense_list"), Z = Symbol.for("react.memo"), I = Symbol.for("react.lazy"), ae = Symbol.for("react.activity"), ie = Symbol.for("react.memo_cache_sentinel"), de = Symbol.iterator;
  function re(e) {
    return e === null || typeof e != "object" ? null : (e = de && e[de] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var ce = Symbol.for("react.client.reference");
  function oe(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === ce ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case N:
        return "Fragment";
      case E:
        return "Profiler";
      case C:
        return "StrictMode";
      case X:
        return "Suspense";
      case F:
        return "SuspenseList";
      case ae:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case S:
          return "Portal";
        case U:
          return e.displayName || "Context";
        case z:
          return (e._context.displayName || "Context") + ".Consumer";
        case Q:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case Z:
          return t = e.displayName || null, t !== null ? t : oe(e.type) || "Memo";
        case I:
          t = e._payload, e = e._init;
          try {
            return oe(e(t));
          } catch {
          }
      }
    return null;
  }
  var M = Array.isArray, R = i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, D = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, q = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, P = [], W = -1;
  function k(e) {
    return { current: e };
  }
  function G(e) {
    0 > W || (e.current = P[W], P[W] = null, W--);
  }
  function ee(e, t) {
    W++, P[W] = e.current, e.current = t;
  }
  var ne = k(null), me = k(null), fe = k(null), ge = k(null);
  function $e(e, t) {
    switch (ee(fe, t), ee(me, e), ee(ne, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? Wm(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = Wm(t), e = Im(t, e);
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
    G(ne), ee(ne, e);
  }
  function ye() {
    G(ne), G(me), G(fe);
  }
  function nt(e) {
    e.memoizedState !== null && ee(ge, e);
    var t = ne.current, n = Im(t, e.type);
    t !== n && (ee(me, e), ee(ne, n));
  }
  function mt(e) {
    me.current === e && (G(ne), G(me)), ge.current === e && (G(ge), Kl._currentValue = q);
  }
  var je, at;
  function te(e) {
    if (je === void 0)
      try {
        throw Error();
      } catch (n) {
        var t = n.stack.trim().match(/\n( *(at )?)/);
        je = t && t[1] || "", at = -1 < n.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < n.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + je + e + at;
  }
  var Le = !1;
  function We(e, t) {
    if (!e || Le) return "";
    Le = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var l = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var J = function() {
                throw Error();
              };
              if (Object.defineProperty(J.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(J, []);
                } catch (V) {
                  var B = V;
                }
                Reflect.construct(e, [], J);
              } else {
                try {
                  J.call();
                } catch (V) {
                  B = V;
                }
                e.call(J.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (V) {
                B = V;
              }
              (J = e()) && typeof J.catch == "function" && J.catch(function() {
              });
            }
          } catch (V) {
            if (V && B && typeof V.stack == "string")
              return [V.stack, B.stack];
          }
          return [null, null];
        }
      };
      l.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var c = Object.getOwnPropertyDescriptor(
        l.DetermineComponentFrameRoot,
        "name"
      );
      c && c.configurable && Object.defineProperty(
        l.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var u = l.DetermineComponentFrameRoot(), p = u[0], y = u[1];
      if (p && y) {
        var T = p.split(`
`), $ = y.split(`
`);
        for (c = l = 0; l < T.length && !T[l].includes("DetermineComponentFrameRoot"); )
          l++;
        for (; c < $.length && !$[c].includes(
          "DetermineComponentFrameRoot"
        ); )
          c++;
        if (l === T.length || c === $.length)
          for (l = T.length - 1, c = $.length - 1; 1 <= l && 0 <= c && T[l] !== $[c]; )
            c--;
        for (; 1 <= l && 0 <= c; l--, c--)
          if (T[l] !== $[c]) {
            if (l !== 1 || c !== 1)
              do
                if (l--, c--, 0 > c || T[l] !== $[c]) {
                  var Y = `
` + T[l].replace(" at new ", " at ");
                  return e.displayName && Y.includes("<anonymous>") && (Y = Y.replace("<anonymous>", e.displayName)), Y;
                }
              while (1 <= l && 0 <= c);
            break;
          }
      }
    } finally {
      Le = !1, Error.prepareStackTrace = n;
    }
    return (n = e ? e.displayName || e.name : "") ? te(n) : "";
  }
  function pt(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return te(e.type);
      case 16:
        return te("Lazy");
      case 13:
        return e.child !== t && t !== null ? te("Suspense Fallback") : te("Suspense");
      case 19:
        return te("SuspenseList");
      case 0:
      case 15:
        return We(e.type, !1);
      case 11:
        return We(e.type.render, !1);
      case 1:
        return We(e.type, !0);
      case 31:
        return te("Activity");
      default:
        return "";
    }
  }
  function Ie(e) {
    try {
      var t = "", n = null;
      do
        t += pt(e, n), n = e, e = e.return;
      while (e);
      return t;
    } catch (l) {
      return `
Error generating stack: ` + l.message + `
` + l.stack;
    }
  }
  var Ae = Object.prototype.hasOwnProperty, Lt = a.unstable_scheduleCallback, $t = a.unstable_cancelCallback, ln = a.unstable_shouldYield, Zt = a.unstable_requestPaint, st = a.unstable_now, il = a.unstable_getCurrentPriorityLevel, Re = a.unstable_ImmediatePriority, ds = a.unstable_UserBlockingPriority, hs = a.unstable_NormalPriority, _c = a.unstable_LowPriority, mi = a.unstable_IdlePriority, bc = a.log, gc = a.unstable_setDisableYieldValue, Ua = null, zt = null;
  function vn(e) {
    if (typeof bc == "function" && gc(e), zt && typeof zt.setStrictMode == "function")
      try {
        zt.setStrictMode(Ua, e);
      } catch {
      }
  }
  var Ct = Math.clz32 ? Math.clz32 : vc, rl = Math.log, Nn = Math.LN2;
  function vc(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (rl(e) / Nn | 0) | 0;
  }
  var fs = 256, pi = 262144, _i = 4194304;
  function Ba(e) {
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
  function bi(e, t, n) {
    var l = e.pendingLanes;
    if (l === 0) return 0;
    var c = 0, u = e.suspendedLanes, p = e.pingedLanes;
    e = e.warmLanes;
    var y = l & 134217727;
    return y !== 0 ? (l = y & ~u, l !== 0 ? c = Ba(l) : (p &= y, p !== 0 ? c = Ba(p) : n || (n = y & ~e, n !== 0 && (c = Ba(n))))) : (y = l & ~u, y !== 0 ? c = Ba(y) : p !== 0 ? c = Ba(p) : n || (n = l & ~e, n !== 0 && (c = Ba(n)))), c === 0 ? 0 : t !== 0 && t !== c && (t & u) === 0 && (u = c & -c, n = t & -t, u >= n || u === 32 && (n & 4194048) !== 0) ? t : c;
  }
  function cl(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function Xb(e, t) {
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
  function Ad() {
    var e = _i;
    return _i <<= 1, (_i & 62914560) === 0 && (_i = 4194304), e;
  }
  function xc(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function ol(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function Qb(e, t, n, l, c, u) {
    var p = e.pendingLanes;
    e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
    var y = e.entanglements, T = e.expirationTimes, $ = e.hiddenUpdates;
    for (n = p & ~n; 0 < n; ) {
      var Y = 31 - Ct(n), J = 1 << Y;
      y[Y] = 0, T[Y] = -1;
      var B = $[Y];
      if (B !== null)
        for ($[Y] = null, Y = 0; Y < B.length; Y++) {
          var V = B[Y];
          V !== null && (V.lane &= -536870913);
        }
      n &= ~J;
    }
    l !== 0 && zd(e, l, 0), u !== 0 && c === 0 && e.tag !== 0 && (e.suspendedLanes |= u & ~(p & ~t));
  }
  function zd(e, t, n) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var l = 31 - Ct(t);
    e.entangledLanes |= t, e.entanglements[l] = e.entanglements[l] | 1073741824 | n & 261930;
  }
  function Od(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var l = 31 - Ct(n), c = 1 << l;
      c & t | e[l] & t && (e[l] |= t), n &= ~c;
    }
  }
  function Dd(e, t) {
    var n = t & -t;
    return n = (n & 42) !== 0 ? 1 : yc(n), (n & (e.suspendedLanes | t)) !== 0 ? 0 : n;
  }
  function yc(e) {
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
  function wc(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Hd() {
    var e = D.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : wp(e.type));
  }
  function Ld(e, t) {
    var n = D.p;
    try {
      return D.p = e, t();
    } finally {
      D.p = n;
    }
  }
  var la = Math.random().toString(36).slice(2), vt = "__reactFiber$" + la, Ut = "__reactProps$" + la, ms = "__reactContainer$" + la, jc = "__reactEvents$" + la, Zb = "__reactListeners$" + la, Kb = "__reactHandles$" + la, $d = "__reactResources$" + la, ul = "__reactMarker$" + la;
  function Sc(e) {
    delete e[vt], delete e[Ut], delete e[jc], delete e[Zb], delete e[Kb];
  }
  function ps(e) {
    var t = e[vt];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[ms] || n[vt]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null)
          for (e = ip(e); e !== null; ) {
            if (n = e[vt]) return n;
            e = ip(e);
          }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function _s(e) {
    if (e = e[vt] || e[ms]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function dl(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(o(33));
  }
  function bs(e) {
    var t = e[$d];
    return t || (t = e[$d] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function bt(e) {
    e[ul] = !0;
  }
  var Ud = /* @__PURE__ */ new Set(), Bd = {};
  function Fa(e, t) {
    gs(e, t), gs(e + "Capture", t);
  }
  function gs(e, t) {
    for (Bd[e] = t, e = 0; e < t.length; e++)
      Ud.add(t[e]);
  }
  var Jb = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Fd = {}, Gd = {};
  function Pb(e) {
    return Ae.call(Gd, e) ? !0 : Ae.call(Fd, e) ? !1 : Jb.test(e) ? Gd[e] = !0 : (Fd[e] = !0, !1);
  }
  function gi(e, t, n) {
    if (Pb(t))
      if (n === null) e.removeAttribute(t);
      else {
        switch (typeof n) {
          case "undefined":
          case "function":
          case "symbol":
            e.removeAttribute(t);
            return;
          case "boolean":
            var l = t.toLowerCase().slice(0, 5);
            if (l !== "data-" && l !== "aria-") {
              e.removeAttribute(t);
              return;
            }
        }
        e.setAttribute(t, "" + n);
      }
  }
  function vi(e, t, n) {
    if (n === null) e.removeAttribute(t);
    else {
      switch (typeof n) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(t);
          return;
      }
      e.setAttribute(t, "" + n);
    }
  }
  function Dn(e, t, n, l) {
    if (l === null) e.removeAttribute(n);
    else {
      switch (typeof l) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(n);
          return;
      }
      e.setAttributeNS(t, n, "" + l);
    }
  }
  function rn(e) {
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
  function Vd(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Wb(e, t, n) {
    var l = Object.getOwnPropertyDescriptor(
      e.constructor.prototype,
      t
    );
    if (!e.hasOwnProperty(t) && typeof l < "u" && typeof l.get == "function" && typeof l.set == "function") {
      var c = l.get, u = l.set;
      return Object.defineProperty(e, t, {
        configurable: !0,
        get: function() {
          return c.call(this);
        },
        set: function(p) {
          n = "" + p, u.call(this, p);
        }
      }), Object.defineProperty(e, t, {
        enumerable: l.enumerable
      }), {
        getValue: function() {
          return n;
        },
        setValue: function(p) {
          n = "" + p;
        },
        stopTracking: function() {
          e._valueTracker = null, delete e[t];
        }
      };
    }
  }
  function kc(e) {
    if (!e._valueTracker) {
      var t = Vd(e) ? "checked" : "value";
      e._valueTracker = Wb(
        e,
        t,
        "" + e[t]
      );
    }
  }
  function qd(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), l = "";
    return e && (l = Vd(e) ? e.checked ? "true" : "false" : e.value), e = l, e !== n ? (t.setValue(e), !0) : !1;
  }
  function xi(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var Ib = /[\n"\\]/g;
  function cn(e) {
    return e.replace(
      Ib,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Nc(e, t, n, l, c, u, p, y) {
    e.name = "", p != null && typeof p != "function" && typeof p != "symbol" && typeof p != "boolean" ? e.type = p : e.removeAttribute("type"), t != null ? p === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + rn(t)) : e.value !== "" + rn(t) && (e.value = "" + rn(t)) : p !== "submit" && p !== "reset" || e.removeAttribute("value"), t != null ? Cc(e, p, rn(t)) : n != null ? Cc(e, p, rn(n)) : l != null && e.removeAttribute("value"), c == null && u != null && (e.defaultChecked = !!u), c != null && (e.checked = c && typeof c != "function" && typeof c != "symbol"), y != null && typeof y != "function" && typeof y != "symbol" && typeof y != "boolean" ? e.name = "" + rn(y) : e.removeAttribute("name");
  }
  function Yd(e, t, n, l, c, u, p, y) {
    if (u != null && typeof u != "function" && typeof u != "symbol" && typeof u != "boolean" && (e.type = u), t != null || n != null) {
      if (!(u !== "submit" && u !== "reset" || t != null)) {
        kc(e);
        return;
      }
      n = n != null ? "" + rn(n) : "", t = t != null ? "" + rn(t) : n, y || t === e.value || (e.value = t), e.defaultValue = t;
    }
    l = l ?? c, l = typeof l != "function" && typeof l != "symbol" && !!l, e.checked = y ? e.checked : !!l, e.defaultChecked = !!l, p != null && typeof p != "function" && typeof p != "symbol" && typeof p != "boolean" && (e.name = p), kc(e);
  }
  function Cc(e, t, n) {
    t === "number" && xi(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
  }
  function vs(e, t, n, l) {
    if (e = e.options, t) {
      t = {};
      for (var c = 0; c < n.length; c++)
        t["$" + n[c]] = !0;
      for (n = 0; n < e.length; n++)
        c = t.hasOwnProperty("$" + e[n].value), e[n].selected !== c && (e[n].selected = c), c && l && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + rn(n), t = null, c = 0; c < e.length; c++) {
        if (e[c].value === n) {
          e[c].selected = !0, l && (e[c].defaultSelected = !0);
          return;
        }
        t !== null || e[c].disabled || (t = e[c]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Xd(e, t, n) {
    if (t != null && (t = "" + rn(t), t !== e.value && (e.value = t), n == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = n != null ? "" + rn(n) : "";
  }
  function Qd(e, t, n, l) {
    if (t == null) {
      if (l != null) {
        if (n != null) throw Error(o(92));
        if (M(l)) {
          if (1 < l.length) throw Error(o(93));
          l = l[0];
        }
        n = l;
      }
      n == null && (n = ""), t = n;
    }
    n = rn(t), e.defaultValue = n, l = e.textContent, l === n && l !== "" && l !== null && (e.value = l), kc(e);
  }
  function xs(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var eg = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Zd(e, t, n) {
    var l = t.indexOf("--") === 0;
    n == null || typeof n == "boolean" || n === "" ? l ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : l ? e.setProperty(t, n) : typeof n != "number" || n === 0 || eg.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
  }
  function Kd(e, t, n) {
    if (t != null && typeof t != "object")
      throw Error(o(62));
    if (e = e.style, n != null) {
      for (var l in n)
        !n.hasOwnProperty(l) || t != null && t.hasOwnProperty(l) || (l.indexOf("--") === 0 ? e.setProperty(l, "") : l === "float" ? e.cssFloat = "" : e[l] = "");
      for (var c in t)
        l = t[c], t.hasOwnProperty(c) && n[c] !== l && Zd(e, c, l);
    } else
      for (var u in t)
        t.hasOwnProperty(u) && Zd(e, u, t[u]);
  }
  function Ec(e) {
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
  var tg = /* @__PURE__ */ new Map([
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
  ]), ng = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function yi(e) {
    return ng.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  function Hn() {
  }
  var Mc = null;
  function Tc(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var ys = null, ws = null;
  function Jd(e) {
    var t = _s(e);
    if (t && (e = t.stateNode)) {
      var n = e[Ut] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (Nc(
            e,
            n.value,
            n.defaultValue,
            n.defaultValue,
            n.checked,
            n.defaultChecked,
            n.type,
            n.name
          ), t = n.name, n.type === "radio" && t != null) {
            for (n = e; n.parentNode; ) n = n.parentNode;
            for (n = n.querySelectorAll(
              'input[name="' + cn(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < n.length; t++) {
              var l = n[t];
              if (l !== e && l.form === e.form) {
                var c = l[Ut] || null;
                if (!c) throw Error(o(90));
                Nc(
                  l,
                  c.value,
                  c.defaultValue,
                  c.defaultValue,
                  c.checked,
                  c.defaultChecked,
                  c.type,
                  c.name
                );
              }
            }
            for (t = 0; t < n.length; t++)
              l = n[t], l.form === e.form && qd(l);
          }
          break e;
        case "textarea":
          Xd(e, n.value, n.defaultValue);
          break e;
        case "select":
          t = n.value, t != null && vs(e, !!n.multiple, t, !1);
      }
    }
  }
  var Rc = !1;
  function Pd(e, t, n) {
    if (Rc) return e(t, n);
    Rc = !0;
    try {
      var l = e(t);
      return l;
    } finally {
      if (Rc = !1, (ys !== null || ws !== null) && (cr(), ys && (t = ys, e = ws, ws = ys = null, Jd(t), e)))
        for (t = 0; t < e.length; t++) Jd(e[t]);
    }
  }
  function hl(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var l = n[Ut] || null;
    if (l === null) return null;
    n = l[t];
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
        (l = !l.disabled) || (e = e.type, l = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !l;
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (n && typeof n != "function")
      throw Error(
        o(231, t, typeof n)
      );
    return n;
  }
  var Ln = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Ac = !1;
  if (Ln)
    try {
      var fl = {};
      Object.defineProperty(fl, "passive", {
        get: function() {
          Ac = !0;
        }
      }), window.addEventListener("test", fl, fl), window.removeEventListener("test", fl, fl);
    } catch {
      Ac = !1;
    }
  var ia = null, zc = null, wi = null;
  function Wd() {
    if (wi) return wi;
    var e, t = zc, n = t.length, l, c = "value" in ia ? ia.value : ia.textContent, u = c.length;
    for (e = 0; e < n && t[e] === c[e]; e++) ;
    var p = n - e;
    for (l = 1; l <= p && t[n - l] === c[u - l]; l++) ;
    return wi = c.slice(e, 1 < l ? 1 - l : void 0);
  }
  function ji(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Si() {
    return !0;
  }
  function Id() {
    return !1;
  }
  function Bt(e) {
    function t(n, l, c, u, p) {
      this._reactName = n, this._targetInst = c, this.type = l, this.nativeEvent = u, this.target = p, this.currentTarget = null;
      for (var y in e)
        e.hasOwnProperty(y) && (n = e[y], this[y] = n ? n(u) : u[y]);
      return this.isDefaultPrevented = (u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1) ? Si : Id, this.isPropagationStopped = Id, this;
    }
    return g(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Si);
      },
      stopPropagation: function() {
        var n = this.nativeEvent;
        n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Si);
      },
      persist: function() {
      },
      isPersistent: Si
    }), t;
  }
  var Ga = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, ki = Bt(Ga), ml = g({}, Ga, { view: 0, detail: 0 }), ag = Bt(ml), Oc, Dc, pl, Ni = g({}, ml, {
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
    getModifierState: Lc,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== pl && (pl && e.type === "mousemove" ? (Oc = e.screenX - pl.screenX, Dc = e.screenY - pl.screenY) : Dc = Oc = 0, pl = e), Oc);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : Dc;
    }
  }), eh = Bt(Ni), sg = g({}, Ni, { dataTransfer: 0 }), lg = Bt(sg), ig = g({}, ml, { relatedTarget: 0 }), Hc = Bt(ig), rg = g({}, Ga, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), cg = Bt(rg), og = g({}, Ga, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), ug = Bt(og), dg = g({}, Ga, { data: 0 }), th = Bt(dg), hg = {
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
  }, fg = {
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
  }, mg = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function pg(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = mg[e]) ? !!t[e] : !1;
  }
  function Lc() {
    return pg;
  }
  var _g = g({}, ml, {
    key: function(e) {
      if (e.key) {
        var t = hg[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = ji(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? fg[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Lc,
    charCode: function(e) {
      return e.type === "keypress" ? ji(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? ji(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), bg = Bt(_g), gg = g({}, Ni, {
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
  }), nh = Bt(gg), vg = g({}, ml, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Lc
  }), xg = Bt(vg), yg = g({}, Ga, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), wg = Bt(yg), jg = g({}, Ni, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Sg = Bt(jg), kg = g({}, Ga, {
    newState: 0,
    oldState: 0
  }), Ng = Bt(kg), Cg = [9, 13, 27, 32], $c = Ln && "CompositionEvent" in window, _l = null;
  Ln && "documentMode" in document && (_l = document.documentMode);
  var Eg = Ln && "TextEvent" in window && !_l, ah = Ln && (!$c || _l && 8 < _l && 11 >= _l), sh = " ", lh = !1;
  function ih(e, t) {
    switch (e) {
      case "keyup":
        return Cg.indexOf(t.keyCode) !== -1;
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
  function rh(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var js = !1;
  function Mg(e, t) {
    switch (e) {
      case "compositionend":
        return rh(t);
      case "keypress":
        return t.which !== 32 ? null : (lh = !0, sh);
      case "textInput":
        return e = t.data, e === sh && lh ? null : e;
      default:
        return null;
    }
  }
  function Tg(e, t) {
    if (js)
      return e === "compositionend" || !$c && ih(e, t) ? (e = Wd(), wi = zc = ia = null, js = !1, e) : null;
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
        return ah && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Rg = {
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
  function ch(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Rg[e.type] : t === "textarea";
  }
  function oh(e, t, n, l) {
    ys ? ws ? ws.push(l) : ws = [l] : ys = l, t = pr(t, "onChange"), 0 < t.length && (n = new ki(
      "onChange",
      "change",
      null,
      n,
      l
    ), e.push({ event: n, listeners: t }));
  }
  var bl = null, gl = null;
  function Ag(e) {
    Xm(e, 0);
  }
  function Ci(e) {
    var t = dl(e);
    if (qd(t)) return e;
  }
  function uh(e, t) {
    if (e === "change") return t;
  }
  var dh = !1;
  if (Ln) {
    var Uc;
    if (Ln) {
      var Bc = "oninput" in document;
      if (!Bc) {
        var hh = document.createElement("div");
        hh.setAttribute("oninput", "return;"), Bc = typeof hh.oninput == "function";
      }
      Uc = Bc;
    } else Uc = !1;
    dh = Uc && (!document.documentMode || 9 < document.documentMode);
  }
  function fh() {
    bl && (bl.detachEvent("onpropertychange", mh), gl = bl = null);
  }
  function mh(e) {
    if (e.propertyName === "value" && Ci(gl)) {
      var t = [];
      oh(
        t,
        gl,
        e,
        Tc(e)
      ), Pd(Ag, t);
    }
  }
  function zg(e, t, n) {
    e === "focusin" ? (fh(), bl = t, gl = n, bl.attachEvent("onpropertychange", mh)) : e === "focusout" && fh();
  }
  function Og(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return Ci(gl);
  }
  function Dg(e, t) {
    if (e === "click") return Ci(t);
  }
  function Hg(e, t) {
    if (e === "input" || e === "change")
      return Ci(t);
  }
  function Lg(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var Kt = typeof Object.is == "function" ? Object.is : Lg;
  function vl(e, t) {
    if (Kt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var n = Object.keys(e), l = Object.keys(t);
    if (n.length !== l.length) return !1;
    for (l = 0; l < n.length; l++) {
      var c = n[l];
      if (!Ae.call(t, c) || !Kt(e[c], t[c]))
        return !1;
    }
    return !0;
  }
  function ph(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function _h(e, t) {
    var n = ph(e);
    e = 0;
    for (var l; n; ) {
      if (n.nodeType === 3) {
        if (l = e + n.textContent.length, e <= t && l >= t)
          return { node: n, offset: t - e };
        e = l;
      }
      e: {
        for (; n; ) {
          if (n.nextSibling) {
            n = n.nextSibling;
            break e;
          }
          n = n.parentNode;
        }
        n = void 0;
      }
      n = ph(n);
    }
  }
  function bh(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? bh(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function gh(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = xi(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = xi(e.document);
    }
    return t;
  }
  function Fc(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var $g = Ln && "documentMode" in document && 11 >= document.documentMode, Ss = null, Gc = null, xl = null, Vc = !1;
  function vh(e, t, n) {
    var l = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    Vc || Ss == null || Ss !== xi(l) || (l = Ss, "selectionStart" in l && Fc(l) ? l = { start: l.selectionStart, end: l.selectionEnd } : (l = (l.ownerDocument && l.ownerDocument.defaultView || window).getSelection(), l = {
      anchorNode: l.anchorNode,
      anchorOffset: l.anchorOffset,
      focusNode: l.focusNode,
      focusOffset: l.focusOffset
    }), xl && vl(xl, l) || (xl = l, l = pr(Gc, "onSelect"), 0 < l.length && (t = new ki(
      "onSelect",
      "select",
      null,
      t,
      n
    ), e.push({ event: t, listeners: l }), t.target = Ss)));
  }
  function Va(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var ks = {
    animationend: Va("Animation", "AnimationEnd"),
    animationiteration: Va("Animation", "AnimationIteration"),
    animationstart: Va("Animation", "AnimationStart"),
    transitionrun: Va("Transition", "TransitionRun"),
    transitionstart: Va("Transition", "TransitionStart"),
    transitioncancel: Va("Transition", "TransitionCancel"),
    transitionend: Va("Transition", "TransitionEnd")
  }, qc = {}, xh = {};
  Ln && (xh = document.createElement("div").style, "AnimationEvent" in window || (delete ks.animationend.animation, delete ks.animationiteration.animation, delete ks.animationstart.animation), "TransitionEvent" in window || delete ks.transitionend.transition);
  function qa(e) {
    if (qc[e]) return qc[e];
    if (!ks[e]) return e;
    var t = ks[e], n;
    for (n in t)
      if (t.hasOwnProperty(n) && n in xh)
        return qc[e] = t[n];
    return e;
  }
  var yh = qa("animationend"), wh = qa("animationiteration"), jh = qa("animationstart"), Ug = qa("transitionrun"), Bg = qa("transitionstart"), Fg = qa("transitioncancel"), Sh = qa("transitionend"), kh = /* @__PURE__ */ new Map(), Yc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Yc.push("scrollEnd");
  function xn(e, t) {
    kh.set(e, t), Fa(t, [e]);
  }
  var Ei = typeof reportError == "function" ? reportError : function(e) {
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
  }, on = [], Ns = 0, Xc = 0;
  function Mi() {
    for (var e = Ns, t = Xc = Ns = 0; t < e; ) {
      var n = on[t];
      on[t++] = null;
      var l = on[t];
      on[t++] = null;
      var c = on[t];
      on[t++] = null;
      var u = on[t];
      if (on[t++] = null, l !== null && c !== null) {
        var p = l.pending;
        p === null ? c.next = c : (c.next = p.next, p.next = c), l.pending = c;
      }
      u !== 0 && Nh(n, c, u);
    }
  }
  function Ti(e, t, n, l) {
    on[Ns++] = e, on[Ns++] = t, on[Ns++] = n, on[Ns++] = l, Xc |= l, e.lanes |= l, e = e.alternate, e !== null && (e.lanes |= l);
  }
  function Qc(e, t, n, l) {
    return Ti(e, t, n, l), Ri(e);
  }
  function Ya(e, t) {
    return Ti(e, null, null, t), Ri(e);
  }
  function Nh(e, t, n) {
    e.lanes |= n;
    var l = e.alternate;
    l !== null && (l.lanes |= n);
    for (var c = !1, u = e.return; u !== null; )
      u.childLanes |= n, l = u.alternate, l !== null && (l.childLanes |= n), u.tag === 22 && (e = u.stateNode, e === null || e._visibility & 1 || (c = !0)), e = u, u = u.return;
    return e.tag === 3 ? (u = e.stateNode, c && t !== null && (c = 31 - Ct(n), e = u.hiddenUpdates, l = e[c], l === null ? e[c] = [t] : l.push(t), t.lane = n | 536870912), u) : null;
  }
  function Ri(e) {
    if (50 < Gl)
      throw Gl = 0, au = null, Error(o(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var Cs = {};
  function Gg(e, t, n, l) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = l, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Jt(e, t, n, l) {
    return new Gg(e, t, n, l);
  }
  function Zc(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function $n(e, t) {
    var n = e.alternate;
    return n === null ? (n = Jt(
      e.tag,
      t,
      e.key,
      e.mode
    ), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 65011712, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
  }
  function Ch(e, t) {
    e.flags &= 65011714;
    var n = e.alternate;
    return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function Ai(e, t, n, l, c, u) {
    var p = 0;
    if (l = e, typeof e == "function") Zc(e) && (p = 1);
    else if (typeof e == "string")
      p = Qv(
        e,
        n,
        ne.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case ae:
          return e = Jt(31, n, t, c), e.elementType = ae, e.lanes = u, e;
        case N:
          return Xa(n.children, c, u, t);
        case C:
          p = 8, c |= 24;
          break;
        case E:
          return e = Jt(12, n, t, c | 2), e.elementType = E, e.lanes = u, e;
        case X:
          return e = Jt(13, n, t, c), e.elementType = X, e.lanes = u, e;
        case F:
          return e = Jt(19, n, t, c), e.elementType = F, e.lanes = u, e;
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case U:
                p = 10;
                break e;
              case z:
                p = 9;
                break e;
              case Q:
                p = 11;
                break e;
              case Z:
                p = 14;
                break e;
              case I:
                p = 16, l = null;
                break e;
            }
          p = 29, n = Error(
            o(130, e === null ? "null" : typeof e, "")
          ), l = null;
      }
    return t = Jt(p, n, t, c), t.elementType = e, t.type = l, t.lanes = u, t;
  }
  function Xa(e, t, n, l) {
    return e = Jt(7, e, l, t), e.lanes = n, e;
  }
  function Kc(e, t, n) {
    return e = Jt(6, e, null, t), e.lanes = n, e;
  }
  function Eh(e) {
    var t = Jt(18, null, null, 0);
    return t.stateNode = e, t;
  }
  function Jc(e, t, n) {
    return t = Jt(
      4,
      e.children !== null ? e.children : [],
      e.key,
      t
    ), t.lanes = n, t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation
    }, t;
  }
  var Mh = /* @__PURE__ */ new WeakMap();
  function un(e, t) {
    if (typeof e == "object" && e !== null) {
      var n = Mh.get(e);
      return n !== void 0 ? n : (t = {
        value: e,
        source: t,
        stack: Ie(t)
      }, Mh.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: Ie(t)
    };
  }
  var Es = [], Ms = 0, zi = null, yl = 0, dn = [], hn = 0, ra = null, Cn = 1, En = "";
  function Un(e, t) {
    Es[Ms++] = yl, Es[Ms++] = zi, zi = e, yl = t;
  }
  function Th(e, t, n) {
    dn[hn++] = Cn, dn[hn++] = En, dn[hn++] = ra, ra = e;
    var l = Cn;
    e = En;
    var c = 32 - Ct(l) - 1;
    l &= ~(1 << c), n += 1;
    var u = 32 - Ct(t) + c;
    if (30 < u) {
      var p = c - c % 5;
      u = (l & (1 << p) - 1).toString(32), l >>= p, c -= p, Cn = 1 << 32 - Ct(t) + c | n << c | l, En = u + e;
    } else
      Cn = 1 << u | n << c | l, En = e;
  }
  function Pc(e) {
    e.return !== null && (Un(e, 1), Th(e, 1, 0));
  }
  function Wc(e) {
    for (; e === zi; )
      zi = Es[--Ms], Es[Ms] = null, yl = Es[--Ms], Es[Ms] = null;
    for (; e === ra; )
      ra = dn[--hn], dn[hn] = null, En = dn[--hn], dn[hn] = null, Cn = dn[--hn], dn[hn] = null;
  }
  function Rh(e, t) {
    dn[hn++] = Cn, dn[hn++] = En, dn[hn++] = ra, Cn = t.id, En = t.overflow, ra = e;
  }
  var xt = null, Qe = null, Te = !1, ca = null, fn = !1, Ic = Error(o(519));
  function oa(e) {
    var t = Error(
      o(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw wl(un(t, e)), Ic;
  }
  function Ah(e) {
    var t = e.stateNode, n = e.type, l = e.memoizedProps;
    switch (t[vt] = e, t[Ut] = l, n) {
      case "dialog":
        Ne("cancel", t), Ne("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        Ne("load", t);
        break;
      case "video":
      case "audio":
        for (n = 0; n < ql.length; n++)
          Ne(ql[n], t);
        break;
      case "source":
        Ne("error", t);
        break;
      case "img":
      case "image":
      case "link":
        Ne("error", t), Ne("load", t);
        break;
      case "details":
        Ne("toggle", t);
        break;
      case "input":
        Ne("invalid", t), Yd(
          t,
          l.value,
          l.defaultValue,
          l.checked,
          l.defaultChecked,
          l.type,
          l.name,
          !0
        );
        break;
      case "select":
        Ne("invalid", t);
        break;
      case "textarea":
        Ne("invalid", t), Qd(t, l.value, l.defaultValue, l.children);
    }
    n = l.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || l.suppressHydrationWarning === !0 || Jm(t.textContent, n) ? (l.popover != null && (Ne("beforetoggle", t), Ne("toggle", t)), l.onScroll != null && Ne("scroll", t), l.onScrollEnd != null && Ne("scrollend", t), l.onClick != null && (t.onclick = Hn), t = !0) : t = !1, t || oa(e, !0);
  }
  function zh(e) {
    for (xt = e.return; xt; )
      switch (xt.tag) {
        case 5:
        case 31:
        case 13:
          fn = !1;
          return;
        case 27:
        case 3:
          fn = !0;
          return;
        default:
          xt = xt.return;
      }
  }
  function Ts(e) {
    if (e !== xt) return !1;
    if (!Te) return zh(e), Te = !0, !1;
    var t = e.tag, n;
    if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = !(n !== "form" && n !== "button") || gu(e.type, e.memoizedProps)), n = !n), n && Qe && oa(e), zh(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
      Qe = lp(e);
    } else if (t === 31) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
      Qe = lp(e);
    } else
      t === 27 ? (t = Qe, ja(e.type) ? (e = ju, ju = null, Qe = e) : Qe = t) : Qe = xt ? pn(e.stateNode.nextSibling) : null;
    return !0;
  }
  function Qa() {
    Qe = xt = null, Te = !1;
  }
  function eo() {
    var e = ca;
    return e !== null && (qt === null ? qt = e : qt.push.apply(
      qt,
      e
    ), ca = null), e;
  }
  function wl(e) {
    ca === null ? ca = [e] : ca.push(e);
  }
  var to = k(null), Za = null, Bn = null;
  function ua(e, t, n) {
    ee(to, t._currentValue), t._currentValue = n;
  }
  function Fn(e) {
    e._currentValue = to.current, G(to);
  }
  function no(e, t, n) {
    for (; e !== null; ) {
      var l = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, l !== null && (l.childLanes |= t)) : l !== null && (l.childLanes & t) !== t && (l.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function ao(e, t, n, l) {
    var c = e.child;
    for (c !== null && (c.return = e); c !== null; ) {
      var u = c.dependencies;
      if (u !== null) {
        var p = c.child;
        u = u.firstContext;
        e: for (; u !== null; ) {
          var y = u;
          u = c;
          for (var T = 0; T < t.length; T++)
            if (y.context === t[T]) {
              u.lanes |= n, y = u.alternate, y !== null && (y.lanes |= n), no(
                u.return,
                n,
                e
              ), l || (p = null);
              break e;
            }
          u = y.next;
        }
      } else if (c.tag === 18) {
        if (p = c.return, p === null) throw Error(o(341));
        p.lanes |= n, u = p.alternate, u !== null && (u.lanes |= n), no(p, n, e), p = null;
      } else p = c.child;
      if (p !== null) p.return = c;
      else
        for (p = c; p !== null; ) {
          if (p === e) {
            p = null;
            break;
          }
          if (c = p.sibling, c !== null) {
            c.return = p.return, p = c;
            break;
          }
          p = p.return;
        }
      c = p;
    }
  }
  function Rs(e, t, n, l) {
    e = null;
    for (var c = t, u = !1; c !== null; ) {
      if (!u) {
        if ((c.flags & 524288) !== 0) u = !0;
        else if ((c.flags & 262144) !== 0) break;
      }
      if (c.tag === 10) {
        var p = c.alternate;
        if (p === null) throw Error(o(387));
        if (p = p.memoizedProps, p !== null) {
          var y = c.type;
          Kt(c.pendingProps.value, p.value) || (e !== null ? e.push(y) : e = [y]);
        }
      } else if (c === ge.current) {
        if (p = c.alternate, p === null) throw Error(o(387));
        p.memoizedState.memoizedState !== c.memoizedState.memoizedState && (e !== null ? e.push(Kl) : e = [Kl]);
      }
      c = c.return;
    }
    e !== null && ao(
      t,
      e,
      n,
      l
    ), t.flags |= 262144;
  }
  function Oi(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!Kt(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function Ka(e) {
    Za = e, Bn = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function yt(e) {
    return Oh(Za, e);
  }
  function Di(e, t) {
    return Za === null && Ka(e), Oh(e, t);
  }
  function Oh(e, t) {
    var n = t._currentValue;
    if (t = { context: t, memoizedValue: n, next: null }, Bn === null) {
      if (e === null) throw Error(o(308));
      Bn = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else Bn = Bn.next = t;
    return n;
  }
  var Vg = typeof AbortController < "u" ? AbortController : function() {
    var e = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(n, l) {
        e.push(l);
      }
    };
    this.abort = function() {
      t.aborted = !0, e.forEach(function(n) {
        return n();
      });
    };
  }, qg = a.unstable_scheduleCallback, Yg = a.unstable_NormalPriority, rt = {
    $$typeof: U,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function so() {
    return {
      controller: new Vg(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function jl(e) {
    e.refCount--, e.refCount === 0 && qg(Yg, function() {
      e.controller.abort();
    });
  }
  var Sl = null, lo = 0, As = 0, zs = null;
  function Xg(e, t) {
    if (Sl === null) {
      var n = Sl = [];
      lo = 0, As = ou(), zs = {
        status: "pending",
        value: void 0,
        then: function(l) {
          n.push(l);
        }
      };
    }
    return lo++, t.then(Dh, Dh), t;
  }
  function Dh() {
    if (--lo === 0 && Sl !== null) {
      zs !== null && (zs.status = "fulfilled");
      var e = Sl;
      Sl = null, As = 0, zs = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function Qg(e, t) {
    var n = [], l = {
      status: "pending",
      value: null,
      reason: null,
      then: function(c) {
        n.push(c);
      }
    };
    return e.then(
      function() {
        l.status = "fulfilled", l.value = t;
        for (var c = 0; c < n.length; c++) (0, n[c])(t);
      },
      function(c) {
        for (l.status = "rejected", l.reason = c, c = 0; c < n.length; c++)
          (0, n[c])(void 0);
      }
    ), l;
  }
  var Hh = R.S;
  R.S = function(e, t) {
    xm = st(), typeof t == "object" && t !== null && typeof t.then == "function" && Xg(e, t), Hh !== null && Hh(e, t);
  };
  var Ja = k(null);
  function io() {
    var e = Ja.current;
    return e !== null ? e : qe.pooledCache;
  }
  function Hi(e, t) {
    t === null ? ee(Ja, Ja.current) : ee(Ja, t.pool);
  }
  function Lh() {
    var e = io();
    return e === null ? null : { parent: rt._currentValue, pool: e };
  }
  var Os = Error(o(460)), ro = Error(o(474)), Li = Error(o(542)), $i = { then: function() {
  } };
  function $h(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function Uh(e, t, n) {
    switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(Hn, Hn), t = n), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, Fh(e), e;
      default:
        if (typeof t.status == "string") t.then(Hn, Hn);
        else {
          if (e = qe, e !== null && 100 < e.shellSuspendCounter)
            throw Error(o(482));
          e = t, e.status = "pending", e.then(
            function(l) {
              if (t.status === "pending") {
                var c = t;
                c.status = "fulfilled", c.value = l;
              }
            },
            function(l) {
              if (t.status === "pending") {
                var c = t;
                c.status = "rejected", c.reason = l;
              }
            }
          );
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw e = t.reason, Fh(e), e;
        }
        throw Wa = t, Os;
    }
  }
  function Pa(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (n) {
      throw n !== null && typeof n == "object" && typeof n.then == "function" ? (Wa = n, Os) : n;
    }
  }
  var Wa = null;
  function Bh() {
    if (Wa === null) throw Error(o(459));
    var e = Wa;
    return Wa = null, e;
  }
  function Fh(e) {
    if (e === Os || e === Li)
      throw Error(o(483));
  }
  var Ds = null, kl = 0;
  function Ui(e) {
    var t = kl;
    return kl += 1, Ds === null && (Ds = []), Uh(Ds, e, t);
  }
  function Nl(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function Bi(e, t) {
    throw t.$$typeof === j ? Error(o(525)) : (e = Object.prototype.toString.call(t), Error(
      o(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function Gh(e) {
    function t(O, A) {
      if (e) {
        var L = O.deletions;
        L === null ? (O.deletions = [A], O.flags |= 16) : L.push(A);
      }
    }
    function n(O, A) {
      if (!e) return null;
      for (; A !== null; )
        t(O, A), A = A.sibling;
      return null;
    }
    function l(O) {
      for (var A = /* @__PURE__ */ new Map(); O !== null; )
        O.key !== null ? A.set(O.key, O) : A.set(O.index, O), O = O.sibling;
      return A;
    }
    function c(O, A) {
      return O = $n(O, A), O.index = 0, O.sibling = null, O;
    }
    function u(O, A, L) {
      return O.index = L, e ? (L = O.alternate, L !== null ? (L = L.index, L < A ? (O.flags |= 67108866, A) : L) : (O.flags |= 67108866, A)) : (O.flags |= 1048576, A);
    }
    function p(O) {
      return e && O.alternate === null && (O.flags |= 67108866), O;
    }
    function y(O, A, L, K) {
      return A === null || A.tag !== 6 ? (A = Kc(L, O.mode, K), A.return = O, A) : (A = c(A, L), A.return = O, A);
    }
    function T(O, A, L, K) {
      var pe = L.type;
      return pe === N ? Y(
        O,
        A,
        L.props.children,
        K,
        L.key
      ) : A !== null && (A.elementType === pe || typeof pe == "object" && pe !== null && pe.$$typeof === I && Pa(pe) === A.type) ? (A = c(A, L.props), Nl(A, L), A.return = O, A) : (A = Ai(
        L.type,
        L.key,
        L.props,
        null,
        O.mode,
        K
      ), Nl(A, L), A.return = O, A);
    }
    function $(O, A, L, K) {
      return A === null || A.tag !== 4 || A.stateNode.containerInfo !== L.containerInfo || A.stateNode.implementation !== L.implementation ? (A = Jc(L, O.mode, K), A.return = O, A) : (A = c(A, L.children || []), A.return = O, A);
    }
    function Y(O, A, L, K, pe) {
      return A === null || A.tag !== 7 ? (A = Xa(
        L,
        O.mode,
        K,
        pe
      ), A.return = O, A) : (A = c(A, L), A.return = O, A);
    }
    function J(O, A, L) {
      if (typeof A == "string" && A !== "" || typeof A == "number" || typeof A == "bigint")
        return A = Kc(
          "" + A,
          O.mode,
          L
        ), A.return = O, A;
      if (typeof A == "object" && A !== null) {
        switch (A.$$typeof) {
          case w:
            return L = Ai(
              A.type,
              A.key,
              A.props,
              null,
              O.mode,
              L
            ), Nl(L, A), L.return = O, L;
          case S:
            return A = Jc(
              A,
              O.mode,
              L
            ), A.return = O, A;
          case I:
            return A = Pa(A), J(O, A, L);
        }
        if (M(A) || re(A))
          return A = Xa(
            A,
            O.mode,
            L,
            null
          ), A.return = O, A;
        if (typeof A.then == "function")
          return J(O, Ui(A), L);
        if (A.$$typeof === U)
          return J(
            O,
            Di(O, A),
            L
          );
        Bi(O, A);
      }
      return null;
    }
    function B(O, A, L, K) {
      var pe = A !== null ? A.key : null;
      if (typeof L == "string" && L !== "" || typeof L == "number" || typeof L == "bigint")
        return pe !== null ? null : y(O, A, "" + L, K);
      if (typeof L == "object" && L !== null) {
        switch (L.$$typeof) {
          case w:
            return L.key === pe ? T(O, A, L, K) : null;
          case S:
            return L.key === pe ? $(O, A, L, K) : null;
          case I:
            return L = Pa(L), B(O, A, L, K);
        }
        if (M(L) || re(L))
          return pe !== null ? null : Y(O, A, L, K, null);
        if (typeof L.then == "function")
          return B(
            O,
            A,
            Ui(L),
            K
          );
        if (L.$$typeof === U)
          return B(
            O,
            A,
            Di(O, L),
            K
          );
        Bi(O, L);
      }
      return null;
    }
    function V(O, A, L, K, pe) {
      if (typeof K == "string" && K !== "" || typeof K == "number" || typeof K == "bigint")
        return O = O.get(L) || null, y(A, O, "" + K, pe);
      if (typeof K == "object" && K !== null) {
        switch (K.$$typeof) {
          case w:
            return O = O.get(
              K.key === null ? L : K.key
            ) || null, T(A, O, K, pe);
          case S:
            return O = O.get(
              K.key === null ? L : K.key
            ) || null, $(A, O, K, pe);
          case I:
            return K = Pa(K), V(
              O,
              A,
              L,
              K,
              pe
            );
        }
        if (M(K) || re(K))
          return O = O.get(L) || null, Y(A, O, K, pe, null);
        if (typeof K.then == "function")
          return V(
            O,
            A,
            L,
            Ui(K),
            pe
          );
        if (K.$$typeof === U)
          return V(
            O,
            A,
            L,
            Di(A, K),
            pe
          );
        Bi(A, K);
      }
      return null;
    }
    function ue(O, A, L, K) {
      for (var pe = null, ze = null, he = A, Se = A = 0, Me = null; he !== null && Se < L.length; Se++) {
        he.index > Se ? (Me = he, he = null) : Me = he.sibling;
        var Oe = B(
          O,
          he,
          L[Se],
          K
        );
        if (Oe === null) {
          he === null && (he = Me);
          break;
        }
        e && he && Oe.alternate === null && t(O, he), A = u(Oe, A, Se), ze === null ? pe = Oe : ze.sibling = Oe, ze = Oe, he = Me;
      }
      if (Se === L.length)
        return n(O, he), Te && Un(O, Se), pe;
      if (he === null) {
        for (; Se < L.length; Se++)
          he = J(O, L[Se], K), he !== null && (A = u(
            he,
            A,
            Se
          ), ze === null ? pe = he : ze.sibling = he, ze = he);
        return Te && Un(O, Se), pe;
      }
      for (he = l(he); Se < L.length; Se++)
        Me = V(
          he,
          O,
          Se,
          L[Se],
          K
        ), Me !== null && (e && Me.alternate !== null && he.delete(
          Me.key === null ? Se : Me.key
        ), A = u(
          Me,
          A,
          Se
        ), ze === null ? pe = Me : ze.sibling = Me, ze = Me);
      return e && he.forEach(function(Ea) {
        return t(O, Ea);
      }), Te && Un(O, Se), pe;
    }
    function be(O, A, L, K) {
      if (L == null) throw Error(o(151));
      for (var pe = null, ze = null, he = A, Se = A = 0, Me = null, Oe = L.next(); he !== null && !Oe.done; Se++, Oe = L.next()) {
        he.index > Se ? (Me = he, he = null) : Me = he.sibling;
        var Ea = B(O, he, Oe.value, K);
        if (Ea === null) {
          he === null && (he = Me);
          break;
        }
        e && he && Ea.alternate === null && t(O, he), A = u(Ea, A, Se), ze === null ? pe = Ea : ze.sibling = Ea, ze = Ea, he = Me;
      }
      if (Oe.done)
        return n(O, he), Te && Un(O, Se), pe;
      if (he === null) {
        for (; !Oe.done; Se++, Oe = L.next())
          Oe = J(O, Oe.value, K), Oe !== null && (A = u(Oe, A, Se), ze === null ? pe = Oe : ze.sibling = Oe, ze = Oe);
        return Te && Un(O, Se), pe;
      }
      for (he = l(he); !Oe.done; Se++, Oe = L.next())
        Oe = V(he, O, Se, Oe.value, K), Oe !== null && (e && Oe.alternate !== null && he.delete(Oe.key === null ? Se : Oe.key), A = u(Oe, A, Se), ze === null ? pe = Oe : ze.sibling = Oe, ze = Oe);
      return e && he.forEach(function(sx) {
        return t(O, sx);
      }), Te && Un(O, Se), pe;
    }
    function Ve(O, A, L, K) {
      if (typeof L == "object" && L !== null && L.type === N && L.key === null && (L = L.props.children), typeof L == "object" && L !== null) {
        switch (L.$$typeof) {
          case w:
            e: {
              for (var pe = L.key; A !== null; ) {
                if (A.key === pe) {
                  if (pe = L.type, pe === N) {
                    if (A.tag === 7) {
                      n(
                        O,
                        A.sibling
                      ), K = c(
                        A,
                        L.props.children
                      ), K.return = O, O = K;
                      break e;
                    }
                  } else if (A.elementType === pe || typeof pe == "object" && pe !== null && pe.$$typeof === I && Pa(pe) === A.type) {
                    n(
                      O,
                      A.sibling
                    ), K = c(A, L.props), Nl(K, L), K.return = O, O = K;
                    break e;
                  }
                  n(O, A);
                  break;
                } else t(O, A);
                A = A.sibling;
              }
              L.type === N ? (K = Xa(
                L.props.children,
                O.mode,
                K,
                L.key
              ), K.return = O, O = K) : (K = Ai(
                L.type,
                L.key,
                L.props,
                null,
                O.mode,
                K
              ), Nl(K, L), K.return = O, O = K);
            }
            return p(O);
          case S:
            e: {
              for (pe = L.key; A !== null; ) {
                if (A.key === pe)
                  if (A.tag === 4 && A.stateNode.containerInfo === L.containerInfo && A.stateNode.implementation === L.implementation) {
                    n(
                      O,
                      A.sibling
                    ), K = c(A, L.children || []), K.return = O, O = K;
                    break e;
                  } else {
                    n(O, A);
                    break;
                  }
                else t(O, A);
                A = A.sibling;
              }
              K = Jc(L, O.mode, K), K.return = O, O = K;
            }
            return p(O);
          case I:
            return L = Pa(L), Ve(
              O,
              A,
              L,
              K
            );
        }
        if (M(L))
          return ue(
            O,
            A,
            L,
            K
          );
        if (re(L)) {
          if (pe = re(L), typeof pe != "function") throw Error(o(150));
          return L = pe.call(L), be(
            O,
            A,
            L,
            K
          );
        }
        if (typeof L.then == "function")
          return Ve(
            O,
            A,
            Ui(L),
            K
          );
        if (L.$$typeof === U)
          return Ve(
            O,
            A,
            Di(O, L),
            K
          );
        Bi(O, L);
      }
      return typeof L == "string" && L !== "" || typeof L == "number" || typeof L == "bigint" ? (L = "" + L, A !== null && A.tag === 6 ? (n(O, A.sibling), K = c(A, L), K.return = O, O = K) : (n(O, A), K = Kc(L, O.mode, K), K.return = O, O = K), p(O)) : n(O, A);
    }
    return function(O, A, L, K) {
      try {
        kl = 0;
        var pe = Ve(
          O,
          A,
          L,
          K
        );
        return Ds = null, pe;
      } catch (he) {
        if (he === Os || he === Li) throw he;
        var ze = Jt(29, he, null, O.mode);
        return ze.lanes = K, ze.return = O, ze;
      } finally {
      }
    };
  }
  var Ia = Gh(!0), Vh = Gh(!1), da = !1;
  function co(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function oo(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function ha(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function fa(e, t, n) {
    var l = e.updateQueue;
    if (l === null) return null;
    if (l = l.shared, (He & 2) !== 0) {
      var c = l.pending;
      return c === null ? t.next = t : (t.next = c.next, c.next = t), l.pending = t, t = Ri(e), Nh(e, null, n), t;
    }
    return Ti(e, l, t, n), Ri(e);
  }
  function Cl(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194048) !== 0)) {
      var l = t.lanes;
      l &= e.pendingLanes, n |= l, t.lanes = n, Od(e, n);
    }
  }
  function uo(e, t) {
    var n = e.updateQueue, l = e.alternate;
    if (l !== null && (l = l.updateQueue, n === l)) {
      var c = null, u = null;
      if (n = n.firstBaseUpdate, n !== null) {
        do {
          var p = {
            lane: n.lane,
            tag: n.tag,
            payload: n.payload,
            callback: null,
            next: null
          };
          u === null ? c = u = p : u = u.next = p, n = n.next;
        } while (n !== null);
        u === null ? c = u = t : u = u.next = t;
      } else c = u = t;
      n = {
        baseState: l.baseState,
        firstBaseUpdate: c,
        lastBaseUpdate: u,
        shared: l.shared,
        callbacks: l.callbacks
      }, e.updateQueue = n;
      return;
    }
    e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
  }
  var ho = !1;
  function El() {
    if (ho) {
      var e = zs;
      if (e !== null) throw e;
    }
  }
  function Ml(e, t, n, l) {
    ho = !1;
    var c = e.updateQueue;
    da = !1;
    var u = c.firstBaseUpdate, p = c.lastBaseUpdate, y = c.shared.pending;
    if (y !== null) {
      c.shared.pending = null;
      var T = y, $ = T.next;
      T.next = null, p === null ? u = $ : p.next = $, p = T;
      var Y = e.alternate;
      Y !== null && (Y = Y.updateQueue, y = Y.lastBaseUpdate, y !== p && (y === null ? Y.firstBaseUpdate = $ : y.next = $, Y.lastBaseUpdate = T));
    }
    if (u !== null) {
      var J = c.baseState;
      p = 0, Y = $ = T = null, y = u;
      do {
        var B = y.lane & -536870913, V = B !== y.lane;
        if (V ? (Ee & B) === B : (l & B) === B) {
          B !== 0 && B === As && (ho = !0), Y !== null && (Y = Y.next = {
            lane: 0,
            tag: y.tag,
            payload: y.payload,
            callback: null,
            next: null
          });
          e: {
            var ue = e, be = y;
            B = t;
            var Ve = n;
            switch (be.tag) {
              case 1:
                if (ue = be.payload, typeof ue == "function") {
                  J = ue.call(Ve, J, B);
                  break e;
                }
                J = ue;
                break e;
              case 3:
                ue.flags = ue.flags & -65537 | 128;
              case 0:
                if (ue = be.payload, B = typeof ue == "function" ? ue.call(Ve, J, B) : ue, B == null) break e;
                J = g({}, J, B);
                break e;
              case 2:
                da = !0;
            }
          }
          B = y.callback, B !== null && (e.flags |= 64, V && (e.flags |= 8192), V = c.callbacks, V === null ? c.callbacks = [B] : V.push(B));
        } else
          V = {
            lane: B,
            tag: y.tag,
            payload: y.payload,
            callback: y.callback,
            next: null
          }, Y === null ? ($ = Y = V, T = J) : Y = Y.next = V, p |= B;
        if (y = y.next, y === null) {
          if (y = c.shared.pending, y === null)
            break;
          V = y, y = V.next, V.next = null, c.lastBaseUpdate = V, c.shared.pending = null;
        }
      } while (!0);
      Y === null && (T = J), c.baseState = T, c.firstBaseUpdate = $, c.lastBaseUpdate = Y, u === null && (c.shared.lanes = 0), ga |= p, e.lanes = p, e.memoizedState = J;
    }
  }
  function qh(e, t) {
    if (typeof e != "function")
      throw Error(o(191, e));
    e.call(t);
  }
  function Yh(e, t) {
    var n = e.callbacks;
    if (n !== null)
      for (e.callbacks = null, e = 0; e < n.length; e++)
        qh(n[e], t);
  }
  var Hs = k(null), Fi = k(0);
  function Xh(e, t) {
    e = Jn, ee(Fi, e), ee(Hs, t), Jn = e | t.baseLanes;
  }
  function fo() {
    ee(Fi, Jn), ee(Hs, Hs.current);
  }
  function mo() {
    Jn = Fi.current, G(Hs), G(Fi);
  }
  var Pt = k(null), mn = null;
  function ma(e) {
    var t = e.alternate;
    ee(lt, lt.current & 1), ee(Pt, e), mn === null && (t === null || Hs.current !== null || t.memoizedState !== null) && (mn = e);
  }
  function po(e) {
    ee(lt, lt.current), ee(Pt, e), mn === null && (mn = e);
  }
  function Qh(e) {
    e.tag === 22 ? (ee(lt, lt.current), ee(Pt, e), mn === null && (mn = e)) : pa();
  }
  function pa() {
    ee(lt, lt.current), ee(Pt, Pt.current);
  }
  function Wt(e) {
    G(Pt), mn === e && (mn = null), G(lt);
  }
  var lt = k(0);
  function Gi(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var n = t.memoizedState;
        if (n !== null && (n = n.dehydrated, n === null || yu(n) || wu(n)))
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
  var Gn = 0, we = null, Fe = null, ct = null, Vi = !1, Ls = !1, es = !1, qi = 0, Tl = 0, $s = null, Zg = 0;
  function et() {
    throw Error(o(321));
  }
  function _o(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++)
      if (!Kt(e[n], t[n])) return !1;
    return !0;
  }
  function bo(e, t, n, l, c, u) {
    return Gn = u, we = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, R.H = e === null || e.memoizedState === null ? Rf : Ao, es = !1, u = n(l, c), es = !1, Ls && (u = Kh(
      t,
      n,
      l,
      c
    )), Zh(e), u;
  }
  function Zh(e) {
    R.H = zl;
    var t = Fe !== null && Fe.next !== null;
    if (Gn = 0, ct = Fe = we = null, Vi = !1, Tl = 0, $s = null, t) throw Error(o(300));
    e === null || ot || (e = e.dependencies, e !== null && Oi(e) && (ot = !0));
  }
  function Kh(e, t, n, l) {
    we = e;
    var c = 0;
    do {
      if (Ls && ($s = null), Tl = 0, Ls = !1, 25 <= c) throw Error(o(301));
      if (c += 1, ct = Fe = null, e.updateQueue != null) {
        var u = e.updateQueue;
        u.lastEffect = null, u.events = null, u.stores = null, u.memoCache != null && (u.memoCache.index = 0);
      }
      R.H = Af, u = t(n, l);
    } while (Ls);
    return u;
  }
  function Kg() {
    var e = R.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? Rl(t) : t, e = e.useState()[0], (Fe !== null ? Fe.memoizedState : null) !== e && (we.flags |= 1024), t;
  }
  function go() {
    var e = qi !== 0;
    return qi = 0, e;
  }
  function vo(e, t, n) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
  }
  function xo(e) {
    if (Vi) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      Vi = !1;
    }
    Gn = 0, ct = Fe = we = null, Ls = !1, Tl = qi = 0, $s = null;
  }
  function Ot() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return ct === null ? we.memoizedState = ct = e : ct = ct.next = e, ct;
  }
  function it() {
    if (Fe === null) {
      var e = we.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Fe.next;
    var t = ct === null ? we.memoizedState : ct.next;
    if (t !== null)
      ct = t, Fe = e;
    else {
      if (e === null)
        throw we.alternate === null ? Error(o(467)) : Error(o(310));
      Fe = e, e = {
        memoizedState: Fe.memoizedState,
        baseState: Fe.baseState,
        baseQueue: Fe.baseQueue,
        queue: Fe.queue,
        next: null
      }, ct === null ? we.memoizedState = ct = e : ct = ct.next = e;
    }
    return ct;
  }
  function Yi() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Rl(e) {
    var t = Tl;
    return Tl += 1, $s === null && ($s = []), e = Uh($s, e, t), t = we, (ct === null ? t.memoizedState : ct.next) === null && (t = t.alternate, R.H = t === null || t.memoizedState === null ? Rf : Ao), e;
  }
  function Xi(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return Rl(e);
      if (e.$$typeof === U) return yt(e);
    }
    throw Error(o(438, String(e)));
  }
  function yo(e) {
    var t = null, n = we.updateQueue;
    if (n !== null && (t = n.memoCache), t == null) {
      var l = we.alternate;
      l !== null && (l = l.updateQueue, l !== null && (l = l.memoCache, l != null && (t = {
        data: l.data.map(function(c) {
          return c.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), n === null && (n = Yi(), we.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0)
      for (n = t.data[t.index] = Array(e), l = 0; l < e; l++)
        n[l] = ie;
    return t.index++, n;
  }
  function Vn(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function Qi(e) {
    var t = it();
    return wo(t, Fe, e);
  }
  function wo(e, t, n) {
    var l = e.queue;
    if (l === null) throw Error(o(311));
    l.lastRenderedReducer = n;
    var c = e.baseQueue, u = l.pending;
    if (u !== null) {
      if (c !== null) {
        var p = c.next;
        c.next = u.next, u.next = p;
      }
      t.baseQueue = c = u, l.pending = null;
    }
    if (u = e.baseState, c === null) e.memoizedState = u;
    else {
      t = c.next;
      var y = p = null, T = null, $ = t, Y = !1;
      do {
        var J = $.lane & -536870913;
        if (J !== $.lane ? (Ee & J) === J : (Gn & J) === J) {
          var B = $.revertLane;
          if (B === 0)
            T !== null && (T = T.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: $.action,
              hasEagerState: $.hasEagerState,
              eagerState: $.eagerState,
              next: null
            }), J === As && (Y = !0);
          else if ((Gn & B) === B) {
            $ = $.next, B === As && (Y = !0);
            continue;
          } else
            J = {
              lane: 0,
              revertLane: $.revertLane,
              gesture: null,
              action: $.action,
              hasEagerState: $.hasEagerState,
              eagerState: $.eagerState,
              next: null
            }, T === null ? (y = T = J, p = u) : T = T.next = J, we.lanes |= B, ga |= B;
          J = $.action, es && n(u, J), u = $.hasEagerState ? $.eagerState : n(u, J);
        } else
          B = {
            lane: J,
            revertLane: $.revertLane,
            gesture: $.gesture,
            action: $.action,
            hasEagerState: $.hasEagerState,
            eagerState: $.eagerState,
            next: null
          }, T === null ? (y = T = B, p = u) : T = T.next = B, we.lanes |= J, ga |= J;
        $ = $.next;
      } while ($ !== null && $ !== t);
      if (T === null ? p = u : T.next = y, !Kt(u, e.memoizedState) && (ot = !0, Y && (n = zs, n !== null)))
        throw n;
      e.memoizedState = u, e.baseState = p, e.baseQueue = T, l.lastRenderedState = u;
    }
    return c === null && (l.lanes = 0), [e.memoizedState, l.dispatch];
  }
  function jo(e) {
    var t = it(), n = t.queue;
    if (n === null) throw Error(o(311));
    n.lastRenderedReducer = e;
    var l = n.dispatch, c = n.pending, u = t.memoizedState;
    if (c !== null) {
      n.pending = null;
      var p = c = c.next;
      do
        u = e(u, p.action), p = p.next;
      while (p !== c);
      Kt(u, t.memoizedState) || (ot = !0), t.memoizedState = u, t.baseQueue === null && (t.baseState = u), n.lastRenderedState = u;
    }
    return [u, l];
  }
  function Jh(e, t, n) {
    var l = we, c = it(), u = Te;
    if (u) {
      if (n === void 0) throw Error(o(407));
      n = n();
    } else n = t();
    var p = !Kt(
      (Fe || c).memoizedState,
      n
    );
    if (p && (c.memoizedState = n, ot = !0), c = c.queue, No(Ih.bind(null, l, c, e), [
      e
    ]), c.getSnapshot !== t || p || ct !== null && ct.memoizedState.tag & 1) {
      if (l.flags |= 2048, Us(
        9,
        { destroy: void 0 },
        Wh.bind(
          null,
          l,
          c,
          n,
          t
        ),
        null
      ), qe === null) throw Error(o(349));
      u || (Gn & 127) !== 0 || Ph(l, t, n);
    }
    return n;
  }
  function Ph(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = we.updateQueue, t === null ? (t = Yi(), we.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function Wh(e, t, n, l) {
    t.value = n, t.getSnapshot = l, ef(t) && tf(e);
  }
  function Ih(e, t, n) {
    return n(function() {
      ef(t) && tf(e);
    });
  }
  function ef(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !Kt(e, n);
    } catch {
      return !0;
    }
  }
  function tf(e) {
    var t = Ya(e, 2);
    t !== null && Yt(t, e, 2);
  }
  function So(e) {
    var t = Ot();
    if (typeof e == "function") {
      var n = e;
      if (e = n(), es) {
        vn(!0);
        try {
          n();
        } finally {
          vn(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = e, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Vn,
      lastRenderedState: e
    }, t;
  }
  function nf(e, t, n, l) {
    return e.baseState = n, wo(
      e,
      Fe,
      typeof l == "function" ? l : Vn
    );
  }
  function Jg(e, t, n, l, c) {
    if (Ji(e)) throw Error(o(485));
    if (e = t.action, e !== null) {
      var u = {
        payload: c,
        action: e,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(p) {
          u.listeners.push(p);
        }
      };
      R.T !== null ? n(!0) : u.isTransition = !1, l(u), n = t.pending, n === null ? (u.next = t.pending = u, af(t, u)) : (u.next = n.next, t.pending = n.next = u);
    }
  }
  function af(e, t) {
    var n = t.action, l = t.payload, c = e.state;
    if (t.isTransition) {
      var u = R.T, p = {};
      R.T = p;
      try {
        var y = n(c, l), T = R.S;
        T !== null && T(p, y), sf(e, t, y);
      } catch ($) {
        ko(e, t, $);
      } finally {
        u !== null && p.types !== null && (u.types = p.types), R.T = u;
      }
    } else
      try {
        u = n(c, l), sf(e, t, u);
      } catch ($) {
        ko(e, t, $);
      }
  }
  function sf(e, t, n) {
    n !== null && typeof n == "object" && typeof n.then == "function" ? n.then(
      function(l) {
        lf(e, t, l);
      },
      function(l) {
        return ko(e, t, l);
      }
    ) : lf(e, t, n);
  }
  function lf(e, t, n) {
    t.status = "fulfilled", t.value = n, rf(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, af(e, n)));
  }
  function ko(e, t, n) {
    var l = e.pending;
    if (e.pending = null, l !== null) {
      l = l.next;
      do
        t.status = "rejected", t.reason = n, rf(t), t = t.next;
      while (t !== l);
    }
    e.action = null;
  }
  function rf(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function cf(e, t) {
    return t;
  }
  function of(e, t) {
    if (Te) {
      var n = qe.formState;
      if (n !== null) {
        e: {
          var l = we;
          if (Te) {
            if (Qe) {
              t: {
                for (var c = Qe, u = fn; c.nodeType !== 8; ) {
                  if (!u) {
                    c = null;
                    break t;
                  }
                  if (c = pn(
                    c.nextSibling
                  ), c === null) {
                    c = null;
                    break t;
                  }
                }
                u = c.data, c = u === "F!" || u === "F" ? c : null;
              }
              if (c) {
                Qe = pn(
                  c.nextSibling
                ), l = c.data === "F!";
                break e;
              }
            }
            oa(l);
          }
          l = !1;
        }
        l && (t = n[0]);
      }
    }
    return n = Ot(), n.memoizedState = n.baseState = t, l = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: cf,
      lastRenderedState: t
    }, n.queue = l, n = Ef.bind(
      null,
      we,
      l
    ), l.dispatch = n, l = So(!1), u = Ro.bind(
      null,
      we,
      !1,
      l.queue
    ), l = Ot(), c = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, l.queue = c, n = Jg.bind(
      null,
      we,
      c,
      u,
      n
    ), c.dispatch = n, l.memoizedState = e, [t, n, !1];
  }
  function uf(e) {
    var t = it();
    return df(t, Fe, e);
  }
  function df(e, t, n) {
    if (t = wo(
      e,
      t,
      cf
    )[0], e = Qi(Vn)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var l = Rl(t);
      } catch (p) {
        throw p === Os ? Li : p;
      }
    else l = t;
    t = it();
    var c = t.queue, u = c.dispatch;
    return n !== t.memoizedState && (we.flags |= 2048, Us(
      9,
      { destroy: void 0 },
      Pg.bind(null, c, n),
      null
    )), [l, u, e];
  }
  function Pg(e, t) {
    e.action = t;
  }
  function hf(e) {
    var t = it(), n = Fe;
    if (n !== null)
      return df(t, n, e);
    it(), t = t.memoizedState, n = it();
    var l = n.queue.dispatch;
    return n.memoizedState = e, [t, l, !1];
  }
  function Us(e, t, n, l) {
    return e = { tag: e, create: n, deps: l, inst: t, next: null }, t = we.updateQueue, t === null && (t = Yi(), we.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (l = n.next, n.next = e, e.next = l, t.lastEffect = e), e;
  }
  function ff() {
    return it().memoizedState;
  }
  function Zi(e, t, n, l) {
    var c = Ot();
    we.flags |= e, c.memoizedState = Us(
      1 | t,
      { destroy: void 0 },
      n,
      l === void 0 ? null : l
    );
  }
  function Ki(e, t, n, l) {
    var c = it();
    l = l === void 0 ? null : l;
    var u = c.memoizedState.inst;
    Fe !== null && l !== null && _o(l, Fe.memoizedState.deps) ? c.memoizedState = Us(t, u, n, l) : (we.flags |= e, c.memoizedState = Us(
      1 | t,
      u,
      n,
      l
    ));
  }
  function mf(e, t) {
    Zi(8390656, 8, e, t);
  }
  function No(e, t) {
    Ki(2048, 8, e, t);
  }
  function Wg(e) {
    we.flags |= 4;
    var t = we.updateQueue;
    if (t === null)
      t = Yi(), we.updateQueue = t, t.events = [e];
    else {
      var n = t.events;
      n === null ? t.events = [e] : n.push(e);
    }
  }
  function pf(e) {
    var t = it().memoizedState;
    return Wg({ ref: t, nextImpl: e }), function() {
      if ((He & 2) !== 0) throw Error(o(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function _f(e, t) {
    return Ki(4, 2, e, t);
  }
  function bf(e, t) {
    return Ki(4, 4, e, t);
  }
  function gf(e, t) {
    if (typeof t == "function") {
      e = e();
      var n = t(e);
      return function() {
        typeof n == "function" ? n() : t(null);
      };
    }
    if (t != null)
      return e = e(), t.current = e, function() {
        t.current = null;
      };
  }
  function vf(e, t, n) {
    n = n != null ? n.concat([e]) : null, Ki(4, 4, gf.bind(null, t, e), n);
  }
  function Co() {
  }
  function xf(e, t) {
    var n = it();
    t = t === void 0 ? null : t;
    var l = n.memoizedState;
    return t !== null && _o(t, l[1]) ? l[0] : (n.memoizedState = [e, t], e);
  }
  function yf(e, t) {
    var n = it();
    t = t === void 0 ? null : t;
    var l = n.memoizedState;
    if (t !== null && _o(t, l[1]))
      return l[0];
    if (l = e(), es) {
      vn(!0);
      try {
        e();
      } finally {
        vn(!1);
      }
    }
    return n.memoizedState = [l, t], l;
  }
  function Eo(e, t, n) {
    return n === void 0 || (Gn & 1073741824) !== 0 && (Ee & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = n, e = wm(), we.lanes |= e, ga |= e, n);
  }
  function wf(e, t, n, l) {
    return Kt(n, t) ? n : Hs.current !== null ? (e = Eo(e, n, l), Kt(e, t) || (ot = !0), e) : (Gn & 42) === 0 || (Gn & 1073741824) !== 0 && (Ee & 261930) === 0 ? (ot = !0, e.memoizedState = n) : (e = wm(), we.lanes |= e, ga |= e, t);
  }
  function jf(e, t, n, l, c) {
    var u = D.p;
    D.p = u !== 0 && 8 > u ? u : 8;
    var p = R.T, y = {};
    R.T = y, Ro(e, !1, t, n);
    try {
      var T = c(), $ = R.S;
      if ($ !== null && $(y, T), T !== null && typeof T == "object" && typeof T.then == "function") {
        var Y = Qg(
          T,
          l
        );
        Al(
          e,
          t,
          Y,
          tn(e)
        );
      } else
        Al(
          e,
          t,
          l,
          tn(e)
        );
    } catch (J) {
      Al(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: J },
        tn()
      );
    } finally {
      D.p = u, p !== null && y.types !== null && (p.types = y.types), R.T = p;
    }
  }
  function Ig() {
  }
  function Mo(e, t, n, l) {
    if (e.tag !== 5) throw Error(o(476));
    var c = Sf(e).queue;
    jf(
      e,
      c,
      t,
      q,
      n === null ? Ig : function() {
        return kf(e), n(l);
      }
    );
  }
  function Sf(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: q,
      baseState: q,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Vn,
        lastRenderedState: q
      },
      next: null
    };
    var n = {};
    return t.next = {
      memoizedState: n,
      baseState: n,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Vn,
        lastRenderedState: n
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function kf(e) {
    var t = Sf(e);
    t.next === null && (t = e.alternate.memoizedState), Al(
      e,
      t.next.queue,
      {},
      tn()
    );
  }
  function To() {
    return yt(Kl);
  }
  function Nf() {
    return it().memoizedState;
  }
  function Cf() {
    return it().memoizedState;
  }
  function ev(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var n = tn();
          e = ha(n);
          var l = fa(t, e, n);
          l !== null && (Yt(l, t, n), Cl(l, t, n)), t = { cache: so() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function tv(e, t, n) {
    var l = tn();
    n = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Ji(e) ? Mf(t, n) : (n = Qc(e, t, n, l), n !== null && (Yt(n, e, l), Tf(n, t, l)));
  }
  function Ef(e, t, n) {
    var l = tn();
    Al(e, t, n, l);
  }
  function Al(e, t, n, l) {
    var c = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (Ji(e)) Mf(t, c);
    else {
      var u = e.alternate;
      if (e.lanes === 0 && (u === null || u.lanes === 0) && (u = t.lastRenderedReducer, u !== null))
        try {
          var p = t.lastRenderedState, y = u(p, n);
          if (c.hasEagerState = !0, c.eagerState = y, Kt(y, p))
            return Ti(e, t, c, 0), qe === null && Mi(), !1;
        } catch {
        } finally {
        }
      if (n = Qc(e, t, c, l), n !== null)
        return Yt(n, e, l), Tf(n, t, l), !0;
    }
    return !1;
  }
  function Ro(e, t, n, l) {
    if (l = {
      lane: 2,
      revertLane: ou(),
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Ji(e)) {
      if (t) throw Error(o(479));
    } else
      t = Qc(
        e,
        n,
        l,
        2
      ), t !== null && Yt(t, e, 2);
  }
  function Ji(e) {
    var t = e.alternate;
    return e === we || t !== null && t === we;
  }
  function Mf(e, t) {
    Ls = Vi = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function Tf(e, t, n) {
    if ((n & 4194048) !== 0) {
      var l = t.lanes;
      l &= e.pendingLanes, n |= l, t.lanes = n, Od(e, n);
    }
  }
  var zl = {
    readContext: yt,
    use: Xi,
    useCallback: et,
    useContext: et,
    useEffect: et,
    useImperativeHandle: et,
    useLayoutEffect: et,
    useInsertionEffect: et,
    useMemo: et,
    useReducer: et,
    useRef: et,
    useState: et,
    useDebugValue: et,
    useDeferredValue: et,
    useTransition: et,
    useSyncExternalStore: et,
    useId: et,
    useHostTransitionStatus: et,
    useFormState: et,
    useActionState: et,
    useOptimistic: et,
    useMemoCache: et,
    useCacheRefresh: et
  };
  zl.useEffectEvent = et;
  var Rf = {
    readContext: yt,
    use: Xi,
    useCallback: function(e, t) {
      return Ot().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: yt,
    useEffect: mf,
    useImperativeHandle: function(e, t, n) {
      n = n != null ? n.concat([e]) : null, Zi(
        4194308,
        4,
        gf.bind(null, t, e),
        n
      );
    },
    useLayoutEffect: function(e, t) {
      return Zi(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      Zi(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var n = Ot();
      t = t === void 0 ? null : t;
      var l = e();
      if (es) {
        vn(!0);
        try {
          e();
        } finally {
          vn(!1);
        }
      }
      return n.memoizedState = [l, t], l;
    },
    useReducer: function(e, t, n) {
      var l = Ot();
      if (n !== void 0) {
        var c = n(t);
        if (es) {
          vn(!0);
          try {
            n(t);
          } finally {
            vn(!1);
          }
        }
      } else c = t;
      return l.memoizedState = l.baseState = c, e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: c
      }, l.queue = e, e = e.dispatch = tv.bind(
        null,
        we,
        e
      ), [l.memoizedState, e];
    },
    useRef: function(e) {
      var t = Ot();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = So(e);
      var t = e.queue, n = Ef.bind(null, we, t);
      return t.dispatch = n, [e.memoizedState, n];
    },
    useDebugValue: Co,
    useDeferredValue: function(e, t) {
      var n = Ot();
      return Eo(n, e, t);
    },
    useTransition: function() {
      var e = So(!1);
      return e = jf.bind(
        null,
        we,
        e.queue,
        !0,
        !1
      ), Ot().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, n) {
      var l = we, c = Ot();
      if (Te) {
        if (n === void 0)
          throw Error(o(407));
        n = n();
      } else {
        if (n = t(), qe === null)
          throw Error(o(349));
        (Ee & 127) !== 0 || Ph(l, t, n);
      }
      c.memoizedState = n;
      var u = { value: n, getSnapshot: t };
      return c.queue = u, mf(Ih.bind(null, l, u, e), [
        e
      ]), l.flags |= 2048, Us(
        9,
        { destroy: void 0 },
        Wh.bind(
          null,
          l,
          u,
          n,
          t
        ),
        null
      ), n;
    },
    useId: function() {
      var e = Ot(), t = qe.identifierPrefix;
      if (Te) {
        var n = En, l = Cn;
        n = (l & ~(1 << 32 - Ct(l) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = qi++, 0 < n && (t += "H" + n.toString(32)), t += "_";
      } else
        n = Zg++, t = "_" + t + "r_" + n.toString(32) + "_";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: To,
    useFormState: of,
    useActionState: of,
    useOptimistic: function(e) {
      var t = Ot();
      t.memoizedState = t.baseState = e;
      var n = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = n, t = Ro.bind(
        null,
        we,
        !0,
        n
      ), n.dispatch = t, [e, t];
    },
    useMemoCache: yo,
    useCacheRefresh: function() {
      return Ot().memoizedState = ev.bind(
        null,
        we
      );
    },
    useEffectEvent: function(e) {
      var t = Ot(), n = { impl: e };
      return t.memoizedState = n, function() {
        if ((He & 2) !== 0)
          throw Error(o(440));
        return n.impl.apply(void 0, arguments);
      };
    }
  }, Ao = {
    readContext: yt,
    use: Xi,
    useCallback: xf,
    useContext: yt,
    useEffect: No,
    useImperativeHandle: vf,
    useInsertionEffect: _f,
    useLayoutEffect: bf,
    useMemo: yf,
    useReducer: Qi,
    useRef: ff,
    useState: function() {
      return Qi(Vn);
    },
    useDebugValue: Co,
    useDeferredValue: function(e, t) {
      var n = it();
      return wf(
        n,
        Fe.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = Qi(Vn)[0], t = it().memoizedState;
      return [
        typeof e == "boolean" ? e : Rl(e),
        t
      ];
    },
    useSyncExternalStore: Jh,
    useId: Nf,
    useHostTransitionStatus: To,
    useFormState: uf,
    useActionState: uf,
    useOptimistic: function(e, t) {
      var n = it();
      return nf(n, Fe, e, t);
    },
    useMemoCache: yo,
    useCacheRefresh: Cf
  };
  Ao.useEffectEvent = pf;
  var Af = {
    readContext: yt,
    use: Xi,
    useCallback: xf,
    useContext: yt,
    useEffect: No,
    useImperativeHandle: vf,
    useInsertionEffect: _f,
    useLayoutEffect: bf,
    useMemo: yf,
    useReducer: jo,
    useRef: ff,
    useState: function() {
      return jo(Vn);
    },
    useDebugValue: Co,
    useDeferredValue: function(e, t) {
      var n = it();
      return Fe === null ? Eo(n, e, t) : wf(
        n,
        Fe.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = jo(Vn)[0], t = it().memoizedState;
      return [
        typeof e == "boolean" ? e : Rl(e),
        t
      ];
    },
    useSyncExternalStore: Jh,
    useId: Nf,
    useHostTransitionStatus: To,
    useFormState: hf,
    useActionState: hf,
    useOptimistic: function(e, t) {
      var n = it();
      return Fe !== null ? nf(n, Fe, e, t) : (n.baseState = e, [e, n.queue.dispatch]);
    },
    useMemoCache: yo,
    useCacheRefresh: Cf
  };
  Af.useEffectEvent = pf;
  function zo(e, t, n, l) {
    t = e.memoizedState, n = n(l, t), n = n == null ? t : g({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var Oo = {
    enqueueSetState: function(e, t, n) {
      e = e._reactInternals;
      var l = tn(), c = ha(l);
      c.payload = t, n != null && (c.callback = n), t = fa(e, c, l), t !== null && (Yt(t, e, l), Cl(t, e, l));
    },
    enqueueReplaceState: function(e, t, n) {
      e = e._reactInternals;
      var l = tn(), c = ha(l);
      c.tag = 1, c.payload = t, n != null && (c.callback = n), t = fa(e, c, l), t !== null && (Yt(t, e, l), Cl(t, e, l));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var n = tn(), l = ha(n);
      l.tag = 2, t != null && (l.callback = t), t = fa(e, l, n), t !== null && (Yt(t, e, n), Cl(t, e, n));
    }
  };
  function zf(e, t, n, l, c, u, p) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(l, u, p) : t.prototype && t.prototype.isPureReactComponent ? !vl(n, l) || !vl(c, u) : !0;
  }
  function Of(e, t, n, l) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, l), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, l), t.state !== e && Oo.enqueueReplaceState(t, t.state, null);
  }
  function ts(e, t) {
    var n = t;
    if ("ref" in t) {
      n = {};
      for (var l in t)
        l !== "ref" && (n[l] = t[l]);
    }
    if (e = e.defaultProps) {
      n === t && (n = g({}, n));
      for (var c in e)
        n[c] === void 0 && (n[c] = e[c]);
    }
    return n;
  }
  function Df(e) {
    Ei(e);
  }
  function Hf(e) {
    console.error(e);
  }
  function Lf(e) {
    Ei(e);
  }
  function Pi(e, t) {
    try {
      var n = e.onUncaughtError;
      n(t.value, { componentStack: t.stack });
    } catch (l) {
      setTimeout(function() {
        throw l;
      });
    }
  }
  function $f(e, t, n) {
    try {
      var l = e.onCaughtError;
      l(n.value, {
        componentStack: n.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (c) {
      setTimeout(function() {
        throw c;
      });
    }
  }
  function Do(e, t, n) {
    return n = ha(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
      Pi(e, t);
    }, n;
  }
  function Uf(e) {
    return e = ha(e), e.tag = 3, e;
  }
  function Bf(e, t, n, l) {
    var c = n.type.getDerivedStateFromError;
    if (typeof c == "function") {
      var u = l.value;
      e.payload = function() {
        return c(u);
      }, e.callback = function() {
        $f(t, n, l);
      };
    }
    var p = n.stateNode;
    p !== null && typeof p.componentDidCatch == "function" && (e.callback = function() {
      $f(t, n, l), typeof c != "function" && (va === null ? va = /* @__PURE__ */ new Set([this]) : va.add(this));
      var y = l.stack;
      this.componentDidCatch(l.value, {
        componentStack: y !== null ? y : ""
      });
    });
  }
  function nv(e, t, n, l, c) {
    if (n.flags |= 32768, l !== null && typeof l == "object" && typeof l.then == "function") {
      if (t = n.alternate, t !== null && Rs(
        t,
        n,
        c,
        !0
      ), n = Pt.current, n !== null) {
        switch (n.tag) {
          case 31:
          case 13:
            return mn === null ? or() : n.alternate === null && tt === 0 && (tt = 3), n.flags &= -257, n.flags |= 65536, n.lanes = c, l === $i ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([l]) : t.add(l), iu(e, l, c)), !1;
          case 22:
            return n.flags |= 65536, l === $i ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([l])
            }, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([l]) : n.add(l)), iu(e, l, c)), !1;
        }
        throw Error(o(435, n.tag));
      }
      return iu(e, l, c), or(), !1;
    }
    if (Te)
      return t = Pt.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = c, l !== Ic && (e = Error(o(422), { cause: l }), wl(un(e, n)))) : (l !== Ic && (t = Error(o(423), {
        cause: l
      }), wl(
        un(t, n)
      )), e = e.current.alternate, e.flags |= 65536, c &= -c, e.lanes |= c, l = un(l, n), c = Do(
        e.stateNode,
        l,
        c
      ), uo(e, c), tt !== 4 && (tt = 2)), !1;
    var u = Error(o(520), { cause: l });
    if (u = un(u, n), Fl === null ? Fl = [u] : Fl.push(u), tt !== 4 && (tt = 2), t === null) return !0;
    l = un(l, n), n = t;
    do {
      switch (n.tag) {
        case 3:
          return n.flags |= 65536, e = c & -c, n.lanes |= e, e = Do(n.stateNode, l, e), uo(n, e), !1;
        case 1:
          if (t = n.type, u = n.stateNode, (n.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || u !== null && typeof u.componentDidCatch == "function" && (va === null || !va.has(u))))
            return n.flags |= 65536, c &= -c, n.lanes |= c, c = Uf(c), Bf(
              c,
              e,
              n,
              l
            ), uo(n, c), !1;
      }
      n = n.return;
    } while (n !== null);
    return !1;
  }
  var Ho = Error(o(461)), ot = !1;
  function wt(e, t, n, l) {
    t.child = e === null ? Vh(t, null, n, l) : Ia(
      t,
      e.child,
      n,
      l
    );
  }
  function Ff(e, t, n, l, c) {
    n = n.render;
    var u = t.ref;
    if ("ref" in l) {
      var p = {};
      for (var y in l)
        y !== "ref" && (p[y] = l[y]);
    } else p = l;
    return Ka(t), l = bo(
      e,
      t,
      n,
      p,
      u,
      c
    ), y = go(), e !== null && !ot ? (vo(e, t, c), qn(e, t, c)) : (Te && y && Pc(t), t.flags |= 1, wt(e, t, l, c), t.child);
  }
  function Gf(e, t, n, l, c) {
    if (e === null) {
      var u = n.type;
      return typeof u == "function" && !Zc(u) && u.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = u, Vf(
        e,
        t,
        u,
        l,
        c
      )) : (e = Ai(
        n.type,
        null,
        l,
        t,
        t.mode,
        c
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (u = e.child, !qo(e, c)) {
      var p = u.memoizedProps;
      if (n = n.compare, n = n !== null ? n : vl, n(p, l) && e.ref === t.ref)
        return qn(e, t, c);
    }
    return t.flags |= 1, e = $n(u, l), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Vf(e, t, n, l, c) {
    if (e !== null) {
      var u = e.memoizedProps;
      if (vl(u, l) && e.ref === t.ref)
        if (ot = !1, t.pendingProps = l = u, qo(e, c))
          (e.flags & 131072) !== 0 && (ot = !0);
        else
          return t.lanes = e.lanes, qn(e, t, c);
    }
    return Lo(
      e,
      t,
      n,
      l,
      c
    );
  }
  function qf(e, t, n, l) {
    var c = l.children, u = e !== null ? e.memoizedState : null;
    if (e === null && t.stateNode === null && (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), l.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (u = u !== null ? u.baseLanes | n : n, e !== null) {
          for (l = t.child = e.child, c = 0; l !== null; )
            c = c | l.lanes | l.childLanes, l = l.sibling;
          l = c & ~u;
        } else l = 0, t.child = null;
        return Yf(
          e,
          t,
          u,
          n,
          l
        );
      }
      if ((n & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && Hi(
          t,
          u !== null ? u.cachePool : null
        ), u !== null ? Xh(t, u) : fo(), Qh(t);
      else
        return l = t.lanes = 536870912, Yf(
          e,
          t,
          u !== null ? u.baseLanes | n : n,
          n,
          l
        );
    } else
      u !== null ? (Hi(t, u.cachePool), Xh(t, u), pa(), t.memoizedState = null) : (e !== null && Hi(t, null), fo(), pa());
    return wt(e, t, c, n), t.child;
  }
  function Ol(e, t) {
    return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function Yf(e, t, n, l, c) {
    var u = io();
    return u = u === null ? null : { parent: rt._currentValue, pool: u }, t.memoizedState = {
      baseLanes: n,
      cachePool: u
    }, e !== null && Hi(t, null), fo(), Qh(t), e !== null && Rs(e, t, l, !0), t.childLanes = c, null;
  }
  function Wi(e, t) {
    return t = er(
      { mode: t.mode, children: t.children },
      e.mode
    ), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function Xf(e, t, n) {
    return Ia(t, e.child, null, n), e = Wi(t, t.pendingProps), e.flags |= 2, Wt(t), t.memoizedState = null, e;
  }
  function av(e, t, n) {
    var l = t.pendingProps, c = (t.flags & 128) !== 0;
    if (t.flags &= -129, e === null) {
      if (Te) {
        if (l.mode === "hidden")
          return e = Wi(t, l), t.lanes = 536870912, Ol(null, e);
        if (po(t), (e = Qe) ? (e = sp(
          e,
          fn
        ), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: ra !== null ? { id: Cn, overflow: En } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = Eh(e), n.return = t, t.child = n, xt = t, Qe = null)) : e = null, e === null) throw oa(t);
        return t.lanes = 536870912, null;
      }
      return Wi(t, l);
    }
    var u = e.memoizedState;
    if (u !== null) {
      var p = u.dehydrated;
      if (po(t), c)
        if (t.flags & 256)
          t.flags &= -257, t = Xf(
            e,
            t,
            n
          );
        else if (t.memoizedState !== null)
          t.child = e.child, t.flags |= 128, t = null;
        else throw Error(o(558));
      else if (ot || Rs(e, t, n, !1), c = (n & e.childLanes) !== 0, ot || c) {
        if (l = qe, l !== null && (p = Dd(l, n), p !== 0 && p !== u.retryLane))
          throw u.retryLane = p, Ya(e, p), Yt(l, e, p), Ho;
        or(), t = Xf(
          e,
          t,
          n
        );
      } else
        e = u.treeContext, Qe = pn(p.nextSibling), xt = t, Te = !0, ca = null, fn = !1, e !== null && Rh(t, e), t = Wi(t, l), t.flags |= 4096;
      return t;
    }
    return e = $n(e.child, {
      mode: l.mode,
      children: l.children
    }), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function Ii(e, t) {
    var n = t.ref;
    if (n === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof n != "function" && typeof n != "object")
        throw Error(o(284));
      (e === null || e.ref !== n) && (t.flags |= 4194816);
    }
  }
  function Lo(e, t, n, l, c) {
    return Ka(t), n = bo(
      e,
      t,
      n,
      l,
      void 0,
      c
    ), l = go(), e !== null && !ot ? (vo(e, t, c), qn(e, t, c)) : (Te && l && Pc(t), t.flags |= 1, wt(e, t, n, c), t.child);
  }
  function Qf(e, t, n, l, c, u) {
    return Ka(t), t.updateQueue = null, n = Kh(
      t,
      l,
      n,
      c
    ), Zh(e), l = go(), e !== null && !ot ? (vo(e, t, u), qn(e, t, u)) : (Te && l && Pc(t), t.flags |= 1, wt(e, t, n, u), t.child);
  }
  function Zf(e, t, n, l, c) {
    if (Ka(t), t.stateNode === null) {
      var u = Cs, p = n.contextType;
      typeof p == "object" && p !== null && (u = yt(p)), u = new n(l, u), t.memoizedState = u.state !== null && u.state !== void 0 ? u.state : null, u.updater = Oo, t.stateNode = u, u._reactInternals = t, u = t.stateNode, u.props = l, u.state = t.memoizedState, u.refs = {}, co(t), p = n.contextType, u.context = typeof p == "object" && p !== null ? yt(p) : Cs, u.state = t.memoizedState, p = n.getDerivedStateFromProps, typeof p == "function" && (zo(
        t,
        n,
        p,
        l
      ), u.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof u.getSnapshotBeforeUpdate == "function" || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (p = u.state, typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount(), p !== u.state && Oo.enqueueReplaceState(u, u.state, null), Ml(t, l, u, c), El(), u.state = t.memoizedState), typeof u.componentDidMount == "function" && (t.flags |= 4194308), l = !0;
    } else if (e === null) {
      u = t.stateNode;
      var y = t.memoizedProps, T = ts(n, y);
      u.props = T;
      var $ = u.context, Y = n.contextType;
      p = Cs, typeof Y == "object" && Y !== null && (p = yt(Y));
      var J = n.getDerivedStateFromProps;
      Y = typeof J == "function" || typeof u.getSnapshotBeforeUpdate == "function", y = t.pendingProps !== y, Y || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (y || $ !== p) && Of(
        t,
        u,
        l,
        p
      ), da = !1;
      var B = t.memoizedState;
      u.state = B, Ml(t, l, u, c), El(), $ = t.memoizedState, y || B !== $ || da ? (typeof J == "function" && (zo(
        t,
        n,
        J,
        l
      ), $ = t.memoizedState), (T = da || zf(
        t,
        n,
        T,
        l,
        B,
        $,
        p
      )) ? (Y || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = l, t.memoizedState = $), u.props = l, u.state = $, u.context = p, l = T) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), l = !1);
    } else {
      u = t.stateNode, oo(e, t), p = t.memoizedProps, Y = ts(n, p), u.props = Y, J = t.pendingProps, B = u.context, $ = n.contextType, T = Cs, typeof $ == "object" && $ !== null && (T = yt($)), y = n.getDerivedStateFromProps, ($ = typeof y == "function" || typeof u.getSnapshotBeforeUpdate == "function") || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (p !== J || B !== T) && Of(
        t,
        u,
        l,
        T
      ), da = !1, B = t.memoizedState, u.state = B, Ml(t, l, u, c), El();
      var V = t.memoizedState;
      p !== J || B !== V || da || e !== null && e.dependencies !== null && Oi(e.dependencies) ? (typeof y == "function" && (zo(
        t,
        n,
        y,
        l
      ), V = t.memoizedState), (Y = da || zf(
        t,
        n,
        Y,
        l,
        B,
        V,
        T
      ) || e !== null && e.dependencies !== null && Oi(e.dependencies)) ? ($ || typeof u.UNSAFE_componentWillUpdate != "function" && typeof u.componentWillUpdate != "function" || (typeof u.componentWillUpdate == "function" && u.componentWillUpdate(l, V, T), typeof u.UNSAFE_componentWillUpdate == "function" && u.UNSAFE_componentWillUpdate(
        l,
        V,
        T
      )), typeof u.componentDidUpdate == "function" && (t.flags |= 4), typeof u.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof u.componentDidUpdate != "function" || p === e.memoizedProps && B === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || p === e.memoizedProps && B === e.memoizedState || (t.flags |= 1024), t.memoizedProps = l, t.memoizedState = V), u.props = l, u.state = V, u.context = T, l = Y) : (typeof u.componentDidUpdate != "function" || p === e.memoizedProps && B === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || p === e.memoizedProps && B === e.memoizedState || (t.flags |= 1024), l = !1);
    }
    return u = l, Ii(e, t), l = (t.flags & 128) !== 0, u || l ? (u = t.stateNode, n = l && typeof n.getDerivedStateFromError != "function" ? null : u.render(), t.flags |= 1, e !== null && l ? (t.child = Ia(
      t,
      e.child,
      null,
      c
    ), t.child = Ia(
      t,
      null,
      n,
      c
    )) : wt(e, t, n, c), t.memoizedState = u.state, e = t.child) : e = qn(
      e,
      t,
      c
    ), e;
  }
  function Kf(e, t, n, l) {
    return Qa(), t.flags |= 256, wt(e, t, n, l), t.child;
  }
  var $o = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function Uo(e) {
    return { baseLanes: e, cachePool: Lh() };
  }
  function Bo(e, t, n) {
    return e = e !== null ? e.childLanes & ~n : 0, t && (e |= en), e;
  }
  function Jf(e, t, n) {
    var l = t.pendingProps, c = !1, u = (t.flags & 128) !== 0, p;
    if ((p = u) || (p = e !== null && e.memoizedState === null ? !1 : (lt.current & 2) !== 0), p && (c = !0, t.flags &= -129), p = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (Te) {
        if (c ? ma(t) : pa(), (e = Qe) ? (e = sp(
          e,
          fn
        ), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: ra !== null ? { id: Cn, overflow: En } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = Eh(e), n.return = t, t.child = n, xt = t, Qe = null)) : e = null, e === null) throw oa(t);
        return wu(e) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      var y = l.children;
      return l = l.fallback, c ? (pa(), c = t.mode, y = er(
        { mode: "hidden", children: y },
        c
      ), l = Xa(
        l,
        c,
        n,
        null
      ), y.return = t, l.return = t, y.sibling = l, t.child = y, l = t.child, l.memoizedState = Uo(n), l.childLanes = Bo(
        e,
        p,
        n
      ), t.memoizedState = $o, Ol(null, l)) : (ma(t), Fo(t, y));
    }
    var T = e.memoizedState;
    if (T !== null && (y = T.dehydrated, y !== null)) {
      if (u)
        t.flags & 256 ? (ma(t), t.flags &= -257, t = Go(
          e,
          t,
          n
        )) : t.memoizedState !== null ? (pa(), t.child = e.child, t.flags |= 128, t = null) : (pa(), y = l.fallback, c = t.mode, l = er(
          { mode: "visible", children: l.children },
          c
        ), y = Xa(
          y,
          c,
          n,
          null
        ), y.flags |= 2, l.return = t, y.return = t, l.sibling = y, t.child = l, Ia(
          t,
          e.child,
          null,
          n
        ), l = t.child, l.memoizedState = Uo(n), l.childLanes = Bo(
          e,
          p,
          n
        ), t.memoizedState = $o, t = Ol(null, l));
      else if (ma(t), wu(y)) {
        if (p = y.nextSibling && y.nextSibling.dataset, p) var $ = p.dgst;
        p = $, l = Error(o(419)), l.stack = "", l.digest = p, wl({ value: l, source: null, stack: null }), t = Go(
          e,
          t,
          n
        );
      } else if (ot || Rs(e, t, n, !1), p = (n & e.childLanes) !== 0, ot || p) {
        if (p = qe, p !== null && (l = Dd(p, n), l !== 0 && l !== T.retryLane))
          throw T.retryLane = l, Ya(e, l), Yt(p, e, l), Ho;
        yu(y) || or(), t = Go(
          e,
          t,
          n
        );
      } else
        yu(y) ? (t.flags |= 192, t.child = e.child, t = null) : (e = T.treeContext, Qe = pn(
          y.nextSibling
        ), xt = t, Te = !0, ca = null, fn = !1, e !== null && Rh(t, e), t = Fo(
          t,
          l.children
        ), t.flags |= 4096);
      return t;
    }
    return c ? (pa(), y = l.fallback, c = t.mode, T = e.child, $ = T.sibling, l = $n(T, {
      mode: "hidden",
      children: l.children
    }), l.subtreeFlags = T.subtreeFlags & 65011712, $ !== null ? y = $n(
      $,
      y
    ) : (y = Xa(
      y,
      c,
      n,
      null
    ), y.flags |= 2), y.return = t, l.return = t, l.sibling = y, t.child = l, Ol(null, l), l = t.child, y = e.child.memoizedState, y === null ? y = Uo(n) : (c = y.cachePool, c !== null ? (T = rt._currentValue, c = c.parent !== T ? { parent: T, pool: T } : c) : c = Lh(), y = {
      baseLanes: y.baseLanes | n,
      cachePool: c
    }), l.memoizedState = y, l.childLanes = Bo(
      e,
      p,
      n
    ), t.memoizedState = $o, Ol(e.child, l)) : (ma(t), n = e.child, e = n.sibling, n = $n(n, {
      mode: "visible",
      children: l.children
    }), n.return = t, n.sibling = null, e !== null && (p = t.deletions, p === null ? (t.deletions = [e], t.flags |= 16) : p.push(e)), t.child = n, t.memoizedState = null, n);
  }
  function Fo(e, t) {
    return t = er(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function er(e, t) {
    return e = Jt(22, e, null, t), e.lanes = 0, e;
  }
  function Go(e, t, n) {
    return Ia(t, e.child, null, n), e = Fo(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function Pf(e, t, n) {
    e.lanes |= t;
    var l = e.alternate;
    l !== null && (l.lanes |= t), no(e.return, t, n);
  }
  function Vo(e, t, n, l, c, u) {
    var p = e.memoizedState;
    p === null ? e.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: l,
      tail: n,
      tailMode: c,
      treeForkCount: u
    } : (p.isBackwards = t, p.rendering = null, p.renderingStartTime = 0, p.last = l, p.tail = n, p.tailMode = c, p.treeForkCount = u);
  }
  function Wf(e, t, n) {
    var l = t.pendingProps, c = l.revealOrder, u = l.tail;
    l = l.children;
    var p = lt.current, y = (p & 2) !== 0;
    if (y ? (p = p & 1 | 2, t.flags |= 128) : p &= 1, ee(lt, p), wt(e, t, l, n), l = Te ? yl : 0, !y && e !== null && (e.flags & 128) !== 0)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13)
          e.memoizedState !== null && Pf(e, n, t);
        else if (e.tag === 19)
          Pf(e, n, t);
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
    switch (c) {
      case "forwards":
        for (n = t.child, c = null; n !== null; )
          e = n.alternate, e !== null && Gi(e) === null && (c = n), n = n.sibling;
        n = c, n === null ? (c = t.child, t.child = null) : (c = n.sibling, n.sibling = null), Vo(
          t,
          !1,
          c,
          n,
          u,
          l
        );
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (n = null, c = t.child, t.child = null; c !== null; ) {
          if (e = c.alternate, e !== null && Gi(e) === null) {
            t.child = c;
            break;
          }
          e = c.sibling, c.sibling = n, n = c, c = e;
        }
        Vo(
          t,
          !0,
          n,
          null,
          u,
          l
        );
        break;
      case "together":
        Vo(
          t,
          !1,
          null,
          null,
          void 0,
          l
        );
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function qn(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), ga |= t.lanes, (n & t.childLanes) === 0)
      if (e !== null) {
        if (Rs(
          e,
          t,
          n,
          !1
        ), (n & t.childLanes) === 0)
          return null;
      } else return null;
    if (e !== null && t.child !== e.child)
      throw Error(o(153));
    if (t.child !== null) {
      for (e = t.child, n = $n(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; )
        e = e.sibling, n = n.sibling = $n(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function qo(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && Oi(e)));
  }
  function sv(e, t, n) {
    switch (t.tag) {
      case 3:
        $e(t, t.stateNode.containerInfo), ua(t, rt, e.memoizedState.cache), Qa();
        break;
      case 27:
      case 5:
        nt(t);
        break;
      case 4:
        $e(t, t.stateNode.containerInfo);
        break;
      case 10:
        ua(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 31:
        if (t.memoizedState !== null)
          return t.flags |= 128, po(t), null;
        break;
      case 13:
        var l = t.memoizedState;
        if (l !== null)
          return l.dehydrated !== null ? (ma(t), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? Jf(e, t, n) : (ma(t), e = qn(
            e,
            t,
            n
          ), e !== null ? e.sibling : null);
        ma(t);
        break;
      case 19:
        var c = (e.flags & 128) !== 0;
        if (l = (n & t.childLanes) !== 0, l || (Rs(
          e,
          t,
          n,
          !1
        ), l = (n & t.childLanes) !== 0), c) {
          if (l)
            return Wf(
              e,
              t,
              n
            );
          t.flags |= 128;
        }
        if (c = t.memoizedState, c !== null && (c.rendering = null, c.tail = null, c.lastEffect = null), ee(lt, lt.current), l) break;
        return null;
      case 22:
        return t.lanes = 0, qf(
          e,
          t,
          n,
          t.pendingProps
        );
      case 24:
        ua(t, rt, e.memoizedState.cache);
    }
    return qn(e, t, n);
  }
  function If(e, t, n) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        ot = !0;
      else {
        if (!qo(e, n) && (t.flags & 128) === 0)
          return ot = !1, sv(
            e,
            t,
            n
          );
        ot = (e.flags & 131072) !== 0;
      }
    else
      ot = !1, Te && (t.flags & 1048576) !== 0 && Th(t, yl, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          var l = t.pendingProps;
          if (e = Pa(t.elementType), t.type = e, typeof e == "function")
            Zc(e) ? (l = ts(e, l), t.tag = 1, t = Zf(
              null,
              t,
              e,
              l,
              n
            )) : (t.tag = 0, t = Lo(
              null,
              t,
              e,
              l,
              n
            ));
          else {
            if (e != null) {
              var c = e.$$typeof;
              if (c === Q) {
                t.tag = 11, t = Ff(
                  null,
                  t,
                  e,
                  l,
                  n
                );
                break e;
              } else if (c === Z) {
                t.tag = 14, t = Gf(
                  null,
                  t,
                  e,
                  l,
                  n
                );
                break e;
              }
            }
            throw t = oe(e) || e, Error(o(306, t, ""));
          }
        }
        return t;
      case 0:
        return Lo(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 1:
        return l = t.type, c = ts(
          l,
          t.pendingProps
        ), Zf(
          e,
          t,
          l,
          c,
          n
        );
      case 3:
        e: {
          if ($e(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(o(387));
          l = t.pendingProps;
          var u = t.memoizedState;
          c = u.element, oo(e, t), Ml(t, l, null, n);
          var p = t.memoizedState;
          if (l = p.cache, ua(t, rt, l), l !== u.cache && ao(
            t,
            [rt],
            n,
            !0
          ), El(), l = p.element, u.isDehydrated)
            if (u = {
              element: l,
              isDehydrated: !1,
              cache: p.cache
            }, t.updateQueue.baseState = u, t.memoizedState = u, t.flags & 256) {
              t = Kf(
                e,
                t,
                l,
                n
              );
              break e;
            } else if (l !== c) {
              c = un(
                Error(o(424)),
                t
              ), wl(c), t = Kf(
                e,
                t,
                l,
                n
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
              for (Qe = pn(e.firstChild), xt = t, Te = !0, ca = null, fn = !0, n = Vh(
                t,
                null,
                l,
                n
              ), t.child = n; n; )
                n.flags = n.flags & -3 | 4096, n = n.sibling;
            }
          else {
            if (Qa(), l === c) {
              t = qn(
                e,
                t,
                n
              );
              break e;
            }
            wt(e, t, l, n);
          }
          t = t.child;
        }
        return t;
      case 26:
        return Ii(e, t), e === null ? (n = up(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = n : Te || (n = t.type, e = t.pendingProps, l = _r(
          fe.current
        ).createElement(n), l[vt] = t, l[Ut] = e, jt(l, n, e), bt(l), t.stateNode = l) : t.memoizedState = up(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return nt(t), e === null && Te && (l = t.stateNode = rp(
          t.type,
          t.pendingProps,
          fe.current
        ), xt = t, fn = !0, c = Qe, ja(t.type) ? (ju = c, Qe = pn(l.firstChild)) : Qe = c), wt(
          e,
          t,
          t.pendingProps.children,
          n
        ), Ii(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && Te && ((c = l = Qe) && (l = Ov(
          l,
          t.type,
          t.pendingProps,
          fn
        ), l !== null ? (t.stateNode = l, xt = t, Qe = pn(l.firstChild), fn = !1, c = !0) : c = !1), c || oa(t)), nt(t), c = t.type, u = t.pendingProps, p = e !== null ? e.memoizedProps : null, l = u.children, gu(c, u) ? l = null : p !== null && gu(c, p) && (t.flags |= 32), t.memoizedState !== null && (c = bo(
          e,
          t,
          Kg,
          null,
          null,
          n
        ), Kl._currentValue = c), Ii(e, t), wt(e, t, l, n), t.child;
      case 6:
        return e === null && Te && ((e = n = Qe) && (n = Dv(
          n,
          t.pendingProps,
          fn
        ), n !== null ? (t.stateNode = n, xt = t, Qe = null, e = !0) : e = !1), e || oa(t)), null;
      case 13:
        return Jf(e, t, n);
      case 4:
        return $e(
          t,
          t.stateNode.containerInfo
        ), l = t.pendingProps, e === null ? t.child = Ia(
          t,
          null,
          l,
          n
        ) : wt(e, t, l, n), t.child;
      case 11:
        return Ff(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 7:
        return wt(
          e,
          t,
          t.pendingProps,
          n
        ), t.child;
      case 8:
        return wt(
          e,
          t,
          t.pendingProps.children,
          n
        ), t.child;
      case 12:
        return wt(
          e,
          t,
          t.pendingProps.children,
          n
        ), t.child;
      case 10:
        return l = t.pendingProps, ua(t, t.type, l.value), wt(e, t, l.children, n), t.child;
      case 9:
        return c = t.type._context, l = t.pendingProps.children, Ka(t), c = yt(c), l = l(c), t.flags |= 1, wt(e, t, l, n), t.child;
      case 14:
        return Gf(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 15:
        return Vf(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 19:
        return Wf(e, t, n);
      case 31:
        return av(e, t, n);
      case 22:
        return qf(
          e,
          t,
          n,
          t.pendingProps
        );
      case 24:
        return Ka(t), l = yt(rt), e === null ? (c = io(), c === null && (c = qe, u = so(), c.pooledCache = u, u.refCount++, u !== null && (c.pooledCacheLanes |= n), c = u), t.memoizedState = { parent: l, cache: c }, co(t), ua(t, rt, c)) : ((e.lanes & n) !== 0 && (oo(e, t), Ml(t, null, null, n), El()), c = e.memoizedState, u = t.memoizedState, c.parent !== l ? (c = { parent: l, cache: l }, t.memoizedState = c, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = c), ua(t, rt, l)) : (l = u.cache, ua(t, rt, l), l !== c.cache && ao(
          t,
          [rt],
          n,
          !0
        ))), wt(
          e,
          t,
          t.pendingProps.children,
          n
        ), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(o(156, t.tag));
  }
  function Yn(e) {
    e.flags |= 4;
  }
  function Yo(e, t, n, l, c) {
    if ((t = (e.mode & 32) !== 0) && (t = !1), t) {
      if (e.flags |= 16777216, (c & 335544128) === c)
        if (e.stateNode.complete) e.flags |= 8192;
        else if (Nm()) e.flags |= 8192;
        else
          throw Wa = $i, ro;
    } else e.flags &= -16777217;
  }
  function em(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !pp(t))
      if (Nm()) e.flags |= 8192;
      else
        throw Wa = $i, ro;
  }
  function tr(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? Ad() : 536870912, e.lanes |= t, Vs |= t);
  }
  function Dl(e, t) {
    if (!Te)
      switch (e.tailMode) {
        case "hidden":
          t = e.tail;
          for (var n = null; t !== null; )
            t.alternate !== null && (n = t), t = t.sibling;
          n === null ? e.tail = null : n.sibling = null;
          break;
        case "collapsed":
          n = e.tail;
          for (var l = null; n !== null; )
            n.alternate !== null && (l = n), n = n.sibling;
          l === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : l.sibling = null;
      }
  }
  function Ze(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, l = 0;
    if (t)
      for (var c = e.child; c !== null; )
        n |= c.lanes | c.childLanes, l |= c.subtreeFlags & 65011712, l |= c.flags & 65011712, c.return = e, c = c.sibling;
    else
      for (c = e.child; c !== null; )
        n |= c.lanes | c.childLanes, l |= c.subtreeFlags, l |= c.flags, c.return = e, c = c.sibling;
    return e.subtreeFlags |= l, e.childLanes = n, t;
  }
  function lv(e, t, n) {
    var l = t.pendingProps;
    switch (Wc(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Ze(t), null;
      case 1:
        return Ze(t), null;
      case 3:
        return n = t.stateNode, l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), Fn(rt), ye(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (Ts(t) ? Yn(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, eo())), Ze(t), null;
      case 26:
        var c = t.type, u = t.memoizedState;
        return e === null ? (Yn(t), u !== null ? (Ze(t), em(t, u)) : (Ze(t), Yo(
          t,
          c,
          null,
          l,
          n
        ))) : u ? u !== e.memoizedState ? (Yn(t), Ze(t), em(t, u)) : (Ze(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== l && Yn(t), Ze(t), Yo(
          t,
          c,
          e,
          l,
          n
        )), null;
      case 27:
        if (mt(t), n = fe.current, c = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== l && Yn(t);
        else {
          if (!l) {
            if (t.stateNode === null)
              throw Error(o(166));
            return Ze(t), null;
          }
          e = ne.current, Ts(t) ? Ah(t) : (e = rp(c, l, n), t.stateNode = e, Yn(t));
        }
        return Ze(t), null;
      case 5:
        if (mt(t), c = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== l && Yn(t);
        else {
          if (!l) {
            if (t.stateNode === null)
              throw Error(o(166));
            return Ze(t), null;
          }
          if (u = ne.current, Ts(t))
            Ah(t);
          else {
            var p = _r(
              fe.current
            );
            switch (u) {
              case 1:
                u = p.createElementNS(
                  "http://www.w3.org/2000/svg",
                  c
                );
                break;
              case 2:
                u = p.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  c
                );
                break;
              default:
                switch (c) {
                  case "svg":
                    u = p.createElementNS(
                      "http://www.w3.org/2000/svg",
                      c
                    );
                    break;
                  case "math":
                    u = p.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      c
                    );
                    break;
                  case "script":
                    u = p.createElement("div"), u.innerHTML = "<script><\/script>", u = u.removeChild(
                      u.firstChild
                    );
                    break;
                  case "select":
                    u = typeof l.is == "string" ? p.createElement("select", {
                      is: l.is
                    }) : p.createElement("select"), l.multiple ? u.multiple = !0 : l.size && (u.size = l.size);
                    break;
                  default:
                    u = typeof l.is == "string" ? p.createElement(c, { is: l.is }) : p.createElement(c);
                }
            }
            u[vt] = t, u[Ut] = l;
            e: for (p = t.child; p !== null; ) {
              if (p.tag === 5 || p.tag === 6)
                u.appendChild(p.stateNode);
              else if (p.tag !== 4 && p.tag !== 27 && p.child !== null) {
                p.child.return = p, p = p.child;
                continue;
              }
              if (p === t) break e;
              for (; p.sibling === null; ) {
                if (p.return === null || p.return === t)
                  break e;
                p = p.return;
              }
              p.sibling.return = p.return, p = p.sibling;
            }
            t.stateNode = u;
            e: switch (jt(u, c, l), c) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                l = !!l.autoFocus;
                break e;
              case "img":
                l = !0;
                break e;
              default:
                l = !1;
            }
            l && Yn(t);
          }
        }
        return Ze(t), Yo(
          t,
          t.type,
          e === null ? null : e.memoizedProps,
          t.pendingProps,
          n
        ), null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== l && Yn(t);
        else {
          if (typeof l != "string" && t.stateNode === null)
            throw Error(o(166));
          if (e = fe.current, Ts(t)) {
            if (e = t.stateNode, n = t.memoizedProps, l = null, c = xt, c !== null)
              switch (c.tag) {
                case 27:
                case 5:
                  l = c.memoizedProps;
              }
            e[vt] = t, e = !!(e.nodeValue === n || l !== null && l.suppressHydrationWarning === !0 || Jm(e.nodeValue, n)), e || oa(t, !0);
          } else
            e = _r(e).createTextNode(
              l
            ), e[vt] = t, t.stateNode = e;
        }
        return Ze(t), null;
      case 31:
        if (n = t.memoizedState, e === null || e.memoizedState !== null) {
          if (l = Ts(t), n !== null) {
            if (e === null) {
              if (!l) throw Error(o(318));
              if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(557));
              e[vt] = t;
            } else
              Qa(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Ze(t), e = !1;
          } else
            n = eo(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
          if (!e)
            return t.flags & 256 ? (Wt(t), t) : (Wt(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(o(558));
        }
        return Ze(t), null;
      case 13:
        if (l = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (c = Ts(t), l !== null && l.dehydrated !== null) {
            if (e === null) {
              if (!c) throw Error(o(318));
              if (c = t.memoizedState, c = c !== null ? c.dehydrated : null, !c) throw Error(o(317));
              c[vt] = t;
            } else
              Qa(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Ze(t), c = !1;
          } else
            c = eo(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = c), c = !0;
          if (!c)
            return t.flags & 256 ? (Wt(t), t) : (Wt(t), null);
        }
        return Wt(t), (t.flags & 128) !== 0 ? (t.lanes = n, t) : (n = l !== null, e = e !== null && e.memoizedState !== null, n && (l = t.child, c = null, l.alternate !== null && l.alternate.memoizedState !== null && l.alternate.memoizedState.cachePool !== null && (c = l.alternate.memoizedState.cachePool.pool), u = null, l.memoizedState !== null && l.memoizedState.cachePool !== null && (u = l.memoizedState.cachePool.pool), u !== c && (l.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), tr(t, t.updateQueue), Ze(t), null);
      case 4:
        return ye(), e === null && fu(t.stateNode.containerInfo), Ze(t), null;
      case 10:
        return Fn(t.type), Ze(t), null;
      case 19:
        if (G(lt), l = t.memoizedState, l === null) return Ze(t), null;
        if (c = (t.flags & 128) !== 0, u = l.rendering, u === null)
          if (c) Dl(l, !1);
          else {
            if (tt !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (u = Gi(e), u !== null) {
                  for (t.flags |= 128, Dl(l, !1), e = u.updateQueue, t.updateQueue = e, tr(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null; )
                    Ch(n, e), n = n.sibling;
                  return ee(
                    lt,
                    lt.current & 1 | 2
                  ), Te && Un(t, l.treeForkCount), t.child;
                }
                e = e.sibling;
              }
            l.tail !== null && st() > ir && (t.flags |= 128, c = !0, Dl(l, !1), t.lanes = 4194304);
          }
        else {
          if (!c)
            if (e = Gi(u), e !== null) {
              if (t.flags |= 128, c = !0, e = e.updateQueue, t.updateQueue = e, tr(t, e), Dl(l, !0), l.tail === null && l.tailMode === "hidden" && !u.alternate && !Te)
                return Ze(t), null;
            } else
              2 * st() - l.renderingStartTime > ir && n !== 536870912 && (t.flags |= 128, c = !0, Dl(l, !1), t.lanes = 4194304);
          l.isBackwards ? (u.sibling = t.child, t.child = u) : (e = l.last, e !== null ? e.sibling = u : t.child = u, l.last = u);
        }
        return l.tail !== null ? (e = l.tail, l.rendering = e, l.tail = e.sibling, l.renderingStartTime = st(), e.sibling = null, n = lt.current, ee(
          lt,
          c ? n & 1 | 2 : n & 1
        ), Te && Un(t, l.treeForkCount), e) : (Ze(t), null);
      case 22:
      case 23:
        return Wt(t), mo(), l = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== l && (t.flags |= 8192) : l && (t.flags |= 8192), l ? (n & 536870912) !== 0 && (t.flags & 128) === 0 && (Ze(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Ze(t), n = t.updateQueue, n !== null && tr(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), l = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), l !== n && (t.flags |= 2048), e !== null && G(Ja), null;
      case 24:
        return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), Fn(rt), Ze(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(o(156, t.tag));
  }
  function iv(e, t) {
    switch (Wc(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Fn(rt), ye(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return mt(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (Wt(t), t.alternate === null)
            throw Error(o(340));
          Qa();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 13:
        if (Wt(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(o(340));
          Qa();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return G(lt), null;
      case 4:
        return ye(), null;
      case 10:
        return Fn(t.type), null;
      case 22:
      case 23:
        return Wt(t), mo(), e !== null && G(Ja), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return Fn(rt), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function tm(e, t) {
    switch (Wc(t), t.tag) {
      case 3:
        Fn(rt), ye();
        break;
      case 26:
      case 27:
      case 5:
        mt(t);
        break;
      case 4:
        ye();
        break;
      case 31:
        t.memoizedState !== null && Wt(t);
        break;
      case 13:
        Wt(t);
        break;
      case 19:
        G(lt);
        break;
      case 10:
        Fn(t.type);
        break;
      case 22:
      case 23:
        Wt(t), mo(), e !== null && G(Ja);
        break;
      case 24:
        Fn(rt);
    }
  }
  function Hl(e, t) {
    try {
      var n = t.updateQueue, l = n !== null ? n.lastEffect : null;
      if (l !== null) {
        var c = l.next;
        n = c;
        do {
          if ((n.tag & e) === e) {
            l = void 0;
            var u = n.create, p = n.inst;
            l = u(), p.destroy = l;
          }
          n = n.next;
        } while (n !== c);
      }
    } catch (y) {
      Be(t, t.return, y);
    }
  }
  function _a(e, t, n) {
    try {
      var l = t.updateQueue, c = l !== null ? l.lastEffect : null;
      if (c !== null) {
        var u = c.next;
        l = u;
        do {
          if ((l.tag & e) === e) {
            var p = l.inst, y = p.destroy;
            if (y !== void 0) {
              p.destroy = void 0, c = t;
              var T = n, $ = y;
              try {
                $();
              } catch (Y) {
                Be(
                  c,
                  T,
                  Y
                );
              }
            }
          }
          l = l.next;
        } while (l !== u);
      }
    } catch (Y) {
      Be(t, t.return, Y);
    }
  }
  function nm(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var n = e.stateNode;
      try {
        Yh(t, n);
      } catch (l) {
        Be(e, e.return, l);
      }
    }
  }
  function am(e, t, n) {
    n.props = ts(
      e.type,
      e.memoizedProps
    ), n.state = e.memoizedState;
    try {
      n.componentWillUnmount();
    } catch (l) {
      Be(e, t, l);
    }
  }
  function Ll(e, t) {
    try {
      var n = e.ref;
      if (n !== null) {
        switch (e.tag) {
          case 26:
          case 27:
          case 5:
            var l = e.stateNode;
            break;
          case 30:
            l = e.stateNode;
            break;
          default:
            l = e.stateNode;
        }
        typeof n == "function" ? e.refCleanup = n(l) : n.current = l;
      }
    } catch (c) {
      Be(e, t, c);
    }
  }
  function Mn(e, t) {
    var n = e.ref, l = e.refCleanup;
    if (n !== null)
      if (typeof l == "function")
        try {
          l();
        } catch (c) {
          Be(e, t, c);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof n == "function")
        try {
          n(null);
        } catch (c) {
          Be(e, t, c);
        }
      else n.current = null;
  }
  function sm(e) {
    var t = e.type, n = e.memoizedProps, l = e.stateNode;
    try {
      e: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          n.autoFocus && l.focus();
          break e;
        case "img":
          n.src ? l.src = n.src : n.srcSet && (l.srcset = n.srcSet);
      }
    } catch (c) {
      Be(e, e.return, c);
    }
  }
  function Xo(e, t, n) {
    try {
      var l = e.stateNode;
      Ev(l, e.type, n, t), l[Ut] = t;
    } catch (c) {
      Be(e, e.return, c);
    }
  }
  function lm(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && ja(e.type) || e.tag === 4;
  }
  function Qo(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || lm(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && ja(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Zo(e, t, n) {
    var l = e.tag;
    if (l === 5 || l === 6)
      e = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(e, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(e), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = Hn));
    else if (l !== 4 && (l === 27 && ja(e.type) && (n = e.stateNode, t = null), e = e.child, e !== null))
      for (Zo(e, t, n), e = e.sibling; e !== null; )
        Zo(e, t, n), e = e.sibling;
  }
  function nr(e, t, n) {
    var l = e.tag;
    if (l === 5 || l === 6)
      e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (l !== 4 && (l === 27 && ja(e.type) && (n = e.stateNode), e = e.child, e !== null))
      for (nr(e, t, n), e = e.sibling; e !== null; )
        nr(e, t, n), e = e.sibling;
  }
  function im(e) {
    var t = e.stateNode, n = e.memoizedProps;
    try {
      for (var l = e.type, c = t.attributes; c.length; )
        t.removeAttributeNode(c[0]);
      jt(t, l, n), t[vt] = e, t[Ut] = n;
    } catch (u) {
      Be(e, e.return, u);
    }
  }
  var Xn = !1, ut = !1, Ko = !1, rm = typeof WeakSet == "function" ? WeakSet : Set, gt = null;
  function rv(e, t) {
    if (e = e.containerInfo, _u = jr, e = gh(e), Fc(e)) {
      if ("selectionStart" in e)
        var n = {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      else
        e: {
          n = (n = e.ownerDocument) && n.defaultView || window;
          var l = n.getSelection && n.getSelection();
          if (l && l.rangeCount !== 0) {
            n = l.anchorNode;
            var c = l.anchorOffset, u = l.focusNode;
            l = l.focusOffset;
            try {
              n.nodeType, u.nodeType;
            } catch {
              n = null;
              break e;
            }
            var p = 0, y = -1, T = -1, $ = 0, Y = 0, J = e, B = null;
            t: for (; ; ) {
              for (var V; J !== n || c !== 0 && J.nodeType !== 3 || (y = p + c), J !== u || l !== 0 && J.nodeType !== 3 || (T = p + l), J.nodeType === 3 && (p += J.nodeValue.length), (V = J.firstChild) !== null; )
                B = J, J = V;
              for (; ; ) {
                if (J === e) break t;
                if (B === n && ++$ === c && (y = p), B === u && ++Y === l && (T = p), (V = J.nextSibling) !== null) break;
                J = B, B = J.parentNode;
              }
              J = V;
            }
            n = y === -1 || T === -1 ? null : { start: y, end: T };
          } else n = null;
        }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (bu = { focusedElem: e, selectionRange: n }, jr = !1, gt = t; gt !== null; )
      if (t = gt, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null)
        e.return = t, gt = e;
      else
        for (; gt !== null; ) {
          switch (t = gt, u = t.alternate, e = t.flags, t.tag) {
            case 0:
              if ((e & 4) !== 0 && (e = t.updateQueue, e = e !== null ? e.events : null, e !== null))
                for (n = 0; n < e.length; n++)
                  c = e[n], c.ref.impl = c.nextImpl;
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && u !== null) {
                e = void 0, n = t, c = u.memoizedProps, u = u.memoizedState, l = n.stateNode;
                try {
                  var ue = ts(
                    n.type,
                    c
                  );
                  e = l.getSnapshotBeforeUpdate(
                    ue,
                    u
                  ), l.__reactInternalSnapshotBeforeUpdate = e;
                } catch (be) {
                  Be(
                    n,
                    n.return,
                    be
                  );
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (e = t.stateNode.containerInfo, n = e.nodeType, n === 9)
                  xu(e);
                else if (n === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      xu(e);
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
              if ((e & 1024) !== 0) throw Error(o(163));
          }
          if (e = t.sibling, e !== null) {
            e.return = t.return, gt = e;
            break;
          }
          gt = t.return;
        }
  }
  function cm(e, t, n) {
    var l = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        Zn(e, n), l & 4 && Hl(5, n);
        break;
      case 1:
        if (Zn(e, n), l & 4)
          if (e = n.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (p) {
              Be(n, n.return, p);
            }
          else {
            var c = ts(
              n.type,
              t.memoizedProps
            );
            t = t.memoizedState;
            try {
              e.componentDidUpdate(
                c,
                t,
                e.__reactInternalSnapshotBeforeUpdate
              );
            } catch (p) {
              Be(
                n,
                n.return,
                p
              );
            }
          }
        l & 64 && nm(n), l & 512 && Ll(n, n.return);
        break;
      case 3:
        if (Zn(e, n), l & 64 && (e = n.updateQueue, e !== null)) {
          if (t = null, n.child !== null)
            switch (n.child.tag) {
              case 27:
              case 5:
                t = n.child.stateNode;
                break;
              case 1:
                t = n.child.stateNode;
            }
          try {
            Yh(e, t);
          } catch (p) {
            Be(n, n.return, p);
          }
        }
        break;
      case 27:
        t === null && l & 4 && im(n);
      case 26:
      case 5:
        Zn(e, n), t === null && l & 4 && sm(n), l & 512 && Ll(n, n.return);
        break;
      case 12:
        Zn(e, n);
        break;
      case 31:
        Zn(e, n), l & 4 && dm(e, n);
        break;
      case 13:
        Zn(e, n), l & 4 && hm(e, n), l & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = _v.bind(
          null,
          n
        ), Hv(e, n))));
        break;
      case 22:
        if (l = n.memoizedState !== null || Xn, !l) {
          t = t !== null && t.memoizedState !== null || ut, c = Xn;
          var u = ut;
          Xn = l, (ut = t) && !u ? Kn(
            e,
            n,
            (n.subtreeFlags & 8772) !== 0
          ) : Zn(e, n), Xn = c, ut = u;
        }
        break;
      case 30:
        break;
      default:
        Zn(e, n);
    }
  }
  function om(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, om(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && Sc(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var Ke = null, Ft = !1;
  function Qn(e, t, n) {
    for (n = n.child; n !== null; )
      um(e, t, n), n = n.sibling;
  }
  function um(e, t, n) {
    if (zt && typeof zt.onCommitFiberUnmount == "function")
      try {
        zt.onCommitFiberUnmount(Ua, n);
      } catch {
      }
    switch (n.tag) {
      case 26:
        ut || Mn(n, t), Qn(
          e,
          t,
          n
        ), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (n = n.stateNode, n.parentNode.removeChild(n));
        break;
      case 27:
        ut || Mn(n, t);
        var l = Ke, c = Ft;
        ja(n.type) && (Ke = n.stateNode, Ft = !1), Qn(
          e,
          t,
          n
        ), Xl(n.stateNode), Ke = l, Ft = c;
        break;
      case 5:
        ut || Mn(n, t);
      case 6:
        if (l = Ke, c = Ft, Ke = null, Qn(
          e,
          t,
          n
        ), Ke = l, Ft = c, Ke !== null)
          if (Ft)
            try {
              (Ke.nodeType === 9 ? Ke.body : Ke.nodeName === "HTML" ? Ke.ownerDocument.body : Ke).removeChild(n.stateNode);
            } catch (u) {
              Be(
                n,
                t,
                u
              );
            }
          else
            try {
              Ke.removeChild(n.stateNode);
            } catch (u) {
              Be(
                n,
                t,
                u
              );
            }
        break;
      case 18:
        Ke !== null && (Ft ? (e = Ke, np(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          n.stateNode
        ), Ps(e)) : np(Ke, n.stateNode));
        break;
      case 4:
        l = Ke, c = Ft, Ke = n.stateNode.containerInfo, Ft = !0, Qn(
          e,
          t,
          n
        ), Ke = l, Ft = c;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        _a(2, n, t), ut || _a(4, n, t), Qn(
          e,
          t,
          n
        );
        break;
      case 1:
        ut || (Mn(n, t), l = n.stateNode, typeof l.componentWillUnmount == "function" && am(
          n,
          t,
          l
        )), Qn(
          e,
          t,
          n
        );
        break;
      case 21:
        Qn(
          e,
          t,
          n
        );
        break;
      case 22:
        ut = (l = ut) || n.memoizedState !== null, Qn(
          e,
          t,
          n
        ), ut = l;
        break;
      default:
        Qn(
          e,
          t,
          n
        );
    }
  }
  function dm(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
      e = e.dehydrated;
      try {
        Ps(e);
      } catch (n) {
        Be(t, t.return, n);
      }
    }
  }
  function hm(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        Ps(e);
      } catch (n) {
        Be(t, t.return, n);
      }
  }
  function cv(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new rm()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new rm()), t;
      default:
        throw Error(o(435, e.tag));
    }
  }
  function ar(e, t) {
    var n = cv(e);
    t.forEach(function(l) {
      if (!n.has(l)) {
        n.add(l);
        var c = bv.bind(null, e, l);
        l.then(c, c);
      }
    });
  }
  function Gt(e, t) {
    var n = t.deletions;
    if (n !== null)
      for (var l = 0; l < n.length; l++) {
        var c = n[l], u = e, p = t, y = p;
        e: for (; y !== null; ) {
          switch (y.tag) {
            case 27:
              if (ja(y.type)) {
                Ke = y.stateNode, Ft = !1;
                break e;
              }
              break;
            case 5:
              Ke = y.stateNode, Ft = !1;
              break e;
            case 3:
            case 4:
              Ke = y.stateNode.containerInfo, Ft = !0;
              break e;
          }
          y = y.return;
        }
        if (Ke === null) throw Error(o(160));
        um(u, p, c), Ke = null, Ft = !1, u = c.alternate, u !== null && (u.return = null), c.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        fm(t, e), t = t.sibling;
  }
  var yn = null;
  function fm(e, t) {
    var n = e.alternate, l = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        Gt(t, e), Vt(e), l & 4 && (_a(3, e, e.return), Hl(3, e), _a(5, e, e.return));
        break;
      case 1:
        Gt(t, e), Vt(e), l & 512 && (ut || n === null || Mn(n, n.return)), l & 64 && Xn && (e = e.updateQueue, e !== null && (l = e.callbacks, l !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? l : n.concat(l))));
        break;
      case 26:
        var c = yn;
        if (Gt(t, e), Vt(e), l & 512 && (ut || n === null || Mn(n, n.return)), l & 4) {
          var u = n !== null ? n.memoizedState : null;
          if (l = e.memoizedState, n === null)
            if (l === null)
              if (e.stateNode === null) {
                e: {
                  l = e.type, n = e.memoizedProps, c = c.ownerDocument || c;
                  t: switch (l) {
                    case "title":
                      u = c.getElementsByTagName("title")[0], (!u || u[ul] || u[vt] || u.namespaceURI === "http://www.w3.org/2000/svg" || u.hasAttribute("itemprop")) && (u = c.createElement(l), c.head.insertBefore(
                        u,
                        c.querySelector("head > title")
                      )), jt(u, l, n), u[vt] = e, bt(u), l = u;
                      break e;
                    case "link":
                      var p = fp(
                        "link",
                        "href",
                        c
                      ).get(l + (n.href || ""));
                      if (p) {
                        for (var y = 0; y < p.length; y++)
                          if (u = p[y], u.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && u.getAttribute("rel") === (n.rel == null ? null : n.rel) && u.getAttribute("title") === (n.title == null ? null : n.title) && u.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
                            p.splice(y, 1);
                            break t;
                          }
                      }
                      u = c.createElement(l), jt(u, l, n), c.head.appendChild(u);
                      break;
                    case "meta":
                      if (p = fp(
                        "meta",
                        "content",
                        c
                      ).get(l + (n.content || ""))) {
                        for (y = 0; y < p.length; y++)
                          if (u = p[y], u.getAttribute("content") === (n.content == null ? null : "" + n.content) && u.getAttribute("name") === (n.name == null ? null : n.name) && u.getAttribute("property") === (n.property == null ? null : n.property) && u.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && u.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
                            p.splice(y, 1);
                            break t;
                          }
                      }
                      u = c.createElement(l), jt(u, l, n), c.head.appendChild(u);
                      break;
                    default:
                      throw Error(o(468, l));
                  }
                  u[vt] = e, bt(u), l = u;
                }
                e.stateNode = l;
              } else
                mp(
                  c,
                  e.type,
                  e.stateNode
                );
            else
              e.stateNode = hp(
                c,
                l,
                e.memoizedProps
              );
          else
            u !== l ? (u === null ? n.stateNode !== null && (n = n.stateNode, n.parentNode.removeChild(n)) : u.count--, l === null ? mp(
              c,
              e.type,
              e.stateNode
            ) : hp(
              c,
              l,
              e.memoizedProps
            )) : l === null && e.stateNode !== null && Xo(
              e,
              e.memoizedProps,
              n.memoizedProps
            );
        }
        break;
      case 27:
        Gt(t, e), Vt(e), l & 512 && (ut || n === null || Mn(n, n.return)), n !== null && l & 4 && Xo(
          e,
          e.memoizedProps,
          n.memoizedProps
        );
        break;
      case 5:
        if (Gt(t, e), Vt(e), l & 512 && (ut || n === null || Mn(n, n.return)), e.flags & 32) {
          c = e.stateNode;
          try {
            xs(c, "");
          } catch (ue) {
            Be(e, e.return, ue);
          }
        }
        l & 4 && e.stateNode != null && (c = e.memoizedProps, Xo(
          e,
          c,
          n !== null ? n.memoizedProps : c
        )), l & 1024 && (Ko = !0);
        break;
      case 6:
        if (Gt(t, e), Vt(e), l & 4) {
          if (e.stateNode === null)
            throw Error(o(162));
          l = e.memoizedProps, n = e.stateNode;
          try {
            n.nodeValue = l;
          } catch (ue) {
            Be(e, e.return, ue);
          }
        }
        break;
      case 3:
        if (vr = null, c = yn, yn = br(t.containerInfo), Gt(t, e), yn = c, Vt(e), l & 4 && n !== null && n.memoizedState.isDehydrated)
          try {
            Ps(t.containerInfo);
          } catch (ue) {
            Be(e, e.return, ue);
          }
        Ko && (Ko = !1, mm(e));
        break;
      case 4:
        l = yn, yn = br(
          e.stateNode.containerInfo
        ), Gt(t, e), Vt(e), yn = l;
        break;
      case 12:
        Gt(t, e), Vt(e);
        break;
      case 31:
        Gt(t, e), Vt(e), l & 4 && (l = e.updateQueue, l !== null && (e.updateQueue = null, ar(e, l)));
        break;
      case 13:
        Gt(t, e), Vt(e), e.child.flags & 8192 && e.memoizedState !== null != (n !== null && n.memoizedState !== null) && (lr = st()), l & 4 && (l = e.updateQueue, l !== null && (e.updateQueue = null, ar(e, l)));
        break;
      case 22:
        c = e.memoizedState !== null;
        var T = n !== null && n.memoizedState !== null, $ = Xn, Y = ut;
        if (Xn = $ || c, ut = Y || T, Gt(t, e), ut = Y, Xn = $, Vt(e), l & 8192)
          e: for (t = e.stateNode, t._visibility = c ? t._visibility & -2 : t._visibility | 1, c && (n === null || T || Xn || ut || ns(e)), n = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (n === null) {
                T = n = t;
                try {
                  if (u = T.stateNode, c)
                    p = u.style, typeof p.setProperty == "function" ? p.setProperty("display", "none", "important") : p.display = "none";
                  else {
                    y = T.stateNode;
                    var J = T.memoizedProps.style, B = J != null && J.hasOwnProperty("display") ? J.display : null;
                    y.style.display = B == null || typeof B == "boolean" ? "" : ("" + B).trim();
                  }
                } catch (ue) {
                  Be(T, T.return, ue);
                }
              }
            } else if (t.tag === 6) {
              if (n === null) {
                T = t;
                try {
                  T.stateNode.nodeValue = c ? "" : T.memoizedProps;
                } catch (ue) {
                  Be(T, T.return, ue);
                }
              }
            } else if (t.tag === 18) {
              if (n === null) {
                T = t;
                try {
                  var V = T.stateNode;
                  c ? ap(V, !0) : ap(T.stateNode, !1);
                } catch (ue) {
                  Be(T, T.return, ue);
                }
              }
            } else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === e) && t.child !== null) {
              t.child.return = t, t = t.child;
              continue;
            }
            if (t === e) break e;
            for (; t.sibling === null; ) {
              if (t.return === null || t.return === e) break e;
              n === t && (n = null), t = t.return;
            }
            n === t && (n = null), t.sibling.return = t.return, t = t.sibling;
          }
        l & 4 && (l = e.updateQueue, l !== null && (n = l.retryQueue, n !== null && (l.retryQueue = null, ar(e, n))));
        break;
      case 19:
        Gt(t, e), Vt(e), l & 4 && (l = e.updateQueue, l !== null && (e.updateQueue = null, ar(e, l)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        Gt(t, e), Vt(e);
    }
  }
  function Vt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var n, l = e.return; l !== null; ) {
          if (lm(l)) {
            n = l;
            break;
          }
          l = l.return;
        }
        if (n == null) throw Error(o(160));
        switch (n.tag) {
          case 27:
            var c = n.stateNode, u = Qo(e);
            nr(e, u, c);
            break;
          case 5:
            var p = n.stateNode;
            n.flags & 32 && (xs(p, ""), n.flags &= -33);
            var y = Qo(e);
            nr(e, y, p);
            break;
          case 3:
          case 4:
            var T = n.stateNode.containerInfo, $ = Qo(e);
            Zo(
              e,
              $,
              T
            );
            break;
          default:
            throw Error(o(161));
        }
      } catch (Y) {
        Be(e, e.return, Y);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function mm(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        mm(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
  }
  function Zn(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        cm(e, t.alternate, t), t = t.sibling;
  }
  function ns(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          _a(4, t, t.return), ns(t);
          break;
        case 1:
          Mn(t, t.return);
          var n = t.stateNode;
          typeof n.componentWillUnmount == "function" && am(
            t,
            t.return,
            n
          ), ns(t);
          break;
        case 27:
          Xl(t.stateNode);
        case 26:
        case 5:
          Mn(t, t.return), ns(t);
          break;
        case 22:
          t.memoizedState === null && ns(t);
          break;
        case 30:
          ns(t);
          break;
        default:
          ns(t);
      }
      e = e.sibling;
    }
  }
  function Kn(e, t, n) {
    for (n = n && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var l = t.alternate, c = e, u = t, p = u.flags;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          Kn(
            c,
            u,
            n
          ), Hl(4, u);
          break;
        case 1:
          if (Kn(
            c,
            u,
            n
          ), l = u, c = l.stateNode, typeof c.componentDidMount == "function")
            try {
              c.componentDidMount();
            } catch ($) {
              Be(l, l.return, $);
            }
          if (l = u, c = l.updateQueue, c !== null) {
            var y = l.stateNode;
            try {
              var T = c.shared.hiddenCallbacks;
              if (T !== null)
                for (c.shared.hiddenCallbacks = null, c = 0; c < T.length; c++)
                  qh(T[c], y);
            } catch ($) {
              Be(l, l.return, $);
            }
          }
          n && p & 64 && nm(u), Ll(u, u.return);
          break;
        case 27:
          im(u);
        case 26:
        case 5:
          Kn(
            c,
            u,
            n
          ), n && l === null && p & 4 && sm(u), Ll(u, u.return);
          break;
        case 12:
          Kn(
            c,
            u,
            n
          );
          break;
        case 31:
          Kn(
            c,
            u,
            n
          ), n && p & 4 && dm(c, u);
          break;
        case 13:
          Kn(
            c,
            u,
            n
          ), n && p & 4 && hm(c, u);
          break;
        case 22:
          u.memoizedState === null && Kn(
            c,
            u,
            n
          ), Ll(u, u.return);
          break;
        case 30:
          break;
        default:
          Kn(
            c,
            u,
            n
          );
      }
      t = t.sibling;
    }
  }
  function Jo(e, t) {
    var n = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && jl(n));
  }
  function Po(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && jl(e));
  }
  function wn(e, t, n, l) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        pm(
          e,
          t,
          n,
          l
        ), t = t.sibling;
  }
  function pm(e, t, n, l) {
    var c = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        wn(
          e,
          t,
          n,
          l
        ), c & 2048 && Hl(9, t);
        break;
      case 1:
        wn(
          e,
          t,
          n,
          l
        );
        break;
      case 3:
        wn(
          e,
          t,
          n,
          l
        ), c & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && jl(e)));
        break;
      case 12:
        if (c & 2048) {
          wn(
            e,
            t,
            n,
            l
          ), e = t.stateNode;
          try {
            var u = t.memoizedProps, p = u.id, y = u.onPostCommit;
            typeof y == "function" && y(
              p,
              t.alternate === null ? "mount" : "update",
              e.passiveEffectDuration,
              -0
            );
          } catch (T) {
            Be(t, t.return, T);
          }
        } else
          wn(
            e,
            t,
            n,
            l
          );
        break;
      case 31:
        wn(
          e,
          t,
          n,
          l
        );
        break;
      case 13:
        wn(
          e,
          t,
          n,
          l
        );
        break;
      case 23:
        break;
      case 22:
        u = t.stateNode, p = t.alternate, t.memoizedState !== null ? u._visibility & 2 ? wn(
          e,
          t,
          n,
          l
        ) : $l(e, t) : u._visibility & 2 ? wn(
          e,
          t,
          n,
          l
        ) : (u._visibility |= 2, Bs(
          e,
          t,
          n,
          l,
          (t.subtreeFlags & 10256) !== 0 || !1
        )), c & 2048 && Jo(p, t);
        break;
      case 24:
        wn(
          e,
          t,
          n,
          l
        ), c & 2048 && Po(t.alternate, t);
        break;
      default:
        wn(
          e,
          t,
          n,
          l
        );
    }
  }
  function Bs(e, t, n, l, c) {
    for (c = c && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var u = e, p = t, y = n, T = l, $ = p.flags;
      switch (p.tag) {
        case 0:
        case 11:
        case 15:
          Bs(
            u,
            p,
            y,
            T,
            c
          ), Hl(8, p);
          break;
        case 23:
          break;
        case 22:
          var Y = p.stateNode;
          p.memoizedState !== null ? Y._visibility & 2 ? Bs(
            u,
            p,
            y,
            T,
            c
          ) : $l(
            u,
            p
          ) : (Y._visibility |= 2, Bs(
            u,
            p,
            y,
            T,
            c
          )), c && $ & 2048 && Jo(
            p.alternate,
            p
          );
          break;
        case 24:
          Bs(
            u,
            p,
            y,
            T,
            c
          ), c && $ & 2048 && Po(p.alternate, p);
          break;
        default:
          Bs(
            u,
            p,
            y,
            T,
            c
          );
      }
      t = t.sibling;
    }
  }
  function $l(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var n = e, l = t, c = l.flags;
        switch (l.tag) {
          case 22:
            $l(n, l), c & 2048 && Jo(
              l.alternate,
              l
            );
            break;
          case 24:
            $l(n, l), c & 2048 && Po(l.alternate, l);
            break;
          default:
            $l(n, l);
        }
        t = t.sibling;
      }
  }
  var Ul = 8192;
  function Fs(e, t, n) {
    if (e.subtreeFlags & Ul)
      for (e = e.child; e !== null; )
        _m(
          e,
          t,
          n
        ), e = e.sibling;
  }
  function _m(e, t, n) {
    switch (e.tag) {
      case 26:
        Fs(
          e,
          t,
          n
        ), e.flags & Ul && e.memoizedState !== null && Zv(
          n,
          yn,
          e.memoizedState,
          e.memoizedProps
        );
        break;
      case 5:
        Fs(
          e,
          t,
          n
        );
        break;
      case 3:
      case 4:
        var l = yn;
        yn = br(e.stateNode.containerInfo), Fs(
          e,
          t,
          n
        ), yn = l;
        break;
      case 22:
        e.memoizedState === null && (l = e.alternate, l !== null && l.memoizedState !== null ? (l = Ul, Ul = 16777216, Fs(
          e,
          t,
          n
        ), Ul = l) : Fs(
          e,
          t,
          n
        ));
        break;
      default:
        Fs(
          e,
          t,
          n
        );
    }
  }
  function bm(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function Bl(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var l = t[n];
          gt = l, vm(
            l,
            e
          );
        }
      bm(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        gm(e), e = e.sibling;
  }
  function gm(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        Bl(e), e.flags & 2048 && _a(9, e, e.return);
        break;
      case 3:
        Bl(e);
        break;
      case 12:
        Bl(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, sr(e)) : Bl(e);
        break;
      default:
        Bl(e);
    }
  }
  function sr(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var l = t[n];
          gt = l, vm(
            l,
            e
          );
        }
      bm(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          _a(8, t, t.return), sr(t);
          break;
        case 22:
          n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, sr(t));
          break;
        default:
          sr(t);
      }
      e = e.sibling;
    }
  }
  function vm(e, t) {
    for (; gt !== null; ) {
      var n = gt;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          _a(8, n, t);
          break;
        case 23:
        case 22:
          if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
            var l = n.memoizedState.cachePool.pool;
            l != null && l.refCount++;
          }
          break;
        case 24:
          jl(n.memoizedState.cache);
      }
      if (l = n.child, l !== null) l.return = n, gt = l;
      else
        e: for (n = e; gt !== null; ) {
          l = gt;
          var c = l.sibling, u = l.return;
          if (om(l), l === n) {
            gt = null;
            break e;
          }
          if (c !== null) {
            c.return = u, gt = c;
            break e;
          }
          gt = u;
        }
    }
  }
  var ov = {
    getCacheForType: function(e) {
      var t = yt(rt), n = t.data.get(e);
      return n === void 0 && (n = e(), t.data.set(e, n)), n;
    },
    cacheSignal: function() {
      return yt(rt).controller.signal;
    }
  }, uv = typeof WeakMap == "function" ? WeakMap : Map, He = 0, qe = null, ke = null, Ee = 0, Ue = 0, It = null, ba = !1, Gs = !1, Wo = !1, Jn = 0, tt = 0, ga = 0, as = 0, Io = 0, en = 0, Vs = 0, Fl = null, qt = null, eu = !1, lr = 0, xm = 0, ir = 1 / 0, rr = null, va = null, _t = 0, xa = null, qs = null, Pn = 0, tu = 0, nu = null, ym = null, Gl = 0, au = null;
  function tn() {
    return (He & 2) !== 0 && Ee !== 0 ? Ee & -Ee : R.T !== null ? ou() : Hd();
  }
  function wm() {
    if (en === 0)
      if ((Ee & 536870912) === 0 || Te) {
        var e = pi;
        pi <<= 1, (pi & 3932160) === 0 && (pi = 262144), en = e;
      } else en = 536870912;
    return e = Pt.current, e !== null && (e.flags |= 32), en;
  }
  function Yt(e, t, n) {
    (e === qe && (Ue === 2 || Ue === 9) || e.cancelPendingCommit !== null) && (Ys(e, 0), ya(
      e,
      Ee,
      en,
      !1
    )), ol(e, n), ((He & 2) === 0 || e !== qe) && (e === qe && ((He & 2) === 0 && (as |= n), tt === 4 && ya(
      e,
      Ee,
      en,
      !1
    )), Tn(e));
  }
  function jm(e, t, n) {
    if ((He & 6) !== 0) throw Error(o(327));
    var l = !n && (t & 127) === 0 && (t & e.expiredLanes) === 0 || cl(e, t), c = l ? fv(e, t) : lu(e, t, !0), u = l;
    do {
      if (c === 0) {
        Gs && !l && ya(e, t, 0, !1);
        break;
      } else {
        if (n = e.current.alternate, u && !dv(n)) {
          c = lu(e, t, !1), u = !1;
          continue;
        }
        if (c === 2) {
          if (u = t, e.errorRecoveryDisabledLanes & u)
            var p = 0;
          else
            p = e.pendingLanes & -536870913, p = p !== 0 ? p : p & 536870912 ? 536870912 : 0;
          if (p !== 0) {
            t = p;
            e: {
              var y = e;
              c = Fl;
              var T = y.current.memoizedState.isDehydrated;
              if (T && (Ys(y, p).flags |= 256), p = lu(
                y,
                p,
                !1
              ), p !== 2) {
                if (Wo && !T) {
                  y.errorRecoveryDisabledLanes |= u, as |= u, c = 4;
                  break e;
                }
                u = qt, qt = c, u !== null && (qt === null ? qt = u : qt.push.apply(
                  qt,
                  u
                ));
              }
              c = p;
            }
            if (u = !1, c !== 2) continue;
          }
        }
        if (c === 1) {
          Ys(e, 0), ya(e, t, 0, !0);
          break;
        }
        e: {
          switch (l = e, u = c, u) {
            case 0:
            case 1:
              throw Error(o(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              ya(
                l,
                t,
                en,
                !ba
              );
              break e;
            case 2:
              qt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(o(329));
          }
          if ((t & 62914560) === t && (c = lr + 300 - st(), 10 < c)) {
            if (ya(
              l,
              t,
              en,
              !ba
            ), bi(l, 0, !0) !== 0) break e;
            Pn = t, l.timeoutHandle = ep(
              Sm.bind(
                null,
                l,
                n,
                qt,
                rr,
                eu,
                t,
                en,
                as,
                Vs,
                ba,
                u,
                "Throttled",
                -0,
                0
              ),
              c
            );
            break e;
          }
          Sm(
            l,
            n,
            qt,
            rr,
            eu,
            t,
            en,
            as,
            Vs,
            ba,
            u,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Tn(e);
  }
  function Sm(e, t, n, l, c, u, p, y, T, $, Y, J, B, V) {
    if (e.timeoutHandle = -1, J = t.subtreeFlags, J & 8192 || (J & 16785408) === 16785408) {
      J = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: Hn
      }, _m(
        t,
        u,
        J
      );
      var ue = (u & 62914560) === u ? lr - st() : (u & 4194048) === u ? xm - st() : 0;
      if (ue = Kv(
        J,
        ue
      ), ue !== null) {
        Pn = u, e.cancelPendingCommit = ue(
          Am.bind(
            null,
            e,
            t,
            u,
            n,
            l,
            c,
            p,
            y,
            T,
            Y,
            J,
            null,
            B,
            V
          )
        ), ya(e, u, p, !$);
        return;
      }
    }
    Am(
      e,
      t,
      u,
      n,
      l,
      c,
      p,
      y,
      T
    );
  }
  function dv(e) {
    for (var t = e; ; ) {
      var n = t.tag;
      if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null)))
        for (var l = 0; l < n.length; l++) {
          var c = n[l], u = c.getSnapshot;
          c = c.value;
          try {
            if (!Kt(u(), c)) return !1;
          } catch {
            return !1;
          }
        }
      if (n = t.child, t.subtreeFlags & 16384 && n !== null)
        n.return = t, t = n;
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
  function ya(e, t, n, l) {
    t &= ~Io, t &= ~as, e.suspendedLanes |= t, e.pingedLanes &= ~t, l && (e.warmLanes |= t), l = e.expirationTimes;
    for (var c = t; 0 < c; ) {
      var u = 31 - Ct(c), p = 1 << u;
      l[u] = -1, c &= ~p;
    }
    n !== 0 && zd(e, n, t);
  }
  function cr() {
    return (He & 6) === 0 ? (Vl(0), !1) : !0;
  }
  function su() {
    if (ke !== null) {
      if (Ue === 0)
        var e = ke.return;
      else
        e = ke, Bn = Za = null, xo(e), Ds = null, kl = 0, e = ke;
      for (; e !== null; )
        tm(e.alternate, e), e = e.return;
      ke = null;
    }
  }
  function Ys(e, t) {
    var n = e.timeoutHandle;
    n !== -1 && (e.timeoutHandle = -1, Rv(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), Pn = 0, su(), qe = e, ke = n = $n(e.current, null), Ee = t, Ue = 0, It = null, ba = !1, Gs = cl(e, t), Wo = !1, Vs = en = Io = as = ga = tt = 0, qt = Fl = null, eu = !1, (t & 8) !== 0 && (t |= t & 32);
    var l = e.entangledLanes;
    if (l !== 0)
      for (e = e.entanglements, l &= t; 0 < l; ) {
        var c = 31 - Ct(l), u = 1 << c;
        t |= e[c], l &= ~u;
      }
    return Jn = t, Mi(), n;
  }
  function km(e, t) {
    we = null, R.H = zl, t === Os || t === Li ? (t = Bh(), Ue = 3) : t === ro ? (t = Bh(), Ue = 4) : Ue = t === Ho ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, It = t, ke === null && (tt = 1, Pi(
      e,
      un(t, e.current)
    ));
  }
  function Nm() {
    var e = Pt.current;
    return e === null ? !0 : (Ee & 4194048) === Ee ? mn === null : (Ee & 62914560) === Ee || (Ee & 536870912) !== 0 ? e === mn : !1;
  }
  function Cm() {
    var e = R.H;
    return R.H = zl, e === null ? zl : e;
  }
  function Em() {
    var e = R.A;
    return R.A = ov, e;
  }
  function or() {
    tt = 4, ba || (Ee & 4194048) !== Ee && Pt.current !== null || (Gs = !0), (ga & 134217727) === 0 && (as & 134217727) === 0 || qe === null || ya(
      qe,
      Ee,
      en,
      !1
    );
  }
  function lu(e, t, n) {
    var l = He;
    He |= 2;
    var c = Cm(), u = Em();
    (qe !== e || Ee !== t) && (rr = null, Ys(e, t)), t = !1;
    var p = tt;
    e: do
      try {
        if (Ue !== 0 && ke !== null) {
          var y = ke, T = It;
          switch (Ue) {
            case 8:
              su(), p = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              Pt.current === null && (t = !0);
              var $ = Ue;
              if (Ue = 0, It = null, Xs(e, y, T, $), n && Gs) {
                p = 0;
                break e;
              }
              break;
            default:
              $ = Ue, Ue = 0, It = null, Xs(e, y, T, $);
          }
        }
        hv(), p = tt;
        break;
      } catch (Y) {
        km(e, Y);
      }
    while (!0);
    return t && e.shellSuspendCounter++, Bn = Za = null, He = l, R.H = c, R.A = u, ke === null && (qe = null, Ee = 0, Mi()), p;
  }
  function hv() {
    for (; ke !== null; ) Mm(ke);
  }
  function fv(e, t) {
    var n = He;
    He |= 2;
    var l = Cm(), c = Em();
    qe !== e || Ee !== t ? (rr = null, ir = st() + 500, Ys(e, t)) : Gs = cl(
      e,
      t
    );
    e: do
      try {
        if (Ue !== 0 && ke !== null) {
          t = ke;
          var u = It;
          t: switch (Ue) {
            case 1:
              Ue = 0, It = null, Xs(e, t, u, 1);
              break;
            case 2:
            case 9:
              if ($h(u)) {
                Ue = 0, It = null, Tm(t);
                break;
              }
              t = function() {
                Ue !== 2 && Ue !== 9 || qe !== e || (Ue = 7), Tn(e);
              }, u.then(t, t);
              break e;
            case 3:
              Ue = 7;
              break e;
            case 4:
              Ue = 5;
              break e;
            case 7:
              $h(u) ? (Ue = 0, It = null, Tm(t)) : (Ue = 0, It = null, Xs(e, t, u, 7));
              break;
            case 5:
              var p = null;
              switch (ke.tag) {
                case 26:
                  p = ke.memoizedState;
                case 5:
                case 27:
                  var y = ke;
                  if (p ? pp(p) : y.stateNode.complete) {
                    Ue = 0, It = null;
                    var T = y.sibling;
                    if (T !== null) ke = T;
                    else {
                      var $ = y.return;
                      $ !== null ? (ke = $, ur($)) : ke = null;
                    }
                    break t;
                  }
              }
              Ue = 0, It = null, Xs(e, t, u, 5);
              break;
            case 6:
              Ue = 0, It = null, Xs(e, t, u, 6);
              break;
            case 8:
              su(), tt = 6;
              break e;
            default:
              throw Error(o(462));
          }
        }
        mv();
        break;
      } catch (Y) {
        km(e, Y);
      }
    while (!0);
    return Bn = Za = null, R.H = l, R.A = c, He = n, ke !== null ? 0 : (qe = null, Ee = 0, Mi(), tt);
  }
  function mv() {
    for (; ke !== null && !ln(); )
      Mm(ke);
  }
  function Mm(e) {
    var t = If(e.alternate, e, Jn);
    e.memoizedProps = e.pendingProps, t === null ? ur(e) : ke = t;
  }
  function Tm(e) {
    var t = e, n = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = Qf(
          n,
          t,
          t.pendingProps,
          t.type,
          void 0,
          Ee
        );
        break;
      case 11:
        t = Qf(
          n,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          Ee
        );
        break;
      case 5:
        xo(t);
      default:
        tm(n, t), t = ke = Ch(t, Jn), t = If(n, t, Jn);
    }
    e.memoizedProps = e.pendingProps, t === null ? ur(e) : ke = t;
  }
  function Xs(e, t, n, l) {
    Bn = Za = null, xo(t), Ds = null, kl = 0;
    var c = t.return;
    try {
      if (nv(
        e,
        c,
        t,
        n,
        Ee
      )) {
        tt = 1, Pi(
          e,
          un(n, e.current)
        ), ke = null;
        return;
      }
    } catch (u) {
      if (c !== null) throw ke = c, u;
      tt = 1, Pi(
        e,
        un(n, e.current)
      ), ke = null;
      return;
    }
    t.flags & 32768 ? (Te || l === 1 ? e = !0 : Gs || (Ee & 536870912) !== 0 ? e = !1 : (ba = e = !0, (l === 2 || l === 9 || l === 3 || l === 6) && (l = Pt.current, l !== null && l.tag === 13 && (l.flags |= 16384))), Rm(t, e)) : ur(t);
  }
  function ur(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        Rm(
          t,
          ba
        );
        return;
      }
      e = t.return;
      var n = lv(
        t.alternate,
        t,
        Jn
      );
      if (n !== null) {
        ke = n;
        return;
      }
      if (t = t.sibling, t !== null) {
        ke = t;
        return;
      }
      ke = t = e;
    } while (t !== null);
    tt === 0 && (tt = 5);
  }
  function Rm(e, t) {
    do {
      var n = iv(e.alternate, e);
      if (n !== null) {
        n.flags &= 32767, ke = n;
        return;
      }
      if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
        ke = e;
        return;
      }
      ke = e = n;
    } while (e !== null);
    tt = 6, ke = null;
  }
  function Am(e, t, n, l, c, u, p, y, T) {
    e.cancelPendingCommit = null;
    do
      dr();
    while (_t !== 0);
    if ((He & 6) !== 0) throw Error(o(327));
    if (t !== null) {
      if (t === e.current) throw Error(o(177));
      if (u = t.lanes | t.childLanes, u |= Xc, Qb(
        e,
        n,
        u,
        p,
        y,
        T
      ), e === qe && (ke = qe = null, Ee = 0), qs = t, xa = e, Pn = n, tu = u, nu = c, ym = l, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, gv(hs, function() {
        return Lm(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), l = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || l) {
        l = R.T, R.T = null, c = D.p, D.p = 2, p = He, He |= 4;
        try {
          rv(e, t, n);
        } finally {
          He = p, D.p = c, R.T = l;
        }
      }
      _t = 1, zm(), Om(), Dm();
    }
  }
  function zm() {
    if (_t === 1) {
      _t = 0;
      var e = xa, t = qs, n = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || n) {
        n = R.T, R.T = null;
        var l = D.p;
        D.p = 2;
        var c = He;
        He |= 4;
        try {
          fm(t, e);
          var u = bu, p = gh(e.containerInfo), y = u.focusedElem, T = u.selectionRange;
          if (p !== y && y && y.ownerDocument && bh(
            y.ownerDocument.documentElement,
            y
          )) {
            if (T !== null && Fc(y)) {
              var $ = T.start, Y = T.end;
              if (Y === void 0 && (Y = $), "selectionStart" in y)
                y.selectionStart = $, y.selectionEnd = Math.min(
                  Y,
                  y.value.length
                );
              else {
                var J = y.ownerDocument || document, B = J && J.defaultView || window;
                if (B.getSelection) {
                  var V = B.getSelection(), ue = y.textContent.length, be = Math.min(T.start, ue), Ve = T.end === void 0 ? be : Math.min(T.end, ue);
                  !V.extend && be > Ve && (p = Ve, Ve = be, be = p);
                  var O = _h(
                    y,
                    be
                  ), A = _h(
                    y,
                    Ve
                  );
                  if (O && A && (V.rangeCount !== 1 || V.anchorNode !== O.node || V.anchorOffset !== O.offset || V.focusNode !== A.node || V.focusOffset !== A.offset)) {
                    var L = J.createRange();
                    L.setStart(O.node, O.offset), V.removeAllRanges(), be > Ve ? (V.addRange(L), V.extend(A.node, A.offset)) : (L.setEnd(A.node, A.offset), V.addRange(L));
                  }
                }
              }
            }
            for (J = [], V = y; V = V.parentNode; )
              V.nodeType === 1 && J.push({
                element: V,
                left: V.scrollLeft,
                top: V.scrollTop
              });
            for (typeof y.focus == "function" && y.focus(), y = 0; y < J.length; y++) {
              var K = J[y];
              K.element.scrollLeft = K.left, K.element.scrollTop = K.top;
            }
          }
          jr = !!_u, bu = _u = null;
        } finally {
          He = c, D.p = l, R.T = n;
        }
      }
      e.current = t, _t = 2;
    }
  }
  function Om() {
    if (_t === 2) {
      _t = 0;
      var e = xa, t = qs, n = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || n) {
        n = R.T, R.T = null;
        var l = D.p;
        D.p = 2;
        var c = He;
        He |= 4;
        try {
          cm(e, t.alternate, t);
        } finally {
          He = c, D.p = l, R.T = n;
        }
      }
      _t = 3;
    }
  }
  function Dm() {
    if (_t === 4 || _t === 3) {
      _t = 0, Zt();
      var e = xa, t = qs, n = Pn, l = ym;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? _t = 5 : (_t = 0, qs = xa = null, Hm(e, e.pendingLanes));
      var c = e.pendingLanes;
      if (c === 0 && (va = null), wc(n), t = t.stateNode, zt && typeof zt.onCommitFiberRoot == "function")
        try {
          zt.onCommitFiberRoot(
            Ua,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (l !== null) {
        t = R.T, c = D.p, D.p = 2, R.T = null;
        try {
          for (var u = e.onRecoverableError, p = 0; p < l.length; p++) {
            var y = l[p];
            u(y.value, {
              componentStack: y.stack
            });
          }
        } finally {
          R.T = t, D.p = c;
        }
      }
      (Pn & 3) !== 0 && dr(), Tn(e), c = e.pendingLanes, (n & 261930) !== 0 && (c & 42) !== 0 ? e === au ? Gl++ : (Gl = 0, au = e) : Gl = 0, Vl(0);
    }
  }
  function Hm(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, jl(t)));
  }
  function dr() {
    return zm(), Om(), Dm(), Lm();
  }
  function Lm() {
    if (_t !== 5) return !1;
    var e = xa, t = tu;
    tu = 0;
    var n = wc(Pn), l = R.T, c = D.p;
    try {
      D.p = 32 > n ? 32 : n, R.T = null, n = nu, nu = null;
      var u = xa, p = Pn;
      if (_t = 0, qs = xa = null, Pn = 0, (He & 6) !== 0) throw Error(o(331));
      var y = He;
      if (He |= 4, gm(u.current), pm(
        u,
        u.current,
        p,
        n
      ), He = y, Vl(0, !1), zt && typeof zt.onPostCommitFiberRoot == "function")
        try {
          zt.onPostCommitFiberRoot(Ua, u);
        } catch {
        }
      return !0;
    } finally {
      D.p = c, R.T = l, Hm(e, t);
    }
  }
  function $m(e, t, n) {
    t = un(n, t), t = Do(e.stateNode, t, 2), e = fa(e, t, 2), e !== null && (ol(e, 2), Tn(e));
  }
  function Be(e, t, n) {
    if (e.tag === 3)
      $m(e, e, n);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          $m(
            t,
            e,
            n
          );
          break;
        } else if (t.tag === 1) {
          var l = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof l.componentDidCatch == "function" && (va === null || !va.has(l))) {
            e = un(n, e), n = Uf(2), l = fa(t, n, 2), l !== null && (Bf(
              n,
              l,
              t,
              e
            ), ol(l, 2), Tn(l));
            break;
          }
        }
        t = t.return;
      }
  }
  function iu(e, t, n) {
    var l = e.pingCache;
    if (l === null) {
      l = e.pingCache = new uv();
      var c = /* @__PURE__ */ new Set();
      l.set(t, c);
    } else
      c = l.get(t), c === void 0 && (c = /* @__PURE__ */ new Set(), l.set(t, c));
    c.has(n) || (Wo = !0, c.add(n), e = pv.bind(null, e, t, n), t.then(e, e));
  }
  function pv(e, t, n) {
    var l = e.pingCache;
    l !== null && l.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, qe === e && (Ee & n) === n && (tt === 4 || tt === 3 && (Ee & 62914560) === Ee && 300 > st() - lr ? (He & 2) === 0 && Ys(e, 0) : Io |= n, Vs === Ee && (Vs = 0)), Tn(e);
  }
  function Um(e, t) {
    t === 0 && (t = Ad()), e = Ya(e, t), e !== null && (ol(e, t), Tn(e));
  }
  function _v(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), Um(e, n);
  }
  function bv(e, t) {
    var n = 0;
    switch (e.tag) {
      case 31:
      case 13:
        var l = e.stateNode, c = e.memoizedState;
        c !== null && (n = c.retryLane);
        break;
      case 19:
        l = e.stateNode;
        break;
      case 22:
        l = e.stateNode._retryCache;
        break;
      default:
        throw Error(o(314));
    }
    l !== null && l.delete(t), Um(e, n);
  }
  function gv(e, t) {
    return Lt(e, t);
  }
  var hr = null, Qs = null, ru = !1, fr = !1, cu = !1, wa = 0;
  function Tn(e) {
    e !== Qs && e.next === null && (Qs === null ? hr = Qs = e : Qs = Qs.next = e), fr = !0, ru || (ru = !0, xv());
  }
  function Vl(e, t) {
    if (!cu && fr) {
      cu = !0;
      do
        for (var n = !1, l = hr; l !== null; ) {
          if (e !== 0) {
            var c = l.pendingLanes;
            if (c === 0) var u = 0;
            else {
              var p = l.suspendedLanes, y = l.pingedLanes;
              u = (1 << 31 - Ct(42 | e) + 1) - 1, u &= c & ~(p & ~y), u = u & 201326741 ? u & 201326741 | 1 : u ? u | 2 : 0;
            }
            u !== 0 && (n = !0, Vm(l, u));
          } else
            u = Ee, u = bi(
              l,
              l === qe ? u : 0,
              l.cancelPendingCommit !== null || l.timeoutHandle !== -1
            ), (u & 3) === 0 || cl(l, u) || (n = !0, Vm(l, u));
          l = l.next;
        }
      while (n);
      cu = !1;
    }
  }
  function vv() {
    Bm();
  }
  function Bm() {
    fr = ru = !1;
    var e = 0;
    wa !== 0 && Tv() && (e = wa);
    for (var t = st(), n = null, l = hr; l !== null; ) {
      var c = l.next, u = Fm(l, t);
      u === 0 ? (l.next = null, n === null ? hr = c : n.next = c, c === null && (Qs = n)) : (n = l, (e !== 0 || (u & 3) !== 0) && (fr = !0)), l = c;
    }
    _t !== 0 && _t !== 5 || Vl(e), wa !== 0 && (wa = 0);
  }
  function Fm(e, t) {
    for (var n = e.suspendedLanes, l = e.pingedLanes, c = e.expirationTimes, u = e.pendingLanes & -62914561; 0 < u; ) {
      var p = 31 - Ct(u), y = 1 << p, T = c[p];
      T === -1 ? ((y & n) === 0 || (y & l) !== 0) && (c[p] = Xb(y, t)) : T <= t && (e.expiredLanes |= y), u &= ~y;
    }
    if (t = qe, n = Ee, n = bi(
      e,
      e === t ? n : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), l = e.callbackNode, n === 0 || e === t && (Ue === 2 || Ue === 9) || e.cancelPendingCommit !== null)
      return l !== null && l !== null && $t(l), e.callbackNode = null, e.callbackPriority = 0;
    if ((n & 3) === 0 || cl(e, n)) {
      if (t = n & -n, t === e.callbackPriority) return t;
      switch (l !== null && $t(l), wc(n)) {
        case 2:
        case 8:
          n = ds;
          break;
        case 32:
          n = hs;
          break;
        case 268435456:
          n = mi;
          break;
        default:
          n = hs;
      }
      return l = Gm.bind(null, e), n = Lt(n, l), e.callbackPriority = t, e.callbackNode = n, t;
    }
    return l !== null && l !== null && $t(l), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function Gm(e, t) {
    if (_t !== 0 && _t !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var n = e.callbackNode;
    if (dr() && e.callbackNode !== n)
      return null;
    var l = Ee;
    return l = bi(
      e,
      e === qe ? l : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), l === 0 ? null : (jm(e, l, t), Fm(e, st()), e.callbackNode != null && e.callbackNode === n ? Gm.bind(null, e) : null);
  }
  function Vm(e, t) {
    if (dr()) return null;
    jm(e, t, !0);
  }
  function xv() {
    Av(function() {
      (He & 6) !== 0 ? Lt(
        Re,
        vv
      ) : Bm();
    });
  }
  function ou() {
    if (wa === 0) {
      var e = As;
      e === 0 && (e = fs, fs <<= 1, (fs & 261888) === 0 && (fs = 256)), wa = e;
    }
    return wa;
  }
  function qm(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : yi("" + e);
  }
  function Ym(e, t) {
    var n = t.ownerDocument.createElement("input");
    return n.name = t.name, n.value = t.value, e.id && n.setAttribute("form", e.id), t.parentNode.insertBefore(n, t), e = new FormData(e), n.parentNode.removeChild(n), e;
  }
  function yv(e, t, n, l, c) {
    if (t === "submit" && n && n.stateNode === c) {
      var u = qm(
        (c[Ut] || null).action
      ), p = l.submitter;
      p && (t = (t = p[Ut] || null) ? qm(t.formAction) : p.getAttribute("formAction"), t !== null && (u = t, p = null));
      var y = new ki(
        "action",
        "action",
        null,
        l,
        c
      );
      e.push({
        event: y,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (l.defaultPrevented) {
                if (wa !== 0) {
                  var T = p ? Ym(c, p) : new FormData(c);
                  Mo(
                    n,
                    {
                      pending: !0,
                      data: T,
                      method: c.method,
                      action: u
                    },
                    null,
                    T
                  );
                }
              } else
                typeof u == "function" && (y.preventDefault(), T = p ? Ym(c, p) : new FormData(c), Mo(
                  n,
                  {
                    pending: !0,
                    data: T,
                    method: c.method,
                    action: u
                  },
                  u,
                  T
                ));
            },
            currentTarget: c
          }
        ]
      });
    }
  }
  for (var uu = 0; uu < Yc.length; uu++) {
    var du = Yc[uu], wv = du.toLowerCase(), jv = du[0].toUpperCase() + du.slice(1);
    xn(
      wv,
      "on" + jv
    );
  }
  xn(yh, "onAnimationEnd"), xn(wh, "onAnimationIteration"), xn(jh, "onAnimationStart"), xn("dblclick", "onDoubleClick"), xn("focusin", "onFocus"), xn("focusout", "onBlur"), xn(Ug, "onTransitionRun"), xn(Bg, "onTransitionStart"), xn(Fg, "onTransitionCancel"), xn(Sh, "onTransitionEnd"), gs("onMouseEnter", ["mouseout", "mouseover"]), gs("onMouseLeave", ["mouseout", "mouseover"]), gs("onPointerEnter", ["pointerout", "pointerover"]), gs("onPointerLeave", ["pointerout", "pointerover"]), Fa(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), Fa(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), Fa("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), Fa(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), Fa(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), Fa(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var ql = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), Sv = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(ql)
  );
  function Xm(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var l = e[n], c = l.event;
      l = l.listeners;
      e: {
        var u = void 0;
        if (t)
          for (var p = l.length - 1; 0 <= p; p--) {
            var y = l[p], T = y.instance, $ = y.currentTarget;
            if (y = y.listener, T !== u && c.isPropagationStopped())
              break e;
            u = y, c.currentTarget = $;
            try {
              u(c);
            } catch (Y) {
              Ei(Y);
            }
            c.currentTarget = null, u = T;
          }
        else
          for (p = 0; p < l.length; p++) {
            if (y = l[p], T = y.instance, $ = y.currentTarget, y = y.listener, T !== u && c.isPropagationStopped())
              break e;
            u = y, c.currentTarget = $;
            try {
              u(c);
            } catch (Y) {
              Ei(Y);
            }
            c.currentTarget = null, u = T;
          }
      }
    }
  }
  function Ne(e, t) {
    var n = t[jc];
    n === void 0 && (n = t[jc] = /* @__PURE__ */ new Set());
    var l = e + "__bubble";
    n.has(l) || (Qm(t, e, 2, !1), n.add(l));
  }
  function hu(e, t, n) {
    var l = 0;
    t && (l |= 4), Qm(
      n,
      e,
      l,
      t
    );
  }
  var mr = "_reactListening" + Math.random().toString(36).slice(2);
  function fu(e) {
    if (!e[mr]) {
      e[mr] = !0, Ud.forEach(function(n) {
        n !== "selectionchange" && (Sv.has(n) || hu(n, !1, e), hu(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[mr] || (t[mr] = !0, hu("selectionchange", !1, t));
    }
  }
  function Qm(e, t, n, l) {
    switch (wp(t)) {
      case 2:
        var c = Wv;
        break;
      case 8:
        c = Iv;
        break;
      default:
        c = Eu;
    }
    n = c.bind(
      null,
      t,
      n,
      e
    ), c = void 0, !Ac || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (c = !0), l ? c !== void 0 ? e.addEventListener(t, n, {
      capture: !0,
      passive: c
    }) : e.addEventListener(t, n, !0) : c !== void 0 ? e.addEventListener(t, n, {
      passive: c
    }) : e.addEventListener(t, n, !1);
  }
  function mu(e, t, n, l, c) {
    var u = l;
    if ((t & 1) === 0 && (t & 2) === 0 && l !== null)
      e: for (; ; ) {
        if (l === null) return;
        var p = l.tag;
        if (p === 3 || p === 4) {
          var y = l.stateNode.containerInfo;
          if (y === c) break;
          if (p === 4)
            for (p = l.return; p !== null; ) {
              var T = p.tag;
              if ((T === 3 || T === 4) && p.stateNode.containerInfo === c)
                return;
              p = p.return;
            }
          for (; y !== null; ) {
            if (p = ps(y), p === null) return;
            if (T = p.tag, T === 5 || T === 6 || T === 26 || T === 27) {
              l = u = p;
              continue e;
            }
            y = y.parentNode;
          }
        }
        l = l.return;
      }
    Pd(function() {
      var $ = u, Y = Tc(n), J = [];
      e: {
        var B = kh.get(e);
        if (B !== void 0) {
          var V = ki, ue = e;
          switch (e) {
            case "keypress":
              if (ji(n) === 0) break e;
            case "keydown":
            case "keyup":
              V = bg;
              break;
            case "focusin":
              ue = "focus", V = Hc;
              break;
            case "focusout":
              ue = "blur", V = Hc;
              break;
            case "beforeblur":
            case "afterblur":
              V = Hc;
              break;
            case "click":
              if (n.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              V = eh;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              V = lg;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              V = xg;
              break;
            case yh:
            case wh:
            case jh:
              V = cg;
              break;
            case Sh:
              V = wg;
              break;
            case "scroll":
            case "scrollend":
              V = ag;
              break;
            case "wheel":
              V = Sg;
              break;
            case "copy":
            case "cut":
            case "paste":
              V = ug;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              V = nh;
              break;
            case "toggle":
            case "beforetoggle":
              V = Ng;
          }
          var be = (t & 4) !== 0, Ve = !be && (e === "scroll" || e === "scrollend"), O = be ? B !== null ? B + "Capture" : null : B;
          be = [];
          for (var A = $, L; A !== null; ) {
            var K = A;
            if (L = K.stateNode, K = K.tag, K !== 5 && K !== 26 && K !== 27 || L === null || O === null || (K = hl(A, O), K != null && be.push(
              Yl(A, K, L)
            )), Ve) break;
            A = A.return;
          }
          0 < be.length && (B = new V(
            B,
            ue,
            null,
            n,
            Y
          ), J.push({ event: B, listeners: be }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (B = e === "mouseover" || e === "pointerover", V = e === "mouseout" || e === "pointerout", B && n !== Mc && (ue = n.relatedTarget || n.fromElement) && (ps(ue) || ue[ms]))
            break e;
          if ((V || B) && (B = Y.window === Y ? Y : (B = Y.ownerDocument) ? B.defaultView || B.parentWindow : window, V ? (ue = n.relatedTarget || n.toElement, V = $, ue = ue ? ps(ue) : null, ue !== null && (Ve = h(ue), be = ue.tag, ue !== Ve || be !== 5 && be !== 27 && be !== 6) && (ue = null)) : (V = null, ue = $), V !== ue)) {
            if (be = eh, K = "onMouseLeave", O = "onMouseEnter", A = "mouse", (e === "pointerout" || e === "pointerover") && (be = nh, K = "onPointerLeave", O = "onPointerEnter", A = "pointer"), Ve = V == null ? B : dl(V), L = ue == null ? B : dl(ue), B = new be(
              K,
              A + "leave",
              V,
              n,
              Y
            ), B.target = Ve, B.relatedTarget = L, K = null, ps(Y) === $ && (be = new be(
              O,
              A + "enter",
              ue,
              n,
              Y
            ), be.target = L, be.relatedTarget = Ve, K = be), Ve = K, V && ue)
              t: {
                for (be = kv, O = V, A = ue, L = 0, K = O; K; K = be(K))
                  L++;
                K = 0;
                for (var pe = A; pe; pe = be(pe))
                  K++;
                for (; 0 < L - K; )
                  O = be(O), L--;
                for (; 0 < K - L; )
                  A = be(A), K--;
                for (; L--; ) {
                  if (O === A || A !== null && O === A.alternate) {
                    be = O;
                    break t;
                  }
                  O = be(O), A = be(A);
                }
                be = null;
              }
            else be = null;
            V !== null && Zm(
              J,
              B,
              V,
              be,
              !1
            ), ue !== null && Ve !== null && Zm(
              J,
              Ve,
              ue,
              be,
              !0
            );
          }
        }
        e: {
          if (B = $ ? dl($) : window, V = B.nodeName && B.nodeName.toLowerCase(), V === "select" || V === "input" && B.type === "file")
            var ze = uh;
          else if (ch(B))
            if (dh)
              ze = Hg;
            else {
              ze = Og;
              var he = zg;
            }
          else
            V = B.nodeName, !V || V.toLowerCase() !== "input" || B.type !== "checkbox" && B.type !== "radio" ? $ && Ec($.elementType) && (ze = uh) : ze = Dg;
          if (ze && (ze = ze(e, $))) {
            oh(
              J,
              ze,
              n,
              Y
            );
            break e;
          }
          he && he(e, B, $), e === "focusout" && $ && B.type === "number" && $.memoizedProps.value != null && Cc(B, "number", B.value);
        }
        switch (he = $ ? dl($) : window, e) {
          case "focusin":
            (ch(he) || he.contentEditable === "true") && (Ss = he, Gc = $, xl = null);
            break;
          case "focusout":
            xl = Gc = Ss = null;
            break;
          case "mousedown":
            Vc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Vc = !1, vh(J, n, Y);
            break;
          case "selectionchange":
            if ($g) break;
          case "keydown":
          case "keyup":
            vh(J, n, Y);
        }
        var Se;
        if ($c)
          e: {
            switch (e) {
              case "compositionstart":
                var Me = "onCompositionStart";
                break e;
              case "compositionend":
                Me = "onCompositionEnd";
                break e;
              case "compositionupdate":
                Me = "onCompositionUpdate";
                break e;
            }
            Me = void 0;
          }
        else
          js ? ih(e, n) && (Me = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (Me = "onCompositionStart");
        Me && (ah && n.locale !== "ko" && (js || Me !== "onCompositionStart" ? Me === "onCompositionEnd" && js && (Se = Wd()) : (ia = Y, zc = "value" in ia ? ia.value : ia.textContent, js = !0)), he = pr($, Me), 0 < he.length && (Me = new th(
          Me,
          e,
          null,
          n,
          Y
        ), J.push({ event: Me, listeners: he }), Se ? Me.data = Se : (Se = rh(n), Se !== null && (Me.data = Se)))), (Se = Eg ? Mg(e, n) : Tg(e, n)) && (Me = pr($, "onBeforeInput"), 0 < Me.length && (he = new th(
          "onBeforeInput",
          "beforeinput",
          null,
          n,
          Y
        ), J.push({
          event: he,
          listeners: Me
        }), he.data = Se)), yv(
          J,
          e,
          $,
          n,
          Y
        );
      }
      Xm(J, t);
    });
  }
  function Yl(e, t, n) {
    return {
      instance: e,
      listener: t,
      currentTarget: n
    };
  }
  function pr(e, t) {
    for (var n = t + "Capture", l = []; e !== null; ) {
      var c = e, u = c.stateNode;
      if (c = c.tag, c !== 5 && c !== 26 && c !== 27 || u === null || (c = hl(e, n), c != null && l.unshift(
        Yl(e, c, u)
      ), c = hl(e, t), c != null && l.push(
        Yl(e, c, u)
      )), e.tag === 3) return l;
      e = e.return;
    }
    return [];
  }
  function kv(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function Zm(e, t, n, l, c) {
    for (var u = t._reactName, p = []; n !== null && n !== l; ) {
      var y = n, T = y.alternate, $ = y.stateNode;
      if (y = y.tag, T !== null && T === l) break;
      y !== 5 && y !== 26 && y !== 27 || $ === null || (T = $, c ? ($ = hl(n, u), $ != null && p.unshift(
        Yl(n, $, T)
      )) : c || ($ = hl(n, u), $ != null && p.push(
        Yl(n, $, T)
      ))), n = n.return;
    }
    p.length !== 0 && e.push({ event: t, listeners: p });
  }
  var Nv = /\r\n?/g, Cv = /\u0000|\uFFFD/g;
  function Km(e) {
    return (typeof e == "string" ? e : "" + e).replace(Nv, `
`).replace(Cv, "");
  }
  function Jm(e, t) {
    return t = Km(t), Km(e) === t;
  }
  function Ge(e, t, n, l, c, u) {
    switch (n) {
      case "children":
        typeof l == "string" ? t === "body" || t === "textarea" && l === "" || xs(e, l) : (typeof l == "number" || typeof l == "bigint") && t !== "body" && xs(e, "" + l);
        break;
      case "className":
        vi(e, "class", l);
        break;
      case "tabIndex":
        vi(e, "tabindex", l);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        vi(e, n, l);
        break;
      case "style":
        Kd(e, l, u);
        break;
      case "data":
        if (t !== "object") {
          vi(e, "data", l);
          break;
        }
      case "src":
      case "href":
        if (l === "" && (t !== "a" || n !== "href")) {
          e.removeAttribute(n);
          break;
        }
        if (l == null || typeof l == "function" || typeof l == "symbol" || typeof l == "boolean") {
          e.removeAttribute(n);
          break;
        }
        l = yi("" + l), e.setAttribute(n, l);
        break;
      case "action":
      case "formAction":
        if (typeof l == "function") {
          e.setAttribute(
            n,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof u == "function" && (n === "formAction" ? (t !== "input" && Ge(e, t, "name", c.name, c, null), Ge(
            e,
            t,
            "formEncType",
            c.formEncType,
            c,
            null
          ), Ge(
            e,
            t,
            "formMethod",
            c.formMethod,
            c,
            null
          ), Ge(
            e,
            t,
            "formTarget",
            c.formTarget,
            c,
            null
          )) : (Ge(e, t, "encType", c.encType, c, null), Ge(e, t, "method", c.method, c, null), Ge(e, t, "target", c.target, c, null)));
        if (l == null || typeof l == "symbol" || typeof l == "boolean") {
          e.removeAttribute(n);
          break;
        }
        l = yi("" + l), e.setAttribute(n, l);
        break;
      case "onClick":
        l != null && (e.onclick = Hn);
        break;
      case "onScroll":
        l != null && Ne("scroll", e);
        break;
      case "onScrollEnd":
        l != null && Ne("scrollend", e);
        break;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l))
            throw Error(o(61));
          if (n = l.__html, n != null) {
            if (c.children != null) throw Error(o(60));
            e.innerHTML = n;
          }
        }
        break;
      case "multiple":
        e.multiple = l && typeof l != "function" && typeof l != "symbol";
        break;
      case "muted":
        e.muted = l && typeof l != "function" && typeof l != "symbol";
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
        if (l == null || typeof l == "function" || typeof l == "boolean" || typeof l == "symbol") {
          e.removeAttribute("xlink:href");
          break;
        }
        n = yi("" + l), e.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          n
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
        l != null && typeof l != "function" && typeof l != "symbol" ? e.setAttribute(n, "" + l) : e.removeAttribute(n);
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
        l && typeof l != "function" && typeof l != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
        break;
      case "capture":
      case "download":
        l === !0 ? e.setAttribute(n, "") : l !== !1 && l != null && typeof l != "function" && typeof l != "symbol" ? e.setAttribute(n, l) : e.removeAttribute(n);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        l != null && typeof l != "function" && typeof l != "symbol" && !isNaN(l) && 1 <= l ? e.setAttribute(n, l) : e.removeAttribute(n);
        break;
      case "rowSpan":
      case "start":
        l == null || typeof l == "function" || typeof l == "symbol" || isNaN(l) ? e.removeAttribute(n) : e.setAttribute(n, l);
        break;
      case "popover":
        Ne("beforetoggle", e), Ne("toggle", e), gi(e, "popover", l);
        break;
      case "xlinkActuate":
        Dn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          l
        );
        break;
      case "xlinkArcrole":
        Dn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          l
        );
        break;
      case "xlinkRole":
        Dn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          l
        );
        break;
      case "xlinkShow":
        Dn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          l
        );
        break;
      case "xlinkTitle":
        Dn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          l
        );
        break;
      case "xlinkType":
        Dn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          l
        );
        break;
      case "xmlBase":
        Dn(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          l
        );
        break;
      case "xmlLang":
        Dn(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          l
        );
        break;
      case "xmlSpace":
        Dn(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          l
        );
        break;
      case "is":
        gi(e, "is", l);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = tg.get(n) || n, gi(e, n, l));
    }
  }
  function pu(e, t, n, l, c, u) {
    switch (n) {
      case "style":
        Kd(e, l, u);
        break;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l))
            throw Error(o(61));
          if (n = l.__html, n != null) {
            if (c.children != null) throw Error(o(60));
            e.innerHTML = n;
          }
        }
        break;
      case "children":
        typeof l == "string" ? xs(e, l) : (typeof l == "number" || typeof l == "bigint") && xs(e, "" + l);
        break;
      case "onScroll":
        l != null && Ne("scroll", e);
        break;
      case "onScrollEnd":
        l != null && Ne("scrollend", e);
        break;
      case "onClick":
        l != null && (e.onclick = Hn);
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
        if (!Bd.hasOwnProperty(n))
          e: {
            if (n[0] === "o" && n[1] === "n" && (c = n.endsWith("Capture"), t = n.slice(2, c ? n.length - 7 : void 0), u = e[Ut] || null, u = u != null ? u[n] : null, typeof u == "function" && e.removeEventListener(t, u, c), typeof l == "function")) {
              typeof u != "function" && u !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(t, l, c);
              break e;
            }
            n in e ? e[n] = l : l === !0 ? e.setAttribute(n, "") : gi(e, n, l);
          }
    }
  }
  function jt(e, t, n) {
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
        Ne("error", e), Ne("load", e);
        var l = !1, c = !1, u;
        for (u in n)
          if (n.hasOwnProperty(u)) {
            var p = n[u];
            if (p != null)
              switch (u) {
                case "src":
                  l = !0;
                  break;
                case "srcSet":
                  c = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(o(137, t));
                default:
                  Ge(e, t, u, p, n, null);
              }
          }
        c && Ge(e, t, "srcSet", n.srcSet, n, null), l && Ge(e, t, "src", n.src, n, null);
        return;
      case "input":
        Ne("invalid", e);
        var y = u = p = c = null, T = null, $ = null;
        for (l in n)
          if (n.hasOwnProperty(l)) {
            var Y = n[l];
            if (Y != null)
              switch (l) {
                case "name":
                  c = Y;
                  break;
                case "type":
                  p = Y;
                  break;
                case "checked":
                  T = Y;
                  break;
                case "defaultChecked":
                  $ = Y;
                  break;
                case "value":
                  u = Y;
                  break;
                case "defaultValue":
                  y = Y;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (Y != null)
                    throw Error(o(137, t));
                  break;
                default:
                  Ge(e, t, l, Y, n, null);
              }
          }
        Yd(
          e,
          u,
          y,
          T,
          $,
          p,
          c,
          !1
        );
        return;
      case "select":
        Ne("invalid", e), l = p = u = null;
        for (c in n)
          if (n.hasOwnProperty(c) && (y = n[c], y != null))
            switch (c) {
              case "value":
                u = y;
                break;
              case "defaultValue":
                p = y;
                break;
              case "multiple":
                l = y;
              default:
                Ge(e, t, c, y, n, null);
            }
        t = u, n = p, e.multiple = !!l, t != null ? vs(e, !!l, t, !1) : n != null && vs(e, !!l, n, !0);
        return;
      case "textarea":
        Ne("invalid", e), u = c = l = null;
        for (p in n)
          if (n.hasOwnProperty(p) && (y = n[p], y != null))
            switch (p) {
              case "value":
                l = y;
                break;
              case "defaultValue":
                c = y;
                break;
              case "children":
                u = y;
                break;
              case "dangerouslySetInnerHTML":
                if (y != null) throw Error(o(91));
                break;
              default:
                Ge(e, t, p, y, n, null);
            }
        Qd(e, l, c, u);
        return;
      case "option":
        for (T in n)
          if (n.hasOwnProperty(T) && (l = n[T], l != null))
            switch (T) {
              case "selected":
                e.selected = l && typeof l != "function" && typeof l != "symbol";
                break;
              default:
                Ge(e, t, T, l, n, null);
            }
        return;
      case "dialog":
        Ne("beforetoggle", e), Ne("toggle", e), Ne("cancel", e), Ne("close", e);
        break;
      case "iframe":
      case "object":
        Ne("load", e);
        break;
      case "video":
      case "audio":
        for (l = 0; l < ql.length; l++)
          Ne(ql[l], e);
        break;
      case "image":
        Ne("error", e), Ne("load", e);
        break;
      case "details":
        Ne("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        Ne("error", e), Ne("load", e);
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
        for ($ in n)
          if (n.hasOwnProperty($) && (l = n[$], l != null))
            switch ($) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(o(137, t));
              default:
                Ge(e, t, $, l, n, null);
            }
        return;
      default:
        if (Ec(t)) {
          for (Y in n)
            n.hasOwnProperty(Y) && (l = n[Y], l !== void 0 && pu(
              e,
              t,
              Y,
              l,
              n,
              void 0
            ));
          return;
        }
    }
    for (y in n)
      n.hasOwnProperty(y) && (l = n[y], l != null && Ge(e, t, y, l, n, null));
  }
  function Ev(e, t, n, l) {
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
        var c = null, u = null, p = null, y = null, T = null, $ = null, Y = null;
        for (V in n) {
          var J = n[V];
          if (n.hasOwnProperty(V) && J != null)
            switch (V) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                T = J;
              default:
                l.hasOwnProperty(V) || Ge(e, t, V, null, l, J);
            }
        }
        for (var B in l) {
          var V = l[B];
          if (J = n[B], l.hasOwnProperty(B) && (V != null || J != null))
            switch (B) {
              case "type":
                u = V;
                break;
              case "name":
                c = V;
                break;
              case "checked":
                $ = V;
                break;
              case "defaultChecked":
                Y = V;
                break;
              case "value":
                p = V;
                break;
              case "defaultValue":
                y = V;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (V != null)
                  throw Error(o(137, t));
                break;
              default:
                V !== J && Ge(
                  e,
                  t,
                  B,
                  V,
                  l,
                  J
                );
            }
        }
        Nc(
          e,
          p,
          y,
          T,
          $,
          Y,
          u,
          c
        );
        return;
      case "select":
        V = p = y = B = null;
        for (u in n)
          if (T = n[u], n.hasOwnProperty(u) && T != null)
            switch (u) {
              case "value":
                break;
              case "multiple":
                V = T;
              default:
                l.hasOwnProperty(u) || Ge(
                  e,
                  t,
                  u,
                  null,
                  l,
                  T
                );
            }
        for (c in l)
          if (u = l[c], T = n[c], l.hasOwnProperty(c) && (u != null || T != null))
            switch (c) {
              case "value":
                B = u;
                break;
              case "defaultValue":
                y = u;
                break;
              case "multiple":
                p = u;
              default:
                u !== T && Ge(
                  e,
                  t,
                  c,
                  u,
                  l,
                  T
                );
            }
        t = y, n = p, l = V, B != null ? vs(e, !!n, B, !1) : !!l != !!n && (t != null ? vs(e, !!n, t, !0) : vs(e, !!n, n ? [] : "", !1));
        return;
      case "textarea":
        V = B = null;
        for (y in n)
          if (c = n[y], n.hasOwnProperty(y) && c != null && !l.hasOwnProperty(y))
            switch (y) {
              case "value":
                break;
              case "children":
                break;
              default:
                Ge(e, t, y, null, l, c);
            }
        for (p in l)
          if (c = l[p], u = n[p], l.hasOwnProperty(p) && (c != null || u != null))
            switch (p) {
              case "value":
                B = c;
                break;
              case "defaultValue":
                V = c;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (c != null) throw Error(o(91));
                break;
              default:
                c !== u && Ge(e, t, p, c, l, u);
            }
        Xd(e, B, V);
        return;
      case "option":
        for (var ue in n)
          if (B = n[ue], n.hasOwnProperty(ue) && B != null && !l.hasOwnProperty(ue))
            switch (ue) {
              case "selected":
                e.selected = !1;
                break;
              default:
                Ge(
                  e,
                  t,
                  ue,
                  null,
                  l,
                  B
                );
            }
        for (T in l)
          if (B = l[T], V = n[T], l.hasOwnProperty(T) && B !== V && (B != null || V != null))
            switch (T) {
              case "selected":
                e.selected = B && typeof B != "function" && typeof B != "symbol";
                break;
              default:
                Ge(
                  e,
                  t,
                  T,
                  B,
                  l,
                  V
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
        for (var be in n)
          B = n[be], n.hasOwnProperty(be) && B != null && !l.hasOwnProperty(be) && Ge(e, t, be, null, l, B);
        for ($ in l)
          if (B = l[$], V = n[$], l.hasOwnProperty($) && B !== V && (B != null || V != null))
            switch ($) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (B != null)
                  throw Error(o(137, t));
                break;
              default:
                Ge(
                  e,
                  t,
                  $,
                  B,
                  l,
                  V
                );
            }
        return;
      default:
        if (Ec(t)) {
          for (var Ve in n)
            B = n[Ve], n.hasOwnProperty(Ve) && B !== void 0 && !l.hasOwnProperty(Ve) && pu(
              e,
              t,
              Ve,
              void 0,
              l,
              B
            );
          for (Y in l)
            B = l[Y], V = n[Y], !l.hasOwnProperty(Y) || B === V || B === void 0 && V === void 0 || pu(
              e,
              t,
              Y,
              B,
              l,
              V
            );
          return;
        }
    }
    for (var O in n)
      B = n[O], n.hasOwnProperty(O) && B != null && !l.hasOwnProperty(O) && Ge(e, t, O, null, l, B);
    for (J in l)
      B = l[J], V = n[J], !l.hasOwnProperty(J) || B === V || B == null && V == null || Ge(e, t, J, B, l, V);
  }
  function Pm(e) {
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
  function Mv() {
    if (typeof performance.getEntriesByType == "function") {
      for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), l = 0; l < n.length; l++) {
        var c = n[l], u = c.transferSize, p = c.initiatorType, y = c.duration;
        if (u && y && Pm(p)) {
          for (p = 0, y = c.responseEnd, l += 1; l < n.length; l++) {
            var T = n[l], $ = T.startTime;
            if ($ > y) break;
            var Y = T.transferSize, J = T.initiatorType;
            Y && Pm(J) && (T = T.responseEnd, p += Y * (T < y ? 1 : (y - $) / (T - $)));
          }
          if (--l, t += 8 * (u + p) / (c.duration / 1e3), e++, 10 < e) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
  }
  var _u = null, bu = null;
  function _r(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function Wm(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Im(e, t) {
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
  function gu(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var vu = null;
  function Tv() {
    var e = window.event;
    return e && e.type === "popstate" ? e === vu ? !1 : (vu = e, !0) : (vu = null, !1);
  }
  var ep = typeof setTimeout == "function" ? setTimeout : void 0, Rv = typeof clearTimeout == "function" ? clearTimeout : void 0, tp = typeof Promise == "function" ? Promise : void 0, Av = typeof queueMicrotask == "function" ? queueMicrotask : typeof tp < "u" ? function(e) {
    return tp.resolve(null).then(e).catch(zv);
  } : ep;
  function zv(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function ja(e) {
    return e === "head";
  }
  function np(e, t) {
    var n = t, l = 0;
    do {
      var c = n.nextSibling;
      if (e.removeChild(n), c && c.nodeType === 8)
        if (n = c.data, n === "/$" || n === "/&") {
          if (l === 0) {
            e.removeChild(c), Ps(t);
            return;
          }
          l--;
        } else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&")
          l++;
        else if (n === "html")
          Xl(e.ownerDocument.documentElement);
        else if (n === "head") {
          n = e.ownerDocument.head, Xl(n);
          for (var u = n.firstChild; u; ) {
            var p = u.nextSibling, y = u.nodeName;
            u[ul] || y === "SCRIPT" || y === "STYLE" || y === "LINK" && u.rel.toLowerCase() === "stylesheet" || n.removeChild(u), u = p;
          }
        } else
          n === "body" && Xl(e.ownerDocument.body);
      n = c;
    } while (n);
    Ps(t);
  }
  function ap(e, t) {
    var n = e;
    e = 0;
    do {
      var l = n.nextSibling;
      if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), l && l.nodeType === 8)
        if (n = l.data, n === "/$") {
          if (e === 0) break;
          e--;
        } else
          n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || e++;
      n = l;
    } while (n);
  }
  function xu(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var n = t;
      switch (t = t.nextSibling, n.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          xu(n), Sc(n);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (n.rel.toLowerCase() === "stylesheet") continue;
      }
      e.removeChild(n);
    }
  }
  function Ov(e, t, n, l) {
    for (; e.nodeType === 1; ) {
      var c = n;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!l && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (l) {
        if (!e[ul])
          switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (u = e.getAttribute("rel"), u === "stylesheet" && e.hasAttribute("data-precedence"))
                break;
              if (u !== c.rel || e.getAttribute("href") !== (c.href == null || c.href === "" ? null : c.href) || e.getAttribute("crossorigin") !== (c.crossOrigin == null ? null : c.crossOrigin) || e.getAttribute("title") !== (c.title == null ? null : c.title))
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (u = e.getAttribute("src"), (u !== (c.src == null ? null : c.src) || e.getAttribute("type") !== (c.type == null ? null : c.type) || e.getAttribute("crossorigin") !== (c.crossOrigin == null ? null : c.crossOrigin)) && u && e.hasAttribute("async") && !e.hasAttribute("itemprop"))
                break;
              return e;
            default:
              return e;
          }
      } else if (t === "input" && e.type === "hidden") {
        var u = c.name == null ? null : "" + c.name;
        if (c.type === "hidden" && e.getAttribute("name") === u)
          return e;
      } else return e;
      if (e = pn(e.nextSibling), e === null) break;
    }
    return null;
  }
  function Dv(e, t, n) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = pn(e.nextSibling), e === null)) return null;
    return e;
  }
  function sp(e, t) {
    for (; e.nodeType !== 8; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = pn(e.nextSibling), e === null)) return null;
    return e;
  }
  function yu(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function wu(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
  }
  function Hv(e, t) {
    var n = e.ownerDocument;
    if (e.data === "$~") e._reactRetry = t;
    else if (e.data !== "$?" || n.readyState !== "loading")
      t();
    else {
      var l = function() {
        t(), n.removeEventListener("DOMContentLoaded", l);
      };
      n.addEventListener("DOMContentLoaded", l), e._reactRetry = l;
    }
  }
  function pn(e) {
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
  var ju = null;
  function lp(e) {
    e = e.nextSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === "/$" || n === "/&") {
          if (t === 0)
            return pn(e.nextSibling);
          t--;
        } else
          n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function ip(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
          if (t === 0) return e;
          t--;
        } else n !== "/$" && n !== "/&" || t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  function rp(e, t, n) {
    switch (t = _r(n), e) {
      case "html":
        if (e = t.documentElement, !e) throw Error(o(452));
        return e;
      case "head":
        if (e = t.head, !e) throw Error(o(453));
        return e;
      case "body":
        if (e = t.body, !e) throw Error(o(454));
        return e;
      default:
        throw Error(o(451));
    }
  }
  function Xl(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    Sc(e);
  }
  var _n = /* @__PURE__ */ new Map(), cp = /* @__PURE__ */ new Set();
  function br(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var Wn = D.d;
  D.d = {
    f: Lv,
    r: $v,
    D: Uv,
    C: Bv,
    L: Fv,
    m: Gv,
    X: qv,
    S: Vv,
    M: Yv
  };
  function Lv() {
    var e = Wn.f(), t = cr();
    return e || t;
  }
  function $v(e) {
    var t = _s(e);
    t !== null && t.tag === 5 && t.type === "form" ? kf(t) : Wn.r(e);
  }
  var Zs = typeof document > "u" ? null : document;
  function op(e, t, n) {
    var l = Zs;
    if (l && typeof t == "string" && t) {
      var c = cn(t);
      c = 'link[rel="' + e + '"][href="' + c + '"]', typeof n == "string" && (c += '[crossorigin="' + n + '"]'), cp.has(c) || (cp.add(c), e = { rel: e, crossOrigin: n, href: t }, l.querySelector(c) === null && (t = l.createElement("link"), jt(t, "link", e), bt(t), l.head.appendChild(t)));
    }
  }
  function Uv(e) {
    Wn.D(e), op("dns-prefetch", e, null);
  }
  function Bv(e, t) {
    Wn.C(e, t), op("preconnect", e, t);
  }
  function Fv(e, t, n) {
    Wn.L(e, t, n);
    var l = Zs;
    if (l && e && t) {
      var c = 'link[rel="preload"][as="' + cn(t) + '"]';
      t === "image" && n && n.imageSrcSet ? (c += '[imagesrcset="' + cn(
        n.imageSrcSet
      ) + '"]', typeof n.imageSizes == "string" && (c += '[imagesizes="' + cn(
        n.imageSizes
      ) + '"]')) : c += '[href="' + cn(e) + '"]';
      var u = c;
      switch (t) {
        case "style":
          u = Ks(e);
          break;
        case "script":
          u = Js(e);
      }
      _n.has(u) || (e = g(
        {
          rel: "preload",
          href: t === "image" && n && n.imageSrcSet ? void 0 : e,
          as: t
        },
        n
      ), _n.set(u, e), l.querySelector(c) !== null || t === "style" && l.querySelector(Ql(u)) || t === "script" && l.querySelector(Zl(u)) || (t = l.createElement("link"), jt(t, "link", e), bt(t), l.head.appendChild(t)));
    }
  }
  function Gv(e, t) {
    Wn.m(e, t);
    var n = Zs;
    if (n && e) {
      var l = t && typeof t.as == "string" ? t.as : "script", c = 'link[rel="modulepreload"][as="' + cn(l) + '"][href="' + cn(e) + '"]', u = c;
      switch (l) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          u = Js(e);
      }
      if (!_n.has(u) && (e = g({ rel: "modulepreload", href: e }, t), _n.set(u, e), n.querySelector(c) === null)) {
        switch (l) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (n.querySelector(Zl(u)))
              return;
        }
        l = n.createElement("link"), jt(l, "link", e), bt(l), n.head.appendChild(l);
      }
    }
  }
  function Vv(e, t, n) {
    Wn.S(e, t, n);
    var l = Zs;
    if (l && e) {
      var c = bs(l).hoistableStyles, u = Ks(e);
      t = t || "default";
      var p = c.get(u);
      if (!p) {
        var y = { loading: 0, preload: null };
        if (p = l.querySelector(
          Ql(u)
        ))
          y.loading = 5;
        else {
          e = g(
            { rel: "stylesheet", href: e, "data-precedence": t },
            n
          ), (n = _n.get(u)) && Su(e, n);
          var T = p = l.createElement("link");
          bt(T), jt(T, "link", e), T._p = new Promise(function($, Y) {
            T.onload = $, T.onerror = Y;
          }), T.addEventListener("load", function() {
            y.loading |= 1;
          }), T.addEventListener("error", function() {
            y.loading |= 2;
          }), y.loading |= 4, gr(p, t, l);
        }
        p = {
          type: "stylesheet",
          instance: p,
          count: 1,
          state: y
        }, c.set(u, p);
      }
    }
  }
  function qv(e, t) {
    Wn.X(e, t);
    var n = Zs;
    if (n && e) {
      var l = bs(n).hoistableScripts, c = Js(e), u = l.get(c);
      u || (u = n.querySelector(Zl(c)), u || (e = g({ src: e, async: !0 }, t), (t = _n.get(c)) && ku(e, t), u = n.createElement("script"), bt(u), jt(u, "link", e), n.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, l.set(c, u));
    }
  }
  function Yv(e, t) {
    Wn.M(e, t);
    var n = Zs;
    if (n && e) {
      var l = bs(n).hoistableScripts, c = Js(e), u = l.get(c);
      u || (u = n.querySelector(Zl(c)), u || (e = g({ src: e, async: !0, type: "module" }, t), (t = _n.get(c)) && ku(e, t), u = n.createElement("script"), bt(u), jt(u, "link", e), n.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, l.set(c, u));
    }
  }
  function up(e, t, n, l) {
    var c = (c = fe.current) ? br(c) : null;
    if (!c) throw Error(o(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof n.precedence == "string" && typeof n.href == "string" ? (t = Ks(n.href), n = bs(
          c
        ).hoistableStyles, l = n.get(t), l || (l = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, n.set(t, l)), l) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
          e = Ks(n.href);
          var u = bs(
            c
          ).hoistableStyles, p = u.get(e);
          if (p || (c = c.ownerDocument || c, p = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, u.set(e, p), (u = c.querySelector(
            Ql(e)
          )) && !u._p && (p.instance = u, p.state.loading = 5), _n.has(e) || (n = {
            rel: "preload",
            as: "style",
            href: n.href,
            crossOrigin: n.crossOrigin,
            integrity: n.integrity,
            media: n.media,
            hrefLang: n.hrefLang,
            referrerPolicy: n.referrerPolicy
          }, _n.set(e, n), u || Xv(
            c,
            e,
            n,
            p.state
          ))), t && l === null)
            throw Error(o(528, ""));
          return p;
        }
        if (t && l !== null)
          throw Error(o(529, ""));
        return null;
      case "script":
        return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Js(n), n = bs(
          c
        ).hoistableScripts, l = n.get(t), l || (l = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, n.set(t, l)), l) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(o(444, e));
    }
  }
  function Ks(e) {
    return 'href="' + cn(e) + '"';
  }
  function Ql(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function dp(e) {
    return g({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function Xv(e, t, n, l) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? l.loading = 1 : (t = e.createElement("link"), l.preload = t, t.addEventListener("load", function() {
      return l.loading |= 1;
    }), t.addEventListener("error", function() {
      return l.loading |= 2;
    }), jt(t, "link", n), bt(t), e.head.appendChild(t));
  }
  function Js(e) {
    return '[src="' + cn(e) + '"]';
  }
  function Zl(e) {
    return "script[async]" + e;
  }
  function hp(e, t, n) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var l = e.querySelector(
            'style[data-href~="' + cn(n.href) + '"]'
          );
          if (l)
            return t.instance = l, bt(l), l;
          var c = g({}, n, {
            "data-href": n.href,
            "data-precedence": n.precedence,
            href: null,
            precedence: null
          });
          return l = (e.ownerDocument || e).createElement(
            "style"
          ), bt(l), jt(l, "style", c), gr(l, n.precedence, e), t.instance = l;
        case "stylesheet":
          c = Ks(n.href);
          var u = e.querySelector(
            Ql(c)
          );
          if (u)
            return t.state.loading |= 4, t.instance = u, bt(u), u;
          l = dp(n), (c = _n.get(c)) && Su(l, c), u = (e.ownerDocument || e).createElement("link"), bt(u);
          var p = u;
          return p._p = new Promise(function(y, T) {
            p.onload = y, p.onerror = T;
          }), jt(u, "link", l), t.state.loading |= 4, gr(u, n.precedence, e), t.instance = u;
        case "script":
          return u = Js(n.src), (c = e.querySelector(
            Zl(u)
          )) ? (t.instance = c, bt(c), c) : (l = n, (c = _n.get(u)) && (l = g({}, n), ku(l, c)), e = e.ownerDocument || e, c = e.createElement("script"), bt(c), jt(c, "link", l), e.head.appendChild(c), t.instance = c);
        case "void":
          return null;
        default:
          throw Error(o(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (l = t.instance, t.state.loading |= 4, gr(l, n.precedence, e));
    return t.instance;
  }
  function gr(e, t, n) {
    for (var l = n.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), c = l.length ? l[l.length - 1] : null, u = c, p = 0; p < l.length; p++) {
      var y = l[p];
      if (y.dataset.precedence === t) u = y;
      else if (u !== c) break;
    }
    u ? u.parentNode.insertBefore(e, u.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
  }
  function Su(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function ku(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var vr = null;
  function fp(e, t, n) {
    if (vr === null) {
      var l = /* @__PURE__ */ new Map(), c = vr = /* @__PURE__ */ new Map();
      c.set(n, l);
    } else
      c = vr, l = c.get(n), l || (l = /* @__PURE__ */ new Map(), c.set(n, l));
    if (l.has(e)) return l;
    for (l.set(e, null), n = n.getElementsByTagName(e), c = 0; c < n.length; c++) {
      var u = n[c];
      if (!(u[ul] || u[vt] || e === "link" && u.getAttribute("rel") === "stylesheet") && u.namespaceURI !== "http://www.w3.org/2000/svg") {
        var p = u.getAttribute(t) || "";
        p = e + p;
        var y = l.get(p);
        y ? y.push(u) : l.set(p, [u]);
      }
    }
    return l;
  }
  function mp(e, t, n) {
    e = e.ownerDocument || e, e.head.insertBefore(
      n,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function Qv(e, t, n) {
    if (n === 1 || t.itemProp != null) return !1;
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
  function pp(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function Zv(e, t, n, l) {
    if (n.type === "stylesheet" && (typeof l.media != "string" || matchMedia(l.media).matches !== !1) && (n.state.loading & 4) === 0) {
      if (n.instance === null) {
        var c = Ks(l.href), u = t.querySelector(
          Ql(c)
        );
        if (u) {
          t = u._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = xr.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = u, bt(u);
          return;
        }
        u = t.ownerDocument || t, l = dp(l), (c = _n.get(c)) && Su(l, c), u = u.createElement("link"), bt(u);
        var p = u;
        p._p = new Promise(function(y, T) {
          p.onload = y, p.onerror = T;
        }), jt(u, "link", l), n.instance = u;
      }
      e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && (n.state.loading & 3) === 0 && (e.count++, n = xr.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
    }
  }
  var Nu = 0;
  function Kv(e, t) {
    return e.stylesheets && e.count === 0 && wr(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
      var l = setTimeout(function() {
        if (e.stylesheets && wr(e, e.stylesheets), e.unsuspend) {
          var u = e.unsuspend;
          e.unsuspend = null, u();
        }
      }, 6e4 + t);
      0 < e.imgBytes && Nu === 0 && (Nu = 62500 * Mv());
      var c = setTimeout(
        function() {
          if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && wr(e, e.stylesheets), e.unsuspend)) {
            var u = e.unsuspend;
            e.unsuspend = null, u();
          }
        },
        (e.imgBytes > Nu ? 50 : 800) + t
      );
      return e.unsuspend = n, function() {
        e.unsuspend = null, clearTimeout(l), clearTimeout(c);
      };
    } : null;
  }
  function xr() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) wr(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var yr = null;
  function wr(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, yr = /* @__PURE__ */ new Map(), t.forEach(Jv, e), yr = null, xr.call(e));
  }
  function Jv(e, t) {
    if (!(t.state.loading & 4)) {
      var n = yr.get(e);
      if (n) var l = n.get(null);
      else {
        n = /* @__PURE__ */ new Map(), yr.set(e, n);
        for (var c = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), u = 0; u < c.length; u++) {
          var p = c[u];
          (p.nodeName === "LINK" || p.getAttribute("media") !== "not all") && (n.set(p.dataset.precedence, p), l = p);
        }
        l && n.set(null, l);
      }
      c = t.instance, p = c.getAttribute("data-precedence"), u = n.get(p) || l, u === l && n.set(null, c), n.set(p, c), this.count++, l = xr.bind(this), c.addEventListener("load", l), c.addEventListener("error", l), u ? u.parentNode.insertBefore(c, u.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(c, e.firstChild)), t.state.loading |= 4;
    }
  }
  var Kl = {
    $$typeof: U,
    Provider: null,
    Consumer: null,
    _currentValue: q,
    _currentValue2: q,
    _threadCount: 0
  };
  function Pv(e, t, n, l, c, u, p, y, T) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = xc(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = xc(0), this.hiddenUpdates = xc(null), this.identifierPrefix = l, this.onUncaughtError = c, this.onCaughtError = u, this.onRecoverableError = p, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = T, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function _p(e, t, n, l, c, u, p, y, T, $, Y, J) {
    return e = new Pv(
      e,
      t,
      n,
      p,
      T,
      $,
      Y,
      J,
      y
    ), t = 1, u === !0 && (t |= 24), u = Jt(3, null, null, t), e.current = u, u.stateNode = e, t = so(), t.refCount++, e.pooledCache = t, t.refCount++, u.memoizedState = {
      element: l,
      isDehydrated: n,
      cache: t
    }, co(u), e;
  }
  function bp(e) {
    return e ? (e = Cs, e) : Cs;
  }
  function gp(e, t, n, l, c, u) {
    c = bp(c), l.context === null ? l.context = c : l.pendingContext = c, l = ha(t), l.payload = { element: n }, u = u === void 0 ? null : u, u !== null && (l.callback = u), n = fa(e, l, t), n !== null && (Yt(n, e, t), Cl(n, e, t));
  }
  function vp(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Cu(e, t) {
    vp(e, t), (e = e.alternate) && vp(e, t);
  }
  function xp(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Ya(e, 67108864);
      t !== null && Yt(t, e, 67108864), Cu(e, 67108864);
    }
  }
  function yp(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = tn();
      t = yc(t);
      var n = Ya(e, t);
      n !== null && Yt(n, e, t), Cu(e, t);
    }
  }
  var jr = !0;
  function Wv(e, t, n, l) {
    var c = R.T;
    R.T = null;
    var u = D.p;
    try {
      D.p = 2, Eu(e, t, n, l);
    } finally {
      D.p = u, R.T = c;
    }
  }
  function Iv(e, t, n, l) {
    var c = R.T;
    R.T = null;
    var u = D.p;
    try {
      D.p = 8, Eu(e, t, n, l);
    } finally {
      D.p = u, R.T = c;
    }
  }
  function Eu(e, t, n, l) {
    if (jr) {
      var c = Mu(l);
      if (c === null)
        mu(
          e,
          t,
          l,
          Sr,
          n
        ), jp(e, l);
      else if (tx(
        c,
        e,
        t,
        n,
        l
      ))
        l.stopPropagation();
      else if (jp(e, l), t & 4 && -1 < ex.indexOf(e)) {
        for (; c !== null; ) {
          var u = _s(c);
          if (u !== null)
            switch (u.tag) {
              case 3:
                if (u = u.stateNode, u.current.memoizedState.isDehydrated) {
                  var p = Ba(u.pendingLanes);
                  if (p !== 0) {
                    var y = u;
                    for (y.pendingLanes |= 2, y.entangledLanes |= 2; p; ) {
                      var T = 1 << 31 - Ct(p);
                      y.entanglements[1] |= T, p &= ~T;
                    }
                    Tn(u), (He & 6) === 0 && (ir = st() + 500, Vl(0));
                  }
                }
                break;
              case 31:
              case 13:
                y = Ya(u, 2), y !== null && Yt(y, u, 2), cr(), Cu(u, 2);
            }
          if (u = Mu(l), u === null && mu(
            e,
            t,
            l,
            Sr,
            n
          ), u === c) break;
          c = u;
        }
        c !== null && l.stopPropagation();
      } else
        mu(
          e,
          t,
          l,
          null,
          n
        );
    }
  }
  function Mu(e) {
    return e = Tc(e), Tu(e);
  }
  var Sr = null;
  function Tu(e) {
    if (Sr = null, e = ps(e), e !== null) {
      var t = h(e);
      if (t === null) e = null;
      else {
        var n = t.tag;
        if (n === 13) {
          if (e = f(t), e !== null) return e;
          e = null;
        } else if (n === 31) {
          if (e = m(t), e !== null) return e;
          e = null;
        } else if (n === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return Sr = e, null;
  }
  function wp(e) {
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
        switch (il()) {
          case Re:
            return 2;
          case ds:
            return 8;
          case hs:
          case _c:
            return 32;
          case mi:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Ru = !1, Sa = null, ka = null, Na = null, Jl = /* @__PURE__ */ new Map(), Pl = /* @__PURE__ */ new Map(), Ca = [], ex = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function jp(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Sa = null;
        break;
      case "dragenter":
      case "dragleave":
        ka = null;
        break;
      case "mouseover":
      case "mouseout":
        Na = null;
        break;
      case "pointerover":
      case "pointerout":
        Jl.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Pl.delete(t.pointerId);
    }
  }
  function Wl(e, t, n, l, c, u) {
    return e === null || e.nativeEvent !== u ? (e = {
      blockedOn: t,
      domEventName: n,
      eventSystemFlags: l,
      nativeEvent: u,
      targetContainers: [c]
    }, t !== null && (t = _s(t), t !== null && xp(t)), e) : (e.eventSystemFlags |= l, t = e.targetContainers, c !== null && t.indexOf(c) === -1 && t.push(c), e);
  }
  function tx(e, t, n, l, c) {
    switch (t) {
      case "focusin":
        return Sa = Wl(
          Sa,
          e,
          t,
          n,
          l,
          c
        ), !0;
      case "dragenter":
        return ka = Wl(
          ka,
          e,
          t,
          n,
          l,
          c
        ), !0;
      case "mouseover":
        return Na = Wl(
          Na,
          e,
          t,
          n,
          l,
          c
        ), !0;
      case "pointerover":
        var u = c.pointerId;
        return Jl.set(
          u,
          Wl(
            Jl.get(u) || null,
            e,
            t,
            n,
            l,
            c
          )
        ), !0;
      case "gotpointercapture":
        return u = c.pointerId, Pl.set(
          u,
          Wl(
            Pl.get(u) || null,
            e,
            t,
            n,
            l,
            c
          )
        ), !0;
    }
    return !1;
  }
  function Sp(e) {
    var t = ps(e.target);
    if (t !== null) {
      var n = h(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = f(n), t !== null) {
            e.blockedOn = t, Ld(e.priority, function() {
              yp(n);
            });
            return;
          }
        } else if (t === 31) {
          if (t = m(n), t !== null) {
            e.blockedOn = t, Ld(e.priority, function() {
              yp(n);
            });
            return;
          }
        } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function kr(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = Mu(e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var l = new n.constructor(
          n.type,
          n
        );
        Mc = l, n.target.dispatchEvent(l), Mc = null;
      } else
        return t = _s(n), t !== null && xp(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function kp(e, t, n) {
    kr(e) && n.delete(t);
  }
  function nx() {
    Ru = !1, Sa !== null && kr(Sa) && (Sa = null), ka !== null && kr(ka) && (ka = null), Na !== null && kr(Na) && (Na = null), Jl.forEach(kp), Pl.forEach(kp);
  }
  function Nr(e, t) {
    e.blockedOn === t && (e.blockedOn = null, Ru || (Ru = !0, a.unstable_scheduleCallback(
      a.unstable_NormalPriority,
      nx
    )));
  }
  var Cr = null;
  function Np(e) {
    Cr !== e && (Cr = e, a.unstable_scheduleCallback(
      a.unstable_NormalPriority,
      function() {
        Cr === e && (Cr = null);
        for (var t = 0; t < e.length; t += 3) {
          var n = e[t], l = e[t + 1], c = e[t + 2];
          if (typeof l != "function") {
            if (Tu(l || n) === null)
              continue;
            break;
          }
          var u = _s(n);
          u !== null && (e.splice(t, 3), t -= 3, Mo(
            u,
            {
              pending: !0,
              data: c,
              method: n.method,
              action: l
            },
            l,
            c
          ));
        }
      }
    ));
  }
  function Ps(e) {
    function t(T) {
      return Nr(T, e);
    }
    Sa !== null && Nr(Sa, e), ka !== null && Nr(ka, e), Na !== null && Nr(Na, e), Jl.forEach(t), Pl.forEach(t);
    for (var n = 0; n < Ca.length; n++) {
      var l = Ca[n];
      l.blockedOn === e && (l.blockedOn = null);
    }
    for (; 0 < Ca.length && (n = Ca[0], n.blockedOn === null); )
      Sp(n), n.blockedOn === null && Ca.shift();
    if (n = (e.ownerDocument || e).$$reactFormReplay, n != null)
      for (l = 0; l < n.length; l += 3) {
        var c = n[l], u = n[l + 1], p = c[Ut] || null;
        if (typeof u == "function")
          p || Np(n);
        else if (p) {
          var y = null;
          if (u && u.hasAttribute("formAction")) {
            if (c = u, p = u[Ut] || null)
              y = p.formAction;
            else if (Tu(c) !== null) continue;
          } else y = p.action;
          typeof y == "function" ? n[l + 1] = y : (n.splice(l, 3), l -= 3), Np(n);
        }
      }
  }
  function Cp() {
    function e(u) {
      u.canIntercept && u.info === "react-transition" && u.intercept({
        handler: function() {
          return new Promise(function(p) {
            return c = p;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function t() {
      c !== null && (c(), c = null), l || setTimeout(n, 20);
    }
    function n() {
      if (!l && !navigation.transition) {
        var u = navigation.currentEntry;
        u && u.url != null && navigation.navigate(u.url, {
          state: u.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var l = !1, c = null;
      return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
        l = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), c !== null && (c(), c = null);
      };
    }
  }
  function Au(e) {
    this._internalRoot = e;
  }
  Er.prototype.render = Au.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(o(409));
    var n = t.current, l = tn();
    gp(n, l, e, t, null, null);
  }, Er.prototype.unmount = Au.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      gp(e.current, 2, null, e, null, null), cr(), t[ms] = null;
    }
  };
  function Er(e) {
    this._internalRoot = e;
  }
  Er.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Hd();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < Ca.length && t !== 0 && t < Ca[n].priority; n++) ;
      Ca.splice(n, 0, e), n === 0 && Sp(e);
    }
  };
  var Ep = i.version;
  if (Ep !== "19.2.8")
    throw Error(
      o(
        527,
        Ep,
        "19.2.8"
      )
    );
  D.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(o(188)) : (e = Object.keys(e).join(","), Error(o(268, e)));
    return e = b(t), e = e !== null ? v(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var ax = {
    bundleType: 0,
    version: "19.2.8",
    rendererPackageName: "react-dom",
    currentDispatcherRef: R,
    reconcilerVersion: "19.2.8"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Mr = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Mr.isDisabled && Mr.supportsFiber)
      try {
        Ua = Mr.inject(
          ax
        ), zt = Mr;
      } catch {
      }
  }
  return ei.createRoot = function(e, t) {
    if (!d(e)) throw Error(o(299));
    var n = !1, l = "", c = Df, u = Hf, p = Lf;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (l = t.identifierPrefix), t.onUncaughtError !== void 0 && (c = t.onUncaughtError), t.onCaughtError !== void 0 && (u = t.onCaughtError), t.onRecoverableError !== void 0 && (p = t.onRecoverableError)), t = _p(
      e,
      1,
      !1,
      null,
      null,
      n,
      l,
      null,
      c,
      u,
      p,
      Cp
    ), e[ms] = t.current, fu(e), new Au(t);
  }, ei.hydrateRoot = function(e, t, n) {
    if (!d(e)) throw Error(o(299));
    var l = !1, c = "", u = Df, p = Hf, y = Lf, T = null;
    return n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (c = n.identifierPrefix), n.onUncaughtError !== void 0 && (u = n.onUncaughtError), n.onCaughtError !== void 0 && (p = n.onCaughtError), n.onRecoverableError !== void 0 && (y = n.onRecoverableError), n.formState !== void 0 && (T = n.formState)), t = _p(
      e,
      1,
      !0,
      t,
      n ?? null,
      l,
      c,
      T,
      u,
      p,
      y,
      Cp
    ), t.context = bp(null), n = t.current, l = tn(), l = yc(l), c = ha(l), c.callback = null, fa(n, c, l), n = l, t.current.lanes = n, ol(t, n), Tn(t), e[ms] = t.current, fu(e), new Er(t);
  }, ei.version = "19.2.8", ei;
}
var $p;
function px() {
  if ($p) return Du.exports;
  $p = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (i) {
        console.error(i);
      }
  }
  return a(), Du.exports = mx(), Du.exports;
}
var _x = px();
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
var id = /^(?:[a-z][a-z0-9+.-]*:|[\\/]{2})/i, C_ = /^[\\/]{2}/;
function bx(a, i) {
  return i + a.replace(/\\/g, "/");
}
var Up = "popstate";
function Bp(a) {
  return typeof a == "object" && a != null && "pathname" in a && "search" in a && "hash" in a && "state" in a && "key" in a;
}
function gx(a = {}) {
  function i(d, h) {
    let {
      pathname: f = "/",
      search: m = "",
      hash: _ = ""
    } = cs(d.location.hash.substring(1));
    return !f.startsWith("/") && !f.startsWith(".") && (f = "/" + f), Ju(
      "",
      { pathname: f, search: m, hash: _ },
      // state defaults to `null` because `window.history.state` does
      h.state && h.state.usr || null,
      h.state && h.state.key || "default"
    );
  }
  function r(d, h) {
    let f = d.document.querySelector("base"), m = "";
    if (f && f.getAttribute("href")) {
      let _ = d.location.href, b = _.indexOf("#");
      m = b === -1 ? _ : _.slice(0, b);
    }
    return m + "#" + (typeof h == "string" ? h : li(h));
  }
  function o(d, h) {
    an(
      d.pathname.charAt(0) === "/",
      `relative pathnames are not supported in hash history.push(${JSON.stringify(
        h
      )})`
    );
  }
  return xx(
    i,
    r,
    o,
    a
  );
}
function Pe(a, i) {
  if (a === !1 || a === null || typeof a > "u")
    throw new Error(i);
}
function an(a, i) {
  if (!a) {
    typeof console < "u" && console.warn(i);
    try {
      throw new Error(i);
    } catch {
    }
  }
}
function vx() {
  return Math.random().toString(36).substring(2, 10);
}
function Fp(a, i) {
  return {
    usr: a.state,
    key: a.key,
    idx: i,
    masked: a.mask ? {
      pathname: a.pathname,
      search: a.search,
      hash: a.hash
    } : void 0
  };
}
function Ju(a, i, r = null, o, d) {
  return {
    pathname: typeof a == "string" ? a : a.pathname,
    search: "",
    hash: "",
    ...typeof i == "string" ? cs(i) : i,
    state: r,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: i && i.key || o || vx(),
    mask: d
  };
}
function li({
  pathname: a = "/",
  search: i = "",
  hash: r = ""
}) {
  return i && i !== "?" && (a += i.charAt(0) === "?" ? i : "?" + i), r && r !== "#" && (a += r.charAt(0) === "#" ? r : "#" + r), a;
}
function cs(a) {
  let i = {};
  if (a) {
    let r = a.indexOf("#");
    r >= 0 && (i.hash = a.substring(r), a = a.substring(0, r));
    let o = a.indexOf("?");
    o >= 0 && (i.search = a.substring(o), a = a.substring(0, o)), a && (i.pathname = a);
  }
  return i;
}
function xx(a, i, r, o = {}) {
  let { window: d = document.defaultView, v5Compat: h = !1 } = o, f = d.history, m = "POP", _ = null, b = v();
  b == null && (b = 0, f.replaceState({ ...f.state, idx: b }, ""));
  function v() {
    return (f.state || { idx: null }).idx;
  }
  function g() {
    m = "POP";
    let C = v(), E = C == null ? null : C - b;
    b = C, _ && _({ action: m, location: N.location, delta: E });
  }
  function j(C, E) {
    m = "PUSH";
    let z = Bp(C) ? C : Ju(N.location, C, E);
    r && r(z, C), b = v() + 1;
    let U = Fp(z, b), Q = N.createHref(z.mask || z);
    try {
      f.pushState(U, "", Q);
    } catch (X) {
      if (X instanceof DOMException && X.name === "DataCloneError")
        throw X;
      d.location.assign(Q);
    }
    h && _ && _({ action: m, location: N.location, delta: 1 });
  }
  function w(C, E) {
    m = "REPLACE";
    let z = Bp(C) ? C : Ju(N.location, C, E);
    r && r(z, C), b = v();
    let U = Fp(z, b), Q = N.createHref(z.mask || z);
    f.replaceState(U, "", Q), h && _ && _({ action: m, location: N.location, delta: 0 });
  }
  function S(C) {
    return yx(d, C);
  }
  let N = {
    get action() {
      return m;
    },
    get location() {
      return a(d, f);
    },
    listen(C) {
      if (_)
        throw new Error("A history only accepts one active listener");
      return d.addEventListener(Up, g), _ = C, () => {
        d.removeEventListener(Up, g), _ = null;
      };
    },
    createHref(C) {
      return i(d, C);
    },
    createURL: S,
    encodeLocation(C) {
      let E = S(C);
      return {
        pathname: E.pathname,
        search: E.search,
        hash: E.hash
      };
    },
    push: j,
    replace: w,
    go(C) {
      return f.go(C);
    }
  };
  return N;
}
function yx(a, i, r = !1) {
  let o = "http://localhost";
  a && (o = a.location.origin !== "null" ? a.location.origin : a.location.href), Pe(o, "No window.location.(origin|href) available to create URL");
  let d = typeof i == "string" ? i : li(i);
  return d = d.replace(/ $/, "%20"), !r && C_.test(d) && (d = o + d), new URL(d, o);
}
function E_(a, i, r = "/") {
  return wx(a, i, r, !1);
}
function wx(a, i, r, o, d) {
  let h = typeof i == "string" ? cs(i) : i, f = na(h.pathname || "/", r);
  if (f == null)
    return null;
  let m = jx(a), _ = null, b = Ox(f);
  for (let v = 0; _ == null && v < m.length; ++v)
    _ = zx(
      m[v],
      b,
      o
    );
  return _;
}
function jx(a) {
  let i = M_(a);
  return Sx(i), i;
}
function M_(a, i = [], r = [], o = "", d = !1) {
  let h = (f, m, _ = d, b) => {
    let v = {
      relativePath: b === void 0 ? f.path || "" : b,
      caseSensitive: f.caseSensitive === !0,
      childrenIndex: m,
      route: f
    };
    if (v.relativePath.startsWith("/")) {
      if (!v.relativePath.startsWith(o) && _)
        return;
      Pe(
        v.relativePath.startsWith(o),
        `Absolute route path "${v.relativePath}" nested under path "${o}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
      ), v.relativePath = v.relativePath.slice(o.length);
    }
    let g = Sn([o, v.relativePath]), j = r.concat(v);
    f.children && f.children.length > 0 && (Pe(
      // Our types know better, but runtime JS may not!
      // @ts-expect-error
      f.index !== !0,
      `Index routes must not have child routes. Please remove all child routes from route path "${g}".`
    ), M_(
      f.children,
      i,
      j,
      g,
      _
    )), !(f.path == null && !f.index) && i.push({
      path: g,
      score: Rx(g, f.index),
      routesMeta: j.map((w, S) => {
        let [N, C] = A_(
          w.relativePath,
          w.caseSensitive,
          S === j.length - 1
        );
        return {
          ...w,
          matcher: N,
          compiledParams: C
        };
      })
    });
  };
  return a.forEach((f, m) => {
    if (f.path === "" || !f.path?.includes("?"))
      h(f, m);
    else
      for (let _ of T_(f.path))
        h(f, m, !0, _);
  }), i;
}
function T_(a) {
  let i = a.split("/");
  if (i.length === 0) return [];
  let [r, ...o] = i, d = r.endsWith("?"), h = r.replace(/\?$/, "");
  if (o.length === 0)
    return d ? [h, ""] : [h];
  let f = T_(o.join("/")), m = [];
  return m.push(
    ...f.map(
      (_) => _ === "" ? h : [h, _].join("/")
    )
  ), d && m.push(...f), m.map(
    (_) => a.startsWith("/") && _ === "" ? "/" : _
  );
}
function Sx(a) {
  a.sort(
    (i, r) => i.score !== r.score ? r.score - i.score : Ax(
      i.routesMeta.map((o) => o.childrenIndex),
      r.routesMeta.map((o) => o.childrenIndex)
    )
  );
}
var kx = /^:[\w-]+$/, Nx = 3, Cx = 2, Ex = 1, Mx = 10, Tx = -2, Gp = (a) => a === "*";
function Rx(a, i) {
  let r = a.split("/"), o = r.length;
  return r.some(Gp) && (o += Tx), i && (o += Cx), r.filter((d) => !Gp(d)).reduce(
    (d, h) => d + (kx.test(h) ? Nx : h === "" ? Ex : Mx),
    o
  );
}
function Ax(a, i) {
  return a.length === i.length && a.slice(0, -1).every((o, d) => o === i[d]) ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    a[a.length - 1] - i[i.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function zx(a, i, r = !1) {
  let { routesMeta: o } = a, d = {}, h = "/", f = [];
  for (let m = 0; m < o.length; ++m) {
    let _ = o[m], b = m === o.length - 1, v = h === "/" ? i : i.slice(h.length) || "/", g = {
      path: _.relativePath,
      caseSensitive: _.caseSensitive,
      end: b
    }, j = (
      // Use precomputed matcher if it exists
      _.matcher && _.compiledParams ? R_(
        g,
        v,
        _.matcher,
        _.compiledParams
      ) : Zr(g, v)
    ), w = _.route;
    if (!j && b && r && !o[o.length - 1].route.index && (j = Zr(
      {
        path: _.relativePath,
        caseSensitive: _.caseSensitive,
        end: !1
      },
      v
    )), !j)
      return null;
    Object.assign(d, j.params), f.push({
      // TODO: Can this as be avoided?
      params: d,
      pathname: Sn([h, j.pathname]),
      pathnameBase: Lx(
        Sn([h, j.pathnameBase])
      ),
      route: w
    }), j.pathnameBase !== "/" && (h = Sn([h, j.pathnameBase]));
  }
  return f;
}
function Zr(a, i) {
  typeof a == "string" && (a = { path: a, caseSensitive: !1, end: !0 });
  let [r, o] = A_(
    a.path,
    a.caseSensitive,
    a.end
  );
  return R_(a, i, r, o);
}
function R_(a, i, r, o) {
  let d = i.match(r);
  if (!d) return null;
  let h = d[0], f = h.replace(/(.)\/+$/, "$1"), m = d.slice(1);
  return {
    params: o.reduce(
      (b, { paramName: v, isOptional: g }, j) => {
        if (v === "*") {
          let S = m[j] || "";
          f = h.slice(0, h.length - S.length).replace(/(.)\/+$/, "$1");
        }
        const w = m[j];
        return g && !w ? b[v] = void 0 : b[v] = (w || "").replace(/%2F/g, "/"), b;
      },
      {}
    ),
    pathname: h,
    pathnameBase: f,
    pattern: a
  };
}
function A_(a, i = !1, r = !0) {
  an(
    a === "*" || !a.endsWith("*") || a.endsWith("/*"),
    `Route path "${a}" will be treated as if it were "${a.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${a.replace(/\*$/, "/*")}".`
  );
  let o = [], d = "^" + a.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(
    /\/:([\w-]+)(\?)?/g,
    (f, m, _, b, v) => {
      if (o.push({ paramName: m, isOptional: _ != null }), _) {
        let g = v.charAt(b + f.length);
        return g && g !== "/" ? "/([^\\/]*)" : "(?:/([^\\/]*))?";
      }
      return "/([^\\/]+)";
    }
  ).replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
  return a.endsWith("*") ? (o.push({ paramName: "*" }), d += a === "*" || a === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$") : r ? d += "\\/*$" : a !== "" && a !== "/" && (d += "(?:(?=\\/|$))"), [new RegExp(d, i ? void 0 : "i"), o];
}
function Ox(a) {
  try {
    return a.split("/").map((i) => decodeURIComponent(i).replace(/\//g, "%2F")).join("/");
  } catch (i) {
    return an(
      !1,
      `The URL path "${a}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${i}).`
    ), a;
  }
}
function na(a, i) {
  if (i === "/") return a;
  if (!a.toLowerCase().startsWith(i.toLowerCase()))
    return null;
  let r = i.endsWith("/") ? i.length - 1 : i.length, o = a.charAt(r);
  return o && o !== "/" ? null : a.slice(r) || "/";
}
function Dx(a, i = "/") {
  let {
    pathname: r,
    search: o = "",
    hash: d = ""
  } = typeof a == "string" ? cs(a) : a, h;
  return r ? (r = z_(r), r.startsWith("/") ? h = Vp(r.substring(1), "/") : h = Vp(r, i)) : h = i, {
    pathname: h,
    search: $x(o),
    hash: Ux(d)
  };
}
function Vp(a, i) {
  let r = Kr(i).split("/");
  return a.split("/").forEach((d) => {
    d === ".." ? r.length > 1 && r.pop() : d !== "." && r.push(d);
  }), r.length > 1 ? r.join("/") : "/";
}
function Uu(a, i, r, o) {
  return `Cannot include a '${a}' character in a manually specified \`to.${i}\` field [${JSON.stringify(
    o
  )}].  Please separate it out to the \`to.${r}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function Hx(a) {
  return a.filter(
    (i, r) => r === 0 || i.route.path && i.route.path.length > 0
  );
}
function rd(a) {
  let i = Hx(a);
  return i.map(
    (r, o) => o === i.length - 1 ? r.pathname : r.pathnameBase
  );
}
function ac(a, i, r, o = !1) {
  let d;
  typeof a == "string" ? d = cs(a) : (d = { ...a }, Pe(
    !d.pathname || !d.pathname.includes("?"),
    Uu("?", "pathname", "search", d)
  ), Pe(
    !d.pathname || !d.pathname.includes("#"),
    Uu("#", "pathname", "hash", d)
  ), Pe(
    !d.search || !d.search.includes("#"),
    Uu("#", "search", "hash", d)
  ));
  let h = a === "" || d.pathname === "", f = h ? "/" : d.pathname, m;
  if (f == null)
    m = r;
  else {
    let g = i.length - 1;
    if (!o && f.startsWith("..")) {
      let j = f.split("/");
      for (; j[0] === ".."; )
        j.shift(), g -= 1;
      d.pathname = j.join("/");
    }
    m = g >= 0 ? i[g] : "/";
  }
  let _ = Dx(d, m), b = f && f !== "/" && f.endsWith("/"), v = (h || f === ".") && r.endsWith("/");
  return !_.pathname.endsWith("/") && (b || v) && (_.pathname += "/"), _;
}
var z_ = (a) => a.replace(/[\\/]{2,}/g, "/"), Sn = (a) => z_(a.join("/")), Kr = (a) => a.replace(/\/+$/, ""), Lx = (a) => Kr(a).replace(/^\/*/, "/"), $x = (a) => !a || a === "?" ? "" : a.startsWith("?") ? a : "?" + a, Ux = (a) => !a || a === "#" ? "" : a.startsWith("#") ? a : "#" + a, Bx = class {
  constructor(a, i, r, o = !1) {
    this.status = a, this.statusText = i || "", this.internal = o, r instanceof Error ? (this.data = r.toString(), this.error = r) : this.data = r;
  }
};
function Fx(a) {
  return a != null && typeof a.status == "number" && typeof a.statusText == "string" && typeof a.internal == "boolean" && "data" in a;
}
function Gx(a) {
  let i = a.map((r) => r.route.path).filter(Boolean);
  return Sn(i) || "/";
}
var O_ = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
function D_(a, i) {
  let r = a;
  if (typeof r != "string" || !id.test(r))
    return {
      absoluteURL: void 0,
      isExternal: !1,
      to: r
    };
  let o = r, d = !1;
  if (O_)
    try {
      let h = new URL(window.location.href), f = C_.test(r) ? new URL(bx(r, h.protocol)) : new URL(r), m = na(f.pathname, i);
      f.origin === h.origin && m != null ? r = m + f.search + f.hash : d = !0;
    } catch {
      an(
        !1,
        `<Link to="${r}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`
      );
    }
  return {
    absoluteURL: o,
    isExternal: d,
    to: r
  };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
var H_ = [
  "POST",
  "PUT",
  "PATCH",
  "DELETE"
];
new Set(
  H_
);
var Vx = [
  "GET",
  ...H_
];
new Set(Vx);
var qx = [
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
function Yx(a) {
  try {
    return qx.includes(new URL(a).protocol);
  } catch {
    return !1;
  }
}
var tl = x.createContext(null);
tl.displayName = "DataRouter";
var sc = x.createContext(null);
sc.displayName = "DataRouterState";
var L_ = x.createContext(!1);
function Xx() {
  return x.useContext(L_);
}
var $_ = x.createContext({
  isTransitioning: !1
});
$_.displayName = "ViewTransition";
var Qx = x.createContext(
  /* @__PURE__ */ new Map()
);
Qx.displayName = "Fetchers";
var Zx = x.createContext(null);
Zx.displayName = "Await";
var sn = x.createContext(
  null
);
sn.displayName = "Navigation";
var ri = x.createContext(
  null
);
ri.displayName = "Location";
var On = x.createContext({
  outlet: null,
  matches: [],
  isDataRoute: !1
});
On.displayName = "Route";
var cd = x.createContext(null);
cd.displayName = "RouteError";
var U_ = "REACT_ROUTER_ERROR", Kx = "REDIRECT", Jx = "ROUTE_ERROR_RESPONSE";
function Px(a) {
  if (a.startsWith(`${U_}:${Kx}:{`))
    try {
      let i = JSON.parse(a.slice(28));
      if (typeof i == "object" && i && typeof i.status == "number" && typeof i.statusText == "string" && typeof i.location == "string" && typeof i.reloadDocument == "boolean" && typeof i.replace == "boolean")
        return i;
    } catch {
    }
}
function Wx(a) {
  if (a.startsWith(
    `${U_}:${Jx}:{`
  ))
    try {
      let i = JSON.parse(a.slice(40));
      if (typeof i == "object" && i && typeof i.status == "number" && typeof i.statusText == "string")
        return new Bx(
          i.status,
          i.statusText,
          i.data
        );
    } catch {
    }
}
function Ix(a, { relative: i } = {}) {
  Pe(
    nl(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useHref() may be used only in the context of a <Router> component."
  );
  let { basename: r, navigator: o } = x.useContext(sn), { hash: d, pathname: h, search: f } = ci(a, { relative: i }), m = h;
  return r !== "/" && (m = h === "/" ? r : Sn([r, h])), o.createHref({ pathname: m, search: f, hash: d });
}
function nl() {
  return x.useContext(ri) != null;
}
function At() {
  return Pe(
    nl(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useLocation() may be used only in the context of a <Router> component."
  ), x.useContext(ri).location;
}
var B_ = "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function F_(a) {
  x.useContext(sn).static || x.useLayoutEffect(a);
}
function ft() {
  let { isDataRoute: a } = x.useContext(On);
  return a ? hy() : ey();
}
function ey() {
  Pe(
    nl(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useNavigate() may be used only in the context of a <Router> component."
  );
  let a = x.useContext(tl), { basename: i, navigator: r } = x.useContext(sn), { matches: o } = x.useContext(On), { pathname: d } = At(), h = JSON.stringify(rd(o)), f = x.useRef(!1);
  return F_(() => {
    f.current = !0;
  }), x.useCallback(
    (_, b = {}) => {
      if (an(f.current, B_), !f.current) return;
      if (typeof _ == "number") {
        r.go(_);
        return;
      }
      let v = ac(
        _,
        JSON.parse(h),
        d,
        b.relative === "path"
      );
      a == null && i !== "/" && (v.pathname = v.pathname === "/" ? i : Sn([i, v.pathname])), (b.replace ? r.replace : r.push)(
        v,
        b.state,
        b
      );
    },
    [
      i,
      r,
      h,
      d,
      a
    ]
  );
}
x.createContext(null);
function ci(a, { relative: i } = {}) {
  let { matches: r } = x.useContext(On), { pathname: o } = At(), d = JSON.stringify(rd(r));
  return x.useMemo(
    () => ac(
      a,
      JSON.parse(d),
      o,
      i === "path"
    ),
    [a, d, o, i]
  );
}
function ty(a, i) {
  return G_(a, i);
}
function G_(a, i, r) {
  Pe(
    nl(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useRoutes() may be used only in the context of a <Router> component."
  );
  let { navigator: o } = x.useContext(sn), { matches: d } = x.useContext(On), h = d[d.length - 1], f = h ? h.params : {}, m = h ? h.pathname : "/", _ = h ? h.pathnameBase : "/", b = h && h.route;
  {
    let C = b && b.path || "";
    q_(
      m,
      !b || C.endsWith("*") || C.endsWith("*?"),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${m}" (under <Route path="${C}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${C}"> to <Route path="${C === "/" ? "*" : `${C}/*`}">.`
    );
  }
  let v = At(), g;
  if (i) {
    let C = typeof i == "string" ? cs(i) : i;
    Pe(
      _ === "/" || C.pathname?.startsWith(_),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${_}" but pathname "${C.pathname}" was given in the \`location\` prop.`
    ), g = C;
  } else
    g = v;
  let j = g.pathname || "/", w = j;
  if (_ !== "/") {
    let C = _.replace(/^\//, "").split("/");
    w = "/" + j.replace(/^\//, "").split("/").slice(C.length).join("/");
  }
  let S = r && r.state.matches.length ? (
    // If we're in a data router, use the matches we've already identified but ensure
    // we have the latest route instances from the manifest in case elements have changed
    r.state.matches.map(
      (C) => Object.assign(C, {
        route: r.manifest[C.route.id] || C.route
      })
    )
  ) : E_(a, { pathname: w });
  an(
    b || S != null,
    `No routes matched location "${g.pathname}${g.search}${g.hash}" `
  ), an(
    S == null || S[S.length - 1].route.element !== void 0 || S[S.length - 1].route.Component !== void 0 || S[S.length - 1].route.lazy !== void 0,
    `Matched leaf route at location "${g.pathname}${g.search}${g.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`
  );
  let N = iy(
    S && S.map(
      (C) => Object.assign({}, C, {
        params: Object.assign({}, f, C.params),
        pathname: Sn([
          _,
          // Re-encode pathnames that were decoded inside matchRoutes.
          // Pre-encode `%`, `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          o.encodeLocation ? o.encodeLocation(
            C.pathname.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : C.pathname
        ]),
        pathnameBase: C.pathnameBase === "/" ? _ : Sn([
          _,
          // Re-encode pathnames that were decoded inside matchRoutes
          // Pre-encode `%`, `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          o.encodeLocation ? o.encodeLocation(
            C.pathnameBase.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : C.pathnameBase
        ])
      })
    ),
    d,
    r
  );
  return i && N ? /* @__PURE__ */ x.createElement(
    ri.Provider,
    {
      value: {
        location: {
          pathname: "/",
          search: "",
          hash: "",
          state: null,
          key: "default",
          mask: void 0,
          ...g
        },
        navigationType: "POP"
        /* Pop */
      }
    },
    N
  ) : N;
}
function ny() {
  let a = dy(), i = Fx(a) ? `${a.status} ${a.statusText}` : a instanceof Error ? a.message : JSON.stringify(a), r = a instanceof Error ? a.stack : null, o = "rgba(200,200,200, 0.5)", d = { padding: "0.5rem", backgroundColor: o }, h = { padding: "2px 4px", backgroundColor: o }, f = null;
  return console.error(
    "Error handled by React Router default ErrorBoundary:",
    a
  ), f = /* @__PURE__ */ x.createElement(x.Fragment, null, /* @__PURE__ */ x.createElement("p", null, "💿 Hey developer 👋"), /* @__PURE__ */ x.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /* @__PURE__ */ x.createElement("code", { style: h }, "ErrorBoundary"), " or", " ", /* @__PURE__ */ x.createElement("code", { style: h }, "errorElement"), " prop on your route.")), /* @__PURE__ */ x.createElement(x.Fragment, null, /* @__PURE__ */ x.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ x.createElement("h3", { style: { fontStyle: "italic" } }, i), r ? /* @__PURE__ */ x.createElement("pre", { style: d }, r) : null, f);
}
var ay = /* @__PURE__ */ x.createElement(ny, null), V_ = class extends x.Component {
  constructor(a) {
    super(a), this.state = {
      location: a.location,
      revalidation: a.revalidation,
      error: a.error
    };
  }
  static getDerivedStateFromError(a) {
    return { error: a };
  }
  static getDerivedStateFromProps(a, i) {
    return i.location !== a.location || i.revalidation !== "idle" && a.revalidation === "idle" ? {
      error: a.error,
      location: a.location,
      revalidation: a.revalidation
    } : {
      error: a.error !== void 0 ? a.error : i.error,
      location: i.location,
      revalidation: a.revalidation || i.revalidation
    };
  }
  componentDidCatch(a, i) {
    this.props.onError ? this.props.onError(a, i) : console.error(
      "React Router caught the following error during render",
      a
    );
  }
  render() {
    let a = this.state.error;
    if (this.context && typeof a == "object" && a && "digest" in a && typeof a.digest == "string") {
      const r = Wx(a.digest);
      r && (a = r);
    }
    let i = a !== void 0 ? /* @__PURE__ */ x.createElement(On.Provider, { value: this.props.routeContext }, /* @__PURE__ */ x.createElement(
      cd.Provider,
      {
        value: a,
        children: this.props.component
      }
    )) : this.props.children;
    return this.context ? /* @__PURE__ */ x.createElement(sy, { error: a }, i) : i;
  }
};
V_.contextType = L_;
var Bu = /* @__PURE__ */ new WeakMap();
function sy({
  children: a,
  error: i
}) {
  let { basename: r } = x.useContext(sn);
  if (typeof i == "object" && i && "digest" in i && typeof i.digest == "string") {
    let o = Px(i.digest);
    if (o) {
      let d = Bu.get(i);
      if (d) throw d;
      let h = D_(o.location, r), f = h.absoluteURL || h.to;
      if (Yx(f))
        throw new Error("Invalid redirect location");
      if (O_ && !Bu.get(i))
        if (h.isExternal || o.reloadDocument)
          window.location.href = f;
        else {
          const m = Promise.resolve().then(
            () => window.__reactRouterDataRouter.navigate(h.to, {
              replace: o.replace
            })
          );
          throw Bu.set(i, m), m;
        }
      return /* @__PURE__ */ x.createElement("meta", { httpEquiv: "refresh", content: `0;url=${f}` });
    }
  }
  return a;
}
function ly({ routeContext: a, match: i, children: r }) {
  let o = x.useContext(tl);
  return o && o.static && o.staticContext && (i.route.errorElement || i.route.ErrorBoundary) && (o.staticContext._deepestRenderedBoundaryId = i.route.id), /* @__PURE__ */ x.createElement(On.Provider, { value: a }, r);
}
function iy(a, i = [], r) {
  let o = r?.state;
  if (a == null) {
    if (!o)
      return null;
    if (o.errors)
      a = o.matches;
    else if (i.length === 0 && !o.initialized && o.matches.length > 0)
      a = o.matches;
    else
      return null;
  }
  let d = a, h = o?.errors;
  if (h != null) {
    let v = d.findIndex(
      (g) => g.route.id && h?.[g.route.id] !== void 0
    );
    Pe(
      v >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(
        h
      ).join(",")}`
    ), d = d.slice(
      0,
      Math.min(d.length, v + 1)
    );
  }
  let f = !1, m = -1;
  if (r && o) {
    f = o.renderFallback;
    for (let v = 0; v < d.length; v++) {
      let g = d[v];
      if ((g.route.HydrateFallback || g.route.hydrateFallbackElement) && (m = v), g.route.id) {
        let { loaderData: j, errors: w } = o, S = g.route.loader && !j.hasOwnProperty(g.route.id) && (!w || w[g.route.id] === void 0);
        if (g.route.lazy || S) {
          r.isStatic && (f = !0), m >= 0 ? d = d.slice(0, m + 1) : d = [d[0]];
          break;
        }
      }
    }
  }
  let _ = r?.onError, b = o && _ ? (v, g) => {
    _(v, {
      location: o.location,
      params: o.matches?.[0]?.params ?? {},
      pattern: Gx(o.matches),
      errorInfo: g
    });
  } : void 0;
  return d.reduceRight(
    (v, g, j) => {
      let w, S = !1, N = null, C = null;
      o && (w = h && g.route.id ? h[g.route.id] : void 0, N = g.route.errorElement || ay, f && (m < 0 && j === 0 ? (q_(
        "route-fallback",
        !1,
        "No `HydrateFallback` element provided to render during initial hydration"
      ), S = !0, C = null) : m === j && (S = !0, C = g.route.hydrateFallbackElement || null)));
      let E = i.concat(d.slice(0, j + 1)), z = () => {
        let U;
        return w ? U = N : S ? U = C : g.route.Component ? U = /* @__PURE__ */ x.createElement(g.route.Component, null) : g.route.element ? U = g.route.element : U = v, /* @__PURE__ */ x.createElement(
          ly,
          {
            match: g,
            routeContext: {
              outlet: v,
              matches: E,
              isDataRoute: o != null
            },
            children: U
          }
        );
      };
      return o && (g.route.ErrorBoundary || g.route.errorElement || j === 0) ? /* @__PURE__ */ x.createElement(
        V_,
        {
          location: o.location,
          revalidation: o.revalidation,
          component: N,
          error: w,
          children: z(),
          routeContext: { outlet: null, matches: E, isDataRoute: !0 },
          onError: b
        }
      ) : z();
    },
    null
  );
}
function od(a) {
  return `${a} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function ry(a) {
  let i = x.useContext(tl);
  return Pe(i, od(a)), i;
}
function cy(a) {
  let i = x.useContext(sc);
  return Pe(i, od(a)), i;
}
function oy(a) {
  let i = x.useContext(On);
  return Pe(i, od(a)), i;
}
function ud(a) {
  let i = oy(a), r = i.matches[i.matches.length - 1];
  return Pe(
    r.route.id,
    `${a} can only be used on routes that contain a unique "id"`
  ), r.route.id;
}
function uy() {
  return ud(
    "useRouteId"
    /* UseRouteId */
  );
}
function dy() {
  let a = x.useContext(cd), i = cy(
    "useRouteError"
    /* UseRouteError */
  ), r = ud(
    "useRouteError"
    /* UseRouteError */
  );
  return a !== void 0 ? a : i.errors?.[r];
}
function hy() {
  let { router: a } = ry(
    "useNavigate"
    /* UseNavigateStable */
  ), i = ud(
    "useNavigate"
    /* UseNavigateStable */
  ), r = x.useRef(!1);
  return F_(() => {
    r.current = !0;
  }), x.useCallback(
    async (d, h = {}) => {
      an(r.current, B_), r.current && (typeof d == "number" ? await a.navigate(d) : await a.navigate(d, { fromRouteId: i, ...h }));
    },
    [a, i]
  );
}
var qp = {};
function q_(a, i, r) {
  !i && !qp[a] && (qp[a] = !0, an(!1, r));
}
x.memo(fy);
function fy({
  routes: a,
  manifest: i,
  future: r,
  state: o,
  isStatic: d,
  onError: h
}) {
  return G_(a, void 0, {
    manifest: i,
    state: o,
    isStatic: d,
    onError: h
  });
}
function rs({
  to: a,
  replace: i,
  state: r,
  relative: o
}) {
  Pe(
    nl(),
    // TODO: This error is probably because they somehow have 2 versions of
    // the router loaded. We can help them understand how to avoid that.
    "<Navigate> may be used only in the context of a <Router> component."
  );
  let { static: d } = x.useContext(sn);
  an(
    !d,
    "<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change."
  );
  let { matches: h } = x.useContext(On), { pathname: f } = At(), m = ft(), _ = ac(
    a,
    rd(h),
    f,
    o === "path"
  ), b = JSON.stringify(_);
  return x.useEffect(() => {
    m(JSON.parse(b), { replace: i, state: r, relative: o });
  }, [m, b, o, i, r]), null;
}
function De(a) {
  Pe(
    !1,
    "A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>."
  );
}
function my({
  basename: a = "/",
  children: i = null,
  location: r,
  navigationType: o = "POP",
  navigator: d,
  static: h = !1,
  useTransitions: f
}) {
  Pe(
    !nl(),
    "You cannot render a <Router> inside another <Router>. You should never have more than one in your app."
  );
  let m = a.replace(/^\/*/, "/"), _ = x.useMemo(
    () => ({
      basename: m,
      navigator: d,
      static: h,
      useTransitions: f,
      future: {}
    }),
    [m, d, h, f]
  );
  typeof r == "string" && (r = cs(r));
  let {
    pathname: b = "/",
    search: v = "",
    hash: g = "",
    state: j = null,
    key: w = "default",
    mask: S
  } = r, N = x.useMemo(() => {
    let C = na(b, m);
    return C == null ? null : {
      location: {
        pathname: C,
        search: v,
        hash: g,
        state: j,
        key: w,
        mask: S
      },
      navigationType: o
    };
  }, [m, b, v, g, j, w, o, S]);
  return an(
    N != null,
    `<Router basename="${m}"> is not able to match the URL "${b}${v}${g}" because it does not start with the basename, so the <Router> won't render anything.`
  ), N == null ? null : /* @__PURE__ */ x.createElement(sn.Provider, { value: _ }, /* @__PURE__ */ x.createElement(ri.Provider, { children: i, value: N }));
}
function py({
  children: a,
  location: i
}) {
  return ty(Pu(a), i);
}
function Pu(a, i = []) {
  let r = [];
  return x.Children.forEach(a, (o, d) => {
    if (!x.isValidElement(o))
      return;
    let h = [...i, d];
    if (o.type === x.Fragment) {
      r.push.apply(
        r,
        Pu(o.props.children, h)
      );
      return;
    }
    Pe(
      o.type === De,
      `[${typeof o.type == "string" ? o.type : o.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`
    ), Pe(
      !o.props.index || !o.props.children,
      "An index route cannot have child routes."
    );
    let f = {
      id: o.props.id || h.join("-"),
      caseSensitive: o.props.caseSensitive,
      element: o.props.element,
      Component: o.props.Component,
      index: o.props.index,
      path: o.props.path,
      middleware: o.props.middleware,
      loader: o.props.loader,
      action: o.props.action,
      hydrateFallbackElement: o.props.hydrateFallbackElement,
      HydrateFallback: o.props.HydrateFallback,
      errorElement: o.props.errorElement,
      ErrorBoundary: o.props.ErrorBoundary,
      hasErrorBoundary: o.props.hasErrorBoundary === !0 || o.props.ErrorBoundary != null || o.props.errorElement != null,
      shouldRevalidate: o.props.shouldRevalidate,
      handle: o.props.handle,
      lazy: o.props.lazy
    };
    o.props.children && (f.children = Pu(
      o.props.children,
      h
    )), r.push(f);
  }), r;
}
var Gr = "get", Vr = "application/x-www-form-urlencoded";
function lc(a) {
  return typeof HTMLElement < "u" && a instanceof HTMLElement;
}
function _y(a) {
  return lc(a) && a.tagName.toLowerCase() === "button";
}
function by(a) {
  return lc(a) && a.tagName.toLowerCase() === "form";
}
function gy(a) {
  return lc(a) && a.tagName.toLowerCase() === "input";
}
function vy(a) {
  return !!(a.metaKey || a.altKey || a.ctrlKey || a.shiftKey);
}
function xy(a, i) {
  return a.button === 0 && // Ignore everything but left clicks
  (!i || i === "_self") && // Let browser handle "target=_blank" etc.
  !vy(a);
}
function Wu(a = "") {
  return new URLSearchParams(
    typeof a == "string" || Array.isArray(a) || a instanceof URLSearchParams ? a : Object.keys(a).reduce((i, r) => {
      let o = a[r];
      return i.concat(
        Array.isArray(o) ? o.map((d) => [r, d]) : [[r, o]]
      );
    }, [])
  );
}
function yy(a, i) {
  let r = Wu(a);
  return i && i.forEach((o, d) => {
    r.has(d) || i.getAll(d).forEach((h) => {
      r.append(d, h);
    });
  }), r;
}
var Rr = null;
function wy() {
  if (Rr === null)
    try {
      new FormData(
        document.createElement("form"),
        // @ts-expect-error if FormData supports the submitter parameter, this will throw
        0
      ), Rr = !1;
    } catch {
      Rr = !0;
    }
  return Rr;
}
var jy = /* @__PURE__ */ new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
]);
function Fu(a) {
  return a != null && !jy.has(a) ? (an(
    !1,
    `"${a}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${Vr}"`
  ), null) : a;
}
function Sy(a, i) {
  let r, o, d, h, f;
  if (by(a)) {
    let m = a.getAttribute("action");
    o = m ? na(m, i) : null, r = a.getAttribute("method") || Gr, d = Fu(a.getAttribute("enctype")) || Vr, h = new FormData(a);
  } else if (_y(a) || gy(a) && (a.type === "submit" || a.type === "image")) {
    let m = a.form;
    if (m == null)
      throw new Error(
        'Cannot submit a <button> or <input type="submit"> without a <form>'
      );
    let _ = a.getAttribute("formaction") || m.getAttribute("action");
    if (o = _ ? na(_, i) : null, r = a.getAttribute("formmethod") || m.getAttribute("method") || Gr, d = Fu(a.getAttribute("formenctype")) || Fu(m.getAttribute("enctype")) || Vr, h = new FormData(m, a), !wy()) {
      let { name: b, type: v, value: g } = a;
      if (v === "image") {
        let j = b ? `${b}.` : "";
        h.append(`${j}x`, "0"), h.append(`${j}y`, "0");
      } else b && h.append(b, g);
    }
  } else {
    if (lc(a))
      throw new Error(
        'Cannot submit element that is not <form>, <button>, or <input type="submit|image">'
      );
    r = Gr, o = null, d = Vr, f = a;
  }
  return h && d === "text/plain" && (f = h, h = void 0), { action: o, method: r.toLowerCase(), encType: d, formData: h, body: f };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function dd(a, i) {
  if (a === !1 || a === null || typeof a > "u")
    throw new Error(i);
}
function Y_(a, i, r, o) {
  let d = typeof a == "string" ? new URL(
    a,
    // This can be called during the SSR flow via PrefetchPageLinksImpl so
    // don't assume window is available
    typeof window > "u" ? "server://singlefetch/" : window.location.origin
  ) : a;
  return r ? d.pathname.endsWith("/") ? d.pathname = `${d.pathname}_.${o}` : d.pathname = `${d.pathname}.${o}` : d.pathname === "/" ? d.pathname = `_root.${o}` : i && na(d.pathname, i) === "/" ? d.pathname = `${Kr(i)}/_root.${o}` : d.pathname = `${Kr(d.pathname)}.${o}`, d;
}
async function ky(a, i) {
  if (a.id in i)
    return i[a.id];
  try {
    let r = await import(
      /* @vite-ignore */
      /* webpackIgnore: true */
      a.module
    );
    return i[a.id] = r, r;
  } catch (r) {
    return console.error(
      `Error loading route module \`${a.module}\`, reloading page...`
    ), console.error(r), window.__reactRouterContext && window.__reactRouterContext.isSpaMode, window.location.reload(), new Promise(() => {
    });
  }
}
function Ny(a) {
  return a == null ? !1 : a.href == null ? a.rel === "preload" && typeof a.imageSrcSet == "string" && typeof a.imageSizes == "string" : typeof a.rel == "string" && typeof a.href == "string";
}
async function Cy(a, i, r) {
  let o = await Promise.all(
    a.map(async (d) => {
      let h = i.routes[d.route.id];
      if (h) {
        let f = await ky(h, r);
        return f.links ? f.links() : [];
      }
      return [];
    })
  );
  return Ry(
    o.flat(1).filter(Ny).filter((d) => d.rel === "stylesheet" || d.rel === "preload").map(
      (d) => d.rel === "stylesheet" ? { ...d, rel: "prefetch", as: "style" } : { ...d, rel: "prefetch" }
    )
  );
}
function Yp(a, i, r, o, d, h) {
  let f = (_, b) => r[b] ? _.route.id !== r[b].route.id : !0, m = (_, b) => (
    // param change, /users/123 -> /users/456
    r[b].pathname !== _.pathname || // splat param changed, which is not present in match.path
    // e.g. /files/images/avatar.jpg -> files/finances.xls
    r[b].route.path?.endsWith("*") && r[b].params["*"] !== _.params["*"]
  );
  return h === "assets" ? i.filter(
    (_, b) => f(_, b) || m(_, b)
  ) : h === "data" ? i.filter((_, b) => {
    let v = o.routes[_.route.id];
    if (!v || !v.hasLoader)
      return !1;
    if (f(_, b) || m(_, b))
      return !0;
    if (_.route.shouldRevalidate) {
      let g = _.route.shouldRevalidate({
        currentUrl: new URL(
          d.pathname + d.search + d.hash,
          window.origin
        ),
        currentParams: r[0]?.params || {},
        nextUrl: new URL(a, window.origin),
        nextParams: _.params,
        defaultShouldRevalidate: !0
      });
      if (typeof g == "boolean")
        return g;
    }
    return !0;
  }) : [];
}
function Ey(a, i, { includeHydrateFallback: r } = {}) {
  return My(
    a.map((o) => {
      let d = i.routes[o.route.id];
      if (!d) return [];
      let h = [d.module];
      return d.clientActionModule && (h = h.concat(d.clientActionModule)), d.clientLoaderModule && (h = h.concat(d.clientLoaderModule)), r && d.hydrateFallbackModule && (h = h.concat(d.hydrateFallbackModule)), d.imports && (h = h.concat(d.imports)), h;
    }).flat(1)
  );
}
function My(a) {
  return [...new Set(a)];
}
function Ty(a) {
  let i = {}, r = Object.keys(a).sort();
  for (let o of r)
    i[o] = a[o];
  return i;
}
function Ry(a, i) {
  let r = /* @__PURE__ */ new Set();
  return new Set(i), a.reduce((o, d) => {
    let h = JSON.stringify(Ty(d));
    return r.has(h) || (r.add(h), o.push({ key: h, link: d })), o;
  }, []);
}
function hd() {
  let a = x.useContext(tl);
  return dd(
    a,
    "You must render this element inside a <DataRouterContext.Provider> element"
  ), a;
}
function Ay() {
  let a = x.useContext(sc);
  return dd(
    a,
    "You must render this element inside a <DataRouterStateContext.Provider> element"
  ), a;
}
var fd = x.createContext(void 0);
fd.displayName = "FrameworkContext";
function ic() {
  let a = x.useContext(fd);
  return dd(
    a,
    "You must render this element inside a <HydratedRouter> element"
  ), a;
}
function zy(a, i) {
  let r = x.useContext(fd), [o, d] = x.useState(!1), [h, f] = x.useState(!1), { onFocus: m, onBlur: _, onMouseEnter: b, onMouseLeave: v, onTouchStart: g } = i, j = x.useRef(null);
  x.useEffect(() => {
    if (a === "render" && f(!0), a === "viewport") {
      let N = (E) => {
        E.forEach((z) => {
          f(z.isIntersecting);
        });
      }, C = new IntersectionObserver(N, { threshold: 0.5 });
      return j.current && C.observe(j.current), () => {
        C.disconnect();
      };
    }
  }, [a]), x.useEffect(() => {
    if (o) {
      let N = setTimeout(() => {
        f(!0);
      }, 100);
      return () => {
        clearTimeout(N);
      };
    }
  }, [o]);
  let w = () => {
    d(!0);
  }, S = () => {
    d(!1), f(!1);
  };
  return r ? a !== "intent" ? [h, j, {}] : [
    h,
    j,
    {
      onFocus: ti(m, w),
      onBlur: ti(_, S),
      onMouseEnter: ti(b, w),
      onMouseLeave: ti(v, S),
      onTouchStart: ti(g, w)
    }
  ] : [!1, j, {}];
}
function ti(a, i) {
  return (r) => {
    a && a(r), r.defaultPrevented || i(r);
  };
}
function Oy({ page: a, ...i }) {
  let r = Xx(), { nonce: o } = ic(), { router: d } = hd(), h = x.useMemo(
    () => E_(d.routes, a, d.basename),
    [d.routes, a, d.basename]
  );
  return h ? (i.nonce == null && o && (i = { ...i, nonce: o }), r ? /* @__PURE__ */ x.createElement(Hy, { page: a, matches: h, ...i }) : /* @__PURE__ */ x.createElement(Ly, { page: a, matches: h, ...i })) : null;
}
function Dy(a) {
  let { manifest: i, routeModules: r } = ic(), [o, d] = x.useState([]);
  return x.useEffect(() => {
    let h = !1;
    return Cy(a, i, r).then(
      (f) => {
        h || d(f);
      }
    ), () => {
      h = !0;
    };
  }, [a, i, r]), o;
}
function Hy({
  page: a,
  matches: i,
  ...r
}) {
  let o = At(), { future: d } = ic(), { basename: h } = hd(), f = x.useMemo(() => {
    if (a === o.pathname + o.search + o.hash)
      return [];
    let m = Y_(
      a,
      h,
      d.v8_trailingSlashAwareDataRequests,
      "rsc"
    ), _ = !1, b = [];
    for (let v of i)
      typeof v.route.shouldRevalidate == "function" ? _ = !0 : b.push(v.route.id);
    return _ && b.length > 0 && m.searchParams.set("_routes", b.join(",")), [m.pathname + m.search];
  }, [
    h,
    d.v8_trailingSlashAwareDataRequests,
    a,
    o,
    i
  ]);
  return /* @__PURE__ */ x.createElement(x.Fragment, null, f.map((m) => /* @__PURE__ */ x.createElement("link", { key: m, rel: "prefetch", as: "fetch", href: m, ...r })));
}
function Ly({
  page: a,
  matches: i,
  ...r
}) {
  let o = At(), { future: d, manifest: h, routeModules: f } = ic(), { basename: m } = hd(), { loaderData: _, matches: b } = Ay(), v = x.useMemo(
    () => Yp(
      a,
      i,
      b,
      h,
      o,
      "data"
    ),
    [a, i, b, h, o]
  ), g = x.useMemo(
    () => Yp(
      a,
      i,
      b,
      h,
      o,
      "assets"
    ),
    [a, i, b, h, o]
  ), j = x.useMemo(() => {
    if (a === o.pathname + o.search + o.hash)
      return [];
    let N = /* @__PURE__ */ new Set(), C = !1;
    if (i.forEach((z) => {
      let U = h.routes[z.route.id];
      !U || !U.hasLoader || (!v.some((Q) => Q.route.id === z.route.id) && z.route.id in _ && f[z.route.id]?.shouldRevalidate || U.hasClientLoader ? C = !0 : N.add(z.route.id));
    }), N.size === 0)
      return [];
    let E = Y_(
      a,
      m,
      d.v8_trailingSlashAwareDataRequests,
      "data"
    );
    return C && N.size > 0 && E.searchParams.set(
      "_routes",
      i.filter((z) => N.has(z.route.id)).map((z) => z.route.id).join(",")
    ), [E.pathname + E.search];
  }, [
    m,
    d.v8_trailingSlashAwareDataRequests,
    _,
    o,
    h,
    v,
    i,
    a,
    f
  ]), w = x.useMemo(
    () => Ey(g, h),
    [g, h]
  ), S = Dy(g);
  return /* @__PURE__ */ x.createElement(x.Fragment, null, j.map((N) => /* @__PURE__ */ x.createElement("link", { key: N, rel: "prefetch", as: "fetch", href: N, ...r })), w.map((N) => /* @__PURE__ */ x.createElement("link", { key: N, rel: "modulepreload", href: N, ...r })), S.map(({ key: N, link: C }) => (
    // these don't spread `linkProps` because they are full link descriptors
    // already with their own props
    /* @__PURE__ */ x.createElement(
      "link",
      {
        key: N,
        nonce: r.nonce,
        ...C,
        crossOrigin: C.crossOrigin ?? r.crossOrigin
      }
    )
  )));
}
function $y(...a) {
  return (i) => {
    a.forEach((r) => {
      typeof r == "function" ? r(i) : r != null && (r.current = i);
    });
  };
}
var Uy = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
try {
  Uy && (window.__reactRouterVersion = // @ts-expect-error
  "7.18.2");
} catch {
}
function By({
  basename: a,
  children: i,
  useTransitions: r,
  window: o
}) {
  let d = x.useRef();
  d.current == null && (d.current = gx({ window: o, v5Compat: !0 }));
  let h = d.current, [f, m] = x.useState({
    action: h.action,
    location: h.location
  }), _ = x.useCallback(
    (b) => {
      r === !1 ? m(b) : x.startTransition(() => m(b));
    },
    [r]
  );
  return x.useLayoutEffect(() => h.listen(_), [h, _]), /* @__PURE__ */ x.createElement(
    my,
    {
      basename: a,
      children: i,
      location: f.location,
      navigationType: f.action,
      navigator: h,
      useTransitions: r
    }
  );
}
var ii = x.forwardRef(
  function({
    onClick: i,
    discover: r = "render",
    prefetch: o = "none",
    relative: d,
    reloadDocument: h,
    replace: f,
    mask: m,
    state: _,
    target: b,
    to: v,
    preventScrollReset: g,
    viewTransition: j,
    defaultShouldRevalidate: w,
    ...S
  }, N) {
    let { basename: C, navigator: E, useTransitions: z } = x.useContext(sn), U = typeof v == "string" && id.test(v), Q = D_(v, C);
    v = Q.to;
    let X = Ix(v, { relative: d }), F = At(), Z = null;
    if (m) {
      let M = ac(
        m,
        [],
        F.mask ? F.mask.pathname : "/",
        !0
      );
      C !== "/" && (M.pathname = M.pathname === "/" ? C : Sn([C, M.pathname])), Z = E.createHref(M);
    }
    let [I, ae, ie] = zy(
      o,
      S
    ), de = Vy(v, {
      replace: f,
      mask: m,
      state: _,
      target: b,
      preventScrollReset: g,
      relative: d,
      viewTransition: j,
      defaultShouldRevalidate: w,
      useTransitions: z
    });
    function re(M) {
      i && i(M), M.defaultPrevented || de(M);
    }
    let ce = !(Q.isExternal || h), oe = (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      /* @__PURE__ */ x.createElement(
        "a",
        {
          ...S,
          ...ie,
          href: (ce ? Z : void 0) || Q.absoluteURL || X,
          onClick: ce ? re : i,
          ref: $y(N, ae),
          target: b,
          "data-discover": !U && r === "render" ? "true" : void 0
        }
      )
    );
    return I && !U ? /* @__PURE__ */ x.createElement(x.Fragment, null, oe, /* @__PURE__ */ x.createElement(Oy, { page: X })) : oe;
  }
);
ii.displayName = "Link";
var qr = x.forwardRef(
  function({
    "aria-current": i = "page",
    caseSensitive: r = !1,
    className: o = "",
    end: d = !1,
    style: h,
    to: f,
    viewTransition: m,
    children: _,
    ...b
  }, v) {
    let g = ci(f, { relative: b.relative }), j = At(), w = x.useContext(sc), { navigator: S, basename: N } = x.useContext(sn), C = w != null && // Conditional usage is OK here because the usage of a data router is static
    // eslint-disable-next-line react-hooks/rules-of-hooks
    Zy(g) && m === !0, E = S.encodeLocation ? S.encodeLocation(g).pathname : g.pathname, z = j.pathname, U = w && w.navigation && w.navigation.location ? w.navigation.location.pathname : null;
    r || (z = z.toLowerCase(), U = U ? U.toLowerCase() : null, E = E.toLowerCase()), U && N && (U = na(U, N) || U);
    const Q = E !== "/" && E.endsWith("/") ? E.length - 1 : E.length;
    let X = z === E || !d && z.startsWith(E) && z.charAt(Q) === "/", F = U != null && (U === E || !d && U.startsWith(E) && U.charAt(E.length) === "/"), Z = {
      isActive: X,
      isPending: F,
      isTransitioning: C
    }, I = X ? i : void 0, ae;
    typeof o == "function" ? ae = o(Z) : ae = [
      o,
      X ? "active" : null,
      F ? "pending" : null,
      C ? "transitioning" : null
    ].filter(Boolean).join(" ");
    let ie = typeof h == "function" ? h(Z) : h;
    return /* @__PURE__ */ x.createElement(
      ii,
      {
        ...b,
        "aria-current": I,
        className: ae,
        ref: v,
        style: ie,
        to: f,
        viewTransition: m
      },
      typeof _ == "function" ? _(Z) : _
    );
  }
);
qr.displayName = "NavLink";
var Fy = x.forwardRef(
  ({
    discover: a = "render",
    fetcherKey: i,
    navigate: r,
    reloadDocument: o,
    replace: d,
    state: h,
    method: f = Gr,
    action: m,
    onSubmit: _,
    relative: b,
    preventScrollReset: v,
    viewTransition: g,
    defaultShouldRevalidate: j,
    ...w
  }, S) => {
    let { useTransitions: N } = x.useContext(sn), C = Xy(), E = Qy(m, { relative: b }), z = f.toLowerCase() === "get" ? "get" : "post", U = typeof m == "string" && id.test(m), Q = (X) => {
      if (_ && _(X), X.defaultPrevented) return;
      X.preventDefault();
      let F = X.nativeEvent.submitter, Z = F?.getAttribute("formmethod") || f, I = () => C(F || X.currentTarget, {
        fetcherKey: i,
        method: Z,
        navigate: r,
        replace: d,
        state: h,
        relative: b,
        preventScrollReset: v,
        viewTransition: g,
        defaultShouldRevalidate: j
      });
      N && r !== !1 ? x.startTransition(() => I()) : I();
    };
    return /* @__PURE__ */ x.createElement(
      "form",
      {
        ref: S,
        method: z,
        action: E,
        onSubmit: o ? _ : Q,
        ...w,
        "data-discover": !U && a === "render" ? "true" : void 0
      }
    );
  }
);
Fy.displayName = "Form";
function Gy(a) {
  return `${a} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function X_(a) {
  let i = x.useContext(tl);
  return Pe(i, Gy(a)), i;
}
function Vy(a, {
  target: i,
  replace: r,
  mask: o,
  state: d,
  preventScrollReset: h,
  relative: f,
  viewTransition: m,
  defaultShouldRevalidate: _,
  useTransitions: b
} = {}) {
  let v = ft(), g = At(), j = ci(a, { relative: f });
  return x.useCallback(
    (w) => {
      if (xy(w, i)) {
        w.preventDefault();
        let S = r !== void 0 ? r : li(g) === li(j), N = () => v(a, {
          replace: S,
          mask: o,
          state: d,
          preventScrollReset: h,
          relative: f,
          viewTransition: m,
          defaultShouldRevalidate: _
        });
        b ? x.startTransition(() => N()) : N();
      }
    },
    [
      g,
      v,
      j,
      r,
      o,
      d,
      i,
      a,
      h,
      f,
      m,
      _,
      b
    ]
  );
}
function rc(a) {
  an(
    typeof URLSearchParams < "u",
    "You cannot use the `useSearchParams` hook in a browser that does not support the URLSearchParams API. If you need to support Internet Explorer 11, we recommend you load a polyfill such as https://github.com/ungap/url-search-params."
  );
  let i = x.useRef(Wu(a)), r = x.useRef(!1), o = At(), d = x.useMemo(
    () => (
      // Only merge in the defaults if we haven't yet called setSearchParams.
      // Once we call that we want those to take precedence, otherwise you can't
      // remove a param with setSearchParams({}) if it has an initial value
      yy(
        o.search,
        r.current ? null : i.current
      )
    ),
    [o.search]
  ), h = ft(), f = x.useCallback(
    (m, _) => {
      const b = Wu(
        typeof m == "function" ? m(new URLSearchParams(d)) : m
      );
      r.current = !0, h("?" + b, _);
    },
    [h, d]
  );
  return [d, f];
}
var qy = 0, Yy = () => `__${String(++qy)}__`;
function Xy() {
  let { router: a } = X_(
    "useSubmit"
    /* UseSubmit */
  ), { basename: i } = x.useContext(sn), r = uy(), o = a.fetch, d = a.navigate;
  return x.useCallback(
    async (h, f = {}) => {
      let { action: m, method: _, encType: b, formData: v, body: g } = Sy(
        h,
        i
      );
      if (f.navigate === !1) {
        let j = f.fetcherKey || Yy();
        await o(j, r, f.action || m, {
          defaultShouldRevalidate: f.defaultShouldRevalidate,
          preventScrollReset: f.preventScrollReset,
          formData: v,
          body: g,
          formMethod: f.method || _,
          formEncType: f.encType || b,
          flushSync: f.flushSync
        });
      } else
        await d(f.action || m, {
          defaultShouldRevalidate: f.defaultShouldRevalidate,
          preventScrollReset: f.preventScrollReset,
          formData: v,
          body: g,
          formMethod: f.method || _,
          formEncType: f.encType || b,
          replace: f.replace,
          state: f.state,
          fromRouteId: r,
          flushSync: f.flushSync,
          viewTransition: f.viewTransition
        });
    },
    [o, d, i, r]
  );
}
function Qy(a, { relative: i } = {}) {
  let { basename: r } = x.useContext(sn), o = x.useContext(On);
  Pe(o, "useFormAction must be used inside a RouteContext");
  let [d] = o.matches.slice(-1), h = { ...ci(a || ".", { relative: i }) }, f = At();
  if (a == null) {
    h.search = f.search;
    let m = new URLSearchParams(h.search), _ = m.getAll("index");
    if (_.some((v) => v === "")) {
      m.delete("index"), _.filter((g) => g).forEach((g) => m.append("index", g));
      let v = m.toString();
      h.search = v ? `?${v}` : "";
    }
  }
  return (!a || a === ".") && d.route.index && (h.search = h.search ? h.search.replace(/^\?/, "?index&") : "?index"), r !== "/" && (h.pathname = h.pathname === "/" ? r : Sn([r, h.pathname])), li(h);
}
function Zy(a, { relative: i } = {}) {
  let r = x.useContext($_);
  Pe(
    r != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?"
  );
  let { basename: o } = X_(
    "useViewTransitionState"
    /* useViewTransitionState */
  ), d = ci(a, { relative: i });
  if (!r.isTransitioning)
    return !1;
  let h = na(r.currentLocation.pathname, o) || r.currentLocation.pathname, f = na(r.nextLocation.pathname, o) || r.nextLocation.pathname;
  return Zr(d.pathname, f) != null || Zr(d.pathname, h) != null;
}
const Ky = {
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
  trends: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="100%" height="100%">
<path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/>
</svg>`
};
function Jy(a) {
  return Ky[a];
}
const Q_ = x.createContext(null), Py = /* @__PURE__ */ new Set([
  "input_boolean",
  "input_number",
  "input_select",
  "input_text",
  "input_datetime",
  "input_button"
]);
function Wy(a) {
  if (!a) return !1;
  const i = a.toLowerCase(), r = i.indexOf("."), o = r >= 0 ? i.slice(0, r) : "", d = r >= 0 ? i.slice(r + 1) : i;
  return d.startsWith("dsc_") || d.startsWith("dsc-") || d.includes("_dsc_") || i.includes("dsc_") || i.includes("dsc-") ? !0 : Py.has(o) ? d.startsWith("dsc_") || d.includes("dsc_") : i.startsWith("sensor.dsc") || i.startsWith("switch.dsc") || i.startsWith("binary_sensor.dsc") || i.startsWith("number.dsc") || i.startsWith("light.dsc") || i.startsWith("fan.dsc") || i.startsWith("select.dsc") || i.startsWith("text.dsc") || i.startsWith("datetime.dsc") || i.startsWith("time.dsc");
}
const Iy = 150;
function e0({
  hass: a,
  revision: i = 0,
  children: r
}) {
  const [o, d] = x.useState(0), h = x.useRef(null), f = x.useRef(a);
  f.current = a;
  const m = a?.connection, _ = !!a, b = () => {
    h.current || (h.current = setTimeout(() => {
      h.current = null, d((w) => w + 1);
    }, Iy));
  };
  x.useEffect(() => {
    _ && b();
  }, [_]), x.useEffect(() => {
    i > 0 && b();
  }, [i]), x.useEffect(() => {
    if (!m?.subscribeEvents) return;
    let w, S = !1;
    const N = (C) => {
      const E = C.data?.entity_id;
      Wy(E) && b();
    };
    return Promise.resolve(m.subscribeEvents(N, "state_changed")).then((C) => {
      if (S) {
        C();
        return;
      }
      w = C;
    }).catch(() => {
    }), () => {
      S = !0, w?.(), h.current && (clearTimeout(h.current), h.current = null);
    };
  }, [m]);
  const v = x.useMemo(
    () => (w, S, N) => {
      const C = f.current;
      return C?.callService ? C.callService(w, S, N) : Promise.resolve(null);
    },
    []
  ), g = x.useMemo(
    () => (w) => {
      const S = f.current;
      if (S?.callWS) return S.callWS(w);
      const N = S?.connection;
      return N?.sendMessagePromise ? N.sendMessagePromise(w) : Promise.resolve(null);
    },
    []
  ), j = x.useMemo(() => {
    const w = (E) => f.current?.states?.[E], S = (E) => {
      const z = w(E)?.state;
      return z === void 0 ? !1 : z !== "unavailable" && z !== "unknown";
    }, N = (E, z = "—") => S(E) ? w(E)?.state ?? z : z, C = (E, z = NaN) => {
      if (!S(E)) return z;
      const U = Number(w(E)?.state);
      return Number.isFinite(U) ? U : z;
    };
    return { hass: f.current, entity: w, state: N, num: C, available: S, callService: v, callWS: g, tick: o };
  }, [o, v, g]);
  return x.createElement(Q_.Provider, { value: j }, r);
}
function oi() {
  const a = x.useContext(Q_);
  if (!a) throw new Error("useHass outside HassProvider");
  return a;
}
const Iu = (a) => ({
  seat_id: a,
  online: !1,
  firmware: null,
  values: {},
  last_seen: null
}), Oa = {
  version: "7.0.0.0",
  surface: "7.0.0",
  expected_firmware: "7.0.0.0",
  hub: Iu("hub"),
  panel: Iu("panel"),
  pots: {},
  sonoffs: {},
  canopy: {},
  system: {},
  updated_at: 0
};
function Ar(a, i) {
  if (!a || typeof a != "object") return Iu(i);
  const r = a;
  return {
    seat_id: String(r.seat_id ?? i),
    online: !!r.online,
    firmware: r.firmware != null ? String(r.firmware) : null,
    values: r.values ?? {},
    last_seen: typeof r.last_seen == "number" ? r.last_seen : null
  };
}
function Z_(a) {
  if (!a) return { ...Oa };
  const i = {}, r = a.pots;
  if (r)
    for (const [f, m] of Object.entries(r))
      i[f] = Ar(m, f);
  const o = {}, d = a.sonoffs;
  if (d)
    for (const [f, m] of Object.entries(d))
      o[f] = Ar(m, f);
  const h = Array.isArray(a.inventory) ? a.inventory : void 0;
  return {
    version: String(a.version ?? Oa.version),
    surface: String(a.surface ?? Oa.surface),
    expected_firmware: String(a.expected_firmware ?? Oa.expected_firmware),
    hub: Ar(a.hub, "hub"),
    panel: Ar(a.panel, "panel"),
    pots: i,
    sonoffs: o,
    canopy: a.canopy ?? {},
    system: a.system ?? {},
    updated_at: typeof a.updated_at == "number" ? a.updated_at : 0,
    inventory: h
  };
}
function t0(a) {
  const i = a.hub.values;
  return {
    temp_c: i.temp_c != null ? Number(i.temp_c) : null,
    rh_pct: i.rh_pct != null ? Number(i.rh_pct) : null,
    vpd_kpa: i.vpd_kpa != null ? Number(i.vpd_kpa) : i.vd_kpa != null ? Number(i.vd_kpa) : null,
    heartbeat: i.heartbeat ?? null,
    uptime: i.uptime ?? null
  };
}
function n0(a, i) {
  const r = a.hub.values;
  return i === "clone" ? {
    temp_c: r.clone_temp_c != null ? Number(r.clone_temp_c) : null,
    rh_pct: r.clone_rh_pct != null ? Number(r.clone_rh_pct) : null,
    vpd_kpa: r.clone_vpd_kpa != null ? Number(r.clone_vpd_kpa) : r.clone_vd_kpa != null ? Number(r.clone_vd_kpa) : null
  } : {
    temp_c: r.temp_c != null ? Number(r.temp_c) : null,
    rh_pct: r.rh_pct != null ? Number(r.rh_pct) : null,
    vpd_kpa: r.vpd_kpa != null ? Number(r.vpd_kpa) : r.vd_kpa != null ? Number(r.vd_kpa) : null
  };
}
function zr(a, i, r = !0) {
  const o = a.inventory?.find((d) => d.seat_id === i);
  return o && o.in_service != null ? !!o.in_service : i === "ac" || i === "mister" || i === "tank" || i === "pot3" ? !1 : r;
}
const a0 = {
  ac: "input_boolean.dsc_ac_in_service",
  mister: "input_boolean.dsc_clone_humidifier_in_service",
  pot1: "input_boolean.dsc_pot1_in_service",
  pot2: "input_boolean.dsc_pot2_in_service",
  pot3: "input_boolean.dsc_pot3_in_service",
  pot4: "input_boolean.dsc_pot4_in_service",
  tank: "input_boolean.dsc_tank_in_service"
}, s0 = {
  heater: "sensor.dsc_heater_firmware_version",
  heatmat: "sensor.dsc_heatmat_firmware_version",
  humidifier: "sensor.dsc_humidifier_firmware_version",
  dehumidifier: "sensor.dsc_dehumidifier_firmware_version"
};
function Dt(a, i) {
  return a.states[i]?.state ?? "unavailable";
}
function Mt(a, i) {
  const r = a.states[i]?.state;
  return r != null && r !== "unavailable" && r !== "unknown";
}
function bn(a, i) {
  const r = Number(Dt(a, i));
  return Number.isFinite(r) ? r : null;
}
function l0(a, i) {
  if (!a) return { ...Oa, inventory: i };
  const o = Mt(a, "binary_sensor.dsc_hub_link") && Dt(a, "binary_sensor.dsc_hub_link") === "on", d = {
    seat_id: "hub",
    online: o,
    firmware: Mt(a, "sensor.dsc_hub_firmware_version") ? Dt(a, "sensor.dsc_hub_firmware_version") : null,
    values: {
      temp_c: bn(a, "sensor.dsc_hub_tent_temperature") ?? bn(a, "sensor.dsc_hub_temperature"),
      rh_pct: bn(a, "sensor.dsc_hub_tent_humidity") ?? bn(a, "sensor.dsc_hub_humidity"),
      vpd_kpa: bn(a, "sensor.dsc_hub_vpd_kpa") ?? bn(a, "sensor.dsc_hub_vpd"),
      heartbeat: Mt(a, "sensor.dsc_hub_heartbeat") ? Dt(a, "sensor.dsc_hub_heartbeat") : null,
      uptime: Mt(a, "sensor.dsc_hub_uptime") ? Dt(a, "sensor.dsc_hub_uptime") : null
    },
    last_seen: o ? Date.now() / 1e3 : null
  }, h = Mt(a, "binary_sensor.dsc_hub_panel_link") && Dt(a, "binary_sensor.dsc_hub_panel_link") === "on", f = {
    seat_id: "panel",
    online: h,
    firmware: Mt(a, "sensor.dsc_control_firmware_version") ? Dt(a, "sensor.dsc_control_firmware_version") : null,
    values: {},
    last_seen: h ? Date.now() / 1e3 : null
  }, m = {};
  for (const j of [1, 2, 3, 4]) {
    const w = `pot${j}`, S = `sensor.dsc_pot${j}_firmware_version`, N = Mt(a, S);
    m[w] = {
      seat_id: w,
      online: N,
      firmware: N ? Dt(a, S) : null,
      values: {
        moisture_pct: bn(a, `sensor.dsc_pot${j}_soil_moisture`),
        soil_temp_c: bn(a, `sensor.dsc_pot${j}_soil_temperature`),
        ec_us: bn(a, `sensor.dsc_pot${j}_soil_ec`),
        ph: bn(a, `sensor.dsc_pot${j}_soil_ph`)
      },
      last_seen: N ? Date.now() / 1e3 : null
    };
  }
  const _ = {}, b = {
    heater: "switch.dsc_heater_main_relay",
    heatmat: "switch.dsc_heatmat_main_relay",
    humidifier: "switch.dsc_humidifier_main_relay",
    dehumidifier: "switch.dsc_de_humidifier_main_relay"
  };
  for (const [j, w] of Object.entries(b)) {
    const S = s0[j], N = Mt(a, w) || Mt(a, S);
    _[j] = {
      seat_id: j,
      online: N,
      firmware: S && Mt(a, S) ? Dt(a, S) : null,
      values: {
        relay_on: Mt(a, w) ? Dt(a, w) === "on" : null
      },
      last_seen: N ? Date.now() / 1e3 : null
    };
  }
  const v = i ?? Object.entries(a0).map(([j, w]) => ({
    seat_id: j,
    in_service: Mt(a, w) ? Dt(a, w) === "on" : j.startsWith("pot") && j !== "pot3"
  })), g = {};
  return Mt(a, "sensor.dsc_canopy_temperature") && (g.temp_c = bn(a, "sensor.dsc_canopy_temperature")), Mt(a, "sensor.dsc_canopy_humidity") && (g.rh_pct = bn(a, "sensor.dsc_canopy_humidity")), {
    version: Dt(a, "sensor.dsc_fleet_version_status") || Oa.version,
    surface: Dt(a, "sensor.dsc_ha_surface_version") || Oa.surface,
    expected_firmware: Oa.expected_firmware,
    hub: d,
    panel: f,
    pots: m,
    sonoffs: _,
    canopy: g,
    system: {
      appliance_link: Mt(a, "binary_sensor.dsc_pi_appliance_link") && Dt(a, "binary_sensor.dsc_pi_appliance_link") === "on",
      reduced_kit: Mt(a, "binary_sensor.dsc_reduced_kit") && Dt(a, "binary_sensor.dsc_reduced_kit") === "on"
    },
    updated_at: Date.now() / 1e3,
    inventory: v
  };
}
const K_ = x.createContext(null);
function i0({
  children: a,
  fleetRaw: i,
  hass: r,
  tick: o = 0,
  source: d,
  loading: h = !1,
  error: f = null,
  refresh: m,
  inventory: _
}) {
  const b = x.useMemo(() => {
    if (d === "pi" && i) {
      const g = Z_(i);
      return Array.isArray(i?.inventory) ? { ...g, inventory: i.inventory } : _?.length ? { ...g, inventory: _ } : g;
    }
    return l0(r ?? null, _);
  }, [d, i, r, _, o]), v = x.useMemo(
    () => ({ fleet: b, tick: o, source: d, loading: h, error: f, refresh: m }),
    [b, o, d, h, f, m]
  );
  return /* @__PURE__ */ s.jsx(K_.Provider, { value: v, children: a });
}
function md() {
  const a = x.useContext(K_);
  if (!a) throw new Error("useFleet outside FleetProvider");
  return a;
}
function kt() {
  return md().fleet;
}
function r0() {
  return md().tick;
}
function sa() {
  return md().source;
}
function J_() {
  const a = kt();
  return { ...t0(a), online: a.hub.online };
}
function c0(a) {
  const i = kt();
  return { ...n0(i, a), online: i.hub.online };
}
function pd(a) {
  const i = a.hub.values.controls;
  if (!(!i || typeof i != "object"))
    return i;
}
function Yr(a, i) {
  return i.hub.online ? pd(i)?.[a]?.state ?? null : null;
}
function P_(a, i) {
  return i.hub.online && !!pd(i)?.[a];
}
function W_(a, i) {
  const r = pd(i)?.[a];
  if (!r) return {};
  const o = {};
  return r.options?.length && (o.options = r.options), r.percentage != null && (o.percentage = r.percentage), r.brightness != null && (o.brightness = r.brightness), o;
}
const I_ = {
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
  "sensor.dsc_pot1_got_moisture": { seatId: "pot1", metric: "moisture_pct" },
  "sensor.dsc_pot2_soil_moisture": { seatId: "pot2", metric: "moisture_pct" },
  "sensor.dsc_pot2_got_moisture": { seatId: "pot2", metric: "moisture_pct" },
  "sensor.dsc_pot3_soil_moisture": { seatId: "pot3", metric: "moisture_pct" },
  "sensor.dsc_pot3_got_moisture": { seatId: "pot3", metric: "moisture_pct" },
  "sensor.dsc_pot4_soil_moisture": { seatId: "pot4", metric: "moisture_pct" },
  "sensor.dsc_pot4_got_moisture": { seatId: "pot4", metric: "moisture_pct" },
  "sensor.dsc_pot1_soil_temperature": { seatId: "pot1", metric: "soil_temp_c" },
  "sensor.dsc_pot2_soil_temperature": { seatId: "pot2", metric: "soil_temp_c" },
  "sensor.dsc_pot3_soil_temperature": { seatId: "pot3", metric: "soil_temp_c" },
  "sensor.dsc_pot4_soil_temperature": { seatId: "pot4", metric: "soil_temp_c" },
  "sensor.dsc_pot1_soil_ec": { seatId: "pot1", metric: "ec_us" },
  "sensor.dsc_pot2_soil_ec": { seatId: "pot2", metric: "ec_us" },
  "sensor.dsc_pot3_soil_ec": { seatId: "pot3", metric: "ec_us" },
  "sensor.dsc_pot4_soil_ec": { seatId: "pot4", metric: "ec_us" },
  "sensor.dsc_pot1_soil_ph": { seatId: "pot1", metric: "ph" },
  "sensor.dsc_pot2_soil_ph": { seatId: "pot2", metric: "ph" },
  "sensor.dsc_pot3_soil_ph": { seatId: "pot3", metric: "ph" },
  "sensor.dsc_pot4_soil_ph": { seatId: "pot4", metric: "ph" },
  "switch.dsc_heater_main_relay": { seatId: "heater", metric: "relay_on", binary: !0 },
  "switch.dsc_heatmat_main_relay": { seatId: "heatmat", metric: "relay_on", binary: !0 },
  "switch.dsc_humidifier_main_relay": { seatId: "humidifier", metric: "relay_on", binary: !0 },
  "switch.dsc_de_humidifier_main_relay": { seatId: "dehumidifier", metric: "relay_on", binary: !0 }
};
function o0(a, i) {
  return i === "hub" ? a.hub.values : i === "panel" ? a.panel.values : i.startsWith("pot") ? a.pots[i]?.values : a.sonoffs[i]?.values;
}
function Jr(a, i) {
  const r = I_[a];
  if (!r) return null;
  const o = o0(i, r.seatId);
  if (!o) return null;
  const d = o[r.metric];
  if (d == null) return null;
  if (r.binary) return d === !0 || d === "on" || d === 1 || d === "1" ? 1 : 0;
  const h = Number(d);
  return Number.isFinite(h) ? h : null;
}
function _d(a, i) {
  const r = I_[a];
  return r ? r.seatId === "hub" ? i.hub.online : r.seatId === "panel" ? i.panel.online : r.seatId.startsWith("pot") ? !!i.pots[r.seatId]?.online : !!i.sonoffs[r.seatId]?.online : !1;
}
function u0(a) {
  return !a.hub.online;
}
function Ce() {
  const a = oi(), i = kt(), r = sa();
  return x.useMemo(() => r !== "pi" ? a : { ...a, entity: (m) => {
    const _ = a.entity(m), b = Yr(m, i);
    return b != null ? {
      entity_id: m,
      state: b,
      attributes: W_(m, i),
      last_changed: (/* @__PURE__ */ new Date()).toISOString()
    } : _;
  }, available: (m) => P_(m, i) || _d(m, i) ? !0 : a.available(m), state: (m, _ = "—") => {
    const b = Yr(m, i);
    if (b != null) return b;
    const v = Jr(m, i);
    return v != null && Number.isFinite(v) ? String(v) : a.state(m, _);
  }, num: (m, _ = NaN) => {
    const b = Yr(m, i);
    if (b != null) {
      const g = Number(b);
      if (Number.isFinite(g)) return g;
    }
    const v = Jr(m, i);
    return v != null && Number.isFinite(v) ? v : a.num(m, _);
  } }, [a, i, r]);
}
async function d0(a, i = 6) {
  const r = await fetch(`/history?entity_id=${encodeURIComponent(a)}&hours=${i}`);
  return r.ok ? (await r.json()).points ?? [] : [];
}
async function h0(a = 24, i = 100) {
  const r = await fetch(`/grow-log?hours=${a}&limit=${i}`);
  return r.ok ? (await r.json()).events ?? [] : [];
}
async function f0(a, i, r = {}) {
  const o = await fetch("/control/service", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain: a, service: i, data: r })
  });
  if (!o.ok) {
    const d = await o.text();
    throw new Error(d || "service call failed");
  }
  return o.json();
}
async function m0(a, i) {
  const r = await fetch("/control/demand", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ seat: a, on: i })
  });
  if (!r.ok) {
    const o = await r.text();
    throw new Error(o || "demand call failed");
  }
  return r.json();
}
async function p0() {
  const a = await fetch("/fleet");
  if (!a.ok) throw new Error("fleet fetch failed");
  return a.json();
}
async function _0() {
  const a = await fetch("/settings");
  if (!a.ok) throw new Error("settings fetch failed");
  return a.json();
}
async function b0(a) {
  if (!(await fetch("/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ settings: a })
  })).ok) throw new Error("settings patch failed");
}
async function Xp(a, i) {
  const r = await fetch(`/settings/inventory/${a}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(i)
  });
  if (!r.ok) throw new Error("inventory patch failed");
  return r.json();
}
async function g0() {
  const a = await fetch("/settings/network");
  if (!a.ok) throw new Error("network status failed");
  return a.json();
}
async function v0() {
  const a = await fetch("/settings/network/apply", { method: "POST" });
  if (!a.ok) throw new Error("network apply failed");
  return a.json();
}
async function Qp() {
  const a = await fetch("/settings/catalog/status");
  if (!a.ok) throw new Error("catalog status failed");
  return a.json();
}
async function x0() {
  const a = await fetch("/admin/reload-catalogs", { method: "POST" });
  if (!a.ok) throw new Error("catalog reload failed");
  return a.json();
}
async function y0() {
  const a = await fetch("/settings/esphome/devices");
  if (!a.ok) throw new Error("esphome devices failed");
  return a.json();
}
async function Zp(a, i) {
  const r = await fetch("/settings/esphome/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ seat_id: a, action: i })
  });
  if (!r.ok) throw new Error("esphome job failed");
  return r.json();
}
async function w0() {
  const a = await fetch("/settings/esphome/jobs");
  if (!a.ok) throw new Error("esphome jobs failed");
  return (await a.json()).jobs;
}
async function j0() {
  return (await fetch("/settings/integrations/test-ollama", { method: "POST" })).json();
}
async function S0() {
  return (await fetch("/settings/integrations/test-cannalib", { method: "POST" })).json();
}
async function Kp(a) {
  await fetch("/settings/zigbee/permit-join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enabled: a })
  });
}
async function k0() {
  const a = await fetch("/settings/zigbee/devices");
  if (!a.ok) throw new Error("zigbee devices failed");
  return a.json();
}
async function eb(a, i, r) {
  const o = await fetch(`/settings/calibration/${encodeURIComponent(a)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cal_type: i, steps: r })
  });
  if (!o.ok) throw new Error("calibration save failed");
  return o.json();
}
function N0() {
  return "/settings/backup/export";
}
async function C0(a) {
  const i = new FormData();
  i.append("file", a);
  const r = await fetch("/settings/backup/import", { method: "POST", body: i });
  if (!r.ok) throw new Error("backup import failed");
  return r.json();
}
const E0 = {
  heater: "switch.dsc_hub_heater_demand",
  heatmat: "switch.dsc_hub_grow_mat_demand",
  humidifier: "switch.dsc_hub_humidifier_demand",
  dehumidifier: "switch.dsc_hub_dehumidifier_demand",
  ac: "switch.dsc_hub_ac_demand",
  clone_humidifier: "switch.dsc_hub_clone_humidifier_demand"
};
function Ht() {
  const a = oi(), i = sa(), r = x.useCallback(
    async (d, h, f) => i === "pi" ? f0(d, h, f ?? {}) : a.callService(d, h, f),
    [a, i]
  ), o = x.useCallback(
    async (d, h) => {
      if (i === "pi")
        return m0(d, h);
      const f = E0[d];
      return a.callService("switch", h ? "turn_on" : "turn_off", { entity_id: f });
    },
    [a, i]
  );
  return { callService: r, setDemand: o };
}
function el(a) {
  const { state: i, available: r, entity: o } = oi(), d = kt();
  if (sa() === "pi") {
    const f = Yr(a, d);
    if (f != null)
      return {
        state: f,
        available: P_(a, d),
        attributes: W_(a, d)
      };
  }
  return {
    state: i(a, "unavailable"),
    available: r(a),
    attributes: o(a)?.attributes ?? {}
  };
}
function nn({
  name: a,
  size: i = 16,
  className: r,
  color: o = "currentColor"
}) {
  return /* @__PURE__ */ s.jsx(
    "span",
    {
      className: `dsc-icon${r ? ` ${r}` : ""}`,
      role: "img",
      "aria-hidden": !0,
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: i,
        height: i,
        color: o,
        flexShrink: 0,
        lineHeight: 0
      },
      dangerouslySetInnerHTML: { __html: Jy(a) }
    }
  );
}
function le({
  title: a,
  children: i,
  className: r = "",
  style: o,
  icon: d
}) {
  return /* @__PURE__ */ s.jsxs("section", { className: `dsc-card ${r}`.trim(), style: o, children: [
    a ? /* @__PURE__ */ s.jsxs("h3", { className: "dsc-card-title", children: [
      d ? /* @__PURE__ */ s.jsx(nn, { name: d, size: 14, color: "var(--dsc-teal)" }) : null,
      a
    ] }) : null,
    i
  ] });
}
function se({
  children: a,
  primary: i,
  teal: r,
  variant: o,
  onClick: d,
  type: h = "button",
  disabled: f
}) {
  const m = ["dsc-btn"];
  if (i && m.push("primary"), r && m.push("teal"), o)
    switch (o) {
      case "primary":
        m.push("dsc-btn-primary");
        break;
      case "secondary":
        m.push("dsc-btn-secondary");
        break;
      case "danger":
        m.push("dsc-btn-danger");
        break;
    }
  return /* @__PURE__ */ s.jsx("button", { type: h, className: m.join(" "), onClick: d, disabled: f, children: a });
}
function St({
  label: a,
  value: i,
  unit: r,
  sub: o,
  tone: d = "normal",
  stale: h,
  onClick: f
}) {
  const m = (() => {
    switch (d) {
      case "ok":
        return "dsc-status-ok";
      case "warn":
        return "dsc-status-warn";
      case "bad":
        return "dsc-status-bad";
      case "muted":
        return "dsc-status-muted";
      case "normal":
        return h ? "dsc-status-muted" : "";
      default:
        return d;
    }
  })(), _ = /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsxs("div", { className: `dsc-kpi-value ${m}`.trim(), children: [
      i,
      r ? /* @__PURE__ */ s.jsx("span", { className: "dsc-kpi-unit", children: r }) : null,
      h ? /* @__PURE__ */ s.jsx("span", { className: "dsc-held-tag", children: "HELD" }) : null
    ] }),
    o ? /* @__PURE__ */ s.jsx("div", { className: "dsc-kpi-sub", children: o }) : null
  ] });
  return f ? /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-kpi-hit", onClick: f, title: `History · ${a}`, children: /* @__PURE__ */ s.jsx(le, { title: a, className: h ? "is-stale" : void 0, children: _ }) }) : /* @__PURE__ */ s.jsx(le, { title: a, className: h ? "is-stale" : void 0, children: _ });
}
function Nt({
  title: a,
  subtitle: i,
  icon: r,
  primaryAction: o,
  actions: d
}) {
  const h = o || d ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-page-header-actions", children: [
    o,
    d
  ] }) : null;
  return /* @__PURE__ */ s.jsxs("header", { className: "dsc-page-header", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-page-header-main", children: [
      r ? /* @__PURE__ */ s.jsx(nn, { name: r, size: 22, color: "var(--dsc-teal)" }) : null,
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("h1", { className: "dsc-page-title", children: a }),
        i ? /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: i }) : null
      ] })
    ] }),
    h
  ] });
}
function H({
  label: a,
  tone: i = "muted",
  pulse: r,
  motion: o,
  icon: d,
  onClick: h
}) {
  const f = o ?? (r ? "pulse" : void 0), m = `dsc-chip dsc-chip--${i}${f ? ` dsc-chip--${f}` : ""}`, _ = o === "fan" ? /* @__PURE__ */ s.jsx(nn, { name: "fan", size: 11, className: "dsc-fan-spin" }) : d ? /* @__PURE__ */ s.jsx(nn, { name: d, size: 11 }) : null;
  return h ? /* @__PURE__ */ s.jsxs("button", { type: "button", className: `${m} is-clickable`, onClick: h, children: [
    _,
    a
  ] }) : /* @__PURE__ */ s.jsxs("span", { className: m, children: [
    _,
    a
  ] });
}
function Ye({
  entityId: a,
  label: i,
  warnWhenMissing: r,
  icon: o,
  showBrightness: d
}) {
  const { state: h, available: f, attributes: m } = el(a), { callService: _ } = Ht(), b = h === "on", v = f, g = a.split(".")[0], j = () => {
    if (v) {
      if (g === "switch" || g === "input_boolean") {
        _(g, b ? "turn_off" : "turn_on", { entity_id: a });
        return;
      }
      g === "light" && _("light", b ? "turn_off" : "turn_on", { entity_id: a });
    }
  }, w = d !== !1 && g === "light" && b ? Math.round(Number(m?.brightness ?? 0) / 255 * 100) : null;
  return /* @__PURE__ */ s.jsxs(
    "button",
    {
      type: "button",
      className: `dsc-demand${b ? " is-on" : ""}${v ? "" : " is-missing"}`,
      onClick: j,
      disabled: !v && !r,
      title: v ? a : r || `${a} unavailable`,
      children: [
        o ? /* @__PURE__ */ s.jsx(nn, { name: o, size: 22, color: "var(--dsc-teal)", className: "dsc-demand-icon" }) : null,
        /* @__PURE__ */ s.jsx("span", { className: "dsc-demand-label", children: i }),
        /* @__PURE__ */ s.jsx("span", { className: "dsc-demand-state", children: v ? w != null ? `${w}%` : b ? "ON" : "OFF" : r || "—" })
      ]
    }
  );
}
function Da({
  entityId: a,
  label: i,
  icon: r
}) {
  const { state: o, available: d, attributes: h } = el(a), { callService: f } = Ht(), m = d, _ = o, b = h?.options || [], v = a.split(".")[0], [g, j] = x.useState(!1), w = x.useRef(!1), [S, N] = x.useState(_);
  x.useEffect(() => {
    !w.current && !g && N(_);
  }, [_, g, a]);
  const C = (z) => {
    N(z), j(!1), !(!m || !z) && (v === "select" ? f("select", "select_option", { entity_id: a, option: z }) : v === "input_select" && f("input_select", "select_option", { entity_id: a, option: z }));
  }, E = g ? S : _;
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-entity-select${m ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ s.jsxs("span", { className: "dsc-entity-select-label", children: [
      r ? /* @__PURE__ */ s.jsx(nn, { name: r, size: 13, color: "var(--dsc-teal)" }) : null,
      i
    ] }),
    /* @__PURE__ */ s.jsxs(
      "select",
      {
        value: E,
        disabled: !m,
        onFocus: () => {
          w.current = !0, j(!0);
        },
        onBlur: () => {
          w.current = !1, j(!1);
        },
        onChange: (z) => C(z.target.value),
        children: [
          !b.includes(E) && E ? /* @__PURE__ */ s.jsx("option", { value: E, children: E }) : null,
          b.map((z) => /* @__PURE__ */ s.jsx("option", { value: z, children: z }, z))
        ]
      }
    )
  ] });
}
function Ha({
  entityId: a,
  label: i,
  disabled: r
}) {
  const { available: o, attributes: d, state: h } = el(a), { callService: f } = Ht(), m = o, _ = Number(d?.percentage ?? 0), b = h === "on", v = r || !m, [g, j] = x.useState(!1), w = x.useRef(!1), [S, N] = x.useState(Number.isFinite(_) ? _ : 0);
  x.useEffect(() => {
    !w.current && !g && Number.isFinite(_) && N(_);
  }, [_, g, a]);
  const C = (z) => {
    v || f("fan", "set_percentage", { entity_id: a, percentage: z });
  }, E = g ? S : Number.isFinite(_) ? _ : 0;
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-fan-slider${v ? " is-disabled" : ""}`, children: [
    /* @__PURE__ */ s.jsxs("span", { className: "dsc-fan-slider-label", children: [
      i,
      /* @__PURE__ */ s.jsx("strong", { children: m ? `${Math.round(E)}%` : "—" }),
      !b && m ? /* @__PURE__ */ s.jsx("em", { className: "dsc-muted", children: "off" }) : null
    ] }),
    /* @__PURE__ */ s.jsx(
      "input",
      {
        type: "range",
        min: 0,
        max: 100,
        step: 1,
        value: E,
        disabled: v,
        onPointerDown: (z) => {
          z.target.setPointerCapture(z.pointerId), w.current = !0, j(!0);
        },
        onPointerUp: (z) => {
          w.current = !1, j(!1), C(Number(z.target.value));
        },
        onPointerCancel: () => {
          w.current = !1, j(!1);
        },
        onLostPointerCapture: () => {
          w.current = !1, j(!1);
        },
        onChange: (z) => {
          const U = Number(z.target.value);
          N(U), w.current || C(U);
        }
      }
    )
  ] });
}
function bd(a) {
  return !a || a === "unknown" || a === "unavailable" ? "" : a;
}
function Xr({
  entityId: a,
  label: i,
  multiline: r = !1,
  rows: o = 2
}) {
  const { available: d, state: h } = Ce(), { callService: f } = Ht(), m = d(a), _ = bd(h(a, "")), [b, v] = x.useState(_), g = x.useRef(!1);
  x.useEffect(() => {
    g.current || v(_);
  }, [_]);
  const j = () => {
    m && f("input_text", "set_value", { entity_id: a, value: b });
  }, w = {
    value: b,
    disabled: !m,
    onFocus: () => {
      g.current = !0;
    },
    onChange: (S) => v(S.target.value),
    onBlur: () => {
      g.current = !1, j();
    },
    onKeyDown: (S) => {
      S.key === "Enter" && !r && S.currentTarget.blur();
    }
  };
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-target-num${m ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ s.jsx("span", { className: "dsc-target-num-label", children: i }),
    r ? /* @__PURE__ */ s.jsx("textarea", { rows: o, ...w }) : /* @__PURE__ */ s.jsx("input", { type: "text", ...w })
  ] });
}
function M0(a) {
  const i = bd(a);
  return i ? i.slice(0, 5) : "";
}
function T0(a) {
  return a ? a.length === 5 ? `${a}:00` : a : "00:00:00";
}
function Jp({ entityId: a, label: i }) {
  const { available: r, state: o } = Ce(), { callService: d } = Ht(), h = r(a), f = M0(o(a, "")), [m, _] = x.useState(f), b = x.useRef(!1);
  x.useEffect(() => {
    b.current || _(f);
  }, [f]);
  const v = () => {
    !h || !m || d("time", "set_value", { entity_id: a, time: T0(m) });
  };
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-target-num${h ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ s.jsx("span", { className: "dsc-target-num-label", children: i }),
    /* @__PURE__ */ s.jsx(
      "input",
      {
        type: "time",
        value: m,
        disabled: !h,
        onFocus: () => {
          b.current = !0;
        },
        onChange: (g) => _(g.target.value),
        onBlur: () => {
          b.current = !1, v();
        }
      }
    )
  ] });
}
function R0({ entityId: a, label: i }) {
  const { available: r, entity: o, state: d } = Ce(), { callService: h } = Ht(), f = r(a), m = !!o(a)?.attributes?.has_time, _ = bd(d(a, "")), b = (S) => S ? m ? S.slice(0, 16).replace(" ", "T") : S.slice(0, 10) : "", [v, g] = x.useState(b(_)), j = x.useRef(!1);
  x.useEffect(() => {
    j.current || g(b(_));
  }, [_, m]);
  const w = () => {
    if (!f || !v) return;
    const S = m ? v.replace("T", " ") : v;
    m ? h("input_datetime", "set_datetime", { entity_id: a, datetime: S }) : h("input_datetime", "set_datetime", { entity_id: a, date: v });
  };
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-target-num${f ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ s.jsx("span", { className: "dsc-target-num-label", children: i }),
    /* @__PURE__ */ s.jsx(
      "input",
      {
        type: m ? "datetime-local" : "date",
        value: v,
        disabled: !f,
        onFocus: () => {
          j.current = !0;
        },
        onChange: (S) => g(S.target.value),
        onBlur: () => {
          j.current = !1, w();
        }
      }
    )
  ] });
}
function Or({
  label: a,
  empty: i = !1,
  onClick: r
}) {
  const o = /* @__PURE__ */ s.jsx("span", { className: `dsc-result-chip${i ? " is-empty" : ""}`, children: /* @__PURE__ */ s.jsx("span", { children: a }) });
  return r ? /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-result-chip-hit", onClick: r, children: o }) : o;
}
function Rt({
  open: a,
  onDismiss: i,
  onConfirm: r,
  title: o,
  confirmLabel: d = "Confirm",
  help: h,
  children: f
}) {
  const m = x.useId(), _ = x.useRef(null), b = x.useRef(null);
  return x.useEffect(() => {
    if (!a) return;
    b.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, _.current?.querySelector("button, input, select, textarea, [href]")?.focus();
    const j = (w) => {
      w.key === "Escape" && (w.preventDefault(), i());
    };
    return window.addEventListener("keydown", j), () => {
      window.removeEventListener("keydown", j), b.current?.focus?.();
    };
  }, [a, i]), a ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-decision-root is-open", role: "presentation", children: [
    /* @__PURE__ */ s.jsx("div", { className: "dsc-decision-scrim", onClick: i }),
    /* @__PURE__ */ s.jsxs(
      "aside",
      {
        ref: _,
        className: "dsc-decision-panel",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": m,
        children: [
          /* @__PURE__ */ s.jsxs("header", { className: "dsc-decision-head", children: [
            /* @__PURE__ */ s.jsx("h2", { id: m, children: o }),
            /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-icon-btn", "aria-label": "Dismiss", onClick: i, children: /* @__PURE__ */ s.jsx(nn, { name: "close", size: 16 }) })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "dsc-decision-body", children: f }),
          h ? /* @__PURE__ */ s.jsx("div", { className: "dsc-decision-help", children: h }) : /* @__PURE__ */ s.jsx("div", { className: "dsc-decision-help is-empty" }),
          /* @__PURE__ */ s.jsxs("footer", { className: "dsc-decision-foot", children: [
            /* @__PURE__ */ s.jsx(se, { onClick: i, children: "Dismiss" }),
            r ? /* @__PURE__ */ s.jsx(se, { primary: !0, onClick: r, children: d }) : null
          ] })
        ]
      }
    )
  ] }) : null;
}
function A0(a) {
  const i = [], r = (f, m = "unknown") => a.state(f, m), o = (f) => r(f) === "on", d = a.entity?.("sensor.dsc_keepup_gaps")?.attributes ?? {}, h = String(d.full_auto_honesty ?? "").trim();
  if (a.available && a.available("binary_sensor.dsc_hub_link") && !o("binary_sensor.dsc_hub_link") && i.push({
    id: "hub-link",
    label: "Hub link down",
    detail: "The hub link is down — readings are held at their last known values.",
    tone: "bad",
    href: "/fleet",
    cta: "Open Fleet",
    priority: 9
  }), a.available && !a.available("sensor.dsc_hub_uptime")) {
    const f = a.entity?.("sensor.dsc_hub_uptime")?.last_changed;
    let m = "";
    if (f) {
      const _ = Date.now() - Date.parse(f);
      if (Number.isFinite(_) && _ >= 0) {
        const b = Math.floor(_ / 6e4);
        m = b < 60 ? ` · offline ${Math.max(1, b)}m` : ` · offline ${(b / 60).toFixed(1)}h`;
      }
    }
    i.push({
      id: "hub-dark",
      label: "Hub offline",
      detail: `Showing last good vitals${m}. Reconnect snaps to live.`,
      tone: "bad",
      href: "/fleet",
      cta: "Open Fleet",
      priority: 10
    });
  }
  if (a.available && !a.available("sensor.dsc_hub_heartbeat") && i.push({
    id: "beat-dark",
    label: "Heartbeat missing",
    detail: "The hub's heartbeat has stopped arriving — readings stay held until it returns.",
    tone: "bad",
    href: "/live/mission",
    cta: "Mission",
    priority: 12
  }), a.available && !a.available("binary_sensor.dsc_hub_panel_link") && i.push({
    id: "panel-dark",
    label: "Panel link down",
    detail: "The control panel link is down — Mission shows how long it has been out.",
    tone: "warn",
    href: "/fleet",
    cta: "Open Fleet",
    priority: 14
  }), o("binary_sensor.dsc_reduced_kit")) {
    const f = a.entity?.("binary_sensor.dsc_reduced_kit")?.attributes ?? {}, m = String(f.offline ?? "").trim();
    i.push({
      id: "reduced-kit",
      label: "Capacity offline",
      detail: m || "A device that should be running is temporarily out of service or locked out.",
      tone: "warn",
      href: "/fleet",
      cta: "Review kit",
      priority: 20
    });
  }
  return h && o("switch.dsc_hub_tent_full_auto_mode") && i.push({
    id: "keepup",
    label: "Keep-up gaps",
    detail: h,
    tone: "warn",
    href: "/live/climate",
    cta: "Fix Climate",
    priority: 30
  }), o("binary_sensor.dsc_clone_dark_period_violation") && i.push({
    id: "dark-viol",
    label: "2×4 dark violation",
    detail: "The lamp is on during the dark period — check Light.",
    tone: "bad",
    href: "/live/light",
    cta: "Open Light",
    priority: 25
  }), o("binary_sensor.dsc_clone_light_missing_in_window") && i.push({
    id: "photo-missing",
    label: "Light missing in window",
    detail: "The lamp did not deliver its hours in the open window.",
    tone: "bad",
    href: "/live/light",
    cta: "Open Light",
    priority: 24
  }), o("binary_sensor.dsc_hub_light_catchup_active") && i.push({
    id: "photo-catchup",
    label: "Light catch-up",
    detail: "Light catch-up is running — the hours gauge shows what was actually delivered.",
    tone: "warn",
    href: "/live/light",
    cta: "Open Light",
    priority: 28
  }), o("binary_sensor.dsc_hub_climate_sensor_fault") && i.push({
    id: "climate-fault",
    label: "Climate sensor fault",
    detail: "A climate sensor cannot be trusted right now — its readings are held.",
    tone: "bad",
    href: "/live/climate",
    cta: "Open Climate",
    priority: 15
  }), o("binary_sensor.dsc_hub_emergency_failsafe") && i.push({
    id: "failsafe",
    label: "Emergency failsafe",
    detail: "Hub failsafe active.",
    tone: "bad",
    href: "/live/mission",
    cta: "Mission",
    priority: 5
  }), i.sort((f, m) => f.priority - m.priority);
}
function z0(a, i) {
  const r = [];
  return a.hub.online || (r.push({
    id: "hub-link",
    label: "Hub link down",
    detail: "The hub is offline — readings are held at their last known values.",
    tone: "bad",
    href: "/fleet",
    cta: "Open Fleet",
    priority: 9
  }), r.push({
    id: "hub-dark",
    label: "Hub offline",
    detail: "Showing last good vitals. Reconnect snaps to live.",
    tone: "bad",
    href: "/fleet",
    cta: "Open Fleet",
    priority: 10
  })), a.hub.online && a.hub.values.heartbeat == null && r.push({
    id: "beat-dark",
    label: "Heartbeat missing",
    detail: "The hub's heartbeat has stopped arriving — readings stay held until it returns.",
    tone: "bad",
    href: "/live/mission",
    cta: "Mission",
    priority: 12
  }), a.panel.online || r.push({
    id: "panel-dark",
    label: "Panel link down",
    detail: "The control panel link is down — Mission shows how long it has been out.",
    tone: "warn",
    href: "/fleet",
    cta: "Open Fleet",
    priority: 14
  }), a.system.reduced_kit && r.push({
    id: "reduced-kit",
    label: "Capacity offline",
    detail: "A device that should be running is temporarily out of service or locked out.",
    tone: "warn",
    href: "/fleet",
    cta: "Review kit",
    priority: 20
  }), i && r.push(...A0(i).filter(
    (o) => !["hub-link", "hub-dark", "beat-dark", "panel-dark", "reduced-kit"].includes(o.id)
  )), r.sort((o, d) => o.priority - d.priority);
}
function O0(a) {
  return a[0] ?? null;
}
function tb() {
  const a = Ce(), i = kt();
  return x.useMemo(
    () => z0(i, {
      state: a.state,
      available: a.available,
      entity: a.entity
    }),
    [i, a.state, a.available, a.entity, a.tick]
  );
}
function D0({ gaps: a }) {
  const i = tb(), r = a ?? i, [o, d] = x.useState(null), h = ft();
  return r.length ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsx("div", { className: "dsc-honesty-rail", "aria-label": "Honesty gaps", children: r.slice(0, 6).map((f) => /* @__PURE__ */ s.jsx(
      "button",
      {
        type: "button",
        className: "dsc-honesty-hit",
        onClick: () => d(f),
        children: /* @__PURE__ */ s.jsx(H, { icon: "alert", label: f.label, tone: f.tone === "bad" ? "bad" : "warn" })
      },
      f.id
    )) }),
    /* @__PURE__ */ s.jsx(
      Rt,
      {
        open: o != null,
        onDismiss: () => d(null),
        onConfirm: o ? () => {
          h(o.href), d(null);
        } : void 0,
        title: o?.label ?? "Honesty",
        confirmLabel: o?.cta ?? "Go",
        help: null,
        children: /* @__PURE__ */ s.jsx("p", { children: o?.detail })
      }
    )
  ] }) : /* @__PURE__ */ s.jsx("div", { className: "dsc-honesty-rail", "aria-label": "Honesty", children: /* @__PURE__ */ s.jsx(H, { icon: "ok", label: "Kit honest", tone: "ok" }) });
}
function H0({ gaps: a }) {
  const i = tb(), o = O0(a ?? i), d = ft();
  return o ? /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass dsc-next-rec", title: "Do this next", icon: "alert", children: [
    /* @__PURE__ */ s.jsxs("p", { style: { margin: "0 0 8px" }, children: [
      /* @__PURE__ */ s.jsx("strong", { children: o.label }),
      " — ",
      o.detail
    ] }),
    /* @__PURE__ */ s.jsx(se, { primary: !0, onClick: () => d(o.href), children: o.cta })
  ] }) : /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass dsc-next-rec", title: "Next", icon: "ok", children: [
    /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: "No critical gaps — fly Live or open Twin." }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", children: [
      /* @__PURE__ */ s.jsx(se, { primary: !0, onClick: () => d("/live/twin"), children: "Open Twin" }),
      /* @__PURE__ */ s.jsx(se, { teal: !0, onClick: () => d("/live/climate"), children: "Climate Want" })
    ] })
  ] });
}
const ta = "7.2.0", cc = [
  `/local/DSC-HUB.js?v=${ta}`,
  `/hacsfiles/DSC-HUB/DSC-HUB.js?v=${ta}`
], nb = `/local/vendor/three.min.js?v=${ta}`, ab = `/local/vendor/dsc-dash-fx.js?v=${ta}`, sb = {
  "dsc-catalog-browse-card": [`/local/dsc-catalog-browse-card.js?v=${ta}`],
  "dsc-build-plant-card": [`/local/dsc-build-plant-card.js?v=${ta}`],
  "dsc-the-dash-card": [nb, ab, `/local/dsc-the-dash-card.js?v=${ta}`],
  "dsc-airflow-map-card": [`/local/dsc-airflow-map-card.js?v=${ta}`],
  "dsc-system-map-card": [`/local/dsc-system-map-card.js?v=${ta}`, ...cc]
};
function ni() {
  return typeof globalThis.THREE < "u";
}
const Dr = /* @__PURE__ */ new Map();
function Qr(a) {
  if (document.querySelector(`script[data-dsc-autoload="${a}"]`))
    return Dr.get(a) ?? Promise.resolve();
  if (Dr.has(a)) return Dr.get(a);
  const r = new Promise((o, d) => {
    const h = document.createElement("script");
    h.src = a, h.async = !0, h.dataset.dscAutoload = a, h.onload = () => o(), h.onerror = () => d(new Error(`Failed to load ${a}`)), document.head.appendChild(h);
  });
  return Dr.set(a, r), r;
}
function L0(a) {
  const i = sb[a] ?? [], r = [];
  for (const o of [...i, ...cc])
    r.includes(o) || r.push(o);
  return r;
}
async function Pp() {
  if (ni()) return !0;
  for (const a of [nb, ...cc])
    if (a) {
      try {
        await Qr(a);
      } catch {
      }
      if (ni()) return !0;
    }
  return ni();
}
async function lb(a, i = 12e3) {
  if (a === "dsc-the-dash-card" && (await Pp(), ni()))
    try {
      await Qr(ab);
    } catch {
    }
  const r = sb[a] ?? [];
  for (const o of r)
    if (o)
      try {
        await Qr(o);
      } catch {
      }
  if (a === "dsc-the-dash-card" && !ni() && await Pp(), customElements.get(a)) return !0;
  for (const o of cc) {
    try {
      await Qr(o);
    } catch {
    }
    if (customElements.get(a)) return !0;
  }
  try {
    return await Promise.race([
      customElements.whenDefined(a),
      new Promise(
        (o, d) => window.setTimeout(() => d(new Error("timeout")), i)
      )
    ]), !!customElements.get(a);
  } catch {
    return !!customElements.get(a);
  }
}
function $0(a) {
  return L0(a).map((i) => i.split("?")[0]);
}
const gd = [
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
], ib = new Map(gd.map((a) => [a.id, a])), ui = gd[2];
function rb(a) {
  return `input_select.dsc_pot${a}_vessel`;
}
function U0(a) {
  const i = String(a || "").trim();
  return ib.has(i) ? i : ui.id;
}
function ed(a, i) {
  const r = ib.get(U0(a)) ?? ui;
  return Number.isFinite(i) && i > 0 ? { ...r, volumeL: i } : r;
}
function $a(a, i, r) {
  const o = rb(a), d = i(o, "");
  if (d && d !== "unknown" && d !== "unavailable")
    return ed(d);
  const h = r?.("sensor.dsc_plant_roster_summary")?.attributes?.slots;
  if (Array.isArray(h)) {
    const f = h.find((m) => String(m.pot) === String(a));
    if (f?.vessel) return ed(f.vessel);
  }
  return ui;
}
function B0(a) {
  switch (a) {
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
      return a;
  }
}
const Wp = [
  "var(--dsc-soil-1)",
  "var(--dsc-soil-2)",
  "var(--dsc-soil-3)",
  "var(--dsc-soil-4)"
];
function Ip(a) {
  switch (a) {
    case "bag":
      return "M18 8 Q18 4 32 4 L68 4 Q82 4 82 8 L86 88 Q86 96 50 96 Q14 96 14 88 Z";
    case "taper":
      return "M24 6 L76 6 L88 92 Q88 98 50 98 Q12 98 12 92 Z";
    case "tall":
      return "M28 4 L72 4 L78 94 Q78 98 50 98 Q22 98 22 94 Z";
    case "airpot":
      return "M26 6 L74 6 L84 90 Q84 96 50 96 Q16 96 16 90 Z";
    default:
      return a;
  }
}
function zn({
  spec: a,
  layers: i = [],
  size: r = 56,
  label: o
}) {
  const d = `vclip-${a.id}-${a.silhouette}`, h = i.reduce((m, _) => m + _.pct, 0) || 1;
  let f = 0;
  return /* @__PURE__ */ s.jsxs("span", { className: "dsc-vessel-glyph", title: a.label, children: [
    /* @__PURE__ */ s.jsxs("svg", { width: r, height: r * 1.15, viewBox: "0 0 100 100", "aria-hidden": !0, children: [
      /* @__PURE__ */ s.jsx("defs", { children: /* @__PURE__ */ s.jsx("clipPath", { id: d, children: /* @__PURE__ */ s.jsx("path", { d: Ip(a.silhouette) }) }) }),
      /* @__PURE__ */ s.jsx(
        "path",
        {
          d: Ip(a.silhouette),
          fill: "rgba(8,12,10,0.85)",
          stroke: B0(a.material),
          strokeWidth: "2.4",
          strokeDasharray: a.silhouette === "airpot" ? "5 3" : void 0
        }
      ),
      /* @__PURE__ */ s.jsx("g", { clipPath: `url(#${d})`, children: i.map((m, _) => {
        const b = m.pct / h * 88, v = 96 - f - b;
        return f += b, /* @__PURE__ */ s.jsx(
          "rect",
          {
            x: "12",
            y: v,
            width: "76",
            height: b,
            fill: m.color || Wp[_ % Wp.length]
          },
          `${m.name}-${_}`
        );
      }) })
    ] }),
    o ? /* @__PURE__ */ s.jsxs("span", { className: "dsc-vessel-glyph-label", children: [
      a.volumeL,
      "L"
    ] }) : null
  ] });
}
function vd({
  label: a,
  icon: i,
  onClick: r,
  className: o = "",
  expanded: d
}) {
  return /* @__PURE__ */ s.jsx(
    "button",
    {
      type: "button",
      className: `dsc-icon-btn ${o}`.trim(),
      "aria-label": a,
      title: a,
      "aria-expanded": d,
      onClick: r,
      children: /* @__PURE__ */ s.jsx(nn, { name: i, size: 16 })
    }
  );
}
function F0(a) {
  return a instanceof Element ? !!a.closest(
    "ha-more-info-dialog, ha-dialog, ha-more-info-info, .ha-more-info, home-assistant-dialog"
  ) : !1;
}
function oc({
  items: a,
  label: i = "More actions"
}) {
  const [r, o] = x.useState(!1), d = x.useRef(null);
  return x.useEffect(() => {
    if (!r) return;
    const h = (m) => {
      F0(m.target) || d.current?.contains(m.target) || o(!1);
    }, f = (m) => {
      m.key === "Escape" && o(!1);
    };
    return document.addEventListener("mousedown", h), window.addEventListener("keydown", f), () => {
      document.removeEventListener("mousedown", h), window.removeEventListener("keydown", f);
    };
  }, [r]), /* @__PURE__ */ s.jsxs("div", { className: "dsc-overflow", ref: d, children: [
    /* @__PURE__ */ s.jsx(
      vd,
      {
        label: i,
        icon: "more",
        expanded: r,
        onClick: () => o((h) => !h)
      }
    ),
    r ? /* @__PURE__ */ s.jsx("div", { className: "dsc-overflow-menu", role: "menu", children: a.map((h) => /* @__PURE__ */ s.jsx(
      "button",
      {
        type: "button",
        role: "menuitem",
        onClick: () => {
          o(!1), h.onSelect();
        },
        children: h.label
      },
      h.id
    )) }) : null
  ] });
}
function e_(a) {
  return Array.from(
    a.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((i) => !i.hasAttribute("disabled") && i.tabIndex !== -1);
}
function os({
  open: a,
  onClose: i,
  title: r,
  side: o = "right",
  children: d
}) {
  const h = x.useId(), f = x.useRef(null), m = x.useRef(null);
  return x.useEffect(() => {
    if (!a) return;
    m.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const _ = f.current;
    (_ ? e_(_)[0] : null)?.focus();
    const v = (g) => {
      if (g.key === "Escape") {
        g.preventDefault(), i();
        return;
      }
      if (g.key !== "Tab" || !_) return;
      const j = e_(_);
      if (!j.length) return;
      const w = j[0], S = j[j.length - 1];
      g.shiftKey && document.activeElement === w ? (g.preventDefault(), S.focus()) : !g.shiftKey && document.activeElement === S && (g.preventDefault(), w.focus());
    };
    return window.addEventListener("keydown", v), () => {
      window.removeEventListener("keydown", v), m.current?.focus?.();
    };
  }, [a, i]), /* @__PURE__ */ s.jsxs("div", { className: `dsc-drawer-root${a ? " is-open" : ""}`, "aria-hidden": !a, children: [
    /* @__PURE__ */ s.jsx("div", { className: "dsc-drawer-scrim", onClick: i }),
    /* @__PURE__ */ s.jsxs(
      "aside",
      {
        ref: f,
        className: `dsc-drawer-panel ${o}`,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": h,
        children: [
          /* @__PURE__ */ s.jsx(
            "button",
            {
              type: "button",
              className: "dsc-drawer-rail",
              "aria-label": "Close",
              title: "Close",
              onClick: i,
              children: "Close"
            }
          ),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-drawer-head", children: [
            /* @__PURE__ */ s.jsx("h2", { id: h, children: r }),
            /* @__PURE__ */ s.jsx(vd, { label: "Close", icon: "close", onClick: i })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "dsc-drawer-body", children: d })
        ]
      }
    )
  ] });
}
function G0(a) {
  if (!a || !a.trim()) return [];
  const i = a.split(/[|/·]/).map((o) => o.trim()).filter(Boolean), r = [];
  for (const o of i) {
    const d = o.match(/^(.+?)\s*[·:]?\s*(\d+(?:\.\d+)?)\s*%?$/);
    if (d) {
      r.push({ name: d[1].trim(), pct: Number(d[2]) });
      continue;
    }
    const h = o.match(/(\d+(?:\.\d+)?)\s*%\s*(.+)$/);
    if (h) {
      r.push({ name: h[2].trim(), pct: Number(h[1]) });
      continue;
    }
    o && r.push({ name: o, pct: 0 });
  }
  if (r.length && r.every((o) => o.pct === 0)) {
    const o = 100 / r.length;
    return r.map((d) => ({ ...d, pct: o }));
  }
  return r.filter((o) => o.pct > 0);
}
function V0({
  layers: a,
  valid: i,
  emptyLabel: r = "No blend on roster seat",
  spec: o
}) {
  const d = o ?? ui, h = a.reduce((m, _) => m + _.pct, 0), f = i ?? (a.length > 0 && Math.round(h) === 100);
  return a.length ? /* @__PURE__ */ s.jsx("div", { className: `dsc-soil${f ? " is-valid" : ""}`, children: /* @__PURE__ */ s.jsx(zn, { spec: d, layers: a, size: 180, label: !0 }) }) : /* @__PURE__ */ s.jsxs("div", { className: "dsc-soil", children: [
    /* @__PURE__ */ s.jsx(zn, { spec: d, size: 160 }),
    /* @__PURE__ */ s.jsx("div", { className: "dsc-soil-empty", children: r })
  ] });
}
function Tt(a, i = "—") {
  return !a || a === "unknown" || a === "unavailable" || a === "none" ? i : a;
}
function cb(a) {
  const i = String(a || "").trim().toLowerCase();
  return i === "clone" || i === "2x4" || i === "2×4" ? "clone" : i === "main" || i === "4x8" || i === "4×8" ? "main" : "unassigned";
}
function Pr(a, i) {
  return cb(a(`input_select.dsc_pot${i}_tent`, "unassigned"));
}
function uc(a) {
  switch (a) {
    case "clone":
      return "2×4";
    case "main":
      return "4×8";
    case "unassigned":
      return "Unassigned";
    default:
      return a;
  }
}
function us(a, i) {
  const { state: r, entity: o } = i, d = o("sensor.dsc_plant_roster_summary")?.attributes?.slots || [], h = Array.isArray(d) ? d.find((_) => String(_.pot) === String(a)) : void 0, f = (_, b) => {
    const v = Tt(r(_, ""));
    return v !== "—" ? v : Tt(r(b, ""));
  }, m = Tt(h?.blend, "");
  return {
    pot: a,
    plantName: Tt(r(`text.dsc_pot${a}_plant_name`, "")),
    strainDisplay: Tt(r(`sensor.dsc_pot${a}_strain_display`, "")),
    sprout: Tt(r(`datetime.dsc_pot${a}_sprout_date`, ""), "—").slice(0, 10),
    days: Tt(r(`sensor.dsc_pot${a}_days_since_sprout`, "")),
    stage: Tt(r(`sensor.dsc_pot${a}_expected_stage`, "")),
    growthStage: Tt(r(`select.dsc_pot${a}_growth_stage`, "")),
    tent: Pr(r, a),
    blend: m,
    recipe: Tt(h?.recipe, ""),
    notes: Tt(h?.notes, ""),
    layers: G0(m),
    moisture: f(`sensor.dsc_pot${a}_got_moisture`, `sensor.dsc_pot${a}_soil_moisture`),
    soilTemp: Tt(r(`sensor.dsc_pot${a}_soil_temperature`, "")),
    ec: f(`sensor.dsc_pot${a}_got_ec`, `sensor.dsc_pot${a}_soil_conductivity`),
    ph: f(`sensor.dsc_pot${a}_got_ph`, `sensor.dsc_pot${a}_soil_ph`),
    n: Tt(r(`sensor.dsc_pot${a}_soil_nitrogen`, "")),
    p: Tt(r(`sensor.dsc_pot${a}_soil_phosphorus`, "")),
    k: Tt(r(`sensor.dsc_pot${a}_soil_potassium`, "")),
    need: Tt(r(`sensor.dsc_pot${a}_need_summary`, "")),
    rosterSlot: h?.slot ?? null
  };
}
function gn(a, i, r) {
  const o = `sensor.dsc_pot${a}_got_${i}`, d = i === "moisture" ? `sensor.dsc_pot${a}_soil_moisture` : i === "ec" ? `sensor.dsc_pot${a}_soil_conductivity` : `sensor.dsc_pot${a}_soil_ph`, h = r(o, "");
  return h && h !== "unavailable" && h !== "unknown" ? o : d;
}
function ob(a, i, r) {
  return xd(i).map((o) => us(o, { state: i, entity: r })).filter((o) => o.tent === a);
}
const aa = [1, 2, 3, 4];
function Qt(a, i) {
  const r = `input_boolean.dsc_pot${a}_in_service`, o = i(r, "on");
  return o === "unavailable" || o === "unknown" || o === "" ? !0 : o === "on";
}
function xd(a, i = [...aa]) {
  return i.filter((r) => Qt(r, a));
}
function q0(a, i = [...aa]) {
  return { inService: xd(a, i).length, total: i.length };
}
function Y0(a) {
  const i = a("sensor.dsc_plant_roster_summary")?.attributes?.slots;
  return Array.isArray(i) ? i : [];
}
function dc(a, i) {
  const r = Qt(a, i), o = i(`binary_sensor.dsc_pot${a}_sensor_stuck`) === "on", d = i(`binary_sensor.dsc_pot${a}_untrusted`) === "on", h = i("sensor.dsc_peer_divergence_summary", ""), f = r && h !== "—" && h !== "ok" && h.toLowerCase() !== "none" && h !== "unknown" && h !== "unavailable" && h.length > 0 && h !== "0", m = [];
  o && m.push("stuck"), d && m.push("untrusted"), f && m.push("peer divergence");
  let _ = "ok";
  return d || o ? _ = "bad" : f && (_ = "warn"), {
    stuck: o,
    untrusted: d,
    peerDivergence: f,
    blockNeedAct: d || o,
    tone: _,
    labels: m
  };
}
function Gu(a, i) {
  return !Number.isFinite(a) || !Number.isFinite(i) ? NaN : 6.112 * Math.exp(17.67 * a / (a + 243.5)) * i * 2.1674 / (273.15 + a);
}
function X0(a) {
  return a === "/live/main" || a === "/live/4x8" ? "main" : a === "/live/clone" || a === "/live/2x4" ? "clone" : null;
}
function Q0(a) {
  return a === "/live/twin" || a === "/ops/dash" || a === "/live/main" || a === "/live/clone" || a === "/live/4x8" || a === "/live/2x4";
}
function Z0() {
  const a = At(), { hass: i, available: r, num: o, state: d, entity: h, tick: f } = Ce(), m = x.useRef(null), _ = x.useRef(null), [b, v] = x.useState("loading"), g = X0(a.pathname), j = a.pathname === "/live/twin" || a.pathname === "/ops/dash" || a.pathname === "/live/main" || a.pathname === "/live/clone" || a.pathname === "/live/4x8" || a.pathname === "/live/2x4", w = r("binary_sensor.dsc_hub_link") ? d("binary_sensor.dsc_hub_link") !== "on" : !r("sensor.dsc_hub_uptime");
  return x.useEffect(() => {
    const S = m.current;
    if (!S || _.current) return;
    let N = !1;
    return (async () => {
      v("loading");
      const C = await lb("dsc-the-dash-card");
      if (N || !m.current) return;
      if (!C) {
        v("missing");
        return;
      }
      const E = document.createElement("dsc-the-dash-card");
      typeof E.setConfig == "function" && E.setConfig({ type: "custom:dsc-the-dash-card" }), i && (E.hass = i), S.appendChild(E), _.current = E, v("ready");
    })(), () => {
      N = !0;
    };
  }, []), x.useEffect(() => {
    _.current && i && (_.current.hass = i);
  }, [i, f]), x.useEffect(() => {
    const S = _.current;
    S && (S.setFocusTent?.(g), S.setUiChrome?.({ hideHud: Q0(a.pathname) }));
  }, [g, a.pathname, b]), x.useEffect(() => {
    const S = _.current, N = () => {
      const C = !j || document.hidden;
      S?.pause?.(C);
    };
    return N(), document.addEventListener("visibilitychange", N), () => document.removeEventListener("visibilitychange", N);
  }, [j, b]), x.useEffect(() => {
    _.current?.setHeld?.(w);
  }, [w, b]), x.useEffect(() => {
    const S = _.current;
    if (!S?.setPots) return;
    const N = { clone: [], main: [] };
    aa.forEach((E) => {
      const z = Pr(d, E);
      (z === "clone" || z === "main") && N[z].push(E);
    });
    const C = aa.map((E) => {
      const z = us(E, { state: d, entity: h }), U = $a(E, d, h), Q = dc(E, d), X = Qt(E, d), F = Pr(d, E), Z = F === "clone" || F === "main" ? Math.max(0, N[F].indexOf(E)) : 0;
      return {
        id: `pot${E}`,
        pot: E,
        tent: F,
        slot: Z,
        inService: X,
        silhouette: U.silhouette,
        moisture: Number(z.moisture),
        ec: Number(z.ec),
        ph: Number(z.ph),
        soilT: Number(z.soilTemp),
        dryback: o(`sensor.dsc_pot${E}_dryback_pct`),
        need: z.need,
        held: w,
        untrusted: Q.untrusted
      };
    });
    S.setPots(C);
  }, [d, h, o, w, b]), /* @__PURE__ */ s.jsxs(
    "div",
    {
      className: `dsc-twin-keepalive${j ? " is-active" : ""}`,
      "aria-hidden": !j,
      inert: j ? void 0 : !0,
      "data-status": b,
      "data-focus-tent": g || "both",
      style: j ? void 0 : {
        pointerEvents: "none",
        position: "fixed",
        visibility: "hidden",
        inset: 0,
        zIndex: -1,
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ s.jsx("div", { className: "dsc-twin-keepalive-host", ref: m }),
        b === "missing" ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-empty", children: [
          /* @__PURE__ */ s.jsx("strong", { children: "dsc-the-dash-card" }),
          " did not register. Deploy",
          " ",
          /* @__PURE__ */ s.jsx("code", { children: "/local/dsc-the-dash-card.js" }),
          " ",
          "and hard-refresh."
        ] }) : null
      ]
    }
  );
}
const K0 = "https://cannalib.plausible-deniability.net", J0 = {
  strain: "/local/dsc-catalog/dsc_strains_search_index.json",
  medium: "/local/dsc-catalog/dsc_mediums_search_index.json",
  nutrient: "/local/dsc-catalog/dsc_nutrients_search_index.json",
  light: "/local/dsc-catalog/dsc_lights_search_index.json"
}, P0 = {
  strain: "strains",
  medium: "mediums",
  nutrient: "nutrients",
  light: "lights"
};
function W0(a) {
  return (a("input_text.dsc_cannalib_base_url", "") || K0).replace(/\/$/, "");
}
function I0(a) {
  const i = { Accept: "application/json" }, r = a("input_text.dsc_cannalib_api_key", "");
  return r && r !== "unknown" && r !== "unavailable" && (i["X-Cannalib-Key"] = r), i;
}
function ub(a) {
  if (Array.isArray(a)) return a;
  if (a && typeof a == "object") {
    const i = a;
    if (Array.isArray(i.items)) return i.items;
    if (Array.isArray(i.strains)) return i.strains;
  }
  return [];
}
function db(a) {
  return String(a.name || a.id || "").trim();
}
function e1(a) {
  const i = String(a.kind ?? "").trim().toLowerCase();
  if (i && i !== "strain" && i !== "cultivar") return !1;
  const r = db(a), o = r.toLowerCase();
  return !(/\bcapsules?\b/.test(o) || /\brosin\b/.test(o) || /\blubricant\b/.test(o) || /\bthca\s+pebbles?\b/.test(o) || /\d+\s*mg\b/.test(o) || /^#+\s*\d+/.test(r.trim()));
}
function t_(a, i) {
  return a !== "strain" ? i : i.filter(e1);
}
function n_(a, i) {
  const r = i.trim().toLowerCase();
  if (!r || a.length < 2) return a;
  const o = (d) => {
    if (String(d.matched_via ?? "").toLowerCase() === "science_alias") return 0;
    const f = String(d.science_alias ?? "").toLowerCase();
    return f && f.split(/[,;/|]/).some((m) => m.trim() === r || m.trim().includes(r)) ? 1 : 2;
  };
  return [...a].sort((d, h) => o(d) - o(h));
}
async function t1(a, i) {
  const r = await fetch(J0[a], { cache: "no-store" });
  if (!r.ok) return [];
  const o = ub(await r.json()), d = i.trim().toLowerCase();
  return d ? o.filter((h) => db(h).toLowerCase().includes(d)) : o;
}
async function hb(a, i, r, o = 100) {
  try {
    const h = P0[a], f = `${W0(r)}/v1/catalogs/${h}?q=${encodeURIComponent(i || "")}&limit=${o}`, m = await fetch(f, { headers: I0(r), cache: "no-store" });
    if (!m.ok) throw new Error(`cannalib ${m.status}`);
    const _ = n_(t_(a, ub(await m.json())), i);
    if (_.length || a === "strain")
      return {
        items: _,
        source: "cannalib",
        note: "CannaLib live"
      };
  } catch {
  }
  return {
    items: n_(t_(a, await t1(a, i)), i),
    source: "local",
    note: "CannaLib unreachable — local JSON index"
  };
}
function fb({
  kind: a,
  onPick: i,
  placeholder: r
}) {
  const { state: o } = Ce(), [d, h] = x.useState(""), [f, m] = x.useState([]), [_, b] = x.useState("local"), [v, g] = x.useState(""), [j, w] = x.useState(!1);
  x.useEffect(() => {
    let N = !1;
    const C = window.setTimeout(() => {
      w(!0), hb(a, d, o, 100).then((E) => {
        N || (m(E.items), b(E.source), g(E.note), w(!1));
      }).catch(() => {
        N || (m([]), g("Catalog search failed — try again."), w(!1));
      });
    }, 200);
    return () => {
      N = !0, window.clearTimeout(C);
    };
  }, [a, d]);
  const S = x.useMemo(() => f, [f]);
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-catalog-picker", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ s.jsx(
        H,
        {
          label: _ === "cannalib" ? "Cannalib" : "Local JSON",
          tone: _ === "cannalib" ? "ok" : "warn"
        }
      ),
      v ? /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", style: { fontSize: 12 }, children: v }) : null
    ] }),
    /* @__PURE__ */ s.jsx(
      "input",
      {
        type: "search",
        value: d,
        placeholder: r || "Type to search — options are not culled",
        onChange: (N) => h(N.target.value),
        autoComplete: "off"
      }
    ),
    /* @__PURE__ */ s.jsxs("ul", { className: "dsc-catalog-hits", children: [
      j && !S.length ? /* @__PURE__ */ s.jsx("li", { className: "dsc-muted", children: "Searching…" }) : null,
      !j && !S.length ? /* @__PURE__ */ s.jsx("li", { className: "dsc-muted", children: "No catalog hits — empty is honesty, not a placeholder." }) : null,
      S.map((N, C) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsxs("button", { type: "button", onClick: () => i(N), children: [
        /* @__PURE__ */ s.jsx("strong", { children: N.name }),
        N.type ? /* @__PURE__ */ s.jsx("em", { children: String(N.type) }) : null,
        N.breeder ? /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", children: String(N.breeder) }) : null
      ] }) }, `${N.id || N.name}-${C}`))
    ] })
  ] });
}
const ea = [1, 2, 3];
function mb(a, i) {
  return ea.find((o) => !a[o] && o !== i) ?? ea.find((o) => !a[o]) ?? 3;
}
function Vu(a, i, r, o) {
  const d = mb(o, a), h = ea.filter((g) => g !== a && g !== d), f = h.reduce((g, j) => g + (Number.isFinite(r[j]) ? Math.round(r[j]) : 0), 0), m = Math.max(0, 100 - f), _ = Math.max(0, Math.min(m, Math.round(i))), b = m - _, v = { ...r, [a]: _, [d]: b };
  return h.forEach((g) => {
    v[g] = Math.round(Number.isFinite(r[g]) ? r[g] : 0);
  }), v;
}
function n1({ volumeL: a }) {
  const { state: i, num: r, available: o } = Ce(), { callService: d } = Ht(), [h, f] = x.useState({ 1: !1, 2: !1, 3: !1 }), [m, _] = x.useState(null), [b, v] = x.useState(null), g = {
    1: r("input_number.dsc_blend_pct_1", 0),
    2: r("input_number.dsc_blend_pct_2", 0),
    3: r("input_number.dsc_blend_pct_3", 0)
  }, j = b ?? g, w = ea.map((F) => ({
    n: F,
    name: i(`input_text.dsc_blend_component_${F}_name`, ""),
    pct: Number.isFinite(j[F]) ? j[F] : 0
  })), S = ea.filter((F) => h[F]).length, N = mb(h), C = Number.isFinite(a) && a > 0 ? a : r("input_number.dsc_blend_total_l", 20), E = w.reduce((F, Z) => F + (Number.isFinite(Z.pct) ? Z.pct : 0), 0), z = (F) => {
    ea.forEach((Z) => {
      o(`input_number.dsc_blend_pct_${Z}`) && d("input_number", "set_value", {
        entity_id: `input_number.dsc_blend_pct_${Z}`,
        value: F[Z]
      });
    });
  }, U = (F, Z) => {
    const I = Vu(F, Z, b ?? j, h);
    v(null), _(null), z(I);
  }, Q = (F) => {
    f((Z) => {
      const I = { ...Z, [F]: !Z[F] };
      return ea.filter((ie) => I[ie]).length >= ea.length ? Z : I;
    });
  }, X = x.useMemo(
    () => w.filter((F) => F.pct > 0 && F.name && F.name !== "unknown").map((F) => `${F.name} ${(C * F.pct / 100).toFixed(1)}L (${Math.round(F.pct)}%)`).join(" · "),
    [w, C]
  );
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-coupled-mix", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ s.jsx(H, { label: `Σ ${Math.round(E)}%`, tone: Math.round(E) === 100 ? "ok" : "warn" }),
      /* @__PURE__ */ s.jsx(H, { label: `${C} L vessel`, tone: "muted" }),
      /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", style: { fontSize: 12 }, children: "Lock the layers you want to keep — the remainder layer soaks up the rest so the total is always 100%." })
    ] }),
    ea.map((F) => {
      const Z = w[F - 1], I = F === N && !h[F];
      return /* @__PURE__ */ s.jsxs("div", { className: "dsc-mix-row", children: [
        /* @__PURE__ */ s.jsx(Xr, { entityId: `input_text.dsc_blend_component_${F}_name`, label: `Layer ${F}` }),
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "range",
            min: 0,
            max: 100,
            value: Math.round(Z.pct),
            disabled: h[F] || I,
            onPointerDown: (ae) => {
              h[F] || I || (ae.target.setPointerCapture(ae.pointerId), _(F), v({ ...j }));
            },
            onPointerUp: (ae) => {
              m === F && U(F, Number(ae.target.value));
            },
            onPointerCancel: () => {
              v(null), _(null);
            },
            onLostPointerCapture: (ae) => {
              m === F && U(F, Number(ae.target.value));
            },
            onChange: (ae) => {
              const ie = Number(ae.target.value);
              if (m === F) {
                v(Vu(F, ie, b ?? j, h));
                return;
              }
              z(Vu(F, ie, j, h));
            }
          }
        ),
        /* @__PURE__ */ s.jsxs("strong", { children: [
          Math.round(Z.pct),
          "%"
        ] }),
        /* @__PURE__ */ s.jsxs("span", { className: "dsc-mono", children: [
          (C * Z.pct / 100).toFixed(1),
          " L"
        ] }),
        /* @__PURE__ */ s.jsx(se, { disabled: S >= 2 && !h[F], onClick: () => Q(F), children: h[F] ? "Unlock" : I ? "Remainder" : "Lock" })
      ] }, F);
    }),
    /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: [
      "Recipe: ",
      X || "Mix not set yet."
    ] })
  ] });
}
const yd = "sensor.dsc_hub_uptime", pb = "sensor.dsc_hub_heartbeat";
function a1(a, i) {
  if (!i || a == null || a === "") return NaN;
  const r = a.trim().toLowerCase();
  if (r === "unavailable" || r === "unknown" || r === "none") return NaN;
  const o = Number(a);
  return Number.isFinite(o) ? o : NaN;
}
function _e(a) {
  const { available: i, tick: r, entity: o } = Ce(), d = kt(), h = sa(), f = x.useRef(null), m = x.useRef(a), [, _] = x.useState(0);
  m.current !== a && (m.current = a, f.current = null);
  const b = h === "pi" ? Jr(a, d) : null, v = h === "pi" ? _d(a, d) : !1, g = h === "pi" ? u0(d) : !i(yd) || !i(pb), j = h === "pi" && v || i(a), w = b != null && Number.isFinite(b) ? b : a1(o(a)?.state, j), S = g && w === 0;
  return x.useEffect(() => {
    if (j && Number.isFinite(w) && !S) {
      f.current = { value: w, at: Date.now() }, _((N) => N + 1);
      return;
    }
    _((N) => N + 1);
  }, [a, j, w, S, r, o]), j && Number.isFinite(w) && !S ? { value: w, stale: !1, heldAt: f.current?.at, live: !0 } : f.current != null ? {
    value: f.current.value,
    stale: !0,
    heldAt: f.current.at,
    live: !1
  } : { value: NaN, stale: !1, heldAt: void 0, live: !1 };
}
function wd(a) {
  const { available: i, entity: r, tick: o } = Ce(), d = kt();
  if (sa() === "pi" && a === yd && d.hub.online || i(a)) return null;
  const f = r(a)?.last_changed;
  if (!f) return null;
  const m = Date.parse(f);
  return Number.isFinite(m) ? Date.now() - m : null;
}
function _b() {
  const a = kt(), i = sa(), r = wd(yd);
  return i === "pi" && !a.hub.online && a.hub.last_seen ? Date.now() - a.hub.last_seen * 1e3 : r;
}
function bb() {
  return wd(pb);
}
function gb() {
  const a = kt();
  return sa() === "pi" && !a.panel.online && a.panel.last_seen ? Date.now() - a.panel.last_seen * 1e3 : wd("binary_sensor.dsc_hub_panel_link");
}
function jd(a) {
  return !!a && Number.isFinite(a.min) && Number.isFinite(a.max) && a.max > a.min;
}
function di(a) {
  if (a.available === !1 || !Number.isFinite(a.value)) return "muted";
  if (a.stale) return "stale";
  if (a.fault) return "critical";
  if (jd(a.band)) {
    const i = a.margin ?? 0;
    if (a.value < a.band.min - i || a.value > a.band.max + i)
      return a.value < a.band.min - i * 3 || a.value > a.band.max + i * 3 ? "critical" : "warn";
  }
  return "ok";
}
function s1(a) {
  switch (a) {
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
      return a;
  }
}
function Sd(a) {
  switch (a) {
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
      return a;
  }
}
function hc(a, i) {
  if (!jd(a)) return;
  const r = i === "°C" ? 1 : 0.05;
  return Math.max((a.max - a.min) * 0.12, r);
}
const vb = [
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
], qu = {
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
function Hr(a, i) {
  const r = Number(a(i, ""));
  return Number.isFinite(r) && r > 0 ? r : NaN;
}
function a_(a) {
  if (!a || a === "—" || a === "Off" || a === "Custom") return null;
  const i = qu[a];
  if (i) return i;
  const r = Object.keys(qu).find((o) => a.indexOf(o) >= 0);
  return r ? qu[r] : null;
}
function Yu(a, i) {
  return !Number.isFinite(i.min) || !Number.isFinite(i.max) ? a : a ? {
    min: Math.max(a.min, i.min),
    max: Math.min(a.max, i.max),
    source: a.source === "plant" || i.source === "plant" ? "plant" : "stage",
    mixed: a.source !== i.source || a.mixed
  } : { ...i, mixed: !1 };
}
function td(a, i) {
  const r = ob(a, i.state, i.entity).filter((j) => Qt(j.pot, i.state));
  let o = null, d = null, h = null, f = null;
  const m = [], _ = [];
  let b = !1;
  for (const j of r) {
    j.stage && j.stage !== "—" && (m.length && !m.includes(j.stage) && (b = !0), m.includes(j.stage) || m.push(j.stage)), j.need && j.need !== "—" && j.need !== "ok" && !_.includes(j.need) && _.push(j.need);
    const w = Hr(i.state, `sensor.dsc_pot${j.pot}_want_temp_min`), S = Hr(i.state, `sensor.dsc_pot${j.pot}_want_temp_max`);
    Number.isFinite(w) && Number.isFinite(S) && (o = Yu(o, { min: w, max: S, source: "plant" }));
    const N = Hr(i.state, `sensor.dsc_pot${j.pot}_want_rh_min`), C = Hr(i.state, `sensor.dsc_pot${j.pot}_want_rh_max`);
    Number.isFinite(N) && Number.isFinite(C) && (d = Yu(d, { min: N, max: C, source: "plant" }));
    const E = a_(j.stage);
    E && (o || (o = { min: E.temp - 1.5, max: E.temp + 1.5, source: "stage", mixed: !1 }), d || (d = { min: E.rhMin, max: E.rhMax, source: "stage", mixed: !1 }), h = Yu(h, { min: E.vpdMin, max: E.vpdMax, source: "stage" }), f = f == null ? E.lightHours : Math.min(f, E.lightHours));
  }
  const v = a === "main" ? i.state("select.dsc_hub_grow_stage", "") : i.state("select.dsc_hub_clone_mode", "");
  if (!r.length || !o && !d && !h) {
    const j = a === "clone" ? v === "Clones & Seedlings" ? "Seedling" : v === "Mother" ? "Vegetative" : v === "Follow 4x8" ? i.state("select.dsc_hub_grow_stage", "") : "" : v, w = a_(j);
    w && (o || (o = { min: w.temp - 1.5, max: w.temp + 1.5, source: "stage", mixed: !1 }), d || (d = { min: w.rhMin, max: w.rhMax, source: "stage", mixed: !1 }), h || (h = { min: w.vpdMin, max: w.vpdMax, source: "stage", mixed: !1 }), f == null && (f = w.lightHours), j && !m.includes(j) && m.push(j));
  }
  return o && o.min > o.max && (o = { ...o, min: o.max, max: o.min, mixed: !0 }), d && d.min > d.max && (d = { ...d, min: d.max, max: d.min, mixed: !0 }), h && h.min > h.max && (h = { ...h, min: h.max, max: h.min, mixed: !0 }), {
    temp: o,
    rh: d,
    vpd: h,
    lightHours: f,
    mixed: b,
    stages: m,
    needs: _,
    emptyLabel: !o && !d && !h ? "no plant/stage rail" : null
  };
}
function za(a, i, r) {
  if (r) return { tone: "critical", label: "min > max" };
  if (!i) return { tone: "muted", label: "no plant/stage rail" };
  const o = di({ value: a, band: i, margin: (i.max - i.min) * 0.12 }), d = i.source === "plant" ? "plant Want" : "stage rail";
  switch (o) {
    case "ok":
      return { tone: o, label: `in-band · ${d}` };
    case "warn":
    case "stale":
      return { tone: "warn", label: `approaching · ${d}` };
    case "critical":
      return { tone: o, label: `outside · ${d}` };
    case "muted":
      return { tone: o, label: d };
    default:
      return o;
  }
}
function Xu(a, i, r) {
  const o = Number(r(`sensor.dsc_pot${a}_want_${i}_min`, "")), d = Number(r(`sensor.dsc_pot${a}_want_${i}_max`, ""));
  if (o > 0 && d > 0 && d >= o) return { min: o, max: d };
  if (i === "moisture") return { min: 0, max: 45 };
}
const s_ = 2e3;
function xb(a, i = Date.now()) {
  if (!a.length) return [];
  const r = [...a].sort((h, f) => h.t - f.t), o = [];
  for (let h = 0; h < r.length; h++) {
    const f = r[h];
    if (!Number.isFinite(f.v)) continue;
    const m = o[o.length - 1];
    m && f.t - m.t > s_ && o.push({ t: f.t - 1, v: m.v }), o.push(f);
  }
  const d = o[o.length - 1];
  return d && i - d.t > s_ && o.push({ t: i, v: d.v }), o;
}
function l1(a) {
  if (a == null) return !0;
  const i = String(a).toLowerCase();
  return i === "" || i === "unavailable" || i === "unknown" || i === "none";
}
function yb(a) {
  if (l1(a)) return null;
  if (typeof a == "number") return Number.isFinite(a) ? a : null;
  const i = String(a).toLowerCase();
  if (i === "on" || i === "true" || i === "open") return 1;
  if (i === "off" || i === "false" || i === "closed") return 0;
  const r = Number(a);
  return Number.isFinite(r) ? r : null;
}
function i1(a) {
  if (typeof a.lu == "number" && Number.isFinite(a.lu))
    return a.lu * 1e3;
  const i = a.last_changed || a.last_updated;
  if (i) {
    const r = Date.parse(i);
    return Number.isFinite(r) ? r : null;
  }
  return null;
}
function r1(a) {
  return yb(a.s ?? a.state);
}
function l_(a, i) {
  if (a.length <= i) return a;
  const r = [], o = (a.length - 1) / (i - 1);
  for (let d = 0; d < i; d++)
    r.push(a[Math.round(d * o)]);
  return r;
}
function kd(a, i = 6, r = 96) {
  const { hass: o, callWS: d } = oi(), h = sa(), f = !!(o && (o.callWS || o.connection)), [m, _] = x.useState([]), [b, v] = x.useState(!0), [g, j] = x.useState(null);
  return x.useEffect(() => {
    let w = !1;
    async function S() {
      v(!0), j(null);
      try {
        const C = await d0(a, i);
        if (w) return;
        const E = C.filter((z) => Number.isFinite(z.t) && Number.isFinite(z.v));
        E.sort((z, U) => z.t - U.t), _(l_(E, r));
      } catch (C) {
        w || (j(C instanceof Error ? C.message : "history unavailable"), _([]));
      } finally {
        w || v(!1);
      }
    }
    async function N() {
      if (!a) {
        _([]), v(!1);
        return;
      }
      if (!f) {
        _([]), v(!1);
        return;
      }
      v(!0), j(null);
      const C = /* @__PURE__ */ new Date(), E = new Date(C.getTime() - i * 3600 * 1e3);
      try {
        const z = await d({
          type: "history/history_during_period",
          start_time: E.toISOString(),
          end_time: C.toISOString(),
          significant_changes_only: !1,
          minimal_response: !0,
          no_attributes: !0,
          entity_ids: [a]
        });
        if (w) return;
        if (z == null) {
          _([]), j("history unavailable");
          return;
        }
        let U = [];
        Array.isArray(z) ? U = z[0] || [] : z && typeof z == "object" && (U = z[a] || []);
        const Q = [];
        for (const X of U) {
          const F = i1(X), Z = r1(X);
          F == null || Z == null || Q.push({ t: F, v: Z });
        }
        Q.sort((X, F) => X.t - F.t), _(l_(Q, r));
      } catch (z) {
        w || (j(z instanceof Error ? z.message : "history unavailable"), _([]));
      } finally {
        w || v(!1);
      }
    }
    return h === "pi" ? S() : N(), () => {
      w = !0;
    };
  }, [h, f, a, i, r, d]), { points: m, loading: b, error: g };
}
function c1(a) {
  return a <= 18 ? a * 2 : Math.min(a + 24, 48);
}
function o1(a, i) {
  const r = i * 3600 * 1e3, o = Date.now() - r;
  return a.filter((d) => d.t < o && Number.isFinite(d.v)).map((d) => ({ t: d.t + r, v: d.v }));
}
function xe(a, i) {
  const r = i?.maxPoints ?? 96, o = i?.hours ?? 6, d = !!i?.withGhost, h = d ? c1(o) : o, f = d ? Math.min(Math.max(r * 2, r), 288) : r, { num: m, available: _, tick: b, state: v } = Ce(), g = kt(), j = sa(), w = r0(), { points: S } = kd(a, h, f), [N, C] = x.useState([]), [E, z] = x.useState(void 0), U = x.useRef(null), Q = x.useRef(!1);
  x.useEffect(() => {
    Q.current = !1, C([]), U.current = null, z(void 0);
  }, [a, o, r, h, d]), x.useEffect(() => {
    if (S.length && !Q.current) {
      Q.current = !0;
      const I = S[S.length - 1]?.v;
      Number.isFinite(I) && (U.current = I);
    }
  }, [S]), x.useEffect(() => {
    const I = j === "pi" ? _d(a, g) : _(a);
    if (!a || !I) return;
    const ae = j === "pi" ? Jr(a, g) : null, ie = m(a), de = ae != null && Number.isFinite(ae) ? ae : Number.isFinite(ie) ? ie : yb(v(a, ""));
    if (de == null || !Number.isFinite(de)) return;
    if (U.current === de && N.length > 0) {
      const ce = Date.now(), oe = N[N.length - 1]?.t ?? 0;
      if (ce - oe < 4e3) return;
    }
    U.current = de;
    const re = Date.now();
    C((ce) => [...ce, { t: re, v: de }].slice(-r)), z(re);
  }, [a, b, w, j, g, _, m, v, r]);
  const X = d ? Math.max(f, r * 2) : r * 2, { series: F, ghost: Z } = x.useMemo(() => {
    const I = S.length ? S[S.length - 1].t : 0, ae = N.filter((M) => M.t > I + 250), ie = S.length ? [...S, ...ae] : ae, de = xb(ie), re = de.length > X ? de.slice(-X) : de;
    if (!d) return { series: re, ghost: [] };
    const ce = o * 3600 * 1e3, oe = Date.now() - ce;
    return {
      series: re.filter((M) => M.t >= oe),
      ghost: o1(re, o)
    };
  }, [S, N, X, d, o]);
  return { series: F, lastSyncAt: E, ghost: Z };
}
const u1 = [1, 6, 24, 48], wb = "dsc_chart_hours";
function d1() {
  try {
    const a = sessionStorage.getItem(wb), i = Number(a);
    if (Number.isFinite(i) && i > 0 && i <= 48) return i;
  } catch {
  }
  return 6;
}
function al(a = 6) {
  const [i, r] = x.useState(() => d1() || a), o = x.useCallback((h) => {
    r(h);
    try {
      sessionStorage.setItem(wb, String(h));
    } catch {
    }
  }, []), d = i <= 1 ? 60 : i <= 6 ? 96 : i <= 24 ? 144 : 192;
  return { hours: i, setHours: o, maxPoints: d };
}
const jb = "dsc-hub-snooze:";
function Qu(a) {
  try {
    const i = localStorage.getItem(jb + a);
    if (!i) return {};
    const r = JSON.parse(i);
    return !r || typeof r != "object" ? {} : r;
  } catch {
    return {};
  }
}
function i_(a, i) {
  try {
    localStorage.setItem(jb + a, JSON.stringify(i));
  } catch {
  }
}
function fc() {
  const { entity: a, tick: i } = Ce(), r = a("sensor.dsc_hub_uptime")?.last_changed || "noboot", o = x.useMemo(() => Qu(r), [r, i]), d = x.useCallback((m) => !!o[m], [o]), h = x.useCallback(
    (m) => {
      if (!m) return;
      const _ = { ...Qu(r), [m]: !0 };
      i_(r, _);
    },
    [r]
  ), f = x.useCallback(
    (m) => {
      const _ = { ...Qu(r) };
      delete _[m], i_(r, _);
    },
    [r]
  );
  return { bootKey: r, isSnoozed: d, snooze: h, unsnooze: f };
}
const Lr = [
  "var(--dsc-neon)",
  "var(--dsc-teal)",
  "var(--dsc-amber)",
  "var(--dsc-gray-5)"
];
function r_(a) {
  const i = Math.max(...a, 1), r = 10 ** Math.floor(Math.log10(i));
  return Math.ceil(i / r) * r;
}
function c_(a, i = !1) {
  const r = Math.min(...a);
  if (i && r >= 0) return 0;
  const o = Math.abs(r) || 1, d = 10 ** Math.floor(Math.log10(o));
  return Math.floor(r / d) * d;
}
function o_(a, i, r = 0.08) {
  if (!Number.isFinite(a) || !Number.isFinite(i)) return { min: 0, max: 1 };
  if (i <= a) return { min: a - 1, max: i + 1 };
  const d = (i - a) * r || 1;
  return { min: a - d, max: i + d };
}
function Wr(a, i, r, o, d, h, f, m) {
  const _ = Math.max(h - d, 1e-6), b = Math.max(m - f, 1), v = i - o.l - o.r, g = r - o.t - o.b;
  return {
    x: o.l + (a.t - f) / b * v,
    y: o.t + (1 - (a.v - d) / _) * g
  };
}
function h1(a, i, r, o, d, h, f, m, _ = !1) {
  return a.length ? a.map((b, v) => {
    const { x: g, y: j } = Wr(b, i, r, o, d, h, f, m);
    if (v === 0) return `M${g.toFixed(1)} ${j.toFixed(1)}`;
    if (!_) return `L${g.toFixed(1)} ${j.toFixed(1)}`;
    const w = Wr(a[v - 1], i, r, o, d, h, f, m);
    return `L${g.toFixed(1)} ${w.y.toFixed(1)} L${g.toFixed(1)} ${j.toFixed(1)}`;
  }).join(" ") : "";
}
function f1(a, i, r) {
  if (!i || !Number.isFinite(a)) return r;
  const o = Math.max(i.max - i.min, 1e-6), d = Math.max(o * 0.12, 0.05);
  return a < i.min - 3 * d || a > i.max + 3 * d ? "var(--dsc-bad)" : a < i.min - d || a > i.max + d ? "var(--dsc-amber)" : r;
}
function m1(a, i, r, o, d, h, f, m, _, b, v = !1) {
  if (a.length < 2) return [];
  const g = [];
  for (let j = 1; j < a.length; j++) {
    const w = a[j - 1], S = a[j], N = Wr(w, i, r, o, d, h, f, m), C = Wr(S, i, r, o, d, h, f, m), E = f1(S.v, _, b), z = v ? `M${N.x.toFixed(1)} ${N.y.toFixed(1)} L${C.x.toFixed(1)} ${N.y.toFixed(1)} L${C.x.toFixed(1)} ${C.y.toFixed(1)}` : `M${N.x.toFixed(1)} ${N.y.toFixed(1)} L${C.x.toFixed(1)} ${C.y.toFixed(1)}`, U = g[g.length - 1];
    U && U.color === E ? U.d += z.slice(1) : g.push({ d: z, color: E });
  }
  return g;
}
function u_(a) {
  const i = new Date(a), r = String(i.getHours()).padStart(2, "0"), o = String(i.getMinutes()).padStart(2, "0");
  return `${r}:${o}`;
}
function ss(a, i, r, o, d) {
  const h = Math.max(r - i, 1e-6);
  return d.t + (1 - (a - i) / h) * (o - d.t - d.b);
}
function d_(a, i, r) {
  if (r?.min != null && r?.max != null) return { min: r.min, max: r.max };
  const o = a.filter((d) => (d.axis || "left") === i).flatMap((d) => d.series.map((h) => h.v));
  if (!o.length)
    return i === "right" ? { min: 0, max: 100 } : { min: 0, max: 1 };
  if (i === "right") {
    const d = Math.min(...o, 0);
    return Math.max(...o, 100) <= 100 && d >= 0 ? { min: 0, max: 100 } : o_(c_(o, !0), r_(o));
  }
  return o_(c_(o), r_(o));
}
function jn({
  series: a,
  height: i = 180,
  unit: r = "",
  live: o = !0,
  emptyLabel: d = "thin recorder",
  lastSyncAt: h,
  targets: f = [],
  yDomain: m
}) {
  const _ = x.useId().replace(/:/g, ""), b = 640, v = a.some((M) => M.axis === "right"), g = { l: 40, r: v ? 40 : 14, t: 16, b: 28 }, j = x.useRef(null), [w, S] = x.useState(null), [N, C] = x.useState(!1), E = x.useMemo(() => {
    const M = a.flatMap((k) => k.series);
    if (!M.length) return null;
    const R = d_(a, "left", m?.left), D = d_(a, "right", m?.right), q = Math.min(...M.map((k) => k.t)), P = Math.max(...M.map((k) => k.t), Date.now()), W = a.map((k, G) => {
      const ee = k.axis || "left", ne = ee === "right" ? D : R, me = k.color || Lr[G % Lr.length];
      return {
        ...k,
        axis: ee,
        color: me,
        d: h1(k.series, b, i, g, ne.min, ne.max, q, P, k.step),
        segs: k.ghost ? [] : m1(k.series, b, i, g, ne.min, ne.max, q, P, k.band, me, k.step),
        last: k.series.length ? k.series[k.series.length - 1] : null,
        ext: An(k.series),
        dom: ne
      };
    });
    return { left: R, right: D, t0: q, t1: P, paths: W };
  }, [a, i, v, m]), z = x.useMemo(() => {
    if (!E) return [];
    const M = 4, R = [];
    for (let D = 0; D <= M; D++) {
      const q = D / M, P = E.left.max - q * (E.left.max - E.left.min), W = g.t + q * (i - g.t - g.b);
      R.push({ y: W, label: P.toFixed(Math.abs(P) >= 100 ? 0 : 1) });
    }
    return R;
  }, [E, i]), U = x.useMemo(() => {
    if (!E || !v) return [];
    const M = 4, R = [];
    for (let D = 0; D <= M; D++) {
      const q = D / M, P = E.right.max - q * (E.right.max - E.right.min), W = g.t + q * (i - g.t - g.b);
      R.push({ y: W, label: P.toFixed(Math.abs(P) >= 100 ? 0 : 1) });
    }
    return R;
  }, [E, i, v]), Q = x.useMemo(() => {
    if (!E) return [];
    const M = 5, R = [], D = Math.max(E.t1 - E.t0, 1), q = b - g.l - g.r;
    for (let P = 0; P < M; P++) {
      const W = P / (M - 1), k = E.t0 + W * D;
      R.push({ x: g.l + W * q, label: u_(k) });
    }
    return R;
  }, [E]), X = x.useCallback(
    (M) => {
      const R = j.current;
      if (!R || !E) return null;
      const D = R.getBoundingClientRect(), q = (M - D.left) / Math.max(D.width, 1) * b, P = b - g.l - g.r, W = Math.min(b - g.r, Math.max(g.l, q)), k = (W - g.l) / Math.max(P, 1);
      return { t: E.t0 + k * Math.max(E.t1 - E.t0, 1), x: W };
    },
    [E]
  ), F = (M) => {
    if (N) return;
    const R = X(M.clientX);
    R && S(R);
  }, Z = () => {
    N || S(null);
  }, I = (M) => {
    const R = X(M.clientX);
    if (R) {
      if (N && w && Math.abs(w.x - R.x) < 8) {
        C(!1), S(null);
        return;
      }
      C(!0), S(R);
    }
  }, ae = x.useMemo(() => !E || !w ? [] : E.paths.map((M) => {
    if (!M.series.length) return { id: M.id, label: M.label, color: M.color, v: null, unit: M.unit || "" };
    let R = M.series[0], D = Math.abs(R.t - w.t);
    for (const P of M.series) {
      const W = Math.abs(P.t - w.t);
      W < D && (R = P, D = W);
    }
    const q = ss(R.v, M.dom.min, M.dom.max, i, g);
    return {
      id: M.id,
      label: M.label,
      color: M.color,
      v: R.v,
      unit: M.unit || "",
      y: q,
      x: g.l + (R.t - E.t0) / Math.max(E.t1 - E.t0, 1) * (b - g.l - g.r)
    };
  }), [E, w, i]), ie = E ? `${E.t0}-${E.t1}-${E.paths.map((M) => M.d).join("|")}` : "empty", de = Sb(ie), re = b * 1.4, ce = kb(re, de), oe = E?.paths[0]?.last?.v ?? null;
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-chart", style: { position: "relative", width: "100%" }, children: [
    /* @__PURE__ */ s.jsxs(
      "svg",
      {
        ref: j,
        viewBox: `0 0 ${b} ${i}`,
        width: "100%",
        height: i,
        role: "img",
        "aria-label": "Live chart",
        className: "dsc-chart-svg",
        onPointerMove: F,
        onPointerLeave: Z,
        onPointerDown: I,
        children: [
          /* @__PURE__ */ s.jsxs("defs", { children: [
            E?.paths.map((M) => /* @__PURE__ */ s.jsxs("linearGradient", { id: `fill-${_}-${M.id}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ s.jsx("stop", { offset: "0%", stopColor: M.color, stopOpacity: "0.28" }),
              /* @__PURE__ */ s.jsx("stop", { offset: "100%", stopColor: M.color, stopOpacity: "0" })
            ] }, M.id)),
            /* @__PURE__ */ s.jsxs("filter", { id: `glow-${_}`, x: "-40%", y: "-40%", width: "180%", height: "180%", children: [
              /* @__PURE__ */ s.jsx("feGaussianBlur", { stdDeviation: "2.8", result: "b" }),
              /* @__PURE__ */ s.jsxs("feMerge", { children: [
                /* @__PURE__ */ s.jsx("feMergeNode", { in: "b" }),
                /* @__PURE__ */ s.jsx("feMergeNode", { in: "SourceGraphic" })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("filter", { id: `glow-soft-${_}`, x: "-50%", y: "-50%", width: "200%", height: "200%", children: [
              /* @__PURE__ */ s.jsx("feGaussianBlur", { stdDeviation: "4.2", result: "b" }),
              /* @__PURE__ */ s.jsx("feMerge", { children: /* @__PURE__ */ s.jsx("feMergeNode", { in: "b" }) })
            ] })
          ] }),
          z.map((M) => /* @__PURE__ */ s.jsxs("g", { children: [
            /* @__PURE__ */ s.jsx(
              "line",
              {
                x1: g.l,
                x2: b - g.r,
                y1: M.y,
                y2: M.y,
                stroke: "var(--dsc-gray-3)",
                strokeWidth: "1",
                strokeDasharray: "3 4"
              }
            ),
            /* @__PURE__ */ s.jsx(
              "text",
              {
                x: g.l - 6,
                y: M.y + 3,
                textAnchor: "end",
                fill: "var(--dsc-gray-5)",
                fontSize: "9",
                fontFamily: "var(--dsc-mono)",
                children: M.label
              }
            )
          ] }, `L${M.y}`)),
          U.map((M) => /* @__PURE__ */ s.jsx(
            "text",
            {
              x: b - g.r + 6,
              y: M.y + 3,
              textAnchor: "start",
              fill: "var(--dsc-teal)",
              fontSize: "9",
              fontFamily: "var(--dsc-mono)",
              opacity: 0.85,
              children: M.label
            },
            `R${M.y}`
          )),
          Q.map((M) => /* @__PURE__ */ s.jsx(
            "text",
            {
              x: M.x,
              y: i - 8,
              textAnchor: "middle",
              fill: "var(--dsc-gray-5)",
              fontSize: "9",
              fontFamily: "var(--dsc-mono)",
              children: M.label
            },
            M.x
          )),
          E ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            f.map((M, R) => {
              const D = M.axis || "left", q = D === "right" ? E.right : E.left, P = M.color || (D === "right" ? "var(--dsc-teal)" : "var(--dsc-amber)");
              if (M.min != null && M.max != null) {
                const k = ss(M.max, q.min, q.max, i, g), G = ss(M.min, q.min, q.max, i, g);
                return /* @__PURE__ */ s.jsxs("g", { children: [
                  /* @__PURE__ */ s.jsx(
                    "rect",
                    {
                      x: g.l,
                      y: Math.min(k, G),
                      width: b - g.l - g.r,
                      height: Math.abs(G - k),
                      fill: P,
                      opacity: 0.08
                    }
                  ),
                  /* @__PURE__ */ s.jsx(
                    "line",
                    {
                      x1: g.l,
                      x2: b - g.r,
                      y1: k,
                      y2: k,
                      stroke: P,
                      strokeWidth: "1",
                      strokeDasharray: "4 4",
                      opacity: 0.7
                    }
                  ),
                  /* @__PURE__ */ s.jsx(
                    "line",
                    {
                      x1: g.l,
                      x2: b - g.r,
                      y1: G,
                      y2: G,
                      stroke: P,
                      strokeWidth: "1",
                      strokeDasharray: "4 4",
                      opacity: 0.7
                    }
                  )
                ] }, `tg-${R}`);
              }
              if (M.value == null || !Number.isFinite(M.value)) return null;
              const W = ss(M.value, q.min, q.max, i, g);
              return /* @__PURE__ */ s.jsxs("g", { children: [
                /* @__PURE__ */ s.jsx(
                  "line",
                  {
                    x1: g.l,
                    x2: b - g.r,
                    y1: W,
                    y2: W,
                    stroke: P,
                    strokeWidth: "1.2",
                    strokeDasharray: "5 4",
                    opacity: 0.85
                  }
                ),
                M.label ? /* @__PURE__ */ s.jsx(
                  "text",
                  {
                    x: b - g.r - 2,
                    y: W - 4,
                    textAnchor: "end",
                    fill: P,
                    fontSize: "8",
                    fontFamily: "var(--dsc-mono)",
                    children: M.label
                  }
                ) : null
              ] }, `tg-${R}`);
            }),
            E.paths.map((M) => {
              if (!M.d || M.series.length === 0) return null;
              const R = M.last, D = R && E ? g.l + (R.t - E.t0) / Math.max(E.t1 - E.t0, 1) * (b - g.l - g.r) : 0, q = R ? ss(R.v, M.dom.min, M.dom.max, i, g) : 0, P = M.segs.length ? M.segs : [{ d: M.d, color: M.color }];
              return /* @__PURE__ */ s.jsxs("g", { className: "dsc-chart-series", children: [
                M.ghost ? /* @__PURE__ */ s.jsx(
                  "path",
                  {
                    d: M.d,
                    fill: "none",
                    stroke: M.color,
                    strokeWidth: 1.6,
                    strokeLinejoin: "round",
                    strokeLinecap: "round",
                    strokeDasharray: ce.dasharray,
                    strokeDashoffset: ce.dashoffset,
                    opacity: 0.55,
                    className: "dsc-chart-core"
                  }
                ) : P.map((W, k) => /* @__PURE__ */ s.jsx(
                  "path",
                  {
                    d: W.d,
                    fill: "none",
                    stroke: W.color,
                    strokeWidth: 2.2,
                    strokeLinejoin: "round",
                    strokeLinecap: "round",
                    strokeDasharray: ce.dasharray,
                    strokeDashoffset: ce.dashoffset,
                    filter: `url(#glow-${_})`,
                    opacity: 0.95,
                    className: "dsc-chart-core"
                  },
                  `${M.id}-seg-${k}`
                )),
                o && R ? /* @__PURE__ */ s.jsx("circle", { cx: D, cy: q, r: 3, fill: M.color, opacity: 0.9, className: "dsc-chart-tip" }) : null,
                M.ext.min != null ? /* @__PURE__ */ s.jsxs(
                  "text",
                  {
                    x: g.l + 2,
                    y: ss(M.ext.min, M.dom.min, M.dom.max, i, g) + 8,
                    fill: M.color,
                    fontSize: "8",
                    opacity: 0.7,
                    children: [
                      "min ",
                      M.ext.min.toFixed(M.ext.min >= 100 ? 0 : 1)
                    ]
                  }
                ) : null,
                M.ext.max != null ? /* @__PURE__ */ s.jsxs(
                  "text",
                  {
                    x: g.l + 2,
                    y: ss(M.ext.max, M.dom.min, M.dom.max, i, g) - 3,
                    fill: M.color,
                    fontSize: "8",
                    opacity: 0.7,
                    children: [
                      "max ",
                      M.ext.max.toFixed(M.ext.max >= 100 ? 0 : 1)
                    ]
                  }
                ) : null
              ] }, M.id);
            }),
            w ? /* @__PURE__ */ s.jsxs("g", { className: "dsc-chart-crosshair", children: [
              /* @__PURE__ */ s.jsx(
                "line",
                {
                  x1: w.x,
                  x2: w.x,
                  y1: g.t,
                  y2: i - g.b,
                  stroke: "var(--dsc-white)",
                  strokeOpacity: 0.35,
                  strokeWidth: "1"
                }
              ),
              ae.map(
                (M) => M.v == null || M.y == null ? null : /* @__PURE__ */ s.jsx(
                  "circle",
                  {
                    cx: M.x ?? w.x,
                    cy: M.y,
                    r: 4,
                    fill: M.color,
                    stroke: "var(--dsc-black)",
                    strokeWidth: "1"
                  },
                  M.id
                )
              )
            ] }) : null
          ] }) : /* @__PURE__ */ s.jsx(
            "text",
            {
              x: b / 2,
              y: i / 2,
              textAnchor: "middle",
              fill: "var(--dsc-gray-5)",
              fontSize: "12",
              children: d
            }
          )
        ]
      }
    ),
    w && E ? /* @__PURE__ */ s.jsxs(
      "div",
      {
        className: "dsc-chart-tooltip",
        style: {
          left: `${Math.min(92, Math.max(8, w.x / b * 100))}%`
        },
        children: [
          /* @__PURE__ */ s.jsx("div", { className: "dsc-chart-tooltip-time", children: u_(w.t) }),
          ae.map(
            (M) => M.v == null ? null : /* @__PURE__ */ s.jsxs("div", { className: "dsc-chart-tooltip-row", children: [
              /* @__PURE__ */ s.jsx("i", { style: { background: M.color } }),
              /* @__PURE__ */ s.jsxs("span", { children: [
                M.label || M.id,
                " ",
                M.v.toFixed(M.v >= 100 ? 0 : 1),
                M.unit ? ` ${M.unit}` : ""
              ] })
            ] }, M.id)
          )
        ]
      }
    ) : null,
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chart-legend", children: [
      a.filter((M) => M.label).map((M, R) => /* @__PURE__ */ s.jsxs("span", { className: "dsc-chart-legend-item", children: [
        /* @__PURE__ */ s.jsx("i", { style: { background: M.color || Lr[R % Lr.length] } }),
        M.label
      ] }, M.id)),
      oe != null ? /* @__PURE__ */ s.jsxs("span", { className: "dsc-chart-last", children: [
        oe.toFixed(1),
        r ? ` ${r}` : a[0]?.unit ? ` ${a[0].unit}` : ""
      ] }) : null
    ] })
  ] });
}
function nd(a, i = 280) {
  const [r, o] = x.useState(a);
  return x.useEffect(() => {
    if (!Number.isFinite(a)) {
      o(a);
      return;
    }
    if (typeof window < "u" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      o(a);
      return;
    }
    const d = Number.isFinite(r) ? r : a, h = performance.now();
    let f = 0;
    const m = (_) => {
      const b = Math.min(1, (_ - h) / i), v = 1 - (1 - b) ** 3;
      o(d + (a - d) * v), b < 1 && (f = requestAnimationFrame(m));
    };
    return f = requestAnimationFrame(m), () => cancelAnimationFrame(f);
  }, [a, i]), r;
}
function Sb(a, i = 520) {
  const [r, o] = x.useState(0);
  return x.useEffect(() => {
    if (typeof window < "u" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      o(1);
      return;
    }
    o(0);
    const d = performance.now();
    let h = 0;
    const f = (m) => {
      const _ = Math.min(1, (m - d) / i);
      o(1 - (1 - _) ** 3), _ < 1 && (h = requestAnimationFrame(f));
    };
    return h = requestAnimationFrame(f), () => cancelAnimationFrame(h);
  }, [a, i]), r;
}
function kb(a, i) {
  const r = Math.max(a, 1);
  return { dasharray: `${r}`, dashoffset: r * (1 - i) };
}
function Ir(a, i, r, o) {
  return { x: a + r * Math.cos(o), y: i - r * Math.sin(o) };
}
function ad(a, i, r) {
  const o = Math.min(1, Math.max(0, (a - i) / Math.max(r - i, 1e-6)));
  return Math.PI - o * Math.PI;
}
function p1(a, i, r, o, d, h, f) {
  const m = Ir(d, h, f, ad(a, r, o)), _ = Ir(d, h, f, ad(i, r, o));
  return `M ${m.x.toFixed(2)} ${m.y.toFixed(2)} A ${f} ${f} 0 0 0 ${_.x.toFixed(2)} ${_.y.toFixed(2)}`;
}
const Xt = {
  track: "#243044",
  teal: "#26c6da",
  ok: "#66bb6a",
  amber: "#ffb74d",
  bad: "#ef5350",
  gray4: "#8b95a8",
  gray5: "#8b95a8",
  white: "#e8eef8"
};
function Xe({
  value: a,
  min: i = 0,
  max: r = 100,
  label: o,
  unit: d = "",
  target: h,
  band: f,
  extrema: m,
  stale: _,
  onClick: b
}) {
  const v = Number.isFinite(a) ? a : NaN, g = Number.isFinite(v), j = nd(g ? v : i), S = Math.min(r, Math.max(i, g ? j : i)), N = Math.max(r - i, 1e-6), C = g ? (S - i) / N : 0, E = 46, z = 2 * Math.PI * E * 0.75, U = z * C, Q = (oe) => ad(oe, i, r), X = jd(f) ? f : void 0, F = !!(g && _), Z = di({
    value: v,
    band: X,
    margin: hc(X, d),
    stale: F,
    available: g
  }), I = s1(Z), ae = g && X ? p1(X.min, X.max, i, r, 60, 72, E) : "", ie = g ? F ? Xt.amber : Z === "critical" ? Xt.bad : Z === "warn" ? Xt.amber : X ? Xt.ok : Xt.teal : Xt.gray4, de = `dsc-gauge-glow-${x.useId().replace(/:/g, "")}`, re = [];
  g && (X && re.push({ v: X.min, kind: "band" }, { v: X.max, kind: "band" }), m?.min != null && re.push({ v: m.min, kind: "ext" }), m?.max != null && re.push({ v: m.max, kind: "ext" }), h != null && Number.isFinite(h) && re.push({ v: h, kind: "target" }));
  const ce = /* @__PURE__ */ s.jsxs(
    "div",
    {
      className: `dsc-gauge ${I}${F ? " is-stale" : ""}${b ? " is-clickable" : ""}`,
      children: [
        /* @__PURE__ */ s.jsxs("svg", { viewBox: "0 0 120 90", width: "140", height: "105", "aria-label": o, children: [
          /* @__PURE__ */ s.jsx("defs", { children: /* @__PURE__ */ s.jsxs("filter", { id: de, x: "-40%", y: "-40%", width: "180%", height: "180%", children: [
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
              stroke: Xt.track,
              strokeWidth: "10",
              strokeLinecap: "butt"
            }
          ),
          ae ? /* @__PURE__ */ s.jsx(
            "path",
            {
              d: ae,
              fill: "none",
              stroke: Xt.ok,
              strokeWidth: "10",
              strokeLinecap: "butt",
              opacity: 0.38,
              children: /* @__PURE__ */ s.jsx("title", { children: "In-band range" })
            }
          ) : null,
          g ? /* @__PURE__ */ s.jsx(
            "path",
            {
              className: "dsc-gauge-value",
              d: "M18 72 A46 46 0 1 1 102 72",
              fill: "none",
              stroke: ie,
              strokeWidth: "10",
              strokeLinecap: "round",
              strokeDasharray: `${U} ${z}`,
              filter: `url(#${de})`,
              style: { transition: "stroke-dasharray 280ms ease, stroke 280ms ease" }
            }
          ) : null,
          re.map((oe, M) => {
            const R = Q(oe.v), D = Ir(60, 72, oe.kind === "ext" ? E - 2 : E + 1, R), q = Ir(60, 72, E - (oe.kind === "target" ? 14 : 10), R), P = oe.kind === "target" ? Xt.teal : oe.kind === "band" ? Xt.amber : Xt.gray5, W = oe.kind === "target" ? "Target" : oe.kind === "band" ? "Want edge" : "Session extreme";
            return /* @__PURE__ */ s.jsx(
              "line",
              {
                x1: q.x,
                y1: q.y,
                x2: D.x,
                y2: D.y,
                stroke: P,
                strokeWidth: oe.kind === "target" ? 2.4 : 1.6,
                strokeLinecap: "round",
                opacity: oe.kind === "ext" ? 0.65 : 0.95,
                children: /* @__PURE__ */ s.jsx("title", { children: W })
              },
              `${oe.kind}-${M}`
            );
          }),
          /* @__PURE__ */ s.jsx(
            "text",
            {
              x: "60",
              y: "58",
              textAnchor: "middle",
              fill: Xt.white,
              fontSize: "20",
              fontWeight: "700",
              fontFamily: "var(--dsc-mono)",
              children: Number.isFinite(v) ? v.toFixed(v >= 100 ? 0 : v < 10 ? 2 : 1) : "—"
            }
          ),
          /* @__PURE__ */ s.jsx("text", { x: "60", y: "74", textAnchor: "middle", fill: F ? Xt.amber : Xt.gray5, fontSize: "10", children: F ? "HELD" : g ? d : "no data" })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-gauge-label", children: o })
      ]
    }
  );
  return b ? /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-gauge-hit", onClick: b, title: `History · ${o}`, children: ce }) : ce;
}
function Nb({
  series: a,
  color: i = "var(--dsc-teal)",
  width: r = 120,
  height: o = 28
}) {
  const d = a.length ? `${a[0].t}-${a[a.length - 1].t}-${a.length}` : "empty", h = Sb(d, 420);
  if (a.length < 2)
    return /* @__PURE__ */ s.jsx("div", { className: "dsc-sparkline dsc-muted", style: { width: r, height: o } });
  const f = a.map((C) => C.v), m = Math.min(...f), _ = Math.max(...f), b = Math.max(_ - m, 1e-6), v = a[0].t, g = a[a.length - 1].t, j = Math.max(g - v, 1), w = a.map((C, E) => {
    const z = (C.t - v) / j * r, U = o - (C.v - m) / b * (o - 4) - 2;
    return `${E === 0 ? "M" : "L"}${z.toFixed(1)} ${U.toFixed(1)}`;
  }).join(" "), S = r * 1.25, N = kb(S, h);
  return /* @__PURE__ */ s.jsx("svg", { className: "dsc-sparkline", width: r, height: o, "aria-hidden": !0, children: /* @__PURE__ */ s.jsx(
    "path",
    {
      d: w,
      fill: "none",
      stroke: i,
      strokeWidth: "1.6",
      strokeLinecap: "round",
      strokeDasharray: N.dasharray,
      strokeDashoffset: N.dashoffset
    }
  ) });
}
function _1({
  row: a
}) {
  const i = a.want != null ? a.want : a.wantMin != null && a.wantMax != null && a.wantMax > a.wantMin ? (a.wantMin + a.wantMax) / 2 : NaN, r = !Number.isFinite(a.got), o = !!(!r && a.stale), d = a.wantMin != null && a.wantMax != null && Number.isFinite(a.wantMin) && Number.isFinite(a.wantMax) && a.wantMax > a.wantMin ? { min: a.wantMin, max: a.wantMax } : void 0, h = di({
    value: a.got,
    band: d,
    margin: hc(d, a.unit),
    stale: o,
    available: !r
  }), f = Math.max(
    r ? 0 : a.got,
    Number.isFinite(i) ? i : 0,
    a.wantMax ?? 0,
    1
  ), m = r ? 0 : a.got / f * 100, _ = Number.isFinite(i) ? i / f * 100 : 0, b = nd(m), v = nd(_);
  return /* @__PURE__ */ s.jsxs("div", { className: `dsc-gotwant-row${o ? " is-stale" : r ? " is-muted" : ""}`, children: [
    /* @__PURE__ */ s.jsx("div", { className: "dsc-gotwant-label", children: a.label }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-gotwant-track", children: [
      Number.isFinite(i) ? /* @__PURE__ */ s.jsx("div", { className: "dsc-gotwant-want", style: { width: `${v}%` } }) : null,
      r ? null : /* @__PURE__ */ s.jsx(
        "div",
        {
          className: "dsc-gotwant-got",
          style: { width: `${b}%`, background: Sd(h) }
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-gotwant-vals", children: [
      /* @__PURE__ */ s.jsxs("span", { children: [
        "Got ",
        r ? "—" : a.got.toFixed(1),
        r ? "" : a.unit || ""
      ] }),
      /* @__PURE__ */ s.jsxs("span", { className: "dsc-muted", children: [
        "Want",
        " ",
        a.wantMin != null && a.wantMax != null ? `${a.wantMin}–${a.wantMax}` : Number.isFinite(i) ? i.toFixed(1) : "—"
      ] })
    ] })
  ] });
}
function Cb({
  rows: a
}) {
  return /* @__PURE__ */ s.jsx("div", { className: "dsc-gotwant", children: a.map((i) => /* @__PURE__ */ s.jsx(_1, { row: i }, i.label)) });
}
function An(a) {
  if (!a.length) return {};
  let i = a[0].v, r = a[0].v;
  for (const o of a)
    o.v < i && (i = o.v), o.v > r && (r = o.v);
  return { min: i, max: r };
}
const sl = [
  { label: "Cycle", hours: 12 },
  { label: "Photo", hours: 18 }
];
function ll({
  hours: a,
  setHours: i,
  extras: r
}) {
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-timespan", role: "group", "aria-label": "Chart timespan", children: [
    u1.map((o) => /* @__PURE__ */ s.jsxs(
      "button",
      {
        type: "button",
        className: `dsc-chip${a === o ? " dsc-chip--ok" : ""}`,
        onClick: () => i(o),
        children: [
          o,
          "h"
        ]
      },
      o
    )),
    (r || []).map((o) => /* @__PURE__ */ s.jsx(
      "button",
      {
        type: "button",
        className: `dsc-chip${a === o.hours ? " dsc-chip--ok" : ""}`,
        onClick: () => i(o.hours),
        children: o.label
      },
      o.label
    ))
  ] });
}
function b1({
  open: a,
  onClose: i,
  entityId: r,
  label: o,
  unit: d = "",
  color: h = "var(--dsc-blue)"
}) {
  const { hours: f, setHours: m, maxPoints: _ } = al(6), b = xe(r || "", { hours: f, maxPoints: _ }), v = f <= 18 ? f * 2 : Math.min(f + 24, 48), g = xe(r || "", { hours: v, maxPoints: _ }), j = x.useMemo(() => {
    const S = f * 3600 * 1e3, N = Date.now() - S;
    return g.series.filter((C) => C.t < N).map((C) => ({ t: C.t + S, v: C.v }));
  }, [g.series, f]), w = !r || b.series.length < 2;
  return /* @__PURE__ */ s.jsxs(
    os,
    {
      open: a && !!r,
      onClose: i,
      title: o ? `History · ${o}` : "History",
      children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: [
          /* @__PURE__ */ s.jsx(ll, { hours: f, setHours: m, extras: sl }),
          w ? /* @__PURE__ */ s.jsx(H, { label: "Thin recorder", tone: "warn" }) : null,
          j.length > 1 ? /* @__PURE__ */ s.jsx(H, { label: "Prior window ghost", tone: "muted" }) : null
        ] }),
        r ? /* @__PURE__ */ s.jsx(
          jn,
          {
            live: !0,
            unit: d,
            lastSyncAt: b.lastSyncAt,
            series: [
              {
                id: r,
                label: o,
                series: b.series,
                color: h,
                unit: d
              },
              ...j.length > 1 ? [
                {
                  id: `${r}-ghost`,
                  label: `${o} prior`,
                  series: j,
                  color: h,
                  unit: d,
                  ghost: !0
                }
              ] : []
            ]
          }
        ) : null,
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 10, fontSize: 12 }, children: r })
      ]
    }
  );
}
function ec({
  entityId: a,
  hours: i = 24,
  onClick: r,
  label: o = "24h on/off"
}) {
  const { state: d, entity: h } = Ce(), { points: f, loading: m } = kd(a, i, 720), _ = d(a, "off") === "on" ? 1 : 0, b = Date.now(), v = b - i * 3600 * 1e3, g = x.useMemo(() => {
    const z = f.filter((U) => Number.isFinite(U.v));
    return (d(a, "") === "on" || d(a, "") === "off") && z.push({ t: b, v: _ }), xb(z, b);
  }, [f, b, _, d, a]), j = x.useMemo(() => {
    const z = [];
    let U = null;
    for (let Q = 0; Q < g.length; Q++) {
      const X = g[Q], F = X.v >= 0.5;
      F && U == null && (U = Math.max(X.t, v)), !F && U != null && (z.push({ start: U, end: X.t }), U = null);
    }
    return U != null && z.push({ start: U, end: b }), z.filter((Q) => Q.end > v && Q.end > Q.start);
  }, [g, b, v]), w = j.reduce((z, U) => z + (U.end - U.start), 0), S = j.length ? j[j.length - 1].start : null, N = h(a)?.last_changed, C = S ? new Date(S).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : N ? new Date(N).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—", E = /* @__PURE__ */ s.jsxs("div", { className: "dsc-duty-strip", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-duty-meta", children: [
      /* @__PURE__ */ s.jsx("span", { children: o }),
      /* @__PURE__ */ s.jsxs("span", { className: "dsc-muted", children: [
        j.length,
        " cycle",
        j.length === 1 ? "" : "s",
        " · last ",
        C,
        " ·",
        " ",
        m ? "…" : `${(w / 36e5).toFixed(1)}h on`
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("svg", { viewBox: `0 0 ${i} 18`, className: "dsc-duty-svg", preserveAspectRatio: "none", "aria-hidden": !0, children: [
      /* @__PURE__ */ s.jsx("rect", { x: "0", y: "5", width: i, height: "8", rx: "2", fill: "var(--dsc-gray-3)" }),
      j.map((z) => {
        const U = Math.max(0, (z.start - v) / 36e5), Q = Math.max(0.04, (z.end - z.start) / 36e5);
        return /* @__PURE__ */ s.jsx("rect", { x: U, y: "5", width: Q, height: "8", rx: "1.5", fill: "var(--dsc-teal)" }, z.start);
      })
    ] })
  ] });
  return r ? /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-duty-hit", onClick: r, title: `History · ${o}`, children: E }) : E;
}
const g1 = {
  title: "Fleet version",
  what: "A device is missing firmware or running a different version than expected. Devices deliberately out of service (AC, clone mister, pot 3) are not counted here.",
  fix: "Open Fleet and update the outdated device. If the device is not built yet, leave it out of service — that is not a failure."
}, v1 = {
  title: "Out of service",
  what: "This device is not running. It may be deliberately out of service (not built yet), temporarily paused, or locked out by an operator.",
  fix: "If the device is built and should run, switch it back in service from Fleet. If it was paused temporarily, clear that once the pause is over. Unbuilt devices stay out of service — not an alarm."
}, x1 = {
  title: "Hub link",
  what: "The hub is not responding. The display holds the last good readings instead of showing made-up values.",
  fix: "Check hub power, the Wi-Fi channel, and firmware on Fleet. Brief dropouts recover on their own within about half a minute."
}, y1 = {
  title: "Panel link",
  what: "The control panel has lost its direct radio link. A limited fallback link may still be working — slower, but not offline.",
  fix: "Check the panel's firmware and link age on Fleet. If its Wi-Fi signal is still reporting, the panel is on the fallback link, not offline."
}, w1 = {
  title: "Heartbeat",
  what: "The hub's regular liveness pulse has stopped arriving. This is separate from the climate readings.",
  fix: "If the hub link is also down, fix the hub first. If the link is up but the heartbeat is missing, restart the hub."
}, j1 = {
  title: "Device",
  what: "This shows the device's real state: running, idle, deliberately out of service, not set up yet, or offline after a short grace period.",
  fix: "Out of service: leave it if the device is not built. Offline: give it a moment, then check Fleet. Not set up: the device has not been added yet."
}, tc = {
  "binary_sensor.dsc_hub_emergency_failsafe": {
    title: "Emergency failsafe",
    what: "The hub's failsafe is armed — climate is running in a protective mode, not normal automation.",
    fix: "Open Mission, clear the cause (sensor fault, runaway heat), then reset failsafe from the hub."
  },
  "binary_sensor.dsc_hub_climate_sensor_fault": {
    title: "Climate sensor fault",
    what: "A tent or room temperature/humidity reading cannot be trusted right now.",
    fix: "Check the sensor. Readings are held until it comes back — nothing is guessed."
  },
  "binary_sensor.dsc_hub_aux_sensor_fault": {
    title: "Aux sensor fault",
    what: "A secondary climate sensor failed, so some readings may be incomplete.",
    fix: "Check sensor health on Fleet. Do not turn automation up to compensate."
  },
  "binary_sensor.dsc_hub_root_zone_sensor_fault": {
    title: "Root-zone probes",
    what: "A pot probe that heat-mat control relies on is missing or untrusted.",
    fix: "Open Root. If the probe hardware failed, take that pot out of service so it stops influencing control."
  },
  "binary_sensor.dsc_clone_dark_period_violation": {
    title: "2×4 dark violation",
    what: "The light is on while the 2×4 tent should be dark. This risks stressing the plants.",
    fix: "Open Light. Turn the lamp off or let catch-up finish. Manual hold and manual control are intentional exceptions."
  },
  "binary_sensor.dsc_clone_light_missing_in_window": {
    title: "Light missing in window",
    what: "The 2×4 light window is open but the lamp has not delivered its hours yet. The shortfall is tracked, not hidden.",
    fix: "Check the lamp, the automatic photoperiod, and light catch-up. This alert is skipped while the clone tent is off or under manual control."
  },
  "binary_sensor.dsc_hub_coherence_mismatch": {
    title: "Coherence mismatch",
    what: "The hub and the app disagree about a commanded device.",
    fix: "Re-sync from Fleet. Avoid switching the same device from two places at once."
  },
  "binary_sensor.dsc_nest_channel_split": {
    title: "Wi-Fi channel split",
    what: "The hub's access point and the house Wi-Fi are on different channels.",
    fix: "Known limitation — the hub's own access point takes priority and recovers on its own."
  },
  "binary_sensor.dsc_humidifier_vent_conflict": {
    title: "Humidifier vent conflict",
    what: "Adding moisture while venting it straight outside — wasteful.",
    fix: "Lower the exhaust or stop the humidifier. Check the vent split on Climate."
  },
  "binary_sensor.dsc_heater_vent_conflict": {
    title: "Heater vent conflict",
    what: "Adding heat while venting it straight outside. Should be rare.",
    fix: "Close the exhaust or stop the heater. Confirm the interlock on Climate."
  },
  "binary_sensor.dsc_humidifier_ineffective_suspect": {
    title: "Humidifier ineffective",
    what: "The humidifier ran but humidity did not rise enough to trust it.",
    fix: "Check the water level, the fan path, and room airflow. Do not leave it running for show."
  },
  "binary_sensor.dsc_heater_ineffective_suspect": {
    title: "Heater ineffective",
    what: "The heater ran but tent temperature did not climb.",
    fix: "Check the relay, the exhaust rate, and room airflow before buying more power."
  },
  "binary_sensor.dsc_grow_mat_ineffective_suspect": {
    title: "Heat mat ineffective",
    what: "The mat ran but root temperature did not climb on active pots.",
    fix: "Open Root. Confirm the mat is actually switching, and that the right pots are in service."
  },
  "binary_sensor.dsc_plant_specs_incomplete": {
    title: "Plant specs incomplete",
    what: "Equipment ratings or volumes needed for climate planning are missing.",
    fix: "Fill in the specs under Tune. Missing specs are shown as missing, not defaulted."
  },
  "binary_sensor.dsc_plant_specs_intake_over_exhaust": {
    title: "Intake over exhaust",
    what: "Rated intake airflow exceeds exhaust capacity — the air budget cannot balance.",
    fix: "Lower the intake ratings or raise the exhaust. Measured airflow from calibration takes priority."
  },
  "binary_sensor.dsc_plant_specs_ac_capacity_missing": {
    title: "AC capacity missing",
    what: "The AC is marked in service but has no capacity rating.",
    fix: "If the AC is not built, take it out of service. If it is built, enter its capacity."
  },
  "binary_sensor.dsc_plant_specs_dehum_rate_zero": {
    title: "Dehumidifier rate 0",
    what: "The dehumidifier's rate is set to zero, so moisture removal cannot be planned.",
    fix: "Enter the litres-per-day rating, or take the dehumidifier out of service."
  },
  "binary_sensor.dsc_plant_specs_hum_rate_zero": {
    title: "Humidifier rate 0",
    what: "The humidifier's rate is set to zero.",
    fix: "Enter the rate. Do not run it with a zero budget."
  },
  "binary_sensor.dsc_plant_specs_heater_zero": {
    title: "Heater spec 0",
    what: "The heater's capacity is set to zero.",
    fix: "Enter the watt or BTU rating, or stop relying on the heater for keep-up."
  },
  "binary_sensor.dsc_tank_ec_out_of_range": {
    title: "Tank EC out of range",
    what: "Tank nutrient strength is outside the band for the current stage.",
    fix: "Test the tank. Confirm the probe before changing the mix."
  },
  "binary_sensor.dsc_tank_ph_out_of_range": {
    title: "Tank pH out of range",
    what: "Tank pH has left the band for the current stage.",
    fix: "Correct the tank. Confirm the probe before dosing."
  },
  "binary_sensor.dsc_tank_water_too_warm": {
    title: "Tank too warm",
    what: "Reservoir temperature is high enough to encourage unwanted growth.",
    fix: "Cool the tank or improve room airflow."
  },
  "binary_sensor.dsc_hub_light_catchup_active": {
    title: "Light catch-up",
    what: "The 2×4 is making up missed light hours. The hours gauge shows what was actually delivered.",
    fix: "Let catch-up finish on its own."
  },
  "binary_sensor.dsc_reduced_kit": {
    title: "Capacity offline",
    what: "A device that should be running is temporarily out of service or locked out — not one of the deliberately unbuilt devices.",
    fix: "Clear the temporary pause or lockout, or bring the affected device back. Deliberately out-of-service devices do not trigger this."
  }
};
function $r(a) {
  return {
    [`binary_sensor.dsc_pot${a}_moisture_out_of_range`]: {
      title: `Pot ${a} moisture`,
      what: `Pot ${a} moisture has left its target band.`,
      fix: "Open Root and check that pot. Pots out of service never show made-up readings."
    },
    [`binary_sensor.dsc_pot${a}_ph_out_of_range`]: {
      title: `Pot ${a} pH`,
      what: `Pot ${a} pH has left its target band.`,
      fix: "Check the pot on Root. Confirm the probe before dosing."
    },
    [`binary_sensor.dsc_pot${a}_root_zone_temp_out_of_range`]: {
      title: `Pot ${a} root T`,
      what: `Pot ${a} soil temperature has left its trusted band.`,
      fix: "Check the heat mat and airflow first. The mat should not run for a pot that is out of service."
    },
    [`binary_sensor.dsc_pot${a}_ec_salt_build_up`]: {
      title: `Pot ${a} salt build-up`,
      what: `Pot ${a} nutrient strength is high compared with its baseline.`,
      fix: "Check the pot on Root. Decide flush vs feed from the pot's Need reading, not just this alert."
    },
    [`binary_sensor.dsc_pot${a}_ec_depleted_vs_baseline`]: {
      title: `Pot ${a} EC depleted`,
      what: `Pot ${a} nutrient strength is low compared with its baseline.`,
      fix: "Feed based on the pot's Need reading. Confirm the probe is trusted."
    },
    [`binary_sensor.dsc_pot${a}_nitrogen_below_baseline`]: {
      title: `Pot ${a} N below baseline`,
      what: `Pot ${a} nitrogen is below its rolling baseline.`,
      fix: "Check the NPK readings on Root. Do not act on an untrusted probe."
    },
    [`binary_sensor.dsc_pot${a}_nitrogen_depleting_fast`]: {
      title: `Pot ${a} N depleting`,
      what: `Pot ${a} nitrogen is falling faster than expected.`,
      fix: "Check the trend on Root and compare irrigation against the pot's Need."
    }
  };
}
Object.assign(tc, $r(1), $r(2), $r(3), $r(4));
function S1(a, i) {
  return tc[a] ? tc[a] : i === "fleet" || a === "sensor.dsc_fleet_version_status" ? g1 : i === "kit" ? j1 : a.includes("in_service") || a.endsWith("_oos") ? v1 : a.includes("hub_link") || a.includes("hub_uptime") ? x1 : a.includes("panel_link") || a.includes("control_wifi") ? y1 : a.includes("heartbeat") ? w1 : {
    title: a.split(".").pop()?.replace(/_/g, " ") || "Reading",
    what: "A live reading recorded by the hub. Use the timespan buttons here to explore its history.",
    fix: "If the number looks wrong, check the sensor or its target. If it shows no value, nothing was measured — it is not a zero."
  };
}
const Eb = Object.keys(tc);
function La(a) {
  if (!Number.isFinite(a) || a < 0) return "—";
  const i = Math.floor(a / 1e3);
  if (i < 60) return `${Math.max(1, i)}S`;
  const r = Math.floor(i / 60);
  if (r < 60) return `${r}M`;
  const o = Math.floor(r / 60), d = r % 60;
  return o < 48 ? d > 0 ? `${o}H ${d}M` : `${o}H` : `${(o / 24).toFixed(1)}D`;
}
function k1(a, i, r) {
  if (i === "binary" || i === "alert" || a.startsWith("binary_sensor.") || a.startsWith("switch.") || a.startsWith("light."))
    return !0;
  const o = (r || "").toLowerCase();
  return o === "on" || o === "off";
}
function N1({
  target: a,
  onClose: i
}) {
  const { state: r, num: o, available: d, entity: h } = Ce(), { callService: f } = Ht(), { hours: m, setHours: _, maxPoints: b } = al(6), { isSnoozed: v, snooze: g, unsnooze: j } = fc(), w = a?.entityId ?? "", S = w ? r(w, "") : "", N = a ? k1(w, a.kind, S) : !1, C = xe(w, { hours: N ? 24 : m, maxPoints: N ? 288 : b }), E = m <= 18 ? m * 2 : Math.min(m + 24, 48), z = xe(w, { hours: E, maxPoints: b }), U = x.useMemo(() => {
    const M = m * 3600 * 1e3, R = Date.now() - M;
    return z.series.filter((D) => D.t < R).map((D) => ({ t: D.t + M, v: D.v }));
  }, [z.series, m]);
  if (!a) return null;
  const Q = S1(a.entityId, a.kind), X = h(a.entityId), F = X?.last_changed ? Date.parse(X.last_changed) : NaN, Z = Number.isFinite(F) ? La(Date.now() - F) + " ago" : "—", I = C.series.length < 2, ae = v(a.entityId), ie = a.runtimeToday ? o(a.runtimeToday) : NaN, de = a.cyclesToday ? o(a.cyclesToday) : NaN, re = a.demandEntity, ce = a.entityId.split(".")[0], oe = ce === "switch" || ce === "light" || ce === "input_boolean";
  return /* @__PURE__ */ s.jsxs(os, { open: !!a.entityId, onClose: i, title: a.label, children: [
    d(a.entityId) ? null : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "No data — this reading is not reporting right now." }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ s.jsx(H, { label: `Last ${Z}`, tone: "muted" }),
      Number.isFinite(ie) ? /* @__PURE__ */ s.jsx(H, { label: `Today ${ie.toFixed(2)}h`, tone: "ok" }) : null,
      Number.isFinite(de) ? /* @__PURE__ */ s.jsx(H, { label: `${Math.round(de)} cycles`, tone: "muted" }) : null,
      /* @__PURE__ */ s.jsx(
        H,
        {
          label: S && S !== "—" ? String(S) : "no state",
          tone: S === "on" ? "ok" : S === "off" ? "muted" : "warn"
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-inspector-playbook", children: [
      /* @__PURE__ */ s.jsx("strong", { children: Q.title }),
      /* @__PURE__ */ s.jsx("p", { children: Q.what }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: Q.fix })
    ] }),
    a.kind === "alert" || a.entityId.startsWith("binary_sensor.") ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { margin: "10px 0" }, children: [
      ae ? /* @__PURE__ */ s.jsx(se, { onClick: () => j(a.entityId), children: "Unsnooze" }) : /* @__PURE__ */ s.jsx(se, { onClick: () => g(a.entityId), children: "Acknowledge until hub reboot" }),
      ae ? /* @__PURE__ */ s.jsx(H, { label: "Snoozed this boot", tone: "warn" }) : null
    ] }) : null,
    oe ? /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", style: { marginBottom: 10 }, children: /* @__PURE__ */ s.jsx(
      se,
      {
        primary: !0,
        onClick: () => void f(ce, S === "on" ? "turn_off" : "turn_on", {
          entity_id: a.entityId
        }),
        children: S === "on" ? "Turn off" : "Turn on"
      }
    ) }) : null,
    N || re ? /* @__PURE__ */ s.jsx(ec, { entityId: re || a.entityId, hours: 24 }) : null,
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { margin: "12px 0" }, children: [
      /* @__PURE__ */ s.jsx(ll, { hours: m, setHours: _, extras: sl }),
      I ? /* @__PURE__ */ s.jsx(H, { label: "Limited history", tone: "warn" }) : null,
      U.length > 1 ? /* @__PURE__ */ s.jsx(H, { label: "Previous period (faded)", tone: "muted" }) : null
    ] }),
    /* @__PURE__ */ s.jsx(
      jn,
      {
        live: !0,
        unit: N ? "" : a.unit || "",
        lastSyncAt: C.lastSyncAt,
        yDomain: N ? { left: { min: 0, max: 1 } } : void 0,
        emptyLabel: "no history yet",
        series: [
          {
            id: a.entityId,
            label: a.label,
            series: C.series,
            color: a.color || "var(--dsc-teal)",
            unit: N ? "" : a.unit,
            step: N
          },
          ...U.length > 1 ? [
            {
              id: `${a.entityId}-ghost`,
              label: `${a.label} prior`,
              series: U,
              color: a.color || "var(--dsc-teal)",
              unit: a.unit,
              ghost: !0
            }
          ] : []
        ]
      }
    ),
    /* @__PURE__ */ s.jsxs("details", { className: "dsc-inspector-details", children: [
      /* @__PURE__ */ s.jsx("summary", { children: "Details" }),
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { fontFamily: "var(--dsc-mono)", fontSize: 12 }, children: [
        a.entityId,
        d(a.entityId) ? "" : " · unavailable"
      ] })
    ] })
  ] });
}
const Mb = x.createContext(null);
function C1({ children: a }) {
  const [i, r] = x.useState(null), o = x.useCallback(() => r(null), []), d = x.useCallback((f) => r(f), []), h = x.useMemo(() => ({ open: d, close: o }), [d, o]);
  return /* @__PURE__ */ s.jsxs(Mb.Provider, { value: h, children: [
    a,
    /* @__PURE__ */ s.jsx(N1, { target: i, onClose: o })
  ] });
}
function kn() {
  const a = x.useContext(Mb);
  return a || {
    open: () => {
    },
    close: () => {
    }
  };
}
const E1 = {
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
function Je({
  entityId: a,
  label: i,
  step: r,
  tone: o,
  hint: d,
  onLive: h
}) {
  const { state: f, available: m, attributes: _ } = el(a), { callService: b } = Ht(), v = m, g = Number(f), j = Number(_?.min ?? 0), w = Number(_?.max ?? 100), S = r ?? Number(_?.step ?? 0.1), [N, C] = x.useState(String(Number.isFinite(g) ? g : "")), E = x.useRef(!1);
  x.useEffect(() => {
    !E.current && Number.isFinite(g) && C(String(g));
  }, [g]);
  const z = () => {
    if (!v) return;
    const Q = Number(N);
    if (!Number.isFinite(Q)) {
      C(String(Number.isFinite(g) ? g : ""));
      return;
    }
    const X = Math.min(w, Math.max(j, Q)), Z = a.split(".")[0] === "input_number" ? "input_number" : "number";
    b(Z, "set_value", { entity_id: a, value: X }), C(String(X));
  }, U = o === "critical" ? "is-bad" : o === "warn" ? "is-warn" : o === "muted" ? "is-muted" : "";
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-target-num${v ? "" : " is-disabled"} ${U}`.trim(), children: [
    /* @__PURE__ */ s.jsx("span", { className: "dsc-target-num-label", children: i }),
    /* @__PURE__ */ s.jsx(
      "input",
      {
        type: "number",
        value: N,
        disabled: !v,
        min: j,
        max: w,
        step: S,
        onFocus: () => {
          E.current = !0;
        },
        onChange: (Q) => {
          C(Q.target.value);
          const X = Number(Q.target.value);
          Number.isFinite(X) && h?.(X);
        },
        onBlur: () => {
          E.current = !1, z();
        },
        onKeyDown: (Q) => {
          Q.key === "Enter" && Q.target.blur();
        }
      }
    ),
    d ? /* @__PURE__ */ s.jsx("span", { className: "dsc-target-hint", children: d }) : null
  ] });
}
function Zu({ tent: a, title: i, hero: r }) {
  const { num: o, state: d, entity: h } = Ce(), f = kn(), m = E1[a], _ = td(a, { state: d, entity: h }), b = _e(m.gotTemp), v = _e(m.gotRh), g = _e(m.gotVpd), j = b.stale ? NaN : b.value, w = v.stale ? NaN : v.value, S = g.stale ? NaN : g.value, N = o(m.temp), C = o(m.rhMin), E = o(m.rhMax), [z, U] = x.useState(N), [Q, X] = x.useState(C), [F, Z] = x.useState(E), [I, ae] = x.useState(o(m.vpdMin)), [ie, de] = x.useState(o(m.vpdMax)), re = za(z, _.temp), ce = za(Q, _.rh, Q > F), oe = za(F, _.rh, Q > F), M = za(I, _.vpd, I > ie), R = za(ie, _.vpd, I > ie), D = (q, P, W) => {
    f.open({ entityId: q, label: P, unit: W });
  };
  return /* @__PURE__ */ s.jsxs("div", { className: `dsc-tent-targets${r ? " is-hero" : ""}`, children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-tent-targets-head", children: [
      /* @__PURE__ */ s.jsx("strong", { children: i }),
      _.mixed ? /* @__PURE__ */ s.jsx(H, { label: "mixed stages", tone: "warn" }) : null,
      _.emptyLabel ? /* @__PURE__ */ s.jsx(H, { label: _.emptyLabel, tone: "muted" }) : null,
      _.stages.map((q) => /* @__PURE__ */ s.jsx(H, { label: q, tone: "muted" }, q)),
      /* @__PURE__ */ s.jsx(
        oc,
        {
          label: `${i} more`,
          items: [
            { id: "temp", label: "Inspector · temp", onSelect: () => D(m.temp, `${i} Want T`, "°C") },
            { id: "rh", label: "Inspector · RH", onSelect: () => D(m.rhMin, `${i} RH min`, "%") },
            { id: "vpd", label: "Inspector · VPD", onSelect: () => D(m.vpdMin, `${i} VPD min`, "kPa") }
          ]
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs(
      "button",
      {
        type: "button",
        className: "dsc-got-want dsc-got-want-hit",
        onClick: () => D(m.gotTemp, `${i} Got T`, "°C"),
        children: [
          /* @__PURE__ */ s.jsxs("span", { children: [
            "Got ",
            Number.isFinite(j) ? `${j.toFixed(1)}°C` : "—",
            " /",
            " ",
            Number.isFinite(w) ? `${w.toFixed(0)}%` : "—",
            Number.isFinite(S) ? ` / ${S.toFixed(2)} kPa` : ""
          ] }),
          /* @__PURE__ */ s.jsxs("span", { className: "dsc-muted", children: [
            "Want ",
            Number.isFinite(N) ? N.toFixed(1) : "—",
            "°C · RH",
            " ",
            Number.isFinite(C) ? C.toFixed(0) : "—",
            "–",
            Number.isFinite(E) ? E.toFixed(0) : "—",
            "%"
          ] })
        ]
      }
    ),
    _.needs.length ? /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: _.needs.map((q) => /* @__PURE__ */ s.jsx(H, { label: `Need ${q}`, tone: "warn" }, q)) }) : null,
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
      /* @__PURE__ */ s.jsx(Je, { entityId: m.temp, label: "Temp °C", step: 0.5, tone: re.tone, hint: re.label, onLive: U }),
      /* @__PURE__ */ s.jsx(Je, { entityId: m.rhMin, label: "RH min %", step: 1, tone: ce.tone, hint: ce.label, onLive: X }),
      /* @__PURE__ */ s.jsx(Je, { entityId: m.rhMax, label: "RH max %", step: 1, tone: oe.tone, hint: oe.label, onLive: Z }),
      /* @__PURE__ */ s.jsx(Je, { entityId: m.vpdMin, label: "VPD min", step: 0.01, tone: M.tone, hint: M.label, onLive: ae }),
      /* @__PURE__ */ s.jsx(Je, { entityId: m.vpdMax, label: "VPD max", step: 0.01, tone: R.tone, hint: R.label, onLive: de })
    ] })
  ] });
}
function Tb({
  compact: a,
  emphasize: i,
  only: r,
  hero: o
}) {
  const d = r ? [r] : i === "clone" ? ["clone", "main"] : ["main", "clone"];
  return o && !r ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-heroes", children: [
    /* @__PURE__ */ s.jsx(Zu, { tent: "clone", title: "2×4 climate", hero: !0 }),
    /* @__PURE__ */ s.jsx(Zu, { tent: "main", title: "4×8 climate", hero: !0 })
  ] }) : /* @__PURE__ */ s.jsx("div", { className: `dsc-target-panel${a ? " is-compact" : ""}`, children: d.map((h) => /* @__PURE__ */ s.jsx(Zu, { tent: h, title: h === "main" ? "4×8 climate" : "2×4 climate", hero: o }, h)) });
}
const h_ = [1, 2, 3, 4, 5, 6, 7, 8];
function M1() {
  const { available: a, entity: i, num: r, state: o } = Ce(), { callService: d } = Ht(), [h, f] = x.useState(null), [m, _] = x.useState(null), [b, v] = x.useState(null), [g, j] = x.useState(null), w = o("input_text.dsc_build_strain", ""), S = o("input_text.dsc_build_nickname", ""), N = o("input_select.dsc_build_assign_pot", "none"), C = o("input_select.dsc_build_tent", "4x8"), E = o("sensor.dsc_build_expected_stage", ""), z = o("sensor.dsc_build_days_since_sprout", ""), U = r("input_number.dsc_blend_total_l", 20), Q = o("input_select.dsc_light_fixture", ""), X = o("input_select.dsc_build_vessel", ""), F = ed(X || void 0, U), Z = r("input_number.dsc_mix_tank_liters", 20), I = r("input_number.dsc_mix_strength_pct", 100), ae = (Number.isFinite(I) ? I : 100) / 100, ie = Number.isFinite(Z) && Z > 0 ? Z : 20, de = (D, q) => {
    if (D === "strain")
      v(q), d("input_text", "set_value", { entity_id: "input_text.dsc_build_strain", value: q.name });
    else if (D === "medium") {
      const P = q.composition && typeof q.composition == "object" ? Object.entries(q.composition).filter(([, W]) => Number.isFinite(Number(W)) && Number(W) > 0).slice(0, 3) : [];
      if (P.length)
        for (let W = 1; W <= 3; W++) {
          const k = P[W - 1];
          d("input_text", "set_value", {
            entity_id: `input_text.dsc_blend_component_${W}_name`,
            value: k ? String(k[0]) : ""
          }), d("input_number", "set_value", {
            entity_id: `input_number.dsc_blend_pct_${W}`,
            value: k ? Number(k[1]) : 0
          });
        }
      else
        d("input_text", "set_value", {
          entity_id: "input_text.dsc_blend_component_1_name",
          value: q.name
        });
    } else if (D === "nutrient")
      for (const P of h_) {
        const W = o(`input_text.dsc_nutrient_${P}_name`, ""), k = o(`input_boolean.dsc_nutrient_${P}_in_inventory`) === "on";
        if (!W || W === "unknown" || !k) {
          d("input_text", "set_value", {
            entity_id: `input_text.dsc_nutrient_${P}_name`,
            value: q.name
          }), q.dose_ml_l != null && Number.isFinite(Number(q.dose_ml_l)) && d("input_number", "set_value", {
            entity_id: `input_number.dsc_nutrient_${P}_dose_ml_l`,
            value: Number(q.dose_ml_l)
          }), d("input_boolean", "turn_on", { entity_id: `input_boolean.dsc_nutrient_${P}_in_inventory` });
          break;
        }
      }
    else if (D === "light") {
      j(q);
      const W = (i("input_select.dsc_light_fixture")?.attributes?.options || []).find((k) => k.toLowerCase().includes(String(q.name || "").toLowerCase().slice(0, 18)));
      W ? d("input_select", "select_option", { entity_id: "input_select.dsc_light_fixture", option: W }) : d("input_text", "set_value", { entity_id: "input_text.dsc_light_custom_name", value: q.name });
    }
    f(null);
  }, re = (D) => {
    const q = Number(D);
    if (!Number.isFinite(q) || D === "none") return;
    const P = rb(q);
    a(P) && d("input_select", "select_option", { entity_id: P, option: F.id });
  }, ce = () => {
    d("script", "turn_on", { entity_id: "script.dsc_build_plant_commit" });
  }, oe = () => {
    if (re(N), a("script.dsc_build_plant_commit_and_assign")) {
      d("script", "turn_on", { entity_id: "script.dsc_build_plant_commit_and_assign" });
      return;
    }
    d("script", "turn_on", { entity_id: "script.dsc_build_plant_commit" }), d("script", "turn_on", {
      entity_id: "script.dsc_plant_assign_to_pot",
      pot: N,
      variables: { pot: N }
    });
  }, M = h_.map((D) => {
    const q = o(`input_text.dsc_nutrient_${D}_name`, ""), P = r(`input_number.dsc_nutrient_${D}_dose_ml_l`, 0), W = r(`input_number.dsc_nutrient_${D}_stock_ml`, 0), k = o(`input_boolean.dsc_nutrient_${D}_in_inventory`) === "on", G = !q || q === "unknown" || q === "unavailable", ee = !G && Number.isFinite(P) ? Math.round(P * ie * ae * 10) / 10 : 0;
    return { n: D, name: q, dose: P, stock: W, inv: k, empty: G, ml: ee, short: k && Number.isFinite(W) && W < ee && ee > 0 };
  }), R = M.reduce((D, q) => D + q.ml, 0);
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-compose", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Strain", icon: "roster", children: [
        /* @__PURE__ */ s.jsx(
          Or,
          {
            label: w && w !== "unknown" ? w : "No strain",
            empty: !w || w === "unknown",
            onClick: () => f("strain")
          }
        ),
        b ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { margin: "8px 0" }, children: [
          b.type ? /* @__PURE__ */ s.jsx(H, { label: String(b.type), tone: "muted" }) : null,
          b.height_cm_min != null ? /* @__PURE__ */ s.jsx(
            H,
            {
              label: `${b.height_cm_min}${b.height_cm_max != null ? `–${b.height_cm_max}` : ""}cm`,
              tone: "muted"
            }
          ) : null,
          b.thc_min != null ? /* @__PURE__ */ s.jsx(H, { label: `${b.thc_min}% THC`, tone: "muted" }) : null
        ] }) : null,
        /* @__PURE__ */ s.jsx(Xr, { entityId: "input_text.dsc_build_nickname", label: "Nickname" }),
        /* @__PURE__ */ s.jsx(R0, { entityId: "input_datetime.dsc_build_sprout_date", label: "Sprout date" }),
        E ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { margin: "8px 0" }, children: [
          /* @__PURE__ */ s.jsx(H, { label: `Auto stage · ${E}`, tone: "ok" }),
          z ? /* @__PURE__ */ s.jsx(H, { label: `Day ${z}`, tone: "muted" }) : null
        ] }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: "6px 0 0", fontSize: 12 }, children: "Set a sprout date and the growth stage is calculated from it." }),
        /* @__PURE__ */ s.jsx(Da, { entityId: "input_select.dsc_build_custom_slot", label: "Custom strain slot" })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Vessel + mix", icon: "compose", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
          /* @__PURE__ */ s.jsx(zn, { spec: F, size: 48, label: !0 }),
          /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-chip", onClick: () => f("vessel"), children: F.label })
        ] }),
        /* @__PURE__ */ s.jsx(n1, { volumeL: F.volumeL || U }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", style: { marginTop: 8 }, children: /* @__PURE__ */ s.jsx(Or, { label: "Medium search", onClick: () => f("medium"), empty: !0 }) })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Nutrition", icon: "nutrient", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
          /* @__PURE__ */ s.jsx(Or, { label: "Add from catalog", onClick: () => f("nutrient"), empty: !0 }),
          /* @__PURE__ */ s.jsx(H, { label: `Tank ${ie} L`, tone: "muted" }),
          /* @__PURE__ */ s.jsx(H, { label: `${Math.round(ae * 100)}% strength`, tone: "muted" }),
          /* @__PURE__ */ s.jsx(H, { label: `${R.toFixed(1)} ml`, tone: R > 0 ? "ok" : "muted" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
          /* @__PURE__ */ s.jsx(Je, { entityId: "input_number.dsc_mix_tank_liters", label: "Tank L", step: 0.5 }),
          /* @__PURE__ */ s.jsx(Je, { entityId: "input_number.dsc_mix_strength_pct", label: "Strength %", step: 1 })
        ] }),
        M.map((D) => /* @__PURE__ */ s.jsxs("div", { className: "dsc-nutrient-slot", children: [
          /* @__PURE__ */ s.jsx(Xr, { entityId: `input_text.dsc_nutrient_${D.n}_name`, label: `Slot ${D.n}` }),
          /* @__PURE__ */ s.jsx(Je, { entityId: `input_number.dsc_nutrient_${D.n}_dose_ml_l`, label: "ml/L", step: 0.1 }),
          /* @__PURE__ */ s.jsx("span", { className: "dsc-mono", children: D.empty ? "—" : `${D.ml} ml` }),
          D.short ? /* @__PURE__ */ s.jsx(H, { label: "stock short", tone: "warn" }) : null
        ] }, D.n)),
        /* @__PURE__ */ s.jsx(Xr, { entityId: "input_text.dsc_build_recipe_note", label: "Recipe note", multiline: !0 }),
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: "ml = dose × tank × strength. Empty slots stay empty." })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Light + assign", icon: "lighting", children: [
        /* @__PURE__ */ s.jsx(
          Or,
          {
            label: Q && Q !== "unknown" ? Q : "No fixture",
            empty: !Q || Q === "unknown",
            onClick: () => f("light")
          }
        ),
        g ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { margin: "8px 0" }, children: [
          g.wattage_w != null ? /* @__PURE__ */ s.jsx(H, { label: `${g.wattage_w} W`, tone: "muted" }) : null,
          g.efficacy_umol_j != null ? /* @__PURE__ */ s.jsx(H, { label: `${g.efficacy_umol_j} µmol/J`, tone: "muted" }) : null,
          g.has_ppfd || g.ppfd_url ? /* @__PURE__ */ s.jsx(H, { label: "PPFD", tone: "ok" }) : /* @__PURE__ */ s.jsx(H, { label: "No PPFD URL", tone: "warn" })
        ] }) : null,
        /* @__PURE__ */ s.jsx(Da, { entityId: "input_select.dsc_build_assign_pot", label: "Assign pot", icon: "root" }),
        /* @__PURE__ */ s.jsx(Da, { entityId: "input_select.dsc_build_tent", label: "Tent", icon: "tent" }),
        /* @__PURE__ */ s.jsx(Da, { entityId: "input_select.dsc_build_climate_pot", label: "Climate apply pot", icon: "climate" }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ s.jsx(se, { variant: "primary", onClick: () => _("assign"), children: "Commit + assign" }),
          /* @__PURE__ */ s.jsx(se, { variant: "secondary", onClick: () => _("roster"), children: "Commit roster" }),
          /* @__PURE__ */ s.jsx(se, { variant: "secondary", onClick: () => _("seat"), children: "Assign seat" }),
          /* @__PURE__ */ s.jsx(se, { variant: "danger", onClick: () => _("mix"), children: "Accept mix" }),
          /* @__PURE__ */ s.jsx(se, { variant: "secondary", onClick: () => _("climate"), children: "Apply climate Want" }),
          /* @__PURE__ */ s.jsx(se, { variant: "danger", onClick: () => _("retire"), children: "Retire pot" })
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginBottom: 0 }, children: "Each action asks you to confirm before anything is saved." })
      ] }) })
    ] }),
    /* @__PURE__ */ s.jsx(
      Rt,
      {
        open: h === "strain" || h === "medium" || h === "nutrient" || h === "light",
        onDismiss: () => f(null),
        title: h ? `Search ${h}` : "Search",
        help: null,
        children: h === "strain" || h === "medium" || h === "nutrient" || h === "light" ? /* @__PURE__ */ s.jsx(fb, { kind: h, onPick: (D) => de(h, D) }) : null
      }
    ),
    /* @__PURE__ */ s.jsxs(Rt, { open: h === "vessel", onDismiss: () => f(null), title: "Vessel", help: null, children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: gd.map((D) => /* @__PURE__ */ s.jsxs(
        "button",
        {
          type: "button",
          className: `dsc-chip${D.id === F.id ? " dsc-chip--ok" : ""}`,
          onClick: () => {
            (i("input_select.dsc_build_vessel")?.attributes?.options || []).includes(D.id) && a("input_select.dsc_build_vessel") && d("input_select", "select_option", {
              entity_id: "input_select.dsc_build_vessel",
              option: D.id
            }), d("input_number", "set_value", {
              entity_id: "input_number.dsc_blend_total_l",
              value: D.volumeL
            }), f(null);
          },
          children: [
            /* @__PURE__ */ s.jsx(zn, { spec: D, size: 28 }),
            " ",
            D.label
          ]
        },
        D.id
      )) }),
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { fontSize: 12 }, children: [
        "Default vessel: ",
        ui.label,
        "."
      ] }),
      a("input_select.dsc_build_vessel") ? /* @__PURE__ */ s.jsx(H, { label: "Vessel saved to hub", tone: "ok" }) : /* @__PURE__ */ s.jsx(H, { label: "Volume only — vessel presets unavailable", tone: "warn" })
    ] }),
    /* @__PURE__ */ s.jsx(
      Rt,
      {
        open: m === "roster",
        onDismiss: () => _(null),
        onConfirm: () => {
          ce(), _(null);
        },
        title: "Commit roster",
        confirmLabel: "Write roster",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          "Saves ",
          S || w || "this plant",
          " with vessel ",
          F.label,
          " to the roster",
          C ? ` in the ${C} tent` : "",
          ". Pot assignment stays ",
          N === "none" ? "unset" : N,
          "."
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx(
      Rt,
      {
        open: m === "assign",
        onDismiss: () => _(null),
        onConfirm: () => {
          oe(), _(null);
        },
        title: "Commit + assign",
        confirmLabel: "Write + assign",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          "Saves the roster entry, then assigns it to pot ",
          N === "none" ? "(none — pick a pot first)" : N,
          " in the ",
          C || "4x8",
          " tent and applies the ",
          F.label,
          " vessel to that pot.",
          E ? ` Stage is auto-set to ${E}.` : ""
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx(
      Rt,
      {
        open: m === "seat",
        onDismiss: () => _(null),
        onConfirm: () => {
          re(N), d("script", "turn_on", {
            entity_id: "script.dsc_plant_assign_to_pot",
            pot: N,
            variables: { pot: N }
          }), _(null);
        },
        title: "Assign to pot",
        confirmLabel: "Assign now",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          "Assigns the current plant to pot ",
          N === "none" ? "(none — pick a pot first)" : N,
          ". Nothing is created if the roster entry is missing."
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx(
      Rt,
      {
        open: m === "mix",
        onDismiss: () => _(null),
        onConfirm: () => {
          d("script", "turn_on", { entity_id: "script.dsc_accept_mix" }), _(null);
        },
        title: "Accept mix",
        confirmLabel: "Burn stock",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          "Deducts ",
          R.toFixed(1),
          " ml from nutrient stock — tank ",
          ie,
          " L × ",
          Math.round(ae * 100),
          "% strength. Empty slots are left untouched."
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx(
      Rt,
      {
        open: m === "retire",
        onDismiss: () => _(null),
        onConfirm: () => {
          d("script", "turn_on", {
            entity_id: "script.dsc_plant_retire",
            pot: N,
            variables: { pot: N }
          }), _(null);
        },
        title: "Retire pot",
        confirmLabel: "Remove plant",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          "Removes the plant from pot ",
          N === "none" ? "(none — pick a pot first)" : N,
          " and clears its roster seat. This does not change the pot's in-service flag."
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx(
      Rt,
      {
        open: m === "climate",
        onDismiss: () => _(null),
        onConfirm: () => {
          d("script", "turn_on", { entity_id: "script.dsc_apply_climate_want" }), _(null);
        },
        title: "Apply climate Want",
        confirmLabel: "Write Want",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          "Applies your custom temperature and humidity targets to pot",
          " ",
          o("input_select.dsc_build_climate_pot", "Fleet"),
          ". Only values you entered are used."
        ] })
      }
    )
  ] });
}
const T1 = [
  { id: "strain", label: "Strains" },
  { id: "medium", label: "Mediums" },
  { id: "nutrient", label: "Nutrients" },
  { id: "light", label: "Lights" }
];
function R1(a, i) {
  return Array.isArray(a) && a.length >= 2 ? `${a[0]}–${a[1]}${i}` : a != null && a !== "" ? `${a}${i}` : "";
}
function f_(a, i) {
  const r = a;
  switch (i) {
    case "name":
      return r.name || "—";
    case "type":
      return r.type || "—";
    case "breeder":
      return r.breeder || r.brand || "—";
    case "wantTemp":
      return r.want?.temp_c ? r.want.temp_c.join("–") : "—";
    case "wantRh":
      return r.want?.rh_pct ? r.want.rh_pct.join("–") : "—";
    case "height":
      return R1(r.height_cm, "cm") || (r.height_cm_min != null ? `${r.height_cm_min}${r.height_cm_max != null ? `–${r.height_cm_max}` : ""}cm` : "—");
    case "thc":
      return r.thc_range ? `${r.thc_range.join("–")}%` : r.thc_min != null ? `${r.thc_min}%` : "—";
    case "flowering":
      return r.flowering_days_min != null ? `${r.flowering_days_min}${r.flowering_days_max != null ? `–${r.flowering_days_max}` : ""}d` : "—";
    case "brand":
      return r.brand || "—";
    case "category":
      return r.category || "—";
    case "dose":
      return r.dose_ml_l != null ? `${r.dose_ml_l} ml/L` : "—";
    case "stage":
      return r.stage || "—";
    case "wattage":
      return r.wattage_w != null ? `${r.wattage_w} W` : "—";
    case "ppe":
      return r.efficacy_umol_j != null ? String(r.efficacy_umol_j) : "—";
    case "ppfd":
      return r.has_ppfd || r.ppfd_url ? "yes" : "—";
    case "composition":
      return typeof r.composition == "string" ? r.composition : r.composition && typeof r.composition == "object" && Object.entries(r.composition).map(([o, d]) => `${o} ${d}%`).join(" · ") || "—";
    default: {
      const o = r[i];
      return o != null && o !== "" ? String(o) : "—";
    }
  }
}
function A1(a) {
  switch (a) {
    case "strain":
      return [
        { key: "name", label: "Name" },
        { key: "type", label: "Type" },
        { key: "breeder", label: "Breeder" },
        { key: "wantTemp", label: "Temp °C" },
        { key: "wantRh", label: "RH %" },
        { key: "height", label: "Height" },
        { key: "flowering", label: "Flower" },
        { key: "thc", label: "THC" }
      ];
    case "nutrient":
      return [
        { key: "name", label: "Name" },
        { key: "brand", label: "Brand" },
        { key: "category", label: "Category" },
        { key: "dose", label: "Dose" },
        { key: "stage", label: "Stage" }
      ];
    case "light":
      return [
        { key: "name", label: "Name" },
        { key: "wattage", label: "W" },
        { key: "ppe", label: "PPE" },
        { key: "ppfd", label: "PPFD" }
      ];
    case "medium":
      return [
        { key: "name", label: "Name" },
        { key: "composition", label: "Composition" }
      ];
    default:
      return a;
  }
}
function z1() {
  const { state: a } = Ce(), { callService: i } = Ht(), r = ft(), [o, d] = x.useState("strain"), [h, f] = x.useState(null), [m, _] = x.useState([]), [b, v] = x.useState(""), g = x.useMemo(() => A1(o), [o]);
  x.useEffect(() => {
    hb(o, "", a, 8).then((w) => v(w.note));
  }, [o]);
  const j = (w) => {
    w && (o === "strain" ? i("input_text", "set_value", { entity_id: "input_text.dsc_build_strain", value: w.name }) : o === "medium" ? i("input_text", "set_value", {
      entity_id: "input_text.dsc_blend_component_1_name",
      value: w.name
    }) : o === "nutrient" ? i("input_text", "set_value", { entity_id: "input_text.dsc_nutrient_1_name", value: w.name }) : o === "light" && i("input_text", "set_value", { entity_id: "input_text.dsc_light_custom_name", value: w.name }), r("/grow/compose"));
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-research", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: [
      T1.map((w) => /* @__PURE__ */ s.jsx(
        "button",
        {
          type: "button",
          className: `dsc-chip${o === w.id ? " dsc-chip--ok" : ""}`,
          onClick: () => {
            d(w.id), f(null), _([]);
          },
          children: w.label
        },
        w.id
      )),
      /* @__PURE__ */ s.jsx(H, { label: b || "Catalog", tone: b.includes("local") ? "warn" : "ok" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(le, { className: "dsc-glass", title: "Browse", icon: "research", children: /* @__PURE__ */ s.jsx(fb, { kind: o, onPick: (w) => f(w) }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(le, { className: "dsc-glass", title: "Detail", icon: "roster", children: h ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx("h3", { style: { marginTop: 0 }, children: h.name }),
        /* @__PURE__ */ s.jsx("dl", { className: "dsc-detail-list", children: g.map((w) => /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("dt", { children: w.label }),
          /* @__PURE__ */ s.jsx("dd", { children: f_(h, w.key) })
        ] }, w.key)) }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", children: [
          /* @__PURE__ */ s.jsx(se, { primary: !0, onClick: () => j(h), children: "Use in Compose" }),
          /* @__PURE__ */ s.jsx(
            se,
            {
              onClick: () => _(
                (w) => w.some((S) => (S.id || S.name) === (h.id || h.name)) ? w : [...w, h].slice(0, 3)
              ),
              children: "Add compare"
            }
          )
        ] })
      ] }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Pick an item to see its details. Fields without data stay blank." }) }) }),
      m.length ? /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Compare", icon: "analytics", children: [
        /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "Field" }),
            m.map((w) => /* @__PURE__ */ s.jsx("th", { children: w.name }, w.id || w.name))
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: g.map((w) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: w.label }),
            m.map((S) => /* @__PURE__ */ s.jsx("td", { children: f_(S, w.key) }, S.id || S.name))
          ] }, w.key)) })
        ] }),
        /* @__PURE__ */ s.jsx(se, { onClick: () => _([]), children: "Clear compare" })
      ] }) }) : null
    ] })
  ] });
}
function O1({ pot: a }) {
  const { available: i, state: r, num: o } = Ce(), d = r(`sensor.dsc_pot${a}_expected_stage`, "—"), h = r(`sensor.dsc_pot${a}_days_since_sprout`, "—"), f = r(`sensor.dsc_pot${a}_need_summary`, "—"), m = r(`binary_sensor.dsc_pot${a}_untrusted`) === "on", _ = o(`sensor.dsc_pot${a}_dryback_pct`), b = r(`input_select.dsc_pot${a}_tent`, "unassigned"), v = b === "clone" ? r("light.dsc_hub_sf1000_dimmer") === "on" : r("binary_sensor.dsc_hub_4x8_window_open") === "on", g = b === "clone" || b === "main" ? v : !1, j = Number.isFinite(_) && _ > 55 ? "dryback stress" : f !== "—" && f !== "ok" ? "Need" : "calm";
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-plant-extra", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
      /* @__PURE__ */ s.jsx(H, { label: g ? "Awake" : "Asleep", tone: g ? "ok" : "muted" }),
      /* @__PURE__ */ s.jsx(H, { label: `Day ${h}`, tone: "muted" }),
      /* @__PURE__ */ s.jsx(H, { label: d === "—" ? "No stage Got" : d, tone: d === "—" ? "muted" : "ok" }),
      /* @__PURE__ */ s.jsx(
        H,
        {
          label: m ? "Need blocked (untrusted)" : j,
          tone: m ? "warn" : j === "calm" ? "ok" : "warn"
        }
      )
    ] }),
    i(`sensor.dsc_pot${a}_expected_stage`) ? null : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: "No cultivar mesh. Missing fields stay empty." })
  ] });
}
function D1(a) {
  if (!a || a === "—") return -1;
  const i = vb.findIndex((r) => a.indexOf(r) >= 0);
  return i >= 0 ? i : /flower/i.test(a) ? 6 : /veg/i.test(a) ? 3 : /seed/i.test(a) ? 1 : -1;
}
function hi({ compact: a }) {
  const { state: i, entity: r } = Ce(), o = aa.map((S) => ({
    seat: us(S, { state: i, entity: r }),
    oos: !Qt(S, i)
  })), h = o.filter((S) => !S.oos).map((S) => D1(S.seat.stage)).filter((S) => S >= 0), f = new Set(h).size > 1, m = h.length ? Math.max(...h) : -1, _ = i("binary_sensor.dsc_hub_4x8_window_open") === "on", b = i("binary_sensor.dsc_hub_2x4_window_open") === "on", v = i("binary_sensor.dsc_hub_light_catchup_active") === "on", g = i("binary_sensor.dsc_clone_dark_period_violation") === "on", j = i("sensor.dsc_expected_light_hours", "—"), w = i("sensor.dsc_clone_expected_light_hours", "—");
  return /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Crop scheduler", icon: "roster", children: [
    /* @__PURE__ */ s.jsx("div", { className: "dsc-stage-track", "aria-label": "Stage track", children: vb.map((S, N) => /* @__PURE__ */ s.jsx(
      "span",
      {
        className: `dsc-stage-pill${N === m ? " is-on" : ""}${N === m + 1 ? " is-next" : ""}`,
        children: S.replace("Late (Push) Vegetative", "Push Veg").replace("Final 48-72h Flowering", "Finish").replace("Early Vegetative", "Early Veg").replace("Early Flowering", "Early Flwr").replace("Late Flowering", "Late Flwr")
      },
      S
    )) }),
    f ? /* @__PURE__ */ s.jsx(H, { label: "Mixed stages in tents", tone: "warn" }) : null,
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { margin: "8px 0" }, children: [
      /* @__PURE__ */ s.jsx(H, { label: `4×8 ${_ ? "window open" : "dark"} · Want ${j}h`, tone: _ ? "ok" : "muted" }),
      /* @__PURE__ */ s.jsx(H, { label: `2×4 ${b ? "window open" : "dark"} · Want ${w}h`, tone: b ? "ok" : "muted" }),
      v ? /* @__PURE__ */ s.jsx(H, { label: "Catch-up", tone: "warn" }) : null,
      g ? /* @__PURE__ */ s.jsx(H, { label: "2×4 dark violation", tone: "bad", pulse: !0 }) : null
    ] }),
    /* @__PURE__ */ s.jsx("div", { className: `dsc-scheduler-lanes${a ? " is-compact" : ""}`, children: o.map(({ seat: S, oos: N }) => {
      const C = Number(S.days), E = Number.isFinite(C) ? Math.max(1, Math.ceil(C / 7)) : null;
      return /* @__PURE__ */ s.jsxs(
        "button",
        {
          type: "button",
          className: `dsc-scheduler-lane${N ? " is-oos" : ""}`,
          disabled: N,
          onClick: () => window.dispatchEvent(new CustomEvent("dsc-dash-select-pot", { detail: { pot: S.pot } })),
          children: [
            /* @__PURE__ */ s.jsx(zn, { spec: $a(S.pot, i, r), size: 16 }),
            /* @__PURE__ */ s.jsxs("strong", { children: [
              "P",
              S.pot
            ] }),
            /* @__PURE__ */ s.jsx("span", { children: N ? "Out of service" : S.plantName }),
            /* @__PURE__ */ s.jsx(H, { label: uc(S.tent), tone: N || S.tent === "unassigned" ? "muted" : "ok" }),
            /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", children: N ? "—" : `W${E ?? "—"} · ${Number.isFinite(C) ? `${C}d` : "—"} · ${S.stage} · Need ${S.need}` })
          ]
        },
        S.pot
      );
    }) })
  ] });
}
function mc({
  pot: a,
  onSelectPot: i
}) {
  const { hass: r, state: o, entity: d, available: h, tick: f, num: m } = Ce(), { callService: _ } = Ht(), b = ft(), v = us(a, { state: o, entity: d }), [g, j] = x.useState(v.plantName === "—" ? "" : v.plantName), [w, S] = x.useState(v.sprout === "—" ? "" : v.sprout), [N, C] = x.useState(v.growthStage === "—" ? "" : v.growthStage), [E, z] = x.useState(v.notes === "—" ? "" : v.notes), [U, Q] = x.useState(null), [X, F] = x.useState(null);
  x.useEffect(() => {
    j(v.plantName === "—" ? "" : v.plantName), S(v.sprout === "—" ? "" : v.sprout), C(v.growthStage === "—" ? "" : v.growthStage), z(v.notes === "—" ? "" : v.notes), Q(null);
  }, [a]);
  const Z = gn(a, "moisture", o), I = gn(a, "ec", o), ae = gn(a, "ph", o), ie = `sensor.dsc_pot${a}_dryback_pct`, de = _e(Z), re = _e(ie), ce = _e(I), oe = _e(ae), M = xe(Z, { hours: 6, maxPoints: 72 }), R = xe(I, { hours: 6, maxPoints: 72 }), D = m(`input_number.dsc_pot${a}_learned_ec_per_moisture`), q = h(`input_number.dsc_pot${a}_learned_ec_per_moisture`) && Number.isFinite(D) && D !== 0 ? D : NaN, P = h(`sensor.dsc_pot${a}_want_moisture_min`) ? m(`sensor.dsc_pot${a}_want_moisture_min`) : m(`number.dsc_pot${a}_want_moisture_min`), W = h(`sensor.dsc_pot${a}_want_moisture_max`) ? m(`sensor.dsc_pot${a}_want_moisture_max`) : m(`number.dsc_pot${a}_want_moisture_max`), k = m(`sensor.dsc_pot${a}_want_ec_min`), G = m(`sensor.dsc_pot${a}_want_ec_max`), ee = m(`sensor.dsc_pot${a}_want_ph_min`), ne = m(`sensor.dsc_pot${a}_want_ph_max`), me = Number.isFinite(P) && Number.isFinite(W) && (h(`sensor.dsc_pot${a}_want_moisture_min`) || h(`number.dsc_pot${a}_want_moisture_min`)), fe = Number.isFinite(k) && Number.isFinite(G), ge = Number.isFinite(ee) && Number.isFinite(ne), $e = !v.strainDisplay || v.strainDisplay === "—" || /generic/i.test(v.strainDisplay), ye = async (te) => {
    Q(null);
    try {
      await _("input_select", "select_option", {
        entity_id: `input_select.dsc_pot${a}_tent`,
        option: te
      }), window.setTimeout(() => {
        (r?.states?.[`input_select.dsc_pot${a}_tent`]?.state || "") !== te && Q("Tent change did not stick — the hub rejected it. Try again.");
      }, 400);
    } catch {
      Q("Tent change did not stick — the hub rejected it. Try again.");
    }
  }, nt = () => {
    h(`text.dsc_pot${a}_plant_name`) && _("text", "set_value", {
      entity_id: `text.dsc_pot${a}_plant_name`,
      value: g
    });
  }, mt = () => {
    const te = `datetime.dsc_pot${a}_sprout_date`;
    if (!h(te) || !w) return;
    const Le = w.length === 10 ? `${w}T00:00:00` : w;
    _("datetime", "set_value", { entity_id: te, datetime: Le });
  }, je = () => {
    if (v.rosterSlot == null) return;
    const te = `input_text.dsc_plant_roster_${v.rosterSlot}_notes`;
    !h(te) && d(te), _("input_text", "set_value", { entity_id: te, value: E });
  }, at = d(`select.dsc_pot${a}_growth_stage`)?.attributes?.options || [];
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-seat-panel", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 14 }, children: [
      xd(o).map((te) => /* @__PURE__ */ s.jsxs(
        "button",
        {
          type: "button",
          className: `dsc-chip${te === a ? " dsc-chip--ok" : ""}`,
          onClick: () => i?.(te),
          children: [
            /* @__PURE__ */ s.jsx(zn, { spec: $a(te, o, d), size: 16 }),
            " P",
            te
          ]
        },
        te
      )),
      /* @__PURE__ */ s.jsx(H, { label: uc(v.tent), tone: v.tent === "unassigned" ? "muted" : "ok" }),
      v.rosterSlot != null ? /* @__PURE__ */ s.jsx(H, { label: `Roster #${v.rosterSlot}`, tone: "muted" }) : /* @__PURE__ */ s.jsx(H, { label: "Not on roster", tone: "warn" }),
      de.stale ? /* @__PURE__ */ s.jsx(H, { label: "Reading held", tone: "warn" }) : null
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-seat-layout", children: [
      /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass dsc-glass--glow", title: "Medium", children: [
        /* @__PURE__ */ s.jsx(V0, { layers: v.layers, spec: $a(a, o, d) }),
        /* @__PURE__ */ s.jsx(O1, { pot: a }),
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 10, fontSize: 12 }, children: v.blend || "No blend recorded yet — it appears here after you commit the plant." })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", style: { gap: 14 }, children: [
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(le, { className: "dsc-glass", title: "Identity", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-seat-editors", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "Nickname",
            /* @__PURE__ */ s.jsx(
              "input",
              {
                value: g,
                onChange: (te) => j(te.target.value),
                onBlur: nt,
                disabled: !h(`text.dsc_pot${a}_plant_name`)
              }
            )
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "Sprout date",
            /* @__PURE__ */ s.jsx(
              "input",
              {
                type: "date",
                value: w.slice(0, 10),
                onChange: (te) => S(te.target.value),
                onBlur: mt,
                disabled: !h(`datetime.dsc_pot${a}_sprout_date`)
              }
            )
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "Growth stage",
            /* @__PURE__ */ s.jsxs(
              "select",
              {
                value: N,
                onChange: (te) => {
                  const Le = te.target.value;
                  if (C(Le), !Le) return;
                  const We = `select.dsc_pot${a}_growth_stage`;
                  h(We) && _("select", "select_option", { entity_id: We, option: Le });
                },
                disabled: !h(`select.dsc_pot${a}_growth_stage`),
                children: [
                  /* @__PURE__ */ s.jsx("option", { value: "", children: "—" }),
                  at.map((te) => /* @__PURE__ */ s.jsx("option", { value: te, children: te }, te))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
            /* @__PURE__ */ s.jsx(H, { label: `Day ${v.days}`, tone: "ok" }),
            /* @__PURE__ */ s.jsx(H, { label: v.stage, tone: "muted" }),
            /* @__PURE__ */ s.jsx(H, { label: v.strainDisplay, tone: "muted" })
          ] }),
          /* @__PURE__ */ s.jsx(
            oc,
            {
              items: [
                {
                  id: "compose",
                  label: "Open Compose (strain/catalog)",
                  onSelect: () => b("/grow/compose")
                },
                {
                  id: "root",
                  label: "Root zone",
                  onSelect: () => b("/live/root")
                },
                {
                  id: "twin",
                  label: "Open Twin",
                  onSelect: () => b("/live/twin")
                }
              ]
            }
          )
        ] }) }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Want · Got · Need", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
            /* @__PURE__ */ s.jsx(
              H,
              {
                label: `Got M ${de.stale ? `${Number.isFinite(de.value) ? de.value.toFixed(0) : "—"}*` : v.moisture}`,
                tone: de.stale ? "warn" : "ok"
              }
            ),
            /* @__PURE__ */ s.jsx(H, { label: `EC ${v.ec}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(H, { label: `pH ${v.ph}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(
              H,
              {
                label: v.need,
                tone: v.need !== "—" && v.need !== "OK" ? "warn" : "ok"
              }
            )
          ] }),
          me && !$e ? /* @__PURE__ */ s.jsx(
            Cb,
            {
              rows: [
                {
                  label: "Moisture",
                  got: de.value,
                  stale: de.stale,
                  wantMin: P,
                  wantMax: W,
                  unit: "%"
                },
                {
                  label: "EC",
                  got: ce.value,
                  stale: ce.stale,
                  wantMin: fe ? k : void 0,
                  wantMax: fe ? G : void 0
                },
                {
                  label: "pH",
                  got: oe.value,
                  stale: oe.stale,
                  wantMin: ge ? ee : void 0,
                  wantMax: ge ? ne : void 0
                }
              ]
            }
          ) : /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", style: { margin: "8px 0 0" }, children: [
            /* @__PURE__ */ s.jsx(H, { label: "No target bands", tone: "warn" }),
            " ",
            $e ? "No strain selected — target bands are unknown." : "Custom targets not set — showing measurements only."
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "dsc-kpi-sub", children: "Need compares the catalog targets against what was measured." })
        ] }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(le, { className: "dsc-glass", title: "Dryback", children: /* @__PURE__ */ s.jsx(
          Xe,
          {
            label: "Dryback",
            value: re.value,
            min: 0,
            max: 100,
            unit: "%",
            stale: re.stale,
            band: { min: 0, max: 45 },
            onClick: () => F({ id: ie, label: "Dryback", unit: "%" })
          }
        ) }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Got history", children: [
          /* @__PURE__ */ s.jsx(
            jn,
            {
              live: !0,
              lastSyncAt: Math.max(M.lastSyncAt ?? 0, R.lastSyncAt ?? 0) || void 0,
              series: [
                {
                  id: "m",
                  label: "Moisture",
                  series: M.series,
                  color: "var(--dsc-blue)",
                  axis: "left",
                  unit: "%"
                },
                {
                  id: "ec",
                  label: "EC",
                  series: R.series,
                  color: "var(--dsc-amber)",
                  axis: "right",
                  unit: ""
                }
              ]
            }
          ),
          /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: Number.isFinite(q) ? `Learned nutrient use: ${q.toFixed(3)} EC per moisture point, from this pot's own history.` : "EC over time shown — not enough history yet to learn this pot's nutrient use." }),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginTop: 8 }, children: [
            /* @__PURE__ */ s.jsx(se, { onClick: () => F({ id: Z, label: "Moisture", unit: "%" }), children: "Moisture hist" }),
            /* @__PURE__ */ s.jsx(se, { onClick: () => F({ id: I, label: "EC", unit: "" }), children: "EC hist" }),
            /* @__PURE__ */ s.jsx(se, { onClick: () => F({ id: ae, label: "pH", unit: "" }), children: "pH hist" })
          ] })
        ] }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Nutrition", children: [
          /* @__PURE__ */ s.jsx("p", { style: { margin: "0 0 6px" }, children: v.recipe || "No recipe recorded for this plant — catalog doses shown only." }),
          /* @__PURE__ */ s.jsxs("label", { className: "dsc-seat-editors", children: [
            "Roster notes",
            /* @__PURE__ */ s.jsx(
              "textarea",
              {
                rows: 3,
                value: E,
                onChange: (te) => z(te.target.value),
                onBlur: je,
                disabled: v.rosterSlot == null
              }
            )
          ] }),
          /* @__PURE__ */ s.jsx("div", { style: { marginTop: 10 }, children: /* @__PURE__ */ s.jsx(ii, { to: "/grow/compose", children: /* @__PURE__ */ s.jsx(se, { teal: !0, children: "Mix in Compose" }) }) })
        ] }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Live Got chips", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
            /* @__PURE__ */ s.jsx(H, { label: `M ${v.moisture}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(H, { label: `T ${v.soilTemp}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(H, { label: `EC ${v.ec}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(H, { label: `pH ${v.ph}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(H, { label: `N ${v.n}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(H, { label: `P ${v.p}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(H, { label: `K ${v.k}`, tone: "muted" })
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: "NPK = trend indicators. Unavailable stays —. Held shows last good on blip." })
        ] }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Apply to tent", children: [
          /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "Digital-twin placement. Moves the plant on Twin; does not rewrite climate Want." }),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-seat-actions", children: [
            /* @__PURE__ */ s.jsx(se, { primary: v.tent === "clone", onClick: () => void ye("clone"), children: "2×4" }),
            /* @__PURE__ */ s.jsx(se, { primary: v.tent === "main", onClick: () => void ye("main"), children: "4×8" }),
            /* @__PURE__ */ s.jsx(se, { onClick: () => void ye("unassigned"), children: "Unassigned" }),
            /* @__PURE__ */ s.jsx(ii, { to: "/live/twin", children: /* @__PURE__ */ s.jsx(se, { children: "Open Twin" }) })
          ] }),
          U ? /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
            /* @__PURE__ */ s.jsx(H, { label: "Tent apply failed", tone: "bad" }),
            " ",
            U
          ] }) : null
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ s.jsx(
      b1,
      {
        open: X != null,
        onClose: () => F(null),
        entityId: X?.id ?? null,
        label: X?.label ?? "",
        unit: X?.unit
      }
    )
  ] });
}
function H1() {
  const a = ft();
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Nt,
      {
        icon: "compose",
        title: "Compose",
        subtitle: "Build soil blend, roster commit, and Want handoff.",
        primaryAction: /* @__PURE__ */ s.jsx(se, { teal: !0, onClick: () => a("/grow/roster"), children: "Open Roster / Seat" }),
        actions: /* @__PURE__ */ s.jsx(se, { primary: !0, onClick: () => a("/grow/research"), children: "Browse Catalog" })
      }
    ),
    /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Catalog traits (height, flowering, chemistry) appear when the catalog has real data — empty fields stay empty. After committing, open Roster to assign a seat." }),
    /* @__PURE__ */ s.jsx(M1, {})
  ] });
}
function L1() {
  const a = ft();
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Nt,
      {
        icon: "research",
        title: "Research",
        subtitle: "Live CannaLib catalog — strains, mediums, nutrients, and lights.",
        actions: /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(se, { primary: !0, onClick: () => a("/grow/compose"), children: "Use in Compose" }),
          /* @__PURE__ */ s.jsx(se, { teal: !0, onClick: () => a("/grow/roster"), children: "Open Seat" })
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Height, flowering, and chemistry chips appear only when the catalog has real data — gaps are shown as gaps. Use in Compose to draft a plant, or Open Seat to work with a plant already on the roster." }),
    /* @__PURE__ */ s.jsx(z1, {})
  ] });
}
function $1() {
  const { entity: a, state: i, tick: r } = Ce(), [o, d] = rc(), h = Y0(a), f = Number(o.get("pot") || 0), m = f >= 1 && f <= 4 && Qt(f, i) ? f : null, _ = (v) => {
    if (!Qt(v, i)) return;
    const g = new URLSearchParams(o);
    g.set("pot", String(v)), d(g, { replace: !0 });
  }, b = () => {
    const v = new URLSearchParams(o);
    v.delete("pot"), d(v, { replace: !0 });
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Nt,
      {
        icon: "roster",
        title: "Roster",
        subtitle: "Seats — open a row for Plant Seat drawer. Nutrient mix lives in Compose.",
        primaryAction: /* @__PURE__ */ s.jsx(ii, { to: "/grow/compose", children: /* @__PURE__ */ s.jsx(se, { primary: !0, children: "Use in Compose" }) })
      }
    ),
    /* @__PURE__ */ s.jsx("div", { style: { marginBottom: 14 }, children: /* @__PURE__ */ s.jsx(hi, { compact: !0 }) }),
    /* @__PURE__ */ s.jsx(le, { className: "dsc-glass", title: "Roster", icon: "roster", children: h.length ? /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", children: [
      /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
        /* @__PURE__ */ s.jsx("th", { children: "Slot" }),
        /* @__PURE__ */ s.jsx("th", { children: "Name" }),
        /* @__PURE__ */ s.jsx("th", { children: "Strain" }),
        /* @__PURE__ */ s.jsx("th", { children: "Status" }),
        /* @__PURE__ */ s.jsx("th", { children: "Pot" }),
        /* @__PURE__ */ s.jsx("th", { children: "Need" }),
        /* @__PURE__ */ s.jsx("th", { children: "Tent" })
      ] }) }),
      /* @__PURE__ */ s.jsx("tbody", { children: h.map((v) => {
        const g = Number(v.pot), j = g >= 1 && g <= 4, w = j && Qt(g, i), S = j ? Pr(i, g) : "unassigned", N = uc(S !== "unassigned" ? S : cb(v.tent)), C = j ? i(`sensor.dsc_pot${g}_need_summary`, "—") : "—", E = j ? $a(g, i, a) : null;
        return /* @__PURE__ */ s.jsxs(
          "tr",
          {
            onClick: () => {
              w && _(g);
            },
            style: w ? { cursor: "pointer" } : void 0,
            children: [
              /* @__PURE__ */ s.jsxs("td", { children: [
                "#",
                v.slot
              ] }),
              /* @__PURE__ */ s.jsx("td", { children: v.nickname || "—" }),
              /* @__PURE__ */ s.jsx("td", { children: v.strain || "—" }),
              /* @__PURE__ */ s.jsx("td", { children: v.status || "—" }),
              /* @__PURE__ */ s.jsx("td", { children: j ? /* @__PURE__ */ s.jsxs("span", { className: "dsc-chip-row", children: [
                E ? /* @__PURE__ */ s.jsx(zn, { spec: E, size: 22 }) : null,
                "P",
                g,
                w ? null : /* @__PURE__ */ s.jsx(H, { label: "Out of service", tone: "warn" })
              ] }) : "—" }),
              /* @__PURE__ */ s.jsx("td", { children: C }),
              /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx(H, { label: N, tone: "muted" }) })
            ]
          },
          v.slot
        );
      }) })
    ] }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "No plants in roster yet. Commit from Compose, then assign a pot." }) }),
    /* @__PURE__ */ s.jsx(
      os,
      {
        open: m != null,
        onClose: b,
        title: m != null ? `Plant seat · POT${m}` : "Plant seat",
        children: m != null ? /* @__PURE__ */ s.jsx(mc, { pot: m, onSelectPot: _ }) : null
      }
    )
  ] });
}
function U1() {
  const [a, i] = x.useState(null), r = ft(), o = At();
  x.useEffect(() => {
    const f = (m) => {
      const _ = m.detail, b = Number(_?.pot);
      b >= 1 && b <= 4 && i(b);
    };
    return window.addEventListener("dsc-dash-select-pot", f), () => window.removeEventListener("dsc-dash-select-pot", f);
  }, []);
  const d = x.useCallback(() => i(null), []);
  return /* @__PURE__ */ s.jsx(
    Rt,
    {
      open: a != null,
      onDismiss: d,
      title: a != null ? `Plant seat · POT${a}` : "Plant seat",
      help: null,
      children: a != null ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx(mc, { pot: a, onSelectPot: i }),
        o.pathname !== "/live/root" ? /* @__PURE__ */ s.jsx("div", { className: "dsc-row-actions", style: { marginTop: 12 }, children: /* @__PURE__ */ s.jsx(
          se,
          {
            teal: !0,
            onClick: () => {
              const f = a;
              d(), r(`/live/root?pot=${f}`);
            },
            children: "Open Root"
          }
        ) }) : null
      ] }) : null
    }
  );
}
function dt(a, i, r, o, d, h) {
  const f = { id: a, label: i, series: r.series, color: o, unit: d, ...h };
  return r.ghost.length <= 1 ? [f] : [
    f,
    { id: `${a}-ghost`, label: `${i} prior`, series: r.ghost, color: o, unit: d, ghost: !0 }
  ];
}
const Rb = x.createContext(null), Ma = {
  main: "#f97316",
  clone: "#22c55e",
  room: "#94a3b8"
};
function B1({ target: a, onClose: i }) {
  const { num: r } = Ce(), o = a?.kind.startsWith("pot") ? 48 : 24, { hours: d, setHours: h, maxPoints: f } = al(o);
  x.useEffect(() => {
    a && h(o);
  }, [a, o, h]);
  const m = Math.min(Math.max(f, 96), 288), _ = xe("sensor.dsc_hub_tent_temperature", { hours: d, maxPoints: m, withGhost: !0 }), b = xe("sensor.dsc_hub_clone_temperature", { hours: d, maxPoints: m, withGhost: !0 }), v = xe("sensor.dsc_hub_room_temperature", { hours: d, maxPoints: m, withGhost: !0 }), g = xe("sensor.dsc_hub_tent_humidity", { hours: d, maxPoints: m, withGhost: !0 }), j = xe("sensor.dsc_hub_clone_humidity", { hours: d, maxPoints: m, withGhost: !0 }), w = xe("sensor.dsc_hub_room_humidity", { hours: d, maxPoints: m, withGhost: !0 }), S = xe("sensor.dsc_hub_vpd_kpa", { hours: d, maxPoints: m, withGhost: !0 }), N = xe("sensor.dsc_hub_clone_vpd_kpa", { hours: d, maxPoints: m, withGhost: !0 }), C = xe("sensor.dsc_coldest_root_zone_temp", { hours: d, maxPoints: m, withGhost: !0 }), E = xe("sensor.dsc_pot1_soil_moisture", { hours: d, maxPoints: m, withGhost: !0 }), z = xe("sensor.dsc_pot2_soil_moisture", { hours: d, maxPoints: m, withGhost: !0 }), U = xe("sensor.dsc_pot3_soil_moisture", { hours: d, maxPoints: m, withGhost: !0 }), Q = xe("sensor.dsc_pot4_soil_moisture", { hours: d, maxPoints: m, withGhost: !0 }), X = xe("sensor.dsc_pot1_soil_temperature", { hours: d, maxPoints: m, withGhost: !0 }), F = xe("sensor.dsc_pot2_soil_temperature", { hours: d, maxPoints: m, withGhost: !0 }), Z = xe("sensor.dsc_pot3_soil_temperature", { hours: d, maxPoints: m, withGhost: !0 }), I = xe("sensor.dsc_pot4_soil_temperature", { hours: d, maxPoints: m, withGhost: !0 }), ae = r("number.dsc_hub_target_temp", 25), ie = r("number.dsc_hub_clone_target_temp", 24), de = r("number.dsc_hub_rh_target_min", 45), re = r("number.dsc_hub_rh_target_max", 70);
  r("number.dsc_hub_clone_rh_min", 55), r("number.dsc_hub_clone_rh_max", 75);
  const ce = r("number.dsc_hub_vpd_target_min", 0.8), oe = r("number.dsc_hub_vpd_target_max", 1.4), M = r("number.dsc_hub_clone_vpd_min", 0.6), R = r("number.dsc_hub_clone_vpd_max", 1.2), D = r("number.dsc_hub_mat_root_zone_low", 20), q = r("number.dsc_hub_mat_root_zone_high", 24), P = x.useMemo(() => {
    if (!a) return null;
    switch (a.kind) {
      case "temp":
        return {
          unit: "°C",
          height: 380,
          series: [
            ...dt("mt", "4×8 Tent", _, Ma.main, "°C"),
            ...dt("ct", "2×4 Clone", b, Ma.clone, "°C"),
            ...dt("rt", "Room", v, Ma.room, "°C")
          ],
          targets: [
            { value: ae, color: "#f9731688", label: "4×8 target" },
            { value: ie, color: "#22c55e88", label: "2×4 target" }
          ]
        };
      case "rh":
        return {
          unit: "%",
          height: 380,
          yDomain: { left: { min: 0, max: 100 } },
          series: [
            ...dt("mrh", "4×8 Tent", g, "#3b82f6", "%"),
            ...dt("crh", "2×4 Clone", j, Ma.clone, "%"),
            ...dt("rrh", "Room", w, Ma.room, "%")
          ],
          targets: [{ min: de, max: re, color: "#22c55e88" }]
        };
      case "vpd":
        return {
          unit: "kPa",
          height: 380,
          series: [
            ...dt("mv", "4×8 Tent", S, Ma.main, "kPa"),
            ...dt("cv", "2×4 Clone", N, Ma.clone, "kPa")
          ],
          targets: [
            { min: ce, max: oe, color: "#f9731688" },
            { min: M, max: R, color: "#22c55e88" }
          ]
        };
      case "root":
        return {
          unit: "°C",
          height: 380,
          series: [...dt("root", "Root coldest", C, "#fbbf24", "°C")],
          targets: [{ min: D, max: q, color: "#22c55e88" }]
        };
      default: {
        const G = Number(a.kind.replace("pot", "")), ee = [E, z, U, Q][G - 1], ne = [X, F, Z, I][G - 1];
        return {
          unit: "%",
          height: 320,
          yDomain: { left: { min: 0, max: 100 }, right: { min: 10, max: 35 } },
          series: [
            ...dt(`pm${G}`, "Moisture", ee, "#3b82f6", "%", { axis: "left" }),
            ...dt(`pt${G}`, "Soil °C", ne, Ma.main, "°C", { axis: "right" })
          ],
          targets: [{ value: 30, color: "#ef444488", label: "dry 30%" }]
        };
      }
    }
  }, [
    a,
    _,
    b,
    v,
    g,
    j,
    w,
    S,
    N,
    C,
    E,
    z,
    U,
    Q,
    X,
    F,
    Z,
    I,
    ae,
    ie,
    de,
    re,
    ce,
    oe,
    M,
    R,
    D,
    q
  ]), W = P ? P.series.every((G) => G.series.length < 2) : !0, k = P && Math.max(...P.series.map((G) => G.series.at(-1)?.t ?? 0), 0) || void 0;
  return /* @__PURE__ */ s.jsxs(os, { open: !!a, onClose: i, title: a?.title ?? "History", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ s.jsx(ll, { hours: d, setHours: h, extras: sl }),
      W ? /* @__PURE__ */ s.jsx(H, { label: "Thin recorder", tone: "warn" }) : null
    ] }),
    P ? /* @__PURE__ */ s.jsx(
      jn,
      {
        live: !0,
        height: P.height,
        unit: P.unit,
        lastSyncAt: k,
        series: P.series,
        targets: P.targets,
        yDomain: P.yDomain
      }
    ) : null,
    /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 10, fontSize: 12 }, children: "Multi-zone history — same series as HA Home gauge popups." })
  ] });
}
function F1({ children: a }) {
  const [i, r] = x.useState(null), o = x.useCallback(() => r(null), []), d = x.useCallback((f) => r(f), []), h = x.useMemo(() => ({ open: d, close: o }), [d, o]);
  return /* @__PURE__ */ s.jsxs(Rb.Provider, { value: h, children: [
    a,
    /* @__PURE__ */ s.jsx(B1, { target: i, onClose: o })
  ] });
}
function Ab() {
  const a = x.useContext(Rb);
  return a || { open: () => {
  }, close: () => {
  } };
}
const zb = {
  temp: "Temperature — 24h",
  rh: "Humidity — 24h",
  vpd: "VPD — 24h",
  root: "Soil temperature — 24h",
  pot1: "POT1 — moisture & soil temp",
  pot2: "POT2 — moisture & soil temp",
  pot3: "POT3 — moisture & soil temp",
  pot4: "POT4 — moisture & soil temp"
}, Ob = x.createContext(null);
function G1(a) {
  return a === "clone" || a === "compare" || a === "room" || a === "main" ? a : "main";
}
function V1({ children: a }) {
  const [i, r] = rc(), o = G1(i.get("tent") ?? i.get("zone")), d = x.useCallback(
    (f) => {
      const m = new URLSearchParams(i);
      m.set("tent", f), m.delete("zone"), r(m, { replace: !0 });
    },
    [i, r]
  ), h = x.useMemo(() => ({ focus: o, setFocus: d }), [o, d]);
  return /* @__PURE__ */ s.jsx(Ob.Provider, { value: h, children: a });
}
function Nd() {
  const a = x.useContext(Ob);
  return a || {
    focus: "main",
    setFocus: () => {
    }
  };
}
function Cd() {
  const { online: a, uptime: i, heartbeat: r } = J_(), o = kt(), { state: d, available: h } = Ce(), f = h("sensor.dsc_hub_api_down_age") ? d("sensor.dsc_hub_api_down_age", "—") : i != null ? String(i) : "—", m = h("sensor.dsc_hub_link_recovery_bounces") ? d("sensor.dsc_hub_link_recovery_bounces", "—") : "—", _ = h("sensor.dsc_hub_rf_status") ? d("sensor.dsc_hub_rf_status", "—") : "—", b = h("sensor.dsc_hub_ha_handshake_age") ? d("sensor.dsc_hub_ha_handshake_age", "—") : r != null ? String(r) : "—";
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
    /* @__PURE__ */ s.jsx(
      H,
      {
        icon: a ? "ok" : "alert",
        label: a ? "HUB LINK" : "HUB LINK DOWN",
        tone: a ? "ok" : "bad"
      }
    ),
    /* @__PURE__ */ s.jsx(H, { label: `Age ${f}`, tone: "muted" }),
    /* @__PURE__ */ s.jsx(H, { label: `Bounces ${m}`, tone: "muted" }),
    /* @__PURE__ */ s.jsx(H, { label: `RF ${_}`, tone: "muted" }),
    /* @__PURE__ */ s.jsx(H, { label: `Beat ${b}`, tone: "muted" }),
    o.surface ? /* @__PURE__ */ s.jsx(H, { label: o.surface, tone: "muted" }) : null
  ] });
}
const q1 = "_allocated";
function ht(a, i, r) {
  const o = r.num(i);
  return r.forceKind === "mass-balance" ? {
    value: r.num(a, o),
    kind: "mass-balance",
    entityId: a,
    nameplate: Number.isFinite(o) ? o : void 0
  } : r.available(a) && Number.isFinite(r.num(a)) ? {
    value: r.num(a),
    kind: a.endsWith(q1) ? "allocated" : "nameplate",
    entityId: a,
    nameplate: Number.isFinite(o) ? o : void 0
  } : {
    value: o,
    kind: "nameplate",
    entityId: i,
    nameplate: Number.isFinite(o) ? o : void 0
  };
}
function pc({ readings: a }) {
  const i = a.some((o) => o.kind === "nameplate"), r = a.some((o) => o.kind === "allocated" || o.kind === "mass-balance");
  return i && !r ? /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { margin: "0 0 8px" }, children: "CFM guessed from fan % × nameplate — run Learning to measure." }) : i && r ? /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { margin: "0 0 8px" }, children: "Mixed CFM trust — some ducts from Learning, others still nameplate. Run Learning on the dashed paths." }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { margin: "0 0 8px" }, children: "CFM from Learning (anemometer)." });
}
const Y1 = [
  {
    id: "hub",
    label: "Hub",
    linkEntity: "binary_sensor.dsc_hub_link",
    firmwareEntity: "sensor.dsc_hub_firmware_version"
  },
  {
    id: "heater",
    label: "Heater",
    demandEntity: "switch.dsc_hub_heater_demand",
    relayEntity: "switch.dsc_heater_main_relay",
    runtimeToday: "sensor.dsc_heater_runtime_today",
    cyclesToday: "sensor.dsc_heater_cycles_today",
    firmwareEntity: "sensor.dsc_heater_firmware_version"
  },
  {
    id: "heatmat",
    label: "Heat mat",
    demandEntity: "switch.dsc_hub_grow_mat_demand",
    relayEntity: "switch.dsc_heatmat_main_relay",
    runtimeToday: "sensor.dsc_growmat_runtime_today",
    firmwareEntity: "sensor.dsc_heatmat_firmware_version"
  },
  {
    id: "ac",
    label: "AC",
    inServiceEntity: "input_boolean.dsc_ac_in_service",
    plannedWhenOff: !0,
    demandEntity: "switch.dsc_hub_ac_demand",
    relayEntity: "switch.dsc_ac_main_relay",
    runtimeToday: "sensor.dsc_ac_runtime_today"
  },
  {
    id: "humidifier",
    label: "Humidifier",
    demandEntity: "switch.dsc_hub_humidifier_demand",
    relayEntity: "switch.dsc_humidifier_main_relay",
    runtimeToday: "sensor.dsc_humidifier_runtime_today",
    cyclesToday: "sensor.dsc_humidifier_cycles_today",
    firmwareEntity: "sensor.dsc_humidifier_firmware_version"
  },
  {
    id: "dehumidifier",
    label: "Dehumidifier",
    demandEntity: "switch.dsc_hub_dehumidifier_demand",
    relayEntity: "switch.dsc_de_humidifier_main_relay",
    runtimeToday: "sensor.dsc_dehumidifier_runtime_today",
    firmwareEntity: "sensor.dsc_de_humidifier_firmware_version"
  },
  {
    id: "mister",
    label: "Clone mister",
    inServiceEntity: "input_boolean.dsc_clone_humidifier_in_service",
    plannedWhenOff: !0,
    demandEntity: "switch.dsc_hub_clone_humidifier_demand",
    relayEntity: "switch.dsc_clone_humidifier_main_relay"
  },
  ...aa.map(
    (a) => ({
      id: `pot${a}`,
      label: `Pot ${a}`,
      inServiceEntity: `input_boolean.dsc_pot${a}_in_service`,
      plannedWhenOff: a === 3,
      firmwareEntity: `sensor.dsc_pot${a}_firmware_version`
    })
  ),
  {
    id: "tank",
    label: "Tank",
    inServiceEntity: "input_boolean.dsc_tank_in_service",
    plannedWhenOff: !0
  }
];
function X1(a) {
  return a.linkEntity || a.relayEntity || a.demandEntity || a.inServiceEntity || a.firmwareEntity || "";
}
function Ed(a) {
  return Y1.map((i) => Q1(i, a));
}
function Q1(a, i) {
  const r = X1(a), o = i.hub.online;
  if (a.id === "hub")
    return {
      id: a.id,
      label: a.label,
      status: i.hub.online ? "ok" : "dark",
      entityId: "binary_sensor.dsc_hub_link",
      firmwareEntity: a.firmwareEntity
    };
  if (a.inServiceEntity && !(a.id.startsWith("pot") && a.id.length === 4, zr(i, a.id)))
    return {
      id: a.id,
      label: a.label,
      status: "oos",
      subtitle: a.plannedWhenOff ? "Not installed" : "Out of service",
      entityId: a.inServiceEntity,
      inServiceEntity: a.inServiceEntity,
      plannedOos: a.plannedWhenOff,
      runtimeToday: a.runtimeToday,
      cyclesToday: a.cyclesToday,
      demandEntity: a.demandEntity,
      firmwareEntity: a.firmwareEntity
    };
  const d = i.sonoffs[a.id], h = i.pots[a.id], f = d?.online ?? h?.online ?? !1, m = a.inServiceEntity ? zr(i, a.id) : !0;
  if (a.id.startsWith("pot"))
    return m ? f ? {
      id: a.id,
      label: a.label,
      status: "idle",
      subtitle: "Idle",
      entityId: a.firmwareEntity ?? r,
      inServiceEntity: a.inServiceEntity,
      firmwareEntity: a.firmwareEntity
    } : {
      id: a.id,
      label: a.label,
      status: m ? "dark" : "missing",
      subtitle: m ? "No data" : void 0,
      entityId: a.firmwareEntity ?? r,
      inServiceEntity: a.inServiceEntity,
      firmwareEntity: a.firmwareEntity
    } : {
      id: a.id,
      label: a.label,
      status: "oos",
      subtitle: a.plannedWhenOff ? "Not installed" : "Out of service",
      entityId: a.inServiceEntity ?? r,
      inServiceEntity: a.inServiceEntity,
      plannedOos: a.plannedWhenOff,
      firmwareEntity: a.firmwareEntity
    };
  if (d) {
    if (!f)
      return {
        id: a.id,
        label: a.label,
        status: m ? "dark" : "missing",
        subtitle: m ? "No data" : void 0,
        entityId: a.relayEntity ?? a.demandEntity ?? r,
        inServiceEntity: a.inServiceEntity,
        runtimeToday: a.runtimeToday,
        cyclesToday: a.cyclesToday,
        demandEntity: a.demandEntity,
        firmwareEntity: a.firmwareEntity
      };
    const _ = d.values.relay_on === !0;
    return {
      id: a.id,
      label: a.label,
      status: _ ? "ok" : "idle",
      subtitle: _ ? "Running" : "Idle",
      entityId: a.demandEntity || a.relayEntity || r,
      inServiceEntity: a.inServiceEntity,
      runtimeToday: a.runtimeToday,
      cyclesToday: a.cyclesToday,
      demandEntity: a.demandEntity,
      firmwareEntity: a.firmwareEntity
    };
  }
  return a.id === "tank" || a.id === "ac" || a.id === "mister" ? zr(i, a.id) ? {
    id: a.id,
    label: a.label,
    status: "idle",
    subtitle: "Idle",
    entityId: a.inServiceEntity ?? r,
    inServiceEntity: a.inServiceEntity
  } : {
    id: a.id,
    label: a.label,
    status: "oos",
    subtitle: a.plannedWhenOff ? "Not installed" : "Out of service",
    entityId: a.inServiceEntity ?? r,
    inServiceEntity: a.inServiceEntity,
    plannedOos: a.plannedWhenOff
  } : {
    id: a.id,
    label: a.label,
    status: o ? "dark" : "missing",
    entityId: r,
    inServiceEntity: a.inServiceEntity,
    demandEntity: a.demandEntity,
    firmwareEntity: a.firmwareEntity
  };
}
function Md(a) {
  const i = a.filter((d) => d.id !== "hub"), r = i.filter((d) => d.status === "oos"), o = i.filter((d) => d.status === "dark").length;
  return {
    inService: i.length - r.length,
    total: i.length,
    dark: o
  };
}
function Z1(a, i) {
  switch (a) {
    case "ok":
      return i;
    case "idle":
      return `${i} idle`;
    case "held":
      return `${i} held`;
    case "oos":
      return `${i} out of service`;
    case "missing":
      return `${i} not set up`;
    case "dark":
      return `${i} no data`;
    default:
      return a;
  }
}
function K1(a) {
  switch (a) {
    case "ok":
      return "ok";
    case "idle":
      return "muted";
    case "held":
      return "warn";
    case "oos":
    case "missing":
      return "muted";
    case "dark":
      return "bad";
    default:
      return a;
  }
}
const m_ = { w: 720, h: 400 }, Is = { x: 360, y: 188 }, J1 = /* @__PURE__ */ new Set(["heater", "heatmat", "humidifier", "dehumidifier", "ac", "mister"]);
function p_(a) {
  return J1.has(a.id) && a.status === "ok";
}
function __(a, i, r) {
  if (a === "hub") return Is;
  const o = 148, d = i / Math.max(r, 1) * Math.PI * 2 - Math.PI / 2;
  return { x: Is.x + Math.cos(d) * o, y: Is.y + Math.sin(d) * o };
}
function b_(a) {
  switch (a) {
    case "ok":
      return "var(--dsc-teal)";
    case "idle":
      return "var(--dsc-gray-5)";
    case "held":
      return "var(--dsc-amber)";
    case "oos":
    case "missing":
      return "var(--dsc-gray-4)";
    case "dark":
      return "var(--dsc-bad)";
    default:
      return a;
  }
}
function Td({
  nodes: a,
  onSelect: i
}) {
  const r = a.find((d) => d.id === "hub"), o = a.filter((d) => d.id !== "hub");
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-kit-pulse", children: [
    /* @__PURE__ */ s.jsxs("svg", { viewBox: `0 0 ${m_.w} ${m_.h}`, className: "dsc-kit-constellation", "aria-label": "Kit pulse", children: [
      o.map((d, h) => {
        const f = __(d.id, h, o.length), m = d.status === "oos" || d.status === "missing" || d.status === "dark";
        return /* @__PURE__ */ s.jsx(
          "line",
          {
            x1: Is.x,
            y1: Is.y,
            x2: f.x,
            y2: f.y,
            stroke: b_(r?.status === "ok" && !m ? "ok" : d.status),
            strokeWidth: "1.2",
            strokeDasharray: m || r?.status !== "ok" ? "4 4" : void 0,
            opacity: 0.7
          },
          `edge-${d.id}`
        );
      }),
      a.map((d) => {
        const h = d.id === "hub" ? Is : __(d.id, o.findIndex((b) => b.id === d.id), o.length), f = d.status === "oos" || d.status === "missing" || d.status === "dark", m = d.status === "idle", _ = d.label.replace("Pot ", "P").replace("Clone mister", "Mister").replace("Dehumidifier", "Dehum").replace("Humidifier", "Hum");
        return /* @__PURE__ */ s.jsxs(
          "g",
          {
            transform: `translate(${h.x},${h.y})`,
            role: i ? "button" : void 0,
            tabIndex: i ? 0 : void 0,
            style: { cursor: i ? "pointer" : void 0 },
            onClick: () => i?.(d),
            onKeyDown: (b) => {
              (b.key === "Enter" || b.key === " ") && (b.preventDefault(), i?.(d));
            },
            children: [
              /* @__PURE__ */ s.jsx(
                "circle",
                {
                  r: d.id === "hub" ? 22 : 16,
                  className: p_(d) ? "dsc-kit-node-running" : void 0,
                  fill: f || m ? "none" : "rgba(38,198,218,0.12)",
                  stroke: b_(d.status),
                  strokeWidth: "1.8",
                  strokeDasharray: f ? "4 3" : void 0
                }
              ),
              /* @__PURE__ */ s.jsx("text", { textAnchor: "middle", y: "4", fill: "currentColor", fontSize: "9", children: _ })
            ]
          },
          d.id
        );
      })
    ] }),
    /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: a.map((d) => /* @__PURE__ */ s.jsx(
      H,
      {
        label: Z1(d.status, d.label),
        tone: K1(d.status),
        motion: p_(d) ? "duty" : void 0,
        onClick: i ? () => i(d) : void 0
      },
      d.id
    )) })
  ] });
}
const P1 = 25e3;
function Db(a = P1) {
  const { available: i, tick: r } = Ce(), o = x.useRef({}), [, d] = x.useState(() => Date.now());
  return x.useEffect(() => {
    const h = window.setInterval(() => d(Date.now()), 1e3);
    return () => window.clearInterval(h);
  }, []), x.useCallback(
    (h) => {
      if (!h) return !1;
      if (i(h))
        return o.current[h] = Date.now(), !0;
      const f = o.current[h];
      return f == null ? !1 : Date.now() - f < a;
    },
    [i, a, r]
  );
}
function W1() {
  const { state: a, num: i, available: r, entity: o, tick: d } = Ce(), h = kt(), f = ft(), [m, _] = x.useState(!1), b = Db(), { isSnoozed: v } = fc(), g = kn(), j = h.hub.online || b("sensor.dsc_hub_uptime"), w = _b(), S = bb(), N = gb(), C = i("sensor.dsc_active_alert_count", 0), E = _e("sensor.dsc_hub_tent_temperature"), z = _e("sensor.dsc_hub_tent_humidity"), U = _e("sensor.dsc_hub_vpd_kpa"), Q = _e("sensor.dsc_hub_clone_temperature"), X = _e("sensor.dsc_hub_clone_humidity"), F = _e("sensor.dsc_hub_clone_vpd_kpa"), Z = _e("sensor.dsc_pot1_got_moisture"), I = _e("sensor.dsc_pot2_got_moisture"), ae = _e("sensor.dsc_pot3_got_moisture"), ie = _e("sensor.dsc_pot4_got_moisture"), de = [Z, I, ae, ie], re = h.panel.online ? "on" : a("binary_sensor.dsc_hub_panel_link"), ce = h.panel.online || re === "on", oe = h.hub.values.heartbeat != null ? String(h.hub.values.heartbeat) : a("sensor.dsc_hub_heartbeat", "NO BEAT"), M = h.hub.online && h.hub.values.heartbeat != null ? !0 : b("sensor.dsc_hub_heartbeat"), R = a("switch.dsc_hub_manual_takeover") === "on", D = a("switch.dsc_hub_tent_manual_override") === "on", q = a("switch.dsc_hub_tent_full_auto_mode") === "on", P = !!h.system.reduced_kit, W = String(o("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? ""), k = q && !R, G = a("sensor.dsc_fleet_version_status", h.expected_firmware || "—"), ee = h.version === h.expected_firmware ? "ok" : G === "warn" ? "warn" : "drift", ne = Eb.filter((te) => a(te) === "on" && !v(te)).map((te) => ({
    id: te,
    label: te.split(".").pop()?.replace(/dsc_/, "").replace(/_/g, " ") || te
  })), me = aa.map((te) => us(te, { state: a, entity: o })), fe = Ed(h), ge = Md(fe), $e = ht("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available: r,
    num: i
  }), ye = b("binary_sensor.dsc_hub_panel_link") || ce, nt = !ce && r("sensor.dsc_control_wifi_rssi"), mt = !ce && !nt && !ye, je = E.stale || z.stale || U.stale || Q.stale || X.stale || F.stale, at = (te) => g.open({
    entityId: te.entityId,
    label: te.label,
    kind: "kit",
    runtimeToday: te.runtimeToday,
    cyclesToday: te.cyclesToday,
    demandEntity: te.demandEntity
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Nt,
      {
        icon: "mission",
        title: "Mission",
        subtitle: "Triage glance — Next, faults, seats, lung. Command lives on Climate.",
        primaryAction: /* @__PURE__ */ s.jsx(se, { teal: !0, onClick: () => f("/live/twin"), children: "Open Twin" }),
        actions: /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(se, { primary: !0, onClick: () => f("/live/climate"), children: "Climate Want" }),
          /* @__PURE__ */ s.jsx(vd, { label: "Search", icon: "search", onClick: () => _(!0) }),
          /* @__PURE__ */ s.jsx(
            oc,
            {
              label: "Mission settings",
              items: [
                {
                  id: "climate",
                  label: "Open Climate",
                  onSelect: () => f("/live/climate")
                },
                { id: "main", label: "4×8 cockpit", onSelect: () => f("/live/4x8") },
                { id: "clone", label: "2×4 cockpit", onSelect: () => f("/live/2x4") },
                { id: "fleet", label: "Open Fleet", onSelect: () => f("/fleet") }
              ]
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-status-strip", children: [
      /* @__PURE__ */ s.jsx(
        H,
        {
          icon: j ? "ok" : "alert",
          label: j ? "HUB ONLINE" : "HUB OFFLINE",
          tone: j ? "ok" : "bad",
          onClick: () => g.open({ entityId: "binary_sensor.dsc_hub_link", label: "Hub", kind: "kit" })
        }
      ),
      j ? null : /* @__PURE__ */ s.jsx(
        H,
        {
          label: `OFF ${w != null ? La(w) : "—"}`,
          tone: "bad",
          pulse: !0
        }
      ),
      je ? /* @__PURE__ */ s.jsx(H, { label: "HELD VITALS", tone: "warn" }) : null,
      /* @__PURE__ */ s.jsx(
        H,
        {
          label: `${ge.inService} of ${ge.total} in service`,
          tone: ge.dark > 0 ? "bad" : "ok",
          onClick: () => f("/fleet")
        }
      ),
      /* @__PURE__ */ s.jsx(
        H,
        {
          label: ce ? "PANEL LINKED" : nt ? "PANEL LIMITED LINK" : mt ? "PANEL OFFLINE" : "PANEL…",
          tone: ce ? "ok" : nt ? "warn" : "bad",
          onClick: () => g.open({ entityId: "binary_sensor.dsc_hub_panel_link", label: "Panel link", kind: "kit" })
        }
      ),
      mt ? /* @__PURE__ */ s.jsx(
        H,
        {
          label: `PANEL OFF ${N != null ? La(N) : "—"}`,
          tone: "bad",
          pulse: !0
        }
      ) : null,
      /* @__PURE__ */ s.jsx(
        H,
        {
          icon: M ? "ok" : "alert",
          label: M ? `BEAT ${oe}` : "NO BEAT",
          tone: M ? "ok" : "bad",
          onClick: () => g.open({ entityId: "sensor.dsc_hub_heartbeat", label: "Heartbeat", kind: "kit" })
        }
      ),
      M ? null : /* @__PURE__ */ s.jsx(H, { label: `BEAT OFF ${S != null ? La(S) : "—"}`, tone: "bad", pulse: !0 }),
      /* @__PURE__ */ s.jsx(
        H,
        {
          icon: ne.length === 0 ? "ok" : "alert",
          label: ne.length === 0 ? "All clear" : `${ne.length} alert(s)`,
          tone: ne.length === 0 ? "ok" : "bad",
          pulse: ne.length > 0,
          onClick: () => {
            const te = ne[0];
            g.open({
              entityId: te?.id || "sensor.dsc_active_alert_count",
              label: te?.label || "Alerts",
              kind: "alert"
            });
          }
        }
      ),
      /* @__PURE__ */ s.jsx(
        H,
        {
          label: ee === "ok" ? "FLEET OK" : ee === "warn" ? "FLEET WARN" : "FLEET DRIFT",
          tone: ee === "ok" ? "ok" : ee === "warn" ? "warn" : "bad",
          onClick: () => g.open({
            entityId: "sensor.dsc_fleet_version_status",
            label: `Fleet ${h.expected_firmware}`,
            kind: "fleet"
          })
        }
      ),
      q ? /* @__PURE__ */ s.jsx(H, { icon: "ok", label: "FULL AUTO", tone: "ok", pulse: !0 }) : null,
      k ? /* @__PURE__ */ s.jsx(H, { label: "AUTO-DRIVEN", tone: "ok" }) : null,
      R ? /* @__PURE__ */ s.jsx(H, { icon: "alert", label: "MANUAL TAKEOVER", tone: "warn", pulse: !0 }) : null,
      D ? /* @__PURE__ */ s.jsx(H, { icon: "alert", label: "FAN OVERRIDE", tone: "warn", pulse: !0 }) : null,
      q && P ? /* @__PURE__ */ s.jsx(
        H,
        {
          icon: "alert",
          label: W || "CAPACITY OFFLINE",
          tone: "warn",
          pulse: !0,
          onClick: () => g.open({
            entityId: "binary_sensor.dsc_reduced_kit",
            label: "Capacity offline",
            kind: "alert"
          })
        }
      ) : null
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid dsc-mission-modern", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(H0, {}) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(le, { className: "dsc-glass", title: "Hub link", icon: "fleet", children: /* @__PURE__ */ s.jsx(Cd, {}) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(le, { className: "dsc-glass", title: "Kit pulse", icon: "ok", children: /* @__PURE__ */ s.jsx(Td, { nodes: fe, onSelect: at }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Lung CFM", icon: "climate", children: [
        /* @__PURE__ */ s.jsx(pc, { readings: [$e] }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: /* @__PURE__ */ s.jsxs("button", { type: "button", className: "dsc-chip", onClick: () => f("/live/climate"), children: [
          "OUT ",
          Number.isFinite($e.value) ? Math.round($e.value) : "—",
          " cfm → Climate"
        ] }) })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(le, { className: "dsc-glass", title: "Plant seats", icon: "seat", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: me.map((te) => {
        const Le = !Qt(te.pot, a), We = dc(te.pot, a), pt = de[te.pot - 1], Ie = !Le && !We.blockNeedAct && te.need && te.need !== "—" && te.need !== "ok";
        return /* @__PURE__ */ s.jsxs(
          "button",
          {
            type: "button",
            className: `dsc-chip${Le ? "" : " dsc-chip--ok"}${Ie ? " dsc-chip--pulse" : ""}`,
            onClick: () => window.dispatchEvent(new CustomEvent("dsc-dash-select-pot", { detail: { pot: te.pot } })),
            title: Le ? "Out of service — no data" : te.need,
            children: [
              /* @__PURE__ */ s.jsx(zn, { spec: $a(te.pot, a, o), size: 18 }),
              "P",
              te.pot,
              " ",
              te.plantName !== "—" ? te.plantName : "—",
              " · Got M",
              " ",
              Le ? "—" : pt.stale ? `${Number.isFinite(pt.value) ? pt.value.toFixed(0) : "—"}*` : te.moisture,
              Le ? " · Out of service" : ` · Need ${te.need}`,
              pt.stale && !Le ? " · HELD" : "",
              We.labels.length ? ` · ${We.labels.join("/")}` : ""
            ]
          },
          te.pot
        );
      }) }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(le, { className: "dsc-glass", title: "Faults / alerts", icon: "alert", children: ne.length === 0 && C === 0 ? /* @__PURE__ */ s.jsx("div", { className: "dsc-empty dsc-empty--ok", children: "No active faults — all clear." }) : /* @__PURE__ */ s.jsxs("ul", { className: "dsc-fault-list", children: [
        ne.map((te) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx(
          H,
          {
            label: te.label,
            tone: "bad",
            pulse: !0,
            icon: "alert",
            onClick: () => g.open({ entityId: te.id, label: te.label, kind: "alert" })
          }
        ) }, te.id)),
        C > 0 && ne.length === 0 ? /* @__PURE__ */ s.jsxs("li", { children: [
          /* @__PURE__ */ s.jsx(H, { label: `${C} system alert(s)`, tone: "bad", pulse: !0, icon: "alert" }),
          /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", children: "See Fleet for details" })
        ] }) : null
      ] }) }) })
    ] }),
    /* @__PURE__ */ s.jsx(os, { open: m, onClose: () => _(!1), title: "Quick jump", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: [
      { path: "/live/climate", label: "Climate" },
      { path: "/live/twin", label: "Twin" },
      { path: "/live/4x8", label: "4×8" },
      { path: "/live/2x4", label: "2×4" },
      { path: "/live/root", label: "Root" },
      { path: "/live/light", label: "Light" },
      { path: "/grow/compose", label: "Compose" },
      { path: "/fleet", label: "Fleet" }
    ].map((te) => /* @__PURE__ */ s.jsx(
      "button",
      {
        type: "button",
        className: "dsc-btn teal",
        onClick: () => {
          _(!1), f(te.path);
        },
        children: te.label
      },
      te.path
    )) }) })
  ] });
}
function I1(a) {
  return a.kind === "allocated" || a.kind === "mass-balance" ? void 0 : "6 5";
}
function Ta(a) {
  return Number.isFinite(a) ? String(Math.round(a)) : "—";
}
function e2(a) {
  return !Number.isFinite(a) || a <= 0 ? 0 : a < 40 ? 1 : a < 80 ? 2 : a < 140 ? 3 : a < 220 ? 4 : 5;
}
function ls({
  x1: a,
  y1: i,
  x2: r,
  y2: o,
  reading: d,
  color: h,
  onClick: f
}) {
  const m = e2(d.value), _ = r - a, b = o - i, v = Math.hypot(_, b) || 1, g = -b / v * 3.2, j = _ / v * 3.2, w = -Math.floor((m - 1) / 2);
  return /* @__PURE__ */ s.jsx(
    "g",
    {
      role: f ? "button" : void 0,
      style: { cursor: f ? "pointer" : void 0 },
      onClick: f,
      children: m === 0 ? /* @__PURE__ */ s.jsx(
        "line",
        {
          x1: a,
          y1: i,
          x2: r,
          y2: o,
          stroke: h,
          strokeWidth: "1.2",
          strokeDasharray: "2 6",
          opacity: 0.35
        }
      ) : Array.from({ length: m }, (S, N) => {
        const C = w + N;
        return /* @__PURE__ */ s.jsx(
          "line",
          {
            x1: a + g * C,
            y1: i + j * C,
            x2: r + g * C,
            y2: o + j * C,
            stroke: h,
            strokeWidth: 1.4 + Math.min(2.2, d.value / 120),
            strokeDasharray: I1(d),
            opacity: 0.85
          },
          N
        );
      })
    }
  );
}
function Rd({
  intakeClone: a,
  intakeMain: i,
  outCfm: r,
  recircCfm: o,
  compact: d,
  focus: h
}) {
  const f = kn(), m = {
    value: Number.isFinite(a.value) ? a.value : 0,
    kind: a.kind,
    entityId: a.entityId,
    nameplate: a.nameplate
  }, _ = (Number.isFinite(a.value) ? a.value : 0) + (Number.isFinite(i.value) ? i.value : 0), b = h !== "main", v = h !== "clone", g = h !== "clone", j = h === "clone" ? [a] : h === "main" ? [i, r, o] : [a, i, r, o], w = () => f.open({
    entityId: m.entityId,
    label: "Cascade 2×4 → 4×8",
    unit: "cfm"
  });
  return /* @__PURE__ */ s.jsxs("div", { className: `dsc-air-path${d ? " is-compact" : ""}`, children: [
    /* @__PURE__ */ s.jsx(pc, { readings: j }),
    /* @__PURE__ */ s.jsxs("svg", { viewBox: "0 0 720 260", className: "dsc-air-svg", "aria-label": "Air path room to tents", children: [
      /* @__PURE__ */ s.jsx("rect", { x: "16", y: "78", width: "120", height: "110", rx: "12", fill: "none", stroke: "var(--dsc-teal)", strokeWidth: "1.8" }),
      /* @__PURE__ */ s.jsx("text", { x: "76", y: "122", textAnchor: "middle", fill: "currentColor", fontSize: "13", children: "Room" }),
      /* @__PURE__ */ s.jsx("text", { x: "76", y: "142", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: "umbrella lung" }),
      b ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx("rect", { x: "220", y: "28", width: "150", height: "88", rx: "10", fill: "none", stroke: "var(--dsc-teal)", strokeWidth: "1.8" }),
        /* @__PURE__ */ s.jsx("text", { x: "295", y: "64", textAnchor: "middle", fill: "currentColor", fontSize: "13", children: "2×4 tent" }),
        /* @__PURE__ */ s.jsxs("text", { x: "295", y: "84", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: [
          "in ",
          Ta(a.value),
          " cfm"
        ] }),
        /* @__PURE__ */ s.jsx(
          ls,
          {
            x1: 136,
            y1: 110,
            x2: 220,
            y2: 72,
            reading: a,
            color: "var(--dsc-teal)",
            onClick: () => f.open({
              entityId: a.entityId,
              label: "2×4 intake CFM",
              unit: "cfm"
            })
          }
        )
      ] }) : null,
      v ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx("rect", { x: "220", y: "150", width: "150", height: "88", rx: "10", fill: "none", stroke: "var(--dsc-blue)", strokeWidth: "1.8" }),
        /* @__PURE__ */ s.jsx("text", { x: "295", y: "186", textAnchor: "middle", fill: "currentColor", fontSize: "13", children: "4×8 tent" }),
        /* @__PURE__ */ s.jsxs("text", { x: "295", y: "206", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: [
          "in ",
          Ta(i.value),
          " cfm"
        ] }),
        /* @__PURE__ */ s.jsx(
          ls,
          {
            x1: 136,
            y1: 140,
            x2: 220,
            y2: 194,
            reading: i,
            color: "var(--dsc-blue)",
            onClick: () => f.open({
              entityId: i.entityId,
              label: "4×8 intake CFM",
              unit: "cfm"
            })
          }
        )
      ] }) : null,
      g ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx("rect", { x: "560", y: "150", width: "140", height: "88", rx: "10", fill: "none", stroke: "#ff8a65", strokeWidth: "1.6" }),
        /* @__PURE__ */ s.jsx("text", { x: "630", y: "186", textAnchor: "middle", fill: "currentColor", fontSize: "12", children: "Outdoors" }),
        /* @__PURE__ */ s.jsxs("text", { x: "630", y: "206", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: [
          "dump ",
          Ta(r.value)
        ] })
      ] }) : null,
      h ? null : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx(
          ls,
          {
            x1: 295,
            y1: 116,
            x2: 295,
            y2: 150,
            reading: m,
            color: "var(--dsc-amber)",
            onClick: w
          }
        ),
        /* @__PURE__ */ s.jsxs("text", { x: "370", y: "140", fill: "var(--dsc-amber)", fontSize: "10", children: [
          "cascade ",
          Ta(m.value)
        ] }),
        /* @__PURE__ */ s.jsx("text", { x: "370", y: "152", fill: "var(--dsc-gray-5)", fontSize: "9", children: "same air · not added to Σ" })
      ] }),
      h === "clone" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx(
          ls,
          {
            x1: 370,
            y1: 72,
            x2: 430,
            y2: 72,
            reading: m,
            color: "var(--dsc-amber)",
            onClick: w
          }
        ),
        /* @__PURE__ */ s.jsx("rect", { x: "430", y: "54", width: "88", height: "36", rx: "8", fill: "none", stroke: "var(--dsc-amber)", strokeWidth: "1.4", strokeDasharray: "5 4" }),
        /* @__PURE__ */ s.jsx("text", { x: "474", y: "76", textAnchor: "middle", fill: "var(--dsc-amber)", fontSize: "10", children: "to 4×8" }),
        /* @__PURE__ */ s.jsxs("text", { x: "474", y: "102", textAnchor: "middle", fill: "var(--dsc-amber)", fontSize: "9", children: [
          "cascade ",
          Ta(m.value)
        ] })
      ] }) : null,
      h === "main" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx(
          ls,
          {
            x1: 295,
            y1: 132,
            x2: 295,
            y2: 150,
            reading: m,
            color: "var(--dsc-amber)",
            onClick: w
          }
        ),
        /* @__PURE__ */ s.jsx("rect", { x: "251", y: "104", width: "88", height: "28", rx: "8", fill: "none", stroke: "var(--dsc-amber)", strokeWidth: "1.4", strokeDasharray: "5 4" }),
        /* @__PURE__ */ s.jsx("text", { x: "295", y: "122", textAnchor: "middle", fill: "var(--dsc-amber)", fontSize: "10", children: "from 2×4" }),
        /* @__PURE__ */ s.jsxs("text", { x: "390", y: "122", fill: "var(--dsc-amber)", fontSize: "9", children: [
          "cascade ",
          Ta(m.value)
        ] })
      ] }) : null,
      g ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx(
          ls,
          {
            x1: 370,
            y1: 194,
            x2: 560,
            y2: 194,
            reading: r,
            color: "#ff8a65",
            onClick: () => f.open({ entityId: r.entityId, label: "Dump OUT CFM", unit: "cfm" })
          }
        ),
        /* @__PURE__ */ s.jsx(
          ls,
          {
            x1: 370,
            y1: 220,
            x2: 136,
            y2: 168,
            reading: o,
            color: "#b388ff",
            onClick: () => f.open({ entityId: o.entityId, label: "Recirc CFM", unit: "cfm" })
          }
        ),
        /* @__PURE__ */ s.jsxs("text", { x: "80", y: "200", fill: "#b388ff", fontSize: "10", children: [
          "recirc ",
          Ta(o.value)
        ] })
      ] }) : null
    ] }),
    h ? null : /* @__PURE__ */ s.jsx(
      H,
      {
        label: `Mass-balance exhaust = Σ intake ${Ta(_)} × dump/recirc split`,
        tone: "muted"
      }
    )
  ] });
}
const t2 = "#66bb6a", g_ = "#ffb74d", v_ = "#ef5350", n2 = "#8b95a8", x_ = -1e9;
function a2(a, i, r) {
  const o = r === "°C" ? 1 : 0.05;
  return Math.max((i - a) * 0.12, o);
}
function fi(a, i, r) {
  if (!Number.isFinite(a) || !Number.isFinite(i) || i <= a)
    return [{ from: x_, color: n2 }];
  const o = a2(a, i, r);
  return [
    { from: x_, color: v_ },
    { from: a - 3 * o, color: g_ },
    { from: a - o, color: t2 },
    { from: i + o, color: g_ },
    { from: i + 3 * o, color: v_ }
  ];
}
function ai(a) {
  const i = Number.isFinite(a) ? a : 25;
  return fi(i - 2, i + 2, "°C");
}
function si(a, i) {
  return fi(a, i);
}
function nc(a, i) {
  return fi(a, i);
}
function s2(a, i) {
  return fi(a, i, "°C");
}
function sd(a = 30, i = 75) {
  return fi(a, i);
}
function l2(a) {
  return a("sensor.dsc_hub_room_vpd_kpa") ? "sensor.dsc_hub_room_vpd_kpa" : a("sensor.dsc_hub_room_vpd") ? "sensor.dsc_hub_room_vpd" : "sensor.dsc_hub_room_vpd_kpa";
}
function Rn(a, i = 1) {
  return Number.isFinite(a) ? a.toFixed(i) : "—";
}
const i2 = [
  { id: "compare", label: "All" },
  { id: "main", label: "4×8" },
  { id: "clone", label: "2×4" },
  { id: "room", label: "Room" }
];
function r2() {
  const { num: a, state: i, entity: r, available: o } = Ce(), d = kt(), h = J_(), f = ft(), m = kn(), { focus: _, setFocus: b } = Nd(), { hours: v, setHours: g, maxPoints: j } = al(6), w = el("switch.dsc_hub_tent_manual_override").state === "on", S = el("switch.dsc_hub_tent_full_auto_mode").state === "on", N = String(r("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? ""), C = !!d.system.reduced_kit, E = _e("sensor.dsc_hub_tent_temperature"), z = _e("sensor.dsc_hub_tent_humidity"), U = _e("sensor.dsc_hub_vpd_kpa"), Q = _e("sensor.dsc_hub_clone_temperature"), X = _e("sensor.dsc_hub_clone_humidity"), F = _e("sensor.dsc_hub_clone_vpd_kpa"), Z = _e("sensor.dsc_hub_room_temperature"), I = _e("sensor.dsc_hub_room_humidity"), ae = l2(r), ie = _e(ae), de = xe("sensor.dsc_hub_tent_temperature", { hours: v, maxPoints: j, withGhost: !0 }), re = xe("sensor.dsc_hub_tent_humidity", { hours: v, maxPoints: j, withGhost: !0 }), ce = xe("sensor.dsc_hub_vpd_kpa", { hours: v, maxPoints: j, withGhost: !0 }), oe = xe("sensor.dsc_hub_clone_temperature", { hours: v, maxPoints: j, withGhost: !0 }), M = xe("sensor.dsc_hub_clone_humidity", { hours: v, maxPoints: j, withGhost: !0 }), R = xe("sensor.dsc_hub_clone_vpd_kpa", { hours: v, maxPoints: j, withGhost: !0 }), D = xe("sensor.dsc_hub_room_temperature", { hours: v, maxPoints: j, withGhost: !0 }), q = xe("sensor.dsc_hub_room_humidity", { hours: v, maxPoints: j, withGhost: !0 }), P = xe(ae, { hours: v, maxPoints: j, withGhost: !0 }), W = xe("sensor.dsc_fan_exhaust_outside_pct", { hours: v, maxPoints: j }), k = xe("sensor.dsc_fan_exhaust_room_pct", { hours: v, maxPoints: j }), G = ht("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available: o,
    num: a
  }), ee = ht(
    "sensor.dsc_cfm_exhaust_recirc_allocated",
    "sensor.dsc_cfm_exhaust_recirc",
    { available: o, num: a }
  ), ne = ht(
    "sensor.dsc_cfm_intake_main_allocated",
    "sensor.dsc_cfm_intake_main",
    { available: o, num: a }
  ), me = ht(
    "sensor.dsc_cfm_intake_2x4_allocated",
    "sensor.dsc_cfm_intake_2x4",
    { available: o, num: a }
  ), fe = Gu(Z.value, I.value), ge = Gu(E.value, z.value), $e = Gu(Q.value, X.value), ye = a("number.dsc_hub_target_temp"), nt = a("number.dsc_hub_rh_target_min"), mt = a("number.dsc_hub_rh_target_max"), je = a("number.dsc_hub_vpd_target_min"), at = a("number.dsc_hub_vpd_target_max"), te = a("number.dsc_hub_clone_target_temp"), Le = a("number.dsc_hub_clone_rh_min"), We = a("number.dsc_hub_clone_rh_max"), pt = a("number.dsc_hub_clone_vpd_min"), Ie = a("number.dsc_hub_clone_vpd_max"), Ae = (Nn, vc, fs) => m.open({ entityId: Nn, label: vc, unit: fs }), Lt = x.useMemo(() => An(de.series), [de.series]), $t = x.useMemo(() => An(re.series), [re.series]), ln = x.useMemo(() => An(ce.series), [ce.series]), Zt = x.useMemo(() => An(oe.series), [oe.series]), st = x.useMemo(() => An(M.series), [M.series]), il = x.useMemo(() => An(R.series), [R.series]), Re = x.useMemo(() => An(D.series), [D.series]), ds = x.useMemo(() => An(q.series), [q.series]), hs = x.useMemo(() => An(P.series), [P.series]), _c = E.value - Z.value, mi = ge - fe, bc = U.value - ie.value, gc = E.value - Q.value, Ua = ge - $e, zt = $e - fe, vn = a("sensor.dsc_bought_runtime_today"), Ct = a("sensor.dsc_vent_heat_dump_btu"), rl = (Nn) => _ === "compare" || _ === Nn ? "dsc-gauge-row-3 is-lit" : "dsc-gauge-row-3";
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Nt,
      {
        icon: "climate",
        title: "Climate",
        subtitle: "Room is the umbrella lung. 2×4 and 4×8 are grow rooms and transfer/storage. T, RH, VPD only together.",
        actions: /* @__PURE__ */ s.jsx(
          oc,
          {
            label: "Climate settings",
            items: [
              { id: "mission", label: "Mission", onSelect: () => f("/live/mission") },
              { id: "main", label: "4×8 cockpit", onSelect: () => f("/live/4x8") },
              { id: "clone", label: "2×4 cockpit", onSelect: () => f("/live/2x4") },
              { id: "fleet", label: "Fleet kit", onSelect: () => f("/fleet") }
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 14 }, role: "group", "aria-label": "Zone emphasis", children: [
      /* @__PURE__ */ s.jsx(
        H,
        {
          icon: h.online ? "ok" : "alert",
          label: h.online ? `Hub ${h.temp_c != null ? `${h.temp_c.toFixed(1)}°C` : "live"}` : "Hub offline",
          tone: h.online ? "ok" : "bad"
        }
      ),
      i2.map((Nn) => /* @__PURE__ */ s.jsx(
        "button",
        {
          type: "button",
          className: `dsc-chip${_ === Nn.id ? " dsc-chip--ok" : ""}`,
          onClick: () => b(Nn.id),
          children: Nn.label
        },
        Nn.id
      )),
      /* @__PURE__ */ s.jsx(ll, { hours: v, setHours: g, extras: sl }),
      /* @__PURE__ */ s.jsx(se, { teal: !0, onClick: () => f("/fleet"), children: "Kit / Fleet" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Command", icon: "climate", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-row", children: [
          /* @__PURE__ */ s.jsx(Ye, { entityId: "switch.dsc_hub_tent_full_auto_mode", label: "Full Auto", icon: "ok" }),
          /* @__PURE__ */ s.jsx(Ye, { entityId: "switch.dsc_hub_manual_takeover", label: "Master takeover", icon: "alert" }),
          /* @__PURE__ */ s.jsx(Ye, { entityId: "switch.dsc_hub_tent_manual_override", label: "Fan override", icon: "climate" }),
          /* @__PURE__ */ s.jsx(Ye, { entityId: "switch.dsc_hub_humidifier_intake_routing", label: "Hum intake routing", icon: "climate" }),
          /* @__PURE__ */ s.jsx(Ye, { entityId: "switch.dsc_hub_recirc_de_strat_pulse", label: "RECIRC de-strat", icon: "climate" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-selects", children: [
          /* @__PURE__ */ s.jsx(Da, { entityId: "select.dsc_hub_control_strategy", label: "Strategy", icon: "climate" }),
          /* @__PURE__ */ s.jsx(Da, { entityId: "select.dsc_hub_priority_tent", label: "Priority tent", icon: "tent" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-demand-row", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ s.jsx(Ye, { entityId: "switch.dsc_hub_heater_demand", label: "Heat", icon: "climate" }),
          /* @__PURE__ */ s.jsx(
            Ye,
            {
              entityId: "switch.dsc_hub_ac_demand",
              label: "Cool",
              icon: "climate",
              warnWhenMissing: i("binary_sensor.dsc_ac_capacity_offline") === "on" ? "AC ○" : void 0
            }
          ),
          /* @__PURE__ */ s.jsx(Ye, { entityId: "switch.dsc_hub_humidifier_demand", label: "Hum", icon: "climate" }),
          /* @__PURE__ */ s.jsx(Ye, { entityId: "switch.dsc_hub_dehumidifier_demand", label: "Dehum", icon: "climate" }),
          /* @__PURE__ */ s.jsx(Ye, { entityId: "switch.dsc_hub_grow_mat_demand", label: "Mat", icon: "root" }),
          /* @__PURE__ */ s.jsx(Ye, { entityId: "switch.dsc_hub_clone_humidifier_demand", label: "Mister", icon: "clone" })
        ] }),
        S ? /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
          /* @__PURE__ */ s.jsx(
            H,
            {
              icon: C ? "alert" : "ok",
              label: C ? "Capacity offline" : "Full Auto",
              tone: C ? "warn" : "ok",
              onClick: () => m.open({
                entityId: C ? "binary_sensor.dsc_reduced_kit" : "switch.dsc_hub_tent_full_auto_mode",
                label: C ? "Capacity offline" : "Full Auto",
                kind: C ? "alert" : "binary"
              })
            }
          ),
          " ",
          N || "The hub drives fans and appliances automatically while Full Auto is on."
        ] }) : null
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Room umbrella", icon: "climate", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
          /* @__PURE__ */ s.jsx(
            St,
            {
              label: "Room °C",
              value: Rn(Z.value),
              unit: "°C",
              stale: Z.stale,
              onClick: () => Ae("sensor.dsc_hub_room_temperature", "Room T", "°C")
            }
          ),
          /* @__PURE__ */ s.jsx(
            St,
            {
              label: "Room RH",
              value: Rn(I.value, 0),
              unit: "%",
              stale: I.stale,
              onClick: () => Ae("sensor.dsc_hub_room_humidity", "Room RH", "%")
            }
          ),
          /* @__PURE__ */ s.jsx(
            St,
            {
              label: "Room VPD",
              value: Rn(ie.value, 2),
              unit: "kPa",
              stale: ie.stale,
              onClick: () => Ae(ae, "Room VPD", "kPa")
            }
          ),
          /* @__PURE__ */ s.jsx(
            St,
            {
              label: "Room AH",
              value: Number.isFinite(fe) ? fe.toFixed(1) : "—",
              unit: "g/m³",
              sub: Number.isFinite(fe) ? `24h ${Rn(a("sensor.dsc_hub_room_temp_mean_24h"))}°C` : "Need T+RH",
              onClick: () => Ae("sensor.dsc_ah_room", "Room AH", "g/m³")
            }
          )
        ] }),
        /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { marginTop: 8, fontSize: 12 }, children: [
          "ΔT room↔4×8 ",
          Rn(_c),
          "°C · ΔAH ",
          Rn(mi),
          " g/m³ · ΔVPD ",
          Rn(bc, 2),
          " · ΔT/ΔAH 2×4↔4×8",
          " ",
          Rn(gc),
          "°C / ",
          Rn(Ua),
          " · ΔAH room↔2×4 ",
          Rn(zt),
          " g/m³. Early warn is the lung poisoning a tent before Want miss."
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(Tb, { hero: !0 }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Triad · T / RH / VPD", icon: "gauge", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-gauge-matrix", children: [
          /* @__PURE__ */ s.jsxs("div", { className: rl("room"), children: [
            /* @__PURE__ */ s.jsx("span", { className: "dsc-gauge-row-tag", children: "Room" }),
            /* @__PURE__ */ s.jsx(Xe, { label: "T", value: Z.value, min: 10, max: 40, unit: "°C", extrema: Re, stale: Z.stale, onClick: () => Ae("sensor.dsc_hub_room_temperature", "Room T", "°C") }),
            /* @__PURE__ */ s.jsx(Xe, { label: "RH", value: I.value, min: 0, max: 100, unit: "%", extrema: ds, stale: I.stale, onClick: () => Ae("sensor.dsc_hub_room_humidity", "Room RH", "%") }),
            /* @__PURE__ */ s.jsx(Xe, { label: "VPD", value: ie.value, min: 0, max: 2.5, unit: "kPa", extrema: hs, stale: ie.stale, onClick: () => Ae(ae, "Room VPD", "kPa") })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: rl("clone"), children: [
            /* @__PURE__ */ s.jsx("span", { className: "dsc-gauge-row-tag", children: "2×4" }),
            /* @__PURE__ */ s.jsx(Xe, { label: "T", value: Q.value, min: 15, max: 35, unit: "°C", target: te, band: { min: te - 2, max: te + 2 }, segments: ai(te), extrema: Zt, stale: Q.stale, onClick: () => Ae("sensor.dsc_hub_clone_temperature", "2×4 T", "°C") }),
            /* @__PURE__ */ s.jsx(Xe, { label: "RH", value: X.value, min: 0, max: 100, unit: "%", band: { min: Le, max: We }, segments: si(Le, We), extrema: st, stale: X.stale, onClick: () => Ae("sensor.dsc_hub_clone_humidity", "2×4 RH", "%") }),
            /* @__PURE__ */ s.jsx(Xe, { label: "VPD", value: F.value, min: 0, max: 2.5, unit: "kPa", band: { min: pt, max: Ie }, segments: nc(pt, Ie), extrema: il, stale: F.stale, onClick: () => Ae("sensor.dsc_hub_clone_vpd_kpa", "2×4 VPD", "kPa") })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: rl("main"), children: [
            /* @__PURE__ */ s.jsx("span", { className: "dsc-gauge-row-tag", children: "4×8" }),
            /* @__PURE__ */ s.jsx(Xe, { label: "T", value: E.value, min: 15, max: 35, unit: "°C", target: ye, band: { min: ye - 2, max: ye + 2 }, segments: ai(ye), extrema: Lt, stale: E.stale, onClick: () => Ae("sensor.dsc_hub_tent_temperature", "4×8 T", "°C") }),
            /* @__PURE__ */ s.jsx(Xe, { label: "RH", value: z.value, min: 0, max: 100, unit: "%", band: { min: nt, max: mt }, segments: si(nt, mt), extrema: $t, stale: z.stale, onClick: () => Ae("sensor.dsc_hub_tent_humidity", "4×8 RH", "%") }),
            /* @__PURE__ */ s.jsx(Xe, { label: "VPD", value: U.value, min: 0, max: 2.5, unit: "kPa", band: { min: je, max: at }, segments: nc(je, at), extrema: ln, stale: U.stale, onClick: () => Ae("sensor.dsc_hub_vpd_kpa", "4×8 VPD", "kPa") })
          ] })
        ] }),
        /* @__PURE__ */ s.jsx(
          Cb,
          {
            rows: [
              { label: "Room T", got: Z.value, stale: Z.stale, want: a("sensor.dsc_hub_room_temp_mean_24h"), unit: "°C" },
              { label: "2×4 T", got: Q.value, stale: Q.stale, want: te, unit: "°C" },
              { label: "4×8 T", got: E.value, stale: E.stale, want: ye, unit: "°C" },
              { label: "2×4 RH", got: X.value, stale: X.stale, wantMin: Le, wantMax: We, unit: "%" },
              { label: "4×8 RH", got: z.value, stale: z.stale, wantMin: nt, wantMax: mt, unit: "%" },
              { label: "2×4 VPD", got: F.value, stale: F.stale, wantMin: pt, wantMax: Ie, unit: "kPa" },
              { label: "4×8 VPD", got: U.value, stale: U.stale, wantMin: je, wantMax: at, unit: "kPa" }
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(le, { className: "dsc-glass", title: "Temperature", icon: "climate", children: /* @__PURE__ */ s.jsx(
        jn,
        {
          unit: "°C",
          lastSyncAt: Math.max(D.lastSyncAt ?? 0, oe.lastSyncAt ?? 0, de.lastSyncAt ?? 0) || void 0,
          series: [
            ...dt("rt", "Room", D, "var(--dsc-gray-5)", "°C"),
            ...dt("ct", "2×4", oe, "var(--dsc-teal)", "°C", { band: { min: te - 1.5, max: te + 1.5 } }),
            ...dt("mt", "4×8", de, "var(--dsc-blue)", "°C", { band: { min: ye - 1.5, max: ye + 1.5 } })
          ],
          targets: [{ axis: "left", value: ye, color: "var(--dsc-amber)", label: "4×8 Want T" }]
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(le, { className: "dsc-glass", title: "Humidity", icon: "climate", children: /* @__PURE__ */ s.jsx(
        jn,
        {
          unit: "%",
          lastSyncAt: Math.max(q.lastSyncAt ?? 0, M.lastSyncAt ?? 0, re.lastSyncAt ?? 0) || void 0,
          yDomain: { left: { min: 0, max: 100 } },
          series: [
            ...dt("rrh", "Room", q, "var(--dsc-gray-5)", "%"),
            ...dt("crh", "2×4", M, "var(--dsc-teal)", "%", { band: { min: Le, max: We } }),
            ...dt("mrh", "4×8", re, "var(--dsc-blue)", "%", { band: { min: nt, max: mt } })
          ],
          targets: [{ axis: "left", min: nt, max: mt, color: "var(--dsc-teal)" }]
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(le, { className: "dsc-glass", title: "VPD", icon: "climate", children: /* @__PURE__ */ s.jsx(
        jn,
        {
          unit: "kPa",
          lastSyncAt: Math.max(P.lastSyncAt ?? 0, R.lastSyncAt ?? 0, ce.lastSyncAt ?? 0) || void 0,
          series: [
            ...dt("rv", "Room", P, "var(--dsc-gray-5)", "kPa"),
            ...dt("cv", "2×4", R, "var(--dsc-teal)", "kPa", { band: { min: pt, max: Ie } }),
            ...dt("mv", "4×8", ce, "var(--dsc-blue)", "kPa", { band: { min: je, max: at } })
          ]
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(le, { className: "dsc-glass", title: "Air path", icon: "climate", children: /* @__PURE__ */ s.jsx(
        Rd,
        {
          intakeClone: me,
          intakeMain: ne,
          outCfm: G,
          recircCfm: ee
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Fan duty %", icon: "climate", children: [
        /* @__PURE__ */ s.jsx(
          jn,
          {
            unit: "%",
            yDomain: { left: { min: 0, max: 100 } },
            lastSyncAt: Math.max(W.lastSyncAt ?? 0, k.lastSyncAt ?? 0) || void 0,
            series: [
              { id: "fout", label: "OUT %", series: W.series, color: "var(--dsc-teal)", unit: "%", step: !0, band: { min: 0, max: 90 } },
              { id: "frec", label: "RECIRC %", series: k.series, color: "var(--dsc-amber)", unit: "%", step: !0, band: { min: 0, max: 90 } }
            ]
          }
        ),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-fan-stack", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ s.jsx(Ha, { entityId: "fan.dsc_hub_4_inch_intake_fan_main", label: "Intake 4×8", disabled: !w }),
          /* @__PURE__ */ s.jsx(Ha, { entityId: "fan.dsc_hub_4_inch_intake_fan_2x4", label: "Intake 2×4", disabled: !w }),
          /* @__PURE__ */ s.jsx(Ha, { entityId: "fan.dsc_hub_6_inch_exhaust_room", label: "Exhaust room", disabled: !w }),
          /* @__PURE__ */ s.jsx(Ha, { entityId: "fan.dsc_hub_6_inch_exhaust_outside", label: "Exhaust outside", disabled: !w })
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(le, { className: "dsc-glass", title: "Efficacy · buying kW because the lung could not transfer", icon: "alert", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ s.jsx(H, { label: `Heat ${i("switch.dsc_hub_heater_demand") === "on" ? "ON" : "off"}`, tone: i("switch.dsc_hub_heater_demand") === "on" ? "ok" : "muted", onClick: () => Ae("switch.dsc_hub_heater_demand", "Heater", void 0) }),
        /* @__PURE__ */ s.jsx(H, { label: `Cool ${i("switch.dsc_hub_ac_demand") === "on" ? "ON" : "off"}`, tone: i("switch.dsc_hub_ac_demand") === "on" ? "ok" : "muted", onClick: () => Ae("switch.dsc_hub_ac_demand", "Cool", void 0) }),
        /* @__PURE__ */ s.jsx(H, { label: `Hum ${i("switch.dsc_hub_humidifier_demand") === "on" ? "ON" : "off"}`, tone: i("switch.dsc_hub_humidifier_demand") === "on" ? "ok" : "muted", onClick: () => Ae("switch.dsc_hub_humidifier_demand", "Humidifier", void 0) }),
        /* @__PURE__ */ s.jsx(H, { label: `Dehum ${i("switch.dsc_hub_dehumidifier_demand") === "on" ? "ON" : "off"}`, tone: i("switch.dsc_hub_dehumidifier_demand") === "on" ? "ok" : "muted", onClick: () => Ae("switch.dsc_hub_dehumidifier_demand", "Dehumidifier", void 0) }),
        /* @__PURE__ */ s.jsx(
          H,
          {
            label: i("binary_sensor.dsc_humidifier_ineffective_suspect") === "on" ? "Hum ineffective" : "Hum ok",
            tone: i("binary_sensor.dsc_humidifier_ineffective_suspect") === "on" ? "warn" : "muted",
            onClick: () => Ae("binary_sensor.dsc_humidifier_ineffective_suspect", "Humidifier ineffective", void 0)
          }
        ),
        /* @__PURE__ */ s.jsx(
          H,
          {
            label: i("binary_sensor.dsc_heater_ineffective_suspect") === "on" ? "Heat ineffective" : "Heat ok",
            tone: i("binary_sensor.dsc_heater_ineffective_suspect") === "on" ? "warn" : "muted",
            onClick: () => Ae("binary_sensor.dsc_heater_ineffective_suspect", "Heater ineffective", void 0)
          }
        ),
        /* @__PURE__ */ s.jsx(
          H,
          {
            label: `Bought ${Number.isFinite(vn) ? vn.toFixed(1) : "—"}h today`,
            tone: "muted",
            onClick: () => Ae("sensor.dsc_bought_runtime_today", "Bought runtime today", "h")
          }
        ),
        /* @__PURE__ */ s.jsx(
          H,
          {
            label: `Dump ${Number.isFinite(Ct) ? Math.round(Ct) : "—"} BTU/h`,
            tone: "muted",
            onClick: () => Ae("sensor.dsc_vent_heat_dump_btu", "Vent heat dump", "BTU/h")
          }
        ),
        /* @__PURE__ */ s.jsx(
          H,
          {
            label: `Heater today ${La(a("sensor.dsc_heater_runtime_today") * 36e5)}`,
            tone: "muted",
            onClick: () => Ae("sensor.dsc_heater_runtime_today", "Heater runtime today", "h")
          }
        )
      ] }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(hi, { compact: !0 }) })
    ] })
  ] });
}
function c2(a, i = 1) {
  return Number.isFinite(a) ? a.toFixed(i) : "—";
}
function o2() {
  const { state: a, entity: i, tick: r, num: o } = Ce();
  kt();
  const d = kn(), h = ft(), [f, m] = rc(), _ = [...aa].map((C) => ({ n: C, seat: us(C, { state: a, entity: i }), oos: !Qt(C, a) })).sort((C, E) => Number(C.oos) - Number(E.oos)), b = q0(a), v = Number(f.get("pot") || 0), g = v >= 1 && v <= 4 && Qt(v, a) ? v : null, j = o("sensor.dsc_growmat_runtime_today"), w = o("sensor.dsc_heatmat_relay_on_time"), S = (C) => {
    const E = new URLSearchParams(f);
    E.set("pot", String(C)), m(E, { replace: !0 });
  }, N = () => {
    const C = new URLSearchParams(f);
    C.delete("pot"), m(C, { replace: !0 });
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Nt,
      {
        icon: "root",
        title: "Root",
        subtitle: `${b.inService} of ${b.total} pots in service. Pots without sensors show no data.`
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(
        St,
        {
          label: "Coldest root",
          value: c2(o("sensor.dsc_coldest_root_zone_temp")),
          unit: "°C",
          onClick: () => d.open({
            entityId: "sensor.dsc_coldest_root_zone_temp",
            label: "Coldest root",
            unit: "°C"
          })
        }
      ) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(
        St,
        {
          label: "Heat mat today",
          value: Number.isFinite(j) ? j.toFixed(1) : La(w * 1e3),
          unit: Number.isFinite(j) ? "h" : "",
          sub: Number.isFinite(w) ? `session ${La(w * 1e3)}` : void 0,
          onClick: () => d.open({
            entityId: "switch.dsc_hub_grow_mat_demand",
            label: "Heat mat",
            kind: "binary",
            runtimeToday: "sensor.dsc_growmat_runtime_today",
            demandEntity: "switch.dsc_hub_grow_mat_demand"
          })
        }
      ) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(le, { title: "Notes", children: /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: "Mat loop uses per-pot sense with plausibility filter. Metric click opens inspector; card chrome opens the seat." }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(
        ec,
        {
          entityId: "switch.dsc_hub_grow_mat_demand",
          hours: 24,
          label: "Heat mat 24h",
          onClick: () => d.open({
            entityId: "switch.dsc_hub_grow_mat_demand",
            label: "Heat mat",
            kind: "binary",
            runtimeToday: "sensor.dsc_growmat_runtime_today",
            demandEntity: "switch.dsc_hub_grow_mat_demand"
          })
        }
      ) }),
      _.map(({ n: C, seat: E, oos: z }) => /* @__PURE__ */ s.jsxs("div", { className: "dsc-col-12", children: [
        /* @__PURE__ */ s.jsx(u2, { pot: C, oos: z, onOpenSeat: () => z ? void 0 : S(C) }),
        z ? null : /* @__PURE__ */ s.jsxs("button", { type: "button", className: "dsc-btn", style: { marginTop: 6 }, onClick: () => S(C), children: [
          "Open ",
          E.plantName !== "—" ? E.plantName : `POT${C}`,
          " seat"
        ] })
      ] }, C))
    ] }),
    /* @__PURE__ */ s.jsx(
      os,
      {
        open: g != null,
        onClose: N,
        title: g != null ? `Plant seat · POT${g}` : "Plant seat",
        children: g != null ? /* @__PURE__ */ s.jsx(mc, { pot: g, onSelectPot: S }) : null
      }
    ),
    /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 8 }, children: /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-chip", onClick: () => h("/live/climate"), children: "Climate Want" }) })
  ] });
}
function u2({ pot: a, oos: i, onOpenSeat: r }) {
  const { state: o, entity: d, available: h } = Ce(), f = kn(), m = us(a, { state: o, entity: d }), _ = dc(a, o), b = gn(a, "moisture", o), v = xe(b, { hours: 6, maxPoints: 48 }), g = _e(`sensor.dsc_pot${a}_dryback_pct`), j = _e(`sensor.dsc_pot${a}_soil_temperature`), w = _e(b), S = _e(gn(a, "ec", o)), N = _e(gn(a, "ph", o)), C = _e(`sensor.dsc_pot${a}_soil_moisture_rate`), E = Xu(a, "moisture", o), z = Xu(a, "ec", o), U = Xu(a, "ph", o), Q = E && E.max !== 45 ? void 0 : { min: 0, max: 45 }, X = (F, Z, I) => (ae) => {
    ae.stopPropagation(), f.open({ entityId: F, label: Z, unit: I });
  };
  return /* @__PURE__ */ s.jsxs(le, { className: `dsc-glass dsc-pot-card${i ? " is-oos" : ""}`, title: `Pot ${a}`, icon: "root", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-pot-card-head", onClick: r, role: "presentation", children: [
      /* @__PURE__ */ s.jsx(zn, { spec: $a(a, o, d), size: 28 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: i ? "Out of service" : m.plantName }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
          /* @__PURE__ */ s.jsx(H, { label: uc(m.tent), tone: i || m.tent === "unassigned" ? "muted" : "ok" }),
          /* @__PURE__ */ s.jsx(
            H,
            {
              label: i ? "No data" : _.blockNeedAct ? `${m.need} (no act)` : `Need ${m.need}`,
              tone: i ? "muted" : m.need && m.need !== "ok" && m.need !== "—" ? "warn" : "ok"
            }
          ),
          _.labels.map((F) => /* @__PURE__ */ s.jsx(H, { label: F, tone: "warn" }, F))
        ] })
      ] }),
      /* @__PURE__ */ s.jsx(
        Nb,
        {
          series: v.series,
          color: Sd(
            di({
              value: w.value,
              band: E,
              margin: hc(E),
              stale: w.stale,
              available: Number.isFinite(w.value)
            })
          ),
          width: 140,
          height: 36
        }
      )
    ] }),
    i ? /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Out of service — not measuring." }) : /* @__PURE__ */ s.jsxs("div", { className: "dsc-gauge-row", children: [
      /* @__PURE__ */ s.jsx(Xe, { label: "Moisture", value: w.value, min: 0, max: 100, unit: "%", band: E, segments: E ? sd(E.min, E.max) : sd(), stale: w.stale, onClick: () => f.open({ entityId: b, label: `P${a} moisture`, unit: "%" }) }),
      /* @__PURE__ */ s.jsx(Xe, { label: "Soil °C", value: j.value, min: 10, max: 40, unit: "°C", stale: j.stale, onClick: () => f.open({ entityId: `sensor.dsc_pot${a}_soil_temperature`, label: `P${a} soil T`, unit: "°C" }) }),
      /* @__PURE__ */ s.jsx(Xe, { label: "Dryback", value: g.value, min: 0, max: 100, unit: "%", band: Q, stale: g.stale, onClick: () => f.open({ entityId: `sensor.dsc_pot${a}_dryback_pct`, label: `P${a} dryback`, unit: "%" }) }),
      /* @__PURE__ */ s.jsx(Xe, { label: "EC", value: S.value, min: 0, max: 3e3, unit: "", band: z, stale: S.stale, onClick: () => f.open({ entityId: gn(a, "ec", o), label: `P${a} EC` }) }),
      /* @__PURE__ */ s.jsx(Xe, { label: "pH", value: N.value, min: 4, max: 8, unit: "", band: U, stale: N.stale, onClick: () => f.open({ entityId: gn(a, "ph", o), label: `P${a} pH` }) }),
      /* @__PURE__ */ s.jsxs("button", { type: "button", className: "dsc-npk-hit", onClick: X(`sensor.dsc_pot${a}_soil_nitrogen`, `P${a} N`), children: [
        "N ",
        h(`sensor.dsc_pot${a}_soil_nitrogen`) ? m.n : "—"
      ] }),
      /* @__PURE__ */ s.jsxs("button", { type: "button", className: "dsc-npk-hit", onClick: X(`sensor.dsc_pot${a}_soil_phosphorus`, `P${a} P`), children: [
        "P ",
        h(`sensor.dsc_pot${a}_soil_phosphorus`) ? m.p : "—"
      ] }),
      /* @__PURE__ */ s.jsxs("button", { type: "button", className: "dsc-npk-hit", onClick: X(`sensor.dsc_pot${a}_soil_potassium`, `P${a} K`), children: [
        "K ",
        h(`sensor.dsc_pot${a}_soil_potassium`) ? m.k : "—"
      ] }),
      /* @__PURE__ */ s.jsxs(
        "button",
        {
          type: "button",
          className: "dsc-npk-hit",
          onClick: X(`sensor.dsc_pot${a}_soil_moisture_rate`, `P${a} moisture rate`),
          children: [
            "Rate ",
            Number.isFinite(C.value) ? C.value.toFixed(2) : "—",
            C.stale ? " *" : ""
          ]
        }
      )
    ] })
  ] });
}
function Ku(a, i = 1) {
  return Number.isFinite(a) ? a.toFixed(i) : "—";
}
function d2(a, i = Date.now()) {
  if (!a || a === "—" || a === "unknown" || a === "unavailable") return "—";
  const r = Date.parse(a);
  if (!Number.isFinite(r)) return a;
  const o = r - i, d = Math.abs(o), h = La(d);
  return o >= 0 ? `in ${h}` : `${h} ago`;
}
function h2() {
  const { state: a, num: i, entity: r } = Ce(), o = ft(), d = kn(), h = a("binary_sensor.dsc_clone_dark_period_violation") === "on", f = a("binary_sensor.dsc_clone_light_missing_in_window") === "on", m = a("binary_sensor.dsc_hub_light_catchup_active") === "on", _ = a("light.dsc_hub_sf1000_dimmer") === "on", b = a("binary_sensor.dsc_hub_4x8_window_open") === "on", v = a("binary_sensor.dsc_hub_2x4_window_open") === "on", g = i("sensor.dsc_expected_light_hours"), j = i("sensor.dsc_clone_expected_light_hours"), w = i("sensor.dsc_lights_on_today_4x8"), S = i("sensor.dsc_lights_on_today_2x4"), N = i("sensor.dsc_lights_deviation_today"), C = a("sensor.dsc_next_light_event", "—"), E = td("main", { state: a, entity: r }), z = td("clone", { state: a, entity: r }), U = i("number.dsc_hub_min_dark_hours"), Q = i("number.dsc_hub_clone_light_hours"), [X, F] = x.useState(U), [Z, I] = x.useState(Q), ae = E.lightHours != null ? { min: E.lightHours - 0.5, max: E.lightHours + 0.5, source: "stage", mixed: E.mixed } : null, ie = z.lightHours != null ? { min: z.lightHours - 0.5, max: z.lightHours + 0.5, source: "stage", mixed: z.mixed } : null, de = E.lightHours != null ? {
    min: 24 - E.lightHours - 0.5,
    max: 24 - E.lightHours + 0.5,
    source: "stage",
    mixed: E.mixed
  } : null, re = Number.isFinite(X) ? 24 - X : g, ce = za(re, ae), oe = za(Number.isFinite(X) ? X : U, de), M = a("select.dsc_hub_clone_photoperiod") === "Independent", R = za(
    M && Number.isFinite(Z) ? Z : j,
    ie
  ), D = (G) => G === "critical" ? "bad" : G === "ok" ? "ok" : G === "muted" ? "muted" : "warn", q = a("switch.dsc_hub_heater_demand") === "on", P = i("sensor.dsc_vent_heat_dump_btu"), W = (_ || b) && (q || Number.isFinite(P) && P > 0), k = (G, ee, ne) => d.open({ entityId: G, label: ee, kind: ne || "numeric" });
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Nt,
      {
        icon: "lighting",
        title: "Light",
        subtitle: "Photoperiod desk — equal 4×8 / 2×4 cards. 4×8 Got is the window until a GPIO lamp exists.",
        primaryAction: /* @__PURE__ */ s.jsx(se, { teal: !0, onClick: () => o("/live/climate"), children: "Climate Want" })
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-status-strip", children: [
      /* @__PURE__ */ s.jsx(
        H,
        {
          icon: h ? "alert" : "ok",
          label: h ? "2×4 DARK VIOLATION" : "Dark period OK",
          tone: h ? "bad" : "ok",
          pulse: h,
          onClick: () => k("binary_sensor.dsc_clone_dark_period_violation", "2×4 dark violation", "alert")
        }
      ),
      f ? /* @__PURE__ */ s.jsx(
        H,
        {
          label: "Missing in window",
          tone: "bad",
          pulse: !0,
          onClick: () => k("binary_sensor.dsc_clone_light_missing_in_window", "Light missing in window", "alert")
        }
      ) : null,
      m ? /* @__PURE__ */ s.jsx(
        H,
        {
          label: "Catch-up",
          tone: "warn",
          onClick: () => k("binary_sensor.dsc_hub_light_catchup_active", "Light catch-up", "alert")
        }
      ) : null,
      /* @__PURE__ */ s.jsx(
        H,
        {
          label: `Next ${d2(C)}`,
          tone: "muted",
          onClick: () => k("sensor.dsc_next_light_event", "Next light event")
        }
      ),
      W ? /* @__PURE__ */ s.jsx(H, { label: "This window is buying heat", tone: "warn", onClick: () => o("/live/climate") }) : null
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass dsc-light-hero", title: "4×8 light", icon: "tent", children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "4×8 Got is the photoperiod window until a GPIO lamp exists — not a brightness." }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
          /* @__PURE__ */ s.jsx(
            H,
            {
              label: b ? "WINDOW OPEN" : "DARK",
              tone: b ? "ok" : "muted",
              onClick: () => k("binary_sensor.dsc_hub_4x8_window_open", "4×8 window", "binary")
            }
          ),
          /* @__PURE__ */ s.jsx(
            H,
            {
              label: ce.label,
              tone: D(ce.tone),
              onClick: () => k("sensor.dsc_expected_light_hours", "4×8 expected hours", "numeric")
            }
          )
        ] }),
        /* @__PURE__ */ s.jsx(
          Xe,
          {
            label: "Got / Want h",
            value: w,
            min: 0,
            max: 24,
            unit: "h",
            target: E.lightHours ?? g,
            onClick: () => k("sensor.dsc_lights_on_today_4x8", "4×8 hours today", "numeric")
          }
        ),
        /* @__PURE__ */ s.jsx(St, { label: "Want hours", value: Ku(g, 0), unit: "h", onClick: () => k("sensor.dsc_expected_light_hours", "4×8 expected hours", "numeric") }),
        /* @__PURE__ */ s.jsx(
          ec,
          {
            entityId: "binary_sensor.dsc_hub_4x8_window_open",
            hours: 24,
            label: "4×8 window 24h",
            onClick: () => k("binary_sensor.dsc_hub_4x8_window_open", "4×8 window", "binary")
          }
        ),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ s.jsx(Jp, { entityId: "time.dsc_hub_lights_on_time", label: "4×8 opens" }),
          /* @__PURE__ */ s.jsx(Je, { entityId: "number.dsc_hub_sunrise_duration", label: "Sunrise min" }),
          /* @__PURE__ */ s.jsx(Je, { entityId: "number.dsc_hub_sunset_duration", label: "Sunset min" }),
          /* @__PURE__ */ s.jsx(
            Je,
            {
              entityId: "number.dsc_hub_min_dark_hours",
              label: "Min dark h",
              hint: oe.label,
              tone: oe.tone,
              onLive: F
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass dsc-light-hero", title: "2×4 light", icon: "lighting", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
          /* @__PURE__ */ s.jsx(
            H,
            {
              label: _ ? "SF1000 ON" : "SF1000 OFF",
              tone: _ ? "ok" : "muted",
              onClick: () => k("light.dsc_hub_sf1000_dimmer", "SF1000", "binary")
            }
          ),
          /* @__PURE__ */ s.jsx(
            H,
            {
              label: v ? "WINDOW OPEN" : "DARK",
              tone: v ? "ok" : "muted",
              onClick: () => k("binary_sensor.dsc_hub_2x4_window_open", "2×4 window", "binary")
            }
          ),
          /* @__PURE__ */ s.jsx(
            H,
            {
              label: R.label,
              tone: D(R.tone),
              onClick: () => k("sensor.dsc_clone_expected_light_hours", "2×4 expected hours", "numeric")
            }
          )
        ] }),
        /* @__PURE__ */ s.jsx(
          Xe,
          {
            label: "Got / Want h",
            value: S,
            min: 0,
            max: 24,
            unit: "h",
            target: z.lightHours ?? j,
            onClick: () => k("sensor.dsc_lights_on_today_2x4", "2×4 hours today", "numeric")
          }
        ),
        /* @__PURE__ */ s.jsx(St, { label: "Want hours", value: Ku(j, 0), unit: "h", onClick: () => k("sensor.dsc_clone_expected_light_hours", "2×4 expected hours", "numeric") }),
        /* @__PURE__ */ s.jsx(
          ec,
          {
            entityId: "light.dsc_hub_sf1000_dimmer",
            hours: 24,
            label: "SF1000 24h",
            onClick: () => k("light.dsc_hub_sf1000_dimmer", "SF1000", "binary")
          }
        ),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-demand-row", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ s.jsx(Ye, { entityId: "light.dsc_hub_sf1000_dimmer", label: "SF1000", icon: "lighting", showBrightness: !0 }),
          /* @__PURE__ */ s.jsx(Ye, { entityId: "switch.dsc_hub_auto_photoperiod", label: "Auto photoperiod" }),
          /* @__PURE__ */ s.jsx(Ye, { entityId: "switch.dsc_hub_manual_light_hold", label: "Manual light hold" })
        ] }),
        /* @__PURE__ */ s.jsx(Da, { entityId: "select.dsc_hub_clone_photoperiod", label: "Window source", icon: "clone" }),
        M ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
          /* @__PURE__ */ s.jsx(Jp, { entityId: "time.dsc_hub_clone_lights_on_time", label: "2×4 lights-on" }),
          /* @__PURE__ */ s.jsx(
            Je,
            {
              entityId: "number.dsc_hub_clone_light_hours",
              label: "2×4 hours",
              hint: R.label,
              tone: R.tone,
              onLive: I
            }
          )
        ] }) : /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
          "2×4 follows 4×8 (",
          a("time.dsc_hub_lights_on_time", "—"),
          "). Switch Window source to Independent to unlock start/hours."
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(
        St,
        {
          label: "Deviation today",
          value: Ku(N, 2),
          unit: "h",
          sub: "Recorded by the hub",
          onClick: () => k("sensor.dsc_lights_deviation_today", "Lights deviation today", "numeric")
        }
      ) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(hi, {}) })
    ] })
  ] });
}
function Ur(a, i = 1) {
  return Number.isFinite(a) ? a.toFixed(i) : "—";
}
function y_() {
  const a = ft(), { available: i, num: r } = Ce(), o = ht("sensor.dsc_cfm_intake_main_allocated", "sensor.dsc_cfm_intake_main", {
    available: i,
    num: r
  }), d = ht("sensor.dsc_cfm_intake_2x4_allocated", "sensor.dsc_cfm_intake_2x4", {
    available: i,
    num: r
  }), h = ht("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available: i,
    num: r
  }), f = ht(
    "sensor.dsc_cfm_exhaust_recirc_allocated",
    "sensor.dsc_cfm_exhaust_recirc",
    { available: i, num: r }
  );
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page dsc-page--twin-chrome", children: [
    /* @__PURE__ */ s.jsx(
      Nt,
      {
        icon: "twin",
        title: "Twin",
        subtitle: "Cinematic digital twin — pick a pot to open Root seat.",
        primaryAction: /* @__PURE__ */ s.jsx(se, { teal: !0, onClick: () => a("/live/climate"), children: "Set Climate Want" }),
        actions: /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(se, { onClick: () => a("/live/4x8"), children: "4×8 cockpit" }),
          /* @__PURE__ */ s.jsx(se, { onClick: () => a("/live/2x4"), children: "2×4 cockpit" })
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty dsc-muted", style: { marginTop: 0 }, children: "Pick a pot in the twin to open its seat. Twin stays warm across Twin / 4×8 / 2×4. Orbit the scene — it no longer snaps home on hass ticks. 4×8 fixture glow follows the photoperiod window until a main lamp is wired." }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", style: { marginTop: 12 }, children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(hi, {}) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(le, { className: "dsc-glass", title: "Air path", icon: "climate", children: /* @__PURE__ */ s.jsx(Rd, { intakeClone: d, intakeMain: o, outCfm: h, recircCfm: f }) }) })
    ] })
  ] });
}
function Hb({ tent: a }) {
  const { state: i, entity: r, num: o, tick: d, callWS: h, available: f } = Ce(), m = c0(a), _ = ft(), b = kn(), { setFocus: v } = Nd(), [g, j] = rc(), [w, S] = x.useState([]), { hours: N, setHours: C, maxPoints: E } = al(6);
  x.useEffect(() => {
    v(a);
  }, [a, v]);
  const z = ob(a, i, r), U = z.map((je) => je.pot).join(","), Q = Number(g.get("pot") || 0), X = Q >= 1 && Q <= 4 && Qt(Q, i) && z.some((je) => je.pot === Q) ? Q : null, F = a === "main" ? "sensor.dsc_hub_tent_temperature" : "sensor.dsc_hub_clone_temperature", Z = a === "main" ? "sensor.dsc_hub_tent_humidity" : "sensor.dsc_hub_clone_humidity", I = a === "main" ? "sensor.dsc_hub_vpd_kpa" : "sensor.dsc_hub_clone_vpd_kpa", ae = xe(F, { hours: N, maxPoints: E }), ie = xe(Z, { hours: N, maxPoints: E }), de = xe(I, { hours: N, maxPoints: E }), re = _e(F), ce = _e(Z), oe = _e(I), M = Number.isFinite(re.value) ? re.value : m.temp_c, R = Number.isFinite(ce.value) ? ce.value : m.rh_pct, D = Number.isFinite(oe.value) ? oe.value : m.vpd_kpa, q = i(
    a === "main" ? "binary_sensor.dsc_hub_4x8_window_open" : "binary_sensor.dsc_hub_2x4_window_open"
  ) === "on", P = i("light.dsc_hub_sf1000_dimmer") === "on", W = a === "clone" ? P : q, k = a === "main" ? ht("sensor.dsc_cfm_intake_main_allocated", "sensor.dsc_cfm_intake_main", { available: f, num: o }) : ht("sensor.dsc_cfm_intake_2x4_allocated", "sensor.dsc_cfm_intake_2x4", { available: f, num: o }), G = ht(
    "sensor.dsc_cfm_exhaust_out_allocated",
    "sensor.dsc_cfm_exhaust_out",
    { available: f, num: o }
  ), ee = ht(
    "sensor.dsc_cfm_exhaust_recirc_allocated",
    "sensor.dsc_cfm_exhaust_recirc",
    { available: f, num: o }
  ), ne = ht("sensor.dsc_cfm_intake_2x4_allocated", "sensor.dsc_cfm_intake_2x4", {
    available: f,
    num: o
  }), me = ht("sensor.dsc_cfm_intake_main_allocated", "sensor.dsc_cfm_intake_main", {
    available: f,
    num: o
  }), fe = i("switch.dsc_hub_tent_manual_override") === "on", ge = a === "main" ? "4×8 tent" : "2×4 tent", $e = a === "main" ? "Only the 4×8 house in Twin. Cascade-in is a port stub from 2×4, not a second tent." : "Only the 2×4 house in Twin. Cascade-out is a port stub to 4×8.";
  x.useEffect(() => {
    let je = !1;
    async function at() {
      const te = U ? U.split(",").map((Ie) => Number(Ie)).filter((Ie) => Number.isFinite(Ie) && Ie > 0) : [];
      if (!h || te.length === 0) {
        S([]);
        return;
      }
      const Le = te.flatMap((Ie) => [
        `text.dsc_pot${Ie}_plant_name`,
        `input_select.dsc_pot${Ie}_tent`,
        `select.dsc_pot${Ie}_growth_stage`
      ]), We = /* @__PURE__ */ new Date(), pt = new Date(We.getTime() - 48 * 3600 * 1e3);
      try {
        const Ie = await h({
          type: "history/history_during_period",
          start_time: pt.toISOString(),
          end_time: We.toISOString(),
          significant_changes_only: !0,
          minimal_response: !0,
          no_attributes: !0,
          entity_ids: Le
        });
        if (je || !Ie) return;
        const Ae = [];
        for (const [Lt, $t] of Object.entries(Ie))
          for (const ln of $t || []) {
            const Zt = typeof ln.lu == "number" ? ln.lu * 1e3 : ln.last_changed ? Date.parse(ln.last_changed) : NaN, st = String(ln.s ?? ln.state ?? "");
            !Number.isFinite(Zt) || !st || st === "unavailable" || Ae.push({ t: Zt, text: `${new Date(Zt).toLocaleString()} · ${Lt.split(".").pop()} → ${st}` });
          }
        Ae.sort((Lt, $t) => $t.t - Lt.t), S(Ae.map((Lt) => Lt.text));
      } catch {
        je || S([]);
      }
    }
    return at(), () => {
      je = !0;
    };
  }, [h, U, a]);
  const ye = o(a === "main" ? "number.dsc_hub_target_temp" : "number.dsc_hub_clone_target_temp"), nt = o(a === "main" ? "number.dsc_hub_rh_target_min" : "number.dsc_hub_clone_rh_min"), mt = o(a === "main" ? "number.dsc_hub_rh_target_max" : "number.dsc_hub_clone_rh_max");
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Nt,
      {
        icon: a === "main" ? "tent" : "clone",
        title: ge,
        subtitle: `Tent cockpit — ${z.length} seat(s). ${$e}`,
        primaryAction: /* @__PURE__ */ s.jsx(se, { teal: !0, onClick: () => _("/live/twin"), children: "Both tents" }),
        actions: /* @__PURE__ */ s.jsx(se, { primary: !0, onClick: () => _(`/live/climate?tent=${a}`), children: "Climate Want" })
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-tent-cockpit-strip", children: [
      /* @__PURE__ */ s.jsx(H, { label: `${z.length} plants`, tone: "ok" }),
      /* @__PURE__ */ s.jsx(
        H,
        {
          label: `T ${Ur(M)}°C`,
          tone: re.stale && !m.online ? "warn" : "ok",
          onClick: () => b.open({ entityId: F, label: `${ge} T`, unit: "°C" })
        }
      ),
      /* @__PURE__ */ s.jsx(
        H,
        {
          label: `RH ${Ur(R, 0)}%`,
          tone: ce.stale && !m.online ? "warn" : "ok",
          onClick: () => b.open({ entityId: Z, label: `${ge} RH`, unit: "%" })
        }
      ),
      /* @__PURE__ */ s.jsx(
        H,
        {
          label: `VPD ${Ur(D, 2)}`,
          tone: oe.stale && !m.online ? "warn" : "ok",
          onClick: () => b.open({ entityId: I, label: `${ge} VPD`, unit: "kPa" })
        }
      ),
      /* @__PURE__ */ s.jsx(
        H,
        {
          label: a === "clone" ? W ? "SF1000 ON" : "SF1000 OFF" : q ? "PHOTO ON" : "PHOTO OFF",
          tone: W ? "ok" : "muted",
          onClick: () => b.open({
            entityId: a === "clone" ? "light.dsc_hub_sf1000_dimmer" : "binary_sensor.dsc_hub_4x8_window_open",
            label: a === "clone" ? "SF1000" : "4×8 window",
            kind: "binary"
          })
        }
      ),
      /* @__PURE__ */ s.jsx(
        H,
        {
          label: `IN ${Ur(k.value, 0)} cfm`,
          tone: "muted",
          onClick: () => b.open({
            entityId: k.entityId,
            label: `${ge} intake CFM`,
            unit: "cfm"
          })
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(Tb, { only: a, hero: !0 }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(hi, { compact: !0 }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(le, { className: "dsc-glass", title: "Air path", icon: "climate", children: /* @__PURE__ */ s.jsx(
        Rd,
        {
          compact: !0,
          focus: a,
          intakeClone: ne,
          intakeMain: me,
          outCfm: G,
          recircCfm: ee
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(le, { className: "dsc-glass", title: "Seat strip", icon: "seat", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: z.length === 0 ? /* @__PURE__ */ s.jsx("div", { className: "dsc-empty", children: "No pots assigned — Apply to tent from a seat." }) : z.map((je) => {
        const at = Number(i(`sensor.dsc_pot${je.pot}_dryback_pct`)), te = Number.isFinite(at) && at > 45, Le = dc(je.pot, i), We = !Le.blockNeedAct && te;
        return /* @__PURE__ */ s.jsxs(
          "button",
          {
            type: "button",
            className: `dsc-chip dsc-chip--ok${We ? " dsc-chip--pulse" : ""}`,
            onClick: () => {
              const pt = new URLSearchParams(g);
              pt.set("pot", String(je.pot)), j(pt, { replace: !0 });
            },
            children: [
              /* @__PURE__ */ s.jsx(zn, { spec: $a(je.pot, i, r), size: 16 }),
              " P",
              je.pot,
              " ",
              je.plantName,
              " · M ",
              je.moisture,
              " · Need",
              " ",
              Le.blockNeedAct ? `${je.need} (no act)` : je.need,
              te ? " · dryback warn" : ""
            ]
          },
          je.pot
        );
      }) }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Tent history", icon: "climate", children: [
        /* @__PURE__ */ s.jsx(ll, { hours: N, setHours: C, extras: sl }),
        /* @__PURE__ */ s.jsx(
          jn,
          {
            live: !0,
            lastSyncAt: Math.max(ae.lastSyncAt ?? 0, ie.lastSyncAt ?? 0, de.lastSyncAt ?? 0) || void 0,
            series: [
              {
                id: "t",
                label: "Temp",
                series: ae.series,
                color: "var(--dsc-blue)",
                axis: "left",
                unit: "°C",
                band: Number.isFinite(ye) ? { min: ye - 1.5, max: ye + 1.5 } : void 0
              },
              {
                id: "rh",
                label: "RH",
                series: ie.series,
                color: "var(--dsc-teal)",
                axis: "right",
                unit: "%",
                band: { min: nt, max: mt }
              }
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Fans (this tent)", icon: "climate", children: [
        fe ? null : /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Fan sliders locked until Fan override is on (Climate → Command)." }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-fan-stack", children: a === "main" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(
            Ha,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_main",
              label: "Intake 4×8",
              disabled: !fe
            }
          ),
          /* @__PURE__ */ s.jsx(
            Ha,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_room",
              label: "Exhaust room (RECIRC)",
              disabled: !fe
            }
          ),
          /* @__PURE__ */ s.jsx(
            Ha,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_outside",
              label: "Exhaust outside (OUT)",
              disabled: !fe
            }
          )
        ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(
            Ha,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_2x4",
              label: "Intake 2×4",
              disabled: !fe
            }
          ),
          /* @__PURE__ */ s.jsx(Ye, { entityId: "light.dsc_hub_sf1000_dimmer", label: "SF1000", icon: "lighting" })
        ] }) })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(le, { className: "dsc-glass", title: "Plant log (48h)", icon: "roster", children: w.length === 0 ? /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: "Nothing logged in the last 48 hours." }) : /* @__PURE__ */ s.jsxs("ul", { className: "dsc-fault-list", children: [
        w.slice(0, 40).map((je) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", style: { fontFamily: "var(--dsc-mono)", fontSize: 12 }, children: je }) }, je)),
        w.length > 40 ? /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsxs("span", { className: "dsc-muted", style: { fontFamily: "var(--dsc-mono)", fontSize: 12 }, children: [
          "+",
          w.length - 40,
          " more"
        ] }) }) : null
      ] }) }) })
    ] }),
    /* @__PURE__ */ s.jsx(
      os,
      {
        open: X != null,
        onClose: () => {
          const je = new URLSearchParams(g);
          je.delete("pot"), j(je, { replace: !0 });
        },
        title: X != null ? `Plant seat · POT${X}` : "Plant seat",
        children: X != null ? /* @__PURE__ */ s.jsx(
          mc,
          {
            pot: X,
            onSelectPot: (je) => {
              const at = new URLSearchParams(g);
              at.set("pot", String(je)), j(at, { replace: !0 });
            }
          }
        ) : null
      }
    )
  ] });
}
function f2() {
  return /* @__PURE__ */ s.jsx(Hb, { tent: "main" });
}
function m2() {
  return /* @__PURE__ */ s.jsx(Hb, { tent: "clone" });
}
const p2 = [
  { label: "OUT", prefix: "dsc_cal_cfm_out", reset: "script.dsc_cal_reset_curve_out" },
  { label: "RECIRC", prefix: "dsc_cal_cfm_recirc", reset: "script.dsc_cal_reset_curve_recirc" },
  { label: "Intake Main", prefix: "dsc_cal_cfm_intake_main", reset: "script.dsc_cal_reset_curve_intake_main" },
  { label: "Intake 2×4", prefix: "dsc_cal_cfm_intake_clone", reset: "script.dsc_cal_reset_curve_intake_clone" }
], w_ = [25, 50, 75, 100];
function _2() {
  const { entity: a, state: i } = Ce(), { callService: r } = Ht(), [o, d] = x.useState(null), h = i("sensor.dsc_learn_status", "—"), f = i("binary_sensor.dsc_learn_gate_open") === "on", m = i("sensor.dsc_learn_activity", "—"), _ = String(a("sensor.dsc_cfm_exhaust_out")?.attributes?.cal_curve ?? ""), b = i("sensor.dsc_cfm_curves_status", "—"), v = i("sensor.dsc_learn_phase_b_status", "—"), g = i("input_boolean.dsc_cal_active") === "on", j = String(a("sensor.dsc_learn_status")?.attributes?.trusted_levers ?? "none");
  return /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Anemometer / PPFD cal", icon: "learning", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ s.jsx(H, { label: `Curves ${b}`, tone: b === "—" ? "muted" : "ok" }),
        /* @__PURE__ */ s.jsx(H, { label: g ? "SESSION ON" : "Session idle", tone: g ? "ok" : "muted" })
      ] }),
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
        "Live airflow numbers are on the Climate page. This wizard records only the readings you enter.",
        _ ? ` Curve: ${_}` : ""
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", children: [
        /* @__PURE__ */ s.jsx(se, { variant: "primary", onClick: () => d("gate"), children: "Open gate" }),
        /* @__PURE__ */ s.jsx(se, { variant: "secondary", onClick: () => d("sample"), children: "Sample points" }),
        /* @__PURE__ */ s.jsx(se, { variant: "secondary", onClick: () => d("accept"), children: "Finish session" }),
        /* @__PURE__ */ s.jsx(se, { variant: "secondary", onClick: () => d("curves"), children: "Stored curves" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Climate learn (Phase A/B)", icon: "learning", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ s.jsx(H, { label: `Status ${h}`, tone: h === "—" ? "muted" : "ok" }),
        /* @__PURE__ */ s.jsx(H, { label: f ? "GATE OPEN" : "GATE CLOSED", tone: f ? "ok" : "warn" }),
        /* @__PURE__ */ s.jsx(H, { label: `Activity ${m}`, tone: "muted" }),
        /* @__PURE__ */ s.jsx(H, { label: `B ${v}`, tone: v === "off" || v === "—" ? "muted" : "ok" }),
        /* @__PURE__ */ s.jsx(H, { label: `Trusted ${j}`, tone: "muted" })
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: "One air appliance runs at a time; fans and the heat mat may stay on. Watch the Activity chip — an open gate does not mean it is measuring yet. Phase B stays off until samples start climbing." }),
      /* @__PURE__ */ s.jsx(se, { variant: "secondary", onClick: () => d("climate"), children: "Learn enable" })
    ] }),
    /* @__PURE__ */ s.jsxs(Rt, { open: o === "gate", onDismiss: () => d(null), title: "Learn gate", help: null, children: [
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Pick what to calibrate, then start the session. The hub holds each step steady while you measure." }),
      /* @__PURE__ */ s.jsx(Da, { entityId: "input_select.dsc_cal_target", label: "Cal target" }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-kpi-sub", children: i("input_text.dsc_cal_status", "") }),
      /* @__PURE__ */ s.jsx(
        se,
        {
          variant: "primary",
          onClick: () => {
            r("script", "turn_on", { entity_id: "script.dsc_cal_start" }), d("sample");
          },
          children: "Start session"
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs(Rt, { open: o === "sample", onDismiss: () => d(null), title: "Sample", help: null, children: [
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Enter the anemometer reading in m/s or CFM. If you could not measure a step, skip it. Values save when you leave the field." }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
        /* @__PURE__ */ s.jsx(Je, { entityId: "input_number.dsc_cal_reading_ms", label: "m/s" }),
        /* @__PURE__ */ s.jsx(Je, { entityId: "input_number.dsc_cal_reading_cfm", label: "CFM" }),
        /* @__PURE__ */ s.jsx(Je, { entityId: "input_number.dsc_cal_reading_ppfd", label: "PPFD" }),
        /* @__PURE__ */ s.jsx(Je, { entityId: "input_number.dsc_cal_step_pct", label: "Step %" }),
        /* @__PURE__ */ s.jsx(Je, { entityId: "input_number.dsc_duct_out_cm", label: "OUT duct cm" }),
        /* @__PURE__ */ s.jsx(Je, { entityId: "input_number.dsc_duct_recirc_cm", label: "RECIRC cm" }),
        /* @__PURE__ */ s.jsx(Je, { entityId: "input_number.dsc_duct_intake_main_cm", label: "Intake main cm" }),
        /* @__PURE__ */ s.jsx(Je, { entityId: "input_number.dsc_duct_intake_clone_cm", label: "Intake 2×4 cm" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", children: [
        /* @__PURE__ */ s.jsx(se, { variant: "secondary", onClick: () => void r("script", "turn_on", { entity_id: "script.dsc_cal_hold_next" }), children: "Re-hold" }),
        /* @__PURE__ */ s.jsx(se, { variant: "primary", onClick: () => void r("script", "turn_on", { entity_id: "script.dsc_cal_save_point" }), children: "Save point" }),
        /* @__PURE__ */ s.jsx(se, { variant: "secondary", onClick: () => void r("script", "turn_on", { entity_id: "script.dsc_cal_skip_point" }), children: "Skip" }),
        /* @__PURE__ */ s.jsx(se, { variant: "danger", onClick: () => void r("script", "turn_on", { entity_id: "script.dsc_cal_abort" }), children: "Abort" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsx(
      Rt,
      {
        open: o === "accept",
        onDismiss: () => d(null),
        onConfirm: () => {
          r("script", "turn_on", { entity_id: "script.dsc_cal_finish" }), d(null);
        },
        title: "Finish session",
        confirmLabel: "Finish",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          "Curve status ",
          b,
          ". Finishing returns fans and light to their previous settings. Points already saved at 25/50/75/100% are kept."
        ] })
      }
    ),
    /* @__PURE__ */ s.jsxs(
      Rt,
      {
        open: o === "climate",
        onDismiss: () => d(null),
        onConfirm: () => d(null),
        title: "Climate learn enable",
        confirmLabel: "Done",
        help: null,
        children: [
          /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Turns learning on or off. Learning pauses automatically during failsafe, manual takeover, or a fault." }),
          /* @__PURE__ */ s.jsx(Ye, { entityId: "input_boolean.dsc_climate_learn_enabled", label: "Phase A enabled" }),
          /* @__PURE__ */ s.jsx(Ye, { entityId: "input_boolean.dsc_climate_learn_phase_b_enabled", label: "Phase B enabled" }),
          /* @__PURE__ */ s.jsx(Ye, { entityId: "input_boolean.dsc_learn_phase_b_locked", label: "Phase B lock" }),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
            /* @__PURE__ */ s.jsx(Je, { entityId: "input_number.dsc_learn_alpha", label: "EMA α" }),
            /* @__PURE__ */ s.jsx(Je, { entityId: "input_number.dsc_learn_min_samples", label: "Min samples" })
          ] }),
          /* @__PURE__ */ s.jsxs("p", { className: "dsc-kpi-sub", children: [
            "Gate ",
            f ? "open" : "closed",
            " · ",
            m,
            " · trusted ",
            j
          ] })
        ]
      }
    ),
    /* @__PURE__ */ s.jsxs(Rt, { open: o === "curves", onDismiss: () => d(null), title: "Stored curves", help: null, children: [
      /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: "0 means not measured — the hub then estimates from the fan's rated output. Reset clears a curve back to not-measured; it never guesses." }),
      p2.map((w) => /* @__PURE__ */ s.jsxs("div", { className: "dsc-cal-curve", children: [
        /* @__PURE__ */ s.jsx("strong", { children: w.label }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-target-grid", children: w_.map((S) => /* @__PURE__ */ s.jsx(
          Je,
          {
            entityId: `input_number.${w.prefix}_${S}`,
            label: `@${S}%`
          },
          `${w.prefix}_${S}`
        )) }),
        /* @__PURE__ */ s.jsxs(
          se,
          {
            variant: "danger",
            onClick: () => void r("script", "turn_on", { entity_id: w.reset }),
            children: [
              "Reset ",
              w.label
            ]
          }
        )
      ] }, w.prefix)),
      /* @__PURE__ */ s.jsx("strong", { children: "SF1000 PPFD" }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-target-grid", children: w_.map((w) => /* @__PURE__ */ s.jsx(Je, { entityId: `input_number.dsc_cal_ppfd_${w}`, label: `@${w}%` }, `ppfd_${w}`)) }),
      /* @__PURE__ */ s.jsx(
        se,
        {
          variant: "danger",
          onClick: () => void r("script", "turn_on", { entity_id: "script.dsc_cal_reset_curve_sf1000" }),
          children: "Reset PPFD"
        }
      )
    ] })
  ] });
}
function b2() {
  const { available: a, num: i, state: r } = Ce(), o = r("input_boolean.dsc_tank_in_service") === "on", d = a("input_number.dsc_tank_level_pct") || a("sensor.dsc_tank_level_pct"), h = a("sensor.dsc_tank_level_pct") ? i("sensor.dsc_tank_level_pct") : i("input_number.dsc_tank_level_pct"), f = d && Number.isFinite(h), m = a("sensor.dsc_tank_ec_normalized"), _ = a("sensor.dsc_tank_ph_calibrated"), b = a("sensor.water_tester_temperature"), v = r("input_boolean.dsc_tank_pump_active") === "on", g = f ? Math.max(4, Math.min(100, h)) : 0;
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-tank-cutaway", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ s.jsx(H, { label: o ? "In service" : "Out of service", tone: o ? "ok" : "warn" }),
      f ? null : /* @__PURE__ */ s.jsx(H, { label: "Level not measured", tone: "warn" }),
      v ? /* @__PURE__ */ s.jsx(H, { label: "Pump ON", tone: "ok", pulse: !0 }) : /* @__PURE__ */ s.jsx(H, { label: "Pump off", tone: "muted" })
    ] }),
    /* @__PURE__ */ s.jsxs("svg", { viewBox: "0 0 180 220", className: "dsc-tank-svg", "aria-label": "Tank cutaway", children: [
      /* @__PURE__ */ s.jsx(
        "rect",
        {
          x: "24",
          y: "18",
          width: "132",
          height: "184",
          rx: "12",
          fill: "none",
          stroke: "var(--dsc-teal)",
          strokeWidth: "2",
          strokeDasharray: f ? void 0 : "7 5"
        }
      ),
      f ? /* @__PURE__ */ s.jsx(
        "rect",
        {
          x: "28",
          y: 26 + 176 * (1 - g / 100),
          width: "124",
          height: 176 * g / 100,
          fill: "rgba(38,198,218,0.22)"
        }
      ) : null,
      m ? /* @__PURE__ */ s.jsx("rect", { x: "32", y: "36", width: "116", height: "10", fill: "rgba(255,183,77,0.55)" }) : null,
      /* @__PURE__ */ s.jsx("rect", { x: "24", y: "18", width: "132", height: "12", fill: "none", stroke: _ ? "var(--dsc-purple)" : "var(--dsc-gray-5)", strokeWidth: "3" }),
      v ? [0, 1, 2].map((j) => /* @__PURE__ */ s.jsx("circle", { cx: 90 + (j - 1) * 18, cy: "188", r: "4", fill: "var(--dsc-teal)", opacity: 0.5 + j * 0.15 }, j)) : null
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-kpi-sub", children: [
      "EC ",
      m ? `${Math.round(i("sensor.dsc_tank_ec_normalized"))} µS` : "—",
      " · pH",
      " ",
      _ ? i("sensor.dsc_tank_ph_calibrated").toFixed(2) : "—",
      " · T",
      " ",
      b ? `${i("sensor.water_tester_temperature").toFixed(1)} °C` : "—"
    ] })
  ] });
}
const j_ = ["var(--dsc-blue)", "var(--dsc-teal)", "var(--dsc-purple)", "var(--dsc-amber)"];
function g2() {
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Nt,
      {
        icon: "learning",
        title: "Learning",
        subtitle: "Measure fan output, review the sample, then accept it into the curve."
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(_2, {}) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(le, { className: "dsc-glass", title: "Kit / In service", icon: "settings", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-row", children: [
        /* @__PURE__ */ s.jsx(Ye, { entityId: "input_boolean.dsc_ac_in_service", label: "AC in service", icon: "climate" }),
        /* @__PURE__ */ s.jsx(
          Ye,
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
function v2() {
  const { state: a } = Ce(), { hours: i, setHours: r, maxPoints: o } = al(6), d = xe("sensor.dsc_hub_tent_temperature", { maxPoints: o, hours: i }), h = xe("sensor.dsc_hub_tent_humidity", { maxPoints: o, hours: i }), f = xe(gn(1, "moisture", a), { maxPoints: o, hours: i }), m = xe(gn(2, "moisture", a), { maxPoints: o, hours: i }), _ = xe(gn(3, "moisture", a), { maxPoints: o, hours: i }), b = xe(gn(4, "moisture", a), { maxPoints: o, hours: i }), g = [
    { n: 1, series: f },
    { n: 2, series: m },
    { n: 3, series: _ },
    { n: 4, series: b }
  ].filter((w) => Qt(w.n, a)), j = aa.filter((w) => Qt(w, a)).map((w) => ({ n: w, need: a(`sensor.dsc_pot${w}_need_summary`, "—") })).find((w) => w.need && w.need !== "—" && !/^ok$/i.test(w.need));
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Nt,
      {
        icon: "analytics",
        title: "Analytics",
        subtitle: "In-service pots. Climate charts live on Climate; this is the root pack."
      }
    ),
    /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: /* @__PURE__ */ s.jsx(
      ll,
      {
        hours: i,
        setHours: r,
        extras: sl
      }
    ) }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Tent T + RH (secondary)", icon: "climate", children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "The full climate charts live on the Climate page." }),
        /* @__PURE__ */ s.jsx(
          jn,
          {
            live: !0,
            lastSyncAt: Math.max(d.lastSyncAt ?? 0, h.lastSyncAt ?? 0) || void 0,
            series: [
              {
                id: "t",
                label: "Temp °C",
                series: d.series,
                color: "var(--dsc-blue)",
                axis: "left",
                unit: "°C"
              },
              {
                id: "rh",
                label: "RH %",
                series: h.series,
                color: "var(--dsc-teal)",
                axis: "right",
                unit: "%"
              }
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Root pack — moisture (in service)", icon: "root", children: [
        g.length ? /* @__PURE__ */ s.jsx(
          jn,
          {
            live: !0,
            unit: "%",
            lastSyncAt: Math.max(...g.map((w) => w.series.lastSyncAt ?? 0)) || void 0,
            series: g.map((w, S) => ({
              id: `p${w.n}`,
              label: j?.n === w.n ? `P${w.n} Need` : `P${w.n}`,
              series: w.series.series,
              color: j_[S % j_.length],
              unit: "%"
            }))
          }
        ) : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "No in-service pots." }),
        j ? /* @__PURE__ */ s.jsxs("p", { className: "dsc-kpi-sub", children: [
          "Worst Need P",
          j.n,
          ": ",
          j.need
        ] }) : null
      ] }) })
    ] })
  ] });
}
function x2() {
  const { state: a, available: i, num: r } = Ce(), o = kt(), d = kn(), h = Ed(o), f = Md(h), m = ht("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available: i,
    num: r
  }), _ = (b) => d.open({
    entityId: b.entityId,
    label: b.label,
    kind: "kit",
    runtimeToday: b.runtimeToday,
    cyclesToday: b.cyclesToday,
    demandEntity: b.demandEntity
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Nt,
      {
        icon: "fleet",
        title: "Fleet",
        subtitle: `${f.inService} of ${f.total} devices in service. Device health, tank, and service toggles.`
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(Cd, {}) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(
        St,
        {
          label: "In service",
          value: `${f.inService}/${f.total}`,
          tone: f.dark > 0 ? "bad" : "ok"
        }
      ) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(
        St,
        {
          label: "Surface",
          value: o.surface || a("sensor.dsc_ha_surface_version", "7.2.0"),
          sub: "Panel product shell"
        }
      ) }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-col-4", children: [
        /* @__PURE__ */ s.jsx(
          St,
          {
            label: "Alerts",
            value: Number.isFinite(r("sensor.dsc_active_alert_count")) ? r("sensor.dsc_active_alert_count") : "—",
            tone: r("sensor.dsc_active_alert_count", 0) === 0 ? "ok" : "bad"
          }
        ),
        /* @__PURE__ */ s.jsx(pc, { readings: [m] })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Kit Pulse", icon: "system", children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Grey = offline or out of service. Every device shows its real state." }),
        /* @__PURE__ */ s.jsx(Td, { nodes: h, onSelect: _ })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(le, { className: "dsc-glass", title: "Kit / In service", icon: "settings", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-row", children: [
        /* @__PURE__ */ s.jsx(Ye, { entityId: "input_boolean.dsc_ac_in_service", label: "AC in service", icon: "climate" }),
        /* @__PURE__ */ s.jsx(
          Ye,
          {
            entityId: "input_boolean.dsc_clone_humidifier_in_service",
            label: "Clone mister",
            icon: "clone"
          }
        ),
        /* @__PURE__ */ s.jsx(Ye, { entityId: "input_boolean.dsc_pot1_in_service", label: "Pot 1", icon: "root" }),
        /* @__PURE__ */ s.jsx(Ye, { entityId: "input_boolean.dsc_pot2_in_service", label: "Pot 2", icon: "root" }),
        /* @__PURE__ */ s.jsx(Ye, { entityId: "input_boolean.dsc_pot3_in_service", label: "Pot 3", icon: "root" }),
        /* @__PURE__ */ s.jsx(Ye, { entityId: "input_boolean.dsc_pot4_in_service", label: "Pot 4", icon: "root" }),
        /* @__PURE__ */ s.jsx(Ye, { entityId: "input_boolean.dsc_tank_in_service", label: "Tank", icon: "tank" })
      ] }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Tank", icon: "tank", children: [
        /* @__PURE__ */ s.jsx(b2, {}),
        /* @__PURE__ */ s.jsxs("p", { className: "dsc-kpi-sub", children: [
          "Stage ",
          a("input_select.dsc_tank_stage", "—"),
          " · Type",
          " ",
          a("input_select.dsc_tank_plant_type", "—")
        ] })
      ] }) })
    ] })
  ] });
}
const y2 = ["1", "6", "11"];
function w2(a) {
  const i = a.toLowerCase();
  return i === "hub" ? "system" : i === "panel" || i.includes("control") ? "dash" : i.startsWith("pot") ? "root" : i.includes("tank") ? "tank" : i.includes("mister") || i.includes("clone") ? "clone" : i.includes("hum") || i.includes("heater") || i.includes("ac") ? "climate" : i.includes("fan") || i.includes("intake") || i.includes("exhaust") ? "fan" : i.includes("light") || i.includes("sf1000") ? "lighting" : i.includes("mat") ? "root" : "fleet";
}
function j2(a) {
  return a === "Router" ? "system" : "gauge";
}
function S2(a, i) {
  return i === "hub" ? a.hub : i === "panel" ? a.panel : a.pots[i] ? a.pots[i] : a.sonoffs[i] ? a.sonoffs[i] : null;
}
function k2(a) {
  return a == null || !Number.isFinite(a) ? "—" : new Date(a * 1e3).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
function Aa(a, i) {
  const r = a.extra;
  if (r && typeof r == "object")
    return String(r[i] ?? "");
  if (typeof r == "string" && r)
    try {
      const o = JSON.parse(r);
      return String(o[i] ?? "");
    } catch {
      return "";
    }
  return "";
}
function N2({
  row: a,
  onSave: i
}) {
  const r = String(a.seat_id ?? ""), [o, d] = x.useState(Aa(a, "function")), [h, f] = x.useState(Aa(a, "placement")), [m, _] = x.useState(String(Aa(a, "capability_max_pct") || ""));
  return x.useEffect(() => {
    d(Aa(a, "function")), f(Aa(a, "placement")), _(String(Aa(a, "capability_max_pct") || ""));
  }, [a]), /* @__PURE__ */ s.jsxs("tr", { children: [
    /* @__PURE__ */ s.jsx("td", { children: r }),
    /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("input", { value: o, onChange: (b) => d(b.target.value), placeholder: "e.g. intake_temp" }) }),
    /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("input", { value: h, onChange: (b) => f(b.target.value), placeholder: "e.g. 4x8 intake duct" }) }),
    /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("input", { type: "number", min: "1", max: "100", value: m, onChange: (b) => _(b.target.value), placeholder: "100" }) }),
    /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx(se, { onClick: () => i(r, a, o, h, m), children: "Save" }) })
  ] });
}
function C2({
  row: a,
  seat: i
}) {
  const r = String(a.seat_id ?? "—"), o = String(
    a.role ?? (a.extra && typeof a.extra == "object" ? a.extra.role : "—")
  ), d = i?.online ?? !1, h = !!a.in_service, f = i?.values?.uptime, m = i?.values?.wifi_rssi ?? i?.values?.rssi, _ = Aa(a, "function"), b = Aa(a, "placement");
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-card", children: [
    /* @__PURE__ */ s.jsxs("h3", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
      /* @__PURE__ */ s.jsx(nn, { name: w2(r), size: 16, color: "var(--dsc-teal)" }),
      r,
      /* @__PURE__ */ s.jsx(H, { label: d ? "ONLINE" : "OFFLINE", tone: d ? "ok" : "bad" })
    ] }),
    /* @__PURE__ */ s.jsxs("dl", { className: "dsc-detail-list", children: [
      /* @__PURE__ */ s.jsx("dt", { children: "Role" }),
      /* @__PURE__ */ s.jsx("dd", { children: o }),
      /* @__PURE__ */ s.jsx("dt", { children: "IP / host" }),
      /* @__PURE__ */ s.jsx("dd", { children: String(a.host ?? i?.values?.host ?? "—") }),
      /* @__PURE__ */ s.jsx("dt", { children: "MAC" }),
      /* @__PURE__ */ s.jsx("dd", { children: String(a.mac ?? "—") }),
      /* @__PURE__ */ s.jsx("dt", { children: "Firmware" }),
      /* @__PURE__ */ s.jsx("dd", { children: i?.firmware ?? i?.values?.firmware_version ?? "—" }),
      /* @__PURE__ */ s.jsx("dt", { children: "Uptime" }),
      /* @__PURE__ */ s.jsx("dd", { children: typeof f == "number" ? `${Math.round(f / 60)} min` : "—" }),
      /* @__PURE__ */ s.jsx("dt", { children: "RSSI" }),
      /* @__PURE__ */ s.jsx("dd", { children: m != null ? `${m} dBm` : "—" }),
      /* @__PURE__ */ s.jsx("dt", { children: "Online" }),
      /* @__PURE__ */ s.jsx("dd", { children: d ? "yes" : "no" }),
      /* @__PURE__ */ s.jsx("dt", { children: "In service" }),
      /* @__PURE__ */ s.jsx("dd", { children: h ? "yes" : "no" }),
      /* @__PURE__ */ s.jsx("dt", { children: "Function" }),
      /* @__PURE__ */ s.jsx("dd", { children: _ || "—" }),
      /* @__PURE__ */ s.jsx("dt", { children: "Placement" }),
      /* @__PURE__ */ s.jsx("dd", { children: b || "—" }),
      /* @__PURE__ */ s.jsx("dt", { children: "Last seen" }),
      /* @__PURE__ */ s.jsx("dd", { children: k2(i?.last_seen ?? null) })
    ] })
  ] });
}
function E2() {
  const [a, i] = x.useState({}), [r, o] = x.useState([]), [d, h] = x.useState(null), [f, m] = x.useState(null), [_, b] = x.useState(null), [v, g] = x.useState([]), [j, w] = x.useState([]), [S, N] = x.useState([]), [C, E] = x.useState(""), [z, U] = x.useState(""), [Q, X] = x.useState(""), [F, Z] = x.useState(""), [I, ae] = x.useState(!1), ie = async () => {
    const [M, R, D, q, P, W, k] = await Promise.all([
      _0(),
      g0(),
      Qp(),
      y0(),
      w0(),
      p0().catch(() => null),
      k0().catch(() => ({ devices: [] }))
    ]);
    i(M.settings), o(M.inventory), m(R), b(D), g(q.devices ?? []), w(P), h(W ? Z_(W) : null), N(k.devices ?? []);
  };
  x.useEffect(() => {
    ie().catch(() => {
    });
  }, []);
  const de = async () => {
    await b0(a), await ie();
  }, re = async (M, R) => {
    await Xp(M, { in_service: R }), await ie();
  }, ce = async (M, R, D, q, P) => {
    const W = R.extra && typeof R.extra == "object" ? { ...R.extra } : {};
    W.function = D, W.placement = q, P && (W.capability_max_pct = Number(P)), await Xp(M, { extra: W }), await ie();
  }, oe = x.useMemo(
    () => r.map((M) => ({
      ...M,
      seat: d ? S2(d, String(M.seat_id)) : null
    })),
    [r, d]
  );
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(Nt, { icon: "settings", title: "Settings", subtitle: "DSC-HUB 7.1.0 — Pi appliance" }),
    /* @__PURE__ */ s.jsxs("section", { className: "dsc-card", children: [
      /* @__PURE__ */ s.jsx("h3", { children: "Fleet inventory" }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Every device with its address, firmware, online state, and service status." }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-grid", children: oe.map(({ seat: M, ...R }) => /* @__PURE__ */ s.jsxs("div", { className: "dsc-col-4", children: [
        /* @__PURE__ */ s.jsx(C2, { row: R, seat: M }),
        /* @__PURE__ */ s.jsxs("label", { style: { display: "block", marginTop: 8, fontSize: "0.85rem" }, children: [
          /* @__PURE__ */ s.jsx(
            "input",
            {
              type: "checkbox",
              checked: !!R.in_service,
              onChange: (D) => re(String(R.seat_id), D.target.checked)
            }
          ),
          " ",
          "In service"
        ] })
      ] }, String(R.seat_id))) })
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "dsc-card", children: [
      /* @__PURE__ */ s.jsx("h3", { children: "Device assignment" }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Function and placement tell the brain what each sensor/fan measures. Capability override caps max fan/light output when hardware differs from nameplate." }),
      /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "Seat" }),
          /* @__PURE__ */ s.jsx("th", { children: "Function" }),
          /* @__PURE__ */ s.jsx("th", { children: "Placement" }),
          /* @__PURE__ */ s.jsx("th", { children: "Max %" }),
          /* @__PURE__ */ s.jsx("th", {})
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: r.map((M) => /* @__PURE__ */ s.jsx(N2, { row: M, onSave: ce }, String(M.seat_id))) })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "dsc-card", children: [
      /* @__PURE__ */ s.jsx("h3", { children: "Network" }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Channel is limited to 1, 6, or 11. Applying restarts the hub's Wi-Fi — devices reconnect on their own." }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "AP SSID",
        /* @__PURE__ */ s.jsx(
          "input",
          {
            value: a.ap_ssid ?? "",
            onChange: (M) => i({ ...a, ap_ssid: M.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "AP PSK",
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "password",
            value: a.ap_psk ?? "",
            onChange: (M) => i({ ...a, ap_psk: M.target.value }),
            placeholder: f?.ap_psk_set ? "••••••••" : "set on first save"
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "Channel",
        /* @__PURE__ */ s.jsx(
          "select",
          {
            value: a.ap_channel ?? "6",
            onChange: (M) => i({ ...a, ap_channel: M.target.value }),
            children: y2.map((M) => /* @__PURE__ */ s.jsx("option", { value: M, children: M }, M))
          }
        )
      ] }),
      f?.dhcp_map ? /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "Seat" }),
          /* @__PURE__ */ s.jsx("th", { children: "Host" }),
          /* @__PURE__ */ s.jsx("th", { children: "MAC" })
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: f.dhcp_map.map((M) => /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("td", { children: String(M.seat_id) }),
          /* @__PURE__ */ s.jsx("td", { children: String(M.host ?? "—") }),
          /* @__PURE__ */ s.jsx("td", { children: String(M.mac ?? "—") })
        ] }, String(M.seat_id))) })
      ] }) : null,
      /* @__PURE__ */ s.jsx(se, { variant: "danger", onClick: () => ae(!0), children: "Apply network" }),
      Q ? /* @__PURE__ */ s.jsx("pre", { className: "dsc-honesty", children: Q }) : null,
      /* @__PURE__ */ s.jsx(
        Rt,
        {
          open: I,
          onDismiss: () => ae(!1),
          onConfirm: async () => {
            ae(!1), await de();
            const M = await v0();
            X(JSON.stringify(M, null, 2));
          },
          title: "Apply network settings",
          confirmLabel: "Apply and restart Wi-Fi",
          help: null,
          children: /* @__PURE__ */ s.jsx("p", { children: "Saves the network settings and restarts the hub's Wi-Fi. Devices drop off briefly and reconnect on their own." })
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "dsc-card", children: [
      /* @__PURE__ */ s.jsx("h3", { children: "Integrations" }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "Ollama URL",
        /* @__PURE__ */ s.jsx(
          "input",
          {
            value: a.ollama_base_url ?? "",
            onChange: (M) => i({ ...a, ollama_base_url: M.target.value }),
            placeholder: "http://192.168.86.2:11434"
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "Ollama model",
        /* @__PURE__ */ s.jsx(
          "input",
          {
            value: a.ollama_model ?? "",
            onChange: (M) => i({ ...a, ollama_model: M.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ s.jsx(se, { onClick: async () => E(JSON.stringify(await j0())), children: "Test Ollama" }),
      C ? /* @__PURE__ */ s.jsx("pre", { className: "dsc-honesty", children: C }) : null,
      /* @__PURE__ */ s.jsxs("label", { children: [
        "CannaLib API URL",
        /* @__PURE__ */ s.jsx(
          "input",
          {
            value: a.cannalib_api_url ?? "",
            onChange: (M) => i({ ...a, cannalib_api_url: M.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "CannaLib API key",
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "password",
            value: a.cannalib_api_key ?? "",
            onChange: (M) => i({ ...a, cannalib_api_key: M.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "checkbox",
            checked: (a.cannalib_use_local_fallback ?? "true") === "true",
            onChange: (M) => i({
              ...a,
              cannalib_use_local_fallback: M.target.checked ? "true" : "false"
            })
          }
        ),
        "Use on-Pi sqlite fallback when remote API is down"
      ] }),
      /* @__PURE__ */ s.jsx(se, { onClick: async () => U(JSON.stringify(await S0())), children: "Test CannaLib" }),
      z ? /* @__PURE__ */ s.jsx("pre", { className: "dsc-honesty", children: z }) : null
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "dsc-card", children: [
      /* @__PURE__ */ s.jsx("h3", { children: "Catalog" }),
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
        _ ? String(_.note ?? "—") : "Loading…",
        " (source:",
        " ",
        _ ? String(_.source ?? "unknown") : "—",
        ")"
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Chemistry, height, and lineage come straight from the catalog — gaps are never filled with guesses." }),
      /* @__PURE__ */ s.jsx(se, { onClick: async () => b(await Qp()), children: "Refresh status" }),
      /* @__PURE__ */ s.jsx(se, { onClick: async () => x0(), children: "Reload local catalogs" })
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "dsc-card", children: [
      /* @__PURE__ */ s.jsx("h3", { children: "ESPHome" }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Updates are sent over the air. One build runs at a time, and nothing is flashed unless you queue it." }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Pot 5 and beyond are unavailable until their firmware exists." }),
      /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "Seat" }),
          /* @__PURE__ */ s.jsx("th", { children: "YAML" }),
          /* @__PURE__ */ s.jsx("th", { children: "Expected" }),
          /* @__PURE__ */ s.jsx("th", { children: "Last seen" }),
          /* @__PURE__ */ s.jsx("th", {})
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: v.map((M) => /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("td", { children: String(M.seat_id) }),
          /* @__PURE__ */ s.jsx("td", { children: String(M.yaml ?? "—") }),
          /* @__PURE__ */ s.jsx("td", { children: String(M.expected_firmware ?? "—") }),
          /* @__PURE__ */ s.jsx("td", { children: M.online ? String(M.last_firmware ?? "online") : "offline" }),
          /* @__PURE__ */ s.jsxs("td", { children: [
            /* @__PURE__ */ s.jsx(se, { onClick: () => Zp(String(M.seat_id), "ota").then(ie), children: "Queue OTA" }),
            /* @__PURE__ */ s.jsx(se, { onClick: () => Zp(String(M.seat_id), "compile").then(ie), children: "Queue compile" })
          ] })
        ] }, String(M.seat_id))) })
      ] }),
      j.length ? /* @__PURE__ */ s.jsx("pre", { className: "dsc-honesty", children: JSON.stringify(j.slice(0, 3), null, 2) }) : null
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "dsc-card", children: [
      /* @__PURE__ */ s.jsx("h3", { children: "Zigbee (SkyConnect)" }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Extra canopy sensors and smart plugs — separate from climate control." }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", children: [
        /* @__PURE__ */ s.jsx(se, { onClick: () => Kp(!0).then(ie), children: "Permit join (2 min)" }),
        /* @__PURE__ */ s.jsx(se, { onClick: () => Kp(!1).then(ie), children: "Stop join" })
      ] }),
      S.length ? /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", style: { marginTop: 12 }, children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "Name" }),
          /* @__PURE__ */ s.jsx("th", { children: "IEEE" }),
          /* @__PURE__ */ s.jsx("th", { children: "Type" }),
          /* @__PURE__ */ s.jsx("th", { children: "Model" })
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: S.filter((M) => M.type !== "Coordinator").map((M) => /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsxs("td", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
            /* @__PURE__ */ s.jsx(nn, { name: j2(String(M.type ?? "")), size: 14, color: "var(--dsc-gray-5)" }),
            String(M.friendly_name ?? "—")
          ] }),
          /* @__PURE__ */ s.jsx("td", { children: String(M.ieee_address ?? "—") }),
          /* @__PURE__ */ s.jsx("td", { children: String(M.type ?? "—") }),
          /* @__PURE__ */ s.jsxs("td", { children: [
            String(M.vendor ?? ""),
            M.model ? ` ${String(M.model)}` : ""
          ] })
        ] }, String(M.ieee_address ?? M.friendly_name))) })
      ] }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 10 }, children: "No Zigbee devices reported yet — enable permit join, then refresh." })
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "dsc-card", children: [
      /* @__PURE__ */ s.jsx("h3", { children: "Backup" }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Export ops sqlite, manifest, optional .env and z2m data." }),
      /* @__PURE__ */ s.jsx("a", { className: "dsc-button", href: N0(), download: "dsc-hub-backup.zip", children: "Download backup" }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "Import backup",
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "file",
            accept: ".zip",
            onChange: async (M) => {
              const R = M.target.files?.[0];
              R && Z(JSON.stringify(await C0(R)));
            }
          }
        )
      ] }),
      F ? /* @__PURE__ */ s.jsx("pre", { className: "dsc-honesty", children: F }) : null
    ] }),
    /* @__PURE__ */ s.jsx(se, { primary: !0, onClick: de, children: "Save settings" })
  ] });
}
function Lb(a) {
  return !Number.isFinite(a) || a <= 0 ? "—" : a >= 86400 ? `${(a / 86400).toFixed(1)}d` : a >= 3600 ? `${(a / 3600).toFixed(1)}h` : `${Math.round(a / 60)}m`;
}
function S_(a, i, r) {
  return !Number.isFinite(a) || !Number.isFinite(i) || !Number.isFinite(r) ? "?—" : a < i ? `↓ low ${(a - i).toFixed(2)}` : a > r ? `↑ high +${(a - r).toFixed(2)}` : "→ on target";
}
function M2({
  hubOnline: a,
  panelOk: i,
  panelHaOnly: r,
  panelOffline: o,
  heartbeat: d,
  beatOk: h,
  uptimeSec: f,
  alerts: m,
  fleetStatus: _,
  fleetExpected: b,
  cannalibOnline: v,
  cannalibHits: g,
  cannalibSummary: j,
  inServiceLabel: w,
  activeFaultCount: S,
  onChip: N
}) {
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-status-strip", children: [
    /* @__PURE__ */ s.jsx(H, { icon: a ? "ok" : "alert", label: a ? "HUB ONLINE" : "HUB OFFLINE", tone: a ? "ok" : "bad", onClick: () => N?.("sensor.dsc_hub_uptime", "Hub") }),
    /* @__PURE__ */ s.jsx(
      H,
      {
        label: i ? "PANEL LINKED" : r ? "PANEL LIMITED LINK" : o ? "PANEL OFFLINE" : "PANEL…",
        tone: i ? "ok" : r ? "warn" : "bad",
        onClick: () => N?.("binary_sensor.dsc_hub_panel_link", "Panel")
      }
    ),
    /* @__PURE__ */ s.jsx(H, { icon: h ? "ok" : "alert", label: h ? `BEAT ${d}` : "NO BEAT", tone: h ? "ok" : "bad", onClick: () => N?.("sensor.dsc_hub_heartbeat", "Beat") }),
    /* @__PURE__ */ s.jsx(H, { label: Lb(f), tone: a ? "ok" : "muted" }),
    /* @__PURE__ */ s.jsx(
      H,
      {
        icon: S === 0 ? "ok" : "alert",
        label: S === 0 ? "All clear" : `${S} alert(s)`,
        tone: S === 0 ? "ok" : "bad",
        pulse: S > 0,
        onClick: () => N?.("sensor.dsc_active_alert_count", "Alerts")
      }
    ),
    /* @__PURE__ */ s.jsx(
      H,
      {
        label: _ === "ok" ? `FLEET ${b}` : "FLEET DRIFT",
        tone: _ === "ok" ? "ok" : "warn",
        onClick: () => N?.("sensor.dsc_fleet_version_status", "Fleet")
      }
    ),
    /* @__PURE__ */ s.jsx(
      H,
      {
        label: v ? `CANNALIB ${g} hits` : "CANNALIB OFF",
        tone: v ? "ok" : "bad",
        onClick: () => N?.("sensor.dsc_cannalib_api_hits", "Cannalib")
      }
    ),
    /* @__PURE__ */ s.jsx(H, { label: v ? j : "— MB", tone: "muted" }),
    /* @__PURE__ */ s.jsx(H, { label: w, tone: "muted" })
  ] });
}
function T2({ bus: a }) {
  const { num: i, available: r } = a, o = a.state("binary_sensor.dsc_cannalib_api_online") === "on", d = [
    { label: "Hits", id: "sensor.dsc_cannalib_api_hits", fmt: (h) => String(Math.round(h)) },
    { label: "Bandwidth in", id: "sensor.dsc_cannalib_bytes_in", fmt: (h) => `${(h / 1024).toFixed(1)} KB` },
    { label: "Bandwidth out", id: "sensor.dsc_cannalib_bytes_out", fmt: (h) => `${(h / 1024).toFixed(1)} KB` },
    { label: "Corpus strains", id: "sensor.dsc_cannalib_corpus_strains", fmt: (h) => String(Math.round(h)) }
  ];
  return /* @__PURE__ */ s.jsx(le, { className: "dsc-glass", title: "Cannalib catalog API", icon: "research", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: d.map((h) => /* @__PURE__ */ s.jsx(
    St,
    {
      label: h.label,
      value: o && r(h.id) ? h.fmt(i(h.id, 0)) : "—",
      tone: o ? "ok" : "muted"
    },
    h.id
  )) }) });
}
function $b({ bus: a, onNavigate: i }) {
  const { state: r, entity: o } = a, d = [];
  if (r("binary_sensor.dsc_reduced_kit") === "on") {
    const h = o("binary_sensor.dsc_reduced_kit")?.attributes || {};
    d.push({
      show: !0,
      title: "Capacity offline",
      body: `${h.offline || "a device is unavailable"} — automation is using the next-best available equipment. Devices deliberately out of service (${h.planned_oos || "—"}) are not counted here.`,
      tone: "warn"
    });
  }
  return r("switch.dsc_hub_manual_takeover") === "on" && d.push({ show: !0, title: "MANUAL CONTROL ACTIVE", body: "Automation is paused — the hub only follows manual commands", tone: "warn" }), r("switch.dsc_hub_tent_manual_override") === "on" && d.push({ show: !0, title: "MANUAL FAN OVERRIDE ACTIVE", body: "Fan values held — photoperiod still driving the SF1000", tone: "warn" }), r("binary_sensor.dsc_clone_dark_period_violation") === "on" && d.push({ show: !0, title: "LIGHT ON IN 2x4 DARK PERIOD", body: "SF1000 commanded on outside the clone window — herm risk", tone: "bad" }), r("binary_sensor.dsc_hub_root_zone_sensor_fault") === "on" && d.push({ show: !0, title: "ROOT-ZONE PROBES OFFLINE", body: "Grow mat fell back to clone-air control (v2.3 behaviour)", tone: "warn" }), d.length ? /* @__PURE__ */ s.jsx("div", { className: "dsc-stack", children: d.map((h) => /* @__PURE__ */ s.jsxs("div", { className: `dsc-banner dsc-banner--${h.tone}`, children: [
    /* @__PURE__ */ s.jsx("strong", { children: h.title }),
    /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: h.body }),
    h.title === "Capacity offline" ? /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-chip", onClick: () => i("/live/climate"), children: "Open Climate" }) : null
  ] }, h.title)) }) : null;
}
function R2({ bus: a, onNavigate: i }) {
  return /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: [1, 2, 3, 4].map((r) => {
    const o = a.state(`binary_sensor.dsc_hub_pot${r}_esp_now_link`) === "on";
    return /* @__PURE__ */ s.jsx(
      H,
      {
        label: `P${r} ${o ? "direct" : "fallback"}`,
        tone: o ? "ok" : "muted",
        onClick: () => i("/live/root")
      },
      r
    );
  }) });
}
function Ub({ bus: a }) {
  const { state: i, num: r } = a, o = r("sensor.dsc_coldest_root_zone_temp", NaN), d = String(a.entity("sensor.dsc_coldest_root_zone_temp")?.attributes?.pot || ""), h = a.entity("light.dsc_hub_sf1000_dimmer"), f = Math.round(Number(h?.attributes?.brightness ?? 0) / 255 * 100), m = i("light.dsc_hub_sf1000_dimmer") === "on" && f >= 1, _ = f, b = i("binary_sensor.dsc_ac_capacity_offline") === "on", v = i("binary_sensor.dsc_clone_humidifier_capacity_offline") === "on", g = !a.available("switch.dsc_de_humidifier_main_relay"), j = i("binary_sensor.dsc_hub_root_zone_sensor_fault") === "on", w = i("binary_sensor.dsc_clone_dark_period_violation") === "on", S = [
    { label: "Heat", icon: "climate", on: i("switch.dsc_hub_heater_demand") === "on", tone: i("switch.dsc_hub_heater_demand") === "on" ? "ok" : "muted" },
    { label: b ? "Cool ○" : "Cool", icon: "climate", on: i("switch.dsc_hub_ac_demand") === "on", tone: b ? "warn" : i("switch.dsc_hub_ac_demand") === "on" ? "ok" : "muted" },
    { label: "Hum", icon: "tank", on: i("switch.dsc_hub_humidifier_demand") === "on", tone: i("switch.dsc_hub_humidifier_demand") === "on" ? "ok" : "muted" },
    { label: g ? "Dehum offline" : "Dehum", icon: "tank", on: i("switch.dsc_hub_dehumidifier_demand") === "on", tone: g ? "bad" : i("switch.dsc_hub_dehumidifier_demand") === "on" ? "ok" : "muted" },
    {
      label: Number.isFinite(o) ? `Mat ${o.toFixed(1)}°C${d && d !== "none" ? ` P${d}` : ""}` : "Mat",
      icon: "root",
      on: i("switch.dsc_hub_grow_mat_demand") === "on",
      tone: j ? "bad" : i("switch.dsc_hub_grow_mat_demand") === "on" ? "ok" : "muted"
    },
    { label: v ? "C-Hum ○" : "C-Hum", icon: "clone", on: i("switch.dsc_hub_clone_humidifier_demand") === "on", tone: v ? "warn" : i("switch.dsc_hub_clone_humidifier_demand") === "on" ? "ok" : "muted" },
    { label: m ? `SF ${_}%` : "SF1000", icon: "lighting", on: m, tone: w ? "bad" : m ? "ok" : "muted" }
  ];
  return /* @__PURE__ */ s.jsx(le, { className: "dsc-glass", title: "Running", icon: "lighting", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: S.map((N) => /* @__PURE__ */ s.jsx(H, { label: N.label, icon: N.icon, tone: N.tone, motion: N.on ? "duty" : void 0 }, N.label)) }) });
}
function Bb({ bus: a, onNavigate: i }) {
  const r = [
    ["IN 4×8", "sensor.dsc_fan_intake_main_pct"],
    ["IN 2×4", "sensor.dsc_fan_intake_2x4_pct"],
    ["EX ROOM", "sensor.dsc_fan_exhaust_room_pct"],
    ["EX OUT", "sensor.dsc_fan_exhaust_outside_pct"]
  ];
  return /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: r.map(([o, d]) => {
    const h = Math.round(a.num(d, 0));
    return /* @__PURE__ */ s.jsx(
      H,
      {
        label: `${o} ${h}%`,
        tone: h > 0 ? "ok" : "muted",
        motion: h > 0 ? "fan" : void 0,
        onClick: () => i("/live/climate")
      },
      d
    );
  }) });
}
function Br(a, i) {
  const r = Number(a);
  if (Number.isFinite(r)) return r.toFixed(1);
  const o = Number(i);
  return Number.isFinite(o) ? o.toFixed(1) : a;
}
function A2({ bus: a, onNavigate: i }) {
  const { state: r, num: o } = a, d = r("select.dsc_hub_clone_mode") === "Follow 4x8", h = r("select.dsc_hub_priority_tent", "—"), f = r("switch.dsc_hub_manual_takeover") === "on" ? "Takeover" : r("switch.dsc_hub_tent_manual_override") === "on" ? "Fan override" : r("switch.dsc_hub_tent_full_auto_mode") === "on" ? "Full Auto" : "Standby", m = Br(r("sensor.dsc_hub_tent_temperature", "—"), o("sensor.dsc_hub_tent_temperature", NaN)), _ = Br(r("sensor.dsc_hub_tent_humidity", "—"), o("sensor.dsc_hub_tent_humidity", NaN)), b = o("sensor.dsc_hub_vpd_kpa", NaN), v = Br(r("sensor.dsc_hub_clone_temperature", "—"), o("sensor.dsc_hub_clone_temperature", NaN)), g = Br(r("sensor.dsc_hub_clone_humidity", "—"), o("sensor.dsc_hub_clone_humidity", NaN)), j = o("sensor.dsc_hub_clone_vpd_kpa", NaN), w = d ? o("number.dsc_hub_vpd_target_min", 0.8) : o("number.dsc_hub_clone_vpd_min", 0.6), S = d ? o("number.dsc_hub_vpd_target_max", 1.4) : o("number.dsc_hub_clone_vpd_max", 1.2), N = [
    ["Hum", "sensor.dsc_hub_humidifier_fire_countdown", "switch.dsc_hub_humidifier_demand"],
    ["Dehum", "sensor.dsc_hub_dehumidifier_fire_countdown", "switch.dsc_hub_dehumidifier_demand"],
    ["Heat", "sensor.dsc_hub_heater_fire_countdown", "switch.dsc_hub_heater_demand"],
    ["AC", "sensor.dsc_hub_ac_fire_countdown", "switch.dsc_hub_ac_demand"],
    ["Mat", "sensor.dsc_hub_grow_mat_fire_countdown", "switch.dsc_hub_grow_mat_demand"]
  ], C = Math.round(a.num("sensor.dsc_fan_exhaust_outside_pct", 0)), E = Math.round(a.num("sensor.dsc_fan_exhaust_room_pct", 0));
  return /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Operational now", icon: "climate", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 10 }, children: [
      /* @__PURE__ */ s.jsx(H, { label: r("select.dsc_hub_grow_stage", "—"), tone: "ok" }),
      /* @__PURE__ */ s.jsx(H, { label: r("select.dsc_hub_clone_mode", "—"), tone: "ok" }),
      /* @__PURE__ */ s.jsx(H, { label: r("select.dsc_hub_control_strategy", "—"), tone: "muted" }),
      /* @__PURE__ */ s.jsx(H, { label: `Priority ${h}`, tone: "muted" }),
      /* @__PURE__ */ s.jsx(H, { label: f, tone: f === "Full Auto" ? "ok" : f === "Standby" ? "muted" : "warn" })
    ] }),
    /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { fontSize: 13, lineHeight: 1.5 }, children: [
      /* @__PURE__ */ s.jsx("strong", { children: "4×8" }),
      " ",
      m,
      "°C / ",
      _,
      "% / VPD ",
      Number.isFinite(b) ? b.toFixed(2) : "—",
      " (",
      S_(b, o("number.dsc_hub_vpd_target_min", 0.8), o("number.dsc_hub_vpd_target_max", 1.4)),
      ") · band",
      " ",
      r("number.dsc_hub_vpd_target_min"),
      "–",
      r("number.dsc_hub_vpd_target_max"),
      /* @__PURE__ */ s.jsx("br", {}),
      /* @__PURE__ */ s.jsx("strong", { children: "2×4" }),
      " ",
      v,
      "°C / ",
      g,
      "% / VPD ",
      Number.isFinite(j) ? j.toFixed(2) : "—",
      d ? " (follows 4×8 bands)" : "",
      " (",
      S_(j, w, S),
      ")",
      /* @__PURE__ */ s.jsx("br", {}),
      "Room appliances chase ",
      /* @__PURE__ */ s.jsx("strong", { children: h }),
      " bands."
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginTop: 10 }, children: [
      N.map(([z, U, Q]) => {
        const X = r(Q) === "on", F = Math.round(a.num(U, 0)), Z = X ? `${z} live` : F > 0 ? `${z} ${F}s` : `${z} idle`;
        return /* @__PURE__ */ s.jsx(
          H,
          {
            label: Z,
            tone: X ? "ok" : F > 0 ? "warn" : "muted",
            motion: X ? "duty" : F > 0 ? "breathe" : void 0,
            onClick: () => i("/live/climate")
          },
          U
        );
      }),
      /* @__PURE__ */ s.jsx(
        H,
        {
          label: `Fans ${C}/${E}%`,
          tone: C > 0 || E > 0 ? "ok" : "muted",
          motion: C > 0 || E > 0 ? "fan" : void 0,
          onClick: () => i("/live/climate")
        }
      )
    ] })
  ] });
}
function In({
  entityId: a,
  zone: i,
  gauge: r,
  value: o,
  band: d,
  stale: h,
  unit: f
}) {
  const { points: m } = kd(a, 24, 96), _ = di({
    value: o,
    band: d,
    margin: hc(d, f),
    stale: !!(h && Number.isFinite(o)),
    available: Number.isFinite(o)
  });
  return /* @__PURE__ */ s.jsxs("div", { className: `dsc-band-cell${i ? ` dsc-band-cell--${i}` : ""}`, children: [
    r,
    /* @__PURE__ */ s.jsx(Nb, { series: m, color: Sd(_), width: 110, height: 26 })
  ] });
}
const z2 = [
  { id: "compare", label: "All" },
  { id: "main", label: "4×8" },
  { id: "clone", label: "2×4" },
  { id: "room", label: "Room" }
];
function Fb({
  readings: a,
  onChartOpen: i
}) {
  const r = a, { focus: o, setFocus: d } = Nd(), h = (f) => o === "compare" || o === f ? "dsc-gauge-row-3 is-lit" : "dsc-gauge-row-3";
  return /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Bands", icon: "gauge", children: [
    /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { fontSize: 12, margin: "0 0 10px" }, children: "Green = in band · amber = drifting · red = alert · grey = no data" }),
    /* @__PURE__ */ s.jsx("div", { className: "dsc-tent-segment", style: { marginBottom: 10 }, children: z2.map((f) => /* @__PURE__ */ s.jsx(
      "button",
      {
        type: "button",
        className: o === f.id ? "is-active" : "",
        "data-tent": f.id === "main" ? "main" : f.id === "clone" ? "clone" : f.id === "compare" ? "compare" : "room",
        onClick: () => d(f.id),
        children: f.label
      },
      f.id
    )) }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-gauge-matrix dsc-gauge-matrix--bands", children: [
      /* @__PURE__ */ s.jsxs("div", { className: h("main"), children: [
        /* @__PURE__ */ s.jsx("span", { className: "dsc-gauge-row-tag", children: "4×8" }),
        /* @__PURE__ */ s.jsx(
          In,
          {
            entityId: "sensor.dsc_hub_tent_temperature",
            zone: "main",
            value: r.tentT,
            band: { min: r.targetTemp - 2, max: r.targetTemp + 2 },
            stale: r.stale.tentT,
            unit: "°C",
            gauge: /* @__PURE__ */ s.jsx(Xe, { label: "4×8 T", value: r.tentT, min: 10, max: 40, unit: "°C", target: r.targetTemp, band: { min: r.targetTemp - 2, max: r.targetTemp + 2 }, segments: ai(r.targetTemp), stale: r.stale.tentT, onClick: () => i("temp") })
          }
        ),
        /* @__PURE__ */ s.jsx(
          In,
          {
            entityId: "sensor.dsc_hub_tent_humidity",
            zone: "main",
            value: r.tentRh,
            band: { min: r.rhMin, max: r.rhMax },
            stale: r.stale.tentRh,
            gauge: /* @__PURE__ */ s.jsx(Xe, { label: "4×8 RH", value: r.tentRh, min: 0, max: 100, unit: "%", band: { min: r.rhMin, max: r.rhMax }, segments: si(r.rhMin, r.rhMax), stale: r.stale.tentRh, onClick: () => i("rh") })
          }
        ),
        /* @__PURE__ */ s.jsx(
          In,
          {
            entityId: "sensor.dsc_hub_vpd_kpa",
            zone: "main",
            value: r.tentVpd,
            band: { min: r.vpdMin, max: r.vpdMax },
            stale: r.stale.tentVpd,
            gauge: /* @__PURE__ */ s.jsx(Xe, { label: "4×8 VPD", value: r.tentVpd, min: 0, max: 2.5, unit: "kPa", band: { min: r.vpdMin, max: r.vpdMax }, segments: nc(r.vpdMin, r.vpdMax), stale: r.stale.tentVpd, onClick: () => i("vpd") })
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: h("clone"), children: [
        /* @__PURE__ */ s.jsx("span", { className: "dsc-gauge-row-tag", children: "2×4" }),
        /* @__PURE__ */ s.jsx(
          In,
          {
            entityId: "sensor.dsc_hub_clone_temperature",
            zone: "clone",
            value: r.cloneT,
            band: { min: r.cloneTargetTemp - 2, max: r.cloneTargetTemp + 2 },
            stale: r.stale.cloneT,
            unit: "°C",
            gauge: /* @__PURE__ */ s.jsx(Xe, { label: "2×4 T", value: r.cloneT, min: 10, max: 40, unit: "°C", target: r.cloneTargetTemp, band: { min: r.cloneTargetTemp - 2, max: r.cloneTargetTemp + 2 }, segments: ai(r.cloneTargetTemp), stale: r.stale.cloneT, onClick: () => i("temp") })
          }
        ),
        /* @__PURE__ */ s.jsx(
          In,
          {
            entityId: "sensor.dsc_hub_clone_humidity",
            zone: "clone",
            value: r.cloneRh,
            band: { min: r.cloneRhMin, max: r.cloneRhMax },
            stale: r.stale.cloneRh,
            gauge: /* @__PURE__ */ s.jsx(Xe, { label: "2×4 RH", value: r.cloneRh, min: 0, max: 100, unit: "%", band: { min: r.cloneRhMin, max: r.cloneRhMax }, segments: si(r.cloneRhMin, r.cloneRhMax), stale: r.stale.cloneRh, onClick: () => i("rh") })
          }
        ),
        /* @__PURE__ */ s.jsx(
          In,
          {
            entityId: "sensor.dsc_hub_clone_vpd_kpa",
            zone: "clone",
            value: r.cloneVpd,
            band: { min: r.cloneVpdMin, max: r.cloneVpdMax },
            stale: r.stale.cloneVpd,
            gauge: /* @__PURE__ */ s.jsx(Xe, { label: "2×4 VPD", value: r.cloneVpd, min: 0, max: 2, unit: "kPa", band: { min: r.cloneVpdMin, max: r.cloneVpdMax }, segments: nc(r.cloneVpdMin, r.cloneVpdMax), stale: r.stale.cloneVpd, onClick: () => i("vpd") })
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: h("room"), children: [
        /* @__PURE__ */ s.jsx("span", { className: "dsc-gauge-row-tag", children: "Room" }),
        /* @__PURE__ */ s.jsx(
          In,
          {
            entityId: "sensor.dsc_hub_room_temperature",
            zone: "room",
            value: r.roomT,
            band: { min: r.targetTemp - 2, max: r.targetTemp + 2 },
            stale: r.stale.roomT,
            unit: "°C",
            gauge: /* @__PURE__ */ s.jsx(Xe, { label: "Room T", value: r.roomT, min: 10, max: 40, unit: "°C", target: r.targetTemp, band: { min: r.targetTemp - 2, max: r.targetTemp + 2 }, segments: ai(r.targetTemp), stale: r.stale.roomT, onClick: () => i("temp") })
          }
        ),
        /* @__PURE__ */ s.jsx(
          In,
          {
            entityId: "sensor.dsc_hub_room_humidity",
            zone: "room",
            value: r.roomRh,
            band: { min: r.rhMin, max: r.rhMax },
            stale: r.stale.roomRh,
            gauge: /* @__PURE__ */ s.jsx(Xe, { label: "Room RH", value: r.roomRh, min: 0, max: 100, unit: "%", band: { min: r.rhMin, max: r.rhMax }, segments: si(r.rhMin, r.rhMax), stale: r.stale.roomRh, onClick: () => i("rh") })
          }
        ),
        /* @__PURE__ */ s.jsx(
          In,
          {
            entityId: "sensor.dsc_coldest_root_zone_temp",
            zone: "root",
            value: r.rootT,
            band: { min: r.matLo, max: r.matHi },
            stale: r.stale.rootT,
            unit: "°C",
            gauge: /* @__PURE__ */ s.jsx(Xe, { label: "Root", value: r.rootT, min: 10, max: 32, unit: "°C", band: { min: r.matLo, max: r.matHi }, segments: s2(r.matLo, r.matHi), stale: r.stale.rootT, onClick: () => i("root") })
          }
        )
      ] })
    ] })
  ] });
}
function O2({ bus: a }) {
  const { num: i, state: r } = a, o = Math.round(i("sensor.dsc_humidifier_cycles_last_hour", 0)), d = o > 6 ? "bad" : o > 3 ? "warn" : "ok";
  return /* @__PURE__ */ s.jsx(le, { className: "dsc-glass", title: "Today", icon: "lighting", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
    /* @__PURE__ */ s.jsx(
      H,
      {
        label: `4×8 ${i("sensor.dsc_lights_on_today_4x8", 0).toFixed(1)}h / ${Math.round(i("sensor.dsc_expected_light_hours", 12))}h`,
        tone: r("binary_sensor.dsc_hub_4x8_window_open") === "on" ? "ok" : "muted",
        onClick: () => {
        }
      }
    ),
    /* @__PURE__ */ s.jsx(
      H,
      {
        label: `2×4 ${i("sensor.dsc_lights_on_today_2x4", 0).toFixed(1)}h / ${Math.round(i("sensor.dsc_clone_expected_light_hours", 12))}h`,
        tone: r("binary_sensor.dsc_clone_dark_period_violation") === "on" ? "bad" : "ok"
      }
    ),
    /* @__PURE__ */ s.jsx(H, { label: `Heat ${i("sensor.dsc_heater_runtime_today", 0).toFixed(1)}h`, tone: r("switch.dsc_hub_heater_demand") === "on" ? "ok" : "muted" }),
    /* @__PURE__ */ s.jsx(H, { label: `Hum ${o}/h`, tone: d })
  ] }) });
}
function Gb({
  bus: a,
  rosterSlots: i,
  onNavigate: r,
  onPot: o,
  onPotChart: d
}) {
  const { state: h, num: f } = a, m = { min: 30, max: 70 };
  return /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Root & tank", icon: "root", children: [
    /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: [1, 2, 3, 4].map((_) => {
      const b = h(`text.dsc_pot${_}_plant_name`, "—"), v = !b || b === "unknown" || b === "unavailable" ? "—" : b;
      return /* @__PURE__ */ s.jsx(H, { label: `P${_} ${v}`, tone: v === "—" ? "muted" : "ok", onClick: () => o(_) }, _);
    }) }),
    i.some((_) => _.pot && _.pot !== "none") ? /* @__PURE__ */ s.jsx("div", { className: "dsc-muted", style: { fontSize: 13, margin: "8px 0" }, children: ["1", "2", "3", "4"].map((_) => {
      const b = i.find((v) => String(v.pot) === _);
      return b ? /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsxs("strong", { children: [
          "POT",
          _,
          " roster:"
        ] }),
        " ",
        b.nickname || b.strain || `slot ${b.slot}`,
        b.blend ? ` · ${b.blend}` : ""
      ] }, _) : null;
    }) }) : null,
    /* @__PURE__ */ s.jsx("div", { className: "dsc-gauge-matrix dsc-gauge-matrix--pots", children: [1, 2, 3, 4].map((_) => /* @__PURE__ */ s.jsx(
      Xe,
      {
        label: `P${_}`,
        value: f(`sensor.dsc_pot${_}_soil_moisture`, NaN),
        min: 0,
        max: 100,
        unit: "%",
        band: m,
        segments: sd(30, 70),
        onClick: () => d(`pot${_}`)
      },
      _
    )) }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginTop: 10 }, children: [
      a.available("sensor.water_tester_ph_current") ? /* @__PURE__ */ s.jsx(H, { label: `pH ${h("sensor.water_tester_ph_current")}`, tone: "ok", onClick: () => r("/fleet") }) : null,
      /* @__PURE__ */ s.jsx(H, { label: `EC ${h("sensor.dsc_tank_ec_normalized", "—")}`, tone: "muted" }),
      a.available("sensor.water_tester_temperature") ? /* @__PURE__ */ s.jsx(
        H,
        {
          label: `${h("sensor.water_tester_temperature")}°C${f("sensor.water_tester_temperature", 0) > 24 ? " ⚠ PYTHIUM" : ""}`,
          tone: f("sensor.water_tester_temperature", 0) > 24 ? "bad" : "ok"
        }
      ) : null,
      /* @__PURE__ */ s.jsx(H, { label: "Open Root Zone", tone: "ok", onClick: () => r("/live/root") })
    ] })
  ] });
}
function Vb({ bus: a }) {
  const { state: i } = a, [r, o] = x.useState([]), [d, h] = x.useState(!0);
  x.useEffect(() => {
    let m = !1;
    const _ = () => {
      h0(24, 80).then((v) => {
        m || (o(v), h(!1));
      });
    };
    _();
    const b = window.setInterval(_, 45e3);
    return () => {
      m = !0, window.clearInterval(b);
    };
  }, [i("select.dsc_hub_grow_stage"), i("switch.dsc_hub_dehumidifier_demand")]);
  const f = [
    i("select.dsc_hub_grow_stage") !== "—" ? `Stage · ${i("select.dsc_hub_grow_stage")}` : null,
    i("binary_sensor.dsc_clone_dark_period_violation") === "on" ? "Dark period violation" : null
  ].filter(Boolean);
  return /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Grow log", icon: "roster", children: [
    d && r.length === 0 ? /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Loading…" }) : null,
    r.length ? /* @__PURE__ */ s.jsx("ul", { className: "dsc-grow-log", children: r.map((m) => /* @__PURE__ */ s.jsxs("li", { children: [
      /* @__PURE__ */ s.jsx("time", { className: "dsc-muted", dateTime: new Date(m.ts * 1e3).toISOString(), children: new Date(m.ts * 1e3).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }),
      " ",
      m.message
    ] }, m.id)) }) : f.length ? /* @__PURE__ */ s.jsx("ul", { className: "dsc-grow-log", children: f.map((m) => /* @__PURE__ */ s.jsx("li", { children: m }, m)) }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "No operational events yet today." })
  ] });
}
function qb(a, i) {
  return Eb.filter((r) => a(r) === "on" && !i(r));
}
function D2() {
  const a = Ce(), { num: i, state: r, entity: o, tick: d } = a, h = kt(), f = ft(), { isSnoozed: m } = fc(), _ = kn(), b = Ab(), v = (W) => b.open({ kind: W, title: zb[W] }), g = i("sensor.dsc_active_alert_count", 0), j = qb(r, m), w = _e("sensor.dsc_hub_tent_temperature"), S = _e("sensor.dsc_hub_tent_humidity"), N = _e("sensor.dsc_hub_vpd_kpa"), C = _e("sensor.dsc_hub_clone_temperature"), E = _e("sensor.dsc_hub_clone_humidity"), z = _e("sensor.dsc_hub_clone_vpd_kpa"), U = _e("sensor.dsc_hub_room_temperature"), Q = _e("sensor.dsc_hub_room_humidity"), X = _e("sensor.dsc_coldest_root_zone_temp"), F = i("number.dsc_hub_target_temp", 25), Z = i("number.dsc_hub_rh_target_min", 45), I = i("number.dsc_hub_rh_target_max", 70), ae = i("number.dsc_hub_vpd_target_min", 0.8), ie = i("number.dsc_hub_vpd_target_max", 1.4), de = i("number.dsc_hub_clone_target_temp", 24), re = i("number.dsc_hub_clone_rh_min", 55), ce = i("number.dsc_hub_clone_rh_max", 75), oe = i("number.dsc_hub_clone_vpd_min", 0.6), M = i("number.dsc_hub_clone_vpd_max", 1.2), R = i("number.dsc_hub_mat_root_zone_low", 20), D = i("number.dsc_hub_mat_root_zone_high", 24), q = o("sensor.dsc_plant_roster_summary")?.attributes?.slots || [], P = (W) => {
    window.dispatchEvent(new CustomEvent("dsc-dash-select-pot", { detail: { pot: W } })), f("/live/root");
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page dsc-dash-home", children: [
    /* @__PURE__ */ s.jsx(
      Nt,
      {
        icon: "home",
        title: "Overview",
        subtitle: "Operational glance — alerts, area vitals, duties, root strip, grow log.",
        primaryAction: /* @__PURE__ */ s.jsx(se, { teal: !0, onClick: () => f("/live/climate"), children: "Climate" }),
        actions: /* @__PURE__ */ s.jsx(se, { onClick: () => f("/live/mission"), children: "Mission" })
      }
    ),
    j.length > 0 || g > 0 ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-banner dsc-banner--bad", style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ s.jsx("strong", { children: j.length > 0 ? `${j.length} critical alert(s) active` : `${g} system alert(s)` }),
      /* @__PURE__ */ s.jsx("ul", { className: "dsc-fault-list", style: { marginTop: 8 }, children: j.slice(0, 6).map((W) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx(
        H,
        {
          label: W.split(".").pop()?.replace(/dsc_/, "").replace(/_/g, " ") || W,
          tone: "bad",
          pulse: !0,
          icon: "alert",
          onClick: () => _.open({ entityId: W, label: W, kind: "alert" })
        }
      ) }, W)) })
    ] }) : null,
    /* @__PURE__ */ s.jsx($b, { bus: a, onNavigate: f }),
    /* @__PURE__ */ s.jsx(
      Fb,
      {
        readings: {
          tentT: w.value,
          tentRh: S.value,
          tentVpd: N.value,
          cloneT: C.value,
          cloneRh: E.value,
          cloneVpd: z.value,
          roomT: U.value,
          roomRh: Q.value,
          rootT: X.value,
          targetTemp: F,
          rhMin: Z,
          rhMax: I,
          vpdMin: ae,
          vpdMax: ie,
          cloneTargetTemp: de,
          cloneRhMin: re,
          cloneRhMax: ce,
          cloneVpdMin: oe,
          cloneVpdMax: M,
          matLo: R,
          matHi: D,
          stale: {
            tentT: w.stale,
            tentRh: S.stale,
            tentVpd: N.stale,
            cloneT: C.stale,
            cloneRh: E.stale,
            cloneVpd: z.stale,
            roomT: U.stale,
            roomRh: Q.stale,
            rootT: X.stale
          }
        },
        onChartOpen: v
      }
    ),
    /* @__PURE__ */ s.jsx(le, { className: "dsc-glass", title: "Fan duties", icon: "fan", children: /* @__PURE__ */ s.jsx(Bb, { bus: a, onNavigate: f }) }),
    /* @__PURE__ */ s.jsx(Ub, { bus: a }),
    /* @__PURE__ */ s.jsx(
      Gb,
      {
        bus: a,
        rosterSlots: q,
        onNavigate: f,
        onPot: P,
        onPotChart: v
      }
    ),
    /* @__PURE__ */ s.jsx(Vb, { bus: a }),
    /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { fontSize: 12, marginTop: 8 }, children: [
      "Fleet ",
      h.version,
      " · expected ",
      h.expected_firmware
    ] })
  ] });
}
const k_ = [
  { id: "out", label: "OUT exhaust", prefix: "dsc_cal_cfm_out", select: "OUT" },
  { id: "recirc", label: "RECIRC", prefix: "dsc_cal_cfm_recirc", select: "RECIRC" },
  { id: "intake_main", label: "Intake 4×8", prefix: "dsc_cal_cfm_intake_main", select: "Intake Main" },
  { id: "intake_clone", label: "Intake 2×4", prefix: "dsc_cal_cfm_intake_clone", select: "Intake 2×4" }
], Ra = [25, 50, 75, 100], is = [
  { key: "25", pct: 25, label: "25% dim" },
  { key: "50", pct: 50, label: "50% dim" },
  { key: "75", pct: 75, label: "75% dim" },
  { key: "100", pct: 100, label: "100% dim" }
];
function H2() {
  const { state: a, num: i } = Ce(), { callService: r } = Ht(), [o, d] = x.useState("pick"), [h, f] = x.useState(0), [m, _] = x.useState(0), [b, v] = x.useState(""), [g, j] = x.useState(!1), [w, S] = x.useState(""), N = k_[h], C = Ra[m], E = a("input_boolean.dsc_cal_active") === "on", z = a("sensor.dsc_cfm_curves_status", "—"), U = x.useCallback(() => {
    d("pick"), f(0), _(0), v(""), S("");
  }, []);
  x.useEffect(() => {
  }, [E, o, m, g]);
  const Q = async () => {
    j(!0), S("Starting cal session…");
    try {
      await r("input_select", "select_option", {
        entity_id: "input_select.dsc_cal_target",
        option: N.select
      }), await r("script", "turn_on", { entity_id: "script.dsc_cal_start" }), d("session"), _(0), v(""), S(`Hold fan at ${Ra[0]}% — enter anemometer m/s.`);
    } catch (I) {
      S(I instanceof Error ? I.message : "Start failed");
    } finally {
      j(!1);
    }
  }, X = async () => {
    const I = Number(b);
    if (!Number.isFinite(I) || I <= 0) {
      S("Enter a valid m/s reading, or skip this step.");
      return;
    }
    j(!0), S(`Saving @${C}%…`);
    try {
      await r("input_number", "set_value", {
        entity_id: "input_number.dsc_cal_step_pct",
        value: C
      }), await r("input_number", "set_value", {
        entity_id: "input_number.dsc_cal_reading_ms",
        value: I
      }), await r("script", "turn_on", { entity_id: "script.dsc_cal_save_point" }), await r("input_number", "set_value", {
        entity_id: `input_number.${N.prefix}_${C}`,
        value: I
      }), await eb(N.prefix, "fan_cfm", [
        { step_key: String(C), measured_value: I, unit: "m/s" }
      ]);
      const ae = m + 1;
      ae >= Ra.length ? (await r("script", "turn_on", { entity_id: "script.dsc_cal_finish" }), d("done"), S(`Curve points saved for ${N.label}. Status: ${z}`)) : (_(ae), v(""), S(`Point @${C}% saved. Hold fan at ${Ra[ae]}% and measure.`), await r("script", "turn_on", { entity_id: "script.dsc_cal_hold_next" }));
    } catch (ae) {
      S(ae instanceof Error ? ae.message : "Save failed");
    } finally {
      j(!1);
    }
  }, F = async () => {
    j(!0);
    try {
      await r("script", "turn_on", { entity_id: "script.dsc_cal_skip_point" });
      const I = m + 1;
      I >= Ra.length ? (await r("script", "turn_on", { entity_id: "script.dsc_cal_finish" }), d("done"), S("Session finished (skipped remaining).")) : (_(I), v(""), S(`Skipped @${C}%. Next: ${Ra[I]}%.`));
    } finally {
      j(!1);
    }
  }, Z = async () => {
    j(!0);
    try {
      await r("script", "turn_on", { entity_id: "script.dsc_cal_abort" }), U(), S("Session aborted — fans restored.");
    } finally {
      j(!1);
    }
  };
  return /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-status-strip", children: [
      /* @__PURE__ */ s.jsx(H, { label: `Curves ${z}`, tone: z === "all_curves" ? "ok" : "warn" }),
      /* @__PURE__ */ s.jsx(H, { label: E ? "SESSION ON" : "Session idle", tone: E ? "ok" : "muted" }),
      o === "session" ? /* @__PURE__ */ s.jsx(H, { label: `Step ${m + 1}/${Ra.length} · ${C}%`, tone: "ok", pulse: !0 }) : null
    ] }),
    o === "pick" ? /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "1 · Select duct", icon: "fan", children: [
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Hold the anemometer at the centre of the duct at each fan step. At least two measured points per duct are needed before real curves replace the rated estimate." }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", style: { margin: "12px 0" }, children: k_.map((I, ae) => /* @__PURE__ */ s.jsx(
        "button",
        {
          type: "button",
          className: `dsc-chip${h === ae ? " dsc-chip--ok" : ""}`,
          onClick: () => f(ae),
          children: I.label
        },
        I.id
      )) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-row-actions", children: /* @__PURE__ */ s.jsxs(se, { variant: "primary", disabled: g, onClick: () => void Q(), children: [
        "Start ",
        N.label,
        " session"
      ] }) })
    ] }) : null,
    o === "session" ? /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: `2 · Sample ${N.label} @ ${C}%`, icon: "gauge", children: [
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
        "Set the fan to ",
        C,
        "%. Hold the anemometer at the duct centreline and enter the measured m/s — CFM is calculated for you."
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "Anemometer m/s @ ",
        C,
        "%",
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "number",
            step: "0.01",
            min: "0",
            value: b,
            onChange: (I) => v(I.target.value),
            placeholder: i("input_number.dsc_cal_reading_ms", 0) > 0 ? String(i("input_number.dsc_cal_reading_ms")) : "e.g. 3.2"
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-kpi-sub", children: [
        "Saved to the ",
        N.label,
        " curve at ",
        C,
        "%."
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-stage-track", children: Ra.map((I, ae) => /* @__PURE__ */ s.jsxs("span", { className: `dsc-stage-pill${ae === m ? " is-on" : ae > m ? "" : " is-next"}`, children: [
        I,
        "%"
      ] }, I)) }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", children: [
        /* @__PURE__ */ s.jsxs(se, { variant: "primary", disabled: g, onClick: () => void X(), children: [
          "Save @ ",
          C,
          "%"
        ] }),
        /* @__PURE__ */ s.jsx(se, { variant: "secondary", disabled: g, onClick: () => void F(), children: "Skip step" }),
        /* @__PURE__ */ s.jsx(se, { variant: "danger", disabled: g, onClick: () => void Z(), children: "Abort" })
      ] })
    ] }) : null,
    o === "done" ? /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "3 · Done", icon: "ok", children: [
      /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: w || "Session complete." }),
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", children: [
        "Curve status: ",
        z,
        ". The Climate page uses this curve for its airflow numbers."
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-row-actions", children: /* @__PURE__ */ s.jsx(se, { variant: "primary", onClick: U, children: "Calibrate another duct" }) })
    ] }) : null,
    w && o !== "done" ? /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: w }) : null
  ] });
}
function L2() {
  const { callService: a } = Ht(), [i, r] = x.useState(0), [o, d] = x.useState(""), [h, f] = x.useState(""), [m, _] = x.useState("45"), [b, v] = x.useState(!1), [g, j] = x.useState(""), [w, S] = x.useState(!1), N = is[i], C = async (U) => {
    await a("light", "turn_on", {
      entity_id: "light.dsc_hub_sf1000_dimmer",
      brightness_pct: U
    });
  }, E = async () => {
    const U = Number(o), Q = Number(h);
    if (!Number.isFinite(U) || U <= 0) {
      j("Enter the LUX reading at sensor height.");
      return;
    }
    v(!0);
    try {
      await C(N.pct), await eb("sf1000", "light_par", [
        { step_key: `${N.key}_lux`, measured_value: U, unit: "lux" },
        ...Number.isFinite(Q) && Q > 0 ? [{ step_key: `${N.key}_par`, measured_value: Q, unit: "µmol/m²/s" }] : [],
        { step_key: `${N.key}_height_cm`, measured_value: Number(m) || 0, unit: "cm" }
      ]);
      const X = i + 1;
      X >= is.length ? (S(!0), j("Light response curve saved to brain — used for effective-off threshold."), await a("light", "turn_off", { entity_id: "light.dsc_hub_sf1000_dimmer" })) : (r(X), d(""), f(""), j(`Saved ${N.label}. Set fixture to ${is[X].label} and measure.`), await C(is[X].pct));
    } catch (X) {
      j(X instanceof Error ? X.message : "Save failed");
    } finally {
      v(!1);
    }
  }, z = async () => {
    v(!0);
    try {
      S(!1), r(0), d(""), f(""), await C(is[0].pct), j(`Fixture at ${is[0].label}. Measure LUX/PAR at canopy height.`);
    } finally {
      v(!1);
    }
  };
  return w ? /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Light curve saved", icon: "ok", children: [
    /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: g }),
    /* @__PURE__ */ s.jsx(se, { variant: "secondary", onClick: () => void z(), children: "Re-run light wizard" })
  ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "SF1000 brightness response", icon: "light", children: [
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "At fixed canopy height, ramp SF1000 25→100%. Enter meter readings at each step. PAR optional if meter supports it." }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "Sensor height (cm)",
        /* @__PURE__ */ s.jsx("input", { type: "number", min: "1", value: m, onChange: (U) => _(U.target.value) })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-stage-track", style: { margin: "12px 0" }, children: is.map((U, Q) => /* @__PURE__ */ s.jsx("span", { className: `dsc-stage-pill${Q === i ? " is-on" : Q > i ? "" : " is-next"}`, children: U.label }, U.key)) }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "LUX @ ",
        N.label,
        /* @__PURE__ */ s.jsx("input", { type: "number", min: "0", value: o, onChange: (U) => d(U.target.value) })
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "PAR µmol/m²/s (optional)",
        /* @__PURE__ */ s.jsx("input", { type: "number", min: "0", value: h, onChange: (U) => f(U.target.value) })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-row-actions", children: i === 0 && !g ? /* @__PURE__ */ s.jsx(se, { variant: "primary", disabled: b, onClick: () => void z(), children: "Start light wizard" }) : /* @__PURE__ */ s.jsxs(se, { variant: "primary", disabled: b, onClick: () => void E(), children: [
        "Save ",
        N.label
      ] }) })
    ] }),
    g ? /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: g }) : null
  ] });
}
function $2() {
  const [a, i] = x.useState("fan");
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Nt,
      {
        icon: "learning",
        title: "Calibrate",
        subtitle: "Measure fan airflow and light output so the hub runs on real curves."
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ s.jsx(
        "button",
        {
          type: "button",
          className: `dsc-chip${a === "fan" ? " dsc-chip--ok" : ""}`,
          onClick: () => i("fan"),
          children: "Fan CFM"
        }
      ),
      /* @__PURE__ */ s.jsx(
        "button",
        {
          type: "button",
          className: `dsc-chip${a === "light" ? " dsc-chip--ok" : ""}`,
          onClick: () => i("light"),
          children: "Light PAR/LUX"
        }
      )
    ] }),
    a === "fan" ? /* @__PURE__ */ s.jsx(H2, {}) : /* @__PURE__ */ s.jsx(L2, {})
  ] });
}
function N_({
  tag: a,
  config: i
}) {
  const r = x.useRef(null), { hass: o, tick: d } = oi(), [h, f] = x.useState("loading"), m = x.useRef(
    null
  ), _ = x.useRef(i);
  return _.current = i, x.useEffect(() => {
    const b = r.current;
    if (!b) return;
    let v = !1;
    const g = _.current ?? {};
    return (async () => {
      f("loading"), b.innerHTML = "";
      const j = await lb(a);
      if (v || !r.current) return;
      if (!j) {
        f("missing");
        const S = document.createElement("div");
        S.className = "dsc-empty";
        const N = $0(a).join(", ");
        S.innerHTML = `<strong>${a}</strong> did not register.<br/>Tried ${N}. Deploy the card IIFE under /config/www (or add a Lovelace resource), then hard-refresh.`, b.appendChild(S);
        return;
      }
      const w = document.createElement(a);
      typeof w.setConfig == "function" && w.setConfig({ type: `custom:${a}`, ...g }), o && (w.hass = o), b.appendChild(w), m.current = w, f("ready");
    })(), () => {
      v = !0, m.current = null, b.innerHTML = "";
    };
  }, [a]), x.useEffect(() => {
    m.current && o && (m.current.hass = o);
  }, [o, d]), /* @__PURE__ */ s.jsx(
    "div",
    {
      className: `dsc-legacy-host${h === "missing" ? " dsc-legacy-host--empty" : ""}`,
      ref: r,
      "data-status": h
    }
  );
}
function Fr(a) {
  return Number.isFinite(a.value) ? `${Math.round(a.value)} CFM` : "—";
}
function U2(a) {
  return a("sensor.dsc_hub_room_vpd_kpa") ? "sensor.dsc_hub_room_vpd_kpa" : a("sensor.dsc_hub_room_vpd") ? "sensor.dsc_hub_room_vpd" : "sensor.dsc_hub_room_vpd_kpa";
}
function B2() {
  const a = Ce(), { available: i, num: r, state: o, entity: d, tick: h } = a, f = kt(), m = ft(), _ = Db(), { isSnoozed: b } = fc(), v = kn(), g = Ab(), j = (Re) => g.open({ kind: Re, title: zb[Re] });
  _b(), bb(), gb();
  const w = f.hub.online || _("sensor.dsc_hub_uptime"), S = r("sensor.dsc_hub_uptime", f.hub.values.uptime != null ? Number(f.hub.values.uptime) : 0), N = r("sensor.dsc_active_alert_count", 0), C = o("sensor.dsc_fleet_version_status", "ok"), E = String(d("sensor.dsc_fleet_version_status")?.attributes?.expected || f.expected_firmware || "7.0.0"), z = o("binary_sensor.dsc_cannalib_api_online") === "on", U = r("sensor.dsc_cannalib_api_hits", 0), Q = o("sensor.dsc_cannalib_bandwidth_summary", "— MB"), X = f.panel.online ? "on" : o("binary_sensor.dsc_hub_panel_link"), F = f.panel.online || X === "on", Z = _("binary_sensor.dsc_hub_panel_link") || F, I = !F && i("sensor.dsc_control_wifi_rssi"), ae = !F && !I && !Z, ie = f.hub.values.heartbeat != null ? String(f.hub.values.heartbeat) : o("sensor.dsc_hub_heartbeat", "NO BEAT"), de = f.hub.online && f.hub.values.heartbeat != null ? !0 : _("sensor.dsc_hub_heartbeat"), re = _e("sensor.dsc_hub_tent_temperature"), ce = _e("sensor.dsc_hub_tent_humidity"), oe = _e("sensor.dsc_hub_vpd_kpa"), M = _e("sensor.dsc_hub_clone_temperature"), R = _e("sensor.dsc_hub_clone_humidity"), D = _e("sensor.dsc_hub_clone_vpd_kpa"), q = _e("sensor.dsc_hub_room_temperature"), P = _e("sensor.dsc_hub_room_humidity"), W = U2(d);
  _e(W);
  const k = _e("sensor.dsc_coldest_root_zone_temp"), G = r("number.dsc_hub_target_temp", 25), ee = r("number.dsc_hub_rh_target_min", 45), ne = r("number.dsc_hub_rh_target_max", 70), me = r("number.dsc_hub_vpd_target_min", 0.8), fe = r("number.dsc_hub_vpd_target_max", 1.4), ge = r("number.dsc_hub_clone_target_temp", 24), $e = r("number.dsc_hub_clone_rh_min", 55), ye = r("number.dsc_hub_clone_rh_max", 75), nt = r("number.dsc_hub_clone_vpd_min", 0.6), mt = r("number.dsc_hub_clone_vpd_max", 1.2), je = r("number.dsc_hub_mat_root_zone_low", 20), at = r("number.dsc_hub_mat_root_zone_high", 24), te = ht("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", { available: i, num: r }), Le = ht("sensor.dsc_cfm_exhaust_recirc_allocated", "sensor.dsc_cfm_exhaust_recirc", { available: i, num: r }), We = ht("sensor.dsc_cfm_intake_main", "sensor.dsc_cfm_intake_main", { available: i, num: r }), pt = ht("sensor.dsc_cfm_intake_2x4", "sensor.dsc_cfm_intake_2x4", { available: i, num: r }), Ie = [te, Le, We, pt], Ae = Ed(f), Lt = Md(Ae), $t = d("sensor.dsc_plant_roster_summary")?.attributes?.slots || [], ln = o("sensor.dsc_plant_roster_summary", "—"), Zt = qb(o, b), st = (Re) => v.open({
    entityId: Re.entityId,
    label: Re.label,
    kind: "kit",
    runtimeToday: Re.runtimeToday,
    cyclesToday: Re.cyclesToday,
    demandEntity: Re.demandEntity
  }), il = (Re) => {
    window.dispatchEvent(new CustomEvent("dsc-dash-select-pot", { detail: { pot: Re } })), m("/live/root");
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page dsc-dash-home", children: [
    /* @__PURE__ */ s.jsx(
      Nt,
      {
        icon: "home",
        title: "Home",
        subtitle: "Everything running right now, at a glance.",
        primaryAction: /* @__PURE__ */ s.jsx(se, { teal: !0, onClick: () => m("/live/twin"), children: "Open Twin" }),
        actions: /* @__PURE__ */ s.jsx(se, { onClick: () => m("/live/climate"), children: "Climate" })
      }
    ),
    /* @__PURE__ */ s.jsx(
      M2,
      {
        hubOnline: w,
        panelOk: F,
        panelHaOnly: I,
        panelOffline: ae,
        heartbeat: ie,
        beatOk: de,
        uptimeSec: S,
        alerts: N,
        fleetStatus: C,
        fleetExpected: E,
        cannalibOnline: z,
        cannalibHits: U,
        cannalibSummary: Q,
        inServiceLabel: `${Lt.inService} of ${Lt.total} in service`,
        activeFaultCount: Zt.length,
        onChip: (Re, ds) => v.open({ entityId: Re, label: ds, kind: Re.includes("alert") ? "alert" : "kit" })
      }
    ),
    /* @__PURE__ */ s.jsx(T2, { bus: a }),
    /* @__PURE__ */ s.jsx($b, { bus: a, onNavigate: m }),
    Zt.length > 0 ? /* @__PURE__ */ s.jsx(le, { className: "dsc-glass", title: "Active system alerts", icon: "alert", children: /* @__PURE__ */ s.jsx("ul", { className: "dsc-fault-list", children: Zt.map((Re) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx(se, { onClick: () => v.open({ entityId: Re, label: Re, kind: "alert" }), children: Re.split(".").pop()?.replace(/dsc_/, "").replace(/_/g, " ") }) }, Re)) }) }) : null,
    /* @__PURE__ */ s.jsx(R2, { bus: a, onNavigate: m }),
    /* @__PURE__ */ s.jsx(Cd, {}),
    /* @__PURE__ */ s.jsx(le, { className: "dsc-glass", title: "System map", icon: "fleet", children: /* @__PURE__ */ s.jsx(N_, { tag: "dsc-system-map-card" }) }),
    /* @__PURE__ */ s.jsx(Ub, { bus: a }),
    /* @__PURE__ */ s.jsx(Bb, { bus: a, onNavigate: m }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid dsc-grid--2", children: [
      /* @__PURE__ */ s.jsx(Vb, { bus: a }),
      /* @__PURE__ */ s.jsxs("details", { className: "dsc-narrator", children: [
        /* @__PURE__ */ s.jsx("summary", { children: "System narrator" }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-muted", style: { fontSize: 13, lineHeight: 1.55, padding: "8px 0" }, children: [
          /* @__PURE__ */ s.jsxs("p", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: "Hub:" }),
            " ",
            w ? "online" : "offline",
            " · uptime ",
            Lb(S),
            " · beat ",
            ie
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: "Climate:" }),
            " 4×8 ",
            Number.isFinite(re.value) ? `${re.value.toFixed(1)}°C` : "—",
            " /",
            " ",
            Number.isFinite(ce.value) ? `${ce.value.toFixed(0)}%` : "—",
            " RH · 2×4",
            " ",
            Number.isFinite(M.value) ? `${M.value.toFixed(1)}°C` : "—",
            " /",
            " ",
            Number.isFinite(R.value) ? `${R.value.toFixed(0)}%` : "—",
            " RH"
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: "Airflow:" }),
            " OUT ",
            Math.round(r("sensor.dsc_fan_exhaust_outside_pct", 0)),
            "% · RECIRC",
            " ",
            Math.round(r("sensor.dsc_fan_exhaust_room_pct", 0)),
            "% · intakes",
            " ",
            Math.round(r("sensor.dsc_fan_intake_main_pct", 0)),
            "/",
            Math.round(r("sensor.dsc_fan_intake_2x4_pct", 0)),
            "%"
          ] }),
          Zt.length > 0 ? /* @__PURE__ */ s.jsxs("p", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: "Watchlist:" }),
            " ",
            Zt.length,
            " active alert(s)."
          ] }) : null
        ] })
      ] })
    ] }),
    /* @__PURE__ */ s.jsx(A2, { bus: a, onNavigate: m }),
    /* @__PURE__ */ s.jsx(
      Fb,
      {
        readings: {
          tentT: re.value,
          tentRh: ce.value,
          tentVpd: oe.value,
          cloneT: M.value,
          cloneRh: R.value,
          cloneVpd: D.value,
          roomT: q.value,
          roomRh: P.value,
          rootT: k.value,
          targetTemp: G,
          rhMin: ee,
          rhMax: ne,
          vpdMin: me,
          vpdMax: fe,
          cloneTargetTemp: ge,
          cloneRhMin: $e,
          cloneRhMax: ye,
          cloneVpdMin: nt,
          cloneVpdMax: mt,
          matLo: je,
          matHi: at,
          stale: {
            tentT: re.stale,
            tentRh: ce.stale,
            tentVpd: oe.stale,
            cloneT: M.stale,
            cloneRh: R.stale,
            cloneVpd: D.stale,
            roomT: q.stale,
            roomRh: P.stale,
            rootT: k.stale
          }
        },
        onChartOpen: j
      }
    ),
    /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Lung · CFM", icon: "climate", children: [
      /* @__PURE__ */ s.jsx(pc, { readings: Ie }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ s.jsx(St, { label: "Out alloc", value: Fr(te).replace(" CFM", ""), unit: "CFM" }),
        /* @__PURE__ */ s.jsx(St, { label: "Recirc alloc", value: Fr(Le).replace(" CFM", ""), unit: "CFM" }),
        /* @__PURE__ */ s.jsx(St, { label: "Intake 4×8", value: Fr(We).replace(" CFM", ""), unit: "CFM" }),
        /* @__PURE__ */ s.jsx(St, { label: "Intake 2×4", value: Fr(pt).replace(" CFM", ""), unit: "CFM" })
      ] }),
      /* @__PURE__ */ s.jsx(N_, { tag: "dsc-airflow-map-card" })
    ] }),
    /* @__PURE__ */ s.jsx(O2, { bus: a }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid dsc-grid--2", children: [
      /* @__PURE__ */ s.jsxs(le, { className: "dsc-glass", title: "Plant roster", icon: "roster", children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: ln }),
        Array.isArray($t) && $t.length > 0 ? /* @__PURE__ */ s.jsx("ul", { className: "dsc-roster-list", children: $t.slice(0, 8).map((Re) => /* @__PURE__ */ s.jsxs("li", { children: [
          /* @__PURE__ */ s.jsx("strong", { children: Re.nickname || Re.strain || `Slot ${Re.slot}` }),
          /* @__PURE__ */ s.jsxs("span", { className: "dsc-muted", children: [
            " ",
            "· ",
            Re.pot && Re.pot !== "none" ? `P${Re.pot}` : "stock",
            " · ",
            Re.status || "—",
            Re.blend ? ` · ${Re.blend}` : ""
          ] })
        ] }, Re.slot)) }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: "No occupied roster slots." })
      ] }),
      /* @__PURE__ */ s.jsx(le, { className: "dsc-glass", title: "Kit pulse", icon: "fleet", children: /* @__PURE__ */ s.jsx(Td, { nodes: Ae, onSelect: st }) })
    ] }),
    /* @__PURE__ */ s.jsx(Gb, { bus: a, rosterSlots: $t, onNavigate: m, onPot: il, onPotChart: j })
  ] });
}
const F2 = [
  { id: "live", label: "Live", path: "/live/overview", icon: "live" },
  { id: "grow", label: "Grow", path: "/grow/compose", icon: "grow" },
  { id: "tune", label: "Tune", path: "/tune/learning", icon: "tune" },
  { id: "fleet", label: "Fleet", path: "/fleet", icon: "fleet" }
], G2 = {
  live: [
    { id: "overview", label: "Overview", path: "/live/overview", icon: "home" },
    { id: "mission", label: "Mission", path: "/live/mission", icon: "mission" },
    { id: "dash", label: "Dash", path: "/ops/home", icon: "twin" },
    { id: "twin", label: "Twin", path: "/live/twin", icon: "twin" },
    { id: "climate", label: "Climate", path: "/live/climate", icon: "climate" },
    { id: "main", label: "4×8", path: "/live/4x8", icon: "tent" },
    { id: "clone", label: "2×4", path: "/live/2x4", icon: "clone" },
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
  fleet: [
    { id: "overview", label: "Overview", path: "/fleet", icon: "fleet" },
    { id: "calibrate", label: "Calibrate", path: "/fleet/calibrate", icon: "learning" },
    { id: "settings", label: "Settings", path: "/fleet/settings", icon: "settings" }
  ]
}, V2 = {
  "/": "/live/overview",
  "/ops": "/ops/home",
  "/ops/home": "/ops/home",
  "/ops/dash": "/ops/dash",
  "/ops/climate": "/live/climate",
  "/ops/main-4x8": "/live/4x8",
  "/ops/clone-2x4": "/live/2x4",
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
function q2(a) {
  return a.startsWith("/grow") || a.startsWith("/plant") ? "grow" : a.startsWith("/tune") || a.startsWith("/advanced") ? "tune" : a.startsWith("/fleet") || a.startsWith("/system") ? "fleet" : (a.startsWith("/ops"), "live");
}
function Y2(a, i) {
  const r = V2[a];
  return r ? r.includes("?") ? r : `${r}${i || ""}` : null;
}
const X2 = `:root,:host,.dsc-root{--dsc-black: #0b0e14;--dsc-black-2: #12171f;--dsc-gray-1: #12171f;--dsc-gray-2: #1a2230;--dsc-gray-3: #243044;--dsc-gray-4: #8b95a8;--dsc-gray-5: #8b95a8;--dsc-blue: #26c6da;--dsc-blue-dim: rgba(38, 198, 218, .4);--dsc-purple: #a78bfa;--dsc-purple-dim: rgba(167, 139, 250, .35);--dsc-neon: #66bb6a;--dsc-neon-dim: rgba(102, 187, 106, .32);--dsc-neon-glow: rgba(0, 230, 118, .4);--dsc-teal: #26c6da;--dsc-teal-dim: rgba(38, 198, 218, .45);--dsc-teal-glow: rgba(38, 198, 218, .55);--dsc-orange: #ff8a65;--dsc-amber: #ffb74d;--dsc-bad: #ef5350;--dsc-bad-soft: #ef5350;--dsc-soil-1: #5b9f6b;--dsc-soil-2: #4a8f9f;--dsc-soil-3: #c4a35a;--dsc-soil-4: #8d6e63;--dsc-glass: rgba(18, 23, 31, .78);--dsc-glass-border: rgba(36, 48, 68, .55);--dsc-white: #e8eef8;--dsc-shadow: 0 8px 24px rgba(0, 0, 0, .45);--dsc-shadow-tight: 0 2px 8px rgba(0, 0, 0, .55);--dsc-radius: 10px;--dsc-radius-lg: 14px;--dsc-font: "Segoe UI", "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;--dsc-mono: "Cascadia Code", "IBM Plex Mono", ui-monospace, monospace;color:var(--dsc-white);background:var(--dsc-black);font-family:var(--dsc-font);display:block;height:100%;box-sizing:border-box}*,*:before,*:after{box-sizing:border-box}html,body{height:100%;margin:0}body{background:var(--dsc-black);color:var(--dsc-white);font-family:var(--dsc-font)}#root{height:100%}.dsc-root{height:100%;min-height:100%;overflow:auto;background:radial-gradient(1100px 560px at 8% -12%,rgba(38,198,218,.12),transparent 55%),radial-gradient(900px 520px at 92% -8%,rgba(38,198,218,.08),transparent 50%),radial-gradient(700px 420px at 70% 100%,rgba(102,187,106,.04),transparent 55%),var(--dsc-black)}.dsc-honesty-rail{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}.dsc-next-rec{border-color:var(--dsc-blue-dim)}.dsc-twin-keepalive{position:fixed;inset:0;visibility:hidden;pointer-events:none;z-index:-1;overflow:hidden;margin:0;min-height:0}.dsc-twin-keepalive.is-active{position:relative;inset:auto;visibility:visible;pointer-events:auto;z-index:auto;overflow:visible;margin-bottom:12px;min-height:min(70vh,720px)}.dsc-twin-keepalive:not(.is-active),.dsc-twin-keepalive:not(.is-active) *{pointer-events:none!important}.dsc-twin-keepalive-host{min-height:min(68vh,700px)}.dsc-twin-keepalive.is-active .dsc-twin-keepalive-host,.dsc-twin-keepalive.is-active .dsc-twin-keepalive-host>*{min-height:min(68vh,700px);pointer-events:auto}.dsc-tab--live.active{color:var(--dsc-blue);border-color:var(--dsc-blue-dim)}.dsc-tab--grow.active{color:var(--dsc-teal);border-color:var(--dsc-teal-dim)}.dsc-tab--tune.active{color:var(--dsc-purple);border-color:var(--dsc-purple-dim)}.dsc-tab--fleet.active{color:var(--dsc-blue);border-color:var(--dsc-blue-dim)}.dsc-secondary-tabs .dsc-tab.active{color:var(--dsc-teal);border-color:var(--dsc-teal-dim);box-shadow:0 0 0 1px var(--dsc-blue-dim)}.dsc-tent-segment{display:inline-flex;gap:4px;padding:3px;border-radius:999px;background:var(--dsc-gray-1);border:1px solid var(--dsc-glass-border)}.dsc-tent-segment button{appearance:none;border:0;background:transparent;color:var(--dsc-gray-5);padding:6px 12px;border-radius:999px;cursor:pointer;font:inherit;font-size:.85rem}.dsc-tent-segment button.is-active{background:var(--dsc-gray-2);color:var(--dsc-white);box-shadow:var(--dsc-shadow-tight)}.dsc-tent-segment button[data-tent=main].is-active{color:var(--dsc-blue)}.dsc-tent-segment button[data-tent=clone].is-active{color:var(--dsc-purple)}.dsc-tent-segment button[data-tent=compare].is-active{color:var(--dsc-teal)}.dsc-shell{display:flex;flex-direction:column;min-height:100%;max-width:1600px;margin:0 auto;padding:16px 20px 28px}.dsc-brand-row{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:10px}.dsc-brand{display:flex;align-items:center;gap:12px;color:var(--dsc-white);text-decoration:none}.dsc-brand img,.dsc-brand svg{width:36px;height:36px;color:var(--dsc-neon)}.dsc-brand-title{display:flex;flex-direction:column;gap:2px}.dsc-brand-title strong{font-size:1.05rem;letter-spacing:.04em;font-weight:700;line-height:1.25;max-width:min(52vw,28rem)}.dsc-brand-wordmark{height:18px;width:auto;max-width:160px;display:block;color:var(--dsc-text, #eef1f8);line-height:0}.dsc-brand-wordmark svg{width:auto;height:18px;display:block}.dsc-icon svg{width:100%;height:100%;display:block}.dsc-brand-title span{font-size:.72rem;color:var(--dsc-gray-5);letter-spacing:.08em;text-transform:uppercase}.dsc-page-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px}.dsc-page-header-main{display:flex;align-items:flex-start;gap:10px}.dsc-page-header-actions{display:flex;align-items:center;gap:6px;flex-shrink:0}.dsc-card-title{display:inline-flex;align-items:center;gap:8px}.dsc-primary-tabs,.dsc-secondary-tabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:thin;padding-bottom:2px;-webkit-overflow-scrolling:touch}.dsc-primary-tabs{border-bottom:1px solid var(--dsc-gray-3);margin-bottom:8px}.dsc-secondary-tabs{margin-bottom:16px;mask-image:linear-gradient(90deg,#000 85%,transparent)}.dsc-secondary-tabs:after{content:"";flex:0 0 12px}.dsc-tab{appearance:none;border:1px solid transparent;background:transparent;color:var(--dsc-gray-5);padding:10px 14px;min-height:44px;border-radius:8px 8px 0 0;cursor:pointer;font:inherit;font-size:.92rem;letter-spacing:.04em;white-space:nowrap;display:inline-flex;align-items:center;gap:8px;transition:transform .1s ease,box-shadow .1s ease,color .15s ease,border-color .15s ease,background .15s ease;text-decoration:none}.dsc-tab span[role=img]{opacity:.9;flex-shrink:0}.dsc-tab:hover{color:var(--dsc-white);background:var(--dsc-gray-1)}.dsc-tab:focus-visible{outline:2px solid var(--dsc-neon);outline-offset:2px}.dsc-tab.active{color:var(--dsc-white);border-bottom:2px solid var(--dsc-neon);box-shadow:0 6px 18px #39ff1414}.dsc-secondary-tabs .dsc-tab{border-radius:999px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-1);min-height:40px;padding:8px 14px}.dsc-secondary-tabs .dsc-tab.active{border-color:var(--dsc-neon-dim);color:var(--dsc-neon);background:#39ff1414;box-shadow:var(--dsc-shadow-tight)}.dsc-btn{appearance:none;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);border-radius:8px;padding:10px 16px;min-height:40px;font:inherit;cursor:pointer;box-shadow:var(--dsc-shadow-tight);transition:transform .1s ease,box-shadow .1s ease,border-color .12s ease,background .12s ease}.dsc-btn:hover{border-color:var(--dsc-neon-dim)}.dsc-btn:active,.dsc-tab:active{transform:translateY(1px);box-shadow:0 1px 3px #000000a6}.dsc-btn.primary{border-color:var(--dsc-neon-dim);color:var(--dsc-black);background:var(--dsc-neon);font-weight:650}.dsc-page{animation:dsc-fade .18s ease}@keyframes dsc-fade{0%{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.dsc-page,.dsc-btn,.dsc-tab,.dsc-live-pulse{animation:none!important;transition:none!important}}.dsc-grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:14px}.dsc-col-3{grid-column:span 3}.dsc-col-4{grid-column:span 4}.dsc-col-6{grid-column:span 6}.dsc-col-8{grid-column:span 8}.dsc-col-12{grid-column:span 12}@media(max-width:1100px){.dsc-col-3,.dsc-col-4{grid-column:span 6}.dsc-col-8{grid-column:span 12}}@media(max-width:720px){.dsc-shell{padding:12px}.dsc-col-3,.dsc-col-4,.dsc-col-6,.dsc-col-8{grid-column:span 12}}.dsc-card{background:linear-gradient(165deg,var(--dsc-gray-1),var(--dsc-black-2));border:1px solid var(--dsc-gray-3);border-radius:var(--dsc-radius);box-shadow:var(--dsc-shadow);padding:14px 16px;min-height:88px}.dsc-card h2,.dsc-card h3{margin:0 0 8px;font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;color:var(--dsc-gray-5);font-weight:600}.dsc-kpi-value{font-size:1.85rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:.02em;color:var(--dsc-white)}.dsc-kpi-unit{margin-left:6px;font-size:.85rem;color:var(--dsc-gray-5)}.dsc-kpi-sub{margin-top:6px;color:var(--dsc-gray-5);font-size:.82rem}.dsc-status-ok{color:var(--dsc-neon)}.dsc-status-warn{color:var(--dsc-amber)}.dsc-status-bad{color:var(--dsc-bad)}.dsc-status-muted{color:var(--dsc-gray-5)}.dsc-page-title{margin:0 0 14px;font-size:1.35rem;letter-spacing:.04em}.dsc-muted{color:var(--dsc-gray-5)}.dsc-legacy-host{min-height:420px;border-radius:var(--dsc-radius);overflow:hidden;border:1px solid var(--dsc-gray-3);background:#000}.dsc-legacy-host--empty{background:var(--dsc-gray-1);min-height:160px}.dsc-legacy-host>*{display:block;width:100%}.dsc-status-strip{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}.dsc-chip-row{display:flex;flex-wrap:wrap;gap:8px}.dsc-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-1);font-size:.75rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-chip--ok{color:var(--dsc-neon);border-color:var(--dsc-neon-dim);background:#39ff1414;box-shadow:0 0 12px #39ff141f}.dsc-chip--bad{color:var(--dsc-bad-soft);border-color:color-mix(in srgb,var(--dsc-bad) 45%,transparent);background:color-mix(in srgb,var(--dsc-bad) 12%,transparent)}.dsc-chip--warn{color:var(--dsc-amber);border-color:color-mix(in srgb,var(--dsc-amber) 45%,transparent);background:color-mix(in srgb,var(--dsc-amber) 12%,transparent)}.dsc-chip--muted{color:var(--dsc-gray-5)}.dsc-chip--pulse{animation:dsc-chip-pulse 1.6s ease-in-out infinite}.dsc-chip--duty{animation:dsc-duty-pulse 1.8s ease-in-out infinite}.dsc-chip--breathe{animation:dsc-chip-breathe 2.4s ease-in-out infinite}.dsc-chip--fan{animation:dsc-chip-fan 1.3s linear infinite}@keyframes dsc-chip-pulse{0%,to{box-shadow:0 0 #39ff1400}50%{box-shadow:0 0 14px #39ff1459}}@keyframes dsc-duty-pulse{0%,to{box-shadow:0 0 #3dde7a0d;border-color:var(--dsc-neon-dim)}50%{box-shadow:0 0 16px #3dde7a52;border-color:var(--dsc-neon)}}@keyframes dsc-chip-breathe{0%,to{box-shadow:0 0 #ffb74d0d}50%{box-shadow:0 0 14px #ffb74d61}}@keyframes dsc-chip-fan{0%{box-shadow:0 0 #2ec4d60d}50%{box-shadow:0 0 12px #2ec4d66b}to{box-shadow:0 0 #2ec4d60d}}.dsc-demand-row{display:flex;flex-wrap:wrap;gap:8px}.dsc-demand-row--stack{flex-direction:column}.dsc-demand{appearance:none;flex:1 1 110px;min-height:52px;padding:10px 12px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);font:inherit;cursor:pointer;display:flex;flex-direction:column;align-items:flex-start;gap:4px;box-shadow:var(--dsc-shadow-tight);transition:transform .1s ease,box-shadow .1s ease,border-color .12s ease,background .12s ease}.dsc-demand:hover{border-color:var(--dsc-neon-dim)}.dsc-demand:active{transform:translateY(1px);box-shadow:0 1px 3px #000000a6}.dsc-demand.is-on{border-color:var(--dsc-neon);background:#39ff141a;box-shadow:0 0 0 1px #39ff1440,0 0 18px #39ff1433}.dsc-demand.is-missing{opacity:.55;cursor:not-allowed}.dsc-demand-label{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-demand.is-on .dsc-demand-label{color:var(--dsc-neon)}.dsc-demand-state{font-weight:700;font-variant-numeric:tabular-nums;font-size:1rem}.dsc-demand-icon{margin-bottom:4px;opacity:.95}.dsc-mode-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}.dsc-mode-selects{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}.dsc-entity-select{display:flex;flex-direction:column;gap:6px;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-entity-select-label{display:inline-flex;align-items:center;gap:6px}.dsc-entity-select select{appearance:none;min-height:40px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);padding:8px 12px;font:inherit;text-transform:none;letter-spacing:0}.dsc-entity-select.is-disabled{opacity:.55}.dsc-fan-stack{display:flex;flex-direction:column;gap:10px}.dsc-fan-slider{display:flex;flex-direction:column;gap:4px}.dsc-fan-slider-label{display:flex;align-items:baseline;gap:8px;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-fan-slider-label strong{color:var(--dsc-teal);font-variant-numeric:tabular-nums}.dsc-fan-slider input[type=range]{width:100%;accent-color:var(--dsc-teal)}.dsc-fan-slider.is-disabled{opacity:.5}.dsc-honesty{margin:10px 0 0;font-size:.85rem;color:var(--dsc-gray-5);display:flex;flex-wrap:wrap;align-items:center;gap:8px}.dsc-target-panel{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}.dsc-target-panel.is-compact .dsc-target-grid{grid-template-columns:repeat(auto-fit,minmax(90px,1fr))}.dsc-tent-targets{border:1px solid var(--dsc-glass-border);border-radius:var(--dsc-radius);padding:10px 12px;background:#0000002e}.dsc-tent-targets-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}.dsc-got-want{display:flex;flex-direction:column;gap:2px;font-size:.82rem;margin-bottom:10px}.dsc-target-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px}.dsc-target-num{display:flex;flex-direction:column;gap:4px;font-size:.7rem;letter-spacing:.06em;color:var(--dsc-gray-5)}.dsc-target-num-label{text-transform:uppercase}.dsc-target-num input,.dsc-target-num textarea{min-height:36px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);padding:6px 8px;font:inherit;font-variant-numeric:tabular-nums}.dsc-target-num textarea{text-transform:none;letter-spacing:0;min-height:56px;resize:vertical}.dsc-target-num.is-disabled{opacity:.55}.dsc-chart{position:relative}.dsc-chart-svg{cursor:crosshair;touch-action:none}.dsc-chart-tooltip{position:absolute;top:8px;transform:translate(-50%);pointer-events:none;z-index:2;min-width:120px;padding:8px 10px;border-radius:8px;border:1px solid var(--dsc-glass-border);background:var(--dsc-glass);backdrop-filter:blur(10px);box-shadow:var(--dsc-shadow-tight);font-size:.75rem}.dsc-chart-tooltip-time{color:var(--dsc-teal);font-family:var(--dsc-mono);margin-bottom:4px}.dsc-chart-tooltip-row{display:flex;align-items:center;gap:6px;color:var(--dsc-white)}.dsc-chart-tooltip-row i{width:7px;height:7px;border-radius:50%;display:inline-block}@keyframes dsc-sync-pulse{0%{stroke-dashoffset:1;opacity:.2}35%{opacity:1}to{stroke-dashoffset:0;opacity:0}}@media(prefers-reduced-motion:reduce){.dsc-chart-pulse{animation:none!important;opacity:.85}.dsc-gauge-value,.dsc-chip--pulse,.dsc-chip--duty,.dsc-chip--breathe,.dsc-chip--fan,.dsc-fan-spin,.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-warn),.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-bad){animation:none!important}}.dsc-gauge.is-warn .dsc-gauge-label{color:var(--dsc-amber)}.dsc-gauge.is-muted{opacity:.75}.dsc-gauge.is-muted .dsc-gauge-label{color:var(--dsc-gray-5)}.dsc-gauge.is-bad .dsc-gauge-label{color:var(--dsc-bad-soft)}.dsc-gauge.is-ok:not(.is-stale) .dsc-gauge-value{animation:dsc-gauge-live 3.2s ease-in-out infinite}.dsc-gauge.is-warn .dsc-gauge-value,.dsc-gauge.is-bad .dsc-gauge-value{animation:dsc-gauge-breathe 2.4s ease-in-out infinite}@keyframes dsc-gauge-live{0%,to{opacity:.92;filter:drop-shadow(0 0 4px rgba(46,196,214,.25))}50%{opacity:1;filter:drop-shadow(0 0 10px rgba(46,196,214,.55))}}@keyframes dsc-gauge-breathe{0%,to{opacity:.88;filter:drop-shadow(0 0 4px rgba(255,183,77,.25))}50%{opacity:1;filter:drop-shadow(0 0 12px rgba(255,107,138,.55))}}.dsc-gauge-row{display:flex;justify-content:space-around;flex-wrap:wrap;gap:8px}.dsc-gauge-matrix{display:flex;flex-direction:column;gap:8px}.dsc-gauge-row-3{display:grid;grid-template-columns:14px repeat(3,minmax(0,1fr));align-items:center;gap:2px 4px;border:1px solid transparent;border-radius:12px;padding:2px 4px 4px;transition:box-shadow .25s ease,border-color .25s ease,background .25s ease}.dsc-gauge-row-3.is-lit{border-color:#26c6da6b;background:linear-gradient(180deg,#26c6da14,#0c121c59);box-shadow:0 0 22px #26c6da29,inset 0 0 14px #26c6da0d}.dsc-gauge-row-tag{font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--dsc-gray-5);writing-mode:vertical-rl;transform:rotate(180deg);justify-self:center;padding:2px 0}.dsc-gauge-row-3 .dsc-gauge{min-width:0}.dsc-gauge-cell{min-width:0;display:flex;flex-direction:column;align-items:center;gap:2px}.dsc-gauge-cell .dsc-sparkline{width:100%;max-width:88px;opacity:.9}.dsc-gauge-row-3 .dsc-gauge svg{width:100%;max-width:96px;height:auto;max-height:72px}.dsc-gauge-row-3 .dsc-gauge-label{font-size:10px}.dsc-gauge-zone{border:1px solid transparent;border-radius:12px;padding:8px 6px 10px;transition:box-shadow .25s ease,border-color .25s ease,background .25s ease}.dsc-gauge-zone.is-lit{border-color:#26c6da6b;background:linear-gradient(180deg,#26c6da14,#0c121c59);box-shadow:0 0 22px #26c6da29,inset 0 0 14px #26c6da0d}.dsc-gauge-zone-label{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5);margin:0 4px 6px}.dsc-gauge{display:flex;flex-direction:column;align-items:center;gap:4px}.dsc-gauge-label{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-chart-legend{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:4px;min-height:20px}.dsc-chart-legend-item{display:inline-flex;align-items:center;gap:6px;font-size:.75rem;color:var(--dsc-gray-5)}.dsc-chart-legend-item i{width:8px;height:8px;border-radius:50%;display:inline-block;box-shadow:0 0 6px currentColor}.dsc-chart-last{margin-left:auto;font-variant-numeric:tabular-nums;color:var(--dsc-neon);font-size:13px;font-weight:650}.dsc-fault-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.dsc-fault-list li{display:flex;flex-wrap:wrap;align-items:center;gap:10px}.dsc-empty{padding:18px 14px;border:1px dashed var(--dsc-gray-3);border-radius:8px;color:var(--dsc-gray-5);background:#00000040;font-size:.9rem;line-height:1.45}.dsc-empty--ok{border-style:solid;border-color:var(--dsc-neon-dim);color:var(--dsc-neon)}.dsc-btn:disabled{opacity:.45;cursor:not-allowed}.dsc-glass{background:var(--dsc-glass);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid var(--dsc-glass-border);border-radius:var(--dsc-radius-lg);box-shadow:var(--dsc-shadow)}.dsc-glass--glow{border-color:var(--dsc-teal-dim);box-shadow:0 0 0 1px #26c6da26,0 0 24px #26c6da1f}.dsc-icon-btn{appearance:none;width:36px;height:36px;padding:0;display:inline-flex;align-items:center;justify-content:center;border-radius:10px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);cursor:pointer;box-shadow:var(--dsc-shadow-tight);transition:border-color .12s ease,background .12s ease,transform .1s ease}.dsc-icon-btn:hover{border-color:var(--dsc-teal-dim);color:var(--dsc-teal)}.dsc-icon-btn:active{transform:translateY(1px)}.dsc-result-chip{display:inline-flex;align-items:center;gap:8px;max-width:100%;padding:8px 12px;border-radius:999px;border:1px solid var(--dsc-teal-dim);background:#26c6da1a;color:var(--dsc-white);font-size:.9rem}.dsc-result-chip span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dsc-overflow{position:relative;display:inline-block}.dsc-overflow-menu{position:absolute;right:0;top:calc(100% + 6px);z-index:40;min-width:180px;padding:6px;background:var(--dsc-black-2);border:1px solid var(--dsc-gray-3);border-radius:10px;box-shadow:var(--dsc-shadow)}.dsc-overflow-menu button{appearance:none;width:100%;text-align:left;border:0;background:transparent;color:var(--dsc-white);font:inherit;font-size:.88rem;padding:10px 12px;border-radius:8px;cursor:pointer}.dsc-overflow-menu button:hover{background:#26c6da1f;color:var(--dsc-teal)}.dsc-drawer-root{position:fixed;inset:0;z-index:80;pointer-events:none}.dsc-drawer-root.is-open{pointer-events:auto}.dsc-drawer-scrim{position:absolute;inset:0;background:#00000073;opacity:0;transition:opacity .18s ease}.dsc-drawer-root.is-open .dsc-drawer-scrim{opacity:1}.dsc-drawer-panel{position:absolute;top:0;bottom:0;width:min(380px,92vw);background:linear-gradient(165deg,#121a16,#0a100e);border:1px solid var(--dsc-glass-border);box-shadow:-12px 0 40px #0000008c;display:flex;flex-direction:column;transition:transform .22s ease}.dsc-drawer-panel.right{right:0;transform:translate(105%);border-radius:14px 0 0 14px}.dsc-drawer-panel.left{left:0;transform:translate(-105%);border-radius:0 14px 14px 0}.dsc-drawer-root.is-open .dsc-drawer-panel.right,.dsc-drawer-root.is-open .dsc-drawer-panel.left{transform:none}.dsc-drawer-rail{position:absolute;top:50%;transform:translateY(-50%);width:28px;height:64px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:2}.dsc-drawer-panel.right .dsc-drawer-rail{left:-28px;border-radius:10px 0 0 10px}.dsc-drawer-panel.left .dsc-drawer-rail{right:-28px;border-radius:0 10px 10px 0}.dsc-drawer-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid var(--dsc-gray-3)}.dsc-drawer-head h2{margin:0;font-size:.85rem;letter-spacing:.12em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-drawer-body{flex:1;overflow:auto;padding:14px 16px}.dsc-soil{width:100%;max-width:280px;margin:0 auto}.dsc-soil-pot{position:relative;width:100%;aspect-ratio:4 / 5;border-radius:12px 12px 28px 28px;border:2px solid rgba(120,160,130,.45);background:linear-gradient(180deg,#1a1410,#0e0c0a);overflow:hidden;box-shadow:inset 0 0 24px #0000008c,0 0 20px #26c6da14}.dsc-soil-pot.is-valid{border-color:var(--dsc-teal-dim);box-shadow:inset 0 0 24px #0000008c,0 0 28px #26c6da47,0 0 42px #39ff141f}.dsc-soil-layer{position:absolute;left:8%;right:8%;display:flex;align-items:center;justify-content:center;font-size:.72rem;letter-spacing:.04em;color:#f4f7f4eb;text-shadow:0 1px 2px rgba(0,0,0,.65);border-top:1px solid rgba(255,255,255,.08)}.dsc-soil-empty{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--dsc-gray-5);font-size:.85rem;padding:16px;text-align:center}.dsc-seat-layout{display:grid;grid-template-columns:minmax(200px,320px) 1fr;gap:18px;align-items:start}@media(max-width:900px){.dsc-seat-layout{grid-template-columns:1fr}}.dsc-seat-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.dsc-table{width:100%;border-collapse:collapse;font-size:.88rem}.dsc-table th,.dsc-table td{text-align:left;padding:8px 6px;border-bottom:1px solid var(--dsc-gray-3)}.dsc-table th{font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--dsc-gray-5);font-weight:600}.dsc-table tr{cursor:pointer}.dsc-table tr:hover td{background:#26c6da0f}.dsc-btn.teal{border-color:var(--dsc-teal-dim);background:#26c6da2e;color:var(--dsc-white);box-shadow:0 0 18px #26c6da33}.dsc-btn.teal.primary{background:var(--dsc-teal);color:#041018;font-weight:650}.dsc-held-tag{margin-left:8px;font-size:.65rem;letter-spacing:.08em;color:var(--dsc-amber);vertical-align:middle}.dsc-kpi-hit,.dsc-gauge-hit{appearance:none;border:0;background:transparent;padding:0;margin:0;color:inherit;font:inherit;text-align:left;cursor:pointer;width:100%;display:block}.dsc-card.is-stale,.dsc-gauge.is-stale{opacity:.88;border-color:var(--dsc-amber)}.dsc-gauge.is-clickable:hover,.dsc-kpi-hit:hover .dsc-card{border-color:var(--dsc-blue-dim)}.dsc-timespan{display:inline-flex;flex-wrap:wrap;gap:6px}.dsc-spark-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}.dsc-sparkline{display:block;margin-top:4px}.dsc-gotwant{display:flex;flex-direction:column;gap:10px}.dsc-gotwant-row{display:grid;grid-template-columns:64px 1fr;gap:6px 10px;align-items:center}.dsc-gotwant-label{font-size:.75rem;color:var(--dsc-gray-5);letter-spacing:.04em}.dsc-gotwant-track{position:relative;height:10px;border-radius:999px;background:#ffffff0f;overflow:hidden;grid-column:2}.dsc-gotwant-want{position:absolute;inset:0 auto 0 0;background:#2ec4d647;border-right:1px solid var(--dsc-teal)}.dsc-gotwant-got{position:absolute;inset:2px auto 2px 0;background:linear-gradient(90deg,var(--dsc-blue),var(--dsc-teal));border-radius:999px}.dsc-gotwant-vals{grid-column:2;display:flex;justify-content:space-between;font-size:.72rem;font-family:var(--dsc-mono)}.dsc-seat-editors{display:grid;gap:10px}.dsc-seat-editors label{display:flex;flex-direction:column;gap:4px;font-size:.75rem;color:var(--dsc-gray-5)}.dsc-seat-editors input,.dsc-seat-editors select,.dsc-seat-editors textarea{background:var(--dsc-gray-1);border:1px solid var(--dsc-glass-border);border-radius:8px;color:var(--dsc-white);padding:8px 10px;font:inherit}.dsc-root-matrix .dsc-tone-ok{color:var(--dsc-neon)}.dsc-root-matrix .dsc-tone-warn{color:var(--dsc-amber)}.dsc-root-matrix .dsc-tone-bad{color:var(--dsc-bad)}.dsc-root-matrix .dsc-tone-stale{color:var(--dsc-amber);opacity:.85}.dsc-tent-cockpit-strip{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}@media(prefers-reduced-motion:reduce){.dsc-drawer-panel,.dsc-drawer-scrim{transition:none!important}}.dsc-decision-root{position:fixed;inset:0;z-index:120;display:flex;align-items:center;justify-content:center}.dsc-decision-scrim{position:absolute;inset:0;background:#04080ab8;backdrop-filter:blur(6px)}.dsc-decision-panel{position:relative;z-index:1;width:min(720px,94vw);max-height:86vh;overflow:auto;background:linear-gradient(165deg,#121a16,#0a100e);border:1px solid var(--dsc-glass-border);border-radius:14px;box-shadow:0 24px 80px #0000008c;padding:16px 18px}.dsc-decision-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.dsc-decision-head h2{margin:0;font-size:.95rem;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-decision-help{min-height:8px;margin-top:10px}.dsc-decision-foot{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}.dsc-result-chip.is-empty{border-color:#78a08247;background:#121c1673;color:var(--dsc-gray-5)}.dsc-result-chip-hit{appearance:none;border:0;background:transparent;padding:0;color:inherit;font:inherit;cursor:pointer;max-width:100%}.dsc-coupled-mix .dsc-mix-row{display:grid;grid-template-columns:minmax(140px,1.2fr) 140px 48px 64px auto;gap:8px;align-items:end;margin-bottom:8px}.dsc-nutrient-slot{display:grid;grid-template-columns:minmax(140px,1fr) 88px 64px auto;gap:8px;align-items:end;margin-top:8px}.dsc-catalog-hits{list-style:none;margin:8px 0 0;padding:0;max-height:280px;overflow:auto}.dsc-catalog-hits button{appearance:none;width:100%;text-align:left;background:transparent;border:0;color:inherit;font:inherit;padding:8px 4px;cursor:pointer;display:flex;gap:8px}.dsc-catalog-hits button:hover{background:#26c6da1a}.dsc-catalog-picker input[type=search]{width:100%;box-sizing:border-box;background:var(--dsc-gray-1);border:1px solid var(--dsc-glass-border);border-radius:8px;color:var(--dsc-white);padding:8px 10px}.dsc-vessel-glyph{display:inline-flex;flex-direction:column;align-items:center;gap:2px}.dsc-vessel-glyph-label{font-size:.65rem;color:var(--dsc-gray-5)}.dsc-kit-constellation{width:100%;max-height:420px;color:inherit;margin-bottom:8px}.dsc-kit-pulse-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px}.dsc-kit-node{display:flex;align-items:center;gap:8px;padding:8px;border:1px dashed var(--dsc-gray-3);border-radius:10px}.dsc-kit-node.is-ok{border-style:solid;border-color:var(--dsc-teal-dim)}.dsc-kit-node i{width:10px;height:10px;border-radius:50%;background:var(--dsc-gray-5)}.dsc-kit-node.is-ok i{background:var(--dsc-neon)}.dsc-kit-node.is-held i{background:var(--dsc-amber)}.dsc-kit-node.is-oos i,.dsc-kit-node.is-missing i,.dsc-kit-node.is-dark i{background:transparent;border:1px dashed var(--dsc-bad)}.dsc-lung-svg,.dsc-tank-svg{width:100%;height:auto;color:var(--dsc-white)}.dsc-cal-curve{margin:12px 0 16px}.dsc-cal-curve strong{display:block;margin-bottom:6px}.dsc-honesty-hit{appearance:none;border:0;background:transparent;padding:0;cursor:pointer}.dsc-row-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.dsc-detail-list dt{font-size:.7rem;color:var(--dsc-gray-5);margin-top:8px}.dsc-detail-list dd{margin:0}button.dsc-chip{font:inherit;letter-spacing:inherit;text-transform:inherit;cursor:pointer;color:inherit}button.dsc-chip.is-clickable:hover{border-color:var(--dsc-teal)}.dsc-duty-hit{appearance:none;border:0;background:transparent;padding:0;width:100%;text-align:left;cursor:pointer;color:inherit;font:inherit}.dsc-duty-strip{display:flex;flex-direction:column;gap:4px;margin:8px 0}.dsc-duty-meta{display:flex;justify-content:space-between;gap:8px;font-size:.72rem;letter-spacing:.04em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-duty-svg{width:100%;height:18px;display:block}.dsc-inspector-playbook{margin:10px 0;padding:10px 12px;border:1px solid var(--dsc-glass-border);border-radius:10px;background:#00000038}.dsc-inspector-playbook strong{display:block;margin-bottom:4px}.dsc-inspector-playbook p{margin:4px 0}.dsc-stage-track{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px}.dsc-stage-pill{font-size:.65rem;letter-spacing:.04em;text-transform:uppercase;padding:5px 8px;border-radius:6px;background:var(--dsc-gray-2);color:var(--dsc-gray-5)}.dsc-stage-pill.is-on{background:color-mix(in srgb,var(--dsc-blue) 45%,transparent);color:var(--dsc-white)}.dsc-stage-pill.is-next{background:color-mix(in srgb,var(--dsc-amber) 22%,transparent);color:var(--dsc-amber)}.dsc-scheduler-lanes{display:flex;flex-direction:column;gap:6px;margin-top:8px}.dsc-scheduler-lane{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:8px 10px;border:1px solid var(--dsc-gray-3);border-radius:10px;background:#00000029;color:inherit;font:inherit;text-align:left;cursor:pointer}.dsc-scheduler-lane:hover:not(:disabled){border-color:var(--dsc-teal)}.dsc-scheduler-lane.is-oos,.dsc-scheduler-lane:disabled{opacity:.45;cursor:default}.dsc-air-path{display:flex;flex-direction:column;gap:8px}.dsc-air-svg{width:100%;height:auto;display:block;color:var(--dsc-white)}.dsc-target-heroes{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px}.dsc-tent-targets.is-hero{border-color:var(--dsc-teal-dim);padding:14px 16px}.dsc-target-hint{font-size:.65rem;color:var(--dsc-gray-5);letter-spacing:.03em}.dsc-got-want-hit{appearance:none;border:0;background:transparent;padding:0;width:100%;text-align:left;cursor:pointer;color:inherit;font:inherit}.dsc-pot-card-head{display:flex;align-items:center;gap:10px;cursor:pointer;margin-bottom:8px}.dsc-pot-card.is-oos{opacity:.72}.dsc-npk-hit{appearance:none;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:inherit;font:inherit;font-size:.75rem;border-radius:8px;padding:6px 8px;cursor:pointer}.dsc-npk-hit:hover{border-color:var(--dsc-teal)}.dsc-light-hero .dsc-honesty{font-size:.78rem}.dsc-dash-home .dsc-gauge-matrix--dense{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px 10px}.dsc-gauge-matrix--bands{display:flex;flex-direction:column;gap:10px}.dsc-gauge-matrix--bands .dsc-gauge-row-3 .dsc-band-cell{min-width:0;padding:6px 2px 8px}.dsc-gauge-matrix--bands .dsc-gauge-row-3:not(.is-lit){opacity:.72}.dsc-gauge-matrix--bands .dsc-gauge-row-3.is-lit{opacity:1}@keyframes dsc-fan-spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.dsc-fan-spin{animation:dsc-fan-spin 1.3s linear infinite;transform-origin:center center}.dsc-chip--fan .dsc-fan-spin:nth-child(1){animation-duration:1.3s}.dsc-dash-home .dsc-band-cell{display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 4px 10px;border-radius:12px;background:#0c121c59;border:1px solid rgba(130,165,230,.12);transition:box-shadow .25s ease,border-color .25s ease,background .25s ease}.dsc-dash-home .dsc-band-cell--main,.dsc-dash-home .dsc-band-cell--clone,.dsc-dash-home .dsc-band-cell--room,.dsc-dash-home .dsc-band-cell--root{border-color:#82a5e61f;background:#0c121c59;box-shadow:none}.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-ok){border-color:#66bb6a6b;background:linear-gradient(180deg,#66bb6a14,#0c121c59)}.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-warn),.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-stale){border-color:#ffb74d80;background:linear-gradient(180deg,#ffb74d14,#0c121c59)}.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-bad){border-color:#ef53508c;background:linear-gradient(180deg,#ef535014,#0c121c59)}.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-muted){border-color:#8b95a838;background:#0c121c47}.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-warn),.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-bad){animation:dsc-band-warn 2.6s ease-in-out infinite}@keyframes dsc-band-warn{0%,to{box-shadow:inset 0 0 16px #ffb74d0f}50%{box-shadow:inset 0 0 22px #ffb74d2e,0 0 18px #ffb74d1f}}.dsc-dash-home .dsc-band-cell .dsc-gauge-hit{width:auto;display:flex;justify-content:center}.dsc-dash-home .dsc-band-cell .dsc-gauge svg{width:100%;max-width:118px;height:auto}.dsc-band-cell{display:flex;flex-direction:column;align-items:center;gap:4px}.dsc-band-cell .dsc-sparkline{opacity:.85}.dsc-dash-home .dsc-legacy-host{max-height:min(52vh,520px);overflow:hidden;border-radius:10px}.dsc-dash-home .dsc-status-strip{margin-bottom:4px}.dsc-dash-home .dsc-gauge-matrix--pots{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:8px}.dsc-banner{border-radius:10px;padding:12px 14px;border-left:3px solid rgba(148,163,184,.5);background:#0f172a8c}.dsc-banner--warn{border-left-color:#fbbf24d9;background:#fbbf2414}.dsc-banner--bad{border-left-color:#ef4444e6;background:#ef44441a}.dsc-banner strong{display:block;margin-bottom:4px}.dsc-narrator{margin-top:12px;border:1px solid rgba(56,189,248,.25);border-left:3px solid rgba(56,189,248,.45);border-radius:10px;padding:10px 14px;background:#0c121c73}.dsc-narrator summary{cursor:pointer;font-weight:600;letter-spacing:.02em}.dsc-grow-log{font-size:13px;line-height:1.5;max-height:220px;overflow-y:auto}.dsc-grow-log li{padding:4px 0;border-bottom:1px solid rgba(148,163,184,.12)}.dsc-btn.dsc-btn-primary{background:var(--dsc-teal);border-color:var(--dsc-teal);color:#041018;font-weight:650;box-shadow:0 0 16px #26c6da47,var(--dsc-shadow-tight)}.dsc-btn.dsc-btn-primary:hover:not(:disabled){filter:brightness(1.1);box-shadow:0 0 22px #26c6da73,var(--dsc-shadow-tight)}.dsc-btn.dsc-btn-secondary{background:var(--dsc-gray-2);border-color:var(--dsc-gray-3);color:var(--dsc-white)}.dsc-btn.dsc-btn-secondary:hover:not(:disabled){border-color:var(--dsc-teal-dim);color:var(--dsc-teal)}.dsc-btn.dsc-btn-danger{background:#ef535024;border-color:#ef53508c;color:#ff9e9b;font-weight:600}.dsc-btn.dsc-btn-danger:hover:not(:disabled){background:#ef535042;border-color:var(--dsc-bad);color:#ffd7d5}.dsc-btn:disabled{opacity:.5;cursor:not-allowed}.dsc-btn:focus-visible,.dsc-icon-btn:focus-visible,button:focus-visible,[role=button]:focus-visible,a:focus-visible,summary:focus-visible{outline:2px solid var(--dsc-teal);outline-offset:2px}select:focus-visible,input:focus-visible,textarea:focus-visible{outline:2px solid var(--dsc-teal);outline-offset:1px}input[type=range]{appearance:none;-webkit-appearance:none;width:100%;height:28px;margin:0;background:transparent;cursor:pointer}input[type=range]::-webkit-slider-runnable-track{height:6px;border-radius:999px;background:var(--dsc-gray-3);border:1px solid var(--dsc-glass-border)}input[type=range]::-webkit-slider-thumb{appearance:none;-webkit-appearance:none;width:18px;height:18px;margin-top:-7px;border-radius:50%;background:var(--dsc-teal);border:2px solid var(--dsc-black);box-shadow:0 0 8px var(--dsc-teal-dim)}input[type=range]:hover:not(:disabled)::-webkit-slider-thumb{box-shadow:0 0 14px var(--dsc-teal-glow)}input[type=range]::-moz-range-track{height:6px;border-radius:999px;background:var(--dsc-gray-3);border:1px solid var(--dsc-glass-border)}input[type=range]::-moz-range-progress{height:6px;border-radius:999px;background:var(--dsc-teal-dim)}input[type=range]::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:var(--dsc-teal);border:2px solid var(--dsc-black);box-shadow:0 0 8px var(--dsc-teal-dim)}input[type=range]:disabled{opacity:.45;cursor:not-allowed}input[type=range]:disabled::-webkit-slider-thumb{background:var(--dsc-gray-4);box-shadow:none}select{appearance:none;-webkit-appearance:none;min-height:38px;border-radius:8px;border:1px solid var(--dsc-gray-3);background-color:var(--dsc-gray-2);color:var(--dsc-white);font:inherit;padding:8px 32px 8px 12px;cursor:pointer;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' fill='none' stroke='%238b95a8' stroke-width='2' stroke-linecap='round'/></svg>");background-repeat:no-repeat;background-position:right 10px center}select:hover:not(:disabled){border-color:var(--dsc-teal-dim)}select:disabled{opacity:.5;cursor:not-allowed}select option{background:var(--dsc-gray-1);color:var(--dsc-white)}input[type=text],input[type=number],input[type=search],input[type=password],input[type=time],input[type=date],input[type=datetime-local],textarea{min-height:36px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);font:inherit;padding:8px 10px}input[type=text]:hover:not(:disabled),input[type=number]:hover:not(:disabled),input[type=search]:hover:not(:disabled),textarea:hover:not(:disabled){border-color:var(--dsc-teal-dim)}input[type=text]:focus,input[type=number]:focus,input[type=search]:focus,textarea:focus{border-color:var(--dsc-teal)}input::placeholder,textarea::placeholder{color:var(--dsc-gray-4);opacity:.8}input[type=checkbox]{appearance:none;-webkit-appearance:none;width:18px;height:18px;flex:none;margin:0 6px 0 0;border-radius:5px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);display:inline-block;vertical-align:middle;position:relative;cursor:pointer}input[type=checkbox]:hover:not(:disabled){border-color:var(--dsc-teal-dim)}input[type=checkbox]:checked{background:var(--dsc-teal);border-color:var(--dsc-teal)}input[type=checkbox]:checked:after{content:"";position:absolute;left:5px;top:1.5px;width:5px;height:9px;border:solid #06121a;border-width:0 2px 2px 0;transform:rotate(45deg)}input[type=checkbox]:disabled{opacity:.45;cursor:not-allowed}.dsc-kit-pulse .dsc-kit-constellation{display:block;width:100%;background:#0003;border:1px solid var(--dsc-glass-border);border-radius:var(--dsc-radius);margin-bottom:10px}@keyframes dsc-kit-node-pulse{0%,to{filter:drop-shadow(0 0 0 rgba(38,198,218,0))}50%{filter:drop-shadow(0 0 6px rgba(38,198,218,.65))}}.dsc-kit-node-running{animation:dsc-kit-node-pulse 2.4s ease-in-out infinite}.dsc-inspector-details{margin-top:14px;border-top:1px solid var(--dsc-gray-3);padding-top:10px}.dsc-inspector-details summary{cursor:pointer;color:var(--dsc-gray-5);font-size:.75rem;letter-spacing:.08em;text-transform:uppercase}@media(prefers-reduced-motion:reduce){.dsc-kit-node-running{animation:none!important}}`, Q2 = X2;
function Yb() {
  const a = At(), i = ft();
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Nt,
      {
        icon: "alert",
        title: "Not found",
        subtitle: `${a.pathname} is not a DSC route.`
      }
    ),
    /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: "Unknown hash — not a silent Mission redirect." }),
    /* @__PURE__ */ s.jsx(se, { primary: !0, onClick: () => i("/live/overview"), children: "Go Overview" })
  ] });
}
function Ws() {
  const a = At(), i = Y2(a.pathname, a.search);
  return i ? /* @__PURE__ */ s.jsx(rs, { to: i, replace: !0 }) : /* @__PURE__ */ s.jsx(Yb, {});
}
function Z2({ surfaceVersion: a = "7.2.0" }) {
  const i = At(), r = ft(), o = q2(i.pathname), d = G2[o];
  return x.useEffect(() => {
    if (i.pathname === "/live/climate" || i.pathname === "/ops/home") return;
    const h = new URLSearchParams(i.search);
    if (!h.has("tent") && !h.has("zone")) return;
    h.delete("tent"), h.delete("zone");
    const f = h.toString();
    r({ pathname: i.pathname, search: f ? `?${f}` : "" }, { replace: !0 });
  }, [i.pathname, i.search, r]), /* @__PURE__ */ s.jsxs("div", { className: "dsc-shell", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-brand-row", children: [
      /* @__PURE__ */ s.jsxs(qr, { className: "dsc-brand", to: "/live/overview", children: [
        /* @__PURE__ */ s.jsx(nn, { name: "brand", size: 36, color: "var(--dsc-blue)" }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-brand-title", children: /* @__PURE__ */ s.jsx("strong", { children: "DSC - A Plausible Deniability Project." }) })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-muted", style: { fontSize: 12, letterSpacing: "0.08em" }, children: [
        "SURFACE ",
        a
      ] })
    ] }),
    /* @__PURE__ */ s.jsx(D0, {}),
    /* @__PURE__ */ s.jsx("nav", { className: "dsc-primary-tabs", "aria-label": "Primary", children: F2.map((h) => /* @__PURE__ */ s.jsxs(
      qr,
      {
        to: h.path,
        className: ({ isActive: f }) => `dsc-tab dsc-tab--${h.id}${f || o === h.id ? " active" : ""}`,
        children: [
          /* @__PURE__ */ s.jsx(nn, { name: h.icon, size: 15 }),
          h.label
        ]
      },
      h.id
    )) }),
    d.length > 1 ? /* @__PURE__ */ s.jsx("nav", { className: "dsc-secondary-tabs", "aria-label": "Section pages", children: d.map((h) => /* @__PURE__ */ s.jsxs(
      qr,
      {
        to: h.path,
        end: h.path === "/fleet",
        className: ({ isActive: f }) => `dsc-tab${f ? " active" : ""}`,
        children: [
          /* @__PURE__ */ s.jsx(nn, { name: h.icon, size: 14 }),
          h.label
        ]
      },
      h.id
    )) }) : null,
    /* @__PURE__ */ s.jsx(Z0, {}),
    /* @__PURE__ */ s.jsx(U1, {}),
    /* @__PURE__ */ s.jsxs(py, { children: [
      /* @__PURE__ */ s.jsx(De, { path: "/", element: /* @__PURE__ */ s.jsx(rs, { to: "/live/overview", replace: !0 }) }),
      /* @__PURE__ */ s.jsx(De, { path: "/live", element: /* @__PURE__ */ s.jsx(rs, { to: "/live/overview", replace: !0 }) }),
      /* @__PURE__ */ s.jsx(De, { path: "/live/overview", element: /* @__PURE__ */ s.jsx(D2, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/live/mission", element: /* @__PURE__ */ s.jsx(W1, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/live/twin", element: /* @__PURE__ */ s.jsx(y_, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/live/climate", element: /* @__PURE__ */ s.jsx(r2, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/live/4x8", element: /* @__PURE__ */ s.jsx(f2, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/live/2x4", element: /* @__PURE__ */ s.jsx(m2, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/live/main", element: /* @__PURE__ */ s.jsx(rs, { to: "/live/4x8", replace: !0 }) }),
      /* @__PURE__ */ s.jsx(De, { path: "/live/clone", element: /* @__PURE__ */ s.jsx(rs, { to: "/live/2x4", replace: !0 }) }),
      /* @__PURE__ */ s.jsx(De, { path: "/live/root", element: /* @__PURE__ */ s.jsx(o2, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/live/light", element: /* @__PURE__ */ s.jsx(h2, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/grow", element: /* @__PURE__ */ s.jsx(rs, { to: "/grow/compose", replace: !0 }) }),
      /* @__PURE__ */ s.jsx(De, { path: "/grow/compose", element: /* @__PURE__ */ s.jsx(H1, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/grow/research", element: /* @__PURE__ */ s.jsx(L1, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/grow/roster", element: /* @__PURE__ */ s.jsx($1, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/tune", element: /* @__PURE__ */ s.jsx(rs, { to: "/tune/learning", replace: !0 }) }),
      /* @__PURE__ */ s.jsx(De, { path: "/tune/learning", element: /* @__PURE__ */ s.jsx(g2, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/tune/analytics", element: /* @__PURE__ */ s.jsx(v2, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/fleet", element: /* @__PURE__ */ s.jsx(x2, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/fleet/calibrate", element: /* @__PURE__ */ s.jsx($2, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/fleet/settings", element: /* @__PURE__ */ s.jsx(E2, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/ops/home", element: /* @__PURE__ */ s.jsx(B2, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/ops/dash", element: /* @__PURE__ */ s.jsx(y_, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/ops/*", element: /* @__PURE__ */ s.jsx(Ws, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/plant/*", element: /* @__PURE__ */ s.jsx(Ws, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/plant", element: /* @__PURE__ */ s.jsx(Ws, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/advanced/*", element: /* @__PURE__ */ s.jsx(Ws, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/advanced", element: /* @__PURE__ */ s.jsx(Ws, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "/system", element: /* @__PURE__ */ s.jsx(Ws, {}) }),
      /* @__PURE__ */ s.jsx(De, { path: "*", element: /* @__PURE__ */ s.jsx(Yb, {}) })
    ] })
  ] });
}
function K2({
  hass: a,
  surfaceVersion: i = "7.2.0",
  hassRevision: r = 0,
  fleetSource: o = "ha"
}) {
  return /* @__PURE__ */ s.jsx(e0, { hass: a, revision: r, children: /* @__PURE__ */ s.jsx(V1, { children: /* @__PURE__ */ s.jsx(C1, { children: /* @__PURE__ */ s.jsx(F1, { children: /* @__PURE__ */ s.jsx(Z2, { surfaceVersion: i }) }) }) }) });
}
function J2({
  panel: a
}) {
  const [i, r] = x.useState(() => a.hass), [o, d] = x.useState(0);
  return x.useEffect(() => {
    const h = () => {
      r(a.hass), d((f) => f + 1);
    };
    return h(), a.addEventListener("hass-updated", h), () => {
      a.removeEventListener("hass-updated", h);
    };
  }, [a]), /* @__PURE__ */ s.jsx(i0, { hass: i, tick: o, source: "ha", children: /* @__PURE__ */ s.jsx(By, { children: /* @__PURE__ */ s.jsx(K2, { hass: i, fleetSource: "ha" }) }) });
}
class P2 extends HTMLElement {
  constructor() {
    super(...arguments);
    Tr(this, "_root", null);
    Tr(this, "_hass", null);
    Tr(this, "_mounted", !1);
  }
  set hass(r) {
    this._hass = r, this.dispatchEvent(new Event("hass-updated"));
  }
  get hass() {
    return this._hass;
  }
  connectedCallback() {
    if (this.shadowRoot || this.attachShadow({ mode: "open" }), !this._mounted) {
      const r = document.createElement("style");
      r.textContent = `:host{display:block;height:100%;background:#0a0e18;color:#eef1f8;}
${Q2}`, this.shadowRoot.appendChild(r);
      const o = document.createElement("div");
      o.className = "dsc-root", o.style.height = "100%", this.shadowRoot.appendChild(o), this._root = _x.createRoot(o), this._root.render(/* @__PURE__ */ s.jsx(J2, { panel: this })), this._mounted = !0;
    }
  }
  disconnectedCallback() {
    this._root?.unmount(), this._root = null, this._mounted = !1;
  }
}
customElements.get("dsc-hub-panel") || customElements.define("dsc-hub-panel", P2);
export {
  P2 as default
};
//# sourceMappingURL=dsc-hub-panel.js.map
