var Kg = Object.defineProperty;
var Fg = (a, r, o) => r in a ? Kg(a, r, { enumerable: !0, configurable: !0, writable: !0, value: o }) : a[r] = o;
var Pi = (a, r, o) => Fg(a, typeof r != "symbol" ? r + "" : r, o);
var Ou = { exports: {} }, ws = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var dm;
function Jg() {
  if (dm) return ws;
  dm = 1;
  var a = Symbol.for("react.transitional.element"), r = Symbol.for("react.fragment");
  function o(u, f, h) {
    var m = null;
    if (h !== void 0 && (m = "" + h), f.key !== void 0 && (m = "" + f.key), "key" in f) {
      h = {};
      for (var b in f)
        b !== "key" && (h[b] = f[b]);
    } else h = f;
    return f = h.ref, {
      $$typeof: a,
      type: u,
      key: m,
      ref: f !== void 0 ? f : null,
      props: h
    };
  }
  return ws.Fragment = r, ws.jsx = o, ws.jsxs = o, ws;
}
var fm;
function Wg() {
  return fm || (fm = 1, Ou.exports = Jg()), Ou.exports;
}
var s = Wg(), Du = { exports: {} }, ve = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hm;
function Pg() {
  if (hm) return ve;
  hm = 1;
  var a = Symbol.for("react.transitional.element"), r = Symbol.for("react.portal"), o = Symbol.for("react.fragment"), u = Symbol.for("react.strict_mode"), f = Symbol.for("react.profiler"), h = Symbol.for("react.consumer"), m = Symbol.for("react.context"), b = Symbol.for("react.forward_ref"), p = Symbol.for("react.suspense"), g = Symbol.for("react.memo"), v = Symbol.for("react.lazy"), y = Symbol.for("react.activity"), j = Symbol.iterator;
  function E(w) {
    return w === null || typeof w != "object" ? null : (w = j && w[j] || w["@@iterator"], typeof w == "function" ? w : null);
  }
  var A = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, M = Object.assign, T = {};
  function B(w, L, Z) {
    this.props = w, this.context = L, this.refs = T, this.updater = Z || A;
  }
  B.prototype.isReactComponent = {}, B.prototype.setState = function(w, L) {
    if (typeof w != "object" && typeof w != "function" && w != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, w, L, "setState");
  }, B.prototype.forceUpdate = function(w) {
    this.updater.enqueueForceUpdate(this, w, "forceUpdate");
  };
  function X() {
  }
  X.prototype = B.prototype;
  function G(w, L, Z) {
    this.props = w, this.context = L, this.refs = T, this.updater = Z || A;
  }
  var ne = G.prototype = new X();
  ne.constructor = G, M(ne, B.prototype), ne.isPureReactComponent = !0;
  var V = Array.isArray;
  function P() {
  }
  var F = { H: null, A: null, T: null, S: null }, ie = Object.prototype.hasOwnProperty;
  function pe(w, L, Z) {
    var J = Z.ref;
    return {
      $$typeof: a,
      type: w,
      key: L,
      ref: J !== void 0 ? J : null,
      props: Z
    };
  }
  function ae(w, L) {
    return pe(w.type, L, w.props);
  }
  function re(w) {
    return typeof w == "object" && w !== null && w.$$typeof === a;
  }
  function de(w) {
    var L = { "=": "=0", ":": "=2" };
    return "$" + w.replace(/[=:]/g, function(Z) {
      return L[Z];
    });
  }
  var R = /\/+/g;
  function W(w, L) {
    return typeof w == "object" && w !== null && w.key != null ? de("" + w.key) : L.toString(36);
  }
  function ee(w) {
    switch (w.status) {
      case "fulfilled":
        return w.value;
      case "rejected":
        throw w.reason;
      default:
        switch (typeof w.status == "string" ? w.then(P, P) : (w.status = "pending", w.then(
          function(L) {
            w.status === "pending" && (w.status = "fulfilled", w.value = L);
          },
          function(L) {
            w.status === "pending" && (w.status = "rejected", w.reason = L);
          }
        )), w.status) {
          case "fulfilled":
            return w.value;
          case "rejected":
            throw w.reason;
        }
    }
    throw w;
  }
  function C(w, L, Z, J, ce) {
    var he = typeof w;
    (he === "undefined" || he === "boolean") && (w = null);
    var ge = !1;
    if (w === null) ge = !0;
    else
      switch (he) {
        case "bigint":
        case "string":
        case "number":
          ge = !0;
          break;
        case "object":
          switch (w.$$typeof) {
            case a:
            case r:
              ge = !0;
              break;
            case v:
              return ge = w._init, C(
                ge(w._payload),
                L,
                Z,
                J,
                ce
              );
          }
      }
    if (ge)
      return ce = ce(w), ge = J === "" ? "." + W(w, 0) : J, V(ce) ? (Z = "", ge != null && (Z = ge.replace(R, "$&/") + "/"), C(ce, L, Z, "", function(tn) {
        return tn;
      })) : ce != null && (re(ce) && (ce = ae(
        ce,
        Z + (ce.key == null || w && w.key === ce.key ? "" : ("" + ce.key).replace(
          R,
          "$&/"
        ) + "/") + ge
      )), L.push(ce)), 1;
    ge = 0;
    var Ke = J === "" ? "." : J + ":";
    if (V(w))
      for (var Ae = 0; Ae < w.length; Ae++)
        J = w[Ae], he = Ke + W(J, Ae), ge += C(
          J,
          L,
          Z,
          he,
          ce
        );
    else if (Ae = E(w), typeof Ae == "function")
      for (w = Ae.call(w), Ae = 0; !(J = w.next()).done; )
        J = J.value, he = Ke + W(J, Ae++), ge += C(
          J,
          L,
          Z,
          he,
          ce
        );
    else if (he === "object") {
      if (typeof w.then == "function")
        return C(
          ee(w),
          L,
          Z,
          J,
          ce
        );
      throw L = String(w), Error(
        "Objects are not valid as a React child (found: " + (L === "[object Object]" ? "object with keys {" + Object.keys(w).join(", ") + "}" : L) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return ge;
  }
  function Y(w, L, Z) {
    if (w == null) return w;
    var J = [], ce = 0;
    return C(w, J, "", "", function(he) {
      return L.call(Z, he, ce++);
    }), J;
  }
  function K(w) {
    if (w._status === -1) {
      var L = w._result;
      L = L(), L.then(
        function(Z) {
          (w._status === 0 || w._status === -1) && (w._status = 1, w._result = Z);
        },
        function(Z) {
          (w._status === 0 || w._status === -1) && (w._status = 2, w._result = Z);
        }
      ), w._status === -1 && (w._status = 0, w._result = L);
    }
    if (w._status === 1) return w._result.default;
    throw w._result;
  }
  var I = typeof reportError == "function" ? reportError : function(w) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var L = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof w == "object" && w !== null && typeof w.message == "string" ? String(w.message) : String(w),
        error: w
      });
      if (!window.dispatchEvent(L)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", w);
      return;
    }
    console.error(w);
  }, me = {
    map: Y,
    forEach: function(w, L, Z) {
      Y(
        w,
        function() {
          L.apply(this, arguments);
        },
        Z
      );
    },
    count: function(w) {
      var L = 0;
      return Y(w, function() {
        L++;
      }), L;
    },
    toArray: function(w) {
      return Y(w, function(L) {
        return L;
      }) || [];
    },
    only: function(w) {
      if (!re(w))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return w;
    }
  };
  return ve.Activity = y, ve.Children = me, ve.Component = B, ve.Fragment = o, ve.Profiler = f, ve.PureComponent = G, ve.StrictMode = u, ve.Suspense = p, ve.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = F, ve.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(w) {
      return F.H.useMemoCache(w);
    }
  }, ve.cache = function(w) {
    return function() {
      return w.apply(null, arguments);
    };
  }, ve.cacheSignal = function() {
    return null;
  }, ve.cloneElement = function(w, L, Z) {
    if (w == null)
      throw Error(
        "The argument must be a React element, but you passed " + w + "."
      );
    var J = M({}, w.props), ce = w.key;
    if (L != null)
      for (he in L.key !== void 0 && (ce = "" + L.key), L)
        !ie.call(L, he) || he === "key" || he === "__self" || he === "__source" || he === "ref" && L.ref === void 0 || (J[he] = L[he]);
    var he = arguments.length - 2;
    if (he === 1) J.children = Z;
    else if (1 < he) {
      for (var ge = Array(he), Ke = 0; Ke < he; Ke++)
        ge[Ke] = arguments[Ke + 2];
      J.children = ge;
    }
    return pe(w.type, ce, J);
  }, ve.createContext = function(w) {
    return w = {
      $$typeof: m,
      _currentValue: w,
      _currentValue2: w,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, w.Provider = w, w.Consumer = {
      $$typeof: h,
      _context: w
    }, w;
  }, ve.createElement = function(w, L, Z) {
    var J, ce = {}, he = null;
    if (L != null)
      for (J in L.key !== void 0 && (he = "" + L.key), L)
        ie.call(L, J) && J !== "key" && J !== "__self" && J !== "__source" && (ce[J] = L[J]);
    var ge = arguments.length - 2;
    if (ge === 1) ce.children = Z;
    else if (1 < ge) {
      for (var Ke = Array(ge), Ae = 0; Ae < ge; Ae++)
        Ke[Ae] = arguments[Ae + 2];
      ce.children = Ke;
    }
    if (w && w.defaultProps)
      for (J in ge = w.defaultProps, ge)
        ce[J] === void 0 && (ce[J] = ge[J]);
    return pe(w, he, ce);
  }, ve.createRef = function() {
    return { current: null };
  }, ve.forwardRef = function(w) {
    return { $$typeof: b, render: w };
  }, ve.isValidElement = re, ve.lazy = function(w) {
    return {
      $$typeof: v,
      _payload: { _status: -1, _result: w },
      _init: K
    };
  }, ve.memo = function(w, L) {
    return {
      $$typeof: g,
      type: w,
      compare: L === void 0 ? null : L
    };
  }, ve.startTransition = function(w) {
    var L = F.T, Z = {};
    F.T = Z;
    try {
      var J = w(), ce = F.S;
      ce !== null && ce(Z, J), typeof J == "object" && J !== null && typeof J.then == "function" && J.then(P, I);
    } catch (he) {
      I(he);
    } finally {
      L !== null && Z.types !== null && (L.types = Z.types), F.T = L;
    }
  }, ve.unstable_useCacheRefresh = function() {
    return F.H.useCacheRefresh();
  }, ve.use = function(w) {
    return F.H.use(w);
  }, ve.useActionState = function(w, L, Z) {
    return F.H.useActionState(w, L, Z);
  }, ve.useCallback = function(w, L) {
    return F.H.useCallback(w, L);
  }, ve.useContext = function(w) {
    return F.H.useContext(w);
  }, ve.useDebugValue = function() {
  }, ve.useDeferredValue = function(w, L) {
    return F.H.useDeferredValue(w, L);
  }, ve.useEffect = function(w, L) {
    return F.H.useEffect(w, L);
  }, ve.useEffectEvent = function(w) {
    return F.H.useEffectEvent(w);
  }, ve.useId = function() {
    return F.H.useId();
  }, ve.useImperativeHandle = function(w, L, Z) {
    return F.H.useImperativeHandle(w, L, Z);
  }, ve.useInsertionEffect = function(w, L) {
    return F.H.useInsertionEffect(w, L);
  }, ve.useLayoutEffect = function(w, L) {
    return F.H.useLayoutEffect(w, L);
  }, ve.useMemo = function(w, L) {
    return F.H.useMemo(w, L);
  }, ve.useOptimistic = function(w, L) {
    return F.H.useOptimistic(w, L);
  }, ve.useReducer = function(w, L, Z) {
    return F.H.useReducer(w, L, Z);
  }, ve.useRef = function(w) {
    return F.H.useRef(w);
  }, ve.useState = function(w) {
    return F.H.useState(w);
  }, ve.useSyncExternalStore = function(w, L, Z) {
    return F.H.useSyncExternalStore(
      w,
      L,
      Z
    );
  }, ve.useTransition = function() {
    return F.H.useTransition();
  }, ve.version = "19.2.8", ve;
}
var mm;
function Fu() {
  return mm || (mm = 1, Du.exports = Pg()), Du.exports;
}
var _ = Fu(), Hu = { exports: {} }, Ns = {}, Lu = { exports: {} }, Uu = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var pm;
function Ig() {
  return pm || (pm = 1, (function(a) {
    function r(C, Y) {
      var K = C.length;
      C.push(Y);
      e: for (; 0 < K; ) {
        var I = K - 1 >>> 1, me = C[I];
        if (0 < f(me, Y))
          C[I] = Y, C[K] = me, K = I;
        else break e;
      }
    }
    function o(C) {
      return C.length === 0 ? null : C[0];
    }
    function u(C) {
      if (C.length === 0) return null;
      var Y = C[0], K = C.pop();
      if (K !== Y) {
        C[0] = K;
        e: for (var I = 0, me = C.length, w = me >>> 1; I < w; ) {
          var L = 2 * (I + 1) - 1, Z = C[L], J = L + 1, ce = C[J];
          if (0 > f(Z, K))
            J < me && 0 > f(ce, Z) ? (C[I] = ce, C[J] = K, I = J) : (C[I] = Z, C[L] = K, I = L);
          else if (J < me && 0 > f(ce, K))
            C[I] = ce, C[J] = K, I = J;
          else break e;
        }
      }
      return Y;
    }
    function f(C, Y) {
      var K = C.sortIndex - Y.sortIndex;
      return K !== 0 ? K : C.id - Y.id;
    }
    if (a.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var h = performance;
      a.unstable_now = function() {
        return h.now();
      };
    } else {
      var m = Date, b = m.now();
      a.unstable_now = function() {
        return m.now() - b;
      };
    }
    var p = [], g = [], v = 1, y = null, j = 3, E = !1, A = !1, M = !1, T = !1, B = typeof setTimeout == "function" ? setTimeout : null, X = typeof clearTimeout == "function" ? clearTimeout : null, G = typeof setImmediate < "u" ? setImmediate : null;
    function ne(C) {
      for (var Y = o(g); Y !== null; ) {
        if (Y.callback === null) u(g);
        else if (Y.startTime <= C)
          u(g), Y.sortIndex = Y.expirationTime, r(p, Y);
        else break;
        Y = o(g);
      }
    }
    function V(C) {
      if (M = !1, ne(C), !A)
        if (o(p) !== null)
          A = !0, P || (P = !0, de());
        else {
          var Y = o(g);
          Y !== null && ee(V, Y.startTime - C);
        }
    }
    var P = !1, F = -1, ie = 5, pe = -1;
    function ae() {
      return T ? !0 : !(a.unstable_now() - pe < ie);
    }
    function re() {
      if (T = !1, P) {
        var C = a.unstable_now();
        pe = C;
        var Y = !0;
        try {
          e: {
            A = !1, M && (M = !1, X(F), F = -1), E = !0;
            var K = j;
            try {
              t: {
                for (ne(C), y = o(p); y !== null && !(y.expirationTime > C && ae()); ) {
                  var I = y.callback;
                  if (typeof I == "function") {
                    y.callback = null, j = y.priorityLevel;
                    var me = I(
                      y.expirationTime <= C
                    );
                    if (C = a.unstable_now(), typeof me == "function") {
                      y.callback = me, ne(C), Y = !0;
                      break t;
                    }
                    y === o(p) && u(p), ne(C);
                  } else u(p);
                  y = o(p);
                }
                if (y !== null) Y = !0;
                else {
                  var w = o(g);
                  w !== null && ee(
                    V,
                    w.startTime - C
                  ), Y = !1;
                }
              }
              break e;
            } finally {
              y = null, j = K, E = !1;
            }
            Y = void 0;
          }
        } finally {
          Y ? de() : P = !1;
        }
      }
    }
    var de;
    if (typeof G == "function")
      de = function() {
        G(re);
      };
    else if (typeof MessageChannel < "u") {
      var R = new MessageChannel(), W = R.port2;
      R.port1.onmessage = re, de = function() {
        W.postMessage(null);
      };
    } else
      de = function() {
        B(re, 0);
      };
    function ee(C, Y) {
      F = B(function() {
        C(a.unstable_now());
      }, Y);
    }
    a.unstable_IdlePriority = 5, a.unstable_ImmediatePriority = 1, a.unstable_LowPriority = 4, a.unstable_NormalPriority = 3, a.unstable_Profiling = null, a.unstable_UserBlockingPriority = 2, a.unstable_cancelCallback = function(C) {
      C.callback = null;
    }, a.unstable_forceFrameRate = function(C) {
      0 > C || 125 < C ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : ie = 0 < C ? Math.floor(1e3 / C) : 5;
    }, a.unstable_getCurrentPriorityLevel = function() {
      return j;
    }, a.unstable_next = function(C) {
      switch (j) {
        case 1:
        case 2:
        case 3:
          var Y = 3;
          break;
        default:
          Y = j;
      }
      var K = j;
      j = Y;
      try {
        return C();
      } finally {
        j = K;
      }
    }, a.unstable_requestPaint = function() {
      T = !0;
    }, a.unstable_runWithPriority = function(C, Y) {
      switch (C) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          C = 3;
      }
      var K = j;
      j = C;
      try {
        return Y();
      } finally {
        j = K;
      }
    }, a.unstable_scheduleCallback = function(C, Y, K) {
      var I = a.unstable_now();
      switch (typeof K == "object" && K !== null ? (K = K.delay, K = typeof K == "number" && 0 < K ? I + K : I) : K = I, C) {
        case 1:
          var me = -1;
          break;
        case 2:
          me = 250;
          break;
        case 5:
          me = 1073741823;
          break;
        case 4:
          me = 1e4;
          break;
        default:
          me = 5e3;
      }
      return me = K + me, C = {
        id: v++,
        callback: Y,
        priorityLevel: C,
        startTime: K,
        expirationTime: me,
        sortIndex: -1
      }, K > I ? (C.sortIndex = K, r(g, C), o(p) === null && C === o(g) && (M ? (X(F), F = -1) : M = !0, ee(V, K - I))) : (C.sortIndex = me, r(p, C), A || E || (A = !0, P || (P = !0, de()))), C;
    }, a.unstable_shouldYield = ae, a.unstable_wrapCallback = function(C) {
      var Y = j;
      return function() {
        var K = j;
        j = Y;
        try {
          return C.apply(this, arguments);
        } finally {
          j = K;
        }
      };
    };
  })(Uu)), Uu;
}
var vm;
function e0() {
  return vm || (vm = 1, Lu.exports = Ig()), Lu.exports;
}
var Bu = { exports: {} }, ht = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var gm;
function t0() {
  if (gm) return ht;
  gm = 1;
  var a = Fu();
  function r(p) {
    var g = "https://react.dev/errors/" + p;
    if (1 < arguments.length) {
      g += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var v = 2; v < arguments.length; v++)
        g += "&args[]=" + encodeURIComponent(arguments[v]);
    }
    return "Minified React error #" + p + "; visit " + g + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
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
  function h(p, g, v) {
    var y = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: f,
      key: y == null ? null : "" + y,
      children: p,
      containerInfo: g,
      implementation: v
    };
  }
  var m = a.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function b(p, g) {
    if (p === "font") return "";
    if (typeof g == "string")
      return g === "use-credentials" ? g : "";
  }
  return ht.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = u, ht.createPortal = function(p, g) {
    var v = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!g || g.nodeType !== 1 && g.nodeType !== 9 && g.nodeType !== 11)
      throw Error(r(299));
    return h(p, g, null, v);
  }, ht.flushSync = function(p) {
    var g = m.T, v = u.p;
    try {
      if (m.T = null, u.p = 2, p) return p();
    } finally {
      m.T = g, u.p = v, u.d.f();
    }
  }, ht.preconnect = function(p, g) {
    typeof p == "string" && (g ? (g = g.crossOrigin, g = typeof g == "string" ? g === "use-credentials" ? g : "" : void 0) : g = null, u.d.C(p, g));
  }, ht.prefetchDNS = function(p) {
    typeof p == "string" && u.d.D(p);
  }, ht.preinit = function(p, g) {
    if (typeof p == "string" && g && typeof g.as == "string") {
      var v = g.as, y = b(v, g.crossOrigin), j = typeof g.integrity == "string" ? g.integrity : void 0, E = typeof g.fetchPriority == "string" ? g.fetchPriority : void 0;
      v === "style" ? u.d.S(
        p,
        typeof g.precedence == "string" ? g.precedence : void 0,
        {
          crossOrigin: y,
          integrity: j,
          fetchPriority: E
        }
      ) : v === "script" && u.d.X(p, {
        crossOrigin: y,
        integrity: j,
        fetchPriority: E,
        nonce: typeof g.nonce == "string" ? g.nonce : void 0
      });
    }
  }, ht.preinitModule = function(p, g) {
    if (typeof p == "string")
      if (typeof g == "object" && g !== null) {
        if (g.as == null || g.as === "script") {
          var v = b(
            g.as,
            g.crossOrigin
          );
          u.d.M(p, {
            crossOrigin: v,
            integrity: typeof g.integrity == "string" ? g.integrity : void 0,
            nonce: typeof g.nonce == "string" ? g.nonce : void 0
          });
        }
      } else g == null && u.d.M(p);
  }, ht.preload = function(p, g) {
    if (typeof p == "string" && typeof g == "object" && g !== null && typeof g.as == "string") {
      var v = g.as, y = b(v, g.crossOrigin);
      u.d.L(p, v, {
        crossOrigin: y,
        integrity: typeof g.integrity == "string" ? g.integrity : void 0,
        nonce: typeof g.nonce == "string" ? g.nonce : void 0,
        type: typeof g.type == "string" ? g.type : void 0,
        fetchPriority: typeof g.fetchPriority == "string" ? g.fetchPriority : void 0,
        referrerPolicy: typeof g.referrerPolicy == "string" ? g.referrerPolicy : void 0,
        imageSrcSet: typeof g.imageSrcSet == "string" ? g.imageSrcSet : void 0,
        imageSizes: typeof g.imageSizes == "string" ? g.imageSizes : void 0,
        media: typeof g.media == "string" ? g.media : void 0
      });
    }
  }, ht.preloadModule = function(p, g) {
    if (typeof p == "string")
      if (g) {
        var v = b(g.as, g.crossOrigin);
        u.d.m(p, {
          as: typeof g.as == "string" && g.as !== "script" ? g.as : void 0,
          crossOrigin: v,
          integrity: typeof g.integrity == "string" ? g.integrity : void 0
        });
      } else u.d.m(p);
  }, ht.requestFormReset = function(p) {
    u.d.r(p);
  }, ht.unstable_batchedUpdates = function(p, g) {
    return p(g);
  }, ht.useFormState = function(p, g, v) {
    return m.H.useFormState(p, g, v);
  }, ht.useFormStatus = function() {
    return m.H.useHostTransitionStatus();
  }, ht.version = "19.2.8", ht;
}
var xm;
function n0() {
  if (xm) return Bu.exports;
  xm = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (r) {
        console.error(r);
      }
  }
  return a(), Bu.exports = t0(), Bu.exports;
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
var bm;
function l0() {
  if (bm) return Ns;
  bm = 1;
  var a = e0(), r = Fu(), o = n0();
  function u(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var n = 2; n < arguments.length; n++)
        t += "&args[]=" + encodeURIComponent(arguments[n]);
    }
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function f(e) {
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
  function m(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function b(e) {
    if (e.tag === 31) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function p(e) {
    if (h(e) !== e)
      throw Error(u(188));
  }
  function g(e) {
    var t = e.alternate;
    if (!t) {
      if (t = h(e), t === null) throw Error(u(188));
      return t !== e ? null : e;
    }
    for (var n = e, l = t; ; ) {
      var i = n.return;
      if (i === null) break;
      var c = i.alternate;
      if (c === null) {
        if (l = i.return, l !== null) {
          n = l;
          continue;
        }
        break;
      }
      if (i.child === c.child) {
        for (c = i.child; c; ) {
          if (c === n) return p(i), e;
          if (c === l) return p(i), t;
          c = c.sibling;
        }
        throw Error(u(188));
      }
      if (n.return !== l.return) n = i, l = c;
      else {
        for (var d = !1, x = i.child; x; ) {
          if (x === n) {
            d = !0, n = i, l = c;
            break;
          }
          if (x === l) {
            d = !0, l = i, n = c;
            break;
          }
          x = x.sibling;
        }
        if (!d) {
          for (x = c.child; x; ) {
            if (x === n) {
              d = !0, n = c, l = i;
              break;
            }
            if (x === l) {
              d = !0, l = c, n = i;
              break;
            }
            x = x.sibling;
          }
          if (!d) throw Error(u(189));
        }
      }
      if (n.alternate !== l) throw Error(u(190));
    }
    if (n.tag !== 3) throw Error(u(188));
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
  var y = Object.assign, j = Symbol.for("react.element"), E = Symbol.for("react.transitional.element"), A = Symbol.for("react.portal"), M = Symbol.for("react.fragment"), T = Symbol.for("react.strict_mode"), B = Symbol.for("react.profiler"), X = Symbol.for("react.consumer"), G = Symbol.for("react.context"), ne = Symbol.for("react.forward_ref"), V = Symbol.for("react.suspense"), P = Symbol.for("react.suspense_list"), F = Symbol.for("react.memo"), ie = Symbol.for("react.lazy"), pe = Symbol.for("react.activity"), ae = Symbol.for("react.memo_cache_sentinel"), re = Symbol.iterator;
  function de(e) {
    return e === null || typeof e != "object" ? null : (e = re && e[re] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var R = Symbol.for("react.client.reference");
  function W(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === R ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case M:
        return "Fragment";
      case B:
        return "Profiler";
      case T:
        return "StrictMode";
      case V:
        return "Suspense";
      case P:
        return "SuspenseList";
      case pe:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case A:
          return "Portal";
        case G:
          return e.displayName || "Context";
        case X:
          return (e._context.displayName || "Context") + ".Consumer";
        case ne:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case F:
          return t = e.displayName || null, t !== null ? t : W(e.type) || "Memo";
        case ie:
          t = e._payload, e = e._init;
          try {
            return W(e(t));
          } catch {
          }
      }
    return null;
  }
  var ee = Array.isArray, C = r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Y = o.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, K = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, I = [], me = -1;
  function w(e) {
    return { current: e };
  }
  function L(e) {
    0 > me || (e.current = I[me], I[me] = null, me--);
  }
  function Z(e, t) {
    me++, I[me] = e.current, e.current = t;
  }
  var J = w(null), ce = w(null), he = w(null), ge = w(null);
  function Ke(e, t) {
    switch (Z(he, t), Z(ce, e), Z(J, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? Oh(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = Oh(t), e = Dh(t, e);
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
    L(J), Z(J, e);
  }
  function Ae() {
    L(J), L(ce), L(he);
  }
  function tn(e) {
    e.memoizedState !== null && Z(ge, e);
    var t = J.current, n = Dh(t, e.type);
    t !== n && (Z(ce, e), Z(J, n));
  }
  function Tt(e) {
    ce.current === e && (L(J), L(ce)), ge.current === e && (L(ge), ys._currentValue = K);
  }
  var ye, gt;
  function at(e) {
    if (ye === void 0)
      try {
        throw Error();
      } catch (n) {
        var t = n.stack.trim().match(/\n( *(at )?)/);
        ye = t && t[1] || "", gt = -1 < n.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < n.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + ye + e + gt;
  }
  var _t = !1;
  function cn(e, t) {
    if (!e || _t) return "";
    _t = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var l = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var $ = function() {
                throw Error();
              };
              if (Object.defineProperty($.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct($, []);
                } catch (H) {
                  var D = H;
                }
                Reflect.construct(e, [], $);
              } else {
                try {
                  $.call();
                } catch (H) {
                  D = H;
                }
                e.call($.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (H) {
                D = H;
              }
              ($ = e()) && typeof $.catch == "function" && $.catch(function() {
              });
            }
          } catch (H) {
            if (H && D && typeof H.stack == "string")
              return [H.stack, D.stack];
          }
          return [null, null];
        }
      };
      l.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var i = Object.getOwnPropertyDescriptor(
        l.DetermineComponentFrameRoot,
        "name"
      );
      i && i.configurable && Object.defineProperty(
        l.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var c = l.DetermineComponentFrameRoot(), d = c[0], x = c[1];
      if (d && x) {
        var S = d.split(`
`), O = x.split(`
`);
        for (i = l = 0; l < S.length && !S[l].includes("DetermineComponentFrameRoot"); )
          l++;
        for (; i < O.length && !O[i].includes(
          "DetermineComponentFrameRoot"
        ); )
          i++;
        if (l === S.length || i === O.length)
          for (l = S.length - 1, i = O.length - 1; 1 <= l && 0 <= i && S[l] !== O[i]; )
            i--;
        for (; 1 <= l && 0 <= i; l--, i--)
          if (S[l] !== O[i]) {
            if (l !== 1 || i !== 1)
              do
                if (l--, i--, 0 > i || S[l] !== O[i]) {
                  var U = `
` + S[l].replace(" at new ", " at ");
                  return e.displayName && U.includes("<anonymous>") && (U = U.replace("<anonymous>", e.displayName)), U;
                }
              while (1 <= l && 0 <= i);
            break;
          }
      }
    } finally {
      _t = !1, Error.prepareStackTrace = n;
    }
    return (n = e ? e.displayName || e.name : "") ? at(n) : "";
  }
  function yc(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return at(e.type);
      case 16:
        return at("Lazy");
      case 13:
        return e.child !== t && t !== null ? at("Suspense Fallback") : at("Suspense");
      case 19:
        return at("SuspenseList");
      case 0:
      case 15:
        return cn(e.type, !1);
      case 11:
        return cn(e.type.render, !1);
      case 1:
        return cn(e.type, !0);
      case 31:
        return at("Activity");
      default:
        return "";
    }
  }
  function Ll(e) {
    try {
      var t = "", n = null;
      do
        t += yc(e, n), n = e, e = e.return;
      while (e);
      return t;
    } catch (l) {
      return `
Error generating stack: ` + l.message + `
` + l.stack;
    }
  }
  var ka = Object.prototype.hasOwnProperty, hl = a.unstable_scheduleCallback, Ta = a.unstable_cancelCallback, Ul = a.unstable_shouldYield, Aa = a.unstable_requestPaint, xt = a.unstable_now, _c = a.unstable_getCurrentPriorityLevel, vn = a.unstable_ImmediatePriority, _e = a.unstable_UserBlockingPriority, jt = a.unstable_NormalPriority, rn = a.unstable_LowPriority, Bl = a.unstable_IdlePriority, Tp = a.log, Ap = a.unstable_setDisableYieldValue, Ra = null, At = null;
  function Hn(e) {
    if (typeof Tp == "function" && Ap(e), At && typeof At.setStrictMode == "function")
      try {
        At.setStrictMode(Ra, e);
      } catch {
      }
  }
  var Rt = Math.clz32 ? Math.clz32 : Op, Rp = Math.log, zp = Math.LN2;
  function Op(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Rp(e) / zp | 0) | 0;
  }
  var Hs = 256, Ls = 262144, Us = 4194304;
  function ml(e) {
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
  function Bs(e, t, n) {
    var l = e.pendingLanes;
    if (l === 0) return 0;
    var i = 0, c = e.suspendedLanes, d = e.pingedLanes;
    e = e.warmLanes;
    var x = l & 134217727;
    return x !== 0 ? (l = x & ~c, l !== 0 ? i = ml(l) : (d &= x, d !== 0 ? i = ml(d) : n || (n = x & ~e, n !== 0 && (i = ml(n))))) : (x = l & ~c, x !== 0 ? i = ml(x) : d !== 0 ? i = ml(d) : n || (n = l & ~e, n !== 0 && (i = ml(n)))), i === 0 ? 0 : t !== 0 && t !== i && (t & c) === 0 && (c = i & -i, n = t & -t, c >= n || c === 32 && (n & 4194048) !== 0) ? t : i;
  }
  function za(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function Dp(e, t) {
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
  function mo() {
    var e = Us;
    return Us <<= 1, (Us & 62914560) === 0 && (Us = 4194304), e;
  }
  function jc(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function Oa(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function Hp(e, t, n, l, i, c) {
    var d = e.pendingLanes;
    e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
    var x = e.entanglements, S = e.expirationTimes, O = e.hiddenUpdates;
    for (n = d & ~n; 0 < n; ) {
      var U = 31 - Rt(n), $ = 1 << U;
      x[U] = 0, S[U] = -1;
      var D = O[U];
      if (D !== null)
        for (O[U] = null, U = 0; U < D.length; U++) {
          var H = D[U];
          H !== null && (H.lane &= -536870913);
        }
      n &= ~$;
    }
    l !== 0 && po(e, l, 0), c !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= c & ~(d & ~t));
  }
  function po(e, t, n) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var l = 31 - Rt(t);
    e.entangledLanes |= t, e.entanglements[l] = e.entanglements[l] | 1073741824 | n & 261930;
  }
  function vo(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var l = 31 - Rt(n), i = 1 << l;
      i & t | e[l] & t && (e[l] |= t), n &= ~i;
    }
  }
  function go(e, t) {
    var n = t & -t;
    return n = (n & 42) !== 0 ? 1 : Sc(n), (n & (e.suspendedLanes | t)) !== 0 ? 0 : n;
  }
  function Sc(e) {
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
  function xo() {
    var e = Y.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : am(e.type));
  }
  function bo(e, t) {
    var n = Y.p;
    try {
      return Y.p = e, t();
    } finally {
      Y.p = n;
    }
  }
  var Ln = Math.random().toString(36).slice(2), ct = "__reactFiber$" + Ln, St = "__reactProps$" + Ln, Gl = "__reactContainer$" + Ln, Nc = "__reactEvents$" + Ln, Lp = "__reactListeners$" + Ln, Up = "__reactHandles$" + Ln, yo = "__reactResources$" + Ln, Da = "__reactMarker$" + Ln;
  function Ec(e) {
    delete e[ct], delete e[St], delete e[Nc], delete e[Lp], delete e[Up];
  }
  function ql(e) {
    var t = e[ct];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[Gl] || n[ct]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null)
          for (e = Yh(e); e !== null; ) {
            if (n = e[ct]) return n;
            e = Yh(e);
          }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function Yl(e) {
    if (e = e[ct] || e[Gl]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function Ha(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(u(33));
  }
  function $l(e) {
    var t = e[yo];
    return t || (t = e[yo] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function st(e) {
    e[Da] = !0;
  }
  var _o = /* @__PURE__ */ new Set(), jo = {};
  function pl(e, t) {
    Vl(e, t), Vl(e + "Capture", t);
  }
  function Vl(e, t) {
    for (jo[e] = t, e = 0; e < t.length; e++)
      _o.add(t[e]);
  }
  var Bp = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), So = {}, wo = {};
  function Gp(e) {
    return ka.call(wo, e) ? !0 : ka.call(So, e) ? !1 : Bp.test(e) ? wo[e] = !0 : (So[e] = !0, !1);
  }
  function Gs(e, t, n) {
    if (Gp(t))
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
  function qs(e, t, n) {
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
  function gn(e, t, n, l) {
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
  function Vt(e) {
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
  function No(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function qp(e, t, n) {
    var l = Object.getOwnPropertyDescriptor(
      e.constructor.prototype,
      t
    );
    if (!e.hasOwnProperty(t) && typeof l < "u" && typeof l.get == "function" && typeof l.set == "function") {
      var i = l.get, c = l.set;
      return Object.defineProperty(e, t, {
        configurable: !0,
        get: function() {
          return i.call(this);
        },
        set: function(d) {
          n = "" + d, c.call(this, d);
        }
      }), Object.defineProperty(e, t, {
        enumerable: l.enumerable
      }), {
        getValue: function() {
          return n;
        },
        setValue: function(d) {
          n = "" + d;
        },
        stopTracking: function() {
          e._valueTracker = null, delete e[t];
        }
      };
    }
  }
  function Mc(e) {
    if (!e._valueTracker) {
      var t = No(e) ? "checked" : "value";
      e._valueTracker = qp(
        e,
        t,
        "" + e[t]
      );
    }
  }
  function Eo(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), l = "";
    return e && (l = No(e) ? e.checked ? "true" : "false" : e.value), e = l, e !== n ? (t.setValue(e), !0) : !1;
  }
  function Ys(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var Yp = /[\n"\\]/g;
  function Qt(e) {
    return e.replace(
      Yp,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Cc(e, t, n, l, i, c, d, x) {
    e.name = "", d != null && typeof d != "function" && typeof d != "symbol" && typeof d != "boolean" ? e.type = d : e.removeAttribute("type"), t != null ? d === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Vt(t)) : e.value !== "" + Vt(t) && (e.value = "" + Vt(t)) : d !== "submit" && d !== "reset" || e.removeAttribute("value"), t != null ? kc(e, d, Vt(t)) : n != null ? kc(e, d, Vt(n)) : l != null && e.removeAttribute("value"), i == null && c != null && (e.defaultChecked = !!c), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), x != null && typeof x != "function" && typeof x != "symbol" && typeof x != "boolean" ? e.name = "" + Vt(x) : e.removeAttribute("name");
  }
  function Mo(e, t, n, l, i, c, d, x) {
    if (c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" && (e.type = c), t != null || n != null) {
      if (!(c !== "submit" && c !== "reset" || t != null)) {
        Mc(e);
        return;
      }
      n = n != null ? "" + Vt(n) : "", t = t != null ? "" + Vt(t) : n, x || t === e.value || (e.value = t), e.defaultValue = t;
    }
    l = l ?? i, l = typeof l != "function" && typeof l != "symbol" && !!l, e.checked = x ? e.checked : !!l, e.defaultChecked = !!l, d != null && typeof d != "function" && typeof d != "symbol" && typeof d != "boolean" && (e.name = d), Mc(e);
  }
  function kc(e, t, n) {
    t === "number" && Ys(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
  }
  function Ql(e, t, n, l) {
    if (e = e.options, t) {
      t = {};
      for (var i = 0; i < n.length; i++)
        t["$" + n[i]] = !0;
      for (n = 0; n < e.length; n++)
        i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && l && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + Vt(n), t = null, i = 0; i < e.length; i++) {
        if (e[i].value === n) {
          e[i].selected = !0, l && (e[i].defaultSelected = !0);
          return;
        }
        t !== null || e[i].disabled || (t = e[i]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Co(e, t, n) {
    if (t != null && (t = "" + Vt(t), t !== e.value && (e.value = t), n == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = n != null ? "" + Vt(n) : "";
  }
  function ko(e, t, n, l) {
    if (t == null) {
      if (l != null) {
        if (n != null) throw Error(u(92));
        if (ee(l)) {
          if (1 < l.length) throw Error(u(93));
          l = l[0];
        }
        n = l;
      }
      n == null && (n = ""), t = n;
    }
    n = Vt(t), e.defaultValue = n, l = e.textContent, l === n && l !== "" && l !== null && (e.value = l), Mc(e);
  }
  function Xl(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var $p = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function To(e, t, n) {
    var l = t.indexOf("--") === 0;
    n == null || typeof n == "boolean" || n === "" ? l ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : l ? e.setProperty(t, n) : typeof n != "number" || n === 0 || $p.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
  }
  function Ao(e, t, n) {
    if (t != null && typeof t != "object")
      throw Error(u(62));
    if (e = e.style, n != null) {
      for (var l in n)
        !n.hasOwnProperty(l) || t != null && t.hasOwnProperty(l) || (l.indexOf("--") === 0 ? e.setProperty(l, "") : l === "float" ? e.cssFloat = "" : e[l] = "");
      for (var i in t)
        l = t[i], t.hasOwnProperty(i) && n[i] !== l && To(e, i, l);
    } else
      for (var c in t)
        t.hasOwnProperty(c) && To(e, c, t[c]);
  }
  function Tc(e) {
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
  var Vp = /* @__PURE__ */ new Map([
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
  ]), Qp = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function $s(e) {
    return Qp.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  function xn() {
  }
  var Ac = null;
  function Rc(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Zl = null, Kl = null;
  function Ro(e) {
    var t = Yl(e);
    if (t && (e = t.stateNode)) {
      var n = e[St] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (Cc(
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
              'input[name="' + Qt(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < n.length; t++) {
              var l = n[t];
              if (l !== e && l.form === e.form) {
                var i = l[St] || null;
                if (!i) throw Error(u(90));
                Cc(
                  l,
                  i.value,
                  i.defaultValue,
                  i.defaultValue,
                  i.checked,
                  i.defaultChecked,
                  i.type,
                  i.name
                );
              }
            }
            for (t = 0; t < n.length; t++)
              l = n[t], l.form === e.form && Eo(l);
          }
          break e;
        case "textarea":
          Co(e, n.value, n.defaultValue);
          break e;
        case "select":
          t = n.value, t != null && Ql(e, !!n.multiple, t, !1);
      }
    }
  }
  var zc = !1;
  function zo(e, t, n) {
    if (zc) return e(t, n);
    zc = !0;
    try {
      var l = e(t);
      return l;
    } finally {
      if (zc = !1, (Zl !== null || Kl !== null) && (Ti(), Zl && (t = Zl, e = Kl, Kl = Zl = null, Ro(t), e)))
        for (t = 0; t < e.length; t++) Ro(e[t]);
    }
  }
  function La(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var l = n[St] || null;
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
        u(231, t, typeof n)
      );
    return n;
  }
  var bn = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Oc = !1;
  if (bn)
    try {
      var Ua = {};
      Object.defineProperty(Ua, "passive", {
        get: function() {
          Oc = !0;
        }
      }), window.addEventListener("test", Ua, Ua), window.removeEventListener("test", Ua, Ua);
    } catch {
      Oc = !1;
    }
  var Un = null, Dc = null, Vs = null;
  function Oo() {
    if (Vs) return Vs;
    var e, t = Dc, n = t.length, l, i = "value" in Un ? Un.value : Un.textContent, c = i.length;
    for (e = 0; e < n && t[e] === i[e]; e++) ;
    var d = n - e;
    for (l = 1; l <= d && t[n - l] === i[c - l]; l++) ;
    return Vs = i.slice(e, 1 < l ? 1 - l : void 0);
  }
  function Qs(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Xs() {
    return !0;
  }
  function Do() {
    return !1;
  }
  function wt(e) {
    function t(n, l, i, c, d) {
      this._reactName = n, this._targetInst = i, this.type = l, this.nativeEvent = c, this.target = d, this.currentTarget = null;
      for (var x in e)
        e.hasOwnProperty(x) && (n = e[x], this[x] = n ? n(c) : c[x]);
      return this.isDefaultPrevented = (c.defaultPrevented != null ? c.defaultPrevented : c.returnValue === !1) ? Xs : Do, this.isPropagationStopped = Do, this;
    }
    return y(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Xs);
      },
      stopPropagation: function() {
        var n = this.nativeEvent;
        n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Xs);
      },
      persist: function() {
      },
      isPersistent: Xs
    }), t;
  }
  var vl = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, Zs = wt(vl), Ba = y({}, vl, { view: 0, detail: 0 }), Xp = wt(Ba), Hc, Lc, Ga, Ks = y({}, Ba, {
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
    getModifierState: Bc,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== Ga && (Ga && e.type === "mousemove" ? (Hc = e.screenX - Ga.screenX, Lc = e.screenY - Ga.screenY) : Lc = Hc = 0, Ga = e), Hc);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : Lc;
    }
  }), Ho = wt(Ks), Zp = y({}, Ks, { dataTransfer: 0 }), Kp = wt(Zp), Fp = y({}, Ba, { relatedTarget: 0 }), Uc = wt(Fp), Jp = y({}, vl, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Wp = wt(Jp), Pp = y({}, vl, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), Ip = wt(Pp), ev = y({}, vl, { data: 0 }), Lo = wt(ev), tv = {
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
  }, nv = {
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
  }, lv = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function av(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = lv[e]) ? !!t[e] : !1;
  }
  function Bc() {
    return av;
  }
  var sv = y({}, Ba, {
    key: function(e) {
      if (e.key) {
        var t = tv[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = Qs(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? nv[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Bc,
    charCode: function(e) {
      return e.type === "keypress" ? Qs(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? Qs(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), iv = wt(sv), cv = y({}, Ks, {
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
  }), Uo = wt(cv), rv = y({}, Ba, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Bc
  }), uv = wt(rv), ov = y({}, vl, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), dv = wt(ov), fv = y({}, Ks, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), hv = wt(fv), mv = y({}, vl, {
    newState: 0,
    oldState: 0
  }), pv = wt(mv), vv = [9, 13, 27, 32], Gc = bn && "CompositionEvent" in window, qa = null;
  bn && "documentMode" in document && (qa = document.documentMode);
  var gv = bn && "TextEvent" in window && !qa, Bo = bn && (!Gc || qa && 8 < qa && 11 >= qa), Go = " ", qo = !1;
  function Yo(e, t) {
    switch (e) {
      case "keyup":
        return vv.indexOf(t.keyCode) !== -1;
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
  function $o(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Fl = !1;
  function xv(e, t) {
    switch (e) {
      case "compositionend":
        return $o(t);
      case "keypress":
        return t.which !== 32 ? null : (qo = !0, Go);
      case "textInput":
        return e = t.data, e === Go && qo ? null : e;
      default:
        return null;
    }
  }
  function bv(e, t) {
    if (Fl)
      return e === "compositionend" || !Gc && Yo(e, t) ? (e = Oo(), Vs = Dc = Un = null, Fl = !1, e) : null;
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
        return Bo && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var yv = {
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
  function Vo(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!yv[e.type] : t === "textarea";
  }
  function Qo(e, t, n, l) {
    Zl ? Kl ? Kl.push(l) : Kl = [l] : Zl = l, t = Li(t, "onChange"), 0 < t.length && (n = new Zs(
      "onChange",
      "change",
      null,
      n,
      l
    ), e.push({ event: n, listeners: t }));
  }
  var Ya = null, $a = null;
  function _v(e) {
    Ch(e, 0);
  }
  function Fs(e) {
    var t = Ha(e);
    if (Eo(t)) return e;
  }
  function Xo(e, t) {
    if (e === "change") return t;
  }
  var Zo = !1;
  if (bn) {
    var qc;
    if (bn) {
      var Yc = "oninput" in document;
      if (!Yc) {
        var Ko = document.createElement("div");
        Ko.setAttribute("oninput", "return;"), Yc = typeof Ko.oninput == "function";
      }
      qc = Yc;
    } else qc = !1;
    Zo = qc && (!document.documentMode || 9 < document.documentMode);
  }
  function Fo() {
    Ya && (Ya.detachEvent("onpropertychange", Jo), $a = Ya = null);
  }
  function Jo(e) {
    if (e.propertyName === "value" && Fs($a)) {
      var t = [];
      Qo(
        t,
        $a,
        e,
        Rc(e)
      ), zo(_v, t);
    }
  }
  function jv(e, t, n) {
    e === "focusin" ? (Fo(), Ya = t, $a = n, Ya.attachEvent("onpropertychange", Jo)) : e === "focusout" && Fo();
  }
  function Sv(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return Fs($a);
  }
  function wv(e, t) {
    if (e === "click") return Fs(t);
  }
  function Nv(e, t) {
    if (e === "input" || e === "change")
      return Fs(t);
  }
  function Ev(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var zt = typeof Object.is == "function" ? Object.is : Ev;
  function Va(e, t) {
    if (zt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var n = Object.keys(e), l = Object.keys(t);
    if (n.length !== l.length) return !1;
    for (l = 0; l < n.length; l++) {
      var i = n[l];
      if (!ka.call(t, i) || !zt(e[i], t[i]))
        return !1;
    }
    return !0;
  }
  function Wo(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Po(e, t) {
    var n = Wo(e);
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
      n = Wo(n);
    }
  }
  function Io(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Io(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function ed(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = Ys(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = Ys(e.document);
    }
    return t;
  }
  function $c(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var Mv = bn && "documentMode" in document && 11 >= document.documentMode, Jl = null, Vc = null, Qa = null, Qc = !1;
  function td(e, t, n) {
    var l = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    Qc || Jl == null || Jl !== Ys(l) || (l = Jl, "selectionStart" in l && $c(l) ? l = { start: l.selectionStart, end: l.selectionEnd } : (l = (l.ownerDocument && l.ownerDocument.defaultView || window).getSelection(), l = {
      anchorNode: l.anchorNode,
      anchorOffset: l.anchorOffset,
      focusNode: l.focusNode,
      focusOffset: l.focusOffset
    }), Qa && Va(Qa, l) || (Qa = l, l = Li(Vc, "onSelect"), 0 < l.length && (t = new Zs(
      "onSelect",
      "select",
      null,
      t,
      n
    ), e.push({ event: t, listeners: l }), t.target = Jl)));
  }
  function gl(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var Wl = {
    animationend: gl("Animation", "AnimationEnd"),
    animationiteration: gl("Animation", "AnimationIteration"),
    animationstart: gl("Animation", "AnimationStart"),
    transitionrun: gl("Transition", "TransitionRun"),
    transitionstart: gl("Transition", "TransitionStart"),
    transitioncancel: gl("Transition", "TransitionCancel"),
    transitionend: gl("Transition", "TransitionEnd")
  }, Xc = {}, nd = {};
  bn && (nd = document.createElement("div").style, "AnimationEvent" in window || (delete Wl.animationend.animation, delete Wl.animationiteration.animation, delete Wl.animationstart.animation), "TransitionEvent" in window || delete Wl.transitionend.transition);
  function xl(e) {
    if (Xc[e]) return Xc[e];
    if (!Wl[e]) return e;
    var t = Wl[e], n;
    for (n in t)
      if (t.hasOwnProperty(n) && n in nd)
        return Xc[e] = t[n];
    return e;
  }
  var ld = xl("animationend"), ad = xl("animationiteration"), sd = xl("animationstart"), Cv = xl("transitionrun"), kv = xl("transitionstart"), Tv = xl("transitioncancel"), id = xl("transitionend"), cd = /* @__PURE__ */ new Map(), Zc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Zc.push("scrollEnd");
  function nn(e, t) {
    cd.set(e, t), pl(t, [e]);
  }
  var Js = typeof reportError == "function" ? reportError : function(e) {
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
  }, Xt = [], Pl = 0, Kc = 0;
  function Ws() {
    for (var e = Pl, t = Kc = Pl = 0; t < e; ) {
      var n = Xt[t];
      Xt[t++] = null;
      var l = Xt[t];
      Xt[t++] = null;
      var i = Xt[t];
      Xt[t++] = null;
      var c = Xt[t];
      if (Xt[t++] = null, l !== null && i !== null) {
        var d = l.pending;
        d === null ? i.next = i : (i.next = d.next, d.next = i), l.pending = i;
      }
      c !== 0 && rd(n, i, c);
    }
  }
  function Ps(e, t, n, l) {
    Xt[Pl++] = e, Xt[Pl++] = t, Xt[Pl++] = n, Xt[Pl++] = l, Kc |= l, e.lanes |= l, e = e.alternate, e !== null && (e.lanes |= l);
  }
  function Fc(e, t, n, l) {
    return Ps(e, t, n, l), Is(e);
  }
  function bl(e, t) {
    return Ps(e, null, null, t), Is(e);
  }
  function rd(e, t, n) {
    e.lanes |= n;
    var l = e.alternate;
    l !== null && (l.lanes |= n);
    for (var i = !1, c = e.return; c !== null; )
      c.childLanes |= n, l = c.alternate, l !== null && (l.childLanes |= n), c.tag === 22 && (e = c.stateNode, e === null || e._visibility & 1 || (i = !0)), e = c, c = c.return;
    return e.tag === 3 ? (c = e.stateNode, i && t !== null && (i = 31 - Rt(n), e = c.hiddenUpdates, l = e[i], l === null ? e[i] = [t] : l.push(t), t.lane = n | 536870912), c) : null;
  }
  function Is(e) {
    if (50 < hs)
      throw hs = 0, au = null, Error(u(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var Il = {};
  function Av(e, t, n, l) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = l, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Ot(e, t, n, l) {
    return new Av(e, t, n, l);
  }
  function Jc(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function yn(e, t) {
    var n = e.alternate;
    return n === null ? (n = Ot(
      e.tag,
      t,
      e.key,
      e.mode
    ), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 65011712, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
  }
  function ud(e, t) {
    e.flags &= 65011714;
    var n = e.alternate;
    return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function ei(e, t, n, l, i, c) {
    var d = 0;
    if (l = e, typeof e == "function") Jc(e) && (d = 1);
    else if (typeof e == "string")
      d = Hg(
        e,
        n,
        J.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case pe:
          return e = Ot(31, n, t, i), e.elementType = pe, e.lanes = c, e;
        case M:
          return yl(n.children, i, c, t);
        case T:
          d = 8, i |= 24;
          break;
        case B:
          return e = Ot(12, n, t, i | 2), e.elementType = B, e.lanes = c, e;
        case V:
          return e = Ot(13, n, t, i), e.elementType = V, e.lanes = c, e;
        case P:
          return e = Ot(19, n, t, i), e.elementType = P, e.lanes = c, e;
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case G:
                d = 10;
                break e;
              case X:
                d = 9;
                break e;
              case ne:
                d = 11;
                break e;
              case F:
                d = 14;
                break e;
              case ie:
                d = 16, l = null;
                break e;
            }
          d = 29, n = Error(
            u(130, e === null ? "null" : typeof e, "")
          ), l = null;
      }
    return t = Ot(d, n, t, i), t.elementType = e, t.type = l, t.lanes = c, t;
  }
  function yl(e, t, n, l) {
    return e = Ot(7, e, l, t), e.lanes = n, e;
  }
  function Wc(e, t, n) {
    return e = Ot(6, e, null, t), e.lanes = n, e;
  }
  function od(e) {
    var t = Ot(18, null, null, 0);
    return t.stateNode = e, t;
  }
  function Pc(e, t, n) {
    return t = Ot(
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
  var dd = /* @__PURE__ */ new WeakMap();
  function Zt(e, t) {
    if (typeof e == "object" && e !== null) {
      var n = dd.get(e);
      return n !== void 0 ? n : (t = {
        value: e,
        source: t,
        stack: Ll(t)
      }, dd.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: Ll(t)
    };
  }
  var ea = [], ta = 0, ti = null, Xa = 0, Kt = [], Ft = 0, Bn = null, un = 1, on = "";
  function _n(e, t) {
    ea[ta++] = Xa, ea[ta++] = ti, ti = e, Xa = t;
  }
  function fd(e, t, n) {
    Kt[Ft++] = un, Kt[Ft++] = on, Kt[Ft++] = Bn, Bn = e;
    var l = un;
    e = on;
    var i = 32 - Rt(l) - 1;
    l &= ~(1 << i), n += 1;
    var c = 32 - Rt(t) + i;
    if (30 < c) {
      var d = i - i % 5;
      c = (l & (1 << d) - 1).toString(32), l >>= d, i -= d, un = 1 << 32 - Rt(t) + i | n << i | l, on = c + e;
    } else
      un = 1 << c | n << i | l, on = e;
  }
  function Ic(e) {
    e.return !== null && (_n(e, 1), fd(e, 1, 0));
  }
  function er(e) {
    for (; e === ti; )
      ti = ea[--ta], ea[ta] = null, Xa = ea[--ta], ea[ta] = null;
    for (; e === Bn; )
      Bn = Kt[--Ft], Kt[Ft] = null, on = Kt[--Ft], Kt[Ft] = null, un = Kt[--Ft], Kt[Ft] = null;
  }
  function hd(e, t) {
    Kt[Ft++] = un, Kt[Ft++] = on, Kt[Ft++] = Bn, un = t.id, on = t.overflow, Bn = e;
  }
  var rt = null, qe = null, Ee = !1, Gn = null, Jt = !1, tr = Error(u(519));
  function qn(e) {
    var t = Error(
      u(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw Za(Zt(t, e)), tr;
  }
  function md(e) {
    var t = e.stateNode, n = e.type, l = e.memoizedProps;
    switch (t[ct] = e, t[St] = l, n) {
      case "dialog":
        Se("cancel", t), Se("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        Se("load", t);
        break;
      case "video":
      case "audio":
        for (n = 0; n < ps.length; n++)
          Se(ps[n], t);
        break;
      case "source":
        Se("error", t);
        break;
      case "img":
      case "image":
      case "link":
        Se("error", t), Se("load", t);
        break;
      case "details":
        Se("toggle", t);
        break;
      case "input":
        Se("invalid", t), Mo(
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
        Se("invalid", t);
        break;
      case "textarea":
        Se("invalid", t), ko(t, l.value, l.defaultValue, l.children);
    }
    n = l.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || l.suppressHydrationWarning === !0 || Rh(t.textContent, n) ? (l.popover != null && (Se("beforetoggle", t), Se("toggle", t)), l.onScroll != null && Se("scroll", t), l.onScrollEnd != null && Se("scrollend", t), l.onClick != null && (t.onclick = xn), t = !0) : t = !1, t || qn(e, !0);
  }
  function pd(e) {
    for (rt = e.return; rt; )
      switch (rt.tag) {
        case 5:
        case 31:
        case 13:
          Jt = !1;
          return;
        case 27:
        case 3:
          Jt = !0;
          return;
        default:
          rt = rt.return;
      }
  }
  function na(e) {
    if (e !== rt) return !1;
    if (!Ee) return pd(e), Ee = !0, !1;
    var t = e.tag, n;
    if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = !(n !== "form" && n !== "button") || bu(e.type, e.memoizedProps)), n = !n), n && qe && qn(e), pd(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(u(317));
      qe = qh(e);
    } else if (t === 31) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(u(317));
      qe = qh(e);
    } else
      t === 27 ? (t = qe, tl(e.type) ? (e = wu, wu = null, qe = e) : qe = t) : qe = rt ? Pt(e.stateNode.nextSibling) : null;
    return !0;
  }
  function _l() {
    qe = rt = null, Ee = !1;
  }
  function nr() {
    var e = Gn;
    return e !== null && (Ct === null ? Ct = e : Ct.push.apply(
      Ct,
      e
    ), Gn = null), e;
  }
  function Za(e) {
    Gn === null ? Gn = [e] : Gn.push(e);
  }
  var lr = w(null), jl = null, jn = null;
  function Yn(e, t, n) {
    Z(lr, t._currentValue), t._currentValue = n;
  }
  function Sn(e) {
    e._currentValue = lr.current, L(lr);
  }
  function ar(e, t, n) {
    for (; e !== null; ) {
      var l = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, l !== null && (l.childLanes |= t)) : l !== null && (l.childLanes & t) !== t && (l.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function sr(e, t, n, l) {
    var i = e.child;
    for (i !== null && (i.return = e); i !== null; ) {
      var c = i.dependencies;
      if (c !== null) {
        var d = i.child;
        c = c.firstContext;
        e: for (; c !== null; ) {
          var x = c;
          c = i;
          for (var S = 0; S < t.length; S++)
            if (x.context === t[S]) {
              c.lanes |= n, x = c.alternate, x !== null && (x.lanes |= n), ar(
                c.return,
                n,
                e
              ), l || (d = null);
              break e;
            }
          c = x.next;
        }
      } else if (i.tag === 18) {
        if (d = i.return, d === null) throw Error(u(341));
        d.lanes |= n, c = d.alternate, c !== null && (c.lanes |= n), ar(d, n, e), d = null;
      } else d = i.child;
      if (d !== null) d.return = i;
      else
        for (d = i; d !== null; ) {
          if (d === e) {
            d = null;
            break;
          }
          if (i = d.sibling, i !== null) {
            i.return = d.return, d = i;
            break;
          }
          d = d.return;
        }
      i = d;
    }
  }
  function la(e, t, n, l) {
    e = null;
    for (var i = t, c = !1; i !== null; ) {
      if (!c) {
        if ((i.flags & 524288) !== 0) c = !0;
        else if ((i.flags & 262144) !== 0) break;
      }
      if (i.tag === 10) {
        var d = i.alternate;
        if (d === null) throw Error(u(387));
        if (d = d.memoizedProps, d !== null) {
          var x = i.type;
          zt(i.pendingProps.value, d.value) || (e !== null ? e.push(x) : e = [x]);
        }
      } else if (i === ge.current) {
        if (d = i.alternate, d === null) throw Error(u(387));
        d.memoizedState.memoizedState !== i.memoizedState.memoizedState && (e !== null ? e.push(ys) : e = [ys]);
      }
      i = i.return;
    }
    e !== null && sr(
      t,
      e,
      n,
      l
    ), t.flags |= 262144;
  }
  function ni(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!zt(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function Sl(e) {
    jl = e, jn = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function ut(e) {
    return vd(jl, e);
  }
  function li(e, t) {
    return jl === null && Sl(e), vd(e, t);
  }
  function vd(e, t) {
    var n = t._currentValue;
    if (t = { context: t, memoizedValue: n, next: null }, jn === null) {
      if (e === null) throw Error(u(308));
      jn = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else jn = jn.next = t;
    return n;
  }
  var Rv = typeof AbortController < "u" ? AbortController : function() {
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
  }, zv = a.unstable_scheduleCallback, Ov = a.unstable_NormalPriority, Pe = {
    $$typeof: G,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function ir() {
    return {
      controller: new Rv(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Ka(e) {
    e.refCount--, e.refCount === 0 && zv(Ov, function() {
      e.controller.abort();
    });
  }
  var Fa = null, cr = 0, aa = 0, sa = null;
  function Dv(e, t) {
    if (Fa === null) {
      var n = Fa = [];
      cr = 0, aa = ou(), sa = {
        status: "pending",
        value: void 0,
        then: function(l) {
          n.push(l);
        }
      };
    }
    return cr++, t.then(gd, gd), t;
  }
  function gd() {
    if (--cr === 0 && Fa !== null) {
      sa !== null && (sa.status = "fulfilled");
      var e = Fa;
      Fa = null, aa = 0, sa = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function Hv(e, t) {
    var n = [], l = {
      status: "pending",
      value: null,
      reason: null,
      then: function(i) {
        n.push(i);
      }
    };
    return e.then(
      function() {
        l.status = "fulfilled", l.value = t;
        for (var i = 0; i < n.length; i++) (0, n[i])(t);
      },
      function(i) {
        for (l.status = "rejected", l.reason = i, i = 0; i < n.length; i++)
          (0, n[i])(void 0);
      }
    ), l;
  }
  var xd = C.S;
  C.S = function(e, t) {
    nh = xt(), typeof t == "object" && t !== null && typeof t.then == "function" && Dv(e, t), xd !== null && xd(e, t);
  };
  var wl = w(null);
  function rr() {
    var e = wl.current;
    return e !== null ? e : Ue.pooledCache;
  }
  function ai(e, t) {
    t === null ? Z(wl, wl.current) : Z(wl, t.pool);
  }
  function bd() {
    var e = rr();
    return e === null ? null : { parent: Pe._currentValue, pool: e };
  }
  var ia = Error(u(460)), ur = Error(u(474)), si = Error(u(542)), ii = { then: function() {
  } };
  function yd(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function _d(e, t, n) {
    switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(xn, xn), t = n), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, Sd(e), e;
      default:
        if (typeof t.status == "string") t.then(xn, xn);
        else {
          if (e = Ue, e !== null && 100 < e.shellSuspendCounter)
            throw Error(u(482));
          e = t, e.status = "pending", e.then(
            function(l) {
              if (t.status === "pending") {
                var i = t;
                i.status = "fulfilled", i.value = l;
              }
            },
            function(l) {
              if (t.status === "pending") {
                var i = t;
                i.status = "rejected", i.reason = l;
              }
            }
          );
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw e = t.reason, Sd(e), e;
        }
        throw El = t, ia;
    }
  }
  function Nl(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (n) {
      throw n !== null && typeof n == "object" && typeof n.then == "function" ? (El = n, ia) : n;
    }
  }
  var El = null;
  function jd() {
    if (El === null) throw Error(u(459));
    var e = El;
    return El = null, e;
  }
  function Sd(e) {
    if (e === ia || e === si)
      throw Error(u(483));
  }
  var ca = null, Ja = 0;
  function ci(e) {
    var t = Ja;
    return Ja += 1, ca === null && (ca = []), _d(ca, e, t);
  }
  function Wa(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function ri(e, t) {
    throw t.$$typeof === j ? Error(u(525)) : (e = Object.prototype.toString.call(t), Error(
      u(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function wd(e) {
    function t(k, N) {
      if (e) {
        var z = k.deletions;
        z === null ? (k.deletions = [N], k.flags |= 16) : z.push(N);
      }
    }
    function n(k, N) {
      if (!e) return null;
      for (; N !== null; )
        t(k, N), N = N.sibling;
      return null;
    }
    function l(k) {
      for (var N = /* @__PURE__ */ new Map(); k !== null; )
        k.key !== null ? N.set(k.key, k) : N.set(k.index, k), k = k.sibling;
      return N;
    }
    function i(k, N) {
      return k = yn(k, N), k.index = 0, k.sibling = null, k;
    }
    function c(k, N, z) {
      return k.index = z, e ? (z = k.alternate, z !== null ? (z = z.index, z < N ? (k.flags |= 67108866, N) : z) : (k.flags |= 67108866, N)) : (k.flags |= 1048576, N);
    }
    function d(k) {
      return e && k.alternate === null && (k.flags |= 67108866), k;
    }
    function x(k, N, z, q) {
      return N === null || N.tag !== 6 ? (N = Wc(z, k.mode, q), N.return = k, N) : (N = i(N, z), N.return = k, N);
    }
    function S(k, N, z, q) {
      var ue = z.type;
      return ue === M ? U(
        k,
        N,
        z.props.children,
        q,
        z.key
      ) : N !== null && (N.elementType === ue || typeof ue == "object" && ue !== null && ue.$$typeof === ie && Nl(ue) === N.type) ? (N = i(N, z.props), Wa(N, z), N.return = k, N) : (N = ei(
        z.type,
        z.key,
        z.props,
        null,
        k.mode,
        q
      ), Wa(N, z), N.return = k, N);
    }
    function O(k, N, z, q) {
      return N === null || N.tag !== 4 || N.stateNode.containerInfo !== z.containerInfo || N.stateNode.implementation !== z.implementation ? (N = Pc(z, k.mode, q), N.return = k, N) : (N = i(N, z.children || []), N.return = k, N);
    }
    function U(k, N, z, q, ue) {
      return N === null || N.tag !== 7 ? (N = yl(
        z,
        k.mode,
        q,
        ue
      ), N.return = k, N) : (N = i(N, z), N.return = k, N);
    }
    function $(k, N, z) {
      if (typeof N == "string" && N !== "" || typeof N == "number" || typeof N == "bigint")
        return N = Wc(
          "" + N,
          k.mode,
          z
        ), N.return = k, N;
      if (typeof N == "object" && N !== null) {
        switch (N.$$typeof) {
          case E:
            return z = ei(
              N.type,
              N.key,
              N.props,
              null,
              k.mode,
              z
            ), Wa(z, N), z.return = k, z;
          case A:
            return N = Pc(
              N,
              k.mode,
              z
            ), N.return = k, N;
          case ie:
            return N = Nl(N), $(k, N, z);
        }
        if (ee(N) || de(N))
          return N = yl(
            N,
            k.mode,
            z,
            null
          ), N.return = k, N;
        if (typeof N.then == "function")
          return $(k, ci(N), z);
        if (N.$$typeof === G)
          return $(
            k,
            li(k, N),
            z
          );
        ri(k, N);
      }
      return null;
    }
    function D(k, N, z, q) {
      var ue = N !== null ? N.key : null;
      if (typeof z == "string" && z !== "" || typeof z == "number" || typeof z == "bigint")
        return ue !== null ? null : x(k, N, "" + z, q);
      if (typeof z == "object" && z !== null) {
        switch (z.$$typeof) {
          case E:
            return z.key === ue ? S(k, N, z, q) : null;
          case A:
            return z.key === ue ? O(k, N, z, q) : null;
          case ie:
            return z = Nl(z), D(k, N, z, q);
        }
        if (ee(z) || de(z))
          return ue !== null ? null : U(k, N, z, q, null);
        if (typeof z.then == "function")
          return D(
            k,
            N,
            ci(z),
            q
          );
        if (z.$$typeof === G)
          return D(
            k,
            N,
            li(k, z),
            q
          );
        ri(k, z);
      }
      return null;
    }
    function H(k, N, z, q, ue) {
      if (typeof q == "string" && q !== "" || typeof q == "number" || typeof q == "bigint")
        return k = k.get(z) || null, x(N, k, "" + q, ue);
      if (typeof q == "object" && q !== null) {
        switch (q.$$typeof) {
          case E:
            return k = k.get(
              q.key === null ? z : q.key
            ) || null, S(N, k, q, ue);
          case A:
            return k = k.get(
              q.key === null ? z : q.key
            ) || null, O(N, k, q, ue);
          case ie:
            return q = Nl(q), H(
              k,
              N,
              z,
              q,
              ue
            );
        }
        if (ee(q) || de(q))
          return k = k.get(z) || null, U(N, k, q, ue, null);
        if (typeof q.then == "function")
          return H(
            k,
            N,
            z,
            ci(q),
            ue
          );
        if (q.$$typeof === G)
          return H(
            k,
            N,
            z,
            li(N, q),
            ue
          );
        ri(N, q);
      }
      return null;
    }
    function te(k, N, z, q) {
      for (var ue = null, Me = null, le = N, be = N = 0, Ne = null; le !== null && be < z.length; be++) {
        le.index > be ? (Ne = le, le = null) : Ne = le.sibling;
        var Ce = D(
          k,
          le,
          z[be],
          q
        );
        if (Ce === null) {
          le === null && (le = Ne);
          break;
        }
        e && le && Ce.alternate === null && t(k, le), N = c(Ce, N, be), Me === null ? ue = Ce : Me.sibling = Ce, Me = Ce, le = Ne;
      }
      if (be === z.length)
        return n(k, le), Ee && _n(k, be), ue;
      if (le === null) {
        for (; be < z.length; be++)
          le = $(k, z[be], q), le !== null && (N = c(
            le,
            N,
            be
          ), Me === null ? ue = le : Me.sibling = le, Me = le);
        return Ee && _n(k, be), ue;
      }
      for (le = l(le); be < z.length; be++)
        Ne = H(
          le,
          k,
          be,
          z[be],
          q
        ), Ne !== null && (e && Ne.alternate !== null && le.delete(
          Ne.key === null ? be : Ne.key
        ), N = c(
          Ne,
          N,
          be
        ), Me === null ? ue = Ne : Me.sibling = Ne, Me = Ne);
      return e && le.forEach(function(il) {
        return t(k, il);
      }), Ee && _n(k, be), ue;
    }
    function oe(k, N, z, q) {
      if (z == null) throw Error(u(151));
      for (var ue = null, Me = null, le = N, be = N = 0, Ne = null, Ce = z.next(); le !== null && !Ce.done; be++, Ce = z.next()) {
        le.index > be ? (Ne = le, le = null) : Ne = le.sibling;
        var il = D(k, le, Ce.value, q);
        if (il === null) {
          le === null && (le = Ne);
          break;
        }
        e && le && il.alternate === null && t(k, le), N = c(il, N, be), Me === null ? ue = il : Me.sibling = il, Me = il, le = Ne;
      }
      if (Ce.done)
        return n(k, le), Ee && _n(k, be), ue;
      if (le === null) {
        for (; !Ce.done; be++, Ce = z.next())
          Ce = $(k, Ce.value, q), Ce !== null && (N = c(Ce, N, be), Me === null ? ue = Ce : Me.sibling = Ce, Me = Ce);
        return Ee && _n(k, be), ue;
      }
      for (le = l(le); !Ce.done; be++, Ce = z.next())
        Ce = H(le, k, be, Ce.value, q), Ce !== null && (e && Ce.alternate !== null && le.delete(Ce.key === null ? be : Ce.key), N = c(Ce, N, be), Me === null ? ue = Ce : Me.sibling = Ce, Me = Ce);
      return e && le.forEach(function(Zg) {
        return t(k, Zg);
      }), Ee && _n(k, be), ue;
    }
    function Le(k, N, z, q) {
      if (typeof z == "object" && z !== null && z.type === M && z.key === null && (z = z.props.children), typeof z == "object" && z !== null) {
        switch (z.$$typeof) {
          case E:
            e: {
              for (var ue = z.key; N !== null; ) {
                if (N.key === ue) {
                  if (ue = z.type, ue === M) {
                    if (N.tag === 7) {
                      n(
                        k,
                        N.sibling
                      ), q = i(
                        N,
                        z.props.children
                      ), q.return = k, k = q;
                      break e;
                    }
                  } else if (N.elementType === ue || typeof ue == "object" && ue !== null && ue.$$typeof === ie && Nl(ue) === N.type) {
                    n(
                      k,
                      N.sibling
                    ), q = i(N, z.props), Wa(q, z), q.return = k, k = q;
                    break e;
                  }
                  n(k, N);
                  break;
                } else t(k, N);
                N = N.sibling;
              }
              z.type === M ? (q = yl(
                z.props.children,
                k.mode,
                q,
                z.key
              ), q.return = k, k = q) : (q = ei(
                z.type,
                z.key,
                z.props,
                null,
                k.mode,
                q
              ), Wa(q, z), q.return = k, k = q);
            }
            return d(k);
          case A:
            e: {
              for (ue = z.key; N !== null; ) {
                if (N.key === ue)
                  if (N.tag === 4 && N.stateNode.containerInfo === z.containerInfo && N.stateNode.implementation === z.implementation) {
                    n(
                      k,
                      N.sibling
                    ), q = i(N, z.children || []), q.return = k, k = q;
                    break e;
                  } else {
                    n(k, N);
                    break;
                  }
                else t(k, N);
                N = N.sibling;
              }
              q = Pc(z, k.mode, q), q.return = k, k = q;
            }
            return d(k);
          case ie:
            return z = Nl(z), Le(
              k,
              N,
              z,
              q
            );
        }
        if (ee(z))
          return te(
            k,
            N,
            z,
            q
          );
        if (de(z)) {
          if (ue = de(z), typeof ue != "function") throw Error(u(150));
          return z = ue.call(z), oe(
            k,
            N,
            z,
            q
          );
        }
        if (typeof z.then == "function")
          return Le(
            k,
            N,
            ci(z),
            q
          );
        if (z.$$typeof === G)
          return Le(
            k,
            N,
            li(k, z),
            q
          );
        ri(k, z);
      }
      return typeof z == "string" && z !== "" || typeof z == "number" || typeof z == "bigint" ? (z = "" + z, N !== null && N.tag === 6 ? (n(k, N.sibling), q = i(N, z), q.return = k, k = q) : (n(k, N), q = Wc(z, k.mode, q), q.return = k, k = q), d(k)) : n(k, N);
    }
    return function(k, N, z, q) {
      try {
        Ja = 0;
        var ue = Le(
          k,
          N,
          z,
          q
        );
        return ca = null, ue;
      } catch (le) {
        if (le === ia || le === si) throw le;
        var Me = Ot(29, le, null, k.mode);
        return Me.lanes = q, Me.return = k, Me;
      } finally {
      }
    };
  }
  var Ml = wd(!0), Nd = wd(!1), $n = !1;
  function or(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function dr(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function Vn(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function Qn(e, t, n) {
    var l = e.updateQueue;
    if (l === null) return null;
    if (l = l.shared, (ke & 2) !== 0) {
      var i = l.pending;
      return i === null ? t.next = t : (t.next = i.next, i.next = t), l.pending = t, t = Is(e), rd(e, null, n), t;
    }
    return Ps(e, l, t, n), Is(e);
  }
  function Pa(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194048) !== 0)) {
      var l = t.lanes;
      l &= e.pendingLanes, n |= l, t.lanes = n, vo(e, n);
    }
  }
  function fr(e, t) {
    var n = e.updateQueue, l = e.alternate;
    if (l !== null && (l = l.updateQueue, n === l)) {
      var i = null, c = null;
      if (n = n.firstBaseUpdate, n !== null) {
        do {
          var d = {
            lane: n.lane,
            tag: n.tag,
            payload: n.payload,
            callback: null,
            next: null
          };
          c === null ? i = c = d : c = c.next = d, n = n.next;
        } while (n !== null);
        c === null ? i = c = t : c = c.next = t;
      } else i = c = t;
      n = {
        baseState: l.baseState,
        firstBaseUpdate: i,
        lastBaseUpdate: c,
        shared: l.shared,
        callbacks: l.callbacks
      }, e.updateQueue = n;
      return;
    }
    e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
  }
  var hr = !1;
  function Ia() {
    if (hr) {
      var e = sa;
      if (e !== null) throw e;
    }
  }
  function es(e, t, n, l) {
    hr = !1;
    var i = e.updateQueue;
    $n = !1;
    var c = i.firstBaseUpdate, d = i.lastBaseUpdate, x = i.shared.pending;
    if (x !== null) {
      i.shared.pending = null;
      var S = x, O = S.next;
      S.next = null, d === null ? c = O : d.next = O, d = S;
      var U = e.alternate;
      U !== null && (U = U.updateQueue, x = U.lastBaseUpdate, x !== d && (x === null ? U.firstBaseUpdate = O : x.next = O, U.lastBaseUpdate = S));
    }
    if (c !== null) {
      var $ = i.baseState;
      d = 0, U = O = S = null, x = c;
      do {
        var D = x.lane & -536870913, H = D !== x.lane;
        if (H ? (we & D) === D : (l & D) === D) {
          D !== 0 && D === aa && (hr = !0), U !== null && (U = U.next = {
            lane: 0,
            tag: x.tag,
            payload: x.payload,
            callback: null,
            next: null
          });
          e: {
            var te = e, oe = x;
            D = t;
            var Le = n;
            switch (oe.tag) {
              case 1:
                if (te = oe.payload, typeof te == "function") {
                  $ = te.call(Le, $, D);
                  break e;
                }
                $ = te;
                break e;
              case 3:
                te.flags = te.flags & -65537 | 128;
              case 0:
                if (te = oe.payload, D = typeof te == "function" ? te.call(Le, $, D) : te, D == null) break e;
                $ = y({}, $, D);
                break e;
              case 2:
                $n = !0;
            }
          }
          D = x.callback, D !== null && (e.flags |= 64, H && (e.flags |= 8192), H = i.callbacks, H === null ? i.callbacks = [D] : H.push(D));
        } else
          H = {
            lane: D,
            tag: x.tag,
            payload: x.payload,
            callback: x.callback,
            next: null
          }, U === null ? (O = U = H, S = $) : U = U.next = H, d |= D;
        if (x = x.next, x === null) {
          if (x = i.shared.pending, x === null)
            break;
          H = x, x = H.next, H.next = null, i.lastBaseUpdate = H, i.shared.pending = null;
        }
      } while (!0);
      U === null && (S = $), i.baseState = S, i.firstBaseUpdate = O, i.lastBaseUpdate = U, c === null && (i.shared.lanes = 0), Jn |= d, e.lanes = d, e.memoizedState = $;
    }
  }
  function Ed(e, t) {
    if (typeof e != "function")
      throw Error(u(191, e));
    e.call(t);
  }
  function Md(e, t) {
    var n = e.callbacks;
    if (n !== null)
      for (e.callbacks = null, e = 0; e < n.length; e++)
        Ed(n[e], t);
  }
  var ra = w(null), ui = w(0);
  function Cd(e, t) {
    e = Rn, Z(ui, e), Z(ra, t), Rn = e | t.baseLanes;
  }
  function mr() {
    Z(ui, Rn), Z(ra, ra.current);
  }
  function pr() {
    Rn = ui.current, L(ra), L(ui);
  }
  var Dt = w(null), Wt = null;
  function Xn(e) {
    var t = e.alternate;
    Z(Fe, Fe.current & 1), Z(Dt, e), Wt === null && (t === null || ra.current !== null || t.memoizedState !== null) && (Wt = e);
  }
  function vr(e) {
    Z(Fe, Fe.current), Z(Dt, e), Wt === null && (Wt = e);
  }
  function kd(e) {
    e.tag === 22 ? (Z(Fe, Fe.current), Z(Dt, e), Wt === null && (Wt = e)) : Zn();
  }
  function Zn() {
    Z(Fe, Fe.current), Z(Dt, Dt.current);
  }
  function Ht(e) {
    L(Dt), Wt === e && (Wt = null), L(Fe);
  }
  var Fe = w(0);
  function oi(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var n = t.memoizedState;
        if (n !== null && (n = n.dehydrated, n === null || ju(n) || Su(n)))
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
  var wn = 0, xe = null, De = null, Ie = null, di = !1, ua = !1, Cl = !1, fi = 0, ts = 0, oa = null, Lv = 0;
  function Xe() {
    throw Error(u(321));
  }
  function gr(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++)
      if (!zt(e[n], t[n])) return !1;
    return !0;
  }
  function xr(e, t, n, l, i, c) {
    return wn = c, xe = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, C.H = e === null || e.memoizedState === null ? hf : zr, Cl = !1, c = n(l, i), Cl = !1, ua && (c = Ad(
      t,
      n,
      l,
      i
    )), Td(e), c;
  }
  function Td(e) {
    C.H = as;
    var t = De !== null && De.next !== null;
    if (wn = 0, Ie = De = xe = null, di = !1, ts = 0, oa = null, t) throw Error(u(300));
    e === null || et || (e = e.dependencies, e !== null && ni(e) && (et = !0));
  }
  function Ad(e, t, n, l) {
    xe = e;
    var i = 0;
    do {
      if (ua && (oa = null), ts = 0, ua = !1, 25 <= i) throw Error(u(301));
      if (i += 1, Ie = De = null, e.updateQueue != null) {
        var c = e.updateQueue;
        c.lastEffect = null, c.events = null, c.stores = null, c.memoCache != null && (c.memoCache.index = 0);
      }
      C.H = mf, c = t(n, l);
    } while (ua);
    return c;
  }
  function Uv() {
    var e = C.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? ns(t) : t, e = e.useState()[0], (De !== null ? De.memoizedState : null) !== e && (xe.flags |= 1024), t;
  }
  function br() {
    var e = fi !== 0;
    return fi = 0, e;
  }
  function yr(e, t, n) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
  }
  function _r(e) {
    if (di) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      di = !1;
    }
    wn = 0, Ie = De = xe = null, ua = !1, ts = fi = 0, oa = null;
  }
  function bt() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Ie === null ? xe.memoizedState = Ie = e : Ie = Ie.next = e, Ie;
  }
  function Je() {
    if (De === null) {
      var e = xe.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = De.next;
    var t = Ie === null ? xe.memoizedState : Ie.next;
    if (t !== null)
      Ie = t, De = e;
    else {
      if (e === null)
        throw xe.alternate === null ? Error(u(467)) : Error(u(310));
      De = e, e = {
        memoizedState: De.memoizedState,
        baseState: De.baseState,
        baseQueue: De.baseQueue,
        queue: De.queue,
        next: null
      }, Ie === null ? xe.memoizedState = Ie = e : Ie = Ie.next = e;
    }
    return Ie;
  }
  function hi() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function ns(e) {
    var t = ts;
    return ts += 1, oa === null && (oa = []), e = _d(oa, e, t), t = xe, (Ie === null ? t.memoizedState : Ie.next) === null && (t = t.alternate, C.H = t === null || t.memoizedState === null ? hf : zr), e;
  }
  function mi(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return ns(e);
      if (e.$$typeof === G) return ut(e);
    }
    throw Error(u(438, String(e)));
  }
  function jr(e) {
    var t = null, n = xe.updateQueue;
    if (n !== null && (t = n.memoCache), t == null) {
      var l = xe.alternate;
      l !== null && (l = l.updateQueue, l !== null && (l = l.memoCache, l != null && (t = {
        data: l.data.map(function(i) {
          return i.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), n === null && (n = hi(), xe.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0)
      for (n = t.data[t.index] = Array(e), l = 0; l < e; l++)
        n[l] = ae;
    return t.index++, n;
  }
  function Nn(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function pi(e) {
    var t = Je();
    return Sr(t, De, e);
  }
  function Sr(e, t, n) {
    var l = e.queue;
    if (l === null) throw Error(u(311));
    l.lastRenderedReducer = n;
    var i = e.baseQueue, c = l.pending;
    if (c !== null) {
      if (i !== null) {
        var d = i.next;
        i.next = c.next, c.next = d;
      }
      t.baseQueue = i = c, l.pending = null;
    }
    if (c = e.baseState, i === null) e.memoizedState = c;
    else {
      t = i.next;
      var x = d = null, S = null, O = t, U = !1;
      do {
        var $ = O.lane & -536870913;
        if ($ !== O.lane ? (we & $) === $ : (wn & $) === $) {
          var D = O.revertLane;
          if (D === 0)
            S !== null && (S = S.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: O.action,
              hasEagerState: O.hasEagerState,
              eagerState: O.eagerState,
              next: null
            }), $ === aa && (U = !0);
          else if ((wn & D) === D) {
            O = O.next, D === aa && (U = !0);
            continue;
          } else
            $ = {
              lane: 0,
              revertLane: O.revertLane,
              gesture: null,
              action: O.action,
              hasEagerState: O.hasEagerState,
              eagerState: O.eagerState,
              next: null
            }, S === null ? (x = S = $, d = c) : S = S.next = $, xe.lanes |= D, Jn |= D;
          $ = O.action, Cl && n(c, $), c = O.hasEagerState ? O.eagerState : n(c, $);
        } else
          D = {
            lane: $,
            revertLane: O.revertLane,
            gesture: O.gesture,
            action: O.action,
            hasEagerState: O.hasEagerState,
            eagerState: O.eagerState,
            next: null
          }, S === null ? (x = S = D, d = c) : S = S.next = D, xe.lanes |= $, Jn |= $;
        O = O.next;
      } while (O !== null && O !== t);
      if (S === null ? d = c : S.next = x, !zt(c, e.memoizedState) && (et = !0, U && (n = sa, n !== null)))
        throw n;
      e.memoizedState = c, e.baseState = d, e.baseQueue = S, l.lastRenderedState = c;
    }
    return i === null && (l.lanes = 0), [e.memoizedState, l.dispatch];
  }
  function wr(e) {
    var t = Je(), n = t.queue;
    if (n === null) throw Error(u(311));
    n.lastRenderedReducer = e;
    var l = n.dispatch, i = n.pending, c = t.memoizedState;
    if (i !== null) {
      n.pending = null;
      var d = i = i.next;
      do
        c = e(c, d.action), d = d.next;
      while (d !== i);
      zt(c, t.memoizedState) || (et = !0), t.memoizedState = c, t.baseQueue === null && (t.baseState = c), n.lastRenderedState = c;
    }
    return [c, l];
  }
  function Rd(e, t, n) {
    var l = xe, i = Je(), c = Ee;
    if (c) {
      if (n === void 0) throw Error(u(407));
      n = n();
    } else n = t();
    var d = !zt(
      (De || i).memoizedState,
      n
    );
    if (d && (i.memoizedState = n, et = !0), i = i.queue, Mr(Dd.bind(null, l, i, e), [
      e
    ]), i.getSnapshot !== t || d || Ie !== null && Ie.memoizedState.tag & 1) {
      if (l.flags |= 2048, da(
        9,
        { destroy: void 0 },
        Od.bind(
          null,
          l,
          i,
          n,
          t
        ),
        null
      ), Ue === null) throw Error(u(349));
      c || (wn & 127) !== 0 || zd(l, t, n);
    }
    return n;
  }
  function zd(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = xe.updateQueue, t === null ? (t = hi(), xe.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function Od(e, t, n, l) {
    t.value = n, t.getSnapshot = l, Hd(t) && Ld(e);
  }
  function Dd(e, t, n) {
    return n(function() {
      Hd(t) && Ld(e);
    });
  }
  function Hd(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !zt(e, n);
    } catch {
      return !0;
    }
  }
  function Ld(e) {
    var t = bl(e, 2);
    t !== null && kt(t, e, 2);
  }
  function Nr(e) {
    var t = bt();
    if (typeof e == "function") {
      var n = e;
      if (e = n(), Cl) {
        Hn(!0);
        try {
          n();
        } finally {
          Hn(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = e, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Nn,
      lastRenderedState: e
    }, t;
  }
  function Ud(e, t, n, l) {
    return e.baseState = n, Sr(
      e,
      De,
      typeof l == "function" ? l : Nn
    );
  }
  function Bv(e, t, n, l, i) {
    if (xi(e)) throw Error(u(485));
    if (e = t.action, e !== null) {
      var c = {
        payload: i,
        action: e,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(d) {
          c.listeners.push(d);
        }
      };
      C.T !== null ? n(!0) : c.isTransition = !1, l(c), n = t.pending, n === null ? (c.next = t.pending = c, Bd(t, c)) : (c.next = n.next, t.pending = n.next = c);
    }
  }
  function Bd(e, t) {
    var n = t.action, l = t.payload, i = e.state;
    if (t.isTransition) {
      var c = C.T, d = {};
      C.T = d;
      try {
        var x = n(i, l), S = C.S;
        S !== null && S(d, x), Gd(e, t, x);
      } catch (O) {
        Er(e, t, O);
      } finally {
        c !== null && d.types !== null && (c.types = d.types), C.T = c;
      }
    } else
      try {
        c = n(i, l), Gd(e, t, c);
      } catch (O) {
        Er(e, t, O);
      }
  }
  function Gd(e, t, n) {
    n !== null && typeof n == "object" && typeof n.then == "function" ? n.then(
      function(l) {
        qd(e, t, l);
      },
      function(l) {
        return Er(e, t, l);
      }
    ) : qd(e, t, n);
  }
  function qd(e, t, n) {
    t.status = "fulfilled", t.value = n, Yd(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, Bd(e, n)));
  }
  function Er(e, t, n) {
    var l = e.pending;
    if (e.pending = null, l !== null) {
      l = l.next;
      do
        t.status = "rejected", t.reason = n, Yd(t), t = t.next;
      while (t !== l);
    }
    e.action = null;
  }
  function Yd(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function $d(e, t) {
    return t;
  }
  function Vd(e, t) {
    if (Ee) {
      var n = Ue.formState;
      if (n !== null) {
        e: {
          var l = xe;
          if (Ee) {
            if (qe) {
              t: {
                for (var i = qe, c = Jt; i.nodeType !== 8; ) {
                  if (!c) {
                    i = null;
                    break t;
                  }
                  if (i = Pt(
                    i.nextSibling
                  ), i === null) {
                    i = null;
                    break t;
                  }
                }
                c = i.data, i = c === "F!" || c === "F" ? i : null;
              }
              if (i) {
                qe = Pt(
                  i.nextSibling
                ), l = i.data === "F!";
                break e;
              }
            }
            qn(l);
          }
          l = !1;
        }
        l && (t = n[0]);
      }
    }
    return n = bt(), n.memoizedState = n.baseState = t, l = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: $d,
      lastRenderedState: t
    }, n.queue = l, n = of.bind(
      null,
      xe,
      l
    ), l.dispatch = n, l = Nr(!1), c = Rr.bind(
      null,
      xe,
      !1,
      l.queue
    ), l = bt(), i = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, l.queue = i, n = Bv.bind(
      null,
      xe,
      i,
      c,
      n
    ), i.dispatch = n, l.memoizedState = e, [t, n, !1];
  }
  function Qd(e) {
    var t = Je();
    return Xd(t, De, e);
  }
  function Xd(e, t, n) {
    if (t = Sr(
      e,
      t,
      $d
    )[0], e = pi(Nn)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var l = ns(t);
      } catch (d) {
        throw d === ia ? si : d;
      }
    else l = t;
    t = Je();
    var i = t.queue, c = i.dispatch;
    return n !== t.memoizedState && (xe.flags |= 2048, da(
      9,
      { destroy: void 0 },
      Gv.bind(null, i, n),
      null
    )), [l, c, e];
  }
  function Gv(e, t) {
    e.action = t;
  }
  function Zd(e) {
    var t = Je(), n = De;
    if (n !== null)
      return Xd(t, n, e);
    Je(), t = t.memoizedState, n = Je();
    var l = n.queue.dispatch;
    return n.memoizedState = e, [t, l, !1];
  }
  function da(e, t, n, l) {
    return e = { tag: e, create: n, deps: l, inst: t, next: null }, t = xe.updateQueue, t === null && (t = hi(), xe.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (l = n.next, n.next = e, e.next = l, t.lastEffect = e), e;
  }
  function Kd() {
    return Je().memoizedState;
  }
  function vi(e, t, n, l) {
    var i = bt();
    xe.flags |= e, i.memoizedState = da(
      1 | t,
      { destroy: void 0 },
      n,
      l === void 0 ? null : l
    );
  }
  function gi(e, t, n, l) {
    var i = Je();
    l = l === void 0 ? null : l;
    var c = i.memoizedState.inst;
    De !== null && l !== null && gr(l, De.memoizedState.deps) ? i.memoizedState = da(t, c, n, l) : (xe.flags |= e, i.memoizedState = da(
      1 | t,
      c,
      n,
      l
    ));
  }
  function Fd(e, t) {
    vi(8390656, 8, e, t);
  }
  function Mr(e, t) {
    gi(2048, 8, e, t);
  }
  function qv(e) {
    xe.flags |= 4;
    var t = xe.updateQueue;
    if (t === null)
      t = hi(), xe.updateQueue = t, t.events = [e];
    else {
      var n = t.events;
      n === null ? t.events = [e] : n.push(e);
    }
  }
  function Jd(e) {
    var t = Je().memoizedState;
    return qv({ ref: t, nextImpl: e }), function() {
      if ((ke & 2) !== 0) throw Error(u(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function Wd(e, t) {
    return gi(4, 2, e, t);
  }
  function Pd(e, t) {
    return gi(4, 4, e, t);
  }
  function Id(e, t) {
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
  function ef(e, t, n) {
    n = n != null ? n.concat([e]) : null, gi(4, 4, Id.bind(null, t, e), n);
  }
  function Cr() {
  }
  function tf(e, t) {
    var n = Je();
    t = t === void 0 ? null : t;
    var l = n.memoizedState;
    return t !== null && gr(t, l[1]) ? l[0] : (n.memoizedState = [e, t], e);
  }
  function nf(e, t) {
    var n = Je();
    t = t === void 0 ? null : t;
    var l = n.memoizedState;
    if (t !== null && gr(t, l[1]))
      return l[0];
    if (l = e(), Cl) {
      Hn(!0);
      try {
        e();
      } finally {
        Hn(!1);
      }
    }
    return n.memoizedState = [l, t], l;
  }
  function kr(e, t, n) {
    return n === void 0 || (wn & 1073741824) !== 0 && (we & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = n, e = ah(), xe.lanes |= e, Jn |= e, n);
  }
  function lf(e, t, n, l) {
    return zt(n, t) ? n : ra.current !== null ? (e = kr(e, n, l), zt(e, t) || (et = !0), e) : (wn & 42) === 0 || (wn & 1073741824) !== 0 && (we & 261930) === 0 ? (et = !0, e.memoizedState = n) : (e = ah(), xe.lanes |= e, Jn |= e, t);
  }
  function af(e, t, n, l, i) {
    var c = Y.p;
    Y.p = c !== 0 && 8 > c ? c : 8;
    var d = C.T, x = {};
    C.T = x, Rr(e, !1, t, n);
    try {
      var S = i(), O = C.S;
      if (O !== null && O(x, S), S !== null && typeof S == "object" && typeof S.then == "function") {
        var U = Hv(
          S,
          l
        );
        ls(
          e,
          t,
          U,
          Bt(e)
        );
      } else
        ls(
          e,
          t,
          l,
          Bt(e)
        );
    } catch ($) {
      ls(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: $ },
        Bt()
      );
    } finally {
      Y.p = c, d !== null && x.types !== null && (d.types = x.types), C.T = d;
    }
  }
  function Yv() {
  }
  function Tr(e, t, n, l) {
    if (e.tag !== 5) throw Error(u(476));
    var i = sf(e).queue;
    af(
      e,
      i,
      t,
      K,
      n === null ? Yv : function() {
        return cf(e), n(l);
      }
    );
  }
  function sf(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: K,
      baseState: K,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Nn,
        lastRenderedState: K
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
        lastRenderedReducer: Nn,
        lastRenderedState: n
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function cf(e) {
    var t = sf(e);
    t.next === null && (t = e.alternate.memoizedState), ls(
      e,
      t.next.queue,
      {},
      Bt()
    );
  }
  function Ar() {
    return ut(ys);
  }
  function rf() {
    return Je().memoizedState;
  }
  function uf() {
    return Je().memoizedState;
  }
  function $v(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var n = Bt();
          e = Vn(n);
          var l = Qn(t, e, n);
          l !== null && (kt(l, t, n), Pa(l, t, n)), t = { cache: ir() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function Vv(e, t, n) {
    var l = Bt();
    n = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, xi(e) ? df(t, n) : (n = Fc(e, t, n, l), n !== null && (kt(n, e, l), ff(n, t, l)));
  }
  function of(e, t, n) {
    var l = Bt();
    ls(e, t, n, l);
  }
  function ls(e, t, n, l) {
    var i = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (xi(e)) df(t, i);
    else {
      var c = e.alternate;
      if (e.lanes === 0 && (c === null || c.lanes === 0) && (c = t.lastRenderedReducer, c !== null))
        try {
          var d = t.lastRenderedState, x = c(d, n);
          if (i.hasEagerState = !0, i.eagerState = x, zt(x, d))
            return Ps(e, t, i, 0), Ue === null && Ws(), !1;
        } catch {
        } finally {
        }
      if (n = Fc(e, t, i, l), n !== null)
        return kt(n, e, l), ff(n, t, l), !0;
    }
    return !1;
  }
  function Rr(e, t, n, l) {
    if (l = {
      lane: 2,
      revertLane: ou(),
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, xi(e)) {
      if (t) throw Error(u(479));
    } else
      t = Fc(
        e,
        n,
        l,
        2
      ), t !== null && kt(t, e, 2);
  }
  function xi(e) {
    var t = e.alternate;
    return e === xe || t !== null && t === xe;
  }
  function df(e, t) {
    ua = di = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function ff(e, t, n) {
    if ((n & 4194048) !== 0) {
      var l = t.lanes;
      l &= e.pendingLanes, n |= l, t.lanes = n, vo(e, n);
    }
  }
  var as = {
    readContext: ut,
    use: mi,
    useCallback: Xe,
    useContext: Xe,
    useEffect: Xe,
    useImperativeHandle: Xe,
    useLayoutEffect: Xe,
    useInsertionEffect: Xe,
    useMemo: Xe,
    useReducer: Xe,
    useRef: Xe,
    useState: Xe,
    useDebugValue: Xe,
    useDeferredValue: Xe,
    useTransition: Xe,
    useSyncExternalStore: Xe,
    useId: Xe,
    useHostTransitionStatus: Xe,
    useFormState: Xe,
    useActionState: Xe,
    useOptimistic: Xe,
    useMemoCache: Xe,
    useCacheRefresh: Xe
  };
  as.useEffectEvent = Xe;
  var hf = {
    readContext: ut,
    use: mi,
    useCallback: function(e, t) {
      return bt().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: ut,
    useEffect: Fd,
    useImperativeHandle: function(e, t, n) {
      n = n != null ? n.concat([e]) : null, vi(
        4194308,
        4,
        Id.bind(null, t, e),
        n
      );
    },
    useLayoutEffect: function(e, t) {
      return vi(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      vi(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var n = bt();
      t = t === void 0 ? null : t;
      var l = e();
      if (Cl) {
        Hn(!0);
        try {
          e();
        } finally {
          Hn(!1);
        }
      }
      return n.memoizedState = [l, t], l;
    },
    useReducer: function(e, t, n) {
      var l = bt();
      if (n !== void 0) {
        var i = n(t);
        if (Cl) {
          Hn(!0);
          try {
            n(t);
          } finally {
            Hn(!1);
          }
        }
      } else i = t;
      return l.memoizedState = l.baseState = i, e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: i
      }, l.queue = e, e = e.dispatch = Vv.bind(
        null,
        xe,
        e
      ), [l.memoizedState, e];
    },
    useRef: function(e) {
      var t = bt();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = Nr(e);
      var t = e.queue, n = of.bind(null, xe, t);
      return t.dispatch = n, [e.memoizedState, n];
    },
    useDebugValue: Cr,
    useDeferredValue: function(e, t) {
      var n = bt();
      return kr(n, e, t);
    },
    useTransition: function() {
      var e = Nr(!1);
      return e = af.bind(
        null,
        xe,
        e.queue,
        !0,
        !1
      ), bt().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, n) {
      var l = xe, i = bt();
      if (Ee) {
        if (n === void 0)
          throw Error(u(407));
        n = n();
      } else {
        if (n = t(), Ue === null)
          throw Error(u(349));
        (we & 127) !== 0 || zd(l, t, n);
      }
      i.memoizedState = n;
      var c = { value: n, getSnapshot: t };
      return i.queue = c, Fd(Dd.bind(null, l, c, e), [
        e
      ]), l.flags |= 2048, da(
        9,
        { destroy: void 0 },
        Od.bind(
          null,
          l,
          c,
          n,
          t
        ),
        null
      ), n;
    },
    useId: function() {
      var e = bt(), t = Ue.identifierPrefix;
      if (Ee) {
        var n = on, l = un;
        n = (l & ~(1 << 32 - Rt(l) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = fi++, 0 < n && (t += "H" + n.toString(32)), t += "_";
      } else
        n = Lv++, t = "_" + t + "r_" + n.toString(32) + "_";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: Ar,
    useFormState: Vd,
    useActionState: Vd,
    useOptimistic: function(e) {
      var t = bt();
      t.memoizedState = t.baseState = e;
      var n = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = n, t = Rr.bind(
        null,
        xe,
        !0,
        n
      ), n.dispatch = t, [e, t];
    },
    useMemoCache: jr,
    useCacheRefresh: function() {
      return bt().memoizedState = $v.bind(
        null,
        xe
      );
    },
    useEffectEvent: function(e) {
      var t = bt(), n = { impl: e };
      return t.memoizedState = n, function() {
        if ((ke & 2) !== 0)
          throw Error(u(440));
        return n.impl.apply(void 0, arguments);
      };
    }
  }, zr = {
    readContext: ut,
    use: mi,
    useCallback: tf,
    useContext: ut,
    useEffect: Mr,
    useImperativeHandle: ef,
    useInsertionEffect: Wd,
    useLayoutEffect: Pd,
    useMemo: nf,
    useReducer: pi,
    useRef: Kd,
    useState: function() {
      return pi(Nn);
    },
    useDebugValue: Cr,
    useDeferredValue: function(e, t) {
      var n = Je();
      return lf(
        n,
        De.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = pi(Nn)[0], t = Je().memoizedState;
      return [
        typeof e == "boolean" ? e : ns(e),
        t
      ];
    },
    useSyncExternalStore: Rd,
    useId: rf,
    useHostTransitionStatus: Ar,
    useFormState: Qd,
    useActionState: Qd,
    useOptimistic: function(e, t) {
      var n = Je();
      return Ud(n, De, e, t);
    },
    useMemoCache: jr,
    useCacheRefresh: uf
  };
  zr.useEffectEvent = Jd;
  var mf = {
    readContext: ut,
    use: mi,
    useCallback: tf,
    useContext: ut,
    useEffect: Mr,
    useImperativeHandle: ef,
    useInsertionEffect: Wd,
    useLayoutEffect: Pd,
    useMemo: nf,
    useReducer: wr,
    useRef: Kd,
    useState: function() {
      return wr(Nn);
    },
    useDebugValue: Cr,
    useDeferredValue: function(e, t) {
      var n = Je();
      return De === null ? kr(n, e, t) : lf(
        n,
        De.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = wr(Nn)[0], t = Je().memoizedState;
      return [
        typeof e == "boolean" ? e : ns(e),
        t
      ];
    },
    useSyncExternalStore: Rd,
    useId: rf,
    useHostTransitionStatus: Ar,
    useFormState: Zd,
    useActionState: Zd,
    useOptimistic: function(e, t) {
      var n = Je();
      return De !== null ? Ud(n, De, e, t) : (n.baseState = e, [e, n.queue.dispatch]);
    },
    useMemoCache: jr,
    useCacheRefresh: uf
  };
  mf.useEffectEvent = Jd;
  function Or(e, t, n, l) {
    t = e.memoizedState, n = n(l, t), n = n == null ? t : y({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var Dr = {
    enqueueSetState: function(e, t, n) {
      e = e._reactInternals;
      var l = Bt(), i = Vn(l);
      i.payload = t, n != null && (i.callback = n), t = Qn(e, i, l), t !== null && (kt(t, e, l), Pa(t, e, l));
    },
    enqueueReplaceState: function(e, t, n) {
      e = e._reactInternals;
      var l = Bt(), i = Vn(l);
      i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Qn(e, i, l), t !== null && (kt(t, e, l), Pa(t, e, l));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var n = Bt(), l = Vn(n);
      l.tag = 2, t != null && (l.callback = t), t = Qn(e, l, n), t !== null && (kt(t, e, n), Pa(t, e, n));
    }
  };
  function pf(e, t, n, l, i, c, d) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(l, c, d) : t.prototype && t.prototype.isPureReactComponent ? !Va(n, l) || !Va(i, c) : !0;
  }
  function vf(e, t, n, l) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, l), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, l), t.state !== e && Dr.enqueueReplaceState(t, t.state, null);
  }
  function kl(e, t) {
    var n = t;
    if ("ref" in t) {
      n = {};
      for (var l in t)
        l !== "ref" && (n[l] = t[l]);
    }
    if (e = e.defaultProps) {
      n === t && (n = y({}, n));
      for (var i in e)
        n[i] === void 0 && (n[i] = e[i]);
    }
    return n;
  }
  function gf(e) {
    Js(e);
  }
  function xf(e) {
    console.error(e);
  }
  function bf(e) {
    Js(e);
  }
  function bi(e, t) {
    try {
      var n = e.onUncaughtError;
      n(t.value, { componentStack: t.stack });
    } catch (l) {
      setTimeout(function() {
        throw l;
      });
    }
  }
  function yf(e, t, n) {
    try {
      var l = e.onCaughtError;
      l(n.value, {
        componentStack: n.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (i) {
      setTimeout(function() {
        throw i;
      });
    }
  }
  function Hr(e, t, n) {
    return n = Vn(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
      bi(e, t);
    }, n;
  }
  function _f(e) {
    return e = Vn(e), e.tag = 3, e;
  }
  function jf(e, t, n, l) {
    var i = n.type.getDerivedStateFromError;
    if (typeof i == "function") {
      var c = l.value;
      e.payload = function() {
        return i(c);
      }, e.callback = function() {
        yf(t, n, l);
      };
    }
    var d = n.stateNode;
    d !== null && typeof d.componentDidCatch == "function" && (e.callback = function() {
      yf(t, n, l), typeof i != "function" && (Wn === null ? Wn = /* @__PURE__ */ new Set([this]) : Wn.add(this));
      var x = l.stack;
      this.componentDidCatch(l.value, {
        componentStack: x !== null ? x : ""
      });
    });
  }
  function Qv(e, t, n, l, i) {
    if (n.flags |= 32768, l !== null && typeof l == "object" && typeof l.then == "function") {
      if (t = n.alternate, t !== null && la(
        t,
        n,
        i,
        !0
      ), n = Dt.current, n !== null) {
        switch (n.tag) {
          case 31:
          case 13:
            return Wt === null ? Ai() : n.alternate === null && Ze === 0 && (Ze = 3), n.flags &= -257, n.flags |= 65536, n.lanes = i, l === ii ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([l]) : t.add(l), cu(e, l, i)), !1;
          case 22:
            return n.flags |= 65536, l === ii ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([l])
            }, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([l]) : n.add(l)), cu(e, l, i)), !1;
        }
        throw Error(u(435, n.tag));
      }
      return cu(e, l, i), Ai(), !1;
    }
    if (Ee)
      return t = Dt.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = i, l !== tr && (e = Error(u(422), { cause: l }), Za(Zt(e, n)))) : (l !== tr && (t = Error(u(423), {
        cause: l
      }), Za(
        Zt(t, n)
      )), e = e.current.alternate, e.flags |= 65536, i &= -i, e.lanes |= i, l = Zt(l, n), i = Hr(
        e.stateNode,
        l,
        i
      ), fr(e, i), Ze !== 4 && (Ze = 2)), !1;
    var c = Error(u(520), { cause: l });
    if (c = Zt(c, n), fs === null ? fs = [c] : fs.push(c), Ze !== 4 && (Ze = 2), t === null) return !0;
    l = Zt(l, n), n = t;
    do {
      switch (n.tag) {
        case 3:
          return n.flags |= 65536, e = i & -i, n.lanes |= e, e = Hr(n.stateNode, l, e), fr(n, e), !1;
        case 1:
          if (t = n.type, c = n.stateNode, (n.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || c !== null && typeof c.componentDidCatch == "function" && (Wn === null || !Wn.has(c))))
            return n.flags |= 65536, i &= -i, n.lanes |= i, i = _f(i), jf(
              i,
              e,
              n,
              l
            ), fr(n, i), !1;
      }
      n = n.return;
    } while (n !== null);
    return !1;
  }
  var Lr = Error(u(461)), et = !1;
  function ot(e, t, n, l) {
    t.child = e === null ? Nd(t, null, n, l) : Ml(
      t,
      e.child,
      n,
      l
    );
  }
  function Sf(e, t, n, l, i) {
    n = n.render;
    var c = t.ref;
    if ("ref" in l) {
      var d = {};
      for (var x in l)
        x !== "ref" && (d[x] = l[x]);
    } else d = l;
    return Sl(t), l = xr(
      e,
      t,
      n,
      d,
      c,
      i
    ), x = br(), e !== null && !et ? (yr(e, t, i), En(e, t, i)) : (Ee && x && Ic(t), t.flags |= 1, ot(e, t, l, i), t.child);
  }
  function wf(e, t, n, l, i) {
    if (e === null) {
      var c = n.type;
      return typeof c == "function" && !Jc(c) && c.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = c, Nf(
        e,
        t,
        c,
        l,
        i
      )) : (e = ei(
        n.type,
        null,
        l,
        t,
        t.mode,
        i
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (c = e.child, !Qr(e, i)) {
      var d = c.memoizedProps;
      if (n = n.compare, n = n !== null ? n : Va, n(d, l) && e.ref === t.ref)
        return En(e, t, i);
    }
    return t.flags |= 1, e = yn(c, l), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Nf(e, t, n, l, i) {
    if (e !== null) {
      var c = e.memoizedProps;
      if (Va(c, l) && e.ref === t.ref)
        if (et = !1, t.pendingProps = l = c, Qr(e, i))
          (e.flags & 131072) !== 0 && (et = !0);
        else
          return t.lanes = e.lanes, En(e, t, i);
    }
    return Ur(
      e,
      t,
      n,
      l,
      i
    );
  }
  function Ef(e, t, n, l) {
    var i = l.children, c = e !== null ? e.memoizedState : null;
    if (e === null && t.stateNode === null && (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), l.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (c = c !== null ? c.baseLanes | n : n, e !== null) {
          for (l = t.child = e.child, i = 0; l !== null; )
            i = i | l.lanes | l.childLanes, l = l.sibling;
          l = i & ~c;
        } else l = 0, t.child = null;
        return Mf(
          e,
          t,
          c,
          n,
          l
        );
      }
      if ((n & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && ai(
          t,
          c !== null ? c.cachePool : null
        ), c !== null ? Cd(t, c) : mr(), kd(t);
      else
        return l = t.lanes = 536870912, Mf(
          e,
          t,
          c !== null ? c.baseLanes | n : n,
          n,
          l
        );
    } else
      c !== null ? (ai(t, c.cachePool), Cd(t, c), Zn(), t.memoizedState = null) : (e !== null && ai(t, null), mr(), Zn());
    return ot(e, t, i, n), t.child;
  }
  function ss(e, t) {
    return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function Mf(e, t, n, l, i) {
    var c = rr();
    return c = c === null ? null : { parent: Pe._currentValue, pool: c }, t.memoizedState = {
      baseLanes: n,
      cachePool: c
    }, e !== null && ai(t, null), mr(), kd(t), e !== null && la(e, t, l, !0), t.childLanes = i, null;
  }
  function yi(e, t) {
    return t = ji(
      { mode: t.mode, children: t.children },
      e.mode
    ), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function Cf(e, t, n) {
    return Ml(t, e.child, null, n), e = yi(t, t.pendingProps), e.flags |= 2, Ht(t), t.memoizedState = null, e;
  }
  function Xv(e, t, n) {
    var l = t.pendingProps, i = (t.flags & 128) !== 0;
    if (t.flags &= -129, e === null) {
      if (Ee) {
        if (l.mode === "hidden")
          return e = yi(t, l), t.lanes = 536870912, ss(null, e);
        if (vr(t), (e = qe) ? (e = Gh(
          e,
          Jt
        ), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: Bn !== null ? { id: un, overflow: on } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = od(e), n.return = t, t.child = n, rt = t, qe = null)) : e = null, e === null) throw qn(t);
        return t.lanes = 536870912, null;
      }
      return yi(t, l);
    }
    var c = e.memoizedState;
    if (c !== null) {
      var d = c.dehydrated;
      if (vr(t), i)
        if (t.flags & 256)
          t.flags &= -257, t = Cf(
            e,
            t,
            n
          );
        else if (t.memoizedState !== null)
          t.child = e.child, t.flags |= 128, t = null;
        else throw Error(u(558));
      else if (et || la(e, t, n, !1), i = (n & e.childLanes) !== 0, et || i) {
        if (l = Ue, l !== null && (d = go(l, n), d !== 0 && d !== c.retryLane))
          throw c.retryLane = d, bl(e, d), kt(l, e, d), Lr;
        Ai(), t = Cf(
          e,
          t,
          n
        );
      } else
        e = c.treeContext, qe = Pt(d.nextSibling), rt = t, Ee = !0, Gn = null, Jt = !1, e !== null && hd(t, e), t = yi(t, l), t.flags |= 4096;
      return t;
    }
    return e = yn(e.child, {
      mode: l.mode,
      children: l.children
    }), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function _i(e, t) {
    var n = t.ref;
    if (n === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof n != "function" && typeof n != "object")
        throw Error(u(284));
      (e === null || e.ref !== n) && (t.flags |= 4194816);
    }
  }
  function Ur(e, t, n, l, i) {
    return Sl(t), n = xr(
      e,
      t,
      n,
      l,
      void 0,
      i
    ), l = br(), e !== null && !et ? (yr(e, t, i), En(e, t, i)) : (Ee && l && Ic(t), t.flags |= 1, ot(e, t, n, i), t.child);
  }
  function kf(e, t, n, l, i, c) {
    return Sl(t), t.updateQueue = null, n = Ad(
      t,
      l,
      n,
      i
    ), Td(e), l = br(), e !== null && !et ? (yr(e, t, c), En(e, t, c)) : (Ee && l && Ic(t), t.flags |= 1, ot(e, t, n, c), t.child);
  }
  function Tf(e, t, n, l, i) {
    if (Sl(t), t.stateNode === null) {
      var c = Il, d = n.contextType;
      typeof d == "object" && d !== null && (c = ut(d)), c = new n(l, c), t.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null, c.updater = Dr, t.stateNode = c, c._reactInternals = t, c = t.stateNode, c.props = l, c.state = t.memoizedState, c.refs = {}, or(t), d = n.contextType, c.context = typeof d == "object" && d !== null ? ut(d) : Il, c.state = t.memoizedState, d = n.getDerivedStateFromProps, typeof d == "function" && (Or(
        t,
        n,
        d,
        l
      ), c.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof c.getSnapshotBeforeUpdate == "function" || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (d = c.state, typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount(), d !== c.state && Dr.enqueueReplaceState(c, c.state, null), es(t, l, c, i), Ia(), c.state = t.memoizedState), typeof c.componentDidMount == "function" && (t.flags |= 4194308), l = !0;
    } else if (e === null) {
      c = t.stateNode;
      var x = t.memoizedProps, S = kl(n, x);
      c.props = S;
      var O = c.context, U = n.contextType;
      d = Il, typeof U == "object" && U !== null && (d = ut(U));
      var $ = n.getDerivedStateFromProps;
      U = typeof $ == "function" || typeof c.getSnapshotBeforeUpdate == "function", x = t.pendingProps !== x, U || typeof c.UNSAFE_componentWillReceiveProps != "function" && typeof c.componentWillReceiveProps != "function" || (x || O !== d) && vf(
        t,
        c,
        l,
        d
      ), $n = !1;
      var D = t.memoizedState;
      c.state = D, es(t, l, c, i), Ia(), O = t.memoizedState, x || D !== O || $n ? (typeof $ == "function" && (Or(
        t,
        n,
        $,
        l
      ), O = t.memoizedState), (S = $n || pf(
        t,
        n,
        S,
        l,
        D,
        O,
        d
      )) ? (U || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount()), typeof c.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof c.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = l, t.memoizedState = O), c.props = l, c.state = O, c.context = d, l = S) : (typeof c.componentDidMount == "function" && (t.flags |= 4194308), l = !1);
    } else {
      c = t.stateNode, dr(e, t), d = t.memoizedProps, U = kl(n, d), c.props = U, $ = t.pendingProps, D = c.context, O = n.contextType, S = Il, typeof O == "object" && O !== null && (S = ut(O)), x = n.getDerivedStateFromProps, (O = typeof x == "function" || typeof c.getSnapshotBeforeUpdate == "function") || typeof c.UNSAFE_componentWillReceiveProps != "function" && typeof c.componentWillReceiveProps != "function" || (d !== $ || D !== S) && vf(
        t,
        c,
        l,
        S
      ), $n = !1, D = t.memoizedState, c.state = D, es(t, l, c, i), Ia();
      var H = t.memoizedState;
      d !== $ || D !== H || $n || e !== null && e.dependencies !== null && ni(e.dependencies) ? (typeof x == "function" && (Or(
        t,
        n,
        x,
        l
      ), H = t.memoizedState), (U = $n || pf(
        t,
        n,
        U,
        l,
        D,
        H,
        S
      ) || e !== null && e.dependencies !== null && ni(e.dependencies)) ? (O || typeof c.UNSAFE_componentWillUpdate != "function" && typeof c.componentWillUpdate != "function" || (typeof c.componentWillUpdate == "function" && c.componentWillUpdate(l, H, S), typeof c.UNSAFE_componentWillUpdate == "function" && c.UNSAFE_componentWillUpdate(
        l,
        H,
        S
      )), typeof c.componentDidUpdate == "function" && (t.flags |= 4), typeof c.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof c.componentDidUpdate != "function" || d === e.memoizedProps && D === e.memoizedState || (t.flags |= 4), typeof c.getSnapshotBeforeUpdate != "function" || d === e.memoizedProps && D === e.memoizedState || (t.flags |= 1024), t.memoizedProps = l, t.memoizedState = H), c.props = l, c.state = H, c.context = S, l = U) : (typeof c.componentDidUpdate != "function" || d === e.memoizedProps && D === e.memoizedState || (t.flags |= 4), typeof c.getSnapshotBeforeUpdate != "function" || d === e.memoizedProps && D === e.memoizedState || (t.flags |= 1024), l = !1);
    }
    return c = l, _i(e, t), l = (t.flags & 128) !== 0, c || l ? (c = t.stateNode, n = l && typeof n.getDerivedStateFromError != "function" ? null : c.render(), t.flags |= 1, e !== null && l ? (t.child = Ml(
      t,
      e.child,
      null,
      i
    ), t.child = Ml(
      t,
      null,
      n,
      i
    )) : ot(e, t, n, i), t.memoizedState = c.state, e = t.child) : e = En(
      e,
      t,
      i
    ), e;
  }
  function Af(e, t, n, l) {
    return _l(), t.flags |= 256, ot(e, t, n, l), t.child;
  }
  var Br = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function Gr(e) {
    return { baseLanes: e, cachePool: bd() };
  }
  function qr(e, t, n) {
    return e = e !== null ? e.childLanes & ~n : 0, t && (e |= Ut), e;
  }
  function Rf(e, t, n) {
    var l = t.pendingProps, i = !1, c = (t.flags & 128) !== 0, d;
    if ((d = c) || (d = e !== null && e.memoizedState === null ? !1 : (Fe.current & 2) !== 0), d && (i = !0, t.flags &= -129), d = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (Ee) {
        if (i ? Xn(t) : Zn(), (e = qe) ? (e = Gh(
          e,
          Jt
        ), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: Bn !== null ? { id: un, overflow: on } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = od(e), n.return = t, t.child = n, rt = t, qe = null)) : e = null, e === null) throw qn(t);
        return Su(e) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      var x = l.children;
      return l = l.fallback, i ? (Zn(), i = t.mode, x = ji(
        { mode: "hidden", children: x },
        i
      ), l = yl(
        l,
        i,
        n,
        null
      ), x.return = t, l.return = t, x.sibling = l, t.child = x, l = t.child, l.memoizedState = Gr(n), l.childLanes = qr(
        e,
        d,
        n
      ), t.memoizedState = Br, ss(null, l)) : (Xn(t), Yr(t, x));
    }
    var S = e.memoizedState;
    if (S !== null && (x = S.dehydrated, x !== null)) {
      if (c)
        t.flags & 256 ? (Xn(t), t.flags &= -257, t = $r(
          e,
          t,
          n
        )) : t.memoizedState !== null ? (Zn(), t.child = e.child, t.flags |= 128, t = null) : (Zn(), x = l.fallback, i = t.mode, l = ji(
          { mode: "visible", children: l.children },
          i
        ), x = yl(
          x,
          i,
          n,
          null
        ), x.flags |= 2, l.return = t, x.return = t, l.sibling = x, t.child = l, Ml(
          t,
          e.child,
          null,
          n
        ), l = t.child, l.memoizedState = Gr(n), l.childLanes = qr(
          e,
          d,
          n
        ), t.memoizedState = Br, t = ss(null, l));
      else if (Xn(t), Su(x)) {
        if (d = x.nextSibling && x.nextSibling.dataset, d) var O = d.dgst;
        d = O, l = Error(u(419)), l.stack = "", l.digest = d, Za({ value: l, source: null, stack: null }), t = $r(
          e,
          t,
          n
        );
      } else if (et || la(e, t, n, !1), d = (n & e.childLanes) !== 0, et || d) {
        if (d = Ue, d !== null && (l = go(d, n), l !== 0 && l !== S.retryLane))
          throw S.retryLane = l, bl(e, l), kt(d, e, l), Lr;
        ju(x) || Ai(), t = $r(
          e,
          t,
          n
        );
      } else
        ju(x) ? (t.flags |= 192, t.child = e.child, t = null) : (e = S.treeContext, qe = Pt(
          x.nextSibling
        ), rt = t, Ee = !0, Gn = null, Jt = !1, e !== null && hd(t, e), t = Yr(
          t,
          l.children
        ), t.flags |= 4096);
      return t;
    }
    return i ? (Zn(), x = l.fallback, i = t.mode, S = e.child, O = S.sibling, l = yn(S, {
      mode: "hidden",
      children: l.children
    }), l.subtreeFlags = S.subtreeFlags & 65011712, O !== null ? x = yn(
      O,
      x
    ) : (x = yl(
      x,
      i,
      n,
      null
    ), x.flags |= 2), x.return = t, l.return = t, l.sibling = x, t.child = l, ss(null, l), l = t.child, x = e.child.memoizedState, x === null ? x = Gr(n) : (i = x.cachePool, i !== null ? (S = Pe._currentValue, i = i.parent !== S ? { parent: S, pool: S } : i) : i = bd(), x = {
      baseLanes: x.baseLanes | n,
      cachePool: i
    }), l.memoizedState = x, l.childLanes = qr(
      e,
      d,
      n
    ), t.memoizedState = Br, ss(e.child, l)) : (Xn(t), n = e.child, e = n.sibling, n = yn(n, {
      mode: "visible",
      children: l.children
    }), n.return = t, n.sibling = null, e !== null && (d = t.deletions, d === null ? (t.deletions = [e], t.flags |= 16) : d.push(e)), t.child = n, t.memoizedState = null, n);
  }
  function Yr(e, t) {
    return t = ji(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function ji(e, t) {
    return e = Ot(22, e, null, t), e.lanes = 0, e;
  }
  function $r(e, t, n) {
    return Ml(t, e.child, null, n), e = Yr(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function zf(e, t, n) {
    e.lanes |= t;
    var l = e.alternate;
    l !== null && (l.lanes |= t), ar(e.return, t, n);
  }
  function Vr(e, t, n, l, i, c) {
    var d = e.memoizedState;
    d === null ? e.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: l,
      tail: n,
      tailMode: i,
      treeForkCount: c
    } : (d.isBackwards = t, d.rendering = null, d.renderingStartTime = 0, d.last = l, d.tail = n, d.tailMode = i, d.treeForkCount = c);
  }
  function Of(e, t, n) {
    var l = t.pendingProps, i = l.revealOrder, c = l.tail;
    l = l.children;
    var d = Fe.current, x = (d & 2) !== 0;
    if (x ? (d = d & 1 | 2, t.flags |= 128) : d &= 1, Z(Fe, d), ot(e, t, l, n), l = Ee ? Xa : 0, !x && e !== null && (e.flags & 128) !== 0)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13)
          e.memoizedState !== null && zf(e, n, t);
        else if (e.tag === 19)
          zf(e, n, t);
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
    switch (i) {
      case "forwards":
        for (n = t.child, i = null; n !== null; )
          e = n.alternate, e !== null && oi(e) === null && (i = n), n = n.sibling;
        n = i, n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), Vr(
          t,
          !1,
          i,
          n,
          c,
          l
        );
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (n = null, i = t.child, t.child = null; i !== null; ) {
          if (e = i.alternate, e !== null && oi(e) === null) {
            t.child = i;
            break;
          }
          e = i.sibling, i.sibling = n, n = i, i = e;
        }
        Vr(
          t,
          !0,
          n,
          null,
          c,
          l
        );
        break;
      case "together":
        Vr(
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
  function En(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), Jn |= t.lanes, (n & t.childLanes) === 0)
      if (e !== null) {
        if (la(
          e,
          t,
          n,
          !1
        ), (n & t.childLanes) === 0)
          return null;
      } else return null;
    if (e !== null && t.child !== e.child)
      throw Error(u(153));
    if (t.child !== null) {
      for (e = t.child, n = yn(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; )
        e = e.sibling, n = n.sibling = yn(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function Qr(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && ni(e)));
  }
  function Zv(e, t, n) {
    switch (t.tag) {
      case 3:
        Ke(t, t.stateNode.containerInfo), Yn(t, Pe, e.memoizedState.cache), _l();
        break;
      case 27:
      case 5:
        tn(t);
        break;
      case 4:
        Ke(t, t.stateNode.containerInfo);
        break;
      case 10:
        Yn(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 31:
        if (t.memoizedState !== null)
          return t.flags |= 128, vr(t), null;
        break;
      case 13:
        var l = t.memoizedState;
        if (l !== null)
          return l.dehydrated !== null ? (Xn(t), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? Rf(e, t, n) : (Xn(t), e = En(
            e,
            t,
            n
          ), e !== null ? e.sibling : null);
        Xn(t);
        break;
      case 19:
        var i = (e.flags & 128) !== 0;
        if (l = (n & t.childLanes) !== 0, l || (la(
          e,
          t,
          n,
          !1
        ), l = (n & t.childLanes) !== 0), i) {
          if (l)
            return Of(
              e,
              t,
              n
            );
          t.flags |= 128;
        }
        if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), Z(Fe, Fe.current), l) break;
        return null;
      case 22:
        return t.lanes = 0, Ef(
          e,
          t,
          n,
          t.pendingProps
        );
      case 24:
        Yn(t, Pe, e.memoizedState.cache);
    }
    return En(e, t, n);
  }
  function Df(e, t, n) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        et = !0;
      else {
        if (!Qr(e, n) && (t.flags & 128) === 0)
          return et = !1, Zv(
            e,
            t,
            n
          );
        et = (e.flags & 131072) !== 0;
      }
    else
      et = !1, Ee && (t.flags & 1048576) !== 0 && fd(t, Xa, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          var l = t.pendingProps;
          if (e = Nl(t.elementType), t.type = e, typeof e == "function")
            Jc(e) ? (l = kl(e, l), t.tag = 1, t = Tf(
              null,
              t,
              e,
              l,
              n
            )) : (t.tag = 0, t = Ur(
              null,
              t,
              e,
              l,
              n
            ));
          else {
            if (e != null) {
              var i = e.$$typeof;
              if (i === ne) {
                t.tag = 11, t = Sf(
                  null,
                  t,
                  e,
                  l,
                  n
                );
                break e;
              } else if (i === F) {
                t.tag = 14, t = wf(
                  null,
                  t,
                  e,
                  l,
                  n
                );
                break e;
              }
            }
            throw t = W(e) || e, Error(u(306, t, ""));
          }
        }
        return t;
      case 0:
        return Ur(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 1:
        return l = t.type, i = kl(
          l,
          t.pendingProps
        ), Tf(
          e,
          t,
          l,
          i,
          n
        );
      case 3:
        e: {
          if (Ke(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(u(387));
          l = t.pendingProps;
          var c = t.memoizedState;
          i = c.element, dr(e, t), es(t, l, null, n);
          var d = t.memoizedState;
          if (l = d.cache, Yn(t, Pe, l), l !== c.cache && sr(
            t,
            [Pe],
            n,
            !0
          ), Ia(), l = d.element, c.isDehydrated)
            if (c = {
              element: l,
              isDehydrated: !1,
              cache: d.cache
            }, t.updateQueue.baseState = c, t.memoizedState = c, t.flags & 256) {
              t = Af(
                e,
                t,
                l,
                n
              );
              break e;
            } else if (l !== i) {
              i = Zt(
                Error(u(424)),
                t
              ), Za(i), t = Af(
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
              for (qe = Pt(e.firstChild), rt = t, Ee = !0, Gn = null, Jt = !0, n = Nd(
                t,
                null,
                l,
                n
              ), t.child = n; n; )
                n.flags = n.flags & -3 | 4096, n = n.sibling;
            }
          else {
            if (_l(), l === i) {
              t = En(
                e,
                t,
                n
              );
              break e;
            }
            ot(e, t, l, n);
          }
          t = t.child;
        }
        return t;
      case 26:
        return _i(e, t), e === null ? (n = Xh(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = n : Ee || (n = t.type, e = t.pendingProps, l = Ui(
          he.current
        ).createElement(n), l[ct] = t, l[St] = e, dt(l, n, e), st(l), t.stateNode = l) : t.memoizedState = Xh(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return tn(t), e === null && Ee && (l = t.stateNode = $h(
          t.type,
          t.pendingProps,
          he.current
        ), rt = t, Jt = !0, i = qe, tl(t.type) ? (wu = i, qe = Pt(l.firstChild)) : qe = i), ot(
          e,
          t,
          t.pendingProps.children,
          n
        ), _i(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && Ee && ((i = l = qe) && (l = Sg(
          l,
          t.type,
          t.pendingProps,
          Jt
        ), l !== null ? (t.stateNode = l, rt = t, qe = Pt(l.firstChild), Jt = !1, i = !0) : i = !1), i || qn(t)), tn(t), i = t.type, c = t.pendingProps, d = e !== null ? e.memoizedProps : null, l = c.children, bu(i, c) ? l = null : d !== null && bu(i, d) && (t.flags |= 32), t.memoizedState !== null && (i = xr(
          e,
          t,
          Uv,
          null,
          null,
          n
        ), ys._currentValue = i), _i(e, t), ot(e, t, l, n), t.child;
      case 6:
        return e === null && Ee && ((e = n = qe) && (n = wg(
          n,
          t.pendingProps,
          Jt
        ), n !== null ? (t.stateNode = n, rt = t, qe = null, e = !0) : e = !1), e || qn(t)), null;
      case 13:
        return Rf(e, t, n);
      case 4:
        return Ke(
          t,
          t.stateNode.containerInfo
        ), l = t.pendingProps, e === null ? t.child = Ml(
          t,
          null,
          l,
          n
        ) : ot(e, t, l, n), t.child;
      case 11:
        return Sf(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 7:
        return ot(
          e,
          t,
          t.pendingProps,
          n
        ), t.child;
      case 8:
        return ot(
          e,
          t,
          t.pendingProps.children,
          n
        ), t.child;
      case 12:
        return ot(
          e,
          t,
          t.pendingProps.children,
          n
        ), t.child;
      case 10:
        return l = t.pendingProps, Yn(t, t.type, l.value), ot(e, t, l.children, n), t.child;
      case 9:
        return i = t.type._context, l = t.pendingProps.children, Sl(t), i = ut(i), l = l(i), t.flags |= 1, ot(e, t, l, n), t.child;
      case 14:
        return wf(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 15:
        return Nf(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 19:
        return Of(e, t, n);
      case 31:
        return Xv(e, t, n);
      case 22:
        return Ef(
          e,
          t,
          n,
          t.pendingProps
        );
      case 24:
        return Sl(t), l = ut(Pe), e === null ? (i = rr(), i === null && (i = Ue, c = ir(), i.pooledCache = c, c.refCount++, c !== null && (i.pooledCacheLanes |= n), i = c), t.memoizedState = { parent: l, cache: i }, or(t), Yn(t, Pe, i)) : ((e.lanes & n) !== 0 && (dr(e, t), es(t, null, null, n), Ia()), i = e.memoizedState, c = t.memoizedState, i.parent !== l ? (i = { parent: l, cache: l }, t.memoizedState = i, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = i), Yn(t, Pe, l)) : (l = c.cache, Yn(t, Pe, l), l !== i.cache && sr(
          t,
          [Pe],
          n,
          !0
        ))), ot(
          e,
          t,
          t.pendingProps.children,
          n
        ), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(u(156, t.tag));
  }
  function Mn(e) {
    e.flags |= 4;
  }
  function Xr(e, t, n, l, i) {
    if ((t = (e.mode & 32) !== 0) && (t = !1), t) {
      if (e.flags |= 16777216, (i & 335544128) === i)
        if (e.stateNode.complete) e.flags |= 8192;
        else if (rh()) e.flags |= 8192;
        else
          throw El = ii, ur;
    } else e.flags &= -16777217;
  }
  function Hf(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !Wh(t))
      if (rh()) e.flags |= 8192;
      else
        throw El = ii, ur;
  }
  function Si(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? mo() : 536870912, e.lanes |= t, pa |= t);
  }
  function is(e, t) {
    if (!Ee)
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
  function Ye(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, l = 0;
    if (t)
      for (var i = e.child; i !== null; )
        n |= i.lanes | i.childLanes, l |= i.subtreeFlags & 65011712, l |= i.flags & 65011712, i.return = e, i = i.sibling;
    else
      for (i = e.child; i !== null; )
        n |= i.lanes | i.childLanes, l |= i.subtreeFlags, l |= i.flags, i.return = e, i = i.sibling;
    return e.subtreeFlags |= l, e.childLanes = n, t;
  }
  function Kv(e, t, n) {
    var l = t.pendingProps;
    switch (er(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Ye(t), null;
      case 1:
        return Ye(t), null;
      case 3:
        return n = t.stateNode, l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), Sn(Pe), Ae(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (na(t) ? Mn(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, nr())), Ye(t), null;
      case 26:
        var i = t.type, c = t.memoizedState;
        return e === null ? (Mn(t), c !== null ? (Ye(t), Hf(t, c)) : (Ye(t), Xr(
          t,
          i,
          null,
          l,
          n
        ))) : c ? c !== e.memoizedState ? (Mn(t), Ye(t), Hf(t, c)) : (Ye(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== l && Mn(t), Ye(t), Xr(
          t,
          i,
          e,
          l,
          n
        )), null;
      case 27:
        if (Tt(t), n = he.current, i = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== l && Mn(t);
        else {
          if (!l) {
            if (t.stateNode === null)
              throw Error(u(166));
            return Ye(t), null;
          }
          e = J.current, na(t) ? md(t) : (e = $h(i, l, n), t.stateNode = e, Mn(t));
        }
        return Ye(t), null;
      case 5:
        if (Tt(t), i = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== l && Mn(t);
        else {
          if (!l) {
            if (t.stateNode === null)
              throw Error(u(166));
            return Ye(t), null;
          }
          if (c = J.current, na(t))
            md(t);
          else {
            var d = Ui(
              he.current
            );
            switch (c) {
              case 1:
                c = d.createElementNS(
                  "http://www.w3.org/2000/svg",
                  i
                );
                break;
              case 2:
                c = d.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  i
                );
                break;
              default:
                switch (i) {
                  case "svg":
                    c = d.createElementNS(
                      "http://www.w3.org/2000/svg",
                      i
                    );
                    break;
                  case "math":
                    c = d.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      i
                    );
                    break;
                  case "script":
                    c = d.createElement("div"), c.innerHTML = "<script><\/script>", c = c.removeChild(
                      c.firstChild
                    );
                    break;
                  case "select":
                    c = typeof l.is == "string" ? d.createElement("select", {
                      is: l.is
                    }) : d.createElement("select"), l.multiple ? c.multiple = !0 : l.size && (c.size = l.size);
                    break;
                  default:
                    c = typeof l.is == "string" ? d.createElement(i, { is: l.is }) : d.createElement(i);
                }
            }
            c[ct] = t, c[St] = l;
            e: for (d = t.child; d !== null; ) {
              if (d.tag === 5 || d.tag === 6)
                c.appendChild(d.stateNode);
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
            t.stateNode = c;
            e: switch (dt(c, i, l), i) {
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
            l && Mn(t);
          }
        }
        return Ye(t), Xr(
          t,
          t.type,
          e === null ? null : e.memoizedProps,
          t.pendingProps,
          n
        ), null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== l && Mn(t);
        else {
          if (typeof l != "string" && t.stateNode === null)
            throw Error(u(166));
          if (e = he.current, na(t)) {
            if (e = t.stateNode, n = t.memoizedProps, l = null, i = rt, i !== null)
              switch (i.tag) {
                case 27:
                case 5:
                  l = i.memoizedProps;
              }
            e[ct] = t, e = !!(e.nodeValue === n || l !== null && l.suppressHydrationWarning === !0 || Rh(e.nodeValue, n)), e || qn(t, !0);
          } else
            e = Ui(e).createTextNode(
              l
            ), e[ct] = t, t.stateNode = e;
        }
        return Ye(t), null;
      case 31:
        if (n = t.memoizedState, e === null || e.memoizedState !== null) {
          if (l = na(t), n !== null) {
            if (e === null) {
              if (!l) throw Error(u(318));
              if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(u(557));
              e[ct] = t;
            } else
              _l(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Ye(t), e = !1;
          } else
            n = nr(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
          if (!e)
            return t.flags & 256 ? (Ht(t), t) : (Ht(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(u(558));
        }
        return Ye(t), null;
      case 13:
        if (l = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (i = na(t), l !== null && l.dehydrated !== null) {
            if (e === null) {
              if (!i) throw Error(u(318));
              if (i = t.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(u(317));
              i[ct] = t;
            } else
              _l(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Ye(t), i = !1;
          } else
            i = nr(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = i), i = !0;
          if (!i)
            return t.flags & 256 ? (Ht(t), t) : (Ht(t), null);
        }
        return Ht(t), (t.flags & 128) !== 0 ? (t.lanes = n, t) : (n = l !== null, e = e !== null && e.memoizedState !== null, n && (l = t.child, i = null, l.alternate !== null && l.alternate.memoizedState !== null && l.alternate.memoizedState.cachePool !== null && (i = l.alternate.memoizedState.cachePool.pool), c = null, l.memoizedState !== null && l.memoizedState.cachePool !== null && (c = l.memoizedState.cachePool.pool), c !== i && (l.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), Si(t, t.updateQueue), Ye(t), null);
      case 4:
        return Ae(), e === null && mu(t.stateNode.containerInfo), Ye(t), null;
      case 10:
        return Sn(t.type), Ye(t), null;
      case 19:
        if (L(Fe), l = t.memoizedState, l === null) return Ye(t), null;
        if (i = (t.flags & 128) !== 0, c = l.rendering, c === null)
          if (i) is(l, !1);
          else {
            if (Ze !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (c = oi(e), c !== null) {
                  for (t.flags |= 128, is(l, !1), e = c.updateQueue, t.updateQueue = e, Si(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null; )
                    ud(n, e), n = n.sibling;
                  return Z(
                    Fe,
                    Fe.current & 1 | 2
                  ), Ee && _n(t, l.treeForkCount), t.child;
                }
                e = e.sibling;
              }
            l.tail !== null && xt() > Ci && (t.flags |= 128, i = !0, is(l, !1), t.lanes = 4194304);
          }
        else {
          if (!i)
            if (e = oi(c), e !== null) {
              if (t.flags |= 128, i = !0, e = e.updateQueue, t.updateQueue = e, Si(t, e), is(l, !0), l.tail === null && l.tailMode === "hidden" && !c.alternate && !Ee)
                return Ye(t), null;
            } else
              2 * xt() - l.renderingStartTime > Ci && n !== 536870912 && (t.flags |= 128, i = !0, is(l, !1), t.lanes = 4194304);
          l.isBackwards ? (c.sibling = t.child, t.child = c) : (e = l.last, e !== null ? e.sibling = c : t.child = c, l.last = c);
        }
        return l.tail !== null ? (e = l.tail, l.rendering = e, l.tail = e.sibling, l.renderingStartTime = xt(), e.sibling = null, n = Fe.current, Z(
          Fe,
          i ? n & 1 | 2 : n & 1
        ), Ee && _n(t, l.treeForkCount), e) : (Ye(t), null);
      case 22:
      case 23:
        return Ht(t), pr(), l = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== l && (t.flags |= 8192) : l && (t.flags |= 8192), l ? (n & 536870912) !== 0 && (t.flags & 128) === 0 && (Ye(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Ye(t), n = t.updateQueue, n !== null && Si(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), l = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), l !== n && (t.flags |= 2048), e !== null && L(wl), null;
      case 24:
        return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), Sn(Pe), Ye(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(u(156, t.tag));
  }
  function Fv(e, t) {
    switch (er(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Sn(Pe), Ae(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return Tt(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (Ht(t), t.alternate === null)
            throw Error(u(340));
          _l();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 13:
        if (Ht(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(u(340));
          _l();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return L(Fe), null;
      case 4:
        return Ae(), null;
      case 10:
        return Sn(t.type), null;
      case 22:
      case 23:
        return Ht(t), pr(), e !== null && L(wl), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return Sn(Pe), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Lf(e, t) {
    switch (er(t), t.tag) {
      case 3:
        Sn(Pe), Ae();
        break;
      case 26:
      case 27:
      case 5:
        Tt(t);
        break;
      case 4:
        Ae();
        break;
      case 31:
        t.memoizedState !== null && Ht(t);
        break;
      case 13:
        Ht(t);
        break;
      case 19:
        L(Fe);
        break;
      case 10:
        Sn(t.type);
        break;
      case 22:
      case 23:
        Ht(t), pr(), e !== null && L(wl);
        break;
      case 24:
        Sn(Pe);
    }
  }
  function cs(e, t) {
    try {
      var n = t.updateQueue, l = n !== null ? n.lastEffect : null;
      if (l !== null) {
        var i = l.next;
        n = i;
        do {
          if ((n.tag & e) === e) {
            l = void 0;
            var c = n.create, d = n.inst;
            l = c(), d.destroy = l;
          }
          n = n.next;
        } while (n !== i);
      }
    } catch (x) {
      ze(t, t.return, x);
    }
  }
  function Kn(e, t, n) {
    try {
      var l = t.updateQueue, i = l !== null ? l.lastEffect : null;
      if (i !== null) {
        var c = i.next;
        l = c;
        do {
          if ((l.tag & e) === e) {
            var d = l.inst, x = d.destroy;
            if (x !== void 0) {
              d.destroy = void 0, i = t;
              var S = n, O = x;
              try {
                O();
              } catch (U) {
                ze(
                  i,
                  S,
                  U
                );
              }
            }
          }
          l = l.next;
        } while (l !== c);
      }
    } catch (U) {
      ze(t, t.return, U);
    }
  }
  function Uf(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var n = e.stateNode;
      try {
        Md(t, n);
      } catch (l) {
        ze(e, e.return, l);
      }
    }
  }
  function Bf(e, t, n) {
    n.props = kl(
      e.type,
      e.memoizedProps
    ), n.state = e.memoizedState;
    try {
      n.componentWillUnmount();
    } catch (l) {
      ze(e, t, l);
    }
  }
  function rs(e, t) {
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
    } catch (i) {
      ze(e, t, i);
    }
  }
  function dn(e, t) {
    var n = e.ref, l = e.refCleanup;
    if (n !== null)
      if (typeof l == "function")
        try {
          l();
        } catch (i) {
          ze(e, t, i);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof n == "function")
        try {
          n(null);
        } catch (i) {
          ze(e, t, i);
        }
      else n.current = null;
  }
  function Gf(e) {
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
    } catch (i) {
      ze(e, e.return, i);
    }
  }
  function Zr(e, t, n) {
    try {
      var l = e.stateNode;
      gg(l, e.type, n, t), l[St] = t;
    } catch (i) {
      ze(e, e.return, i);
    }
  }
  function qf(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && tl(e.type) || e.tag === 4;
  }
  function Kr(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || qf(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && tl(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Fr(e, t, n) {
    var l = e.tag;
    if (l === 5 || l === 6)
      e = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(e, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(e), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = xn));
    else if (l !== 4 && (l === 27 && tl(e.type) && (n = e.stateNode, t = null), e = e.child, e !== null))
      for (Fr(e, t, n), e = e.sibling; e !== null; )
        Fr(e, t, n), e = e.sibling;
  }
  function wi(e, t, n) {
    var l = e.tag;
    if (l === 5 || l === 6)
      e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (l !== 4 && (l === 27 && tl(e.type) && (n = e.stateNode), e = e.child, e !== null))
      for (wi(e, t, n), e = e.sibling; e !== null; )
        wi(e, t, n), e = e.sibling;
  }
  function Yf(e) {
    var t = e.stateNode, n = e.memoizedProps;
    try {
      for (var l = e.type, i = t.attributes; i.length; )
        t.removeAttributeNode(i[0]);
      dt(t, l, n), t[ct] = e, t[St] = n;
    } catch (c) {
      ze(e, e.return, c);
    }
  }
  var Cn = !1, tt = !1, Jr = !1, $f = typeof WeakSet == "function" ? WeakSet : Set, it = null;
  function Jv(e, t) {
    if (e = e.containerInfo, gu = Qi, e = ed(e), $c(e)) {
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
            var i = l.anchorOffset, c = l.focusNode;
            l = l.focusOffset;
            try {
              n.nodeType, c.nodeType;
            } catch {
              n = null;
              break e;
            }
            var d = 0, x = -1, S = -1, O = 0, U = 0, $ = e, D = null;
            t: for (; ; ) {
              for (var H; $ !== n || i !== 0 && $.nodeType !== 3 || (x = d + i), $ !== c || l !== 0 && $.nodeType !== 3 || (S = d + l), $.nodeType === 3 && (d += $.nodeValue.length), (H = $.firstChild) !== null; )
                D = $, $ = H;
              for (; ; ) {
                if ($ === e) break t;
                if (D === n && ++O === i && (x = d), D === c && ++U === l && (S = d), (H = $.nextSibling) !== null) break;
                $ = D, D = $.parentNode;
              }
              $ = H;
            }
            n = x === -1 || S === -1 ? null : { start: x, end: S };
          } else n = null;
        }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (xu = { focusedElem: e, selectionRange: n }, Qi = !1, it = t; it !== null; )
      if (t = it, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null)
        e.return = t, it = e;
      else
        for (; it !== null; ) {
          switch (t = it, c = t.alternate, e = t.flags, t.tag) {
            case 0:
              if ((e & 4) !== 0 && (e = t.updateQueue, e = e !== null ? e.events : null, e !== null))
                for (n = 0; n < e.length; n++)
                  i = e[n], i.ref.impl = i.nextImpl;
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && c !== null) {
                e = void 0, n = t, i = c.memoizedProps, c = c.memoizedState, l = n.stateNode;
                try {
                  var te = kl(
                    n.type,
                    i
                  );
                  e = l.getSnapshotBeforeUpdate(
                    te,
                    c
                  ), l.__reactInternalSnapshotBeforeUpdate = e;
                } catch (oe) {
                  ze(
                    n,
                    n.return,
                    oe
                  );
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (e = t.stateNode.containerInfo, n = e.nodeType, n === 9)
                  _u(e);
                else if (n === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      _u(e);
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
  function Vf(e, t, n) {
    var l = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        Tn(e, n), l & 4 && cs(5, n);
        break;
      case 1:
        if (Tn(e, n), l & 4)
          if (e = n.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (d) {
              ze(n, n.return, d);
            }
          else {
            var i = kl(
              n.type,
              t.memoizedProps
            );
            t = t.memoizedState;
            try {
              e.componentDidUpdate(
                i,
                t,
                e.__reactInternalSnapshotBeforeUpdate
              );
            } catch (d) {
              ze(
                n,
                n.return,
                d
              );
            }
          }
        l & 64 && Uf(n), l & 512 && rs(n, n.return);
        break;
      case 3:
        if (Tn(e, n), l & 64 && (e = n.updateQueue, e !== null)) {
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
            Md(e, t);
          } catch (d) {
            ze(n, n.return, d);
          }
        }
        break;
      case 27:
        t === null && l & 4 && Yf(n);
      case 26:
      case 5:
        Tn(e, n), t === null && l & 4 && Gf(n), l & 512 && rs(n, n.return);
        break;
      case 12:
        Tn(e, n);
        break;
      case 31:
        Tn(e, n), l & 4 && Zf(e, n);
        break;
      case 13:
        Tn(e, n), l & 4 && Kf(e, n), l & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = sg.bind(
          null,
          n
        ), Ng(e, n))));
        break;
      case 22:
        if (l = n.memoizedState !== null || Cn, !l) {
          t = t !== null && t.memoizedState !== null || tt, i = Cn;
          var c = tt;
          Cn = l, (tt = t) && !c ? An(
            e,
            n,
            (n.subtreeFlags & 8772) !== 0
          ) : Tn(e, n), Cn = i, tt = c;
        }
        break;
      case 30:
        break;
      default:
        Tn(e, n);
    }
  }
  function Qf(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Qf(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && Ec(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var $e = null, Nt = !1;
  function kn(e, t, n) {
    for (n = n.child; n !== null; )
      Xf(e, t, n), n = n.sibling;
  }
  function Xf(e, t, n) {
    if (At && typeof At.onCommitFiberUnmount == "function")
      try {
        At.onCommitFiberUnmount(Ra, n);
      } catch {
      }
    switch (n.tag) {
      case 26:
        tt || dn(n, t), kn(
          e,
          t,
          n
        ), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (n = n.stateNode, n.parentNode.removeChild(n));
        break;
      case 27:
        tt || dn(n, t);
        var l = $e, i = Nt;
        tl(n.type) && ($e = n.stateNode, Nt = !1), kn(
          e,
          t,
          n
        ), gs(n.stateNode), $e = l, Nt = i;
        break;
      case 5:
        tt || dn(n, t);
      case 6:
        if (l = $e, i = Nt, $e = null, kn(
          e,
          t,
          n
        ), $e = l, Nt = i, $e !== null)
          if (Nt)
            try {
              ($e.nodeType === 9 ? $e.body : $e.nodeName === "HTML" ? $e.ownerDocument.body : $e).removeChild(n.stateNode);
            } catch (c) {
              ze(
                n,
                t,
                c
              );
            }
          else
            try {
              $e.removeChild(n.stateNode);
            } catch (c) {
              ze(
                n,
                t,
                c
              );
            }
        break;
      case 18:
        $e !== null && (Nt ? (e = $e, Uh(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          n.stateNode
        ), Sa(e)) : Uh($e, n.stateNode));
        break;
      case 4:
        l = $e, i = Nt, $e = n.stateNode.containerInfo, Nt = !0, kn(
          e,
          t,
          n
        ), $e = l, Nt = i;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Kn(2, n, t), tt || Kn(4, n, t), kn(
          e,
          t,
          n
        );
        break;
      case 1:
        tt || (dn(n, t), l = n.stateNode, typeof l.componentWillUnmount == "function" && Bf(
          n,
          t,
          l
        )), kn(
          e,
          t,
          n
        );
        break;
      case 21:
        kn(
          e,
          t,
          n
        );
        break;
      case 22:
        tt = (l = tt) || n.memoizedState !== null, kn(
          e,
          t,
          n
        ), tt = l;
        break;
      default:
        kn(
          e,
          t,
          n
        );
    }
  }
  function Zf(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
      e = e.dehydrated;
      try {
        Sa(e);
      } catch (n) {
        ze(t, t.return, n);
      }
    }
  }
  function Kf(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        Sa(e);
      } catch (n) {
        ze(t, t.return, n);
      }
  }
  function Wv(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new $f()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new $f()), t;
      default:
        throw Error(u(435, e.tag));
    }
  }
  function Ni(e, t) {
    var n = Wv(e);
    t.forEach(function(l) {
      if (!n.has(l)) {
        n.add(l);
        var i = ig.bind(null, e, l);
        l.then(i, i);
      }
    });
  }
  function Et(e, t) {
    var n = t.deletions;
    if (n !== null)
      for (var l = 0; l < n.length; l++) {
        var i = n[l], c = e, d = t, x = d;
        e: for (; x !== null; ) {
          switch (x.tag) {
            case 27:
              if (tl(x.type)) {
                $e = x.stateNode, Nt = !1;
                break e;
              }
              break;
            case 5:
              $e = x.stateNode, Nt = !1;
              break e;
            case 3:
            case 4:
              $e = x.stateNode.containerInfo, Nt = !0;
              break e;
          }
          x = x.return;
        }
        if ($e === null) throw Error(u(160));
        Xf(c, d, i), $e = null, Nt = !1, c = i.alternate, c !== null && (c.return = null), i.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        Ff(t, e), t = t.sibling;
  }
  var ln = null;
  function Ff(e, t) {
    var n = e.alternate, l = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        Et(t, e), Mt(e), l & 4 && (Kn(3, e, e.return), cs(3, e), Kn(5, e, e.return));
        break;
      case 1:
        Et(t, e), Mt(e), l & 512 && (tt || n === null || dn(n, n.return)), l & 64 && Cn && (e = e.updateQueue, e !== null && (l = e.callbacks, l !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? l : n.concat(l))));
        break;
      case 26:
        var i = ln;
        if (Et(t, e), Mt(e), l & 512 && (tt || n === null || dn(n, n.return)), l & 4) {
          var c = n !== null ? n.memoizedState : null;
          if (l = e.memoizedState, n === null)
            if (l === null)
              if (e.stateNode === null) {
                e: {
                  l = e.type, n = e.memoizedProps, i = i.ownerDocument || i;
                  t: switch (l) {
                    case "title":
                      c = i.getElementsByTagName("title")[0], (!c || c[Da] || c[ct] || c.namespaceURI === "http://www.w3.org/2000/svg" || c.hasAttribute("itemprop")) && (c = i.createElement(l), i.head.insertBefore(
                        c,
                        i.querySelector("head > title")
                      )), dt(c, l, n), c[ct] = e, st(c), l = c;
                      break e;
                    case "link":
                      var d = Fh(
                        "link",
                        "href",
                        i
                      ).get(l + (n.href || ""));
                      if (d) {
                        for (var x = 0; x < d.length; x++)
                          if (c = d[x], c.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && c.getAttribute("rel") === (n.rel == null ? null : n.rel) && c.getAttribute("title") === (n.title == null ? null : n.title) && c.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
                            d.splice(x, 1);
                            break t;
                          }
                      }
                      c = i.createElement(l), dt(c, l, n), i.head.appendChild(c);
                      break;
                    case "meta":
                      if (d = Fh(
                        "meta",
                        "content",
                        i
                      ).get(l + (n.content || ""))) {
                        for (x = 0; x < d.length; x++)
                          if (c = d[x], c.getAttribute("content") === (n.content == null ? null : "" + n.content) && c.getAttribute("name") === (n.name == null ? null : n.name) && c.getAttribute("property") === (n.property == null ? null : n.property) && c.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && c.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
                            d.splice(x, 1);
                            break t;
                          }
                      }
                      c = i.createElement(l), dt(c, l, n), i.head.appendChild(c);
                      break;
                    default:
                      throw Error(u(468, l));
                  }
                  c[ct] = e, st(c), l = c;
                }
                e.stateNode = l;
              } else
                Jh(
                  i,
                  e.type,
                  e.stateNode
                );
            else
              e.stateNode = Kh(
                i,
                l,
                e.memoizedProps
              );
          else
            c !== l ? (c === null ? n.stateNode !== null && (n = n.stateNode, n.parentNode.removeChild(n)) : c.count--, l === null ? Jh(
              i,
              e.type,
              e.stateNode
            ) : Kh(
              i,
              l,
              e.memoizedProps
            )) : l === null && e.stateNode !== null && Zr(
              e,
              e.memoizedProps,
              n.memoizedProps
            );
        }
        break;
      case 27:
        Et(t, e), Mt(e), l & 512 && (tt || n === null || dn(n, n.return)), n !== null && l & 4 && Zr(
          e,
          e.memoizedProps,
          n.memoizedProps
        );
        break;
      case 5:
        if (Et(t, e), Mt(e), l & 512 && (tt || n === null || dn(n, n.return)), e.flags & 32) {
          i = e.stateNode;
          try {
            Xl(i, "");
          } catch (te) {
            ze(e, e.return, te);
          }
        }
        l & 4 && e.stateNode != null && (i = e.memoizedProps, Zr(
          e,
          i,
          n !== null ? n.memoizedProps : i
        )), l & 1024 && (Jr = !0);
        break;
      case 6:
        if (Et(t, e), Mt(e), l & 4) {
          if (e.stateNode === null)
            throw Error(u(162));
          l = e.memoizedProps, n = e.stateNode;
          try {
            n.nodeValue = l;
          } catch (te) {
            ze(e, e.return, te);
          }
        }
        break;
      case 3:
        if (qi = null, i = ln, ln = Bi(t.containerInfo), Et(t, e), ln = i, Mt(e), l & 4 && n !== null && n.memoizedState.isDehydrated)
          try {
            Sa(t.containerInfo);
          } catch (te) {
            ze(e, e.return, te);
          }
        Jr && (Jr = !1, Jf(e));
        break;
      case 4:
        l = ln, ln = Bi(
          e.stateNode.containerInfo
        ), Et(t, e), Mt(e), ln = l;
        break;
      case 12:
        Et(t, e), Mt(e);
        break;
      case 31:
        Et(t, e), Mt(e), l & 4 && (l = e.updateQueue, l !== null && (e.updateQueue = null, Ni(e, l)));
        break;
      case 13:
        Et(t, e), Mt(e), e.child.flags & 8192 && e.memoizedState !== null != (n !== null && n.memoizedState !== null) && (Mi = xt()), l & 4 && (l = e.updateQueue, l !== null && (e.updateQueue = null, Ni(e, l)));
        break;
      case 22:
        i = e.memoizedState !== null;
        var S = n !== null && n.memoizedState !== null, O = Cn, U = tt;
        if (Cn = O || i, tt = U || S, Et(t, e), tt = U, Cn = O, Mt(e), l & 8192)
          e: for (t = e.stateNode, t._visibility = i ? t._visibility & -2 : t._visibility | 1, i && (n === null || S || Cn || tt || Tl(e)), n = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (n === null) {
                S = n = t;
                try {
                  if (c = S.stateNode, i)
                    d = c.style, typeof d.setProperty == "function" ? d.setProperty("display", "none", "important") : d.display = "none";
                  else {
                    x = S.stateNode;
                    var $ = S.memoizedProps.style, D = $ != null && $.hasOwnProperty("display") ? $.display : null;
                    x.style.display = D == null || typeof D == "boolean" ? "" : ("" + D).trim();
                  }
                } catch (te) {
                  ze(S, S.return, te);
                }
              }
            } else if (t.tag === 6) {
              if (n === null) {
                S = t;
                try {
                  S.stateNode.nodeValue = i ? "" : S.memoizedProps;
                } catch (te) {
                  ze(S, S.return, te);
                }
              }
            } else if (t.tag === 18) {
              if (n === null) {
                S = t;
                try {
                  var H = S.stateNode;
                  i ? Bh(H, !0) : Bh(S.stateNode, !1);
                } catch (te) {
                  ze(S, S.return, te);
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
        l & 4 && (l = e.updateQueue, l !== null && (n = l.retryQueue, n !== null && (l.retryQueue = null, Ni(e, n))));
        break;
      case 19:
        Et(t, e), Mt(e), l & 4 && (l = e.updateQueue, l !== null && (e.updateQueue = null, Ni(e, l)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        Et(t, e), Mt(e);
    }
  }
  function Mt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var n, l = e.return; l !== null; ) {
          if (qf(l)) {
            n = l;
            break;
          }
          l = l.return;
        }
        if (n == null) throw Error(u(160));
        switch (n.tag) {
          case 27:
            var i = n.stateNode, c = Kr(e);
            wi(e, c, i);
            break;
          case 5:
            var d = n.stateNode;
            n.flags & 32 && (Xl(d, ""), n.flags &= -33);
            var x = Kr(e);
            wi(e, x, d);
            break;
          case 3:
          case 4:
            var S = n.stateNode.containerInfo, O = Kr(e);
            Fr(
              e,
              O,
              S
            );
            break;
          default:
            throw Error(u(161));
        }
      } catch (U) {
        ze(e, e.return, U);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function Jf(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        Jf(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
  }
  function Tn(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        Vf(e, t.alternate, t), t = t.sibling;
  }
  function Tl(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Kn(4, t, t.return), Tl(t);
          break;
        case 1:
          dn(t, t.return);
          var n = t.stateNode;
          typeof n.componentWillUnmount == "function" && Bf(
            t,
            t.return,
            n
          ), Tl(t);
          break;
        case 27:
          gs(t.stateNode);
        case 26:
        case 5:
          dn(t, t.return), Tl(t);
          break;
        case 22:
          t.memoizedState === null && Tl(t);
          break;
        case 30:
          Tl(t);
          break;
        default:
          Tl(t);
      }
      e = e.sibling;
    }
  }
  function An(e, t, n) {
    for (n = n && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var l = t.alternate, i = e, c = t, d = c.flags;
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          An(
            i,
            c,
            n
          ), cs(4, c);
          break;
        case 1:
          if (An(
            i,
            c,
            n
          ), l = c, i = l.stateNode, typeof i.componentDidMount == "function")
            try {
              i.componentDidMount();
            } catch (O) {
              ze(l, l.return, O);
            }
          if (l = c, i = l.updateQueue, i !== null) {
            var x = l.stateNode;
            try {
              var S = i.shared.hiddenCallbacks;
              if (S !== null)
                for (i.shared.hiddenCallbacks = null, i = 0; i < S.length; i++)
                  Ed(S[i], x);
            } catch (O) {
              ze(l, l.return, O);
            }
          }
          n && d & 64 && Uf(c), rs(c, c.return);
          break;
        case 27:
          Yf(c);
        case 26:
        case 5:
          An(
            i,
            c,
            n
          ), n && l === null && d & 4 && Gf(c), rs(c, c.return);
          break;
        case 12:
          An(
            i,
            c,
            n
          );
          break;
        case 31:
          An(
            i,
            c,
            n
          ), n && d & 4 && Zf(i, c);
          break;
        case 13:
          An(
            i,
            c,
            n
          ), n && d & 4 && Kf(i, c);
          break;
        case 22:
          c.memoizedState === null && An(
            i,
            c,
            n
          ), rs(c, c.return);
          break;
        case 30:
          break;
        default:
          An(
            i,
            c,
            n
          );
      }
      t = t.sibling;
    }
  }
  function Wr(e, t) {
    var n = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && Ka(n));
  }
  function Pr(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Ka(e));
  }
  function an(e, t, n, l) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        Wf(
          e,
          t,
          n,
          l
        ), t = t.sibling;
  }
  function Wf(e, t, n, l) {
    var i = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        an(
          e,
          t,
          n,
          l
        ), i & 2048 && cs(9, t);
        break;
      case 1:
        an(
          e,
          t,
          n,
          l
        );
        break;
      case 3:
        an(
          e,
          t,
          n,
          l
        ), i & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Ka(e)));
        break;
      case 12:
        if (i & 2048) {
          an(
            e,
            t,
            n,
            l
          ), e = t.stateNode;
          try {
            var c = t.memoizedProps, d = c.id, x = c.onPostCommit;
            typeof x == "function" && x(
              d,
              t.alternate === null ? "mount" : "update",
              e.passiveEffectDuration,
              -0
            );
          } catch (S) {
            ze(t, t.return, S);
          }
        } else
          an(
            e,
            t,
            n,
            l
          );
        break;
      case 31:
        an(
          e,
          t,
          n,
          l
        );
        break;
      case 13:
        an(
          e,
          t,
          n,
          l
        );
        break;
      case 23:
        break;
      case 22:
        c = t.stateNode, d = t.alternate, t.memoizedState !== null ? c._visibility & 2 ? an(
          e,
          t,
          n,
          l
        ) : us(e, t) : c._visibility & 2 ? an(
          e,
          t,
          n,
          l
        ) : (c._visibility |= 2, fa(
          e,
          t,
          n,
          l,
          (t.subtreeFlags & 10256) !== 0 || !1
        )), i & 2048 && Wr(d, t);
        break;
      case 24:
        an(
          e,
          t,
          n,
          l
        ), i & 2048 && Pr(t.alternate, t);
        break;
      default:
        an(
          e,
          t,
          n,
          l
        );
    }
  }
  function fa(e, t, n, l, i) {
    for (i = i && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var c = e, d = t, x = n, S = l, O = d.flags;
      switch (d.tag) {
        case 0:
        case 11:
        case 15:
          fa(
            c,
            d,
            x,
            S,
            i
          ), cs(8, d);
          break;
        case 23:
          break;
        case 22:
          var U = d.stateNode;
          d.memoizedState !== null ? U._visibility & 2 ? fa(
            c,
            d,
            x,
            S,
            i
          ) : us(
            c,
            d
          ) : (U._visibility |= 2, fa(
            c,
            d,
            x,
            S,
            i
          )), i && O & 2048 && Wr(
            d.alternate,
            d
          );
          break;
        case 24:
          fa(
            c,
            d,
            x,
            S,
            i
          ), i && O & 2048 && Pr(d.alternate, d);
          break;
        default:
          fa(
            c,
            d,
            x,
            S,
            i
          );
      }
      t = t.sibling;
    }
  }
  function us(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var n = e, l = t, i = l.flags;
        switch (l.tag) {
          case 22:
            us(n, l), i & 2048 && Wr(
              l.alternate,
              l
            );
            break;
          case 24:
            us(n, l), i & 2048 && Pr(l.alternate, l);
            break;
          default:
            us(n, l);
        }
        t = t.sibling;
      }
  }
  var os = 8192;
  function ha(e, t, n) {
    if (e.subtreeFlags & os)
      for (e = e.child; e !== null; )
        Pf(
          e,
          t,
          n
        ), e = e.sibling;
  }
  function Pf(e, t, n) {
    switch (e.tag) {
      case 26:
        ha(
          e,
          t,
          n
        ), e.flags & os && e.memoizedState !== null && Lg(
          n,
          ln,
          e.memoizedState,
          e.memoizedProps
        );
        break;
      case 5:
        ha(
          e,
          t,
          n
        );
        break;
      case 3:
      case 4:
        var l = ln;
        ln = Bi(e.stateNode.containerInfo), ha(
          e,
          t,
          n
        ), ln = l;
        break;
      case 22:
        e.memoizedState === null && (l = e.alternate, l !== null && l.memoizedState !== null ? (l = os, os = 16777216, ha(
          e,
          t,
          n
        ), os = l) : ha(
          e,
          t,
          n
        ));
        break;
      default:
        ha(
          e,
          t,
          n
        );
    }
  }
  function If(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function ds(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var l = t[n];
          it = l, th(
            l,
            e
          );
        }
      If(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        eh(e), e = e.sibling;
  }
  function eh(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        ds(e), e.flags & 2048 && Kn(9, e, e.return);
        break;
      case 3:
        ds(e);
        break;
      case 12:
        ds(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Ei(e)) : ds(e);
        break;
      default:
        ds(e);
    }
  }
  function Ei(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var l = t[n];
          it = l, th(
            l,
            e
          );
        }
      If(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          Kn(8, t, t.return), Ei(t);
          break;
        case 22:
          n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, Ei(t));
          break;
        default:
          Ei(t);
      }
      e = e.sibling;
    }
  }
  function th(e, t) {
    for (; it !== null; ) {
      var n = it;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          Kn(8, n, t);
          break;
        case 23:
        case 22:
          if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
            var l = n.memoizedState.cachePool.pool;
            l != null && l.refCount++;
          }
          break;
        case 24:
          Ka(n.memoizedState.cache);
      }
      if (l = n.child, l !== null) l.return = n, it = l;
      else
        e: for (n = e; it !== null; ) {
          l = it;
          var i = l.sibling, c = l.return;
          if (Qf(l), l === n) {
            it = null;
            break e;
          }
          if (i !== null) {
            i.return = c, it = i;
            break e;
          }
          it = c;
        }
    }
  }
  var Pv = {
    getCacheForType: function(e) {
      var t = ut(Pe), n = t.data.get(e);
      return n === void 0 && (n = e(), t.data.set(e, n)), n;
    },
    cacheSignal: function() {
      return ut(Pe).controller.signal;
    }
  }, Iv = typeof WeakMap == "function" ? WeakMap : Map, ke = 0, Ue = null, je = null, we = 0, Re = 0, Lt = null, Fn = !1, ma = !1, Ir = !1, Rn = 0, Ze = 0, Jn = 0, Al = 0, eu = 0, Ut = 0, pa = 0, fs = null, Ct = null, tu = !1, Mi = 0, nh = 0, Ci = 1 / 0, ki = null, Wn = null, lt = 0, Pn = null, va = null, zn = 0, nu = 0, lu = null, lh = null, hs = 0, au = null;
  function Bt() {
    return (ke & 2) !== 0 && we !== 0 ? we & -we : C.T !== null ? ou() : xo();
  }
  function ah() {
    if (Ut === 0)
      if ((we & 536870912) === 0 || Ee) {
        var e = Ls;
        Ls <<= 1, (Ls & 3932160) === 0 && (Ls = 262144), Ut = e;
      } else Ut = 536870912;
    return e = Dt.current, e !== null && (e.flags |= 32), Ut;
  }
  function kt(e, t, n) {
    (e === Ue && (Re === 2 || Re === 9) || e.cancelPendingCommit !== null) && (ga(e, 0), In(
      e,
      we,
      Ut,
      !1
    )), Oa(e, n), ((ke & 2) === 0 || e !== Ue) && (e === Ue && ((ke & 2) === 0 && (Al |= n), Ze === 4 && In(
      e,
      we,
      Ut,
      !1
    )), fn(e));
  }
  function sh(e, t, n) {
    if ((ke & 6) !== 0) throw Error(u(327));
    var l = !n && (t & 127) === 0 && (t & e.expiredLanes) === 0 || za(e, t), i = l ? ng(e, t) : iu(e, t, !0), c = l;
    do {
      if (i === 0) {
        ma && !l && In(e, t, 0, !1);
        break;
      } else {
        if (n = e.current.alternate, c && !eg(n)) {
          i = iu(e, t, !1), c = !1;
          continue;
        }
        if (i === 2) {
          if (c = t, e.errorRecoveryDisabledLanes & c)
            var d = 0;
          else
            d = e.pendingLanes & -536870913, d = d !== 0 ? d : d & 536870912 ? 536870912 : 0;
          if (d !== 0) {
            t = d;
            e: {
              var x = e;
              i = fs;
              var S = x.current.memoizedState.isDehydrated;
              if (S && (ga(x, d).flags |= 256), d = iu(
                x,
                d,
                !1
              ), d !== 2) {
                if (Ir && !S) {
                  x.errorRecoveryDisabledLanes |= c, Al |= c, i = 4;
                  break e;
                }
                c = Ct, Ct = i, c !== null && (Ct === null ? Ct = c : Ct.push.apply(
                  Ct,
                  c
                ));
              }
              i = d;
            }
            if (c = !1, i !== 2) continue;
          }
        }
        if (i === 1) {
          ga(e, 0), In(e, t, 0, !0);
          break;
        }
        e: {
          switch (l = e, c = i, c) {
            case 0:
            case 1:
              throw Error(u(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              In(
                l,
                t,
                Ut,
                !Fn
              );
              break e;
            case 2:
              Ct = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(u(329));
          }
          if ((t & 62914560) === t && (i = Mi + 300 - xt(), 10 < i)) {
            if (In(
              l,
              t,
              Ut,
              !Fn
            ), Bs(l, 0, !0) !== 0) break e;
            zn = t, l.timeoutHandle = Hh(
              ih.bind(
                null,
                l,
                n,
                Ct,
                ki,
                tu,
                t,
                Ut,
                Al,
                pa,
                Fn,
                c,
                "Throttled",
                -0,
                0
              ),
              i
            );
            break e;
          }
          ih(
            l,
            n,
            Ct,
            ki,
            tu,
            t,
            Ut,
            Al,
            pa,
            Fn,
            c,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    fn(e);
  }
  function ih(e, t, n, l, i, c, d, x, S, O, U, $, D, H) {
    if (e.timeoutHandle = -1, $ = t.subtreeFlags, $ & 8192 || ($ & 16785408) === 16785408) {
      $ = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: xn
      }, Pf(
        t,
        c,
        $
      );
      var te = (c & 62914560) === c ? Mi - xt() : (c & 4194048) === c ? nh - xt() : 0;
      if (te = Ug(
        $,
        te
      ), te !== null) {
        zn = c, e.cancelPendingCommit = te(
          mh.bind(
            null,
            e,
            t,
            c,
            n,
            l,
            i,
            d,
            x,
            S,
            U,
            $,
            null,
            D,
            H
          )
        ), In(e, c, d, !O);
        return;
      }
    }
    mh(
      e,
      t,
      c,
      n,
      l,
      i,
      d,
      x,
      S
    );
  }
  function eg(e) {
    for (var t = e; ; ) {
      var n = t.tag;
      if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null)))
        for (var l = 0; l < n.length; l++) {
          var i = n[l], c = i.getSnapshot;
          i = i.value;
          try {
            if (!zt(c(), i)) return !1;
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
  function In(e, t, n, l) {
    t &= ~eu, t &= ~Al, e.suspendedLanes |= t, e.pingedLanes &= ~t, l && (e.warmLanes |= t), l = e.expirationTimes;
    for (var i = t; 0 < i; ) {
      var c = 31 - Rt(i), d = 1 << c;
      l[c] = -1, i &= ~d;
    }
    n !== 0 && po(e, n, t);
  }
  function Ti() {
    return (ke & 6) === 0 ? (ms(0), !1) : !0;
  }
  function su() {
    if (je !== null) {
      if (Re === 0)
        var e = je.return;
      else
        e = je, jn = jl = null, _r(e), ca = null, Ja = 0, e = je;
      for (; e !== null; )
        Lf(e.alternate, e), e = e.return;
      je = null;
    }
  }
  function ga(e, t) {
    var n = e.timeoutHandle;
    n !== -1 && (e.timeoutHandle = -1, yg(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), zn = 0, su(), Ue = e, je = n = yn(e.current, null), we = t, Re = 0, Lt = null, Fn = !1, ma = za(e, t), Ir = !1, pa = Ut = eu = Al = Jn = Ze = 0, Ct = fs = null, tu = !1, (t & 8) !== 0 && (t |= t & 32);
    var l = e.entangledLanes;
    if (l !== 0)
      for (e = e.entanglements, l &= t; 0 < l; ) {
        var i = 31 - Rt(l), c = 1 << i;
        t |= e[i], l &= ~c;
      }
    return Rn = t, Ws(), n;
  }
  function ch(e, t) {
    xe = null, C.H = as, t === ia || t === si ? (t = jd(), Re = 3) : t === ur ? (t = jd(), Re = 4) : Re = t === Lr ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, Lt = t, je === null && (Ze = 1, bi(
      e,
      Zt(t, e.current)
    ));
  }
  function rh() {
    var e = Dt.current;
    return e === null ? !0 : (we & 4194048) === we ? Wt === null : (we & 62914560) === we || (we & 536870912) !== 0 ? e === Wt : !1;
  }
  function uh() {
    var e = C.H;
    return C.H = as, e === null ? as : e;
  }
  function oh() {
    var e = C.A;
    return C.A = Pv, e;
  }
  function Ai() {
    Ze = 4, Fn || (we & 4194048) !== we && Dt.current !== null || (ma = !0), (Jn & 134217727) === 0 && (Al & 134217727) === 0 || Ue === null || In(
      Ue,
      we,
      Ut,
      !1
    );
  }
  function iu(e, t, n) {
    var l = ke;
    ke |= 2;
    var i = uh(), c = oh();
    (Ue !== e || we !== t) && (ki = null, ga(e, t)), t = !1;
    var d = Ze;
    e: do
      try {
        if (Re !== 0 && je !== null) {
          var x = je, S = Lt;
          switch (Re) {
            case 8:
              su(), d = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              Dt.current === null && (t = !0);
              var O = Re;
              if (Re = 0, Lt = null, xa(e, x, S, O), n && ma) {
                d = 0;
                break e;
              }
              break;
            default:
              O = Re, Re = 0, Lt = null, xa(e, x, S, O);
          }
        }
        tg(), d = Ze;
        break;
      } catch (U) {
        ch(e, U);
      }
    while (!0);
    return t && e.shellSuspendCounter++, jn = jl = null, ke = l, C.H = i, C.A = c, je === null && (Ue = null, we = 0, Ws()), d;
  }
  function tg() {
    for (; je !== null; ) dh(je);
  }
  function ng(e, t) {
    var n = ke;
    ke |= 2;
    var l = uh(), i = oh();
    Ue !== e || we !== t ? (ki = null, Ci = xt() + 500, ga(e, t)) : ma = za(
      e,
      t
    );
    e: do
      try {
        if (Re !== 0 && je !== null) {
          t = je;
          var c = Lt;
          t: switch (Re) {
            case 1:
              Re = 0, Lt = null, xa(e, t, c, 1);
              break;
            case 2:
            case 9:
              if (yd(c)) {
                Re = 0, Lt = null, fh(t);
                break;
              }
              t = function() {
                Re !== 2 && Re !== 9 || Ue !== e || (Re = 7), fn(e);
              }, c.then(t, t);
              break e;
            case 3:
              Re = 7;
              break e;
            case 4:
              Re = 5;
              break e;
            case 7:
              yd(c) ? (Re = 0, Lt = null, fh(t)) : (Re = 0, Lt = null, xa(e, t, c, 7));
              break;
            case 5:
              var d = null;
              switch (je.tag) {
                case 26:
                  d = je.memoizedState;
                case 5:
                case 27:
                  var x = je;
                  if (d ? Wh(d) : x.stateNode.complete) {
                    Re = 0, Lt = null;
                    var S = x.sibling;
                    if (S !== null) je = S;
                    else {
                      var O = x.return;
                      O !== null ? (je = O, Ri(O)) : je = null;
                    }
                    break t;
                  }
              }
              Re = 0, Lt = null, xa(e, t, c, 5);
              break;
            case 6:
              Re = 0, Lt = null, xa(e, t, c, 6);
              break;
            case 8:
              su(), Ze = 6;
              break e;
            default:
              throw Error(u(462));
          }
        }
        lg();
        break;
      } catch (U) {
        ch(e, U);
      }
    while (!0);
    return jn = jl = null, C.H = l, C.A = i, ke = n, je !== null ? 0 : (Ue = null, we = 0, Ws(), Ze);
  }
  function lg() {
    for (; je !== null && !Ul(); )
      dh(je);
  }
  function dh(e) {
    var t = Df(e.alternate, e, Rn);
    e.memoizedProps = e.pendingProps, t === null ? Ri(e) : je = t;
  }
  function fh(e) {
    var t = e, n = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = kf(
          n,
          t,
          t.pendingProps,
          t.type,
          void 0,
          we
        );
        break;
      case 11:
        t = kf(
          n,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          we
        );
        break;
      case 5:
        _r(t);
      default:
        Lf(n, t), t = je = ud(t, Rn), t = Df(n, t, Rn);
    }
    e.memoizedProps = e.pendingProps, t === null ? Ri(e) : je = t;
  }
  function xa(e, t, n, l) {
    jn = jl = null, _r(t), ca = null, Ja = 0;
    var i = t.return;
    try {
      if (Qv(
        e,
        i,
        t,
        n,
        we
      )) {
        Ze = 1, bi(
          e,
          Zt(n, e.current)
        ), je = null;
        return;
      }
    } catch (c) {
      if (i !== null) throw je = i, c;
      Ze = 1, bi(
        e,
        Zt(n, e.current)
      ), je = null;
      return;
    }
    t.flags & 32768 ? (Ee || l === 1 ? e = !0 : ma || (we & 536870912) !== 0 ? e = !1 : (Fn = e = !0, (l === 2 || l === 9 || l === 3 || l === 6) && (l = Dt.current, l !== null && l.tag === 13 && (l.flags |= 16384))), hh(t, e)) : Ri(t);
  }
  function Ri(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        hh(
          t,
          Fn
        );
        return;
      }
      e = t.return;
      var n = Kv(
        t.alternate,
        t,
        Rn
      );
      if (n !== null) {
        je = n;
        return;
      }
      if (t = t.sibling, t !== null) {
        je = t;
        return;
      }
      je = t = e;
    } while (t !== null);
    Ze === 0 && (Ze = 5);
  }
  function hh(e, t) {
    do {
      var n = Fv(e.alternate, e);
      if (n !== null) {
        n.flags &= 32767, je = n;
        return;
      }
      if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
        je = e;
        return;
      }
      je = e = n;
    } while (e !== null);
    Ze = 6, je = null;
  }
  function mh(e, t, n, l, i, c, d, x, S) {
    e.cancelPendingCommit = null;
    do
      zi();
    while (lt !== 0);
    if ((ke & 6) !== 0) throw Error(u(327));
    if (t !== null) {
      if (t === e.current) throw Error(u(177));
      if (c = t.lanes | t.childLanes, c |= Kc, Hp(
        e,
        n,
        c,
        d,
        x,
        S
      ), e === Ue && (je = Ue = null, we = 0), va = t, Pn = e, zn = n, nu = c, lu = i, lh = l, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, cg(jt, function() {
        return bh(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), l = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || l) {
        l = C.T, C.T = null, i = Y.p, Y.p = 2, d = ke, ke |= 4;
        try {
          Jv(e, t, n);
        } finally {
          ke = d, Y.p = i, C.T = l;
        }
      }
      lt = 1, ph(), vh(), gh();
    }
  }
  function ph() {
    if (lt === 1) {
      lt = 0;
      var e = Pn, t = va, n = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || n) {
        n = C.T, C.T = null;
        var l = Y.p;
        Y.p = 2;
        var i = ke;
        ke |= 4;
        try {
          Ff(t, e);
          var c = xu, d = ed(e.containerInfo), x = c.focusedElem, S = c.selectionRange;
          if (d !== x && x && x.ownerDocument && Io(
            x.ownerDocument.documentElement,
            x
          )) {
            if (S !== null && $c(x)) {
              var O = S.start, U = S.end;
              if (U === void 0 && (U = O), "selectionStart" in x)
                x.selectionStart = O, x.selectionEnd = Math.min(
                  U,
                  x.value.length
                );
              else {
                var $ = x.ownerDocument || document, D = $ && $.defaultView || window;
                if (D.getSelection) {
                  var H = D.getSelection(), te = x.textContent.length, oe = Math.min(S.start, te), Le = S.end === void 0 ? oe : Math.min(S.end, te);
                  !H.extend && oe > Le && (d = Le, Le = oe, oe = d);
                  var k = Po(
                    x,
                    oe
                  ), N = Po(
                    x,
                    Le
                  );
                  if (k && N && (H.rangeCount !== 1 || H.anchorNode !== k.node || H.anchorOffset !== k.offset || H.focusNode !== N.node || H.focusOffset !== N.offset)) {
                    var z = $.createRange();
                    z.setStart(k.node, k.offset), H.removeAllRanges(), oe > Le ? (H.addRange(z), H.extend(N.node, N.offset)) : (z.setEnd(N.node, N.offset), H.addRange(z));
                  }
                }
              }
            }
            for ($ = [], H = x; H = H.parentNode; )
              H.nodeType === 1 && $.push({
                element: H,
                left: H.scrollLeft,
                top: H.scrollTop
              });
            for (typeof x.focus == "function" && x.focus(), x = 0; x < $.length; x++) {
              var q = $[x];
              q.element.scrollLeft = q.left, q.element.scrollTop = q.top;
            }
          }
          Qi = !!gu, xu = gu = null;
        } finally {
          ke = i, Y.p = l, C.T = n;
        }
      }
      e.current = t, lt = 2;
    }
  }
  function vh() {
    if (lt === 2) {
      lt = 0;
      var e = Pn, t = va, n = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || n) {
        n = C.T, C.T = null;
        var l = Y.p;
        Y.p = 2;
        var i = ke;
        ke |= 4;
        try {
          Vf(e, t.alternate, t);
        } finally {
          ke = i, Y.p = l, C.T = n;
        }
      }
      lt = 3;
    }
  }
  function gh() {
    if (lt === 4 || lt === 3) {
      lt = 0, Aa();
      var e = Pn, t = va, n = zn, l = lh;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? lt = 5 : (lt = 0, va = Pn = null, xh(e, e.pendingLanes));
      var i = e.pendingLanes;
      if (i === 0 && (Wn = null), wc(n), t = t.stateNode, At && typeof At.onCommitFiberRoot == "function")
        try {
          At.onCommitFiberRoot(
            Ra,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (l !== null) {
        t = C.T, i = Y.p, Y.p = 2, C.T = null;
        try {
          for (var c = e.onRecoverableError, d = 0; d < l.length; d++) {
            var x = l[d];
            c(x.value, {
              componentStack: x.stack
            });
          }
        } finally {
          C.T = t, Y.p = i;
        }
      }
      (zn & 3) !== 0 && zi(), fn(e), i = e.pendingLanes, (n & 261930) !== 0 && (i & 42) !== 0 ? e === au ? hs++ : (hs = 0, au = e) : hs = 0, ms(0);
    }
  }
  function xh(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Ka(t)));
  }
  function zi() {
    return ph(), vh(), gh(), bh();
  }
  function bh() {
    if (lt !== 5) return !1;
    var e = Pn, t = nu;
    nu = 0;
    var n = wc(zn), l = C.T, i = Y.p;
    try {
      Y.p = 32 > n ? 32 : n, C.T = null, n = lu, lu = null;
      var c = Pn, d = zn;
      if (lt = 0, va = Pn = null, zn = 0, (ke & 6) !== 0) throw Error(u(331));
      var x = ke;
      if (ke |= 4, eh(c.current), Wf(
        c,
        c.current,
        d,
        n
      ), ke = x, ms(0, !1), At && typeof At.onPostCommitFiberRoot == "function")
        try {
          At.onPostCommitFiberRoot(Ra, c);
        } catch {
        }
      return !0;
    } finally {
      Y.p = i, C.T = l, xh(e, t);
    }
  }
  function yh(e, t, n) {
    t = Zt(n, t), t = Hr(e.stateNode, t, 2), e = Qn(e, t, 2), e !== null && (Oa(e, 2), fn(e));
  }
  function ze(e, t, n) {
    if (e.tag === 3)
      yh(e, e, n);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          yh(
            t,
            e,
            n
          );
          break;
        } else if (t.tag === 1) {
          var l = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof l.componentDidCatch == "function" && (Wn === null || !Wn.has(l))) {
            e = Zt(n, e), n = _f(2), l = Qn(t, n, 2), l !== null && (jf(
              n,
              l,
              t,
              e
            ), Oa(l, 2), fn(l));
            break;
          }
        }
        t = t.return;
      }
  }
  function cu(e, t, n) {
    var l = e.pingCache;
    if (l === null) {
      l = e.pingCache = new Iv();
      var i = /* @__PURE__ */ new Set();
      l.set(t, i);
    } else
      i = l.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), l.set(t, i));
    i.has(n) || (Ir = !0, i.add(n), e = ag.bind(null, e, t, n), t.then(e, e));
  }
  function ag(e, t, n) {
    var l = e.pingCache;
    l !== null && l.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, Ue === e && (we & n) === n && (Ze === 4 || Ze === 3 && (we & 62914560) === we && 300 > xt() - Mi ? (ke & 2) === 0 && ga(e, 0) : eu |= n, pa === we && (pa = 0)), fn(e);
  }
  function _h(e, t) {
    t === 0 && (t = mo()), e = bl(e, t), e !== null && (Oa(e, t), fn(e));
  }
  function sg(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), _h(e, n);
  }
  function ig(e, t) {
    var n = 0;
    switch (e.tag) {
      case 31:
      case 13:
        var l = e.stateNode, i = e.memoizedState;
        i !== null && (n = i.retryLane);
        break;
      case 19:
        l = e.stateNode;
        break;
      case 22:
        l = e.stateNode._retryCache;
        break;
      default:
        throw Error(u(314));
    }
    l !== null && l.delete(t), _h(e, n);
  }
  function cg(e, t) {
    return hl(e, t);
  }
  var Oi = null, ba = null, ru = !1, Di = !1, uu = !1, el = 0;
  function fn(e) {
    e !== ba && e.next === null && (ba === null ? Oi = ba = e : ba = ba.next = e), Di = !0, ru || (ru = !0, ug());
  }
  function ms(e, t) {
    if (!uu && Di) {
      uu = !0;
      do
        for (var n = !1, l = Oi; l !== null; ) {
          if (e !== 0) {
            var i = l.pendingLanes;
            if (i === 0) var c = 0;
            else {
              var d = l.suspendedLanes, x = l.pingedLanes;
              c = (1 << 31 - Rt(42 | e) + 1) - 1, c &= i & ~(d & ~x), c = c & 201326741 ? c & 201326741 | 1 : c ? c | 2 : 0;
            }
            c !== 0 && (n = !0, Nh(l, c));
          } else
            c = we, c = Bs(
              l,
              l === Ue ? c : 0,
              l.cancelPendingCommit !== null || l.timeoutHandle !== -1
            ), (c & 3) === 0 || za(l, c) || (n = !0, Nh(l, c));
          l = l.next;
        }
      while (n);
      uu = !1;
    }
  }
  function rg() {
    jh();
  }
  function jh() {
    Di = ru = !1;
    var e = 0;
    el !== 0 && bg() && (e = el);
    for (var t = xt(), n = null, l = Oi; l !== null; ) {
      var i = l.next, c = Sh(l, t);
      c === 0 ? (l.next = null, n === null ? Oi = i : n.next = i, i === null && (ba = n)) : (n = l, (e !== 0 || (c & 3) !== 0) && (Di = !0)), l = i;
    }
    lt !== 0 && lt !== 5 || ms(e), el !== 0 && (el = 0);
  }
  function Sh(e, t) {
    for (var n = e.suspendedLanes, l = e.pingedLanes, i = e.expirationTimes, c = e.pendingLanes & -62914561; 0 < c; ) {
      var d = 31 - Rt(c), x = 1 << d, S = i[d];
      S === -1 ? ((x & n) === 0 || (x & l) !== 0) && (i[d] = Dp(x, t)) : S <= t && (e.expiredLanes |= x), c &= ~x;
    }
    if (t = Ue, n = we, n = Bs(
      e,
      e === t ? n : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), l = e.callbackNode, n === 0 || e === t && (Re === 2 || Re === 9) || e.cancelPendingCommit !== null)
      return l !== null && l !== null && Ta(l), e.callbackNode = null, e.callbackPriority = 0;
    if ((n & 3) === 0 || za(e, n)) {
      if (t = n & -n, t === e.callbackPriority) return t;
      switch (l !== null && Ta(l), wc(n)) {
        case 2:
        case 8:
          n = _e;
          break;
        case 32:
          n = jt;
          break;
        case 268435456:
          n = Bl;
          break;
        default:
          n = jt;
      }
      return l = wh.bind(null, e), n = hl(n, l), e.callbackPriority = t, e.callbackNode = n, t;
    }
    return l !== null && l !== null && Ta(l), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function wh(e, t) {
    if (lt !== 0 && lt !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var n = e.callbackNode;
    if (zi() && e.callbackNode !== n)
      return null;
    var l = we;
    return l = Bs(
      e,
      e === Ue ? l : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), l === 0 ? null : (sh(e, l, t), Sh(e, xt()), e.callbackNode != null && e.callbackNode === n ? wh.bind(null, e) : null);
  }
  function Nh(e, t) {
    if (zi()) return null;
    sh(e, t, !0);
  }
  function ug() {
    _g(function() {
      (ke & 6) !== 0 ? hl(
        vn,
        rg
      ) : jh();
    });
  }
  function ou() {
    if (el === 0) {
      var e = aa;
      e === 0 && (e = Hs, Hs <<= 1, (Hs & 261888) === 0 && (Hs = 256)), el = e;
    }
    return el;
  }
  function Eh(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : $s("" + e);
  }
  function Mh(e, t) {
    var n = t.ownerDocument.createElement("input");
    return n.name = t.name, n.value = t.value, e.id && n.setAttribute("form", e.id), t.parentNode.insertBefore(n, t), e = new FormData(e), n.parentNode.removeChild(n), e;
  }
  function og(e, t, n, l, i) {
    if (t === "submit" && n && n.stateNode === i) {
      var c = Eh(
        (i[St] || null).action
      ), d = l.submitter;
      d && (t = (t = d[St] || null) ? Eh(t.formAction) : d.getAttribute("formAction"), t !== null && (c = t, d = null));
      var x = new Zs(
        "action",
        "action",
        null,
        l,
        i
      );
      e.push({
        event: x,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (l.defaultPrevented) {
                if (el !== 0) {
                  var S = d ? Mh(i, d) : new FormData(i);
                  Tr(
                    n,
                    {
                      pending: !0,
                      data: S,
                      method: i.method,
                      action: c
                    },
                    null,
                    S
                  );
                }
              } else
                typeof c == "function" && (x.preventDefault(), S = d ? Mh(i, d) : new FormData(i), Tr(
                  n,
                  {
                    pending: !0,
                    data: S,
                    method: i.method,
                    action: c
                  },
                  c,
                  S
                ));
            },
            currentTarget: i
          }
        ]
      });
    }
  }
  for (var du = 0; du < Zc.length; du++) {
    var fu = Zc[du], dg = fu.toLowerCase(), fg = fu[0].toUpperCase() + fu.slice(1);
    nn(
      dg,
      "on" + fg
    );
  }
  nn(ld, "onAnimationEnd"), nn(ad, "onAnimationIteration"), nn(sd, "onAnimationStart"), nn("dblclick", "onDoubleClick"), nn("focusin", "onFocus"), nn("focusout", "onBlur"), nn(Cv, "onTransitionRun"), nn(kv, "onTransitionStart"), nn(Tv, "onTransitionCancel"), nn(id, "onTransitionEnd"), Vl("onMouseEnter", ["mouseout", "mouseover"]), Vl("onMouseLeave", ["mouseout", "mouseover"]), Vl("onPointerEnter", ["pointerout", "pointerover"]), Vl("onPointerLeave", ["pointerout", "pointerover"]), pl(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), pl(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), pl("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), pl(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), pl(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), pl(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var ps = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), hg = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(ps)
  );
  function Ch(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var l = e[n], i = l.event;
      l = l.listeners;
      e: {
        var c = void 0;
        if (t)
          for (var d = l.length - 1; 0 <= d; d--) {
            var x = l[d], S = x.instance, O = x.currentTarget;
            if (x = x.listener, S !== c && i.isPropagationStopped())
              break e;
            c = x, i.currentTarget = O;
            try {
              c(i);
            } catch (U) {
              Js(U);
            }
            i.currentTarget = null, c = S;
          }
        else
          for (d = 0; d < l.length; d++) {
            if (x = l[d], S = x.instance, O = x.currentTarget, x = x.listener, S !== c && i.isPropagationStopped())
              break e;
            c = x, i.currentTarget = O;
            try {
              c(i);
            } catch (U) {
              Js(U);
            }
            i.currentTarget = null, c = S;
          }
      }
    }
  }
  function Se(e, t) {
    var n = t[Nc];
    n === void 0 && (n = t[Nc] = /* @__PURE__ */ new Set());
    var l = e + "__bubble";
    n.has(l) || (kh(t, e, 2, !1), n.add(l));
  }
  function hu(e, t, n) {
    var l = 0;
    t && (l |= 4), kh(
      n,
      e,
      l,
      t
    );
  }
  var Hi = "_reactListening" + Math.random().toString(36).slice(2);
  function mu(e) {
    if (!e[Hi]) {
      e[Hi] = !0, _o.forEach(function(n) {
        n !== "selectionchange" && (hg.has(n) || hu(n, !1, e), hu(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Hi] || (t[Hi] = !0, hu("selectionchange", !1, t));
    }
  }
  function kh(e, t, n, l) {
    switch (am(t)) {
      case 2:
        var i = qg;
        break;
      case 8:
        i = Yg;
        break;
      default:
        i = ku;
    }
    n = i.bind(
      null,
      t,
      n,
      e
    ), i = void 0, !Oc || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), l ? i !== void 0 ? e.addEventListener(t, n, {
      capture: !0,
      passive: i
    }) : e.addEventListener(t, n, !0) : i !== void 0 ? e.addEventListener(t, n, {
      passive: i
    }) : e.addEventListener(t, n, !1);
  }
  function pu(e, t, n, l, i) {
    var c = l;
    if ((t & 1) === 0 && (t & 2) === 0 && l !== null)
      e: for (; ; ) {
        if (l === null) return;
        var d = l.tag;
        if (d === 3 || d === 4) {
          var x = l.stateNode.containerInfo;
          if (x === i) break;
          if (d === 4)
            for (d = l.return; d !== null; ) {
              var S = d.tag;
              if ((S === 3 || S === 4) && d.stateNode.containerInfo === i)
                return;
              d = d.return;
            }
          for (; x !== null; ) {
            if (d = ql(x), d === null) return;
            if (S = d.tag, S === 5 || S === 6 || S === 26 || S === 27) {
              l = c = d;
              continue e;
            }
            x = x.parentNode;
          }
        }
        l = l.return;
      }
    zo(function() {
      var O = c, U = Rc(n), $ = [];
      e: {
        var D = cd.get(e);
        if (D !== void 0) {
          var H = Zs, te = e;
          switch (e) {
            case "keypress":
              if (Qs(n) === 0) break e;
            case "keydown":
            case "keyup":
              H = iv;
              break;
            case "focusin":
              te = "focus", H = Uc;
              break;
            case "focusout":
              te = "blur", H = Uc;
              break;
            case "beforeblur":
            case "afterblur":
              H = Uc;
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
              H = Ho;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              H = Kp;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              H = uv;
              break;
            case ld:
            case ad:
            case sd:
              H = Wp;
              break;
            case id:
              H = dv;
              break;
            case "scroll":
            case "scrollend":
              H = Xp;
              break;
            case "wheel":
              H = hv;
              break;
            case "copy":
            case "cut":
            case "paste":
              H = Ip;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              H = Uo;
              break;
            case "toggle":
            case "beforetoggle":
              H = pv;
          }
          var oe = (t & 4) !== 0, Le = !oe && (e === "scroll" || e === "scrollend"), k = oe ? D !== null ? D + "Capture" : null : D;
          oe = [];
          for (var N = O, z; N !== null; ) {
            var q = N;
            if (z = q.stateNode, q = q.tag, q !== 5 && q !== 26 && q !== 27 || z === null || k === null || (q = La(N, k), q != null && oe.push(
              vs(N, q, z)
            )), Le) break;
            N = N.return;
          }
          0 < oe.length && (D = new H(
            D,
            te,
            null,
            n,
            U
          ), $.push({ event: D, listeners: oe }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (D = e === "mouseover" || e === "pointerover", H = e === "mouseout" || e === "pointerout", D && n !== Ac && (te = n.relatedTarget || n.fromElement) && (ql(te) || te[Gl]))
            break e;
          if ((H || D) && (D = U.window === U ? U : (D = U.ownerDocument) ? D.defaultView || D.parentWindow : window, H ? (te = n.relatedTarget || n.toElement, H = O, te = te ? ql(te) : null, te !== null && (Le = h(te), oe = te.tag, te !== Le || oe !== 5 && oe !== 27 && oe !== 6) && (te = null)) : (H = null, te = O), H !== te)) {
            if (oe = Ho, q = "onMouseLeave", k = "onMouseEnter", N = "mouse", (e === "pointerout" || e === "pointerover") && (oe = Uo, q = "onPointerLeave", k = "onPointerEnter", N = "pointer"), Le = H == null ? D : Ha(H), z = te == null ? D : Ha(te), D = new oe(
              q,
              N + "leave",
              H,
              n,
              U
            ), D.target = Le, D.relatedTarget = z, q = null, ql(U) === O && (oe = new oe(
              k,
              N + "enter",
              te,
              n,
              U
            ), oe.target = z, oe.relatedTarget = Le, q = oe), Le = q, H && te)
              t: {
                for (oe = mg, k = H, N = te, z = 0, q = k; q; q = oe(q))
                  z++;
                q = 0;
                for (var ue = N; ue; ue = oe(ue))
                  q++;
                for (; 0 < z - q; )
                  k = oe(k), z--;
                for (; 0 < q - z; )
                  N = oe(N), q--;
                for (; z--; ) {
                  if (k === N || N !== null && k === N.alternate) {
                    oe = k;
                    break t;
                  }
                  k = oe(k), N = oe(N);
                }
                oe = null;
              }
            else oe = null;
            H !== null && Th(
              $,
              D,
              H,
              oe,
              !1
            ), te !== null && Le !== null && Th(
              $,
              Le,
              te,
              oe,
              !0
            );
          }
        }
        e: {
          if (D = O ? Ha(O) : window, H = D.nodeName && D.nodeName.toLowerCase(), H === "select" || H === "input" && D.type === "file")
            var Me = Xo;
          else if (Vo(D))
            if (Zo)
              Me = Nv;
            else {
              Me = Sv;
              var le = jv;
            }
          else
            H = D.nodeName, !H || H.toLowerCase() !== "input" || D.type !== "checkbox" && D.type !== "radio" ? O && Tc(O.elementType) && (Me = Xo) : Me = wv;
          if (Me && (Me = Me(e, O))) {
            Qo(
              $,
              Me,
              n,
              U
            );
            break e;
          }
          le && le(e, D, O), e === "focusout" && O && D.type === "number" && O.memoizedProps.value != null && kc(D, "number", D.value);
        }
        switch (le = O ? Ha(O) : window, e) {
          case "focusin":
            (Vo(le) || le.contentEditable === "true") && (Jl = le, Vc = O, Qa = null);
            break;
          case "focusout":
            Qa = Vc = Jl = null;
            break;
          case "mousedown":
            Qc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Qc = !1, td($, n, U);
            break;
          case "selectionchange":
            if (Mv) break;
          case "keydown":
          case "keyup":
            td($, n, U);
        }
        var be;
        if (Gc)
          e: {
            switch (e) {
              case "compositionstart":
                var Ne = "onCompositionStart";
                break e;
              case "compositionend":
                Ne = "onCompositionEnd";
                break e;
              case "compositionupdate":
                Ne = "onCompositionUpdate";
                break e;
            }
            Ne = void 0;
          }
        else
          Fl ? Yo(e, n) && (Ne = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (Ne = "onCompositionStart");
        Ne && (Bo && n.locale !== "ko" && (Fl || Ne !== "onCompositionStart" ? Ne === "onCompositionEnd" && Fl && (be = Oo()) : (Un = U, Dc = "value" in Un ? Un.value : Un.textContent, Fl = !0)), le = Li(O, Ne), 0 < le.length && (Ne = new Lo(
          Ne,
          e,
          null,
          n,
          U
        ), $.push({ event: Ne, listeners: le }), be ? Ne.data = be : (be = $o(n), be !== null && (Ne.data = be)))), (be = gv ? xv(e, n) : bv(e, n)) && (Ne = Li(O, "onBeforeInput"), 0 < Ne.length && (le = new Lo(
          "onBeforeInput",
          "beforeinput",
          null,
          n,
          U
        ), $.push({
          event: le,
          listeners: Ne
        }), le.data = be)), og(
          $,
          e,
          O,
          n,
          U
        );
      }
      Ch($, t);
    });
  }
  function vs(e, t, n) {
    return {
      instance: e,
      listener: t,
      currentTarget: n
    };
  }
  function Li(e, t) {
    for (var n = t + "Capture", l = []; e !== null; ) {
      var i = e, c = i.stateNode;
      if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || c === null || (i = La(e, n), i != null && l.unshift(
        vs(e, i, c)
      ), i = La(e, t), i != null && l.push(
        vs(e, i, c)
      )), e.tag === 3) return l;
      e = e.return;
    }
    return [];
  }
  function mg(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function Th(e, t, n, l, i) {
    for (var c = t._reactName, d = []; n !== null && n !== l; ) {
      var x = n, S = x.alternate, O = x.stateNode;
      if (x = x.tag, S !== null && S === l) break;
      x !== 5 && x !== 26 && x !== 27 || O === null || (S = O, i ? (O = La(n, c), O != null && d.unshift(
        vs(n, O, S)
      )) : i || (O = La(n, c), O != null && d.push(
        vs(n, O, S)
      ))), n = n.return;
    }
    d.length !== 0 && e.push({ event: t, listeners: d });
  }
  var pg = /\r\n?/g, vg = /\u0000|\uFFFD/g;
  function Ah(e) {
    return (typeof e == "string" ? e : "" + e).replace(pg, `
`).replace(vg, "");
  }
  function Rh(e, t) {
    return t = Ah(t), Ah(e) === t;
  }
  function He(e, t, n, l, i, c) {
    switch (n) {
      case "children":
        typeof l == "string" ? t === "body" || t === "textarea" && l === "" || Xl(e, l) : (typeof l == "number" || typeof l == "bigint") && t !== "body" && Xl(e, "" + l);
        break;
      case "className":
        qs(e, "class", l);
        break;
      case "tabIndex":
        qs(e, "tabindex", l);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        qs(e, n, l);
        break;
      case "style":
        Ao(e, l, c);
        break;
      case "data":
        if (t !== "object") {
          qs(e, "data", l);
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
        l = $s("" + l), e.setAttribute(n, l);
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
          typeof c == "function" && (n === "formAction" ? (t !== "input" && He(e, t, "name", i.name, i, null), He(
            e,
            t,
            "formEncType",
            i.formEncType,
            i,
            null
          ), He(
            e,
            t,
            "formMethod",
            i.formMethod,
            i,
            null
          ), He(
            e,
            t,
            "formTarget",
            i.formTarget,
            i,
            null
          )) : (He(e, t, "encType", i.encType, i, null), He(e, t, "method", i.method, i, null), He(e, t, "target", i.target, i, null)));
        if (l == null || typeof l == "symbol" || typeof l == "boolean") {
          e.removeAttribute(n);
          break;
        }
        l = $s("" + l), e.setAttribute(n, l);
        break;
      case "onClick":
        l != null && (e.onclick = xn);
        break;
      case "onScroll":
        l != null && Se("scroll", e);
        break;
      case "onScrollEnd":
        l != null && Se("scrollend", e);
        break;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l))
            throw Error(u(61));
          if (n = l.__html, n != null) {
            if (i.children != null) throw Error(u(60));
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
        n = $s("" + l), e.setAttributeNS(
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
        Se("beforetoggle", e), Se("toggle", e), Gs(e, "popover", l);
        break;
      case "xlinkActuate":
        gn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          l
        );
        break;
      case "xlinkArcrole":
        gn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          l
        );
        break;
      case "xlinkRole":
        gn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          l
        );
        break;
      case "xlinkShow":
        gn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          l
        );
        break;
      case "xlinkTitle":
        gn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          l
        );
        break;
      case "xlinkType":
        gn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          l
        );
        break;
      case "xmlBase":
        gn(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          l
        );
        break;
      case "xmlLang":
        gn(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          l
        );
        break;
      case "xmlSpace":
        gn(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          l
        );
        break;
      case "is":
        Gs(e, "is", l);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = Vp.get(n) || n, Gs(e, n, l));
    }
  }
  function vu(e, t, n, l, i, c) {
    switch (n) {
      case "style":
        Ao(e, l, c);
        break;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l))
            throw Error(u(61));
          if (n = l.__html, n != null) {
            if (i.children != null) throw Error(u(60));
            e.innerHTML = n;
          }
        }
        break;
      case "children":
        typeof l == "string" ? Xl(e, l) : (typeof l == "number" || typeof l == "bigint") && Xl(e, "" + l);
        break;
      case "onScroll":
        l != null && Se("scroll", e);
        break;
      case "onScrollEnd":
        l != null && Se("scrollend", e);
        break;
      case "onClick":
        l != null && (e.onclick = xn);
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
        if (!jo.hasOwnProperty(n))
          e: {
            if (n[0] === "o" && n[1] === "n" && (i = n.endsWith("Capture"), t = n.slice(2, i ? n.length - 7 : void 0), c = e[St] || null, c = c != null ? c[n] : null, typeof c == "function" && e.removeEventListener(t, c, i), typeof l == "function")) {
              typeof c != "function" && c !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(t, l, i);
              break e;
            }
            n in e ? e[n] = l : l === !0 ? e.setAttribute(n, "") : Gs(e, n, l);
          }
    }
  }
  function dt(e, t, n) {
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
        Se("error", e), Se("load", e);
        var l = !1, i = !1, c;
        for (c in n)
          if (n.hasOwnProperty(c)) {
            var d = n[c];
            if (d != null)
              switch (c) {
                case "src":
                  l = !0;
                  break;
                case "srcSet":
                  i = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(u(137, t));
                default:
                  He(e, t, c, d, n, null);
              }
          }
        i && He(e, t, "srcSet", n.srcSet, n, null), l && He(e, t, "src", n.src, n, null);
        return;
      case "input":
        Se("invalid", e);
        var x = c = d = i = null, S = null, O = null;
        for (l in n)
          if (n.hasOwnProperty(l)) {
            var U = n[l];
            if (U != null)
              switch (l) {
                case "name":
                  i = U;
                  break;
                case "type":
                  d = U;
                  break;
                case "checked":
                  S = U;
                  break;
                case "defaultChecked":
                  O = U;
                  break;
                case "value":
                  c = U;
                  break;
                case "defaultValue":
                  x = U;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (U != null)
                    throw Error(u(137, t));
                  break;
                default:
                  He(e, t, l, U, n, null);
              }
          }
        Mo(
          e,
          c,
          x,
          S,
          O,
          d,
          i,
          !1
        );
        return;
      case "select":
        Se("invalid", e), l = d = c = null;
        for (i in n)
          if (n.hasOwnProperty(i) && (x = n[i], x != null))
            switch (i) {
              case "value":
                c = x;
                break;
              case "defaultValue":
                d = x;
                break;
              case "multiple":
                l = x;
              default:
                He(e, t, i, x, n, null);
            }
        t = c, n = d, e.multiple = !!l, t != null ? Ql(e, !!l, t, !1) : n != null && Ql(e, !!l, n, !0);
        return;
      case "textarea":
        Se("invalid", e), c = i = l = null;
        for (d in n)
          if (n.hasOwnProperty(d) && (x = n[d], x != null))
            switch (d) {
              case "value":
                l = x;
                break;
              case "defaultValue":
                i = x;
                break;
              case "children":
                c = x;
                break;
              case "dangerouslySetInnerHTML":
                if (x != null) throw Error(u(91));
                break;
              default:
                He(e, t, d, x, n, null);
            }
        ko(e, l, i, c);
        return;
      case "option":
        for (S in n)
          if (n.hasOwnProperty(S) && (l = n[S], l != null))
            switch (S) {
              case "selected":
                e.selected = l && typeof l != "function" && typeof l != "symbol";
                break;
              default:
                He(e, t, S, l, n, null);
            }
        return;
      case "dialog":
        Se("beforetoggle", e), Se("toggle", e), Se("cancel", e), Se("close", e);
        break;
      case "iframe":
      case "object":
        Se("load", e);
        break;
      case "video":
      case "audio":
        for (l = 0; l < ps.length; l++)
          Se(ps[l], e);
        break;
      case "image":
        Se("error", e), Se("load", e);
        break;
      case "details":
        Se("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        Se("error", e), Se("load", e);
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
        for (O in n)
          if (n.hasOwnProperty(O) && (l = n[O], l != null))
            switch (O) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(u(137, t));
              default:
                He(e, t, O, l, n, null);
            }
        return;
      default:
        if (Tc(t)) {
          for (U in n)
            n.hasOwnProperty(U) && (l = n[U], l !== void 0 && vu(
              e,
              t,
              U,
              l,
              n,
              void 0
            ));
          return;
        }
    }
    for (x in n)
      n.hasOwnProperty(x) && (l = n[x], l != null && He(e, t, x, l, n, null));
  }
  function gg(e, t, n, l) {
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
        var i = null, c = null, d = null, x = null, S = null, O = null, U = null;
        for (H in n) {
          var $ = n[H];
          if (n.hasOwnProperty(H) && $ != null)
            switch (H) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                S = $;
              default:
                l.hasOwnProperty(H) || He(e, t, H, null, l, $);
            }
        }
        for (var D in l) {
          var H = l[D];
          if ($ = n[D], l.hasOwnProperty(D) && (H != null || $ != null))
            switch (D) {
              case "type":
                c = H;
                break;
              case "name":
                i = H;
                break;
              case "checked":
                O = H;
                break;
              case "defaultChecked":
                U = H;
                break;
              case "value":
                d = H;
                break;
              case "defaultValue":
                x = H;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (H != null)
                  throw Error(u(137, t));
                break;
              default:
                H !== $ && He(
                  e,
                  t,
                  D,
                  H,
                  l,
                  $
                );
            }
        }
        Cc(
          e,
          d,
          x,
          S,
          O,
          U,
          c,
          i
        );
        return;
      case "select":
        H = d = x = D = null;
        for (c in n)
          if (S = n[c], n.hasOwnProperty(c) && S != null)
            switch (c) {
              case "value":
                break;
              case "multiple":
                H = S;
              default:
                l.hasOwnProperty(c) || He(
                  e,
                  t,
                  c,
                  null,
                  l,
                  S
                );
            }
        for (i in l)
          if (c = l[i], S = n[i], l.hasOwnProperty(i) && (c != null || S != null))
            switch (i) {
              case "value":
                D = c;
                break;
              case "defaultValue":
                x = c;
                break;
              case "multiple":
                d = c;
              default:
                c !== S && He(
                  e,
                  t,
                  i,
                  c,
                  l,
                  S
                );
            }
        t = x, n = d, l = H, D != null ? Ql(e, !!n, D, !1) : !!l != !!n && (t != null ? Ql(e, !!n, t, !0) : Ql(e, !!n, n ? [] : "", !1));
        return;
      case "textarea":
        H = D = null;
        for (x in n)
          if (i = n[x], n.hasOwnProperty(x) && i != null && !l.hasOwnProperty(x))
            switch (x) {
              case "value":
                break;
              case "children":
                break;
              default:
                He(e, t, x, null, l, i);
            }
        for (d in l)
          if (i = l[d], c = n[d], l.hasOwnProperty(d) && (i != null || c != null))
            switch (d) {
              case "value":
                D = i;
                break;
              case "defaultValue":
                H = i;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (i != null) throw Error(u(91));
                break;
              default:
                i !== c && He(e, t, d, i, l, c);
            }
        Co(e, D, H);
        return;
      case "option":
        for (var te in n)
          if (D = n[te], n.hasOwnProperty(te) && D != null && !l.hasOwnProperty(te))
            switch (te) {
              case "selected":
                e.selected = !1;
                break;
              default:
                He(
                  e,
                  t,
                  te,
                  null,
                  l,
                  D
                );
            }
        for (S in l)
          if (D = l[S], H = n[S], l.hasOwnProperty(S) && D !== H && (D != null || H != null))
            switch (S) {
              case "selected":
                e.selected = D && typeof D != "function" && typeof D != "symbol";
                break;
              default:
                He(
                  e,
                  t,
                  S,
                  D,
                  l,
                  H
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
        for (var oe in n)
          D = n[oe], n.hasOwnProperty(oe) && D != null && !l.hasOwnProperty(oe) && He(e, t, oe, null, l, D);
        for (O in l)
          if (D = l[O], H = n[O], l.hasOwnProperty(O) && D !== H && (D != null || H != null))
            switch (O) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (D != null)
                  throw Error(u(137, t));
                break;
              default:
                He(
                  e,
                  t,
                  O,
                  D,
                  l,
                  H
                );
            }
        return;
      default:
        if (Tc(t)) {
          for (var Le in n)
            D = n[Le], n.hasOwnProperty(Le) && D !== void 0 && !l.hasOwnProperty(Le) && vu(
              e,
              t,
              Le,
              void 0,
              l,
              D
            );
          for (U in l)
            D = l[U], H = n[U], !l.hasOwnProperty(U) || D === H || D === void 0 && H === void 0 || vu(
              e,
              t,
              U,
              D,
              l,
              H
            );
          return;
        }
    }
    for (var k in n)
      D = n[k], n.hasOwnProperty(k) && D != null && !l.hasOwnProperty(k) && He(e, t, k, null, l, D);
    for ($ in l)
      D = l[$], H = n[$], !l.hasOwnProperty($) || D === H || D == null && H == null || He(e, t, $, D, l, H);
  }
  function zh(e) {
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
  function xg() {
    if (typeof performance.getEntriesByType == "function") {
      for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), l = 0; l < n.length; l++) {
        var i = n[l], c = i.transferSize, d = i.initiatorType, x = i.duration;
        if (c && x && zh(d)) {
          for (d = 0, x = i.responseEnd, l += 1; l < n.length; l++) {
            var S = n[l], O = S.startTime;
            if (O > x) break;
            var U = S.transferSize, $ = S.initiatorType;
            U && zh($) && (S = S.responseEnd, d += U * (S < x ? 1 : (x - O) / (S - O)));
          }
          if (--l, t += 8 * (c + d) / (i.duration / 1e3), e++, 10 < e) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
  }
  var gu = null, xu = null;
  function Ui(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function Oh(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Dh(e, t) {
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
  function bu(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var yu = null;
  function bg() {
    var e = window.event;
    return e && e.type === "popstate" ? e === yu ? !1 : (yu = e, !0) : (yu = null, !1);
  }
  var Hh = typeof setTimeout == "function" ? setTimeout : void 0, yg = typeof clearTimeout == "function" ? clearTimeout : void 0, Lh = typeof Promise == "function" ? Promise : void 0, _g = typeof queueMicrotask == "function" ? queueMicrotask : typeof Lh < "u" ? function(e) {
    return Lh.resolve(null).then(e).catch(jg);
  } : Hh;
  function jg(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function tl(e) {
    return e === "head";
  }
  function Uh(e, t) {
    var n = t, l = 0;
    do {
      var i = n.nextSibling;
      if (e.removeChild(n), i && i.nodeType === 8)
        if (n = i.data, n === "/$" || n === "/&") {
          if (l === 0) {
            e.removeChild(i), Sa(t);
            return;
          }
          l--;
        } else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&")
          l++;
        else if (n === "html")
          gs(e.ownerDocument.documentElement);
        else if (n === "head") {
          n = e.ownerDocument.head, gs(n);
          for (var c = n.firstChild; c; ) {
            var d = c.nextSibling, x = c.nodeName;
            c[Da] || x === "SCRIPT" || x === "STYLE" || x === "LINK" && c.rel.toLowerCase() === "stylesheet" || n.removeChild(c), c = d;
          }
        } else
          n === "body" && gs(e.ownerDocument.body);
      n = i;
    } while (n);
    Sa(t);
  }
  function Bh(e, t) {
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
  function _u(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var n = t;
      switch (t = t.nextSibling, n.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          _u(n), Ec(n);
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
  function Sg(e, t, n, l) {
    for (; e.nodeType === 1; ) {
      var i = n;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!l && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (l) {
        if (!e[Da])
          switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (c = e.getAttribute("rel"), c === "stylesheet" && e.hasAttribute("data-precedence"))
                break;
              if (c !== i.rel || e.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || e.getAttribute("title") !== (i.title == null ? null : i.title))
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (c = e.getAttribute("src"), (c !== (i.src == null ? null : i.src) || e.getAttribute("type") !== (i.type == null ? null : i.type) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && c && e.hasAttribute("async") && !e.hasAttribute("itemprop"))
                break;
              return e;
            default:
              return e;
          }
      } else if (t === "input" && e.type === "hidden") {
        var c = i.name == null ? null : "" + i.name;
        if (i.type === "hidden" && e.getAttribute("name") === c)
          return e;
      } else return e;
      if (e = Pt(e.nextSibling), e === null) break;
    }
    return null;
  }
  function wg(e, t, n) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = Pt(e.nextSibling), e === null)) return null;
    return e;
  }
  function Gh(e, t) {
    for (; e.nodeType !== 8; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = Pt(e.nextSibling), e === null)) return null;
    return e;
  }
  function ju(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function Su(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
  }
  function Ng(e, t) {
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
  function Pt(e) {
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
  var wu = null;
  function qh(e) {
    e = e.nextSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === "/$" || n === "/&") {
          if (t === 0)
            return Pt(e.nextSibling);
          t--;
        } else
          n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function Yh(e) {
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
  function $h(e, t, n) {
    switch (t = Ui(n), e) {
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
  function gs(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    Ec(e);
  }
  var It = /* @__PURE__ */ new Map(), Vh = /* @__PURE__ */ new Set();
  function Bi(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var On = Y.d;
  Y.d = {
    f: Eg,
    r: Mg,
    D: Cg,
    C: kg,
    L: Tg,
    m: Ag,
    X: zg,
    S: Rg,
    M: Og
  };
  function Eg() {
    var e = On.f(), t = Ti();
    return e || t;
  }
  function Mg(e) {
    var t = Yl(e);
    t !== null && t.tag === 5 && t.type === "form" ? cf(t) : On.r(e);
  }
  var ya = typeof document > "u" ? null : document;
  function Qh(e, t, n) {
    var l = ya;
    if (l && typeof t == "string" && t) {
      var i = Qt(t);
      i = 'link[rel="' + e + '"][href="' + i + '"]', typeof n == "string" && (i += '[crossorigin="' + n + '"]'), Vh.has(i) || (Vh.add(i), e = { rel: e, crossOrigin: n, href: t }, l.querySelector(i) === null && (t = l.createElement("link"), dt(t, "link", e), st(t), l.head.appendChild(t)));
    }
  }
  function Cg(e) {
    On.D(e), Qh("dns-prefetch", e, null);
  }
  function kg(e, t) {
    On.C(e, t), Qh("preconnect", e, t);
  }
  function Tg(e, t, n) {
    On.L(e, t, n);
    var l = ya;
    if (l && e && t) {
      var i = 'link[rel="preload"][as="' + Qt(t) + '"]';
      t === "image" && n && n.imageSrcSet ? (i += '[imagesrcset="' + Qt(
        n.imageSrcSet
      ) + '"]', typeof n.imageSizes == "string" && (i += '[imagesizes="' + Qt(
        n.imageSizes
      ) + '"]')) : i += '[href="' + Qt(e) + '"]';
      var c = i;
      switch (t) {
        case "style":
          c = _a(e);
          break;
        case "script":
          c = ja(e);
      }
      It.has(c) || (e = y(
        {
          rel: "preload",
          href: t === "image" && n && n.imageSrcSet ? void 0 : e,
          as: t
        },
        n
      ), It.set(c, e), l.querySelector(i) !== null || t === "style" && l.querySelector(xs(c)) || t === "script" && l.querySelector(bs(c)) || (t = l.createElement("link"), dt(t, "link", e), st(t), l.head.appendChild(t)));
    }
  }
  function Ag(e, t) {
    On.m(e, t);
    var n = ya;
    if (n && e) {
      var l = t && typeof t.as == "string" ? t.as : "script", i = 'link[rel="modulepreload"][as="' + Qt(l) + '"][href="' + Qt(e) + '"]', c = i;
      switch (l) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          c = ja(e);
      }
      if (!It.has(c) && (e = y({ rel: "modulepreload", href: e }, t), It.set(c, e), n.querySelector(i) === null)) {
        switch (l) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (n.querySelector(bs(c)))
              return;
        }
        l = n.createElement("link"), dt(l, "link", e), st(l), n.head.appendChild(l);
      }
    }
  }
  function Rg(e, t, n) {
    On.S(e, t, n);
    var l = ya;
    if (l && e) {
      var i = $l(l).hoistableStyles, c = _a(e);
      t = t || "default";
      var d = i.get(c);
      if (!d) {
        var x = { loading: 0, preload: null };
        if (d = l.querySelector(
          xs(c)
        ))
          x.loading = 5;
        else {
          e = y(
            { rel: "stylesheet", href: e, "data-precedence": t },
            n
          ), (n = It.get(c)) && Nu(e, n);
          var S = d = l.createElement("link");
          st(S), dt(S, "link", e), S._p = new Promise(function(O, U) {
            S.onload = O, S.onerror = U;
          }), S.addEventListener("load", function() {
            x.loading |= 1;
          }), S.addEventListener("error", function() {
            x.loading |= 2;
          }), x.loading |= 4, Gi(d, t, l);
        }
        d = {
          type: "stylesheet",
          instance: d,
          count: 1,
          state: x
        }, i.set(c, d);
      }
    }
  }
  function zg(e, t) {
    On.X(e, t);
    var n = ya;
    if (n && e) {
      var l = $l(n).hoistableScripts, i = ja(e), c = l.get(i);
      c || (c = n.querySelector(bs(i)), c || (e = y({ src: e, async: !0 }, t), (t = It.get(i)) && Eu(e, t), c = n.createElement("script"), st(c), dt(c, "link", e), n.head.appendChild(c)), c = {
        type: "script",
        instance: c,
        count: 1,
        state: null
      }, l.set(i, c));
    }
  }
  function Og(e, t) {
    On.M(e, t);
    var n = ya;
    if (n && e) {
      var l = $l(n).hoistableScripts, i = ja(e), c = l.get(i);
      c || (c = n.querySelector(bs(i)), c || (e = y({ src: e, async: !0, type: "module" }, t), (t = It.get(i)) && Eu(e, t), c = n.createElement("script"), st(c), dt(c, "link", e), n.head.appendChild(c)), c = {
        type: "script",
        instance: c,
        count: 1,
        state: null
      }, l.set(i, c));
    }
  }
  function Xh(e, t, n, l) {
    var i = (i = he.current) ? Bi(i) : null;
    if (!i) throw Error(u(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof n.precedence == "string" && typeof n.href == "string" ? (t = _a(n.href), n = $l(
          i
        ).hoistableStyles, l = n.get(t), l || (l = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, n.set(t, l)), l) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
          e = _a(n.href);
          var c = $l(
            i
          ).hoistableStyles, d = c.get(e);
          if (d || (i = i.ownerDocument || i, d = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, c.set(e, d), (c = i.querySelector(
            xs(e)
          )) && !c._p && (d.instance = c, d.state.loading = 5), It.has(e) || (n = {
            rel: "preload",
            as: "style",
            href: n.href,
            crossOrigin: n.crossOrigin,
            integrity: n.integrity,
            media: n.media,
            hrefLang: n.hrefLang,
            referrerPolicy: n.referrerPolicy
          }, It.set(e, n), c || Dg(
            i,
            e,
            n,
            d.state
          ))), t && l === null)
            throw Error(u(528, ""));
          return d;
        }
        if (t && l !== null)
          throw Error(u(529, ""));
        return null;
      case "script":
        return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = ja(n), n = $l(
          i
        ).hoistableScripts, l = n.get(t), l || (l = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, n.set(t, l)), l) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(u(444, e));
    }
  }
  function _a(e) {
    return 'href="' + Qt(e) + '"';
  }
  function xs(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function Zh(e) {
    return y({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function Dg(e, t, n, l) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? l.loading = 1 : (t = e.createElement("link"), l.preload = t, t.addEventListener("load", function() {
      return l.loading |= 1;
    }), t.addEventListener("error", function() {
      return l.loading |= 2;
    }), dt(t, "link", n), st(t), e.head.appendChild(t));
  }
  function ja(e) {
    return '[src="' + Qt(e) + '"]';
  }
  function bs(e) {
    return "script[async]" + e;
  }
  function Kh(e, t, n) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var l = e.querySelector(
            'style[data-href~="' + Qt(n.href) + '"]'
          );
          if (l)
            return t.instance = l, st(l), l;
          var i = y({}, n, {
            "data-href": n.href,
            "data-precedence": n.precedence,
            href: null,
            precedence: null
          });
          return l = (e.ownerDocument || e).createElement(
            "style"
          ), st(l), dt(l, "style", i), Gi(l, n.precedence, e), t.instance = l;
        case "stylesheet":
          i = _a(n.href);
          var c = e.querySelector(
            xs(i)
          );
          if (c)
            return t.state.loading |= 4, t.instance = c, st(c), c;
          l = Zh(n), (i = It.get(i)) && Nu(l, i), c = (e.ownerDocument || e).createElement("link"), st(c);
          var d = c;
          return d._p = new Promise(function(x, S) {
            d.onload = x, d.onerror = S;
          }), dt(c, "link", l), t.state.loading |= 4, Gi(c, n.precedence, e), t.instance = c;
        case "script":
          return c = ja(n.src), (i = e.querySelector(
            bs(c)
          )) ? (t.instance = i, st(i), i) : (l = n, (i = It.get(c)) && (l = y({}, n), Eu(l, i)), e = e.ownerDocument || e, i = e.createElement("script"), st(i), dt(i, "link", l), e.head.appendChild(i), t.instance = i);
        case "void":
          return null;
        default:
          throw Error(u(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (l = t.instance, t.state.loading |= 4, Gi(l, n.precedence, e));
    return t.instance;
  }
  function Gi(e, t, n) {
    for (var l = n.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), i = l.length ? l[l.length - 1] : null, c = i, d = 0; d < l.length; d++) {
      var x = l[d];
      if (x.dataset.precedence === t) c = x;
      else if (c !== i) break;
    }
    c ? c.parentNode.insertBefore(e, c.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
  }
  function Nu(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function Eu(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var qi = null;
  function Fh(e, t, n) {
    if (qi === null) {
      var l = /* @__PURE__ */ new Map(), i = qi = /* @__PURE__ */ new Map();
      i.set(n, l);
    } else
      i = qi, l = i.get(n), l || (l = /* @__PURE__ */ new Map(), i.set(n, l));
    if (l.has(e)) return l;
    for (l.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
      var c = n[i];
      if (!(c[Da] || c[ct] || e === "link" && c.getAttribute("rel") === "stylesheet") && c.namespaceURI !== "http://www.w3.org/2000/svg") {
        var d = c.getAttribute(t) || "";
        d = e + d;
        var x = l.get(d);
        x ? x.push(c) : l.set(d, [c]);
      }
    }
    return l;
  }
  function Jh(e, t, n) {
    e = e.ownerDocument || e, e.head.insertBefore(
      n,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function Hg(e, t, n) {
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
  function Wh(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function Lg(e, t, n, l) {
    if (n.type === "stylesheet" && (typeof l.media != "string" || matchMedia(l.media).matches !== !1) && (n.state.loading & 4) === 0) {
      if (n.instance === null) {
        var i = _a(l.href), c = t.querySelector(
          xs(i)
        );
        if (c) {
          t = c._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = Yi.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = c, st(c);
          return;
        }
        c = t.ownerDocument || t, l = Zh(l), (i = It.get(i)) && Nu(l, i), c = c.createElement("link"), st(c);
        var d = c;
        d._p = new Promise(function(x, S) {
          d.onload = x, d.onerror = S;
        }), dt(c, "link", l), n.instance = c;
      }
      e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && (n.state.loading & 3) === 0 && (e.count++, n = Yi.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
    }
  }
  var Mu = 0;
  function Ug(e, t) {
    return e.stylesheets && e.count === 0 && Vi(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
      var l = setTimeout(function() {
        if (e.stylesheets && Vi(e, e.stylesheets), e.unsuspend) {
          var c = e.unsuspend;
          e.unsuspend = null, c();
        }
      }, 6e4 + t);
      0 < e.imgBytes && Mu === 0 && (Mu = 62500 * xg());
      var i = setTimeout(
        function() {
          if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && Vi(e, e.stylesheets), e.unsuspend)) {
            var c = e.unsuspend;
            e.unsuspend = null, c();
          }
        },
        (e.imgBytes > Mu ? 50 : 800) + t
      );
      return e.unsuspend = n, function() {
        e.unsuspend = null, clearTimeout(l), clearTimeout(i);
      };
    } : null;
  }
  function Yi() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) Vi(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var $i = null;
  function Vi(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, $i = /* @__PURE__ */ new Map(), t.forEach(Bg, e), $i = null, Yi.call(e));
  }
  function Bg(e, t) {
    if (!(t.state.loading & 4)) {
      var n = $i.get(e);
      if (n) var l = n.get(null);
      else {
        n = /* @__PURE__ */ new Map(), $i.set(e, n);
        for (var i = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), c = 0; c < i.length; c++) {
          var d = i[c];
          (d.nodeName === "LINK" || d.getAttribute("media") !== "not all") && (n.set(d.dataset.precedence, d), l = d);
        }
        l && n.set(null, l);
      }
      i = t.instance, d = i.getAttribute("data-precedence"), c = n.get(d) || l, c === l && n.set(null, i), n.set(d, i), this.count++, l = Yi.bind(this), i.addEventListener("load", l), i.addEventListener("error", l), c ? c.parentNode.insertBefore(i, c.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
    }
  }
  var ys = {
    $$typeof: G,
    Provider: null,
    Consumer: null,
    _currentValue: K,
    _currentValue2: K,
    _threadCount: 0
  };
  function Gg(e, t, n, l, i, c, d, x, S) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = jc(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = jc(0), this.hiddenUpdates = jc(null), this.identifierPrefix = l, this.onUncaughtError = i, this.onCaughtError = c, this.onRecoverableError = d, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = S, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function Ph(e, t, n, l, i, c, d, x, S, O, U, $) {
    return e = new Gg(
      e,
      t,
      n,
      d,
      S,
      O,
      U,
      $,
      x
    ), t = 1, c === !0 && (t |= 24), c = Ot(3, null, null, t), e.current = c, c.stateNode = e, t = ir(), t.refCount++, e.pooledCache = t, t.refCount++, c.memoizedState = {
      element: l,
      isDehydrated: n,
      cache: t
    }, or(c), e;
  }
  function Ih(e) {
    return e ? (e = Il, e) : Il;
  }
  function em(e, t, n, l, i, c) {
    i = Ih(i), l.context === null ? l.context = i : l.pendingContext = i, l = Vn(t), l.payload = { element: n }, c = c === void 0 ? null : c, c !== null && (l.callback = c), n = Qn(e, l, t), n !== null && (kt(n, e, t), Pa(n, e, t));
  }
  function tm(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Cu(e, t) {
    tm(e, t), (e = e.alternate) && tm(e, t);
  }
  function nm(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = bl(e, 67108864);
      t !== null && kt(t, e, 67108864), Cu(e, 67108864);
    }
  }
  function lm(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Bt();
      t = Sc(t);
      var n = bl(e, t);
      n !== null && kt(n, e, t), Cu(e, t);
    }
  }
  var Qi = !0;
  function qg(e, t, n, l) {
    var i = C.T;
    C.T = null;
    var c = Y.p;
    try {
      Y.p = 2, ku(e, t, n, l);
    } finally {
      Y.p = c, C.T = i;
    }
  }
  function Yg(e, t, n, l) {
    var i = C.T;
    C.T = null;
    var c = Y.p;
    try {
      Y.p = 8, ku(e, t, n, l);
    } finally {
      Y.p = c, C.T = i;
    }
  }
  function ku(e, t, n, l) {
    if (Qi) {
      var i = Tu(l);
      if (i === null)
        pu(
          e,
          t,
          l,
          Xi,
          n
        ), sm(e, l);
      else if (Vg(
        i,
        e,
        t,
        n,
        l
      ))
        l.stopPropagation();
      else if (sm(e, l), t & 4 && -1 < $g.indexOf(e)) {
        for (; i !== null; ) {
          var c = Yl(i);
          if (c !== null)
            switch (c.tag) {
              case 3:
                if (c = c.stateNode, c.current.memoizedState.isDehydrated) {
                  var d = ml(c.pendingLanes);
                  if (d !== 0) {
                    var x = c;
                    for (x.pendingLanes |= 2, x.entangledLanes |= 2; d; ) {
                      var S = 1 << 31 - Rt(d);
                      x.entanglements[1] |= S, d &= ~S;
                    }
                    fn(c), (ke & 6) === 0 && (Ci = xt() + 500, ms(0));
                  }
                }
                break;
              case 31:
              case 13:
                x = bl(c, 2), x !== null && kt(x, c, 2), Ti(), Cu(c, 2);
            }
          if (c = Tu(l), c === null && pu(
            e,
            t,
            l,
            Xi,
            n
          ), c === i) break;
          i = c;
        }
        i !== null && l.stopPropagation();
      } else
        pu(
          e,
          t,
          l,
          null,
          n
        );
    }
  }
  function Tu(e) {
    return e = Rc(e), Au(e);
  }
  var Xi = null;
  function Au(e) {
    if (Xi = null, e = ql(e), e !== null) {
      var t = h(e);
      if (t === null) e = null;
      else {
        var n = t.tag;
        if (n === 13) {
          if (e = m(t), e !== null) return e;
          e = null;
        } else if (n === 31) {
          if (e = b(t), e !== null) return e;
          e = null;
        } else if (n === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return Xi = e, null;
  }
  function am(e) {
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
        switch (_c()) {
          case vn:
            return 2;
          case _e:
            return 8;
          case jt:
          case rn:
            return 32;
          case Bl:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Ru = !1, nl = null, ll = null, al = null, _s = /* @__PURE__ */ new Map(), js = /* @__PURE__ */ new Map(), sl = [], $g = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function sm(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        nl = null;
        break;
      case "dragenter":
      case "dragleave":
        ll = null;
        break;
      case "mouseover":
      case "mouseout":
        al = null;
        break;
      case "pointerover":
      case "pointerout":
        _s.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        js.delete(t.pointerId);
    }
  }
  function Ss(e, t, n, l, i, c) {
    return e === null || e.nativeEvent !== c ? (e = {
      blockedOn: t,
      domEventName: n,
      eventSystemFlags: l,
      nativeEvent: c,
      targetContainers: [i]
    }, t !== null && (t = Yl(t), t !== null && nm(t)), e) : (e.eventSystemFlags |= l, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
  }
  function Vg(e, t, n, l, i) {
    switch (t) {
      case "focusin":
        return nl = Ss(
          nl,
          e,
          t,
          n,
          l,
          i
        ), !0;
      case "dragenter":
        return ll = Ss(
          ll,
          e,
          t,
          n,
          l,
          i
        ), !0;
      case "mouseover":
        return al = Ss(
          al,
          e,
          t,
          n,
          l,
          i
        ), !0;
      case "pointerover":
        var c = i.pointerId;
        return _s.set(
          c,
          Ss(
            _s.get(c) || null,
            e,
            t,
            n,
            l,
            i
          )
        ), !0;
      case "gotpointercapture":
        return c = i.pointerId, js.set(
          c,
          Ss(
            js.get(c) || null,
            e,
            t,
            n,
            l,
            i
          )
        ), !0;
    }
    return !1;
  }
  function im(e) {
    var t = ql(e.target);
    if (t !== null) {
      var n = h(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = m(n), t !== null) {
            e.blockedOn = t, bo(e.priority, function() {
              lm(n);
            });
            return;
          }
        } else if (t === 31) {
          if (t = b(n), t !== null) {
            e.blockedOn = t, bo(e.priority, function() {
              lm(n);
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
  function Zi(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = Tu(e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var l = new n.constructor(
          n.type,
          n
        );
        Ac = l, n.target.dispatchEvent(l), Ac = null;
      } else
        return t = Yl(n), t !== null && nm(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function cm(e, t, n) {
    Zi(e) && n.delete(t);
  }
  function Qg() {
    Ru = !1, nl !== null && Zi(nl) && (nl = null), ll !== null && Zi(ll) && (ll = null), al !== null && Zi(al) && (al = null), _s.forEach(cm), js.forEach(cm);
  }
  function Ki(e, t) {
    e.blockedOn === t && (e.blockedOn = null, Ru || (Ru = !0, a.unstable_scheduleCallback(
      a.unstable_NormalPriority,
      Qg
    )));
  }
  var Fi = null;
  function rm(e) {
    Fi !== e && (Fi = e, a.unstable_scheduleCallback(
      a.unstable_NormalPriority,
      function() {
        Fi === e && (Fi = null);
        for (var t = 0; t < e.length; t += 3) {
          var n = e[t], l = e[t + 1], i = e[t + 2];
          if (typeof l != "function") {
            if (Au(l || n) === null)
              continue;
            break;
          }
          var c = Yl(n);
          c !== null && (e.splice(t, 3), t -= 3, Tr(
            c,
            {
              pending: !0,
              data: i,
              method: n.method,
              action: l
            },
            l,
            i
          ));
        }
      }
    ));
  }
  function Sa(e) {
    function t(S) {
      return Ki(S, e);
    }
    nl !== null && Ki(nl, e), ll !== null && Ki(ll, e), al !== null && Ki(al, e), _s.forEach(t), js.forEach(t);
    for (var n = 0; n < sl.length; n++) {
      var l = sl[n];
      l.blockedOn === e && (l.blockedOn = null);
    }
    for (; 0 < sl.length && (n = sl[0], n.blockedOn === null); )
      im(n), n.blockedOn === null && sl.shift();
    if (n = (e.ownerDocument || e).$$reactFormReplay, n != null)
      for (l = 0; l < n.length; l += 3) {
        var i = n[l], c = n[l + 1], d = i[St] || null;
        if (typeof c == "function")
          d || rm(n);
        else if (d) {
          var x = null;
          if (c && c.hasAttribute("formAction")) {
            if (i = c, d = c[St] || null)
              x = d.formAction;
            else if (Au(i) !== null) continue;
          } else x = d.action;
          typeof x == "function" ? n[l + 1] = x : (n.splice(l, 3), l -= 3), rm(n);
        }
      }
  }
  function um() {
    function e(c) {
      c.canIntercept && c.info === "react-transition" && c.intercept({
        handler: function() {
          return new Promise(function(d) {
            return i = d;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function t() {
      i !== null && (i(), i = null), l || setTimeout(n, 20);
    }
    function n() {
      if (!l && !navigation.transition) {
        var c = navigation.currentEntry;
        c && c.url != null && navigation.navigate(c.url, {
          state: c.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var l = !1, i = null;
      return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
        l = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), i !== null && (i(), i = null);
      };
    }
  }
  function zu(e) {
    this._internalRoot = e;
  }
  Ji.prototype.render = zu.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(u(409));
    var n = t.current, l = Bt();
    em(n, l, e, t, null, null);
  }, Ji.prototype.unmount = zu.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      em(e.current, 2, null, e, null, null), Ti(), t[Gl] = null;
    }
  };
  function Ji(e) {
    this._internalRoot = e;
  }
  Ji.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = xo();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < sl.length && t !== 0 && t < sl[n].priority; n++) ;
      sl.splice(n, 0, e), n === 0 && im(e);
    }
  };
  var om = r.version;
  if (om !== "19.2.8")
    throw Error(
      u(
        527,
        om,
        "19.2.8"
      )
    );
  Y.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(u(188)) : (e = Object.keys(e).join(","), Error(u(268, e)));
    return e = g(t), e = e !== null ? v(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var Xg = {
    bundleType: 0,
    version: "19.2.8",
    rendererPackageName: "react-dom",
    currentDispatcherRef: C,
    reconcilerVersion: "19.2.8"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Wi = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Wi.isDisabled && Wi.supportsFiber)
      try {
        Ra = Wi.inject(
          Xg
        ), At = Wi;
      } catch {
      }
  }
  return Ns.createRoot = function(e, t) {
    if (!f(e)) throw Error(u(299));
    var n = !1, l = "", i = gf, c = xf, d = bf;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (l = t.identifierPrefix), t.onUncaughtError !== void 0 && (i = t.onUncaughtError), t.onCaughtError !== void 0 && (c = t.onCaughtError), t.onRecoverableError !== void 0 && (d = t.onRecoverableError)), t = Ph(
      e,
      1,
      !1,
      null,
      null,
      n,
      l,
      null,
      i,
      c,
      d,
      um
    ), e[Gl] = t.current, mu(e), new zu(t);
  }, Ns.hydrateRoot = function(e, t, n) {
    if (!f(e)) throw Error(u(299));
    var l = !1, i = "", c = gf, d = xf, x = bf, S = null;
    return n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onUncaughtError !== void 0 && (c = n.onUncaughtError), n.onCaughtError !== void 0 && (d = n.onCaughtError), n.onRecoverableError !== void 0 && (x = n.onRecoverableError), n.formState !== void 0 && (S = n.formState)), t = Ph(
      e,
      1,
      !0,
      t,
      n ?? null,
      l,
      i,
      S,
      c,
      d,
      x,
      um
    ), t.context = Ih(null), n = t.current, l = Bt(), l = Sc(l), i = Vn(l), i.callback = null, Qn(n, i, l), n = l, t.current.lanes = n, Oa(t, n), fn(t), e[Gl] = t.current, mu(e), new Ji(t);
  }, Ns.version = "19.2.8", Ns;
}
var ym;
function a0() {
  if (ym) return Hu.exports;
  ym = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (r) {
        console.error(r);
      }
  }
  return a(), Hu.exports = l0(), Hu.exports;
}
var s0 = a0();
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
var Ju = /^(?:[a-z][a-z0-9+.-]*:|[\\/]{2})/i, Ym = /^[\\/]{2}/;
function i0(a, r) {
  return r + a.replace(/\\/g, "/");
}
var _m = "popstate";
function jm(a) {
  return typeof a == "object" && a != null && "pathname" in a && "search" in a && "hash" in a && "state" in a && "key" in a;
}
function c0(a = {}) {
  function r(f, h) {
    let {
      pathname: m = "/",
      search: b = "",
      hash: p = ""
    } = Hl(f.location.hash.substring(1));
    return !m.startsWith("/") && !m.startsWith(".") && (m = "/" + m), Vu(
      "",
      { pathname: m, search: b, hash: p },
      // state defaults to `null` because `window.history.state` does
      h.state && h.state.usr || null,
      h.state && h.state.key || "default"
    );
  }
  function o(f, h) {
    let m = f.document.querySelector("base"), b = "";
    if (m && m.getAttribute("href")) {
      let p = f.location.href, g = p.indexOf("#");
      b = g === -1 ? p : p.slice(0, g);
    }
    return b + "#" + (typeof h == "string" ? h : ks(h));
  }
  function u(f, h) {
    qt(
      f.pathname.charAt(0) === "/",
      `relative pathnames are not supported in hash history.push(${JSON.stringify(
        h
      )})`
    );
  }
  return u0(
    r,
    o,
    u,
    a
  );
}
function Qe(a, r) {
  if (a === !1 || a === null || typeof a > "u")
    throw new Error(r);
}
function qt(a, r) {
  if (!a) {
    typeof console < "u" && console.warn(r);
    try {
      throw new Error(r);
    } catch {
    }
  }
}
function r0() {
  return Math.random().toString(36).substring(2, 10);
}
function Sm(a, r) {
  return {
    usr: a.state,
    key: a.key,
    idx: r,
    masked: a.mask ? {
      pathname: a.pathname,
      search: a.search,
      hash: a.hash
    } : void 0
  };
}
function Vu(a, r, o = null, u, f) {
  return {
    pathname: typeof a == "string" ? a : a.pathname,
    search: "",
    hash: "",
    ...typeof r == "string" ? Hl(r) : r,
    state: o,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: r && r.key || u || r0(),
    mask: f
  };
}
function ks({
  pathname: a = "/",
  search: r = "",
  hash: o = ""
}) {
  return r && r !== "?" && (a += r.charAt(0) === "?" ? r : "?" + r), o && o !== "#" && (a += o.charAt(0) === "#" ? o : "#" + o), a;
}
function Hl(a) {
  let r = {};
  if (a) {
    let o = a.indexOf("#");
    o >= 0 && (r.hash = a.substring(o), a = a.substring(0, o));
    let u = a.indexOf("?");
    u >= 0 && (r.search = a.substring(u), a = a.substring(0, u)), a && (r.pathname = a);
  }
  return r;
}
function u0(a, r, o, u = {}) {
  let { window: f = document.defaultView, v5Compat: h = !1 } = u, m = f.history, b = "POP", p = null, g = v();
  g == null && (g = 0, m.replaceState({ ...m.state, idx: g }, ""));
  function v() {
    return (m.state || { idx: null }).idx;
  }
  function y() {
    b = "POP";
    let T = v(), B = T == null ? null : T - g;
    g = T, p && p({ action: b, location: M.location, delta: B });
  }
  function j(T, B) {
    b = "PUSH";
    let X = jm(T) ? T : Vu(M.location, T, B);
    o && o(X, T), g = v() + 1;
    let G = Sm(X, g), ne = M.createHref(X.mask || X);
    try {
      m.pushState(G, "", ne);
    } catch (V) {
      if (V instanceof DOMException && V.name === "DataCloneError")
        throw V;
      f.location.assign(ne);
    }
    h && p && p({ action: b, location: M.location, delta: 1 });
  }
  function E(T, B) {
    b = "REPLACE";
    let X = jm(T) ? T : Vu(M.location, T, B);
    o && o(X, T), g = v();
    let G = Sm(X, g), ne = M.createHref(X.mask || X);
    m.replaceState(G, "", ne), h && p && p({ action: b, location: M.location, delta: 0 });
  }
  function A(T) {
    return o0(f, T);
  }
  let M = {
    get action() {
      return b;
    },
    get location() {
      return a(f, m);
    },
    listen(T) {
      if (p)
        throw new Error("A history only accepts one active listener");
      return f.addEventListener(_m, y), p = T, () => {
        f.removeEventListener(_m, y), p = null;
      };
    },
    createHref(T) {
      return r(f, T);
    },
    createURL: A,
    encodeLocation(T) {
      let B = A(T);
      return {
        pathname: B.pathname,
        search: B.search,
        hash: B.hash
      };
    },
    push: j,
    replace: E,
    go(T) {
      return m.go(T);
    }
  };
  return M;
}
function o0(a, r, o = !1) {
  let u = "http://localhost";
  a && (u = a.location.origin !== "null" ? a.location.origin : a.location.href), Qe(u, "No window.location.(origin|href) available to create URL");
  let f = typeof r == "string" ? r : ks(r);
  return f = f.replace(/ $/, "%20"), !o && Ym.test(f) && (f = u + f), new URL(f, u);
}
function $m(a, r, o = "/") {
  return d0(a, r, o, !1);
}
function d0(a, r, o, u, f) {
  let h = typeof r == "string" ? Hl(r) : r, m = Dn(h.pathname || "/", o);
  if (m == null)
    return null;
  let b = f0(a), p = null, g = S0(m);
  for (let v = 0; p == null && v < b.length; ++v)
    p = j0(
      b[v],
      g,
      u
    );
  return p;
}
function f0(a) {
  let r = Vm(a);
  return h0(r), r;
}
function Vm(a, r = [], o = [], u = "", f = !1) {
  let h = (m, b, p = f, g) => {
    let v = {
      relativePath: g === void 0 ? m.path || "" : g,
      caseSensitive: m.caseSensitive === !0,
      childrenIndex: b,
      route: m
    };
    if (v.relativePath.startsWith("/")) {
      if (!v.relativePath.startsWith(u) && p)
        return;
      Qe(
        v.relativePath.startsWith(u),
        `Absolute route path "${v.relativePath}" nested under path "${u}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
      ), v.relativePath = v.relativePath.slice(u.length);
    }
    let y = sn([u, v.relativePath]), j = o.concat(v);
    m.children && m.children.length > 0 && (Qe(
      // Our types know better, but runtime JS may not!
      // @ts-expect-error
      m.index !== !0,
      `Index routes must not have child routes. Please remove all child routes from route path "${y}".`
    ), Vm(
      m.children,
      r,
      j,
      y,
      p
    )), !(m.path == null && !m.index) && r.push({
      path: y,
      score: y0(y, m.index),
      routesMeta: j.map((E, A) => {
        let [M, T] = Zm(
          E.relativePath,
          E.caseSensitive,
          A === j.length - 1
        );
        return {
          ...E,
          matcher: M,
          compiledParams: T
        };
      })
    });
  };
  return a.forEach((m, b) => {
    if (m.path === "" || !m.path?.includes("?"))
      h(m, b);
    else
      for (let p of Qm(m.path))
        h(m, b, !0, p);
  }), r;
}
function Qm(a) {
  let r = a.split("/");
  if (r.length === 0) return [];
  let [o, ...u] = r, f = o.endsWith("?"), h = o.replace(/\?$/, "");
  if (u.length === 0)
    return f ? [h, ""] : [h];
  let m = Qm(u.join("/")), b = [];
  return b.push(
    ...m.map(
      (p) => p === "" ? h : [h, p].join("/")
    )
  ), f && b.push(...m), b.map(
    (p) => a.startsWith("/") && p === "" ? "/" : p
  );
}
function h0(a) {
  a.sort(
    (r, o) => r.score !== o.score ? o.score - r.score : _0(
      r.routesMeta.map((u) => u.childrenIndex),
      o.routesMeta.map((u) => u.childrenIndex)
    )
  );
}
var m0 = /^:[\w-]+$/, p0 = 3, v0 = 2, g0 = 1, x0 = 10, b0 = -2, wm = (a) => a === "*";
function y0(a, r) {
  let o = a.split("/"), u = o.length;
  return o.some(wm) && (u += b0), r && (u += v0), o.filter((f) => !wm(f)).reduce(
    (f, h) => f + (m0.test(h) ? p0 : h === "" ? g0 : x0),
    u
  );
}
function _0(a, r) {
  return a.length === r.length && a.slice(0, -1).every((u, f) => u === r[f]) ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    a[a.length - 1] - r[r.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function j0(a, r, o = !1) {
  let { routesMeta: u } = a, f = {}, h = "/", m = [];
  for (let b = 0; b < u.length; ++b) {
    let p = u[b], g = b === u.length - 1, v = h === "/" ? r : r.slice(h.length) || "/", y = {
      path: p.relativePath,
      caseSensitive: p.caseSensitive,
      end: g
    }, j = (
      // Use precomputed matcher if it exists
      p.matcher && p.compiledParams ? Xm(
        y,
        v,
        p.matcher,
        p.compiledParams
      ) : uc(y, v)
    ), E = p.route;
    if (!j && g && o && !u[u.length - 1].route.index && (j = uc(
      {
        path: p.relativePath,
        caseSensitive: p.caseSensitive,
        end: !1
      },
      v
    )), !j)
      return null;
    Object.assign(f, j.params), m.push({
      // TODO: Can this as be avoided?
      params: f,
      pathname: sn([h, j.pathname]),
      pathnameBase: E0(
        sn([h, j.pathnameBase])
      ),
      route: E
    }), j.pathnameBase !== "/" && (h = sn([h, j.pathnameBase]));
  }
  return m;
}
function uc(a, r) {
  typeof a == "string" && (a = { path: a, caseSensitive: !1, end: !0 });
  let [o, u] = Zm(
    a.path,
    a.caseSensitive,
    a.end
  );
  return Xm(a, r, o, u);
}
function Xm(a, r, o, u) {
  let f = r.match(o);
  if (!f) return null;
  let h = f[0], m = h.replace(/(.)\/+$/, "$1"), b = f.slice(1);
  return {
    params: u.reduce(
      (g, { paramName: v, isOptional: y }, j) => {
        if (v === "*") {
          let A = b[j] || "";
          m = h.slice(0, h.length - A.length).replace(/(.)\/+$/, "$1");
        }
        const E = b[j];
        return y && !E ? g[v] = void 0 : g[v] = (E || "").replace(/%2F/g, "/"), g;
      },
      {}
    ),
    pathname: h,
    pathnameBase: m,
    pattern: a
  };
}
function Zm(a, r = !1, o = !0) {
  qt(
    a === "*" || !a.endsWith("*") || a.endsWith("/*"),
    `Route path "${a}" will be treated as if it were "${a.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${a.replace(/\*$/, "/*")}".`
  );
  let u = [], f = "^" + a.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(
    /\/:([\w-]+)(\?)?/g,
    (m, b, p, g, v) => {
      if (u.push({ paramName: b, isOptional: p != null }), p) {
        let y = v.charAt(g + m.length);
        return y && y !== "/" ? "/([^\\/]*)" : "(?:/([^\\/]*))?";
      }
      return "/([^\\/]+)";
    }
  ).replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
  return a.endsWith("*") ? (u.push({ paramName: "*" }), f += a === "*" || a === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$") : o ? f += "\\/*$" : a !== "" && a !== "/" && (f += "(?:(?=\\/|$))"), [new RegExp(f, r ? void 0 : "i"), u];
}
function S0(a) {
  try {
    return a.split("/").map((r) => decodeURIComponent(r).replace(/\//g, "%2F")).join("/");
  } catch (r) {
    return qt(
      !1,
      `The URL path "${a}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${r}).`
    ), a;
  }
}
function Dn(a, r) {
  if (r === "/") return a;
  if (!a.toLowerCase().startsWith(r.toLowerCase()))
    return null;
  let o = r.endsWith("/") ? r.length - 1 : r.length, u = a.charAt(o);
  return u && u !== "/" ? null : a.slice(o) || "/";
}
function w0(a, r = "/") {
  let {
    pathname: o,
    search: u = "",
    hash: f = ""
  } = typeof a == "string" ? Hl(a) : a, h;
  return o ? (o = Km(o), o.startsWith("/") ? h = Nm(o.substring(1), "/") : h = Nm(o, r)) : h = r, {
    pathname: h,
    search: M0(u),
    hash: C0(f)
  };
}
function Nm(a, r) {
  let o = oc(r).split("/");
  return a.split("/").forEach((f) => {
    f === ".." ? o.length > 1 && o.pop() : f !== "." && o.push(f);
  }), o.length > 1 ? o.join("/") : "/";
}
function Gu(a, r, o, u) {
  return `Cannot include a '${a}' character in a manually specified \`to.${r}\` field [${JSON.stringify(
    u
  )}].  Please separate it out to the \`to.${o}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function N0(a) {
  return a.filter(
    (r, o) => o === 0 || r.route.path && r.route.path.length > 0
  );
}
function Wu(a) {
  let r = N0(a);
  return r.map(
    (o, u) => u === r.length - 1 ? o.pathname : o.pathnameBase
  );
}
function fc(a, r, o, u = !1) {
  let f;
  typeof a == "string" ? f = Hl(a) : (f = { ...a }, Qe(
    !f.pathname || !f.pathname.includes("?"),
    Gu("?", "pathname", "search", f)
  ), Qe(
    !f.pathname || !f.pathname.includes("#"),
    Gu("#", "pathname", "hash", f)
  ), Qe(
    !f.search || !f.search.includes("#"),
    Gu("#", "search", "hash", f)
  ));
  let h = a === "" || f.pathname === "", m = h ? "/" : f.pathname, b;
  if (m == null)
    b = o;
  else {
    let y = r.length - 1;
    if (!u && m.startsWith("..")) {
      let j = m.split("/");
      for (; j[0] === ".."; )
        j.shift(), y -= 1;
      f.pathname = j.join("/");
    }
    b = y >= 0 ? r[y] : "/";
  }
  let p = w0(f, b), g = m && m !== "/" && m.endsWith("/"), v = (h || m === ".") && o.endsWith("/");
  return !p.pathname.endsWith("/") && (g || v) && (p.pathname += "/"), p;
}
var Km = (a) => a.replace(/[\\/]{2,}/g, "/"), sn = (a) => Km(a.join("/")), oc = (a) => a.replace(/\/+$/, ""), E0 = (a) => oc(a).replace(/^\/*/, "/"), M0 = (a) => !a || a === "?" ? "" : a.startsWith("?") ? a : "?" + a, C0 = (a) => !a || a === "#" ? "" : a.startsWith("#") ? a : "#" + a, k0 = class {
  constructor(a, r, o, u = !1) {
    this.status = a, this.statusText = r || "", this.internal = u, o instanceof Error ? (this.data = o.toString(), this.error = o) : this.data = o;
  }
};
function T0(a) {
  return a != null && typeof a.status == "number" && typeof a.statusText == "string" && typeof a.internal == "boolean" && "data" in a;
}
function A0(a) {
  let r = a.map((o) => o.route.path).filter(Boolean);
  return sn(r) || "/";
}
var Fm = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
function Jm(a, r) {
  let o = a;
  if (typeof o != "string" || !Ju.test(o))
    return {
      absoluteURL: void 0,
      isExternal: !1,
      to: o
    };
  let u = o, f = !1;
  if (Fm)
    try {
      let h = new URL(window.location.href), m = Ym.test(o) ? new URL(i0(o, h.protocol)) : new URL(o), b = Dn(m.pathname, r);
      m.origin === h.origin && b != null ? o = b + m.search + m.hash : f = !0;
    } catch {
      qt(
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
var Wm = [
  "POST",
  "PUT",
  "PATCH",
  "DELETE"
];
new Set(
  Wm
);
var R0 = [
  "GET",
  ...Wm
];
new Set(R0);
var z0 = [
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
function O0(a) {
  try {
    return z0.includes(new URL(a).protocol);
  } catch {
    return !1;
  }
}
var Ea = _.createContext(null);
Ea.displayName = "DataRouter";
var hc = _.createContext(null);
hc.displayName = "DataRouterState";
var Pm = _.createContext(!1);
function D0() {
  return _.useContext(Pm);
}
var Im = _.createContext({
  isTransitioning: !1
});
Im.displayName = "ViewTransition";
var H0 = _.createContext(
  /* @__PURE__ */ new Map()
);
H0.displayName = "Fetchers";
var L0 = _.createContext(null);
L0.displayName = "Await";
var Yt = _.createContext(
  null
);
Yt.displayName = "Navigation";
var As = _.createContext(
  null
);
As.displayName = "Location";
var pn = _.createContext({
  outlet: null,
  matches: [],
  isDataRoute: !1
});
pn.displayName = "Route";
var Pu = _.createContext(null);
Pu.displayName = "RouteError";
var ep = "REACT_ROUTER_ERROR", U0 = "REDIRECT", B0 = "ROUTE_ERROR_RESPONSE";
function G0(a) {
  if (a.startsWith(`${ep}:${U0}:{`))
    try {
      let r = JSON.parse(a.slice(28));
      if (typeof r == "object" && r && typeof r.status == "number" && typeof r.statusText == "string" && typeof r.location == "string" && typeof r.reloadDocument == "boolean" && typeof r.replace == "boolean")
        return r;
    } catch {
    }
}
function q0(a) {
  if (a.startsWith(
    `${ep}:${B0}:{`
  ))
    try {
      let r = JSON.parse(a.slice(40));
      if (typeof r == "object" && r && typeof r.status == "number" && typeof r.statusText == "string")
        return new k0(
          r.status,
          r.statusText,
          r.data
        );
    } catch {
    }
}
function Y0(a, { relative: r } = {}) {
  Qe(
    Ma(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useHref() may be used only in the context of a <Router> component."
  );
  let { basename: o, navigator: u } = _.useContext(Yt), { hash: f, pathname: h, search: m } = Rs(a, { relative: r }), b = h;
  return o !== "/" && (b = h === "/" ? o : sn([o, h])), u.createHref({ pathname: b, search: m, hash: f });
}
function Ma() {
  return _.useContext(As) != null;
}
function vt() {
  return Qe(
    Ma(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useLocation() may be used only in the context of a <Router> component."
  ), _.useContext(As).location;
}
var tp = "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function np(a) {
  _.useContext(Yt).static || _.useLayoutEffect(a);
}
function ft() {
  let { isDataRoute: a } = _.useContext(pn);
  return a ? tx() : $0();
}
function $0() {
  Qe(
    Ma(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useNavigate() may be used only in the context of a <Router> component."
  );
  let a = _.useContext(Ea), { basename: r, navigator: o } = _.useContext(Yt), { matches: u } = _.useContext(pn), { pathname: f } = vt(), h = JSON.stringify(Wu(u)), m = _.useRef(!1);
  return np(() => {
    m.current = !0;
  }), _.useCallback(
    (p, g = {}) => {
      if (qt(m.current, tp), !m.current) return;
      if (typeof p == "number") {
        o.go(p);
        return;
      }
      let v = fc(
        p,
        JSON.parse(h),
        f,
        g.relative === "path"
      );
      a == null && r !== "/" && (v.pathname = v.pathname === "/" ? r : sn([r, v.pathname])), (g.replace ? o.replace : o.push)(
        v,
        g.state,
        g
      );
    },
    [
      r,
      o,
      h,
      f,
      a
    ]
  );
}
_.createContext(null);
function Rs(a, { relative: r } = {}) {
  let { matches: o } = _.useContext(pn), { pathname: u } = vt(), f = JSON.stringify(Wu(o));
  return _.useMemo(
    () => fc(
      a,
      JSON.parse(f),
      u,
      r === "path"
    ),
    [a, f, u, r]
  );
}
function V0(a, r) {
  return lp(a, r);
}
function lp(a, r, o) {
  Qe(
    Ma(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useRoutes() may be used only in the context of a <Router> component."
  );
  let { navigator: u } = _.useContext(Yt), { matches: f } = _.useContext(pn), h = f[f.length - 1], m = h ? h.params : {}, b = h ? h.pathname : "/", p = h ? h.pathnameBase : "/", g = h && h.route;
  {
    let T = g && g.path || "";
    sp(
      b,
      !g || T.endsWith("*") || T.endsWith("*?"),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${b}" (under <Route path="${T}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${T}"> to <Route path="${T === "/" ? "*" : `${T}/*`}">.`
    );
  }
  let v = vt(), y;
  if (r) {
    let T = typeof r == "string" ? Hl(r) : r;
    Qe(
      p === "/" || T.pathname?.startsWith(p),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${p}" but pathname "${T.pathname}" was given in the \`location\` prop.`
    ), y = T;
  } else
    y = v;
  let j = y.pathname || "/", E = j;
  if (p !== "/") {
    let T = p.replace(/^\//, "").split("/");
    E = "/" + j.replace(/^\//, "").split("/").slice(T.length).join("/");
  }
  let A = o && o.state.matches.length ? (
    // If we're in a data router, use the matches we've already identified but ensure
    // we have the latest route instances from the manifest in case elements have changed
    o.state.matches.map(
      (T) => Object.assign(T, {
        route: o.manifest[T.route.id] || T.route
      })
    )
  ) : $m(a, { pathname: E });
  qt(
    g || A != null,
    `No routes matched location "${y.pathname}${y.search}${y.hash}" `
  ), qt(
    A == null || A[A.length - 1].route.element !== void 0 || A[A.length - 1].route.Component !== void 0 || A[A.length - 1].route.lazy !== void 0,
    `Matched leaf route at location "${y.pathname}${y.search}${y.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`
  );
  let M = F0(
    A && A.map(
      (T) => Object.assign({}, T, {
        params: Object.assign({}, m, T.params),
        pathname: sn([
          p,
          // Re-encode pathnames that were decoded inside matchRoutes.
          // Pre-encode `%`, `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          u.encodeLocation ? u.encodeLocation(
            T.pathname.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : T.pathname
        ]),
        pathnameBase: T.pathnameBase === "/" ? p : sn([
          p,
          // Re-encode pathnames that were decoded inside matchRoutes
          // Pre-encode `%`, `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          u.encodeLocation ? u.encodeLocation(
            T.pathnameBase.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : T.pathnameBase
        ])
      })
    ),
    f,
    o
  );
  return r && M ? /* @__PURE__ */ _.createElement(
    As.Provider,
    {
      value: {
        location: {
          pathname: "/",
          search: "",
          hash: "",
          state: null,
          key: "default",
          mask: void 0,
          ...y
        },
        navigationType: "POP"
        /* Pop */
      }
    },
    M
  ) : M;
}
function Q0() {
  let a = ex(), r = T0(a) ? `${a.status} ${a.statusText}` : a instanceof Error ? a.message : JSON.stringify(a), o = a instanceof Error ? a.stack : null, u = "rgba(200,200,200, 0.5)", f = { padding: "0.5rem", backgroundColor: u }, h = { padding: "2px 4px", backgroundColor: u }, m = null;
  return console.error(
    "Error handled by React Router default ErrorBoundary:",
    a
  ), m = /* @__PURE__ */ _.createElement(_.Fragment, null, /* @__PURE__ */ _.createElement("p", null, "💿 Hey developer 👋"), /* @__PURE__ */ _.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /* @__PURE__ */ _.createElement("code", { style: h }, "ErrorBoundary"), " or", " ", /* @__PURE__ */ _.createElement("code", { style: h }, "errorElement"), " prop on your route.")), /* @__PURE__ */ _.createElement(_.Fragment, null, /* @__PURE__ */ _.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ _.createElement("h3", { style: { fontStyle: "italic" } }, r), o ? /* @__PURE__ */ _.createElement("pre", { style: f }, o) : null, m);
}
var X0 = /* @__PURE__ */ _.createElement(Q0, null), ap = class extends _.Component {
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
  static getDerivedStateFromProps(a, r) {
    return r.location !== a.location || r.revalidation !== "idle" && a.revalidation === "idle" ? {
      error: a.error,
      location: a.location,
      revalidation: a.revalidation
    } : {
      error: a.error !== void 0 ? a.error : r.error,
      location: r.location,
      revalidation: a.revalidation || r.revalidation
    };
  }
  componentDidCatch(a, r) {
    this.props.onError ? this.props.onError(a, r) : console.error(
      "React Router caught the following error during render",
      a
    );
  }
  render() {
    let a = this.state.error;
    if (this.context && typeof a == "object" && a && "digest" in a && typeof a.digest == "string") {
      const o = q0(a.digest);
      o && (a = o);
    }
    let r = a !== void 0 ? /* @__PURE__ */ _.createElement(pn.Provider, { value: this.props.routeContext }, /* @__PURE__ */ _.createElement(
      Pu.Provider,
      {
        value: a,
        children: this.props.component
      }
    )) : this.props.children;
    return this.context ? /* @__PURE__ */ _.createElement(Z0, { error: a }, r) : r;
  }
};
ap.contextType = Pm;
var qu = /* @__PURE__ */ new WeakMap();
function Z0({
  children: a,
  error: r
}) {
  let { basename: o } = _.useContext(Yt);
  if (typeof r == "object" && r && "digest" in r && typeof r.digest == "string") {
    let u = G0(r.digest);
    if (u) {
      let f = qu.get(r);
      if (f) throw f;
      let h = Jm(u.location, o), m = h.absoluteURL || h.to;
      if (O0(m))
        throw new Error("Invalid redirect location");
      if (Fm && !qu.get(r))
        if (h.isExternal || u.reloadDocument)
          window.location.href = m;
        else {
          const b = Promise.resolve().then(
            () => window.__reactRouterDataRouter.navigate(h.to, {
              replace: u.replace
            })
          );
          throw qu.set(r, b), b;
        }
      return /* @__PURE__ */ _.createElement("meta", { httpEquiv: "refresh", content: `0;url=${m}` });
    }
  }
  return a;
}
function K0({ routeContext: a, match: r, children: o }) {
  let u = _.useContext(Ea);
  return u && u.static && u.staticContext && (r.route.errorElement || r.route.ErrorBoundary) && (u.staticContext._deepestRenderedBoundaryId = r.route.id), /* @__PURE__ */ _.createElement(pn.Provider, { value: a }, o);
}
function F0(a, r = [], o) {
  let u = o?.state;
  if (a == null) {
    if (!u)
      return null;
    if (u.errors)
      a = u.matches;
    else if (r.length === 0 && !u.initialized && u.matches.length > 0)
      a = u.matches;
    else
      return null;
  }
  let f = a, h = u?.errors;
  if (h != null) {
    let v = f.findIndex(
      (y) => y.route.id && h?.[y.route.id] !== void 0
    );
    Qe(
      v >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(
        h
      ).join(",")}`
    ), f = f.slice(
      0,
      Math.min(f.length, v + 1)
    );
  }
  let m = !1, b = -1;
  if (o && u) {
    m = u.renderFallback;
    for (let v = 0; v < f.length; v++) {
      let y = f[v];
      if ((y.route.HydrateFallback || y.route.hydrateFallbackElement) && (b = v), y.route.id) {
        let { loaderData: j, errors: E } = u, A = y.route.loader && !j.hasOwnProperty(y.route.id) && (!E || E[y.route.id] === void 0);
        if (y.route.lazy || A) {
          o.isStatic && (m = !0), b >= 0 ? f = f.slice(0, b + 1) : f = [f[0]];
          break;
        }
      }
    }
  }
  let p = o?.onError, g = u && p ? (v, y) => {
    p(v, {
      location: u.location,
      params: u.matches?.[0]?.params ?? {},
      pattern: A0(u.matches),
      errorInfo: y
    });
  } : void 0;
  return f.reduceRight(
    (v, y, j) => {
      let E, A = !1, M = null, T = null;
      u && (E = h && y.route.id ? h[y.route.id] : void 0, M = y.route.errorElement || X0, m && (b < 0 && j === 0 ? (sp(
        "route-fallback",
        !1,
        "No `HydrateFallback` element provided to render during initial hydration"
      ), A = !0, T = null) : b === j && (A = !0, T = y.route.hydrateFallbackElement || null)));
      let B = r.concat(f.slice(0, j + 1)), X = () => {
        let G;
        return E ? G = M : A ? G = T : y.route.Component ? G = /* @__PURE__ */ _.createElement(y.route.Component, null) : y.route.element ? G = y.route.element : G = v, /* @__PURE__ */ _.createElement(
          K0,
          {
            match: y,
            routeContext: {
              outlet: v,
              matches: B,
              isDataRoute: u != null
            },
            children: G
          }
        );
      };
      return u && (y.route.ErrorBoundary || y.route.errorElement || j === 0) ? /* @__PURE__ */ _.createElement(
        ap,
        {
          location: u.location,
          revalidation: u.revalidation,
          component: M,
          error: E,
          children: X(),
          routeContext: { outlet: null, matches: B, isDataRoute: !0 },
          onError: g
        }
      ) : X();
    },
    null
  );
}
function Iu(a) {
  return `${a} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function J0(a) {
  let r = _.useContext(Ea);
  return Qe(r, Iu(a)), r;
}
function W0(a) {
  let r = _.useContext(hc);
  return Qe(r, Iu(a)), r;
}
function P0(a) {
  let r = _.useContext(pn);
  return Qe(r, Iu(a)), r;
}
function eo(a) {
  let r = P0(a), o = r.matches[r.matches.length - 1];
  return Qe(
    o.route.id,
    `${a} can only be used on routes that contain a unique "id"`
  ), o.route.id;
}
function I0() {
  return eo(
    "useRouteId"
    /* UseRouteId */
  );
}
function ex() {
  let a = _.useContext(Pu), r = W0(
    "useRouteError"
    /* UseRouteError */
  ), o = eo(
    "useRouteError"
    /* UseRouteError */
  );
  return a !== void 0 ? a : r.errors?.[o];
}
function tx() {
  let { router: a } = J0(
    "useNavigate"
    /* UseNavigateStable */
  ), r = eo(
    "useNavigate"
    /* UseNavigateStable */
  ), o = _.useRef(!1);
  return np(() => {
    o.current = !0;
  }), _.useCallback(
    async (f, h = {}) => {
      qt(o.current, tp), o.current && (typeof f == "number" ? await a.navigate(f) : await a.navigate(f, { fromRouteId: r, ...h }));
    },
    [a, r]
  );
}
var Em = {};
function sp(a, r, o) {
  !r && !Em[a] && (Em[a] = !0, qt(!1, o));
}
_.memo(nx);
function nx({
  routes: a,
  manifest: r,
  future: o,
  state: u,
  isStatic: f,
  onError: h
}) {
  return lp(a, void 0, {
    manifest: r,
    state: u,
    isStatic: f,
    onError: h
  });
}
function Cs({
  to: a,
  replace: r,
  state: o,
  relative: u
}) {
  Qe(
    Ma(),
    // TODO: This error is probably because they somehow have 2 versions of
    // the router loaded. We can help them understand how to avoid that.
    "<Navigate> may be used only in the context of a <Router> component."
  );
  let { static: f } = _.useContext(Yt);
  qt(
    !f,
    "<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change."
  );
  let { matches: h } = _.useContext(pn), { pathname: m } = vt(), b = ft(), p = fc(
    a,
    Wu(h),
    m,
    u === "path"
  ), g = JSON.stringify(p);
  return _.useEffect(() => {
    b(JSON.parse(g), { replace: r, state: o, relative: u });
  }, [b, g, u, r, o]), null;
}
function Ge(a) {
  Qe(
    !1,
    "A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>."
  );
}
function lx({
  basename: a = "/",
  children: r = null,
  location: o,
  navigationType: u = "POP",
  navigator: f,
  static: h = !1,
  useTransitions: m
}) {
  Qe(
    !Ma(),
    "You cannot render a <Router> inside another <Router>. You should never have more than one in your app."
  );
  let b = a.replace(/^\/*/, "/"), p = _.useMemo(
    () => ({
      basename: b,
      navigator: f,
      static: h,
      useTransitions: m,
      future: {}
    }),
    [b, f, h, m]
  );
  typeof o == "string" && (o = Hl(o));
  let {
    pathname: g = "/",
    search: v = "",
    hash: y = "",
    state: j = null,
    key: E = "default",
    mask: A
  } = o, M = _.useMemo(() => {
    let T = Dn(g, b);
    return T == null ? null : {
      location: {
        pathname: T,
        search: v,
        hash: y,
        state: j,
        key: E,
        mask: A
      },
      navigationType: u
    };
  }, [b, g, v, y, j, E, u, A]);
  return qt(
    M != null,
    `<Router basename="${b}"> is not able to match the URL "${g}${v}${y}" because it does not start with the basename, so the <Router> won't render anything.`
  ), M == null ? null : /* @__PURE__ */ _.createElement(Yt.Provider, { value: p }, /* @__PURE__ */ _.createElement(As.Provider, { children: r, value: M }));
}
function ax({
  children: a,
  location: r
}) {
  return V0(Qu(a), r);
}
function Qu(a, r = []) {
  let o = [];
  return _.Children.forEach(a, (u, f) => {
    if (!_.isValidElement(u))
      return;
    let h = [...r, f];
    if (u.type === _.Fragment) {
      o.push.apply(
        o,
        Qu(u.props.children, h)
      );
      return;
    }
    Qe(
      u.type === Ge,
      `[${typeof u.type == "string" ? u.type : u.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`
    ), Qe(
      !u.props.index || !u.props.children,
      "An index route cannot have child routes."
    );
    let m = {
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
    u.props.children && (m.children = Qu(
      u.props.children,
      h
    )), o.push(m);
  }), o;
}
var ac = "get", sc = "application/x-www-form-urlencoded";
function mc(a) {
  return typeof HTMLElement < "u" && a instanceof HTMLElement;
}
function sx(a) {
  return mc(a) && a.tagName.toLowerCase() === "button";
}
function ix(a) {
  return mc(a) && a.tagName.toLowerCase() === "form";
}
function cx(a) {
  return mc(a) && a.tagName.toLowerCase() === "input";
}
function rx(a) {
  return !!(a.metaKey || a.altKey || a.ctrlKey || a.shiftKey);
}
function ux(a, r) {
  return a.button === 0 && // Ignore everything but left clicks
  (!r || r === "_self") && // Let browser handle "target=_blank" etc.
  !rx(a);
}
function Xu(a = "") {
  return new URLSearchParams(
    typeof a == "string" || Array.isArray(a) || a instanceof URLSearchParams ? a : Object.keys(a).reduce((r, o) => {
      let u = a[o];
      return r.concat(
        Array.isArray(u) ? u.map((f) => [o, f]) : [[o, u]]
      );
    }, [])
  );
}
function ox(a, r) {
  let o = Xu(a);
  return r && r.forEach((u, f) => {
    o.has(f) || r.getAll(f).forEach((h) => {
      o.append(f, h);
    });
  }), o;
}
var Ii = null;
function dx() {
  if (Ii === null)
    try {
      new FormData(
        document.createElement("form"),
        // @ts-expect-error if FormData supports the submitter parameter, this will throw
        0
      ), Ii = !1;
    } catch {
      Ii = !0;
    }
  return Ii;
}
var fx = /* @__PURE__ */ new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
]);
function Yu(a) {
  return a != null && !fx.has(a) ? (qt(
    !1,
    `"${a}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${sc}"`
  ), null) : a;
}
function hx(a, r) {
  let o, u, f, h, m;
  if (ix(a)) {
    let b = a.getAttribute("action");
    u = b ? Dn(b, r) : null, o = a.getAttribute("method") || ac, f = Yu(a.getAttribute("enctype")) || sc, h = new FormData(a);
  } else if (sx(a) || cx(a) && (a.type === "submit" || a.type === "image")) {
    let b = a.form;
    if (b == null)
      throw new Error(
        'Cannot submit a <button> or <input type="submit"> without a <form>'
      );
    let p = a.getAttribute("formaction") || b.getAttribute("action");
    if (u = p ? Dn(p, r) : null, o = a.getAttribute("formmethod") || b.getAttribute("method") || ac, f = Yu(a.getAttribute("formenctype")) || Yu(b.getAttribute("enctype")) || sc, h = new FormData(b, a), !dx()) {
      let { name: g, type: v, value: y } = a;
      if (v === "image") {
        let j = g ? `${g}.` : "";
        h.append(`${j}x`, "0"), h.append(`${j}y`, "0");
      } else g && h.append(g, y);
    }
  } else {
    if (mc(a))
      throw new Error(
        'Cannot submit element that is not <form>, <button>, or <input type="submit|image">'
      );
    o = ac, u = null, f = sc, m = a;
  }
  return h && f === "text/plain" && (m = h, h = void 0), { action: u, method: o.toLowerCase(), encType: f, formData: h, body: m };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function to(a, r) {
  if (a === !1 || a === null || typeof a > "u")
    throw new Error(r);
}
function ip(a, r, o, u) {
  let f = typeof a == "string" ? new URL(
    a,
    // This can be called during the SSR flow via PrefetchPageLinksImpl so
    // don't assume window is available
    typeof window > "u" ? "server://singlefetch/" : window.location.origin
  ) : a;
  return o ? f.pathname.endsWith("/") ? f.pathname = `${f.pathname}_.${u}` : f.pathname = `${f.pathname}.${u}` : f.pathname === "/" ? f.pathname = `_root.${u}` : r && Dn(f.pathname, r) === "/" ? f.pathname = `${oc(r)}/_root.${u}` : f.pathname = `${oc(f.pathname)}.${u}`, f;
}
async function mx(a, r) {
  if (a.id in r)
    return r[a.id];
  try {
    let o = await import(
      /* @vite-ignore */
      /* webpackIgnore: true */
      a.module
    );
    return r[a.id] = o, o;
  } catch (o) {
    return console.error(
      `Error loading route module \`${a.module}\`, reloading page...`
    ), console.error(o), window.__reactRouterContext && window.__reactRouterContext.isSpaMode, window.location.reload(), new Promise(() => {
    });
  }
}
function px(a) {
  return a == null ? !1 : a.href == null ? a.rel === "preload" && typeof a.imageSrcSet == "string" && typeof a.imageSizes == "string" : typeof a.rel == "string" && typeof a.href == "string";
}
async function vx(a, r, o) {
  let u = await Promise.all(
    a.map(async (f) => {
      let h = r.routes[f.route.id];
      if (h) {
        let m = await mx(h, o);
        return m.links ? m.links() : [];
      }
      return [];
    })
  );
  return yx(
    u.flat(1).filter(px).filter((f) => f.rel === "stylesheet" || f.rel === "preload").map(
      (f) => f.rel === "stylesheet" ? { ...f, rel: "prefetch", as: "style" } : { ...f, rel: "prefetch" }
    )
  );
}
function Mm(a, r, o, u, f, h) {
  let m = (p, g) => o[g] ? p.route.id !== o[g].route.id : !0, b = (p, g) => (
    // param change, /users/123 -> /users/456
    o[g].pathname !== p.pathname || // splat param changed, which is not present in match.path
    // e.g. /files/images/avatar.jpg -> files/finances.xls
    o[g].route.path?.endsWith("*") && o[g].params["*"] !== p.params["*"]
  );
  return h === "assets" ? r.filter(
    (p, g) => m(p, g) || b(p, g)
  ) : h === "data" ? r.filter((p, g) => {
    let v = u.routes[p.route.id];
    if (!v || !v.hasLoader)
      return !1;
    if (m(p, g) || b(p, g))
      return !0;
    if (p.route.shouldRevalidate) {
      let y = p.route.shouldRevalidate({
        currentUrl: new URL(
          f.pathname + f.search + f.hash,
          window.origin
        ),
        currentParams: o[0]?.params || {},
        nextUrl: new URL(a, window.origin),
        nextParams: p.params,
        defaultShouldRevalidate: !0
      });
      if (typeof y == "boolean")
        return y;
    }
    return !0;
  }) : [];
}
function gx(a, r, { includeHydrateFallback: o } = {}) {
  return xx(
    a.map((u) => {
      let f = r.routes[u.route.id];
      if (!f) return [];
      let h = [f.module];
      return f.clientActionModule && (h = h.concat(f.clientActionModule)), f.clientLoaderModule && (h = h.concat(f.clientLoaderModule)), o && f.hydrateFallbackModule && (h = h.concat(f.hydrateFallbackModule)), f.imports && (h = h.concat(f.imports)), h;
    }).flat(1)
  );
}
function xx(a) {
  return [...new Set(a)];
}
function bx(a) {
  let r = {}, o = Object.keys(a).sort();
  for (let u of o)
    r[u] = a[u];
  return r;
}
function yx(a, r) {
  let o = /* @__PURE__ */ new Set();
  return new Set(r), a.reduce((u, f) => {
    let h = JSON.stringify(bx(f));
    return o.has(h) || (o.add(h), u.push({ key: h, link: f })), u;
  }, []);
}
function no() {
  let a = _.useContext(Ea);
  return to(
    a,
    "You must render this element inside a <DataRouterContext.Provider> element"
  ), a;
}
function _x() {
  let a = _.useContext(hc);
  return to(
    a,
    "You must render this element inside a <DataRouterStateContext.Provider> element"
  ), a;
}
var lo = _.createContext(void 0);
lo.displayName = "FrameworkContext";
function pc() {
  let a = _.useContext(lo);
  return to(
    a,
    "You must render this element inside a <HydratedRouter> element"
  ), a;
}
function jx(a, r) {
  let o = _.useContext(lo), [u, f] = _.useState(!1), [h, m] = _.useState(!1), { onFocus: b, onBlur: p, onMouseEnter: g, onMouseLeave: v, onTouchStart: y } = r, j = _.useRef(null);
  _.useEffect(() => {
    if (a === "render" && m(!0), a === "viewport") {
      let M = (B) => {
        B.forEach((X) => {
          m(X.isIntersecting);
        });
      }, T = new IntersectionObserver(M, { threshold: 0.5 });
      return j.current && T.observe(j.current), () => {
        T.disconnect();
      };
    }
  }, [a]), _.useEffect(() => {
    if (u) {
      let M = setTimeout(() => {
        m(!0);
      }, 100);
      return () => {
        clearTimeout(M);
      };
    }
  }, [u]);
  let E = () => {
    f(!0);
  }, A = () => {
    f(!1), m(!1);
  };
  return o ? a !== "intent" ? [h, j, {}] : [
    h,
    j,
    {
      onFocus: Es(b, E),
      onBlur: Es(p, A),
      onMouseEnter: Es(g, E),
      onMouseLeave: Es(v, A),
      onTouchStart: Es(y, E)
    }
  ] : [!1, j, {}];
}
function Es(a, r) {
  return (o) => {
    a && a(o), o.defaultPrevented || r(o);
  };
}
function Sx({ page: a, ...r }) {
  let o = D0(), { nonce: u } = pc(), { router: f } = no(), h = _.useMemo(
    () => $m(f.routes, a, f.basename),
    [f.routes, a, f.basename]
  );
  return h ? (r.nonce == null && u && (r = { ...r, nonce: u }), o ? /* @__PURE__ */ _.createElement(Nx, { page: a, matches: h, ...r }) : /* @__PURE__ */ _.createElement(Ex, { page: a, matches: h, ...r })) : null;
}
function wx(a) {
  let { manifest: r, routeModules: o } = pc(), [u, f] = _.useState([]);
  return _.useEffect(() => {
    let h = !1;
    return vx(a, r, o).then(
      (m) => {
        h || f(m);
      }
    ), () => {
      h = !0;
    };
  }, [a, r, o]), u;
}
function Nx({
  page: a,
  matches: r,
  ...o
}) {
  let u = vt(), { future: f } = pc(), { basename: h } = no(), m = _.useMemo(() => {
    if (a === u.pathname + u.search + u.hash)
      return [];
    let b = ip(
      a,
      h,
      f.v8_trailingSlashAwareDataRequests,
      "rsc"
    ), p = !1, g = [];
    for (let v of r)
      typeof v.route.shouldRevalidate == "function" ? p = !0 : g.push(v.route.id);
    return p && g.length > 0 && b.searchParams.set("_routes", g.join(",")), [b.pathname + b.search];
  }, [
    h,
    f.v8_trailingSlashAwareDataRequests,
    a,
    u,
    r
  ]);
  return /* @__PURE__ */ _.createElement(_.Fragment, null, m.map((b) => /* @__PURE__ */ _.createElement("link", { key: b, rel: "prefetch", as: "fetch", href: b, ...o })));
}
function Ex({
  page: a,
  matches: r,
  ...o
}) {
  let u = vt(), { future: f, manifest: h, routeModules: m } = pc(), { basename: b } = no(), { loaderData: p, matches: g } = _x(), v = _.useMemo(
    () => Mm(
      a,
      r,
      g,
      h,
      u,
      "data"
    ),
    [a, r, g, h, u]
  ), y = _.useMemo(
    () => Mm(
      a,
      r,
      g,
      h,
      u,
      "assets"
    ),
    [a, r, g, h, u]
  ), j = _.useMemo(() => {
    if (a === u.pathname + u.search + u.hash)
      return [];
    let M = /* @__PURE__ */ new Set(), T = !1;
    if (r.forEach((X) => {
      let G = h.routes[X.route.id];
      !G || !G.hasLoader || (!v.some((ne) => ne.route.id === X.route.id) && X.route.id in p && m[X.route.id]?.shouldRevalidate || G.hasClientLoader ? T = !0 : M.add(X.route.id));
    }), M.size === 0)
      return [];
    let B = ip(
      a,
      b,
      f.v8_trailingSlashAwareDataRequests,
      "data"
    );
    return T && M.size > 0 && B.searchParams.set(
      "_routes",
      r.filter((X) => M.has(X.route.id)).map((X) => X.route.id).join(",")
    ), [B.pathname + B.search];
  }, [
    b,
    f.v8_trailingSlashAwareDataRequests,
    p,
    u,
    h,
    v,
    r,
    a,
    m
  ]), E = _.useMemo(
    () => gx(y, h),
    [y, h]
  ), A = wx(y);
  return /* @__PURE__ */ _.createElement(_.Fragment, null, j.map((M) => /* @__PURE__ */ _.createElement("link", { key: M, rel: "prefetch", as: "fetch", href: M, ...o })), E.map((M) => /* @__PURE__ */ _.createElement("link", { key: M, rel: "modulepreload", href: M, ...o })), A.map(({ key: M, link: T }) => (
    // these don't spread `linkProps` because they are full link descriptors
    // already with their own props
    /* @__PURE__ */ _.createElement(
      "link",
      {
        key: M,
        nonce: o.nonce,
        ...T,
        crossOrigin: T.crossOrigin ?? o.crossOrigin
      }
    )
  )));
}
function Mx(...a) {
  return (r) => {
    a.forEach((o) => {
      typeof o == "function" ? o(r) : o != null && (o.current = r);
    });
  };
}
var Cx = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
try {
  Cx && (window.__reactRouterVersion = // @ts-expect-error
  "7.18.2");
} catch {
}
function kx({
  basename: a,
  children: r,
  useTransitions: o,
  window: u
}) {
  let f = _.useRef();
  f.current == null && (f.current = c0({ window: u, v5Compat: !0 }));
  let h = f.current, [m, b] = _.useState({
    action: h.action,
    location: h.location
  }), p = _.useCallback(
    (g) => {
      o === !1 ? b(g) : _.startTransition(() => b(g));
    },
    [o]
  );
  return _.useLayoutEffect(() => h.listen(p), [h, p]), /* @__PURE__ */ _.createElement(
    lx,
    {
      basename: a,
      children: r,
      location: m.location,
      navigationType: m.action,
      navigator: h,
      useTransitions: o
    }
  );
}
var Ts = _.forwardRef(
  function({
    onClick: r,
    discover: o = "render",
    prefetch: u = "none",
    relative: f,
    reloadDocument: h,
    replace: m,
    mask: b,
    state: p,
    target: g,
    to: v,
    preventScrollReset: y,
    viewTransition: j,
    defaultShouldRevalidate: E,
    ...A
  }, M) {
    let { basename: T, navigator: B, useTransitions: X } = _.useContext(Yt), G = typeof v == "string" && Ju.test(v), ne = Jm(v, T);
    v = ne.to;
    let V = Y0(v, { relative: f }), P = vt(), F = null;
    if (b) {
      let ee = fc(
        b,
        [],
        P.mask ? P.mask.pathname : "/",
        !0
      );
      T !== "/" && (ee.pathname = ee.pathname === "/" ? T : sn([T, ee.pathname])), F = B.createHref(ee);
    }
    let [ie, pe, ae] = jx(
      u,
      A
    ), re = Rx(v, {
      replace: m,
      mask: b,
      state: p,
      target: g,
      preventScrollReset: y,
      relative: f,
      viewTransition: j,
      defaultShouldRevalidate: E,
      useTransitions: X
    });
    function de(ee) {
      r && r(ee), ee.defaultPrevented || re(ee);
    }
    let R = !(ne.isExternal || h), W = (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      /* @__PURE__ */ _.createElement(
        "a",
        {
          ...A,
          ...ae,
          href: (R ? F : void 0) || ne.absoluteURL || V,
          onClick: R ? de : r,
          ref: Mx(M, pe),
          target: g,
          "data-discover": !G && o === "render" ? "true" : void 0
        }
      )
    );
    return ie && !G ? /* @__PURE__ */ _.createElement(_.Fragment, null, W, /* @__PURE__ */ _.createElement(Sx, { page: V })) : W;
  }
);
Ts.displayName = "Link";
var ic = _.forwardRef(
  function({
    "aria-current": r = "page",
    caseSensitive: o = !1,
    className: u = "",
    end: f = !1,
    style: h,
    to: m,
    viewTransition: b,
    children: p,
    ...g
  }, v) {
    let y = Rs(m, { relative: g.relative }), j = vt(), E = _.useContext(hc), { navigator: A, basename: M } = _.useContext(Yt), T = E != null && // Conditional usage is OK here because the usage of a data router is static
    // eslint-disable-next-line react-hooks/rules-of-hooks
    Lx(y) && b === !0, B = A.encodeLocation ? A.encodeLocation(y).pathname : y.pathname, X = j.pathname, G = E && E.navigation && E.navigation.location ? E.navigation.location.pathname : null;
    o || (X = X.toLowerCase(), G = G ? G.toLowerCase() : null, B = B.toLowerCase()), G && M && (G = Dn(G, M) || G);
    const ne = B !== "/" && B.endsWith("/") ? B.length - 1 : B.length;
    let V = X === B || !f && X.startsWith(B) && X.charAt(ne) === "/", P = G != null && (G === B || !f && G.startsWith(B) && G.charAt(B.length) === "/"), F = {
      isActive: V,
      isPending: P,
      isTransitioning: T
    }, ie = V ? r : void 0, pe;
    typeof u == "function" ? pe = u(F) : pe = [
      u,
      V ? "active" : null,
      P ? "pending" : null,
      T ? "transitioning" : null
    ].filter(Boolean).join(" ");
    let ae = typeof h == "function" ? h(F) : h;
    return /* @__PURE__ */ _.createElement(
      Ts,
      {
        ...g,
        "aria-current": ie,
        className: pe,
        ref: v,
        style: ae,
        to: m,
        viewTransition: b
      },
      typeof p == "function" ? p(F) : p
    );
  }
);
ic.displayName = "NavLink";
var Tx = _.forwardRef(
  ({
    discover: a = "render",
    fetcherKey: r,
    navigate: o,
    reloadDocument: u,
    replace: f,
    state: h,
    method: m = ac,
    action: b,
    onSubmit: p,
    relative: g,
    preventScrollReset: v,
    viewTransition: y,
    defaultShouldRevalidate: j,
    ...E
  }, A) => {
    let { useTransitions: M } = _.useContext(Yt), T = Dx(), B = Hx(b, { relative: g }), X = m.toLowerCase() === "get" ? "get" : "post", G = typeof b == "string" && Ju.test(b), ne = (V) => {
      if (p && p(V), V.defaultPrevented) return;
      V.preventDefault();
      let P = V.nativeEvent.submitter, F = P?.getAttribute("formmethod") || m, ie = () => T(P || V.currentTarget, {
        fetcherKey: r,
        method: F,
        navigate: o,
        replace: f,
        state: h,
        relative: g,
        preventScrollReset: v,
        viewTransition: y,
        defaultShouldRevalidate: j
      });
      M && o !== !1 ? _.startTransition(() => ie()) : ie();
    };
    return /* @__PURE__ */ _.createElement(
      "form",
      {
        ref: A,
        method: X,
        action: B,
        onSubmit: u ? p : ne,
        ...E,
        "data-discover": !G && a === "render" ? "true" : void 0
      }
    );
  }
);
Tx.displayName = "Form";
function Ax(a) {
  return `${a} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function cp(a) {
  let r = _.useContext(Ea);
  return Qe(r, Ax(a)), r;
}
function Rx(a, {
  target: r,
  replace: o,
  mask: u,
  state: f,
  preventScrollReset: h,
  relative: m,
  viewTransition: b,
  defaultShouldRevalidate: p,
  useTransitions: g
} = {}) {
  let v = ft(), y = vt(), j = Rs(a, { relative: m });
  return _.useCallback(
    (E) => {
      if (ux(E, r)) {
        E.preventDefault();
        let A = o !== void 0 ? o : ks(y) === ks(j), M = () => v(a, {
          replace: A,
          mask: u,
          state: f,
          preventScrollReset: h,
          relative: m,
          viewTransition: b,
          defaultShouldRevalidate: p
        });
        g ? _.startTransition(() => M()) : M();
      }
    },
    [
      y,
      v,
      j,
      o,
      u,
      f,
      r,
      a,
      h,
      m,
      b,
      p,
      g
    ]
  );
}
function vc(a) {
  qt(
    typeof URLSearchParams < "u",
    "You cannot use the `useSearchParams` hook in a browser that does not support the URLSearchParams API. If you need to support Internet Explorer 11, we recommend you load a polyfill such as https://github.com/ungap/url-search-params."
  );
  let r = _.useRef(Xu(a)), o = _.useRef(!1), u = vt(), f = _.useMemo(
    () => (
      // Only merge in the defaults if we haven't yet called setSearchParams.
      // Once we call that we want those to take precedence, otherwise you can't
      // remove a param with setSearchParams({}) if it has an initial value
      ox(
        u.search,
        o.current ? null : r.current
      )
    ),
    [u.search]
  ), h = ft(), m = _.useCallback(
    (b, p) => {
      const g = Xu(
        typeof b == "function" ? b(new URLSearchParams(f)) : b
      );
      o.current = !0, h("?" + g, p);
    },
    [h, f]
  );
  return [f, m];
}
var zx = 0, Ox = () => `__${String(++zx)}__`;
function Dx() {
  let { router: a } = cp(
    "useSubmit"
    /* UseSubmit */
  ), { basename: r } = _.useContext(Yt), o = I0(), u = a.fetch, f = a.navigate;
  return _.useCallback(
    async (h, m = {}) => {
      let { action: b, method: p, encType: g, formData: v, body: y } = hx(
        h,
        r
      );
      if (m.navigate === !1) {
        let j = m.fetcherKey || Ox();
        await u(j, o, m.action || b, {
          defaultShouldRevalidate: m.defaultShouldRevalidate,
          preventScrollReset: m.preventScrollReset,
          formData: v,
          body: y,
          formMethod: m.method || p,
          formEncType: m.encType || g,
          flushSync: m.flushSync
        });
      } else
        await f(m.action || b, {
          defaultShouldRevalidate: m.defaultShouldRevalidate,
          preventScrollReset: m.preventScrollReset,
          formData: v,
          body: y,
          formMethod: m.method || p,
          formEncType: m.encType || g,
          replace: m.replace,
          state: m.state,
          fromRouteId: o,
          flushSync: m.flushSync,
          viewTransition: m.viewTransition
        });
    },
    [u, f, r, o]
  );
}
function Hx(a, { relative: r } = {}) {
  let { basename: o } = _.useContext(Yt), u = _.useContext(pn);
  Qe(u, "useFormAction must be used inside a RouteContext");
  let [f] = u.matches.slice(-1), h = { ...Rs(a || ".", { relative: r }) }, m = vt();
  if (a == null) {
    h.search = m.search;
    let b = new URLSearchParams(h.search), p = b.getAll("index");
    if (p.some((v) => v === "")) {
      b.delete("index"), p.filter((y) => y).forEach((y) => b.append("index", y));
      let v = b.toString();
      h.search = v ? `?${v}` : "";
    }
  }
  return (!a || a === ".") && f.route.index && (h.search = h.search ? h.search.replace(/^\?/, "?index&") : "?index"), o !== "/" && (h.pathname = h.pathname === "/" ? o : sn([o, h.pathname])), ks(h);
}
function Lx(a, { relative: r } = {}) {
  let o = _.useContext(Im);
  Qe(
    o != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?"
  );
  let { basename: u } = cp(
    "useViewTransitionState"
    /* useViewTransitionState */
  ), f = Rs(a, { relative: r });
  if (!o.isTransitioning)
    return !1;
  let h = Dn(o.currentLocation.pathname, u) || o.currentLocation.pathname, m = Dn(o.nextLocation.pathname, u) || o.nextLocation.pathname;
  return uc(f.pathname, m) != null || uc(f.pathname, h) != null;
}
const Ux = {
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
function Bx(a) {
  return Ux[a];
}
const rp = _.createContext(null), Gx = /* @__PURE__ */ new Set([
  "input_boolean",
  "input_number",
  "input_select",
  "input_text",
  "input_datetime",
  "input_button"
]);
function qx(a) {
  if (!a) return !1;
  const r = a.toLowerCase(), o = r.indexOf("."), u = o >= 0 ? r.slice(0, o) : "", f = o >= 0 ? r.slice(o + 1) : r;
  return f.startsWith("dsc_") || f.startsWith("dsc-") || f.includes("_dsc_") || r.includes("dsc_") || r.includes("dsc-") ? !0 : Gx.has(u) ? f.startsWith("dsc_") || f.includes("dsc_") : r.startsWith("sensor.dsc") || r.startsWith("switch.dsc") || r.startsWith("binary_sensor.dsc") || r.startsWith("number.dsc") || r.startsWith("light.dsc") || r.startsWith("fan.dsc") || r.startsWith("select.dsc") || r.startsWith("text.dsc") || r.startsWith("datetime.dsc") || r.startsWith("time.dsc");
}
const Yx = 150;
function $x({
  hass: a,
  children: r
}) {
  const [o, u] = _.useState(0), f = _.useRef(null), h = _.useRef(a);
  h.current = a;
  const m = () => {
    f.current || (f.current = setTimeout(() => {
      f.current = null, u((v) => v + 1);
    }, Yx));
  };
  _.useEffect(() => {
    if (!a) return;
    m();
    const v = a.connection;
    if (!v?.subscribeEvents) return;
    let y, j = !1;
    const E = (A) => {
      const M = A.data?.entity_id;
      qx(M) && m();
    };
    return Promise.resolve(v.subscribeEvents(E, "state_changed")).then((A) => {
      if (j) {
        A();
        return;
      }
      y = A;
    }).catch(() => {
    }), () => {
      j = !0, y?.(), f.current && (clearTimeout(f.current), f.current = null);
    };
  }, [a]);
  const b = _.useMemo(
    () => (v, y, j) => {
      const E = h.current;
      return E?.callService ? E.callService(v, y, j) : Promise.resolve(null);
    },
    []
  ), p = _.useMemo(
    () => (v) => {
      const y = h.current;
      if (y?.callWS) return y.callWS(v);
      const j = y?.connection;
      return j?.sendMessagePromise ? j.sendMessagePromise(v) : Promise.resolve(null);
    },
    []
  ), g = _.useMemo(() => {
    const v = (A) => a?.states?.[A], y = (A) => {
      const M = v(A)?.state;
      return !!M && M !== "unavailable" && M !== "unknown";
    }, j = (A, M = "—") => y(A) ? v(A)?.state ?? M : M;
    return { hass: a, entity: v, state: j, num: (A, M = NaN) => {
      const T = Number(j(A, ""));
      return Number.isFinite(T) ? T : M;
    }, available: y, callService: b, callWS: p, tick: o };
  }, [a, o, b, p]);
  return _.createElement(rp.Provider, { value: g }, r);
}
function Te() {
  const a = _.useContext(rp);
  if (!a) throw new Error("useHass outside HassProvider");
  return a;
}
function mn({
  name: a,
  size: r = 16,
  className: o,
  color: u = "currentColor"
}) {
  return /* @__PURE__ */ s.jsx(
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
      dangerouslySetInnerHTML: { __html: Bx(a) }
    }
  );
}
function se({
  title: a,
  children: r,
  className: o = "",
  style: u,
  icon: f
}) {
  return /* @__PURE__ */ s.jsxs("section", { className: `dsc-card ${o}`.trim(), style: u, children: [
    a ? /* @__PURE__ */ s.jsxs("h3", { className: "dsc-card-title", children: [
      f ? /* @__PURE__ */ s.jsx(mn, { name: f, size: 14, color: "var(--dsc-teal)" }) : null,
      a
    ] }) : null,
    r
  ] });
}
function fe({
  children: a,
  primary: r,
  teal: o,
  onClick: u,
  type: f = "button",
  disabled: h
}) {
  const m = ["dsc-btn"];
  return r && m.push("primary"), o && m.push("teal"), /* @__PURE__ */ s.jsx("button", { type: f, className: m.join(" "), onClick: u, disabled: h, children: a });
}
function Ve({
  label: a,
  value: r,
  unit: o,
  sub: u,
  tone: f = "normal",
  stale: h,
  onClick: m
}) {
  const b = f === "ok" ? "dsc-status-ok" : f === "bad" ? "dsc-status-bad" : f === "muted" || h ? "dsc-status-muted" : "", p = /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsxs("div", { className: `dsc-kpi-value ${b}`.trim(), children: [
      r,
      o ? /* @__PURE__ */ s.jsx("span", { className: "dsc-kpi-unit", children: o }) : null,
      h ? /* @__PURE__ */ s.jsx("span", { className: "dsc-held-tag", children: "HELD" }) : null
    ] }),
    u ? /* @__PURE__ */ s.jsx("div", { className: "dsc-kpi-sub", children: u }) : null
  ] });
  return m ? /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-kpi-hit", onClick: m, title: `History · ${a}`, children: /* @__PURE__ */ s.jsx(se, { title: a, className: h ? "is-stale" : void 0, children: p }) }) : /* @__PURE__ */ s.jsx(se, { title: a, className: h ? "is-stale" : void 0, children: p });
}
function $t({
  title: a,
  subtitle: r,
  icon: o,
  primaryAction: u,
  actions: f
}) {
  const h = u || f ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-page-header-actions", children: [
    u,
    f
  ] }) : null;
  return /* @__PURE__ */ s.jsxs("header", { className: "dsc-page-header", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-page-header-main", children: [
      o ? /* @__PURE__ */ s.jsx(mn, { name: o, size: 22, color: "var(--dsc-teal)" }) : null,
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("h1", { className: "dsc-page-title", children: a }),
        r ? /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: r }) : null
      ] })
    ] }),
    h
  ] });
}
function Q({
  label: a,
  tone: r = "muted",
  pulse: o,
  icon: u
}) {
  return /* @__PURE__ */ s.jsxs("span", { className: `dsc-chip dsc-chip--${r}${o ? " dsc-chip--pulse" : ""}`, children: [
    u ? /* @__PURE__ */ s.jsx(mn, { name: u, size: 11 }) : null,
    a
  ] });
}
function We({
  entityId: a,
  label: r,
  warnWhenMissing: o,
  icon: u,
  showBrightness: f
}) {
  const { state: h, available: m, callService: b, entity: p } = Te(), g = h(a, "off") === "on", v = m(a), y = a.split(".")[0], j = () => {
    if (v) {
      if (y === "switch" || y === "input_boolean") {
        b("homeassistant", "toggle", { entity_id: a });
        return;
      }
      y === "light" && b("light", g ? "turn_off" : "turn_on", { entity_id: a });
    }
  }, E = f !== !1 && y === "light" && g ? Math.round(Number(p(a)?.attributes?.brightness ?? 0) / 255 * 100) : null;
  return /* @__PURE__ */ s.jsxs(
    "button",
    {
      type: "button",
      className: `dsc-demand${g ? " is-on" : ""}${v ? "" : " is-missing"}`,
      onClick: j,
      disabled: !v && !o,
      title: v ? a : o || `${a} unavailable`,
      children: [
        u ? /* @__PURE__ */ s.jsx(mn, { name: u, size: 22, color: "var(--dsc-teal)", className: "dsc-demand-icon" }) : null,
        /* @__PURE__ */ s.jsx("span", { className: "dsc-demand-label", children: r }),
        /* @__PURE__ */ s.jsx("span", { className: "dsc-demand-state", children: v ? E != null ? `${E}%` : g ? "ON" : "OFF" : o || "—" })
      ]
    }
  );
}
function Ol({
  entityId: a,
  label: r,
  icon: o
}) {
  const { state: u, available: f, callService: h, entity: m } = Te(), b = f(a), p = u(a, ""), g = m(a)?.attributes?.options || [], v = a.split(".")[0], [y, j] = _.useState(!1), [E, A] = _.useState(p);
  _.useEffect(() => {
    y || A(p);
  }, [p, y]);
  const M = (B) => {
    A(B), j(!1), !(!b || !B) && (v === "select" ? h("select", "select_option", { entity_id: a, option: B }) : v === "input_select" && h("input_select", "select_option", { entity_id: a, option: B }));
  }, T = y ? E : p;
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-entity-select${b ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ s.jsxs("span", { className: "dsc-entity-select-label", children: [
      o ? /* @__PURE__ */ s.jsx(mn, { name: o, size: 13, color: "var(--dsc-teal)" }) : null,
      r
    ] }),
    /* @__PURE__ */ s.jsxs(
      "select",
      {
        value: T,
        disabled: !b,
        onFocus: () => j(!0),
        onBlur: () => j(!1),
        onChange: (B) => M(B.target.value),
        children: [
          !g.includes(T) && T ? /* @__PURE__ */ s.jsx("option", { value: T, children: T }) : null,
          g.map((B) => /* @__PURE__ */ s.jsx("option", { value: B, children: B }, B))
        ]
      }
    )
  ] });
}
function ul({
  entityId: a,
  label: r,
  disabled: o
}) {
  const { available: u, callService: f, entity: h, state: m } = Te(), b = u(a), p = Number(h(a)?.attributes?.percentage ?? 0), g = m(a) === "on", v = o || !b, [y, j] = _.useState(!1), [E, A] = _.useState(Number.isFinite(p) ? p : 0);
  _.useEffect(() => {
    !y && Number.isFinite(p) && A(p);
  }, [p, y]);
  const M = (B) => {
    v || f("fan", "set_percentage", { entity_id: a, percentage: B });
  }, T = y ? E : Number.isFinite(p) ? p : 0;
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-fan-slider${v ? " is-disabled" : ""}`, children: [
    /* @__PURE__ */ s.jsxs("span", { className: "dsc-fan-slider-label", children: [
      r,
      /* @__PURE__ */ s.jsx("strong", { children: b ? `${Math.round(T)}%` : "—" }),
      !g && b ? /* @__PURE__ */ s.jsx("em", { className: "dsc-muted", children: "off" }) : null
    ] }),
    /* @__PURE__ */ s.jsx(
      "input",
      {
        type: "range",
        min: 0,
        max: 100,
        step: 1,
        value: T,
        disabled: v,
        onPointerDown: (B) => {
          B.target.setPointerCapture(B.pointerId), j(!0);
        },
        onPointerUp: (B) => {
          j(!1), M(Number(B.target.value));
        },
        onPointerCancel: () => j(!1),
        onLostPointerCapture: () => j(!1),
        onChange: (B) => {
          const X = Number(B.target.value);
          A(X), y || M(X);
        }
      }
    )
  ] });
}
function up(a) {
  return !a || a === "unknown" || a === "unavailable" ? "" : a;
}
function cc({
  entityId: a,
  label: r,
  multiline: o = !1,
  rows: u = 2
}) {
  const { available: f, callService: h, state: m } = Te(), b = f(a), p = up(m(a, "")), [g, v] = _.useState(p), y = _.useRef(!1);
  _.useEffect(() => {
    y.current || v(p);
  }, [p]);
  const j = () => {
    b && h("input_text", "set_value", { entity_id: a, value: g });
  }, E = {
    value: g,
    disabled: !b,
    onFocus: () => {
      y.current = !0;
    },
    onChange: (A) => v(A.target.value),
    onBlur: () => {
      y.current = !1, j();
    },
    onKeyDown: (A) => {
      A.key === "Enter" && !o && A.currentTarget.blur();
    }
  };
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-target-num${b ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ s.jsx("span", { className: "dsc-target-num-label", children: r }),
    o ? /* @__PURE__ */ s.jsx("textarea", { rows: u, ...E }) : /* @__PURE__ */ s.jsx("input", { type: "text", ...E })
  ] });
}
function Vx(a) {
  const r = up(a);
  return r ? r.slice(0, 5) : "";
}
function Qx(a) {
  return a ? a.length === 5 ? `${a}:00` : a : "00:00:00";
}
function Cm({ entityId: a, label: r }) {
  const { available: o, callService: u, state: f } = Te(), h = o(a), m = Vx(f(a, "")), [b, p] = _.useState(m), g = _.useRef(!1);
  _.useEffect(() => {
    g.current || p(m);
  }, [m]);
  const v = () => {
    !h || !b || u("time", "set_value", { entity_id: a, time: Qx(b) });
  };
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-target-num${h ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ s.jsx("span", { className: "dsc-target-num-label", children: r }),
    /* @__PURE__ */ s.jsx(
      "input",
      {
        type: "time",
        value: b,
        disabled: !h,
        onFocus: () => {
          g.current = !0;
        },
        onChange: (y) => p(y.target.value),
        onBlur: () => {
          g.current = !1, v();
        }
      }
    )
  ] });
}
function ec({
  label: a,
  empty: r = !1,
  onClick: o
}) {
  const u = /* @__PURE__ */ s.jsx("span", { className: `dsc-result-chip${r ? " is-empty" : ""}`, children: /* @__PURE__ */ s.jsx("span", { children: a }) });
  return o ? /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-result-chip-hit", onClick: o, children: u }) : u;
}
function en({
  open: a,
  onDismiss: r,
  onConfirm: o,
  title: u,
  confirmLabel: f = "Confirm",
  help: h,
  children: m
}) {
  const b = _.useId(), p = _.useRef(null), g = _.useRef(null);
  return _.useEffect(() => {
    if (!a) return;
    g.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, p.current?.querySelector("button, input, select, textarea, [href]")?.focus();
    const j = (E) => {
      E.key === "Escape" && (E.preventDefault(), r());
    };
    return window.addEventListener("keydown", j), () => {
      window.removeEventListener("keydown", j), g.current?.focus?.();
    };
  }, [a, r]), a ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-decision-root is-open", role: "presentation", children: [
    /* @__PURE__ */ s.jsx("div", { className: "dsc-decision-scrim", onClick: r }),
    /* @__PURE__ */ s.jsxs(
      "aside",
      {
        ref: p,
        className: "dsc-decision-panel",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": b,
        children: [
          /* @__PURE__ */ s.jsxs("header", { className: "dsc-decision-head", children: [
            /* @__PURE__ */ s.jsx("h2", { id: b, children: u }),
            /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-icon-btn", "aria-label": "Dismiss", onClick: r, children: /* @__PURE__ */ s.jsx(mn, { name: "close", size: 16 }) })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "dsc-decision-body", children: m }),
          h ? /* @__PURE__ */ s.jsx("div", { className: "dsc-decision-help", children: h }) : /* @__PURE__ */ s.jsx("div", { className: "dsc-decision-help is-empty" }),
          /* @__PURE__ */ s.jsxs("footer", { className: "dsc-decision-foot", children: [
            /* @__PURE__ */ s.jsx(fe, { onClick: r, children: "Dismiss" }),
            o ? /* @__PURE__ */ s.jsx(fe, { primary: !0, onClick: o, children: f }) : null
          ] })
        ]
      }
    )
  ] }) : null;
}
function Xx(a) {
  const r = [], o = (m, b = "unknown") => a.state(m, b), u = (m) => o(m) === "on", f = a.entity?.("sensor.dsc_keepup_gaps")?.attributes ?? {}, h = String(f.full_auto_honesty ?? "").trim();
  if (a.available && a.available("binary_sensor.dsc_hub_link") && !u("binary_sensor.dsc_hub_link") && r.push({
    id: "hub-link",
    label: "Hub link down",
    detail: "binary_sensor.dsc_hub_link is off — Mission/Fleet show HELD, not last-good animation.",
    tone: "bad",
    href: "/fleet",
    cta: "Open Fleet",
    priority: 9
  }), a.available && !a.available("sensor.dsc_hub_uptime")) {
    const m = a.entity?.("sensor.dsc_hub_uptime")?.last_changed;
    let b = "";
    if (m) {
      const p = Date.now() - Date.parse(m);
      if (Number.isFinite(p) && p >= 0) {
        const g = Math.floor(p / 6e4);
        b = g < 60 ? ` · offline ${Math.max(1, g)}m` : ` · offline ${(g / 60).toFixed(1)}h`;
      }
    }
    r.push({
      id: "hub-dark",
      label: "Hub offline",
      detail: `Showing last good vitals${b}. Reconnect snaps to live.`,
      tone: "bad",
      href: "/fleet",
      cta: "Open Fleet",
      priority: 10
    });
  }
  return a.available && !a.available("sensor.dsc_hub_heartbeat") && r.push({
    id: "beat-dark",
    label: "Beat dark",
    detail: "Hub heartbeat unavailable — Mission shows BEAT OFF duration; vitals stay held.",
    tone: "bad",
    href: "/live/mission",
    cta: "Mission",
    priority: 12
  }), a.available && !a.available("binary_sensor.dsc_hub_panel_link") && r.push({
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
  }), u("binary_sensor.dsc_clone_light_missing_in_window") && r.push({
    id: "photo-missing",
    label: "Light missing in window",
    detail: "Photoperiod integrity — fixture did not deliver in the open window.",
    tone: "bad",
    href: "/live/light",
    cta: "Open Light",
    priority: 24
  }), u("binary_sensor.dsc_hub_light_catchup_active") && r.push({
    id: "photo-catchup",
    label: "Light catch-up",
    detail: "Catch-up photoperiod is active — hours gauge is the Got, not invented.",
    tone: "warn",
    href: "/live/light",
    cta: "Open Light",
    priority: 28
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
  }), r.sort((m, b) => m.priority - b.priority);
}
function Zx(a) {
  return a[0] ?? null;
}
function op() {
  const a = Te();
  return _.useMemo(
    () => Xx({
      state: a.state,
      available: a.available,
      entity: a.entity
    }),
    [a.state, a.available, a.entity, a.tick]
  );
}
function Kx({ gaps: a }) {
  const r = op(), o = a ?? r, [u, f] = _.useState(null), h = ft();
  return o.length ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsx("div", { className: "dsc-honesty-rail", "aria-label": "Honesty gaps", children: o.slice(0, 6).map((m) => /* @__PURE__ */ s.jsx(
      "button",
      {
        type: "button",
        className: "dsc-honesty-hit",
        onClick: () => f(m),
        children: /* @__PURE__ */ s.jsx(Q, { icon: "alert", label: m.label, tone: m.tone === "bad" ? "bad" : "warn" })
      },
      m.id
    )) }),
    /* @__PURE__ */ s.jsx(
      en,
      {
        open: u != null,
        onDismiss: () => f(null),
        onConfirm: u ? () => {
          h(u.href), f(null);
        } : void 0,
        title: u?.label ?? "Honesty",
        confirmLabel: u?.cta ?? "Go",
        help: null,
        children: /* @__PURE__ */ s.jsx("p", { children: u?.detail })
      }
    )
  ] }) : /* @__PURE__ */ s.jsx("div", { className: "dsc-honesty-rail", "aria-label": "Honesty", children: /* @__PURE__ */ s.jsx(Q, { icon: "ok", label: "Kit honest", tone: "ok" }) });
}
function Fx({ gaps: a }) {
  const r = op(), u = Zx(a ?? r), f = ft();
  return u ? /* @__PURE__ */ s.jsxs(se, { className: "dsc-glass dsc-next-rec", title: "Do this next", icon: "alert", children: [
    /* @__PURE__ */ s.jsxs("p", { style: { margin: "0 0 8px" }, children: [
      /* @__PURE__ */ s.jsx("strong", { children: u.label }),
      " — ",
      u.detail
    ] }),
    /* @__PURE__ */ s.jsx(fe, { primary: !0, onClick: () => f(u.href), children: u.cta })
  ] }) : /* @__PURE__ */ s.jsxs(se, { className: "dsc-glass dsc-next-rec", title: "Next", icon: "ok", children: [
    /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: "No critical gaps — fly Live or open Twin." }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", children: [
      /* @__PURE__ */ s.jsx(fe, { primary: !0, onClick: () => f("/live/twin"), children: "Open Twin" }),
      /* @__PURE__ */ s.jsx(fe, { teal: !0, onClick: () => f("/live/climate"), children: "Climate Want" })
    ] })
  ] });
}
const zl = "7.1.5-bar-raise", dp = [
  `/local/DSC-HUB.js?v=${zl}`,
  `/hacsfiles/DSC-HUB/DSC-HUB.js?v=${zl}`
], Jx = {
  "dsc-catalog-browse-card": [`/local/dsc-catalog-browse-card.js?v=${zl}`],
  "dsc-build-plant-card": [`/local/dsc-build-plant-card.js?v=${zl}`],
  "dsc-the-dash-card": [`/local/dsc-the-dash-card.js?v=${zl}`],
  "dsc-airflow-map-card": [`/local/dsc-airflow-map-card.js?v=${zl}`],
  "dsc-system-map-card": [
    `/local/dsc-system-map-card.js?v=${zl}`,
    ...dp
  ]
}, tc = /* @__PURE__ */ new Map();
function km(a) {
  if (document.querySelector(`script[data-dsc-autoload="${a}"]`))
    return tc.get(a) ?? Promise.resolve();
  if (tc.has(a)) return tc.get(a);
  const o = new Promise((u, f) => {
    const h = document.createElement("script");
    h.src = a, h.async = !0, h.dataset.dscAutoload = a, h.onload = () => u(), h.onerror = () => f(new Error(`Failed to load ${a}`)), document.head.appendChild(h);
  });
  return tc.set(a, o), o;
}
async function Wx(a, r = 12e3) {
  const o = Jx[a] ?? [];
  for (const u of o)
    try {
      await km(u);
    } catch {
    }
  if (customElements.get(a)) return !0;
  for (const u of dp) {
    try {
      await km(u);
    } catch {
    }
    if (customElements.get(a)) return !0;
  }
  try {
    return await Promise.race([
      customElements.whenDefined(a),
      new Promise(
        (u, f) => window.setTimeout(() => f(new Error("timeout")), r)
      )
    ]), !!customElements.get(a);
  } catch {
    return !!customElements.get(a);
  }
}
const ao = [
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
], fp = new Map(ao.map((a) => [a.id, a])), zs = ao[2];
function Zu(a) {
  return `input_select.dsc_pot${a}_vessel`;
}
function Px(a) {
  const r = String(a || "").trim();
  return fp.has(r) ? r : zs.id;
}
function Ku(a, r) {
  const o = fp.get(Px(a)) ?? zs;
  return Number.isFinite(r) && r > 0 ? { ...o, volumeL: r } : o;
}
function wa(a, r, o) {
  const u = Zu(a), f = r(u, "");
  if (f && f !== "unknown" && f !== "unavailable")
    return Ku(f);
  const h = o?.("sensor.dsc_plant_roster_summary")?.attributes?.slots;
  if (Array.isArray(h)) {
    const m = h.find((b) => String(b.pot) === String(a));
    if (m?.vessel) return Ku(m.vessel);
  }
  return zs;
}
function Ix(a) {
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
const Tm = [
  "var(--dsc-soil-1)",
  "var(--dsc-soil-2)",
  "var(--dsc-soil-3)",
  "var(--dsc-soil-4)"
];
function Am(a) {
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
function dl({
  spec: a,
  layers: r = [],
  size: o = 56,
  label: u
}) {
  const f = `vclip-${a.id}-${a.silhouette}`, h = r.reduce((b, p) => b + p.pct, 0) || 1;
  let m = 0;
  return /* @__PURE__ */ s.jsxs("span", { className: "dsc-vessel-glyph", title: a.label, children: [
    /* @__PURE__ */ s.jsxs("svg", { width: o, height: o * 1.15, viewBox: "0 0 100 100", "aria-hidden": !0, children: [
      /* @__PURE__ */ s.jsx("defs", { children: /* @__PURE__ */ s.jsx("clipPath", { id: f, children: /* @__PURE__ */ s.jsx("path", { d: Am(a.silhouette) }) }) }),
      /* @__PURE__ */ s.jsx(
        "path",
        {
          d: Am(a.silhouette),
          fill: "rgba(8,12,10,0.85)",
          stroke: Ix(a.material),
          strokeWidth: "2.4",
          strokeDasharray: a.silhouette === "airpot" ? "5 3" : void 0
        }
      ),
      /* @__PURE__ */ s.jsx("g", { clipPath: `url(#${f})`, children: r.map((b, p) => {
        const g = b.pct / h * 88, v = 96 - m - g;
        return m += g, /* @__PURE__ */ s.jsx(
          "rect",
          {
            x: "12",
            y: v,
            width: "76",
            height: g,
            fill: b.color || Tm[p % Tm.length]
          },
          `${b.name}-${p}`
        );
      }) })
    ] }),
    u ? /* @__PURE__ */ s.jsxs("span", { className: "dsc-vessel-glyph-label", children: [
      a.volumeL,
      "L"
    ] }) : null
  ] });
}
function so({
  label: a,
  icon: r,
  onClick: o,
  className: u = "",
  expanded: f
}) {
  return /* @__PURE__ */ s.jsx(
    "button",
    {
      type: "button",
      className: `dsc-icon-btn ${u}`.trim(),
      "aria-label": a,
      title: a,
      "aria-expanded": f,
      onClick: o,
      children: /* @__PURE__ */ s.jsx(mn, { name: r, size: 16 })
    }
  );
}
function eb(a) {
  return a instanceof Element ? !!a.closest(
    "ha-more-info-dialog, ha-dialog, ha-more-info-info, .ha-more-info, home-assistant-dialog"
  ) : !1;
}
function gc({
  items: a,
  label: r = "More actions"
}) {
  const [o, u] = _.useState(!1), f = _.useRef(null);
  return _.useEffect(() => {
    if (!o) return;
    const h = (b) => {
      eb(b.target) || f.current?.contains(b.target) || u(!1);
    }, m = (b) => {
      b.key === "Escape" && u(!1);
    };
    return document.addEventListener("mousedown", h), window.addEventListener("keydown", m), () => {
      document.removeEventListener("mousedown", h), window.removeEventListener("keydown", m);
    };
  }, [o]), /* @__PURE__ */ s.jsxs("div", { className: "dsc-overflow", ref: f, children: [
    /* @__PURE__ */ s.jsx(
      so,
      {
        label: r,
        icon: "more",
        expanded: o,
        onClick: () => u((h) => !h)
      }
    ),
    o ? /* @__PURE__ */ s.jsx("div", { className: "dsc-overflow-menu", role: "menu", children: a.map((h) => /* @__PURE__ */ s.jsx(
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
function Rm(a) {
  return Array.from(
    a.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((r) => !r.hasAttribute("disabled") && r.tabIndex !== -1);
}
function Os({
  open: a,
  onClose: r,
  title: o,
  side: u = "right",
  children: f
}) {
  const h = _.useId(), m = _.useRef(null), b = _.useRef(null);
  return _.useEffect(() => {
    if (!a) return;
    b.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const p = m.current;
    (p ? Rm(p)[0] : null)?.focus();
    const v = (y) => {
      if (y.key === "Escape") {
        y.preventDefault(), r();
        return;
      }
      if (y.key !== "Tab" || !p) return;
      const j = Rm(p);
      if (!j.length) return;
      const E = j[0], A = j[j.length - 1];
      y.shiftKey && document.activeElement === E ? (y.preventDefault(), A.focus()) : !y.shiftKey && document.activeElement === A && (y.preventDefault(), E.focus());
    };
    return window.addEventListener("keydown", v), () => {
      window.removeEventListener("keydown", v), b.current?.focus?.();
    };
  }, [a, r]), /* @__PURE__ */ s.jsxs("div", { className: `dsc-drawer-root${a ? " is-open" : ""}`, "aria-hidden": !a, children: [
    /* @__PURE__ */ s.jsx("div", { className: "dsc-drawer-scrim", onClick: r }),
    /* @__PURE__ */ s.jsxs(
      "aside",
      {
        ref: m,
        className: `dsc-drawer-panel ${u}`,
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
              onClick: r,
              children: "Close"
            }
          ),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-drawer-head", children: [
            /* @__PURE__ */ s.jsx("h2", { id: h, children: o }),
            /* @__PURE__ */ s.jsx(so, { label: "Close", icon: "close", onClick: r })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "dsc-drawer-body", children: f })
        ]
      }
    )
  ] });
}
function tb(a) {
  if (!a || !a.trim()) return [];
  const r = a.split(/[|/·]/).map((u) => u.trim()).filter(Boolean), o = [];
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
function nb({
  layers: a,
  valid: r,
  emptyLabel: o = "No blend on roster seat",
  spec: u
}) {
  const f = u ?? zs, h = a.reduce((b, p) => b + p.pct, 0), m = r ?? (a.length > 0 && Math.round(h) === 100);
  return a.length ? /* @__PURE__ */ s.jsx("div", { className: `dsc-soil${m ? " is-valid" : ""}`, children: /* @__PURE__ */ s.jsx(dl, { spec: f, layers: a, size: 180, label: !0 }) }) : /* @__PURE__ */ s.jsxs("div", { className: "dsc-soil", children: [
    /* @__PURE__ */ s.jsx(dl, { spec: f, size: 160 }),
    /* @__PURE__ */ s.jsx("div", { className: "dsc-soil-empty", children: o })
  ] });
}
function mt(a, r = "—") {
  return !a || a === "unknown" || a === "unavailable" || a === "none" ? r : a;
}
function io(a, r) {
  const o = a(`input_select.dsc_pot${r}_tent`, "unassigned");
  return o === "clone" || o === "main" || o === "unassigned" ? o : "unassigned";
}
function co(a) {
  switch (a) {
    case "clone":
      return "Clone 2×4";
    case "main":
      return "Main 4×8";
    case "unassigned":
      return "Unassigned";
    default:
      return a;
  }
}
function Ca(a, r) {
  const { state: o, entity: u } = r, f = u("sensor.dsc_plant_roster_summary")?.attributes?.slots || [], h = Array.isArray(f) ? f.find((p) => String(p.pot) === String(a)) : void 0, m = (p, g) => {
    const v = mt(o(p, ""));
    return v !== "—" ? v : mt(o(g, ""));
  }, b = mt(h?.blend, "");
  return {
    pot: a,
    plantName: mt(o(`text.dsc_pot${a}_plant_name`, "")),
    strainDisplay: mt(o(`sensor.dsc_pot${a}_strain_display`, "")),
    sprout: mt(o(`datetime.dsc_pot${a}_sprout_date`, ""), "—").slice(0, 10),
    days: mt(o(`sensor.dsc_pot${a}_days_since_sprout`, "")),
    stage: mt(o(`sensor.dsc_pot${a}_expected_stage`, "")),
    growthStage: mt(o(`select.dsc_pot${a}_growth_stage`, "")),
    tent: io(o, a),
    blend: b,
    recipe: mt(h?.recipe, ""),
    notes: mt(h?.notes, ""),
    layers: tb(b),
    moisture: m(`sensor.dsc_pot${a}_got_moisture`, `sensor.dsc_pot${a}_soil_moisture`),
    soilTemp: mt(o(`sensor.dsc_pot${a}_soil_temperature`, "")),
    ec: m(`sensor.dsc_pot${a}_got_ec`, `sensor.dsc_pot${a}_soil_conductivity`),
    ph: m(`sensor.dsc_pot${a}_got_ph`, `sensor.dsc_pot${a}_soil_ph`),
    n: mt(o(`sensor.dsc_pot${a}_soil_nitrogen`, "")),
    p: mt(o(`sensor.dsc_pot${a}_soil_phosphorus`, "")),
    k: mt(o(`sensor.dsc_pot${a}_soil_potassium`, "")),
    need: mt(o(`sensor.dsc_pot${a}_need_summary`, "")),
    rosterSlot: h?.slot ?? null
  };
}
function ol(a, r, o) {
  const u = `sensor.dsc_pot${a}_got_${r}`, f = r === "moisture" ? `sensor.dsc_pot${a}_soil_moisture` : r === "ec" ? `sensor.dsc_pot${a}_soil_conductivity` : `sensor.dsc_pot${a}_soil_ph`, h = o(u, "");
  return h && h !== "unavailable" && h !== "unknown" ? u : f;
}
function lb(a, r, o) {
  return Ds(r).map((u) => Ca(u, { state: r, entity: o })).filter((u) => u.tent === a);
}
const fl = [1, 2, 3, 4];
function Gt(a, r) {
  const o = `input_boolean.dsc_pot${a}_in_service`, u = r(o, "on");
  return u === "unavailable" || u === "unknown" || u === "" ? !0 : u === "on";
}
function Ds(a, r = [...fl]) {
  return r.filter((o) => Gt(o, a));
}
function ro(a, r = [...fl]) {
  return { inService: Ds(a, r).length, total: r.length };
}
function ab(a) {
  const r = a("sensor.dsc_plant_roster_summary")?.attributes?.slots;
  return Array.isArray(r) ? r : [];
}
function uo(a, r) {
  const o = r(`binary_sensor.dsc_pot${a}_sensor_stuck`) === "on", u = r(`binary_sensor.dsc_pot${a}_untrusted`) === "on", f = r("sensor.dsc_peer_divergence_summary", "") !== "—" && r("sensor.dsc_peer_divergence_summary", "") !== "ok" && r("sensor.dsc_peer_divergence_summary", "").toLowerCase() !== "none" && r("sensor.dsc_peer_divergence_summary", "") !== "unknown" && r("sensor.dsc_peer_divergence_summary", "") !== "unavailable" && r("sensor.dsc_peer_divergence_summary", "").length > 0 && r("sensor.dsc_peer_divergence_summary", "") !== "0", h = [];
  o && h.push("stuck"), u && h.push("untrusted"), f && h.push("peer divergence");
  let m = "ok";
  return u || o ? m = "bad" : f && (m = "warn"), {
    stuck: o,
    untrusted: u,
    peerDivergence: f,
    blockNeedAct: u || o,
    tone: m,
    labels: h
  };
}
function sb(a, r) {
  return !Number.isFinite(a) || !Number.isFinite(r) ? NaN : 6.112 * Math.exp(17.67 * a / (a + 243.5)) * r * 2.1674 / (273.15 + a);
}
function ib(a) {
  return a === "/live/main" ? "main" : a === "/live/clone" ? "clone" : null;
}
function cb(a) {
  return a === "/live/twin" || a === "/ops/dash" || a === "/live/main" || a === "/live/clone";
}
function rb() {
  const a = vt(), { hass: r, available: o, num: u, state: f, entity: h } = Te(), m = _.useRef(null), b = _.useRef(null), [p, g] = _.useState("loading"), v = ib(a.pathname), y = a.pathname === "/live/twin" || a.pathname === "/ops/dash" || a.pathname === "/live/main" || a.pathname === "/live/clone", j = o("binary_sensor.dsc_hub_link") ? f("binary_sensor.dsc_hub_link") !== "on" : !o("sensor.dsc_hub_uptime");
  return _.useEffect(() => {
    const E = m.current;
    if (!E || b.current) return;
    let A = !1;
    return (async () => {
      g("loading");
      const M = await Wx("dsc-the-dash-card");
      if (A || !m.current) return;
      if (!M) {
        g("missing");
        return;
      }
      const T = document.createElement("dsc-the-dash-card");
      typeof T.setConfig == "function" && T.setConfig({ type: "custom:dsc-the-dash-card" }), r && (T.hass = r), E.appendChild(T), b.current = T, g("ready");
    })(), () => {
      A = !0;
    };
  }, []), _.useEffect(() => {
    b.current && r && (b.current.hass = r);
  }, [r]), _.useEffect(() => {
    const E = b.current;
    E && (E.setFocusTent?.(v), E.setUiChrome?.({ hideHud: cb(a.pathname) }));
  }, [v, a.pathname, p]), _.useEffect(() => {
    const E = b.current, A = () => {
      const M = !y || document.hidden;
      E?.pause?.(M);
    };
    return A(), document.addEventListener("visibilitychange", A), () => document.removeEventListener("visibilitychange", A);
  }, [y, p]), _.useEffect(() => {
    b.current?.setHeld?.(j);
  }, [j, p]), _.useEffect(() => {
    const E = b.current;
    if (!E?.setPots) return;
    const A = fl.map((M) => {
      const T = Ca(M, { state: f, entity: h }), B = wa(M, f, h), X = uo(M, f), G = Gt(M, f), ne = io(f, M);
      return {
        id: `pot${M}`,
        pot: M,
        tent: ne,
        slot: 0,
        inService: G,
        silhouette: B.silhouette,
        moisture: Number(T.moisture),
        ec: Number(T.ec),
        ph: Number(T.ph),
        soilT: Number(T.soilTemp),
        dryback: u(`sensor.dsc_pot${M}_dryback_pct`),
        need: T.need,
        held: j,
        untrusted: X.untrusted
      };
    });
    E.setPots(A);
  }, [f, h, u, j, p]), /* @__PURE__ */ s.jsxs(
    "div",
    {
      className: `dsc-twin-keepalive${y ? " is-active" : ""}`,
      "aria-hidden": !y,
      "data-status": p,
      "data-focus-tent": v || "both",
      children: [
        /* @__PURE__ */ s.jsx("div", { className: "dsc-twin-keepalive-host", ref: m }),
        p === "missing" ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-empty", children: [
          /* @__PURE__ */ s.jsx("strong", { children: "dsc-the-dash-card" }),
          " did not register. Deploy",
          " ",
          /* @__PURE__ */ s.jsx("code", { children: "/local/dsc-the-dash-card.js" }),
          " and hard-refresh."
        ] }) : null
      ]
    }
  );
}
const ub = "https://cannalib.plausible-deniability.net", ob = {
  strain: "/local/dsc-catalog/dsc_strains_search_index.json",
  medium: "/local/dsc-catalog/dsc_mediums_search_index.json",
  nutrient: "/local/dsc-catalog/dsc_nutrients_search_index.json",
  light: "/local/dsc-catalog/dsc_lights_search_index.json"
}, db = {
  strain: "strains",
  medium: "mediums",
  nutrient: "nutrients",
  light: "lights"
};
function fb(a) {
  return (a("input_text.dsc_cannalib_base_url", "") || ub).replace(/\/$/, "");
}
function hb(a) {
  const r = { Accept: "application/json" }, o = a("input_text.dsc_cannalib_api_key", "");
  return o && o !== "unknown" && o !== "unavailable" && (r["X-Cannalib-Key"] = o), r;
}
function hp(a) {
  if (Array.isArray(a)) return a;
  if (a && typeof a == "object") {
    const r = a;
    if (Array.isArray(r.items)) return r.items;
    if (Array.isArray(r.strains)) return r.strains;
  }
  return [];
}
function mb(a) {
  return String(a.name || a.id || "").trim();
}
async function pb(a, r) {
  const o = await fetch(ob[a], { cache: "no-store" });
  if (!o.ok) return [];
  const u = hp(await o.json()), f = r.trim().toLowerCase();
  return f ? u.filter((h) => mb(h).toLowerCase().includes(f)).slice(0, 40) : u.slice(0, 40);
}
async function mp(a, r, o, u = 24) {
  try {
    const h = db[a], m = `${fb(o)}/v1/catalogs/${h}?q=${encodeURIComponent(r || "")}&limit=${u}`, b = await fetch(m, { headers: hb(o), cache: "no-store" });
    if (!b.ok) throw new Error(`cannalib ${b.status}`);
    const p = hp(await b.json()).slice(0, u);
    if (p.length || a === "strain")
      return {
        items: p,
        source: "cannalib",
        note: "Cannalib full corpus"
      };
  } catch {
  }
  return {
    items: await pb(a, r),
    source: "local",
    note: "Cannalib unreachable — local JSON index (capped)"
  };
}
function pp({
  kind: a,
  onPick: r,
  placeholder: o
}) {
  const { state: u } = Te(), [f, h] = _.useState(""), [m, b] = _.useState([]), [p, g] = _.useState("local"), [v, y] = _.useState(""), [j, E] = _.useState(!1);
  _.useEffect(() => {
    let M = !1;
    const T = window.setTimeout(() => {
      E(!0), mp(a, f, u, 40).then((B) => {
        M || (b(B.items), g(B.source), y(B.note), E(!1));
      });
    }, 200);
    return () => {
      M = !0, window.clearTimeout(T);
    };
  }, [a, f]);
  const A = _.useMemo(() => m, [m]);
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-catalog-picker", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ s.jsx(
        Q,
        {
          label: p === "cannalib" ? "Cannalib" : "Local JSON",
          tone: p === "cannalib" ? "ok" : "warn"
        }
      ),
      v ? /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", style: { fontSize: 12 }, children: v }) : null
    ] }),
    /* @__PURE__ */ s.jsx(
      "input",
      {
        type: "search",
        value: f,
        placeholder: o || "Type to search — options are not culled",
        onChange: (M) => h(M.target.value),
        autoComplete: "off"
      }
    ),
    /* @__PURE__ */ s.jsxs("ul", { className: "dsc-catalog-hits", children: [
      j && !A.length ? /* @__PURE__ */ s.jsx("li", { className: "dsc-muted", children: "Searching…" }) : null,
      !j && !A.length ? /* @__PURE__ */ s.jsx("li", { className: "dsc-muted", children: "No catalog hits — empty is honesty, not a placeholder." }) : null,
      A.map((M, T) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsxs("button", { type: "button", onClick: () => r(M), children: [
        /* @__PURE__ */ s.jsx("strong", { children: M.name }),
        M.type ? /* @__PURE__ */ s.jsx("em", { children: String(M.type) }) : null,
        M.breeder ? /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", children: String(M.breeder) }) : null
      ] }) }, `${M.id || M.name}-${T}`))
    ] })
  ] });
}
const cl = [1, 2, 3];
function $u(a, r, o, u) {
  const f = Math.max(0, Math.min(100, Math.round(r))), h = cl.filter((j) => j !== a), m = h.filter((j) => u[j]), b = h.filter((j) => !u[j]);
  let g = 100 - m.reduce((j, E) => j + (Number.isFinite(o[E]) ? o[E] : 0), 0);
  const v = Math.min(f, g), y = { ...o, [a]: v };
  if (g -= v, b.length === 1)
    y[b[0]] = Math.max(0, g);
  else if (b.length > 1) {
    const j = b.reduce((E, A) => E + (Number.isFinite(o[A]) ? o[A] : 0), 0);
    b.forEach((E) => {
      const A = j > 0 ? o[E] / j * g : g / b.length;
      y[E] = Math.max(0, Math.round(A));
    });
  }
  return y;
}
function vb({ volumeL: a }) {
  const { state: r, num: o, available: u, callService: f } = Te(), [h, m] = _.useState({ 1: !1, 2: !1, 3: !1 }), [b, p] = _.useState(null), [g, v] = _.useState(null), y = {
    1: o("input_number.dsc_blend_pct_1", 0),
    2: o("input_number.dsc_blend_pct_2", 0),
    3: o("input_number.dsc_blend_pct_3", 0)
  }, j = g ?? y, E = cl.map((V) => ({
    n: V,
    name: r(`input_text.dsc_blend_component_${V}_name`, ""),
    pct: Number.isFinite(j[V]) ? j[V] : 0
  })), A = cl.filter((V) => h[V]).length, M = cl.find((V) => !h[V]) ?? 3, T = Number.isFinite(a) && a > 0 ? a : o("input_number.dsc_blend_total_l", 20), B = E.reduce((V, P) => V + (Number.isFinite(P.pct) ? P.pct : 0), 0), X = (V) => {
    cl.forEach((P) => {
      u(`input_number.dsc_blend_pct_${P}`) && f("input_number", "set_value", {
        entity_id: `input_number.dsc_blend_pct_${P}`,
        value: V[P]
      });
    });
  }, G = (V) => {
    m((P) => {
      const F = { ...P, [V]: !P[V] };
      return cl.filter((pe) => F[pe]).length >= cl.length ? P : F;
    });
  }, ne = _.useMemo(
    () => E.filter((V) => V.pct > 0 && V.name && V.name !== "unknown").map((V) => `${V.name} ${T * V.pct / 100}L (${Math.round(V.pct)}%)`).join(" · "),
    [E, T]
  );
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-coupled-mix", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ s.jsx(Q, { label: `Σ ${Math.round(B)}%`, tone: Math.round(B) === 100 ? "ok" : "warn" }),
      /* @__PURE__ */ s.jsx(Q, { label: `${T} L vessel`, tone: "muted" }),
      /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", style: { fontSize: 12 }, children: "Lock any but one remainder. Remainder channel is computed, not dragged." })
    ] }),
    cl.map((V) => {
      const P = E[V - 1], F = V === M && !h[V];
      return /* @__PURE__ */ s.jsxs("div", { className: "dsc-mix-row", children: [
        /* @__PURE__ */ s.jsx(
          cc,
          {
            entityId: `input_text.dsc_blend_component_${V}_name`,
            label: `Layer ${V}`
          }
        ),
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "range",
            min: 0,
            max: 100,
            value: Math.round(P.pct),
            disabled: h[V] || F,
            onPointerDown: (ie) => {
              h[V] || F || (ie.target.setPointerCapture(ie.pointerId), p(V), v({ ...j }));
            },
            onPointerUp: (ie) => {
              if (b !== V) return;
              const pe = $u(V, Number(ie.target.value), g ?? j, h);
              v(null), p(null), X(pe);
            },
            onPointerCancel: () => {
              v(null), p(null);
            },
            onLostPointerCapture: () => {
              b === V && (v(null), p(null));
            },
            onChange: (ie) => {
              const pe = Number(ie.target.value);
              if (b === V) {
                v($u(V, pe, g ?? j, h));
                return;
              }
              X($u(V, pe, j, h));
            }
          }
        ),
        /* @__PURE__ */ s.jsxs("strong", { children: [
          Math.round(P.pct),
          "%"
        ] }),
        /* @__PURE__ */ s.jsxs("span", { className: "dsc-mono", children: [
          (T * P.pct / 100).toFixed(1),
          " L"
        ] }),
        /* @__PURE__ */ s.jsx(fe, { disabled: A >= 2 && !h[V], onClick: () => G(V), children: h[V] ? "Unlock" : F ? "Remainder" : "Lock" })
      ] }, V);
    }),
    /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: [
      "Recipe: ",
      ne || "Empty layers — scripts still read pct entities."
    ] })
  ] });
}
const gb = {
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
function pt({
  entityId: a,
  label: r,
  step: o
}) {
  const { num: u, available: f, callService: h, entity: m } = Te(), b = f(a), p = m(a), g = u(a, NaN), v = Number(p?.attributes?.min ?? 0), y = Number(p?.attributes?.max ?? 100), j = o ?? Number(p?.attributes?.step ?? 0.1), [E, A] = _.useState(String(Number.isFinite(g) ? g : "")), M = _.useRef(!1);
  _.useEffect(() => {
    !M.current && Number.isFinite(g) && A(String(g));
  }, [g]);
  const T = () => {
    if (!b) return;
    const B = Number(E);
    if (!Number.isFinite(B)) {
      A(String(Number.isFinite(g) ? g : ""));
      return;
    }
    const X = Math.min(y, Math.max(v, B)), ne = a.split(".")[0] === "input_number" ? "input_number" : "number";
    h(ne, "set_value", { entity_id: a, value: X }), A(String(X));
  };
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-target-num${b ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ s.jsx("span", { className: "dsc-target-num-label", children: r }),
    /* @__PURE__ */ s.jsx(
      "input",
      {
        type: "number",
        value: E,
        disabled: !b,
        min: v,
        max: y,
        step: j,
        onFocus: () => {
          M.current = !0;
        },
        onChange: (B) => A(B.target.value),
        onBlur: () => {
          M.current = !1, T();
        },
        onKeyDown: (B) => {
          B.key === "Enter" && B.target.blur();
        }
      }
    )
  ] });
}
function xb({ tent: a, title: r }) {
  const { num: o, available: u } = Te(), f = gb[a], h = o(f.gotTemp), m = o(f.gotRh), b = u(f.gotVpd) ? o(f.gotVpd) : NaN, p = o(f.temp), g = o(f.rhMin), v = o(f.rhMax), y = (j) => {
    const E = new CustomEvent("hass-more-info", {
      detail: { entityId: j },
      bubbles: !0,
      composed: !0
    });
    document.querySelector("home-assistant")?.dispatchEvent(E);
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-tent-targets", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-tent-targets-head", children: [
      /* @__PURE__ */ s.jsx("strong", { children: r }),
      /* @__PURE__ */ s.jsx(
        gc,
        {
          label: `${r} more`,
          items: [
            {
              id: "temp",
              label: "More info · temp target",
              onSelect: () => y(f.temp)
            },
            {
              id: "rh",
              label: "More info · RH band",
              onSelect: () => y(f.rhMin)
            },
            {
              id: "vpd",
              label: "More info · VPD band",
              onSelect: () => y(f.vpdMin)
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
        Number.isFinite(m) ? m.toFixed(0) : "—",
        "%",
        Number.isFinite(b) ? ` / ${b.toFixed(2)} kPa` : ""
      ] }),
      /* @__PURE__ */ s.jsxs("span", { className: "dsc-muted", children: [
        "Want ",
        Number.isFinite(p) ? p.toFixed(1) : "—",
        "°C · RH",
        " ",
        Number.isFinite(g) ? g.toFixed(0) : "—",
        "–",
        Number.isFinite(v) ? v.toFixed(0) : "—",
        "%"
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
      /* @__PURE__ */ s.jsx(pt, { entityId: f.temp, label: "Temp °C", step: 0.5 }),
      /* @__PURE__ */ s.jsx(pt, { entityId: f.rhMin, label: "RH min %", step: 1 }),
      /* @__PURE__ */ s.jsx(pt, { entityId: f.rhMax, label: "RH max %", step: 1 }),
      /* @__PURE__ */ s.jsx(pt, { entityId: f.vpdMin, label: "VPD min", step: 0.01 }),
      /* @__PURE__ */ s.jsx(pt, { entityId: f.vpdMax, label: "VPD max", step: 0.01 })
    ] })
  ] });
}
function vp({
  compact: a,
  emphasize: r,
  only: o
}) {
  const u = o ? [o] : r === "clone" ? ["clone", "main"] : ["main", "clone"];
  return /* @__PURE__ */ s.jsx("div", { className: `dsc-target-panel${a ? " is-compact" : ""}`, children: u.map((f) => /* @__PURE__ */ s.jsx(xb, { tent: f, title: f === "main" ? "Main 4×8" : "Clone 2×4" }, f)) });
}
const zm = [1, 2, 3, 4, 5, 6, 7, 8];
function bb() {
  const { available: a, callService: r, entity: o, num: u, state: f } = Te(), [h, m] = _.useState(null), [b, p] = _.useState(null), g = f("input_text.dsc_build_strain", ""), v = f("input_text.dsc_build_nickname", ""), y = f("input_select.dsc_build_assign_pot", "none"), j = u("input_number.dsc_blend_total_l", 20), E = f("input_select.dsc_light_fixture", ""), A = f("input_select.dsc_build_vessel", ""), M = Ku(A || void 0, j), T = u("input_number.dsc_mix_tank_liters", 20), B = u("input_number.dsc_mix_strength_pct", 100), X = (Number.isFinite(B) ? B : 100) / 100, G = Number.isFinite(T) && T > 0 ? T : 20, ne = (ae, re) => {
    if (ae === "strain")
      r("input_text", "set_value", { entity_id: "input_text.dsc_build_strain", value: re.name });
    else if (ae === "medium") {
      const de = re.composition && typeof re.composition == "object" ? Object.entries(re.composition).filter(([, R]) => Number.isFinite(Number(R)) && Number(R) > 0).slice(0, 3) : [];
      if (de.length)
        for (let R = 1; R <= 3; R++) {
          const W = de[R - 1];
          r("input_text", "set_value", {
            entity_id: `input_text.dsc_blend_component_${R}_name`,
            value: W ? String(W[0]) : ""
          }), r("input_number", "set_value", {
            entity_id: `input_number.dsc_blend_pct_${R}`,
            value: W ? Number(W[1]) : 0
          });
        }
      else
        r("input_text", "set_value", {
          entity_id: "input_text.dsc_blend_component_1_name",
          value: re.name
        });
    } else if (ae === "nutrient")
      for (const de of zm) {
        const R = f(`input_text.dsc_nutrient_${de}_name`, ""), W = f(`input_boolean.dsc_nutrient_${de}_in_inventory`) === "on";
        if (!R || R === "unknown" || !W) {
          r("input_text", "set_value", {
            entity_id: `input_text.dsc_nutrient_${de}_name`,
            value: re.name
          }), re.dose_ml_l != null && Number.isFinite(Number(re.dose_ml_l)) && r("input_number", "set_value", {
            entity_id: `input_number.dsc_nutrient_${de}_dose_ml_l`,
            value: Number(re.dose_ml_l)
          }), r("input_boolean", "turn_on", { entity_id: `input_boolean.dsc_nutrient_${de}_in_inventory` });
          break;
        }
      }
    else if (ae === "light") {
      const R = (o("input_select.dsc_light_fixture")?.attributes?.options || []).find((W) => W.toLowerCase().includes(String(re.name || "").toLowerCase().slice(0, 18)));
      R ? r("input_select", "select_option", { entity_id: "input_select.dsc_light_fixture", option: R }) : r("input_text", "set_value", { entity_id: "input_text.dsc_light_custom_name", value: re.name });
    }
    m(null);
  }, V = (ae) => {
    const re = Number(ae);
    if (!Number.isFinite(re) || ae === "none") return;
    const de = Zu(re);
    a(de) && r("input_select", "select_option", { entity_id: de, option: M.id });
  }, P = () => {
    r("script", "turn_on", { entity_id: "script.dsc_build_plant_commit" });
  }, F = () => {
    if (V(y), a("script.dsc_build_plant_commit_and_assign")) {
      r("script", "turn_on", { entity_id: "script.dsc_build_plant_commit_and_assign" });
      return;
    }
    r("script", "turn_on", { entity_id: "script.dsc_build_plant_commit" }), r("script", "turn_on", {
      entity_id: "script.dsc_plant_assign_to_pot",
      variables: { pot: y }
    });
  }, ie = zm.map((ae) => {
    const re = f(`input_text.dsc_nutrient_${ae}_name`, ""), de = u(`input_number.dsc_nutrient_${ae}_dose_ml_l`, 0), R = u(`input_number.dsc_nutrient_${ae}_stock_ml`, 0), W = f(`input_boolean.dsc_nutrient_${ae}_in_inventory`) === "on", ee = !re || re === "unknown" || re === "unavailable", C = !ee && Number.isFinite(de) ? Math.round(de * G * X * 10) / 10 : 0;
    return { n: ae, name: re, dose: de, stock: R, inv: W, empty: ee, ml: C, short: W && Number.isFinite(R) && R < C && C > 0 };
  }), pe = ie.reduce((ae, re) => ae + re.ml, 0);
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-compose", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(se, { className: "dsc-glass", title: "Strain", icon: "roster", children: [
        /* @__PURE__ */ s.jsx(
          ec,
          {
            label: g && g !== "unknown" ? g : "No strain",
            empty: !g || g === "unknown",
            onClick: () => m("strain")
          }
        ),
        /* @__PURE__ */ s.jsx(cc, { entityId: "input_text.dsc_build_nickname", label: "Nickname" }),
        /* @__PURE__ */ s.jsx(Ol, { entityId: "input_select.dsc_build_custom_slot", label: "Custom strain slot" })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(se, { className: "dsc-glass", title: "Vessel + mix", icon: "compose", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
          /* @__PURE__ */ s.jsx(dl, { spec: M, size: 48, label: !0 }),
          /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-chip", onClick: () => m("vessel"), children: M.label })
        ] }),
        /* @__PURE__ */ s.jsx(vb, { volumeL: M.volumeL || j }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", style: { marginTop: 8 }, children: /* @__PURE__ */ s.jsx(ec, { label: "Medium search", onClick: () => m("medium"), empty: !0 }) })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(se, { className: "dsc-glass", title: "Nutrition", icon: "nutrient", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
          /* @__PURE__ */ s.jsx(ec, { label: "Add from catalog", onClick: () => m("nutrient"), empty: !0 }),
          /* @__PURE__ */ s.jsx(Q, { label: `Tank ${G} L`, tone: "muted" }),
          /* @__PURE__ */ s.jsx(Q, { label: `${Math.round(X * 100)}% strength`, tone: "muted" }),
          /* @__PURE__ */ s.jsx(Q, { label: `${pe.toFixed(1)} ml`, tone: pe > 0 ? "ok" : "muted" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
          /* @__PURE__ */ s.jsx(pt, { entityId: "input_number.dsc_mix_tank_liters", label: "Tank L", step: 0.5 }),
          /* @__PURE__ */ s.jsx(pt, { entityId: "input_number.dsc_mix_strength_pct", label: "Strength %", step: 1 })
        ] }),
        ie.map((ae) => /* @__PURE__ */ s.jsxs("div", { className: "dsc-nutrient-slot", children: [
          /* @__PURE__ */ s.jsx(cc, { entityId: `input_text.dsc_nutrient_${ae.n}_name`, label: `Slot ${ae.n}` }),
          /* @__PURE__ */ s.jsx(pt, { entityId: `input_number.dsc_nutrient_${ae.n}_dose_ml_l`, label: "ml/L", step: 0.1 }),
          /* @__PURE__ */ s.jsx("span", { className: "dsc-mono", children: ae.empty ? "—" : `${ae.ml} ml` }),
          ae.short ? /* @__PURE__ */ s.jsx(Q, { label: "stock short", tone: "warn" }) : null
        ] }, ae.n)),
        /* @__PURE__ */ s.jsx(cc, { entityId: "input_text.dsc_build_recipe_note", label: "Recipe note", multiline: !0 }),
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: "ml = dose × tank × strength. Empty names stay empty — Compose does not invent products." })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(se, { className: "dsc-glass", title: "Light + assign", icon: "lighting", children: [
        /* @__PURE__ */ s.jsx(
          ec,
          {
            label: E && E !== "unknown" ? E : "No fixture",
            empty: !E || E === "unknown",
            onClick: () => m("light")
          }
        ),
        /* @__PURE__ */ s.jsx(Ol, { entityId: "input_select.dsc_build_assign_pot", label: "Assign pot", icon: "root" }),
        /* @__PURE__ */ s.jsx(Ol, { entityId: "input_select.dsc_build_climate_pot", label: "Climate apply pot", icon: "climate" }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ s.jsx(fe, { primary: !0, onClick: () => p("roster"), children: "Commit roster" }),
          /* @__PURE__ */ s.jsx(fe, { teal: !0, onClick: () => p("assign"), children: "Commit + assign" }),
          /* @__PURE__ */ s.jsx(fe, { onClick: () => p("mix"), children: "Accept mix" }),
          /* @__PURE__ */ s.jsx(fe, { onClick: () => p("climate"), children: "Apply climate Want" })
        ] }),
        /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", style: { marginBottom: 0 }, children: [
          "Confirm overlay writes HA scripts. Coupled mix stays on ",
          /* @__PURE__ */ s.jsx("code", { children: "input_number.dsc_blend_pct_N" }),
          "."
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ s.jsx(
      en,
      {
        open: h === "strain" || h === "medium" || h === "nutrient" || h === "light",
        onDismiss: () => m(null),
        title: h ? `Search ${h}` : "Search",
        help: null,
        children: h === "strain" || h === "medium" || h === "nutrient" || h === "light" ? /* @__PURE__ */ s.jsx(pp, { kind: h, onPick: (ae) => ne(h, ae) }) : null
      }
    ),
    /* @__PURE__ */ s.jsxs(en, { open: h === "vessel", onDismiss: () => m(null), title: "Vessel", help: null, children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: ao.map((ae) => /* @__PURE__ */ s.jsxs(
        "button",
        {
          type: "button",
          className: `dsc-chip${ae.id === M.id ? " dsc-chip--ok" : ""}`,
          onClick: () => {
            (o("input_select.dsc_build_vessel")?.attributes?.options || []).includes(ae.id) && a("input_select.dsc_build_vessel") && r("input_select", "select_option", {
              entity_id: "input_select.dsc_build_vessel",
              option: ae.id
            }), r("input_number", "set_value", {
              entity_id: "input_number.dsc_blend_total_l",
              value: ae.volumeL
            }), m(null);
          },
          children: [
            /* @__PURE__ */ s.jsx(dl, { spec: ae, size: 28 }),
            " ",
            ae.label
          ]
        },
        ae.id
      )) }),
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { fontSize: 12 }, children: [
        "Default if helper missing: ",
        zs.label,
        ". Reload HA after packages load",
        " ",
        /* @__PURE__ */ s.jsx("code", { children: "dsc_v4_vessel.yaml" }),
        "."
      ] }),
      a("input_select.dsc_build_vessel") ? /* @__PURE__ */ s.jsx(Q, { label: "Vessel helper", tone: "ok" }) : /* @__PURE__ */ s.jsx(Q, { label: "Volume-only until vessel select exists", tone: "warn" })
    ] }),
    /* @__PURE__ */ s.jsx(
      en,
      {
        open: b === "roster",
        onDismiss: () => p(null),
        onConfirm: () => {
          P(), p(null);
        },
        title: "Commit roster",
        confirmLabel: "Write roster",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          "Strain ",
          v || g || "—",
          ". Vessel ",
          M.label,
          ". Assign helper stays ",
          y,
          ". Runs",
          " ",
          /* @__PURE__ */ s.jsx("code", { children: "script.dsc_build_plant_commit" }),
          "."
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx(
      en,
      {
        open: b === "assign",
        onDismiss: () => p(null),
        onConfirm: () => {
          F(), p(null);
        },
        title: "Commit + assign",
        confirmLabel: "Write + assign",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          "Writes roster then assigns pot ",
          y === "none" ? "(none — pick a pot first)" : y,
          ". Copies vessel",
          " ",
          M.id,
          " onto ",
          /* @__PURE__ */ s.jsx("code", { children: y === "none" ? "—" : Zu(Number(y)) }),
          " if that helper exists."
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx(
      en,
      {
        open: b === "mix",
        onDismiss: () => p(null),
        onConfirm: () => {
          r("script", "turn_on", { entity_id: "script.dsc_accept_mix" }), p(null);
        },
        title: "Accept mix",
        confirmLabel: "Burn stock",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          pe.toFixed(1),
          " ml from tank ",
          G,
          " L × ",
          Math.round(X * 100),
          "% strength. Runs",
          " ",
          /* @__PURE__ */ s.jsx("code", { children: "script.dsc_accept_mix" }),
          ". Does not invent missing nutrients."
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx(
      en,
      {
        open: b === "climate",
        onDismiss: () => p(null),
        onConfirm: () => {
          r("script", "turn_on", { entity_id: "script.dsc_apply_climate_want" }), p(null);
        },
        title: "Apply climate Want",
        confirmLabel: "Write Want",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          "Applies custom temp/RH Want to pot",
          " ",
          f("input_select.dsc_build_climate_pot", "Fleet"),
          " via",
          " ",
          /* @__PURE__ */ s.jsx("code", { children: "script.dsc_apply_climate_want" }),
          ". Does not invent catalog bands."
        ] })
      }
    )
  ] });
}
const yb = [
  { id: "strain", label: "Strains" },
  { id: "medium", label: "Mediums" },
  { id: "nutrient", label: "Nutrients" },
  { id: "light", label: "Lights" }
];
function _b() {
  const { callService: a, state: r } = Te(), o = ft(), [u, f] = _.useState("strain"), [h, m] = _.useState(null), [b, p] = _.useState([]), [g, v] = _.useState("");
  _.useEffect(() => {
    mp(u, "", r, 8).then((E) => v(E.note));
  }, [u, r]);
  const y = _.useMemo(() => ["name", "type", "breeder", "height_cm_min", "flowering_days_min", "thc_min"], []), j = (E) => {
    E && (u === "strain" && a("input_text", "set_value", { entity_id: "input_text.dsc_build_strain", value: E.name }), o("/grow/compose"));
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-research", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: [
      yb.map((E) => /* @__PURE__ */ s.jsx(
        "button",
        {
          type: "button",
          className: `dsc-chip${u === E.id ? " dsc-chip--ok" : ""}`,
          onClick: () => {
            f(E.id), m(null);
          },
          children: E.label
        },
        E.id
      )),
      /* @__PURE__ */ s.jsx(Q, { label: g || "Catalog", tone: g.includes("local") ? "warn" : "ok" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(se, { className: "dsc-glass", title: "Browse", icon: "research", children: /* @__PURE__ */ s.jsx(
        pp,
        {
          kind: u,
          onPick: (E) => m(E)
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(se, { className: "dsc-glass", title: "Detail", icon: "roster", children: h ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx("h3", { style: { marginTop: 0 }, children: h.name }),
        /* @__PURE__ */ s.jsx("dl", { className: "dsc-detail-list", children: y.map((E) => /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("dt", { children: E }),
          /* @__PURE__ */ s.jsx("dd", { children: h[E] != null && h[E] !== "" ? String(h[E]) : "—" })
        ] }, E)) }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", children: [
          /* @__PURE__ */ s.jsx(fe, { primary: !0, onClick: () => j(h), children: "Use in Compose" }),
          /* @__PURE__ */ s.jsx(
            fe,
            {
              onClick: () => p(
                (E) => E.some((A) => A.name === h.name) ? E : [...E, h].slice(0, 3)
              ),
              children: "Add compare"
            }
          )
        ] })
      ] }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Pick a row. Missing fields stay blank." }) }) }),
      b.length ? /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(se, { className: "dsc-glass", title: "Compare", icon: "analytics", children: [
        /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "Field" }),
            b.map((E) => /* @__PURE__ */ s.jsx("th", { children: E.name }, E.name))
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: y.map((E) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: E }),
            b.map((A) => /* @__PURE__ */ s.jsx("td", { children: A[E] != null && A[E] !== "" ? String(A[E]) : "—" }, A.name))
          ] }, E)) })
        ] }),
        /* @__PURE__ */ s.jsx(fe, { onClick: () => p([]), children: "Clear compare" })
      ] }) }) : null
    ] })
  ] });
}
function jb(a) {
  if (typeof a.lu == "number" && Number.isFinite(a.lu))
    return a.lu * 1e3;
  const r = a.last_changed || a.last_updated;
  if (r) {
    const o = Date.parse(r);
    return Number.isFinite(o) ? o : null;
  }
  return null;
}
function Sb(a) {
  const r = a.s ?? a.state, o = typeof r == "number" ? r : Number(r);
  return Number.isFinite(o) ? o : null;
}
function wb(a, r) {
  if (a.length <= r) return a;
  const o = [], u = (a.length - 1) / (r - 1);
  for (let f = 0; f < r; f++)
    o.push(a[Math.round(f * u)]);
  return o;
}
function Nb(a, r = 6, o = 96) {
  const { hass: u, callWS: f } = Te(), h = !!(u && (u.callWS || u.connection)), [m, b] = _.useState([]), [p, g] = _.useState(!0), [v, y] = _.useState(null);
  return _.useEffect(() => {
    let j = !1;
    async function E() {
      if (!a) {
        b([]), g(!1);
        return;
      }
      if (!h) {
        b([]), g(!1);
        return;
      }
      g(!0), y(null);
      const A = /* @__PURE__ */ new Date(), M = new Date(A.getTime() - r * 3600 * 1e3);
      try {
        const T = await f({
          type: "history/history_during_period",
          start_time: M.toISOString(),
          end_time: A.toISOString(),
          significant_changes_only: !1,
          minimal_response: !0,
          no_attributes: !0,
          entity_ids: [a]
        });
        if (j) return;
        if (T == null) {
          b([]), y("history unavailable");
          return;
        }
        let B = [];
        Array.isArray(T) ? B = T[0] || [] : T && typeof T == "object" && (B = T[a] || []);
        const X = [];
        for (const G of B) {
          const ne = jb(G), V = Sb(G);
          ne == null || V == null || X.push({ t: ne, v: V });
        }
        X.sort((G, ne) => G.t - ne.t), b(wb(X, o));
      } catch (T) {
        j || (y(T instanceof Error ? T.message : "history unavailable"), b([]));
      } finally {
        j || g(!1);
      }
    }
    return E(), () => {
      j = !0;
    };
  }, [h, a, r, o, f]), { points: m, loading: p, error: v };
}
function Be(a, r) {
  const o = r?.maxPoints ?? 96, u = r?.hours ?? 6, { num: f, available: h, tick: m } = Te(), { points: b } = Nb(a, u, o), [p, g] = _.useState([]), [v, y] = _.useState(void 0), j = _.useRef(null), E = _.useRef(!1);
  return _.useEffect(() => {
    E.current = !1, g([]), j.current = null, y(void 0);
  }, [a, u, o]), _.useEffect(() => {
    if (b.length && !E.current) {
      E.current = !0;
      const M = b[b.length - 1]?.v;
      Number.isFinite(M) && (j.current = M);
    }
  }, [b]), _.useEffect(() => {
    if (!a || !h(a)) return;
    const M = f(a);
    if (!Number.isFinite(M)) return;
    if (j.current === M && p.length > 0) {
      const B = Date.now(), X = p[p.length - 1]?.t ?? 0;
      if (B - X < 4e3) return;
    }
    j.current = M;
    const T = Date.now();
    g((B) => [...B, { t: T, v: M }].slice(-o)), y(T);
  }, [a, m, h, f, o]), { series: _.useMemo(() => {
    if (!b.length && !p.length) return p;
    if (!p.length) return b;
    if (!b.length) return p;
    const M = p[0]?.t ?? 0, B = [...b.filter((X) => X.t < M - 500), ...p];
    return B.length > o ? B.slice(-o) : B;
  }, [b, p, o]), lastSyncAt: v };
}
const gp = [1, 6, 24, 48], xp = "dsc_chart_hours";
function Eb() {
  try {
    const a = sessionStorage.getItem(xp), r = Number(a);
    if (gp.includes(r)) return r;
  } catch {
  }
  return 6;
}
function xc(a = 6) {
  const [r, o] = _.useState(() => Eb() || a), u = _.useCallback((h) => {
    o(h);
    try {
      sessionStorage.setItem(xp, String(h));
    } catch {
    }
  }, []), f = r <= 1 ? 60 : r <= 6 ? 96 : r <= 24 ? 144 : 192;
  return { hours: r, setHours: u, maxPoints: f };
}
const nc = [
  "var(--dsc-neon)",
  "var(--dsc-teal)",
  "var(--dsc-amber)",
  "var(--dsc-gray-5)"
];
function Om(a) {
  const r = Math.max(...a, 1), o = 10 ** Math.floor(Math.log10(r));
  return Math.ceil(r / o) * o;
}
function Dm(a, r = !1) {
  const o = Math.min(...a);
  if (r && o >= 0) return 0;
  const u = Math.abs(o) || 1, f = 10 ** Math.floor(Math.log10(u));
  return Math.floor(o / f) * f;
}
function Hm(a, r, o = 0.08) {
  if (!Number.isFinite(a) || !Number.isFinite(r)) return { min: 0, max: 1 };
  if (r <= a) return { min: a - 1, max: r + 1 };
  const f = (r - a) * o || 1;
  return { min: a - f, max: r + f };
}
function Mb(a, r, o, u, f, h, m, b) {
  if (!a.length) return "";
  const p = Math.max(h - f, 1e-6), g = Math.max(b - m, 1), v = r - u.l - u.r, y = o - u.t - u.b;
  return a.map((j, E) => {
    const A = u.l + (j.t - m) / g * v, M = u.t + (1 - (j.v - f) / p) * y;
    return `${E === 0 ? "M" : "L"}${A.toFixed(1)} ${M.toFixed(1)}`;
  }).join(" ");
}
function Lm(a) {
  const r = new Date(a), o = String(r.getHours()).padStart(2, "0"), u = String(r.getMinutes()).padStart(2, "0");
  return `${o}:${u}`;
}
function Ms(a, r, o, u, f) {
  const h = Math.max(o - r, 1e-6);
  return f.t + (1 - (a - r) / h) * (u - f.t - f.b);
}
function Um(a, r, o) {
  const u = a.filter((f) => (f.axis || "left") === r).flatMap((f) => f.series.map((h) => h.v));
  if (!u.length)
    return r === "right" ? { min: 0, max: 100 } : { min: 0, max: 1 };
  if (r === "right") {
    const f = Math.min(...u, 0);
    return Math.max(...u, 100) <= 100 && f >= 0 ? { min: 0, max: 100 } : Hm(Dm(u, !0), Om(u));
  }
  return Hm(Dm(u), Om(u));
}
function hn({
  series: a,
  height: r = 180,
  unit: o = "",
  live: u = !0,
  emptyLabel: f = "No history yet",
  lastSyncAt: h,
  targets: m = []
}) {
  const b = _.useId().replace(/:/g, ""), p = 640, g = a.some((R) => R.axis === "right"), v = { l: 40, r: g ? 40 : 14, t: 16, b: 28 }, y = _.useRef(null), [j, E] = _.useState(null), [A, M] = _.useState(!1), [T, B] = _.useState(0), X = _.useRef(void 0);
  _.useEffect(() => {
    h != null && X.current !== h && (X.current = h, B((R) => R + 1));
  }, [h]);
  const G = _.useMemo(() => {
    const R = a.flatMap((I) => I.series);
    if (!R.length) return null;
    const W = Um(a, "left"), ee = Um(a, "right"), C = Math.min(...R.map((I) => I.t)), Y = Math.max(...R.map((I) => I.t)), K = a.map((I, me) => {
      const w = I.axis || "left", L = w === "right" ? ee : W;
      return {
        ...I,
        axis: w,
        color: I.color || nc[me % nc.length],
        d: Mb(I.series, p, r, v, L.min, L.max, C, Y),
        last: I.series.length ? I.series[I.series.length - 1] : null,
        dom: L
      };
    });
    return { left: W, right: ee, t0: C, t1: Y, paths: K };
  }, [a, r, g]), ne = _.useMemo(() => {
    if (!G) return [];
    const R = 4, W = [];
    for (let ee = 0; ee <= R; ee++) {
      const C = ee / R, Y = G.left.max - C * (G.left.max - G.left.min), K = v.t + C * (r - v.t - v.b);
      W.push({ y: K, label: Y.toFixed(Math.abs(Y) >= 100 ? 0 : 1) });
    }
    return W;
  }, [G, r]), V = _.useMemo(() => {
    if (!G || !g) return [];
    const R = 4, W = [];
    for (let ee = 0; ee <= R; ee++) {
      const C = ee / R, Y = G.right.max - C * (G.right.max - G.right.min), K = v.t + C * (r - v.t - v.b);
      W.push({ y: K, label: Y.toFixed(Math.abs(Y) >= 100 ? 0 : 1) });
    }
    return W;
  }, [G, r, g]), P = _.useMemo(() => {
    if (!G) return [];
    const R = 5, W = [], ee = Math.max(G.t1 - G.t0, 1), C = p - v.l - v.r;
    for (let Y = 0; Y < R; Y++) {
      const K = Y / (R - 1), I = G.t0 + K * ee;
      W.push({ x: v.l + K * C, label: Lm(I) });
    }
    return W;
  }, [G]), F = _.useCallback(
    (R) => {
      const W = y.current;
      if (!W || !G) return null;
      const ee = W.getBoundingClientRect(), C = (R - ee.left) / Math.max(ee.width, 1) * p, Y = p - v.l - v.r, K = Math.min(p - v.r, Math.max(v.l, C)), I = (K - v.l) / Math.max(Y, 1);
      return { t: G.t0 + I * Math.max(G.t1 - G.t0, 1), x: K };
    },
    [G]
  ), ie = (R) => {
    if (A) return;
    const W = F(R.clientX);
    W && E(W);
  }, pe = () => {
    A || E(null);
  }, ae = (R) => {
    const W = F(R.clientX);
    if (W) {
      if (A && j && Math.abs(j.x - W.x) < 8) {
        M(!1), E(null);
        return;
      }
      M(!0), E(W);
    }
  }, re = _.useMemo(() => !G || !j ? [] : G.paths.map((R) => {
    if (!R.series.length) return { id: R.id, label: R.label, color: R.color, v: null, unit: R.unit || "" };
    let W = R.series[0], ee = Math.abs(W.t - j.t);
    for (const Y of R.series) {
      const K = Math.abs(Y.t - j.t);
      K < ee && (W = Y, ee = K);
    }
    const C = Ms(W.v, R.dom.min, R.dom.max, r, v);
    return {
      id: R.id,
      label: R.label,
      color: R.color,
      v: W.v,
      unit: R.unit || "",
      y: C,
      x: v.l + (W.t - G.t0) / Math.max(G.t1 - G.t0, 1) * (p - v.l - v.r)
    };
  }), [G, j, r]), de = G?.paths[0]?.last?.v ?? null;
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-chart", style: { position: "relative", width: "100%" }, children: [
    /* @__PURE__ */ s.jsxs(
      "svg",
      {
        ref: y,
        viewBox: `0 0 ${p} ${r}`,
        width: "100%",
        height: r,
        role: "img",
        "aria-label": "Live chart",
        className: "dsc-chart-svg",
        onPointerMove: ie,
        onPointerLeave: pe,
        onPointerDown: ae,
        children: [
          /* @__PURE__ */ s.jsxs("defs", { children: [
            G?.paths.map((R) => /* @__PURE__ */ s.jsxs("linearGradient", { id: `fill-${b}-${R.id}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ s.jsx("stop", { offset: "0%", stopColor: R.color, stopOpacity: "0.28" }),
              /* @__PURE__ */ s.jsx("stop", { offset: "100%", stopColor: R.color, stopOpacity: "0" })
            ] }, R.id)),
            /* @__PURE__ */ s.jsxs("filter", { id: `glow-${b}`, x: "-40%", y: "-40%", width: "180%", height: "180%", children: [
              /* @__PURE__ */ s.jsx("feGaussianBlur", { stdDeviation: "2.8", result: "b" }),
              /* @__PURE__ */ s.jsxs("feMerge", { children: [
                /* @__PURE__ */ s.jsx("feMergeNode", { in: "b" }),
                /* @__PURE__ */ s.jsx("feMergeNode", { in: "SourceGraphic" })
              ] })
            ] }),
            /* @__PURE__ */ s.jsxs("filter", { id: `glow-soft-${b}`, x: "-50%", y: "-50%", width: "200%", height: "200%", children: [
              /* @__PURE__ */ s.jsx("feGaussianBlur", { stdDeviation: "4.2", result: "b" }),
              /* @__PURE__ */ s.jsx("feMerge", { children: /* @__PURE__ */ s.jsx("feMergeNode", { in: "b" }) })
            ] })
          ] }),
          ne.map((R) => /* @__PURE__ */ s.jsxs("g", { children: [
            /* @__PURE__ */ s.jsx(
              "line",
              {
                x1: v.l,
                x2: p - v.r,
                y1: R.y,
                y2: R.y,
                stroke: "var(--dsc-gray-3)",
                strokeWidth: "1",
                strokeDasharray: "3 4"
              }
            ),
            /* @__PURE__ */ s.jsx(
              "text",
              {
                x: v.l - 6,
                y: R.y + 3,
                textAnchor: "end",
                fill: "var(--dsc-gray-5)",
                fontSize: "9",
                fontFamily: "var(--dsc-mono)",
                children: R.label
              }
            )
          ] }, `L${R.y}`)),
          V.map((R) => /* @__PURE__ */ s.jsx(
            "text",
            {
              x: p - v.r + 6,
              y: R.y + 3,
              textAnchor: "start",
              fill: "var(--dsc-teal)",
              fontSize: "9",
              fontFamily: "var(--dsc-mono)",
              opacity: 0.85,
              children: R.label
            },
            `R${R.y}`
          )),
          P.map((R) => /* @__PURE__ */ s.jsx(
            "text",
            {
              x: R.x,
              y: r - 8,
              textAnchor: "middle",
              fill: "var(--dsc-gray-5)",
              fontSize: "9",
              fontFamily: "var(--dsc-mono)",
              children: R.label
            },
            R.x
          )),
          G ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            m.map((R, W) => {
              const ee = R.axis || "left", C = ee === "right" ? G.right : G.left, Y = R.color || (ee === "right" ? "var(--dsc-teal)" : "var(--dsc-amber)");
              if (R.min != null && R.max != null) {
                const I = Ms(R.max, C.min, C.max, r, v), me = Ms(R.min, C.min, C.max, r, v);
                return /* @__PURE__ */ s.jsxs("g", { children: [
                  /* @__PURE__ */ s.jsx(
                    "rect",
                    {
                      x: v.l,
                      y: Math.min(I, me),
                      width: p - v.l - v.r,
                      height: Math.abs(me - I),
                      fill: Y,
                      opacity: 0.08
                    }
                  ),
                  /* @__PURE__ */ s.jsx(
                    "line",
                    {
                      x1: v.l,
                      x2: p - v.r,
                      y1: I,
                      y2: I,
                      stroke: Y,
                      strokeWidth: "1",
                      strokeDasharray: "4 4",
                      opacity: 0.7
                    }
                  ),
                  /* @__PURE__ */ s.jsx(
                    "line",
                    {
                      x1: v.l,
                      x2: p - v.r,
                      y1: me,
                      y2: me,
                      stroke: Y,
                      strokeWidth: "1",
                      strokeDasharray: "4 4",
                      opacity: 0.7
                    }
                  )
                ] }, `tg-${W}`);
              }
              if (R.value == null || !Number.isFinite(R.value)) return null;
              const K = Ms(R.value, C.min, C.max, r, v);
              return /* @__PURE__ */ s.jsxs("g", { children: [
                /* @__PURE__ */ s.jsx(
                  "line",
                  {
                    x1: v.l,
                    x2: p - v.r,
                    y1: K,
                    y2: K,
                    stroke: Y,
                    strokeWidth: "1.2",
                    strokeDasharray: "5 4",
                    opacity: 0.85
                  }
                ),
                R.label ? /* @__PURE__ */ s.jsx(
                  "text",
                  {
                    x: p - v.r - 2,
                    y: K - 4,
                    textAnchor: "end",
                    fill: Y,
                    fontSize: "8",
                    fontFamily: "var(--dsc-mono)",
                    children: R.label
                  }
                ) : null
              ] }, `tg-${W}`);
            }),
            G.paths.map((R) => {
              if (!R.d || R.series.length === 0) return null;
              const W = R.series.length >= 2 ? `${R.d} L${p - v.r} ${r - v.b} L${v.l} ${r - v.b} Z` : "", ee = R.last, C = ee && G ? v.l + (ee.t - G.t0) / Math.max(G.t1 - G.t0, 1) * (p - v.l - v.r) : 0, Y = ee ? Ms(ee.v, R.dom.min, R.dom.max, r, v) : 0;
              return /* @__PURE__ */ s.jsxs("g", { className: "dsc-chart-series", children: [
                W && !R.ghost ? /* @__PURE__ */ s.jsx("path", { d: W, fill: `url(#fill-${b}-${R.id})`, opacity: 0.9, className: "dsc-chart-fill" }) : null,
                R.ghost ? null : /* @__PURE__ */ s.jsx(
                  "path",
                  {
                    d: R.d,
                    fill: "none",
                    stroke: R.color,
                    strokeWidth: "4.5",
                    strokeLinejoin: "round",
                    strokeLinecap: "round",
                    filter: `url(#glow-soft-${b})`,
                    opacity: 0.35,
                    className: "dsc-chart-glow"
                  }
                ),
                /* @__PURE__ */ s.jsx(
                  "path",
                  {
                    d: R.d,
                    fill: "none",
                    stroke: R.color,
                    strokeWidth: R.ghost ? 1.6 : 2.2,
                    strokeLinejoin: "round",
                    strokeLinecap: "round",
                    strokeDasharray: R.ghost ? "5 4" : void 0,
                    filter: R.ghost ? void 0 : `url(#glow-${b})`,
                    opacity: R.ghost ? 0.55 : 0.95,
                    className: "dsc-chart-core"
                  }
                ),
                u && ee && R.series.length >= 2 && !R.ghost ? /* @__PURE__ */ s.jsxs("g", { className: "dsc-chart-pulse-wrap", children: [
                  /* @__PURE__ */ s.jsx(
                    "path",
                    {
                      className: "dsc-chart-pulse",
                      d: R.d,
                      fill: "none",
                      stroke: R.color,
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
                      cx: C,
                      cy: Y,
                      r: 4,
                      fill: R.color,
                      className: "dsc-chart-tip",
                      filter: `url(#glow-${b})`
                    }
                  )
                ] }, `pulse-${T}-${R.id}`) : ee ? /* @__PURE__ */ s.jsx("circle", { cx: C, cy: Y, r: 3.2, fill: R.color, opacity: 0.9 }) : null
              ] }, R.id);
            }),
            j ? /* @__PURE__ */ s.jsxs("g", { className: "dsc-chart-crosshair", children: [
              /* @__PURE__ */ s.jsx(
                "line",
                {
                  x1: j.x,
                  x2: j.x,
                  y1: v.t,
                  y2: r - v.b,
                  stroke: "var(--dsc-white)",
                  strokeOpacity: 0.35,
                  strokeWidth: "1"
                }
              ),
              re.map(
                (R) => R.v == null || R.y == null ? null : /* @__PURE__ */ s.jsx(
                  "circle",
                  {
                    cx: R.x ?? j.x,
                    cy: R.y,
                    r: 4,
                    fill: R.color,
                    stroke: "var(--dsc-black)",
                    strokeWidth: "1"
                  },
                  R.id
                )
              )
            ] }) : null
          ] }) : /* @__PURE__ */ s.jsx(
            "text",
            {
              x: p / 2,
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
    j && G ? /* @__PURE__ */ s.jsxs(
      "div",
      {
        className: "dsc-chart-tooltip",
        style: {
          left: `${Math.min(92, Math.max(8, j.x / p * 100))}%`
        },
        children: [
          /* @__PURE__ */ s.jsx("div", { className: "dsc-chart-tooltip-time", children: Lm(j.t) }),
          re.map(
            (R) => R.v == null ? null : /* @__PURE__ */ s.jsxs("div", { className: "dsc-chart-tooltip-row", children: [
              /* @__PURE__ */ s.jsx("i", { style: { background: R.color } }),
              /* @__PURE__ */ s.jsxs("span", { children: [
                R.label || R.id,
                " ",
                R.v.toFixed(R.v >= 100 ? 0 : 1),
                R.unit ? ` ${R.unit}` : ""
              ] })
            ] }, R.id)
          )
        ]
      }
    ) : null,
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chart-legend", children: [
      a.filter((R) => R.label).map((R, W) => /* @__PURE__ */ s.jsxs("span", { className: "dsc-chart-legend-item", children: [
        /* @__PURE__ */ s.jsx("i", { style: { background: R.color || nc[W % nc.length] } }),
        R.label
      ] }, R.id)),
      de != null ? /* @__PURE__ */ s.jsxs("span", { className: "dsc-chart-last", children: [
        de.toFixed(1),
        o ? ` ${o}` : a[0]?.unit ? ` ${a[0].unit}` : ""
      ] }) : null
    ] })
  ] });
}
function Cb(a, r = 280) {
  const [o, u] = _.useState(a);
  return _.useEffect(() => {
    if (!Number.isFinite(a)) {
      u(a);
      return;
    }
    const f = Number.isFinite(o) ? o : a, h = performance.now();
    let m = 0;
    const b = (p) => {
      const g = Math.min(1, (p - h) / r), v = 1 - (1 - g) ** 3;
      u(f + (a - f) * v), g < 1 && (m = requestAnimationFrame(b));
    };
    return m = requestAnimationFrame(b), () => cancelAnimationFrame(m);
  }, [a, r]), o;
}
function Bm(a, r, o, u) {
  return { x: a + o * Math.cos(u), y: r + o * Math.sin(u) };
}
function yt({
  value: a,
  min: r = 0,
  max: o = 100,
  label: u,
  unit: f = "",
  target: h,
  band: m,
  extrema: b,
  stale: p,
  onClick: g
}) {
  const v = Number.isFinite(a) ? a : NaN, y = Cb(Number.isFinite(v) ? v : r), j = Number.isFinite(v) ? y : r, E = Math.min(o, Math.max(r, j)), A = Math.max(o - r, 1e-6), M = Number.isFinite(v) ? (E - r) / A : 0, T = 46, B = 2 * Math.PI * T * 0.75, X = B * M, G = (ie) => {
    const pe = Math.min(1, Math.max(0, (ie - r) / A));
    return Math.PI - pe * Math.PI;
  }, ne = m && Number.isFinite(v) ? v >= m.min && v <= m.max : !0, V = Number.isFinite(v) ? p ? "var(--dsc-amber)" : ne ? "var(--dsc-teal)" : "var(--dsc-amber)" : "var(--dsc-gray-4)", P = [];
  m && P.push({ v: m.min, kind: "band" }, { v: m.max, kind: "band" }), b?.min != null && P.push({ v: b.min, kind: "ext" }), b?.max != null && P.push({ v: b.max, kind: "ext" }), h != null && Number.isFinite(h) && P.push({ v: h, kind: "target" });
  const F = /* @__PURE__ */ s.jsxs(
    "div",
    {
      className: `dsc-gauge${!ne && Number.isFinite(v) ? " is-warn" : ""}${p ? " is-stale" : ""}${g ? " is-clickable" : ""}`,
      children: [
        /* @__PURE__ */ s.jsxs("svg", { viewBox: "0 0 120 90", width: "140", height: "105", "aria-label": u, children: [
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
              stroke: V,
              strokeWidth: "10",
              strokeLinecap: "round",
              strokeDasharray: `${X} ${B}`,
              filter: "url(#dsc-gauge-glow)",
              style: { transition: "stroke-dasharray 220ms ease, stroke 220ms ease" }
            }
          ),
          P.map((ie, pe) => {
            const ae = G(ie.v), re = Bm(60, 72, ie.kind === "ext" ? T - 2 : T + 1, ae), de = Bm(60, 72, T - (ie.kind === "target" ? 14 : 10), ae), R = ie.kind === "target" ? "var(--dsc-teal)" : ie.kind === "band" ? "var(--dsc-amber)" : "var(--dsc-gray-5)";
            return /* @__PURE__ */ s.jsx(
              "line",
              {
                x1: de.x,
                y1: de.y,
                x2: re.x,
                y2: re.y,
                stroke: R,
                strokeWidth: ie.kind === "target" ? 2.4 : 1.6,
                strokeLinecap: "round",
                opacity: ie.kind === "ext" ? 0.65 : 0.95
              },
              `${ie.kind}-${pe}`
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
              children: Number.isFinite(v) ? v.toFixed(v >= 100 ? 0 : v < 10 ? 2 : 1) : "—"
            }
          ),
          /* @__PURE__ */ s.jsx("text", { x: "60", y: "74", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: p ? "HELD" : f })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-gauge-label", children: u })
      ]
    }
  );
  return g ? /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-gauge-hit", onClick: g, title: `History · ${u}`, children: F }) : F;
}
function rl({
  series: a,
  color: r = "var(--dsc-blue)",
  width: o = 120,
  height: u = 28
}) {
  if (a.length < 2)
    return /* @__PURE__ */ s.jsx("div", { className: "dsc-sparkline dsc-muted", style: { width: o, height: u } });
  const f = a.map((j) => j.v), h = Math.min(...f), m = Math.max(...f), b = Math.max(m - h, 1e-6), p = a[0].t, g = a[a.length - 1].t, v = Math.max(g - p, 1), y = a.map((j, E) => {
    const A = (j.t - p) / v * o, M = u - (j.v - h) / b * (u - 4) - 2;
    return `${E === 0 ? "M" : "L"}${A.toFixed(1)} ${M.toFixed(1)}`;
  }).join(" ");
  return /* @__PURE__ */ s.jsx("svg", { className: "dsc-sparkline", width: o, height: u, "aria-hidden": !0, children: /* @__PURE__ */ s.jsx("path", { d: y, fill: "none", stroke: r, strokeWidth: "1.6", strokeLinecap: "round" }) });
}
function bp({
  rows: a
}) {
  return /* @__PURE__ */ s.jsx("div", { className: "dsc-gotwant", children: a.map((r) => {
    const o = r.want != null ? r.want : r.wantMin != null && r.wantMax != null ? (r.wantMin + r.wantMax) / 2 : NaN, u = Math.max(
      Number.isFinite(r.got) ? r.got : 0,
      Number.isFinite(o) ? o : 0,
      r.wantMax ?? 0,
      1
    ), f = Number.isFinite(r.got) ? r.got / u * 100 : 0, h = Number.isFinite(o) ? o / u * 100 : 0;
    return /* @__PURE__ */ s.jsxs("div", { className: "dsc-gotwant-row", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-gotwant-label", children: r.label }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-gotwant-track", children: [
        Number.isFinite(o) ? /* @__PURE__ */ s.jsx("div", { className: "dsc-gotwant-want", style: { width: `${h}%` } }) : null,
        /* @__PURE__ */ s.jsx("div", { className: "dsc-gotwant-got", style: { width: `${f}%` } })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-gotwant-vals", children: [
        /* @__PURE__ */ s.jsxs("span", { children: [
          "Got ",
          Number.isFinite(r.got) ? r.got.toFixed(1) : "—",
          r.unit || ""
        ] }),
        /* @__PURE__ */ s.jsxs("span", { className: "dsc-muted", children: [
          "Want",
          " ",
          r.wantMin != null && r.wantMax != null ? `${r.wantMin}–${r.wantMax}` : Number.isFinite(o) ? o.toFixed(1) : "—"
        ] })
      ] })
    ] }, r.label);
  }) });
}
function dc(a) {
  if (!a.length) return {};
  let r = a[0].v, o = a[0].v;
  for (const u of a)
    u.v < r && (r = u.v), u.v > o && (o = u.v);
  return { min: r, max: o };
}
const yp = [
  { label: "Cycle", hours: 12 },
  { label: "Photo", hours: 18 }
];
function oo({
  hours: a,
  setHours: r,
  extras: o
}) {
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-timespan", role: "group", "aria-label": "Chart timespan", children: [
    gp.map((u) => /* @__PURE__ */ s.jsxs(
      "button",
      {
        type: "button",
        className: `dsc-chip${a === u ? " dsc-chip--ok" : ""}`,
        onClick: () => r(u),
        children: [
          u,
          "h"
        ]
      },
      u
    )),
    (o || []).map((u) => /* @__PURE__ */ s.jsx(
      "button",
      {
        type: "button",
        className: `dsc-chip${a === u.hours ? " dsc-chip--ok" : ""}`,
        onClick: () => r(u.hours),
        children: u.label
      },
      u.label
    ))
  ] });
}
function fo({
  open: a,
  onClose: r,
  entityId: o,
  label: u,
  unit: f = "",
  color: h = "var(--dsc-blue)"
}) {
  const { hours: m, setHours: b, maxPoints: p } = xc(6), g = Be(o || "", { hours: m, maxPoints: p }), v = !o || g.series.length < 2;
  return /* @__PURE__ */ s.jsxs(
    Os,
    {
      open: a && !!o,
      onClose: r,
      title: u ? `History · ${u}` : "History",
      children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: [
          /* @__PURE__ */ s.jsx(
            oo,
            {
              hours: m,
              setHours: b,
              extras: [
                { label: "cycle", hours: 18 },
                { label: "photo 12", hours: 12 }
              ]
            }
          ),
          v ? /* @__PURE__ */ s.jsx(Q, { label: "Thin recorder", tone: "warn" }) : null
        ] }),
        o ? /* @__PURE__ */ s.jsx(
          hn,
          {
            live: !0,
            unit: f,
            lastSyncAt: g.lastSyncAt,
            series: [
              {
                id: o,
                label: u,
                series: g.series,
                color: h,
                unit: f
              }
            ]
          }
        ) : null,
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 10, fontSize: 12 }, children: o })
      ]
    }
  );
}
const _p = "sensor.dsc_hub_uptime", jp = "sensor.dsc_hub_heartbeat";
function nt(a) {
  const { num: r, available: o, tick: u, entity: f } = Te(), h = _.useRef(null), [, m] = _.useState(0), b = !o(_p) || !o(jp), p = o(a), g = r(a);
  return _.useEffect(() => {
    if (p && Number.isFinite(g)) {
      if (b && g === 0 && h.current != null) {
        m((v) => v + 1);
        return;
      }
      h.current = { value: g, at: Date.now() }, m((v) => v + 1);
      return;
    }
    m((v) => v + 1);
  }, [a, p, g, b, u, f]), p && Number.isFinite(g) && !(b && g === 0 && h.current != null) ? { value: g, stale: !1, heldAt: h.current?.at, live: !0 } : h.current != null ? {
    value: h.current.value,
    stale: !0,
    heldAt: h.current.at,
    live: !1
  } : { value: NaN, stale: !p, heldAt: void 0, live: !1 };
}
function ho(a) {
  const { available: r, entity: o, tick: u } = Te();
  if (r(a)) return null;
  const f = o(a)?.last_changed;
  if (!f) return null;
  const h = Date.parse(f);
  return Number.isFinite(h) ? Date.now() - h : null;
}
function kb() {
  return ho(_p);
}
function Tb() {
  return ho(jp);
}
function Ab() {
  return ho("binary_sensor.dsc_hub_panel_link");
}
function Rb({ pot: a }) {
  const { available: r, state: o, num: u } = Te(), f = o(`sensor.dsc_pot${a}_expected_stage`, "—"), h = o(`sensor.dsc_pot${a}_days_since_sprout`, "—"), m = o(`sensor.dsc_pot${a}_need_summary`, "—"), b = o(`binary_sensor.dsc_pot${a}_untrusted`) === "on", p = u(`sensor.dsc_pot${a}_dryback_pct`), g = o(`input_select.dsc_pot${a}_tent`, "unassigned"), v = g === "clone" ? o("light.dsc_hub_sf1000_dimmer") === "on" : o("binary_sensor.dsc_hub_4x8_window_open") === "on", y = g === "clone" || g === "main" ? v : !1, j = Number.isFinite(p) && p > 55 ? "dryback stress" : m !== "—" && m !== "ok" ? "Need" : "calm";
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-plant-extra", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
      /* @__PURE__ */ s.jsx(Q, { label: y ? "Awake" : "Asleep", tone: y ? "ok" : "muted" }),
      /* @__PURE__ */ s.jsx(Q, { label: `Day ${h}`, tone: "muted" }),
      /* @__PURE__ */ s.jsx(Q, { label: f === "—" ? "No stage Got" : f, tone: f === "—" ? "muted" : "ok" }),
      /* @__PURE__ */ s.jsx(
        Q,
        {
          label: b ? "Need blocked (untrusted)" : j,
          tone: b ? "warn" : j === "calm" ? "ok" : "warn"
        }
      )
    ] }),
    r(`sensor.dsc_pot${a}_expected_stage`) ? null : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: "No cultivar mesh. Missing fields stay empty." })
  ] });
}
function bc({
  pot: a,
  onSelectPot: r
}) {
  const { hass: o, state: u, entity: f, callService: h, available: m, tick: b, num: p } = Te(), g = ft(), v = Ca(a, { state: u, entity: f }), [y, j] = _.useState(v.plantName === "—" ? "" : v.plantName), [E, A] = _.useState(v.sprout === "—" ? "" : v.sprout), [M, T] = _.useState(v.growthStage === "—" ? "" : v.growthStage), [B, X] = _.useState(v.notes === "—" ? "" : v.notes), [G, ne] = _.useState(null), [V, P] = _.useState(null);
  _.useEffect(() => {
    j(v.plantName === "—" ? "" : v.plantName), A(v.sprout === "—" ? "" : v.sprout), T(v.growthStage === "—" ? "" : v.growthStage), X(v.notes === "—" ? "" : v.notes), ne(null);
  }, [a]);
  const F = ol(a, "moisture", u), ie = ol(a, "ec", u), pe = ol(a, "ph", u), ae = `sensor.dsc_pot${a}_dryback_pct`, re = nt(F), de = nt(ae), R = Be(F, { hours: 6, maxPoints: 72 }), W = Be(ie, { hours: 6, maxPoints: 72 }), ee = p(`input_number.dsc_pot${a}_learned_ec_per_moisture`), C = m(`input_number.dsc_pot${a}_learned_ec_per_moisture`) && Number.isFinite(ee) && ee !== 0 ? ee : NaN, Y = m(`sensor.dsc_pot${a}_want_moisture_min`) ? p(`sensor.dsc_pot${a}_want_moisture_min`) : p(`number.dsc_pot${a}_want_moisture_min`), K = m(`sensor.dsc_pot${a}_want_moisture_max`) ? p(`sensor.dsc_pot${a}_want_moisture_max`) : p(`number.dsc_pot${a}_want_moisture_max`), I = p(`sensor.dsc_pot${a}_want_ec_min`), me = p(`sensor.dsc_pot${a}_want_ec_max`), w = p(`sensor.dsc_pot${a}_want_ph_min`), L = p(`sensor.dsc_pot${a}_want_ph_max`), Z = Number.isFinite(Y) && Number.isFinite(K) && (m(`sensor.dsc_pot${a}_want_moisture_min`) || m(`number.dsc_pot${a}_want_moisture_min`)), J = Number.isFinite(I) && Number.isFinite(me), ce = Number.isFinite(w) && Number.isFinite(L), he = !v.strainDisplay || v.strainDisplay === "—" || /generic/i.test(v.strainDisplay), ge = async (ye) => {
    ne(null);
    try {
      await h("input_select", "select_option", {
        entity_id: `input_select.dsc_pot${a}_tent`,
        option: ye
      }), window.setTimeout(() => {
        (o?.states?.[`input_select.dsc_pot${a}_tent`]?.state || "") !== ye && ne("Tent apply failed — check helper options (clone|main|unassigned).");
      }, 400);
    } catch {
      ne("Tent apply failed — check helper options (clone|main|unassigned).");
    }
  }, Ke = () => {
    m(`text.dsc_pot${a}_plant_name`) && h("text", "set_value", {
      entity_id: `text.dsc_pot${a}_plant_name`,
      value: y
    });
  }, Ae = () => {
    const ye = `datetime.dsc_pot${a}_sprout_date`;
    if (!m(ye) || !E) return;
    const gt = E.length === 10 ? `${E}T00:00:00` : E;
    h("datetime", "set_value", { entity_id: ye, datetime: gt });
  }, tn = () => {
    if (v.rosterSlot == null) return;
    const ye = `input_text.dsc_plant_roster_${v.rosterSlot}_notes`;
    !m(ye) && f(ye), h("input_text", "set_value", { entity_id: ye, value: B });
  }, Tt = f(`select.dsc_pot${a}_growth_stage`)?.attributes?.options || [];
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-seat-panel", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 14 }, children: [
      Ds(u).map((ye) => /* @__PURE__ */ s.jsxs(
        "button",
        {
          type: "button",
          className: `dsc-chip${ye === a ? " dsc-chip--ok" : ""}`,
          onClick: () => r?.(ye),
          children: [
            /* @__PURE__ */ s.jsx(dl, { spec: wa(ye, u, f), size: 16 }),
            " P",
            ye
          ]
        },
        ye
      )),
      /* @__PURE__ */ s.jsx(Q, { label: co(v.tent), tone: v.tent === "unassigned" ? "muted" : "ok" }),
      v.rosterSlot != null ? /* @__PURE__ */ s.jsx(Q, { label: `Roster #${v.rosterSlot}`, tone: "muted" }) : /* @__PURE__ */ s.jsx(Q, { label: "No roster join", tone: "warn" }),
      re.stale ? /* @__PURE__ */ s.jsx(Q, { label: "HELD Got", tone: "warn" }) : null
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-seat-layout", children: [
      /* @__PURE__ */ s.jsxs(se, { className: "dsc-glass dsc-glass--glow", title: "Medium", children: [
        /* @__PURE__ */ s.jsx(nb, { layers: v.layers, spec: wa(a, u, f) }),
        /* @__PURE__ */ s.jsx(Rb, { pot: a }),
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 10, fontSize: 12 }, children: v.blend || "Blend lives on roster after commit — not invented here." })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", style: { gap: 14 }, children: [
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(se, { className: "dsc-glass", title: "Identity", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-seat-editors", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "Nickname",
            /* @__PURE__ */ s.jsx(
              "input",
              {
                value: y,
                onChange: (ye) => j(ye.target.value),
                onBlur: Ke,
                disabled: !m(`text.dsc_pot${a}_plant_name`)
              }
            )
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "Sprout date",
            /* @__PURE__ */ s.jsx(
              "input",
              {
                type: "date",
                value: E.slice(0, 10),
                onChange: (ye) => A(ye.target.value),
                onBlur: Ae,
                disabled: !m(`datetime.dsc_pot${a}_sprout_date`)
              }
            )
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "Growth stage",
            /* @__PURE__ */ s.jsxs(
              "select",
              {
                value: M,
                onChange: (ye) => {
                  const gt = ye.target.value;
                  if (T(gt), !gt) return;
                  const at = `select.dsc_pot${a}_growth_stage`;
                  m(at) && h("select", "select_option", { entity_id: at, option: gt });
                },
                disabled: !m(`select.dsc_pot${a}_growth_stage`),
                children: [
                  /* @__PURE__ */ s.jsx("option", { value: "", children: "—" }),
                  Tt.map((ye) => /* @__PURE__ */ s.jsx("option", { value: ye, children: ye }, ye))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
            /* @__PURE__ */ s.jsx(Q, { label: `Day ${v.days}`, tone: "ok" }),
            /* @__PURE__ */ s.jsx(Q, { label: v.stage, tone: "muted" }),
            /* @__PURE__ */ s.jsx(Q, { label: v.strainDisplay, tone: "muted" })
          ] }),
          /* @__PURE__ */ s.jsx(
            gc,
            {
              items: [
                {
                  id: "compose",
                  label: "Open Compose (strain/catalog)",
                  onSelect: () => g("/grow/compose")
                },
                {
                  id: "root",
                  label: "Root zone",
                  onSelect: () => g("/live/root")
                },
                {
                  id: "twin",
                  label: "Open Twin",
                  onSelect: () => g("/live/twin")
                }
              ]
            }
          )
        ] }) }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(se, { className: "dsc-glass", title: "Want · Got · Need", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
            /* @__PURE__ */ s.jsx(
              Q,
              {
                label: `Got M ${re.stale ? `${Number.isFinite(re.value) ? re.value.toFixed(0) : "—"}*` : v.moisture}`,
                tone: re.stale ? "warn" : "ok"
              }
            ),
            /* @__PURE__ */ s.jsx(Q, { label: `EC ${v.ec}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(Q, { label: `pH ${v.ph}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(
              Q,
              {
                label: v.need,
                tone: v.need !== "—" && v.need !== "OK" ? "warn" : "ok"
              }
            )
          ] }),
          Z && !he ? /* @__PURE__ */ s.jsx(
            bp,
            {
              rows: [
                {
                  label: "Moisture",
                  got: Number(v.moisture),
                  wantMin: Y,
                  wantMax: K,
                  unit: "%"
                },
                {
                  label: "EC",
                  got: Number(v.ec),
                  wantMin: J ? I : void 0,
                  wantMax: J ? me : void 0
                },
                {
                  label: "pH",
                  got: Number(v.ph),
                  wantMin: ce ? w : void 0,
                  wantMax: ce ? L : void 0
                }
              ]
            }
          ) : /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", style: { margin: "8px 0 0" }, children: [
            /* @__PURE__ */ s.jsx(Q, { label: "No catalog Want", tone: "warn" }),
            " ",
            he ? "Generic / empty strain — Want bands not invented." : "Custom Want helpers missing — Got + Need only."
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "dsc-kpi-sub", children: "Need is derived (catalog vs Got), not a feed invent." })
        ] }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(se, { className: "dsc-glass", title: "Dryback", children: /* @__PURE__ */ s.jsx(
          yt,
          {
            label: "Dryback",
            value: de.value,
            min: 0,
            max: 100,
            unit: "%",
            stale: de.stale,
            band: { min: 0, max: 45 },
            onClick: () => P({ id: ae, label: "Dryback", unit: "%" })
          }
        ) }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(se, { className: "dsc-glass", title: "Got history", children: [
          /* @__PURE__ */ s.jsx(
            hn,
            {
              live: !0,
              lastSyncAt: Math.max(R.lastSyncAt ?? 0, W.lastSyncAt ?? 0) || void 0,
              series: [
                {
                  id: "m",
                  label: "Moisture",
                  series: R.series,
                  color: "var(--dsc-blue)",
                  axis: "left",
                  unit: "%"
                },
                {
                  id: "ec",
                  label: "EC",
                  series: W.series,
                  color: "var(--dsc-amber)",
                  axis: "right",
                  unit: ""
                }
              ]
            }
          ),
          /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: Number.isFinite(C) ? `EC consumption honesty: learned ${C.toFixed(3)} EC per moisture (not feed invent).` : "EC over time shown — no learned_ec_per_moisture yet (not invented)." }),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginTop: 8 }, children: [
            /* @__PURE__ */ s.jsx(fe, { onClick: () => P({ id: F, label: "Moisture", unit: "%" }), children: "Moisture hist" }),
            /* @__PURE__ */ s.jsx(fe, { onClick: () => P({ id: ie, label: "EC", unit: "" }), children: "EC hist" }),
            /* @__PURE__ */ s.jsx(fe, { onClick: () => P({ id: pe, label: "pH", unit: "" }), children: "pH hist" })
          ] })
        ] }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(se, { className: "dsc-glass", title: "Nutrition", children: [
          /* @__PURE__ */ s.jsx("p", { style: { margin: "0 0 6px" }, children: v.recipe || "No roster recipe — catalog doses only, never invented." }),
          /* @__PURE__ */ s.jsxs("label", { className: "dsc-seat-editors", children: [
            "Roster notes",
            /* @__PURE__ */ s.jsx(
              "textarea",
              {
                rows: 3,
                value: B,
                onChange: (ye) => X(ye.target.value),
                onBlur: tn,
                disabled: v.rosterSlot == null
              }
            )
          ] }),
          /* @__PURE__ */ s.jsx("div", { style: { marginTop: 10 }, children: /* @__PURE__ */ s.jsx(Ts, { to: "/grow/compose", children: /* @__PURE__ */ s.jsx(fe, { teal: !0, children: "Mix in Compose" }) }) })
        ] }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(se, { className: "dsc-glass", title: "Live Got chips", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
            /* @__PURE__ */ s.jsx(Q, { label: `M ${v.moisture}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(Q, { label: `T ${v.soilTemp}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(Q, { label: `EC ${v.ec}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(Q, { label: `pH ${v.ph}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(Q, { label: `N ${v.n}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(Q, { label: `P ${v.p}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(Q, { label: `K ${v.k}`, tone: "muted" })
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: "NPK = trend indicators. Unavailable stays —. Held shows last good on blip." })
        ] }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(se, { className: "dsc-glass", title: "Apply to tent", children: [
          /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "Digital-twin placement. Moves the plant on Twin; does not rewrite climate Want." }),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-seat-actions", children: [
            /* @__PURE__ */ s.jsx(fe, { primary: v.tent === "clone", onClick: () => void ge("clone"), children: "Clone 2×4" }),
            /* @__PURE__ */ s.jsx(fe, { primary: v.tent === "main", onClick: () => void ge("main"), children: "Main 4×8" }),
            /* @__PURE__ */ s.jsx(fe, { onClick: () => void ge("unassigned"), children: "Unassigned" }),
            /* @__PURE__ */ s.jsx(Ts, { to: "/live/twin", children: /* @__PURE__ */ s.jsx(fe, { children: "Open Twin" }) })
          ] }),
          G ? /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
            /* @__PURE__ */ s.jsx(Q, { label: "Tent apply failed", tone: "bad" }),
            " ",
            G
          ] }) : null
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ s.jsx(
      fo,
      {
        open: V != null,
        onClose: () => P(null),
        entityId: V?.id ?? null,
        label: V?.label ?? "",
        unit: V?.unit
      }
    )
  ] });
}
function zb() {
  const a = ft();
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      $t,
      {
        icon: "compose",
        title: "Compose",
        subtitle: "Build soil blend, roster commit, and Want handoff.",
        primaryAction: /* @__PURE__ */ s.jsx(fe, { teal: !0, onClick: () => a("/grow/roster"), children: "Open Roster / Seat" }),
        actions: /* @__PURE__ */ s.jsx(fe, { primary: !0, onClick: () => a("/grow/research"), children: "Browse Catalog" })
      }
    ),
    /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Densified catalog traits (height / flowering / chem) show when the index has them. Empty catalog fields stay empty — Compose does not invent Want bands or strain genetics. After commit, open Roster to assign a seat." }),
    /* @__PURE__ */ s.jsx(bb, {})
  ] });
}
function Ob() {
  const a = ft();
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      $t,
      {
        icon: "research",
        title: "Research",
        subtitle: "Catalog browser over /local/dsc-catalog indexes.",
        actions: /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(fe, { primary: !0, onClick: () => a("/grow/compose"), children: "Use in Compose" }),
          /* @__PURE__ */ s.jsx(fe, { teal: !0, onClick: () => a("/grow/roster"), children: "Open Seat" })
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Catalog gaps are honesty, not placeholders. Height / flowering / chem chips come from densified indexes when present. Use in Compose to draft a plant; Open Seat to assign an existing roster row — neither invents missing Want/Got." }),
    /* @__PURE__ */ s.jsx(_b, {})
  ] });
}
function Db() {
  const { entity: a, state: r, tick: o } = Te(), [u, f] = vc(), h = ab(a), m = Number(u.get("pot") || 0), b = m >= 1 && m <= 4 && Gt(m, r) ? m : null, p = (v) => {
    if (!Gt(v, r)) return;
    const y = new URLSearchParams(u);
    y.set("pot", String(v)), f(y, { replace: !0 });
  }, g = () => {
    const v = new URLSearchParams(u);
    v.delete("pot"), f(v, { replace: !0 });
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      $t,
      {
        icon: "roster",
        title: "Roster",
        subtitle: "Seats — open a row for Plant Seat drawer. Nutrient mix lives in Compose.",
        primaryAction: /* @__PURE__ */ s.jsx(Ts, { to: "/grow/compose", children: /* @__PURE__ */ s.jsx(fe, { primary: !0, children: "Use in Compose" }) })
      }
    ),
    /* @__PURE__ */ s.jsx(se, { className: "dsc-glass", title: "Roster", icon: "roster", children: h.length ? /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", children: [
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
        const y = Number(v.pot), j = y >= 1 && y <= 4, E = j && Gt(y, r), A = j ? co(io(r, y)) : "—", M = j ? r(`sensor.dsc_pot${y}_need_summary`, "—") : "—", T = j ? wa(y, r, a) : null;
        return /* @__PURE__ */ s.jsxs(
          "tr",
          {
            onClick: () => {
              E && p(y);
            },
            style: E ? { cursor: "pointer" } : void 0,
            children: [
              /* @__PURE__ */ s.jsxs("td", { children: [
                "#",
                v.slot
              ] }),
              /* @__PURE__ */ s.jsx("td", { children: v.nickname || "—" }),
              /* @__PURE__ */ s.jsx("td", { children: v.strain || "—" }),
              /* @__PURE__ */ s.jsx("td", { children: v.status || "—" }),
              /* @__PURE__ */ s.jsx("td", { children: j ? /* @__PURE__ */ s.jsxs("span", { className: "dsc-chip-row", children: [
                T ? /* @__PURE__ */ s.jsx(dl, { spec: T, size: 22 }) : null,
                "P",
                y,
                E ? null : /* @__PURE__ */ s.jsx(Q, { label: "OOS", tone: "warn" })
              ] }) : "—" }),
              /* @__PURE__ */ s.jsx("td", { children: M }),
              /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx(Q, { label: A, tone: "muted" }) })
            ]
          },
          v.slot
        );
      }) })
    ] }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "No plants in roster yet. Commit from Compose, then assign a pot." }) }),
    /* @__PURE__ */ s.jsx(
      Os,
      {
        open: b != null,
        onClose: g,
        title: b != null ? `Plant seat · POT${b}` : "Plant seat",
        children: b != null ? /* @__PURE__ */ s.jsx(bc, { pot: b, onSelectPot: p }) : null
      }
    )
  ] });
}
function Hb() {
  const [a, r] = _.useState(null), o = ft(), u = vt();
  _.useEffect(() => {
    const m = (b) => {
      const p = b.detail, g = Number(p?.pot);
      g >= 1 && g <= 4 && r(g);
    };
    return window.addEventListener("dsc-dash-select-pot", m), () => window.removeEventListener("dsc-dash-select-pot", m);
  }, []);
  const f = _.useCallback(() => r(null), []);
  return /* @__PURE__ */ s.jsx(
    en,
    {
      open: a != null,
      onDismiss: f,
      title: a != null ? `Plant seat · POT${a}` : "Plant seat",
      help: null,
      children: a != null ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx(bc, { pot: a, onSelectPot: r }),
        u.pathname !== "/live/root" ? /* @__PURE__ */ s.jsx("div", { className: "dsc-row-actions", style: { marginTop: 12 }, children: /* @__PURE__ */ s.jsx(
          fe,
          {
            teal: !0,
            onClick: () => {
              const m = a;
              f(), o(`/live/root?pot=${m}`);
            },
            children: "Open Root"
          }
        ) }) : null
      ] }) : null
    }
  );
}
const Sp = _.createContext(null);
function Lb(a) {
  return a === "clone" || a === "compare" || a === "room" || a === "main" ? a : "main";
}
function Ub({ children: a }) {
  const [r, o] = vc(), u = Lb(r.get("tent") ?? r.get("zone")), f = _.useCallback(
    (m) => {
      const b = new URLSearchParams(r);
      b.set("tent", m), b.delete("zone"), o(b, { replace: !0 });
    },
    [r, o]
  ), h = _.useMemo(() => ({ focus: u, setFocus: f }), [u, f]);
  return /* @__PURE__ */ s.jsx(Sp.Provider, { value: h, children: a });
}
function wp() {
  const a = _.useContext(Sp);
  return a || {
    focus: "main",
    setFocus: () => {
    }
  };
}
function rc(a) {
  if (!Number.isFinite(a) || a < 0) return "—";
  const r = Math.floor(a / 1e3);
  if (r < 60) return `${Math.max(1, r)}S`;
  const o = Math.floor(r / 60);
  if (o < 60) return `${o}M`;
  const u = Math.floor(o / 60), f = o % 60;
  return u < 48 ? f > 0 ? `${u}H ${f}M` : `${u}H` : `${(u / 24).toFixed(1)}D`;
}
function Bb(a) {
  return !Number.isFinite(a) || a <= 0 ? "—" : rc(a * 1e3);
}
function Np() {
  const { available: a, state: r } = Te(), o = r("binary_sensor.dsc_hub_link") === "on", u = a("binary_sensor.dsc_hub_link"), f = r("sensor.dsc_hub_api_down_age", "—"), h = r("sensor.dsc_hub_link_recovery_bounces", "—"), m = r("sensor.dsc_hub_rf_status", "—"), b = r("sensor.dsc_hub_ha_handshake_age", "—");
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
    /* @__PURE__ */ s.jsx(
      Q,
      {
        icon: o ? "ok" : "alert",
        label: u ? o ? "HUB LINK" : "HUB LINK DOWN" : "HUB LINK —",
        tone: o ? "ok" : "bad"
      }
    ),
    /* @__PURE__ */ s.jsx(Q, { label: `Age ${f}`, tone: "muted" }),
    /* @__PURE__ */ s.jsx(Q, { label: `Bounces ${h}`, tone: "muted" }),
    /* @__PURE__ */ s.jsx(Q, { label: `RF ${m}`, tone: "muted" }),
    /* @__PURE__ */ s.jsx(Q, { label: `Handshake ${b}`, tone: "muted" })
  ] });
}
const Gb = "_allocated";
function Na(a, r, o) {
  const u = o.num(r);
  return o.forceKind === "mass-balance" ? {
    value: o.num(a, u),
    kind: "mass-balance",
    entityId: a,
    nameplate: Number.isFinite(u) ? u : void 0
  } : o.available(a) && Number.isFinite(o.num(a)) ? {
    value: o.num(a),
    kind: a.endsWith(Gb) ? "allocated" : "nameplate",
    entityId: a,
    nameplate: Number.isFinite(u) ? u : void 0
  } : {
    value: u,
    kind: "nameplate",
    entityId: r,
    nameplate: Number.isFinite(u) ? u : void 0
  };
}
function Ep(a) {
  switch (a) {
    case "allocated":
      return "Allocated";
    case "nameplate":
      return "Nameplate";
    case "mass-balance":
      return "Mass-balance";
    default:
      return a;
  }
}
function Dl({ reading: a }) {
  const r = a.kind === "nameplate" ? "warn" : "ok";
  return /* @__PURE__ */ s.jsx(
    Q,
    {
      label: Ep(a.kind),
      tone: r,
      icon: a.kind === "nameplate" ? "alert" : "ok"
    }
  );
}
function qb(a) {
  switch (a) {
    case "ok":
      return "ok";
    case "held":
      return "warn";
    case "oos":
    case "missing":
    case "dark":
      return "bad";
    default:
      return a;
  }
}
function Yb(a, r) {
  switch (a) {
    case "ok":
      return r;
    case "held":
      return `${r} HELD`;
    case "oos":
      return `${r} OOS`;
    case "missing":
      return `${r} missing`;
    case "dark":
      return `${r} dark`;
    default:
      return a;
  }
}
function Mp({ nodes: a }) {
  return /* @__PURE__ */ s.jsx("div", { className: "dsc-kit-pulse", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-kit-pulse-grid", children: a.map((r) => /* @__PURE__ */ s.jsxs("div", { className: `dsc-kit-node is-${r.status}`, children: [
    /* @__PURE__ */ s.jsx("i", {}),
    /* @__PURE__ */ s.jsx(Q, { label: Yb(r.status, r.label), tone: qb(r.status) })
  ] }, r.id)) }) });
}
const $b = [
  { id: "binary_sensor.dsc_hub_emergency_failsafe", label: "Emergency failsafe" },
  { id: "binary_sensor.dsc_hub_climate_sensor_fault", label: "Climate sensor fault" },
  { id: "binary_sensor.dsc_hub_aux_sensor_fault", label: "Aux sensor fault" },
  { id: "binary_sensor.dsc_hub_root_zone_sensor_fault", label: "Root-zone probes" },
  { id: "binary_sensor.dsc_clone_dark_period_violation", label: "Clone dark violation" },
  { id: "binary_sensor.dsc_reduced_kit", label: "Reduced kit" }
];
function Gm(a, r = 1) {
  return Number.isFinite(a) ? a.toFixed(r) : "—";
}
function Vb() {
  const { state: a, num: r, available: o, entity: u, tick: f } = Te(), h = ft(), [m, b] = _.useState(!1), [p, g] = _.useState(null), { hours: v, maxPoints: y } = xc(6), j = o("sensor.dsc_hub_uptime"), E = kb(), A = Tb(), M = Ab(), T = r("sensor.dsc_active_alert_count", 0), B = nt("sensor.dsc_hub_tent_temperature"), X = nt("sensor.dsc_hub_tent_humidity"), G = nt("sensor.dsc_hub_vpd_kpa"), ne = nt("sensor.dsc_hub_room_temperature"), V = nt("sensor.dsc_hub_clone_temperature"), P = nt("sensor.dsc_hub_clone_humidity"), F = nt("sensor.dsc_hub_clone_vpd_kpa"), ie = Be("sensor.dsc_hub_tent_temperature", { hours: v, maxPoints: y }), pe = Be("sensor.dsc_hub_tent_humidity", { hours: v, maxPoints: y }), ae = Be("sensor.dsc_hub_vpd_kpa", {
    hours: v,
    maxPoints: Math.min(y, 64)
  }), re = Be("sensor.dsc_hub_clone_temperature", {
    hours: v,
    maxPoints: Math.min(y, 64)
  }), de = Be("sensor.dsc_hub_clone_humidity", {
    hours: v,
    maxPoints: Math.min(y, 64)
  }), R = Be("sensor.dsc_hub_clone_vpd_kpa", {
    hours: v,
    maxPoints: Math.min(y, 64)
  }), W = r("number.dsc_hub_target_temp"), ee = r("number.dsc_hub_rh_target_min"), C = r("number.dsc_hub_rh_target_max"), Y = r("number.dsc_hub_vpd_target_min"), K = r("number.dsc_hub_vpd_target_max"), I = r("number.dsc_hub_clone_target_temp"), me = r("number.dsc_hub_clone_rh_min"), w = r("number.dsc_hub_clone_rh_max"), L = r("number.dsc_hub_clone_vpd_min"), Z = r("number.dsc_hub_clone_vpd_max"), J = _.useMemo(() => dc(ie.series), [ie.series]), ce = _.useMemo(() => dc(pe.series), [pe.series]), he = a("light.dsc_hub_sf1000_dimmer") === "on", ge = a("binary_sensor.dsc_hub_4x8_window_open") === "on", Ae = a("binary_sensor.dsc_hub_panel_link") === "on", tn = a("sensor.dsc_hub_heartbeat", "NO BEAT"), Tt = o("sensor.dsc_hub_heartbeat"), ye = a("sensor.dsc_fleet_version_status", "—"), gt = a("switch.dsc_hub_manual_takeover") === "on", at = a("switch.dsc_hub_tent_manual_override") === "on", _t = a("switch.dsc_hub_tent_full_auto_mode") === "on", cn = a("binary_sensor.dsc_reduced_kit") === "on", yc = String(u("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? ""), Ll = _t && !gt, ka = a("binary_sensor.dsc_hub_climate_sensor_fault") === "on", hl = $b.filter((_e) => a(_e.id) === "on"), Ta = fl.map((_e) => Ca(_e, { state: a, entity: u })), Ul = ro(a), Aa = Na("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available: o,
    num: r
  }), xt = [
    { id: "hub", label: "Hub", status: o("binary_sensor.dsc_hub_link") ? a("binary_sensor.dsc_hub_link") === "on" ? "ok" : "dark" : "missing" },
    { id: "ac", label: "AC", status: a("input_boolean.dsc_ac_in_service") === "on" ? "ok" : "oos" },
    { id: "mister", label: "Mister", status: a("input_boolean.dsc_clone_humidifier_in_service") === "on" ? "ok" : "oos" },
    ...fl.map((_e) => ({
      id: `pot${_e}`,
      label: `Pot ${_e}`,
      status: Gt(_e, a) ? "ok" : "oos"
    }))
  ], _c = B.stale || X.stale || G.stale || V.stale || P.stale || F.stale, vn = (_e, jt, rn, Bl) => g({ entityId: _e, label: jt, unit: rn, color: Bl });
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      $t,
      {
        icon: "mission",
        title: "Mission",
        subtitle: "Triage glance — Next, faults, seats, lung. Command lives on Climate.",
        primaryAction: /* @__PURE__ */ s.jsx(fe, { teal: !0, onClick: () => h("/live/twin"), children: "Open Twin" }),
        actions: /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(fe, { primary: !0, onClick: () => h("/live/climate"), children: "Climate Want" }),
          /* @__PURE__ */ s.jsx(so, { label: "Search", icon: "search", onClick: () => b(!0) }),
          /* @__PURE__ */ s.jsx(
            gc,
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
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-status-strip", children: [
      /* @__PURE__ */ s.jsx(
        Q,
        {
          icon: j ? "ok" : "alert",
          label: j ? "HUB ONLINE" : "HUB OFFLINE",
          tone: j ? "ok" : "bad"
        }
      ),
      j ? null : /* @__PURE__ */ s.jsx(
        Q,
        {
          label: `OFF ${E != null ? rc(E) : "—"}`,
          tone: "bad",
          pulse: !0
        }
      ),
      _c ? /* @__PURE__ */ s.jsx(Q, { label: "HELD VITALS", tone: "warn" }) : null,
      /* @__PURE__ */ s.jsx(Q, { label: `${Ul.inService} of ${Ul.total} in service`, tone: Ul.inService === Ul.total ? "ok" : "warn" }),
      /* @__PURE__ */ s.jsx(
        Q,
        {
          label: Ae ? "PANEL ESP-NOW" : o("sensor.dsc_control_wifi_rssi") ? "PANEL HA-ONLY" : "PANEL OFFLINE",
          tone: Ae ? "ok" : o("sensor.dsc_control_wifi_rssi") ? "warn" : "bad"
        }
      ),
      !Ae && !o("sensor.dsc_control_wifi_rssi") ? /* @__PURE__ */ s.jsx(
        Q,
        {
          label: `PANEL OFF ${M != null ? rc(M) : "—"}`,
          tone: "bad",
          pulse: !0
        }
      ) : null,
      /* @__PURE__ */ s.jsx(
        Q,
        {
          icon: Tt ? "ok" : "alert",
          label: Tt ? `BEAT ${tn}` : "NO BEAT",
          tone: Tt ? "ok" : "bad"
        }
      ),
      Tt ? null : /* @__PURE__ */ s.jsx(Q, { label: `BEAT OFF ${A != null ? rc(A) : "—"}`, tone: "bad", pulse: !0 }),
      /* @__PURE__ */ s.jsx(
        Q,
        {
          label: `UP ${Bb(r("sensor.dsc_hub_uptime"))}`,
          tone: j ? "ok" : "muted"
        }
      ),
      /* @__PURE__ */ s.jsx(
        Q,
        {
          icon: T === 0 ? "ok" : "alert",
          label: T === 0 ? "All clear" : `${T} alert(s)`,
          tone: T === 0 ? "ok" : "bad",
          pulse: T > 0
        }
      ),
      /* @__PURE__ */ s.jsx(
        Q,
        {
          label: ye === "ok" ? "FLEET OK" : ye === "warn" ? "FLEET WARN" : "FLEET DRIFT",
          tone: ye === "ok" ? "ok" : ye === "warn" ? "warn" : "bad"
        }
      ),
      _t ? /* @__PURE__ */ s.jsx(Q, { icon: "ok", label: "FULL AUTO", tone: "ok", pulse: !0 }) : null,
      Ll ? /* @__PURE__ */ s.jsx(Q, { label: "AUTO-DRIVEN", tone: "ok" }) : null,
      gt ? /* @__PURE__ */ s.jsx(Q, { icon: "alert", label: "MANUAL TAKEOVER", tone: "warn", pulse: !0 }) : null,
      at ? /* @__PURE__ */ s.jsx(Q, { icon: "alert", label: "FAN OVERRIDE", tone: "warn", pulse: !0 }) : null,
      _t && cn ? /* @__PURE__ */ s.jsx(Q, { icon: "alert", label: yc || "REDUCED KIT", tone: "warn", pulse: !0 }) : null
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid dsc-mission-modern", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(Fx, {}) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(se, { className: "dsc-glass", title: "Hub link", icon: "fleet", children: /* @__PURE__ */ s.jsx(Np, {}) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(se, { className: "dsc-glass", title: "Kit pulse", icon: "ok", children: /* @__PURE__ */ s.jsx(Mp, { nodes: xt }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(se, { className: "dsc-glass", title: "Live gauges", icon: "gauge", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-gauge-matrix", children: [
        /* @__PURE__ */ s.jsxs("div", { className: `dsc-gauge-row-3${he ? " is-lit" : ""}`, children: [
          /* @__PURE__ */ s.jsx("div", { className: "dsc-gauge-row-tag", children: "2×4" }),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-gauge-cell", children: [
            /* @__PURE__ */ s.jsx(
              yt,
              {
                label: "Temp",
                value: V.value,
                min: 15,
                max: 35,
                unit: "°C",
                target: I,
                stale: V.stale,
                onClick: () => vn("sensor.dsc_hub_clone_temperature", "2×4 Temp", "°C", "var(--dsc-teal)")
              }
            ),
            /* @__PURE__ */ s.jsx(rl, { series: re.series, color: "var(--dsc-teal)", width: 88, height: 18 })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-gauge-cell", children: [
            /* @__PURE__ */ s.jsx(
              yt,
              {
                label: "RH",
                value: P.value,
                min: 0,
                max: 100,
                unit: "%",
                band: { min: me, max: w },
                stale: P.stale,
                onClick: () => vn("sensor.dsc_hub_clone_humidity", "2×4 Humidity", "%", "var(--dsc-teal)")
              }
            ),
            /* @__PURE__ */ s.jsx(rl, { series: de.series, color: "var(--dsc-teal)", width: 88, height: 18 })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-gauge-cell", children: [
            /* @__PURE__ */ s.jsx(
              yt,
              {
                label: "VPD",
                value: F.value,
                min: 0,
                max: 2.5,
                unit: "kPa",
                band: { min: L, max: Z },
                stale: F.stale,
                onClick: () => vn("sensor.dsc_hub_clone_vpd_kpa", "2×4 VPD", "kPa", "var(--dsc-teal)")
              }
            ),
            /* @__PURE__ */ s.jsx(rl, { series: R.series, color: "var(--dsc-teal)", width: 88, height: 18 })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: `dsc-gauge-row-3${ge ? " is-lit" : ""}`, children: [
          /* @__PURE__ */ s.jsx("div", { className: "dsc-gauge-row-tag", children: "4×8" }),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-gauge-cell", children: [
            /* @__PURE__ */ s.jsx(
              yt,
              {
                label: "Temp",
                value: B.value,
                min: 15,
                max: 35,
                unit: "°C",
                target: W,
                extrema: J,
                stale: B.stale,
                onClick: () => vn("sensor.dsc_hub_tent_temperature", "4×8 Temp", "°C", "var(--dsc-blue)")
              }
            ),
            /* @__PURE__ */ s.jsx(rl, { series: ie.series, color: "var(--dsc-blue)", width: 88, height: 18 })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-gauge-cell", children: [
            /* @__PURE__ */ s.jsx(
              yt,
              {
                label: "RH",
                value: X.value,
                min: 0,
                max: 100,
                unit: "%",
                band: { min: ee, max: C },
                extrema: ce,
                stale: X.stale,
                onClick: () => vn("sensor.dsc_hub_tent_humidity", "4×8 Humidity", "%", "var(--dsc-blue)")
              }
            ),
            /* @__PURE__ */ s.jsx(rl, { series: pe.series, color: "var(--dsc-blue)", width: 88, height: 18 })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-gauge-cell", children: [
            /* @__PURE__ */ s.jsx(
              yt,
              {
                label: "VPD",
                value: G.value,
                min: 0,
                max: 2.5,
                unit: "kPa",
                band: { min: Y, max: K },
                stale: G.stale,
                onClick: () => vn("sensor.dsc_hub_vpd_kpa", "4×8 VPD", "kPa", "var(--dsc-blue)")
              }
            ),
            /* @__PURE__ */ s.jsx(rl, { series: ae.series, color: "var(--dsc-blue)", width: 88, height: 18 })
          ] })
        ] })
      ] }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsxs(se, { className: `dsc-glass${Ll ? " is-auto" : ""}`, title: "Mode glance", icon: "climate", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
          /* @__PURE__ */ s.jsx(Q, { label: _t ? "FULL AUTO" : "MANUAL", tone: _t ? "ok" : "muted" }),
          gt ? /* @__PURE__ */ s.jsx(Q, { label: "TAKEOVER", tone: "warn" }) : null,
          at ? /* @__PURE__ */ s.jsx(Q, { label: "FAN OVERRIDE", tone: "warn" }) : null
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0" }, children: "Command lives on Climate." }),
        /* @__PURE__ */ s.jsx(fe, { teal: !0, onClick: () => h("/live/climate"), children: "Open Climate command" }),
        ka ? /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
          /* @__PURE__ */ s.jsx(Q, { label: "Climate fault", tone: "bad" }),
          " Do not invent Got."
        ] }) : null
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsxs(se, { className: "dsc-glass", title: "Got vs Want", icon: "gauge", children: [
        /* @__PURE__ */ s.jsx(
          bp,
          {
            rows: [
              {
                label: "Main T",
                got: B.value,
                want: W,
                unit: "°C"
              },
              {
                label: "Main RH",
                got: X.value,
                wantMin: ee,
                wantMax: C,
                unit: "%"
              },
              {
                label: "Clone T",
                got: V.value,
                want: I,
                unit: "°C"
              },
              {
                label: "Clone RH",
                got: P.value,
                wantMin: me,
                wantMax: w,
                unit: "%"
              }
            ]
          }
        ),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-kpi-sub", style: { marginTop: 8 }, children: [
          "Room ",
          Gm(ne.value),
          " °C · VPD ",
          Gm(G.value, 2),
          " kPa",
          G.stale || ne.stale ? " · HELD" : ""
        ] }),
        /* @__PURE__ */ s.jsx(
          Ve,
          {
            label: "Surface",
            value: a("sensor.dsc_ha_surface_version", "7.1.1"),
            sub: `Fleet ${ye}`,
            tone: "ok"
          }
        )
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(se, { className: "dsc-glass", title: "Lung CFM", icon: "climate", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ s.jsx(Dl, { reading: Aa }),
        /* @__PURE__ */ s.jsxs("button", { type: "button", className: "dsc-chip", onClick: () => h("/live/climate"), children: [
          "OUT ",
          Number.isFinite(Aa.value) ? Math.round(Aa.value) : "—",
          " cfm → Climate"
        ] })
      ] }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(se, { className: "dsc-glass", title: "Plant seats", icon: "seat", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: Ta.map((_e) => {
        const jt = !Gt(_e.pot, a), rn = uo(_e.pot, a), Bl = !jt && !rn.blockNeedAct && _e.need && _e.need !== "—" && _e.need !== "ok";
        return /* @__PURE__ */ s.jsxs(
          "button",
          {
            type: "button",
            className: `dsc-chip${jt ? "" : " dsc-chip--ok"}${Bl ? " dsc-chip--pulse" : ""}`,
            onClick: () => window.dispatchEvent(new CustomEvent("dsc-dash-select-pot", { detail: { pot: _e.pot } })),
            title: jt ? "OOS — no fake Got" : _e.need,
            children: [
              /* @__PURE__ */ s.jsx(dl, { spec: wa(_e.pot, a, u), size: 18 }),
              "P",
              _e.pot,
              " ",
              _e.plantName !== "—" ? _e.plantName : "—",
              " · Got M ",
              jt ? "—" : _e.moisture,
              jt ? " · OOS" : ` · Need ${_e.need}`,
              rn.labels.length ? ` · ${rn.labels.join("/")}` : ""
            ]
          },
          _e.pot
        );
      }) }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(se, { className: `dsc-glass${Ll ? " is-auto" : ""}`, title: "Command", icon: "climate", children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Full Auto, strategy, fans, and demands live on Climate — Mission is triage." }),
        /* @__PURE__ */ s.jsx(fe, { primary: !0, onClick: () => h("/live/climate"), children: "Open Climate" })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(se, { className: "dsc-glass", title: "Pot ESP-NOW", icon: "root", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: Ds(a).map((_e) => {
        const jt = `binary_sensor.dsc_hub_pot${_e}_esp_now_link`, rn = a(jt) === "on";
        return /* @__PURE__ */ s.jsx(Q, { label: `P${_e} ${rn ? "ON" : "OFF"}`, tone: rn ? "ok" : "muted" }, _e);
      }) }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(se, { className: "dsc-glass", title: "Faults / alerts", icon: "alert", children: hl.length === 0 && T === 0 ? /* @__PURE__ */ s.jsx("div", { className: "dsc-empty dsc-empty--ok", children: "No active faults — all clear." }) : /* @__PURE__ */ s.jsxs("ul", { className: "dsc-fault-list", children: [
        hl.map((_e) => /* @__PURE__ */ s.jsxs("li", { children: [
          /* @__PURE__ */ s.jsx(Q, { label: _e.label, tone: "bad", pulse: !0, icon: "alert" }),
          /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", children: _e.id })
        ] }, _e.id)),
        T > 0 && hl.length === 0 ? /* @__PURE__ */ s.jsxs("li", { children: [
          /* @__PURE__ */ s.jsx(Q, { label: `${T} system alert(s)`, tone: "bad", pulse: !0, icon: "alert" }),
          /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", children: "See Fleet for entity detail" })
        ] }) : null
      ] }) }) })
    ] }),
    /* @__PURE__ */ s.jsx(Os, { open: m, onClose: () => b(!1), title: "Quick jump", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: [
      { path: "/live/climate", label: "Climate" },
      { path: "/live/twin", label: "Twin" },
      { path: "/live/main", label: "Main" },
      { path: "/live/clone", label: "Clone" },
      { path: "/live/root", label: "Root" },
      { path: "/live/light", label: "Light" },
      { path: "/grow/compose", label: "Compose" },
      { path: "/fleet", label: "Fleet" }
    ].map((_e) => /* @__PURE__ */ s.jsx(
      "button",
      {
        type: "button",
        className: "dsc-btn teal",
        onClick: () => {
          b(!1), h(_e.path);
        },
        children: _e.label
      },
      _e.path
    )) }) }),
    /* @__PURE__ */ s.jsx(
      fo,
      {
        open: p != null,
        onClose: () => g(null),
        entityId: p?.entityId ?? null,
        label: p?.label ?? "",
        unit: p?.unit,
        color: p?.color
      }
    )
  ] });
}
function Qb({
  intakeClone: a,
  intakeMain: r,
  outCfm: o,
  recircCfm: u,
  kind: f
}) {
  const h = f === "nameplate" ? "6 5" : void 0, m = (b) => Number.isFinite(b) ? Math.round(b) : "—";
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-lung-loop", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ s.jsx(Q, { label: Ep(f), tone: f === "nameplate" ? "warn" : "ok" }),
      /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", style: { fontSize: 12 }, children: "Cascade 2×4→4×8 · mass-balance exhaust = Σ intake × split" })
    ] }),
    /* @__PURE__ */ s.jsxs("svg", { viewBox: "0 0 640 180", className: "dsc-lung-svg", "aria-label": "Lung loop", children: [
      /* @__PURE__ */ s.jsx("rect", { x: "8", y: "48", width: "90", height: "84", rx: "10", fill: "none", stroke: "var(--dsc-teal)", strokeWidth: "1.6", strokeDasharray: h }),
      /* @__PURE__ */ s.jsx("text", { x: "53", y: "92", textAnchor: "middle", fill: "currentColor", fontSize: "11", children: "Room" }),
      /* @__PURE__ */ s.jsx("rect", { x: "130", y: "18", width: "140", height: "64", rx: "8", fill: "none", stroke: "var(--dsc-teal)", strokeWidth: "1.8", strokeDasharray: h }),
      /* @__PURE__ */ s.jsx("text", { x: "200", y: "48", textAnchor: "middle", fill: "currentColor", fontSize: "11", children: "2×4" }),
      /* @__PURE__ */ s.jsxs("text", { x: "200", y: "66", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: [
        m(a),
        " cfm in"
      ] }),
      /* @__PURE__ */ s.jsx("rect", { x: "130", y: "100", width: "140", height: "64", rx: "8", fill: "none", stroke: "var(--dsc-blue)", strokeWidth: "1.8", strokeDasharray: h }),
      /* @__PURE__ */ s.jsx("text", { x: "200", y: "130", textAnchor: "middle", fill: "currentColor", fontSize: "11", children: "4×8" }),
      /* @__PURE__ */ s.jsxs("text", { x: "200", y: "148", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: [
        m(r),
        " cfm in"
      ] }),
      /* @__PURE__ */ s.jsx("path", { d: "M270 50 L330 50 L330 132 L270 132", fill: "none", stroke: "var(--dsc-amber)", strokeWidth: "2", strokeDasharray: h, markerEnd: "url(#lung-arr)" }),
      /* @__PURE__ */ s.jsx("text", { x: "352", y: "96", fill: "var(--dsc-amber)", fontSize: "10", children: "cascade" }),
      /* @__PURE__ */ s.jsx("rect", { x: "430", y: "18", width: "120", height: "64", rx: "8", fill: "none", stroke: "#ff8a65", strokeWidth: "1.8", strokeDasharray: h }),
      /* @__PURE__ */ s.jsx("text", { x: "490", y: "48", textAnchor: "middle", fill: "currentColor", fontSize: "11", children: "DUMP" }),
      /* @__PURE__ */ s.jsxs("text", { x: "490", y: "66", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: [
        m(o),
        " cfm"
      ] }),
      /* @__PURE__ */ s.jsx("rect", { x: "430", y: "100", width: "120", height: "64", rx: "8", fill: "none", stroke: "#b388ff", strokeWidth: "1.8", strokeDasharray: h }),
      /* @__PURE__ */ s.jsx("text", { x: "490", y: "130", textAnchor: "middle", fill: "currentColor", fontSize: "11", children: "RECIRC" }),
      /* @__PURE__ */ s.jsxs("text", { x: "490", y: "148", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: [
        m(u),
        " cfm"
      ] }),
      /* @__PURE__ */ s.jsx("path", { d: "M98 90 L130 50", fill: "none", stroke: "var(--dsc-teal)", strokeWidth: "1.5", strokeDasharray: h }),
      /* @__PURE__ */ s.jsx("path", { d: "M98 90 L130 132", fill: "none", stroke: "var(--dsc-blue)", strokeWidth: "1.5", strokeDasharray: h }),
      /* @__PURE__ */ s.jsx("path", { d: "M270 132 L430 132", fill: "none", stroke: "#b388ff", strokeWidth: "1.5", strokeDasharray: h }),
      /* @__PURE__ */ s.jsx("path", { d: "M270 50 L430 50", fill: "none", stroke: "#ff8a65", strokeWidth: "1.5", strokeDasharray: h })
    ] })
  ] });
}
function Oe(a, r = 1) {
  return Number.isFinite(a) ? a.toFixed(r) : "—";
}
const Xb = [
  { id: "main", label: "Main" },
  { id: "clone", label: "Clone" },
  { id: "room", label: "Room" },
  { id: "compare", label: "Compare" }
];
function Zb() {
  const a = ft();
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page dsc-page--twin-chrome", children: [
    /* @__PURE__ */ s.jsx(
      $t,
      {
        icon: "twin",
        title: "Twin",
        subtitle: "Cinematic digital twin — pick a pot to open Root seat.",
        primaryAction: /* @__PURE__ */ s.jsx(fe, { teal: !0, onClick: () => a("/live/climate"), children: "Set Climate Want" }),
        actions: /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(fe, { onClick: () => a("/live/main"), children: "Main cockpit" }),
          /* @__PURE__ */ s.jsx(fe, { onClick: () => a("/live/clone"), children: "Clone cockpit" })
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty dsc-muted", style: { marginTop: 0 }, children: "Pick a pot in the twin to open its seat. Twin stays warm across Twin / Main / Clone. 4×8 fixture glow follows photoperiod window until a main lamp is wired." })
  ] });
}
function Kb() {
  const { num: a, state: r, entity: o, available: u } = Te(), f = ft(), { focus: h, setFocus: m } = wp(), { hours: b, setHours: p, maxPoints: g } = xc(6), [v, y] = _.useState(null), j = r("switch.dsc_hub_tent_manual_override") === "on", E = r("switch.dsc_hub_tent_full_auto_mode") === "on", A = String(o("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? ""), M = nt("sensor.dsc_hub_tent_temperature"), T = nt("sensor.dsc_hub_tent_humidity"), B = nt("sensor.dsc_hub_clone_temperature"), X = nt("sensor.dsc_hub_clone_humidity"), G = nt("sensor.dsc_hub_vpd_kpa"), ne = Be("sensor.dsc_hub_tent_temperature", { hours: b, maxPoints: g }), V = Be("sensor.dsc_hub_tent_humidity", { hours: b, maxPoints: g }), P = Be("sensor.dsc_hub_clone_temperature", { hours: b, maxPoints: g }), F = Be("sensor.dsc_hub_clone_humidity", { hours: b, maxPoints: g }), ie = u("sensor.dsc_cfm_exhaust_out_allocated") ? "sensor.dsc_cfm_exhaust_out_allocated" : "sensor.dsc_cfm_exhaust_out", pe = u("sensor.dsc_cfm_exhaust_recirc_allocated") ? "sensor.dsc_cfm_exhaust_recirc_allocated" : "sensor.dsc_cfm_exhaust_recirc", ae = Be(ie, { hours: b, maxPoints: g }), re = Be(pe, { hours: b, maxPoints: g }), de = Be("sensor.dsc_fan_exhaust_outside_pct", { hours: b, maxPoints: g }), R = Be("sensor.dsc_fan_exhaust_room_pct", { hours: b, maxPoints: g }), W = Na("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available: u,
    num: a
  }), ee = Na(
    "sensor.dsc_cfm_exhaust_recirc_allocated",
    "sensor.dsc_cfm_exhaust_recirc",
    { available: u, num: a }
  ), C = W.nameplate ?? a("sensor.dsc_cfm_exhaust_out"), Y = W.value, K = ee.nameplate ?? a("sensor.dsc_cfm_exhaust_recirc"), I = ee.value, me = sb(a("sensor.dsc_hub_room_temperature"), a("sensor.dsc_hub_room_humidity")), w = h === "room" || h === "compare", L = a("number.dsc_hub_target_temp"), Z = a("number.dsc_hub_rh_target_min"), J = a("number.dsc_hub_rh_target_max"), ce = a("number.dsc_hub_vpd_target_min"), he = a("number.dsc_hub_vpd_target_max"), ge = a("number.dsc_hub_clone_target_temp"), Ke = a("number.dsc_hub_clone_rh_min"), Ae = a("number.dsc_hub_clone_rh_max"), tn = a("number.dsc_hub_clone_vpd_min"), Tt = a("number.dsc_hub_clone_vpd_max"), ye = _.useMemo(() => dc(ne.series), [ne.series]), gt = _.useMemo(() => dc(V.series), [V.series]), at = h === "main" || h === "compare", _t = h === "clone" || h === "compare";
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      $t,
      {
        icon: "climate",
        title: "Climate",
        subtitle: "Command, Want targets, zone traces, VPD, airflow honesty.",
        actions: /* @__PURE__ */ s.jsx(
          gc,
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
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 14 }, role: "group", "aria-label": "Tent focus", children: [
      Xb.map((cn) => /* @__PURE__ */ s.jsx(
        "button",
        {
          type: "button",
          className: `dsc-chip${h === cn.id ? " dsc-chip--ok" : ""}`,
          onClick: () => m(cn.id),
          children: cn.label
        },
        cn.id
      )),
      /* @__PURE__ */ s.jsx(oo, { hours: b, setHours: p, extras: yp }),
      /* @__PURE__ */ s.jsx(fe, { teal: !0, onClick: () => f("/fleet"), children: "Kit / Fleet" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(se, { className: "dsc-glass", title: "Command", icon: "climate", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-row", children: [
          /* @__PURE__ */ s.jsx(We, { entityId: "switch.dsc_hub_tent_full_auto_mode", label: "Full Auto", icon: "ok" }),
          /* @__PURE__ */ s.jsx(We, { entityId: "switch.dsc_hub_manual_takeover", label: "Master takeover", icon: "alert" }),
          /* @__PURE__ */ s.jsx(We, { entityId: "switch.dsc_hub_tent_manual_override", label: "Fan override", icon: "climate" }),
          /* @__PURE__ */ s.jsx(
            We,
            {
              entityId: "switch.dsc_hub_humidifier_intake_routing",
              label: "Hum intake routing",
              icon: "climate"
            }
          ),
          /* @__PURE__ */ s.jsx(
            We,
            {
              entityId: "switch.dsc_hub_recirc_de_strat_pulse",
              label: "RECIRC de-strat",
              icon: "climate"
            }
          )
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-selects", children: [
          /* @__PURE__ */ s.jsx(Ol, { entityId: "select.dsc_hub_control_strategy", label: "Strategy", icon: "climate" }),
          /* @__PURE__ */ s.jsx(Ol, { entityId: "select.dsc_hub_priority_tent", label: "Priority tent", icon: "tent" })
        ] }),
        E ? /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
          /* @__PURE__ */ s.jsx(
            Q,
            {
              icon: "alert",
              label: r("binary_sensor.dsc_reduced_kit") === "on" ? "Reduced kit" : "Full Auto",
              tone: r("binary_sensor.dsc_reduced_kit") === "on" ? "warn" : "ok"
            }
          ),
          " ",
          A || "Hub owns fans + appliance Autos when Full Auto is on."
        ] }) : null
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(se, { className: "dsc-glass", title: "Targets", icon: "gauge", children: /* @__PURE__ */ s.jsx(vp, { emphasize: h === "clone" ? "clone" : "main" }) }) }),
      at ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(
          Ve,
          {
            label: "Tent °C",
            value: Oe(M.value),
            unit: "°C",
            stale: M.stale,
            onClick: () => y({ id: "sensor.dsc_hub_tent_temperature", label: "Tent T", unit: "°C" })
          }
        ) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(
          Ve,
          {
            label: "Tent RH",
            value: Oe(T.value, 0),
            unit: "%",
            stale: T.stale,
            onClick: () => y({ id: "sensor.dsc_hub_tent_humidity", label: "Tent RH", unit: "%" })
          }
        ) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(
          Ve,
          {
            label: "VPD",
            value: Oe(G.value, 2),
            unit: "kPa",
            stale: G.stale,
            onClick: () => y({ id: "sensor.dsc_hub_vpd_kpa", label: "VPD", unit: "kPa" })
          }
        ) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(Ve, { label: "Room °C", value: Oe(a("sensor.dsc_hub_room_temperature")), unit: "°C" }) })
      ] }) : null,
      _t ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(
          Ve,
          {
            label: "Clone °C",
            value: Oe(B.value),
            unit: "°C",
            stale: B.stale
          }
        ) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(
          Ve,
          {
            label: "Clone RH",
            value: Oe(X.value, 0),
            unit: "%",
            stale: X.stale
          }
        ) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(Ve, { label: "Clone VPD", value: Oe(a("sensor.dsc_hub_clone_vpd_kpa"), 2), unit: "kPa" }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(Ve, { label: "Room °C", value: Oe(a("sensor.dsc_hub_room_temperature")), unit: "°C" }) })
      ] }) : null,
      w ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(Ve, { label: "Room °C", value: Oe(a("sensor.dsc_hub_room_temperature")), unit: "°C" }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(Ve, { label: "Room RH", value: Oe(a("sensor.dsc_hub_room_humidity"), 0), unit: "%" }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(
          Ve,
          {
            label: "Room AH",
            value: Number.isFinite(me) ? me.toFixed(1) : "—",
            unit: "g/m³",
            sub: Number.isFinite(me) ? void 0 : "Need T+RH"
          }
        ) })
      ] }) : null,
      h === "compare" ? /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(se, { className: "dsc-glass", title: "Compare T + RH", icon: "tent", children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "One chart: 4×8 solid, 2×4 ghost. Not two dashboards." }),
        /* @__PURE__ */ s.jsx(
          hn,
          {
            lastSyncAt: Math.max(
              ne.lastSyncAt ?? 0,
              V.lastSyncAt ?? 0,
              P.lastSyncAt ?? 0,
              F.lastSyncAt ?? 0
            ) || void 0,
            series: [
              {
                id: "t",
                label: "4×8 T",
                series: ne.series,
                color: "var(--dsc-blue)",
                axis: "left",
                unit: "°C"
              },
              {
                id: "rh",
                label: "4×8 RH",
                series: V.series,
                color: "var(--dsc-teal)",
                axis: "right",
                unit: "%"
              },
              {
                id: "t-ghost",
                label: "2×4 T",
                series: P.series,
                color: "var(--dsc-blue)",
                axis: "left",
                unit: "°C",
                ghost: !0
              },
              {
                id: "rh-ghost",
                label: "2×4 RH",
                series: F.series,
                color: "var(--dsc-teal)",
                axis: "right",
                unit: "%",
                ghost: !0
              }
            ],
            targets: [
              { axis: "left", value: L, color: "var(--dsc-amber)", label: "Want T" },
              { axis: "right", min: Z, max: J, color: "var(--dsc-teal)" }
            ]
          }
        )
      ] }) }) : null,
      at && h !== "compare" ? /* @__PURE__ */ s.jsx("div", { className: _t ? "dsc-col-6" : "dsc-col-12", children: /* @__PURE__ */ s.jsx(se, { className: "dsc-glass", title: "Main tent T + RH", icon: "tent", children: /* @__PURE__ */ s.jsx(
        hn,
        {
          lastSyncAt: Math.max(ne.lastSyncAt ?? 0, V.lastSyncAt ?? 0) || void 0,
          series: [
            {
              id: "t",
              label: "Temp °C",
              series: ne.series,
              color: "var(--dsc-blue)",
              axis: "left",
              unit: "°C"
            },
            {
              id: "rh",
              label: "RH %",
              series: V.series,
              color: "var(--dsc-teal)",
              axis: "right",
              unit: "%"
            }
          ],
          targets: [
            { axis: "left", value: L, color: "var(--dsc-amber)", label: "Want T" },
            { axis: "right", min: Z, max: J, color: "var(--dsc-teal)" }
          ]
        }
      ) }) }) : null,
      _t && h !== "compare" ? /* @__PURE__ */ s.jsx("div", { className: at ? "dsc-col-6" : "dsc-col-12", children: /* @__PURE__ */ s.jsx(se, { className: "dsc-glass", title: "Clone tent T + RH", icon: "clone", children: /* @__PURE__ */ s.jsx(
        hn,
        {
          lastSyncAt: Math.max(P.lastSyncAt ?? 0, F.lastSyncAt ?? 0) || void 0,
          series: [
            {
              id: "t",
              label: "Temp °C",
              series: P.series,
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
              value: ge,
              color: "var(--dsc-amber)",
              label: "Want T"
            },
            { axis: "right", min: Ke, max: Ae, color: "var(--dsc-teal)" }
          ]
        }
      ) }) }) : null,
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-col-3", children: [
        /* @__PURE__ */ s.jsx(
          Ve,
          {
            label: "CFM OUT",
            value: Oe(Y, 0),
            unit: "cfm",
            sub: `Nameplate ${Oe(C, 0)}`
          }
        ),
        /* @__PURE__ */ s.jsx(Dl, { reading: W })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(
        Ve,
        {
          label: "CFM RECIRC",
          value: Oe(I, 0),
          unit: "cfm",
          sub: `Alloc · nameplate ${Oe(K, 0)}`
        }
      ) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(Ve, { label: "Intake main", value: Oe(a("sensor.dsc_cfm_intake_main"), 0), unit: "cfm" }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(Ve, { label: "Intake 2×4", value: Oe(a("sensor.dsc_cfm_intake_2x4"), 0), unit: "cfm" }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(se, { className: "dsc-glass", title: "Airflow honesty", icon: "climate", children: [
        /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: [
          /* @__PURE__ */ s.jsx(Dl, { reading: W }),
          " ",
          /* @__PURE__ */ s.jsx(Dl, { reading: ee }),
          " ",
          "Lung loop is mass-balance, not a second isometric tent. 4×8 light = window proxy until GPIO lamp."
        ] }),
        /* @__PURE__ */ s.jsx(
          Qb,
          {
            intakeClone: a("sensor.dsc_cfm_intake_2x4"),
            intakeMain: a("sensor.dsc_cfm_intake_main"),
            outCfm: Y,
            recircCfm: I,
            kind: W.kind
          }
        )
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(se, { className: "dsc-glass", title: "Exhaust CFM (allocated)", icon: "climate", children: /* @__PURE__ */ s.jsx(
        hn,
        {
          unit: "cfm",
          lastSyncAt: Math.max(ae.lastSyncAt ?? 0, re.lastSyncAt ?? 0) || void 0,
          series: [
            {
              id: "out",
              label: "OUT",
              series: ae.series,
              color: "var(--dsc-blue)",
              unit: "cfm"
            },
            {
              id: "recirc",
              label: "RECIRC",
              series: re.series,
              color: "var(--dsc-purple)",
              unit: "cfm"
            }
          ]
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(se, { className: "dsc-glass", title: "Fan duty %", icon: "climate", children: [
        /* @__PURE__ */ s.jsx(
          hn,
          {
            unit: "%",
            lastSyncAt: Math.max(de.lastSyncAt ?? 0, R.lastSyncAt ?? 0) || void 0,
            series: [
              {
                id: "fout",
                label: "OUT %",
                series: de.series,
                color: "var(--dsc-teal)",
                unit: "%"
              },
              {
                id: "frec",
                label: "RECIRC %",
                series: R.series,
                color: "var(--dsc-amber)",
                unit: "%"
              }
            ]
          }
        ),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-fan-stack", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ s.jsx(
            ul,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_main",
              label: "Intake Main",
              disabled: !j
            }
          ),
          /* @__PURE__ */ s.jsx(
            ul,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_2x4",
              label: "Intake 2×4",
              disabled: !j
            }
          ),
          /* @__PURE__ */ s.jsx(
            ul,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_room",
              label: "Exhaust room",
              disabled: !j
            }
          ),
          /* @__PURE__ */ s.jsx(
            ul,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_outside",
              label: "Exhaust outside",
              disabled: !j
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(se, { className: "dsc-glass", title: "Zone gauges", icon: "gauge", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-gauge-row", children: [
        at ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(
            yt,
            {
              label: "Tent T",
              value: M.value,
              min: 15,
              max: 35,
              unit: "°C",
              target: L,
              extrema: ye,
              stale: M.stale,
              onClick: () => y({
                id: "sensor.dsc_hub_tent_temperature",
                label: "Tent T",
                unit: "°C"
              })
            }
          ),
          /* @__PURE__ */ s.jsx(
            yt,
            {
              label: "Tent RH",
              value: T.value,
              min: 0,
              max: 100,
              unit: "%",
              band: { min: Z, max: J },
              extrema: gt,
              stale: T.stale
            }
          ),
          /* @__PURE__ */ s.jsx(
            yt,
            {
              label: "VPD",
              value: G.value,
              min: 0,
              max: 2.5,
              unit: "kPa",
              band: { min: ce, max: he },
              stale: G.stale
            }
          )
        ] }) : null,
        _t ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(
            yt,
            {
              label: "Clone T",
              value: B.value,
              min: 15,
              max: 35,
              unit: "°C",
              target: ge,
              stale: B.stale
            }
          ),
          /* @__PURE__ */ s.jsx(
            yt,
            {
              label: "Clone RH",
              value: X.value,
              min: 0,
              max: 100,
              unit: "%",
              band: { min: Ke, max: Ae },
              stale: X.stale
            }
          ),
          /* @__PURE__ */ s.jsx(
            yt,
            {
              label: "Clone VPD",
              value: a("sensor.dsc_hub_clone_vpd_kpa"),
              min: 0,
              max: 2.5,
              unit: "kPa",
              band: { min: tn, max: Tt }
            }
          )
        ] }) : null
      ] }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(se, { className: "dsc-glass", title: "Efficacy", icon: "alert", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ s.jsx(
          Q,
          {
            label: r("binary_sensor.dsc_humidifier_ineffective_suspect") === "on" ? "Hum ineffective" : "Hum ok",
            tone: r("binary_sensor.dsc_humidifier_ineffective_suspect") === "on" ? "warn" : "muted"
          }
        ),
        /* @__PURE__ */ s.jsx(
          Q,
          {
            label: r("binary_sensor.dsc_heater_ineffective_suspect") === "on" ? "Heat ineffective" : "Heat ok",
            tone: r("binary_sensor.dsc_heater_ineffective_suspect") === "on" ? "warn" : "muted"
          }
        ),
        /* @__PURE__ */ s.jsx(
          Q,
          {
            label: `Hum on ${Oe(a("sensor.dsc_humidifier_relay_on_time"), 0)}s`,
            tone: "muted"
          }
        ),
        /* @__PURE__ */ s.jsx(
          Q,
          {
            label: r("binary_sensor.dsc_plant_specs_hum_rate_zero") === "on" ? "Hum rate 0" : "Hum rate",
            tone: r("binary_sensor.dsc_plant_specs_hum_rate_zero") === "on" ? "warn" : "muted"
          }
        ),
        /* @__PURE__ */ s.jsx(
          Q,
          {
            label: r("binary_sensor.dsc_plant_specs_dehum_rate_zero") === "on" ? "Dehum rate 0" : "Dehum rate",
            tone: r("binary_sensor.dsc_plant_specs_dehum_rate_zero") === "on" ? "warn" : "muted"
          }
        )
      ] }) }) })
    ] }),
    /* @__PURE__ */ s.jsx(
      fo,
      {
        open: v != null,
        onClose: () => y(null),
        entityId: v?.id ?? null,
        label: v?.label ?? "",
        unit: v?.unit
      }
    )
  ] });
}
function Cp({ tent: a }) {
  const { state: r, entity: o, num: u, tick: f, callWS: h } = Te(), m = ft(), { setFocus: b } = wp(), [p, g] = vc(), [v, y] = _.useState([]);
  _.useEffect(() => {
    b(a);
  }, [a, b]);
  const j = lb(a, r, o), E = Number(p.get("pot") || 0), A = E >= 1 && E <= 4 && Gt(E, r) && j.some((C) => C.pot === E) ? E : null, M = a === "main" ? "sensor.dsc_hub_tent_temperature" : "sensor.dsc_hub_clone_temperature", T = a === "main" ? "sensor.dsc_hub_tent_humidity" : "sensor.dsc_hub_clone_humidity", B = a === "main" ? "sensor.dsc_hub_vpd_kpa" : "sensor.dsc_hub_clone_vpd_kpa", X = Be(M, { hours: 6 }), G = Be(T, { hours: 6 }), ne = nt(M), V = nt(T), P = nt(B), F = r(
    a === "main" ? "binary_sensor.dsc_hub_4x8_window_open" : "binary_sensor.dsc_hub_2x4_window_open"
  ) === "on", ie = r("light.dsc_hub_sf1000_dimmer") === "on", pe = a === "clone" ? ie : F, ae = u(a === "main" ? "sensor.dsc_cfm_intake_main" : "sensor.dsc_cfm_intake_2x4"), re = u("sensor.dsc_cfm_exhaust_out_allocated") || u("sensor.dsc_cfm_exhaust_out"), de = u("sensor.dsc_cfm_exhaust_recirc_allocated") || u("sensor.dsc_cfm_exhaust_recirc"), R = r("switch.dsc_hub_tent_manual_override") === "on";
  _.useEffect(() => {
    let C = !1;
    async function Y() {
      if (!h || j.length === 0) {
        y([]);
        return;
      }
      const K = j.flatMap((w) => [
        `text.dsc_pot${w.pot}_plant_name`,
        `input_select.dsc_pot${w.pot}_tent`,
        `select.dsc_pot${w.pot}_growth_stage`
      ]), I = /* @__PURE__ */ new Date(), me = new Date(I.getTime() - 48 * 3600 * 1e3);
      try {
        const w = await h({
          type: "history/history_during_period",
          start_time: me.toISOString(),
          end_time: I.toISOString(),
          significant_changes_only: !0,
          minimal_response: !0,
          no_attributes: !0,
          entity_ids: K.slice(0, 8)
        });
        if (C || !w) return;
        const L = [];
        for (const [Z, J] of Object.entries(w))
          for (const ce of J || []) {
            const he = typeof ce.lu == "number" ? ce.lu * 1e3 : ce.last_changed ? Date.parse(ce.last_changed) : NaN, ge = String(ce.s ?? ce.state ?? "");
            !Number.isFinite(he) || !ge || ge === "unavailable" || L.push({ t: he, text: `${new Date(he).toLocaleString()} · ${Z.split(".").pop()} → ${ge}` });
          }
        L.sort((Z, J) => J.t - Z.t), y(L.slice(0, 40).map((Z) => Z.text));
      } catch {
        C || y([]);
      }
    }
    return Y(), () => {
      C = !0;
    };
  }, [h, j, a]);
  const W = a === "main" ? "Main 4×8" : "Clone 2×4", ee = a === "main" ? "Intake main + cascade in · OUT / RECIRC" : "Intake 2×4 + cascade out · clone mister path";
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      $t,
      {
        icon: a === "main" ? "tent" : "clone",
        title: W,
        subtitle: `Tent cockpit — ${j.length} seat(s). ${ee}`,
        primaryAction: /* @__PURE__ */ s.jsx(fe, { teal: !0, onClick: () => m("/live/twin"), children: "Both tents" }),
        actions: /* @__PURE__ */ s.jsx(fe, { primary: !0, onClick: () => m(`/live/climate?tent=${a}`), children: "Climate Want" })
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-tent-cockpit-strip", children: [
      /* @__PURE__ */ s.jsx(Q, { label: `${j.length} plants`, tone: "ok" }),
      /* @__PURE__ */ s.jsx(
        Q,
        {
          label: `T ${Oe(ne.value)}°C`,
          tone: ne.stale ? "warn" : "ok"
        }
      ),
      /* @__PURE__ */ s.jsx(
        Q,
        {
          label: `RH ${Oe(V.value, 0)}%`,
          tone: V.stale ? "warn" : "ok"
        }
      ),
      /* @__PURE__ */ s.jsx(
        Q,
        {
          label: `VPD ${Oe(P.value, 2)}`,
          tone: P.stale ? "warn" : "ok"
        }
      ),
      /* @__PURE__ */ s.jsx(
        Q,
        {
          label: a === "clone" ? pe ? "SF1000 ON" : "SF1000 OFF" : F ? "PHOTO ON" : "PHOTO OFF",
          tone: pe ? "ok" : "muted"
        }
      ),
      /* @__PURE__ */ s.jsx(Q, { label: `IN ${Oe(ae, 0)} cfm`, tone: "muted" }),
      a === "main" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx(Q, { label: `OUT ${Oe(re, 0)}`, tone: "muted" }),
        /* @__PURE__ */ s.jsx(Q, { label: `RECIRC ${Oe(de, 0)}`, tone: "muted" })
      ] }) : /* @__PURE__ */ s.jsx(Q, { label: `CFM OUT ${Oe(re, 0)}`, tone: "muted" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(se, { className: "dsc-glass", title: "Want targets", icon: "climate", children: /* @__PURE__ */ s.jsx(vp, { only: a, compact: !0 }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(se, { className: "dsc-glass", title: "Seat strip", icon: "seat", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: j.length === 0 ? /* @__PURE__ */ s.jsx("div", { className: "dsc-empty", children: "No pots assigned — Apply to tent from a seat." }) : j.map((C) => {
        const Y = Number(r(`sensor.dsc_pot${C.pot}_dryback_pct`)), K = Number.isFinite(Y) && Y > 45;
        return /* @__PURE__ */ s.jsxs(
          "button",
          {
            type: "button",
            className: `dsc-chip dsc-chip--ok${K ? " dsc-chip--pulse" : ""}`,
            onClick: () => {
              const I = new URLSearchParams(p);
              I.set("pot", String(C.pot)), g(I, { replace: !0 });
            },
            children: [
              "P",
              C.pot,
              " ",
              C.plantName,
              " · M ",
              C.moisture,
              " · Need ",
              C.need,
              K ? " · dryback warn" : ""
            ]
          },
          C.pot
        );
      }) }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(se, { className: "dsc-glass", title: "Tent history", icon: "climate", children: /* @__PURE__ */ s.jsx(
        hn,
        {
          live: !0,
          lastSyncAt: Math.max(X.lastSyncAt ?? 0, G.lastSyncAt ?? 0) || void 0,
          series: [
            {
              id: "t",
              label: "Temp",
              series: X.series,
              color: "var(--dsc-blue)",
              axis: "left",
              unit: "°C"
            },
            {
              id: "rh",
              label: "RH",
              series: G.series,
              color: "var(--dsc-teal)",
              axis: "right",
              unit: "%"
            }
          ]
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(se, { className: "dsc-glass", title: "Fans (this tent)", icon: "climate", children: [
        R ? null : /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Fan sliders locked until Fan override is on (Climate → Command)." }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-fan-stack", children: a === "main" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(
            ul,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_main",
              label: "Intake Main",
              disabled: !R
            }
          ),
          /* @__PURE__ */ s.jsx(
            ul,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_room",
              label: "Exhaust room (RECIRC)",
              disabled: !R
            }
          ),
          /* @__PURE__ */ s.jsx(
            ul,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_outside",
              label: "Exhaust outside (OUT)",
              disabled: !R
            }
          )
        ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(
            ul,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_2x4",
              label: "Intake 2×4",
              disabled: !R
            }
          ),
          /* @__PURE__ */ s.jsx(
            We,
            {
              entityId: "light.dsc_hub_sf1000_dimmer",
              label: "SF1000",
              icon: "lighting"
            }
          )
        ] }) })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(se, { className: "dsc-glass", title: "Plant log (48h)", icon: "roster", children: v.length === 0 ? /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: "Thin recorder / no recent identity changes — honesty empty, not invented." }) : /* @__PURE__ */ s.jsx("ul", { className: "dsc-fault-list", children: v.map((C) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", style: { fontFamily: "var(--dsc-mono)", fontSize: 12 }, children: C }) }, C)) }) }) })
    ] }),
    /* @__PURE__ */ s.jsx(
      Os,
      {
        open: A != null,
        onClose: () => {
          const C = new URLSearchParams(p);
          C.delete("pot"), g(C, { replace: !0 });
        },
        title: A != null ? `Plant seat · POT${A}` : "Plant seat",
        children: A != null ? /* @__PURE__ */ s.jsx(
          bc,
          {
            pot: A,
            onSelectPot: (C) => {
              const Y = new URLSearchParams(p);
              Y.set("pot", String(C)), g(Y, { replace: !0 });
            }
          }
        ) : null
      }
    )
  ] });
}
function Fb() {
  return /* @__PURE__ */ s.jsx(Cp, { tent: "main" });
}
function Jb() {
  return /* @__PURE__ */ s.jsx(Cp, { tent: "clone" });
}
function Wb() {
  const { state: a, entity: r, tick: o, num: u } = Te(), [f, h] = vc(), [m, b] = _.useState(!1), p = fl.map((A) => Ca(A, { state: a, entity: r })), g = ro(a), v = Number(f.get("pot") || 0), y = v >= 1 && v <= 4 && Gt(v, a) ? v : null, j = (A) => {
    const M = new URLSearchParams(f);
    M.set("pot", String(A)), h(M, { replace: !0 });
  }, E = () => {
    const A = new URLSearchParams(f);
    A.delete("pot"), h(A, { replace: !0 });
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      $t,
      {
        icon: "root",
        title: "Root",
        subtitle: `${g.inService} of ${g.total} in service — OOS labeled, never fake Got.`
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(Ve, { label: "Coldest root", value: Oe(u("sensor.dsc_coldest_root_zone_temp")), unit: "°C" }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(Ve, { label: "Heat mat on time", value: Oe(u("sensor.dsc_heatmat_relay_on_time"), 0), unit: "s" }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(se, { title: "Notes", children: /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: "Mat loop uses per-pot sense with plausibility filter." }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(se, { className: "dsc-glass", title: "Dryback strip", icon: "gauge", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-gauge-row", children: Ds(a).map((A) => /* @__PURE__ */ s.jsx(Pb, { pot: A, onOpen: () => j(A) }, A)) }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(se, { className: "dsc-glass dsc-root-matrix", title: "Fleet matrix", icon: "root", children: [
        /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: /* @__PURE__ */ s.jsx(fe, { onClick: () => b((A) => !A), children: m ? "Hide NPK" : "Show NPK" }) }),
        /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "Pot" }),
            /* @__PURE__ */ s.jsx("th", { children: "Name" }),
            /* @__PURE__ */ s.jsx("th", { children: "Tent" }),
            /* @__PURE__ */ s.jsx("th", { children: "M%" }),
            /* @__PURE__ */ s.jsx("th", { children: "Soil °C" }),
            /* @__PURE__ */ s.jsx("th", { children: "Dryback" }),
            /* @__PURE__ */ s.jsx("th", { children: "EC" }),
            /* @__PURE__ */ s.jsx("th", { children: "pH" }),
            m ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("th", { children: "N" }),
              /* @__PURE__ */ s.jsx("th", { children: "P" }),
              /* @__PURE__ */ s.jsx("th", { children: "K" })
            ] }) : null,
            /* @__PURE__ */ s.jsx("th", { children: "Need" }),
            /* @__PURE__ */ s.jsx("th", { children: "Rate" }),
            /* @__PURE__ */ s.jsx("th", { children: "Trend" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: p.map((A) => /* @__PURE__ */ s.jsx(Ib, { pot: A.pot, showNpk: m, onOpen: () => j(A.pot) }, A.pot)) })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ s.jsx(
      Os,
      {
        open: y != null,
        onClose: E,
        title: y != null ? `Plant seat · POT${y}` : "Plant seat",
        children: y != null ? /* @__PURE__ */ s.jsx(bc, { pot: y, onSelectPot: j }) : null
      }
    )
  ] });
}
function Pb({ pot: a, onOpen: r }) {
  const o = nt(`sensor.dsc_pot${a}_dryback_pct`);
  return /* @__PURE__ */ s.jsx(
    yt,
    {
      label: `P${a}`,
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
function Ib({
  pot: a,
  onOpen: r,
  showNpk: o
}) {
  const { state: u, entity: f, available: h } = Te(), m = Ca(a, { state: u, entity: f }), b = !Gt(a, u), p = uo(a, u), g = ol(a, "moisture", u), v = Be(g, { hours: 6, maxPoints: 48 }), y = nt(`sensor.dsc_pot${a}_dryback_pct`), j = `sensor.dsc_pot${a}_soil_moisture_rate`, E = nt(j), A = h(j) || E.stale ? E.value : NaN, M = b || p.untrusted || y.stale ? "dsc-tone-stale" : Number.isFinite(y.value) && y.value > 55 ? "dsc-tone-bad" : Number.isFinite(y.value) && y.value > 40 ? "dsc-tone-warn" : "dsc-tone-ok", T = !b && !p.blockNeedAct && m.need && m.need !== "—" && m.need !== "ok";
  return /* @__PURE__ */ s.jsxs("tr", { onClick: r, style: { cursor: "pointer" }, className: p.untrusted ? "dsc-tone-stale" : void 0, children: [
    /* @__PURE__ */ s.jsxs("td", { children: [
      /* @__PURE__ */ s.jsx(dl, { spec: wa(a, u, f), size: 18 }),
      " P",
      a,
      b ? " OOS" : ""
    ] }),
    /* @__PURE__ */ s.jsx("td", { children: b ? "—" : m.plantName }),
    /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx(Q, { label: co(m.tent), tone: m.tent === "unassigned" || b ? "muted" : "ok" }) }),
    /* @__PURE__ */ s.jsx("td", { children: b ? "—" : m.moisture }),
    /* @__PURE__ */ s.jsx("td", { children: b ? "—" : m.soilTemp }),
    /* @__PURE__ */ s.jsx("td", { className: M, children: b ? "—" : Oe(y.value, 0) }),
    /* @__PURE__ */ s.jsx("td", { children: b ? "—" : m.ec }),
    /* @__PURE__ */ s.jsx("td", { children: b ? "—" : m.ph }),
    o ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsx("td", { children: b ? "—" : m.n }),
      /* @__PURE__ */ s.jsx("td", { children: b ? "—" : m.p }),
      /* @__PURE__ */ s.jsx("td", { children: b ? "—" : m.k })
    ] }) : null,
    /* @__PURE__ */ s.jsx("td", { className: T ? "dsc-tone-warn" : void 0, children: b ? "OOS" : p.blockNeedAct ? `${m.need} (no act)` : m.need }),
    /* @__PURE__ */ s.jsx("td", { className: E.stale ? "dsc-tone-stale" : void 0, children: Number.isFinite(A) ? A.toFixed(2) : "—" }),
    /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx(rl, { series: v.series, color: "var(--dsc-blue)", width: 90, height: 24 }) })
  ] });
}
function ey() {
  const { available: a, state: r, num: o } = Te(), u = ft(), [f, h] = _.useState(!1), m = r("binary_sensor.dsc_clone_dark_period_violation") === "on", b = r("light.dsc_hub_sf1000_dimmer") === "on", p = r("binary_sensor.dsc_hub_4x8_window_open") === "on", g = a("light.dsc_hub_4x8_dimmer") || a("light.dsc_hub_main_light"), v = o("sensor.dsc_expected_light_hours"), y = o("sensor.dsc_clone_expected_light_hours"), j = Be("binary_sensor.dsc_hub_4x8_window_open", { hours: 24, maxPoints: 96 });
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      $t,
      {
        icon: "lighting",
        title: "Light",
        subtitle: "Photoperiod, SF1000, expected hours — 4×8 is window proxy until GPIO lamp.",
        primaryAction: /* @__PURE__ */ s.jsx(fe, { teal: !0, onClick: () => u("/live/climate"), children: "Climate Want" })
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-status-strip", children: [
      /* @__PURE__ */ s.jsx(
        Q,
        {
          icon: m ? "alert" : "ok",
          label: m ? "CLONE DARK VIOLATION" : "Dark period OK",
          tone: m ? "bad" : "ok",
          pulse: m
        }
      ),
      /* @__PURE__ */ s.jsx(Q, { label: b ? "SF1000 ON" : "SF1000 OFF", tone: b ? "ok" : "muted" }),
      /* @__PURE__ */ s.jsx(
        Q,
        {
          label: g ? "4×8 lamp" : p ? "4×8 Window proxy ON" : "4×8 Window proxy OFF",
          tone: g ? "ok" : "warn"
        }
      ),
      r("binary_sensor.dsc_hub_light_catchup_active") === "on" ? /* @__PURE__ */ s.jsx(Q, { label: "Catch-up", tone: "warn" }) : null,
      r("binary_sensor.dsc_clone_light_missing_in_window") === "on" ? /* @__PURE__ */ s.jsx(Q, { label: "Missing in window", tone: "bad" }) : null
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(Ve, { label: "Next event", value: r("sensor.dsc_next_light_event", "—") }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(Ve, { label: "Expected hours", value: Oe(v, 1), unit: "h" }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(Ve, { label: "Clone expected", value: Oe(y, 1), unit: "h" }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(yt, { label: "Hours", value: v, min: 0, max: 24, unit: "h" }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(se, { className: "dsc-glass", title: "Photoperiod spark", icon: "lighting", children: [
        /* @__PURE__ */ s.jsx(rl, { series: j.series, color: "var(--dsc-amber)", width: 280, height: 36 }),
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { fontSize: 12 }, children: "Window binary is the 4×8 schedule Got until entities.main_light exists." })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-8", children: /* @__PURE__ */ s.jsxs(se, { className: "dsc-glass", title: "SF1000", icon: "lighting", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-demand-row", children: [
          /* @__PURE__ */ s.jsx(
            We,
            {
              entityId: "light.dsc_hub_sf1000_dimmer",
              label: "SF1000",
              icon: "lighting",
              showBrightness: !0
            }
          ),
          /* @__PURE__ */ s.jsx(We, { entityId: "switch.dsc_hub_auto_photoperiod", label: "Auto photoperiod" }),
          /* @__PURE__ */ s.jsx(We, { entityId: "switch.dsc_hub_manual_light_hold", label: "Manual light hold" })
        ] }),
        /* @__PURE__ */ s.jsx(fe, { onClick: () => h(!0), children: "Edit schedule (DecisionLayer)" })
      ] }) })
    ] }),
    /* @__PURE__ */ s.jsxs(en, { open: f, onDismiss: () => h(!1), title: "Light schedule", help: null, children: [
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Same helpers as Lovelace lighting. 4×8 window is the schedule Got until a GPIO lamp exists." }),
      /* @__PURE__ */ s.jsx(We, { entityId: "switch.dsc_hub_auto_photoperiod", label: "Auto photoperiod" }),
      /* @__PURE__ */ s.jsx(Ol, { entityId: "select.dsc_hub_clone_photoperiod", label: "Window source", icon: "clone" }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
        /* @__PURE__ */ s.jsx(Cm, { entityId: "time.dsc_hub_lights_on_time", label: "4×8 opens" }),
        /* @__PURE__ */ s.jsx(pt, { entityId: "number.dsc_hub_sunrise_duration", label: "Sunrise min" }),
        /* @__PURE__ */ s.jsx(pt, { entityId: "number.dsc_hub_sunset_duration", label: "Sunset min" }),
        /* @__PURE__ */ s.jsx(pt, { entityId: "number.dsc_hub_min_dark_hours", label: "Min dark h" })
      ] }),
      r("select.dsc_hub_clone_photoperiod") === "Independent" ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
        /* @__PURE__ */ s.jsx(Cm, { entityId: "time.dsc_hub_clone_lights_on_time", label: "Clone lights-on" }),
        /* @__PURE__ */ s.jsx(pt, { entityId: "number.dsc_hub_clone_light_hours", label: "Clone hours" })
      ] }) : /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
        "Clone follows 4×8 (",
        r("time.dsc_hub_lights_on_time", "—"),
        "). Switch Window source to Independent to unlock clone start/hours."
      ] }),
      /* @__PURE__ */ s.jsx(We, { entityId: "light.dsc_hub_sf1000_dimmer", label: "SF1000", showBrightness: !0 }),
      /* @__PURE__ */ s.jsx(We, { entityId: "switch.dsc_hub_manual_light_hold", label: "Manual light hold" })
    ] })
  ] });
}
function ty() {
  const { callService: a, entity: r, num: o, state: u, available: f } = Te(), [h, m] = _.useState(null), b = Na("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available: f,
    num: o
  }), p = Na("sensor.dsc_cfm_exhaust_recirc_allocated", "sensor.dsc_cfm_exhaust_recirc", {
    available: f,
    num: o
  }), g = u("sensor.dsc_learn_status", "—"), v = u("binary_sensor.dsc_learn_gate", u("sensor.dsc_learn_gate", "—")), y = String(r("sensor.dsc_cfm_exhaust_out")?.attributes?.cal_curve ?? ""), j = u("sensor.dsc_cfm_curves_status", "—");
  return /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsxs(se, { className: "dsc-glass", title: "Learn wizard", icon: "learning", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ s.jsx(Q, { label: `Status ${g}`, tone: g === "—" ? "muted" : "ok" }),
        /* @__PURE__ */ s.jsx(Q, { label: `Gate ${v}`, tone: "muted" }),
        /* @__PURE__ */ s.jsx(Q, { label: `Curves ${j}`, tone: j === "—" ? "muted" : "ok" }),
        /* @__PURE__ */ s.jsx(Dl, { reading: b }),
        /* @__PURE__ */ s.jsx(Dl, { reading: p })
      ] }),
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
        "Nameplate CFM stays % × capacity until ≥2 anemometer points. Do not invent points.",
        y ? ` Curve: ${y}` : ""
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", children: [
        /* @__PURE__ */ s.jsx(fe, { onClick: () => m("gate"), children: "Open gate" }),
        /* @__PURE__ */ s.jsx(fe, { onClick: () => m("sample"), children: "Sample points" }),
        /* @__PURE__ */ s.jsx(fe, { teal: !0, onClick: () => m("accept"), children: "Finish session" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs(en, { open: h === "gate", onDismiss: () => m(null), title: "Learn gate", help: null, children: [
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Target + session. Scripts own hold math." }),
      /* @__PURE__ */ s.jsx(Ol, { entityId: "input_select.dsc_cal_target", label: "Cal target" }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-kpi-sub", children: u("input_text.dsc_cal_status", "") }),
      /* @__PURE__ */ s.jsx(
        fe,
        {
          primary: !0,
          onClick: () => {
            a("script", "turn_on", { entity_id: "script.dsc_cal_start" }), m("sample");
          },
          children: "Start session"
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs(en, { open: h === "sample", onDismiss: () => m(null), title: "Sample", help: null, children: [
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Enter anemometer m/s or CFM. Skip rather than invent. Drafts hold until blur." }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
        /* @__PURE__ */ s.jsx(pt, { entityId: "input_number.dsc_cal_reading_ms", label: "m/s" }),
        /* @__PURE__ */ s.jsx(pt, { entityId: "input_number.dsc_cal_reading_cfm", label: "CFM" }),
        /* @__PURE__ */ s.jsx(pt, { entityId: "input_number.dsc_cal_reading_ppfd", label: "PPFD" }),
        /* @__PURE__ */ s.jsx(pt, { entityId: "input_number.dsc_cal_step_pct", label: "Step %" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", children: [
        /* @__PURE__ */ s.jsx(fe, { onClick: () => void a("script", "turn_on", { entity_id: "script.dsc_cal_hold_next" }), children: "Re-hold" }),
        /* @__PURE__ */ s.jsx(fe, { primary: !0, onClick: () => void a("script", "turn_on", { entity_id: "script.dsc_cal_save_point" }), children: "Save point" }),
        /* @__PURE__ */ s.jsx(fe, { onClick: () => void a("script", "turn_on", { entity_id: "script.dsc_cal_skip_point" }), children: "Skip" }),
        /* @__PURE__ */ s.jsx(fe, { onClick: () => void a("script", "turn_on", { entity_id: "script.dsc_cal_abort" }), children: "Abort" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsx(
      en,
      {
        open: h === "accept",
        onDismiss: () => m(null),
        onConfirm: () => {
          a("script", "turn_on", { entity_id: "script.dsc_cal_finish" }), m(null);
        },
        title: "Finish session",
        confirmLabel: "Finish",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          "Curve status ",
          j,
          ". Finish restores snapped fans/light. Points already saved at 25/50/75/100 stay; this does not invent a fit."
        ] })
      }
    )
  ] });
}
function ny() {
  const { available: a, num: r, state: o } = Te(), u = o("input_boolean.dsc_tank_in_service") === "on", f = a("input_number.dsc_tank_level_pct") || a("sensor.dsc_tank_level_pct"), h = a("sensor.dsc_tank_level_pct") ? r("sensor.dsc_tank_level_pct") : r("input_number.dsc_tank_level_pct"), m = f && Number.isFinite(h), b = a("sensor.dsc_tank_ec_normalized"), p = a("sensor.dsc_tank_ph_calibrated"), g = a("sensor.water_tester_temperature"), v = o("input_boolean.dsc_tank_pump_active") === "on", y = m ? Math.max(4, Math.min(100, h)) : 0;
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-tank-cutaway", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ s.jsx(Q, { label: u ? "In service" : "OOS", tone: u ? "ok" : "warn" }),
      m ? null : /* @__PURE__ */ s.jsx(Q, { label: "Level unknown — empty, not guessed", tone: "warn" }),
      v ? /* @__PURE__ */ s.jsx(Q, { label: "Pump ON", tone: "ok", pulse: !0 }) : /* @__PURE__ */ s.jsx(Q, { label: "Pump off", tone: "muted" })
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
          strokeDasharray: m ? void 0 : "7 5"
        }
      ),
      m ? /* @__PURE__ */ s.jsx(
        "rect",
        {
          x: "28",
          y: 26 + 176 * (1 - y / 100),
          width: "124",
          height: 176 * y / 100,
          fill: "rgba(38,198,218,0.22)"
        }
      ) : null,
      b ? /* @__PURE__ */ s.jsx("rect", { x: "32", y: "36", width: "116", height: "10", fill: "rgba(255,183,77,0.55)" }) : null,
      /* @__PURE__ */ s.jsx("rect", { x: "24", y: "18", width: "132", height: "12", fill: "none", stroke: p ? "var(--dsc-purple)" : "var(--dsc-gray-5)", strokeWidth: "3" }),
      v ? [0, 1, 2].map((j) => /* @__PURE__ */ s.jsx("circle", { cx: 90 + (j - 1) * 18, cy: "188", r: "4", fill: "var(--dsc-teal)", opacity: 0.5 + j * 0.15 }, j)) : null
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-kpi-sub", children: [
      "EC ",
      b ? `${Math.round(r("sensor.dsc_tank_ec_normalized"))} µS` : "—",
      " · pH",
      " ",
      p ? r("sensor.dsc_tank_ph_calibrated").toFixed(2) : "—",
      " · T",
      " ",
      g ? `${r("sensor.water_tester_temperature").toFixed(1)} °C` : "—"
    ] })
  ] });
}
const qm = ["var(--dsc-blue)", "var(--dsc-teal)", "var(--dsc-purple)", "var(--dsc-amber)"];
function ly() {
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      $t,
      {
        icon: "learning",
        title: "Learning",
        subtitle: "Anemometer gate, sample, accept — scripts own the math. No dsc-hub-pro."
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ty, {}) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(se, { className: "dsc-glass", title: "Kit / In service", icon: "settings", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-row", children: [
        /* @__PURE__ */ s.jsx(We, { entityId: "input_boolean.dsc_ac_in_service", label: "AC in service", icon: "climate" }),
        /* @__PURE__ */ s.jsx(
          We,
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
function ay() {
  const { state: a, num: r, available: o } = Te(), { hours: u, setHours: f, maxPoints: h } = xc(6), m = Be("sensor.dsc_hub_tent_temperature", { maxPoints: h, hours: u }), b = Be("sensor.dsc_hub_tent_humidity", { maxPoints: h, hours: u }), p = Be(ol(1, "moisture", a), { maxPoints: h, hours: u }), g = Be(ol(2, "moisture", a), { maxPoints: h, hours: u }), v = Be(ol(3, "moisture", a), { maxPoints: h, hours: u }), y = Be(ol(4, "moisture", a), { maxPoints: h, hours: u }), E = [
    { n: 1, series: p },
    { n: 2, series: g },
    { n: 3, series: v },
    { n: 4, series: y }
  ].filter((M) => Gt(M.n, a)), A = fl.filter((M) => Gt(M, a)).map((M) => ({ n: M, need: a(`sensor.dsc_pot${M}_need_summary`, "—") })).find((M) => M.need && M.need !== "—" && !/^ok$/i.test(M.need));
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      $t,
      {
        icon: "analytics",
        title: "Analytics",
        subtitle: "In-service pots. Climate charts live on Climate; this is the root pack."
      }
    ),
    /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: /* @__PURE__ */ s.jsx(
      oo,
      {
        hours: u,
        setHours: f,
        extras: yp
      }
    ) }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(se, { className: "dsc-glass", title: "Tent T + RH (secondary)", icon: "climate", children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Primary traces sit on Climate. Ghost/compare there, not a second dashboard." }),
        /* @__PURE__ */ s.jsx(
          hn,
          {
            live: !0,
            lastSyncAt: Math.max(m.lastSyncAt ?? 0, b.lastSyncAt ?? 0) || void 0,
            series: [
              {
                id: "t",
                label: "Temp °C",
                series: m.series,
                color: "var(--dsc-blue)",
                axis: "left",
                unit: "°C"
              },
              {
                id: "rh",
                label: "RH %",
                series: b.series,
                color: "var(--dsc-teal)",
                axis: "right",
                unit: "%"
              }
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(se, { className: "dsc-glass", title: "Root pack — moisture (in service)", icon: "root", children: [
        E.length ? /* @__PURE__ */ s.jsx(
          hn,
          {
            live: !0,
            unit: "%",
            lastSyncAt: Math.max(...E.map((M) => M.series.lastSyncAt ?? 0)) || void 0,
            series: E.map((M, T) => ({
              id: `p${M.n}`,
              label: A?.n === M.n ? `P${M.n} Need` : `P${M.n}`,
              series: M.series.series,
              color: qm[T % qm.length],
              unit: "%"
            }))
          }
        ) : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "No in-service pots." }),
        A ? /* @__PURE__ */ s.jsxs("p", { className: "dsc-kpi-sub", children: [
          "Worst Need P",
          A.n,
          ": ",
          A.need
        ] }) : null
      ] }) })
    ] })
  ] });
}
function lc(a, r) {
  return r ? a ? "ok" : "oos" : "missing";
}
function sy() {
  const { state: a, available: r, num: o } = Te(), u = ro(a), f = a("binary_sensor.dsc_hub_link") === "on", m = [
    { id: "hub", label: "Hub", status: r("binary_sensor.dsc_hub_link") ? f ? "ok" : "dark" : "missing" },
    {
      id: "ac",
      label: "AC",
      status: lc(
        a("input_boolean.dsc_ac_in_service") === "on",
        r("input_boolean.dsc_ac_in_service")
      )
    },
    {
      id: "mister",
      label: "Mister",
      status: lc(
        a("input_boolean.dsc_clone_humidifier_in_service") === "on",
        r("input_boolean.dsc_clone_humidifier_in_service")
      )
    },
    ...fl.map((g) => ({
      id: `pot${g}`,
      label: `P${g}`,
      status: lc(Gt(g, a), r(`input_boolean.dsc_pot${g}_in_service`))
    })),
    {
      id: "tank",
      label: "Tank",
      status: lc(
        a("input_boolean.dsc_tank_in_service") === "on",
        r("input_boolean.dsc_tank_in_service")
      )
    }
  ], b = Na("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available: r,
    num: o
  }), p = [
    { label: "Bridge hub ESP-NOW", id: "binary_sensor.dsc_bridge_hub_esp_now_link" },
    { label: "ESP-NOW age", id: "sensor.dsc_bridge_esp_now_age" },
    { label: "Hub firmware", id: "sensor.dsc_hub_firmware_version" },
    { label: "Control firmware", id: "sensor.dsc_control_firmware_version" },
    { label: "Pot1 firmware", id: "sensor.dsc_pot1_firmware_version" },
    { label: "Pot2 firmware", id: "sensor.dsc_pot2_firmware_version" },
    { label: "Pot3 firmware", id: "sensor.dsc_pot3_firmware_version" },
    { label: "Pot4 firmware", id: "sensor.dsc_pot4_firmware_version" },
    { label: "Nest / SoftAP channel", id: "sensor.dsc_hub_wifi_channel" }
  ];
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      $t,
      {
        icon: "fleet",
        title: "Fleet",
        subtitle: `${u.inService} of ${u.total} in service. Kit Pulse holes, tank tester, bridge table.`
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(Np, {}) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(
        Ve,
        {
          label: "In service",
          value: `${u.inService}/${u.total}`,
          tone: u.inService === u.total ? "ok" : "warn"
        }
      ) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(
        Ve,
        {
          label: "Surface",
          value: a("sensor.dsc_ha_surface_version", "7.1.4"),
          sub: "Panel product shell"
        }
      ) }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-col-4", children: [
        /* @__PURE__ */ s.jsx(
          Ve,
          {
            label: "Alerts",
            value: Number.isFinite(o("sensor.dsc_active_alert_count")) ? o("sensor.dsc_active_alert_count") : "—",
            tone: o("sensor.dsc_active_alert_count", 0) === 0 ? "ok" : "bad"
          }
        ),
        /* @__PURE__ */ s.jsx(Dl, { reading: b })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(se, { className: "dsc-glass", title: "Kit Pulse", icon: "system", children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Holes are missing / OOS / dark hub — not a greenwashed map." }),
        /* @__PURE__ */ s.jsx(Mp, { nodes: m })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(se, { className: "dsc-glass", title: "Kit / In service", icon: "settings", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-row", children: [
        /* @__PURE__ */ s.jsx(We, { entityId: "input_boolean.dsc_ac_in_service", label: "AC in service", icon: "climate" }),
        /* @__PURE__ */ s.jsx(
          We,
          {
            entityId: "input_boolean.dsc_clone_humidifier_in_service",
            label: "Clone mister",
            icon: "clone"
          }
        ),
        /* @__PURE__ */ s.jsx(We, { entityId: "input_boolean.dsc_pot1_in_service", label: "Pot 1", icon: "root" }),
        /* @__PURE__ */ s.jsx(We, { entityId: "input_boolean.dsc_pot2_in_service", label: "Pot 2", icon: "root" }),
        /* @__PURE__ */ s.jsx(We, { entityId: "input_boolean.dsc_pot3_in_service", label: "Pot 3", icon: "root" }),
        /* @__PURE__ */ s.jsx(We, { entityId: "input_boolean.dsc_pot4_in_service", label: "Pot 4", icon: "root" }),
        /* @__PURE__ */ s.jsx(We, { entityId: "input_boolean.dsc_tank_in_service", label: "Tank", icon: "tank" })
      ] }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(se, { className: "dsc-glass", title: "Tank", icon: "tank", children: [
        /* @__PURE__ */ s.jsx(ny, {}),
        /* @__PURE__ */ s.jsxs("p", { className: "dsc-kpi-sub", children: [
          "Stage ",
          a("input_select.dsc_tank_stage", "—"),
          " · Type",
          " ",
          a("input_select.dsc_tank_plant_type", "—")
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(se, { className: "dsc-glass", title: "Bridge / firmware", icon: "fleet", children: /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "Signal" }),
          /* @__PURE__ */ s.jsx("th", { children: "State" })
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: p.map((g) => /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("td", { children: g.label }),
          /* @__PURE__ */ s.jsx("td", { children: r(g.id) ? a(g.id, "—") : /* @__PURE__ */ s.jsx(Q, { label: "hole", tone: "warn" }) })
        ] }, g.id)) })
      ] }) }) })
    ] })
  ] });
}
const iy = [
  { id: "live", label: "Live", path: "/live/mission", icon: "live" },
  { id: "grow", label: "Grow", path: "/grow/compose", icon: "grow" },
  { id: "tune", label: "Tune", path: "/tune/learning", icon: "tune" },
  { id: "fleet", label: "Fleet", path: "/fleet", icon: "fleet" }
], cy = {
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
}, ry = {
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
function uy(a) {
  return a.startsWith("/grow") || a.startsWith("/plant") ? "grow" : a.startsWith("/tune") || a.startsWith("/advanced") ? "tune" : a.startsWith("/fleet") || a.startsWith("/system") ? "fleet" : "live";
}
function oy(a, r) {
  const o = ry[a];
  return o ? o.includes("?") ? o : `${o}${r || ""}` : null;
}
const dy = ':host,.dsc-root{--dsc-black: #0c1220;--dsc-black-2: #121a2c;--dsc-gray-1: #182238;--dsc-gray-2: #22304c;--dsc-gray-3: #334566;--dsc-gray-4: #8b95ab;--dsc-gray-5: #b6bfd4;--dsc-blue: #5b9bff;--dsc-blue-dim: rgba(91, 155, 255, .4);--dsc-purple: #a78bfa;--dsc-purple-dim: rgba(167, 139, 250, .35);--dsc-neon: #3dde7a;--dsc-neon-dim: rgba(61, 222, 122, .32);--dsc-neon-glow: rgba(61, 222, 122, .4);--dsc-teal: #2ec4d6;--dsc-teal-dim: rgba(46, 196, 214, .45);--dsc-teal-glow: rgba(46, 196, 214, .55);--dsc-amber: #ffb74d;--dsc-bad: #ff6b8a;--dsc-bad-soft: #ff8aa3;--dsc-soil-1: #5b9f6b;--dsc-soil-2: #4a8f9f;--dsc-soil-3: #c4a35a;--dsc-soil-4: #8d6e63;--dsc-glass: rgba(18, 26, 44, .78);--dsc-glass-border: rgba(130, 165, 230, .34);--dsc-white: #f2f5fb;--dsc-shadow: 0 8px 24px rgba(0, 0, 0, .45);--dsc-shadow-tight: 0 2px 8px rgba(0, 0, 0, .55);--dsc-radius: 10px;--dsc-radius-lg: 14px;--dsc-font: "Segoe UI", "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;--dsc-mono: "Cascadia Code", "IBM Plex Mono", ui-monospace, monospace;color:var(--dsc-white);background:var(--dsc-black);font-family:var(--dsc-font);display:block;height:100%;box-sizing:border-box}*,*:before,*:after{box-sizing:border-box}.dsc-root{height:100%;min-height:100%;overflow:auto;background:radial-gradient(1100px 560px at 8% -12%,rgba(91,155,255,.18),transparent 55%),radial-gradient(900px 520px at 92% -8%,rgba(46,196,214,.12),transparent 50%),radial-gradient(700px 420px at 70% 100%,rgba(61,222,122,.05),transparent 55%),var(--dsc-black)}.dsc-honesty-rail{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}.dsc-next-rec{border-color:var(--dsc-blue-dim)}.dsc-twin-keepalive{display:none;margin-bottom:12px;min-height:0}.dsc-twin-keepalive.is-active{display:block;min-height:min(70vh,720px)}.dsc-twin-keepalive-host{min-height:min(68vh,700px)}.dsc-twin-keepalive-host>*{min-height:min(68vh,700px)}.dsc-tab--live.active{color:var(--dsc-blue);border-color:var(--dsc-blue-dim)}.dsc-tab--grow.active{color:var(--dsc-teal);border-color:var(--dsc-teal-dim)}.dsc-tab--tune.active{color:var(--dsc-purple);border-color:var(--dsc-purple-dim)}.dsc-tab--fleet.active{color:var(--dsc-blue);border-color:var(--dsc-blue-dim)}.dsc-secondary-tabs .dsc-tab.active{color:var(--dsc-teal);border-color:var(--dsc-teal-dim);box-shadow:0 0 0 1px var(--dsc-blue-dim)}.dsc-tent-segment{display:inline-flex;gap:4px;padding:3px;border-radius:999px;background:var(--dsc-gray-1);border:1px solid var(--dsc-glass-border)}.dsc-tent-segment button{appearance:none;border:0;background:transparent;color:var(--dsc-gray-5);padding:6px 12px;border-radius:999px;cursor:pointer;font:inherit;font-size:.85rem}.dsc-tent-segment button.is-active{background:var(--dsc-gray-2);color:var(--dsc-white);box-shadow:var(--dsc-shadow-tight)}.dsc-tent-segment button[data-tent=main].is-active{color:var(--dsc-blue)}.dsc-tent-segment button[data-tent=clone].is-active{color:var(--dsc-purple)}.dsc-tent-segment button[data-tent=compare].is-active{color:var(--dsc-teal)}.dsc-shell{display:flex;flex-direction:column;min-height:100%;max-width:1600px;margin:0 auto;padding:16px 20px 28px}.dsc-brand-row{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:10px}.dsc-brand{display:flex;align-items:center;gap:12px;color:var(--dsc-white);text-decoration:none}.dsc-brand img,.dsc-brand svg{width:36px;height:36px;color:var(--dsc-neon)}.dsc-brand-title{display:flex;flex-direction:column;gap:2px}.dsc-brand-title strong{font-size:1.05rem;letter-spacing:.04em;font-weight:700;line-height:1.25;max-width:min(52vw,28rem)}.dsc-brand-wordmark{height:18px;width:auto;max-width:160px;display:block;color:var(--dsc-text, #eef1f8);line-height:0}.dsc-brand-wordmark svg{width:auto;height:18px;display:block}.dsc-icon svg{width:100%;height:100%;display:block}.dsc-brand-title span{font-size:.72rem;color:var(--dsc-gray-5);letter-spacing:.08em;text-transform:uppercase}.dsc-page-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px}.dsc-page-header-main{display:flex;align-items:flex-start;gap:10px}.dsc-page-header-actions{display:flex;align-items:center;gap:6px;flex-shrink:0}.dsc-card-title{display:inline-flex;align-items:center;gap:8px}.dsc-primary-tabs,.dsc-secondary-tabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:thin;padding-bottom:2px;-webkit-overflow-scrolling:touch}.dsc-primary-tabs{border-bottom:1px solid var(--dsc-gray-3);margin-bottom:8px}.dsc-secondary-tabs{margin-bottom:16px;mask-image:linear-gradient(90deg,#000 85%,transparent)}.dsc-secondary-tabs:after{content:"";flex:0 0 12px}.dsc-tab{appearance:none;border:1px solid transparent;background:transparent;color:var(--dsc-gray-5);padding:10px 14px;min-height:44px;border-radius:8px 8px 0 0;cursor:pointer;font:inherit;font-size:.92rem;letter-spacing:.04em;white-space:nowrap;display:inline-flex;align-items:center;gap:8px;transition:transform .1s ease,box-shadow .1s ease,color .15s ease,border-color .15s ease,background .15s ease;text-decoration:none}.dsc-tab span[role=img]{opacity:.9;flex-shrink:0}.dsc-tab:hover{color:var(--dsc-white);background:var(--dsc-gray-1)}.dsc-tab:focus-visible{outline:2px solid var(--dsc-neon);outline-offset:2px}.dsc-tab.active{color:var(--dsc-white);border-bottom:2px solid var(--dsc-neon);box-shadow:0 6px 18px #39ff1414}.dsc-secondary-tabs .dsc-tab{border-radius:999px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-1);min-height:40px;padding:8px 14px}.dsc-secondary-tabs .dsc-tab.active{border-color:var(--dsc-neon-dim);color:var(--dsc-neon);background:#39ff1414;box-shadow:var(--dsc-shadow-tight)}.dsc-btn{appearance:none;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);border-radius:8px;padding:10px 16px;min-height:40px;font:inherit;cursor:pointer;box-shadow:var(--dsc-shadow-tight);transition:transform .1s ease,box-shadow .1s ease,border-color .12s ease,background .12s ease}.dsc-btn:hover{border-color:var(--dsc-neon-dim)}.dsc-btn:active,.dsc-tab:active{transform:translateY(1px);box-shadow:0 1px 3px #000000a6}.dsc-btn.primary{border-color:var(--dsc-neon-dim);color:var(--dsc-black);background:var(--dsc-neon);font-weight:650}.dsc-page{animation:dsc-fade .18s ease}@keyframes dsc-fade{0%{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.dsc-page,.dsc-btn,.dsc-tab,.dsc-live-pulse{animation:none!important;transition:none!important}}.dsc-grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:14px}.dsc-col-3{grid-column:span 3}.dsc-col-4{grid-column:span 4}.dsc-col-6{grid-column:span 6}.dsc-col-8{grid-column:span 8}.dsc-col-12{grid-column:span 12}@media(max-width:1100px){.dsc-col-3,.dsc-col-4{grid-column:span 6}.dsc-col-8{grid-column:span 12}}@media(max-width:720px){.dsc-shell{padding:12px}.dsc-col-3,.dsc-col-4,.dsc-col-6,.dsc-col-8{grid-column:span 12}}.dsc-card{background:linear-gradient(165deg,var(--dsc-gray-1),var(--dsc-black-2));border:1px solid var(--dsc-gray-3);border-radius:var(--dsc-radius);box-shadow:var(--dsc-shadow);padding:14px 16px;min-height:88px}.dsc-card h2,.dsc-card h3{margin:0 0 8px;font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;color:var(--dsc-gray-5);font-weight:600}.dsc-kpi-value{font-size:1.85rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:.02em;color:var(--dsc-white)}.dsc-kpi-unit{margin-left:6px;font-size:.85rem;color:var(--dsc-gray-5)}.dsc-kpi-sub{margin-top:6px;color:var(--dsc-gray-5);font-size:.82rem}.dsc-status-ok{color:var(--dsc-neon)}.dsc-status-bad{color:var(--dsc-bad)}.dsc-status-muted{color:var(--dsc-gray-5)}.dsc-page-title{margin:0 0 14px;font-size:1.35rem;letter-spacing:.04em}.dsc-muted{color:var(--dsc-gray-5)}.dsc-legacy-host{min-height:420px;border-radius:var(--dsc-radius);overflow:hidden;border:1px solid var(--dsc-gray-3);background:#000}.dsc-legacy-host--empty{background:var(--dsc-gray-1);min-height:160px}.dsc-legacy-host>*{display:block;width:100%}.dsc-status-strip{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}.dsc-chip-row{display:flex;flex-wrap:wrap;gap:8px}.dsc-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-1);font-size:.75rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-chip--ok{color:var(--dsc-neon);border-color:var(--dsc-neon-dim);background:#39ff1414;box-shadow:0 0 12px #39ff141f}.dsc-chip--bad{color:var(--dsc-bad-soft);border-color:color-mix(in srgb,var(--dsc-bad) 45%,transparent);background:color-mix(in srgb,var(--dsc-bad) 12%,transparent)}.dsc-chip--warn{color:var(--dsc-amber);border-color:color-mix(in srgb,var(--dsc-amber) 45%,transparent);background:color-mix(in srgb,var(--dsc-amber) 12%,transparent)}.dsc-chip--muted{color:var(--dsc-gray-5)}.dsc-chip--pulse{animation:dsc-chip-pulse 1.6s ease-in-out infinite}@keyframes dsc-chip-pulse{0%,to{box-shadow:0 0 #39ff1400}50%{box-shadow:0 0 14px #39ff1459}}.dsc-demand-row{display:flex;flex-wrap:wrap;gap:8px}.dsc-demand-row--stack{flex-direction:column}.dsc-demand{appearance:none;flex:1 1 110px;min-height:52px;padding:10px 12px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);font:inherit;cursor:pointer;display:flex;flex-direction:column;align-items:flex-start;gap:4px;box-shadow:var(--dsc-shadow-tight);transition:transform .1s ease,box-shadow .1s ease,border-color .12s ease,background .12s ease}.dsc-demand:hover{border-color:var(--dsc-neon-dim)}.dsc-demand:active{transform:translateY(1px);box-shadow:0 1px 3px #000000a6}.dsc-demand.is-on{border-color:var(--dsc-neon);background:#39ff141a;box-shadow:0 0 0 1px #39ff1440,0 0 18px #39ff1433}.dsc-demand.is-missing{opacity:.55;cursor:not-allowed}.dsc-demand-label{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-demand.is-on .dsc-demand-label{color:var(--dsc-neon)}.dsc-demand-state{font-weight:700;font-variant-numeric:tabular-nums;font-size:1rem}.dsc-demand-icon{margin-bottom:4px;opacity:.95}.dsc-mode-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}.dsc-mode-selects{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}.dsc-entity-select{display:flex;flex-direction:column;gap:6px;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-entity-select-label{display:inline-flex;align-items:center;gap:6px}.dsc-entity-select select{appearance:none;min-height:40px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);padding:8px 12px;font:inherit;text-transform:none;letter-spacing:0}.dsc-entity-select.is-disabled{opacity:.55}.dsc-fan-stack{display:flex;flex-direction:column;gap:10px}.dsc-fan-slider{display:flex;flex-direction:column;gap:4px}.dsc-fan-slider-label{display:flex;align-items:baseline;gap:8px;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-fan-slider-label strong{color:var(--dsc-teal);font-variant-numeric:tabular-nums}.dsc-fan-slider input[type=range]{width:100%;accent-color:var(--dsc-teal)}.dsc-fan-slider.is-disabled{opacity:.5}.dsc-honesty{margin:10px 0 0;font-size:.85rem;color:var(--dsc-gray-5);display:flex;flex-wrap:wrap;align-items:center;gap:8px}.dsc-target-panel{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}.dsc-target-panel.is-compact .dsc-target-grid{grid-template-columns:repeat(auto-fit,minmax(90px,1fr))}.dsc-tent-targets{border:1px solid var(--dsc-glass-border);border-radius:var(--dsc-radius);padding:10px 12px;background:#0000002e}.dsc-tent-targets-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}.dsc-got-want{display:flex;flex-direction:column;gap:2px;font-size:.82rem;margin-bottom:10px}.dsc-target-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px}.dsc-target-num{display:flex;flex-direction:column;gap:4px;font-size:.7rem;letter-spacing:.06em;color:var(--dsc-gray-5)}.dsc-target-num-label{text-transform:uppercase}.dsc-target-num input,.dsc-target-num textarea{min-height:36px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);padding:6px 8px;font:inherit;font-variant-numeric:tabular-nums}.dsc-target-num textarea{text-transform:none;letter-spacing:0;min-height:56px;resize:vertical}.dsc-target-num.is-disabled{opacity:.55}.dsc-chart{position:relative}.dsc-chart-svg{cursor:crosshair;touch-action:none}.dsc-chart-tooltip{position:absolute;top:8px;transform:translate(-50%);pointer-events:none;z-index:2;min-width:120px;padding:8px 10px;border-radius:8px;border:1px solid var(--dsc-glass-border);background:var(--dsc-glass);backdrop-filter:blur(10px);box-shadow:var(--dsc-shadow-tight);font-size:.75rem}.dsc-chart-tooltip-time{color:var(--dsc-teal);font-family:var(--dsc-mono);margin-bottom:4px}.dsc-chart-tooltip-row{display:flex;align-items:center;gap:6px;color:var(--dsc-white)}.dsc-chart-tooltip-row i{width:7px;height:7px;border-radius:50%;display:inline-block}@keyframes dsc-sync-pulse{0%{stroke-dashoffset:1;opacity:.2}35%{opacity:1}to{stroke-dashoffset:0;opacity:0}}@media(prefers-reduced-motion:reduce){.dsc-chart-pulse{animation:none!important;opacity:.85}}.dsc-gauge.is-warn .dsc-gauge-label{color:var(--dsc-amber)}.dsc-gauge-row{display:flex;justify-content:space-around;flex-wrap:wrap;gap:8px}.dsc-gauge-matrix{display:flex;flex-direction:column;gap:8px}.dsc-gauge-row-3{display:grid;grid-template-columns:14px repeat(3,minmax(0,1fr));align-items:center;gap:2px 4px;border:1px solid transparent;border-radius:12px;padding:2px 4px 4px;transition:box-shadow .25s ease,border-color .25s ease,background .25s ease}.dsc-gauge-row-3.is-lit{border-color:#ffd54f80;background:linear-gradient(180deg,#ffc1071a,#0c121c59);box-shadow:0 0 28px #ffc10747,inset 0 0 16px #ffd54f12}.dsc-gauge-row-tag{font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--dsc-gray-5);writing-mode:vertical-rl;transform:rotate(180deg);justify-self:center;padding:2px 0}.dsc-gauge-row-3 .dsc-gauge{min-width:0}.dsc-gauge-cell{min-width:0;display:flex;flex-direction:column;align-items:center;gap:2px}.dsc-gauge-cell .dsc-sparkline{width:100%;max-width:88px;opacity:.9}.dsc-gauge-row-3 .dsc-gauge svg{width:100%;max-width:96px;height:auto;max-height:72px}.dsc-gauge-row-3 .dsc-gauge-label{font-size:10px}.dsc-gauge-zone{border:1px solid transparent;border-radius:12px;padding:8px 6px 10px;transition:box-shadow .25s ease,border-color .25s ease,background .25s ease}.dsc-gauge-zone.is-lit{border-color:#ffd54f80;background:linear-gradient(180deg,#ffc1071a,#0c121c59);box-shadow:0 0 28px #ffc10747,inset 0 0 16px #ffd54f12}.dsc-gauge-zone-label{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5);margin:0 4px 6px}.dsc-gauge{display:flex;flex-direction:column;align-items:center;gap:4px}.dsc-gauge-label{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-chart-legend{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:4px;min-height:20px}.dsc-chart-legend-item{display:inline-flex;align-items:center;gap:6px;font-size:.75rem;color:var(--dsc-gray-5)}.dsc-chart-legend-item i{width:8px;height:8px;border-radius:50%;display:inline-block;box-shadow:0 0 6px currentColor}.dsc-chart-last{margin-left:auto;font-variant-numeric:tabular-nums;color:var(--dsc-neon);font-size:13px;font-weight:650}.dsc-fault-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.dsc-fault-list li{display:flex;flex-wrap:wrap;align-items:center;gap:10px}.dsc-empty{padding:18px 14px;border:1px dashed var(--dsc-gray-3);border-radius:8px;color:var(--dsc-gray-5);background:#00000040;font-size:.9rem;line-height:1.45}.dsc-empty--ok{border-style:solid;border-color:var(--dsc-neon-dim);color:var(--dsc-neon)}.dsc-btn:disabled{opacity:.45;cursor:not-allowed}.dsc-glass{background:var(--dsc-glass);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid var(--dsc-glass-border);border-radius:var(--dsc-radius-lg);box-shadow:var(--dsc-shadow)}.dsc-glass--glow{border-color:var(--dsc-teal-dim);box-shadow:0 0 0 1px #26c6da26,0 0 24px #26c6da1f}.dsc-icon-btn{appearance:none;width:36px;height:36px;padding:0;display:inline-flex;align-items:center;justify-content:center;border-radius:10px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);cursor:pointer;box-shadow:var(--dsc-shadow-tight);transition:border-color .12s ease,background .12s ease,transform .1s ease}.dsc-icon-btn:hover{border-color:var(--dsc-teal-dim);color:var(--dsc-teal)}.dsc-icon-btn:active{transform:translateY(1px)}.dsc-result-chip{display:inline-flex;align-items:center;gap:8px;max-width:100%;padding:8px 12px;border-radius:999px;border:1px solid var(--dsc-teal-dim);background:#26c6da1a;color:var(--dsc-white);font-size:.9rem}.dsc-result-chip span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dsc-overflow{position:relative;display:inline-block}.dsc-overflow-menu{position:absolute;right:0;top:calc(100% + 6px);z-index:40;min-width:180px;padding:6px;background:var(--dsc-black-2);border:1px solid var(--dsc-gray-3);border-radius:10px;box-shadow:var(--dsc-shadow)}.dsc-overflow-menu button{appearance:none;width:100%;text-align:left;border:0;background:transparent;color:var(--dsc-white);font:inherit;font-size:.88rem;padding:10px 12px;border-radius:8px;cursor:pointer}.dsc-overflow-menu button:hover{background:#26c6da1f;color:var(--dsc-teal)}.dsc-drawer-root{position:fixed;inset:0;z-index:80;pointer-events:none}.dsc-drawer-root.is-open{pointer-events:auto}.dsc-drawer-scrim{position:absolute;inset:0;background:#00000073;opacity:0;transition:opacity .18s ease}.dsc-drawer-root.is-open .dsc-drawer-scrim{opacity:1}.dsc-drawer-panel{position:absolute;top:0;bottom:0;width:min(380px,92vw);background:linear-gradient(165deg,#121a16,#0a100e);border:1px solid var(--dsc-glass-border);box-shadow:-12px 0 40px #0000008c;display:flex;flex-direction:column;transition:transform .22s ease}.dsc-drawer-panel.right{right:0;transform:translate(105%);border-radius:14px 0 0 14px}.dsc-drawer-panel.left{left:0;transform:translate(-105%);border-radius:0 14px 14px 0}.dsc-drawer-root.is-open .dsc-drawer-panel.right,.dsc-drawer-root.is-open .dsc-drawer-panel.left{transform:none}.dsc-drawer-rail{position:absolute;top:50%;transform:translateY(-50%);width:28px;height:64px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:2}.dsc-drawer-panel.right .dsc-drawer-rail{left:-28px;border-radius:10px 0 0 10px}.dsc-drawer-panel.left .dsc-drawer-rail{right:-28px;border-radius:0 10px 10px 0}.dsc-drawer-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid var(--dsc-gray-3)}.dsc-drawer-head h2{margin:0;font-size:.85rem;letter-spacing:.12em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-drawer-body{flex:1;overflow:auto;padding:14px 16px}.dsc-soil{width:100%;max-width:280px;margin:0 auto}.dsc-soil-pot{position:relative;width:100%;aspect-ratio:4 / 5;border-radius:12px 12px 28px 28px;border:2px solid rgba(120,160,130,.45);background:linear-gradient(180deg,#1a1410,#0e0c0a);overflow:hidden;box-shadow:inset 0 0 24px #0000008c,0 0 20px #26c6da14}.dsc-soil-pot.is-valid{border-color:var(--dsc-teal-dim);box-shadow:inset 0 0 24px #0000008c,0 0 28px #26c6da47,0 0 42px #39ff141f}.dsc-soil-layer{position:absolute;left:8%;right:8%;display:flex;align-items:center;justify-content:center;font-size:.72rem;letter-spacing:.04em;color:#f4f7f4eb;text-shadow:0 1px 2px rgba(0,0,0,.65);border-top:1px solid rgba(255,255,255,.08)}.dsc-soil-empty{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--dsc-gray-5);font-size:.85rem;padding:16px;text-align:center}.dsc-seat-layout{display:grid;grid-template-columns:minmax(200px,320px) 1fr;gap:18px;align-items:start}@media(max-width:900px){.dsc-seat-layout{grid-template-columns:1fr}}.dsc-seat-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.dsc-table{width:100%;border-collapse:collapse;font-size:.88rem}.dsc-table th,.dsc-table td{text-align:left;padding:8px 6px;border-bottom:1px solid var(--dsc-gray-3)}.dsc-table th{font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--dsc-gray-5);font-weight:600}.dsc-table tr{cursor:pointer}.dsc-table tr:hover td{background:#26c6da0f}.dsc-btn.teal{border-color:var(--dsc-teal-dim);background:#26c6da2e;color:var(--dsc-white);box-shadow:0 0 18px #26c6da33}.dsc-btn.teal.primary{background:var(--dsc-teal);color:#041018;font-weight:650}.dsc-held-tag{margin-left:8px;font-size:.65rem;letter-spacing:.08em;color:var(--dsc-amber);vertical-align:middle}.dsc-kpi-hit,.dsc-gauge-hit{appearance:none;border:0;background:transparent;padding:0;margin:0;color:inherit;font:inherit;text-align:left;cursor:pointer;width:100%;display:block}.dsc-card.is-stale,.dsc-gauge.is-stale{opacity:.88;border-color:var(--dsc-amber)}.dsc-gauge.is-clickable:hover,.dsc-kpi-hit:hover .dsc-card{border-color:var(--dsc-blue-dim)}.dsc-timespan{display:inline-flex;flex-wrap:wrap;gap:6px}.dsc-spark-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}.dsc-sparkline{display:block;margin-top:4px}.dsc-gotwant{display:flex;flex-direction:column;gap:10px}.dsc-gotwant-row{display:grid;grid-template-columns:64px 1fr;gap:6px 10px;align-items:center}.dsc-gotwant-label{font-size:.75rem;color:var(--dsc-gray-5);letter-spacing:.04em}.dsc-gotwant-track{position:relative;height:10px;border-radius:999px;background:#ffffff0f;overflow:hidden;grid-column:2}.dsc-gotwant-want{position:absolute;inset:0 auto 0 0;background:#2ec4d647;border-right:1px solid var(--dsc-teal)}.dsc-gotwant-got{position:absolute;inset:2px auto 2px 0;background:linear-gradient(90deg,var(--dsc-blue),var(--dsc-teal));border-radius:999px}.dsc-gotwant-vals{grid-column:2;display:flex;justify-content:space-between;font-size:.72rem;font-family:var(--dsc-mono)}.dsc-seat-editors{display:grid;gap:10px}.dsc-seat-editors label{display:flex;flex-direction:column;gap:4px;font-size:.75rem;color:var(--dsc-gray-5)}.dsc-seat-editors input,.dsc-seat-editors select,.dsc-seat-editors textarea{background:var(--dsc-gray-1);border:1px solid var(--dsc-glass-border);border-radius:8px;color:var(--dsc-white);padding:8px 10px;font:inherit}.dsc-root-matrix .dsc-tone-ok{color:var(--dsc-neon)}.dsc-root-matrix .dsc-tone-warn{color:var(--dsc-amber)}.dsc-root-matrix .dsc-tone-bad{color:var(--dsc-bad)}.dsc-root-matrix .dsc-tone-stale{color:var(--dsc-amber);opacity:.85}.dsc-tent-cockpit-strip{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}@media(prefers-reduced-motion:reduce){.dsc-drawer-panel,.dsc-drawer-scrim{transition:none!important}}.dsc-decision-root{position:fixed;inset:0;z-index:120;display:flex;align-items:center;justify-content:center}.dsc-decision-scrim{position:absolute;inset:0;background:#04080ab8;backdrop-filter:blur(6px)}.dsc-decision-panel{position:relative;z-index:1;width:min(720px,94vw);max-height:86vh;overflow:auto;background:linear-gradient(165deg,#121a16,#0a100e);border:1px solid var(--dsc-glass-border);border-radius:14px;box-shadow:0 24px 80px #0000008c;padding:16px 18px}.dsc-decision-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.dsc-decision-head h2{margin:0;font-size:.95rem;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-decision-help{min-height:8px;margin-top:10px}.dsc-decision-foot{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}.dsc-result-chip.is-empty{border-color:#78a08247;background:#121c1673;color:var(--dsc-gray-5)}.dsc-result-chip-hit{appearance:none;border:0;background:transparent;padding:0;color:inherit;font:inherit;cursor:pointer;max-width:100%}.dsc-coupled-mix .dsc-mix-row{display:grid;grid-template-columns:minmax(140px,1.2fr) 140px 48px 64px auto;gap:8px;align-items:end;margin-bottom:8px}.dsc-nutrient-slot{display:grid;grid-template-columns:minmax(140px,1fr) 88px 64px auto;gap:8px;align-items:end;margin-top:8px}.dsc-catalog-hits{list-style:none;margin:8px 0 0;padding:0;max-height:280px;overflow:auto}.dsc-catalog-hits button{appearance:none;width:100%;text-align:left;background:transparent;border:0;color:inherit;font:inherit;padding:8px 4px;cursor:pointer;display:flex;gap:8px}.dsc-catalog-hits button:hover{background:#26c6da1a}.dsc-catalog-picker input[type=search]{width:100%;box-sizing:border-box;background:var(--dsc-gray-1);border:1px solid var(--dsc-glass-border);border-radius:8px;color:var(--dsc-white);padding:8px 10px}.dsc-vessel-glyph{display:inline-flex;flex-direction:column;align-items:center;gap:2px}.dsc-vessel-glyph-label{font-size:.65rem;color:var(--dsc-gray-5)}.dsc-kit-pulse-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px}.dsc-kit-node{display:flex;align-items:center;gap:8px;padding:8px;border:1px dashed var(--dsc-gray-3);border-radius:10px}.dsc-kit-node.is-ok{border-style:solid;border-color:var(--dsc-teal-dim)}.dsc-kit-node i{width:10px;height:10px;border-radius:50%;background:var(--dsc-gray-5)}.dsc-kit-node.is-ok i{background:var(--dsc-neon)}.dsc-kit-node.is-held i{background:var(--dsc-amber)}.dsc-kit-node.is-oos i,.dsc-kit-node.is-missing i,.dsc-kit-node.is-dark i{background:transparent;border:1px dashed var(--dsc-bad)}.dsc-lung-svg,.dsc-tank-svg{width:100%;height:auto;color:var(--dsc-white)}.dsc-honesty-hit{appearance:none;border:0;background:transparent;padding:0;cursor:pointer}.dsc-row-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.dsc-detail-list dt{font-size:.7rem;color:var(--dsc-gray-5);margin-top:8px}.dsc-detail-list dd{margin:0}', fy = dy;
function kp() {
  const a = vt(), r = ft();
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      $t,
      {
        icon: "alert",
        title: "Not found",
        subtitle: `${a.pathname} is not a DSC route.`
      }
    ),
    /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: "Unknown hash — not a silent Mission redirect." }),
    /* @__PURE__ */ s.jsx(fe, { primary: !0, onClick: () => r("/live/mission"), children: "Go Mission" })
  ] });
}
function Rl() {
  const a = vt(), r = oy(a.pathname, a.search);
  return r ? /* @__PURE__ */ s.jsx(Cs, { to: r, replace: !0 }) : /* @__PURE__ */ s.jsx(kp, {});
}
function hy() {
  const a = vt(), r = ft(), o = uy(a.pathname), u = cy[o];
  return _.useEffect(() => {
    if (a.pathname === "/live/climate") return;
    const f = new URLSearchParams(a.search);
    if (!f.has("tent") && !f.has("zone")) return;
    f.delete("tent"), f.delete("zone");
    const h = f.toString();
    r({ pathname: a.pathname, search: h ? `?${h}` : "" }, { replace: !0 });
  }, [a.pathname, a.search, r]), /* @__PURE__ */ s.jsxs("div", { className: "dsc-shell", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-brand-row", children: [
      /* @__PURE__ */ s.jsxs(ic, { className: "dsc-brand", to: "/live/mission", children: [
        /* @__PURE__ */ s.jsx(mn, { name: "brand", size: 36, color: "var(--dsc-blue)" }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-brand-title", children: /* @__PURE__ */ s.jsx("strong", { children: "DSC - A Plausible Deniability Project." }) })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-muted", style: { fontSize: 12, letterSpacing: "0.08em" }, children: "SURFACE 7.1.4" })
    ] }),
    /* @__PURE__ */ s.jsx(Kx, {}),
    /* @__PURE__ */ s.jsx("nav", { className: "dsc-primary-tabs", "aria-label": "Primary", children: iy.map((f) => /* @__PURE__ */ s.jsxs(
      ic,
      {
        to: f.path,
        className: ({ isActive: h }) => `dsc-tab dsc-tab--${f.id}${h || o === f.id ? " active" : ""}`,
        children: [
          /* @__PURE__ */ s.jsx(mn, { name: f.icon, size: 15 }),
          f.label
        ]
      },
      f.id
    )) }),
    u.length > 1 ? /* @__PURE__ */ s.jsx("nav", { className: "dsc-secondary-tabs", "aria-label": "Section pages", children: u.map((f) => /* @__PURE__ */ s.jsxs(
      ic,
      {
        to: f.path,
        end: f.path === "/fleet",
        className: ({ isActive: h }) => `dsc-tab${h ? " active" : ""}`,
        children: [
          /* @__PURE__ */ s.jsx(mn, { name: f.icon, size: 14 }),
          f.label
        ]
      },
      f.id
    )) }) : null,
    /* @__PURE__ */ s.jsx(rb, {}),
    /* @__PURE__ */ s.jsx(Hb, {}),
    /* @__PURE__ */ s.jsxs(ax, { children: [
      /* @__PURE__ */ s.jsx(Ge, { path: "/", element: /* @__PURE__ */ s.jsx(Cs, { to: "/live/mission", replace: !0 }) }),
      /* @__PURE__ */ s.jsx(Ge, { path: "/live", element: /* @__PURE__ */ s.jsx(Cs, { to: "/live/mission", replace: !0 }) }),
      /* @__PURE__ */ s.jsx(Ge, { path: "/live/mission", element: /* @__PURE__ */ s.jsx(Vb, {}) }),
      /* @__PURE__ */ s.jsx(Ge, { path: "/live/twin", element: /* @__PURE__ */ s.jsx(Zb, {}) }),
      /* @__PURE__ */ s.jsx(Ge, { path: "/live/climate", element: /* @__PURE__ */ s.jsx(Kb, {}) }),
      /* @__PURE__ */ s.jsx(Ge, { path: "/live/main", element: /* @__PURE__ */ s.jsx(Fb, {}) }),
      /* @__PURE__ */ s.jsx(Ge, { path: "/live/clone", element: /* @__PURE__ */ s.jsx(Jb, {}) }),
      /* @__PURE__ */ s.jsx(Ge, { path: "/live/root", element: /* @__PURE__ */ s.jsx(Wb, {}) }),
      /* @__PURE__ */ s.jsx(Ge, { path: "/live/light", element: /* @__PURE__ */ s.jsx(ey, {}) }),
      /* @__PURE__ */ s.jsx(Ge, { path: "/grow", element: /* @__PURE__ */ s.jsx(Cs, { to: "/grow/compose", replace: !0 }) }),
      /* @__PURE__ */ s.jsx(Ge, { path: "/grow/compose", element: /* @__PURE__ */ s.jsx(zb, {}) }),
      /* @__PURE__ */ s.jsx(Ge, { path: "/grow/research", element: /* @__PURE__ */ s.jsx(Ob, {}) }),
      /* @__PURE__ */ s.jsx(Ge, { path: "/grow/roster", element: /* @__PURE__ */ s.jsx(Db, {}) }),
      /* @__PURE__ */ s.jsx(Ge, { path: "/tune", element: /* @__PURE__ */ s.jsx(Cs, { to: "/tune/learning", replace: !0 }) }),
      /* @__PURE__ */ s.jsx(Ge, { path: "/tune/learning", element: /* @__PURE__ */ s.jsx(ly, {}) }),
      /* @__PURE__ */ s.jsx(Ge, { path: "/tune/analytics", element: /* @__PURE__ */ s.jsx(ay, {}) }),
      /* @__PURE__ */ s.jsx(Ge, { path: "/fleet", element: /* @__PURE__ */ s.jsx(sy, {}) }),
      /* @__PURE__ */ s.jsx(Ge, { path: "/ops/*", element: /* @__PURE__ */ s.jsx(Rl, {}) }),
      /* @__PURE__ */ s.jsx(Ge, { path: "/ops", element: /* @__PURE__ */ s.jsx(Rl, {}) }),
      /* @__PURE__ */ s.jsx(Ge, { path: "/plant/*", element: /* @__PURE__ */ s.jsx(Rl, {}) }),
      /* @__PURE__ */ s.jsx(Ge, { path: "/plant", element: /* @__PURE__ */ s.jsx(Rl, {}) }),
      /* @__PURE__ */ s.jsx(Ge, { path: "/advanced/*", element: /* @__PURE__ */ s.jsx(Rl, {}) }),
      /* @__PURE__ */ s.jsx(Ge, { path: "/advanced", element: /* @__PURE__ */ s.jsx(Rl, {}) }),
      /* @__PURE__ */ s.jsx(Ge, { path: "/system", element: /* @__PURE__ */ s.jsx(Rl, {}) }),
      /* @__PURE__ */ s.jsx(Ge, { path: "*", element: /* @__PURE__ */ s.jsx(kp, {}) })
    ] })
  ] });
}
function my({ hass: a }) {
  return /* @__PURE__ */ s.jsx($x, { hass: a, children: /* @__PURE__ */ s.jsx(Ub, { children: /* @__PURE__ */ s.jsx(hy, {}) }) });
}
function py({
  panel: a
}) {
  const [r, o] = _.useState(() => a.hass);
  return _.useEffect(() => {
    const u = () => o(a.hass);
    return u(), a.addEventListener("hass-updated", u), () => {
      a.removeEventListener("hass-updated", u);
    };
  }, [a]), /* @__PURE__ */ s.jsx(kx, { children: /* @__PURE__ */ s.jsx(my, { hass: r }) });
}
class vy extends HTMLElement {
  constructor() {
    super(...arguments);
    Pi(this, "_root", null);
    Pi(this, "_hass", null);
    Pi(this, "_mounted", !1);
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
${fy}`, this.shadowRoot.appendChild(o);
      const u = document.createElement("div");
      u.className = "dsc-root", u.style.height = "100%", this.shadowRoot.appendChild(u), this._root = s0.createRoot(u), this._root.render(/* @__PURE__ */ s.jsx(py, { panel: this })), this._mounted = !0;
    }
  }
  disconnectedCallback() {
    this._root?.unmount(), this._root = null, this._mounted = !1;
  }
}
customElements.get("dsc-hub-panel") || customElements.define("dsc-hub-panel", vy);
export {
  vy as default
};
//# sourceMappingURL=dsc-hub-panel.js.map
