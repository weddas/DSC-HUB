var Pg = Object.defineProperty;
var Ig = (a, r, o) => r in a ? Pg(a, r, { enumerable: !0, configurable: !0, writable: !0, value: o }) : a[r] = o;
var Vi = (a, r, o) => Ig(a, typeof r != "symbol" ? r + "" : r, o);
var ku = { exports: {} }, ps = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var um;
function e0() {
  if (um) return ps;
  um = 1;
  var a = Symbol.for("react.transitional.element"), r = Symbol.for("react.fragment");
  function o(u, d, h) {
    var p = null;
    if (h !== void 0 && (p = "" + h), d.key !== void 0 && (p = "" + d.key), "key" in d) {
      h = {};
      for (var b in d)
        b !== "key" && (h[b] = d[b]);
    } else h = d;
    return d = h.ref, {
      $$typeof: a,
      type: u,
      key: p,
      ref: d !== void 0 ? d : null,
      props: h
    };
  }
  return ps.Fragment = r, ps.jsx = o, ps.jsxs = o, ps;
}
var om;
function t0() {
  return om || (om = 1, ku.exports = e0()), ku.exports;
}
var s = t0(), Cu = { exports: {} }, me = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var dm;
function n0() {
  if (dm) return me;
  dm = 1;
  var a = Symbol.for("react.transitional.element"), r = Symbol.for("react.portal"), o = Symbol.for("react.fragment"), u = Symbol.for("react.strict_mode"), d = Symbol.for("react.profiler"), h = Symbol.for("react.consumer"), p = Symbol.for("react.context"), b = Symbol.for("react.forward_ref"), m = Symbol.for("react.suspense"), g = Symbol.for("react.memo"), v = Symbol.for("react.lazy"), _ = Symbol.for("react.activity"), j = Symbol.iterator;
  function w(N) {
    return N === null || typeof N != "object" ? null : (N = j && N[j] || N["@@iterator"], typeof N == "function" ? N : null);
  }
  var M = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, A = Object.assign, k = {};
  function B(N, U, J) {
    this.props = N, this.context = U, this.refs = k, this.updater = J || M;
  }
  B.prototype.isReactComponent = {}, B.prototype.setState = function(N, U) {
    if (typeof N != "object" && typeof N != "function" && N != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, N, U, "setState");
  }, B.prototype.forceUpdate = function(N) {
    this.updater.enqueueForceUpdate(this, N, "forceUpdate");
  };
  function P() {
  }
  P.prototype = B.prototype;
  function G(N, U, J) {
    this.props = N, this.context = U, this.refs = k, this.updater = J || M;
  }
  var ne = G.prototype = new P();
  ne.constructor = G, A(ne, B.prototype), ne.isPureReactComponent = !0;
  var le = Array.isArray;
  function X() {
  }
  var W = { H: null, A: null, T: null, S: null }, ce = Object.prototype.hasOwnProperty;
  function he(N, U, J) {
    var I = J.ref;
    return {
      $$typeof: a,
      type: N,
      key: U,
      ref: I !== void 0 ? I : null,
      props: J
    };
  }
  function we(N, U) {
    return he(N.type, U, N.props);
  }
  function xe(N) {
    return typeof N == "object" && N !== null && N.$$typeof === a;
  }
  function ge(N) {
    var U = { "=": "=0", ":": "=2" };
    return "$" + N.replace(/[=:]/g, function(J) {
      return U[J];
    });
  }
  var H = /\/+/g;
  function V(N, U) {
    return typeof N == "object" && N !== null && N.key != null ? ge("" + N.key) : U.toString(36);
  }
  function K(N) {
    switch (N.status) {
      case "fulfilled":
        return N.value;
      case "rejected":
        throw N.reason;
      default:
        switch (typeof N.status == "string" ? N.then(X, X) : (N.status = "pending", N.then(
          function(U) {
            N.status === "pending" && (N.status = "fulfilled", N.value = U);
          },
          function(U) {
            N.status === "pending" && (N.status = "rejected", N.reason = U);
          }
        )), N.status) {
          case "fulfilled":
            return N.value;
          case "rejected":
            throw N.reason;
        }
    }
    throw N;
  }
  function T(N, U, J, I, se) {
    var F = typeof N;
    (F === "undefined" || F === "boolean") && (N = null);
    var fe = !1;
    if (N === null) fe = !0;
    else
      switch (F) {
        case "bigint":
        case "string":
        case "number":
          fe = !0;
          break;
        case "object":
          switch (N.$$typeof) {
            case a:
            case r:
              fe = !0;
              break;
            case v:
              return fe = N._init, T(
                fe(N._payload),
                U,
                J,
                I,
                se
              );
          }
      }
    if (fe)
      return se = se(N), fe = I === "" ? "." + V(N, 0) : I, le(se) ? (J = "", fe != null && (J = fe.replace(H, "$&/") + "/"), T(se, U, J, "", function(Nt) {
        return Nt;
      })) : se != null && (xe(se) && (se = we(
        se,
        J + (se.key == null || N && N.key === se.key ? "" : ("" + se.key).replace(
          H,
          "$&/"
        ) + "/") + fe
      )), U.push(se)), 1;
    fe = 0;
    var Ue = I === "" ? "." : I + ":";
    if (le(N))
      for (var Ee = 0; Ee < N.length; Ee++)
        I = N[Ee], F = Ue + V(I, Ee), fe += T(
          I,
          U,
          J,
          F,
          se
        );
    else if (Ee = w(N), typeof Ee == "function")
      for (N = Ee.call(N), Ee = 0; !(I = N.next()).done; )
        I = I.value, F = Ue + V(I, Ee++), fe += T(
          I,
          U,
          J,
          F,
          se
        );
    else if (F === "object") {
      if (typeof N.then == "function")
        return T(
          K(N),
          U,
          J,
          I,
          se
        );
      throw U = String(N), Error(
        "Objects are not valid as a React child (found: " + (U === "[object Object]" ? "object with keys {" + Object.keys(N).join(", ") + "}" : U) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return fe;
  }
  function O(N, U, J) {
    if (N == null) return N;
    var I = [], se = 0;
    return T(N, I, "", "", function(F) {
      return U.call(J, F, se++);
    }), I;
  }
  function Z(N) {
    if (N._status === -1) {
      var U = N._result;
      U = U(), U.then(
        function(J) {
          (N._status === 0 || N._status === -1) && (N._status = 1, N._result = J);
        },
        function(J) {
          (N._status === 0 || N._status === -1) && (N._status = 2, N._result = J);
        }
      ), N._status === -1 && (N._status = 0, N._result = U);
    }
    if (N._status === 1) return N._result.default;
    throw N._result;
  }
  var ee = typeof reportError == "function" ? reportError : function(N) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var U = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof N == "object" && N !== null && typeof N.message == "string" ? String(N.message) : String(N),
        error: N
      });
      if (!window.dispatchEvent(U)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", N);
      return;
    }
    console.error(N);
  }, ue = {
    map: O,
    forEach: function(N, U, J) {
      O(
        N,
        function() {
          U.apply(this, arguments);
        },
        J
      );
    },
    count: function(N) {
      var U = 0;
      return O(N, function() {
        U++;
      }), U;
    },
    toArray: function(N) {
      return O(N, function(U) {
        return U;
      }) || [];
    },
    only: function(N) {
      if (!xe(N))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return N;
    }
  };
  return me.Activity = _, me.Children = ue, me.Component = B, me.Fragment = o, me.Profiler = d, me.PureComponent = G, me.StrictMode = u, me.Suspense = m, me.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = W, me.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(N) {
      return W.H.useMemoCache(N);
    }
  }, me.cache = function(N) {
    return function() {
      return N.apply(null, arguments);
    };
  }, me.cacheSignal = function() {
    return null;
  }, me.cloneElement = function(N, U, J) {
    if (N == null)
      throw Error(
        "The argument must be a React element, but you passed " + N + "."
      );
    var I = A({}, N.props), se = N.key;
    if (U != null)
      for (F in U.key !== void 0 && (se = "" + U.key), U)
        !ce.call(U, F) || F === "key" || F === "__self" || F === "__source" || F === "ref" && U.ref === void 0 || (I[F] = U[F]);
    var F = arguments.length - 2;
    if (F === 1) I.children = J;
    else if (1 < F) {
      for (var fe = Array(F), Ue = 0; Ue < F; Ue++)
        fe[Ue] = arguments[Ue + 2];
      I.children = fe;
    }
    return he(N.type, se, I);
  }, me.createContext = function(N) {
    return N = {
      $$typeof: p,
      _currentValue: N,
      _currentValue2: N,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, N.Provider = N, N.Consumer = {
      $$typeof: h,
      _context: N
    }, N;
  }, me.createElement = function(N, U, J) {
    var I, se = {}, F = null;
    if (U != null)
      for (I in U.key !== void 0 && (F = "" + U.key), U)
        ce.call(U, I) && I !== "key" && I !== "__self" && I !== "__source" && (se[I] = U[I]);
    var fe = arguments.length - 2;
    if (fe === 1) se.children = J;
    else if (1 < fe) {
      for (var Ue = Array(fe), Ee = 0; Ee < fe; Ee++)
        Ue[Ee] = arguments[Ee + 2];
      se.children = Ue;
    }
    if (N && N.defaultProps)
      for (I in fe = N.defaultProps, fe)
        se[I] === void 0 && (se[I] = fe[I]);
    return he(N, F, se);
  }, me.createRef = function() {
    return { current: null };
  }, me.forwardRef = function(N) {
    return { $$typeof: b, render: N };
  }, me.isValidElement = xe, me.lazy = function(N) {
    return {
      $$typeof: v,
      _payload: { _status: -1, _result: N },
      _init: Z
    };
  }, me.memo = function(N, U) {
    return {
      $$typeof: g,
      type: N,
      compare: U === void 0 ? null : U
    };
  }, me.startTransition = function(N) {
    var U = W.T, J = {};
    W.T = J;
    try {
      var I = N(), se = W.S;
      se !== null && se(J, I), typeof I == "object" && I !== null && typeof I.then == "function" && I.then(X, ee);
    } catch (F) {
      ee(F);
    } finally {
      U !== null && J.types !== null && (U.types = J.types), W.T = U;
    }
  }, me.unstable_useCacheRefresh = function() {
    return W.H.useCacheRefresh();
  }, me.use = function(N) {
    return W.H.use(N);
  }, me.useActionState = function(N, U, J) {
    return W.H.useActionState(N, U, J);
  }, me.useCallback = function(N, U) {
    return W.H.useCallback(N, U);
  }, me.useContext = function(N) {
    return W.H.useContext(N);
  }, me.useDebugValue = function() {
  }, me.useDeferredValue = function(N, U) {
    return W.H.useDeferredValue(N, U);
  }, me.useEffect = function(N, U) {
    return W.H.useEffect(N, U);
  }, me.useEffectEvent = function(N) {
    return W.H.useEffectEvent(N);
  }, me.useId = function() {
    return W.H.useId();
  }, me.useImperativeHandle = function(N, U, J) {
    return W.H.useImperativeHandle(N, U, J);
  }, me.useInsertionEffect = function(N, U) {
    return W.H.useInsertionEffect(N, U);
  }, me.useLayoutEffect = function(N, U) {
    return W.H.useLayoutEffect(N, U);
  }, me.useMemo = function(N, U) {
    return W.H.useMemo(N, U);
  }, me.useOptimistic = function(N, U) {
    return W.H.useOptimistic(N, U);
  }, me.useReducer = function(N, U, J) {
    return W.H.useReducer(N, U, J);
  }, me.useRef = function(N) {
    return W.H.useRef(N);
  }, me.useState = function(N) {
    return W.H.useState(N);
  }, me.useSyncExternalStore = function(N, U, J) {
    return W.H.useSyncExternalStore(
      N,
      U,
      J
    );
  }, me.useTransition = function() {
    return W.H.useTransition();
  }, me.version = "19.2.8", me;
}
var fm;
function Qu() {
  return fm || (fm = 1, Cu.exports = n0()), Cu.exports;
}
var y = Qu(), Tu = { exports: {} }, vs = {}, Au = { exports: {} }, Ru = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hm;
function l0() {
  return hm || (hm = 1, (function(a) {
    function r(T, O) {
      var Z = T.length;
      T.push(O);
      e: for (; 0 < Z; ) {
        var ee = Z - 1 >>> 1, ue = T[ee];
        if (0 < d(ue, O))
          T[ee] = O, T[Z] = ue, Z = ee;
        else break e;
      }
    }
    function o(T) {
      return T.length === 0 ? null : T[0];
    }
    function u(T) {
      if (T.length === 0) return null;
      var O = T[0], Z = T.pop();
      if (Z !== O) {
        T[0] = Z;
        e: for (var ee = 0, ue = T.length, N = ue >>> 1; ee < N; ) {
          var U = 2 * (ee + 1) - 1, J = T[U], I = U + 1, se = T[I];
          if (0 > d(J, Z))
            I < ue && 0 > d(se, J) ? (T[ee] = se, T[I] = Z, ee = I) : (T[ee] = J, T[U] = Z, ee = U);
          else if (I < ue && 0 > d(se, Z))
            T[ee] = se, T[I] = Z, ee = I;
          else break e;
        }
      }
      return O;
    }
    function d(T, O) {
      var Z = T.sortIndex - O.sortIndex;
      return Z !== 0 ? Z : T.id - O.id;
    }
    if (a.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var h = performance;
      a.unstable_now = function() {
        return h.now();
      };
    } else {
      var p = Date, b = p.now();
      a.unstable_now = function() {
        return p.now() - b;
      };
    }
    var m = [], g = [], v = 1, _ = null, j = 3, w = !1, M = !1, A = !1, k = !1, B = typeof setTimeout == "function" ? setTimeout : null, P = typeof clearTimeout == "function" ? clearTimeout : null, G = typeof setImmediate < "u" ? setImmediate : null;
    function ne(T) {
      for (var O = o(g); O !== null; ) {
        if (O.callback === null) u(g);
        else if (O.startTime <= T)
          u(g), O.sortIndex = O.expirationTime, r(m, O);
        else break;
        O = o(g);
      }
    }
    function le(T) {
      if (A = !1, ne(T), !M)
        if (o(m) !== null)
          M = !0, X || (X = !0, ge());
        else {
          var O = o(g);
          O !== null && K(le, O.startTime - T);
        }
    }
    var X = !1, W = -1, ce = 5, he = -1;
    function we() {
      return k ? !0 : !(a.unstable_now() - he < ce);
    }
    function xe() {
      if (k = !1, X) {
        var T = a.unstable_now();
        he = T;
        var O = !0;
        try {
          e: {
            M = !1, A && (A = !1, P(W), W = -1), w = !0;
            var Z = j;
            try {
              t: {
                for (ne(T), _ = o(m); _ !== null && !(_.expirationTime > T && we()); ) {
                  var ee = _.callback;
                  if (typeof ee == "function") {
                    _.callback = null, j = _.priorityLevel;
                    var ue = ee(
                      _.expirationTime <= T
                    );
                    if (T = a.unstable_now(), typeof ue == "function") {
                      _.callback = ue, ne(T), O = !0;
                      break t;
                    }
                    _ === o(m) && u(m), ne(T);
                  } else u(m);
                  _ = o(m);
                }
                if (_ !== null) O = !0;
                else {
                  var N = o(g);
                  N !== null && K(
                    le,
                    N.startTime - T
                  ), O = !1;
                }
              }
              break e;
            } finally {
              _ = null, j = Z, w = !1;
            }
            O = void 0;
          }
        } finally {
          O ? ge() : X = !1;
        }
      }
    }
    var ge;
    if (typeof G == "function")
      ge = function() {
        G(xe);
      };
    else if (typeof MessageChannel < "u") {
      var H = new MessageChannel(), V = H.port2;
      H.port1.onmessage = xe, ge = function() {
        V.postMessage(null);
      };
    } else
      ge = function() {
        B(xe, 0);
      };
    function K(T, O) {
      W = B(function() {
        T(a.unstable_now());
      }, O);
    }
    a.unstable_IdlePriority = 5, a.unstable_ImmediatePriority = 1, a.unstable_LowPriority = 4, a.unstable_NormalPriority = 3, a.unstable_Profiling = null, a.unstable_UserBlockingPriority = 2, a.unstable_cancelCallback = function(T) {
      T.callback = null;
    }, a.unstable_forceFrameRate = function(T) {
      0 > T || 125 < T ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : ce = 0 < T ? Math.floor(1e3 / T) : 5;
    }, a.unstable_getCurrentPriorityLevel = function() {
      return j;
    }, a.unstable_next = function(T) {
      switch (j) {
        case 1:
        case 2:
        case 3:
          var O = 3;
          break;
        default:
          O = j;
      }
      var Z = j;
      j = O;
      try {
        return T();
      } finally {
        j = Z;
      }
    }, a.unstable_requestPaint = function() {
      k = !0;
    }, a.unstable_runWithPriority = function(T, O) {
      switch (T) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          T = 3;
      }
      var Z = j;
      j = T;
      try {
        return O();
      } finally {
        j = Z;
      }
    }, a.unstable_scheduleCallback = function(T, O, Z) {
      var ee = a.unstable_now();
      switch (typeof Z == "object" && Z !== null ? (Z = Z.delay, Z = typeof Z == "number" && 0 < Z ? ee + Z : ee) : Z = ee, T) {
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
      return ue = Z + ue, T = {
        id: v++,
        callback: O,
        priorityLevel: T,
        startTime: Z,
        expirationTime: ue,
        sortIndex: -1
      }, Z > ee ? (T.sortIndex = Z, r(g, T), o(m) === null && T === o(g) && (A ? (P(W), W = -1) : A = !0, K(le, Z - ee))) : (T.sortIndex = ue, r(m, T), M || w || (M = !0, X || (X = !0, ge()))), T;
    }, a.unstable_shouldYield = we, a.unstable_wrapCallback = function(T) {
      var O = j;
      return function() {
        var Z = j;
        j = O;
        try {
          return T.apply(this, arguments);
        } finally {
          j = Z;
        }
      };
    };
  })(Ru)), Ru;
}
var mm;
function a0() {
  return mm || (mm = 1, Au.exports = l0()), Au.exports;
}
var zu = { exports: {} }, ft = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var pm;
function s0() {
  if (pm) return ft;
  pm = 1;
  var a = Qu();
  function r(m) {
    var g = "https://react.dev/errors/" + m;
    if (1 < arguments.length) {
      g += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var v = 2; v < arguments.length; v++)
        g += "&args[]=" + encodeURIComponent(arguments[v]);
    }
    return "Minified React error #" + m + "; visit " + g + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
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
  }, d = Symbol.for("react.portal");
  function h(m, g, v) {
    var _ = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: d,
      key: _ == null ? null : "" + _,
      children: m,
      containerInfo: g,
      implementation: v
    };
  }
  var p = a.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function b(m, g) {
    if (m === "font") return "";
    if (typeof g == "string")
      return g === "use-credentials" ? g : "";
  }
  return ft.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = u, ft.createPortal = function(m, g) {
    var v = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!g || g.nodeType !== 1 && g.nodeType !== 9 && g.nodeType !== 11)
      throw Error(r(299));
    return h(m, g, null, v);
  }, ft.flushSync = function(m) {
    var g = p.T, v = u.p;
    try {
      if (p.T = null, u.p = 2, m) return m();
    } finally {
      p.T = g, u.p = v, u.d.f();
    }
  }, ft.preconnect = function(m, g) {
    typeof m == "string" && (g ? (g = g.crossOrigin, g = typeof g == "string" ? g === "use-credentials" ? g : "" : void 0) : g = null, u.d.C(m, g));
  }, ft.prefetchDNS = function(m) {
    typeof m == "string" && u.d.D(m);
  }, ft.preinit = function(m, g) {
    if (typeof m == "string" && g && typeof g.as == "string") {
      var v = g.as, _ = b(v, g.crossOrigin), j = typeof g.integrity == "string" ? g.integrity : void 0, w = typeof g.fetchPriority == "string" ? g.fetchPriority : void 0;
      v === "style" ? u.d.S(
        m,
        typeof g.precedence == "string" ? g.precedence : void 0,
        {
          crossOrigin: _,
          integrity: j,
          fetchPriority: w
        }
      ) : v === "script" && u.d.X(m, {
        crossOrigin: _,
        integrity: j,
        fetchPriority: w,
        nonce: typeof g.nonce == "string" ? g.nonce : void 0
      });
    }
  }, ft.preinitModule = function(m, g) {
    if (typeof m == "string")
      if (typeof g == "object" && g !== null) {
        if (g.as == null || g.as === "script") {
          var v = b(
            g.as,
            g.crossOrigin
          );
          u.d.M(m, {
            crossOrigin: v,
            integrity: typeof g.integrity == "string" ? g.integrity : void 0,
            nonce: typeof g.nonce == "string" ? g.nonce : void 0
          });
        }
      } else g == null && u.d.M(m);
  }, ft.preload = function(m, g) {
    if (typeof m == "string" && typeof g == "object" && g !== null && typeof g.as == "string") {
      var v = g.as, _ = b(v, g.crossOrigin);
      u.d.L(m, v, {
        crossOrigin: _,
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
  }, ft.preloadModule = function(m, g) {
    if (typeof m == "string")
      if (g) {
        var v = b(g.as, g.crossOrigin);
        u.d.m(m, {
          as: typeof g.as == "string" && g.as !== "script" ? g.as : void 0,
          crossOrigin: v,
          integrity: typeof g.integrity == "string" ? g.integrity : void 0
        });
      } else u.d.m(m);
  }, ft.requestFormReset = function(m) {
    u.d.r(m);
  }, ft.unstable_batchedUpdates = function(m, g) {
    return m(g);
  }, ft.useFormState = function(m, g, v) {
    return p.H.useFormState(m, g, v);
  }, ft.useFormStatus = function() {
    return p.H.useHostTransitionStatus();
  }, ft.version = "19.2.8", ft;
}
var vm;
function i0() {
  if (vm) return zu.exports;
  vm = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (r) {
        console.error(r);
      }
  }
  return a(), zu.exports = s0(), zu.exports;
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
var gm;
function c0() {
  if (gm) return vs;
  gm = 1;
  var a = a0(), r = Qu(), o = i0();
  function u(e) {
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
  function p(e) {
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
  function m(e) {
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
          if (c === n) return m(i), e;
          if (c === l) return m(i), t;
          c = c.sibling;
        }
        throw Error(u(188));
      }
      if (n.return !== l.return) n = i, l = c;
      else {
        for (var f = !1, x = i.child; x; ) {
          if (x === n) {
            f = !0, n = i, l = c;
            break;
          }
          if (x === l) {
            f = !0, l = i, n = c;
            break;
          }
          x = x.sibling;
        }
        if (!f) {
          for (x = c.child; x; ) {
            if (x === n) {
              f = !0, n = c, l = i;
              break;
            }
            if (x === l) {
              f = !0, l = c, n = i;
              break;
            }
            x = x.sibling;
          }
          if (!f) throw Error(u(189));
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
  var _ = Object.assign, j = Symbol.for("react.element"), w = Symbol.for("react.transitional.element"), M = Symbol.for("react.portal"), A = Symbol.for("react.fragment"), k = Symbol.for("react.strict_mode"), B = Symbol.for("react.profiler"), P = Symbol.for("react.consumer"), G = Symbol.for("react.context"), ne = Symbol.for("react.forward_ref"), le = Symbol.for("react.suspense"), X = Symbol.for("react.suspense_list"), W = Symbol.for("react.memo"), ce = Symbol.for("react.lazy"), he = Symbol.for("react.activity"), we = Symbol.for("react.memo_cache_sentinel"), xe = Symbol.iterator;
  function ge(e) {
    return e === null || typeof e != "object" ? null : (e = xe && e[xe] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var H = Symbol.for("react.client.reference");
  function V(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === H ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case A:
        return "Fragment";
      case B:
        return "Profiler";
      case k:
        return "StrictMode";
      case le:
        return "Suspense";
      case X:
        return "SuspenseList";
      case he:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case M:
          return "Portal";
        case G:
          return e.displayName || "Context";
        case P:
          return (e._context.displayName || "Context") + ".Consumer";
        case ne:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case W:
          return t = e.displayName || null, t !== null ? t : V(e.type) || "Memo";
        case ce:
          t = e._payload, e = e._init;
          try {
            return V(e(t));
          } catch {
          }
      }
    return null;
  }
  var K = Array.isArray, T = r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, O = o.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Z = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, ee = [], ue = -1;
  function N(e) {
    return { current: e };
  }
  function U(e) {
    0 > ue || (e.current = ee[ue], ee[ue] = null, ue--);
  }
  function J(e, t) {
    ue++, ee[ue] = e.current, e.current = t;
  }
  var I = N(null), se = N(null), F = N(null), fe = N(null);
  function Ue(e, t) {
    switch (J(F, t), J(se, e), J(I, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? Rh(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = Rh(t), e = zh(t, e);
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
    U(I), J(I, e);
  }
  function Ee() {
    U(I), U(se), U(F);
  }
  function Nt(e) {
    e.memoizedState !== null && J(fe, e);
    var t = I.current, n = zh(t, e.type);
    t !== n && (J(se, e), J(I, n));
  }
  function nn(e) {
    se.current === e && (U(I), U(se)), fe.current === e && (U(fe), ds._currentValue = Z);
  }
  var Ne, Wt;
  function $t(e) {
    if (Ne === void 0)
      try {
        throw Error();
      } catch (n) {
        var t = n.stack.trim().match(/\n( *(at )?)/);
        Ne = t && t[1] || "", Wt = -1 < n.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < n.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + Ne + e + Wt;
  }
  var ja = !1;
  function Hn(e, t) {
    if (!e || ja) return "";
    ja = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var l = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var Y = function() {
                throw Error();
              };
              if (Object.defineProperty(Y.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(Y, []);
                } catch (L) {
                  var D = L;
                }
                Reflect.construct(e, [], Y);
              } else {
                try {
                  Y.call();
                } catch (L) {
                  D = L;
                }
                e.call(Y.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (L) {
                D = L;
              }
              (Y = e()) && typeof Y.catch == "function" && Y.catch(function() {
              });
            }
          } catch (L) {
            if (L && D && typeof L.stack == "string")
              return [L.stack, D.stack];
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
      var c = l.DetermineComponentFrameRoot(), f = c[0], x = c[1];
      if (f && x) {
        var S = f.split(`
`), z = x.split(`
`);
        for (i = l = 0; l < S.length && !S[l].includes("DetermineComponentFrameRoot"); )
          l++;
        for (; i < z.length && !z[i].includes(
          "DetermineComponentFrameRoot"
        ); )
          i++;
        if (l === S.length || i === z.length)
          for (l = S.length - 1, i = z.length - 1; 1 <= l && 0 <= i && S[l] !== z[i]; )
            i--;
        for (; 1 <= l && 0 <= i; l--, i--)
          if (S[l] !== z[i]) {
            if (l !== 1 || i !== 1)
              do
                if (l--, i--, 0 > i || S[l] !== z[i]) {
                  var $ = `
` + S[l].replace(" at new ", " at ");
                  return e.displayName && $.includes("<anonymous>") && ($ = $.replace("<anonymous>", e.displayName)), $;
                }
              while (1 <= l && 0 <= i);
            break;
          }
      }
    } finally {
      ja = !1, Error.prepareStackTrace = n;
    }
    return (n = e ? e.displayName || e.name : "") ? $t(n) : "";
  }
  function Ol(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return $t(e.type);
      case 16:
        return $t("Lazy");
      case 13:
        return e.child !== t && t !== null ? $t("Suspense Fallback") : $t("Suspense");
      case 19:
        return $t("SuspenseList");
      case 0:
      case 15:
        return Hn(e.type, !1);
      case 11:
        return Hn(e.type.render, !1);
      case 1:
        return Hn(e.type, !0);
      case 31:
        return $t("Activity");
      default:
        return "";
    }
  }
  function ol(e) {
    try {
      var t = "", n = null;
      do
        t += Ol(e, n), n = e, e = e.return;
      while (e);
      return t;
    } catch (l) {
      return `
Error generating stack: ` + l.message + `
` + l.stack;
    }
  }
  var hc = Object.prototype.hasOwnProperty, mc = a.unstable_scheduleCallback, pc = a.unstable_cancelCallback, Tp = a.unstable_shouldYield, Ap = a.unstable_requestPaint, Et = a.unstable_now, Rp = a.unstable_getCurrentPriorityLevel, ro = a.unstable_ImmediatePriority, uo = a.unstable_UserBlockingPriority, ks = a.unstable_NormalPriority, zp = a.unstable_LowPriority, oo = a.unstable_IdlePriority, Op = a.log, Dp = a.unstable_setDisableYieldValue, Sa = null, Mt = null;
  function Ln(e) {
    if (typeof Op == "function" && Dp(e), Mt && typeof Mt.setStrictMode == "function")
      try {
        Mt.setStrictMode(Sa, e);
      } catch {
      }
  }
  var kt = Math.clz32 ? Math.clz32 : Up, Hp = Math.log, Lp = Math.LN2;
  function Up(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Hp(e) / Lp | 0) | 0;
  }
  var Cs = 256, Ts = 262144, As = 4194304;
  function dl(e) {
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
  function Rs(e, t, n) {
    var l = e.pendingLanes;
    if (l === 0) return 0;
    var i = 0, c = e.suspendedLanes, f = e.pingedLanes;
    e = e.warmLanes;
    var x = l & 134217727;
    return x !== 0 ? (l = x & ~c, l !== 0 ? i = dl(l) : (f &= x, f !== 0 ? i = dl(f) : n || (n = x & ~e, n !== 0 && (i = dl(n))))) : (x = l & ~c, x !== 0 ? i = dl(x) : f !== 0 ? i = dl(f) : n || (n = l & ~e, n !== 0 && (i = dl(n)))), i === 0 ? 0 : t !== 0 && t !== i && (t & c) === 0 && (c = i & -i, n = t & -t, c >= n || c === 32 && (n & 4194048) !== 0) ? t : i;
  }
  function wa(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function Bp(e, t) {
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
  function fo() {
    var e = As;
    return As <<= 1, (As & 62914560) === 0 && (As = 4194304), e;
  }
  function vc(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function Na(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function $p(e, t, n, l, i, c) {
    var f = e.pendingLanes;
    e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
    var x = e.entanglements, S = e.expirationTimes, z = e.hiddenUpdates;
    for (n = f & ~n; 0 < n; ) {
      var $ = 31 - kt(n), Y = 1 << $;
      x[$] = 0, S[$] = -1;
      var D = z[$];
      if (D !== null)
        for (z[$] = null, $ = 0; $ < D.length; $++) {
          var L = D[$];
          L !== null && (L.lane &= -536870913);
        }
      n &= ~Y;
    }
    l !== 0 && ho(e, l, 0), c !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= c & ~(f & ~t));
  }
  function ho(e, t, n) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var l = 31 - kt(t);
    e.entangledLanes |= t, e.entanglements[l] = e.entanglements[l] | 1073741824 | n & 261930;
  }
  function mo(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var l = 31 - kt(n), i = 1 << l;
      i & t | e[l] & t && (e[l] |= t), n &= ~i;
    }
  }
  function po(e, t) {
    var n = t & -t;
    return n = (n & 42) !== 0 ? 1 : gc(n), (n & (e.suspendedLanes | t)) !== 0 ? 0 : n;
  }
  function gc(e) {
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
  function xc(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function vo() {
    var e = O.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : nm(e.type));
  }
  function go(e, t) {
    var n = O.p;
    try {
      return O.p = e, t();
    } finally {
      O.p = n;
    }
  }
  var Un = Math.random().toString(36).slice(2), it = "__reactFiber$" + Un, xt = "__reactProps$" + Un, Dl = "__reactContainer$" + Un, bc = "__reactEvents$" + Un, Gp = "__reactListeners$" + Un, qp = "__reactHandles$" + Un, xo = "__reactResources$" + Un, Ea = "__reactMarker$" + Un;
  function _c(e) {
    delete e[it], delete e[xt], delete e[bc], delete e[Gp], delete e[qp];
  }
  function Hl(e) {
    var t = e[it];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[Dl] || n[it]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null)
          for (e = $h(e); e !== null; ) {
            if (n = e[it]) return n;
            e = $h(e);
          }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function Ll(e) {
    if (e = e[it] || e[Dl]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function Ma(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(u(33));
  }
  function Ul(e) {
    var t = e[xo];
    return t || (t = e[xo] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function at(e) {
    e[Ea] = !0;
  }
  var bo = /* @__PURE__ */ new Set(), _o = {};
  function fl(e, t) {
    Bl(e, t), Bl(e + "Capture", t);
  }
  function Bl(e, t) {
    for (_o[e] = t, e = 0; e < t.length; e++)
      bo.add(t[e]);
  }
  var Yp = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), yo = {}, jo = {};
  function Qp(e) {
    return hc.call(jo, e) ? !0 : hc.call(yo, e) ? !1 : Yp.test(e) ? jo[e] = !0 : (yo[e] = !0, !1);
  }
  function zs(e, t, n) {
    if (Qp(t))
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
  function Os(e, t, n) {
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
  function hn(e, t, n, l) {
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
  function Gt(e) {
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
  function So(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Vp(e, t, n) {
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
        set: function(f) {
          n = "" + f, c.call(this, f);
        }
      }), Object.defineProperty(e, t, {
        enumerable: l.enumerable
      }), {
        getValue: function() {
          return n;
        },
        setValue: function(f) {
          n = "" + f;
        },
        stopTracking: function() {
          e._valueTracker = null, delete e[t];
        }
      };
    }
  }
  function yc(e) {
    if (!e._valueTracker) {
      var t = So(e) ? "checked" : "value";
      e._valueTracker = Vp(
        e,
        t,
        "" + e[t]
      );
    }
  }
  function wo(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), l = "";
    return e && (l = So(e) ? e.checked ? "true" : "false" : e.value), e = l, e !== n ? (t.setValue(e), !0) : !1;
  }
  function Ds(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var Xp = /[\n"\\]/g;
  function qt(e) {
    return e.replace(
      Xp,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function jc(e, t, n, l, i, c, f, x) {
    e.name = "", f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" ? e.type = f : e.removeAttribute("type"), t != null ? f === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Gt(t)) : e.value !== "" + Gt(t) && (e.value = "" + Gt(t)) : f !== "submit" && f !== "reset" || e.removeAttribute("value"), t != null ? Sc(e, f, Gt(t)) : n != null ? Sc(e, f, Gt(n)) : l != null && e.removeAttribute("value"), i == null && c != null && (e.defaultChecked = !!c), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), x != null && typeof x != "function" && typeof x != "symbol" && typeof x != "boolean" ? e.name = "" + Gt(x) : e.removeAttribute("name");
  }
  function No(e, t, n, l, i, c, f, x) {
    if (c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" && (e.type = c), t != null || n != null) {
      if (!(c !== "submit" && c !== "reset" || t != null)) {
        yc(e);
        return;
      }
      n = n != null ? "" + Gt(n) : "", t = t != null ? "" + Gt(t) : n, x || t === e.value || (e.value = t), e.defaultValue = t;
    }
    l = l ?? i, l = typeof l != "function" && typeof l != "symbol" && !!l, e.checked = x ? e.checked : !!l, e.defaultChecked = !!l, f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" && (e.name = f), yc(e);
  }
  function Sc(e, t, n) {
    t === "number" && Ds(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
  }
  function $l(e, t, n, l) {
    if (e = e.options, t) {
      t = {};
      for (var i = 0; i < n.length; i++)
        t["$" + n[i]] = !0;
      for (n = 0; n < e.length; n++)
        i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && l && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + Gt(n), t = null, i = 0; i < e.length; i++) {
        if (e[i].value === n) {
          e[i].selected = !0, l && (e[i].defaultSelected = !0);
          return;
        }
        t !== null || e[i].disabled || (t = e[i]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Eo(e, t, n) {
    if (t != null && (t = "" + Gt(t), t !== e.value && (e.value = t), n == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = n != null ? "" + Gt(n) : "";
  }
  function Mo(e, t, n, l) {
    if (t == null) {
      if (l != null) {
        if (n != null) throw Error(u(92));
        if (K(l)) {
          if (1 < l.length) throw Error(u(93));
          l = l[0];
        }
        n = l;
      }
      n == null && (n = ""), t = n;
    }
    n = Gt(t), e.defaultValue = n, l = e.textContent, l === n && l !== "" && l !== null && (e.value = l), yc(e);
  }
  function Gl(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Zp = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function ko(e, t, n) {
    var l = t.indexOf("--") === 0;
    n == null || typeof n == "boolean" || n === "" ? l ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : l ? e.setProperty(t, n) : typeof n != "number" || n === 0 || Zp.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
  }
  function Co(e, t, n) {
    if (t != null && typeof t != "object")
      throw Error(u(62));
    if (e = e.style, n != null) {
      for (var l in n)
        !n.hasOwnProperty(l) || t != null && t.hasOwnProperty(l) || (l.indexOf("--") === 0 ? e.setProperty(l, "") : l === "float" ? e.cssFloat = "" : e[l] = "");
      for (var i in t)
        l = t[i], t.hasOwnProperty(i) && n[i] !== l && ko(e, i, l);
    } else
      for (var c in t)
        t.hasOwnProperty(c) && ko(e, c, t[c]);
  }
  function wc(e) {
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
  var Kp = /* @__PURE__ */ new Map([
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
  ]), Fp = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Hs(e) {
    return Fp.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  function mn() {
  }
  var Nc = null;
  function Ec(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var ql = null, Yl = null;
  function To(e) {
    var t = Ll(e);
    if (t && (e = t.stateNode)) {
      var n = e[xt] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (jc(
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
              'input[name="' + qt(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < n.length; t++) {
              var l = n[t];
              if (l !== e && l.form === e.form) {
                var i = l[xt] || null;
                if (!i) throw Error(u(90));
                jc(
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
              l = n[t], l.form === e.form && wo(l);
          }
          break e;
        case "textarea":
          Eo(e, n.value, n.defaultValue);
          break e;
        case "select":
          t = n.value, t != null && $l(e, !!n.multiple, t, !1);
      }
    }
  }
  var Mc = !1;
  function Ao(e, t, n) {
    if (Mc) return e(t, n);
    Mc = !0;
    try {
      var l = e(t);
      return l;
    } finally {
      if (Mc = !1, (ql !== null || Yl !== null) && (Si(), ql && (t = ql, e = Yl, Yl = ql = null, To(t), e)))
        for (t = 0; t < e.length; t++) To(e[t]);
    }
  }
  function ka(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var l = n[xt] || null;
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
  var pn = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), kc = !1;
  if (pn)
    try {
      var Ca = {};
      Object.defineProperty(Ca, "passive", {
        get: function() {
          kc = !0;
        }
      }), window.addEventListener("test", Ca, Ca), window.removeEventListener("test", Ca, Ca);
    } catch {
      kc = !1;
    }
  var Bn = null, Cc = null, Ls = null;
  function Ro() {
    if (Ls) return Ls;
    var e, t = Cc, n = t.length, l, i = "value" in Bn ? Bn.value : Bn.textContent, c = i.length;
    for (e = 0; e < n && t[e] === i[e]; e++) ;
    var f = n - e;
    for (l = 1; l <= f && t[n - l] === i[c - l]; l++) ;
    return Ls = i.slice(e, 1 < l ? 1 - l : void 0);
  }
  function Us(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Bs() {
    return !0;
  }
  function zo() {
    return !1;
  }
  function bt(e) {
    function t(n, l, i, c, f) {
      this._reactName = n, this._targetInst = i, this.type = l, this.nativeEvent = c, this.target = f, this.currentTarget = null;
      for (var x in e)
        e.hasOwnProperty(x) && (n = e[x], this[x] = n ? n(c) : c[x]);
      return this.isDefaultPrevented = (c.defaultPrevented != null ? c.defaultPrevented : c.returnValue === !1) ? Bs : zo, this.isPropagationStopped = zo, this;
    }
    return _(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Bs);
      },
      stopPropagation: function() {
        var n = this.nativeEvent;
        n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Bs);
      },
      persist: function() {
      },
      isPersistent: Bs
    }), t;
  }
  var hl = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, $s = bt(hl), Ta = _({}, hl, { view: 0, detail: 0 }), Jp = bt(Ta), Tc, Ac, Aa, Gs = _({}, Ta, {
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
    getModifierState: zc,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== Aa && (Aa && e.type === "mousemove" ? (Tc = e.screenX - Aa.screenX, Ac = e.screenY - Aa.screenY) : Ac = Tc = 0, Aa = e), Tc);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : Ac;
    }
  }), Oo = bt(Gs), Wp = _({}, Gs, { dataTransfer: 0 }), Pp = bt(Wp), Ip = _({}, Ta, { relatedTarget: 0 }), Rc = bt(Ip), ev = _({}, hl, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), tv = bt(ev), nv = _({}, hl, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), lv = bt(nv), av = _({}, hl, { data: 0 }), Do = bt(av), sv = {
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
  }, iv = {
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
  }, cv = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function rv(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = cv[e]) ? !!t[e] : !1;
  }
  function zc() {
    return rv;
  }
  var uv = _({}, Ta, {
    key: function(e) {
      if (e.key) {
        var t = sv[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = Us(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? iv[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: zc,
    charCode: function(e) {
      return e.type === "keypress" ? Us(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? Us(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), ov = bt(uv), dv = _({}, Gs, {
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
  }), Ho = bt(dv), fv = _({}, Ta, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: zc
  }), hv = bt(fv), mv = _({}, hl, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), pv = bt(mv), vv = _({}, Gs, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), gv = bt(vv), xv = _({}, hl, {
    newState: 0,
    oldState: 0
  }), bv = bt(xv), _v = [9, 13, 27, 32], Oc = pn && "CompositionEvent" in window, Ra = null;
  pn && "documentMode" in document && (Ra = document.documentMode);
  var yv = pn && "TextEvent" in window && !Ra, Lo = pn && (!Oc || Ra && 8 < Ra && 11 >= Ra), Uo = " ", Bo = !1;
  function $o(e, t) {
    switch (e) {
      case "keyup":
        return _v.indexOf(t.keyCode) !== -1;
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
  function Go(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Ql = !1;
  function jv(e, t) {
    switch (e) {
      case "compositionend":
        return Go(t);
      case "keypress":
        return t.which !== 32 ? null : (Bo = !0, Uo);
      case "textInput":
        return e = t.data, e === Uo && Bo ? null : e;
      default:
        return null;
    }
  }
  function Sv(e, t) {
    if (Ql)
      return e === "compositionend" || !Oc && $o(e, t) ? (e = Ro(), Ls = Cc = Bn = null, Ql = !1, e) : null;
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
        return Lo && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var wv = {
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
  function qo(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!wv[e.type] : t === "textarea";
  }
  function Yo(e, t, n, l) {
    ql ? Yl ? Yl.push(l) : Yl = [l] : ql = l, t = Ti(t, "onChange"), 0 < t.length && (n = new $s(
      "onChange",
      "change",
      null,
      n,
      l
    ), e.push({ event: n, listeners: t }));
  }
  var za = null, Oa = null;
  function Nv(e) {
    Eh(e, 0);
  }
  function qs(e) {
    var t = Ma(e);
    if (wo(t)) return e;
  }
  function Qo(e, t) {
    if (e === "change") return t;
  }
  var Vo = !1;
  if (pn) {
    var Dc;
    if (pn) {
      var Hc = "oninput" in document;
      if (!Hc) {
        var Xo = document.createElement("div");
        Xo.setAttribute("oninput", "return;"), Hc = typeof Xo.oninput == "function";
      }
      Dc = Hc;
    } else Dc = !1;
    Vo = Dc && (!document.documentMode || 9 < document.documentMode);
  }
  function Zo() {
    za && (za.detachEvent("onpropertychange", Ko), Oa = za = null);
  }
  function Ko(e) {
    if (e.propertyName === "value" && qs(Oa)) {
      var t = [];
      Yo(
        t,
        Oa,
        e,
        Ec(e)
      ), Ao(Nv, t);
    }
  }
  function Ev(e, t, n) {
    e === "focusin" ? (Zo(), za = t, Oa = n, za.attachEvent("onpropertychange", Ko)) : e === "focusout" && Zo();
  }
  function Mv(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return qs(Oa);
  }
  function kv(e, t) {
    if (e === "click") return qs(t);
  }
  function Cv(e, t) {
    if (e === "input" || e === "change")
      return qs(t);
  }
  function Tv(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var Ct = typeof Object.is == "function" ? Object.is : Tv;
  function Da(e, t) {
    if (Ct(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var n = Object.keys(e), l = Object.keys(t);
    if (n.length !== l.length) return !1;
    for (l = 0; l < n.length; l++) {
      var i = n[l];
      if (!hc.call(t, i) || !Ct(e[i], t[i]))
        return !1;
    }
    return !0;
  }
  function Fo(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Jo(e, t) {
    var n = Fo(e);
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
      n = Fo(n);
    }
  }
  function Wo(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Wo(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Po(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = Ds(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = Ds(e.document);
    }
    return t;
  }
  function Lc(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var Av = pn && "documentMode" in document && 11 >= document.documentMode, Vl = null, Uc = null, Ha = null, Bc = !1;
  function Io(e, t, n) {
    var l = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    Bc || Vl == null || Vl !== Ds(l) || (l = Vl, "selectionStart" in l && Lc(l) ? l = { start: l.selectionStart, end: l.selectionEnd } : (l = (l.ownerDocument && l.ownerDocument.defaultView || window).getSelection(), l = {
      anchorNode: l.anchorNode,
      anchorOffset: l.anchorOffset,
      focusNode: l.focusNode,
      focusOffset: l.focusOffset
    }), Ha && Da(Ha, l) || (Ha = l, l = Ti(Uc, "onSelect"), 0 < l.length && (t = new $s(
      "onSelect",
      "select",
      null,
      t,
      n
    ), e.push({ event: t, listeners: l }), t.target = Vl)));
  }
  function ml(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var Xl = {
    animationend: ml("Animation", "AnimationEnd"),
    animationiteration: ml("Animation", "AnimationIteration"),
    animationstart: ml("Animation", "AnimationStart"),
    transitionrun: ml("Transition", "TransitionRun"),
    transitionstart: ml("Transition", "TransitionStart"),
    transitioncancel: ml("Transition", "TransitionCancel"),
    transitionend: ml("Transition", "TransitionEnd")
  }, $c = {}, ed = {};
  pn && (ed = document.createElement("div").style, "AnimationEvent" in window || (delete Xl.animationend.animation, delete Xl.animationiteration.animation, delete Xl.animationstart.animation), "TransitionEvent" in window || delete Xl.transitionend.transition);
  function pl(e) {
    if ($c[e]) return $c[e];
    if (!Xl[e]) return e;
    var t = Xl[e], n;
    for (n in t)
      if (t.hasOwnProperty(n) && n in ed)
        return $c[e] = t[n];
    return e;
  }
  var td = pl("animationend"), nd = pl("animationiteration"), ld = pl("animationstart"), Rv = pl("transitionrun"), zv = pl("transitionstart"), Ov = pl("transitioncancel"), ad = pl("transitionend"), sd = /* @__PURE__ */ new Map(), Gc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Gc.push("scrollEnd");
  function Pt(e, t) {
    sd.set(e, t), fl(t, [e]);
  }
  var Ys = typeof reportError == "function" ? reportError : function(e) {
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
  }, Yt = [], Zl = 0, qc = 0;
  function Qs() {
    for (var e = Zl, t = qc = Zl = 0; t < e; ) {
      var n = Yt[t];
      Yt[t++] = null;
      var l = Yt[t];
      Yt[t++] = null;
      var i = Yt[t];
      Yt[t++] = null;
      var c = Yt[t];
      if (Yt[t++] = null, l !== null && i !== null) {
        var f = l.pending;
        f === null ? i.next = i : (i.next = f.next, f.next = i), l.pending = i;
      }
      c !== 0 && id(n, i, c);
    }
  }
  function Vs(e, t, n, l) {
    Yt[Zl++] = e, Yt[Zl++] = t, Yt[Zl++] = n, Yt[Zl++] = l, qc |= l, e.lanes |= l, e = e.alternate, e !== null && (e.lanes |= l);
  }
  function Yc(e, t, n, l) {
    return Vs(e, t, n, l), Xs(e);
  }
  function vl(e, t) {
    return Vs(e, null, null, t), Xs(e);
  }
  function id(e, t, n) {
    e.lanes |= n;
    var l = e.alternate;
    l !== null && (l.lanes |= n);
    for (var i = !1, c = e.return; c !== null; )
      c.childLanes |= n, l = c.alternate, l !== null && (l.childLanes |= n), c.tag === 22 && (e = c.stateNode, e === null || e._visibility & 1 || (i = !0)), e = c, c = c.return;
    return e.tag === 3 ? (c = e.stateNode, i && t !== null && (i = 31 - kt(n), e = c.hiddenUpdates, l = e[i], l === null ? e[i] = [t] : l.push(t), t.lane = n | 536870912), c) : null;
  }
  function Xs(e) {
    if (50 < as)
      throw as = 0, Pr = null, Error(u(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var Kl = {};
  function Dv(e, t, n, l) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = l, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Tt(e, t, n, l) {
    return new Dv(e, t, n, l);
  }
  function Qc(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function vn(e, t) {
    var n = e.alternate;
    return n === null ? (n = Tt(
      e.tag,
      t,
      e.key,
      e.mode
    ), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 65011712, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
  }
  function cd(e, t) {
    e.flags &= 65011714;
    var n = e.alternate;
    return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function Zs(e, t, n, l, i, c) {
    var f = 0;
    if (l = e, typeof e == "function") Qc(e) && (f = 1);
    else if (typeof e == "string")
      f = $g(
        e,
        n,
        I.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case he:
          return e = Tt(31, n, t, i), e.elementType = he, e.lanes = c, e;
        case A:
          return gl(n.children, i, c, t);
        case k:
          f = 8, i |= 24;
          break;
        case B:
          return e = Tt(12, n, t, i | 2), e.elementType = B, e.lanes = c, e;
        case le:
          return e = Tt(13, n, t, i), e.elementType = le, e.lanes = c, e;
        case X:
          return e = Tt(19, n, t, i), e.elementType = X, e.lanes = c, e;
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case G:
                f = 10;
                break e;
              case P:
                f = 9;
                break e;
              case ne:
                f = 11;
                break e;
              case W:
                f = 14;
                break e;
              case ce:
                f = 16, l = null;
                break e;
            }
          f = 29, n = Error(
            u(130, e === null ? "null" : typeof e, "")
          ), l = null;
      }
    return t = Tt(f, n, t, i), t.elementType = e, t.type = l, t.lanes = c, t;
  }
  function gl(e, t, n, l) {
    return e = Tt(7, e, l, t), e.lanes = n, e;
  }
  function Vc(e, t, n) {
    return e = Tt(6, e, null, t), e.lanes = n, e;
  }
  function rd(e) {
    var t = Tt(18, null, null, 0);
    return t.stateNode = e, t;
  }
  function Xc(e, t, n) {
    return t = Tt(
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
  var ud = /* @__PURE__ */ new WeakMap();
  function Qt(e, t) {
    if (typeof e == "object" && e !== null) {
      var n = ud.get(e);
      return n !== void 0 ? n : (t = {
        value: e,
        source: t,
        stack: ol(t)
      }, ud.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: ol(t)
    };
  }
  var Fl = [], Jl = 0, Ks = null, La = 0, Vt = [], Xt = 0, $n = null, ln = 1, an = "";
  function gn(e, t) {
    Fl[Jl++] = La, Fl[Jl++] = Ks, Ks = e, La = t;
  }
  function od(e, t, n) {
    Vt[Xt++] = ln, Vt[Xt++] = an, Vt[Xt++] = $n, $n = e;
    var l = ln;
    e = an;
    var i = 32 - kt(l) - 1;
    l &= ~(1 << i), n += 1;
    var c = 32 - kt(t) + i;
    if (30 < c) {
      var f = i - i % 5;
      c = (l & (1 << f) - 1).toString(32), l >>= f, i -= f, ln = 1 << 32 - kt(t) + i | n << i | l, an = c + e;
    } else
      ln = 1 << c | n << i | l, an = e;
  }
  function Zc(e) {
    e.return !== null && (gn(e, 1), od(e, 1, 0));
  }
  function Kc(e) {
    for (; e === Ks; )
      Ks = Fl[--Jl], Fl[Jl] = null, La = Fl[--Jl], Fl[Jl] = null;
    for (; e === $n; )
      $n = Vt[--Xt], Vt[Xt] = null, an = Vt[--Xt], Vt[Xt] = null, ln = Vt[--Xt], Vt[Xt] = null;
  }
  function dd(e, t) {
    Vt[Xt++] = ln, Vt[Xt++] = an, Vt[Xt++] = $n, ln = t.id, an = t.overflow, $n = e;
  }
  var ct = null, Ge = null, Se = !1, Gn = null, Zt = !1, Fc = Error(u(519));
  function qn(e) {
    var t = Error(
      u(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw Ua(Qt(t, e)), Fc;
  }
  function fd(e) {
    var t = e.stateNode, n = e.type, l = e.memoizedProps;
    switch (t[it] = e, t[xt] = l, n) {
      case "dialog":
        _e("cancel", t), _e("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        _e("load", t);
        break;
      case "video":
      case "audio":
        for (n = 0; n < is.length; n++)
          _e(is[n], t);
        break;
      case "source":
        _e("error", t);
        break;
      case "img":
      case "image":
      case "link":
        _e("error", t), _e("load", t);
        break;
      case "details":
        _e("toggle", t);
        break;
      case "input":
        _e("invalid", t), No(
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
        _e("invalid", t);
        break;
      case "textarea":
        _e("invalid", t), Mo(t, l.value, l.defaultValue, l.children);
    }
    n = l.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || l.suppressHydrationWarning === !0 || Th(t.textContent, n) ? (l.popover != null && (_e("beforetoggle", t), _e("toggle", t)), l.onScroll != null && _e("scroll", t), l.onScrollEnd != null && _e("scrollend", t), l.onClick != null && (t.onclick = mn), t = !0) : t = !1, t || qn(e, !0);
  }
  function hd(e) {
    for (ct = e.return; ct; )
      switch (ct.tag) {
        case 5:
        case 31:
        case 13:
          Zt = !1;
          return;
        case 27:
        case 3:
          Zt = !0;
          return;
        default:
          ct = ct.return;
      }
  }
  function Wl(e) {
    if (e !== ct) return !1;
    if (!Se) return hd(e), Se = !0, !1;
    var t = e.tag, n;
    if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = !(n !== "form" && n !== "button") || hu(e.type, e.memoizedProps)), n = !n), n && Ge && qn(e), hd(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(u(317));
      Ge = Bh(e);
    } else if (t === 31) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(u(317));
      Ge = Bh(e);
    } else
      t === 27 ? (t = Ge, nl(e.type) ? (e = xu, xu = null, Ge = e) : Ge = t) : Ge = ct ? Ft(e.stateNode.nextSibling) : null;
    return !0;
  }
  function xl() {
    Ge = ct = null, Se = !1;
  }
  function Jc() {
    var e = Gn;
    return e !== null && (St === null ? St = e : St.push.apply(
      St,
      e
    ), Gn = null), e;
  }
  function Ua(e) {
    Gn === null ? Gn = [e] : Gn.push(e);
  }
  var Wc = N(null), bl = null, xn = null;
  function Yn(e, t, n) {
    J(Wc, t._currentValue), t._currentValue = n;
  }
  function bn(e) {
    e._currentValue = Wc.current, U(Wc);
  }
  function Pc(e, t, n) {
    for (; e !== null; ) {
      var l = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, l !== null && (l.childLanes |= t)) : l !== null && (l.childLanes & t) !== t && (l.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function Ic(e, t, n, l) {
    var i = e.child;
    for (i !== null && (i.return = e); i !== null; ) {
      var c = i.dependencies;
      if (c !== null) {
        var f = i.child;
        c = c.firstContext;
        e: for (; c !== null; ) {
          var x = c;
          c = i;
          for (var S = 0; S < t.length; S++)
            if (x.context === t[S]) {
              c.lanes |= n, x = c.alternate, x !== null && (x.lanes |= n), Pc(
                c.return,
                n,
                e
              ), l || (f = null);
              break e;
            }
          c = x.next;
        }
      } else if (i.tag === 18) {
        if (f = i.return, f === null) throw Error(u(341));
        f.lanes |= n, c = f.alternate, c !== null && (c.lanes |= n), Pc(f, n, e), f = null;
      } else f = i.child;
      if (f !== null) f.return = i;
      else
        for (f = i; f !== null; ) {
          if (f === e) {
            f = null;
            break;
          }
          if (i = f.sibling, i !== null) {
            i.return = f.return, f = i;
            break;
          }
          f = f.return;
        }
      i = f;
    }
  }
  function Pl(e, t, n, l) {
    e = null;
    for (var i = t, c = !1; i !== null; ) {
      if (!c) {
        if ((i.flags & 524288) !== 0) c = !0;
        else if ((i.flags & 262144) !== 0) break;
      }
      if (i.tag === 10) {
        var f = i.alternate;
        if (f === null) throw Error(u(387));
        if (f = f.memoizedProps, f !== null) {
          var x = i.type;
          Ct(i.pendingProps.value, f.value) || (e !== null ? e.push(x) : e = [x]);
        }
      } else if (i === fe.current) {
        if (f = i.alternate, f === null) throw Error(u(387));
        f.memoizedState.memoizedState !== i.memoizedState.memoizedState && (e !== null ? e.push(ds) : e = [ds]);
      }
      i = i.return;
    }
    e !== null && Ic(
      t,
      e,
      n,
      l
    ), t.flags |= 262144;
  }
  function Fs(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!Ct(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function _l(e) {
    bl = e, xn = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function rt(e) {
    return md(bl, e);
  }
  function Js(e, t) {
    return bl === null && _l(e), md(e, t);
  }
  function md(e, t) {
    var n = t._currentValue;
    if (t = { context: t, memoizedValue: n, next: null }, xn === null) {
      if (e === null) throw Error(u(308));
      xn = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else xn = xn.next = t;
    return n;
  }
  var Hv = typeof AbortController < "u" ? AbortController : function() {
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
  }, Lv = a.unstable_scheduleCallback, Uv = a.unstable_NormalPriority, Ie = {
    $$typeof: G,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function er() {
    return {
      controller: new Hv(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Ba(e) {
    e.refCount--, e.refCount === 0 && Lv(Uv, function() {
      e.controller.abort();
    });
  }
  var $a = null, tr = 0, Il = 0, ea = null;
  function Bv(e, t) {
    if ($a === null) {
      var n = $a = [];
      tr = 0, Il = au(), ea = {
        status: "pending",
        value: void 0,
        then: function(l) {
          n.push(l);
        }
      };
    }
    return tr++, t.then(pd, pd), t;
  }
  function pd() {
    if (--tr === 0 && $a !== null) {
      ea !== null && (ea.status = "fulfilled");
      var e = $a;
      $a = null, Il = 0, ea = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function $v(e, t) {
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
  var vd = T.S;
  T.S = function(e, t) {
    eh = Et(), typeof t == "object" && t !== null && typeof t.then == "function" && Bv(e, t), vd !== null && vd(e, t);
  };
  var yl = N(null);
  function nr() {
    var e = yl.current;
    return e !== null ? e : Be.pooledCache;
  }
  function Ws(e, t) {
    t === null ? J(yl, yl.current) : J(yl, t.pool);
  }
  function gd() {
    var e = nr();
    return e === null ? null : { parent: Ie._currentValue, pool: e };
  }
  var ta = Error(u(460)), lr = Error(u(474)), Ps = Error(u(542)), Is = { then: function() {
  } };
  function xd(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function bd(e, t, n) {
    switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(mn, mn), t = n), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, yd(e), e;
      default:
        if (typeof t.status == "string") t.then(mn, mn);
        else {
          if (e = Be, e !== null && 100 < e.shellSuspendCounter)
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
            throw e = t.reason, yd(e), e;
        }
        throw Sl = t, ta;
    }
  }
  function jl(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (n) {
      throw n !== null && typeof n == "object" && typeof n.then == "function" ? (Sl = n, ta) : n;
    }
  }
  var Sl = null;
  function _d() {
    if (Sl === null) throw Error(u(459));
    var e = Sl;
    return Sl = null, e;
  }
  function yd(e) {
    if (e === ta || e === Ps)
      throw Error(u(483));
  }
  var na = null, Ga = 0;
  function ei(e) {
    var t = Ga;
    return Ga += 1, na === null && (na = []), bd(na, e, t);
  }
  function qa(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function ti(e, t) {
    throw t.$$typeof === j ? Error(u(525)) : (e = Object.prototype.toString.call(t), Error(
      u(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function jd(e) {
    function t(C, E) {
      if (e) {
        var R = C.deletions;
        R === null ? (C.deletions = [E], C.flags |= 16) : R.push(E);
      }
    }
    function n(C, E) {
      if (!e) return null;
      for (; E !== null; )
        t(C, E), E = E.sibling;
      return null;
    }
    function l(C) {
      for (var E = /* @__PURE__ */ new Map(); C !== null; )
        C.key !== null ? E.set(C.key, C) : E.set(C.index, C), C = C.sibling;
      return E;
    }
    function i(C, E) {
      return C = vn(C, E), C.index = 0, C.sibling = null, C;
    }
    function c(C, E, R) {
      return C.index = R, e ? (R = C.alternate, R !== null ? (R = R.index, R < E ? (C.flags |= 67108866, E) : R) : (C.flags |= 67108866, E)) : (C.flags |= 1048576, E);
    }
    function f(C) {
      return e && C.alternate === null && (C.flags |= 67108866), C;
    }
    function x(C, E, R, q) {
      return E === null || E.tag !== 6 ? (E = Vc(R, C.mode, q), E.return = C, E) : (E = i(E, R), E.return = C, E);
    }
    function S(C, E, R, q) {
      var ie = R.type;
      return ie === A ? $(
        C,
        E,
        R.props.children,
        q,
        R.key
      ) : E !== null && (E.elementType === ie || typeof ie == "object" && ie !== null && ie.$$typeof === ce && jl(ie) === E.type) ? (E = i(E, R.props), qa(E, R), E.return = C, E) : (E = Zs(
        R.type,
        R.key,
        R.props,
        null,
        C.mode,
        q
      ), qa(E, R), E.return = C, E);
    }
    function z(C, E, R, q) {
      return E === null || E.tag !== 4 || E.stateNode.containerInfo !== R.containerInfo || E.stateNode.implementation !== R.implementation ? (E = Xc(R, C.mode, q), E.return = C, E) : (E = i(E, R.children || []), E.return = C, E);
    }
    function $(C, E, R, q, ie) {
      return E === null || E.tag !== 7 ? (E = gl(
        R,
        C.mode,
        q,
        ie
      ), E.return = C, E) : (E = i(E, R), E.return = C, E);
    }
    function Y(C, E, R) {
      if (typeof E == "string" && E !== "" || typeof E == "number" || typeof E == "bigint")
        return E = Vc(
          "" + E,
          C.mode,
          R
        ), E.return = C, E;
      if (typeof E == "object" && E !== null) {
        switch (E.$$typeof) {
          case w:
            return R = Zs(
              E.type,
              E.key,
              E.props,
              null,
              C.mode,
              R
            ), qa(R, E), R.return = C, R;
          case M:
            return E = Xc(
              E,
              C.mode,
              R
            ), E.return = C, E;
          case ce:
            return E = jl(E), Y(C, E, R);
        }
        if (K(E) || ge(E))
          return E = gl(
            E,
            C.mode,
            R,
            null
          ), E.return = C, E;
        if (typeof E.then == "function")
          return Y(C, ei(E), R);
        if (E.$$typeof === G)
          return Y(
            C,
            Js(C, E),
            R
          );
        ti(C, E);
      }
      return null;
    }
    function D(C, E, R, q) {
      var ie = E !== null ? E.key : null;
      if (typeof R == "string" && R !== "" || typeof R == "number" || typeof R == "bigint")
        return ie !== null ? null : x(C, E, "" + R, q);
      if (typeof R == "object" && R !== null) {
        switch (R.$$typeof) {
          case w:
            return R.key === ie ? S(C, E, R, q) : null;
          case M:
            return R.key === ie ? z(C, E, R, q) : null;
          case ce:
            return R = jl(R), D(C, E, R, q);
        }
        if (K(R) || ge(R))
          return ie !== null ? null : $(C, E, R, q, null);
        if (typeof R.then == "function")
          return D(
            C,
            E,
            ei(R),
            q
          );
        if (R.$$typeof === G)
          return D(
            C,
            E,
            Js(C, R),
            q
          );
        ti(C, R);
      }
      return null;
    }
    function L(C, E, R, q, ie) {
      if (typeof q == "string" && q !== "" || typeof q == "number" || typeof q == "bigint")
        return C = C.get(R) || null, x(E, C, "" + q, ie);
      if (typeof q == "object" && q !== null) {
        switch (q.$$typeof) {
          case w:
            return C = C.get(
              q.key === null ? R : q.key
            ) || null, S(E, C, q, ie);
          case M:
            return C = C.get(
              q.key === null ? R : q.key
            ) || null, z(E, C, q, ie);
          case ce:
            return q = jl(q), L(
              C,
              E,
              R,
              q,
              ie
            );
        }
        if (K(q) || ge(q))
          return C = C.get(R) || null, $(E, C, q, ie, null);
        if (typeof q.then == "function")
          return L(
            C,
            E,
            R,
            ei(q),
            ie
          );
        if (q.$$typeof === G)
          return L(
            C,
            E,
            R,
            Js(E, q),
            ie
          );
        ti(E, q);
      }
      return null;
    }
    function te(C, E, R, q) {
      for (var ie = null, Me = null, ae = E, ve = E = 0, je = null; ae !== null && ve < R.length; ve++) {
        ae.index > ve ? (je = ae, ae = null) : je = ae.sibling;
        var ke = D(
          C,
          ae,
          R[ve],
          q
        );
        if (ke === null) {
          ae === null && (ae = je);
          break;
        }
        e && ae && ke.alternate === null && t(C, ae), E = c(ke, E, ve), Me === null ? ie = ke : Me.sibling = ke, Me = ke, ae = je;
      }
      if (ve === R.length)
        return n(C, ae), Se && gn(C, ve), ie;
      if (ae === null) {
        for (; ve < R.length; ve++)
          ae = Y(C, R[ve], q), ae !== null && (E = c(
            ae,
            E,
            ve
          ), Me === null ? ie = ae : Me.sibling = ae, Me = ae);
        return Se && gn(C, ve), ie;
      }
      for (ae = l(ae); ve < R.length; ve++)
        je = L(
          ae,
          C,
          ve,
          R[ve],
          q
        ), je !== null && (e && je.alternate !== null && ae.delete(
          je.key === null ? ve : je.key
        ), E = c(
          je,
          E,
          ve
        ), Me === null ? ie = je : Me.sibling = je, Me = je);
      return e && ae.forEach(function(cl) {
        return t(C, cl);
      }), Se && gn(C, ve), ie;
    }
    function de(C, E, R, q) {
      if (R == null) throw Error(u(151));
      for (var ie = null, Me = null, ae = E, ve = E = 0, je = null, ke = R.next(); ae !== null && !ke.done; ve++, ke = R.next()) {
        ae.index > ve ? (je = ae, ae = null) : je = ae.sibling;
        var cl = D(C, ae, ke.value, q);
        if (cl === null) {
          ae === null && (ae = je);
          break;
        }
        e && ae && cl.alternate === null && t(C, ae), E = c(cl, E, ve), Me === null ? ie = cl : Me.sibling = cl, Me = cl, ae = je;
      }
      if (ke.done)
        return n(C, ae), Se && gn(C, ve), ie;
      if (ae === null) {
        for (; !ke.done; ve++, ke = R.next())
          ke = Y(C, ke.value, q), ke !== null && (E = c(ke, E, ve), Me === null ? ie = ke : Me.sibling = ke, Me = ke);
        return Se && gn(C, ve), ie;
      }
      for (ae = l(ae); !ke.done; ve++, ke = R.next())
        ke = L(ae, C, ve, ke.value, q), ke !== null && (e && ke.alternate !== null && ae.delete(ke.key === null ? ve : ke.key), E = c(ke, E, ve), Me === null ? ie = ke : Me.sibling = ke, Me = ke);
      return e && ae.forEach(function(Wg) {
        return t(C, Wg);
      }), Se && gn(C, ve), ie;
    }
    function Le(C, E, R, q) {
      if (typeof R == "object" && R !== null && R.type === A && R.key === null && (R = R.props.children), typeof R == "object" && R !== null) {
        switch (R.$$typeof) {
          case w:
            e: {
              for (var ie = R.key; E !== null; ) {
                if (E.key === ie) {
                  if (ie = R.type, ie === A) {
                    if (E.tag === 7) {
                      n(
                        C,
                        E.sibling
                      ), q = i(
                        E,
                        R.props.children
                      ), q.return = C, C = q;
                      break e;
                    }
                  } else if (E.elementType === ie || typeof ie == "object" && ie !== null && ie.$$typeof === ce && jl(ie) === E.type) {
                    n(
                      C,
                      E.sibling
                    ), q = i(E, R.props), qa(q, R), q.return = C, C = q;
                    break e;
                  }
                  n(C, E);
                  break;
                } else t(C, E);
                E = E.sibling;
              }
              R.type === A ? (q = gl(
                R.props.children,
                C.mode,
                q,
                R.key
              ), q.return = C, C = q) : (q = Zs(
                R.type,
                R.key,
                R.props,
                null,
                C.mode,
                q
              ), qa(q, R), q.return = C, C = q);
            }
            return f(C);
          case M:
            e: {
              for (ie = R.key; E !== null; ) {
                if (E.key === ie)
                  if (E.tag === 4 && E.stateNode.containerInfo === R.containerInfo && E.stateNode.implementation === R.implementation) {
                    n(
                      C,
                      E.sibling
                    ), q = i(E, R.children || []), q.return = C, C = q;
                    break e;
                  } else {
                    n(C, E);
                    break;
                  }
                else t(C, E);
                E = E.sibling;
              }
              q = Xc(R, C.mode, q), q.return = C, C = q;
            }
            return f(C);
          case ce:
            return R = jl(R), Le(
              C,
              E,
              R,
              q
            );
        }
        if (K(R))
          return te(
            C,
            E,
            R,
            q
          );
        if (ge(R)) {
          if (ie = ge(R), typeof ie != "function") throw Error(u(150));
          return R = ie.call(R), de(
            C,
            E,
            R,
            q
          );
        }
        if (typeof R.then == "function")
          return Le(
            C,
            E,
            ei(R),
            q
          );
        if (R.$$typeof === G)
          return Le(
            C,
            E,
            Js(C, R),
            q
          );
        ti(C, R);
      }
      return typeof R == "string" && R !== "" || typeof R == "number" || typeof R == "bigint" ? (R = "" + R, E !== null && E.tag === 6 ? (n(C, E.sibling), q = i(E, R), q.return = C, C = q) : (n(C, E), q = Vc(R, C.mode, q), q.return = C, C = q), f(C)) : n(C, E);
    }
    return function(C, E, R, q) {
      try {
        Ga = 0;
        var ie = Le(
          C,
          E,
          R,
          q
        );
        return na = null, ie;
      } catch (ae) {
        if (ae === ta || ae === Ps) throw ae;
        var Me = Tt(29, ae, null, C.mode);
        return Me.lanes = q, Me.return = C, Me;
      } finally {
      }
    };
  }
  var wl = jd(!0), Sd = jd(!1), Qn = !1;
  function ar(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function sr(e, t) {
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
  function Xn(e, t, n) {
    var l = e.updateQueue;
    if (l === null) return null;
    if (l = l.shared, (Te & 2) !== 0) {
      var i = l.pending;
      return i === null ? t.next = t : (t.next = i.next, i.next = t), l.pending = t, t = Xs(e), id(e, null, n), t;
    }
    return Vs(e, l, t, n), Xs(e);
  }
  function Ya(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194048) !== 0)) {
      var l = t.lanes;
      l &= e.pendingLanes, n |= l, t.lanes = n, mo(e, n);
    }
  }
  function ir(e, t) {
    var n = e.updateQueue, l = e.alternate;
    if (l !== null && (l = l.updateQueue, n === l)) {
      var i = null, c = null;
      if (n = n.firstBaseUpdate, n !== null) {
        do {
          var f = {
            lane: n.lane,
            tag: n.tag,
            payload: n.payload,
            callback: null,
            next: null
          };
          c === null ? i = c = f : c = c.next = f, n = n.next;
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
  var cr = !1;
  function Qa() {
    if (cr) {
      var e = ea;
      if (e !== null) throw e;
    }
  }
  function Va(e, t, n, l) {
    cr = !1;
    var i = e.updateQueue;
    Qn = !1;
    var c = i.firstBaseUpdate, f = i.lastBaseUpdate, x = i.shared.pending;
    if (x !== null) {
      i.shared.pending = null;
      var S = x, z = S.next;
      S.next = null, f === null ? c = z : f.next = z, f = S;
      var $ = e.alternate;
      $ !== null && ($ = $.updateQueue, x = $.lastBaseUpdate, x !== f && (x === null ? $.firstBaseUpdate = z : x.next = z, $.lastBaseUpdate = S));
    }
    if (c !== null) {
      var Y = i.baseState;
      f = 0, $ = z = S = null, x = c;
      do {
        var D = x.lane & -536870913, L = D !== x.lane;
        if (L ? (ye & D) === D : (l & D) === D) {
          D !== 0 && D === Il && (cr = !0), $ !== null && ($ = $.next = {
            lane: 0,
            tag: x.tag,
            payload: x.payload,
            callback: null,
            next: null
          });
          e: {
            var te = e, de = x;
            D = t;
            var Le = n;
            switch (de.tag) {
              case 1:
                if (te = de.payload, typeof te == "function") {
                  Y = te.call(Le, Y, D);
                  break e;
                }
                Y = te;
                break e;
              case 3:
                te.flags = te.flags & -65537 | 128;
              case 0:
                if (te = de.payload, D = typeof te == "function" ? te.call(Le, Y, D) : te, D == null) break e;
                Y = _({}, Y, D);
                break e;
              case 2:
                Qn = !0;
            }
          }
          D = x.callback, D !== null && (e.flags |= 64, L && (e.flags |= 8192), L = i.callbacks, L === null ? i.callbacks = [D] : L.push(D));
        } else
          L = {
            lane: D,
            tag: x.tag,
            payload: x.payload,
            callback: x.callback,
            next: null
          }, $ === null ? (z = $ = L, S = Y) : $ = $.next = L, f |= D;
        if (x = x.next, x === null) {
          if (x = i.shared.pending, x === null)
            break;
          L = x, x = L.next, L.next = null, i.lastBaseUpdate = L, i.shared.pending = null;
        }
      } while (!0);
      $ === null && (S = Y), i.baseState = S, i.firstBaseUpdate = z, i.lastBaseUpdate = $, c === null && (i.shared.lanes = 0), Wn |= f, e.lanes = f, e.memoizedState = Y;
    }
  }
  function wd(e, t) {
    if (typeof e != "function")
      throw Error(u(191, e));
    e.call(t);
  }
  function Nd(e, t) {
    var n = e.callbacks;
    if (n !== null)
      for (e.callbacks = null, e = 0; e < n.length; e++)
        wd(n[e], t);
  }
  var la = N(null), ni = N(0);
  function Ed(e, t) {
    e = kn, J(ni, e), J(la, t), kn = e | t.baseLanes;
  }
  function rr() {
    J(ni, kn), J(la, la.current);
  }
  function ur() {
    kn = ni.current, U(la), U(ni);
  }
  var At = N(null), Kt = null;
  function Zn(e) {
    var t = e.alternate;
    J(We, We.current & 1), J(At, e), Kt === null && (t === null || la.current !== null || t.memoizedState !== null) && (Kt = e);
  }
  function or(e) {
    J(We, We.current), J(At, e), Kt === null && (Kt = e);
  }
  function Md(e) {
    e.tag === 22 ? (J(We, We.current), J(At, e), Kt === null && (Kt = e)) : Kn();
  }
  function Kn() {
    J(We, We.current), J(At, At.current);
  }
  function Rt(e) {
    U(At), Kt === e && (Kt = null), U(We);
  }
  var We = N(0);
  function li(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var n = t.memoizedState;
        if (n !== null && (n = n.dehydrated, n === null || vu(n) || gu(n)))
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
  var _n = 0, pe = null, De = null, et = null, ai = !1, aa = !1, Nl = !1, si = 0, Xa = 0, sa = null, Gv = 0;
  function Ke() {
    throw Error(u(321));
  }
  function dr(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++)
      if (!Ct(e[n], t[n])) return !1;
    return !0;
  }
  function fr(e, t, n, l, i, c) {
    return _n = c, pe = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, T.H = e === null || e.memoizedState === null ? df : Mr, Nl = !1, c = n(l, i), Nl = !1, aa && (c = Cd(
      t,
      n,
      l,
      i
    )), kd(e), c;
  }
  function kd(e) {
    T.H = Fa;
    var t = De !== null && De.next !== null;
    if (_n = 0, et = De = pe = null, ai = !1, Xa = 0, sa = null, t) throw Error(u(300));
    e === null || tt || (e = e.dependencies, e !== null && Fs(e) && (tt = !0));
  }
  function Cd(e, t, n, l) {
    pe = e;
    var i = 0;
    do {
      if (aa && (sa = null), Xa = 0, aa = !1, 25 <= i) throw Error(u(301));
      if (i += 1, et = De = null, e.updateQueue != null) {
        var c = e.updateQueue;
        c.lastEffect = null, c.events = null, c.stores = null, c.memoCache != null && (c.memoCache.index = 0);
      }
      T.H = ff, c = t(n, l);
    } while (aa);
    return c;
  }
  function qv() {
    var e = T.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? Za(t) : t, e = e.useState()[0], (De !== null ? De.memoizedState : null) !== e && (pe.flags |= 1024), t;
  }
  function hr() {
    var e = si !== 0;
    return si = 0, e;
  }
  function mr(e, t, n) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
  }
  function pr(e) {
    if (ai) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      ai = !1;
    }
    _n = 0, et = De = pe = null, aa = !1, Xa = si = 0, sa = null;
  }
  function vt() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return et === null ? pe.memoizedState = et = e : et = et.next = e, et;
  }
  function Pe() {
    if (De === null) {
      var e = pe.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = De.next;
    var t = et === null ? pe.memoizedState : et.next;
    if (t !== null)
      et = t, De = e;
    else {
      if (e === null)
        throw pe.alternate === null ? Error(u(467)) : Error(u(310));
      De = e, e = {
        memoizedState: De.memoizedState,
        baseState: De.baseState,
        baseQueue: De.baseQueue,
        queue: De.queue,
        next: null
      }, et === null ? pe.memoizedState = et = e : et = et.next = e;
    }
    return et;
  }
  function ii() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Za(e) {
    var t = Xa;
    return Xa += 1, sa === null && (sa = []), e = bd(sa, e, t), t = pe, (et === null ? t.memoizedState : et.next) === null && (t = t.alternate, T.H = t === null || t.memoizedState === null ? df : Mr), e;
  }
  function ci(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return Za(e);
      if (e.$$typeof === G) return rt(e);
    }
    throw Error(u(438, String(e)));
  }
  function vr(e) {
    var t = null, n = pe.updateQueue;
    if (n !== null && (t = n.memoCache), t == null) {
      var l = pe.alternate;
      l !== null && (l = l.updateQueue, l !== null && (l = l.memoCache, l != null && (t = {
        data: l.data.map(function(i) {
          return i.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), n === null && (n = ii(), pe.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0)
      for (n = t.data[t.index] = Array(e), l = 0; l < e; l++)
        n[l] = we;
    return t.index++, n;
  }
  function yn(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function ri(e) {
    var t = Pe();
    return gr(t, De, e);
  }
  function gr(e, t, n) {
    var l = e.queue;
    if (l === null) throw Error(u(311));
    l.lastRenderedReducer = n;
    var i = e.baseQueue, c = l.pending;
    if (c !== null) {
      if (i !== null) {
        var f = i.next;
        i.next = c.next, c.next = f;
      }
      t.baseQueue = i = c, l.pending = null;
    }
    if (c = e.baseState, i === null) e.memoizedState = c;
    else {
      t = i.next;
      var x = f = null, S = null, z = t, $ = !1;
      do {
        var Y = z.lane & -536870913;
        if (Y !== z.lane ? (ye & Y) === Y : (_n & Y) === Y) {
          var D = z.revertLane;
          if (D === 0)
            S !== null && (S = S.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: z.action,
              hasEagerState: z.hasEagerState,
              eagerState: z.eagerState,
              next: null
            }), Y === Il && ($ = !0);
          else if ((_n & D) === D) {
            z = z.next, D === Il && ($ = !0);
            continue;
          } else
            Y = {
              lane: 0,
              revertLane: z.revertLane,
              gesture: null,
              action: z.action,
              hasEagerState: z.hasEagerState,
              eagerState: z.eagerState,
              next: null
            }, S === null ? (x = S = Y, f = c) : S = S.next = Y, pe.lanes |= D, Wn |= D;
          Y = z.action, Nl && n(c, Y), c = z.hasEagerState ? z.eagerState : n(c, Y);
        } else
          D = {
            lane: Y,
            revertLane: z.revertLane,
            gesture: z.gesture,
            action: z.action,
            hasEagerState: z.hasEagerState,
            eagerState: z.eagerState,
            next: null
          }, S === null ? (x = S = D, f = c) : S = S.next = D, pe.lanes |= Y, Wn |= Y;
        z = z.next;
      } while (z !== null && z !== t);
      if (S === null ? f = c : S.next = x, !Ct(c, e.memoizedState) && (tt = !0, $ && (n = ea, n !== null)))
        throw n;
      e.memoizedState = c, e.baseState = f, e.baseQueue = S, l.lastRenderedState = c;
    }
    return i === null && (l.lanes = 0), [e.memoizedState, l.dispatch];
  }
  function xr(e) {
    var t = Pe(), n = t.queue;
    if (n === null) throw Error(u(311));
    n.lastRenderedReducer = e;
    var l = n.dispatch, i = n.pending, c = t.memoizedState;
    if (i !== null) {
      n.pending = null;
      var f = i = i.next;
      do
        c = e(c, f.action), f = f.next;
      while (f !== i);
      Ct(c, t.memoizedState) || (tt = !0), t.memoizedState = c, t.baseQueue === null && (t.baseState = c), n.lastRenderedState = c;
    }
    return [c, l];
  }
  function Td(e, t, n) {
    var l = pe, i = Pe(), c = Se;
    if (c) {
      if (n === void 0) throw Error(u(407));
      n = n();
    } else n = t();
    var f = !Ct(
      (De || i).memoizedState,
      n
    );
    if (f && (i.memoizedState = n, tt = !0), i = i.queue, yr(zd.bind(null, l, i, e), [
      e
    ]), i.getSnapshot !== t || f || et !== null && et.memoizedState.tag & 1) {
      if (l.flags |= 2048, ia(
        9,
        { destroy: void 0 },
        Rd.bind(
          null,
          l,
          i,
          n,
          t
        ),
        null
      ), Be === null) throw Error(u(349));
      c || (_n & 127) !== 0 || Ad(l, t, n);
    }
    return n;
  }
  function Ad(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = pe.updateQueue, t === null ? (t = ii(), pe.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function Rd(e, t, n, l) {
    t.value = n, t.getSnapshot = l, Od(t) && Dd(e);
  }
  function zd(e, t, n) {
    return n(function() {
      Od(t) && Dd(e);
    });
  }
  function Od(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !Ct(e, n);
    } catch {
      return !0;
    }
  }
  function Dd(e) {
    var t = vl(e, 2);
    t !== null && wt(t, e, 2);
  }
  function br(e) {
    var t = vt();
    if (typeof e == "function") {
      var n = e;
      if (e = n(), Nl) {
        Ln(!0);
        try {
          n();
        } finally {
          Ln(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = e, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: yn,
      lastRenderedState: e
    }, t;
  }
  function Hd(e, t, n, l) {
    return e.baseState = n, gr(
      e,
      De,
      typeof l == "function" ? l : yn
    );
  }
  function Yv(e, t, n, l, i) {
    if (di(e)) throw Error(u(485));
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
        then: function(f) {
          c.listeners.push(f);
        }
      };
      T.T !== null ? n(!0) : c.isTransition = !1, l(c), n = t.pending, n === null ? (c.next = t.pending = c, Ld(t, c)) : (c.next = n.next, t.pending = n.next = c);
    }
  }
  function Ld(e, t) {
    var n = t.action, l = t.payload, i = e.state;
    if (t.isTransition) {
      var c = T.T, f = {};
      T.T = f;
      try {
        var x = n(i, l), S = T.S;
        S !== null && S(f, x), Ud(e, t, x);
      } catch (z) {
        _r(e, t, z);
      } finally {
        c !== null && f.types !== null && (c.types = f.types), T.T = c;
      }
    } else
      try {
        c = n(i, l), Ud(e, t, c);
      } catch (z) {
        _r(e, t, z);
      }
  }
  function Ud(e, t, n) {
    n !== null && typeof n == "object" && typeof n.then == "function" ? n.then(
      function(l) {
        Bd(e, t, l);
      },
      function(l) {
        return _r(e, t, l);
      }
    ) : Bd(e, t, n);
  }
  function Bd(e, t, n) {
    t.status = "fulfilled", t.value = n, $d(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, Ld(e, n)));
  }
  function _r(e, t, n) {
    var l = e.pending;
    if (e.pending = null, l !== null) {
      l = l.next;
      do
        t.status = "rejected", t.reason = n, $d(t), t = t.next;
      while (t !== l);
    }
    e.action = null;
  }
  function $d(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function Gd(e, t) {
    return t;
  }
  function qd(e, t) {
    if (Se) {
      var n = Be.formState;
      if (n !== null) {
        e: {
          var l = pe;
          if (Se) {
            if (Ge) {
              t: {
                for (var i = Ge, c = Zt; i.nodeType !== 8; ) {
                  if (!c) {
                    i = null;
                    break t;
                  }
                  if (i = Ft(
                    i.nextSibling
                  ), i === null) {
                    i = null;
                    break t;
                  }
                }
                c = i.data, i = c === "F!" || c === "F" ? i : null;
              }
              if (i) {
                Ge = Ft(
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
    return n = vt(), n.memoizedState = n.baseState = t, l = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Gd,
      lastRenderedState: t
    }, n.queue = l, n = rf.bind(
      null,
      pe,
      l
    ), l.dispatch = n, l = br(!1), c = Er.bind(
      null,
      pe,
      !1,
      l.queue
    ), l = vt(), i = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, l.queue = i, n = Yv.bind(
      null,
      pe,
      i,
      c,
      n
    ), i.dispatch = n, l.memoizedState = e, [t, n, !1];
  }
  function Yd(e) {
    var t = Pe();
    return Qd(t, De, e);
  }
  function Qd(e, t, n) {
    if (t = gr(
      e,
      t,
      Gd
    )[0], e = ri(yn)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var l = Za(t);
      } catch (f) {
        throw f === ta ? Ps : f;
      }
    else l = t;
    t = Pe();
    var i = t.queue, c = i.dispatch;
    return n !== t.memoizedState && (pe.flags |= 2048, ia(
      9,
      { destroy: void 0 },
      Qv.bind(null, i, n),
      null
    )), [l, c, e];
  }
  function Qv(e, t) {
    e.action = t;
  }
  function Vd(e) {
    var t = Pe(), n = De;
    if (n !== null)
      return Qd(t, n, e);
    Pe(), t = t.memoizedState, n = Pe();
    var l = n.queue.dispatch;
    return n.memoizedState = e, [t, l, !1];
  }
  function ia(e, t, n, l) {
    return e = { tag: e, create: n, deps: l, inst: t, next: null }, t = pe.updateQueue, t === null && (t = ii(), pe.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (l = n.next, n.next = e, e.next = l, t.lastEffect = e), e;
  }
  function Xd() {
    return Pe().memoizedState;
  }
  function ui(e, t, n, l) {
    var i = vt();
    pe.flags |= e, i.memoizedState = ia(
      1 | t,
      { destroy: void 0 },
      n,
      l === void 0 ? null : l
    );
  }
  function oi(e, t, n, l) {
    var i = Pe();
    l = l === void 0 ? null : l;
    var c = i.memoizedState.inst;
    De !== null && l !== null && dr(l, De.memoizedState.deps) ? i.memoizedState = ia(t, c, n, l) : (pe.flags |= e, i.memoizedState = ia(
      1 | t,
      c,
      n,
      l
    ));
  }
  function Zd(e, t) {
    ui(8390656, 8, e, t);
  }
  function yr(e, t) {
    oi(2048, 8, e, t);
  }
  function Vv(e) {
    pe.flags |= 4;
    var t = pe.updateQueue;
    if (t === null)
      t = ii(), pe.updateQueue = t, t.events = [e];
    else {
      var n = t.events;
      n === null ? t.events = [e] : n.push(e);
    }
  }
  function Kd(e) {
    var t = Pe().memoizedState;
    return Vv({ ref: t, nextImpl: e }), function() {
      if ((Te & 2) !== 0) throw Error(u(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function Fd(e, t) {
    return oi(4, 2, e, t);
  }
  function Jd(e, t) {
    return oi(4, 4, e, t);
  }
  function Wd(e, t) {
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
  function Pd(e, t, n) {
    n = n != null ? n.concat([e]) : null, oi(4, 4, Wd.bind(null, t, e), n);
  }
  function jr() {
  }
  function Id(e, t) {
    var n = Pe();
    t = t === void 0 ? null : t;
    var l = n.memoizedState;
    return t !== null && dr(t, l[1]) ? l[0] : (n.memoizedState = [e, t], e);
  }
  function ef(e, t) {
    var n = Pe();
    t = t === void 0 ? null : t;
    var l = n.memoizedState;
    if (t !== null && dr(t, l[1]))
      return l[0];
    if (l = e(), Nl) {
      Ln(!0);
      try {
        e();
      } finally {
        Ln(!1);
      }
    }
    return n.memoizedState = [l, t], l;
  }
  function Sr(e, t, n) {
    return n === void 0 || (_n & 1073741824) !== 0 && (ye & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = n, e = nh(), pe.lanes |= e, Wn |= e, n);
  }
  function tf(e, t, n, l) {
    return Ct(n, t) ? n : la.current !== null ? (e = Sr(e, n, l), Ct(e, t) || (tt = !0), e) : (_n & 42) === 0 || (_n & 1073741824) !== 0 && (ye & 261930) === 0 ? (tt = !0, e.memoizedState = n) : (e = nh(), pe.lanes |= e, Wn |= e, t);
  }
  function nf(e, t, n, l, i) {
    var c = O.p;
    O.p = c !== 0 && 8 > c ? c : 8;
    var f = T.T, x = {};
    T.T = x, Er(e, !1, t, n);
    try {
      var S = i(), z = T.S;
      if (z !== null && z(x, S), S !== null && typeof S == "object" && typeof S.then == "function") {
        var $ = $v(
          S,
          l
        );
        Ka(
          e,
          t,
          $,
          Dt(e)
        );
      } else
        Ka(
          e,
          t,
          l,
          Dt(e)
        );
    } catch (Y) {
      Ka(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: Y },
        Dt()
      );
    } finally {
      O.p = c, f !== null && x.types !== null && (f.types = x.types), T.T = f;
    }
  }
  function Xv() {
  }
  function wr(e, t, n, l) {
    if (e.tag !== 5) throw Error(u(476));
    var i = lf(e).queue;
    nf(
      e,
      i,
      t,
      Z,
      n === null ? Xv : function() {
        return af(e), n(l);
      }
    );
  }
  function lf(e) {
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
        lastRenderedReducer: yn,
        lastRenderedState: Z
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
        lastRenderedReducer: yn,
        lastRenderedState: n
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function af(e) {
    var t = lf(e);
    t.next === null && (t = e.alternate.memoizedState), Ka(
      e,
      t.next.queue,
      {},
      Dt()
    );
  }
  function Nr() {
    return rt(ds);
  }
  function sf() {
    return Pe().memoizedState;
  }
  function cf() {
    return Pe().memoizedState;
  }
  function Zv(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var n = Dt();
          e = Vn(n);
          var l = Xn(t, e, n);
          l !== null && (wt(l, t, n), Ya(l, t, n)), t = { cache: er() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function Kv(e, t, n) {
    var l = Dt();
    n = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, di(e) ? uf(t, n) : (n = Yc(e, t, n, l), n !== null && (wt(n, e, l), of(n, t, l)));
  }
  function rf(e, t, n) {
    var l = Dt();
    Ka(e, t, n, l);
  }
  function Ka(e, t, n, l) {
    var i = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (di(e)) uf(t, i);
    else {
      var c = e.alternate;
      if (e.lanes === 0 && (c === null || c.lanes === 0) && (c = t.lastRenderedReducer, c !== null))
        try {
          var f = t.lastRenderedState, x = c(f, n);
          if (i.hasEagerState = !0, i.eagerState = x, Ct(x, f))
            return Vs(e, t, i, 0), Be === null && Qs(), !1;
        } catch {
        } finally {
        }
      if (n = Yc(e, t, i, l), n !== null)
        return wt(n, e, l), of(n, t, l), !0;
    }
    return !1;
  }
  function Er(e, t, n, l) {
    if (l = {
      lane: 2,
      revertLane: au(),
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, di(e)) {
      if (t) throw Error(u(479));
    } else
      t = Yc(
        e,
        n,
        l,
        2
      ), t !== null && wt(t, e, 2);
  }
  function di(e) {
    var t = e.alternate;
    return e === pe || t !== null && t === pe;
  }
  function uf(e, t) {
    aa = ai = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function of(e, t, n) {
    if ((n & 4194048) !== 0) {
      var l = t.lanes;
      l &= e.pendingLanes, n |= l, t.lanes = n, mo(e, n);
    }
  }
  var Fa = {
    readContext: rt,
    use: ci,
    useCallback: Ke,
    useContext: Ke,
    useEffect: Ke,
    useImperativeHandle: Ke,
    useLayoutEffect: Ke,
    useInsertionEffect: Ke,
    useMemo: Ke,
    useReducer: Ke,
    useRef: Ke,
    useState: Ke,
    useDebugValue: Ke,
    useDeferredValue: Ke,
    useTransition: Ke,
    useSyncExternalStore: Ke,
    useId: Ke,
    useHostTransitionStatus: Ke,
    useFormState: Ke,
    useActionState: Ke,
    useOptimistic: Ke,
    useMemoCache: Ke,
    useCacheRefresh: Ke
  };
  Fa.useEffectEvent = Ke;
  var df = {
    readContext: rt,
    use: ci,
    useCallback: function(e, t) {
      return vt().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: rt,
    useEffect: Zd,
    useImperativeHandle: function(e, t, n) {
      n = n != null ? n.concat([e]) : null, ui(
        4194308,
        4,
        Wd.bind(null, t, e),
        n
      );
    },
    useLayoutEffect: function(e, t) {
      return ui(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      ui(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var n = vt();
      t = t === void 0 ? null : t;
      var l = e();
      if (Nl) {
        Ln(!0);
        try {
          e();
        } finally {
          Ln(!1);
        }
      }
      return n.memoizedState = [l, t], l;
    },
    useReducer: function(e, t, n) {
      var l = vt();
      if (n !== void 0) {
        var i = n(t);
        if (Nl) {
          Ln(!0);
          try {
            n(t);
          } finally {
            Ln(!1);
          }
        }
      } else i = t;
      return l.memoizedState = l.baseState = i, e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: i
      }, l.queue = e, e = e.dispatch = Kv.bind(
        null,
        pe,
        e
      ), [l.memoizedState, e];
    },
    useRef: function(e) {
      var t = vt();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = br(e);
      var t = e.queue, n = rf.bind(null, pe, t);
      return t.dispatch = n, [e.memoizedState, n];
    },
    useDebugValue: jr,
    useDeferredValue: function(e, t) {
      var n = vt();
      return Sr(n, e, t);
    },
    useTransition: function() {
      var e = br(!1);
      return e = nf.bind(
        null,
        pe,
        e.queue,
        !0,
        !1
      ), vt().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, n) {
      var l = pe, i = vt();
      if (Se) {
        if (n === void 0)
          throw Error(u(407));
        n = n();
      } else {
        if (n = t(), Be === null)
          throw Error(u(349));
        (ye & 127) !== 0 || Ad(l, t, n);
      }
      i.memoizedState = n;
      var c = { value: n, getSnapshot: t };
      return i.queue = c, Zd(zd.bind(null, l, c, e), [
        e
      ]), l.flags |= 2048, ia(
        9,
        { destroy: void 0 },
        Rd.bind(
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
      var e = vt(), t = Be.identifierPrefix;
      if (Se) {
        var n = an, l = ln;
        n = (l & ~(1 << 32 - kt(l) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = si++, 0 < n && (t += "H" + n.toString(32)), t += "_";
      } else
        n = Gv++, t = "_" + t + "r_" + n.toString(32) + "_";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: Nr,
    useFormState: qd,
    useActionState: qd,
    useOptimistic: function(e) {
      var t = vt();
      t.memoizedState = t.baseState = e;
      var n = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = n, t = Er.bind(
        null,
        pe,
        !0,
        n
      ), n.dispatch = t, [e, t];
    },
    useMemoCache: vr,
    useCacheRefresh: function() {
      return vt().memoizedState = Zv.bind(
        null,
        pe
      );
    },
    useEffectEvent: function(e) {
      var t = vt(), n = { impl: e };
      return t.memoizedState = n, function() {
        if ((Te & 2) !== 0)
          throw Error(u(440));
        return n.impl.apply(void 0, arguments);
      };
    }
  }, Mr = {
    readContext: rt,
    use: ci,
    useCallback: Id,
    useContext: rt,
    useEffect: yr,
    useImperativeHandle: Pd,
    useInsertionEffect: Fd,
    useLayoutEffect: Jd,
    useMemo: ef,
    useReducer: ri,
    useRef: Xd,
    useState: function() {
      return ri(yn);
    },
    useDebugValue: jr,
    useDeferredValue: function(e, t) {
      var n = Pe();
      return tf(
        n,
        De.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = ri(yn)[0], t = Pe().memoizedState;
      return [
        typeof e == "boolean" ? e : Za(e),
        t
      ];
    },
    useSyncExternalStore: Td,
    useId: sf,
    useHostTransitionStatus: Nr,
    useFormState: Yd,
    useActionState: Yd,
    useOptimistic: function(e, t) {
      var n = Pe();
      return Hd(n, De, e, t);
    },
    useMemoCache: vr,
    useCacheRefresh: cf
  };
  Mr.useEffectEvent = Kd;
  var ff = {
    readContext: rt,
    use: ci,
    useCallback: Id,
    useContext: rt,
    useEffect: yr,
    useImperativeHandle: Pd,
    useInsertionEffect: Fd,
    useLayoutEffect: Jd,
    useMemo: ef,
    useReducer: xr,
    useRef: Xd,
    useState: function() {
      return xr(yn);
    },
    useDebugValue: jr,
    useDeferredValue: function(e, t) {
      var n = Pe();
      return De === null ? Sr(n, e, t) : tf(
        n,
        De.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = xr(yn)[0], t = Pe().memoizedState;
      return [
        typeof e == "boolean" ? e : Za(e),
        t
      ];
    },
    useSyncExternalStore: Td,
    useId: sf,
    useHostTransitionStatus: Nr,
    useFormState: Vd,
    useActionState: Vd,
    useOptimistic: function(e, t) {
      var n = Pe();
      return De !== null ? Hd(n, De, e, t) : (n.baseState = e, [e, n.queue.dispatch]);
    },
    useMemoCache: vr,
    useCacheRefresh: cf
  };
  ff.useEffectEvent = Kd;
  function kr(e, t, n, l) {
    t = e.memoizedState, n = n(l, t), n = n == null ? t : _({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var Cr = {
    enqueueSetState: function(e, t, n) {
      e = e._reactInternals;
      var l = Dt(), i = Vn(l);
      i.payload = t, n != null && (i.callback = n), t = Xn(e, i, l), t !== null && (wt(t, e, l), Ya(t, e, l));
    },
    enqueueReplaceState: function(e, t, n) {
      e = e._reactInternals;
      var l = Dt(), i = Vn(l);
      i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Xn(e, i, l), t !== null && (wt(t, e, l), Ya(t, e, l));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var n = Dt(), l = Vn(n);
      l.tag = 2, t != null && (l.callback = t), t = Xn(e, l, n), t !== null && (wt(t, e, n), Ya(t, e, n));
    }
  };
  function hf(e, t, n, l, i, c, f) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(l, c, f) : t.prototype && t.prototype.isPureReactComponent ? !Da(n, l) || !Da(i, c) : !0;
  }
  function mf(e, t, n, l) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, l), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, l), t.state !== e && Cr.enqueueReplaceState(t, t.state, null);
  }
  function El(e, t) {
    var n = t;
    if ("ref" in t) {
      n = {};
      for (var l in t)
        l !== "ref" && (n[l] = t[l]);
    }
    if (e = e.defaultProps) {
      n === t && (n = _({}, n));
      for (var i in e)
        n[i] === void 0 && (n[i] = e[i]);
    }
    return n;
  }
  function pf(e) {
    Ys(e);
  }
  function vf(e) {
    console.error(e);
  }
  function gf(e) {
    Ys(e);
  }
  function fi(e, t) {
    try {
      var n = e.onUncaughtError;
      n(t.value, { componentStack: t.stack });
    } catch (l) {
      setTimeout(function() {
        throw l;
      });
    }
  }
  function xf(e, t, n) {
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
  function Tr(e, t, n) {
    return n = Vn(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
      fi(e, t);
    }, n;
  }
  function bf(e) {
    return e = Vn(e), e.tag = 3, e;
  }
  function _f(e, t, n, l) {
    var i = n.type.getDerivedStateFromError;
    if (typeof i == "function") {
      var c = l.value;
      e.payload = function() {
        return i(c);
      }, e.callback = function() {
        xf(t, n, l);
      };
    }
    var f = n.stateNode;
    f !== null && typeof f.componentDidCatch == "function" && (e.callback = function() {
      xf(t, n, l), typeof i != "function" && (Pn === null ? Pn = /* @__PURE__ */ new Set([this]) : Pn.add(this));
      var x = l.stack;
      this.componentDidCatch(l.value, {
        componentStack: x !== null ? x : ""
      });
    });
  }
  function Fv(e, t, n, l, i) {
    if (n.flags |= 32768, l !== null && typeof l == "object" && typeof l.then == "function") {
      if (t = n.alternate, t !== null && Pl(
        t,
        n,
        i,
        !0
      ), n = At.current, n !== null) {
        switch (n.tag) {
          case 31:
          case 13:
            return Kt === null ? wi() : n.alternate === null && Fe === 0 && (Fe = 3), n.flags &= -257, n.flags |= 65536, n.lanes = i, l === Is ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([l]) : t.add(l), tu(e, l, i)), !1;
          case 22:
            return n.flags |= 65536, l === Is ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([l])
            }, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([l]) : n.add(l)), tu(e, l, i)), !1;
        }
        throw Error(u(435, n.tag));
      }
      return tu(e, l, i), wi(), !1;
    }
    if (Se)
      return t = At.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = i, l !== Fc && (e = Error(u(422), { cause: l }), Ua(Qt(e, n)))) : (l !== Fc && (t = Error(u(423), {
        cause: l
      }), Ua(
        Qt(t, n)
      )), e = e.current.alternate, e.flags |= 65536, i &= -i, e.lanes |= i, l = Qt(l, n), i = Tr(
        e.stateNode,
        l,
        i
      ), ir(e, i), Fe !== 4 && (Fe = 2)), !1;
    var c = Error(u(520), { cause: l });
    if (c = Qt(c, n), ls === null ? ls = [c] : ls.push(c), Fe !== 4 && (Fe = 2), t === null) return !0;
    l = Qt(l, n), n = t;
    do {
      switch (n.tag) {
        case 3:
          return n.flags |= 65536, e = i & -i, n.lanes |= e, e = Tr(n.stateNode, l, e), ir(n, e), !1;
        case 1:
          if (t = n.type, c = n.stateNode, (n.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || c !== null && typeof c.componentDidCatch == "function" && (Pn === null || !Pn.has(c))))
            return n.flags |= 65536, i &= -i, n.lanes |= i, i = bf(i), _f(
              i,
              e,
              n,
              l
            ), ir(n, i), !1;
      }
      n = n.return;
    } while (n !== null);
    return !1;
  }
  var Ar = Error(u(461)), tt = !1;
  function ut(e, t, n, l) {
    t.child = e === null ? Sd(t, null, n, l) : wl(
      t,
      e.child,
      n,
      l
    );
  }
  function yf(e, t, n, l, i) {
    n = n.render;
    var c = t.ref;
    if ("ref" in l) {
      var f = {};
      for (var x in l)
        x !== "ref" && (f[x] = l[x]);
    } else f = l;
    return _l(t), l = fr(
      e,
      t,
      n,
      f,
      c,
      i
    ), x = hr(), e !== null && !tt ? (mr(e, t, i), jn(e, t, i)) : (Se && x && Zc(t), t.flags |= 1, ut(e, t, l, i), t.child);
  }
  function jf(e, t, n, l, i) {
    if (e === null) {
      var c = n.type;
      return typeof c == "function" && !Qc(c) && c.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = c, Sf(
        e,
        t,
        c,
        l,
        i
      )) : (e = Zs(
        n.type,
        null,
        l,
        t,
        t.mode,
        i
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (c = e.child, !Br(e, i)) {
      var f = c.memoizedProps;
      if (n = n.compare, n = n !== null ? n : Da, n(f, l) && e.ref === t.ref)
        return jn(e, t, i);
    }
    return t.flags |= 1, e = vn(c, l), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Sf(e, t, n, l, i) {
    if (e !== null) {
      var c = e.memoizedProps;
      if (Da(c, l) && e.ref === t.ref)
        if (tt = !1, t.pendingProps = l = c, Br(e, i))
          (e.flags & 131072) !== 0 && (tt = !0);
        else
          return t.lanes = e.lanes, jn(e, t, i);
    }
    return Rr(
      e,
      t,
      n,
      l,
      i
    );
  }
  function wf(e, t, n, l) {
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
        return Nf(
          e,
          t,
          c,
          n,
          l
        );
      }
      if ((n & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && Ws(
          t,
          c !== null ? c.cachePool : null
        ), c !== null ? Ed(t, c) : rr(), Md(t);
      else
        return l = t.lanes = 536870912, Nf(
          e,
          t,
          c !== null ? c.baseLanes | n : n,
          n,
          l
        );
    } else
      c !== null ? (Ws(t, c.cachePool), Ed(t, c), Kn(), t.memoizedState = null) : (e !== null && Ws(t, null), rr(), Kn());
    return ut(e, t, i, n), t.child;
  }
  function Ja(e, t) {
    return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function Nf(e, t, n, l, i) {
    var c = nr();
    return c = c === null ? null : { parent: Ie._currentValue, pool: c }, t.memoizedState = {
      baseLanes: n,
      cachePool: c
    }, e !== null && Ws(t, null), rr(), Md(t), e !== null && Pl(e, t, l, !0), t.childLanes = i, null;
  }
  function hi(e, t) {
    return t = pi(
      { mode: t.mode, children: t.children },
      e.mode
    ), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function Ef(e, t, n) {
    return wl(t, e.child, null, n), e = hi(t, t.pendingProps), e.flags |= 2, Rt(t), t.memoizedState = null, e;
  }
  function Jv(e, t, n) {
    var l = t.pendingProps, i = (t.flags & 128) !== 0;
    if (t.flags &= -129, e === null) {
      if (Se) {
        if (l.mode === "hidden")
          return e = hi(t, l), t.lanes = 536870912, Ja(null, e);
        if (or(t), (e = Ge) ? (e = Uh(
          e,
          Zt
        ), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: $n !== null ? { id: ln, overflow: an } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = rd(e), n.return = t, t.child = n, ct = t, Ge = null)) : e = null, e === null) throw qn(t);
        return t.lanes = 536870912, null;
      }
      return hi(t, l);
    }
    var c = e.memoizedState;
    if (c !== null) {
      var f = c.dehydrated;
      if (or(t), i)
        if (t.flags & 256)
          t.flags &= -257, t = Ef(
            e,
            t,
            n
          );
        else if (t.memoizedState !== null)
          t.child = e.child, t.flags |= 128, t = null;
        else throw Error(u(558));
      else if (tt || Pl(e, t, n, !1), i = (n & e.childLanes) !== 0, tt || i) {
        if (l = Be, l !== null && (f = po(l, n), f !== 0 && f !== c.retryLane))
          throw c.retryLane = f, vl(e, f), wt(l, e, f), Ar;
        wi(), t = Ef(
          e,
          t,
          n
        );
      } else
        e = c.treeContext, Ge = Ft(f.nextSibling), ct = t, Se = !0, Gn = null, Zt = !1, e !== null && dd(t, e), t = hi(t, l), t.flags |= 4096;
      return t;
    }
    return e = vn(e.child, {
      mode: l.mode,
      children: l.children
    }), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function mi(e, t) {
    var n = t.ref;
    if (n === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof n != "function" && typeof n != "object")
        throw Error(u(284));
      (e === null || e.ref !== n) && (t.flags |= 4194816);
    }
  }
  function Rr(e, t, n, l, i) {
    return _l(t), n = fr(
      e,
      t,
      n,
      l,
      void 0,
      i
    ), l = hr(), e !== null && !tt ? (mr(e, t, i), jn(e, t, i)) : (Se && l && Zc(t), t.flags |= 1, ut(e, t, n, i), t.child);
  }
  function Mf(e, t, n, l, i, c) {
    return _l(t), t.updateQueue = null, n = Cd(
      t,
      l,
      n,
      i
    ), kd(e), l = hr(), e !== null && !tt ? (mr(e, t, c), jn(e, t, c)) : (Se && l && Zc(t), t.flags |= 1, ut(e, t, n, c), t.child);
  }
  function kf(e, t, n, l, i) {
    if (_l(t), t.stateNode === null) {
      var c = Kl, f = n.contextType;
      typeof f == "object" && f !== null && (c = rt(f)), c = new n(l, c), t.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null, c.updater = Cr, t.stateNode = c, c._reactInternals = t, c = t.stateNode, c.props = l, c.state = t.memoizedState, c.refs = {}, ar(t), f = n.contextType, c.context = typeof f == "object" && f !== null ? rt(f) : Kl, c.state = t.memoizedState, f = n.getDerivedStateFromProps, typeof f == "function" && (kr(
        t,
        n,
        f,
        l
      ), c.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof c.getSnapshotBeforeUpdate == "function" || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (f = c.state, typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount(), f !== c.state && Cr.enqueueReplaceState(c, c.state, null), Va(t, l, c, i), Qa(), c.state = t.memoizedState), typeof c.componentDidMount == "function" && (t.flags |= 4194308), l = !0;
    } else if (e === null) {
      c = t.stateNode;
      var x = t.memoizedProps, S = El(n, x);
      c.props = S;
      var z = c.context, $ = n.contextType;
      f = Kl, typeof $ == "object" && $ !== null && (f = rt($));
      var Y = n.getDerivedStateFromProps;
      $ = typeof Y == "function" || typeof c.getSnapshotBeforeUpdate == "function", x = t.pendingProps !== x, $ || typeof c.UNSAFE_componentWillReceiveProps != "function" && typeof c.componentWillReceiveProps != "function" || (x || z !== f) && mf(
        t,
        c,
        l,
        f
      ), Qn = !1;
      var D = t.memoizedState;
      c.state = D, Va(t, l, c, i), Qa(), z = t.memoizedState, x || D !== z || Qn ? (typeof Y == "function" && (kr(
        t,
        n,
        Y,
        l
      ), z = t.memoizedState), (S = Qn || hf(
        t,
        n,
        S,
        l,
        D,
        z,
        f
      )) ? ($ || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount()), typeof c.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof c.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = l, t.memoizedState = z), c.props = l, c.state = z, c.context = f, l = S) : (typeof c.componentDidMount == "function" && (t.flags |= 4194308), l = !1);
    } else {
      c = t.stateNode, sr(e, t), f = t.memoizedProps, $ = El(n, f), c.props = $, Y = t.pendingProps, D = c.context, z = n.contextType, S = Kl, typeof z == "object" && z !== null && (S = rt(z)), x = n.getDerivedStateFromProps, (z = typeof x == "function" || typeof c.getSnapshotBeforeUpdate == "function") || typeof c.UNSAFE_componentWillReceiveProps != "function" && typeof c.componentWillReceiveProps != "function" || (f !== Y || D !== S) && mf(
        t,
        c,
        l,
        S
      ), Qn = !1, D = t.memoizedState, c.state = D, Va(t, l, c, i), Qa();
      var L = t.memoizedState;
      f !== Y || D !== L || Qn || e !== null && e.dependencies !== null && Fs(e.dependencies) ? (typeof x == "function" && (kr(
        t,
        n,
        x,
        l
      ), L = t.memoizedState), ($ = Qn || hf(
        t,
        n,
        $,
        l,
        D,
        L,
        S
      ) || e !== null && e.dependencies !== null && Fs(e.dependencies)) ? (z || typeof c.UNSAFE_componentWillUpdate != "function" && typeof c.componentWillUpdate != "function" || (typeof c.componentWillUpdate == "function" && c.componentWillUpdate(l, L, S), typeof c.UNSAFE_componentWillUpdate == "function" && c.UNSAFE_componentWillUpdate(
        l,
        L,
        S
      )), typeof c.componentDidUpdate == "function" && (t.flags |= 4), typeof c.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof c.componentDidUpdate != "function" || f === e.memoizedProps && D === e.memoizedState || (t.flags |= 4), typeof c.getSnapshotBeforeUpdate != "function" || f === e.memoizedProps && D === e.memoizedState || (t.flags |= 1024), t.memoizedProps = l, t.memoizedState = L), c.props = l, c.state = L, c.context = S, l = $) : (typeof c.componentDidUpdate != "function" || f === e.memoizedProps && D === e.memoizedState || (t.flags |= 4), typeof c.getSnapshotBeforeUpdate != "function" || f === e.memoizedProps && D === e.memoizedState || (t.flags |= 1024), l = !1);
    }
    return c = l, mi(e, t), l = (t.flags & 128) !== 0, c || l ? (c = t.stateNode, n = l && typeof n.getDerivedStateFromError != "function" ? null : c.render(), t.flags |= 1, e !== null && l ? (t.child = wl(
      t,
      e.child,
      null,
      i
    ), t.child = wl(
      t,
      null,
      n,
      i
    )) : ut(e, t, n, i), t.memoizedState = c.state, e = t.child) : e = jn(
      e,
      t,
      i
    ), e;
  }
  function Cf(e, t, n, l) {
    return xl(), t.flags |= 256, ut(e, t, n, l), t.child;
  }
  var zr = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function Or(e) {
    return { baseLanes: e, cachePool: gd() };
  }
  function Dr(e, t, n) {
    return e = e !== null ? e.childLanes & ~n : 0, t && (e |= Ot), e;
  }
  function Tf(e, t, n) {
    var l = t.pendingProps, i = !1, c = (t.flags & 128) !== 0, f;
    if ((f = c) || (f = e !== null && e.memoizedState === null ? !1 : (We.current & 2) !== 0), f && (i = !0, t.flags &= -129), f = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (Se) {
        if (i ? Zn(t) : Kn(), (e = Ge) ? (e = Uh(
          e,
          Zt
        ), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: $n !== null ? { id: ln, overflow: an } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = rd(e), n.return = t, t.child = n, ct = t, Ge = null)) : e = null, e === null) throw qn(t);
        return gu(e) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      var x = l.children;
      return l = l.fallback, i ? (Kn(), i = t.mode, x = pi(
        { mode: "hidden", children: x },
        i
      ), l = gl(
        l,
        i,
        n,
        null
      ), x.return = t, l.return = t, x.sibling = l, t.child = x, l = t.child, l.memoizedState = Or(n), l.childLanes = Dr(
        e,
        f,
        n
      ), t.memoizedState = zr, Ja(null, l)) : (Zn(t), Hr(t, x));
    }
    var S = e.memoizedState;
    if (S !== null && (x = S.dehydrated, x !== null)) {
      if (c)
        t.flags & 256 ? (Zn(t), t.flags &= -257, t = Lr(
          e,
          t,
          n
        )) : t.memoizedState !== null ? (Kn(), t.child = e.child, t.flags |= 128, t = null) : (Kn(), x = l.fallback, i = t.mode, l = pi(
          { mode: "visible", children: l.children },
          i
        ), x = gl(
          x,
          i,
          n,
          null
        ), x.flags |= 2, l.return = t, x.return = t, l.sibling = x, t.child = l, wl(
          t,
          e.child,
          null,
          n
        ), l = t.child, l.memoizedState = Or(n), l.childLanes = Dr(
          e,
          f,
          n
        ), t.memoizedState = zr, t = Ja(null, l));
      else if (Zn(t), gu(x)) {
        if (f = x.nextSibling && x.nextSibling.dataset, f) var z = f.dgst;
        f = z, l = Error(u(419)), l.stack = "", l.digest = f, Ua({ value: l, source: null, stack: null }), t = Lr(
          e,
          t,
          n
        );
      } else if (tt || Pl(e, t, n, !1), f = (n & e.childLanes) !== 0, tt || f) {
        if (f = Be, f !== null && (l = po(f, n), l !== 0 && l !== S.retryLane))
          throw S.retryLane = l, vl(e, l), wt(f, e, l), Ar;
        vu(x) || wi(), t = Lr(
          e,
          t,
          n
        );
      } else
        vu(x) ? (t.flags |= 192, t.child = e.child, t = null) : (e = S.treeContext, Ge = Ft(
          x.nextSibling
        ), ct = t, Se = !0, Gn = null, Zt = !1, e !== null && dd(t, e), t = Hr(
          t,
          l.children
        ), t.flags |= 4096);
      return t;
    }
    return i ? (Kn(), x = l.fallback, i = t.mode, S = e.child, z = S.sibling, l = vn(S, {
      mode: "hidden",
      children: l.children
    }), l.subtreeFlags = S.subtreeFlags & 65011712, z !== null ? x = vn(
      z,
      x
    ) : (x = gl(
      x,
      i,
      n,
      null
    ), x.flags |= 2), x.return = t, l.return = t, l.sibling = x, t.child = l, Ja(null, l), l = t.child, x = e.child.memoizedState, x === null ? x = Or(n) : (i = x.cachePool, i !== null ? (S = Ie._currentValue, i = i.parent !== S ? { parent: S, pool: S } : i) : i = gd(), x = {
      baseLanes: x.baseLanes | n,
      cachePool: i
    }), l.memoizedState = x, l.childLanes = Dr(
      e,
      f,
      n
    ), t.memoizedState = zr, Ja(e.child, l)) : (Zn(t), n = e.child, e = n.sibling, n = vn(n, {
      mode: "visible",
      children: l.children
    }), n.return = t, n.sibling = null, e !== null && (f = t.deletions, f === null ? (t.deletions = [e], t.flags |= 16) : f.push(e)), t.child = n, t.memoizedState = null, n);
  }
  function Hr(e, t) {
    return t = pi(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function pi(e, t) {
    return e = Tt(22, e, null, t), e.lanes = 0, e;
  }
  function Lr(e, t, n) {
    return wl(t, e.child, null, n), e = Hr(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function Af(e, t, n) {
    e.lanes |= t;
    var l = e.alternate;
    l !== null && (l.lanes |= t), Pc(e.return, t, n);
  }
  function Ur(e, t, n, l, i, c) {
    var f = e.memoizedState;
    f === null ? e.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: l,
      tail: n,
      tailMode: i,
      treeForkCount: c
    } : (f.isBackwards = t, f.rendering = null, f.renderingStartTime = 0, f.last = l, f.tail = n, f.tailMode = i, f.treeForkCount = c);
  }
  function Rf(e, t, n) {
    var l = t.pendingProps, i = l.revealOrder, c = l.tail;
    l = l.children;
    var f = We.current, x = (f & 2) !== 0;
    if (x ? (f = f & 1 | 2, t.flags |= 128) : f &= 1, J(We, f), ut(e, t, l, n), l = Se ? La : 0, !x && e !== null && (e.flags & 128) !== 0)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13)
          e.memoizedState !== null && Af(e, n, t);
        else if (e.tag === 19)
          Af(e, n, t);
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
          e = n.alternate, e !== null && li(e) === null && (i = n), n = n.sibling;
        n = i, n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), Ur(
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
          if (e = i.alternate, e !== null && li(e) === null) {
            t.child = i;
            break;
          }
          e = i.sibling, i.sibling = n, n = i, i = e;
        }
        Ur(
          t,
          !0,
          n,
          null,
          c,
          l
        );
        break;
      case "together":
        Ur(
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
  function jn(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), Wn |= t.lanes, (n & t.childLanes) === 0)
      if (e !== null) {
        if (Pl(
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
      for (e = t.child, n = vn(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; )
        e = e.sibling, n = n.sibling = vn(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function Br(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && Fs(e)));
  }
  function Wv(e, t, n) {
    switch (t.tag) {
      case 3:
        Ue(t, t.stateNode.containerInfo), Yn(t, Ie, e.memoizedState.cache), xl();
        break;
      case 27:
      case 5:
        Nt(t);
        break;
      case 4:
        Ue(t, t.stateNode.containerInfo);
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
          return t.flags |= 128, or(t), null;
        break;
      case 13:
        var l = t.memoizedState;
        if (l !== null)
          return l.dehydrated !== null ? (Zn(t), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? Tf(e, t, n) : (Zn(t), e = jn(
            e,
            t,
            n
          ), e !== null ? e.sibling : null);
        Zn(t);
        break;
      case 19:
        var i = (e.flags & 128) !== 0;
        if (l = (n & t.childLanes) !== 0, l || (Pl(
          e,
          t,
          n,
          !1
        ), l = (n & t.childLanes) !== 0), i) {
          if (l)
            return Rf(
              e,
              t,
              n
            );
          t.flags |= 128;
        }
        if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), J(We, We.current), l) break;
        return null;
      case 22:
        return t.lanes = 0, wf(
          e,
          t,
          n,
          t.pendingProps
        );
      case 24:
        Yn(t, Ie, e.memoizedState.cache);
    }
    return jn(e, t, n);
  }
  function zf(e, t, n) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        tt = !0;
      else {
        if (!Br(e, n) && (t.flags & 128) === 0)
          return tt = !1, Wv(
            e,
            t,
            n
          );
        tt = (e.flags & 131072) !== 0;
      }
    else
      tt = !1, Se && (t.flags & 1048576) !== 0 && od(t, La, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          var l = t.pendingProps;
          if (e = jl(t.elementType), t.type = e, typeof e == "function")
            Qc(e) ? (l = El(e, l), t.tag = 1, t = kf(
              null,
              t,
              e,
              l,
              n
            )) : (t.tag = 0, t = Rr(
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
                t.tag = 11, t = yf(
                  null,
                  t,
                  e,
                  l,
                  n
                );
                break e;
              } else if (i === W) {
                t.tag = 14, t = jf(
                  null,
                  t,
                  e,
                  l,
                  n
                );
                break e;
              }
            }
            throw t = V(e) || e, Error(u(306, t, ""));
          }
        }
        return t;
      case 0:
        return Rr(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 1:
        return l = t.type, i = El(
          l,
          t.pendingProps
        ), kf(
          e,
          t,
          l,
          i,
          n
        );
      case 3:
        e: {
          if (Ue(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(u(387));
          l = t.pendingProps;
          var c = t.memoizedState;
          i = c.element, sr(e, t), Va(t, l, null, n);
          var f = t.memoizedState;
          if (l = f.cache, Yn(t, Ie, l), l !== c.cache && Ic(
            t,
            [Ie],
            n,
            !0
          ), Qa(), l = f.element, c.isDehydrated)
            if (c = {
              element: l,
              isDehydrated: !1,
              cache: f.cache
            }, t.updateQueue.baseState = c, t.memoizedState = c, t.flags & 256) {
              t = Cf(
                e,
                t,
                l,
                n
              );
              break e;
            } else if (l !== i) {
              i = Qt(
                Error(u(424)),
                t
              ), Ua(i), t = Cf(
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
              for (Ge = Ft(e.firstChild), ct = t, Se = !0, Gn = null, Zt = !0, n = Sd(
                t,
                null,
                l,
                n
              ), t.child = n; n; )
                n.flags = n.flags & -3 | 4096, n = n.sibling;
            }
          else {
            if (xl(), l === i) {
              t = jn(
                e,
                t,
                n
              );
              break e;
            }
            ut(e, t, l, n);
          }
          t = t.child;
        }
        return t;
      case 26:
        return mi(e, t), e === null ? (n = Qh(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = n : Se || (n = t.type, e = t.pendingProps, l = Ai(
          F.current
        ).createElement(n), l[it] = t, l[xt] = e, ot(l, n, e), at(l), t.stateNode = l) : t.memoizedState = Qh(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return Nt(t), e === null && Se && (l = t.stateNode = Gh(
          t.type,
          t.pendingProps,
          F.current
        ), ct = t, Zt = !0, i = Ge, nl(t.type) ? (xu = i, Ge = Ft(l.firstChild)) : Ge = i), ut(
          e,
          t,
          t.pendingProps.children,
          n
        ), mi(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && Se && ((i = l = Ge) && (l = Mg(
          l,
          t.type,
          t.pendingProps,
          Zt
        ), l !== null ? (t.stateNode = l, ct = t, Ge = Ft(l.firstChild), Zt = !1, i = !0) : i = !1), i || qn(t)), Nt(t), i = t.type, c = t.pendingProps, f = e !== null ? e.memoizedProps : null, l = c.children, hu(i, c) ? l = null : f !== null && hu(i, f) && (t.flags |= 32), t.memoizedState !== null && (i = fr(
          e,
          t,
          qv,
          null,
          null,
          n
        ), ds._currentValue = i), mi(e, t), ut(e, t, l, n), t.child;
      case 6:
        return e === null && Se && ((e = n = Ge) && (n = kg(
          n,
          t.pendingProps,
          Zt
        ), n !== null ? (t.stateNode = n, ct = t, Ge = null, e = !0) : e = !1), e || qn(t)), null;
      case 13:
        return Tf(e, t, n);
      case 4:
        return Ue(
          t,
          t.stateNode.containerInfo
        ), l = t.pendingProps, e === null ? t.child = wl(
          t,
          null,
          l,
          n
        ) : ut(e, t, l, n), t.child;
      case 11:
        return yf(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 7:
        return ut(
          e,
          t,
          t.pendingProps,
          n
        ), t.child;
      case 8:
        return ut(
          e,
          t,
          t.pendingProps.children,
          n
        ), t.child;
      case 12:
        return ut(
          e,
          t,
          t.pendingProps.children,
          n
        ), t.child;
      case 10:
        return l = t.pendingProps, Yn(t, t.type, l.value), ut(e, t, l.children, n), t.child;
      case 9:
        return i = t.type._context, l = t.pendingProps.children, _l(t), i = rt(i), l = l(i), t.flags |= 1, ut(e, t, l, n), t.child;
      case 14:
        return jf(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 15:
        return Sf(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 19:
        return Rf(e, t, n);
      case 31:
        return Jv(e, t, n);
      case 22:
        return wf(
          e,
          t,
          n,
          t.pendingProps
        );
      case 24:
        return _l(t), l = rt(Ie), e === null ? (i = nr(), i === null && (i = Be, c = er(), i.pooledCache = c, c.refCount++, c !== null && (i.pooledCacheLanes |= n), i = c), t.memoizedState = { parent: l, cache: i }, ar(t), Yn(t, Ie, i)) : ((e.lanes & n) !== 0 && (sr(e, t), Va(t, null, null, n), Qa()), i = e.memoizedState, c = t.memoizedState, i.parent !== l ? (i = { parent: l, cache: l }, t.memoizedState = i, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = i), Yn(t, Ie, l)) : (l = c.cache, Yn(t, Ie, l), l !== i.cache && Ic(
          t,
          [Ie],
          n,
          !0
        ))), ut(
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
  function Sn(e) {
    e.flags |= 4;
  }
  function $r(e, t, n, l, i) {
    if ((t = (e.mode & 32) !== 0) && (t = !1), t) {
      if (e.flags |= 16777216, (i & 335544128) === i)
        if (e.stateNode.complete) e.flags |= 8192;
        else if (ih()) e.flags |= 8192;
        else
          throw Sl = Is, lr;
    } else e.flags &= -16777217;
  }
  function Of(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !Fh(t))
      if (ih()) e.flags |= 8192;
      else
        throw Sl = Is, lr;
  }
  function vi(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? fo() : 536870912, e.lanes |= t, oa |= t);
  }
  function Wa(e, t) {
    if (!Se)
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
  function qe(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, l = 0;
    if (t)
      for (var i = e.child; i !== null; )
        n |= i.lanes | i.childLanes, l |= i.subtreeFlags & 65011712, l |= i.flags & 65011712, i.return = e, i = i.sibling;
    else
      for (i = e.child; i !== null; )
        n |= i.lanes | i.childLanes, l |= i.subtreeFlags, l |= i.flags, i.return = e, i = i.sibling;
    return e.subtreeFlags |= l, e.childLanes = n, t;
  }
  function Pv(e, t, n) {
    var l = t.pendingProps;
    switch (Kc(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return qe(t), null;
      case 1:
        return qe(t), null;
      case 3:
        return n = t.stateNode, l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), bn(Ie), Ee(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (Wl(t) ? Sn(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Jc())), qe(t), null;
      case 26:
        var i = t.type, c = t.memoizedState;
        return e === null ? (Sn(t), c !== null ? (qe(t), Of(t, c)) : (qe(t), $r(
          t,
          i,
          null,
          l,
          n
        ))) : c ? c !== e.memoizedState ? (Sn(t), qe(t), Of(t, c)) : (qe(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== l && Sn(t), qe(t), $r(
          t,
          i,
          e,
          l,
          n
        )), null;
      case 27:
        if (nn(t), n = F.current, i = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== l && Sn(t);
        else {
          if (!l) {
            if (t.stateNode === null)
              throw Error(u(166));
            return qe(t), null;
          }
          e = I.current, Wl(t) ? fd(t) : (e = Gh(i, l, n), t.stateNode = e, Sn(t));
        }
        return qe(t), null;
      case 5:
        if (nn(t), i = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== l && Sn(t);
        else {
          if (!l) {
            if (t.stateNode === null)
              throw Error(u(166));
            return qe(t), null;
          }
          if (c = I.current, Wl(t))
            fd(t);
          else {
            var f = Ai(
              F.current
            );
            switch (c) {
              case 1:
                c = f.createElementNS(
                  "http://www.w3.org/2000/svg",
                  i
                );
                break;
              case 2:
                c = f.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  i
                );
                break;
              default:
                switch (i) {
                  case "svg":
                    c = f.createElementNS(
                      "http://www.w3.org/2000/svg",
                      i
                    );
                    break;
                  case "math":
                    c = f.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      i
                    );
                    break;
                  case "script":
                    c = f.createElement("div"), c.innerHTML = "<script><\/script>", c = c.removeChild(
                      c.firstChild
                    );
                    break;
                  case "select":
                    c = typeof l.is == "string" ? f.createElement("select", {
                      is: l.is
                    }) : f.createElement("select"), l.multiple ? c.multiple = !0 : l.size && (c.size = l.size);
                    break;
                  default:
                    c = typeof l.is == "string" ? f.createElement(i, { is: l.is }) : f.createElement(i);
                }
            }
            c[it] = t, c[xt] = l;
            e: for (f = t.child; f !== null; ) {
              if (f.tag === 5 || f.tag === 6)
                c.appendChild(f.stateNode);
              else if (f.tag !== 4 && f.tag !== 27 && f.child !== null) {
                f.child.return = f, f = f.child;
                continue;
              }
              if (f === t) break e;
              for (; f.sibling === null; ) {
                if (f.return === null || f.return === t)
                  break e;
                f = f.return;
              }
              f.sibling.return = f.return, f = f.sibling;
            }
            t.stateNode = c;
            e: switch (ot(c, i, l), i) {
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
            l && Sn(t);
          }
        }
        return qe(t), $r(
          t,
          t.type,
          e === null ? null : e.memoizedProps,
          t.pendingProps,
          n
        ), null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== l && Sn(t);
        else {
          if (typeof l != "string" && t.stateNode === null)
            throw Error(u(166));
          if (e = F.current, Wl(t)) {
            if (e = t.stateNode, n = t.memoizedProps, l = null, i = ct, i !== null)
              switch (i.tag) {
                case 27:
                case 5:
                  l = i.memoizedProps;
              }
            e[it] = t, e = !!(e.nodeValue === n || l !== null && l.suppressHydrationWarning === !0 || Th(e.nodeValue, n)), e || qn(t, !0);
          } else
            e = Ai(e).createTextNode(
              l
            ), e[it] = t, t.stateNode = e;
        }
        return qe(t), null;
      case 31:
        if (n = t.memoizedState, e === null || e.memoizedState !== null) {
          if (l = Wl(t), n !== null) {
            if (e === null) {
              if (!l) throw Error(u(318));
              if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(u(557));
              e[it] = t;
            } else
              xl(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            qe(t), e = !1;
          } else
            n = Jc(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
          if (!e)
            return t.flags & 256 ? (Rt(t), t) : (Rt(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(u(558));
        }
        return qe(t), null;
      case 13:
        if (l = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (i = Wl(t), l !== null && l.dehydrated !== null) {
            if (e === null) {
              if (!i) throw Error(u(318));
              if (i = t.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(u(317));
              i[it] = t;
            } else
              xl(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            qe(t), i = !1;
          } else
            i = Jc(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = i), i = !0;
          if (!i)
            return t.flags & 256 ? (Rt(t), t) : (Rt(t), null);
        }
        return Rt(t), (t.flags & 128) !== 0 ? (t.lanes = n, t) : (n = l !== null, e = e !== null && e.memoizedState !== null, n && (l = t.child, i = null, l.alternate !== null && l.alternate.memoizedState !== null && l.alternate.memoizedState.cachePool !== null && (i = l.alternate.memoizedState.cachePool.pool), c = null, l.memoizedState !== null && l.memoizedState.cachePool !== null && (c = l.memoizedState.cachePool.pool), c !== i && (l.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), vi(t, t.updateQueue), qe(t), null);
      case 4:
        return Ee(), e === null && ru(t.stateNode.containerInfo), qe(t), null;
      case 10:
        return bn(t.type), qe(t), null;
      case 19:
        if (U(We), l = t.memoizedState, l === null) return qe(t), null;
        if (i = (t.flags & 128) !== 0, c = l.rendering, c === null)
          if (i) Wa(l, !1);
          else {
            if (Fe !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (c = li(e), c !== null) {
                  for (t.flags |= 128, Wa(l, !1), e = c.updateQueue, t.updateQueue = e, vi(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null; )
                    cd(n, e), n = n.sibling;
                  return J(
                    We,
                    We.current & 1 | 2
                  ), Se && gn(t, l.treeForkCount), t.child;
                }
                e = e.sibling;
              }
            l.tail !== null && Et() > yi && (t.flags |= 128, i = !0, Wa(l, !1), t.lanes = 4194304);
          }
        else {
          if (!i)
            if (e = li(c), e !== null) {
              if (t.flags |= 128, i = !0, e = e.updateQueue, t.updateQueue = e, vi(t, e), Wa(l, !0), l.tail === null && l.tailMode === "hidden" && !c.alternate && !Se)
                return qe(t), null;
            } else
              2 * Et() - l.renderingStartTime > yi && n !== 536870912 && (t.flags |= 128, i = !0, Wa(l, !1), t.lanes = 4194304);
          l.isBackwards ? (c.sibling = t.child, t.child = c) : (e = l.last, e !== null ? e.sibling = c : t.child = c, l.last = c);
        }
        return l.tail !== null ? (e = l.tail, l.rendering = e, l.tail = e.sibling, l.renderingStartTime = Et(), e.sibling = null, n = We.current, J(
          We,
          i ? n & 1 | 2 : n & 1
        ), Se && gn(t, l.treeForkCount), e) : (qe(t), null);
      case 22:
      case 23:
        return Rt(t), ur(), l = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== l && (t.flags |= 8192) : l && (t.flags |= 8192), l ? (n & 536870912) !== 0 && (t.flags & 128) === 0 && (qe(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : qe(t), n = t.updateQueue, n !== null && vi(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), l = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), l !== n && (t.flags |= 2048), e !== null && U(yl), null;
      case 24:
        return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), bn(Ie), qe(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(u(156, t.tag));
  }
  function Iv(e, t) {
    switch (Kc(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return bn(Ie), Ee(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return nn(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (Rt(t), t.alternate === null)
            throw Error(u(340));
          xl();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 13:
        if (Rt(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(u(340));
          xl();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return U(We), null;
      case 4:
        return Ee(), null;
      case 10:
        return bn(t.type), null;
      case 22:
      case 23:
        return Rt(t), ur(), e !== null && U(yl), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return bn(Ie), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Df(e, t) {
    switch (Kc(t), t.tag) {
      case 3:
        bn(Ie), Ee();
        break;
      case 26:
      case 27:
      case 5:
        nn(t);
        break;
      case 4:
        Ee();
        break;
      case 31:
        t.memoizedState !== null && Rt(t);
        break;
      case 13:
        Rt(t);
        break;
      case 19:
        U(We);
        break;
      case 10:
        bn(t.type);
        break;
      case 22:
      case 23:
        Rt(t), ur(), e !== null && U(yl);
        break;
      case 24:
        bn(Ie);
    }
  }
  function Pa(e, t) {
    try {
      var n = t.updateQueue, l = n !== null ? n.lastEffect : null;
      if (l !== null) {
        var i = l.next;
        n = i;
        do {
          if ((n.tag & e) === e) {
            l = void 0;
            var c = n.create, f = n.inst;
            l = c(), f.destroy = l;
          }
          n = n.next;
        } while (n !== i);
      }
    } catch (x) {
      Oe(t, t.return, x);
    }
  }
  function Fn(e, t, n) {
    try {
      var l = t.updateQueue, i = l !== null ? l.lastEffect : null;
      if (i !== null) {
        var c = i.next;
        l = c;
        do {
          if ((l.tag & e) === e) {
            var f = l.inst, x = f.destroy;
            if (x !== void 0) {
              f.destroy = void 0, i = t;
              var S = n, z = x;
              try {
                z();
              } catch ($) {
                Oe(
                  i,
                  S,
                  $
                );
              }
            }
          }
          l = l.next;
        } while (l !== c);
      }
    } catch ($) {
      Oe(t, t.return, $);
    }
  }
  function Hf(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var n = e.stateNode;
      try {
        Nd(t, n);
      } catch (l) {
        Oe(e, e.return, l);
      }
    }
  }
  function Lf(e, t, n) {
    n.props = El(
      e.type,
      e.memoizedProps
    ), n.state = e.memoizedState;
    try {
      n.componentWillUnmount();
    } catch (l) {
      Oe(e, t, l);
    }
  }
  function Ia(e, t) {
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
      Oe(e, t, i);
    }
  }
  function sn(e, t) {
    var n = e.ref, l = e.refCleanup;
    if (n !== null)
      if (typeof l == "function")
        try {
          l();
        } catch (i) {
          Oe(e, t, i);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof n == "function")
        try {
          n(null);
        } catch (i) {
          Oe(e, t, i);
        }
      else n.current = null;
  }
  function Uf(e) {
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
      Oe(e, e.return, i);
    }
  }
  function Gr(e, t, n) {
    try {
      var l = e.stateNode;
      yg(l, e.type, n, t), l[xt] = t;
    } catch (i) {
      Oe(e, e.return, i);
    }
  }
  function Bf(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && nl(e.type) || e.tag === 4;
  }
  function qr(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Bf(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && nl(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Yr(e, t, n) {
    var l = e.tag;
    if (l === 5 || l === 6)
      e = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(e, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(e), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = mn));
    else if (l !== 4 && (l === 27 && nl(e.type) && (n = e.stateNode, t = null), e = e.child, e !== null))
      for (Yr(e, t, n), e = e.sibling; e !== null; )
        Yr(e, t, n), e = e.sibling;
  }
  function gi(e, t, n) {
    var l = e.tag;
    if (l === 5 || l === 6)
      e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (l !== 4 && (l === 27 && nl(e.type) && (n = e.stateNode), e = e.child, e !== null))
      for (gi(e, t, n), e = e.sibling; e !== null; )
        gi(e, t, n), e = e.sibling;
  }
  function $f(e) {
    var t = e.stateNode, n = e.memoizedProps;
    try {
      for (var l = e.type, i = t.attributes; i.length; )
        t.removeAttributeNode(i[0]);
      ot(t, l, n), t[it] = e, t[xt] = n;
    } catch (c) {
      Oe(e, e.return, c);
    }
  }
  var wn = !1, nt = !1, Qr = !1, Gf = typeof WeakSet == "function" ? WeakSet : Set, st = null;
  function eg(e, t) {
    if (e = e.containerInfo, du = Ui, e = Po(e), Lc(e)) {
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
            var f = 0, x = -1, S = -1, z = 0, $ = 0, Y = e, D = null;
            t: for (; ; ) {
              for (var L; Y !== n || i !== 0 && Y.nodeType !== 3 || (x = f + i), Y !== c || l !== 0 && Y.nodeType !== 3 || (S = f + l), Y.nodeType === 3 && (f += Y.nodeValue.length), (L = Y.firstChild) !== null; )
                D = Y, Y = L;
              for (; ; ) {
                if (Y === e) break t;
                if (D === n && ++z === i && (x = f), D === c && ++$ === l && (S = f), (L = Y.nextSibling) !== null) break;
                Y = D, D = Y.parentNode;
              }
              Y = L;
            }
            n = x === -1 || S === -1 ? null : { start: x, end: S };
          } else n = null;
        }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (fu = { focusedElem: e, selectionRange: n }, Ui = !1, st = t; st !== null; )
      if (t = st, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null)
        e.return = t, st = e;
      else
        for (; st !== null; ) {
          switch (t = st, c = t.alternate, e = t.flags, t.tag) {
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
                  var te = El(
                    n.type,
                    i
                  );
                  e = l.getSnapshotBeforeUpdate(
                    te,
                    c
                  ), l.__reactInternalSnapshotBeforeUpdate = e;
                } catch (de) {
                  Oe(
                    n,
                    n.return,
                    de
                  );
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (e = t.stateNode.containerInfo, n = e.nodeType, n === 9)
                  pu(e);
                else if (n === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      pu(e);
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
            e.return = t.return, st = e;
            break;
          }
          st = t.return;
        }
  }
  function qf(e, t, n) {
    var l = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        En(e, n), l & 4 && Pa(5, n);
        break;
      case 1:
        if (En(e, n), l & 4)
          if (e = n.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (f) {
              Oe(n, n.return, f);
            }
          else {
            var i = El(
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
            } catch (f) {
              Oe(
                n,
                n.return,
                f
              );
            }
          }
        l & 64 && Hf(n), l & 512 && Ia(n, n.return);
        break;
      case 3:
        if (En(e, n), l & 64 && (e = n.updateQueue, e !== null)) {
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
            Nd(e, t);
          } catch (f) {
            Oe(n, n.return, f);
          }
        }
        break;
      case 27:
        t === null && l & 4 && $f(n);
      case 26:
      case 5:
        En(e, n), t === null && l & 4 && Uf(n), l & 512 && Ia(n, n.return);
        break;
      case 12:
        En(e, n);
        break;
      case 31:
        En(e, n), l & 4 && Vf(e, n);
        break;
      case 13:
        En(e, n), l & 4 && Xf(e, n), l & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = ug.bind(
          null,
          n
        ), Cg(e, n))));
        break;
      case 22:
        if (l = n.memoizedState !== null || wn, !l) {
          t = t !== null && t.memoizedState !== null || nt, i = wn;
          var c = nt;
          wn = l, (nt = t) && !c ? Mn(
            e,
            n,
            (n.subtreeFlags & 8772) !== 0
          ) : En(e, n), wn = i, nt = c;
        }
        break;
      case 30:
        break;
      default:
        En(e, n);
    }
  }
  function Yf(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Yf(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && _c(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var Ye = null, _t = !1;
  function Nn(e, t, n) {
    for (n = n.child; n !== null; )
      Qf(e, t, n), n = n.sibling;
  }
  function Qf(e, t, n) {
    if (Mt && typeof Mt.onCommitFiberUnmount == "function")
      try {
        Mt.onCommitFiberUnmount(Sa, n);
      } catch {
      }
    switch (n.tag) {
      case 26:
        nt || sn(n, t), Nn(
          e,
          t,
          n
        ), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (n = n.stateNode, n.parentNode.removeChild(n));
        break;
      case 27:
        nt || sn(n, t);
        var l = Ye, i = _t;
        nl(n.type) && (Ye = n.stateNode, _t = !1), Nn(
          e,
          t,
          n
        ), rs(n.stateNode), Ye = l, _t = i;
        break;
      case 5:
        nt || sn(n, t);
      case 6:
        if (l = Ye, i = _t, Ye = null, Nn(
          e,
          t,
          n
        ), Ye = l, _t = i, Ye !== null)
          if (_t)
            try {
              (Ye.nodeType === 9 ? Ye.body : Ye.nodeName === "HTML" ? Ye.ownerDocument.body : Ye).removeChild(n.stateNode);
            } catch (c) {
              Oe(
                n,
                t,
                c
              );
            }
          else
            try {
              Ye.removeChild(n.stateNode);
            } catch (c) {
              Oe(
                n,
                t,
                c
              );
            }
        break;
      case 18:
        Ye !== null && (_t ? (e = Ye, Hh(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          n.stateNode
        ), xa(e)) : Hh(Ye, n.stateNode));
        break;
      case 4:
        l = Ye, i = _t, Ye = n.stateNode.containerInfo, _t = !0, Nn(
          e,
          t,
          n
        ), Ye = l, _t = i;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Fn(2, n, t), nt || Fn(4, n, t), Nn(
          e,
          t,
          n
        );
        break;
      case 1:
        nt || (sn(n, t), l = n.stateNode, typeof l.componentWillUnmount == "function" && Lf(
          n,
          t,
          l
        )), Nn(
          e,
          t,
          n
        );
        break;
      case 21:
        Nn(
          e,
          t,
          n
        );
        break;
      case 22:
        nt = (l = nt) || n.memoizedState !== null, Nn(
          e,
          t,
          n
        ), nt = l;
        break;
      default:
        Nn(
          e,
          t,
          n
        );
    }
  }
  function Vf(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
      e = e.dehydrated;
      try {
        xa(e);
      } catch (n) {
        Oe(t, t.return, n);
      }
    }
  }
  function Xf(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        xa(e);
      } catch (n) {
        Oe(t, t.return, n);
      }
  }
  function tg(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new Gf()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new Gf()), t;
      default:
        throw Error(u(435, e.tag));
    }
  }
  function xi(e, t) {
    var n = tg(e);
    t.forEach(function(l) {
      if (!n.has(l)) {
        n.add(l);
        var i = og.bind(null, e, l);
        l.then(i, i);
      }
    });
  }
  function yt(e, t) {
    var n = t.deletions;
    if (n !== null)
      for (var l = 0; l < n.length; l++) {
        var i = n[l], c = e, f = t, x = f;
        e: for (; x !== null; ) {
          switch (x.tag) {
            case 27:
              if (nl(x.type)) {
                Ye = x.stateNode, _t = !1;
                break e;
              }
              break;
            case 5:
              Ye = x.stateNode, _t = !1;
              break e;
            case 3:
            case 4:
              Ye = x.stateNode.containerInfo, _t = !0;
              break e;
          }
          x = x.return;
        }
        if (Ye === null) throw Error(u(160));
        Qf(c, f, i), Ye = null, _t = !1, c = i.alternate, c !== null && (c.return = null), i.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        Zf(t, e), t = t.sibling;
  }
  var It = null;
  function Zf(e, t) {
    var n = e.alternate, l = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        yt(t, e), jt(e), l & 4 && (Fn(3, e, e.return), Pa(3, e), Fn(5, e, e.return));
        break;
      case 1:
        yt(t, e), jt(e), l & 512 && (nt || n === null || sn(n, n.return)), l & 64 && wn && (e = e.updateQueue, e !== null && (l = e.callbacks, l !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? l : n.concat(l))));
        break;
      case 26:
        var i = It;
        if (yt(t, e), jt(e), l & 512 && (nt || n === null || sn(n, n.return)), l & 4) {
          var c = n !== null ? n.memoizedState : null;
          if (l = e.memoizedState, n === null)
            if (l === null)
              if (e.stateNode === null) {
                e: {
                  l = e.type, n = e.memoizedProps, i = i.ownerDocument || i;
                  t: switch (l) {
                    case "title":
                      c = i.getElementsByTagName("title")[0], (!c || c[Ea] || c[it] || c.namespaceURI === "http://www.w3.org/2000/svg" || c.hasAttribute("itemprop")) && (c = i.createElement(l), i.head.insertBefore(
                        c,
                        i.querySelector("head > title")
                      )), ot(c, l, n), c[it] = e, at(c), l = c;
                      break e;
                    case "link":
                      var f = Zh(
                        "link",
                        "href",
                        i
                      ).get(l + (n.href || ""));
                      if (f) {
                        for (var x = 0; x < f.length; x++)
                          if (c = f[x], c.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && c.getAttribute("rel") === (n.rel == null ? null : n.rel) && c.getAttribute("title") === (n.title == null ? null : n.title) && c.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
                            f.splice(x, 1);
                            break t;
                          }
                      }
                      c = i.createElement(l), ot(c, l, n), i.head.appendChild(c);
                      break;
                    case "meta":
                      if (f = Zh(
                        "meta",
                        "content",
                        i
                      ).get(l + (n.content || ""))) {
                        for (x = 0; x < f.length; x++)
                          if (c = f[x], c.getAttribute("content") === (n.content == null ? null : "" + n.content) && c.getAttribute("name") === (n.name == null ? null : n.name) && c.getAttribute("property") === (n.property == null ? null : n.property) && c.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && c.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
                            f.splice(x, 1);
                            break t;
                          }
                      }
                      c = i.createElement(l), ot(c, l, n), i.head.appendChild(c);
                      break;
                    default:
                      throw Error(u(468, l));
                  }
                  c[it] = e, at(c), l = c;
                }
                e.stateNode = l;
              } else
                Kh(
                  i,
                  e.type,
                  e.stateNode
                );
            else
              e.stateNode = Xh(
                i,
                l,
                e.memoizedProps
              );
          else
            c !== l ? (c === null ? n.stateNode !== null && (n = n.stateNode, n.parentNode.removeChild(n)) : c.count--, l === null ? Kh(
              i,
              e.type,
              e.stateNode
            ) : Xh(
              i,
              l,
              e.memoizedProps
            )) : l === null && e.stateNode !== null && Gr(
              e,
              e.memoizedProps,
              n.memoizedProps
            );
        }
        break;
      case 27:
        yt(t, e), jt(e), l & 512 && (nt || n === null || sn(n, n.return)), n !== null && l & 4 && Gr(
          e,
          e.memoizedProps,
          n.memoizedProps
        );
        break;
      case 5:
        if (yt(t, e), jt(e), l & 512 && (nt || n === null || sn(n, n.return)), e.flags & 32) {
          i = e.stateNode;
          try {
            Gl(i, "");
          } catch (te) {
            Oe(e, e.return, te);
          }
        }
        l & 4 && e.stateNode != null && (i = e.memoizedProps, Gr(
          e,
          i,
          n !== null ? n.memoizedProps : i
        )), l & 1024 && (Qr = !0);
        break;
      case 6:
        if (yt(t, e), jt(e), l & 4) {
          if (e.stateNode === null)
            throw Error(u(162));
          l = e.memoizedProps, n = e.stateNode;
          try {
            n.nodeValue = l;
          } catch (te) {
            Oe(e, e.return, te);
          }
        }
        break;
      case 3:
        if (Oi = null, i = It, It = Ri(t.containerInfo), yt(t, e), It = i, jt(e), l & 4 && n !== null && n.memoizedState.isDehydrated)
          try {
            xa(t.containerInfo);
          } catch (te) {
            Oe(e, e.return, te);
          }
        Qr && (Qr = !1, Kf(e));
        break;
      case 4:
        l = It, It = Ri(
          e.stateNode.containerInfo
        ), yt(t, e), jt(e), It = l;
        break;
      case 12:
        yt(t, e), jt(e);
        break;
      case 31:
        yt(t, e), jt(e), l & 4 && (l = e.updateQueue, l !== null && (e.updateQueue = null, xi(e, l)));
        break;
      case 13:
        yt(t, e), jt(e), e.child.flags & 8192 && e.memoizedState !== null != (n !== null && n.memoizedState !== null) && (_i = Et()), l & 4 && (l = e.updateQueue, l !== null && (e.updateQueue = null, xi(e, l)));
        break;
      case 22:
        i = e.memoizedState !== null;
        var S = n !== null && n.memoizedState !== null, z = wn, $ = nt;
        if (wn = z || i, nt = $ || S, yt(t, e), nt = $, wn = z, jt(e), l & 8192)
          e: for (t = e.stateNode, t._visibility = i ? t._visibility & -2 : t._visibility | 1, i && (n === null || S || wn || nt || Ml(e)), n = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (n === null) {
                S = n = t;
                try {
                  if (c = S.stateNode, i)
                    f = c.style, typeof f.setProperty == "function" ? f.setProperty("display", "none", "important") : f.display = "none";
                  else {
                    x = S.stateNode;
                    var Y = S.memoizedProps.style, D = Y != null && Y.hasOwnProperty("display") ? Y.display : null;
                    x.style.display = D == null || typeof D == "boolean" ? "" : ("" + D).trim();
                  }
                } catch (te) {
                  Oe(S, S.return, te);
                }
              }
            } else if (t.tag === 6) {
              if (n === null) {
                S = t;
                try {
                  S.stateNode.nodeValue = i ? "" : S.memoizedProps;
                } catch (te) {
                  Oe(S, S.return, te);
                }
              }
            } else if (t.tag === 18) {
              if (n === null) {
                S = t;
                try {
                  var L = S.stateNode;
                  i ? Lh(L, !0) : Lh(S.stateNode, !1);
                } catch (te) {
                  Oe(S, S.return, te);
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
        l & 4 && (l = e.updateQueue, l !== null && (n = l.retryQueue, n !== null && (l.retryQueue = null, xi(e, n))));
        break;
      case 19:
        yt(t, e), jt(e), l & 4 && (l = e.updateQueue, l !== null && (e.updateQueue = null, xi(e, l)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        yt(t, e), jt(e);
    }
  }
  function jt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var n, l = e.return; l !== null; ) {
          if (Bf(l)) {
            n = l;
            break;
          }
          l = l.return;
        }
        if (n == null) throw Error(u(160));
        switch (n.tag) {
          case 27:
            var i = n.stateNode, c = qr(e);
            gi(e, c, i);
            break;
          case 5:
            var f = n.stateNode;
            n.flags & 32 && (Gl(f, ""), n.flags &= -33);
            var x = qr(e);
            gi(e, x, f);
            break;
          case 3:
          case 4:
            var S = n.stateNode.containerInfo, z = qr(e);
            Yr(
              e,
              z,
              S
            );
            break;
          default:
            throw Error(u(161));
        }
      } catch ($) {
        Oe(e, e.return, $);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function Kf(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        Kf(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
  }
  function En(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        qf(e, t.alternate, t), t = t.sibling;
  }
  function Ml(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Fn(4, t, t.return), Ml(t);
          break;
        case 1:
          sn(t, t.return);
          var n = t.stateNode;
          typeof n.componentWillUnmount == "function" && Lf(
            t,
            t.return,
            n
          ), Ml(t);
          break;
        case 27:
          rs(t.stateNode);
        case 26:
        case 5:
          sn(t, t.return), Ml(t);
          break;
        case 22:
          t.memoizedState === null && Ml(t);
          break;
        case 30:
          Ml(t);
          break;
        default:
          Ml(t);
      }
      e = e.sibling;
    }
  }
  function Mn(e, t, n) {
    for (n = n && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var l = t.alternate, i = e, c = t, f = c.flags;
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          Mn(
            i,
            c,
            n
          ), Pa(4, c);
          break;
        case 1:
          if (Mn(
            i,
            c,
            n
          ), l = c, i = l.stateNode, typeof i.componentDidMount == "function")
            try {
              i.componentDidMount();
            } catch (z) {
              Oe(l, l.return, z);
            }
          if (l = c, i = l.updateQueue, i !== null) {
            var x = l.stateNode;
            try {
              var S = i.shared.hiddenCallbacks;
              if (S !== null)
                for (i.shared.hiddenCallbacks = null, i = 0; i < S.length; i++)
                  wd(S[i], x);
            } catch (z) {
              Oe(l, l.return, z);
            }
          }
          n && f & 64 && Hf(c), Ia(c, c.return);
          break;
        case 27:
          $f(c);
        case 26:
        case 5:
          Mn(
            i,
            c,
            n
          ), n && l === null && f & 4 && Uf(c), Ia(c, c.return);
          break;
        case 12:
          Mn(
            i,
            c,
            n
          );
          break;
        case 31:
          Mn(
            i,
            c,
            n
          ), n && f & 4 && Vf(i, c);
          break;
        case 13:
          Mn(
            i,
            c,
            n
          ), n && f & 4 && Xf(i, c);
          break;
        case 22:
          c.memoizedState === null && Mn(
            i,
            c,
            n
          ), Ia(c, c.return);
          break;
        case 30:
          break;
        default:
          Mn(
            i,
            c,
            n
          );
      }
      t = t.sibling;
    }
  }
  function Vr(e, t) {
    var n = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && Ba(n));
  }
  function Xr(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Ba(e));
  }
  function en(e, t, n, l) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        Ff(
          e,
          t,
          n,
          l
        ), t = t.sibling;
  }
  function Ff(e, t, n, l) {
    var i = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        en(
          e,
          t,
          n,
          l
        ), i & 2048 && Pa(9, t);
        break;
      case 1:
        en(
          e,
          t,
          n,
          l
        );
        break;
      case 3:
        en(
          e,
          t,
          n,
          l
        ), i & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Ba(e)));
        break;
      case 12:
        if (i & 2048) {
          en(
            e,
            t,
            n,
            l
          ), e = t.stateNode;
          try {
            var c = t.memoizedProps, f = c.id, x = c.onPostCommit;
            typeof x == "function" && x(
              f,
              t.alternate === null ? "mount" : "update",
              e.passiveEffectDuration,
              -0
            );
          } catch (S) {
            Oe(t, t.return, S);
          }
        } else
          en(
            e,
            t,
            n,
            l
          );
        break;
      case 31:
        en(
          e,
          t,
          n,
          l
        );
        break;
      case 13:
        en(
          e,
          t,
          n,
          l
        );
        break;
      case 23:
        break;
      case 22:
        c = t.stateNode, f = t.alternate, t.memoizedState !== null ? c._visibility & 2 ? en(
          e,
          t,
          n,
          l
        ) : es(e, t) : c._visibility & 2 ? en(
          e,
          t,
          n,
          l
        ) : (c._visibility |= 2, ca(
          e,
          t,
          n,
          l,
          (t.subtreeFlags & 10256) !== 0 || !1
        )), i & 2048 && Vr(f, t);
        break;
      case 24:
        en(
          e,
          t,
          n,
          l
        ), i & 2048 && Xr(t.alternate, t);
        break;
      default:
        en(
          e,
          t,
          n,
          l
        );
    }
  }
  function ca(e, t, n, l, i) {
    for (i = i && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var c = e, f = t, x = n, S = l, z = f.flags;
      switch (f.tag) {
        case 0:
        case 11:
        case 15:
          ca(
            c,
            f,
            x,
            S,
            i
          ), Pa(8, f);
          break;
        case 23:
          break;
        case 22:
          var $ = f.stateNode;
          f.memoizedState !== null ? $._visibility & 2 ? ca(
            c,
            f,
            x,
            S,
            i
          ) : es(
            c,
            f
          ) : ($._visibility |= 2, ca(
            c,
            f,
            x,
            S,
            i
          )), i && z & 2048 && Vr(
            f.alternate,
            f
          );
          break;
        case 24:
          ca(
            c,
            f,
            x,
            S,
            i
          ), i && z & 2048 && Xr(f.alternate, f);
          break;
        default:
          ca(
            c,
            f,
            x,
            S,
            i
          );
      }
      t = t.sibling;
    }
  }
  function es(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var n = e, l = t, i = l.flags;
        switch (l.tag) {
          case 22:
            es(n, l), i & 2048 && Vr(
              l.alternate,
              l
            );
            break;
          case 24:
            es(n, l), i & 2048 && Xr(l.alternate, l);
            break;
          default:
            es(n, l);
        }
        t = t.sibling;
      }
  }
  var ts = 8192;
  function ra(e, t, n) {
    if (e.subtreeFlags & ts)
      for (e = e.child; e !== null; )
        Jf(
          e,
          t,
          n
        ), e = e.sibling;
  }
  function Jf(e, t, n) {
    switch (e.tag) {
      case 26:
        ra(
          e,
          t,
          n
        ), e.flags & ts && e.memoizedState !== null && Gg(
          n,
          It,
          e.memoizedState,
          e.memoizedProps
        );
        break;
      case 5:
        ra(
          e,
          t,
          n
        );
        break;
      case 3:
      case 4:
        var l = It;
        It = Ri(e.stateNode.containerInfo), ra(
          e,
          t,
          n
        ), It = l;
        break;
      case 22:
        e.memoizedState === null && (l = e.alternate, l !== null && l.memoizedState !== null ? (l = ts, ts = 16777216, ra(
          e,
          t,
          n
        ), ts = l) : ra(
          e,
          t,
          n
        ));
        break;
      default:
        ra(
          e,
          t,
          n
        );
    }
  }
  function Wf(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function ns(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var l = t[n];
          st = l, If(
            l,
            e
          );
        }
      Wf(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        Pf(e), e = e.sibling;
  }
  function Pf(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        ns(e), e.flags & 2048 && Fn(9, e, e.return);
        break;
      case 3:
        ns(e);
        break;
      case 12:
        ns(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, bi(e)) : ns(e);
        break;
      default:
        ns(e);
    }
  }
  function bi(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var l = t[n];
          st = l, If(
            l,
            e
          );
        }
      Wf(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          Fn(8, t, t.return), bi(t);
          break;
        case 22:
          n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, bi(t));
          break;
        default:
          bi(t);
      }
      e = e.sibling;
    }
  }
  function If(e, t) {
    for (; st !== null; ) {
      var n = st;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          Fn(8, n, t);
          break;
        case 23:
        case 22:
          if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
            var l = n.memoizedState.cachePool.pool;
            l != null && l.refCount++;
          }
          break;
        case 24:
          Ba(n.memoizedState.cache);
      }
      if (l = n.child, l !== null) l.return = n, st = l;
      else
        e: for (n = e; st !== null; ) {
          l = st;
          var i = l.sibling, c = l.return;
          if (Yf(l), l === n) {
            st = null;
            break e;
          }
          if (i !== null) {
            i.return = c, st = i;
            break e;
          }
          st = c;
        }
    }
  }
  var ng = {
    getCacheForType: function(e) {
      var t = rt(Ie), n = t.data.get(e);
      return n === void 0 && (n = e(), t.data.set(e, n)), n;
    },
    cacheSignal: function() {
      return rt(Ie).controller.signal;
    }
  }, lg = typeof WeakMap == "function" ? WeakMap : Map, Te = 0, Be = null, be = null, ye = 0, ze = 0, zt = null, Jn = !1, ua = !1, Zr = !1, kn = 0, Fe = 0, Wn = 0, kl = 0, Kr = 0, Ot = 0, oa = 0, ls = null, St = null, Fr = !1, _i = 0, eh = 0, yi = 1 / 0, ji = null, Pn = null, lt = 0, In = null, da = null, Cn = 0, Jr = 0, Wr = null, th = null, as = 0, Pr = null;
  function Dt() {
    return (Te & 2) !== 0 && ye !== 0 ? ye & -ye : T.T !== null ? au() : vo();
  }
  function nh() {
    if (Ot === 0)
      if ((ye & 536870912) === 0 || Se) {
        var e = Ts;
        Ts <<= 1, (Ts & 3932160) === 0 && (Ts = 262144), Ot = e;
      } else Ot = 536870912;
    return e = At.current, e !== null && (e.flags |= 32), Ot;
  }
  function wt(e, t, n) {
    (e === Be && (ze === 2 || ze === 9) || e.cancelPendingCommit !== null) && (fa(e, 0), el(
      e,
      ye,
      Ot,
      !1
    )), Na(e, n), ((Te & 2) === 0 || e !== Be) && (e === Be && ((Te & 2) === 0 && (kl |= n), Fe === 4 && el(
      e,
      ye,
      Ot,
      !1
    )), cn(e));
  }
  function lh(e, t, n) {
    if ((Te & 6) !== 0) throw Error(u(327));
    var l = !n && (t & 127) === 0 && (t & e.expiredLanes) === 0 || wa(e, t), i = l ? ig(e, t) : eu(e, t, !0), c = l;
    do {
      if (i === 0) {
        ua && !l && el(e, t, 0, !1);
        break;
      } else {
        if (n = e.current.alternate, c && !ag(n)) {
          i = eu(e, t, !1), c = !1;
          continue;
        }
        if (i === 2) {
          if (c = t, e.errorRecoveryDisabledLanes & c)
            var f = 0;
          else
            f = e.pendingLanes & -536870913, f = f !== 0 ? f : f & 536870912 ? 536870912 : 0;
          if (f !== 0) {
            t = f;
            e: {
              var x = e;
              i = ls;
              var S = x.current.memoizedState.isDehydrated;
              if (S && (fa(x, f).flags |= 256), f = eu(
                x,
                f,
                !1
              ), f !== 2) {
                if (Zr && !S) {
                  x.errorRecoveryDisabledLanes |= c, kl |= c, i = 4;
                  break e;
                }
                c = St, St = i, c !== null && (St === null ? St = c : St.push.apply(
                  St,
                  c
                ));
              }
              i = f;
            }
            if (c = !1, i !== 2) continue;
          }
        }
        if (i === 1) {
          fa(e, 0), el(e, t, 0, !0);
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
              el(
                l,
                t,
                Ot,
                !Jn
              );
              break e;
            case 2:
              St = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(u(329));
          }
          if ((t & 62914560) === t && (i = _i + 300 - Et(), 10 < i)) {
            if (el(
              l,
              t,
              Ot,
              !Jn
            ), Rs(l, 0, !0) !== 0) break e;
            Cn = t, l.timeoutHandle = Oh(
              ah.bind(
                null,
                l,
                n,
                St,
                ji,
                Fr,
                t,
                Ot,
                kl,
                oa,
                Jn,
                c,
                "Throttled",
                -0,
                0
              ),
              i
            );
            break e;
          }
          ah(
            l,
            n,
            St,
            ji,
            Fr,
            t,
            Ot,
            kl,
            oa,
            Jn,
            c,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    cn(e);
  }
  function ah(e, t, n, l, i, c, f, x, S, z, $, Y, D, L) {
    if (e.timeoutHandle = -1, Y = t.subtreeFlags, Y & 8192 || (Y & 16785408) === 16785408) {
      Y = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: mn
      }, Jf(
        t,
        c,
        Y
      );
      var te = (c & 62914560) === c ? _i - Et() : (c & 4194048) === c ? eh - Et() : 0;
      if (te = qg(
        Y,
        te
      ), te !== null) {
        Cn = c, e.cancelPendingCommit = te(
          fh.bind(
            null,
            e,
            t,
            c,
            n,
            l,
            i,
            f,
            x,
            S,
            $,
            Y,
            null,
            D,
            L
          )
        ), el(e, c, f, !z);
        return;
      }
    }
    fh(
      e,
      t,
      c,
      n,
      l,
      i,
      f,
      x,
      S
    );
  }
  function ag(e) {
    for (var t = e; ; ) {
      var n = t.tag;
      if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null)))
        for (var l = 0; l < n.length; l++) {
          var i = n[l], c = i.getSnapshot;
          i = i.value;
          try {
            if (!Ct(c(), i)) return !1;
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
  function el(e, t, n, l) {
    t &= ~Kr, t &= ~kl, e.suspendedLanes |= t, e.pingedLanes &= ~t, l && (e.warmLanes |= t), l = e.expirationTimes;
    for (var i = t; 0 < i; ) {
      var c = 31 - kt(i), f = 1 << c;
      l[c] = -1, i &= ~f;
    }
    n !== 0 && ho(e, n, t);
  }
  function Si() {
    return (Te & 6) === 0 ? (ss(0), !1) : !0;
  }
  function Ir() {
    if (be !== null) {
      if (ze === 0)
        var e = be.return;
      else
        e = be, xn = bl = null, pr(e), na = null, Ga = 0, e = be;
      for (; e !== null; )
        Df(e.alternate, e), e = e.return;
      be = null;
    }
  }
  function fa(e, t) {
    var n = e.timeoutHandle;
    n !== -1 && (e.timeoutHandle = -1, wg(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), Cn = 0, Ir(), Be = e, be = n = vn(e.current, null), ye = t, ze = 0, zt = null, Jn = !1, ua = wa(e, t), Zr = !1, oa = Ot = Kr = kl = Wn = Fe = 0, St = ls = null, Fr = !1, (t & 8) !== 0 && (t |= t & 32);
    var l = e.entangledLanes;
    if (l !== 0)
      for (e = e.entanglements, l &= t; 0 < l; ) {
        var i = 31 - kt(l), c = 1 << i;
        t |= e[i], l &= ~c;
      }
    return kn = t, Qs(), n;
  }
  function sh(e, t) {
    pe = null, T.H = Fa, t === ta || t === Ps ? (t = _d(), ze = 3) : t === lr ? (t = _d(), ze = 4) : ze = t === Ar ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, zt = t, be === null && (Fe = 1, fi(
      e,
      Qt(t, e.current)
    ));
  }
  function ih() {
    var e = At.current;
    return e === null ? !0 : (ye & 4194048) === ye ? Kt === null : (ye & 62914560) === ye || (ye & 536870912) !== 0 ? e === Kt : !1;
  }
  function ch() {
    var e = T.H;
    return T.H = Fa, e === null ? Fa : e;
  }
  function rh() {
    var e = T.A;
    return T.A = ng, e;
  }
  function wi() {
    Fe = 4, Jn || (ye & 4194048) !== ye && At.current !== null || (ua = !0), (Wn & 134217727) === 0 && (kl & 134217727) === 0 || Be === null || el(
      Be,
      ye,
      Ot,
      !1
    );
  }
  function eu(e, t, n) {
    var l = Te;
    Te |= 2;
    var i = ch(), c = rh();
    (Be !== e || ye !== t) && (ji = null, fa(e, t)), t = !1;
    var f = Fe;
    e: do
      try {
        if (ze !== 0 && be !== null) {
          var x = be, S = zt;
          switch (ze) {
            case 8:
              Ir(), f = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              At.current === null && (t = !0);
              var z = ze;
              if (ze = 0, zt = null, ha(e, x, S, z), n && ua) {
                f = 0;
                break e;
              }
              break;
            default:
              z = ze, ze = 0, zt = null, ha(e, x, S, z);
          }
        }
        sg(), f = Fe;
        break;
      } catch ($) {
        sh(e, $);
      }
    while (!0);
    return t && e.shellSuspendCounter++, xn = bl = null, Te = l, T.H = i, T.A = c, be === null && (Be = null, ye = 0, Qs()), f;
  }
  function sg() {
    for (; be !== null; ) uh(be);
  }
  function ig(e, t) {
    var n = Te;
    Te |= 2;
    var l = ch(), i = rh();
    Be !== e || ye !== t ? (ji = null, yi = Et() + 500, fa(e, t)) : ua = wa(
      e,
      t
    );
    e: do
      try {
        if (ze !== 0 && be !== null) {
          t = be;
          var c = zt;
          t: switch (ze) {
            case 1:
              ze = 0, zt = null, ha(e, t, c, 1);
              break;
            case 2:
            case 9:
              if (xd(c)) {
                ze = 0, zt = null, oh(t);
                break;
              }
              t = function() {
                ze !== 2 && ze !== 9 || Be !== e || (ze = 7), cn(e);
              }, c.then(t, t);
              break e;
            case 3:
              ze = 7;
              break e;
            case 4:
              ze = 5;
              break e;
            case 7:
              xd(c) ? (ze = 0, zt = null, oh(t)) : (ze = 0, zt = null, ha(e, t, c, 7));
              break;
            case 5:
              var f = null;
              switch (be.tag) {
                case 26:
                  f = be.memoizedState;
                case 5:
                case 27:
                  var x = be;
                  if (f ? Fh(f) : x.stateNode.complete) {
                    ze = 0, zt = null;
                    var S = x.sibling;
                    if (S !== null) be = S;
                    else {
                      var z = x.return;
                      z !== null ? (be = z, Ni(z)) : be = null;
                    }
                    break t;
                  }
              }
              ze = 0, zt = null, ha(e, t, c, 5);
              break;
            case 6:
              ze = 0, zt = null, ha(e, t, c, 6);
              break;
            case 8:
              Ir(), Fe = 6;
              break e;
            default:
              throw Error(u(462));
          }
        }
        cg();
        break;
      } catch ($) {
        sh(e, $);
      }
    while (!0);
    return xn = bl = null, T.H = l, T.A = i, Te = n, be !== null ? 0 : (Be = null, ye = 0, Qs(), Fe);
  }
  function cg() {
    for (; be !== null && !Tp(); )
      uh(be);
  }
  function uh(e) {
    var t = zf(e.alternate, e, kn);
    e.memoizedProps = e.pendingProps, t === null ? Ni(e) : be = t;
  }
  function oh(e) {
    var t = e, n = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = Mf(
          n,
          t,
          t.pendingProps,
          t.type,
          void 0,
          ye
        );
        break;
      case 11:
        t = Mf(
          n,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          ye
        );
        break;
      case 5:
        pr(t);
      default:
        Df(n, t), t = be = cd(t, kn), t = zf(n, t, kn);
    }
    e.memoizedProps = e.pendingProps, t === null ? Ni(e) : be = t;
  }
  function ha(e, t, n, l) {
    xn = bl = null, pr(t), na = null, Ga = 0;
    var i = t.return;
    try {
      if (Fv(
        e,
        i,
        t,
        n,
        ye
      )) {
        Fe = 1, fi(
          e,
          Qt(n, e.current)
        ), be = null;
        return;
      }
    } catch (c) {
      if (i !== null) throw be = i, c;
      Fe = 1, fi(
        e,
        Qt(n, e.current)
      ), be = null;
      return;
    }
    t.flags & 32768 ? (Se || l === 1 ? e = !0 : ua || (ye & 536870912) !== 0 ? e = !1 : (Jn = e = !0, (l === 2 || l === 9 || l === 3 || l === 6) && (l = At.current, l !== null && l.tag === 13 && (l.flags |= 16384))), dh(t, e)) : Ni(t);
  }
  function Ni(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        dh(
          t,
          Jn
        );
        return;
      }
      e = t.return;
      var n = Pv(
        t.alternate,
        t,
        kn
      );
      if (n !== null) {
        be = n;
        return;
      }
      if (t = t.sibling, t !== null) {
        be = t;
        return;
      }
      be = t = e;
    } while (t !== null);
    Fe === 0 && (Fe = 5);
  }
  function dh(e, t) {
    do {
      var n = Iv(e.alternate, e);
      if (n !== null) {
        n.flags &= 32767, be = n;
        return;
      }
      if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
        be = e;
        return;
      }
      be = e = n;
    } while (e !== null);
    Fe = 6, be = null;
  }
  function fh(e, t, n, l, i, c, f, x, S) {
    e.cancelPendingCommit = null;
    do
      Ei();
    while (lt !== 0);
    if ((Te & 6) !== 0) throw Error(u(327));
    if (t !== null) {
      if (t === e.current) throw Error(u(177));
      if (c = t.lanes | t.childLanes, c |= qc, $p(
        e,
        n,
        c,
        f,
        x,
        S
      ), e === Be && (be = Be = null, ye = 0), da = t, In = e, Cn = n, Jr = c, Wr = i, th = l, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, dg(ks, function() {
        return gh(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), l = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || l) {
        l = T.T, T.T = null, i = O.p, O.p = 2, f = Te, Te |= 4;
        try {
          eg(e, t, n);
        } finally {
          Te = f, O.p = i, T.T = l;
        }
      }
      lt = 1, hh(), mh(), ph();
    }
  }
  function hh() {
    if (lt === 1) {
      lt = 0;
      var e = In, t = da, n = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || n) {
        n = T.T, T.T = null;
        var l = O.p;
        O.p = 2;
        var i = Te;
        Te |= 4;
        try {
          Zf(t, e);
          var c = fu, f = Po(e.containerInfo), x = c.focusedElem, S = c.selectionRange;
          if (f !== x && x && x.ownerDocument && Wo(
            x.ownerDocument.documentElement,
            x
          )) {
            if (S !== null && Lc(x)) {
              var z = S.start, $ = S.end;
              if ($ === void 0 && ($ = z), "selectionStart" in x)
                x.selectionStart = z, x.selectionEnd = Math.min(
                  $,
                  x.value.length
                );
              else {
                var Y = x.ownerDocument || document, D = Y && Y.defaultView || window;
                if (D.getSelection) {
                  var L = D.getSelection(), te = x.textContent.length, de = Math.min(S.start, te), Le = S.end === void 0 ? de : Math.min(S.end, te);
                  !L.extend && de > Le && (f = Le, Le = de, de = f);
                  var C = Jo(
                    x,
                    de
                  ), E = Jo(
                    x,
                    Le
                  );
                  if (C && E && (L.rangeCount !== 1 || L.anchorNode !== C.node || L.anchorOffset !== C.offset || L.focusNode !== E.node || L.focusOffset !== E.offset)) {
                    var R = Y.createRange();
                    R.setStart(C.node, C.offset), L.removeAllRanges(), de > Le ? (L.addRange(R), L.extend(E.node, E.offset)) : (R.setEnd(E.node, E.offset), L.addRange(R));
                  }
                }
              }
            }
            for (Y = [], L = x; L = L.parentNode; )
              L.nodeType === 1 && Y.push({
                element: L,
                left: L.scrollLeft,
                top: L.scrollTop
              });
            for (typeof x.focus == "function" && x.focus(), x = 0; x < Y.length; x++) {
              var q = Y[x];
              q.element.scrollLeft = q.left, q.element.scrollTop = q.top;
            }
          }
          Ui = !!du, fu = du = null;
        } finally {
          Te = i, O.p = l, T.T = n;
        }
      }
      e.current = t, lt = 2;
    }
  }
  function mh() {
    if (lt === 2) {
      lt = 0;
      var e = In, t = da, n = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || n) {
        n = T.T, T.T = null;
        var l = O.p;
        O.p = 2;
        var i = Te;
        Te |= 4;
        try {
          qf(e, t.alternate, t);
        } finally {
          Te = i, O.p = l, T.T = n;
        }
      }
      lt = 3;
    }
  }
  function ph() {
    if (lt === 4 || lt === 3) {
      lt = 0, Ap();
      var e = In, t = da, n = Cn, l = th;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? lt = 5 : (lt = 0, da = In = null, vh(e, e.pendingLanes));
      var i = e.pendingLanes;
      if (i === 0 && (Pn = null), xc(n), t = t.stateNode, Mt && typeof Mt.onCommitFiberRoot == "function")
        try {
          Mt.onCommitFiberRoot(
            Sa,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (l !== null) {
        t = T.T, i = O.p, O.p = 2, T.T = null;
        try {
          for (var c = e.onRecoverableError, f = 0; f < l.length; f++) {
            var x = l[f];
            c(x.value, {
              componentStack: x.stack
            });
          }
        } finally {
          T.T = t, O.p = i;
        }
      }
      (Cn & 3) !== 0 && Ei(), cn(e), i = e.pendingLanes, (n & 261930) !== 0 && (i & 42) !== 0 ? e === Pr ? as++ : (as = 0, Pr = e) : as = 0, ss(0);
    }
  }
  function vh(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Ba(t)));
  }
  function Ei() {
    return hh(), mh(), ph(), gh();
  }
  function gh() {
    if (lt !== 5) return !1;
    var e = In, t = Jr;
    Jr = 0;
    var n = xc(Cn), l = T.T, i = O.p;
    try {
      O.p = 32 > n ? 32 : n, T.T = null, n = Wr, Wr = null;
      var c = In, f = Cn;
      if (lt = 0, da = In = null, Cn = 0, (Te & 6) !== 0) throw Error(u(331));
      var x = Te;
      if (Te |= 4, Pf(c.current), Ff(
        c,
        c.current,
        f,
        n
      ), Te = x, ss(0, !1), Mt && typeof Mt.onPostCommitFiberRoot == "function")
        try {
          Mt.onPostCommitFiberRoot(Sa, c);
        } catch {
        }
      return !0;
    } finally {
      O.p = i, T.T = l, vh(e, t);
    }
  }
  function xh(e, t, n) {
    t = Qt(n, t), t = Tr(e.stateNode, t, 2), e = Xn(e, t, 2), e !== null && (Na(e, 2), cn(e));
  }
  function Oe(e, t, n) {
    if (e.tag === 3)
      xh(e, e, n);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          xh(
            t,
            e,
            n
          );
          break;
        } else if (t.tag === 1) {
          var l = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof l.componentDidCatch == "function" && (Pn === null || !Pn.has(l))) {
            e = Qt(n, e), n = bf(2), l = Xn(t, n, 2), l !== null && (_f(
              n,
              l,
              t,
              e
            ), Na(l, 2), cn(l));
            break;
          }
        }
        t = t.return;
      }
  }
  function tu(e, t, n) {
    var l = e.pingCache;
    if (l === null) {
      l = e.pingCache = new lg();
      var i = /* @__PURE__ */ new Set();
      l.set(t, i);
    } else
      i = l.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), l.set(t, i));
    i.has(n) || (Zr = !0, i.add(n), e = rg.bind(null, e, t, n), t.then(e, e));
  }
  function rg(e, t, n) {
    var l = e.pingCache;
    l !== null && l.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, Be === e && (ye & n) === n && (Fe === 4 || Fe === 3 && (ye & 62914560) === ye && 300 > Et() - _i ? (Te & 2) === 0 && fa(e, 0) : Kr |= n, oa === ye && (oa = 0)), cn(e);
  }
  function bh(e, t) {
    t === 0 && (t = fo()), e = vl(e, t), e !== null && (Na(e, t), cn(e));
  }
  function ug(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), bh(e, n);
  }
  function og(e, t) {
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
    l !== null && l.delete(t), bh(e, n);
  }
  function dg(e, t) {
    return mc(e, t);
  }
  var Mi = null, ma = null, nu = !1, ki = !1, lu = !1, tl = 0;
  function cn(e) {
    e !== ma && e.next === null && (ma === null ? Mi = ma = e : ma = ma.next = e), ki = !0, nu || (nu = !0, hg());
  }
  function ss(e, t) {
    if (!lu && ki) {
      lu = !0;
      do
        for (var n = !1, l = Mi; l !== null; ) {
          if (e !== 0) {
            var i = l.pendingLanes;
            if (i === 0) var c = 0;
            else {
              var f = l.suspendedLanes, x = l.pingedLanes;
              c = (1 << 31 - kt(42 | e) + 1) - 1, c &= i & ~(f & ~x), c = c & 201326741 ? c & 201326741 | 1 : c ? c | 2 : 0;
            }
            c !== 0 && (n = !0, Sh(l, c));
          } else
            c = ye, c = Rs(
              l,
              l === Be ? c : 0,
              l.cancelPendingCommit !== null || l.timeoutHandle !== -1
            ), (c & 3) === 0 || wa(l, c) || (n = !0, Sh(l, c));
          l = l.next;
        }
      while (n);
      lu = !1;
    }
  }
  function fg() {
    _h();
  }
  function _h() {
    ki = nu = !1;
    var e = 0;
    tl !== 0 && Sg() && (e = tl);
    for (var t = Et(), n = null, l = Mi; l !== null; ) {
      var i = l.next, c = yh(l, t);
      c === 0 ? (l.next = null, n === null ? Mi = i : n.next = i, i === null && (ma = n)) : (n = l, (e !== 0 || (c & 3) !== 0) && (ki = !0)), l = i;
    }
    lt !== 0 && lt !== 5 || ss(e), tl !== 0 && (tl = 0);
  }
  function yh(e, t) {
    for (var n = e.suspendedLanes, l = e.pingedLanes, i = e.expirationTimes, c = e.pendingLanes & -62914561; 0 < c; ) {
      var f = 31 - kt(c), x = 1 << f, S = i[f];
      S === -1 ? ((x & n) === 0 || (x & l) !== 0) && (i[f] = Bp(x, t)) : S <= t && (e.expiredLanes |= x), c &= ~x;
    }
    if (t = Be, n = ye, n = Rs(
      e,
      e === t ? n : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), l = e.callbackNode, n === 0 || e === t && (ze === 2 || ze === 9) || e.cancelPendingCommit !== null)
      return l !== null && l !== null && pc(l), e.callbackNode = null, e.callbackPriority = 0;
    if ((n & 3) === 0 || wa(e, n)) {
      if (t = n & -n, t === e.callbackPriority) return t;
      switch (l !== null && pc(l), xc(n)) {
        case 2:
        case 8:
          n = uo;
          break;
        case 32:
          n = ks;
          break;
        case 268435456:
          n = oo;
          break;
        default:
          n = ks;
      }
      return l = jh.bind(null, e), n = mc(n, l), e.callbackPriority = t, e.callbackNode = n, t;
    }
    return l !== null && l !== null && pc(l), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function jh(e, t) {
    if (lt !== 0 && lt !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var n = e.callbackNode;
    if (Ei() && e.callbackNode !== n)
      return null;
    var l = ye;
    return l = Rs(
      e,
      e === Be ? l : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), l === 0 ? null : (lh(e, l, t), yh(e, Et()), e.callbackNode != null && e.callbackNode === n ? jh.bind(null, e) : null);
  }
  function Sh(e, t) {
    if (Ei()) return null;
    lh(e, t, !0);
  }
  function hg() {
    Ng(function() {
      (Te & 6) !== 0 ? mc(
        ro,
        fg
      ) : _h();
    });
  }
  function au() {
    if (tl === 0) {
      var e = Il;
      e === 0 && (e = Cs, Cs <<= 1, (Cs & 261888) === 0 && (Cs = 256)), tl = e;
    }
    return tl;
  }
  function wh(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Hs("" + e);
  }
  function Nh(e, t) {
    var n = t.ownerDocument.createElement("input");
    return n.name = t.name, n.value = t.value, e.id && n.setAttribute("form", e.id), t.parentNode.insertBefore(n, t), e = new FormData(e), n.parentNode.removeChild(n), e;
  }
  function mg(e, t, n, l, i) {
    if (t === "submit" && n && n.stateNode === i) {
      var c = wh(
        (i[xt] || null).action
      ), f = l.submitter;
      f && (t = (t = f[xt] || null) ? wh(t.formAction) : f.getAttribute("formAction"), t !== null && (c = t, f = null));
      var x = new $s(
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
                if (tl !== 0) {
                  var S = f ? Nh(i, f) : new FormData(i);
                  wr(
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
                typeof c == "function" && (x.preventDefault(), S = f ? Nh(i, f) : new FormData(i), wr(
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
  for (var su = 0; su < Gc.length; su++) {
    var iu = Gc[su], pg = iu.toLowerCase(), vg = iu[0].toUpperCase() + iu.slice(1);
    Pt(
      pg,
      "on" + vg
    );
  }
  Pt(td, "onAnimationEnd"), Pt(nd, "onAnimationIteration"), Pt(ld, "onAnimationStart"), Pt("dblclick", "onDoubleClick"), Pt("focusin", "onFocus"), Pt("focusout", "onBlur"), Pt(Rv, "onTransitionRun"), Pt(zv, "onTransitionStart"), Pt(Ov, "onTransitionCancel"), Pt(ad, "onTransitionEnd"), Bl("onMouseEnter", ["mouseout", "mouseover"]), Bl("onMouseLeave", ["mouseout", "mouseover"]), Bl("onPointerEnter", ["pointerout", "pointerover"]), Bl("onPointerLeave", ["pointerout", "pointerover"]), fl(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), fl(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), fl("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), fl(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), fl(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), fl(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var is = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), gg = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(is)
  );
  function Eh(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var l = e[n], i = l.event;
      l = l.listeners;
      e: {
        var c = void 0;
        if (t)
          for (var f = l.length - 1; 0 <= f; f--) {
            var x = l[f], S = x.instance, z = x.currentTarget;
            if (x = x.listener, S !== c && i.isPropagationStopped())
              break e;
            c = x, i.currentTarget = z;
            try {
              c(i);
            } catch ($) {
              Ys($);
            }
            i.currentTarget = null, c = S;
          }
        else
          for (f = 0; f < l.length; f++) {
            if (x = l[f], S = x.instance, z = x.currentTarget, x = x.listener, S !== c && i.isPropagationStopped())
              break e;
            c = x, i.currentTarget = z;
            try {
              c(i);
            } catch ($) {
              Ys($);
            }
            i.currentTarget = null, c = S;
          }
      }
    }
  }
  function _e(e, t) {
    var n = t[bc];
    n === void 0 && (n = t[bc] = /* @__PURE__ */ new Set());
    var l = e + "__bubble";
    n.has(l) || (Mh(t, e, 2, !1), n.add(l));
  }
  function cu(e, t, n) {
    var l = 0;
    t && (l |= 4), Mh(
      n,
      e,
      l,
      t
    );
  }
  var Ci = "_reactListening" + Math.random().toString(36).slice(2);
  function ru(e) {
    if (!e[Ci]) {
      e[Ci] = !0, bo.forEach(function(n) {
        n !== "selectionchange" && (gg.has(n) || cu(n, !1, e), cu(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Ci] || (t[Ci] = !0, cu("selectionchange", !1, t));
    }
  }
  function Mh(e, t, n, l) {
    switch (nm(t)) {
      case 2:
        var i = Vg;
        break;
      case 8:
        i = Xg;
        break;
      default:
        i = Su;
    }
    n = i.bind(
      null,
      t,
      n,
      e
    ), i = void 0, !kc || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), l ? i !== void 0 ? e.addEventListener(t, n, {
      capture: !0,
      passive: i
    }) : e.addEventListener(t, n, !0) : i !== void 0 ? e.addEventListener(t, n, {
      passive: i
    }) : e.addEventListener(t, n, !1);
  }
  function uu(e, t, n, l, i) {
    var c = l;
    if ((t & 1) === 0 && (t & 2) === 0 && l !== null)
      e: for (; ; ) {
        if (l === null) return;
        var f = l.tag;
        if (f === 3 || f === 4) {
          var x = l.stateNode.containerInfo;
          if (x === i) break;
          if (f === 4)
            for (f = l.return; f !== null; ) {
              var S = f.tag;
              if ((S === 3 || S === 4) && f.stateNode.containerInfo === i)
                return;
              f = f.return;
            }
          for (; x !== null; ) {
            if (f = Hl(x), f === null) return;
            if (S = f.tag, S === 5 || S === 6 || S === 26 || S === 27) {
              l = c = f;
              continue e;
            }
            x = x.parentNode;
          }
        }
        l = l.return;
      }
    Ao(function() {
      var z = c, $ = Ec(n), Y = [];
      e: {
        var D = sd.get(e);
        if (D !== void 0) {
          var L = $s, te = e;
          switch (e) {
            case "keypress":
              if (Us(n) === 0) break e;
            case "keydown":
            case "keyup":
              L = ov;
              break;
            case "focusin":
              te = "focus", L = Rc;
              break;
            case "focusout":
              te = "blur", L = Rc;
              break;
            case "beforeblur":
            case "afterblur":
              L = Rc;
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
              L = Oo;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              L = Pp;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              L = hv;
              break;
            case td:
            case nd:
            case ld:
              L = tv;
              break;
            case ad:
              L = pv;
              break;
            case "scroll":
            case "scrollend":
              L = Jp;
              break;
            case "wheel":
              L = gv;
              break;
            case "copy":
            case "cut":
            case "paste":
              L = lv;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              L = Ho;
              break;
            case "toggle":
            case "beforetoggle":
              L = bv;
          }
          var de = (t & 4) !== 0, Le = !de && (e === "scroll" || e === "scrollend"), C = de ? D !== null ? D + "Capture" : null : D;
          de = [];
          for (var E = z, R; E !== null; ) {
            var q = E;
            if (R = q.stateNode, q = q.tag, q !== 5 && q !== 26 && q !== 27 || R === null || C === null || (q = ka(E, C), q != null && de.push(
              cs(E, q, R)
            )), Le) break;
            E = E.return;
          }
          0 < de.length && (D = new L(
            D,
            te,
            null,
            n,
            $
          ), Y.push({ event: D, listeners: de }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (D = e === "mouseover" || e === "pointerover", L = e === "mouseout" || e === "pointerout", D && n !== Nc && (te = n.relatedTarget || n.fromElement) && (Hl(te) || te[Dl]))
            break e;
          if ((L || D) && (D = $.window === $ ? $ : (D = $.ownerDocument) ? D.defaultView || D.parentWindow : window, L ? (te = n.relatedTarget || n.toElement, L = z, te = te ? Hl(te) : null, te !== null && (Le = h(te), de = te.tag, te !== Le || de !== 5 && de !== 27 && de !== 6) && (te = null)) : (L = null, te = z), L !== te)) {
            if (de = Oo, q = "onMouseLeave", C = "onMouseEnter", E = "mouse", (e === "pointerout" || e === "pointerover") && (de = Ho, q = "onPointerLeave", C = "onPointerEnter", E = "pointer"), Le = L == null ? D : Ma(L), R = te == null ? D : Ma(te), D = new de(
              q,
              E + "leave",
              L,
              n,
              $
            ), D.target = Le, D.relatedTarget = R, q = null, Hl($) === z && (de = new de(
              C,
              E + "enter",
              te,
              n,
              $
            ), de.target = R, de.relatedTarget = Le, q = de), Le = q, L && te)
              t: {
                for (de = xg, C = L, E = te, R = 0, q = C; q; q = de(q))
                  R++;
                q = 0;
                for (var ie = E; ie; ie = de(ie))
                  q++;
                for (; 0 < R - q; )
                  C = de(C), R--;
                for (; 0 < q - R; )
                  E = de(E), q--;
                for (; R--; ) {
                  if (C === E || E !== null && C === E.alternate) {
                    de = C;
                    break t;
                  }
                  C = de(C), E = de(E);
                }
                de = null;
              }
            else de = null;
            L !== null && kh(
              Y,
              D,
              L,
              de,
              !1
            ), te !== null && Le !== null && kh(
              Y,
              Le,
              te,
              de,
              !0
            );
          }
        }
        e: {
          if (D = z ? Ma(z) : window, L = D.nodeName && D.nodeName.toLowerCase(), L === "select" || L === "input" && D.type === "file")
            var Me = Qo;
          else if (qo(D))
            if (Vo)
              Me = Cv;
            else {
              Me = Mv;
              var ae = Ev;
            }
          else
            L = D.nodeName, !L || L.toLowerCase() !== "input" || D.type !== "checkbox" && D.type !== "radio" ? z && wc(z.elementType) && (Me = Qo) : Me = kv;
          if (Me && (Me = Me(e, z))) {
            Yo(
              Y,
              Me,
              n,
              $
            );
            break e;
          }
          ae && ae(e, D, z), e === "focusout" && z && D.type === "number" && z.memoizedProps.value != null && Sc(D, "number", D.value);
        }
        switch (ae = z ? Ma(z) : window, e) {
          case "focusin":
            (qo(ae) || ae.contentEditable === "true") && (Vl = ae, Uc = z, Ha = null);
            break;
          case "focusout":
            Ha = Uc = Vl = null;
            break;
          case "mousedown":
            Bc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Bc = !1, Io(Y, n, $);
            break;
          case "selectionchange":
            if (Av) break;
          case "keydown":
          case "keyup":
            Io(Y, n, $);
        }
        var ve;
        if (Oc)
          e: {
            switch (e) {
              case "compositionstart":
                var je = "onCompositionStart";
                break e;
              case "compositionend":
                je = "onCompositionEnd";
                break e;
              case "compositionupdate":
                je = "onCompositionUpdate";
                break e;
            }
            je = void 0;
          }
        else
          Ql ? $o(e, n) && (je = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (je = "onCompositionStart");
        je && (Lo && n.locale !== "ko" && (Ql || je !== "onCompositionStart" ? je === "onCompositionEnd" && Ql && (ve = Ro()) : (Bn = $, Cc = "value" in Bn ? Bn.value : Bn.textContent, Ql = !0)), ae = Ti(z, je), 0 < ae.length && (je = new Do(
          je,
          e,
          null,
          n,
          $
        ), Y.push({ event: je, listeners: ae }), ve ? je.data = ve : (ve = Go(n), ve !== null && (je.data = ve)))), (ve = yv ? jv(e, n) : Sv(e, n)) && (je = Ti(z, "onBeforeInput"), 0 < je.length && (ae = new Do(
          "onBeforeInput",
          "beforeinput",
          null,
          n,
          $
        ), Y.push({
          event: ae,
          listeners: je
        }), ae.data = ve)), mg(
          Y,
          e,
          z,
          n,
          $
        );
      }
      Eh(Y, t);
    });
  }
  function cs(e, t, n) {
    return {
      instance: e,
      listener: t,
      currentTarget: n
    };
  }
  function Ti(e, t) {
    for (var n = t + "Capture", l = []; e !== null; ) {
      var i = e, c = i.stateNode;
      if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || c === null || (i = ka(e, n), i != null && l.unshift(
        cs(e, i, c)
      ), i = ka(e, t), i != null && l.push(
        cs(e, i, c)
      )), e.tag === 3) return l;
      e = e.return;
    }
    return [];
  }
  function xg(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function kh(e, t, n, l, i) {
    for (var c = t._reactName, f = []; n !== null && n !== l; ) {
      var x = n, S = x.alternate, z = x.stateNode;
      if (x = x.tag, S !== null && S === l) break;
      x !== 5 && x !== 26 && x !== 27 || z === null || (S = z, i ? (z = ka(n, c), z != null && f.unshift(
        cs(n, z, S)
      )) : i || (z = ka(n, c), z != null && f.push(
        cs(n, z, S)
      ))), n = n.return;
    }
    f.length !== 0 && e.push({ event: t, listeners: f });
  }
  var bg = /\r\n?/g, _g = /\u0000|\uFFFD/g;
  function Ch(e) {
    return (typeof e == "string" ? e : "" + e).replace(bg, `
`).replace(_g, "");
  }
  function Th(e, t) {
    return t = Ch(t), Ch(e) === t;
  }
  function He(e, t, n, l, i, c) {
    switch (n) {
      case "children":
        typeof l == "string" ? t === "body" || t === "textarea" && l === "" || Gl(e, l) : (typeof l == "number" || typeof l == "bigint") && t !== "body" && Gl(e, "" + l);
        break;
      case "className":
        Os(e, "class", l);
        break;
      case "tabIndex":
        Os(e, "tabindex", l);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Os(e, n, l);
        break;
      case "style":
        Co(e, l, c);
        break;
      case "data":
        if (t !== "object") {
          Os(e, "data", l);
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
        l = Hs("" + l), e.setAttribute(n, l);
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
        l = Hs("" + l), e.setAttribute(n, l);
        break;
      case "onClick":
        l != null && (e.onclick = mn);
        break;
      case "onScroll":
        l != null && _e("scroll", e);
        break;
      case "onScrollEnd":
        l != null && _e("scrollend", e);
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
        n = Hs("" + l), e.setAttributeNS(
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
        _e("beforetoggle", e), _e("toggle", e), zs(e, "popover", l);
        break;
      case "xlinkActuate":
        hn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          l
        );
        break;
      case "xlinkArcrole":
        hn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          l
        );
        break;
      case "xlinkRole":
        hn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          l
        );
        break;
      case "xlinkShow":
        hn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          l
        );
        break;
      case "xlinkTitle":
        hn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          l
        );
        break;
      case "xlinkType":
        hn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          l
        );
        break;
      case "xmlBase":
        hn(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          l
        );
        break;
      case "xmlLang":
        hn(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          l
        );
        break;
      case "xmlSpace":
        hn(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          l
        );
        break;
      case "is":
        zs(e, "is", l);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = Kp.get(n) || n, zs(e, n, l));
    }
  }
  function ou(e, t, n, l, i, c) {
    switch (n) {
      case "style":
        Co(e, l, c);
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
        typeof l == "string" ? Gl(e, l) : (typeof l == "number" || typeof l == "bigint") && Gl(e, "" + l);
        break;
      case "onScroll":
        l != null && _e("scroll", e);
        break;
      case "onScrollEnd":
        l != null && _e("scrollend", e);
        break;
      case "onClick":
        l != null && (e.onclick = mn);
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
        if (!_o.hasOwnProperty(n))
          e: {
            if (n[0] === "o" && n[1] === "n" && (i = n.endsWith("Capture"), t = n.slice(2, i ? n.length - 7 : void 0), c = e[xt] || null, c = c != null ? c[n] : null, typeof c == "function" && e.removeEventListener(t, c, i), typeof l == "function")) {
              typeof c != "function" && c !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(t, l, i);
              break e;
            }
            n in e ? e[n] = l : l === !0 ? e.setAttribute(n, "") : zs(e, n, l);
          }
    }
  }
  function ot(e, t, n) {
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
        _e("error", e), _e("load", e);
        var l = !1, i = !1, c;
        for (c in n)
          if (n.hasOwnProperty(c)) {
            var f = n[c];
            if (f != null)
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
                  He(e, t, c, f, n, null);
              }
          }
        i && He(e, t, "srcSet", n.srcSet, n, null), l && He(e, t, "src", n.src, n, null);
        return;
      case "input":
        _e("invalid", e);
        var x = c = f = i = null, S = null, z = null;
        for (l in n)
          if (n.hasOwnProperty(l)) {
            var $ = n[l];
            if ($ != null)
              switch (l) {
                case "name":
                  i = $;
                  break;
                case "type":
                  f = $;
                  break;
                case "checked":
                  S = $;
                  break;
                case "defaultChecked":
                  z = $;
                  break;
                case "value":
                  c = $;
                  break;
                case "defaultValue":
                  x = $;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if ($ != null)
                    throw Error(u(137, t));
                  break;
                default:
                  He(e, t, l, $, n, null);
              }
          }
        No(
          e,
          c,
          x,
          S,
          z,
          f,
          i,
          !1
        );
        return;
      case "select":
        _e("invalid", e), l = f = c = null;
        for (i in n)
          if (n.hasOwnProperty(i) && (x = n[i], x != null))
            switch (i) {
              case "value":
                c = x;
                break;
              case "defaultValue":
                f = x;
                break;
              case "multiple":
                l = x;
              default:
                He(e, t, i, x, n, null);
            }
        t = c, n = f, e.multiple = !!l, t != null ? $l(e, !!l, t, !1) : n != null && $l(e, !!l, n, !0);
        return;
      case "textarea":
        _e("invalid", e), c = i = l = null;
        for (f in n)
          if (n.hasOwnProperty(f) && (x = n[f], x != null))
            switch (f) {
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
                He(e, t, f, x, n, null);
            }
        Mo(e, l, i, c);
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
        _e("beforetoggle", e), _e("toggle", e), _e("cancel", e), _e("close", e);
        break;
      case "iframe":
      case "object":
        _e("load", e);
        break;
      case "video":
      case "audio":
        for (l = 0; l < is.length; l++)
          _e(is[l], e);
        break;
      case "image":
        _e("error", e), _e("load", e);
        break;
      case "details":
        _e("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        _e("error", e), _e("load", e);
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
        for (z in n)
          if (n.hasOwnProperty(z) && (l = n[z], l != null))
            switch (z) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(u(137, t));
              default:
                He(e, t, z, l, n, null);
            }
        return;
      default:
        if (wc(t)) {
          for ($ in n)
            n.hasOwnProperty($) && (l = n[$], l !== void 0 && ou(
              e,
              t,
              $,
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
  function yg(e, t, n, l) {
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
        var i = null, c = null, f = null, x = null, S = null, z = null, $ = null;
        for (L in n) {
          var Y = n[L];
          if (n.hasOwnProperty(L) && Y != null)
            switch (L) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                S = Y;
              default:
                l.hasOwnProperty(L) || He(e, t, L, null, l, Y);
            }
        }
        for (var D in l) {
          var L = l[D];
          if (Y = n[D], l.hasOwnProperty(D) && (L != null || Y != null))
            switch (D) {
              case "type":
                c = L;
                break;
              case "name":
                i = L;
                break;
              case "checked":
                z = L;
                break;
              case "defaultChecked":
                $ = L;
                break;
              case "value":
                f = L;
                break;
              case "defaultValue":
                x = L;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (L != null)
                  throw Error(u(137, t));
                break;
              default:
                L !== Y && He(
                  e,
                  t,
                  D,
                  L,
                  l,
                  Y
                );
            }
        }
        jc(
          e,
          f,
          x,
          S,
          z,
          $,
          c,
          i
        );
        return;
      case "select":
        L = f = x = D = null;
        for (c in n)
          if (S = n[c], n.hasOwnProperty(c) && S != null)
            switch (c) {
              case "value":
                break;
              case "multiple":
                L = S;
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
                f = c;
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
        t = x, n = f, l = L, D != null ? $l(e, !!n, D, !1) : !!l != !!n && (t != null ? $l(e, !!n, t, !0) : $l(e, !!n, n ? [] : "", !1));
        return;
      case "textarea":
        L = D = null;
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
        for (f in l)
          if (i = l[f], c = n[f], l.hasOwnProperty(f) && (i != null || c != null))
            switch (f) {
              case "value":
                D = i;
                break;
              case "defaultValue":
                L = i;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (i != null) throw Error(u(91));
                break;
              default:
                i !== c && He(e, t, f, i, l, c);
            }
        Eo(e, D, L);
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
          if (D = l[S], L = n[S], l.hasOwnProperty(S) && D !== L && (D != null || L != null))
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
                  L
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
        for (var de in n)
          D = n[de], n.hasOwnProperty(de) && D != null && !l.hasOwnProperty(de) && He(e, t, de, null, l, D);
        for (z in l)
          if (D = l[z], L = n[z], l.hasOwnProperty(z) && D !== L && (D != null || L != null))
            switch (z) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (D != null)
                  throw Error(u(137, t));
                break;
              default:
                He(
                  e,
                  t,
                  z,
                  D,
                  l,
                  L
                );
            }
        return;
      default:
        if (wc(t)) {
          for (var Le in n)
            D = n[Le], n.hasOwnProperty(Le) && D !== void 0 && !l.hasOwnProperty(Le) && ou(
              e,
              t,
              Le,
              void 0,
              l,
              D
            );
          for ($ in l)
            D = l[$], L = n[$], !l.hasOwnProperty($) || D === L || D === void 0 && L === void 0 || ou(
              e,
              t,
              $,
              D,
              l,
              L
            );
          return;
        }
    }
    for (var C in n)
      D = n[C], n.hasOwnProperty(C) && D != null && !l.hasOwnProperty(C) && He(e, t, C, null, l, D);
    for (Y in l)
      D = l[Y], L = n[Y], !l.hasOwnProperty(Y) || D === L || D == null && L == null || He(e, t, Y, D, l, L);
  }
  function Ah(e) {
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
  function jg() {
    if (typeof performance.getEntriesByType == "function") {
      for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), l = 0; l < n.length; l++) {
        var i = n[l], c = i.transferSize, f = i.initiatorType, x = i.duration;
        if (c && x && Ah(f)) {
          for (f = 0, x = i.responseEnd, l += 1; l < n.length; l++) {
            var S = n[l], z = S.startTime;
            if (z > x) break;
            var $ = S.transferSize, Y = S.initiatorType;
            $ && Ah(Y) && (S = S.responseEnd, f += $ * (S < x ? 1 : (x - z) / (S - z)));
          }
          if (--l, t += 8 * (c + f) / (i.duration / 1e3), e++, 10 < e) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
  }
  var du = null, fu = null;
  function Ai(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function Rh(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function zh(e, t) {
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
  function hu(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var mu = null;
  function Sg() {
    var e = window.event;
    return e && e.type === "popstate" ? e === mu ? !1 : (mu = e, !0) : (mu = null, !1);
  }
  var Oh = typeof setTimeout == "function" ? setTimeout : void 0, wg = typeof clearTimeout == "function" ? clearTimeout : void 0, Dh = typeof Promise == "function" ? Promise : void 0, Ng = typeof queueMicrotask == "function" ? queueMicrotask : typeof Dh < "u" ? function(e) {
    return Dh.resolve(null).then(e).catch(Eg);
  } : Oh;
  function Eg(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function nl(e) {
    return e === "head";
  }
  function Hh(e, t) {
    var n = t, l = 0;
    do {
      var i = n.nextSibling;
      if (e.removeChild(n), i && i.nodeType === 8)
        if (n = i.data, n === "/$" || n === "/&") {
          if (l === 0) {
            e.removeChild(i), xa(t);
            return;
          }
          l--;
        } else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&")
          l++;
        else if (n === "html")
          rs(e.ownerDocument.documentElement);
        else if (n === "head") {
          n = e.ownerDocument.head, rs(n);
          for (var c = n.firstChild; c; ) {
            var f = c.nextSibling, x = c.nodeName;
            c[Ea] || x === "SCRIPT" || x === "STYLE" || x === "LINK" && c.rel.toLowerCase() === "stylesheet" || n.removeChild(c), c = f;
          }
        } else
          n === "body" && rs(e.ownerDocument.body);
      n = i;
    } while (n);
    xa(t);
  }
  function Lh(e, t) {
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
  function pu(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var n = t;
      switch (t = t.nextSibling, n.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          pu(n), _c(n);
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
  function Mg(e, t, n, l) {
    for (; e.nodeType === 1; ) {
      var i = n;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!l && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (l) {
        if (!e[Ea])
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
      if (e = Ft(e.nextSibling), e === null) break;
    }
    return null;
  }
  function kg(e, t, n) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = Ft(e.nextSibling), e === null)) return null;
    return e;
  }
  function Uh(e, t) {
    for (; e.nodeType !== 8; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = Ft(e.nextSibling), e === null)) return null;
    return e;
  }
  function vu(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function gu(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
  }
  function Cg(e, t) {
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
  function Ft(e) {
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
  var xu = null;
  function Bh(e) {
    e = e.nextSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === "/$" || n === "/&") {
          if (t === 0)
            return Ft(e.nextSibling);
          t--;
        } else
          n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function $h(e) {
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
  function Gh(e, t, n) {
    switch (t = Ai(n), e) {
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
  function rs(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    _c(e);
  }
  var Jt = /* @__PURE__ */ new Map(), qh = /* @__PURE__ */ new Set();
  function Ri(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var Tn = O.d;
  O.d = {
    f: Tg,
    r: Ag,
    D: Rg,
    C: zg,
    L: Og,
    m: Dg,
    X: Lg,
    S: Hg,
    M: Ug
  };
  function Tg() {
    var e = Tn.f(), t = Si();
    return e || t;
  }
  function Ag(e) {
    var t = Ll(e);
    t !== null && t.tag === 5 && t.type === "form" ? af(t) : Tn.r(e);
  }
  var pa = typeof document > "u" ? null : document;
  function Yh(e, t, n) {
    var l = pa;
    if (l && typeof t == "string" && t) {
      var i = qt(t);
      i = 'link[rel="' + e + '"][href="' + i + '"]', typeof n == "string" && (i += '[crossorigin="' + n + '"]'), qh.has(i) || (qh.add(i), e = { rel: e, crossOrigin: n, href: t }, l.querySelector(i) === null && (t = l.createElement("link"), ot(t, "link", e), at(t), l.head.appendChild(t)));
    }
  }
  function Rg(e) {
    Tn.D(e), Yh("dns-prefetch", e, null);
  }
  function zg(e, t) {
    Tn.C(e, t), Yh("preconnect", e, t);
  }
  function Og(e, t, n) {
    Tn.L(e, t, n);
    var l = pa;
    if (l && e && t) {
      var i = 'link[rel="preload"][as="' + qt(t) + '"]';
      t === "image" && n && n.imageSrcSet ? (i += '[imagesrcset="' + qt(
        n.imageSrcSet
      ) + '"]', typeof n.imageSizes == "string" && (i += '[imagesizes="' + qt(
        n.imageSizes
      ) + '"]')) : i += '[href="' + qt(e) + '"]';
      var c = i;
      switch (t) {
        case "style":
          c = va(e);
          break;
        case "script":
          c = ga(e);
      }
      Jt.has(c) || (e = _(
        {
          rel: "preload",
          href: t === "image" && n && n.imageSrcSet ? void 0 : e,
          as: t
        },
        n
      ), Jt.set(c, e), l.querySelector(i) !== null || t === "style" && l.querySelector(us(c)) || t === "script" && l.querySelector(os(c)) || (t = l.createElement("link"), ot(t, "link", e), at(t), l.head.appendChild(t)));
    }
  }
  function Dg(e, t) {
    Tn.m(e, t);
    var n = pa;
    if (n && e) {
      var l = t && typeof t.as == "string" ? t.as : "script", i = 'link[rel="modulepreload"][as="' + qt(l) + '"][href="' + qt(e) + '"]', c = i;
      switch (l) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          c = ga(e);
      }
      if (!Jt.has(c) && (e = _({ rel: "modulepreload", href: e }, t), Jt.set(c, e), n.querySelector(i) === null)) {
        switch (l) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (n.querySelector(os(c)))
              return;
        }
        l = n.createElement("link"), ot(l, "link", e), at(l), n.head.appendChild(l);
      }
    }
  }
  function Hg(e, t, n) {
    Tn.S(e, t, n);
    var l = pa;
    if (l && e) {
      var i = Ul(l).hoistableStyles, c = va(e);
      t = t || "default";
      var f = i.get(c);
      if (!f) {
        var x = { loading: 0, preload: null };
        if (f = l.querySelector(
          us(c)
        ))
          x.loading = 5;
        else {
          e = _(
            { rel: "stylesheet", href: e, "data-precedence": t },
            n
          ), (n = Jt.get(c)) && bu(e, n);
          var S = f = l.createElement("link");
          at(S), ot(S, "link", e), S._p = new Promise(function(z, $) {
            S.onload = z, S.onerror = $;
          }), S.addEventListener("load", function() {
            x.loading |= 1;
          }), S.addEventListener("error", function() {
            x.loading |= 2;
          }), x.loading |= 4, zi(f, t, l);
        }
        f = {
          type: "stylesheet",
          instance: f,
          count: 1,
          state: x
        }, i.set(c, f);
      }
    }
  }
  function Lg(e, t) {
    Tn.X(e, t);
    var n = pa;
    if (n && e) {
      var l = Ul(n).hoistableScripts, i = ga(e), c = l.get(i);
      c || (c = n.querySelector(os(i)), c || (e = _({ src: e, async: !0 }, t), (t = Jt.get(i)) && _u(e, t), c = n.createElement("script"), at(c), ot(c, "link", e), n.head.appendChild(c)), c = {
        type: "script",
        instance: c,
        count: 1,
        state: null
      }, l.set(i, c));
    }
  }
  function Ug(e, t) {
    Tn.M(e, t);
    var n = pa;
    if (n && e) {
      var l = Ul(n).hoistableScripts, i = ga(e), c = l.get(i);
      c || (c = n.querySelector(os(i)), c || (e = _({ src: e, async: !0, type: "module" }, t), (t = Jt.get(i)) && _u(e, t), c = n.createElement("script"), at(c), ot(c, "link", e), n.head.appendChild(c)), c = {
        type: "script",
        instance: c,
        count: 1,
        state: null
      }, l.set(i, c));
    }
  }
  function Qh(e, t, n, l) {
    var i = (i = F.current) ? Ri(i) : null;
    if (!i) throw Error(u(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof n.precedence == "string" && typeof n.href == "string" ? (t = va(n.href), n = Ul(
          i
        ).hoistableStyles, l = n.get(t), l || (l = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, n.set(t, l)), l) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
          e = va(n.href);
          var c = Ul(
            i
          ).hoistableStyles, f = c.get(e);
          if (f || (i = i.ownerDocument || i, f = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, c.set(e, f), (c = i.querySelector(
            us(e)
          )) && !c._p && (f.instance = c, f.state.loading = 5), Jt.has(e) || (n = {
            rel: "preload",
            as: "style",
            href: n.href,
            crossOrigin: n.crossOrigin,
            integrity: n.integrity,
            media: n.media,
            hrefLang: n.hrefLang,
            referrerPolicy: n.referrerPolicy
          }, Jt.set(e, n), c || Bg(
            i,
            e,
            n,
            f.state
          ))), t && l === null)
            throw Error(u(528, ""));
          return f;
        }
        if (t && l !== null)
          throw Error(u(529, ""));
        return null;
      case "script":
        return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = ga(n), n = Ul(
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
  function va(e) {
    return 'href="' + qt(e) + '"';
  }
  function us(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function Vh(e) {
    return _({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function Bg(e, t, n, l) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? l.loading = 1 : (t = e.createElement("link"), l.preload = t, t.addEventListener("load", function() {
      return l.loading |= 1;
    }), t.addEventListener("error", function() {
      return l.loading |= 2;
    }), ot(t, "link", n), at(t), e.head.appendChild(t));
  }
  function ga(e) {
    return '[src="' + qt(e) + '"]';
  }
  function os(e) {
    return "script[async]" + e;
  }
  function Xh(e, t, n) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var l = e.querySelector(
            'style[data-href~="' + qt(n.href) + '"]'
          );
          if (l)
            return t.instance = l, at(l), l;
          var i = _({}, n, {
            "data-href": n.href,
            "data-precedence": n.precedence,
            href: null,
            precedence: null
          });
          return l = (e.ownerDocument || e).createElement(
            "style"
          ), at(l), ot(l, "style", i), zi(l, n.precedence, e), t.instance = l;
        case "stylesheet":
          i = va(n.href);
          var c = e.querySelector(
            us(i)
          );
          if (c)
            return t.state.loading |= 4, t.instance = c, at(c), c;
          l = Vh(n), (i = Jt.get(i)) && bu(l, i), c = (e.ownerDocument || e).createElement("link"), at(c);
          var f = c;
          return f._p = new Promise(function(x, S) {
            f.onload = x, f.onerror = S;
          }), ot(c, "link", l), t.state.loading |= 4, zi(c, n.precedence, e), t.instance = c;
        case "script":
          return c = ga(n.src), (i = e.querySelector(
            os(c)
          )) ? (t.instance = i, at(i), i) : (l = n, (i = Jt.get(c)) && (l = _({}, n), _u(l, i)), e = e.ownerDocument || e, i = e.createElement("script"), at(i), ot(i, "link", l), e.head.appendChild(i), t.instance = i);
        case "void":
          return null;
        default:
          throw Error(u(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (l = t.instance, t.state.loading |= 4, zi(l, n.precedence, e));
    return t.instance;
  }
  function zi(e, t, n) {
    for (var l = n.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), i = l.length ? l[l.length - 1] : null, c = i, f = 0; f < l.length; f++) {
      var x = l[f];
      if (x.dataset.precedence === t) c = x;
      else if (c !== i) break;
    }
    c ? c.parentNode.insertBefore(e, c.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
  }
  function bu(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function _u(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var Oi = null;
  function Zh(e, t, n) {
    if (Oi === null) {
      var l = /* @__PURE__ */ new Map(), i = Oi = /* @__PURE__ */ new Map();
      i.set(n, l);
    } else
      i = Oi, l = i.get(n), l || (l = /* @__PURE__ */ new Map(), i.set(n, l));
    if (l.has(e)) return l;
    for (l.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
      var c = n[i];
      if (!(c[Ea] || c[it] || e === "link" && c.getAttribute("rel") === "stylesheet") && c.namespaceURI !== "http://www.w3.org/2000/svg") {
        var f = c.getAttribute(t) || "";
        f = e + f;
        var x = l.get(f);
        x ? x.push(c) : l.set(f, [c]);
      }
    }
    return l;
  }
  function Kh(e, t, n) {
    e = e.ownerDocument || e, e.head.insertBefore(
      n,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function $g(e, t, n) {
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
  function Fh(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function Gg(e, t, n, l) {
    if (n.type === "stylesheet" && (typeof l.media != "string" || matchMedia(l.media).matches !== !1) && (n.state.loading & 4) === 0) {
      if (n.instance === null) {
        var i = va(l.href), c = t.querySelector(
          us(i)
        );
        if (c) {
          t = c._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = Di.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = c, at(c);
          return;
        }
        c = t.ownerDocument || t, l = Vh(l), (i = Jt.get(i)) && bu(l, i), c = c.createElement("link"), at(c);
        var f = c;
        f._p = new Promise(function(x, S) {
          f.onload = x, f.onerror = S;
        }), ot(c, "link", l), n.instance = c;
      }
      e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && (n.state.loading & 3) === 0 && (e.count++, n = Di.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
    }
  }
  var yu = 0;
  function qg(e, t) {
    return e.stylesheets && e.count === 0 && Li(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
      var l = setTimeout(function() {
        if (e.stylesheets && Li(e, e.stylesheets), e.unsuspend) {
          var c = e.unsuspend;
          e.unsuspend = null, c();
        }
      }, 6e4 + t);
      0 < e.imgBytes && yu === 0 && (yu = 62500 * jg());
      var i = setTimeout(
        function() {
          if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && Li(e, e.stylesheets), e.unsuspend)) {
            var c = e.unsuspend;
            e.unsuspend = null, c();
          }
        },
        (e.imgBytes > yu ? 50 : 800) + t
      );
      return e.unsuspend = n, function() {
        e.unsuspend = null, clearTimeout(l), clearTimeout(i);
      };
    } : null;
  }
  function Di() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) Li(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var Hi = null;
  function Li(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, Hi = /* @__PURE__ */ new Map(), t.forEach(Yg, e), Hi = null, Di.call(e));
  }
  function Yg(e, t) {
    if (!(t.state.loading & 4)) {
      var n = Hi.get(e);
      if (n) var l = n.get(null);
      else {
        n = /* @__PURE__ */ new Map(), Hi.set(e, n);
        for (var i = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), c = 0; c < i.length; c++) {
          var f = i[c];
          (f.nodeName === "LINK" || f.getAttribute("media") !== "not all") && (n.set(f.dataset.precedence, f), l = f);
        }
        l && n.set(null, l);
      }
      i = t.instance, f = i.getAttribute("data-precedence"), c = n.get(f) || l, c === l && n.set(null, i), n.set(f, i), this.count++, l = Di.bind(this), i.addEventListener("load", l), i.addEventListener("error", l), c ? c.parentNode.insertBefore(i, c.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
    }
  }
  var ds = {
    $$typeof: G,
    Provider: null,
    Consumer: null,
    _currentValue: Z,
    _currentValue2: Z,
    _threadCount: 0
  };
  function Qg(e, t, n, l, i, c, f, x, S) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = vc(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = vc(0), this.hiddenUpdates = vc(null), this.identifierPrefix = l, this.onUncaughtError = i, this.onCaughtError = c, this.onRecoverableError = f, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = S, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function Jh(e, t, n, l, i, c, f, x, S, z, $, Y) {
    return e = new Qg(
      e,
      t,
      n,
      f,
      S,
      z,
      $,
      Y,
      x
    ), t = 1, c === !0 && (t |= 24), c = Tt(3, null, null, t), e.current = c, c.stateNode = e, t = er(), t.refCount++, e.pooledCache = t, t.refCount++, c.memoizedState = {
      element: l,
      isDehydrated: n,
      cache: t
    }, ar(c), e;
  }
  function Wh(e) {
    return e ? (e = Kl, e) : Kl;
  }
  function Ph(e, t, n, l, i, c) {
    i = Wh(i), l.context === null ? l.context = i : l.pendingContext = i, l = Vn(t), l.payload = { element: n }, c = c === void 0 ? null : c, c !== null && (l.callback = c), n = Xn(e, l, t), n !== null && (wt(n, e, t), Ya(n, e, t));
  }
  function Ih(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function ju(e, t) {
    Ih(e, t), (e = e.alternate) && Ih(e, t);
  }
  function em(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = vl(e, 67108864);
      t !== null && wt(t, e, 67108864), ju(e, 67108864);
    }
  }
  function tm(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Dt();
      t = gc(t);
      var n = vl(e, t);
      n !== null && wt(n, e, t), ju(e, t);
    }
  }
  var Ui = !0;
  function Vg(e, t, n, l) {
    var i = T.T;
    T.T = null;
    var c = O.p;
    try {
      O.p = 2, Su(e, t, n, l);
    } finally {
      O.p = c, T.T = i;
    }
  }
  function Xg(e, t, n, l) {
    var i = T.T;
    T.T = null;
    var c = O.p;
    try {
      O.p = 8, Su(e, t, n, l);
    } finally {
      O.p = c, T.T = i;
    }
  }
  function Su(e, t, n, l) {
    if (Ui) {
      var i = wu(l);
      if (i === null)
        uu(
          e,
          t,
          l,
          Bi,
          n
        ), lm(e, l);
      else if (Kg(
        i,
        e,
        t,
        n,
        l
      ))
        l.stopPropagation();
      else if (lm(e, l), t & 4 && -1 < Zg.indexOf(e)) {
        for (; i !== null; ) {
          var c = Ll(i);
          if (c !== null)
            switch (c.tag) {
              case 3:
                if (c = c.stateNode, c.current.memoizedState.isDehydrated) {
                  var f = dl(c.pendingLanes);
                  if (f !== 0) {
                    var x = c;
                    for (x.pendingLanes |= 2, x.entangledLanes |= 2; f; ) {
                      var S = 1 << 31 - kt(f);
                      x.entanglements[1] |= S, f &= ~S;
                    }
                    cn(c), (Te & 6) === 0 && (yi = Et() + 500, ss(0));
                  }
                }
                break;
              case 31:
              case 13:
                x = vl(c, 2), x !== null && wt(x, c, 2), Si(), ju(c, 2);
            }
          if (c = wu(l), c === null && uu(
            e,
            t,
            l,
            Bi,
            n
          ), c === i) break;
          i = c;
        }
        i !== null && l.stopPropagation();
      } else
        uu(
          e,
          t,
          l,
          null,
          n
        );
    }
  }
  function wu(e) {
    return e = Ec(e), Nu(e);
  }
  var Bi = null;
  function Nu(e) {
    if (Bi = null, e = Hl(e), e !== null) {
      var t = h(e);
      if (t === null) e = null;
      else {
        var n = t.tag;
        if (n === 13) {
          if (e = p(t), e !== null) return e;
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
    return Bi = e, null;
  }
  function nm(e) {
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
        switch (Rp()) {
          case ro:
            return 2;
          case uo:
            return 8;
          case ks:
          case zp:
            return 32;
          case oo:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Eu = !1, ll = null, al = null, sl = null, fs = /* @__PURE__ */ new Map(), hs = /* @__PURE__ */ new Map(), il = [], Zg = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function lm(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        ll = null;
        break;
      case "dragenter":
      case "dragleave":
        al = null;
        break;
      case "mouseover":
      case "mouseout":
        sl = null;
        break;
      case "pointerover":
      case "pointerout":
        fs.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        hs.delete(t.pointerId);
    }
  }
  function ms(e, t, n, l, i, c) {
    return e === null || e.nativeEvent !== c ? (e = {
      blockedOn: t,
      domEventName: n,
      eventSystemFlags: l,
      nativeEvent: c,
      targetContainers: [i]
    }, t !== null && (t = Ll(t), t !== null && em(t)), e) : (e.eventSystemFlags |= l, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
  }
  function Kg(e, t, n, l, i) {
    switch (t) {
      case "focusin":
        return ll = ms(
          ll,
          e,
          t,
          n,
          l,
          i
        ), !0;
      case "dragenter":
        return al = ms(
          al,
          e,
          t,
          n,
          l,
          i
        ), !0;
      case "mouseover":
        return sl = ms(
          sl,
          e,
          t,
          n,
          l,
          i
        ), !0;
      case "pointerover":
        var c = i.pointerId;
        return fs.set(
          c,
          ms(
            fs.get(c) || null,
            e,
            t,
            n,
            l,
            i
          )
        ), !0;
      case "gotpointercapture":
        return c = i.pointerId, hs.set(
          c,
          ms(
            hs.get(c) || null,
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
  function am(e) {
    var t = Hl(e.target);
    if (t !== null) {
      var n = h(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = p(n), t !== null) {
            e.blockedOn = t, go(e.priority, function() {
              tm(n);
            });
            return;
          }
        } else if (t === 31) {
          if (t = b(n), t !== null) {
            e.blockedOn = t, go(e.priority, function() {
              tm(n);
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
  function $i(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = wu(e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var l = new n.constructor(
          n.type,
          n
        );
        Nc = l, n.target.dispatchEvent(l), Nc = null;
      } else
        return t = Ll(n), t !== null && em(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function sm(e, t, n) {
    $i(e) && n.delete(t);
  }
  function Fg() {
    Eu = !1, ll !== null && $i(ll) && (ll = null), al !== null && $i(al) && (al = null), sl !== null && $i(sl) && (sl = null), fs.forEach(sm), hs.forEach(sm);
  }
  function Gi(e, t) {
    e.blockedOn === t && (e.blockedOn = null, Eu || (Eu = !0, a.unstable_scheduleCallback(
      a.unstable_NormalPriority,
      Fg
    )));
  }
  var qi = null;
  function im(e) {
    qi !== e && (qi = e, a.unstable_scheduleCallback(
      a.unstable_NormalPriority,
      function() {
        qi === e && (qi = null);
        for (var t = 0; t < e.length; t += 3) {
          var n = e[t], l = e[t + 1], i = e[t + 2];
          if (typeof l != "function") {
            if (Nu(l || n) === null)
              continue;
            break;
          }
          var c = Ll(n);
          c !== null && (e.splice(t, 3), t -= 3, wr(
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
  function xa(e) {
    function t(S) {
      return Gi(S, e);
    }
    ll !== null && Gi(ll, e), al !== null && Gi(al, e), sl !== null && Gi(sl, e), fs.forEach(t), hs.forEach(t);
    for (var n = 0; n < il.length; n++) {
      var l = il[n];
      l.blockedOn === e && (l.blockedOn = null);
    }
    for (; 0 < il.length && (n = il[0], n.blockedOn === null); )
      am(n), n.blockedOn === null && il.shift();
    if (n = (e.ownerDocument || e).$$reactFormReplay, n != null)
      for (l = 0; l < n.length; l += 3) {
        var i = n[l], c = n[l + 1], f = i[xt] || null;
        if (typeof c == "function")
          f || im(n);
        else if (f) {
          var x = null;
          if (c && c.hasAttribute("formAction")) {
            if (i = c, f = c[xt] || null)
              x = f.formAction;
            else if (Nu(i) !== null) continue;
          } else x = f.action;
          typeof x == "function" ? n[l + 1] = x : (n.splice(l, 3), l -= 3), im(n);
        }
      }
  }
  function cm() {
    function e(c) {
      c.canIntercept && c.info === "react-transition" && c.intercept({
        handler: function() {
          return new Promise(function(f) {
            return i = f;
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
  function Mu(e) {
    this._internalRoot = e;
  }
  Yi.prototype.render = Mu.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(u(409));
    var n = t.current, l = Dt();
    Ph(n, l, e, t, null, null);
  }, Yi.prototype.unmount = Mu.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      Ph(e.current, 2, null, e, null, null), Si(), t[Dl] = null;
    }
  };
  function Yi(e) {
    this._internalRoot = e;
  }
  Yi.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = vo();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < il.length && t !== 0 && t < il[n].priority; n++) ;
      il.splice(n, 0, e), n === 0 && am(e);
    }
  };
  var rm = r.version;
  if (rm !== "19.2.8")
    throw Error(
      u(
        527,
        rm,
        "19.2.8"
      )
    );
  O.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(u(188)) : (e = Object.keys(e).join(","), Error(u(268, e)));
    return e = g(t), e = e !== null ? v(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var Jg = {
    bundleType: 0,
    version: "19.2.8",
    rendererPackageName: "react-dom",
    currentDispatcherRef: T,
    reconcilerVersion: "19.2.8"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Qi = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Qi.isDisabled && Qi.supportsFiber)
      try {
        Sa = Qi.inject(
          Jg
        ), Mt = Qi;
      } catch {
      }
  }
  return vs.createRoot = function(e, t) {
    if (!d(e)) throw Error(u(299));
    var n = !1, l = "", i = pf, c = vf, f = gf;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (l = t.identifierPrefix), t.onUncaughtError !== void 0 && (i = t.onUncaughtError), t.onCaughtError !== void 0 && (c = t.onCaughtError), t.onRecoverableError !== void 0 && (f = t.onRecoverableError)), t = Jh(
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
      f,
      cm
    ), e[Dl] = t.current, ru(e), new Mu(t);
  }, vs.hydrateRoot = function(e, t, n) {
    if (!d(e)) throw Error(u(299));
    var l = !1, i = "", c = pf, f = vf, x = gf, S = null;
    return n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onUncaughtError !== void 0 && (c = n.onUncaughtError), n.onCaughtError !== void 0 && (f = n.onCaughtError), n.onRecoverableError !== void 0 && (x = n.onRecoverableError), n.formState !== void 0 && (S = n.formState)), t = Jh(
      e,
      1,
      !0,
      t,
      n ?? null,
      l,
      i,
      S,
      c,
      f,
      x,
      cm
    ), t.context = Wh(null), n = t.current, l = Dt(), l = gc(l), i = Vn(l), i.callback = null, Xn(n, i, l), n = l, t.current.lanes = n, Na(t, n), cn(t), e[Dl] = t.current, ru(e), new Yi(t);
  }, vs.version = "19.2.8", vs;
}
var xm;
function r0() {
  if (xm) return Tu.exports;
  xm = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (r) {
        console.error(r);
      }
  }
  return a(), Tu.exports = c0(), Tu.exports;
}
var u0 = r0();
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
var Vu = /^(?:[a-z][a-z0-9+.-]*:|[\\/]{2})/i, Ym = /^[\\/]{2}/;
function o0(a, r) {
  return r + a.replace(/\\/g, "/");
}
var bm = "popstate";
function _m(a) {
  return typeof a == "object" && a != null && "pathname" in a && "search" in a && "hash" in a && "state" in a && "key" in a;
}
function d0(a = {}) {
  function r(d, h) {
    let {
      pathname: p = "/",
      search: b = "",
      hash: m = ""
    } = zl(d.location.hash.substring(1));
    return !p.startsWith("/") && !p.startsWith(".") && (p = "/" + p), Bu(
      "",
      { pathname: p, search: b, hash: m },
      // state defaults to `null` because `window.history.state` does
      h.state && h.state.usr || null,
      h.state && h.state.key || "default"
    );
  }
  function o(d, h) {
    let p = d.document.querySelector("base"), b = "";
    if (p && p.getAttribute("href")) {
      let m = d.location.href, g = m.indexOf("#");
      b = g === -1 ? m : m.slice(0, g);
    }
    return b + "#" + (typeof h == "string" ? h : js(h));
  }
  function u(d, h) {
    Lt(
      d.pathname.charAt(0) === "/",
      `relative pathnames are not supported in hash history.push(${JSON.stringify(
        h
      )})`
    );
  }
  return h0(
    r,
    o,
    u,
    a
  );
}
function Ve(a, r) {
  if (a === !1 || a === null || typeof a > "u")
    throw new Error(r);
}
function Lt(a, r) {
  if (!a) {
    typeof console < "u" && console.warn(r);
    try {
      throw new Error(r);
    } catch {
    }
  }
}
function f0() {
  return Math.random().toString(36).substring(2, 10);
}
function ym(a, r) {
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
function Bu(a, r, o = null, u, d) {
  return {
    pathname: typeof a == "string" ? a : a.pathname,
    search: "",
    hash: "",
    ...typeof r == "string" ? zl(r) : r,
    state: o,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: r && r.key || u || f0(),
    mask: d
  };
}
function js({
  pathname: a = "/",
  search: r = "",
  hash: o = ""
}) {
  return r && r !== "?" && (a += r.charAt(0) === "?" ? r : "?" + r), o && o !== "#" && (a += o.charAt(0) === "#" ? o : "#" + o), a;
}
function zl(a) {
  let r = {};
  if (a) {
    let o = a.indexOf("#");
    o >= 0 && (r.hash = a.substring(o), a = a.substring(0, o));
    let u = a.indexOf("?");
    u >= 0 && (r.search = a.substring(u), a = a.substring(0, u)), a && (r.pathname = a);
  }
  return r;
}
function h0(a, r, o, u = {}) {
  let { window: d = document.defaultView, v5Compat: h = !1 } = u, p = d.history, b = "POP", m = null, g = v();
  g == null && (g = 0, p.replaceState({ ...p.state, idx: g }, ""));
  function v() {
    return (p.state || { idx: null }).idx;
  }
  function _() {
    b = "POP";
    let k = v(), B = k == null ? null : k - g;
    g = k, m && m({ action: b, location: A.location, delta: B });
  }
  function j(k, B) {
    b = "PUSH";
    let P = _m(k) ? k : Bu(A.location, k, B);
    o && o(P, k), g = v() + 1;
    let G = ym(P, g), ne = A.createHref(P.mask || P);
    try {
      p.pushState(G, "", ne);
    } catch (le) {
      if (le instanceof DOMException && le.name === "DataCloneError")
        throw le;
      d.location.assign(ne);
    }
    h && m && m({ action: b, location: A.location, delta: 1 });
  }
  function w(k, B) {
    b = "REPLACE";
    let P = _m(k) ? k : Bu(A.location, k, B);
    o && o(P, k), g = v();
    let G = ym(P, g), ne = A.createHref(P.mask || P);
    p.replaceState(G, "", ne), h && m && m({ action: b, location: A.location, delta: 0 });
  }
  function M(k) {
    return m0(d, k);
  }
  let A = {
    get action() {
      return b;
    },
    get location() {
      return a(d, p);
    },
    listen(k) {
      if (m)
        throw new Error("A history only accepts one active listener");
      return d.addEventListener(bm, _), m = k, () => {
        d.removeEventListener(bm, _), m = null;
      };
    },
    createHref(k) {
      return r(d, k);
    },
    createURL: M,
    encodeLocation(k) {
      let B = M(k);
      return {
        pathname: B.pathname,
        search: B.search,
        hash: B.hash
      };
    },
    push: j,
    replace: w,
    go(k) {
      return p.go(k);
    }
  };
  return A;
}
function m0(a, r, o = !1) {
  let u = "http://localhost";
  a && (u = a.location.origin !== "null" ? a.location.origin : a.location.href), Ve(u, "No window.location.(origin|href) available to create URL");
  let d = typeof r == "string" ? r : js(r);
  return d = d.replace(/ $/, "%20"), !o && Ym.test(d) && (d = u + d), new URL(d, u);
}
function Qm(a, r, o = "/") {
  return p0(a, r, o, !1);
}
function p0(a, r, o, u, d) {
  let h = typeof r == "string" ? zl(r) : r, p = zn(h.pathname || "/", o);
  if (p == null)
    return null;
  let b = v0(a), m = null, g = M0(p);
  for (let v = 0; m == null && v < b.length; ++v)
    m = E0(
      b[v],
      g,
      u
    );
  return m;
}
function v0(a) {
  let r = Vm(a);
  return g0(r), r;
}
function Vm(a, r = [], o = [], u = "", d = !1) {
  let h = (p, b, m = d, g) => {
    let v = {
      relativePath: g === void 0 ? p.path || "" : g,
      caseSensitive: p.caseSensitive === !0,
      childrenIndex: b,
      route: p
    };
    if (v.relativePath.startsWith("/")) {
      if (!v.relativePath.startsWith(u) && m)
        return;
      Ve(
        v.relativePath.startsWith(u),
        `Absolute route path "${v.relativePath}" nested under path "${u}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
      ), v.relativePath = v.relativePath.slice(u.length);
    }
    let _ = tn([u, v.relativePath]), j = o.concat(v);
    p.children && p.children.length > 0 && (Ve(
      // Our types know better, but runtime JS may not!
      // @ts-expect-error
      p.index !== !0,
      `Index routes must not have child routes. Please remove all child routes from route path "${_}".`
    ), Vm(
      p.children,
      r,
      j,
      _,
      m
    )), !(p.path == null && !p.index) && r.push({
      path: _,
      score: w0(_, p.index),
      routesMeta: j.map((w, M) => {
        let [A, k] = Km(
          w.relativePath,
          w.caseSensitive,
          M === j.length - 1
        );
        return {
          ...w,
          matcher: A,
          compiledParams: k
        };
      })
    });
  };
  return a.forEach((p, b) => {
    if (p.path === "" || !p.path?.includes("?"))
      h(p, b);
    else
      for (let m of Xm(p.path))
        h(p, b, !0, m);
  }), r;
}
function Xm(a) {
  let r = a.split("/");
  if (r.length === 0) return [];
  let [o, ...u] = r, d = o.endsWith("?"), h = o.replace(/\?$/, "");
  if (u.length === 0)
    return d ? [h, ""] : [h];
  let p = Xm(u.join("/")), b = [];
  return b.push(
    ...p.map(
      (m) => m === "" ? h : [h, m].join("/")
    )
  ), d && b.push(...p), b.map(
    (m) => a.startsWith("/") && m === "" ? "/" : m
  );
}
function g0(a) {
  a.sort(
    (r, o) => r.score !== o.score ? o.score - r.score : N0(
      r.routesMeta.map((u) => u.childrenIndex),
      o.routesMeta.map((u) => u.childrenIndex)
    )
  );
}
var x0 = /^:[\w-]+$/, b0 = 3, _0 = 2, y0 = 1, j0 = 10, S0 = -2, jm = (a) => a === "*";
function w0(a, r) {
  let o = a.split("/"), u = o.length;
  return o.some(jm) && (u += S0), r && (u += _0), o.filter((d) => !jm(d)).reduce(
    (d, h) => d + (x0.test(h) ? b0 : h === "" ? y0 : j0),
    u
  );
}
function N0(a, r) {
  return a.length === r.length && a.slice(0, -1).every((u, d) => u === r[d]) ? (
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
function E0(a, r, o = !1) {
  let { routesMeta: u } = a, d = {}, h = "/", p = [];
  for (let b = 0; b < u.length; ++b) {
    let m = u[b], g = b === u.length - 1, v = h === "/" ? r : r.slice(h.length) || "/", _ = {
      path: m.relativePath,
      caseSensitive: m.caseSensitive,
      end: g
    }, j = (
      // Use precomputed matcher if it exists
      m.matcher && m.compiledParams ? Zm(
        _,
        v,
        m.matcher,
        m.compiledParams
      ) : tc(_, v)
    ), w = m.route;
    if (!j && g && o && !u[u.length - 1].route.index && (j = tc(
      {
        path: m.relativePath,
        caseSensitive: m.caseSensitive,
        end: !1
      },
      v
    )), !j)
      return null;
    Object.assign(d, j.params), p.push({
      // TODO: Can this as be avoided?
      params: d,
      pathname: tn([h, j.pathname]),
      pathnameBase: T0(
        tn([h, j.pathnameBase])
      ),
      route: w
    }), j.pathnameBase !== "/" && (h = tn([h, j.pathnameBase]));
  }
  return p;
}
function tc(a, r) {
  typeof a == "string" && (a = { path: a, caseSensitive: !1, end: !0 });
  let [o, u] = Km(
    a.path,
    a.caseSensitive,
    a.end
  );
  return Zm(a, r, o, u);
}
function Zm(a, r, o, u) {
  let d = r.match(o);
  if (!d) return null;
  let h = d[0], p = h.replace(/(.)\/+$/, "$1"), b = d.slice(1);
  return {
    params: u.reduce(
      (g, { paramName: v, isOptional: _ }, j) => {
        if (v === "*") {
          let M = b[j] || "";
          p = h.slice(0, h.length - M.length).replace(/(.)\/+$/, "$1");
        }
        const w = b[j];
        return _ && !w ? g[v] = void 0 : g[v] = (w || "").replace(/%2F/g, "/"), g;
      },
      {}
    ),
    pathname: h,
    pathnameBase: p,
    pattern: a
  };
}
function Km(a, r = !1, o = !0) {
  Lt(
    a === "*" || !a.endsWith("*") || a.endsWith("/*"),
    `Route path "${a}" will be treated as if it were "${a.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${a.replace(/\*$/, "/*")}".`
  );
  let u = [], d = "^" + a.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(
    /\/:([\w-]+)(\?)?/g,
    (p, b, m, g, v) => {
      if (u.push({ paramName: b, isOptional: m != null }), m) {
        let _ = v.charAt(g + p.length);
        return _ && _ !== "/" ? "/([^\\/]*)" : "(?:/([^\\/]*))?";
      }
      return "/([^\\/]+)";
    }
  ).replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
  return a.endsWith("*") ? (u.push({ paramName: "*" }), d += a === "*" || a === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$") : o ? d += "\\/*$" : a !== "" && a !== "/" && (d += "(?:(?=\\/|$))"), [new RegExp(d, r ? void 0 : "i"), u];
}
function M0(a) {
  try {
    return a.split("/").map((r) => decodeURIComponent(r).replace(/\//g, "%2F")).join("/");
  } catch (r) {
    return Lt(
      !1,
      `The URL path "${a}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${r}).`
    ), a;
  }
}
function zn(a, r) {
  if (r === "/") return a;
  if (!a.toLowerCase().startsWith(r.toLowerCase()))
    return null;
  let o = r.endsWith("/") ? r.length - 1 : r.length, u = a.charAt(o);
  return u && u !== "/" ? null : a.slice(o) || "/";
}
function k0(a, r = "/") {
  let {
    pathname: o,
    search: u = "",
    hash: d = ""
  } = typeof a == "string" ? zl(a) : a, h;
  return o ? (o = Fm(o), o.startsWith("/") ? h = Sm(o.substring(1), "/") : h = Sm(o, r)) : h = r, {
    pathname: h,
    search: A0(u),
    hash: R0(d)
  };
}
function Sm(a, r) {
  let o = nc(r).split("/");
  return a.split("/").forEach((d) => {
    d === ".." ? o.length > 1 && o.pop() : d !== "." && o.push(d);
  }), o.length > 1 ? o.join("/") : "/";
}
function Ou(a, r, o, u) {
  return `Cannot include a '${a}' character in a manually specified \`to.${r}\` field [${JSON.stringify(
    u
  )}].  Please separate it out to the \`to.${o}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function C0(a) {
  return a.filter(
    (r, o) => o === 0 || r.route.path && r.route.path.length > 0
  );
}
function Xu(a) {
  let r = C0(a);
  return r.map(
    (o, u) => u === r.length - 1 ? o.pathname : o.pathnameBase
  );
}
function ac(a, r, o, u = !1) {
  let d;
  typeof a == "string" ? d = zl(a) : (d = { ...a }, Ve(
    !d.pathname || !d.pathname.includes("?"),
    Ou("?", "pathname", "search", d)
  ), Ve(
    !d.pathname || !d.pathname.includes("#"),
    Ou("#", "pathname", "hash", d)
  ), Ve(
    !d.search || !d.search.includes("#"),
    Ou("#", "search", "hash", d)
  ));
  let h = a === "" || d.pathname === "", p = h ? "/" : d.pathname, b;
  if (p == null)
    b = o;
  else {
    let _ = r.length - 1;
    if (!u && p.startsWith("..")) {
      let j = p.split("/");
      for (; j[0] === ".."; )
        j.shift(), _ -= 1;
      d.pathname = j.join("/");
    }
    b = _ >= 0 ? r[_] : "/";
  }
  let m = k0(d, b), g = p && p !== "/" && p.endsWith("/"), v = (h || p === ".") && o.endsWith("/");
  return !m.pathname.endsWith("/") && (g || v) && (m.pathname += "/"), m;
}
var Fm = (a) => a.replace(/[\\/]{2,}/g, "/"), tn = (a) => Fm(a.join("/")), nc = (a) => a.replace(/\/+$/, ""), T0 = (a) => nc(a).replace(/^\/*/, "/"), A0 = (a) => !a || a === "?" ? "" : a.startsWith("?") ? a : "?" + a, R0 = (a) => !a || a === "#" ? "" : a.startsWith("#") ? a : "#" + a, z0 = class {
  constructor(a, r, o, u = !1) {
    this.status = a, this.statusText = r || "", this.internal = u, o instanceof Error ? (this.data = o.toString(), this.error = o) : this.data = o;
  }
};
function O0(a) {
  return a != null && typeof a.status == "number" && typeof a.statusText == "string" && typeof a.internal == "boolean" && "data" in a;
}
function D0(a) {
  let r = a.map((o) => o.route.path).filter(Boolean);
  return tn(r) || "/";
}
var Jm = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
function Wm(a, r) {
  let o = a;
  if (typeof o != "string" || !Vu.test(o))
    return {
      absoluteURL: void 0,
      isExternal: !1,
      to: o
    };
  let u = o, d = !1;
  if (Jm)
    try {
      let h = new URL(window.location.href), p = Ym.test(o) ? new URL(o0(o, h.protocol)) : new URL(o), b = zn(p.pathname, r);
      p.origin === h.origin && b != null ? o = b + p.search + p.hash : d = !0;
    } catch {
      Lt(
        !1,
        `<Link to="${o}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`
      );
    }
  return {
    absoluteURL: u,
    isExternal: d,
    to: o
  };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
var Pm = [
  "POST",
  "PUT",
  "PATCH",
  "DELETE"
];
new Set(
  Pm
);
var H0 = [
  "GET",
  ...Pm
];
new Set(H0);
var L0 = [
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
function U0(a) {
  try {
    return L0.includes(new URL(a).protocol);
  } catch {
    return !1;
  }
}
var ba = y.createContext(null);
ba.displayName = "DataRouter";
var sc = y.createContext(null);
sc.displayName = "DataRouterState";
var Im = y.createContext(!1);
function B0() {
  return y.useContext(Im);
}
var ep = y.createContext({
  isTransitioning: !1
});
ep.displayName = "ViewTransition";
var $0 = y.createContext(
  /* @__PURE__ */ new Map()
);
$0.displayName = "Fetchers";
var G0 = y.createContext(null);
G0.displayName = "Await";
var Ut = y.createContext(
  null
);
Ut.displayName = "Navigation";
var ws = y.createContext(
  null
);
ws.displayName = "Location";
var fn = y.createContext({
  outlet: null,
  matches: [],
  isDataRoute: !1
});
fn.displayName = "Route";
var Zu = y.createContext(null);
Zu.displayName = "RouteError";
var tp = "REACT_ROUTER_ERROR", q0 = "REDIRECT", Y0 = "ROUTE_ERROR_RESPONSE";
function Q0(a) {
  if (a.startsWith(`${tp}:${q0}:{`))
    try {
      let r = JSON.parse(a.slice(28));
      if (typeof r == "object" && r && typeof r.status == "number" && typeof r.statusText == "string" && typeof r.location == "string" && typeof r.reloadDocument == "boolean" && typeof r.replace == "boolean")
        return r;
    } catch {
    }
}
function V0(a) {
  if (a.startsWith(
    `${tp}:${Y0}:{`
  ))
    try {
      let r = JSON.parse(a.slice(40));
      if (typeof r == "object" && r && typeof r.status == "number" && typeof r.statusText == "string")
        return new z0(
          r.status,
          r.statusText,
          r.data
        );
    } catch {
    }
}
function X0(a, { relative: r } = {}) {
  Ve(
    _a(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useHref() may be used only in the context of a <Router> component."
  );
  let { basename: o, navigator: u } = y.useContext(Ut), { hash: d, pathname: h, search: p } = Ns(a, { relative: r }), b = h;
  return o !== "/" && (b = h === "/" ? o : tn([o, h])), u.createHref({ pathname: b, search: p, hash: d });
}
function _a() {
  return y.useContext(ws) != null;
}
function pt() {
  return Ve(
    _a(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useLocation() may be used only in the context of a <Router> component."
  ), y.useContext(ws).location;
}
var np = "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function lp(a) {
  y.useContext(Ut).static || y.useLayoutEffect(a);
}
function dt() {
  let { isDataRoute: a } = y.useContext(fn);
  return a ? sx() : Z0();
}
function Z0() {
  Ve(
    _a(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useNavigate() may be used only in the context of a <Router> component."
  );
  let a = y.useContext(ba), { basename: r, navigator: o } = y.useContext(Ut), { matches: u } = y.useContext(fn), { pathname: d } = pt(), h = JSON.stringify(Xu(u)), p = y.useRef(!1);
  return lp(() => {
    p.current = !0;
  }), y.useCallback(
    (m, g = {}) => {
      if (Lt(p.current, np), !p.current) return;
      if (typeof m == "number") {
        o.go(m);
        return;
      }
      let v = ac(
        m,
        JSON.parse(h),
        d,
        g.relative === "path"
      );
      a == null && r !== "/" && (v.pathname = v.pathname === "/" ? r : tn([r, v.pathname])), (g.replace ? o.replace : o.push)(
        v,
        g.state,
        g
      );
    },
    [
      r,
      o,
      h,
      d,
      a
    ]
  );
}
y.createContext(null);
function Ns(a, { relative: r } = {}) {
  let { matches: o } = y.useContext(fn), { pathname: u } = pt(), d = JSON.stringify(Xu(o));
  return y.useMemo(
    () => ac(
      a,
      JSON.parse(d),
      u,
      r === "path"
    ),
    [a, d, u, r]
  );
}
function K0(a, r) {
  return ap(a, r);
}
function ap(a, r, o) {
  Ve(
    _a(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useRoutes() may be used only in the context of a <Router> component."
  );
  let { navigator: u } = y.useContext(Ut), { matches: d } = y.useContext(fn), h = d[d.length - 1], p = h ? h.params : {}, b = h ? h.pathname : "/", m = h ? h.pathnameBase : "/", g = h && h.route;
  {
    let k = g && g.path || "";
    ip(
      b,
      !g || k.endsWith("*") || k.endsWith("*?"),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${b}" (under <Route path="${k}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${k}"> to <Route path="${k === "/" ? "*" : `${k}/*`}">.`
    );
  }
  let v = pt(), _;
  if (r) {
    let k = typeof r == "string" ? zl(r) : r;
    Ve(
      m === "/" || k.pathname?.startsWith(m),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${m}" but pathname "${k.pathname}" was given in the \`location\` prop.`
    ), _ = k;
  } else
    _ = v;
  let j = _.pathname || "/", w = j;
  if (m !== "/") {
    let k = m.replace(/^\//, "").split("/");
    w = "/" + j.replace(/^\//, "").split("/").slice(k.length).join("/");
  }
  let M = o && o.state.matches.length ? (
    // If we're in a data router, use the matches we've already identified but ensure
    // we have the latest route instances from the manifest in case elements have changed
    o.state.matches.map(
      (k) => Object.assign(k, {
        route: o.manifest[k.route.id] || k.route
      })
    )
  ) : Qm(a, { pathname: w });
  Lt(
    g || M != null,
    `No routes matched location "${_.pathname}${_.search}${_.hash}" `
  ), Lt(
    M == null || M[M.length - 1].route.element !== void 0 || M[M.length - 1].route.Component !== void 0 || M[M.length - 1].route.lazy !== void 0,
    `Matched leaf route at location "${_.pathname}${_.search}${_.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`
  );
  let A = I0(
    M && M.map(
      (k) => Object.assign({}, k, {
        params: Object.assign({}, p, k.params),
        pathname: tn([
          m,
          // Re-encode pathnames that were decoded inside matchRoutes.
          // Pre-encode `%`, `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          u.encodeLocation ? u.encodeLocation(
            k.pathname.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : k.pathname
        ]),
        pathnameBase: k.pathnameBase === "/" ? m : tn([
          m,
          // Re-encode pathnames that were decoded inside matchRoutes
          // Pre-encode `%`, `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          u.encodeLocation ? u.encodeLocation(
            k.pathnameBase.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : k.pathnameBase
        ])
      })
    ),
    d,
    o
  );
  return r && A ? /* @__PURE__ */ y.createElement(
    ws.Provider,
    {
      value: {
        location: {
          pathname: "/",
          search: "",
          hash: "",
          state: null,
          key: "default",
          mask: void 0,
          ..._
        },
        navigationType: "POP"
        /* Pop */
      }
    },
    A
  ) : A;
}
function F0() {
  let a = ax(), r = O0(a) ? `${a.status} ${a.statusText}` : a instanceof Error ? a.message : JSON.stringify(a), o = a instanceof Error ? a.stack : null, u = "rgba(200,200,200, 0.5)", d = { padding: "0.5rem", backgroundColor: u }, h = { padding: "2px 4px", backgroundColor: u }, p = null;
  return console.error(
    "Error handled by React Router default ErrorBoundary:",
    a
  ), p = /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("p", null, "💿 Hey developer 👋"), /* @__PURE__ */ y.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /* @__PURE__ */ y.createElement("code", { style: h }, "ErrorBoundary"), " or", " ", /* @__PURE__ */ y.createElement("code", { style: h }, "errorElement"), " prop on your route.")), /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ y.createElement("h3", { style: { fontStyle: "italic" } }, r), o ? /* @__PURE__ */ y.createElement("pre", { style: d }, o) : null, p);
}
var J0 = /* @__PURE__ */ y.createElement(F0, null), sp = class extends y.Component {
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
      const o = V0(a.digest);
      o && (a = o);
    }
    let r = a !== void 0 ? /* @__PURE__ */ y.createElement(fn.Provider, { value: this.props.routeContext }, /* @__PURE__ */ y.createElement(
      Zu.Provider,
      {
        value: a,
        children: this.props.component
      }
    )) : this.props.children;
    return this.context ? /* @__PURE__ */ y.createElement(W0, { error: a }, r) : r;
  }
};
sp.contextType = Im;
var Du = /* @__PURE__ */ new WeakMap();
function W0({
  children: a,
  error: r
}) {
  let { basename: o } = y.useContext(Ut);
  if (typeof r == "object" && r && "digest" in r && typeof r.digest == "string") {
    let u = Q0(r.digest);
    if (u) {
      let d = Du.get(r);
      if (d) throw d;
      let h = Wm(u.location, o), p = h.absoluteURL || h.to;
      if (U0(p))
        throw new Error("Invalid redirect location");
      if (Jm && !Du.get(r))
        if (h.isExternal || u.reloadDocument)
          window.location.href = p;
        else {
          const b = Promise.resolve().then(
            () => window.__reactRouterDataRouter.navigate(h.to, {
              replace: u.replace
            })
          );
          throw Du.set(r, b), b;
        }
      return /* @__PURE__ */ y.createElement("meta", { httpEquiv: "refresh", content: `0;url=${p}` });
    }
  }
  return a;
}
function P0({ routeContext: a, match: r, children: o }) {
  let u = y.useContext(ba);
  return u && u.static && u.staticContext && (r.route.errorElement || r.route.ErrorBoundary) && (u.staticContext._deepestRenderedBoundaryId = r.route.id), /* @__PURE__ */ y.createElement(fn.Provider, { value: a }, o);
}
function I0(a, r = [], o) {
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
  let d = a, h = u?.errors;
  if (h != null) {
    let v = d.findIndex(
      (_) => _.route.id && h?.[_.route.id] !== void 0
    );
    Ve(
      v >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(
        h
      ).join(",")}`
    ), d = d.slice(
      0,
      Math.min(d.length, v + 1)
    );
  }
  let p = !1, b = -1;
  if (o && u) {
    p = u.renderFallback;
    for (let v = 0; v < d.length; v++) {
      let _ = d[v];
      if ((_.route.HydrateFallback || _.route.hydrateFallbackElement) && (b = v), _.route.id) {
        let { loaderData: j, errors: w } = u, M = _.route.loader && !j.hasOwnProperty(_.route.id) && (!w || w[_.route.id] === void 0);
        if (_.route.lazy || M) {
          o.isStatic && (p = !0), b >= 0 ? d = d.slice(0, b + 1) : d = [d[0]];
          break;
        }
      }
    }
  }
  let m = o?.onError, g = u && m ? (v, _) => {
    m(v, {
      location: u.location,
      params: u.matches?.[0]?.params ?? {},
      pattern: D0(u.matches),
      errorInfo: _
    });
  } : void 0;
  return d.reduceRight(
    (v, _, j) => {
      let w, M = !1, A = null, k = null;
      u && (w = h && _.route.id ? h[_.route.id] : void 0, A = _.route.errorElement || J0, p && (b < 0 && j === 0 ? (ip(
        "route-fallback",
        !1,
        "No `HydrateFallback` element provided to render during initial hydration"
      ), M = !0, k = null) : b === j && (M = !0, k = _.route.hydrateFallbackElement || null)));
      let B = r.concat(d.slice(0, j + 1)), P = () => {
        let G;
        return w ? G = A : M ? G = k : _.route.Component ? G = /* @__PURE__ */ y.createElement(_.route.Component, null) : _.route.element ? G = _.route.element : G = v, /* @__PURE__ */ y.createElement(
          P0,
          {
            match: _,
            routeContext: {
              outlet: v,
              matches: B,
              isDataRoute: u != null
            },
            children: G
          }
        );
      };
      return u && (_.route.ErrorBoundary || _.route.errorElement || j === 0) ? /* @__PURE__ */ y.createElement(
        sp,
        {
          location: u.location,
          revalidation: u.revalidation,
          component: A,
          error: w,
          children: P(),
          routeContext: { outlet: null, matches: B, isDataRoute: !0 },
          onError: g
        }
      ) : P();
    },
    null
  );
}
function Ku(a) {
  return `${a} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function ex(a) {
  let r = y.useContext(ba);
  return Ve(r, Ku(a)), r;
}
function tx(a) {
  let r = y.useContext(sc);
  return Ve(r, Ku(a)), r;
}
function nx(a) {
  let r = y.useContext(fn);
  return Ve(r, Ku(a)), r;
}
function Fu(a) {
  let r = nx(a), o = r.matches[r.matches.length - 1];
  return Ve(
    o.route.id,
    `${a} can only be used on routes that contain a unique "id"`
  ), o.route.id;
}
function lx() {
  return Fu(
    "useRouteId"
    /* UseRouteId */
  );
}
function ax() {
  let a = y.useContext(Zu), r = tx(
    "useRouteError"
    /* UseRouteError */
  ), o = Fu(
    "useRouteError"
    /* UseRouteError */
  );
  return a !== void 0 ? a : r.errors?.[o];
}
function sx() {
  let { router: a } = ex(
    "useNavigate"
    /* UseNavigateStable */
  ), r = Fu(
    "useNavigate"
    /* UseNavigateStable */
  ), o = y.useRef(!1);
  return lp(() => {
    o.current = !0;
  }), y.useCallback(
    async (d, h = {}) => {
      Lt(o.current, np), o.current && (typeof d == "number" ? await a.navigate(d) : await a.navigate(d, { fromRouteId: r, ...h }));
    },
    [a, r]
  );
}
var wm = {};
function ip(a, r, o) {
  !r && !wm[a] && (wm[a] = !0, Lt(!1, o));
}
y.memo(ix);
function ix({
  routes: a,
  manifest: r,
  future: o,
  state: u,
  isStatic: d,
  onError: h
}) {
  return ap(a, void 0, {
    manifest: r,
    state: u,
    isStatic: d,
    onError: h
  });
}
function _s({
  to: a,
  replace: r,
  state: o,
  relative: u
}) {
  Ve(
    _a(),
    // TODO: This error is probably because they somehow have 2 versions of
    // the router loaded. We can help them understand how to avoid that.
    "<Navigate> may be used only in the context of a <Router> component."
  );
  let { static: d } = y.useContext(Ut);
  Lt(
    !d,
    "<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change."
  );
  let { matches: h } = y.useContext(fn), { pathname: p } = pt(), b = dt(), m = ac(
    a,
    Xu(h),
    p,
    u === "path"
  ), g = JSON.stringify(m);
  return y.useEffect(() => {
    b(JSON.parse(g), { replace: r, state: o, relative: u });
  }, [b, g, u, r, o]), null;
}
function $e(a) {
  Ve(
    !1,
    "A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>."
  );
}
function cx({
  basename: a = "/",
  children: r = null,
  location: o,
  navigationType: u = "POP",
  navigator: d,
  static: h = !1,
  useTransitions: p
}) {
  Ve(
    !_a(),
    "You cannot render a <Router> inside another <Router>. You should never have more than one in your app."
  );
  let b = a.replace(/^\/*/, "/"), m = y.useMemo(
    () => ({
      basename: b,
      navigator: d,
      static: h,
      useTransitions: p,
      future: {}
    }),
    [b, d, h, p]
  );
  typeof o == "string" && (o = zl(o));
  let {
    pathname: g = "/",
    search: v = "",
    hash: _ = "",
    state: j = null,
    key: w = "default",
    mask: M
  } = o, A = y.useMemo(() => {
    let k = zn(g, b);
    return k == null ? null : {
      location: {
        pathname: k,
        search: v,
        hash: _,
        state: j,
        key: w,
        mask: M
      },
      navigationType: u
    };
  }, [b, g, v, _, j, w, u, M]);
  return Lt(
    A != null,
    `<Router basename="${b}"> is not able to match the URL "${g}${v}${_}" because it does not start with the basename, so the <Router> won't render anything.`
  ), A == null ? null : /* @__PURE__ */ y.createElement(Ut.Provider, { value: m }, /* @__PURE__ */ y.createElement(ws.Provider, { children: r, value: A }));
}
function rx({
  children: a,
  location: r
}) {
  return K0($u(a), r);
}
function $u(a, r = []) {
  let o = [];
  return y.Children.forEach(a, (u, d) => {
    if (!y.isValidElement(u))
      return;
    let h = [...r, d];
    if (u.type === y.Fragment) {
      o.push.apply(
        o,
        $u(u.props.children, h)
      );
      return;
    }
    Ve(
      u.type === $e,
      `[${typeof u.type == "string" ? u.type : u.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`
    ), Ve(
      !u.props.index || !u.props.children,
      "An index route cannot have child routes."
    );
    let p = {
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
    u.props.children && (p.children = $u(
      u.props.children,
      h
    )), o.push(p);
  }), o;
}
var Wi = "get", Pi = "application/x-www-form-urlencoded";
function ic(a) {
  return typeof HTMLElement < "u" && a instanceof HTMLElement;
}
function ux(a) {
  return ic(a) && a.tagName.toLowerCase() === "button";
}
function ox(a) {
  return ic(a) && a.tagName.toLowerCase() === "form";
}
function dx(a) {
  return ic(a) && a.tagName.toLowerCase() === "input";
}
function fx(a) {
  return !!(a.metaKey || a.altKey || a.ctrlKey || a.shiftKey);
}
function hx(a, r) {
  return a.button === 0 && // Ignore everything but left clicks
  (!r || r === "_self") && // Let browser handle "target=_blank" etc.
  !fx(a);
}
function Gu(a = "") {
  return new URLSearchParams(
    typeof a == "string" || Array.isArray(a) || a instanceof URLSearchParams ? a : Object.keys(a).reduce((r, o) => {
      let u = a[o];
      return r.concat(
        Array.isArray(u) ? u.map((d) => [o, d]) : [[o, u]]
      );
    }, [])
  );
}
function mx(a, r) {
  let o = Gu(a);
  return r && r.forEach((u, d) => {
    o.has(d) || r.getAll(d).forEach((h) => {
      o.append(d, h);
    });
  }), o;
}
var Xi = null;
function px() {
  if (Xi === null)
    try {
      new FormData(
        document.createElement("form"),
        // @ts-expect-error if FormData supports the submitter parameter, this will throw
        0
      ), Xi = !1;
    } catch {
      Xi = !0;
    }
  return Xi;
}
var vx = /* @__PURE__ */ new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
]);
function Hu(a) {
  return a != null && !vx.has(a) ? (Lt(
    !1,
    `"${a}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${Pi}"`
  ), null) : a;
}
function gx(a, r) {
  let o, u, d, h, p;
  if (ox(a)) {
    let b = a.getAttribute("action");
    u = b ? zn(b, r) : null, o = a.getAttribute("method") || Wi, d = Hu(a.getAttribute("enctype")) || Pi, h = new FormData(a);
  } else if (ux(a) || dx(a) && (a.type === "submit" || a.type === "image")) {
    let b = a.form;
    if (b == null)
      throw new Error(
        'Cannot submit a <button> or <input type="submit"> without a <form>'
      );
    let m = a.getAttribute("formaction") || b.getAttribute("action");
    if (u = m ? zn(m, r) : null, o = a.getAttribute("formmethod") || b.getAttribute("method") || Wi, d = Hu(a.getAttribute("formenctype")) || Hu(b.getAttribute("enctype")) || Pi, h = new FormData(b, a), !px()) {
      let { name: g, type: v, value: _ } = a;
      if (v === "image") {
        let j = g ? `${g}.` : "";
        h.append(`${j}x`, "0"), h.append(`${j}y`, "0");
      } else g && h.append(g, _);
    }
  } else {
    if (ic(a))
      throw new Error(
        'Cannot submit element that is not <form>, <button>, or <input type="submit|image">'
      );
    o = Wi, u = null, d = Pi, p = a;
  }
  return h && d === "text/plain" && (p = h, h = void 0), { action: u, method: o.toLowerCase(), encType: d, formData: h, body: p };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function Ju(a, r) {
  if (a === !1 || a === null || typeof a > "u")
    throw new Error(r);
}
function cp(a, r, o, u) {
  let d = typeof a == "string" ? new URL(
    a,
    // This can be called during the SSR flow via PrefetchPageLinksImpl so
    // don't assume window is available
    typeof window > "u" ? "server://singlefetch/" : window.location.origin
  ) : a;
  return o ? d.pathname.endsWith("/") ? d.pathname = `${d.pathname}_.${u}` : d.pathname = `${d.pathname}.${u}` : d.pathname === "/" ? d.pathname = `_root.${u}` : r && zn(d.pathname, r) === "/" ? d.pathname = `${nc(r)}/_root.${u}` : d.pathname = `${nc(d.pathname)}.${u}`, d;
}
async function xx(a, r) {
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
function bx(a) {
  return a == null ? !1 : a.href == null ? a.rel === "preload" && typeof a.imageSrcSet == "string" && typeof a.imageSizes == "string" : typeof a.rel == "string" && typeof a.href == "string";
}
async function _x(a, r, o) {
  let u = await Promise.all(
    a.map(async (d) => {
      let h = r.routes[d.route.id];
      if (h) {
        let p = await xx(h, o);
        return p.links ? p.links() : [];
      }
      return [];
    })
  );
  return wx(
    u.flat(1).filter(bx).filter((d) => d.rel === "stylesheet" || d.rel === "preload").map(
      (d) => d.rel === "stylesheet" ? { ...d, rel: "prefetch", as: "style" } : { ...d, rel: "prefetch" }
    )
  );
}
function Nm(a, r, o, u, d, h) {
  let p = (m, g) => o[g] ? m.route.id !== o[g].route.id : !0, b = (m, g) => (
    // param change, /users/123 -> /users/456
    o[g].pathname !== m.pathname || // splat param changed, which is not present in match.path
    // e.g. /files/images/avatar.jpg -> files/finances.xls
    o[g].route.path?.endsWith("*") && o[g].params["*"] !== m.params["*"]
  );
  return h === "assets" ? r.filter(
    (m, g) => p(m, g) || b(m, g)
  ) : h === "data" ? r.filter((m, g) => {
    let v = u.routes[m.route.id];
    if (!v || !v.hasLoader)
      return !1;
    if (p(m, g) || b(m, g))
      return !0;
    if (m.route.shouldRevalidate) {
      let _ = m.route.shouldRevalidate({
        currentUrl: new URL(
          d.pathname + d.search + d.hash,
          window.origin
        ),
        currentParams: o[0]?.params || {},
        nextUrl: new URL(a, window.origin),
        nextParams: m.params,
        defaultShouldRevalidate: !0
      });
      if (typeof _ == "boolean")
        return _;
    }
    return !0;
  }) : [];
}
function yx(a, r, { includeHydrateFallback: o } = {}) {
  return jx(
    a.map((u) => {
      let d = r.routes[u.route.id];
      if (!d) return [];
      let h = [d.module];
      return d.clientActionModule && (h = h.concat(d.clientActionModule)), d.clientLoaderModule && (h = h.concat(d.clientLoaderModule)), o && d.hydrateFallbackModule && (h = h.concat(d.hydrateFallbackModule)), d.imports && (h = h.concat(d.imports)), h;
    }).flat(1)
  );
}
function jx(a) {
  return [...new Set(a)];
}
function Sx(a) {
  let r = {}, o = Object.keys(a).sort();
  for (let u of o)
    r[u] = a[u];
  return r;
}
function wx(a, r) {
  let o = /* @__PURE__ */ new Set();
  return new Set(r), a.reduce((u, d) => {
    let h = JSON.stringify(Sx(d));
    return o.has(h) || (o.add(h), u.push({ key: h, link: d })), u;
  }, []);
}
function Wu() {
  let a = y.useContext(ba);
  return Ju(
    a,
    "You must render this element inside a <DataRouterContext.Provider> element"
  ), a;
}
function Nx() {
  let a = y.useContext(sc);
  return Ju(
    a,
    "You must render this element inside a <DataRouterStateContext.Provider> element"
  ), a;
}
var Pu = y.createContext(void 0);
Pu.displayName = "FrameworkContext";
function cc() {
  let a = y.useContext(Pu);
  return Ju(
    a,
    "You must render this element inside a <HydratedRouter> element"
  ), a;
}
function Ex(a, r) {
  let o = y.useContext(Pu), [u, d] = y.useState(!1), [h, p] = y.useState(!1), { onFocus: b, onBlur: m, onMouseEnter: g, onMouseLeave: v, onTouchStart: _ } = r, j = y.useRef(null);
  y.useEffect(() => {
    if (a === "render" && p(!0), a === "viewport") {
      let A = (B) => {
        B.forEach((P) => {
          p(P.isIntersecting);
        });
      }, k = new IntersectionObserver(A, { threshold: 0.5 });
      return j.current && k.observe(j.current), () => {
        k.disconnect();
      };
    }
  }, [a]), y.useEffect(() => {
    if (u) {
      let A = setTimeout(() => {
        p(!0);
      }, 100);
      return () => {
        clearTimeout(A);
      };
    }
  }, [u]);
  let w = () => {
    d(!0);
  }, M = () => {
    d(!1), p(!1);
  };
  return o ? a !== "intent" ? [h, j, {}] : [
    h,
    j,
    {
      onFocus: gs(b, w),
      onBlur: gs(m, M),
      onMouseEnter: gs(g, w),
      onMouseLeave: gs(v, M),
      onTouchStart: gs(_, w)
    }
  ] : [!1, j, {}];
}
function gs(a, r) {
  return (o) => {
    a && a(o), o.defaultPrevented || r(o);
  };
}
function Mx({ page: a, ...r }) {
  let o = B0(), { nonce: u } = cc(), { router: d } = Wu(), h = y.useMemo(
    () => Qm(d.routes, a, d.basename),
    [d.routes, a, d.basename]
  );
  return h ? (r.nonce == null && u && (r = { ...r, nonce: u }), o ? /* @__PURE__ */ y.createElement(Cx, { page: a, matches: h, ...r }) : /* @__PURE__ */ y.createElement(Tx, { page: a, matches: h, ...r })) : null;
}
function kx(a) {
  let { manifest: r, routeModules: o } = cc(), [u, d] = y.useState([]);
  return y.useEffect(() => {
    let h = !1;
    return _x(a, r, o).then(
      (p) => {
        h || d(p);
      }
    ), () => {
      h = !0;
    };
  }, [a, r, o]), u;
}
function Cx({
  page: a,
  matches: r,
  ...o
}) {
  let u = pt(), { future: d } = cc(), { basename: h } = Wu(), p = y.useMemo(() => {
    if (a === u.pathname + u.search + u.hash)
      return [];
    let b = cp(
      a,
      h,
      d.v8_trailingSlashAwareDataRequests,
      "rsc"
    ), m = !1, g = [];
    for (let v of r)
      typeof v.route.shouldRevalidate == "function" ? m = !0 : g.push(v.route.id);
    return m && g.length > 0 && b.searchParams.set("_routes", g.join(",")), [b.pathname + b.search];
  }, [
    h,
    d.v8_trailingSlashAwareDataRequests,
    a,
    u,
    r
  ]);
  return /* @__PURE__ */ y.createElement(y.Fragment, null, p.map((b) => /* @__PURE__ */ y.createElement("link", { key: b, rel: "prefetch", as: "fetch", href: b, ...o })));
}
function Tx({
  page: a,
  matches: r,
  ...o
}) {
  let u = pt(), { future: d, manifest: h, routeModules: p } = cc(), { basename: b } = Wu(), { loaderData: m, matches: g } = Nx(), v = y.useMemo(
    () => Nm(
      a,
      r,
      g,
      h,
      u,
      "data"
    ),
    [a, r, g, h, u]
  ), _ = y.useMemo(
    () => Nm(
      a,
      r,
      g,
      h,
      u,
      "assets"
    ),
    [a, r, g, h, u]
  ), j = y.useMemo(() => {
    if (a === u.pathname + u.search + u.hash)
      return [];
    let A = /* @__PURE__ */ new Set(), k = !1;
    if (r.forEach((P) => {
      let G = h.routes[P.route.id];
      !G || !G.hasLoader || (!v.some((ne) => ne.route.id === P.route.id) && P.route.id in m && p[P.route.id]?.shouldRevalidate || G.hasClientLoader ? k = !0 : A.add(P.route.id));
    }), A.size === 0)
      return [];
    let B = cp(
      a,
      b,
      d.v8_trailingSlashAwareDataRequests,
      "data"
    );
    return k && A.size > 0 && B.searchParams.set(
      "_routes",
      r.filter((P) => A.has(P.route.id)).map((P) => P.route.id).join(",")
    ), [B.pathname + B.search];
  }, [
    b,
    d.v8_trailingSlashAwareDataRequests,
    m,
    u,
    h,
    v,
    r,
    a,
    p
  ]), w = y.useMemo(
    () => yx(_, h),
    [_, h]
  ), M = kx(_);
  return /* @__PURE__ */ y.createElement(y.Fragment, null, j.map((A) => /* @__PURE__ */ y.createElement("link", { key: A, rel: "prefetch", as: "fetch", href: A, ...o })), w.map((A) => /* @__PURE__ */ y.createElement("link", { key: A, rel: "modulepreload", href: A, ...o })), M.map(({ key: A, link: k }) => (
    // these don't spread `linkProps` because they are full link descriptors
    // already with their own props
    /* @__PURE__ */ y.createElement(
      "link",
      {
        key: A,
        nonce: o.nonce,
        ...k,
        crossOrigin: k.crossOrigin ?? o.crossOrigin
      }
    )
  )));
}
function Ax(...a) {
  return (r) => {
    a.forEach((o) => {
      typeof o == "function" ? o(r) : o != null && (o.current = r);
    });
  };
}
var Rx = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
try {
  Rx && (window.__reactRouterVersion = // @ts-expect-error
  "7.18.2");
} catch {
}
function zx({
  basename: a,
  children: r,
  useTransitions: o,
  window: u
}) {
  let d = y.useRef();
  d.current == null && (d.current = d0({ window: u, v5Compat: !0 }));
  let h = d.current, [p, b] = y.useState({
    action: h.action,
    location: h.location
  }), m = y.useCallback(
    (g) => {
      o === !1 ? b(g) : y.startTransition(() => b(g));
    },
    [o]
  );
  return y.useLayoutEffect(() => h.listen(m), [h, m]), /* @__PURE__ */ y.createElement(
    cx,
    {
      basename: a,
      children: r,
      location: p.location,
      navigationType: p.action,
      navigator: h,
      useTransitions: o
    }
  );
}
var Ss = y.forwardRef(
  function({
    onClick: r,
    discover: o = "render",
    prefetch: u = "none",
    relative: d,
    reloadDocument: h,
    replace: p,
    mask: b,
    state: m,
    target: g,
    to: v,
    preventScrollReset: _,
    viewTransition: j,
    defaultShouldRevalidate: w,
    ...M
  }, A) {
    let { basename: k, navigator: B, useTransitions: P } = y.useContext(Ut), G = typeof v == "string" && Vu.test(v), ne = Wm(v, k);
    v = ne.to;
    let le = X0(v, { relative: d }), X = pt(), W = null;
    if (b) {
      let K = ac(
        b,
        [],
        X.mask ? X.mask.pathname : "/",
        !0
      );
      k !== "/" && (K.pathname = K.pathname === "/" ? k : tn([k, K.pathname])), W = B.createHref(K);
    }
    let [ce, he, we] = Ex(
      u,
      M
    ), xe = Hx(v, {
      replace: p,
      mask: b,
      state: m,
      target: g,
      preventScrollReset: _,
      relative: d,
      viewTransition: j,
      defaultShouldRevalidate: w,
      useTransitions: P
    });
    function ge(K) {
      r && r(K), K.defaultPrevented || xe(K);
    }
    let H = !(ne.isExternal || h), V = (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      /* @__PURE__ */ y.createElement(
        "a",
        {
          ...M,
          ...we,
          href: (H ? W : void 0) || ne.absoluteURL || le,
          onClick: H ? ge : r,
          ref: Ax(A, he),
          target: g,
          "data-discover": !G && o === "render" ? "true" : void 0
        }
      )
    );
    return ce && !G ? /* @__PURE__ */ y.createElement(y.Fragment, null, V, /* @__PURE__ */ y.createElement(Mx, { page: le })) : V;
  }
);
Ss.displayName = "Link";
var Ii = y.forwardRef(
  function({
    "aria-current": r = "page",
    caseSensitive: o = !1,
    className: u = "",
    end: d = !1,
    style: h,
    to: p,
    viewTransition: b,
    children: m,
    ...g
  }, v) {
    let _ = Ns(p, { relative: g.relative }), j = pt(), w = y.useContext(sc), { navigator: M, basename: A } = y.useContext(Ut), k = w != null && // Conditional usage is OK here because the usage of a data router is static
    // eslint-disable-next-line react-hooks/rules-of-hooks
    Gx(_) && b === !0, B = M.encodeLocation ? M.encodeLocation(_).pathname : _.pathname, P = j.pathname, G = w && w.navigation && w.navigation.location ? w.navigation.location.pathname : null;
    o || (P = P.toLowerCase(), G = G ? G.toLowerCase() : null, B = B.toLowerCase()), G && A && (G = zn(G, A) || G);
    const ne = B !== "/" && B.endsWith("/") ? B.length - 1 : B.length;
    let le = P === B || !d && P.startsWith(B) && P.charAt(ne) === "/", X = G != null && (G === B || !d && G.startsWith(B) && G.charAt(B.length) === "/"), W = {
      isActive: le,
      isPending: X,
      isTransitioning: k
    }, ce = le ? r : void 0, he;
    typeof u == "function" ? he = u(W) : he = [
      u,
      le ? "active" : null,
      X ? "pending" : null,
      k ? "transitioning" : null
    ].filter(Boolean).join(" ");
    let we = typeof h == "function" ? h(W) : h;
    return /* @__PURE__ */ y.createElement(
      Ss,
      {
        ...g,
        "aria-current": ce,
        className: he,
        ref: v,
        style: we,
        to: p,
        viewTransition: b
      },
      typeof m == "function" ? m(W) : m
    );
  }
);
Ii.displayName = "NavLink";
var Ox = y.forwardRef(
  ({
    discover: a = "render",
    fetcherKey: r,
    navigate: o,
    reloadDocument: u,
    replace: d,
    state: h,
    method: p = Wi,
    action: b,
    onSubmit: m,
    relative: g,
    preventScrollReset: v,
    viewTransition: _,
    defaultShouldRevalidate: j,
    ...w
  }, M) => {
    let { useTransitions: A } = y.useContext(Ut), k = Bx(), B = $x(b, { relative: g }), P = p.toLowerCase() === "get" ? "get" : "post", G = typeof b == "string" && Vu.test(b), ne = (le) => {
      if (m && m(le), le.defaultPrevented) return;
      le.preventDefault();
      let X = le.nativeEvent.submitter, W = X?.getAttribute("formmethod") || p, ce = () => k(X || le.currentTarget, {
        fetcherKey: r,
        method: W,
        navigate: o,
        replace: d,
        state: h,
        relative: g,
        preventScrollReset: v,
        viewTransition: _,
        defaultShouldRevalidate: j
      });
      A && o !== !1 ? y.startTransition(() => ce()) : ce();
    };
    return /* @__PURE__ */ y.createElement(
      "form",
      {
        ref: M,
        method: P,
        action: B,
        onSubmit: u ? m : ne,
        ...w,
        "data-discover": !G && a === "render" ? "true" : void 0
      }
    );
  }
);
Ox.displayName = "Form";
function Dx(a) {
  return `${a} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function rp(a) {
  let r = y.useContext(ba);
  return Ve(r, Dx(a)), r;
}
function Hx(a, {
  target: r,
  replace: o,
  mask: u,
  state: d,
  preventScrollReset: h,
  relative: p,
  viewTransition: b,
  defaultShouldRevalidate: m,
  useTransitions: g
} = {}) {
  let v = dt(), _ = pt(), j = Ns(a, { relative: p });
  return y.useCallback(
    (w) => {
      if (hx(w, r)) {
        w.preventDefault();
        let M = o !== void 0 ? o : js(_) === js(j), A = () => v(a, {
          replace: M,
          mask: u,
          state: d,
          preventScrollReset: h,
          relative: p,
          viewTransition: b,
          defaultShouldRevalidate: m
        });
        g ? y.startTransition(() => A()) : A();
      }
    },
    [
      _,
      v,
      j,
      o,
      u,
      d,
      r,
      a,
      h,
      p,
      b,
      m,
      g
    ]
  );
}
function rc(a) {
  Lt(
    typeof URLSearchParams < "u",
    "You cannot use the `useSearchParams` hook in a browser that does not support the URLSearchParams API. If you need to support Internet Explorer 11, we recommend you load a polyfill such as https://github.com/ungap/url-search-params."
  );
  let r = y.useRef(Gu(a)), o = y.useRef(!1), u = pt(), d = y.useMemo(
    () => (
      // Only merge in the defaults if we haven't yet called setSearchParams.
      // Once we call that we want those to take precedence, otherwise you can't
      // remove a param with setSearchParams({}) if it has an initial value
      mx(
        u.search,
        o.current ? null : r.current
      )
    ),
    [u.search]
  ), h = dt(), p = y.useCallback(
    (b, m) => {
      const g = Gu(
        typeof b == "function" ? b(new URLSearchParams(d)) : b
      );
      o.current = !0, h("?" + g, m);
    },
    [h, d]
  );
  return [d, p];
}
var Lx = 0, Ux = () => `__${String(++Lx)}__`;
function Bx() {
  let { router: a } = rp(
    "useSubmit"
    /* UseSubmit */
  ), { basename: r } = y.useContext(Ut), o = lx(), u = a.fetch, d = a.navigate;
  return y.useCallback(
    async (h, p = {}) => {
      let { action: b, method: m, encType: g, formData: v, body: _ } = gx(
        h,
        r
      );
      if (p.navigate === !1) {
        let j = p.fetcherKey || Ux();
        await u(j, o, p.action || b, {
          defaultShouldRevalidate: p.defaultShouldRevalidate,
          preventScrollReset: p.preventScrollReset,
          formData: v,
          body: _,
          formMethod: p.method || m,
          formEncType: p.encType || g,
          flushSync: p.flushSync
        });
      } else
        await d(p.action || b, {
          defaultShouldRevalidate: p.defaultShouldRevalidate,
          preventScrollReset: p.preventScrollReset,
          formData: v,
          body: _,
          formMethod: p.method || m,
          formEncType: p.encType || g,
          replace: p.replace,
          state: p.state,
          fromRouteId: o,
          flushSync: p.flushSync,
          viewTransition: p.viewTransition
        });
    },
    [u, d, r, o]
  );
}
function $x(a, { relative: r } = {}) {
  let { basename: o } = y.useContext(Ut), u = y.useContext(fn);
  Ve(u, "useFormAction must be used inside a RouteContext");
  let [d] = u.matches.slice(-1), h = { ...Ns(a || ".", { relative: r }) }, p = pt();
  if (a == null) {
    h.search = p.search;
    let b = new URLSearchParams(h.search), m = b.getAll("index");
    if (m.some((v) => v === "")) {
      b.delete("index"), m.filter((_) => _).forEach((_) => b.append("index", _));
      let v = b.toString();
      h.search = v ? `?${v}` : "";
    }
  }
  return (!a || a === ".") && d.route.index && (h.search = h.search ? h.search.replace(/^\?/, "?index&") : "?index"), o !== "/" && (h.pathname = h.pathname === "/" ? o : tn([o, h.pathname])), js(h);
}
function Gx(a, { relative: r } = {}) {
  let o = y.useContext(ep);
  Ve(
    o != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?"
  );
  let { basename: u } = rp(
    "useViewTransitionState"
    /* useViewTransitionState */
  ), d = Ns(a, { relative: r });
  if (!o.isTransitioning)
    return !1;
  let h = zn(o.currentLocation.pathname, u) || o.currentLocation.pathname, p = zn(o.nextLocation.pathname, u) || o.nextLocation.pathname;
  return tc(d.pathname, p) != null || tc(d.pathname, h) != null;
}
const qx = {
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
function Yx(a) {
  return qx[a];
}
const up = y.createContext(null), Qx = /* @__PURE__ */ new Set([
  "input_boolean",
  "input_number",
  "input_select",
  "input_text",
  "input_datetime",
  "input_button"
]);
function Vx(a) {
  if (!a) return !1;
  const r = a.toLowerCase(), o = r.indexOf("."), u = o >= 0 ? r.slice(0, o) : "", d = o >= 0 ? r.slice(o + 1) : r;
  return d.startsWith("dsc_") || d.startsWith("dsc-") || d.includes("_dsc_") || r.includes("dsc_") || r.includes("dsc-") ? !0 : Qx.has(u) ? d.startsWith("dsc_") || d.includes("dsc_") : r.startsWith("sensor.dsc") || r.startsWith("switch.dsc") || r.startsWith("binary_sensor.dsc") || r.startsWith("number.dsc") || r.startsWith("light.dsc") || r.startsWith("fan.dsc") || r.startsWith("select.dsc") || r.startsWith("text.dsc") || r.startsWith("datetime.dsc") || r.startsWith("time.dsc");
}
const Xx = 150;
function Zx({
  hass: a,
  children: r
}) {
  const [o, u] = y.useState(0), d = y.useRef(null), h = y.useRef(a);
  h.current = a;
  const p = () => {
    d.current || (d.current = setTimeout(() => {
      d.current = null, u((v) => v + 1);
    }, Xx));
  };
  y.useEffect(() => {
    if (!a) return;
    p();
    const v = a.connection;
    if (!v?.subscribeEvents) return;
    let _, j = !1;
    const w = (M) => {
      const A = M.data?.entity_id;
      Vx(A) && p();
    };
    return Promise.resolve(v.subscribeEvents(w, "state_changed")).then((M) => {
      if (j) {
        M();
        return;
      }
      _ = M;
    }).catch(() => {
    }), () => {
      j = !0, _?.(), d.current && (clearTimeout(d.current), d.current = null);
    };
  }, [a]);
  const b = y.useMemo(
    () => (v, _, j) => {
      const w = h.current;
      return w?.callService ? w.callService(v, _, j) : Promise.resolve(null);
    },
    []
  ), m = y.useMemo(
    () => (v) => {
      const _ = h.current;
      if (_?.callWS) return _.callWS(v);
      const j = _?.connection;
      return j?.sendMessagePromise ? j.sendMessagePromise(v) : Promise.resolve(null);
    },
    []
  ), g = y.useMemo(() => {
    const v = (M) => a?.states?.[M], _ = (M) => {
      const A = v(M)?.state;
      return !!A && A !== "unavailable" && A !== "unknown";
    }, j = (M, A = "—") => _(M) ? v(M)?.state ?? A : A;
    return { hass: a, entity: v, state: j, num: (M, A = NaN) => {
      const k = Number(j(M, ""));
      return Number.isFinite(k) ? k : A;
    }, available: _, callService: b, callWS: m, tick: o };
  }, [a, o, b, m]);
  return y.createElement(up.Provider, { value: g }, r);
}
function Ce() {
  const a = y.useContext(up);
  if (!a) throw new Error("useHass outside HassProvider");
  return a;
}
function dn({
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
      dangerouslySetInnerHTML: { __html: Yx(a) }
    }
  );
}
function re({
  title: a,
  children: r,
  className: o = "",
  style: u,
  icon: d
}) {
  return /* @__PURE__ */ s.jsxs("section", { className: `dsc-card ${o}`.trim(), style: u, children: [
    a ? /* @__PURE__ */ s.jsxs("h3", { className: "dsc-card-title", children: [
      d ? /* @__PURE__ */ s.jsx(dn, { name: d, size: 14, color: "var(--dsc-teal)" }) : null,
      a
    ] }) : null,
    r
  ] });
}
function oe({
  children: a,
  primary: r,
  teal: o,
  onClick: u,
  type: d = "button",
  disabled: h
}) {
  const p = ["dsc-btn"];
  return r && p.push("primary"), o && p.push("teal"), /* @__PURE__ */ s.jsx("button", { type: d, className: p.join(" "), onClick: u, disabled: h, children: a });
}
function Xe({
  label: a,
  value: r,
  unit: o,
  sub: u,
  tone: d = "normal",
  stale: h,
  onClick: p
}) {
  const b = (() => {
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
  })(), m = /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsxs("div", { className: `dsc-kpi-value ${b}`.trim(), children: [
      r,
      o ? /* @__PURE__ */ s.jsx("span", { className: "dsc-kpi-unit", children: o }) : null,
      h ? /* @__PURE__ */ s.jsx("span", { className: "dsc-held-tag", children: "HELD" }) : null
    ] }),
    u ? /* @__PURE__ */ s.jsx("div", { className: "dsc-kpi-sub", children: u }) : null
  ] });
  return p ? /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-kpi-hit", onClick: p, title: `History · ${a}`, children: /* @__PURE__ */ s.jsx(re, { title: a, className: h ? "is-stale" : void 0, children: m }) }) : /* @__PURE__ */ s.jsx(re, { title: a, className: h ? "is-stale" : void 0, children: m });
}
function Bt({
  title: a,
  subtitle: r,
  icon: o,
  primaryAction: u,
  actions: d
}) {
  const h = u || d ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-page-header-actions", children: [
    u,
    d
  ] }) : null;
  return /* @__PURE__ */ s.jsxs("header", { className: "dsc-page-header", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-page-header-main", children: [
      o ? /* @__PURE__ */ s.jsx(dn, { name: o, size: 22, color: "var(--dsc-teal)" }) : null,
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
    u ? /* @__PURE__ */ s.jsx(dn, { name: u, size: 11 }) : null,
    a
  ] });
}
function Re({
  entityId: a,
  label: r,
  warnWhenMissing: o,
  icon: u,
  showBrightness: d
}) {
  const { state: h, available: p, callService: b, entity: m } = Ce(), g = h(a, "off") === "on", v = p(a), _ = a.split(".")[0], j = () => {
    if (v) {
      if (_ === "switch" || _ === "input_boolean") {
        b("homeassistant", "toggle", { entity_id: a });
        return;
      }
      _ === "light" && b("light", g ? "turn_off" : "turn_on", { entity_id: a });
    }
  }, w = d !== !1 && _ === "light" && g ? Math.round(Number(m(a)?.attributes?.brightness ?? 0) / 255 * 100) : null;
  return /* @__PURE__ */ s.jsxs(
    "button",
    {
      type: "button",
      className: `dsc-demand${g ? " is-on" : ""}${v ? "" : " is-missing"}`,
      onClick: j,
      disabled: !v && !o,
      title: v ? a : o || `${a} unavailable`,
      children: [
        u ? /* @__PURE__ */ s.jsx(dn, { name: u, size: 22, color: "var(--dsc-teal)", className: "dsc-demand-icon" }) : null,
        /* @__PURE__ */ s.jsx("span", { className: "dsc-demand-label", children: r }),
        /* @__PURE__ */ s.jsx("span", { className: "dsc-demand-state", children: v ? w != null ? `${w}%` : g ? "ON" : "OFF" : o || "—" })
      ]
    }
  );
}
function Al({
  entityId: a,
  label: r,
  icon: o
}) {
  const { state: u, available: d, callService: h, entity: p } = Ce(), b = d(a), m = u(a, ""), g = p(a)?.attributes?.options || [], v = a.split(".")[0], [_, j] = y.useState(!1), [w, M] = y.useState(m);
  y.useEffect(() => {
    _ || M(m);
  }, [m, _]);
  const A = (B) => {
    M(B), j(!1), !(!b || !B) && (v === "select" ? h("select", "select_option", { entity_id: a, option: B }) : v === "input_select" && h("input_select", "select_option", { entity_id: a, option: B }));
  }, k = _ ? w : m;
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-entity-select${b ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ s.jsxs("span", { className: "dsc-entity-select-label", children: [
      o ? /* @__PURE__ */ s.jsx(dn, { name: o, size: 13, color: "var(--dsc-teal)" }) : null,
      r
    ] }),
    /* @__PURE__ */ s.jsxs(
      "select",
      {
        value: k,
        disabled: !b,
        onFocus: () => j(!0),
        onBlur: () => j(!1),
        onChange: (B) => A(B.target.value),
        children: [
          !g.includes(k) && k ? /* @__PURE__ */ s.jsx("option", { value: k, children: k }) : null,
          g.map((B) => /* @__PURE__ */ s.jsx("option", { value: B, children: B }, B))
        ]
      }
    )
  ] });
}
function rl({
  entityId: a,
  label: r,
  disabled: o
}) {
  const { available: u, callService: d, entity: h, state: p } = Ce(), b = u(a), m = Number(h(a)?.attributes?.percentage ?? 0), g = p(a) === "on", v = o || !b, [_, j] = y.useState(!1), [w, M] = y.useState(Number.isFinite(m) ? m : 0);
  y.useEffect(() => {
    !_ && Number.isFinite(m) && M(m);
  }, [m, _]);
  const A = (B) => {
    v || d("fan", "set_percentage", { entity_id: a, percentage: B });
  }, k = _ ? w : Number.isFinite(m) ? m : 0;
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-fan-slider${v ? " is-disabled" : ""}`, children: [
    /* @__PURE__ */ s.jsxs("span", { className: "dsc-fan-slider-label", children: [
      r,
      /* @__PURE__ */ s.jsx("strong", { children: b ? `${Math.round(k)}%` : "—" }),
      !g && b ? /* @__PURE__ */ s.jsx("em", { className: "dsc-muted", children: "off" }) : null
    ] }),
    /* @__PURE__ */ s.jsx(
      "input",
      {
        type: "range",
        min: 0,
        max: 100,
        step: 1,
        value: k,
        disabled: v,
        onPointerDown: (B) => {
          B.target.setPointerCapture(B.pointerId), j(!0);
        },
        onPointerUp: (B) => {
          j(!1), A(Number(B.target.value));
        },
        onPointerCancel: () => j(!1),
        onLostPointerCapture: () => j(!1),
        onChange: (B) => {
          const P = Number(B.target.value);
          M(P), _ || A(P);
        }
      }
    )
  ] });
}
function Iu(a) {
  return !a || a === "unknown" || a === "unavailable" ? "" : a;
}
function ec({
  entityId: a,
  label: r,
  multiline: o = !1,
  rows: u = 2
}) {
  const { available: d, callService: h, state: p } = Ce(), b = d(a), m = Iu(p(a, "")), [g, v] = y.useState(m), _ = y.useRef(!1);
  y.useEffect(() => {
    _.current || v(m);
  }, [m]);
  const j = () => {
    b && h("input_text", "set_value", { entity_id: a, value: g });
  }, w = {
    value: g,
    disabled: !b,
    onFocus: () => {
      _.current = !0;
    },
    onChange: (M) => v(M.target.value),
    onBlur: () => {
      _.current = !1, j();
    },
    onKeyDown: (M) => {
      M.key === "Enter" && !o && M.currentTarget.blur();
    }
  };
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-target-num${b ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ s.jsx("span", { className: "dsc-target-num-label", children: r }),
    o ? /* @__PURE__ */ s.jsx("textarea", { rows: u, ...w }) : /* @__PURE__ */ s.jsx("input", { type: "text", ...w })
  ] });
}
function Kx(a) {
  const r = Iu(a);
  return r ? r.slice(0, 5) : "";
}
function Fx(a) {
  return a ? a.length === 5 ? `${a}:00` : a : "00:00:00";
}
function Em({ entityId: a, label: r }) {
  const { available: o, callService: u, state: d } = Ce(), h = o(a), p = Kx(d(a, "")), [b, m] = y.useState(p), g = y.useRef(!1);
  y.useEffect(() => {
    g.current || m(p);
  }, [p]);
  const v = () => {
    !h || !b || u("time", "set_value", { entity_id: a, time: Fx(b) });
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
        onChange: (_) => m(_.target.value),
        onBlur: () => {
          g.current = !1, v();
        }
      }
    )
  ] });
}
function Jx({ entityId: a, label: r }) {
  const { available: o, callService: u, entity: d, state: h } = Ce(), p = o(a), b = !!d(a)?.attributes?.has_time, m = Iu(h(a, "")), g = (M) => M ? b ? M.slice(0, 16).replace(" ", "T") : M.slice(0, 10) : "", [v, _] = y.useState(g(m)), j = y.useRef(!1);
  y.useEffect(() => {
    j.current || _(g(m));
  }, [m, b]);
  const w = () => {
    if (!p || !v) return;
    const M = b ? v.replace("T", " ") : v;
    b ? u("input_datetime", "set_datetime", { entity_id: a, datetime: M }) : u("input_datetime", "set_datetime", { entity_id: a, date: v });
  };
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-target-num${p ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ s.jsx("span", { className: "dsc-target-num-label", children: r }),
    /* @__PURE__ */ s.jsx(
      "input",
      {
        type: b ? "datetime-local" : "date",
        value: v,
        disabled: !p,
        onFocus: () => {
          j.current = !0;
        },
        onChange: (M) => _(M.target.value),
        onBlur: () => {
          j.current = !1, w();
        }
      }
    )
  ] });
}
function ys({
  label: a,
  empty: r = !1,
  onClick: o
}) {
  const u = /* @__PURE__ */ s.jsx("span", { className: `dsc-result-chip${r ? " is-empty" : ""}`, children: /* @__PURE__ */ s.jsx("span", { children: a }) });
  return o ? /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-result-chip-hit", onClick: o, children: u }) : u;
}
function gt({
  open: a,
  onDismiss: r,
  onConfirm: o,
  title: u,
  confirmLabel: d = "Confirm",
  help: h,
  children: p
}) {
  const b = y.useId(), m = y.useRef(null), g = y.useRef(null);
  return y.useEffect(() => {
    if (!a) return;
    g.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, m.current?.querySelector("button, input, select, textarea, [href]")?.focus();
    const j = (w) => {
      w.key === "Escape" && (w.preventDefault(), r());
    };
    return window.addEventListener("keydown", j), () => {
      window.removeEventListener("keydown", j), g.current?.focus?.();
    };
  }, [a, r]), a ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-decision-root is-open", role: "presentation", children: [
    /* @__PURE__ */ s.jsx("div", { className: "dsc-decision-scrim", onClick: r }),
    /* @__PURE__ */ s.jsxs(
      "aside",
      {
        ref: m,
        className: "dsc-decision-panel",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": b,
        children: [
          /* @__PURE__ */ s.jsxs("header", { className: "dsc-decision-head", children: [
            /* @__PURE__ */ s.jsx("h2", { id: b, children: u }),
            /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-icon-btn", "aria-label": "Dismiss", onClick: r, children: /* @__PURE__ */ s.jsx(dn, { name: "close", size: 16 }) })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "dsc-decision-body", children: p }),
          h ? /* @__PURE__ */ s.jsx("div", { className: "dsc-decision-help", children: h }) : /* @__PURE__ */ s.jsx("div", { className: "dsc-decision-help is-empty" }),
          /* @__PURE__ */ s.jsxs("footer", { className: "dsc-decision-foot", children: [
            /* @__PURE__ */ s.jsx(oe, { onClick: r, children: "Dismiss" }),
            o ? /* @__PURE__ */ s.jsx(oe, { primary: !0, onClick: o, children: d }) : null
          ] })
        ]
      }
    )
  ] }) : null;
}
function Wx(a) {
  const r = [], o = (p, b = "unknown") => a.state(p, b), u = (p) => o(p) === "on", d = a.entity?.("sensor.dsc_keepup_gaps")?.attributes ?? {}, h = String(d.full_auto_honesty ?? "").trim();
  if (a.available && a.available("binary_sensor.dsc_hub_link") && !u("binary_sensor.dsc_hub_link") && r.push({
    id: "hub-link",
    label: "Hub link down",
    detail: "binary_sensor.dsc_hub_link is off — Mission/Fleet show HELD, not last-good animation.",
    tone: "bad",
    href: "/fleet",
    cta: "Open Fleet",
    priority: 9
  }), a.available && !a.available("sensor.dsc_hub_uptime")) {
    const p = a.entity?.("sensor.dsc_hub_uptime")?.last_changed;
    let b = "";
    if (p) {
      const m = Date.now() - Date.parse(p);
      if (Number.isFinite(m) && m >= 0) {
        const g = Math.floor(m / 6e4);
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
  }), r.sort((p, b) => p.priority - b.priority);
}
function Px(a) {
  return a[0] ?? null;
}
function op() {
  const a = Ce();
  return y.useMemo(
    () => Wx({
      state: a.state,
      available: a.available,
      entity: a.entity
    }),
    [a.state, a.available, a.entity, a.tick]
  );
}
function Ix({ gaps: a }) {
  const r = op(), o = a ?? r, [u, d] = y.useState(null), h = dt();
  return o.length ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsx("div", { className: "dsc-honesty-rail", "aria-label": "Honesty gaps", children: o.slice(0, 6).map((p) => /* @__PURE__ */ s.jsx(
      "button",
      {
        type: "button",
        className: "dsc-honesty-hit",
        onClick: () => d(p),
        children: /* @__PURE__ */ s.jsx(Q, { icon: "alert", label: p.label, tone: p.tone === "bad" ? "bad" : "warn" })
      },
      p.id
    )) }),
    /* @__PURE__ */ s.jsx(
      gt,
      {
        open: u != null,
        onDismiss: () => d(null),
        onConfirm: u ? () => {
          h(u.href), d(null);
        } : void 0,
        title: u?.label ?? "Honesty",
        confirmLabel: u?.cta ?? "Go",
        help: null,
        children: /* @__PURE__ */ s.jsx("p", { children: u?.detail })
      }
    )
  ] }) : /* @__PURE__ */ s.jsx("div", { className: "dsc-honesty-rail", "aria-label": "Honesty", children: /* @__PURE__ */ s.jsx(Q, { icon: "ok", label: "Kit honest", tone: "ok" }) });
}
function eb({ gaps: a }) {
  const r = op(), u = Px(a ?? r), d = dt();
  return u ? /* @__PURE__ */ s.jsxs(re, { className: "dsc-glass dsc-next-rec", title: "Do this next", icon: "alert", children: [
    /* @__PURE__ */ s.jsxs("p", { style: { margin: "0 0 8px" }, children: [
      /* @__PURE__ */ s.jsx("strong", { children: u.label }),
      " — ",
      u.detail
    ] }),
    /* @__PURE__ */ s.jsx(oe, { primary: !0, onClick: () => d(u.href), children: u.cta })
  ] }) : /* @__PURE__ */ s.jsxs(re, { className: "dsc-glass dsc-next-rec", title: "Next", icon: "ok", children: [
    /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: "No critical gaps — fly Live or open Twin." }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", children: [
      /* @__PURE__ */ s.jsx(oe, { primary: !0, onClick: () => d("/live/twin"), children: "Open Twin" }),
      /* @__PURE__ */ s.jsx(oe, { teal: !0, onClick: () => d("/live/climate"), children: "Climate Want" })
    ] })
  ] });
}
const Tl = "7.1.7-bar-raise", dp = [
  `/local/DSC-HUB.js?v=${Tl}`,
  `/hacsfiles/DSC-HUB/DSC-HUB.js?v=${Tl}`
], tb = {
  "dsc-catalog-browse-card": [`/local/dsc-catalog-browse-card.js?v=${Tl}`],
  "dsc-build-plant-card": [`/local/dsc-build-plant-card.js?v=${Tl}`],
  "dsc-the-dash-card": [`/local/dsc-the-dash-card.js?v=${Tl}`],
  "dsc-airflow-map-card": [`/local/dsc-airflow-map-card.js?v=${Tl}`],
  "dsc-system-map-card": [
    `/local/dsc-system-map-card.js?v=${Tl}`,
    ...dp
  ]
}, Zi = /* @__PURE__ */ new Map();
function Mm(a) {
  if (document.querySelector(`script[data-dsc-autoload="${a}"]`))
    return Zi.get(a) ?? Promise.resolve();
  if (Zi.has(a)) return Zi.get(a);
  const o = new Promise((u, d) => {
    const h = document.createElement("script");
    h.src = a, h.async = !0, h.dataset.dscAutoload = a, h.onload = () => u(), h.onerror = () => d(new Error(`Failed to load ${a}`)), document.head.appendChild(h);
  });
  return Zi.set(a, o), o;
}
async function nb(a, r = 12e3) {
  const o = tb[a] ?? [];
  for (const u of o)
    try {
      await Mm(u);
    } catch {
    }
  if (customElements.get(a)) return !0;
  for (const u of dp) {
    try {
      await Mm(u);
    } catch {
    }
    if (customElements.get(a)) return !0;
  }
  try {
    return await Promise.race([
      customElements.whenDefined(a),
      new Promise(
        (u, d) => window.setTimeout(() => d(new Error("timeout")), r)
      )
    ]), !!customElements.get(a);
  } catch {
    return !!customElements.get(a);
  }
}
const eo = [
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
], fp = new Map(eo.map((a) => [a.id, a])), Es = eo[2];
function qu(a) {
  return `input_select.dsc_pot${a}_vessel`;
}
function lb(a) {
  const r = String(a || "").trim();
  return fp.has(r) ? r : Es.id;
}
function Yu(a, r) {
  const o = fp.get(lb(a)) ?? Es;
  return Number.isFinite(r) && r > 0 ? { ...o, volumeL: r } : o;
}
function Rl(a, r, o) {
  const u = qu(a), d = r(u, "");
  if (d && d !== "unknown" && d !== "unavailable")
    return Yu(d);
  const h = o?.("sensor.dsc_plant_roster_summary")?.attributes?.slots;
  if (Array.isArray(h)) {
    const p = h.find((b) => String(b.pot) === String(a));
    if (p?.vessel) return Yu(p.vessel);
  }
  return Es;
}
function ab(a) {
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
const km = [
  "var(--dsc-soil-1)",
  "var(--dsc-soil-2)",
  "var(--dsc-soil-3)",
  "var(--dsc-soil-4)"
];
function Cm(a) {
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
function On({
  spec: a,
  layers: r = [],
  size: o = 56,
  label: u
}) {
  const d = `vclip-${a.id}-${a.silhouette}`, h = r.reduce((b, m) => b + m.pct, 0) || 1;
  let p = 0;
  return /* @__PURE__ */ s.jsxs("span", { className: "dsc-vessel-glyph", title: a.label, children: [
    /* @__PURE__ */ s.jsxs("svg", { width: o, height: o * 1.15, viewBox: "0 0 100 100", "aria-hidden": !0, children: [
      /* @__PURE__ */ s.jsx("defs", { children: /* @__PURE__ */ s.jsx("clipPath", { id: d, children: /* @__PURE__ */ s.jsx("path", { d: Cm(a.silhouette) }) }) }),
      /* @__PURE__ */ s.jsx(
        "path",
        {
          d: Cm(a.silhouette),
          fill: "rgba(8,12,10,0.85)",
          stroke: ab(a.material),
          strokeWidth: "2.4",
          strokeDasharray: a.silhouette === "airpot" ? "5 3" : void 0
        }
      ),
      /* @__PURE__ */ s.jsx("g", { clipPath: `url(#${d})`, children: r.map((b, m) => {
        const g = b.pct / h * 88, v = 96 - p - g;
        return p += g, /* @__PURE__ */ s.jsx(
          "rect",
          {
            x: "12",
            y: v,
            width: "76",
            height: g,
            fill: b.color || km[m % km.length]
          },
          `${b.name}-${m}`
        );
      }) })
    ] }),
    u ? /* @__PURE__ */ s.jsxs("span", { className: "dsc-vessel-glyph-label", children: [
      a.volumeL,
      "L"
    ] }) : null
  ] });
}
function to({
  label: a,
  icon: r,
  onClick: o,
  className: u = "",
  expanded: d
}) {
  return /* @__PURE__ */ s.jsx(
    "button",
    {
      type: "button",
      className: `dsc-icon-btn ${u}`.trim(),
      "aria-label": a,
      title: a,
      "aria-expanded": d,
      onClick: o,
      children: /* @__PURE__ */ s.jsx(dn, { name: r, size: 16 })
    }
  );
}
function sb(a) {
  return a instanceof Element ? !!a.closest(
    "ha-more-info-dialog, ha-dialog, ha-more-info-info, .ha-more-info, home-assistant-dialog"
  ) : !1;
}
function uc({
  items: a,
  label: r = "More actions"
}) {
  const [o, u] = y.useState(!1), d = y.useRef(null);
  return y.useEffect(() => {
    if (!o) return;
    const h = (b) => {
      sb(b.target) || d.current?.contains(b.target) || u(!1);
    }, p = (b) => {
      b.key === "Escape" && u(!1);
    };
    return document.addEventListener("mousedown", h), window.addEventListener("keydown", p), () => {
      document.removeEventListener("mousedown", h), window.removeEventListener("keydown", p);
    };
  }, [o]), /* @__PURE__ */ s.jsxs("div", { className: "dsc-overflow", ref: d, children: [
    /* @__PURE__ */ s.jsx(
      to,
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
function Tm(a) {
  return Array.from(
    a.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((r) => !r.hasAttribute("disabled") && r.tabIndex !== -1);
}
function Ms({
  open: a,
  onClose: r,
  title: o,
  side: u = "right",
  children: d
}) {
  const h = y.useId(), p = y.useRef(null), b = y.useRef(null);
  return y.useEffect(() => {
    if (!a) return;
    b.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const m = p.current;
    (m ? Tm(m)[0] : null)?.focus();
    const v = (_) => {
      if (_.key === "Escape") {
        _.preventDefault(), r();
        return;
      }
      if (_.key !== "Tab" || !m) return;
      const j = Tm(m);
      if (!j.length) return;
      const w = j[0], M = j[j.length - 1];
      _.shiftKey && document.activeElement === w ? (_.preventDefault(), M.focus()) : !_.shiftKey && document.activeElement === M && (_.preventDefault(), w.focus());
    };
    return window.addEventListener("keydown", v), () => {
      window.removeEventListener("keydown", v), b.current?.focus?.();
    };
  }, [a, r]), /* @__PURE__ */ s.jsxs("div", { className: `dsc-drawer-root${a ? " is-open" : ""}`, "aria-hidden": !a, children: [
    /* @__PURE__ */ s.jsx("div", { className: "dsc-drawer-scrim", onClick: r }),
    /* @__PURE__ */ s.jsxs(
      "aside",
      {
        ref: p,
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
            /* @__PURE__ */ s.jsx(to, { label: "Close", icon: "close", onClick: r })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "dsc-drawer-body", children: d })
        ]
      }
    )
  ] });
}
function ib(a) {
  if (!a || !a.trim()) return [];
  const r = a.split(/[|/·]/).map((u) => u.trim()).filter(Boolean), o = [];
  for (const u of r) {
    const d = u.match(/^(.+?)\s*[·:]?\s*(\d+(?:\.\d+)?)\s*%?$/);
    if (d) {
      o.push({ name: d[1].trim(), pct: Number(d[2]) });
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
    return o.map((d) => ({ ...d, pct: u }));
  }
  return o.filter((u) => u.pct > 0);
}
function cb({
  layers: a,
  valid: r,
  emptyLabel: o = "No blend on roster seat",
  spec: u
}) {
  const d = u ?? Es, h = a.reduce((b, m) => b + m.pct, 0), p = r ?? (a.length > 0 && Math.round(h) === 100);
  return a.length ? /* @__PURE__ */ s.jsx("div", { className: `dsc-soil${p ? " is-valid" : ""}`, children: /* @__PURE__ */ s.jsx(On, { spec: d, layers: a, size: 180, label: !0 }) }) : /* @__PURE__ */ s.jsxs("div", { className: "dsc-soil", children: [
    /* @__PURE__ */ s.jsx(On, { spec: d, size: 160 }),
    /* @__PURE__ */ s.jsx("div", { className: "dsc-soil-empty", children: o })
  ] });
}
function ht(a, r = "—") {
  return !a || a === "unknown" || a === "unavailable" || a === "none" ? r : a;
}
function lc(a, r) {
  const o = a(`input_select.dsc_pot${r}_tent`, "unassigned");
  return o === "clone" || o === "main" || o === "unassigned" ? o : "unassigned";
}
function no(a) {
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
function ya(a, r) {
  const { state: o, entity: u } = r, d = u("sensor.dsc_plant_roster_summary")?.attributes?.slots || [], h = Array.isArray(d) ? d.find((m) => String(m.pot) === String(a)) : void 0, p = (m, g) => {
    const v = ht(o(m, ""));
    return v !== "—" ? v : ht(o(g, ""));
  }, b = ht(h?.blend, "");
  return {
    pot: a,
    plantName: ht(o(`text.dsc_pot${a}_plant_name`, "")),
    strainDisplay: ht(o(`sensor.dsc_pot${a}_strain_display`, "")),
    sprout: ht(o(`datetime.dsc_pot${a}_sprout_date`, ""), "—").slice(0, 10),
    days: ht(o(`sensor.dsc_pot${a}_days_since_sprout`, "")),
    stage: ht(o(`sensor.dsc_pot${a}_expected_stage`, "")),
    growthStage: ht(o(`select.dsc_pot${a}_growth_stage`, "")),
    tent: lc(o, a),
    blend: b,
    recipe: ht(h?.recipe, ""),
    notes: ht(h?.notes, ""),
    layers: ib(b),
    moisture: p(`sensor.dsc_pot${a}_got_moisture`, `sensor.dsc_pot${a}_soil_moisture`),
    soilTemp: ht(o(`sensor.dsc_pot${a}_soil_temperature`, "")),
    ec: p(`sensor.dsc_pot${a}_got_ec`, `sensor.dsc_pot${a}_soil_conductivity`),
    ph: p(`sensor.dsc_pot${a}_got_ph`, `sensor.dsc_pot${a}_soil_ph`),
    n: ht(o(`sensor.dsc_pot${a}_soil_nitrogen`, "")),
    p: ht(o(`sensor.dsc_pot${a}_soil_phosphorus`, "")),
    k: ht(o(`sensor.dsc_pot${a}_soil_potassium`, "")),
    need: ht(o(`sensor.dsc_pot${a}_need_summary`, "")),
    rosterSlot: h?.slot ?? null
  };
}
function ul(a, r, o) {
  const u = `sensor.dsc_pot${a}_got_${r}`, d = r === "moisture" ? `sensor.dsc_pot${a}_soil_moisture` : r === "ec" ? `sensor.dsc_pot${a}_soil_conductivity` : `sensor.dsc_pot${a}_soil_ph`, h = o(u, "");
  return h && h !== "unavailable" && h !== "unknown" ? u : d;
}
function rb(a, r, o) {
  return oc(r).map((u) => ya(u, { state: r, entity: o })).filter((u) => u.tent === a);
}
const Dn = [1, 2, 3, 4];
function Ht(a, r) {
  const o = `input_boolean.dsc_pot${a}_in_service`, u = r(o, "on");
  return u === "unavailable" || u === "unknown" || u === "" ? !0 : u === "on";
}
function oc(a, r = [...Dn]) {
  return r.filter((o) => Ht(o, a));
}
function lo(a, r = [...Dn]) {
  return { inService: oc(a, r).length, total: r.length };
}
function ub(a) {
  const r = a("sensor.dsc_plant_roster_summary")?.attributes?.slots;
  return Array.isArray(r) ? r : [];
}
function dc(a, r) {
  const o = r(`binary_sensor.dsc_pot${a}_sensor_stuck`) === "on", u = r(`binary_sensor.dsc_pot${a}_untrusted`) === "on", d = r("sensor.dsc_peer_divergence_summary", "") !== "—" && r("sensor.dsc_peer_divergence_summary", "") !== "ok" && r("sensor.dsc_peer_divergence_summary", "").toLowerCase() !== "none" && r("sensor.dsc_peer_divergence_summary", "") !== "unknown" && r("sensor.dsc_peer_divergence_summary", "") !== "unavailable" && r("sensor.dsc_peer_divergence_summary", "").length > 0 && r("sensor.dsc_peer_divergence_summary", "") !== "0", h = [];
  o && h.push("stuck"), u && h.push("untrusted"), d && h.push("peer divergence");
  let p = "ok";
  return u || o ? p = "bad" : d && (p = "warn"), {
    stuck: o,
    untrusted: u,
    peerDivergence: d,
    blockNeedAct: u || o,
    tone: p,
    labels: h
  };
}
function ob(a, r) {
  return !Number.isFinite(a) || !Number.isFinite(r) ? NaN : 6.112 * Math.exp(17.67 * a / (a + 243.5)) * r * 2.1674 / (273.15 + a);
}
function db(a) {
  return a === "/live/main" ? "main" : a === "/live/clone" ? "clone" : null;
}
function fb(a) {
  return a === "/live/twin" || a === "/ops/dash" || a === "/live/main" || a === "/live/clone";
}
function hb() {
  const a = pt(), { hass: r, available: o, num: u, state: d, entity: h } = Ce(), p = y.useRef(null), b = y.useRef(null), [m, g] = y.useState("loading"), v = db(a.pathname), _ = a.pathname === "/live/twin" || a.pathname === "/ops/dash" || a.pathname === "/live/main" || a.pathname === "/live/clone", j = o("binary_sensor.dsc_hub_link") ? d("binary_sensor.dsc_hub_link") !== "on" : !o("sensor.dsc_hub_uptime");
  return y.useEffect(() => {
    const w = p.current;
    if (!w || b.current) return;
    let M = !1;
    return (async () => {
      g("loading");
      const A = await nb("dsc-the-dash-card");
      if (M || !p.current) return;
      if (!A) {
        g("missing");
        return;
      }
      const k = document.createElement("dsc-the-dash-card");
      typeof k.setConfig == "function" && k.setConfig({ type: "custom:dsc-the-dash-card" }), r && (k.hass = r), w.appendChild(k), b.current = k, g("ready");
    })(), () => {
      M = !0;
    };
  }, []), y.useEffect(() => {
    b.current && r && (b.current.hass = r);
  }, [r]), y.useEffect(() => {
    const w = b.current;
    w && (w.setFocusTent?.(v), w.setUiChrome?.({ hideHud: fb(a.pathname) }));
  }, [v, a.pathname, m]), y.useEffect(() => {
    const w = b.current, M = () => {
      const A = !_ || document.hidden;
      w?.pause?.(A);
    };
    return M(), document.addEventListener("visibilitychange", M), () => document.removeEventListener("visibilitychange", M);
  }, [_, m]), y.useEffect(() => {
    b.current?.setHeld?.(j);
  }, [j, m]), y.useEffect(() => {
    const w = b.current;
    if (!w?.setPots) return;
    const M = { clone: [], main: [] };
    Dn.forEach((k) => {
      const B = lc(d, k);
      (B === "clone" || B === "main") && M[B].push(k);
    });
    const A = Dn.map((k) => {
      const B = ya(k, { state: d, entity: h }), P = Rl(k, d, h), G = dc(k, d), ne = Ht(k, d), le = lc(d, k), X = le === "clone" || le === "main" ? Math.max(0, M[le].indexOf(k)) : 0;
      return {
        id: `pot${k}`,
        pot: k,
        tent: le,
        slot: X,
        inService: ne,
        silhouette: P.silhouette,
        moisture: Number(B.moisture),
        ec: Number(B.ec),
        ph: Number(B.ph),
        soilT: Number(B.soilTemp),
        dryback: u(`sensor.dsc_pot${k}_dryback_pct`),
        need: B.need,
        held: j,
        untrusted: G.untrusted
      };
    });
    w.setPots(A);
  }, [d, h, u, j, m]), /* @__PURE__ */ s.jsxs(
    "div",
    {
      className: `dsc-twin-keepalive${_ ? " is-active" : ""}`,
      "aria-hidden": !_,
      "data-status": m,
      "data-focus-tent": v || "both",
      children: [
        /* @__PURE__ */ s.jsx("div", { className: "dsc-twin-keepalive-host", ref: p }),
        m === "missing" ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-empty", children: [
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
const mb = "https://cannalib.plausible-deniability.net", pb = {
  strain: "/local/dsc-catalog/dsc_strains_search_index.json",
  medium: "/local/dsc-catalog/dsc_mediums_search_index.json",
  nutrient: "/local/dsc-catalog/dsc_nutrients_search_index.json",
  light: "/local/dsc-catalog/dsc_lights_search_index.json"
}, vb = {
  strain: "strains",
  medium: "mediums",
  nutrient: "nutrients",
  light: "lights"
};
function gb(a) {
  return (a("input_text.dsc_cannalib_base_url", "") || mb).replace(/\/$/, "");
}
function xb(a) {
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
function bb(a) {
  return String(a.name || a.id || "").trim();
}
async function _b(a, r) {
  const o = await fetch(pb[a], { cache: "no-store" });
  if (!o.ok) return [];
  const u = hp(await o.json()), d = r.trim().toLowerCase();
  return d ? u.filter((h) => bb(h).toLowerCase().includes(d)) : u;
}
async function mp(a, r, o, u = 100) {
  try {
    const h = vb[a], p = `${gb(o)}/v1/catalogs/${h}?q=${encodeURIComponent(r || "")}&limit=${u}`, b = await fetch(p, { headers: xb(o), cache: "no-store" });
    if (!b.ok) throw new Error(`cannalib ${b.status}`);
    const m = hp(await b.json());
    if (m.length || a === "strain")
      return {
        items: m,
        source: "cannalib",
        note: "Cannalib full corpus"
      };
  } catch {
  }
  return {
    items: await _b(a, r),
    source: "local",
    note: "Cannalib unreachable — local JSON index"
  };
}
function pp({
  kind: a,
  onPick: r,
  placeholder: o
}) {
  const { state: u } = Ce(), [d, h] = y.useState(""), [p, b] = y.useState([]), [m, g] = y.useState("local"), [v, _] = y.useState(""), [j, w] = y.useState(!1);
  y.useEffect(() => {
    let A = !1;
    const k = window.setTimeout(() => {
      w(!0), mp(a, d, u, 100).then((B) => {
        A || (b(B.items), g(B.source), _(B.note), w(!1));
      });
    }, 200);
    return () => {
      A = !0, window.clearTimeout(k);
    };
  }, [a, d]);
  const M = y.useMemo(() => p, [p]);
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-catalog-picker", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ s.jsx(
        Q,
        {
          label: m === "cannalib" ? "Cannalib" : "Local JSON",
          tone: m === "cannalib" ? "ok" : "warn"
        }
      ),
      v ? /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", style: { fontSize: 12 }, children: v }) : null
    ] }),
    /* @__PURE__ */ s.jsx(
      "input",
      {
        type: "search",
        value: d,
        placeholder: o || "Type to search — options are not culled",
        onChange: (A) => h(A.target.value),
        autoComplete: "off"
      }
    ),
    /* @__PURE__ */ s.jsxs("ul", { className: "dsc-catalog-hits", children: [
      j && !M.length ? /* @__PURE__ */ s.jsx("li", { className: "dsc-muted", children: "Searching…" }) : null,
      !j && !M.length ? /* @__PURE__ */ s.jsx("li", { className: "dsc-muted", children: "No catalog hits — empty is honesty, not a placeholder." }) : null,
      M.map((A, k) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsxs("button", { type: "button", onClick: () => r(A), children: [
        /* @__PURE__ */ s.jsx("strong", { children: A.name }),
        A.type ? /* @__PURE__ */ s.jsx("em", { children: String(A.type) }) : null,
        A.breeder ? /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", children: String(A.breeder) }) : null
      ] }) }, `${A.id || A.name}-${k}`))
    ] })
  ] });
}
const Rn = [1, 2, 3];
function vp(a, r) {
  return Rn.find((u) => !a[u] && u !== r) ?? Rn.find((u) => !a[u]) ?? 3;
}
function Lu(a, r, o, u) {
  const d = vp(u, a), h = Rn.filter((_) => _ !== a && _ !== d), p = h.reduce((_, j) => _ + (Number.isFinite(o[j]) ? Math.round(o[j]) : 0), 0), b = Math.max(0, 100 - p), m = Math.max(0, Math.min(b, Math.round(r))), g = b - m, v = { ...o, [a]: m, [d]: g };
  return h.forEach((_) => {
    v[_] = Math.round(Number.isFinite(o[_]) ? o[_] : 0);
  }), v;
}
function yb({ volumeL: a }) {
  const { state: r, num: o, available: u, callService: d } = Ce(), [h, p] = y.useState({ 1: !1, 2: !1, 3: !1 }), [b, m] = y.useState(null), [g, v] = y.useState(null), _ = {
    1: o("input_number.dsc_blend_pct_1", 0),
    2: o("input_number.dsc_blend_pct_2", 0),
    3: o("input_number.dsc_blend_pct_3", 0)
  }, j = g ?? _, w = Rn.map((X) => ({
    n: X,
    name: r(`input_text.dsc_blend_component_${X}_name`, ""),
    pct: Number.isFinite(j[X]) ? j[X] : 0
  })), M = Rn.filter((X) => h[X]).length, A = vp(h), k = Number.isFinite(a) && a > 0 ? a : o("input_number.dsc_blend_total_l", 20), B = w.reduce((X, W) => X + (Number.isFinite(W.pct) ? W.pct : 0), 0), P = (X) => {
    Rn.forEach((W) => {
      u(`input_number.dsc_blend_pct_${W}`) && d("input_number", "set_value", {
        entity_id: `input_number.dsc_blend_pct_${W}`,
        value: X[W]
      });
    });
  }, G = (X, W) => {
    const ce = Lu(X, W, g ?? j, h);
    v(null), m(null), P(ce);
  }, ne = (X) => {
    p((W) => {
      const ce = { ...W, [X]: !W[X] };
      return Rn.filter((we) => ce[we]).length >= Rn.length ? W : ce;
    });
  }, le = y.useMemo(
    () => w.filter((X) => X.pct > 0 && X.name && X.name !== "unknown").map((X) => `${X.name} ${(k * X.pct / 100).toFixed(1)}L (${Math.round(X.pct)}%)`).join(" · "),
    [w, k]
  );
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-coupled-mix", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ s.jsx(Q, { label: `Σ ${Math.round(B)}%`, tone: Math.round(B) === 100 ? "ok" : "warn" }),
      /* @__PURE__ */ s.jsx(Q, { label: `${k} L vessel`, tone: "muted" }),
      /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", style: { fontSize: 12 }, children: "Lock any but one remainder. Remainder absorbs leftover so Σ stays 100." })
    ] }),
    Rn.map((X) => {
      const W = w[X - 1], ce = X === A && !h[X];
      return /* @__PURE__ */ s.jsxs("div", { className: "dsc-mix-row", children: [
        /* @__PURE__ */ s.jsx(ec, { entityId: `input_text.dsc_blend_component_${X}_name`, label: `Layer ${X}` }),
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "range",
            min: 0,
            max: 100,
            value: Math.round(W.pct),
            disabled: h[X] || ce,
            onPointerDown: (he) => {
              h[X] || ce || (he.target.setPointerCapture(he.pointerId), m(X), v({ ...j }));
            },
            onPointerUp: (he) => {
              b === X && G(X, Number(he.target.value));
            },
            onPointerCancel: () => {
              v(null), m(null);
            },
            onLostPointerCapture: (he) => {
              b === X && G(X, Number(he.target.value));
            },
            onChange: (he) => {
              const we = Number(he.target.value);
              if (b === X) {
                v(Lu(X, we, g ?? j, h));
                return;
              }
              P(Lu(X, we, j, h));
            }
          }
        ),
        /* @__PURE__ */ s.jsxs("strong", { children: [
          Math.round(W.pct),
          "%"
        ] }),
        /* @__PURE__ */ s.jsxs("span", { className: "dsc-mono", children: [
          (k * W.pct / 100).toFixed(1),
          " L"
        ] }),
        /* @__PURE__ */ s.jsx(oe, { disabled: M >= 2 && !h[X], onClick: () => ne(X), children: h[X] ? "Unlock" : ce ? "Remainder" : "Lock" })
      ] }, X);
    }),
    /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: [
      "Recipe: ",
      le || "Empty layers — scripts still read pct entities."
    ] })
  ] });
}
const jb = {
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
function Qe({
  entityId: a,
  label: r,
  step: o
}) {
  const { num: u, available: d, callService: h, entity: p } = Ce(), b = d(a), m = p(a), g = u(a, NaN), v = Number(m?.attributes?.min ?? 0), _ = Number(m?.attributes?.max ?? 100), j = o ?? Number(m?.attributes?.step ?? 0.1), [w, M] = y.useState(String(Number.isFinite(g) ? g : "")), A = y.useRef(!1);
  y.useEffect(() => {
    !A.current && Number.isFinite(g) && M(String(g));
  }, [g]);
  const k = () => {
    if (!b) return;
    const B = Number(w);
    if (!Number.isFinite(B)) {
      M(String(Number.isFinite(g) ? g : ""));
      return;
    }
    const P = Math.min(_, Math.max(v, B)), ne = a.split(".")[0] === "input_number" ? "input_number" : "number";
    h(ne, "set_value", { entity_id: a, value: P }), M(String(P));
  };
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-target-num${b ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ s.jsx("span", { className: "dsc-target-num-label", children: r }),
    /* @__PURE__ */ s.jsx(
      "input",
      {
        type: "number",
        value: w,
        disabled: !b,
        min: v,
        max: _,
        step: j,
        onFocus: () => {
          A.current = !0;
        },
        onChange: (B) => M(B.target.value),
        onBlur: () => {
          A.current = !1, k();
        },
        onKeyDown: (B) => {
          B.key === "Enter" && B.target.blur();
        }
      }
    )
  ] });
}
function Sb({ tent: a, title: r }) {
  const { num: o, available: u } = Ce(), d = jb[a], h = o(d.gotTemp), p = o(d.gotRh), b = u(d.gotVpd) ? o(d.gotVpd) : NaN, m = o(d.temp), g = o(d.rhMin), v = o(d.rhMax), _ = (j) => {
    const w = new CustomEvent("hass-more-info", {
      detail: { entityId: j },
      bubbles: !0,
      composed: !0
    });
    document.querySelector("home-assistant")?.dispatchEvent(w);
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-tent-targets", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-tent-targets-head", children: [
      /* @__PURE__ */ s.jsx("strong", { children: r }),
      /* @__PURE__ */ s.jsx(
        uc,
        {
          label: `${r} more`,
          items: [
            {
              id: "temp",
              label: "More info · temp target",
              onSelect: () => _(d.temp)
            },
            {
              id: "rh",
              label: "More info · RH band",
              onSelect: () => _(d.rhMin)
            },
            {
              id: "vpd",
              label: "More info · VPD band",
              onSelect: () => _(d.vpdMin)
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
        Number.isFinite(b) ? ` / ${b.toFixed(2)} kPa` : ""
      ] }),
      /* @__PURE__ */ s.jsxs("span", { className: "dsc-muted", children: [
        "Want ",
        Number.isFinite(m) ? m.toFixed(1) : "—",
        "°C · RH",
        " ",
        Number.isFinite(g) ? g.toFixed(0) : "—",
        "–",
        Number.isFinite(v) ? v.toFixed(0) : "—",
        "%"
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
      /* @__PURE__ */ s.jsx(Qe, { entityId: d.temp, label: "Temp °C", step: 0.5 }),
      /* @__PURE__ */ s.jsx(Qe, { entityId: d.rhMin, label: "RH min %", step: 1 }),
      /* @__PURE__ */ s.jsx(Qe, { entityId: d.rhMax, label: "RH max %", step: 1 }),
      /* @__PURE__ */ s.jsx(Qe, { entityId: d.vpdMin, label: "VPD min", step: 0.01 }),
      /* @__PURE__ */ s.jsx(Qe, { entityId: d.vpdMax, label: "VPD max", step: 0.01 })
    ] })
  ] });
}
function gp({
  compact: a,
  emphasize: r,
  only: o
}) {
  const u = o ? [o] : r === "clone" ? ["clone", "main"] : ["main", "clone"];
  return /* @__PURE__ */ s.jsx("div", { className: `dsc-target-panel${a ? " is-compact" : ""}`, children: u.map((d) => /* @__PURE__ */ s.jsx(Sb, { tent: d, title: d === "main" ? "Main 4×8" : "Clone 2×4" }, d)) });
}
const Am = [1, 2, 3, 4, 5, 6, 7, 8];
function wb() {
  const { available: a, callService: r, entity: o, num: u, state: d } = Ce(), [h, p] = y.useState(null), [b, m] = y.useState(null), [g, v] = y.useState(null), [_, j] = y.useState(null), w = d("input_text.dsc_build_strain", ""), M = d("input_text.dsc_build_nickname", ""), A = d("input_select.dsc_build_assign_pot", "none"), k = u("input_number.dsc_blend_total_l", 20), B = d("input_select.dsc_light_fixture", ""), P = d("input_select.dsc_build_vessel", ""), G = Yu(P || void 0, k), ne = u("input_number.dsc_mix_tank_liters", 20), le = u("input_number.dsc_mix_strength_pct", 100), X = (Number.isFinite(le) ? le : 100) / 100, W = Number.isFinite(ne) && ne > 0 ? ne : 20, ce = (V, K) => {
    if (V === "strain")
      v(K), r("input_text", "set_value", { entity_id: "input_text.dsc_build_strain", value: K.name });
    else if (V === "medium") {
      const T = K.composition && typeof K.composition == "object" ? Object.entries(K.composition).filter(([, O]) => Number.isFinite(Number(O)) && Number(O) > 0).slice(0, 3) : [];
      if (T.length)
        for (let O = 1; O <= 3; O++) {
          const Z = T[O - 1];
          r("input_text", "set_value", {
            entity_id: `input_text.dsc_blend_component_${O}_name`,
            value: Z ? String(Z[0]) : ""
          }), r("input_number", "set_value", {
            entity_id: `input_number.dsc_blend_pct_${O}`,
            value: Z ? Number(Z[1]) : 0
          });
        }
      else
        r("input_text", "set_value", {
          entity_id: "input_text.dsc_blend_component_1_name",
          value: K.name
        });
    } else if (V === "nutrient")
      for (const T of Am) {
        const O = d(`input_text.dsc_nutrient_${T}_name`, ""), Z = d(`input_boolean.dsc_nutrient_${T}_in_inventory`) === "on";
        if (!O || O === "unknown" || !Z) {
          r("input_text", "set_value", {
            entity_id: `input_text.dsc_nutrient_${T}_name`,
            value: K.name
          }), K.dose_ml_l != null && Number.isFinite(Number(K.dose_ml_l)) && r("input_number", "set_value", {
            entity_id: `input_number.dsc_nutrient_${T}_dose_ml_l`,
            value: Number(K.dose_ml_l)
          }), r("input_boolean", "turn_on", { entity_id: `input_boolean.dsc_nutrient_${T}_in_inventory` });
          break;
        }
      }
    else if (V === "light") {
      j(K);
      const O = (o("input_select.dsc_light_fixture")?.attributes?.options || []).find((Z) => Z.toLowerCase().includes(String(K.name || "").toLowerCase().slice(0, 18)));
      O ? r("input_select", "select_option", { entity_id: "input_select.dsc_light_fixture", option: O }) : r("input_text", "set_value", { entity_id: "input_text.dsc_light_custom_name", value: K.name });
    }
    p(null);
  }, he = (V) => {
    const K = Number(V);
    if (!Number.isFinite(K) || V === "none") return;
    const T = qu(K);
    a(T) && r("input_select", "select_option", { entity_id: T, option: G.id });
  }, we = () => {
    r("script", "turn_on", { entity_id: "script.dsc_build_plant_commit" });
  }, xe = () => {
    if (he(A), a("script.dsc_build_plant_commit_and_assign")) {
      r("script", "turn_on", { entity_id: "script.dsc_build_plant_commit_and_assign" });
      return;
    }
    r("script", "turn_on", { entity_id: "script.dsc_build_plant_commit" }), r("script", "turn_on", {
      entity_id: "script.dsc_plant_assign_to_pot",
      variables: { pot: A }
    });
  }, ge = Am.map((V) => {
    const K = d(`input_text.dsc_nutrient_${V}_name`, ""), T = u(`input_number.dsc_nutrient_${V}_dose_ml_l`, 0), O = u(`input_number.dsc_nutrient_${V}_stock_ml`, 0), Z = d(`input_boolean.dsc_nutrient_${V}_in_inventory`) === "on", ee = !K || K === "unknown" || K === "unavailable", ue = !ee && Number.isFinite(T) ? Math.round(T * W * X * 10) / 10 : 0;
    return { n: V, name: K, dose: T, stock: O, inv: Z, empty: ee, ml: ue, short: Z && Number.isFinite(O) && O < ue && ue > 0 };
  }), H = ge.reduce((V, K) => V + K.ml, 0);
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-compose", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(re, { className: "dsc-glass", title: "Strain", icon: "roster", children: [
        /* @__PURE__ */ s.jsx(
          ys,
          {
            label: w && w !== "unknown" ? w : "No strain",
            empty: !w || w === "unknown",
            onClick: () => p("strain")
          }
        ),
        g ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { margin: "8px 0" }, children: [
          g.type ? /* @__PURE__ */ s.jsx(Q, { label: String(g.type), tone: "muted" }) : null,
          g.height_cm_min != null ? /* @__PURE__ */ s.jsx(
            Q,
            {
              label: `${g.height_cm_min}${g.height_cm_max != null ? `–${g.height_cm_max}` : ""}cm`,
              tone: "muted"
            }
          ) : null,
          g.thc_min != null ? /* @__PURE__ */ s.jsx(Q, { label: `${g.thc_min}% THC`, tone: "muted" }) : null
        ] }) : null,
        /* @__PURE__ */ s.jsx(ec, { entityId: "input_text.dsc_build_nickname", label: "Nickname" }),
        /* @__PURE__ */ s.jsx(Jx, { entityId: "input_datetime.dsc_build_sprout_date", label: "Sprout date" }),
        /* @__PURE__ */ s.jsx(Al, { entityId: "input_select.dsc_build_custom_slot", label: "Custom strain slot" })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(re, { className: "dsc-glass", title: "Vessel + mix", icon: "compose", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
          /* @__PURE__ */ s.jsx(On, { spec: G, size: 48, label: !0 }),
          /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-chip", onClick: () => p("vessel"), children: G.label })
        ] }),
        /* @__PURE__ */ s.jsx(yb, { volumeL: G.volumeL || k }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", style: { marginTop: 8 }, children: /* @__PURE__ */ s.jsx(ys, { label: "Medium search", onClick: () => p("medium"), empty: !0 }) })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(re, { className: "dsc-glass", title: "Nutrition", icon: "nutrient", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
          /* @__PURE__ */ s.jsx(ys, { label: "Add from catalog", onClick: () => p("nutrient"), empty: !0 }),
          /* @__PURE__ */ s.jsx(Q, { label: `Tank ${W} L`, tone: "muted" }),
          /* @__PURE__ */ s.jsx(Q, { label: `${Math.round(X * 100)}% strength`, tone: "muted" }),
          /* @__PURE__ */ s.jsx(Q, { label: `${H.toFixed(1)} ml`, tone: H > 0 ? "ok" : "muted" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
          /* @__PURE__ */ s.jsx(Qe, { entityId: "input_number.dsc_mix_tank_liters", label: "Tank L", step: 0.5 }),
          /* @__PURE__ */ s.jsx(Qe, { entityId: "input_number.dsc_mix_strength_pct", label: "Strength %", step: 1 })
        ] }),
        ge.map((V) => /* @__PURE__ */ s.jsxs("div", { className: "dsc-nutrient-slot", children: [
          /* @__PURE__ */ s.jsx(ec, { entityId: `input_text.dsc_nutrient_${V.n}_name`, label: `Slot ${V.n}` }),
          /* @__PURE__ */ s.jsx(Qe, { entityId: `input_number.dsc_nutrient_${V.n}_dose_ml_l`, label: "ml/L", step: 0.1 }),
          /* @__PURE__ */ s.jsx("span", { className: "dsc-mono", children: V.empty ? "—" : `${V.ml} ml` }),
          V.short ? /* @__PURE__ */ s.jsx(Q, { label: "stock short", tone: "warn" }) : null
        ] }, V.n)),
        /* @__PURE__ */ s.jsx(ec, { entityId: "input_text.dsc_build_recipe_note", label: "Recipe note", multiline: !0 }),
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: "ml = dose × tank × strength. Empty names stay empty — Compose does not invent products." })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(re, { className: "dsc-glass", title: "Light + assign", icon: "lighting", children: [
        /* @__PURE__ */ s.jsx(
          ys,
          {
            label: B && B !== "unknown" ? B : "No fixture",
            empty: !B || B === "unknown",
            onClick: () => p("light")
          }
        ),
        _ ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { margin: "8px 0" }, children: [
          _.wattage_w != null ? /* @__PURE__ */ s.jsx(Q, { label: `${_.wattage_w} W`, tone: "muted" }) : null,
          _.efficacy_umol_j != null ? /* @__PURE__ */ s.jsx(Q, { label: `${_.efficacy_umol_j} µmol/J`, tone: "muted" }) : null,
          _.has_ppfd || _.ppfd_url ? /* @__PURE__ */ s.jsx(Q, { label: "PPFD", tone: "ok" }) : /* @__PURE__ */ s.jsx(Q, { label: "No PPFD URL", tone: "warn" })
        ] }) : null,
        /* @__PURE__ */ s.jsx(Al, { entityId: "input_select.dsc_build_assign_pot", label: "Assign pot", icon: "root" }),
        /* @__PURE__ */ s.jsx(Al, { entityId: "input_select.dsc_build_climate_pot", label: "Climate apply pot", icon: "climate" }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ s.jsx(oe, { primary: !0, onClick: () => m("roster"), children: "Commit roster" }),
          /* @__PURE__ */ s.jsx(oe, { teal: !0, onClick: () => m("assign"), children: "Commit + assign" }),
          /* @__PURE__ */ s.jsx(oe, { onClick: () => m("seat"), children: "Assign seat" }),
          /* @__PURE__ */ s.jsx(oe, { onClick: () => m("mix"), children: "Accept mix" }),
          /* @__PURE__ */ s.jsx(oe, { onClick: () => m("climate"), children: "Apply climate Want" })
        ] }),
        /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", style: { marginBottom: 0 }, children: [
          "Confirm overlay writes HA scripts. Coupled mix stays on ",
          /* @__PURE__ */ s.jsx("code", { children: "input_number.dsc_blend_pct_N" }),
          "."
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ s.jsx(
      gt,
      {
        open: h === "strain" || h === "medium" || h === "nutrient" || h === "light",
        onDismiss: () => p(null),
        title: h ? `Search ${h}` : "Search",
        help: null,
        children: h === "strain" || h === "medium" || h === "nutrient" || h === "light" ? /* @__PURE__ */ s.jsx(pp, { kind: h, onPick: (V) => ce(h, V) }) : null
      }
    ),
    /* @__PURE__ */ s.jsxs(gt, { open: h === "vessel", onDismiss: () => p(null), title: "Vessel", help: null, children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: eo.map((V) => /* @__PURE__ */ s.jsxs(
        "button",
        {
          type: "button",
          className: `dsc-chip${V.id === G.id ? " dsc-chip--ok" : ""}`,
          onClick: () => {
            (o("input_select.dsc_build_vessel")?.attributes?.options || []).includes(V.id) && a("input_select.dsc_build_vessel") && r("input_select", "select_option", {
              entity_id: "input_select.dsc_build_vessel",
              option: V.id
            }), r("input_number", "set_value", {
              entity_id: "input_number.dsc_blend_total_l",
              value: V.volumeL
            }), p(null);
          },
          children: [
            /* @__PURE__ */ s.jsx(On, { spec: V, size: 28 }),
            " ",
            V.label
          ]
        },
        V.id
      )) }),
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { fontSize: 12 }, children: [
        "Default if helper missing: ",
        Es.label,
        ". Reload HA after packages load",
        " ",
        /* @__PURE__ */ s.jsx("code", { children: "dsc_v4_vessel.yaml" }),
        "."
      ] }),
      a("input_select.dsc_build_vessel") ? /* @__PURE__ */ s.jsx(Q, { label: "Vessel helper", tone: "ok" }) : /* @__PURE__ */ s.jsx(Q, { label: "Volume-only until vessel select exists", tone: "warn" })
    ] }),
    /* @__PURE__ */ s.jsx(
      gt,
      {
        open: b === "roster",
        onDismiss: () => m(null),
        onConfirm: () => {
          we(), m(null);
        },
        title: "Commit roster",
        confirmLabel: "Write roster",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          "Strain ",
          M || w || "—",
          ". Vessel ",
          G.label,
          ". Assign helper stays ",
          A,
          ". Runs",
          " ",
          /* @__PURE__ */ s.jsx("code", { children: "script.dsc_build_plant_commit" }),
          "."
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx(
      gt,
      {
        open: b === "assign",
        onDismiss: () => m(null),
        onConfirm: () => {
          xe(), m(null);
        },
        title: "Commit + assign",
        confirmLabel: "Write + assign",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          "Writes roster then assigns pot ",
          A === "none" ? "(none — pick a pot first)" : A,
          ". Copies vessel",
          " ",
          G.id,
          " onto ",
          /* @__PURE__ */ s.jsx("code", { children: A === "none" ? "—" : qu(Number(A)) }),
          " if that helper exists."
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx(
      gt,
      {
        open: b === "seat",
        onDismiss: () => m(null),
        onConfirm: () => {
          he(A), r("script", "turn_on", {
            entity_id: "script.dsc_plant_assign_to_pot",
            variables: { pot: A }
          }), m(null);
        },
        title: "Assign to pot",
        confirmLabel: "Assign now",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          "Assigns current roster plant to pot ",
          A === "none" ? "(none — pick a pot first)" : A,
          " via",
          " ",
          /* @__PURE__ */ s.jsx("code", { children: "script.dsc_plant_assign_to_pot" }),
          ". Does not invent a roster row."
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx(
      gt,
      {
        open: b === "mix",
        onDismiss: () => m(null),
        onConfirm: () => {
          r("script", "turn_on", { entity_id: "script.dsc_accept_mix" }), m(null);
        },
        title: "Accept mix",
        confirmLabel: "Burn stock",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          H.toFixed(1),
          " ml from tank ",
          W,
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
      gt,
      {
        open: b === "climate",
        onDismiss: () => m(null),
        onConfirm: () => {
          r("script", "turn_on", { entity_id: "script.dsc_apply_climate_want" }), m(null);
        },
        title: "Apply climate Want",
        confirmLabel: "Write Want",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          "Applies custom temp/RH Want to pot",
          " ",
          d("input_select.dsc_build_climate_pot", "Fleet"),
          " via",
          " ",
          /* @__PURE__ */ s.jsx("code", { children: "script.dsc_apply_climate_want" }),
          ". Does not invent catalog bands."
        ] })
      }
    )
  ] });
}
const Nb = [
  { id: "strain", label: "Strains" },
  { id: "medium", label: "Mediums" },
  { id: "nutrient", label: "Nutrients" },
  { id: "light", label: "Lights" }
];
function Eb(a, r) {
  return Array.isArray(a) && a.length >= 2 ? `${a[0]}–${a[1]}${r}` : a != null && a !== "" ? `${a}${r}` : "";
}
function Rm(a, r) {
  const o = a;
  switch (r) {
    case "name":
      return o.name || "—";
    case "type":
      return o.type || "—";
    case "breeder":
      return o.breeder || o.brand || "—";
    case "wantTemp":
      return o.want?.temp_c ? o.want.temp_c.join("–") : "—";
    case "wantRh":
      return o.want?.rh_pct ? o.want.rh_pct.join("–") : "—";
    case "height":
      return Eb(o.height_cm, "cm") || (o.height_cm_min != null ? `${o.height_cm_min}${o.height_cm_max != null ? `–${o.height_cm_max}` : ""}cm` : "—");
    case "thc":
      return o.thc_range ? `${o.thc_range.join("–")}%` : o.thc_min != null ? `${o.thc_min}%` : "—";
    case "flowering":
      return o.flowering_days_min != null ? `${o.flowering_days_min}${o.flowering_days_max != null ? `–${o.flowering_days_max}` : ""}d` : "—";
    case "brand":
      return o.brand || "—";
    case "category":
      return o.category || "—";
    case "dose":
      return o.dose_ml_l != null ? `${o.dose_ml_l} ml/L` : "—";
    case "stage":
      return o.stage || "—";
    case "wattage":
      return o.wattage_w != null ? `${o.wattage_w} W` : "—";
    case "ppe":
      return o.efficacy_umol_j != null ? String(o.efficacy_umol_j) : "—";
    case "ppfd":
      return o.has_ppfd || o.ppfd_url ? "yes" : "—";
    case "composition":
      return typeof o.composition == "string" ? o.composition : o.composition && typeof o.composition == "object" && Object.entries(o.composition).map(([u, d]) => `${u} ${d}%`).join(" · ") || "—";
    default: {
      const u = o[r];
      return u != null && u !== "" ? String(u) : "—";
    }
  }
}
function Mb(a) {
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
function kb() {
  const { callService: a, state: r } = Ce(), o = dt(), [u, d] = y.useState("strain"), [h, p] = y.useState(null), [b, m] = y.useState([]), [g, v] = y.useState(""), _ = y.useMemo(() => Mb(u), [u]);
  y.useEffect(() => {
    mp(u, "", r, 8).then((w) => v(w.note));
  }, [u, r]);
  const j = (w) => {
    w && (u === "strain" ? a("input_text", "set_value", { entity_id: "input_text.dsc_build_strain", value: w.name }) : u === "medium" ? a("input_text", "set_value", {
      entity_id: "input_text.dsc_blend_component_1_name",
      value: w.name
    }) : u === "nutrient" ? a("input_text", "set_value", { entity_id: "input_text.dsc_nutrient_1_name", value: w.name }) : u === "light" && a("input_text", "set_value", { entity_id: "input_text.dsc_light_custom_name", value: w.name }), o("/grow/compose"));
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-research", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: [
      Nb.map((w) => /* @__PURE__ */ s.jsx(
        "button",
        {
          type: "button",
          className: `dsc-chip${u === w.id ? " dsc-chip--ok" : ""}`,
          onClick: () => {
            d(w.id), p(null), m([]);
          },
          children: w.label
        },
        w.id
      )),
      /* @__PURE__ */ s.jsx(Q, { label: g || "Catalog", tone: g.includes("local") ? "warn" : "ok" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(re, { className: "dsc-glass", title: "Browse", icon: "research", children: /* @__PURE__ */ s.jsx(pp, { kind: u, onPick: (w) => p(w) }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(re, { className: "dsc-glass", title: "Detail", icon: "roster", children: h ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx("h3", { style: { marginTop: 0 }, children: h.name }),
        /* @__PURE__ */ s.jsx("dl", { className: "dsc-detail-list", children: _.map((w) => /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("dt", { children: w.label }),
          /* @__PURE__ */ s.jsx("dd", { children: Rm(h, w.key) })
        ] }, w.key)) }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", children: [
          /* @__PURE__ */ s.jsx(oe, { primary: !0, onClick: () => j(h), children: "Use in Compose" }),
          /* @__PURE__ */ s.jsx(
            oe,
            {
              onClick: () => m(
                (w) => w.some((M) => (M.id || M.name) === (h.id || h.name)) ? w : [...w, h].slice(0, 3)
              ),
              children: "Add compare"
            }
          )
        ] })
      ] }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Pick a row. Missing fields stay blank." }) }) }),
      b.length ? /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(re, { className: "dsc-glass", title: "Compare", icon: "analytics", children: [
        /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "Field" }),
            b.map((w) => /* @__PURE__ */ s.jsx("th", { children: w.name }, w.id || w.name))
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: _.map((w) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: w.label }),
            b.map((M) => /* @__PURE__ */ s.jsx("td", { children: Rm(M, w.key) }, M.id || M.name))
          ] }, w.key)) })
        ] }),
        /* @__PURE__ */ s.jsx(oe, { onClick: () => m([]), children: "Clear compare" })
      ] }) }) : null
    ] })
  ] });
}
function Cb(a) {
  if (typeof a.lu == "number" && Number.isFinite(a.lu))
    return a.lu * 1e3;
  const r = a.last_changed || a.last_updated;
  if (r) {
    const o = Date.parse(r);
    return Number.isFinite(o) ? o : null;
  }
  return null;
}
function Tb(a) {
  const r = a.s ?? a.state, o = typeof r == "number" ? r : Number(r);
  return Number.isFinite(o) ? o : null;
}
function Ab(a, r) {
  if (a.length <= r) return a;
  const o = [], u = (a.length - 1) / (r - 1);
  for (let d = 0; d < r; d++)
    o.push(a[Math.round(d * u)]);
  return o;
}
function Rb(a, r = 6, o = 96) {
  const { hass: u, callWS: d } = Ce(), h = !!(u && (u.callWS || u.connection)), [p, b] = y.useState([]), [m, g] = y.useState(!0), [v, _] = y.useState(null);
  return y.useEffect(() => {
    let j = !1;
    async function w() {
      if (!a) {
        b([]), g(!1);
        return;
      }
      if (!h) {
        b([]), g(!1);
        return;
      }
      g(!0), _(null);
      const M = /* @__PURE__ */ new Date(), A = new Date(M.getTime() - r * 3600 * 1e3);
      try {
        const k = await d({
          type: "history/history_during_period",
          start_time: A.toISOString(),
          end_time: M.toISOString(),
          significant_changes_only: !1,
          minimal_response: !0,
          no_attributes: !0,
          entity_ids: [a]
        });
        if (j) return;
        if (k == null) {
          b([]), _("history unavailable");
          return;
        }
        let B = [];
        Array.isArray(k) ? B = k[0] || [] : k && typeof k == "object" && (B = k[a] || []);
        const P = [];
        for (const G of B) {
          const ne = Cb(G), le = Tb(G);
          ne == null || le == null || P.push({ t: ne, v: le });
        }
        P.sort((G, ne) => G.t - ne.t), b(Ab(P, o));
      } catch (k) {
        j || (_(k instanceof Error ? k.message : "history unavailable"), b([]));
      } finally {
        j || g(!1);
      }
    }
    return w(), () => {
      j = !0;
    };
  }, [h, a, r, o, d]), { points: p, loading: m, error: v };
}
function Je(a, r) {
  const o = r?.maxPoints ?? 96, u = r?.hours ?? 6, { num: d, available: h, tick: p } = Ce(), { points: b } = Rb(a, u, o), [m, g] = y.useState([]), [v, _] = y.useState(void 0), j = y.useRef(null), w = y.useRef(!1);
  return y.useEffect(() => {
    w.current = !1, g([]), j.current = null, _(void 0);
  }, [a, u, o]), y.useEffect(() => {
    if (b.length && !w.current) {
      w.current = !0;
      const A = b[b.length - 1]?.v;
      Number.isFinite(A) && (j.current = A);
    }
  }, [b]), y.useEffect(() => {
    if (!a || !h(a)) return;
    const A = d(a);
    if (!Number.isFinite(A)) return;
    if (j.current === A && m.length > 0) {
      const B = Date.now(), P = m[m.length - 1]?.t ?? 0;
      if (B - P < 4e3) return;
    }
    j.current = A;
    const k = Date.now();
    g((B) => [...B, { t: k, v: A }].slice(-o)), _(k);
  }, [a, p, h, d, o]), { series: y.useMemo(() => {
    if (!b.length && !m.length) return m;
    if (!m.length) return b;
    if (!b.length) return m;
    const A = m[0]?.t ?? 0, B = [...b.filter((P) => P.t < A - 500), ...m];
    return B.length > o ? B.slice(-o) : B;
  }, [b, m, o]), lastSyncAt: v };
}
const zb = [1, 6, 24, 48], xp = "dsc_chart_hours";
function Ob() {
  try {
    const a = sessionStorage.getItem(xp), r = Number(a);
    if (Number.isFinite(r) && r > 0 && r <= 48) return r;
  } catch {
  }
  return 6;
}
function ao(a = 6) {
  const [r, o] = y.useState(() => Ob() || a), u = y.useCallback((h) => {
    o(h);
    try {
      sessionStorage.setItem(xp, String(h));
    } catch {
    }
  }, []), d = r <= 1 ? 60 : r <= 6 ? 96 : r <= 24 ? 144 : 192;
  return { hours: r, setHours: u, maxPoints: d };
}
const Ki = [
  "var(--dsc-neon)",
  "var(--dsc-teal)",
  "var(--dsc-amber)",
  "var(--dsc-gray-5)"
];
function zm(a) {
  const r = Math.max(...a, 1), o = 10 ** Math.floor(Math.log10(r));
  return Math.ceil(r / o) * o;
}
function Om(a, r = !1) {
  const o = Math.min(...a);
  if (r && o >= 0) return 0;
  const u = Math.abs(o) || 1, d = 10 ** Math.floor(Math.log10(u));
  return Math.floor(o / d) * d;
}
function Dm(a, r, o = 0.08) {
  if (!Number.isFinite(a) || !Number.isFinite(r)) return { min: 0, max: 1 };
  if (r <= a) return { min: a - 1, max: r + 1 };
  const d = (r - a) * o || 1;
  return { min: a - d, max: r + d };
}
function Db(a, r, o, u, d, h, p, b) {
  if (!a.length) return "";
  const m = Math.max(h - d, 1e-6), g = Math.max(b - p, 1), v = r - u.l - u.r, _ = o - u.t - u.b;
  return a.map((j, w) => {
    const M = u.l + (j.t - p) / g * v, A = u.t + (1 - (j.v - d) / m) * _;
    return `${w === 0 ? "M" : "L"}${M.toFixed(1)} ${A.toFixed(1)}`;
  }).join(" ");
}
function Hm(a) {
  const r = new Date(a), o = String(r.getHours()).padStart(2, "0"), u = String(r.getMinutes()).padStart(2, "0");
  return `${o}:${u}`;
}
function xs(a, r, o, u, d) {
  const h = Math.max(o - r, 1e-6);
  return d.t + (1 - (a - r) / h) * (u - d.t - d.b);
}
function Lm(a, r, o) {
  const u = a.filter((d) => (d.axis || "left") === r).flatMap((d) => d.series.map((h) => h.v));
  if (!u.length)
    return r === "right" ? { min: 0, max: 100 } : { min: 0, max: 1 };
  if (r === "right") {
    const d = Math.min(...u, 0);
    return Math.max(...u, 100) <= 100 && d >= 0 ? { min: 0, max: 100 } : Dm(Om(u, !0), zm(u));
  }
  return Dm(Om(u), zm(u));
}
function un({
  series: a,
  height: r = 180,
  unit: o = "",
  live: u = !0,
  emptyLabel: d = "No history yet",
  lastSyncAt: h,
  targets: p = []
}) {
  const b = y.useId().replace(/:/g, ""), m = 640, g = a.some((H) => H.axis === "right"), v = { l: 40, r: g ? 40 : 14, t: 16, b: 28 }, _ = y.useRef(null), [j, w] = y.useState(null), [M, A] = y.useState(!1), [k, B] = y.useState(0), P = y.useRef(void 0);
  y.useEffect(() => {
    h != null && P.current !== h && (P.current = h, B((H) => H + 1));
  }, [h]);
  const G = y.useMemo(() => {
    const H = a.flatMap((ee) => ee.series);
    if (!H.length) return null;
    const V = Lm(a, "left"), K = Lm(a, "right"), T = Math.min(...H.map((ee) => ee.t)), O = Math.max(...H.map((ee) => ee.t)), Z = a.map((ee, ue) => {
      const N = ee.axis || "left", U = N === "right" ? K : V;
      return {
        ...ee,
        axis: N,
        color: ee.color || Ki[ue % Ki.length],
        d: Db(ee.series, m, r, v, U.min, U.max, T, O),
        last: ee.series.length ? ee.series[ee.series.length - 1] : null,
        dom: U
      };
    });
    return { left: V, right: K, t0: T, t1: O, paths: Z };
  }, [a, r, g]), ne = y.useMemo(() => {
    if (!G) return [];
    const H = 4, V = [];
    for (let K = 0; K <= H; K++) {
      const T = K / H, O = G.left.max - T * (G.left.max - G.left.min), Z = v.t + T * (r - v.t - v.b);
      V.push({ y: Z, label: O.toFixed(Math.abs(O) >= 100 ? 0 : 1) });
    }
    return V;
  }, [G, r]), le = y.useMemo(() => {
    if (!G || !g) return [];
    const H = 4, V = [];
    for (let K = 0; K <= H; K++) {
      const T = K / H, O = G.right.max - T * (G.right.max - G.right.min), Z = v.t + T * (r - v.t - v.b);
      V.push({ y: Z, label: O.toFixed(Math.abs(O) >= 100 ? 0 : 1) });
    }
    return V;
  }, [G, r, g]), X = y.useMemo(() => {
    if (!G) return [];
    const H = 5, V = [], K = Math.max(G.t1 - G.t0, 1), T = m - v.l - v.r;
    for (let O = 0; O < H; O++) {
      const Z = O / (H - 1), ee = G.t0 + Z * K;
      V.push({ x: v.l + Z * T, label: Hm(ee) });
    }
    return V;
  }, [G]), W = y.useCallback(
    (H) => {
      const V = _.current;
      if (!V || !G) return null;
      const K = V.getBoundingClientRect(), T = (H - K.left) / Math.max(K.width, 1) * m, O = m - v.l - v.r, Z = Math.min(m - v.r, Math.max(v.l, T)), ee = (Z - v.l) / Math.max(O, 1);
      return { t: G.t0 + ee * Math.max(G.t1 - G.t0, 1), x: Z };
    },
    [G]
  ), ce = (H) => {
    if (M) return;
    const V = W(H.clientX);
    V && w(V);
  }, he = () => {
    M || w(null);
  }, we = (H) => {
    const V = W(H.clientX);
    if (V) {
      if (M && j && Math.abs(j.x - V.x) < 8) {
        A(!1), w(null);
        return;
      }
      A(!0), w(V);
    }
  }, xe = y.useMemo(() => !G || !j ? [] : G.paths.map((H) => {
    if (!H.series.length) return { id: H.id, label: H.label, color: H.color, v: null, unit: H.unit || "" };
    let V = H.series[0], K = Math.abs(V.t - j.t);
    for (const O of H.series) {
      const Z = Math.abs(O.t - j.t);
      Z < K && (V = O, K = Z);
    }
    const T = xs(V.v, H.dom.min, H.dom.max, r, v);
    return {
      id: H.id,
      label: H.label,
      color: H.color,
      v: V.v,
      unit: H.unit || "",
      y: T,
      x: v.l + (V.t - G.t0) / Math.max(G.t1 - G.t0, 1) * (m - v.l - v.r)
    };
  }), [G, j, r]), ge = G?.paths[0]?.last?.v ?? null;
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-chart", style: { position: "relative", width: "100%" }, children: [
    /* @__PURE__ */ s.jsxs(
      "svg",
      {
        ref: _,
        viewBox: `0 0 ${m} ${r}`,
        width: "100%",
        height: r,
        role: "img",
        "aria-label": "Live chart",
        className: "dsc-chart-svg",
        onPointerMove: ce,
        onPointerLeave: he,
        onPointerDown: we,
        children: [
          /* @__PURE__ */ s.jsxs("defs", { children: [
            G?.paths.map((H) => /* @__PURE__ */ s.jsxs("linearGradient", { id: `fill-${b}-${H.id}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ s.jsx("stop", { offset: "0%", stopColor: H.color, stopOpacity: "0.28" }),
              /* @__PURE__ */ s.jsx("stop", { offset: "100%", stopColor: H.color, stopOpacity: "0" })
            ] }, H.id)),
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
          ne.map((H) => /* @__PURE__ */ s.jsxs("g", { children: [
            /* @__PURE__ */ s.jsx(
              "line",
              {
                x1: v.l,
                x2: m - v.r,
                y1: H.y,
                y2: H.y,
                stroke: "var(--dsc-gray-3)",
                strokeWidth: "1",
                strokeDasharray: "3 4"
              }
            ),
            /* @__PURE__ */ s.jsx(
              "text",
              {
                x: v.l - 6,
                y: H.y + 3,
                textAnchor: "end",
                fill: "var(--dsc-gray-5)",
                fontSize: "9",
                fontFamily: "var(--dsc-mono)",
                children: H.label
              }
            )
          ] }, `L${H.y}`)),
          le.map((H) => /* @__PURE__ */ s.jsx(
            "text",
            {
              x: m - v.r + 6,
              y: H.y + 3,
              textAnchor: "start",
              fill: "var(--dsc-teal)",
              fontSize: "9",
              fontFamily: "var(--dsc-mono)",
              opacity: 0.85,
              children: H.label
            },
            `R${H.y}`
          )),
          X.map((H) => /* @__PURE__ */ s.jsx(
            "text",
            {
              x: H.x,
              y: r - 8,
              textAnchor: "middle",
              fill: "var(--dsc-gray-5)",
              fontSize: "9",
              fontFamily: "var(--dsc-mono)",
              children: H.label
            },
            H.x
          )),
          G ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            p.map((H, V) => {
              const K = H.axis || "left", T = K === "right" ? G.right : G.left, O = H.color || (K === "right" ? "var(--dsc-teal)" : "var(--dsc-amber)");
              if (H.min != null && H.max != null) {
                const ee = xs(H.max, T.min, T.max, r, v), ue = xs(H.min, T.min, T.max, r, v);
                return /* @__PURE__ */ s.jsxs("g", { children: [
                  /* @__PURE__ */ s.jsx(
                    "rect",
                    {
                      x: v.l,
                      y: Math.min(ee, ue),
                      width: m - v.l - v.r,
                      height: Math.abs(ue - ee),
                      fill: O,
                      opacity: 0.08
                    }
                  ),
                  /* @__PURE__ */ s.jsx(
                    "line",
                    {
                      x1: v.l,
                      x2: m - v.r,
                      y1: ee,
                      y2: ee,
                      stroke: O,
                      strokeWidth: "1",
                      strokeDasharray: "4 4",
                      opacity: 0.7
                    }
                  ),
                  /* @__PURE__ */ s.jsx(
                    "line",
                    {
                      x1: v.l,
                      x2: m - v.r,
                      y1: ue,
                      y2: ue,
                      stroke: O,
                      strokeWidth: "1",
                      strokeDasharray: "4 4",
                      opacity: 0.7
                    }
                  )
                ] }, `tg-${V}`);
              }
              if (H.value == null || !Number.isFinite(H.value)) return null;
              const Z = xs(H.value, T.min, T.max, r, v);
              return /* @__PURE__ */ s.jsxs("g", { children: [
                /* @__PURE__ */ s.jsx(
                  "line",
                  {
                    x1: v.l,
                    x2: m - v.r,
                    y1: Z,
                    y2: Z,
                    stroke: O,
                    strokeWidth: "1.2",
                    strokeDasharray: "5 4",
                    opacity: 0.85
                  }
                ),
                H.label ? /* @__PURE__ */ s.jsx(
                  "text",
                  {
                    x: m - v.r - 2,
                    y: Z - 4,
                    textAnchor: "end",
                    fill: O,
                    fontSize: "8",
                    fontFamily: "var(--dsc-mono)",
                    children: H.label
                  }
                ) : null
              ] }, `tg-${V}`);
            }),
            G.paths.map((H) => {
              if (!H.d || H.series.length === 0) return null;
              const V = H.series.length >= 2 ? `${H.d} L${m - v.r} ${r - v.b} L${v.l} ${r - v.b} Z` : "", K = H.last, T = K && G ? v.l + (K.t - G.t0) / Math.max(G.t1 - G.t0, 1) * (m - v.l - v.r) : 0, O = K ? xs(K.v, H.dom.min, H.dom.max, r, v) : 0;
              return /* @__PURE__ */ s.jsxs("g", { className: "dsc-chart-series", children: [
                V && !H.ghost ? /* @__PURE__ */ s.jsx("path", { d: V, fill: `url(#fill-${b}-${H.id})`, opacity: 0.9, className: "dsc-chart-fill" }) : null,
                H.ghost ? null : /* @__PURE__ */ s.jsx(
                  "path",
                  {
                    d: H.d,
                    fill: "none",
                    stroke: H.color,
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
                    d: H.d,
                    fill: "none",
                    stroke: H.color,
                    strokeWidth: H.ghost ? 1.6 : 2.2,
                    strokeLinejoin: "round",
                    strokeLinecap: "round",
                    strokeDasharray: H.ghost ? "5 4" : void 0,
                    filter: H.ghost ? void 0 : `url(#glow-${b})`,
                    opacity: H.ghost ? 0.55 : 0.95,
                    className: "dsc-chart-core"
                  }
                ),
                u && K && H.series.length >= 2 && !H.ghost ? /* @__PURE__ */ s.jsxs("g", { className: "dsc-chart-pulse-wrap", children: [
                  /* @__PURE__ */ s.jsx(
                    "path",
                    {
                      className: "dsc-chart-pulse",
                      d: H.d,
                      fill: "none",
                      stroke: H.color,
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
                      cx: T,
                      cy: O,
                      r: 4,
                      fill: H.color,
                      className: "dsc-chart-tip",
                      filter: `url(#glow-${b})`
                    }
                  )
                ] }, `pulse-${k}-${H.id}`) : K ? /* @__PURE__ */ s.jsx("circle", { cx: T, cy: O, r: 3.2, fill: H.color, opacity: 0.9 }) : null
              ] }, H.id);
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
              xe.map(
                (H) => H.v == null || H.y == null ? null : /* @__PURE__ */ s.jsx(
                  "circle",
                  {
                    cx: H.x ?? j.x,
                    cy: H.y,
                    r: 4,
                    fill: H.color,
                    stroke: "var(--dsc-black)",
                    strokeWidth: "1"
                  },
                  H.id
                )
              )
            ] }) : null
          ] }) : /* @__PURE__ */ s.jsx(
            "text",
            {
              x: m / 2,
              y: r / 2,
              textAnchor: "middle",
              fill: "var(--dsc-gray-5)",
              fontSize: "12",
              children: d
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
          left: `${Math.min(92, Math.max(8, j.x / m * 100))}%`
        },
        children: [
          /* @__PURE__ */ s.jsx("div", { className: "dsc-chart-tooltip-time", children: Hm(j.t) }),
          xe.map(
            (H) => H.v == null ? null : /* @__PURE__ */ s.jsxs("div", { className: "dsc-chart-tooltip-row", children: [
              /* @__PURE__ */ s.jsx("i", { style: { background: H.color } }),
              /* @__PURE__ */ s.jsxs("span", { children: [
                H.label || H.id,
                " ",
                H.v.toFixed(H.v >= 100 ? 0 : 1),
                H.unit ? ` ${H.unit}` : ""
              ] })
            ] }, H.id)
          )
        ]
      }
    ) : null,
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chart-legend", children: [
      a.filter((H) => H.label).map((H, V) => /* @__PURE__ */ s.jsxs("span", { className: "dsc-chart-legend-item", children: [
        /* @__PURE__ */ s.jsx("i", { style: { background: H.color || Ki[V % Ki.length] } }),
        H.label
      ] }, H.id)),
      ge != null ? /* @__PURE__ */ s.jsxs("span", { className: "dsc-chart-last", children: [
        ge.toFixed(1),
        o ? ` ${o}` : a[0]?.unit ? ` ${a[0].unit}` : ""
      ] }) : null
    ] })
  ] });
}
function Hb(a, r = 280) {
  const [o, u] = y.useState(a);
  return y.useEffect(() => {
    if (!Number.isFinite(a)) {
      u(a);
      return;
    }
    const d = Number.isFinite(o) ? o : a, h = performance.now();
    let p = 0;
    const b = (m) => {
      const g = Math.min(1, (m - h) / r), v = 1 - (1 - g) ** 3;
      u(d + (a - d) * v), g < 1 && (p = requestAnimationFrame(b));
    };
    return p = requestAnimationFrame(b), () => cancelAnimationFrame(p);
  }, [a, r]), o;
}
function Um(a, r, o, u) {
  return { x: a + o * Math.cos(u), y: r + o * Math.sin(u) };
}
function rn({
  value: a,
  min: r = 0,
  max: o = 100,
  label: u,
  unit: d = "",
  target: h,
  band: p,
  extrema: b,
  stale: m,
  onClick: g
}) {
  const v = Number.isFinite(a) ? a : NaN, _ = Hb(Number.isFinite(v) ? v : r), j = Number.isFinite(v) ? _ : r, w = Math.min(o, Math.max(r, j)), M = Math.max(o - r, 1e-6), A = Number.isFinite(v) ? (w - r) / M : 0, k = 46, B = 2 * Math.PI * k * 0.75, P = B * A, G = (ce) => {
    const he = Math.min(1, Math.max(0, (ce - r) / M));
    return Math.PI - he * Math.PI;
  }, ne = p && Number.isFinite(v) ? v >= p.min && v <= p.max : !0, le = Number.isFinite(v) ? m ? "var(--dsc-amber)" : ne ? "var(--dsc-teal)" : "var(--dsc-amber)" : "var(--dsc-gray-4)", X = [];
  p && X.push({ v: p.min, kind: "band" }, { v: p.max, kind: "band" }), b?.min != null && X.push({ v: b.min, kind: "ext" }), b?.max != null && X.push({ v: b.max, kind: "ext" }), h != null && Number.isFinite(h) && X.push({ v: h, kind: "target" });
  const W = /* @__PURE__ */ s.jsxs(
    "div",
    {
      className: `dsc-gauge${!ne && Number.isFinite(v) ? " is-warn" : ""}${m ? " is-stale" : ""}${g ? " is-clickable" : ""}`,
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
              stroke: le,
              strokeWidth: "10",
              strokeLinecap: "round",
              strokeDasharray: `${P} ${B}`,
              filter: "url(#dsc-gauge-glow)",
              style: { transition: "stroke-dasharray 220ms ease, stroke 220ms ease" }
            }
          ),
          X.map((ce, he) => {
            const we = G(ce.v), xe = Um(60, 72, ce.kind === "ext" ? k - 2 : k + 1, we), ge = Um(60, 72, k - (ce.kind === "target" ? 14 : 10), we), H = ce.kind === "target" ? "var(--dsc-teal)" : ce.kind === "band" ? "var(--dsc-amber)" : "var(--dsc-gray-5)";
            return /* @__PURE__ */ s.jsx(
              "line",
              {
                x1: ge.x,
                y1: ge.y,
                x2: xe.x,
                y2: xe.y,
                stroke: H,
                strokeWidth: ce.kind === "target" ? 2.4 : 1.6,
                strokeLinecap: "round",
                opacity: ce.kind === "ext" ? 0.65 : 0.95
              },
              `${ce.kind}-${he}`
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
          /* @__PURE__ */ s.jsx("text", { x: "60", y: "74", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: m ? "HELD" : d })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-gauge-label", children: u })
      ]
    }
  );
  return g ? /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-gauge-hit", onClick: g, title: `History · ${u}`, children: W }) : W;
}
function bp({
  series: a,
  color: r = "var(--dsc-blue)",
  width: o = 120,
  height: u = 28
}) {
  if (a.length < 2)
    return /* @__PURE__ */ s.jsx("div", { className: "dsc-sparkline dsc-muted", style: { width: o, height: u } });
  const d = a.map((j) => j.v), h = Math.min(...d), p = Math.max(...d), b = Math.max(p - h, 1e-6), m = a[0].t, g = a[a.length - 1].t, v = Math.max(g - m, 1), _ = a.map((j, w) => {
    const M = (j.t - m) / v * o, A = u - (j.v - h) / b * (u - 4) - 2;
    return `${w === 0 ? "M" : "L"}${M.toFixed(1)} ${A.toFixed(1)}`;
  }).join(" ");
  return /* @__PURE__ */ s.jsx("svg", { className: "dsc-sparkline", width: o, height: u, "aria-hidden": !0, children: /* @__PURE__ */ s.jsx("path", { d: _, fill: "none", stroke: r, strokeWidth: "1.6", strokeLinecap: "round" }) });
}
function _p({
  rows: a
}) {
  return /* @__PURE__ */ s.jsx("div", { className: "dsc-gotwant", children: a.map((r) => {
    const o = r.want != null ? r.want : r.wantMin != null && r.wantMax != null ? (r.wantMin + r.wantMax) / 2 : NaN, u = Math.max(
      Number.isFinite(r.got) ? r.got : 0,
      Number.isFinite(o) ? o : 0,
      r.wantMax ?? 0,
      1
    ), d = Number.isFinite(r.got) ? r.got / u * 100 : 0, h = Number.isFinite(o) ? o / u * 100 : 0;
    return /* @__PURE__ */ s.jsxs("div", { className: "dsc-gotwant-row", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-gotwant-label", children: r.label }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-gotwant-track", children: [
        Number.isFinite(o) ? /* @__PURE__ */ s.jsx("div", { className: "dsc-gotwant-want", style: { width: `${h}%` } }) : null,
        /* @__PURE__ */ s.jsx("div", { className: "dsc-gotwant-got", style: { width: `${d}%` } })
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
function Bm(a) {
  if (!a.length) return {};
  let r = a[0].v, o = a[0].v;
  for (const u of a)
    u.v < r && (r = u.v), u.v > o && (o = u.v);
  return { min: r, max: o };
}
const so = [
  { label: "Cycle", hours: 12 },
  { label: "Photo", hours: 18 }
];
function io({
  hours: a,
  setHours: r,
  extras: o
}) {
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-timespan", role: "group", "aria-label": "Chart timespan", children: [
    zb.map((u) => /* @__PURE__ */ s.jsxs(
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
function yp({
  open: a,
  onClose: r,
  entityId: o,
  label: u,
  unit: d = "",
  color: h = "var(--dsc-blue)"
}) {
  const { hours: p, setHours: b, maxPoints: m } = ao(6), g = Je(o || "", { hours: p, maxPoints: m }), v = p <= 18 ? p * 2 : Math.min(p + 24, 48), _ = Je(o || "", { hours: v, maxPoints: m }), j = y.useMemo(() => {
    const M = p * 3600 * 1e3, A = Date.now() - M;
    return _.series.filter((k) => k.t < A).map((k) => ({ t: k.t + M, v: k.v }));
  }, [_.series, p]), w = !o || g.series.length < 2;
  return /* @__PURE__ */ s.jsxs(
    Ms,
    {
      open: a && !!o,
      onClose: r,
      title: u ? `History · ${u}` : "History",
      children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: [
          /* @__PURE__ */ s.jsx(io, { hours: p, setHours: b, extras: so }),
          w ? /* @__PURE__ */ s.jsx(Q, { label: "Thin recorder", tone: "warn" }) : null,
          j.length > 1 ? /* @__PURE__ */ s.jsx(Q, { label: "Prior window ghost", tone: "muted" }) : null
        ] }),
        o ? /* @__PURE__ */ s.jsx(
          un,
          {
            live: !0,
            unit: d,
            lastSyncAt: g.lastSyncAt,
            series: [
              {
                id: o,
                label: u,
                series: g.series,
                color: h,
                unit: d
              },
              ...j.length > 1 ? [
                {
                  id: `${o}-ghost`,
                  label: `${u} prior`,
                  series: j,
                  color: h,
                  unit: d,
                  ghost: !0
                }
              ] : []
            ]
          }
        ) : null,
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 10, fontSize: 12 }, children: o })
      ]
    }
  );
}
const jp = "sensor.dsc_hub_uptime", Sp = "sensor.dsc_hub_heartbeat";
function Ze(a) {
  const { num: r, available: o, tick: u, entity: d } = Ce(), h = y.useRef(null), [, p] = y.useState(0), b = !o(jp) || !o(Sp), m = o(a), g = r(a);
  return y.useEffect(() => {
    if (m && Number.isFinite(g)) {
      if (b && g === 0 && h.current != null) {
        p((v) => v + 1);
        return;
      }
      h.current = { value: g, at: Date.now() }, p((v) => v + 1);
      return;
    }
    p((v) => v + 1);
  }, [a, m, g, b, u, d]), m && Number.isFinite(g) && !(b && g === 0 && h.current != null) ? { value: g, stale: !1, heldAt: h.current?.at, live: !0 } : h.current != null ? {
    value: h.current.value,
    stale: !0,
    heldAt: h.current.at,
    live: !1
  } : { value: NaN, stale: !m, heldAt: void 0, live: !1 };
}
function co(a) {
  const { available: r, entity: o, tick: u } = Ce();
  if (r(a)) return null;
  const d = o(a)?.last_changed;
  if (!d) return null;
  const h = Date.parse(d);
  return Number.isFinite(h) ? Date.now() - h : null;
}
function Lb() {
  return co(jp);
}
function Ub() {
  return co(Sp);
}
function Bb() {
  return co("binary_sensor.dsc_hub_panel_link");
}
function $b({ pot: a }) {
  const { available: r, state: o, num: u } = Ce(), d = o(`sensor.dsc_pot${a}_expected_stage`, "—"), h = o(`sensor.dsc_pot${a}_days_since_sprout`, "—"), p = o(`sensor.dsc_pot${a}_need_summary`, "—"), b = o(`binary_sensor.dsc_pot${a}_untrusted`) === "on", m = u(`sensor.dsc_pot${a}_dryback_pct`), g = o(`input_select.dsc_pot${a}_tent`, "unassigned"), v = g === "clone" ? o("light.dsc_hub_sf1000_dimmer") === "on" : o("binary_sensor.dsc_hub_4x8_window_open") === "on", _ = g === "clone" || g === "main" ? v : !1, j = Number.isFinite(m) && m > 55 ? "dryback stress" : p !== "—" && p !== "ok" ? "Need" : "calm";
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-plant-extra", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
      /* @__PURE__ */ s.jsx(Q, { label: _ ? "Awake" : "Asleep", tone: _ ? "ok" : "muted" }),
      /* @__PURE__ */ s.jsx(Q, { label: `Day ${h}`, tone: "muted" }),
      /* @__PURE__ */ s.jsx(Q, { label: d === "—" ? "No stage Got" : d, tone: d === "—" ? "muted" : "ok" }),
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
function fc({
  pot: a,
  onSelectPot: r
}) {
  const { hass: o, state: u, entity: d, callService: h, available: p, tick: b, num: m } = Ce(), g = dt(), v = ya(a, { state: u, entity: d }), [_, j] = y.useState(v.plantName === "—" ? "" : v.plantName), [w, M] = y.useState(v.sprout === "—" ? "" : v.sprout), [A, k] = y.useState(v.growthStage === "—" ? "" : v.growthStage), [B, P] = y.useState(v.notes === "—" ? "" : v.notes), [G, ne] = y.useState(null), [le, X] = y.useState(null);
  y.useEffect(() => {
    j(v.plantName === "—" ? "" : v.plantName), M(v.sprout === "—" ? "" : v.sprout), k(v.growthStage === "—" ? "" : v.growthStage), P(v.notes === "—" ? "" : v.notes), ne(null);
  }, [a]);
  const W = ul(a, "moisture", u), ce = ul(a, "ec", u), he = ul(a, "ph", u), we = `sensor.dsc_pot${a}_dryback_pct`, xe = Ze(W), ge = Ze(we), H = Je(W, { hours: 6, maxPoints: 72 }), V = Je(ce, { hours: 6, maxPoints: 72 }), K = m(`input_number.dsc_pot${a}_learned_ec_per_moisture`), T = p(`input_number.dsc_pot${a}_learned_ec_per_moisture`) && Number.isFinite(K) && K !== 0 ? K : NaN, O = p(`sensor.dsc_pot${a}_want_moisture_min`) ? m(`sensor.dsc_pot${a}_want_moisture_min`) : m(`number.dsc_pot${a}_want_moisture_min`), Z = p(`sensor.dsc_pot${a}_want_moisture_max`) ? m(`sensor.dsc_pot${a}_want_moisture_max`) : m(`number.dsc_pot${a}_want_moisture_max`), ee = m(`sensor.dsc_pot${a}_want_ec_min`), ue = m(`sensor.dsc_pot${a}_want_ec_max`), N = m(`sensor.dsc_pot${a}_want_ph_min`), U = m(`sensor.dsc_pot${a}_want_ph_max`), J = Number.isFinite(O) && Number.isFinite(Z) && (p(`sensor.dsc_pot${a}_want_moisture_min`) || p(`number.dsc_pot${a}_want_moisture_min`)), I = Number.isFinite(ee) && Number.isFinite(ue), se = Number.isFinite(N) && Number.isFinite(U), F = !v.strainDisplay || v.strainDisplay === "—" || /generic/i.test(v.strainDisplay), fe = async (Ne) => {
    ne(null);
    try {
      await h("input_select", "select_option", {
        entity_id: `input_select.dsc_pot${a}_tent`,
        option: Ne
      }), window.setTimeout(() => {
        (o?.states?.[`input_select.dsc_pot${a}_tent`]?.state || "") !== Ne && ne("Tent apply failed — check helper options (clone|main|unassigned).");
      }, 400);
    } catch {
      ne("Tent apply failed — check helper options (clone|main|unassigned).");
    }
  }, Ue = () => {
    p(`text.dsc_pot${a}_plant_name`) && h("text", "set_value", {
      entity_id: `text.dsc_pot${a}_plant_name`,
      value: _
    });
  }, Ee = () => {
    const Ne = `datetime.dsc_pot${a}_sprout_date`;
    if (!p(Ne) || !w) return;
    const Wt = w.length === 10 ? `${w}T00:00:00` : w;
    h("datetime", "set_value", { entity_id: Ne, datetime: Wt });
  }, Nt = () => {
    if (v.rosterSlot == null) return;
    const Ne = `input_text.dsc_plant_roster_${v.rosterSlot}_notes`;
    !p(Ne) && d(Ne), h("input_text", "set_value", { entity_id: Ne, value: B });
  }, nn = d(`select.dsc_pot${a}_growth_stage`)?.attributes?.options || [];
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-seat-panel", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 14 }, children: [
      oc(u).map((Ne) => /* @__PURE__ */ s.jsxs(
        "button",
        {
          type: "button",
          className: `dsc-chip${Ne === a ? " dsc-chip--ok" : ""}`,
          onClick: () => r?.(Ne),
          children: [
            /* @__PURE__ */ s.jsx(On, { spec: Rl(Ne, u, d), size: 16 }),
            " P",
            Ne
          ]
        },
        Ne
      )),
      /* @__PURE__ */ s.jsx(Q, { label: no(v.tent), tone: v.tent === "unassigned" ? "muted" : "ok" }),
      v.rosterSlot != null ? /* @__PURE__ */ s.jsx(Q, { label: `Roster #${v.rosterSlot}`, tone: "muted" }) : /* @__PURE__ */ s.jsx(Q, { label: "No roster join", tone: "warn" }),
      xe.stale ? /* @__PURE__ */ s.jsx(Q, { label: "HELD Got", tone: "warn" }) : null
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-seat-layout", children: [
      /* @__PURE__ */ s.jsxs(re, { className: "dsc-glass dsc-glass--glow", title: "Medium", children: [
        /* @__PURE__ */ s.jsx(cb, { layers: v.layers, spec: Rl(a, u, d) }),
        /* @__PURE__ */ s.jsx($b, { pot: a }),
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 10, fontSize: 12 }, children: v.blend || "Blend lives on roster after commit — not invented here." })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", style: { gap: 14 }, children: [
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(re, { className: "dsc-glass", title: "Identity", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-seat-editors", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "Nickname",
            /* @__PURE__ */ s.jsx(
              "input",
              {
                value: _,
                onChange: (Ne) => j(Ne.target.value),
                onBlur: Ue,
                disabled: !p(`text.dsc_pot${a}_plant_name`)
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
                onChange: (Ne) => M(Ne.target.value),
                onBlur: Ee,
                disabled: !p(`datetime.dsc_pot${a}_sprout_date`)
              }
            )
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "Growth stage",
            /* @__PURE__ */ s.jsxs(
              "select",
              {
                value: A,
                onChange: (Ne) => {
                  const Wt = Ne.target.value;
                  if (k(Wt), !Wt) return;
                  const $t = `select.dsc_pot${a}_growth_stage`;
                  p($t) && h("select", "select_option", { entity_id: $t, option: Wt });
                },
                disabled: !p(`select.dsc_pot${a}_growth_stage`),
                children: [
                  /* @__PURE__ */ s.jsx("option", { value: "", children: "—" }),
                  nn.map((Ne) => /* @__PURE__ */ s.jsx("option", { value: Ne, children: Ne }, Ne))
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
            uc,
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
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(re, { className: "dsc-glass", title: "Want · Got · Need", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
            /* @__PURE__ */ s.jsx(
              Q,
              {
                label: `Got M ${xe.stale ? `${Number.isFinite(xe.value) ? xe.value.toFixed(0) : "—"}*` : v.moisture}`,
                tone: xe.stale ? "warn" : "ok"
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
          J && !F ? /* @__PURE__ */ s.jsx(
            _p,
            {
              rows: [
                {
                  label: "Moisture",
                  got: Number(v.moisture),
                  wantMin: O,
                  wantMax: Z,
                  unit: "%"
                },
                {
                  label: "EC",
                  got: Number(v.ec),
                  wantMin: I ? ee : void 0,
                  wantMax: I ? ue : void 0
                },
                {
                  label: "pH",
                  got: Number(v.ph),
                  wantMin: se ? N : void 0,
                  wantMax: se ? U : void 0
                }
              ]
            }
          ) : /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", style: { margin: "8px 0 0" }, children: [
            /* @__PURE__ */ s.jsx(Q, { label: "No catalog Want", tone: "warn" }),
            " ",
            F ? "Generic / empty strain — Want bands not invented." : "Custom Want helpers missing — Got + Need only."
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "dsc-kpi-sub", children: "Need is derived (catalog vs Got), not a feed invent." })
        ] }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(re, { className: "dsc-glass", title: "Dryback", children: /* @__PURE__ */ s.jsx(
          rn,
          {
            label: "Dryback",
            value: ge.value,
            min: 0,
            max: 100,
            unit: "%",
            stale: ge.stale,
            band: { min: 0, max: 45 },
            onClick: () => X({ id: we, label: "Dryback", unit: "%" })
          }
        ) }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(re, { className: "dsc-glass", title: "Got history", children: [
          /* @__PURE__ */ s.jsx(
            un,
            {
              live: !0,
              lastSyncAt: Math.max(H.lastSyncAt ?? 0, V.lastSyncAt ?? 0) || void 0,
              series: [
                {
                  id: "m",
                  label: "Moisture",
                  series: H.series,
                  color: "var(--dsc-blue)",
                  axis: "left",
                  unit: "%"
                },
                {
                  id: "ec",
                  label: "EC",
                  series: V.series,
                  color: "var(--dsc-amber)",
                  axis: "right",
                  unit: ""
                }
              ]
            }
          ),
          /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: Number.isFinite(T) ? `EC consumption honesty: learned ${T.toFixed(3)} EC per moisture (not feed invent).` : "EC over time shown — no learned_ec_per_moisture yet (not invented)." }),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginTop: 8 }, children: [
            /* @__PURE__ */ s.jsx(oe, { onClick: () => X({ id: W, label: "Moisture", unit: "%" }), children: "Moisture hist" }),
            /* @__PURE__ */ s.jsx(oe, { onClick: () => X({ id: ce, label: "EC", unit: "" }), children: "EC hist" }),
            /* @__PURE__ */ s.jsx(oe, { onClick: () => X({ id: he, label: "pH", unit: "" }), children: "pH hist" })
          ] })
        ] }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(re, { className: "dsc-glass", title: "Nutrition", children: [
          /* @__PURE__ */ s.jsx("p", { style: { margin: "0 0 6px" }, children: v.recipe || "No roster recipe — catalog doses only, never invented." }),
          /* @__PURE__ */ s.jsxs("label", { className: "dsc-seat-editors", children: [
            "Roster notes",
            /* @__PURE__ */ s.jsx(
              "textarea",
              {
                rows: 3,
                value: B,
                onChange: (Ne) => P(Ne.target.value),
                onBlur: Nt,
                disabled: v.rosterSlot == null
              }
            )
          ] }),
          /* @__PURE__ */ s.jsx("div", { style: { marginTop: 10 }, children: /* @__PURE__ */ s.jsx(Ss, { to: "/grow/compose", children: /* @__PURE__ */ s.jsx(oe, { teal: !0, children: "Mix in Compose" }) }) })
        ] }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(re, { className: "dsc-glass", title: "Live Got chips", children: [
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
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(re, { className: "dsc-glass", title: "Apply to tent", children: [
          /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "Digital-twin placement. Moves the plant on Twin; does not rewrite climate Want." }),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-seat-actions", children: [
            /* @__PURE__ */ s.jsx(oe, { primary: v.tent === "clone", onClick: () => void fe("clone"), children: "Clone 2×4" }),
            /* @__PURE__ */ s.jsx(oe, { primary: v.tent === "main", onClick: () => void fe("main"), children: "Main 4×8" }),
            /* @__PURE__ */ s.jsx(oe, { onClick: () => void fe("unassigned"), children: "Unassigned" }),
            /* @__PURE__ */ s.jsx(Ss, { to: "/live/twin", children: /* @__PURE__ */ s.jsx(oe, { children: "Open Twin" }) })
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
      yp,
      {
        open: le != null,
        onClose: () => X(null),
        entityId: le?.id ?? null,
        label: le?.label ?? "",
        unit: le?.unit
      }
    )
  ] });
}
function Gb() {
  const a = dt();
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Bt,
      {
        icon: "compose",
        title: "Compose",
        subtitle: "Build soil blend, roster commit, and Want handoff.",
        primaryAction: /* @__PURE__ */ s.jsx(oe, { teal: !0, onClick: () => a("/grow/roster"), children: "Open Roster / Seat" }),
        actions: /* @__PURE__ */ s.jsx(oe, { primary: !0, onClick: () => a("/grow/research"), children: "Browse Catalog" })
      }
    ),
    /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Densified catalog traits (height / flowering / chem) show when the index has them. Empty catalog fields stay empty — Compose does not invent Want bands or strain genetics. After commit, open Roster to assign a seat." }),
    /* @__PURE__ */ s.jsx(wb, {})
  ] });
}
function qb() {
  const a = dt();
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Bt,
      {
        icon: "research",
        title: "Research",
        subtitle: "Catalog browser over /local/dsc-catalog indexes.",
        actions: /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(oe, { primary: !0, onClick: () => a("/grow/compose"), children: "Use in Compose" }),
          /* @__PURE__ */ s.jsx(oe, { teal: !0, onClick: () => a("/grow/roster"), children: "Open Seat" })
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Catalog gaps are honesty, not placeholders. Height / flowering / chem chips come from densified indexes when present. Use in Compose to draft a plant; Open Seat to assign an existing roster row — neither invents missing Want/Got." }),
    /* @__PURE__ */ s.jsx(kb, {})
  ] });
}
function Yb() {
  const { entity: a, state: r, tick: o } = Ce(), [u, d] = rc(), h = ub(a), p = Number(u.get("pot") || 0), b = p >= 1 && p <= 4 && Ht(p, r) ? p : null, m = (v) => {
    if (!Ht(v, r)) return;
    const _ = new URLSearchParams(u);
    _.set("pot", String(v)), d(_, { replace: !0 });
  }, g = () => {
    const v = new URLSearchParams(u);
    v.delete("pot"), d(v, { replace: !0 });
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Bt,
      {
        icon: "roster",
        title: "Roster",
        subtitle: "Seats — open a row for Plant Seat drawer. Nutrient mix lives in Compose.",
        primaryAction: /* @__PURE__ */ s.jsx(Ss, { to: "/grow/compose", children: /* @__PURE__ */ s.jsx(oe, { primary: !0, children: "Use in Compose" }) })
      }
    ),
    /* @__PURE__ */ s.jsx(re, { className: "dsc-glass", title: "Roster", icon: "roster", children: h.length ? /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", children: [
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
        const _ = Number(v.pot), j = _ >= 1 && _ <= 4, w = j && Ht(_, r), M = j ? no(lc(r, _)) : "—", A = j ? r(`sensor.dsc_pot${_}_need_summary`, "—") : "—", k = j ? Rl(_, r, a) : null;
        return /* @__PURE__ */ s.jsxs(
          "tr",
          {
            onClick: () => {
              w && m(_);
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
                k ? /* @__PURE__ */ s.jsx(On, { spec: k, size: 22 }) : null,
                "P",
                _,
                w ? null : /* @__PURE__ */ s.jsx(Q, { label: "OOS", tone: "warn" })
              ] }) : "—" }),
              /* @__PURE__ */ s.jsx("td", { children: A }),
              /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx(Q, { label: M, tone: "muted" }) })
            ]
          },
          v.slot
        );
      }) })
    ] }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "No plants in roster yet. Commit from Compose, then assign a pot." }) }),
    /* @__PURE__ */ s.jsx(
      Ms,
      {
        open: b != null,
        onClose: g,
        title: b != null ? `Plant seat · POT${b}` : "Plant seat",
        children: b != null ? /* @__PURE__ */ s.jsx(fc, { pot: b, onSelectPot: m }) : null
      }
    )
  ] });
}
function Qb() {
  const [a, r] = y.useState(null), o = dt(), u = pt();
  y.useEffect(() => {
    const p = (b) => {
      const m = b.detail, g = Number(m?.pot);
      g >= 1 && g <= 4 && r(g);
    };
    return window.addEventListener("dsc-dash-select-pot", p), () => window.removeEventListener("dsc-dash-select-pot", p);
  }, []);
  const d = y.useCallback(() => r(null), []);
  return /* @__PURE__ */ s.jsx(
    gt,
    {
      open: a != null,
      onDismiss: d,
      title: a != null ? `Plant seat · POT${a}` : "Plant seat",
      help: null,
      children: a != null ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx(fc, { pot: a, onSelectPot: r }),
        u.pathname !== "/live/root" ? /* @__PURE__ */ s.jsx("div", { className: "dsc-row-actions", style: { marginTop: 12 }, children: /* @__PURE__ */ s.jsx(
          oe,
          {
            teal: !0,
            onClick: () => {
              const p = a;
              d(), o(`/live/root?pot=${p}`);
            },
            children: "Open Root"
          }
        ) }) : null
      ] }) : null
    }
  );
}
const wp = y.createContext(null);
function Vb(a) {
  return a === "clone" || a === "compare" || a === "room" || a === "main" ? a : "main";
}
function Xb({ children: a }) {
  const [r, o] = rc(), u = Vb(r.get("tent") ?? r.get("zone")), d = y.useCallback(
    (p) => {
      const b = new URLSearchParams(r);
      b.set("tent", p), b.delete("zone"), o(b, { replace: !0 });
    },
    [r, o]
  ), h = y.useMemo(() => ({ focus: u, setFocus: d }), [u, d]);
  return /* @__PURE__ */ s.jsx(wp.Provider, { value: h, children: a });
}
function Np() {
  const a = y.useContext(wp);
  return a || {
    focus: "main",
    setFocus: () => {
    }
  };
}
function Uu(a) {
  if (!Number.isFinite(a) || a < 0) return "—";
  const r = Math.floor(a / 1e3);
  if (r < 60) return `${Math.max(1, r)}S`;
  const o = Math.floor(r / 60);
  if (o < 60) return `${o}M`;
  const u = Math.floor(o / 60), d = o % 60;
  return u < 48 ? d > 0 ? `${u}H ${d}M` : `${u}H` : `${(u / 24).toFixed(1)}D`;
}
function Ep() {
  const { available: a, state: r } = Ce(), o = r("binary_sensor.dsc_hub_link") === "on", u = a("binary_sensor.dsc_hub_link"), d = r("sensor.dsc_hub_api_down_age", "—"), h = r("sensor.dsc_hub_link_recovery_bounces", "—"), p = r("sensor.dsc_hub_rf_status", "—"), b = r("sensor.dsc_hub_ha_handshake_age", "—");
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
    /* @__PURE__ */ s.jsx(
      Q,
      {
        icon: o ? "ok" : "alert",
        label: u ? o ? "HUB LINK" : "HUB LINK DOWN" : "HUB LINK —",
        tone: o ? "ok" : "bad"
      }
    ),
    /* @__PURE__ */ s.jsx(Q, { label: `Age ${d}`, tone: "muted" }),
    /* @__PURE__ */ s.jsx(Q, { label: `Bounces ${h}`, tone: "muted" }),
    /* @__PURE__ */ s.jsx(Q, { label: `RF ${p}`, tone: "muted" }),
    /* @__PURE__ */ s.jsx(Q, { label: `Handshake ${b}`, tone: "muted" })
  ] });
}
const Zb = "_allocated";
function on(a, r, o) {
  const u = o.num(r);
  return o.forceKind === "mass-balance" ? {
    value: o.num(a, u),
    kind: "mass-balance",
    entityId: a,
    nameplate: Number.isFinite(u) ? u : void 0
  } : o.available(a) && Number.isFinite(o.num(a)) ? {
    value: o.num(a),
    kind: a.endsWith(Zb) ? "allocated" : "nameplate",
    entityId: a,
    nameplate: Number.isFinite(u) ? u : void 0
  } : {
    value: u,
    kind: "nameplate",
    entityId: r,
    nameplate: Number.isFinite(u) ? u : void 0
  };
}
function Kb(a) {
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
function mt({ reading: a }) {
  const r = a.kind === "nameplate" ? "warn" : "ok";
  return /* @__PURE__ */ s.jsx(
    Q,
    {
      label: Kb(a.kind),
      tone: r,
      icon: a.kind === "nameplate" ? "alert" : "ok"
    }
  );
}
const Fi = {
  hub: { x: 160, y: 88 },
  ac: { x: 48, y: 40 },
  mister: { x: 48, y: 136 },
  tank: { x: 160, y: 168 },
  pot1: { x: 280, y: 36 },
  pot2: { x: 340, y: 36 },
  pot3: { x: 280, y: 140 },
  pot4: { x: 340, y: 140 }
};
function $m(a) {
  switch (a) {
    case "ok":
      return "var(--dsc-teal)";
    case "held":
      return "var(--dsc-amber)";
    case "oos":
    case "missing":
    case "dark":
      return "var(--dsc-gray-5)";
    default:
      return a;
  }
}
function Fb(a, r) {
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
function Jb(a) {
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
function Mp({ nodes: a }) {
  const r = a.find((o) => o.id === "hub");
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-kit-pulse", children: [
    /* @__PURE__ */ s.jsxs("svg", { viewBox: "0 0 400 210", className: "dsc-kit-constellation", "aria-label": "Kit pulse", children: [
      a.map((o) => {
        const u = Fi.hub, d = Fi[o.id];
        if (!d || o.id === "hub") return null;
        const h = o.status !== "ok";
        return /* @__PURE__ */ s.jsx(
          "line",
          {
            x1: u.x,
            y1: u.y,
            x2: d.x,
            y2: d.y,
            stroke: $m(r?.status === "ok" && !h ? "ok" : "dark"),
            strokeWidth: "1.2",
            strokeDasharray: h || r?.status !== "ok" ? "4 4" : void 0,
            opacity: 0.7
          },
          `edge-${o.id}`
        );
      }),
      a.map((o) => {
        const u = Fi[o.id] || Fi.hub, d = o.status !== "ok";
        return /* @__PURE__ */ s.jsxs("g", { transform: `translate(${u.x},${u.y})`, children: [
          /* @__PURE__ */ s.jsx(
            "circle",
            {
              r: o.id === "hub" ? 16 : 11,
              fill: d ? "none" : "rgba(38,198,218,0.12)",
              stroke: $m(o.status),
              strokeWidth: "1.6",
              strokeDasharray: d ? "3 3" : void 0
            }
          ),
          /* @__PURE__ */ s.jsx("text", { textAnchor: "middle", y: "4", fill: "currentColor", fontSize: "8", children: o.label.replace("Pot ", "P") })
        ] }, o.id);
      })
    ] }),
    /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: a.map((o) => /* @__PURE__ */ s.jsx(Q, { label: Fb(o.status, o.label), tone: Jb(o.status) }, o.id)) })
  ] });
}
const Wb = [
  { id: "binary_sensor.dsc_hub_emergency_failsafe", label: "Emergency failsafe" },
  { id: "binary_sensor.dsc_hub_climate_sensor_fault", label: "Climate sensor fault" },
  { id: "binary_sensor.dsc_hub_aux_sensor_fault", label: "Aux sensor fault" },
  { id: "binary_sensor.dsc_hub_root_zone_sensor_fault", label: "Root-zone probes" },
  { id: "binary_sensor.dsc_clone_dark_period_violation", label: "Clone dark violation" },
  { id: "binary_sensor.dsc_reduced_kit", label: "Reduced kit" }
];
function Pb() {
  const { state: a, num: r, available: o, entity: u, tick: d } = Ce(), h = dt(), [p, b] = y.useState(!1), m = o("sensor.dsc_hub_uptime"), g = Lb(), v = Ub(), _ = Bb(), j = r("sensor.dsc_active_alert_count", 0), w = Ze("sensor.dsc_hub_tent_temperature"), M = Ze("sensor.dsc_hub_tent_humidity"), A = Ze("sensor.dsc_hub_vpd_kpa"), k = Ze("sensor.dsc_hub_clone_temperature"), B = Ze("sensor.dsc_hub_clone_humidity"), P = Ze("sensor.dsc_hub_clone_vpd_kpa"), G = Ze("sensor.dsc_pot1_got_moisture"), ne = Ze("sensor.dsc_pot2_got_moisture"), le = Ze("sensor.dsc_pot3_got_moisture"), X = Ze("sensor.dsc_pot4_got_moisture"), W = [G, ne, le, X], he = a("binary_sensor.dsc_hub_panel_link") === "on", we = a("sensor.dsc_hub_heartbeat", "NO BEAT"), xe = o("sensor.dsc_hub_heartbeat"), ge = a("switch.dsc_hub_manual_takeover") === "on", H = a("switch.dsc_hub_tent_manual_override") === "on", V = a("switch.dsc_hub_tent_full_auto_mode") === "on", K = a("binary_sensor.dsc_reduced_kit") === "on", T = String(u("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? ""), O = V && !ge, Z = a("sensor.dsc_fleet_version_status", "—"), ee = Wb.filter((F) => a(F.id) === "on"), ue = Dn.map((F) => ya(F, { state: a, entity: u })), N = lo(a), U = on("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available: o,
    num: r
  }), J = (F, fe) => fe ? F ? "ok" : "oos" : "missing", I = [
    { id: "hub", label: "Hub", status: o("binary_sensor.dsc_hub_link") ? a("binary_sensor.dsc_hub_link") === "on" ? "ok" : "dark" : "missing" },
    {
      id: "ac",
      label: "AC",
      status: J(a("input_boolean.dsc_ac_in_service") === "on", o("input_boolean.dsc_ac_in_service"))
    },
    {
      id: "mister",
      label: "Mister",
      status: J(
        a("input_boolean.dsc_clone_humidifier_in_service") === "on",
        o("input_boolean.dsc_clone_humidifier_in_service")
      )
    },
    ...Dn.map((F) => ({
      id: `pot${F}`,
      label: `Pot ${F}`,
      status: J(Ht(F, a), o(`input_boolean.dsc_pot${F}_in_service`))
    })),
    {
      id: "tank",
      label: "Tank",
      status: J(a("input_boolean.dsc_tank_in_service") === "on", o("input_boolean.dsc_tank_in_service"))
    }
  ], se = w.stale || M.stale || A.stale || k.stale || B.stale || P.stale;
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Bt,
      {
        icon: "mission",
        title: "Mission",
        subtitle: "Triage glance — Next, faults, seats, lung. Command lives on Climate.",
        primaryAction: /* @__PURE__ */ s.jsx(oe, { teal: !0, onClick: () => h("/live/twin"), children: "Open Twin" }),
        actions: /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(oe, { primary: !0, onClick: () => h("/live/climate"), children: "Climate Want" }),
          /* @__PURE__ */ s.jsx(to, { label: "Search", icon: "search", onClick: () => b(!0) }),
          /* @__PURE__ */ s.jsx(
            uc,
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
          icon: m ? "ok" : "alert",
          label: m ? "HUB ONLINE" : "HUB OFFLINE",
          tone: m ? "ok" : "bad"
        }
      ),
      m ? null : /* @__PURE__ */ s.jsx(
        Q,
        {
          label: `OFF ${g != null ? Uu(g) : "—"}`,
          tone: "bad",
          pulse: !0
        }
      ),
      se ? /* @__PURE__ */ s.jsx(Q, { label: "HELD VITALS", tone: "warn" }) : null,
      /* @__PURE__ */ s.jsx(Q, { label: `${N.inService} of ${N.total} in service`, tone: N.inService === N.total ? "ok" : "warn" }),
      /* @__PURE__ */ s.jsx(
        Q,
        {
          label: he ? "PANEL ESP-NOW" : o("sensor.dsc_control_wifi_rssi") ? "PANEL HA-ONLY" : "PANEL OFFLINE",
          tone: he ? "ok" : o("sensor.dsc_control_wifi_rssi") ? "warn" : "bad"
        }
      ),
      !he && !o("sensor.dsc_control_wifi_rssi") ? /* @__PURE__ */ s.jsx(
        Q,
        {
          label: `PANEL OFF ${_ != null ? Uu(_) : "—"}`,
          tone: "bad",
          pulse: !0
        }
      ) : null,
      /* @__PURE__ */ s.jsx(
        Q,
        {
          icon: xe ? "ok" : "alert",
          label: xe ? `BEAT ${we}` : "NO BEAT",
          tone: xe ? "ok" : "bad"
        }
      ),
      xe ? null : /* @__PURE__ */ s.jsx(Q, { label: `BEAT OFF ${v != null ? Uu(v) : "—"}`, tone: "bad", pulse: !0 }),
      /* @__PURE__ */ s.jsx(
        Q,
        {
          icon: j === 0 ? "ok" : "alert",
          label: j === 0 ? "All clear" : `${j} alert(s)`,
          tone: j === 0 ? "ok" : "bad",
          pulse: j > 0
        }
      ),
      /* @__PURE__ */ s.jsx(
        Q,
        {
          label: Z === "ok" ? "FLEET OK" : Z === "warn" ? "FLEET WARN" : "FLEET DRIFT",
          tone: Z === "ok" ? "ok" : Z === "warn" ? "warn" : "bad"
        }
      ),
      V ? /* @__PURE__ */ s.jsx(Q, { icon: "ok", label: "FULL AUTO", tone: "ok", pulse: !0 }) : null,
      O ? /* @__PURE__ */ s.jsx(Q, { label: "AUTO-DRIVEN", tone: "ok" }) : null,
      ge ? /* @__PURE__ */ s.jsx(Q, { icon: "alert", label: "MANUAL TAKEOVER", tone: "warn", pulse: !0 }) : null,
      H ? /* @__PURE__ */ s.jsx(Q, { icon: "alert", label: "FAN OVERRIDE", tone: "warn", pulse: !0 }) : null,
      V && K ? /* @__PURE__ */ s.jsx(Q, { icon: "alert", label: T || "REDUCED KIT", tone: "warn", pulse: !0 }) : null
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid dsc-mission-modern", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(eb, {}) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(re, { className: "dsc-glass", title: "Hub link", icon: "fleet", children: /* @__PURE__ */ s.jsx(Ep, {}) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(re, { className: "dsc-glass", title: "Kit pulse", icon: "ok", children: /* @__PURE__ */ s.jsx(Mp, { nodes: I }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(re, { className: "dsc-glass", title: "Lung CFM", icon: "climate", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ s.jsx(mt, { reading: U }),
        /* @__PURE__ */ s.jsxs("button", { type: "button", className: "dsc-chip", onClick: () => h("/live/climate"), children: [
          "OUT ",
          Number.isFinite(U.value) ? Math.round(U.value) : "—",
          " cfm → Climate"
        ] })
      ] }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(re, { className: "dsc-glass", title: "Plant seats", icon: "seat", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: ue.map((F) => {
        const fe = !Ht(F.pot, a), Ue = dc(F.pot, a), Ee = W[F.pot - 1], Nt = !fe && !Ue.blockNeedAct && F.need && F.need !== "—" && F.need !== "ok";
        return /* @__PURE__ */ s.jsxs(
          "button",
          {
            type: "button",
            className: `dsc-chip${fe ? "" : " dsc-chip--ok"}${Nt ? " dsc-chip--pulse" : ""}`,
            onClick: () => window.dispatchEvent(new CustomEvent("dsc-dash-select-pot", { detail: { pot: F.pot } })),
            title: fe ? "OOS — no fake Got" : F.need,
            children: [
              /* @__PURE__ */ s.jsx(On, { spec: Rl(F.pot, a, u), size: 18 }),
              "P",
              F.pot,
              " ",
              F.plantName !== "—" ? F.plantName : "—",
              " · Got M",
              " ",
              fe ? "—" : Ee.stale ? `${Number.isFinite(Ee.value) ? Ee.value.toFixed(0) : "—"}*` : F.moisture,
              fe ? " · OOS" : ` · Need ${F.need}`,
              Ee.stale && !fe ? " · HELD" : "",
              Ue.labels.length ? ` · ${Ue.labels.join("/")}` : ""
            ]
          },
          F.pot
        );
      }) }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(re, { className: "dsc-glass", title: "Faults / alerts", icon: "alert", children: ee.length === 0 && j === 0 ? /* @__PURE__ */ s.jsx("div", { className: "dsc-empty dsc-empty--ok", children: "No active faults — all clear." }) : /* @__PURE__ */ s.jsxs("ul", { className: "dsc-fault-list", children: [
        ee.map((F) => /* @__PURE__ */ s.jsxs("li", { children: [
          /* @__PURE__ */ s.jsx(Q, { label: F.label, tone: "bad", pulse: !0, icon: "alert" }),
          /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", children: F.id })
        ] }, F.id)),
        j > 0 && ee.length === 0 ? /* @__PURE__ */ s.jsxs("li", { children: [
          /* @__PURE__ */ s.jsx(Q, { label: `${j} system alert(s)`, tone: "bad", pulse: !0, icon: "alert" }),
          /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", children: "See Fleet for entity detail" })
        ] }) : null
      ] }) }) })
    ] }),
    /* @__PURE__ */ s.jsx(Ms, { open: p, onClose: () => b(!1), title: "Quick jump", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: [
      { path: "/live/climate", label: "Climate" },
      { path: "/live/twin", label: "Twin" },
      { path: "/live/main", label: "Main" },
      { path: "/live/clone", label: "Clone" },
      { path: "/live/root", label: "Root" },
      { path: "/live/light", label: "Light" },
      { path: "/grow/compose", label: "Compose" },
      { path: "/fleet", label: "Fleet" }
    ].map((F) => /* @__PURE__ */ s.jsx(
      "button",
      {
        type: "button",
        className: "dsc-btn teal",
        onClick: () => {
          b(!1), h(F.path);
        },
        children: F.label
      },
      F.path
    )) }) })
  ] });
}
function An(a) {
  return a.kind === "allocated" || a.kind === "mass-balance" ? void 0 : "6 5";
}
function bs(a) {
  return Number.isFinite(a) ? String(Math.round(a)) : "—";
}
function Ib({
  intakeClone: a,
  intakeMain: r,
  outCfm: o,
  recircCfm: u
}) {
  const d = (Number.isFinite(a.value) ? a.value : 0) + (Number.isFinite(r.value) ? r.value : 0);
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-lung-loop", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ s.jsx(mt, { reading: o }),
      /* @__PURE__ */ s.jsx(mt, { reading: u }),
      /* @__PURE__ */ s.jsx(mt, { reading: a }),
      /* @__PURE__ */ s.jsx(mt, { reading: r }),
      /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", style: { fontSize: 12 }, children: "Cascade 2×4→4×8 · solid = allocated, dashed = nameplate" })
    ] }),
    /* @__PURE__ */ s.jsxs("svg", { viewBox: "0 0 640 180", className: "dsc-lung-svg", "aria-label": "Lung loop", children: [
      /* @__PURE__ */ s.jsx("rect", { x: "8", y: "48", width: "90", height: "84", rx: "10", fill: "none", stroke: "var(--dsc-teal)", strokeWidth: "1.6" }),
      /* @__PURE__ */ s.jsx("text", { x: "53", y: "92", textAnchor: "middle", fill: "currentColor", fontSize: "11", children: "Room" }),
      /* @__PURE__ */ s.jsx(
        "rect",
        {
          x: "130",
          y: "18",
          width: "140",
          height: "64",
          rx: "8",
          fill: "none",
          stroke: "var(--dsc-teal)",
          strokeWidth: "1.8",
          strokeDasharray: An(a)
        }
      ),
      /* @__PURE__ */ s.jsx("text", { x: "200", y: "48", textAnchor: "middle", fill: "currentColor", fontSize: "11", children: "2×4" }),
      /* @__PURE__ */ s.jsxs("text", { x: "200", y: "66", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: [
        bs(a.value),
        " cfm in"
      ] }),
      /* @__PURE__ */ s.jsx(
        "rect",
        {
          x: "130",
          y: "100",
          width: "140",
          height: "64",
          rx: "8",
          fill: "none",
          stroke: "var(--dsc-blue)",
          strokeWidth: "1.8",
          strokeDasharray: An(r)
        }
      ),
      /* @__PURE__ */ s.jsx("text", { x: "200", y: "130", textAnchor: "middle", fill: "currentColor", fontSize: "11", children: "4×8" }),
      /* @__PURE__ */ s.jsxs("text", { x: "200", y: "148", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: [
        bs(r.value),
        " cfm in"
      ] }),
      /* @__PURE__ */ s.jsx(
        "path",
        {
          d: "M270 50 L330 50 L330 132 L270 132",
          fill: "none",
          stroke: "var(--dsc-amber)",
          strokeWidth: "2",
          strokeDasharray: An(a)
        }
      ),
      /* @__PURE__ */ s.jsxs("text", { x: "352", y: "96", fill: "var(--dsc-amber)", fontSize: "10", children: [
        "cascade ",
        bs(d)
      ] }),
      /* @__PURE__ */ s.jsx(
        "rect",
        {
          x: "430",
          y: "18",
          width: "120",
          height: "64",
          rx: "8",
          fill: "none",
          stroke: "#ff8a65",
          strokeWidth: "1.8",
          strokeDasharray: An(o)
        }
      ),
      /* @__PURE__ */ s.jsx("text", { x: "490", y: "48", textAnchor: "middle", fill: "currentColor", fontSize: "11", children: "DUMP" }),
      /* @__PURE__ */ s.jsxs("text", { x: "490", y: "66", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: [
        bs(o.value),
        " cfm"
      ] }),
      /* @__PURE__ */ s.jsx(
        "rect",
        {
          x: "430",
          y: "100",
          width: "120",
          height: "64",
          rx: "8",
          fill: "none",
          stroke: "#b388ff",
          strokeWidth: "1.8",
          strokeDasharray: An(u)
        }
      ),
      /* @__PURE__ */ s.jsx("text", { x: "490", y: "130", textAnchor: "middle", fill: "currentColor", fontSize: "11", children: "RECIRC" }),
      /* @__PURE__ */ s.jsxs("text", { x: "490", y: "148", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: [
        bs(u.value),
        " cfm"
      ] }),
      /* @__PURE__ */ s.jsx("path", { d: "M98 90 L130 50", fill: "none", stroke: "var(--dsc-teal)", strokeWidth: "1.5", strokeDasharray: An(a) }),
      /* @__PURE__ */ s.jsx("path", { d: "M98 90 L130 132", fill: "none", stroke: "var(--dsc-blue)", strokeWidth: "1.5", strokeDasharray: An(r) }),
      /* @__PURE__ */ s.jsx("path", { d: "M270 132 L430 132", fill: "none", stroke: "#b388ff", strokeWidth: "1.5", strokeDasharray: An(u) }),
      /* @__PURE__ */ s.jsx("path", { d: "M270 50 L430 50", fill: "none", stroke: "#ff8a65", strokeWidth: "1.5", strokeDasharray: An(o) })
    ] }),
    /* @__PURE__ */ s.jsx(Q, { label: "Mass-balance exhaust = Σ intake × dump/recirc split", tone: "muted" })
  ] });
}
function Ae(a, r = 1) {
  return Number.isFinite(a) ? a.toFixed(r) : "—";
}
const e_ = [
  { id: "main", label: "Main" },
  { id: "clone", label: "Clone" },
  { id: "room", label: "Room" },
  { id: "compare", label: "Compare" }
];
function t_() {
  const a = dt();
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page dsc-page--twin-chrome", children: [
    /* @__PURE__ */ s.jsx(
      Bt,
      {
        icon: "twin",
        title: "Twin",
        subtitle: "Cinematic digital twin — pick a pot to open Root seat.",
        primaryAction: /* @__PURE__ */ s.jsx(oe, { teal: !0, onClick: () => a("/live/climate"), children: "Set Climate Want" }),
        actions: /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(oe, { onClick: () => a("/live/main"), children: "Main cockpit" }),
          /* @__PURE__ */ s.jsx(oe, { onClick: () => a("/live/clone"), children: "Clone cockpit" })
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty dsc-muted", style: { marginTop: 0 }, children: "Pick a pot in the twin to open its seat. Twin stays warm across Twin / Main / Clone. 4×8 fixture glow follows photoperiod window until a main lamp is wired." })
  ] });
}
function n_() {
  const { num: a, state: r, entity: o, available: u } = Ce(), d = dt(), { focus: h, setFocus: p } = Np(), { hours: b, setHours: m, maxPoints: g } = ao(6), [v, _] = y.useState(null), j = r("switch.dsc_hub_tent_manual_override") === "on", w = r("switch.dsc_hub_tent_full_auto_mode") === "on", M = String(o("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? ""), A = Ze("sensor.dsc_hub_tent_temperature"), k = Ze("sensor.dsc_hub_tent_humidity"), B = Ze("sensor.dsc_hub_clone_temperature"), P = Ze("sensor.dsc_hub_clone_humidity"), G = Ze("sensor.dsc_hub_vpd_kpa"), ne = Je("sensor.dsc_hub_tent_temperature", { hours: b, maxPoints: g }), le = Je("sensor.dsc_hub_tent_humidity", { hours: b, maxPoints: g }), X = Je("sensor.dsc_hub_clone_temperature", { hours: b, maxPoints: g }), W = Je("sensor.dsc_hub_clone_humidity", { hours: b, maxPoints: g }), ce = u("sensor.dsc_cfm_exhaust_out_allocated") ? "sensor.dsc_cfm_exhaust_out_allocated" : "sensor.dsc_cfm_exhaust_out", he = u("sensor.dsc_cfm_exhaust_recirc_allocated") ? "sensor.dsc_cfm_exhaust_recirc_allocated" : "sensor.dsc_cfm_exhaust_recirc", we = Je(ce, { hours: b, maxPoints: g }), xe = Je(he, { hours: b, maxPoints: g }), ge = Je("sensor.dsc_fan_exhaust_outside_pct", { hours: b, maxPoints: g }), H = Je("sensor.dsc_fan_exhaust_room_pct", { hours: b, maxPoints: g }), V = on("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available: u,
    num: a
  }), K = on(
    "sensor.dsc_cfm_exhaust_recirc_allocated",
    "sensor.dsc_cfm_exhaust_recirc",
    { available: u, num: a }
  ), T = on(
    "sensor.dsc_cfm_intake_main_allocated",
    "sensor.dsc_cfm_intake_main",
    { available: u, num: a }
  ), O = on(
    "sensor.dsc_cfm_intake_2x4_allocated",
    "sensor.dsc_cfm_intake_2x4",
    { available: u, num: a }
  ), Z = V.nameplate ?? a("sensor.dsc_cfm_exhaust_out"), ee = V.value, ue = K.nameplate ?? a("sensor.dsc_cfm_exhaust_recirc"), N = K.value, U = ob(a("sensor.dsc_hub_room_temperature"), a("sensor.dsc_hub_room_humidity")), J = h === "room" || h === "compare", I = a("number.dsc_hub_target_temp"), se = a("number.dsc_hub_rh_target_min"), F = a("number.dsc_hub_rh_target_max"), fe = a("number.dsc_hub_vpd_target_min"), Ue = a("number.dsc_hub_vpd_target_max"), Ee = a("number.dsc_hub_clone_target_temp"), Nt = a("number.dsc_hub_clone_rh_min"), nn = a("number.dsc_hub_clone_rh_max"), Ne = a("number.dsc_hub_clone_vpd_min"), Wt = a("number.dsc_hub_clone_vpd_max"), $t = y.useMemo(() => Bm(ne.series), [ne.series]), ja = y.useMemo(() => Bm(le.series), [le.series]), Hn = h === "main" || h === "compare", Ol = h === "clone" || h === "compare";
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Bt,
      {
        icon: "climate",
        title: "Climate",
        subtitle: "Command, Want targets, zone traces, VPD, airflow honesty.",
        actions: /* @__PURE__ */ s.jsx(
          uc,
          {
            label: "Climate settings",
            items: [
              { id: "mission", label: "Mission", onSelect: () => d("/live/mission") },
              { id: "main", label: "Main cockpit", onSelect: () => d("/live/main") },
              { id: "clone", label: "Clone cockpit", onSelect: () => d("/live/clone") },
              { id: "fleet", label: "Fleet kit", onSelect: () => d("/fleet") }
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 14 }, role: "group", "aria-label": "Tent focus", children: [
      e_.map((ol) => /* @__PURE__ */ s.jsx(
        "button",
        {
          type: "button",
          className: `dsc-chip${h === ol.id ? " dsc-chip--ok" : ""}`,
          onClick: () => p(ol.id),
          children: ol.label
        },
        ol.id
      )),
      /* @__PURE__ */ s.jsx(io, { hours: b, setHours: m, extras: so }),
      /* @__PURE__ */ s.jsx(oe, { teal: !0, onClick: () => d("/fleet"), children: "Kit / Fleet" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(re, { className: "dsc-glass", title: "Command", icon: "climate", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-row", children: [
          /* @__PURE__ */ s.jsx(Re, { entityId: "switch.dsc_hub_tent_full_auto_mode", label: "Full Auto", icon: "ok" }),
          /* @__PURE__ */ s.jsx(Re, { entityId: "switch.dsc_hub_manual_takeover", label: "Master takeover", icon: "alert" }),
          /* @__PURE__ */ s.jsx(Re, { entityId: "switch.dsc_hub_tent_manual_override", label: "Fan override", icon: "climate" }),
          /* @__PURE__ */ s.jsx(
            Re,
            {
              entityId: "switch.dsc_hub_humidifier_intake_routing",
              label: "Hum intake routing",
              icon: "climate"
            }
          ),
          /* @__PURE__ */ s.jsx(
            Re,
            {
              entityId: "switch.dsc_hub_recirc_de_strat_pulse",
              label: "RECIRC de-strat",
              icon: "climate"
            }
          )
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-selects", children: [
          /* @__PURE__ */ s.jsx(Al, { entityId: "select.dsc_hub_control_strategy", label: "Strategy", icon: "climate" }),
          /* @__PURE__ */ s.jsx(Al, { entityId: "select.dsc_hub_priority_tent", label: "Priority tent", icon: "tent" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-demand-row", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ s.jsx(Re, { entityId: "switch.dsc_hub_heater_demand", label: "Heat", icon: "climate" }),
          /* @__PURE__ */ s.jsx(
            Re,
            {
              entityId: "switch.dsc_hub_ac_demand",
              label: "Cool",
              icon: "climate",
              warnWhenMissing: r("binary_sensor.dsc_ac_capacity_offline") === "on" ? "AC ○" : void 0
            }
          ),
          /* @__PURE__ */ s.jsx(Re, { entityId: "switch.dsc_hub_humidifier_demand", label: "Hum", icon: "climate" }),
          /* @__PURE__ */ s.jsx(Re, { entityId: "switch.dsc_hub_dehumidifier_demand", label: "Dehum", icon: "climate" }),
          /* @__PURE__ */ s.jsx(Re, { entityId: "switch.dsc_hub_grow_mat_demand", label: "Mat", icon: "root" }),
          /* @__PURE__ */ s.jsx(Re, { entityId: "switch.dsc_hub_clone_humidifier_demand", label: "C-Hum", icon: "clone" })
        ] }),
        w ? /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
          /* @__PURE__ */ s.jsx(
            Q,
            {
              icon: "alert",
              label: r("binary_sensor.dsc_reduced_kit") === "on" ? "Reduced kit" : "Full Auto",
              tone: r("binary_sensor.dsc_reduced_kit") === "on" ? "warn" : "ok"
            }
          ),
          " ",
          M || "Hub owns fans + appliance Autos when Full Auto is on."
        ] }) : null
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(re, { className: "dsc-glass", title: "Targets", icon: "gauge", children: [
        /* @__PURE__ */ s.jsx(gp, { emphasize: h === "clone" ? "clone" : "main" }),
        /* @__PURE__ */ s.jsx(
          _p,
          {
            rows: [
              {
                label: "Main T",
                got: A.value,
                want: I,
                unit: "°C"
              },
              {
                label: "Main RH",
                got: k.value,
                wantMin: se,
                wantMax: F,
                unit: "%"
              },
              {
                label: "Clone T",
                got: B.value,
                want: Ee,
                unit: "°C"
              },
              {
                label: "Clone RH",
                got: P.value,
                wantMin: Nt,
                wantMax: nn,
                unit: "%"
              }
            ]
          }
        )
      ] }) }),
      Hn ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(
          Xe,
          {
            label: "Tent °C",
            value: Ae(A.value),
            unit: "°C",
            stale: A.stale,
            onClick: () => _({ id: "sensor.dsc_hub_tent_temperature", label: "Tent T", unit: "°C" })
          }
        ) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(
          Xe,
          {
            label: "Tent RH",
            value: Ae(k.value, 0),
            unit: "%",
            stale: k.stale,
            onClick: () => _({ id: "sensor.dsc_hub_tent_humidity", label: "Tent RH", unit: "%" })
          }
        ) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(
          Xe,
          {
            label: "VPD",
            value: Ae(G.value, 2),
            unit: "kPa",
            stale: G.stale,
            onClick: () => _({ id: "sensor.dsc_hub_vpd_kpa", label: "VPD", unit: "kPa" })
          }
        ) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(Xe, { label: "Room °C", value: Ae(a("sensor.dsc_hub_room_temperature")), unit: "°C" }) })
      ] }) : null,
      Ol ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(
          Xe,
          {
            label: "Clone °C",
            value: Ae(B.value),
            unit: "°C",
            stale: B.stale
          }
        ) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(
          Xe,
          {
            label: "Clone RH",
            value: Ae(P.value, 0),
            unit: "%",
            stale: P.stale
          }
        ) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(Xe, { label: "Clone VPD", value: Ae(a("sensor.dsc_hub_clone_vpd_kpa"), 2), unit: "kPa" }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(Xe, { label: "Room °C", value: Ae(a("sensor.dsc_hub_room_temperature")), unit: "°C" }) })
      ] }) : null,
      J ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(Xe, { label: "Room °C", value: Ae(a("sensor.dsc_hub_room_temperature")), unit: "°C" }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(Xe, { label: "Room RH", value: Ae(a("sensor.dsc_hub_room_humidity"), 0), unit: "%" }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(
          Xe,
          {
            label: "Room AH",
            value: Number.isFinite(U) ? U.toFixed(1) : "—",
            unit: "g/m³",
            sub: Number.isFinite(U) ? void 0 : "Need T+RH"
          }
        ) })
      ] }) : null,
      h === "compare" ? /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(re, { className: "dsc-glass", title: "Compare T + RH", icon: "tent", children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "One chart: 4×8 solid, 2×4 ghost. Not two dashboards." }),
        /* @__PURE__ */ s.jsx(
          un,
          {
            lastSyncAt: Math.max(
              ne.lastSyncAt ?? 0,
              le.lastSyncAt ?? 0,
              X.lastSyncAt ?? 0,
              W.lastSyncAt ?? 0
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
                series: le.series,
                color: "var(--dsc-teal)",
                axis: "right",
                unit: "%"
              },
              {
                id: "t-ghost",
                label: "2×4 T",
                series: X.series,
                color: "var(--dsc-blue)",
                axis: "left",
                unit: "°C",
                ghost: !0
              },
              {
                id: "rh-ghost",
                label: "2×4 RH",
                series: W.series,
                color: "var(--dsc-teal)",
                axis: "right",
                unit: "%",
                ghost: !0
              }
            ],
            targets: [
              { axis: "left", value: I, color: "var(--dsc-amber)", label: "Want T" },
              { axis: "right", min: se, max: F, color: "var(--dsc-teal)" }
            ]
          }
        )
      ] }) }) : null,
      Hn && h !== "compare" ? /* @__PURE__ */ s.jsx("div", { className: Ol ? "dsc-col-6" : "dsc-col-12", children: /* @__PURE__ */ s.jsx(re, { className: "dsc-glass", title: "Main tent T + RH", icon: "tent", children: /* @__PURE__ */ s.jsx(
        un,
        {
          lastSyncAt: Math.max(ne.lastSyncAt ?? 0, le.lastSyncAt ?? 0) || void 0,
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
              series: le.series,
              color: "var(--dsc-teal)",
              axis: "right",
              unit: "%"
            }
          ],
          targets: [
            { axis: "left", value: I, color: "var(--dsc-amber)", label: "Want T" },
            { axis: "right", min: se, max: F, color: "var(--dsc-teal)" }
          ]
        }
      ) }) }) : null,
      Ol && h !== "compare" ? /* @__PURE__ */ s.jsx("div", { className: Hn ? "dsc-col-6" : "dsc-col-12", children: /* @__PURE__ */ s.jsx(re, { className: "dsc-glass", title: "Clone tent T + RH", icon: "clone", children: /* @__PURE__ */ s.jsx(
        un,
        {
          lastSyncAt: Math.max(X.lastSyncAt ?? 0, W.lastSyncAt ?? 0) || void 0,
          series: [
            {
              id: "t",
              label: "Temp °C",
              series: X.series,
              color: "var(--dsc-blue)",
              axis: "left",
              unit: "°C"
            },
            {
              id: "rh",
              label: "RH %",
              series: W.series,
              color: "var(--dsc-teal)",
              axis: "right",
              unit: "%"
            }
          ],
          targets: [
            {
              axis: "left",
              value: Ee,
              color: "var(--dsc-amber)",
              label: "Want T"
            },
            { axis: "right", min: Nt, max: nn, color: "var(--dsc-teal)" }
          ]
        }
      ) }) }) : null,
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-col-3", children: [
        /* @__PURE__ */ s.jsx(
          Xe,
          {
            label: "CFM OUT",
            value: Ae(ee, 0),
            unit: "cfm",
            sub: `Nameplate ${Ae(Z, 0)}`
          }
        ),
        /* @__PURE__ */ s.jsx(mt, { reading: V })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-col-3", children: [
        /* @__PURE__ */ s.jsx(
          Xe,
          {
            label: "CFM RECIRC",
            value: Ae(N, 0),
            unit: "cfm",
            sub: `Nameplate ${Ae(ue, 0)}`
          }
        ),
        /* @__PURE__ */ s.jsx(mt, { reading: K })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-col-3", children: [
        /* @__PURE__ */ s.jsx(Xe, { label: "Intake main", value: Ae(T.value, 0), unit: "cfm" }),
        /* @__PURE__ */ s.jsx(mt, { reading: T })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-col-3", children: [
        /* @__PURE__ */ s.jsx(Xe, { label: "Intake 2×4", value: Ae(O.value, 0), unit: "cfm" }),
        /* @__PURE__ */ s.jsx(mt, { reading: O })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(re, { className: "dsc-glass", title: "Airflow honesty", icon: "climate", children: [
        /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: [
          /* @__PURE__ */ s.jsx(mt, { reading: V }),
          " ",
          /* @__PURE__ */ s.jsx(mt, { reading: K }),
          " ",
          "Lung loop is mass-balance, not a second isometric tent. 4×8 light = window proxy until GPIO lamp."
        ] }),
        /* @__PURE__ */ s.jsx(
          Ib,
          {
            intakeClone: O,
            intakeMain: T,
            outCfm: V,
            recircCfm: K
          }
        )
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(re, { className: "dsc-glass", title: "Exhaust CFM (allocated)", icon: "climate", children: /* @__PURE__ */ s.jsx(
        un,
        {
          unit: "cfm",
          lastSyncAt: Math.max(we.lastSyncAt ?? 0, xe.lastSyncAt ?? 0) || void 0,
          series: [
            {
              id: "out",
              label: "OUT",
              series: we.series,
              color: "var(--dsc-blue)",
              unit: "cfm"
            },
            {
              id: "recirc",
              label: "RECIRC",
              series: xe.series,
              color: "var(--dsc-purple)",
              unit: "cfm"
            }
          ]
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(re, { className: "dsc-glass", title: "Fan duty %", icon: "climate", children: [
        /* @__PURE__ */ s.jsx(
          un,
          {
            unit: "%",
            lastSyncAt: Math.max(ge.lastSyncAt ?? 0, H.lastSyncAt ?? 0) || void 0,
            series: [
              {
                id: "fout",
                label: "OUT %",
                series: ge.series,
                color: "var(--dsc-teal)",
                unit: "%"
              },
              {
                id: "frec",
                label: "RECIRC %",
                series: H.series,
                color: "var(--dsc-amber)",
                unit: "%"
              }
            ]
          }
        ),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-fan-stack", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ s.jsx(
            rl,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_main",
              label: "Intake Main",
              disabled: !j
            }
          ),
          /* @__PURE__ */ s.jsx(
            rl,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_2x4",
              label: "Intake 2×4",
              disabled: !j
            }
          ),
          /* @__PURE__ */ s.jsx(
            rl,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_room",
              label: "Exhaust room",
              disabled: !j
            }
          ),
          /* @__PURE__ */ s.jsx(
            rl,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_outside",
              label: "Exhaust outside",
              disabled: !j
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(re, { className: "dsc-glass", title: "Zone gauges", icon: "gauge", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-gauge-row", children: [
        Hn ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(
            rn,
            {
              label: "Tent T",
              value: A.value,
              min: 15,
              max: 35,
              unit: "°C",
              target: I,
              extrema: $t,
              stale: A.stale,
              onClick: () => _({
                id: "sensor.dsc_hub_tent_temperature",
                label: "Tent T",
                unit: "°C"
              })
            }
          ),
          /* @__PURE__ */ s.jsx(
            rn,
            {
              label: "Tent RH",
              value: k.value,
              min: 0,
              max: 100,
              unit: "%",
              band: { min: se, max: F },
              extrema: ja,
              stale: k.stale
            }
          ),
          /* @__PURE__ */ s.jsx(
            rn,
            {
              label: "VPD",
              value: G.value,
              min: 0,
              max: 2.5,
              unit: "kPa",
              band: { min: fe, max: Ue },
              stale: G.stale
            }
          )
        ] }) : null,
        Ol ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(
            rn,
            {
              label: "Clone T",
              value: B.value,
              min: 15,
              max: 35,
              unit: "°C",
              target: Ee,
              stale: B.stale
            }
          ),
          /* @__PURE__ */ s.jsx(
            rn,
            {
              label: "Clone RH",
              value: P.value,
              min: 0,
              max: 100,
              unit: "%",
              band: { min: Nt, max: nn },
              stale: P.stale
            }
          ),
          /* @__PURE__ */ s.jsx(
            rn,
            {
              label: "Clone VPD",
              value: a("sensor.dsc_hub_clone_vpd_kpa"),
              min: 0,
              max: 2.5,
              unit: "kPa",
              band: { min: Ne, max: Wt }
            }
          )
        ] }) : null
      ] }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(re, { className: "dsc-glass", title: "Efficacy", icon: "alert", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ s.jsx(
          Q,
          {
            label: `Heat ${r("switch.dsc_hub_heater_demand") === "on" ? "ON" : "off"}`,
            tone: r("switch.dsc_hub_heater_demand") === "on" ? "ok" : "muted"
          }
        ),
        /* @__PURE__ */ s.jsx(
          Q,
          {
            label: `Cool ${r("switch.dsc_hub_ac_demand") === "on" ? "ON" : "off"}`,
            tone: r("switch.dsc_hub_ac_demand") === "on" ? "ok" : "muted"
          }
        ),
        /* @__PURE__ */ s.jsx(
          Q,
          {
            label: `Hum ${r("switch.dsc_hub_humidifier_demand") === "on" ? "ON" : "off"}`,
            tone: r("switch.dsc_hub_humidifier_demand") === "on" ? "ok" : "muted"
          }
        ),
        /* @__PURE__ */ s.jsx(
          Q,
          {
            label: `Dehum ${r("switch.dsc_hub_dehumidifier_demand") === "on" ? "ON" : "off"}`,
            tone: r("switch.dsc_hub_dehumidifier_demand") === "on" ? "ok" : "muted"
          }
        ),
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
            label: `Heat on ${Ae(a("sensor.dsc_heater_relay_on_time"), 0)}s`,
            tone: "muted"
          }
        ),
        /* @__PURE__ */ s.jsx(
          Q,
          {
            label: `Hum on ${Ae(a("sensor.dsc_humidifier_relay_on_time"), 0)}s`,
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
      yp,
      {
        open: v != null,
        onClose: () => _(null),
        entityId: v?.id ?? null,
        label: v?.label ?? "",
        unit: v?.unit
      }
    )
  ] });
}
function kp({ tent: a }) {
  const { state: r, entity: o, num: u, tick: d, callWS: h, available: p } = Ce(), b = dt(), { setFocus: m } = Np(), [g, v] = rc(), [_, j] = y.useState([]);
  y.useEffect(() => {
    m(a);
  }, [a, m]);
  const w = rb(a, r, o), M = Number(g.get("pot") || 0), A = M >= 1 && M <= 4 && Ht(M, r) && w.some((O) => O.pot === M) ? M : null, k = a === "main" ? "sensor.dsc_hub_tent_temperature" : "sensor.dsc_hub_clone_temperature", B = a === "main" ? "sensor.dsc_hub_tent_humidity" : "sensor.dsc_hub_clone_humidity", P = a === "main" ? "sensor.dsc_hub_vpd_kpa" : "sensor.dsc_hub_clone_vpd_kpa", G = Je(k, { hours: 6 }), ne = Je(B, { hours: 6 }), le = Ze(k), X = Ze(B), W = Ze(P), ce = r(
    a === "main" ? "binary_sensor.dsc_hub_4x8_window_open" : "binary_sensor.dsc_hub_2x4_window_open"
  ) === "on", he = r("light.dsc_hub_sf1000_dimmer") === "on", we = a === "clone" ? he : ce, xe = a === "main" ? on("sensor.dsc_cfm_intake_main_allocated", "sensor.dsc_cfm_intake_main", { available: p, num: u }) : on("sensor.dsc_cfm_intake_2x4_allocated", "sensor.dsc_cfm_intake_2x4", { available: p, num: u }), ge = on(
    "sensor.dsc_cfm_exhaust_out_allocated",
    "sensor.dsc_cfm_exhaust_out",
    { available: p, num: u }
  ), H = on(
    "sensor.dsc_cfm_exhaust_recirc_allocated",
    "sensor.dsc_cfm_exhaust_recirc",
    { available: p, num: u }
  ), V = r("switch.dsc_hub_tent_manual_override") === "on";
  y.useEffect(() => {
    let O = !1;
    async function Z() {
      if (!h || w.length === 0) {
        j([]);
        return;
      }
      const ee = w.flatMap((U) => [
        `text.dsc_pot${U.pot}_plant_name`,
        `input_select.dsc_pot${U.pot}_tent`,
        `select.dsc_pot${U.pot}_growth_stage`
      ]), ue = /* @__PURE__ */ new Date(), N = new Date(ue.getTime() - 48 * 3600 * 1e3);
      try {
        const U = await h({
          type: "history/history_during_period",
          start_time: N.toISOString(),
          end_time: ue.toISOString(),
          significant_changes_only: !0,
          minimal_response: !0,
          no_attributes: !0,
          entity_ids: ee.slice(0, 8)
        });
        if (O || !U) return;
        const J = [];
        for (const [I, se] of Object.entries(U))
          for (const F of se || []) {
            const fe = typeof F.lu == "number" ? F.lu * 1e3 : F.last_changed ? Date.parse(F.last_changed) : NaN, Ue = String(F.s ?? F.state ?? "");
            !Number.isFinite(fe) || !Ue || Ue === "unavailable" || J.push({ t: fe, text: `${new Date(fe).toLocaleString()} · ${I.split(".").pop()} → ${Ue}` });
          }
        J.sort((I, se) => se.t - I.t), j(J.slice(0, 40).map((I) => I.text));
      } catch {
        O || j([]);
      }
    }
    return Z(), () => {
      O = !0;
    };
  }, [h, w, a]);
  const K = a === "main" ? "Main 4×8" : "Clone 2×4", T = a === "main" ? "Intake main + cascade in · OUT / RECIRC" : "Intake 2×4 + cascade out · clone mister path";
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Bt,
      {
        icon: a === "main" ? "tent" : "clone",
        title: K,
        subtitle: `Tent cockpit — ${w.length} seat(s). ${T}`,
        primaryAction: /* @__PURE__ */ s.jsx(oe, { teal: !0, onClick: () => b("/live/twin"), children: "Both tents" }),
        actions: /* @__PURE__ */ s.jsx(oe, { primary: !0, onClick: () => b(`/live/climate?tent=${a}`), children: "Climate Want" })
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-tent-cockpit-strip", children: [
      /* @__PURE__ */ s.jsx(Q, { label: `${w.length} plants`, tone: "ok" }),
      /* @__PURE__ */ s.jsx(
        Q,
        {
          label: `T ${Ae(le.value)}°C`,
          tone: le.stale ? "warn" : "ok"
        }
      ),
      /* @__PURE__ */ s.jsx(
        Q,
        {
          label: `RH ${Ae(X.value, 0)}%`,
          tone: X.stale ? "warn" : "ok"
        }
      ),
      /* @__PURE__ */ s.jsx(
        Q,
        {
          label: `VPD ${Ae(W.value, 2)}`,
          tone: W.stale ? "warn" : "ok"
        }
      ),
      /* @__PURE__ */ s.jsx(
        Q,
        {
          label: a === "clone" ? we ? "SF1000 ON" : "SF1000 OFF" : ce ? "PHOTO ON" : "PHOTO OFF",
          tone: we ? "ok" : "muted"
        }
      ),
      /* @__PURE__ */ s.jsx(Q, { label: `IN ${Ae(xe.value, 0)} cfm`, tone: "muted" }),
      /* @__PURE__ */ s.jsx(mt, { reading: xe }),
      a === "main" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx(Q, { label: `OUT ${Ae(ge.value, 0)}`, tone: "muted" }),
        /* @__PURE__ */ s.jsx(mt, { reading: ge }),
        /* @__PURE__ */ s.jsx(Q, { label: `RECIRC ${Ae(H.value, 0)}`, tone: "muted" }),
        /* @__PURE__ */ s.jsx(mt, { reading: H })
      ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx(Q, { label: `CFM OUT ${Ae(ge.value, 0)}`, tone: "muted" }),
        /* @__PURE__ */ s.jsx(mt, { reading: ge })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(re, { className: "dsc-glass", title: "Want targets", icon: "climate", children: /* @__PURE__ */ s.jsx(gp, { only: a, compact: !0 }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(re, { className: "dsc-glass", title: "Seat strip", icon: "seat", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: w.length === 0 ? /* @__PURE__ */ s.jsx("div", { className: "dsc-empty", children: "No pots assigned — Apply to tent from a seat." }) : w.map((O) => {
        const Z = Number(r(`sensor.dsc_pot${O.pot}_dryback_pct`)), ee = Number.isFinite(Z) && Z > 45, ue = dc(O.pot, r), N = !ue.blockNeedAct && ee;
        return /* @__PURE__ */ s.jsxs(
          "button",
          {
            type: "button",
            className: `dsc-chip dsc-chip--ok${N ? " dsc-chip--pulse" : ""}`,
            onClick: () => {
              const U = new URLSearchParams(g);
              U.set("pot", String(O.pot)), v(U, { replace: !0 });
            },
            children: [
              /* @__PURE__ */ s.jsx(On, { spec: Rl(O.pot, r, o), size: 16 }),
              " P",
              O.pot,
              " ",
              O.plantName,
              " · M ",
              O.moisture,
              " · Need",
              " ",
              ue.blockNeedAct ? `${O.need} (no act)` : O.need,
              ee ? " · dryback warn" : ""
            ]
          },
          O.pot
        );
      }) }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(re, { className: "dsc-glass", title: "Tent history", icon: "climate", children: /* @__PURE__ */ s.jsx(
        un,
        {
          live: !0,
          lastSyncAt: Math.max(G.lastSyncAt ?? 0, ne.lastSyncAt ?? 0) || void 0,
          series: [
            {
              id: "t",
              label: "Temp",
              series: G.series,
              color: "var(--dsc-blue)",
              axis: "left",
              unit: "°C"
            },
            {
              id: "rh",
              label: "RH",
              series: ne.series,
              color: "var(--dsc-teal)",
              axis: "right",
              unit: "%"
            }
          ]
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(re, { className: "dsc-glass", title: "Fans (this tent)", icon: "climate", children: [
        V ? null : /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Fan sliders locked until Fan override is on (Climate → Command)." }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-fan-stack", children: a === "main" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(
            rl,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_main",
              label: "Intake Main",
              disabled: !V
            }
          ),
          /* @__PURE__ */ s.jsx(
            rl,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_room",
              label: "Exhaust room (RECIRC)",
              disabled: !V
            }
          ),
          /* @__PURE__ */ s.jsx(
            rl,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_outside",
              label: "Exhaust outside (OUT)",
              disabled: !V
            }
          )
        ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(
            rl,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_2x4",
              label: "Intake 2×4",
              disabled: !V
            }
          ),
          /* @__PURE__ */ s.jsx(
            Re,
            {
              entityId: "light.dsc_hub_sf1000_dimmer",
              label: "SF1000",
              icon: "lighting"
            }
          )
        ] }) })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(re, { className: "dsc-glass", title: "Plant log (48h)", icon: "roster", children: _.length === 0 ? /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: "Thin recorder / no recent identity changes — honesty empty, not invented." }) : /* @__PURE__ */ s.jsx("ul", { className: "dsc-fault-list", children: _.map((O) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", style: { fontFamily: "var(--dsc-mono)", fontSize: 12 }, children: O }) }, O)) }) }) })
    ] }),
    /* @__PURE__ */ s.jsx(
      Ms,
      {
        open: A != null,
        onClose: () => {
          const O = new URLSearchParams(g);
          O.delete("pot"), v(O, { replace: !0 });
        },
        title: A != null ? `Plant seat · POT${A}` : "Plant seat",
        children: A != null ? /* @__PURE__ */ s.jsx(
          fc,
          {
            pot: A,
            onSelectPot: (O) => {
              const Z = new URLSearchParams(g);
              Z.set("pot", String(O)), v(Z, { replace: !0 });
            }
          }
        ) : null
      }
    )
  ] });
}
function l_() {
  return /* @__PURE__ */ s.jsx(kp, { tent: "main" });
}
function a_() {
  return /* @__PURE__ */ s.jsx(kp, { tent: "clone" });
}
function s_() {
  const { state: a, entity: r, tick: o, num: u } = Ce(), [d, h] = rc(), [p, b] = y.useState(!1), m = Dn.map((M) => ya(M, { state: a, entity: r })), g = lo(a), v = Number(d.get("pot") || 0), _ = v >= 1 && v <= 4 && Ht(v, a) ? v : null, j = (M) => {
    const A = new URLSearchParams(d);
    A.set("pot", String(M)), h(A, { replace: !0 });
  }, w = () => {
    const M = new URLSearchParams(d);
    M.delete("pot"), h(M, { replace: !0 });
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Bt,
      {
        icon: "root",
        title: "Root",
        subtitle: `${g.inService} of ${g.total} in service — OOS labeled, never fake Got.`
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(Xe, { label: "Coldest root", value: Ae(u("sensor.dsc_coldest_root_zone_temp")), unit: "°C" }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(Xe, { label: "Heat mat on time", value: Ae(u("sensor.dsc_heatmat_relay_on_time"), 0), unit: "s" }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(re, { title: "Notes", children: /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: "Mat loop uses per-pot sense with plausibility filter." }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(re, { className: "dsc-glass", title: "Dryback strip", icon: "gauge", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-gauge-row", children: oc(a).map((M) => /* @__PURE__ */ s.jsx(i_, { pot: M, onOpen: () => j(M) }, M)) }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(re, { className: "dsc-glass dsc-root-matrix", title: "Fleet matrix", icon: "root", children: [
        /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: /* @__PURE__ */ s.jsx(oe, { onClick: () => b((M) => !M), children: p ? "Hide NPK" : "Show NPK" }) }),
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
            p ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx("th", { children: "N" }),
              /* @__PURE__ */ s.jsx("th", { children: "P" }),
              /* @__PURE__ */ s.jsx("th", { children: "K" })
            ] }) : null,
            /* @__PURE__ */ s.jsx("th", { children: "Need" }),
            /* @__PURE__ */ s.jsx("th", { children: "Rate" }),
            /* @__PURE__ */ s.jsx("th", { children: "Trend" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: m.map((M) => /* @__PURE__ */ s.jsx(c_, { pot: M.pot, showNpk: p, onOpen: () => j(M.pot) }, M.pot)) })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ s.jsx(
      Ms,
      {
        open: _ != null,
        onClose: w,
        title: _ != null ? `Plant seat · POT${_}` : "Plant seat",
        children: _ != null ? /* @__PURE__ */ s.jsx(fc, { pot: _, onSelectPot: j }) : null
      }
    )
  ] });
}
function i_({ pot: a, onOpen: r }) {
  const o = Ze(`sensor.dsc_pot${a}_dryback_pct`);
  return /* @__PURE__ */ s.jsx(
    rn,
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
function c_({
  pot: a,
  onOpen: r,
  showNpk: o
}) {
  const { state: u, entity: d, available: h } = Ce(), p = ya(a, { state: u, entity: d }), b = !Ht(a, u), m = dc(a, u), g = ul(a, "moisture", u), v = Je(g, { hours: 6, maxPoints: 48 }), _ = Ze(`sensor.dsc_pot${a}_dryback_pct`), j = `sensor.dsc_pot${a}_soil_moisture_rate`, w = Ze(j), M = h(j) || w.stale ? w.value : NaN, A = b || m.untrusted || _.stale ? "dsc-tone-stale" : Number.isFinite(_.value) && _.value > 55 ? "dsc-tone-bad" : Number.isFinite(_.value) && _.value > 40 ? "dsc-tone-warn" : "dsc-tone-ok", k = !b && !m.blockNeedAct && p.need && p.need !== "—" && p.need !== "ok";
  return /* @__PURE__ */ s.jsxs(
    "tr",
    {
      onClick: r,
      style: { cursor: "pointer" },
      className: m.tone === "muted" ? "dsc-tone-stale" : `dsc-tone-${m.tone}`,
      children: [
        /* @__PURE__ */ s.jsxs("td", { children: [
          /* @__PURE__ */ s.jsx(On, { spec: Rl(a, u, d), size: 18 }),
          " P",
          a,
          b ? " OOS" : "",
          m.labels.length ? ` · ${m.labels.join("/")}` : ""
        ] }),
        /* @__PURE__ */ s.jsx("td", { children: b ? "—" : p.plantName }),
        /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx(Q, { label: no(p.tent), tone: p.tent === "unassigned" || b ? "muted" : "ok" }) }),
        /* @__PURE__ */ s.jsx("td", { children: b ? "—" : p.moisture }),
        /* @__PURE__ */ s.jsx("td", { children: b ? "—" : p.soilTemp }),
        /* @__PURE__ */ s.jsx("td", { className: A, children: b ? "—" : Ae(_.value, 0) }),
        /* @__PURE__ */ s.jsx("td", { children: b ? "—" : p.ec }),
        /* @__PURE__ */ s.jsx("td", { children: b ? "—" : p.ph }),
        o ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("td", { children: b ? "—" : p.n }),
          /* @__PURE__ */ s.jsx("td", { children: b ? "—" : p.p }),
          /* @__PURE__ */ s.jsx("td", { children: b ? "—" : p.k })
        ] }) : null,
        /* @__PURE__ */ s.jsx("td", { className: k ? "dsc-tone-warn" : void 0, children: b ? "OOS" : m.blockNeedAct ? `${p.need} (no act)` : p.need }),
        /* @__PURE__ */ s.jsx("td", { className: w.stale ? "dsc-tone-stale" : void 0, children: Number.isFinite(M) ? M.toFixed(2) : "—" }),
        /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx(bp, { series: v.series, color: "var(--dsc-blue)", width: 90, height: 24 }) })
      ]
    }
  );
}
function r_() {
  const { available: a, state: r, num: o } = Ce(), u = dt(), [d, h] = y.useState(!1), p = r("binary_sensor.dsc_clone_dark_period_violation") === "on", b = r("light.dsc_hub_sf1000_dimmer") === "on", m = r("binary_sensor.dsc_hub_4x8_window_open") === "on", g = a("light.dsc_hub_4x8_dimmer") || a("light.dsc_hub_main_light"), v = o("sensor.dsc_expected_light_hours"), _ = o("sensor.dsc_clone_expected_light_hours"), j = Je("binary_sensor.dsc_hub_4x8_window_open", { hours: 24, maxPoints: 96 });
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Bt,
      {
        icon: "lighting",
        title: "Light",
        subtitle: "Photoperiod, SF1000, expected hours — 4×8 is window proxy until GPIO lamp.",
        primaryAction: /* @__PURE__ */ s.jsx(oe, { teal: !0, onClick: () => u("/live/climate"), children: "Climate Want" })
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-status-strip", children: [
      /* @__PURE__ */ s.jsx(
        Q,
        {
          icon: p ? "alert" : "ok",
          label: p ? "CLONE DARK VIOLATION" : "Dark period OK",
          tone: p ? "bad" : "ok",
          pulse: p
        }
      ),
      /* @__PURE__ */ s.jsx(Q, { label: b ? "SF1000 ON" : "SF1000 OFF", tone: b ? "ok" : "muted" }),
      /* @__PURE__ */ s.jsx(
        Q,
        {
          label: g ? "4×8 lamp" : m ? "4×8 Window proxy ON" : "4×8 Window proxy OFF",
          tone: g ? "ok" : "warn"
        }
      ),
      r("binary_sensor.dsc_hub_light_catchup_active") === "on" ? /* @__PURE__ */ s.jsx(Q, { label: "Catch-up", tone: "warn" }) : null,
      r("binary_sensor.dsc_clone_light_missing_in_window") === "on" ? /* @__PURE__ */ s.jsx(Q, { label: "Missing in window", tone: "bad" }) : null
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-col-3", children: [
        /* @__PURE__ */ s.jsx(Xe, { label: "Next event", value: r("sensor.dsc_next_light_event", "—") }),
        /* @__PURE__ */ s.jsx(ys, { label: r("sensor.dsc_next_light_event", "—") || "No next event", empty: !r("sensor.dsc_next_light_event") || r("sensor.dsc_next_light_event") === "unknown" })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(Xe, { label: "Expected hours", value: Ae(v, 1), unit: "h" }) }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-col-3", children: [
        /* @__PURE__ */ s.jsx(Xe, { label: "Clone expected", value: Ae(_, 1), unit: "h" }),
        /* @__PURE__ */ s.jsx(rn, { label: "Clone h", value: _, min: 0, max: 24, unit: "h" })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ s.jsx(rn, { label: "Hours", value: v, min: 0, max: 24, unit: "h" }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(re, { className: "dsc-glass", title: "Photoperiod spark", icon: "lighting", children: [
        /* @__PURE__ */ s.jsx(bp, { series: j.series, color: "var(--dsc-amber)", width: 280, height: 36 }),
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { fontSize: 12 }, children: "Window binary is the 4×8 schedule Got until entities.main_light exists." })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-8", children: /* @__PURE__ */ s.jsxs(re, { className: "dsc-glass", title: "SF1000", icon: "lighting", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-demand-row", children: [
          /* @__PURE__ */ s.jsx(
            Re,
            {
              entityId: "light.dsc_hub_sf1000_dimmer",
              label: "SF1000",
              icon: "lighting",
              showBrightness: !0
            }
          ),
          /* @__PURE__ */ s.jsx(Re, { entityId: "switch.dsc_hub_auto_photoperiod", label: "Auto photoperiod" }),
          /* @__PURE__ */ s.jsx(Re, { entityId: "switch.dsc_hub_manual_light_hold", label: "Manual light hold" })
        ] }),
        /* @__PURE__ */ s.jsx(oe, { onClick: () => h(!0), children: "Edit schedule (DecisionLayer)" })
      ] }) })
    ] }),
    /* @__PURE__ */ s.jsxs(
      gt,
      {
        open: d,
        onDismiss: () => h(!1),
        onConfirm: () => h(!1),
        title: "Light schedule",
        confirmLabel: "Done",
        help: null,
        children: [
          /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Same helpers as Lovelace lighting. 4×8 window is the schedule Got until a GPIO lamp exists." }),
          /* @__PURE__ */ s.jsx(Re, { entityId: "switch.dsc_hub_auto_photoperiod", label: "Auto photoperiod" }),
          /* @__PURE__ */ s.jsx(Al, { entityId: "select.dsc_hub_clone_photoperiod", label: "Window source", icon: "clone" }),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
            /* @__PURE__ */ s.jsx(Em, { entityId: "time.dsc_hub_lights_on_time", label: "4×8 opens" }),
            /* @__PURE__ */ s.jsx(Qe, { entityId: "number.dsc_hub_sunrise_duration", label: "Sunrise min" }),
            /* @__PURE__ */ s.jsx(Qe, { entityId: "number.dsc_hub_sunset_duration", label: "Sunset min" }),
            /* @__PURE__ */ s.jsx(Qe, { entityId: "number.dsc_hub_min_dark_hours", label: "Min dark h" })
          ] }),
          r("select.dsc_hub_clone_photoperiod") === "Independent" ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
            /* @__PURE__ */ s.jsx(Em, { entityId: "time.dsc_hub_clone_lights_on_time", label: "Clone lights-on" }),
            /* @__PURE__ */ s.jsx(Qe, { entityId: "number.dsc_hub_clone_light_hours", label: "Clone hours" })
          ] }) : /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
            "Clone follows 4×8 (",
            r("time.dsc_hub_lights_on_time", "—"),
            "). Switch Window source to Independent to unlock clone start/hours."
          ] }),
          /* @__PURE__ */ s.jsx(Re, { entityId: "light.dsc_hub_sf1000_dimmer", label: "SF1000", showBrightness: !0 }),
          /* @__PURE__ */ s.jsx(Re, { entityId: "switch.dsc_hub_manual_light_hold", label: "Manual light hold" })
        ]
      }
    )
  ] });
}
const u_ = [
  { label: "OUT", prefix: "dsc_cal_cfm_out", reset: "script.dsc_cal_reset_curve_out" },
  { label: "RECIRC", prefix: "dsc_cal_cfm_recirc", reset: "script.dsc_cal_reset_curve_recirc" },
  { label: "Intake Main", prefix: "dsc_cal_cfm_intake_main", reset: "script.dsc_cal_reset_curve_intake_main" },
  { label: "Intake 2×4", prefix: "dsc_cal_cfm_intake_clone", reset: "script.dsc_cal_reset_curve_intake_clone" }
], Gm = [25, 50, 75, 100];
function o_() {
  const { callService: a, entity: r, state: o } = Ce(), [u, d] = y.useState(null), h = o("sensor.dsc_learn_status", "—"), p = o("binary_sensor.dsc_learn_gate_open") === "on", b = o("sensor.dsc_learn_activity", "—"), m = String(r("sensor.dsc_cfm_exhaust_out")?.attributes?.cal_curve ?? ""), g = o("sensor.dsc_cfm_curves_status", "—"), v = o("sensor.dsc_learn_phase_b_status", "—"), _ = o("input_boolean.dsc_cal_active") === "on", j = String(r("sensor.dsc_learn_status")?.attributes?.trusted_levers ?? "none");
  return /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsxs(re, { className: "dsc-glass", title: "Anemometer / PPFD cal", icon: "learning", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ s.jsx(Q, { label: `Curves ${g}`, tone: g === "—" ? "muted" : "ok" }),
        /* @__PURE__ */ s.jsx(Q, { label: _ ? "SESSION ON" : "Session idle", tone: _ ? "ok" : "muted" })
      ] }),
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
        "CFM live numbers live on Climate. This wizard writes cal points only — do not invent them.",
        m ? ` Curve: ${m}` : ""
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", children: [
        /* @__PURE__ */ s.jsx(oe, { onClick: () => d("gate"), children: "Open gate" }),
        /* @__PURE__ */ s.jsx(oe, { onClick: () => d("sample"), children: "Sample points" }),
        /* @__PURE__ */ s.jsx(oe, { teal: !0, onClick: () => d("accept"), children: "Finish session" }),
        /* @__PURE__ */ s.jsx(oe, { onClick: () => d("curves"), children: "Stored curves" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs(re, { className: "dsc-glass", title: "Climate learn (Phase A/B)", icon: "learning", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ s.jsx(Q, { label: `Status ${h}`, tone: h === "—" ? "muted" : "ok" }),
        /* @__PURE__ */ s.jsx(Q, { label: p ? "GATE OPEN" : "GATE CLOSED", tone: p ? "ok" : "warn" }),
        /* @__PURE__ */ s.jsx(Q, { label: `Activity ${b}`, tone: "muted" }),
        /* @__PURE__ */ s.jsx(Q, { label: `B ${v}`, tone: v === "off" || v === "—" ? "muted" : "ok" }),
        /* @__PURE__ */ s.jsx(Q, { label: `Trusted ${j}`, tone: "muted" })
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: "One air appliance at a time. Fans/mat may stay on. Activity is SoT — gate open ≠ measuring. Phase B stays off until Activity shows samples climbing." }),
      /* @__PURE__ */ s.jsx(oe, { onClick: () => d("climate"), children: "Learn enable" })
    ] }),
    /* @__PURE__ */ s.jsxs(gt, { open: u === "gate", onDismiss: () => d(null), title: "Learn gate", help: null, children: [
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Target + session. Scripts own hold math." }),
      /* @__PURE__ */ s.jsx(Al, { entityId: "input_select.dsc_cal_target", label: "Cal target" }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-kpi-sub", children: o("input_text.dsc_cal_status", "") }),
      /* @__PURE__ */ s.jsx(
        oe,
        {
          primary: !0,
          onClick: () => {
            a("script", "turn_on", { entity_id: "script.dsc_cal_start" }), d("sample");
          },
          children: "Start session"
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs(gt, { open: u === "sample", onDismiss: () => d(null), title: "Sample", help: null, children: [
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Enter anemometer m/s or CFM. Skip rather than invent. Drafts hold until blur." }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
        /* @__PURE__ */ s.jsx(Qe, { entityId: "input_number.dsc_cal_reading_ms", label: "m/s" }),
        /* @__PURE__ */ s.jsx(Qe, { entityId: "input_number.dsc_cal_reading_cfm", label: "CFM" }),
        /* @__PURE__ */ s.jsx(Qe, { entityId: "input_number.dsc_cal_reading_ppfd", label: "PPFD" }),
        /* @__PURE__ */ s.jsx(Qe, { entityId: "input_number.dsc_cal_step_pct", label: "Step %" }),
        /* @__PURE__ */ s.jsx(Qe, { entityId: "input_number.dsc_duct_out_cm", label: "OUT duct cm" }),
        /* @__PURE__ */ s.jsx(Qe, { entityId: "input_number.dsc_duct_recirc_cm", label: "RECIRC cm" }),
        /* @__PURE__ */ s.jsx(Qe, { entityId: "input_number.dsc_duct_intake_main_cm", label: "Intake main cm" }),
        /* @__PURE__ */ s.jsx(Qe, { entityId: "input_number.dsc_duct_intake_clone_cm", label: "Intake 2×4 cm" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", children: [
        /* @__PURE__ */ s.jsx(oe, { onClick: () => void a("script", "turn_on", { entity_id: "script.dsc_cal_hold_next" }), children: "Re-hold" }),
        /* @__PURE__ */ s.jsx(oe, { primary: !0, onClick: () => void a("script", "turn_on", { entity_id: "script.dsc_cal_save_point" }), children: "Save point" }),
        /* @__PURE__ */ s.jsx(oe, { onClick: () => void a("script", "turn_on", { entity_id: "script.dsc_cal_skip_point" }), children: "Skip" }),
        /* @__PURE__ */ s.jsx(oe, { onClick: () => void a("script", "turn_on", { entity_id: "script.dsc_cal_abort" }), children: "Abort" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsx(
      gt,
      {
        open: u === "accept",
        onDismiss: () => d(null),
        onConfirm: () => {
          a("script", "turn_on", { entity_id: "script.dsc_cal_finish" }), d(null);
        },
        title: "Finish session",
        confirmLabel: "Finish",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          "Curve status ",
          g,
          ". Finish restores snapped fans/light. Points already saved at 25/50/75/100 stay; this does not invent a fit."
        ] })
      }
    ),
    /* @__PURE__ */ s.jsxs(
      gt,
      {
        open: u === "climate",
        onDismiss: () => d(null),
        onConfirm: () => d(null),
        title: "Climate learn enable",
        confirmLabel: "Done",
        help: null,
        children: [
          /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Toggles HA helpers. No invented samples. Blocked while failsafe/takeover/fault." }),
          /* @__PURE__ */ s.jsx(Re, { entityId: "input_boolean.dsc_climate_learn_enabled", label: "Phase A enabled" }),
          /* @__PURE__ */ s.jsx(Re, { entityId: "input_boolean.dsc_climate_learn_phase_b_enabled", label: "Phase B enabled" }),
          /* @__PURE__ */ s.jsx(Re, { entityId: "input_boolean.dsc_learn_phase_b_locked", label: "Phase B lock" }),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
            /* @__PURE__ */ s.jsx(Qe, { entityId: "input_number.dsc_learn_alpha", label: "EMA α" }),
            /* @__PURE__ */ s.jsx(Qe, { entityId: "input_number.dsc_learn_min_samples", label: "Min samples" })
          ] }),
          /* @__PURE__ */ s.jsxs("p", { className: "dsc-kpi-sub", children: [
            "Gate ",
            p ? "open" : "closed",
            " · ",
            b,
            " · trusted ",
            j
          ] })
        ]
      }
    ),
    /* @__PURE__ */ s.jsxs(gt, { open: u === "curves", onDismiss: () => d(null), title: "Stored curves", help: null, children: [
      /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: "0 = unset → linear % × nameplate. Do not invent points. Reset scripts wipe a curve; they do not guess a fit." }),
      u_.map((w) => /* @__PURE__ */ s.jsxs("div", { className: "dsc-cal-curve", children: [
        /* @__PURE__ */ s.jsx("strong", { children: w.label }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-target-grid", children: Gm.map((M) => /* @__PURE__ */ s.jsx(
          Qe,
          {
            entityId: `input_number.${w.prefix}_${M}`,
            label: `@${M}%`
          },
          `${w.prefix}_${M}`
        )) }),
        /* @__PURE__ */ s.jsxs(
          oe,
          {
            onClick: () => void a("script", "turn_on", { entity_id: w.reset }),
            children: [
              "Reset ",
              w.label
            ]
          }
        )
      ] }, w.prefix)),
      /* @__PURE__ */ s.jsx("strong", { children: "SF1000 PPFD" }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-target-grid", children: Gm.map((w) => /* @__PURE__ */ s.jsx(Qe, { entityId: `input_number.dsc_cal_ppfd_${w}`, label: `@${w}%` }, `ppfd_${w}`)) }),
      /* @__PURE__ */ s.jsx(
        oe,
        {
          onClick: () => void a("script", "turn_on", { entity_id: "script.dsc_cal_reset_curve_sf1000" }),
          children: "Reset PPFD"
        }
      )
    ] })
  ] });
}
function d_() {
  const { available: a, num: r, state: o } = Ce(), u = o("input_boolean.dsc_tank_in_service") === "on", d = a("input_number.dsc_tank_level_pct") || a("sensor.dsc_tank_level_pct"), h = a("sensor.dsc_tank_level_pct") ? r("sensor.dsc_tank_level_pct") : r("input_number.dsc_tank_level_pct"), p = d && Number.isFinite(h), b = a("sensor.dsc_tank_ec_normalized"), m = a("sensor.dsc_tank_ph_calibrated"), g = a("sensor.water_tester_temperature"), v = o("input_boolean.dsc_tank_pump_active") === "on", _ = p ? Math.max(4, Math.min(100, h)) : 0;
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-tank-cutaway", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ s.jsx(Q, { label: u ? "In service" : "OOS", tone: u ? "ok" : "warn" }),
      p ? null : /* @__PURE__ */ s.jsx(Q, { label: "Level unknown — empty, not guessed", tone: "warn" }),
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
          strokeDasharray: p ? void 0 : "7 5"
        }
      ),
      p ? /* @__PURE__ */ s.jsx(
        "rect",
        {
          x: "28",
          y: 26 + 176 * (1 - _ / 100),
          width: "124",
          height: 176 * _ / 100,
          fill: "rgba(38,198,218,0.22)"
        }
      ) : null,
      b ? /* @__PURE__ */ s.jsx("rect", { x: "32", y: "36", width: "116", height: "10", fill: "rgba(255,183,77,0.55)" }) : null,
      /* @__PURE__ */ s.jsx("rect", { x: "24", y: "18", width: "132", height: "12", fill: "none", stroke: m ? "var(--dsc-purple)" : "var(--dsc-gray-5)", strokeWidth: "3" }),
      v ? [0, 1, 2].map((j) => /* @__PURE__ */ s.jsx("circle", { cx: 90 + (j - 1) * 18, cy: "188", r: "4", fill: "var(--dsc-teal)", opacity: 0.5 + j * 0.15 }, j)) : null
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-kpi-sub", children: [
      "EC ",
      b ? `${Math.round(r("sensor.dsc_tank_ec_normalized"))} µS` : "—",
      " · pH",
      " ",
      m ? r("sensor.dsc_tank_ph_calibrated").toFixed(2) : "—",
      " · T",
      " ",
      g ? `${r("sensor.water_tester_temperature").toFixed(1)} °C` : "—"
    ] })
  ] });
}
const qm = ["var(--dsc-blue)", "var(--dsc-teal)", "var(--dsc-purple)", "var(--dsc-amber)"];
function f_() {
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Bt,
      {
        icon: "learning",
        title: "Learning",
        subtitle: "Anemometer gate, sample, accept — scripts own the math. No dsc-hub-pro."
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(o_, {}) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(re, { className: "dsc-glass", title: "Kit / In service", icon: "settings", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-row", children: [
        /* @__PURE__ */ s.jsx(Re, { entityId: "input_boolean.dsc_ac_in_service", label: "AC in service", icon: "climate" }),
        /* @__PURE__ */ s.jsx(
          Re,
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
function h_() {
  const { state: a } = Ce(), { hours: r, setHours: o, maxPoints: u } = ao(6), d = Je("sensor.dsc_hub_tent_temperature", { maxPoints: u, hours: r }), h = Je("sensor.dsc_hub_tent_humidity", { maxPoints: u, hours: r }), p = Je(ul(1, "moisture", a), { maxPoints: u, hours: r }), b = Je(ul(2, "moisture", a), { maxPoints: u, hours: r }), m = Je(ul(3, "moisture", a), { maxPoints: u, hours: r }), g = Je(ul(4, "moisture", a), { maxPoints: u, hours: r }), _ = [
    { n: 1, series: p },
    { n: 2, series: b },
    { n: 3, series: m },
    { n: 4, series: g }
  ].filter((w) => Ht(w.n, a)), j = Dn.filter((w) => Ht(w, a)).map((w) => ({ n: w, need: a(`sensor.dsc_pot${w}_need_summary`, "—") })).find((w) => w.need && w.need !== "—" && !/^ok$/i.test(w.need));
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Bt,
      {
        icon: "analytics",
        title: "Analytics",
        subtitle: "In-service pots. Climate charts live on Climate; this is the root pack."
      }
    ),
    /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: /* @__PURE__ */ s.jsx(
      io,
      {
        hours: r,
        setHours: o,
        extras: so
      }
    ) }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(re, { className: "dsc-glass", title: "Tent T + RH (secondary)", icon: "climate", children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Primary traces sit on Climate. Ghost/compare there, not a second dashboard." }),
        /* @__PURE__ */ s.jsx(
          un,
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
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(re, { className: "dsc-glass", title: "Root pack — moisture (in service)", icon: "root", children: [
        _.length ? /* @__PURE__ */ s.jsx(
          un,
          {
            live: !0,
            unit: "%",
            lastSyncAt: Math.max(..._.map((w) => w.series.lastSyncAt ?? 0)) || void 0,
            series: _.map((w, M) => ({
              id: `p${w.n}`,
              label: j?.n === w.n ? `P${w.n} Need` : `P${w.n}`,
              series: w.series.series,
              color: qm[M % qm.length],
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
function Ji(a, r) {
  return r ? a ? "ok" : "oos" : "missing";
}
function m_() {
  const { state: a, available: r, num: o } = Ce(), u = lo(a), d = a("binary_sensor.dsc_hub_link") === "on", p = [
    { id: "hub", label: "Hub", status: r("binary_sensor.dsc_hub_link") ? d ? "ok" : "dark" : "missing" },
    {
      id: "ac",
      label: "AC",
      status: Ji(
        a("input_boolean.dsc_ac_in_service") === "on",
        r("input_boolean.dsc_ac_in_service")
      )
    },
    {
      id: "mister",
      label: "Mister",
      status: Ji(
        a("input_boolean.dsc_clone_humidifier_in_service") === "on",
        r("input_boolean.dsc_clone_humidifier_in_service")
      )
    },
    ...Dn.map((g) => ({
      id: `pot${g}`,
      label: `P${g}`,
      status: Ji(Ht(g, a), r(`input_boolean.dsc_pot${g}_in_service`))
    })),
    {
      id: "tank",
      label: "Tank",
      status: Ji(
        a("input_boolean.dsc_tank_in_service") === "on",
        r("input_boolean.dsc_tank_in_service")
      )
    }
  ], b = on("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available: r,
    num: o
  }), m = [
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
      Bt,
      {
        icon: "fleet",
        title: "Fleet",
        subtitle: `${u.inService} of ${u.total} in service. Kit Pulse holes, tank tester, bridge table.`
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(Ep, {}) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(
        Xe,
        {
          label: "In service",
          value: `${u.inService}/${u.total}`,
          tone: u.inService === u.total ? "ok" : "warn"
        }
      ) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(
        Xe,
        {
          label: "Surface",
          value: a("sensor.dsc_ha_surface_version", "7.1.4"),
          sub: "Panel product shell"
        }
      ) }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-col-4", children: [
        /* @__PURE__ */ s.jsx(
          Xe,
          {
            label: "Alerts",
            value: Number.isFinite(o("sensor.dsc_active_alert_count")) ? o("sensor.dsc_active_alert_count") : "—",
            tone: o("sensor.dsc_active_alert_count", 0) === 0 ? "ok" : "bad"
          }
        ),
        /* @__PURE__ */ s.jsx(mt, { reading: b })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(re, { className: "dsc-glass", title: "Kit Pulse", icon: "system", children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Holes are missing / OOS / dark hub — not a greenwashed map." }),
        /* @__PURE__ */ s.jsx(Mp, { nodes: p })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(re, { className: "dsc-glass", title: "Kit / In service", icon: "settings", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-row", children: [
        /* @__PURE__ */ s.jsx(Re, { entityId: "input_boolean.dsc_ac_in_service", label: "AC in service", icon: "climate" }),
        /* @__PURE__ */ s.jsx(
          Re,
          {
            entityId: "input_boolean.dsc_clone_humidifier_in_service",
            label: "Clone mister",
            icon: "clone"
          }
        ),
        /* @__PURE__ */ s.jsx(Re, { entityId: "input_boolean.dsc_pot1_in_service", label: "Pot 1", icon: "root" }),
        /* @__PURE__ */ s.jsx(Re, { entityId: "input_boolean.dsc_pot2_in_service", label: "Pot 2", icon: "root" }),
        /* @__PURE__ */ s.jsx(Re, { entityId: "input_boolean.dsc_pot3_in_service", label: "Pot 3", icon: "root" }),
        /* @__PURE__ */ s.jsx(Re, { entityId: "input_boolean.dsc_pot4_in_service", label: "Pot 4", icon: "root" }),
        /* @__PURE__ */ s.jsx(Re, { entityId: "input_boolean.dsc_tank_in_service", label: "Tank", icon: "tank" })
      ] }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(re, { className: "dsc-glass", title: "Tank", icon: "tank", children: [
        /* @__PURE__ */ s.jsx(d_, {}),
        /* @__PURE__ */ s.jsxs("p", { className: "dsc-kpi-sub", children: [
          "Stage ",
          a("input_select.dsc_tank_stage", "—"),
          " · Type",
          " ",
          a("input_select.dsc_tank_plant_type", "—")
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(re, { className: "dsc-glass", title: "Bridge / firmware", icon: "fleet", children: /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "Signal" }),
          /* @__PURE__ */ s.jsx("th", { children: "State" })
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: m.map((g) => /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("td", { children: g.label }),
          /* @__PURE__ */ s.jsx("td", { children: r(g.id) ? a(g.id, "—") : /* @__PURE__ */ s.jsx(Q, { label: "hole", tone: "warn" }) })
        ] }, g.id)) })
      ] }) }) })
    ] })
  ] });
}
const p_ = [
  { id: "live", label: "Live", path: "/live/mission", icon: "live" },
  { id: "grow", label: "Grow", path: "/grow/compose", icon: "grow" },
  { id: "tune", label: "Tune", path: "/tune/learning", icon: "tune" },
  { id: "fleet", label: "Fleet", path: "/fleet", icon: "fleet" }
], v_ = {
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
}, g_ = {
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
function x_(a) {
  return a.startsWith("/grow") || a.startsWith("/plant") ? "grow" : a.startsWith("/tune") || a.startsWith("/advanced") ? "tune" : a.startsWith("/fleet") || a.startsWith("/system") ? "fleet" : "live";
}
function b_(a, r) {
  const o = g_[a];
  return o ? o.includes("?") ? o : `${o}${r || ""}` : null;
}
const __ = ':host,.dsc-root{--dsc-black: #0c1220;--dsc-black-2: #121a2c;--dsc-gray-1: #182238;--dsc-gray-2: #22304c;--dsc-gray-3: #334566;--dsc-gray-4: #8b95ab;--dsc-gray-5: #b6bfd4;--dsc-blue: #5b9bff;--dsc-blue-dim: rgba(91, 155, 255, .4);--dsc-purple: #a78bfa;--dsc-purple-dim: rgba(167, 139, 250, .35);--dsc-neon: #3dde7a;--dsc-neon-dim: rgba(61, 222, 122, .32);--dsc-neon-glow: rgba(61, 222, 122, .4);--dsc-teal: #2ec4d6;--dsc-teal-dim: rgba(46, 196, 214, .45);--dsc-teal-glow: rgba(46, 196, 214, .55);--dsc-amber: #ffb74d;--dsc-bad: #ff6b8a;--dsc-bad-soft: #ff8aa3;--dsc-soil-1: #5b9f6b;--dsc-soil-2: #4a8f9f;--dsc-soil-3: #c4a35a;--dsc-soil-4: #8d6e63;--dsc-glass: rgba(18, 26, 44, .78);--dsc-glass-border: rgba(130, 165, 230, .34);--dsc-white: #f2f5fb;--dsc-shadow: 0 8px 24px rgba(0, 0, 0, .45);--dsc-shadow-tight: 0 2px 8px rgba(0, 0, 0, .55);--dsc-radius: 10px;--dsc-radius-lg: 14px;--dsc-font: "Segoe UI", "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;--dsc-mono: "Cascadia Code", "IBM Plex Mono", ui-monospace, monospace;color:var(--dsc-white);background:var(--dsc-black);font-family:var(--dsc-font);display:block;height:100%;box-sizing:border-box}*,*:before,*:after{box-sizing:border-box}.dsc-root{height:100%;min-height:100%;overflow:auto;background:radial-gradient(1100px 560px at 8% -12%,rgba(91,155,255,.18),transparent 55%),radial-gradient(900px 520px at 92% -8%,rgba(46,196,214,.12),transparent 50%),radial-gradient(700px 420px at 70% 100%,rgba(61,222,122,.05),transparent 55%),var(--dsc-black)}.dsc-honesty-rail{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}.dsc-next-rec{border-color:var(--dsc-blue-dim)}.dsc-twin-keepalive{display:none;margin-bottom:12px;min-height:0}.dsc-twin-keepalive.is-active{display:block;min-height:min(70vh,720px)}.dsc-twin-keepalive-host{min-height:min(68vh,700px)}.dsc-twin-keepalive-host>*{min-height:min(68vh,700px)}.dsc-tab--live.active{color:var(--dsc-blue);border-color:var(--dsc-blue-dim)}.dsc-tab--grow.active{color:var(--dsc-teal);border-color:var(--dsc-teal-dim)}.dsc-tab--tune.active{color:var(--dsc-purple);border-color:var(--dsc-purple-dim)}.dsc-tab--fleet.active{color:var(--dsc-blue);border-color:var(--dsc-blue-dim)}.dsc-secondary-tabs .dsc-tab.active{color:var(--dsc-teal);border-color:var(--dsc-teal-dim);box-shadow:0 0 0 1px var(--dsc-blue-dim)}.dsc-tent-segment{display:inline-flex;gap:4px;padding:3px;border-radius:999px;background:var(--dsc-gray-1);border:1px solid var(--dsc-glass-border)}.dsc-tent-segment button{appearance:none;border:0;background:transparent;color:var(--dsc-gray-5);padding:6px 12px;border-radius:999px;cursor:pointer;font:inherit;font-size:.85rem}.dsc-tent-segment button.is-active{background:var(--dsc-gray-2);color:var(--dsc-white);box-shadow:var(--dsc-shadow-tight)}.dsc-tent-segment button[data-tent=main].is-active{color:var(--dsc-blue)}.dsc-tent-segment button[data-tent=clone].is-active{color:var(--dsc-purple)}.dsc-tent-segment button[data-tent=compare].is-active{color:var(--dsc-teal)}.dsc-shell{display:flex;flex-direction:column;min-height:100%;max-width:1600px;margin:0 auto;padding:16px 20px 28px}.dsc-brand-row{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:10px}.dsc-brand{display:flex;align-items:center;gap:12px;color:var(--dsc-white);text-decoration:none}.dsc-brand img,.dsc-brand svg{width:36px;height:36px;color:var(--dsc-neon)}.dsc-brand-title{display:flex;flex-direction:column;gap:2px}.dsc-brand-title strong{font-size:1.05rem;letter-spacing:.04em;font-weight:700;line-height:1.25;max-width:min(52vw,28rem)}.dsc-brand-wordmark{height:18px;width:auto;max-width:160px;display:block;color:var(--dsc-text, #eef1f8);line-height:0}.dsc-brand-wordmark svg{width:auto;height:18px;display:block}.dsc-icon svg{width:100%;height:100%;display:block}.dsc-brand-title span{font-size:.72rem;color:var(--dsc-gray-5);letter-spacing:.08em;text-transform:uppercase}.dsc-page-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px}.dsc-page-header-main{display:flex;align-items:flex-start;gap:10px}.dsc-page-header-actions{display:flex;align-items:center;gap:6px;flex-shrink:0}.dsc-card-title{display:inline-flex;align-items:center;gap:8px}.dsc-primary-tabs,.dsc-secondary-tabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:thin;padding-bottom:2px;-webkit-overflow-scrolling:touch}.dsc-primary-tabs{border-bottom:1px solid var(--dsc-gray-3);margin-bottom:8px}.dsc-secondary-tabs{margin-bottom:16px;mask-image:linear-gradient(90deg,#000 85%,transparent)}.dsc-secondary-tabs:after{content:"";flex:0 0 12px}.dsc-tab{appearance:none;border:1px solid transparent;background:transparent;color:var(--dsc-gray-5);padding:10px 14px;min-height:44px;border-radius:8px 8px 0 0;cursor:pointer;font:inherit;font-size:.92rem;letter-spacing:.04em;white-space:nowrap;display:inline-flex;align-items:center;gap:8px;transition:transform .1s ease,box-shadow .1s ease,color .15s ease,border-color .15s ease,background .15s ease;text-decoration:none}.dsc-tab span[role=img]{opacity:.9;flex-shrink:0}.dsc-tab:hover{color:var(--dsc-white);background:var(--dsc-gray-1)}.dsc-tab:focus-visible{outline:2px solid var(--dsc-neon);outline-offset:2px}.dsc-tab.active{color:var(--dsc-white);border-bottom:2px solid var(--dsc-neon);box-shadow:0 6px 18px #39ff1414}.dsc-secondary-tabs .dsc-tab{border-radius:999px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-1);min-height:40px;padding:8px 14px}.dsc-secondary-tabs .dsc-tab.active{border-color:var(--dsc-neon-dim);color:var(--dsc-neon);background:#39ff1414;box-shadow:var(--dsc-shadow-tight)}.dsc-btn{appearance:none;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);border-radius:8px;padding:10px 16px;min-height:40px;font:inherit;cursor:pointer;box-shadow:var(--dsc-shadow-tight);transition:transform .1s ease,box-shadow .1s ease,border-color .12s ease,background .12s ease}.dsc-btn:hover{border-color:var(--dsc-neon-dim)}.dsc-btn:active,.dsc-tab:active{transform:translateY(1px);box-shadow:0 1px 3px #000000a6}.dsc-btn.primary{border-color:var(--dsc-neon-dim);color:var(--dsc-black);background:var(--dsc-neon);font-weight:650}.dsc-page{animation:dsc-fade .18s ease}@keyframes dsc-fade{0%{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.dsc-page,.dsc-btn,.dsc-tab,.dsc-live-pulse{animation:none!important;transition:none!important}}.dsc-grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:14px}.dsc-col-3{grid-column:span 3}.dsc-col-4{grid-column:span 4}.dsc-col-6{grid-column:span 6}.dsc-col-8{grid-column:span 8}.dsc-col-12{grid-column:span 12}@media(max-width:1100px){.dsc-col-3,.dsc-col-4{grid-column:span 6}.dsc-col-8{grid-column:span 12}}@media(max-width:720px){.dsc-shell{padding:12px}.dsc-col-3,.dsc-col-4,.dsc-col-6,.dsc-col-8{grid-column:span 12}}.dsc-card{background:linear-gradient(165deg,var(--dsc-gray-1),var(--dsc-black-2));border:1px solid var(--dsc-gray-3);border-radius:var(--dsc-radius);box-shadow:var(--dsc-shadow);padding:14px 16px;min-height:88px}.dsc-card h2,.dsc-card h3{margin:0 0 8px;font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;color:var(--dsc-gray-5);font-weight:600}.dsc-kpi-value{font-size:1.85rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:.02em;color:var(--dsc-white)}.dsc-kpi-unit{margin-left:6px;font-size:.85rem;color:var(--dsc-gray-5)}.dsc-kpi-sub{margin-top:6px;color:var(--dsc-gray-5);font-size:.82rem}.dsc-status-ok{color:var(--dsc-neon)}.dsc-status-warn{color:var(--dsc-amber)}.dsc-status-bad{color:var(--dsc-bad)}.dsc-status-muted{color:var(--dsc-gray-5)}.dsc-page-title{margin:0 0 14px;font-size:1.35rem;letter-spacing:.04em}.dsc-muted{color:var(--dsc-gray-5)}.dsc-legacy-host{min-height:420px;border-radius:var(--dsc-radius);overflow:hidden;border:1px solid var(--dsc-gray-3);background:#000}.dsc-legacy-host--empty{background:var(--dsc-gray-1);min-height:160px}.dsc-legacy-host>*{display:block;width:100%}.dsc-status-strip{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}.dsc-chip-row{display:flex;flex-wrap:wrap;gap:8px}.dsc-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-1);font-size:.75rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-chip--ok{color:var(--dsc-neon);border-color:var(--dsc-neon-dim);background:#39ff1414;box-shadow:0 0 12px #39ff141f}.dsc-chip--bad{color:var(--dsc-bad-soft);border-color:color-mix(in srgb,var(--dsc-bad) 45%,transparent);background:color-mix(in srgb,var(--dsc-bad) 12%,transparent)}.dsc-chip--warn{color:var(--dsc-amber);border-color:color-mix(in srgb,var(--dsc-amber) 45%,transparent);background:color-mix(in srgb,var(--dsc-amber) 12%,transparent)}.dsc-chip--muted{color:var(--dsc-gray-5)}.dsc-chip--pulse{animation:dsc-chip-pulse 1.6s ease-in-out infinite}@keyframes dsc-chip-pulse{0%,to{box-shadow:0 0 #39ff1400}50%{box-shadow:0 0 14px #39ff1459}}.dsc-demand-row{display:flex;flex-wrap:wrap;gap:8px}.dsc-demand-row--stack{flex-direction:column}.dsc-demand{appearance:none;flex:1 1 110px;min-height:52px;padding:10px 12px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);font:inherit;cursor:pointer;display:flex;flex-direction:column;align-items:flex-start;gap:4px;box-shadow:var(--dsc-shadow-tight);transition:transform .1s ease,box-shadow .1s ease,border-color .12s ease,background .12s ease}.dsc-demand:hover{border-color:var(--dsc-neon-dim)}.dsc-demand:active{transform:translateY(1px);box-shadow:0 1px 3px #000000a6}.dsc-demand.is-on{border-color:var(--dsc-neon);background:#39ff141a;box-shadow:0 0 0 1px #39ff1440,0 0 18px #39ff1433}.dsc-demand.is-missing{opacity:.55;cursor:not-allowed}.dsc-demand-label{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-demand.is-on .dsc-demand-label{color:var(--dsc-neon)}.dsc-demand-state{font-weight:700;font-variant-numeric:tabular-nums;font-size:1rem}.dsc-demand-icon{margin-bottom:4px;opacity:.95}.dsc-mode-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}.dsc-mode-selects{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}.dsc-entity-select{display:flex;flex-direction:column;gap:6px;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-entity-select-label{display:inline-flex;align-items:center;gap:6px}.dsc-entity-select select{appearance:none;min-height:40px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);padding:8px 12px;font:inherit;text-transform:none;letter-spacing:0}.dsc-entity-select.is-disabled{opacity:.55}.dsc-fan-stack{display:flex;flex-direction:column;gap:10px}.dsc-fan-slider{display:flex;flex-direction:column;gap:4px}.dsc-fan-slider-label{display:flex;align-items:baseline;gap:8px;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-fan-slider-label strong{color:var(--dsc-teal);font-variant-numeric:tabular-nums}.dsc-fan-slider input[type=range]{width:100%;accent-color:var(--dsc-teal)}.dsc-fan-slider.is-disabled{opacity:.5}.dsc-honesty{margin:10px 0 0;font-size:.85rem;color:var(--dsc-gray-5);display:flex;flex-wrap:wrap;align-items:center;gap:8px}.dsc-target-panel{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}.dsc-target-panel.is-compact .dsc-target-grid{grid-template-columns:repeat(auto-fit,minmax(90px,1fr))}.dsc-tent-targets{border:1px solid var(--dsc-glass-border);border-radius:var(--dsc-radius);padding:10px 12px;background:#0000002e}.dsc-tent-targets-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}.dsc-got-want{display:flex;flex-direction:column;gap:2px;font-size:.82rem;margin-bottom:10px}.dsc-target-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px}.dsc-target-num{display:flex;flex-direction:column;gap:4px;font-size:.7rem;letter-spacing:.06em;color:var(--dsc-gray-5)}.dsc-target-num-label{text-transform:uppercase}.dsc-target-num input,.dsc-target-num textarea{min-height:36px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);padding:6px 8px;font:inherit;font-variant-numeric:tabular-nums}.dsc-target-num textarea{text-transform:none;letter-spacing:0;min-height:56px;resize:vertical}.dsc-target-num.is-disabled{opacity:.55}.dsc-chart{position:relative}.dsc-chart-svg{cursor:crosshair;touch-action:none}.dsc-chart-tooltip{position:absolute;top:8px;transform:translate(-50%);pointer-events:none;z-index:2;min-width:120px;padding:8px 10px;border-radius:8px;border:1px solid var(--dsc-glass-border);background:var(--dsc-glass);backdrop-filter:blur(10px);box-shadow:var(--dsc-shadow-tight);font-size:.75rem}.dsc-chart-tooltip-time{color:var(--dsc-teal);font-family:var(--dsc-mono);margin-bottom:4px}.dsc-chart-tooltip-row{display:flex;align-items:center;gap:6px;color:var(--dsc-white)}.dsc-chart-tooltip-row i{width:7px;height:7px;border-radius:50%;display:inline-block}@keyframes dsc-sync-pulse{0%{stroke-dashoffset:1;opacity:.2}35%{opacity:1}to{stroke-dashoffset:0;opacity:0}}@media(prefers-reduced-motion:reduce){.dsc-chart-pulse{animation:none!important;opacity:.85}}.dsc-gauge.is-warn .dsc-gauge-label{color:var(--dsc-amber)}.dsc-gauge-row{display:flex;justify-content:space-around;flex-wrap:wrap;gap:8px}.dsc-gauge-matrix{display:flex;flex-direction:column;gap:8px}.dsc-gauge-row-3{display:grid;grid-template-columns:14px repeat(3,minmax(0,1fr));align-items:center;gap:2px 4px;border:1px solid transparent;border-radius:12px;padding:2px 4px 4px;transition:box-shadow .25s ease,border-color .25s ease,background .25s ease}.dsc-gauge-row-3.is-lit{border-color:#ffd54f80;background:linear-gradient(180deg,#ffc1071a,#0c121c59);box-shadow:0 0 28px #ffc10747,inset 0 0 16px #ffd54f12}.dsc-gauge-row-tag{font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--dsc-gray-5);writing-mode:vertical-rl;transform:rotate(180deg);justify-self:center;padding:2px 0}.dsc-gauge-row-3 .dsc-gauge{min-width:0}.dsc-gauge-cell{min-width:0;display:flex;flex-direction:column;align-items:center;gap:2px}.dsc-gauge-cell .dsc-sparkline{width:100%;max-width:88px;opacity:.9}.dsc-gauge-row-3 .dsc-gauge svg{width:100%;max-width:96px;height:auto;max-height:72px}.dsc-gauge-row-3 .dsc-gauge-label{font-size:10px}.dsc-gauge-zone{border:1px solid transparent;border-radius:12px;padding:8px 6px 10px;transition:box-shadow .25s ease,border-color .25s ease,background .25s ease}.dsc-gauge-zone.is-lit{border-color:#ffd54f80;background:linear-gradient(180deg,#ffc1071a,#0c121c59);box-shadow:0 0 28px #ffc10747,inset 0 0 16px #ffd54f12}.dsc-gauge-zone-label{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5);margin:0 4px 6px}.dsc-gauge{display:flex;flex-direction:column;align-items:center;gap:4px}.dsc-gauge-label{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-chart-legend{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:4px;min-height:20px}.dsc-chart-legend-item{display:inline-flex;align-items:center;gap:6px;font-size:.75rem;color:var(--dsc-gray-5)}.dsc-chart-legend-item i{width:8px;height:8px;border-radius:50%;display:inline-block;box-shadow:0 0 6px currentColor}.dsc-chart-last{margin-left:auto;font-variant-numeric:tabular-nums;color:var(--dsc-neon);font-size:13px;font-weight:650}.dsc-fault-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.dsc-fault-list li{display:flex;flex-wrap:wrap;align-items:center;gap:10px}.dsc-empty{padding:18px 14px;border:1px dashed var(--dsc-gray-3);border-radius:8px;color:var(--dsc-gray-5);background:#00000040;font-size:.9rem;line-height:1.45}.dsc-empty--ok{border-style:solid;border-color:var(--dsc-neon-dim);color:var(--dsc-neon)}.dsc-btn:disabled{opacity:.45;cursor:not-allowed}.dsc-glass{background:var(--dsc-glass);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid var(--dsc-glass-border);border-radius:var(--dsc-radius-lg);box-shadow:var(--dsc-shadow)}.dsc-glass--glow{border-color:var(--dsc-teal-dim);box-shadow:0 0 0 1px #26c6da26,0 0 24px #26c6da1f}.dsc-icon-btn{appearance:none;width:36px;height:36px;padding:0;display:inline-flex;align-items:center;justify-content:center;border-radius:10px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);cursor:pointer;box-shadow:var(--dsc-shadow-tight);transition:border-color .12s ease,background .12s ease,transform .1s ease}.dsc-icon-btn:hover{border-color:var(--dsc-teal-dim);color:var(--dsc-teal)}.dsc-icon-btn:active{transform:translateY(1px)}.dsc-result-chip{display:inline-flex;align-items:center;gap:8px;max-width:100%;padding:8px 12px;border-radius:999px;border:1px solid var(--dsc-teal-dim);background:#26c6da1a;color:var(--dsc-white);font-size:.9rem}.dsc-result-chip span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dsc-overflow{position:relative;display:inline-block}.dsc-overflow-menu{position:absolute;right:0;top:calc(100% + 6px);z-index:40;min-width:180px;padding:6px;background:var(--dsc-black-2);border:1px solid var(--dsc-gray-3);border-radius:10px;box-shadow:var(--dsc-shadow)}.dsc-overflow-menu button{appearance:none;width:100%;text-align:left;border:0;background:transparent;color:var(--dsc-white);font:inherit;font-size:.88rem;padding:10px 12px;border-radius:8px;cursor:pointer}.dsc-overflow-menu button:hover{background:#26c6da1f;color:var(--dsc-teal)}.dsc-drawer-root{position:fixed;inset:0;z-index:80;pointer-events:none}.dsc-drawer-root.is-open{pointer-events:auto}.dsc-drawer-scrim{position:absolute;inset:0;background:#00000073;opacity:0;transition:opacity .18s ease}.dsc-drawer-root.is-open .dsc-drawer-scrim{opacity:1}.dsc-drawer-panel{position:absolute;top:0;bottom:0;width:min(380px,92vw);background:linear-gradient(165deg,#121a16,#0a100e);border:1px solid var(--dsc-glass-border);box-shadow:-12px 0 40px #0000008c;display:flex;flex-direction:column;transition:transform .22s ease}.dsc-drawer-panel.right{right:0;transform:translate(105%);border-radius:14px 0 0 14px}.dsc-drawer-panel.left{left:0;transform:translate(-105%);border-radius:0 14px 14px 0}.dsc-drawer-root.is-open .dsc-drawer-panel.right,.dsc-drawer-root.is-open .dsc-drawer-panel.left{transform:none}.dsc-drawer-rail{position:absolute;top:50%;transform:translateY(-50%);width:28px;height:64px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:2}.dsc-drawer-panel.right .dsc-drawer-rail{left:-28px;border-radius:10px 0 0 10px}.dsc-drawer-panel.left .dsc-drawer-rail{right:-28px;border-radius:0 10px 10px 0}.dsc-drawer-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid var(--dsc-gray-3)}.dsc-drawer-head h2{margin:0;font-size:.85rem;letter-spacing:.12em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-drawer-body{flex:1;overflow:auto;padding:14px 16px}.dsc-soil{width:100%;max-width:280px;margin:0 auto}.dsc-soil-pot{position:relative;width:100%;aspect-ratio:4 / 5;border-radius:12px 12px 28px 28px;border:2px solid rgba(120,160,130,.45);background:linear-gradient(180deg,#1a1410,#0e0c0a);overflow:hidden;box-shadow:inset 0 0 24px #0000008c,0 0 20px #26c6da14}.dsc-soil-pot.is-valid{border-color:var(--dsc-teal-dim);box-shadow:inset 0 0 24px #0000008c,0 0 28px #26c6da47,0 0 42px #39ff141f}.dsc-soil-layer{position:absolute;left:8%;right:8%;display:flex;align-items:center;justify-content:center;font-size:.72rem;letter-spacing:.04em;color:#f4f7f4eb;text-shadow:0 1px 2px rgba(0,0,0,.65);border-top:1px solid rgba(255,255,255,.08)}.dsc-soil-empty{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--dsc-gray-5);font-size:.85rem;padding:16px;text-align:center}.dsc-seat-layout{display:grid;grid-template-columns:minmax(200px,320px) 1fr;gap:18px;align-items:start}@media(max-width:900px){.dsc-seat-layout{grid-template-columns:1fr}}.dsc-seat-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.dsc-table{width:100%;border-collapse:collapse;font-size:.88rem}.dsc-table th,.dsc-table td{text-align:left;padding:8px 6px;border-bottom:1px solid var(--dsc-gray-3)}.dsc-table th{font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--dsc-gray-5);font-weight:600}.dsc-table tr{cursor:pointer}.dsc-table tr:hover td{background:#26c6da0f}.dsc-btn.teal{border-color:var(--dsc-teal-dim);background:#26c6da2e;color:var(--dsc-white);box-shadow:0 0 18px #26c6da33}.dsc-btn.teal.primary{background:var(--dsc-teal);color:#041018;font-weight:650}.dsc-held-tag{margin-left:8px;font-size:.65rem;letter-spacing:.08em;color:var(--dsc-amber);vertical-align:middle}.dsc-kpi-hit,.dsc-gauge-hit{appearance:none;border:0;background:transparent;padding:0;margin:0;color:inherit;font:inherit;text-align:left;cursor:pointer;width:100%;display:block}.dsc-card.is-stale,.dsc-gauge.is-stale{opacity:.88;border-color:var(--dsc-amber)}.dsc-gauge.is-clickable:hover,.dsc-kpi-hit:hover .dsc-card{border-color:var(--dsc-blue-dim)}.dsc-timespan{display:inline-flex;flex-wrap:wrap;gap:6px}.dsc-spark-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}.dsc-sparkline{display:block;margin-top:4px}.dsc-gotwant{display:flex;flex-direction:column;gap:10px}.dsc-gotwant-row{display:grid;grid-template-columns:64px 1fr;gap:6px 10px;align-items:center}.dsc-gotwant-label{font-size:.75rem;color:var(--dsc-gray-5);letter-spacing:.04em}.dsc-gotwant-track{position:relative;height:10px;border-radius:999px;background:#ffffff0f;overflow:hidden;grid-column:2}.dsc-gotwant-want{position:absolute;inset:0 auto 0 0;background:#2ec4d647;border-right:1px solid var(--dsc-teal)}.dsc-gotwant-got{position:absolute;inset:2px auto 2px 0;background:linear-gradient(90deg,var(--dsc-blue),var(--dsc-teal));border-radius:999px}.dsc-gotwant-vals{grid-column:2;display:flex;justify-content:space-between;font-size:.72rem;font-family:var(--dsc-mono)}.dsc-seat-editors{display:grid;gap:10px}.dsc-seat-editors label{display:flex;flex-direction:column;gap:4px;font-size:.75rem;color:var(--dsc-gray-5)}.dsc-seat-editors input,.dsc-seat-editors select,.dsc-seat-editors textarea{background:var(--dsc-gray-1);border:1px solid var(--dsc-glass-border);border-radius:8px;color:var(--dsc-white);padding:8px 10px;font:inherit}.dsc-root-matrix .dsc-tone-ok{color:var(--dsc-neon)}.dsc-root-matrix .dsc-tone-warn{color:var(--dsc-amber)}.dsc-root-matrix .dsc-tone-bad{color:var(--dsc-bad)}.dsc-root-matrix .dsc-tone-stale{color:var(--dsc-amber);opacity:.85}.dsc-tent-cockpit-strip{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}@media(prefers-reduced-motion:reduce){.dsc-drawer-panel,.dsc-drawer-scrim{transition:none!important}}.dsc-decision-root{position:fixed;inset:0;z-index:120;display:flex;align-items:center;justify-content:center}.dsc-decision-scrim{position:absolute;inset:0;background:#04080ab8;backdrop-filter:blur(6px)}.dsc-decision-panel{position:relative;z-index:1;width:min(720px,94vw);max-height:86vh;overflow:auto;background:linear-gradient(165deg,#121a16,#0a100e);border:1px solid var(--dsc-glass-border);border-radius:14px;box-shadow:0 24px 80px #0000008c;padding:16px 18px}.dsc-decision-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.dsc-decision-head h2{margin:0;font-size:.95rem;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-decision-help{min-height:8px;margin-top:10px}.dsc-decision-foot{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}.dsc-result-chip.is-empty{border-color:#78a08247;background:#121c1673;color:var(--dsc-gray-5)}.dsc-result-chip-hit{appearance:none;border:0;background:transparent;padding:0;color:inherit;font:inherit;cursor:pointer;max-width:100%}.dsc-coupled-mix .dsc-mix-row{display:grid;grid-template-columns:minmax(140px,1.2fr) 140px 48px 64px auto;gap:8px;align-items:end;margin-bottom:8px}.dsc-nutrient-slot{display:grid;grid-template-columns:minmax(140px,1fr) 88px 64px auto;gap:8px;align-items:end;margin-top:8px}.dsc-catalog-hits{list-style:none;margin:8px 0 0;padding:0;max-height:280px;overflow:auto}.dsc-catalog-hits button{appearance:none;width:100%;text-align:left;background:transparent;border:0;color:inherit;font:inherit;padding:8px 4px;cursor:pointer;display:flex;gap:8px}.dsc-catalog-hits button:hover{background:#26c6da1a}.dsc-catalog-picker input[type=search]{width:100%;box-sizing:border-box;background:var(--dsc-gray-1);border:1px solid var(--dsc-glass-border);border-radius:8px;color:var(--dsc-white);padding:8px 10px}.dsc-vessel-glyph{display:inline-flex;flex-direction:column;align-items:center;gap:2px}.dsc-vessel-glyph-label{font-size:.65rem;color:var(--dsc-gray-5)}.dsc-kit-constellation{width:100%;max-height:240px;color:inherit;margin-bottom:8px}.dsc-kit-pulse-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px}.dsc-kit-node{display:flex;align-items:center;gap:8px;padding:8px;border:1px dashed var(--dsc-gray-3);border-radius:10px}.dsc-kit-node.is-ok{border-style:solid;border-color:var(--dsc-teal-dim)}.dsc-kit-node i{width:10px;height:10px;border-radius:50%;background:var(--dsc-gray-5)}.dsc-kit-node.is-ok i{background:var(--dsc-neon)}.dsc-kit-node.is-held i{background:var(--dsc-amber)}.dsc-kit-node.is-oos i,.dsc-kit-node.is-missing i,.dsc-kit-node.is-dark i{background:transparent;border:1px dashed var(--dsc-bad)}.dsc-lung-svg,.dsc-tank-svg{width:100%;height:auto;color:var(--dsc-white)}.dsc-cal-curve{margin:12px 0 16px}.dsc-cal-curve strong{display:block;margin-bottom:6px}.dsc-honesty-hit{appearance:none;border:0;background:transparent;padding:0;cursor:pointer}.dsc-row-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.dsc-detail-list dt{font-size:.7rem;color:var(--dsc-gray-5);margin-top:8px}.dsc-detail-list dd{margin:0}', y_ = __;
function Cp() {
  const a = pt(), r = dt();
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Bt,
      {
        icon: "alert",
        title: "Not found",
        subtitle: `${a.pathname} is not a DSC route.`
      }
    ),
    /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: "Unknown hash — not a silent Mission redirect." }),
    /* @__PURE__ */ s.jsx(oe, { primary: !0, onClick: () => r("/live/mission"), children: "Go Mission" })
  ] });
}
function Cl() {
  const a = pt(), r = b_(a.pathname, a.search);
  return r ? /* @__PURE__ */ s.jsx(_s, { to: r, replace: !0 }) : /* @__PURE__ */ s.jsx(Cp, {});
}
function j_() {
  const a = pt(), r = dt(), o = x_(a.pathname), u = v_[o];
  return y.useEffect(() => {
    if (a.pathname === "/live/climate") return;
    const d = new URLSearchParams(a.search);
    if (!d.has("tent") && !d.has("zone")) return;
    d.delete("tent"), d.delete("zone");
    const h = d.toString();
    r({ pathname: a.pathname, search: h ? `?${h}` : "" }, { replace: !0 });
  }, [a.pathname, a.search, r]), /* @__PURE__ */ s.jsxs("div", { className: "dsc-shell", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-brand-row", children: [
      /* @__PURE__ */ s.jsxs(Ii, { className: "dsc-brand", to: "/live/mission", children: [
        /* @__PURE__ */ s.jsx(dn, { name: "brand", size: 36, color: "var(--dsc-blue)" }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-brand-title", children: /* @__PURE__ */ s.jsx("strong", { children: "DSC - A Plausible Deniability Project." }) })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-muted", style: { fontSize: 12, letterSpacing: "0.08em" }, children: "SURFACE 7.1.4" })
    ] }),
    /* @__PURE__ */ s.jsx(Ix, {}),
    /* @__PURE__ */ s.jsx("nav", { className: "dsc-primary-tabs", "aria-label": "Primary", children: p_.map((d) => /* @__PURE__ */ s.jsxs(
      Ii,
      {
        to: d.path,
        className: ({ isActive: h }) => `dsc-tab dsc-tab--${d.id}${h || o === d.id ? " active" : ""}`,
        children: [
          /* @__PURE__ */ s.jsx(dn, { name: d.icon, size: 15 }),
          d.label
        ]
      },
      d.id
    )) }),
    u.length > 1 ? /* @__PURE__ */ s.jsx("nav", { className: "dsc-secondary-tabs", "aria-label": "Section pages", children: u.map((d) => /* @__PURE__ */ s.jsxs(
      Ii,
      {
        to: d.path,
        end: d.path === "/fleet",
        className: ({ isActive: h }) => `dsc-tab${h ? " active" : ""}`,
        children: [
          /* @__PURE__ */ s.jsx(dn, { name: d.icon, size: 14 }),
          d.label
        ]
      },
      d.id
    )) }) : null,
    /* @__PURE__ */ s.jsx(hb, {}),
    /* @__PURE__ */ s.jsx(Qb, {}),
    /* @__PURE__ */ s.jsxs(rx, { children: [
      /* @__PURE__ */ s.jsx($e, { path: "/", element: /* @__PURE__ */ s.jsx(_s, { to: "/live/mission", replace: !0 }) }),
      /* @__PURE__ */ s.jsx($e, { path: "/live", element: /* @__PURE__ */ s.jsx(_s, { to: "/live/mission", replace: !0 }) }),
      /* @__PURE__ */ s.jsx($e, { path: "/live/mission", element: /* @__PURE__ */ s.jsx(Pb, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/live/twin", element: /* @__PURE__ */ s.jsx(t_, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/live/climate", element: /* @__PURE__ */ s.jsx(n_, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/live/main", element: /* @__PURE__ */ s.jsx(l_, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/live/clone", element: /* @__PURE__ */ s.jsx(a_, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/live/root", element: /* @__PURE__ */ s.jsx(s_, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/live/light", element: /* @__PURE__ */ s.jsx(r_, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/grow", element: /* @__PURE__ */ s.jsx(_s, { to: "/grow/compose", replace: !0 }) }),
      /* @__PURE__ */ s.jsx($e, { path: "/grow/compose", element: /* @__PURE__ */ s.jsx(Gb, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/grow/research", element: /* @__PURE__ */ s.jsx(qb, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/grow/roster", element: /* @__PURE__ */ s.jsx(Yb, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/tune", element: /* @__PURE__ */ s.jsx(_s, { to: "/tune/learning", replace: !0 }) }),
      /* @__PURE__ */ s.jsx($e, { path: "/tune/learning", element: /* @__PURE__ */ s.jsx(f_, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/tune/analytics", element: /* @__PURE__ */ s.jsx(h_, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/fleet", element: /* @__PURE__ */ s.jsx(m_, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/ops/*", element: /* @__PURE__ */ s.jsx(Cl, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/ops", element: /* @__PURE__ */ s.jsx(Cl, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/plant/*", element: /* @__PURE__ */ s.jsx(Cl, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/plant", element: /* @__PURE__ */ s.jsx(Cl, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/advanced/*", element: /* @__PURE__ */ s.jsx(Cl, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/advanced", element: /* @__PURE__ */ s.jsx(Cl, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/system", element: /* @__PURE__ */ s.jsx(Cl, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "*", element: /* @__PURE__ */ s.jsx(Cp, {}) })
    ] })
  ] });
}
function S_({ hass: a }) {
  return /* @__PURE__ */ s.jsx(Zx, { hass: a, children: /* @__PURE__ */ s.jsx(Xb, { children: /* @__PURE__ */ s.jsx(j_, {}) }) });
}
function w_({
  panel: a
}) {
  const [r, o] = y.useState(() => a.hass);
  return y.useEffect(() => {
    const u = () => o(a.hass);
    return u(), a.addEventListener("hass-updated", u), () => {
      a.removeEventListener("hass-updated", u);
    };
  }, [a]), /* @__PURE__ */ s.jsx(zx, { children: /* @__PURE__ */ s.jsx(S_, { hass: r }) });
}
class N_ extends HTMLElement {
  constructor() {
    super(...arguments);
    Vi(this, "_root", null);
    Vi(this, "_hass", null);
    Vi(this, "_mounted", !1);
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
${y_}`, this.shadowRoot.appendChild(o);
      const u = document.createElement("div");
      u.className = "dsc-root", u.style.height = "100%", this.shadowRoot.appendChild(u), this._root = u0.createRoot(u), this._root.render(/* @__PURE__ */ s.jsx(w_, { panel: this })), this._mounted = !0;
    }
  }
  disconnectedCallback() {
    this._root?.unmount(), this._root = null, this._mounted = !1;
  }
}
customElements.get("dsc-hub-panel") || customElements.define("dsc-hub-panel", N_);
export {
  N_ as default
};
//# sourceMappingURL=dsc-hub-panel.js.map
