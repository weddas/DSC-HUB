var Ny = Object.defineProperty;
var Oy = (i, f, r) => f in i ? Ny(i, f, { enumerable: !0, configurable: !0, writable: !0, value: r }) : i[f] = r;
var mi = (i, f, r) => Oy(i, typeof f != "symbol" ? f + "" : f, r);
var ks = { exports: {} }, Xn = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var gh;
function My() {
  if (gh) return Xn;
  gh = 1;
  var i = Symbol.for("react.transitional.element"), f = Symbol.for("react.fragment");
  function r(s, h, m) {
    var g = null;
    if (m !== void 0 && (g = "" + m), h.key !== void 0 && (g = "" + h.key), "key" in h) {
      m = {};
      for (var x in h)
        x !== "key" && (m[x] = h[x]);
    } else m = h;
    return h = m.ref, {
      $$typeof: i,
      type: s,
      key: g,
      ref: h !== void 0 ? h : null,
      props: m
    };
  }
  return Xn.Fragment = f, Xn.jsx = r, Xn.jsxs = r, Xn;
}
var bh;
function Cy() {
  return bh || (bh = 1, ks.exports = My()), ks.exports;
}
var d = Cy(), $s = { exports: {} }, P = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Sh;
function Dy() {
  if (Sh) return P;
  Sh = 1;
  var i = Symbol.for("react.transitional.element"), f = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), s = Symbol.for("react.strict_mode"), h = Symbol.for("react.profiler"), m = Symbol.for("react.consumer"), g = Symbol.for("react.context"), x = Symbol.for("react.forward_ref"), p = Symbol.for("react.suspense"), v = Symbol.for("react.memo"), N = Symbol.for("react.lazy"), E = Symbol.for("react.activity"), z = Symbol.iterator;
  function L(S) {
    return S === null || typeof S != "object" ? null : (S = z && S[z] || S["@@iterator"], typeof S == "function" ? S : null);
  }
  var q = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, Y = Object.assign, B = {};
  function Z(S, H, G) {
    this.props = S, this.context = H, this.refs = B, this.updater = G || q;
  }
  Z.prototype.isReactComponent = {}, Z.prototype.setState = function(S, H) {
    if (typeof S != "object" && typeof S != "function" && S != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, S, H, "setState");
  }, Z.prototype.forceUpdate = function(S) {
    this.updater.enqueueForceUpdate(this, S, "forceUpdate");
  };
  function k() {
  }
  k.prototype = Z.prototype;
  function X(S, H, G) {
    this.props = S, this.context = H, this.refs = B, this.updater = G || q;
  }
  var lt = X.prototype = new k();
  lt.constructor = X, Y(lt, Z.prototype), lt.isPureReactComponent = !0;
  var it = Array.isArray;
  function At() {
  }
  var F = { H: null, A: null, T: null, S: null }, Ct = Object.prototype.hasOwnProperty;
  function $t(S, H, G) {
    var V = G.ref;
    return {
      $$typeof: i,
      type: S,
      key: H,
      ref: V !== void 0 ? V : null,
      props: G
    };
  }
  function Ge(S, H) {
    return $t(S.type, H, S.props);
  }
  function Se(S) {
    return typeof S == "object" && S !== null && S.$$typeof === i;
  }
  function Wt(S) {
    var H = { "=": "=0", ":": "=2" };
    return "$" + S.replace(/[=:]/g, function(G) {
      return H[G];
    });
  }
  var Xe = /\/+/g;
  function xe(S, H) {
    return typeof S == "object" && S !== null && S.key != null ? Wt("" + S.key) : H.toString(36);
  }
  function Bt(S) {
    switch (S.status) {
      case "fulfilled":
        return S.value;
      case "rejected":
        throw S.reason;
      default:
        switch (typeof S.status == "string" ? S.then(At, At) : (S.status = "pending", S.then(
          function(H) {
            S.status === "pending" && (S.status = "fulfilled", S.value = H);
          },
          function(H) {
            S.status === "pending" && (S.status = "rejected", S.reason = H);
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
  function C(S, H, G, V, I) {
    var at = typeof S;
    (at === "undefined" || at === "boolean") && (S = null);
    var ht = !1;
    if (S === null) ht = !0;
    else
      switch (at) {
        case "bigint":
        case "string":
        case "number":
          ht = !0;
          break;
        case "object":
          switch (S.$$typeof) {
            case i:
            case f:
              ht = !0;
              break;
            case N:
              return ht = S._init, C(
                ht(S._payload),
                H,
                G,
                V,
                I
              );
          }
      }
    if (ht)
      return I = I(S), ht = V === "" ? "." + xe(S, 0) : V, it(I) ? (G = "", ht != null && (G = ht.replace(Xe, "$&/") + "/"), C(I, H, G, "", function(ka) {
        return ka;
      })) : I != null && (Se(I) && (I = Ge(
        I,
        G + (I.key == null || S && S.key === I.key ? "" : ("" + I.key).replace(
          Xe,
          "$&/"
        ) + "/") + ht
      )), H.push(I)), 1;
    ht = 0;
    var te = V === "" ? "." : V + ":";
    if (it(S))
      for (var Dt = 0; Dt < S.length; Dt++)
        V = S[Dt], at = te + xe(V, Dt), ht += C(
          V,
          H,
          G,
          at,
          I
        );
    else if (Dt = L(S), typeof Dt == "function")
      for (S = Dt.call(S), Dt = 0; !(V = S.next()).done; )
        V = V.value, at = te + xe(V, Dt++), ht += C(
          V,
          H,
          G,
          at,
          I
        );
    else if (at === "object") {
      if (typeof S.then == "function")
        return C(
          Bt(S),
          H,
          G,
          V,
          I
        );
      throw H = String(S), Error(
        "Objects are not valid as a React child (found: " + (H === "[object Object]" ? "object with keys {" + Object.keys(S).join(", ") + "}" : H) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return ht;
  }
  function w(S, H, G) {
    if (S == null) return S;
    var V = [], I = 0;
    return C(S, V, "", "", function(at) {
      return H.call(G, at, I++);
    }), V;
  }
  function W(S) {
    if (S._status === -1) {
      var H = S._result;
      H = H(), H.then(
        function(G) {
          (S._status === 0 || S._status === -1) && (S._status = 1, S._result = G);
        },
        function(G) {
          (S._status === 0 || S._status === -1) && (S._status = 2, S._result = G);
        }
      ), S._status === -1 && (S._status = 0, S._result = H);
    }
    if (S._status === 1) return S._result.default;
    throw S._result;
  }
  var yt = typeof reportError == "function" ? reportError : function(S) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var H = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof S == "object" && S !== null && typeof S.message == "string" ? String(S.message) : String(S),
        error: S
      });
      if (!window.dispatchEvent(H)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", S);
      return;
    }
    console.error(S);
  }, xt = {
    map: w,
    forEach: function(S, H, G) {
      w(
        S,
        function() {
          H.apply(this, arguments);
        },
        G
      );
    },
    count: function(S) {
      var H = 0;
      return w(S, function() {
        H++;
      }), H;
    },
    toArray: function(S) {
      return w(S, function(H) {
        return H;
      }) || [];
    },
    only: function(S) {
      if (!Se(S))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return S;
    }
  };
  return P.Activity = E, P.Children = xt, P.Component = Z, P.Fragment = r, P.Profiler = h, P.PureComponent = X, P.StrictMode = s, P.Suspense = p, P.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = F, P.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(S) {
      return F.H.useMemoCache(S);
    }
  }, P.cache = function(S) {
    return function() {
      return S.apply(null, arguments);
    };
  }, P.cacheSignal = function() {
    return null;
  }, P.cloneElement = function(S, H, G) {
    if (S == null)
      throw Error(
        "The argument must be a React element, but you passed " + S + "."
      );
    var V = Y({}, S.props), I = S.key;
    if (H != null)
      for (at in H.key !== void 0 && (I = "" + H.key), H)
        !Ct.call(H, at) || at === "key" || at === "__self" || at === "__source" || at === "ref" && H.ref === void 0 || (V[at] = H[at]);
    var at = arguments.length - 2;
    if (at === 1) V.children = G;
    else if (1 < at) {
      for (var ht = Array(at), te = 0; te < at; te++)
        ht[te] = arguments[te + 2];
      V.children = ht;
    }
    return $t(S.type, I, V);
  }, P.createContext = function(S) {
    return S = {
      $$typeof: g,
      _currentValue: S,
      _currentValue2: S,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, S.Provider = S, S.Consumer = {
      $$typeof: m,
      _context: S
    }, S;
  }, P.createElement = function(S, H, G) {
    var V, I = {}, at = null;
    if (H != null)
      for (V in H.key !== void 0 && (at = "" + H.key), H)
        Ct.call(H, V) && V !== "key" && V !== "__self" && V !== "__source" && (I[V] = H[V]);
    var ht = arguments.length - 2;
    if (ht === 1) I.children = G;
    else if (1 < ht) {
      for (var te = Array(ht), Dt = 0; Dt < ht; Dt++)
        te[Dt] = arguments[Dt + 2];
      I.children = te;
    }
    if (S && S.defaultProps)
      for (V in ht = S.defaultProps, ht)
        I[V] === void 0 && (I[V] = ht[V]);
    return $t(S, at, I);
  }, P.createRef = function() {
    return { current: null };
  }, P.forwardRef = function(S) {
    return { $$typeof: x, render: S };
  }, P.isValidElement = Se, P.lazy = function(S) {
    return {
      $$typeof: N,
      _payload: { _status: -1, _result: S },
      _init: W
    };
  }, P.memo = function(S, H) {
    return {
      $$typeof: v,
      type: S,
      compare: H === void 0 ? null : H
    };
  }, P.startTransition = function(S) {
    var H = F.T, G = {};
    F.T = G;
    try {
      var V = S(), I = F.S;
      I !== null && I(G, V), typeof V == "object" && V !== null && typeof V.then == "function" && V.then(At, yt);
    } catch (at) {
      yt(at);
    } finally {
      H !== null && G.types !== null && (H.types = G.types), F.T = H;
    }
  }, P.unstable_useCacheRefresh = function() {
    return F.H.useCacheRefresh();
  }, P.use = function(S) {
    return F.H.use(S);
  }, P.useActionState = function(S, H, G) {
    return F.H.useActionState(S, H, G);
  }, P.useCallback = function(S, H) {
    return F.H.useCallback(S, H);
  }, P.useContext = function(S) {
    return F.H.useContext(S);
  }, P.useDebugValue = function() {
  }, P.useDeferredValue = function(S, H) {
    return F.H.useDeferredValue(S, H);
  }, P.useEffect = function(S, H) {
    return F.H.useEffect(S, H);
  }, P.useEffectEvent = function(S) {
    return F.H.useEffectEvent(S);
  }, P.useId = function() {
    return F.H.useId();
  }, P.useImperativeHandle = function(S, H, G) {
    return F.H.useImperativeHandle(S, H, G);
  }, P.useInsertionEffect = function(S, H) {
    return F.H.useInsertionEffect(S, H);
  }, P.useLayoutEffect = function(S, H) {
    return F.H.useLayoutEffect(S, H);
  }, P.useMemo = function(S, H) {
    return F.H.useMemo(S, H);
  }, P.useOptimistic = function(S, H) {
    return F.H.useOptimistic(S, H);
  }, P.useReducer = function(S, H, G) {
    return F.H.useReducer(S, H, G);
  }, P.useRef = function(S) {
    return F.H.useRef(S);
  }, P.useState = function(S) {
    return F.H.useState(S);
  }, P.useSyncExternalStore = function(S, H, G) {
    return F.H.useSyncExternalStore(
      S,
      H,
      G
    );
  }, P.useTransition = function() {
    return F.H.useTransition();
  }, P.version = "19.2.8", P;
}
var xh;
function cf() {
  return xh || (xh = 1, $s.exports = Dy()), $s.exports;
}
var A = cf(), Ws = { exports: {} }, Qn = {}, Fs = { exports: {} }, Ps = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var _h;
function Uy() {
  return _h || (_h = 1, (function(i) {
    function f(C, w) {
      var W = C.length;
      C.push(w);
      t: for (; 0 < W; ) {
        var yt = W - 1 >>> 1, xt = C[yt];
        if (0 < h(xt, w))
          C[yt] = w, C[W] = xt, W = yt;
        else break t;
      }
    }
    function r(C) {
      return C.length === 0 ? null : C[0];
    }
    function s(C) {
      if (C.length === 0) return null;
      var w = C[0], W = C.pop();
      if (W !== w) {
        C[0] = W;
        t: for (var yt = 0, xt = C.length, S = xt >>> 1; yt < S; ) {
          var H = 2 * (yt + 1) - 1, G = C[H], V = H + 1, I = C[V];
          if (0 > h(G, W))
            V < xt && 0 > h(I, G) ? (C[yt] = I, C[V] = W, yt = V) : (C[yt] = G, C[H] = W, yt = H);
          else if (V < xt && 0 > h(I, W))
            C[yt] = I, C[V] = W, yt = V;
          else break t;
        }
      }
      return w;
    }
    function h(C, w) {
      var W = C.sortIndex - w.sortIndex;
      return W !== 0 ? W : C.id - w.id;
    }
    if (i.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var m = performance;
      i.unstable_now = function() {
        return m.now();
      };
    } else {
      var g = Date, x = g.now();
      i.unstable_now = function() {
        return g.now() - x;
      };
    }
    var p = [], v = [], N = 1, E = null, z = 3, L = !1, q = !1, Y = !1, B = !1, Z = typeof setTimeout == "function" ? setTimeout : null, k = typeof clearTimeout == "function" ? clearTimeout : null, X = typeof setImmediate < "u" ? setImmediate : null;
    function lt(C) {
      for (var w = r(v); w !== null; ) {
        if (w.callback === null) s(v);
        else if (w.startTime <= C)
          s(v), w.sortIndex = w.expirationTime, f(p, w);
        else break;
        w = r(v);
      }
    }
    function it(C) {
      if (Y = !1, lt(C), !q)
        if (r(p) !== null)
          q = !0, At || (At = !0, Wt());
        else {
          var w = r(v);
          w !== null && Bt(it, w.startTime - C);
        }
    }
    var At = !1, F = -1, Ct = 5, $t = -1;
    function Ge() {
      return B ? !0 : !(i.unstable_now() - $t < Ct);
    }
    function Se() {
      if (B = !1, At) {
        var C = i.unstable_now();
        $t = C;
        var w = !0;
        try {
          t: {
            q = !1, Y && (Y = !1, k(F), F = -1), L = !0;
            var W = z;
            try {
              e: {
                for (lt(C), E = r(p); E !== null && !(E.expirationTime > C && Ge()); ) {
                  var yt = E.callback;
                  if (typeof yt == "function") {
                    E.callback = null, z = E.priorityLevel;
                    var xt = yt(
                      E.expirationTime <= C
                    );
                    if (C = i.unstable_now(), typeof xt == "function") {
                      E.callback = xt, lt(C), w = !0;
                      break e;
                    }
                    E === r(p) && s(p), lt(C);
                  } else s(p);
                  E = r(p);
                }
                if (E !== null) w = !0;
                else {
                  var S = r(v);
                  S !== null && Bt(
                    it,
                    S.startTime - C
                  ), w = !1;
                }
              }
              break t;
            } finally {
              E = null, z = W, L = !1;
            }
            w = void 0;
          }
        } finally {
          w ? Wt() : At = !1;
        }
      }
    }
    var Wt;
    if (typeof X == "function")
      Wt = function() {
        X(Se);
      };
    else if (typeof MessageChannel < "u") {
      var Xe = new MessageChannel(), xe = Xe.port2;
      Xe.port1.onmessage = Se, Wt = function() {
        xe.postMessage(null);
      };
    } else
      Wt = function() {
        Z(Se, 0);
      };
    function Bt(C, w) {
      F = Z(function() {
        C(i.unstable_now());
      }, w);
    }
    i.unstable_IdlePriority = 5, i.unstable_ImmediatePriority = 1, i.unstable_LowPriority = 4, i.unstable_NormalPriority = 3, i.unstable_Profiling = null, i.unstable_UserBlockingPriority = 2, i.unstable_cancelCallback = function(C) {
      C.callback = null;
    }, i.unstable_forceFrameRate = function(C) {
      0 > C || 125 < C ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : Ct = 0 < C ? Math.floor(1e3 / C) : 5;
    }, i.unstable_getCurrentPriorityLevel = function() {
      return z;
    }, i.unstable_next = function(C) {
      switch (z) {
        case 1:
        case 2:
        case 3:
          var w = 3;
          break;
        default:
          w = z;
      }
      var W = z;
      z = w;
      try {
        return C();
      } finally {
        z = W;
      }
    }, i.unstable_requestPaint = function() {
      B = !0;
    }, i.unstable_runWithPriority = function(C, w) {
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
      var W = z;
      z = C;
      try {
        return w();
      } finally {
        z = W;
      }
    }, i.unstable_scheduleCallback = function(C, w, W) {
      var yt = i.unstable_now();
      switch (typeof W == "object" && W !== null ? (W = W.delay, W = typeof W == "number" && 0 < W ? yt + W : yt) : W = yt, C) {
        case 1:
          var xt = -1;
          break;
        case 2:
          xt = 250;
          break;
        case 5:
          xt = 1073741823;
          break;
        case 4:
          xt = 1e4;
          break;
        default:
          xt = 5e3;
      }
      return xt = W + xt, C = {
        id: N++,
        callback: w,
        priorityLevel: C,
        startTime: W,
        expirationTime: xt,
        sortIndex: -1
      }, W > yt ? (C.sortIndex = W, f(v, C), r(p) === null && C === r(v) && (Y ? (k(F), F = -1) : Y = !0, Bt(it, W - yt))) : (C.sortIndex = xt, f(p, C), q || L || (q = !0, At || (At = !0, Wt()))), C;
    }, i.unstable_shouldYield = Ge, i.unstable_wrapCallback = function(C) {
      var w = z;
      return function() {
        var W = z;
        z = w;
        try {
          return C.apply(this, arguments);
        } finally {
          z = W;
        }
      };
    };
  })(Ps)), Ps;
}
var Eh;
function Hy() {
  return Eh || (Eh = 1, Fs.exports = Uy()), Fs.exports;
}
var Is = { exports: {} }, Ft = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Th;
function By() {
  if (Th) return Ft;
  Th = 1;
  var i = cf();
  function f(p) {
    var v = "https://react.dev/errors/" + p;
    if (1 < arguments.length) {
      v += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var N = 2; N < arguments.length; N++)
        v += "&args[]=" + encodeURIComponent(arguments[N]);
    }
    return "Minified React error #" + p + "; visit " + v + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function r() {
  }
  var s = {
    d: {
      f: r,
      r: function() {
        throw Error(f(522));
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
  }, h = Symbol.for("react.portal");
  function m(p, v, N) {
    var E = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: h,
      key: E == null ? null : "" + E,
      children: p,
      containerInfo: v,
      implementation: N
    };
  }
  var g = i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function x(p, v) {
    if (p === "font") return "";
    if (typeof v == "string")
      return v === "use-credentials" ? v : "";
  }
  return Ft.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = s, Ft.createPortal = function(p, v) {
    var N = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!v || v.nodeType !== 1 && v.nodeType !== 9 && v.nodeType !== 11)
      throw Error(f(299));
    return m(p, v, null, N);
  }, Ft.flushSync = function(p) {
    var v = g.T, N = s.p;
    try {
      if (g.T = null, s.p = 2, p) return p();
    } finally {
      g.T = v, s.p = N, s.d.f();
    }
  }, Ft.preconnect = function(p, v) {
    typeof p == "string" && (v ? (v = v.crossOrigin, v = typeof v == "string" ? v === "use-credentials" ? v : "" : void 0) : v = null, s.d.C(p, v));
  }, Ft.prefetchDNS = function(p) {
    typeof p == "string" && s.d.D(p);
  }, Ft.preinit = function(p, v) {
    if (typeof p == "string" && v && typeof v.as == "string") {
      var N = v.as, E = x(N, v.crossOrigin), z = typeof v.integrity == "string" ? v.integrity : void 0, L = typeof v.fetchPriority == "string" ? v.fetchPriority : void 0;
      N === "style" ? s.d.S(
        p,
        typeof v.precedence == "string" ? v.precedence : void 0,
        {
          crossOrigin: E,
          integrity: z,
          fetchPriority: L
        }
      ) : N === "script" && s.d.X(p, {
        crossOrigin: E,
        integrity: z,
        fetchPriority: L,
        nonce: typeof v.nonce == "string" ? v.nonce : void 0
      });
    }
  }, Ft.preinitModule = function(p, v) {
    if (typeof p == "string")
      if (typeof v == "object" && v !== null) {
        if (v.as == null || v.as === "script") {
          var N = x(
            v.as,
            v.crossOrigin
          );
          s.d.M(p, {
            crossOrigin: N,
            integrity: typeof v.integrity == "string" ? v.integrity : void 0,
            nonce: typeof v.nonce == "string" ? v.nonce : void 0
          });
        }
      } else v == null && s.d.M(p);
  }, Ft.preload = function(p, v) {
    if (typeof p == "string" && typeof v == "object" && v !== null && typeof v.as == "string") {
      var N = v.as, E = x(N, v.crossOrigin);
      s.d.L(p, N, {
        crossOrigin: E,
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
  }, Ft.preloadModule = function(p, v) {
    if (typeof p == "string")
      if (v) {
        var N = x(v.as, v.crossOrigin);
        s.d.m(p, {
          as: typeof v.as == "string" && v.as !== "script" ? v.as : void 0,
          crossOrigin: N,
          integrity: typeof v.integrity == "string" ? v.integrity : void 0
        });
      } else s.d.m(p);
  }, Ft.requestFormReset = function(p) {
    s.d.r(p);
  }, Ft.unstable_batchedUpdates = function(p, v) {
    return p(v);
  }, Ft.useFormState = function(p, v, N) {
    return g.H.useFormState(p, v, N);
  }, Ft.useFormStatus = function() {
    return g.H.useHostTransitionStatus();
  }, Ft.version = "19.2.8", Ft;
}
var jh;
function Ly() {
  if (jh) return Is.exports;
  jh = 1;
  function i() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i);
      } catch (f) {
        console.error(f);
      }
  }
  return i(), Is.exports = By(), Is.exports;
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
var zh;
function qy() {
  if (zh) return Qn;
  zh = 1;
  var i = Hy(), f = cf(), r = Ly();
  function s(t) {
    var e = "https://react.dev/errors/" + t;
    if (1 < arguments.length) {
      e += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var l = 2; l < arguments.length; l++)
        e += "&args[]=" + encodeURIComponent(arguments[l]);
    }
    return "Minified React error #" + t + "; visit " + e + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function h(t) {
    return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11);
  }
  function m(t) {
    var e = t, l = t;
    if (t.alternate) for (; e.return; ) e = e.return;
    else {
      t = e;
      do
        e = t, (e.flags & 4098) !== 0 && (l = e.return), t = e.return;
      while (t);
    }
    return e.tag === 3 ? l : null;
  }
  function g(t) {
    if (t.tag === 13) {
      var e = t.memoizedState;
      if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
    }
    return null;
  }
  function x(t) {
    if (t.tag === 31) {
      var e = t.memoizedState;
      if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
    }
    return null;
  }
  function p(t) {
    if (m(t) !== t)
      throw Error(s(188));
  }
  function v(t) {
    var e = t.alternate;
    if (!e) {
      if (e = m(t), e === null) throw Error(s(188));
      return e !== t ? null : t;
    }
    for (var l = t, a = e; ; ) {
      var n = l.return;
      if (n === null) break;
      var u = n.alternate;
      if (u === null) {
        if (a = n.return, a !== null) {
          l = a;
          continue;
        }
        break;
      }
      if (n.child === u.child) {
        for (u = n.child; u; ) {
          if (u === l) return p(n), t;
          if (u === a) return p(n), e;
          u = u.sibling;
        }
        throw Error(s(188));
      }
      if (l.return !== a.return) l = n, a = u;
      else {
        for (var c = !1, o = n.child; o; ) {
          if (o === l) {
            c = !0, l = n, a = u;
            break;
          }
          if (o === a) {
            c = !0, a = n, l = u;
            break;
          }
          o = o.sibling;
        }
        if (!c) {
          for (o = u.child; o; ) {
            if (o === l) {
              c = !0, l = u, a = n;
              break;
            }
            if (o === a) {
              c = !0, a = u, l = n;
              break;
            }
            o = o.sibling;
          }
          if (!c) throw Error(s(189));
        }
      }
      if (l.alternate !== a) throw Error(s(190));
    }
    if (l.tag !== 3) throw Error(s(188));
    return l.stateNode.current === l ? t : e;
  }
  function N(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t;
    for (t = t.child; t !== null; ) {
      if (e = N(t), e !== null) return e;
      t = t.sibling;
    }
    return null;
  }
  var E = Object.assign, z = Symbol.for("react.element"), L = Symbol.for("react.transitional.element"), q = Symbol.for("react.portal"), Y = Symbol.for("react.fragment"), B = Symbol.for("react.strict_mode"), Z = Symbol.for("react.profiler"), k = Symbol.for("react.consumer"), X = Symbol.for("react.context"), lt = Symbol.for("react.forward_ref"), it = Symbol.for("react.suspense"), At = Symbol.for("react.suspense_list"), F = Symbol.for("react.memo"), Ct = Symbol.for("react.lazy"), $t = Symbol.for("react.activity"), Ge = Symbol.for("react.memo_cache_sentinel"), Se = Symbol.iterator;
  function Wt(t) {
    return t === null || typeof t != "object" ? null : (t = Se && t[Se] || t["@@iterator"], typeof t == "function" ? t : null);
  }
  var Xe = Symbol.for("react.client.reference");
  function xe(t) {
    if (t == null) return null;
    if (typeof t == "function")
      return t.$$typeof === Xe ? null : t.displayName || t.name || null;
    if (typeof t == "string") return t;
    switch (t) {
      case Y:
        return "Fragment";
      case Z:
        return "Profiler";
      case B:
        return "StrictMode";
      case it:
        return "Suspense";
      case At:
        return "SuspenseList";
      case $t:
        return "Activity";
    }
    if (typeof t == "object")
      switch (t.$$typeof) {
        case q:
          return "Portal";
        case X:
          return t.displayName || "Context";
        case k:
          return (t._context.displayName || "Context") + ".Consumer";
        case lt:
          var e = t.render;
          return t = t.displayName, t || (t = e.displayName || e.name || "", t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"), t;
        case F:
          return e = t.displayName || null, e !== null ? e : xe(t.type) || "Memo";
        case Ct:
          e = t._payload, t = t._init;
          try {
            return xe(t(e));
          } catch {
          }
      }
    return null;
  }
  var Bt = Array.isArray, C = f.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, w = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, W = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, yt = [], xt = -1;
  function S(t) {
    return { current: t };
  }
  function H(t) {
    0 > xt || (t.current = yt[xt], yt[xt] = null, xt--);
  }
  function G(t, e) {
    xt++, yt[xt] = t.current, t.current = e;
  }
  var V = S(null), I = S(null), at = S(null), ht = S(null);
  function te(t, e) {
    switch (G(at, e), G(I, t), G(V, null), e.nodeType) {
      case 9:
      case 11:
        t = (t = e.documentElement) && (t = t.namespaceURI) ? Gd(t) : 0;
        break;
      default:
        if (t = e.tagName, e = e.namespaceURI)
          e = Gd(e), t = Xd(e, t);
        else
          switch (t) {
            case "svg":
              t = 1;
              break;
            case "math":
              t = 2;
              break;
            default:
              t = 0;
          }
    }
    H(V), G(V, t);
  }
  function Dt() {
    H(V), H(I), H(at);
  }
  function ka(t) {
    t.memoizedState !== null && G(ht, t);
    var e = V.current, l = Xd(e, t.type);
    e !== l && (G(I, t), G(V, l));
  }
  function Wn(t) {
    I.current === t && (H(V), H(I)), ht.current === t && (H(ht), qn._currentValue = W);
  }
  var Oi, yf;
  function Gl(t) {
    if (Oi === void 0)
      try {
        throw Error();
      } catch (l) {
        var e = l.stack.trim().match(/\n( *(at )?)/);
        Oi = e && e[1] || "", yf = -1 < l.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < l.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + Oi + t + yf;
  }
  var Mi = !1;
  function Ci(t, e) {
    if (!t || Mi) return "";
    Mi = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (e) {
              var U = function() {
                throw Error();
              };
              if (Object.defineProperty(U.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(U, []);
                } catch (O) {
                  var R = O;
                }
                Reflect.construct(t, [], U);
              } else {
                try {
                  U.call();
                } catch (O) {
                  R = O;
                }
                t.call(U.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (O) {
                R = O;
              }
              (U = t()) && typeof U.catch == "function" && U.catch(function() {
              });
            }
          } catch (O) {
            if (O && R && typeof O.stack == "string")
              return [O.stack, R.stack];
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
      var u = a.DetermineComponentFrameRoot(), c = u[0], o = u[1];
      if (c && o) {
        var y = c.split(`
`), j = o.split(`
`);
        for (n = a = 0; a < y.length && !y[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; n < j.length && !j[n].includes(
          "DetermineComponentFrameRoot"
        ); )
          n++;
        if (a === y.length || n === j.length)
          for (a = y.length - 1, n = j.length - 1; 1 <= a && 0 <= n && y[a] !== j[n]; )
            n--;
        for (; 1 <= a && 0 <= n; a--, n--)
          if (y[a] !== j[n]) {
            if (a !== 1 || n !== 1)
              do
                if (a--, n--, 0 > n || y[a] !== j[n]) {
                  var M = `
` + y[a].replace(" at new ", " at ");
                  return t.displayName && M.includes("<anonymous>") && (M = M.replace("<anonymous>", t.displayName)), M;
                }
              while (1 <= a && 0 <= n);
            break;
          }
      }
    } finally {
      Mi = !1, Error.prepareStackTrace = l;
    }
    return (l = t ? t.displayName || t.name : "") ? Gl(l) : "";
  }
  function im(t, e) {
    switch (t.tag) {
      case 26:
      case 27:
      case 5:
        return Gl(t.type);
      case 16:
        return Gl("Lazy");
      case 13:
        return t.child !== e && e !== null ? Gl("Suspense Fallback") : Gl("Suspense");
      case 19:
        return Gl("SuspenseList");
      case 0:
      case 15:
        return Ci(t.type, !1);
      case 11:
        return Ci(t.type.render, !1);
      case 1:
        return Ci(t.type, !0);
      case 31:
        return Gl("Activity");
      default:
        return "";
    }
  }
  function pf(t) {
    try {
      var e = "", l = null;
      do
        e += im(t, l), l = t, t = t.return;
      while (t);
      return e;
    } catch (a) {
      return `
Error generating stack: ` + a.message + `
` + a.stack;
    }
  }
  var Di = Object.prototype.hasOwnProperty, Ui = i.unstable_scheduleCallback, Hi = i.unstable_cancelCallback, cm = i.unstable_shouldYield, sm = i.unstable_requestPaint, fe = i.unstable_now, fm = i.unstable_getCurrentPriorityLevel, gf = i.unstable_ImmediatePriority, bf = i.unstable_UserBlockingPriority, Fn = i.unstable_NormalPriority, rm = i.unstable_LowPriority, Sf = i.unstable_IdlePriority, om = i.log, dm = i.unstable_setDisableYieldValue, $a = null, re = null;
  function yl(t) {
    if (typeof om == "function" && dm(t), re && typeof re.setStrictMode == "function")
      try {
        re.setStrictMode($a, t);
      } catch {
      }
  }
  var oe = Math.clz32 ? Math.clz32 : vm, hm = Math.log, mm = Math.LN2;
  function vm(t) {
    return t >>>= 0, t === 0 ? 32 : 31 - (hm(t) / mm | 0) | 0;
  }
  var Pn = 256, In = 262144, tu = 4194304;
  function Xl(t) {
    var e = t & 42;
    if (e !== 0) return e;
    switch (t & -t) {
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
        return t & 261888;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return t & 62914560;
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
        return t;
    }
  }
  function eu(t, e, l) {
    var a = t.pendingLanes;
    if (a === 0) return 0;
    var n = 0, u = t.suspendedLanes, c = t.pingedLanes;
    t = t.warmLanes;
    var o = a & 134217727;
    return o !== 0 ? (a = o & ~u, a !== 0 ? n = Xl(a) : (c &= o, c !== 0 ? n = Xl(c) : l || (l = o & ~t, l !== 0 && (n = Xl(l))))) : (o = a & ~u, o !== 0 ? n = Xl(o) : c !== 0 ? n = Xl(c) : l || (l = a & ~t, l !== 0 && (n = Xl(l)))), n === 0 ? 0 : e !== 0 && e !== n && (e & u) === 0 && (u = n & -n, l = e & -e, u >= l || u === 32 && (l & 4194048) !== 0) ? e : n;
  }
  function Wa(t, e) {
    return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0;
  }
  function ym(t, e) {
    switch (t) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return e + 250;
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
        return e + 5e3;
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
  function xf() {
    var t = tu;
    return tu <<= 1, (tu & 62914560) === 0 && (tu = 4194304), t;
  }
  function Bi(t) {
    for (var e = [], l = 0; 31 > l; l++) e.push(t);
    return e;
  }
  function Fa(t, e) {
    t.pendingLanes |= e, e !== 268435456 && (t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0);
  }
  function pm(t, e, l, a, n, u) {
    var c = t.pendingLanes;
    t.pendingLanes = l, t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0, t.expiredLanes &= l, t.entangledLanes &= l, t.errorRecoveryDisabledLanes &= l, t.shellSuspendCounter = 0;
    var o = t.entanglements, y = t.expirationTimes, j = t.hiddenUpdates;
    for (l = c & ~l; 0 < l; ) {
      var M = 31 - oe(l), U = 1 << M;
      o[M] = 0, y[M] = -1;
      var R = j[M];
      if (R !== null)
        for (j[M] = null, M = 0; M < R.length; M++) {
          var O = R[M];
          O !== null && (O.lane &= -536870913);
        }
      l &= ~U;
    }
    a !== 0 && _f(t, a, 0), u !== 0 && n === 0 && t.tag !== 0 && (t.suspendedLanes |= u & ~(c & ~e));
  }
  function _f(t, e, l) {
    t.pendingLanes |= e, t.suspendedLanes &= ~e;
    var a = 31 - oe(e);
    t.entangledLanes |= e, t.entanglements[a] = t.entanglements[a] | 1073741824 | l & 261930;
  }
  function Ef(t, e) {
    var l = t.entangledLanes |= e;
    for (t = t.entanglements; l; ) {
      var a = 31 - oe(l), n = 1 << a;
      n & e | t[a] & e && (t[a] |= e), l &= ~n;
    }
  }
  function Tf(t, e) {
    var l = e & -e;
    return l = (l & 42) !== 0 ? 1 : Li(l), (l & (t.suspendedLanes | e)) !== 0 ? 0 : l;
  }
  function Li(t) {
    switch (t) {
      case 2:
        t = 1;
        break;
      case 8:
        t = 4;
        break;
      case 32:
        t = 16;
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
        t = 128;
        break;
      case 268435456:
        t = 134217728;
        break;
      default:
        t = 0;
    }
    return t;
  }
  function qi(t) {
    return t &= -t, 2 < t ? 8 < t ? (t & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function jf() {
    var t = w.p;
    return t !== 0 ? t : (t = window.event, t === void 0 ? 32 : oh(t.type));
  }
  function zf(t, e) {
    var l = w.p;
    try {
      return w.p = t, e();
    } finally {
      w.p = l;
    }
  }
  var pl = Math.random().toString(36).slice(2), Zt = "__reactFiber$" + pl, le = "__reactProps$" + pl, sa = "__reactContainer$" + pl, Yi = "__reactEvents$" + pl, gm = "__reactListeners$" + pl, bm = "__reactHandles$" + pl, Af = "__reactResources$" + pl, Pa = "__reactMarker$" + pl;
  function wi(t) {
    delete t[Zt], delete t[le], delete t[Yi], delete t[gm], delete t[bm];
  }
  function fa(t) {
    var e = t[Zt];
    if (e) return e;
    for (var l = t.parentNode; l; ) {
      if (e = l[sa] || l[Zt]) {
        if (l = e.alternate, e.child !== null || l !== null && l.child !== null)
          for (t = $d(t); t !== null; ) {
            if (l = t[Zt]) return l;
            t = $d(t);
          }
        return e;
      }
      t = l, l = t.parentNode;
    }
    return null;
  }
  function ra(t) {
    if (t = t[Zt] || t[sa]) {
      var e = t.tag;
      if (e === 5 || e === 6 || e === 13 || e === 31 || e === 26 || e === 27 || e === 3)
        return t;
    }
    return null;
  }
  function Ia(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t.stateNode;
    throw Error(s(33));
  }
  function oa(t) {
    var e = t[Af];
    return e || (e = t[Af] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), e;
  }
  function Xt(t) {
    t[Pa] = !0;
  }
  var Rf = /* @__PURE__ */ new Set(), Nf = {};
  function Ql(t, e) {
    da(t, e), da(t + "Capture", e);
  }
  function da(t, e) {
    for (Nf[t] = e, t = 0; t < e.length; t++)
      Rf.add(e[t]);
  }
  var Sm = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Of = {}, Mf = {};
  function xm(t) {
    return Di.call(Mf, t) ? !0 : Di.call(Of, t) ? !1 : Sm.test(t) ? Mf[t] = !0 : (Of[t] = !0, !1);
  }
  function lu(t, e, l) {
    if (xm(e))
      if (l === null) t.removeAttribute(e);
      else {
        switch (typeof l) {
          case "undefined":
          case "function":
          case "symbol":
            t.removeAttribute(e);
            return;
          case "boolean":
            var a = e.toLowerCase().slice(0, 5);
            if (a !== "data-" && a !== "aria-") {
              t.removeAttribute(e);
              return;
            }
        }
        t.setAttribute(e, "" + l);
      }
  }
  function au(t, e, l) {
    if (l === null) t.removeAttribute(e);
    else {
      switch (typeof l) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(e);
          return;
      }
      t.setAttribute(e, "" + l);
    }
  }
  function $e(t, e, l, a) {
    if (a === null) t.removeAttribute(l);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(l);
          return;
      }
      t.setAttributeNS(e, l, "" + a);
    }
  }
  function _e(t) {
    switch (typeof t) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return t;
      case "object":
        return t;
      default:
        return "";
    }
  }
  function Cf(t) {
    var e = t.type;
    return (t = t.nodeName) && t.toLowerCase() === "input" && (e === "checkbox" || e === "radio");
  }
  function _m(t, e, l) {
    var a = Object.getOwnPropertyDescriptor(
      t.constructor.prototype,
      e
    );
    if (!t.hasOwnProperty(e) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
      var n = a.get, u = a.set;
      return Object.defineProperty(t, e, {
        configurable: !0,
        get: function() {
          return n.call(this);
        },
        set: function(c) {
          l = "" + c, u.call(this, c);
        }
      }), Object.defineProperty(t, e, {
        enumerable: a.enumerable
      }), {
        getValue: function() {
          return l;
        },
        setValue: function(c) {
          l = "" + c;
        },
        stopTracking: function() {
          t._valueTracker = null, delete t[e];
        }
      };
    }
  }
  function Gi(t) {
    if (!t._valueTracker) {
      var e = Cf(t) ? "checked" : "value";
      t._valueTracker = _m(
        t,
        e,
        "" + t[e]
      );
    }
  }
  function Df(t) {
    if (!t) return !1;
    var e = t._valueTracker;
    if (!e) return !0;
    var l = e.getValue(), a = "";
    return t && (a = Cf(t) ? t.checked ? "true" : "false" : t.value), t = a, t !== l ? (e.setValue(t), !0) : !1;
  }
  function nu(t) {
    if (t = t || (typeof document < "u" ? document : void 0), typeof t > "u") return null;
    try {
      return t.activeElement || t.body;
    } catch {
      return t.body;
    }
  }
  var Em = /[\n"\\]/g;
  function Ee(t) {
    return t.replace(
      Em,
      function(e) {
        return "\\" + e.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Xi(t, e, l, a, n, u, c, o) {
    t.name = "", c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" ? t.type = c : t.removeAttribute("type"), e != null ? c === "number" ? (e === 0 && t.value === "" || t.value != e) && (t.value = "" + _e(e)) : t.value !== "" + _e(e) && (t.value = "" + _e(e)) : c !== "submit" && c !== "reset" || t.removeAttribute("value"), e != null ? Qi(t, c, _e(e)) : l != null ? Qi(t, c, _e(l)) : a != null && t.removeAttribute("value"), n == null && u != null && (t.defaultChecked = !!u), n != null && (t.checked = n && typeof n != "function" && typeof n != "symbol"), o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? t.name = "" + _e(o) : t.removeAttribute("name");
  }
  function Uf(t, e, l, a, n, u, c, o) {
    if (u != null && typeof u != "function" && typeof u != "symbol" && typeof u != "boolean" && (t.type = u), e != null || l != null) {
      if (!(u !== "submit" && u !== "reset" || e != null)) {
        Gi(t);
        return;
      }
      l = l != null ? "" + _e(l) : "", e = e != null ? "" + _e(e) : l, o || e === t.value || (t.value = e), t.defaultValue = e;
    }
    a = a ?? n, a = typeof a != "function" && typeof a != "symbol" && !!a, t.checked = o ? t.checked : !!a, t.defaultChecked = !!a, c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" && (t.name = c), Gi(t);
  }
  function Qi(t, e, l) {
    e === "number" && nu(t.ownerDocument) === t || t.defaultValue === "" + l || (t.defaultValue = "" + l);
  }
  function ha(t, e, l, a) {
    if (t = t.options, e) {
      e = {};
      for (var n = 0; n < l.length; n++)
        e["$" + l[n]] = !0;
      for (l = 0; l < t.length; l++)
        n = e.hasOwnProperty("$" + t[l].value), t[l].selected !== n && (t[l].selected = n), n && a && (t[l].defaultSelected = !0);
    } else {
      for (l = "" + _e(l), e = null, n = 0; n < t.length; n++) {
        if (t[n].value === l) {
          t[n].selected = !0, a && (t[n].defaultSelected = !0);
          return;
        }
        e !== null || t[n].disabled || (e = t[n]);
      }
      e !== null && (e.selected = !0);
    }
  }
  function Hf(t, e, l) {
    if (e != null && (e = "" + _e(e), e !== t.value && (t.value = e), l == null)) {
      t.defaultValue !== e && (t.defaultValue = e);
      return;
    }
    t.defaultValue = l != null ? "" + _e(l) : "";
  }
  function Bf(t, e, l, a) {
    if (e == null) {
      if (a != null) {
        if (l != null) throw Error(s(92));
        if (Bt(a)) {
          if (1 < a.length) throw Error(s(93));
          a = a[0];
        }
        l = a;
      }
      l == null && (l = ""), e = l;
    }
    l = _e(e), t.defaultValue = l, a = t.textContent, a === l && a !== "" && a !== null && (t.value = a), Gi(t);
  }
  function ma(t, e) {
    if (e) {
      var l = t.firstChild;
      if (l && l === t.lastChild && l.nodeType === 3) {
        l.nodeValue = e;
        return;
      }
    }
    t.textContent = e;
  }
  var Tm = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Lf(t, e, l) {
    var a = e.indexOf("--") === 0;
    l == null || typeof l == "boolean" || l === "" ? a ? t.setProperty(e, "") : e === "float" ? t.cssFloat = "" : t[e] = "" : a ? t.setProperty(e, l) : typeof l != "number" || l === 0 || Tm.has(e) ? e === "float" ? t.cssFloat = l : t[e] = ("" + l).trim() : t[e] = l + "px";
  }
  function qf(t, e, l) {
    if (e != null && typeof e != "object")
      throw Error(s(62));
    if (t = t.style, l != null) {
      for (var a in l)
        !l.hasOwnProperty(a) || e != null && e.hasOwnProperty(a) || (a.indexOf("--") === 0 ? t.setProperty(a, "") : a === "float" ? t.cssFloat = "" : t[a] = "");
      for (var n in e)
        a = e[n], e.hasOwnProperty(n) && l[n] !== a && Lf(t, n, a);
    } else
      for (var u in e)
        e.hasOwnProperty(u) && Lf(t, u, e[u]);
  }
  function Zi(t) {
    if (t.indexOf("-") === -1) return !1;
    switch (t) {
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
  var jm = /* @__PURE__ */ new Map([
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
  ]), zm = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function uu(t) {
    return zm.test("" + t) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : t;
  }
  function We() {
  }
  var Vi = null;
  function Ki(t) {
    return t = t.target || t.srcElement || window, t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === 3 ? t.parentNode : t;
  }
  var va = null, ya = null;
  function Yf(t) {
    var e = ra(t);
    if (e && (t = e.stateNode)) {
      var l = t[le] || null;
      t: switch (t = e.stateNode, e.type) {
        case "input":
          if (Xi(
            t,
            l.value,
            l.defaultValue,
            l.defaultValue,
            l.checked,
            l.defaultChecked,
            l.type,
            l.name
          ), e = l.name, l.type === "radio" && e != null) {
            for (l = t; l.parentNode; ) l = l.parentNode;
            for (l = l.querySelectorAll(
              'input[name="' + Ee(
                "" + e
              ) + '"][type="radio"]'
            ), e = 0; e < l.length; e++) {
              var a = l[e];
              if (a !== t && a.form === t.form) {
                var n = a[le] || null;
                if (!n) throw Error(s(90));
                Xi(
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
            for (e = 0; e < l.length; e++)
              a = l[e], a.form === t.form && Df(a);
          }
          break t;
        case "textarea":
          Hf(t, l.value, l.defaultValue);
          break t;
        case "select":
          e = l.value, e != null && ha(t, !!l.multiple, e, !1);
      }
    }
  }
  var Ji = !1;
  function wf(t, e, l) {
    if (Ji) return t(e, l);
    Ji = !0;
    try {
      var a = t(e);
      return a;
    } finally {
      if (Ji = !1, (va !== null || ya !== null) && (Ku(), va && (e = va, t = ya, ya = va = null, Yf(e), t)))
        for (e = 0; e < t.length; e++) Yf(t[e]);
    }
  }
  function tn(t, e) {
    var l = t.stateNode;
    if (l === null) return null;
    var a = l[le] || null;
    if (a === null) return null;
    l = a[e];
    t: switch (e) {
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
        (a = !a.disabled) || (t = t.type, a = !(t === "button" || t === "input" || t === "select" || t === "textarea")), t = !a;
        break t;
      default:
        t = !1;
    }
    if (t) return null;
    if (l && typeof l != "function")
      throw Error(
        s(231, e, typeof l)
      );
    return l;
  }
  var Fe = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), ki = !1;
  if (Fe)
    try {
      var en = {};
      Object.defineProperty(en, "passive", {
        get: function() {
          ki = !0;
        }
      }), window.addEventListener("test", en, en), window.removeEventListener("test", en, en);
    } catch {
      ki = !1;
    }
  var gl = null, $i = null, iu = null;
  function Gf() {
    if (iu) return iu;
    var t, e = $i, l = e.length, a, n = "value" in gl ? gl.value : gl.textContent, u = n.length;
    for (t = 0; t < l && e[t] === n[t]; t++) ;
    var c = l - t;
    for (a = 1; a <= c && e[l - a] === n[u - a]; a++) ;
    return iu = n.slice(t, 1 < a ? 1 - a : void 0);
  }
  function cu(t) {
    var e = t.keyCode;
    return "charCode" in t ? (t = t.charCode, t === 0 && e === 13 && (t = 13)) : t = e, t === 10 && (t = 13), 32 <= t || t === 13 ? t : 0;
  }
  function su() {
    return !0;
  }
  function Xf() {
    return !1;
  }
  function ae(t) {
    function e(l, a, n, u, c) {
      this._reactName = l, this._targetInst = n, this.type = a, this.nativeEvent = u, this.target = c, this.currentTarget = null;
      for (var o in t)
        t.hasOwnProperty(o) && (l = t[o], this[o] = l ? l(u) : u[o]);
      return this.isDefaultPrevented = (u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1) ? su : Xf, this.isPropagationStopped = Xf, this;
    }
    return E(e.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var l = this.nativeEvent;
        l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = su);
      },
      stopPropagation: function() {
        var l = this.nativeEvent;
        l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = su);
      },
      persist: function() {
      },
      isPersistent: su
    }), e;
  }
  var Zl = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(t) {
      return t.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, fu = ae(Zl), ln = E({}, Zl, { view: 0, detail: 0 }), Am = ae(ln), Wi, Fi, an, ru = E({}, ln, {
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
    getModifierState: Ii,
    button: 0,
    buttons: 0,
    relatedTarget: function(t) {
      return t.relatedTarget === void 0 ? t.fromElement === t.srcElement ? t.toElement : t.fromElement : t.relatedTarget;
    },
    movementX: function(t) {
      return "movementX" in t ? t.movementX : (t !== an && (an && t.type === "mousemove" ? (Wi = t.screenX - an.screenX, Fi = t.screenY - an.screenY) : Fi = Wi = 0, an = t), Wi);
    },
    movementY: function(t) {
      return "movementY" in t ? t.movementY : Fi;
    }
  }), Qf = ae(ru), Rm = E({}, ru, { dataTransfer: 0 }), Nm = ae(Rm), Om = E({}, ln, { relatedTarget: 0 }), Pi = ae(Om), Mm = E({}, Zl, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Cm = ae(Mm), Dm = E({}, Zl, {
    clipboardData: function(t) {
      return "clipboardData" in t ? t.clipboardData : window.clipboardData;
    }
  }), Um = ae(Dm), Hm = E({}, Zl, { data: 0 }), Zf = ae(Hm), Bm = {
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
  }, Lm = {
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
  }, qm = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function Ym(t) {
    var e = this.nativeEvent;
    return e.getModifierState ? e.getModifierState(t) : (t = qm[t]) ? !!e[t] : !1;
  }
  function Ii() {
    return Ym;
  }
  var wm = E({}, ln, {
    key: function(t) {
      if (t.key) {
        var e = Bm[t.key] || t.key;
        if (e !== "Unidentified") return e;
      }
      return t.type === "keypress" ? (t = cu(t), t === 13 ? "Enter" : String.fromCharCode(t)) : t.type === "keydown" || t.type === "keyup" ? Lm[t.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Ii,
    charCode: function(t) {
      return t.type === "keypress" ? cu(t) : 0;
    },
    keyCode: function(t) {
      return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    },
    which: function(t) {
      return t.type === "keypress" ? cu(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    }
  }), Gm = ae(wm), Xm = E({}, ru, {
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
  }), Vf = ae(Xm), Qm = E({}, ln, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Ii
  }), Zm = ae(Qm), Vm = E({}, Zl, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Km = ae(Vm), Jm = E({}, ru, {
    deltaX: function(t) {
      return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
    },
    deltaY: function(t) {
      return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), km = ae(Jm), $m = E({}, Zl, {
    newState: 0,
    oldState: 0
  }), Wm = ae($m), Fm = [9, 13, 27, 32], tc = Fe && "CompositionEvent" in window, nn = null;
  Fe && "documentMode" in document && (nn = document.documentMode);
  var Pm = Fe && "TextEvent" in window && !nn, Kf = Fe && (!tc || nn && 8 < nn && 11 >= nn), Jf = " ", kf = !1;
  function $f(t, e) {
    switch (t) {
      case "keyup":
        return Fm.indexOf(e.keyCode) !== -1;
      case "keydown":
        return e.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Wf(t) {
    return t = t.detail, typeof t == "object" && "data" in t ? t.data : null;
  }
  var pa = !1;
  function Im(t, e) {
    switch (t) {
      case "compositionend":
        return Wf(e);
      case "keypress":
        return e.which !== 32 ? null : (kf = !0, Jf);
      case "textInput":
        return t = e.data, t === Jf && kf ? null : t;
      default:
        return null;
    }
  }
  function tv(t, e) {
    if (pa)
      return t === "compositionend" || !tc && $f(t, e) ? (t = Gf(), iu = $i = gl = null, pa = !1, t) : null;
    switch (t) {
      case "paste":
        return null;
      case "keypress":
        if (!(e.ctrlKey || e.altKey || e.metaKey) || e.ctrlKey && e.altKey) {
          if (e.char && 1 < e.char.length)
            return e.char;
          if (e.which) return String.fromCharCode(e.which);
        }
        return null;
      case "compositionend":
        return Kf && e.locale !== "ko" ? null : e.data;
      default:
        return null;
    }
  }
  var ev = {
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
  function Ff(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e === "input" ? !!ev[t.type] : e === "textarea";
  }
  function Pf(t, e, l, a) {
    va ? ya ? ya.push(a) : ya = [a] : va = a, e = Iu(e, "onChange"), 0 < e.length && (l = new fu(
      "onChange",
      "change",
      null,
      l,
      a
    ), t.push({ event: l, listeners: e }));
  }
  var un = null, cn = null;
  function lv(t) {
    Hd(t, 0);
  }
  function ou(t) {
    var e = Ia(t);
    if (Df(e)) return t;
  }
  function If(t, e) {
    if (t === "change") return e;
  }
  var tr = !1;
  if (Fe) {
    var ec;
    if (Fe) {
      var lc = "oninput" in document;
      if (!lc) {
        var er = document.createElement("div");
        er.setAttribute("oninput", "return;"), lc = typeof er.oninput == "function";
      }
      ec = lc;
    } else ec = !1;
    tr = ec && (!document.documentMode || 9 < document.documentMode);
  }
  function lr() {
    un && (un.detachEvent("onpropertychange", ar), cn = un = null);
  }
  function ar(t) {
    if (t.propertyName === "value" && ou(cn)) {
      var e = [];
      Pf(
        e,
        cn,
        t,
        Ki(t)
      ), wf(lv, e);
    }
  }
  function av(t, e, l) {
    t === "focusin" ? (lr(), un = e, cn = l, un.attachEvent("onpropertychange", ar)) : t === "focusout" && lr();
  }
  function nv(t) {
    if (t === "selectionchange" || t === "keyup" || t === "keydown")
      return ou(cn);
  }
  function uv(t, e) {
    if (t === "click") return ou(e);
  }
  function iv(t, e) {
    if (t === "input" || t === "change")
      return ou(e);
  }
  function cv(t, e) {
    return t === e && (t !== 0 || 1 / t === 1 / e) || t !== t && e !== e;
  }
  var de = typeof Object.is == "function" ? Object.is : cv;
  function sn(t, e) {
    if (de(t, e)) return !0;
    if (typeof t != "object" || t === null || typeof e != "object" || e === null)
      return !1;
    var l = Object.keys(t), a = Object.keys(e);
    if (l.length !== a.length) return !1;
    for (a = 0; a < l.length; a++) {
      var n = l[a];
      if (!Di.call(e, n) || !de(t[n], e[n]))
        return !1;
    }
    return !0;
  }
  function nr(t) {
    for (; t && t.firstChild; ) t = t.firstChild;
    return t;
  }
  function ur(t, e) {
    var l = nr(t);
    t = 0;
    for (var a; l; ) {
      if (l.nodeType === 3) {
        if (a = t + l.textContent.length, t <= e && a >= e)
          return { node: l, offset: e - t };
        t = a;
      }
      t: {
        for (; l; ) {
          if (l.nextSibling) {
            l = l.nextSibling;
            break t;
          }
          l = l.parentNode;
        }
        l = void 0;
      }
      l = nr(l);
    }
  }
  function ir(t, e) {
    return t && e ? t === e ? !0 : t && t.nodeType === 3 ? !1 : e && e.nodeType === 3 ? ir(t, e.parentNode) : "contains" in t ? t.contains(e) : t.compareDocumentPosition ? !!(t.compareDocumentPosition(e) & 16) : !1 : !1;
  }
  function cr(t) {
    t = t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null ? t.ownerDocument.defaultView : window;
    for (var e = nu(t.document); e instanceof t.HTMLIFrameElement; ) {
      try {
        var l = typeof e.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) t = e.contentWindow;
      else break;
      e = nu(t.document);
    }
    return e;
  }
  function ac(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e && (e === "input" && (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password") || e === "textarea" || t.contentEditable === "true");
  }
  var sv = Fe && "documentMode" in document && 11 >= document.documentMode, ga = null, nc = null, fn = null, uc = !1;
  function sr(t, e, l) {
    var a = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    uc || ga == null || ga !== nu(a) || (a = ga, "selectionStart" in a && ac(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), fn && sn(fn, a) || (fn = a, a = Iu(nc, "onSelect"), 0 < a.length && (e = new fu(
      "onSelect",
      "select",
      null,
      e,
      l
    ), t.push({ event: e, listeners: a }), e.target = ga)));
  }
  function Vl(t, e) {
    var l = {};
    return l[t.toLowerCase()] = e.toLowerCase(), l["Webkit" + t] = "webkit" + e, l["Moz" + t] = "moz" + e, l;
  }
  var ba = {
    animationend: Vl("Animation", "AnimationEnd"),
    animationiteration: Vl("Animation", "AnimationIteration"),
    animationstart: Vl("Animation", "AnimationStart"),
    transitionrun: Vl("Transition", "TransitionRun"),
    transitionstart: Vl("Transition", "TransitionStart"),
    transitioncancel: Vl("Transition", "TransitionCancel"),
    transitionend: Vl("Transition", "TransitionEnd")
  }, ic = {}, fr = {};
  Fe && (fr = document.createElement("div").style, "AnimationEvent" in window || (delete ba.animationend.animation, delete ba.animationiteration.animation, delete ba.animationstart.animation), "TransitionEvent" in window || delete ba.transitionend.transition);
  function Kl(t) {
    if (ic[t]) return ic[t];
    if (!ba[t]) return t;
    var e = ba[t], l;
    for (l in e)
      if (e.hasOwnProperty(l) && l in fr)
        return ic[t] = e[l];
    return t;
  }
  var rr = Kl("animationend"), or = Kl("animationiteration"), dr = Kl("animationstart"), fv = Kl("transitionrun"), rv = Kl("transitionstart"), ov = Kl("transitioncancel"), hr = Kl("transitionend"), mr = /* @__PURE__ */ new Map(), cc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  cc.push("scrollEnd");
  function Be(t, e) {
    mr.set(t, e), Ql(e, [t]);
  }
  var du = typeof reportError == "function" ? reportError : function(t) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var e = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof t == "object" && t !== null && typeof t.message == "string" ? String(t.message) : String(t),
        error: t
      });
      if (!window.dispatchEvent(e)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", t);
      return;
    }
    console.error(t);
  }, Te = [], Sa = 0, sc = 0;
  function hu() {
    for (var t = Sa, e = sc = Sa = 0; e < t; ) {
      var l = Te[e];
      Te[e++] = null;
      var a = Te[e];
      Te[e++] = null;
      var n = Te[e];
      Te[e++] = null;
      var u = Te[e];
      if (Te[e++] = null, a !== null && n !== null) {
        var c = a.pending;
        c === null ? n.next = n : (n.next = c.next, c.next = n), a.pending = n;
      }
      u !== 0 && vr(l, n, u);
    }
  }
  function mu(t, e, l, a) {
    Te[Sa++] = t, Te[Sa++] = e, Te[Sa++] = l, Te[Sa++] = a, sc |= a, t.lanes |= a, t = t.alternate, t !== null && (t.lanes |= a);
  }
  function fc(t, e, l, a) {
    return mu(t, e, l, a), vu(t);
  }
  function Jl(t, e) {
    return mu(t, null, null, e), vu(t);
  }
  function vr(t, e, l) {
    t.lanes |= l;
    var a = t.alternate;
    a !== null && (a.lanes |= l);
    for (var n = !1, u = t.return; u !== null; )
      u.childLanes |= l, a = u.alternate, a !== null && (a.childLanes |= l), u.tag === 22 && (t = u.stateNode, t === null || t._visibility & 1 || (n = !0)), t = u, u = u.return;
    return t.tag === 3 ? (u = t.stateNode, n && e !== null && (n = 31 - oe(l), t = u.hiddenUpdates, a = t[n], a === null ? t[n] = [e] : a.push(e), e.lane = l | 536870912), u) : null;
  }
  function vu(t) {
    if (50 < Mn)
      throw Mn = 0, gs = null, Error(s(185));
    for (var e = t.return; e !== null; )
      t = e, e = t.return;
    return t.tag === 3 ? t.stateNode : null;
  }
  var xa = {};
  function dv(t, e, l, a) {
    this.tag = t, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = e, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function he(t, e, l, a) {
    return new dv(t, e, l, a);
  }
  function rc(t) {
    return t = t.prototype, !(!t || !t.isReactComponent);
  }
  function Pe(t, e) {
    var l = t.alternate;
    return l === null ? (l = he(
      t.tag,
      e,
      t.key,
      t.mode
    ), l.elementType = t.elementType, l.type = t.type, l.stateNode = t.stateNode, l.alternate = t, t.alternate = l) : (l.pendingProps = e, l.type = t.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = t.flags & 65011712, l.childLanes = t.childLanes, l.lanes = t.lanes, l.child = t.child, l.memoizedProps = t.memoizedProps, l.memoizedState = t.memoizedState, l.updateQueue = t.updateQueue, e = t.dependencies, l.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }, l.sibling = t.sibling, l.index = t.index, l.ref = t.ref, l.refCleanup = t.refCleanup, l;
  }
  function yr(t, e) {
    t.flags &= 65011714;
    var l = t.alternate;
    return l === null ? (t.childLanes = 0, t.lanes = e, t.child = null, t.subtreeFlags = 0, t.memoizedProps = null, t.memoizedState = null, t.updateQueue = null, t.dependencies = null, t.stateNode = null) : (t.childLanes = l.childLanes, t.lanes = l.lanes, t.child = l.child, t.subtreeFlags = 0, t.deletions = null, t.memoizedProps = l.memoizedProps, t.memoizedState = l.memoizedState, t.updateQueue = l.updateQueue, t.type = l.type, e = l.dependencies, t.dependencies = e === null ? null : {
      lanes: e.lanes,
      firstContext: e.firstContext
    }), t;
  }
  function yu(t, e, l, a, n, u) {
    var c = 0;
    if (a = t, typeof t == "function") rc(t) && (c = 1);
    else if (typeof t == "string")
      c = py(
        t,
        l,
        V.current
      ) ? 26 : t === "html" || t === "head" || t === "body" ? 27 : 5;
    else
      t: switch (t) {
        case $t:
          return t = he(31, l, e, n), t.elementType = $t, t.lanes = u, t;
        case Y:
          return kl(l.children, n, u, e);
        case B:
          c = 8, n |= 24;
          break;
        case Z:
          return t = he(12, l, e, n | 2), t.elementType = Z, t.lanes = u, t;
        case it:
          return t = he(13, l, e, n), t.elementType = it, t.lanes = u, t;
        case At:
          return t = he(19, l, e, n), t.elementType = At, t.lanes = u, t;
        default:
          if (typeof t == "object" && t !== null)
            switch (t.$$typeof) {
              case X:
                c = 10;
                break t;
              case k:
                c = 9;
                break t;
              case lt:
                c = 11;
                break t;
              case F:
                c = 14;
                break t;
              case Ct:
                c = 16, a = null;
                break t;
            }
          c = 29, l = Error(
            s(130, t === null ? "null" : typeof t, "")
          ), a = null;
      }
    return e = he(c, l, e, n), e.elementType = t, e.type = a, e.lanes = u, e;
  }
  function kl(t, e, l, a) {
    return t = he(7, t, a, e), t.lanes = l, t;
  }
  function oc(t, e, l) {
    return t = he(6, t, null, e), t.lanes = l, t;
  }
  function pr(t) {
    var e = he(18, null, null, 0);
    return e.stateNode = t, e;
  }
  function dc(t, e, l) {
    return e = he(
      4,
      t.children !== null ? t.children : [],
      t.key,
      e
    ), e.lanes = l, e.stateNode = {
      containerInfo: t.containerInfo,
      pendingChildren: null,
      implementation: t.implementation
    }, e;
  }
  var gr = /* @__PURE__ */ new WeakMap();
  function je(t, e) {
    if (typeof t == "object" && t !== null) {
      var l = gr.get(t);
      return l !== void 0 ? l : (e = {
        value: t,
        source: e,
        stack: pf(e)
      }, gr.set(t, e), e);
    }
    return {
      value: t,
      source: e,
      stack: pf(e)
    };
  }
  var _a = [], Ea = 0, pu = null, rn = 0, ze = [], Ae = 0, bl = null, Qe = 1, Ze = "";
  function Ie(t, e) {
    _a[Ea++] = rn, _a[Ea++] = pu, pu = t, rn = e;
  }
  function br(t, e, l) {
    ze[Ae++] = Qe, ze[Ae++] = Ze, ze[Ae++] = bl, bl = t;
    var a = Qe;
    t = Ze;
    var n = 32 - oe(a) - 1;
    a &= ~(1 << n), l += 1;
    var u = 32 - oe(e) + n;
    if (30 < u) {
      var c = n - n % 5;
      u = (a & (1 << c) - 1).toString(32), a >>= c, n -= c, Qe = 1 << 32 - oe(e) + n | l << n | a, Ze = u + t;
    } else
      Qe = 1 << u | l << n | a, Ze = t;
  }
  function hc(t) {
    t.return !== null && (Ie(t, 1), br(t, 1, 0));
  }
  function mc(t) {
    for (; t === pu; )
      pu = _a[--Ea], _a[Ea] = null, rn = _a[--Ea], _a[Ea] = null;
    for (; t === bl; )
      bl = ze[--Ae], ze[Ae] = null, Ze = ze[--Ae], ze[Ae] = null, Qe = ze[--Ae], ze[Ae] = null;
  }
  function Sr(t, e) {
    ze[Ae++] = Qe, ze[Ae++] = Ze, ze[Ae++] = bl, Qe = e.id, Ze = e.overflow, bl = t;
  }
  var Vt = null, Et = null, ft = !1, Sl = null, Re = !1, vc = Error(s(519));
  function xl(t) {
    var e = Error(
      s(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw on(je(e, t)), vc;
  }
  function xr(t) {
    var e = t.stateNode, l = t.type, a = t.memoizedProps;
    switch (e[Zt] = t, e[le] = a, l) {
      case "dialog":
        ut("cancel", e), ut("close", e);
        break;
      case "iframe":
      case "object":
      case "embed":
        ut("load", e);
        break;
      case "video":
      case "audio":
        for (l = 0; l < Dn.length; l++)
          ut(Dn[l], e);
        break;
      case "source":
        ut("error", e);
        break;
      case "img":
      case "image":
      case "link":
        ut("error", e), ut("load", e);
        break;
      case "details":
        ut("toggle", e);
        break;
      case "input":
        ut("invalid", e), Uf(
          e,
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
        ut("invalid", e);
        break;
      case "textarea":
        ut("invalid", e), Bf(e, a.value, a.defaultValue, a.children);
    }
    l = a.children, typeof l != "string" && typeof l != "number" && typeof l != "bigint" || e.textContent === "" + l || a.suppressHydrationWarning === !0 || Yd(e.textContent, l) ? (a.popover != null && (ut("beforetoggle", e), ut("toggle", e)), a.onScroll != null && ut("scroll", e), a.onScrollEnd != null && ut("scrollend", e), a.onClick != null && (e.onclick = We), e = !0) : e = !1, e || xl(t, !0);
  }
  function _r(t) {
    for (Vt = t.return; Vt; )
      switch (Vt.tag) {
        case 5:
        case 31:
        case 13:
          Re = !1;
          return;
        case 27:
        case 3:
          Re = !0;
          return;
        default:
          Vt = Vt.return;
      }
  }
  function Ta(t) {
    if (t !== Vt) return !1;
    if (!ft) return _r(t), ft = !0, !1;
    var e = t.tag, l;
    if ((l = e !== 3 && e !== 27) && ((l = e === 5) && (l = t.type, l = !(l !== "form" && l !== "button") || Ds(t.type, t.memoizedProps)), l = !l), l && Et && xl(t), _r(t), e === 13) {
      if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(s(317));
      Et = kd(t);
    } else if (e === 31) {
      if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(s(317));
      Et = kd(t);
    } else
      e === 27 ? (e = Et, Hl(t.type) ? (t = qs, qs = null, Et = t) : Et = e) : Et = Vt ? Oe(t.stateNode.nextSibling) : null;
    return !0;
  }
  function $l() {
    Et = Vt = null, ft = !1;
  }
  function yc() {
    var t = Sl;
    return t !== null && (ce === null ? ce = t : ce.push.apply(
      ce,
      t
    ), Sl = null), t;
  }
  function on(t) {
    Sl === null ? Sl = [t] : Sl.push(t);
  }
  var pc = S(null), Wl = null, tl = null;
  function _l(t, e, l) {
    G(pc, e._currentValue), e._currentValue = l;
  }
  function el(t) {
    t._currentValue = pc.current, H(pc);
  }
  function gc(t, e, l) {
    for (; t !== null; ) {
      var a = t.alternate;
      if ((t.childLanes & e) !== e ? (t.childLanes |= e, a !== null && (a.childLanes |= e)) : a !== null && (a.childLanes & e) !== e && (a.childLanes |= e), t === l) break;
      t = t.return;
    }
  }
  function bc(t, e, l, a) {
    var n = t.child;
    for (n !== null && (n.return = t); n !== null; ) {
      var u = n.dependencies;
      if (u !== null) {
        var c = n.child;
        u = u.firstContext;
        t: for (; u !== null; ) {
          var o = u;
          u = n;
          for (var y = 0; y < e.length; y++)
            if (o.context === e[y]) {
              u.lanes |= l, o = u.alternate, o !== null && (o.lanes |= l), gc(
                u.return,
                l,
                t
              ), a || (c = null);
              break t;
            }
          u = o.next;
        }
      } else if (n.tag === 18) {
        if (c = n.return, c === null) throw Error(s(341));
        c.lanes |= l, u = c.alternate, u !== null && (u.lanes |= l), gc(c, l, t), c = null;
      } else c = n.child;
      if (c !== null) c.return = n;
      else
        for (c = n; c !== null; ) {
          if (c === t) {
            c = null;
            break;
          }
          if (n = c.sibling, n !== null) {
            n.return = c.return, c = n;
            break;
          }
          c = c.return;
        }
      n = c;
    }
  }
  function ja(t, e, l, a) {
    t = null;
    for (var n = e, u = !1; n !== null; ) {
      if (!u) {
        if ((n.flags & 524288) !== 0) u = !0;
        else if ((n.flags & 262144) !== 0) break;
      }
      if (n.tag === 10) {
        var c = n.alternate;
        if (c === null) throw Error(s(387));
        if (c = c.memoizedProps, c !== null) {
          var o = n.type;
          de(n.pendingProps.value, c.value) || (t !== null ? t.push(o) : t = [o]);
        }
      } else if (n === ht.current) {
        if (c = n.alternate, c === null) throw Error(s(387));
        c.memoizedState.memoizedState !== n.memoizedState.memoizedState && (t !== null ? t.push(qn) : t = [qn]);
      }
      n = n.return;
    }
    t !== null && bc(
      e,
      t,
      l,
      a
    ), e.flags |= 262144;
  }
  function gu(t) {
    for (t = t.firstContext; t !== null; ) {
      if (!de(
        t.context._currentValue,
        t.memoizedValue
      ))
        return !0;
      t = t.next;
    }
    return !1;
  }
  function Fl(t) {
    Wl = t, tl = null, t = t.dependencies, t !== null && (t.firstContext = null);
  }
  function Kt(t) {
    return Er(Wl, t);
  }
  function bu(t, e) {
    return Wl === null && Fl(t), Er(t, e);
  }
  function Er(t, e) {
    var l = e._currentValue;
    if (e = { context: e, memoizedValue: l, next: null }, tl === null) {
      if (t === null) throw Error(s(308));
      tl = e, t.dependencies = { lanes: 0, firstContext: e }, t.flags |= 524288;
    } else tl = tl.next = e;
    return l;
  }
  var hv = typeof AbortController < "u" ? AbortController : function() {
    var t = [], e = this.signal = {
      aborted: !1,
      addEventListener: function(l, a) {
        t.push(a);
      }
    };
    this.abort = function() {
      e.aborted = !0, t.forEach(function(l) {
        return l();
      });
    };
  }, mv = i.unstable_scheduleCallback, vv = i.unstable_NormalPriority, Lt = {
    $$typeof: X,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Sc() {
    return {
      controller: new hv(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function dn(t) {
    t.refCount--, t.refCount === 0 && mv(vv, function() {
      t.controller.abort();
    });
  }
  var hn = null, xc = 0, za = 0, Aa = null;
  function yv(t, e) {
    if (hn === null) {
      var l = hn = [];
      xc = 0, za = Ts(), Aa = {
        status: "pending",
        value: void 0,
        then: function(a) {
          l.push(a);
        }
      };
    }
    return xc++, e.then(Tr, Tr), e;
  }
  function Tr() {
    if (--xc === 0 && hn !== null) {
      Aa !== null && (Aa.status = "fulfilled");
      var t = hn;
      hn = null, za = 0, Aa = null;
      for (var e = 0; e < t.length; e++) (0, t[e])();
    }
  }
  function pv(t, e) {
    var l = [], a = {
      status: "pending",
      value: null,
      reason: null,
      then: function(n) {
        l.push(n);
      }
    };
    return t.then(
      function() {
        a.status = "fulfilled", a.value = e;
        for (var n = 0; n < l.length; n++) (0, l[n])(e);
      },
      function(n) {
        for (a.status = "rejected", a.reason = n, n = 0; n < l.length; n++)
          (0, l[n])(void 0);
      }
    ), a;
  }
  var jr = C.S;
  C.S = function(t, e) {
    fd = fe(), typeof e == "object" && e !== null && typeof e.then == "function" && yv(t, e), jr !== null && jr(t, e);
  };
  var Pl = S(null);
  function _c() {
    var t = Pl.current;
    return t !== null ? t : _t.pooledCache;
  }
  function Su(t, e) {
    e === null ? G(Pl, Pl.current) : G(Pl, e.pool);
  }
  function zr() {
    var t = _c();
    return t === null ? null : { parent: Lt._currentValue, pool: t };
  }
  var Ra = Error(s(460)), Ec = Error(s(474)), xu = Error(s(542)), _u = { then: function() {
  } };
  function Ar(t) {
    return t = t.status, t === "fulfilled" || t === "rejected";
  }
  function Rr(t, e, l) {
    switch (l = t[l], l === void 0 ? t.push(e) : l !== e && (e.then(We, We), e = l), e.status) {
      case "fulfilled":
        return e.value;
      case "rejected":
        throw t = e.reason, Or(t), t;
      default:
        if (typeof e.status == "string") e.then(We, We);
        else {
          if (t = _t, t !== null && 100 < t.shellSuspendCounter)
            throw Error(s(482));
          t = e, t.status = "pending", t.then(
            function(a) {
              if (e.status === "pending") {
                var n = e;
                n.status = "fulfilled", n.value = a;
              }
            },
            function(a) {
              if (e.status === "pending") {
                var n = e;
                n.status = "rejected", n.reason = a;
              }
            }
          );
        }
        switch (e.status) {
          case "fulfilled":
            return e.value;
          case "rejected":
            throw t = e.reason, Or(t), t;
        }
        throw ta = e, Ra;
    }
  }
  function Il(t) {
    try {
      var e = t._init;
      return e(t._payload);
    } catch (l) {
      throw l !== null && typeof l == "object" && typeof l.then == "function" ? (ta = l, Ra) : l;
    }
  }
  var ta = null;
  function Nr() {
    if (ta === null) throw Error(s(459));
    var t = ta;
    return ta = null, t;
  }
  function Or(t) {
    if (t === Ra || t === xu)
      throw Error(s(483));
  }
  var Na = null, mn = 0;
  function Eu(t) {
    var e = mn;
    return mn += 1, Na === null && (Na = []), Rr(Na, t, e);
  }
  function vn(t, e) {
    e = e.props.ref, t.ref = e !== void 0 ? e : null;
  }
  function Tu(t, e) {
    throw e.$$typeof === z ? Error(s(525)) : (t = Object.prototype.toString.call(e), Error(
      s(
        31,
        t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t
      )
    ));
  }
  function Mr(t) {
    function e(_, b) {
      if (t) {
        var T = _.deletions;
        T === null ? (_.deletions = [b], _.flags |= 16) : T.push(b);
      }
    }
    function l(_, b) {
      if (!t) return null;
      for (; b !== null; )
        e(_, b), b = b.sibling;
      return null;
    }
    function a(_) {
      for (var b = /* @__PURE__ */ new Map(); _ !== null; )
        _.key !== null ? b.set(_.key, _) : b.set(_.index, _), _ = _.sibling;
      return b;
    }
    function n(_, b) {
      return _ = Pe(_, b), _.index = 0, _.sibling = null, _;
    }
    function u(_, b, T) {
      return _.index = T, t ? (T = _.alternate, T !== null ? (T = T.index, T < b ? (_.flags |= 67108866, b) : T) : (_.flags |= 67108866, b)) : (_.flags |= 1048576, b);
    }
    function c(_) {
      return t && _.alternate === null && (_.flags |= 67108866), _;
    }
    function o(_, b, T, D) {
      return b === null || b.tag !== 6 ? (b = oc(T, _.mode, D), b.return = _, b) : (b = n(b, T), b.return = _, b);
    }
    function y(_, b, T, D) {
      var J = T.type;
      return J === Y ? M(
        _,
        b,
        T.props.children,
        D,
        T.key
      ) : b !== null && (b.elementType === J || typeof J == "object" && J !== null && J.$$typeof === Ct && Il(J) === b.type) ? (b = n(b, T.props), vn(b, T), b.return = _, b) : (b = yu(
        T.type,
        T.key,
        T.props,
        null,
        _.mode,
        D
      ), vn(b, T), b.return = _, b);
    }
    function j(_, b, T, D) {
      return b === null || b.tag !== 4 || b.stateNode.containerInfo !== T.containerInfo || b.stateNode.implementation !== T.implementation ? (b = dc(T, _.mode, D), b.return = _, b) : (b = n(b, T.children || []), b.return = _, b);
    }
    function M(_, b, T, D, J) {
      return b === null || b.tag !== 7 ? (b = kl(
        T,
        _.mode,
        D,
        J
      ), b.return = _, b) : (b = n(b, T), b.return = _, b);
    }
    function U(_, b, T) {
      if (typeof b == "string" && b !== "" || typeof b == "number" || typeof b == "bigint")
        return b = oc(
          "" + b,
          _.mode,
          T
        ), b.return = _, b;
      if (typeof b == "object" && b !== null) {
        switch (b.$$typeof) {
          case L:
            return T = yu(
              b.type,
              b.key,
              b.props,
              null,
              _.mode,
              T
            ), vn(T, b), T.return = _, T;
          case q:
            return b = dc(
              b,
              _.mode,
              T
            ), b.return = _, b;
          case Ct:
            return b = Il(b), U(_, b, T);
        }
        if (Bt(b) || Wt(b))
          return b = kl(
            b,
            _.mode,
            T,
            null
          ), b.return = _, b;
        if (typeof b.then == "function")
          return U(_, Eu(b), T);
        if (b.$$typeof === X)
          return U(
            _,
            bu(_, b),
            T
          );
        Tu(_, b);
      }
      return null;
    }
    function R(_, b, T, D) {
      var J = b !== null ? b.key : null;
      if (typeof T == "string" && T !== "" || typeof T == "number" || typeof T == "bigint")
        return J !== null ? null : o(_, b, "" + T, D);
      if (typeof T == "object" && T !== null) {
        switch (T.$$typeof) {
          case L:
            return T.key === J ? y(_, b, T, D) : null;
          case q:
            return T.key === J ? j(_, b, T, D) : null;
          case Ct:
            return T = Il(T), R(_, b, T, D);
        }
        if (Bt(T) || Wt(T))
          return J !== null ? null : M(_, b, T, D, null);
        if (typeof T.then == "function")
          return R(
            _,
            b,
            Eu(T),
            D
          );
        if (T.$$typeof === X)
          return R(
            _,
            b,
            bu(_, T),
            D
          );
        Tu(_, T);
      }
      return null;
    }
    function O(_, b, T, D, J) {
      if (typeof D == "string" && D !== "" || typeof D == "number" || typeof D == "bigint")
        return _ = _.get(T) || null, o(b, _, "" + D, J);
      if (typeof D == "object" && D !== null) {
        switch (D.$$typeof) {
          case L:
            return _ = _.get(
              D.key === null ? T : D.key
            ) || null, y(b, _, D, J);
          case q:
            return _ = _.get(
              D.key === null ? T : D.key
            ) || null, j(b, _, D, J);
          case Ct:
            return D = Il(D), O(
              _,
              b,
              T,
              D,
              J
            );
        }
        if (Bt(D) || Wt(D))
          return _ = _.get(T) || null, M(b, _, D, J, null);
        if (typeof D.then == "function")
          return O(
            _,
            b,
            T,
            Eu(D),
            J
          );
        if (D.$$typeof === X)
          return O(
            _,
            b,
            T,
            bu(b, D),
            J
          );
        Tu(b, D);
      }
      return null;
    }
    function Q(_, b, T, D) {
      for (var J = null, rt = null, K = b, et = b = 0, st = null; K !== null && et < T.length; et++) {
        K.index > et ? (st = K, K = null) : st = K.sibling;
        var ot = R(
          _,
          K,
          T[et],
          D
        );
        if (ot === null) {
          K === null && (K = st);
          break;
        }
        t && K && ot.alternate === null && e(_, K), b = u(ot, b, et), rt === null ? J = ot : rt.sibling = ot, rt = ot, K = st;
      }
      if (et === T.length)
        return l(_, K), ft && Ie(_, et), J;
      if (K === null) {
        for (; et < T.length; et++)
          K = U(_, T[et], D), K !== null && (b = u(
            K,
            b,
            et
          ), rt === null ? J = K : rt.sibling = K, rt = K);
        return ft && Ie(_, et), J;
      }
      for (K = a(K); et < T.length; et++)
        st = O(
          K,
          _,
          et,
          T[et],
          D
        ), st !== null && (t && st.alternate !== null && K.delete(
          st.key === null ? et : st.key
        ), b = u(
          st,
          b,
          et
        ), rt === null ? J = st : rt.sibling = st, rt = st);
      return t && K.forEach(function(wl) {
        return e(_, wl);
      }), ft && Ie(_, et), J;
    }
    function $(_, b, T, D) {
      if (T == null) throw Error(s(151));
      for (var J = null, rt = null, K = b, et = b = 0, st = null, ot = T.next(); K !== null && !ot.done; et++, ot = T.next()) {
        K.index > et ? (st = K, K = null) : st = K.sibling;
        var wl = R(_, K, ot.value, D);
        if (wl === null) {
          K === null && (K = st);
          break;
        }
        t && K && wl.alternate === null && e(_, K), b = u(wl, b, et), rt === null ? J = wl : rt.sibling = wl, rt = wl, K = st;
      }
      if (ot.done)
        return l(_, K), ft && Ie(_, et), J;
      if (K === null) {
        for (; !ot.done; et++, ot = T.next())
          ot = U(_, ot.value, D), ot !== null && (b = u(ot, b, et), rt === null ? J = ot : rt.sibling = ot, rt = ot);
        return ft && Ie(_, et), J;
      }
      for (K = a(K); !ot.done; et++, ot = T.next())
        ot = O(K, _, et, ot.value, D), ot !== null && (t && ot.alternate !== null && K.delete(ot.key === null ? et : ot.key), b = u(ot, b, et), rt === null ? J = ot : rt.sibling = ot, rt = ot);
      return t && K.forEach(function(Ry) {
        return e(_, Ry);
      }), ft && Ie(_, et), J;
    }
    function bt(_, b, T, D) {
      if (typeof T == "object" && T !== null && T.type === Y && T.key === null && (T = T.props.children), typeof T == "object" && T !== null) {
        switch (T.$$typeof) {
          case L:
            t: {
              for (var J = T.key; b !== null; ) {
                if (b.key === J) {
                  if (J = T.type, J === Y) {
                    if (b.tag === 7) {
                      l(
                        _,
                        b.sibling
                      ), D = n(
                        b,
                        T.props.children
                      ), D.return = _, _ = D;
                      break t;
                    }
                  } else if (b.elementType === J || typeof J == "object" && J !== null && J.$$typeof === Ct && Il(J) === b.type) {
                    l(
                      _,
                      b.sibling
                    ), D = n(b, T.props), vn(D, T), D.return = _, _ = D;
                    break t;
                  }
                  l(_, b);
                  break;
                } else e(_, b);
                b = b.sibling;
              }
              T.type === Y ? (D = kl(
                T.props.children,
                _.mode,
                D,
                T.key
              ), D.return = _, _ = D) : (D = yu(
                T.type,
                T.key,
                T.props,
                null,
                _.mode,
                D
              ), vn(D, T), D.return = _, _ = D);
            }
            return c(_);
          case q:
            t: {
              for (J = T.key; b !== null; ) {
                if (b.key === J)
                  if (b.tag === 4 && b.stateNode.containerInfo === T.containerInfo && b.stateNode.implementation === T.implementation) {
                    l(
                      _,
                      b.sibling
                    ), D = n(b, T.children || []), D.return = _, _ = D;
                    break t;
                  } else {
                    l(_, b);
                    break;
                  }
                else e(_, b);
                b = b.sibling;
              }
              D = dc(T, _.mode, D), D.return = _, _ = D;
            }
            return c(_);
          case Ct:
            return T = Il(T), bt(
              _,
              b,
              T,
              D
            );
        }
        if (Bt(T))
          return Q(
            _,
            b,
            T,
            D
          );
        if (Wt(T)) {
          if (J = Wt(T), typeof J != "function") throw Error(s(150));
          return T = J.call(T), $(
            _,
            b,
            T,
            D
          );
        }
        if (typeof T.then == "function")
          return bt(
            _,
            b,
            Eu(T),
            D
          );
        if (T.$$typeof === X)
          return bt(
            _,
            b,
            bu(_, T),
            D
          );
        Tu(_, T);
      }
      return typeof T == "string" && T !== "" || typeof T == "number" || typeof T == "bigint" ? (T = "" + T, b !== null && b.tag === 6 ? (l(_, b.sibling), D = n(b, T), D.return = _, _ = D) : (l(_, b), D = oc(T, _.mode, D), D.return = _, _ = D), c(_)) : l(_, b);
    }
    return function(_, b, T, D) {
      try {
        mn = 0;
        var J = bt(
          _,
          b,
          T,
          D
        );
        return Na = null, J;
      } catch (K) {
        if (K === Ra || K === xu) throw K;
        var rt = he(29, K, null, _.mode);
        return rt.lanes = D, rt.return = _, rt;
      } finally {
      }
    };
  }
  var ea = Mr(!0), Cr = Mr(!1), El = !1;
  function Tc(t) {
    t.updateQueue = {
      baseState: t.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function jc(t, e) {
    t = t.updateQueue, e.updateQueue === t && (e.updateQueue = {
      baseState: t.baseState,
      firstBaseUpdate: t.firstBaseUpdate,
      lastBaseUpdate: t.lastBaseUpdate,
      shared: t.shared,
      callbacks: null
    });
  }
  function Tl(t) {
    return { lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function jl(t, e, l) {
    var a = t.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (dt & 2) !== 0) {
      var n = a.pending;
      return n === null ? e.next = e : (e.next = n.next, n.next = e), a.pending = e, e = vu(t), vr(t, null, l), e;
    }
    return mu(t, a, e, l), vu(t);
  }
  function yn(t, e, l) {
    if (e = e.updateQueue, e !== null && (e = e.shared, (l & 4194048) !== 0)) {
      var a = e.lanes;
      a &= t.pendingLanes, l |= a, e.lanes = l, Ef(t, l);
    }
  }
  function zc(t, e) {
    var l = t.updateQueue, a = t.alternate;
    if (a !== null && (a = a.updateQueue, l === a)) {
      var n = null, u = null;
      if (l = l.firstBaseUpdate, l !== null) {
        do {
          var c = {
            lane: l.lane,
            tag: l.tag,
            payload: l.payload,
            callback: null,
            next: null
          };
          u === null ? n = u = c : u = u.next = c, l = l.next;
        } while (l !== null);
        u === null ? n = u = e : u = u.next = e;
      } else n = u = e;
      l = {
        baseState: a.baseState,
        firstBaseUpdate: n,
        lastBaseUpdate: u,
        shared: a.shared,
        callbacks: a.callbacks
      }, t.updateQueue = l;
      return;
    }
    t = l.lastBaseUpdate, t === null ? l.firstBaseUpdate = e : t.next = e, l.lastBaseUpdate = e;
  }
  var Ac = !1;
  function pn() {
    if (Ac) {
      var t = Aa;
      if (t !== null) throw t;
    }
  }
  function gn(t, e, l, a) {
    Ac = !1;
    var n = t.updateQueue;
    El = !1;
    var u = n.firstBaseUpdate, c = n.lastBaseUpdate, o = n.shared.pending;
    if (o !== null) {
      n.shared.pending = null;
      var y = o, j = y.next;
      y.next = null, c === null ? u = j : c.next = j, c = y;
      var M = t.alternate;
      M !== null && (M = M.updateQueue, o = M.lastBaseUpdate, o !== c && (o === null ? M.firstBaseUpdate = j : o.next = j, M.lastBaseUpdate = y));
    }
    if (u !== null) {
      var U = n.baseState;
      c = 0, M = j = y = null, o = u;
      do {
        var R = o.lane & -536870913, O = R !== o.lane;
        if (O ? (ct & R) === R : (a & R) === R) {
          R !== 0 && R === za && (Ac = !0), M !== null && (M = M.next = {
            lane: 0,
            tag: o.tag,
            payload: o.payload,
            callback: null,
            next: null
          });
          t: {
            var Q = t, $ = o;
            R = e;
            var bt = l;
            switch ($.tag) {
              case 1:
                if (Q = $.payload, typeof Q == "function") {
                  U = Q.call(bt, U, R);
                  break t;
                }
                U = Q;
                break t;
              case 3:
                Q.flags = Q.flags & -65537 | 128;
              case 0:
                if (Q = $.payload, R = typeof Q == "function" ? Q.call(bt, U, R) : Q, R == null) break t;
                U = E({}, U, R);
                break t;
              case 2:
                El = !0;
            }
          }
          R = o.callback, R !== null && (t.flags |= 64, O && (t.flags |= 8192), O = n.callbacks, O === null ? n.callbacks = [R] : O.push(R));
        } else
          O = {
            lane: R,
            tag: o.tag,
            payload: o.payload,
            callback: o.callback,
            next: null
          }, M === null ? (j = M = O, y = U) : M = M.next = O, c |= R;
        if (o = o.next, o === null) {
          if (o = n.shared.pending, o === null)
            break;
          O = o, o = O.next, O.next = null, n.lastBaseUpdate = O, n.shared.pending = null;
        }
      } while (!0);
      M === null && (y = U), n.baseState = y, n.firstBaseUpdate = j, n.lastBaseUpdate = M, u === null && (n.shared.lanes = 0), Ol |= c, t.lanes = c, t.memoizedState = U;
    }
  }
  function Dr(t, e) {
    if (typeof t != "function")
      throw Error(s(191, t));
    t.call(e);
  }
  function Ur(t, e) {
    var l = t.callbacks;
    if (l !== null)
      for (t.callbacks = null, t = 0; t < l.length; t++)
        Dr(l[t], e);
  }
  var Oa = S(null), ju = S(0);
  function Hr(t, e) {
    t = rl, G(ju, t), G(Oa, e), rl = t | e.baseLanes;
  }
  function Rc() {
    G(ju, rl), G(Oa, Oa.current);
  }
  function Nc() {
    rl = ju.current, H(Oa), H(ju);
  }
  var me = S(null), Ne = null;
  function zl(t) {
    var e = t.alternate;
    G(Ut, Ut.current & 1), G(me, t), Ne === null && (e === null || Oa.current !== null || e.memoizedState !== null) && (Ne = t);
  }
  function Oc(t) {
    G(Ut, Ut.current), G(me, t), Ne === null && (Ne = t);
  }
  function Br(t) {
    t.tag === 22 ? (G(Ut, Ut.current), G(me, t), Ne === null && (Ne = t)) : Al();
  }
  function Al() {
    G(Ut, Ut.current), G(me, me.current);
  }
  function ve(t) {
    H(me), Ne === t && (Ne = null), H(Ut);
  }
  var Ut = S(0);
  function zu(t) {
    for (var e = t; e !== null; ) {
      if (e.tag === 13) {
        var l = e.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || Bs(l) || Ls(l)))
          return e;
      } else if (e.tag === 19 && (e.memoizedProps.revealOrder === "forwards" || e.memoizedProps.revealOrder === "backwards" || e.memoizedProps.revealOrder === "unstable_legacy-backwards" || e.memoizedProps.revealOrder === "together")) {
        if ((e.flags & 128) !== 0) return e;
      } else if (e.child !== null) {
        e.child.return = e, e = e.child;
        continue;
      }
      if (e === t) break;
      for (; e.sibling === null; ) {
        if (e.return === null || e.return === t) return null;
        e = e.return;
      }
      e.sibling.return = e.return, e = e.sibling;
    }
    return null;
  }
  var ll = 0, tt = null, pt = null, qt = null, Au = !1, Ma = !1, la = !1, Ru = 0, bn = 0, Ca = null, gv = 0;
  function Rt() {
    throw Error(s(321));
  }
  function Mc(t, e) {
    if (e === null) return !1;
    for (var l = 0; l < e.length && l < t.length; l++)
      if (!de(t[l], e[l])) return !1;
    return !0;
  }
  function Cc(t, e, l, a, n, u) {
    return ll = u, tt = e, e.memoizedState = null, e.updateQueue = null, e.lanes = 0, C.H = t === null || t.memoizedState === null ? So : Jc, la = !1, u = l(a, n), la = !1, Ma && (u = qr(
      e,
      l,
      a,
      n
    )), Lr(t), u;
  }
  function Lr(t) {
    C.H = _n;
    var e = pt !== null && pt.next !== null;
    if (ll = 0, qt = pt = tt = null, Au = !1, bn = 0, Ca = null, e) throw Error(s(300));
    t === null || Yt || (t = t.dependencies, t !== null && gu(t) && (Yt = !0));
  }
  function qr(t, e, l, a) {
    tt = t;
    var n = 0;
    do {
      if (Ma && (Ca = null), bn = 0, Ma = !1, 25 <= n) throw Error(s(301));
      if (n += 1, qt = pt = null, t.updateQueue != null) {
        var u = t.updateQueue;
        u.lastEffect = null, u.events = null, u.stores = null, u.memoCache != null && (u.memoCache.index = 0);
      }
      C.H = xo, u = e(l, a);
    } while (Ma);
    return u;
  }
  function bv() {
    var t = C.H, e = t.useState()[0];
    return e = typeof e.then == "function" ? Sn(e) : e, t = t.useState()[0], (pt !== null ? pt.memoizedState : null) !== t && (tt.flags |= 1024), e;
  }
  function Dc() {
    var t = Ru !== 0;
    return Ru = 0, t;
  }
  function Uc(t, e, l) {
    e.updateQueue = t.updateQueue, e.flags &= -2053, t.lanes &= ~l;
  }
  function Hc(t) {
    if (Au) {
      for (t = t.memoizedState; t !== null; ) {
        var e = t.queue;
        e !== null && (e.pending = null), t = t.next;
      }
      Au = !1;
    }
    ll = 0, qt = pt = tt = null, Ma = !1, bn = Ru = 0, Ca = null;
  }
  function ee() {
    var t = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return qt === null ? tt.memoizedState = qt = t : qt = qt.next = t, qt;
  }
  function Ht() {
    if (pt === null) {
      var t = tt.alternate;
      t = t !== null ? t.memoizedState : null;
    } else t = pt.next;
    var e = qt === null ? tt.memoizedState : qt.next;
    if (e !== null)
      qt = e, pt = t;
    else {
      if (t === null)
        throw tt.alternate === null ? Error(s(467)) : Error(s(310));
      pt = t, t = {
        memoizedState: pt.memoizedState,
        baseState: pt.baseState,
        baseQueue: pt.baseQueue,
        queue: pt.queue,
        next: null
      }, qt === null ? tt.memoizedState = qt = t : qt = qt.next = t;
    }
    return qt;
  }
  function Nu() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Sn(t) {
    var e = bn;
    return bn += 1, Ca === null && (Ca = []), t = Rr(Ca, t, e), e = tt, (qt === null ? e.memoizedState : qt.next) === null && (e = e.alternate, C.H = e === null || e.memoizedState === null ? So : Jc), t;
  }
  function Ou(t) {
    if (t !== null && typeof t == "object") {
      if (typeof t.then == "function") return Sn(t);
      if (t.$$typeof === X) return Kt(t);
    }
    throw Error(s(438, String(t)));
  }
  function Bc(t) {
    var e = null, l = tt.updateQueue;
    if (l !== null && (e = l.memoCache), e == null) {
      var a = tt.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (e = {
        data: a.data.map(function(n) {
          return n.slice();
        }),
        index: 0
      })));
    }
    if (e == null && (e = { data: [], index: 0 }), l === null && (l = Nu(), tt.updateQueue = l), l.memoCache = e, l = e.data[e.index], l === void 0)
      for (l = e.data[e.index] = Array(t), a = 0; a < t; a++)
        l[a] = Ge;
    return e.index++, l;
  }
  function al(t, e) {
    return typeof e == "function" ? e(t) : e;
  }
  function Mu(t) {
    var e = Ht();
    return Lc(e, pt, t);
  }
  function Lc(t, e, l) {
    var a = t.queue;
    if (a === null) throw Error(s(311));
    a.lastRenderedReducer = l;
    var n = t.baseQueue, u = a.pending;
    if (u !== null) {
      if (n !== null) {
        var c = n.next;
        n.next = u.next, u.next = c;
      }
      e.baseQueue = n = u, a.pending = null;
    }
    if (u = t.baseState, n === null) t.memoizedState = u;
    else {
      e = n.next;
      var o = c = null, y = null, j = e, M = !1;
      do {
        var U = j.lane & -536870913;
        if (U !== j.lane ? (ct & U) === U : (ll & U) === U) {
          var R = j.revertLane;
          if (R === 0)
            y !== null && (y = y.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: j.action,
              hasEagerState: j.hasEagerState,
              eagerState: j.eagerState,
              next: null
            }), U === za && (M = !0);
          else if ((ll & R) === R) {
            j = j.next, R === za && (M = !0);
            continue;
          } else
            U = {
              lane: 0,
              revertLane: j.revertLane,
              gesture: null,
              action: j.action,
              hasEagerState: j.hasEagerState,
              eagerState: j.eagerState,
              next: null
            }, y === null ? (o = y = U, c = u) : y = y.next = U, tt.lanes |= R, Ol |= R;
          U = j.action, la && l(u, U), u = j.hasEagerState ? j.eagerState : l(u, U);
        } else
          R = {
            lane: U,
            revertLane: j.revertLane,
            gesture: j.gesture,
            action: j.action,
            hasEagerState: j.hasEagerState,
            eagerState: j.eagerState,
            next: null
          }, y === null ? (o = y = R, c = u) : y = y.next = R, tt.lanes |= U, Ol |= U;
        j = j.next;
      } while (j !== null && j !== e);
      if (y === null ? c = u : y.next = o, !de(u, t.memoizedState) && (Yt = !0, M && (l = Aa, l !== null)))
        throw l;
      t.memoizedState = u, t.baseState = c, t.baseQueue = y, a.lastRenderedState = u;
    }
    return n === null && (a.lanes = 0), [t.memoizedState, a.dispatch];
  }
  function qc(t) {
    var e = Ht(), l = e.queue;
    if (l === null) throw Error(s(311));
    l.lastRenderedReducer = t;
    var a = l.dispatch, n = l.pending, u = e.memoizedState;
    if (n !== null) {
      l.pending = null;
      var c = n = n.next;
      do
        u = t(u, c.action), c = c.next;
      while (c !== n);
      de(u, e.memoizedState) || (Yt = !0), e.memoizedState = u, e.baseQueue === null && (e.baseState = u), l.lastRenderedState = u;
    }
    return [u, a];
  }
  function Yr(t, e, l) {
    var a = tt, n = Ht(), u = ft;
    if (u) {
      if (l === void 0) throw Error(s(407));
      l = l();
    } else l = e();
    var c = !de(
      (pt || n).memoizedState,
      l
    );
    if (c && (n.memoizedState = l, Yt = !0), n = n.queue, Gc(Xr.bind(null, a, n, t), [
      t
    ]), n.getSnapshot !== e || c || qt !== null && qt.memoizedState.tag & 1) {
      if (a.flags |= 2048, Da(
        9,
        { destroy: void 0 },
        Gr.bind(
          null,
          a,
          n,
          l,
          e
        ),
        null
      ), _t === null) throw Error(s(349));
      u || (ll & 127) !== 0 || wr(a, e, l);
    }
    return l;
  }
  function wr(t, e, l) {
    t.flags |= 16384, t = { getSnapshot: e, value: l }, e = tt.updateQueue, e === null ? (e = Nu(), tt.updateQueue = e, e.stores = [t]) : (l = e.stores, l === null ? e.stores = [t] : l.push(t));
  }
  function Gr(t, e, l, a) {
    e.value = l, e.getSnapshot = a, Qr(e) && Zr(t);
  }
  function Xr(t, e, l) {
    return l(function() {
      Qr(e) && Zr(t);
    });
  }
  function Qr(t) {
    var e = t.getSnapshot;
    t = t.value;
    try {
      var l = e();
      return !de(t, l);
    } catch {
      return !0;
    }
  }
  function Zr(t) {
    var e = Jl(t, 2);
    e !== null && se(e, t, 2);
  }
  function Yc(t) {
    var e = ee();
    if (typeof t == "function") {
      var l = t;
      if (t = l(), la) {
        yl(!0);
        try {
          l();
        } finally {
          yl(!1);
        }
      }
    }
    return e.memoizedState = e.baseState = t, e.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: al,
      lastRenderedState: t
    }, e;
  }
  function Vr(t, e, l, a) {
    return t.baseState = l, Lc(
      t,
      pt,
      typeof a == "function" ? a : al
    );
  }
  function Sv(t, e, l, a, n) {
    if (Uu(t)) throw Error(s(485));
    if (t = e.action, t !== null) {
      var u = {
        payload: n,
        action: t,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(c) {
          u.listeners.push(c);
        }
      };
      C.T !== null ? l(!0) : u.isTransition = !1, a(u), l = e.pending, l === null ? (u.next = e.pending = u, Kr(e, u)) : (u.next = l.next, e.pending = l.next = u);
    }
  }
  function Kr(t, e) {
    var l = e.action, a = e.payload, n = t.state;
    if (e.isTransition) {
      var u = C.T, c = {};
      C.T = c;
      try {
        var o = l(n, a), y = C.S;
        y !== null && y(c, o), Jr(t, e, o);
      } catch (j) {
        wc(t, e, j);
      } finally {
        u !== null && c.types !== null && (u.types = c.types), C.T = u;
      }
    } else
      try {
        u = l(n, a), Jr(t, e, u);
      } catch (j) {
        wc(t, e, j);
      }
  }
  function Jr(t, e, l) {
    l !== null && typeof l == "object" && typeof l.then == "function" ? l.then(
      function(a) {
        kr(t, e, a);
      },
      function(a) {
        return wc(t, e, a);
      }
    ) : kr(t, e, l);
  }
  function kr(t, e, l) {
    e.status = "fulfilled", e.value = l, $r(e), t.state = l, e = t.pending, e !== null && (l = e.next, l === e ? t.pending = null : (l = l.next, e.next = l, Kr(t, l)));
  }
  function wc(t, e, l) {
    var a = t.pending;
    if (t.pending = null, a !== null) {
      a = a.next;
      do
        e.status = "rejected", e.reason = l, $r(e), e = e.next;
      while (e !== a);
    }
    t.action = null;
  }
  function $r(t) {
    t = t.listeners;
    for (var e = 0; e < t.length; e++) (0, t[e])();
  }
  function Wr(t, e) {
    return e;
  }
  function Fr(t, e) {
    if (ft) {
      var l = _t.formState;
      if (l !== null) {
        t: {
          var a = tt;
          if (ft) {
            if (Et) {
              e: {
                for (var n = Et, u = Re; n.nodeType !== 8; ) {
                  if (!u) {
                    n = null;
                    break e;
                  }
                  if (n = Oe(
                    n.nextSibling
                  ), n === null) {
                    n = null;
                    break e;
                  }
                }
                u = n.data, n = u === "F!" || u === "F" ? n : null;
              }
              if (n) {
                Et = Oe(
                  n.nextSibling
                ), a = n.data === "F!";
                break t;
              }
            }
            xl(a);
          }
          a = !1;
        }
        a && (e = l[0]);
      }
    }
    return l = ee(), l.memoizedState = l.baseState = e, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Wr,
      lastRenderedState: e
    }, l.queue = a, l = po.bind(
      null,
      tt,
      a
    ), a.dispatch = l, a = Yc(!1), u = Kc.bind(
      null,
      tt,
      !1,
      a.queue
    ), a = ee(), n = {
      state: e,
      dispatch: null,
      action: t,
      pending: null
    }, a.queue = n, l = Sv.bind(
      null,
      tt,
      n,
      u,
      l
    ), n.dispatch = l, a.memoizedState = t, [e, l, !1];
  }
  function Pr(t) {
    var e = Ht();
    return Ir(e, pt, t);
  }
  function Ir(t, e, l) {
    if (e = Lc(
      t,
      e,
      Wr
    )[0], t = Mu(al)[0], typeof e == "object" && e !== null && typeof e.then == "function")
      try {
        var a = Sn(e);
      } catch (c) {
        throw c === Ra ? xu : c;
      }
    else a = e;
    e = Ht();
    var n = e.queue, u = n.dispatch;
    return l !== e.memoizedState && (tt.flags |= 2048, Da(
      9,
      { destroy: void 0 },
      xv.bind(null, n, l),
      null
    )), [a, u, t];
  }
  function xv(t, e) {
    t.action = e;
  }
  function to(t) {
    var e = Ht(), l = pt;
    if (l !== null)
      return Ir(e, l, t);
    Ht(), e = e.memoizedState, l = Ht();
    var a = l.queue.dispatch;
    return l.memoizedState = t, [e, a, !1];
  }
  function Da(t, e, l, a) {
    return t = { tag: t, create: l, deps: a, inst: e, next: null }, e = tt.updateQueue, e === null && (e = Nu(), tt.updateQueue = e), l = e.lastEffect, l === null ? e.lastEffect = t.next = t : (a = l.next, l.next = t, t.next = a, e.lastEffect = t), t;
  }
  function eo() {
    return Ht().memoizedState;
  }
  function Cu(t, e, l, a) {
    var n = ee();
    tt.flags |= t, n.memoizedState = Da(
      1 | e,
      { destroy: void 0 },
      l,
      a === void 0 ? null : a
    );
  }
  function Du(t, e, l, a) {
    var n = Ht();
    a = a === void 0 ? null : a;
    var u = n.memoizedState.inst;
    pt !== null && a !== null && Mc(a, pt.memoizedState.deps) ? n.memoizedState = Da(e, u, l, a) : (tt.flags |= t, n.memoizedState = Da(
      1 | e,
      u,
      l,
      a
    ));
  }
  function lo(t, e) {
    Cu(8390656, 8, t, e);
  }
  function Gc(t, e) {
    Du(2048, 8, t, e);
  }
  function _v(t) {
    tt.flags |= 4;
    var e = tt.updateQueue;
    if (e === null)
      e = Nu(), tt.updateQueue = e, e.events = [t];
    else {
      var l = e.events;
      l === null ? e.events = [t] : l.push(t);
    }
  }
  function ao(t) {
    var e = Ht().memoizedState;
    return _v({ ref: e, nextImpl: t }), function() {
      if ((dt & 2) !== 0) throw Error(s(440));
      return e.impl.apply(void 0, arguments);
    };
  }
  function no(t, e) {
    return Du(4, 2, t, e);
  }
  function uo(t, e) {
    return Du(4, 4, t, e);
  }
  function io(t, e) {
    if (typeof e == "function") {
      t = t();
      var l = e(t);
      return function() {
        typeof l == "function" ? l() : e(null);
      };
    }
    if (e != null)
      return t = t(), e.current = t, function() {
        e.current = null;
      };
  }
  function co(t, e, l) {
    l = l != null ? l.concat([t]) : null, Du(4, 4, io.bind(null, e, t), l);
  }
  function Xc() {
  }
  function so(t, e) {
    var l = Ht();
    e = e === void 0 ? null : e;
    var a = l.memoizedState;
    return e !== null && Mc(e, a[1]) ? a[0] : (l.memoizedState = [t, e], t);
  }
  function fo(t, e) {
    var l = Ht();
    e = e === void 0 ? null : e;
    var a = l.memoizedState;
    if (e !== null && Mc(e, a[1]))
      return a[0];
    if (a = t(), la) {
      yl(!0);
      try {
        t();
      } finally {
        yl(!1);
      }
    }
    return l.memoizedState = [a, e], a;
  }
  function Qc(t, e, l) {
    return l === void 0 || (ll & 1073741824) !== 0 && (ct & 261930) === 0 ? t.memoizedState = e : (t.memoizedState = l, t = od(), tt.lanes |= t, Ol |= t, l);
  }
  function ro(t, e, l, a) {
    return de(l, e) ? l : Oa.current !== null ? (t = Qc(t, l, a), de(t, e) || (Yt = !0), t) : (ll & 42) === 0 || (ll & 1073741824) !== 0 && (ct & 261930) === 0 ? (Yt = !0, t.memoizedState = l) : (t = od(), tt.lanes |= t, Ol |= t, e);
  }
  function oo(t, e, l, a, n) {
    var u = w.p;
    w.p = u !== 0 && 8 > u ? u : 8;
    var c = C.T, o = {};
    C.T = o, Kc(t, !1, e, l);
    try {
      var y = n(), j = C.S;
      if (j !== null && j(o, y), y !== null && typeof y == "object" && typeof y.then == "function") {
        var M = pv(
          y,
          a
        );
        xn(
          t,
          e,
          M,
          ge(t)
        );
      } else
        xn(
          t,
          e,
          a,
          ge(t)
        );
    } catch (U) {
      xn(
        t,
        e,
        { then: function() {
        }, status: "rejected", reason: U },
        ge()
      );
    } finally {
      w.p = u, c !== null && o.types !== null && (c.types = o.types), C.T = c;
    }
  }
  function Ev() {
  }
  function Zc(t, e, l, a) {
    if (t.tag !== 5) throw Error(s(476));
    var n = ho(t).queue;
    oo(
      t,
      n,
      e,
      W,
      l === null ? Ev : function() {
        return mo(t), l(a);
      }
    );
  }
  function ho(t) {
    var e = t.memoizedState;
    if (e !== null) return e;
    e = {
      memoizedState: W,
      baseState: W,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: al,
        lastRenderedState: W
      },
      next: null
    };
    var l = {};
    return e.next = {
      memoizedState: l,
      baseState: l,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: al,
        lastRenderedState: l
      },
      next: null
    }, t.memoizedState = e, t = t.alternate, t !== null && (t.memoizedState = e), e;
  }
  function mo(t) {
    var e = ho(t);
    e.next === null && (e = t.alternate.memoizedState), xn(
      t,
      e.next.queue,
      {},
      ge()
    );
  }
  function Vc() {
    return Kt(qn);
  }
  function vo() {
    return Ht().memoizedState;
  }
  function yo() {
    return Ht().memoizedState;
  }
  function Tv(t) {
    for (var e = t.return; e !== null; ) {
      switch (e.tag) {
        case 24:
        case 3:
          var l = ge();
          t = Tl(l);
          var a = jl(e, t, l);
          a !== null && (se(a, e, l), yn(a, e, l)), e = { cache: Sc() }, t.payload = e;
          return;
      }
      e = e.return;
    }
  }
  function jv(t, e, l) {
    var a = ge();
    l = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Uu(t) ? go(e, l) : (l = fc(t, e, l, a), l !== null && (se(l, t, a), bo(l, e, a)));
  }
  function po(t, e, l) {
    var a = ge();
    xn(t, e, l, a);
  }
  function xn(t, e, l, a) {
    var n = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (Uu(t)) go(e, n);
    else {
      var u = t.alternate;
      if (t.lanes === 0 && (u === null || u.lanes === 0) && (u = e.lastRenderedReducer, u !== null))
        try {
          var c = e.lastRenderedState, o = u(c, l);
          if (n.hasEagerState = !0, n.eagerState = o, de(o, c))
            return mu(t, e, n, 0), _t === null && hu(), !1;
        } catch {
        } finally {
        }
      if (l = fc(t, e, n, a), l !== null)
        return se(l, t, a), bo(l, e, a), !0;
    }
    return !1;
  }
  function Kc(t, e, l, a) {
    if (a = {
      lane: 2,
      revertLane: Ts(),
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Uu(t)) {
      if (e) throw Error(s(479));
    } else
      e = fc(
        t,
        l,
        a,
        2
      ), e !== null && se(e, t, 2);
  }
  function Uu(t) {
    var e = t.alternate;
    return t === tt || e !== null && e === tt;
  }
  function go(t, e) {
    Ma = Au = !0;
    var l = t.pending;
    l === null ? e.next = e : (e.next = l.next, l.next = e), t.pending = e;
  }
  function bo(t, e, l) {
    if ((l & 4194048) !== 0) {
      var a = e.lanes;
      a &= t.pendingLanes, l |= a, e.lanes = l, Ef(t, l);
    }
  }
  var _n = {
    readContext: Kt,
    use: Ou,
    useCallback: Rt,
    useContext: Rt,
    useEffect: Rt,
    useImperativeHandle: Rt,
    useLayoutEffect: Rt,
    useInsertionEffect: Rt,
    useMemo: Rt,
    useReducer: Rt,
    useRef: Rt,
    useState: Rt,
    useDebugValue: Rt,
    useDeferredValue: Rt,
    useTransition: Rt,
    useSyncExternalStore: Rt,
    useId: Rt,
    useHostTransitionStatus: Rt,
    useFormState: Rt,
    useActionState: Rt,
    useOptimistic: Rt,
    useMemoCache: Rt,
    useCacheRefresh: Rt
  };
  _n.useEffectEvent = Rt;
  var So = {
    readContext: Kt,
    use: Ou,
    useCallback: function(t, e) {
      return ee().memoizedState = [
        t,
        e === void 0 ? null : e
      ], t;
    },
    useContext: Kt,
    useEffect: lo,
    useImperativeHandle: function(t, e, l) {
      l = l != null ? l.concat([t]) : null, Cu(
        4194308,
        4,
        io.bind(null, e, t),
        l
      );
    },
    useLayoutEffect: function(t, e) {
      return Cu(4194308, 4, t, e);
    },
    useInsertionEffect: function(t, e) {
      Cu(4, 2, t, e);
    },
    useMemo: function(t, e) {
      var l = ee();
      e = e === void 0 ? null : e;
      var a = t();
      if (la) {
        yl(!0);
        try {
          t();
        } finally {
          yl(!1);
        }
      }
      return l.memoizedState = [a, e], a;
    },
    useReducer: function(t, e, l) {
      var a = ee();
      if (l !== void 0) {
        var n = l(e);
        if (la) {
          yl(!0);
          try {
            l(e);
          } finally {
            yl(!1);
          }
        }
      } else n = e;
      return a.memoizedState = a.baseState = n, t = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: t,
        lastRenderedState: n
      }, a.queue = t, t = t.dispatch = jv.bind(
        null,
        tt,
        t
      ), [a.memoizedState, t];
    },
    useRef: function(t) {
      var e = ee();
      return t = { current: t }, e.memoizedState = t;
    },
    useState: function(t) {
      t = Yc(t);
      var e = t.queue, l = po.bind(null, tt, e);
      return e.dispatch = l, [t.memoizedState, l];
    },
    useDebugValue: Xc,
    useDeferredValue: function(t, e) {
      var l = ee();
      return Qc(l, t, e);
    },
    useTransition: function() {
      var t = Yc(!1);
      return t = oo.bind(
        null,
        tt,
        t.queue,
        !0,
        !1
      ), ee().memoizedState = t, [!1, t];
    },
    useSyncExternalStore: function(t, e, l) {
      var a = tt, n = ee();
      if (ft) {
        if (l === void 0)
          throw Error(s(407));
        l = l();
      } else {
        if (l = e(), _t === null)
          throw Error(s(349));
        (ct & 127) !== 0 || wr(a, e, l);
      }
      n.memoizedState = l;
      var u = { value: l, getSnapshot: e };
      return n.queue = u, lo(Xr.bind(null, a, u, t), [
        t
      ]), a.flags |= 2048, Da(
        9,
        { destroy: void 0 },
        Gr.bind(
          null,
          a,
          u,
          l,
          e
        ),
        null
      ), l;
    },
    useId: function() {
      var t = ee(), e = _t.identifierPrefix;
      if (ft) {
        var l = Ze, a = Qe;
        l = (a & ~(1 << 32 - oe(a) - 1)).toString(32) + l, e = "_" + e + "R_" + l, l = Ru++, 0 < l && (e += "H" + l.toString(32)), e += "_";
      } else
        l = gv++, e = "_" + e + "r_" + l.toString(32) + "_";
      return t.memoizedState = e;
    },
    useHostTransitionStatus: Vc,
    useFormState: Fr,
    useActionState: Fr,
    useOptimistic: function(t) {
      var e = ee();
      e.memoizedState = e.baseState = t;
      var l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return e.queue = l, e = Kc.bind(
        null,
        tt,
        !0,
        l
      ), l.dispatch = e, [t, e];
    },
    useMemoCache: Bc,
    useCacheRefresh: function() {
      return ee().memoizedState = Tv.bind(
        null,
        tt
      );
    },
    useEffectEvent: function(t) {
      var e = ee(), l = { impl: t };
      return e.memoizedState = l, function() {
        if ((dt & 2) !== 0)
          throw Error(s(440));
        return l.impl.apply(void 0, arguments);
      };
    }
  }, Jc = {
    readContext: Kt,
    use: Ou,
    useCallback: so,
    useContext: Kt,
    useEffect: Gc,
    useImperativeHandle: co,
    useInsertionEffect: no,
    useLayoutEffect: uo,
    useMemo: fo,
    useReducer: Mu,
    useRef: eo,
    useState: function() {
      return Mu(al);
    },
    useDebugValue: Xc,
    useDeferredValue: function(t, e) {
      var l = Ht();
      return ro(
        l,
        pt.memoizedState,
        t,
        e
      );
    },
    useTransition: function() {
      var t = Mu(al)[0], e = Ht().memoizedState;
      return [
        typeof t == "boolean" ? t : Sn(t),
        e
      ];
    },
    useSyncExternalStore: Yr,
    useId: vo,
    useHostTransitionStatus: Vc,
    useFormState: Pr,
    useActionState: Pr,
    useOptimistic: function(t, e) {
      var l = Ht();
      return Vr(l, pt, t, e);
    },
    useMemoCache: Bc,
    useCacheRefresh: yo
  };
  Jc.useEffectEvent = ao;
  var xo = {
    readContext: Kt,
    use: Ou,
    useCallback: so,
    useContext: Kt,
    useEffect: Gc,
    useImperativeHandle: co,
    useInsertionEffect: no,
    useLayoutEffect: uo,
    useMemo: fo,
    useReducer: qc,
    useRef: eo,
    useState: function() {
      return qc(al);
    },
    useDebugValue: Xc,
    useDeferredValue: function(t, e) {
      var l = Ht();
      return pt === null ? Qc(l, t, e) : ro(
        l,
        pt.memoizedState,
        t,
        e
      );
    },
    useTransition: function() {
      var t = qc(al)[0], e = Ht().memoizedState;
      return [
        typeof t == "boolean" ? t : Sn(t),
        e
      ];
    },
    useSyncExternalStore: Yr,
    useId: vo,
    useHostTransitionStatus: Vc,
    useFormState: to,
    useActionState: to,
    useOptimistic: function(t, e) {
      var l = Ht();
      return pt !== null ? Vr(l, pt, t, e) : (l.baseState = t, [t, l.queue.dispatch]);
    },
    useMemoCache: Bc,
    useCacheRefresh: yo
  };
  xo.useEffectEvent = ao;
  function kc(t, e, l, a) {
    e = t.memoizedState, l = l(a, e), l = l == null ? e : E({}, e, l), t.memoizedState = l, t.lanes === 0 && (t.updateQueue.baseState = l);
  }
  var $c = {
    enqueueSetState: function(t, e, l) {
      t = t._reactInternals;
      var a = ge(), n = Tl(a);
      n.payload = e, l != null && (n.callback = l), e = jl(t, n, a), e !== null && (se(e, t, a), yn(e, t, a));
    },
    enqueueReplaceState: function(t, e, l) {
      t = t._reactInternals;
      var a = ge(), n = Tl(a);
      n.tag = 1, n.payload = e, l != null && (n.callback = l), e = jl(t, n, a), e !== null && (se(e, t, a), yn(e, t, a));
    },
    enqueueForceUpdate: function(t, e) {
      t = t._reactInternals;
      var l = ge(), a = Tl(l);
      a.tag = 2, e != null && (a.callback = e), e = jl(t, a, l), e !== null && (se(e, t, l), yn(e, t, l));
    }
  };
  function _o(t, e, l, a, n, u, c) {
    return t = t.stateNode, typeof t.shouldComponentUpdate == "function" ? t.shouldComponentUpdate(a, u, c) : e.prototype && e.prototype.isPureReactComponent ? !sn(l, a) || !sn(n, u) : !0;
  }
  function Eo(t, e, l, a) {
    t = e.state, typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps(l, a), typeof e.UNSAFE_componentWillReceiveProps == "function" && e.UNSAFE_componentWillReceiveProps(l, a), e.state !== t && $c.enqueueReplaceState(e, e.state, null);
  }
  function aa(t, e) {
    var l = e;
    if ("ref" in e) {
      l = {};
      for (var a in e)
        a !== "ref" && (l[a] = e[a]);
    }
    if (t = t.defaultProps) {
      l === e && (l = E({}, l));
      for (var n in t)
        l[n] === void 0 && (l[n] = t[n]);
    }
    return l;
  }
  function To(t) {
    du(t);
  }
  function jo(t) {
    console.error(t);
  }
  function zo(t) {
    du(t);
  }
  function Hu(t, e) {
    try {
      var l = t.onUncaughtError;
      l(e.value, { componentStack: e.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function Ao(t, e, l) {
    try {
      var a = t.onCaughtError;
      a(l.value, {
        componentStack: l.stack,
        errorBoundary: e.tag === 1 ? e.stateNode : null
      });
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  function Wc(t, e, l) {
    return l = Tl(l), l.tag = 3, l.payload = { element: null }, l.callback = function() {
      Hu(t, e);
    }, l;
  }
  function Ro(t) {
    return t = Tl(t), t.tag = 3, t;
  }
  function No(t, e, l, a) {
    var n = l.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var u = a.value;
      t.payload = function() {
        return n(u);
      }, t.callback = function() {
        Ao(e, l, a);
      };
    }
    var c = l.stateNode;
    c !== null && typeof c.componentDidCatch == "function" && (t.callback = function() {
      Ao(e, l, a), typeof n != "function" && (Ml === null ? Ml = /* @__PURE__ */ new Set([this]) : Ml.add(this));
      var o = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: o !== null ? o : ""
      });
    });
  }
  function zv(t, e, l, a, n) {
    if (l.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (e = l.alternate, e !== null && ja(
        e,
        l,
        n,
        !0
      ), l = me.current, l !== null) {
        switch (l.tag) {
          case 31:
          case 13:
            return Ne === null ? Ju() : l.alternate === null && Nt === 0 && (Nt = 3), l.flags &= -257, l.flags |= 65536, l.lanes = n, a === _u ? l.flags |= 16384 : (e = l.updateQueue, e === null ? l.updateQueue = /* @__PURE__ */ new Set([a]) : e.add(a), xs(t, a, n)), !1;
          case 22:
            return l.flags |= 65536, a === _u ? l.flags |= 16384 : (e = l.updateQueue, e === null ? (e = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, l.updateQueue = e) : (l = e.retryQueue, l === null ? e.retryQueue = /* @__PURE__ */ new Set([a]) : l.add(a)), xs(t, a, n)), !1;
        }
        throw Error(s(435, l.tag));
      }
      return xs(t, a, n), Ju(), !1;
    }
    if (ft)
      return e = me.current, e !== null ? ((e.flags & 65536) === 0 && (e.flags |= 256), e.flags |= 65536, e.lanes = n, a !== vc && (t = Error(s(422), { cause: a }), on(je(t, l)))) : (a !== vc && (e = Error(s(423), {
        cause: a
      }), on(
        je(e, l)
      )), t = t.current.alternate, t.flags |= 65536, n &= -n, t.lanes |= n, a = je(a, l), n = Wc(
        t.stateNode,
        a,
        n
      ), zc(t, n), Nt !== 4 && (Nt = 2)), !1;
    var u = Error(s(520), { cause: a });
    if (u = je(u, l), On === null ? On = [u] : On.push(u), Nt !== 4 && (Nt = 2), e === null) return !0;
    a = je(a, l), l = e;
    do {
      switch (l.tag) {
        case 3:
          return l.flags |= 65536, t = n & -n, l.lanes |= t, t = Wc(l.stateNode, a, t), zc(l, t), !1;
        case 1:
          if (e = l.type, u = l.stateNode, (l.flags & 128) === 0 && (typeof e.getDerivedStateFromError == "function" || u !== null && typeof u.componentDidCatch == "function" && (Ml === null || !Ml.has(u))))
            return l.flags |= 65536, n &= -n, l.lanes |= n, n = Ro(n), No(
              n,
              t,
              l,
              a
            ), zc(l, n), !1;
      }
      l = l.return;
    } while (l !== null);
    return !1;
  }
  var Fc = Error(s(461)), Yt = !1;
  function Jt(t, e, l, a) {
    e.child = t === null ? Cr(e, null, l, a) : ea(
      e,
      t.child,
      l,
      a
    );
  }
  function Oo(t, e, l, a, n) {
    l = l.render;
    var u = e.ref;
    if ("ref" in a) {
      var c = {};
      for (var o in a)
        o !== "ref" && (c[o] = a[o]);
    } else c = a;
    return Fl(e), a = Cc(
      t,
      e,
      l,
      c,
      u,
      n
    ), o = Dc(), t !== null && !Yt ? (Uc(t, e, n), nl(t, e, n)) : (ft && o && hc(e), e.flags |= 1, Jt(t, e, a, n), e.child);
  }
  function Mo(t, e, l, a, n) {
    if (t === null) {
      var u = l.type;
      return typeof u == "function" && !rc(u) && u.defaultProps === void 0 && l.compare === null ? (e.tag = 15, e.type = u, Co(
        t,
        e,
        u,
        a,
        n
      )) : (t = yu(
        l.type,
        null,
        a,
        e,
        e.mode,
        n
      ), t.ref = e.ref, t.return = e, e.child = t);
    }
    if (u = t.child, !us(t, n)) {
      var c = u.memoizedProps;
      if (l = l.compare, l = l !== null ? l : sn, l(c, a) && t.ref === e.ref)
        return nl(t, e, n);
    }
    return e.flags |= 1, t = Pe(u, a), t.ref = e.ref, t.return = e, e.child = t;
  }
  function Co(t, e, l, a, n) {
    if (t !== null) {
      var u = t.memoizedProps;
      if (sn(u, a) && t.ref === e.ref)
        if (Yt = !1, e.pendingProps = a = u, us(t, n))
          (t.flags & 131072) !== 0 && (Yt = !0);
        else
          return e.lanes = t.lanes, nl(t, e, n);
    }
    return Pc(
      t,
      e,
      l,
      a,
      n
    );
  }
  function Do(t, e, l, a) {
    var n = a.children, u = t !== null ? t.memoizedState : null;
    if (t === null && e.stateNode === null && (e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), a.mode === "hidden") {
      if ((e.flags & 128) !== 0) {
        if (u = u !== null ? u.baseLanes | l : l, t !== null) {
          for (a = e.child = t.child, n = 0; a !== null; )
            n = n | a.lanes | a.childLanes, a = a.sibling;
          a = n & ~u;
        } else a = 0, e.child = null;
        return Uo(
          t,
          e,
          u,
          l,
          a
        );
      }
      if ((l & 536870912) !== 0)
        e.memoizedState = { baseLanes: 0, cachePool: null }, t !== null && Su(
          e,
          u !== null ? u.cachePool : null
        ), u !== null ? Hr(e, u) : Rc(), Br(e);
      else
        return a = e.lanes = 536870912, Uo(
          t,
          e,
          u !== null ? u.baseLanes | l : l,
          l,
          a
        );
    } else
      u !== null ? (Su(e, u.cachePool), Hr(e, u), Al(), e.memoizedState = null) : (t !== null && Su(e, null), Rc(), Al());
    return Jt(t, e, n, l), e.child;
  }
  function En(t, e) {
    return t !== null && t.tag === 22 || e.stateNode !== null || (e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), e.sibling;
  }
  function Uo(t, e, l, a, n) {
    var u = _c();
    return u = u === null ? null : { parent: Lt._currentValue, pool: u }, e.memoizedState = {
      baseLanes: l,
      cachePool: u
    }, t !== null && Su(e, null), Rc(), Br(e), t !== null && ja(t, e, a, !0), e.childLanes = n, null;
  }
  function Bu(t, e) {
    return e = qu(
      { mode: e.mode, children: e.children },
      t.mode
    ), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function Ho(t, e, l) {
    return ea(e, t.child, null, l), t = Bu(e, e.pendingProps), t.flags |= 2, ve(e), e.memoizedState = null, t;
  }
  function Av(t, e, l) {
    var a = e.pendingProps, n = (e.flags & 128) !== 0;
    if (e.flags &= -129, t === null) {
      if (ft) {
        if (a.mode === "hidden")
          return t = Bu(e, a), e.lanes = 536870912, En(null, t);
        if (Oc(e), (t = Et) ? (t = Jd(
          t,
          Re
        ), t = t !== null && t.data === "&" ? t : null, t !== null && (e.memoizedState = {
          dehydrated: t,
          treeContext: bl !== null ? { id: Qe, overflow: Ze } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, l = pr(t), l.return = e, e.child = l, Vt = e, Et = null)) : t = null, t === null) throw xl(e);
        return e.lanes = 536870912, null;
      }
      return Bu(e, a);
    }
    var u = t.memoizedState;
    if (u !== null) {
      var c = u.dehydrated;
      if (Oc(e), n)
        if (e.flags & 256)
          e.flags &= -257, e = Ho(
            t,
            e,
            l
          );
        else if (e.memoizedState !== null)
          e.child = t.child, e.flags |= 128, e = null;
        else throw Error(s(558));
      else if (Yt || ja(t, e, l, !1), n = (l & t.childLanes) !== 0, Yt || n) {
        if (a = _t, a !== null && (c = Tf(a, l), c !== 0 && c !== u.retryLane))
          throw u.retryLane = c, Jl(t, c), se(a, t, c), Fc;
        Ju(), e = Ho(
          t,
          e,
          l
        );
      } else
        t = u.treeContext, Et = Oe(c.nextSibling), Vt = e, ft = !0, Sl = null, Re = !1, t !== null && Sr(e, t), e = Bu(e, a), e.flags |= 4096;
      return e;
    }
    return t = Pe(t.child, {
      mode: a.mode,
      children: a.children
    }), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function Lu(t, e) {
    var l = e.ref;
    if (l === null)
      t !== null && t.ref !== null && (e.flags |= 4194816);
    else {
      if (typeof l != "function" && typeof l != "object")
        throw Error(s(284));
      (t === null || t.ref !== l) && (e.flags |= 4194816);
    }
  }
  function Pc(t, e, l, a, n) {
    return Fl(e), l = Cc(
      t,
      e,
      l,
      a,
      void 0,
      n
    ), a = Dc(), t !== null && !Yt ? (Uc(t, e, n), nl(t, e, n)) : (ft && a && hc(e), e.flags |= 1, Jt(t, e, l, n), e.child);
  }
  function Bo(t, e, l, a, n, u) {
    return Fl(e), e.updateQueue = null, l = qr(
      e,
      a,
      l,
      n
    ), Lr(t), a = Dc(), t !== null && !Yt ? (Uc(t, e, u), nl(t, e, u)) : (ft && a && hc(e), e.flags |= 1, Jt(t, e, l, u), e.child);
  }
  function Lo(t, e, l, a, n) {
    if (Fl(e), e.stateNode === null) {
      var u = xa, c = l.contextType;
      typeof c == "object" && c !== null && (u = Kt(c)), u = new l(a, u), e.memoizedState = u.state !== null && u.state !== void 0 ? u.state : null, u.updater = $c, e.stateNode = u, u._reactInternals = e, u = e.stateNode, u.props = a, u.state = e.memoizedState, u.refs = {}, Tc(e), c = l.contextType, u.context = typeof c == "object" && c !== null ? Kt(c) : xa, u.state = e.memoizedState, c = l.getDerivedStateFromProps, typeof c == "function" && (kc(
        e,
        l,
        c,
        a
      ), u.state = e.memoizedState), typeof l.getDerivedStateFromProps == "function" || typeof u.getSnapshotBeforeUpdate == "function" || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (c = u.state, typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount(), c !== u.state && $c.enqueueReplaceState(u, u.state, null), gn(e, a, u, n), pn(), u.state = e.memoizedState), typeof u.componentDidMount == "function" && (e.flags |= 4194308), a = !0;
    } else if (t === null) {
      u = e.stateNode;
      var o = e.memoizedProps, y = aa(l, o);
      u.props = y;
      var j = u.context, M = l.contextType;
      c = xa, typeof M == "object" && M !== null && (c = Kt(M));
      var U = l.getDerivedStateFromProps;
      M = typeof U == "function" || typeof u.getSnapshotBeforeUpdate == "function", o = e.pendingProps !== o, M || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (o || j !== c) && Eo(
        e,
        u,
        a,
        c
      ), El = !1;
      var R = e.memoizedState;
      u.state = R, gn(e, a, u, n), pn(), j = e.memoizedState, o || R !== j || El ? (typeof U == "function" && (kc(
        e,
        l,
        U,
        a
      ), j = e.memoizedState), (y = El || _o(
        e,
        l,
        y,
        a,
        R,
        j,
        c
      )) ? (M || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function" && (e.flags |= 4194308)) : (typeof u.componentDidMount == "function" && (e.flags |= 4194308), e.memoizedProps = a, e.memoizedState = j), u.props = a, u.state = j, u.context = c, a = y) : (typeof u.componentDidMount == "function" && (e.flags |= 4194308), a = !1);
    } else {
      u = e.stateNode, jc(t, e), c = e.memoizedProps, M = aa(l, c), u.props = M, U = e.pendingProps, R = u.context, j = l.contextType, y = xa, typeof j == "object" && j !== null && (y = Kt(j)), o = l.getDerivedStateFromProps, (j = typeof o == "function" || typeof u.getSnapshotBeforeUpdate == "function") || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (c !== U || R !== y) && Eo(
        e,
        u,
        a,
        y
      ), El = !1, R = e.memoizedState, u.state = R, gn(e, a, u, n), pn();
      var O = e.memoizedState;
      c !== U || R !== O || El || t !== null && t.dependencies !== null && gu(t.dependencies) ? (typeof o == "function" && (kc(
        e,
        l,
        o,
        a
      ), O = e.memoizedState), (M = El || _o(
        e,
        l,
        M,
        a,
        R,
        O,
        y
      ) || t !== null && t.dependencies !== null && gu(t.dependencies)) ? (j || typeof u.UNSAFE_componentWillUpdate != "function" && typeof u.componentWillUpdate != "function" || (typeof u.componentWillUpdate == "function" && u.componentWillUpdate(a, O, y), typeof u.UNSAFE_componentWillUpdate == "function" && u.UNSAFE_componentWillUpdate(
        a,
        O,
        y
      )), typeof u.componentDidUpdate == "function" && (e.flags |= 4), typeof u.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024)) : (typeof u.componentDidUpdate != "function" || c === t.memoizedProps && R === t.memoizedState || (e.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || c === t.memoizedProps && R === t.memoizedState || (e.flags |= 1024), e.memoizedProps = a, e.memoizedState = O), u.props = a, u.state = O, u.context = y, a = M) : (typeof u.componentDidUpdate != "function" || c === t.memoizedProps && R === t.memoizedState || (e.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || c === t.memoizedProps && R === t.memoizedState || (e.flags |= 1024), a = !1);
    }
    return u = a, Lu(t, e), a = (e.flags & 128) !== 0, u || a ? (u = e.stateNode, l = a && typeof l.getDerivedStateFromError != "function" ? null : u.render(), e.flags |= 1, t !== null && a ? (e.child = ea(
      e,
      t.child,
      null,
      n
    ), e.child = ea(
      e,
      null,
      l,
      n
    )) : Jt(t, e, l, n), e.memoizedState = u.state, t = e.child) : t = nl(
      t,
      e,
      n
    ), t;
  }
  function qo(t, e, l, a) {
    return $l(), e.flags |= 256, Jt(t, e, l, a), e.child;
  }
  var Ic = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function ts(t) {
    return { baseLanes: t, cachePool: zr() };
  }
  function es(t, e, l) {
    return t = t !== null ? t.childLanes & ~l : 0, e && (t |= pe), t;
  }
  function Yo(t, e, l) {
    var a = e.pendingProps, n = !1, u = (e.flags & 128) !== 0, c;
    if ((c = u) || (c = t !== null && t.memoizedState === null ? !1 : (Ut.current & 2) !== 0), c && (n = !0, e.flags &= -129), c = (e.flags & 32) !== 0, e.flags &= -33, t === null) {
      if (ft) {
        if (n ? zl(e) : Al(), (t = Et) ? (t = Jd(
          t,
          Re
        ), t = t !== null && t.data !== "&" ? t : null, t !== null && (e.memoizedState = {
          dehydrated: t,
          treeContext: bl !== null ? { id: Qe, overflow: Ze } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, l = pr(t), l.return = e, e.child = l, Vt = e, Et = null)) : t = null, t === null) throw xl(e);
        return Ls(t) ? e.lanes = 32 : e.lanes = 536870912, null;
      }
      var o = a.children;
      return a = a.fallback, n ? (Al(), n = e.mode, o = qu(
        { mode: "hidden", children: o },
        n
      ), a = kl(
        a,
        n,
        l,
        null
      ), o.return = e, a.return = e, o.sibling = a, e.child = o, a = e.child, a.memoizedState = ts(l), a.childLanes = es(
        t,
        c,
        l
      ), e.memoizedState = Ic, En(null, a)) : (zl(e), ls(e, o));
    }
    var y = t.memoizedState;
    if (y !== null && (o = y.dehydrated, o !== null)) {
      if (u)
        e.flags & 256 ? (zl(e), e.flags &= -257, e = as(
          t,
          e,
          l
        )) : e.memoizedState !== null ? (Al(), e.child = t.child, e.flags |= 128, e = null) : (Al(), o = a.fallback, n = e.mode, a = qu(
          { mode: "visible", children: a.children },
          n
        ), o = kl(
          o,
          n,
          l,
          null
        ), o.flags |= 2, a.return = e, o.return = e, a.sibling = o, e.child = a, ea(
          e,
          t.child,
          null,
          l
        ), a = e.child, a.memoizedState = ts(l), a.childLanes = es(
          t,
          c,
          l
        ), e.memoizedState = Ic, e = En(null, a));
      else if (zl(e), Ls(o)) {
        if (c = o.nextSibling && o.nextSibling.dataset, c) var j = c.dgst;
        c = j, a = Error(s(419)), a.stack = "", a.digest = c, on({ value: a, source: null, stack: null }), e = as(
          t,
          e,
          l
        );
      } else if (Yt || ja(t, e, l, !1), c = (l & t.childLanes) !== 0, Yt || c) {
        if (c = _t, c !== null && (a = Tf(c, l), a !== 0 && a !== y.retryLane))
          throw y.retryLane = a, Jl(t, a), se(c, t, a), Fc;
        Bs(o) || Ju(), e = as(
          t,
          e,
          l
        );
      } else
        Bs(o) ? (e.flags |= 192, e.child = t.child, e = null) : (t = y.treeContext, Et = Oe(
          o.nextSibling
        ), Vt = e, ft = !0, Sl = null, Re = !1, t !== null && Sr(e, t), e = ls(
          e,
          a.children
        ), e.flags |= 4096);
      return e;
    }
    return n ? (Al(), o = a.fallback, n = e.mode, y = t.child, j = y.sibling, a = Pe(y, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = y.subtreeFlags & 65011712, j !== null ? o = Pe(
      j,
      o
    ) : (o = kl(
      o,
      n,
      l,
      null
    ), o.flags |= 2), o.return = e, a.return = e, a.sibling = o, e.child = a, En(null, a), a = e.child, o = t.child.memoizedState, o === null ? o = ts(l) : (n = o.cachePool, n !== null ? (y = Lt._currentValue, n = n.parent !== y ? { parent: y, pool: y } : n) : n = zr(), o = {
      baseLanes: o.baseLanes | l,
      cachePool: n
    }), a.memoizedState = o, a.childLanes = es(
      t,
      c,
      l
    ), e.memoizedState = Ic, En(t.child, a)) : (zl(e), l = t.child, t = l.sibling, l = Pe(l, {
      mode: "visible",
      children: a.children
    }), l.return = e, l.sibling = null, t !== null && (c = e.deletions, c === null ? (e.deletions = [t], e.flags |= 16) : c.push(t)), e.child = l, e.memoizedState = null, l);
  }
  function ls(t, e) {
    return e = qu(
      { mode: "visible", children: e },
      t.mode
    ), e.return = t, t.child = e;
  }
  function qu(t, e) {
    return t = he(22, t, null, e), t.lanes = 0, t;
  }
  function as(t, e, l) {
    return ea(e, t.child, null, l), t = ls(
      e,
      e.pendingProps.children
    ), t.flags |= 2, e.memoizedState = null, t;
  }
  function wo(t, e, l) {
    t.lanes |= e;
    var a = t.alternate;
    a !== null && (a.lanes |= e), gc(t.return, e, l);
  }
  function ns(t, e, l, a, n, u) {
    var c = t.memoizedState;
    c === null ? t.memoizedState = {
      isBackwards: e,
      rendering: null,
      renderingStartTime: 0,
      last: a,
      tail: l,
      tailMode: n,
      treeForkCount: u
    } : (c.isBackwards = e, c.rendering = null, c.renderingStartTime = 0, c.last = a, c.tail = l, c.tailMode = n, c.treeForkCount = u);
  }
  function Go(t, e, l) {
    var a = e.pendingProps, n = a.revealOrder, u = a.tail;
    a = a.children;
    var c = Ut.current, o = (c & 2) !== 0;
    if (o ? (c = c & 1 | 2, e.flags |= 128) : c &= 1, G(Ut, c), Jt(t, e, a, l), a = ft ? rn : 0, !o && t !== null && (t.flags & 128) !== 0)
      t: for (t = e.child; t !== null; ) {
        if (t.tag === 13)
          t.memoizedState !== null && wo(t, l, e);
        else if (t.tag === 19)
          wo(t, l, e);
        else if (t.child !== null) {
          t.child.return = t, t = t.child;
          continue;
        }
        if (t === e) break t;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            break t;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    switch (n) {
      case "forwards":
        for (l = e.child, n = null; l !== null; )
          t = l.alternate, t !== null && zu(t) === null && (n = l), l = l.sibling;
        l = n, l === null ? (n = e.child, e.child = null) : (n = l.sibling, l.sibling = null), ns(
          e,
          !1,
          n,
          l,
          u,
          a
        );
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (l = null, n = e.child, e.child = null; n !== null; ) {
          if (t = n.alternate, t !== null && zu(t) === null) {
            e.child = n;
            break;
          }
          t = n.sibling, n.sibling = l, l = n, n = t;
        }
        ns(
          e,
          !0,
          l,
          null,
          u,
          a
        );
        break;
      case "together":
        ns(
          e,
          !1,
          null,
          null,
          void 0,
          a
        );
        break;
      default:
        e.memoizedState = null;
    }
    return e.child;
  }
  function nl(t, e, l) {
    if (t !== null && (e.dependencies = t.dependencies), Ol |= e.lanes, (l & e.childLanes) === 0)
      if (t !== null) {
        if (ja(
          t,
          e,
          l,
          !1
        ), (l & e.childLanes) === 0)
          return null;
      } else return null;
    if (t !== null && e.child !== t.child)
      throw Error(s(153));
    if (e.child !== null) {
      for (t = e.child, l = Pe(t, t.pendingProps), e.child = l, l.return = e; t.sibling !== null; )
        t = t.sibling, l = l.sibling = Pe(t, t.pendingProps), l.return = e;
      l.sibling = null;
    }
    return e.child;
  }
  function us(t, e) {
    return (t.lanes & e) !== 0 ? !0 : (t = t.dependencies, !!(t !== null && gu(t)));
  }
  function Rv(t, e, l) {
    switch (e.tag) {
      case 3:
        te(e, e.stateNode.containerInfo), _l(e, Lt, t.memoizedState.cache), $l();
        break;
      case 27:
      case 5:
        ka(e);
        break;
      case 4:
        te(e, e.stateNode.containerInfo);
        break;
      case 10:
        _l(
          e,
          e.type,
          e.memoizedProps.value
        );
        break;
      case 31:
        if (e.memoizedState !== null)
          return e.flags |= 128, Oc(e), null;
        break;
      case 13:
        var a = e.memoizedState;
        if (a !== null)
          return a.dehydrated !== null ? (zl(e), e.flags |= 128, null) : (l & e.child.childLanes) !== 0 ? Yo(t, e, l) : (zl(e), t = nl(
            t,
            e,
            l
          ), t !== null ? t.sibling : null);
        zl(e);
        break;
      case 19:
        var n = (t.flags & 128) !== 0;
        if (a = (l & e.childLanes) !== 0, a || (ja(
          t,
          e,
          l,
          !1
        ), a = (l & e.childLanes) !== 0), n) {
          if (a)
            return Go(
              t,
              e,
              l
            );
          e.flags |= 128;
        }
        if (n = e.memoizedState, n !== null && (n.rendering = null, n.tail = null, n.lastEffect = null), G(Ut, Ut.current), a) break;
        return null;
      case 22:
        return e.lanes = 0, Do(
          t,
          e,
          l,
          e.pendingProps
        );
      case 24:
        _l(e, Lt, t.memoizedState.cache);
    }
    return nl(t, e, l);
  }
  function Xo(t, e, l) {
    if (t !== null)
      if (t.memoizedProps !== e.pendingProps)
        Yt = !0;
      else {
        if (!us(t, l) && (e.flags & 128) === 0)
          return Yt = !1, Rv(
            t,
            e,
            l
          );
        Yt = (t.flags & 131072) !== 0;
      }
    else
      Yt = !1, ft && (e.flags & 1048576) !== 0 && br(e, rn, e.index);
    switch (e.lanes = 0, e.tag) {
      case 16:
        t: {
          var a = e.pendingProps;
          if (t = Il(e.elementType), e.type = t, typeof t == "function")
            rc(t) ? (a = aa(t, a), e.tag = 1, e = Lo(
              null,
              e,
              t,
              a,
              l
            )) : (e.tag = 0, e = Pc(
              null,
              e,
              t,
              a,
              l
            ));
          else {
            if (t != null) {
              var n = t.$$typeof;
              if (n === lt) {
                e.tag = 11, e = Oo(
                  null,
                  e,
                  t,
                  a,
                  l
                );
                break t;
              } else if (n === F) {
                e.tag = 14, e = Mo(
                  null,
                  e,
                  t,
                  a,
                  l
                );
                break t;
              }
            }
            throw e = xe(t) || t, Error(s(306, e, ""));
          }
        }
        return e;
      case 0:
        return Pc(
          t,
          e,
          e.type,
          e.pendingProps,
          l
        );
      case 1:
        return a = e.type, n = aa(
          a,
          e.pendingProps
        ), Lo(
          t,
          e,
          a,
          n,
          l
        );
      case 3:
        t: {
          if (te(
            e,
            e.stateNode.containerInfo
          ), t === null) throw Error(s(387));
          a = e.pendingProps;
          var u = e.memoizedState;
          n = u.element, jc(t, e), gn(e, a, null, l);
          var c = e.memoizedState;
          if (a = c.cache, _l(e, Lt, a), a !== u.cache && bc(
            e,
            [Lt],
            l,
            !0
          ), pn(), a = c.element, u.isDehydrated)
            if (u = {
              element: a,
              isDehydrated: !1,
              cache: c.cache
            }, e.updateQueue.baseState = u, e.memoizedState = u, e.flags & 256) {
              e = qo(
                t,
                e,
                a,
                l
              );
              break t;
            } else if (a !== n) {
              n = je(
                Error(s(424)),
                e
              ), on(n), e = qo(
                t,
                e,
                a,
                l
              );
              break t;
            } else {
              switch (t = e.stateNode.containerInfo, t.nodeType) {
                case 9:
                  t = t.body;
                  break;
                default:
                  t = t.nodeName === "HTML" ? t.ownerDocument.body : t;
              }
              for (Et = Oe(t.firstChild), Vt = e, ft = !0, Sl = null, Re = !0, l = Cr(
                e,
                null,
                a,
                l
              ), e.child = l; l; )
                l.flags = l.flags & -3 | 4096, l = l.sibling;
            }
          else {
            if ($l(), a === n) {
              e = nl(
                t,
                e,
                l
              );
              break t;
            }
            Jt(t, e, a, l);
          }
          e = e.child;
        }
        return e;
      case 26:
        return Lu(t, e), t === null ? (l = Id(
          e.type,
          null,
          e.pendingProps,
          null
        )) ? e.memoizedState = l : ft || (l = e.type, t = e.pendingProps, a = ti(
          at.current
        ).createElement(l), a[Zt] = e, a[le] = t, kt(a, l, t), Xt(a), e.stateNode = a) : e.memoizedState = Id(
          e.type,
          t.memoizedProps,
          e.pendingProps,
          t.memoizedState
        ), null;
      case 27:
        return ka(e), t === null && ft && (a = e.stateNode = Wd(
          e.type,
          e.pendingProps,
          at.current
        ), Vt = e, Re = !0, n = Et, Hl(e.type) ? (qs = n, Et = Oe(a.firstChild)) : Et = n), Jt(
          t,
          e,
          e.pendingProps.children,
          l
        ), Lu(t, e), t === null && (e.flags |= 4194304), e.child;
      case 5:
        return t === null && ft && ((n = a = Et) && (a = ny(
          a,
          e.type,
          e.pendingProps,
          Re
        ), a !== null ? (e.stateNode = a, Vt = e, Et = Oe(a.firstChild), Re = !1, n = !0) : n = !1), n || xl(e)), ka(e), n = e.type, u = e.pendingProps, c = t !== null ? t.memoizedProps : null, a = u.children, Ds(n, u) ? a = null : c !== null && Ds(n, c) && (e.flags |= 32), e.memoizedState !== null && (n = Cc(
          t,
          e,
          bv,
          null,
          null,
          l
        ), qn._currentValue = n), Lu(t, e), Jt(t, e, a, l), e.child;
      case 6:
        return t === null && ft && ((t = l = Et) && (l = uy(
          l,
          e.pendingProps,
          Re
        ), l !== null ? (e.stateNode = l, Vt = e, Et = null, t = !0) : t = !1), t || xl(e)), null;
      case 13:
        return Yo(t, e, l);
      case 4:
        return te(
          e,
          e.stateNode.containerInfo
        ), a = e.pendingProps, t === null ? e.child = ea(
          e,
          null,
          a,
          l
        ) : Jt(t, e, a, l), e.child;
      case 11:
        return Oo(
          t,
          e,
          e.type,
          e.pendingProps,
          l
        );
      case 7:
        return Jt(
          t,
          e,
          e.pendingProps,
          l
        ), e.child;
      case 8:
        return Jt(
          t,
          e,
          e.pendingProps.children,
          l
        ), e.child;
      case 12:
        return Jt(
          t,
          e,
          e.pendingProps.children,
          l
        ), e.child;
      case 10:
        return a = e.pendingProps, _l(e, e.type, a.value), Jt(t, e, a.children, l), e.child;
      case 9:
        return n = e.type._context, a = e.pendingProps.children, Fl(e), n = Kt(n), a = a(n), e.flags |= 1, Jt(t, e, a, l), e.child;
      case 14:
        return Mo(
          t,
          e,
          e.type,
          e.pendingProps,
          l
        );
      case 15:
        return Co(
          t,
          e,
          e.type,
          e.pendingProps,
          l
        );
      case 19:
        return Go(t, e, l);
      case 31:
        return Av(t, e, l);
      case 22:
        return Do(
          t,
          e,
          l,
          e.pendingProps
        );
      case 24:
        return Fl(e), a = Kt(Lt), t === null ? (n = _c(), n === null && (n = _t, u = Sc(), n.pooledCache = u, u.refCount++, u !== null && (n.pooledCacheLanes |= l), n = u), e.memoizedState = { parent: a, cache: n }, Tc(e), _l(e, Lt, n)) : ((t.lanes & l) !== 0 && (jc(t, e), gn(e, null, null, l), pn()), n = t.memoizedState, u = e.memoizedState, n.parent !== a ? (n = { parent: a, cache: a }, e.memoizedState = n, e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = n), _l(e, Lt, a)) : (a = u.cache, _l(e, Lt, a), a !== n.cache && bc(
          e,
          [Lt],
          l,
          !0
        ))), Jt(
          t,
          e,
          e.pendingProps.children,
          l
        ), e.child;
      case 29:
        throw e.pendingProps;
    }
    throw Error(s(156, e.tag));
  }
  function ul(t) {
    t.flags |= 4;
  }
  function is(t, e, l, a, n) {
    if ((e = (t.mode & 32) !== 0) && (e = !1), e) {
      if (t.flags |= 16777216, (n & 335544128) === n)
        if (t.stateNode.complete) t.flags |= 8192;
        else if (vd()) t.flags |= 8192;
        else
          throw ta = _u, Ec;
    } else t.flags &= -16777217;
  }
  function Qo(t, e) {
    if (e.type !== "stylesheet" || (e.state.loading & 4) !== 0)
      t.flags &= -16777217;
    else if (t.flags |= 16777216, !nh(e))
      if (vd()) t.flags |= 8192;
      else
        throw ta = _u, Ec;
  }
  function Yu(t, e) {
    e !== null && (t.flags |= 4), t.flags & 16384 && (e = t.tag !== 22 ? xf() : 536870912, t.lanes |= e, La |= e);
  }
  function Tn(t, e) {
    if (!ft)
      switch (t.tailMode) {
        case "hidden":
          e = t.tail;
          for (var l = null; e !== null; )
            e.alternate !== null && (l = e), e = e.sibling;
          l === null ? t.tail = null : l.sibling = null;
          break;
        case "collapsed":
          l = t.tail;
          for (var a = null; l !== null; )
            l.alternate !== null && (a = l), l = l.sibling;
          a === null ? e || t.tail === null ? t.tail = null : t.tail.sibling = null : a.sibling = null;
      }
  }
  function Tt(t) {
    var e = t.alternate !== null && t.alternate.child === t.child, l = 0, a = 0;
    if (e)
      for (var n = t.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags & 65011712, a |= n.flags & 65011712, n.return = t, n = n.sibling;
    else
      for (n = t.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags, a |= n.flags, n.return = t, n = n.sibling;
    return t.subtreeFlags |= a, t.childLanes = l, e;
  }
  function Nv(t, e, l) {
    var a = e.pendingProps;
    switch (mc(e), e.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Tt(e), null;
      case 1:
        return Tt(e), null;
      case 3:
        return l = e.stateNode, a = null, t !== null && (a = t.memoizedState.cache), e.memoizedState.cache !== a && (e.flags |= 2048), el(Lt), Dt(), l.pendingContext && (l.context = l.pendingContext, l.pendingContext = null), (t === null || t.child === null) && (Ta(e) ? ul(e) : t === null || t.memoizedState.isDehydrated && (e.flags & 256) === 0 || (e.flags |= 1024, yc())), Tt(e), null;
      case 26:
        var n = e.type, u = e.memoizedState;
        return t === null ? (ul(e), u !== null ? (Tt(e), Qo(e, u)) : (Tt(e), is(
          e,
          n,
          null,
          a,
          l
        ))) : u ? u !== t.memoizedState ? (ul(e), Tt(e), Qo(e, u)) : (Tt(e), e.flags &= -16777217) : (t = t.memoizedProps, t !== a && ul(e), Tt(e), is(
          e,
          n,
          t,
          a,
          l
        )), null;
      case 27:
        if (Wn(e), l = at.current, n = e.type, t !== null && e.stateNode != null)
          t.memoizedProps !== a && ul(e);
        else {
          if (!a) {
            if (e.stateNode === null)
              throw Error(s(166));
            return Tt(e), null;
          }
          t = V.current, Ta(e) ? xr(e) : (t = Wd(n, a, l), e.stateNode = t, ul(e));
        }
        return Tt(e), null;
      case 5:
        if (Wn(e), n = e.type, t !== null && e.stateNode != null)
          t.memoizedProps !== a && ul(e);
        else {
          if (!a) {
            if (e.stateNode === null)
              throw Error(s(166));
            return Tt(e), null;
          }
          if (u = V.current, Ta(e))
            xr(e);
          else {
            var c = ti(
              at.current
            );
            switch (u) {
              case 1:
                u = c.createElementNS(
                  "http://www.w3.org/2000/svg",
                  n
                );
                break;
              case 2:
                u = c.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  n
                );
                break;
              default:
                switch (n) {
                  case "svg":
                    u = c.createElementNS(
                      "http://www.w3.org/2000/svg",
                      n
                    );
                    break;
                  case "math":
                    u = c.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      n
                    );
                    break;
                  case "script":
                    u = c.createElement("div"), u.innerHTML = "<script><\/script>", u = u.removeChild(
                      u.firstChild
                    );
                    break;
                  case "select":
                    u = typeof a.is == "string" ? c.createElement("select", {
                      is: a.is
                    }) : c.createElement("select"), a.multiple ? u.multiple = !0 : a.size && (u.size = a.size);
                    break;
                  default:
                    u = typeof a.is == "string" ? c.createElement(n, { is: a.is }) : c.createElement(n);
                }
            }
            u[Zt] = e, u[le] = a;
            t: for (c = e.child; c !== null; ) {
              if (c.tag === 5 || c.tag === 6)
                u.appendChild(c.stateNode);
              else if (c.tag !== 4 && c.tag !== 27 && c.child !== null) {
                c.child.return = c, c = c.child;
                continue;
              }
              if (c === e) break t;
              for (; c.sibling === null; ) {
                if (c.return === null || c.return === e)
                  break t;
                c = c.return;
              }
              c.sibling.return = c.return, c = c.sibling;
            }
            e.stateNode = u;
            t: switch (kt(u, n, a), n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                a = !!a.autoFocus;
                break t;
              case "img":
                a = !0;
                break t;
              default:
                a = !1;
            }
            a && ul(e);
          }
        }
        return Tt(e), is(
          e,
          e.type,
          t === null ? null : t.memoizedProps,
          e.pendingProps,
          l
        ), null;
      case 6:
        if (t && e.stateNode != null)
          t.memoizedProps !== a && ul(e);
        else {
          if (typeof a != "string" && e.stateNode === null)
            throw Error(s(166));
          if (t = at.current, Ta(e)) {
            if (t = e.stateNode, l = e.memoizedProps, a = null, n = Vt, n !== null)
              switch (n.tag) {
                case 27:
                case 5:
                  a = n.memoizedProps;
              }
            t[Zt] = e, t = !!(t.nodeValue === l || a !== null && a.suppressHydrationWarning === !0 || Yd(t.nodeValue, l)), t || xl(e, !0);
          } else
            t = ti(t).createTextNode(
              a
            ), t[Zt] = e, e.stateNode = t;
        }
        return Tt(e), null;
      case 31:
        if (l = e.memoizedState, t === null || t.memoizedState !== null) {
          if (a = Ta(e), l !== null) {
            if (t === null) {
              if (!a) throw Error(s(318));
              if (t = e.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(s(557));
              t[Zt] = e;
            } else
              $l(), (e.flags & 128) === 0 && (e.memoizedState = null), e.flags |= 4;
            Tt(e), t = !1;
          } else
            l = yc(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = l), t = !0;
          if (!t)
            return e.flags & 256 ? (ve(e), e) : (ve(e), null);
          if ((e.flags & 128) !== 0)
            throw Error(s(558));
        }
        return Tt(e), null;
      case 13:
        if (a = e.memoizedState, t === null || t.memoizedState !== null && t.memoizedState.dehydrated !== null) {
          if (n = Ta(e), a !== null && a.dehydrated !== null) {
            if (t === null) {
              if (!n) throw Error(s(318));
              if (n = e.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(s(317));
              n[Zt] = e;
            } else
              $l(), (e.flags & 128) === 0 && (e.memoizedState = null), e.flags |= 4;
            Tt(e), n = !1;
          } else
            n = yc(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = n), n = !0;
          if (!n)
            return e.flags & 256 ? (ve(e), e) : (ve(e), null);
        }
        return ve(e), (e.flags & 128) !== 0 ? (e.lanes = l, e) : (l = a !== null, t = t !== null && t.memoizedState !== null, l && (a = e.child, n = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (n = a.alternate.memoizedState.cachePool.pool), u = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (u = a.memoizedState.cachePool.pool), u !== n && (a.flags |= 2048)), l !== t && l && (e.child.flags |= 8192), Yu(e, e.updateQueue), Tt(e), null);
      case 4:
        return Dt(), t === null && Rs(e.stateNode.containerInfo), Tt(e), null;
      case 10:
        return el(e.type), Tt(e), null;
      case 19:
        if (H(Ut), a = e.memoizedState, a === null) return Tt(e), null;
        if (n = (e.flags & 128) !== 0, u = a.rendering, u === null)
          if (n) Tn(a, !1);
          else {
            if (Nt !== 0 || t !== null && (t.flags & 128) !== 0)
              for (t = e.child; t !== null; ) {
                if (u = zu(t), u !== null) {
                  for (e.flags |= 128, Tn(a, !1), t = u.updateQueue, e.updateQueue = t, Yu(e, t), e.subtreeFlags = 0, t = l, l = e.child; l !== null; )
                    yr(l, t), l = l.sibling;
                  return G(
                    Ut,
                    Ut.current & 1 | 2
                  ), ft && Ie(e, a.treeForkCount), e.child;
                }
                t = t.sibling;
              }
            a.tail !== null && fe() > Zu && (e.flags |= 128, n = !0, Tn(a, !1), e.lanes = 4194304);
          }
        else {
          if (!n)
            if (t = zu(u), t !== null) {
              if (e.flags |= 128, n = !0, t = t.updateQueue, e.updateQueue = t, Yu(e, t), Tn(a, !0), a.tail === null && a.tailMode === "hidden" && !u.alternate && !ft)
                return Tt(e), null;
            } else
              2 * fe() - a.renderingStartTime > Zu && l !== 536870912 && (e.flags |= 128, n = !0, Tn(a, !1), e.lanes = 4194304);
          a.isBackwards ? (u.sibling = e.child, e.child = u) : (t = a.last, t !== null ? t.sibling = u : e.child = u, a.last = u);
        }
        return a.tail !== null ? (t = a.tail, a.rendering = t, a.tail = t.sibling, a.renderingStartTime = fe(), t.sibling = null, l = Ut.current, G(
          Ut,
          n ? l & 1 | 2 : l & 1
        ), ft && Ie(e, a.treeForkCount), t) : (Tt(e), null);
      case 22:
      case 23:
        return ve(e), Nc(), a = e.memoizedState !== null, t !== null ? t.memoizedState !== null !== a && (e.flags |= 8192) : a && (e.flags |= 8192), a ? (l & 536870912) !== 0 && (e.flags & 128) === 0 && (Tt(e), e.subtreeFlags & 6 && (e.flags |= 8192)) : Tt(e), l = e.updateQueue, l !== null && Yu(e, l.retryQueue), l = null, t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), a = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (a = e.memoizedState.cachePool.pool), a !== l && (e.flags |= 2048), t !== null && H(Pl), null;
      case 24:
        return l = null, t !== null && (l = t.memoizedState.cache), e.memoizedState.cache !== l && (e.flags |= 2048), el(Lt), Tt(e), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(s(156, e.tag));
  }
  function Ov(t, e) {
    switch (mc(e), e.tag) {
      case 1:
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 3:
        return el(Lt), Dt(), t = e.flags, (t & 65536) !== 0 && (t & 128) === 0 ? (e.flags = t & -65537 | 128, e) : null;
      case 26:
      case 27:
      case 5:
        return Wn(e), null;
      case 31:
        if (e.memoizedState !== null) {
          if (ve(e), e.alternate === null)
            throw Error(s(340));
          $l();
        }
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 13:
        if (ve(e), t = e.memoizedState, t !== null && t.dehydrated !== null) {
          if (e.alternate === null)
            throw Error(s(340));
          $l();
        }
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 19:
        return H(Ut), null;
      case 4:
        return Dt(), null;
      case 10:
        return el(e.type), null;
      case 22:
      case 23:
        return ve(e), Nc(), t !== null && H(Pl), t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 24:
        return el(Lt), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Zo(t, e) {
    switch (mc(e), e.tag) {
      case 3:
        el(Lt), Dt();
        break;
      case 26:
      case 27:
      case 5:
        Wn(e);
        break;
      case 4:
        Dt();
        break;
      case 31:
        e.memoizedState !== null && ve(e);
        break;
      case 13:
        ve(e);
        break;
      case 19:
        H(Ut);
        break;
      case 10:
        el(e.type);
        break;
      case 22:
      case 23:
        ve(e), Nc(), t !== null && H(Pl);
        break;
      case 24:
        el(Lt);
    }
  }
  function jn(t, e) {
    try {
      var l = e.updateQueue, a = l !== null ? l.lastEffect : null;
      if (a !== null) {
        var n = a.next;
        l = n;
        do {
          if ((l.tag & t) === t) {
            a = void 0;
            var u = l.create, c = l.inst;
            a = u(), c.destroy = a;
          }
          l = l.next;
        } while (l !== n);
      }
    } catch (o) {
      vt(e, e.return, o);
    }
  }
  function Rl(t, e, l) {
    try {
      var a = e.updateQueue, n = a !== null ? a.lastEffect : null;
      if (n !== null) {
        var u = n.next;
        a = u;
        do {
          if ((a.tag & t) === t) {
            var c = a.inst, o = c.destroy;
            if (o !== void 0) {
              c.destroy = void 0, n = e;
              var y = l, j = o;
              try {
                j();
              } catch (M) {
                vt(
                  n,
                  y,
                  M
                );
              }
            }
          }
          a = a.next;
        } while (a !== u);
      }
    } catch (M) {
      vt(e, e.return, M);
    }
  }
  function Vo(t) {
    var e = t.updateQueue;
    if (e !== null) {
      var l = t.stateNode;
      try {
        Ur(e, l);
      } catch (a) {
        vt(t, t.return, a);
      }
    }
  }
  function Ko(t, e, l) {
    l.props = aa(
      t.type,
      t.memoizedProps
    ), l.state = t.memoizedState;
    try {
      l.componentWillUnmount();
    } catch (a) {
      vt(t, e, a);
    }
  }
  function zn(t, e) {
    try {
      var l = t.ref;
      if (l !== null) {
        switch (t.tag) {
          case 26:
          case 27:
          case 5:
            var a = t.stateNode;
            break;
          case 30:
            a = t.stateNode;
            break;
          default:
            a = t.stateNode;
        }
        typeof l == "function" ? t.refCleanup = l(a) : l.current = a;
      }
    } catch (n) {
      vt(t, e, n);
    }
  }
  function Ve(t, e) {
    var l = t.ref, a = t.refCleanup;
    if (l !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (n) {
          vt(t, e, n);
        } finally {
          t.refCleanup = null, t = t.alternate, t != null && (t.refCleanup = null);
        }
      else if (typeof l == "function")
        try {
          l(null);
        } catch (n) {
          vt(t, e, n);
        }
      else l.current = null;
  }
  function Jo(t) {
    var e = t.type, l = t.memoizedProps, a = t.stateNode;
    try {
      t: switch (e) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          l.autoFocus && a.focus();
          break t;
        case "img":
          l.src ? a.src = l.src : l.srcSet && (a.srcset = l.srcSet);
      }
    } catch (n) {
      vt(t, t.return, n);
    }
  }
  function cs(t, e, l) {
    try {
      var a = t.stateNode;
      Pv(a, t.type, l, e), a[le] = e;
    } catch (n) {
      vt(t, t.return, n);
    }
  }
  function ko(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 26 || t.tag === 27 && Hl(t.type) || t.tag === 4;
  }
  function ss(t) {
    t: for (; ; ) {
      for (; t.sibling === null; ) {
        if (t.return === null || ko(t.return)) return null;
        t = t.return;
      }
      for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18; ) {
        if (t.tag === 27 && Hl(t.type) || t.flags & 2 || t.child === null || t.tag === 4) continue t;
        t.child.return = t, t = t.child;
      }
      if (!(t.flags & 2)) return t.stateNode;
    }
  }
  function fs(t, e, l) {
    var a = t.tag;
    if (a === 5 || a === 6)
      t = t.stateNode, e ? (l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l).insertBefore(t, e) : (e = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, e.appendChild(t), l = l._reactRootContainer, l != null || e.onclick !== null || (e.onclick = We));
    else if (a !== 4 && (a === 27 && Hl(t.type) && (l = t.stateNode, e = null), t = t.child, t !== null))
      for (fs(t, e, l), t = t.sibling; t !== null; )
        fs(t, e, l), t = t.sibling;
  }
  function wu(t, e, l) {
    var a = t.tag;
    if (a === 5 || a === 6)
      t = t.stateNode, e ? l.insertBefore(t, e) : l.appendChild(t);
    else if (a !== 4 && (a === 27 && Hl(t.type) && (l = t.stateNode), t = t.child, t !== null))
      for (wu(t, e, l), t = t.sibling; t !== null; )
        wu(t, e, l), t = t.sibling;
  }
  function $o(t) {
    var e = t.stateNode, l = t.memoizedProps;
    try {
      for (var a = t.type, n = e.attributes; n.length; )
        e.removeAttributeNode(n[0]);
      kt(e, a, l), e[Zt] = t, e[le] = l;
    } catch (u) {
      vt(t, t.return, u);
    }
  }
  var il = !1, wt = !1, rs = !1, Wo = typeof WeakSet == "function" ? WeakSet : Set, Qt = null;
  function Mv(t, e) {
    if (t = t.containerInfo, Ms = ci, t = cr(t), ac(t)) {
      if ("selectionStart" in t)
        var l = {
          start: t.selectionStart,
          end: t.selectionEnd
        };
      else
        t: {
          l = (l = t.ownerDocument) && l.defaultView || window;
          var a = l.getSelection && l.getSelection();
          if (a && a.rangeCount !== 0) {
            l = a.anchorNode;
            var n = a.anchorOffset, u = a.focusNode;
            a = a.focusOffset;
            try {
              l.nodeType, u.nodeType;
            } catch {
              l = null;
              break t;
            }
            var c = 0, o = -1, y = -1, j = 0, M = 0, U = t, R = null;
            e: for (; ; ) {
              for (var O; U !== l || n !== 0 && U.nodeType !== 3 || (o = c + n), U !== u || a !== 0 && U.nodeType !== 3 || (y = c + a), U.nodeType === 3 && (c += U.nodeValue.length), (O = U.firstChild) !== null; )
                R = U, U = O;
              for (; ; ) {
                if (U === t) break e;
                if (R === l && ++j === n && (o = c), R === u && ++M === a && (y = c), (O = U.nextSibling) !== null) break;
                U = R, R = U.parentNode;
              }
              U = O;
            }
            l = o === -1 || y === -1 ? null : { start: o, end: y };
          } else l = null;
        }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (Cs = { focusedElem: t, selectionRange: l }, ci = !1, Qt = e; Qt !== null; )
      if (e = Qt, t = e.child, (e.subtreeFlags & 1028) !== 0 && t !== null)
        t.return = e, Qt = t;
      else
        for (; Qt !== null; ) {
          switch (e = Qt, u = e.alternate, t = e.flags, e.tag) {
            case 0:
              if ((t & 4) !== 0 && (t = e.updateQueue, t = t !== null ? t.events : null, t !== null))
                for (l = 0; l < t.length; l++)
                  n = t[l], n.ref.impl = n.nextImpl;
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((t & 1024) !== 0 && u !== null) {
                t = void 0, l = e, n = u.memoizedProps, u = u.memoizedState, a = l.stateNode;
                try {
                  var Q = aa(
                    l.type,
                    n
                  );
                  t = a.getSnapshotBeforeUpdate(
                    Q,
                    u
                  ), a.__reactInternalSnapshotBeforeUpdate = t;
                } catch ($) {
                  vt(
                    l,
                    l.return,
                    $
                  );
                }
              }
              break;
            case 3:
              if ((t & 1024) !== 0) {
                if (t = e.stateNode.containerInfo, l = t.nodeType, l === 9)
                  Hs(t);
                else if (l === 1)
                  switch (t.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      Hs(t);
                      break;
                    default:
                      t.textContent = "";
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
              if ((t & 1024) !== 0) throw Error(s(163));
          }
          if (t = e.sibling, t !== null) {
            t.return = e.return, Qt = t;
            break;
          }
          Qt = e.return;
        }
  }
  function Fo(t, e, l) {
    var a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        sl(t, l), a & 4 && jn(5, l);
        break;
      case 1:
        if (sl(t, l), a & 4)
          if (t = l.stateNode, e === null)
            try {
              t.componentDidMount();
            } catch (c) {
              vt(l, l.return, c);
            }
          else {
            var n = aa(
              l.type,
              e.memoizedProps
            );
            e = e.memoizedState;
            try {
              t.componentDidUpdate(
                n,
                e,
                t.__reactInternalSnapshotBeforeUpdate
              );
            } catch (c) {
              vt(
                l,
                l.return,
                c
              );
            }
          }
        a & 64 && Vo(l), a & 512 && zn(l, l.return);
        break;
      case 3:
        if (sl(t, l), a & 64 && (t = l.updateQueue, t !== null)) {
          if (e = null, l.child !== null)
            switch (l.child.tag) {
              case 27:
              case 5:
                e = l.child.stateNode;
                break;
              case 1:
                e = l.child.stateNode;
            }
          try {
            Ur(t, e);
          } catch (c) {
            vt(l, l.return, c);
          }
        }
        break;
      case 27:
        e === null && a & 4 && $o(l);
      case 26:
      case 5:
        sl(t, l), e === null && a & 4 && Jo(l), a & 512 && zn(l, l.return);
        break;
      case 12:
        sl(t, l);
        break;
      case 31:
        sl(t, l), a & 4 && td(t, l);
        break;
      case 13:
        sl(t, l), a & 4 && ed(t, l), a & 64 && (t = l.memoizedState, t !== null && (t = t.dehydrated, t !== null && (l = wv.bind(
          null,
          l
        ), iy(t, l))));
        break;
      case 22:
        if (a = l.memoizedState !== null || il, !a) {
          e = e !== null && e.memoizedState !== null || wt, n = il;
          var u = wt;
          il = a, (wt = e) && !u ? fl(
            t,
            l,
            (l.subtreeFlags & 8772) !== 0
          ) : sl(t, l), il = n, wt = u;
        }
        break;
      case 30:
        break;
      default:
        sl(t, l);
    }
  }
  function Po(t) {
    var e = t.alternate;
    e !== null && (t.alternate = null, Po(e)), t.child = null, t.deletions = null, t.sibling = null, t.tag === 5 && (e = t.stateNode, e !== null && wi(e)), t.stateNode = null, t.return = null, t.dependencies = null, t.memoizedProps = null, t.memoizedState = null, t.pendingProps = null, t.stateNode = null, t.updateQueue = null;
  }
  var jt = null, ne = !1;
  function cl(t, e, l) {
    for (l = l.child; l !== null; )
      Io(t, e, l), l = l.sibling;
  }
  function Io(t, e, l) {
    if (re && typeof re.onCommitFiberUnmount == "function")
      try {
        re.onCommitFiberUnmount($a, l);
      } catch {
      }
    switch (l.tag) {
      case 26:
        wt || Ve(l, e), cl(
          t,
          e,
          l
        ), l.memoizedState ? l.memoizedState.count-- : l.stateNode && (l = l.stateNode, l.parentNode.removeChild(l));
        break;
      case 27:
        wt || Ve(l, e);
        var a = jt, n = ne;
        Hl(l.type) && (jt = l.stateNode, ne = !1), cl(
          t,
          e,
          l
        ), Hn(l.stateNode), jt = a, ne = n;
        break;
      case 5:
        wt || Ve(l, e);
      case 6:
        if (a = jt, n = ne, jt = null, cl(
          t,
          e,
          l
        ), jt = a, ne = n, jt !== null)
          if (ne)
            try {
              (jt.nodeType === 9 ? jt.body : jt.nodeName === "HTML" ? jt.ownerDocument.body : jt).removeChild(l.stateNode);
            } catch (u) {
              vt(
                l,
                e,
                u
              );
            }
          else
            try {
              jt.removeChild(l.stateNode);
            } catch (u) {
              vt(
                l,
                e,
                u
              );
            }
        break;
      case 18:
        jt !== null && (ne ? (t = jt, Vd(
          t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t,
          l.stateNode
        ), Va(t)) : Vd(jt, l.stateNode));
        break;
      case 4:
        a = jt, n = ne, jt = l.stateNode.containerInfo, ne = !0, cl(
          t,
          e,
          l
        ), jt = a, ne = n;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Rl(2, l, e), wt || Rl(4, l, e), cl(
          t,
          e,
          l
        );
        break;
      case 1:
        wt || (Ve(l, e), a = l.stateNode, typeof a.componentWillUnmount == "function" && Ko(
          l,
          e,
          a
        )), cl(
          t,
          e,
          l
        );
        break;
      case 21:
        cl(
          t,
          e,
          l
        );
        break;
      case 22:
        wt = (a = wt) || l.memoizedState !== null, cl(
          t,
          e,
          l
        ), wt = a;
        break;
      default:
        cl(
          t,
          e,
          l
        );
    }
  }
  function td(t, e) {
    if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null))) {
      t = t.dehydrated;
      try {
        Va(t);
      } catch (l) {
        vt(e, e.return, l);
      }
    }
  }
  function ed(t, e) {
    if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null && (t = t.dehydrated, t !== null))))
      try {
        Va(t);
      } catch (l) {
        vt(e, e.return, l);
      }
  }
  function Cv(t) {
    switch (t.tag) {
      case 31:
      case 13:
      case 19:
        var e = t.stateNode;
        return e === null && (e = t.stateNode = new Wo()), e;
      case 22:
        return t = t.stateNode, e = t._retryCache, e === null && (e = t._retryCache = new Wo()), e;
      default:
        throw Error(s(435, t.tag));
    }
  }
  function Gu(t, e) {
    var l = Cv(t);
    e.forEach(function(a) {
      if (!l.has(a)) {
        l.add(a);
        var n = Gv.bind(null, t, a);
        a.then(n, n);
      }
    });
  }
  function ue(t, e) {
    var l = e.deletions;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var n = l[a], u = t, c = e, o = c;
        t: for (; o !== null; ) {
          switch (o.tag) {
            case 27:
              if (Hl(o.type)) {
                jt = o.stateNode, ne = !1;
                break t;
              }
              break;
            case 5:
              jt = o.stateNode, ne = !1;
              break t;
            case 3:
            case 4:
              jt = o.stateNode.containerInfo, ne = !0;
              break t;
          }
          o = o.return;
        }
        if (jt === null) throw Error(s(160));
        Io(u, c, n), jt = null, ne = !1, u = n.alternate, u !== null && (u.return = null), n.return = null;
      }
    if (e.subtreeFlags & 13886)
      for (e = e.child; e !== null; )
        ld(e, t), e = e.sibling;
  }
  var Le = null;
  function ld(t, e) {
    var l = t.alternate, a = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        ue(e, t), ie(t), a & 4 && (Rl(3, t, t.return), jn(3, t), Rl(5, t, t.return));
        break;
      case 1:
        ue(e, t), ie(t), a & 512 && (wt || l === null || Ve(l, l.return)), a & 64 && il && (t = t.updateQueue, t !== null && (a = t.callbacks, a !== null && (l = t.shared.hiddenCallbacks, t.shared.hiddenCallbacks = l === null ? a : l.concat(a))));
        break;
      case 26:
        var n = Le;
        if (ue(e, t), ie(t), a & 512 && (wt || l === null || Ve(l, l.return)), a & 4) {
          var u = l !== null ? l.memoizedState : null;
          if (a = t.memoizedState, l === null)
            if (a === null)
              if (t.stateNode === null) {
                t: {
                  a = t.type, l = t.memoizedProps, n = n.ownerDocument || n;
                  e: switch (a) {
                    case "title":
                      u = n.getElementsByTagName("title")[0], (!u || u[Pa] || u[Zt] || u.namespaceURI === "http://www.w3.org/2000/svg" || u.hasAttribute("itemprop")) && (u = n.createElement(a), n.head.insertBefore(
                        u,
                        n.querySelector("head > title")
                      )), kt(u, a, l), u[Zt] = t, Xt(u), a = u;
                      break t;
                    case "link":
                      var c = lh(
                        "link",
                        "href",
                        n
                      ).get(a + (l.href || ""));
                      if (c) {
                        for (var o = 0; o < c.length; o++)
                          if (u = c[o], u.getAttribute("href") === (l.href == null || l.href === "" ? null : l.href) && u.getAttribute("rel") === (l.rel == null ? null : l.rel) && u.getAttribute("title") === (l.title == null ? null : l.title) && u.getAttribute("crossorigin") === (l.crossOrigin == null ? null : l.crossOrigin)) {
                            c.splice(o, 1);
                            break e;
                          }
                      }
                      u = n.createElement(a), kt(u, a, l), n.head.appendChild(u);
                      break;
                    case "meta":
                      if (c = lh(
                        "meta",
                        "content",
                        n
                      ).get(a + (l.content || ""))) {
                        for (o = 0; o < c.length; o++)
                          if (u = c[o], u.getAttribute("content") === (l.content == null ? null : "" + l.content) && u.getAttribute("name") === (l.name == null ? null : l.name) && u.getAttribute("property") === (l.property == null ? null : l.property) && u.getAttribute("http-equiv") === (l.httpEquiv == null ? null : l.httpEquiv) && u.getAttribute("charset") === (l.charSet == null ? null : l.charSet)) {
                            c.splice(o, 1);
                            break e;
                          }
                      }
                      u = n.createElement(a), kt(u, a, l), n.head.appendChild(u);
                      break;
                    default:
                      throw Error(s(468, a));
                  }
                  u[Zt] = t, Xt(u), a = u;
                }
                t.stateNode = a;
              } else
                ah(
                  n,
                  t.type,
                  t.stateNode
                );
            else
              t.stateNode = eh(
                n,
                a,
                t.memoizedProps
              );
          else
            u !== a ? (u === null ? l.stateNode !== null && (l = l.stateNode, l.parentNode.removeChild(l)) : u.count--, a === null ? ah(
              n,
              t.type,
              t.stateNode
            ) : eh(
              n,
              a,
              t.memoizedProps
            )) : a === null && t.stateNode !== null && cs(
              t,
              t.memoizedProps,
              l.memoizedProps
            );
        }
        break;
      case 27:
        ue(e, t), ie(t), a & 512 && (wt || l === null || Ve(l, l.return)), l !== null && a & 4 && cs(
          t,
          t.memoizedProps,
          l.memoizedProps
        );
        break;
      case 5:
        if (ue(e, t), ie(t), a & 512 && (wt || l === null || Ve(l, l.return)), t.flags & 32) {
          n = t.stateNode;
          try {
            ma(n, "");
          } catch (Q) {
            vt(t, t.return, Q);
          }
        }
        a & 4 && t.stateNode != null && (n = t.memoizedProps, cs(
          t,
          n,
          l !== null ? l.memoizedProps : n
        )), a & 1024 && (rs = !0);
        break;
      case 6:
        if (ue(e, t), ie(t), a & 4) {
          if (t.stateNode === null)
            throw Error(s(162));
          a = t.memoizedProps, l = t.stateNode;
          try {
            l.nodeValue = a;
          } catch (Q) {
            vt(t, t.return, Q);
          }
        }
        break;
      case 3:
        if (ai = null, n = Le, Le = ei(e.containerInfo), ue(e, t), Le = n, ie(t), a & 4 && l !== null && l.memoizedState.isDehydrated)
          try {
            Va(e.containerInfo);
          } catch (Q) {
            vt(t, t.return, Q);
          }
        rs && (rs = !1, ad(t));
        break;
      case 4:
        a = Le, Le = ei(
          t.stateNode.containerInfo
        ), ue(e, t), ie(t), Le = a;
        break;
      case 12:
        ue(e, t), ie(t);
        break;
      case 31:
        ue(e, t), ie(t), a & 4 && (a = t.updateQueue, a !== null && (t.updateQueue = null, Gu(t, a)));
        break;
      case 13:
        ue(e, t), ie(t), t.child.flags & 8192 && t.memoizedState !== null != (l !== null && l.memoizedState !== null) && (Qu = fe()), a & 4 && (a = t.updateQueue, a !== null && (t.updateQueue = null, Gu(t, a)));
        break;
      case 22:
        n = t.memoizedState !== null;
        var y = l !== null && l.memoizedState !== null, j = il, M = wt;
        if (il = j || n, wt = M || y, ue(e, t), wt = M, il = j, ie(t), a & 8192)
          t: for (e = t.stateNode, e._visibility = n ? e._visibility & -2 : e._visibility | 1, n && (l === null || y || il || wt || na(t)), l = null, e = t; ; ) {
            if (e.tag === 5 || e.tag === 26) {
              if (l === null) {
                y = l = e;
                try {
                  if (u = y.stateNode, n)
                    c = u.style, typeof c.setProperty == "function" ? c.setProperty("display", "none", "important") : c.display = "none";
                  else {
                    o = y.stateNode;
                    var U = y.memoizedProps.style, R = U != null && U.hasOwnProperty("display") ? U.display : null;
                    o.style.display = R == null || typeof R == "boolean" ? "" : ("" + R).trim();
                  }
                } catch (Q) {
                  vt(y, y.return, Q);
                }
              }
            } else if (e.tag === 6) {
              if (l === null) {
                y = e;
                try {
                  y.stateNode.nodeValue = n ? "" : y.memoizedProps;
                } catch (Q) {
                  vt(y, y.return, Q);
                }
              }
            } else if (e.tag === 18) {
              if (l === null) {
                y = e;
                try {
                  var O = y.stateNode;
                  n ? Kd(O, !0) : Kd(y.stateNode, !1);
                } catch (Q) {
                  vt(y, y.return, Q);
                }
              }
            } else if ((e.tag !== 22 && e.tag !== 23 || e.memoizedState === null || e === t) && e.child !== null) {
              e.child.return = e, e = e.child;
              continue;
            }
            if (e === t) break t;
            for (; e.sibling === null; ) {
              if (e.return === null || e.return === t) break t;
              l === e && (l = null), e = e.return;
            }
            l === e && (l = null), e.sibling.return = e.return, e = e.sibling;
          }
        a & 4 && (a = t.updateQueue, a !== null && (l = a.retryQueue, l !== null && (a.retryQueue = null, Gu(t, l))));
        break;
      case 19:
        ue(e, t), ie(t), a & 4 && (a = t.updateQueue, a !== null && (t.updateQueue = null, Gu(t, a)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        ue(e, t), ie(t);
    }
  }
  function ie(t) {
    var e = t.flags;
    if (e & 2) {
      try {
        for (var l, a = t.return; a !== null; ) {
          if (ko(a)) {
            l = a;
            break;
          }
          a = a.return;
        }
        if (l == null) throw Error(s(160));
        switch (l.tag) {
          case 27:
            var n = l.stateNode, u = ss(t);
            wu(t, u, n);
            break;
          case 5:
            var c = l.stateNode;
            l.flags & 32 && (ma(c, ""), l.flags &= -33);
            var o = ss(t);
            wu(t, o, c);
            break;
          case 3:
          case 4:
            var y = l.stateNode.containerInfo, j = ss(t);
            fs(
              t,
              j,
              y
            );
            break;
          default:
            throw Error(s(161));
        }
      } catch (M) {
        vt(t, t.return, M);
      }
      t.flags &= -3;
    }
    e & 4096 && (t.flags &= -4097);
  }
  function ad(t) {
    if (t.subtreeFlags & 1024)
      for (t = t.child; t !== null; ) {
        var e = t;
        ad(e), e.tag === 5 && e.flags & 1024 && e.stateNode.reset(), t = t.sibling;
      }
  }
  function sl(t, e) {
    if (e.subtreeFlags & 8772)
      for (e = e.child; e !== null; )
        Fo(t, e.alternate, e), e = e.sibling;
  }
  function na(t) {
    for (t = t.child; t !== null; ) {
      var e = t;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Rl(4, e, e.return), na(e);
          break;
        case 1:
          Ve(e, e.return);
          var l = e.stateNode;
          typeof l.componentWillUnmount == "function" && Ko(
            e,
            e.return,
            l
          ), na(e);
          break;
        case 27:
          Hn(e.stateNode);
        case 26:
        case 5:
          Ve(e, e.return), na(e);
          break;
        case 22:
          e.memoizedState === null && na(e);
          break;
        case 30:
          na(e);
          break;
        default:
          na(e);
      }
      t = t.sibling;
    }
  }
  function fl(t, e, l) {
    for (l = l && (e.subtreeFlags & 8772) !== 0, e = e.child; e !== null; ) {
      var a = e.alternate, n = t, u = e, c = u.flags;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          fl(
            n,
            u,
            l
          ), jn(4, u);
          break;
        case 1:
          if (fl(
            n,
            u,
            l
          ), a = u, n = a.stateNode, typeof n.componentDidMount == "function")
            try {
              n.componentDidMount();
            } catch (j) {
              vt(a, a.return, j);
            }
          if (a = u, n = a.updateQueue, n !== null) {
            var o = a.stateNode;
            try {
              var y = n.shared.hiddenCallbacks;
              if (y !== null)
                for (n.shared.hiddenCallbacks = null, n = 0; n < y.length; n++)
                  Dr(y[n], o);
            } catch (j) {
              vt(a, a.return, j);
            }
          }
          l && c & 64 && Vo(u), zn(u, u.return);
          break;
        case 27:
          $o(u);
        case 26:
        case 5:
          fl(
            n,
            u,
            l
          ), l && a === null && c & 4 && Jo(u), zn(u, u.return);
          break;
        case 12:
          fl(
            n,
            u,
            l
          );
          break;
        case 31:
          fl(
            n,
            u,
            l
          ), l && c & 4 && td(n, u);
          break;
        case 13:
          fl(
            n,
            u,
            l
          ), l && c & 4 && ed(n, u);
          break;
        case 22:
          u.memoizedState === null && fl(
            n,
            u,
            l
          ), zn(u, u.return);
          break;
        case 30:
          break;
        default:
          fl(
            n,
            u,
            l
          );
      }
      e = e.sibling;
    }
  }
  function os(t, e) {
    var l = null;
    t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), t = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (t = e.memoizedState.cachePool.pool), t !== l && (t != null && t.refCount++, l != null && dn(l));
  }
  function ds(t, e) {
    t = null, e.alternate !== null && (t = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== t && (e.refCount++, t != null && dn(t));
  }
  function qe(t, e, l, a) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        nd(
          t,
          e,
          l,
          a
        ), e = e.sibling;
  }
  function nd(t, e, l, a) {
    var n = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        qe(
          t,
          e,
          l,
          a
        ), n & 2048 && jn(9, e);
        break;
      case 1:
        qe(
          t,
          e,
          l,
          a
        );
        break;
      case 3:
        qe(
          t,
          e,
          l,
          a
        ), n & 2048 && (t = null, e.alternate !== null && (t = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== t && (e.refCount++, t != null && dn(t)));
        break;
      case 12:
        if (n & 2048) {
          qe(
            t,
            e,
            l,
            a
          ), t = e.stateNode;
          try {
            var u = e.memoizedProps, c = u.id, o = u.onPostCommit;
            typeof o == "function" && o(
              c,
              e.alternate === null ? "mount" : "update",
              t.passiveEffectDuration,
              -0
            );
          } catch (y) {
            vt(e, e.return, y);
          }
        } else
          qe(
            t,
            e,
            l,
            a
          );
        break;
      case 31:
        qe(
          t,
          e,
          l,
          a
        );
        break;
      case 13:
        qe(
          t,
          e,
          l,
          a
        );
        break;
      case 23:
        break;
      case 22:
        u = e.stateNode, c = e.alternate, e.memoizedState !== null ? u._visibility & 2 ? qe(
          t,
          e,
          l,
          a
        ) : An(t, e) : u._visibility & 2 ? qe(
          t,
          e,
          l,
          a
        ) : (u._visibility |= 2, Ua(
          t,
          e,
          l,
          a,
          (e.subtreeFlags & 10256) !== 0 || !1
        )), n & 2048 && os(c, e);
        break;
      case 24:
        qe(
          t,
          e,
          l,
          a
        ), n & 2048 && ds(e.alternate, e);
        break;
      default:
        qe(
          t,
          e,
          l,
          a
        );
    }
  }
  function Ua(t, e, l, a, n) {
    for (n = n && ((e.subtreeFlags & 10256) !== 0 || !1), e = e.child; e !== null; ) {
      var u = t, c = e, o = l, y = a, j = c.flags;
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          Ua(
            u,
            c,
            o,
            y,
            n
          ), jn(8, c);
          break;
        case 23:
          break;
        case 22:
          var M = c.stateNode;
          c.memoizedState !== null ? M._visibility & 2 ? Ua(
            u,
            c,
            o,
            y,
            n
          ) : An(
            u,
            c
          ) : (M._visibility |= 2, Ua(
            u,
            c,
            o,
            y,
            n
          )), n && j & 2048 && os(
            c.alternate,
            c
          );
          break;
        case 24:
          Ua(
            u,
            c,
            o,
            y,
            n
          ), n && j & 2048 && ds(c.alternate, c);
          break;
        default:
          Ua(
            u,
            c,
            o,
            y,
            n
          );
      }
      e = e.sibling;
    }
  }
  function An(t, e) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; ) {
        var l = t, a = e, n = a.flags;
        switch (a.tag) {
          case 22:
            An(l, a), n & 2048 && os(
              a.alternate,
              a
            );
            break;
          case 24:
            An(l, a), n & 2048 && ds(a.alternate, a);
            break;
          default:
            An(l, a);
        }
        e = e.sibling;
      }
  }
  var Rn = 8192;
  function Ha(t, e, l) {
    if (t.subtreeFlags & Rn)
      for (t = t.child; t !== null; )
        ud(
          t,
          e,
          l
        ), t = t.sibling;
  }
  function ud(t, e, l) {
    switch (t.tag) {
      case 26:
        Ha(
          t,
          e,
          l
        ), t.flags & Rn && t.memoizedState !== null && gy(
          l,
          Le,
          t.memoizedState,
          t.memoizedProps
        );
        break;
      case 5:
        Ha(
          t,
          e,
          l
        );
        break;
      case 3:
      case 4:
        var a = Le;
        Le = ei(t.stateNode.containerInfo), Ha(
          t,
          e,
          l
        ), Le = a;
        break;
      case 22:
        t.memoizedState === null && (a = t.alternate, a !== null && a.memoizedState !== null ? (a = Rn, Rn = 16777216, Ha(
          t,
          e,
          l
        ), Rn = a) : Ha(
          t,
          e,
          l
        ));
        break;
      default:
        Ha(
          t,
          e,
          l
        );
    }
  }
  function id(t) {
    var e = t.alternate;
    if (e !== null && (t = e.child, t !== null)) {
      e.child = null;
      do
        e = t.sibling, t.sibling = null, t = e;
      while (t !== null);
    }
  }
  function Nn(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var l = 0; l < e.length; l++) {
          var a = e[l];
          Qt = a, sd(
            a,
            t
          );
        }
      id(t);
    }
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        cd(t), t = t.sibling;
  }
  function cd(t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Nn(t), t.flags & 2048 && Rl(9, t, t.return);
        break;
      case 3:
        Nn(t);
        break;
      case 12:
        Nn(t);
        break;
      case 22:
        var e = t.stateNode;
        t.memoizedState !== null && e._visibility & 2 && (t.return === null || t.return.tag !== 13) ? (e._visibility &= -3, Xu(t)) : Nn(t);
        break;
      default:
        Nn(t);
    }
  }
  function Xu(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var l = 0; l < e.length; l++) {
          var a = e[l];
          Qt = a, sd(
            a,
            t
          );
        }
      id(t);
    }
    for (t = t.child; t !== null; ) {
      switch (e = t, e.tag) {
        case 0:
        case 11:
        case 15:
          Rl(8, e, e.return), Xu(e);
          break;
        case 22:
          l = e.stateNode, l._visibility & 2 && (l._visibility &= -3, Xu(e));
          break;
        default:
          Xu(e);
      }
      t = t.sibling;
    }
  }
  function sd(t, e) {
    for (; Qt !== null; ) {
      var l = Qt;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          Rl(8, l, e);
          break;
        case 23:
        case 22:
          if (l.memoizedState !== null && l.memoizedState.cachePool !== null) {
            var a = l.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          dn(l.memoizedState.cache);
      }
      if (a = l.child, a !== null) a.return = l, Qt = a;
      else
        t: for (l = t; Qt !== null; ) {
          a = Qt;
          var n = a.sibling, u = a.return;
          if (Po(a), a === l) {
            Qt = null;
            break t;
          }
          if (n !== null) {
            n.return = u, Qt = n;
            break t;
          }
          Qt = u;
        }
    }
  }
  var Dv = {
    getCacheForType: function(t) {
      var e = Kt(Lt), l = e.data.get(t);
      return l === void 0 && (l = t(), e.data.set(t, l)), l;
    },
    cacheSignal: function() {
      return Kt(Lt).controller.signal;
    }
  }, Uv = typeof WeakMap == "function" ? WeakMap : Map, dt = 0, _t = null, nt = null, ct = 0, mt = 0, ye = null, Nl = !1, Ba = !1, hs = !1, rl = 0, Nt = 0, Ol = 0, ua = 0, ms = 0, pe = 0, La = 0, On = null, ce = null, vs = !1, Qu = 0, fd = 0, Zu = 1 / 0, Vu = null, Ml = null, Gt = 0, Cl = null, qa = null, ol = 0, ys = 0, ps = null, rd = null, Mn = 0, gs = null;
  function ge() {
    return (dt & 2) !== 0 && ct !== 0 ? ct & -ct : C.T !== null ? Ts() : jf();
  }
  function od() {
    if (pe === 0)
      if ((ct & 536870912) === 0 || ft) {
        var t = In;
        In <<= 1, (In & 3932160) === 0 && (In = 262144), pe = t;
      } else pe = 536870912;
    return t = me.current, t !== null && (t.flags |= 32), pe;
  }
  function se(t, e, l) {
    (t === _t && (mt === 2 || mt === 9) || t.cancelPendingCommit !== null) && (Ya(t, 0), Dl(
      t,
      ct,
      pe,
      !1
    )), Fa(t, l), ((dt & 2) === 0 || t !== _t) && (t === _t && ((dt & 2) === 0 && (ua |= l), Nt === 4 && Dl(
      t,
      ct,
      pe,
      !1
    )), Ke(t));
  }
  function dd(t, e, l) {
    if ((dt & 6) !== 0) throw Error(s(327));
    var a = !l && (e & 127) === 0 && (e & t.expiredLanes) === 0 || Wa(t, e), n = a ? Lv(t, e) : Ss(t, e, !0), u = a;
    do {
      if (n === 0) {
        Ba && !a && Dl(t, e, 0, !1);
        break;
      } else {
        if (l = t.current.alternate, u && !Hv(l)) {
          n = Ss(t, e, !1), u = !1;
          continue;
        }
        if (n === 2) {
          if (u = e, t.errorRecoveryDisabledLanes & u)
            var c = 0;
          else
            c = t.pendingLanes & -536870913, c = c !== 0 ? c : c & 536870912 ? 536870912 : 0;
          if (c !== 0) {
            e = c;
            t: {
              var o = t;
              n = On;
              var y = o.current.memoizedState.isDehydrated;
              if (y && (Ya(o, c).flags |= 256), c = Ss(
                o,
                c,
                !1
              ), c !== 2) {
                if (hs && !y) {
                  o.errorRecoveryDisabledLanes |= u, ua |= u, n = 4;
                  break t;
                }
                u = ce, ce = n, u !== null && (ce === null ? ce = u : ce.push.apply(
                  ce,
                  u
                ));
              }
              n = c;
            }
            if (u = !1, n !== 2) continue;
          }
        }
        if (n === 1) {
          Ya(t, 0), Dl(t, e, 0, !0);
          break;
        }
        t: {
          switch (a = t, u = n, u) {
            case 0:
            case 1:
              throw Error(s(345));
            case 4:
              if ((e & 4194048) !== e) break;
            case 6:
              Dl(
                a,
                e,
                pe,
                !Nl
              );
              break t;
            case 2:
              ce = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(s(329));
          }
          if ((e & 62914560) === e && (n = Qu + 300 - fe(), 10 < n)) {
            if (Dl(
              a,
              e,
              pe,
              !Nl
            ), eu(a, 0, !0) !== 0) break t;
            ol = e, a.timeoutHandle = Qd(
              hd.bind(
                null,
                a,
                l,
                ce,
                Vu,
                vs,
                e,
                pe,
                ua,
                La,
                Nl,
                u,
                "Throttled",
                -0,
                0
              ),
              n
            );
            break t;
          }
          hd(
            a,
            l,
            ce,
            Vu,
            vs,
            e,
            pe,
            ua,
            La,
            Nl,
            u,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Ke(t);
  }
  function hd(t, e, l, a, n, u, c, o, y, j, M, U, R, O) {
    if (t.timeoutHandle = -1, U = e.subtreeFlags, U & 8192 || (U & 16785408) === 16785408) {
      U = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: We
      }, ud(
        e,
        u,
        U
      );
      var Q = (u & 62914560) === u ? Qu - fe() : (u & 4194048) === u ? fd - fe() : 0;
      if (Q = by(
        U,
        Q
      ), Q !== null) {
        ol = u, t.cancelPendingCommit = Q(
          xd.bind(
            null,
            t,
            e,
            u,
            l,
            a,
            n,
            c,
            o,
            y,
            M,
            U,
            null,
            R,
            O
          )
        ), Dl(t, u, c, !j);
        return;
      }
    }
    xd(
      t,
      e,
      u,
      l,
      a,
      n,
      c,
      o,
      y
    );
  }
  function Hv(t) {
    for (var e = t; ; ) {
      var l = e.tag;
      if ((l === 0 || l === 11 || l === 15) && e.flags & 16384 && (l = e.updateQueue, l !== null && (l = l.stores, l !== null)))
        for (var a = 0; a < l.length; a++) {
          var n = l[a], u = n.getSnapshot;
          n = n.value;
          try {
            if (!de(u(), n)) return !1;
          } catch {
            return !1;
          }
        }
      if (l = e.child, e.subtreeFlags & 16384 && l !== null)
        l.return = e, e = l;
      else {
        if (e === t) break;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) return !0;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
    }
    return !0;
  }
  function Dl(t, e, l, a) {
    e &= ~ms, e &= ~ua, t.suspendedLanes |= e, t.pingedLanes &= ~e, a && (t.warmLanes |= e), a = t.expirationTimes;
    for (var n = e; 0 < n; ) {
      var u = 31 - oe(n), c = 1 << u;
      a[u] = -1, n &= ~c;
    }
    l !== 0 && _f(t, l, e);
  }
  function Ku() {
    return (dt & 6) === 0 ? (Cn(0), !1) : !0;
  }
  function bs() {
    if (nt !== null) {
      if (mt === 0)
        var t = nt.return;
      else
        t = nt, tl = Wl = null, Hc(t), Na = null, mn = 0, t = nt;
      for (; t !== null; )
        Zo(t.alternate, t), t = t.return;
      nt = null;
    }
  }
  function Ya(t, e) {
    var l = t.timeoutHandle;
    l !== -1 && (t.timeoutHandle = -1, ey(l)), l = t.cancelPendingCommit, l !== null && (t.cancelPendingCommit = null, l()), ol = 0, bs(), _t = t, nt = l = Pe(t.current, null), ct = e, mt = 0, ye = null, Nl = !1, Ba = Wa(t, e), hs = !1, La = pe = ms = ua = Ol = Nt = 0, ce = On = null, vs = !1, (e & 8) !== 0 && (e |= e & 32);
    var a = t.entangledLanes;
    if (a !== 0)
      for (t = t.entanglements, a &= e; 0 < a; ) {
        var n = 31 - oe(a), u = 1 << n;
        e |= t[n], a &= ~u;
      }
    return rl = e, hu(), l;
  }
  function md(t, e) {
    tt = null, C.H = _n, e === Ra || e === xu ? (e = Nr(), mt = 3) : e === Ec ? (e = Nr(), mt = 4) : mt = e === Fc ? 8 : e !== null && typeof e == "object" && typeof e.then == "function" ? 6 : 1, ye = e, nt === null && (Nt = 1, Hu(
      t,
      je(e, t.current)
    ));
  }
  function vd() {
    var t = me.current;
    return t === null ? !0 : (ct & 4194048) === ct ? Ne === null : (ct & 62914560) === ct || (ct & 536870912) !== 0 ? t === Ne : !1;
  }
  function yd() {
    var t = C.H;
    return C.H = _n, t === null ? _n : t;
  }
  function pd() {
    var t = C.A;
    return C.A = Dv, t;
  }
  function Ju() {
    Nt = 4, Nl || (ct & 4194048) !== ct && me.current !== null || (Ba = !0), (Ol & 134217727) === 0 && (ua & 134217727) === 0 || _t === null || Dl(
      _t,
      ct,
      pe,
      !1
    );
  }
  function Ss(t, e, l) {
    var a = dt;
    dt |= 2;
    var n = yd(), u = pd();
    (_t !== t || ct !== e) && (Vu = null, Ya(t, e)), e = !1;
    var c = Nt;
    t: do
      try {
        if (mt !== 0 && nt !== null) {
          var o = nt, y = ye;
          switch (mt) {
            case 8:
              bs(), c = 6;
              break t;
            case 3:
            case 2:
            case 9:
            case 6:
              me.current === null && (e = !0);
              var j = mt;
              if (mt = 0, ye = null, wa(t, o, y, j), l && Ba) {
                c = 0;
                break t;
              }
              break;
            default:
              j = mt, mt = 0, ye = null, wa(t, o, y, j);
          }
        }
        Bv(), c = Nt;
        break;
      } catch (M) {
        md(t, M);
      }
    while (!0);
    return e && t.shellSuspendCounter++, tl = Wl = null, dt = a, C.H = n, C.A = u, nt === null && (_t = null, ct = 0, hu()), c;
  }
  function Bv() {
    for (; nt !== null; ) gd(nt);
  }
  function Lv(t, e) {
    var l = dt;
    dt |= 2;
    var a = yd(), n = pd();
    _t !== t || ct !== e ? (Vu = null, Zu = fe() + 500, Ya(t, e)) : Ba = Wa(
      t,
      e
    );
    t: do
      try {
        if (mt !== 0 && nt !== null) {
          e = nt;
          var u = ye;
          e: switch (mt) {
            case 1:
              mt = 0, ye = null, wa(t, e, u, 1);
              break;
            case 2:
            case 9:
              if (Ar(u)) {
                mt = 0, ye = null, bd(e);
                break;
              }
              e = function() {
                mt !== 2 && mt !== 9 || _t !== t || (mt = 7), Ke(t);
              }, u.then(e, e);
              break t;
            case 3:
              mt = 7;
              break t;
            case 4:
              mt = 5;
              break t;
            case 7:
              Ar(u) ? (mt = 0, ye = null, bd(e)) : (mt = 0, ye = null, wa(t, e, u, 7));
              break;
            case 5:
              var c = null;
              switch (nt.tag) {
                case 26:
                  c = nt.memoizedState;
                case 5:
                case 27:
                  var o = nt;
                  if (c ? nh(c) : o.stateNode.complete) {
                    mt = 0, ye = null;
                    var y = o.sibling;
                    if (y !== null) nt = y;
                    else {
                      var j = o.return;
                      j !== null ? (nt = j, ku(j)) : nt = null;
                    }
                    break e;
                  }
              }
              mt = 0, ye = null, wa(t, e, u, 5);
              break;
            case 6:
              mt = 0, ye = null, wa(t, e, u, 6);
              break;
            case 8:
              bs(), Nt = 6;
              break t;
            default:
              throw Error(s(462));
          }
        }
        qv();
        break;
      } catch (M) {
        md(t, M);
      }
    while (!0);
    return tl = Wl = null, C.H = a, C.A = n, dt = l, nt !== null ? 0 : (_t = null, ct = 0, hu(), Nt);
  }
  function qv() {
    for (; nt !== null && !cm(); )
      gd(nt);
  }
  function gd(t) {
    var e = Xo(t.alternate, t, rl);
    t.memoizedProps = t.pendingProps, e === null ? ku(t) : nt = e;
  }
  function bd(t) {
    var e = t, l = e.alternate;
    switch (e.tag) {
      case 15:
      case 0:
        e = Bo(
          l,
          e,
          e.pendingProps,
          e.type,
          void 0,
          ct
        );
        break;
      case 11:
        e = Bo(
          l,
          e,
          e.pendingProps,
          e.type.render,
          e.ref,
          ct
        );
        break;
      case 5:
        Hc(e);
      default:
        Zo(l, e), e = nt = yr(e, rl), e = Xo(l, e, rl);
    }
    t.memoizedProps = t.pendingProps, e === null ? ku(t) : nt = e;
  }
  function wa(t, e, l, a) {
    tl = Wl = null, Hc(e), Na = null, mn = 0;
    var n = e.return;
    try {
      if (zv(
        t,
        n,
        e,
        l,
        ct
      )) {
        Nt = 1, Hu(
          t,
          je(l, t.current)
        ), nt = null;
        return;
      }
    } catch (u) {
      if (n !== null) throw nt = n, u;
      Nt = 1, Hu(
        t,
        je(l, t.current)
      ), nt = null;
      return;
    }
    e.flags & 32768 ? (ft || a === 1 ? t = !0 : Ba || (ct & 536870912) !== 0 ? t = !1 : (Nl = t = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = me.current, a !== null && a.tag === 13 && (a.flags |= 16384))), Sd(e, t)) : ku(e);
  }
  function ku(t) {
    var e = t;
    do {
      if ((e.flags & 32768) !== 0) {
        Sd(
          e,
          Nl
        );
        return;
      }
      t = e.return;
      var l = Nv(
        e.alternate,
        e,
        rl
      );
      if (l !== null) {
        nt = l;
        return;
      }
      if (e = e.sibling, e !== null) {
        nt = e;
        return;
      }
      nt = e = t;
    } while (e !== null);
    Nt === 0 && (Nt = 5);
  }
  function Sd(t, e) {
    do {
      var l = Ov(t.alternate, t);
      if (l !== null) {
        l.flags &= 32767, nt = l;
        return;
      }
      if (l = t.return, l !== null && (l.flags |= 32768, l.subtreeFlags = 0, l.deletions = null), !e && (t = t.sibling, t !== null)) {
        nt = t;
        return;
      }
      nt = t = l;
    } while (t !== null);
    Nt = 6, nt = null;
  }
  function xd(t, e, l, a, n, u, c, o, y) {
    t.cancelPendingCommit = null;
    do
      $u();
    while (Gt !== 0);
    if ((dt & 6) !== 0) throw Error(s(327));
    if (e !== null) {
      if (e === t.current) throw Error(s(177));
      if (u = e.lanes | e.childLanes, u |= sc, pm(
        t,
        l,
        u,
        c,
        o,
        y
      ), t === _t && (nt = _t = null, ct = 0), qa = e, Cl = t, ol = l, ys = u, ps = n, rd = a, (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0 ? (t.callbackNode = null, t.callbackPriority = 0, Xv(Fn, function() {
        return zd(), null;
      })) : (t.callbackNode = null, t.callbackPriority = 0), a = (e.flags & 13878) !== 0, (e.subtreeFlags & 13878) !== 0 || a) {
        a = C.T, C.T = null, n = w.p, w.p = 2, c = dt, dt |= 4;
        try {
          Mv(t, e, l);
        } finally {
          dt = c, w.p = n, C.T = a;
        }
      }
      Gt = 1, _d(), Ed(), Td();
    }
  }
  function _d() {
    if (Gt === 1) {
      Gt = 0;
      var t = Cl, e = qa, l = (e.flags & 13878) !== 0;
      if ((e.subtreeFlags & 13878) !== 0 || l) {
        l = C.T, C.T = null;
        var a = w.p;
        w.p = 2;
        var n = dt;
        dt |= 4;
        try {
          ld(e, t);
          var u = Cs, c = cr(t.containerInfo), o = u.focusedElem, y = u.selectionRange;
          if (c !== o && o && o.ownerDocument && ir(
            o.ownerDocument.documentElement,
            o
          )) {
            if (y !== null && ac(o)) {
              var j = y.start, M = y.end;
              if (M === void 0 && (M = j), "selectionStart" in o)
                o.selectionStart = j, o.selectionEnd = Math.min(
                  M,
                  o.value.length
                );
              else {
                var U = o.ownerDocument || document, R = U && U.defaultView || window;
                if (R.getSelection) {
                  var O = R.getSelection(), Q = o.textContent.length, $ = Math.min(y.start, Q), bt = y.end === void 0 ? $ : Math.min(y.end, Q);
                  !O.extend && $ > bt && (c = bt, bt = $, $ = c);
                  var _ = ur(
                    o,
                    $
                  ), b = ur(
                    o,
                    bt
                  );
                  if (_ && b && (O.rangeCount !== 1 || O.anchorNode !== _.node || O.anchorOffset !== _.offset || O.focusNode !== b.node || O.focusOffset !== b.offset)) {
                    var T = U.createRange();
                    T.setStart(_.node, _.offset), O.removeAllRanges(), $ > bt ? (O.addRange(T), O.extend(b.node, b.offset)) : (T.setEnd(b.node, b.offset), O.addRange(T));
                  }
                }
              }
            }
            for (U = [], O = o; O = O.parentNode; )
              O.nodeType === 1 && U.push({
                element: O,
                left: O.scrollLeft,
                top: O.scrollTop
              });
            for (typeof o.focus == "function" && o.focus(), o = 0; o < U.length; o++) {
              var D = U[o];
              D.element.scrollLeft = D.left, D.element.scrollTop = D.top;
            }
          }
          ci = !!Ms, Cs = Ms = null;
        } finally {
          dt = n, w.p = a, C.T = l;
        }
      }
      t.current = e, Gt = 2;
    }
  }
  function Ed() {
    if (Gt === 2) {
      Gt = 0;
      var t = Cl, e = qa, l = (e.flags & 8772) !== 0;
      if ((e.subtreeFlags & 8772) !== 0 || l) {
        l = C.T, C.T = null;
        var a = w.p;
        w.p = 2;
        var n = dt;
        dt |= 4;
        try {
          Fo(t, e.alternate, e);
        } finally {
          dt = n, w.p = a, C.T = l;
        }
      }
      Gt = 3;
    }
  }
  function Td() {
    if (Gt === 4 || Gt === 3) {
      Gt = 0, sm();
      var t = Cl, e = qa, l = ol, a = rd;
      (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0 ? Gt = 5 : (Gt = 0, qa = Cl = null, jd(t, t.pendingLanes));
      var n = t.pendingLanes;
      if (n === 0 && (Ml = null), qi(l), e = e.stateNode, re && typeof re.onCommitFiberRoot == "function")
        try {
          re.onCommitFiberRoot(
            $a,
            e,
            void 0,
            (e.current.flags & 128) === 128
          );
        } catch {
        }
      if (a !== null) {
        e = C.T, n = w.p, w.p = 2, C.T = null;
        try {
          for (var u = t.onRecoverableError, c = 0; c < a.length; c++) {
            var o = a[c];
            u(o.value, {
              componentStack: o.stack
            });
          }
        } finally {
          C.T = e, w.p = n;
        }
      }
      (ol & 3) !== 0 && $u(), Ke(t), n = t.pendingLanes, (l & 261930) !== 0 && (n & 42) !== 0 ? t === gs ? Mn++ : (Mn = 0, gs = t) : Mn = 0, Cn(0);
    }
  }
  function jd(t, e) {
    (t.pooledCacheLanes &= e) === 0 && (e = t.pooledCache, e != null && (t.pooledCache = null, dn(e)));
  }
  function $u() {
    return _d(), Ed(), Td(), zd();
  }
  function zd() {
    if (Gt !== 5) return !1;
    var t = Cl, e = ys;
    ys = 0;
    var l = qi(ol), a = C.T, n = w.p;
    try {
      w.p = 32 > l ? 32 : l, C.T = null, l = ps, ps = null;
      var u = Cl, c = ol;
      if (Gt = 0, qa = Cl = null, ol = 0, (dt & 6) !== 0) throw Error(s(331));
      var o = dt;
      if (dt |= 4, cd(u.current), nd(
        u,
        u.current,
        c,
        l
      ), dt = o, Cn(0, !1), re && typeof re.onPostCommitFiberRoot == "function")
        try {
          re.onPostCommitFiberRoot($a, u);
        } catch {
        }
      return !0;
    } finally {
      w.p = n, C.T = a, jd(t, e);
    }
  }
  function Ad(t, e, l) {
    e = je(l, e), e = Wc(t.stateNode, e, 2), t = jl(t, e, 2), t !== null && (Fa(t, 2), Ke(t));
  }
  function vt(t, e, l) {
    if (t.tag === 3)
      Ad(t, t, l);
    else
      for (; e !== null; ) {
        if (e.tag === 3) {
          Ad(
            e,
            t,
            l
          );
          break;
        } else if (e.tag === 1) {
          var a = e.stateNode;
          if (typeof e.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (Ml === null || !Ml.has(a))) {
            t = je(l, t), l = Ro(2), a = jl(e, l, 2), a !== null && (No(
              l,
              a,
              e,
              t
            ), Fa(a, 2), Ke(a));
            break;
          }
        }
        e = e.return;
      }
  }
  function xs(t, e, l) {
    var a = t.pingCache;
    if (a === null) {
      a = t.pingCache = new Uv();
      var n = /* @__PURE__ */ new Set();
      a.set(e, n);
    } else
      n = a.get(e), n === void 0 && (n = /* @__PURE__ */ new Set(), a.set(e, n));
    n.has(l) || (hs = !0, n.add(l), t = Yv.bind(null, t, e, l), e.then(t, t));
  }
  function Yv(t, e, l) {
    var a = t.pingCache;
    a !== null && a.delete(e), t.pingedLanes |= t.suspendedLanes & l, t.warmLanes &= ~l, _t === t && (ct & l) === l && (Nt === 4 || Nt === 3 && (ct & 62914560) === ct && 300 > fe() - Qu ? (dt & 2) === 0 && Ya(t, 0) : ms |= l, La === ct && (La = 0)), Ke(t);
  }
  function Rd(t, e) {
    e === 0 && (e = xf()), t = Jl(t, e), t !== null && (Fa(t, e), Ke(t));
  }
  function wv(t) {
    var e = t.memoizedState, l = 0;
    e !== null && (l = e.retryLane), Rd(t, l);
  }
  function Gv(t, e) {
    var l = 0;
    switch (t.tag) {
      case 31:
      case 13:
        var a = t.stateNode, n = t.memoizedState;
        n !== null && (l = n.retryLane);
        break;
      case 19:
        a = t.stateNode;
        break;
      case 22:
        a = t.stateNode._retryCache;
        break;
      default:
        throw Error(s(314));
    }
    a !== null && a.delete(e), Rd(t, l);
  }
  function Xv(t, e) {
    return Ui(t, e);
  }
  var Wu = null, Ga = null, _s = !1, Fu = !1, Es = !1, Ul = 0;
  function Ke(t) {
    t !== Ga && t.next === null && (Ga === null ? Wu = Ga = t : Ga = Ga.next = t), Fu = !0, _s || (_s = !0, Zv());
  }
  function Cn(t, e) {
    if (!Es && Fu) {
      Es = !0;
      do
        for (var l = !1, a = Wu; a !== null; ) {
          if (t !== 0) {
            var n = a.pendingLanes;
            if (n === 0) var u = 0;
            else {
              var c = a.suspendedLanes, o = a.pingedLanes;
              u = (1 << 31 - oe(42 | t) + 1) - 1, u &= n & ~(c & ~o), u = u & 201326741 ? u & 201326741 | 1 : u ? u | 2 : 0;
            }
            u !== 0 && (l = !0, Cd(a, u));
          } else
            u = ct, u = eu(
              a,
              a === _t ? u : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (u & 3) === 0 || Wa(a, u) || (l = !0, Cd(a, u));
          a = a.next;
        }
      while (l);
      Es = !1;
    }
  }
  function Qv() {
    Nd();
  }
  function Nd() {
    Fu = _s = !1;
    var t = 0;
    Ul !== 0 && ty() && (t = Ul);
    for (var e = fe(), l = null, a = Wu; a !== null; ) {
      var n = a.next, u = Od(a, e);
      u === 0 ? (a.next = null, l === null ? Wu = n : l.next = n, n === null && (Ga = l)) : (l = a, (t !== 0 || (u & 3) !== 0) && (Fu = !0)), a = n;
    }
    Gt !== 0 && Gt !== 5 || Cn(t), Ul !== 0 && (Ul = 0);
  }
  function Od(t, e) {
    for (var l = t.suspendedLanes, a = t.pingedLanes, n = t.expirationTimes, u = t.pendingLanes & -62914561; 0 < u; ) {
      var c = 31 - oe(u), o = 1 << c, y = n[c];
      y === -1 ? ((o & l) === 0 || (o & a) !== 0) && (n[c] = ym(o, e)) : y <= e && (t.expiredLanes |= o), u &= ~o;
    }
    if (e = _t, l = ct, l = eu(
      t,
      t === e ? l : 0,
      t.cancelPendingCommit !== null || t.timeoutHandle !== -1
    ), a = t.callbackNode, l === 0 || t === e && (mt === 2 || mt === 9) || t.cancelPendingCommit !== null)
      return a !== null && a !== null && Hi(a), t.callbackNode = null, t.callbackPriority = 0;
    if ((l & 3) === 0 || Wa(t, l)) {
      if (e = l & -l, e === t.callbackPriority) return e;
      switch (a !== null && Hi(a), qi(l)) {
        case 2:
        case 8:
          l = bf;
          break;
        case 32:
          l = Fn;
          break;
        case 268435456:
          l = Sf;
          break;
        default:
          l = Fn;
      }
      return a = Md.bind(null, t), l = Ui(l, a), t.callbackPriority = e, t.callbackNode = l, e;
    }
    return a !== null && a !== null && Hi(a), t.callbackPriority = 2, t.callbackNode = null, 2;
  }
  function Md(t, e) {
    if (Gt !== 0 && Gt !== 5)
      return t.callbackNode = null, t.callbackPriority = 0, null;
    var l = t.callbackNode;
    if ($u() && t.callbackNode !== l)
      return null;
    var a = ct;
    return a = eu(
      t,
      t === _t ? a : 0,
      t.cancelPendingCommit !== null || t.timeoutHandle !== -1
    ), a === 0 ? null : (dd(t, a, e), Od(t, fe()), t.callbackNode != null && t.callbackNode === l ? Md.bind(null, t) : null);
  }
  function Cd(t, e) {
    if ($u()) return null;
    dd(t, e, !0);
  }
  function Zv() {
    ly(function() {
      (dt & 6) !== 0 ? Ui(
        gf,
        Qv
      ) : Nd();
    });
  }
  function Ts() {
    if (Ul === 0) {
      var t = za;
      t === 0 && (t = Pn, Pn <<= 1, (Pn & 261888) === 0 && (Pn = 256)), Ul = t;
    }
    return Ul;
  }
  function Dd(t) {
    return t == null || typeof t == "symbol" || typeof t == "boolean" ? null : typeof t == "function" ? t : uu("" + t);
  }
  function Ud(t, e) {
    var l = e.ownerDocument.createElement("input");
    return l.name = e.name, l.value = e.value, t.id && l.setAttribute("form", t.id), e.parentNode.insertBefore(l, e), t = new FormData(t), l.parentNode.removeChild(l), t;
  }
  function Vv(t, e, l, a, n) {
    if (e === "submit" && l && l.stateNode === n) {
      var u = Dd(
        (n[le] || null).action
      ), c = a.submitter;
      c && (e = (e = c[le] || null) ? Dd(e.formAction) : c.getAttribute("formAction"), e !== null && (u = e, c = null));
      var o = new fu(
        "action",
        "action",
        null,
        a,
        n
      );
      t.push({
        event: o,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (Ul !== 0) {
                  var y = c ? Ud(n, c) : new FormData(n);
                  Zc(
                    l,
                    {
                      pending: !0,
                      data: y,
                      method: n.method,
                      action: u
                    },
                    null,
                    y
                  );
                }
              } else
                typeof u == "function" && (o.preventDefault(), y = c ? Ud(n, c) : new FormData(n), Zc(
                  l,
                  {
                    pending: !0,
                    data: y,
                    method: n.method,
                    action: u
                  },
                  u,
                  y
                ));
            },
            currentTarget: n
          }
        ]
      });
    }
  }
  for (var js = 0; js < cc.length; js++) {
    var zs = cc[js], Kv = zs.toLowerCase(), Jv = zs[0].toUpperCase() + zs.slice(1);
    Be(
      Kv,
      "on" + Jv
    );
  }
  Be(rr, "onAnimationEnd"), Be(or, "onAnimationIteration"), Be(dr, "onAnimationStart"), Be("dblclick", "onDoubleClick"), Be("focusin", "onFocus"), Be("focusout", "onBlur"), Be(fv, "onTransitionRun"), Be(rv, "onTransitionStart"), Be(ov, "onTransitionCancel"), Be(hr, "onTransitionEnd"), da("onMouseEnter", ["mouseout", "mouseover"]), da("onMouseLeave", ["mouseout", "mouseover"]), da("onPointerEnter", ["pointerout", "pointerover"]), da("onPointerLeave", ["pointerout", "pointerover"]), Ql(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), Ql(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), Ql("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), Ql(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), Ql(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), Ql(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var Dn = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), kv = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Dn)
  );
  function Hd(t, e) {
    e = (e & 4) !== 0;
    for (var l = 0; l < t.length; l++) {
      var a = t[l], n = a.event;
      a = a.listeners;
      t: {
        var u = void 0;
        if (e)
          for (var c = a.length - 1; 0 <= c; c--) {
            var o = a[c], y = o.instance, j = o.currentTarget;
            if (o = o.listener, y !== u && n.isPropagationStopped())
              break t;
            u = o, n.currentTarget = j;
            try {
              u(n);
            } catch (M) {
              du(M);
            }
            n.currentTarget = null, u = y;
          }
        else
          for (c = 0; c < a.length; c++) {
            if (o = a[c], y = o.instance, j = o.currentTarget, o = o.listener, y !== u && n.isPropagationStopped())
              break t;
            u = o, n.currentTarget = j;
            try {
              u(n);
            } catch (M) {
              du(M);
            }
            n.currentTarget = null, u = y;
          }
      }
    }
  }
  function ut(t, e) {
    var l = e[Yi];
    l === void 0 && (l = e[Yi] = /* @__PURE__ */ new Set());
    var a = t + "__bubble";
    l.has(a) || (Bd(e, t, 2, !1), l.add(a));
  }
  function As(t, e, l) {
    var a = 0;
    e && (a |= 4), Bd(
      l,
      t,
      a,
      e
    );
  }
  var Pu = "_reactListening" + Math.random().toString(36).slice(2);
  function Rs(t) {
    if (!t[Pu]) {
      t[Pu] = !0, Rf.forEach(function(l) {
        l !== "selectionchange" && (kv.has(l) || As(l, !1, t), As(l, !0, t));
      });
      var e = t.nodeType === 9 ? t : t.ownerDocument;
      e === null || e[Pu] || (e[Pu] = !0, As("selectionchange", !1, e));
    }
  }
  function Bd(t, e, l, a) {
    switch (oh(e)) {
      case 2:
        var n = _y;
        break;
      case 8:
        n = Ey;
        break;
      default:
        n = Qs;
    }
    l = n.bind(
      null,
      e,
      l,
      t
    ), n = void 0, !ki || e !== "touchstart" && e !== "touchmove" && e !== "wheel" || (n = !0), a ? n !== void 0 ? t.addEventListener(e, l, {
      capture: !0,
      passive: n
    }) : t.addEventListener(e, l, !0) : n !== void 0 ? t.addEventListener(e, l, {
      passive: n
    }) : t.addEventListener(e, l, !1);
  }
  function Ns(t, e, l, a, n) {
    var u = a;
    if ((e & 1) === 0 && (e & 2) === 0 && a !== null)
      t: for (; ; ) {
        if (a === null) return;
        var c = a.tag;
        if (c === 3 || c === 4) {
          var o = a.stateNode.containerInfo;
          if (o === n) break;
          if (c === 4)
            for (c = a.return; c !== null; ) {
              var y = c.tag;
              if ((y === 3 || y === 4) && c.stateNode.containerInfo === n)
                return;
              c = c.return;
            }
          for (; o !== null; ) {
            if (c = fa(o), c === null) return;
            if (y = c.tag, y === 5 || y === 6 || y === 26 || y === 27) {
              a = u = c;
              continue t;
            }
            o = o.parentNode;
          }
        }
        a = a.return;
      }
    wf(function() {
      var j = u, M = Ki(l), U = [];
      t: {
        var R = mr.get(t);
        if (R !== void 0) {
          var O = fu, Q = t;
          switch (t) {
            case "keypress":
              if (cu(l) === 0) break t;
            case "keydown":
            case "keyup":
              O = Gm;
              break;
            case "focusin":
              Q = "focus", O = Pi;
              break;
            case "focusout":
              Q = "blur", O = Pi;
              break;
            case "beforeblur":
            case "afterblur":
              O = Pi;
              break;
            case "click":
              if (l.button === 2) break t;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              O = Qf;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              O = Nm;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              O = Zm;
              break;
            case rr:
            case or:
            case dr:
              O = Cm;
              break;
            case hr:
              O = Km;
              break;
            case "scroll":
            case "scrollend":
              O = Am;
              break;
            case "wheel":
              O = km;
              break;
            case "copy":
            case "cut":
            case "paste":
              O = Um;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              O = Vf;
              break;
            case "toggle":
            case "beforetoggle":
              O = Wm;
          }
          var $ = (e & 4) !== 0, bt = !$ && (t === "scroll" || t === "scrollend"), _ = $ ? R !== null ? R + "Capture" : null : R;
          $ = [];
          for (var b = j, T; b !== null; ) {
            var D = b;
            if (T = D.stateNode, D = D.tag, D !== 5 && D !== 26 && D !== 27 || T === null || _ === null || (D = tn(b, _), D != null && $.push(
              Un(b, D, T)
            )), bt) break;
            b = b.return;
          }
          0 < $.length && (R = new O(
            R,
            Q,
            null,
            l,
            M
          ), U.push({ event: R, listeners: $ }));
        }
      }
      if ((e & 7) === 0) {
        t: {
          if (R = t === "mouseover" || t === "pointerover", O = t === "mouseout" || t === "pointerout", R && l !== Vi && (Q = l.relatedTarget || l.fromElement) && (fa(Q) || Q[sa]))
            break t;
          if ((O || R) && (R = M.window === M ? M : (R = M.ownerDocument) ? R.defaultView || R.parentWindow : window, O ? (Q = l.relatedTarget || l.toElement, O = j, Q = Q ? fa(Q) : null, Q !== null && (bt = m(Q), $ = Q.tag, Q !== bt || $ !== 5 && $ !== 27 && $ !== 6) && (Q = null)) : (O = null, Q = j), O !== Q)) {
            if ($ = Qf, D = "onMouseLeave", _ = "onMouseEnter", b = "mouse", (t === "pointerout" || t === "pointerover") && ($ = Vf, D = "onPointerLeave", _ = "onPointerEnter", b = "pointer"), bt = O == null ? R : Ia(O), T = Q == null ? R : Ia(Q), R = new $(
              D,
              b + "leave",
              O,
              l,
              M
            ), R.target = bt, R.relatedTarget = T, D = null, fa(M) === j && ($ = new $(
              _,
              b + "enter",
              Q,
              l,
              M
            ), $.target = T, $.relatedTarget = bt, D = $), bt = D, O && Q)
              e: {
                for ($ = $v, _ = O, b = Q, T = 0, D = _; D; D = $(D))
                  T++;
                D = 0;
                for (var J = b; J; J = $(J))
                  D++;
                for (; 0 < T - D; )
                  _ = $(_), T--;
                for (; 0 < D - T; )
                  b = $(b), D--;
                for (; T--; ) {
                  if (_ === b || b !== null && _ === b.alternate) {
                    $ = _;
                    break e;
                  }
                  _ = $(_), b = $(b);
                }
                $ = null;
              }
            else $ = null;
            O !== null && Ld(
              U,
              R,
              O,
              $,
              !1
            ), Q !== null && bt !== null && Ld(
              U,
              bt,
              Q,
              $,
              !0
            );
          }
        }
        t: {
          if (R = j ? Ia(j) : window, O = R.nodeName && R.nodeName.toLowerCase(), O === "select" || O === "input" && R.type === "file")
            var rt = If;
          else if (Ff(R))
            if (tr)
              rt = iv;
            else {
              rt = nv;
              var K = av;
            }
          else
            O = R.nodeName, !O || O.toLowerCase() !== "input" || R.type !== "checkbox" && R.type !== "radio" ? j && Zi(j.elementType) && (rt = If) : rt = uv;
          if (rt && (rt = rt(t, j))) {
            Pf(
              U,
              rt,
              l,
              M
            );
            break t;
          }
          K && K(t, R, j), t === "focusout" && j && R.type === "number" && j.memoizedProps.value != null && Qi(R, "number", R.value);
        }
        switch (K = j ? Ia(j) : window, t) {
          case "focusin":
            (Ff(K) || K.contentEditable === "true") && (ga = K, nc = j, fn = null);
            break;
          case "focusout":
            fn = nc = ga = null;
            break;
          case "mousedown":
            uc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            uc = !1, sr(U, l, M);
            break;
          case "selectionchange":
            if (sv) break;
          case "keydown":
          case "keyup":
            sr(U, l, M);
        }
        var et;
        if (tc)
          t: {
            switch (t) {
              case "compositionstart":
                var st = "onCompositionStart";
                break t;
              case "compositionend":
                st = "onCompositionEnd";
                break t;
              case "compositionupdate":
                st = "onCompositionUpdate";
                break t;
            }
            st = void 0;
          }
        else
          pa ? $f(t, l) && (st = "onCompositionEnd") : t === "keydown" && l.keyCode === 229 && (st = "onCompositionStart");
        st && (Kf && l.locale !== "ko" && (pa || st !== "onCompositionStart" ? st === "onCompositionEnd" && pa && (et = Gf()) : (gl = M, $i = "value" in gl ? gl.value : gl.textContent, pa = !0)), K = Iu(j, st), 0 < K.length && (st = new Zf(
          st,
          t,
          null,
          l,
          M
        ), U.push({ event: st, listeners: K }), et ? st.data = et : (et = Wf(l), et !== null && (st.data = et)))), (et = Pm ? Im(t, l) : tv(t, l)) && (st = Iu(j, "onBeforeInput"), 0 < st.length && (K = new Zf(
          "onBeforeInput",
          "beforeinput",
          null,
          l,
          M
        ), U.push({
          event: K,
          listeners: st
        }), K.data = et)), Vv(
          U,
          t,
          j,
          l,
          M
        );
      }
      Hd(U, e);
    });
  }
  function Un(t, e, l) {
    return {
      instance: t,
      listener: e,
      currentTarget: l
    };
  }
  function Iu(t, e) {
    for (var l = e + "Capture", a = []; t !== null; ) {
      var n = t, u = n.stateNode;
      if (n = n.tag, n !== 5 && n !== 26 && n !== 27 || u === null || (n = tn(t, l), n != null && a.unshift(
        Un(t, n, u)
      ), n = tn(t, e), n != null && a.push(
        Un(t, n, u)
      )), t.tag === 3) return a;
      t = t.return;
    }
    return [];
  }
  function $v(t) {
    if (t === null) return null;
    do
      t = t.return;
    while (t && t.tag !== 5 && t.tag !== 27);
    return t || null;
  }
  function Ld(t, e, l, a, n) {
    for (var u = e._reactName, c = []; l !== null && l !== a; ) {
      var o = l, y = o.alternate, j = o.stateNode;
      if (o = o.tag, y !== null && y === a) break;
      o !== 5 && o !== 26 && o !== 27 || j === null || (y = j, n ? (j = tn(l, u), j != null && c.unshift(
        Un(l, j, y)
      )) : n || (j = tn(l, u), j != null && c.push(
        Un(l, j, y)
      ))), l = l.return;
    }
    c.length !== 0 && t.push({ event: e, listeners: c });
  }
  var Wv = /\r\n?/g, Fv = /\u0000|\uFFFD/g;
  function qd(t) {
    return (typeof t == "string" ? t : "" + t).replace(Wv, `
`).replace(Fv, "");
  }
  function Yd(t, e) {
    return e = qd(e), qd(t) === e;
  }
  function gt(t, e, l, a, n, u) {
    switch (l) {
      case "children":
        typeof a == "string" ? e === "body" || e === "textarea" && a === "" || ma(t, a) : (typeof a == "number" || typeof a == "bigint") && e !== "body" && ma(t, "" + a);
        break;
      case "className":
        au(t, "class", a);
        break;
      case "tabIndex":
        au(t, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        au(t, l, a);
        break;
      case "style":
        qf(t, a, u);
        break;
      case "data":
        if (e !== "object") {
          au(t, "data", a);
          break;
        }
      case "src":
      case "href":
        if (a === "" && (e !== "a" || l !== "href")) {
          t.removeAttribute(l);
          break;
        }
        if (a == null || typeof a == "function" || typeof a == "symbol" || typeof a == "boolean") {
          t.removeAttribute(l);
          break;
        }
        a = uu("" + a), t.setAttribute(l, a);
        break;
      case "action":
      case "formAction":
        if (typeof a == "function") {
          t.setAttribute(
            l,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof u == "function" && (l === "formAction" ? (e !== "input" && gt(t, e, "name", n.name, n, null), gt(
            t,
            e,
            "formEncType",
            n.formEncType,
            n,
            null
          ), gt(
            t,
            e,
            "formMethod",
            n.formMethod,
            n,
            null
          ), gt(
            t,
            e,
            "formTarget",
            n.formTarget,
            n,
            null
          )) : (gt(t, e, "encType", n.encType, n, null), gt(t, e, "method", n.method, n, null), gt(t, e, "target", n.target, n, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          t.removeAttribute(l);
          break;
        }
        a = uu("" + a), t.setAttribute(l, a);
        break;
      case "onClick":
        a != null && (t.onclick = We);
        break;
      case "onScroll":
        a != null && ut("scroll", t);
        break;
      case "onScrollEnd":
        a != null && ut("scrollend", t);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(s(61));
          if (l = a.__html, l != null) {
            if (n.children != null) throw Error(s(60));
            t.innerHTML = l;
          }
        }
        break;
      case "multiple":
        t.multiple = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "muted":
        t.muted = a && typeof a != "function" && typeof a != "symbol";
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
          t.removeAttribute("xlink:href");
          break;
        }
        l = uu("" + a), t.setAttributeNS(
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
        a != null && typeof a != "function" && typeof a != "symbol" ? t.setAttribute(l, "" + a) : t.removeAttribute(l);
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
        a && typeof a != "function" && typeof a != "symbol" ? t.setAttribute(l, "") : t.removeAttribute(l);
        break;
      case "capture":
      case "download":
        a === !0 ? t.setAttribute(l, "") : a !== !1 && a != null && typeof a != "function" && typeof a != "symbol" ? t.setAttribute(l, a) : t.removeAttribute(l);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        a != null && typeof a != "function" && typeof a != "symbol" && !isNaN(a) && 1 <= a ? t.setAttribute(l, a) : t.removeAttribute(l);
        break;
      case "rowSpan":
      case "start":
        a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a) ? t.removeAttribute(l) : t.setAttribute(l, a);
        break;
      case "popover":
        ut("beforetoggle", t), ut("toggle", t), lu(t, "popover", a);
        break;
      case "xlinkActuate":
        $e(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        $e(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        $e(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        $e(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        $e(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        $e(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        $e(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        $e(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        $e(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        lu(t, "is", a);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < l.length) || l[0] !== "o" && l[0] !== "O" || l[1] !== "n" && l[1] !== "N") && (l = jm.get(l) || l, lu(t, l, a));
    }
  }
  function Os(t, e, l, a, n, u) {
    switch (l) {
      case "style":
        qf(t, a, u);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(s(61));
          if (l = a.__html, l != null) {
            if (n.children != null) throw Error(s(60));
            t.innerHTML = l;
          }
        }
        break;
      case "children":
        typeof a == "string" ? ma(t, a) : (typeof a == "number" || typeof a == "bigint") && ma(t, "" + a);
        break;
      case "onScroll":
        a != null && ut("scroll", t);
        break;
      case "onScrollEnd":
        a != null && ut("scrollend", t);
        break;
      case "onClick":
        a != null && (t.onclick = We);
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
        if (!Nf.hasOwnProperty(l))
          t: {
            if (l[0] === "o" && l[1] === "n" && (n = l.endsWith("Capture"), e = l.slice(2, n ? l.length - 7 : void 0), u = t[le] || null, u = u != null ? u[l] : null, typeof u == "function" && t.removeEventListener(e, u, n), typeof a == "function")) {
              typeof u != "function" && u !== null && (l in t ? t[l] = null : t.hasAttribute(l) && t.removeAttribute(l)), t.addEventListener(e, a, n);
              break t;
            }
            l in t ? t[l] = a : a === !0 ? t.setAttribute(l, "") : lu(t, l, a);
          }
    }
  }
  function kt(t, e, l) {
    switch (e) {
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
        ut("error", t), ut("load", t);
        var a = !1, n = !1, u;
        for (u in l)
          if (l.hasOwnProperty(u)) {
            var c = l[u];
            if (c != null)
              switch (u) {
                case "src":
                  a = !0;
                  break;
                case "srcSet":
                  n = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(s(137, e));
                default:
                  gt(t, e, u, c, l, null);
              }
          }
        n && gt(t, e, "srcSet", l.srcSet, l, null), a && gt(t, e, "src", l.src, l, null);
        return;
      case "input":
        ut("invalid", t);
        var o = u = c = n = null, y = null, j = null;
        for (a in l)
          if (l.hasOwnProperty(a)) {
            var M = l[a];
            if (M != null)
              switch (a) {
                case "name":
                  n = M;
                  break;
                case "type":
                  c = M;
                  break;
                case "checked":
                  y = M;
                  break;
                case "defaultChecked":
                  j = M;
                  break;
                case "value":
                  u = M;
                  break;
                case "defaultValue":
                  o = M;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (M != null)
                    throw Error(s(137, e));
                  break;
                default:
                  gt(t, e, a, M, l, null);
              }
          }
        Uf(
          t,
          u,
          o,
          y,
          j,
          c,
          n,
          !1
        );
        return;
      case "select":
        ut("invalid", t), a = c = u = null;
        for (n in l)
          if (l.hasOwnProperty(n) && (o = l[n], o != null))
            switch (n) {
              case "value":
                u = o;
                break;
              case "defaultValue":
                c = o;
                break;
              case "multiple":
                a = o;
              default:
                gt(t, e, n, o, l, null);
            }
        e = u, l = c, t.multiple = !!a, e != null ? ha(t, !!a, e, !1) : l != null && ha(t, !!a, l, !0);
        return;
      case "textarea":
        ut("invalid", t), u = n = a = null;
        for (c in l)
          if (l.hasOwnProperty(c) && (o = l[c], o != null))
            switch (c) {
              case "value":
                a = o;
                break;
              case "defaultValue":
                n = o;
                break;
              case "children":
                u = o;
                break;
              case "dangerouslySetInnerHTML":
                if (o != null) throw Error(s(91));
                break;
              default:
                gt(t, e, c, o, l, null);
            }
        Bf(t, a, n, u);
        return;
      case "option":
        for (y in l)
          if (l.hasOwnProperty(y) && (a = l[y], a != null))
            switch (y) {
              case "selected":
                t.selected = a && typeof a != "function" && typeof a != "symbol";
                break;
              default:
                gt(t, e, y, a, l, null);
            }
        return;
      case "dialog":
        ut("beforetoggle", t), ut("toggle", t), ut("cancel", t), ut("close", t);
        break;
      case "iframe":
      case "object":
        ut("load", t);
        break;
      case "video":
      case "audio":
        for (a = 0; a < Dn.length; a++)
          ut(Dn[a], t);
        break;
      case "image":
        ut("error", t), ut("load", t);
        break;
      case "details":
        ut("toggle", t);
        break;
      case "embed":
      case "source":
      case "link":
        ut("error", t), ut("load", t);
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
        for (j in l)
          if (l.hasOwnProperty(j) && (a = l[j], a != null))
            switch (j) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(s(137, e));
              default:
                gt(t, e, j, a, l, null);
            }
        return;
      default:
        if (Zi(e)) {
          for (M in l)
            l.hasOwnProperty(M) && (a = l[M], a !== void 0 && Os(
              t,
              e,
              M,
              a,
              l,
              void 0
            ));
          return;
        }
    }
    for (o in l)
      l.hasOwnProperty(o) && (a = l[o], a != null && gt(t, e, o, a, l, null));
  }
  function Pv(t, e, l, a) {
    switch (e) {
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
        var n = null, u = null, c = null, o = null, y = null, j = null, M = null;
        for (O in l) {
          var U = l[O];
          if (l.hasOwnProperty(O) && U != null)
            switch (O) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                y = U;
              default:
                a.hasOwnProperty(O) || gt(t, e, O, null, a, U);
            }
        }
        for (var R in a) {
          var O = a[R];
          if (U = l[R], a.hasOwnProperty(R) && (O != null || U != null))
            switch (R) {
              case "type":
                u = O;
                break;
              case "name":
                n = O;
                break;
              case "checked":
                j = O;
                break;
              case "defaultChecked":
                M = O;
                break;
              case "value":
                c = O;
                break;
              case "defaultValue":
                o = O;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (O != null)
                  throw Error(s(137, e));
                break;
              default:
                O !== U && gt(
                  t,
                  e,
                  R,
                  O,
                  a,
                  U
                );
            }
        }
        Xi(
          t,
          c,
          o,
          y,
          j,
          M,
          u,
          n
        );
        return;
      case "select":
        O = c = o = R = null;
        for (u in l)
          if (y = l[u], l.hasOwnProperty(u) && y != null)
            switch (u) {
              case "value":
                break;
              case "multiple":
                O = y;
              default:
                a.hasOwnProperty(u) || gt(
                  t,
                  e,
                  u,
                  null,
                  a,
                  y
                );
            }
        for (n in a)
          if (u = a[n], y = l[n], a.hasOwnProperty(n) && (u != null || y != null))
            switch (n) {
              case "value":
                R = u;
                break;
              case "defaultValue":
                o = u;
                break;
              case "multiple":
                c = u;
              default:
                u !== y && gt(
                  t,
                  e,
                  n,
                  u,
                  a,
                  y
                );
            }
        e = o, l = c, a = O, R != null ? ha(t, !!l, R, !1) : !!a != !!l && (e != null ? ha(t, !!l, e, !0) : ha(t, !!l, l ? [] : "", !1));
        return;
      case "textarea":
        O = R = null;
        for (o in l)
          if (n = l[o], l.hasOwnProperty(o) && n != null && !a.hasOwnProperty(o))
            switch (o) {
              case "value":
                break;
              case "children":
                break;
              default:
                gt(t, e, o, null, a, n);
            }
        for (c in a)
          if (n = a[c], u = l[c], a.hasOwnProperty(c) && (n != null || u != null))
            switch (c) {
              case "value":
                R = n;
                break;
              case "defaultValue":
                O = n;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (n != null) throw Error(s(91));
                break;
              default:
                n !== u && gt(t, e, c, n, a, u);
            }
        Hf(t, R, O);
        return;
      case "option":
        for (var Q in l)
          if (R = l[Q], l.hasOwnProperty(Q) && R != null && !a.hasOwnProperty(Q))
            switch (Q) {
              case "selected":
                t.selected = !1;
                break;
              default:
                gt(
                  t,
                  e,
                  Q,
                  null,
                  a,
                  R
                );
            }
        for (y in a)
          if (R = a[y], O = l[y], a.hasOwnProperty(y) && R !== O && (R != null || O != null))
            switch (y) {
              case "selected":
                t.selected = R && typeof R != "function" && typeof R != "symbol";
                break;
              default:
                gt(
                  t,
                  e,
                  y,
                  R,
                  a,
                  O
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
        for (var $ in l)
          R = l[$], l.hasOwnProperty($) && R != null && !a.hasOwnProperty($) && gt(t, e, $, null, a, R);
        for (j in a)
          if (R = a[j], O = l[j], a.hasOwnProperty(j) && R !== O && (R != null || O != null))
            switch (j) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (R != null)
                  throw Error(s(137, e));
                break;
              default:
                gt(
                  t,
                  e,
                  j,
                  R,
                  a,
                  O
                );
            }
        return;
      default:
        if (Zi(e)) {
          for (var bt in l)
            R = l[bt], l.hasOwnProperty(bt) && R !== void 0 && !a.hasOwnProperty(bt) && Os(
              t,
              e,
              bt,
              void 0,
              a,
              R
            );
          for (M in a)
            R = a[M], O = l[M], !a.hasOwnProperty(M) || R === O || R === void 0 && O === void 0 || Os(
              t,
              e,
              M,
              R,
              a,
              O
            );
          return;
        }
    }
    for (var _ in l)
      R = l[_], l.hasOwnProperty(_) && R != null && !a.hasOwnProperty(_) && gt(t, e, _, null, a, R);
    for (U in a)
      R = a[U], O = l[U], !a.hasOwnProperty(U) || R === O || R == null && O == null || gt(t, e, U, R, a, O);
  }
  function wd(t) {
    switch (t) {
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
  function Iv() {
    if (typeof performance.getEntriesByType == "function") {
      for (var t = 0, e = 0, l = performance.getEntriesByType("resource"), a = 0; a < l.length; a++) {
        var n = l[a], u = n.transferSize, c = n.initiatorType, o = n.duration;
        if (u && o && wd(c)) {
          for (c = 0, o = n.responseEnd, a += 1; a < l.length; a++) {
            var y = l[a], j = y.startTime;
            if (j > o) break;
            var M = y.transferSize, U = y.initiatorType;
            M && wd(U) && (y = y.responseEnd, c += M * (y < o ? 1 : (o - j) / (y - j)));
          }
          if (--a, e += 8 * (u + c) / (n.duration / 1e3), t++, 10 < t) break;
        }
      }
      if (0 < t) return e / t / 1e6;
    }
    return navigator.connection && (t = navigator.connection.downlink, typeof t == "number") ? t : 5;
  }
  var Ms = null, Cs = null;
  function ti(t) {
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  function Gd(t) {
    switch (t) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Xd(t, e) {
    if (t === 0)
      switch (e) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return t === 1 && e === "foreignObject" ? 0 : t;
  }
  function Ds(t, e) {
    return t === "textarea" || t === "noscript" || typeof e.children == "string" || typeof e.children == "number" || typeof e.children == "bigint" || typeof e.dangerouslySetInnerHTML == "object" && e.dangerouslySetInnerHTML !== null && e.dangerouslySetInnerHTML.__html != null;
  }
  var Us = null;
  function ty() {
    var t = window.event;
    return t && t.type === "popstate" ? t === Us ? !1 : (Us = t, !0) : (Us = null, !1);
  }
  var Qd = typeof setTimeout == "function" ? setTimeout : void 0, ey = typeof clearTimeout == "function" ? clearTimeout : void 0, Zd = typeof Promise == "function" ? Promise : void 0, ly = typeof queueMicrotask == "function" ? queueMicrotask : typeof Zd < "u" ? function(t) {
    return Zd.resolve(null).then(t).catch(ay);
  } : Qd;
  function ay(t) {
    setTimeout(function() {
      throw t;
    });
  }
  function Hl(t) {
    return t === "head";
  }
  function Vd(t, e) {
    var l = e, a = 0;
    do {
      var n = l.nextSibling;
      if (t.removeChild(l), n && n.nodeType === 8)
        if (l = n.data, l === "/$" || l === "/&") {
          if (a === 0) {
            t.removeChild(n), Va(e);
            return;
          }
          a--;
        } else if (l === "$" || l === "$?" || l === "$~" || l === "$!" || l === "&")
          a++;
        else if (l === "html")
          Hn(t.ownerDocument.documentElement);
        else if (l === "head") {
          l = t.ownerDocument.head, Hn(l);
          for (var u = l.firstChild; u; ) {
            var c = u.nextSibling, o = u.nodeName;
            u[Pa] || o === "SCRIPT" || o === "STYLE" || o === "LINK" && u.rel.toLowerCase() === "stylesheet" || l.removeChild(u), u = c;
          }
        } else
          l === "body" && Hn(t.ownerDocument.body);
      l = n;
    } while (l);
    Va(e);
  }
  function Kd(t, e) {
    var l = t;
    t = 0;
    do {
      var a = l.nextSibling;
      if (l.nodeType === 1 ? e ? (l._stashedDisplay = l.style.display, l.style.display = "none") : (l.style.display = l._stashedDisplay || "", l.getAttribute("style") === "" && l.removeAttribute("style")) : l.nodeType === 3 && (e ? (l._stashedText = l.nodeValue, l.nodeValue = "") : l.nodeValue = l._stashedText || ""), a && a.nodeType === 8)
        if (l = a.data, l === "/$") {
          if (t === 0) break;
          t--;
        } else
          l !== "$" && l !== "$?" && l !== "$~" && l !== "$!" || t++;
      l = a;
    } while (l);
  }
  function Hs(t) {
    var e = t.firstChild;
    for (e && e.nodeType === 10 && (e = e.nextSibling); e; ) {
      var l = e;
      switch (e = e.nextSibling, l.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Hs(l), wi(l);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (l.rel.toLowerCase() === "stylesheet") continue;
      }
      t.removeChild(l);
    }
  }
  function ny(t, e, l, a) {
    for (; t.nodeType === 1; ) {
      var n = l;
      if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
        if (!a && (t.nodeName !== "INPUT" || t.type !== "hidden"))
          break;
      } else if (a) {
        if (!t[Pa])
          switch (e) {
            case "meta":
              if (!t.hasAttribute("itemprop")) break;
              return t;
            case "link":
              if (u = t.getAttribute("rel"), u === "stylesheet" && t.hasAttribute("data-precedence"))
                break;
              if (u !== n.rel || t.getAttribute("href") !== (n.href == null || n.href === "" ? null : n.href) || t.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin) || t.getAttribute("title") !== (n.title == null ? null : n.title))
                break;
              return t;
            case "style":
              if (t.hasAttribute("data-precedence")) break;
              return t;
            case "script":
              if (u = t.getAttribute("src"), (u !== (n.src == null ? null : n.src) || t.getAttribute("type") !== (n.type == null ? null : n.type) || t.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin)) && u && t.hasAttribute("async") && !t.hasAttribute("itemprop"))
                break;
              return t;
            default:
              return t;
          }
      } else if (e === "input" && t.type === "hidden") {
        var u = n.name == null ? null : "" + n.name;
        if (n.type === "hidden" && t.getAttribute("name") === u)
          return t;
      } else return t;
      if (t = Oe(t.nextSibling), t === null) break;
    }
    return null;
  }
  function uy(t, e, l) {
    if (e === "") return null;
    for (; t.nodeType !== 3; )
      if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !l || (t = Oe(t.nextSibling), t === null)) return null;
    return t;
  }
  function Jd(t, e) {
    for (; t.nodeType !== 8; )
      if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !e || (t = Oe(t.nextSibling), t === null)) return null;
    return t;
  }
  function Bs(t) {
    return t.data === "$?" || t.data === "$~";
  }
  function Ls(t) {
    return t.data === "$!" || t.data === "$?" && t.ownerDocument.readyState !== "loading";
  }
  function iy(t, e) {
    var l = t.ownerDocument;
    if (t.data === "$~") t._reactRetry = e;
    else if (t.data !== "$?" || l.readyState !== "loading")
      e();
    else {
      var a = function() {
        e(), l.removeEventListener("DOMContentLoaded", a);
      };
      l.addEventListener("DOMContentLoaded", a), t._reactRetry = a;
    }
  }
  function Oe(t) {
    for (; t != null; t = t.nextSibling) {
      var e = t.nodeType;
      if (e === 1 || e === 3) break;
      if (e === 8) {
        if (e = t.data, e === "$" || e === "$!" || e === "$?" || e === "$~" || e === "&" || e === "F!" || e === "F")
          break;
        if (e === "/$" || e === "/&") return null;
      }
    }
    return t;
  }
  var qs = null;
  function kd(t) {
    t = t.nextSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var l = t.data;
        if (l === "/$" || l === "/&") {
          if (e === 0)
            return Oe(t.nextSibling);
          e--;
        } else
          l !== "$" && l !== "$!" && l !== "$?" && l !== "$~" && l !== "&" || e++;
      }
      t = t.nextSibling;
    }
    return null;
  }
  function $d(t) {
    t = t.previousSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var l = t.data;
        if (l === "$" || l === "$!" || l === "$?" || l === "$~" || l === "&") {
          if (e === 0) return t;
          e--;
        } else l !== "/$" && l !== "/&" || e++;
      }
      t = t.previousSibling;
    }
    return null;
  }
  function Wd(t, e, l) {
    switch (e = ti(l), t) {
      case "html":
        if (t = e.documentElement, !t) throw Error(s(452));
        return t;
      case "head":
        if (t = e.head, !t) throw Error(s(453));
        return t;
      case "body":
        if (t = e.body, !t) throw Error(s(454));
        return t;
      default:
        throw Error(s(451));
    }
  }
  function Hn(t) {
    for (var e = t.attributes; e.length; )
      t.removeAttributeNode(e[0]);
    wi(t);
  }
  var Me = /* @__PURE__ */ new Map(), Fd = /* @__PURE__ */ new Set();
  function ei(t) {
    return typeof t.getRootNode == "function" ? t.getRootNode() : t.nodeType === 9 ? t : t.ownerDocument;
  }
  var dl = w.d;
  w.d = {
    f: cy,
    r: sy,
    D: fy,
    C: ry,
    L: oy,
    m: dy,
    X: my,
    S: hy,
    M: vy
  };
  function cy() {
    var t = dl.f(), e = Ku();
    return t || e;
  }
  function sy(t) {
    var e = ra(t);
    e !== null && e.tag === 5 && e.type === "form" ? mo(e) : dl.r(t);
  }
  var Xa = typeof document > "u" ? null : document;
  function Pd(t, e, l) {
    var a = Xa;
    if (a && typeof e == "string" && e) {
      var n = Ee(e);
      n = 'link[rel="' + t + '"][href="' + n + '"]', typeof l == "string" && (n += '[crossorigin="' + l + '"]'), Fd.has(n) || (Fd.add(n), t = { rel: t, crossOrigin: l, href: e }, a.querySelector(n) === null && (e = a.createElement("link"), kt(e, "link", t), Xt(e), a.head.appendChild(e)));
    }
  }
  function fy(t) {
    dl.D(t), Pd("dns-prefetch", t, null);
  }
  function ry(t, e) {
    dl.C(t, e), Pd("preconnect", t, e);
  }
  function oy(t, e, l) {
    dl.L(t, e, l);
    var a = Xa;
    if (a && t && e) {
      var n = 'link[rel="preload"][as="' + Ee(e) + '"]';
      e === "image" && l && l.imageSrcSet ? (n += '[imagesrcset="' + Ee(
        l.imageSrcSet
      ) + '"]', typeof l.imageSizes == "string" && (n += '[imagesizes="' + Ee(
        l.imageSizes
      ) + '"]')) : n += '[href="' + Ee(t) + '"]';
      var u = n;
      switch (e) {
        case "style":
          u = Qa(t);
          break;
        case "script":
          u = Za(t);
      }
      Me.has(u) || (t = E(
        {
          rel: "preload",
          href: e === "image" && l && l.imageSrcSet ? void 0 : t,
          as: e
        },
        l
      ), Me.set(u, t), a.querySelector(n) !== null || e === "style" && a.querySelector(Bn(u)) || e === "script" && a.querySelector(Ln(u)) || (e = a.createElement("link"), kt(e, "link", t), Xt(e), a.head.appendChild(e)));
    }
  }
  function dy(t, e) {
    dl.m(t, e);
    var l = Xa;
    if (l && t) {
      var a = e && typeof e.as == "string" ? e.as : "script", n = 'link[rel="modulepreload"][as="' + Ee(a) + '"][href="' + Ee(t) + '"]', u = n;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          u = Za(t);
      }
      if (!Me.has(u) && (t = E({ rel: "modulepreload", href: t }, e), Me.set(u, t), l.querySelector(n) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (l.querySelector(Ln(u)))
              return;
        }
        a = l.createElement("link"), kt(a, "link", t), Xt(a), l.head.appendChild(a);
      }
    }
  }
  function hy(t, e, l) {
    dl.S(t, e, l);
    var a = Xa;
    if (a && t) {
      var n = oa(a).hoistableStyles, u = Qa(t);
      e = e || "default";
      var c = n.get(u);
      if (!c) {
        var o = { loading: 0, preload: null };
        if (c = a.querySelector(
          Bn(u)
        ))
          o.loading = 5;
        else {
          t = E(
            { rel: "stylesheet", href: t, "data-precedence": e },
            l
          ), (l = Me.get(u)) && Ys(t, l);
          var y = c = a.createElement("link");
          Xt(y), kt(y, "link", t), y._p = new Promise(function(j, M) {
            y.onload = j, y.onerror = M;
          }), y.addEventListener("load", function() {
            o.loading |= 1;
          }), y.addEventListener("error", function() {
            o.loading |= 2;
          }), o.loading |= 4, li(c, e, a);
        }
        c = {
          type: "stylesheet",
          instance: c,
          count: 1,
          state: o
        }, n.set(u, c);
      }
    }
  }
  function my(t, e) {
    dl.X(t, e);
    var l = Xa;
    if (l && t) {
      var a = oa(l).hoistableScripts, n = Za(t), u = a.get(n);
      u || (u = l.querySelector(Ln(n)), u || (t = E({ src: t, async: !0 }, e), (e = Me.get(n)) && ws(t, e), u = l.createElement("script"), Xt(u), kt(u, "link", t), l.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, a.set(n, u));
    }
  }
  function vy(t, e) {
    dl.M(t, e);
    var l = Xa;
    if (l && t) {
      var a = oa(l).hoistableScripts, n = Za(t), u = a.get(n);
      u || (u = l.querySelector(Ln(n)), u || (t = E({ src: t, async: !0, type: "module" }, e), (e = Me.get(n)) && ws(t, e), u = l.createElement("script"), Xt(u), kt(u, "link", t), l.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, a.set(n, u));
    }
  }
  function Id(t, e, l, a) {
    var n = (n = at.current) ? ei(n) : null;
    if (!n) throw Error(s(446));
    switch (t) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof l.precedence == "string" && typeof l.href == "string" ? (e = Qa(l.href), l = oa(
          n
        ).hoistableStyles, a = l.get(e), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, l.set(e, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (l.rel === "stylesheet" && typeof l.href == "string" && typeof l.precedence == "string") {
          t = Qa(l.href);
          var u = oa(
            n
          ).hoistableStyles, c = u.get(t);
          if (c || (n = n.ownerDocument || n, c = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, u.set(t, c), (u = n.querySelector(
            Bn(t)
          )) && !u._p && (c.instance = u, c.state.loading = 5), Me.has(t) || (l = {
            rel: "preload",
            as: "style",
            href: l.href,
            crossOrigin: l.crossOrigin,
            integrity: l.integrity,
            media: l.media,
            hrefLang: l.hrefLang,
            referrerPolicy: l.referrerPolicy
          }, Me.set(t, l), u || yy(
            n,
            t,
            l,
            c.state
          ))), e && a === null)
            throw Error(s(528, ""));
          return c;
        }
        if (e && a !== null)
          throw Error(s(529, ""));
        return null;
      case "script":
        return e = l.async, l = l.src, typeof l == "string" && e && typeof e != "function" && typeof e != "symbol" ? (e = Za(l), l = oa(
          n
        ).hoistableScripts, a = l.get(e), a || (a = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, l.set(e, a)), a) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(s(444, t));
    }
  }
  function Qa(t) {
    return 'href="' + Ee(t) + '"';
  }
  function Bn(t) {
    return 'link[rel="stylesheet"][' + t + "]";
  }
  function th(t) {
    return E({}, t, {
      "data-precedence": t.precedence,
      precedence: null
    });
  }
  function yy(t, e, l, a) {
    t.querySelector('link[rel="preload"][as="style"][' + e + "]") ? a.loading = 1 : (e = t.createElement("link"), a.preload = e, e.addEventListener("load", function() {
      return a.loading |= 1;
    }), e.addEventListener("error", function() {
      return a.loading |= 2;
    }), kt(e, "link", l), Xt(e), t.head.appendChild(e));
  }
  function Za(t) {
    return '[src="' + Ee(t) + '"]';
  }
  function Ln(t) {
    return "script[async]" + t;
  }
  function eh(t, e, l) {
    if (e.count++, e.instance === null)
      switch (e.type) {
        case "style":
          var a = t.querySelector(
            'style[data-href~="' + Ee(l.href) + '"]'
          );
          if (a)
            return e.instance = a, Xt(a), a;
          var n = E({}, l, {
            "data-href": l.href,
            "data-precedence": l.precedence,
            href: null,
            precedence: null
          });
          return a = (t.ownerDocument || t).createElement(
            "style"
          ), Xt(a), kt(a, "style", n), li(a, l.precedence, t), e.instance = a;
        case "stylesheet":
          n = Qa(l.href);
          var u = t.querySelector(
            Bn(n)
          );
          if (u)
            return e.state.loading |= 4, e.instance = u, Xt(u), u;
          a = th(l), (n = Me.get(n)) && Ys(a, n), u = (t.ownerDocument || t).createElement("link"), Xt(u);
          var c = u;
          return c._p = new Promise(function(o, y) {
            c.onload = o, c.onerror = y;
          }), kt(u, "link", a), e.state.loading |= 4, li(u, l.precedence, t), e.instance = u;
        case "script":
          return u = Za(l.src), (n = t.querySelector(
            Ln(u)
          )) ? (e.instance = n, Xt(n), n) : (a = l, (n = Me.get(u)) && (a = E({}, l), ws(a, n)), t = t.ownerDocument || t, n = t.createElement("script"), Xt(n), kt(n, "link", a), t.head.appendChild(n), e.instance = n);
        case "void":
          return null;
        default:
          throw Error(s(443, e.type));
      }
    else
      e.type === "stylesheet" && (e.state.loading & 4) === 0 && (a = e.instance, e.state.loading |= 4, li(a, l.precedence, t));
    return e.instance;
  }
  function li(t, e, l) {
    for (var a = l.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), n = a.length ? a[a.length - 1] : null, u = n, c = 0; c < a.length; c++) {
      var o = a[c];
      if (o.dataset.precedence === e) u = o;
      else if (u !== n) break;
    }
    u ? u.parentNode.insertBefore(t, u.nextSibling) : (e = l.nodeType === 9 ? l.head : l, e.insertBefore(t, e.firstChild));
  }
  function Ys(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.title == null && (t.title = e.title);
  }
  function ws(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.integrity == null && (t.integrity = e.integrity);
  }
  var ai = null;
  function lh(t, e, l) {
    if (ai === null) {
      var a = /* @__PURE__ */ new Map(), n = ai = /* @__PURE__ */ new Map();
      n.set(l, a);
    } else
      n = ai, a = n.get(l), a || (a = /* @__PURE__ */ new Map(), n.set(l, a));
    if (a.has(t)) return a;
    for (a.set(t, null), l = l.getElementsByTagName(t), n = 0; n < l.length; n++) {
      var u = l[n];
      if (!(u[Pa] || u[Zt] || t === "link" && u.getAttribute("rel") === "stylesheet") && u.namespaceURI !== "http://www.w3.org/2000/svg") {
        var c = u.getAttribute(e) || "";
        c = t + c;
        var o = a.get(c);
        o ? o.push(u) : a.set(c, [u]);
      }
    }
    return a;
  }
  function ah(t, e, l) {
    t = t.ownerDocument || t, t.head.insertBefore(
      l,
      e === "title" ? t.querySelector("head > title") : null
    );
  }
  function py(t, e, l) {
    if (l === 1 || e.itemProp != null) return !1;
    switch (t) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof e.precedence != "string" || typeof e.href != "string" || e.href === "")
          break;
        return !0;
      case "link":
        if (typeof e.rel != "string" || typeof e.href != "string" || e.href === "" || e.onLoad || e.onError)
          break;
        switch (e.rel) {
          case "stylesheet":
            return t = e.disabled, typeof e.precedence == "string" && t == null;
          default:
            return !0;
        }
      case "script":
        if (e.async && typeof e.async != "function" && typeof e.async != "symbol" && !e.onLoad && !e.onError && e.src && typeof e.src == "string")
          return !0;
    }
    return !1;
  }
  function nh(t) {
    return !(t.type === "stylesheet" && (t.state.loading & 3) === 0);
  }
  function gy(t, e, l, a) {
    if (l.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && (l.state.loading & 4) === 0) {
      if (l.instance === null) {
        var n = Qa(a.href), u = e.querySelector(
          Bn(n)
        );
        if (u) {
          e = u._p, e !== null && typeof e == "object" && typeof e.then == "function" && (t.count++, t = ni.bind(t), e.then(t, t)), l.state.loading |= 4, l.instance = u, Xt(u);
          return;
        }
        u = e.ownerDocument || e, a = th(a), (n = Me.get(n)) && Ys(a, n), u = u.createElement("link"), Xt(u);
        var c = u;
        c._p = new Promise(function(o, y) {
          c.onload = o, c.onerror = y;
        }), kt(u, "link", a), l.instance = u;
      }
      t.stylesheets === null && (t.stylesheets = /* @__PURE__ */ new Map()), t.stylesheets.set(l, e), (e = l.state.preload) && (l.state.loading & 3) === 0 && (t.count++, l = ni.bind(t), e.addEventListener("load", l), e.addEventListener("error", l));
    }
  }
  var Gs = 0;
  function by(t, e) {
    return t.stylesheets && t.count === 0 && ii(t, t.stylesheets), 0 < t.count || 0 < t.imgCount ? function(l) {
      var a = setTimeout(function() {
        if (t.stylesheets && ii(t, t.stylesheets), t.unsuspend) {
          var u = t.unsuspend;
          t.unsuspend = null, u();
        }
      }, 6e4 + e);
      0 < t.imgBytes && Gs === 0 && (Gs = 62500 * Iv());
      var n = setTimeout(
        function() {
          if (t.waitingForImages = !1, t.count === 0 && (t.stylesheets && ii(t, t.stylesheets), t.unsuspend)) {
            var u = t.unsuspend;
            t.unsuspend = null, u();
          }
        },
        (t.imgBytes > Gs ? 50 : 800) + e
      );
      return t.unsuspend = l, function() {
        t.unsuspend = null, clearTimeout(a), clearTimeout(n);
      };
    } : null;
  }
  function ni() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) ii(this, this.stylesheets);
      else if (this.unsuspend) {
        var t = this.unsuspend;
        this.unsuspend = null, t();
      }
    }
  }
  var ui = null;
  function ii(t, e) {
    t.stylesheets = null, t.unsuspend !== null && (t.count++, ui = /* @__PURE__ */ new Map(), e.forEach(Sy, t), ui = null, ni.call(t));
  }
  function Sy(t, e) {
    if (!(e.state.loading & 4)) {
      var l = ui.get(t);
      if (l) var a = l.get(null);
      else {
        l = /* @__PURE__ */ new Map(), ui.set(t, l);
        for (var n = t.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), u = 0; u < n.length; u++) {
          var c = n[u];
          (c.nodeName === "LINK" || c.getAttribute("media") !== "not all") && (l.set(c.dataset.precedence, c), a = c);
        }
        a && l.set(null, a);
      }
      n = e.instance, c = n.getAttribute("data-precedence"), u = l.get(c) || a, u === a && l.set(null, n), l.set(c, n), this.count++, a = ni.bind(this), n.addEventListener("load", a), n.addEventListener("error", a), u ? u.parentNode.insertBefore(n, u.nextSibling) : (t = t.nodeType === 9 ? t.head : t, t.insertBefore(n, t.firstChild)), e.state.loading |= 4;
    }
  }
  var qn = {
    $$typeof: X,
    Provider: null,
    Consumer: null,
    _currentValue: W,
    _currentValue2: W,
    _threadCount: 0
  };
  function xy(t, e, l, a, n, u, c, o, y) {
    this.tag = 1, this.containerInfo = t, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Bi(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Bi(0), this.hiddenUpdates = Bi(null), this.identifierPrefix = a, this.onUncaughtError = n, this.onCaughtError = u, this.onRecoverableError = c, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = y, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function uh(t, e, l, a, n, u, c, o, y, j, M, U) {
    return t = new xy(
      t,
      e,
      l,
      c,
      y,
      j,
      M,
      U,
      o
    ), e = 1, u === !0 && (e |= 24), u = he(3, null, null, e), t.current = u, u.stateNode = t, e = Sc(), e.refCount++, t.pooledCache = e, e.refCount++, u.memoizedState = {
      element: a,
      isDehydrated: l,
      cache: e
    }, Tc(u), t;
  }
  function ih(t) {
    return t ? (t = xa, t) : xa;
  }
  function ch(t, e, l, a, n, u) {
    n = ih(n), a.context === null ? a.context = n : a.pendingContext = n, a = Tl(e), a.payload = { element: l }, u = u === void 0 ? null : u, u !== null && (a.callback = u), l = jl(t, a, e), l !== null && (se(l, t, e), yn(l, t, e));
  }
  function sh(t, e) {
    if (t = t.memoizedState, t !== null && t.dehydrated !== null) {
      var l = t.retryLane;
      t.retryLane = l !== 0 && l < e ? l : e;
    }
  }
  function Xs(t, e) {
    sh(t, e), (t = t.alternate) && sh(t, e);
  }
  function fh(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = Jl(t, 67108864);
      e !== null && se(e, t, 67108864), Xs(t, 67108864);
    }
  }
  function rh(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = ge();
      e = Li(e);
      var l = Jl(t, e);
      l !== null && se(l, t, e), Xs(t, e);
    }
  }
  var ci = !0;
  function _y(t, e, l, a) {
    var n = C.T;
    C.T = null;
    var u = w.p;
    try {
      w.p = 2, Qs(t, e, l, a);
    } finally {
      w.p = u, C.T = n;
    }
  }
  function Ey(t, e, l, a) {
    var n = C.T;
    C.T = null;
    var u = w.p;
    try {
      w.p = 8, Qs(t, e, l, a);
    } finally {
      w.p = u, C.T = n;
    }
  }
  function Qs(t, e, l, a) {
    if (ci) {
      var n = Zs(a);
      if (n === null)
        Ns(
          t,
          e,
          a,
          si,
          l
        ), dh(t, a);
      else if (jy(
        n,
        t,
        e,
        l,
        a
      ))
        a.stopPropagation();
      else if (dh(t, a), e & 4 && -1 < Ty.indexOf(t)) {
        for (; n !== null; ) {
          var u = ra(n);
          if (u !== null)
            switch (u.tag) {
              case 3:
                if (u = u.stateNode, u.current.memoizedState.isDehydrated) {
                  var c = Xl(u.pendingLanes);
                  if (c !== 0) {
                    var o = u;
                    for (o.pendingLanes |= 2, o.entangledLanes |= 2; c; ) {
                      var y = 1 << 31 - oe(c);
                      o.entanglements[1] |= y, c &= ~y;
                    }
                    Ke(u), (dt & 6) === 0 && (Zu = fe() + 500, Cn(0));
                  }
                }
                break;
              case 31:
              case 13:
                o = Jl(u, 2), o !== null && se(o, u, 2), Ku(), Xs(u, 2);
            }
          if (u = Zs(a), u === null && Ns(
            t,
            e,
            a,
            si,
            l
          ), u === n) break;
          n = u;
        }
        n !== null && a.stopPropagation();
      } else
        Ns(
          t,
          e,
          a,
          null,
          l
        );
    }
  }
  function Zs(t) {
    return t = Ki(t), Vs(t);
  }
  var si = null;
  function Vs(t) {
    if (si = null, t = fa(t), t !== null) {
      var e = m(t);
      if (e === null) t = null;
      else {
        var l = e.tag;
        if (l === 13) {
          if (t = g(e), t !== null) return t;
          t = null;
        } else if (l === 31) {
          if (t = x(e), t !== null) return t;
          t = null;
        } else if (l === 3) {
          if (e.stateNode.current.memoizedState.isDehydrated)
            return e.tag === 3 ? e.stateNode.containerInfo : null;
          t = null;
        } else e !== t && (t = null);
      }
    }
    return si = t, null;
  }
  function oh(t) {
    switch (t) {
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
        switch (fm()) {
          case gf:
            return 2;
          case bf:
            return 8;
          case Fn:
          case rm:
            return 32;
          case Sf:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Ks = !1, Bl = null, Ll = null, ql = null, Yn = /* @__PURE__ */ new Map(), wn = /* @__PURE__ */ new Map(), Yl = [], Ty = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function dh(t, e) {
    switch (t) {
      case "focusin":
      case "focusout":
        Bl = null;
        break;
      case "dragenter":
      case "dragleave":
        Ll = null;
        break;
      case "mouseover":
      case "mouseout":
        ql = null;
        break;
      case "pointerover":
      case "pointerout":
        Yn.delete(e.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        wn.delete(e.pointerId);
    }
  }
  function Gn(t, e, l, a, n, u) {
    return t === null || t.nativeEvent !== u ? (t = {
      blockedOn: e,
      domEventName: l,
      eventSystemFlags: a,
      nativeEvent: u,
      targetContainers: [n]
    }, e !== null && (e = ra(e), e !== null && fh(e)), t) : (t.eventSystemFlags |= a, e = t.targetContainers, n !== null && e.indexOf(n) === -1 && e.push(n), t);
  }
  function jy(t, e, l, a, n) {
    switch (e) {
      case "focusin":
        return Bl = Gn(
          Bl,
          t,
          e,
          l,
          a,
          n
        ), !0;
      case "dragenter":
        return Ll = Gn(
          Ll,
          t,
          e,
          l,
          a,
          n
        ), !0;
      case "mouseover":
        return ql = Gn(
          ql,
          t,
          e,
          l,
          a,
          n
        ), !0;
      case "pointerover":
        var u = n.pointerId;
        return Yn.set(
          u,
          Gn(
            Yn.get(u) || null,
            t,
            e,
            l,
            a,
            n
          )
        ), !0;
      case "gotpointercapture":
        return u = n.pointerId, wn.set(
          u,
          Gn(
            wn.get(u) || null,
            t,
            e,
            l,
            a,
            n
          )
        ), !0;
    }
    return !1;
  }
  function hh(t) {
    var e = fa(t.target);
    if (e !== null) {
      var l = m(e);
      if (l !== null) {
        if (e = l.tag, e === 13) {
          if (e = g(l), e !== null) {
            t.blockedOn = e, zf(t.priority, function() {
              rh(l);
            });
            return;
          }
        } else if (e === 31) {
          if (e = x(l), e !== null) {
            t.blockedOn = e, zf(t.priority, function() {
              rh(l);
            });
            return;
          }
        } else if (e === 3 && l.stateNode.current.memoizedState.isDehydrated) {
          t.blockedOn = l.tag === 3 ? l.stateNode.containerInfo : null;
          return;
        }
      }
    }
    t.blockedOn = null;
  }
  function fi(t) {
    if (t.blockedOn !== null) return !1;
    for (var e = t.targetContainers; 0 < e.length; ) {
      var l = Zs(t.nativeEvent);
      if (l === null) {
        l = t.nativeEvent;
        var a = new l.constructor(
          l.type,
          l
        );
        Vi = a, l.target.dispatchEvent(a), Vi = null;
      } else
        return e = ra(l), e !== null && fh(e), t.blockedOn = l, !1;
      e.shift();
    }
    return !0;
  }
  function mh(t, e, l) {
    fi(t) && l.delete(e);
  }
  function zy() {
    Ks = !1, Bl !== null && fi(Bl) && (Bl = null), Ll !== null && fi(Ll) && (Ll = null), ql !== null && fi(ql) && (ql = null), Yn.forEach(mh), wn.forEach(mh);
  }
  function ri(t, e) {
    t.blockedOn === e && (t.blockedOn = null, Ks || (Ks = !0, i.unstable_scheduleCallback(
      i.unstable_NormalPriority,
      zy
    )));
  }
  var oi = null;
  function vh(t) {
    oi !== t && (oi = t, i.unstable_scheduleCallback(
      i.unstable_NormalPriority,
      function() {
        oi === t && (oi = null);
        for (var e = 0; e < t.length; e += 3) {
          var l = t[e], a = t[e + 1], n = t[e + 2];
          if (typeof a != "function") {
            if (Vs(a || l) === null)
              continue;
            break;
          }
          var u = ra(l);
          u !== null && (t.splice(e, 3), e -= 3, Zc(
            u,
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
  function Va(t) {
    function e(y) {
      return ri(y, t);
    }
    Bl !== null && ri(Bl, t), Ll !== null && ri(Ll, t), ql !== null && ri(ql, t), Yn.forEach(e), wn.forEach(e);
    for (var l = 0; l < Yl.length; l++) {
      var a = Yl[l];
      a.blockedOn === t && (a.blockedOn = null);
    }
    for (; 0 < Yl.length && (l = Yl[0], l.blockedOn === null); )
      hh(l), l.blockedOn === null && Yl.shift();
    if (l = (t.ownerDocument || t).$$reactFormReplay, l != null)
      for (a = 0; a < l.length; a += 3) {
        var n = l[a], u = l[a + 1], c = n[le] || null;
        if (typeof u == "function")
          c || vh(l);
        else if (c) {
          var o = null;
          if (u && u.hasAttribute("formAction")) {
            if (n = u, c = u[le] || null)
              o = c.formAction;
            else if (Vs(n) !== null) continue;
          } else o = c.action;
          typeof o == "function" ? l[a + 1] = o : (l.splice(a, 3), a -= 3), vh(l);
        }
      }
  }
  function yh() {
    function t(u) {
      u.canIntercept && u.info === "react-transition" && u.intercept({
        handler: function() {
          return new Promise(function(c) {
            return n = c;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function e() {
      n !== null && (n(), n = null), a || setTimeout(l, 20);
    }
    function l() {
      if (!a && !navigation.transition) {
        var u = navigation.currentEntry;
        u && u.url != null && navigation.navigate(u.url, {
          state: u.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var a = !1, n = null;
      return navigation.addEventListener("navigate", t), navigation.addEventListener("navigatesuccess", e), navigation.addEventListener("navigateerror", e), setTimeout(l, 100), function() {
        a = !0, navigation.removeEventListener("navigate", t), navigation.removeEventListener("navigatesuccess", e), navigation.removeEventListener("navigateerror", e), n !== null && (n(), n = null);
      };
    }
  }
  function Js(t) {
    this._internalRoot = t;
  }
  di.prototype.render = Js.prototype.render = function(t) {
    var e = this._internalRoot;
    if (e === null) throw Error(s(409));
    var l = e.current, a = ge();
    ch(l, a, t, e, null, null);
  }, di.prototype.unmount = Js.prototype.unmount = function() {
    var t = this._internalRoot;
    if (t !== null) {
      this._internalRoot = null;
      var e = t.containerInfo;
      ch(t.current, 2, null, t, null, null), Ku(), e[sa] = null;
    }
  };
  function di(t) {
    this._internalRoot = t;
  }
  di.prototype.unstable_scheduleHydration = function(t) {
    if (t) {
      var e = jf();
      t = { blockedOn: null, target: t, priority: e };
      for (var l = 0; l < Yl.length && e !== 0 && e < Yl[l].priority; l++) ;
      Yl.splice(l, 0, t), l === 0 && hh(t);
    }
  };
  var ph = f.version;
  if (ph !== "19.2.8")
    throw Error(
      s(
        527,
        ph,
        "19.2.8"
      )
    );
  w.findDOMNode = function(t) {
    var e = t._reactInternals;
    if (e === void 0)
      throw typeof t.render == "function" ? Error(s(188)) : (t = Object.keys(t).join(","), Error(s(268, t)));
    return t = v(e), t = t !== null ? N(t) : null, t = t === null ? null : t.stateNode, t;
  };
  var Ay = {
    bundleType: 0,
    version: "19.2.8",
    rendererPackageName: "react-dom",
    currentDispatcherRef: C,
    reconcilerVersion: "19.2.8"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var hi = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!hi.isDisabled && hi.supportsFiber)
      try {
        $a = hi.inject(
          Ay
        ), re = hi;
      } catch {
      }
  }
  return Qn.createRoot = function(t, e) {
    if (!h(t)) throw Error(s(299));
    var l = !1, a = "", n = To, u = jo, c = zo;
    return e != null && (e.unstable_strictMode === !0 && (l = !0), e.identifierPrefix !== void 0 && (a = e.identifierPrefix), e.onUncaughtError !== void 0 && (n = e.onUncaughtError), e.onCaughtError !== void 0 && (u = e.onCaughtError), e.onRecoverableError !== void 0 && (c = e.onRecoverableError)), e = uh(
      t,
      1,
      !1,
      null,
      null,
      l,
      a,
      null,
      n,
      u,
      c,
      yh
    ), t[sa] = e.current, Rs(t), new Js(e);
  }, Qn.hydrateRoot = function(t, e, l) {
    if (!h(t)) throw Error(s(299));
    var a = !1, n = "", u = To, c = jo, o = zo, y = null;
    return l != null && (l.unstable_strictMode === !0 && (a = !0), l.identifierPrefix !== void 0 && (n = l.identifierPrefix), l.onUncaughtError !== void 0 && (u = l.onUncaughtError), l.onCaughtError !== void 0 && (c = l.onCaughtError), l.onRecoverableError !== void 0 && (o = l.onRecoverableError), l.formState !== void 0 && (y = l.formState)), e = uh(
      t,
      1,
      !0,
      e,
      l ?? null,
      a,
      n,
      y,
      u,
      c,
      o,
      yh
    ), e.context = ih(null), l = e.current, a = ge(), a = Li(a), n = Tl(a), n.callback = null, jl(l, n, a), l = a, e.current.lanes = l, Fa(e, l), Ke(e), t[sa] = e.current, Rs(t), new di(e);
  }, Qn.version = "19.2.8", Qn;
}
var Ah;
function Yy() {
  if (Ah) return Ws.exports;
  Ah = 1;
  function i() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i);
      } catch (f) {
        console.error(f);
      }
  }
  return i(), Ws.exports = qy(), Ws.exports;
}
var wy = Yy();
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
var sf = /^(?:[a-z][a-z0-9+.-]*:|[\\/]{2})/i, Lh = /^[\\/]{2}/;
function Gy(i, f) {
  return f + i.replace(/\\/g, "/");
}
var Rh = "popstate";
function Nh(i) {
  return typeof i == "object" && i != null && "pathname" in i && "search" in i && "hash" in i && "state" in i && "key" in i;
}
function Xy(i = {}) {
  function f(h, m) {
    let {
      pathname: g = "/",
      search: x = "",
      hash: p = ""
    } = ca(h.location.hash.substring(1));
    return !g.startsWith("/") && !g.startsWith(".") && (g = "/" + g), nf(
      "",
      { pathname: g, search: x, hash: p },
      // state defaults to `null` because `window.history.state` does
      m.state && m.state.usr || null,
      m.state && m.state.key || "default"
    );
  }
  function r(h, m) {
    let g = h.document.querySelector("base"), x = "";
    if (g && g.getAttribute("href")) {
      let p = h.location.href, v = p.indexOf("#");
      x = v === -1 ? p : p.slice(0, v);
    }
    return x + "#" + (typeof m == "string" ? m : Jn(m));
  }
  function s(h, m) {
    Ue(
      h.pathname.charAt(0) === "/",
      `relative pathnames are not supported in hash history.push(${JSON.stringify(
        m
      )})`
    );
  }
  return Zy(
    f,
    r,
    s,
    i
  );
}
function zt(i, f) {
  if (i === !1 || i === null || typeof i > "u")
    throw new Error(f);
}
function Ue(i, f) {
  if (!i) {
    typeof console < "u" && console.warn(f);
    try {
      throw new Error(f);
    } catch {
    }
  }
}
function Qy() {
  return Math.random().toString(36).substring(2, 10);
}
function Oh(i, f) {
  return {
    usr: i.state,
    key: i.key,
    idx: f,
    masked: i.mask ? {
      pathname: i.pathname,
      search: i.search,
      hash: i.hash
    } : void 0
  };
}
function nf(i, f, r = null, s, h) {
  return {
    pathname: typeof i == "string" ? i : i.pathname,
    search: "",
    hash: "",
    ...typeof f == "string" ? ca(f) : f,
    state: r,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: f && f.key || s || Qy(),
    mask: h
  };
}
function Jn({
  pathname: i = "/",
  search: f = "",
  hash: r = ""
}) {
  return f && f !== "?" && (i += f.charAt(0) === "?" ? f : "?" + f), r && r !== "#" && (i += r.charAt(0) === "#" ? r : "#" + r), i;
}
function ca(i) {
  let f = {};
  if (i) {
    let r = i.indexOf("#");
    r >= 0 && (f.hash = i.substring(r), i = i.substring(0, r));
    let s = i.indexOf("?");
    s >= 0 && (f.search = i.substring(s), i = i.substring(0, s)), i && (f.pathname = i);
  }
  return f;
}
function Zy(i, f, r, s = {}) {
  let { window: h = document.defaultView, v5Compat: m = !1 } = s, g = h.history, x = "POP", p = null, v = N();
  v == null && (v = 0, g.replaceState({ ...g.state, idx: v }, ""));
  function N() {
    return (g.state || { idx: null }).idx;
  }
  function E() {
    x = "POP";
    let B = N(), Z = B == null ? null : B - v;
    v = B, p && p({ action: x, location: Y.location, delta: Z });
  }
  function z(B, Z) {
    x = "PUSH";
    let k = Nh(B) ? B : nf(Y.location, B, Z);
    r && r(k, B), v = N() + 1;
    let X = Oh(k, v), lt = Y.createHref(k.mask || k);
    try {
      g.pushState(X, "", lt);
    } catch (it) {
      if (it instanceof DOMException && it.name === "DataCloneError")
        throw it;
      h.location.assign(lt);
    }
    m && p && p({ action: x, location: Y.location, delta: 1 });
  }
  function L(B, Z) {
    x = "REPLACE";
    let k = Nh(B) ? B : nf(Y.location, B, Z);
    r && r(k, B), v = N();
    let X = Oh(k, v), lt = Y.createHref(k.mask || k);
    g.replaceState(X, "", lt), m && p && p({ action: x, location: Y.location, delta: 0 });
  }
  function q(B) {
    return Vy(h, B);
  }
  let Y = {
    get action() {
      return x;
    },
    get location() {
      return i(h, g);
    },
    listen(B) {
      if (p)
        throw new Error("A history only accepts one active listener");
      return h.addEventListener(Rh, E), p = B, () => {
        h.removeEventListener(Rh, E), p = null;
      };
    },
    createHref(B) {
      return f(h, B);
    },
    createURL: q,
    encodeLocation(B) {
      let Z = q(B);
      return {
        pathname: Z.pathname,
        search: Z.search,
        hash: Z.hash
      };
    },
    push: z,
    replace: L,
    go(B) {
      return g.go(B);
    }
  };
  return Y;
}
function Vy(i, f, r = !1) {
  let s = "http://localhost";
  i && (s = i.location.origin !== "null" ? i.location.origin : i.location.href), zt(s, "No window.location.(origin|href) available to create URL");
  let h = typeof f == "string" ? f : Jn(f);
  return h = h.replace(/ $/, "%20"), !r && Lh.test(h) && (h = s + h), new URL(h, s);
}
function qh(i, f, r = "/") {
  return Ky(i, f, r, !1);
}
function Ky(i, f, r, s, h) {
  let m = typeof f == "string" ? ca(f) : f, g = vl(m.pathname || "/", r);
  if (g == null)
    return null;
  let x = Jy(i), p = null, v = n0(g);
  for (let N = 0; p == null && N < x.length; ++N)
    p = a0(
      x[N],
      v,
      s
    );
  return p;
}
function Jy(i) {
  let f = Yh(i);
  return ky(f), f;
}
function Yh(i, f = [], r = [], s = "", h = !1) {
  let m = (g, x, p = h, v) => {
    let N = {
      relativePath: v === void 0 ? g.path || "" : v,
      caseSensitive: g.caseSensitive === !0,
      childrenIndex: x,
      route: g
    };
    if (N.relativePath.startsWith("/")) {
      if (!N.relativePath.startsWith(s) && p)
        return;
      zt(
        N.relativePath.startsWith(s),
        `Absolute route path "${N.relativePath}" nested under path "${s}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
      ), N.relativePath = N.relativePath.slice(s.length);
    }
    let E = Ye([s, N.relativePath]), z = r.concat(N);
    g.children && g.children.length > 0 && (zt(
      // Our types know better, but runtime JS may not!
      // @ts-expect-error
      g.index !== !0,
      `Index routes must not have child routes. Please remove all child routes from route path "${E}".`
    ), Yh(
      g.children,
      f,
      z,
      E,
      p
    )), !(g.path == null && !g.index) && f.push({
      path: E,
      score: e0(E, g.index),
      routesMeta: z.map((L, q) => {
        let [Y, B] = Xh(
          L.relativePath,
          L.caseSensitive,
          q === z.length - 1
        );
        return {
          ...L,
          matcher: Y,
          compiledParams: B
        };
      })
    });
  };
  return i.forEach((g, x) => {
    if (g.path === "" || !g.path?.includes("?"))
      m(g, x);
    else
      for (let p of wh(g.path))
        m(g, x, !0, p);
  }), f;
}
function wh(i) {
  let f = i.split("/");
  if (f.length === 0) return [];
  let [r, ...s] = f, h = r.endsWith("?"), m = r.replace(/\?$/, "");
  if (s.length === 0)
    return h ? [m, ""] : [m];
  let g = wh(s.join("/")), x = [];
  return x.push(
    ...g.map(
      (p) => p === "" ? m : [m, p].join("/")
    )
  ), h && x.push(...g), x.map(
    (p) => i.startsWith("/") && p === "" ? "/" : p
  );
}
function ky(i) {
  i.sort(
    (f, r) => f.score !== r.score ? r.score - f.score : l0(
      f.routesMeta.map((s) => s.childrenIndex),
      r.routesMeta.map((s) => s.childrenIndex)
    )
  );
}
var $y = /^:[\w-]+$/, Wy = 3, Fy = 2, Py = 1, Iy = 10, t0 = -2, Mh = (i) => i === "*";
function e0(i, f) {
  let r = i.split("/"), s = r.length;
  return r.some(Mh) && (s += t0), f && (s += Fy), r.filter((h) => !Mh(h)).reduce(
    (h, m) => h + ($y.test(m) ? Wy : m === "" ? Py : Iy),
    s
  );
}
function l0(i, f) {
  return i.length === f.length && i.slice(0, -1).every((s, h) => s === f[h]) ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    i[i.length - 1] - f[f.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function a0(i, f, r = !1) {
  let { routesMeta: s } = i, h = {}, m = "/", g = [];
  for (let x = 0; x < s.length; ++x) {
    let p = s[x], v = x === s.length - 1, N = m === "/" ? f : f.slice(m.length) || "/", E = {
      path: p.relativePath,
      caseSensitive: p.caseSensitive,
      end: v
    }, z = (
      // Use precomputed matcher if it exists
      p.matcher && p.compiledParams ? Gh(
        E,
        N,
        p.matcher,
        p.compiledParams
      ) : _i(E, N)
    ), L = p.route;
    if (!z && v && r && !s[s.length - 1].route.index && (z = _i(
      {
        path: p.relativePath,
        caseSensitive: p.caseSensitive,
        end: !1
      },
      N
    )), !z)
      return null;
    Object.assign(h, z.params), g.push({
      // TODO: Can this as be avoided?
      params: h,
      pathname: Ye([m, z.pathname]),
      pathnameBase: c0(
        Ye([m, z.pathnameBase])
      ),
      route: L
    }), z.pathnameBase !== "/" && (m = Ye([m, z.pathnameBase]));
  }
  return g;
}
function _i(i, f) {
  typeof i == "string" && (i = { path: i, caseSensitive: !1, end: !0 });
  let [r, s] = Xh(
    i.path,
    i.caseSensitive,
    i.end
  );
  return Gh(i, f, r, s);
}
function Gh(i, f, r, s) {
  let h = f.match(r);
  if (!h) return null;
  let m = h[0], g = m.replace(/(.)\/+$/, "$1"), x = h.slice(1);
  return {
    params: s.reduce(
      (v, { paramName: N, isOptional: E }, z) => {
        if (N === "*") {
          let q = x[z] || "";
          g = m.slice(0, m.length - q.length).replace(/(.)\/+$/, "$1");
        }
        const L = x[z];
        return E && !L ? v[N] = void 0 : v[N] = (L || "").replace(/%2F/g, "/"), v;
      },
      {}
    ),
    pathname: m,
    pathnameBase: g,
    pattern: i
  };
}
function Xh(i, f = !1, r = !0) {
  Ue(
    i === "*" || !i.endsWith("*") || i.endsWith("/*"),
    `Route path "${i}" will be treated as if it were "${i.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${i.replace(/\*$/, "/*")}".`
  );
  let s = [], h = "^" + i.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(
    /\/:([\w-]+)(\?)?/g,
    (g, x, p, v, N) => {
      if (s.push({ paramName: x, isOptional: p != null }), p) {
        let E = N.charAt(v + g.length);
        return E && E !== "/" ? "/([^\\/]*)" : "(?:/([^\\/]*))?";
      }
      return "/([^\\/]+)";
    }
  ).replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
  return i.endsWith("*") ? (s.push({ paramName: "*" }), h += i === "*" || i === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$") : r ? h += "\\/*$" : i !== "" && i !== "/" && (h += "(?:(?=\\/|$))"), [new RegExp(h, f ? void 0 : "i"), s];
}
function n0(i) {
  try {
    return i.split("/").map((f) => decodeURIComponent(f).replace(/\//g, "%2F")).join("/");
  } catch (f) {
    return Ue(
      !1,
      `The URL path "${i}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${f}).`
    ), i;
  }
}
function vl(i, f) {
  if (f === "/") return i;
  if (!i.toLowerCase().startsWith(f.toLowerCase()))
    return null;
  let r = f.endsWith("/") ? f.length - 1 : f.length, s = i.charAt(r);
  return s && s !== "/" ? null : i.slice(r) || "/";
}
function u0(i, f = "/") {
  let {
    pathname: r,
    search: s = "",
    hash: h = ""
  } = typeof i == "string" ? ca(i) : i, m;
  return r ? (r = Qh(r), r.startsWith("/") ? m = Ch(r.substring(1), "/") : m = Ch(r, f)) : m = f, {
    pathname: m,
    search: s0(s),
    hash: f0(h)
  };
}
function Ch(i, f) {
  let r = Ei(f).split("/");
  return i.split("/").forEach((h) => {
    h === ".." ? r.length > 1 && r.pop() : h !== "." && r.push(h);
  }), r.length > 1 ? r.join("/") : "/";
}
function tf(i, f, r, s) {
  return `Cannot include a '${i}' character in a manually specified \`to.${f}\` field [${JSON.stringify(
    s
  )}].  Please separate it out to the \`to.${r}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function i0(i) {
  return i.filter(
    (f, r) => r === 0 || f.route.path && f.route.path.length > 0
  );
}
function ff(i) {
  let f = i0(i);
  return f.map(
    (r, s) => s === f.length - 1 ? r.pathname : r.pathnameBase
  );
}
function ji(i, f, r, s = !1) {
  let h;
  typeof i == "string" ? h = ca(i) : (h = { ...i }, zt(
    !h.pathname || !h.pathname.includes("?"),
    tf("?", "pathname", "search", h)
  ), zt(
    !h.pathname || !h.pathname.includes("#"),
    tf("#", "pathname", "hash", h)
  ), zt(
    !h.search || !h.search.includes("#"),
    tf("#", "search", "hash", h)
  ));
  let m = i === "" || h.pathname === "", g = m ? "/" : h.pathname, x;
  if (g == null)
    x = r;
  else {
    let E = f.length - 1;
    if (!s && g.startsWith("..")) {
      let z = g.split("/");
      for (; z[0] === ".."; )
        z.shift(), E -= 1;
      h.pathname = z.join("/");
    }
    x = E >= 0 ? f[E] : "/";
  }
  let p = u0(h, x), v = g && g !== "/" && g.endsWith("/"), N = (m || g === ".") && r.endsWith("/");
  return !p.pathname.endsWith("/") && (v || N) && (p.pathname += "/"), p;
}
var Qh = (i) => i.replace(/[\\/]{2,}/g, "/"), Ye = (i) => Qh(i.join("/")), Ei = (i) => i.replace(/\/+$/, ""), c0 = (i) => Ei(i).replace(/^\/*/, "/"), s0 = (i) => !i || i === "?" ? "" : i.startsWith("?") ? i : "?" + i, f0 = (i) => !i || i === "#" ? "" : i.startsWith("#") ? i : "#" + i, r0 = class {
  constructor(i, f, r, s = !1) {
    this.status = i, this.statusText = f || "", this.internal = s, r instanceof Error ? (this.data = r.toString(), this.error = r) : this.data = r;
  }
};
function o0(i) {
  return i != null && typeof i.status == "number" && typeof i.statusText == "string" && typeof i.internal == "boolean" && "data" in i;
}
function d0(i) {
  let f = i.map((r) => r.route.path).filter(Boolean);
  return Ye(f) || "/";
}
var Zh = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
function Vh(i, f) {
  let r = i;
  if (typeof r != "string" || !sf.test(r))
    return {
      absoluteURL: void 0,
      isExternal: !1,
      to: r
    };
  let s = r, h = !1;
  if (Zh)
    try {
      let m = new URL(window.location.href), g = Lh.test(r) ? new URL(Gy(r, m.protocol)) : new URL(r), x = vl(g.pathname, f);
      g.origin === m.origin && x != null ? r = x + g.search + g.hash : h = !0;
    } catch {
      Ue(
        !1,
        `<Link to="${r}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`
      );
    }
  return {
    absoluteURL: s,
    isExternal: h,
    to: r
  };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
var Kh = [
  "POST",
  "PUT",
  "PATCH",
  "DELETE"
];
new Set(
  Kh
);
var h0 = [
  "GET",
  ...Kh
];
new Set(h0);
var m0 = [
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
function v0(i) {
  try {
    return m0.includes(new URL(i).protocol);
  } catch {
    return !1;
  }
}
var Ka = A.createContext(null);
Ka.displayName = "DataRouter";
var zi = A.createContext(null);
zi.displayName = "DataRouterState";
var Jh = A.createContext(!1);
function y0() {
  return A.useContext(Jh);
}
var kh = A.createContext({
  isTransitioning: !1
});
kh.displayName = "ViewTransition";
var p0 = A.createContext(
  /* @__PURE__ */ new Map()
);
p0.displayName = "Fetchers";
var g0 = A.createContext(null);
g0.displayName = "Await";
var be = A.createContext(
  null
);
be.displayName = "Navigation";
var kn = A.createContext(
  null
);
kn.displayName = "Location";
var ke = A.createContext({
  outlet: null,
  matches: [],
  isDataRoute: !1
});
ke.displayName = "Route";
var rf = A.createContext(null);
rf.displayName = "RouteError";
var $h = "REACT_ROUTER_ERROR", b0 = "REDIRECT", S0 = "ROUTE_ERROR_RESPONSE";
function x0(i) {
  if (i.startsWith(`${$h}:${b0}:{`))
    try {
      let f = JSON.parse(i.slice(28));
      if (typeof f == "object" && f && typeof f.status == "number" && typeof f.statusText == "string" && typeof f.location == "string" && typeof f.reloadDocument == "boolean" && typeof f.replace == "boolean")
        return f;
    } catch {
    }
}
function _0(i) {
  if (i.startsWith(
    `${$h}:${S0}:{`
  ))
    try {
      let f = JSON.parse(i.slice(40));
      if (typeof f == "object" && f && typeof f.status == "number" && typeof f.statusText == "string")
        return new r0(
          f.status,
          f.statusText,
          f.data
        );
    } catch {
    }
}
function E0(i, { relative: f } = {}) {
  zt(
    Ja(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useHref() may be used only in the context of a <Router> component."
  );
  let { basename: r, navigator: s } = A.useContext(be), { hash: h, pathname: m, search: g } = $n(i, { relative: f }), x = m;
  return r !== "/" && (x = m === "/" ? r : Ye([r, m])), s.createHref({ pathname: x, search: g, hash: h });
}
function Ja() {
  return A.useContext(kn) != null;
}
function we() {
  return zt(
    Ja(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useLocation() may be used only in the context of a <Router> component."
  ), A.useContext(kn).location;
}
var Wh = "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function Fh(i) {
  A.useContext(be).static || A.useLayoutEffect(i);
}
function Ph() {
  let { isDataRoute: i } = A.useContext(ke);
  return i ? B0() : T0();
}
function T0() {
  zt(
    Ja(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useNavigate() may be used only in the context of a <Router> component."
  );
  let i = A.useContext(Ka), { basename: f, navigator: r } = A.useContext(be), { matches: s } = A.useContext(ke), { pathname: h } = we(), m = JSON.stringify(ff(s)), g = A.useRef(!1);
  return Fh(() => {
    g.current = !0;
  }), A.useCallback(
    (p, v = {}) => {
      if (Ue(g.current, Wh), !g.current) return;
      if (typeof p == "number") {
        r.go(p);
        return;
      }
      let N = ji(
        p,
        JSON.parse(m),
        h,
        v.relative === "path"
      );
      i == null && f !== "/" && (N.pathname = N.pathname === "/" ? f : Ye([f, N.pathname])), (v.replace ? r.replace : r.push)(
        N,
        v.state,
        v
      );
    },
    [
      f,
      r,
      m,
      h,
      i
    ]
  );
}
A.createContext(null);
function $n(i, { relative: f } = {}) {
  let { matches: r } = A.useContext(ke), { pathname: s } = we(), h = JSON.stringify(ff(r));
  return A.useMemo(
    () => ji(
      i,
      JSON.parse(h),
      s,
      f === "path"
    ),
    [i, h, s, f]
  );
}
function j0(i, f) {
  return Ih(i, f);
}
function Ih(i, f, r) {
  zt(
    Ja(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useRoutes() may be used only in the context of a <Router> component."
  );
  let { navigator: s } = A.useContext(be), { matches: h } = A.useContext(ke), m = h[h.length - 1], g = m ? m.params : {}, x = m ? m.pathname : "/", p = m ? m.pathnameBase : "/", v = m && m.route;
  {
    let B = v && v.path || "";
    em(
      x,
      !v || B.endsWith("*") || B.endsWith("*?"),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${x}" (under <Route path="${B}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${B}"> to <Route path="${B === "/" ? "*" : `${B}/*`}">.`
    );
  }
  let N = we(), E;
  if (f) {
    let B = typeof f == "string" ? ca(f) : f;
    zt(
      p === "/" || B.pathname?.startsWith(p),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${p}" but pathname "${B.pathname}" was given in the \`location\` prop.`
    ), E = B;
  } else
    E = N;
  let z = E.pathname || "/", L = z;
  if (p !== "/") {
    let B = p.replace(/^\//, "").split("/");
    L = "/" + z.replace(/^\//, "").split("/").slice(B.length).join("/");
  }
  let q = r && r.state.matches.length ? (
    // If we're in a data router, use the matches we've already identified but ensure
    // we have the latest route instances from the manifest in case elements have changed
    r.state.matches.map(
      (B) => Object.assign(B, {
        route: r.manifest[B.route.id] || B.route
      })
    )
  ) : qh(i, { pathname: L });
  Ue(
    v || q != null,
    `No routes matched location "${E.pathname}${E.search}${E.hash}" `
  ), Ue(
    q == null || q[q.length - 1].route.element !== void 0 || q[q.length - 1].route.Component !== void 0 || q[q.length - 1].route.lazy !== void 0,
    `Matched leaf route at location "${E.pathname}${E.search}${E.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`
  );
  let Y = O0(
    q && q.map(
      (B) => Object.assign({}, B, {
        params: Object.assign({}, g, B.params),
        pathname: Ye([
          p,
          // Re-encode pathnames that were decoded inside matchRoutes.
          // Pre-encode `%`, `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          s.encodeLocation ? s.encodeLocation(
            B.pathname.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : B.pathname
        ]),
        pathnameBase: B.pathnameBase === "/" ? p : Ye([
          p,
          // Re-encode pathnames that were decoded inside matchRoutes
          // Pre-encode `%`, `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          s.encodeLocation ? s.encodeLocation(
            B.pathnameBase.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : B.pathnameBase
        ])
      })
    ),
    h,
    r
  );
  return f && Y ? /* @__PURE__ */ A.createElement(
    kn.Provider,
    {
      value: {
        location: {
          pathname: "/",
          search: "",
          hash: "",
          state: null,
          key: "default",
          mask: void 0,
          ...E
        },
        navigationType: "POP"
        /* Pop */
      }
    },
    Y
  ) : Y;
}
function z0() {
  let i = H0(), f = o0(i) ? `${i.status} ${i.statusText}` : i instanceof Error ? i.message : JSON.stringify(i), r = i instanceof Error ? i.stack : null, s = "rgba(200,200,200, 0.5)", h = { padding: "0.5rem", backgroundColor: s }, m = { padding: "2px 4px", backgroundColor: s }, g = null;
  return console.error(
    "Error handled by React Router default ErrorBoundary:",
    i
  ), g = /* @__PURE__ */ A.createElement(A.Fragment, null, /* @__PURE__ */ A.createElement("p", null, "💿 Hey developer 👋"), /* @__PURE__ */ A.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /* @__PURE__ */ A.createElement("code", { style: m }, "ErrorBoundary"), " or", " ", /* @__PURE__ */ A.createElement("code", { style: m }, "errorElement"), " prop on your route.")), /* @__PURE__ */ A.createElement(A.Fragment, null, /* @__PURE__ */ A.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ A.createElement("h3", { style: { fontStyle: "italic" } }, f), r ? /* @__PURE__ */ A.createElement("pre", { style: h }, r) : null, g);
}
var A0 = /* @__PURE__ */ A.createElement(z0, null), tm = class extends A.Component {
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
  static getDerivedStateFromProps(i, f) {
    return f.location !== i.location || f.revalidation !== "idle" && i.revalidation === "idle" ? {
      error: i.error,
      location: i.location,
      revalidation: i.revalidation
    } : {
      error: i.error !== void 0 ? i.error : f.error,
      location: f.location,
      revalidation: i.revalidation || f.revalidation
    };
  }
  componentDidCatch(i, f) {
    this.props.onError ? this.props.onError(i, f) : console.error(
      "React Router caught the following error during render",
      i
    );
  }
  render() {
    let i = this.state.error;
    if (this.context && typeof i == "object" && i && "digest" in i && typeof i.digest == "string") {
      const r = _0(i.digest);
      r && (i = r);
    }
    let f = i !== void 0 ? /* @__PURE__ */ A.createElement(ke.Provider, { value: this.props.routeContext }, /* @__PURE__ */ A.createElement(
      rf.Provider,
      {
        value: i,
        children: this.props.component
      }
    )) : this.props.children;
    return this.context ? /* @__PURE__ */ A.createElement(R0, { error: i }, f) : f;
  }
};
tm.contextType = Jh;
var ef = /* @__PURE__ */ new WeakMap();
function R0({
  children: i,
  error: f
}) {
  let { basename: r } = A.useContext(be);
  if (typeof f == "object" && f && "digest" in f && typeof f.digest == "string") {
    let s = x0(f.digest);
    if (s) {
      let h = ef.get(f);
      if (h) throw h;
      let m = Vh(s.location, r), g = m.absoluteURL || m.to;
      if (v0(g))
        throw new Error("Invalid redirect location");
      if (Zh && !ef.get(f))
        if (m.isExternal || s.reloadDocument)
          window.location.href = g;
        else {
          const x = Promise.resolve().then(
            () => window.__reactRouterDataRouter.navigate(m.to, {
              replace: s.replace
            })
          );
          throw ef.set(f, x), x;
        }
      return /* @__PURE__ */ A.createElement("meta", { httpEquiv: "refresh", content: `0;url=${g}` });
    }
  }
  return i;
}
function N0({ routeContext: i, match: f, children: r }) {
  let s = A.useContext(Ka);
  return s && s.static && s.staticContext && (f.route.errorElement || f.route.ErrorBoundary) && (s.staticContext._deepestRenderedBoundaryId = f.route.id), /* @__PURE__ */ A.createElement(ke.Provider, { value: i }, r);
}
function O0(i, f = [], r) {
  let s = r?.state;
  if (i == null) {
    if (!s)
      return null;
    if (s.errors)
      i = s.matches;
    else if (f.length === 0 && !s.initialized && s.matches.length > 0)
      i = s.matches;
    else
      return null;
  }
  let h = i, m = s?.errors;
  if (m != null) {
    let N = h.findIndex(
      (E) => E.route.id && m?.[E.route.id] !== void 0
    );
    zt(
      N >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(
        m
      ).join(",")}`
    ), h = h.slice(
      0,
      Math.min(h.length, N + 1)
    );
  }
  let g = !1, x = -1;
  if (r && s) {
    g = s.renderFallback;
    for (let N = 0; N < h.length; N++) {
      let E = h[N];
      if ((E.route.HydrateFallback || E.route.hydrateFallbackElement) && (x = N), E.route.id) {
        let { loaderData: z, errors: L } = s, q = E.route.loader && !z.hasOwnProperty(E.route.id) && (!L || L[E.route.id] === void 0);
        if (E.route.lazy || q) {
          r.isStatic && (g = !0), x >= 0 ? h = h.slice(0, x + 1) : h = [h[0]];
          break;
        }
      }
    }
  }
  let p = r?.onError, v = s && p ? (N, E) => {
    p(N, {
      location: s.location,
      params: s.matches?.[0]?.params ?? {},
      pattern: d0(s.matches),
      errorInfo: E
    });
  } : void 0;
  return h.reduceRight(
    (N, E, z) => {
      let L, q = !1, Y = null, B = null;
      s && (L = m && E.route.id ? m[E.route.id] : void 0, Y = E.route.errorElement || A0, g && (x < 0 && z === 0 ? (em(
        "route-fallback",
        !1,
        "No `HydrateFallback` element provided to render during initial hydration"
      ), q = !0, B = null) : x === z && (q = !0, B = E.route.hydrateFallbackElement || null)));
      let Z = f.concat(h.slice(0, z + 1)), k = () => {
        let X;
        return L ? X = Y : q ? X = B : E.route.Component ? X = /* @__PURE__ */ A.createElement(E.route.Component, null) : E.route.element ? X = E.route.element : X = N, /* @__PURE__ */ A.createElement(
          N0,
          {
            match: E,
            routeContext: {
              outlet: N,
              matches: Z,
              isDataRoute: s != null
            },
            children: X
          }
        );
      };
      return s && (E.route.ErrorBoundary || E.route.errorElement || z === 0) ? /* @__PURE__ */ A.createElement(
        tm,
        {
          location: s.location,
          revalidation: s.revalidation,
          component: Y,
          error: L,
          children: k(),
          routeContext: { outlet: null, matches: Z, isDataRoute: !0 },
          onError: v
        }
      ) : k();
    },
    null
  );
}
function of(i) {
  return `${i} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function M0(i) {
  let f = A.useContext(Ka);
  return zt(f, of(i)), f;
}
function C0(i) {
  let f = A.useContext(zi);
  return zt(f, of(i)), f;
}
function D0(i) {
  let f = A.useContext(ke);
  return zt(f, of(i)), f;
}
function df(i) {
  let f = D0(i), r = f.matches[f.matches.length - 1];
  return zt(
    r.route.id,
    `${i} can only be used on routes that contain a unique "id"`
  ), r.route.id;
}
function U0() {
  return df(
    "useRouteId"
    /* UseRouteId */
  );
}
function H0() {
  let i = A.useContext(rf), f = C0(
    "useRouteError"
    /* UseRouteError */
  ), r = df(
    "useRouteError"
    /* UseRouteError */
  );
  return i !== void 0 ? i : f.errors?.[r];
}
function B0() {
  let { router: i } = M0(
    "useNavigate"
    /* UseNavigateStable */
  ), f = df(
    "useNavigate"
    /* UseNavigateStable */
  ), r = A.useRef(!1);
  return Fh(() => {
    r.current = !0;
  }), A.useCallback(
    async (h, m = {}) => {
      Ue(r.current, Wh), r.current && (typeof h == "number" ? await i.navigate(h) : await i.navigate(h, { fromRouteId: f, ...m }));
    },
    [i, f]
  );
}
var Dh = {};
function em(i, f, r) {
  !f && !Dh[i] && (Dh[i] = !0, Ue(!1, r));
}
A.memo(L0);
function L0({
  routes: i,
  manifest: f,
  future: r,
  state: s,
  isStatic: h,
  onError: m
}) {
  return Ih(i, void 0, {
    manifest: f,
    state: s,
    isStatic: h,
    onError: m
  });
}
function vi({
  to: i,
  replace: f,
  state: r,
  relative: s
}) {
  zt(
    Ja(),
    // TODO: This error is probably because they somehow have 2 versions of
    // the router loaded. We can help them understand how to avoid that.
    "<Navigate> may be used only in the context of a <Router> component."
  );
  let { static: h } = A.useContext(be);
  Ue(
    !h,
    "<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change."
  );
  let { matches: m } = A.useContext(ke), { pathname: g } = we(), x = Ph(), p = ji(
    i,
    ff(m),
    g,
    s === "path"
  ), v = JSON.stringify(p);
  return A.useEffect(() => {
    x(JSON.parse(v), { replace: f, state: r, relative: s });
  }, [x, v, s, f, r]), null;
}
function Ot(i) {
  zt(
    !1,
    "A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>."
  );
}
function q0({
  basename: i = "/",
  children: f = null,
  location: r,
  navigationType: s = "POP",
  navigator: h,
  static: m = !1,
  useTransitions: g
}) {
  zt(
    !Ja(),
    "You cannot render a <Router> inside another <Router>. You should never have more than one in your app."
  );
  let x = i.replace(/^\/*/, "/"), p = A.useMemo(
    () => ({
      basename: x,
      navigator: h,
      static: m,
      useTransitions: g,
      future: {}
    }),
    [x, h, m, g]
  );
  typeof r == "string" && (r = ca(r));
  let {
    pathname: v = "/",
    search: N = "",
    hash: E = "",
    state: z = null,
    key: L = "default",
    mask: q
  } = r, Y = A.useMemo(() => {
    let B = vl(v, x);
    return B == null ? null : {
      location: {
        pathname: B,
        search: N,
        hash: E,
        state: z,
        key: L,
        mask: q
      },
      navigationType: s
    };
  }, [x, v, N, E, z, L, s, q]);
  return Ue(
    Y != null,
    `<Router basename="${x}"> is not able to match the URL "${v}${N}${E}" because it does not start with the basename, so the <Router> won't render anything.`
  ), Y == null ? null : /* @__PURE__ */ A.createElement(be.Provider, { value: p }, /* @__PURE__ */ A.createElement(kn.Provider, { children: f, value: Y }));
}
function Y0({
  children: i,
  location: f
}) {
  return j0(uf(i), f);
}
function uf(i, f = []) {
  let r = [];
  return A.Children.forEach(i, (s, h) => {
    if (!A.isValidElement(s))
      return;
    let m = [...f, h];
    if (s.type === A.Fragment) {
      r.push.apply(
        r,
        uf(s.props.children, m)
      );
      return;
    }
    zt(
      s.type === Ot,
      `[${typeof s.type == "string" ? s.type : s.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`
    ), zt(
      !s.props.index || !s.props.children,
      "An index route cannot have child routes."
    );
    let g = {
      id: s.props.id || m.join("-"),
      caseSensitive: s.props.caseSensitive,
      element: s.props.element,
      Component: s.props.Component,
      index: s.props.index,
      path: s.props.path,
      middleware: s.props.middleware,
      loader: s.props.loader,
      action: s.props.action,
      hydrateFallbackElement: s.props.hydrateFallbackElement,
      HydrateFallback: s.props.HydrateFallback,
      errorElement: s.props.errorElement,
      ErrorBoundary: s.props.ErrorBoundary,
      hasErrorBoundary: s.props.hasErrorBoundary === !0 || s.props.ErrorBoundary != null || s.props.errorElement != null,
      shouldRevalidate: s.props.shouldRevalidate,
      handle: s.props.handle,
      lazy: s.props.lazy
    };
    s.props.children && (g.children = uf(
      s.props.children,
      m
    )), r.push(g);
  }), r;
}
var gi = "get", bi = "application/x-www-form-urlencoded";
function Ai(i) {
  return typeof HTMLElement < "u" && i instanceof HTMLElement;
}
function w0(i) {
  return Ai(i) && i.tagName.toLowerCase() === "button";
}
function G0(i) {
  return Ai(i) && i.tagName.toLowerCase() === "form";
}
function X0(i) {
  return Ai(i) && i.tagName.toLowerCase() === "input";
}
function Q0(i) {
  return !!(i.metaKey || i.altKey || i.ctrlKey || i.shiftKey);
}
function Z0(i, f) {
  return i.button === 0 && // Ignore everything but left clicks
  (!f || f === "_self") && // Let browser handle "target=_blank" etc.
  !Q0(i);
}
var yi = null;
function V0() {
  if (yi === null)
    try {
      new FormData(
        document.createElement("form"),
        // @ts-expect-error if FormData supports the submitter parameter, this will throw
        0
      ), yi = !1;
    } catch {
      yi = !0;
    }
  return yi;
}
var K0 = /* @__PURE__ */ new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
]);
function lf(i) {
  return i != null && !K0.has(i) ? (Ue(
    !1,
    `"${i}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${bi}"`
  ), null) : i;
}
function J0(i, f) {
  let r, s, h, m, g;
  if (G0(i)) {
    let x = i.getAttribute("action");
    s = x ? vl(x, f) : null, r = i.getAttribute("method") || gi, h = lf(i.getAttribute("enctype")) || bi, m = new FormData(i);
  } else if (w0(i) || X0(i) && (i.type === "submit" || i.type === "image")) {
    let x = i.form;
    if (x == null)
      throw new Error(
        'Cannot submit a <button> or <input type="submit"> without a <form>'
      );
    let p = i.getAttribute("formaction") || x.getAttribute("action");
    if (s = p ? vl(p, f) : null, r = i.getAttribute("formmethod") || x.getAttribute("method") || gi, h = lf(i.getAttribute("formenctype")) || lf(x.getAttribute("enctype")) || bi, m = new FormData(x, i), !V0()) {
      let { name: v, type: N, value: E } = i;
      if (N === "image") {
        let z = v ? `${v}.` : "";
        m.append(`${z}x`, "0"), m.append(`${z}y`, "0");
      } else v && m.append(v, E);
    }
  } else {
    if (Ai(i))
      throw new Error(
        'Cannot submit element that is not <form>, <button>, or <input type="submit|image">'
      );
    r = gi, s = null, h = bi, g = i;
  }
  return m && h === "text/plain" && (g = m, m = void 0), { action: s, method: r.toLowerCase(), encType: h, formData: m, body: g };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function hf(i, f) {
  if (i === !1 || i === null || typeof i > "u")
    throw new Error(f);
}
function lm(i, f, r, s) {
  let h = typeof i == "string" ? new URL(
    i,
    // This can be called during the SSR flow via PrefetchPageLinksImpl so
    // don't assume window is available
    typeof window > "u" ? "server://singlefetch/" : window.location.origin
  ) : i;
  return r ? h.pathname.endsWith("/") ? h.pathname = `${h.pathname}_.${s}` : h.pathname = `${h.pathname}.${s}` : h.pathname === "/" ? h.pathname = `_root.${s}` : f && vl(h.pathname, f) === "/" ? h.pathname = `${Ei(f)}/_root.${s}` : h.pathname = `${Ei(h.pathname)}.${s}`, h;
}
async function k0(i, f) {
  if (i.id in f)
    return f[i.id];
  try {
    let r = await import(
      /* @vite-ignore */
      /* webpackIgnore: true */
      i.module
    );
    return f[i.id] = r, r;
  } catch (r) {
    return console.error(
      `Error loading route module \`${i.module}\`, reloading page...`
    ), console.error(r), window.__reactRouterContext && window.__reactRouterContext.isSpaMode, window.location.reload(), new Promise(() => {
    });
  }
}
function $0(i) {
  return i == null ? !1 : i.href == null ? i.rel === "preload" && typeof i.imageSrcSet == "string" && typeof i.imageSizes == "string" : typeof i.rel == "string" && typeof i.href == "string";
}
async function W0(i, f, r) {
  let s = await Promise.all(
    i.map(async (h) => {
      let m = f.routes[h.route.id];
      if (m) {
        let g = await k0(m, r);
        return g.links ? g.links() : [];
      }
      return [];
    })
  );
  return tp(
    s.flat(1).filter($0).filter((h) => h.rel === "stylesheet" || h.rel === "preload").map(
      (h) => h.rel === "stylesheet" ? { ...h, rel: "prefetch", as: "style" } : { ...h, rel: "prefetch" }
    )
  );
}
function Uh(i, f, r, s, h, m) {
  let g = (p, v) => r[v] ? p.route.id !== r[v].route.id : !0, x = (p, v) => (
    // param change, /users/123 -> /users/456
    r[v].pathname !== p.pathname || // splat param changed, which is not present in match.path
    // e.g. /files/images/avatar.jpg -> files/finances.xls
    r[v].route.path?.endsWith("*") && r[v].params["*"] !== p.params["*"]
  );
  return m === "assets" ? f.filter(
    (p, v) => g(p, v) || x(p, v)
  ) : m === "data" ? f.filter((p, v) => {
    let N = s.routes[p.route.id];
    if (!N || !N.hasLoader)
      return !1;
    if (g(p, v) || x(p, v))
      return !0;
    if (p.route.shouldRevalidate) {
      let E = p.route.shouldRevalidate({
        currentUrl: new URL(
          h.pathname + h.search + h.hash,
          window.origin
        ),
        currentParams: r[0]?.params || {},
        nextUrl: new URL(i, window.origin),
        nextParams: p.params,
        defaultShouldRevalidate: !0
      });
      if (typeof E == "boolean")
        return E;
    }
    return !0;
  }) : [];
}
function F0(i, f, { includeHydrateFallback: r } = {}) {
  return P0(
    i.map((s) => {
      let h = f.routes[s.route.id];
      if (!h) return [];
      let m = [h.module];
      return h.clientActionModule && (m = m.concat(h.clientActionModule)), h.clientLoaderModule && (m = m.concat(h.clientLoaderModule)), r && h.hydrateFallbackModule && (m = m.concat(h.hydrateFallbackModule)), h.imports && (m = m.concat(h.imports)), m;
    }).flat(1)
  );
}
function P0(i) {
  return [...new Set(i)];
}
function I0(i) {
  let f = {}, r = Object.keys(i).sort();
  for (let s of r)
    f[s] = i[s];
  return f;
}
function tp(i, f) {
  let r = /* @__PURE__ */ new Set();
  return new Set(f), i.reduce((s, h) => {
    let m = JSON.stringify(I0(h));
    return r.has(m) || (r.add(m), s.push({ key: m, link: h })), s;
  }, []);
}
function mf() {
  let i = A.useContext(Ka);
  return hf(
    i,
    "You must render this element inside a <DataRouterContext.Provider> element"
  ), i;
}
function ep() {
  let i = A.useContext(zi);
  return hf(
    i,
    "You must render this element inside a <DataRouterStateContext.Provider> element"
  ), i;
}
var vf = A.createContext(void 0);
vf.displayName = "FrameworkContext";
function Ri() {
  let i = A.useContext(vf);
  return hf(
    i,
    "You must render this element inside a <HydratedRouter> element"
  ), i;
}
function lp(i, f) {
  let r = A.useContext(vf), [s, h] = A.useState(!1), [m, g] = A.useState(!1), { onFocus: x, onBlur: p, onMouseEnter: v, onMouseLeave: N, onTouchStart: E } = f, z = A.useRef(null);
  A.useEffect(() => {
    if (i === "render" && g(!0), i === "viewport") {
      let Y = (Z) => {
        Z.forEach((k) => {
          g(k.isIntersecting);
        });
      }, B = new IntersectionObserver(Y, { threshold: 0.5 });
      return z.current && B.observe(z.current), () => {
        B.disconnect();
      };
    }
  }, [i]), A.useEffect(() => {
    if (s) {
      let Y = setTimeout(() => {
        g(!0);
      }, 100);
      return () => {
        clearTimeout(Y);
      };
    }
  }, [s]);
  let L = () => {
    h(!0);
  }, q = () => {
    h(!1), g(!1);
  };
  return r ? i !== "intent" ? [m, z, {}] : [
    m,
    z,
    {
      onFocus: Zn(x, L),
      onBlur: Zn(p, q),
      onMouseEnter: Zn(v, L),
      onMouseLeave: Zn(N, q),
      onTouchStart: Zn(E, L)
    }
  ] : [!1, z, {}];
}
function Zn(i, f) {
  return (r) => {
    i && i(r), r.defaultPrevented || f(r);
  };
}
function ap({ page: i, ...f }) {
  let r = y0(), { nonce: s } = Ri(), { router: h } = mf(), m = A.useMemo(
    () => qh(h.routes, i, h.basename),
    [h.routes, i, h.basename]
  );
  return m ? (f.nonce == null && s && (f = { ...f, nonce: s }), r ? /* @__PURE__ */ A.createElement(up, { page: i, matches: m, ...f }) : /* @__PURE__ */ A.createElement(ip, { page: i, matches: m, ...f })) : null;
}
function np(i) {
  let { manifest: f, routeModules: r } = Ri(), [s, h] = A.useState([]);
  return A.useEffect(() => {
    let m = !1;
    return W0(i, f, r).then(
      (g) => {
        m || h(g);
      }
    ), () => {
      m = !0;
    };
  }, [i, f, r]), s;
}
function up({
  page: i,
  matches: f,
  ...r
}) {
  let s = we(), { future: h } = Ri(), { basename: m } = mf(), g = A.useMemo(() => {
    if (i === s.pathname + s.search + s.hash)
      return [];
    let x = lm(
      i,
      m,
      h.v8_trailingSlashAwareDataRequests,
      "rsc"
    ), p = !1, v = [];
    for (let N of f)
      typeof N.route.shouldRevalidate == "function" ? p = !0 : v.push(N.route.id);
    return p && v.length > 0 && x.searchParams.set("_routes", v.join(",")), [x.pathname + x.search];
  }, [
    m,
    h.v8_trailingSlashAwareDataRequests,
    i,
    s,
    f
  ]);
  return /* @__PURE__ */ A.createElement(A.Fragment, null, g.map((x) => /* @__PURE__ */ A.createElement("link", { key: x, rel: "prefetch", as: "fetch", href: x, ...r })));
}
function ip({
  page: i,
  matches: f,
  ...r
}) {
  let s = we(), { future: h, manifest: m, routeModules: g } = Ri(), { basename: x } = mf(), { loaderData: p, matches: v } = ep(), N = A.useMemo(
    () => Uh(
      i,
      f,
      v,
      m,
      s,
      "data"
    ),
    [i, f, v, m, s]
  ), E = A.useMemo(
    () => Uh(
      i,
      f,
      v,
      m,
      s,
      "assets"
    ),
    [i, f, v, m, s]
  ), z = A.useMemo(() => {
    if (i === s.pathname + s.search + s.hash)
      return [];
    let Y = /* @__PURE__ */ new Set(), B = !1;
    if (f.forEach((k) => {
      let X = m.routes[k.route.id];
      !X || !X.hasLoader || (!N.some((lt) => lt.route.id === k.route.id) && k.route.id in p && g[k.route.id]?.shouldRevalidate || X.hasClientLoader ? B = !0 : Y.add(k.route.id));
    }), Y.size === 0)
      return [];
    let Z = lm(
      i,
      x,
      h.v8_trailingSlashAwareDataRequests,
      "data"
    );
    return B && Y.size > 0 && Z.searchParams.set(
      "_routes",
      f.filter((k) => Y.has(k.route.id)).map((k) => k.route.id).join(",")
    ), [Z.pathname + Z.search];
  }, [
    x,
    h.v8_trailingSlashAwareDataRequests,
    p,
    s,
    m,
    N,
    f,
    i,
    g
  ]), L = A.useMemo(
    () => F0(E, m),
    [E, m]
  ), q = np(E);
  return /* @__PURE__ */ A.createElement(A.Fragment, null, z.map((Y) => /* @__PURE__ */ A.createElement("link", { key: Y, rel: "prefetch", as: "fetch", href: Y, ...r })), L.map((Y) => /* @__PURE__ */ A.createElement("link", { key: Y, rel: "modulepreload", href: Y, ...r })), q.map(({ key: Y, link: B }) => (
    // these don't spread `linkProps` because they are full link descriptors
    // already with their own props
    /* @__PURE__ */ A.createElement(
      "link",
      {
        key: Y,
        nonce: r.nonce,
        ...B,
        crossOrigin: B.crossOrigin ?? r.crossOrigin
      }
    )
  )));
}
function cp(...i) {
  return (f) => {
    i.forEach((r) => {
      typeof r == "function" ? r(f) : r != null && (r.current = f);
    });
  };
}
var sp = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
try {
  sp && (window.__reactRouterVersion = // @ts-expect-error
  "7.18.2");
} catch {
}
function fp({
  basename: i,
  children: f,
  useTransitions: r,
  window: s
}) {
  let h = A.useRef();
  h.current == null && (h.current = Xy({ window: s, v5Compat: !0 }));
  let m = h.current, [g, x] = A.useState({
    action: m.action,
    location: m.location
  }), p = A.useCallback(
    (v) => {
      r === !1 ? x(v) : A.startTransition(() => x(v));
    },
    [r]
  );
  return A.useLayoutEffect(() => m.listen(p), [m, p]), /* @__PURE__ */ A.createElement(
    q0,
    {
      basename: i,
      children: f,
      location: g.location,
      navigationType: g.action,
      navigator: m,
      useTransitions: r
    }
  );
}
var ml = A.forwardRef(
  function({
    onClick: f,
    discover: r = "render",
    prefetch: s = "none",
    relative: h,
    reloadDocument: m,
    replace: g,
    mask: x,
    state: p,
    target: v,
    to: N,
    preventScrollReset: E,
    viewTransition: z,
    defaultShouldRevalidate: L,
    ...q
  }, Y) {
    let { basename: B, navigator: Z, useTransitions: k } = A.useContext(be), X = typeof N == "string" && sf.test(N), lt = Vh(N, B);
    N = lt.to;
    let it = E0(N, { relative: h }), At = we(), F = null;
    if (x) {
      let Bt = ji(
        x,
        [],
        At.mask ? At.mask.pathname : "/",
        !0
      );
      B !== "/" && (Bt.pathname = Bt.pathname === "/" ? B : Ye([B, Bt.pathname])), F = Z.createHref(Bt);
    }
    let [Ct, $t, Ge] = lp(
      s,
      q
    ), Se = dp(N, {
      replace: g,
      mask: x,
      state: p,
      target: v,
      preventScrollReset: E,
      relative: h,
      viewTransition: z,
      defaultShouldRevalidate: L,
      useTransitions: k
    });
    function Wt(Bt) {
      f && f(Bt), Bt.defaultPrevented || Se(Bt);
    }
    let Xe = !(lt.isExternal || m), xe = (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      /* @__PURE__ */ A.createElement(
        "a",
        {
          ...q,
          ...Ge,
          href: (Xe ? F : void 0) || lt.absoluteURL || it,
          onClick: Xe ? Wt : f,
          ref: cp(Y, $t),
          target: v,
          "data-discover": !X && r === "render" ? "true" : void 0
        }
      )
    );
    return Ct && !X ? /* @__PURE__ */ A.createElement(A.Fragment, null, xe, /* @__PURE__ */ A.createElement(ap, { page: it })) : xe;
  }
);
ml.displayName = "Link";
var Si = A.forwardRef(
  function({
    "aria-current": f = "page",
    caseSensitive: r = !1,
    className: s = "",
    end: h = !1,
    style: m,
    to: g,
    viewTransition: x,
    children: p,
    ...v
  }, N) {
    let E = $n(g, { relative: v.relative }), z = we(), L = A.useContext(zi), { navigator: q, basename: Y } = A.useContext(be), B = L != null && // Conditional usage is OK here because the usage of a data router is static
    // eslint-disable-next-line react-hooks/rules-of-hooks
    pp(E) && x === !0, Z = q.encodeLocation ? q.encodeLocation(E).pathname : E.pathname, k = z.pathname, X = L && L.navigation && L.navigation.location ? L.navigation.location.pathname : null;
    r || (k = k.toLowerCase(), X = X ? X.toLowerCase() : null, Z = Z.toLowerCase()), X && Y && (X = vl(X, Y) || X);
    const lt = Z !== "/" && Z.endsWith("/") ? Z.length - 1 : Z.length;
    let it = k === Z || !h && k.startsWith(Z) && k.charAt(lt) === "/", At = X != null && (X === Z || !h && X.startsWith(Z) && X.charAt(Z.length) === "/"), F = {
      isActive: it,
      isPending: At,
      isTransitioning: B
    }, Ct = it ? f : void 0, $t;
    typeof s == "function" ? $t = s(F) : $t = [
      s,
      it ? "active" : null,
      At ? "pending" : null,
      B ? "transitioning" : null
    ].filter(Boolean).join(" ");
    let Ge = typeof m == "function" ? m(F) : m;
    return /* @__PURE__ */ A.createElement(
      ml,
      {
        ...v,
        "aria-current": Ct,
        className: $t,
        ref: N,
        style: Ge,
        to: g,
        viewTransition: x
      },
      typeof p == "function" ? p(F) : p
    );
  }
);
Si.displayName = "NavLink";
var rp = A.forwardRef(
  ({
    discover: i = "render",
    fetcherKey: f,
    navigate: r,
    reloadDocument: s,
    replace: h,
    state: m,
    method: g = gi,
    action: x,
    onSubmit: p,
    relative: v,
    preventScrollReset: N,
    viewTransition: E,
    defaultShouldRevalidate: z,
    ...L
  }, q) => {
    let { useTransitions: Y } = A.useContext(be), B = vp(), Z = yp(x, { relative: v }), k = g.toLowerCase() === "get" ? "get" : "post", X = typeof x == "string" && sf.test(x), lt = (it) => {
      if (p && p(it), it.defaultPrevented) return;
      it.preventDefault();
      let At = it.nativeEvent.submitter, F = At?.getAttribute("formmethod") || g, Ct = () => B(At || it.currentTarget, {
        fetcherKey: f,
        method: F,
        navigate: r,
        replace: h,
        state: m,
        relative: v,
        preventScrollReset: N,
        viewTransition: E,
        defaultShouldRevalidate: z
      });
      Y && r !== !1 ? A.startTransition(() => Ct()) : Ct();
    };
    return /* @__PURE__ */ A.createElement(
      "form",
      {
        ref: q,
        method: k,
        action: Z,
        onSubmit: s ? p : lt,
        ...L,
        "data-discover": !X && i === "render" ? "true" : void 0
      }
    );
  }
);
rp.displayName = "Form";
function op(i) {
  return `${i} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function am(i) {
  let f = A.useContext(Ka);
  return zt(f, op(i)), f;
}
function dp(i, {
  target: f,
  replace: r,
  mask: s,
  state: h,
  preventScrollReset: m,
  relative: g,
  viewTransition: x,
  defaultShouldRevalidate: p,
  useTransitions: v
} = {}) {
  let N = Ph(), E = we(), z = $n(i, { relative: g });
  return A.useCallback(
    (L) => {
      if (Z0(L, f)) {
        L.preventDefault();
        let q = r !== void 0 ? r : Jn(E) === Jn(z), Y = () => N(i, {
          replace: q,
          mask: s,
          state: h,
          preventScrollReset: m,
          relative: g,
          viewTransition: x,
          defaultShouldRevalidate: p
        });
        v ? A.startTransition(() => Y()) : Y();
      }
    },
    [
      E,
      N,
      z,
      r,
      s,
      h,
      f,
      i,
      m,
      g,
      x,
      p,
      v
    ]
  );
}
var hp = 0, mp = () => `__${String(++hp)}__`;
function vp() {
  let { router: i } = am(
    "useSubmit"
    /* UseSubmit */
  ), { basename: f } = A.useContext(be), r = U0(), s = i.fetch, h = i.navigate;
  return A.useCallback(
    async (m, g = {}) => {
      let { action: x, method: p, encType: v, formData: N, body: E } = J0(
        m,
        f
      );
      if (g.navigate === !1) {
        let z = g.fetcherKey || mp();
        await s(z, r, g.action || x, {
          defaultShouldRevalidate: g.defaultShouldRevalidate,
          preventScrollReset: g.preventScrollReset,
          formData: N,
          body: E,
          formMethod: g.method || p,
          formEncType: g.encType || v,
          flushSync: g.flushSync
        });
      } else
        await h(g.action || x, {
          defaultShouldRevalidate: g.defaultShouldRevalidate,
          preventScrollReset: g.preventScrollReset,
          formData: N,
          body: E,
          formMethod: g.method || p,
          formEncType: g.encType || v,
          replace: g.replace,
          state: g.state,
          fromRouteId: r,
          flushSync: g.flushSync,
          viewTransition: g.viewTransition
        });
    },
    [s, h, f, r]
  );
}
function yp(i, { relative: f } = {}) {
  let { basename: r } = A.useContext(be), s = A.useContext(ke);
  zt(s, "useFormAction must be used inside a RouteContext");
  let [h] = s.matches.slice(-1), m = { ...$n(i || ".", { relative: f }) }, g = we();
  if (i == null) {
    m.search = g.search;
    let x = new URLSearchParams(m.search), p = x.getAll("index");
    if (p.some((N) => N === "")) {
      x.delete("index"), p.filter((E) => E).forEach((E) => x.append("index", E));
      let N = x.toString();
      m.search = N ? `?${N}` : "";
    }
  }
  return (!i || i === ".") && h.route.index && (m.search = m.search ? m.search.replace(/^\?/, "?index&") : "?index"), r !== "/" && (m.pathname = m.pathname === "/" ? r : Ye([r, m.pathname])), Jn(m);
}
function pp(i, { relative: f } = {}) {
  let r = A.useContext(kh);
  zt(
    r != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?"
  );
  let { basename: s } = am(
    "useViewTransitionState"
    /* useViewTransitionState */
  ), h = $n(i, { relative: f });
  if (!r.isTransitioning)
    return !1;
  let m = vl(r.currentLocation.pathname, s) || r.currentLocation.pathname, g = vl(r.nextLocation.pathname, s) || r.nextLocation.pathname;
  return _i(h.pathname, g) != null || _i(h.pathname, m) != null;
}
const gp = "/dsc_hub/assets", bp = {
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
  gauge: "gauges/dsc-gauge-arc.svg"
};
function Hh(i) {
  return `${gp}/${bp[i]}`;
}
const nm = A.createContext(null);
function Sp(i) {
  if (!i) return !1;
  const f = i.toLowerCase();
  return f.includes("dsc_") || f.includes("dsc-") || f.startsWith("sensor.dsc") || f.startsWith("switch.dsc") || f.startsWith("binary_sensor.dsc") || f.startsWith("number.dsc") || f.startsWith("light.dsc") || f.startsWith("input_");
}
function xp({
  hass: i,
  children: f
}) {
  const [r, s] = A.useState(0);
  A.useEffect(() => {
    if (!i) return;
    s((v) => v + 1);
    const m = i.connection;
    if (!m?.subscribeEvents) return;
    let g, x = !1;
    const p = (v) => {
      const N = v.data?.entity_id;
      Sp(N) && s((E) => E + 1);
    };
    return Promise.resolve(m.subscribeEvents(p, "state_changed")).then((v) => {
      if (x) {
        v();
        return;
      }
      g = v;
    }).catch(() => {
    }), () => {
      x = !0, g?.();
    };
  }, [i]);
  const h = A.useMemo(() => {
    const m = (E) => i?.states?.[E], g = (E) => {
      const z = m(E)?.state;
      return !!z && z !== "unavailable" && z !== "unknown";
    }, x = (E, z = "—") => g(E) ? m(E)?.state ?? z : z;
    return { hass: i, entity: m, state: x, num: (E, z = NaN) => {
      const L = Number(x(E, ""));
      return Number.isFinite(L) ? L : z;
    }, available: g, callService: (E, z, L) => i?.callService ? i.callService(E, z, L) : Promise.resolve(null), callWS: (E) => i?.callWS ? i.callWS(E) : Promise.resolve(null), tick: r };
  }, [i, r]);
  return A.createElement(nm.Provider, { value: h }, f);
}
function He() {
  const i = A.useContext(nm);
  if (!i) throw new Error("useHass outside HassProvider");
  return i;
}
function xi({
  name: i,
  size: f = 16,
  className: r,
  color: s = "currentColor"
}) {
  return /* @__PURE__ */ d.jsx(
    "span",
    {
      className: r,
      role: "img",
      "aria-hidden": !0,
      style: {
        display: "inline-block",
        width: f,
        height: f,
        backgroundColor: s,
        WebkitMaskImage: `url(${Hh(i)})`,
        maskImage: `url(${Hh(i)})`,
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
function St({
  title: i,
  children: f,
  className: r = "",
  style: s
}) {
  return /* @__PURE__ */ d.jsxs("section", { className: `dsc-card ${r}`.trim(), style: s, children: [
    i ? /* @__PURE__ */ d.jsx("h3", { children: i }) : null,
    f
  ] });
}
function ia({
  children: i,
  primary: f,
  onClick: r,
  type: s = "button",
  disabled: h
}) {
  return /* @__PURE__ */ d.jsx(
    "button",
    {
      type: s,
      className: `dsc-btn${f ? " primary" : ""}`,
      onClick: r,
      disabled: h,
      children: i
    }
  );
}
function Mt({
  label: i,
  value: f,
  unit: r,
  sub: s,
  tone: h = "normal"
}) {
  const m = h === "ok" ? "dsc-status-ok" : h === "bad" ? "dsc-status-bad" : h === "muted" ? "dsc-status-muted" : "";
  return /* @__PURE__ */ d.jsxs(St, { title: i, children: [
    /* @__PURE__ */ d.jsxs("div", { className: `dsc-kpi-value ${m}`.trim(), children: [
      f,
      r ? /* @__PURE__ */ d.jsx("span", { className: "dsc-kpi-unit", children: r }) : null
    ] }),
    s ? /* @__PURE__ */ d.jsx("div", { className: "dsc-kpi-sub", children: s }) : null
  ] });
}
function It({
  title: i,
  subtitle: f
}) {
  return /* @__PURE__ */ d.jsxs("header", { style: { marginBottom: 14 }, children: [
    /* @__PURE__ */ d.jsx("h1", { className: "dsc-page-title", children: i }),
    f ? /* @__PURE__ */ d.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: f }) : null
  ] });
}
function Je({
  label: i,
  tone: f = "muted",
  pulse: r
}) {
  return /* @__PURE__ */ d.jsx("span", { className: `dsc-chip dsc-chip--${f}${r ? " dsc-chip--pulse" : ""}`, children: i });
}
function hl({
  entityId: i,
  label: f,
  warnWhenMissing: r
}) {
  const { state: s, available: h, callService: m, entity: g } = He(), x = s(i, "off") === "on", p = h(i), v = i.split(".")[0], N = () => {
    if (p) {
      if (v === "switch" || v === "input_boolean") {
        m("homeassistant", "toggle", { entity_id: i });
        return;
      }
      v === "light" && m("light", x ? "turn_off" : "turn_on", { entity_id: i });
    }
  }, E = v === "light" && x ? Math.round(Number(g(i)?.attributes?.brightness ?? 0) / 255 * 100) : null;
  return /* @__PURE__ */ d.jsxs(
    "button",
    {
      type: "button",
      className: `dsc-demand${x ? " is-on" : ""}${p ? "" : " is-missing"}`,
      onClick: N,
      disabled: !p && !r,
      title: p ? i : r || `${i} unavailable`,
      children: [
        /* @__PURE__ */ d.jsx("span", { className: "dsc-demand-label", children: f }),
        /* @__PURE__ */ d.jsx("span", { className: "dsc-demand-state", children: p ? E != null ? `${E}%` : x ? "ON" : "OFF" : r || "—" })
      ]
    }
  );
}
function pi({
  entityId: i,
  label: f
}) {
  const { state: r, available: s } = He(), h = s(i) && r(i) === "on";
  return /* @__PURE__ */ d.jsxs("span", { className: `dsc-chip ${h ? "dsc-chip--ok dsc-chip--pulse" : "dsc-chip--muted"}`, children: [
    f,
    " ",
    h ? "ESP" : "HA"
  ] });
}
function _p(i) {
  if (typeof i.lu == "number" && Number.isFinite(i.lu))
    return i.lu * 1e3;
  const f = i.last_changed || i.last_updated;
  if (f) {
    const r = Date.parse(f);
    return Number.isFinite(r) ? r : null;
  }
  return null;
}
function Ep(i) {
  const f = i.s ?? i.state, r = typeof f == "number" ? f : Number(f);
  return Number.isFinite(r) ? r : null;
}
function Tp(i, f) {
  if (i.length <= f) return i;
  const r = [], s = (i.length - 1) / (f - 1);
  for (let h = 0; h < f; h++)
    r.push(i[Math.round(h * s)]);
  return r;
}
function jp(i, f = 6, r = 96) {
  const { hass: s, callWS: h, available: m } = He(), [g, x] = A.useState([]), [p, v] = A.useState(!0), [N, E] = A.useState(null);
  return A.useEffect(() => {
    let z = !1;
    async function L() {
      if (!s?.callWS || !i) {
        x([]), v(!1);
        return;
      }
      v(!0), E(null);
      const q = /* @__PURE__ */ new Date(), Y = new Date(q.getTime() - f * 3600 * 1e3);
      try {
        const B = await h({
          type: "history/history_during_period",
          start_time: Y.toISOString(),
          end_time: q.toISOString(),
          significant_changes_only: !1,
          minimal_response: !0,
          no_attributes: !0,
          entity_ids: [i]
        });
        if (z) return;
        let Z = [];
        Array.isArray(B) ? Z = B[0] || [] : B && typeof B == "object" && (Z = B[i] || []);
        const k = [];
        for (const X of Z) {
          const lt = _p(X), it = Ep(X);
          lt == null || it == null || k.push({ t: lt, v: it });
        }
        k.sort((X, lt) => X.t - lt.t), x(Tp(k, r));
      } catch (B) {
        z || (E(B instanceof Error ? B.message : "history unavailable"), x([]));
      } finally {
        z || v(!1);
      }
    }
    return L(), () => {
      z = !0;
    };
  }, [s, h, i, f, r, m]), { points: g, loading: p, error: N };
}
function Ce(i, f) {
  const r = f?.maxPoints ?? 96, s = f?.hours ?? 6, { num: h, available: m, tick: g } = He(), { points: x } = jp(i, s, r), [p, v] = A.useState([]), N = A.useRef(null), E = A.useRef(!1);
  return A.useEffect(() => {
    E.current = !1, v([]), N.current = null;
  }, [i]), A.useEffect(() => {
    if (x.length && !E.current) {
      E.current = !0;
      const z = x[x.length - 1]?.v;
      Number.isFinite(z) && (N.current = z);
    }
  }, [x]), A.useEffect(() => {
    if (!i || !m(i)) return;
    const z = h(i);
    if (Number.isFinite(z)) {
      if (N.current === z && p.length > 0) {
        const L = Date.now(), q = p[p.length - 1]?.t ?? 0;
        if (L - q < 4e3) return;
      }
      N.current = z, v((L) => [...L, { t: Date.now(), v: z }].slice(-r));
    }
  }, [i, g, m, h, r]), A.useMemo(() => {
    if (!x.length && !p.length) return p;
    if (!p.length) return x;
    if (!x.length) return p;
    const z = p[0]?.t ?? 0, q = [...x.filter((Y) => Y.t < z - 500), ...p];
    return q.length > r ? q.slice(-r) : q;
  }, [x, p, r]);
}
function zp(i) {
  const f = Math.max(...i, 1), r = 10 ** Math.floor(Math.log10(f));
  return Math.ceil(f / r) * r;
}
function Ap(i, f = !1) {
  const r = Math.min(...i);
  if (f && r >= 0) return 0;
  const s = Math.abs(r) || 1, h = 10 ** Math.floor(Math.log10(s));
  return Math.floor(r / h) * h;
}
function af(i, f, r, s, h, m, g, x) {
  if (!i.length) return "";
  const p = Math.max(m - h, 1e-6), v = Math.max(x - g, 1), N = f - s.l - s.r, E = r - s.t - s.b;
  return i.map((z, L) => {
    const q = s.l + (z.t - g) / v * N, Y = s.t + (1 - (z.v - h) / p) * E;
    return `${L === 0 ? "M" : "L"}${q.toFixed(1)} ${Y.toFixed(1)}`;
  }).join(" ");
}
function Ti({
  series: i,
  height: f = 160,
  unit: r = "",
  live: s = !0,
  color: h = "var(--dsc-neon)",
  emptyLabel: m = "No history yet"
}) {
  return /* @__PURE__ */ d.jsx(
    Kn,
    {
      series: [{ id: "main", label: "", series: i, color: h }],
      height: f,
      unit: r,
      live: s,
      emptyLabel: m
    }
  );
}
function Kn({
  series: i,
  height: f = 180,
  unit: r = "",
  live: s = !0,
  emptyLabel: h = "No history yet"
}) {
  const m = A.useId().replace(/:/g, ""), g = 640, x = { l: 36, r: 12, t: 16, b: 22 }, p = ["var(--dsc-neon)", "#7dd3fc", "#fbbf24", "#f472b6"], v = A.useMemo(() => {
    const z = i.flatMap((X) => X.series);
    if (!z.length) return null;
    const L = z.map((X) => X.v), q = zp(L), Y = Ap(L, !0), B = Math.min(...z.map((X) => X.t)), Z = Math.max(...z.map((X) => X.t)), k = i.map((X, lt) => ({
      ...X,
      color: X.color || p[lt % p.length],
      d: af(X.series, g, f, x, Y, q, B, Z),
      last: X.series.length ? X.series[X.series.length - 1] : null
    }));
    return { min: Y, max: q, t0: B, t1: Z, paths: k };
  }, [i, f]), N = v?.paths[0]?.last?.v ?? null, E = A.useMemo(() => {
    if (!v) return [];
    const z = 4, L = [];
    for (let q = 0; q <= z; q++) {
      const Y = q / z, B = v.max - Y * (v.max - v.min), Z = x.t + Y * (f - x.t - x.b);
      L.push({ y: Z, label: B.toFixed(B >= 100 ? 0 : 1) });
    }
    return L;
  }, [v, f]);
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-chart", style: { position: "relative", width: "100%" }, children: [
    /* @__PURE__ */ d.jsxs(
      "svg",
      {
        viewBox: `0 0 ${g} ${f}`,
        width: "100%",
        height: f,
        role: "img",
        "aria-label": "Live chart",
        children: [
          /* @__PURE__ */ d.jsxs("defs", { children: [
            v?.paths.map((z) => /* @__PURE__ */ d.jsxs("linearGradient", { id: `fill-${m}-${z.id}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ d.jsx("stop", { offset: "0%", stopColor: z.color, stopOpacity: "0.28" }),
              /* @__PURE__ */ d.jsx("stop", { offset: "100%", stopColor: z.color, stopOpacity: "0" })
            ] }, z.id)),
            /* @__PURE__ */ d.jsxs("filter", { id: `glow-${m}`, x: "-30%", y: "-30%", width: "160%", height: "160%", children: [
              /* @__PURE__ */ d.jsx("feGaussianBlur", { stdDeviation: "2.6", result: "b" }),
              /* @__PURE__ */ d.jsxs("feMerge", { children: [
                /* @__PURE__ */ d.jsx("feMergeNode", { in: "b" }),
                /* @__PURE__ */ d.jsx("feMergeNode", { in: "SourceGraphic" })
              ] })
            ] })
          ] }),
          E.map((z) => /* @__PURE__ */ d.jsxs("g", { children: [
            /* @__PURE__ */ d.jsx(
              "line",
              {
                x1: x.l,
                x2: g - x.r,
                y1: z.y,
                y2: z.y,
                stroke: "var(--dsc-gray-3)",
                strokeWidth: "1",
                strokeDasharray: "3 4"
              }
            ),
            /* @__PURE__ */ d.jsx(
              "text",
              {
                x: x.l - 6,
                y: z.y + 3,
                textAnchor: "end",
                fill: "var(--dsc-gray-5)",
                fontSize: "9",
                fontFamily: "var(--dsc-mono)",
                children: z.label
              }
            )
          ] }, z.y)),
          v ? v.paths.map((z) => {
            if (!z.d) return null;
            const L = `${z.d} L${g - x.r} ${f - x.b} L${x.l} ${f - x.b} Z`, q = z.series, Y = s && q.length >= 2 ? af(q.slice(-2), g, f, x, v.min, v.max, v.t0, v.t1) : "", B = s && q.length >= 2 ? af(q.slice(0, -1), g, f, x, v.min, v.max, v.t0, v.t1) : z.d;
            return /* @__PURE__ */ d.jsxs("g", { children: [
              /* @__PURE__ */ d.jsx("path", { d: L, fill: `url(#fill-${m}-${z.id})`, opacity: 0.9 }),
              /* @__PURE__ */ d.jsx(
                "path",
                {
                  d: B || z.d,
                  fill: "none",
                  stroke: z.color,
                  strokeWidth: "2.2",
                  strokeLinejoin: "round",
                  strokeLinecap: "round",
                  filter: `url(#glow-${m})`,
                  opacity: 0.9
                }
              ),
              Y ? /* @__PURE__ */ d.jsx(
                "path",
                {
                  className: "dsc-live-pulse",
                  d: Y,
                  fill: "none",
                  stroke: z.color,
                  strokeWidth: "2.8",
                  strokeLinejoin: "round",
                  strokeLinecap: "round",
                  filter: `url(#glow-${m})`,
                  style: { animation: "dsc-line-pulse 2.2s ease-in-out infinite" }
                }
              ) : null
            ] }, z.id);
          }) : /* @__PURE__ */ d.jsx(
            "text",
            {
              x: g / 2,
              y: f / 2,
              textAnchor: "middle",
              fill: "var(--dsc-gray-5)",
              fontSize: "12",
              children: h
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ d.jsxs("div", { className: "dsc-chart-legend", children: [
      i.filter((z) => z.label).map((z, L) => /* @__PURE__ */ d.jsxs("span", { className: "dsc-chart-legend-item", children: [
        /* @__PURE__ */ d.jsx("i", { style: { background: z.color || p[L % p.length] } }),
        z.label
      ] }, z.id)),
      N != null ? /* @__PURE__ */ d.jsxs("span", { className: "dsc-chart-last", children: [
        N.toFixed(1),
        r ? ` ${r}` : ""
      ] }) : null
    ] }),
    /* @__PURE__ */ d.jsx("style", { children: `
        @keyframes dsc-line-pulse {
          0%, 100% { opacity: 0.75; }
          50% { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dsc-live-pulse { animation: none !important; }
        }
      ` })
  ] });
}
function Rp(i, f = 280) {
  const [r, s] = A.useState(i);
  return A.useEffect(() => {
    if (!Number.isFinite(i)) {
      s(i);
      return;
    }
    const h = Number.isFinite(r) ? r : i, m = performance.now();
    let g = 0;
    const x = (p) => {
      const v = Math.min(1, (p - m) / f), N = 1 - (1 - v) ** 3;
      s(h + (i - h) * N), v < 1 && (g = requestAnimationFrame(x));
    };
    return g = requestAnimationFrame(x), () => cancelAnimationFrame(g);
  }, [i, f]), r;
}
function De({
  value: i,
  min: f = 0,
  max: r = 100,
  label: s,
  unit: h = ""
}) {
  const m = Rp(Number.isFinite(i) ? i : f), x = (Math.min(r, Math.max(f, Number.isFinite(m) ? m : f)) - f) / Math.max(r - f, 1e-6), v = 2 * Math.PI * 46 * 0.75, N = v * x;
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-gauge", children: [
    /* @__PURE__ */ d.jsxs("svg", { viewBox: "0 0 120 90", width: "140", height: "105", "aria-label": s, children: [
      /* @__PURE__ */ d.jsx("defs", { children: /* @__PURE__ */ d.jsxs("filter", { id: "dsc-gauge-glow", x: "-40%", y: "-40%", width: "180%", height: "180%", children: [
        /* @__PURE__ */ d.jsx("feGaussianBlur", { stdDeviation: "3.2", result: "b" }),
        /* @__PURE__ */ d.jsxs("feMerge", { children: [
          /* @__PURE__ */ d.jsx("feMergeNode", { in: "b" }),
          /* @__PURE__ */ d.jsx("feMergeNode", { in: "SourceGraphic" })
        ] })
      ] }) }),
      /* @__PURE__ */ d.jsx(
        "path",
        {
          d: "M18 72 A46 46 0 1 1 102 72",
          fill: "none",
          stroke: "var(--dsc-gray-3)",
          strokeWidth: "10",
          strokeLinecap: "round"
        }
      ),
      /* @__PURE__ */ d.jsx(
        "path",
        {
          d: "M18 72 A46 46 0 1 1 102 72",
          fill: "none",
          stroke: "var(--dsc-neon)",
          strokeWidth: "10",
          strokeLinecap: "round",
          strokeDasharray: `${N} ${v}`,
          filter: "url(#dsc-gauge-glow)",
          style: { transition: "stroke-dasharray 220ms ease" }
        }
      ),
      /* @__PURE__ */ d.jsx(
        "text",
        {
          x: "60",
          y: "58",
          textAnchor: "middle",
          fill: "var(--dsc-white)",
          fontSize: "20",
          fontWeight: "700",
          fontFamily: "var(--dsc-mono)",
          children: Number.isFinite(i) ? i.toFixed(i >= 100 ? 0 : 1) : "—"
        }
      ),
      /* @__PURE__ */ d.jsx("text", { x: "60", y: "74", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: h })
    ] }),
    /* @__PURE__ */ d.jsx("div", { className: "dsc-gauge-label", children: s })
  ] });
}
function Np(i) {
  return !Number.isFinite(i) || i <= 0 ? "—" : i >= 86400 ? `${(i / 86400).toFixed(1)}d` : i >= 3600 ? `${(i / 3600).toFixed(1)}h` : `${Math.round(i / 60)}m`;
}
const Op = [
  { id: "binary_sensor.dsc_hub_emergency_failsafe", label: "Emergency failsafe" },
  { id: "binary_sensor.dsc_hub_climate_sensor_fault", label: "Climate sensor fault" },
  { id: "binary_sensor.dsc_hub_aux_sensor_fault", label: "Aux sensor fault" },
  { id: "binary_sensor.dsc_hub_root_zone_sensor_fault", label: "Root-zone probes" },
  { id: "binary_sensor.dsc_clone_dark_period_violation", label: "Clone dark violation" },
  { id: "binary_sensor.dsc_reduced_kit", label: "Reduced kit" }
];
function Mp() {
  const { state: i, num: f, available: r } = He(), s = r("sensor.dsc_hub_uptime"), h = f("sensor.dsc_active_alert_count", 0), m = f("sensor.dsc_hub_tent_temperature"), g = f("sensor.dsc_hub_tent_humidity"), x = f("sensor.dsc_hub_vpd_kpa"), p = f("sensor.dsc_hub_room_temperature"), v = f("sensor.dsc_hub_clone_temperature"), N = f("sensor.dsc_hub_clone_humidity"), E = Ce("sensor.dsc_hub_tent_temperature"), z = Ce("sensor.dsc_hub_tent_humidity"), q = i("binary_sensor.dsc_hub_panel_link") === "on", Y = i("sensor.dsc_hub_heartbeat", "NO BEAT"), B = r("sensor.dsc_hub_heartbeat"), Z = i("sensor.dsc_fleet_version_status", "—"), k = i("switch.dsc_hub_manual_takeover") === "on", X = i("switch.dsc_hub_tent_manual_override") === "on", lt = Op.filter((it) => i(it.id) === "on");
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(
      It,
      {
        title: "Ops · Home",
        subtitle: "Live vitals — status, faults, demands, climate."
      }
    ),
    /* @__PURE__ */ d.jsxs("div", { className: "dsc-status-strip", children: [
      /* @__PURE__ */ d.jsx(Je, { label: s ? "HUB ONLINE" : "HUB OFFLINE", tone: s ? "ok" : "bad" }),
      /* @__PURE__ */ d.jsx(
        Je,
        {
          label: q ? "PANEL ESP-NOW" : r("sensor.dsc_control_wifi_rssi") ? "PANEL HA-ONLY" : "PANEL OFFLINE",
          tone: q ? "ok" : r("sensor.dsc_control_wifi_rssi") ? "warn" : "bad"
        }
      ),
      /* @__PURE__ */ d.jsx(
        Je,
        {
          label: B ? `BEAT ${Y}` : "NO BEAT",
          tone: B ? "ok" : "bad"
        }
      ),
      /* @__PURE__ */ d.jsx(
        Je,
        {
          label: `UP ${Np(f("sensor.dsc_hub_uptime"))}`,
          tone: s ? "ok" : "muted"
        }
      ),
      /* @__PURE__ */ d.jsx(
        Je,
        {
          label: h === 0 ? "All clear" : `${h} alert(s)`,
          tone: h === 0 ? "ok" : "bad",
          pulse: h > 0
        }
      ),
      /* @__PURE__ */ d.jsx(
        Je,
        {
          label: Z === "ok" ? "FLEET OK" : Z === "warn" ? "FLEET WARN" : "FLEET DRIFT",
          tone: Z === "ok" ? "ok" : Z === "warn" ? "warn" : "bad"
        }
      ),
      k ? /* @__PURE__ */ d.jsx(Je, { label: "MANUAL TAKEOVER", tone: "warn", pulse: !0 }) : null,
      X ? /* @__PURE__ */ d.jsx(Je, { label: "FAN OVERRIDE", tone: "warn", pulse: !0 }) : null
    ] }),
    /* @__PURE__ */ d.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ d.jsx(
        Mt,
        {
          label: "Tent temp",
          value: Number.isFinite(m) ? m.toFixed(1) : "—",
          unit: "°C",
          sub: `Room ${Number.isFinite(p) ? p.toFixed(1) : "—"} °C`
        }
      ) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ d.jsx(
        Mt,
        {
          label: "Tent RH",
          value: Number.isFinite(g) ? g.toFixed(0) : "—",
          unit: "%",
          sub: `VPD ${Number.isFinite(x) ? x.toFixed(2) : "—"} kPa`
        }
      ) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ d.jsx(
        Mt,
        {
          label: "Clone",
          value: Number.isFinite(v) ? v.toFixed(1) : "—",
          unit: "°C",
          sub: `RH ${Number.isFinite(N) ? N.toFixed(0) : "—"}%`
        }
      ) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ d.jsx(
        Mt,
        {
          label: "Surface",
          value: i("sensor.dsc_ha_surface_version", "6.1.0"),
          sub: `Fleet ${Z}`,
          tone: "ok"
        }
      ) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-8", children: /* @__PURE__ */ d.jsx(St, { title: "Live climate — tent T + RH", children: /* @__PURE__ */ d.jsx(
        Kn,
        {
          live: !0,
          unit: "",
          series: [
            {
              id: "temp",
              label: "Temp °C",
              series: E,
              color: "var(--dsc-neon)"
            },
            {
              id: "rh",
              label: "RH %",
              series: z,
              color: "#7dd3fc"
            }
          ]
        }
      ) }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ d.jsx(St, { title: "Gauges", children: /* @__PURE__ */ d.jsxs("div", { className: "dsc-gauge-row", children: [
        /* @__PURE__ */ d.jsx(De, { label: "Temp", value: m, min: 10, max: 40, unit: "°C" }),
        /* @__PURE__ */ d.jsx(De, { label: "RH", value: g, min: 0, max: 100, unit: "%" }),
        /* @__PURE__ */ d.jsx(De, { label: "VPD×10", value: x * 10, min: 0, max: 20, unit: "" })
      ] }) }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ d.jsx(St, { title: "Demands", children: /* @__PURE__ */ d.jsxs("div", { className: "dsc-demand-row", children: [
        /* @__PURE__ */ d.jsx(hl, { entityId: "switch.dsc_hub_heater_demand", label: "Heat" }),
        /* @__PURE__ */ d.jsx(
          hl,
          {
            entityId: "switch.dsc_hub_ac_demand",
            label: "Cool",
            warnWhenMissing: i("binary_sensor.dsc_ac_capacity_offline") === "on" ? "AC ○" : void 0
          }
        ),
        /* @__PURE__ */ d.jsx(hl, { entityId: "switch.dsc_hub_humidifier_demand", label: "Hum" }),
        /* @__PURE__ */ d.jsx(hl, { entityId: "switch.dsc_hub_dehumidifier_demand", label: "Dehum" }),
        /* @__PURE__ */ d.jsx(hl, { entityId: "switch.dsc_hub_grow_mat_demand", label: "Mat" }),
        /* @__PURE__ */ d.jsx(hl, { entityId: "switch.dsc_hub_clone_humidifier_demand", label: "C-Hum" }),
        /* @__PURE__ */ d.jsx(hl, { entityId: "light.dsc_hub_sf1000_dimmer", label: "SF1000" })
      ] }) }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ d.jsx(St, { title: "Overrides", children: /* @__PURE__ */ d.jsxs("div", { className: "dsc-demand-row dsc-demand-row--stack", children: [
        /* @__PURE__ */ d.jsx(hl, { entityId: "switch.dsc_hub_manual_takeover", label: "Manual takeover" }),
        /* @__PURE__ */ d.jsx(hl, { entityId: "switch.dsc_hub_tent_manual_override", label: "Fan override" })
      ] }) }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ d.jsx(St, { title: "Pot ESP-NOW", children: /* @__PURE__ */ d.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ d.jsx(pi, { entityId: "binary_sensor.dsc_hub_pot1_esp_now_link", label: "P1" }),
        /* @__PURE__ */ d.jsx(pi, { entityId: "binary_sensor.dsc_hub_pot2_esp_now_link", label: "P2" }),
        /* @__PURE__ */ d.jsx(pi, { entityId: "binary_sensor.dsc_hub_pot3_esp_now_link", label: "P3" }),
        /* @__PURE__ */ d.jsx(pi, { entityId: "binary_sensor.dsc_hub_pot4_esp_now_link", label: "P4" })
      ] }) }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ d.jsx(St, { title: "Faults / alerts", children: lt.length === 0 && h === 0 ? /* @__PURE__ */ d.jsx("div", { className: "dsc-empty dsc-empty--ok", children: "No active faults — all clear." }) : /* @__PURE__ */ d.jsxs("ul", { className: "dsc-fault-list", children: [
        lt.map((it) => /* @__PURE__ */ d.jsxs("li", { children: [
          /* @__PURE__ */ d.jsx(Je, { label: it.label, tone: "bad", pulse: !0 }),
          /* @__PURE__ */ d.jsx("span", { className: "dsc-muted", children: it.id })
        ] }, it.id)),
        h > 0 && lt.length === 0 ? /* @__PURE__ */ d.jsxs("li", { children: [
          /* @__PURE__ */ d.jsx(Je, { label: `${h} system alert(s)`, tone: "bad", pulse: !0 }),
          /* @__PURE__ */ d.jsx("span", { className: "dsc-muted", children: "See System for entity detail" })
        ] }) : null
      ] }) }) })
    ] })
  ] });
}
const Cp = [
  "/local/DSC-HUB.js",
  "/local/dsc-system-map-card.js",
  "/hacsfiles/DSC-HUB/DSC-HUB.js"
], Vn = /* @__PURE__ */ new Map();
let Bh = !1;
function Dp(i) {
  if (document.querySelector(`script[data-dsc-autoload="${i}"]`))
    return Vn.get(i) ?? Promise.resolve();
  if (Vn.has(i)) return Vn.get(i);
  const r = new Promise((s, h) => {
    const m = document.createElement("script");
    m.src = i, m.async = !0, m.dataset.dscAutoload = i, m.onload = () => s(), m.onerror = () => h(new Error(`Failed to load ${i}`)), document.head.appendChild(m);
  });
  return Vn.set(i, r), r;
}
async function Up(i, f = 12e3) {
  if (customElements.get(i)) return !0;
  if (Bh)
    await Promise.allSettled([...Vn.values()]);
  else {
    Bh = !0;
    for (const r of Cp)
      try {
        if (await Dp(r), customElements.get(i)) return !0;
      } catch {
      }
  }
  try {
    return await Promise.race([
      customElements.whenDefined(i),
      new Promise(
        (r, s) => window.setTimeout(() => s(new Error("timeout")), f)
      )
    ]), !!customElements.get(i);
  } catch {
    return !!customElements.get(i);
  }
}
function Ni({
  tag: i,
  config: f
}) {
  const r = A.useRef(null), { hass: s } = He(), [h, m] = A.useState("loading"), g = A.useRef(
    null
  ), x = JSON.stringify(f ?? {});
  return A.useEffect(() => {
    const p = r.current;
    if (!p) return;
    let v = !1;
    const N = x ? JSON.parse(x) : {};
    return (async () => {
      m("loading"), p.innerHTML = "";
      const E = await Up(i);
      if (v || !r.current) return;
      if (!E) {
        m("missing");
        const L = document.createElement("div");
        L.className = "dsc-empty", L.innerHTML = `<strong>${i}</strong> did not register.<br/>Tried /local/DSC-HUB.js and /local/dsc-system-map-card.js. Deploy the IIFE bundle or add it as a Lovelace resource, then hard-refresh.`, p.appendChild(L);
        return;
      }
      const z = document.createElement(i);
      typeof z.setConfig == "function" && z.setConfig({ type: `custom:${i}`, ...N }), s && (z.hass = s), p.appendChild(z), g.current = z, m("ready");
    })(), () => {
      v = !0, g.current = null, p.innerHTML = "";
    };
  }, [i, x]), A.useEffect(() => {
    g.current && s && (g.current.hass = s);
  }, [s]), /* @__PURE__ */ d.jsx(
    "div",
    {
      className: `dsc-legacy-host${h === "missing" ? " dsc-legacy-host--empty" : ""}`,
      ref: r,
      "data-status": h
    }
  );
}
function Pt(i, f = 1) {
  return Number.isFinite(i) ? i.toFixed(f) : "—";
}
function Hp() {
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(
      It,
      {
        title: "Ops · Dash",
        subtitle: "Cinematic digital twin — legacy Three.js card mounted in-panel."
      }
    ),
    /* @__PURE__ */ d.jsx(Ni, { tag: "dsc-the-dash-card", config: {} })
  ] });
}
function Bp() {
  const { num: i } = He(), f = Ce("sensor.dsc_hub_tent_temperature"), r = Ce("sensor.dsc_hub_tent_humidity"), s = Ce("sensor.dsc_cfm_exhaust_out"), h = Ce("sensor.dsc_cfm_exhaust_recirc"), m = Ce("sensor.dsc_fan_exhaust_outside_pct"), g = Ce("sensor.dsc_fan_exhaust_room_pct");
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(It, { title: "Ops · Climate", subtitle: "Zones, VPD, airflow CFM / fan duty." }),
    /* @__PURE__ */ d.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ d.jsx(Mt, { label: "Tent °C", value: Pt(i("sensor.dsc_hub_tent_temperature")), unit: "°C" }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ d.jsx(Mt, { label: "Tent RH", value: Pt(i("sensor.dsc_hub_tent_humidity"), 0), unit: "%" }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ d.jsx(Mt, { label: "VPD", value: Pt(i("sensor.dsc_hub_vpd_kpa"), 2), unit: "kPa" }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ d.jsx(Mt, { label: "Room °C", value: Pt(i("sensor.dsc_hub_room_temperature")), unit: "°C" }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ d.jsx(
        Mt,
        {
          label: "CFM OUT",
          value: Pt(i("sensor.dsc_cfm_exhaust_out"), 0),
          unit: "cfm",
          sub: `Fan ${Pt(i("sensor.dsc_fan_exhaust_outside_pct"), 0)}%`
        }
      ) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ d.jsx(
        Mt,
        {
          label: "CFM RECIRC",
          value: Pt(i("sensor.dsc_cfm_exhaust_recirc"), 0),
          unit: "cfm",
          sub: `Fan ${Pt(i("sensor.dsc_fan_exhaust_room_pct"), 0)}%`
        }
      ) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ d.jsx(Mt, { label: "Intake main", value: Pt(i("sensor.dsc_cfm_intake_main"), 0), unit: "cfm" }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ d.jsx(Mt, { label: "Intake 2×4", value: Pt(i("sensor.dsc_cfm_intake_2x4"), 0), unit: "cfm" }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ d.jsx(St, { title: "Tent temperature + RH", children: /* @__PURE__ */ d.jsx(
        Kn,
        {
          series: [
            { id: "t", label: "Temp °C", series: f, color: "var(--dsc-neon)" },
            { id: "rh", label: "RH %", series: r, color: "#7dd3fc" }
          ]
        }
      ) }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ d.jsx(St, { title: "Exhaust CFM", children: /* @__PURE__ */ d.jsx(
        Kn,
        {
          unit: "cfm",
          series: [
            { id: "out", label: "OUT", series: s, color: "var(--dsc-neon)" },
            { id: "recirc", label: "RECIRC", series: h, color: "#fbbf24" }
          ]
        }
      ) }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ d.jsx(St, { title: "Fan duty %", children: /* @__PURE__ */ d.jsx(
        Kn,
        {
          unit: "%",
          series: [
            { id: "fout", label: "OUT %", series: m, color: "#7dd3fc" },
            { id: "frec", label: "RECIRC %", series: g, color: "#f472b6" }
          ]
        }
      ) }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ d.jsx(St, { title: "Zone gauges", children: /* @__PURE__ */ d.jsxs("div", { className: "dsc-gauge-row", children: [
        /* @__PURE__ */ d.jsx(De, { label: "Tent T", value: i("sensor.dsc_hub_tent_temperature"), min: 15, max: 35, unit: "°C" }),
        /* @__PURE__ */ d.jsx(De, { label: "Tent RH", value: i("sensor.dsc_hub_tent_humidity"), min: 0, max: 100, unit: "%" }),
        /* @__PURE__ */ d.jsx(De, { label: "VPD×10", value: i("sensor.dsc_hub_vpd_kpa") * 10, min: 0, max: 20, unit: "" }),
        /* @__PURE__ */ d.jsx(De, { label: "Clone T", value: i("sensor.dsc_hub_clone_temperature"), min: 15, max: 35, unit: "°C" }),
        /* @__PURE__ */ d.jsx(De, { label: "Clone RH", value: i("sensor.dsc_hub_clone_humidity"), min: 0, max: 100, unit: "%" }),
        /* @__PURE__ */ d.jsx(De, { label: "Room T", value: i("sensor.dsc_hub_room_temperature"), min: 10, max: 40, unit: "°C" })
      ] }) }) })
    ] })
  ] });
}
function um({
  title: i,
  tempId: f,
  rhId: r,
  vpdId: s
}) {
  const { num: h } = He(), m = Ce(f), g = Ce(r);
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(It, { title: i }),
    /* @__PURE__ */ d.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ d.jsx(Mt, { label: "Temperature", value: Pt(h(f)), unit: "°C" }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ d.jsx(Mt, { label: "Humidity", value: Pt(h(r), 0), unit: "%" }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ d.jsx(
        Mt,
        {
          label: "VPD",
          value: s ? Pt(h(s), 2) : "—",
          unit: "kPa",
          tone: s ? "normal" : "muted"
        }
      ) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ d.jsx(St, { title: "Temp trace", children: /* @__PURE__ */ d.jsx(Ti, { series: m, unit: "°C" }) }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ d.jsx(St, { title: "RH trace", children: /* @__PURE__ */ d.jsx(Ti, { series: g, unit: "%" }) }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ d.jsx(St, { title: "Gauges", children: /* @__PURE__ */ d.jsxs("div", { className: "dsc-gauge-row", children: [
        /* @__PURE__ */ d.jsx(De, { label: "Temp", value: h(f), min: 15, max: 35, unit: "°C" }),
        /* @__PURE__ */ d.jsx(De, { label: "RH", value: h(r), min: 0, max: 100, unit: "%" }),
        s ? /* @__PURE__ */ d.jsx(De, { label: "VPD×10", value: h(s) * 10, min: 0, max: 20, unit: "" }) : null
      ] }) }) })
    ] })
  ] });
}
function Lp() {
  return /* @__PURE__ */ d.jsx(
    um,
    {
      title: "Ops · Main 4×8",
      tempId: "sensor.dsc_hub_tent_temperature",
      rhId: "sensor.dsc_hub_tent_humidity",
      vpdId: "sensor.dsc_hub_vpd_kpa"
    }
  );
}
function qp() {
  return /* @__PURE__ */ d.jsx(
    um,
    {
      title: "Ops · Clone 2×4",
      tempId: "sensor.dsc_hub_clone_temperature",
      rhId: "sensor.dsc_hub_clone_humidity"
    }
  );
}
function Yp() {
  const { num: i, state: f } = He();
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(It, { title: "Ops · Root zone", subtitle: "Coldest root and heat-mat context." }),
    /* @__PURE__ */ d.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ d.jsx(Mt, { label: "Coldest root", value: Pt(i("sensor.dsc_coldest_root_zone_temp")), unit: "°C" }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ d.jsx(Mt, { label: "Heat mat on time", value: Pt(i("sensor.dsc_heatmat_relay_on_time"), 0), unit: "s" }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ d.jsx(St, { title: "Notes", children: /* @__PURE__ */ d.jsxs("p", { className: "dsc-muted", style: { margin: 0 }, children: [
        "Mat loop uses per-pot sense with plausibility filter. State:",
        " ",
        f("sensor.dsc_coldest_root_zone_temp", "—")
      ] }) }) })
    ] })
  ] });
}
function wp() {
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(It, { title: "Ops · Tank", subtitle: "Reservoir / tank vitals + system map." }),
    /* @__PURE__ */ d.jsx("div", { className: "dsc-grid", children: /* @__PURE__ */ d.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ d.jsx(St, { title: "System map", children: /* @__PURE__ */ d.jsx(Ni, { tag: "dsc-system-map-card", config: {} }) }) }) })
  ] });
}
function Gp() {
  const { state: i, num: f } = He();
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(It, { title: "Ops · Lighting", subtitle: "Photoperiod and expected light hours." }),
    /* @__PURE__ */ d.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ d.jsx(Mt, { label: "Expected light hours", value: Pt(f("sensor.dsc_expected_light_hours"), 1), unit: "h" }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-8", children: /* @__PURE__ */ d.jsx(St, { title: "Notes", children: /* @__PURE__ */ d.jsxs("p", { className: "dsc-muted", style: { margin: 0 }, children: [
        "Expected: ",
        i("sensor.dsc_expected_light_hours", "—"),
        ". Fixture detail remains on firmware / packages."
      ] }) }) })
    ] })
  ] });
}
function Xp() {
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(
      It,
      {
        title: "Plant",
        subtitle: "Build, catalog research, roster seats, and mix tools."
      }
    ),
    /* @__PURE__ */ d.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ d.jsxs(St, { title: "Build a Plant", children: [
        /* @__PURE__ */ d.jsx("p", { className: "dsc-muted", children: "Compose soil blend, roster, and climate Want." }),
        /* @__PURE__ */ d.jsx(ml, { to: "/plant/build", children: /* @__PURE__ */ d.jsx(ia, { primary: !0, children: "Open Build" }) })
      ] }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ d.jsxs(St, { title: "Catalog Explorer", children: [
        /* @__PURE__ */ d.jsx("p", { className: "dsc-muted", children: "Browse strains, nutrients, mediums, lights." }),
        /* @__PURE__ */ d.jsx(ml, { to: "/plant/catalog", children: /* @__PURE__ */ d.jsx(ia, { primary: !0, children: "Open Catalog" }) })
      ] }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ d.jsxs(St, { title: "Fleet seats", children: [
        /* @__PURE__ */ d.jsx("p", { className: "dsc-muted", children: "Want–Need–Got seats and nutrient science." }),
        /* @__PURE__ */ d.jsxs("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ d.jsx(ml, { to: "/plant/strains", children: /* @__PURE__ */ d.jsx(ia, { children: "Strains" }) }),
          /* @__PURE__ */ d.jsx(ml, { to: "/plant/nutrient", children: /* @__PURE__ */ d.jsx(ia, { children: "Nutrient" }) })
        ] })
      ] }) })
    ] })
  ] });
}
function Qp() {
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(It, { title: "Plant · Build", subtitle: "Compose mode — legacy card hosted in panel chrome." }),
    /* @__PURE__ */ d.jsx(Ni, { tag: "dsc-build-plant-card", config: {} })
  ] });
}
function Zp() {
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(It, { title: "Plant · Catalog", subtitle: "Research browser over /local/dsc-catalog indexes." }),
    /* @__PURE__ */ d.jsx(Ni, { tag: "dsc-catalog-browse-card", config: {} })
  ] });
}
function Vp() {
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(It, { title: "Plant · Strains", subtitle: "Fleet seats / Want–Need–Got." }),
    /* @__PURE__ */ d.jsxs(St, { title: "Roster", children: [
      /* @__PURE__ */ d.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "Strain seat management still lands via HA helpers for lab soak. Prefer brain catalog APIs for durable logic." }),
      /* @__PURE__ */ d.jsx(ml, { to: "/plant/build", children: /* @__PURE__ */ d.jsx(ia, { primary: !0, children: /* @__PURE__ */ d.jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ d.jsx(xi, { name: "build", size: 14 }),
        " Use in Build"
      ] }) }) })
    ] })
  ] });
}
function Kp() {
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(It, { title: "Plant · Nutrient science", subtitle: "Mix lab / dose tools." }),
    /* @__PURE__ */ d.jsxs(St, { title: "Mix lab", children: [
      /* @__PURE__ */ d.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "Nutrient dose and stage tools — open Build for the interactive mixer, Catalog for SKU research." }),
      /* @__PURE__ */ d.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ d.jsx(ml, { to: "/plant/build", children: /* @__PURE__ */ d.jsx(ia, { primary: !0, children: "Build mixer" }) }),
        /* @__PURE__ */ d.jsx(ml, { to: "/plant/catalog", children: /* @__PURE__ */ d.jsx(ia, { children: "Catalog nutrients" }) })
      ] })
    ] })
  ] });
}
function Jp() {
  const { state: i } = He();
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(It, { title: "Advanced · Learning", subtitle: "Learning loop status and notes." }),
    /* @__PURE__ */ d.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ d.jsx(St, { title: "Status", children: /* @__PURE__ */ d.jsxs("p", { className: "dsc-muted", style: { marginTop: 0 }, children: [
        "Surface: ",
        i("sensor.dsc_ha_surface_version", "6.1.0"),
        ". Durable learning math belongs in brain/."
      ] }) }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ d.jsx(Mt, { label: "Hub beat", value: i("sensor.dsc_hub_heartbeat", "—") }) })
    ] })
  ] });
}
function kp() {
  const i = Ce("sensor.dsc_hub_tent_temperature", { maxPoints: 96 }), f = Ce("sensor.dsc_hub_tent_humidity", { maxPoints: 96 });
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(It, { title: "Advanced · Trends", subtitle: "History-seeded trends with live append." }),
    /* @__PURE__ */ d.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ d.jsx(St, { title: "Tent temperature", children: /* @__PURE__ */ d.jsx(Ti, { series: i, unit: "°C", live: !0 }) }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ d.jsx(St, { title: "Tent humidity", children: /* @__PURE__ */ d.jsx(Ti, { series: f, unit: "%", live: !0 }) }) })
    ] })
  ] });
}
function $p() {
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(
      It,
      {
        title: "Advanced · History",
        subtitle: "HA Recorder remains the lab history store for now."
      }
    ),
    /* @__PURE__ */ d.jsx(St, { title: "History", children: /* @__PURE__ */ d.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "Deep history charts stay on HA recorder / Trends while brain history matures. Use Trends for live session traces." }) })
  ] });
}
function Wp() {
  const { state: i, available: f, num: r } = He(), s = f("sensor.dsc_hub_uptime");
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(It, { title: "System", subtitle: "Diagnostics, versions, and panel health." }),
    /* @__PURE__ */ d.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ d.jsx(
        Mt,
        {
          label: "Hub link",
          value: s ? "OK" : "DOWN",
          tone: s ? "ok" : "bad",
          sub: `Uptime raw ${i("sensor.dsc_hub_uptime", "—")}`
        }
      ) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ d.jsx(Mt, { label: "Surface", value: i("sensor.dsc_ha_surface_version", "6.1.0"), sub: "Panel product shell" }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ d.jsx(
        Mt,
        {
          label: "Alerts",
          value: Number.isFinite(r("sensor.dsc_active_alert_count")) ? r("sensor.dsc_active_alert_count") : "—",
          tone: r("sensor.dsc_active_alert_count", 0) === 0 ? "ok" : "bad"
        }
      ) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ d.jsx(St, { title: "Fleet", children: /* @__PURE__ */ d.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: i("sensor.dsc_fleet_version_status", "—") }) }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ d.jsx(St, { title: "Panel", children: /* @__PURE__ */ d.jsxs("p", { className: "dsc-muted", style: { marginTop: 0 }, children: [
        "Custom panel ",
        /* @__PURE__ */ d.jsx("code", { children: "/dsc-hub" }),
        " · React + Vite · assets under",
        " ",
        /* @__PURE__ */ d.jsx("code", { children: "/dsc_hub/assets" }),
        "."
      ] }) }) })
    ] })
  ] });
}
const Fp = [
  { id: "ops", label: "Ops", path: "/ops", icon: "ops" },
  { id: "plant", label: "Plant", path: "/plant", icon: "plant" },
  { id: "advanced", label: "Advanced", path: "/advanced", icon: "advanced" },
  { id: "system", label: "System", path: "/system", icon: "system" }
], Pp = {
  ops: [
    { id: "home", label: "Home", path: "/ops/home", icon: "home" },
    { id: "dash", label: "Dash", path: "/ops/dash", icon: "dash" },
    { id: "climate", label: "Climate", path: "/ops/climate", icon: "climate" },
    { id: "main-4x8", label: "Main 4×8", path: "/ops/main-4x8", icon: "tent" },
    { id: "clone-2x4", label: "Clone 2×4", path: "/ops/clone-2x4", icon: "clone" },
    { id: "root-zone", label: "Root zone", path: "/ops/root-zone", icon: "root" },
    { id: "tank", label: "Tank", path: "/ops/tank", icon: "tank" },
    { id: "lighting", label: "Lighting", path: "/ops/lighting", icon: "lighting" }
  ],
  plant: [
    { id: "hub", label: "Hub", path: "/plant", icon: "plant" },
    { id: "build", label: "Build", path: "/plant/build", icon: "build" },
    { id: "catalog", label: "Catalog", path: "/plant/catalog", icon: "catalog" },
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
function Ip(i) {
  return i.includes("/plant") ? "plant" : i.includes("/advanced") ? "advanced" : i.includes("/system") ? "system" : "ops";
}
const tg = ':host,.dsc-root{--dsc-black: #070907;--dsc-black-2: #0c100d;--dsc-gray-1: #151a16;--dsc-gray-2: #1c241e;--dsc-gray-3: #2a342c;--dsc-gray-4: #6b7a6e;--dsc-gray-5: #9aab9e;--dsc-neon: #39ff14;--dsc-neon-dim: rgba(57, 255, 20, .35);--dsc-neon-glow: rgba(57, 255, 20, .55);--dsc-white: #f4f7f4;--dsc-shadow: 0 8px 24px rgba(0, 0, 0, .45);--dsc-shadow-tight: 0 2px 8px rgba(0, 0, 0, .55);--dsc-radius: 10px;--dsc-font: "Segoe UI", "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;--dsc-mono: "Cascadia Code", "IBM Plex Mono", ui-monospace, monospace;color:var(--dsc-white);background:var(--dsc-black);font-family:var(--dsc-font);display:block;height:100%;box-sizing:border-box}*,*:before,*:after{box-sizing:border-box}.dsc-root{height:100%;min-height:100%;overflow:auto;background:radial-gradient(1200px 600px at 10% -10%,rgba(57,255,20,.06),transparent 55%),radial-gradient(900px 500px at 90% 0%,rgba(255,255,255,.03),transparent 50%),var(--dsc-black)}.dsc-shell{display:flex;flex-direction:column;min-height:100%;max-width:1600px;margin:0 auto;padding:16px 20px 28px}.dsc-brand-row{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:10px}.dsc-brand{display:flex;align-items:center;gap:12px;color:var(--dsc-white);text-decoration:none}.dsc-brand img,.dsc-brand svg{width:36px;height:36px;color:var(--dsc-neon)}.dsc-brand-title{display:flex;flex-direction:column;gap:2px}.dsc-brand-title strong{font-size:1.15rem;letter-spacing:.14em;font-weight:700}.dsc-brand-title span{font-size:.72rem;color:var(--dsc-gray-5);letter-spacing:.08em;text-transform:uppercase}.dsc-primary-tabs,.dsc-secondary-tabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:thin;padding-bottom:2px;-webkit-overflow-scrolling:touch}.dsc-primary-tabs{border-bottom:1px solid var(--dsc-gray-3);margin-bottom:8px}.dsc-secondary-tabs{margin-bottom:16px;mask-image:linear-gradient(90deg,#000 85%,transparent)}.dsc-secondary-tabs:after{content:"";flex:0 0 12px}.dsc-tab{appearance:none;border:1px solid transparent;background:transparent;color:var(--dsc-gray-5);padding:10px 14px;min-height:44px;border-radius:8px 8px 0 0;cursor:pointer;font:inherit;font-size:.92rem;letter-spacing:.04em;white-space:nowrap;display:inline-flex;align-items:center;gap:8px;transition:transform .1s ease,box-shadow .1s ease,color .15s ease,border-color .15s ease,background .15s ease;text-decoration:none}.dsc-tab img{width:16px;height:16px;opacity:.85}.dsc-tab:hover{color:var(--dsc-white);background:var(--dsc-gray-1)}.dsc-tab:focus-visible{outline:2px solid var(--dsc-neon);outline-offset:2px}.dsc-tab.active{color:var(--dsc-white);border-bottom:2px solid var(--dsc-neon);box-shadow:0 6px 18px #39ff1414}.dsc-secondary-tabs .dsc-tab{border-radius:999px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-1);min-height:40px;padding:8px 14px}.dsc-secondary-tabs .dsc-tab.active{border-color:var(--dsc-neon-dim);color:var(--dsc-neon);background:#39ff1414;box-shadow:var(--dsc-shadow-tight)}.dsc-btn{appearance:none;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);border-radius:8px;padding:10px 16px;min-height:40px;font:inherit;cursor:pointer;box-shadow:var(--dsc-shadow-tight);transition:transform .1s ease,box-shadow .1s ease,border-color .12s ease,background .12s ease}.dsc-btn:hover{border-color:var(--dsc-neon-dim)}.dsc-btn:active,.dsc-tab:active{transform:translateY(1px);box-shadow:0 1px 3px #000000a6}.dsc-btn.primary{border-color:var(--dsc-neon-dim);color:var(--dsc-black);background:var(--dsc-neon);font-weight:650}.dsc-page{animation:dsc-fade .18s ease}@keyframes dsc-fade{0%{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.dsc-page,.dsc-btn,.dsc-tab,.dsc-live-pulse{animation:none!important;transition:none!important}}.dsc-grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:14px}.dsc-col-3{grid-column:span 3}.dsc-col-4{grid-column:span 4}.dsc-col-6{grid-column:span 6}.dsc-col-8{grid-column:span 8}.dsc-col-12{grid-column:span 12}@media(max-width:1100px){.dsc-col-3,.dsc-col-4{grid-column:span 6}.dsc-col-8{grid-column:span 12}}@media(max-width:720px){.dsc-shell{padding:12px}.dsc-col-3,.dsc-col-4,.dsc-col-6,.dsc-col-8{grid-column:span 12}}.dsc-card{background:linear-gradient(165deg,var(--dsc-gray-1),var(--dsc-black-2));border:1px solid var(--dsc-gray-3);border-radius:var(--dsc-radius);box-shadow:var(--dsc-shadow);padding:14px 16px;min-height:88px}.dsc-card h2,.dsc-card h3{margin:0 0 8px;font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;color:var(--dsc-gray-5);font-weight:600}.dsc-kpi-value{font-size:1.85rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:.02em;color:var(--dsc-white)}.dsc-kpi-unit{margin-left:6px;font-size:.85rem;color:var(--dsc-gray-5)}.dsc-kpi-sub{margin-top:6px;color:var(--dsc-gray-5);font-size:.82rem}.dsc-status-ok{color:var(--dsc-neon)}.dsc-status-bad{color:#ff6b6b}.dsc-status-muted{color:var(--dsc-gray-5)}.dsc-page-title{margin:0 0 14px;font-size:1.35rem;letter-spacing:.04em}.dsc-muted{color:var(--dsc-gray-5)}.dsc-legacy-host{min-height:420px;border-radius:var(--dsc-radius);overflow:hidden;border:1px solid var(--dsc-gray-3);background:#000}.dsc-legacy-host--empty{background:var(--dsc-gray-1);min-height:160px}.dsc-legacy-host>*{display:block;width:100%}.dsc-status-strip{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}.dsc-chip-row{display:flex;flex-wrap:wrap;gap:8px}.dsc-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-1);font-size:.75rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-chip--ok{color:var(--dsc-neon);border-color:var(--dsc-neon-dim);background:#39ff1414;box-shadow:0 0 12px #39ff141f}.dsc-chip--bad{color:#ff8a8a;border-color:#ff6b6b73;background:#ff6b6b1a}.dsc-chip--warn{color:#fbbf24;border-color:#fbbf2473;background:#fbbf241a}.dsc-chip--muted{color:var(--dsc-gray-5)}.dsc-chip--pulse{animation:dsc-chip-pulse 1.6s ease-in-out infinite}@keyframes dsc-chip-pulse{0%,to{box-shadow:0 0 #39ff1400}50%{box-shadow:0 0 14px #39ff1459}}.dsc-demand-row{display:flex;flex-wrap:wrap;gap:8px}.dsc-demand-row--stack{flex-direction:column}.dsc-demand{appearance:none;flex:1 1 110px;min-height:52px;padding:10px 12px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);font:inherit;cursor:pointer;display:flex;flex-direction:column;align-items:flex-start;gap:4px;box-shadow:var(--dsc-shadow-tight);transition:transform .1s ease,box-shadow .1s ease,border-color .12s ease,background .12s ease}.dsc-demand:hover{border-color:var(--dsc-neon-dim)}.dsc-demand:active{transform:translateY(1px);box-shadow:0 1px 3px #000000a6}.dsc-demand.is-on{border-color:var(--dsc-neon);background:#39ff141a;box-shadow:0 0 0 1px #39ff1440,0 0 18px #39ff1433}.dsc-demand.is-missing{opacity:.55;cursor:not-allowed}.dsc-demand-label{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-demand.is-on .dsc-demand-label{color:var(--dsc-neon)}.dsc-demand-state{font-weight:700;font-variant-numeric:tabular-nums;font-size:1rem}.dsc-gauge-row{display:flex;justify-content:space-around;flex-wrap:wrap;gap:8px}.dsc-gauge{display:flex;flex-direction:column;align-items:center;gap:4px}.dsc-gauge-label{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-chart-legend{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:4px;min-height:20px}.dsc-chart-legend-item{display:inline-flex;align-items:center;gap:6px;font-size:.75rem;color:var(--dsc-gray-5)}.dsc-chart-legend-item i{width:8px;height:8px;border-radius:50%;display:inline-block;box-shadow:0 0 6px currentColor}.dsc-chart-last{margin-left:auto;font-variant-numeric:tabular-nums;color:var(--dsc-neon);font-size:13px;font-weight:650}.dsc-fault-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.dsc-fault-list li{display:flex;flex-wrap:wrap;align-items:center;gap:10px}.dsc-empty{padding:18px 14px;border:1px dashed var(--dsc-gray-3);border-radius:8px;color:var(--dsc-gray-5);background:#00000040;font-size:.9rem;line-height:1.45}.dsc-empty--ok{border-style:solid;border-color:var(--dsc-neon-dim);color:var(--dsc-neon)}.dsc-btn:disabled{opacity:.45;cursor:not-allowed}', eg = tg;
function lg() {
  const i = we(), f = Ip(i.pathname), r = Pp[f];
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-shell", children: [
    /* @__PURE__ */ d.jsxs("div", { className: "dsc-brand-row", children: [
      /* @__PURE__ */ d.jsxs(Si, { className: "dsc-brand", to: "/ops/home", children: [
        /* @__PURE__ */ d.jsx(xi, { name: "brand", size: 36, color: "var(--dsc-neon)" }),
        /* @__PURE__ */ d.jsxs("div", { className: "dsc-brand-title", children: [
          /* @__PURE__ */ d.jsx("strong", { children: "DSC-HUB" }),
          /* @__PURE__ */ d.jsx("span", { children: "Grow operations panel" })
        ] })
      ] }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-muted", style: { fontSize: 12, letterSpacing: "0.08em" }, children: "SURFACE 6.1.0" })
    ] }),
    /* @__PURE__ */ d.jsx("nav", { className: "dsc-primary-tabs", "aria-label": "Primary", children: Fp.map((s) => /* @__PURE__ */ d.jsxs(
      Si,
      {
        to: s.path,
        className: ({ isActive: h }) => `dsc-tab${h || f === s.id ? " active" : ""}`,
        children: [
          /* @__PURE__ */ d.jsx(xi, { name: s.icon, size: 15 }),
          s.label
        ]
      },
      s.id
    )) }),
    /* @__PURE__ */ d.jsx("nav", { className: "dsc-secondary-tabs", "aria-label": "Section pages", children: r.map((s) => /* @__PURE__ */ d.jsxs(
      Si,
      {
        to: s.path,
        end: s.path === "/plant" || s.path === "/system",
        className: ({ isActive: h }) => `dsc-tab${h ? " active" : ""}`,
        children: [
          /* @__PURE__ */ d.jsx(xi, { name: s.icon, size: 14 }),
          s.label
        ]
      },
      s.id
    )) }),
    /* @__PURE__ */ d.jsxs(Y0, { children: [
      /* @__PURE__ */ d.jsx(Ot, { path: "/", element: /* @__PURE__ */ d.jsx(vi, { to: "/ops/home", replace: !0 }) }),
      /* @__PURE__ */ d.jsx(Ot, { path: "/ops", element: /* @__PURE__ */ d.jsx(vi, { to: "/ops/home", replace: !0 }) }),
      /* @__PURE__ */ d.jsx(Ot, { path: "/ops/home", element: /* @__PURE__ */ d.jsx(Mp, {}) }),
      /* @__PURE__ */ d.jsx(Ot, { path: "/ops/dash", element: /* @__PURE__ */ d.jsx(Hp, {}) }),
      /* @__PURE__ */ d.jsx(Ot, { path: "/ops/climate", element: /* @__PURE__ */ d.jsx(Bp, {}) }),
      /* @__PURE__ */ d.jsx(Ot, { path: "/ops/main-4x8", element: /* @__PURE__ */ d.jsx(Lp, {}) }),
      /* @__PURE__ */ d.jsx(Ot, { path: "/ops/clone-2x4", element: /* @__PURE__ */ d.jsx(qp, {}) }),
      /* @__PURE__ */ d.jsx(Ot, { path: "/ops/root-zone", element: /* @__PURE__ */ d.jsx(Yp, {}) }),
      /* @__PURE__ */ d.jsx(Ot, { path: "/ops/tank", element: /* @__PURE__ */ d.jsx(wp, {}) }),
      /* @__PURE__ */ d.jsx(Ot, { path: "/ops/lighting", element: /* @__PURE__ */ d.jsx(Gp, {}) }),
      /* @__PURE__ */ d.jsx(Ot, { path: "/plant", element: /* @__PURE__ */ d.jsx(Xp, {}) }),
      /* @__PURE__ */ d.jsx(Ot, { path: "/plant/build", element: /* @__PURE__ */ d.jsx(Qp, {}) }),
      /* @__PURE__ */ d.jsx(Ot, { path: "/plant/catalog", element: /* @__PURE__ */ d.jsx(Zp, {}) }),
      /* @__PURE__ */ d.jsx(Ot, { path: "/plant/strains", element: /* @__PURE__ */ d.jsx(Vp, {}) }),
      /* @__PURE__ */ d.jsx(Ot, { path: "/plant/nutrient", element: /* @__PURE__ */ d.jsx(Kp, {}) }),
      /* @__PURE__ */ d.jsx(Ot, { path: "/advanced", element: /* @__PURE__ */ d.jsx(vi, { to: "/advanced/learning", replace: !0 }) }),
      /* @__PURE__ */ d.jsx(Ot, { path: "/advanced/learning", element: /* @__PURE__ */ d.jsx(Jp, {}) }),
      /* @__PURE__ */ d.jsx(Ot, { path: "/advanced/trends", element: /* @__PURE__ */ d.jsx(kp, {}) }),
      /* @__PURE__ */ d.jsx(Ot, { path: "/advanced/history", element: /* @__PURE__ */ d.jsx($p, {}) }),
      /* @__PURE__ */ d.jsx(Ot, { path: "/system", element: /* @__PURE__ */ d.jsx(Wp, {}) }),
      /* @__PURE__ */ d.jsx(Ot, { path: "*", element: /* @__PURE__ */ d.jsx(vi, { to: "/ops/home", replace: !0 }) })
    ] })
  ] });
}
function ag({ hass: i }) {
  return /* @__PURE__ */ d.jsx(xp, { hass: i, children: /* @__PURE__ */ d.jsx(lg, {}) });
}
function ng({
  panel: i
}) {
  const [f, r] = A.useState(() => i.hass);
  return A.useEffect(() => {
    const s = () => r(i.hass);
    return s(), i.addEventListener("hass-updated", s), () => {
      i.removeEventListener("hass-updated", s);
    };
  }, [i]), /* @__PURE__ */ d.jsx(fp, { children: /* @__PURE__ */ d.jsx(ag, { hass: f }) });
}
class ug extends HTMLElement {
  constructor() {
    super(...arguments);
    mi(this, "_root", null);
    mi(this, "_hass", null);
    mi(this, "_mounted", !1);
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
      r.textContent = `:host{display:block;height:100%;background:#070907;color:#f4f7f4;}
${eg}`, this.shadowRoot.appendChild(r);
      const s = document.createElement("div");
      s.className = "dsc-root", s.style.height = "100%", this.shadowRoot.appendChild(s), this._root = wy.createRoot(s), this._root.render(/* @__PURE__ */ d.jsx(ng, { panel: this })), this._mounted = !0;
    }
  }
  disconnectedCallback() {
    this._root?.unmount(), this._root = null, this._mounted = !1;
  }
}
customElements.get("dsc-hub-panel") || customElements.define("dsc-hub-panel", ug);
export {
  ug as default
};
//# sourceMappingURL=dsc-hub-panel.js.map
