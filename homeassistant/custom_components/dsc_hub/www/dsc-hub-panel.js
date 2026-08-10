var wv = Object.defineProperty;
var Bv = (i, o, f) => o in i ? wv(i, o, { enumerable: !0, configurable: !0, writable: !0, value: f }) : i[o] = f;
var yi = (i, o, f) => Bv(i, typeof o != "symbol" ? o + "" : o, f);
var Fs = { exports: {} }, Zn = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Eh;
function Lv() {
  if (Eh) return Zn;
  Eh = 1;
  var i = Symbol.for("react.transitional.element"), o = Symbol.for("react.fragment");
  function f(s, h, m) {
    var v = null;
    if (m !== void 0 && (v = "" + m), h.key !== void 0 && (v = "" + h.key), "key" in h) {
      m = {};
      for (var y in h)
        y !== "key" && (m[y] = h[y]);
    } else m = h;
    return h = m.ref, {
      $$typeof: i,
      type: s,
      key: v,
      ref: h !== void 0 ? h : null,
      props: m
    };
  }
  return Zn.Fragment = o, Zn.jsx = f, Zn.jsxs = f, Zn;
}
var jh;
function qv() {
  return jh || (jh = 1, Fs.exports = Lv()), Fs.exports;
}
var r = qv(), Ps = { exports: {} }, P = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Th;
function Yv() {
  if (Th) return P;
  Th = 1;
  var i = Symbol.for("react.transitional.element"), o = Symbol.for("react.portal"), f = Symbol.for("react.fragment"), s = Symbol.for("react.strict_mode"), h = Symbol.for("react.profiler"), m = Symbol.for("react.consumer"), v = Symbol.for("react.context"), y = Symbol.for("react.forward_ref"), b = Symbol.for("react.suspense"), p = Symbol.for("react.memo"), R = Symbol.for("react.lazy"), E = Symbol.for("react.activity"), N = Symbol.iterator;
  function B(S) {
    return S === null || typeof S != "object" ? null : (S = N && S[N] || S["@@iterator"], typeof S == "function" ? S : null);
  }
  var L = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, q = Object.assign, w = {};
  function V(S, H, G) {
    this.props = S, this.context = H, this.refs = w, this.updater = G || L;
  }
  V.prototype.isReactComponent = {}, V.prototype.setState = function(S, H) {
    if (typeof S != "object" && typeof S != "function" && S != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, S, H, "setState");
  }, V.prototype.forceUpdate = function(S) {
    this.updater.enqueueForceUpdate(this, S, "forceUpdate");
  };
  function k() {
  }
  k.prototype = V.prototype;
  function X(S, H, G) {
    this.props = S, this.context = H, this.refs = w, this.updater = G || L;
  }
  var le = X.prototype = new k();
  le.constructor = X, q(le, V.prototype), le.isPureReactComponent = !0;
  var fe = Array.isArray;
  function Te() {
  }
  var W = { H: null, A: null, T: null, S: null }, Ce = Object.prototype.hasOwnProperty;
  function oe(S, H, G) {
    var Z = G.ref;
    return {
      $$typeof: i,
      type: S,
      key: H,
      ref: Z !== void 0 ? Z : null,
      props: G
    };
  }
  function Vt(S, H) {
    return oe(S.type, H, S.props);
  }
  function jt(S) {
    return typeof S == "object" && S !== null && S.$$typeof === i;
  }
  function Ie(S) {
    var H = { "=": "=0", ":": "=2" };
    return "$" + S.replace(/[=:]/g, function(G) {
      return H[G];
    });
  }
  var Kt = /\/+/g;
  function Tt(S, H) {
    return typeof S == "object" && S !== null && S.key != null ? Ie("" + S.key) : H.toString(36);
  }
  function Le(S) {
    switch (S.status) {
      case "fulfilled":
        return S.value;
      case "rejected":
        throw S.reason;
      default:
        switch (typeof S.status == "string" ? S.then(Te, Te) : (S.status = "pending", S.then(
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
  function M(S, H, G, Z, I) {
    var ae = typeof S;
    (ae === "undefined" || ae === "boolean") && (S = null);
    var pe = !1;
    if (S === null) pe = !0;
    else
      switch (ae) {
        case "bigint":
        case "string":
        case "number":
          pe = !0;
          break;
        case "object":
          switch (S.$$typeof) {
            case i:
            case o:
              pe = !0;
              break;
            case R:
              return pe = S._init, M(
                pe(S._payload),
                H,
                G,
                Z,
                I
              );
          }
      }
    if (pe)
      return I = I(S), pe = Z === "" ? "." + Tt(S, 0) : Z, fe(I) ? (G = "", pe != null && (G = pe.replace(Kt, "$&/") + "/"), M(I, H, G, "", function(Wa) {
        return Wa;
      })) : I != null && (jt(I) && (I = Vt(
        I,
        G + (I.key == null || S && S.key === I.key ? "" : ("" + I.key).replace(
          Kt,
          "$&/"
        ) + "/") + pe
      )), H.push(I)), 1;
    pe = 0;
    var lt = Z === "" ? "." : Z + ":";
    if (fe(S))
      for (var He = 0; He < S.length; He++)
        Z = S[He], ae = lt + Tt(Z, He), pe += M(
          Z,
          H,
          G,
          ae,
          I
        );
    else if (He = B(S), typeof He == "function")
      for (S = He.call(S), He = 0; !(Z = S.next()).done; )
        Z = Z.value, ae = lt + Tt(Z, He++), pe += M(
          Z,
          H,
          G,
          ae,
          I
        );
    else if (ae === "object") {
      if (typeof S.then == "function")
        return M(
          Le(S),
          H,
          G,
          Z,
          I
        );
      throw H = String(S), Error(
        "Objects are not valid as a React child (found: " + (H === "[object Object]" ? "object with keys {" + Object.keys(S).join(", ") + "}" : H) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return pe;
  }
  function Y(S, H, G) {
    if (S == null) return S;
    var Z = [], I = 0;
    return M(S, Z, "", "", function(ae) {
      return H.call(G, ae, I++);
    }), Z;
  }
  function F(S) {
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
  var ge = typeof reportError == "function" ? reportError : function(S) {
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
  }, _e = {
    map: Y,
    forEach: function(S, H, G) {
      Y(
        S,
        function() {
          H.apply(this, arguments);
        },
        G
      );
    },
    count: function(S) {
      var H = 0;
      return Y(S, function() {
        H++;
      }), H;
    },
    toArray: function(S) {
      return Y(S, function(H) {
        return H;
      }) || [];
    },
    only: function(S) {
      if (!jt(S))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return S;
    }
  };
  return P.Activity = E, P.Children = _e, P.Component = V, P.Fragment = f, P.Profiler = h, P.PureComponent = X, P.StrictMode = s, P.Suspense = b, P.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = W, P.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(S) {
      return W.H.useMemoCache(S);
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
    var Z = q({}, S.props), I = S.key;
    if (H != null)
      for (ae in H.key !== void 0 && (I = "" + H.key), H)
        !Ce.call(H, ae) || ae === "key" || ae === "__self" || ae === "__source" || ae === "ref" && H.ref === void 0 || (Z[ae] = H[ae]);
    var ae = arguments.length - 2;
    if (ae === 1) Z.children = G;
    else if (1 < ae) {
      for (var pe = Array(ae), lt = 0; lt < ae; lt++)
        pe[lt] = arguments[lt + 2];
      Z.children = pe;
    }
    return oe(S.type, I, Z);
  }, P.createContext = function(S) {
    return S = {
      $$typeof: v,
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
    var Z, I = {}, ae = null;
    if (H != null)
      for (Z in H.key !== void 0 && (ae = "" + H.key), H)
        Ce.call(H, Z) && Z !== "key" && Z !== "__self" && Z !== "__source" && (I[Z] = H[Z]);
    var pe = arguments.length - 2;
    if (pe === 1) I.children = G;
    else if (1 < pe) {
      for (var lt = Array(pe), He = 0; He < pe; He++)
        lt[He] = arguments[He + 2];
      I.children = lt;
    }
    if (S && S.defaultProps)
      for (Z in pe = S.defaultProps, pe)
        I[Z] === void 0 && (I[Z] = pe[Z]);
    return oe(S, ae, I);
  }, P.createRef = function() {
    return { current: null };
  }, P.forwardRef = function(S) {
    return { $$typeof: y, render: S };
  }, P.isValidElement = jt, P.lazy = function(S) {
    return {
      $$typeof: R,
      _payload: { _status: -1, _result: S },
      _init: F
    };
  }, P.memo = function(S, H) {
    return {
      $$typeof: p,
      type: S,
      compare: H === void 0 ? null : H
    };
  }, P.startTransition = function(S) {
    var H = W.T, G = {};
    W.T = G;
    try {
      var Z = S(), I = W.S;
      I !== null && I(G, Z), typeof Z == "object" && Z !== null && typeof Z.then == "function" && Z.then(Te, ge);
    } catch (ae) {
      ge(ae);
    } finally {
      H !== null && G.types !== null && (H.types = G.types), W.T = H;
    }
  }, P.unstable_useCacheRefresh = function() {
    return W.H.useCacheRefresh();
  }, P.use = function(S) {
    return W.H.use(S);
  }, P.useActionState = function(S, H, G) {
    return W.H.useActionState(S, H, G);
  }, P.useCallback = function(S, H) {
    return W.H.useCallback(S, H);
  }, P.useContext = function(S) {
    return W.H.useContext(S);
  }, P.useDebugValue = function() {
  }, P.useDeferredValue = function(S, H) {
    return W.H.useDeferredValue(S, H);
  }, P.useEffect = function(S, H) {
    return W.H.useEffect(S, H);
  }, P.useEffectEvent = function(S) {
    return W.H.useEffectEvent(S);
  }, P.useId = function() {
    return W.H.useId();
  }, P.useImperativeHandle = function(S, H, G) {
    return W.H.useImperativeHandle(S, H, G);
  }, P.useInsertionEffect = function(S, H) {
    return W.H.useInsertionEffect(S, H);
  }, P.useLayoutEffect = function(S, H) {
    return W.H.useLayoutEffect(S, H);
  }, P.useMemo = function(S, H) {
    return W.H.useMemo(S, H);
  }, P.useOptimistic = function(S, H) {
    return W.H.useOptimistic(S, H);
  }, P.useReducer = function(S, H, G) {
    return W.H.useReducer(S, H, G);
  }, P.useRef = function(S) {
    return W.H.useRef(S);
  }, P.useState = function(S) {
    return W.H.useState(S);
  }, P.useSyncExternalStore = function(S, H, G) {
    return W.H.useSyncExternalStore(
      S,
      H,
      G
    );
  }, P.useTransition = function() {
    return W.H.useTransition();
  }, P.version = "19.2.8", P;
}
var zh;
function or() {
  return zh || (zh = 1, Ps.exports = Yv()), Ps.exports;
}
var j = or(), Is = { exports: {} }, Vn = {}, er = { exports: {} }, tr = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Nh;
function Gv() {
  return Nh || (Nh = 1, (function(i) {
    function o(M, Y) {
      var F = M.length;
      M.push(Y);
      e: for (; 0 < F; ) {
        var ge = F - 1 >>> 1, _e = M[ge];
        if (0 < h(_e, Y))
          M[ge] = Y, M[F] = _e, F = ge;
        else break e;
      }
    }
    function f(M) {
      return M.length === 0 ? null : M[0];
    }
    function s(M) {
      if (M.length === 0) return null;
      var Y = M[0], F = M.pop();
      if (F !== Y) {
        M[0] = F;
        e: for (var ge = 0, _e = M.length, S = _e >>> 1; ge < S; ) {
          var H = 2 * (ge + 1) - 1, G = M[H], Z = H + 1, I = M[Z];
          if (0 > h(G, F))
            Z < _e && 0 > h(I, G) ? (M[ge] = I, M[Z] = F, ge = Z) : (M[ge] = G, M[H] = F, ge = H);
          else if (Z < _e && 0 > h(I, F))
            M[ge] = I, M[Z] = F, ge = Z;
          else break e;
        }
      }
      return Y;
    }
    function h(M, Y) {
      var F = M.sortIndex - Y.sortIndex;
      return F !== 0 ? F : M.id - Y.id;
    }
    if (i.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var m = performance;
      i.unstable_now = function() {
        return m.now();
      };
    } else {
      var v = Date, y = v.now();
      i.unstable_now = function() {
        return v.now() - y;
      };
    }
    var b = [], p = [], R = 1, E = null, N = 3, B = !1, L = !1, q = !1, w = !1, V = typeof setTimeout == "function" ? setTimeout : null, k = typeof clearTimeout == "function" ? clearTimeout : null, X = typeof setImmediate < "u" ? setImmediate : null;
    function le(M) {
      for (var Y = f(p); Y !== null; ) {
        if (Y.callback === null) s(p);
        else if (Y.startTime <= M)
          s(p), Y.sortIndex = Y.expirationTime, o(b, Y);
        else break;
        Y = f(p);
      }
    }
    function fe(M) {
      if (q = !1, le(M), !L)
        if (f(b) !== null)
          L = !0, Te || (Te = !0, Ie());
        else {
          var Y = f(p);
          Y !== null && Le(fe, Y.startTime - M);
        }
    }
    var Te = !1, W = -1, Ce = 5, oe = -1;
    function Vt() {
      return w ? !0 : !(i.unstable_now() - oe < Ce);
    }
    function jt() {
      if (w = !1, Te) {
        var M = i.unstable_now();
        oe = M;
        var Y = !0;
        try {
          e: {
            L = !1, q && (q = !1, k(W), W = -1), B = !0;
            var F = N;
            try {
              t: {
                for (le(M), E = f(b); E !== null && !(E.expirationTime > M && Vt()); ) {
                  var ge = E.callback;
                  if (typeof ge == "function") {
                    E.callback = null, N = E.priorityLevel;
                    var _e = ge(
                      E.expirationTime <= M
                    );
                    if (M = i.unstable_now(), typeof _e == "function") {
                      E.callback = _e, le(M), Y = !0;
                      break t;
                    }
                    E === f(b) && s(b), le(M);
                  } else s(b);
                  E = f(b);
                }
                if (E !== null) Y = !0;
                else {
                  var S = f(p);
                  S !== null && Le(
                    fe,
                    S.startTime - M
                  ), Y = !1;
                }
              }
              break e;
            } finally {
              E = null, N = F, B = !1;
            }
            Y = void 0;
          }
        } finally {
          Y ? Ie() : Te = !1;
        }
      }
    }
    var Ie;
    if (typeof X == "function")
      Ie = function() {
        X(jt);
      };
    else if (typeof MessageChannel < "u") {
      var Kt = new MessageChannel(), Tt = Kt.port2;
      Kt.port1.onmessage = jt, Ie = function() {
        Tt.postMessage(null);
      };
    } else
      Ie = function() {
        V(jt, 0);
      };
    function Le(M, Y) {
      W = V(function() {
        M(i.unstable_now());
      }, Y);
    }
    i.unstable_IdlePriority = 5, i.unstable_ImmediatePriority = 1, i.unstable_LowPriority = 4, i.unstable_NormalPriority = 3, i.unstable_Profiling = null, i.unstable_UserBlockingPriority = 2, i.unstable_cancelCallback = function(M) {
      M.callback = null;
    }, i.unstable_forceFrameRate = function(M) {
      0 > M || 125 < M ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : Ce = 0 < M ? Math.floor(1e3 / M) : 5;
    }, i.unstable_getCurrentPriorityLevel = function() {
      return N;
    }, i.unstable_next = function(M) {
      switch (N) {
        case 1:
        case 2:
        case 3:
          var Y = 3;
          break;
        default:
          Y = N;
      }
      var F = N;
      N = Y;
      try {
        return M();
      } finally {
        N = F;
      }
    }, i.unstable_requestPaint = function() {
      w = !0;
    }, i.unstable_runWithPriority = function(M, Y) {
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
      var F = N;
      N = M;
      try {
        return Y();
      } finally {
        N = F;
      }
    }, i.unstable_scheduleCallback = function(M, Y, F) {
      var ge = i.unstable_now();
      switch (typeof F == "object" && F !== null ? (F = F.delay, F = typeof F == "number" && 0 < F ? ge + F : ge) : F = ge, M) {
        case 1:
          var _e = -1;
          break;
        case 2:
          _e = 250;
          break;
        case 5:
          _e = 1073741823;
          break;
        case 4:
          _e = 1e4;
          break;
        default:
          _e = 5e3;
      }
      return _e = F + _e, M = {
        id: R++,
        callback: Y,
        priorityLevel: M,
        startTime: F,
        expirationTime: _e,
        sortIndex: -1
      }, F > ge ? (M.sortIndex = F, o(p, M), f(b) === null && M === f(p) && (q ? (k(W), W = -1) : q = !0, Le(fe, F - ge))) : (M.sortIndex = _e, o(b, M), L || B || (L = !0, Te || (Te = !0, Ie()))), M;
    }, i.unstable_shouldYield = Vt, i.unstable_wrapCallback = function(M) {
      var Y = N;
      return function() {
        var F = N;
        N = Y;
        try {
          return M.apply(this, arguments);
        } finally {
          N = F;
        }
      };
    };
  })(tr)), tr;
}
var Ah;
function Xv() {
  return Ah || (Ah = 1, er.exports = Gv()), er.exports;
}
var lr = { exports: {} }, et = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Rh;
function Qv() {
  if (Rh) return et;
  Rh = 1;
  var i = or();
  function o(b) {
    var p = "https://react.dev/errors/" + b;
    if (1 < arguments.length) {
      p += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var R = 2; R < arguments.length; R++)
        p += "&args[]=" + encodeURIComponent(arguments[R]);
    }
    return "Minified React error #" + b + "; visit " + p + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function f() {
  }
  var s = {
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
  }, h = Symbol.for("react.portal");
  function m(b, p, R) {
    var E = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: h,
      key: E == null ? null : "" + E,
      children: b,
      containerInfo: p,
      implementation: R
    };
  }
  var v = i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function y(b, p) {
    if (b === "font") return "";
    if (typeof p == "string")
      return p === "use-credentials" ? p : "";
  }
  return et.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = s, et.createPortal = function(b, p) {
    var R = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!p || p.nodeType !== 1 && p.nodeType !== 9 && p.nodeType !== 11)
      throw Error(o(299));
    return m(b, p, null, R);
  }, et.flushSync = function(b) {
    var p = v.T, R = s.p;
    try {
      if (v.T = null, s.p = 2, b) return b();
    } finally {
      v.T = p, s.p = R, s.d.f();
    }
  }, et.preconnect = function(b, p) {
    typeof b == "string" && (p ? (p = p.crossOrigin, p = typeof p == "string" ? p === "use-credentials" ? p : "" : void 0) : p = null, s.d.C(b, p));
  }, et.prefetchDNS = function(b) {
    typeof b == "string" && s.d.D(b);
  }, et.preinit = function(b, p) {
    if (typeof b == "string" && p && typeof p.as == "string") {
      var R = p.as, E = y(R, p.crossOrigin), N = typeof p.integrity == "string" ? p.integrity : void 0, B = typeof p.fetchPriority == "string" ? p.fetchPriority : void 0;
      R === "style" ? s.d.S(
        b,
        typeof p.precedence == "string" ? p.precedence : void 0,
        {
          crossOrigin: E,
          integrity: N,
          fetchPriority: B
        }
      ) : R === "script" && s.d.X(b, {
        crossOrigin: E,
        integrity: N,
        fetchPriority: B,
        nonce: typeof p.nonce == "string" ? p.nonce : void 0
      });
    }
  }, et.preinitModule = function(b, p) {
    if (typeof b == "string")
      if (typeof p == "object" && p !== null) {
        if (p.as == null || p.as === "script") {
          var R = y(
            p.as,
            p.crossOrigin
          );
          s.d.M(b, {
            crossOrigin: R,
            integrity: typeof p.integrity == "string" ? p.integrity : void 0,
            nonce: typeof p.nonce == "string" ? p.nonce : void 0
          });
        }
      } else p == null && s.d.M(b);
  }, et.preload = function(b, p) {
    if (typeof b == "string" && typeof p == "object" && p !== null && typeof p.as == "string") {
      var R = p.as, E = y(R, p.crossOrigin);
      s.d.L(b, R, {
        crossOrigin: E,
        integrity: typeof p.integrity == "string" ? p.integrity : void 0,
        nonce: typeof p.nonce == "string" ? p.nonce : void 0,
        type: typeof p.type == "string" ? p.type : void 0,
        fetchPriority: typeof p.fetchPriority == "string" ? p.fetchPriority : void 0,
        referrerPolicy: typeof p.referrerPolicy == "string" ? p.referrerPolicy : void 0,
        imageSrcSet: typeof p.imageSrcSet == "string" ? p.imageSrcSet : void 0,
        imageSizes: typeof p.imageSizes == "string" ? p.imageSizes : void 0,
        media: typeof p.media == "string" ? p.media : void 0
      });
    }
  }, et.preloadModule = function(b, p) {
    if (typeof b == "string")
      if (p) {
        var R = y(p.as, p.crossOrigin);
        s.d.m(b, {
          as: typeof p.as == "string" && p.as !== "script" ? p.as : void 0,
          crossOrigin: R,
          integrity: typeof p.integrity == "string" ? p.integrity : void 0
        });
      } else s.d.m(b);
  }, et.requestFormReset = function(b) {
    s.d.r(b);
  }, et.unstable_batchedUpdates = function(b, p) {
    return b(p);
  }, et.useFormState = function(b, p, R) {
    return v.H.useFormState(b, p, R);
  }, et.useFormStatus = function() {
    return v.H.useHostTransitionStatus();
  }, et.version = "19.2.8", et;
}
var Oh;
function Zv() {
  if (Oh) return lr.exports;
  Oh = 1;
  function i() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i);
      } catch (o) {
        console.error(o);
      }
  }
  return i(), lr.exports = Qv(), lr.exports;
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
var Ch;
function Vv() {
  if (Ch) return Vn;
  Ch = 1;
  var i = Xv(), o = or(), f = Zv();
  function s(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var l = 2; l < arguments.length; l++)
        t += "&args[]=" + encodeURIComponent(arguments[l]);
    }
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function h(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function m(e) {
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
  function v(e) {
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
  function b(e) {
    if (m(e) !== e)
      throw Error(s(188));
  }
  function p(e) {
    var t = e.alternate;
    if (!t) {
      if (t = m(e), t === null) throw Error(s(188));
      return t !== e ? null : e;
    }
    for (var l = e, a = t; ; ) {
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
          if (u === l) return b(n), e;
          if (u === a) return b(n), t;
          u = u.sibling;
        }
        throw Error(s(188));
      }
      if (l.return !== a.return) l = n, a = u;
      else {
        for (var c = !1, d = n.child; d; ) {
          if (d === l) {
            c = !0, l = n, a = u;
            break;
          }
          if (d === a) {
            c = !0, a = n, l = u;
            break;
          }
          d = d.sibling;
        }
        if (!c) {
          for (d = u.child; d; ) {
            if (d === l) {
              c = !0, l = u, a = n;
              break;
            }
            if (d === a) {
              c = !0, a = u, l = n;
              break;
            }
            d = d.sibling;
          }
          if (!c) throw Error(s(189));
        }
      }
      if (l.alternate !== a) throw Error(s(190));
    }
    if (l.tag !== 3) throw Error(s(188));
    return l.stateNode.current === l ? e : t;
  }
  function R(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null; ) {
      if (t = R(e), t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var E = Object.assign, N = Symbol.for("react.element"), B = Symbol.for("react.transitional.element"), L = Symbol.for("react.portal"), q = Symbol.for("react.fragment"), w = Symbol.for("react.strict_mode"), V = Symbol.for("react.profiler"), k = Symbol.for("react.consumer"), X = Symbol.for("react.context"), le = Symbol.for("react.forward_ref"), fe = Symbol.for("react.suspense"), Te = Symbol.for("react.suspense_list"), W = Symbol.for("react.memo"), Ce = Symbol.for("react.lazy"), oe = Symbol.for("react.activity"), Vt = Symbol.for("react.memo_cache_sentinel"), jt = Symbol.iterator;
  function Ie(e) {
    return e === null || typeof e != "object" ? null : (e = jt && e[jt] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var Kt = Symbol.for("react.client.reference");
  function Tt(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === Kt ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case q:
        return "Fragment";
      case V:
        return "Profiler";
      case w:
        return "StrictMode";
      case fe:
        return "Suspense";
      case Te:
        return "SuspenseList";
      case oe:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case L:
          return "Portal";
        case X:
          return e.displayName || "Context";
        case k:
          return (e._context.displayName || "Context") + ".Consumer";
        case le:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case W:
          return t = e.displayName || null, t !== null ? t : Tt(e.type) || "Memo";
        case Ce:
          t = e._payload, e = e._init;
          try {
            return Tt(e(t));
          } catch {
          }
      }
    return null;
  }
  var Le = Array.isArray, M = o.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Y = f.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, F = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, ge = [], _e = -1;
  function S(e) {
    return { current: e };
  }
  function H(e) {
    0 > _e || (e.current = ge[_e], ge[_e] = null, _e--);
  }
  function G(e, t) {
    _e++, ge[_e] = e.current, e.current = t;
  }
  var Z = S(null), I = S(null), ae = S(null), pe = S(null);
  function lt(e, t) {
    switch (G(ae, t), G(I, e), G(Z, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? Kd(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = Kd(t), e = Jd(t, e);
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
    H(Z), G(Z, e);
  }
  function He() {
    H(Z), H(I), H(ae);
  }
  function Wa(e) {
    e.memoizedState !== null && G(pe, e);
    var t = Z.current, l = Jd(t, e.type);
    t !== l && (G(I, e), G(Z, l));
  }
  function In(e) {
    I.current === e && (H(Z), H(I)), pe.current === e && (H(pe), Yn._currentValue = F);
  }
  var Di, xr;
  function Ql(e) {
    if (Di === void 0)
      try {
        throw Error();
      } catch (l) {
        var t = l.stack.trim().match(/\n( *(at )?)/);
        Di = t && t[1] || "", xr = -1 < l.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < l.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + Di + e + xr;
  }
  var Ui = !1;
  function Hi(e, t) {
    if (!e || Ui) return "";
    Ui = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
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
                  var A = O;
                }
                Reflect.construct(e, [], U);
              } else {
                try {
                  U.call();
                } catch (O) {
                  A = O;
                }
                e.call(U.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (O) {
                A = O;
              }
              (U = e()) && typeof U.catch == "function" && U.catch(function() {
              });
            }
          } catch (O) {
            if (O && A && typeof O.stack == "string")
              return [O.stack, A.stack];
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
      var u = a.DetermineComponentFrameRoot(), c = u[0], d = u[1];
      if (c && d) {
        var g = c.split(`
`), z = d.split(`
`);
        for (n = a = 0; a < g.length && !g[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; n < z.length && !z[n].includes(
          "DetermineComponentFrameRoot"
        ); )
          n++;
        if (a === g.length || n === z.length)
          for (a = g.length - 1, n = z.length - 1; 1 <= a && 0 <= n && g[a] !== z[n]; )
            n--;
        for (; 1 <= a && 0 <= n; a--, n--)
          if (g[a] !== z[n]) {
            if (a !== 1 || n !== 1)
              do
                if (a--, n--, 0 > n || g[a] !== z[n]) {
                  var C = `
` + g[a].replace(" at new ", " at ");
                  return e.displayName && C.includes("<anonymous>") && (C = C.replace("<anonymous>", e.displayName)), C;
                }
              while (1 <= a && 0 <= n);
            break;
          }
      }
    } finally {
      Ui = !1, Error.prepareStackTrace = l;
    }
    return (l = e ? e.displayName || e.name : "") ? Ql(l) : "";
  }
  function hm(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return Ql(e.type);
      case 16:
        return Ql("Lazy");
      case 13:
        return e.child !== t && t !== null ? Ql("Suspense Fallback") : Ql("Suspense");
      case 19:
        return Ql("SuspenseList");
      case 0:
      case 15:
        return Hi(e.type, !1);
      case 11:
        return Hi(e.type.render, !1);
      case 1:
        return Hi(e.type, !0);
      case 31:
        return Ql("Activity");
      default:
        return "";
    }
  }
  function Sr(e) {
    try {
      var t = "", l = null;
      do
        t += hm(e, l), l = e, e = e.return;
      while (e);
      return t;
    } catch (a) {
      return `
Error generating stack: ` + a.message + `
` + a.stack;
    }
  }
  var wi = Object.prototype.hasOwnProperty, Bi = i.unstable_scheduleCallback, Li = i.unstable_cancelCallback, mm = i.unstable_shouldYield, pm = i.unstable_requestPaint, dt = i.unstable_now, vm = i.unstable_getCurrentPriorityLevel, _r = i.unstable_ImmediatePriority, Er = i.unstable_UserBlockingPriority, eu = i.unstable_NormalPriority, ym = i.unstable_LowPriority, jr = i.unstable_IdlePriority, gm = i.log, bm = i.unstable_setDisableYieldValue, Fa = null, ht = null;
  function gl(e) {
    if (typeof gm == "function" && bm(e), ht && typeof ht.setStrictMode == "function")
      try {
        ht.setStrictMode(Fa, e);
      } catch {
      }
  }
  var mt = Math.clz32 ? Math.clz32 : _m, xm = Math.log, Sm = Math.LN2;
  function _m(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (xm(e) / Sm | 0) | 0;
  }
  var tu = 256, lu = 262144, au = 4194304;
  function Zl(e) {
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
  function nu(e, t, l) {
    var a = e.pendingLanes;
    if (a === 0) return 0;
    var n = 0, u = e.suspendedLanes, c = e.pingedLanes;
    e = e.warmLanes;
    var d = a & 134217727;
    return d !== 0 ? (a = d & ~u, a !== 0 ? n = Zl(a) : (c &= d, c !== 0 ? n = Zl(c) : l || (l = d & ~e, l !== 0 && (n = Zl(l))))) : (d = a & ~u, d !== 0 ? n = Zl(d) : c !== 0 ? n = Zl(c) : l || (l = a & ~e, l !== 0 && (n = Zl(l)))), n === 0 ? 0 : t !== 0 && t !== n && (t & u) === 0 && (u = n & -n, l = t & -t, u >= l || u === 32 && (l & 4194048) !== 0) ? t : n;
  }
  function Pa(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function Em(e, t) {
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
  function Tr() {
    var e = au;
    return au <<= 1, (au & 62914560) === 0 && (au = 4194304), e;
  }
  function qi(e) {
    for (var t = [], l = 0; 31 > l; l++) t.push(e);
    return t;
  }
  function Ia(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function jm(e, t, l, a, n, u) {
    var c = e.pendingLanes;
    e.pendingLanes = l, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= l, e.entangledLanes &= l, e.errorRecoveryDisabledLanes &= l, e.shellSuspendCounter = 0;
    var d = e.entanglements, g = e.expirationTimes, z = e.hiddenUpdates;
    for (l = c & ~l; 0 < l; ) {
      var C = 31 - mt(l), U = 1 << C;
      d[C] = 0, g[C] = -1;
      var A = z[C];
      if (A !== null)
        for (z[C] = null, C = 0; C < A.length; C++) {
          var O = A[C];
          O !== null && (O.lane &= -536870913);
        }
      l &= ~U;
    }
    a !== 0 && zr(e, a, 0), u !== 0 && n === 0 && e.tag !== 0 && (e.suspendedLanes |= u & ~(c & ~t));
  }
  function zr(e, t, l) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var a = 31 - mt(t);
    e.entangledLanes |= t, e.entanglements[a] = e.entanglements[a] | 1073741824 | l & 261930;
  }
  function Nr(e, t) {
    var l = e.entangledLanes |= t;
    for (e = e.entanglements; l; ) {
      var a = 31 - mt(l), n = 1 << a;
      n & t | e[a] & t && (e[a] |= t), l &= ~n;
    }
  }
  function Ar(e, t) {
    var l = t & -t;
    return l = (l & 42) !== 0 ? 1 : Yi(l), (l & (e.suspendedLanes | t)) !== 0 ? 0 : l;
  }
  function Yi(e) {
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
  function Gi(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Rr() {
    var e = Y.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : vh(e.type));
  }
  function Or(e, t) {
    var l = Y.p;
    try {
      return Y.p = e, t();
    } finally {
      Y.p = l;
    }
  }
  var bl = Math.random().toString(36).slice(2), Ke = "__reactFiber$" + bl, nt = "__reactProps$" + bl, oa = "__reactContainer$" + bl, Xi = "__reactEvents$" + bl, Tm = "__reactListeners$" + bl, zm = "__reactHandles$" + bl, Cr = "__reactResources$" + bl, en = "__reactMarker$" + bl;
  function Qi(e) {
    delete e[Ke], delete e[nt], delete e[Xi], delete e[Tm], delete e[zm];
  }
  function fa(e) {
    var t = e[Ke];
    if (t) return t;
    for (var l = e.parentNode; l; ) {
      if (t = l[oa] || l[Ke]) {
        if (l = t.alternate, t.child !== null || l !== null && l.child !== null)
          for (e = eh(e); e !== null; ) {
            if (l = e[Ke]) return l;
            e = eh(e);
          }
        return t;
      }
      e = l, l = e.parentNode;
    }
    return null;
  }
  function da(e) {
    if (e = e[Ke] || e[oa]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function tn(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(s(33));
  }
  function ha(e) {
    var t = e[Cr];
    return t || (t = e[Cr] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function Ze(e) {
    e[en] = !0;
  }
  var Mr = /* @__PURE__ */ new Set(), Dr = {};
  function Vl(e, t) {
    ma(e, t), ma(e + "Capture", t);
  }
  function ma(e, t) {
    for (Dr[e] = t, e = 0; e < t.length; e++)
      Mr.add(t[e]);
  }
  var Nm = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Ur = {}, Hr = {};
  function Am(e) {
    return wi.call(Hr, e) ? !0 : wi.call(Ur, e) ? !1 : Nm.test(e) ? Hr[e] = !0 : (Ur[e] = !0, !1);
  }
  function uu(e, t, l) {
    if (Am(t))
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
  function iu(e, t, l) {
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
  function Pt(e, t, l, a) {
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
  function zt(e) {
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
  function wr(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Rm(e, t, l) {
    var a = Object.getOwnPropertyDescriptor(
      e.constructor.prototype,
      t
    );
    if (!e.hasOwnProperty(t) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
      var n = a.get, u = a.set;
      return Object.defineProperty(e, t, {
        configurable: !0,
        get: function() {
          return n.call(this);
        },
        set: function(c) {
          l = "" + c, u.call(this, c);
        }
      }), Object.defineProperty(e, t, {
        enumerable: a.enumerable
      }), {
        getValue: function() {
          return l;
        },
        setValue: function(c) {
          l = "" + c;
        },
        stopTracking: function() {
          e._valueTracker = null, delete e[t];
        }
      };
    }
  }
  function Zi(e) {
    if (!e._valueTracker) {
      var t = wr(e) ? "checked" : "value";
      e._valueTracker = Rm(
        e,
        t,
        "" + e[t]
      );
    }
  }
  function Br(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var l = t.getValue(), a = "";
    return e && (a = wr(e) ? e.checked ? "true" : "false" : e.value), e = a, e !== l ? (t.setValue(e), !0) : !1;
  }
  function cu(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var Om = /[\n"\\]/g;
  function Nt(e) {
    return e.replace(
      Om,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Vi(e, t, l, a, n, u, c, d) {
    e.name = "", c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" ? e.type = c : e.removeAttribute("type"), t != null ? c === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + zt(t)) : e.value !== "" + zt(t) && (e.value = "" + zt(t)) : c !== "submit" && c !== "reset" || e.removeAttribute("value"), t != null ? Ki(e, c, zt(t)) : l != null ? Ki(e, c, zt(l)) : a != null && e.removeAttribute("value"), n == null && u != null && (e.defaultChecked = !!u), n != null && (e.checked = n && typeof n != "function" && typeof n != "symbol"), d != null && typeof d != "function" && typeof d != "symbol" && typeof d != "boolean" ? e.name = "" + zt(d) : e.removeAttribute("name");
  }
  function Lr(e, t, l, a, n, u, c, d) {
    if (u != null && typeof u != "function" && typeof u != "symbol" && typeof u != "boolean" && (e.type = u), t != null || l != null) {
      if (!(u !== "submit" && u !== "reset" || t != null)) {
        Zi(e);
        return;
      }
      l = l != null ? "" + zt(l) : "", t = t != null ? "" + zt(t) : l, d || t === e.value || (e.value = t), e.defaultValue = t;
    }
    a = a ?? n, a = typeof a != "function" && typeof a != "symbol" && !!a, e.checked = d ? e.checked : !!a, e.defaultChecked = !!a, c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" && (e.name = c), Zi(e);
  }
  function Ki(e, t, l) {
    t === "number" && cu(e.ownerDocument) === e || e.defaultValue === "" + l || (e.defaultValue = "" + l);
  }
  function pa(e, t, l, a) {
    if (e = e.options, t) {
      t = {};
      for (var n = 0; n < l.length; n++)
        t["$" + l[n]] = !0;
      for (l = 0; l < e.length; l++)
        n = t.hasOwnProperty("$" + e[l].value), e[l].selected !== n && (e[l].selected = n), n && a && (e[l].defaultSelected = !0);
    } else {
      for (l = "" + zt(l), t = null, n = 0; n < e.length; n++) {
        if (e[n].value === l) {
          e[n].selected = !0, a && (e[n].defaultSelected = !0);
          return;
        }
        t !== null || e[n].disabled || (t = e[n]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function qr(e, t, l) {
    if (t != null && (t = "" + zt(t), t !== e.value && (e.value = t), l == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = l != null ? "" + zt(l) : "";
  }
  function Yr(e, t, l, a) {
    if (t == null) {
      if (a != null) {
        if (l != null) throw Error(s(92));
        if (Le(a)) {
          if (1 < a.length) throw Error(s(93));
          a = a[0];
        }
        l = a;
      }
      l == null && (l = ""), t = l;
    }
    l = zt(t), e.defaultValue = l, a = e.textContent, a === l && a !== "" && a !== null && (e.value = a), Zi(e);
  }
  function va(e, t) {
    if (t) {
      var l = e.firstChild;
      if (l && l === e.lastChild && l.nodeType === 3) {
        l.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Cm = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Gr(e, t, l) {
    var a = t.indexOf("--") === 0;
    l == null || typeof l == "boolean" || l === "" ? a ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : a ? e.setProperty(t, l) : typeof l != "number" || l === 0 || Cm.has(t) ? t === "float" ? e.cssFloat = l : e[t] = ("" + l).trim() : e[t] = l + "px";
  }
  function Xr(e, t, l) {
    if (t != null && typeof t != "object")
      throw Error(s(62));
    if (e = e.style, l != null) {
      for (var a in l)
        !l.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf("--") === 0 ? e.setProperty(a, "") : a === "float" ? e.cssFloat = "" : e[a] = "");
      for (var n in t)
        a = t[n], t.hasOwnProperty(n) && l[n] !== a && Gr(e, n, a);
    } else
      for (var u in t)
        t.hasOwnProperty(u) && Gr(e, u, t[u]);
  }
  function Ji(e) {
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
  var Mm = /* @__PURE__ */ new Map([
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
  ]), Dm = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function su(e) {
    return Dm.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  function It() {
  }
  var ki = null;
  function $i(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var ya = null, ga = null;
  function Qr(e) {
    var t = da(e);
    if (t && (e = t.stateNode)) {
      var l = e[nt] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (Vi(
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
              'input[name="' + Nt(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < l.length; t++) {
              var a = l[t];
              if (a !== e && a.form === e.form) {
                var n = a[nt] || null;
                if (!n) throw Error(s(90));
                Vi(
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
              a = l[t], a.form === e.form && Br(a);
          }
          break e;
        case "textarea":
          qr(e, l.value, l.defaultValue);
          break e;
        case "select":
          t = l.value, t != null && pa(e, !!l.multiple, t, !1);
      }
    }
  }
  var Wi = !1;
  function Zr(e, t, l) {
    if (Wi) return e(t, l);
    Wi = !0;
    try {
      var a = e(t);
      return a;
    } finally {
      if (Wi = !1, (ya !== null || ga !== null) && ($u(), ya && (t = ya, e = ga, ga = ya = null, Qr(t), e)))
        for (t = 0; t < e.length; t++) Qr(e[t]);
    }
  }
  function ln(e, t) {
    var l = e.stateNode;
    if (l === null) return null;
    var a = l[nt] || null;
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
        s(231, t, typeof l)
      );
    return l;
  }
  var el = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Fi = !1;
  if (el)
    try {
      var an = {};
      Object.defineProperty(an, "passive", {
        get: function() {
          Fi = !0;
        }
      }), window.addEventListener("test", an, an), window.removeEventListener("test", an, an);
    } catch {
      Fi = !1;
    }
  var xl = null, Pi = null, ru = null;
  function Vr() {
    if (ru) return ru;
    var e, t = Pi, l = t.length, a, n = "value" in xl ? xl.value : xl.textContent, u = n.length;
    for (e = 0; e < l && t[e] === n[e]; e++) ;
    var c = l - e;
    for (a = 1; a <= c && t[l - a] === n[u - a]; a++) ;
    return ru = n.slice(e, 1 < a ? 1 - a : void 0);
  }
  function ou(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function fu() {
    return !0;
  }
  function Kr() {
    return !1;
  }
  function ut(e) {
    function t(l, a, n, u, c) {
      this._reactName = l, this._targetInst = n, this.type = a, this.nativeEvent = u, this.target = c, this.currentTarget = null;
      for (var d in e)
        e.hasOwnProperty(d) && (l = e[d], this[d] = l ? l(u) : u[d]);
      return this.isDefaultPrevented = (u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1) ? fu : Kr, this.isPropagationStopped = Kr, this;
    }
    return E(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var l = this.nativeEvent;
        l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = fu);
      },
      stopPropagation: function() {
        var l = this.nativeEvent;
        l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = fu);
      },
      persist: function() {
      },
      isPersistent: fu
    }), t;
  }
  var Kl = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, du = ut(Kl), nn = E({}, Kl, { view: 0, detail: 0 }), Um = ut(nn), Ii, ec, un, hu = E({}, nn, {
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
    getModifierState: lc,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== un && (un && e.type === "mousemove" ? (Ii = e.screenX - un.screenX, ec = e.screenY - un.screenY) : ec = Ii = 0, un = e), Ii);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : ec;
    }
  }), Jr = ut(hu), Hm = E({}, hu, { dataTransfer: 0 }), wm = ut(Hm), Bm = E({}, nn, { relatedTarget: 0 }), tc = ut(Bm), Lm = E({}, Kl, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), qm = ut(Lm), Ym = E({}, Kl, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), Gm = ut(Ym), Xm = E({}, Kl, { data: 0 }), kr = ut(Xm), Qm = {
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
  }, Zm = {
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
  }, Vm = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function Km(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Vm[e]) ? !!t[e] : !1;
  }
  function lc() {
    return Km;
  }
  var Jm = E({}, nn, {
    key: function(e) {
      if (e.key) {
        var t = Qm[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = ou(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Zm[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: lc,
    charCode: function(e) {
      return e.type === "keypress" ? ou(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? ou(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), km = ut(Jm), $m = E({}, hu, {
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
  }), $r = ut($m), Wm = E({}, nn, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: lc
  }), Fm = ut(Wm), Pm = E({}, Kl, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Im = ut(Pm), ep = E({}, hu, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), tp = ut(ep), lp = E({}, Kl, {
    newState: 0,
    oldState: 0
  }), ap = ut(lp), np = [9, 13, 27, 32], ac = el && "CompositionEvent" in window, cn = null;
  el && "documentMode" in document && (cn = document.documentMode);
  var up = el && "TextEvent" in window && !cn, Wr = el && (!ac || cn && 8 < cn && 11 >= cn), Fr = " ", Pr = !1;
  function Ir(e, t) {
    switch (e) {
      case "keyup":
        return np.indexOf(t.keyCode) !== -1;
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
  function eo(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var ba = !1;
  function ip(e, t) {
    switch (e) {
      case "compositionend":
        return eo(t);
      case "keypress":
        return t.which !== 32 ? null : (Pr = !0, Fr);
      case "textInput":
        return e = t.data, e === Fr && Pr ? null : e;
      default:
        return null;
    }
  }
  function cp(e, t) {
    if (ba)
      return e === "compositionend" || !ac && Ir(e, t) ? (e = Vr(), ru = Pi = xl = null, ba = !1, e) : null;
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
        return Wr && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var sp = {
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
  function to(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!sp[e.type] : t === "textarea";
  }
  function lo(e, t, l, a) {
    ya ? ga ? ga.push(a) : ga = [a] : ya = a, t = li(t, "onChange"), 0 < t.length && (l = new du(
      "onChange",
      "change",
      null,
      l,
      a
    ), e.push({ event: l, listeners: t }));
  }
  var sn = null, rn = null;
  function rp(e) {
    Yd(e, 0);
  }
  function mu(e) {
    var t = tn(e);
    if (Br(t)) return e;
  }
  function ao(e, t) {
    if (e === "change") return t;
  }
  var no = !1;
  if (el) {
    var nc;
    if (el) {
      var uc = "oninput" in document;
      if (!uc) {
        var uo = document.createElement("div");
        uo.setAttribute("oninput", "return;"), uc = typeof uo.oninput == "function";
      }
      nc = uc;
    } else nc = !1;
    no = nc && (!document.documentMode || 9 < document.documentMode);
  }
  function io() {
    sn && (sn.detachEvent("onpropertychange", co), rn = sn = null);
  }
  function co(e) {
    if (e.propertyName === "value" && mu(rn)) {
      var t = [];
      lo(
        t,
        rn,
        e,
        $i(e)
      ), Zr(rp, t);
    }
  }
  function op(e, t, l) {
    e === "focusin" ? (io(), sn = t, rn = l, sn.attachEvent("onpropertychange", co)) : e === "focusout" && io();
  }
  function fp(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return mu(rn);
  }
  function dp(e, t) {
    if (e === "click") return mu(t);
  }
  function hp(e, t) {
    if (e === "input" || e === "change")
      return mu(t);
  }
  function mp(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var pt = typeof Object.is == "function" ? Object.is : mp;
  function on(e, t) {
    if (pt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var l = Object.keys(e), a = Object.keys(t);
    if (l.length !== a.length) return !1;
    for (a = 0; a < l.length; a++) {
      var n = l[a];
      if (!wi.call(t, n) || !pt(e[n], t[n]))
        return !1;
    }
    return !0;
  }
  function so(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function ro(e, t) {
    var l = so(e);
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
      l = so(l);
    }
  }
  function oo(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? oo(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function fo(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = cu(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var l = typeof t.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) e = t.contentWindow;
      else break;
      t = cu(e.document);
    }
    return t;
  }
  function ic(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var pp = el && "documentMode" in document && 11 >= document.documentMode, xa = null, cc = null, fn = null, sc = !1;
  function ho(e, t, l) {
    var a = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    sc || xa == null || xa !== cu(a) || (a = xa, "selectionStart" in a && ic(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), fn && on(fn, a) || (fn = a, a = li(cc, "onSelect"), 0 < a.length && (t = new du(
      "onSelect",
      "select",
      null,
      t,
      l
    ), e.push({ event: t, listeners: a }), t.target = xa)));
  }
  function Jl(e, t) {
    var l = {};
    return l[e.toLowerCase()] = t.toLowerCase(), l["Webkit" + e] = "webkit" + t, l["Moz" + e] = "moz" + t, l;
  }
  var Sa = {
    animationend: Jl("Animation", "AnimationEnd"),
    animationiteration: Jl("Animation", "AnimationIteration"),
    animationstart: Jl("Animation", "AnimationStart"),
    transitionrun: Jl("Transition", "TransitionRun"),
    transitionstart: Jl("Transition", "TransitionStart"),
    transitioncancel: Jl("Transition", "TransitionCancel"),
    transitionend: Jl("Transition", "TransitionEnd")
  }, rc = {}, mo = {};
  el && (mo = document.createElement("div").style, "AnimationEvent" in window || (delete Sa.animationend.animation, delete Sa.animationiteration.animation, delete Sa.animationstart.animation), "TransitionEvent" in window || delete Sa.transitionend.transition);
  function kl(e) {
    if (rc[e]) return rc[e];
    if (!Sa[e]) return e;
    var t = Sa[e], l;
    for (l in t)
      if (t.hasOwnProperty(l) && l in mo)
        return rc[e] = t[l];
    return e;
  }
  var po = kl("animationend"), vo = kl("animationiteration"), yo = kl("animationstart"), vp = kl("transitionrun"), yp = kl("transitionstart"), gp = kl("transitioncancel"), go = kl("transitionend"), bo = /* @__PURE__ */ new Map(), oc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  oc.push("scrollEnd");
  function Gt(e, t) {
    bo.set(e, t), Vl(t, [e]);
  }
  var pu = typeof reportError == "function" ? reportError : function(e) {
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
  }, At = [], _a = 0, fc = 0;
  function vu() {
    for (var e = _a, t = fc = _a = 0; t < e; ) {
      var l = At[t];
      At[t++] = null;
      var a = At[t];
      At[t++] = null;
      var n = At[t];
      At[t++] = null;
      var u = At[t];
      if (At[t++] = null, a !== null && n !== null) {
        var c = a.pending;
        c === null ? n.next = n : (n.next = c.next, c.next = n), a.pending = n;
      }
      u !== 0 && xo(l, n, u);
    }
  }
  function yu(e, t, l, a) {
    At[_a++] = e, At[_a++] = t, At[_a++] = l, At[_a++] = a, fc |= a, e.lanes |= a, e = e.alternate, e !== null && (e.lanes |= a);
  }
  function dc(e, t, l, a) {
    return yu(e, t, l, a), gu(e);
  }
  function $l(e, t) {
    return yu(e, null, null, t), gu(e);
  }
  function xo(e, t, l) {
    e.lanes |= l;
    var a = e.alternate;
    a !== null && (a.lanes |= l);
    for (var n = !1, u = e.return; u !== null; )
      u.childLanes |= l, a = u.alternate, a !== null && (a.childLanes |= l), u.tag === 22 && (e = u.stateNode, e === null || e._visibility & 1 || (n = !0)), e = u, u = u.return;
    return e.tag === 3 ? (u = e.stateNode, n && t !== null && (n = 31 - mt(l), e = u.hiddenUpdates, a = e[n], a === null ? e[n] = [t] : a.push(t), t.lane = l | 536870912), u) : null;
  }
  function gu(e) {
    if (50 < Dn)
      throw Dn = 0, Ss = null, Error(s(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var Ea = {};
  function bp(e, t, l, a) {
    this.tag = e, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function vt(e, t, l, a) {
    return new bp(e, t, l, a);
  }
  function hc(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function tl(e, t) {
    var l = e.alternate;
    return l === null ? (l = vt(
      e.tag,
      t,
      e.key,
      e.mode
    ), l.elementType = e.elementType, l.type = e.type, l.stateNode = e.stateNode, l.alternate = e, e.alternate = l) : (l.pendingProps = t, l.type = e.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = e.flags & 65011712, l.childLanes = e.childLanes, l.lanes = e.lanes, l.child = e.child, l.memoizedProps = e.memoizedProps, l.memoizedState = e.memoizedState, l.updateQueue = e.updateQueue, t = e.dependencies, l.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, l.sibling = e.sibling, l.index = e.index, l.ref = e.ref, l.refCleanup = e.refCleanup, l;
  }
  function So(e, t) {
    e.flags &= 65011714;
    var l = e.alternate;
    return l === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = l.childLanes, e.lanes = l.lanes, e.child = l.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = l.memoizedProps, e.memoizedState = l.memoizedState, e.updateQueue = l.updateQueue, e.type = l.type, t = l.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function bu(e, t, l, a, n, u) {
    var c = 0;
    if (a = e, typeof e == "function") hc(e) && (c = 1);
    else if (typeof e == "string")
      c = jv(
        e,
        l,
        Z.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case oe:
          return e = vt(31, l, t, n), e.elementType = oe, e.lanes = u, e;
        case q:
          return Wl(l.children, n, u, t);
        case w:
          c = 8, n |= 24;
          break;
        case V:
          return e = vt(12, l, t, n | 2), e.elementType = V, e.lanes = u, e;
        case fe:
          return e = vt(13, l, t, n), e.elementType = fe, e.lanes = u, e;
        case Te:
          return e = vt(19, l, t, n), e.elementType = Te, e.lanes = u, e;
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case X:
                c = 10;
                break e;
              case k:
                c = 9;
                break e;
              case le:
                c = 11;
                break e;
              case W:
                c = 14;
                break e;
              case Ce:
                c = 16, a = null;
                break e;
            }
          c = 29, l = Error(
            s(130, e === null ? "null" : typeof e, "")
          ), a = null;
      }
    return t = vt(c, l, t, n), t.elementType = e, t.type = a, t.lanes = u, t;
  }
  function Wl(e, t, l, a) {
    return e = vt(7, e, a, t), e.lanes = l, e;
  }
  function mc(e, t, l) {
    return e = vt(6, e, null, t), e.lanes = l, e;
  }
  function _o(e) {
    var t = vt(18, null, null, 0);
    return t.stateNode = e, t;
  }
  function pc(e, t, l) {
    return t = vt(
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
  var Eo = /* @__PURE__ */ new WeakMap();
  function Rt(e, t) {
    if (typeof e == "object" && e !== null) {
      var l = Eo.get(e);
      return l !== void 0 ? l : (t = {
        value: e,
        source: t,
        stack: Sr(t)
      }, Eo.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: Sr(t)
    };
  }
  var ja = [], Ta = 0, xu = null, dn = 0, Ot = [], Ct = 0, Sl = null, Jt = 1, kt = "";
  function ll(e, t) {
    ja[Ta++] = dn, ja[Ta++] = xu, xu = e, dn = t;
  }
  function jo(e, t, l) {
    Ot[Ct++] = Jt, Ot[Ct++] = kt, Ot[Ct++] = Sl, Sl = e;
    var a = Jt;
    e = kt;
    var n = 32 - mt(a) - 1;
    a &= ~(1 << n), l += 1;
    var u = 32 - mt(t) + n;
    if (30 < u) {
      var c = n - n % 5;
      u = (a & (1 << c) - 1).toString(32), a >>= c, n -= c, Jt = 1 << 32 - mt(t) + n | l << n | a, kt = u + e;
    } else
      Jt = 1 << u | l << n | a, kt = e;
  }
  function vc(e) {
    e.return !== null && (ll(e, 1), jo(e, 1, 0));
  }
  function yc(e) {
    for (; e === xu; )
      xu = ja[--Ta], ja[Ta] = null, dn = ja[--Ta], ja[Ta] = null;
    for (; e === Sl; )
      Sl = Ot[--Ct], Ot[Ct] = null, kt = Ot[--Ct], Ot[Ct] = null, Jt = Ot[--Ct], Ot[Ct] = null;
  }
  function To(e, t) {
    Ot[Ct++] = Jt, Ot[Ct++] = kt, Ot[Ct++] = Sl, Jt = t.id, kt = t.overflow, Sl = e;
  }
  var Je = null, ze = null, se = !1, _l = null, Mt = !1, gc = Error(s(519));
  function El(e) {
    var t = Error(
      s(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw hn(Rt(t, e)), gc;
  }
  function zo(e) {
    var t = e.stateNode, l = e.type, a = e.memoizedProps;
    switch (t[Ke] = e, t[nt] = a, l) {
      case "dialog":
        ue("cancel", t), ue("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        ue("load", t);
        break;
      case "video":
      case "audio":
        for (l = 0; l < Hn.length; l++)
          ue(Hn[l], t);
        break;
      case "source":
        ue("error", t);
        break;
      case "img":
      case "image":
      case "link":
        ue("error", t), ue("load", t);
        break;
      case "details":
        ue("toggle", t);
        break;
      case "input":
        ue("invalid", t), Lr(
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
        ue("invalid", t);
        break;
      case "textarea":
        ue("invalid", t), Yr(t, a.value, a.defaultValue, a.children);
    }
    l = a.children, typeof l != "string" && typeof l != "number" && typeof l != "bigint" || t.textContent === "" + l || a.suppressHydrationWarning === !0 || Zd(t.textContent, l) ? (a.popover != null && (ue("beforetoggle", t), ue("toggle", t)), a.onScroll != null && ue("scroll", t), a.onScrollEnd != null && ue("scrollend", t), a.onClick != null && (t.onclick = It), t = !0) : t = !1, t || El(e, !0);
  }
  function No(e) {
    for (Je = e.return; Je; )
      switch (Je.tag) {
        case 5:
        case 31:
        case 13:
          Mt = !1;
          return;
        case 27:
        case 3:
          Mt = !0;
          return;
        default:
          Je = Je.return;
      }
  }
  function za(e) {
    if (e !== Je) return !1;
    if (!se) return No(e), se = !0, !1;
    var t = e.tag, l;
    if ((l = t !== 3 && t !== 27) && ((l = t === 5) && (l = e.type, l = !(l !== "form" && l !== "button") || ws(e.type, e.memoizedProps)), l = !l), l && ze && El(e), No(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(s(317));
      ze = Id(e);
    } else if (t === 31) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(s(317));
      ze = Id(e);
    } else
      t === 27 ? (t = ze, Bl(e.type) ? (e = Gs, Gs = null, ze = e) : ze = t) : ze = Je ? Ut(e.stateNode.nextSibling) : null;
    return !0;
  }
  function Fl() {
    ze = Je = null, se = !1;
  }
  function bc() {
    var e = _l;
    return e !== null && (rt === null ? rt = e : rt.push.apply(
      rt,
      e
    ), _l = null), e;
  }
  function hn(e) {
    _l === null ? _l = [e] : _l.push(e);
  }
  var xc = S(null), Pl = null, al = null;
  function jl(e, t, l) {
    G(xc, t._currentValue), t._currentValue = l;
  }
  function nl(e) {
    e._currentValue = xc.current, H(xc);
  }
  function Sc(e, t, l) {
    for (; e !== null; ) {
      var a = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, a !== null && (a.childLanes |= t)) : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t), e === l) break;
      e = e.return;
    }
  }
  function _c(e, t, l, a) {
    var n = e.child;
    for (n !== null && (n.return = e); n !== null; ) {
      var u = n.dependencies;
      if (u !== null) {
        var c = n.child;
        u = u.firstContext;
        e: for (; u !== null; ) {
          var d = u;
          u = n;
          for (var g = 0; g < t.length; g++)
            if (d.context === t[g]) {
              u.lanes |= l, d = u.alternate, d !== null && (d.lanes |= l), Sc(
                u.return,
                l,
                e
              ), a || (c = null);
              break e;
            }
          u = d.next;
        }
      } else if (n.tag === 18) {
        if (c = n.return, c === null) throw Error(s(341));
        c.lanes |= l, u = c.alternate, u !== null && (u.lanes |= l), Sc(c, l, e), c = null;
      } else c = n.child;
      if (c !== null) c.return = n;
      else
        for (c = n; c !== null; ) {
          if (c === e) {
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
  function Na(e, t, l, a) {
    e = null;
    for (var n = t, u = !1; n !== null; ) {
      if (!u) {
        if ((n.flags & 524288) !== 0) u = !0;
        else if ((n.flags & 262144) !== 0) break;
      }
      if (n.tag === 10) {
        var c = n.alternate;
        if (c === null) throw Error(s(387));
        if (c = c.memoizedProps, c !== null) {
          var d = n.type;
          pt(n.pendingProps.value, c.value) || (e !== null ? e.push(d) : e = [d]);
        }
      } else if (n === pe.current) {
        if (c = n.alternate, c === null) throw Error(s(387));
        c.memoizedState.memoizedState !== n.memoizedState.memoizedState && (e !== null ? e.push(Yn) : e = [Yn]);
      }
      n = n.return;
    }
    e !== null && _c(
      t,
      e,
      l,
      a
    ), t.flags |= 262144;
  }
  function Su(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!pt(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function Il(e) {
    Pl = e, al = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function ke(e) {
    return Ao(Pl, e);
  }
  function _u(e, t) {
    return Pl === null && Il(e), Ao(e, t);
  }
  function Ao(e, t) {
    var l = t._currentValue;
    if (t = { context: t, memoizedValue: l, next: null }, al === null) {
      if (e === null) throw Error(s(308));
      al = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else al = al.next = t;
    return l;
  }
  var xp = typeof AbortController < "u" ? AbortController : function() {
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
  }, Sp = i.unstable_scheduleCallback, _p = i.unstable_NormalPriority, qe = {
    $$typeof: X,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Ec() {
    return {
      controller: new xp(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function mn(e) {
    e.refCount--, e.refCount === 0 && Sp(_p, function() {
      e.controller.abort();
    });
  }
  var pn = null, jc = 0, Aa = 0, Ra = null;
  function Ep(e, t) {
    if (pn === null) {
      var l = pn = [];
      jc = 0, Aa = Ns(), Ra = {
        status: "pending",
        value: void 0,
        then: function(a) {
          l.push(a);
        }
      };
    }
    return jc++, t.then(Ro, Ro), t;
  }
  function Ro() {
    if (--jc === 0 && pn !== null) {
      Ra !== null && (Ra.status = "fulfilled");
      var e = pn;
      pn = null, Aa = 0, Ra = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function jp(e, t) {
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
  var Oo = M.S;
  M.S = function(e, t) {
    md = dt(), typeof t == "object" && t !== null && typeof t.then == "function" && Ep(e, t), Oo !== null && Oo(e, t);
  };
  var ea = S(null);
  function Tc() {
    var e = ea.current;
    return e !== null ? e : Ee.pooledCache;
  }
  function Eu(e, t) {
    t === null ? G(ea, ea.current) : G(ea, t.pool);
  }
  function Co() {
    var e = Tc();
    return e === null ? null : { parent: qe._currentValue, pool: e };
  }
  var Oa = Error(s(460)), zc = Error(s(474)), ju = Error(s(542)), Tu = { then: function() {
  } };
  function Mo(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function Do(e, t, l) {
    switch (l = e[l], l === void 0 ? e.push(t) : l !== t && (t.then(It, It), t = l), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, Ho(e), e;
      default:
        if (typeof t.status == "string") t.then(It, It);
        else {
          if (e = Ee, e !== null && 100 < e.shellSuspendCounter)
            throw Error(s(482));
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
            throw e = t.reason, Ho(e), e;
        }
        throw la = t, Oa;
    }
  }
  function ta(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (l) {
      throw l !== null && typeof l == "object" && typeof l.then == "function" ? (la = l, Oa) : l;
    }
  }
  var la = null;
  function Uo() {
    if (la === null) throw Error(s(459));
    var e = la;
    return la = null, e;
  }
  function Ho(e) {
    if (e === Oa || e === ju)
      throw Error(s(483));
  }
  var Ca = null, vn = 0;
  function zu(e) {
    var t = vn;
    return vn += 1, Ca === null && (Ca = []), Do(Ca, e, t);
  }
  function yn(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function Nu(e, t) {
    throw t.$$typeof === N ? Error(s(525)) : (e = Object.prototype.toString.call(t), Error(
      s(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function wo(e) {
    function t(_, x) {
      if (e) {
        var T = _.deletions;
        T === null ? (_.deletions = [x], _.flags |= 16) : T.push(x);
      }
    }
    function l(_, x) {
      if (!e) return null;
      for (; x !== null; )
        t(_, x), x = x.sibling;
      return null;
    }
    function a(_) {
      for (var x = /* @__PURE__ */ new Map(); _ !== null; )
        _.key !== null ? x.set(_.key, _) : x.set(_.index, _), _ = _.sibling;
      return x;
    }
    function n(_, x) {
      return _ = tl(_, x), _.index = 0, _.sibling = null, _;
    }
    function u(_, x, T) {
      return _.index = T, e ? (T = _.alternate, T !== null ? (T = T.index, T < x ? (_.flags |= 67108866, x) : T) : (_.flags |= 67108866, x)) : (_.flags |= 1048576, x);
    }
    function c(_) {
      return e && _.alternate === null && (_.flags |= 67108866), _;
    }
    function d(_, x, T, D) {
      return x === null || x.tag !== 6 ? (x = mc(T, _.mode, D), x.return = _, x) : (x = n(x, T), x.return = _, x);
    }
    function g(_, x, T, D) {
      var J = T.type;
      return J === q ? C(
        _,
        x,
        T.props.children,
        D,
        T.key
      ) : x !== null && (x.elementType === J || typeof J == "object" && J !== null && J.$$typeof === Ce && ta(J) === x.type) ? (x = n(x, T.props), yn(x, T), x.return = _, x) : (x = bu(
        T.type,
        T.key,
        T.props,
        null,
        _.mode,
        D
      ), yn(x, T), x.return = _, x);
    }
    function z(_, x, T, D) {
      return x === null || x.tag !== 4 || x.stateNode.containerInfo !== T.containerInfo || x.stateNode.implementation !== T.implementation ? (x = pc(T, _.mode, D), x.return = _, x) : (x = n(x, T.children || []), x.return = _, x);
    }
    function C(_, x, T, D, J) {
      return x === null || x.tag !== 7 ? (x = Wl(
        T,
        _.mode,
        D,
        J
      ), x.return = _, x) : (x = n(x, T), x.return = _, x);
    }
    function U(_, x, T) {
      if (typeof x == "string" && x !== "" || typeof x == "number" || typeof x == "bigint")
        return x = mc(
          "" + x,
          _.mode,
          T
        ), x.return = _, x;
      if (typeof x == "object" && x !== null) {
        switch (x.$$typeof) {
          case B:
            return T = bu(
              x.type,
              x.key,
              x.props,
              null,
              _.mode,
              T
            ), yn(T, x), T.return = _, T;
          case L:
            return x = pc(
              x,
              _.mode,
              T
            ), x.return = _, x;
          case Ce:
            return x = ta(x), U(_, x, T);
        }
        if (Le(x) || Ie(x))
          return x = Wl(
            x,
            _.mode,
            T,
            null
          ), x.return = _, x;
        if (typeof x.then == "function")
          return U(_, zu(x), T);
        if (x.$$typeof === X)
          return U(
            _,
            _u(_, x),
            T
          );
        Nu(_, x);
      }
      return null;
    }
    function A(_, x, T, D) {
      var J = x !== null ? x.key : null;
      if (typeof T == "string" && T !== "" || typeof T == "number" || typeof T == "bigint")
        return J !== null ? null : d(_, x, "" + T, D);
      if (typeof T == "object" && T !== null) {
        switch (T.$$typeof) {
          case B:
            return T.key === J ? g(_, x, T, D) : null;
          case L:
            return T.key === J ? z(_, x, T, D) : null;
          case Ce:
            return T = ta(T), A(_, x, T, D);
        }
        if (Le(T) || Ie(T))
          return J !== null ? null : C(_, x, T, D, null);
        if (typeof T.then == "function")
          return A(
            _,
            x,
            zu(T),
            D
          );
        if (T.$$typeof === X)
          return A(
            _,
            x,
            _u(_, T),
            D
          );
        Nu(_, T);
      }
      return null;
    }
    function O(_, x, T, D, J) {
      if (typeof D == "string" && D !== "" || typeof D == "number" || typeof D == "bigint")
        return _ = _.get(T) || null, d(x, _, "" + D, J);
      if (typeof D == "object" && D !== null) {
        switch (D.$$typeof) {
          case B:
            return _ = _.get(
              D.key === null ? T : D.key
            ) || null, g(x, _, D, J);
          case L:
            return _ = _.get(
              D.key === null ? T : D.key
            ) || null, z(x, _, D, J);
          case Ce:
            return D = ta(D), O(
              _,
              x,
              T,
              D,
              J
            );
        }
        if (Le(D) || Ie(D))
          return _ = _.get(T) || null, C(x, _, D, J, null);
        if (typeof D.then == "function")
          return O(
            _,
            x,
            T,
            zu(D),
            J
          );
        if (D.$$typeof === X)
          return O(
            _,
            x,
            T,
            _u(x, D),
            J
          );
        Nu(x, D);
      }
      return null;
    }
    function Q(_, x, T, D) {
      for (var J = null, de = null, K = x, te = x = 0, ce = null; K !== null && te < T.length; te++) {
        K.index > te ? (ce = K, K = null) : ce = K.sibling;
        var he = A(
          _,
          K,
          T[te],
          D
        );
        if (he === null) {
          K === null && (K = ce);
          break;
        }
        e && K && he.alternate === null && t(_, K), x = u(he, x, te), de === null ? J = he : de.sibling = he, de = he, K = ce;
      }
      if (te === T.length)
        return l(_, K), se && ll(_, te), J;
      if (K === null) {
        for (; te < T.length; te++)
          K = U(_, T[te], D), K !== null && (x = u(
            K,
            x,
            te
          ), de === null ? J = K : de.sibling = K, de = K);
        return se && ll(_, te), J;
      }
      for (K = a(K); te < T.length; te++)
        ce = O(
          K,
          _,
          te,
          T[te],
          D
        ), ce !== null && (e && ce.alternate !== null && K.delete(
          ce.key === null ? te : ce.key
        ), x = u(
          ce,
          x,
          te
        ), de === null ? J = ce : de.sibling = ce, de = ce);
      return e && K.forEach(function(Xl) {
        return t(_, Xl);
      }), se && ll(_, te), J;
    }
    function $(_, x, T, D) {
      if (T == null) throw Error(s(151));
      for (var J = null, de = null, K = x, te = x = 0, ce = null, he = T.next(); K !== null && !he.done; te++, he = T.next()) {
        K.index > te ? (ce = K, K = null) : ce = K.sibling;
        var Xl = A(_, K, he.value, D);
        if (Xl === null) {
          K === null && (K = ce);
          break;
        }
        e && K && Xl.alternate === null && t(_, K), x = u(Xl, x, te), de === null ? J = Xl : de.sibling = Xl, de = Xl, K = ce;
      }
      if (he.done)
        return l(_, K), se && ll(_, te), J;
      if (K === null) {
        for (; !he.done; te++, he = T.next())
          he = U(_, he.value, D), he !== null && (x = u(he, x, te), de === null ? J = he : de.sibling = he, de = he);
        return se && ll(_, te), J;
      }
      for (K = a(K); !he.done; te++, he = T.next())
        he = O(K, _, te, he.value, D), he !== null && (e && he.alternate !== null && K.delete(he.key === null ? te : he.key), x = u(he, x, te), de === null ? J = he : de.sibling = he, de = he);
      return e && K.forEach(function(Hv) {
        return t(_, Hv);
      }), se && ll(_, te), J;
    }
    function Se(_, x, T, D) {
      if (typeof T == "object" && T !== null && T.type === q && T.key === null && (T = T.props.children), typeof T == "object" && T !== null) {
        switch (T.$$typeof) {
          case B:
            e: {
              for (var J = T.key; x !== null; ) {
                if (x.key === J) {
                  if (J = T.type, J === q) {
                    if (x.tag === 7) {
                      l(
                        _,
                        x.sibling
                      ), D = n(
                        x,
                        T.props.children
                      ), D.return = _, _ = D;
                      break e;
                    }
                  } else if (x.elementType === J || typeof J == "object" && J !== null && J.$$typeof === Ce && ta(J) === x.type) {
                    l(
                      _,
                      x.sibling
                    ), D = n(x, T.props), yn(D, T), D.return = _, _ = D;
                    break e;
                  }
                  l(_, x);
                  break;
                } else t(_, x);
                x = x.sibling;
              }
              T.type === q ? (D = Wl(
                T.props.children,
                _.mode,
                D,
                T.key
              ), D.return = _, _ = D) : (D = bu(
                T.type,
                T.key,
                T.props,
                null,
                _.mode,
                D
              ), yn(D, T), D.return = _, _ = D);
            }
            return c(_);
          case L:
            e: {
              for (J = T.key; x !== null; ) {
                if (x.key === J)
                  if (x.tag === 4 && x.stateNode.containerInfo === T.containerInfo && x.stateNode.implementation === T.implementation) {
                    l(
                      _,
                      x.sibling
                    ), D = n(x, T.children || []), D.return = _, _ = D;
                    break e;
                  } else {
                    l(_, x);
                    break;
                  }
                else t(_, x);
                x = x.sibling;
              }
              D = pc(T, _.mode, D), D.return = _, _ = D;
            }
            return c(_);
          case Ce:
            return T = ta(T), Se(
              _,
              x,
              T,
              D
            );
        }
        if (Le(T))
          return Q(
            _,
            x,
            T,
            D
          );
        if (Ie(T)) {
          if (J = Ie(T), typeof J != "function") throw Error(s(150));
          return T = J.call(T), $(
            _,
            x,
            T,
            D
          );
        }
        if (typeof T.then == "function")
          return Se(
            _,
            x,
            zu(T),
            D
          );
        if (T.$$typeof === X)
          return Se(
            _,
            x,
            _u(_, T),
            D
          );
        Nu(_, T);
      }
      return typeof T == "string" && T !== "" || typeof T == "number" || typeof T == "bigint" ? (T = "" + T, x !== null && x.tag === 6 ? (l(_, x.sibling), D = n(x, T), D.return = _, _ = D) : (l(_, x), D = mc(T, _.mode, D), D.return = _, _ = D), c(_)) : l(_, x);
    }
    return function(_, x, T, D) {
      try {
        vn = 0;
        var J = Se(
          _,
          x,
          T,
          D
        );
        return Ca = null, J;
      } catch (K) {
        if (K === Oa || K === ju) throw K;
        var de = vt(29, K, null, _.mode);
        return de.lanes = D, de.return = _, de;
      } finally {
      }
    };
  }
  var aa = wo(!0), Bo = wo(!1), Tl = !1;
  function Nc(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Ac(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function zl(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function Nl(e, t, l) {
    var a = e.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (me & 2) !== 0) {
      var n = a.pending;
      return n === null ? t.next = t : (t.next = n.next, n.next = t), a.pending = t, t = gu(e), xo(e, null, l), t;
    }
    return yu(e, a, t, l), gu(e);
  }
  function gn(e, t, l) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (l & 4194048) !== 0)) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, Nr(e, l);
    }
  }
  function Rc(e, t) {
    var l = e.updateQueue, a = e.alternate;
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
        u === null ? n = u = t : u = u.next = t;
      } else n = u = t;
      l = {
        baseState: a.baseState,
        firstBaseUpdate: n,
        lastBaseUpdate: u,
        shared: a.shared,
        callbacks: a.callbacks
      }, e.updateQueue = l;
      return;
    }
    e = l.lastBaseUpdate, e === null ? l.firstBaseUpdate = t : e.next = t, l.lastBaseUpdate = t;
  }
  var Oc = !1;
  function bn() {
    if (Oc) {
      var e = Ra;
      if (e !== null) throw e;
    }
  }
  function xn(e, t, l, a) {
    Oc = !1;
    var n = e.updateQueue;
    Tl = !1;
    var u = n.firstBaseUpdate, c = n.lastBaseUpdate, d = n.shared.pending;
    if (d !== null) {
      n.shared.pending = null;
      var g = d, z = g.next;
      g.next = null, c === null ? u = z : c.next = z, c = g;
      var C = e.alternate;
      C !== null && (C = C.updateQueue, d = C.lastBaseUpdate, d !== c && (d === null ? C.firstBaseUpdate = z : d.next = z, C.lastBaseUpdate = g));
    }
    if (u !== null) {
      var U = n.baseState;
      c = 0, C = z = g = null, d = u;
      do {
        var A = d.lane & -536870913, O = A !== d.lane;
        if (O ? (ie & A) === A : (a & A) === A) {
          A !== 0 && A === Aa && (Oc = !0), C !== null && (C = C.next = {
            lane: 0,
            tag: d.tag,
            payload: d.payload,
            callback: null,
            next: null
          });
          e: {
            var Q = e, $ = d;
            A = t;
            var Se = l;
            switch ($.tag) {
              case 1:
                if (Q = $.payload, typeof Q == "function") {
                  U = Q.call(Se, U, A);
                  break e;
                }
                U = Q;
                break e;
              case 3:
                Q.flags = Q.flags & -65537 | 128;
              case 0:
                if (Q = $.payload, A = typeof Q == "function" ? Q.call(Se, U, A) : Q, A == null) break e;
                U = E({}, U, A);
                break e;
              case 2:
                Tl = !0;
            }
          }
          A = d.callback, A !== null && (e.flags |= 64, O && (e.flags |= 8192), O = n.callbacks, O === null ? n.callbacks = [A] : O.push(A));
        } else
          O = {
            lane: A,
            tag: d.tag,
            payload: d.payload,
            callback: d.callback,
            next: null
          }, C === null ? (z = C = O, g = U) : C = C.next = O, c |= A;
        if (d = d.next, d === null) {
          if (d = n.shared.pending, d === null)
            break;
          O = d, d = O.next, O.next = null, n.lastBaseUpdate = O, n.shared.pending = null;
        }
      } while (!0);
      C === null && (g = U), n.baseState = g, n.firstBaseUpdate = z, n.lastBaseUpdate = C, u === null && (n.shared.lanes = 0), Ml |= c, e.lanes = c, e.memoizedState = U;
    }
  }
  function Lo(e, t) {
    if (typeof e != "function")
      throw Error(s(191, e));
    e.call(t);
  }
  function qo(e, t) {
    var l = e.callbacks;
    if (l !== null)
      for (e.callbacks = null, e = 0; e < l.length; e++)
        Lo(l[e], t);
  }
  var Ma = S(null), Au = S(0);
  function Yo(e, t) {
    e = hl, G(Au, e), G(Ma, t), hl = e | t.baseLanes;
  }
  function Cc() {
    G(Au, hl), G(Ma, Ma.current);
  }
  function Mc() {
    hl = Au.current, H(Ma), H(Au);
  }
  var yt = S(null), Dt = null;
  function Al(e) {
    var t = e.alternate;
    G(we, we.current & 1), G(yt, e), Dt === null && (t === null || Ma.current !== null || t.memoizedState !== null) && (Dt = e);
  }
  function Dc(e) {
    G(we, we.current), G(yt, e), Dt === null && (Dt = e);
  }
  function Go(e) {
    e.tag === 22 ? (G(we, we.current), G(yt, e), Dt === null && (Dt = e)) : Rl();
  }
  function Rl() {
    G(we, we.current), G(yt, yt.current);
  }
  function gt(e) {
    H(yt), Dt === e && (Dt = null), H(we);
  }
  var we = S(0);
  function Ru(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var l = t.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || qs(l) || Ys(l)))
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
  var ul = 0, ee = null, be = null, Ye = null, Ou = !1, Da = !1, na = !1, Cu = 0, Sn = 0, Ua = null, Tp = 0;
  function Me() {
    throw Error(s(321));
  }
  function Uc(e, t) {
    if (t === null) return !1;
    for (var l = 0; l < t.length && l < e.length; l++)
      if (!pt(e[l], t[l])) return !1;
    return !0;
  }
  function Hc(e, t, l, a, n, u) {
    return ul = u, ee = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, M.H = e === null || e.memoizedState === null ? Tf : Wc, na = !1, u = l(a, n), na = !1, Da && (u = Qo(
      t,
      l,
      a,
      n
    )), Xo(e), u;
  }
  function Xo(e) {
    M.H = jn;
    var t = be !== null && be.next !== null;
    if (ul = 0, Ye = be = ee = null, Ou = !1, Sn = 0, Ua = null, t) throw Error(s(300));
    e === null || Ge || (e = e.dependencies, e !== null && Su(e) && (Ge = !0));
  }
  function Qo(e, t, l, a) {
    ee = e;
    var n = 0;
    do {
      if (Da && (Ua = null), Sn = 0, Da = !1, 25 <= n) throw Error(s(301));
      if (n += 1, Ye = be = null, e.updateQueue != null) {
        var u = e.updateQueue;
        u.lastEffect = null, u.events = null, u.stores = null, u.memoCache != null && (u.memoCache.index = 0);
      }
      M.H = zf, u = t(l, a);
    } while (Da);
    return u;
  }
  function zp() {
    var e = M.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? _n(t) : t, e = e.useState()[0], (be !== null ? be.memoizedState : null) !== e && (ee.flags |= 1024), t;
  }
  function wc() {
    var e = Cu !== 0;
    return Cu = 0, e;
  }
  function Bc(e, t, l) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l;
  }
  function Lc(e) {
    if (Ou) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      Ou = !1;
    }
    ul = 0, Ye = be = ee = null, Da = !1, Sn = Cu = 0, Ua = null;
  }
  function at() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Ye === null ? ee.memoizedState = Ye = e : Ye = Ye.next = e, Ye;
  }
  function Be() {
    if (be === null) {
      var e = ee.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = be.next;
    var t = Ye === null ? ee.memoizedState : Ye.next;
    if (t !== null)
      Ye = t, be = e;
    else {
      if (e === null)
        throw ee.alternate === null ? Error(s(467)) : Error(s(310));
      be = e, e = {
        memoizedState: be.memoizedState,
        baseState: be.baseState,
        baseQueue: be.baseQueue,
        queue: be.queue,
        next: null
      }, Ye === null ? ee.memoizedState = Ye = e : Ye = Ye.next = e;
    }
    return Ye;
  }
  function Mu() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function _n(e) {
    var t = Sn;
    return Sn += 1, Ua === null && (Ua = []), e = Do(Ua, e, t), t = ee, (Ye === null ? t.memoizedState : Ye.next) === null && (t = t.alternate, M.H = t === null || t.memoizedState === null ? Tf : Wc), e;
  }
  function Du(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return _n(e);
      if (e.$$typeof === X) return ke(e);
    }
    throw Error(s(438, String(e)));
  }
  function qc(e) {
    var t = null, l = ee.updateQueue;
    if (l !== null && (t = l.memoCache), t == null) {
      var a = ee.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (t = {
        data: a.data.map(function(n) {
          return n.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), l === null && (l = Mu(), ee.updateQueue = l), l.memoCache = t, l = t.data[t.index], l === void 0)
      for (l = t.data[t.index] = Array(e), a = 0; a < e; a++)
        l[a] = Vt;
    return t.index++, l;
  }
  function il(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function Uu(e) {
    var t = Be();
    return Yc(t, be, e);
  }
  function Yc(e, t, l) {
    var a = e.queue;
    if (a === null) throw Error(s(311));
    a.lastRenderedReducer = l;
    var n = e.baseQueue, u = a.pending;
    if (u !== null) {
      if (n !== null) {
        var c = n.next;
        n.next = u.next, u.next = c;
      }
      t.baseQueue = n = u, a.pending = null;
    }
    if (u = e.baseState, n === null) e.memoizedState = u;
    else {
      t = n.next;
      var d = c = null, g = null, z = t, C = !1;
      do {
        var U = z.lane & -536870913;
        if (U !== z.lane ? (ie & U) === U : (ul & U) === U) {
          var A = z.revertLane;
          if (A === 0)
            g !== null && (g = g.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: z.action,
              hasEagerState: z.hasEagerState,
              eagerState: z.eagerState,
              next: null
            }), U === Aa && (C = !0);
          else if ((ul & A) === A) {
            z = z.next, A === Aa && (C = !0);
            continue;
          } else
            U = {
              lane: 0,
              revertLane: z.revertLane,
              gesture: null,
              action: z.action,
              hasEagerState: z.hasEagerState,
              eagerState: z.eagerState,
              next: null
            }, g === null ? (d = g = U, c = u) : g = g.next = U, ee.lanes |= A, Ml |= A;
          U = z.action, na && l(u, U), u = z.hasEagerState ? z.eagerState : l(u, U);
        } else
          A = {
            lane: U,
            revertLane: z.revertLane,
            gesture: z.gesture,
            action: z.action,
            hasEagerState: z.hasEagerState,
            eagerState: z.eagerState,
            next: null
          }, g === null ? (d = g = A, c = u) : g = g.next = A, ee.lanes |= U, Ml |= U;
        z = z.next;
      } while (z !== null && z !== t);
      if (g === null ? c = u : g.next = d, !pt(u, e.memoizedState) && (Ge = !0, C && (l = Ra, l !== null)))
        throw l;
      e.memoizedState = u, e.baseState = c, e.baseQueue = g, a.lastRenderedState = u;
    }
    return n === null && (a.lanes = 0), [e.memoizedState, a.dispatch];
  }
  function Gc(e) {
    var t = Be(), l = t.queue;
    if (l === null) throw Error(s(311));
    l.lastRenderedReducer = e;
    var a = l.dispatch, n = l.pending, u = t.memoizedState;
    if (n !== null) {
      l.pending = null;
      var c = n = n.next;
      do
        u = e(u, c.action), c = c.next;
      while (c !== n);
      pt(u, t.memoizedState) || (Ge = !0), t.memoizedState = u, t.baseQueue === null && (t.baseState = u), l.lastRenderedState = u;
    }
    return [u, a];
  }
  function Zo(e, t, l) {
    var a = ee, n = Be(), u = se;
    if (u) {
      if (l === void 0) throw Error(s(407));
      l = l();
    } else l = t();
    var c = !pt(
      (be || n).memoizedState,
      l
    );
    if (c && (n.memoizedState = l, Ge = !0), n = n.queue, Zc(Jo.bind(null, a, n, e), [
      e
    ]), n.getSnapshot !== t || c || Ye !== null && Ye.memoizedState.tag & 1) {
      if (a.flags |= 2048, Ha(
        9,
        { destroy: void 0 },
        Ko.bind(
          null,
          a,
          n,
          l,
          t
        ),
        null
      ), Ee === null) throw Error(s(349));
      u || (ul & 127) !== 0 || Vo(a, t, l);
    }
    return l;
  }
  function Vo(e, t, l) {
    e.flags |= 16384, e = { getSnapshot: t, value: l }, t = ee.updateQueue, t === null ? (t = Mu(), ee.updateQueue = t, t.stores = [e]) : (l = t.stores, l === null ? t.stores = [e] : l.push(e));
  }
  function Ko(e, t, l, a) {
    t.value = l, t.getSnapshot = a, ko(t) && $o(e);
  }
  function Jo(e, t, l) {
    return l(function() {
      ko(t) && $o(e);
    });
  }
  function ko(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var l = t();
      return !pt(e, l);
    } catch {
      return !0;
    }
  }
  function $o(e) {
    var t = $l(e, 2);
    t !== null && ot(t, e, 2);
  }
  function Xc(e) {
    var t = at();
    if (typeof e == "function") {
      var l = e;
      if (e = l(), na) {
        gl(!0);
        try {
          l();
        } finally {
          gl(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = e, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: il,
      lastRenderedState: e
    }, t;
  }
  function Wo(e, t, l, a) {
    return e.baseState = l, Yc(
      e,
      be,
      typeof a == "function" ? a : il
    );
  }
  function Np(e, t, l, a, n) {
    if (Bu(e)) throw Error(s(485));
    if (e = t.action, e !== null) {
      var u = {
        payload: n,
        action: e,
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
      M.T !== null ? l(!0) : u.isTransition = !1, a(u), l = t.pending, l === null ? (u.next = t.pending = u, Fo(t, u)) : (u.next = l.next, t.pending = l.next = u);
    }
  }
  function Fo(e, t) {
    var l = t.action, a = t.payload, n = e.state;
    if (t.isTransition) {
      var u = M.T, c = {};
      M.T = c;
      try {
        var d = l(n, a), g = M.S;
        g !== null && g(c, d), Po(e, t, d);
      } catch (z) {
        Qc(e, t, z);
      } finally {
        u !== null && c.types !== null && (u.types = c.types), M.T = u;
      }
    } else
      try {
        u = l(n, a), Po(e, t, u);
      } catch (z) {
        Qc(e, t, z);
      }
  }
  function Po(e, t, l) {
    l !== null && typeof l == "object" && typeof l.then == "function" ? l.then(
      function(a) {
        Io(e, t, a);
      },
      function(a) {
        return Qc(e, t, a);
      }
    ) : Io(e, t, l);
  }
  function Io(e, t, l) {
    t.status = "fulfilled", t.value = l, ef(t), e.state = l, t = e.pending, t !== null && (l = t.next, l === t ? e.pending = null : (l = l.next, t.next = l, Fo(e, l)));
  }
  function Qc(e, t, l) {
    var a = e.pending;
    if (e.pending = null, a !== null) {
      a = a.next;
      do
        t.status = "rejected", t.reason = l, ef(t), t = t.next;
      while (t !== a);
    }
    e.action = null;
  }
  function ef(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function tf(e, t) {
    return t;
  }
  function lf(e, t) {
    if (se) {
      var l = Ee.formState;
      if (l !== null) {
        e: {
          var a = ee;
          if (se) {
            if (ze) {
              t: {
                for (var n = ze, u = Mt; n.nodeType !== 8; ) {
                  if (!u) {
                    n = null;
                    break t;
                  }
                  if (n = Ut(
                    n.nextSibling
                  ), n === null) {
                    n = null;
                    break t;
                  }
                }
                u = n.data, n = u === "F!" || u === "F" ? n : null;
              }
              if (n) {
                ze = Ut(
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
    return l = at(), l.memoizedState = l.baseState = t, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: tf,
      lastRenderedState: t
    }, l.queue = a, l = _f.bind(
      null,
      ee,
      a
    ), a.dispatch = l, a = Xc(!1), u = $c.bind(
      null,
      ee,
      !1,
      a.queue
    ), a = at(), n = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, a.queue = n, l = Np.bind(
      null,
      ee,
      n,
      u,
      l
    ), n.dispatch = l, a.memoizedState = e, [t, l, !1];
  }
  function af(e) {
    var t = Be();
    return nf(t, be, e);
  }
  function nf(e, t, l) {
    if (t = Yc(
      e,
      t,
      tf
    )[0], e = Uu(il)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var a = _n(t);
      } catch (c) {
        throw c === Oa ? ju : c;
      }
    else a = t;
    t = Be();
    var n = t.queue, u = n.dispatch;
    return l !== t.memoizedState && (ee.flags |= 2048, Ha(
      9,
      { destroy: void 0 },
      Ap.bind(null, n, l),
      null
    )), [a, u, e];
  }
  function Ap(e, t) {
    e.action = t;
  }
  function uf(e) {
    var t = Be(), l = be;
    if (l !== null)
      return nf(t, l, e);
    Be(), t = t.memoizedState, l = Be();
    var a = l.queue.dispatch;
    return l.memoizedState = e, [t, a, !1];
  }
  function Ha(e, t, l, a) {
    return e = { tag: e, create: l, deps: a, inst: t, next: null }, t = ee.updateQueue, t === null && (t = Mu(), ee.updateQueue = t), l = t.lastEffect, l === null ? t.lastEffect = e.next = e : (a = l.next, l.next = e, e.next = a, t.lastEffect = e), e;
  }
  function cf() {
    return Be().memoizedState;
  }
  function Hu(e, t, l, a) {
    var n = at();
    ee.flags |= e, n.memoizedState = Ha(
      1 | t,
      { destroy: void 0 },
      l,
      a === void 0 ? null : a
    );
  }
  function wu(e, t, l, a) {
    var n = Be();
    a = a === void 0 ? null : a;
    var u = n.memoizedState.inst;
    be !== null && a !== null && Uc(a, be.memoizedState.deps) ? n.memoizedState = Ha(t, u, l, a) : (ee.flags |= e, n.memoizedState = Ha(
      1 | t,
      u,
      l,
      a
    ));
  }
  function sf(e, t) {
    Hu(8390656, 8, e, t);
  }
  function Zc(e, t) {
    wu(2048, 8, e, t);
  }
  function Rp(e) {
    ee.flags |= 4;
    var t = ee.updateQueue;
    if (t === null)
      t = Mu(), ee.updateQueue = t, t.events = [e];
    else {
      var l = t.events;
      l === null ? t.events = [e] : l.push(e);
    }
  }
  function rf(e) {
    var t = Be().memoizedState;
    return Rp({ ref: t, nextImpl: e }), function() {
      if ((me & 2) !== 0) throw Error(s(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function of(e, t) {
    return wu(4, 2, e, t);
  }
  function ff(e, t) {
    return wu(4, 4, e, t);
  }
  function df(e, t) {
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
  function hf(e, t, l) {
    l = l != null ? l.concat([e]) : null, wu(4, 4, df.bind(null, t, e), l);
  }
  function Vc() {
  }
  function mf(e, t) {
    var l = Be();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    return t !== null && Uc(t, a[1]) ? a[0] : (l.memoizedState = [e, t], e);
  }
  function pf(e, t) {
    var l = Be();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    if (t !== null && Uc(t, a[1]))
      return a[0];
    if (a = e(), na) {
      gl(!0);
      try {
        e();
      } finally {
        gl(!1);
      }
    }
    return l.memoizedState = [a, t], a;
  }
  function Kc(e, t, l) {
    return l === void 0 || (ul & 1073741824) !== 0 && (ie & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = l, e = vd(), ee.lanes |= e, Ml |= e, l);
  }
  function vf(e, t, l, a) {
    return pt(l, t) ? l : Ma.current !== null ? (e = Kc(e, l, a), pt(e, t) || (Ge = !0), e) : (ul & 42) === 0 || (ul & 1073741824) !== 0 && (ie & 261930) === 0 ? (Ge = !0, e.memoizedState = l) : (e = vd(), ee.lanes |= e, Ml |= e, t);
  }
  function yf(e, t, l, a, n) {
    var u = Y.p;
    Y.p = u !== 0 && 8 > u ? u : 8;
    var c = M.T, d = {};
    M.T = d, $c(e, !1, t, l);
    try {
      var g = n(), z = M.S;
      if (z !== null && z(d, g), g !== null && typeof g == "object" && typeof g.then == "function") {
        var C = jp(
          g,
          a
        );
        En(
          e,
          t,
          C,
          St(e)
        );
      } else
        En(
          e,
          t,
          a,
          St(e)
        );
    } catch (U) {
      En(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: U },
        St()
      );
    } finally {
      Y.p = u, c !== null && d.types !== null && (c.types = d.types), M.T = c;
    }
  }
  function Op() {
  }
  function Jc(e, t, l, a) {
    if (e.tag !== 5) throw Error(s(476));
    var n = gf(e).queue;
    yf(
      e,
      n,
      t,
      F,
      l === null ? Op : function() {
        return bf(e), l(a);
      }
    );
  }
  function gf(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: F,
      baseState: F,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: il,
        lastRenderedState: F
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
        lastRenderedReducer: il,
        lastRenderedState: l
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function bf(e) {
    var t = gf(e);
    t.next === null && (t = e.alternate.memoizedState), En(
      e,
      t.next.queue,
      {},
      St()
    );
  }
  function kc() {
    return ke(Yn);
  }
  function xf() {
    return Be().memoizedState;
  }
  function Sf() {
    return Be().memoizedState;
  }
  function Cp(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var l = St();
          e = zl(l);
          var a = Nl(t, e, l);
          a !== null && (ot(a, t, l), gn(a, t, l)), t = { cache: Ec() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function Mp(e, t, l) {
    var a = St();
    l = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Bu(e) ? Ef(t, l) : (l = dc(e, t, l, a), l !== null && (ot(l, e, a), jf(l, t, a)));
  }
  function _f(e, t, l) {
    var a = St();
    En(e, t, l, a);
  }
  function En(e, t, l, a) {
    var n = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (Bu(e)) Ef(t, n);
    else {
      var u = e.alternate;
      if (e.lanes === 0 && (u === null || u.lanes === 0) && (u = t.lastRenderedReducer, u !== null))
        try {
          var c = t.lastRenderedState, d = u(c, l);
          if (n.hasEagerState = !0, n.eagerState = d, pt(d, c))
            return yu(e, t, n, 0), Ee === null && vu(), !1;
        } catch {
        } finally {
        }
      if (l = dc(e, t, n, a), l !== null)
        return ot(l, e, a), jf(l, t, a), !0;
    }
    return !1;
  }
  function $c(e, t, l, a) {
    if (a = {
      lane: 2,
      revertLane: Ns(),
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Bu(e)) {
      if (t) throw Error(s(479));
    } else
      t = dc(
        e,
        l,
        a,
        2
      ), t !== null && ot(t, e, 2);
  }
  function Bu(e) {
    var t = e.alternate;
    return e === ee || t !== null && t === ee;
  }
  function Ef(e, t) {
    Da = Ou = !0;
    var l = e.pending;
    l === null ? t.next = t : (t.next = l.next, l.next = t), e.pending = t;
  }
  function jf(e, t, l) {
    if ((l & 4194048) !== 0) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, Nr(e, l);
    }
  }
  var jn = {
    readContext: ke,
    use: Du,
    useCallback: Me,
    useContext: Me,
    useEffect: Me,
    useImperativeHandle: Me,
    useLayoutEffect: Me,
    useInsertionEffect: Me,
    useMemo: Me,
    useReducer: Me,
    useRef: Me,
    useState: Me,
    useDebugValue: Me,
    useDeferredValue: Me,
    useTransition: Me,
    useSyncExternalStore: Me,
    useId: Me,
    useHostTransitionStatus: Me,
    useFormState: Me,
    useActionState: Me,
    useOptimistic: Me,
    useMemoCache: Me,
    useCacheRefresh: Me
  };
  jn.useEffectEvent = Me;
  var Tf = {
    readContext: ke,
    use: Du,
    useCallback: function(e, t) {
      return at().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: ke,
    useEffect: sf,
    useImperativeHandle: function(e, t, l) {
      l = l != null ? l.concat([e]) : null, Hu(
        4194308,
        4,
        df.bind(null, t, e),
        l
      );
    },
    useLayoutEffect: function(e, t) {
      return Hu(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      Hu(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var l = at();
      t = t === void 0 ? null : t;
      var a = e();
      if (na) {
        gl(!0);
        try {
          e();
        } finally {
          gl(!1);
        }
      }
      return l.memoizedState = [a, t], a;
    },
    useReducer: function(e, t, l) {
      var a = at();
      if (l !== void 0) {
        var n = l(t);
        if (na) {
          gl(!0);
          try {
            l(t);
          } finally {
            gl(!1);
          }
        }
      } else n = t;
      return a.memoizedState = a.baseState = n, e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: n
      }, a.queue = e, e = e.dispatch = Mp.bind(
        null,
        ee,
        e
      ), [a.memoizedState, e];
    },
    useRef: function(e) {
      var t = at();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = Xc(e);
      var t = e.queue, l = _f.bind(null, ee, t);
      return t.dispatch = l, [e.memoizedState, l];
    },
    useDebugValue: Vc,
    useDeferredValue: function(e, t) {
      var l = at();
      return Kc(l, e, t);
    },
    useTransition: function() {
      var e = Xc(!1);
      return e = yf.bind(
        null,
        ee,
        e.queue,
        !0,
        !1
      ), at().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, l) {
      var a = ee, n = at();
      if (se) {
        if (l === void 0)
          throw Error(s(407));
        l = l();
      } else {
        if (l = t(), Ee === null)
          throw Error(s(349));
        (ie & 127) !== 0 || Vo(a, t, l);
      }
      n.memoizedState = l;
      var u = { value: l, getSnapshot: t };
      return n.queue = u, sf(Jo.bind(null, a, u, e), [
        e
      ]), a.flags |= 2048, Ha(
        9,
        { destroy: void 0 },
        Ko.bind(
          null,
          a,
          u,
          l,
          t
        ),
        null
      ), l;
    },
    useId: function() {
      var e = at(), t = Ee.identifierPrefix;
      if (se) {
        var l = kt, a = Jt;
        l = (a & ~(1 << 32 - mt(a) - 1)).toString(32) + l, t = "_" + t + "R_" + l, l = Cu++, 0 < l && (t += "H" + l.toString(32)), t += "_";
      } else
        l = Tp++, t = "_" + t + "r_" + l.toString(32) + "_";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: kc,
    useFormState: lf,
    useActionState: lf,
    useOptimistic: function(e) {
      var t = at();
      t.memoizedState = t.baseState = e;
      var l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = l, t = $c.bind(
        null,
        ee,
        !0,
        l
      ), l.dispatch = t, [e, t];
    },
    useMemoCache: qc,
    useCacheRefresh: function() {
      return at().memoizedState = Cp.bind(
        null,
        ee
      );
    },
    useEffectEvent: function(e) {
      var t = at(), l = { impl: e };
      return t.memoizedState = l, function() {
        if ((me & 2) !== 0)
          throw Error(s(440));
        return l.impl.apply(void 0, arguments);
      };
    }
  }, Wc = {
    readContext: ke,
    use: Du,
    useCallback: mf,
    useContext: ke,
    useEffect: Zc,
    useImperativeHandle: hf,
    useInsertionEffect: of,
    useLayoutEffect: ff,
    useMemo: pf,
    useReducer: Uu,
    useRef: cf,
    useState: function() {
      return Uu(il);
    },
    useDebugValue: Vc,
    useDeferredValue: function(e, t) {
      var l = Be();
      return vf(
        l,
        be.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = Uu(il)[0], t = Be().memoizedState;
      return [
        typeof e == "boolean" ? e : _n(e),
        t
      ];
    },
    useSyncExternalStore: Zo,
    useId: xf,
    useHostTransitionStatus: kc,
    useFormState: af,
    useActionState: af,
    useOptimistic: function(e, t) {
      var l = Be();
      return Wo(l, be, e, t);
    },
    useMemoCache: qc,
    useCacheRefresh: Sf
  };
  Wc.useEffectEvent = rf;
  var zf = {
    readContext: ke,
    use: Du,
    useCallback: mf,
    useContext: ke,
    useEffect: Zc,
    useImperativeHandle: hf,
    useInsertionEffect: of,
    useLayoutEffect: ff,
    useMemo: pf,
    useReducer: Gc,
    useRef: cf,
    useState: function() {
      return Gc(il);
    },
    useDebugValue: Vc,
    useDeferredValue: function(e, t) {
      var l = Be();
      return be === null ? Kc(l, e, t) : vf(
        l,
        be.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = Gc(il)[0], t = Be().memoizedState;
      return [
        typeof e == "boolean" ? e : _n(e),
        t
      ];
    },
    useSyncExternalStore: Zo,
    useId: xf,
    useHostTransitionStatus: kc,
    useFormState: uf,
    useActionState: uf,
    useOptimistic: function(e, t) {
      var l = Be();
      return be !== null ? Wo(l, be, e, t) : (l.baseState = e, [e, l.queue.dispatch]);
    },
    useMemoCache: qc,
    useCacheRefresh: Sf
  };
  zf.useEffectEvent = rf;
  function Fc(e, t, l, a) {
    t = e.memoizedState, l = l(a, t), l = l == null ? t : E({}, t, l), e.memoizedState = l, e.lanes === 0 && (e.updateQueue.baseState = l);
  }
  var Pc = {
    enqueueSetState: function(e, t, l) {
      e = e._reactInternals;
      var a = St(), n = zl(a);
      n.payload = t, l != null && (n.callback = l), t = Nl(e, n, a), t !== null && (ot(t, e, a), gn(t, e, a));
    },
    enqueueReplaceState: function(e, t, l) {
      e = e._reactInternals;
      var a = St(), n = zl(a);
      n.tag = 1, n.payload = t, l != null && (n.callback = l), t = Nl(e, n, a), t !== null && (ot(t, e, a), gn(t, e, a));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var l = St(), a = zl(l);
      a.tag = 2, t != null && (a.callback = t), t = Nl(e, a, l), t !== null && (ot(t, e, l), gn(t, e, l));
    }
  };
  function Nf(e, t, l, a, n, u, c) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(a, u, c) : t.prototype && t.prototype.isPureReactComponent ? !on(l, a) || !on(n, u) : !0;
  }
  function Af(e, t, l, a) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(l, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(l, a), t.state !== e && Pc.enqueueReplaceState(t, t.state, null);
  }
  function ua(e, t) {
    var l = t;
    if ("ref" in t) {
      l = {};
      for (var a in t)
        a !== "ref" && (l[a] = t[a]);
    }
    if (e = e.defaultProps) {
      l === t && (l = E({}, l));
      for (var n in e)
        l[n] === void 0 && (l[n] = e[n]);
    }
    return l;
  }
  function Rf(e) {
    pu(e);
  }
  function Of(e) {
    console.error(e);
  }
  function Cf(e) {
    pu(e);
  }
  function Lu(e, t) {
    try {
      var l = e.onUncaughtError;
      l(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function Mf(e, t, l) {
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
  function Ic(e, t, l) {
    return l = zl(l), l.tag = 3, l.payload = { element: null }, l.callback = function() {
      Lu(e, t);
    }, l;
  }
  function Df(e) {
    return e = zl(e), e.tag = 3, e;
  }
  function Uf(e, t, l, a) {
    var n = l.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var u = a.value;
      e.payload = function() {
        return n(u);
      }, e.callback = function() {
        Mf(t, l, a);
      };
    }
    var c = l.stateNode;
    c !== null && typeof c.componentDidCatch == "function" && (e.callback = function() {
      Mf(t, l, a), typeof n != "function" && (Dl === null ? Dl = /* @__PURE__ */ new Set([this]) : Dl.add(this));
      var d = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: d !== null ? d : ""
      });
    });
  }
  function Dp(e, t, l, a, n) {
    if (l.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (t = l.alternate, t !== null && Na(
        t,
        l,
        n,
        !0
      ), l = yt.current, l !== null) {
        switch (l.tag) {
          case 31:
          case 13:
            return Dt === null ? Wu() : l.alternate === null && De === 0 && (De = 3), l.flags &= -257, l.flags |= 65536, l.lanes = n, a === Tu ? l.flags |= 16384 : (t = l.updateQueue, t === null ? l.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), js(e, a, n)), !1;
          case 22:
            return l.flags |= 65536, a === Tu ? l.flags |= 16384 : (t = l.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, l.updateQueue = t) : (l = t.retryQueue, l === null ? t.retryQueue = /* @__PURE__ */ new Set([a]) : l.add(a)), js(e, a, n)), !1;
        }
        throw Error(s(435, l.tag));
      }
      return js(e, a, n), Wu(), !1;
    }
    if (se)
      return t = yt.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = n, a !== gc && (e = Error(s(422), { cause: a }), hn(Rt(e, l)))) : (a !== gc && (t = Error(s(423), {
        cause: a
      }), hn(
        Rt(t, l)
      )), e = e.current.alternate, e.flags |= 65536, n &= -n, e.lanes |= n, a = Rt(a, l), n = Ic(
        e.stateNode,
        a,
        n
      ), Rc(e, n), De !== 4 && (De = 2)), !1;
    var u = Error(s(520), { cause: a });
    if (u = Rt(u, l), Mn === null ? Mn = [u] : Mn.push(u), De !== 4 && (De = 2), t === null) return !0;
    a = Rt(a, l), l = t;
    do {
      switch (l.tag) {
        case 3:
          return l.flags |= 65536, e = n & -n, l.lanes |= e, e = Ic(l.stateNode, a, e), Rc(l, e), !1;
        case 1:
          if (t = l.type, u = l.stateNode, (l.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || u !== null && typeof u.componentDidCatch == "function" && (Dl === null || !Dl.has(u))))
            return l.flags |= 65536, n &= -n, l.lanes |= n, n = Df(n), Uf(
              n,
              e,
              l,
              a
            ), Rc(l, n), !1;
      }
      l = l.return;
    } while (l !== null);
    return !1;
  }
  var es = Error(s(461)), Ge = !1;
  function $e(e, t, l, a) {
    t.child = e === null ? Bo(t, null, l, a) : aa(
      t,
      e.child,
      l,
      a
    );
  }
  function Hf(e, t, l, a, n) {
    l = l.render;
    var u = t.ref;
    if ("ref" in a) {
      var c = {};
      for (var d in a)
        d !== "ref" && (c[d] = a[d]);
    } else c = a;
    return Il(t), a = Hc(
      e,
      t,
      l,
      c,
      u,
      n
    ), d = wc(), e !== null && !Ge ? (Bc(e, t, n), cl(e, t, n)) : (se && d && vc(t), t.flags |= 1, $e(e, t, a, n), t.child);
  }
  function wf(e, t, l, a, n) {
    if (e === null) {
      var u = l.type;
      return typeof u == "function" && !hc(u) && u.defaultProps === void 0 && l.compare === null ? (t.tag = 15, t.type = u, Bf(
        e,
        t,
        u,
        a,
        n
      )) : (e = bu(
        l.type,
        null,
        a,
        t,
        t.mode,
        n
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (u = e.child, !ss(e, n)) {
      var c = u.memoizedProps;
      if (l = l.compare, l = l !== null ? l : on, l(c, a) && e.ref === t.ref)
        return cl(e, t, n);
    }
    return t.flags |= 1, e = tl(u, a), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Bf(e, t, l, a, n) {
    if (e !== null) {
      var u = e.memoizedProps;
      if (on(u, a) && e.ref === t.ref)
        if (Ge = !1, t.pendingProps = a = u, ss(e, n))
          (e.flags & 131072) !== 0 && (Ge = !0);
        else
          return t.lanes = e.lanes, cl(e, t, n);
    }
    return ts(
      e,
      t,
      l,
      a,
      n
    );
  }
  function Lf(e, t, l, a) {
    var n = a.children, u = e !== null ? e.memoizedState : null;
    if (e === null && t.stateNode === null && (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), a.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (u = u !== null ? u.baseLanes | l : l, e !== null) {
          for (a = t.child = e.child, n = 0; a !== null; )
            n = n | a.lanes | a.childLanes, a = a.sibling;
          a = n & ~u;
        } else a = 0, t.child = null;
        return qf(
          e,
          t,
          u,
          l,
          a
        );
      }
      if ((l & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && Eu(
          t,
          u !== null ? u.cachePool : null
        ), u !== null ? Yo(t, u) : Cc(), Go(t);
      else
        return a = t.lanes = 536870912, qf(
          e,
          t,
          u !== null ? u.baseLanes | l : l,
          l,
          a
        );
    } else
      u !== null ? (Eu(t, u.cachePool), Yo(t, u), Rl(), t.memoizedState = null) : (e !== null && Eu(t, null), Cc(), Rl());
    return $e(e, t, n, l), t.child;
  }
  function Tn(e, t) {
    return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function qf(e, t, l, a, n) {
    var u = Tc();
    return u = u === null ? null : { parent: qe._currentValue, pool: u }, t.memoizedState = {
      baseLanes: l,
      cachePool: u
    }, e !== null && Eu(t, null), Cc(), Go(t), e !== null && Na(e, t, a, !0), t.childLanes = n, null;
  }
  function qu(e, t) {
    return t = Gu(
      { mode: t.mode, children: t.children },
      e.mode
    ), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function Yf(e, t, l) {
    return aa(t, e.child, null, l), e = qu(t, t.pendingProps), e.flags |= 2, gt(t), t.memoizedState = null, e;
  }
  function Up(e, t, l) {
    var a = t.pendingProps, n = (t.flags & 128) !== 0;
    if (t.flags &= -129, e === null) {
      if (se) {
        if (a.mode === "hidden")
          return e = qu(t, a), t.lanes = 536870912, Tn(null, e);
        if (Dc(t), (e = ze) ? (e = Pd(
          e,
          Mt
        ), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: Sl !== null ? { id: Jt, overflow: kt } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, l = _o(e), l.return = t, t.child = l, Je = t, ze = null)) : e = null, e === null) throw El(t);
        return t.lanes = 536870912, null;
      }
      return qu(t, a);
    }
    var u = e.memoizedState;
    if (u !== null) {
      var c = u.dehydrated;
      if (Dc(t), n)
        if (t.flags & 256)
          t.flags &= -257, t = Yf(
            e,
            t,
            l
          );
        else if (t.memoizedState !== null)
          t.child = e.child, t.flags |= 128, t = null;
        else throw Error(s(558));
      else if (Ge || Na(e, t, l, !1), n = (l & e.childLanes) !== 0, Ge || n) {
        if (a = Ee, a !== null && (c = Ar(a, l), c !== 0 && c !== u.retryLane))
          throw u.retryLane = c, $l(e, c), ot(a, e, c), es;
        Wu(), t = Yf(
          e,
          t,
          l
        );
      } else
        e = u.treeContext, ze = Ut(c.nextSibling), Je = t, se = !0, _l = null, Mt = !1, e !== null && To(t, e), t = qu(t, a), t.flags |= 4096;
      return t;
    }
    return e = tl(e.child, {
      mode: a.mode,
      children: a.children
    }), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function Yu(e, t) {
    var l = t.ref;
    if (l === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof l != "function" && typeof l != "object")
        throw Error(s(284));
      (e === null || e.ref !== l) && (t.flags |= 4194816);
    }
  }
  function ts(e, t, l, a, n) {
    return Il(t), l = Hc(
      e,
      t,
      l,
      a,
      void 0,
      n
    ), a = wc(), e !== null && !Ge ? (Bc(e, t, n), cl(e, t, n)) : (se && a && vc(t), t.flags |= 1, $e(e, t, l, n), t.child);
  }
  function Gf(e, t, l, a, n, u) {
    return Il(t), t.updateQueue = null, l = Qo(
      t,
      a,
      l,
      n
    ), Xo(e), a = wc(), e !== null && !Ge ? (Bc(e, t, u), cl(e, t, u)) : (se && a && vc(t), t.flags |= 1, $e(e, t, l, u), t.child);
  }
  function Xf(e, t, l, a, n) {
    if (Il(t), t.stateNode === null) {
      var u = Ea, c = l.contextType;
      typeof c == "object" && c !== null && (u = ke(c)), u = new l(a, u), t.memoizedState = u.state !== null && u.state !== void 0 ? u.state : null, u.updater = Pc, t.stateNode = u, u._reactInternals = t, u = t.stateNode, u.props = a, u.state = t.memoizedState, u.refs = {}, Nc(t), c = l.contextType, u.context = typeof c == "object" && c !== null ? ke(c) : Ea, u.state = t.memoizedState, c = l.getDerivedStateFromProps, typeof c == "function" && (Fc(
        t,
        l,
        c,
        a
      ), u.state = t.memoizedState), typeof l.getDerivedStateFromProps == "function" || typeof u.getSnapshotBeforeUpdate == "function" || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (c = u.state, typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount(), c !== u.state && Pc.enqueueReplaceState(u, u.state, null), xn(t, a, u, n), bn(), u.state = t.memoizedState), typeof u.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (e === null) {
      u = t.stateNode;
      var d = t.memoizedProps, g = ua(l, d);
      u.props = g;
      var z = u.context, C = l.contextType;
      c = Ea, typeof C == "object" && C !== null && (c = ke(C));
      var U = l.getDerivedStateFromProps;
      C = typeof U == "function" || typeof u.getSnapshotBeforeUpdate == "function", d = t.pendingProps !== d, C || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (d || z !== c) && Af(
        t,
        u,
        a,
        c
      ), Tl = !1;
      var A = t.memoizedState;
      u.state = A, xn(t, a, u, n), bn(), z = t.memoizedState, d || A !== z || Tl ? (typeof U == "function" && (Fc(
        t,
        l,
        U,
        a
      ), z = t.memoizedState), (g = Tl || Nf(
        t,
        l,
        g,
        a,
        A,
        z,
        c
      )) ? (C || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = z), u.props = a, u.state = z, u.context = c, a = g) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      u = t.stateNode, Ac(e, t), c = t.memoizedProps, C = ua(l, c), u.props = C, U = t.pendingProps, A = u.context, z = l.contextType, g = Ea, typeof z == "object" && z !== null && (g = ke(z)), d = l.getDerivedStateFromProps, (z = typeof d == "function" || typeof u.getSnapshotBeforeUpdate == "function") || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (c !== U || A !== g) && Af(
        t,
        u,
        a,
        g
      ), Tl = !1, A = t.memoizedState, u.state = A, xn(t, a, u, n), bn();
      var O = t.memoizedState;
      c !== U || A !== O || Tl || e !== null && e.dependencies !== null && Su(e.dependencies) ? (typeof d == "function" && (Fc(
        t,
        l,
        d,
        a
      ), O = t.memoizedState), (C = Tl || Nf(
        t,
        l,
        C,
        a,
        A,
        O,
        g
      ) || e !== null && e.dependencies !== null && Su(e.dependencies)) ? (z || typeof u.UNSAFE_componentWillUpdate != "function" && typeof u.componentWillUpdate != "function" || (typeof u.componentWillUpdate == "function" && u.componentWillUpdate(a, O, g), typeof u.UNSAFE_componentWillUpdate == "function" && u.UNSAFE_componentWillUpdate(
        a,
        O,
        g
      )), typeof u.componentDidUpdate == "function" && (t.flags |= 4), typeof u.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof u.componentDidUpdate != "function" || c === e.memoizedProps && A === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || c === e.memoizedProps && A === e.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = O), u.props = a, u.state = O, u.context = g, a = C) : (typeof u.componentDidUpdate != "function" || c === e.memoizedProps && A === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || c === e.memoizedProps && A === e.memoizedState || (t.flags |= 1024), a = !1);
    }
    return u = a, Yu(e, t), a = (t.flags & 128) !== 0, u || a ? (u = t.stateNode, l = a && typeof l.getDerivedStateFromError != "function" ? null : u.render(), t.flags |= 1, e !== null && a ? (t.child = aa(
      t,
      e.child,
      null,
      n
    ), t.child = aa(
      t,
      null,
      l,
      n
    )) : $e(e, t, l, n), t.memoizedState = u.state, e = t.child) : e = cl(
      e,
      t,
      n
    ), e;
  }
  function Qf(e, t, l, a) {
    return Fl(), t.flags |= 256, $e(e, t, l, a), t.child;
  }
  var ls = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function as(e) {
    return { baseLanes: e, cachePool: Co() };
  }
  function ns(e, t, l) {
    return e = e !== null ? e.childLanes & ~l : 0, t && (e |= xt), e;
  }
  function Zf(e, t, l) {
    var a = t.pendingProps, n = !1, u = (t.flags & 128) !== 0, c;
    if ((c = u) || (c = e !== null && e.memoizedState === null ? !1 : (we.current & 2) !== 0), c && (n = !0, t.flags &= -129), c = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (se) {
        if (n ? Al(t) : Rl(), (e = ze) ? (e = Pd(
          e,
          Mt
        ), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: Sl !== null ? { id: Jt, overflow: kt } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, l = _o(e), l.return = t, t.child = l, Je = t, ze = null)) : e = null, e === null) throw El(t);
        return Ys(e) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      var d = a.children;
      return a = a.fallback, n ? (Rl(), n = t.mode, d = Gu(
        { mode: "hidden", children: d },
        n
      ), a = Wl(
        a,
        n,
        l,
        null
      ), d.return = t, a.return = t, d.sibling = a, t.child = d, a = t.child, a.memoizedState = as(l), a.childLanes = ns(
        e,
        c,
        l
      ), t.memoizedState = ls, Tn(null, a)) : (Al(t), us(t, d));
    }
    var g = e.memoizedState;
    if (g !== null && (d = g.dehydrated, d !== null)) {
      if (u)
        t.flags & 256 ? (Al(t), t.flags &= -257, t = is(
          e,
          t,
          l
        )) : t.memoizedState !== null ? (Rl(), t.child = e.child, t.flags |= 128, t = null) : (Rl(), d = a.fallback, n = t.mode, a = Gu(
          { mode: "visible", children: a.children },
          n
        ), d = Wl(
          d,
          n,
          l,
          null
        ), d.flags |= 2, a.return = t, d.return = t, a.sibling = d, t.child = a, aa(
          t,
          e.child,
          null,
          l
        ), a = t.child, a.memoizedState = as(l), a.childLanes = ns(
          e,
          c,
          l
        ), t.memoizedState = ls, t = Tn(null, a));
      else if (Al(t), Ys(d)) {
        if (c = d.nextSibling && d.nextSibling.dataset, c) var z = c.dgst;
        c = z, a = Error(s(419)), a.stack = "", a.digest = c, hn({ value: a, source: null, stack: null }), t = is(
          e,
          t,
          l
        );
      } else if (Ge || Na(e, t, l, !1), c = (l & e.childLanes) !== 0, Ge || c) {
        if (c = Ee, c !== null && (a = Ar(c, l), a !== 0 && a !== g.retryLane))
          throw g.retryLane = a, $l(e, a), ot(c, e, a), es;
        qs(d) || Wu(), t = is(
          e,
          t,
          l
        );
      } else
        qs(d) ? (t.flags |= 192, t.child = e.child, t = null) : (e = g.treeContext, ze = Ut(
          d.nextSibling
        ), Je = t, se = !0, _l = null, Mt = !1, e !== null && To(t, e), t = us(
          t,
          a.children
        ), t.flags |= 4096);
      return t;
    }
    return n ? (Rl(), d = a.fallback, n = t.mode, g = e.child, z = g.sibling, a = tl(g, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = g.subtreeFlags & 65011712, z !== null ? d = tl(
      z,
      d
    ) : (d = Wl(
      d,
      n,
      l,
      null
    ), d.flags |= 2), d.return = t, a.return = t, a.sibling = d, t.child = a, Tn(null, a), a = t.child, d = e.child.memoizedState, d === null ? d = as(l) : (n = d.cachePool, n !== null ? (g = qe._currentValue, n = n.parent !== g ? { parent: g, pool: g } : n) : n = Co(), d = {
      baseLanes: d.baseLanes | l,
      cachePool: n
    }), a.memoizedState = d, a.childLanes = ns(
      e,
      c,
      l
    ), t.memoizedState = ls, Tn(e.child, a)) : (Al(t), l = e.child, e = l.sibling, l = tl(l, {
      mode: "visible",
      children: a.children
    }), l.return = t, l.sibling = null, e !== null && (c = t.deletions, c === null ? (t.deletions = [e], t.flags |= 16) : c.push(e)), t.child = l, t.memoizedState = null, l);
  }
  function us(e, t) {
    return t = Gu(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function Gu(e, t) {
    return e = vt(22, e, null, t), e.lanes = 0, e;
  }
  function is(e, t, l) {
    return aa(t, e.child, null, l), e = us(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function Vf(e, t, l) {
    e.lanes |= t;
    var a = e.alternate;
    a !== null && (a.lanes |= t), Sc(e.return, t, l);
  }
  function cs(e, t, l, a, n, u) {
    var c = e.memoizedState;
    c === null ? e.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: a,
      tail: l,
      tailMode: n,
      treeForkCount: u
    } : (c.isBackwards = t, c.rendering = null, c.renderingStartTime = 0, c.last = a, c.tail = l, c.tailMode = n, c.treeForkCount = u);
  }
  function Kf(e, t, l) {
    var a = t.pendingProps, n = a.revealOrder, u = a.tail;
    a = a.children;
    var c = we.current, d = (c & 2) !== 0;
    if (d ? (c = c & 1 | 2, t.flags |= 128) : c &= 1, G(we, c), $e(e, t, a, l), a = se ? dn : 0, !d && e !== null && (e.flags & 128) !== 0)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13)
          e.memoizedState !== null && Vf(e, l, t);
        else if (e.tag === 19)
          Vf(e, l, t);
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
          e = l.alternate, e !== null && Ru(e) === null && (n = l), l = l.sibling;
        l = n, l === null ? (n = t.child, t.child = null) : (n = l.sibling, l.sibling = null), cs(
          t,
          !1,
          n,
          l,
          u,
          a
        );
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (l = null, n = t.child, t.child = null; n !== null; ) {
          if (e = n.alternate, e !== null && Ru(e) === null) {
            t.child = n;
            break;
          }
          e = n.sibling, n.sibling = l, l = n, n = e;
        }
        cs(
          t,
          !0,
          l,
          null,
          u,
          a
        );
        break;
      case "together":
        cs(
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
  function cl(e, t, l) {
    if (e !== null && (t.dependencies = e.dependencies), Ml |= t.lanes, (l & t.childLanes) === 0)
      if (e !== null) {
        if (Na(
          e,
          t,
          l,
          !1
        ), (l & t.childLanes) === 0)
          return null;
      } else return null;
    if (e !== null && t.child !== e.child)
      throw Error(s(153));
    if (t.child !== null) {
      for (e = t.child, l = tl(e, e.pendingProps), t.child = l, l.return = t; e.sibling !== null; )
        e = e.sibling, l = l.sibling = tl(e, e.pendingProps), l.return = t;
      l.sibling = null;
    }
    return t.child;
  }
  function ss(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && Su(e)));
  }
  function Hp(e, t, l) {
    switch (t.tag) {
      case 3:
        lt(t, t.stateNode.containerInfo), jl(t, qe, e.memoizedState.cache), Fl();
        break;
      case 27:
      case 5:
        Wa(t);
        break;
      case 4:
        lt(t, t.stateNode.containerInfo);
        break;
      case 10:
        jl(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 31:
        if (t.memoizedState !== null)
          return t.flags |= 128, Dc(t), null;
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null)
          return a.dehydrated !== null ? (Al(t), t.flags |= 128, null) : (l & t.child.childLanes) !== 0 ? Zf(e, t, l) : (Al(t), e = cl(
            e,
            t,
            l
          ), e !== null ? e.sibling : null);
        Al(t);
        break;
      case 19:
        var n = (e.flags & 128) !== 0;
        if (a = (l & t.childLanes) !== 0, a || (Na(
          e,
          t,
          l,
          !1
        ), a = (l & t.childLanes) !== 0), n) {
          if (a)
            return Kf(
              e,
              t,
              l
            );
          t.flags |= 128;
        }
        if (n = t.memoizedState, n !== null && (n.rendering = null, n.tail = null, n.lastEffect = null), G(we, we.current), a) break;
        return null;
      case 22:
        return t.lanes = 0, Lf(
          e,
          t,
          l,
          t.pendingProps
        );
      case 24:
        jl(t, qe, e.memoizedState.cache);
    }
    return cl(e, t, l);
  }
  function Jf(e, t, l) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        Ge = !0;
      else {
        if (!ss(e, l) && (t.flags & 128) === 0)
          return Ge = !1, Hp(
            e,
            t,
            l
          );
        Ge = (e.flags & 131072) !== 0;
      }
    else
      Ge = !1, se && (t.flags & 1048576) !== 0 && jo(t, dn, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          var a = t.pendingProps;
          if (e = ta(t.elementType), t.type = e, typeof e == "function")
            hc(e) ? (a = ua(e, a), t.tag = 1, t = Xf(
              null,
              t,
              e,
              a,
              l
            )) : (t.tag = 0, t = ts(
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
                t.tag = 11, t = Hf(
                  null,
                  t,
                  e,
                  a,
                  l
                );
                break e;
              } else if (n === W) {
                t.tag = 14, t = wf(
                  null,
                  t,
                  e,
                  a,
                  l
                );
                break e;
              }
            }
            throw t = Tt(e) || e, Error(s(306, t, ""));
          }
        }
        return t;
      case 0:
        return ts(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 1:
        return a = t.type, n = ua(
          a,
          t.pendingProps
        ), Xf(
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
          ), e === null) throw Error(s(387));
          a = t.pendingProps;
          var u = t.memoizedState;
          n = u.element, Ac(e, t), xn(t, a, null, l);
          var c = t.memoizedState;
          if (a = c.cache, jl(t, qe, a), a !== u.cache && _c(
            t,
            [qe],
            l,
            !0
          ), bn(), a = c.element, u.isDehydrated)
            if (u = {
              element: a,
              isDehydrated: !1,
              cache: c.cache
            }, t.updateQueue.baseState = u, t.memoizedState = u, t.flags & 256) {
              t = Qf(
                e,
                t,
                a,
                l
              );
              break e;
            } else if (a !== n) {
              n = Rt(
                Error(s(424)),
                t
              ), hn(n), t = Qf(
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
              for (ze = Ut(e.firstChild), Je = t, se = !0, _l = null, Mt = !0, l = Bo(
                t,
                null,
                a,
                l
              ), t.child = l; l; )
                l.flags = l.flags & -3 | 4096, l = l.sibling;
            }
          else {
            if (Fl(), a === n) {
              t = cl(
                e,
                t,
                l
              );
              break e;
            }
            $e(e, t, a, l);
          }
          t = t.child;
        }
        return t;
      case 26:
        return Yu(e, t), e === null ? (l = nh(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = l : se || (l = t.type, e = t.pendingProps, a = ai(
          ae.current
        ).createElement(l), a[Ke] = t, a[nt] = e, We(a, l, e), Ze(a), t.stateNode = a) : t.memoizedState = nh(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return Wa(t), e === null && se && (a = t.stateNode = th(
          t.type,
          t.pendingProps,
          ae.current
        ), Je = t, Mt = !0, n = ze, Bl(t.type) ? (Gs = n, ze = Ut(a.firstChild)) : ze = n), $e(
          e,
          t,
          t.pendingProps.children,
          l
        ), Yu(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && se && ((n = a = ze) && (a = fv(
          a,
          t.type,
          t.pendingProps,
          Mt
        ), a !== null ? (t.stateNode = a, Je = t, ze = Ut(a.firstChild), Mt = !1, n = !0) : n = !1), n || El(t)), Wa(t), n = t.type, u = t.pendingProps, c = e !== null ? e.memoizedProps : null, a = u.children, ws(n, u) ? a = null : c !== null && ws(n, c) && (t.flags |= 32), t.memoizedState !== null && (n = Hc(
          e,
          t,
          zp,
          null,
          null,
          l
        ), Yn._currentValue = n), Yu(e, t), $e(e, t, a, l), t.child;
      case 6:
        return e === null && se && ((e = l = ze) && (l = dv(
          l,
          t.pendingProps,
          Mt
        ), l !== null ? (t.stateNode = l, Je = t, ze = null, e = !0) : e = !1), e || El(t)), null;
      case 13:
        return Zf(e, t, l);
      case 4:
        return lt(
          t,
          t.stateNode.containerInfo
        ), a = t.pendingProps, e === null ? t.child = aa(
          t,
          null,
          a,
          l
        ) : $e(e, t, a, l), t.child;
      case 11:
        return Hf(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 7:
        return $e(
          e,
          t,
          t.pendingProps,
          l
        ), t.child;
      case 8:
        return $e(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 12:
        return $e(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 10:
        return a = t.pendingProps, jl(t, t.type, a.value), $e(e, t, a.children, l), t.child;
      case 9:
        return n = t.type._context, a = t.pendingProps.children, Il(t), n = ke(n), a = a(n), t.flags |= 1, $e(e, t, a, l), t.child;
      case 14:
        return wf(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 15:
        return Bf(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 19:
        return Kf(e, t, l);
      case 31:
        return Up(e, t, l);
      case 22:
        return Lf(
          e,
          t,
          l,
          t.pendingProps
        );
      case 24:
        return Il(t), a = ke(qe), e === null ? (n = Tc(), n === null && (n = Ee, u = Ec(), n.pooledCache = u, u.refCount++, u !== null && (n.pooledCacheLanes |= l), n = u), t.memoizedState = { parent: a, cache: n }, Nc(t), jl(t, qe, n)) : ((e.lanes & l) !== 0 && (Ac(e, t), xn(t, null, null, l), bn()), n = e.memoizedState, u = t.memoizedState, n.parent !== a ? (n = { parent: a, cache: a }, t.memoizedState = n, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = n), jl(t, qe, a)) : (a = u.cache, jl(t, qe, a), a !== n.cache && _c(
          t,
          [qe],
          l,
          !0
        ))), $e(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(s(156, t.tag));
  }
  function sl(e) {
    e.flags |= 4;
  }
  function rs(e, t, l, a, n) {
    if ((t = (e.mode & 32) !== 0) && (t = !1), t) {
      if (e.flags |= 16777216, (n & 335544128) === n)
        if (e.stateNode.complete) e.flags |= 8192;
        else if (xd()) e.flags |= 8192;
        else
          throw la = Tu, zc;
    } else e.flags &= -16777217;
  }
  function kf(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !rh(t))
      if (xd()) e.flags |= 8192;
      else
        throw la = Tu, zc;
  }
  function Xu(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? Tr() : 536870912, e.lanes |= t, qa |= t);
  }
  function zn(e, t) {
    if (!se)
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
  function Ne(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, l = 0, a = 0;
    if (t)
      for (var n = e.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags & 65011712, a |= n.flags & 65011712, n.return = e, n = n.sibling;
    else
      for (n = e.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags, a |= n.flags, n.return = e, n = n.sibling;
    return e.subtreeFlags |= a, e.childLanes = l, t;
  }
  function wp(e, t, l) {
    var a = t.pendingProps;
    switch (yc(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Ne(t), null;
      case 1:
        return Ne(t), null;
      case 3:
        return l = t.stateNode, a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), nl(qe), He(), l.pendingContext && (l.context = l.pendingContext, l.pendingContext = null), (e === null || e.child === null) && (za(t) ? sl(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, bc())), Ne(t), null;
      case 26:
        var n = t.type, u = t.memoizedState;
        return e === null ? (sl(t), u !== null ? (Ne(t), kf(t, u)) : (Ne(t), rs(
          t,
          n,
          null,
          a,
          l
        ))) : u ? u !== e.memoizedState ? (sl(t), Ne(t), kf(t, u)) : (Ne(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== a && sl(t), Ne(t), rs(
          t,
          n,
          e,
          a,
          l
        )), null;
      case 27:
        if (In(t), l = ae.current, n = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && sl(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(s(166));
            return Ne(t), null;
          }
          e = Z.current, za(t) ? zo(t) : (e = th(n, a, l), t.stateNode = e, sl(t));
        }
        return Ne(t), null;
      case 5:
        if (In(t), n = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && sl(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(s(166));
            return Ne(t), null;
          }
          if (u = Z.current, za(t))
            zo(t);
          else {
            var c = ai(
              ae.current
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
            u[Ke] = t, u[nt] = a;
            e: for (c = t.child; c !== null; ) {
              if (c.tag === 5 || c.tag === 6)
                u.appendChild(c.stateNode);
              else if (c.tag !== 4 && c.tag !== 27 && c.child !== null) {
                c.child.return = c, c = c.child;
                continue;
              }
              if (c === t) break e;
              for (; c.sibling === null; ) {
                if (c.return === null || c.return === t)
                  break e;
                c = c.return;
              }
              c.sibling.return = c.return, c = c.sibling;
            }
            t.stateNode = u;
            e: switch (We(u, n, a), n) {
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
            a && sl(t);
          }
        }
        return Ne(t), rs(
          t,
          t.type,
          e === null ? null : e.memoizedProps,
          t.pendingProps,
          l
        ), null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== a && sl(t);
        else {
          if (typeof a != "string" && t.stateNode === null)
            throw Error(s(166));
          if (e = ae.current, za(t)) {
            if (e = t.stateNode, l = t.memoizedProps, a = null, n = Je, n !== null)
              switch (n.tag) {
                case 27:
                case 5:
                  a = n.memoizedProps;
              }
            e[Ke] = t, e = !!(e.nodeValue === l || a !== null && a.suppressHydrationWarning === !0 || Zd(e.nodeValue, l)), e || El(t, !0);
          } else
            e = ai(e).createTextNode(
              a
            ), e[Ke] = t, t.stateNode = e;
        }
        return Ne(t), null;
      case 31:
        if (l = t.memoizedState, e === null || e.memoizedState !== null) {
          if (a = za(t), l !== null) {
            if (e === null) {
              if (!a) throw Error(s(318));
              if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(s(557));
              e[Ke] = t;
            } else
              Fl(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Ne(t), e = !1;
          } else
            l = bc(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = l), e = !0;
          if (!e)
            return t.flags & 256 ? (gt(t), t) : (gt(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(s(558));
        }
        return Ne(t), null;
      case 13:
        if (a = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (n = za(t), a !== null && a.dehydrated !== null) {
            if (e === null) {
              if (!n) throw Error(s(318));
              if (n = t.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(s(317));
              n[Ke] = t;
            } else
              Fl(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Ne(t), n = !1;
          } else
            n = bc(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), n = !0;
          if (!n)
            return t.flags & 256 ? (gt(t), t) : (gt(t), null);
        }
        return gt(t), (t.flags & 128) !== 0 ? (t.lanes = l, t) : (l = a !== null, e = e !== null && e.memoizedState !== null, l && (a = t.child, n = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (n = a.alternate.memoizedState.cachePool.pool), u = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (u = a.memoizedState.cachePool.pool), u !== n && (a.flags |= 2048)), l !== e && l && (t.child.flags |= 8192), Xu(t, t.updateQueue), Ne(t), null);
      case 4:
        return He(), e === null && Cs(t.stateNode.containerInfo), Ne(t), null;
      case 10:
        return nl(t.type), Ne(t), null;
      case 19:
        if (H(we), a = t.memoizedState, a === null) return Ne(t), null;
        if (n = (t.flags & 128) !== 0, u = a.rendering, u === null)
          if (n) zn(a, !1);
          else {
            if (De !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (u = Ru(e), u !== null) {
                  for (t.flags |= 128, zn(a, !1), e = u.updateQueue, t.updateQueue = e, Xu(t, e), t.subtreeFlags = 0, e = l, l = t.child; l !== null; )
                    So(l, e), l = l.sibling;
                  return G(
                    we,
                    we.current & 1 | 2
                  ), se && ll(t, a.treeForkCount), t.child;
                }
                e = e.sibling;
              }
            a.tail !== null && dt() > Ju && (t.flags |= 128, n = !0, zn(a, !1), t.lanes = 4194304);
          }
        else {
          if (!n)
            if (e = Ru(u), e !== null) {
              if (t.flags |= 128, n = !0, e = e.updateQueue, t.updateQueue = e, Xu(t, e), zn(a, !0), a.tail === null && a.tailMode === "hidden" && !u.alternate && !se)
                return Ne(t), null;
            } else
              2 * dt() - a.renderingStartTime > Ju && l !== 536870912 && (t.flags |= 128, n = !0, zn(a, !1), t.lanes = 4194304);
          a.isBackwards ? (u.sibling = t.child, t.child = u) : (e = a.last, e !== null ? e.sibling = u : t.child = u, a.last = u);
        }
        return a.tail !== null ? (e = a.tail, a.rendering = e, a.tail = e.sibling, a.renderingStartTime = dt(), e.sibling = null, l = we.current, G(
          we,
          n ? l & 1 | 2 : l & 1
        ), se && ll(t, a.treeForkCount), e) : (Ne(t), null);
      case 22:
      case 23:
        return gt(t), Mc(), a = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (l & 536870912) !== 0 && (t.flags & 128) === 0 && (Ne(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Ne(t), l = t.updateQueue, l !== null && Xu(t, l.retryQueue), l = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== l && (t.flags |= 2048), e !== null && H(ea), null;
      case 24:
        return l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), nl(qe), Ne(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(s(156, t.tag));
  }
  function Bp(e, t) {
    switch (yc(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return nl(qe), He(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return In(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (gt(t), t.alternate === null)
            throw Error(s(340));
          Fl();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 13:
        if (gt(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(s(340));
          Fl();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return H(we), null;
      case 4:
        return He(), null;
      case 10:
        return nl(t.type), null;
      case 22:
      case 23:
        return gt(t), Mc(), e !== null && H(ea), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return nl(qe), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function $f(e, t) {
    switch (yc(t), t.tag) {
      case 3:
        nl(qe), He();
        break;
      case 26:
      case 27:
      case 5:
        In(t);
        break;
      case 4:
        He();
        break;
      case 31:
        t.memoizedState !== null && gt(t);
        break;
      case 13:
        gt(t);
        break;
      case 19:
        H(we);
        break;
      case 10:
        nl(t.type);
        break;
      case 22:
      case 23:
        gt(t), Mc(), e !== null && H(ea);
        break;
      case 24:
        nl(qe);
    }
  }
  function Nn(e, t) {
    try {
      var l = t.updateQueue, a = l !== null ? l.lastEffect : null;
      if (a !== null) {
        var n = a.next;
        l = n;
        do {
          if ((l.tag & e) === e) {
            a = void 0;
            var u = l.create, c = l.inst;
            a = u(), c.destroy = a;
          }
          l = l.next;
        } while (l !== n);
      }
    } catch (d) {
      ye(t, t.return, d);
    }
  }
  function Ol(e, t, l) {
    try {
      var a = t.updateQueue, n = a !== null ? a.lastEffect : null;
      if (n !== null) {
        var u = n.next;
        a = u;
        do {
          if ((a.tag & e) === e) {
            var c = a.inst, d = c.destroy;
            if (d !== void 0) {
              c.destroy = void 0, n = t;
              var g = l, z = d;
              try {
                z();
              } catch (C) {
                ye(
                  n,
                  g,
                  C
                );
              }
            }
          }
          a = a.next;
        } while (a !== u);
      }
    } catch (C) {
      ye(t, t.return, C);
    }
  }
  function Wf(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var l = e.stateNode;
      try {
        qo(t, l);
      } catch (a) {
        ye(e, e.return, a);
      }
    }
  }
  function Ff(e, t, l) {
    l.props = ua(
      e.type,
      e.memoizedProps
    ), l.state = e.memoizedState;
    try {
      l.componentWillUnmount();
    } catch (a) {
      ye(e, t, a);
    }
  }
  function An(e, t) {
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
      ye(e, t, n);
    }
  }
  function $t(e, t) {
    var l = e.ref, a = e.refCleanup;
    if (l !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (n) {
          ye(e, t, n);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof l == "function")
        try {
          l(null);
        } catch (n) {
          ye(e, t, n);
        }
      else l.current = null;
  }
  function Pf(e) {
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
      ye(e, e.return, n);
    }
  }
  function os(e, t, l) {
    try {
      var a = e.stateNode;
      uv(a, e.type, l, t), a[nt] = t;
    } catch (n) {
      ye(e, e.return, n);
    }
  }
  function If(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Bl(e.type) || e.tag === 4;
  }
  function fs(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || If(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && Bl(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function ds(e, t, l) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? (l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l).insertBefore(e, t) : (t = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, t.appendChild(e), l = l._reactRootContainer, l != null || t.onclick !== null || (t.onclick = It));
    else if (a !== 4 && (a === 27 && Bl(e.type) && (l = e.stateNode, t = null), e = e.child, e !== null))
      for (ds(e, t, l), e = e.sibling; e !== null; )
        ds(e, t, l), e = e.sibling;
  }
  function Qu(e, t, l) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? l.insertBefore(e, t) : l.appendChild(e);
    else if (a !== 4 && (a === 27 && Bl(e.type) && (l = e.stateNode), e = e.child, e !== null))
      for (Qu(e, t, l), e = e.sibling; e !== null; )
        Qu(e, t, l), e = e.sibling;
  }
  function ed(e) {
    var t = e.stateNode, l = e.memoizedProps;
    try {
      for (var a = e.type, n = t.attributes; n.length; )
        t.removeAttributeNode(n[0]);
      We(t, a, l), t[Ke] = e, t[nt] = l;
    } catch (u) {
      ye(e, e.return, u);
    }
  }
  var rl = !1, Xe = !1, hs = !1, td = typeof WeakSet == "function" ? WeakSet : Set, Ve = null;
  function Lp(e, t) {
    if (e = e.containerInfo, Us = oi, e = fo(e), ic(e)) {
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
            var n = a.anchorOffset, u = a.focusNode;
            a = a.focusOffset;
            try {
              l.nodeType, u.nodeType;
            } catch {
              l = null;
              break e;
            }
            var c = 0, d = -1, g = -1, z = 0, C = 0, U = e, A = null;
            t: for (; ; ) {
              for (var O; U !== l || n !== 0 && U.nodeType !== 3 || (d = c + n), U !== u || a !== 0 && U.nodeType !== 3 || (g = c + a), U.nodeType === 3 && (c += U.nodeValue.length), (O = U.firstChild) !== null; )
                A = U, U = O;
              for (; ; ) {
                if (U === e) break t;
                if (A === l && ++z === n && (d = c), A === u && ++C === a && (g = c), (O = U.nextSibling) !== null) break;
                U = A, A = U.parentNode;
              }
              U = O;
            }
            l = d === -1 || g === -1 ? null : { start: d, end: g };
          } else l = null;
        }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (Hs = { focusedElem: e, selectionRange: l }, oi = !1, Ve = t; Ve !== null; )
      if (t = Ve, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null)
        e.return = t, Ve = e;
      else
        for (; Ve !== null; ) {
          switch (t = Ve, u = t.alternate, e = t.flags, t.tag) {
            case 0:
              if ((e & 4) !== 0 && (e = t.updateQueue, e = e !== null ? e.events : null, e !== null))
                for (l = 0; l < e.length; l++)
                  n = e[l], n.ref.impl = n.nextImpl;
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && u !== null) {
                e = void 0, l = t, n = u.memoizedProps, u = u.memoizedState, a = l.stateNode;
                try {
                  var Q = ua(
                    l.type,
                    n
                  );
                  e = a.getSnapshotBeforeUpdate(
                    Q,
                    u
                  ), a.__reactInternalSnapshotBeforeUpdate = e;
                } catch ($) {
                  ye(
                    l,
                    l.return,
                    $
                  );
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (e = t.stateNode.containerInfo, l = e.nodeType, l === 9)
                  Ls(e);
                else if (l === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      Ls(e);
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
              if ((e & 1024) !== 0) throw Error(s(163));
          }
          if (e = t.sibling, e !== null) {
            e.return = t.return, Ve = e;
            break;
          }
          Ve = t.return;
        }
  }
  function ld(e, t, l) {
    var a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        fl(e, l), a & 4 && Nn(5, l);
        break;
      case 1:
        if (fl(e, l), a & 4)
          if (e = l.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (c) {
              ye(l, l.return, c);
            }
          else {
            var n = ua(
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
            } catch (c) {
              ye(
                l,
                l.return,
                c
              );
            }
          }
        a & 64 && Wf(l), a & 512 && An(l, l.return);
        break;
      case 3:
        if (fl(e, l), a & 64 && (e = l.updateQueue, e !== null)) {
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
            qo(e, t);
          } catch (c) {
            ye(l, l.return, c);
          }
        }
        break;
      case 27:
        t === null && a & 4 && ed(l);
      case 26:
      case 5:
        fl(e, l), t === null && a & 4 && Pf(l), a & 512 && An(l, l.return);
        break;
      case 12:
        fl(e, l);
        break;
      case 31:
        fl(e, l), a & 4 && ud(e, l);
        break;
      case 13:
        fl(e, l), a & 4 && id(e, l), a & 64 && (e = l.memoizedState, e !== null && (e = e.dehydrated, e !== null && (l = Jp.bind(
          null,
          l
        ), hv(e, l))));
        break;
      case 22:
        if (a = l.memoizedState !== null || rl, !a) {
          t = t !== null && t.memoizedState !== null || Xe, n = rl;
          var u = Xe;
          rl = a, (Xe = t) && !u ? dl(
            e,
            l,
            (l.subtreeFlags & 8772) !== 0
          ) : fl(e, l), rl = n, Xe = u;
        }
        break;
      case 30:
        break;
      default:
        fl(e, l);
    }
  }
  function ad(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, ad(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && Qi(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var Ae = null, it = !1;
  function ol(e, t, l) {
    for (l = l.child; l !== null; )
      nd(e, t, l), l = l.sibling;
  }
  function nd(e, t, l) {
    if (ht && typeof ht.onCommitFiberUnmount == "function")
      try {
        ht.onCommitFiberUnmount(Fa, l);
      } catch {
      }
    switch (l.tag) {
      case 26:
        Xe || $t(l, t), ol(
          e,
          t,
          l
        ), l.memoizedState ? l.memoizedState.count-- : l.stateNode && (l = l.stateNode, l.parentNode.removeChild(l));
        break;
      case 27:
        Xe || $t(l, t);
        var a = Ae, n = it;
        Bl(l.type) && (Ae = l.stateNode, it = !1), ol(
          e,
          t,
          l
        ), Bn(l.stateNode), Ae = a, it = n;
        break;
      case 5:
        Xe || $t(l, t);
      case 6:
        if (a = Ae, n = it, Ae = null, ol(
          e,
          t,
          l
        ), Ae = a, it = n, Ae !== null)
          if (it)
            try {
              (Ae.nodeType === 9 ? Ae.body : Ae.nodeName === "HTML" ? Ae.ownerDocument.body : Ae).removeChild(l.stateNode);
            } catch (u) {
              ye(
                l,
                t,
                u
              );
            }
          else
            try {
              Ae.removeChild(l.stateNode);
            } catch (u) {
              ye(
                l,
                t,
                u
              );
            }
        break;
      case 18:
        Ae !== null && (it ? (e = Ae, Wd(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          l.stateNode
        ), Ja(e)) : Wd(Ae, l.stateNode));
        break;
      case 4:
        a = Ae, n = it, Ae = l.stateNode.containerInfo, it = !0, ol(
          e,
          t,
          l
        ), Ae = a, it = n;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Ol(2, l, t), Xe || Ol(4, l, t), ol(
          e,
          t,
          l
        );
        break;
      case 1:
        Xe || ($t(l, t), a = l.stateNode, typeof a.componentWillUnmount == "function" && Ff(
          l,
          t,
          a
        )), ol(
          e,
          t,
          l
        );
        break;
      case 21:
        ol(
          e,
          t,
          l
        );
        break;
      case 22:
        Xe = (a = Xe) || l.memoizedState !== null, ol(
          e,
          t,
          l
        ), Xe = a;
        break;
      default:
        ol(
          e,
          t,
          l
        );
    }
  }
  function ud(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
      e = e.dehydrated;
      try {
        Ja(e);
      } catch (l) {
        ye(t, t.return, l);
      }
    }
  }
  function id(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        Ja(e);
      } catch (l) {
        ye(t, t.return, l);
      }
  }
  function qp(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new td()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new td()), t;
      default:
        throw Error(s(435, e.tag));
    }
  }
  function Zu(e, t) {
    var l = qp(e);
    t.forEach(function(a) {
      if (!l.has(a)) {
        l.add(a);
        var n = kp.bind(null, e, a);
        a.then(n, n);
      }
    });
  }
  function ct(e, t) {
    var l = t.deletions;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var n = l[a], u = e, c = t, d = c;
        e: for (; d !== null; ) {
          switch (d.tag) {
            case 27:
              if (Bl(d.type)) {
                Ae = d.stateNode, it = !1;
                break e;
              }
              break;
            case 5:
              Ae = d.stateNode, it = !1;
              break e;
            case 3:
            case 4:
              Ae = d.stateNode.containerInfo, it = !0;
              break e;
          }
          d = d.return;
        }
        if (Ae === null) throw Error(s(160));
        nd(u, c, n), Ae = null, it = !1, u = n.alternate, u !== null && (u.return = null), n.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        cd(t, e), t = t.sibling;
  }
  var Xt = null;
  function cd(e, t) {
    var l = e.alternate, a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        ct(t, e), st(e), a & 4 && (Ol(3, e, e.return), Nn(3, e), Ol(5, e, e.return));
        break;
      case 1:
        ct(t, e), st(e), a & 512 && (Xe || l === null || $t(l, l.return)), a & 64 && rl && (e = e.updateQueue, e !== null && (a = e.callbacks, a !== null && (l = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = l === null ? a : l.concat(a))));
        break;
      case 26:
        var n = Xt;
        if (ct(t, e), st(e), a & 512 && (Xe || l === null || $t(l, l.return)), a & 4) {
          var u = l !== null ? l.memoizedState : null;
          if (a = e.memoizedState, l === null)
            if (a === null)
              if (e.stateNode === null) {
                e: {
                  a = e.type, l = e.memoizedProps, n = n.ownerDocument || n;
                  t: switch (a) {
                    case "title":
                      u = n.getElementsByTagName("title")[0], (!u || u[en] || u[Ke] || u.namespaceURI === "http://www.w3.org/2000/svg" || u.hasAttribute("itemprop")) && (u = n.createElement(a), n.head.insertBefore(
                        u,
                        n.querySelector("head > title")
                      )), We(u, a, l), u[Ke] = e, Ze(u), a = u;
                      break e;
                    case "link":
                      var c = ch(
                        "link",
                        "href",
                        n
                      ).get(a + (l.href || ""));
                      if (c) {
                        for (var d = 0; d < c.length; d++)
                          if (u = c[d], u.getAttribute("href") === (l.href == null || l.href === "" ? null : l.href) && u.getAttribute("rel") === (l.rel == null ? null : l.rel) && u.getAttribute("title") === (l.title == null ? null : l.title) && u.getAttribute("crossorigin") === (l.crossOrigin == null ? null : l.crossOrigin)) {
                            c.splice(d, 1);
                            break t;
                          }
                      }
                      u = n.createElement(a), We(u, a, l), n.head.appendChild(u);
                      break;
                    case "meta":
                      if (c = ch(
                        "meta",
                        "content",
                        n
                      ).get(a + (l.content || ""))) {
                        for (d = 0; d < c.length; d++)
                          if (u = c[d], u.getAttribute("content") === (l.content == null ? null : "" + l.content) && u.getAttribute("name") === (l.name == null ? null : l.name) && u.getAttribute("property") === (l.property == null ? null : l.property) && u.getAttribute("http-equiv") === (l.httpEquiv == null ? null : l.httpEquiv) && u.getAttribute("charset") === (l.charSet == null ? null : l.charSet)) {
                            c.splice(d, 1);
                            break t;
                          }
                      }
                      u = n.createElement(a), We(u, a, l), n.head.appendChild(u);
                      break;
                    default:
                      throw Error(s(468, a));
                  }
                  u[Ke] = e, Ze(u), a = u;
                }
                e.stateNode = a;
              } else
                sh(
                  n,
                  e.type,
                  e.stateNode
                );
            else
              e.stateNode = ih(
                n,
                a,
                e.memoizedProps
              );
          else
            u !== a ? (u === null ? l.stateNode !== null && (l = l.stateNode, l.parentNode.removeChild(l)) : u.count--, a === null ? sh(
              n,
              e.type,
              e.stateNode
            ) : ih(
              n,
              a,
              e.memoizedProps
            )) : a === null && e.stateNode !== null && os(
              e,
              e.memoizedProps,
              l.memoizedProps
            );
        }
        break;
      case 27:
        ct(t, e), st(e), a & 512 && (Xe || l === null || $t(l, l.return)), l !== null && a & 4 && os(
          e,
          e.memoizedProps,
          l.memoizedProps
        );
        break;
      case 5:
        if (ct(t, e), st(e), a & 512 && (Xe || l === null || $t(l, l.return)), e.flags & 32) {
          n = e.stateNode;
          try {
            va(n, "");
          } catch (Q) {
            ye(e, e.return, Q);
          }
        }
        a & 4 && e.stateNode != null && (n = e.memoizedProps, os(
          e,
          n,
          l !== null ? l.memoizedProps : n
        )), a & 1024 && (hs = !0);
        break;
      case 6:
        if (ct(t, e), st(e), a & 4) {
          if (e.stateNode === null)
            throw Error(s(162));
          a = e.memoizedProps, l = e.stateNode;
          try {
            l.nodeValue = a;
          } catch (Q) {
            ye(e, e.return, Q);
          }
        }
        break;
      case 3:
        if (ii = null, n = Xt, Xt = ni(t.containerInfo), ct(t, e), Xt = n, st(e), a & 4 && l !== null && l.memoizedState.isDehydrated)
          try {
            Ja(t.containerInfo);
          } catch (Q) {
            ye(e, e.return, Q);
          }
        hs && (hs = !1, sd(e));
        break;
      case 4:
        a = Xt, Xt = ni(
          e.stateNode.containerInfo
        ), ct(t, e), st(e), Xt = a;
        break;
      case 12:
        ct(t, e), st(e);
        break;
      case 31:
        ct(t, e), st(e), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, Zu(e, a)));
        break;
      case 13:
        ct(t, e), st(e), e.child.flags & 8192 && e.memoizedState !== null != (l !== null && l.memoizedState !== null) && (Ku = dt()), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, Zu(e, a)));
        break;
      case 22:
        n = e.memoizedState !== null;
        var g = l !== null && l.memoizedState !== null, z = rl, C = Xe;
        if (rl = z || n, Xe = C || g, ct(t, e), Xe = C, rl = z, st(e), a & 8192)
          e: for (t = e.stateNode, t._visibility = n ? t._visibility & -2 : t._visibility | 1, n && (l === null || g || rl || Xe || ia(e)), l = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (l === null) {
                g = l = t;
                try {
                  if (u = g.stateNode, n)
                    c = u.style, typeof c.setProperty == "function" ? c.setProperty("display", "none", "important") : c.display = "none";
                  else {
                    d = g.stateNode;
                    var U = g.memoizedProps.style, A = U != null && U.hasOwnProperty("display") ? U.display : null;
                    d.style.display = A == null || typeof A == "boolean" ? "" : ("" + A).trim();
                  }
                } catch (Q) {
                  ye(g, g.return, Q);
                }
              }
            } else if (t.tag === 6) {
              if (l === null) {
                g = t;
                try {
                  g.stateNode.nodeValue = n ? "" : g.memoizedProps;
                } catch (Q) {
                  ye(g, g.return, Q);
                }
              }
            } else if (t.tag === 18) {
              if (l === null) {
                g = t;
                try {
                  var O = g.stateNode;
                  n ? Fd(O, !0) : Fd(g.stateNode, !1);
                } catch (Q) {
                  ye(g, g.return, Q);
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
        a & 4 && (a = e.updateQueue, a !== null && (l = a.retryQueue, l !== null && (a.retryQueue = null, Zu(e, l))));
        break;
      case 19:
        ct(t, e), st(e), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, Zu(e, a)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        ct(t, e), st(e);
    }
  }
  function st(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var l, a = e.return; a !== null; ) {
          if (If(a)) {
            l = a;
            break;
          }
          a = a.return;
        }
        if (l == null) throw Error(s(160));
        switch (l.tag) {
          case 27:
            var n = l.stateNode, u = fs(e);
            Qu(e, u, n);
            break;
          case 5:
            var c = l.stateNode;
            l.flags & 32 && (va(c, ""), l.flags &= -33);
            var d = fs(e);
            Qu(e, d, c);
            break;
          case 3:
          case 4:
            var g = l.stateNode.containerInfo, z = fs(e);
            ds(
              e,
              z,
              g
            );
            break;
          default:
            throw Error(s(161));
        }
      } catch (C) {
        ye(e, e.return, C);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function sd(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        sd(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
  }
  function fl(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        ld(e, t.alternate, t), t = t.sibling;
  }
  function ia(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Ol(4, t, t.return), ia(t);
          break;
        case 1:
          $t(t, t.return);
          var l = t.stateNode;
          typeof l.componentWillUnmount == "function" && Ff(
            t,
            t.return,
            l
          ), ia(t);
          break;
        case 27:
          Bn(t.stateNode);
        case 26:
        case 5:
          $t(t, t.return), ia(t);
          break;
        case 22:
          t.memoizedState === null && ia(t);
          break;
        case 30:
          ia(t);
          break;
        default:
          ia(t);
      }
      e = e.sibling;
    }
  }
  function dl(e, t, l) {
    for (l = l && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var a = t.alternate, n = e, u = t, c = u.flags;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          dl(
            n,
            u,
            l
          ), Nn(4, u);
          break;
        case 1:
          if (dl(
            n,
            u,
            l
          ), a = u, n = a.stateNode, typeof n.componentDidMount == "function")
            try {
              n.componentDidMount();
            } catch (z) {
              ye(a, a.return, z);
            }
          if (a = u, n = a.updateQueue, n !== null) {
            var d = a.stateNode;
            try {
              var g = n.shared.hiddenCallbacks;
              if (g !== null)
                for (n.shared.hiddenCallbacks = null, n = 0; n < g.length; n++)
                  Lo(g[n], d);
            } catch (z) {
              ye(a, a.return, z);
            }
          }
          l && c & 64 && Wf(u), An(u, u.return);
          break;
        case 27:
          ed(u);
        case 26:
        case 5:
          dl(
            n,
            u,
            l
          ), l && a === null && c & 4 && Pf(u), An(u, u.return);
          break;
        case 12:
          dl(
            n,
            u,
            l
          );
          break;
        case 31:
          dl(
            n,
            u,
            l
          ), l && c & 4 && ud(n, u);
          break;
        case 13:
          dl(
            n,
            u,
            l
          ), l && c & 4 && id(n, u);
          break;
        case 22:
          u.memoizedState === null && dl(
            n,
            u,
            l
          ), An(u, u.return);
          break;
        case 30:
          break;
        default:
          dl(
            n,
            u,
            l
          );
      }
      t = t.sibling;
    }
  }
  function ms(e, t) {
    var l = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== l && (e != null && e.refCount++, l != null && mn(l));
  }
  function ps(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && mn(e));
  }
  function Qt(e, t, l, a) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        rd(
          e,
          t,
          l,
          a
        ), t = t.sibling;
  }
  function rd(e, t, l, a) {
    var n = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Qt(
          e,
          t,
          l,
          a
        ), n & 2048 && Nn(9, t);
        break;
      case 1:
        Qt(
          e,
          t,
          l,
          a
        );
        break;
      case 3:
        Qt(
          e,
          t,
          l,
          a
        ), n & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && mn(e)));
        break;
      case 12:
        if (n & 2048) {
          Qt(
            e,
            t,
            l,
            a
          ), e = t.stateNode;
          try {
            var u = t.memoizedProps, c = u.id, d = u.onPostCommit;
            typeof d == "function" && d(
              c,
              t.alternate === null ? "mount" : "update",
              e.passiveEffectDuration,
              -0
            );
          } catch (g) {
            ye(t, t.return, g);
          }
        } else
          Qt(
            e,
            t,
            l,
            a
          );
        break;
      case 31:
        Qt(
          e,
          t,
          l,
          a
        );
        break;
      case 13:
        Qt(
          e,
          t,
          l,
          a
        );
        break;
      case 23:
        break;
      case 22:
        u = t.stateNode, c = t.alternate, t.memoizedState !== null ? u._visibility & 2 ? Qt(
          e,
          t,
          l,
          a
        ) : Rn(e, t) : u._visibility & 2 ? Qt(
          e,
          t,
          l,
          a
        ) : (u._visibility |= 2, wa(
          e,
          t,
          l,
          a,
          (t.subtreeFlags & 10256) !== 0 || !1
        )), n & 2048 && ms(c, t);
        break;
      case 24:
        Qt(
          e,
          t,
          l,
          a
        ), n & 2048 && ps(t.alternate, t);
        break;
      default:
        Qt(
          e,
          t,
          l,
          a
        );
    }
  }
  function wa(e, t, l, a, n) {
    for (n = n && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var u = e, c = t, d = l, g = a, z = c.flags;
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          wa(
            u,
            c,
            d,
            g,
            n
          ), Nn(8, c);
          break;
        case 23:
          break;
        case 22:
          var C = c.stateNode;
          c.memoizedState !== null ? C._visibility & 2 ? wa(
            u,
            c,
            d,
            g,
            n
          ) : Rn(
            u,
            c
          ) : (C._visibility |= 2, wa(
            u,
            c,
            d,
            g,
            n
          )), n && z & 2048 && ms(
            c.alternate,
            c
          );
          break;
        case 24:
          wa(
            u,
            c,
            d,
            g,
            n
          ), n && z & 2048 && ps(c.alternate, c);
          break;
        default:
          wa(
            u,
            c,
            d,
            g,
            n
          );
      }
      t = t.sibling;
    }
  }
  function Rn(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var l = e, a = t, n = a.flags;
        switch (a.tag) {
          case 22:
            Rn(l, a), n & 2048 && ms(
              a.alternate,
              a
            );
            break;
          case 24:
            Rn(l, a), n & 2048 && ps(a.alternate, a);
            break;
          default:
            Rn(l, a);
        }
        t = t.sibling;
      }
  }
  var On = 8192;
  function Ba(e, t, l) {
    if (e.subtreeFlags & On)
      for (e = e.child; e !== null; )
        od(
          e,
          t,
          l
        ), e = e.sibling;
  }
  function od(e, t, l) {
    switch (e.tag) {
      case 26:
        Ba(
          e,
          t,
          l
        ), e.flags & On && e.memoizedState !== null && Tv(
          l,
          Xt,
          e.memoizedState,
          e.memoizedProps
        );
        break;
      case 5:
        Ba(
          e,
          t,
          l
        );
        break;
      case 3:
      case 4:
        var a = Xt;
        Xt = ni(e.stateNode.containerInfo), Ba(
          e,
          t,
          l
        ), Xt = a;
        break;
      case 22:
        e.memoizedState === null && (a = e.alternate, a !== null && a.memoizedState !== null ? (a = On, On = 16777216, Ba(
          e,
          t,
          l
        ), On = a) : Ba(
          e,
          t,
          l
        ));
        break;
      default:
        Ba(
          e,
          t,
          l
        );
    }
  }
  function fd(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function Cn(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          Ve = a, hd(
            a,
            e
          );
        }
      fd(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        dd(e), e = e.sibling;
  }
  function dd(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        Cn(e), e.flags & 2048 && Ol(9, e, e.return);
        break;
      case 3:
        Cn(e);
        break;
      case 12:
        Cn(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Vu(e)) : Cn(e);
        break;
      default:
        Cn(e);
    }
  }
  function Vu(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          Ve = a, hd(
            a,
            e
          );
        }
      fd(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          Ol(8, t, t.return), Vu(t);
          break;
        case 22:
          l = t.stateNode, l._visibility & 2 && (l._visibility &= -3, Vu(t));
          break;
        default:
          Vu(t);
      }
      e = e.sibling;
    }
  }
  function hd(e, t) {
    for (; Ve !== null; ) {
      var l = Ve;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          Ol(8, l, t);
          break;
        case 23:
        case 22:
          if (l.memoizedState !== null && l.memoizedState.cachePool !== null) {
            var a = l.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          mn(l.memoizedState.cache);
      }
      if (a = l.child, a !== null) a.return = l, Ve = a;
      else
        e: for (l = e; Ve !== null; ) {
          a = Ve;
          var n = a.sibling, u = a.return;
          if (ad(a), a === l) {
            Ve = null;
            break e;
          }
          if (n !== null) {
            n.return = u, Ve = n;
            break e;
          }
          Ve = u;
        }
    }
  }
  var Yp = {
    getCacheForType: function(e) {
      var t = ke(qe), l = t.data.get(e);
      return l === void 0 && (l = e(), t.data.set(e, l)), l;
    },
    cacheSignal: function() {
      return ke(qe).controller.signal;
    }
  }, Gp = typeof WeakMap == "function" ? WeakMap : Map, me = 0, Ee = null, ne = null, ie = 0, ve = 0, bt = null, Cl = !1, La = !1, vs = !1, hl = 0, De = 0, Ml = 0, ca = 0, ys = 0, xt = 0, qa = 0, Mn = null, rt = null, gs = !1, Ku = 0, md = 0, Ju = 1 / 0, ku = null, Dl = null, Qe = 0, Ul = null, Ya = null, ml = 0, bs = 0, xs = null, pd = null, Dn = 0, Ss = null;
  function St() {
    return (me & 2) !== 0 && ie !== 0 ? ie & -ie : M.T !== null ? Ns() : Rr();
  }
  function vd() {
    if (xt === 0)
      if ((ie & 536870912) === 0 || se) {
        var e = lu;
        lu <<= 1, (lu & 3932160) === 0 && (lu = 262144), xt = e;
      } else xt = 536870912;
    return e = yt.current, e !== null && (e.flags |= 32), xt;
  }
  function ot(e, t, l) {
    (e === Ee && (ve === 2 || ve === 9) || e.cancelPendingCommit !== null) && (Ga(e, 0), Hl(
      e,
      ie,
      xt,
      !1
    )), Ia(e, l), ((me & 2) === 0 || e !== Ee) && (e === Ee && ((me & 2) === 0 && (ca |= l), De === 4 && Hl(
      e,
      ie,
      xt,
      !1
    )), Wt(e));
  }
  function yd(e, t, l) {
    if ((me & 6) !== 0) throw Error(s(327));
    var a = !l && (t & 127) === 0 && (t & e.expiredLanes) === 0 || Pa(e, t), n = a ? Zp(e, t) : Es(e, t, !0), u = a;
    do {
      if (n === 0) {
        La && !a && Hl(e, t, 0, !1);
        break;
      } else {
        if (l = e.current.alternate, u && !Xp(l)) {
          n = Es(e, t, !1), u = !1;
          continue;
        }
        if (n === 2) {
          if (u = t, e.errorRecoveryDisabledLanes & u)
            var c = 0;
          else
            c = e.pendingLanes & -536870913, c = c !== 0 ? c : c & 536870912 ? 536870912 : 0;
          if (c !== 0) {
            t = c;
            e: {
              var d = e;
              n = Mn;
              var g = d.current.memoizedState.isDehydrated;
              if (g && (Ga(d, c).flags |= 256), c = Es(
                d,
                c,
                !1
              ), c !== 2) {
                if (vs && !g) {
                  d.errorRecoveryDisabledLanes |= u, ca |= u, n = 4;
                  break e;
                }
                u = rt, rt = n, u !== null && (rt === null ? rt = u : rt.push.apply(
                  rt,
                  u
                ));
              }
              n = c;
            }
            if (u = !1, n !== 2) continue;
          }
        }
        if (n === 1) {
          Ga(e, 0), Hl(e, t, 0, !0);
          break;
        }
        e: {
          switch (a = e, u = n, u) {
            case 0:
            case 1:
              throw Error(s(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              Hl(
                a,
                t,
                xt,
                !Cl
              );
              break e;
            case 2:
              rt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(s(329));
          }
          if ((t & 62914560) === t && (n = Ku + 300 - dt(), 10 < n)) {
            if (Hl(
              a,
              t,
              xt,
              !Cl
            ), nu(a, 0, !0) !== 0) break e;
            ml = t, a.timeoutHandle = kd(
              gd.bind(
                null,
                a,
                l,
                rt,
                ku,
                gs,
                t,
                xt,
                ca,
                qa,
                Cl,
                u,
                "Throttled",
                -0,
                0
              ),
              n
            );
            break e;
          }
          gd(
            a,
            l,
            rt,
            ku,
            gs,
            t,
            xt,
            ca,
            qa,
            Cl,
            u,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Wt(e);
  }
  function gd(e, t, l, a, n, u, c, d, g, z, C, U, A, O) {
    if (e.timeoutHandle = -1, U = t.subtreeFlags, U & 8192 || (U & 16785408) === 16785408) {
      U = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: It
      }, od(
        t,
        u,
        U
      );
      var Q = (u & 62914560) === u ? Ku - dt() : (u & 4194048) === u ? md - dt() : 0;
      if (Q = zv(
        U,
        Q
      ), Q !== null) {
        ml = u, e.cancelPendingCommit = Q(
          zd.bind(
            null,
            e,
            t,
            u,
            l,
            a,
            n,
            c,
            d,
            g,
            C,
            U,
            null,
            A,
            O
          )
        ), Hl(e, u, c, !z);
        return;
      }
    }
    zd(
      e,
      t,
      u,
      l,
      a,
      n,
      c,
      d,
      g
    );
  }
  function Xp(e) {
    for (var t = e; ; ) {
      var l = t.tag;
      if ((l === 0 || l === 11 || l === 15) && t.flags & 16384 && (l = t.updateQueue, l !== null && (l = l.stores, l !== null)))
        for (var a = 0; a < l.length; a++) {
          var n = l[a], u = n.getSnapshot;
          n = n.value;
          try {
            if (!pt(u(), n)) return !1;
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
    t &= ~ys, t &= ~ca, e.suspendedLanes |= t, e.pingedLanes &= ~t, a && (e.warmLanes |= t), a = e.expirationTimes;
    for (var n = t; 0 < n; ) {
      var u = 31 - mt(n), c = 1 << u;
      a[u] = -1, n &= ~c;
    }
    l !== 0 && zr(e, l, t);
  }
  function $u() {
    return (me & 6) === 0 ? (Un(0), !1) : !0;
  }
  function _s() {
    if (ne !== null) {
      if (ve === 0)
        var e = ne.return;
      else
        e = ne, al = Pl = null, Lc(e), Ca = null, vn = 0, e = ne;
      for (; e !== null; )
        $f(e.alternate, e), e = e.return;
      ne = null;
    }
  }
  function Ga(e, t) {
    var l = e.timeoutHandle;
    l !== -1 && (e.timeoutHandle = -1, sv(l)), l = e.cancelPendingCommit, l !== null && (e.cancelPendingCommit = null, l()), ml = 0, _s(), Ee = e, ne = l = tl(e.current, null), ie = t, ve = 0, bt = null, Cl = !1, La = Pa(e, t), vs = !1, qa = xt = ys = ca = Ml = De = 0, rt = Mn = null, gs = !1, (t & 8) !== 0 && (t |= t & 32);
    var a = e.entangledLanes;
    if (a !== 0)
      for (e = e.entanglements, a &= t; 0 < a; ) {
        var n = 31 - mt(a), u = 1 << n;
        t |= e[n], a &= ~u;
      }
    return hl = t, vu(), l;
  }
  function bd(e, t) {
    ee = null, M.H = jn, t === Oa || t === ju ? (t = Uo(), ve = 3) : t === zc ? (t = Uo(), ve = 4) : ve = t === es ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, bt = t, ne === null && (De = 1, Lu(
      e,
      Rt(t, e.current)
    ));
  }
  function xd() {
    var e = yt.current;
    return e === null ? !0 : (ie & 4194048) === ie ? Dt === null : (ie & 62914560) === ie || (ie & 536870912) !== 0 ? e === Dt : !1;
  }
  function Sd() {
    var e = M.H;
    return M.H = jn, e === null ? jn : e;
  }
  function _d() {
    var e = M.A;
    return M.A = Yp, e;
  }
  function Wu() {
    De = 4, Cl || (ie & 4194048) !== ie && yt.current !== null || (La = !0), (Ml & 134217727) === 0 && (ca & 134217727) === 0 || Ee === null || Hl(
      Ee,
      ie,
      xt,
      !1
    );
  }
  function Es(e, t, l) {
    var a = me;
    me |= 2;
    var n = Sd(), u = _d();
    (Ee !== e || ie !== t) && (ku = null, Ga(e, t)), t = !1;
    var c = De;
    e: do
      try {
        if (ve !== 0 && ne !== null) {
          var d = ne, g = bt;
          switch (ve) {
            case 8:
              _s(), c = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              yt.current === null && (t = !0);
              var z = ve;
              if (ve = 0, bt = null, Xa(e, d, g, z), l && La) {
                c = 0;
                break e;
              }
              break;
            default:
              z = ve, ve = 0, bt = null, Xa(e, d, g, z);
          }
        }
        Qp(), c = De;
        break;
      } catch (C) {
        bd(e, C);
      }
    while (!0);
    return t && e.shellSuspendCounter++, al = Pl = null, me = a, M.H = n, M.A = u, ne === null && (Ee = null, ie = 0, vu()), c;
  }
  function Qp() {
    for (; ne !== null; ) Ed(ne);
  }
  function Zp(e, t) {
    var l = me;
    me |= 2;
    var a = Sd(), n = _d();
    Ee !== e || ie !== t ? (ku = null, Ju = dt() + 500, Ga(e, t)) : La = Pa(
      e,
      t
    );
    e: do
      try {
        if (ve !== 0 && ne !== null) {
          t = ne;
          var u = bt;
          t: switch (ve) {
            case 1:
              ve = 0, bt = null, Xa(e, t, u, 1);
              break;
            case 2:
            case 9:
              if (Mo(u)) {
                ve = 0, bt = null, jd(t);
                break;
              }
              t = function() {
                ve !== 2 && ve !== 9 || Ee !== e || (ve = 7), Wt(e);
              }, u.then(t, t);
              break e;
            case 3:
              ve = 7;
              break e;
            case 4:
              ve = 5;
              break e;
            case 7:
              Mo(u) ? (ve = 0, bt = null, jd(t)) : (ve = 0, bt = null, Xa(e, t, u, 7));
              break;
            case 5:
              var c = null;
              switch (ne.tag) {
                case 26:
                  c = ne.memoizedState;
                case 5:
                case 27:
                  var d = ne;
                  if (c ? rh(c) : d.stateNode.complete) {
                    ve = 0, bt = null;
                    var g = d.sibling;
                    if (g !== null) ne = g;
                    else {
                      var z = d.return;
                      z !== null ? (ne = z, Fu(z)) : ne = null;
                    }
                    break t;
                  }
              }
              ve = 0, bt = null, Xa(e, t, u, 5);
              break;
            case 6:
              ve = 0, bt = null, Xa(e, t, u, 6);
              break;
            case 8:
              _s(), De = 6;
              break e;
            default:
              throw Error(s(462));
          }
        }
        Vp();
        break;
      } catch (C) {
        bd(e, C);
      }
    while (!0);
    return al = Pl = null, M.H = a, M.A = n, me = l, ne !== null ? 0 : (Ee = null, ie = 0, vu(), De);
  }
  function Vp() {
    for (; ne !== null && !mm(); )
      Ed(ne);
  }
  function Ed(e) {
    var t = Jf(e.alternate, e, hl);
    e.memoizedProps = e.pendingProps, t === null ? Fu(e) : ne = t;
  }
  function jd(e) {
    var t = e, l = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = Gf(
          l,
          t,
          t.pendingProps,
          t.type,
          void 0,
          ie
        );
        break;
      case 11:
        t = Gf(
          l,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          ie
        );
        break;
      case 5:
        Lc(t);
      default:
        $f(l, t), t = ne = So(t, hl), t = Jf(l, t, hl);
    }
    e.memoizedProps = e.pendingProps, t === null ? Fu(e) : ne = t;
  }
  function Xa(e, t, l, a) {
    al = Pl = null, Lc(t), Ca = null, vn = 0;
    var n = t.return;
    try {
      if (Dp(
        e,
        n,
        t,
        l,
        ie
      )) {
        De = 1, Lu(
          e,
          Rt(l, e.current)
        ), ne = null;
        return;
      }
    } catch (u) {
      if (n !== null) throw ne = n, u;
      De = 1, Lu(
        e,
        Rt(l, e.current)
      ), ne = null;
      return;
    }
    t.flags & 32768 ? (se || a === 1 ? e = !0 : La || (ie & 536870912) !== 0 ? e = !1 : (Cl = e = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = yt.current, a !== null && a.tag === 13 && (a.flags |= 16384))), Td(t, e)) : Fu(t);
  }
  function Fu(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        Td(
          t,
          Cl
        );
        return;
      }
      e = t.return;
      var l = wp(
        t.alternate,
        t,
        hl
      );
      if (l !== null) {
        ne = l;
        return;
      }
      if (t = t.sibling, t !== null) {
        ne = t;
        return;
      }
      ne = t = e;
    } while (t !== null);
    De === 0 && (De = 5);
  }
  function Td(e, t) {
    do {
      var l = Bp(e.alternate, e);
      if (l !== null) {
        l.flags &= 32767, ne = l;
        return;
      }
      if (l = e.return, l !== null && (l.flags |= 32768, l.subtreeFlags = 0, l.deletions = null), !t && (e = e.sibling, e !== null)) {
        ne = e;
        return;
      }
      ne = e = l;
    } while (e !== null);
    De = 6, ne = null;
  }
  function zd(e, t, l, a, n, u, c, d, g) {
    e.cancelPendingCommit = null;
    do
      Pu();
    while (Qe !== 0);
    if ((me & 6) !== 0) throw Error(s(327));
    if (t !== null) {
      if (t === e.current) throw Error(s(177));
      if (u = t.lanes | t.childLanes, u |= fc, jm(
        e,
        l,
        u,
        c,
        d,
        g
      ), e === Ee && (ne = Ee = null, ie = 0), Ya = t, Ul = e, ml = l, bs = u, xs = n, pd = a, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, $p(eu, function() {
        return Cd(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
        a = M.T, M.T = null, n = Y.p, Y.p = 2, c = me, me |= 4;
        try {
          Lp(e, t, l);
        } finally {
          me = c, Y.p = n, M.T = a;
        }
      }
      Qe = 1, Nd(), Ad(), Rd();
    }
  }
  function Nd() {
    if (Qe === 1) {
      Qe = 0;
      var e = Ul, t = Ya, l = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || l) {
        l = M.T, M.T = null;
        var a = Y.p;
        Y.p = 2;
        var n = me;
        me |= 4;
        try {
          cd(t, e);
          var u = Hs, c = fo(e.containerInfo), d = u.focusedElem, g = u.selectionRange;
          if (c !== d && d && d.ownerDocument && oo(
            d.ownerDocument.documentElement,
            d
          )) {
            if (g !== null && ic(d)) {
              var z = g.start, C = g.end;
              if (C === void 0 && (C = z), "selectionStart" in d)
                d.selectionStart = z, d.selectionEnd = Math.min(
                  C,
                  d.value.length
                );
              else {
                var U = d.ownerDocument || document, A = U && U.defaultView || window;
                if (A.getSelection) {
                  var O = A.getSelection(), Q = d.textContent.length, $ = Math.min(g.start, Q), Se = g.end === void 0 ? $ : Math.min(g.end, Q);
                  !O.extend && $ > Se && (c = Se, Se = $, $ = c);
                  var _ = ro(
                    d,
                    $
                  ), x = ro(
                    d,
                    Se
                  );
                  if (_ && x && (O.rangeCount !== 1 || O.anchorNode !== _.node || O.anchorOffset !== _.offset || O.focusNode !== x.node || O.focusOffset !== x.offset)) {
                    var T = U.createRange();
                    T.setStart(_.node, _.offset), O.removeAllRanges(), $ > Se ? (O.addRange(T), O.extend(x.node, x.offset)) : (T.setEnd(x.node, x.offset), O.addRange(T));
                  }
                }
              }
            }
            for (U = [], O = d; O = O.parentNode; )
              O.nodeType === 1 && U.push({
                element: O,
                left: O.scrollLeft,
                top: O.scrollTop
              });
            for (typeof d.focus == "function" && d.focus(), d = 0; d < U.length; d++) {
              var D = U[d];
              D.element.scrollLeft = D.left, D.element.scrollTop = D.top;
            }
          }
          oi = !!Us, Hs = Us = null;
        } finally {
          me = n, Y.p = a, M.T = l;
        }
      }
      e.current = t, Qe = 2;
    }
  }
  function Ad() {
    if (Qe === 2) {
      Qe = 0;
      var e = Ul, t = Ya, l = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || l) {
        l = M.T, M.T = null;
        var a = Y.p;
        Y.p = 2;
        var n = me;
        me |= 4;
        try {
          ld(e, t.alternate, t);
        } finally {
          me = n, Y.p = a, M.T = l;
        }
      }
      Qe = 3;
    }
  }
  function Rd() {
    if (Qe === 4 || Qe === 3) {
      Qe = 0, pm();
      var e = Ul, t = Ya, l = ml, a = pd;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? Qe = 5 : (Qe = 0, Ya = Ul = null, Od(e, e.pendingLanes));
      var n = e.pendingLanes;
      if (n === 0 && (Dl = null), Gi(l), t = t.stateNode, ht && typeof ht.onCommitFiberRoot == "function")
        try {
          ht.onCommitFiberRoot(
            Fa,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (a !== null) {
        t = M.T, n = Y.p, Y.p = 2, M.T = null;
        try {
          for (var u = e.onRecoverableError, c = 0; c < a.length; c++) {
            var d = a[c];
            u(d.value, {
              componentStack: d.stack
            });
          }
        } finally {
          M.T = t, Y.p = n;
        }
      }
      (ml & 3) !== 0 && Pu(), Wt(e), n = e.pendingLanes, (l & 261930) !== 0 && (n & 42) !== 0 ? e === Ss ? Dn++ : (Dn = 0, Ss = e) : Dn = 0, Un(0);
    }
  }
  function Od(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, mn(t)));
  }
  function Pu() {
    return Nd(), Ad(), Rd(), Cd();
  }
  function Cd() {
    if (Qe !== 5) return !1;
    var e = Ul, t = bs;
    bs = 0;
    var l = Gi(ml), a = M.T, n = Y.p;
    try {
      Y.p = 32 > l ? 32 : l, M.T = null, l = xs, xs = null;
      var u = Ul, c = ml;
      if (Qe = 0, Ya = Ul = null, ml = 0, (me & 6) !== 0) throw Error(s(331));
      var d = me;
      if (me |= 4, dd(u.current), rd(
        u,
        u.current,
        c,
        l
      ), me = d, Un(0, !1), ht && typeof ht.onPostCommitFiberRoot == "function")
        try {
          ht.onPostCommitFiberRoot(Fa, u);
        } catch {
        }
      return !0;
    } finally {
      Y.p = n, M.T = a, Od(e, t);
    }
  }
  function Md(e, t, l) {
    t = Rt(l, t), t = Ic(e.stateNode, t, 2), e = Nl(e, t, 2), e !== null && (Ia(e, 2), Wt(e));
  }
  function ye(e, t, l) {
    if (e.tag === 3)
      Md(e, e, l);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Md(
            t,
            e,
            l
          );
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (Dl === null || !Dl.has(a))) {
            e = Rt(l, e), l = Df(2), a = Nl(t, l, 2), a !== null && (Uf(
              l,
              a,
              t,
              e
            ), Ia(a, 2), Wt(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function js(e, t, l) {
    var a = e.pingCache;
    if (a === null) {
      a = e.pingCache = new Gp();
      var n = /* @__PURE__ */ new Set();
      a.set(t, n);
    } else
      n = a.get(t), n === void 0 && (n = /* @__PURE__ */ new Set(), a.set(t, n));
    n.has(l) || (vs = !0, n.add(l), e = Kp.bind(null, e, t, l), t.then(e, e));
  }
  function Kp(e, t, l) {
    var a = e.pingCache;
    a !== null && a.delete(t), e.pingedLanes |= e.suspendedLanes & l, e.warmLanes &= ~l, Ee === e && (ie & l) === l && (De === 4 || De === 3 && (ie & 62914560) === ie && 300 > dt() - Ku ? (me & 2) === 0 && Ga(e, 0) : ys |= l, qa === ie && (qa = 0)), Wt(e);
  }
  function Dd(e, t) {
    t === 0 && (t = Tr()), e = $l(e, t), e !== null && (Ia(e, t), Wt(e));
  }
  function Jp(e) {
    var t = e.memoizedState, l = 0;
    t !== null && (l = t.retryLane), Dd(e, l);
  }
  function kp(e, t) {
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
        throw Error(s(314));
    }
    a !== null && a.delete(t), Dd(e, l);
  }
  function $p(e, t) {
    return Bi(e, t);
  }
  var Iu = null, Qa = null, Ts = !1, ei = !1, zs = !1, wl = 0;
  function Wt(e) {
    e !== Qa && e.next === null && (Qa === null ? Iu = Qa = e : Qa = Qa.next = e), ei = !0, Ts || (Ts = !0, Fp());
  }
  function Un(e, t) {
    if (!zs && ei) {
      zs = !0;
      do
        for (var l = !1, a = Iu; a !== null; ) {
          if (e !== 0) {
            var n = a.pendingLanes;
            if (n === 0) var u = 0;
            else {
              var c = a.suspendedLanes, d = a.pingedLanes;
              u = (1 << 31 - mt(42 | e) + 1) - 1, u &= n & ~(c & ~d), u = u & 201326741 ? u & 201326741 | 1 : u ? u | 2 : 0;
            }
            u !== 0 && (l = !0, Bd(a, u));
          } else
            u = ie, u = nu(
              a,
              a === Ee ? u : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (u & 3) === 0 || Pa(a, u) || (l = !0, Bd(a, u));
          a = a.next;
        }
      while (l);
      zs = !1;
    }
  }
  function Wp() {
    Ud();
  }
  function Ud() {
    ei = Ts = !1;
    var e = 0;
    wl !== 0 && cv() && (e = wl);
    for (var t = dt(), l = null, a = Iu; a !== null; ) {
      var n = a.next, u = Hd(a, t);
      u === 0 ? (a.next = null, l === null ? Iu = n : l.next = n, n === null && (Qa = l)) : (l = a, (e !== 0 || (u & 3) !== 0) && (ei = !0)), a = n;
    }
    Qe !== 0 && Qe !== 5 || Un(e), wl !== 0 && (wl = 0);
  }
  function Hd(e, t) {
    for (var l = e.suspendedLanes, a = e.pingedLanes, n = e.expirationTimes, u = e.pendingLanes & -62914561; 0 < u; ) {
      var c = 31 - mt(u), d = 1 << c, g = n[c];
      g === -1 ? ((d & l) === 0 || (d & a) !== 0) && (n[c] = Em(d, t)) : g <= t && (e.expiredLanes |= d), u &= ~d;
    }
    if (t = Ee, l = ie, l = nu(
      e,
      e === t ? l : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a = e.callbackNode, l === 0 || e === t && (ve === 2 || ve === 9) || e.cancelPendingCommit !== null)
      return a !== null && a !== null && Li(a), e.callbackNode = null, e.callbackPriority = 0;
    if ((l & 3) === 0 || Pa(e, l)) {
      if (t = l & -l, t === e.callbackPriority) return t;
      switch (a !== null && Li(a), Gi(l)) {
        case 2:
        case 8:
          l = Er;
          break;
        case 32:
          l = eu;
          break;
        case 268435456:
          l = jr;
          break;
        default:
          l = eu;
      }
      return a = wd.bind(null, e), l = Bi(l, a), e.callbackPriority = t, e.callbackNode = l, t;
    }
    return a !== null && a !== null && Li(a), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function wd(e, t) {
    if (Qe !== 0 && Qe !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var l = e.callbackNode;
    if (Pu() && e.callbackNode !== l)
      return null;
    var a = ie;
    return a = nu(
      e,
      e === Ee ? a : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a === 0 ? null : (yd(e, a, t), Hd(e, dt()), e.callbackNode != null && e.callbackNode === l ? wd.bind(null, e) : null);
  }
  function Bd(e, t) {
    if (Pu()) return null;
    yd(e, t, !0);
  }
  function Fp() {
    rv(function() {
      (me & 6) !== 0 ? Bi(
        _r,
        Wp
      ) : Ud();
    });
  }
  function Ns() {
    if (wl === 0) {
      var e = Aa;
      e === 0 && (e = tu, tu <<= 1, (tu & 261888) === 0 && (tu = 256)), wl = e;
    }
    return wl;
  }
  function Ld(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : su("" + e);
  }
  function qd(e, t) {
    var l = t.ownerDocument.createElement("input");
    return l.name = t.name, l.value = t.value, e.id && l.setAttribute("form", e.id), t.parentNode.insertBefore(l, t), e = new FormData(e), l.parentNode.removeChild(l), e;
  }
  function Pp(e, t, l, a, n) {
    if (t === "submit" && l && l.stateNode === n) {
      var u = Ld(
        (n[nt] || null).action
      ), c = a.submitter;
      c && (t = (t = c[nt] || null) ? Ld(t.formAction) : c.getAttribute("formAction"), t !== null && (u = t, c = null));
      var d = new du(
        "action",
        "action",
        null,
        a,
        n
      );
      e.push({
        event: d,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (wl !== 0) {
                  var g = c ? qd(n, c) : new FormData(n);
                  Jc(
                    l,
                    {
                      pending: !0,
                      data: g,
                      method: n.method,
                      action: u
                    },
                    null,
                    g
                  );
                }
              } else
                typeof u == "function" && (d.preventDefault(), g = c ? qd(n, c) : new FormData(n), Jc(
                  l,
                  {
                    pending: !0,
                    data: g,
                    method: n.method,
                    action: u
                  },
                  u,
                  g
                ));
            },
            currentTarget: n
          }
        ]
      });
    }
  }
  for (var As = 0; As < oc.length; As++) {
    var Rs = oc[As], Ip = Rs.toLowerCase(), ev = Rs[0].toUpperCase() + Rs.slice(1);
    Gt(
      Ip,
      "on" + ev
    );
  }
  Gt(po, "onAnimationEnd"), Gt(vo, "onAnimationIteration"), Gt(yo, "onAnimationStart"), Gt("dblclick", "onDoubleClick"), Gt("focusin", "onFocus"), Gt("focusout", "onBlur"), Gt(vp, "onTransitionRun"), Gt(yp, "onTransitionStart"), Gt(gp, "onTransitionCancel"), Gt(go, "onTransitionEnd"), ma("onMouseEnter", ["mouseout", "mouseover"]), ma("onMouseLeave", ["mouseout", "mouseover"]), ma("onPointerEnter", ["pointerout", "pointerover"]), ma("onPointerLeave", ["pointerout", "pointerover"]), Vl(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), Vl(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), Vl("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), Vl(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), Vl(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), Vl(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var Hn = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), tv = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Hn)
  );
  function Yd(e, t) {
    t = (t & 4) !== 0;
    for (var l = 0; l < e.length; l++) {
      var a = e[l], n = a.event;
      a = a.listeners;
      e: {
        var u = void 0;
        if (t)
          for (var c = a.length - 1; 0 <= c; c--) {
            var d = a[c], g = d.instance, z = d.currentTarget;
            if (d = d.listener, g !== u && n.isPropagationStopped())
              break e;
            u = d, n.currentTarget = z;
            try {
              u(n);
            } catch (C) {
              pu(C);
            }
            n.currentTarget = null, u = g;
          }
        else
          for (c = 0; c < a.length; c++) {
            if (d = a[c], g = d.instance, z = d.currentTarget, d = d.listener, g !== u && n.isPropagationStopped())
              break e;
            u = d, n.currentTarget = z;
            try {
              u(n);
            } catch (C) {
              pu(C);
            }
            n.currentTarget = null, u = g;
          }
      }
    }
  }
  function ue(e, t) {
    var l = t[Xi];
    l === void 0 && (l = t[Xi] = /* @__PURE__ */ new Set());
    var a = e + "__bubble";
    l.has(a) || (Gd(t, e, 2, !1), l.add(a));
  }
  function Os(e, t, l) {
    var a = 0;
    t && (a |= 4), Gd(
      l,
      e,
      a,
      t
    );
  }
  var ti = "_reactListening" + Math.random().toString(36).slice(2);
  function Cs(e) {
    if (!e[ti]) {
      e[ti] = !0, Mr.forEach(function(l) {
        l !== "selectionchange" && (tv.has(l) || Os(l, !1, e), Os(l, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[ti] || (t[ti] = !0, Os("selectionchange", !1, t));
    }
  }
  function Gd(e, t, l, a) {
    switch (vh(t)) {
      case 2:
        var n = Rv;
        break;
      case 8:
        n = Ov;
        break;
      default:
        n = Ks;
    }
    l = n.bind(
      null,
      t,
      l,
      e
    ), n = void 0, !Fi || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (n = !0), a ? n !== void 0 ? e.addEventListener(t, l, {
      capture: !0,
      passive: n
    }) : e.addEventListener(t, l, !0) : n !== void 0 ? e.addEventListener(t, l, {
      passive: n
    }) : e.addEventListener(t, l, !1);
  }
  function Ms(e, t, l, a, n) {
    var u = a;
    if ((t & 1) === 0 && (t & 2) === 0 && a !== null)
      e: for (; ; ) {
        if (a === null) return;
        var c = a.tag;
        if (c === 3 || c === 4) {
          var d = a.stateNode.containerInfo;
          if (d === n) break;
          if (c === 4)
            for (c = a.return; c !== null; ) {
              var g = c.tag;
              if ((g === 3 || g === 4) && c.stateNode.containerInfo === n)
                return;
              c = c.return;
            }
          for (; d !== null; ) {
            if (c = fa(d), c === null) return;
            if (g = c.tag, g === 5 || g === 6 || g === 26 || g === 27) {
              a = u = c;
              continue e;
            }
            d = d.parentNode;
          }
        }
        a = a.return;
      }
    Zr(function() {
      var z = u, C = $i(l), U = [];
      e: {
        var A = bo.get(e);
        if (A !== void 0) {
          var O = du, Q = e;
          switch (e) {
            case "keypress":
              if (ou(l) === 0) break e;
            case "keydown":
            case "keyup":
              O = km;
              break;
            case "focusin":
              Q = "focus", O = tc;
              break;
            case "focusout":
              Q = "blur", O = tc;
              break;
            case "beforeblur":
            case "afterblur":
              O = tc;
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
              O = Jr;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              O = wm;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              O = Fm;
              break;
            case po:
            case vo:
            case yo:
              O = qm;
              break;
            case go:
              O = Im;
              break;
            case "scroll":
            case "scrollend":
              O = Um;
              break;
            case "wheel":
              O = tp;
              break;
            case "copy":
            case "cut":
            case "paste":
              O = Gm;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              O = $r;
              break;
            case "toggle":
            case "beforetoggle":
              O = ap;
          }
          var $ = (t & 4) !== 0, Se = !$ && (e === "scroll" || e === "scrollend"), _ = $ ? A !== null ? A + "Capture" : null : A;
          $ = [];
          for (var x = z, T; x !== null; ) {
            var D = x;
            if (T = D.stateNode, D = D.tag, D !== 5 && D !== 26 && D !== 27 || T === null || _ === null || (D = ln(x, _), D != null && $.push(
              wn(x, D, T)
            )), Se) break;
            x = x.return;
          }
          0 < $.length && (A = new O(
            A,
            Q,
            null,
            l,
            C
          ), U.push({ event: A, listeners: $ }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (A = e === "mouseover" || e === "pointerover", O = e === "mouseout" || e === "pointerout", A && l !== ki && (Q = l.relatedTarget || l.fromElement) && (fa(Q) || Q[oa]))
            break e;
          if ((O || A) && (A = C.window === C ? C : (A = C.ownerDocument) ? A.defaultView || A.parentWindow : window, O ? (Q = l.relatedTarget || l.toElement, O = z, Q = Q ? fa(Q) : null, Q !== null && (Se = m(Q), $ = Q.tag, Q !== Se || $ !== 5 && $ !== 27 && $ !== 6) && (Q = null)) : (O = null, Q = z), O !== Q)) {
            if ($ = Jr, D = "onMouseLeave", _ = "onMouseEnter", x = "mouse", (e === "pointerout" || e === "pointerover") && ($ = $r, D = "onPointerLeave", _ = "onPointerEnter", x = "pointer"), Se = O == null ? A : tn(O), T = Q == null ? A : tn(Q), A = new $(
              D,
              x + "leave",
              O,
              l,
              C
            ), A.target = Se, A.relatedTarget = T, D = null, fa(C) === z && ($ = new $(
              _,
              x + "enter",
              Q,
              l,
              C
            ), $.target = T, $.relatedTarget = Se, D = $), Se = D, O && Q)
              t: {
                for ($ = lv, _ = O, x = Q, T = 0, D = _; D; D = $(D))
                  T++;
                D = 0;
                for (var J = x; J; J = $(J))
                  D++;
                for (; 0 < T - D; )
                  _ = $(_), T--;
                for (; 0 < D - T; )
                  x = $(x), D--;
                for (; T--; ) {
                  if (_ === x || x !== null && _ === x.alternate) {
                    $ = _;
                    break t;
                  }
                  _ = $(_), x = $(x);
                }
                $ = null;
              }
            else $ = null;
            O !== null && Xd(
              U,
              A,
              O,
              $,
              !1
            ), Q !== null && Se !== null && Xd(
              U,
              Se,
              Q,
              $,
              !0
            );
          }
        }
        e: {
          if (A = z ? tn(z) : window, O = A.nodeName && A.nodeName.toLowerCase(), O === "select" || O === "input" && A.type === "file")
            var de = ao;
          else if (to(A))
            if (no)
              de = hp;
            else {
              de = fp;
              var K = op;
            }
          else
            O = A.nodeName, !O || O.toLowerCase() !== "input" || A.type !== "checkbox" && A.type !== "radio" ? z && Ji(z.elementType) && (de = ao) : de = dp;
          if (de && (de = de(e, z))) {
            lo(
              U,
              de,
              l,
              C
            );
            break e;
          }
          K && K(e, A, z), e === "focusout" && z && A.type === "number" && z.memoizedProps.value != null && Ki(A, "number", A.value);
        }
        switch (K = z ? tn(z) : window, e) {
          case "focusin":
            (to(K) || K.contentEditable === "true") && (xa = K, cc = z, fn = null);
            break;
          case "focusout":
            fn = cc = xa = null;
            break;
          case "mousedown":
            sc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            sc = !1, ho(U, l, C);
            break;
          case "selectionchange":
            if (pp) break;
          case "keydown":
          case "keyup":
            ho(U, l, C);
        }
        var te;
        if (ac)
          e: {
            switch (e) {
              case "compositionstart":
                var ce = "onCompositionStart";
                break e;
              case "compositionend":
                ce = "onCompositionEnd";
                break e;
              case "compositionupdate":
                ce = "onCompositionUpdate";
                break e;
            }
            ce = void 0;
          }
        else
          ba ? Ir(e, l) && (ce = "onCompositionEnd") : e === "keydown" && l.keyCode === 229 && (ce = "onCompositionStart");
        ce && (Wr && l.locale !== "ko" && (ba || ce !== "onCompositionStart" ? ce === "onCompositionEnd" && ba && (te = Vr()) : (xl = C, Pi = "value" in xl ? xl.value : xl.textContent, ba = !0)), K = li(z, ce), 0 < K.length && (ce = new kr(
          ce,
          e,
          null,
          l,
          C
        ), U.push({ event: ce, listeners: K }), te ? ce.data = te : (te = eo(l), te !== null && (ce.data = te)))), (te = up ? ip(e, l) : cp(e, l)) && (ce = li(z, "onBeforeInput"), 0 < ce.length && (K = new kr(
          "onBeforeInput",
          "beforeinput",
          null,
          l,
          C
        ), U.push({
          event: K,
          listeners: ce
        }), K.data = te)), Pp(
          U,
          e,
          z,
          l,
          C
        );
      }
      Yd(U, t);
    });
  }
  function wn(e, t, l) {
    return {
      instance: e,
      listener: t,
      currentTarget: l
    };
  }
  function li(e, t) {
    for (var l = t + "Capture", a = []; e !== null; ) {
      var n = e, u = n.stateNode;
      if (n = n.tag, n !== 5 && n !== 26 && n !== 27 || u === null || (n = ln(e, l), n != null && a.unshift(
        wn(e, n, u)
      ), n = ln(e, t), n != null && a.push(
        wn(e, n, u)
      )), e.tag === 3) return a;
      e = e.return;
    }
    return [];
  }
  function lv(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function Xd(e, t, l, a, n) {
    for (var u = t._reactName, c = []; l !== null && l !== a; ) {
      var d = l, g = d.alternate, z = d.stateNode;
      if (d = d.tag, g !== null && g === a) break;
      d !== 5 && d !== 26 && d !== 27 || z === null || (g = z, n ? (z = ln(l, u), z != null && c.unshift(
        wn(l, z, g)
      )) : n || (z = ln(l, u), z != null && c.push(
        wn(l, z, g)
      ))), l = l.return;
    }
    c.length !== 0 && e.push({ event: t, listeners: c });
  }
  var av = /\r\n?/g, nv = /\u0000|\uFFFD/g;
  function Qd(e) {
    return (typeof e == "string" ? e : "" + e).replace(av, `
`).replace(nv, "");
  }
  function Zd(e, t) {
    return t = Qd(t), Qd(e) === t;
  }
  function xe(e, t, l, a, n, u) {
    switch (l) {
      case "children":
        typeof a == "string" ? t === "body" || t === "textarea" && a === "" || va(e, a) : (typeof a == "number" || typeof a == "bigint") && t !== "body" && va(e, "" + a);
        break;
      case "className":
        iu(e, "class", a);
        break;
      case "tabIndex":
        iu(e, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        iu(e, l, a);
        break;
      case "style":
        Xr(e, a, u);
        break;
      case "data":
        if (t !== "object") {
          iu(e, "data", a);
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
        a = su("" + a), e.setAttribute(l, a);
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
          typeof u == "function" && (l === "formAction" ? (t !== "input" && xe(e, t, "name", n.name, n, null), xe(
            e,
            t,
            "formEncType",
            n.formEncType,
            n,
            null
          ), xe(
            e,
            t,
            "formMethod",
            n.formMethod,
            n,
            null
          ), xe(
            e,
            t,
            "formTarget",
            n.formTarget,
            n,
            null
          )) : (xe(e, t, "encType", n.encType, n, null), xe(e, t, "method", n.method, n, null), xe(e, t, "target", n.target, n, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(l);
          break;
        }
        a = su("" + a), e.setAttribute(l, a);
        break;
      case "onClick":
        a != null && (e.onclick = It);
        break;
      case "onScroll":
        a != null && ue("scroll", e);
        break;
      case "onScrollEnd":
        a != null && ue("scrollend", e);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(s(61));
          if (l = a.__html, l != null) {
            if (n.children != null) throw Error(s(60));
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
        l = su("" + a), e.setAttributeNS(
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
        ue("beforetoggle", e), ue("toggle", e), uu(e, "popover", a);
        break;
      case "xlinkActuate":
        Pt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        Pt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        Pt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        Pt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        Pt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        Pt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        Pt(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        Pt(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        Pt(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        uu(e, "is", a);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < l.length) || l[0] !== "o" && l[0] !== "O" || l[1] !== "n" && l[1] !== "N") && (l = Mm.get(l) || l, uu(e, l, a));
    }
  }
  function Ds(e, t, l, a, n, u) {
    switch (l) {
      case "style":
        Xr(e, a, u);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(s(61));
          if (l = a.__html, l != null) {
            if (n.children != null) throw Error(s(60));
            e.innerHTML = l;
          }
        }
        break;
      case "children":
        typeof a == "string" ? va(e, a) : (typeof a == "number" || typeof a == "bigint") && va(e, "" + a);
        break;
      case "onScroll":
        a != null && ue("scroll", e);
        break;
      case "onScrollEnd":
        a != null && ue("scrollend", e);
        break;
      case "onClick":
        a != null && (e.onclick = It);
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
        if (!Dr.hasOwnProperty(l))
          e: {
            if (l[0] === "o" && l[1] === "n" && (n = l.endsWith("Capture"), t = l.slice(2, n ? l.length - 7 : void 0), u = e[nt] || null, u = u != null ? u[l] : null, typeof u == "function" && e.removeEventListener(t, u, n), typeof a == "function")) {
              typeof u != "function" && u !== null && (l in e ? e[l] = null : e.hasAttribute(l) && e.removeAttribute(l)), e.addEventListener(t, a, n);
              break e;
            }
            l in e ? e[l] = a : a === !0 ? e.setAttribute(l, "") : uu(e, l, a);
          }
    }
  }
  function We(e, t, l) {
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
        ue("error", e), ue("load", e);
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
                  throw Error(s(137, t));
                default:
                  xe(e, t, u, c, l, null);
              }
          }
        n && xe(e, t, "srcSet", l.srcSet, l, null), a && xe(e, t, "src", l.src, l, null);
        return;
      case "input":
        ue("invalid", e);
        var d = u = c = n = null, g = null, z = null;
        for (a in l)
          if (l.hasOwnProperty(a)) {
            var C = l[a];
            if (C != null)
              switch (a) {
                case "name":
                  n = C;
                  break;
                case "type":
                  c = C;
                  break;
                case "checked":
                  g = C;
                  break;
                case "defaultChecked":
                  z = C;
                  break;
                case "value":
                  u = C;
                  break;
                case "defaultValue":
                  d = C;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (C != null)
                    throw Error(s(137, t));
                  break;
                default:
                  xe(e, t, a, C, l, null);
              }
          }
        Lr(
          e,
          u,
          d,
          g,
          z,
          c,
          n,
          !1
        );
        return;
      case "select":
        ue("invalid", e), a = c = u = null;
        for (n in l)
          if (l.hasOwnProperty(n) && (d = l[n], d != null))
            switch (n) {
              case "value":
                u = d;
                break;
              case "defaultValue":
                c = d;
                break;
              case "multiple":
                a = d;
              default:
                xe(e, t, n, d, l, null);
            }
        t = u, l = c, e.multiple = !!a, t != null ? pa(e, !!a, t, !1) : l != null && pa(e, !!a, l, !0);
        return;
      case "textarea":
        ue("invalid", e), u = n = a = null;
        for (c in l)
          if (l.hasOwnProperty(c) && (d = l[c], d != null))
            switch (c) {
              case "value":
                a = d;
                break;
              case "defaultValue":
                n = d;
                break;
              case "children":
                u = d;
                break;
              case "dangerouslySetInnerHTML":
                if (d != null) throw Error(s(91));
                break;
              default:
                xe(e, t, c, d, l, null);
            }
        Yr(e, a, n, u);
        return;
      case "option":
        for (g in l)
          if (l.hasOwnProperty(g) && (a = l[g], a != null))
            switch (g) {
              case "selected":
                e.selected = a && typeof a != "function" && typeof a != "symbol";
                break;
              default:
                xe(e, t, g, a, l, null);
            }
        return;
      case "dialog":
        ue("beforetoggle", e), ue("toggle", e), ue("cancel", e), ue("close", e);
        break;
      case "iframe":
      case "object":
        ue("load", e);
        break;
      case "video":
      case "audio":
        for (a = 0; a < Hn.length; a++)
          ue(Hn[a], e);
        break;
      case "image":
        ue("error", e), ue("load", e);
        break;
      case "details":
        ue("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        ue("error", e), ue("load", e);
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
                throw Error(s(137, t));
              default:
                xe(e, t, z, a, l, null);
            }
        return;
      default:
        if (Ji(t)) {
          for (C in l)
            l.hasOwnProperty(C) && (a = l[C], a !== void 0 && Ds(
              e,
              t,
              C,
              a,
              l,
              void 0
            ));
          return;
        }
    }
    for (d in l)
      l.hasOwnProperty(d) && (a = l[d], a != null && xe(e, t, d, a, l, null));
  }
  function uv(e, t, l, a) {
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
        var n = null, u = null, c = null, d = null, g = null, z = null, C = null;
        for (O in l) {
          var U = l[O];
          if (l.hasOwnProperty(O) && U != null)
            switch (O) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                g = U;
              default:
                a.hasOwnProperty(O) || xe(e, t, O, null, a, U);
            }
        }
        for (var A in a) {
          var O = a[A];
          if (U = l[A], a.hasOwnProperty(A) && (O != null || U != null))
            switch (A) {
              case "type":
                u = O;
                break;
              case "name":
                n = O;
                break;
              case "checked":
                z = O;
                break;
              case "defaultChecked":
                C = O;
                break;
              case "value":
                c = O;
                break;
              case "defaultValue":
                d = O;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (O != null)
                  throw Error(s(137, t));
                break;
              default:
                O !== U && xe(
                  e,
                  t,
                  A,
                  O,
                  a,
                  U
                );
            }
        }
        Vi(
          e,
          c,
          d,
          g,
          z,
          C,
          u,
          n
        );
        return;
      case "select":
        O = c = d = A = null;
        for (u in l)
          if (g = l[u], l.hasOwnProperty(u) && g != null)
            switch (u) {
              case "value":
                break;
              case "multiple":
                O = g;
              default:
                a.hasOwnProperty(u) || xe(
                  e,
                  t,
                  u,
                  null,
                  a,
                  g
                );
            }
        for (n in a)
          if (u = a[n], g = l[n], a.hasOwnProperty(n) && (u != null || g != null))
            switch (n) {
              case "value":
                A = u;
                break;
              case "defaultValue":
                d = u;
                break;
              case "multiple":
                c = u;
              default:
                u !== g && xe(
                  e,
                  t,
                  n,
                  u,
                  a,
                  g
                );
            }
        t = d, l = c, a = O, A != null ? pa(e, !!l, A, !1) : !!a != !!l && (t != null ? pa(e, !!l, t, !0) : pa(e, !!l, l ? [] : "", !1));
        return;
      case "textarea":
        O = A = null;
        for (d in l)
          if (n = l[d], l.hasOwnProperty(d) && n != null && !a.hasOwnProperty(d))
            switch (d) {
              case "value":
                break;
              case "children":
                break;
              default:
                xe(e, t, d, null, a, n);
            }
        for (c in a)
          if (n = a[c], u = l[c], a.hasOwnProperty(c) && (n != null || u != null))
            switch (c) {
              case "value":
                A = n;
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
                n !== u && xe(e, t, c, n, a, u);
            }
        qr(e, A, O);
        return;
      case "option":
        for (var Q in l)
          if (A = l[Q], l.hasOwnProperty(Q) && A != null && !a.hasOwnProperty(Q))
            switch (Q) {
              case "selected":
                e.selected = !1;
                break;
              default:
                xe(
                  e,
                  t,
                  Q,
                  null,
                  a,
                  A
                );
            }
        for (g in a)
          if (A = a[g], O = l[g], a.hasOwnProperty(g) && A !== O && (A != null || O != null))
            switch (g) {
              case "selected":
                e.selected = A && typeof A != "function" && typeof A != "symbol";
                break;
              default:
                xe(
                  e,
                  t,
                  g,
                  A,
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
          A = l[$], l.hasOwnProperty($) && A != null && !a.hasOwnProperty($) && xe(e, t, $, null, a, A);
        for (z in a)
          if (A = a[z], O = l[z], a.hasOwnProperty(z) && A !== O && (A != null || O != null))
            switch (z) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (A != null)
                  throw Error(s(137, t));
                break;
              default:
                xe(
                  e,
                  t,
                  z,
                  A,
                  a,
                  O
                );
            }
        return;
      default:
        if (Ji(t)) {
          for (var Se in l)
            A = l[Se], l.hasOwnProperty(Se) && A !== void 0 && !a.hasOwnProperty(Se) && Ds(
              e,
              t,
              Se,
              void 0,
              a,
              A
            );
          for (C in a)
            A = a[C], O = l[C], !a.hasOwnProperty(C) || A === O || A === void 0 && O === void 0 || Ds(
              e,
              t,
              C,
              A,
              a,
              O
            );
          return;
        }
    }
    for (var _ in l)
      A = l[_], l.hasOwnProperty(_) && A != null && !a.hasOwnProperty(_) && xe(e, t, _, null, a, A);
    for (U in a)
      A = a[U], O = l[U], !a.hasOwnProperty(U) || A === O || A == null && O == null || xe(e, t, U, A, a, O);
  }
  function Vd(e) {
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
  function iv() {
    if (typeof performance.getEntriesByType == "function") {
      for (var e = 0, t = 0, l = performance.getEntriesByType("resource"), a = 0; a < l.length; a++) {
        var n = l[a], u = n.transferSize, c = n.initiatorType, d = n.duration;
        if (u && d && Vd(c)) {
          for (c = 0, d = n.responseEnd, a += 1; a < l.length; a++) {
            var g = l[a], z = g.startTime;
            if (z > d) break;
            var C = g.transferSize, U = g.initiatorType;
            C && Vd(U) && (g = g.responseEnd, c += C * (g < d ? 1 : (d - z) / (g - z)));
          }
          if (--a, t += 8 * (u + c) / (n.duration / 1e3), e++, 10 < e) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
  }
  var Us = null, Hs = null;
  function ai(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function Kd(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Jd(e, t) {
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
  function ws(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Bs = null;
  function cv() {
    var e = window.event;
    return e && e.type === "popstate" ? e === Bs ? !1 : (Bs = e, !0) : (Bs = null, !1);
  }
  var kd = typeof setTimeout == "function" ? setTimeout : void 0, sv = typeof clearTimeout == "function" ? clearTimeout : void 0, $d = typeof Promise == "function" ? Promise : void 0, rv = typeof queueMicrotask == "function" ? queueMicrotask : typeof $d < "u" ? function(e) {
    return $d.resolve(null).then(e).catch(ov);
  } : kd;
  function ov(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Bl(e) {
    return e === "head";
  }
  function Wd(e, t) {
    var l = t, a = 0;
    do {
      var n = l.nextSibling;
      if (e.removeChild(l), n && n.nodeType === 8)
        if (l = n.data, l === "/$" || l === "/&") {
          if (a === 0) {
            e.removeChild(n), Ja(t);
            return;
          }
          a--;
        } else if (l === "$" || l === "$?" || l === "$~" || l === "$!" || l === "&")
          a++;
        else if (l === "html")
          Bn(e.ownerDocument.documentElement);
        else if (l === "head") {
          l = e.ownerDocument.head, Bn(l);
          for (var u = l.firstChild; u; ) {
            var c = u.nextSibling, d = u.nodeName;
            u[en] || d === "SCRIPT" || d === "STYLE" || d === "LINK" && u.rel.toLowerCase() === "stylesheet" || l.removeChild(u), u = c;
          }
        } else
          l === "body" && Bn(e.ownerDocument.body);
      l = n;
    } while (l);
    Ja(t);
  }
  function Fd(e, t) {
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
  function Ls(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var l = t;
      switch (t = t.nextSibling, l.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Ls(l), Qi(l);
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
  function fv(e, t, l, a) {
    for (; e.nodeType === 1; ) {
      var n = l;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!a && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (a) {
        if (!e[en])
          switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (u = e.getAttribute("rel"), u === "stylesheet" && e.hasAttribute("data-precedence"))
                break;
              if (u !== n.rel || e.getAttribute("href") !== (n.href == null || n.href === "" ? null : n.href) || e.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin) || e.getAttribute("title") !== (n.title == null ? null : n.title))
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (u = e.getAttribute("src"), (u !== (n.src == null ? null : n.src) || e.getAttribute("type") !== (n.type == null ? null : n.type) || e.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin)) && u && e.hasAttribute("async") && !e.hasAttribute("itemprop"))
                break;
              return e;
            default:
              return e;
          }
      } else if (t === "input" && e.type === "hidden") {
        var u = n.name == null ? null : "" + n.name;
        if (n.type === "hidden" && e.getAttribute("name") === u)
          return e;
      } else return e;
      if (e = Ut(e.nextSibling), e === null) break;
    }
    return null;
  }
  function dv(e, t, l) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !l || (e = Ut(e.nextSibling), e === null)) return null;
    return e;
  }
  function Pd(e, t) {
    for (; e.nodeType !== 8; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = Ut(e.nextSibling), e === null)) return null;
    return e;
  }
  function qs(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function Ys(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
  }
  function hv(e, t) {
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
  function Ut(e) {
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
  var Gs = null;
  function Id(e) {
    e = e.nextSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var l = e.data;
        if (l === "/$" || l === "/&") {
          if (t === 0)
            return Ut(e.nextSibling);
          t--;
        } else
          l !== "$" && l !== "$!" && l !== "$?" && l !== "$~" && l !== "&" || t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function eh(e) {
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
  function th(e, t, l) {
    switch (t = ai(l), e) {
      case "html":
        if (e = t.documentElement, !e) throw Error(s(452));
        return e;
      case "head":
        if (e = t.head, !e) throw Error(s(453));
        return e;
      case "body":
        if (e = t.body, !e) throw Error(s(454));
        return e;
      default:
        throw Error(s(451));
    }
  }
  function Bn(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    Qi(e);
  }
  var Ht = /* @__PURE__ */ new Map(), lh = /* @__PURE__ */ new Set();
  function ni(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var pl = Y.d;
  Y.d = {
    f: mv,
    r: pv,
    D: vv,
    C: yv,
    L: gv,
    m: bv,
    X: Sv,
    S: xv,
    M: _v
  };
  function mv() {
    var e = pl.f(), t = $u();
    return e || t;
  }
  function pv(e) {
    var t = da(e);
    t !== null && t.tag === 5 && t.type === "form" ? bf(t) : pl.r(e);
  }
  var Za = typeof document > "u" ? null : document;
  function ah(e, t, l) {
    var a = Za;
    if (a && typeof t == "string" && t) {
      var n = Nt(t);
      n = 'link[rel="' + e + '"][href="' + n + '"]', typeof l == "string" && (n += '[crossorigin="' + l + '"]'), lh.has(n) || (lh.add(n), e = { rel: e, crossOrigin: l, href: t }, a.querySelector(n) === null && (t = a.createElement("link"), We(t, "link", e), Ze(t), a.head.appendChild(t)));
    }
  }
  function vv(e) {
    pl.D(e), ah("dns-prefetch", e, null);
  }
  function yv(e, t) {
    pl.C(e, t), ah("preconnect", e, t);
  }
  function gv(e, t, l) {
    pl.L(e, t, l);
    var a = Za;
    if (a && e && t) {
      var n = 'link[rel="preload"][as="' + Nt(t) + '"]';
      t === "image" && l && l.imageSrcSet ? (n += '[imagesrcset="' + Nt(
        l.imageSrcSet
      ) + '"]', typeof l.imageSizes == "string" && (n += '[imagesizes="' + Nt(
        l.imageSizes
      ) + '"]')) : n += '[href="' + Nt(e) + '"]';
      var u = n;
      switch (t) {
        case "style":
          u = Va(e);
          break;
        case "script":
          u = Ka(e);
      }
      Ht.has(u) || (e = E(
        {
          rel: "preload",
          href: t === "image" && l && l.imageSrcSet ? void 0 : e,
          as: t
        },
        l
      ), Ht.set(u, e), a.querySelector(n) !== null || t === "style" && a.querySelector(Ln(u)) || t === "script" && a.querySelector(qn(u)) || (t = a.createElement("link"), We(t, "link", e), Ze(t), a.head.appendChild(t)));
    }
  }
  function bv(e, t) {
    pl.m(e, t);
    var l = Za;
    if (l && e) {
      var a = t && typeof t.as == "string" ? t.as : "script", n = 'link[rel="modulepreload"][as="' + Nt(a) + '"][href="' + Nt(e) + '"]', u = n;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          u = Ka(e);
      }
      if (!Ht.has(u) && (e = E({ rel: "modulepreload", href: e }, t), Ht.set(u, e), l.querySelector(n) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (l.querySelector(qn(u)))
              return;
        }
        a = l.createElement("link"), We(a, "link", e), Ze(a), l.head.appendChild(a);
      }
    }
  }
  function xv(e, t, l) {
    pl.S(e, t, l);
    var a = Za;
    if (a && e) {
      var n = ha(a).hoistableStyles, u = Va(e);
      t = t || "default";
      var c = n.get(u);
      if (!c) {
        var d = { loading: 0, preload: null };
        if (c = a.querySelector(
          Ln(u)
        ))
          d.loading = 5;
        else {
          e = E(
            { rel: "stylesheet", href: e, "data-precedence": t },
            l
          ), (l = Ht.get(u)) && Xs(e, l);
          var g = c = a.createElement("link");
          Ze(g), We(g, "link", e), g._p = new Promise(function(z, C) {
            g.onload = z, g.onerror = C;
          }), g.addEventListener("load", function() {
            d.loading |= 1;
          }), g.addEventListener("error", function() {
            d.loading |= 2;
          }), d.loading |= 4, ui(c, t, a);
        }
        c = {
          type: "stylesheet",
          instance: c,
          count: 1,
          state: d
        }, n.set(u, c);
      }
    }
  }
  function Sv(e, t) {
    pl.X(e, t);
    var l = Za;
    if (l && e) {
      var a = ha(l).hoistableScripts, n = Ka(e), u = a.get(n);
      u || (u = l.querySelector(qn(n)), u || (e = E({ src: e, async: !0 }, t), (t = Ht.get(n)) && Qs(e, t), u = l.createElement("script"), Ze(u), We(u, "link", e), l.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, a.set(n, u));
    }
  }
  function _v(e, t) {
    pl.M(e, t);
    var l = Za;
    if (l && e) {
      var a = ha(l).hoistableScripts, n = Ka(e), u = a.get(n);
      u || (u = l.querySelector(qn(n)), u || (e = E({ src: e, async: !0, type: "module" }, t), (t = Ht.get(n)) && Qs(e, t), u = l.createElement("script"), Ze(u), We(u, "link", e), l.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, a.set(n, u));
    }
  }
  function nh(e, t, l, a) {
    var n = (n = ae.current) ? ni(n) : null;
    if (!n) throw Error(s(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof l.precedence == "string" && typeof l.href == "string" ? (t = Va(l.href), l = ha(
          n
        ).hoistableStyles, a = l.get(t), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, l.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (l.rel === "stylesheet" && typeof l.href == "string" && typeof l.precedence == "string") {
          e = Va(l.href);
          var u = ha(
            n
          ).hoistableStyles, c = u.get(e);
          if (c || (n = n.ownerDocument || n, c = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, u.set(e, c), (u = n.querySelector(
            Ln(e)
          )) && !u._p && (c.instance = u, c.state.loading = 5), Ht.has(e) || (l = {
            rel: "preload",
            as: "style",
            href: l.href,
            crossOrigin: l.crossOrigin,
            integrity: l.integrity,
            media: l.media,
            hrefLang: l.hrefLang,
            referrerPolicy: l.referrerPolicy
          }, Ht.set(e, l), u || Ev(
            n,
            e,
            l,
            c.state
          ))), t && a === null)
            throw Error(s(528, ""));
          return c;
        }
        if (t && a !== null)
          throw Error(s(529, ""));
        return null;
      case "script":
        return t = l.async, l = l.src, typeof l == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Ka(l), l = ha(
          n
        ).hoistableScripts, a = l.get(t), a || (a = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, l.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(s(444, e));
    }
  }
  function Va(e) {
    return 'href="' + Nt(e) + '"';
  }
  function Ln(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function uh(e) {
    return E({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function Ev(e, t, l, a) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? a.loading = 1 : (t = e.createElement("link"), a.preload = t, t.addEventListener("load", function() {
      return a.loading |= 1;
    }), t.addEventListener("error", function() {
      return a.loading |= 2;
    }), We(t, "link", l), Ze(t), e.head.appendChild(t));
  }
  function Ka(e) {
    return '[src="' + Nt(e) + '"]';
  }
  function qn(e) {
    return "script[async]" + e;
  }
  function ih(e, t, l) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var a = e.querySelector(
            'style[data-href~="' + Nt(l.href) + '"]'
          );
          if (a)
            return t.instance = a, Ze(a), a;
          var n = E({}, l, {
            "data-href": l.href,
            "data-precedence": l.precedence,
            href: null,
            precedence: null
          });
          return a = (e.ownerDocument || e).createElement(
            "style"
          ), Ze(a), We(a, "style", n), ui(a, l.precedence, e), t.instance = a;
        case "stylesheet":
          n = Va(l.href);
          var u = e.querySelector(
            Ln(n)
          );
          if (u)
            return t.state.loading |= 4, t.instance = u, Ze(u), u;
          a = uh(l), (n = Ht.get(n)) && Xs(a, n), u = (e.ownerDocument || e).createElement("link"), Ze(u);
          var c = u;
          return c._p = new Promise(function(d, g) {
            c.onload = d, c.onerror = g;
          }), We(u, "link", a), t.state.loading |= 4, ui(u, l.precedence, e), t.instance = u;
        case "script":
          return u = Ka(l.src), (n = e.querySelector(
            qn(u)
          )) ? (t.instance = n, Ze(n), n) : (a = l, (n = Ht.get(u)) && (a = E({}, l), Qs(a, n)), e = e.ownerDocument || e, n = e.createElement("script"), Ze(n), We(n, "link", a), e.head.appendChild(n), t.instance = n);
        case "void":
          return null;
        default:
          throw Error(s(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (a = t.instance, t.state.loading |= 4, ui(a, l.precedence, e));
    return t.instance;
  }
  function ui(e, t, l) {
    for (var a = l.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), n = a.length ? a[a.length - 1] : null, u = n, c = 0; c < a.length; c++) {
      var d = a[c];
      if (d.dataset.precedence === t) u = d;
      else if (u !== n) break;
    }
    u ? u.parentNode.insertBefore(e, u.nextSibling) : (t = l.nodeType === 9 ? l.head : l, t.insertBefore(e, t.firstChild));
  }
  function Xs(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function Qs(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var ii = null;
  function ch(e, t, l) {
    if (ii === null) {
      var a = /* @__PURE__ */ new Map(), n = ii = /* @__PURE__ */ new Map();
      n.set(l, a);
    } else
      n = ii, a = n.get(l), a || (a = /* @__PURE__ */ new Map(), n.set(l, a));
    if (a.has(e)) return a;
    for (a.set(e, null), l = l.getElementsByTagName(e), n = 0; n < l.length; n++) {
      var u = l[n];
      if (!(u[en] || u[Ke] || e === "link" && u.getAttribute("rel") === "stylesheet") && u.namespaceURI !== "http://www.w3.org/2000/svg") {
        var c = u.getAttribute(t) || "";
        c = e + c;
        var d = a.get(c);
        d ? d.push(u) : a.set(c, [u]);
      }
    }
    return a;
  }
  function sh(e, t, l) {
    e = e.ownerDocument || e, e.head.insertBefore(
      l,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function jv(e, t, l) {
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
  function rh(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function Tv(e, t, l, a) {
    if (l.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && (l.state.loading & 4) === 0) {
      if (l.instance === null) {
        var n = Va(a.href), u = t.querySelector(
          Ln(n)
        );
        if (u) {
          t = u._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = ci.bind(e), t.then(e, e)), l.state.loading |= 4, l.instance = u, Ze(u);
          return;
        }
        u = t.ownerDocument || t, a = uh(a), (n = Ht.get(n)) && Xs(a, n), u = u.createElement("link"), Ze(u);
        var c = u;
        c._p = new Promise(function(d, g) {
          c.onload = d, c.onerror = g;
        }), We(u, "link", a), l.instance = u;
      }
      e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(l, t), (t = l.state.preload) && (l.state.loading & 3) === 0 && (e.count++, l = ci.bind(e), t.addEventListener("load", l), t.addEventListener("error", l));
    }
  }
  var Zs = 0;
  function zv(e, t) {
    return e.stylesheets && e.count === 0 && ri(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(l) {
      var a = setTimeout(function() {
        if (e.stylesheets && ri(e, e.stylesheets), e.unsuspend) {
          var u = e.unsuspend;
          e.unsuspend = null, u();
        }
      }, 6e4 + t);
      0 < e.imgBytes && Zs === 0 && (Zs = 62500 * iv());
      var n = setTimeout(
        function() {
          if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && ri(e, e.stylesheets), e.unsuspend)) {
            var u = e.unsuspend;
            e.unsuspend = null, u();
          }
        },
        (e.imgBytes > Zs ? 50 : 800) + t
      );
      return e.unsuspend = l, function() {
        e.unsuspend = null, clearTimeout(a), clearTimeout(n);
      };
    } : null;
  }
  function ci() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) ri(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var si = null;
  function ri(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, si = /* @__PURE__ */ new Map(), t.forEach(Nv, e), si = null, ci.call(e));
  }
  function Nv(e, t) {
    if (!(t.state.loading & 4)) {
      var l = si.get(e);
      if (l) var a = l.get(null);
      else {
        l = /* @__PURE__ */ new Map(), si.set(e, l);
        for (var n = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), u = 0; u < n.length; u++) {
          var c = n[u];
          (c.nodeName === "LINK" || c.getAttribute("media") !== "not all") && (l.set(c.dataset.precedence, c), a = c);
        }
        a && l.set(null, a);
      }
      n = t.instance, c = n.getAttribute("data-precedence"), u = l.get(c) || a, u === a && l.set(null, n), l.set(c, n), this.count++, a = ci.bind(this), n.addEventListener("load", a), n.addEventListener("error", a), u ? u.parentNode.insertBefore(n, u.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(n, e.firstChild)), t.state.loading |= 4;
    }
  }
  var Yn = {
    $$typeof: X,
    Provider: null,
    Consumer: null,
    _currentValue: F,
    _currentValue2: F,
    _threadCount: 0
  };
  function Av(e, t, l, a, n, u, c, d, g) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = qi(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = qi(0), this.hiddenUpdates = qi(null), this.identifierPrefix = a, this.onUncaughtError = n, this.onCaughtError = u, this.onRecoverableError = c, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = g, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function oh(e, t, l, a, n, u, c, d, g, z, C, U) {
    return e = new Av(
      e,
      t,
      l,
      c,
      g,
      z,
      C,
      U,
      d
    ), t = 1, u === !0 && (t |= 24), u = vt(3, null, null, t), e.current = u, u.stateNode = e, t = Ec(), t.refCount++, e.pooledCache = t, t.refCount++, u.memoizedState = {
      element: a,
      isDehydrated: l,
      cache: t
    }, Nc(u), e;
  }
  function fh(e) {
    return e ? (e = Ea, e) : Ea;
  }
  function dh(e, t, l, a, n, u) {
    n = fh(n), a.context === null ? a.context = n : a.pendingContext = n, a = zl(t), a.payload = { element: l }, u = u === void 0 ? null : u, u !== null && (a.callback = u), l = Nl(e, a, t), l !== null && (ot(l, e, t), gn(l, e, t));
  }
  function hh(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var l = e.retryLane;
      e.retryLane = l !== 0 && l < t ? l : t;
    }
  }
  function Vs(e, t) {
    hh(e, t), (e = e.alternate) && hh(e, t);
  }
  function mh(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = $l(e, 67108864);
      t !== null && ot(t, e, 67108864), Vs(e, 67108864);
    }
  }
  function ph(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = St();
      t = Yi(t);
      var l = $l(e, t);
      l !== null && ot(l, e, t), Vs(e, t);
    }
  }
  var oi = !0;
  function Rv(e, t, l, a) {
    var n = M.T;
    M.T = null;
    var u = Y.p;
    try {
      Y.p = 2, Ks(e, t, l, a);
    } finally {
      Y.p = u, M.T = n;
    }
  }
  function Ov(e, t, l, a) {
    var n = M.T;
    M.T = null;
    var u = Y.p;
    try {
      Y.p = 8, Ks(e, t, l, a);
    } finally {
      Y.p = u, M.T = n;
    }
  }
  function Ks(e, t, l, a) {
    if (oi) {
      var n = Js(a);
      if (n === null)
        Ms(
          e,
          t,
          a,
          fi,
          l
        ), yh(e, a);
      else if (Mv(
        n,
        e,
        t,
        l,
        a
      ))
        a.stopPropagation();
      else if (yh(e, a), t & 4 && -1 < Cv.indexOf(e)) {
        for (; n !== null; ) {
          var u = da(n);
          if (u !== null)
            switch (u.tag) {
              case 3:
                if (u = u.stateNode, u.current.memoizedState.isDehydrated) {
                  var c = Zl(u.pendingLanes);
                  if (c !== 0) {
                    var d = u;
                    for (d.pendingLanes |= 2, d.entangledLanes |= 2; c; ) {
                      var g = 1 << 31 - mt(c);
                      d.entanglements[1] |= g, c &= ~g;
                    }
                    Wt(u), (me & 6) === 0 && (Ju = dt() + 500, Un(0));
                  }
                }
                break;
              case 31:
              case 13:
                d = $l(u, 2), d !== null && ot(d, u, 2), $u(), Vs(u, 2);
            }
          if (u = Js(a), u === null && Ms(
            e,
            t,
            a,
            fi,
            l
          ), u === n) break;
          n = u;
        }
        n !== null && a.stopPropagation();
      } else
        Ms(
          e,
          t,
          a,
          null,
          l
        );
    }
  }
  function Js(e) {
    return e = $i(e), ks(e);
  }
  var fi = null;
  function ks(e) {
    if (fi = null, e = fa(e), e !== null) {
      var t = m(e);
      if (t === null) e = null;
      else {
        var l = t.tag;
        if (l === 13) {
          if (e = v(t), e !== null) return e;
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
    return fi = e, null;
  }
  function vh(e) {
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
        switch (vm()) {
          case _r:
            return 2;
          case Er:
            return 8;
          case eu:
          case ym:
            return 32;
          case jr:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var $s = !1, Ll = null, ql = null, Yl = null, Gn = /* @__PURE__ */ new Map(), Xn = /* @__PURE__ */ new Map(), Gl = [], Cv = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function yh(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Ll = null;
        break;
      case "dragenter":
      case "dragleave":
        ql = null;
        break;
      case "mouseover":
      case "mouseout":
        Yl = null;
        break;
      case "pointerover":
      case "pointerout":
        Gn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Xn.delete(t.pointerId);
    }
  }
  function Qn(e, t, l, a, n, u) {
    return e === null || e.nativeEvent !== u ? (e = {
      blockedOn: t,
      domEventName: l,
      eventSystemFlags: a,
      nativeEvent: u,
      targetContainers: [n]
    }, t !== null && (t = da(t), t !== null && mh(t)), e) : (e.eventSystemFlags |= a, t = e.targetContainers, n !== null && t.indexOf(n) === -1 && t.push(n), e);
  }
  function Mv(e, t, l, a, n) {
    switch (t) {
      case "focusin":
        return Ll = Qn(
          Ll,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "dragenter":
        return ql = Qn(
          ql,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "mouseover":
        return Yl = Qn(
          Yl,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "pointerover":
        var u = n.pointerId;
        return Gn.set(
          u,
          Qn(
            Gn.get(u) || null,
            e,
            t,
            l,
            a,
            n
          )
        ), !0;
      case "gotpointercapture":
        return u = n.pointerId, Xn.set(
          u,
          Qn(
            Xn.get(u) || null,
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
  function gh(e) {
    var t = fa(e.target);
    if (t !== null) {
      var l = m(t);
      if (l !== null) {
        if (t = l.tag, t === 13) {
          if (t = v(l), t !== null) {
            e.blockedOn = t, Or(e.priority, function() {
              ph(l);
            });
            return;
          }
        } else if (t === 31) {
          if (t = y(l), t !== null) {
            e.blockedOn = t, Or(e.priority, function() {
              ph(l);
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
  function di(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var l = Js(e.nativeEvent);
      if (l === null) {
        l = e.nativeEvent;
        var a = new l.constructor(
          l.type,
          l
        );
        ki = a, l.target.dispatchEvent(a), ki = null;
      } else
        return t = da(l), t !== null && mh(t), e.blockedOn = l, !1;
      t.shift();
    }
    return !0;
  }
  function bh(e, t, l) {
    di(e) && l.delete(t);
  }
  function Dv() {
    $s = !1, Ll !== null && di(Ll) && (Ll = null), ql !== null && di(ql) && (ql = null), Yl !== null && di(Yl) && (Yl = null), Gn.forEach(bh), Xn.forEach(bh);
  }
  function hi(e, t) {
    e.blockedOn === t && (e.blockedOn = null, $s || ($s = !0, i.unstable_scheduleCallback(
      i.unstable_NormalPriority,
      Dv
    )));
  }
  var mi = null;
  function xh(e) {
    mi !== e && (mi = e, i.unstable_scheduleCallback(
      i.unstable_NormalPriority,
      function() {
        mi === e && (mi = null);
        for (var t = 0; t < e.length; t += 3) {
          var l = e[t], a = e[t + 1], n = e[t + 2];
          if (typeof a != "function") {
            if (ks(a || l) === null)
              continue;
            break;
          }
          var u = da(l);
          u !== null && (e.splice(t, 3), t -= 3, Jc(
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
  function Ja(e) {
    function t(g) {
      return hi(g, e);
    }
    Ll !== null && hi(Ll, e), ql !== null && hi(ql, e), Yl !== null && hi(Yl, e), Gn.forEach(t), Xn.forEach(t);
    for (var l = 0; l < Gl.length; l++) {
      var a = Gl[l];
      a.blockedOn === e && (a.blockedOn = null);
    }
    for (; 0 < Gl.length && (l = Gl[0], l.blockedOn === null); )
      gh(l), l.blockedOn === null && Gl.shift();
    if (l = (e.ownerDocument || e).$$reactFormReplay, l != null)
      for (a = 0; a < l.length; a += 3) {
        var n = l[a], u = l[a + 1], c = n[nt] || null;
        if (typeof u == "function")
          c || xh(l);
        else if (c) {
          var d = null;
          if (u && u.hasAttribute("formAction")) {
            if (n = u, c = u[nt] || null)
              d = c.formAction;
            else if (ks(n) !== null) continue;
          } else d = c.action;
          typeof d == "function" ? l[a + 1] = d : (l.splice(a, 3), a -= 3), xh(l);
        }
      }
  }
  function Sh() {
    function e(u) {
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
    function t() {
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
      return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(l, 100), function() {
        a = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), n !== null && (n(), n = null);
      };
    }
  }
  function Ws(e) {
    this._internalRoot = e;
  }
  pi.prototype.render = Ws.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(s(409));
    var l = t.current, a = St();
    dh(l, a, e, t, null, null);
  }, pi.prototype.unmount = Ws.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      dh(e.current, 2, null, e, null, null), $u(), t[oa] = null;
    }
  };
  function pi(e) {
    this._internalRoot = e;
  }
  pi.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Rr();
      e = { blockedOn: null, target: e, priority: t };
      for (var l = 0; l < Gl.length && t !== 0 && t < Gl[l].priority; l++) ;
      Gl.splice(l, 0, e), l === 0 && gh(e);
    }
  };
  var _h = o.version;
  if (_h !== "19.2.8")
    throw Error(
      s(
        527,
        _h,
        "19.2.8"
      )
    );
  Y.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(s(188)) : (e = Object.keys(e).join(","), Error(s(268, e)));
    return e = p(t), e = e !== null ? R(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var Uv = {
    bundleType: 0,
    version: "19.2.8",
    rendererPackageName: "react-dom",
    currentDispatcherRef: M,
    reconcilerVersion: "19.2.8"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var vi = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!vi.isDisabled && vi.supportsFiber)
      try {
        Fa = vi.inject(
          Uv
        ), ht = vi;
      } catch {
      }
  }
  return Vn.createRoot = function(e, t) {
    if (!h(e)) throw Error(s(299));
    var l = !1, a = "", n = Rf, u = Of, c = Cf;
    return t != null && (t.unstable_strictMode === !0 && (l = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (n = t.onUncaughtError), t.onCaughtError !== void 0 && (u = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = oh(
      e,
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
      Sh
    ), e[oa] = t.current, Cs(e), new Ws(t);
  }, Vn.hydrateRoot = function(e, t, l) {
    if (!h(e)) throw Error(s(299));
    var a = !1, n = "", u = Rf, c = Of, d = Cf, g = null;
    return l != null && (l.unstable_strictMode === !0 && (a = !0), l.identifierPrefix !== void 0 && (n = l.identifierPrefix), l.onUncaughtError !== void 0 && (u = l.onUncaughtError), l.onCaughtError !== void 0 && (c = l.onCaughtError), l.onRecoverableError !== void 0 && (d = l.onRecoverableError), l.formState !== void 0 && (g = l.formState)), t = oh(
      e,
      1,
      !0,
      t,
      l ?? null,
      a,
      n,
      g,
      u,
      c,
      d,
      Sh
    ), t.context = fh(null), l = t.current, a = St(), a = Yi(a), n = zl(a), n.callback = null, Nl(l, n, a), l = a, t.current.lanes = l, Ia(t, l), Wt(t), e[oa] = t.current, Cs(e), new pi(t);
  }, Vn.version = "19.2.8", Vn;
}
var Mh;
function Kv() {
  if (Mh) return Is.exports;
  Mh = 1;
  function i() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i);
      } catch (o) {
        console.error(o);
      }
  }
  return i(), Is.exports = Vv(), Is.exports;
}
var Jv = Kv();
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
var fr = /^(?:[a-z][a-z0-9+.-]*:|[\\/]{2})/i, Zh = /^[\\/]{2}/;
function kv(i, o) {
  return o + i.replace(/\\/g, "/");
}
var Dh = "popstate";
function Uh(i) {
  return typeof i == "object" && i != null && "pathname" in i && "search" in i && "hash" in i && "state" in i && "key" in i;
}
function $v(i = {}) {
  function o(h, m) {
    let {
      pathname: v = "/",
      search: y = "",
      hash: b = ""
    } = sa(h.location.hash.substring(1));
    return !v.startsWith("/") && !v.startsWith(".") && (v = "/" + v), cr(
      "",
      { pathname: v, search: y, hash: b },
      // state defaults to `null` because `window.history.state` does
      m.state && m.state.usr || null,
      m.state && m.state.key || "default"
    );
  }
  function f(h, m) {
    let v = h.document.querySelector("base"), y = "";
    if (v && v.getAttribute("href")) {
      let b = h.location.href, p = b.indexOf("#");
      y = p === -1 ? b : b.slice(0, p);
    }
    return y + "#" + (typeof m == "string" ? m : Wn(m));
  }
  function s(h, m) {
    _t(
      h.pathname.charAt(0) === "/",
      `relative pathnames are not supported in hash history.push(${JSON.stringify(
        m
      )})`
    );
  }
  return Fv(
    o,
    f,
    s,
    i
  );
}
function Oe(i, o) {
  if (i === !1 || i === null || typeof i > "u")
    throw new Error(o);
}
function _t(i, o) {
  if (!i) {
    typeof console < "u" && console.warn(o);
    try {
      throw new Error(o);
    } catch {
    }
  }
}
function Wv() {
  return Math.random().toString(36).substring(2, 10);
}
function Hh(i, o) {
  return {
    usr: i.state,
    key: i.key,
    idx: o,
    masked: i.mask ? {
      pathname: i.pathname,
      search: i.search,
      hash: i.hash
    } : void 0
  };
}
function cr(i, o, f = null, s, h) {
  return {
    pathname: typeof i == "string" ? i : i.pathname,
    search: "",
    hash: "",
    ...typeof o == "string" ? sa(o) : o,
    state: f,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: o && o.key || s || Wv(),
    mask: h
  };
}
function Wn({
  pathname: i = "/",
  search: o = "",
  hash: f = ""
}) {
  return o && o !== "?" && (i += o.charAt(0) === "?" ? o : "?" + o), f && f !== "#" && (i += f.charAt(0) === "#" ? f : "#" + f), i;
}
function sa(i) {
  let o = {};
  if (i) {
    let f = i.indexOf("#");
    f >= 0 && (o.hash = i.substring(f), i = i.substring(0, f));
    let s = i.indexOf("?");
    s >= 0 && (o.search = i.substring(s), i = i.substring(0, s)), i && (o.pathname = i);
  }
  return o;
}
function Fv(i, o, f, s = {}) {
  let { window: h = document.defaultView, v5Compat: m = !1 } = s, v = h.history, y = "POP", b = null, p = R();
  p == null && (p = 0, v.replaceState({ ...v.state, idx: p }, ""));
  function R() {
    return (v.state || { idx: null }).idx;
  }
  function E() {
    y = "POP";
    let w = R(), V = w == null ? null : w - p;
    p = w, b && b({ action: y, location: q.location, delta: V });
  }
  function N(w, V) {
    y = "PUSH";
    let k = Uh(w) ? w : cr(q.location, w, V);
    f && f(k, w), p = R() + 1;
    let X = Hh(k, p), le = q.createHref(k.mask || k);
    try {
      v.pushState(X, "", le);
    } catch (fe) {
      if (fe instanceof DOMException && fe.name === "DataCloneError")
        throw fe;
      h.location.assign(le);
    }
    m && b && b({ action: y, location: q.location, delta: 1 });
  }
  function B(w, V) {
    y = "REPLACE";
    let k = Uh(w) ? w : cr(q.location, w, V);
    f && f(k, w), p = R();
    let X = Hh(k, p), le = q.createHref(k.mask || k);
    v.replaceState(X, "", le), m && b && b({ action: y, location: q.location, delta: 0 });
  }
  function L(w) {
    return Pv(h, w);
  }
  let q = {
    get action() {
      return y;
    },
    get location() {
      return i(h, v);
    },
    listen(w) {
      if (b)
        throw new Error("A history only accepts one active listener");
      return h.addEventListener(Dh, E), b = w, () => {
        h.removeEventListener(Dh, E), b = null;
      };
    },
    createHref(w) {
      return o(h, w);
    },
    createURL: L,
    encodeLocation(w) {
      let V = L(w);
      return {
        pathname: V.pathname,
        search: V.search,
        hash: V.hash
      };
    },
    push: N,
    replace: B,
    go(w) {
      return v.go(w);
    }
  };
  return q;
}
function Pv(i, o, f = !1) {
  let s = "http://localhost";
  i && (s = i.location.origin !== "null" ? i.location.origin : i.location.href), Oe(s, "No window.location.(origin|href) available to create URL");
  let h = typeof o == "string" ? o : Wn(o);
  return h = h.replace(/ $/, "%20"), !f && Zh.test(h) && (h = s + h), new URL(h, s);
}
function Vh(i, o, f = "/") {
  return Iv(i, o, f, !1);
}
function Iv(i, o, f, s, h) {
  let m = typeof o == "string" ? sa(o) : o, v = yl(m.pathname || "/", f);
  if (v == null)
    return null;
  let y = e0(i), b = null, p = f0(v);
  for (let R = 0; b == null && R < y.length; ++R)
    b = o0(
      y[R],
      p,
      s
    );
  return b;
}
function e0(i) {
  let o = Kh(i);
  return t0(o), o;
}
function Kh(i, o = [], f = [], s = "", h = !1) {
  let m = (v, y, b = h, p) => {
    let R = {
      relativePath: p === void 0 ? v.path || "" : p,
      caseSensitive: v.caseSensitive === !0,
      childrenIndex: y,
      route: v
    };
    if (R.relativePath.startsWith("/")) {
      if (!R.relativePath.startsWith(s) && b)
        return;
      Oe(
        R.relativePath.startsWith(s),
        `Absolute route path "${R.relativePath}" nested under path "${s}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
      ), R.relativePath = R.relativePath.slice(s.length);
    }
    let E = Zt([s, R.relativePath]), N = f.concat(R);
    v.children && v.children.length > 0 && (Oe(
      // Our types know better, but runtime JS may not!
      // @ts-expect-error
      v.index !== !0,
      `Index routes must not have child routes. Please remove all child routes from route path "${E}".`
    ), Kh(
      v.children,
      o,
      N,
      E,
      b
    )), !(v.path == null && !v.index) && o.push({
      path: E,
      score: s0(E, v.index),
      routesMeta: N.map((B, L) => {
        let [q, w] = $h(
          B.relativePath,
          B.caseSensitive,
          L === N.length - 1
        );
        return {
          ...B,
          matcher: q,
          compiledParams: w
        };
      })
    });
  };
  return i.forEach((v, y) => {
    if (v.path === "" || !v.path?.includes("?"))
      m(v, y);
    else
      for (let b of Jh(v.path))
        m(v, y, !0, b);
  }), o;
}
function Jh(i) {
  let o = i.split("/");
  if (o.length === 0) return [];
  let [f, ...s] = o, h = f.endsWith("?"), m = f.replace(/\?$/, "");
  if (s.length === 0)
    return h ? [m, ""] : [m];
  let v = Jh(s.join("/")), y = [];
  return y.push(
    ...v.map(
      (b) => b === "" ? m : [m, b].join("/")
    )
  ), h && y.push(...v), y.map(
    (b) => i.startsWith("/") && b === "" ? "/" : b
  );
}
function t0(i) {
  i.sort(
    (o, f) => o.score !== f.score ? f.score - o.score : r0(
      o.routesMeta.map((s) => s.childrenIndex),
      f.routesMeta.map((s) => s.childrenIndex)
    )
  );
}
var l0 = /^:[\w-]+$/, a0 = 3, n0 = 2, u0 = 1, i0 = 10, c0 = -2, wh = (i) => i === "*";
function s0(i, o) {
  let f = i.split("/"), s = f.length;
  return f.some(wh) && (s += c0), o && (s += n0), f.filter((h) => !wh(h)).reduce(
    (h, m) => h + (l0.test(m) ? a0 : m === "" ? u0 : i0),
    s
  );
}
function r0(i, o) {
  return i.length === o.length && i.slice(0, -1).every((s, h) => s === o[h]) ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    i[i.length - 1] - o[o.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function o0(i, o, f = !1) {
  let { routesMeta: s } = i, h = {}, m = "/", v = [];
  for (let y = 0; y < s.length; ++y) {
    let b = s[y], p = y === s.length - 1, R = m === "/" ? o : o.slice(m.length) || "/", E = {
      path: b.relativePath,
      caseSensitive: b.caseSensitive,
      end: p
    }, N = (
      // Use precomputed matcher if it exists
      b.matcher && b.compiledParams ? kh(
        E,
        R,
        b.matcher,
        b.compiledParams
      ) : ji(E, R)
    ), B = b.route;
    if (!N && p && f && !s[s.length - 1].route.index && (N = ji(
      {
        path: b.relativePath,
        caseSensitive: b.caseSensitive,
        end: !1
      },
      R
    )), !N)
      return null;
    Object.assign(h, N.params), v.push({
      // TODO: Can this as be avoided?
      params: h,
      pathname: Zt([m, N.pathname]),
      pathnameBase: m0(
        Zt([m, N.pathnameBase])
      ),
      route: B
    }), N.pathnameBase !== "/" && (m = Zt([m, N.pathnameBase]));
  }
  return v;
}
function ji(i, o) {
  typeof i == "string" && (i = { path: i, caseSensitive: !1, end: !0 });
  let [f, s] = $h(
    i.path,
    i.caseSensitive,
    i.end
  );
  return kh(i, o, f, s);
}
function kh(i, o, f, s) {
  let h = o.match(f);
  if (!h) return null;
  let m = h[0], v = m.replace(/(.)\/+$/, "$1"), y = h.slice(1);
  return {
    params: s.reduce(
      (p, { paramName: R, isOptional: E }, N) => {
        if (R === "*") {
          let L = y[N] || "";
          v = m.slice(0, m.length - L.length).replace(/(.)\/+$/, "$1");
        }
        const B = y[N];
        return E && !B ? p[R] = void 0 : p[R] = (B || "").replace(/%2F/g, "/"), p;
      },
      {}
    ),
    pathname: m,
    pathnameBase: v,
    pattern: i
  };
}
function $h(i, o = !1, f = !0) {
  _t(
    i === "*" || !i.endsWith("*") || i.endsWith("/*"),
    `Route path "${i}" will be treated as if it were "${i.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${i.replace(/\*$/, "/*")}".`
  );
  let s = [], h = "^" + i.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(
    /\/:([\w-]+)(\?)?/g,
    (v, y, b, p, R) => {
      if (s.push({ paramName: y, isOptional: b != null }), b) {
        let E = R.charAt(p + v.length);
        return E && E !== "/" ? "/([^\\/]*)" : "(?:/([^\\/]*))?";
      }
      return "/([^\\/]+)";
    }
  ).replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
  return i.endsWith("*") ? (s.push({ paramName: "*" }), h += i === "*" || i === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$") : f ? h += "\\/*$" : i !== "" && i !== "/" && (h += "(?:(?=\\/|$))"), [new RegExp(h, o ? void 0 : "i"), s];
}
function f0(i) {
  try {
    return i.split("/").map((o) => decodeURIComponent(o).replace(/\//g, "%2F")).join("/");
  } catch (o) {
    return _t(
      !1,
      `The URL path "${i}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${o}).`
    ), i;
  }
}
function yl(i, o) {
  if (o === "/") return i;
  if (!i.toLowerCase().startsWith(o.toLowerCase()))
    return null;
  let f = o.endsWith("/") ? o.length - 1 : o.length, s = i.charAt(f);
  return s && s !== "/" ? null : i.slice(f) || "/";
}
function d0(i, o = "/") {
  let {
    pathname: f,
    search: s = "",
    hash: h = ""
  } = typeof i == "string" ? sa(i) : i, m;
  return f ? (f = Wh(f), f.startsWith("/") ? m = Bh(f.substring(1), "/") : m = Bh(f, o)) : m = o, {
    pathname: m,
    search: p0(s),
    hash: v0(h)
  };
}
function Bh(i, o) {
  let f = Ti(o).split("/");
  return i.split("/").forEach((h) => {
    h === ".." ? f.length > 1 && f.pop() : h !== "." && f.push(h);
  }), f.length > 1 ? f.join("/") : "/";
}
function ar(i, o, f, s) {
  return `Cannot include a '${i}' character in a manually specified \`to.${o}\` field [${JSON.stringify(
    s
  )}].  Please separate it out to the \`to.${f}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function h0(i) {
  return i.filter(
    (o, f) => f === 0 || o.route.path && o.route.path.length > 0
  );
}
function dr(i) {
  let o = h0(i);
  return o.map(
    (f, s) => s === o.length - 1 ? f.pathname : f.pathnameBase
  );
}
function Ni(i, o, f, s = !1) {
  let h;
  typeof i == "string" ? h = sa(i) : (h = { ...i }, Oe(
    !h.pathname || !h.pathname.includes("?"),
    ar("?", "pathname", "search", h)
  ), Oe(
    !h.pathname || !h.pathname.includes("#"),
    ar("#", "pathname", "hash", h)
  ), Oe(
    !h.search || !h.search.includes("#"),
    ar("#", "search", "hash", h)
  ));
  let m = i === "" || h.pathname === "", v = m ? "/" : h.pathname, y;
  if (v == null)
    y = f;
  else {
    let E = o.length - 1;
    if (!s && v.startsWith("..")) {
      let N = v.split("/");
      for (; N[0] === ".."; )
        N.shift(), E -= 1;
      h.pathname = N.join("/");
    }
    y = E >= 0 ? o[E] : "/";
  }
  let b = d0(h, y), p = v && v !== "/" && v.endsWith("/"), R = (m || v === ".") && f.endsWith("/");
  return !b.pathname.endsWith("/") && (p || R) && (b.pathname += "/"), b;
}
var Wh = (i) => i.replace(/[\\/]{2,}/g, "/"), Zt = (i) => Wh(i.join("/")), Ti = (i) => i.replace(/\/+$/, ""), m0 = (i) => Ti(i).replace(/^\/*/, "/"), p0 = (i) => !i || i === "?" ? "" : i.startsWith("?") ? i : "?" + i, v0 = (i) => !i || i === "#" ? "" : i.startsWith("#") ? i : "#" + i, y0 = class {
  constructor(i, o, f, s = !1) {
    this.status = i, this.statusText = o || "", this.internal = s, f instanceof Error ? (this.data = f.toString(), this.error = f) : this.data = f;
  }
};
function g0(i) {
  return i != null && typeof i.status == "number" && typeof i.statusText == "string" && typeof i.internal == "boolean" && "data" in i;
}
function b0(i) {
  let o = i.map((f) => f.route.path).filter(Boolean);
  return Zt(o) || "/";
}
var Fh = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
function Ph(i, o) {
  let f = i;
  if (typeof f != "string" || !fr.test(f))
    return {
      absoluteURL: void 0,
      isExternal: !1,
      to: f
    };
  let s = f, h = !1;
  if (Fh)
    try {
      let m = new URL(window.location.href), v = Zh.test(f) ? new URL(kv(f, m.protocol)) : new URL(f), y = yl(v.pathname, o);
      v.origin === m.origin && y != null ? f = y + v.search + v.hash : h = !0;
    } catch {
      _t(
        !1,
        `<Link to="${f}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`
      );
    }
  return {
    absoluteURL: s,
    isExternal: h,
    to: f
  };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
var Ih = [
  "POST",
  "PUT",
  "PATCH",
  "DELETE"
];
new Set(
  Ih
);
var x0 = [
  "GET",
  ...Ih
];
new Set(x0);
var S0 = [
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
function _0(i) {
  try {
    return S0.includes(new URL(i).protocol);
  } catch {
    return !1;
  }
}
var ka = j.createContext(null);
ka.displayName = "DataRouter";
var Ai = j.createContext(null);
Ai.displayName = "DataRouterState";
var em = j.createContext(!1);
function E0() {
  return j.useContext(em);
}
var tm = j.createContext({
  isTransitioning: !1
});
tm.displayName = "ViewTransition";
var j0 = j.createContext(
  /* @__PURE__ */ new Map()
);
j0.displayName = "Fetchers";
var T0 = j.createContext(null);
T0.displayName = "Await";
var Et = j.createContext(
  null
);
Et.displayName = "Navigation";
var Fn = j.createContext(
  null
);
Fn.displayName = "Location";
var Ft = j.createContext({
  outlet: null,
  matches: [],
  isDataRoute: !1
});
Ft.displayName = "Route";
var hr = j.createContext(null);
hr.displayName = "RouteError";
var lm = "REACT_ROUTER_ERROR", z0 = "REDIRECT", N0 = "ROUTE_ERROR_RESPONSE";
function A0(i) {
  if (i.startsWith(`${lm}:${z0}:{`))
    try {
      let o = JSON.parse(i.slice(28));
      if (typeof o == "object" && o && typeof o.status == "number" && typeof o.statusText == "string" && typeof o.location == "string" && typeof o.reloadDocument == "boolean" && typeof o.replace == "boolean")
        return o;
    } catch {
    }
}
function R0(i) {
  if (i.startsWith(
    `${lm}:${N0}:{`
  ))
    try {
      let o = JSON.parse(i.slice(40));
      if (typeof o == "object" && o && typeof o.status == "number" && typeof o.statusText == "string")
        return new y0(
          o.status,
          o.statusText,
          o.data
        );
    } catch {
    }
}
function O0(i, { relative: o } = {}) {
  Oe(
    $a(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useHref() may be used only in the context of a <Router> component."
  );
  let { basename: f, navigator: s } = j.useContext(Et), { hash: h, pathname: m, search: v } = Pn(i, { relative: o }), y = m;
  return f !== "/" && (y = m === "/" ? f : Zt([f, m])), s.createHref({ pathname: y, search: v, hash: h });
}
function $a() {
  return j.useContext(Fn) != null;
}
function Yt() {
  return Oe(
    $a(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useLocation() may be used only in the context of a <Router> component."
  ), j.useContext(Fn).location;
}
var am = "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function nm(i) {
  j.useContext(Et).static || j.useLayoutEffect(i);
}
function ra() {
  let { isDataRoute: i } = j.useContext(Ft);
  return i ? Q0() : C0();
}
function C0() {
  Oe(
    $a(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useNavigate() may be used only in the context of a <Router> component."
  );
  let i = j.useContext(ka), { basename: o, navigator: f } = j.useContext(Et), { matches: s } = j.useContext(Ft), { pathname: h } = Yt(), m = JSON.stringify(dr(s)), v = j.useRef(!1);
  return nm(() => {
    v.current = !0;
  }), j.useCallback(
    (b, p = {}) => {
      if (_t(v.current, am), !v.current) return;
      if (typeof b == "number") {
        f.go(b);
        return;
      }
      let R = Ni(
        b,
        JSON.parse(m),
        h,
        p.relative === "path"
      );
      i == null && o !== "/" && (R.pathname = R.pathname === "/" ? o : Zt([o, R.pathname])), (p.replace ? f.replace : f.push)(
        R,
        p.state,
        p
      );
    },
    [
      o,
      f,
      m,
      h,
      i
    ]
  );
}
j.createContext(null);
function Pn(i, { relative: o } = {}) {
  let { matches: f } = j.useContext(Ft), { pathname: s } = Yt(), h = JSON.stringify(dr(f));
  return j.useMemo(
    () => Ni(
      i,
      JSON.parse(h),
      s,
      o === "path"
    ),
    [i, h, s, o]
  );
}
function M0(i, o) {
  return um(i, o);
}
function um(i, o, f) {
  Oe(
    $a(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useRoutes() may be used only in the context of a <Router> component."
  );
  let { navigator: s } = j.useContext(Et), { matches: h } = j.useContext(Ft), m = h[h.length - 1], v = m ? m.params : {}, y = m ? m.pathname : "/", b = m ? m.pathnameBase : "/", p = m && m.route;
  {
    let w = p && p.path || "";
    cm(
      y,
      !p || w.endsWith("*") || w.endsWith("*?"),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${y}" (under <Route path="${w}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${w}"> to <Route path="${w === "/" ? "*" : `${w}/*`}">.`
    );
  }
  let R = Yt(), E;
  if (o) {
    let w = typeof o == "string" ? sa(o) : o;
    Oe(
      b === "/" || w.pathname?.startsWith(b),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${b}" but pathname "${w.pathname}" was given in the \`location\` prop.`
    ), E = w;
  } else
    E = R;
  let N = E.pathname || "/", B = N;
  if (b !== "/") {
    let w = b.replace(/^\//, "").split("/");
    B = "/" + N.replace(/^\//, "").split("/").slice(w.length).join("/");
  }
  let L = f && f.state.matches.length ? (
    // If we're in a data router, use the matches we've already identified but ensure
    // we have the latest route instances from the manifest in case elements have changed
    f.state.matches.map(
      (w) => Object.assign(w, {
        route: f.manifest[w.route.id] || w.route
      })
    )
  ) : Vh(i, { pathname: B });
  _t(
    p || L != null,
    `No routes matched location "${E.pathname}${E.search}${E.hash}" `
  ), _t(
    L == null || L[L.length - 1].route.element !== void 0 || L[L.length - 1].route.Component !== void 0 || L[L.length - 1].route.lazy !== void 0,
    `Matched leaf route at location "${E.pathname}${E.search}${E.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`
  );
  let q = B0(
    L && L.map(
      (w) => Object.assign({}, w, {
        params: Object.assign({}, v, w.params),
        pathname: Zt([
          b,
          // Re-encode pathnames that were decoded inside matchRoutes.
          // Pre-encode `%`, `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          s.encodeLocation ? s.encodeLocation(
            w.pathname.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : w.pathname
        ]),
        pathnameBase: w.pathnameBase === "/" ? b : Zt([
          b,
          // Re-encode pathnames that were decoded inside matchRoutes
          // Pre-encode `%`, `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          s.encodeLocation ? s.encodeLocation(
            w.pathnameBase.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : w.pathnameBase
        ])
      })
    ),
    h,
    f
  );
  return o && q ? /* @__PURE__ */ j.createElement(
    Fn.Provider,
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
    q
  ) : q;
}
function D0() {
  let i = X0(), o = g0(i) ? `${i.status} ${i.statusText}` : i instanceof Error ? i.message : JSON.stringify(i), f = i instanceof Error ? i.stack : null, s = "rgba(200,200,200, 0.5)", h = { padding: "0.5rem", backgroundColor: s }, m = { padding: "2px 4px", backgroundColor: s }, v = null;
  return console.error(
    "Error handled by React Router default ErrorBoundary:",
    i
  ), v = /* @__PURE__ */ j.createElement(j.Fragment, null, /* @__PURE__ */ j.createElement("p", null, "💿 Hey developer 👋"), /* @__PURE__ */ j.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /* @__PURE__ */ j.createElement("code", { style: m }, "ErrorBoundary"), " or", " ", /* @__PURE__ */ j.createElement("code", { style: m }, "errorElement"), " prop on your route.")), /* @__PURE__ */ j.createElement(j.Fragment, null, /* @__PURE__ */ j.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ j.createElement("h3", { style: { fontStyle: "italic" } }, o), f ? /* @__PURE__ */ j.createElement("pre", { style: h }, f) : null, v);
}
var U0 = /* @__PURE__ */ j.createElement(D0, null), im = class extends j.Component {
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
  static getDerivedStateFromProps(i, o) {
    return o.location !== i.location || o.revalidation !== "idle" && i.revalidation === "idle" ? {
      error: i.error,
      location: i.location,
      revalidation: i.revalidation
    } : {
      error: i.error !== void 0 ? i.error : o.error,
      location: o.location,
      revalidation: i.revalidation || o.revalidation
    };
  }
  componentDidCatch(i, o) {
    this.props.onError ? this.props.onError(i, o) : console.error(
      "React Router caught the following error during render",
      i
    );
  }
  render() {
    let i = this.state.error;
    if (this.context && typeof i == "object" && i && "digest" in i && typeof i.digest == "string") {
      const f = R0(i.digest);
      f && (i = f);
    }
    let o = i !== void 0 ? /* @__PURE__ */ j.createElement(Ft.Provider, { value: this.props.routeContext }, /* @__PURE__ */ j.createElement(
      hr.Provider,
      {
        value: i,
        children: this.props.component
      }
    )) : this.props.children;
    return this.context ? /* @__PURE__ */ j.createElement(H0, { error: i }, o) : o;
  }
};
im.contextType = em;
var nr = /* @__PURE__ */ new WeakMap();
function H0({
  children: i,
  error: o
}) {
  let { basename: f } = j.useContext(Et);
  if (typeof o == "object" && o && "digest" in o && typeof o.digest == "string") {
    let s = A0(o.digest);
    if (s) {
      let h = nr.get(o);
      if (h) throw h;
      let m = Ph(s.location, f), v = m.absoluteURL || m.to;
      if (_0(v))
        throw new Error("Invalid redirect location");
      if (Fh && !nr.get(o))
        if (m.isExternal || s.reloadDocument)
          window.location.href = v;
        else {
          const y = Promise.resolve().then(
            () => window.__reactRouterDataRouter.navigate(m.to, {
              replace: s.replace
            })
          );
          throw nr.set(o, y), y;
        }
      return /* @__PURE__ */ j.createElement("meta", { httpEquiv: "refresh", content: `0;url=${v}` });
    }
  }
  return i;
}
function w0({ routeContext: i, match: o, children: f }) {
  let s = j.useContext(ka);
  return s && s.static && s.staticContext && (o.route.errorElement || o.route.ErrorBoundary) && (s.staticContext._deepestRenderedBoundaryId = o.route.id), /* @__PURE__ */ j.createElement(Ft.Provider, { value: i }, f);
}
function B0(i, o = [], f) {
  let s = f?.state;
  if (i == null) {
    if (!s)
      return null;
    if (s.errors)
      i = s.matches;
    else if (o.length === 0 && !s.initialized && s.matches.length > 0)
      i = s.matches;
    else
      return null;
  }
  let h = i, m = s?.errors;
  if (m != null) {
    let R = h.findIndex(
      (E) => E.route.id && m?.[E.route.id] !== void 0
    );
    Oe(
      R >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(
        m
      ).join(",")}`
    ), h = h.slice(
      0,
      Math.min(h.length, R + 1)
    );
  }
  let v = !1, y = -1;
  if (f && s) {
    v = s.renderFallback;
    for (let R = 0; R < h.length; R++) {
      let E = h[R];
      if ((E.route.HydrateFallback || E.route.hydrateFallbackElement) && (y = R), E.route.id) {
        let { loaderData: N, errors: B } = s, L = E.route.loader && !N.hasOwnProperty(E.route.id) && (!B || B[E.route.id] === void 0);
        if (E.route.lazy || L) {
          f.isStatic && (v = !0), y >= 0 ? h = h.slice(0, y + 1) : h = [h[0]];
          break;
        }
      }
    }
  }
  let b = f?.onError, p = s && b ? (R, E) => {
    b(R, {
      location: s.location,
      params: s.matches?.[0]?.params ?? {},
      pattern: b0(s.matches),
      errorInfo: E
    });
  } : void 0;
  return h.reduceRight(
    (R, E, N) => {
      let B, L = !1, q = null, w = null;
      s && (B = m && E.route.id ? m[E.route.id] : void 0, q = E.route.errorElement || U0, v && (y < 0 && N === 0 ? (cm(
        "route-fallback",
        !1,
        "No `HydrateFallback` element provided to render during initial hydration"
      ), L = !0, w = null) : y === N && (L = !0, w = E.route.hydrateFallbackElement || null)));
      let V = o.concat(h.slice(0, N + 1)), k = () => {
        let X;
        return B ? X = q : L ? X = w : E.route.Component ? X = /* @__PURE__ */ j.createElement(E.route.Component, null) : E.route.element ? X = E.route.element : X = R, /* @__PURE__ */ j.createElement(
          w0,
          {
            match: E,
            routeContext: {
              outlet: R,
              matches: V,
              isDataRoute: s != null
            },
            children: X
          }
        );
      };
      return s && (E.route.ErrorBoundary || E.route.errorElement || N === 0) ? /* @__PURE__ */ j.createElement(
        im,
        {
          location: s.location,
          revalidation: s.revalidation,
          component: q,
          error: B,
          children: k(),
          routeContext: { outlet: null, matches: V, isDataRoute: !0 },
          onError: p
        }
      ) : k();
    },
    null
  );
}
function mr(i) {
  return `${i} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function L0(i) {
  let o = j.useContext(ka);
  return Oe(o, mr(i)), o;
}
function q0(i) {
  let o = j.useContext(Ai);
  return Oe(o, mr(i)), o;
}
function Y0(i) {
  let o = j.useContext(Ft);
  return Oe(o, mr(i)), o;
}
function pr(i) {
  let o = Y0(i), f = o.matches[o.matches.length - 1];
  return Oe(
    f.route.id,
    `${i} can only be used on routes that contain a unique "id"`
  ), f.route.id;
}
function G0() {
  return pr(
    "useRouteId"
    /* UseRouteId */
  );
}
function X0() {
  let i = j.useContext(hr), o = q0(
    "useRouteError"
    /* UseRouteError */
  ), f = pr(
    "useRouteError"
    /* UseRouteError */
  );
  return i !== void 0 ? i : o.errors?.[f];
}
function Q0() {
  let { router: i } = L0(
    "useNavigate"
    /* UseNavigateStable */
  ), o = pr(
    "useNavigate"
    /* UseNavigateStable */
  ), f = j.useRef(!1);
  return nm(() => {
    f.current = !0;
  }), j.useCallback(
    async (h, m = {}) => {
      _t(f.current, am), f.current && (typeof h == "number" ? await i.navigate(h) : await i.navigate(h, { fromRouteId: o, ...m }));
    },
    [i, o]
  );
}
var Lh = {};
function cm(i, o, f) {
  !o && !Lh[i] && (Lh[i] = !0, _t(!1, f));
}
j.memo(Z0);
function Z0({
  routes: i,
  manifest: o,
  future: f,
  state: s,
  isStatic: h,
  onError: m
}) {
  return um(i, void 0, {
    manifest: o,
    state: s,
    isStatic: h,
    onError: m
  });
}
function gi({
  to: i,
  replace: o,
  state: f,
  relative: s
}) {
  Oe(
    $a(),
    // TODO: This error is probably because they somehow have 2 versions of
    // the router loaded. We can help them understand how to avoid that.
    "<Navigate> may be used only in the context of a <Router> component."
  );
  let { static: h } = j.useContext(Et);
  _t(
    !h,
    "<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change."
  );
  let { matches: m } = j.useContext(Ft), { pathname: v } = Yt(), y = ra(), b = Ni(
    i,
    dr(m),
    v,
    s === "path"
  ), p = JSON.stringify(b);
  return j.useEffect(() => {
    y(JSON.parse(p), { replace: o, state: f, relative: s });
  }, [y, p, s, o, f]), null;
}
function Re(i) {
  Oe(
    !1,
    "A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>."
  );
}
function V0({
  basename: i = "/",
  children: o = null,
  location: f,
  navigationType: s = "POP",
  navigator: h,
  static: m = !1,
  useTransitions: v
}) {
  Oe(
    !$a(),
    "You cannot render a <Router> inside another <Router>. You should never have more than one in your app."
  );
  let y = i.replace(/^\/*/, "/"), b = j.useMemo(
    () => ({
      basename: y,
      navigator: h,
      static: m,
      useTransitions: v,
      future: {}
    }),
    [y, h, m, v]
  );
  typeof f == "string" && (f = sa(f));
  let {
    pathname: p = "/",
    search: R = "",
    hash: E = "",
    state: N = null,
    key: B = "default",
    mask: L
  } = f, q = j.useMemo(() => {
    let w = yl(p, y);
    return w == null ? null : {
      location: {
        pathname: w,
        search: R,
        hash: E,
        state: N,
        key: B,
        mask: L
      },
      navigationType: s
    };
  }, [y, p, R, E, N, B, s, L]);
  return _t(
    q != null,
    `<Router basename="${y}"> is not able to match the URL "${p}${R}${E}" because it does not start with the basename, so the <Router> won't render anything.`
  ), q == null ? null : /* @__PURE__ */ j.createElement(Et.Provider, { value: b }, /* @__PURE__ */ j.createElement(Fn.Provider, { children: o, value: q }));
}
function K0({
  children: i,
  location: o
}) {
  return M0(sr(i), o);
}
function sr(i, o = []) {
  let f = [];
  return j.Children.forEach(i, (s, h) => {
    if (!j.isValidElement(s))
      return;
    let m = [...o, h];
    if (s.type === j.Fragment) {
      f.push.apply(
        f,
        sr(s.props.children, m)
      );
      return;
    }
    Oe(
      s.type === Re,
      `[${typeof s.type == "string" ? s.type : s.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`
    ), Oe(
      !s.props.index || !s.props.children,
      "An index route cannot have child routes."
    );
    let v = {
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
    s.props.children && (v.children = sr(
      s.props.children,
      m
    )), f.push(v);
  }), f;
}
var Si = "get", _i = "application/x-www-form-urlencoded";
function Ri(i) {
  return typeof HTMLElement < "u" && i instanceof HTMLElement;
}
function J0(i) {
  return Ri(i) && i.tagName.toLowerCase() === "button";
}
function k0(i) {
  return Ri(i) && i.tagName.toLowerCase() === "form";
}
function $0(i) {
  return Ri(i) && i.tagName.toLowerCase() === "input";
}
function W0(i) {
  return !!(i.metaKey || i.altKey || i.ctrlKey || i.shiftKey);
}
function F0(i, o) {
  return i.button === 0 && // Ignore everything but left clicks
  (!o || o === "_self") && // Let browser handle "target=_blank" etc.
  !W0(i);
}
function rr(i = "") {
  return new URLSearchParams(
    typeof i == "string" || Array.isArray(i) || i instanceof URLSearchParams ? i : Object.keys(i).reduce((o, f) => {
      let s = i[f];
      return o.concat(
        Array.isArray(s) ? s.map((h) => [f, h]) : [[f, s]]
      );
    }, [])
  );
}
function P0(i, o) {
  let f = rr(i);
  return o && o.forEach((s, h) => {
    f.has(h) || o.getAll(h).forEach((m) => {
      f.append(h, m);
    });
  }), f;
}
var bi = null;
function I0() {
  if (bi === null)
    try {
      new FormData(
        document.createElement("form"),
        // @ts-expect-error if FormData supports the submitter parameter, this will throw
        0
      ), bi = !1;
    } catch {
      bi = !0;
    }
  return bi;
}
var ey = /* @__PURE__ */ new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
]);
function ur(i) {
  return i != null && !ey.has(i) ? (_t(
    !1,
    `"${i}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${_i}"`
  ), null) : i;
}
function ty(i, o) {
  let f, s, h, m, v;
  if (k0(i)) {
    let y = i.getAttribute("action");
    s = y ? yl(y, o) : null, f = i.getAttribute("method") || Si, h = ur(i.getAttribute("enctype")) || _i, m = new FormData(i);
  } else if (J0(i) || $0(i) && (i.type === "submit" || i.type === "image")) {
    let y = i.form;
    if (y == null)
      throw new Error(
        'Cannot submit a <button> or <input type="submit"> without a <form>'
      );
    let b = i.getAttribute("formaction") || y.getAttribute("action");
    if (s = b ? yl(b, o) : null, f = i.getAttribute("formmethod") || y.getAttribute("method") || Si, h = ur(i.getAttribute("formenctype")) || ur(y.getAttribute("enctype")) || _i, m = new FormData(y, i), !I0()) {
      let { name: p, type: R, value: E } = i;
      if (R === "image") {
        let N = p ? `${p}.` : "";
        m.append(`${N}x`, "0"), m.append(`${N}y`, "0");
      } else p && m.append(p, E);
    }
  } else {
    if (Ri(i))
      throw new Error(
        'Cannot submit element that is not <form>, <button>, or <input type="submit|image">'
      );
    f = Si, s = null, h = _i, v = i;
  }
  return m && h === "text/plain" && (v = m, m = void 0), { action: s, method: f.toLowerCase(), encType: h, formData: m, body: v };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function vr(i, o) {
  if (i === !1 || i === null || typeof i > "u")
    throw new Error(o);
}
function sm(i, o, f, s) {
  let h = typeof i == "string" ? new URL(
    i,
    // This can be called during the SSR flow via PrefetchPageLinksImpl so
    // don't assume window is available
    typeof window > "u" ? "server://singlefetch/" : window.location.origin
  ) : i;
  return f ? h.pathname.endsWith("/") ? h.pathname = `${h.pathname}_.${s}` : h.pathname = `${h.pathname}.${s}` : h.pathname === "/" ? h.pathname = `_root.${s}` : o && yl(h.pathname, o) === "/" ? h.pathname = `${Ti(o)}/_root.${s}` : h.pathname = `${Ti(h.pathname)}.${s}`, h;
}
async function ly(i, o) {
  if (i.id in o)
    return o[i.id];
  try {
    let f = await import(
      /* @vite-ignore */
      /* webpackIgnore: true */
      i.module
    );
    return o[i.id] = f, f;
  } catch (f) {
    return console.error(
      `Error loading route module \`${i.module}\`, reloading page...`
    ), console.error(f), window.__reactRouterContext && window.__reactRouterContext.isSpaMode, window.location.reload(), new Promise(() => {
    });
  }
}
function ay(i) {
  return i == null ? !1 : i.href == null ? i.rel === "preload" && typeof i.imageSrcSet == "string" && typeof i.imageSizes == "string" : typeof i.rel == "string" && typeof i.href == "string";
}
async function ny(i, o, f) {
  let s = await Promise.all(
    i.map(async (h) => {
      let m = o.routes[h.route.id];
      if (m) {
        let v = await ly(m, f);
        return v.links ? v.links() : [];
      }
      return [];
    })
  );
  return sy(
    s.flat(1).filter(ay).filter((h) => h.rel === "stylesheet" || h.rel === "preload").map(
      (h) => h.rel === "stylesheet" ? { ...h, rel: "prefetch", as: "style" } : { ...h, rel: "prefetch" }
    )
  );
}
function qh(i, o, f, s, h, m) {
  let v = (b, p) => f[p] ? b.route.id !== f[p].route.id : !0, y = (b, p) => (
    // param change, /users/123 -> /users/456
    f[p].pathname !== b.pathname || // splat param changed, which is not present in match.path
    // e.g. /files/images/avatar.jpg -> files/finances.xls
    f[p].route.path?.endsWith("*") && f[p].params["*"] !== b.params["*"]
  );
  return m === "assets" ? o.filter(
    (b, p) => v(b, p) || y(b, p)
  ) : m === "data" ? o.filter((b, p) => {
    let R = s.routes[b.route.id];
    if (!R || !R.hasLoader)
      return !1;
    if (v(b, p) || y(b, p))
      return !0;
    if (b.route.shouldRevalidate) {
      let E = b.route.shouldRevalidate({
        currentUrl: new URL(
          h.pathname + h.search + h.hash,
          window.origin
        ),
        currentParams: f[0]?.params || {},
        nextUrl: new URL(i, window.origin),
        nextParams: b.params,
        defaultShouldRevalidate: !0
      });
      if (typeof E == "boolean")
        return E;
    }
    return !0;
  }) : [];
}
function uy(i, o, { includeHydrateFallback: f } = {}) {
  return iy(
    i.map((s) => {
      let h = o.routes[s.route.id];
      if (!h) return [];
      let m = [h.module];
      return h.clientActionModule && (m = m.concat(h.clientActionModule)), h.clientLoaderModule && (m = m.concat(h.clientLoaderModule)), f && h.hydrateFallbackModule && (m = m.concat(h.hydrateFallbackModule)), h.imports && (m = m.concat(h.imports)), m;
    }).flat(1)
  );
}
function iy(i) {
  return [...new Set(i)];
}
function cy(i) {
  let o = {}, f = Object.keys(i).sort();
  for (let s of f)
    o[s] = i[s];
  return o;
}
function sy(i, o) {
  let f = /* @__PURE__ */ new Set();
  return new Set(o), i.reduce((s, h) => {
    let m = JSON.stringify(cy(h));
    return f.has(m) || (f.add(m), s.push({ key: m, link: h })), s;
  }, []);
}
function yr() {
  let i = j.useContext(ka);
  return vr(
    i,
    "You must render this element inside a <DataRouterContext.Provider> element"
  ), i;
}
function ry() {
  let i = j.useContext(Ai);
  return vr(
    i,
    "You must render this element inside a <DataRouterStateContext.Provider> element"
  ), i;
}
var gr = j.createContext(void 0);
gr.displayName = "FrameworkContext";
function Oi() {
  let i = j.useContext(gr);
  return vr(
    i,
    "You must render this element inside a <HydratedRouter> element"
  ), i;
}
function oy(i, o) {
  let f = j.useContext(gr), [s, h] = j.useState(!1), [m, v] = j.useState(!1), { onFocus: y, onBlur: b, onMouseEnter: p, onMouseLeave: R, onTouchStart: E } = o, N = j.useRef(null);
  j.useEffect(() => {
    if (i === "render" && v(!0), i === "viewport") {
      let q = (V) => {
        V.forEach((k) => {
          v(k.isIntersecting);
        });
      }, w = new IntersectionObserver(q, { threshold: 0.5 });
      return N.current && w.observe(N.current), () => {
        w.disconnect();
      };
    }
  }, [i]), j.useEffect(() => {
    if (s) {
      let q = setTimeout(() => {
        v(!0);
      }, 100);
      return () => {
        clearTimeout(q);
      };
    }
  }, [s]);
  let B = () => {
    h(!0);
  }, L = () => {
    h(!1), v(!1);
  };
  return f ? i !== "intent" ? [m, N, {}] : [
    m,
    N,
    {
      onFocus: Kn(y, B),
      onBlur: Kn(b, L),
      onMouseEnter: Kn(p, B),
      onMouseLeave: Kn(R, L),
      onTouchStart: Kn(E, B)
    }
  ] : [!1, N, {}];
}
function Kn(i, o) {
  return (f) => {
    i && i(f), f.defaultPrevented || o(f);
  };
}
function fy({ page: i, ...o }) {
  let f = E0(), { nonce: s } = Oi(), { router: h } = yr(), m = j.useMemo(
    () => Vh(h.routes, i, h.basename),
    [h.routes, i, h.basename]
  );
  return m ? (o.nonce == null && s && (o = { ...o, nonce: s }), f ? /* @__PURE__ */ j.createElement(hy, { page: i, matches: m, ...o }) : /* @__PURE__ */ j.createElement(my, { page: i, matches: m, ...o })) : null;
}
function dy(i) {
  let { manifest: o, routeModules: f } = Oi(), [s, h] = j.useState([]);
  return j.useEffect(() => {
    let m = !1;
    return ny(i, o, f).then(
      (v) => {
        m || h(v);
      }
    ), () => {
      m = !0;
    };
  }, [i, o, f]), s;
}
function hy({
  page: i,
  matches: o,
  ...f
}) {
  let s = Yt(), { future: h } = Oi(), { basename: m } = yr(), v = j.useMemo(() => {
    if (i === s.pathname + s.search + s.hash)
      return [];
    let y = sm(
      i,
      m,
      h.v8_trailingSlashAwareDataRequests,
      "rsc"
    ), b = !1, p = [];
    for (let R of o)
      typeof R.route.shouldRevalidate == "function" ? b = !0 : p.push(R.route.id);
    return b && p.length > 0 && y.searchParams.set("_routes", p.join(",")), [y.pathname + y.search];
  }, [
    m,
    h.v8_trailingSlashAwareDataRequests,
    i,
    s,
    o
  ]);
  return /* @__PURE__ */ j.createElement(j.Fragment, null, v.map((y) => /* @__PURE__ */ j.createElement("link", { key: y, rel: "prefetch", as: "fetch", href: y, ...f })));
}
function my({
  page: i,
  matches: o,
  ...f
}) {
  let s = Yt(), { future: h, manifest: m, routeModules: v } = Oi(), { basename: y } = yr(), { loaderData: b, matches: p } = ry(), R = j.useMemo(
    () => qh(
      i,
      o,
      p,
      m,
      s,
      "data"
    ),
    [i, o, p, m, s]
  ), E = j.useMemo(
    () => qh(
      i,
      o,
      p,
      m,
      s,
      "assets"
    ),
    [i, o, p, m, s]
  ), N = j.useMemo(() => {
    if (i === s.pathname + s.search + s.hash)
      return [];
    let q = /* @__PURE__ */ new Set(), w = !1;
    if (o.forEach((k) => {
      let X = m.routes[k.route.id];
      !X || !X.hasLoader || (!R.some((le) => le.route.id === k.route.id) && k.route.id in b && v[k.route.id]?.shouldRevalidate || X.hasClientLoader ? w = !0 : q.add(k.route.id));
    }), q.size === 0)
      return [];
    let V = sm(
      i,
      y,
      h.v8_trailingSlashAwareDataRequests,
      "data"
    );
    return w && q.size > 0 && V.searchParams.set(
      "_routes",
      o.filter((k) => q.has(k.route.id)).map((k) => k.route.id).join(",")
    ), [V.pathname + V.search];
  }, [
    y,
    h.v8_trailingSlashAwareDataRequests,
    b,
    s,
    m,
    R,
    o,
    i,
    v
  ]), B = j.useMemo(
    () => uy(E, m),
    [E, m]
  ), L = dy(E);
  return /* @__PURE__ */ j.createElement(j.Fragment, null, N.map((q) => /* @__PURE__ */ j.createElement("link", { key: q, rel: "prefetch", as: "fetch", href: q, ...f })), B.map((q) => /* @__PURE__ */ j.createElement("link", { key: q, rel: "modulepreload", href: q, ...f })), L.map(({ key: q, link: w }) => (
    // these don't spread `linkProps` because they are full link descriptors
    // already with their own props
    /* @__PURE__ */ j.createElement(
      "link",
      {
        key: q,
        nonce: f.nonce,
        ...w,
        crossOrigin: w.crossOrigin ?? f.crossOrigin
      }
    )
  )));
}
function py(...i) {
  return (o) => {
    i.forEach((f) => {
      typeof f == "function" ? f(o) : f != null && (f.current = o);
    });
  };
}
var vy = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
try {
  vy && (window.__reactRouterVersion = // @ts-expect-error
  "7.18.2");
} catch {
}
function yy({
  basename: i,
  children: o,
  useTransitions: f,
  window: s
}) {
  let h = j.useRef();
  h.current == null && (h.current = $v({ window: s, v5Compat: !0 }));
  let m = h.current, [v, y] = j.useState({
    action: m.action,
    location: m.location
  }), b = j.useCallback(
    (p) => {
      f === !1 ? y(p) : j.startTransition(() => y(p));
    },
    [f]
  );
  return j.useLayoutEffect(() => m.listen(b), [m, b]), /* @__PURE__ */ j.createElement(
    V0,
    {
      basename: i,
      children: o,
      location: v.location,
      navigationType: v.action,
      navigator: m,
      useTransitions: f
    }
  );
}
var Lt = j.forwardRef(
  function({
    onClick: o,
    discover: f = "render",
    prefetch: s = "none",
    relative: h,
    reloadDocument: m,
    replace: v,
    mask: y,
    state: b,
    target: p,
    to: R,
    preventScrollReset: E,
    viewTransition: N,
    defaultShouldRevalidate: B,
    ...L
  }, q) {
    let { basename: w, navigator: V, useTransitions: k } = j.useContext(Et), X = typeof R == "string" && fr.test(R), le = Ph(R, w);
    R = le.to;
    let fe = O0(R, { relative: h }), Te = Yt(), W = null;
    if (y) {
      let Le = Ni(
        y,
        [],
        Te.mask ? Te.mask.pathname : "/",
        !0
      );
      w !== "/" && (Le.pathname = Le.pathname === "/" ? w : Zt([w, Le.pathname])), W = V.createHref(Le);
    }
    let [Ce, oe, Vt] = oy(
      s,
      L
    ), jt = xy(R, {
      replace: v,
      mask: y,
      state: b,
      target: p,
      preventScrollReset: E,
      relative: h,
      viewTransition: N,
      defaultShouldRevalidate: B,
      useTransitions: k
    });
    function Ie(Le) {
      o && o(Le), Le.defaultPrevented || jt(Le);
    }
    let Kt = !(le.isExternal || m), Tt = (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      /* @__PURE__ */ j.createElement(
        "a",
        {
          ...L,
          ...Vt,
          href: (Kt ? W : void 0) || le.absoluteURL || fe,
          onClick: Kt ? Ie : o,
          ref: py(q, oe),
          target: p,
          "data-discover": !X && f === "render" ? "true" : void 0
        }
      )
    );
    return Ce && !X ? /* @__PURE__ */ j.createElement(j.Fragment, null, Tt, /* @__PURE__ */ j.createElement(fy, { page: fe })) : Tt;
  }
);
Lt.displayName = "Link";
var Ei = j.forwardRef(
  function({
    "aria-current": o = "page",
    caseSensitive: f = !1,
    className: s = "",
    end: h = !1,
    style: m,
    to: v,
    viewTransition: y,
    children: b,
    ...p
  }, R) {
    let E = Pn(v, { relative: p.relative }), N = Yt(), B = j.useContext(Ai), { navigator: L, basename: q } = j.useContext(Et), w = B != null && // Conditional usage is OK here because the usage of a data router is static
    // eslint-disable-next-line react-hooks/rules-of-hooks
    zy(E) && y === !0, V = L.encodeLocation ? L.encodeLocation(E).pathname : E.pathname, k = N.pathname, X = B && B.navigation && B.navigation.location ? B.navigation.location.pathname : null;
    f || (k = k.toLowerCase(), X = X ? X.toLowerCase() : null, V = V.toLowerCase()), X && q && (X = yl(X, q) || X);
    const le = V !== "/" && V.endsWith("/") ? V.length - 1 : V.length;
    let fe = k === V || !h && k.startsWith(V) && k.charAt(le) === "/", Te = X != null && (X === V || !h && X.startsWith(V) && X.charAt(V.length) === "/"), W = {
      isActive: fe,
      isPending: Te,
      isTransitioning: w
    }, Ce = fe ? o : void 0, oe;
    typeof s == "function" ? oe = s(W) : oe = [
      s,
      fe ? "active" : null,
      Te ? "pending" : null,
      w ? "transitioning" : null
    ].filter(Boolean).join(" ");
    let Vt = typeof m == "function" ? m(W) : m;
    return /* @__PURE__ */ j.createElement(
      Lt,
      {
        ...p,
        "aria-current": Ce,
        className: oe,
        ref: R,
        style: Vt,
        to: v,
        viewTransition: y
      },
      typeof b == "function" ? b(W) : b
    );
  }
);
Ei.displayName = "NavLink";
var gy = j.forwardRef(
  ({
    discover: i = "render",
    fetcherKey: o,
    navigate: f,
    reloadDocument: s,
    replace: h,
    state: m,
    method: v = Si,
    action: y,
    onSubmit: b,
    relative: p,
    preventScrollReset: R,
    viewTransition: E,
    defaultShouldRevalidate: N,
    ...B
  }, L) => {
    let { useTransitions: q } = j.useContext(Et), w = jy(), V = Ty(y, { relative: p }), k = v.toLowerCase() === "get" ? "get" : "post", X = typeof y == "string" && fr.test(y), le = (fe) => {
      if (b && b(fe), fe.defaultPrevented) return;
      fe.preventDefault();
      let Te = fe.nativeEvent.submitter, W = Te?.getAttribute("formmethod") || v, Ce = () => w(Te || fe.currentTarget, {
        fetcherKey: o,
        method: W,
        navigate: f,
        replace: h,
        state: m,
        relative: p,
        preventScrollReset: R,
        viewTransition: E,
        defaultShouldRevalidate: N
      });
      q && f !== !1 ? j.startTransition(() => Ce()) : Ce();
    };
    return /* @__PURE__ */ j.createElement(
      "form",
      {
        ref: L,
        method: k,
        action: V,
        onSubmit: s ? b : le,
        ...B,
        "data-discover": !X && i === "render" ? "true" : void 0
      }
    );
  }
);
gy.displayName = "Form";
function by(i) {
  return `${i} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function rm(i) {
  let o = j.useContext(ka);
  return Oe(o, by(i)), o;
}
function xy(i, {
  target: o,
  replace: f,
  mask: s,
  state: h,
  preventScrollReset: m,
  relative: v,
  viewTransition: y,
  defaultShouldRevalidate: b,
  useTransitions: p
} = {}) {
  let R = ra(), E = Yt(), N = Pn(i, { relative: v });
  return j.useCallback(
    (B) => {
      if (F0(B, o)) {
        B.preventDefault();
        let L = f !== void 0 ? f : Wn(E) === Wn(N), q = () => R(i, {
          replace: L,
          mask: s,
          state: h,
          preventScrollReset: m,
          relative: v,
          viewTransition: y,
          defaultShouldRevalidate: b
        });
        p ? j.startTransition(() => q()) : q();
      }
    },
    [
      E,
      R,
      N,
      f,
      s,
      h,
      o,
      i,
      m,
      v,
      y,
      b,
      p
    ]
  );
}
function Sy(i) {
  _t(
    typeof URLSearchParams < "u",
    "You cannot use the `useSearchParams` hook in a browser that does not support the URLSearchParams API. If you need to support Internet Explorer 11, we recommend you load a polyfill such as https://github.com/ungap/url-search-params."
  );
  let o = j.useRef(rr(i)), f = j.useRef(!1), s = Yt(), h = j.useMemo(
    () => (
      // Only merge in the defaults if we haven't yet called setSearchParams.
      // Once we call that we want those to take precedence, otherwise you can't
      // remove a param with setSearchParams({}) if it has an initial value
      P0(
        s.search,
        f.current ? null : o.current
      )
    ),
    [s.search]
  ), m = ra(), v = j.useCallback(
    (y, b) => {
      const p = rr(
        typeof y == "function" ? y(new URLSearchParams(h)) : y
      );
      f.current = !0, m("?" + p, b);
    },
    [m, h]
  );
  return [h, v];
}
var _y = 0, Ey = () => `__${String(++_y)}__`;
function jy() {
  let { router: i } = rm(
    "useSubmit"
    /* UseSubmit */
  ), { basename: o } = j.useContext(Et), f = G0(), s = i.fetch, h = i.navigate;
  return j.useCallback(
    async (m, v = {}) => {
      let { action: y, method: b, encType: p, formData: R, body: E } = ty(
        m,
        o
      );
      if (v.navigate === !1) {
        let N = v.fetcherKey || Ey();
        await s(N, f, v.action || y, {
          defaultShouldRevalidate: v.defaultShouldRevalidate,
          preventScrollReset: v.preventScrollReset,
          formData: R,
          body: E,
          formMethod: v.method || b,
          formEncType: v.encType || p,
          flushSync: v.flushSync
        });
      } else
        await h(v.action || y, {
          defaultShouldRevalidate: v.defaultShouldRevalidate,
          preventScrollReset: v.preventScrollReset,
          formData: R,
          body: E,
          formMethod: v.method || b,
          formEncType: v.encType || p,
          replace: v.replace,
          state: v.state,
          fromRouteId: f,
          flushSync: v.flushSync,
          viewTransition: v.viewTransition
        });
    },
    [s, h, o, f]
  );
}
function Ty(i, { relative: o } = {}) {
  let { basename: f } = j.useContext(Et), s = j.useContext(Ft);
  Oe(s, "useFormAction must be used inside a RouteContext");
  let [h] = s.matches.slice(-1), m = { ...Pn(i || ".", { relative: o }) }, v = Yt();
  if (i == null) {
    m.search = v.search;
    let y = new URLSearchParams(m.search), b = y.getAll("index");
    if (b.some((R) => R === "")) {
      y.delete("index"), b.filter((E) => E).forEach((E) => y.append("index", E));
      let R = y.toString();
      m.search = R ? `?${R}` : "";
    }
  }
  return (!i || i === ".") && h.route.index && (m.search = m.search ? m.search.replace(/^\?/, "?index&") : "?index"), f !== "/" && (m.pathname = m.pathname === "/" ? f : Zt([f, m.pathname])), Wn(m);
}
function zy(i, { relative: o } = {}) {
  let f = j.useContext(tm);
  Oe(
    f != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?"
  );
  let { basename: s } = rm(
    "useViewTransitionState"
    /* useViewTransitionState */
  ), h = Pn(i, { relative: o });
  if (!f.isTransitioning)
    return !1;
  let m = yl(f.currentLocation.pathname, s) || f.currentLocation.pathname, v = yl(f.nextLocation.pathname, s) || f.nextLocation.pathname;
  return ji(h.pathname, v) != null || ji(h.pathname, m) != null;
}
const Ny = "/dsc_hub/assets", Ay = {
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
  seat: "icons/dsc-icon-root.svg"
};
function Yh(i) {
  return `${Ny}/${Ay[i]}`;
}
const om = j.createContext(null);
function Ry(i) {
  if (!i) return !1;
  const o = i.toLowerCase();
  return o.includes("dsc_") || o.includes("dsc-") || o.startsWith("sensor.dsc") || o.startsWith("switch.dsc") || o.startsWith("binary_sensor.dsc") || o.startsWith("number.dsc") || o.startsWith("light.dsc") || o.startsWith("input_");
}
function Oy({
  hass: i,
  children: o
}) {
  const [f, s] = j.useState(0);
  j.useEffect(() => {
    if (!i) return;
    s((p) => p + 1);
    const m = i.connection;
    if (!m?.subscribeEvents) return;
    let v, y = !1;
    const b = (p) => {
      const R = p.data?.entity_id;
      Ry(R) && s((E) => E + 1);
    };
    return Promise.resolve(m.subscribeEvents(b, "state_changed")).then((p) => {
      if (y) {
        p();
        return;
      }
      v = p;
    }).catch(() => {
    }), () => {
      y = !0, v?.();
    };
  }, [i]);
  const h = j.useMemo(() => {
    const m = (E) => i?.states?.[E], v = (E) => {
      const N = m(E)?.state;
      return !!N && N !== "unavailable" && N !== "unknown";
    }, y = (E, N = "—") => v(E) ? m(E)?.state ?? N : N;
    return { hass: i, entity: m, state: y, num: (E, N = NaN) => {
      const B = Number(y(E, ""));
      return Number.isFinite(B) ? B : N;
    }, available: v, callService: (E, N, B) => i?.callService ? i.callService(E, N, B) : Promise.resolve(null), callWS: (E) => i?.callWS ? i.callWS(E) : Promise.resolve(null), tick: f };
  }, [i, f]);
  return j.createElement(om.Provider, { value: h }, o);
}
function ft() {
  const i = j.useContext(om);
  if (!i) throw new Error("useHass outside HassProvider");
  return i;
}
function kn({
  name: i,
  size: o = 16,
  className: f,
  color: s = "currentColor"
}) {
  return /* @__PURE__ */ r.jsx(
    "span",
    {
      className: f,
      role: "img",
      "aria-hidden": !0,
      style: {
        display: "inline-block",
        width: o,
        height: o,
        backgroundColor: s,
        WebkitMaskImage: `url(${Yh(i)})`,
        maskImage: `url(${Yh(i)})`,
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
function re({
  title: i,
  children: o,
  className: f = "",
  style: s
}) {
  return /* @__PURE__ */ r.jsxs("section", { className: `dsc-card ${f}`.trim(), style: s, children: [
    i ? /* @__PURE__ */ r.jsx("h3", { children: i }) : null,
    o
  ] });
}
function qt({
  children: i,
  primary: o,
  onClick: f,
  type: s = "button",
  disabled: h
}) {
  return /* @__PURE__ */ r.jsx(
    "button",
    {
      type: s,
      className: `dsc-btn${o ? " primary" : ""}`,
      onClick: f,
      disabled: h,
      children: i
    }
  );
}
function Ue({
  label: i,
  value: o,
  unit: f,
  sub: s,
  tone: h = "normal"
}) {
  const m = h === "ok" ? "dsc-status-ok" : h === "bad" ? "dsc-status-bad" : h === "muted" ? "dsc-status-muted" : "";
  return /* @__PURE__ */ r.jsxs(re, { title: i, children: [
    /* @__PURE__ */ r.jsxs("div", { className: `dsc-kpi-value ${m}`.trim(), children: [
      o,
      f ? /* @__PURE__ */ r.jsx("span", { className: "dsc-kpi-unit", children: f }) : null
    ] }),
    s ? /* @__PURE__ */ r.jsx("div", { className: "dsc-kpi-sub", children: s }) : null
  ] });
}
function Pe({
  title: i,
  subtitle: o
}) {
  return /* @__PURE__ */ r.jsxs("header", { style: { marginBottom: 14 }, children: [
    /* @__PURE__ */ r.jsx("h1", { className: "dsc-page-title", children: i }),
    o ? /* @__PURE__ */ r.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: o }) : null
  ] });
}
function je({
  label: i,
  tone: o = "muted",
  pulse: f
}) {
  return /* @__PURE__ */ r.jsx("span", { className: `dsc-chip dsc-chip--${o}${f ? " dsc-chip--pulse" : ""}`, children: i });
}
function vl({
  entityId: i,
  label: o,
  warnWhenMissing: f
}) {
  const { state: s, available: h, callService: m, entity: v } = ft(), y = s(i, "off") === "on", b = h(i), p = i.split(".")[0], R = () => {
    if (b) {
      if (p === "switch" || p === "input_boolean") {
        m("homeassistant", "toggle", { entity_id: i });
        return;
      }
      p === "light" && m("light", y ? "turn_off" : "turn_on", { entity_id: i });
    }
  }, E = p === "light" && y ? Math.round(Number(v(i)?.attributes?.brightness ?? 0) / 255 * 100) : null;
  return /* @__PURE__ */ r.jsxs(
    "button",
    {
      type: "button",
      className: `dsc-demand${y ? " is-on" : ""}${b ? "" : " is-missing"}`,
      onClick: R,
      disabled: !b && !f,
      title: b ? i : f || `${i} unavailable`,
      children: [
        /* @__PURE__ */ r.jsx("span", { className: "dsc-demand-label", children: o }),
        /* @__PURE__ */ r.jsx("span", { className: "dsc-demand-state", children: b ? E != null ? `${E}%` : y ? "ON" : "OFF" : f || "—" })
      ]
    }
  );
}
function xi({
  entityId: i,
  label: o
}) {
  const { state: f, available: s } = ft(), h = s(i) && f(i) === "on";
  return /* @__PURE__ */ r.jsxs("span", { className: `dsc-chip ${h ? "dsc-chip--ok dsc-chip--pulse" : "dsc-chip--muted"}`, children: [
    o,
    " ",
    h ? "ESP" : "HA"
  ] });
}
function Cy(i) {
  if (typeof i.lu == "number" && Number.isFinite(i.lu))
    return i.lu * 1e3;
  const o = i.last_changed || i.last_updated;
  if (o) {
    const f = Date.parse(o);
    return Number.isFinite(f) ? f : null;
  }
  return null;
}
function My(i) {
  const o = i.s ?? i.state, f = typeof o == "number" ? o : Number(o);
  return Number.isFinite(f) ? f : null;
}
function Dy(i, o) {
  if (i.length <= o) return i;
  const f = [], s = (i.length - 1) / (o - 1);
  for (let h = 0; h < o; h++)
    f.push(i[Math.round(h * s)]);
  return f;
}
function Uy(i, o = 6, f = 96) {
  const { hass: s, callWS: h, available: m } = ft(), [v, y] = j.useState([]), [b, p] = j.useState(!0), [R, E] = j.useState(null);
  return j.useEffect(() => {
    let N = !1;
    async function B() {
      if (!s?.callWS || !i) {
        y([]), p(!1);
        return;
      }
      p(!0), E(null);
      const L = /* @__PURE__ */ new Date(), q = new Date(L.getTime() - o * 3600 * 1e3);
      try {
        const w = await h({
          type: "history/history_during_period",
          start_time: q.toISOString(),
          end_time: L.toISOString(),
          significant_changes_only: !1,
          minimal_response: !0,
          no_attributes: !0,
          entity_ids: [i]
        });
        if (N) return;
        let V = [];
        Array.isArray(w) ? V = w[0] || [] : w && typeof w == "object" && (V = w[i] || []);
        const k = [];
        for (const X of V) {
          const le = Cy(X), fe = My(X);
          le == null || fe == null || k.push({ t: le, v: fe });
        }
        k.sort((X, le) => X.t - le.t), y(Dy(k, f));
      } catch (w) {
        N || (E(w instanceof Error ? w.message : "history unavailable"), y([]));
      } finally {
        N || p(!1);
      }
    }
    return B(), () => {
      N = !0;
    };
  }, [s, h, i, o, f, m]), { points: v, loading: b, error: R };
}
function wt(i, o) {
  const f = o?.maxPoints ?? 96, s = o?.hours ?? 6, { num: h, available: m, tick: v } = ft(), { points: y } = Uy(i, s, f), [b, p] = j.useState([]), R = j.useRef(null), E = j.useRef(!1);
  return j.useEffect(() => {
    E.current = !1, p([]), R.current = null;
  }, [i]), j.useEffect(() => {
    if (y.length && !E.current) {
      E.current = !0;
      const N = y[y.length - 1]?.v;
      Number.isFinite(N) && (R.current = N);
    }
  }, [y]), j.useEffect(() => {
    if (!i || !m(i)) return;
    const N = h(i);
    if (Number.isFinite(N)) {
      if (R.current === N && b.length > 0) {
        const B = Date.now(), L = b[b.length - 1]?.t ?? 0;
        if (B - L < 4e3) return;
      }
      R.current = N, p((B) => [...B, { t: Date.now(), v: N }].slice(-f));
    }
  }, [i, v, m, h, f]), j.useMemo(() => {
    if (!y.length && !b.length) return b;
    if (!b.length) return y;
    if (!y.length) return b;
    const N = b[0]?.t ?? 0, L = [...y.filter((q) => q.t < N - 500), ...b];
    return L.length > f ? L.slice(-f) : L;
  }, [y, b, f]);
}
function Hy(i) {
  const o = Math.max(...i, 1), f = 10 ** Math.floor(Math.log10(o));
  return Math.ceil(o / f) * f;
}
function wy(i, o = !1) {
  const f = Math.min(...i);
  if (o && f >= 0) return 0;
  const s = Math.abs(f) || 1, h = 10 ** Math.floor(Math.log10(s));
  return Math.floor(f / h) * h;
}
function ir(i, o, f, s, h, m, v, y) {
  if (!i.length) return "";
  const b = Math.max(m - h, 1e-6), p = Math.max(y - v, 1), R = o - s.l - s.r, E = f - s.t - s.b;
  return i.map((N, B) => {
    const L = s.l + (N.t - v) / p * R, q = s.t + (1 - (N.v - h) / b) * E;
    return `${B === 0 ? "M" : "L"}${L.toFixed(1)} ${q.toFixed(1)}`;
  }).join(" ");
}
function zi({
  series: i,
  height: o = 160,
  unit: f = "",
  live: s = !0,
  color: h = "var(--dsc-neon)",
  emptyLabel: m = "No history yet"
}) {
  return /* @__PURE__ */ r.jsx(
    $n,
    {
      series: [{ id: "main", label: "", series: i, color: h }],
      height: o,
      unit: f,
      live: s,
      emptyLabel: m
    }
  );
}
function $n({
  series: i,
  height: o = 180,
  unit: f = "",
  live: s = !0,
  emptyLabel: h = "No history yet"
}) {
  const m = j.useId().replace(/:/g, ""), v = 640, y = { l: 36, r: 12, t: 16, b: 22 }, b = ["var(--dsc-neon)", "#7dd3fc", "#fbbf24", "#f472b6"], p = j.useMemo(() => {
    const N = i.flatMap((X) => X.series);
    if (!N.length) return null;
    const B = N.map((X) => X.v), L = Hy(B), q = wy(B, !0), w = Math.min(...N.map((X) => X.t)), V = Math.max(...N.map((X) => X.t)), k = i.map((X, le) => ({
      ...X,
      color: X.color || b[le % b.length],
      d: ir(X.series, v, o, y, q, L, w, V),
      last: X.series.length ? X.series[X.series.length - 1] : null
    }));
    return { min: q, max: L, t0: w, t1: V, paths: k };
  }, [i, o]), R = p?.paths[0]?.last?.v ?? null, E = j.useMemo(() => {
    if (!p) return [];
    const N = 4, B = [];
    for (let L = 0; L <= N; L++) {
      const q = L / N, w = p.max - q * (p.max - p.min), V = y.t + q * (o - y.t - y.b);
      B.push({ y: V, label: w.toFixed(w >= 100 ? 0 : 1) });
    }
    return B;
  }, [p, o]);
  return /* @__PURE__ */ r.jsxs("div", { className: "dsc-chart", style: { position: "relative", width: "100%" }, children: [
    /* @__PURE__ */ r.jsxs(
      "svg",
      {
        viewBox: `0 0 ${v} ${o}`,
        width: "100%",
        height: o,
        role: "img",
        "aria-label": "Live chart",
        children: [
          /* @__PURE__ */ r.jsxs("defs", { children: [
            p?.paths.map((N) => /* @__PURE__ */ r.jsxs("linearGradient", { id: `fill-${m}-${N.id}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ r.jsx("stop", { offset: "0%", stopColor: N.color, stopOpacity: "0.28" }),
              /* @__PURE__ */ r.jsx("stop", { offset: "100%", stopColor: N.color, stopOpacity: "0" })
            ] }, N.id)),
            /* @__PURE__ */ r.jsxs("filter", { id: `glow-${m}`, x: "-30%", y: "-30%", width: "160%", height: "160%", children: [
              /* @__PURE__ */ r.jsx("feGaussianBlur", { stdDeviation: "2.6", result: "b" }),
              /* @__PURE__ */ r.jsxs("feMerge", { children: [
                /* @__PURE__ */ r.jsx("feMergeNode", { in: "b" }),
                /* @__PURE__ */ r.jsx("feMergeNode", { in: "SourceGraphic" })
              ] })
            ] })
          ] }),
          E.map((N) => /* @__PURE__ */ r.jsxs("g", { children: [
            /* @__PURE__ */ r.jsx(
              "line",
              {
                x1: y.l,
                x2: v - y.r,
                y1: N.y,
                y2: N.y,
                stroke: "var(--dsc-gray-3)",
                strokeWidth: "1",
                strokeDasharray: "3 4"
              }
            ),
            /* @__PURE__ */ r.jsx(
              "text",
              {
                x: y.l - 6,
                y: N.y + 3,
                textAnchor: "end",
                fill: "var(--dsc-gray-5)",
                fontSize: "9",
                fontFamily: "var(--dsc-mono)",
                children: N.label
              }
            )
          ] }, N.y)),
          p ? p.paths.map((N) => {
            if (!N.d) return null;
            const B = `${N.d} L${v - y.r} ${o - y.b} L${y.l} ${o - y.b} Z`, L = N.series, q = s && L.length >= 2 ? ir(L.slice(-2), v, o, y, p.min, p.max, p.t0, p.t1) : "", w = s && L.length >= 2 ? ir(L.slice(0, -1), v, o, y, p.min, p.max, p.t0, p.t1) : N.d;
            return /* @__PURE__ */ r.jsxs("g", { children: [
              /* @__PURE__ */ r.jsx("path", { d: B, fill: `url(#fill-${m}-${N.id})`, opacity: 0.9 }),
              /* @__PURE__ */ r.jsx(
                "path",
                {
                  d: w || N.d,
                  fill: "none",
                  stroke: N.color,
                  strokeWidth: "2.2",
                  strokeLinejoin: "round",
                  strokeLinecap: "round",
                  filter: `url(#glow-${m})`,
                  opacity: 0.9
                }
              ),
              q ? /* @__PURE__ */ r.jsx(
                "path",
                {
                  className: "dsc-live-pulse",
                  d: q,
                  fill: "none",
                  stroke: N.color,
                  strokeWidth: "2.8",
                  strokeLinejoin: "round",
                  strokeLinecap: "round",
                  filter: `url(#glow-${m})`,
                  style: { animation: "dsc-line-pulse 2.2s ease-in-out infinite" }
                }
              ) : null
            ] }, N.id);
          }) : /* @__PURE__ */ r.jsx(
            "text",
            {
              x: v / 2,
              y: o / 2,
              textAnchor: "middle",
              fill: "var(--dsc-gray-5)",
              fontSize: "12",
              children: h
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ r.jsxs("div", { className: "dsc-chart-legend", children: [
      i.filter((N) => N.label).map((N, B) => /* @__PURE__ */ r.jsxs("span", { className: "dsc-chart-legend-item", children: [
        /* @__PURE__ */ r.jsx("i", { style: { background: N.color || b[B % b.length] } }),
        N.label
      ] }, N.id)),
      R != null ? /* @__PURE__ */ r.jsxs("span", { className: "dsc-chart-last", children: [
        R.toFixed(1),
        f ? ` ${f}` : ""
      ] }) : null
    ] }),
    /* @__PURE__ */ r.jsx("style", { children: `
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
function By(i, o = 280) {
  const [f, s] = j.useState(i);
  return j.useEffect(() => {
    if (!Number.isFinite(i)) {
      s(i);
      return;
    }
    const h = Number.isFinite(f) ? f : i, m = performance.now();
    let v = 0;
    const y = (b) => {
      const p = Math.min(1, (b - m) / o), R = 1 - (1 - p) ** 3;
      s(h + (i - h) * R), p < 1 && (v = requestAnimationFrame(y));
    };
    return v = requestAnimationFrame(y), () => cancelAnimationFrame(v);
  }, [i, o]), f;
}
function Bt({
  value: i,
  min: o = 0,
  max: f = 100,
  label: s,
  unit: h = ""
}) {
  const m = By(Number.isFinite(i) ? i : o), y = (Math.min(f, Math.max(o, Number.isFinite(m) ? m : o)) - o) / Math.max(f - o, 1e-6), p = 2 * Math.PI * 46 * 0.75, R = p * y;
  return /* @__PURE__ */ r.jsxs("div", { className: "dsc-gauge", children: [
    /* @__PURE__ */ r.jsxs("svg", { viewBox: "0 0 120 90", width: "140", height: "105", "aria-label": s, children: [
      /* @__PURE__ */ r.jsx("defs", { children: /* @__PURE__ */ r.jsxs("filter", { id: "dsc-gauge-glow", x: "-40%", y: "-40%", width: "180%", height: "180%", children: [
        /* @__PURE__ */ r.jsx("feGaussianBlur", { stdDeviation: "3.2", result: "b" }),
        /* @__PURE__ */ r.jsxs("feMerge", { children: [
          /* @__PURE__ */ r.jsx("feMergeNode", { in: "b" }),
          /* @__PURE__ */ r.jsx("feMergeNode", { in: "SourceGraphic" })
        ] })
      ] }) }),
      /* @__PURE__ */ r.jsx(
        "path",
        {
          d: "M18 72 A46 46 0 1 1 102 72",
          fill: "none",
          stroke: "var(--dsc-gray-3)",
          strokeWidth: "10",
          strokeLinecap: "round"
        }
      ),
      /* @__PURE__ */ r.jsx(
        "path",
        {
          d: "M18 72 A46 46 0 1 1 102 72",
          fill: "none",
          stroke: "var(--dsc-neon)",
          strokeWidth: "10",
          strokeLinecap: "round",
          strokeDasharray: `${R} ${p}`,
          filter: "url(#dsc-gauge-glow)",
          style: { transition: "stroke-dasharray 220ms ease" }
        }
      ),
      /* @__PURE__ */ r.jsx(
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
      /* @__PURE__ */ r.jsx("text", { x: "60", y: "74", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: h })
    ] }),
    /* @__PURE__ */ r.jsx("div", { className: "dsc-gauge-label", children: s })
  ] });
}
function Ly({
  label: i,
  icon: o,
  onClick: f,
  className: s = ""
}) {
  return /* @__PURE__ */ r.jsx(
    "button",
    {
      type: "button",
      className: `dsc-icon-btn ${s}`.trim(),
      "aria-label": i,
      title: i,
      onClick: f,
      children: /* @__PURE__ */ r.jsx(kn, { name: o, size: 16 })
    }
  );
}
function qy({
  items: i,
  label: o = "More actions"
}) {
  const [f, s] = j.useState(!1), h = j.useRef(null);
  return j.useEffect(() => {
    if (!f) return;
    const m = (v) => {
      h.current?.contains(v.target) || s(!1);
    };
    return document.addEventListener("mousedown", m), () => document.removeEventListener("mousedown", m);
  }, [f]), /* @__PURE__ */ r.jsxs("div", { className: "dsc-overflow", ref: h, children: [
    /* @__PURE__ */ r.jsx(Ly, { label: o, icon: "more", onClick: () => s((m) => !m) }),
    f ? /* @__PURE__ */ r.jsx("div", { className: "dsc-overflow-menu", role: "menu", children: i.map((m) => /* @__PURE__ */ r.jsx(
      "button",
      {
        type: "button",
        role: "menuitem",
        onClick: () => {
          s(!1), m.onSelect();
        },
        children: m.label
      },
      m.id
    )) }) : null
  ] });
}
const Gh = ["#5b9f6b", "#4a8f9f", "#c4a35a", "#8d6e63"];
function Yy(i) {
  if (!i || !i.trim()) return [];
  const o = i.split(/[|/·]/).map((s) => s.trim()).filter(Boolean), f = [];
  for (const s of o) {
    const h = s.match(/^(.+?)\s*[·:]?\s*(\d+(?:\.\d+)?)\s*%?$/);
    if (h) {
      f.push({ name: h[1].trim(), pct: Number(h[2]) });
      continue;
    }
    const m = s.match(/(\d+(?:\.\d+)?)\s*%\s*(.+)$/);
    if (m) {
      f.push({ name: m[2].trim(), pct: Number(m[1]) });
      continue;
    }
    s && f.push({ name: s, pct: 0 });
  }
  if (f.length && f.every((s) => s.pct === 0)) {
    const s = 100 / f.length;
    return f.map((h) => ({ ...h, pct: s }));
  }
  return f.filter((s) => s.pct > 0);
}
function Gy({
  layers: i,
  valid: o,
  emptyLabel: f = "No blend on roster seat"
}) {
  const s = i.reduce((v, y) => v + y.pct, 0), h = o ?? (i.length > 0 && Math.round(s) === 100);
  let m = 0;
  return /* @__PURE__ */ r.jsx("div", { className: "dsc-soil", children: /* @__PURE__ */ r.jsx("div", { className: `dsc-soil-pot${h && i.length ? " is-valid" : ""}`, children: i.length ? i.map((v, y) => {
    const b = m;
    return m += v.pct, /* @__PURE__ */ r.jsx(
      "div",
      {
        className: "dsc-soil-layer",
        style: {
          bottom: `${b}%`,
          height: `${v.pct}%`,
          background: v.color || Gh[y % Gh.length]
        },
        title: `${v.name} ${v.pct}%`,
        children: v.pct >= 12 ? `${v.name} ${Math.round(v.pct)}%` : ""
      },
      `${v.name}-${y}`
    );
  }) : /* @__PURE__ */ r.jsx("div", { className: "dsc-soil-empty", children: f }) }) });
}
function Fe(i, o = "—") {
  return !i || i === "unknown" || i === "unavailable" || i === "none" ? o : i;
}
function fm(i, o) {
  const f = i(`input_select.dsc_pot${o}_tent`, "unassigned");
  return f === "clone" || f === "main" || f === "unassigned" ? f : "unassigned";
}
function Ci(i) {
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
function br(i, o) {
  const { state: f, entity: s } = o, h = s("sensor.dsc_plant_roster_summary")?.attributes?.slots || [], m = Array.isArray(h) ? h.find((y) => String(y.pot) === String(i)) : void 0, v = Fe(m?.blend, "");
  return {
    pot: i,
    plantName: Fe(f(`text.dsc_pot${i}_plant_name`, "")),
    strainDisplay: Fe(f(`sensor.dsc_pot${i}_strain_display`, "")),
    sprout: Fe(f(`datetime.dsc_pot${i}_sprout_date`, ""), "—").slice(0, 10),
    days: Fe(f(`sensor.dsc_pot${i}_days_since_sprout`, "")),
    stage: Fe(f(`sensor.dsc_pot${i}_expected_stage`, "")),
    growthStage: Fe(f(`select.dsc_pot${i}_growth_stage`, "")),
    tent: fm(f, i),
    blend: v,
    recipe: Fe(m?.recipe, ""),
    notes: Fe(m?.notes, ""),
    layers: Yy(v),
    moisture: Fe(f(`sensor.dsc_pot${i}_soil_moisture`, "")),
    soilTemp: Fe(f(`sensor.dsc_pot${i}_soil_temperature`, "")),
    ec: Fe(f(`sensor.dsc_pot${i}_soil_conductivity`, "")),
    ph: Fe(f(`sensor.dsc_pot${i}_soil_ph`, "")),
    n: Fe(f(`sensor.dsc_pot${i}_soil_nitrogen`, "")),
    p: Fe(f(`sensor.dsc_pot${i}_soil_phosphorus`, "")),
    k: Fe(f(`sensor.dsc_pot${i}_soil_potassium`, "")),
    need: Fe(f(`sensor.dsc_pot${i}_need_summary`, "")),
    rosterSlot: m?.slot ?? null
  };
}
function Xy(i) {
  const o = i("sensor.dsc_plant_roster_summary")?.attributes?.slots;
  return Array.isArray(o) ? o : [];
}
function Qy(i) {
  return !Number.isFinite(i) || i <= 0 ? "—" : i >= 86400 ? `${(i / 86400).toFixed(1)}d` : i >= 3600 ? `${(i / 3600).toFixed(1)}h` : `${Math.round(i / 60)}m`;
}
const Zy = [
  { id: "binary_sensor.dsc_hub_emergency_failsafe", label: "Emergency failsafe" },
  { id: "binary_sensor.dsc_hub_climate_sensor_fault", label: "Climate sensor fault" },
  { id: "binary_sensor.dsc_hub_aux_sensor_fault", label: "Aux sensor fault" },
  { id: "binary_sensor.dsc_hub_root_zone_sensor_fault", label: "Root-zone probes" },
  { id: "binary_sensor.dsc_clone_dark_period_violation", label: "Clone dark violation" },
  { id: "binary_sensor.dsc_reduced_kit", label: "Reduced kit" }
];
function Vy() {
  const { state: i, num: o, available: f, entity: s, tick: h } = ft(), m = ra(), v = f("sensor.dsc_hub_uptime"), y = o("sensor.dsc_active_alert_count", 0), b = o("sensor.dsc_hub_tent_temperature"), p = o("sensor.dsc_hub_tent_humidity"), R = o("sensor.dsc_hub_vpd_kpa"), E = o("sensor.dsc_hub_room_temperature"), N = o("sensor.dsc_hub_clone_temperature"), B = o("sensor.dsc_hub_clone_humidity"), L = wt("sensor.dsc_hub_tent_temperature"), q = wt("sensor.dsc_hub_tent_humidity"), V = i("binary_sensor.dsc_hub_panel_link") === "on", k = i("sensor.dsc_hub_heartbeat", "NO BEAT"), X = f("sensor.dsc_hub_heartbeat"), le = i("sensor.dsc_fleet_version_status", "—"), fe = i("switch.dsc_hub_manual_takeover") === "on", Te = i("switch.dsc_hub_tent_manual_override") === "on", W = Zy.filter((oe) => i(oe.id) === "on"), Ce = [1, 2, 3, 4].map((oe) => br(oe, { state: i, entity: s }));
  return /* @__PURE__ */ r.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ r.jsx(
      Pe,
      {
        title: "Ops · Home",
        subtitle: "Live vitals — status, faults, demands, climate."
      }
    ),
    /* @__PURE__ */ r.jsxs("div", { className: "dsc-status-strip", children: [
      /* @__PURE__ */ r.jsx(je, { label: v ? "HUB ONLINE" : "HUB OFFLINE", tone: v ? "ok" : "bad" }),
      /* @__PURE__ */ r.jsx(
        je,
        {
          label: V ? "PANEL ESP-NOW" : f("sensor.dsc_control_wifi_rssi") ? "PANEL HA-ONLY" : "PANEL OFFLINE",
          tone: V ? "ok" : f("sensor.dsc_control_wifi_rssi") ? "warn" : "bad"
        }
      ),
      /* @__PURE__ */ r.jsx(
        je,
        {
          label: X ? `BEAT ${k}` : "NO BEAT",
          tone: X ? "ok" : "bad"
        }
      ),
      /* @__PURE__ */ r.jsx(
        je,
        {
          label: `UP ${Qy(o("sensor.dsc_hub_uptime"))}`,
          tone: v ? "ok" : "muted"
        }
      ),
      /* @__PURE__ */ r.jsx(
        je,
        {
          label: y === 0 ? "All clear" : `${y} alert(s)`,
          tone: y === 0 ? "ok" : "bad",
          pulse: y > 0
        }
      ),
      /* @__PURE__ */ r.jsx(
        je,
        {
          label: le === "ok" ? "FLEET OK" : le === "warn" ? "FLEET WARN" : "FLEET DRIFT",
          tone: le === "ok" ? "ok" : le === "warn" ? "warn" : "bad"
        }
      ),
      fe ? /* @__PURE__ */ r.jsx(je, { label: "MANUAL TAKEOVER", tone: "warn", pulse: !0 }) : null,
      Te ? /* @__PURE__ */ r.jsx(je, { label: "FAN OVERRIDE", tone: "warn", pulse: !0 }) : null
    ] }),
    /* @__PURE__ */ r.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ r.jsx(
        Ue,
        {
          label: "Tent temp",
          value: Number.isFinite(b) ? b.toFixed(1) : "—",
          unit: "°C",
          sub: `Room ${Number.isFinite(E) ? E.toFixed(1) : "—"} °C`
        }
      ) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ r.jsx(
        Ue,
        {
          label: "Tent RH",
          value: Number.isFinite(p) ? p.toFixed(0) : "—",
          unit: "%",
          sub: `VPD ${Number.isFinite(R) ? R.toFixed(2) : "—"} kPa`
        }
      ) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ r.jsx(
        Ue,
        {
          label: "Clone",
          value: Number.isFinite(N) ? N.toFixed(1) : "—",
          unit: "°C",
          sub: `RH ${Number.isFinite(B) ? B.toFixed(0) : "—"}%`
        }
      ) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ r.jsx(
        Ue,
        {
          label: "Surface",
          value: i("sensor.dsc_ha_surface_version", "6.2.0"),
          sub: `Fleet ${le}`,
          tone: "ok"
        }
      ) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ r.jsx(re, { className: "dsc-glass", title: "Plant seats", children: /* @__PURE__ */ r.jsx("div", { className: "dsc-chip-row", children: Ce.map((oe) => /* @__PURE__ */ r.jsxs(
        "button",
        {
          type: "button",
          className: "dsc-chip dsc-chip--ok",
          onClick: () => m(`/ops/plant-seat?pot=${oe.pot}`),
          title: oe.blend || "Open plant seat",
          children: [
            "P",
            oe.pot,
            " ",
            oe.plantName !== "—" ? oe.plantName : "—",
            " · ",
            Ci(oe.tent),
            oe.blend ? ` · ${oe.blend.slice(0, 28)}` : ""
          ]
        },
        oe.pot
      )) }) }) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-8", children: /* @__PURE__ */ r.jsx(re, { title: "Live climate — tent T + RH", children: /* @__PURE__ */ r.jsx(
        $n,
        {
          live: !0,
          unit: "",
          series: [
            {
              id: "temp",
              label: "Temp °C",
              series: L,
              color: "var(--dsc-neon)"
            },
            {
              id: "rh",
              label: "RH %",
              series: q,
              color: "#7dd3fc"
            }
          ]
        }
      ) }) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ r.jsx(re, { title: "Gauges", children: /* @__PURE__ */ r.jsxs("div", { className: "dsc-gauge-row", children: [
        /* @__PURE__ */ r.jsx(Bt, { label: "Temp", value: b, min: 10, max: 40, unit: "°C" }),
        /* @__PURE__ */ r.jsx(Bt, { label: "RH", value: p, min: 0, max: 100, unit: "%" }),
        /* @__PURE__ */ r.jsx(Bt, { label: "VPD×10", value: R * 10, min: 0, max: 20, unit: "" })
      ] }) }) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ r.jsx(re, { title: "Demands", children: /* @__PURE__ */ r.jsxs("div", { className: "dsc-demand-row", children: [
        /* @__PURE__ */ r.jsx(vl, { entityId: "switch.dsc_hub_heater_demand", label: "Heat" }),
        /* @__PURE__ */ r.jsx(
          vl,
          {
            entityId: "switch.dsc_hub_ac_demand",
            label: "Cool",
            warnWhenMissing: i("binary_sensor.dsc_ac_capacity_offline") === "on" ? "AC ○" : void 0
          }
        ),
        /* @__PURE__ */ r.jsx(vl, { entityId: "switch.dsc_hub_humidifier_demand", label: "Hum" }),
        /* @__PURE__ */ r.jsx(vl, { entityId: "switch.dsc_hub_dehumidifier_demand", label: "Dehum" }),
        /* @__PURE__ */ r.jsx(vl, { entityId: "switch.dsc_hub_grow_mat_demand", label: "Mat" }),
        /* @__PURE__ */ r.jsx(vl, { entityId: "switch.dsc_hub_clone_humidifier_demand", label: "C-Hum" }),
        /* @__PURE__ */ r.jsx(vl, { entityId: "light.dsc_hub_sf1000_dimmer", label: "SF1000" })
      ] }) }) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ r.jsx(re, { title: "Overrides", children: /* @__PURE__ */ r.jsxs("div", { className: "dsc-demand-row dsc-demand-row--stack", children: [
        /* @__PURE__ */ r.jsx(vl, { entityId: "switch.dsc_hub_manual_takeover", label: "Manual takeover" }),
        /* @__PURE__ */ r.jsx(vl, { entityId: "switch.dsc_hub_tent_manual_override", label: "Fan override" })
      ] }) }) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ r.jsx(re, { title: "Pot ESP-NOW", children: /* @__PURE__ */ r.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ r.jsx(xi, { entityId: "binary_sensor.dsc_hub_pot1_esp_now_link", label: "P1" }),
        /* @__PURE__ */ r.jsx(xi, { entityId: "binary_sensor.dsc_hub_pot2_esp_now_link", label: "P2" }),
        /* @__PURE__ */ r.jsx(xi, { entityId: "binary_sensor.dsc_hub_pot3_esp_now_link", label: "P3" }),
        /* @__PURE__ */ r.jsx(xi, { entityId: "binary_sensor.dsc_hub_pot4_esp_now_link", label: "P4" })
      ] }) }) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ r.jsx(re, { title: "Faults / alerts", children: W.length === 0 && y === 0 ? /* @__PURE__ */ r.jsx("div", { className: "dsc-empty dsc-empty--ok", children: "No active faults — all clear." }) : /* @__PURE__ */ r.jsxs("ul", { className: "dsc-fault-list", children: [
        W.map((oe) => /* @__PURE__ */ r.jsxs("li", { children: [
          /* @__PURE__ */ r.jsx(je, { label: oe.label, tone: "bad", pulse: !0 }),
          /* @__PURE__ */ r.jsx("span", { className: "dsc-muted", children: oe.id })
        ] }, oe.id)),
        y > 0 && W.length === 0 ? /* @__PURE__ */ r.jsxs("li", { children: [
          /* @__PURE__ */ r.jsx(je, { label: `${y} system alert(s)`, tone: "bad", pulse: !0 }),
          /* @__PURE__ */ r.jsx("span", { className: "dsc-muted", children: "See System for entity detail" })
        ] }) : null
      ] }) }) })
    ] })
  ] });
}
const Ky = [
  "/local/DSC-HUB.js",
  "/local/dsc-system-map-card.js",
  "/hacsfiles/DSC-HUB/DSC-HUB.js"
], Jn = /* @__PURE__ */ new Map();
let Xh = !1;
function Jy(i) {
  if (document.querySelector(`script[data-dsc-autoload="${i}"]`))
    return Jn.get(i) ?? Promise.resolve();
  if (Jn.has(i)) return Jn.get(i);
  const f = new Promise((s, h) => {
    const m = document.createElement("script");
    m.src = i, m.async = !0, m.dataset.dscAutoload = i, m.onload = () => s(), m.onerror = () => h(new Error(`Failed to load ${i}`)), document.head.appendChild(m);
  });
  return Jn.set(i, f), f;
}
async function ky(i, o = 12e3) {
  if (customElements.get(i)) return !0;
  if (Xh)
    await Promise.allSettled([...Jn.values()]);
  else {
    Xh = !0;
    for (const f of Ky)
      try {
        if (await Jy(f), customElements.get(i)) return !0;
      } catch {
      }
  }
  try {
    return await Promise.race([
      customElements.whenDefined(i),
      new Promise(
        (f, s) => window.setTimeout(() => s(new Error("timeout")), o)
      )
    ]), !!customElements.get(i);
  } catch {
    return !!customElements.get(i);
  }
}
function Mi({
  tag: i,
  config: o
}) {
  const f = j.useRef(null), { hass: s } = ft(), [h, m] = j.useState("loading"), v = j.useRef(
    null
  ), y = JSON.stringify(o ?? {});
  return j.useEffect(() => {
    const b = f.current;
    if (!b) return;
    let p = !1;
    const R = y ? JSON.parse(y) : {};
    return (async () => {
      m("loading"), b.innerHTML = "";
      const E = await ky(i);
      if (p || !f.current) return;
      if (!E) {
        m("missing");
        const B = document.createElement("div");
        B.className = "dsc-empty", B.innerHTML = `<strong>${i}</strong> did not register.<br/>Tried /local/DSC-HUB.js and /local/dsc-system-map-card.js. Deploy the IIFE bundle or add it as a Lovelace resource, then hard-refresh.`, b.appendChild(B);
        return;
      }
      const N = document.createElement(i);
      typeof N.setConfig == "function" && N.setConfig({ type: `custom:${i}`, ...R }), s && (N.hass = s), b.appendChild(N), v.current = N, m("ready");
    })(), () => {
      p = !0, v.current = null, b.innerHTML = "";
    };
  }, [i, y]), j.useEffect(() => {
    v.current && s && (v.current.hass = s);
  }, [s]), /* @__PURE__ */ r.jsx(
    "div",
    {
      className: `dsc-legacy-host${h === "missing" ? " dsc-legacy-host--empty" : ""}`,
      ref: f,
      "data-status": h
    }
  );
}
function tt(i, o = 1) {
  return Number.isFinite(i) ? i.toFixed(o) : "—";
}
function $y() {
  const i = ra();
  return j.useEffect(() => {
    const o = (f) => {
      const s = f.detail, h = Number(s?.pot);
      h >= 1 && h <= 4 && i(`/ops/plant-seat?pot=${h}`);
    };
    return window.addEventListener("dsc-dash-select-pot", o), () => window.removeEventListener("dsc-dash-select-pot", o);
  }, [i]), /* @__PURE__ */ r.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ r.jsx(
      Pe,
      {
        title: "Ops · Dash",
        subtitle: "Cinematic digital twin — pick a pot to open Plant Seat."
      }
    ),
    /* @__PURE__ */ r.jsx(Mi, { tag: "dsc-the-dash-card", config: {} })
  ] });
}
function Wy() {
  const { num: i } = ft(), o = wt("sensor.dsc_hub_tent_temperature"), f = wt("sensor.dsc_hub_tent_humidity"), s = wt("sensor.dsc_cfm_exhaust_out"), h = wt("sensor.dsc_cfm_exhaust_recirc"), m = wt("sensor.dsc_fan_exhaust_outside_pct"), v = wt("sensor.dsc_fan_exhaust_room_pct");
  return /* @__PURE__ */ r.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ r.jsx(Pe, { title: "Ops · Climate", subtitle: "Zones, VPD, airflow CFM / fan duty." }),
    /* @__PURE__ */ r.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ r.jsx(Ue, { label: "Tent °C", value: tt(i("sensor.dsc_hub_tent_temperature")), unit: "°C" }) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ r.jsx(Ue, { label: "Tent RH", value: tt(i("sensor.dsc_hub_tent_humidity"), 0), unit: "%" }) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ r.jsx(Ue, { label: "VPD", value: tt(i("sensor.dsc_hub_vpd_kpa"), 2), unit: "kPa" }) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ r.jsx(Ue, { label: "Room °C", value: tt(i("sensor.dsc_hub_room_temperature")), unit: "°C" }) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ r.jsx(
        Ue,
        {
          label: "CFM OUT",
          value: tt(i("sensor.dsc_cfm_exhaust_out"), 0),
          unit: "cfm",
          sub: `Fan ${tt(i("sensor.dsc_fan_exhaust_outside_pct"), 0)}%`
        }
      ) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ r.jsx(
        Ue,
        {
          label: "CFM RECIRC",
          value: tt(i("sensor.dsc_cfm_exhaust_recirc"), 0),
          unit: "cfm",
          sub: `Fan ${tt(i("sensor.dsc_fan_exhaust_room_pct"), 0)}%`
        }
      ) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ r.jsx(Ue, { label: "Intake main", value: tt(i("sensor.dsc_cfm_intake_main"), 0), unit: "cfm" }) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ r.jsx(Ue, { label: "Intake 2×4", value: tt(i("sensor.dsc_cfm_intake_2x4"), 0), unit: "cfm" }) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ r.jsx(re, { title: "Tent temperature + RH", children: /* @__PURE__ */ r.jsx(
        $n,
        {
          series: [
            { id: "t", label: "Temp °C", series: o, color: "var(--dsc-neon)" },
            { id: "rh", label: "RH %", series: f, color: "#7dd3fc" }
          ]
        }
      ) }) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ r.jsx(re, { title: "Exhaust CFM", children: /* @__PURE__ */ r.jsx(
        $n,
        {
          unit: "cfm",
          series: [
            { id: "out", label: "OUT", series: s, color: "var(--dsc-neon)" },
            { id: "recirc", label: "RECIRC", series: h, color: "#fbbf24" }
          ]
        }
      ) }) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ r.jsx(re, { title: "Fan duty %", children: /* @__PURE__ */ r.jsx(
        $n,
        {
          unit: "%",
          series: [
            { id: "fout", label: "OUT %", series: m, color: "#7dd3fc" },
            { id: "frec", label: "RECIRC %", series: v, color: "#f472b6" }
          ]
        }
      ) }) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ r.jsx(re, { title: "Zone gauges", children: /* @__PURE__ */ r.jsxs("div", { className: "dsc-gauge-row", children: [
        /* @__PURE__ */ r.jsx(Bt, { label: "Tent T", value: i("sensor.dsc_hub_tent_temperature"), min: 15, max: 35, unit: "°C" }),
        /* @__PURE__ */ r.jsx(Bt, { label: "Tent RH", value: i("sensor.dsc_hub_tent_humidity"), min: 0, max: 100, unit: "%" }),
        /* @__PURE__ */ r.jsx(Bt, { label: "VPD×10", value: i("sensor.dsc_hub_vpd_kpa") * 10, min: 0, max: 20, unit: "" }),
        /* @__PURE__ */ r.jsx(Bt, { label: "Clone T", value: i("sensor.dsc_hub_clone_temperature"), min: 15, max: 35, unit: "°C" }),
        /* @__PURE__ */ r.jsx(Bt, { label: "Clone RH", value: i("sensor.dsc_hub_clone_humidity"), min: 0, max: 100, unit: "%" }),
        /* @__PURE__ */ r.jsx(Bt, { label: "Room T", value: i("sensor.dsc_hub_room_temperature"), min: 10, max: 40, unit: "°C" })
      ] }) }) })
    ] })
  ] });
}
function dm({
  title: i,
  tempId: o,
  rhId: f,
  vpdId: s
}) {
  const { num: h } = ft(), m = wt(o), v = wt(f);
  return /* @__PURE__ */ r.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ r.jsx(Pe, { title: i }),
    /* @__PURE__ */ r.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ r.jsx(Ue, { label: "Temperature", value: tt(h(o)), unit: "°C" }) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ r.jsx(Ue, { label: "Humidity", value: tt(h(f), 0), unit: "%" }) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ r.jsx(
        Ue,
        {
          label: "VPD",
          value: s ? tt(h(s), 2) : "—",
          unit: "kPa",
          tone: s ? "normal" : "muted"
        }
      ) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ r.jsx(re, { title: "Temp trace", children: /* @__PURE__ */ r.jsx(zi, { series: m, unit: "°C" }) }) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ r.jsx(re, { title: "RH trace", children: /* @__PURE__ */ r.jsx(zi, { series: v, unit: "%" }) }) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ r.jsx(re, { title: "Gauges", children: /* @__PURE__ */ r.jsxs("div", { className: "dsc-gauge-row", children: [
        /* @__PURE__ */ r.jsx(Bt, { label: "Temp", value: h(o), min: 15, max: 35, unit: "°C" }),
        /* @__PURE__ */ r.jsx(Bt, { label: "RH", value: h(f), min: 0, max: 100, unit: "%" }),
        s ? /* @__PURE__ */ r.jsx(Bt, { label: "VPD×10", value: h(s) * 10, min: 0, max: 20, unit: "" }) : null
      ] }) }) })
    ] })
  ] });
}
function Fy() {
  return /* @__PURE__ */ r.jsx(
    dm,
    {
      title: "Ops · Main 4×8",
      tempId: "sensor.dsc_hub_tent_temperature",
      rhId: "sensor.dsc_hub_tent_humidity",
      vpdId: "sensor.dsc_hub_vpd_kpa"
    }
  );
}
function Py() {
  return /* @__PURE__ */ r.jsx(
    dm,
    {
      title: "Ops · Clone 2×4",
      tempId: "sensor.dsc_hub_clone_temperature",
      rhId: "sensor.dsc_hub_clone_humidity"
    }
  );
}
function Iy() {
  const { num: i, state: o, entity: f, tick: s } = ft(), h = ra(), m = [1, 2, 3, 4].map((v) => br(v, { state: o, entity: f }));
  return /* @__PURE__ */ r.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ r.jsx(Pe, { title: "Ops · Root zone", subtitle: "Per-pot soil Got + roster blend — click a row for Plant Seat." }),
    /* @__PURE__ */ r.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ r.jsx(Ue, { label: "Coldest root", value: tt(i("sensor.dsc_coldest_root_zone_temp")), unit: "°C" }) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ r.jsx(Ue, { label: "Heat mat on time", value: tt(i("sensor.dsc_heatmat_relay_on_time"), 0), unit: "s" }) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ r.jsx(re, { title: "Notes", children: /* @__PURE__ */ r.jsxs("p", { className: "dsc-muted", style: { margin: 0 }, children: [
        "Mat loop uses per-pot sense with plausibility filter. State:",
        " ",
        o("sensor.dsc_coldest_root_zone_temp", "—")
      ] }) }) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ r.jsx(re, { className: "dsc-glass", title: "Pots", children: /* @__PURE__ */ r.jsxs("table", { className: "dsc-table", children: [
        /* @__PURE__ */ r.jsx("thead", { children: /* @__PURE__ */ r.jsxs("tr", { children: [
          /* @__PURE__ */ r.jsx("th", { children: "Pot" }),
          /* @__PURE__ */ r.jsx("th", { children: "Name" }),
          /* @__PURE__ */ r.jsx("th", { children: "Tent" }),
          /* @__PURE__ */ r.jsx("th", { children: "M" }),
          /* @__PURE__ */ r.jsx("th", { children: "T" }),
          /* @__PURE__ */ r.jsx("th", { children: "EC" }),
          /* @__PURE__ */ r.jsx("th", { children: "pH" }),
          /* @__PURE__ */ r.jsx("th", { children: "NPK" }),
          /* @__PURE__ */ r.jsx("th", { children: "Blend" })
        ] }) }),
        /* @__PURE__ */ r.jsx("tbody", { children: m.map((v) => /* @__PURE__ */ r.jsxs("tr", { onClick: () => h(`/ops/plant-seat?pot=${v.pot}`), children: [
          /* @__PURE__ */ r.jsxs("td", { children: [
            "P",
            v.pot
          ] }),
          /* @__PURE__ */ r.jsx("td", { children: v.plantName }),
          /* @__PURE__ */ r.jsx("td", { children: /* @__PURE__ */ r.jsx(je, { label: Ci(v.tent), tone: v.tent === "unassigned" ? "muted" : "ok" }) }),
          /* @__PURE__ */ r.jsx("td", { children: v.moisture }),
          /* @__PURE__ */ r.jsx("td", { children: v.soilTemp }),
          /* @__PURE__ */ r.jsx("td", { children: v.ec }),
          /* @__PURE__ */ r.jsx("td", { children: v.ph }),
          /* @__PURE__ */ r.jsxs("td", { children: [
            v.n,
            "/",
            v.p,
            "/",
            v.k
          ] }),
          /* @__PURE__ */ r.jsx("td", { className: "dsc-muted", children: v.blend || "—" })
        ] }, v.pot)) })
      ] }) }) })
    ] })
  ] });
}
function eg() {
  return /* @__PURE__ */ r.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ r.jsx(Pe, { title: "Ops · Tank", subtitle: "Reservoir / tank vitals + system map." }),
    /* @__PURE__ */ r.jsx("div", { className: "dsc-grid", children: /* @__PURE__ */ r.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ r.jsx(re, { title: "System map", children: /* @__PURE__ */ r.jsx(Mi, { tag: "dsc-system-map-card", config: {} }) }) }) })
  ] });
}
function tg() {
  const { state: i, num: o } = ft();
  return /* @__PURE__ */ r.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ r.jsx(Pe, { title: "Ops · Lighting", subtitle: "Photoperiod and expected light hours." }),
    /* @__PURE__ */ r.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ r.jsx(Ue, { label: "Expected light hours", value: tt(o("sensor.dsc_expected_light_hours"), 1), unit: "h" }) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-8", children: /* @__PURE__ */ r.jsx(re, { title: "Notes", children: /* @__PURE__ */ r.jsxs("p", { className: "dsc-muted", style: { margin: 0 }, children: [
        "Expected: ",
        i("sensor.dsc_expected_light_hours", "—"),
        ". Fixture detail remains on firmware / packages."
      ] }) }) })
    ] })
  ] });
}
function lg() {
  return /* @__PURE__ */ r.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ r.jsx(
      Pe,
      {
        title: "Plant",
        subtitle: "Build, catalog research, roster seats, and mix tools."
      }
    ),
    /* @__PURE__ */ r.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ r.jsxs(re, { title: "Build a Plant", children: [
        /* @__PURE__ */ r.jsx("p", { className: "dsc-muted", children: "Compose soil blend, roster, and climate Want." }),
        /* @__PURE__ */ r.jsx(Lt, { to: "/plant/build", children: /* @__PURE__ */ r.jsx(qt, { primary: !0, children: "Open Build" }) })
      ] }) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ r.jsxs(re, { title: "Catalog Explorer", children: [
        /* @__PURE__ */ r.jsx("p", { className: "dsc-muted", children: "Browse strains, nutrients, mediums, lights." }),
        /* @__PURE__ */ r.jsx(Lt, { to: "/plant/catalog", children: /* @__PURE__ */ r.jsx(qt, { primary: !0, children: "Open Catalog" }) })
      ] }) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ r.jsxs(re, { title: "Plant seat", children: [
        /* @__PURE__ */ r.jsx("p", { className: "dsc-muted", children: "Soil, age, nutrients, tent apply." }),
        /* @__PURE__ */ r.jsxs("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ r.jsx(Lt, { to: "/plant/seat?pot=1", children: /* @__PURE__ */ r.jsx(qt, { primary: !0, children: "Open Seat" }) }),
          /* @__PURE__ */ r.jsx(Lt, { to: "/plant/strains", children: /* @__PURE__ */ r.jsx(qt, { children: "Strains" }) }),
          /* @__PURE__ */ r.jsx(Lt, { to: "/plant/nutrient", children: /* @__PURE__ */ r.jsx(qt, { children: "Nutrient" }) })
        ] })
      ] }) })
    ] })
  ] });
}
function ag() {
  return /* @__PURE__ */ r.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ r.jsx(Pe, { title: "Plant · Build", subtitle: "Compose mode — result-first glass card." }),
    /* @__PURE__ */ r.jsx(Mi, { tag: "dsc-build-plant-card", config: {} })
  ] });
}
function ng() {
  return /* @__PURE__ */ r.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ r.jsx(Pe, { title: "Plant · Catalog", subtitle: "Research browser over /local/dsc-catalog indexes." }),
    /* @__PURE__ */ r.jsx(Mi, { tag: "dsc-catalog-browse-card", config: {} })
  ] });
}
function ug() {
  const { entity: i, state: o, tick: f } = ft(), s = Xy(i);
  return /* @__PURE__ */ r.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ r.jsx(Pe, { title: "Plant · Strains", subtitle: "Roster seats — open a row for Plant Seat." }),
    /* @__PURE__ */ r.jsxs(re, { className: "dsc-glass", title: "Roster", children: [
      s.length ? /* @__PURE__ */ r.jsxs("table", { className: "dsc-table", children: [
        /* @__PURE__ */ r.jsx("thead", { children: /* @__PURE__ */ r.jsxs("tr", { children: [
          /* @__PURE__ */ r.jsx("th", { children: "Slot" }),
          /* @__PURE__ */ r.jsx("th", { children: "Name" }),
          /* @__PURE__ */ r.jsx("th", { children: "Strain" }),
          /* @__PURE__ */ r.jsx("th", { children: "Status" }),
          /* @__PURE__ */ r.jsx("th", { children: "Pot" }),
          /* @__PURE__ */ r.jsx("th", { children: "Tent" })
        ] }) }),
        /* @__PURE__ */ r.jsx("tbody", { children: s.map((h) => {
          const m = Number(h.pot), v = m >= 1 && m <= 4 ? Ci(fm(o, m)) : "—";
          return /* @__PURE__ */ r.jsxs("tr", { children: [
            /* @__PURE__ */ r.jsxs("td", { children: [
              "#",
              h.slot
            ] }),
            /* @__PURE__ */ r.jsx("td", { children: h.nickname || "—" }),
            /* @__PURE__ */ r.jsx("td", { children: h.strain || "—" }),
            /* @__PURE__ */ r.jsx("td", { children: h.status || "—" }),
            /* @__PURE__ */ r.jsx("td", { children: m >= 1 && m <= 4 ? /* @__PURE__ */ r.jsxs(Lt, { to: `/plant/seat?pot=${m}`, children: [
              "P",
              m
            ] }) : "—" }),
            /* @__PURE__ */ r.jsx("td", { children: /* @__PURE__ */ r.jsx(je, { label: v, tone: "muted" }) })
          ] }, h.slot);
        }) })
      ] }) : /* @__PURE__ */ r.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "No plants in roster yet. Commit from Build, then assign a pot." }),
      /* @__PURE__ */ r.jsx("div", { style: { marginTop: 12 }, children: /* @__PURE__ */ r.jsx(Lt, { to: "/plant/build", children: /* @__PURE__ */ r.jsx(qt, { primary: !0, children: /* @__PURE__ */ r.jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ r.jsx(kn, { name: "build", size: 14 }),
        " Use in Build"
      ] }) }) }) })
    ] })
  ] });
}
function ig() {
  return /* @__PURE__ */ r.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ r.jsx(Pe, { title: "Plant · Nutrient science", subtitle: "Mix lab / dose tools." }),
    /* @__PURE__ */ r.jsxs(re, { title: "Mix lab", children: [
      /* @__PURE__ */ r.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "Nutrient dose and stage tools — open Build for the interactive mixer, Catalog for SKU research." }),
      /* @__PURE__ */ r.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ r.jsx(Lt, { to: "/plant/build", children: /* @__PURE__ */ r.jsx(qt, { primary: !0, children: "Build mixer" }) }),
        /* @__PURE__ */ r.jsx(Lt, { to: "/plant/catalog", children: /* @__PURE__ */ r.jsx(qt, { children: "Catalog nutrients" }) })
      ] })
    ] })
  ] });
}
function cg(i = 1) {
  const [o, f] = Sy(), s = Number(o.get("pot") || i);
  return [s >= 1 && s <= 4 ? s : i, (v) => {
    const y = new URLSearchParams(o);
    y.set("pot", String(v)), f(y, { replace: !0 });
  }];
}
function Qh() {
  const { state: i, entity: o, callService: f, tick: s } = ft(), [h, m] = cg(1), v = ra(), y = br(h, { state: i, entity: o }), b = (p) => {
    f("script", "turn_on", {
      entity_id: "script.dsc_apply_pot_to_tent",
      variables: { pot: String(h), tent: p }
    });
  };
  return /* @__PURE__ */ r.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ r.jsx(
      Pe,
      {
        title: `Plant seat · POT${h}`,
        subtitle: "Soil, age, nutrients, live Got — apply tent to move on The Dash."
      }
    ),
    /* @__PURE__ */ r.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 14 }, children: [
      [1, 2, 3, 4].map((p) => /* @__PURE__ */ r.jsxs(
        "button",
        {
          type: "button",
          className: `dsc-chip${p === h ? " dsc-chip--ok" : ""}`,
          onClick: () => m(p),
          children: [
            "P",
            p
          ]
        },
        p
      )),
      /* @__PURE__ */ r.jsx(je, { label: Ci(y.tent), tone: y.tent === "unassigned" ? "muted" : "ok" }),
      y.rosterSlot != null ? /* @__PURE__ */ r.jsx(je, { label: `Roster #${y.rosterSlot}`, tone: "muted" }) : /* @__PURE__ */ r.jsx(je, { label: "No roster join", tone: "warn" })
    ] }),
    /* @__PURE__ */ r.jsxs("div", { className: "dsc-seat-layout", children: [
      /* @__PURE__ */ r.jsxs(re, { className: "dsc-glass dsc-glass--glow", title: "Medium", children: [
        /* @__PURE__ */ r.jsx(Gy, { layers: y.layers }),
        /* @__PURE__ */ r.jsx("p", { className: "dsc-muted", style: { marginTop: 10, fontSize: 12 }, children: y.blend || "Blend lives on roster after commit — not invented here." })
      ] }),
      /* @__PURE__ */ r.jsxs("div", { className: "dsc-grid", style: { gap: 14 }, children: [
        /* @__PURE__ */ r.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ r.jsx(
          re,
          {
            className: "dsc-glass",
            title: "Identity",
            children: /* @__PURE__ */ r.jsxs("div", { style: { display: "flex", justifyContent: "space-between", gap: 12 }, children: [
              /* @__PURE__ */ r.jsxs("div", { children: [
                /* @__PURE__ */ r.jsx("div", { className: "dsc-kpi-value", style: { fontSize: "1.45rem" }, children: y.plantName !== "—" ? y.plantName : `POT${h}` }),
                /* @__PURE__ */ r.jsx("div", { className: "dsc-kpi-sub", children: y.strainDisplay }),
                /* @__PURE__ */ r.jsxs("div", { className: "dsc-chip-row", style: { marginTop: 10 }, children: [
                  /* @__PURE__ */ r.jsx(je, { label: `Day ${y.days}`, tone: "ok" }),
                  /* @__PURE__ */ r.jsx(je, { label: y.stage, tone: "muted" }),
                  /* @__PURE__ */ r.jsx(je, { label: `Sprout ${y.sprout}`, tone: "muted" })
                ] })
              ] }),
              /* @__PURE__ */ r.jsx(
                qy,
                {
                  items: [
                    {
                      id: "build",
                      label: "Open Build",
                      onSelect: () => v("/plant/build")
                    },
                    {
                      id: "root",
                      label: "Root zone",
                      onSelect: () => v("/ops/root-zone")
                    },
                    {
                      id: "dash",
                      label: "Open Dash",
                      onSelect: () => v("/ops/dash")
                    }
                  ]
                }
              )
            ] })
          }
        ) }),
        /* @__PURE__ */ r.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ r.jsxs(re, { title: "Nutrition", children: [
          /* @__PURE__ */ r.jsx("p", { style: { margin: "0 0 6px" }, children: y.recipe || "No roster recipe — catalog doses only, never invented." }),
          y.notes ? /* @__PURE__ */ r.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: y.notes }) : null
        ] }) }),
        /* @__PURE__ */ r.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ r.jsxs(re, { title: "Live Got", children: [
          /* @__PURE__ */ r.jsxs("div", { className: "dsc-chip-row", children: [
            /* @__PURE__ */ r.jsx(je, { label: `M ${y.moisture}`, tone: "muted" }),
            /* @__PURE__ */ r.jsx(je, { label: `T ${y.soilTemp}`, tone: "muted" }),
            /* @__PURE__ */ r.jsx(je, { label: `EC ${y.ec}`, tone: "muted" }),
            /* @__PURE__ */ r.jsx(je, { label: `pH ${y.ph}`, tone: "muted" }),
            /* @__PURE__ */ r.jsx(je, { label: `N ${y.n}`, tone: "muted" }),
            /* @__PURE__ */ r.jsx(je, { label: `P ${y.p}`, tone: "muted" }),
            /* @__PURE__ */ r.jsx(je, { label: `K ${y.k}`, tone: "muted" }),
            /* @__PURE__ */ r.jsx(
              je,
              {
                label: y.need,
                tone: y.need !== "—" && y.need !== "OK" ? "warn" : "ok"
              }
            )
          ] }),
          /* @__PURE__ */ r.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: "NPK = trend indicators. Unavailable stays —." })
        ] }) }),
        /* @__PURE__ */ r.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ r.jsxs(re, { className: "dsc-glass", title: "Apply to tent", children: [
          /* @__PURE__ */ r.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "Digital-twin placement. Moves the plant on The Dash; does not rewrite climate Want." }),
          /* @__PURE__ */ r.jsxs("div", { className: "dsc-seat-actions", children: [
            /* @__PURE__ */ r.jsx(qt, { primary: y.tent === "clone", onClick: () => b("clone"), children: "Clone 2×4" }),
            /* @__PURE__ */ r.jsx(qt, { primary: y.tent === "main", onClick: () => b("main"), children: "Main 4×8" }),
            /* @__PURE__ */ r.jsx(qt, { onClick: () => b("unassigned"), children: "Unassigned" }),
            /* @__PURE__ */ r.jsx(Lt, { to: "/ops/dash", children: /* @__PURE__ */ r.jsx(qt, { children: "Open Dash" }) })
          ] })
        ] }) })
      ] })
    ] })
  ] });
}
function sg() {
  const { state: i } = ft();
  return /* @__PURE__ */ r.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ r.jsx(Pe, { title: "Advanced · Learning", subtitle: "Learning loop status and notes." }),
    /* @__PURE__ */ r.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ r.jsx(re, { title: "Status", children: /* @__PURE__ */ r.jsxs("p", { className: "dsc-muted", style: { marginTop: 0 }, children: [
        "Surface: ",
        i("sensor.dsc_ha_surface_version", "6.1.0"),
        ". Durable learning math belongs in brain/."
      ] }) }) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ r.jsx(Ue, { label: "Hub beat", value: i("sensor.dsc_hub_heartbeat", "—") }) })
    ] })
  ] });
}
function rg() {
  const i = wt("sensor.dsc_hub_tent_temperature", { maxPoints: 96 }), o = wt("sensor.dsc_hub_tent_humidity", { maxPoints: 96 });
  return /* @__PURE__ */ r.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ r.jsx(Pe, { title: "Advanced · Trends", subtitle: "History-seeded trends with live append." }),
    /* @__PURE__ */ r.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ r.jsx(re, { title: "Tent temperature", children: /* @__PURE__ */ r.jsx(zi, { series: i, unit: "°C", live: !0 }) }) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ r.jsx(re, { title: "Tent humidity", children: /* @__PURE__ */ r.jsx(zi, { series: o, unit: "%", live: !0 }) }) })
    ] })
  ] });
}
function og() {
  return /* @__PURE__ */ r.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ r.jsx(
      Pe,
      {
        title: "Advanced · History",
        subtitle: "HA Recorder remains the lab history store for now."
      }
    ),
    /* @__PURE__ */ r.jsx(re, { title: "History", children: /* @__PURE__ */ r.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "Deep history charts stay on HA recorder / Trends while brain history matures. Use Trends for live session traces." }) })
  ] });
}
function fg() {
  const { state: i, available: o, num: f } = ft(), s = o("sensor.dsc_hub_uptime");
  return /* @__PURE__ */ r.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ r.jsx(Pe, { title: "System", subtitle: "Diagnostics, versions, and panel health." }),
    /* @__PURE__ */ r.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ r.jsx(
        Ue,
        {
          label: "Hub link",
          value: s ? "OK" : "DOWN",
          tone: s ? "ok" : "bad",
          sub: `Uptime raw ${i("sensor.dsc_hub_uptime", "—")}`
        }
      ) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ r.jsx(Ue, { label: "Surface", value: i("sensor.dsc_ha_surface_version", "6.1.0"), sub: "Panel product shell" }) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ r.jsx(
        Ue,
        {
          label: "Alerts",
          value: Number.isFinite(f("sensor.dsc_active_alert_count")) ? f("sensor.dsc_active_alert_count") : "—",
          tone: f("sensor.dsc_active_alert_count", 0) === 0 ? "ok" : "bad"
        }
      ) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ r.jsx(re, { title: "Fleet", children: /* @__PURE__ */ r.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: i("sensor.dsc_fleet_version_status", "—") }) }) }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ r.jsx(re, { title: "Panel", children: /* @__PURE__ */ r.jsxs("p", { className: "dsc-muted", style: { marginTop: 0 }, children: [
        "Custom panel ",
        /* @__PURE__ */ r.jsx("code", { children: "/dsc-hub" }),
        " · React + Vite · assets under",
        " ",
        /* @__PURE__ */ r.jsx("code", { children: "/dsc_hub/assets" }),
        "."
      ] }) }) })
    ] })
  ] });
}
const dg = [
  { id: "ops", label: "Ops", path: "/ops", icon: "ops" },
  { id: "plant", label: "Plant", path: "/plant", icon: "plant" },
  { id: "advanced", label: "Advanced", path: "/advanced", icon: "advanced" },
  { id: "system", label: "System", path: "/system", icon: "system" }
], hg = {
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
function mg(i) {
  return i.includes("/plant") ? "plant" : i.includes("/advanced") ? "advanced" : i.includes("/system") ? "system" : "ops";
}
const pg = ':host,.dsc-root{--dsc-black: #070907;--dsc-black-2: #0c100d;--dsc-gray-1: #151a16;--dsc-gray-2: #1c241e;--dsc-gray-3: #2a342c;--dsc-gray-4: #6b7a6e;--dsc-gray-5: #9aab9e;--dsc-neon: #39ff14;--dsc-neon-dim: rgba(57, 255, 20, .35);--dsc-neon-glow: rgba(57, 255, 20, .55);--dsc-teal: #26c6da;--dsc-teal-dim: rgba(38, 198, 218, .4);--dsc-teal-glow: rgba(38, 198, 218, .55);--dsc-amber: #ffb74d;--dsc-glass: rgba(12, 18, 16, .72);--dsc-glass-border: rgba(120, 180, 160, .28);--dsc-white: #f4f7f4;--dsc-shadow: 0 8px 24px rgba(0, 0, 0, .45);--dsc-shadow-tight: 0 2px 8px rgba(0, 0, 0, .55);--dsc-radius: 10px;--dsc-radius-lg: 14px;--dsc-font: "Segoe UI", "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;--dsc-mono: "Cascadia Code", "IBM Plex Mono", ui-monospace, monospace;color:var(--dsc-white);background:var(--dsc-black);font-family:var(--dsc-font);display:block;height:100%;box-sizing:border-box}*,*:before,*:after{box-sizing:border-box}.dsc-root{height:100%;min-height:100%;overflow:auto;background:radial-gradient(1200px 600px at 10% -10%,rgba(57,255,20,.06),transparent 55%),radial-gradient(900px 500px at 90% 0%,rgba(255,255,255,.03),transparent 50%),var(--dsc-black)}.dsc-shell{display:flex;flex-direction:column;min-height:100%;max-width:1600px;margin:0 auto;padding:16px 20px 28px}.dsc-brand-row{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:10px}.dsc-brand{display:flex;align-items:center;gap:12px;color:var(--dsc-white);text-decoration:none}.dsc-brand img,.dsc-brand svg{width:36px;height:36px;color:var(--dsc-neon)}.dsc-brand-title{display:flex;flex-direction:column;gap:2px}.dsc-brand-title strong{font-size:1.15rem;letter-spacing:.14em;font-weight:700}.dsc-brand-title span{font-size:.72rem;color:var(--dsc-gray-5);letter-spacing:.08em;text-transform:uppercase}.dsc-primary-tabs,.dsc-secondary-tabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:thin;padding-bottom:2px;-webkit-overflow-scrolling:touch}.dsc-primary-tabs{border-bottom:1px solid var(--dsc-gray-3);margin-bottom:8px}.dsc-secondary-tabs{margin-bottom:16px;mask-image:linear-gradient(90deg,#000 85%,transparent)}.dsc-secondary-tabs:after{content:"";flex:0 0 12px}.dsc-tab{appearance:none;border:1px solid transparent;background:transparent;color:var(--dsc-gray-5);padding:10px 14px;min-height:44px;border-radius:8px 8px 0 0;cursor:pointer;font:inherit;font-size:.92rem;letter-spacing:.04em;white-space:nowrap;display:inline-flex;align-items:center;gap:8px;transition:transform .1s ease,box-shadow .1s ease,color .15s ease,border-color .15s ease,background .15s ease;text-decoration:none}.dsc-tab img{width:16px;height:16px;opacity:.85}.dsc-tab:hover{color:var(--dsc-white);background:var(--dsc-gray-1)}.dsc-tab:focus-visible{outline:2px solid var(--dsc-neon);outline-offset:2px}.dsc-tab.active{color:var(--dsc-white);border-bottom:2px solid var(--dsc-neon);box-shadow:0 6px 18px #39ff1414}.dsc-secondary-tabs .dsc-tab{border-radius:999px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-1);min-height:40px;padding:8px 14px}.dsc-secondary-tabs .dsc-tab.active{border-color:var(--dsc-neon-dim);color:var(--dsc-neon);background:#39ff1414;box-shadow:var(--dsc-shadow-tight)}.dsc-btn{appearance:none;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);border-radius:8px;padding:10px 16px;min-height:40px;font:inherit;cursor:pointer;box-shadow:var(--dsc-shadow-tight);transition:transform .1s ease,box-shadow .1s ease,border-color .12s ease,background .12s ease}.dsc-btn:hover{border-color:var(--dsc-neon-dim)}.dsc-btn:active,.dsc-tab:active{transform:translateY(1px);box-shadow:0 1px 3px #000000a6}.dsc-btn.primary{border-color:var(--dsc-neon-dim);color:var(--dsc-black);background:var(--dsc-neon);font-weight:650}.dsc-page{animation:dsc-fade .18s ease}@keyframes dsc-fade{0%{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.dsc-page,.dsc-btn,.dsc-tab,.dsc-live-pulse{animation:none!important;transition:none!important}}.dsc-grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:14px}.dsc-col-3{grid-column:span 3}.dsc-col-4{grid-column:span 4}.dsc-col-6{grid-column:span 6}.dsc-col-8{grid-column:span 8}.dsc-col-12{grid-column:span 12}@media(max-width:1100px){.dsc-col-3,.dsc-col-4{grid-column:span 6}.dsc-col-8{grid-column:span 12}}@media(max-width:720px){.dsc-shell{padding:12px}.dsc-col-3,.dsc-col-4,.dsc-col-6,.dsc-col-8{grid-column:span 12}}.dsc-card{background:linear-gradient(165deg,var(--dsc-gray-1),var(--dsc-black-2));border:1px solid var(--dsc-gray-3);border-radius:var(--dsc-radius);box-shadow:var(--dsc-shadow);padding:14px 16px;min-height:88px}.dsc-card h2,.dsc-card h3{margin:0 0 8px;font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;color:var(--dsc-gray-5);font-weight:600}.dsc-kpi-value{font-size:1.85rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:.02em;color:var(--dsc-white)}.dsc-kpi-unit{margin-left:6px;font-size:.85rem;color:var(--dsc-gray-5)}.dsc-kpi-sub{margin-top:6px;color:var(--dsc-gray-5);font-size:.82rem}.dsc-status-ok{color:var(--dsc-neon)}.dsc-status-bad{color:#ff6b6b}.dsc-status-muted{color:var(--dsc-gray-5)}.dsc-page-title{margin:0 0 14px;font-size:1.35rem;letter-spacing:.04em}.dsc-muted{color:var(--dsc-gray-5)}.dsc-legacy-host{min-height:420px;border-radius:var(--dsc-radius);overflow:hidden;border:1px solid var(--dsc-gray-3);background:#000}.dsc-legacy-host--empty{background:var(--dsc-gray-1);min-height:160px}.dsc-legacy-host>*{display:block;width:100%}.dsc-status-strip{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}.dsc-chip-row{display:flex;flex-wrap:wrap;gap:8px}.dsc-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-1);font-size:.75rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-chip--ok{color:var(--dsc-neon);border-color:var(--dsc-neon-dim);background:#39ff1414;box-shadow:0 0 12px #39ff141f}.dsc-chip--bad{color:#ff8a8a;border-color:#ff6b6b73;background:#ff6b6b1a}.dsc-chip--warn{color:#fbbf24;border-color:#fbbf2473;background:#fbbf241a}.dsc-chip--muted{color:var(--dsc-gray-5)}.dsc-chip--pulse{animation:dsc-chip-pulse 1.6s ease-in-out infinite}@keyframes dsc-chip-pulse{0%,to{box-shadow:0 0 #39ff1400}50%{box-shadow:0 0 14px #39ff1459}}.dsc-demand-row{display:flex;flex-wrap:wrap;gap:8px}.dsc-demand-row--stack{flex-direction:column}.dsc-demand{appearance:none;flex:1 1 110px;min-height:52px;padding:10px 12px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);font:inherit;cursor:pointer;display:flex;flex-direction:column;align-items:flex-start;gap:4px;box-shadow:var(--dsc-shadow-tight);transition:transform .1s ease,box-shadow .1s ease,border-color .12s ease,background .12s ease}.dsc-demand:hover{border-color:var(--dsc-neon-dim)}.dsc-demand:active{transform:translateY(1px);box-shadow:0 1px 3px #000000a6}.dsc-demand.is-on{border-color:var(--dsc-neon);background:#39ff141a;box-shadow:0 0 0 1px #39ff1440,0 0 18px #39ff1433}.dsc-demand.is-missing{opacity:.55;cursor:not-allowed}.dsc-demand-label{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-demand.is-on .dsc-demand-label{color:var(--dsc-neon)}.dsc-demand-state{font-weight:700;font-variant-numeric:tabular-nums;font-size:1rem}.dsc-gauge-row{display:flex;justify-content:space-around;flex-wrap:wrap;gap:8px}.dsc-gauge{display:flex;flex-direction:column;align-items:center;gap:4px}.dsc-gauge-label{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-chart-legend{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:4px;min-height:20px}.dsc-chart-legend-item{display:inline-flex;align-items:center;gap:6px;font-size:.75rem;color:var(--dsc-gray-5)}.dsc-chart-legend-item i{width:8px;height:8px;border-radius:50%;display:inline-block;box-shadow:0 0 6px currentColor}.dsc-chart-last{margin-left:auto;font-variant-numeric:tabular-nums;color:var(--dsc-neon);font-size:13px;font-weight:650}.dsc-fault-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.dsc-fault-list li{display:flex;flex-wrap:wrap;align-items:center;gap:10px}.dsc-empty{padding:18px 14px;border:1px dashed var(--dsc-gray-3);border-radius:8px;color:var(--dsc-gray-5);background:#00000040;font-size:.9rem;line-height:1.45}.dsc-empty--ok{border-style:solid;border-color:var(--dsc-neon-dim);color:var(--dsc-neon)}.dsc-btn:disabled{opacity:.45;cursor:not-allowed}.dsc-glass{background:var(--dsc-glass);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid var(--dsc-glass-border);border-radius:var(--dsc-radius-lg);box-shadow:var(--dsc-shadow)}.dsc-glass--glow{border-color:var(--dsc-teal-dim);box-shadow:0 0 0 1px #26c6da26,0 0 24px #26c6da1f}.dsc-icon-btn{appearance:none;width:36px;height:36px;padding:0;display:inline-flex;align-items:center;justify-content:center;border-radius:10px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);cursor:pointer;box-shadow:var(--dsc-shadow-tight);transition:border-color .12s ease,background .12s ease,transform .1s ease}.dsc-icon-btn:hover{border-color:var(--dsc-teal-dim);color:var(--dsc-teal)}.dsc-icon-btn:active{transform:translateY(1px)}.dsc-result-chip{display:inline-flex;align-items:center;gap:8px;max-width:100%;padding:8px 12px;border-radius:999px;border:1px solid var(--dsc-teal-dim);background:#26c6da1a;color:var(--dsc-white);font-size:.9rem}.dsc-result-chip span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dsc-overflow{position:relative;display:inline-block}.dsc-overflow-menu{position:absolute;right:0;top:calc(100% + 6px);z-index:40;min-width:180px;padding:6px;background:var(--dsc-black-2);border:1px solid var(--dsc-gray-3);border-radius:10px;box-shadow:var(--dsc-shadow)}.dsc-overflow-menu button{appearance:none;width:100%;text-align:left;border:0;background:transparent;color:var(--dsc-white);font:inherit;font-size:.88rem;padding:10px 12px;border-radius:8px;cursor:pointer}.dsc-overflow-menu button:hover{background:#26c6da1f;color:var(--dsc-teal)}.dsc-drawer-root{position:fixed;inset:0;z-index:80;pointer-events:none}.dsc-drawer-root.is-open{pointer-events:auto}.dsc-drawer-scrim{position:absolute;inset:0;background:#00000073;opacity:0;transition:opacity .18s ease}.dsc-drawer-root.is-open .dsc-drawer-scrim{opacity:1}.dsc-drawer-panel{position:absolute;top:0;bottom:0;width:min(380px,92vw);background:linear-gradient(165deg,#121a16,#0a100e);border:1px solid var(--dsc-glass-border);box-shadow:-12px 0 40px #0000008c;display:flex;flex-direction:column;transition:transform .22s ease}.dsc-drawer-panel.right{right:0;transform:translate(105%);border-radius:14px 0 0 14px}.dsc-drawer-panel.left{left:0;transform:translate(-105%);border-radius:0 14px 14px 0}.dsc-drawer-root.is-open .dsc-drawer-panel.right,.dsc-drawer-root.is-open .dsc-drawer-panel.left{transform:none}.dsc-drawer-rail{position:absolute;top:50%;transform:translateY(-50%);width:28px;height:64px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:2}.dsc-drawer-panel.right .dsc-drawer-rail{left:-28px;border-radius:10px 0 0 10px}.dsc-drawer-panel.left .dsc-drawer-rail{right:-28px;border-radius:0 10px 10px 0}.dsc-drawer-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid var(--dsc-gray-3)}.dsc-drawer-head h2{margin:0;font-size:.85rem;letter-spacing:.12em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-drawer-body{flex:1;overflow:auto;padding:14px 16px}.dsc-soil{width:100%;max-width:280px;margin:0 auto}.dsc-soil-pot{position:relative;width:100%;aspect-ratio:4 / 5;border-radius:12px 12px 28px 28px;border:2px solid rgba(120,160,130,.45);background:linear-gradient(180deg,#1a1410,#0e0c0a);overflow:hidden;box-shadow:inset 0 0 24px #0000008c,0 0 20px #26c6da14}.dsc-soil-pot.is-valid{border-color:var(--dsc-teal-dim);box-shadow:inset 0 0 24px #0000008c,0 0 28px #26c6da47}.dsc-soil-layer{position:absolute;left:8%;right:8%;display:flex;align-items:center;justify-content:center;font-size:.72rem;letter-spacing:.04em;color:#f4f7f4eb;text-shadow:0 1px 2px rgba(0,0,0,.65);border-top:1px solid rgba(255,255,255,.08)}.dsc-soil-empty{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--dsc-gray-5);font-size:.85rem;padding:16px;text-align:center}.dsc-seat-layout{display:grid;grid-template-columns:minmax(200px,320px) 1fr;gap:18px;align-items:start}@media(max-width:900px){.dsc-seat-layout{grid-template-columns:1fr}}.dsc-seat-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.dsc-table{width:100%;border-collapse:collapse;font-size:.88rem}.dsc-table th,.dsc-table td{text-align:left;padding:8px 6px;border-bottom:1px solid var(--dsc-gray-3)}.dsc-table th{font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--dsc-gray-5);font-weight:600}.dsc-table tr{cursor:pointer}.dsc-table tr:hover td{background:#26c6da0f}.dsc-btn.teal{border-color:var(--dsc-teal-dim);background:#26c6da2e;color:var(--dsc-white);box-shadow:0 0 18px #26c6da33}.dsc-btn.teal.primary{background:var(--dsc-teal);color:#041018;font-weight:650}@media(prefers-reduced-motion:reduce){.dsc-drawer-panel,.dsc-drawer-scrim{transition:none!important}}', vg = pg;
function yg() {
  const i = Yt(), o = mg(i.pathname), f = hg[o];
  return /* @__PURE__ */ r.jsxs("div", { className: "dsc-shell", children: [
    /* @__PURE__ */ r.jsxs("div", { className: "dsc-brand-row", children: [
      /* @__PURE__ */ r.jsxs(Ei, { className: "dsc-brand", to: "/ops/home", children: [
        /* @__PURE__ */ r.jsx(kn, { name: "brand", size: 36, color: "var(--dsc-neon)" }),
        /* @__PURE__ */ r.jsxs("div", { className: "dsc-brand-title", children: [
          /* @__PURE__ */ r.jsx("strong", { children: "DSC-HUB" }),
          /* @__PURE__ */ r.jsx("span", { children: "Grow operations panel" })
        ] })
      ] }),
      /* @__PURE__ */ r.jsx("div", { className: "dsc-muted", style: { fontSize: 12, letterSpacing: "0.08em" }, children: "SURFACE 6.2.0" })
    ] }),
    /* @__PURE__ */ r.jsx("nav", { className: "dsc-primary-tabs", "aria-label": "Primary", children: dg.map((s) => /* @__PURE__ */ r.jsxs(
      Ei,
      {
        to: s.path,
        className: ({ isActive: h }) => `dsc-tab${h || o === s.id ? " active" : ""}`,
        children: [
          /* @__PURE__ */ r.jsx(kn, { name: s.icon, size: 15 }),
          s.label
        ]
      },
      s.id
    )) }),
    /* @__PURE__ */ r.jsx("nav", { className: "dsc-secondary-tabs", "aria-label": "Section pages", children: f.map((s) => /* @__PURE__ */ r.jsxs(
      Ei,
      {
        to: s.path,
        end: s.path === "/plant" || s.path === "/system",
        className: ({ isActive: h }) => `dsc-tab${h ? " active" : ""}`,
        children: [
          /* @__PURE__ */ r.jsx(kn, { name: s.icon, size: 14 }),
          s.label
        ]
      },
      s.id
    )) }),
    /* @__PURE__ */ r.jsxs(K0, { children: [
      /* @__PURE__ */ r.jsx(Re, { path: "/", element: /* @__PURE__ */ r.jsx(gi, { to: "/ops/home", replace: !0 }) }),
      /* @__PURE__ */ r.jsx(Re, { path: "/ops", element: /* @__PURE__ */ r.jsx(gi, { to: "/ops/home", replace: !0 }) }),
      /* @__PURE__ */ r.jsx(Re, { path: "/ops/home", element: /* @__PURE__ */ r.jsx(Vy, {}) }),
      /* @__PURE__ */ r.jsx(Re, { path: "/ops/dash", element: /* @__PURE__ */ r.jsx($y, {}) }),
      /* @__PURE__ */ r.jsx(Re, { path: "/ops/climate", element: /* @__PURE__ */ r.jsx(Wy, {}) }),
      /* @__PURE__ */ r.jsx(Re, { path: "/ops/main-4x8", element: /* @__PURE__ */ r.jsx(Fy, {}) }),
      /* @__PURE__ */ r.jsx(Re, { path: "/ops/clone-2x4", element: /* @__PURE__ */ r.jsx(Py, {}) }),
      /* @__PURE__ */ r.jsx(Re, { path: "/ops/root-zone", element: /* @__PURE__ */ r.jsx(Iy, {}) }),
      /* @__PURE__ */ r.jsx(Re, { path: "/ops/plant-seat", element: /* @__PURE__ */ r.jsx(Qh, {}) }),
      /* @__PURE__ */ r.jsx(Re, { path: "/ops/tank", element: /* @__PURE__ */ r.jsx(eg, {}) }),
      /* @__PURE__ */ r.jsx(Re, { path: "/ops/lighting", element: /* @__PURE__ */ r.jsx(tg, {}) }),
      /* @__PURE__ */ r.jsx(Re, { path: "/plant", element: /* @__PURE__ */ r.jsx(lg, {}) }),
      /* @__PURE__ */ r.jsx(Re, { path: "/plant/build", element: /* @__PURE__ */ r.jsx(ag, {}) }),
      /* @__PURE__ */ r.jsx(Re, { path: "/plant/catalog", element: /* @__PURE__ */ r.jsx(ng, {}) }),
      /* @__PURE__ */ r.jsx(Re, { path: "/plant/seat", element: /* @__PURE__ */ r.jsx(Qh, {}) }),
      /* @__PURE__ */ r.jsx(Re, { path: "/plant/strains", element: /* @__PURE__ */ r.jsx(ug, {}) }),
      /* @__PURE__ */ r.jsx(Re, { path: "/plant/nutrient", element: /* @__PURE__ */ r.jsx(ig, {}) }),
      /* @__PURE__ */ r.jsx(Re, { path: "/advanced", element: /* @__PURE__ */ r.jsx(gi, { to: "/advanced/learning", replace: !0 }) }),
      /* @__PURE__ */ r.jsx(Re, { path: "/advanced/learning", element: /* @__PURE__ */ r.jsx(sg, {}) }),
      /* @__PURE__ */ r.jsx(Re, { path: "/advanced/trends", element: /* @__PURE__ */ r.jsx(rg, {}) }),
      /* @__PURE__ */ r.jsx(Re, { path: "/advanced/history", element: /* @__PURE__ */ r.jsx(og, {}) }),
      /* @__PURE__ */ r.jsx(Re, { path: "/system", element: /* @__PURE__ */ r.jsx(fg, {}) }),
      /* @__PURE__ */ r.jsx(Re, { path: "*", element: /* @__PURE__ */ r.jsx(gi, { to: "/ops/home", replace: !0 }) })
    ] })
  ] });
}
function gg({ hass: i }) {
  return /* @__PURE__ */ r.jsx(Oy, { hass: i, children: /* @__PURE__ */ r.jsx(yg, {}) });
}
function bg({
  panel: i
}) {
  const [o, f] = j.useState(() => i.hass);
  return j.useEffect(() => {
    const s = () => f(i.hass);
    return s(), i.addEventListener("hass-updated", s), () => {
      i.removeEventListener("hass-updated", s);
    };
  }, [i]), /* @__PURE__ */ r.jsx(yy, { children: /* @__PURE__ */ r.jsx(gg, { hass: o }) });
}
class xg extends HTMLElement {
  constructor() {
    super(...arguments);
    yi(this, "_root", null);
    yi(this, "_hass", null);
    yi(this, "_mounted", !1);
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
${vg}`, this.shadowRoot.appendChild(f);
      const s = document.createElement("div");
      s.className = "dsc-root", s.style.height = "100%", this.shadowRoot.appendChild(s), this._root = Jv.createRoot(s), this._root.render(/* @__PURE__ */ r.jsx(bg, { panel: this })), this._mounted = !0;
    }
  }
  disconnectedCallback() {
    this._root?.unmount(), this._root = null, this._mounted = !1;
  }
}
customElements.get("dsc-hub-panel") || customElements.define("dsc-hub-panel", xg);
export {
  xg as default
};
//# sourceMappingURL=dsc-hub-panel.js.map
