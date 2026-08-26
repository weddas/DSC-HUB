var hx = Object.defineProperty;
var fx = (a, i, r) => i in a ? hx(a, i, { enumerable: !0, configurable: !0, writable: !0, value: r }) : a[i] = r;
var ti = (a, i, r) => fx(a, typeof i != "symbol" ? i + "" : i, r);
var Du = { exports: {} }, ni = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var zp;
function mx() {
  if (zp) return ni;
  zp = 1;
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
  return ni.Fragment = i, ni.jsx = r, ni.jsxs = r, ni;
}
var Dp;
function px() {
  return Dp || (Dp = 1, Du.exports = mx()), Du.exports;
}
var s = px(), Ou = { exports: {} }, we = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Op;
function _x() {
  if (Op) return we;
  Op = 1;
  var a = Symbol.for("react.transitional.element"), i = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), o = Symbol.for("react.strict_mode"), d = Symbol.for("react.profiler"), h = Symbol.for("react.consumer"), f = Symbol.for("react.context"), m = Symbol.for("react.forward_ref"), p = Symbol.for("react.suspense"), b = Symbol.for("react.memo"), v = Symbol.for("react.lazy"), g = Symbol.for("react.activity"), y = Symbol.iterator;
  function j(N) {
    return N === null || typeof N != "object" ? null : (N = y && N[y] || N["@@iterator"], typeof N == "function" ? N : null);
  }
  var k = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, T = Object.assign, C = {};
  function M(N, H, Q) {
    this.props = N, this.context = H, this.refs = C, this.updater = Q || k;
  }
  M.prototype.isReactComponent = {}, M.prototype.setState = function(N, H) {
    if (typeof N != "object" && typeof N != "function" && N != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, N, H, "setState");
  }, M.prototype.forceUpdate = function(N) {
    this.updater.enqueueForceUpdate(this, N, "forceUpdate");
  };
  function E() {
  }
  E.prototype = M.prototype;
  function F(N, H, Q) {
    this.props = N, this.context = H, this.refs = C, this.updater = Q || k;
  }
  var P = F.prototype = new E();
  P.constructor = F, T(P, M.prototype), P.isPureReactComponent = !0;
  var K = Array.isArray;
  function L() {
  }
  var G = { H: null, A: null, T: null, S: null }, ee = Object.prototype.hasOwnProperty;
  function le(N, H, Q) {
    var ne = Q.ref;
    return {
      $$typeof: a,
      type: N,
      key: H,
      ref: ne !== void 0 ? ne : null,
      props: Q
    };
  }
  function te(N, H) {
    return le(N.type, H, N.props);
  }
  function ue(N) {
    return typeof N == "object" && N !== null && N.$$typeof === a;
  }
  function ie(N) {
    var H = { "=": "=0", ":": "=2" };
    return "$" + N.replace(/[=:]/g, function(Q) {
      return H[Q];
    });
  }
  var re = /\/+/g;
  function fe(N, H) {
    return typeof N == "object" && N !== null && N.key != null ? ie("" + N.key) : H.toString(36);
  }
  function oe(N) {
    switch (N.status) {
      case "fulfilled":
        return N.value;
      case "rejected":
        throw N.reason;
      default:
        switch (typeof N.status == "string" ? N.then(L, L) : (N.status = "pending", N.then(
          function(H) {
            N.status === "pending" && (N.status = "fulfilled", N.value = H);
          },
          function(H) {
            N.status === "pending" && (N.status = "rejected", N.reason = H);
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
  function S(N, H, Q, ne, pe) {
    var de = typeof N;
    (de === "undefined" || de === "boolean") && (N = null);
    var ve = !1;
    if (N === null) ve = !0;
    else
      switch (de) {
        case "bigint":
        case "string":
        case "number":
          ve = !0;
          break;
        case "object":
          switch (N.$$typeof) {
            case a:
            case i:
              ve = !0;
              break;
            case v:
              return ve = N._init, S(
                ve(N._payload),
                H,
                Q,
                ne,
                pe
              );
          }
      }
    if (ve)
      return pe = pe(N), ve = ne === "" ? "." + fe(N, 0) : ne, K(pe) ? (Q = "", ve != null && (Q = ve.replace(re, "$&/") + "/"), S(pe, H, Q, "", function(ke) {
        return ke;
      })) : pe != null && (ue(pe) && (pe = te(
        pe,
        Q + (pe.key == null || N && N.key === pe.key ? "" : ("" + pe.key).replace(
          re,
          "$&/"
        ) + "/") + ve
      )), H.push(pe)), 1;
    ve = 0;
    var $e = ne === "" ? "." : ne + ":";
    if (K(N))
      for (var Z = 0; Z < N.length; Z++)
        ne = N[Z], de = $e + fe(ne, Z), ve += S(
          ne,
          H,
          Q,
          de,
          pe
        );
    else if (Z = j(N), typeof Z == "function")
      for (N = Z.call(N), Z = 0; !(ne = N.next()).done; )
        ne = ne.value, de = $e + fe(ne, Z++), ve += S(
          ne,
          H,
          Q,
          de,
          pe
        );
    else if (de === "object") {
      if (typeof N.then == "function")
        return S(
          oe(N),
          H,
          Q,
          ne,
          pe
        );
      throw H = String(N), Error(
        "Objects are not valid as a React child (found: " + (H === "[object Object]" ? "object with keys {" + Object.keys(N).join(", ") + "}" : H) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return ve;
  }
  function z(N, H, Q) {
    if (N == null) return N;
    var ne = [], pe = 0;
    return S(N, ne, "", "", function(de) {
      return H.call(Q, de, pe++);
    }), ne;
  }
  function q(N) {
    if (N._status === -1) {
      var H = N._result;
      H = H(), H.then(
        function(Q) {
          (N._status === 0 || N._status === -1) && (N._status = 1, N._result = Q);
        },
        function(Q) {
          (N._status === 0 || N._status === -1) && (N._status = 2, N._result = Q);
        }
      ), N._status === -1 && (N._status = 0, N._result = H);
    }
    if (N._status === 1) return N._result.default;
    throw N._result;
  }
  var Y = typeof reportError == "function" ? reportError : function(N) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var H = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof N == "object" && N !== null && typeof N.message == "string" ? String(N.message) : String(N),
        error: N
      });
      if (!window.dispatchEvent(H)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", N);
      return;
    }
    console.error(N);
  }, I = {
    map: z,
    forEach: function(N, H, Q) {
      z(
        N,
        function() {
          H.apply(this, arguments);
        },
        Q
      );
    },
    count: function(N) {
      var H = 0;
      return z(N, function() {
        H++;
      }), H;
    },
    toArray: function(N) {
      return z(N, function(H) {
        return H;
      }) || [];
    },
    only: function(N) {
      if (!ue(N))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return N;
    }
  };
  return we.Activity = g, we.Children = I, we.Component = M, we.Fragment = r, we.Profiler = d, we.PureComponent = F, we.StrictMode = o, we.Suspense = p, we.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = G, we.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(N) {
      return G.H.useMemoCache(N);
    }
  }, we.cache = function(N) {
    return function() {
      return N.apply(null, arguments);
    };
  }, we.cacheSignal = function() {
    return null;
  }, we.cloneElement = function(N, H, Q) {
    if (N == null)
      throw Error(
        "The argument must be a React element, but you passed " + N + "."
      );
    var ne = T({}, N.props), pe = N.key;
    if (H != null)
      for (de in H.key !== void 0 && (pe = "" + H.key), H)
        !ee.call(H, de) || de === "key" || de === "__self" || de === "__source" || de === "ref" && H.ref === void 0 || (ne[de] = H[de]);
    var de = arguments.length - 2;
    if (de === 1) ne.children = Q;
    else if (1 < de) {
      for (var ve = Array(de), $e = 0; $e < de; $e++)
        ve[$e] = arguments[$e + 2];
      ne.children = ve;
    }
    return le(N.type, pe, ne);
  }, we.createContext = function(N) {
    return N = {
      $$typeof: f,
      _currentValue: N,
      _currentValue2: N,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, N.Provider = N, N.Consumer = {
      $$typeof: h,
      _context: N
    }, N;
  }, we.createElement = function(N, H, Q) {
    var ne, pe = {}, de = null;
    if (H != null)
      for (ne in H.key !== void 0 && (de = "" + H.key), H)
        ee.call(H, ne) && ne !== "key" && ne !== "__self" && ne !== "__source" && (pe[ne] = H[ne]);
    var ve = arguments.length - 2;
    if (ve === 1) pe.children = Q;
    else if (1 < ve) {
      for (var $e = Array(ve), Z = 0; Z < ve; Z++)
        $e[Z] = arguments[Z + 2];
      pe.children = $e;
    }
    if (N && N.defaultProps)
      for (ne in ve = N.defaultProps, ve)
        pe[ne] === void 0 && (pe[ne] = ve[ne]);
    return le(N, de, pe);
  }, we.createRef = function() {
    return { current: null };
  }, we.forwardRef = function(N) {
    return { $$typeof: m, render: N };
  }, we.isValidElement = ue, we.lazy = function(N) {
    return {
      $$typeof: v,
      _payload: { _status: -1, _result: N },
      _init: q
    };
  }, we.memo = function(N, H) {
    return {
      $$typeof: b,
      type: N,
      compare: H === void 0 ? null : H
    };
  }, we.startTransition = function(N) {
    var H = G.T, Q = {};
    G.T = Q;
    try {
      var ne = N(), pe = G.S;
      pe !== null && pe(Q, ne), typeof ne == "object" && ne !== null && typeof ne.then == "function" && ne.then(L, Y);
    } catch (de) {
      Y(de);
    } finally {
      H !== null && Q.types !== null && (H.types = Q.types), G.T = H;
    }
  }, we.unstable_useCacheRefresh = function() {
    return G.H.useCacheRefresh();
  }, we.use = function(N) {
    return G.H.use(N);
  }, we.useActionState = function(N, H, Q) {
    return G.H.useActionState(N, H, Q);
  }, we.useCallback = function(N, H) {
    return G.H.useCallback(N, H);
  }, we.useContext = function(N) {
    return G.H.useContext(N);
  }, we.useDebugValue = function() {
  }, we.useDeferredValue = function(N, H) {
    return G.H.useDeferredValue(N, H);
  }, we.useEffect = function(N, H) {
    return G.H.useEffect(N, H);
  }, we.useEffectEvent = function(N) {
    return G.H.useEffectEvent(N);
  }, we.useId = function() {
    return G.H.useId();
  }, we.useImperativeHandle = function(N, H, Q) {
    return G.H.useImperativeHandle(N, H, Q);
  }, we.useInsertionEffect = function(N, H) {
    return G.H.useInsertionEffect(N, H);
  }, we.useLayoutEffect = function(N, H) {
    return G.H.useLayoutEffect(N, H);
  }, we.useMemo = function(N, H) {
    return G.H.useMemo(N, H);
  }, we.useOptimistic = function(N, H) {
    return G.H.useOptimistic(N, H);
  }, we.useReducer = function(N, H, Q) {
    return G.H.useReducer(N, H, Q);
  }, we.useRef = function(N) {
    return G.H.useRef(N);
  }, we.useState = function(N) {
    return G.H.useState(N);
  }, we.useSyncExternalStore = function(N, H, Q) {
    return G.H.useSyncExternalStore(
      N,
      H,
      Q
    );
  }, we.useTransition = function() {
    return G.H.useTransition();
  }, we.version = "19.2.8", we;
}
var Hp;
function od() {
  return Hp || (Hp = 1, Ou.exports = _x()), Ou.exports;
}
var x = od(), Hu = { exports: {} }, ai = {}, Lu = { exports: {} }, $u = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Lp;
function bx() {
  return Lp || (Lp = 1, (function(a) {
    function i(S, z) {
      var q = S.length;
      S.push(z);
      e: for (; 0 < q; ) {
        var Y = q - 1 >>> 1, I = S[Y];
        if (0 < d(I, z))
          S[Y] = z, S[q] = I, q = Y;
        else break e;
      }
    }
    function r(S) {
      return S.length === 0 ? null : S[0];
    }
    function o(S) {
      if (S.length === 0) return null;
      var z = S[0], q = S.pop();
      if (q !== z) {
        S[0] = q;
        e: for (var Y = 0, I = S.length, N = I >>> 1; Y < N; ) {
          var H = 2 * (Y + 1) - 1, Q = S[H], ne = H + 1, pe = S[ne];
          if (0 > d(Q, q))
            ne < I && 0 > d(pe, Q) ? (S[Y] = pe, S[ne] = q, Y = ne) : (S[Y] = Q, S[H] = q, Y = H);
          else if (ne < I && 0 > d(pe, q))
            S[Y] = pe, S[ne] = q, Y = ne;
          else break e;
        }
      }
      return z;
    }
    function d(S, z) {
      var q = S.sortIndex - z.sortIndex;
      return q !== 0 ? q : S.id - z.id;
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
    var p = [], b = [], v = 1, g = null, y = 3, j = !1, k = !1, T = !1, C = !1, M = typeof setTimeout == "function" ? setTimeout : null, E = typeof clearTimeout == "function" ? clearTimeout : null, F = typeof setImmediate < "u" ? setImmediate : null;
    function P(S) {
      for (var z = r(b); z !== null; ) {
        if (z.callback === null) o(b);
        else if (z.startTime <= S)
          o(b), z.sortIndex = z.expirationTime, i(p, z);
        else break;
        z = r(b);
      }
    }
    function K(S) {
      if (T = !1, P(S), !k)
        if (r(p) !== null)
          k = !0, L || (L = !0, ie());
        else {
          var z = r(b);
          z !== null && oe(K, z.startTime - S);
        }
    }
    var L = !1, G = -1, ee = 5, le = -1;
    function te() {
      return C ? !0 : !(a.unstable_now() - le < ee);
    }
    function ue() {
      if (C = !1, L) {
        var S = a.unstable_now();
        le = S;
        var z = !0;
        try {
          e: {
            k = !1, T && (T = !1, E(G), G = -1), j = !0;
            var q = y;
            try {
              t: {
                for (P(S), g = r(p); g !== null && !(g.expirationTime > S && te()); ) {
                  var Y = g.callback;
                  if (typeof Y == "function") {
                    g.callback = null, y = g.priorityLevel;
                    var I = Y(
                      g.expirationTime <= S
                    );
                    if (S = a.unstable_now(), typeof I == "function") {
                      g.callback = I, P(S), z = !0;
                      break t;
                    }
                    g === r(p) && o(p), P(S);
                  } else o(p);
                  g = r(p);
                }
                if (g !== null) z = !0;
                else {
                  var N = r(b);
                  N !== null && oe(
                    K,
                    N.startTime - S
                  ), z = !1;
                }
              }
              break e;
            } finally {
              g = null, y = q, j = !1;
            }
            z = void 0;
          }
        } finally {
          z ? ie() : L = !1;
        }
      }
    }
    var ie;
    if (typeof F == "function")
      ie = function() {
        F(ue);
      };
    else if (typeof MessageChannel < "u") {
      var re = new MessageChannel(), fe = re.port2;
      re.port1.onmessage = ue, ie = function() {
        fe.postMessage(null);
      };
    } else
      ie = function() {
        M(ue, 0);
      };
    function oe(S, z) {
      G = M(function() {
        S(a.unstable_now());
      }, z);
    }
    a.unstable_IdlePriority = 5, a.unstable_ImmediatePriority = 1, a.unstable_LowPriority = 4, a.unstable_NormalPriority = 3, a.unstable_Profiling = null, a.unstable_UserBlockingPriority = 2, a.unstable_cancelCallback = function(S) {
      S.callback = null;
    }, a.unstable_forceFrameRate = function(S) {
      0 > S || 125 < S ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : ee = 0 < S ? Math.floor(1e3 / S) : 5;
    }, a.unstable_getCurrentPriorityLevel = function() {
      return y;
    }, a.unstable_next = function(S) {
      switch (y) {
        case 1:
        case 2:
        case 3:
          var z = 3;
          break;
        default:
          z = y;
      }
      var q = y;
      y = z;
      try {
        return S();
      } finally {
        y = q;
      }
    }, a.unstable_requestPaint = function() {
      C = !0;
    }, a.unstable_runWithPriority = function(S, z) {
      switch (S) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          S = 3;
      }
      var q = y;
      y = S;
      try {
        return z();
      } finally {
        y = q;
      }
    }, a.unstable_scheduleCallback = function(S, z, q) {
      var Y = a.unstable_now();
      switch (typeof q == "object" && q !== null ? (q = q.delay, q = typeof q == "number" && 0 < q ? Y + q : Y) : q = Y, S) {
        case 1:
          var I = -1;
          break;
        case 2:
          I = 250;
          break;
        case 5:
          I = 1073741823;
          break;
        case 4:
          I = 1e4;
          break;
        default:
          I = 5e3;
      }
      return I = q + I, S = {
        id: v++,
        callback: z,
        priorityLevel: S,
        startTime: q,
        expirationTime: I,
        sortIndex: -1
      }, q > Y ? (S.sortIndex = q, i(b, S), r(p) === null && S === r(b) && (T ? (E(G), G = -1) : T = !0, oe(K, q - Y))) : (S.sortIndex = I, i(p, S), k || j || (k = !0, L || (L = !0, ie()))), S;
    }, a.unstable_shouldYield = te, a.unstable_wrapCallback = function(S) {
      var z = y;
      return function() {
        var q = y;
        y = z;
        try {
          return S.apply(this, arguments);
        } finally {
          y = q;
        }
      };
    };
  })($u)), $u;
}
var $p;
function gx() {
  return $p || ($p = 1, Lu.exports = bx()), Lu.exports;
}
var Uu = { exports: {} }, Tt = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Up;
function vx() {
  if (Up) return Tt;
  Up = 1;
  var a = od();
  function i(p) {
    var b = "https://react.dev/errors/" + p;
    if (1 < arguments.length) {
      b += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var v = 2; v < arguments.length; v++)
        b += "&args[]=" + encodeURIComponent(arguments[v]);
    }
    return "Minified React error #" + p + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
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
  function h(p, b, v) {
    var g = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: d,
      key: g == null ? null : "" + g,
      children: p,
      containerInfo: b,
      implementation: v
    };
  }
  var f = a.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function m(p, b) {
    if (p === "font") return "";
    if (typeof b == "string")
      return b === "use-credentials" ? b : "";
  }
  return Tt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o, Tt.createPortal = function(p, b) {
    var v = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!b || b.nodeType !== 1 && b.nodeType !== 9 && b.nodeType !== 11)
      throw Error(i(299));
    return h(p, b, null, v);
  }, Tt.flushSync = function(p) {
    var b = f.T, v = o.p;
    try {
      if (f.T = null, o.p = 2, p) return p();
    } finally {
      f.T = b, o.p = v, o.d.f();
    }
  }, Tt.preconnect = function(p, b) {
    typeof p == "string" && (b ? (b = b.crossOrigin, b = typeof b == "string" ? b === "use-credentials" ? b : "" : void 0) : b = null, o.d.C(p, b));
  }, Tt.prefetchDNS = function(p) {
    typeof p == "string" && o.d.D(p);
  }, Tt.preinit = function(p, b) {
    if (typeof p == "string" && b && typeof b.as == "string") {
      var v = b.as, g = m(v, b.crossOrigin), y = typeof b.integrity == "string" ? b.integrity : void 0, j = typeof b.fetchPriority == "string" ? b.fetchPriority : void 0;
      v === "style" ? o.d.S(
        p,
        typeof b.precedence == "string" ? b.precedence : void 0,
        {
          crossOrigin: g,
          integrity: y,
          fetchPriority: j
        }
      ) : v === "script" && o.d.X(p, {
        crossOrigin: g,
        integrity: y,
        fetchPriority: j,
        nonce: typeof b.nonce == "string" ? b.nonce : void 0
      });
    }
  }, Tt.preinitModule = function(p, b) {
    if (typeof p == "string")
      if (typeof b == "object" && b !== null) {
        if (b.as == null || b.as === "script") {
          var v = m(
            b.as,
            b.crossOrigin
          );
          o.d.M(p, {
            crossOrigin: v,
            integrity: typeof b.integrity == "string" ? b.integrity : void 0,
            nonce: typeof b.nonce == "string" ? b.nonce : void 0
          });
        }
      } else b == null && o.d.M(p);
  }, Tt.preload = function(p, b) {
    if (typeof p == "string" && typeof b == "object" && b !== null && typeof b.as == "string") {
      var v = b.as, g = m(v, b.crossOrigin);
      o.d.L(p, v, {
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
  }, Tt.preloadModule = function(p, b) {
    if (typeof p == "string")
      if (b) {
        var v = m(b.as, b.crossOrigin);
        o.d.m(p, {
          as: typeof b.as == "string" && b.as !== "script" ? b.as : void 0,
          crossOrigin: v,
          integrity: typeof b.integrity == "string" ? b.integrity : void 0
        });
      } else o.d.m(p);
  }, Tt.requestFormReset = function(p) {
    o.d.r(p);
  }, Tt.unstable_batchedUpdates = function(p, b) {
    return p(b);
  }, Tt.useFormState = function(p, b, v) {
    return f.H.useFormState(p, b, v);
  }, Tt.useFormStatus = function() {
    return f.H.useHostTransitionStatus();
  }, Tt.version = "19.2.8", Tt;
}
var Bp;
function T_() {
  if (Bp) return Uu.exports;
  Bp = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (i) {
        console.error(i);
      }
  }
  return a(), Uu.exports = vx(), Uu.exports;
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
var Fp;
function xx() {
  if (Fp) return ai;
  Fp = 1;
  var a = gx(), i = od(), r = T_();
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
  function p(e) {
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
          if (u === n) return p(c), e;
          if (u === l) return p(c), t;
          u = u.sibling;
        }
        throw Error(o(188));
      }
      if (n.return !== l.return) n = c, l = u;
      else {
        for (var _ = !1, w = c.child; w; ) {
          if (w === n) {
            _ = !0, n = c, l = u;
            break;
          }
          if (w === l) {
            _ = !0, l = c, n = u;
            break;
          }
          w = w.sibling;
        }
        if (!_) {
          for (w = u.child; w; ) {
            if (w === n) {
              _ = !0, n = u, l = c;
              break;
            }
            if (w === l) {
              _ = !0, l = u, n = c;
              break;
            }
            w = w.sibling;
          }
          if (!_) throw Error(o(189));
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
  var g = Object.assign, y = Symbol.for("react.element"), j = Symbol.for("react.transitional.element"), k = Symbol.for("react.portal"), T = Symbol.for("react.fragment"), C = Symbol.for("react.strict_mode"), M = Symbol.for("react.profiler"), E = Symbol.for("react.consumer"), F = Symbol.for("react.context"), P = Symbol.for("react.forward_ref"), K = Symbol.for("react.suspense"), L = Symbol.for("react.suspense_list"), G = Symbol.for("react.memo"), ee = Symbol.for("react.lazy"), le = Symbol.for("react.activity"), te = Symbol.for("react.memo_cache_sentinel"), ue = Symbol.iterator;
  function ie(e) {
    return e === null || typeof e != "object" ? null : (e = ue && e[ue] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var re = Symbol.for("react.client.reference");
  function fe(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === re ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case T:
        return "Fragment";
      case M:
        return "Profiler";
      case C:
        return "StrictMode";
      case K:
        return "Suspense";
      case L:
        return "SuspenseList";
      case le:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case k:
          return "Portal";
        case F:
          return e.displayName || "Context";
        case E:
          return (e._context.displayName || "Context") + ".Consumer";
        case P:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case G:
          return t = e.displayName || null, t !== null ? t : fe(e.type) || "Memo";
        case ee:
          t = e._payload, e = e._init;
          try {
            return fe(e(t));
          } catch {
          }
      }
    return null;
  }
  var oe = Array.isArray, S = i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, z = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, q = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, Y = [], I = -1;
  function N(e) {
    return { current: e };
  }
  function H(e) {
    0 > I || (e.current = Y[I], Y[I] = null, I--);
  }
  function Q(e, t) {
    I++, Y[I] = e.current, e.current = t;
  }
  var ne = N(null), pe = N(null), de = N(null), ve = N(null);
  function $e(e, t) {
    switch (Q(de, t), Q(pe, e), Q(ne, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? np(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = np(t), e = ap(t, e);
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
    H(ne), Q(ne, e);
  }
  function Z() {
    H(ne), H(pe), H(de);
  }
  function ke(e) {
    e.memoizedState !== null && Q(ve, e);
    var t = ne.current, n = ap(t, e.type);
    t !== n && (Q(pe, e), Q(ne, n));
  }
  function Be(e) {
    pe.current === e && (H(ne), H(pe)), ve.current === e && (H(ve), Pl._currentValue = q);
  }
  var _e, Ve;
  function se(e) {
    if (_e === void 0)
      try {
        throw Error();
      } catch (n) {
        var t = n.stack.trim().match(/\n( *(at )?)/);
        _e = t && t[1] || "", Ve = -1 < n.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < n.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + _e + e + Ve;
  }
  var Qe = !1;
  function xe(e, t) {
    if (!e || Qe) return "";
    Qe = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var l = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var W = function() {
                throw Error();
              };
              if (Object.defineProperty(W.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(W, []);
                } catch (V) {
                  var B = V;
                }
                Reflect.construct(e, [], W);
              } else {
                try {
                  W.call();
                } catch (V) {
                  B = V;
                }
                e.call(W.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (V) {
                B = V;
              }
              (W = e()) && typeof W.catch == "function" && W.catch(function() {
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
      var u = l.DetermineComponentFrameRoot(), _ = u[0], w = u[1];
      if (_ && w) {
        var R = _.split(`
`), U = w.split(`
`);
        for (c = l = 0; l < R.length && !R[l].includes("DetermineComponentFrameRoot"); )
          l++;
        for (; c < U.length && !U[c].includes(
          "DetermineComponentFrameRoot"
        ); )
          c++;
        if (l === R.length || c === U.length)
          for (l = R.length - 1, c = U.length - 1; 1 <= l && 0 <= c && R[l] !== U[c]; )
            c--;
        for (; 1 <= l && 0 <= c; l--, c--)
          if (R[l] !== U[c]) {
            if (l !== 1 || c !== 1)
              do
                if (l--, c--, 0 > c || R[l] !== U[c]) {
                  var X = `
` + R[l].replace(" at new ", " at ");
                  return e.displayName && X.includes("<anonymous>") && (X = X.replace("<anonymous>", e.displayName)), X;
                }
              while (1 <= l && 0 <= c);
            break;
          }
      }
    } finally {
      Qe = !1, Error.prepareStackTrace = n;
    }
    return (n = e ? e.displayName || e.name : "") ? se(n) : "";
  }
  function Pe(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return se(e.type);
      case 16:
        return se("Lazy");
      case 13:
        return e.child !== t && t !== null ? se("Suspense Fallback") : se("Suspense");
      case 19:
        return se("SuspenseList");
      case 0:
      case 15:
        return xe(e.type, !1);
      case 11:
        return xe(e.type.render, !1);
      case 1:
        return xe(e.type, !0);
      case 31:
        return se("Activity");
      default:
        return "";
    }
  }
  function We(e) {
    try {
      var t = "", n = null;
      do
        t += Pe(e, n), n = e, e = e.return;
      while (e);
      return t;
    } catch (l) {
      return `
Error generating stack: ` + l.message + `
` + l.stack;
    }
  }
  var De = Object.prototype.hasOwnProperty, Ut = a.unstable_scheduleCallback, Bt = a.unstable_cancelCallback, rn = a.unstable_shouldYield, Jt = a.unstable_requestPaint, it = a.unstable_now, ol = a.unstable_getCurrentPriorityLevel, ze = a.unstable_ImmediatePriority, hs = a.unstable_UserBlockingPriority, fs = a.unstable_NormalPriority, go = a.unstable_LowPriority, bi = a.unstable_IdlePriority, vo = a.log, xo = a.unstable_setDisableYieldValue, Fa = null, Dt = null;
  function vn(e) {
    if (typeof vo == "function" && xo(e), Dt && typeof Dt.setStrictMode == "function")
      try {
        Dt.setStrictMode(Fa, e);
      } catch {
      }
  }
  var Et = Math.clz32 ? Math.clz32 : yo, cl = Math.log, kn = Math.LN2;
  function yo(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (cl(e) / kn | 0) | 0;
  }
  var ms = 256, gi = 262144, vi = 4194304;
  function Ga(e) {
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
  function xi(e, t, n) {
    var l = e.pendingLanes;
    if (l === 0) return 0;
    var c = 0, u = e.suspendedLanes, _ = e.pingedLanes;
    e = e.warmLanes;
    var w = l & 134217727;
    return w !== 0 ? (l = w & ~u, l !== 0 ? c = Ga(l) : (_ &= w, _ !== 0 ? c = Ga(_) : n || (n = w & ~e, n !== 0 && (c = Ga(n))))) : (w = l & ~u, w !== 0 ? c = Ga(w) : _ !== 0 ? c = Ga(_) : n || (n = l & ~e, n !== 0 && (c = Ga(n)))), c === 0 ? 0 : t !== 0 && t !== c && (t & u) === 0 && (u = c & -c, n = t & -t, u >= n || u === 32 && (n & 4194048) !== 0) ? t : c;
  }
  function ul(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function Ib(e, t) {
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
  function Hd() {
    var e = vi;
    return vi <<= 1, (vi & 62914560) === 0 && (vi = 4194304), e;
  }
  function wo(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function dl(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function eg(e, t, n, l, c, u) {
    var _ = e.pendingLanes;
    e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
    var w = e.entanglements, R = e.expirationTimes, U = e.hiddenUpdates;
    for (n = _ & ~n; 0 < n; ) {
      var X = 31 - Et(n), W = 1 << X;
      w[X] = 0, R[X] = -1;
      var B = U[X];
      if (B !== null)
        for (U[X] = null, X = 0; X < B.length; X++) {
          var V = B[X];
          V !== null && (V.lane &= -536870913);
        }
      n &= ~W;
    }
    l !== 0 && Ld(e, l, 0), u !== 0 && c === 0 && e.tag !== 0 && (e.suspendedLanes |= u & ~(_ & ~t));
  }
  function Ld(e, t, n) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var l = 31 - Et(t);
    e.entangledLanes |= t, e.entanglements[l] = e.entanglements[l] | 1073741824 | n & 261930;
  }
  function $d(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var l = 31 - Et(n), c = 1 << l;
      c & t | e[l] & t && (e[l] |= t), n &= ~c;
    }
  }
  function Ud(e, t) {
    var n = t & -t;
    return n = (n & 42) !== 0 ? 1 : jo(n), (n & (e.suspendedLanes | t)) !== 0 ? 0 : n;
  }
  function jo(e) {
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
  function So(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Bd() {
    var e = z.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : Np(e.type));
  }
  function Fd(e, t) {
    var n = z.p;
    try {
      return z.p = e, t();
    } finally {
      z.p = n;
    }
  }
  var la = Math.random().toString(36).slice(2), yt = "__reactFiber$" + la, Ft = "__reactProps$" + la, ps = "__reactContainer$" + la, ko = "__reactEvents$" + la, tg = "__reactListeners$" + la, ng = "__reactHandles$" + la, Gd = "__reactResources$" + la, hl = "__reactMarker$" + la;
  function No(e) {
    delete e[yt], delete e[Ft], delete e[ko], delete e[tg], delete e[ng];
  }
  function _s(e) {
    var t = e[yt];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[ps] || n[yt]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null)
          for (e = up(e); e !== null; ) {
            if (n = e[yt]) return n;
            e = up(e);
          }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function bs(e) {
    if (e = e[yt] || e[ps]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function fl(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(o(33));
  }
  function gs(e) {
    var t = e[Gd];
    return t || (t = e[Gd] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function bt(e) {
    e[hl] = !0;
  }
  var Vd = /* @__PURE__ */ new Set(), qd = {};
  function Va(e, t) {
    vs(e, t), vs(e + "Capture", t);
  }
  function vs(e, t) {
    for (qd[e] = t, e = 0; e < t.length; e++)
      Vd.add(t[e]);
  }
  var ag = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Yd = {}, Xd = {};
  function sg(e) {
    return De.call(Xd, e) ? !0 : De.call(Yd, e) ? !1 : ag.test(e) ? Xd[e] = !0 : (Yd[e] = !0, !1);
  }
  function yi(e, t, n) {
    if (sg(t))
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
  function wi(e, t, n) {
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
  function On(e, t, n, l) {
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
  function on(e) {
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
  function Qd(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function lg(e, t, n) {
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
        set: function(_) {
          n = "" + _, u.call(this, _);
        }
      }), Object.defineProperty(e, t, {
        enumerable: l.enumerable
      }), {
        getValue: function() {
          return n;
        },
        setValue: function(_) {
          n = "" + _;
        },
        stopTracking: function() {
          e._valueTracker = null, delete e[t];
        }
      };
    }
  }
  function Co(e) {
    if (!e._valueTracker) {
      var t = Qd(e) ? "checked" : "value";
      e._valueTracker = lg(
        e,
        t,
        "" + e[t]
      );
    }
  }
  function Zd(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), l = "";
    return e && (l = Qd(e) ? e.checked ? "true" : "false" : e.value), e = l, e !== n ? (t.setValue(e), !0) : !1;
  }
  function ji(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var ig = /[\n"\\]/g;
  function cn(e) {
    return e.replace(
      ig,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Eo(e, t, n, l, c, u, _, w) {
    e.name = "", _ != null && typeof _ != "function" && typeof _ != "symbol" && typeof _ != "boolean" ? e.type = _ : e.removeAttribute("type"), t != null ? _ === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + on(t)) : e.value !== "" + on(t) && (e.value = "" + on(t)) : _ !== "submit" && _ !== "reset" || e.removeAttribute("value"), t != null ? To(e, _, on(t)) : n != null ? To(e, _, on(n)) : l != null && e.removeAttribute("value"), c == null && u != null && (e.defaultChecked = !!u), c != null && (e.checked = c && typeof c != "function" && typeof c != "symbol"), w != null && typeof w != "function" && typeof w != "symbol" && typeof w != "boolean" ? e.name = "" + on(w) : e.removeAttribute("name");
  }
  function Kd(e, t, n, l, c, u, _, w) {
    if (u != null && typeof u != "function" && typeof u != "symbol" && typeof u != "boolean" && (e.type = u), t != null || n != null) {
      if (!(u !== "submit" && u !== "reset" || t != null)) {
        Co(e);
        return;
      }
      n = n != null ? "" + on(n) : "", t = t != null ? "" + on(t) : n, w || t === e.value || (e.value = t), e.defaultValue = t;
    }
    l = l ?? c, l = typeof l != "function" && typeof l != "symbol" && !!l, e.checked = w ? e.checked : !!l, e.defaultChecked = !!l, _ != null && typeof _ != "function" && typeof _ != "symbol" && typeof _ != "boolean" && (e.name = _), Co(e);
  }
  function To(e, t, n) {
    t === "number" && ji(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
  }
  function xs(e, t, n, l) {
    if (e = e.options, t) {
      t = {};
      for (var c = 0; c < n.length; c++)
        t["$" + n[c]] = !0;
      for (n = 0; n < e.length; n++)
        c = t.hasOwnProperty("$" + e[n].value), e[n].selected !== c && (e[n].selected = c), c && l && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + on(n), t = null, c = 0; c < e.length; c++) {
        if (e[c].value === n) {
          e[c].selected = !0, l && (e[c].defaultSelected = !0);
          return;
        }
        t !== null || e[c].disabled || (t = e[c]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Jd(e, t, n) {
    if (t != null && (t = "" + on(t), t !== e.value && (e.value = t), n == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = n != null ? "" + on(n) : "";
  }
  function Pd(e, t, n, l) {
    if (t == null) {
      if (l != null) {
        if (n != null) throw Error(o(92));
        if (oe(l)) {
          if (1 < l.length) throw Error(o(93));
          l = l[0];
        }
        n = l;
      }
      n == null && (n = ""), t = n;
    }
    n = on(t), e.defaultValue = n, l = e.textContent, l === n && l !== "" && l !== null && (e.value = l), Co(e);
  }
  function ys(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var rg = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Wd(e, t, n) {
    var l = t.indexOf("--") === 0;
    n == null || typeof n == "boolean" || n === "" ? l ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : l ? e.setProperty(t, n) : typeof n != "number" || n === 0 || rg.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
  }
  function Id(e, t, n) {
    if (t != null && typeof t != "object")
      throw Error(o(62));
    if (e = e.style, n != null) {
      for (var l in n)
        !n.hasOwnProperty(l) || t != null && t.hasOwnProperty(l) || (l.indexOf("--") === 0 ? e.setProperty(l, "") : l === "float" ? e.cssFloat = "" : e[l] = "");
      for (var c in t)
        l = t[c], t.hasOwnProperty(c) && n[c] !== l && Wd(e, c, l);
    } else
      for (var u in t)
        t.hasOwnProperty(u) && Wd(e, u, t[u]);
  }
  function Mo(e) {
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
  var og = /* @__PURE__ */ new Map([
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
  ]), cg = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Si(e) {
    return cg.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  function Hn() {
  }
  var Ro = null;
  function Ao(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var ws = null, js = null;
  function eh(e) {
    var t = bs(e);
    if (t && (e = t.stateNode)) {
      var n = e[Ft] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (Eo(
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
                var c = l[Ft] || null;
                if (!c) throw Error(o(90));
                Eo(
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
              l = n[t], l.form === e.form && Zd(l);
          }
          break e;
        case "textarea":
          Jd(e, n.value, n.defaultValue);
          break e;
        case "select":
          t = n.value, t != null && xs(e, !!n.multiple, t, !1);
      }
    }
  }
  var zo = !1;
  function th(e, t, n) {
    if (zo) return e(t, n);
    zo = !0;
    try {
      var l = e(t);
      return l;
    } finally {
      if (zo = !1, (ws !== null || js !== null) && (dr(), ws && (t = ws, e = js, js = ws = null, eh(t), e)))
        for (t = 0; t < e.length; t++) eh(e[t]);
    }
  }
  function ml(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var l = n[Ft] || null;
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
  var Ln = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Do = !1;
  if (Ln)
    try {
      var pl = {};
      Object.defineProperty(pl, "passive", {
        get: function() {
          Do = !0;
        }
      }), window.addEventListener("test", pl, pl), window.removeEventListener("test", pl, pl);
    } catch {
      Do = !1;
    }
  var ia = null, Oo = null, ki = null;
  function nh() {
    if (ki) return ki;
    var e, t = Oo, n = t.length, l, c = "value" in ia ? ia.value : ia.textContent, u = c.length;
    for (e = 0; e < n && t[e] === c[e]; e++) ;
    var _ = n - e;
    for (l = 1; l <= _ && t[n - l] === c[u - l]; l++) ;
    return ki = c.slice(e, 1 < l ? 1 - l : void 0);
  }
  function Ni(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Ci() {
    return !0;
  }
  function ah() {
    return !1;
  }
  function Gt(e) {
    function t(n, l, c, u, _) {
      this._reactName = n, this._targetInst = c, this.type = l, this.nativeEvent = u, this.target = _, this.currentTarget = null;
      for (var w in e)
        e.hasOwnProperty(w) && (n = e[w], this[w] = n ? n(u) : u[w]);
      return this.isDefaultPrevented = (u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1) ? Ci : ah, this.isPropagationStopped = ah, this;
    }
    return g(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Ci);
      },
      stopPropagation: function() {
        var n = this.nativeEvent;
        n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Ci);
      },
      persist: function() {
      },
      isPersistent: Ci
    }), t;
  }
  var qa = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, Ei = Gt(qa), _l = g({}, qa, { view: 0, detail: 0 }), ug = Gt(_l), Ho, Lo, bl, Ti = g({}, _l, {
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
    getModifierState: Uo,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== bl && (bl && e.type === "mousemove" ? (Ho = e.screenX - bl.screenX, Lo = e.screenY - bl.screenY) : Lo = Ho = 0, bl = e), Ho);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : Lo;
    }
  }), sh = Gt(Ti), dg = g({}, Ti, { dataTransfer: 0 }), hg = Gt(dg), fg = g({}, _l, { relatedTarget: 0 }), $o = Gt(fg), mg = g({}, qa, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), pg = Gt(mg), _g = g({}, qa, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), bg = Gt(_g), gg = g({}, qa, { data: 0 }), lh = Gt(gg), vg = {
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
  }, xg = {
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
  }, yg = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function wg(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = yg[e]) ? !!t[e] : !1;
  }
  function Uo() {
    return wg;
  }
  var jg = g({}, _l, {
    key: function(e) {
      if (e.key) {
        var t = vg[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = Ni(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? xg[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Uo,
    charCode: function(e) {
      return e.type === "keypress" ? Ni(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? Ni(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), Sg = Gt(jg), kg = g({}, Ti, {
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
  }), ih = Gt(kg), Ng = g({}, _l, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Uo
  }), Cg = Gt(Ng), Eg = g({}, qa, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Tg = Gt(Eg), Mg = g({}, Ti, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Rg = Gt(Mg), Ag = g({}, qa, {
    newState: 0,
    oldState: 0
  }), zg = Gt(Ag), Dg = [9, 13, 27, 32], Bo = Ln && "CompositionEvent" in window, gl = null;
  Ln && "documentMode" in document && (gl = document.documentMode);
  var Og = Ln && "TextEvent" in window && !gl, rh = Ln && (!Bo || gl && 8 < gl && 11 >= gl), oh = " ", ch = !1;
  function uh(e, t) {
    switch (e) {
      case "keyup":
        return Dg.indexOf(t.keyCode) !== -1;
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
  function dh(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Ss = !1;
  function Hg(e, t) {
    switch (e) {
      case "compositionend":
        return dh(t);
      case "keypress":
        return t.which !== 32 ? null : (ch = !0, oh);
      case "textInput":
        return e = t.data, e === oh && ch ? null : e;
      default:
        return null;
    }
  }
  function Lg(e, t) {
    if (Ss)
      return e === "compositionend" || !Bo && uh(e, t) ? (e = nh(), ki = Oo = ia = null, Ss = !1, e) : null;
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
        return rh && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var $g = {
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
  function hh(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!$g[e.type] : t === "textarea";
  }
  function fh(e, t, n, l) {
    ws ? js ? js.push(l) : js = [l] : ws = l, t = gr(t, "onChange"), 0 < t.length && (n = new Ei(
      "onChange",
      "change",
      null,
      n,
      l
    ), e.push({ event: n, listeners: t }));
  }
  var vl = null, xl = null;
  function Ug(e) {
    Jm(e, 0);
  }
  function Mi(e) {
    var t = fl(e);
    if (Zd(t)) return e;
  }
  function mh(e, t) {
    if (e === "change") return t;
  }
  var ph = !1;
  if (Ln) {
    var Fo;
    if (Ln) {
      var Go = "oninput" in document;
      if (!Go) {
        var _h = document.createElement("div");
        _h.setAttribute("oninput", "return;"), Go = typeof _h.oninput == "function";
      }
      Fo = Go;
    } else Fo = !1;
    ph = Fo && (!document.documentMode || 9 < document.documentMode);
  }
  function bh() {
    vl && (vl.detachEvent("onpropertychange", gh), xl = vl = null);
  }
  function gh(e) {
    if (e.propertyName === "value" && Mi(xl)) {
      var t = [];
      fh(
        t,
        xl,
        e,
        Ao(e)
      ), th(Ug, t);
    }
  }
  function Bg(e, t, n) {
    e === "focusin" ? (bh(), vl = t, xl = n, vl.attachEvent("onpropertychange", gh)) : e === "focusout" && bh();
  }
  function Fg(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return Mi(xl);
  }
  function Gg(e, t) {
    if (e === "click") return Mi(t);
  }
  function Vg(e, t) {
    if (e === "input" || e === "change")
      return Mi(t);
  }
  function qg(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var Pt = typeof Object.is == "function" ? Object.is : qg;
  function yl(e, t) {
    if (Pt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var n = Object.keys(e), l = Object.keys(t);
    if (n.length !== l.length) return !1;
    for (l = 0; l < n.length; l++) {
      var c = n[l];
      if (!De.call(t, c) || !Pt(e[c], t[c]))
        return !1;
    }
    return !0;
  }
  function vh(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function xh(e, t) {
    var n = vh(e);
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
      n = vh(n);
    }
  }
  function yh(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? yh(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function wh(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = ji(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = ji(e.document);
    }
    return t;
  }
  function Vo(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var Yg = Ln && "documentMode" in document && 11 >= document.documentMode, ks = null, qo = null, wl = null, Yo = !1;
  function jh(e, t, n) {
    var l = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    Yo || ks == null || ks !== ji(l) || (l = ks, "selectionStart" in l && Vo(l) ? l = { start: l.selectionStart, end: l.selectionEnd } : (l = (l.ownerDocument && l.ownerDocument.defaultView || window).getSelection(), l = {
      anchorNode: l.anchorNode,
      anchorOffset: l.anchorOffset,
      focusNode: l.focusNode,
      focusOffset: l.focusOffset
    }), wl && yl(wl, l) || (wl = l, l = gr(qo, "onSelect"), 0 < l.length && (t = new Ei(
      "onSelect",
      "select",
      null,
      t,
      n
    ), e.push({ event: t, listeners: l }), t.target = ks)));
  }
  function Ya(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var Ns = {
    animationend: Ya("Animation", "AnimationEnd"),
    animationiteration: Ya("Animation", "AnimationIteration"),
    animationstart: Ya("Animation", "AnimationStart"),
    transitionrun: Ya("Transition", "TransitionRun"),
    transitionstart: Ya("Transition", "TransitionStart"),
    transitioncancel: Ya("Transition", "TransitionCancel"),
    transitionend: Ya("Transition", "TransitionEnd")
  }, Xo = {}, Sh = {};
  Ln && (Sh = document.createElement("div").style, "AnimationEvent" in window || (delete Ns.animationend.animation, delete Ns.animationiteration.animation, delete Ns.animationstart.animation), "TransitionEvent" in window || delete Ns.transitionend.transition);
  function Xa(e) {
    if (Xo[e]) return Xo[e];
    if (!Ns[e]) return e;
    var t = Ns[e], n;
    for (n in t)
      if (t.hasOwnProperty(n) && n in Sh)
        return Xo[e] = t[n];
    return e;
  }
  var kh = Xa("animationend"), Nh = Xa("animationiteration"), Ch = Xa("animationstart"), Xg = Xa("transitionrun"), Qg = Xa("transitionstart"), Zg = Xa("transitioncancel"), Eh = Xa("transitionend"), Th = /* @__PURE__ */ new Map(), Qo = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Qo.push("scrollEnd");
  function xn(e, t) {
    Th.set(e, t), Va(t, [e]);
  }
  var Ri = typeof reportError == "function" ? reportError : function(e) {
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
  }, un = [], Cs = 0, Zo = 0;
  function Ai() {
    for (var e = Cs, t = Zo = Cs = 0; t < e; ) {
      var n = un[t];
      un[t++] = null;
      var l = un[t];
      un[t++] = null;
      var c = un[t];
      un[t++] = null;
      var u = un[t];
      if (un[t++] = null, l !== null && c !== null) {
        var _ = l.pending;
        _ === null ? c.next = c : (c.next = _.next, _.next = c), l.pending = c;
      }
      u !== 0 && Mh(n, c, u);
    }
  }
  function zi(e, t, n, l) {
    un[Cs++] = e, un[Cs++] = t, un[Cs++] = n, un[Cs++] = l, Zo |= l, e.lanes |= l, e = e.alternate, e !== null && (e.lanes |= l);
  }
  function Ko(e, t, n, l) {
    return zi(e, t, n, l), Di(e);
  }
  function Qa(e, t) {
    return zi(e, null, null, t), Di(e);
  }
  function Mh(e, t, n) {
    e.lanes |= n;
    var l = e.alternate;
    l !== null && (l.lanes |= n);
    for (var c = !1, u = e.return; u !== null; )
      u.childLanes |= n, l = u.alternate, l !== null && (l.childLanes |= n), u.tag === 22 && (e = u.stateNode, e === null || e._visibility & 1 || (c = !0)), e = u, u = u.return;
    return e.tag === 3 ? (u = e.stateNode, c && t !== null && (c = 31 - Et(n), e = u.hiddenUpdates, l = e[c], l === null ? e[c] = [t] : l.push(t), t.lane = n | 536870912), u) : null;
  }
  function Di(e) {
    if (50 < ql)
      throw ql = 0, su = null, Error(o(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var Es = {};
  function Kg(e, t, n, l) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = l, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Wt(e, t, n, l) {
    return new Kg(e, t, n, l);
  }
  function Jo(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function $n(e, t) {
    var n = e.alternate;
    return n === null ? (n = Wt(
      e.tag,
      t,
      e.key,
      e.mode
    ), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 65011712, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
  }
  function Rh(e, t) {
    e.flags &= 65011714;
    var n = e.alternate;
    return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function Oi(e, t, n, l, c, u) {
    var _ = 0;
    if (l = e, typeof e == "function") Jo(e) && (_ = 1);
    else if (typeof e == "string")
      _ = ex(
        e,
        n,
        ne.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case le:
          return e = Wt(31, n, t, c), e.elementType = le, e.lanes = u, e;
        case T:
          return Za(n.children, c, u, t);
        case C:
          _ = 8, c |= 24;
          break;
        case M:
          return e = Wt(12, n, t, c | 2), e.elementType = M, e.lanes = u, e;
        case K:
          return e = Wt(13, n, t, c), e.elementType = K, e.lanes = u, e;
        case L:
          return e = Wt(19, n, t, c), e.elementType = L, e.lanes = u, e;
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case F:
                _ = 10;
                break e;
              case E:
                _ = 9;
                break e;
              case P:
                _ = 11;
                break e;
              case G:
                _ = 14;
                break e;
              case ee:
                _ = 16, l = null;
                break e;
            }
          _ = 29, n = Error(
            o(130, e === null ? "null" : typeof e, "")
          ), l = null;
      }
    return t = Wt(_, n, t, c), t.elementType = e, t.type = l, t.lanes = u, t;
  }
  function Za(e, t, n, l) {
    return e = Wt(7, e, l, t), e.lanes = n, e;
  }
  function Po(e, t, n) {
    return e = Wt(6, e, null, t), e.lanes = n, e;
  }
  function Ah(e) {
    var t = Wt(18, null, null, 0);
    return t.stateNode = e, t;
  }
  function Wo(e, t, n) {
    return t = Wt(
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
  var zh = /* @__PURE__ */ new WeakMap();
  function dn(e, t) {
    if (typeof e == "object" && e !== null) {
      var n = zh.get(e);
      return n !== void 0 ? n : (t = {
        value: e,
        source: t,
        stack: We(t)
      }, zh.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: We(t)
    };
  }
  var Ts = [], Ms = 0, Hi = null, jl = 0, hn = [], fn = 0, ra = null, Nn = 1, Cn = "";
  function Un(e, t) {
    Ts[Ms++] = jl, Ts[Ms++] = Hi, Hi = e, jl = t;
  }
  function Dh(e, t, n) {
    hn[fn++] = Nn, hn[fn++] = Cn, hn[fn++] = ra, ra = e;
    var l = Nn;
    e = Cn;
    var c = 32 - Et(l) - 1;
    l &= ~(1 << c), n += 1;
    var u = 32 - Et(t) + c;
    if (30 < u) {
      var _ = c - c % 5;
      u = (l & (1 << _) - 1).toString(32), l >>= _, c -= _, Nn = 1 << 32 - Et(t) + c | n << c | l, Cn = u + e;
    } else
      Nn = 1 << u | n << c | l, Cn = e;
  }
  function Io(e) {
    e.return !== null && (Un(e, 1), Dh(e, 1, 0));
  }
  function ec(e) {
    for (; e === Hi; )
      Hi = Ts[--Ms], Ts[Ms] = null, jl = Ts[--Ms], Ts[Ms] = null;
    for (; e === ra; )
      ra = hn[--fn], hn[fn] = null, Cn = hn[--fn], hn[fn] = null, Nn = hn[--fn], hn[fn] = null;
  }
  function Oh(e, t) {
    hn[fn++] = Nn, hn[fn++] = Cn, hn[fn++] = ra, Nn = t.id, Cn = t.overflow, ra = e;
  }
  var wt = null, Ie = null, Ae = !1, oa = null, mn = !1, tc = Error(o(519));
  function ca(e) {
    var t = Error(
      o(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw Sl(dn(t, e)), tc;
  }
  function Hh(e) {
    var t = e.stateNode, n = e.type, l = e.memoizedProps;
    switch (t[yt] = e, t[Ft] = l, n) {
      case "dialog":
        Ee("cancel", t), Ee("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        Ee("load", t);
        break;
      case "video":
      case "audio":
        for (n = 0; n < Xl.length; n++)
          Ee(Xl[n], t);
        break;
      case "source":
        Ee("error", t);
        break;
      case "img":
      case "image":
      case "link":
        Ee("error", t), Ee("load", t);
        break;
      case "details":
        Ee("toggle", t);
        break;
      case "input":
        Ee("invalid", t), Kd(
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
        Ee("invalid", t);
        break;
      case "textarea":
        Ee("invalid", t), Pd(t, l.value, l.defaultValue, l.children);
    }
    n = l.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || l.suppressHydrationWarning === !0 || ep(t.textContent, n) ? (l.popover != null && (Ee("beforetoggle", t), Ee("toggle", t)), l.onScroll != null && Ee("scroll", t), l.onScrollEnd != null && Ee("scrollend", t), l.onClick != null && (t.onclick = Hn), t = !0) : t = !1, t || ca(e, !0);
  }
  function Lh(e) {
    for (wt = e.return; wt; )
      switch (wt.tag) {
        case 5:
        case 31:
        case 13:
          mn = !1;
          return;
        case 27:
        case 3:
          mn = !0;
          return;
        default:
          wt = wt.return;
      }
  }
  function Rs(e) {
    if (e !== wt) return !1;
    if (!Ae) return Lh(e), Ae = !0, !1;
    var t = e.tag, n;
    if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = !(n !== "form" && n !== "button") || vu(e.type, e.memoizedProps)), n = !n), n && Ie && ca(e), Lh(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
      Ie = cp(e);
    } else if (t === 31) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
      Ie = cp(e);
    } else
      t === 27 ? (t = Ie, ja(e.type) ? (e = Su, Su = null, Ie = e) : Ie = t) : Ie = wt ? _n(e.stateNode.nextSibling) : null;
    return !0;
  }
  function Ka() {
    Ie = wt = null, Ae = !1;
  }
  function nc() {
    var e = oa;
    return e !== null && (Xt === null ? Xt = e : Xt.push.apply(
      Xt,
      e
    ), oa = null), e;
  }
  function Sl(e) {
    oa === null ? oa = [e] : oa.push(e);
  }
  var ac = N(null), Ja = null, Bn = null;
  function ua(e, t, n) {
    Q(ac, t._currentValue), t._currentValue = n;
  }
  function Fn(e) {
    e._currentValue = ac.current, H(ac);
  }
  function sc(e, t, n) {
    for (; e !== null; ) {
      var l = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, l !== null && (l.childLanes |= t)) : l !== null && (l.childLanes & t) !== t && (l.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function lc(e, t, n, l) {
    var c = e.child;
    for (c !== null && (c.return = e); c !== null; ) {
      var u = c.dependencies;
      if (u !== null) {
        var _ = c.child;
        u = u.firstContext;
        e: for (; u !== null; ) {
          var w = u;
          u = c;
          for (var R = 0; R < t.length; R++)
            if (w.context === t[R]) {
              u.lanes |= n, w = u.alternate, w !== null && (w.lanes |= n), sc(
                u.return,
                n,
                e
              ), l || (_ = null);
              break e;
            }
          u = w.next;
        }
      } else if (c.tag === 18) {
        if (_ = c.return, _ === null) throw Error(o(341));
        _.lanes |= n, u = _.alternate, u !== null && (u.lanes |= n), sc(_, n, e), _ = null;
      } else _ = c.child;
      if (_ !== null) _.return = c;
      else
        for (_ = c; _ !== null; ) {
          if (_ === e) {
            _ = null;
            break;
          }
          if (c = _.sibling, c !== null) {
            c.return = _.return, _ = c;
            break;
          }
          _ = _.return;
        }
      c = _;
    }
  }
  function As(e, t, n, l) {
    e = null;
    for (var c = t, u = !1; c !== null; ) {
      if (!u) {
        if ((c.flags & 524288) !== 0) u = !0;
        else if ((c.flags & 262144) !== 0) break;
      }
      if (c.tag === 10) {
        var _ = c.alternate;
        if (_ === null) throw Error(o(387));
        if (_ = _.memoizedProps, _ !== null) {
          var w = c.type;
          Pt(c.pendingProps.value, _.value) || (e !== null ? e.push(w) : e = [w]);
        }
      } else if (c === ve.current) {
        if (_ = c.alternate, _ === null) throw Error(o(387));
        _.memoizedState.memoizedState !== c.memoizedState.memoizedState && (e !== null ? e.push(Pl) : e = [Pl]);
      }
      c = c.return;
    }
    e !== null && lc(
      t,
      e,
      n,
      l
    ), t.flags |= 262144;
  }
  function Li(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!Pt(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function Pa(e) {
    Ja = e, Bn = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function jt(e) {
    return $h(Ja, e);
  }
  function $i(e, t) {
    return Ja === null && Pa(e), $h(e, t);
  }
  function $h(e, t) {
    var n = t._currentValue;
    if (t = { context: t, memoizedValue: n, next: null }, Bn === null) {
      if (e === null) throw Error(o(308));
      Bn = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else Bn = Bn.next = t;
    return n;
  }
  var Jg = typeof AbortController < "u" ? AbortController : function() {
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
  }, Pg = a.unstable_scheduleCallback, Wg = a.unstable_NormalPriority, ct = {
    $$typeof: F,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function ic() {
    return {
      controller: new Jg(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function kl(e) {
    e.refCount--, e.refCount === 0 && Pg(Wg, function() {
      e.controller.abort();
    });
  }
  var Nl = null, rc = 0, zs = 0, Ds = null;
  function Ig(e, t) {
    if (Nl === null) {
      var n = Nl = [];
      rc = 0, zs = uu(), Ds = {
        status: "pending",
        value: void 0,
        then: function(l) {
          n.push(l);
        }
      };
    }
    return rc++, t.then(Uh, Uh), t;
  }
  function Uh() {
    if (--rc === 0 && Nl !== null) {
      Ds !== null && (Ds.status = "fulfilled");
      var e = Nl;
      Nl = null, zs = 0, Ds = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function ev(e, t) {
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
  var Bh = S.S;
  S.S = function(e, t) {
    Sm = it(), typeof t == "object" && t !== null && typeof t.then == "function" && Ig(e, t), Bh !== null && Bh(e, t);
  };
  var Wa = N(null);
  function oc() {
    var e = Wa.current;
    return e !== null ? e : Ze.pooledCache;
  }
  function Ui(e, t) {
    t === null ? Q(Wa, Wa.current) : Q(Wa, t.pool);
  }
  function Fh() {
    var e = oc();
    return e === null ? null : { parent: ct._currentValue, pool: e };
  }
  var Os = Error(o(460)), cc = Error(o(474)), Bi = Error(o(542)), Fi = { then: function() {
  } };
  function Gh(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function Vh(e, t, n) {
    switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(Hn, Hn), t = n), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, Yh(e), e;
      default:
        if (typeof t.status == "string") t.then(Hn, Hn);
        else {
          if (e = Ze, e !== null && 100 < e.shellSuspendCounter)
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
            throw e = t.reason, Yh(e), e;
        }
        throw es = t, Os;
    }
  }
  function Ia(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (n) {
      throw n !== null && typeof n == "object" && typeof n.then == "function" ? (es = n, Os) : n;
    }
  }
  var es = null;
  function qh() {
    if (es === null) throw Error(o(459));
    var e = es;
    return es = null, e;
  }
  function Yh(e) {
    if (e === Os || e === Bi)
      throw Error(o(483));
  }
  var Hs = null, Cl = 0;
  function Gi(e) {
    var t = Cl;
    return Cl += 1, Hs === null && (Hs = []), Vh(Hs, e, t);
  }
  function El(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function Vi(e, t) {
    throw t.$$typeof === y ? Error(o(525)) : (e = Object.prototype.toString.call(t), Error(
      o(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function Xh(e) {
    function t(D, A) {
      if (e) {
        var $ = D.deletions;
        $ === null ? (D.deletions = [A], D.flags |= 16) : $.push(A);
      }
    }
    function n(D, A) {
      if (!e) return null;
      for (; A !== null; )
        t(D, A), A = A.sibling;
      return null;
    }
    function l(D) {
      for (var A = /* @__PURE__ */ new Map(); D !== null; )
        D.key !== null ? A.set(D.key, D) : A.set(D.index, D), D = D.sibling;
      return A;
    }
    function c(D, A) {
      return D = $n(D, A), D.index = 0, D.sibling = null, D;
    }
    function u(D, A, $) {
      return D.index = $, e ? ($ = D.alternate, $ !== null ? ($ = $.index, $ < A ? (D.flags |= 67108866, A) : $) : (D.flags |= 67108866, A)) : (D.flags |= 1048576, A);
    }
    function _(D) {
      return e && D.alternate === null && (D.flags |= 67108866), D;
    }
    function w(D, A, $, J) {
      return A === null || A.tag !== 6 ? (A = Po($, D.mode, J), A.return = D, A) : (A = c(A, $), A.return = D, A);
    }
    function R(D, A, $, J) {
      var be = $.type;
      return be === T ? X(
        D,
        A,
        $.props.children,
        J,
        $.key
      ) : A !== null && (A.elementType === be || typeof be == "object" && be !== null && be.$$typeof === ee && Ia(be) === A.type) ? (A = c(A, $.props), El(A, $), A.return = D, A) : (A = Oi(
        $.type,
        $.key,
        $.props,
        null,
        D.mode,
        J
      ), El(A, $), A.return = D, A);
    }
    function U(D, A, $, J) {
      return A === null || A.tag !== 4 || A.stateNode.containerInfo !== $.containerInfo || A.stateNode.implementation !== $.implementation ? (A = Wo($, D.mode, J), A.return = D, A) : (A = c(A, $.children || []), A.return = D, A);
    }
    function X(D, A, $, J, be) {
      return A === null || A.tag !== 7 ? (A = Za(
        $,
        D.mode,
        J,
        be
      ), A.return = D, A) : (A = c(A, $), A.return = D, A);
    }
    function W(D, A, $) {
      if (typeof A == "string" && A !== "" || typeof A == "number" || typeof A == "bigint")
        return A = Po(
          "" + A,
          D.mode,
          $
        ), A.return = D, A;
      if (typeof A == "object" && A !== null) {
        switch (A.$$typeof) {
          case j:
            return $ = Oi(
              A.type,
              A.key,
              A.props,
              null,
              D.mode,
              $
            ), El($, A), $.return = D, $;
          case k:
            return A = Wo(
              A,
              D.mode,
              $
            ), A.return = D, A;
          case ee:
            return A = Ia(A), W(D, A, $);
        }
        if (oe(A) || ie(A))
          return A = Za(
            A,
            D.mode,
            $,
            null
          ), A.return = D, A;
        if (typeof A.then == "function")
          return W(D, Gi(A), $);
        if (A.$$typeof === F)
          return W(
            D,
            $i(D, A),
            $
          );
        Vi(D, A);
      }
      return null;
    }
    function B(D, A, $, J) {
      var be = A !== null ? A.key : null;
      if (typeof $ == "string" && $ !== "" || typeof $ == "number" || typeof $ == "bigint")
        return be !== null ? null : w(D, A, "" + $, J);
      if (typeof $ == "object" && $ !== null) {
        switch ($.$$typeof) {
          case j:
            return $.key === be ? R(D, A, $, J) : null;
          case k:
            return $.key === be ? U(D, A, $, J) : null;
          case ee:
            return $ = Ia($), B(D, A, $, J);
        }
        if (oe($) || ie($))
          return be !== null ? null : X(D, A, $, J, null);
        if (typeof $.then == "function")
          return B(
            D,
            A,
            Gi($),
            J
          );
        if ($.$$typeof === F)
          return B(
            D,
            A,
            $i(D, $),
            J
          );
        Vi(D, $);
      }
      return null;
    }
    function V(D, A, $, J, be) {
      if (typeof J == "string" && J !== "" || typeof J == "number" || typeof J == "bigint")
        return D = D.get($) || null, w(A, D, "" + J, be);
      if (typeof J == "object" && J !== null) {
        switch (J.$$typeof) {
          case j:
            return D = D.get(
              J.key === null ? $ : J.key
            ) || null, R(A, D, J, be);
          case k:
            return D = D.get(
              J.key === null ? $ : J.key
            ) || null, U(A, D, J, be);
          case ee:
            return J = Ia(J), V(
              D,
              A,
              $,
              J,
              be
            );
        }
        if (oe(J) || ie(J))
          return D = D.get($) || null, X(A, D, J, be, null);
        if (typeof J.then == "function")
          return V(
            D,
            A,
            $,
            Gi(J),
            be
          );
        if (J.$$typeof === F)
          return V(
            D,
            A,
            $,
            $i(A, J),
            be
          );
        Vi(A, J);
      }
      return null;
    }
    function he(D, A, $, J) {
      for (var be = null, He = null, me = A, Ne = A = 0, Re = null; me !== null && Ne < $.length; Ne++) {
        me.index > Ne ? (Re = me, me = null) : Re = me.sibling;
        var Le = B(
          D,
          me,
          $[Ne],
          J
        );
        if (Le === null) {
          me === null && (me = Re);
          break;
        }
        e && me && Le.alternate === null && t(D, me), A = u(Le, A, Ne), He === null ? be = Le : He.sibling = Le, He = Le, me = Re;
      }
      if (Ne === $.length)
        return n(D, me), Ae && Un(D, Ne), be;
      if (me === null) {
        for (; Ne < $.length; Ne++)
          me = W(D, $[Ne], J), me !== null && (A = u(
            me,
            A,
            Ne
          ), He === null ? be = me : He.sibling = me, He = me);
        return Ae && Un(D, Ne), be;
      }
      for (me = l(me); Ne < $.length; Ne++)
        Re = V(
          me,
          D,
          Ne,
          $[Ne],
          J
        ), Re !== null && (e && Re.alternate !== null && me.delete(
          Re.key === null ? Ne : Re.key
        ), A = u(
          Re,
          A,
          Ne
        ), He === null ? be = Re : He.sibling = Re, He = Re);
      return e && me.forEach(function(Ea) {
        return t(D, Ea);
      }), Ae && Un(D, Ne), be;
    }
    function ye(D, A, $, J) {
      if ($ == null) throw Error(o(151));
      for (var be = null, He = null, me = A, Ne = A = 0, Re = null, Le = $.next(); me !== null && !Le.done; Ne++, Le = $.next()) {
        me.index > Ne ? (Re = me, me = null) : Re = me.sibling;
        var Ea = B(D, me, Le.value, J);
        if (Ea === null) {
          me === null && (me = Re);
          break;
        }
        e && me && Ea.alternate === null && t(D, me), A = u(Ea, A, Ne), He === null ? be = Ea : He.sibling = Ea, He = Ea, me = Re;
      }
      if (Le.done)
        return n(D, me), Ae && Un(D, Ne), be;
      if (me === null) {
        for (; !Le.done; Ne++, Le = $.next())
          Le = W(D, Le.value, J), Le !== null && (A = u(Le, A, Ne), He === null ? be = Le : He.sibling = Le, He = Le);
        return Ae && Un(D, Ne), be;
      }
      for (me = l(me); !Le.done; Ne++, Le = $.next())
        Le = V(me, D, Ne, Le.value, J), Le !== null && (e && Le.alternate !== null && me.delete(Le.key === null ? Ne : Le.key), A = u(Le, A, Ne), He === null ? be = Le : He.sibling = Le, He = Le);
      return e && me.forEach(function(dx) {
        return t(D, dx);
      }), Ae && Un(D, Ne), be;
    }
    function Xe(D, A, $, J) {
      if (typeof $ == "object" && $ !== null && $.type === T && $.key === null && ($ = $.props.children), typeof $ == "object" && $ !== null) {
        switch ($.$$typeof) {
          case j:
            e: {
              for (var be = $.key; A !== null; ) {
                if (A.key === be) {
                  if (be = $.type, be === T) {
                    if (A.tag === 7) {
                      n(
                        D,
                        A.sibling
                      ), J = c(
                        A,
                        $.props.children
                      ), J.return = D, D = J;
                      break e;
                    }
                  } else if (A.elementType === be || typeof be == "object" && be !== null && be.$$typeof === ee && Ia(be) === A.type) {
                    n(
                      D,
                      A.sibling
                    ), J = c(A, $.props), El(J, $), J.return = D, D = J;
                    break e;
                  }
                  n(D, A);
                  break;
                } else t(D, A);
                A = A.sibling;
              }
              $.type === T ? (J = Za(
                $.props.children,
                D.mode,
                J,
                $.key
              ), J.return = D, D = J) : (J = Oi(
                $.type,
                $.key,
                $.props,
                null,
                D.mode,
                J
              ), El(J, $), J.return = D, D = J);
            }
            return _(D);
          case k:
            e: {
              for (be = $.key; A !== null; ) {
                if (A.key === be)
                  if (A.tag === 4 && A.stateNode.containerInfo === $.containerInfo && A.stateNode.implementation === $.implementation) {
                    n(
                      D,
                      A.sibling
                    ), J = c(A, $.children || []), J.return = D, D = J;
                    break e;
                  } else {
                    n(D, A);
                    break;
                  }
                else t(D, A);
                A = A.sibling;
              }
              J = Wo($, D.mode, J), J.return = D, D = J;
            }
            return _(D);
          case ee:
            return $ = Ia($), Xe(
              D,
              A,
              $,
              J
            );
        }
        if (oe($))
          return he(
            D,
            A,
            $,
            J
          );
        if (ie($)) {
          if (be = ie($), typeof be != "function") throw Error(o(150));
          return $ = be.call($), ye(
            D,
            A,
            $,
            J
          );
        }
        if (typeof $.then == "function")
          return Xe(
            D,
            A,
            Gi($),
            J
          );
        if ($.$$typeof === F)
          return Xe(
            D,
            A,
            $i(D, $),
            J
          );
        Vi(D, $);
      }
      return typeof $ == "string" && $ !== "" || typeof $ == "number" || typeof $ == "bigint" ? ($ = "" + $, A !== null && A.tag === 6 ? (n(D, A.sibling), J = c(A, $), J.return = D, D = J) : (n(D, A), J = Po($, D.mode, J), J.return = D, D = J), _(D)) : n(D, A);
    }
    return function(D, A, $, J) {
      try {
        Cl = 0;
        var be = Xe(
          D,
          A,
          $,
          J
        );
        return Hs = null, be;
      } catch (me) {
        if (me === Os || me === Bi) throw me;
        var He = Wt(29, me, null, D.mode);
        return He.lanes = J, He.return = D, He;
      } finally {
      }
    };
  }
  var ts = Xh(!0), Qh = Xh(!1), da = !1;
  function uc(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function dc(e, t) {
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
    if (l = l.shared, (Ue & 2) !== 0) {
      var c = l.pending;
      return c === null ? t.next = t : (t.next = c.next, c.next = t), l.pending = t, t = Di(e), Mh(e, null, n), t;
    }
    return zi(e, l, t, n), Di(e);
  }
  function Tl(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194048) !== 0)) {
      var l = t.lanes;
      l &= e.pendingLanes, n |= l, t.lanes = n, $d(e, n);
    }
  }
  function hc(e, t) {
    var n = e.updateQueue, l = e.alternate;
    if (l !== null && (l = l.updateQueue, n === l)) {
      var c = null, u = null;
      if (n = n.firstBaseUpdate, n !== null) {
        do {
          var _ = {
            lane: n.lane,
            tag: n.tag,
            payload: n.payload,
            callback: null,
            next: null
          };
          u === null ? c = u = _ : u = u.next = _, n = n.next;
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
  var fc = !1;
  function Ml() {
    if (fc) {
      var e = Ds;
      if (e !== null) throw e;
    }
  }
  function Rl(e, t, n, l) {
    fc = !1;
    var c = e.updateQueue;
    da = !1;
    var u = c.firstBaseUpdate, _ = c.lastBaseUpdate, w = c.shared.pending;
    if (w !== null) {
      c.shared.pending = null;
      var R = w, U = R.next;
      R.next = null, _ === null ? u = U : _.next = U, _ = R;
      var X = e.alternate;
      X !== null && (X = X.updateQueue, w = X.lastBaseUpdate, w !== _ && (w === null ? X.firstBaseUpdate = U : w.next = U, X.lastBaseUpdate = R));
    }
    if (u !== null) {
      var W = c.baseState;
      _ = 0, X = U = R = null, w = u;
      do {
        var B = w.lane & -536870913, V = B !== w.lane;
        if (V ? (Me & B) === B : (l & B) === B) {
          B !== 0 && B === zs && (fc = !0), X !== null && (X = X.next = {
            lane: 0,
            tag: w.tag,
            payload: w.payload,
            callback: null,
            next: null
          });
          e: {
            var he = e, ye = w;
            B = t;
            var Xe = n;
            switch (ye.tag) {
              case 1:
                if (he = ye.payload, typeof he == "function") {
                  W = he.call(Xe, W, B);
                  break e;
                }
                W = he;
                break e;
              case 3:
                he.flags = he.flags & -65537 | 128;
              case 0:
                if (he = ye.payload, B = typeof he == "function" ? he.call(Xe, W, B) : he, B == null) break e;
                W = g({}, W, B);
                break e;
              case 2:
                da = !0;
            }
          }
          B = w.callback, B !== null && (e.flags |= 64, V && (e.flags |= 8192), V = c.callbacks, V === null ? c.callbacks = [B] : V.push(B));
        } else
          V = {
            lane: B,
            tag: w.tag,
            payload: w.payload,
            callback: w.callback,
            next: null
          }, X === null ? (U = X = V, R = W) : X = X.next = V, _ |= B;
        if (w = w.next, w === null) {
          if (w = c.shared.pending, w === null)
            break;
          V = w, w = V.next, V.next = null, c.lastBaseUpdate = V, c.shared.pending = null;
        }
      } while (!0);
      X === null && (R = W), c.baseState = R, c.firstBaseUpdate = U, c.lastBaseUpdate = X, u === null && (c.shared.lanes = 0), ga |= _, e.lanes = _, e.memoizedState = W;
    }
  }
  function Zh(e, t) {
    if (typeof e != "function")
      throw Error(o(191, e));
    e.call(t);
  }
  function Kh(e, t) {
    var n = e.callbacks;
    if (n !== null)
      for (e.callbacks = null, e = 0; e < n.length; e++)
        Zh(n[e], t);
  }
  var Ls = N(null), qi = N(0);
  function Jh(e, t) {
    e = Jn, Q(qi, e), Q(Ls, t), Jn = e | t.baseLanes;
  }
  function mc() {
    Q(qi, Jn), Q(Ls, Ls.current);
  }
  function pc() {
    Jn = qi.current, H(Ls), H(qi);
  }
  var It = N(null), pn = null;
  function ma(e) {
    var t = e.alternate;
    Q(rt, rt.current & 1), Q(It, e), pn === null && (t === null || Ls.current !== null || t.memoizedState !== null) && (pn = e);
  }
  function _c(e) {
    Q(rt, rt.current), Q(It, e), pn === null && (pn = e);
  }
  function Ph(e) {
    e.tag === 22 ? (Q(rt, rt.current), Q(It, e), pn === null && (pn = e)) : pa();
  }
  function pa() {
    Q(rt, rt.current), Q(It, It.current);
  }
  function en(e) {
    H(It), pn === e && (pn = null), H(rt);
  }
  var rt = N(0);
  function Yi(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var n = t.memoizedState;
        if (n !== null && (n = n.dehydrated, n === null || wu(n) || ju(n)))
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
  var Gn = 0, Se = null, qe = null, ut = null, Xi = !1, $s = !1, ns = !1, Qi = 0, Al = 0, Us = null, tv = 0;
  function st() {
    throw Error(o(321));
  }
  function bc(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++)
      if (!Pt(e[n], t[n])) return !1;
    return !0;
  }
  function gc(e, t, n, l, c, u) {
    return Gn = u, Se = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, S.H = e === null || e.memoizedState === null ? Of : zc, ns = !1, u = n(l, c), ns = !1, $s && (u = Ih(
      t,
      n,
      l,
      c
    )), Wh(e), u;
  }
  function Wh(e) {
    S.H = Ol;
    var t = qe !== null && qe.next !== null;
    if (Gn = 0, ut = qe = Se = null, Xi = !1, Al = 0, Us = null, t) throw Error(o(300));
    e === null || dt || (e = e.dependencies, e !== null && Li(e) && (dt = !0));
  }
  function Ih(e, t, n, l) {
    Se = e;
    var c = 0;
    do {
      if ($s && (Us = null), Al = 0, $s = !1, 25 <= c) throw Error(o(301));
      if (c += 1, ut = qe = null, e.updateQueue != null) {
        var u = e.updateQueue;
        u.lastEffect = null, u.events = null, u.stores = null, u.memoCache != null && (u.memoCache.index = 0);
      }
      S.H = Hf, u = t(n, l);
    } while ($s);
    return u;
  }
  function nv() {
    var e = S.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? zl(t) : t, e = e.useState()[0], (qe !== null ? qe.memoizedState : null) !== e && (Se.flags |= 1024), t;
  }
  function vc() {
    var e = Qi !== 0;
    return Qi = 0, e;
  }
  function xc(e, t, n) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
  }
  function yc(e) {
    if (Xi) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      Xi = !1;
    }
    Gn = 0, ut = qe = Se = null, $s = !1, Al = Qi = 0, Us = null;
  }
  function Ot() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return ut === null ? Se.memoizedState = ut = e : ut = ut.next = e, ut;
  }
  function ot() {
    if (qe === null) {
      var e = Se.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = qe.next;
    var t = ut === null ? Se.memoizedState : ut.next;
    if (t !== null)
      ut = t, qe = e;
    else {
      if (e === null)
        throw Se.alternate === null ? Error(o(467)) : Error(o(310));
      qe = e, e = {
        memoizedState: qe.memoizedState,
        baseState: qe.baseState,
        baseQueue: qe.baseQueue,
        queue: qe.queue,
        next: null
      }, ut === null ? Se.memoizedState = ut = e : ut = ut.next = e;
    }
    return ut;
  }
  function Zi() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function zl(e) {
    var t = Al;
    return Al += 1, Us === null && (Us = []), e = Vh(Us, e, t), t = Se, (ut === null ? t.memoizedState : ut.next) === null && (t = t.alternate, S.H = t === null || t.memoizedState === null ? Of : zc), e;
  }
  function Ki(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return zl(e);
      if (e.$$typeof === F) return jt(e);
    }
    throw Error(o(438, String(e)));
  }
  function wc(e) {
    var t = null, n = Se.updateQueue;
    if (n !== null && (t = n.memoCache), t == null) {
      var l = Se.alternate;
      l !== null && (l = l.updateQueue, l !== null && (l = l.memoCache, l != null && (t = {
        data: l.data.map(function(c) {
          return c.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), n === null && (n = Zi(), Se.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0)
      for (n = t.data[t.index] = Array(e), l = 0; l < e; l++)
        n[l] = te;
    return t.index++, n;
  }
  function Vn(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function Ji(e) {
    var t = ot();
    return jc(t, qe, e);
  }
  function jc(e, t, n) {
    var l = e.queue;
    if (l === null) throw Error(o(311));
    l.lastRenderedReducer = n;
    var c = e.baseQueue, u = l.pending;
    if (u !== null) {
      if (c !== null) {
        var _ = c.next;
        c.next = u.next, u.next = _;
      }
      t.baseQueue = c = u, l.pending = null;
    }
    if (u = e.baseState, c === null) e.memoizedState = u;
    else {
      t = c.next;
      var w = _ = null, R = null, U = t, X = !1;
      do {
        var W = U.lane & -536870913;
        if (W !== U.lane ? (Me & W) === W : (Gn & W) === W) {
          var B = U.revertLane;
          if (B === 0)
            R !== null && (R = R.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: U.action,
              hasEagerState: U.hasEagerState,
              eagerState: U.eagerState,
              next: null
            }), W === zs && (X = !0);
          else if ((Gn & B) === B) {
            U = U.next, B === zs && (X = !0);
            continue;
          } else
            W = {
              lane: 0,
              revertLane: U.revertLane,
              gesture: null,
              action: U.action,
              hasEagerState: U.hasEagerState,
              eagerState: U.eagerState,
              next: null
            }, R === null ? (w = R = W, _ = u) : R = R.next = W, Se.lanes |= B, ga |= B;
          W = U.action, ns && n(u, W), u = U.hasEagerState ? U.eagerState : n(u, W);
        } else
          B = {
            lane: W,
            revertLane: U.revertLane,
            gesture: U.gesture,
            action: U.action,
            hasEagerState: U.hasEagerState,
            eagerState: U.eagerState,
            next: null
          }, R === null ? (w = R = B, _ = u) : R = R.next = B, Se.lanes |= W, ga |= W;
        U = U.next;
      } while (U !== null && U !== t);
      if (R === null ? _ = u : R.next = w, !Pt(u, e.memoizedState) && (dt = !0, X && (n = Ds, n !== null)))
        throw n;
      e.memoizedState = u, e.baseState = _, e.baseQueue = R, l.lastRenderedState = u;
    }
    return c === null && (l.lanes = 0), [e.memoizedState, l.dispatch];
  }
  function Sc(e) {
    var t = ot(), n = t.queue;
    if (n === null) throw Error(o(311));
    n.lastRenderedReducer = e;
    var l = n.dispatch, c = n.pending, u = t.memoizedState;
    if (c !== null) {
      n.pending = null;
      var _ = c = c.next;
      do
        u = e(u, _.action), _ = _.next;
      while (_ !== c);
      Pt(u, t.memoizedState) || (dt = !0), t.memoizedState = u, t.baseQueue === null && (t.baseState = u), n.lastRenderedState = u;
    }
    return [u, l];
  }
  function ef(e, t, n) {
    var l = Se, c = ot(), u = Ae;
    if (u) {
      if (n === void 0) throw Error(o(407));
      n = n();
    } else n = t();
    var _ = !Pt(
      (qe || c).memoizedState,
      n
    );
    if (_ && (c.memoizedState = n, dt = !0), c = c.queue, Cc(af.bind(null, l, c, e), [
      e
    ]), c.getSnapshot !== t || _ || ut !== null && ut.memoizedState.tag & 1) {
      if (l.flags |= 2048, Bs(
        9,
        { destroy: void 0 },
        nf.bind(
          null,
          l,
          c,
          n,
          t
        ),
        null
      ), Ze === null) throw Error(o(349));
      u || (Gn & 127) !== 0 || tf(l, t, n);
    }
    return n;
  }
  function tf(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = Se.updateQueue, t === null ? (t = Zi(), Se.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function nf(e, t, n, l) {
    t.value = n, t.getSnapshot = l, sf(t) && lf(e);
  }
  function af(e, t, n) {
    return n(function() {
      sf(t) && lf(e);
    });
  }
  function sf(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !Pt(e, n);
    } catch {
      return !0;
    }
  }
  function lf(e) {
    var t = Qa(e, 2);
    t !== null && Qt(t, e, 2);
  }
  function kc(e) {
    var t = Ot();
    if (typeof e == "function") {
      var n = e;
      if (e = n(), ns) {
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
  function rf(e, t, n, l) {
    return e.baseState = n, jc(
      e,
      qe,
      typeof l == "function" ? l : Vn
    );
  }
  function av(e, t, n, l, c) {
    if (Ii(e)) throw Error(o(485));
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
        then: function(_) {
          u.listeners.push(_);
        }
      };
      S.T !== null ? n(!0) : u.isTransition = !1, l(u), n = t.pending, n === null ? (u.next = t.pending = u, of(t, u)) : (u.next = n.next, t.pending = n.next = u);
    }
  }
  function of(e, t) {
    var n = t.action, l = t.payload, c = e.state;
    if (t.isTransition) {
      var u = S.T, _ = {};
      S.T = _;
      try {
        var w = n(c, l), R = S.S;
        R !== null && R(_, w), cf(e, t, w);
      } catch (U) {
        Nc(e, t, U);
      } finally {
        u !== null && _.types !== null && (u.types = _.types), S.T = u;
      }
    } else
      try {
        u = n(c, l), cf(e, t, u);
      } catch (U) {
        Nc(e, t, U);
      }
  }
  function cf(e, t, n) {
    n !== null && typeof n == "object" && typeof n.then == "function" ? n.then(
      function(l) {
        uf(e, t, l);
      },
      function(l) {
        return Nc(e, t, l);
      }
    ) : uf(e, t, n);
  }
  function uf(e, t, n) {
    t.status = "fulfilled", t.value = n, df(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, of(e, n)));
  }
  function Nc(e, t, n) {
    var l = e.pending;
    if (e.pending = null, l !== null) {
      l = l.next;
      do
        t.status = "rejected", t.reason = n, df(t), t = t.next;
      while (t !== l);
    }
    e.action = null;
  }
  function df(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function hf(e, t) {
    return t;
  }
  function ff(e, t) {
    if (Ae) {
      var n = Ze.formState;
      if (n !== null) {
        e: {
          var l = Se;
          if (Ae) {
            if (Ie) {
              t: {
                for (var c = Ie, u = mn; c.nodeType !== 8; ) {
                  if (!u) {
                    c = null;
                    break t;
                  }
                  if (c = _n(
                    c.nextSibling
                  ), c === null) {
                    c = null;
                    break t;
                  }
                }
                u = c.data, c = u === "F!" || u === "F" ? c : null;
              }
              if (c) {
                Ie = _n(
                  c.nextSibling
                ), l = c.data === "F!";
                break e;
              }
            }
            ca(l);
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
      lastRenderedReducer: hf,
      lastRenderedState: t
    }, n.queue = l, n = Af.bind(
      null,
      Se,
      l
    ), l.dispatch = n, l = kc(!1), u = Ac.bind(
      null,
      Se,
      !1,
      l.queue
    ), l = Ot(), c = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, l.queue = c, n = av.bind(
      null,
      Se,
      c,
      u,
      n
    ), c.dispatch = n, l.memoizedState = e, [t, n, !1];
  }
  function mf(e) {
    var t = ot();
    return pf(t, qe, e);
  }
  function pf(e, t, n) {
    if (t = jc(
      e,
      t,
      hf
    )[0], e = Ji(Vn)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var l = zl(t);
      } catch (_) {
        throw _ === Os ? Bi : _;
      }
    else l = t;
    t = ot();
    var c = t.queue, u = c.dispatch;
    return n !== t.memoizedState && (Se.flags |= 2048, Bs(
      9,
      { destroy: void 0 },
      sv.bind(null, c, n),
      null
    )), [l, u, e];
  }
  function sv(e, t) {
    e.action = t;
  }
  function _f(e) {
    var t = ot(), n = qe;
    if (n !== null)
      return pf(t, n, e);
    ot(), t = t.memoizedState, n = ot();
    var l = n.queue.dispatch;
    return n.memoizedState = e, [t, l, !1];
  }
  function Bs(e, t, n, l) {
    return e = { tag: e, create: n, deps: l, inst: t, next: null }, t = Se.updateQueue, t === null && (t = Zi(), Se.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (l = n.next, n.next = e, e.next = l, t.lastEffect = e), e;
  }
  function bf() {
    return ot().memoizedState;
  }
  function Pi(e, t, n, l) {
    var c = Ot();
    Se.flags |= e, c.memoizedState = Bs(
      1 | t,
      { destroy: void 0 },
      n,
      l === void 0 ? null : l
    );
  }
  function Wi(e, t, n, l) {
    var c = ot();
    l = l === void 0 ? null : l;
    var u = c.memoizedState.inst;
    qe !== null && l !== null && bc(l, qe.memoizedState.deps) ? c.memoizedState = Bs(t, u, n, l) : (Se.flags |= e, c.memoizedState = Bs(
      1 | t,
      u,
      n,
      l
    ));
  }
  function gf(e, t) {
    Pi(8390656, 8, e, t);
  }
  function Cc(e, t) {
    Wi(2048, 8, e, t);
  }
  function lv(e) {
    Se.flags |= 4;
    var t = Se.updateQueue;
    if (t === null)
      t = Zi(), Se.updateQueue = t, t.events = [e];
    else {
      var n = t.events;
      n === null ? t.events = [e] : n.push(e);
    }
  }
  function vf(e) {
    var t = ot().memoizedState;
    return lv({ ref: t, nextImpl: e }), function() {
      if ((Ue & 2) !== 0) throw Error(o(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function xf(e, t) {
    return Wi(4, 2, e, t);
  }
  function yf(e, t) {
    return Wi(4, 4, e, t);
  }
  function wf(e, t) {
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
  function jf(e, t, n) {
    n = n != null ? n.concat([e]) : null, Wi(4, 4, wf.bind(null, t, e), n);
  }
  function Ec() {
  }
  function Sf(e, t) {
    var n = ot();
    t = t === void 0 ? null : t;
    var l = n.memoizedState;
    return t !== null && bc(t, l[1]) ? l[0] : (n.memoizedState = [e, t], e);
  }
  function kf(e, t) {
    var n = ot();
    t = t === void 0 ? null : t;
    var l = n.memoizedState;
    if (t !== null && bc(t, l[1]))
      return l[0];
    if (l = e(), ns) {
      vn(!0);
      try {
        e();
      } finally {
        vn(!1);
      }
    }
    return n.memoizedState = [l, t], l;
  }
  function Tc(e, t, n) {
    return n === void 0 || (Gn & 1073741824) !== 0 && (Me & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = n, e = Nm(), Se.lanes |= e, ga |= e, n);
  }
  function Nf(e, t, n, l) {
    return Pt(n, t) ? n : Ls.current !== null ? (e = Tc(e, n, l), Pt(e, t) || (dt = !0), e) : (Gn & 42) === 0 || (Gn & 1073741824) !== 0 && (Me & 261930) === 0 ? (dt = !0, e.memoizedState = n) : (e = Nm(), Se.lanes |= e, ga |= e, t);
  }
  function Cf(e, t, n, l, c) {
    var u = z.p;
    z.p = u !== 0 && 8 > u ? u : 8;
    var _ = S.T, w = {};
    S.T = w, Ac(e, !1, t, n);
    try {
      var R = c(), U = S.S;
      if (U !== null && U(w, R), R !== null && typeof R == "object" && typeof R.then == "function") {
        var X = ev(
          R,
          l
        );
        Dl(
          e,
          t,
          X,
          an(e)
        );
      } else
        Dl(
          e,
          t,
          l,
          an(e)
        );
    } catch (W) {
      Dl(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: W },
        an()
      );
    } finally {
      z.p = u, _ !== null && w.types !== null && (_.types = w.types), S.T = _;
    }
  }
  function iv() {
  }
  function Mc(e, t, n, l) {
    if (e.tag !== 5) throw Error(o(476));
    var c = Ef(e).queue;
    Cf(
      e,
      c,
      t,
      q,
      n === null ? iv : function() {
        return Tf(e), n(l);
      }
    );
  }
  function Ef(e) {
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
  function Tf(e) {
    var t = Ef(e);
    t.next === null && (t = e.alternate.memoizedState), Dl(
      e,
      t.next.queue,
      {},
      an()
    );
  }
  function Rc() {
    return jt(Pl);
  }
  function Mf() {
    return ot().memoizedState;
  }
  function Rf() {
    return ot().memoizedState;
  }
  function rv(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var n = an();
          e = ha(n);
          var l = fa(t, e, n);
          l !== null && (Qt(l, t, n), Tl(l, t, n)), t = { cache: ic() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function ov(e, t, n) {
    var l = an();
    n = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Ii(e) ? zf(t, n) : (n = Ko(e, t, n, l), n !== null && (Qt(n, e, l), Df(n, t, l)));
  }
  function Af(e, t, n) {
    var l = an();
    Dl(e, t, n, l);
  }
  function Dl(e, t, n, l) {
    var c = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (Ii(e)) zf(t, c);
    else {
      var u = e.alternate;
      if (e.lanes === 0 && (u === null || u.lanes === 0) && (u = t.lastRenderedReducer, u !== null))
        try {
          var _ = t.lastRenderedState, w = u(_, n);
          if (c.hasEagerState = !0, c.eagerState = w, Pt(w, _))
            return zi(e, t, c, 0), Ze === null && Ai(), !1;
        } catch {
        } finally {
        }
      if (n = Ko(e, t, c, l), n !== null)
        return Qt(n, e, l), Df(n, t, l), !0;
    }
    return !1;
  }
  function Ac(e, t, n, l) {
    if (l = {
      lane: 2,
      revertLane: uu(),
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Ii(e)) {
      if (t) throw Error(o(479));
    } else
      t = Ko(
        e,
        n,
        l,
        2
      ), t !== null && Qt(t, e, 2);
  }
  function Ii(e) {
    var t = e.alternate;
    return e === Se || t !== null && t === Se;
  }
  function zf(e, t) {
    $s = Xi = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function Df(e, t, n) {
    if ((n & 4194048) !== 0) {
      var l = t.lanes;
      l &= e.pendingLanes, n |= l, t.lanes = n, $d(e, n);
    }
  }
  var Ol = {
    readContext: jt,
    use: Ki,
    useCallback: st,
    useContext: st,
    useEffect: st,
    useImperativeHandle: st,
    useLayoutEffect: st,
    useInsertionEffect: st,
    useMemo: st,
    useReducer: st,
    useRef: st,
    useState: st,
    useDebugValue: st,
    useDeferredValue: st,
    useTransition: st,
    useSyncExternalStore: st,
    useId: st,
    useHostTransitionStatus: st,
    useFormState: st,
    useActionState: st,
    useOptimistic: st,
    useMemoCache: st,
    useCacheRefresh: st
  };
  Ol.useEffectEvent = st;
  var Of = {
    readContext: jt,
    use: Ki,
    useCallback: function(e, t) {
      return Ot().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: jt,
    useEffect: gf,
    useImperativeHandle: function(e, t, n) {
      n = n != null ? n.concat([e]) : null, Pi(
        4194308,
        4,
        wf.bind(null, t, e),
        n
      );
    },
    useLayoutEffect: function(e, t) {
      return Pi(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      Pi(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var n = Ot();
      t = t === void 0 ? null : t;
      var l = e();
      if (ns) {
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
        if (ns) {
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
      }, l.queue = e, e = e.dispatch = ov.bind(
        null,
        Se,
        e
      ), [l.memoizedState, e];
    },
    useRef: function(e) {
      var t = Ot();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = kc(e);
      var t = e.queue, n = Af.bind(null, Se, t);
      return t.dispatch = n, [e.memoizedState, n];
    },
    useDebugValue: Ec,
    useDeferredValue: function(e, t) {
      var n = Ot();
      return Tc(n, e, t);
    },
    useTransition: function() {
      var e = kc(!1);
      return e = Cf.bind(
        null,
        Se,
        e.queue,
        !0,
        !1
      ), Ot().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, n) {
      var l = Se, c = Ot();
      if (Ae) {
        if (n === void 0)
          throw Error(o(407));
        n = n();
      } else {
        if (n = t(), Ze === null)
          throw Error(o(349));
        (Me & 127) !== 0 || tf(l, t, n);
      }
      c.memoizedState = n;
      var u = { value: n, getSnapshot: t };
      return c.queue = u, gf(af.bind(null, l, u, e), [
        e
      ]), l.flags |= 2048, Bs(
        9,
        { destroy: void 0 },
        nf.bind(
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
      var e = Ot(), t = Ze.identifierPrefix;
      if (Ae) {
        var n = Cn, l = Nn;
        n = (l & ~(1 << 32 - Et(l) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = Qi++, 0 < n && (t += "H" + n.toString(32)), t += "_";
      } else
        n = tv++, t = "_" + t + "r_" + n.toString(32) + "_";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: Rc,
    useFormState: ff,
    useActionState: ff,
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
      return t.queue = n, t = Ac.bind(
        null,
        Se,
        !0,
        n
      ), n.dispatch = t, [e, t];
    },
    useMemoCache: wc,
    useCacheRefresh: function() {
      return Ot().memoizedState = rv.bind(
        null,
        Se
      );
    },
    useEffectEvent: function(e) {
      var t = Ot(), n = { impl: e };
      return t.memoizedState = n, function() {
        if ((Ue & 2) !== 0)
          throw Error(o(440));
        return n.impl.apply(void 0, arguments);
      };
    }
  }, zc = {
    readContext: jt,
    use: Ki,
    useCallback: Sf,
    useContext: jt,
    useEffect: Cc,
    useImperativeHandle: jf,
    useInsertionEffect: xf,
    useLayoutEffect: yf,
    useMemo: kf,
    useReducer: Ji,
    useRef: bf,
    useState: function() {
      return Ji(Vn);
    },
    useDebugValue: Ec,
    useDeferredValue: function(e, t) {
      var n = ot();
      return Nf(
        n,
        qe.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = Ji(Vn)[0], t = ot().memoizedState;
      return [
        typeof e == "boolean" ? e : zl(e),
        t
      ];
    },
    useSyncExternalStore: ef,
    useId: Mf,
    useHostTransitionStatus: Rc,
    useFormState: mf,
    useActionState: mf,
    useOptimistic: function(e, t) {
      var n = ot();
      return rf(n, qe, e, t);
    },
    useMemoCache: wc,
    useCacheRefresh: Rf
  };
  zc.useEffectEvent = vf;
  var Hf = {
    readContext: jt,
    use: Ki,
    useCallback: Sf,
    useContext: jt,
    useEffect: Cc,
    useImperativeHandle: jf,
    useInsertionEffect: xf,
    useLayoutEffect: yf,
    useMemo: kf,
    useReducer: Sc,
    useRef: bf,
    useState: function() {
      return Sc(Vn);
    },
    useDebugValue: Ec,
    useDeferredValue: function(e, t) {
      var n = ot();
      return qe === null ? Tc(n, e, t) : Nf(
        n,
        qe.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = Sc(Vn)[0], t = ot().memoizedState;
      return [
        typeof e == "boolean" ? e : zl(e),
        t
      ];
    },
    useSyncExternalStore: ef,
    useId: Mf,
    useHostTransitionStatus: Rc,
    useFormState: _f,
    useActionState: _f,
    useOptimistic: function(e, t) {
      var n = ot();
      return qe !== null ? rf(n, qe, e, t) : (n.baseState = e, [e, n.queue.dispatch]);
    },
    useMemoCache: wc,
    useCacheRefresh: Rf
  };
  Hf.useEffectEvent = vf;
  function Dc(e, t, n, l) {
    t = e.memoizedState, n = n(l, t), n = n == null ? t : g({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var Oc = {
    enqueueSetState: function(e, t, n) {
      e = e._reactInternals;
      var l = an(), c = ha(l);
      c.payload = t, n != null && (c.callback = n), t = fa(e, c, l), t !== null && (Qt(t, e, l), Tl(t, e, l));
    },
    enqueueReplaceState: function(e, t, n) {
      e = e._reactInternals;
      var l = an(), c = ha(l);
      c.tag = 1, c.payload = t, n != null && (c.callback = n), t = fa(e, c, l), t !== null && (Qt(t, e, l), Tl(t, e, l));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var n = an(), l = ha(n);
      l.tag = 2, t != null && (l.callback = t), t = fa(e, l, n), t !== null && (Qt(t, e, n), Tl(t, e, n));
    }
  };
  function Lf(e, t, n, l, c, u, _) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(l, u, _) : t.prototype && t.prototype.isPureReactComponent ? !yl(n, l) || !yl(c, u) : !0;
  }
  function $f(e, t, n, l) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, l), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, l), t.state !== e && Oc.enqueueReplaceState(t, t.state, null);
  }
  function as(e, t) {
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
  function Uf(e) {
    Ri(e);
  }
  function Bf(e) {
    console.error(e);
  }
  function Ff(e) {
    Ri(e);
  }
  function er(e, t) {
    try {
      var n = e.onUncaughtError;
      n(t.value, { componentStack: t.stack });
    } catch (l) {
      setTimeout(function() {
        throw l;
      });
    }
  }
  function Gf(e, t, n) {
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
  function Hc(e, t, n) {
    return n = ha(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
      er(e, t);
    }, n;
  }
  function Vf(e) {
    return e = ha(e), e.tag = 3, e;
  }
  function qf(e, t, n, l) {
    var c = n.type.getDerivedStateFromError;
    if (typeof c == "function") {
      var u = l.value;
      e.payload = function() {
        return c(u);
      }, e.callback = function() {
        Gf(t, n, l);
      };
    }
    var _ = n.stateNode;
    _ !== null && typeof _.componentDidCatch == "function" && (e.callback = function() {
      Gf(t, n, l), typeof c != "function" && (va === null ? va = /* @__PURE__ */ new Set([this]) : va.add(this));
      var w = l.stack;
      this.componentDidCatch(l.value, {
        componentStack: w !== null ? w : ""
      });
    });
  }
  function cv(e, t, n, l, c) {
    if (n.flags |= 32768, l !== null && typeof l == "object" && typeof l.then == "function") {
      if (t = n.alternate, t !== null && As(
        t,
        n,
        c,
        !0
      ), n = It.current, n !== null) {
        switch (n.tag) {
          case 31:
          case 13:
            return pn === null ? hr() : n.alternate === null && lt === 0 && (lt = 3), n.flags &= -257, n.flags |= 65536, n.lanes = c, l === Fi ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([l]) : t.add(l), ru(e, l, c)), !1;
          case 22:
            return n.flags |= 65536, l === Fi ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([l])
            }, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([l]) : n.add(l)), ru(e, l, c)), !1;
        }
        throw Error(o(435, n.tag));
      }
      return ru(e, l, c), hr(), !1;
    }
    if (Ae)
      return t = It.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = c, l !== tc && (e = Error(o(422), { cause: l }), Sl(dn(e, n)))) : (l !== tc && (t = Error(o(423), {
        cause: l
      }), Sl(
        dn(t, n)
      )), e = e.current.alternate, e.flags |= 65536, c &= -c, e.lanes |= c, l = dn(l, n), c = Hc(
        e.stateNode,
        l,
        c
      ), hc(e, c), lt !== 4 && (lt = 2)), !1;
    var u = Error(o(520), { cause: l });
    if (u = dn(u, n), Vl === null ? Vl = [u] : Vl.push(u), lt !== 4 && (lt = 2), t === null) return !0;
    l = dn(l, n), n = t;
    do {
      switch (n.tag) {
        case 3:
          return n.flags |= 65536, e = c & -c, n.lanes |= e, e = Hc(n.stateNode, l, e), hc(n, e), !1;
        case 1:
          if (t = n.type, u = n.stateNode, (n.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || u !== null && typeof u.componentDidCatch == "function" && (va === null || !va.has(u))))
            return n.flags |= 65536, c &= -c, n.lanes |= c, c = Vf(c), qf(
              c,
              e,
              n,
              l
            ), hc(n, c), !1;
      }
      n = n.return;
    } while (n !== null);
    return !1;
  }
  var Lc = Error(o(461)), dt = !1;
  function St(e, t, n, l) {
    t.child = e === null ? Qh(t, null, n, l) : ts(
      t,
      e.child,
      n,
      l
    );
  }
  function Yf(e, t, n, l, c) {
    n = n.render;
    var u = t.ref;
    if ("ref" in l) {
      var _ = {};
      for (var w in l)
        w !== "ref" && (_[w] = l[w]);
    } else _ = l;
    return Pa(t), l = gc(
      e,
      t,
      n,
      _,
      u,
      c
    ), w = vc(), e !== null && !dt ? (xc(e, t, c), qn(e, t, c)) : (Ae && w && Io(t), t.flags |= 1, St(e, t, l, c), t.child);
  }
  function Xf(e, t, n, l, c) {
    if (e === null) {
      var u = n.type;
      return typeof u == "function" && !Jo(u) && u.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = u, Qf(
        e,
        t,
        u,
        l,
        c
      )) : (e = Oi(
        n.type,
        null,
        l,
        t,
        t.mode,
        c
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (u = e.child, !Yc(e, c)) {
      var _ = u.memoizedProps;
      if (n = n.compare, n = n !== null ? n : yl, n(_, l) && e.ref === t.ref)
        return qn(e, t, c);
    }
    return t.flags |= 1, e = $n(u, l), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Qf(e, t, n, l, c) {
    if (e !== null) {
      var u = e.memoizedProps;
      if (yl(u, l) && e.ref === t.ref)
        if (dt = !1, t.pendingProps = l = u, Yc(e, c))
          (e.flags & 131072) !== 0 && (dt = !0);
        else
          return t.lanes = e.lanes, qn(e, t, c);
    }
    return $c(
      e,
      t,
      n,
      l,
      c
    );
  }
  function Zf(e, t, n, l) {
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
        return Kf(
          e,
          t,
          u,
          n,
          l
        );
      }
      if ((n & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && Ui(
          t,
          u !== null ? u.cachePool : null
        ), u !== null ? Jh(t, u) : mc(), Ph(t);
      else
        return l = t.lanes = 536870912, Kf(
          e,
          t,
          u !== null ? u.baseLanes | n : n,
          n,
          l
        );
    } else
      u !== null ? (Ui(t, u.cachePool), Jh(t, u), pa(), t.memoizedState = null) : (e !== null && Ui(t, null), mc(), pa());
    return St(e, t, c, n), t.child;
  }
  function Hl(e, t) {
    return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function Kf(e, t, n, l, c) {
    var u = oc();
    return u = u === null ? null : { parent: ct._currentValue, pool: u }, t.memoizedState = {
      baseLanes: n,
      cachePool: u
    }, e !== null && Ui(t, null), mc(), Ph(t), e !== null && As(e, t, l, !0), t.childLanes = c, null;
  }
  function tr(e, t) {
    return t = ar(
      { mode: t.mode, children: t.children },
      e.mode
    ), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function Jf(e, t, n) {
    return ts(t, e.child, null, n), e = tr(t, t.pendingProps), e.flags |= 2, en(t), t.memoizedState = null, e;
  }
  function uv(e, t, n) {
    var l = t.pendingProps, c = (t.flags & 128) !== 0;
    if (t.flags &= -129, e === null) {
      if (Ae) {
        if (l.mode === "hidden")
          return e = tr(t, l), t.lanes = 536870912, Hl(null, e);
        if (_c(t), (e = Ie) ? (e = op(
          e,
          mn
        ), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: ra !== null ? { id: Nn, overflow: Cn } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = Ah(e), n.return = t, t.child = n, wt = t, Ie = null)) : e = null, e === null) throw ca(t);
        return t.lanes = 536870912, null;
      }
      return tr(t, l);
    }
    var u = e.memoizedState;
    if (u !== null) {
      var _ = u.dehydrated;
      if (_c(t), c)
        if (t.flags & 256)
          t.flags &= -257, t = Jf(
            e,
            t,
            n
          );
        else if (t.memoizedState !== null)
          t.child = e.child, t.flags |= 128, t = null;
        else throw Error(o(558));
      else if (dt || As(e, t, n, !1), c = (n & e.childLanes) !== 0, dt || c) {
        if (l = Ze, l !== null && (_ = Ud(l, n), _ !== 0 && _ !== u.retryLane))
          throw u.retryLane = _, Qa(e, _), Qt(l, e, _), Lc;
        hr(), t = Jf(
          e,
          t,
          n
        );
      } else
        e = u.treeContext, Ie = _n(_.nextSibling), wt = t, Ae = !0, oa = null, mn = !1, e !== null && Oh(t, e), t = tr(t, l), t.flags |= 4096;
      return t;
    }
    return e = $n(e.child, {
      mode: l.mode,
      children: l.children
    }), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function nr(e, t) {
    var n = t.ref;
    if (n === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof n != "function" && typeof n != "object")
        throw Error(o(284));
      (e === null || e.ref !== n) && (t.flags |= 4194816);
    }
  }
  function $c(e, t, n, l, c) {
    return Pa(t), n = gc(
      e,
      t,
      n,
      l,
      void 0,
      c
    ), l = vc(), e !== null && !dt ? (xc(e, t, c), qn(e, t, c)) : (Ae && l && Io(t), t.flags |= 1, St(e, t, n, c), t.child);
  }
  function Pf(e, t, n, l, c, u) {
    return Pa(t), t.updateQueue = null, n = Ih(
      t,
      l,
      n,
      c
    ), Wh(e), l = vc(), e !== null && !dt ? (xc(e, t, u), qn(e, t, u)) : (Ae && l && Io(t), t.flags |= 1, St(e, t, n, u), t.child);
  }
  function Wf(e, t, n, l, c) {
    if (Pa(t), t.stateNode === null) {
      var u = Es, _ = n.contextType;
      typeof _ == "object" && _ !== null && (u = jt(_)), u = new n(l, u), t.memoizedState = u.state !== null && u.state !== void 0 ? u.state : null, u.updater = Oc, t.stateNode = u, u._reactInternals = t, u = t.stateNode, u.props = l, u.state = t.memoizedState, u.refs = {}, uc(t), _ = n.contextType, u.context = typeof _ == "object" && _ !== null ? jt(_) : Es, u.state = t.memoizedState, _ = n.getDerivedStateFromProps, typeof _ == "function" && (Dc(
        t,
        n,
        _,
        l
      ), u.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof u.getSnapshotBeforeUpdate == "function" || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (_ = u.state, typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount(), _ !== u.state && Oc.enqueueReplaceState(u, u.state, null), Rl(t, l, u, c), Ml(), u.state = t.memoizedState), typeof u.componentDidMount == "function" && (t.flags |= 4194308), l = !0;
    } else if (e === null) {
      u = t.stateNode;
      var w = t.memoizedProps, R = as(n, w);
      u.props = R;
      var U = u.context, X = n.contextType;
      _ = Es, typeof X == "object" && X !== null && (_ = jt(X));
      var W = n.getDerivedStateFromProps;
      X = typeof W == "function" || typeof u.getSnapshotBeforeUpdate == "function", w = t.pendingProps !== w, X || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (w || U !== _) && $f(
        t,
        u,
        l,
        _
      ), da = !1;
      var B = t.memoizedState;
      u.state = B, Rl(t, l, u, c), Ml(), U = t.memoizedState, w || B !== U || da ? (typeof W == "function" && (Dc(
        t,
        n,
        W,
        l
      ), U = t.memoizedState), (R = da || Lf(
        t,
        n,
        R,
        l,
        B,
        U,
        _
      )) ? (X || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = l, t.memoizedState = U), u.props = l, u.state = U, u.context = _, l = R) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), l = !1);
    } else {
      u = t.stateNode, dc(e, t), _ = t.memoizedProps, X = as(n, _), u.props = X, W = t.pendingProps, B = u.context, U = n.contextType, R = Es, typeof U == "object" && U !== null && (R = jt(U)), w = n.getDerivedStateFromProps, (U = typeof w == "function" || typeof u.getSnapshotBeforeUpdate == "function") || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (_ !== W || B !== R) && $f(
        t,
        u,
        l,
        R
      ), da = !1, B = t.memoizedState, u.state = B, Rl(t, l, u, c), Ml();
      var V = t.memoizedState;
      _ !== W || B !== V || da || e !== null && e.dependencies !== null && Li(e.dependencies) ? (typeof w == "function" && (Dc(
        t,
        n,
        w,
        l
      ), V = t.memoizedState), (X = da || Lf(
        t,
        n,
        X,
        l,
        B,
        V,
        R
      ) || e !== null && e.dependencies !== null && Li(e.dependencies)) ? (U || typeof u.UNSAFE_componentWillUpdate != "function" && typeof u.componentWillUpdate != "function" || (typeof u.componentWillUpdate == "function" && u.componentWillUpdate(l, V, R), typeof u.UNSAFE_componentWillUpdate == "function" && u.UNSAFE_componentWillUpdate(
        l,
        V,
        R
      )), typeof u.componentDidUpdate == "function" && (t.flags |= 4), typeof u.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof u.componentDidUpdate != "function" || _ === e.memoizedProps && B === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || _ === e.memoizedProps && B === e.memoizedState || (t.flags |= 1024), t.memoizedProps = l, t.memoizedState = V), u.props = l, u.state = V, u.context = R, l = X) : (typeof u.componentDidUpdate != "function" || _ === e.memoizedProps && B === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || _ === e.memoizedProps && B === e.memoizedState || (t.flags |= 1024), l = !1);
    }
    return u = l, nr(e, t), l = (t.flags & 128) !== 0, u || l ? (u = t.stateNode, n = l && typeof n.getDerivedStateFromError != "function" ? null : u.render(), t.flags |= 1, e !== null && l ? (t.child = ts(
      t,
      e.child,
      null,
      c
    ), t.child = ts(
      t,
      null,
      n,
      c
    )) : St(e, t, n, c), t.memoizedState = u.state, e = t.child) : e = qn(
      e,
      t,
      c
    ), e;
  }
  function If(e, t, n, l) {
    return Ka(), t.flags |= 256, St(e, t, n, l), t.child;
  }
  var Uc = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function Bc(e) {
    return { baseLanes: e, cachePool: Fh() };
  }
  function Fc(e, t, n) {
    return e = e !== null ? e.childLanes & ~n : 0, t && (e |= nn), e;
  }
  function em(e, t, n) {
    var l = t.pendingProps, c = !1, u = (t.flags & 128) !== 0, _;
    if ((_ = u) || (_ = e !== null && e.memoizedState === null ? !1 : (rt.current & 2) !== 0), _ && (c = !0, t.flags &= -129), _ = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (Ae) {
        if (c ? ma(t) : pa(), (e = Ie) ? (e = op(
          e,
          mn
        ), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: ra !== null ? { id: Nn, overflow: Cn } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = Ah(e), n.return = t, t.child = n, wt = t, Ie = null)) : e = null, e === null) throw ca(t);
        return ju(e) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      var w = l.children;
      return l = l.fallback, c ? (pa(), c = t.mode, w = ar(
        { mode: "hidden", children: w },
        c
      ), l = Za(
        l,
        c,
        n,
        null
      ), w.return = t, l.return = t, w.sibling = l, t.child = w, l = t.child, l.memoizedState = Bc(n), l.childLanes = Fc(
        e,
        _,
        n
      ), t.memoizedState = Uc, Hl(null, l)) : (ma(t), Gc(t, w));
    }
    var R = e.memoizedState;
    if (R !== null && (w = R.dehydrated, w !== null)) {
      if (u)
        t.flags & 256 ? (ma(t), t.flags &= -257, t = Vc(
          e,
          t,
          n
        )) : t.memoizedState !== null ? (pa(), t.child = e.child, t.flags |= 128, t = null) : (pa(), w = l.fallback, c = t.mode, l = ar(
          { mode: "visible", children: l.children },
          c
        ), w = Za(
          w,
          c,
          n,
          null
        ), w.flags |= 2, l.return = t, w.return = t, l.sibling = w, t.child = l, ts(
          t,
          e.child,
          null,
          n
        ), l = t.child, l.memoizedState = Bc(n), l.childLanes = Fc(
          e,
          _,
          n
        ), t.memoizedState = Uc, t = Hl(null, l));
      else if (ma(t), ju(w)) {
        if (_ = w.nextSibling && w.nextSibling.dataset, _) var U = _.dgst;
        _ = U, l = Error(o(419)), l.stack = "", l.digest = _, Sl({ value: l, source: null, stack: null }), t = Vc(
          e,
          t,
          n
        );
      } else if (dt || As(e, t, n, !1), _ = (n & e.childLanes) !== 0, dt || _) {
        if (_ = Ze, _ !== null && (l = Ud(_, n), l !== 0 && l !== R.retryLane))
          throw R.retryLane = l, Qa(e, l), Qt(_, e, l), Lc;
        wu(w) || hr(), t = Vc(
          e,
          t,
          n
        );
      } else
        wu(w) ? (t.flags |= 192, t.child = e.child, t = null) : (e = R.treeContext, Ie = _n(
          w.nextSibling
        ), wt = t, Ae = !0, oa = null, mn = !1, e !== null && Oh(t, e), t = Gc(
          t,
          l.children
        ), t.flags |= 4096);
      return t;
    }
    return c ? (pa(), w = l.fallback, c = t.mode, R = e.child, U = R.sibling, l = $n(R, {
      mode: "hidden",
      children: l.children
    }), l.subtreeFlags = R.subtreeFlags & 65011712, U !== null ? w = $n(
      U,
      w
    ) : (w = Za(
      w,
      c,
      n,
      null
    ), w.flags |= 2), w.return = t, l.return = t, l.sibling = w, t.child = l, Hl(null, l), l = t.child, w = e.child.memoizedState, w === null ? w = Bc(n) : (c = w.cachePool, c !== null ? (R = ct._currentValue, c = c.parent !== R ? { parent: R, pool: R } : c) : c = Fh(), w = {
      baseLanes: w.baseLanes | n,
      cachePool: c
    }), l.memoizedState = w, l.childLanes = Fc(
      e,
      _,
      n
    ), t.memoizedState = Uc, Hl(e.child, l)) : (ma(t), n = e.child, e = n.sibling, n = $n(n, {
      mode: "visible",
      children: l.children
    }), n.return = t, n.sibling = null, e !== null && (_ = t.deletions, _ === null ? (t.deletions = [e], t.flags |= 16) : _.push(e)), t.child = n, t.memoizedState = null, n);
  }
  function Gc(e, t) {
    return t = ar(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function ar(e, t) {
    return e = Wt(22, e, null, t), e.lanes = 0, e;
  }
  function Vc(e, t, n) {
    return ts(t, e.child, null, n), e = Gc(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function tm(e, t, n) {
    e.lanes |= t;
    var l = e.alternate;
    l !== null && (l.lanes |= t), sc(e.return, t, n);
  }
  function qc(e, t, n, l, c, u) {
    var _ = e.memoizedState;
    _ === null ? e.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: l,
      tail: n,
      tailMode: c,
      treeForkCount: u
    } : (_.isBackwards = t, _.rendering = null, _.renderingStartTime = 0, _.last = l, _.tail = n, _.tailMode = c, _.treeForkCount = u);
  }
  function nm(e, t, n) {
    var l = t.pendingProps, c = l.revealOrder, u = l.tail;
    l = l.children;
    var _ = rt.current, w = (_ & 2) !== 0;
    if (w ? (_ = _ & 1 | 2, t.flags |= 128) : _ &= 1, Q(rt, _), St(e, t, l, n), l = Ae ? jl : 0, !w && e !== null && (e.flags & 128) !== 0)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13)
          e.memoizedState !== null && tm(e, n, t);
        else if (e.tag === 19)
          tm(e, n, t);
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
          e = n.alternate, e !== null && Yi(e) === null && (c = n), n = n.sibling;
        n = c, n === null ? (c = t.child, t.child = null) : (c = n.sibling, n.sibling = null), qc(
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
          if (e = c.alternate, e !== null && Yi(e) === null) {
            t.child = c;
            break;
          }
          e = c.sibling, c.sibling = n, n = c, c = e;
        }
        qc(
          t,
          !0,
          n,
          null,
          u,
          l
        );
        break;
      case "together":
        qc(
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
        if (As(
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
  function Yc(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && Li(e)));
  }
  function dv(e, t, n) {
    switch (t.tag) {
      case 3:
        $e(t, t.stateNode.containerInfo), ua(t, ct, e.memoizedState.cache), Ka();
        break;
      case 27:
      case 5:
        ke(t);
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
          return t.flags |= 128, _c(t), null;
        break;
      case 13:
        var l = t.memoizedState;
        if (l !== null)
          return l.dehydrated !== null ? (ma(t), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? em(e, t, n) : (ma(t), e = qn(
            e,
            t,
            n
          ), e !== null ? e.sibling : null);
        ma(t);
        break;
      case 19:
        var c = (e.flags & 128) !== 0;
        if (l = (n & t.childLanes) !== 0, l || (As(
          e,
          t,
          n,
          !1
        ), l = (n & t.childLanes) !== 0), c) {
          if (l)
            return nm(
              e,
              t,
              n
            );
          t.flags |= 128;
        }
        if (c = t.memoizedState, c !== null && (c.rendering = null, c.tail = null, c.lastEffect = null), Q(rt, rt.current), l) break;
        return null;
      case 22:
        return t.lanes = 0, Zf(
          e,
          t,
          n,
          t.pendingProps
        );
      case 24:
        ua(t, ct, e.memoizedState.cache);
    }
    return qn(e, t, n);
  }
  function am(e, t, n) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        dt = !0;
      else {
        if (!Yc(e, n) && (t.flags & 128) === 0)
          return dt = !1, dv(
            e,
            t,
            n
          );
        dt = (e.flags & 131072) !== 0;
      }
    else
      dt = !1, Ae && (t.flags & 1048576) !== 0 && Dh(t, jl, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          var l = t.pendingProps;
          if (e = Ia(t.elementType), t.type = e, typeof e == "function")
            Jo(e) ? (l = as(e, l), t.tag = 1, t = Wf(
              null,
              t,
              e,
              l,
              n
            )) : (t.tag = 0, t = $c(
              null,
              t,
              e,
              l,
              n
            ));
          else {
            if (e != null) {
              var c = e.$$typeof;
              if (c === P) {
                t.tag = 11, t = Yf(
                  null,
                  t,
                  e,
                  l,
                  n
                );
                break e;
              } else if (c === G) {
                t.tag = 14, t = Xf(
                  null,
                  t,
                  e,
                  l,
                  n
                );
                break e;
              }
            }
            throw t = fe(e) || e, Error(o(306, t, ""));
          }
        }
        return t;
      case 0:
        return $c(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 1:
        return l = t.type, c = as(
          l,
          t.pendingProps
        ), Wf(
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
          c = u.element, dc(e, t), Rl(t, l, null, n);
          var _ = t.memoizedState;
          if (l = _.cache, ua(t, ct, l), l !== u.cache && lc(
            t,
            [ct],
            n,
            !0
          ), Ml(), l = _.element, u.isDehydrated)
            if (u = {
              element: l,
              isDehydrated: !1,
              cache: _.cache
            }, t.updateQueue.baseState = u, t.memoizedState = u, t.flags & 256) {
              t = If(
                e,
                t,
                l,
                n
              );
              break e;
            } else if (l !== c) {
              c = dn(
                Error(o(424)),
                t
              ), Sl(c), t = If(
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
              for (Ie = _n(e.firstChild), wt = t, Ae = !0, oa = null, mn = !0, n = Qh(
                t,
                null,
                l,
                n
              ), t.child = n; n; )
                n.flags = n.flags & -3 | 4096, n = n.sibling;
            }
          else {
            if (Ka(), l === c) {
              t = qn(
                e,
                t,
                n
              );
              break e;
            }
            St(e, t, l, n);
          }
          t = t.child;
        }
        return t;
      case 26:
        return nr(e, t), e === null ? (n = mp(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = n : Ae || (n = t.type, e = t.pendingProps, l = vr(
          de.current
        ).createElement(n), l[yt] = t, l[Ft] = e, kt(l, n, e), bt(l), t.stateNode = l) : t.memoizedState = mp(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return ke(t), e === null && Ae && (l = t.stateNode = dp(
          t.type,
          t.pendingProps,
          de.current
        ), wt = t, mn = !0, c = Ie, ja(t.type) ? (Su = c, Ie = _n(l.firstChild)) : Ie = c), St(
          e,
          t,
          t.pendingProps.children,
          n
        ), nr(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && Ae && ((c = l = Ie) && (l = Fv(
          l,
          t.type,
          t.pendingProps,
          mn
        ), l !== null ? (t.stateNode = l, wt = t, Ie = _n(l.firstChild), mn = !1, c = !0) : c = !1), c || ca(t)), ke(t), c = t.type, u = t.pendingProps, _ = e !== null ? e.memoizedProps : null, l = u.children, vu(c, u) ? l = null : _ !== null && vu(c, _) && (t.flags |= 32), t.memoizedState !== null && (c = gc(
          e,
          t,
          nv,
          null,
          null,
          n
        ), Pl._currentValue = c), nr(e, t), St(e, t, l, n), t.child;
      case 6:
        return e === null && Ae && ((e = n = Ie) && (n = Gv(
          n,
          t.pendingProps,
          mn
        ), n !== null ? (t.stateNode = n, wt = t, Ie = null, e = !0) : e = !1), e || ca(t)), null;
      case 13:
        return em(e, t, n);
      case 4:
        return $e(
          t,
          t.stateNode.containerInfo
        ), l = t.pendingProps, e === null ? t.child = ts(
          t,
          null,
          l,
          n
        ) : St(e, t, l, n), t.child;
      case 11:
        return Yf(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 7:
        return St(
          e,
          t,
          t.pendingProps,
          n
        ), t.child;
      case 8:
        return St(
          e,
          t,
          t.pendingProps.children,
          n
        ), t.child;
      case 12:
        return St(
          e,
          t,
          t.pendingProps.children,
          n
        ), t.child;
      case 10:
        return l = t.pendingProps, ua(t, t.type, l.value), St(e, t, l.children, n), t.child;
      case 9:
        return c = t.type._context, l = t.pendingProps.children, Pa(t), c = jt(c), l = l(c), t.flags |= 1, St(e, t, l, n), t.child;
      case 14:
        return Xf(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 15:
        return Qf(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 19:
        return nm(e, t, n);
      case 31:
        return uv(e, t, n);
      case 22:
        return Zf(
          e,
          t,
          n,
          t.pendingProps
        );
      case 24:
        return Pa(t), l = jt(ct), e === null ? (c = oc(), c === null && (c = Ze, u = ic(), c.pooledCache = u, u.refCount++, u !== null && (c.pooledCacheLanes |= n), c = u), t.memoizedState = { parent: l, cache: c }, uc(t), ua(t, ct, c)) : ((e.lanes & n) !== 0 && (dc(e, t), Rl(t, null, null, n), Ml()), c = e.memoizedState, u = t.memoizedState, c.parent !== l ? (c = { parent: l, cache: l }, t.memoizedState = c, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = c), ua(t, ct, l)) : (l = u.cache, ua(t, ct, l), l !== c.cache && lc(
          t,
          [ct],
          n,
          !0
        ))), St(
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
  function Xc(e, t, n, l, c) {
    if ((t = (e.mode & 32) !== 0) && (t = !1), t) {
      if (e.flags |= 16777216, (c & 335544128) === c)
        if (e.stateNode.complete) e.flags |= 8192;
        else if (Mm()) e.flags |= 8192;
        else
          throw es = Fi, cc;
    } else e.flags &= -16777217;
  }
  function sm(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !vp(t))
      if (Mm()) e.flags |= 8192;
      else
        throw es = Fi, cc;
  }
  function sr(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? Hd() : 536870912, e.lanes |= t, qs |= t);
  }
  function Ll(e, t) {
    if (!Ae)
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
  function et(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, l = 0;
    if (t)
      for (var c = e.child; c !== null; )
        n |= c.lanes | c.childLanes, l |= c.subtreeFlags & 65011712, l |= c.flags & 65011712, c.return = e, c = c.sibling;
    else
      for (c = e.child; c !== null; )
        n |= c.lanes | c.childLanes, l |= c.subtreeFlags, l |= c.flags, c.return = e, c = c.sibling;
    return e.subtreeFlags |= l, e.childLanes = n, t;
  }
  function hv(e, t, n) {
    var l = t.pendingProps;
    switch (ec(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return et(t), null;
      case 1:
        return et(t), null;
      case 3:
        return n = t.stateNode, l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), Fn(ct), Z(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (Rs(t) ? Yn(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, nc())), et(t), null;
      case 26:
        var c = t.type, u = t.memoizedState;
        return e === null ? (Yn(t), u !== null ? (et(t), sm(t, u)) : (et(t), Xc(
          t,
          c,
          null,
          l,
          n
        ))) : u ? u !== e.memoizedState ? (Yn(t), et(t), sm(t, u)) : (et(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== l && Yn(t), et(t), Xc(
          t,
          c,
          e,
          l,
          n
        )), null;
      case 27:
        if (Be(t), n = de.current, c = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== l && Yn(t);
        else {
          if (!l) {
            if (t.stateNode === null)
              throw Error(o(166));
            return et(t), null;
          }
          e = ne.current, Rs(t) ? Hh(t) : (e = dp(c, l, n), t.stateNode = e, Yn(t));
        }
        return et(t), null;
      case 5:
        if (Be(t), c = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== l && Yn(t);
        else {
          if (!l) {
            if (t.stateNode === null)
              throw Error(o(166));
            return et(t), null;
          }
          if (u = ne.current, Rs(t))
            Hh(t);
          else {
            var _ = vr(
              de.current
            );
            switch (u) {
              case 1:
                u = _.createElementNS(
                  "http://www.w3.org/2000/svg",
                  c
                );
                break;
              case 2:
                u = _.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  c
                );
                break;
              default:
                switch (c) {
                  case "svg":
                    u = _.createElementNS(
                      "http://www.w3.org/2000/svg",
                      c
                    );
                    break;
                  case "math":
                    u = _.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      c
                    );
                    break;
                  case "script":
                    u = _.createElement("div"), u.innerHTML = "<script><\/script>", u = u.removeChild(
                      u.firstChild
                    );
                    break;
                  case "select":
                    u = typeof l.is == "string" ? _.createElement("select", {
                      is: l.is
                    }) : _.createElement("select"), l.multiple ? u.multiple = !0 : l.size && (u.size = l.size);
                    break;
                  default:
                    u = typeof l.is == "string" ? _.createElement(c, { is: l.is }) : _.createElement(c);
                }
            }
            u[yt] = t, u[Ft] = l;
            e: for (_ = t.child; _ !== null; ) {
              if (_.tag === 5 || _.tag === 6)
                u.appendChild(_.stateNode);
              else if (_.tag !== 4 && _.tag !== 27 && _.child !== null) {
                _.child.return = _, _ = _.child;
                continue;
              }
              if (_ === t) break e;
              for (; _.sibling === null; ) {
                if (_.return === null || _.return === t)
                  break e;
                _ = _.return;
              }
              _.sibling.return = _.return, _ = _.sibling;
            }
            t.stateNode = u;
            e: switch (kt(u, c, l), c) {
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
        return et(t), Xc(
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
          if (e = de.current, Rs(t)) {
            if (e = t.stateNode, n = t.memoizedProps, l = null, c = wt, c !== null)
              switch (c.tag) {
                case 27:
                case 5:
                  l = c.memoizedProps;
              }
            e[yt] = t, e = !!(e.nodeValue === n || l !== null && l.suppressHydrationWarning === !0 || ep(e.nodeValue, n)), e || ca(t, !0);
          } else
            e = vr(e).createTextNode(
              l
            ), e[yt] = t, t.stateNode = e;
        }
        return et(t), null;
      case 31:
        if (n = t.memoizedState, e === null || e.memoizedState !== null) {
          if (l = Rs(t), n !== null) {
            if (e === null) {
              if (!l) throw Error(o(318));
              if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(557));
              e[yt] = t;
            } else
              Ka(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            et(t), e = !1;
          } else
            n = nc(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
          if (!e)
            return t.flags & 256 ? (en(t), t) : (en(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(o(558));
        }
        return et(t), null;
      case 13:
        if (l = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (c = Rs(t), l !== null && l.dehydrated !== null) {
            if (e === null) {
              if (!c) throw Error(o(318));
              if (c = t.memoizedState, c = c !== null ? c.dehydrated : null, !c) throw Error(o(317));
              c[yt] = t;
            } else
              Ka(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            et(t), c = !1;
          } else
            c = nc(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = c), c = !0;
          if (!c)
            return t.flags & 256 ? (en(t), t) : (en(t), null);
        }
        return en(t), (t.flags & 128) !== 0 ? (t.lanes = n, t) : (n = l !== null, e = e !== null && e.memoizedState !== null, n && (l = t.child, c = null, l.alternate !== null && l.alternate.memoizedState !== null && l.alternate.memoizedState.cachePool !== null && (c = l.alternate.memoizedState.cachePool.pool), u = null, l.memoizedState !== null && l.memoizedState.cachePool !== null && (u = l.memoizedState.cachePool.pool), u !== c && (l.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), sr(t, t.updateQueue), et(t), null);
      case 4:
        return Z(), e === null && mu(t.stateNode.containerInfo), et(t), null;
      case 10:
        return Fn(t.type), et(t), null;
      case 19:
        if (H(rt), l = t.memoizedState, l === null) return et(t), null;
        if (c = (t.flags & 128) !== 0, u = l.rendering, u === null)
          if (c) Ll(l, !1);
          else {
            if (lt !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (u = Yi(e), u !== null) {
                  for (t.flags |= 128, Ll(l, !1), e = u.updateQueue, t.updateQueue = e, sr(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null; )
                    Rh(n, e), n = n.sibling;
                  return Q(
                    rt,
                    rt.current & 1 | 2
                  ), Ae && Un(t, l.treeForkCount), t.child;
                }
                e = e.sibling;
              }
            l.tail !== null && it() > cr && (t.flags |= 128, c = !0, Ll(l, !1), t.lanes = 4194304);
          }
        else {
          if (!c)
            if (e = Yi(u), e !== null) {
              if (t.flags |= 128, c = !0, e = e.updateQueue, t.updateQueue = e, sr(t, e), Ll(l, !0), l.tail === null && l.tailMode === "hidden" && !u.alternate && !Ae)
                return et(t), null;
            } else
              2 * it() - l.renderingStartTime > cr && n !== 536870912 && (t.flags |= 128, c = !0, Ll(l, !1), t.lanes = 4194304);
          l.isBackwards ? (u.sibling = t.child, t.child = u) : (e = l.last, e !== null ? e.sibling = u : t.child = u, l.last = u);
        }
        return l.tail !== null ? (e = l.tail, l.rendering = e, l.tail = e.sibling, l.renderingStartTime = it(), e.sibling = null, n = rt.current, Q(
          rt,
          c ? n & 1 | 2 : n & 1
        ), Ae && Un(t, l.treeForkCount), e) : (et(t), null);
      case 22:
      case 23:
        return en(t), pc(), l = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== l && (t.flags |= 8192) : l && (t.flags |= 8192), l ? (n & 536870912) !== 0 && (t.flags & 128) === 0 && (et(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : et(t), n = t.updateQueue, n !== null && sr(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), l = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), l !== n && (t.flags |= 2048), e !== null && H(Wa), null;
      case 24:
        return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), Fn(ct), et(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(o(156, t.tag));
  }
  function fv(e, t) {
    switch (ec(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Fn(ct), Z(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return Be(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (en(t), t.alternate === null)
            throw Error(o(340));
          Ka();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 13:
        if (en(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(o(340));
          Ka();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return H(rt), null;
      case 4:
        return Z(), null;
      case 10:
        return Fn(t.type), null;
      case 22:
      case 23:
        return en(t), pc(), e !== null && H(Wa), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return Fn(ct), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function lm(e, t) {
    switch (ec(t), t.tag) {
      case 3:
        Fn(ct), Z();
        break;
      case 26:
      case 27:
      case 5:
        Be(t);
        break;
      case 4:
        Z();
        break;
      case 31:
        t.memoizedState !== null && en(t);
        break;
      case 13:
        en(t);
        break;
      case 19:
        H(rt);
        break;
      case 10:
        Fn(t.type);
        break;
      case 22:
      case 23:
        en(t), pc(), e !== null && H(Wa);
        break;
      case 24:
        Fn(ct);
    }
  }
  function $l(e, t) {
    try {
      var n = t.updateQueue, l = n !== null ? n.lastEffect : null;
      if (l !== null) {
        var c = l.next;
        n = c;
        do {
          if ((n.tag & e) === e) {
            l = void 0;
            var u = n.create, _ = n.inst;
            l = u(), _.destroy = l;
          }
          n = n.next;
        } while (n !== c);
      }
    } catch (w) {
      Ge(t, t.return, w);
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
            var _ = l.inst, w = _.destroy;
            if (w !== void 0) {
              _.destroy = void 0, c = t;
              var R = n, U = w;
              try {
                U();
              } catch (X) {
                Ge(
                  c,
                  R,
                  X
                );
              }
            }
          }
          l = l.next;
        } while (l !== u);
      }
    } catch (X) {
      Ge(t, t.return, X);
    }
  }
  function im(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var n = e.stateNode;
      try {
        Kh(t, n);
      } catch (l) {
        Ge(e, e.return, l);
      }
    }
  }
  function rm(e, t, n) {
    n.props = as(
      e.type,
      e.memoizedProps
    ), n.state = e.memoizedState;
    try {
      n.componentWillUnmount();
    } catch (l) {
      Ge(e, t, l);
    }
  }
  function Ul(e, t) {
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
      Ge(e, t, c);
    }
  }
  function En(e, t) {
    var n = e.ref, l = e.refCleanup;
    if (n !== null)
      if (typeof l == "function")
        try {
          l();
        } catch (c) {
          Ge(e, t, c);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof n == "function")
        try {
          n(null);
        } catch (c) {
          Ge(e, t, c);
        }
      else n.current = null;
  }
  function om(e) {
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
      Ge(e, e.return, c);
    }
  }
  function Qc(e, t, n) {
    try {
      var l = e.stateNode;
      Ov(l, e.type, n, t), l[Ft] = t;
    } catch (c) {
      Ge(e, e.return, c);
    }
  }
  function cm(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && ja(e.type) || e.tag === 4;
  }
  function Zc(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || cm(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && ja(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Kc(e, t, n) {
    var l = e.tag;
    if (l === 5 || l === 6)
      e = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(e, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(e), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = Hn));
    else if (l !== 4 && (l === 27 && ja(e.type) && (n = e.stateNode, t = null), e = e.child, e !== null))
      for (Kc(e, t, n), e = e.sibling; e !== null; )
        Kc(e, t, n), e = e.sibling;
  }
  function lr(e, t, n) {
    var l = e.tag;
    if (l === 5 || l === 6)
      e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (l !== 4 && (l === 27 && ja(e.type) && (n = e.stateNode), e = e.child, e !== null))
      for (lr(e, t, n), e = e.sibling; e !== null; )
        lr(e, t, n), e = e.sibling;
  }
  function um(e) {
    var t = e.stateNode, n = e.memoizedProps;
    try {
      for (var l = e.type, c = t.attributes; c.length; )
        t.removeAttributeNode(c[0]);
      kt(t, l, n), t[yt] = e, t[Ft] = n;
    } catch (u) {
      Ge(e, e.return, u);
    }
  }
  var Xn = !1, ht = !1, Jc = !1, dm = typeof WeakSet == "function" ? WeakSet : Set, gt = null;
  function mv(e, t) {
    if (e = e.containerInfo, bu = Nr, e = wh(e), Vo(e)) {
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
            var _ = 0, w = -1, R = -1, U = 0, X = 0, W = e, B = null;
            t: for (; ; ) {
              for (var V; W !== n || c !== 0 && W.nodeType !== 3 || (w = _ + c), W !== u || l !== 0 && W.nodeType !== 3 || (R = _ + l), W.nodeType === 3 && (_ += W.nodeValue.length), (V = W.firstChild) !== null; )
                B = W, W = V;
              for (; ; ) {
                if (W === e) break t;
                if (B === n && ++U === c && (w = _), B === u && ++X === l && (R = _), (V = W.nextSibling) !== null) break;
                W = B, B = W.parentNode;
              }
              W = V;
            }
            n = w === -1 || R === -1 ? null : { start: w, end: R };
          } else n = null;
        }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (gu = { focusedElem: e, selectionRange: n }, Nr = !1, gt = t; gt !== null; )
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
                  var he = as(
                    n.type,
                    c
                  );
                  e = l.getSnapshotBeforeUpdate(
                    he,
                    u
                  ), l.__reactInternalSnapshotBeforeUpdate = e;
                } catch (ye) {
                  Ge(
                    n,
                    n.return,
                    ye
                  );
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (e = t.stateNode.containerInfo, n = e.nodeType, n === 9)
                  yu(e);
                else if (n === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      yu(e);
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
  function hm(e, t, n) {
    var l = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        Zn(e, n), l & 4 && $l(5, n);
        break;
      case 1:
        if (Zn(e, n), l & 4)
          if (e = n.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (_) {
              Ge(n, n.return, _);
            }
          else {
            var c = as(
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
            } catch (_) {
              Ge(
                n,
                n.return,
                _
              );
            }
          }
        l & 64 && im(n), l & 512 && Ul(n, n.return);
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
            Kh(e, t);
          } catch (_) {
            Ge(n, n.return, _);
          }
        }
        break;
      case 27:
        t === null && l & 4 && um(n);
      case 26:
      case 5:
        Zn(e, n), t === null && l & 4 && om(n), l & 512 && Ul(n, n.return);
        break;
      case 12:
        Zn(e, n);
        break;
      case 31:
        Zn(e, n), l & 4 && pm(e, n);
        break;
      case 13:
        Zn(e, n), l & 4 && _m(e, n), l & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = jv.bind(
          null,
          n
        ), Vv(e, n))));
        break;
      case 22:
        if (l = n.memoizedState !== null || Xn, !l) {
          t = t !== null && t.memoizedState !== null || ht, c = Xn;
          var u = ht;
          Xn = l, (ht = t) && !u ? Kn(
            e,
            n,
            (n.subtreeFlags & 8772) !== 0
          ) : Zn(e, n), Xn = c, ht = u;
        }
        break;
      case 30:
        break;
      default:
        Zn(e, n);
    }
  }
  function fm(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, fm(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && No(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var tt = null, Vt = !1;
  function Qn(e, t, n) {
    for (n = n.child; n !== null; )
      mm(e, t, n), n = n.sibling;
  }
  function mm(e, t, n) {
    if (Dt && typeof Dt.onCommitFiberUnmount == "function")
      try {
        Dt.onCommitFiberUnmount(Fa, n);
      } catch {
      }
    switch (n.tag) {
      case 26:
        ht || En(n, t), Qn(
          e,
          t,
          n
        ), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (n = n.stateNode, n.parentNode.removeChild(n));
        break;
      case 27:
        ht || En(n, t);
        var l = tt, c = Vt;
        ja(n.type) && (tt = n.stateNode, Vt = !1), Qn(
          e,
          t,
          n
        ), Zl(n.stateNode), tt = l, Vt = c;
        break;
      case 5:
        ht || En(n, t);
      case 6:
        if (l = tt, c = Vt, tt = null, Qn(
          e,
          t,
          n
        ), tt = l, Vt = c, tt !== null)
          if (Vt)
            try {
              (tt.nodeType === 9 ? tt.body : tt.nodeName === "HTML" ? tt.ownerDocument.body : tt).removeChild(n.stateNode);
            } catch (u) {
              Ge(
                n,
                t,
                u
              );
            }
          else
            try {
              tt.removeChild(n.stateNode);
            } catch (u) {
              Ge(
                n,
                t,
                u
              );
            }
        break;
      case 18:
        tt !== null && (Vt ? (e = tt, ip(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          n.stateNode
        ), Ws(e)) : ip(tt, n.stateNode));
        break;
      case 4:
        l = tt, c = Vt, tt = n.stateNode.containerInfo, Vt = !0, Qn(
          e,
          t,
          n
        ), tt = l, Vt = c;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        _a(2, n, t), ht || _a(4, n, t), Qn(
          e,
          t,
          n
        );
        break;
      case 1:
        ht || (En(n, t), l = n.stateNode, typeof l.componentWillUnmount == "function" && rm(
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
        ht = (l = ht) || n.memoizedState !== null, Qn(
          e,
          t,
          n
        ), ht = l;
        break;
      default:
        Qn(
          e,
          t,
          n
        );
    }
  }
  function pm(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
      e = e.dehydrated;
      try {
        Ws(e);
      } catch (n) {
        Ge(t, t.return, n);
      }
    }
  }
  function _m(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        Ws(e);
      } catch (n) {
        Ge(t, t.return, n);
      }
  }
  function pv(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new dm()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new dm()), t;
      default:
        throw Error(o(435, e.tag));
    }
  }
  function ir(e, t) {
    var n = pv(e);
    t.forEach(function(l) {
      if (!n.has(l)) {
        n.add(l);
        var c = Sv.bind(null, e, l);
        l.then(c, c);
      }
    });
  }
  function qt(e, t) {
    var n = t.deletions;
    if (n !== null)
      for (var l = 0; l < n.length; l++) {
        var c = n[l], u = e, _ = t, w = _;
        e: for (; w !== null; ) {
          switch (w.tag) {
            case 27:
              if (ja(w.type)) {
                tt = w.stateNode, Vt = !1;
                break e;
              }
              break;
            case 5:
              tt = w.stateNode, Vt = !1;
              break e;
            case 3:
            case 4:
              tt = w.stateNode.containerInfo, Vt = !0;
              break e;
          }
          w = w.return;
        }
        if (tt === null) throw Error(o(160));
        mm(u, _, c), tt = null, Vt = !1, u = c.alternate, u !== null && (u.return = null), c.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        bm(t, e), t = t.sibling;
  }
  var yn = null;
  function bm(e, t) {
    var n = e.alternate, l = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        qt(t, e), Yt(e), l & 4 && (_a(3, e, e.return), $l(3, e), _a(5, e, e.return));
        break;
      case 1:
        qt(t, e), Yt(e), l & 512 && (ht || n === null || En(n, n.return)), l & 64 && Xn && (e = e.updateQueue, e !== null && (l = e.callbacks, l !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? l : n.concat(l))));
        break;
      case 26:
        var c = yn;
        if (qt(t, e), Yt(e), l & 512 && (ht || n === null || En(n, n.return)), l & 4) {
          var u = n !== null ? n.memoizedState : null;
          if (l = e.memoizedState, n === null)
            if (l === null)
              if (e.stateNode === null) {
                e: {
                  l = e.type, n = e.memoizedProps, c = c.ownerDocument || c;
                  t: switch (l) {
                    case "title":
                      u = c.getElementsByTagName("title")[0], (!u || u[hl] || u[yt] || u.namespaceURI === "http://www.w3.org/2000/svg" || u.hasAttribute("itemprop")) && (u = c.createElement(l), c.head.insertBefore(
                        u,
                        c.querySelector("head > title")
                      )), kt(u, l, n), u[yt] = e, bt(u), l = u;
                      break e;
                    case "link":
                      var _ = bp(
                        "link",
                        "href",
                        c
                      ).get(l + (n.href || ""));
                      if (_) {
                        for (var w = 0; w < _.length; w++)
                          if (u = _[w], u.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && u.getAttribute("rel") === (n.rel == null ? null : n.rel) && u.getAttribute("title") === (n.title == null ? null : n.title) && u.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
                            _.splice(w, 1);
                            break t;
                          }
                      }
                      u = c.createElement(l), kt(u, l, n), c.head.appendChild(u);
                      break;
                    case "meta":
                      if (_ = bp(
                        "meta",
                        "content",
                        c
                      ).get(l + (n.content || ""))) {
                        for (w = 0; w < _.length; w++)
                          if (u = _[w], u.getAttribute("content") === (n.content == null ? null : "" + n.content) && u.getAttribute("name") === (n.name == null ? null : n.name) && u.getAttribute("property") === (n.property == null ? null : n.property) && u.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && u.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
                            _.splice(w, 1);
                            break t;
                          }
                      }
                      u = c.createElement(l), kt(u, l, n), c.head.appendChild(u);
                      break;
                    default:
                      throw Error(o(468, l));
                  }
                  u[yt] = e, bt(u), l = u;
                }
                e.stateNode = l;
              } else
                gp(
                  c,
                  e.type,
                  e.stateNode
                );
            else
              e.stateNode = _p(
                c,
                l,
                e.memoizedProps
              );
          else
            u !== l ? (u === null ? n.stateNode !== null && (n = n.stateNode, n.parentNode.removeChild(n)) : u.count--, l === null ? gp(
              c,
              e.type,
              e.stateNode
            ) : _p(
              c,
              l,
              e.memoizedProps
            )) : l === null && e.stateNode !== null && Qc(
              e,
              e.memoizedProps,
              n.memoizedProps
            );
        }
        break;
      case 27:
        qt(t, e), Yt(e), l & 512 && (ht || n === null || En(n, n.return)), n !== null && l & 4 && Qc(
          e,
          e.memoizedProps,
          n.memoizedProps
        );
        break;
      case 5:
        if (qt(t, e), Yt(e), l & 512 && (ht || n === null || En(n, n.return)), e.flags & 32) {
          c = e.stateNode;
          try {
            ys(c, "");
          } catch (he) {
            Ge(e, e.return, he);
          }
        }
        l & 4 && e.stateNode != null && (c = e.memoizedProps, Qc(
          e,
          c,
          n !== null ? n.memoizedProps : c
        )), l & 1024 && (Jc = !0);
        break;
      case 6:
        if (qt(t, e), Yt(e), l & 4) {
          if (e.stateNode === null)
            throw Error(o(162));
          l = e.memoizedProps, n = e.stateNode;
          try {
            n.nodeValue = l;
          } catch (he) {
            Ge(e, e.return, he);
          }
        }
        break;
      case 3:
        if (wr = null, c = yn, yn = xr(t.containerInfo), qt(t, e), yn = c, Yt(e), l & 4 && n !== null && n.memoizedState.isDehydrated)
          try {
            Ws(t.containerInfo);
          } catch (he) {
            Ge(e, e.return, he);
          }
        Jc && (Jc = !1, gm(e));
        break;
      case 4:
        l = yn, yn = xr(
          e.stateNode.containerInfo
        ), qt(t, e), Yt(e), yn = l;
        break;
      case 12:
        qt(t, e), Yt(e);
        break;
      case 31:
        qt(t, e), Yt(e), l & 4 && (l = e.updateQueue, l !== null && (e.updateQueue = null, ir(e, l)));
        break;
      case 13:
        qt(t, e), Yt(e), e.child.flags & 8192 && e.memoizedState !== null != (n !== null && n.memoizedState !== null) && (or = it()), l & 4 && (l = e.updateQueue, l !== null && (e.updateQueue = null, ir(e, l)));
        break;
      case 22:
        c = e.memoizedState !== null;
        var R = n !== null && n.memoizedState !== null, U = Xn, X = ht;
        if (Xn = U || c, ht = X || R, qt(t, e), ht = X, Xn = U, Yt(e), l & 8192)
          e: for (t = e.stateNode, t._visibility = c ? t._visibility & -2 : t._visibility | 1, c && (n === null || R || Xn || ht || ss(e)), n = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (n === null) {
                R = n = t;
                try {
                  if (u = R.stateNode, c)
                    _ = u.style, typeof _.setProperty == "function" ? _.setProperty("display", "none", "important") : _.display = "none";
                  else {
                    w = R.stateNode;
                    var W = R.memoizedProps.style, B = W != null && W.hasOwnProperty("display") ? W.display : null;
                    w.style.display = B == null || typeof B == "boolean" ? "" : ("" + B).trim();
                  }
                } catch (he) {
                  Ge(R, R.return, he);
                }
              }
            } else if (t.tag === 6) {
              if (n === null) {
                R = t;
                try {
                  R.stateNode.nodeValue = c ? "" : R.memoizedProps;
                } catch (he) {
                  Ge(R, R.return, he);
                }
              }
            } else if (t.tag === 18) {
              if (n === null) {
                R = t;
                try {
                  var V = R.stateNode;
                  c ? rp(V, !0) : rp(R.stateNode, !1);
                } catch (he) {
                  Ge(R, R.return, he);
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
        l & 4 && (l = e.updateQueue, l !== null && (n = l.retryQueue, n !== null && (l.retryQueue = null, ir(e, n))));
        break;
      case 19:
        qt(t, e), Yt(e), l & 4 && (l = e.updateQueue, l !== null && (e.updateQueue = null, ir(e, l)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        qt(t, e), Yt(e);
    }
  }
  function Yt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var n, l = e.return; l !== null; ) {
          if (cm(l)) {
            n = l;
            break;
          }
          l = l.return;
        }
        if (n == null) throw Error(o(160));
        switch (n.tag) {
          case 27:
            var c = n.stateNode, u = Zc(e);
            lr(e, u, c);
            break;
          case 5:
            var _ = n.stateNode;
            n.flags & 32 && (ys(_, ""), n.flags &= -33);
            var w = Zc(e);
            lr(e, w, _);
            break;
          case 3:
          case 4:
            var R = n.stateNode.containerInfo, U = Zc(e);
            Kc(
              e,
              U,
              R
            );
            break;
          default:
            throw Error(o(161));
        }
      } catch (X) {
        Ge(e, e.return, X);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function gm(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        gm(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
  }
  function Zn(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        hm(e, t.alternate, t), t = t.sibling;
  }
  function ss(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          _a(4, t, t.return), ss(t);
          break;
        case 1:
          En(t, t.return);
          var n = t.stateNode;
          typeof n.componentWillUnmount == "function" && rm(
            t,
            t.return,
            n
          ), ss(t);
          break;
        case 27:
          Zl(t.stateNode);
        case 26:
        case 5:
          En(t, t.return), ss(t);
          break;
        case 22:
          t.memoizedState === null && ss(t);
          break;
        case 30:
          ss(t);
          break;
        default:
          ss(t);
      }
      e = e.sibling;
    }
  }
  function Kn(e, t, n) {
    for (n = n && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var l = t.alternate, c = e, u = t, _ = u.flags;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          Kn(
            c,
            u,
            n
          ), $l(4, u);
          break;
        case 1:
          if (Kn(
            c,
            u,
            n
          ), l = u, c = l.stateNode, typeof c.componentDidMount == "function")
            try {
              c.componentDidMount();
            } catch (U) {
              Ge(l, l.return, U);
            }
          if (l = u, c = l.updateQueue, c !== null) {
            var w = l.stateNode;
            try {
              var R = c.shared.hiddenCallbacks;
              if (R !== null)
                for (c.shared.hiddenCallbacks = null, c = 0; c < R.length; c++)
                  Zh(R[c], w);
            } catch (U) {
              Ge(l, l.return, U);
            }
          }
          n && _ & 64 && im(u), Ul(u, u.return);
          break;
        case 27:
          um(u);
        case 26:
        case 5:
          Kn(
            c,
            u,
            n
          ), n && l === null && _ & 4 && om(u), Ul(u, u.return);
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
          ), n && _ & 4 && pm(c, u);
          break;
        case 13:
          Kn(
            c,
            u,
            n
          ), n && _ & 4 && _m(c, u);
          break;
        case 22:
          u.memoizedState === null && Kn(
            c,
            u,
            n
          ), Ul(u, u.return);
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
  function Pc(e, t) {
    var n = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && kl(n));
  }
  function Wc(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && kl(e));
  }
  function wn(e, t, n, l) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        vm(
          e,
          t,
          n,
          l
        ), t = t.sibling;
  }
  function vm(e, t, n, l) {
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
        ), c & 2048 && $l(9, t);
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
        ), c & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && kl(e)));
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
            var u = t.memoizedProps, _ = u.id, w = u.onPostCommit;
            typeof w == "function" && w(
              _,
              t.alternate === null ? "mount" : "update",
              e.passiveEffectDuration,
              -0
            );
          } catch (R) {
            Ge(t, t.return, R);
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
        u = t.stateNode, _ = t.alternate, t.memoizedState !== null ? u._visibility & 2 ? wn(
          e,
          t,
          n,
          l
        ) : Bl(e, t) : u._visibility & 2 ? wn(
          e,
          t,
          n,
          l
        ) : (u._visibility |= 2, Fs(
          e,
          t,
          n,
          l,
          (t.subtreeFlags & 10256) !== 0 || !1
        )), c & 2048 && Pc(_, t);
        break;
      case 24:
        wn(
          e,
          t,
          n,
          l
        ), c & 2048 && Wc(t.alternate, t);
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
  function Fs(e, t, n, l, c) {
    for (c = c && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var u = e, _ = t, w = n, R = l, U = _.flags;
      switch (_.tag) {
        case 0:
        case 11:
        case 15:
          Fs(
            u,
            _,
            w,
            R,
            c
          ), $l(8, _);
          break;
        case 23:
          break;
        case 22:
          var X = _.stateNode;
          _.memoizedState !== null ? X._visibility & 2 ? Fs(
            u,
            _,
            w,
            R,
            c
          ) : Bl(
            u,
            _
          ) : (X._visibility |= 2, Fs(
            u,
            _,
            w,
            R,
            c
          )), c && U & 2048 && Pc(
            _.alternate,
            _
          );
          break;
        case 24:
          Fs(
            u,
            _,
            w,
            R,
            c
          ), c && U & 2048 && Wc(_.alternate, _);
          break;
        default:
          Fs(
            u,
            _,
            w,
            R,
            c
          );
      }
      t = t.sibling;
    }
  }
  function Bl(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var n = e, l = t, c = l.flags;
        switch (l.tag) {
          case 22:
            Bl(n, l), c & 2048 && Pc(
              l.alternate,
              l
            );
            break;
          case 24:
            Bl(n, l), c & 2048 && Wc(l.alternate, l);
            break;
          default:
            Bl(n, l);
        }
        t = t.sibling;
      }
  }
  var Fl = 8192;
  function Gs(e, t, n) {
    if (e.subtreeFlags & Fl)
      for (e = e.child; e !== null; )
        xm(
          e,
          t,
          n
        ), e = e.sibling;
  }
  function xm(e, t, n) {
    switch (e.tag) {
      case 26:
        Gs(
          e,
          t,
          n
        ), e.flags & Fl && e.memoizedState !== null && tx(
          n,
          yn,
          e.memoizedState,
          e.memoizedProps
        );
        break;
      case 5:
        Gs(
          e,
          t,
          n
        );
        break;
      case 3:
      case 4:
        var l = yn;
        yn = xr(e.stateNode.containerInfo), Gs(
          e,
          t,
          n
        ), yn = l;
        break;
      case 22:
        e.memoizedState === null && (l = e.alternate, l !== null && l.memoizedState !== null ? (l = Fl, Fl = 16777216, Gs(
          e,
          t,
          n
        ), Fl = l) : Gs(
          e,
          t,
          n
        ));
        break;
      default:
        Gs(
          e,
          t,
          n
        );
    }
  }
  function ym(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function Gl(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var l = t[n];
          gt = l, jm(
            l,
            e
          );
        }
      ym(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        wm(e), e = e.sibling;
  }
  function wm(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        Gl(e), e.flags & 2048 && _a(9, e, e.return);
        break;
      case 3:
        Gl(e);
        break;
      case 12:
        Gl(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, rr(e)) : Gl(e);
        break;
      default:
        Gl(e);
    }
  }
  function rr(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var l = t[n];
          gt = l, jm(
            l,
            e
          );
        }
      ym(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          _a(8, t, t.return), rr(t);
          break;
        case 22:
          n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, rr(t));
          break;
        default:
          rr(t);
      }
      e = e.sibling;
    }
  }
  function jm(e, t) {
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
          kl(n.memoizedState.cache);
      }
      if (l = n.child, l !== null) l.return = n, gt = l;
      else
        e: for (n = e; gt !== null; ) {
          l = gt;
          var c = l.sibling, u = l.return;
          if (fm(l), l === n) {
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
  var _v = {
    getCacheForType: function(e) {
      var t = jt(ct), n = t.data.get(e);
      return n === void 0 && (n = e(), t.data.set(e, n)), n;
    },
    cacheSignal: function() {
      return jt(ct).controller.signal;
    }
  }, bv = typeof WeakMap == "function" ? WeakMap : Map, Ue = 0, Ze = null, Ce = null, Me = 0, Fe = 0, tn = null, ba = !1, Vs = !1, Ic = !1, Jn = 0, lt = 0, ga = 0, ls = 0, eu = 0, nn = 0, qs = 0, Vl = null, Xt = null, tu = !1, or = 0, Sm = 0, cr = 1 / 0, ur = null, va = null, _t = 0, xa = null, Ys = null, Pn = 0, nu = 0, au = null, km = null, ql = 0, su = null;
  function an() {
    return (Ue & 2) !== 0 && Me !== 0 ? Me & -Me : S.T !== null ? uu() : Bd();
  }
  function Nm() {
    if (nn === 0)
      if ((Me & 536870912) === 0 || Ae) {
        var e = gi;
        gi <<= 1, (gi & 3932160) === 0 && (gi = 262144), nn = e;
      } else nn = 536870912;
    return e = It.current, e !== null && (e.flags |= 32), nn;
  }
  function Qt(e, t, n) {
    (e === Ze && (Fe === 2 || Fe === 9) || e.cancelPendingCommit !== null) && (Xs(e, 0), ya(
      e,
      Me,
      nn,
      !1
    )), dl(e, n), ((Ue & 2) === 0 || e !== Ze) && (e === Ze && ((Ue & 2) === 0 && (ls |= n), lt === 4 && ya(
      e,
      Me,
      nn,
      !1
    )), Tn(e));
  }
  function Cm(e, t, n) {
    if ((Ue & 6) !== 0) throw Error(o(327));
    var l = !n && (t & 127) === 0 && (t & e.expiredLanes) === 0 || ul(e, t), c = l ? xv(e, t) : iu(e, t, !0), u = l;
    do {
      if (c === 0) {
        Vs && !l && ya(e, t, 0, !1);
        break;
      } else {
        if (n = e.current.alternate, u && !gv(n)) {
          c = iu(e, t, !1), u = !1;
          continue;
        }
        if (c === 2) {
          if (u = t, e.errorRecoveryDisabledLanes & u)
            var _ = 0;
          else
            _ = e.pendingLanes & -536870913, _ = _ !== 0 ? _ : _ & 536870912 ? 536870912 : 0;
          if (_ !== 0) {
            t = _;
            e: {
              var w = e;
              c = Vl;
              var R = w.current.memoizedState.isDehydrated;
              if (R && (Xs(w, _).flags |= 256), _ = iu(
                w,
                _,
                !1
              ), _ !== 2) {
                if (Ic && !R) {
                  w.errorRecoveryDisabledLanes |= u, ls |= u, c = 4;
                  break e;
                }
                u = Xt, Xt = c, u !== null && (Xt === null ? Xt = u : Xt.push.apply(
                  Xt,
                  u
                ));
              }
              c = _;
            }
            if (u = !1, c !== 2) continue;
          }
        }
        if (c === 1) {
          Xs(e, 0), ya(e, t, 0, !0);
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
                nn,
                !ba
              );
              break e;
            case 2:
              Xt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(o(329));
          }
          if ((t & 62914560) === t && (c = or + 300 - it(), 10 < c)) {
            if (ya(
              l,
              t,
              nn,
              !ba
            ), xi(l, 0, !0) !== 0) break e;
            Pn = t, l.timeoutHandle = sp(
              Em.bind(
                null,
                l,
                n,
                Xt,
                ur,
                tu,
                t,
                nn,
                ls,
                qs,
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
          Em(
            l,
            n,
            Xt,
            ur,
            tu,
            t,
            nn,
            ls,
            qs,
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
  function Em(e, t, n, l, c, u, _, w, R, U, X, W, B, V) {
    if (e.timeoutHandle = -1, W = t.subtreeFlags, W & 8192 || (W & 16785408) === 16785408) {
      W = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: Hn
      }, xm(
        t,
        u,
        W
      );
      var he = (u & 62914560) === u ? or - it() : (u & 4194048) === u ? Sm - it() : 0;
      if (he = nx(
        W,
        he
      ), he !== null) {
        Pn = u, e.cancelPendingCommit = he(
          Hm.bind(
            null,
            e,
            t,
            u,
            n,
            l,
            c,
            _,
            w,
            R,
            X,
            W,
            null,
            B,
            V
          )
        ), ya(e, u, _, !U);
        return;
      }
    }
    Hm(
      e,
      t,
      u,
      n,
      l,
      c,
      _,
      w,
      R
    );
  }
  function gv(e) {
    for (var t = e; ; ) {
      var n = t.tag;
      if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null)))
        for (var l = 0; l < n.length; l++) {
          var c = n[l], u = c.getSnapshot;
          c = c.value;
          try {
            if (!Pt(u(), c)) return !1;
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
    t &= ~eu, t &= ~ls, e.suspendedLanes |= t, e.pingedLanes &= ~t, l && (e.warmLanes |= t), l = e.expirationTimes;
    for (var c = t; 0 < c; ) {
      var u = 31 - Et(c), _ = 1 << u;
      l[u] = -1, c &= ~_;
    }
    n !== 0 && Ld(e, n, t);
  }
  function dr() {
    return (Ue & 6) === 0 ? (Yl(0), !1) : !0;
  }
  function lu() {
    if (Ce !== null) {
      if (Fe === 0)
        var e = Ce.return;
      else
        e = Ce, Bn = Ja = null, yc(e), Hs = null, Cl = 0, e = Ce;
      for (; e !== null; )
        lm(e.alternate, e), e = e.return;
      Ce = null;
    }
  }
  function Xs(e, t) {
    var n = e.timeoutHandle;
    n !== -1 && (e.timeoutHandle = -1, $v(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), Pn = 0, lu(), Ze = e, Ce = n = $n(e.current, null), Me = t, Fe = 0, tn = null, ba = !1, Vs = ul(e, t), Ic = !1, qs = nn = eu = ls = ga = lt = 0, Xt = Vl = null, tu = !1, (t & 8) !== 0 && (t |= t & 32);
    var l = e.entangledLanes;
    if (l !== 0)
      for (e = e.entanglements, l &= t; 0 < l; ) {
        var c = 31 - Et(l), u = 1 << c;
        t |= e[c], l &= ~u;
      }
    return Jn = t, Ai(), n;
  }
  function Tm(e, t) {
    Se = null, S.H = Ol, t === Os || t === Bi ? (t = qh(), Fe = 3) : t === cc ? (t = qh(), Fe = 4) : Fe = t === Lc ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, tn = t, Ce === null && (lt = 1, er(
      e,
      dn(t, e.current)
    ));
  }
  function Mm() {
    var e = It.current;
    return e === null ? !0 : (Me & 4194048) === Me ? pn === null : (Me & 62914560) === Me || (Me & 536870912) !== 0 ? e === pn : !1;
  }
  function Rm() {
    var e = S.H;
    return S.H = Ol, e === null ? Ol : e;
  }
  function Am() {
    var e = S.A;
    return S.A = _v, e;
  }
  function hr() {
    lt = 4, ba || (Me & 4194048) !== Me && It.current !== null || (Vs = !0), (ga & 134217727) === 0 && (ls & 134217727) === 0 || Ze === null || ya(
      Ze,
      Me,
      nn,
      !1
    );
  }
  function iu(e, t, n) {
    var l = Ue;
    Ue |= 2;
    var c = Rm(), u = Am();
    (Ze !== e || Me !== t) && (ur = null, Xs(e, t)), t = !1;
    var _ = lt;
    e: do
      try {
        if (Fe !== 0 && Ce !== null) {
          var w = Ce, R = tn;
          switch (Fe) {
            case 8:
              lu(), _ = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              It.current === null && (t = !0);
              var U = Fe;
              if (Fe = 0, tn = null, Qs(e, w, R, U), n && Vs) {
                _ = 0;
                break e;
              }
              break;
            default:
              U = Fe, Fe = 0, tn = null, Qs(e, w, R, U);
          }
        }
        vv(), _ = lt;
        break;
      } catch (X) {
        Tm(e, X);
      }
    while (!0);
    return t && e.shellSuspendCounter++, Bn = Ja = null, Ue = l, S.H = c, S.A = u, Ce === null && (Ze = null, Me = 0, Ai()), _;
  }
  function vv() {
    for (; Ce !== null; ) zm(Ce);
  }
  function xv(e, t) {
    var n = Ue;
    Ue |= 2;
    var l = Rm(), c = Am();
    Ze !== e || Me !== t ? (ur = null, cr = it() + 500, Xs(e, t)) : Vs = ul(
      e,
      t
    );
    e: do
      try {
        if (Fe !== 0 && Ce !== null) {
          t = Ce;
          var u = tn;
          t: switch (Fe) {
            case 1:
              Fe = 0, tn = null, Qs(e, t, u, 1);
              break;
            case 2:
            case 9:
              if (Gh(u)) {
                Fe = 0, tn = null, Dm(t);
                break;
              }
              t = function() {
                Fe !== 2 && Fe !== 9 || Ze !== e || (Fe = 7), Tn(e);
              }, u.then(t, t);
              break e;
            case 3:
              Fe = 7;
              break e;
            case 4:
              Fe = 5;
              break e;
            case 7:
              Gh(u) ? (Fe = 0, tn = null, Dm(t)) : (Fe = 0, tn = null, Qs(e, t, u, 7));
              break;
            case 5:
              var _ = null;
              switch (Ce.tag) {
                case 26:
                  _ = Ce.memoizedState;
                case 5:
                case 27:
                  var w = Ce;
                  if (_ ? vp(_) : w.stateNode.complete) {
                    Fe = 0, tn = null;
                    var R = w.sibling;
                    if (R !== null) Ce = R;
                    else {
                      var U = w.return;
                      U !== null ? (Ce = U, fr(U)) : Ce = null;
                    }
                    break t;
                  }
              }
              Fe = 0, tn = null, Qs(e, t, u, 5);
              break;
            case 6:
              Fe = 0, tn = null, Qs(e, t, u, 6);
              break;
            case 8:
              lu(), lt = 6;
              break e;
            default:
              throw Error(o(462));
          }
        }
        yv();
        break;
      } catch (X) {
        Tm(e, X);
      }
    while (!0);
    return Bn = Ja = null, S.H = l, S.A = c, Ue = n, Ce !== null ? 0 : (Ze = null, Me = 0, Ai(), lt);
  }
  function yv() {
    for (; Ce !== null && !rn(); )
      zm(Ce);
  }
  function zm(e) {
    var t = am(e.alternate, e, Jn);
    e.memoizedProps = e.pendingProps, t === null ? fr(e) : Ce = t;
  }
  function Dm(e) {
    var t = e, n = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = Pf(
          n,
          t,
          t.pendingProps,
          t.type,
          void 0,
          Me
        );
        break;
      case 11:
        t = Pf(
          n,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          Me
        );
        break;
      case 5:
        yc(t);
      default:
        lm(n, t), t = Ce = Rh(t, Jn), t = am(n, t, Jn);
    }
    e.memoizedProps = e.pendingProps, t === null ? fr(e) : Ce = t;
  }
  function Qs(e, t, n, l) {
    Bn = Ja = null, yc(t), Hs = null, Cl = 0;
    var c = t.return;
    try {
      if (cv(
        e,
        c,
        t,
        n,
        Me
      )) {
        lt = 1, er(
          e,
          dn(n, e.current)
        ), Ce = null;
        return;
      }
    } catch (u) {
      if (c !== null) throw Ce = c, u;
      lt = 1, er(
        e,
        dn(n, e.current)
      ), Ce = null;
      return;
    }
    t.flags & 32768 ? (Ae || l === 1 ? e = !0 : Vs || (Me & 536870912) !== 0 ? e = !1 : (ba = e = !0, (l === 2 || l === 9 || l === 3 || l === 6) && (l = It.current, l !== null && l.tag === 13 && (l.flags |= 16384))), Om(t, e)) : fr(t);
  }
  function fr(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        Om(
          t,
          ba
        );
        return;
      }
      e = t.return;
      var n = hv(
        t.alternate,
        t,
        Jn
      );
      if (n !== null) {
        Ce = n;
        return;
      }
      if (t = t.sibling, t !== null) {
        Ce = t;
        return;
      }
      Ce = t = e;
    } while (t !== null);
    lt === 0 && (lt = 5);
  }
  function Om(e, t) {
    do {
      var n = fv(e.alternate, e);
      if (n !== null) {
        n.flags &= 32767, Ce = n;
        return;
      }
      if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
        Ce = e;
        return;
      }
      Ce = e = n;
    } while (e !== null);
    lt = 6, Ce = null;
  }
  function Hm(e, t, n, l, c, u, _, w, R) {
    e.cancelPendingCommit = null;
    do
      mr();
    while (_t !== 0);
    if ((Ue & 6) !== 0) throw Error(o(327));
    if (t !== null) {
      if (t === e.current) throw Error(o(177));
      if (u = t.lanes | t.childLanes, u |= Zo, eg(
        e,
        n,
        u,
        _,
        w,
        R
      ), e === Ze && (Ce = Ze = null, Me = 0), Ys = t, xa = e, Pn = n, nu = u, au = c, km = l, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, kv(fs, function() {
        return Fm(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), l = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || l) {
        l = S.T, S.T = null, c = z.p, z.p = 2, _ = Ue, Ue |= 4;
        try {
          mv(e, t, n);
        } finally {
          Ue = _, z.p = c, S.T = l;
        }
      }
      _t = 1, Lm(), $m(), Um();
    }
  }
  function Lm() {
    if (_t === 1) {
      _t = 0;
      var e = xa, t = Ys, n = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || n) {
        n = S.T, S.T = null;
        var l = z.p;
        z.p = 2;
        var c = Ue;
        Ue |= 4;
        try {
          bm(t, e);
          var u = gu, _ = wh(e.containerInfo), w = u.focusedElem, R = u.selectionRange;
          if (_ !== w && w && w.ownerDocument && yh(
            w.ownerDocument.documentElement,
            w
          )) {
            if (R !== null && Vo(w)) {
              var U = R.start, X = R.end;
              if (X === void 0 && (X = U), "selectionStart" in w)
                w.selectionStart = U, w.selectionEnd = Math.min(
                  X,
                  w.value.length
                );
              else {
                var W = w.ownerDocument || document, B = W && W.defaultView || window;
                if (B.getSelection) {
                  var V = B.getSelection(), he = w.textContent.length, ye = Math.min(R.start, he), Xe = R.end === void 0 ? ye : Math.min(R.end, he);
                  !V.extend && ye > Xe && (_ = Xe, Xe = ye, ye = _);
                  var D = xh(
                    w,
                    ye
                  ), A = xh(
                    w,
                    Xe
                  );
                  if (D && A && (V.rangeCount !== 1 || V.anchorNode !== D.node || V.anchorOffset !== D.offset || V.focusNode !== A.node || V.focusOffset !== A.offset)) {
                    var $ = W.createRange();
                    $.setStart(D.node, D.offset), V.removeAllRanges(), ye > Xe ? (V.addRange($), V.extend(A.node, A.offset)) : ($.setEnd(A.node, A.offset), V.addRange($));
                  }
                }
              }
            }
            for (W = [], V = w; V = V.parentNode; )
              V.nodeType === 1 && W.push({
                element: V,
                left: V.scrollLeft,
                top: V.scrollTop
              });
            for (typeof w.focus == "function" && w.focus(), w = 0; w < W.length; w++) {
              var J = W[w];
              J.element.scrollLeft = J.left, J.element.scrollTop = J.top;
            }
          }
          Nr = !!bu, gu = bu = null;
        } finally {
          Ue = c, z.p = l, S.T = n;
        }
      }
      e.current = t, _t = 2;
    }
  }
  function $m() {
    if (_t === 2) {
      _t = 0;
      var e = xa, t = Ys, n = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || n) {
        n = S.T, S.T = null;
        var l = z.p;
        z.p = 2;
        var c = Ue;
        Ue |= 4;
        try {
          hm(e, t.alternate, t);
        } finally {
          Ue = c, z.p = l, S.T = n;
        }
      }
      _t = 3;
    }
  }
  function Um() {
    if (_t === 4 || _t === 3) {
      _t = 0, Jt();
      var e = xa, t = Ys, n = Pn, l = km;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? _t = 5 : (_t = 0, Ys = xa = null, Bm(e, e.pendingLanes));
      var c = e.pendingLanes;
      if (c === 0 && (va = null), So(n), t = t.stateNode, Dt && typeof Dt.onCommitFiberRoot == "function")
        try {
          Dt.onCommitFiberRoot(
            Fa,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (l !== null) {
        t = S.T, c = z.p, z.p = 2, S.T = null;
        try {
          for (var u = e.onRecoverableError, _ = 0; _ < l.length; _++) {
            var w = l[_];
            u(w.value, {
              componentStack: w.stack
            });
          }
        } finally {
          S.T = t, z.p = c;
        }
      }
      (Pn & 3) !== 0 && mr(), Tn(e), c = e.pendingLanes, (n & 261930) !== 0 && (c & 42) !== 0 ? e === su ? ql++ : (ql = 0, su = e) : ql = 0, Yl(0);
    }
  }
  function Bm(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, kl(t)));
  }
  function mr() {
    return Lm(), $m(), Um(), Fm();
  }
  function Fm() {
    if (_t !== 5) return !1;
    var e = xa, t = nu;
    nu = 0;
    var n = So(Pn), l = S.T, c = z.p;
    try {
      z.p = 32 > n ? 32 : n, S.T = null, n = au, au = null;
      var u = xa, _ = Pn;
      if (_t = 0, Ys = xa = null, Pn = 0, (Ue & 6) !== 0) throw Error(o(331));
      var w = Ue;
      if (Ue |= 4, wm(u.current), vm(
        u,
        u.current,
        _,
        n
      ), Ue = w, Yl(0, !1), Dt && typeof Dt.onPostCommitFiberRoot == "function")
        try {
          Dt.onPostCommitFiberRoot(Fa, u);
        } catch {
        }
      return !0;
    } finally {
      z.p = c, S.T = l, Bm(e, t);
    }
  }
  function Gm(e, t, n) {
    t = dn(n, t), t = Hc(e.stateNode, t, 2), e = fa(e, t, 2), e !== null && (dl(e, 2), Tn(e));
  }
  function Ge(e, t, n) {
    if (e.tag === 3)
      Gm(e, e, n);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Gm(
            t,
            e,
            n
          );
          break;
        } else if (t.tag === 1) {
          var l = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof l.componentDidCatch == "function" && (va === null || !va.has(l))) {
            e = dn(n, e), n = Vf(2), l = fa(t, n, 2), l !== null && (qf(
              n,
              l,
              t,
              e
            ), dl(l, 2), Tn(l));
            break;
          }
        }
        t = t.return;
      }
  }
  function ru(e, t, n) {
    var l = e.pingCache;
    if (l === null) {
      l = e.pingCache = new bv();
      var c = /* @__PURE__ */ new Set();
      l.set(t, c);
    } else
      c = l.get(t), c === void 0 && (c = /* @__PURE__ */ new Set(), l.set(t, c));
    c.has(n) || (Ic = !0, c.add(n), e = wv.bind(null, e, t, n), t.then(e, e));
  }
  function wv(e, t, n) {
    var l = e.pingCache;
    l !== null && l.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, Ze === e && (Me & n) === n && (lt === 4 || lt === 3 && (Me & 62914560) === Me && 300 > it() - or ? (Ue & 2) === 0 && Xs(e, 0) : eu |= n, qs === Me && (qs = 0)), Tn(e);
  }
  function Vm(e, t) {
    t === 0 && (t = Hd()), e = Qa(e, t), e !== null && (dl(e, t), Tn(e));
  }
  function jv(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), Vm(e, n);
  }
  function Sv(e, t) {
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
    l !== null && l.delete(t), Vm(e, n);
  }
  function kv(e, t) {
    return Ut(e, t);
  }
  var pr = null, Zs = null, ou = !1, _r = !1, cu = !1, wa = 0;
  function Tn(e) {
    e !== Zs && e.next === null && (Zs === null ? pr = Zs = e : Zs = Zs.next = e), _r = !0, ou || (ou = !0, Cv());
  }
  function Yl(e, t) {
    if (!cu && _r) {
      cu = !0;
      do
        for (var n = !1, l = pr; l !== null; ) {
          if (e !== 0) {
            var c = l.pendingLanes;
            if (c === 0) var u = 0;
            else {
              var _ = l.suspendedLanes, w = l.pingedLanes;
              u = (1 << 31 - Et(42 | e) + 1) - 1, u &= c & ~(_ & ~w), u = u & 201326741 ? u & 201326741 | 1 : u ? u | 2 : 0;
            }
            u !== 0 && (n = !0, Qm(l, u));
          } else
            u = Me, u = xi(
              l,
              l === Ze ? u : 0,
              l.cancelPendingCommit !== null || l.timeoutHandle !== -1
            ), (u & 3) === 0 || ul(l, u) || (n = !0, Qm(l, u));
          l = l.next;
        }
      while (n);
      cu = !1;
    }
  }
  function Nv() {
    qm();
  }
  function qm() {
    _r = ou = !1;
    var e = 0;
    wa !== 0 && Lv() && (e = wa);
    for (var t = it(), n = null, l = pr; l !== null; ) {
      var c = l.next, u = Ym(l, t);
      u === 0 ? (l.next = null, n === null ? pr = c : n.next = c, c === null && (Zs = n)) : (n = l, (e !== 0 || (u & 3) !== 0) && (_r = !0)), l = c;
    }
    _t !== 0 && _t !== 5 || Yl(e), wa !== 0 && (wa = 0);
  }
  function Ym(e, t) {
    for (var n = e.suspendedLanes, l = e.pingedLanes, c = e.expirationTimes, u = e.pendingLanes & -62914561; 0 < u; ) {
      var _ = 31 - Et(u), w = 1 << _, R = c[_];
      R === -1 ? ((w & n) === 0 || (w & l) !== 0) && (c[_] = Ib(w, t)) : R <= t && (e.expiredLanes |= w), u &= ~w;
    }
    if (t = Ze, n = Me, n = xi(
      e,
      e === t ? n : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), l = e.callbackNode, n === 0 || e === t && (Fe === 2 || Fe === 9) || e.cancelPendingCommit !== null)
      return l !== null && l !== null && Bt(l), e.callbackNode = null, e.callbackPriority = 0;
    if ((n & 3) === 0 || ul(e, n)) {
      if (t = n & -n, t === e.callbackPriority) return t;
      switch (l !== null && Bt(l), So(n)) {
        case 2:
        case 8:
          n = hs;
          break;
        case 32:
          n = fs;
          break;
        case 268435456:
          n = bi;
          break;
        default:
          n = fs;
      }
      return l = Xm.bind(null, e), n = Ut(n, l), e.callbackPriority = t, e.callbackNode = n, t;
    }
    return l !== null && l !== null && Bt(l), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function Xm(e, t) {
    if (_t !== 0 && _t !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var n = e.callbackNode;
    if (mr() && e.callbackNode !== n)
      return null;
    var l = Me;
    return l = xi(
      e,
      e === Ze ? l : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), l === 0 ? null : (Cm(e, l, t), Ym(e, it()), e.callbackNode != null && e.callbackNode === n ? Xm.bind(null, e) : null);
  }
  function Qm(e, t) {
    if (mr()) return null;
    Cm(e, t, !0);
  }
  function Cv() {
    Uv(function() {
      (Ue & 6) !== 0 ? Ut(
        ze,
        Nv
      ) : qm();
    });
  }
  function uu() {
    if (wa === 0) {
      var e = zs;
      e === 0 && (e = ms, ms <<= 1, (ms & 261888) === 0 && (ms = 256)), wa = e;
    }
    return wa;
  }
  function Zm(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Si("" + e);
  }
  function Km(e, t) {
    var n = t.ownerDocument.createElement("input");
    return n.name = t.name, n.value = t.value, e.id && n.setAttribute("form", e.id), t.parentNode.insertBefore(n, t), e = new FormData(e), n.parentNode.removeChild(n), e;
  }
  function Ev(e, t, n, l, c) {
    if (t === "submit" && n && n.stateNode === c) {
      var u = Zm(
        (c[Ft] || null).action
      ), _ = l.submitter;
      _ && (t = (t = _[Ft] || null) ? Zm(t.formAction) : _.getAttribute("formAction"), t !== null && (u = t, _ = null));
      var w = new Ei(
        "action",
        "action",
        null,
        l,
        c
      );
      e.push({
        event: w,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (l.defaultPrevented) {
                if (wa !== 0) {
                  var R = _ ? Km(c, _) : new FormData(c);
                  Mc(
                    n,
                    {
                      pending: !0,
                      data: R,
                      method: c.method,
                      action: u
                    },
                    null,
                    R
                  );
                }
              } else
                typeof u == "function" && (w.preventDefault(), R = _ ? Km(c, _) : new FormData(c), Mc(
                  n,
                  {
                    pending: !0,
                    data: R,
                    method: c.method,
                    action: u
                  },
                  u,
                  R
                ));
            },
            currentTarget: c
          }
        ]
      });
    }
  }
  for (var du = 0; du < Qo.length; du++) {
    var hu = Qo[du], Tv = hu.toLowerCase(), Mv = hu[0].toUpperCase() + hu.slice(1);
    xn(
      Tv,
      "on" + Mv
    );
  }
  xn(kh, "onAnimationEnd"), xn(Nh, "onAnimationIteration"), xn(Ch, "onAnimationStart"), xn("dblclick", "onDoubleClick"), xn("focusin", "onFocus"), xn("focusout", "onBlur"), xn(Xg, "onTransitionRun"), xn(Qg, "onTransitionStart"), xn(Zg, "onTransitionCancel"), xn(Eh, "onTransitionEnd"), vs("onMouseEnter", ["mouseout", "mouseover"]), vs("onMouseLeave", ["mouseout", "mouseover"]), vs("onPointerEnter", ["pointerout", "pointerover"]), vs("onPointerLeave", ["pointerout", "pointerover"]), Va(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), Va(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), Va("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), Va(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), Va(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), Va(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var Xl = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), Rv = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Xl)
  );
  function Jm(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var l = e[n], c = l.event;
      l = l.listeners;
      e: {
        var u = void 0;
        if (t)
          for (var _ = l.length - 1; 0 <= _; _--) {
            var w = l[_], R = w.instance, U = w.currentTarget;
            if (w = w.listener, R !== u && c.isPropagationStopped())
              break e;
            u = w, c.currentTarget = U;
            try {
              u(c);
            } catch (X) {
              Ri(X);
            }
            c.currentTarget = null, u = R;
          }
        else
          for (_ = 0; _ < l.length; _++) {
            if (w = l[_], R = w.instance, U = w.currentTarget, w = w.listener, R !== u && c.isPropagationStopped())
              break e;
            u = w, c.currentTarget = U;
            try {
              u(c);
            } catch (X) {
              Ri(X);
            }
            c.currentTarget = null, u = R;
          }
      }
    }
  }
  function Ee(e, t) {
    var n = t[ko];
    n === void 0 && (n = t[ko] = /* @__PURE__ */ new Set());
    var l = e + "__bubble";
    n.has(l) || (Pm(t, e, 2, !1), n.add(l));
  }
  function fu(e, t, n) {
    var l = 0;
    t && (l |= 4), Pm(
      n,
      e,
      l,
      t
    );
  }
  var br = "_reactListening" + Math.random().toString(36).slice(2);
  function mu(e) {
    if (!e[br]) {
      e[br] = !0, Vd.forEach(function(n) {
        n !== "selectionchange" && (Rv.has(n) || fu(n, !1, e), fu(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[br] || (t[br] = !0, fu("selectionchange", !1, t));
    }
  }
  function Pm(e, t, n, l) {
    switch (Np(t)) {
      case 2:
        var c = lx;
        break;
      case 8:
        c = ix;
        break;
      default:
        c = Tu;
    }
    n = c.bind(
      null,
      t,
      n,
      e
    ), c = void 0, !Do || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (c = !0), l ? c !== void 0 ? e.addEventListener(t, n, {
      capture: !0,
      passive: c
    }) : e.addEventListener(t, n, !0) : c !== void 0 ? e.addEventListener(t, n, {
      passive: c
    }) : e.addEventListener(t, n, !1);
  }
  function pu(e, t, n, l, c) {
    var u = l;
    if ((t & 1) === 0 && (t & 2) === 0 && l !== null)
      e: for (; ; ) {
        if (l === null) return;
        var _ = l.tag;
        if (_ === 3 || _ === 4) {
          var w = l.stateNode.containerInfo;
          if (w === c) break;
          if (_ === 4)
            for (_ = l.return; _ !== null; ) {
              var R = _.tag;
              if ((R === 3 || R === 4) && _.stateNode.containerInfo === c)
                return;
              _ = _.return;
            }
          for (; w !== null; ) {
            if (_ = _s(w), _ === null) return;
            if (R = _.tag, R === 5 || R === 6 || R === 26 || R === 27) {
              l = u = _;
              continue e;
            }
            w = w.parentNode;
          }
        }
        l = l.return;
      }
    th(function() {
      var U = u, X = Ao(n), W = [];
      e: {
        var B = Th.get(e);
        if (B !== void 0) {
          var V = Ei, he = e;
          switch (e) {
            case "keypress":
              if (Ni(n) === 0) break e;
            case "keydown":
            case "keyup":
              V = Sg;
              break;
            case "focusin":
              he = "focus", V = $o;
              break;
            case "focusout":
              he = "blur", V = $o;
              break;
            case "beforeblur":
            case "afterblur":
              V = $o;
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
              V = sh;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              V = hg;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              V = Cg;
              break;
            case kh:
            case Nh:
            case Ch:
              V = pg;
              break;
            case Eh:
              V = Tg;
              break;
            case "scroll":
            case "scrollend":
              V = ug;
              break;
            case "wheel":
              V = Rg;
              break;
            case "copy":
            case "cut":
            case "paste":
              V = bg;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              V = ih;
              break;
            case "toggle":
            case "beforetoggle":
              V = zg;
          }
          var ye = (t & 4) !== 0, Xe = !ye && (e === "scroll" || e === "scrollend"), D = ye ? B !== null ? B + "Capture" : null : B;
          ye = [];
          for (var A = U, $; A !== null; ) {
            var J = A;
            if ($ = J.stateNode, J = J.tag, J !== 5 && J !== 26 && J !== 27 || $ === null || D === null || (J = ml(A, D), J != null && ye.push(
              Ql(A, J, $)
            )), Xe) break;
            A = A.return;
          }
          0 < ye.length && (B = new V(
            B,
            he,
            null,
            n,
            X
          ), W.push({ event: B, listeners: ye }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (B = e === "mouseover" || e === "pointerover", V = e === "mouseout" || e === "pointerout", B && n !== Ro && (he = n.relatedTarget || n.fromElement) && (_s(he) || he[ps]))
            break e;
          if ((V || B) && (B = X.window === X ? X : (B = X.ownerDocument) ? B.defaultView || B.parentWindow : window, V ? (he = n.relatedTarget || n.toElement, V = U, he = he ? _s(he) : null, he !== null && (Xe = h(he), ye = he.tag, he !== Xe || ye !== 5 && ye !== 27 && ye !== 6) && (he = null)) : (V = null, he = U), V !== he)) {
            if (ye = sh, J = "onMouseLeave", D = "onMouseEnter", A = "mouse", (e === "pointerout" || e === "pointerover") && (ye = ih, J = "onPointerLeave", D = "onPointerEnter", A = "pointer"), Xe = V == null ? B : fl(V), $ = he == null ? B : fl(he), B = new ye(
              J,
              A + "leave",
              V,
              n,
              X
            ), B.target = Xe, B.relatedTarget = $, J = null, _s(X) === U && (ye = new ye(
              D,
              A + "enter",
              he,
              n,
              X
            ), ye.target = $, ye.relatedTarget = Xe, J = ye), Xe = J, V && he)
              t: {
                for (ye = Av, D = V, A = he, $ = 0, J = D; J; J = ye(J))
                  $++;
                J = 0;
                for (var be = A; be; be = ye(be))
                  J++;
                for (; 0 < $ - J; )
                  D = ye(D), $--;
                for (; 0 < J - $; )
                  A = ye(A), J--;
                for (; $--; ) {
                  if (D === A || A !== null && D === A.alternate) {
                    ye = D;
                    break t;
                  }
                  D = ye(D), A = ye(A);
                }
                ye = null;
              }
            else ye = null;
            V !== null && Wm(
              W,
              B,
              V,
              ye,
              !1
            ), he !== null && Xe !== null && Wm(
              W,
              Xe,
              he,
              ye,
              !0
            );
          }
        }
        e: {
          if (B = U ? fl(U) : window, V = B.nodeName && B.nodeName.toLowerCase(), V === "select" || V === "input" && B.type === "file")
            var He = mh;
          else if (hh(B))
            if (ph)
              He = Vg;
            else {
              He = Fg;
              var me = Bg;
            }
          else
            V = B.nodeName, !V || V.toLowerCase() !== "input" || B.type !== "checkbox" && B.type !== "radio" ? U && Mo(U.elementType) && (He = mh) : He = Gg;
          if (He && (He = He(e, U))) {
            fh(
              W,
              He,
              n,
              X
            );
            break e;
          }
          me && me(e, B, U), e === "focusout" && U && B.type === "number" && U.memoizedProps.value != null && To(B, "number", B.value);
        }
        switch (me = U ? fl(U) : window, e) {
          case "focusin":
            (hh(me) || me.contentEditable === "true") && (ks = me, qo = U, wl = null);
            break;
          case "focusout":
            wl = qo = ks = null;
            break;
          case "mousedown":
            Yo = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Yo = !1, jh(W, n, X);
            break;
          case "selectionchange":
            if (Yg) break;
          case "keydown":
          case "keyup":
            jh(W, n, X);
        }
        var Ne;
        if (Bo)
          e: {
            switch (e) {
              case "compositionstart":
                var Re = "onCompositionStart";
                break e;
              case "compositionend":
                Re = "onCompositionEnd";
                break e;
              case "compositionupdate":
                Re = "onCompositionUpdate";
                break e;
            }
            Re = void 0;
          }
        else
          Ss ? uh(e, n) && (Re = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (Re = "onCompositionStart");
        Re && (rh && n.locale !== "ko" && (Ss || Re !== "onCompositionStart" ? Re === "onCompositionEnd" && Ss && (Ne = nh()) : (ia = X, Oo = "value" in ia ? ia.value : ia.textContent, Ss = !0)), me = gr(U, Re), 0 < me.length && (Re = new lh(
          Re,
          e,
          null,
          n,
          X
        ), W.push({ event: Re, listeners: me }), Ne ? Re.data = Ne : (Ne = dh(n), Ne !== null && (Re.data = Ne)))), (Ne = Og ? Hg(e, n) : Lg(e, n)) && (Re = gr(U, "onBeforeInput"), 0 < Re.length && (me = new lh(
          "onBeforeInput",
          "beforeinput",
          null,
          n,
          X
        ), W.push({
          event: me,
          listeners: Re
        }), me.data = Ne)), Ev(
          W,
          e,
          U,
          n,
          X
        );
      }
      Jm(W, t);
    });
  }
  function Ql(e, t, n) {
    return {
      instance: e,
      listener: t,
      currentTarget: n
    };
  }
  function gr(e, t) {
    for (var n = t + "Capture", l = []; e !== null; ) {
      var c = e, u = c.stateNode;
      if (c = c.tag, c !== 5 && c !== 26 && c !== 27 || u === null || (c = ml(e, n), c != null && l.unshift(
        Ql(e, c, u)
      ), c = ml(e, t), c != null && l.push(
        Ql(e, c, u)
      )), e.tag === 3) return l;
      e = e.return;
    }
    return [];
  }
  function Av(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function Wm(e, t, n, l, c) {
    for (var u = t._reactName, _ = []; n !== null && n !== l; ) {
      var w = n, R = w.alternate, U = w.stateNode;
      if (w = w.tag, R !== null && R === l) break;
      w !== 5 && w !== 26 && w !== 27 || U === null || (R = U, c ? (U = ml(n, u), U != null && _.unshift(
        Ql(n, U, R)
      )) : c || (U = ml(n, u), U != null && _.push(
        Ql(n, U, R)
      ))), n = n.return;
    }
    _.length !== 0 && e.push({ event: t, listeners: _ });
  }
  var zv = /\r\n?/g, Dv = /\u0000|\uFFFD/g;
  function Im(e) {
    return (typeof e == "string" ? e : "" + e).replace(zv, `
`).replace(Dv, "");
  }
  function ep(e, t) {
    return t = Im(t), Im(e) === t;
  }
  function Ye(e, t, n, l, c, u) {
    switch (n) {
      case "children":
        typeof l == "string" ? t === "body" || t === "textarea" && l === "" || ys(e, l) : (typeof l == "number" || typeof l == "bigint") && t !== "body" && ys(e, "" + l);
        break;
      case "className":
        wi(e, "class", l);
        break;
      case "tabIndex":
        wi(e, "tabindex", l);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        wi(e, n, l);
        break;
      case "style":
        Id(e, l, u);
        break;
      case "data":
        if (t !== "object") {
          wi(e, "data", l);
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
        l = Si("" + l), e.setAttribute(n, l);
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
          typeof u == "function" && (n === "formAction" ? (t !== "input" && Ye(e, t, "name", c.name, c, null), Ye(
            e,
            t,
            "formEncType",
            c.formEncType,
            c,
            null
          ), Ye(
            e,
            t,
            "formMethod",
            c.formMethod,
            c,
            null
          ), Ye(
            e,
            t,
            "formTarget",
            c.formTarget,
            c,
            null
          )) : (Ye(e, t, "encType", c.encType, c, null), Ye(e, t, "method", c.method, c, null), Ye(e, t, "target", c.target, c, null)));
        if (l == null || typeof l == "symbol" || typeof l == "boolean") {
          e.removeAttribute(n);
          break;
        }
        l = Si("" + l), e.setAttribute(n, l);
        break;
      case "onClick":
        l != null && (e.onclick = Hn);
        break;
      case "onScroll":
        l != null && Ee("scroll", e);
        break;
      case "onScrollEnd":
        l != null && Ee("scrollend", e);
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
        n = Si("" + l), e.setAttributeNS(
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
        Ee("beforetoggle", e), Ee("toggle", e), yi(e, "popover", l);
        break;
      case "xlinkActuate":
        On(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          l
        );
        break;
      case "xlinkArcrole":
        On(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          l
        );
        break;
      case "xlinkRole":
        On(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          l
        );
        break;
      case "xlinkShow":
        On(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          l
        );
        break;
      case "xlinkTitle":
        On(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          l
        );
        break;
      case "xlinkType":
        On(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          l
        );
        break;
      case "xmlBase":
        On(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          l
        );
        break;
      case "xmlLang":
        On(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          l
        );
        break;
      case "xmlSpace":
        On(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          l
        );
        break;
      case "is":
        yi(e, "is", l);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = og.get(n) || n, yi(e, n, l));
    }
  }
  function _u(e, t, n, l, c, u) {
    switch (n) {
      case "style":
        Id(e, l, u);
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
        typeof l == "string" ? ys(e, l) : (typeof l == "number" || typeof l == "bigint") && ys(e, "" + l);
        break;
      case "onScroll":
        l != null && Ee("scroll", e);
        break;
      case "onScrollEnd":
        l != null && Ee("scrollend", e);
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
        if (!qd.hasOwnProperty(n))
          e: {
            if (n[0] === "o" && n[1] === "n" && (c = n.endsWith("Capture"), t = n.slice(2, c ? n.length - 7 : void 0), u = e[Ft] || null, u = u != null ? u[n] : null, typeof u == "function" && e.removeEventListener(t, u, c), typeof l == "function")) {
              typeof u != "function" && u !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(t, l, c);
              break e;
            }
            n in e ? e[n] = l : l === !0 ? e.setAttribute(n, "") : yi(e, n, l);
          }
    }
  }
  function kt(e, t, n) {
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
        Ee("error", e), Ee("load", e);
        var l = !1, c = !1, u;
        for (u in n)
          if (n.hasOwnProperty(u)) {
            var _ = n[u];
            if (_ != null)
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
                  Ye(e, t, u, _, n, null);
              }
          }
        c && Ye(e, t, "srcSet", n.srcSet, n, null), l && Ye(e, t, "src", n.src, n, null);
        return;
      case "input":
        Ee("invalid", e);
        var w = u = _ = c = null, R = null, U = null;
        for (l in n)
          if (n.hasOwnProperty(l)) {
            var X = n[l];
            if (X != null)
              switch (l) {
                case "name":
                  c = X;
                  break;
                case "type":
                  _ = X;
                  break;
                case "checked":
                  R = X;
                  break;
                case "defaultChecked":
                  U = X;
                  break;
                case "value":
                  u = X;
                  break;
                case "defaultValue":
                  w = X;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (X != null)
                    throw Error(o(137, t));
                  break;
                default:
                  Ye(e, t, l, X, n, null);
              }
          }
        Kd(
          e,
          u,
          w,
          R,
          U,
          _,
          c,
          !1
        );
        return;
      case "select":
        Ee("invalid", e), l = _ = u = null;
        for (c in n)
          if (n.hasOwnProperty(c) && (w = n[c], w != null))
            switch (c) {
              case "value":
                u = w;
                break;
              case "defaultValue":
                _ = w;
                break;
              case "multiple":
                l = w;
              default:
                Ye(e, t, c, w, n, null);
            }
        t = u, n = _, e.multiple = !!l, t != null ? xs(e, !!l, t, !1) : n != null && xs(e, !!l, n, !0);
        return;
      case "textarea":
        Ee("invalid", e), u = c = l = null;
        for (_ in n)
          if (n.hasOwnProperty(_) && (w = n[_], w != null))
            switch (_) {
              case "value":
                l = w;
                break;
              case "defaultValue":
                c = w;
                break;
              case "children":
                u = w;
                break;
              case "dangerouslySetInnerHTML":
                if (w != null) throw Error(o(91));
                break;
              default:
                Ye(e, t, _, w, n, null);
            }
        Pd(e, l, c, u);
        return;
      case "option":
        for (R in n)
          if (n.hasOwnProperty(R) && (l = n[R], l != null))
            switch (R) {
              case "selected":
                e.selected = l && typeof l != "function" && typeof l != "symbol";
                break;
              default:
                Ye(e, t, R, l, n, null);
            }
        return;
      case "dialog":
        Ee("beforetoggle", e), Ee("toggle", e), Ee("cancel", e), Ee("close", e);
        break;
      case "iframe":
      case "object":
        Ee("load", e);
        break;
      case "video":
      case "audio":
        for (l = 0; l < Xl.length; l++)
          Ee(Xl[l], e);
        break;
      case "image":
        Ee("error", e), Ee("load", e);
        break;
      case "details":
        Ee("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        Ee("error", e), Ee("load", e);
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
        for (U in n)
          if (n.hasOwnProperty(U) && (l = n[U], l != null))
            switch (U) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(o(137, t));
              default:
                Ye(e, t, U, l, n, null);
            }
        return;
      default:
        if (Mo(t)) {
          for (X in n)
            n.hasOwnProperty(X) && (l = n[X], l !== void 0 && _u(
              e,
              t,
              X,
              l,
              n,
              void 0
            ));
          return;
        }
    }
    for (w in n)
      n.hasOwnProperty(w) && (l = n[w], l != null && Ye(e, t, w, l, n, null));
  }
  function Ov(e, t, n, l) {
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
        var c = null, u = null, _ = null, w = null, R = null, U = null, X = null;
        for (V in n) {
          var W = n[V];
          if (n.hasOwnProperty(V) && W != null)
            switch (V) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                R = W;
              default:
                l.hasOwnProperty(V) || Ye(e, t, V, null, l, W);
            }
        }
        for (var B in l) {
          var V = l[B];
          if (W = n[B], l.hasOwnProperty(B) && (V != null || W != null))
            switch (B) {
              case "type":
                u = V;
                break;
              case "name":
                c = V;
                break;
              case "checked":
                U = V;
                break;
              case "defaultChecked":
                X = V;
                break;
              case "value":
                _ = V;
                break;
              case "defaultValue":
                w = V;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (V != null)
                  throw Error(o(137, t));
                break;
              default:
                V !== W && Ye(
                  e,
                  t,
                  B,
                  V,
                  l,
                  W
                );
            }
        }
        Eo(
          e,
          _,
          w,
          R,
          U,
          X,
          u,
          c
        );
        return;
      case "select":
        V = _ = w = B = null;
        for (u in n)
          if (R = n[u], n.hasOwnProperty(u) && R != null)
            switch (u) {
              case "value":
                break;
              case "multiple":
                V = R;
              default:
                l.hasOwnProperty(u) || Ye(
                  e,
                  t,
                  u,
                  null,
                  l,
                  R
                );
            }
        for (c in l)
          if (u = l[c], R = n[c], l.hasOwnProperty(c) && (u != null || R != null))
            switch (c) {
              case "value":
                B = u;
                break;
              case "defaultValue":
                w = u;
                break;
              case "multiple":
                _ = u;
              default:
                u !== R && Ye(
                  e,
                  t,
                  c,
                  u,
                  l,
                  R
                );
            }
        t = w, n = _, l = V, B != null ? xs(e, !!n, B, !1) : !!l != !!n && (t != null ? xs(e, !!n, t, !0) : xs(e, !!n, n ? [] : "", !1));
        return;
      case "textarea":
        V = B = null;
        for (w in n)
          if (c = n[w], n.hasOwnProperty(w) && c != null && !l.hasOwnProperty(w))
            switch (w) {
              case "value":
                break;
              case "children":
                break;
              default:
                Ye(e, t, w, null, l, c);
            }
        for (_ in l)
          if (c = l[_], u = n[_], l.hasOwnProperty(_) && (c != null || u != null))
            switch (_) {
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
                c !== u && Ye(e, t, _, c, l, u);
            }
        Jd(e, B, V);
        return;
      case "option":
        for (var he in n)
          if (B = n[he], n.hasOwnProperty(he) && B != null && !l.hasOwnProperty(he))
            switch (he) {
              case "selected":
                e.selected = !1;
                break;
              default:
                Ye(
                  e,
                  t,
                  he,
                  null,
                  l,
                  B
                );
            }
        for (R in l)
          if (B = l[R], V = n[R], l.hasOwnProperty(R) && B !== V && (B != null || V != null))
            switch (R) {
              case "selected":
                e.selected = B && typeof B != "function" && typeof B != "symbol";
                break;
              default:
                Ye(
                  e,
                  t,
                  R,
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
        for (var ye in n)
          B = n[ye], n.hasOwnProperty(ye) && B != null && !l.hasOwnProperty(ye) && Ye(e, t, ye, null, l, B);
        for (U in l)
          if (B = l[U], V = n[U], l.hasOwnProperty(U) && B !== V && (B != null || V != null))
            switch (U) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (B != null)
                  throw Error(o(137, t));
                break;
              default:
                Ye(
                  e,
                  t,
                  U,
                  B,
                  l,
                  V
                );
            }
        return;
      default:
        if (Mo(t)) {
          for (var Xe in n)
            B = n[Xe], n.hasOwnProperty(Xe) && B !== void 0 && !l.hasOwnProperty(Xe) && _u(
              e,
              t,
              Xe,
              void 0,
              l,
              B
            );
          for (X in l)
            B = l[X], V = n[X], !l.hasOwnProperty(X) || B === V || B === void 0 && V === void 0 || _u(
              e,
              t,
              X,
              B,
              l,
              V
            );
          return;
        }
    }
    for (var D in n)
      B = n[D], n.hasOwnProperty(D) && B != null && !l.hasOwnProperty(D) && Ye(e, t, D, null, l, B);
    for (W in l)
      B = l[W], V = n[W], !l.hasOwnProperty(W) || B === V || B == null && V == null || Ye(e, t, W, B, l, V);
  }
  function tp(e) {
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
  function Hv() {
    if (typeof performance.getEntriesByType == "function") {
      for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), l = 0; l < n.length; l++) {
        var c = n[l], u = c.transferSize, _ = c.initiatorType, w = c.duration;
        if (u && w && tp(_)) {
          for (_ = 0, w = c.responseEnd, l += 1; l < n.length; l++) {
            var R = n[l], U = R.startTime;
            if (U > w) break;
            var X = R.transferSize, W = R.initiatorType;
            X && tp(W) && (R = R.responseEnd, _ += X * (R < w ? 1 : (w - U) / (R - U)));
          }
          if (--l, t += 8 * (u + _) / (c.duration / 1e3), e++, 10 < e) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
  }
  var bu = null, gu = null;
  function vr(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function np(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function ap(e, t) {
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
  function vu(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var xu = null;
  function Lv() {
    var e = window.event;
    return e && e.type === "popstate" ? e === xu ? !1 : (xu = e, !0) : (xu = null, !1);
  }
  var sp = typeof setTimeout == "function" ? setTimeout : void 0, $v = typeof clearTimeout == "function" ? clearTimeout : void 0, lp = typeof Promise == "function" ? Promise : void 0, Uv = typeof queueMicrotask == "function" ? queueMicrotask : typeof lp < "u" ? function(e) {
    return lp.resolve(null).then(e).catch(Bv);
  } : sp;
  function Bv(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function ja(e) {
    return e === "head";
  }
  function ip(e, t) {
    var n = t, l = 0;
    do {
      var c = n.nextSibling;
      if (e.removeChild(n), c && c.nodeType === 8)
        if (n = c.data, n === "/$" || n === "/&") {
          if (l === 0) {
            e.removeChild(c), Ws(t);
            return;
          }
          l--;
        } else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&")
          l++;
        else if (n === "html")
          Zl(e.ownerDocument.documentElement);
        else if (n === "head") {
          n = e.ownerDocument.head, Zl(n);
          for (var u = n.firstChild; u; ) {
            var _ = u.nextSibling, w = u.nodeName;
            u[hl] || w === "SCRIPT" || w === "STYLE" || w === "LINK" && u.rel.toLowerCase() === "stylesheet" || n.removeChild(u), u = _;
          }
        } else
          n === "body" && Zl(e.ownerDocument.body);
      n = c;
    } while (n);
    Ws(t);
  }
  function rp(e, t) {
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
  function yu(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var n = t;
      switch (t = t.nextSibling, n.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          yu(n), No(n);
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
  function Fv(e, t, n, l) {
    for (; e.nodeType === 1; ) {
      var c = n;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!l && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (l) {
        if (!e[hl])
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
      if (e = _n(e.nextSibling), e === null) break;
    }
    return null;
  }
  function Gv(e, t, n) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = _n(e.nextSibling), e === null)) return null;
    return e;
  }
  function op(e, t) {
    for (; e.nodeType !== 8; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = _n(e.nextSibling), e === null)) return null;
    return e;
  }
  function wu(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function ju(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
  }
  function Vv(e, t) {
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
  function _n(e) {
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
  var Su = null;
  function cp(e) {
    e = e.nextSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === "/$" || n === "/&") {
          if (t === 0)
            return _n(e.nextSibling);
          t--;
        } else
          n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function up(e) {
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
  function dp(e, t, n) {
    switch (t = vr(n), e) {
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
  function Zl(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    No(e);
  }
  var bn = /* @__PURE__ */ new Map(), hp = /* @__PURE__ */ new Set();
  function xr(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var Wn = z.d;
  z.d = {
    f: qv,
    r: Yv,
    D: Xv,
    C: Qv,
    L: Zv,
    m: Kv,
    X: Pv,
    S: Jv,
    M: Wv
  };
  function qv() {
    var e = Wn.f(), t = dr();
    return e || t;
  }
  function Yv(e) {
    var t = bs(e);
    t !== null && t.tag === 5 && t.type === "form" ? Tf(t) : Wn.r(e);
  }
  var Ks = typeof document > "u" ? null : document;
  function fp(e, t, n) {
    var l = Ks;
    if (l && typeof t == "string" && t) {
      var c = cn(t);
      c = 'link[rel="' + e + '"][href="' + c + '"]', typeof n == "string" && (c += '[crossorigin="' + n + '"]'), hp.has(c) || (hp.add(c), e = { rel: e, crossOrigin: n, href: t }, l.querySelector(c) === null && (t = l.createElement("link"), kt(t, "link", e), bt(t), l.head.appendChild(t)));
    }
  }
  function Xv(e) {
    Wn.D(e), fp("dns-prefetch", e, null);
  }
  function Qv(e, t) {
    Wn.C(e, t), fp("preconnect", e, t);
  }
  function Zv(e, t, n) {
    Wn.L(e, t, n);
    var l = Ks;
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
          u = Js(e);
          break;
        case "script":
          u = Ps(e);
      }
      bn.has(u) || (e = g(
        {
          rel: "preload",
          href: t === "image" && n && n.imageSrcSet ? void 0 : e,
          as: t
        },
        n
      ), bn.set(u, e), l.querySelector(c) !== null || t === "style" && l.querySelector(Kl(u)) || t === "script" && l.querySelector(Jl(u)) || (t = l.createElement("link"), kt(t, "link", e), bt(t), l.head.appendChild(t)));
    }
  }
  function Kv(e, t) {
    Wn.m(e, t);
    var n = Ks;
    if (n && e) {
      var l = t && typeof t.as == "string" ? t.as : "script", c = 'link[rel="modulepreload"][as="' + cn(l) + '"][href="' + cn(e) + '"]', u = c;
      switch (l) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          u = Ps(e);
      }
      if (!bn.has(u) && (e = g({ rel: "modulepreload", href: e }, t), bn.set(u, e), n.querySelector(c) === null)) {
        switch (l) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (n.querySelector(Jl(u)))
              return;
        }
        l = n.createElement("link"), kt(l, "link", e), bt(l), n.head.appendChild(l);
      }
    }
  }
  function Jv(e, t, n) {
    Wn.S(e, t, n);
    var l = Ks;
    if (l && e) {
      var c = gs(l).hoistableStyles, u = Js(e);
      t = t || "default";
      var _ = c.get(u);
      if (!_) {
        var w = { loading: 0, preload: null };
        if (_ = l.querySelector(
          Kl(u)
        ))
          w.loading = 5;
        else {
          e = g(
            { rel: "stylesheet", href: e, "data-precedence": t },
            n
          ), (n = bn.get(u)) && ku(e, n);
          var R = _ = l.createElement("link");
          bt(R), kt(R, "link", e), R._p = new Promise(function(U, X) {
            R.onload = U, R.onerror = X;
          }), R.addEventListener("load", function() {
            w.loading |= 1;
          }), R.addEventListener("error", function() {
            w.loading |= 2;
          }), w.loading |= 4, yr(_, t, l);
        }
        _ = {
          type: "stylesheet",
          instance: _,
          count: 1,
          state: w
        }, c.set(u, _);
      }
    }
  }
  function Pv(e, t) {
    Wn.X(e, t);
    var n = Ks;
    if (n && e) {
      var l = gs(n).hoistableScripts, c = Ps(e), u = l.get(c);
      u || (u = n.querySelector(Jl(c)), u || (e = g({ src: e, async: !0 }, t), (t = bn.get(c)) && Nu(e, t), u = n.createElement("script"), bt(u), kt(u, "link", e), n.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, l.set(c, u));
    }
  }
  function Wv(e, t) {
    Wn.M(e, t);
    var n = Ks;
    if (n && e) {
      var l = gs(n).hoistableScripts, c = Ps(e), u = l.get(c);
      u || (u = n.querySelector(Jl(c)), u || (e = g({ src: e, async: !0, type: "module" }, t), (t = bn.get(c)) && Nu(e, t), u = n.createElement("script"), bt(u), kt(u, "link", e), n.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, l.set(c, u));
    }
  }
  function mp(e, t, n, l) {
    var c = (c = de.current) ? xr(c) : null;
    if (!c) throw Error(o(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof n.precedence == "string" && typeof n.href == "string" ? (t = Js(n.href), n = gs(
          c
        ).hoistableStyles, l = n.get(t), l || (l = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, n.set(t, l)), l) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
          e = Js(n.href);
          var u = gs(
            c
          ).hoistableStyles, _ = u.get(e);
          if (_ || (c = c.ownerDocument || c, _ = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, u.set(e, _), (u = c.querySelector(
            Kl(e)
          )) && !u._p && (_.instance = u, _.state.loading = 5), bn.has(e) || (n = {
            rel: "preload",
            as: "style",
            href: n.href,
            crossOrigin: n.crossOrigin,
            integrity: n.integrity,
            media: n.media,
            hrefLang: n.hrefLang,
            referrerPolicy: n.referrerPolicy
          }, bn.set(e, n), u || Iv(
            c,
            e,
            n,
            _.state
          ))), t && l === null)
            throw Error(o(528, ""));
          return _;
        }
        if (t && l !== null)
          throw Error(o(529, ""));
        return null;
      case "script":
        return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Ps(n), n = gs(
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
  function Js(e) {
    return 'href="' + cn(e) + '"';
  }
  function Kl(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function pp(e) {
    return g({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function Iv(e, t, n, l) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? l.loading = 1 : (t = e.createElement("link"), l.preload = t, t.addEventListener("load", function() {
      return l.loading |= 1;
    }), t.addEventListener("error", function() {
      return l.loading |= 2;
    }), kt(t, "link", n), bt(t), e.head.appendChild(t));
  }
  function Ps(e) {
    return '[src="' + cn(e) + '"]';
  }
  function Jl(e) {
    return "script[async]" + e;
  }
  function _p(e, t, n) {
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
          ), bt(l), kt(l, "style", c), yr(l, n.precedence, e), t.instance = l;
        case "stylesheet":
          c = Js(n.href);
          var u = e.querySelector(
            Kl(c)
          );
          if (u)
            return t.state.loading |= 4, t.instance = u, bt(u), u;
          l = pp(n), (c = bn.get(c)) && ku(l, c), u = (e.ownerDocument || e).createElement("link"), bt(u);
          var _ = u;
          return _._p = new Promise(function(w, R) {
            _.onload = w, _.onerror = R;
          }), kt(u, "link", l), t.state.loading |= 4, yr(u, n.precedence, e), t.instance = u;
        case "script":
          return u = Ps(n.src), (c = e.querySelector(
            Jl(u)
          )) ? (t.instance = c, bt(c), c) : (l = n, (c = bn.get(u)) && (l = g({}, n), Nu(l, c)), e = e.ownerDocument || e, c = e.createElement("script"), bt(c), kt(c, "link", l), e.head.appendChild(c), t.instance = c);
        case "void":
          return null;
        default:
          throw Error(o(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (l = t.instance, t.state.loading |= 4, yr(l, n.precedence, e));
    return t.instance;
  }
  function yr(e, t, n) {
    for (var l = n.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), c = l.length ? l[l.length - 1] : null, u = c, _ = 0; _ < l.length; _++) {
      var w = l[_];
      if (w.dataset.precedence === t) u = w;
      else if (u !== c) break;
    }
    u ? u.parentNode.insertBefore(e, u.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
  }
  function ku(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function Nu(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var wr = null;
  function bp(e, t, n) {
    if (wr === null) {
      var l = /* @__PURE__ */ new Map(), c = wr = /* @__PURE__ */ new Map();
      c.set(n, l);
    } else
      c = wr, l = c.get(n), l || (l = /* @__PURE__ */ new Map(), c.set(n, l));
    if (l.has(e)) return l;
    for (l.set(e, null), n = n.getElementsByTagName(e), c = 0; c < n.length; c++) {
      var u = n[c];
      if (!(u[hl] || u[yt] || e === "link" && u.getAttribute("rel") === "stylesheet") && u.namespaceURI !== "http://www.w3.org/2000/svg") {
        var _ = u.getAttribute(t) || "";
        _ = e + _;
        var w = l.get(_);
        w ? w.push(u) : l.set(_, [u]);
      }
    }
    return l;
  }
  function gp(e, t, n) {
    e = e.ownerDocument || e, e.head.insertBefore(
      n,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function ex(e, t, n) {
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
  function vp(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function tx(e, t, n, l) {
    if (n.type === "stylesheet" && (typeof l.media != "string" || matchMedia(l.media).matches !== !1) && (n.state.loading & 4) === 0) {
      if (n.instance === null) {
        var c = Js(l.href), u = t.querySelector(
          Kl(c)
        );
        if (u) {
          t = u._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = jr.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = u, bt(u);
          return;
        }
        u = t.ownerDocument || t, l = pp(l), (c = bn.get(c)) && ku(l, c), u = u.createElement("link"), bt(u);
        var _ = u;
        _._p = new Promise(function(w, R) {
          _.onload = w, _.onerror = R;
        }), kt(u, "link", l), n.instance = u;
      }
      e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && (n.state.loading & 3) === 0 && (e.count++, n = jr.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
    }
  }
  var Cu = 0;
  function nx(e, t) {
    return e.stylesheets && e.count === 0 && kr(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
      var l = setTimeout(function() {
        if (e.stylesheets && kr(e, e.stylesheets), e.unsuspend) {
          var u = e.unsuspend;
          e.unsuspend = null, u();
        }
      }, 6e4 + t);
      0 < e.imgBytes && Cu === 0 && (Cu = 62500 * Hv());
      var c = setTimeout(
        function() {
          if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && kr(e, e.stylesheets), e.unsuspend)) {
            var u = e.unsuspend;
            e.unsuspend = null, u();
          }
        },
        (e.imgBytes > Cu ? 50 : 800) + t
      );
      return e.unsuspend = n, function() {
        e.unsuspend = null, clearTimeout(l), clearTimeout(c);
      };
    } : null;
  }
  function jr() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) kr(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var Sr = null;
  function kr(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, Sr = /* @__PURE__ */ new Map(), t.forEach(ax, e), Sr = null, jr.call(e));
  }
  function ax(e, t) {
    if (!(t.state.loading & 4)) {
      var n = Sr.get(e);
      if (n) var l = n.get(null);
      else {
        n = /* @__PURE__ */ new Map(), Sr.set(e, n);
        for (var c = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), u = 0; u < c.length; u++) {
          var _ = c[u];
          (_.nodeName === "LINK" || _.getAttribute("media") !== "not all") && (n.set(_.dataset.precedence, _), l = _);
        }
        l && n.set(null, l);
      }
      c = t.instance, _ = c.getAttribute("data-precedence"), u = n.get(_) || l, u === l && n.set(null, c), n.set(_, c), this.count++, l = jr.bind(this), c.addEventListener("load", l), c.addEventListener("error", l), u ? u.parentNode.insertBefore(c, u.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(c, e.firstChild)), t.state.loading |= 4;
    }
  }
  var Pl = {
    $$typeof: F,
    Provider: null,
    Consumer: null,
    _currentValue: q,
    _currentValue2: q,
    _threadCount: 0
  };
  function sx(e, t, n, l, c, u, _, w, R) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = wo(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = wo(0), this.hiddenUpdates = wo(null), this.identifierPrefix = l, this.onUncaughtError = c, this.onCaughtError = u, this.onRecoverableError = _, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = R, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function xp(e, t, n, l, c, u, _, w, R, U, X, W) {
    return e = new sx(
      e,
      t,
      n,
      _,
      R,
      U,
      X,
      W,
      w
    ), t = 1, u === !0 && (t |= 24), u = Wt(3, null, null, t), e.current = u, u.stateNode = e, t = ic(), t.refCount++, e.pooledCache = t, t.refCount++, u.memoizedState = {
      element: l,
      isDehydrated: n,
      cache: t
    }, uc(u), e;
  }
  function yp(e) {
    return e ? (e = Es, e) : Es;
  }
  function wp(e, t, n, l, c, u) {
    c = yp(c), l.context === null ? l.context = c : l.pendingContext = c, l = ha(t), l.payload = { element: n }, u = u === void 0 ? null : u, u !== null && (l.callback = u), n = fa(e, l, t), n !== null && (Qt(n, e, t), Tl(n, e, t));
  }
  function jp(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Eu(e, t) {
    jp(e, t), (e = e.alternate) && jp(e, t);
  }
  function Sp(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Qa(e, 67108864);
      t !== null && Qt(t, e, 67108864), Eu(e, 67108864);
    }
  }
  function kp(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = an();
      t = jo(t);
      var n = Qa(e, t);
      n !== null && Qt(n, e, t), Eu(e, t);
    }
  }
  var Nr = !0;
  function lx(e, t, n, l) {
    var c = S.T;
    S.T = null;
    var u = z.p;
    try {
      z.p = 2, Tu(e, t, n, l);
    } finally {
      z.p = u, S.T = c;
    }
  }
  function ix(e, t, n, l) {
    var c = S.T;
    S.T = null;
    var u = z.p;
    try {
      z.p = 8, Tu(e, t, n, l);
    } finally {
      z.p = u, S.T = c;
    }
  }
  function Tu(e, t, n, l) {
    if (Nr) {
      var c = Mu(l);
      if (c === null)
        pu(
          e,
          t,
          l,
          Cr,
          n
        ), Cp(e, l);
      else if (ox(
        c,
        e,
        t,
        n,
        l
      ))
        l.stopPropagation();
      else if (Cp(e, l), t & 4 && -1 < rx.indexOf(e)) {
        for (; c !== null; ) {
          var u = bs(c);
          if (u !== null)
            switch (u.tag) {
              case 3:
                if (u = u.stateNode, u.current.memoizedState.isDehydrated) {
                  var _ = Ga(u.pendingLanes);
                  if (_ !== 0) {
                    var w = u;
                    for (w.pendingLanes |= 2, w.entangledLanes |= 2; _; ) {
                      var R = 1 << 31 - Et(_);
                      w.entanglements[1] |= R, _ &= ~R;
                    }
                    Tn(u), (Ue & 6) === 0 && (cr = it() + 500, Yl(0));
                  }
                }
                break;
              case 31:
              case 13:
                w = Qa(u, 2), w !== null && Qt(w, u, 2), dr(), Eu(u, 2);
            }
          if (u = Mu(l), u === null && pu(
            e,
            t,
            l,
            Cr,
            n
          ), u === c) break;
          c = u;
        }
        c !== null && l.stopPropagation();
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
  function Mu(e) {
    return e = Ao(e), Ru(e);
  }
  var Cr = null;
  function Ru(e) {
    if (Cr = null, e = _s(e), e !== null) {
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
    return Cr = e, null;
  }
  function Np(e) {
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
        switch (ol()) {
          case ze:
            return 2;
          case hs:
            return 8;
          case fs:
          case go:
            return 32;
          case bi:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Au = !1, Sa = null, ka = null, Na = null, Wl = /* @__PURE__ */ new Map(), Il = /* @__PURE__ */ new Map(), Ca = [], rx = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function Cp(e, t) {
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
        Wl.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Il.delete(t.pointerId);
    }
  }
  function ei(e, t, n, l, c, u) {
    return e === null || e.nativeEvent !== u ? (e = {
      blockedOn: t,
      domEventName: n,
      eventSystemFlags: l,
      nativeEvent: u,
      targetContainers: [c]
    }, t !== null && (t = bs(t), t !== null && Sp(t)), e) : (e.eventSystemFlags |= l, t = e.targetContainers, c !== null && t.indexOf(c) === -1 && t.push(c), e);
  }
  function ox(e, t, n, l, c) {
    switch (t) {
      case "focusin":
        return Sa = ei(
          Sa,
          e,
          t,
          n,
          l,
          c
        ), !0;
      case "dragenter":
        return ka = ei(
          ka,
          e,
          t,
          n,
          l,
          c
        ), !0;
      case "mouseover":
        return Na = ei(
          Na,
          e,
          t,
          n,
          l,
          c
        ), !0;
      case "pointerover":
        var u = c.pointerId;
        return Wl.set(
          u,
          ei(
            Wl.get(u) || null,
            e,
            t,
            n,
            l,
            c
          )
        ), !0;
      case "gotpointercapture":
        return u = c.pointerId, Il.set(
          u,
          ei(
            Il.get(u) || null,
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
  function Ep(e) {
    var t = _s(e.target);
    if (t !== null) {
      var n = h(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = f(n), t !== null) {
            e.blockedOn = t, Fd(e.priority, function() {
              kp(n);
            });
            return;
          }
        } else if (t === 31) {
          if (t = m(n), t !== null) {
            e.blockedOn = t, Fd(e.priority, function() {
              kp(n);
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
  function Er(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = Mu(e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var l = new n.constructor(
          n.type,
          n
        );
        Ro = l, n.target.dispatchEvent(l), Ro = null;
      } else
        return t = bs(n), t !== null && Sp(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function Tp(e, t, n) {
    Er(e) && n.delete(t);
  }
  function cx() {
    Au = !1, Sa !== null && Er(Sa) && (Sa = null), ka !== null && Er(ka) && (ka = null), Na !== null && Er(Na) && (Na = null), Wl.forEach(Tp), Il.forEach(Tp);
  }
  function Tr(e, t) {
    e.blockedOn === t && (e.blockedOn = null, Au || (Au = !0, a.unstable_scheduleCallback(
      a.unstable_NormalPriority,
      cx
    )));
  }
  var Mr = null;
  function Mp(e) {
    Mr !== e && (Mr = e, a.unstable_scheduleCallback(
      a.unstable_NormalPriority,
      function() {
        Mr === e && (Mr = null);
        for (var t = 0; t < e.length; t += 3) {
          var n = e[t], l = e[t + 1], c = e[t + 2];
          if (typeof l != "function") {
            if (Ru(l || n) === null)
              continue;
            break;
          }
          var u = bs(n);
          u !== null && (e.splice(t, 3), t -= 3, Mc(
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
  function Ws(e) {
    function t(R) {
      return Tr(R, e);
    }
    Sa !== null && Tr(Sa, e), ka !== null && Tr(ka, e), Na !== null && Tr(Na, e), Wl.forEach(t), Il.forEach(t);
    for (var n = 0; n < Ca.length; n++) {
      var l = Ca[n];
      l.blockedOn === e && (l.blockedOn = null);
    }
    for (; 0 < Ca.length && (n = Ca[0], n.blockedOn === null); )
      Ep(n), n.blockedOn === null && Ca.shift();
    if (n = (e.ownerDocument || e).$$reactFormReplay, n != null)
      for (l = 0; l < n.length; l += 3) {
        var c = n[l], u = n[l + 1], _ = c[Ft] || null;
        if (typeof u == "function")
          _ || Mp(n);
        else if (_) {
          var w = null;
          if (u && u.hasAttribute("formAction")) {
            if (c = u, _ = u[Ft] || null)
              w = _.formAction;
            else if (Ru(c) !== null) continue;
          } else w = _.action;
          typeof w == "function" ? n[l + 1] = w : (n.splice(l, 3), l -= 3), Mp(n);
        }
      }
  }
  function Rp() {
    function e(u) {
      u.canIntercept && u.info === "react-transition" && u.intercept({
        handler: function() {
          return new Promise(function(_) {
            return c = _;
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
  function zu(e) {
    this._internalRoot = e;
  }
  Rr.prototype.render = zu.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(o(409));
    var n = t.current, l = an();
    wp(n, l, e, t, null, null);
  }, Rr.prototype.unmount = zu.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      wp(e.current, 2, null, e, null, null), dr(), t[ps] = null;
    }
  };
  function Rr(e) {
    this._internalRoot = e;
  }
  Rr.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Bd();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < Ca.length && t !== 0 && t < Ca[n].priority; n++) ;
      Ca.splice(n, 0, e), n === 0 && Ep(e);
    }
  };
  var Ap = i.version;
  if (Ap !== "19.2.8")
    throw Error(
      o(
        527,
        Ap,
        "19.2.8"
      )
    );
  z.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(o(188)) : (e = Object.keys(e).join(","), Error(o(268, e)));
    return e = b(t), e = e !== null ? v(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var ux = {
    bundleType: 0,
    version: "19.2.8",
    rendererPackageName: "react-dom",
    currentDispatcherRef: S,
    reconcilerVersion: "19.2.8"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Ar = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Ar.isDisabled && Ar.supportsFiber)
      try {
        Fa = Ar.inject(
          ux
        ), Dt = Ar;
      } catch {
      }
  }
  return ai.createRoot = function(e, t) {
    if (!d(e)) throw Error(o(299));
    var n = !1, l = "", c = Uf, u = Bf, _ = Ff;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (l = t.identifierPrefix), t.onUncaughtError !== void 0 && (c = t.onUncaughtError), t.onCaughtError !== void 0 && (u = t.onCaughtError), t.onRecoverableError !== void 0 && (_ = t.onRecoverableError)), t = xp(
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
      _,
      Rp
    ), e[ps] = t.current, mu(e), new zu(t);
  }, ai.hydrateRoot = function(e, t, n) {
    if (!d(e)) throw Error(o(299));
    var l = !1, c = "", u = Uf, _ = Bf, w = Ff, R = null;
    return n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (c = n.identifierPrefix), n.onUncaughtError !== void 0 && (u = n.onUncaughtError), n.onCaughtError !== void 0 && (_ = n.onCaughtError), n.onRecoverableError !== void 0 && (w = n.onRecoverableError), n.formState !== void 0 && (R = n.formState)), t = xp(
      e,
      1,
      !0,
      t,
      n ?? null,
      l,
      c,
      R,
      u,
      _,
      w,
      Rp
    ), t.context = yp(null), n = t.current, l = an(), l = jo(l), c = ha(l), c.callback = null, fa(n, c, l), n = l, t.current.lanes = n, dl(t, n), Tn(t), e[ps] = t.current, mu(e), new Rr(t);
  }, ai.version = "19.2.8", ai;
}
var Gp;
function yx() {
  if (Gp) return Hu.exports;
  Gp = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (i) {
        console.error(i);
      }
  }
  return a(), Hu.exports = xx(), Hu.exports;
}
var wx = yx();
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
var cd = /^(?:[a-z][a-z0-9+.-]*:|[\\/]{2})/i, M_ = /^[\\/]{2}/;
function jx(a, i) {
  return i + a.replace(/\\/g, "/");
}
var Vp = "popstate";
function qp(a) {
  return typeof a == "object" && a != null && "pathname" in a && "search" in a && "hash" in a && "state" in a && "key" in a;
}
function Sx(a = {}) {
  function i(d, h) {
    let {
      pathname: f = "/",
      search: m = "",
      hash: p = ""
    } = cs(d.location.hash.substring(1));
    return !f.startsWith("/") && !f.startsWith(".") && (f = "/" + f), Wu(
      "",
      { pathname: f, search: m, hash: p },
      // state defaults to `null` because `window.history.state` does
      h.state && h.state.usr || null,
      h.state && h.state.key || "default"
    );
  }
  function r(d, h) {
    let f = d.document.querySelector("base"), m = "";
    if (f && f.getAttribute("href")) {
      let p = d.location.href, b = p.indexOf("#");
      m = b === -1 ? p : p.slice(0, b);
    }
    return m + "#" + (typeof h == "string" ? h : oi(h));
  }
  function o(d, h) {
    sn(
      d.pathname.charAt(0) === "/",
      `relative pathnames are not supported in hash history.push(${JSON.stringify(
        h
      )})`
    );
  }
  return Nx(
    i,
    r,
    o,
    a
  );
}
function at(a, i) {
  if (a === !1 || a === null || typeof a > "u")
    throw new Error(i);
}
function sn(a, i) {
  if (!a) {
    typeof console < "u" && console.warn(i);
    try {
      throw new Error(i);
    } catch {
    }
  }
}
function kx() {
  return Math.random().toString(36).substring(2, 10);
}
function Yp(a, i) {
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
function Wu(a, i, r = null, o, d) {
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
    key: i && i.key || o || kx(),
    mask: d
  };
}
function oi({
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
function Nx(a, i, r, o = {}) {
  let { window: d = document.defaultView, v5Compat: h = !1 } = o, f = d.history, m = "POP", p = null, b = v();
  b == null && (b = 0, f.replaceState({ ...f.state, idx: b }, ""));
  function v() {
    return (f.state || { idx: null }).idx;
  }
  function g() {
    m = "POP";
    let C = v(), M = C == null ? null : C - b;
    b = C, p && p({ action: m, location: T.location, delta: M });
  }
  function y(C, M) {
    m = "PUSH";
    let E = qp(C) ? C : Wu(T.location, C, M);
    r && r(E, C), b = v() + 1;
    let F = Yp(E, b), P = T.createHref(E.mask || E);
    try {
      f.pushState(F, "", P);
    } catch (K) {
      if (K instanceof DOMException && K.name === "DataCloneError")
        throw K;
      d.location.assign(P);
    }
    h && p && p({ action: m, location: T.location, delta: 1 });
  }
  function j(C, M) {
    m = "REPLACE";
    let E = qp(C) ? C : Wu(T.location, C, M);
    r && r(E, C), b = v();
    let F = Yp(E, b), P = T.createHref(E.mask || E);
    f.replaceState(F, "", P), h && p && p({ action: m, location: T.location, delta: 0 });
  }
  function k(C) {
    return Cx(d, C);
  }
  let T = {
    get action() {
      return m;
    },
    get location() {
      return a(d, f);
    },
    listen(C) {
      if (p)
        throw new Error("A history only accepts one active listener");
      return d.addEventListener(Vp, g), p = C, () => {
        d.removeEventListener(Vp, g), p = null;
      };
    },
    createHref(C) {
      return i(d, C);
    },
    createURL: k,
    encodeLocation(C) {
      let M = k(C);
      return {
        pathname: M.pathname,
        search: M.search,
        hash: M.hash
      };
    },
    push: y,
    replace: j,
    go(C) {
      return f.go(C);
    }
  };
  return T;
}
function Cx(a, i, r = !1) {
  let o = "http://localhost";
  a && (o = a.location.origin !== "null" ? a.location.origin : a.location.href), at(o, "No window.location.(origin|href) available to create URL");
  let d = typeof i == "string" ? i : oi(i);
  return d = d.replace(/ $/, "%20"), !r && M_.test(d) && (d = o + d), new URL(d, o);
}
function R_(a, i, r = "/") {
  return Ex(a, i, r, !1);
}
function Ex(a, i, r, o, d) {
  let h = typeof i == "string" ? cs(i) : i, f = na(h.pathname || "/", r);
  if (f == null)
    return null;
  let m = Tx(a), p = null, b = Bx(f);
  for (let v = 0; p == null && v < m.length; ++v)
    p = Ux(
      m[v],
      b,
      o
    );
  return p;
}
function Tx(a) {
  let i = A_(a);
  return Mx(i), i;
}
function A_(a, i = [], r = [], o = "", d = !1) {
  let h = (f, m, p = d, b) => {
    let v = {
      relativePath: b === void 0 ? f.path || "" : b,
      caseSensitive: f.caseSensitive === !0,
      childrenIndex: m,
      route: f
    };
    if (v.relativePath.startsWith("/")) {
      if (!v.relativePath.startsWith(o) && p)
        return;
      at(
        v.relativePath.startsWith(o),
        `Absolute route path "${v.relativePath}" nested under path "${o}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
      ), v.relativePath = v.relativePath.slice(o.length);
    }
    let g = Sn([o, v.relativePath]), y = r.concat(v);
    f.children && f.children.length > 0 && (at(
      // Our types know better, but runtime JS may not!
      // @ts-expect-error
      f.index !== !0,
      `Index routes must not have child routes. Please remove all child routes from route path "${g}".`
    ), A_(
      f.children,
      i,
      y,
      g,
      p
    )), !(f.path == null && !f.index) && i.push({
      path: g,
      score: Lx(g, f.index),
      routesMeta: y.map((j, k) => {
        let [T, C] = O_(
          j.relativePath,
          j.caseSensitive,
          k === y.length - 1
        );
        return {
          ...j,
          matcher: T,
          compiledParams: C
        };
      })
    });
  };
  return a.forEach((f, m) => {
    if (f.path === "" || !f.path?.includes("?"))
      h(f, m);
    else
      for (let p of z_(f.path))
        h(f, m, !0, p);
  }), i;
}
function z_(a) {
  let i = a.split("/");
  if (i.length === 0) return [];
  let [r, ...o] = i, d = r.endsWith("?"), h = r.replace(/\?$/, "");
  if (o.length === 0)
    return d ? [h, ""] : [h];
  let f = z_(o.join("/")), m = [];
  return m.push(
    ...f.map(
      (p) => p === "" ? h : [h, p].join("/")
    )
  ), d && m.push(...f), m.map(
    (p) => a.startsWith("/") && p === "" ? "/" : p
  );
}
function Mx(a) {
  a.sort(
    (i, r) => i.score !== r.score ? r.score - i.score : $x(
      i.routesMeta.map((o) => o.childrenIndex),
      r.routesMeta.map((o) => o.childrenIndex)
    )
  );
}
var Rx = /^:[\w-]+$/, Ax = 3, zx = 2, Dx = 1, Ox = 10, Hx = -2, Xp = (a) => a === "*";
function Lx(a, i) {
  let r = a.split("/"), o = r.length;
  return r.some(Xp) && (o += Hx), i && (o += zx), r.filter((d) => !Xp(d)).reduce(
    (d, h) => d + (Rx.test(h) ? Ax : h === "" ? Dx : Ox),
    o
  );
}
function $x(a, i) {
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
function Ux(a, i, r = !1) {
  let { routesMeta: o } = a, d = {}, h = "/", f = [];
  for (let m = 0; m < o.length; ++m) {
    let p = o[m], b = m === o.length - 1, v = h === "/" ? i : i.slice(h.length) || "/", g = {
      path: p.relativePath,
      caseSensitive: p.caseSensitive,
      end: b
    }, y = (
      // Use precomputed matcher if it exists
      p.matcher && p.compiledParams ? D_(
        g,
        v,
        p.matcher,
        p.compiledParams
      ) : Kr(g, v)
    ), j = p.route;
    if (!y && b && r && !o[o.length - 1].route.index && (y = Kr(
      {
        path: p.relativePath,
        caseSensitive: p.caseSensitive,
        end: !1
      },
      v
    )), !y)
      return null;
    Object.assign(d, y.params), f.push({
      // TODO: Can this as be avoided?
      params: d,
      pathname: Sn([h, y.pathname]),
      pathnameBase: Vx(
        Sn([h, y.pathnameBase])
      ),
      route: j
    }), y.pathnameBase !== "/" && (h = Sn([h, y.pathnameBase]));
  }
  return f;
}
function Kr(a, i) {
  typeof a == "string" && (a = { path: a, caseSensitive: !1, end: !0 });
  let [r, o] = O_(
    a.path,
    a.caseSensitive,
    a.end
  );
  return D_(a, i, r, o);
}
function D_(a, i, r, o) {
  let d = i.match(r);
  if (!d) return null;
  let h = d[0], f = h.replace(/(.)\/+$/, "$1"), m = d.slice(1);
  return {
    params: o.reduce(
      (b, { paramName: v, isOptional: g }, y) => {
        if (v === "*") {
          let k = m[y] || "";
          f = h.slice(0, h.length - k.length).replace(/(.)\/+$/, "$1");
        }
        const j = m[y];
        return g && !j ? b[v] = void 0 : b[v] = (j || "").replace(/%2F/g, "/"), b;
      },
      {}
    ),
    pathname: h,
    pathnameBase: f,
    pattern: a
  };
}
function O_(a, i = !1, r = !0) {
  sn(
    a === "*" || !a.endsWith("*") || a.endsWith("/*"),
    `Route path "${a}" will be treated as if it were "${a.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${a.replace(/\*$/, "/*")}".`
  );
  let o = [], d = "^" + a.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(
    /\/:([\w-]+)(\?)?/g,
    (f, m, p, b, v) => {
      if (o.push({ paramName: m, isOptional: p != null }), p) {
        let g = v.charAt(b + f.length);
        return g && g !== "/" ? "/([^\\/]*)" : "(?:/([^\\/]*))?";
      }
      return "/([^\\/]+)";
    }
  ).replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
  return a.endsWith("*") ? (o.push({ paramName: "*" }), d += a === "*" || a === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$") : r ? d += "\\/*$" : a !== "" && a !== "/" && (d += "(?:(?=\\/|$))"), [new RegExp(d, i ? void 0 : "i"), o];
}
function Bx(a) {
  try {
    return a.split("/").map((i) => decodeURIComponent(i).replace(/\//g, "%2F")).join("/");
  } catch (i) {
    return sn(
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
function Fx(a, i = "/") {
  let {
    pathname: r,
    search: o = "",
    hash: d = ""
  } = typeof a == "string" ? cs(a) : a, h;
  return r ? (r = H_(r), r.startsWith("/") ? h = Qp(r.substring(1), "/") : h = Qp(r, i)) : h = i, {
    pathname: h,
    search: qx(o),
    hash: Yx(d)
  };
}
function Qp(a, i) {
  let r = Jr(i).split("/");
  return a.split("/").forEach((d) => {
    d === ".." ? r.length > 1 && r.pop() : d !== "." && r.push(d);
  }), r.length > 1 ? r.join("/") : "/";
}
function Bu(a, i, r, o) {
  return `Cannot include a '${a}' character in a manually specified \`to.${i}\` field [${JSON.stringify(
    o
  )}].  Please separate it out to the \`to.${r}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function Gx(a) {
  return a.filter(
    (i, r) => r === 0 || i.route.path && i.route.path.length > 0
  );
}
function ud(a) {
  let i = Gx(a);
  return i.map(
    (r, o) => o === i.length - 1 ? r.pathname : r.pathnameBase
  );
}
function so(a, i, r, o = !1) {
  let d;
  typeof a == "string" ? d = cs(a) : (d = { ...a }, at(
    !d.pathname || !d.pathname.includes("?"),
    Bu("?", "pathname", "search", d)
  ), at(
    !d.pathname || !d.pathname.includes("#"),
    Bu("#", "pathname", "hash", d)
  ), at(
    !d.search || !d.search.includes("#"),
    Bu("#", "search", "hash", d)
  ));
  let h = a === "" || d.pathname === "", f = h ? "/" : d.pathname, m;
  if (f == null)
    m = r;
  else {
    let g = i.length - 1;
    if (!o && f.startsWith("..")) {
      let y = f.split("/");
      for (; y[0] === ".."; )
        y.shift(), g -= 1;
      d.pathname = y.join("/");
    }
    m = g >= 0 ? i[g] : "/";
  }
  let p = Fx(d, m), b = f && f !== "/" && f.endsWith("/"), v = (h || f === ".") && r.endsWith("/");
  return !p.pathname.endsWith("/") && (b || v) && (p.pathname += "/"), p;
}
var H_ = (a) => a.replace(/[\\/]{2,}/g, "/"), Sn = (a) => H_(a.join("/")), Jr = (a) => a.replace(/\/+$/, ""), Vx = (a) => Jr(a).replace(/^\/*/, "/"), qx = (a) => !a || a === "?" ? "" : a.startsWith("?") ? a : "?" + a, Yx = (a) => !a || a === "#" ? "" : a.startsWith("#") ? a : "#" + a, Xx = class {
  constructor(a, i, r, o = !1) {
    this.status = a, this.statusText = i || "", this.internal = o, r instanceof Error ? (this.data = r.toString(), this.error = r) : this.data = r;
  }
};
function Qx(a) {
  return a != null && typeof a.status == "number" && typeof a.statusText == "string" && typeof a.internal == "boolean" && "data" in a;
}
function Zx(a) {
  let i = a.map((r) => r.route.path).filter(Boolean);
  return Sn(i) || "/";
}
var L_ = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
function $_(a, i) {
  let r = a;
  if (typeof r != "string" || !cd.test(r))
    return {
      absoluteURL: void 0,
      isExternal: !1,
      to: r
    };
  let o = r, d = !1;
  if (L_)
    try {
      let h = new URL(window.location.href), f = M_.test(r) ? new URL(jx(r, h.protocol)) : new URL(r), m = na(f.pathname, i);
      f.origin === h.origin && m != null ? r = m + f.search + f.hash : d = !0;
    } catch {
      sn(
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
var U_ = [
  "POST",
  "PUT",
  "PATCH",
  "DELETE"
];
new Set(
  U_
);
var Kx = [
  "GET",
  ...U_
];
new Set(Kx);
var Jx = [
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
function Px(a) {
  try {
    return Jx.includes(new URL(a).protocol);
  } catch {
    return !1;
  }
}
var al = x.createContext(null);
al.displayName = "DataRouter";
var lo = x.createContext(null);
lo.displayName = "DataRouterState";
var B_ = x.createContext(!1);
function Wx() {
  return x.useContext(B_);
}
var F_ = x.createContext({
  isTransitioning: !1
});
F_.displayName = "ViewTransition";
var Ix = x.createContext(
  /* @__PURE__ */ new Map()
);
Ix.displayName = "Fetchers";
var ey = x.createContext(null);
ey.displayName = "Await";
var ln = x.createContext(
  null
);
ln.displayName = "Navigation";
var ui = x.createContext(
  null
);
ui.displayName = "Location";
var zn = x.createContext({
  outlet: null,
  matches: [],
  isDataRoute: !1
});
zn.displayName = "Route";
var dd = x.createContext(null);
dd.displayName = "RouteError";
var G_ = "REACT_ROUTER_ERROR", ty = "REDIRECT", ny = "ROUTE_ERROR_RESPONSE";
function ay(a) {
  if (a.startsWith(`${G_}:${ty}:{`))
    try {
      let i = JSON.parse(a.slice(28));
      if (typeof i == "object" && i && typeof i.status == "number" && typeof i.statusText == "string" && typeof i.location == "string" && typeof i.reloadDocument == "boolean" && typeof i.replace == "boolean")
        return i;
    } catch {
    }
}
function sy(a) {
  if (a.startsWith(
    `${G_}:${ny}:{`
  ))
    try {
      let i = JSON.parse(a.slice(40));
      if (typeof i == "object" && i && typeof i.status == "number" && typeof i.statusText == "string")
        return new Xx(
          i.status,
          i.statusText,
          i.data
        );
    } catch {
    }
}
function ly(a, { relative: i } = {}) {
  at(
    sl(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useHref() may be used only in the context of a <Router> component."
  );
  let { basename: r, navigator: o } = x.useContext(ln), { hash: d, pathname: h, search: f } = di(a, { relative: i }), m = h;
  return r !== "/" && (m = h === "/" ? r : Sn([r, h])), o.createHref({ pathname: m, search: f, hash: d });
}
function sl() {
  return x.useContext(ui) != null;
}
function zt() {
  return at(
    sl(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useLocation() may be used only in the context of a <Router> component."
  ), x.useContext(ui).location;
}
var V_ = "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function q_(a) {
  x.useContext(ln).static || x.useLayoutEffect(a);
}
function pt() {
  let { isDataRoute: a } = x.useContext(zn);
  return a ? gy() : iy();
}
function iy() {
  at(
    sl(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useNavigate() may be used only in the context of a <Router> component."
  );
  let a = x.useContext(al), { basename: i, navigator: r } = x.useContext(ln), { matches: o } = x.useContext(zn), { pathname: d } = zt(), h = JSON.stringify(ud(o)), f = x.useRef(!1);
  return q_(() => {
    f.current = !0;
  }), x.useCallback(
    (p, b = {}) => {
      if (sn(f.current, V_), !f.current) return;
      if (typeof p == "number") {
        r.go(p);
        return;
      }
      let v = so(
        p,
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
function di(a, { relative: i } = {}) {
  let { matches: r } = x.useContext(zn), { pathname: o } = zt(), d = JSON.stringify(ud(r));
  return x.useMemo(
    () => so(
      a,
      JSON.parse(d),
      o,
      i === "path"
    ),
    [a, d, o, i]
  );
}
function ry(a, i) {
  return Y_(a, i);
}
function Y_(a, i, r) {
  at(
    sl(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useRoutes() may be used only in the context of a <Router> component."
  );
  let { navigator: o } = x.useContext(ln), { matches: d } = x.useContext(zn), h = d[d.length - 1], f = h ? h.params : {}, m = h ? h.pathname : "/", p = h ? h.pathnameBase : "/", b = h && h.route;
  {
    let C = b && b.path || "";
    Q_(
      m,
      !b || C.endsWith("*") || C.endsWith("*?"),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${m}" (under <Route path="${C}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${C}"> to <Route path="${C === "/" ? "*" : `${C}/*`}">.`
    );
  }
  let v = zt(), g;
  if (i) {
    let C = typeof i == "string" ? cs(i) : i;
    at(
      p === "/" || C.pathname?.startsWith(p),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${p}" but pathname "${C.pathname}" was given in the \`location\` prop.`
    ), g = C;
  } else
    g = v;
  let y = g.pathname || "/", j = y;
  if (p !== "/") {
    let C = p.replace(/^\//, "").split("/");
    j = "/" + y.replace(/^\//, "").split("/").slice(C.length).join("/");
  }
  let k = r && r.state.matches.length ? (
    // If we're in a data router, use the matches we've already identified but ensure
    // we have the latest route instances from the manifest in case elements have changed
    r.state.matches.map(
      (C) => Object.assign(C, {
        route: r.manifest[C.route.id] || C.route
      })
    )
  ) : R_(a, { pathname: j });
  sn(
    b || k != null,
    `No routes matched location "${g.pathname}${g.search}${g.hash}" `
  ), sn(
    k == null || k[k.length - 1].route.element !== void 0 || k[k.length - 1].route.Component !== void 0 || k[k.length - 1].route.lazy !== void 0,
    `Matched leaf route at location "${g.pathname}${g.search}${g.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`
  );
  let T = hy(
    k && k.map(
      (C) => Object.assign({}, C, {
        params: Object.assign({}, f, C.params),
        pathname: Sn([
          p,
          // Re-encode pathnames that were decoded inside matchRoutes.
          // Pre-encode `%`, `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          o.encodeLocation ? o.encodeLocation(
            C.pathname.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : C.pathname
        ]),
        pathnameBase: C.pathnameBase === "/" ? p : Sn([
          p,
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
  return i && T ? /* @__PURE__ */ x.createElement(
    ui.Provider,
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
    T
  ) : T;
}
function oy() {
  let a = by(), i = Qx(a) ? `${a.status} ${a.statusText}` : a instanceof Error ? a.message : JSON.stringify(a), r = a instanceof Error ? a.stack : null, o = "rgba(200,200,200, 0.5)", d = { padding: "0.5rem", backgroundColor: o }, h = { padding: "2px 4px", backgroundColor: o }, f = null;
  return console.error(
    "Error handled by React Router default ErrorBoundary:",
    a
  ), f = /* @__PURE__ */ x.createElement(x.Fragment, null, /* @__PURE__ */ x.createElement("p", null, "💿 Hey developer 👋"), /* @__PURE__ */ x.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /* @__PURE__ */ x.createElement("code", { style: h }, "ErrorBoundary"), " or", " ", /* @__PURE__ */ x.createElement("code", { style: h }, "errorElement"), " prop on your route.")), /* @__PURE__ */ x.createElement(x.Fragment, null, /* @__PURE__ */ x.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ x.createElement("h3", { style: { fontStyle: "italic" } }, i), r ? /* @__PURE__ */ x.createElement("pre", { style: d }, r) : null, f);
}
var cy = /* @__PURE__ */ x.createElement(oy, null), X_ = class extends x.Component {
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
      const r = sy(a.digest);
      r && (a = r);
    }
    let i = a !== void 0 ? /* @__PURE__ */ x.createElement(zn.Provider, { value: this.props.routeContext }, /* @__PURE__ */ x.createElement(
      dd.Provider,
      {
        value: a,
        children: this.props.component
      }
    )) : this.props.children;
    return this.context ? /* @__PURE__ */ x.createElement(uy, { error: a }, i) : i;
  }
};
X_.contextType = B_;
var Fu = /* @__PURE__ */ new WeakMap();
function uy({
  children: a,
  error: i
}) {
  let { basename: r } = x.useContext(ln);
  if (typeof i == "object" && i && "digest" in i && typeof i.digest == "string") {
    let o = ay(i.digest);
    if (o) {
      let d = Fu.get(i);
      if (d) throw d;
      let h = $_(o.location, r), f = h.absoluteURL || h.to;
      if (Px(f))
        throw new Error("Invalid redirect location");
      if (L_ && !Fu.get(i))
        if (h.isExternal || o.reloadDocument)
          window.location.href = f;
        else {
          const m = Promise.resolve().then(
            () => window.__reactRouterDataRouter.navigate(h.to, {
              replace: o.replace
            })
          );
          throw Fu.set(i, m), m;
        }
      return /* @__PURE__ */ x.createElement("meta", { httpEquiv: "refresh", content: `0;url=${f}` });
    }
  }
  return a;
}
function dy({ routeContext: a, match: i, children: r }) {
  let o = x.useContext(al);
  return o && o.static && o.staticContext && (i.route.errorElement || i.route.ErrorBoundary) && (o.staticContext._deepestRenderedBoundaryId = i.route.id), /* @__PURE__ */ x.createElement(zn.Provider, { value: a }, r);
}
function hy(a, i = [], r) {
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
    at(
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
        let { loaderData: y, errors: j } = o, k = g.route.loader && !y.hasOwnProperty(g.route.id) && (!j || j[g.route.id] === void 0);
        if (g.route.lazy || k) {
          r.isStatic && (f = !0), m >= 0 ? d = d.slice(0, m + 1) : d = [d[0]];
          break;
        }
      }
    }
  }
  let p = r?.onError, b = o && p ? (v, g) => {
    p(v, {
      location: o.location,
      params: o.matches?.[0]?.params ?? {},
      pattern: Zx(o.matches),
      errorInfo: g
    });
  } : void 0;
  return d.reduceRight(
    (v, g, y) => {
      let j, k = !1, T = null, C = null;
      o && (j = h && g.route.id ? h[g.route.id] : void 0, T = g.route.errorElement || cy, f && (m < 0 && y === 0 ? (Q_(
        "route-fallback",
        !1,
        "No `HydrateFallback` element provided to render during initial hydration"
      ), k = !0, C = null) : m === y && (k = !0, C = g.route.hydrateFallbackElement || null)));
      let M = i.concat(d.slice(0, y + 1)), E = () => {
        let F;
        return j ? F = T : k ? F = C : g.route.Component ? F = /* @__PURE__ */ x.createElement(g.route.Component, null) : g.route.element ? F = g.route.element : F = v, /* @__PURE__ */ x.createElement(
          dy,
          {
            match: g,
            routeContext: {
              outlet: v,
              matches: M,
              isDataRoute: o != null
            },
            children: F
          }
        );
      };
      return o && (g.route.ErrorBoundary || g.route.errorElement || y === 0) ? /* @__PURE__ */ x.createElement(
        X_,
        {
          location: o.location,
          revalidation: o.revalidation,
          component: T,
          error: j,
          children: E(),
          routeContext: { outlet: null, matches: M, isDataRoute: !0 },
          onError: b
        }
      ) : E();
    },
    null
  );
}
function hd(a) {
  return `${a} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function fy(a) {
  let i = x.useContext(al);
  return at(i, hd(a)), i;
}
function my(a) {
  let i = x.useContext(lo);
  return at(i, hd(a)), i;
}
function py(a) {
  let i = x.useContext(zn);
  return at(i, hd(a)), i;
}
function fd(a) {
  let i = py(a), r = i.matches[i.matches.length - 1];
  return at(
    r.route.id,
    `${a} can only be used on routes that contain a unique "id"`
  ), r.route.id;
}
function _y() {
  return fd(
    "useRouteId"
    /* UseRouteId */
  );
}
function by() {
  let a = x.useContext(dd), i = my(
    "useRouteError"
    /* UseRouteError */
  ), r = fd(
    "useRouteError"
    /* UseRouteError */
  );
  return a !== void 0 ? a : i.errors?.[r];
}
function gy() {
  let { router: a } = fy(
    "useNavigate"
    /* UseNavigateStable */
  ), i = fd(
    "useNavigate"
    /* UseNavigateStable */
  ), r = x.useRef(!1);
  return q_(() => {
    r.current = !0;
  }), x.useCallback(
    async (d, h = {}) => {
      sn(r.current, V_), r.current && (typeof d == "number" ? await a.navigate(d) : await a.navigate(d, { fromRouteId: i, ...h }));
    },
    [a, i]
  );
}
var Zp = {};
function Q_(a, i, r) {
  !i && !Zp[a] && (Zp[a] = !0, sn(!1, r));
}
x.memo(vy);
function vy({
  routes: a,
  manifest: i,
  future: r,
  state: o,
  isStatic: d,
  onError: h
}) {
  return Y_(a, void 0, {
    manifest: i,
    state: o,
    isStatic: d,
    onError: h
  });
}
function Aa({
  to: a,
  replace: i,
  state: r,
  relative: o
}) {
  at(
    sl(),
    // TODO: This error is probably because they somehow have 2 versions of
    // the router loaded. We can help them understand how to avoid that.
    "<Navigate> may be used only in the context of a <Router> component."
  );
  let { static: d } = x.useContext(ln);
  sn(
    !d,
    "<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change."
  );
  let { matches: h } = x.useContext(zn), { pathname: f } = zt(), m = pt(), p = so(
    a,
    ud(h),
    f,
    o === "path"
  ), b = JSON.stringify(p);
  return x.useEffect(() => {
    m(JSON.parse(b), { replace: i, state: r, relative: o });
  }, [m, b, o, i, r]), null;
}
function Oe(a) {
  at(
    !1,
    "A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>."
  );
}
function xy({
  basename: a = "/",
  children: i = null,
  location: r,
  navigationType: o = "POP",
  navigator: d,
  static: h = !1,
  useTransitions: f
}) {
  at(
    !sl(),
    "You cannot render a <Router> inside another <Router>. You should never have more than one in your app."
  );
  let m = a.replace(/^\/*/, "/"), p = x.useMemo(
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
    state: y = null,
    key: j = "default",
    mask: k
  } = r, T = x.useMemo(() => {
    let C = na(b, m);
    return C == null ? null : {
      location: {
        pathname: C,
        search: v,
        hash: g,
        state: y,
        key: j,
        mask: k
      },
      navigationType: o
    };
  }, [m, b, v, g, y, j, o, k]);
  return sn(
    T != null,
    `<Router basename="${m}"> is not able to match the URL "${b}${v}${g}" because it does not start with the basename, so the <Router> won't render anything.`
  ), T == null ? null : /* @__PURE__ */ x.createElement(ln.Provider, { value: p }, /* @__PURE__ */ x.createElement(ui.Provider, { children: i, value: T }));
}
function yy({
  children: a,
  location: i
}) {
  return ry(Iu(a), i);
}
function Iu(a, i = []) {
  let r = [];
  return x.Children.forEach(a, (o, d) => {
    if (!x.isValidElement(o))
      return;
    let h = [...i, d];
    if (o.type === x.Fragment) {
      r.push.apply(
        r,
        Iu(o.props.children, h)
      );
      return;
    }
    at(
      o.type === Oe,
      `[${typeof o.type == "string" ? o.type : o.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`
    ), at(
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
    o.props.children && (f.children = Iu(
      o.props.children,
      h
    )), r.push(f);
  }), r;
}
var Vr = "get", qr = "application/x-www-form-urlencoded";
function io(a) {
  return typeof HTMLElement < "u" && a instanceof HTMLElement;
}
function wy(a) {
  return io(a) && a.tagName.toLowerCase() === "button";
}
function jy(a) {
  return io(a) && a.tagName.toLowerCase() === "form";
}
function Sy(a) {
  return io(a) && a.tagName.toLowerCase() === "input";
}
function ky(a) {
  return !!(a.metaKey || a.altKey || a.ctrlKey || a.shiftKey);
}
function Ny(a, i) {
  return a.button === 0 && // Ignore everything but left clicks
  (!i || i === "_self") && // Let browser handle "target=_blank" etc.
  !ky(a);
}
function ed(a = "") {
  return new URLSearchParams(
    typeof a == "string" || Array.isArray(a) || a instanceof URLSearchParams ? a : Object.keys(a).reduce((i, r) => {
      let o = a[r];
      return i.concat(
        Array.isArray(o) ? o.map((d) => [r, d]) : [[r, o]]
      );
    }, [])
  );
}
function Cy(a, i) {
  let r = ed(a);
  return i && i.forEach((o, d) => {
    r.has(d) || i.getAll(d).forEach((h) => {
      r.append(d, h);
    });
  }), r;
}
var zr = null;
function Ey() {
  if (zr === null)
    try {
      new FormData(
        document.createElement("form"),
        // @ts-expect-error if FormData supports the submitter parameter, this will throw
        0
      ), zr = !1;
    } catch {
      zr = !0;
    }
  return zr;
}
var Ty = /* @__PURE__ */ new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
]);
function Gu(a) {
  return a != null && !Ty.has(a) ? (sn(
    !1,
    `"${a}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${qr}"`
  ), null) : a;
}
function My(a, i) {
  let r, o, d, h, f;
  if (jy(a)) {
    let m = a.getAttribute("action");
    o = m ? na(m, i) : null, r = a.getAttribute("method") || Vr, d = Gu(a.getAttribute("enctype")) || qr, h = new FormData(a);
  } else if (wy(a) || Sy(a) && (a.type === "submit" || a.type === "image")) {
    let m = a.form;
    if (m == null)
      throw new Error(
        'Cannot submit a <button> or <input type="submit"> without a <form>'
      );
    let p = a.getAttribute("formaction") || m.getAttribute("action");
    if (o = p ? na(p, i) : null, r = a.getAttribute("formmethod") || m.getAttribute("method") || Vr, d = Gu(a.getAttribute("formenctype")) || Gu(m.getAttribute("enctype")) || qr, h = new FormData(m, a), !Ey()) {
      let { name: b, type: v, value: g } = a;
      if (v === "image") {
        let y = b ? `${b}.` : "";
        h.append(`${y}x`, "0"), h.append(`${y}y`, "0");
      } else b && h.append(b, g);
    }
  } else {
    if (io(a))
      throw new Error(
        'Cannot submit element that is not <form>, <button>, or <input type="submit|image">'
      );
    r = Vr, o = null, d = qr, f = a;
  }
  return h && d === "text/plain" && (f = h, h = void 0), { action: o, method: r.toLowerCase(), encType: d, formData: h, body: f };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function md(a, i) {
  if (a === !1 || a === null || typeof a > "u")
    throw new Error(i);
}
function Z_(a, i, r, o) {
  let d = typeof a == "string" ? new URL(
    a,
    // This can be called during the SSR flow via PrefetchPageLinksImpl so
    // don't assume window is available
    typeof window > "u" ? "server://singlefetch/" : window.location.origin
  ) : a;
  return r ? d.pathname.endsWith("/") ? d.pathname = `${d.pathname}_.${o}` : d.pathname = `${d.pathname}.${o}` : d.pathname === "/" ? d.pathname = `_root.${o}` : i && na(d.pathname, i) === "/" ? d.pathname = `${Jr(i)}/_root.${o}` : d.pathname = `${Jr(d.pathname)}.${o}`, d;
}
async function Ry(a, i) {
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
function Ay(a) {
  return a == null ? !1 : a.href == null ? a.rel === "preload" && typeof a.imageSrcSet == "string" && typeof a.imageSizes == "string" : typeof a.rel == "string" && typeof a.href == "string";
}
async function zy(a, i, r) {
  let o = await Promise.all(
    a.map(async (d) => {
      let h = i.routes[d.route.id];
      if (h) {
        let f = await Ry(h, r);
        return f.links ? f.links() : [];
      }
      return [];
    })
  );
  return Ly(
    o.flat(1).filter(Ay).filter((d) => d.rel === "stylesheet" || d.rel === "preload").map(
      (d) => d.rel === "stylesheet" ? { ...d, rel: "prefetch", as: "style" } : { ...d, rel: "prefetch" }
    )
  );
}
function Kp(a, i, r, o, d, h) {
  let f = (p, b) => r[b] ? p.route.id !== r[b].route.id : !0, m = (p, b) => (
    // param change, /users/123 -> /users/456
    r[b].pathname !== p.pathname || // splat param changed, which is not present in match.path
    // e.g. /files/images/avatar.jpg -> files/finances.xls
    r[b].route.path?.endsWith("*") && r[b].params["*"] !== p.params["*"]
  );
  return h === "assets" ? i.filter(
    (p, b) => f(p, b) || m(p, b)
  ) : h === "data" ? i.filter((p, b) => {
    let v = o.routes[p.route.id];
    if (!v || !v.hasLoader)
      return !1;
    if (f(p, b) || m(p, b))
      return !0;
    if (p.route.shouldRevalidate) {
      let g = p.route.shouldRevalidate({
        currentUrl: new URL(
          d.pathname + d.search + d.hash,
          window.origin
        ),
        currentParams: r[0]?.params || {},
        nextUrl: new URL(a, window.origin),
        nextParams: p.params,
        defaultShouldRevalidate: !0
      });
      if (typeof g == "boolean")
        return g;
    }
    return !0;
  }) : [];
}
function Dy(a, i, { includeHydrateFallback: r } = {}) {
  return Oy(
    a.map((o) => {
      let d = i.routes[o.route.id];
      if (!d) return [];
      let h = [d.module];
      return d.clientActionModule && (h = h.concat(d.clientActionModule)), d.clientLoaderModule && (h = h.concat(d.clientLoaderModule)), r && d.hydrateFallbackModule && (h = h.concat(d.hydrateFallbackModule)), d.imports && (h = h.concat(d.imports)), h;
    }).flat(1)
  );
}
function Oy(a) {
  return [...new Set(a)];
}
function Hy(a) {
  let i = {}, r = Object.keys(a).sort();
  for (let o of r)
    i[o] = a[o];
  return i;
}
function Ly(a, i) {
  let r = /* @__PURE__ */ new Set();
  return new Set(i), a.reduce((o, d) => {
    let h = JSON.stringify(Hy(d));
    return r.has(h) || (r.add(h), o.push({ key: h, link: d })), o;
  }, []);
}
function pd() {
  let a = x.useContext(al);
  return md(
    a,
    "You must render this element inside a <DataRouterContext.Provider> element"
  ), a;
}
function $y() {
  let a = x.useContext(lo);
  return md(
    a,
    "You must render this element inside a <DataRouterStateContext.Provider> element"
  ), a;
}
var _d = x.createContext(void 0);
_d.displayName = "FrameworkContext";
function ro() {
  let a = x.useContext(_d);
  return md(
    a,
    "You must render this element inside a <HydratedRouter> element"
  ), a;
}
function Uy(a, i) {
  let r = x.useContext(_d), [o, d] = x.useState(!1), [h, f] = x.useState(!1), { onFocus: m, onBlur: p, onMouseEnter: b, onMouseLeave: v, onTouchStart: g } = i, y = x.useRef(null);
  x.useEffect(() => {
    if (a === "render" && f(!0), a === "viewport") {
      let T = (M) => {
        M.forEach((E) => {
          f(E.isIntersecting);
        });
      }, C = new IntersectionObserver(T, { threshold: 0.5 });
      return y.current && C.observe(y.current), () => {
        C.disconnect();
      };
    }
  }, [a]), x.useEffect(() => {
    if (o) {
      let T = setTimeout(() => {
        f(!0);
      }, 100);
      return () => {
        clearTimeout(T);
      };
    }
  }, [o]);
  let j = () => {
    d(!0);
  }, k = () => {
    d(!1), f(!1);
  };
  return r ? a !== "intent" ? [h, y, {}] : [
    h,
    y,
    {
      onFocus: si(m, j),
      onBlur: si(p, k),
      onMouseEnter: si(b, j),
      onMouseLeave: si(v, k),
      onTouchStart: si(g, j)
    }
  ] : [!1, y, {}];
}
function si(a, i) {
  return (r) => {
    a && a(r), r.defaultPrevented || i(r);
  };
}
function By({ page: a, ...i }) {
  let r = Wx(), { nonce: o } = ro(), { router: d } = pd(), h = x.useMemo(
    () => R_(d.routes, a, d.basename),
    [d.routes, a, d.basename]
  );
  return h ? (i.nonce == null && o && (i = { ...i, nonce: o }), r ? /* @__PURE__ */ x.createElement(Gy, { page: a, matches: h, ...i }) : /* @__PURE__ */ x.createElement(Vy, { page: a, matches: h, ...i })) : null;
}
function Fy(a) {
  let { manifest: i, routeModules: r } = ro(), [o, d] = x.useState([]);
  return x.useEffect(() => {
    let h = !1;
    return zy(a, i, r).then(
      (f) => {
        h || d(f);
      }
    ), () => {
      h = !0;
    };
  }, [a, i, r]), o;
}
function Gy({
  page: a,
  matches: i,
  ...r
}) {
  let o = zt(), { future: d } = ro(), { basename: h } = pd(), f = x.useMemo(() => {
    if (a === o.pathname + o.search + o.hash)
      return [];
    let m = Z_(
      a,
      h,
      d.v8_trailingSlashAwareDataRequests,
      "rsc"
    ), p = !1, b = [];
    for (let v of i)
      typeof v.route.shouldRevalidate == "function" ? p = !0 : b.push(v.route.id);
    return p && b.length > 0 && m.searchParams.set("_routes", b.join(",")), [m.pathname + m.search];
  }, [
    h,
    d.v8_trailingSlashAwareDataRequests,
    a,
    o,
    i
  ]);
  return /* @__PURE__ */ x.createElement(x.Fragment, null, f.map((m) => /* @__PURE__ */ x.createElement("link", { key: m, rel: "prefetch", as: "fetch", href: m, ...r })));
}
function Vy({
  page: a,
  matches: i,
  ...r
}) {
  let o = zt(), { future: d, manifest: h, routeModules: f } = ro(), { basename: m } = pd(), { loaderData: p, matches: b } = $y(), v = x.useMemo(
    () => Kp(
      a,
      i,
      b,
      h,
      o,
      "data"
    ),
    [a, i, b, h, o]
  ), g = x.useMemo(
    () => Kp(
      a,
      i,
      b,
      h,
      o,
      "assets"
    ),
    [a, i, b, h, o]
  ), y = x.useMemo(() => {
    if (a === o.pathname + o.search + o.hash)
      return [];
    let T = /* @__PURE__ */ new Set(), C = !1;
    if (i.forEach((E) => {
      let F = h.routes[E.route.id];
      !F || !F.hasLoader || (!v.some((P) => P.route.id === E.route.id) && E.route.id in p && f[E.route.id]?.shouldRevalidate || F.hasClientLoader ? C = !0 : T.add(E.route.id));
    }), T.size === 0)
      return [];
    let M = Z_(
      a,
      m,
      d.v8_trailingSlashAwareDataRequests,
      "data"
    );
    return C && T.size > 0 && M.searchParams.set(
      "_routes",
      i.filter((E) => T.has(E.route.id)).map((E) => E.route.id).join(",")
    ), [M.pathname + M.search];
  }, [
    m,
    d.v8_trailingSlashAwareDataRequests,
    p,
    o,
    h,
    v,
    i,
    a,
    f
  ]), j = x.useMemo(
    () => Dy(g, h),
    [g, h]
  ), k = Fy(g);
  return /* @__PURE__ */ x.createElement(x.Fragment, null, y.map((T) => /* @__PURE__ */ x.createElement("link", { key: T, rel: "prefetch", as: "fetch", href: T, ...r })), j.map((T) => /* @__PURE__ */ x.createElement("link", { key: T, rel: "modulepreload", href: T, ...r })), k.map(({ key: T, link: C }) => (
    // these don't spread `linkProps` because they are full link descriptors
    // already with their own props
    /* @__PURE__ */ x.createElement(
      "link",
      {
        key: T,
        nonce: r.nonce,
        ...C,
        crossOrigin: C.crossOrigin ?? r.crossOrigin
      }
    )
  )));
}
function qy(...a) {
  return (i) => {
    a.forEach((r) => {
      typeof r == "function" ? r(i) : r != null && (r.current = i);
    });
  };
}
var Yy = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
try {
  Yy && (window.__reactRouterVersion = // @ts-expect-error
  "7.18.2");
} catch {
}
function Xy({
  basename: a,
  children: i,
  useTransitions: r,
  window: o
}) {
  let d = x.useRef();
  d.current == null && (d.current = Sx({ window: o, v5Compat: !0 }));
  let h = d.current, [f, m] = x.useState({
    action: h.action,
    location: h.location
  }), p = x.useCallback(
    (b) => {
      r === !1 ? m(b) : x.startTransition(() => m(b));
    },
    [r]
  );
  return x.useLayoutEffect(() => h.listen(p), [h, p]), /* @__PURE__ */ x.createElement(
    xy,
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
var ci = x.forwardRef(
  function({
    onClick: i,
    discover: r = "render",
    prefetch: o = "none",
    relative: d,
    reloadDocument: h,
    replace: f,
    mask: m,
    state: p,
    target: b,
    to: v,
    preventScrollReset: g,
    viewTransition: y,
    defaultShouldRevalidate: j,
    ...k
  }, T) {
    let { basename: C, navigator: M, useTransitions: E } = x.useContext(ln), F = typeof v == "string" && cd.test(v), P = $_(v, C);
    v = P.to;
    let K = ly(v, { relative: d }), L = zt(), G = null;
    if (m) {
      let oe = so(
        m,
        [],
        L.mask ? L.mask.pathname : "/",
        !0
      );
      C !== "/" && (oe.pathname = oe.pathname === "/" ? C : Sn([C, oe.pathname])), G = M.createHref(oe);
    }
    let [ee, le, te] = Uy(
      o,
      k
    ), ue = Ky(v, {
      replace: f,
      mask: m,
      state: p,
      target: b,
      preventScrollReset: g,
      relative: d,
      viewTransition: y,
      defaultShouldRevalidate: j,
      useTransitions: E
    });
    function ie(oe) {
      i && i(oe), oe.defaultPrevented || ue(oe);
    }
    let re = !(P.isExternal || h), fe = (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      /* @__PURE__ */ x.createElement(
        "a",
        {
          ...k,
          ...te,
          href: (re ? G : void 0) || P.absoluteURL || K,
          onClick: re ? ie : i,
          ref: qy(T, le),
          target: b,
          "data-discover": !F && r === "render" ? "true" : void 0
        }
      )
    );
    return ee && !F ? /* @__PURE__ */ x.createElement(x.Fragment, null, fe, /* @__PURE__ */ x.createElement(By, { page: K })) : fe;
  }
);
ci.displayName = "Link";
var Yr = x.forwardRef(
  function({
    "aria-current": i = "page",
    caseSensitive: r = !1,
    className: o = "",
    end: d = !1,
    style: h,
    to: f,
    viewTransition: m,
    children: p,
    ...b
  }, v) {
    let g = di(f, { relative: b.relative }), y = zt(), j = x.useContext(lo), { navigator: k, basename: T } = x.useContext(ln), C = j != null && // Conditional usage is OK here because the usage of a data router is static
    // eslint-disable-next-line react-hooks/rules-of-hooks
    e0(g) && m === !0, M = k.encodeLocation ? k.encodeLocation(g).pathname : g.pathname, E = y.pathname, F = j && j.navigation && j.navigation.location ? j.navigation.location.pathname : null;
    r || (E = E.toLowerCase(), F = F ? F.toLowerCase() : null, M = M.toLowerCase()), F && T && (F = na(F, T) || F);
    const P = M !== "/" && M.endsWith("/") ? M.length - 1 : M.length;
    let K = E === M || !d && E.startsWith(M) && E.charAt(P) === "/", L = F != null && (F === M || !d && F.startsWith(M) && F.charAt(M.length) === "/"), G = {
      isActive: K,
      isPending: L,
      isTransitioning: C
    }, ee = K ? i : void 0, le;
    typeof o == "function" ? le = o(G) : le = [
      o,
      K ? "active" : null,
      L ? "pending" : null,
      C ? "transitioning" : null
    ].filter(Boolean).join(" ");
    let te = typeof h == "function" ? h(G) : h;
    return /* @__PURE__ */ x.createElement(
      ci,
      {
        ...b,
        "aria-current": ee,
        className: le,
        ref: v,
        style: te,
        to: f,
        viewTransition: m
      },
      typeof p == "function" ? p(G) : p
    );
  }
);
Yr.displayName = "NavLink";
var Qy = x.forwardRef(
  ({
    discover: a = "render",
    fetcherKey: i,
    navigate: r,
    reloadDocument: o,
    replace: d,
    state: h,
    method: f = Vr,
    action: m,
    onSubmit: p,
    relative: b,
    preventScrollReset: v,
    viewTransition: g,
    defaultShouldRevalidate: y,
    ...j
  }, k) => {
    let { useTransitions: T } = x.useContext(ln), C = Wy(), M = Iy(m, { relative: b }), E = f.toLowerCase() === "get" ? "get" : "post", F = typeof m == "string" && cd.test(m), P = (K) => {
      if (p && p(K), K.defaultPrevented) return;
      K.preventDefault();
      let L = K.nativeEvent.submitter, G = L?.getAttribute("formmethod") || f, ee = () => C(L || K.currentTarget, {
        fetcherKey: i,
        method: G,
        navigate: r,
        replace: d,
        state: h,
        relative: b,
        preventScrollReset: v,
        viewTransition: g,
        defaultShouldRevalidate: y
      });
      T && r !== !1 ? x.startTransition(() => ee()) : ee();
    };
    return /* @__PURE__ */ x.createElement(
      "form",
      {
        ref: k,
        method: E,
        action: M,
        onSubmit: o ? p : P,
        ...j,
        "data-discover": !F && a === "render" ? "true" : void 0
      }
    );
  }
);
Qy.displayName = "Form";
function Zy(a) {
  return `${a} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function K_(a) {
  let i = x.useContext(al);
  return at(i, Zy(a)), i;
}
function Ky(a, {
  target: i,
  replace: r,
  mask: o,
  state: d,
  preventScrollReset: h,
  relative: f,
  viewTransition: m,
  defaultShouldRevalidate: p,
  useTransitions: b
} = {}) {
  let v = pt(), g = zt(), y = di(a, { relative: f });
  return x.useCallback(
    (j) => {
      if (Ny(j, i)) {
        j.preventDefault();
        let k = r !== void 0 ? r : oi(g) === oi(y), T = () => v(a, {
          replace: k,
          mask: o,
          state: d,
          preventScrollReset: h,
          relative: f,
          viewTransition: m,
          defaultShouldRevalidate: p
        });
        b ? x.startTransition(() => T()) : T();
      }
    },
    [
      g,
      v,
      y,
      r,
      o,
      d,
      i,
      a,
      h,
      f,
      m,
      p,
      b
    ]
  );
}
function oo(a) {
  sn(
    typeof URLSearchParams < "u",
    "You cannot use the `useSearchParams` hook in a browser that does not support the URLSearchParams API. If you need to support Internet Explorer 11, we recommend you load a polyfill such as https://github.com/ungap/url-search-params."
  );
  let i = x.useRef(ed(a)), r = x.useRef(!1), o = zt(), d = x.useMemo(
    () => (
      // Only merge in the defaults if we haven't yet called setSearchParams.
      // Once we call that we want those to take precedence, otherwise you can't
      // remove a param with setSearchParams({}) if it has an initial value
      Cy(
        o.search,
        r.current ? null : i.current
      )
    ),
    [o.search]
  ), h = pt(), f = x.useCallback(
    (m, p) => {
      const b = ed(
        typeof m == "function" ? m(new URLSearchParams(d)) : m
      );
      r.current = !0, h("?" + b, p);
    },
    [h, d]
  );
  return [d, f];
}
var Jy = 0, Py = () => `__${String(++Jy)}__`;
function Wy() {
  let { router: a } = K_(
    "useSubmit"
    /* UseSubmit */
  ), { basename: i } = x.useContext(ln), r = _y(), o = a.fetch, d = a.navigate;
  return x.useCallback(
    async (h, f = {}) => {
      let { action: m, method: p, encType: b, formData: v, body: g } = My(
        h,
        i
      );
      if (f.navigate === !1) {
        let y = f.fetcherKey || Py();
        await o(y, r, f.action || m, {
          defaultShouldRevalidate: f.defaultShouldRevalidate,
          preventScrollReset: f.preventScrollReset,
          formData: v,
          body: g,
          formMethod: f.method || p,
          formEncType: f.encType || b,
          flushSync: f.flushSync
        });
      } else
        await d(f.action || m, {
          defaultShouldRevalidate: f.defaultShouldRevalidate,
          preventScrollReset: f.preventScrollReset,
          formData: v,
          body: g,
          formMethod: f.method || p,
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
function Iy(a, { relative: i } = {}) {
  let { basename: r } = x.useContext(ln), o = x.useContext(zn);
  at(o, "useFormAction must be used inside a RouteContext");
  let [d] = o.matches.slice(-1), h = { ...di(a || ".", { relative: i }) }, f = zt();
  if (a == null) {
    h.search = f.search;
    let m = new URLSearchParams(h.search), p = m.getAll("index");
    if (p.some((v) => v === "")) {
      m.delete("index"), p.filter((g) => g).forEach((g) => m.append("index", g));
      let v = m.toString();
      h.search = v ? `?${v}` : "";
    }
  }
  return (!a || a === ".") && d.route.index && (h.search = h.search ? h.search.replace(/^\?/, "?index&") : "?index"), r !== "/" && (h.pathname = h.pathname === "/" ? r : Sn([r, h.pathname])), oi(h);
}
function e0(a, { relative: i } = {}) {
  let r = x.useContext(F_);
  at(
    r != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?"
  );
  let { basename: o } = K_(
    "useViewTransitionState"
    /* useViewTransitionState */
  ), d = di(a, { relative: i });
  if (!r.isTransitioning)
    return !1;
  let h = na(r.currentLocation.pathname, o) || r.currentLocation.pathname, f = na(r.nextLocation.pathname, o) || r.nextLocation.pathname;
  return Kr(d.pathname, f) != null || Kr(d.pathname, h) != null;
}
var t0 = T_();
function Dr({
  label: a,
  empty: i = !1,
  onClick: r
}) {
  const o = /* @__PURE__ */ s.jsx("span", { className: `dsc-result-chip${i ? " is-empty" : ""}`, children: /* @__PURE__ */ s.jsx("span", { children: a }) });
  return r ? /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-result-chip-hit", onClick: r, children: o }) : o;
}
function Jp(a) {
  return Array.from(
    a.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((i) => !i.hasAttribute("disabled") && i.tabIndex !== -1);
}
function Je({
  open: a,
  onDismiss: i,
  onConfirm: r,
  title: o,
  confirmLabel: d = "Confirm",
  help: h,
  children: f
}) {
  const m = x.useId(), p = x.useRef(null), b = x.useRef(null);
  if (x.useEffect(() => {
    if (!a) return;
    b.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const g = document.querySelector(".dsc-shell");
    g instanceof HTMLElement && (g.inert = !0);
    const y = p.current;
    (y ? Jp(y)[0] : null)?.focus();
    const k = (T) => {
      if (T.key === "Escape") {
        T.preventDefault(), i();
        return;
      }
      if (T.key !== "Tab" || !y) return;
      const C = Jp(y);
      if (!C.length) return;
      const M = C[0], E = C[C.length - 1];
      T.shiftKey && document.activeElement === M ? (T.preventDefault(), E.focus()) : !T.shiftKey && document.activeElement === E && (T.preventDefault(), M.focus());
    };
    return window.addEventListener("keydown", k), () => {
      window.removeEventListener("keydown", k), g instanceof HTMLElement && (g.inert = !1), b.current?.focus?.();
    };
  }, [a, i]), !a) return null;
  const v = /* @__PURE__ */ s.jsxs("div", { className: "dsc-decision-root is-open", role: "presentation", children: [
    /* @__PURE__ */ s.jsx("div", { className: "dsc-decision-scrim", onClick: i }),
    /* @__PURE__ */ s.jsxs(
      "aside",
      {
        ref: p,
        className: "dsc-decision-panel",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": m,
        children: [
          /* @__PURE__ */ s.jsxs("header", { className: "dsc-decision-head", children: [
            /* @__PURE__ */ s.jsx("h2", { id: m, children: o }),
            /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-icon-btn", "aria-label": "Dismiss", onClick: i, children: /* @__PURE__ */ s.jsx(Zt, { name: "close", size: 16 }) })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "dsc-decision-body", children: f }),
          h ? /* @__PURE__ */ s.jsx("div", { className: "dsc-decision-help", children: h }) : /* @__PURE__ */ s.jsx("div", { className: "dsc-decision-help is-empty" }),
          /* @__PURE__ */ s.jsxs("footer", { className: "dsc-decision-foot", children: [
            /* @__PURE__ */ s.jsx(ae, { onClick: i, children: "Dismiss" }),
            r ? /* @__PURE__ */ s.jsx(ae, { primary: !0, onClick: r, children: d }) : null
          ] })
        ]
      }
    )
  ] });
  return t0.createPortal(v, document.body);
}
const n0 = {
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
function a0(a) {
  return n0[a];
}
const J_ = x.createContext(null), s0 = /* @__PURE__ */ new Set([
  "input_boolean",
  "input_number",
  "input_select",
  "input_text",
  "input_datetime",
  "input_button"
]);
function l0(a) {
  if (!a) return !1;
  const i = a.toLowerCase(), r = i.indexOf("."), o = r >= 0 ? i.slice(0, r) : "", d = r >= 0 ? i.slice(r + 1) : i;
  return d.startsWith("dsc_") || d.startsWith("dsc-") || d.includes("_dsc_") || i.includes("dsc_") || i.includes("dsc-") ? !0 : s0.has(o) ? d.startsWith("dsc_") || d.includes("dsc_") : i.startsWith("sensor.dsc") || i.startsWith("switch.dsc") || i.startsWith("binary_sensor.dsc") || i.startsWith("number.dsc") || i.startsWith("light.dsc") || i.startsWith("fan.dsc") || i.startsWith("select.dsc") || i.startsWith("text.dsc") || i.startsWith("datetime.dsc") || i.startsWith("time.dsc");
}
const i0 = 150;
function r0({
  hass: a,
  revision: i = 0,
  children: r
}) {
  const [o, d] = x.useState(0), h = x.useRef(null), f = x.useRef(a);
  f.current = a;
  const m = a?.connection, p = !!a, b = () => {
    h.current || (h.current = setTimeout(() => {
      h.current = null, d((j) => j + 1);
    }, i0));
  };
  x.useEffect(() => {
    p && b();
  }, [p]), x.useEffect(() => {
    i > 0 && b();
  }, [i]), x.useEffect(() => {
    if (!m?.subscribeEvents) return;
    let j, k = !1;
    const T = (C) => {
      const M = C.data?.entity_id;
      l0(M) && b();
    };
    return Promise.resolve(m.subscribeEvents(T, "state_changed")).then((C) => {
      if (k) {
        C();
        return;
      }
      j = C;
    }).catch(() => {
    }), () => {
      k = !0, j?.(), h.current && (clearTimeout(h.current), h.current = null);
    };
  }, [m]);
  const v = x.useMemo(
    () => (j, k, T) => {
      const C = f.current;
      return C?.callService ? C.callService(j, k, T) : Promise.resolve(null);
    },
    []
  ), g = x.useMemo(
    () => (j) => {
      const k = f.current;
      if (k?.callWS) return k.callWS(j);
      const T = k?.connection;
      return T?.sendMessagePromise ? T.sendMessagePromise(j) : Promise.resolve(null);
    },
    []
  ), y = x.useMemo(() => {
    const j = (M) => f.current?.states?.[M], k = (M) => {
      const E = j(M)?.state;
      return E === void 0 ? !1 : E !== "unavailable" && E !== "unknown";
    }, T = (M, E = "—") => k(M) ? j(M)?.state ?? E : E, C = (M, E = NaN) => {
      if (!k(M)) return E;
      const F = Number(j(M)?.state);
      return Number.isFinite(F) ? F : E;
    };
    return { hass: f.current, entity: j, state: T, num: C, available: k, callService: v, callWS: g, tick: o };
  }, [o, v, g]);
  return x.createElement(J_.Provider, { value: y }, r);
}
function hi() {
  const a = x.useContext(J_);
  if (!a) throw new Error("useHass outside HassProvider");
  return a;
}
const td = (a) => ({
  seat_id: a,
  online: !1,
  firmware: null,
  values: {},
  last_seen: null
}), Oa = {
  version: "7.0.0.0",
  surface: "7.0.0",
  expected_firmware: "7.0.0.0",
  hub: td("hub"),
  panel: td("panel"),
  pots: {},
  sonoffs: {},
  canopy: {},
  system: {},
  updated_at: 0
};
function Or(a, i) {
  if (!a || typeof a != "object") return td(i);
  const r = a;
  return {
    seat_id: String(r.seat_id ?? i),
    online: !!r.online,
    firmware: r.firmware != null ? String(r.firmware) : null,
    values: r.values ?? {},
    last_seen: typeof r.last_seen == "number" ? r.last_seen : null
  };
}
function P_(a) {
  if (!a) return { ...Oa };
  const i = {}, r = a.pots;
  if (r)
    for (const [f, m] of Object.entries(r))
      i[f] = Or(m, f);
  const o = {}, d = a.sonoffs;
  if (d)
    for (const [f, m] of Object.entries(d))
      o[f] = Or(m, f);
  const h = Array.isArray(a.inventory) ? a.inventory : void 0;
  return {
    version: String(a.version ?? Oa.version),
    surface: String(a.surface ?? Oa.surface),
    expected_firmware: String(a.expected_firmware ?? Oa.expected_firmware),
    hub: Or(a.hub, "hub"),
    panel: Or(a.panel, "panel"),
    pots: i,
    sonoffs: o,
    canopy: a.canopy ?? {},
    system: a.system ?? {},
    updated_at: typeof a.updated_at == "number" ? a.updated_at : 0,
    inventory: h
  };
}
function o0(a) {
  const i = a.hub.values;
  return {
    temp_c: i.temp_c != null ? Number(i.temp_c) : null,
    rh_pct: i.rh_pct != null ? Number(i.rh_pct) : null,
    vpd_kpa: i.vpd_kpa != null ? Number(i.vpd_kpa) : i.vd_kpa != null ? Number(i.vd_kpa) : null,
    heartbeat: i.heartbeat ?? null,
    uptime: i.uptime ?? null
  };
}
function c0(a, i) {
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
function el(a, i, r = !1) {
  const o = a.inventory?.find((d) => d.seat_id === i);
  return o && o.in_service != null ? !!o.in_service : r;
}
const bd = {
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
  "sensor.dsc_pot1_got_moisture": { seatId: "pot1", metric: "moisture_pct" },
  "sensor.dsc_pot1_soil_moisture": { seatId: "pot1", metric: "moisture_pct" },
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
function u0(a, i) {
  return i === "hub" ? a.hub.values : i === "panel" ? a.panel.values : i.startsWith("pot") ? a.pots[i]?.values : a.sonoffs[i]?.values;
}
function Pr(a, i) {
  const r = bd[a];
  if (!r) return null;
  const o = u0(i, r.seatId);
  if (!o) return null;
  const d = o[r.metric];
  if (d == null) return null;
  if (r.binary) return d === !0 || d === "on" || d === 1 || d === "1" ? 1 : 0;
  const h = Number(d);
  return Number.isFinite(h) ? h : null;
}
function gd(a, i) {
  const r = bd[a];
  return r ? r.seatId === "hub" ? i.hub.online : r.seatId === "panel" ? i.panel.online : r.seatId.startsWith("pot") ? !!i.pots[r.seatId]?.online : !!i.sonoffs[r.seatId]?.online : !1;
}
function d0(a) {
  return !a.hub.online;
}
const W_ = {
  ac: "input_boolean.dsc_ac_in_service",
  mister: "input_boolean.dsc_clone_humidifier_in_service",
  pot1: "input_boolean.dsc_pot1_in_service",
  pot2: "input_boolean.dsc_pot2_in_service",
  pot3: "input_boolean.dsc_pot3_in_service",
  pot4: "input_boolean.dsc_pot4_in_service",
  tank: "input_boolean.dsc_tank_in_service"
}, I_ = {
  heater: "sensor.dsc_heater_firmware_version",
  heatmat: "sensor.dsc_heatmat_firmware_version",
  humidifier: "sensor.dsc_humidifier_firmware_version",
  dehumidifier: "sensor.dsc_dehumidifier_firmware_version"
};
function Lt(a, i) {
  return a.states[i]?.state ?? "unavailable";
}
function Mt(a, i) {
  const r = a.states[i]?.state;
  return r != null && r !== "unavailable" && r !== "unknown";
}
function Rt(a, i) {
  const r = Number(Lt(a, i));
  return Number.isFinite(r) ? r : null;
}
function h0(a, i) {
  if (!a) return { ...Oa, inventory: i };
  const o = Mt(a, "binary_sensor.dsc_hub_link") && Lt(a, "binary_sensor.dsc_hub_link") === "on", d = {
    seat_id: "hub",
    online: o,
    firmware: Mt(a, "sensor.dsc_hub_firmware_version") ? Lt(a, "sensor.dsc_hub_firmware_version") : null,
    values: {
      temp_c: Rt(a, "sensor.dsc_hub_tent_temperature") ?? Rt(a, "sensor.dsc_hub_temperature"),
      rh_pct: Rt(a, "sensor.dsc_hub_tent_humidity") ?? Rt(a, "sensor.dsc_hub_humidity"),
      vpd_kpa: Rt(a, "sensor.dsc_hub_vpd_kpa") ?? Rt(a, "sensor.dsc_hub_vpd"),
      heartbeat: Mt(a, "sensor.dsc_hub_heartbeat") ? Lt(a, "sensor.dsc_hub_heartbeat") : null,
      uptime: Mt(a, "sensor.dsc_hub_uptime") ? Lt(a, "sensor.dsc_hub_uptime") : null
    },
    last_seen: o ? Date.now() / 1e3 : null
  }, h = Mt(a, "binary_sensor.dsc_hub_panel_link") && Lt(a, "binary_sensor.dsc_hub_panel_link") === "on", f = {
    seat_id: "panel",
    online: h,
    firmware: Mt(a, "sensor.dsc_control_firmware_version") ? Lt(a, "sensor.dsc_control_firmware_version") : null,
    values: {},
    last_seen: h ? Date.now() / 1e3 : null
  }, m = {};
  for (const y of [1, 2, 3, 4]) {
    const j = `pot${y}`, k = `sensor.dsc_pot${y}_firmware_version`, T = Mt(a, k);
    m[j] = {
      seat_id: j,
      online: T,
      firmware: T ? Lt(a, k) : null,
      values: {
        moisture_pct: Rt(a, `sensor.dsc_pot${y}_got_moisture`) ?? Rt(a, `sensor.dsc_pot${y}_soil_moisture`),
        soil_temp_c: Rt(a, `sensor.dsc_pot${y}_soil_temperature`),
        ec_us: Rt(a, `sensor.dsc_pot${y}_got_ec`) ?? Rt(a, `sensor.dsc_pot${y}_soil_conductivity`) ?? Rt(a, `sensor.dsc_pot${y}_soil_ec`),
        ph: Rt(a, `sensor.dsc_pot${y}_got_ph`) ?? Rt(a, `sensor.dsc_pot${y}_soil_ph`)
      },
      last_seen: T ? Date.now() / 1e3 : null
    };
  }
  const p = {}, b = {
    heater: "switch.dsc_heater_main_relay",
    heatmat: "switch.dsc_heatmat_main_relay",
    humidifier: "switch.dsc_humidifier_main_relay",
    dehumidifier: "switch.dsc_de_humidifier_main_relay"
  };
  for (const [y, j] of Object.entries(b)) {
    const k = I_[y], T = Mt(a, j) || Mt(a, k);
    p[y] = {
      seat_id: y,
      online: T,
      firmware: k && Mt(a, k) ? Lt(a, k) : null,
      values: {
        relay_on: Mt(a, j) ? Lt(a, j) === "on" : null
      },
      last_seen: T ? Date.now() / 1e3 : null
    };
  }
  const v = i ?? Object.entries(W_).map(([y, j]) => ({
    seat_id: y,
    in_service: Mt(a, j) ? Lt(a, j) === "on" : !1
  })), g = {};
  return Mt(a, "sensor.dsc_canopy_temperature") && (g.temp_c = Rt(a, "sensor.dsc_canopy_temperature")), Mt(a, "sensor.dsc_canopy_humidity") && (g.rh_pct = Rt(a, "sensor.dsc_canopy_humidity")), {
    version: Lt(a, "sensor.dsc_fleet_version_status") || Oa.version,
    surface: Lt(a, "sensor.dsc_ha_surface_version") || Oa.surface,
    expected_firmware: Oa.expected_firmware,
    hub: d,
    panel: f,
    pots: m,
    sonoffs: p,
    canopy: g,
    system: {
      appliance_link: Mt(a, "binary_sensor.dsc_pi_appliance_link") && Lt(a, "binary_sensor.dsc_pi_appliance_link") === "on",
      reduced_kit: Mt(a, "binary_sensor.dsc_reduced_kit") && Lt(a, "binary_sensor.dsc_reduced_kit") === "on"
    },
    updated_at: Date.now() / 1e3,
    inventory: v
  };
}
function f0(a) {
  const i = {}, r = (m, p, b = !0) => {
    i[m] = {
      entity_id: m,
      state: b ? p : "unavailable",
      attributes: {},
      last_changed: (/* @__PURE__ */ new Date()).toISOString()
    };
  }, o = a.hub.values;
  r("binary_sensor.dsc_hub_link", a.hub.online ? "on" : "off", !0), r("binary_sensor.dsc_hub_panel_link", a.panel.online ? "on" : "off", !0), o.temp_c != null && (r("sensor.dsc_hub_tent_temperature", String(o.temp_c), a.hub.online), r("sensor.dsc_hub_temperature", String(o.temp_c), a.hub.online)), o.rh_pct != null && (r("sensor.dsc_hub_tent_humidity", String(o.rh_pct), a.hub.online), r("sensor.dsc_hub_humidity", String(o.rh_pct), a.hub.online)), o.vpd_kpa != null && (r("sensor.dsc_hub_vpd_kpa", String(o.vpd_kpa), a.hub.online), r("sensor.dsc_hub_vpd", String(o.vpd_kpa), a.hub.online)), o.heartbeat != null && r("sensor.dsc_hub_heartbeat", String(o.heartbeat), a.hub.online), o.uptime != null && r("sensor.dsc_hub_uptime", String(o.uptime), a.hub.online), a.hub.firmware && r("sensor.dsc_hub_firmware_version", a.hub.firmware, a.hub.online), a.panel.firmware && r("sensor.dsc_control_firmware_version", a.panel.firmware, a.panel.online), r("sensor.dsc_ha_surface_version", a.surface), r("sensor.dsc_fleet_version_status", a.version), r("sensor.dsc_active_alert_count", "0"), r("binary_sensor.dsc_pi_appliance_link", a.system.appliance_link ? "on" : "off", !0), r("binary_sensor.dsc_reduced_kit", a.system.reduced_kit ? "on" : "off", !0);
  const d = a.hub.online;
  if (o.room_temp_c != null && r("sensor.dsc_hub_room_temperature", String(o.room_temp_c), d), o.room_rh_pct != null && r("sensor.dsc_hub_room_humidity", String(o.room_rh_pct), d), o.room_temp_c != null && o.room_rh_pct != null) {
    const m = m0(Number(o.room_temp_c), Number(o.room_rh_pct));
    Number.isFinite(m) && (r("sensor.dsc_hub_room_vpd_kpa", m.toFixed(2), d), r("sensor.dsc_hub_room_vpd", m.toFixed(2), d));
  }
  o.clone_temp_c != null && r("sensor.dsc_hub_clone_temperature", String(o.clone_temp_c), d), o.clone_rh_pct != null && r("sensor.dsc_hub_clone_humidity", String(o.clone_rh_pct), d), o.clone_vpd_kpa != null && (r("sensor.dsc_hub_clone_vpd_kpa", String(o.clone_vpd_kpa), d), r("sensor.dsc_hub_clone_vpd", String(o.clone_vpd_kpa), d));
  const h = o.binaries;
  if (h)
    for (const [m, p] of Object.entries(h))
      r(m, p ? "on" : "off", d);
  for (const [m, p] of Object.entries(W_)) {
    const b = p0(a, m);
    r(p, b ? "on" : "off");
  }
  for (const [m, p] of Object.entries(a.pots)) {
    const b = m.replace("pot", ""), v = p.online, g = p.values.moisture_pct;
    if (g != null) {
      const T = String(g);
      r(`sensor.dsc_pot${b}_soil_moisture`, T, v), r(`sensor.dsc_pot${b}_got_moisture`, T, v);
    }
    const y = p.values.soil_temp_c;
    y != null && r(`sensor.dsc_pot${b}_soil_temperature`, String(y), v);
    const j = p.values.ec_us;
    j != null && (r(`sensor.dsc_pot${b}_soil_ec`, String(j), v), r(`sensor.dsc_pot${b}_soil_conductivity`, String(j), v), r(`sensor.dsc_pot${b}_got_ec`, String(j), v));
    const k = p.values.ph;
    k != null && (r(`sensor.dsc_pot${b}_soil_ph`, String(k), v), r(`sensor.dsc_pot${b}_got_ph`, String(k), v)), p.firmware && r(`sensor.dsc_pot${b}_firmware_version`, p.firmware, v);
  }
  for (const [m, p] of Object.entries(a.sonoffs)) {
    const v = {
      heater: "switch.dsc_heater_main_relay",
      heatmat: "switch.dsc_heatmat_main_relay",
      humidifier: "switch.dsc_humidifier_main_relay",
      dehumidifier: "switch.dsc_de_humidifier_main_relay"
    }[m];
    v && p.values.relay_on != null && r(v, p.values.relay_on ? "on" : "off", p.online);
    const g = I_[m];
    g && p.firmware && r(g, p.firmware, p.online);
  }
  const f = a.hub.values.controls;
  if (f)
    for (const [m, p] of Object.entries(f)) {
      const b = {};
      p.options?.length && (b.options = p.options), p.percentage != null && (b.percentage = p.percentage), p.brightness != null && (b.brightness = p.brightness), i[m] = {
        entity_id: m,
        state: a.hub.online ? p.state : "unavailable",
        attributes: b,
        last_changed: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
  return i;
}
function m0(a, i) {
  if (!Number.isFinite(a) || !Number.isFinite(i) || i <= 0) return NaN;
  const r = 0.6108 * Math.exp(17.27 * a / (a + 237.3)), o = r * (i / 100);
  return r - o;
}
function p0(a, i) {
  return el(a, i, !1);
}
function _0(a, i) {
  if (!i) return a;
  const r = { ...a.hub.values }, o = { ...a.pots };
  for (const [d, h] of Object.entries(bd)) {
    const f = i[d];
    if (!f || f.state === "unavailable" || f.state === "unknown") continue;
    const m = f.state, p = Number(m);
    if (!Number.isFinite(p) && h.binary !== !0) continue;
    const b = h.binary ? m === "on" || m === "1" || m === "true" : p;
    if (h.seatId === "hub") {
      r[h.metric] == null && (r[h.metric] = b);
      continue;
    }
    if (h.seatId.startsWith("pot")) {
      const v = o[h.seatId];
      if (!v || v.values[h.metric] != null) continue;
      o[h.seatId] = {
        ...v,
        values: { ...v.values, [h.metric]: b }
      };
    }
  }
  return {
    ...a,
    hub: { ...a.hub, values: r },
    pots: o
  };
}
const eb = x.createContext(null);
function b0({
  children: a,
  fleetRaw: i,
  hass: r,
  tick: o = 0,
  source: d,
  loading: h = !1,
  error: f = null,
  refresh: m,
  inventory: p
}) {
  const b = x.useMemo(() => {
    if (d === "pi" && i) {
      let g = P_(i);
      const y = i.hass_states;
      return g = _0(g, y), Array.isArray(i?.inventory) ? { ...g, inventory: i.inventory } : p?.length ? { ...g, inventory: p } : g;
    }
    return h0(r ?? null, p);
  }, [d, i, r, p, o]), v = x.useMemo(
    () => ({ fleet: b, tick: o, source: d, loading: h, error: f, refresh: m }),
    [b, o, d, h, f, m]
  );
  return /* @__PURE__ */ s.jsx(eb.Provider, { value: v, children: a });
}
function vd() {
  const a = x.useContext(eb);
  if (!a) throw new Error("useFleet outside FleetProvider");
  return a;
}
function xt() {
  return vd().fleet;
}
function g0() {
  return vd().tick;
}
function sa() {
  return vd().source;
}
function tb() {
  const a = xt();
  return { ...o0(a), online: a.hub.online };
}
function v0(a) {
  const i = xt();
  return { ...c0(i, a), online: i.hub.online };
}
function xd(a) {
  const i = a.hub.values.controls;
  if (!(!i || typeof i != "object"))
    return i;
}
function Xr(a, i) {
  return i.hub.online ? xd(i)?.[a]?.state ?? null : null;
}
function nb(a, i) {
  return i.hub.online && !!xd(i)?.[a];
}
function ab(a, i) {
  const r = xd(i)?.[a];
  if (!r) return {};
  const o = {};
  return r.options?.length && (o.options = r.options), r.percentage != null && (o.percentage = r.percentage), r.brightness != null && (o.brightness = r.brightness), o;
}
function Te() {
  const a = hi(), i = xt(), r = sa(), o = x.useMemo(
    () => r === "pi" ? f0(i) : null,
    [r, i]
  );
  return x.useMemo(() => r !== "pi" ? a : { ...a, entity: (p) => {
    const b = a.entity(p);
    if (b) return b;
    const v = Xr(p, i);
    return v != null ? {
      entity_id: p,
      state: v,
      attributes: ab(p, i),
      last_changed: (/* @__PURE__ */ new Date()).toISOString()
    } : o?.[p];
  }, available: (p) => nb(p, i) || gd(p, i) ? !0 : a.available(p), state: (p, b = "—") => {
    const v = Xr(p, i);
    if (v != null) return v;
    const g = Pr(p, i);
    return g != null && Number.isFinite(g) ? String(g) : a.state(p, b);
  }, num: (p, b = NaN) => {
    const v = Xr(p, i);
    if (v != null) {
      const y = Number(v);
      if (Number.isFinite(y)) return y;
    }
    const g = Pr(p, i);
    return g != null && Number.isFinite(g) ? g : a.num(p, b);
  } }, [a, i, r, o]);
}
async function x0(a, i = 6) {
  const r = await fetch(`/history?entity_id=${encodeURIComponent(a)}&hours=${i}`);
  return r.ok ? (await r.json()).points ?? [] : [];
}
async function y0(a = 24, i = 100) {
  const r = await fetch(`/grow-log?hours=${a}&limit=${i}`);
  return r.ok ? (await r.json()).events ?? [] : [];
}
async function w0(a, i, r = {}) {
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
async function j0(a, i) {
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
async function S0() {
  const a = await fetch("/fleet?include_hass=true");
  if (!a.ok) throw new Error("fleet fetch failed");
  return a.json();
}
async function k0() {
  const a = await fetch("/settings");
  if (!a.ok) throw new Error("settings fetch failed");
  return a.json();
}
async function Pp(a) {
  if (!(await fetch("/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ settings: a })
  })).ok) throw new Error("settings patch failed");
}
async function nd(a, i) {
  const r = await fetch(`/settings/inventory/${a}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(i)
  });
  if (!r.ok) throw new Error("inventory patch failed");
  return r.json();
}
async function N0() {
  const a = await fetch("/settings/network");
  if (!a.ok) throw new Error("network status failed");
  return a.json();
}
async function C0() {
  const a = await fetch("/settings/network/apply", { method: "POST" });
  if (!a.ok) throw new Error("network apply failed");
  return a.json();
}
async function Vu() {
  const a = await fetch("/settings/catalog/status");
  if (!a.ok) throw new Error("catalog status failed");
  return a.json();
}
async function E0() {
  const a = await fetch("/admin/reload-catalogs", { method: "POST" });
  if (!a.ok) throw new Error("catalog reload failed");
  return a.json();
}
async function T0() {
  const a = await fetch("/settings/esphome/devices");
  if (!a.ok) throw new Error("esphome devices failed");
  return a.json();
}
async function M0(a, i) {
  const r = await fetch("/settings/esphome/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ seat_id: a, action: i })
  });
  if (!r.ok) throw new Error("esphome job failed");
  return r.json();
}
async function R0() {
  const a = await fetch("/settings/esphome/jobs");
  if (!a.ok) throw new Error("esphome jobs failed");
  return (await a.json()).jobs;
}
async function A0() {
  return (await fetch("/settings/integrations/test-ollama", { method: "POST" })).json();
}
async function z0() {
  return (await fetch("/settings/integrations/test-cannalib", { method: "POST" })).json();
}
async function D0(a) {
  await fetch("/settings/zigbee/permit-join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enabled: a })
  });
}
async function O0() {
  const a = await fetch("/settings/zigbee/devices");
  if (!a.ok) throw new Error("zigbee devices failed");
  return a.json();
}
async function sb(a, i, r) {
  const o = await fetch(`/settings/calibration/${encodeURIComponent(a)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cal_type: i, steps: r })
  });
  if (!o.ok) throw new Error("calibration save failed");
  return o.json();
}
function H0() {
  return "/settings/backup/export";
}
async function L0(a) {
  const i = new FormData();
  i.append("file", a);
  const r = await fetch("/settings/backup/import", { method: "POST", body: i });
  if (!r.ok) throw new Error("backup import failed");
  return r.json();
}
const $0 = {
  heater: "switch.dsc_hub_heater_demand",
  heatmat: "switch.dsc_hub_grow_mat_demand",
  humidifier: "switch.dsc_hub_humidifier_demand",
  dehumidifier: "switch.dsc_hub_dehumidifier_demand",
  ac: "switch.dsc_hub_ac_demand",
  clone_humidifier: "switch.dsc_hub_clone_humidifier_demand"
};
function $t() {
  const a = hi(), i = sa(), r = x.useCallback(
    async (d, h, f) => i === "pi" ? w0(d, h, f ?? {}) : a.callService(d, h, f),
    [a, i]
  ), o = x.useCallback(
    async (d, h) => {
      if (i === "pi")
        return j0(d, h);
      const f = $0[d];
      return a.callService("switch", h ? "turn_on" : "turn_off", { entity_id: f });
    },
    [a, i]
  );
  return { callService: r, setDemand: o };
}
function nl(a) {
  const { state: i, available: r, entity: o } = hi(), d = xt();
  if (sa() === "pi") {
    const f = Xr(a, d);
    if (f != null)
      return {
        state: f,
        available: nb(a, d),
        attributes: ab(a, d)
      };
  }
  return {
    state: i(a, "unavailable"),
    available: r(a),
    attributes: o(a)?.attributes ?? {}
  };
}
function Zt({
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
      dangerouslySetInnerHTML: { __html: a0(a) }
    }
  );
}
function ce({
  title: a,
  children: i,
  className: r = "",
  style: o,
  icon: d
}) {
  return /* @__PURE__ */ s.jsxs("section", { className: `dsc-card ${r}`.trim(), style: o, children: [
    a ? /* @__PURE__ */ s.jsxs("h3", { className: "dsc-card-title", children: [
      d ? /* @__PURE__ */ s.jsx(Zt, { name: d, size: 14, color: "var(--dsc-teal)" }) : null,
      a
    ] }) : null,
    i
  ] });
}
function ae({
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
function Nt({
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
  })(), p = /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsxs("div", { className: `dsc-kpi-value ${m}`.trim(), children: [
      i,
      r ? /* @__PURE__ */ s.jsx("span", { className: "dsc-kpi-unit", children: r }) : null,
      h ? /* @__PURE__ */ s.jsx("span", { className: "dsc-held-tag", children: "HELD" }) : null
    ] }),
    o ? /* @__PURE__ */ s.jsx("div", { className: "dsc-kpi-sub", children: o }) : null
  ] });
  return f ? /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-kpi-hit", onClick: f, title: `History · ${a}`, children: /* @__PURE__ */ s.jsx(ce, { title: a, className: h ? "is-stale" : void 0, children: p }) }) : /* @__PURE__ */ s.jsx(ce, { title: a, className: h ? "is-stale" : void 0, children: p });
}
function Ct({
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
      r ? /* @__PURE__ */ s.jsx(Zt, { name: r, size: 22, color: "var(--dsc-teal)" }) : null,
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("h1", { className: "dsc-page-title", children: a }),
        i ? /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: i }) : null
      ] })
    ] }),
    h
  ] });
}
function O({
  label: a,
  tone: i = "muted",
  pulse: r,
  motion: o,
  icon: d,
  onClick: h
}) {
  const f = o ?? (r ? "pulse" : void 0), m = `dsc-chip dsc-chip--${i}${f ? ` dsc-chip--${f}` : ""}`, p = o === "fan" ? /* @__PURE__ */ s.jsx(Zt, { name: "fan", size: 11, className: "dsc-fan-spin" }) : d ? /* @__PURE__ */ s.jsx(Zt, { name: d, size: 11 }) : null;
  return h ? /* @__PURE__ */ s.jsxs("button", { type: "button", className: `${m} is-clickable`, onClick: h, children: [
    p,
    a
  ] }) : /* @__PURE__ */ s.jsxs("span", { className: m, children: [
    p,
    a
  ] });
}
function vt({
  entityId: a,
  label: i,
  warnWhenMissing: r,
  icon: o,
  showBrightness: d,
  confirm: h
}) {
  const { state: f, available: m, attributes: p } = nl(a), { callService: b } = $t(), [v, g] = x.useState(!1), y = f === "on", j = m, k = a.split(".")[0], T = () => {
    if (j) {
      if (k === "switch" || k === "input_boolean") {
        b(k, y ? "turn_off" : "turn_on", { entity_id: a });
        return;
      }
      k === "light" && b("light", y ? "turn_off" : "turn_on", { entity_id: a });
    }
  }, C = () => {
    if (!(!j && !r)) {
      if (h) {
        g(!0);
        return;
      }
      T();
    }
  }, M = h === !0 ? {
    title: y ? `Turn off ${i}` : `Turn on ${i}`,
    body: `This writes ${a} on the hub immediately.`,
    confirmLabel: y ? "Turn off" : "Turn on"
  } : h ? {
    title: h.title ?? (y ? `Turn off ${i}` : `Turn on ${i}`),
    body: h.body ?? `This writes ${a} on the hub immediately.`,
    confirmLabel: h.confirmLabel ?? (y ? "Turn off" : "Turn on")
  } : null, E = d !== !1 && k === "light" && y ? Math.round(Number(p?.brightness ?? 0) / 255 * 100) : null;
  return /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsxs(
      "button",
      {
        type: "button",
        className: `dsc-demand${y ? " is-on" : ""}${j ? "" : " is-missing"}`,
        onClick: C,
        disabled: !j && !r,
        title: j ? a : r || `${a} unavailable`,
        children: [
          o ? /* @__PURE__ */ s.jsx(Zt, { name: o, size: 22, color: "var(--dsc-teal)", className: "dsc-demand-icon" }) : null,
          /* @__PURE__ */ s.jsx("span", { className: "dsc-demand-label", children: i }),
          /* @__PURE__ */ s.jsx("span", { className: "dsc-demand-state", children: j ? E != null ? `${E}%` : y ? "ON" : "OFF" : r || "—" })
        ]
      }
    ),
    M ? /* @__PURE__ */ s.jsx(
      Je,
      {
        open: v,
        onDismiss: () => g(!1),
        onConfirm: () => {
          g(!1), T();
        },
        title: M.title,
        confirmLabel: M.confirmLabel,
        help: null,
        children: /* @__PURE__ */ s.jsx("p", { children: M.body })
      }
    ) : null
  ] });
}
function Ha({
  entityId: a,
  label: i,
  icon: r
}) {
  const { state: o, available: d, attributes: h } = nl(a), { callService: f } = $t(), m = d, p = o, b = h?.options || [], v = a.split(".")[0], [g, y] = x.useState(!1), j = x.useRef(!1), [k, T] = x.useState(p);
  x.useEffect(() => {
    !j.current && !g && T(p);
  }, [p, g, a]);
  const C = (E) => {
    T(E), y(!1), !(!m || !E) && (v === "select" ? f("select", "select_option", { entity_id: a, option: E }) : v === "input_select" && f("input_select", "select_option", { entity_id: a, option: E }));
  }, M = g ? k : p;
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-entity-select${m ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ s.jsxs("span", { className: "dsc-entity-select-label", children: [
      r ? /* @__PURE__ */ s.jsx(Zt, { name: r, size: 13, color: "var(--dsc-teal)" }) : null,
      i
    ] }),
    /* @__PURE__ */ s.jsxs(
      "select",
      {
        value: M,
        disabled: !m,
        onFocus: () => {
          j.current = !0, y(!0);
        },
        onBlur: () => {
          j.current = !1, y(!1);
        },
        onChange: (E) => C(E.target.value),
        children: [
          !b.includes(M) && M ? /* @__PURE__ */ s.jsx("option", { value: M, children: M }) : null,
          b.map((E) => /* @__PURE__ */ s.jsx("option", { value: E, children: E }, E))
        ]
      }
    )
  ] });
}
function La({
  entityId: a,
  label: i,
  disabled: r
}) {
  const { available: o, attributes: d, state: h } = nl(a), { callService: f } = $t(), m = o, p = Number(d?.percentage ?? 0), b = h === "on", v = r || !m, [g, y] = x.useState(!1), j = x.useRef(!1), [k, T] = x.useState(Number.isFinite(p) ? p : 0);
  x.useEffect(() => {
    !j.current && !g && Number.isFinite(p) && T(p);
  }, [p, g, a]);
  const C = (E) => {
    v || f("fan", "set_percentage", { entity_id: a, percentage: E });
  }, M = g ? k : Number.isFinite(p) ? p : 0;
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-fan-slider${v ? " is-disabled" : ""}`, children: [
    /* @__PURE__ */ s.jsxs("span", { className: "dsc-fan-slider-label", children: [
      i,
      /* @__PURE__ */ s.jsx("strong", { children: m ? `${Math.round(M)}%` : "—" }),
      !b && m ? /* @__PURE__ */ s.jsx("em", { className: "dsc-muted", children: "off" }) : null
    ] }),
    /* @__PURE__ */ s.jsx(
      "input",
      {
        type: "range",
        min: 0,
        max: 100,
        step: 1,
        value: M,
        disabled: v,
        onPointerDown: (E) => {
          E.target.setPointerCapture(E.pointerId), j.current = !0, y(!0);
        },
        onPointerUp: (E) => {
          j.current = !1, y(!1), C(Number(E.target.value));
        },
        onPointerCancel: () => {
          j.current = !1, y(!1);
        },
        onLostPointerCapture: () => {
          j.current = !1, y(!1);
        },
        onChange: (E) => {
          const F = Number(E.target.value);
          T(F), j.current || C(F);
        }
      }
    )
  ] });
}
function yd(a) {
  return !a || a === "unknown" || a === "unavailable" ? "" : a;
}
function Qr({
  entityId: a,
  label: i,
  multiline: r = !1,
  rows: o = 2
}) {
  const { available: d, state: h } = Te(), { callService: f } = $t(), m = d(a), p = yd(h(a, "")), [b, v] = x.useState(p), g = x.useRef(!1);
  x.useEffect(() => {
    g.current || v(p);
  }, [p]);
  const y = () => {
    m && f("input_text", "set_value", { entity_id: a, value: b });
  }, j = {
    value: b,
    disabled: !m,
    onFocus: () => {
      g.current = !0;
    },
    onChange: (k) => v(k.target.value),
    onBlur: () => {
      g.current = !1, y();
    },
    onKeyDown: (k) => {
      k.key === "Enter" && !r && k.currentTarget.blur();
    }
  };
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-target-num${m ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ s.jsx("span", { className: "dsc-target-num-label", children: i }),
    r ? /* @__PURE__ */ s.jsx("textarea", { rows: o, ...j }) : /* @__PURE__ */ s.jsx("input", { type: "text", ...j })
  ] });
}
function U0(a) {
  const i = yd(a);
  return i ? i.slice(0, 5) : "";
}
function B0(a) {
  return a ? a.length === 5 ? `${a}:00` : a : "00:00:00";
}
function Wp({ entityId: a, label: i }) {
  const { available: r, state: o } = Te(), { callService: d } = $t(), h = r(a), f = U0(o(a, "")), [m, p] = x.useState(f), b = x.useRef(!1);
  x.useEffect(() => {
    b.current || p(f);
  }, [f]);
  const v = () => {
    !h || !m || d("time", "set_value", { entity_id: a, time: B0(m) });
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
        onChange: (g) => p(g.target.value),
        onBlur: () => {
          b.current = !1, v();
        }
      }
    )
  ] });
}
function F0({ entityId: a, label: i }) {
  const { available: r, entity: o, state: d } = Te(), { callService: h } = $t(), f = r(a), m = !!o(a)?.attributes?.has_time, p = yd(d(a, "")), b = (k) => k ? m ? k.slice(0, 16).replace(" ", "T") : k.slice(0, 10) : "", [v, g] = x.useState(b(p)), y = x.useRef(!1);
  x.useEffect(() => {
    y.current || g(b(p));
  }, [p, m]);
  const j = () => {
    if (!f || !v) return;
    const k = m ? v.replace("T", " ") : v;
    m ? h("input_datetime", "set_datetime", { entity_id: a, datetime: k }) : h("input_datetime", "set_datetime", { entity_id: a, date: v });
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
          y.current = !0;
        },
        onChange: (k) => g(k.target.value),
        onBlur: () => {
          y.current = !1, j();
        }
      }
    )
  ] });
}
class lb extends x.Component {
  constructor() {
    super(...arguments);
    ti(this, "state", { error: null });
  }
  static getDerivedStateFromError(r) {
    return { error: r };
  }
  componentDidCatch(r, o) {
    console.error("DSC panel error", r, o.componentStack);
  }
  render() {
    return this.state.error ? /* @__PURE__ */ s.jsx("div", { className: "dsc-root", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-shell", style: { padding: 24 }, children: [
      /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: "Something went wrong loading this view." }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { fontSize: 13 }, children: this.state.error.message }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginTop: 12 }, children: [
        /* @__PURE__ */ s.jsx(
          ae,
          {
            primary: !0,
            onClick: () => {
              this.setState({ error: null }), this.props.onRetry?.();
            },
            children: "Retry"
          }
        ),
        /* @__PURE__ */ s.jsx(ae, { onClick: () => window.location.reload(), children: "Reload page" })
      ] })
    ] }) }) : this.props.children;
  }
}
function G0(a) {
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
      const p = Date.now() - Date.parse(f);
      if (Number.isFinite(p) && p >= 0) {
        const b = Math.floor(p / 6e4);
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
function V0(a, i) {
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
  }), i && r.push(...G0(i).filter(
    (o) => !["hub-link", "hub-dark", "beat-dark", "panel-dark", "reduced-kit"].includes(o.id)
  )), r.sort((o, d) => o.priority - d.priority);
}
function q0(a) {
  return a[0] ?? null;
}
function ib() {
  const a = Te(), i = xt();
  return x.useMemo(
    () => V0(i, {
      state: a.state,
      available: a.available,
      entity: a.entity
    }),
    [i, a.state, a.available, a.entity, a.tick]
  );
}
function Y0({ gaps: a }) {
  const i = ib(), r = a ?? i, [o, d] = x.useState(null), h = pt();
  return r.length ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsx("div", { className: "dsc-honesty-rail", "aria-label": "Honesty gaps", children: r.slice(0, 6).map((f) => /* @__PURE__ */ s.jsx(
      "button",
      {
        type: "button",
        className: "dsc-honesty-hit",
        onClick: () => d(f),
        children: /* @__PURE__ */ s.jsx(O, { icon: "alert", label: f.label, tone: f.tone === "bad" ? "bad" : "warn" })
      },
      f.id
    )) }),
    /* @__PURE__ */ s.jsx(
      Je,
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
  ] }) : /* @__PURE__ */ s.jsx("div", { className: "dsc-honesty-rail", "aria-label": "Honesty", children: /* @__PURE__ */ s.jsx(O, { icon: "ok", label: "Kit honest", tone: "ok" }) });
}
function X0({ gaps: a }) {
  const i = ib(), o = q0(a ?? i), d = pt();
  return o ? /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass dsc-next-rec", title: "Do this next", icon: "alert", children: [
    /* @__PURE__ */ s.jsxs("p", { style: { margin: "0 0 8px" }, children: [
      /* @__PURE__ */ s.jsx("strong", { children: o.label }),
      " — ",
      o.detail
    ] }),
    /* @__PURE__ */ s.jsx(ae, { primary: !0, onClick: () => d(o.href), children: o.cta })
  ] }) : /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass dsc-next-rec", title: "Next", icon: "ok", children: [
    /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: "No critical gaps — fly Live or open Twin." }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", children: [
      /* @__PURE__ */ s.jsx(ae, { primary: !0, onClick: () => d("/live/twin"), children: "Open Twin" }),
      /* @__PURE__ */ s.jsx(ae, { teal: !0, onClick: () => d("/live/climate"), children: "Climate Want" })
    ] })
  ] });
}
const ta = "7.2.0", co = [
  `/local/DSC-HUB.js?v=${ta}`,
  `/hacsfiles/DSC-HUB/DSC-HUB.js?v=${ta}`
], rb = `/local/vendor/three.min.js?v=${ta}`, ob = `/local/vendor/dsc-dash-fx.js?v=${ta}`, cb = {
  "dsc-catalog-browse-card": [`/local/dsc-catalog-browse-card.js?v=${ta}`],
  "dsc-build-plant-card": [`/local/dsc-build-plant-card.js?v=${ta}`],
  "dsc-the-dash-card": [rb, ob, `/local/dsc-the-dash-card.js?v=${ta}`],
  "dsc-airflow-map-card": [`/local/dsc-airflow-map-card.js?v=${ta}`],
  "dsc-system-map-card": [`/local/dsc-system-map-card.js?v=${ta}`, ...co]
};
function li() {
  return typeof globalThis.THREE < "u";
}
const Hr = /* @__PURE__ */ new Map();
function Zr(a) {
  if (document.querySelector(`script[data-dsc-autoload="${a}"]`))
    return Hr.get(a) ?? Promise.resolve();
  if (Hr.has(a)) return Hr.get(a);
  const r = new Promise((o, d) => {
    const h = document.createElement("script");
    h.src = a, h.async = !0, h.dataset.dscAutoload = a, h.onload = () => o(), h.onerror = () => d(new Error(`Failed to load ${a}`)), document.head.appendChild(h);
  });
  return Hr.set(a, r), r;
}
function Q0(a) {
  const i = cb[a] ?? [], r = [];
  for (const o of [...i, ...co])
    r.includes(o) || r.push(o);
  return r;
}
async function Ip() {
  if (li()) return !0;
  for (const a of [rb, ...co])
    if (a) {
      try {
        await Zr(a);
      } catch {
      }
      if (li()) return !0;
    }
  return li();
}
async function ub(a, i = 12e3) {
  if (a === "dsc-the-dash-card" && (await Ip(), li()))
    try {
      await Zr(ob);
    } catch {
    }
  const r = cb[a] ?? [];
  for (const o of r)
    if (o)
      try {
        await Zr(o);
      } catch {
      }
  if (a === "dsc-the-dash-card" && !li() && await Ip(), customElements.get(a)) return !0;
  for (const o of co) {
    try {
      await Zr(o);
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
function Z0(a) {
  return Q0(a).map((i) => i.split("?")[0]);
}
const wd = [
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
], db = new Map(wd.map((a) => [a.id, a])), fi = wd[2];
function hb(a) {
  return `input_select.dsc_pot${a}_vessel`;
}
function K0(a) {
  const i = String(a || "").trim();
  return db.has(i) ? i : fi.id;
}
function ad(a, i) {
  const r = db.get(K0(a)) ?? fi;
  return Number.isFinite(i) && i > 0 ? { ...r, volumeL: i } : r;
}
function Ba(a, i, r) {
  const o = hb(a), d = i(o, "");
  if (d && d !== "unknown" && d !== "unavailable")
    return ad(d);
  const h = r?.("sensor.dsc_plant_roster_summary")?.attributes?.slots;
  if (Array.isArray(h)) {
    const f = h.find((m) => String(m.pot) === String(a));
    if (f?.vessel) return ad(f.vessel);
  }
  return fi;
}
function J0(a) {
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
const e_ = [
  "var(--dsc-soil-1)",
  "var(--dsc-soil-2)",
  "var(--dsc-soil-3)",
  "var(--dsc-soil-4)"
];
function t_(a) {
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
function An({
  spec: a,
  layers: i = [],
  size: r = 56,
  label: o
}) {
  const d = `vclip-${a.id}-${a.silhouette}`, h = i.reduce((m, p) => m + p.pct, 0) || 1;
  let f = 0;
  return /* @__PURE__ */ s.jsxs("span", { className: "dsc-vessel-glyph", title: a.label, children: [
    /* @__PURE__ */ s.jsxs("svg", { width: r, height: r * 1.15, viewBox: "0 0 100 100", "aria-hidden": !0, children: [
      /* @__PURE__ */ s.jsx("defs", { children: /* @__PURE__ */ s.jsx("clipPath", { id: d, children: /* @__PURE__ */ s.jsx("path", { d: t_(a.silhouette) }) }) }),
      /* @__PURE__ */ s.jsx(
        "path",
        {
          d: t_(a.silhouette),
          fill: "rgba(8,12,10,0.85)",
          stroke: J0(a.material),
          strokeWidth: "2.4",
          strokeDasharray: a.silhouette === "airpot" ? "5 3" : void 0
        }
      ),
      /* @__PURE__ */ s.jsx("g", { clipPath: `url(#${d})`, children: i.map((m, p) => {
        const b = m.pct / h * 88, v = 96 - f - b;
        return f += b, /* @__PURE__ */ s.jsx(
          "rect",
          {
            x: "12",
            y: v,
            width: "76",
            height: b,
            fill: m.color || e_[p % e_.length]
          },
          `${m.name}-${p}`
        );
      }) })
    ] }),
    o ? /* @__PURE__ */ s.jsxs("span", { className: "dsc-vessel-glyph-label", children: [
      a.volumeL,
      "L"
    ] }) : null
  ] });
}
function jd({
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
      children: /* @__PURE__ */ s.jsx(Zt, { name: i, size: 16 })
    }
  );
}
function P0(a) {
  return a instanceof Element ? !!a.closest(
    "ha-more-info-dialog, ha-dialog, ha-more-info-info, .ha-more-info, home-assistant-dialog"
  ) : !1;
}
function uo({
  items: a,
  label: i = "More actions"
}) {
  const [r, o] = x.useState(!1), d = x.useRef(null);
  return x.useEffect(() => {
    if (!r) return;
    const h = (m) => {
      P0(m.target) || d.current?.contains(m.target) || o(!1);
    }, f = (m) => {
      m.key === "Escape" && o(!1);
    };
    return document.addEventListener("mousedown", h), window.addEventListener("keydown", f), () => {
      document.removeEventListener("mousedown", h), window.removeEventListener("keydown", f);
    };
  }, [r]), /* @__PURE__ */ s.jsxs("div", { className: "dsc-overflow", ref: d, children: [
    /* @__PURE__ */ s.jsx(
      jd,
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
function n_(a) {
  return Array.from(
    a.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((i) => !i.hasAttribute("disabled") && i.tabIndex !== -1);
}
function us({
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
    const p = f.current;
    (p ? n_(p)[0] : null)?.focus();
    const v = (g) => {
      if (g.key === "Escape") {
        g.preventDefault(), i();
        return;
      }
      if (g.key !== "Tab" || !p) return;
      const y = n_(p);
      if (!y.length) return;
      const j = y[0], k = y[y.length - 1];
      g.shiftKey && document.activeElement === j ? (g.preventDefault(), k.focus()) : !g.shiftKey && document.activeElement === k && (g.preventDefault(), j.focus());
    };
    return window.addEventListener("keydown", v), () => {
      window.removeEventListener("keydown", v), m.current?.focus?.();
    };
  }, [a, i]), /* @__PURE__ */ s.jsxs(
    "div",
    {
      className: `dsc-drawer-root${a ? " is-open" : ""}`,
      "aria-hidden": !a,
      inert: a ? void 0 : !0,
      children: [
        /* @__PURE__ */ s.jsx("div", { className: "dsc-drawer-scrim", onClick: i }),
        /* @__PURE__ */ s.jsxs(
          "aside",
          {
            ref: f,
            className: `dsc-drawer-panel ${o}`,
            role: "dialog",
            "aria-modal": a ? "true" : void 0,
            "aria-labelledby": h,
            "aria-hidden": !a,
            inert: a ? void 0 : !0,
            hidden: a ? void 0 : !0,
            children: [
              a ? /* @__PURE__ */ s.jsx(
                "button",
                {
                  type: "button",
                  className: "dsc-drawer-rail",
                  "aria-label": "Close",
                  title: "Close",
                  onClick: i,
                  children: "Close"
                }
              ) : null,
              /* @__PURE__ */ s.jsxs("div", { className: "dsc-drawer-head", children: [
                /* @__PURE__ */ s.jsx("h2", { id: h, children: r }),
                /* @__PURE__ */ s.jsx(jd, { label: "Close", icon: "close", onClick: i })
              ] }),
              /* @__PURE__ */ s.jsx("div", { className: "dsc-drawer-body", children: d })
            ]
          }
        )
      ]
    }
  );
}
function W0(a) {
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
function I0({
  layers: a,
  valid: i,
  emptyLabel: r = "No blend on roster seat",
  spec: o
}) {
  const d = o ?? fi, h = a.reduce((m, p) => m + p.pct, 0), f = i ?? (a.length > 0 && Math.round(h) === 100);
  return a.length ? /* @__PURE__ */ s.jsx("div", { className: `dsc-soil${f ? " is-valid" : ""}`, children: /* @__PURE__ */ s.jsx(An, { spec: d, layers: a, size: 180, label: !0 }) }) : /* @__PURE__ */ s.jsxs("div", { className: "dsc-soil", children: [
    /* @__PURE__ */ s.jsx(An, { spec: d, size: 160 }),
    /* @__PURE__ */ s.jsx("div", { className: "dsc-soil-empty", children: r })
  ] });
}
function At(a, i = "—") {
  return !a || a === "unknown" || a === "unavailable" || a === "none" ? i : a;
}
function fb(a) {
  const i = String(a || "").trim().toLowerCase();
  return i === "clone" || i === "2x4" || i === "2×4" ? "clone" : i === "main" || i === "4x8" || i === "4×8" ? "main" : "unassigned";
}
function Wr(a, i) {
  return fb(a(`input_select.dsc_pot${i}_tent`, "unassigned"));
}
function ho(a) {
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
function ds(a, i) {
  const { state: r, entity: o } = i, d = o("sensor.dsc_plant_roster_summary")?.attributes?.slots || [], h = Array.isArray(d) ? d.find((p) => String(p.pot) === String(a)) : void 0, f = (p, b) => {
    const v = At(r(p, ""));
    return v !== "—" ? v : At(r(b, ""));
  }, m = At(h?.blend, "");
  return {
    pot: a,
    plantName: At(r(`text.dsc_pot${a}_plant_name`, "")),
    strainDisplay: At(r(`sensor.dsc_pot${a}_strain_display`, "")),
    sprout: At(r(`datetime.dsc_pot${a}_sprout_date`, ""), "—").slice(0, 10),
    days: At(r(`sensor.dsc_pot${a}_days_since_sprout`, "")),
    stage: At(r(`sensor.dsc_pot${a}_expected_stage`, "")),
    growthStage: At(r(`select.dsc_pot${a}_growth_stage`, "")),
    tent: Wr(r, a),
    blend: m,
    recipe: At(h?.recipe, ""),
    notes: At(h?.notes, ""),
    layers: W0(m),
    moisture: f(`sensor.dsc_pot${a}_got_moisture`, `sensor.dsc_pot${a}_soil_moisture`),
    soilTemp: At(r(`sensor.dsc_pot${a}_soil_temperature`, "")),
    ec: f(`sensor.dsc_pot${a}_got_ec`, `sensor.dsc_pot${a}_soil_conductivity`),
    ph: f(`sensor.dsc_pot${a}_got_ph`, `sensor.dsc_pot${a}_soil_ph`),
    n: At(r(`sensor.dsc_pot${a}_soil_nitrogen`, "")),
    p: At(r(`sensor.dsc_pot${a}_soil_phosphorus`, "")),
    k: At(r(`sensor.dsc_pot${a}_soil_potassium`, "")),
    need: At(r(`sensor.dsc_pot${a}_need_summary`, "")),
    rosterSlot: h?.slot ?? null
  };
}
function gn(a, i, r) {
  const o = `sensor.dsc_pot${a}_got_${i}`, d = i === "moisture" ? `sensor.dsc_pot${a}_soil_moisture` : i === "ec" ? `sensor.dsc_pot${a}_soil_conductivity` : `sensor.dsc_pot${a}_soil_ph`, h = r(o, "");
  return h && h !== "unavailable" && h !== "unknown" ? o : d;
}
function mb(a, i, r) {
  return Sd(i).map((o) => ds(o, { state: i, entity: r })).filter((o) => o.tent === a && o.plantName !== "—" && o.plantName.trim() !== "");
}
const aa = [1, 2, 3, 4];
function Kt(a, i) {
  const r = `input_boolean.dsc_pot${a}_in_service`, o = i(r, "off");
  return o === "unavailable" || o === "unknown" || o === "" ? !1 : o === "on";
}
function Sd(a, i = [...aa]) {
  return i.filter((r) => Kt(r, a));
}
function e1(a, i = [...aa]) {
  return { inService: Sd(a, i).length, total: i.length };
}
function t1(a) {
  const i = a("sensor.dsc_plant_roster_summary")?.attributes?.slots;
  return Array.isArray(i) ? i : [];
}
function fo(a, i) {
  const r = Kt(a, i), o = i(`binary_sensor.dsc_pot${a}_sensor_stuck`) === "on", d = i(`binary_sensor.dsc_pot${a}_untrusted`) === "on", h = i("sensor.dsc_peer_divergence_summary", ""), f = r && h !== "—" && h !== "ok" && h.toLowerCase() !== "none" && h !== "unknown" && h !== "unavailable" && h.length > 0 && h !== "0", m = [];
  o && m.push("stuck"), d && m.push("untrusted"), f && m.push("peer divergence");
  let p = "ok";
  return d || o ? p = "bad" : f && (p = "warn"), {
    stuck: o,
    untrusted: d,
    peerDivergence: f,
    blockNeedAct: d || o,
    tone: p,
    labels: m
  };
}
function qu(a, i) {
  return !Number.isFinite(a) || !Number.isFinite(i) ? NaN : 6.112 * Math.exp(17.67 * a / (a + 243.5)) * i * 2.1674 / (273.15 + a);
}
function n1(a) {
  return a === "/live/main" || a === "/live/4x8" ? "main" : a === "/live/clone" || a === "/live/2x4" ? "clone" : null;
}
function a1(a) {
  return a === "/live/twin" || a === "/ops/dash" || a === "/live/main" || a === "/live/clone" || a === "/live/4x8" || a === "/live/2x4";
}
function s1() {
  const a = zt(), { hass: i, available: r, num: o, state: d, entity: h, tick: f } = Te(), m = x.useRef(null), p = x.useRef(null), [b, v] = x.useState("loading"), g = n1(a.pathname), y = a.pathname === "/live/twin" || a.pathname === "/ops/dash", j = y || a.pathname === "/live/main" || a.pathname === "/live/clone" || a.pathname === "/live/4x8" || a.pathname === "/live/2x4", k = r("binary_sensor.dsc_hub_link") ? d("binary_sensor.dsc_hub_link") !== "on" : !r("sensor.dsc_hub_uptime");
  return x.useEffect(() => {
    const T = m.current;
    if (!T || p.current) return;
    let C = !1;
    return (async () => {
      v("loading");
      const M = await ub("dsc-the-dash-card");
      if (C || !m.current) return;
      if (!M) {
        v("missing");
        return;
      }
      const E = document.createElement("dsc-the-dash-card");
      typeof E.setConfig == "function" && E.setConfig({ type: "custom:dsc-the-dash-card" }), i && (E.hass = i), T.appendChild(E), p.current = E, v("ready");
    })(), () => {
      C = !0;
    };
  }, []), x.useEffect(() => {
    p.current && i && (p.current.hass = i);
  }, [i, f]), x.useEffect(() => {
    const T = p.current;
    T && (T.setFocusTent?.(g), T.setUiChrome?.({ hideHud: a1(a.pathname) }));
  }, [g, a.pathname, b]), x.useEffect(() => {
    const T = p.current, C = () => {
      const M = !j || document.hidden;
      T?.pause?.(M);
    };
    return C(), document.addEventListener("visibilitychange", C), () => document.removeEventListener("visibilitychange", C);
  }, [j, b]), x.useEffect(() => {
    p.current?.setHeld?.(k);
  }, [k, b]), x.useEffect(() => {
    const T = p.current;
    if (!T?.setPots) return;
    const C = { clone: [], main: [] };
    aa.forEach((E) => {
      const F = Wr(d, E);
      (F === "clone" || F === "main") && C[F].push(E);
    });
    const M = aa.map((E) => {
      const F = ds(E, { state: d, entity: h }), P = Ba(E, d, h), K = fo(E, d), L = Kt(E, d), G = Wr(d, E), ee = G === "clone" || G === "main" ? Math.max(0, C[G].indexOf(E)) : 0;
      return {
        id: `pot${E}`,
        pot: E,
        tent: G,
        slot: ee,
        inService: L,
        silhouette: P.silhouette,
        moisture: Number(F.moisture),
        ec: Number(F.ec),
        ph: Number(F.ph),
        soilT: Number(F.soilTemp),
        dryback: o(`sensor.dsc_pot${E}_dryback_pct`),
        need: F.need,
        held: k,
        untrusted: K.untrusted
      };
    });
    T.setPots(M);
  }, [d, h, o, k, b]), /* @__PURE__ */ s.jsxs(
    "div",
    {
      className: `dsc-twin-keepalive${y ? " is-active" : ""}`,
      "aria-hidden": !y,
      inert: y ? void 0 : !0,
      "data-status": b,
      "data-focus-tent": g || "both",
      style: y ? void 0 : {
        pointerEvents: "none",
        position: "fixed",
        visibility: "hidden",
        inset: 0,
        zIndex: -1,
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ s.jsx("div", { className: "dsc-twin-keepalive-host", ref: m, style: y ? void 0 : { pointerEvents: "none" } }),
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
const l1 = "https://cannalib.plausible-deniability.net", i1 = {
  strain: "/local/dsc-catalog/dsc_strains_search_index.json",
  medium: "/local/dsc-catalog/dsc_mediums_search_index.json",
  nutrient: "/local/dsc-catalog/dsc_nutrients_search_index.json",
  light: "/local/dsc-catalog/dsc_lights_search_index.json"
}, r1 = {
  strain: "strains",
  medium: "mediums",
  nutrient: "nutrients",
  light: "lights"
};
function o1(a) {
  return (a("input_text.dsc_cannalib_base_url", "") || l1).replace(/\/$/, "");
}
function c1(a) {
  const i = { Accept: "application/json" }, r = a("input_text.dsc_cannalib_api_key", "");
  return r && r !== "unknown" && r !== "unavailable" && (i["X-Cannalib-Key"] = r), i;
}
function pb(a) {
  if (Array.isArray(a)) return a;
  if (a && typeof a == "object") {
    const i = a;
    if (Array.isArray(i.items)) return i.items;
    if (Array.isArray(i.strains)) return i.strains;
  }
  return [];
}
function _b(a) {
  return String(a.name || a.id || "").trim();
}
function u1(a) {
  const i = String(a.kind ?? "").trim().toLowerCase();
  if (i && i !== "strain" && i !== "cultivar") return !1;
  const r = _b(a), o = r.toLowerCase();
  return !(/\bcapsules?\b/.test(o) || /\brosin\b/.test(o) || /\blubricant\b/.test(o) || /\bthca\s+pebbles?\b/.test(o) || /\d+\s*mg\b/.test(o) || /^#+\s*\d+/.test(r.trim()));
}
function a_(a, i) {
  return a !== "strain" ? i : i.filter(u1);
}
function s_(a, i) {
  const r = i.trim().toLowerCase();
  if (!r || a.length < 2) return a;
  const o = (d) => {
    if (String(d.matched_via ?? "").toLowerCase() === "science_alias") return 0;
    const f = String(d.science_alias ?? "").toLowerCase();
    return f && f.split(/[,;/|]/).some((m) => m.trim() === r || m.trim().includes(r)) ? 1 : 2;
  };
  return [...a].sort((d, h) => o(d) - o(h));
}
async function d1(a, i) {
  const r = await fetch(i1[a], { cache: "no-store" });
  if (!r.ok) return [];
  const o = pb(await r.json()), d = i.trim().toLowerCase();
  return d ? o.filter((h) => _b(h).toLowerCase().includes(d)) : o;
}
async function bb(a, i, r, o = 100) {
  try {
    const h = r1[a], f = `${o1(r)}/v1/catalogs/${h}?q=${encodeURIComponent(i || "")}&limit=${o}`, m = await fetch(f, { headers: c1(r), cache: "no-store" });
    if (!m.ok) throw new Error(`cannalib ${m.status}`);
    const p = s_(a_(a, pb(await m.json())), i);
    if (p.length || a === "strain")
      return {
        items: p,
        source: "cannalib",
        note: "CannaLib live"
      };
  } catch {
  }
  return {
    items: s_(a_(a, await d1(a, i)), i),
    source: "local",
    note: "CannaLib unreachable — local JSON index"
  };
}
function gb({
  kind: a,
  onPick: i,
  placeholder: r
}) {
  const { state: o } = Te(), [d, h] = x.useState(""), [f, m] = x.useState([]), [p, b] = x.useState("local"), [v, g] = x.useState(""), [y, j] = x.useState(!1);
  x.useEffect(() => {
    let T = !1;
    const C = window.setTimeout(() => {
      j(!0), bb(a, d, o, 100).then((M) => {
        T || (m(M.items), b(M.source), g(M.note), j(!1));
      }).catch(() => {
        T || (m([]), g("Catalog search failed — try again."), j(!1));
      });
    }, 200);
    return () => {
      T = !0, window.clearTimeout(C);
    };
  }, [a, d]);
  const k = x.useMemo(() => f, [f]);
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-catalog-picker", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ s.jsx(
        O,
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
        value: d,
        placeholder: r || "Type to search — options are not culled",
        onChange: (T) => h(T.target.value),
        autoComplete: "off"
      }
    ),
    /* @__PURE__ */ s.jsxs("ul", { className: "dsc-catalog-hits", children: [
      y && !k.length ? /* @__PURE__ */ s.jsx("li", { className: "dsc-muted", children: "Searching…" }) : null,
      !y && !k.length ? /* @__PURE__ */ s.jsx("li", { className: "dsc-muted", children: "No catalog hits — empty is honesty, not a placeholder." }) : null,
      k.map((T, C) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsxs("button", { type: "button", onClick: () => i(T), children: [
        /* @__PURE__ */ s.jsx("strong", { children: T.name }),
        T.type ? /* @__PURE__ */ s.jsx("em", { children: String(T.type) }) : null,
        T.breeder ? /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", children: String(T.breeder) }) : null
      ] }) }, `${T.id || T.name}-${C}`))
    ] })
  ] });
}
const ea = [1, 2, 3];
function vb(a, i) {
  return ea.find((o) => !a[o] && o !== i) ?? ea.find((o) => !a[o]) ?? 3;
}
function Yu(a, i, r, o) {
  const d = vb(o, a), h = ea.filter((g) => g !== a && g !== d), f = h.reduce((g, y) => g + (Number.isFinite(r[y]) ? Math.round(r[y]) : 0), 0), m = Math.max(0, 100 - f), p = Math.max(0, Math.min(m, Math.round(i))), b = m - p, v = { ...r, [a]: p, [d]: b };
  return h.forEach((g) => {
    v[g] = Math.round(Number.isFinite(r[g]) ? r[g] : 0);
  }), v;
}
function h1({ volumeL: a }) {
  const { state: i, num: r, available: o } = Te(), { callService: d } = $t(), [h, f] = x.useState({ 1: !1, 2: !1, 3: !1 }), [m, p] = x.useState(null), [b, v] = x.useState(null), g = {
    1: r("input_number.dsc_blend_pct_1", 0),
    2: r("input_number.dsc_blend_pct_2", 0),
    3: r("input_number.dsc_blend_pct_3", 0)
  }, y = b ?? g, j = ea.map((L) => ({
    n: L,
    name: i(`input_text.dsc_blend_component_${L}_name`, ""),
    pct: Number.isFinite(y[L]) ? y[L] : 0
  })), k = ea.filter((L) => h[L]).length, T = vb(h), C = Number.isFinite(a) && a > 0 ? a : r("input_number.dsc_blend_total_l", 20), M = j.reduce((L, G) => L + (Number.isFinite(G.pct) ? G.pct : 0), 0), E = (L) => {
    ea.forEach((G) => {
      o(`input_number.dsc_blend_pct_${G}`) && d("input_number", "set_value", {
        entity_id: `input_number.dsc_blend_pct_${G}`,
        value: L[G]
      });
    });
  }, F = (L, G) => {
    const ee = Yu(L, G, b ?? y, h);
    v(null), p(null), E(ee);
  }, P = (L) => {
    f((G) => {
      const ee = { ...G, [L]: !G[L] };
      return ea.filter((te) => ee[te]).length >= ea.length ? G : ee;
    });
  }, K = x.useMemo(
    () => j.filter((L) => L.pct > 0 && L.name && L.name !== "unknown").map((L) => `${L.name} ${(C * L.pct / 100).toFixed(1)}L (${Math.round(L.pct)}%)`).join(" · "),
    [j, C]
  );
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-coupled-mix", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ s.jsx(O, { label: `Σ ${Math.round(M)}%`, tone: Math.round(M) === 100 ? "ok" : "warn" }),
      /* @__PURE__ */ s.jsx(O, { label: `${C} L vessel`, tone: "muted" }),
      /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", style: { fontSize: 12 }, children: "Lock the layers you want to keep — the remainder layer soaks up the rest so the total is always 100%." })
    ] }),
    ea.map((L) => {
      const G = j[L - 1], ee = L === T && !h[L];
      return /* @__PURE__ */ s.jsxs("div", { className: "dsc-mix-row", children: [
        /* @__PURE__ */ s.jsx(Qr, { entityId: `input_text.dsc_blend_component_${L}_name`, label: `Layer ${L}` }),
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "range",
            min: 0,
            max: 100,
            value: Math.round(G.pct),
            disabled: h[L] || ee,
            onPointerDown: (le) => {
              h[L] || ee || (le.target.setPointerCapture(le.pointerId), p(L), v({ ...y }));
            },
            onPointerUp: (le) => {
              m === L && F(L, Number(le.target.value));
            },
            onPointerCancel: () => {
              v(null), p(null);
            },
            onLostPointerCapture: (le) => {
              m === L && F(L, Number(le.target.value));
            },
            onChange: (le) => {
              const te = Number(le.target.value);
              if (m === L) {
                v(Yu(L, te, b ?? y, h));
                return;
              }
              E(Yu(L, te, y, h));
            }
          }
        ),
        /* @__PURE__ */ s.jsxs("strong", { children: [
          Math.round(G.pct),
          "%"
        ] }),
        /* @__PURE__ */ s.jsxs("span", { className: "dsc-mono", children: [
          (C * G.pct / 100).toFixed(1),
          " L"
        ] }),
        /* @__PURE__ */ s.jsx(ae, { disabled: k >= 2 && !h[L], onClick: () => P(L), children: h[L] ? "Unlock" : ee ? "Remainder" : "Lock" })
      ] }, L);
    }),
    /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: [
      "Recipe: ",
      K || "Mix not set yet."
    ] })
  ] });
}
const kd = "sensor.dsc_hub_uptime", xb = "sensor.dsc_hub_heartbeat";
function f1(a, i) {
  if (!i || a == null || a === "") return NaN;
  const r = a.trim().toLowerCase();
  if (r === "unavailable" || r === "unknown" || r === "none") return NaN;
  const o = Number(a);
  return Number.isFinite(o) ? o : NaN;
}
function ge(a) {
  const { available: i, tick: r, entity: o } = Te(), d = xt(), h = sa(), f = x.useRef(null), m = x.useRef(a), [, p] = x.useState(0);
  m.current !== a && (m.current = a, f.current = null);
  const b = h === "pi" ? Pr(a, d) : null, v = h === "pi" ? gd(a, d) : !1, g = h === "pi" ? d0(d) : !i(kd) || !i(xb), y = h === "pi" && v || i(a), j = b != null && Number.isFinite(b) ? b : f1(o(a)?.state, y), k = g && j === 0;
  return x.useEffect(() => {
    if (y && Number.isFinite(j) && !k) {
      f.current = { value: j, at: Date.now() }, p((T) => T + 1);
      return;
    }
    p((T) => T + 1);
  }, [a, y, j, k, r, o]), y && Number.isFinite(j) && !k ? { value: j, stale: !1, heldAt: f.current?.at, live: !0 } : f.current != null ? {
    value: f.current.value,
    stale: !0,
    heldAt: f.current.at,
    live: !1
  } : { value: NaN, stale: !1, heldAt: void 0, live: !1 };
}
function Nd(a) {
  const { available: i, entity: r, tick: o } = Te(), d = xt();
  if (sa() === "pi" && a === kd && d.hub.online || i(a)) return null;
  const f = r(a)?.last_changed;
  if (!f) return null;
  const m = Date.parse(f);
  return Number.isFinite(m) ? Date.now() - m : null;
}
function yb() {
  const a = xt(), i = sa(), r = Nd(kd);
  return i === "pi" && !a.hub.online && a.hub.last_seen ? Date.now() - a.hub.last_seen * 1e3 : r;
}
function wb() {
  return Nd(xb);
}
function jb() {
  const a = xt();
  return sa() === "pi" && !a.panel.online && a.panel.last_seen ? Date.now() - a.panel.last_seen * 1e3 : Nd("binary_sensor.dsc_hub_panel_link");
}
function Cd(a) {
  return !!a && Number.isFinite(a.min) && Number.isFinite(a.max) && a.max > a.min;
}
function mi(a) {
  if (a.available === !1 || !Number.isFinite(a.value)) return "muted";
  if (a.stale) return "stale";
  if (a.fault) return "critical";
  if (Cd(a.band)) {
    const i = a.margin ?? 0;
    if (a.value < a.band.min - i || a.value > a.band.max + i)
      return a.value < a.band.min - i * 3 || a.value > a.band.max + i * 3 ? "critical" : "warn";
  }
  return "ok";
}
function m1(a) {
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
function Ed(a) {
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
function mo(a, i) {
  if (!Cd(a)) return;
  const r = i === "°C" ? 1 : 0.05;
  return Math.max((a.max - a.min) * 0.12, r);
}
const Sb = [
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
], Xu = {
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
function Lr(a, i) {
  const r = Number(a(i, ""));
  return Number.isFinite(r) && r > 0 ? r : NaN;
}
function l_(a) {
  if (!a || a === "—" || a === "Off" || a === "Custom") return null;
  const i = Xu[a];
  if (i) return i;
  const r = Object.keys(Xu).find((o) => a.indexOf(o) >= 0);
  return r ? Xu[r] : null;
}
function Qu(a, i) {
  return !Number.isFinite(i.min) || !Number.isFinite(i.max) ? a : a ? {
    min: Math.max(a.min, i.min),
    max: Math.min(a.max, i.max),
    source: a.source === "plant" || i.source === "plant" ? "plant" : "stage",
    mixed: a.source !== i.source || a.mixed
  } : { ...i, mixed: !1 };
}
function sd(a, i) {
  const r = mb(a, i.state, i.entity).filter((y) => Kt(y.pot, i.state));
  let o = null, d = null, h = null, f = null;
  const m = [], p = [];
  let b = !1;
  for (const y of r) {
    y.stage && y.stage !== "—" && (m.length && !m.includes(y.stage) && (b = !0), m.includes(y.stage) || m.push(y.stage)), y.need && y.need !== "—" && y.need !== "ok" && !p.includes(y.need) && p.push(y.need);
    const j = Lr(i.state, `sensor.dsc_pot${y.pot}_want_temp_min`), k = Lr(i.state, `sensor.dsc_pot${y.pot}_want_temp_max`);
    Number.isFinite(j) && Number.isFinite(k) && (o = Qu(o, { min: j, max: k, source: "plant" }));
    const T = Lr(i.state, `sensor.dsc_pot${y.pot}_want_rh_min`), C = Lr(i.state, `sensor.dsc_pot${y.pot}_want_rh_max`);
    Number.isFinite(T) && Number.isFinite(C) && (d = Qu(d, { min: T, max: C, source: "plant" }));
    const M = l_(y.stage);
    M && (o || (o = { min: M.temp - 1.5, max: M.temp + 1.5, source: "stage", mixed: !1 }), d || (d = { min: M.rhMin, max: M.rhMax, source: "stage", mixed: !1 }), h = Qu(h, { min: M.vpdMin, max: M.vpdMax, source: "stage" }), f = f == null ? M.lightHours : Math.min(f, M.lightHours));
  }
  const v = a === "main" ? i.state("select.dsc_hub_grow_stage", "") : i.state("select.dsc_hub_clone_mode", "");
  if (!r.length || !o && !d && !h) {
    const y = a === "clone" ? v === "Clones & Seedlings" ? "Seedling" : v === "Mother" ? "Vegetative" : v === "Follow 4x8" ? i.state("select.dsc_hub_grow_stage", "") : "" : v, j = l_(y);
    j && (o || (o = { min: j.temp - 1.5, max: j.temp + 1.5, source: "stage", mixed: !1 }), d || (d = { min: j.rhMin, max: j.rhMax, source: "stage", mixed: !1 }), h || (h = { min: j.vpdMin, max: j.vpdMax, source: "stage", mixed: !1 }), f == null && (f = j.lightHours), y && !m.includes(y) && m.push(y));
  }
  return o && o.min > o.max && (o = { ...o, min: o.max, max: o.min, mixed: !0 }), d && d.min > d.max && (d = { ...d, min: d.max, max: d.min, mixed: !0 }), h && h.min > h.max && (h = { ...h, min: h.max, max: h.min, mixed: !0 }), {
    temp: o,
    rh: d,
    vpd: h,
    lightHours: f,
    mixed: b,
    stages: m,
    needs: p,
    emptyLabel: !o && !d && !h ? "no plant/stage rail" : null
  };
}
function Da(a, i, r) {
  if (r) return { tone: "critical", label: "min > max" };
  if (!i) return { tone: "muted", label: "no plant/stage rail" };
  const o = mi({ value: a, band: i, margin: (i.max - i.min) * 0.12 }), d = i.source === "plant" ? "plant Want" : "stage rail";
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
function Zu(a, i, r) {
  const o = Number(r(`sensor.dsc_pot${a}_want_${i}_min`, "")), d = Number(r(`sensor.dsc_pot${a}_want_${i}_max`, ""));
  if (o > 0 && d > 0 && d >= o) return { min: o, max: d };
  if (i === "moisture") return { min: 0, max: 45 };
}
const i_ = 2e3, kb = 300 * 1e3;
function Nb(a, i = Date.now(), r) {
  if (!a.length) return [];
  const o = [...a].sort((f, m) => f.t - m.t), d = [];
  for (let f = 0; f < o.length; f++) {
    const m = o[f];
    if (!Number.isFinite(m.v)) continue;
    const p = d[d.length - 1];
    p && m.t - p.t > i_ && d.push({ t: m.t - 1, v: p.v }), d.push(m);
  }
  const h = d[d.length - 1];
  if (h && i - h.t > i_) {
    const f = i - h.t;
    (r?.markStale || f <= kb) && d.push({ t: i, v: h.v });
  }
  return d;
}
const $r = [
  "var(--dsc-neon)",
  "var(--dsc-teal)",
  "var(--dsc-amber)",
  "var(--dsc-gray-5)"
];
function r_(a) {
  const i = Math.max(...a, 1), r = 10 ** Math.floor(Math.log10(i));
  return Math.ceil(i / r) * r;
}
function o_(a, i = !1) {
  const r = Math.min(...a);
  if (i && r >= 0) return 0;
  const o = Math.abs(r) || 1, d = 10 ** Math.floor(Math.log10(o));
  return Math.floor(r / d) * d;
}
function c_(a, i, r = 0.08) {
  if (!Number.isFinite(a) || !Number.isFinite(i)) return { min: 0, max: 1 };
  if (i <= a) return { min: a - 1, max: i + 1 };
  const d = (i - a) * r || 1;
  return { min: a - d, max: i + d };
}
function Ir(a, i, r, o, d, h, f, m) {
  const p = Math.max(h - d, 1e-6), b = Math.max(m - f, 1), v = i - o.l - o.r, g = r - o.t - o.b;
  return {
    x: o.l + (a.t - f) / b * v,
    y: o.t + (1 - (a.v - d) / p) * g
  };
}
function p1(a, i, r, o, d, h, f, m, p = !1) {
  return a.length ? a.map((b, v) => {
    const { x: g, y } = Ir(b, i, r, o, d, h, f, m);
    if (v === 0) return `M${g.toFixed(1)} ${y.toFixed(1)}`;
    if (!p) return `L${g.toFixed(1)} ${y.toFixed(1)}`;
    const j = Ir(a[v - 1], i, r, o, d, h, f, m);
    return `L${g.toFixed(1)} ${j.y.toFixed(1)} L${g.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ") : "";
}
function _1(a, i, r) {
  if (!i || !Number.isFinite(a)) return r;
  const o = Math.max(i.max - i.min, 1e-6), d = Math.max(o * 0.12, 0.05);
  return a < i.min - 3 * d || a > i.max + 3 * d ? "var(--dsc-bad)" : a < i.min - d || a > i.max + d ? "var(--dsc-amber)" : r;
}
function b1(a, i, r, o, d, h, f, m, p, b, v = !1) {
  if (a.length < 2) return [];
  const g = [];
  for (let y = 1; y < a.length; y++) {
    const j = a[y - 1], k = a[y], T = Ir(j, i, r, o, d, h, f, m), C = Ir(k, i, r, o, d, h, f, m), M = _1(k.v, p, b), E = v ? `M${T.x.toFixed(1)} ${T.y.toFixed(1)} L${C.x.toFixed(1)} ${T.y.toFixed(1)} L${C.x.toFixed(1)} ${C.y.toFixed(1)}` : `M${T.x.toFixed(1)} ${T.y.toFixed(1)} L${C.x.toFixed(1)} ${C.y.toFixed(1)}`, F = g[g.length - 1];
    F && F.color === M ? F.d += E.slice(1) : g.push({ d: E, color: M });
  }
  return g;
}
function u_(a) {
  const i = new Date(a), r = String(i.getHours()).padStart(2, "0"), o = String(i.getMinutes()).padStart(2, "0");
  return `${r}:${o}`;
}
function is(a, i, r, o, d) {
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
    return Math.max(...o, 100) <= 100 && d >= 0 ? { min: 0, max: 100 } : c_(o_(o, !0), r_(o));
  }
  return c_(o_(o), r_(o));
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
  const p = x.useId().replace(/:/g, ""), b = 640, v = a.some((S) => S.axis === "right"), g = { l: 40, r: v ? 40 : 14, t: 16, b: 28 }, y = x.useRef(null), [j, k] = x.useState(null), [T, C] = x.useState(!1), M = x.useMemo(() => {
    if (!a.length) return !1;
    const S = a.flatMap((Y) => Y.series);
    if (!S.length) return !1;
    const z = Math.max(...S.map((Y) => Y.t));
    return (h != null ? Date.now() - h : Date.now() - z) > kb;
  }, [a, h]), E = x.useMemo(() => {
    const S = a.flatMap((Q) => Q.series);
    if (!S.length) return null;
    const z = d_(a, "left", m?.left), q = d_(a, "right", m?.right), Y = Math.min(...S.map((Q) => Q.t)), I = Math.max(...S.map((Q) => Q.t)), N = M ? I : Math.max(I, Date.now()), H = a.map((Q, ne) => {
      const pe = Q.axis || "left", de = pe === "right" ? q : z, ve = Q.color || $r[ne % $r.length];
      return {
        ...Q,
        axis: pe,
        color: ve,
        d: p1(Q.series, b, i, g, de.min, de.max, Y, N, Q.step),
        segs: Q.ghost ? [] : b1(Q.series, b, i, g, de.min, de.max, Y, N, Q.band, ve, Q.step),
        last: Q.series.length ? Q.series[Q.series.length - 1] : null,
        ext: Rn(Q.series),
        dom: de
      };
    });
    return { left: z, right: q, t0: Y, t1: N, paths: H };
  }, [a, i, v, m, M]), F = x.useMemo(() => {
    if (!E) return [];
    const S = 4, z = [];
    for (let q = 0; q <= S; q++) {
      const Y = q / S, I = E.left.max - Y * (E.left.max - E.left.min), N = g.t + Y * (i - g.t - g.b);
      z.push({ y: N, label: I.toFixed(Math.abs(I) >= 100 ? 0 : 1) });
    }
    return z;
  }, [E, i]), P = x.useMemo(() => {
    if (!E || !v) return [];
    const S = 4, z = [];
    for (let q = 0; q <= S; q++) {
      const Y = q / S, I = E.right.max - Y * (E.right.max - E.right.min), N = g.t + Y * (i - g.t - g.b);
      z.push({ y: N, label: I.toFixed(Math.abs(I) >= 100 ? 0 : 1) });
    }
    return z;
  }, [E, i, v]), K = x.useMemo(() => {
    if (!E) return [];
    const S = 5, z = [], q = Math.max(E.t1 - E.t0, 1), Y = b - g.l - g.r;
    for (let I = 0; I < S; I++) {
      const N = I / (S - 1), H = E.t0 + N * q;
      z.push({ x: g.l + N * Y, label: u_(H) });
    }
    return z;
  }, [E]), L = x.useCallback(
    (S) => {
      const z = y.current;
      if (!z || !E) return null;
      const q = z.getBoundingClientRect(), Y = (S - q.left) / Math.max(q.width, 1) * b, I = b - g.l - g.r, N = Math.min(b - g.r, Math.max(g.l, Y)), H = (N - g.l) / Math.max(I, 1);
      return { t: E.t0 + H * Math.max(E.t1 - E.t0, 1), x: N };
    },
    [E]
  ), G = (S) => {
    if (T) return;
    const z = L(S.clientX);
    z && k(z);
  }, ee = () => {
    T || k(null);
  }, le = (S) => {
    const z = L(S.clientX);
    if (z) {
      if (T && j && Math.abs(j.x - z.x) < 8) {
        C(!1), k(null);
        return;
      }
      C(!0), k(z);
    }
  }, te = x.useMemo(() => !E || !j ? [] : E.paths.map((S) => {
    if (!S.series.length) return { id: S.id, label: S.label, color: S.color, v: null, unit: S.unit || "" };
    let z = S.series[0], q = Math.abs(z.t - j.t);
    for (const I of S.series) {
      const N = Math.abs(I.t - j.t);
      N < q && (z = I, q = N);
    }
    const Y = is(z.v, S.dom.min, S.dom.max, i, g);
    return {
      id: S.id,
      label: S.label,
      color: S.color,
      v: z.v,
      unit: S.unit || "",
      y: Y,
      x: g.l + (z.t - E.t0) / Math.max(E.t1 - E.t0, 1) * (b - g.l - g.r)
    };
  }), [E, j, i]), ue = E ? `${E.t0}-${E.t1}-${E.paths.map((S) => S.d).join("|")}` : "empty", ie = Cb(ue), re = b * 1.4, fe = Eb(re, ie), oe = E?.paths[0]?.last?.v ?? null;
  return /* @__PURE__ */ s.jsxs(
    "div",
    {
      className: `dsc-chart${M ? " is-stale" : ""}`,
      style: { position: "relative", width: "100%" },
      children: [
        /* @__PURE__ */ s.jsxs(
          "svg",
          {
            ref: y,
            viewBox: `0 0 ${b} ${i}`,
            width: "100%",
            height: i,
            role: "img",
            "aria-label": "Live chart",
            className: "dsc-chart-svg",
            onPointerMove: G,
            onPointerLeave: ee,
            onPointerDown: le,
            children: [
              /* @__PURE__ */ s.jsxs("defs", { children: [
                E?.paths.map((S) => /* @__PURE__ */ s.jsxs("linearGradient", { id: `fill-${p}-${S.id}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
                  /* @__PURE__ */ s.jsx("stop", { offset: "0%", stopColor: S.color, stopOpacity: "0.28" }),
                  /* @__PURE__ */ s.jsx("stop", { offset: "100%", stopColor: S.color, stopOpacity: "0" })
                ] }, S.id)),
                /* @__PURE__ */ s.jsxs("filter", { id: `glow-${p}`, x: "-40%", y: "-40%", width: "180%", height: "180%", children: [
                  /* @__PURE__ */ s.jsx("feGaussianBlur", { stdDeviation: "2.8", result: "b" }),
                  /* @__PURE__ */ s.jsxs("feMerge", { children: [
                    /* @__PURE__ */ s.jsx("feMergeNode", { in: "b" }),
                    /* @__PURE__ */ s.jsx("feMergeNode", { in: "SourceGraphic" })
                  ] })
                ] }),
                /* @__PURE__ */ s.jsxs("filter", { id: `glow-soft-${p}`, x: "-50%", y: "-50%", width: "200%", height: "200%", children: [
                  /* @__PURE__ */ s.jsx("feGaussianBlur", { stdDeviation: "4.2", result: "b" }),
                  /* @__PURE__ */ s.jsx("feMerge", { children: /* @__PURE__ */ s.jsx("feMergeNode", { in: "b" }) })
                ] })
              ] }),
              F.map((S) => /* @__PURE__ */ s.jsxs("g", { children: [
                /* @__PURE__ */ s.jsx(
                  "line",
                  {
                    x1: g.l,
                    x2: b - g.r,
                    y1: S.y,
                    y2: S.y,
                    stroke: "var(--dsc-gray-3)",
                    strokeWidth: "1",
                    strokeDasharray: "3 4"
                  }
                ),
                /* @__PURE__ */ s.jsx(
                  "text",
                  {
                    x: g.l - 6,
                    y: S.y + 3,
                    textAnchor: "end",
                    fill: "var(--dsc-gray-5)",
                    fontSize: "9",
                    fontFamily: "var(--dsc-mono)",
                    children: S.label
                  }
                )
              ] }, `L${S.y}`)),
              P.map((S) => /* @__PURE__ */ s.jsx(
                "text",
                {
                  x: b - g.r + 6,
                  y: S.y + 3,
                  textAnchor: "start",
                  fill: "var(--dsc-teal)",
                  fontSize: "9",
                  fontFamily: "var(--dsc-mono)",
                  opacity: 0.85,
                  children: S.label
                },
                `R${S.y}`
              )),
              K.map((S) => /* @__PURE__ */ s.jsx(
                "text",
                {
                  x: S.x,
                  y: i - 8,
                  textAnchor: "middle",
                  fill: "var(--dsc-gray-5)",
                  fontSize: "9",
                  fontFamily: "var(--dsc-mono)",
                  children: S.label
                },
                S.x
              )),
              E ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
                f.map((S, z) => {
                  const q = S.axis || "left", Y = q === "right" ? E.right : E.left, I = S.color || (q === "right" ? "var(--dsc-teal)" : "var(--dsc-amber)");
                  if (S.min != null && S.max != null) {
                    const H = is(S.max, Y.min, Y.max, i, g), Q = is(S.min, Y.min, Y.max, i, g);
                    return /* @__PURE__ */ s.jsxs("g", { children: [
                      /* @__PURE__ */ s.jsx(
                        "rect",
                        {
                          x: g.l,
                          y: Math.min(H, Q),
                          width: b - g.l - g.r,
                          height: Math.abs(Q - H),
                          fill: I,
                          opacity: 0.08
                        }
                      ),
                      /* @__PURE__ */ s.jsx(
                        "line",
                        {
                          x1: g.l,
                          x2: b - g.r,
                          y1: H,
                          y2: H,
                          stroke: I,
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
                          y1: Q,
                          y2: Q,
                          stroke: I,
                          strokeWidth: "1",
                          strokeDasharray: "4 4",
                          opacity: 0.7
                        }
                      )
                    ] }, `tg-${z}`);
                  }
                  if (S.value == null || !Number.isFinite(S.value)) return null;
                  const N = is(S.value, Y.min, Y.max, i, g);
                  return /* @__PURE__ */ s.jsxs("g", { children: [
                    /* @__PURE__ */ s.jsx(
                      "line",
                      {
                        x1: g.l,
                        x2: b - g.r,
                        y1: N,
                        y2: N,
                        stroke: I,
                        strokeWidth: "1.2",
                        strokeDasharray: "5 4",
                        opacity: 0.85
                      }
                    ),
                    S.label ? /* @__PURE__ */ s.jsx(
                      "text",
                      {
                        x: b - g.r - 2,
                        y: N - 4,
                        textAnchor: "end",
                        fill: I,
                        fontSize: "8",
                        fontFamily: "var(--dsc-mono)",
                        children: S.label
                      }
                    ) : null
                  ] }, `tg-${z}`);
                }),
                E.paths.map((S) => {
                  if (!S.d || S.series.length === 0) return null;
                  const z = S.last, q = z && E ? g.l + (z.t - E.t0) / Math.max(E.t1 - E.t0, 1) * (b - g.l - g.r) : 0, Y = z ? is(z.v, S.dom.min, S.dom.max, i, g) : 0, I = S.segs.length ? S.segs : [{ d: S.d, color: S.color }];
                  return /* @__PURE__ */ s.jsxs("g", { className: "dsc-chart-series", children: [
                    S.ghost ? /* @__PURE__ */ s.jsx(
                      "path",
                      {
                        d: S.d,
                        fill: "none",
                        stroke: S.color,
                        strokeWidth: 1.6,
                        strokeLinejoin: "round",
                        strokeLinecap: "round",
                        strokeDasharray: fe.dasharray,
                        strokeDashoffset: fe.dashoffset,
                        opacity: 0.55,
                        className: "dsc-chart-core"
                      }
                    ) : I.map((N, H) => /* @__PURE__ */ s.jsx(
                      "path",
                      {
                        d: N.d,
                        fill: "none",
                        stroke: N.color,
                        strokeWidth: 2.2,
                        strokeLinejoin: "round",
                        strokeLinecap: "round",
                        strokeDasharray: fe.dasharray,
                        strokeDashoffset: fe.dashoffset,
                        filter: `url(#glow-${p})`,
                        opacity: 0.95,
                        className: "dsc-chart-core"
                      },
                      `${S.id}-seg-${H}`
                    )),
                    o && z && !M ? /* @__PURE__ */ s.jsx("circle", { cx: q, cy: Y, r: 3, fill: S.color, opacity: 0.9, className: "dsc-chart-tip" }) : null,
                    S.ext.min != null ? /* @__PURE__ */ s.jsxs(
                      "text",
                      {
                        x: g.l + 2,
                        y: is(S.ext.min, S.dom.min, S.dom.max, i, g) + 8,
                        fill: S.color,
                        fontSize: "8",
                        opacity: 0.7,
                        children: [
                          "min ",
                          S.ext.min.toFixed(S.ext.min >= 100 ? 0 : 1)
                        ]
                      }
                    ) : null,
                    S.ext.max != null ? /* @__PURE__ */ s.jsxs(
                      "text",
                      {
                        x: g.l + 2,
                        y: is(S.ext.max, S.dom.min, S.dom.max, i, g) - 3,
                        fill: S.color,
                        fontSize: "8",
                        opacity: 0.7,
                        children: [
                          "max ",
                          S.ext.max.toFixed(S.ext.max >= 100 ? 0 : 1)
                        ]
                      }
                    ) : null
                  ] }, S.id);
                }),
                j ? /* @__PURE__ */ s.jsxs("g", { className: "dsc-chart-crosshair", children: [
                  /* @__PURE__ */ s.jsx(
                    "line",
                    {
                      x1: j.x,
                      x2: j.x,
                      y1: g.t,
                      y2: i - g.b,
                      stroke: "var(--dsc-white)",
                      strokeOpacity: 0.35,
                      strokeWidth: "1"
                    }
                  ),
                  te.map(
                    (S) => S.v == null || S.y == null ? null : /* @__PURE__ */ s.jsx(
                      "circle",
                      {
                        cx: S.x ?? j.x,
                        cy: S.y,
                        r: 4,
                        fill: S.color,
                        stroke: "var(--dsc-black)",
                        strokeWidth: "1"
                      },
                      S.id
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
        j && E ? /* @__PURE__ */ s.jsxs(
          "div",
          {
            className: "dsc-chart-tooltip",
            style: {
              left: `${Math.min(92, Math.max(8, j.x / b * 100))}%`
            },
            children: [
              /* @__PURE__ */ s.jsx("div", { className: "dsc-chart-tooltip-time", children: u_(j.t) }),
              te.map(
                (S) => S.v == null ? null : /* @__PURE__ */ s.jsxs("div", { className: "dsc-chart-tooltip-row", children: [
                  /* @__PURE__ */ s.jsx("i", { style: { background: S.color } }),
                  /* @__PURE__ */ s.jsxs("span", { children: [
                    S.label || S.id,
                    " ",
                    S.v.toFixed(S.v >= 100 ? 0 : 1),
                    S.unit ? ` ${S.unit}` : ""
                  ] })
                ] }, S.id)
              )
            ]
          }
        ) : null,
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chart-legend", children: [
          a.filter((S) => S.label).map((S, z) => /* @__PURE__ */ s.jsxs("span", { className: "dsc-chart-legend-item", children: [
            /* @__PURE__ */ s.jsx("i", { style: { background: S.color || $r[z % $r.length] } }),
            S.label
          ] }, S.id)),
          oe != null ? /* @__PURE__ */ s.jsxs("span", { className: "dsc-chart-last", children: [
            oe.toFixed(1),
            r ? ` ${r}` : a[0]?.unit ? ` ${a[0].unit}` : ""
          ] }) : null
        ] })
      ]
    }
  );
}
function ld(a, i = 280) {
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
    const m = (p) => {
      const b = Math.min(1, (p - h) / i), v = 1 - (1 - b) ** 3;
      o(d + (a - d) * v), b < 1 && (f = requestAnimationFrame(m));
    };
    return f = requestAnimationFrame(m), () => cancelAnimationFrame(f);
  }, [a, i]), r;
}
function Cb(a, i = 520) {
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
      const p = Math.min(1, (m - d) / i);
      o(1 - (1 - p) ** 3), p < 1 && (h = requestAnimationFrame(f));
    };
    return h = requestAnimationFrame(f), () => cancelAnimationFrame(h);
  }, [a, i]), r;
}
function Eb(a, i) {
  const r = Math.max(a, 1);
  return { dasharray: `${r}`, dashoffset: r * (1 - i) };
}
function eo(a, i, r, o) {
  return { x: a + r * Math.cos(o), y: i - r * Math.sin(o) };
}
function id(a, i, r) {
  const o = Math.min(1, Math.max(0, (a - i) / Math.max(r - i, 1e-6)));
  return Math.PI - o * Math.PI;
}
function g1(a, i, r, o, d, h, f) {
  const m = eo(d, h, f, id(a, r, o)), p = eo(d, h, f, id(i, r, o));
  return `M ${m.x.toFixed(2)} ${m.y.toFixed(2)} A ${f} ${f} 0 0 0 ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
}
const Ht = {
  track: "#243044",
  teal: "#26c6da",
  ok: "#66bb6a",
  amber: "#ffb74d",
  bad: "#ef5350",
  gray4: "#8b95a8",
  gray5: "#8b95a8",
  white: "#e8eef8"
};
function Ke({
  value: a,
  min: i = 0,
  max: r = 100,
  label: o,
  unit: d = "",
  target: h,
  band: f,
  extrema: m,
  stale: p,
  onClick: b,
  /** Progress counter — teal arc, never wears in-band green. */
  progress: v
}) {
  const g = Number.isFinite(a) ? a : NaN, y = Number.isFinite(g), j = ld(y ? g : i), T = Math.min(r, Math.max(i, y ? j : i)), C = Math.max(r - i, 1e-6), M = y ? (T - i) / C : 0, E = 46, F = 2 * Math.PI * E * 0.75, P = F * M, K = (S) => id(S, i, r), L = !v && Cd(f) ? f : void 0, G = !!(y && p), ee = v ? "muted" : mi({
    value: g,
    band: L,
    margin: mo(L, d),
    stale: G,
    available: y
  }), le = v ? "is-progress" : m1(ee), te = y && L ? g1(L.min, L.max, i, r, 60, 72, E) : "", ue = y ? v ? Ht.teal : G ? Ht.amber : ee === "critical" ? Ht.bad : ee === "warn" ? Ht.amber : L ? Ht.ok : Ht.teal : Ht.gray4, ie = `dsc-gauge-glow-${x.useId().replace(/:/g, "")}`, re = [];
  y && (L && re.push({ v: L.min, kind: "band" }, { v: L.max, kind: "band" }), m?.min != null && re.push({ v: m.min, kind: "ext" }), m?.max != null && re.push({ v: m.max, kind: "ext" }), h != null && Number.isFinite(h) && re.push({ v: h, kind: "target" }));
  const fe = y ? G ? `${g.toFixed(g >= 100 ? 0 : g < 10 ? 2 : 1)} ${d} held` : `${g.toFixed(g >= 100 ? 0 : g < 10 ? 2 : 1)} ${d}` : "No data", oe = /* @__PURE__ */ s.jsxs(
    "div",
    {
      className: `dsc-gauge ${le}${G ? " is-stale" : ""}${b ? " is-clickable" : ""}`,
      role: "img",
      "aria-label": o,
      "aria-valuetext": fe,
      children: [
        /* @__PURE__ */ s.jsxs("svg", { viewBox: "0 0 120 90", width: "140", height: "105", "aria-hidden": "true", children: [
          /* @__PURE__ */ s.jsx("defs", { children: /* @__PURE__ */ s.jsxs("filter", { id: ie, x: "-40%", y: "-40%", width: "180%", height: "180%", children: [
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
              stroke: Ht.track,
              strokeWidth: "10",
              strokeLinecap: "butt"
            }
          ),
          te ? /* @__PURE__ */ s.jsx(
            "path",
            {
              d: te,
              fill: "none",
              stroke: Ht.ok,
              strokeWidth: "10",
              strokeLinecap: "butt",
              opacity: 0.38,
              children: /* @__PURE__ */ s.jsx("title", { children: "In-band range" })
            }
          ) : null,
          y ? /* @__PURE__ */ s.jsx(
            "path",
            {
              className: "dsc-gauge-value",
              d: "M18 72 A46 46 0 1 1 102 72",
              fill: "none",
              stroke: ue,
              strokeWidth: "10",
              strokeLinecap: "round",
              strokeDasharray: `${P} ${F}`,
              filter: `url(#${ie})`,
              style: { transition: "stroke-dasharray 280ms ease, stroke 280ms ease" }
            }
          ) : null,
          re.map((S, z) => {
            const q = K(S.v), Y = eo(60, 72, S.kind === "ext" ? E - 2 : E + 1, q), I = eo(60, 72, E - (S.kind === "target" ? 14 : 10), q), N = S.kind === "target" ? Ht.teal : S.kind === "band" ? Ht.amber : Ht.gray5, H = S.kind === "target" ? "Target" : S.kind === "band" ? "Want edge" : "Session extreme";
            return /* @__PURE__ */ s.jsx(
              "line",
              {
                x1: I.x,
                y1: I.y,
                x2: Y.x,
                y2: Y.y,
                stroke: N,
                strokeWidth: S.kind === "target" ? 2.4 : 1.6,
                strokeLinecap: "round",
                opacity: S.kind === "ext" ? 0.65 : 0.95,
                children: /* @__PURE__ */ s.jsx("title", { children: H })
              },
              `${S.kind}-${z}`
            );
          }),
          /* @__PURE__ */ s.jsx(
            "text",
            {
              x: "60",
              y: "58",
              textAnchor: "middle",
              fill: Ht.white,
              fontSize: "20",
              fontWeight: "700",
              fontFamily: "var(--dsc-mono)",
              children: Number.isFinite(g) ? g.toFixed(g >= 100 ? 0 : g < 10 ? 2 : 1) : "—"
            }
          ),
          /* @__PURE__ */ s.jsx("text", { x: "60", y: "74", textAnchor: "middle", fill: G ? Ht.amber : Ht.gray5, fontSize: "10", children: G ? "HELD" : y ? d : "no data" })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-gauge-label", children: o })
      ]
    }
  );
  return b ? /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-gauge-hit", onClick: b, title: `History · ${o}`, children: oe }) : oe;
}
function Tb({
  series: a,
  color: i = "var(--dsc-teal)",
  width: r = 120,
  height: o = 28
}) {
  const d = a.length ? `${a[0].t}-${a[a.length - 1].t}-${a.length}` : "empty", h = Cb(d, 420);
  if (a.length < 2)
    return /* @__PURE__ */ s.jsx("div", { className: "dsc-sparkline dsc-muted", style: { width: r, height: o } });
  const f = a.map((C) => C.v), m = Math.min(...f), p = Math.max(...f), b = Math.max(p - m, 1e-6), v = a[0].t, g = a[a.length - 1].t, y = Math.max(g - v, 1), j = a.map((C, M) => {
    const E = (C.t - v) / y * r, F = o - (C.v - m) / b * (o - 4) - 2;
    return `${M === 0 ? "M" : "L"}${E.toFixed(1)} ${F.toFixed(1)}`;
  }).join(" "), k = r * 1.25, T = Eb(k, h);
  return /* @__PURE__ */ s.jsx("svg", { className: "dsc-sparkline", width: r, height: o, "aria-hidden": !0, children: /* @__PURE__ */ s.jsx(
    "path",
    {
      d: j,
      fill: "none",
      stroke: i,
      strokeWidth: "1.6",
      strokeLinecap: "round",
      strokeDasharray: T.dasharray,
      strokeDashoffset: T.dashoffset
    }
  ) });
}
function v1({
  row: a
}) {
  const i = a.want != null ? a.want : a.wantMin != null && a.wantMax != null && a.wantMax > a.wantMin ? (a.wantMin + a.wantMax) / 2 : NaN, r = !Number.isFinite(a.got), o = !!(!r && a.stale), d = a.wantMin != null && a.wantMax != null && Number.isFinite(a.wantMin) && Number.isFinite(a.wantMax) && a.wantMax > a.wantMin ? { min: a.wantMin, max: a.wantMax } : void 0, h = mi({
    value: a.got,
    band: d,
    margin: mo(d, a.unit),
    stale: o,
    available: !r
  }), f = Math.max(
    r ? 0 : a.got,
    Number.isFinite(i) ? i : 0,
    a.wantMax ?? 0,
    1
  ), m = r ? 0 : a.got / f * 100, p = Number.isFinite(i) ? i / f * 100 : 0, b = ld(m), v = ld(p);
  return /* @__PURE__ */ s.jsxs("div", { className: `dsc-gotwant-row${o ? " is-stale" : r ? " is-muted" : ""}`, children: [
    /* @__PURE__ */ s.jsx("div", { className: "dsc-gotwant-label", children: a.label }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-gotwant-track", children: [
      Number.isFinite(i) ? /* @__PURE__ */ s.jsx("div", { className: "dsc-gotwant-want", style: { width: `${v}%` } }) : null,
      r ? null : /* @__PURE__ */ s.jsx(
        "div",
        {
          className: "dsc-gotwant-got",
          style: { width: `${b}%`, background: Ed(h) }
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
function Mb({
  rows: a
}) {
  return /* @__PURE__ */ s.jsx("div", { className: "dsc-gotwant", children: a.map((i) => /* @__PURE__ */ s.jsx(v1, { row: i }, i.label)) });
}
function Rn(a) {
  if (!a.length) return {};
  let i = a[0].v, r = a[0].v;
  for (const o of a)
    o.v < i && (i = o.v), o.v > r && (r = o.v);
  return { min: i, max: r };
}
function x1(a) {
  if (a == null) return !0;
  const i = String(a).toLowerCase();
  return i === "" || i === "unavailable" || i === "unknown" || i === "none";
}
function Rb(a) {
  if (x1(a)) return null;
  if (typeof a == "number") return Number.isFinite(a) ? a : null;
  const i = String(a).toLowerCase();
  if (i === "on" || i === "true" || i === "open") return 1;
  if (i === "off" || i === "false" || i === "closed") return 0;
  const r = Number(a);
  return Number.isFinite(r) ? r : null;
}
function y1(a) {
  if (typeof a.lu == "number" && Number.isFinite(a.lu))
    return a.lu * 1e3;
  const i = a.last_changed || a.last_updated;
  if (i) {
    const r = Date.parse(i);
    return Number.isFinite(r) ? r : null;
  }
  return null;
}
function w1(a) {
  return Rb(a.s ?? a.state);
}
function h_(a, i) {
  if (a.length <= i) return a;
  const r = [], o = (a.length - 1) / (i - 1);
  for (let d = 0; d < i; d++)
    r.push(a[Math.round(d * o)]);
  return r;
}
function Td(a, i = 6, r = 96) {
  const { hass: o, callWS: d } = hi(), h = sa(), f = !!(o && (o.callWS || o.connection)), [m, p] = x.useState([]), [b, v] = x.useState(!0), [g, y] = x.useState(null);
  return x.useEffect(() => {
    let j = !1;
    async function k() {
      v(!0), y(null);
      try {
        const C = await x0(a, i);
        if (j) return;
        const M = C.filter((E) => Number.isFinite(E.t) && Number.isFinite(E.v));
        M.sort((E, F) => E.t - F.t), p(h_(M, r));
      } catch (C) {
        j || (y(C instanceof Error ? C.message : "history unavailable"), p([]));
      } finally {
        j || v(!1);
      }
    }
    async function T() {
      if (!a) {
        p([]), v(!1);
        return;
      }
      if (!f) {
        p([]), v(!1);
        return;
      }
      v(!0), y(null);
      const C = /* @__PURE__ */ new Date(), M = new Date(C.getTime() - i * 3600 * 1e3);
      try {
        const E = await d({
          type: "history/history_during_period",
          start_time: M.toISOString(),
          end_time: C.toISOString(),
          significant_changes_only: !1,
          minimal_response: !0,
          no_attributes: !0,
          entity_ids: [a]
        });
        if (j) return;
        if (E == null) {
          p([]), y("history unavailable");
          return;
        }
        let F = [];
        Array.isArray(E) ? F = E[0] || [] : E && typeof E == "object" && (F = E[a] || []);
        const P = [];
        for (const K of F) {
          const L = y1(K), G = w1(K);
          L == null || G == null || P.push({ t: L, v: G });
        }
        P.sort((K, L) => K.t - L.t), p(h_(P, r));
      } catch (E) {
        j || (y(E instanceof Error ? E.message : "history unavailable"), p([]));
      } finally {
        j || v(!1);
      }
    }
    return h === "pi" ? k() : T(), () => {
      j = !0;
    };
  }, [h, f, a, i, r, d]), { points: m, loading: b, error: g };
}
function j1(a) {
  return a <= 18 ? a * 2 : Math.min(a + 24, 48);
}
function S1(a, i) {
  const r = i * 3600 * 1e3, o = Date.now() - r;
  return a.filter((d) => d.t < o && Number.isFinite(d.v)).map((d) => ({ t: d.t + r, v: d.v }));
}
function je(a, i) {
  const r = i?.maxPoints ?? 96, o = i?.hours ?? 6, d = !!i?.withGhost, h = d ? j1(o) : o, f = d ? Math.min(Math.max(r * 2, r), 288) : r, { num: m, available: p, tick: b, state: v } = Te(), g = xt(), y = sa(), j = g0(), { points: k } = Td(a, h, f), [T, C] = x.useState([]), M = x.useRef(null), E = x.useRef(!1);
  x.useEffect(() => {
    E.current = !1, C([]), M.current = null;
  }, [a, o, r, h, d]), x.useEffect(() => {
    if (k.length && !E.current) {
      E.current = !0;
      const G = k[k.length - 1]?.v;
      Number.isFinite(G) && (M.current = G);
    }
  }, [k]), x.useEffect(() => {
    const G = y === "pi" ? gd(a, g) : p(a);
    if (!a || !G) return;
    const ee = y === "pi" ? Pr(a, g) : null, le = m(a), te = ee != null && Number.isFinite(ee) ? ee : Number.isFinite(le) ? le : Rb(v(a, ""));
    if (te == null || !Number.isFinite(te)) return;
    if (M.current === te && T.length > 0) {
      const ie = Date.now(), re = T[T.length - 1]?.t ?? 0;
      if (ie - re < 4e3) return;
    }
    M.current = te;
    const ue = Date.now();
    C((ie) => [...ie, { t: ue, v: te }].slice(-r));
  }, [a, b, j, y, g, p, m, v, r]);
  const F = d ? Math.max(f, r * 2) : r * 2, { series: P, ghost: K, lastSyncAt: L } = x.useMemo(() => {
    const G = k.length ? k[k.length - 1].t : 0, ee = T.filter((S) => S.t > G + 250), le = k.length ? [...k, ...ee] : ee, te = le.length ? le[le.length - 1].t : void 0, ue = te != null && Date.now() - te > 300 * 1e3, ie = Nb(le, Date.now(), { markStale: ue }), re = ie.length > F ? ie.slice(-F) : ie;
    if (!d) return { series: re, ghost: [], lastSyncAt: te };
    const fe = o * 3600 * 1e3, oe = Date.now() - fe;
    return {
      series: re.filter((S) => S.t >= oe),
      ghost: S1(re, o),
      lastSyncAt: te
    };
  }, [k, T, F, d, o]);
  return { series: P, lastSyncAt: L, ghost: K };
}
const k1 = [1, 6, 24, 48], Ab = "dsc_chart_hours";
function N1() {
  try {
    const a = sessionStorage.getItem(Ab), i = Number(a);
    if (Number.isFinite(i) && i > 0 && i <= 48) return i;
  } catch {
  }
  return 6;
}
function ll(a = 6) {
  const [i, r] = x.useState(() => N1() || a), o = x.useCallback((h) => {
    r(h);
    try {
      sessionStorage.setItem(Ab, String(h));
    } catch {
    }
  }, []), d = i <= 1 ? 60 : i <= 6 ? 96 : i <= 24 ? 144 : 192;
  return { hours: i, setHours: o, maxPoints: d };
}
const zb = "dsc-hub-snooze:";
function Ku(a) {
  try {
    const i = localStorage.getItem(zb + a);
    if (!i) return {};
    const r = JSON.parse(i);
    return !r || typeof r != "object" ? {} : r;
  } catch {
    return {};
  }
}
function f_(a, i) {
  try {
    localStorage.setItem(zb + a, JSON.stringify(i));
  } catch {
  }
}
function po() {
  const { entity: a, tick: i } = Te(), r = a("sensor.dsc_hub_uptime")?.last_changed || "noboot", o = x.useMemo(() => Ku(r), [r, i]), d = x.useCallback((m) => !!o[m], [o]), h = x.useCallback(
    (m) => {
      if (!m) return;
      const p = { ...Ku(r), [m]: !0 };
      f_(r, p);
    },
    [r]
  ), f = x.useCallback(
    (m) => {
      const p = { ...Ku(r) };
      delete p[m], f_(r, p);
    },
    [r]
  );
  return { bootKey: r, isSnoozed: d, snooze: h, unsnooze: f };
}
const il = [
  { label: "Cycle", hours: 12 },
  { label: "Photo", hours: 18 }
];
function rl({
  hours: a,
  setHours: i,
  extras: r
}) {
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-timespan", role: "group", "aria-label": "Chart timespan", children: [
    k1.map((o) => /* @__PURE__ */ s.jsxs(
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
function C1({
  open: a,
  onClose: i,
  entityId: r,
  label: o,
  unit: d = "",
  color: h = "var(--dsc-blue)"
}) {
  const { hours: f, setHours: m, maxPoints: p } = ll(6), b = je(r || "", { hours: f, maxPoints: p }), v = f <= 18 ? f * 2 : Math.min(f + 24, 48), g = je(r || "", { hours: v, maxPoints: p }), y = x.useMemo(() => {
    const k = f * 3600 * 1e3, T = Date.now() - k;
    return g.series.filter((C) => C.t < T).map((C) => ({ t: C.t + k, v: C.v }));
  }, [g.series, f]), j = !r || b.series.length < 2;
  return /* @__PURE__ */ s.jsxs(
    us,
    {
      open: a && !!r,
      onClose: i,
      title: o ? `History · ${o}` : "History",
      children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: [
          /* @__PURE__ */ s.jsx(rl, { hours: f, setHours: m, extras: il }),
          j ? /* @__PURE__ */ s.jsx(O, { label: "Thin recorder", tone: "warn" }) : null,
          y.length > 1 ? /* @__PURE__ */ s.jsx(O, { label: "Prior window ghost", tone: "muted" }) : null
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
              ...y.length > 1 ? [
                {
                  id: `${r}-ghost`,
                  label: `${o} prior`,
                  series: y,
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
function to({
  entityId: a,
  hours: i = 24,
  onClick: r,
  label: o = "24h on/off"
}) {
  const { state: d, entity: h } = Te(), { points: f, loading: m } = Td(a, i, 720), p = d(a, "off") === "on" ? 1 : 0, b = Date.now(), v = b - i * 3600 * 1e3, g = x.useMemo(() => {
    const E = f.filter((F) => Number.isFinite(F.v));
    return (d(a, "") === "on" || d(a, "") === "off") && E.push({ t: b, v: p }), Nb(E, b);
  }, [f, b, p, d, a]), y = x.useMemo(() => {
    const E = [];
    let F = null;
    for (let P = 0; P < g.length; P++) {
      const K = g[P], L = K.v >= 0.5;
      L && F == null && (F = Math.max(K.t, v)), !L && F != null && (E.push({ start: F, end: K.t }), F = null);
    }
    return F != null && E.push({ start: F, end: b }), E.filter((P) => P.end > v && P.end > P.start);
  }, [g, b, v]), j = y.reduce((E, F) => E + (F.end - F.start), 0), k = y.length ? y[y.length - 1].start : null, T = h(a)?.last_changed, C = k ? new Date(k).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : T ? new Date(T).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—", M = /* @__PURE__ */ s.jsxs("div", { className: "dsc-duty-strip", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-duty-meta", children: [
      /* @__PURE__ */ s.jsx("span", { children: o }),
      /* @__PURE__ */ s.jsxs("span", { className: "dsc-muted", children: [
        y.length,
        " cycle",
        y.length === 1 ? "" : "s",
        " · last ",
        C,
        " ·",
        " ",
        m ? "…" : `${(j / 36e5).toFixed(1)}h on`
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("svg", { viewBox: `0 0 ${i} 18`, className: "dsc-duty-svg", preserveAspectRatio: "none", "aria-hidden": !0, children: [
      /* @__PURE__ */ s.jsx("rect", { x: "0", y: "5", width: i, height: "8", rx: "2", fill: "var(--dsc-gray-3)" }),
      y.map((E) => {
        const F = Math.max(0, (E.start - v) / 36e5), P = Math.max(0.04, (E.end - E.start) / 36e5);
        return /* @__PURE__ */ s.jsx("rect", { x: F, y: "5", width: P, height: "8", rx: "1.5", fill: "var(--dsc-teal)" }, E.start);
      })
    ] })
  ] });
  return r ? /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-duty-hit", onClick: r, title: `History · ${o}`, children: M }) : M;
}
const E1 = {
  title: "Fleet version",
  what: "A device is missing firmware or running a different version than expected. Devices deliberately out of service (AC, clone mister, pot 3) are not counted here.",
  fix: "Open Fleet and update the outdated device. If the device is not built yet, leave it out of service — that is not a failure."
}, T1 = {
  title: "Out of service",
  what: "This device is not running. It may be deliberately out of service (not built yet), temporarily paused, or locked out by an operator.",
  fix: "If the device is built and should run, switch it back in service from Fleet. If it was paused temporarily, clear that once the pause is over. Unbuilt devices stay out of service — not an alarm."
}, M1 = {
  title: "Hub link",
  what: "The hub is not responding. The display holds the last good readings instead of showing made-up values.",
  fix: "Check hub power, the Wi-Fi channel, and firmware on Fleet. Brief dropouts recover on their own within about half a minute."
}, R1 = {
  title: "Panel link",
  what: "The control panel has lost its direct radio link. A limited fallback link may still be working — slower, but not offline.",
  fix: "Check the panel's firmware and link age on Fleet. If its Wi-Fi signal is still reporting, the panel is on the fallback link, not offline."
}, A1 = {
  title: "Heartbeat",
  what: "The hub's regular liveness pulse has stopped arriving. This is separate from the climate readings.",
  fix: "If the hub link is also down, fix the hub first. If the link is up but the heartbeat is missing, restart the hub."
}, z1 = {
  title: "Device",
  what: "This shows the device's real state: running, idle, deliberately out of service, not set up yet, or offline after a short grace period.",
  fix: "Out of service: leave it if the device is not built. Offline: give it a moment, then check Fleet. Not set up: the device has not been added yet."
}, no = {
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
function Ur(a) {
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
Object.assign(no, Ur(1), Ur(2), Ur(3), Ur(4));
function D1(a) {
  return a.includes("dark") || a.includes("light") || a.includes("photo") || a.includes("catchup") ? { href: "/live/light", cta: "Open Light" } : a.includes("root") || a.includes("pot") || a.includes("grow_mat") || a.includes("tank_") ? { href: "/live/root", cta: "Open Root" } : a.includes("climate") || a.includes("humidifier") || a.includes("heater") || a.includes("vent") || a.includes("coherence") || a.includes("plant_specs") ? { href: "/live/climate", cta: "Open Climate" } : a.includes("failsafe") || a.includes("emergency") ? { href: "/live/mission", cta: "Mission" } : a.includes("reduced_kit") || a.includes("nest_channel") ? { href: "/fleet", cta: "Open Fleet" } : { href: "/live/overview", cta: "Overview" };
}
function Db(a, i) {
  return no[a] ? no[a] : i === "fleet" || a === "sensor.dsc_fleet_version_status" ? E1 : i === "kit" ? z1 : a.includes("in_service") || a.endsWith("_oos") ? T1 : a.includes("hub_link") || a.includes("hub_uptime") ? M1 : a.includes("panel_link") || a.includes("control_wifi") ? R1 : a.includes("heartbeat") ? A1 : {
    title: a.split(".").pop()?.replace(/_/g, " ") || "Reading",
    what: "A live reading recorded by the hub. Use the timespan buttons here to explore its history.",
    fix: "If the number looks wrong, check the sensor or its target. If it shows no value, nothing was measured — it is not a zero."
  };
}
const Ob = Object.keys(no);
function Ua(a) {
  if (!Number.isFinite(a) || a < 0) return "—";
  const i = Math.floor(a / 1e3);
  if (i < 60) return `${Math.max(1, i)}S`;
  const r = Math.floor(i / 60);
  if (r < 60) return `${r}M`;
  const o = Math.floor(r / 60), d = r % 60;
  return o < 48 ? d > 0 ? `${o}H ${d}M` : `${o}H` : `${(o / 24).toFixed(1)}D`;
}
function O1(a, i, r) {
  if (i === "binary" || i === "alert" || a.startsWith("binary_sensor.") || a.startsWith("switch.") || a.startsWith("light."))
    return !0;
  const o = (r || "").toLowerCase();
  return o === "on" || o === "off";
}
function H1({
  target: a,
  onClose: i
}) {
  const { state: r, num: o, available: d, entity: h } = Te(), { callService: f } = $t(), { hours: m, setHours: p, maxPoints: b } = ll(6), { isSnoozed: v, snooze: g, unsnooze: y } = po(), [j, k] = x.useState(!1), T = a?.entityId ?? "", C = T ? r(T, "") : "", M = a ? O1(T, a.kind, C) : !1, E = je(T, { hours: M ? 24 : m, maxPoints: M ? 288 : b }), F = m <= 18 ? m * 2 : Math.min(m + 24, 48), P = je(T, { hours: F, maxPoints: b }), K = x.useMemo(() => {
    const z = m * 3600 * 1e3, q = Date.now() - z;
    return P.series.filter((Y) => Y.t < q).map((Y) => ({ t: Y.t + z, v: Y.v }));
  }, [P.series, m]);
  if (!a) return null;
  const L = Db(a.entityId, a.kind), G = h(a.entityId), ee = G?.last_changed ? Date.parse(G.last_changed) : NaN, le = Number.isFinite(ee) ? Ua(Date.now() - ee) + " ago" : "—", te = E.series.length < 2, ue = v(a.entityId), ie = a.runtimeToday ? o(a.runtimeToday) : NaN, re = a.cyclesToday ? o(a.cyclesToday) : NaN, fe = a.demandEntity, oe = a.entityId.split(".")[0], S = oe === "switch" || oe === "light" || oe === "input_boolean";
  return /* @__PURE__ */ s.jsxs(us, { open: !!a.entityId, onClose: i, title: a.label, children: [
    d(a.entityId) ? null : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "No data — this reading is not reporting right now." }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ s.jsx(O, { label: `Last ${le}`, tone: "muted" }),
      Number.isFinite(ie) ? /* @__PURE__ */ s.jsx(O, { label: `Today ${ie.toFixed(2)}h`, tone: "ok" }) : null,
      Number.isFinite(re) ? /* @__PURE__ */ s.jsx(O, { label: `${Math.round(re)} cycles`, tone: "muted" }) : null,
      /* @__PURE__ */ s.jsx(
        O,
        {
          label: C && C !== "—" ? String(C) : "no state",
          tone: C === "on" ? "ok" : C === "off" ? "muted" : "warn"
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-inspector-playbook", children: [
      /* @__PURE__ */ s.jsx("strong", { children: L.title }),
      /* @__PURE__ */ s.jsx("p", { children: L.what }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: L.fix })
    ] }),
    a.kind === "alert" || a.entityId.startsWith("binary_sensor.") ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { margin: "10px 0" }, children: [
      ue ? /* @__PURE__ */ s.jsx(ae, { onClick: () => y(a.entityId), children: "Unsnooze" }) : /* @__PURE__ */ s.jsx(ae, { onClick: () => g(a.entityId), children: "Acknowledge until hub reboot" }),
      ue ? /* @__PURE__ */ s.jsx(O, { label: "Snoozed this boot", tone: "warn" }) : null
    ] }) : null,
    S ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 10 }, children: [
      /* @__PURE__ */ s.jsx(ae, { primary: !0, onClick: () => k(!0), children: C === "on" ? "Turn off" : "Turn on" }),
      /* @__PURE__ */ s.jsx(
        Je,
        {
          open: j,
          onDismiss: () => k(!1),
          onConfirm: () => {
            k(!1), f(oe, C === "on" ? "turn_off" : "turn_on", {
              entity_id: a.entityId
            });
          },
          title: C === "on" ? `Turn off ${a.label}` : `Turn on ${a.label}`,
          confirmLabel: C === "on" ? "Turn off" : "Turn on",
          help: null,
          children: /* @__PURE__ */ s.jsxs("p", { children: [
            "This writes ",
            a.entityId,
            " on the hub immediately."
          ] })
        }
      )
    ] }) : null,
    M || fe ? /* @__PURE__ */ s.jsx(to, { entityId: fe || a.entityId, hours: 24 }) : null,
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { margin: "12px 0" }, children: [
      /* @__PURE__ */ s.jsx(rl, { hours: m, setHours: p, extras: il }),
      te ? /* @__PURE__ */ s.jsx(O, { label: "Limited history", tone: "warn" }) : null,
      K.length > 1 ? /* @__PURE__ */ s.jsx(O, { label: "Previous period (faded)", tone: "muted" }) : null
    ] }),
    /* @__PURE__ */ s.jsx(
      jn,
      {
        live: !0,
        unit: M ? "" : a.unit || "",
        lastSyncAt: E.lastSyncAt,
        yDomain: M ? { left: { min: 0, max: 1 } } : void 0,
        emptyLabel: "no history yet",
        series: [
          {
            id: a.entityId,
            label: a.label,
            series: E.series,
            color: a.color || "var(--dsc-teal)",
            unit: M ? "" : a.unit,
            step: M
          },
          ...K.length > 1 ? [
            {
              id: `${a.entityId}-ghost`,
              label: `${a.label} prior`,
              series: K,
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
const Hb = x.createContext(null);
function L1({ children: a }) {
  const [i, r] = x.useState(null), o = x.useCallback(() => r(null), []), d = x.useCallback((f) => r(f), []), h = x.useMemo(() => ({ open: d, close: o }), [d, o]);
  return /* @__PURE__ */ s.jsxs(Hb.Provider, { value: h, children: [
    a,
    /* @__PURE__ */ s.jsx(H1, { target: i, onClose: o })
  ] });
}
function Dn() {
  const a = x.useContext(Hb);
  return a || {
    open: () => {
    },
    close: () => {
    }
  };
}
const $1 = {
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
function nt({
  entityId: a,
  label: i,
  step: r,
  tone: o,
  hint: d,
  onLive: h
}) {
  const { state: f, available: m, attributes: p } = nl(a), { callService: b } = $t(), v = m, g = Number(f), y = Number(p?.min ?? 0), j = Number(p?.max ?? 100), k = r ?? Number(p?.step ?? 0.1), [T, C] = x.useState(String(Number.isFinite(g) ? g : "")), M = x.useRef(!1);
  x.useEffect(() => {
    !M.current && Number.isFinite(g) && C(String(g));
  }, [g]);
  const E = () => {
    if (!v) return;
    const P = Number(T);
    if (!Number.isFinite(P)) {
      C(String(Number.isFinite(g) ? g : ""));
      return;
    }
    const K = Math.min(j, Math.max(y, P)), G = a.split(".")[0] === "input_number" ? "input_number" : "number";
    b(G, "set_value", { entity_id: a, value: K }), C(String(K));
  }, F = o === "critical" ? "is-bad" : o === "warn" ? "is-warn" : o === "muted" ? "is-muted" : "";
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-target-num${v ? "" : " is-disabled"} ${F}`.trim(), children: [
    /* @__PURE__ */ s.jsx("span", { className: "dsc-target-num-label", children: i }),
    /* @__PURE__ */ s.jsx(
      "input",
      {
        type: "number",
        value: T,
        disabled: !v,
        min: y,
        max: j,
        step: k,
        onFocus: () => {
          M.current = !0;
        },
        onChange: (P) => {
          C(P.target.value);
          const K = Number(P.target.value);
          Number.isFinite(K) && h?.(K);
        },
        onBlur: () => {
          M.current = !1, E();
        },
        onKeyDown: (P) => {
          P.key === "Enter" && P.target.blur();
        }
      }
    ),
    d ? /* @__PURE__ */ s.jsx("span", { className: "dsc-target-hint", children: d }) : null
  ] });
}
function Ju({ tent: a, title: i, hero: r }) {
  const { num: o, state: d, entity: h } = Te(), f = Dn(), m = $1[a], p = sd(a, { state: d, entity: h }), b = ge(m.gotTemp), v = ge(m.gotRh), g = ge(m.gotVpd), y = b.stale ? NaN : b.value, j = v.stale ? NaN : v.value, k = g.stale ? NaN : g.value, T = o(m.temp), C = o(m.rhMin), M = o(m.rhMax), [E, F] = x.useState(T), [P, K] = x.useState(C), [L, G] = x.useState(M), [ee, le] = x.useState(o(m.vpdMin)), [te, ue] = x.useState(o(m.vpdMax)), ie = Da(E, p.temp), re = Da(P, p.rh, P > L), fe = Da(L, p.rh, P > L), oe = Da(ee, p.vpd, ee > te), S = Da(te, p.vpd, ee > te), z = (q, Y, I) => {
    f.open({ entityId: q, label: Y, unit: I });
  };
  return /* @__PURE__ */ s.jsxs("div", { className: `dsc-tent-targets${r ? " is-hero" : ""}`, children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-tent-targets-head", children: [
      /* @__PURE__ */ s.jsx("strong", { children: i }),
      p.mixed ? /* @__PURE__ */ s.jsx(O, { label: "mixed stages", tone: "warn" }) : null,
      p.emptyLabel ? /* @__PURE__ */ s.jsx(O, { label: p.emptyLabel, tone: "muted" }) : null,
      p.stages.map((q) => /* @__PURE__ */ s.jsx(O, { label: q, tone: "muted" }, q)),
      /* @__PURE__ */ s.jsx(
        uo,
        {
          label: `${i} more`,
          items: [
            { id: "temp", label: "Inspector · temp", onSelect: () => z(m.temp, `${i} Want T`, "°C") },
            { id: "rh", label: "Inspector · RH", onSelect: () => z(m.rhMin, `${i} RH min`, "%") },
            { id: "vpd", label: "Inspector · VPD", onSelect: () => z(m.vpdMin, `${i} VPD min`, "kPa") }
          ]
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs(
      "button",
      {
        type: "button",
        className: "dsc-got-want dsc-got-want-hit",
        onClick: () => z(m.gotTemp, `${i} Got T`, "°C"),
        children: [
          /* @__PURE__ */ s.jsxs("span", { children: [
            "Got ",
            Number.isFinite(y) ? `${y.toFixed(1)}°C` : "—",
            " /",
            " ",
            Number.isFinite(j) ? `${j.toFixed(0)}%` : "—",
            Number.isFinite(k) ? ` / ${k.toFixed(2)} kPa` : ""
          ] }),
          /* @__PURE__ */ s.jsxs("span", { className: "dsc-muted", children: [
            "Want ",
            Number.isFinite(T) ? T.toFixed(1) : "—",
            "°C · RH",
            " ",
            Number.isFinite(C) ? C.toFixed(0) : "—",
            "–",
            Number.isFinite(M) ? M.toFixed(0) : "—",
            "%"
          ] })
        ]
      }
    ),
    p.needs.length ? /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: p.needs.map((q) => /* @__PURE__ */ s.jsx(O, { label: `Need ${q}`, tone: "warn" }, q)) }) : null,
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
      /* @__PURE__ */ s.jsx(nt, { entityId: m.temp, label: "Temp °C", step: 0.5, tone: ie.tone, hint: ie.label, onLive: F }),
      /* @__PURE__ */ s.jsx(nt, { entityId: m.rhMin, label: "RH min %", step: 1, tone: re.tone, hint: re.label, onLive: K }),
      /* @__PURE__ */ s.jsx(nt, { entityId: m.rhMax, label: "RH max %", step: 1, tone: fe.tone, hint: fe.label, onLive: G }),
      /* @__PURE__ */ s.jsx(nt, { entityId: m.vpdMin, label: "VPD min", step: 0.01, tone: oe.tone, hint: oe.label, onLive: le }),
      /* @__PURE__ */ s.jsx(nt, { entityId: m.vpdMax, label: "VPD max", step: 0.01, tone: S.tone, hint: S.label, onLive: ue })
    ] })
  ] });
}
function Lb({
  compact: a,
  emphasize: i,
  only: r,
  hero: o
}) {
  const d = r ? [r] : i === "clone" ? ["clone", "main"] : ["main", "clone"];
  return o && !r ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-heroes", children: [
    /* @__PURE__ */ s.jsx(Ju, { tent: "clone", title: "2×4 climate", hero: !0 }),
    /* @__PURE__ */ s.jsx(Ju, { tent: "main", title: "4×8 climate", hero: !0 })
  ] }) : /* @__PURE__ */ s.jsx("div", { className: `dsc-target-panel${a ? " is-compact" : ""}`, children: d.map((h) => /* @__PURE__ */ s.jsx(Ju, { tent: h, title: h === "main" ? "4×8 climate" : "2×4 climate", hero: o }, h)) });
}
const m_ = [1, 2, 3, 4, 5, 6, 7, 8];
function U1() {
  const { available: a, entity: i, num: r, state: o } = Te(), { callService: d } = $t(), [h, f] = x.useState(null), [m, p] = x.useState(null), [b, v] = x.useState(null), [g, y] = x.useState(null), j = o("input_text.dsc_build_strain", ""), k = o("input_text.dsc_build_nickname", ""), T = o("input_select.dsc_build_assign_pot", "none"), C = o("input_select.dsc_build_tent", "4x8"), M = o("sensor.dsc_build_expected_stage", ""), E = o("sensor.dsc_build_days_since_sprout", ""), F = r("input_number.dsc_blend_total_l", 20), P = o("input_select.dsc_light_fixture", ""), K = o("input_select.dsc_build_vessel", ""), L = ad(K || void 0, F), G = r("input_number.dsc_mix_tank_liters", 20), ee = r("input_number.dsc_mix_strength_pct", 100), le = (Number.isFinite(ee) ? ee : 100) / 100, te = Number.isFinite(G) && G > 0 ? G : 20, ue = (z, q) => {
    if (z === "strain")
      v(q), d("input_text", "set_value", { entity_id: "input_text.dsc_build_strain", value: q.name });
    else if (z === "medium") {
      const Y = q.composition && typeof q.composition == "object" ? Object.entries(q.composition).filter(([, I]) => Number.isFinite(Number(I)) && Number(I) > 0).slice(0, 3) : [];
      if (Y.length)
        for (let I = 1; I <= 3; I++) {
          const N = Y[I - 1];
          d("input_text", "set_value", {
            entity_id: `input_text.dsc_blend_component_${I}_name`,
            value: N ? String(N[0]) : ""
          }), d("input_number", "set_value", {
            entity_id: `input_number.dsc_blend_pct_${I}`,
            value: N ? Number(N[1]) : 0
          });
        }
      else
        d("input_text", "set_value", {
          entity_id: "input_text.dsc_blend_component_1_name",
          value: q.name
        });
    } else if (z === "nutrient")
      for (const Y of m_) {
        const I = o(`input_text.dsc_nutrient_${Y}_name`, ""), N = o(`input_boolean.dsc_nutrient_${Y}_in_inventory`) === "on";
        if (!I || I === "unknown" || !N) {
          d("input_text", "set_value", {
            entity_id: `input_text.dsc_nutrient_${Y}_name`,
            value: q.name
          }), q.dose_ml_l != null && Number.isFinite(Number(q.dose_ml_l)) && d("input_number", "set_value", {
            entity_id: `input_number.dsc_nutrient_${Y}_dose_ml_l`,
            value: Number(q.dose_ml_l)
          }), d("input_boolean", "turn_on", { entity_id: `input_boolean.dsc_nutrient_${Y}_in_inventory` });
          break;
        }
      }
    else if (z === "light") {
      y(q);
      const I = (i("input_select.dsc_light_fixture")?.attributes?.options || []).find((N) => N.toLowerCase().includes(String(q.name || "").toLowerCase().slice(0, 18)));
      I ? d("input_select", "select_option", { entity_id: "input_select.dsc_light_fixture", option: I }) : d("input_text", "set_value", { entity_id: "input_text.dsc_light_custom_name", value: q.name });
    }
    f(null);
  }, ie = (z) => {
    const q = Number(z);
    if (!Number.isFinite(q) || z === "none") return;
    const Y = hb(q);
    a(Y) && d("input_select", "select_option", { entity_id: Y, option: L.id });
  }, re = () => {
    d("script", "turn_on", { entity_id: "script.dsc_build_plant_commit" });
  }, fe = () => {
    if (ie(T), a("script.dsc_build_plant_commit_and_assign")) {
      d("script", "turn_on", { entity_id: "script.dsc_build_plant_commit_and_assign" });
      return;
    }
    d("script", "turn_on", { entity_id: "script.dsc_build_plant_commit" }), d("script", "turn_on", {
      entity_id: "script.dsc_plant_assign_to_pot",
      pot: T,
      variables: { pot: T }
    });
  }, oe = m_.map((z) => {
    const q = o(`input_text.dsc_nutrient_${z}_name`, ""), Y = r(`input_number.dsc_nutrient_${z}_dose_ml_l`, 0), I = r(`input_number.dsc_nutrient_${z}_stock_ml`, 0), N = o(`input_boolean.dsc_nutrient_${z}_in_inventory`) === "on", H = !q || q === "unknown" || q === "unavailable", Q = !H && Number.isFinite(Y) ? Math.round(Y * te * le * 10) / 10 : 0;
    return { n: z, name: q, dose: Y, stock: I, inv: N, empty: H, ml: Q, short: N && Number.isFinite(I) && I < Q && Q > 0 };
  }), S = oe.reduce((z, q) => z + q.ml, 0);
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-compose", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Strain", icon: "roster", children: [
        /* @__PURE__ */ s.jsx(
          Dr,
          {
            label: j && j !== "unknown" ? j : "No strain",
            empty: !j || j === "unknown",
            onClick: () => f("strain")
          }
        ),
        b ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { margin: "8px 0" }, children: [
          b.type ? /* @__PURE__ */ s.jsx(O, { label: String(b.type), tone: "muted" }) : null,
          b.height_cm_min != null ? /* @__PURE__ */ s.jsx(
            O,
            {
              label: `${b.height_cm_min}${b.height_cm_max != null ? `–${b.height_cm_max}` : ""}cm`,
              tone: "muted"
            }
          ) : null,
          b.thc_min != null ? /* @__PURE__ */ s.jsx(O, { label: `${b.thc_min}% THC`, tone: "muted" }) : null
        ] }) : null,
        /* @__PURE__ */ s.jsx(Qr, { entityId: "input_text.dsc_build_nickname", label: "Nickname" }),
        /* @__PURE__ */ s.jsx(F0, { entityId: "input_datetime.dsc_build_sprout_date", label: "Sprout date" }),
        M ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { margin: "8px 0" }, children: [
          /* @__PURE__ */ s.jsx(O, { label: `Auto stage · ${M}`, tone: "ok" }),
          E ? /* @__PURE__ */ s.jsx(O, { label: `Day ${E}`, tone: "muted" }) : null
        ] }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: "6px 0 0", fontSize: 12 }, children: "Set a sprout date and the growth stage is calculated from it." }),
        /* @__PURE__ */ s.jsx(Ha, { entityId: "input_select.dsc_build_custom_slot", label: "Custom strain slot" })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Vessel + mix", icon: "compose", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
          /* @__PURE__ */ s.jsx(An, { spec: L, size: 48, label: !0 }),
          /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-chip", onClick: () => f("vessel"), children: L.label })
        ] }),
        /* @__PURE__ */ s.jsx(h1, { volumeL: L.volumeL || F }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", style: { marginTop: 8 }, children: /* @__PURE__ */ s.jsx(Dr, { label: "Medium search", onClick: () => f("medium"), empty: !0 }) })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Nutrition", icon: "nutrient", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
          /* @__PURE__ */ s.jsx(Dr, { label: "Add from catalog", onClick: () => f("nutrient"), empty: !0 }),
          /* @__PURE__ */ s.jsx(O, { label: `Tank ${te} L`, tone: "muted" }),
          /* @__PURE__ */ s.jsx(O, { label: `${Math.round(le * 100)}% strength`, tone: "muted" }),
          /* @__PURE__ */ s.jsx(O, { label: `${S.toFixed(1)} ml`, tone: S > 0 ? "ok" : "muted" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
          /* @__PURE__ */ s.jsx(nt, { entityId: "input_number.dsc_mix_tank_liters", label: "Tank L", step: 0.5 }),
          /* @__PURE__ */ s.jsx(nt, { entityId: "input_number.dsc_mix_strength_pct", label: "Strength %", step: 1 })
        ] }),
        oe.map((z) => /* @__PURE__ */ s.jsxs("div", { className: "dsc-nutrient-slot", children: [
          /* @__PURE__ */ s.jsx(Qr, { entityId: `input_text.dsc_nutrient_${z.n}_name`, label: `Slot ${z.n}` }),
          /* @__PURE__ */ s.jsx(nt, { entityId: `input_number.dsc_nutrient_${z.n}_dose_ml_l`, label: "ml/L", step: 0.1 }),
          /* @__PURE__ */ s.jsx("span", { className: "dsc-mono", children: z.empty ? "—" : `${z.ml} ml` }),
          z.short ? /* @__PURE__ */ s.jsx(O, { label: "stock short", tone: "warn" }) : null
        ] }, z.n)),
        /* @__PURE__ */ s.jsx(Qr, { entityId: "input_text.dsc_build_recipe_note", label: "Recipe note", multiline: !0 }),
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: "ml = dose × tank × strength. Empty slots stay empty." })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Light + assign", icon: "lighting", children: [
        /* @__PURE__ */ s.jsx(
          Dr,
          {
            label: P && P !== "unknown" ? P : "No fixture",
            empty: !P || P === "unknown",
            onClick: () => f("light")
          }
        ),
        g ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { margin: "8px 0" }, children: [
          g.wattage_w != null ? /* @__PURE__ */ s.jsx(O, { label: `${g.wattage_w} W`, tone: "muted" }) : null,
          g.efficacy_umol_j != null ? /* @__PURE__ */ s.jsx(O, { label: `${g.efficacy_umol_j} µmol/J`, tone: "muted" }) : null,
          g.has_ppfd || g.ppfd_url ? /* @__PURE__ */ s.jsx(O, { label: "PPFD", tone: "ok" }) : /* @__PURE__ */ s.jsx(O, { label: "No PPFD URL", tone: "warn" })
        ] }) : null,
        /* @__PURE__ */ s.jsx(Ha, { entityId: "input_select.dsc_build_assign_pot", label: "Assign pot", icon: "root" }),
        /* @__PURE__ */ s.jsx(Ha, { entityId: "input_select.dsc_build_tent", label: "Tent", icon: "tent" }),
        /* @__PURE__ */ s.jsx(Ha, { entityId: "input_select.dsc_build_climate_pot", label: "Climate apply pot", icon: "climate" }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ s.jsx(ae, { variant: "primary", onClick: () => p("assign"), children: "Commit + assign" }),
          /* @__PURE__ */ s.jsx(ae, { variant: "secondary", onClick: () => p("roster"), children: "Commit roster" }),
          /* @__PURE__ */ s.jsx(ae, { variant: "secondary", onClick: () => p("seat"), children: "Assign seat" }),
          /* @__PURE__ */ s.jsx(ae, { variant: "danger", onClick: () => p("mix"), children: "Accept mix" }),
          /* @__PURE__ */ s.jsx(ae, { variant: "secondary", onClick: () => p("climate"), children: "Apply climate Want" }),
          /* @__PURE__ */ s.jsx(ae, { variant: "danger", onClick: () => p("retire"), children: "Retire pot" })
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginBottom: 0 }, children: "Each action asks you to confirm before anything is saved." })
      ] }) })
    ] }),
    /* @__PURE__ */ s.jsx(
      Je,
      {
        open: h === "strain" || h === "medium" || h === "nutrient" || h === "light",
        onDismiss: () => f(null),
        title: h ? `Search ${h}` : "Search",
        help: null,
        children: h === "strain" || h === "medium" || h === "nutrient" || h === "light" ? /* @__PURE__ */ s.jsx(gb, { kind: h, onPick: (z) => ue(h, z) }) : null
      }
    ),
    /* @__PURE__ */ s.jsxs(Je, { open: h === "vessel", onDismiss: () => f(null), title: "Vessel", help: null, children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: wd.map((z) => /* @__PURE__ */ s.jsxs(
        "button",
        {
          type: "button",
          className: `dsc-chip${z.id === L.id ? " dsc-chip--ok" : ""}`,
          onClick: () => {
            (i("input_select.dsc_build_vessel")?.attributes?.options || []).includes(z.id) && a("input_select.dsc_build_vessel") && d("input_select", "select_option", {
              entity_id: "input_select.dsc_build_vessel",
              option: z.id
            }), d("input_number", "set_value", {
              entity_id: "input_number.dsc_blend_total_l",
              value: z.volumeL
            }), f(null);
          },
          children: [
            /* @__PURE__ */ s.jsx(An, { spec: z, size: 28 }),
            " ",
            z.label
          ]
        },
        z.id
      )) }),
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { fontSize: 12 }, children: [
        "Default vessel: ",
        fi.label,
        "."
      ] }),
      a("input_select.dsc_build_vessel") ? /* @__PURE__ */ s.jsx(O, { label: "Vessel saved to hub", tone: "ok" }) : /* @__PURE__ */ s.jsx(O, { label: "Volume only — vessel presets unavailable", tone: "warn" })
    ] }),
    /* @__PURE__ */ s.jsx(
      Je,
      {
        open: m === "roster",
        onDismiss: () => p(null),
        onConfirm: () => {
          re(), p(null);
        },
        title: "Commit roster",
        confirmLabel: "Write roster",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          "Saves ",
          k || j || "this plant",
          " with vessel ",
          L.label,
          " to the roster",
          C ? ` in the ${C} tent` : "",
          ". Pot assignment stays ",
          T === "none" ? "unset" : T,
          "."
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx(
      Je,
      {
        open: m === "assign",
        onDismiss: () => p(null),
        onConfirm: () => {
          fe(), p(null);
        },
        title: "Commit + assign",
        confirmLabel: "Write + assign",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          "Saves the roster entry, then assigns it to pot ",
          T === "none" ? "(none — pick a pot first)" : T,
          " in the ",
          C || "4x8",
          " tent and applies the ",
          L.label,
          " vessel to that pot.",
          M ? ` Stage is auto-set to ${M}.` : ""
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx(
      Je,
      {
        open: m === "seat",
        onDismiss: () => p(null),
        onConfirm: () => {
          ie(T), d("script", "turn_on", {
            entity_id: "script.dsc_plant_assign_to_pot",
            pot: T,
            variables: { pot: T }
          }), p(null);
        },
        title: "Assign to pot",
        confirmLabel: "Assign now",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          "Assigns the current plant to pot ",
          T === "none" ? "(none — pick a pot first)" : T,
          ". Nothing is created if the roster entry is missing."
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx(
      Je,
      {
        open: m === "mix",
        onDismiss: () => p(null),
        onConfirm: () => {
          d("script", "turn_on", { entity_id: "script.dsc_accept_mix" }), p(null);
        },
        title: "Accept mix",
        confirmLabel: "Burn stock",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          "Deducts ",
          S.toFixed(1),
          " ml from nutrient stock — tank ",
          te,
          " L × ",
          Math.round(le * 100),
          "% strength. Empty slots are left untouched."
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx(
      Je,
      {
        open: m === "retire",
        onDismiss: () => p(null),
        onConfirm: () => {
          d("script", "turn_on", {
            entity_id: "script.dsc_plant_retire",
            pot: T,
            variables: { pot: T }
          }), p(null);
        },
        title: "Retire pot",
        confirmLabel: "Remove plant",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          "Removes the plant from pot ",
          T === "none" ? "(none — pick a pot first)" : T,
          " and clears its roster seat. This does not change the pot's in-service flag."
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx(
      Je,
      {
        open: m === "climate",
        onDismiss: () => p(null),
        onConfirm: () => {
          d("script", "turn_on", { entity_id: "script.dsc_apply_climate_want" }), p(null);
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
const B1 = [
  { id: "strain", label: "Strains" },
  { id: "medium", label: "Mediums" },
  { id: "nutrient", label: "Nutrients" },
  { id: "light", label: "Lights" }
];
function F1(a, i) {
  return Array.isArray(a) && a.length >= 2 ? `${a[0]}–${a[1]}${i}` : a != null && a !== "" ? `${a}${i}` : "";
}
function p_(a, i) {
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
      return F1(r.height_cm, "cm") || (r.height_cm_min != null ? `${r.height_cm_min}${r.height_cm_max != null ? `–${r.height_cm_max}` : ""}cm` : "—");
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
function G1(a) {
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
function V1() {
  const { state: a } = Te(), { callService: i } = $t(), r = pt(), [o, d] = x.useState("strain"), [h, f] = x.useState(null), [m, p] = x.useState([]), [b, v] = x.useState(""), g = x.useMemo(() => G1(o), [o]);
  x.useEffect(() => {
    bb(o, "", a, 8).then((j) => v(j.note));
  }, [o]);
  const y = (j) => {
    j && (o === "strain" ? i("input_text", "set_value", { entity_id: "input_text.dsc_build_strain", value: j.name }) : o === "medium" ? i("input_text", "set_value", {
      entity_id: "input_text.dsc_blend_component_1_name",
      value: j.name
    }) : o === "nutrient" ? i("input_text", "set_value", { entity_id: "input_text.dsc_nutrient_1_name", value: j.name }) : o === "light" && i("input_text", "set_value", { entity_id: "input_text.dsc_light_custom_name", value: j.name }), r("/grow/compose"));
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-research", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: [
      B1.map((j) => /* @__PURE__ */ s.jsx(
        "button",
        {
          type: "button",
          className: `dsc-chip${o === j.id ? " dsc-chip--ok" : ""}`,
          onClick: () => {
            d(j.id), f(null), p([]);
          },
          children: j.label
        },
        j.id
      )),
      /* @__PURE__ */ s.jsx(O, { label: b || "Catalog", tone: b.includes("local") ? "warn" : "ok" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(ce, { className: "dsc-glass", title: "Browse", icon: "research", children: /* @__PURE__ */ s.jsx(gb, { kind: o, onPick: (j) => f(j) }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(ce, { className: "dsc-glass", title: "Detail", icon: "roster", children: h ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx("h3", { style: { marginTop: 0 }, children: h.name }),
        /* @__PURE__ */ s.jsx("dl", { className: "dsc-detail-list", children: g.map((j) => /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("dt", { children: j.label }),
          /* @__PURE__ */ s.jsx("dd", { children: p_(h, j.key) })
        ] }, j.key)) }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", children: [
          /* @__PURE__ */ s.jsx(ae, { primary: !0, onClick: () => y(h), children: "Use in Compose" }),
          /* @__PURE__ */ s.jsx(
            ae,
            {
              onClick: () => p(
                (j) => j.some((k) => (k.id || k.name) === (h.id || h.name)) ? j : [...j, h].slice(0, 3)
              ),
              children: "Add compare"
            }
          )
        ] })
      ] }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Pick an item to see its details. Fields without data stay blank." }) }) }),
      m.length ? /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Compare", icon: "analytics", children: [
        /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "Field" }),
            m.map((j) => /* @__PURE__ */ s.jsx("th", { children: j.name }, j.id || j.name))
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: g.map((j) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: j.label }),
            m.map((k) => /* @__PURE__ */ s.jsx("td", { children: p_(k, j.key) }, k.id || k.name))
          ] }, j.key)) })
        ] }),
        /* @__PURE__ */ s.jsx(ae, { onClick: () => p([]), children: "Clear compare" })
      ] }) }) : null
    ] })
  ] });
}
function q1({ pot: a }) {
  const { available: i, state: r, num: o } = Te(), d = r(`sensor.dsc_pot${a}_expected_stage`, "—"), h = r(`sensor.dsc_pot${a}_days_since_sprout`, "—"), f = r(`sensor.dsc_pot${a}_need_summary`, "—"), m = r(`binary_sensor.dsc_pot${a}_untrusted`) === "on", p = o(`sensor.dsc_pot${a}_dryback_pct`), b = r(`input_select.dsc_pot${a}_tent`, "unassigned"), v = b === "clone" ? r("light.dsc_hub_sf1000_dimmer") === "on" : r("binary_sensor.dsc_hub_4x8_window_open") === "on", g = b === "clone" || b === "main" ? v : !1, y = Number.isFinite(p) && p > 55 ? "dryback stress" : f !== "—" && f !== "ok" ? "Need" : "calm";
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-plant-extra", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
      /* @__PURE__ */ s.jsx(O, { label: g ? "Awake" : "Asleep", tone: g ? "ok" : "muted" }),
      /* @__PURE__ */ s.jsx(O, { label: `Day ${h}`, tone: "muted" }),
      /* @__PURE__ */ s.jsx(O, { label: d === "—" ? "No stage Got" : d, tone: d === "—" ? "muted" : "ok" }),
      /* @__PURE__ */ s.jsx(
        O,
        {
          label: m ? "Need blocked (untrusted)" : y,
          tone: m ? "warn" : y === "calm" ? "ok" : "warn"
        }
      )
    ] }),
    i(`sensor.dsc_pot${a}_expected_stage`) ? null : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: "No cultivar mesh. Missing fields stay empty." })
  ] });
}
function Y1(a) {
  if (!a || a === "—") return -1;
  const i = Sb.findIndex((r) => a.indexOf(r) >= 0);
  return i >= 0 ? i : /flower/i.test(a) ? 6 : /veg/i.test(a) ? 3 : /seed/i.test(a) ? 1 : -1;
}
function pi({ compact: a }) {
  const { state: i, entity: r } = Te(), o = aa.map((k) => ({
    seat: ds(k, { state: i, entity: r }),
    oos: !Kt(k, i)
  })), h = o.filter((k) => !k.oos).map((k) => Y1(k.seat.stage)).filter((k) => k >= 0), f = new Set(h).size > 1, m = h.length ? Math.max(...h) : -1, p = i("binary_sensor.dsc_hub_4x8_window_open") === "on", b = i("binary_sensor.dsc_hub_2x4_window_open") === "on", v = i("binary_sensor.dsc_hub_light_catchup_active") === "on", g = i("binary_sensor.dsc_clone_dark_period_violation") === "on", y = i("sensor.dsc_expected_light_hours", "—"), j = i("sensor.dsc_clone_expected_light_hours", "—");
  return /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Crop scheduler", icon: "roster", children: [
    /* @__PURE__ */ s.jsx("div", { className: "dsc-stage-track", "aria-label": "Stage track", children: Sb.map((k, T) => /* @__PURE__ */ s.jsx(
      "span",
      {
        className: `dsc-stage-pill${T === m ? " is-on" : ""}${T === m + 1 ? " is-next" : ""}`,
        children: k.replace("Late (Push) Vegetative", "Push Veg").replace("Final 48-72h Flowering", "Finish").replace("Early Vegetative", "Early Veg").replace("Early Flowering", "Early Flwr").replace("Late Flowering", "Late Flwr")
      },
      k
    )) }),
    f ? /* @__PURE__ */ s.jsx(O, { label: "Mixed stages in tents", tone: "warn" }) : null,
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { margin: "8px 0" }, children: [
      /* @__PURE__ */ s.jsx(O, { label: `4×8 ${p ? "window open" : "dark"} · Want ${y}h`, tone: p ? "ok" : "muted" }),
      /* @__PURE__ */ s.jsx(O, { label: `2×4 ${b ? "window open" : "dark"} · Want ${j}h`, tone: b ? "ok" : "muted" }),
      v ? /* @__PURE__ */ s.jsx(O, { label: "Catch-up", tone: "warn" }) : null,
      g ? /* @__PURE__ */ s.jsx(O, { label: "2×4 dark violation", tone: "bad", pulse: !0 }) : null
    ] }),
    /* @__PURE__ */ s.jsx("div", { className: `dsc-scheduler-lanes${a ? " is-compact" : ""}`, children: o.map(({ seat: k, oos: T }) => {
      const C = Number(k.days), M = Number.isFinite(C) ? Math.max(1, Math.ceil(C / 7)) : null;
      return /* @__PURE__ */ s.jsxs(
        "button",
        {
          type: "button",
          className: `dsc-scheduler-lane${T ? " is-oos" : ""}`,
          disabled: T,
          onClick: () => window.dispatchEvent(new CustomEvent("dsc-dash-select-pot", { detail: { pot: k.pot } })),
          children: [
            /* @__PURE__ */ s.jsx(An, { spec: Ba(k.pot, i, r), size: 16 }),
            /* @__PURE__ */ s.jsxs("strong", { children: [
              "P",
              k.pot
            ] }),
            /* @__PURE__ */ s.jsx("span", { children: T ? "Out of service" : k.plantName }),
            /* @__PURE__ */ s.jsx(O, { label: ho(k.tent), tone: T || k.tent === "unassigned" ? "muted" : "ok" }),
            /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", children: T ? "—" : `W${M ?? "—"} · ${Number.isFinite(C) ? `${C}d` : "—"} · ${k.stage} · Need ${k.need}` })
          ]
        },
        k.pot
      );
    }) })
  ] });
}
function _o({
  pot: a,
  onSelectPot: i
}) {
  const { hass: r, state: o, entity: d, available: h, tick: f, num: m } = Te(), { callService: p } = $t(), b = pt(), v = ds(a, { state: o, entity: d }), [g, y] = x.useState(v.plantName === "—" ? "" : v.plantName), [j, k] = x.useState(v.sprout === "—" ? "" : v.sprout), [T, C] = x.useState(v.growthStage === "—" ? "" : v.growthStage), [M, E] = x.useState(v.notes === "—" ? "" : v.notes), [F, P] = x.useState(null), [K, L] = x.useState(null), [G, ee] = x.useState(null);
  x.useEffect(() => {
    y(v.plantName === "—" ? "" : v.plantName), k(v.sprout === "—" ? "" : v.sprout), C(v.growthStage === "—" ? "" : v.growthStage), E(v.notes === "—" ? "" : v.notes), P(null);
  }, [a]);
  const le = gn(a, "moisture", o), te = gn(a, "ec", o), ue = gn(a, "ph", o), ie = `sensor.dsc_pot${a}_dryback_pct`, re = ge(le), fe = ge(ie), oe = ge(te), S = ge(ue), z = je(le, { hours: 6, maxPoints: 72 }), q = je(te, { hours: 6, maxPoints: 72 }), Y = m(`input_number.dsc_pot${a}_learned_ec_per_moisture`), I = h(`input_number.dsc_pot${a}_learned_ec_per_moisture`) && Number.isFinite(Y) && Y !== 0 ? Y : NaN, N = h(`sensor.dsc_pot${a}_want_moisture_min`) ? m(`sensor.dsc_pot${a}_want_moisture_min`) : m(`number.dsc_pot${a}_want_moisture_min`), H = h(`sensor.dsc_pot${a}_want_moisture_max`) ? m(`sensor.dsc_pot${a}_want_moisture_max`) : m(`number.dsc_pot${a}_want_moisture_max`), Q = m(`sensor.dsc_pot${a}_want_ec_min`), ne = m(`sensor.dsc_pot${a}_want_ec_max`), pe = m(`sensor.dsc_pot${a}_want_ph_min`), de = m(`sensor.dsc_pot${a}_want_ph_max`), ve = Number.isFinite(N) && Number.isFinite(H) && (h(`sensor.dsc_pot${a}_want_moisture_min`) || h(`number.dsc_pot${a}_want_moisture_min`)), $e = Number.isFinite(Q) && Number.isFinite(ne), Z = Number.isFinite(pe) && Number.isFinite(de), ke = !v.strainDisplay || v.strainDisplay === "—" || /generic/i.test(v.strainDisplay), Be = async (xe) => {
    P(null);
    try {
      await p("input_select", "select_option", {
        entity_id: `input_select.dsc_pot${a}_tent`,
        option: xe
      }), window.setTimeout(() => {
        (r?.states?.[`input_select.dsc_pot${a}_tent`]?.state || "") !== xe && P("Tent change did not stick — the hub rejected it. Try again.");
      }, 400);
    } catch {
      P("Tent change did not stick — the hub rejected it. Try again.");
    }
  }, _e = () => {
    h(`text.dsc_pot${a}_plant_name`) && p("text", "set_value", {
      entity_id: `text.dsc_pot${a}_plant_name`,
      value: g
    });
  }, Ve = () => {
    const xe = `datetime.dsc_pot${a}_sprout_date`;
    if (!h(xe) || !j) return;
    const Pe = j.length === 10 ? `${j}T00:00:00` : j;
    p("datetime", "set_value", { entity_id: xe, datetime: Pe });
  }, se = () => {
    if (v.rosterSlot == null) return;
    const xe = `input_text.dsc_plant_roster_${v.rosterSlot}_notes`;
    !h(xe) && d(xe), p("input_text", "set_value", { entity_id: xe, value: M });
  }, Qe = d(`select.dsc_pot${a}_growth_stage`)?.attributes?.options || [];
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-seat-panel", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 14 }, children: [
      Sd(o).map((xe) => /* @__PURE__ */ s.jsxs(
        "button",
        {
          type: "button",
          className: `dsc-chip${xe === a ? " dsc-chip--ok" : ""}`,
          onClick: () => i?.(xe),
          children: [
            /* @__PURE__ */ s.jsx(An, { spec: Ba(xe, o, d), size: 16 }),
            " P",
            xe
          ]
        },
        xe
      )),
      /* @__PURE__ */ s.jsx(O, { label: ho(v.tent), tone: v.tent === "unassigned" ? "muted" : "ok" }),
      v.rosterSlot != null ? /* @__PURE__ */ s.jsx(O, { label: `Roster #${v.rosterSlot}`, tone: "muted" }) : /* @__PURE__ */ s.jsx(O, { label: "Not on roster", tone: "warn" }),
      re.stale ? /* @__PURE__ */ s.jsx(O, { label: "Reading held", tone: "warn" }) : null
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-seat-layout", children: [
      /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass dsc-glass--glow", title: "Medium", children: [
        /* @__PURE__ */ s.jsx(I0, { layers: v.layers, spec: Ba(a, o, d) }),
        /* @__PURE__ */ s.jsx(q1, { pot: a }),
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 10, fontSize: 12 }, children: v.blend || "No blend recorded yet — it appears here after you commit the plant." })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", style: { gap: 14 }, children: [
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ce, { className: "dsc-glass", title: "Identity", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-seat-editors", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "Nickname",
            /* @__PURE__ */ s.jsx(
              "input",
              {
                value: g,
                onChange: (xe) => y(xe.target.value),
                onBlur: _e,
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
                value: j.slice(0, 10),
                onChange: (xe) => k(xe.target.value),
                onBlur: Ve,
                disabled: !h(`datetime.dsc_pot${a}_sprout_date`)
              }
            )
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "Growth stage",
            /* @__PURE__ */ s.jsxs(
              "select",
              {
                value: T,
                onChange: (xe) => {
                  const Pe = xe.target.value;
                  if (C(Pe), !Pe) return;
                  const We = `select.dsc_pot${a}_growth_stage`;
                  h(We) && p("select", "select_option", { entity_id: We, option: Pe });
                },
                disabled: !h(`select.dsc_pot${a}_growth_stage`),
                children: [
                  /* @__PURE__ */ s.jsx("option", { value: "", children: "—" }),
                  Qe.map((xe) => /* @__PURE__ */ s.jsx("option", { value: xe, children: xe }, xe))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
            /* @__PURE__ */ s.jsx(O, { label: `Day ${v.days}`, tone: "ok" }),
            /* @__PURE__ */ s.jsx(O, { label: v.stage, tone: "muted" }),
            /* @__PURE__ */ s.jsx(O, { label: v.strainDisplay, tone: "muted" })
          ] }),
          /* @__PURE__ */ s.jsx(
            uo,
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
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Want · Got · Need", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
            /* @__PURE__ */ s.jsx(
              O,
              {
                label: `Got M ${re.stale ? `${Number.isFinite(re.value) ? re.value.toFixed(0) : "—"}*` : v.moisture}`,
                tone: re.stale ? "warn" : "ok"
              }
            ),
            /* @__PURE__ */ s.jsx(O, { label: `EC ${v.ec}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(O, { label: `pH ${v.ph}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(
              O,
              {
                label: v.need,
                tone: v.need !== "—" && v.need !== "OK" ? "warn" : "ok"
              }
            )
          ] }),
          ve && !ke ? /* @__PURE__ */ s.jsx(
            Mb,
            {
              rows: [
                {
                  label: "Moisture",
                  got: re.value,
                  stale: re.stale,
                  wantMin: N,
                  wantMax: H,
                  unit: "%"
                },
                {
                  label: "EC",
                  got: oe.value,
                  stale: oe.stale,
                  wantMin: $e ? Q : void 0,
                  wantMax: $e ? ne : void 0
                },
                {
                  label: "pH",
                  got: S.value,
                  stale: S.stale,
                  wantMin: Z ? pe : void 0,
                  wantMax: Z ? de : void 0
                }
              ]
            }
          ) : /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", style: { margin: "8px 0 0" }, children: [
            /* @__PURE__ */ s.jsx(O, { label: "No target bands", tone: "warn" }),
            " ",
            ke ? "No strain selected — target bands are unknown." : "Custom targets not set — showing measurements only."
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "dsc-kpi-sub", children: "Need compares the catalog targets against what was measured." })
        ] }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(ce, { className: "dsc-glass", title: "Dryback", children: /* @__PURE__ */ s.jsx(
          Ke,
          {
            label: "Dryback",
            value: fe.value,
            min: 0,
            max: 100,
            unit: "%",
            stale: fe.stale,
            band: { min: 0, max: 45 },
            onClick: () => ee({ id: ie, label: "Dryback", unit: "%" })
          }
        ) }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Got history", children: [
          /* @__PURE__ */ s.jsx(
            jn,
            {
              live: !0,
              lastSyncAt: Math.max(z.lastSyncAt ?? 0, q.lastSyncAt ?? 0) || void 0,
              series: [
                {
                  id: "m",
                  label: "Moisture",
                  series: z.series,
                  color: "var(--dsc-blue)",
                  axis: "left",
                  unit: "%"
                },
                {
                  id: "ec",
                  label: "EC",
                  series: q.series,
                  color: "var(--dsc-amber)",
                  axis: "right",
                  unit: ""
                }
              ]
            }
          ),
          /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: Number.isFinite(I) ? `Learned nutrient use: ${I.toFixed(3)} EC per moisture point, from this pot's own history.` : "EC over time shown — not enough history yet to learn this pot's nutrient use." }),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginTop: 8 }, children: [
            /* @__PURE__ */ s.jsx(ae, { onClick: () => ee({ id: le, label: "Moisture", unit: "%" }), children: "Moisture hist" }),
            /* @__PURE__ */ s.jsx(ae, { onClick: () => ee({ id: te, label: "EC", unit: "" }), children: "EC hist" }),
            /* @__PURE__ */ s.jsx(ae, { onClick: () => ee({ id: ue, label: "pH", unit: "" }), children: "pH hist" })
          ] })
        ] }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Nutrition", children: [
          /* @__PURE__ */ s.jsx("p", { style: { margin: "0 0 6px" }, children: v.recipe || "No recipe recorded for this plant — catalog doses shown only." }),
          /* @__PURE__ */ s.jsxs("label", { className: "dsc-seat-editors", children: [
            "Roster notes",
            /* @__PURE__ */ s.jsx(
              "textarea",
              {
                rows: 3,
                value: M,
                onChange: (xe) => E(xe.target.value),
                onBlur: se,
                disabled: v.rosterSlot == null
              }
            )
          ] }),
          /* @__PURE__ */ s.jsx("div", { style: { marginTop: 10 }, children: /* @__PURE__ */ s.jsx(ci, { to: "/grow/compose", children: /* @__PURE__ */ s.jsx(ae, { teal: !0, children: "Mix in Compose" }) }) })
        ] }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Live Got chips", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
            /* @__PURE__ */ s.jsx(O, { label: `M ${v.moisture}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(O, { label: `T ${v.soilTemp}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(O, { label: `EC ${v.ec}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(O, { label: `pH ${v.ph}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(O, { label: `N ${v.n}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(O, { label: `P ${v.p}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(O, { label: `K ${v.k}`, tone: "muted" })
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: "NPK = trend indicators. Unavailable stays —. Held shows last good on blip." })
        ] }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Apply to tent", children: [
          /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "Digital-twin placement. Moves the plant on Twin; does not rewrite climate Want." }),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-seat-actions", children: [
            /* @__PURE__ */ s.jsx(ae, { primary: v.tent === "clone", onClick: () => L("clone"), children: "2×4" }),
            /* @__PURE__ */ s.jsx(ae, { primary: v.tent === "main", onClick: () => L("main"), children: "4×8" }),
            /* @__PURE__ */ s.jsx(ae, { onClick: () => L("unassigned"), children: "Unassigned" }),
            /* @__PURE__ */ s.jsx(ci, { to: "/live/twin", children: /* @__PURE__ */ s.jsx(ae, { children: "Open Twin" }) })
          ] }),
          /* @__PURE__ */ s.jsx(
            Je,
            {
              open: K != null,
              onDismiss: () => L(null),
              onConfirm: () => {
                const xe = K;
                L(null), xe && Be(xe);
              },
              title: K === "clone" ? "Move plant to 2×4" : K === "main" ? "Move plant to 4×8" : "Unassign tent",
              confirmLabel: "Apply tent",
              help: null,
              children: /* @__PURE__ */ s.jsxs("p", { children: [
                "Updates pot ",
                a,
                " placement on the Twin. Climate Want is unchanged — use Climate or Compose for targets."
              ] })
            }
          ),
          F ? /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
            /* @__PURE__ */ s.jsx(O, { label: "Tent apply failed", tone: "bad" }),
            " ",
            F
          ] }) : null
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ s.jsx(
      C1,
      {
        open: G != null,
        onClose: () => ee(null),
        entityId: G?.id ?? null,
        label: G?.label ?? "",
        unit: G?.unit
      }
    )
  ] });
}
function X1() {
  const a = pt();
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Ct,
      {
        icon: "compose",
        title: "Compose",
        subtitle: "Build soil blend, roster commit, and Want handoff.",
        primaryAction: /* @__PURE__ */ s.jsx(ae, { teal: !0, onClick: () => a("/grow/roster"), children: "Open Roster / Seat" }),
        actions: /* @__PURE__ */ s.jsx(ae, { primary: !0, onClick: () => a("/grow/research"), children: "Browse Catalog" })
      }
    ),
    /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Catalog traits (height, flowering, chemistry) appear when the catalog has real data — empty fields stay empty. After committing, open Roster to assign a seat." }),
    /* @__PURE__ */ s.jsx(U1, {})
  ] });
}
function Q1() {
  const a = pt();
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Ct,
      {
        icon: "research",
        title: "Research",
        subtitle: "Live CannaLib catalog — strains, mediums, nutrients, and lights.",
        actions: /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(ae, { primary: !0, onClick: () => a("/grow/compose"), children: "Use in Compose" }),
          /* @__PURE__ */ s.jsx(ae, { teal: !0, onClick: () => a("/grow/roster"), children: "Open Seat" })
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Height, flowering, and chemistry chips appear only when the catalog has real data — gaps are shown as gaps. Use in Compose to draft a plant, or Open Seat to work with a plant already on the roster." }),
    /* @__PURE__ */ s.jsx(V1, {})
  ] });
}
function Z1() {
  const { entity: a, state: i, tick: r } = Te(), [o, d] = oo(), h = t1(a), f = Number(o.get("pot") || 0), m = f >= 1 && f <= 4 && Kt(f, i) ? f : null, p = (v) => {
    if (!Kt(v, i)) return;
    const g = new URLSearchParams(o);
    g.set("pot", String(v)), d(g, { replace: !0 });
  }, b = () => {
    const v = new URLSearchParams(o);
    v.delete("pot"), d(v, { replace: !0 });
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Ct,
      {
        icon: "roster",
        title: "Roster",
        subtitle: "Seats — open a row for Plant Seat drawer. Nutrient mix lives in Compose.",
        primaryAction: /* @__PURE__ */ s.jsx(ci, { to: "/grow/compose", children: /* @__PURE__ */ s.jsx(ae, { primary: !0, children: "Use in Compose" }) })
      }
    ),
    /* @__PURE__ */ s.jsx("div", { style: { marginBottom: 14 }, children: /* @__PURE__ */ s.jsx(pi, { compact: !0 }) }),
    /* @__PURE__ */ s.jsx(ce, { className: "dsc-glass", title: "Roster", icon: "roster", children: h.length ? /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", children: [
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
        const g = Number(v.pot), y = g >= 1 && g <= 4, j = y && Kt(g, i), k = y ? Wr(i, g) : "unassigned", T = ho(k !== "unassigned" ? k : fb(v.tent)), C = y ? i(`sensor.dsc_pot${g}_need_summary`, "—") : "—", M = y ? Ba(g, i, a) : null;
        return /* @__PURE__ */ s.jsxs(
          "tr",
          {
            onClick: () => {
              j && p(g);
            },
            style: j ? { cursor: "pointer" } : void 0,
            children: [
              /* @__PURE__ */ s.jsxs("td", { children: [
                "#",
                v.slot
              ] }),
              /* @__PURE__ */ s.jsx("td", { children: v.nickname || "—" }),
              /* @__PURE__ */ s.jsx("td", { children: v.strain || "—" }),
              /* @__PURE__ */ s.jsx("td", { children: v.status || "—" }),
              /* @__PURE__ */ s.jsx("td", { children: y ? /* @__PURE__ */ s.jsxs("span", { className: "dsc-chip-row", children: [
                M ? /* @__PURE__ */ s.jsx(An, { spec: M, size: 22 }) : null,
                "P",
                g,
                j ? null : /* @__PURE__ */ s.jsx(O, { label: "Out of service", tone: "warn" })
              ] }) : "—" }),
              /* @__PURE__ */ s.jsx("td", { children: C }),
              /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx(O, { label: T, tone: "muted" }) })
            ]
          },
          v.slot
        );
      }) })
    ] }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "No plants in roster yet. Commit from Compose, then assign a pot." }) }),
    /* @__PURE__ */ s.jsx(
      us,
      {
        open: m != null,
        onClose: b,
        title: m != null ? `Plant seat · POT${m}` : "Plant seat",
        children: m != null ? /* @__PURE__ */ s.jsx(_o, { pot: m, onSelectPot: p }) : null
      }
    )
  ] });
}
function K1() {
  const [a, i] = x.useState(null), r = pt(), o = zt();
  x.useEffect(() => {
    const f = (m) => {
      const p = m.detail, b = Number(p?.pot);
      b >= 1 && b <= 4 && i(b);
    };
    return window.addEventListener("dsc-dash-select-pot", f), () => window.removeEventListener("dsc-dash-select-pot", f);
  }, []);
  const d = x.useCallback(() => i(null), []);
  return /* @__PURE__ */ s.jsx(
    Je,
    {
      open: a != null,
      onDismiss: d,
      title: a != null ? `Plant seat · POT${a}` : "Plant seat",
      help: null,
      children: a != null ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx(_o, { pot: a, onSelectPot: i }),
        o.pathname !== "/live/root" ? /* @__PURE__ */ s.jsx("div", { className: "dsc-row-actions", style: { marginTop: 12 }, children: /* @__PURE__ */ s.jsx(
          ae,
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
function ft(a, i, r, o, d, h) {
  const f = { id: a, label: i, series: r.series, color: o, unit: d, ...h };
  return r.ghost.length <= 1 ? [f] : [
    f,
    { id: `${a}-ghost`, label: `${i} prior`, series: r.ghost, color: o, unit: d, ghost: !0 }
  ];
}
const $b = x.createContext(null), Ta = {
  main: "#f97316",
  clone: "#22c55e",
  room: "#94a3b8"
};
function J1({ target: a, onClose: i }) {
  const { num: r } = Te(), o = a?.kind.startsWith("pot") ? 48 : 24, { hours: d, setHours: h, maxPoints: f } = ll(o);
  x.useEffect(() => {
    a && h(o);
  }, [a, o, h]);
  const m = Math.min(Math.max(f, 96), 288), p = je("sensor.dsc_hub_tent_temperature", { hours: d, maxPoints: m, withGhost: !0 }), b = je("sensor.dsc_hub_clone_temperature", { hours: d, maxPoints: m, withGhost: !0 }), v = je("sensor.dsc_hub_room_temperature", { hours: d, maxPoints: m, withGhost: !0 }), g = je("sensor.dsc_hub_tent_humidity", { hours: d, maxPoints: m, withGhost: !0 }), y = je("sensor.dsc_hub_clone_humidity", { hours: d, maxPoints: m, withGhost: !0 }), j = je("sensor.dsc_hub_room_humidity", { hours: d, maxPoints: m, withGhost: !0 }), k = je("sensor.dsc_hub_vpd_kpa", { hours: d, maxPoints: m, withGhost: !0 }), T = je("sensor.dsc_hub_clone_vpd_kpa", { hours: d, maxPoints: m, withGhost: !0 }), C = je("sensor.dsc_coldest_root_zone_temp", { hours: d, maxPoints: m, withGhost: !0 }), M = je("sensor.dsc_pot1_soil_moisture", { hours: d, maxPoints: m, withGhost: !0 }), E = je("sensor.dsc_pot2_soil_moisture", { hours: d, maxPoints: m, withGhost: !0 }), F = je("sensor.dsc_pot3_soil_moisture", { hours: d, maxPoints: m, withGhost: !0 }), P = je("sensor.dsc_pot4_soil_moisture", { hours: d, maxPoints: m, withGhost: !0 }), K = je("sensor.dsc_pot1_soil_temperature", { hours: d, maxPoints: m, withGhost: !0 }), L = je("sensor.dsc_pot2_soil_temperature", { hours: d, maxPoints: m, withGhost: !0 }), G = je("sensor.dsc_pot3_soil_temperature", { hours: d, maxPoints: m, withGhost: !0 }), ee = je("sensor.dsc_pot4_soil_temperature", { hours: d, maxPoints: m, withGhost: !0 }), le = r("number.dsc_hub_target_temp", 25), te = r("number.dsc_hub_clone_target_temp", 24), ue = r("number.dsc_hub_rh_target_min", 45), ie = r("number.dsc_hub_rh_target_max", 70);
  r("number.dsc_hub_clone_rh_min", 55), r("number.dsc_hub_clone_rh_max", 75);
  const re = r("number.dsc_hub_vpd_target_min", 0.8), fe = r("number.dsc_hub_vpd_target_max", 1.4), oe = r("number.dsc_hub_clone_vpd_min", 0.6), S = r("number.dsc_hub_clone_vpd_max", 1.2), z = r("number.dsc_hub_mat_root_zone_low", 20), q = r("number.dsc_hub_mat_root_zone_high", 24), Y = x.useMemo(() => {
    if (!a) return null;
    switch (a.kind) {
      case "temp":
        return {
          unit: "°C",
          height: 380,
          series: [
            ...ft("mt", "4×8 Tent", p, Ta.main, "°C"),
            ...ft("ct", "2×4 Clone", b, Ta.clone, "°C"),
            ...ft("rt", "Room", v, Ta.room, "°C")
          ],
          targets: [
            { value: le, color: "#f9731688", label: "4×8 target" },
            { value: te, color: "#22c55e88", label: "2×4 target" }
          ]
        };
      case "rh":
        return {
          unit: "%",
          height: 380,
          yDomain: { left: { min: 0, max: 100 } },
          series: [
            ...ft("mrh", "4×8 Tent", g, "#3b82f6", "%"),
            ...ft("crh", "2×4 Clone", y, Ta.clone, "%"),
            ...ft("rrh", "Room", j, Ta.room, "%")
          ],
          targets: [{ min: ue, max: ie, color: "#22c55e88" }]
        };
      case "vpd":
        return {
          unit: "kPa",
          height: 380,
          series: [
            ...ft("mv", "4×8 Tent", k, Ta.main, "kPa"),
            ...ft("cv", "2×4 Clone", T, Ta.clone, "kPa")
          ],
          targets: [
            { min: re, max: fe, color: "#f9731688" },
            { min: oe, max: S, color: "#22c55e88" }
          ]
        };
      case "root":
        return {
          unit: "°C",
          height: 380,
          series: [...ft("root", "Root coldest", C, "#fbbf24", "°C")],
          targets: [{ min: z, max: q, color: "#22c55e88" }]
        };
      default: {
        const H = Number(a.kind.replace("pot", "")), Q = [M, E, F, P][H - 1], ne = [K, L, G, ee][H - 1];
        return {
          unit: "%",
          height: 320,
          yDomain: { left: { min: 0, max: 100 }, right: { min: 10, max: 35 } },
          series: [
            ...ft(`pm${H}`, "Moisture", Q, "#3b82f6", "%", { axis: "left" }),
            ...ft(`pt${H}`, "Soil °C", ne, Ta.main, "°C", { axis: "right" })
          ],
          targets: [{ value: 30, color: "#ef444488", label: "dry 30%" }]
        };
      }
    }
  }, [
    a,
    p,
    b,
    v,
    g,
    y,
    j,
    k,
    T,
    C,
    M,
    E,
    F,
    P,
    K,
    L,
    G,
    ee,
    le,
    te,
    ue,
    ie,
    re,
    fe,
    oe,
    S,
    z,
    q
  ]), I = Y ? Y.series.every((H) => H.series.length < 2) : !0, N = Y && Math.max(...Y.series.map((H) => H.series.at(-1)?.t ?? 0), 0) || void 0;
  return /* @__PURE__ */ s.jsxs(us, { open: !!a, onClose: i, title: a?.title ?? "History", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ s.jsx(rl, { hours: d, setHours: h, extras: il }),
      I ? /* @__PURE__ */ s.jsx(O, { label: "Thin recorder", tone: "warn" }) : null
    ] }),
    Y ? /* @__PURE__ */ s.jsx(
      jn,
      {
        live: !0,
        height: Y.height,
        unit: Y.unit,
        lastSyncAt: N,
        series: Y.series,
        targets: Y.targets,
        yDomain: Y.yDomain
      }
    ) : null,
    /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 10, fontSize: 12 }, children: "Multi-zone history — same series as HA Home gauge popups." })
  ] });
}
function P1({ children: a }) {
  const [i, r] = x.useState(null), o = x.useCallback(() => r(null), []), d = x.useCallback((f) => r(f), []), h = x.useMemo(() => ({ open: d, close: o }), [d, o]);
  return /* @__PURE__ */ s.jsxs($b.Provider, { value: h, children: [
    a,
    /* @__PURE__ */ s.jsx(J1, { target: i, onClose: o })
  ] });
}
function Ub() {
  const a = x.useContext($b);
  return a || { open: () => {
  }, close: () => {
  } };
}
const Bb = {
  temp: "Temperature — 24h",
  rh: "Humidity — 24h",
  vpd: "VPD — 24h",
  root: "Soil temperature — 24h",
  pot1: "POT1 — moisture & soil temp",
  pot2: "POT2 — moisture & soil temp",
  pot3: "POT3 — moisture & soil temp",
  pot4: "POT4 — moisture & soil temp"
}, Fb = x.createContext(null);
function W1(a) {
  return a === "clone" || a === "compare" || a === "room" || a === "main" ? a : "main";
}
function I1({ children: a }) {
  const [i, r] = oo(), o = W1(i.get("tent") ?? i.get("zone")), d = x.useCallback(
    (f) => {
      const m = new URLSearchParams(i);
      m.set("tent", f), m.delete("zone"), r(m, { replace: !0 });
    },
    [i, r]
  ), h = x.useMemo(() => ({ focus: o, setFocus: d }), [o, d]);
  return /* @__PURE__ */ s.jsx(Fb.Provider, { value: h, children: a });
}
function Md() {
  const a = x.useContext(Fb);
  return a || {
    focus: "main",
    setFocus: () => {
    }
  };
}
function Rd() {
  const { online: a, uptime: i, heartbeat: r } = tb(), o = xt(), { state: d, available: h } = Te(), f = h("sensor.dsc_hub_api_down_age") ? d("sensor.dsc_hub_api_down_age", "—") : i != null ? String(i) : "—", m = h("sensor.dsc_hub_link_recovery_bounces") ? d("sensor.dsc_hub_link_recovery_bounces", "—") : "—", p = h("sensor.dsc_hub_rf_status") ? d("sensor.dsc_hub_rf_status", "—") : "—", b = h("sensor.dsc_hub_ha_handshake_age") ? d("sensor.dsc_hub_ha_handshake_age", "—") : r != null ? String(r) : "—";
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
    /* @__PURE__ */ s.jsx(
      O,
      {
        icon: a ? "ok" : "alert",
        label: a ? "HUB LINK" : "HUB LINK DOWN",
        tone: a ? "ok" : "bad"
      }
    ),
    /* @__PURE__ */ s.jsx(O, { label: `Age ${f}`, tone: "muted" }),
    /* @__PURE__ */ s.jsx(O, { label: `Bounces ${m}`, tone: "muted" }),
    /* @__PURE__ */ s.jsx(O, { label: `RF ${p}`, tone: "muted" }),
    /* @__PURE__ */ s.jsx(O, { label: `Beat ${b}`, tone: "muted" }),
    o.surface ? /* @__PURE__ */ s.jsx(O, { label: o.surface, tone: "muted" }) : null
  ] });
}
const e2 = "_allocated";
function mt(a, i, r) {
  const o = r.num(i);
  return r.forceKind === "mass-balance" ? {
    value: r.num(a, o),
    kind: "mass-balance",
    entityId: a,
    nameplate: Number.isFinite(o) ? o : void 0
  } : r.available(a) && Number.isFinite(r.num(a)) ? {
    value: r.num(a),
    kind: a.endsWith(e2) ? "allocated" : "nameplate",
    entityId: a,
    nameplate: Number.isFinite(o) ? o : void 0
  } : {
    value: o,
    kind: "nameplate",
    entityId: i,
    nameplate: Number.isFinite(o) ? o : void 0
  };
}
function bo({ readings: a }) {
  const i = a.some((o) => o.kind === "nameplate"), r = a.some((o) => o.kind === "allocated" || o.kind === "mass-balance");
  return i && !r ? /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { margin: "0 0 8px" }, children: "CFM guessed from fan % × nameplate — run Learning to measure." }) : i && r ? /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { margin: "0 0 8px" }, children: "Mixed CFM trust — some ducts from Learning, others still nameplate. Run Learning on the dashed paths." }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { margin: "0 0 8px" }, children: "CFM from Learning (anemometer)." });
}
const t2 = [
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
function n2(a) {
  return a.linkEntity || a.relayEntity || a.demandEntity || a.inServiceEntity || a.firmwareEntity || "";
}
function Ad(a) {
  return t2.map((i) => a2(i, a));
}
function a2(a, i) {
  const r = n2(a), o = i.hub.online;
  if (a.id === "hub")
    return {
      id: a.id,
      label: a.label,
      status: i.hub.online ? "ok" : "dark",
      entityId: "binary_sensor.dsc_hub_link",
      firmwareEntity: a.firmwareEntity
    };
  if (a.inServiceEntity && !(a.id.startsWith("pot") && a.id.length === 4, el(i, a.id)))
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
  const d = i.sonoffs[a.id], h = i.pots[a.id], f = d?.online ?? h?.online ?? !1, m = a.inServiceEntity ? el(i, a.id) : !0;
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
    const p = d.values.relay_on === !0;
    return {
      id: a.id,
      label: a.label,
      status: p ? "ok" : "idle",
      subtitle: p ? "Running" : "Idle",
      entityId: a.demandEntity || a.relayEntity || r,
      inServiceEntity: a.inServiceEntity,
      runtimeToday: a.runtimeToday,
      cyclesToday: a.cyclesToday,
      demandEntity: a.demandEntity,
      firmwareEntity: a.firmwareEntity
    };
  }
  return a.id === "tank" || a.id === "ac" || a.id === "mister" ? el(i, a.id) ? {
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
function zd(a) {
  const i = a.filter((d) => d.id !== "hub"), r = i.filter((d) => d.status === "oos"), o = i.filter((d) => d.status === "dark").length;
  return {
    inService: i.length - r.length,
    total: i.length,
    dark: o
  };
}
function s2(a, i) {
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
function l2(a) {
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
const __ = { w: 720, h: 400 }, tl = { x: 360, y: 188 }, i2 = /* @__PURE__ */ new Set(["heater", "heatmat", "humidifier", "dehumidifier", "ac", "mister"]);
function b_(a) {
  return i2.has(a.id) && a.status === "ok";
}
function g_(a, i, r) {
  if (a === "hub") return tl;
  const o = 148, d = i / Math.max(r, 1) * Math.PI * 2 - Math.PI / 2;
  return { x: tl.x + Math.cos(d) * o, y: tl.y + Math.sin(d) * o };
}
function v_(a) {
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
function Dd({
  nodes: a,
  onSelect: i
}) {
  const r = a.find((d) => d.id === "hub"), o = a.filter((d) => d.id !== "hub");
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-kit-pulse", children: [
    /* @__PURE__ */ s.jsxs("svg", { viewBox: `0 0 ${__.w} ${__.h}`, className: "dsc-kit-constellation", "aria-label": "Kit pulse", children: [
      o.map((d, h) => {
        const f = g_(d.id, h, o.length), m = d.status === "oos" || d.status === "missing" || d.status === "dark";
        return /* @__PURE__ */ s.jsx(
          "line",
          {
            x1: tl.x,
            y1: tl.y,
            x2: f.x,
            y2: f.y,
            stroke: v_(r?.status === "ok" && !m ? "ok" : d.status),
            strokeWidth: "1.2",
            strokeDasharray: m || r?.status !== "ok" ? "4 4" : void 0,
            opacity: 0.7
          },
          `edge-${d.id}`
        );
      }),
      a.map((d) => {
        const h = d.id === "hub" ? tl : g_(d.id, o.findIndex((b) => b.id === d.id), o.length), f = d.status === "oos" || d.status === "missing" || d.status === "dark", m = d.status === "idle", p = d.label.replace("Pot ", "P").replace("Clone mister", "Mister").replace("Dehumidifier", "Dehum").replace("Humidifier", "Hum");
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
                  className: b_(d) ? "dsc-kit-node-running" : void 0,
                  fill: f || m ? "none" : "rgba(38,198,218,0.12)",
                  stroke: v_(d.status),
                  strokeWidth: "1.8",
                  strokeDasharray: f ? "4 3" : void 0
                }
              ),
              /* @__PURE__ */ s.jsx("text", { textAnchor: "middle", y: "4", fill: "currentColor", fontSize: "9", children: p })
            ]
          },
          d.id
        );
      })
    ] }),
    /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: a.map((d) => /* @__PURE__ */ s.jsx(
      O,
      {
        label: s2(d.status, d.label),
        tone: l2(d.status),
        motion: b_(d) ? "duty" : void 0,
        onClick: i ? () => i(d) : void 0
      },
      d.id
    )) })
  ] });
}
const r2 = 25e3;
function Gb(a = r2) {
  const { available: i, tick: r } = Te(), o = x.useRef({}), [, d] = x.useState(() => Date.now());
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
function o2() {
  const { state: a, num: i, available: r, entity: o, tick: d } = Te(), h = xt(), f = pt(), [m, p] = x.useState(!1), b = Gb(), { isSnoozed: v } = po(), g = Dn(), y = h.hub.online || b("sensor.dsc_hub_uptime"), j = yb(), k = wb(), T = jb(), C = i("sensor.dsc_active_alert_count", 0), M = ge("sensor.dsc_hub_tent_temperature"), E = ge("sensor.dsc_hub_tent_humidity"), F = ge("sensor.dsc_hub_vpd_kpa"), P = ge("sensor.dsc_hub_clone_temperature"), K = ge("sensor.dsc_hub_clone_humidity"), L = ge("sensor.dsc_hub_clone_vpd_kpa"), G = ge("sensor.dsc_pot1_got_moisture"), ee = ge("sensor.dsc_pot2_got_moisture"), le = ge("sensor.dsc_pot3_got_moisture"), te = ge("sensor.dsc_pot4_got_moisture"), ue = [G, ee, le, te], ie = h.panel.online ? "on" : a("binary_sensor.dsc_hub_panel_link"), re = h.panel.online || ie === "on", fe = h.hub.values.heartbeat != null ? String(h.hub.values.heartbeat) : a("sensor.dsc_hub_heartbeat", "NO BEAT"), oe = h.hub.online && h.hub.values.heartbeat != null ? !0 : b("sensor.dsc_hub_heartbeat"), S = a("switch.dsc_hub_manual_takeover") === "on", z = a("switch.dsc_hub_tent_manual_override") === "on", q = a("switch.dsc_hub_tent_full_auto_mode") === "on", Y = !!h.system.reduced_kit, I = String(o("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? ""), N = q && !S, H = a("sensor.dsc_fleet_version_status", h.expected_firmware || "—"), Q = h.version === h.expected_firmware ? "ok" : H === "warn" ? "warn" : "drift", ne = Ob.filter((se) => a(se) === "on" && !v(se)).map((se) => ({
    id: se,
    label: se.split(".").pop()?.replace(/dsc_/, "").replace(/_/g, " ") || se
  })), pe = aa.map((se) => ds(se, { state: a, entity: o })), de = Ad(h), ve = zd(de), $e = mt("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available: r,
    num: i
  }), Z = b("binary_sensor.dsc_hub_panel_link") || re, ke = !re && r("sensor.dsc_control_wifi_rssi"), Be = !re && !ke && !Z, _e = M.stale || E.stale || F.stale || P.stale || K.stale || L.stale, Ve = (se) => g.open({
    entityId: se.entityId,
    label: se.label,
    kind: "kit",
    runtimeToday: se.runtimeToday,
    cyclesToday: se.cyclesToday,
    demandEntity: se.demandEntity
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Ct,
      {
        icon: "mission",
        title: "Mission",
        subtitle: "Triage glance — Next, faults, seats, lung. Command lives on Climate.",
        primaryAction: /* @__PURE__ */ s.jsx(ae, { teal: !0, onClick: () => f("/live/twin"), children: "Open Twin" }),
        actions: /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(ae, { primary: !0, onClick: () => f("/live/climate"), children: "Climate Want" }),
          /* @__PURE__ */ s.jsx(jd, { label: "Search", icon: "search", onClick: () => p(!0) }),
          /* @__PURE__ */ s.jsx(
            uo,
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
        O,
        {
          icon: y ? "ok" : "alert",
          label: y ? "HUB ONLINE" : "HUB OFFLINE",
          tone: y ? "ok" : "bad",
          onClick: () => g.open({ entityId: "binary_sensor.dsc_hub_link", label: "Hub", kind: "kit" })
        }
      ),
      y ? null : /* @__PURE__ */ s.jsx(
        O,
        {
          label: `OFF ${j != null ? Ua(j) : "—"}`,
          tone: "bad",
          pulse: !0
        }
      ),
      _e ? /* @__PURE__ */ s.jsx(O, { label: "HELD VITALS", tone: "warn" }) : null,
      /* @__PURE__ */ s.jsx(
        O,
        {
          label: `${ve.inService} of ${ve.total} in service`,
          tone: ve.dark > 0 ? "bad" : "ok",
          onClick: () => f("/fleet")
        }
      ),
      /* @__PURE__ */ s.jsx(
        O,
        {
          label: re ? "PANEL LINKED" : ke ? "PANEL LIMITED LINK" : Be ? "PANEL OFFLINE" : "PANEL…",
          tone: re ? "ok" : ke ? "warn" : "bad",
          onClick: () => g.open({ entityId: "binary_sensor.dsc_hub_panel_link", label: "Panel link", kind: "kit" })
        }
      ),
      Be ? /* @__PURE__ */ s.jsx(
        O,
        {
          label: `PANEL OFF ${T != null ? Ua(T) : "—"}`,
          tone: "bad",
          pulse: !0
        }
      ) : null,
      /* @__PURE__ */ s.jsx(
        O,
        {
          icon: oe ? "ok" : "alert",
          label: oe ? `BEAT ${fe}` : "NO BEAT",
          tone: oe ? "ok" : "bad",
          onClick: () => g.open({ entityId: "sensor.dsc_hub_heartbeat", label: "Heartbeat", kind: "kit" })
        }
      ),
      oe ? null : /* @__PURE__ */ s.jsx(O, { label: `BEAT OFF ${k != null ? Ua(k) : "—"}`, tone: "bad", pulse: !0 }),
      /* @__PURE__ */ s.jsx(
        O,
        {
          icon: ne.length === 0 ? "ok" : "alert",
          label: ne.length === 0 ? "All clear" : `${ne.length} alert(s)`,
          tone: ne.length === 0 ? "ok" : "bad",
          pulse: ne.length > 0,
          onClick: () => {
            const se = ne[0];
            g.open({
              entityId: se?.id || "sensor.dsc_active_alert_count",
              label: se?.label || "Alerts",
              kind: "alert"
            });
          }
        }
      ),
      /* @__PURE__ */ s.jsx(
        O,
        {
          label: Q === "ok" ? "FLEET OK" : Q === "warn" ? "FLEET WARN" : "FLEET DRIFT",
          tone: Q === "ok" ? "ok" : Q === "warn" ? "warn" : "bad",
          onClick: () => g.open({
            entityId: "sensor.dsc_fleet_version_status",
            label: `Fleet ${h.expected_firmware}`,
            kind: "fleet"
          })
        }
      ),
      q ? /* @__PURE__ */ s.jsx(O, { icon: "ok", label: "FULL AUTO", tone: "ok", pulse: !0 }) : null,
      N ? /* @__PURE__ */ s.jsx(O, { label: "AUTO-DRIVEN", tone: "ok" }) : null,
      S ? /* @__PURE__ */ s.jsx(O, { icon: "alert", label: "MANUAL TAKEOVER", tone: "warn", pulse: !0 }) : null,
      z ? /* @__PURE__ */ s.jsx(O, { icon: "alert", label: "FAN OVERRIDE", tone: "warn", pulse: !0 }) : null,
      q && Y ? /* @__PURE__ */ s.jsx(
        O,
        {
          icon: "alert",
          label: I || "CAPACITY OFFLINE",
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
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(X0, {}) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ce, { className: "dsc-glass", title: "Hub link", icon: "fleet", children: /* @__PURE__ */ s.jsx(Rd, {}) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ce, { className: "dsc-glass", title: "Kit pulse", icon: "ok", children: /* @__PURE__ */ s.jsx(Dd, { nodes: de, onSelect: Ve }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Lung CFM", icon: "climate", children: [
        /* @__PURE__ */ s.jsx(bo, { readings: [$e] }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: /* @__PURE__ */ s.jsxs("button", { type: "button", className: "dsc-chip", onClick: () => f("/live/climate"), children: [
          "OUT ",
          Number.isFinite($e.value) ? Math.round($e.value) : "—",
          " cfm → Climate"
        ] }) })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ce, { className: "dsc-glass", title: "Plant seats", icon: "seat", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: pe.map((se) => {
        const Qe = !Kt(se.pot, a), xe = fo(se.pot, a), Pe = ue[se.pot - 1], We = !Qe && !xe.blockNeedAct && se.need && se.need !== "—" && se.need !== "ok";
        return /* @__PURE__ */ s.jsxs(
          "button",
          {
            type: "button",
            className: `dsc-chip${Qe ? "" : " dsc-chip--ok"}${We ? " dsc-chip--pulse" : ""}`,
            onClick: () => window.dispatchEvent(new CustomEvent("dsc-dash-select-pot", { detail: { pot: se.pot } })),
            title: Qe ? "Out of service — no data" : se.need,
            children: [
              /* @__PURE__ */ s.jsx(An, { spec: Ba(se.pot, a, o), size: 18 }),
              "P",
              se.pot,
              " ",
              se.plantName !== "—" ? se.plantName : "—",
              " · Got M",
              " ",
              Qe ? "—" : Pe.stale ? `${Number.isFinite(Pe.value) ? Pe.value.toFixed(0) : "—"}*` : se.moisture,
              Qe ? " · Out of service" : ` · Need ${se.need}`,
              Pe.stale && !Qe ? " · HELD" : "",
              xe.labels.length ? ` · ${xe.labels.join("/")}` : ""
            ]
          },
          se.pot
        );
      }) }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(ce, { className: "dsc-glass", title: "Faults / alerts", icon: "alert", children: ne.length === 0 && C === 0 ? /* @__PURE__ */ s.jsx("div", { className: "dsc-empty dsc-empty--ok", children: "No active faults — all clear." }) : /* @__PURE__ */ s.jsxs("ul", { className: "dsc-fault-list", children: [
        ne.map((se) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx(
          O,
          {
            label: se.label,
            tone: "bad",
            pulse: !0,
            icon: "alert",
            onClick: () => g.open({ entityId: se.id, label: se.label, kind: "alert" })
          }
        ) }, se.id)),
        C > 0 && ne.length === 0 ? /* @__PURE__ */ s.jsxs("li", { children: [
          /* @__PURE__ */ s.jsx(O, { label: `${C} system alert(s)`, tone: "bad", pulse: !0, icon: "alert" }),
          /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", children: "See Fleet for details" })
        ] }) : null
      ] }) }) })
    ] }),
    /* @__PURE__ */ s.jsx(us, { open: m, onClose: () => p(!1), title: "Quick jump", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: [
      { path: "/live/climate", label: "Climate" },
      { path: "/live/twin", label: "Twin" },
      { path: "/live/4x8", label: "4×8" },
      { path: "/live/2x4", label: "2×4" },
      { path: "/live/root", label: "Root" },
      { path: "/live/light", label: "Light" },
      { path: "/grow/compose", label: "Compose" },
      { path: "/fleet", label: "Fleet" }
    ].map((se) => /* @__PURE__ */ s.jsx(
      "button",
      {
        type: "button",
        className: "dsc-btn teal",
        onClick: () => {
          p(!1), f(se.path);
        },
        children: se.label
      },
      se.path
    )) }) })
  ] });
}
function c2(a) {
  return a.kind === "allocated" || a.kind === "mass-balance" ? void 0 : "6 5";
}
function Ma(a) {
  return Number.isFinite(a) ? String(Math.round(a)) : "—";
}
function u2(a) {
  return !Number.isFinite(a) || a <= 0 ? 0 : a < 40 ? 1 : a < 80 ? 2 : a < 140 ? 3 : a < 220 ? 4 : 5;
}
function rs({
  x1: a,
  y1: i,
  x2: r,
  y2: o,
  reading: d,
  color: h,
  onClick: f
}) {
  const m = u2(d.value), p = r - a, b = o - i, v = Math.hypot(p, b) || 1, g = -b / v * 3.2, y = p / v * 3.2, j = -Math.floor((m - 1) / 2);
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
      ) : Array.from({ length: m }, (k, T) => {
        const C = j + T;
        return /* @__PURE__ */ s.jsx(
          "line",
          {
            x1: a + g * C,
            y1: i + y * C,
            x2: r + g * C,
            y2: o + y * C,
            stroke: h,
            strokeWidth: 1.4 + Math.min(2.2, d.value / 120),
            strokeDasharray: c2(d),
            opacity: 0.85
          },
          T
        );
      })
    }
  );
}
function Od({
  intakeClone: a,
  intakeMain: i,
  outCfm: r,
  recircCfm: o,
  compact: d,
  focus: h
}) {
  const f = Dn(), m = {
    value: Number.isFinite(a.value) ? a.value : 0,
    kind: a.kind,
    entityId: a.entityId,
    nameplate: a.nameplate
  }, p = (Number.isFinite(a.value) ? a.value : 0) + (Number.isFinite(i.value) ? i.value : 0), b = h !== "main", v = h !== "clone", g = h !== "clone", y = h === "clone" ? [a] : h === "main" ? [i, r, o] : [a, i, r, o], j = () => f.open({
    entityId: m.entityId,
    label: "Cascade 2×4 → 4×8",
    unit: "cfm"
  });
  return /* @__PURE__ */ s.jsxs("div", { className: `dsc-air-path${d ? " is-compact" : ""}`, children: [
    /* @__PURE__ */ s.jsx(bo, { readings: y }),
    /* @__PURE__ */ s.jsxs("svg", { viewBox: "0 0 720 260", className: "dsc-air-svg", "aria-label": "Air path room to tents", children: [
      /* @__PURE__ */ s.jsx("rect", { x: "16", y: "78", width: "120", height: "110", rx: "12", fill: "none", stroke: "var(--dsc-teal)", strokeWidth: "1.8" }),
      /* @__PURE__ */ s.jsx("text", { x: "76", y: "122", textAnchor: "middle", fill: "currentColor", fontSize: "13", children: "Room" }),
      /* @__PURE__ */ s.jsx("text", { x: "76", y: "142", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: "umbrella lung" }),
      b ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx("rect", { x: "220", y: "28", width: "150", height: "88", rx: "10", fill: "none", stroke: "var(--dsc-teal)", strokeWidth: "1.8" }),
        /* @__PURE__ */ s.jsx("text", { x: "295", y: "64", textAnchor: "middle", fill: "currentColor", fontSize: "13", children: "2×4 tent" }),
        /* @__PURE__ */ s.jsxs("text", { x: "295", y: "84", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: [
          "in ",
          Ma(a.value),
          " cfm"
        ] }),
        /* @__PURE__ */ s.jsx(
          rs,
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
          Ma(i.value),
          " cfm"
        ] }),
        /* @__PURE__ */ s.jsx(
          rs,
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
          Ma(r.value)
        ] })
      ] }) : null,
      h ? null : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx(
          rs,
          {
            x1: 295,
            y1: 116,
            x2: 295,
            y2: 150,
            reading: m,
            color: "var(--dsc-amber)",
            onClick: j
          }
        ),
        /* @__PURE__ */ s.jsxs("text", { x: "370", y: "140", fill: "var(--dsc-amber)", fontSize: "10", children: [
          "cascade ",
          Ma(m.value)
        ] }),
        /* @__PURE__ */ s.jsx("text", { x: "370", y: "152", fill: "var(--dsc-gray-5)", fontSize: "9", children: "same air · not added to Σ" })
      ] }),
      h === "clone" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx(
          rs,
          {
            x1: 370,
            y1: 72,
            x2: 430,
            y2: 72,
            reading: m,
            color: "var(--dsc-amber)",
            onClick: j
          }
        ),
        /* @__PURE__ */ s.jsx("rect", { x: "430", y: "54", width: "88", height: "36", rx: "8", fill: "none", stroke: "var(--dsc-amber)", strokeWidth: "1.4", strokeDasharray: "5 4" }),
        /* @__PURE__ */ s.jsx("text", { x: "474", y: "76", textAnchor: "middle", fill: "var(--dsc-amber)", fontSize: "10", children: "to 4×8" }),
        /* @__PURE__ */ s.jsxs("text", { x: "474", y: "102", textAnchor: "middle", fill: "var(--dsc-amber)", fontSize: "9", children: [
          "cascade ",
          Ma(m.value)
        ] })
      ] }) : null,
      h === "main" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx(
          rs,
          {
            x1: 295,
            y1: 132,
            x2: 295,
            y2: 150,
            reading: m,
            color: "var(--dsc-amber)",
            onClick: j
          }
        ),
        /* @__PURE__ */ s.jsx("rect", { x: "251", y: "104", width: "88", height: "28", rx: "8", fill: "none", stroke: "var(--dsc-amber)", strokeWidth: "1.4", strokeDasharray: "5 4" }),
        /* @__PURE__ */ s.jsx("text", { x: "295", y: "122", textAnchor: "middle", fill: "var(--dsc-amber)", fontSize: "10", children: "from 2×4" }),
        /* @__PURE__ */ s.jsxs("text", { x: "390", y: "122", fill: "var(--dsc-amber)", fontSize: "9", children: [
          "cascade ",
          Ma(m.value)
        ] })
      ] }) : null,
      g ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx(
          rs,
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
          rs,
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
          Ma(o.value)
        ] })
      ] }) : null
    ] }),
    h ? null : /* @__PURE__ */ s.jsx(
      O,
      {
        label: `Mass-balance exhaust = Σ intake ${Ma(p)} × dump/recirc split`,
        tone: "muted"
      }
    )
  ] });
}
const d2 = "#66bb6a", x_ = "#ffb74d", y_ = "#ef5350", h2 = "#8b95a8", w_ = -1e9;
function f2(a, i, r) {
  const o = r === "°C" ? 1 : 0.05;
  return Math.max((i - a) * 0.12, o);
}
function _i(a, i, r) {
  if (!Number.isFinite(a) || !Number.isFinite(i) || i <= a)
    return [{ from: w_, color: h2 }];
  const o = f2(a, i, r);
  return [
    { from: w_, color: y_ },
    { from: a - 3 * o, color: x_ },
    { from: a - o, color: d2 },
    { from: i + o, color: x_ },
    { from: i + 3 * o, color: y_ }
  ];
}
function ii(a) {
  const i = Number.isFinite(a) ? a : 25;
  return _i(i - 2, i + 2, "°C");
}
function ri(a, i) {
  return _i(a, i);
}
function ao(a, i) {
  return _i(a, i);
}
function m2(a, i) {
  return _i(a, i, "°C");
}
function rd(a = 30, i = 75) {
  return _i(a, i);
}
function p2(a) {
  return a("sensor.dsc_hub_room_vpd_kpa") ? "sensor.dsc_hub_room_vpd_kpa" : a("sensor.dsc_hub_room_vpd") ? "sensor.dsc_hub_room_vpd" : "sensor.dsc_hub_room_vpd_kpa";
}
function Mn(a, i = 1) {
  return Number.isFinite(a) ? a.toFixed(i) : "—";
}
const _2 = [
  { id: "compare", label: "All" },
  { id: "main", label: "4×8" },
  { id: "clone", label: "2×4" },
  { id: "room", label: "Room" }
];
function b2() {
  const { num: a, state: i, entity: r, available: o } = Te(), d = xt(), h = tb(), f = pt(), m = Dn(), { focus: p, setFocus: b } = Md(), { hours: v, setHours: g, maxPoints: y } = ll(6), j = nl("switch.dsc_hub_tent_manual_override").state === "on", k = nl("switch.dsc_hub_tent_full_auto_mode").state === "on", T = String(r("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? ""), C = !!d.system.reduced_kit, M = ge("sensor.dsc_hub_tent_temperature"), E = ge("sensor.dsc_hub_tent_humidity"), F = ge("sensor.dsc_hub_vpd_kpa"), P = ge("sensor.dsc_hub_clone_temperature"), K = ge("sensor.dsc_hub_clone_humidity"), L = ge("sensor.dsc_hub_clone_vpd_kpa"), G = ge("sensor.dsc_hub_room_temperature"), ee = ge("sensor.dsc_hub_room_humidity"), le = p2(r), te = ge(le), ue = je("sensor.dsc_hub_tent_temperature", { hours: v, maxPoints: y, withGhost: !0 }), ie = je("sensor.dsc_hub_tent_humidity", { hours: v, maxPoints: y, withGhost: !0 }), re = je("sensor.dsc_hub_vpd_kpa", { hours: v, maxPoints: y, withGhost: !0 }), fe = je("sensor.dsc_hub_clone_temperature", { hours: v, maxPoints: y, withGhost: !0 }), oe = je("sensor.dsc_hub_clone_humidity", { hours: v, maxPoints: y, withGhost: !0 }), S = je("sensor.dsc_hub_clone_vpd_kpa", { hours: v, maxPoints: y, withGhost: !0 }), z = je("sensor.dsc_hub_room_temperature", { hours: v, maxPoints: y, withGhost: !0 }), q = je("sensor.dsc_hub_room_humidity", { hours: v, maxPoints: y, withGhost: !0 }), Y = je(le, { hours: v, maxPoints: y, withGhost: !0 }), I = je("sensor.dsc_fan_exhaust_outside_pct", { hours: v, maxPoints: y }), N = je("sensor.dsc_fan_exhaust_room_pct", { hours: v, maxPoints: y }), H = mt("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available: o,
    num: a
  }), Q = mt(
    "sensor.dsc_cfm_exhaust_recirc_allocated",
    "sensor.dsc_cfm_exhaust_recirc",
    { available: o, num: a }
  ), ne = mt(
    "sensor.dsc_cfm_intake_main_allocated",
    "sensor.dsc_cfm_intake_main",
    { available: o, num: a }
  ), pe = mt(
    "sensor.dsc_cfm_intake_2x4_allocated",
    "sensor.dsc_cfm_intake_2x4",
    { available: o, num: a }
  ), de = qu(G.value, ee.value), ve = qu(M.value, E.value), $e = qu(P.value, K.value), Z = a("number.dsc_hub_target_temp"), ke = a("number.dsc_hub_rh_target_min"), Be = a("number.dsc_hub_rh_target_max"), _e = a("number.dsc_hub_vpd_target_min"), Ve = a("number.dsc_hub_vpd_target_max"), se = a("number.dsc_hub_clone_target_temp"), Qe = a("number.dsc_hub_clone_rh_min"), xe = a("number.dsc_hub_clone_rh_max"), Pe = a("number.dsc_hub_clone_vpd_min"), We = a("number.dsc_hub_clone_vpd_max"), De = (kn, yo, ms) => m.open({ entityId: kn, label: yo, unit: ms }), Ut = x.useMemo(() => Rn(ue.series), [ue.series]), Bt = x.useMemo(() => Rn(ie.series), [ie.series]), rn = x.useMemo(() => Rn(re.series), [re.series]), Jt = x.useMemo(() => Rn(fe.series), [fe.series]), it = x.useMemo(() => Rn(oe.series), [oe.series]), ol = x.useMemo(() => Rn(S.series), [S.series]), ze = x.useMemo(() => Rn(z.series), [z.series]), hs = x.useMemo(() => Rn(q.series), [q.series]), fs = x.useMemo(() => Rn(Y.series), [Y.series]), go = M.value - G.value, bi = ve - de, vo = F.value - te.value, xo = M.value - P.value, Fa = ve - $e, Dt = $e - de, vn = a("sensor.dsc_bought_runtime_today"), Et = a("sensor.dsc_vent_heat_dump_btu"), cl = (kn) => p === "compare" || p === kn ? "dsc-gauge-row-3 is-lit" : "dsc-gauge-row-3";
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Ct,
      {
        icon: "climate",
        title: "Climate",
        subtitle: "Room is the umbrella lung. 2×4 and 4×8 are grow rooms and transfer/storage. T, RH, VPD only together.",
        actions: /* @__PURE__ */ s.jsx(
          uo,
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
        O,
        {
          icon: h.online ? "ok" : "alert",
          label: h.online ? `Hub ${h.temp_c != null ? `${h.temp_c.toFixed(1)}°C` : "live"}` : "Hub offline",
          tone: h.online ? "ok" : "bad"
        }
      ),
      _2.map((kn) => /* @__PURE__ */ s.jsx(
        "button",
        {
          type: "button",
          className: `dsc-chip${p === kn.id ? " dsc-chip--ok" : ""}`,
          onClick: () => b(kn.id),
          children: kn.label
        },
        kn.id
      )),
      /* @__PURE__ */ s.jsx(rl, { hours: v, setHours: g, extras: il }),
      /* @__PURE__ */ s.jsx(ae, { teal: !0, onClick: () => f("/fleet"), children: "Kit / Fleet" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Command", icon: "climate", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-row", children: [
          /* @__PURE__ */ s.jsx(vt, { confirm: !0, entityId: "switch.dsc_hub_tent_full_auto_mode", label: "Full Auto", icon: "ok" }),
          /* @__PURE__ */ s.jsx(vt, { confirm: !0, entityId: "switch.dsc_hub_manual_takeover", label: "Master takeover", icon: "alert" }),
          /* @__PURE__ */ s.jsx(vt, { confirm: !0, entityId: "switch.dsc_hub_tent_manual_override", label: "Fan override", icon: "climate" }),
          /* @__PURE__ */ s.jsx(vt, { confirm: !0, entityId: "switch.dsc_hub_humidifier_intake_routing", label: "Hum intake routing", icon: "climate" }),
          /* @__PURE__ */ s.jsx(vt, { confirm: !0, entityId: "switch.dsc_hub_recirc_de_strat_pulse", label: "RECIRC de-strat", icon: "climate" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-selects", children: [
          /* @__PURE__ */ s.jsx(Ha, { entityId: "select.dsc_hub_control_strategy", label: "Strategy", icon: "climate" }),
          /* @__PURE__ */ s.jsx(Ha, { entityId: "select.dsc_hub_priority_tent", label: "Priority tent", icon: "tent" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-demand-row", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ s.jsx(vt, { confirm: !0, entityId: "switch.dsc_hub_heater_demand", label: "Heat", icon: "climate" }),
          /* @__PURE__ */ s.jsx(
            vt,
            {
              confirm: !0,
              entityId: "switch.dsc_hub_ac_demand",
              label: "Cool",
              icon: "climate",
              warnWhenMissing: i("binary_sensor.dsc_ac_capacity_offline") === "on" ? "AC ○" : void 0
            }
          ),
          /* @__PURE__ */ s.jsx(vt, { confirm: !0, entityId: "switch.dsc_hub_humidifier_demand", label: "Hum", icon: "climate" }),
          /* @__PURE__ */ s.jsx(vt, { confirm: !0, entityId: "switch.dsc_hub_dehumidifier_demand", label: "Dehum", icon: "climate" }),
          /* @__PURE__ */ s.jsx(vt, { confirm: !0, entityId: "switch.dsc_hub_grow_mat_demand", label: "Mat", icon: "root" }),
          /* @__PURE__ */ s.jsx(vt, { confirm: !0, entityId: "switch.dsc_hub_clone_humidifier_demand", label: "Mister", icon: "clone" })
        ] }),
        k ? /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
          /* @__PURE__ */ s.jsx(
            O,
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
          T || "The hub drives fans and appliances automatically while Full Auto is on."
        ] }) : null
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Room umbrella", icon: "climate", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
          /* @__PURE__ */ s.jsx(
            Nt,
            {
              label: "Room °C",
              value: Mn(G.value),
              unit: "°C",
              stale: G.stale,
              onClick: () => De("sensor.dsc_hub_room_temperature", "Room T", "°C")
            }
          ),
          /* @__PURE__ */ s.jsx(
            Nt,
            {
              label: "Room RH",
              value: Mn(ee.value, 0),
              unit: "%",
              stale: ee.stale,
              onClick: () => De("sensor.dsc_hub_room_humidity", "Room RH", "%")
            }
          ),
          /* @__PURE__ */ s.jsx(
            Nt,
            {
              label: "Room VPD",
              value: Mn(te.value, 2),
              unit: "kPa",
              stale: te.stale,
              onClick: () => De(le, "Room VPD", "kPa")
            }
          ),
          /* @__PURE__ */ s.jsx(
            Nt,
            {
              label: "Room AH",
              value: Number.isFinite(de) ? de.toFixed(1) : "—",
              unit: "g/m³",
              sub: Number.isFinite(de) ? `24h ${Mn(a("sensor.dsc_hub_room_temp_mean_24h"))}°C` : "Need T+RH",
              onClick: () => De("sensor.dsc_ah_room", "Room AH", "g/m³")
            }
          )
        ] }),
        /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { marginTop: 8, fontSize: 12 }, children: [
          "ΔT room↔4×8 ",
          Mn(go),
          "°C · ΔAH ",
          Mn(bi),
          " g/m³ · ΔVPD ",
          Mn(vo, 2),
          " · ΔT/ΔAH 2×4↔4×8",
          " ",
          Mn(xo),
          "°C / ",
          Mn(Fa),
          " · ΔAH room↔2×4 ",
          Mn(Dt),
          " g/m³. Early warn is the lung poisoning a tent before Want miss."
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(Lb, { hero: !0 }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Triad · T / RH / VPD", icon: "gauge", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-gauge-matrix", children: [
          /* @__PURE__ */ s.jsxs("div", { className: cl("room"), children: [
            /* @__PURE__ */ s.jsx("span", { className: "dsc-gauge-row-tag", children: "Room" }),
            /* @__PURE__ */ s.jsx(Ke, { label: "T", value: G.value, min: 10, max: 40, unit: "°C", extrema: ze, stale: G.stale, onClick: () => De("sensor.dsc_hub_room_temperature", "Room T", "°C") }),
            /* @__PURE__ */ s.jsx(Ke, { label: "RH", value: ee.value, min: 0, max: 100, unit: "%", extrema: hs, stale: ee.stale, onClick: () => De("sensor.dsc_hub_room_humidity", "Room RH", "%") }),
            /* @__PURE__ */ s.jsx(Ke, { label: "VPD", value: te.value, min: 0, max: 2.5, unit: "kPa", extrema: fs, stale: te.stale, onClick: () => De(le, "Room VPD", "kPa") })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: cl("clone"), children: [
            /* @__PURE__ */ s.jsx("span", { className: "dsc-gauge-row-tag", children: "2×4" }),
            /* @__PURE__ */ s.jsx(Ke, { label: "T", value: P.value, min: 15, max: 35, unit: "°C", target: se, band: { min: se - 2, max: se + 2 }, segments: ii(se), extrema: Jt, stale: P.stale, onClick: () => De("sensor.dsc_hub_clone_temperature", "2×4 T", "°C") }),
            /* @__PURE__ */ s.jsx(Ke, { label: "RH", value: K.value, min: 0, max: 100, unit: "%", band: { min: Qe, max: xe }, segments: ri(Qe, xe), extrema: it, stale: K.stale, onClick: () => De("sensor.dsc_hub_clone_humidity", "2×4 RH", "%") }),
            /* @__PURE__ */ s.jsx(Ke, { label: "VPD", value: L.value, min: 0, max: 2.5, unit: "kPa", band: { min: Pe, max: We }, segments: ao(Pe, We), extrema: ol, stale: L.stale, onClick: () => De("sensor.dsc_hub_clone_vpd_kpa", "2×4 VPD", "kPa") })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: cl("main"), children: [
            /* @__PURE__ */ s.jsx("span", { className: "dsc-gauge-row-tag", children: "4×8" }),
            /* @__PURE__ */ s.jsx(Ke, { label: "T", value: M.value, min: 15, max: 35, unit: "°C", target: Z, band: { min: Z - 2, max: Z + 2 }, segments: ii(Z), extrema: Ut, stale: M.stale, onClick: () => De("sensor.dsc_hub_tent_temperature", "4×8 T", "°C") }),
            /* @__PURE__ */ s.jsx(Ke, { label: "RH", value: E.value, min: 0, max: 100, unit: "%", band: { min: ke, max: Be }, segments: ri(ke, Be), extrema: Bt, stale: E.stale, onClick: () => De("sensor.dsc_hub_tent_humidity", "4×8 RH", "%") }),
            /* @__PURE__ */ s.jsx(Ke, { label: "VPD", value: F.value, min: 0, max: 2.5, unit: "kPa", band: { min: _e, max: Ve }, segments: ao(_e, Ve), extrema: rn, stale: F.stale, onClick: () => De("sensor.dsc_hub_vpd_kpa", "4×8 VPD", "kPa") })
          ] })
        ] }),
        /* @__PURE__ */ s.jsx(
          Mb,
          {
            rows: [
              { label: "Room T", got: G.value, stale: G.stale, want: a("sensor.dsc_hub_room_temp_mean_24h"), unit: "°C" },
              { label: "2×4 T", got: P.value, stale: P.stale, want: se, unit: "°C" },
              { label: "4×8 T", got: M.value, stale: M.stale, want: Z, unit: "°C" },
              { label: "2×4 RH", got: K.value, stale: K.stale, wantMin: Qe, wantMax: xe, unit: "%" },
              { label: "4×8 RH", got: E.value, stale: E.stale, wantMin: ke, wantMax: Be, unit: "%" },
              { label: "2×4 VPD", got: L.value, stale: L.stale, wantMin: Pe, wantMax: We, unit: "kPa" },
              { label: "4×8 VPD", got: F.value, stale: F.stale, wantMin: _e, wantMax: Ve, unit: "kPa" }
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ce, { className: "dsc-glass", title: "Temperature", icon: "climate", children: /* @__PURE__ */ s.jsx(
        jn,
        {
          unit: "°C",
          lastSyncAt: Math.max(z.lastSyncAt ?? 0, fe.lastSyncAt ?? 0, ue.lastSyncAt ?? 0) || void 0,
          series: [
            ...ft("rt", "Room", z, "var(--dsc-gray-5)", "°C"),
            ...ft("ct", "2×4", fe, "var(--dsc-teal)", "°C", { band: { min: se - 1.5, max: se + 1.5 } }),
            ...ft("mt", "4×8", ue, "var(--dsc-blue)", "°C", { band: { min: Z - 1.5, max: Z + 1.5 } })
          ],
          targets: [{ axis: "left", value: Z, color: "var(--dsc-amber)", label: "4×8 Want T" }]
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ce, { className: "dsc-glass", title: "Humidity", icon: "climate", children: /* @__PURE__ */ s.jsx(
        jn,
        {
          unit: "%",
          lastSyncAt: Math.max(q.lastSyncAt ?? 0, oe.lastSyncAt ?? 0, ie.lastSyncAt ?? 0) || void 0,
          yDomain: { left: { min: 0, max: 100 } },
          series: [
            ...ft("rrh", "Room", q, "var(--dsc-gray-5)", "%"),
            ...ft("crh", "2×4", oe, "var(--dsc-teal)", "%", { band: { min: Qe, max: xe } }),
            ...ft("mrh", "4×8", ie, "var(--dsc-blue)", "%", { band: { min: ke, max: Be } })
          ],
          targets: [{ axis: "left", min: ke, max: Be, color: "var(--dsc-teal)" }]
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ce, { className: "dsc-glass", title: "VPD", icon: "climate", children: /* @__PURE__ */ s.jsx(
        jn,
        {
          unit: "kPa",
          lastSyncAt: Math.max(Y.lastSyncAt ?? 0, S.lastSyncAt ?? 0, re.lastSyncAt ?? 0) || void 0,
          series: [
            ...ft("rv", "Room", Y, "var(--dsc-gray-5)", "kPa"),
            ...ft("cv", "2×4", S, "var(--dsc-teal)", "kPa", { band: { min: Pe, max: We } }),
            ...ft("mv", "4×8", re, "var(--dsc-blue)", "kPa", { band: { min: _e, max: Ve } })
          ]
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ce, { className: "dsc-glass", title: "Air path", icon: "climate", children: /* @__PURE__ */ s.jsx(
        Od,
        {
          intakeClone: pe,
          intakeMain: ne,
          outCfm: H,
          recircCfm: Q
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Fan duty %", icon: "climate", children: [
        /* @__PURE__ */ s.jsx(
          jn,
          {
            unit: "%",
            yDomain: { left: { min: 0, max: 100 } },
            lastSyncAt: Math.max(I.lastSyncAt ?? 0, N.lastSyncAt ?? 0) || void 0,
            series: [
              { id: "fout", label: "OUT %", series: I.series, color: "var(--dsc-teal)", unit: "%", step: !0, band: { min: 0, max: 90 } },
              { id: "frec", label: "RECIRC %", series: N.series, color: "var(--dsc-amber)", unit: "%", step: !0, band: { min: 0, max: 90 } }
            ]
          }
        ),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-fan-stack", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ s.jsx(La, { entityId: "fan.dsc_hub_4_inch_intake_fan_main", label: "Intake 4×8", disabled: !j }),
          /* @__PURE__ */ s.jsx(La, { entityId: "fan.dsc_hub_4_inch_intake_fan_2x4", label: "Intake 2×4", disabled: !j }),
          /* @__PURE__ */ s.jsx(La, { entityId: "fan.dsc_hub_6_inch_exhaust_room", label: "Exhaust room", disabled: !j }),
          /* @__PURE__ */ s.jsx(La, { entityId: "fan.dsc_hub_6_inch_exhaust_outside", label: "Exhaust outside", disabled: !j })
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ce, { className: "dsc-glass", title: "Efficacy · buying kW because the lung could not transfer", icon: "alert", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ s.jsx(O, { label: `Heat ${i("switch.dsc_hub_heater_demand") === "on" ? "ON" : "off"}`, tone: i("switch.dsc_hub_heater_demand") === "on" ? "ok" : "muted", onClick: () => De("switch.dsc_hub_heater_demand", "Heater", void 0) }),
        /* @__PURE__ */ s.jsx(O, { label: `Cool ${i("switch.dsc_hub_ac_demand") === "on" ? "ON" : "off"}`, tone: i("switch.dsc_hub_ac_demand") === "on" ? "ok" : "muted", onClick: () => De("switch.dsc_hub_ac_demand", "Cool", void 0) }),
        /* @__PURE__ */ s.jsx(O, { label: `Hum ${i("switch.dsc_hub_humidifier_demand") === "on" ? "ON" : "off"}`, tone: i("switch.dsc_hub_humidifier_demand") === "on" ? "ok" : "muted", onClick: () => De("switch.dsc_hub_humidifier_demand", "Humidifier", void 0) }),
        /* @__PURE__ */ s.jsx(O, { label: `Dehum ${i("switch.dsc_hub_dehumidifier_demand") === "on" ? "ON" : "off"}`, tone: i("switch.dsc_hub_dehumidifier_demand") === "on" ? "ok" : "muted", onClick: () => De("switch.dsc_hub_dehumidifier_demand", "Dehumidifier", void 0) }),
        /* @__PURE__ */ s.jsx(
          O,
          {
            label: i("binary_sensor.dsc_humidifier_ineffective_suspect") === "on" ? "Hum ineffective" : "Hum ok",
            tone: i("binary_sensor.dsc_humidifier_ineffective_suspect") === "on" ? "warn" : "muted",
            onClick: () => De("binary_sensor.dsc_humidifier_ineffective_suspect", "Humidifier ineffective", void 0)
          }
        ),
        /* @__PURE__ */ s.jsx(
          O,
          {
            label: i("binary_sensor.dsc_heater_ineffective_suspect") === "on" ? "Heat ineffective" : "Heat ok",
            tone: i("binary_sensor.dsc_heater_ineffective_suspect") === "on" ? "warn" : "muted",
            onClick: () => De("binary_sensor.dsc_heater_ineffective_suspect", "Heater ineffective", void 0)
          }
        ),
        /* @__PURE__ */ s.jsx(
          O,
          {
            label: `Bought ${Number.isFinite(vn) ? vn.toFixed(1) : "—"}h today`,
            tone: "muted",
            onClick: () => De("sensor.dsc_bought_runtime_today", "Bought runtime today", "h")
          }
        ),
        /* @__PURE__ */ s.jsx(
          O,
          {
            label: `Dump ${Number.isFinite(Et) ? Math.round(Et) : "—"} BTU/h`,
            tone: "muted",
            onClick: () => De("sensor.dsc_vent_heat_dump_btu", "Vent heat dump", "BTU/h")
          }
        ),
        /* @__PURE__ */ s.jsx(
          O,
          {
            label: `Heater today ${Ua(a("sensor.dsc_heater_runtime_today") * 36e5)}`,
            tone: "muted",
            onClick: () => De("sensor.dsc_heater_runtime_today", "Heater runtime today", "h")
          }
        )
      ] }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(pi, { compact: !0 }) })
    ] })
  ] });
}
function g2(a, i = 1) {
  return Number.isFinite(a) ? a.toFixed(i) : "—";
}
function v2() {
  const { state: a, entity: i, tick: r, num: o } = Te();
  xt();
  const d = Dn(), h = pt(), [f, m] = oo(), p = [...aa].map((C) => ({ n: C, seat: ds(C, { state: a, entity: i }), oos: !Kt(C, a) })).sort((C, M) => Number(C.oos) - Number(M.oos)), b = e1(a), v = Number(f.get("pot") || 0), g = v >= 1 && v <= 4 && Kt(v, a) ? v : null, y = o("sensor.dsc_growmat_runtime_today"), j = o("sensor.dsc_heatmat_relay_on_time"), k = (C) => {
    const M = new URLSearchParams(f);
    M.set("pot", String(C)), m(M, { replace: !0 });
  }, T = () => {
    const C = new URLSearchParams(f);
    C.delete("pot"), m(C, { replace: !0 });
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Ct,
      {
        icon: "root",
        title: "Root",
        subtitle: `${b.inService} of ${b.total} pots in service. Pots without sensors show no data.`
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(
        Nt,
        {
          label: "Coldest root",
          value: g2(o("sensor.dsc_coldest_root_zone_temp")),
          unit: "°C",
          onClick: () => d.open({
            entityId: "sensor.dsc_coldest_root_zone_temp",
            label: "Coldest root",
            unit: "°C"
          })
        }
      ) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(
        Nt,
        {
          label: "Heat mat today",
          value: Number.isFinite(y) ? y.toFixed(1) : Ua(j * 1e3),
          unit: Number.isFinite(y) ? "h" : "",
          sub: Number.isFinite(j) ? `session ${Ua(j * 1e3)}` : void 0,
          onClick: () => d.open({
            entityId: "switch.dsc_hub_grow_mat_demand",
            label: "Heat mat",
            kind: "binary",
            runtimeToday: "sensor.dsc_growmat_runtime_today",
            demandEntity: "switch.dsc_hub_grow_mat_demand"
          })
        }
      ) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(ce, { title: "Notes", children: /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: "Mat loop uses per-pot sense with plausibility filter. Metric click opens inspector; card chrome opens the seat." }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(
        to,
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
      p.map(({ n: C, seat: M, oos: E }) => /* @__PURE__ */ s.jsxs("div", { className: "dsc-col-12", children: [
        /* @__PURE__ */ s.jsx(x2, { pot: C, oos: E, onOpenSeat: () => E ? void 0 : k(C) }),
        E ? null : /* @__PURE__ */ s.jsxs("button", { type: "button", className: "dsc-btn", style: { marginTop: 6 }, onClick: () => k(C), children: [
          "Open ",
          M.plantName !== "—" ? M.plantName : `POT${C}`,
          " seat"
        ] })
      ] }, C))
    ] }),
    /* @__PURE__ */ s.jsx(
      us,
      {
        open: g != null,
        onClose: T,
        title: g != null ? `Plant seat · POT${g}` : "Plant seat",
        children: g != null ? /* @__PURE__ */ s.jsx(_o, { pot: g, onSelectPot: k }) : null
      }
    ),
    /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 8 }, children: /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-chip", onClick: () => h("/live/climate"), children: "Climate Want" }) })
  ] });
}
function x2({ pot: a, oos: i, onOpenSeat: r }) {
  const { state: o, entity: d, available: h } = Te(), f = Dn(), m = ds(a, { state: o, entity: d }), p = fo(a, o), b = gn(a, "moisture", o), v = je(b, { hours: 6, maxPoints: 48 }), g = ge(`sensor.dsc_pot${a}_dryback_pct`), y = ge(`sensor.dsc_pot${a}_soil_temperature`), j = ge(b), k = ge(gn(a, "ec", o)), T = ge(gn(a, "ph", o)), C = ge(`sensor.dsc_pot${a}_soil_moisture_rate`), M = Zu(a, "moisture", o), E = Zu(a, "ec", o), F = Zu(a, "ph", o), P = M && M.max !== 45 ? void 0 : { min: 0, max: 45 }, K = (L, G, ee) => (le) => {
    le.stopPropagation(), f.open({ entityId: L, label: G, unit: ee });
  };
  return /* @__PURE__ */ s.jsxs(ce, { className: `dsc-glass dsc-pot-card${i ? " is-oos" : ""}`, title: `Pot ${a}`, icon: "root", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-pot-card-head", onClick: r, role: "presentation", children: [
      /* @__PURE__ */ s.jsx(An, { spec: Ba(a, o, d), size: 28 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: i ? "Out of service" : m.plantName }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
          /* @__PURE__ */ s.jsx(O, { label: ho(m.tent), tone: i || m.tent === "unassigned" ? "muted" : "ok" }),
          /* @__PURE__ */ s.jsx(
            O,
            {
              label: i ? "No data" : p.blockNeedAct ? `${m.need} (no act)` : `Need ${m.need}`,
              tone: i ? "muted" : m.need && m.need !== "ok" && m.need !== "—" ? "warn" : "ok"
            }
          ),
          p.labels.map((L) => /* @__PURE__ */ s.jsx(O, { label: L, tone: "warn" }, L))
        ] })
      ] }),
      /* @__PURE__ */ s.jsx(
        Tb,
        {
          series: v.series,
          color: Ed(
            mi({
              value: j.value,
              band: M,
              margin: mo(M),
              stale: j.stale,
              available: Number.isFinite(j.value)
            })
          ),
          width: 140,
          height: 36
        }
      )
    ] }),
    i ? /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Out of service — not measuring." }) : /* @__PURE__ */ s.jsxs("div", { className: "dsc-gauge-row", children: [
      /* @__PURE__ */ s.jsx(Ke, { label: "Moisture", value: j.value, min: 0, max: 100, unit: "%", band: M, segments: M ? rd(M.min, M.max) : rd(), stale: j.stale, onClick: () => f.open({ entityId: b, label: `P${a} moisture`, unit: "%" }) }),
      /* @__PURE__ */ s.jsx(Ke, { label: "Soil °C", value: y.value, min: 10, max: 40, unit: "°C", stale: y.stale, onClick: () => f.open({ entityId: `sensor.dsc_pot${a}_soil_temperature`, label: `P${a} soil T`, unit: "°C" }) }),
      /* @__PURE__ */ s.jsx(Ke, { label: "Dryback", value: g.value, min: 0, max: 100, unit: "%", band: P, stale: g.stale, onClick: () => f.open({ entityId: `sensor.dsc_pot${a}_dryback_pct`, label: `P${a} dryback`, unit: "%" }) }),
      /* @__PURE__ */ s.jsx(Ke, { label: "EC", value: k.value, min: 0, max: 3e3, unit: "", band: E, stale: k.stale, onClick: () => f.open({ entityId: gn(a, "ec", o), label: `P${a} EC` }) }),
      /* @__PURE__ */ s.jsx(Ke, { label: "pH", value: T.value, min: 4, max: 8, unit: "", band: F, stale: T.stale, onClick: () => f.open({ entityId: gn(a, "ph", o), label: `P${a} pH` }) }),
      /* @__PURE__ */ s.jsxs("button", { type: "button", className: "dsc-npk-hit", onClick: K(`sensor.dsc_pot${a}_soil_nitrogen`, `P${a} N`), children: [
        "N ",
        h(`sensor.dsc_pot${a}_soil_nitrogen`) ? m.n : "—"
      ] }),
      /* @__PURE__ */ s.jsxs("button", { type: "button", className: "dsc-npk-hit", onClick: K(`sensor.dsc_pot${a}_soil_phosphorus`, `P${a} P`), children: [
        "P ",
        h(`sensor.dsc_pot${a}_soil_phosphorus`) ? m.p : "—"
      ] }),
      /* @__PURE__ */ s.jsxs("button", { type: "button", className: "dsc-npk-hit", onClick: K(`sensor.dsc_pot${a}_soil_potassium`, `P${a} K`), children: [
        "K ",
        h(`sensor.dsc_pot${a}_soil_potassium`) ? m.k : "—"
      ] }),
      /* @__PURE__ */ s.jsxs(
        "button",
        {
          type: "button",
          className: "dsc-npk-hit",
          onClick: K(`sensor.dsc_pot${a}_soil_moisture_rate`, `P${a} moisture rate`),
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
function Pu(a, i = 1) {
  return Number.isFinite(a) ? a.toFixed(i) : "—";
}
function y2(a, i = Date.now()) {
  if (!a || a === "—" || a === "unknown" || a === "unavailable") return "—";
  const r = Date.parse(a);
  if (!Number.isFinite(r)) return a;
  const o = r - i, d = Math.abs(o), h = Ua(d);
  return o >= 0 ? `in ${h}` : `${h} ago`;
}
function w2() {
  const { state: a, num: i, entity: r } = Te(), o = pt(), d = Dn(), h = a("binary_sensor.dsc_clone_dark_period_violation") === "on", f = a("binary_sensor.dsc_clone_light_missing_in_window") === "on", m = a("binary_sensor.dsc_hub_light_catchup_active") === "on", p = a("light.dsc_hub_sf1000_dimmer") === "on", b = a("binary_sensor.dsc_hub_4x8_window_open") === "on", v = a("binary_sensor.dsc_hub_2x4_window_open") === "on", g = i("sensor.dsc_expected_light_hours"), y = i("sensor.dsc_clone_expected_light_hours"), j = i("sensor.dsc_lights_on_today_4x8"), k = i("sensor.dsc_lights_on_today_2x4"), T = i("sensor.dsc_lights_deviation_today"), C = a("sensor.dsc_next_light_event", "—"), M = sd("main", { state: a, entity: r }), E = sd("clone", { state: a, entity: r }), F = i("number.dsc_hub_min_dark_hours"), P = i("number.dsc_hub_clone_light_hours"), [K, L] = x.useState(F), [G, ee] = x.useState(P), le = M.lightHours != null ? { min: M.lightHours - 0.5, max: M.lightHours + 0.5, source: "stage", mixed: M.mixed } : null, te = E.lightHours != null ? { min: E.lightHours - 0.5, max: E.lightHours + 0.5, source: "stage", mixed: E.mixed } : null, ue = M.lightHours != null ? {
    min: 24 - M.lightHours - 0.5,
    max: 24 - M.lightHours + 0.5,
    source: "stage",
    mixed: M.mixed
  } : null, ie = Number.isFinite(K) ? 24 - K : g, re = Da(ie, le), fe = Da(Number.isFinite(K) ? K : F, ue), oe = a("select.dsc_hub_clone_photoperiod") === "Independent", S = Da(
    oe && Number.isFinite(G) ? G : y,
    te
  ), z = (H) => H === "critical" ? "bad" : H === "ok" ? "ok" : H === "muted" ? "muted" : "warn", q = a("switch.dsc_hub_heater_demand") === "on", Y = i("sensor.dsc_vent_heat_dump_btu"), I = (p || b) && (q || Number.isFinite(Y) && Y > 0), N = (H, Q, ne) => d.open({ entityId: H, label: Q, kind: ne || "numeric" });
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Ct,
      {
        icon: "lighting",
        title: "Light",
        subtitle: "Photoperiod desk — equal 4×8 / 2×4 cards. 4×8 Got is the window until a GPIO lamp exists.",
        primaryAction: /* @__PURE__ */ s.jsx(ae, { teal: !0, onClick: () => o("/live/climate"), children: "Climate Want" })
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-status-strip", children: [
      /* @__PURE__ */ s.jsx(
        O,
        {
          icon: h ? "alert" : "ok",
          label: h ? "2×4 DARK VIOLATION" : "Dark period OK",
          tone: h ? "bad" : "ok",
          pulse: h,
          onClick: () => N("binary_sensor.dsc_clone_dark_period_violation", "2×4 dark violation", "alert")
        }
      ),
      f ? /* @__PURE__ */ s.jsx(
        O,
        {
          label: "Missing in window",
          tone: "bad",
          pulse: !0,
          onClick: () => N("binary_sensor.dsc_clone_light_missing_in_window", "Light missing in window", "alert")
        }
      ) : null,
      m ? /* @__PURE__ */ s.jsx(
        O,
        {
          label: "Catch-up",
          tone: "warn",
          onClick: () => N("binary_sensor.dsc_hub_light_catchup_active", "Light catch-up", "alert")
        }
      ) : null,
      /* @__PURE__ */ s.jsx(
        O,
        {
          label: `Next ${y2(C)}`,
          tone: "muted",
          onClick: () => N("sensor.dsc_next_light_event", "Next light event")
        }
      ),
      I ? /* @__PURE__ */ s.jsx(O, { label: "This window is buying heat", tone: "warn", onClick: () => o("/live/climate") }) : null
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass dsc-light-hero", title: "4×8 light", icon: "tent", children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "4×8 Got is the photoperiod window until a GPIO lamp exists — not a brightness." }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
          /* @__PURE__ */ s.jsx(
            O,
            {
              label: b ? "WINDOW OPEN" : "DARK",
              tone: b ? "ok" : "muted",
              onClick: () => N("binary_sensor.dsc_hub_4x8_window_open", "4×8 window", "binary")
            }
          ),
          /* @__PURE__ */ s.jsx(
            O,
            {
              label: re.label,
              tone: z(re.tone),
              onClick: () => N("sensor.dsc_expected_light_hours", "4×8 expected hours", "numeric")
            }
          )
        ] }),
        /* @__PURE__ */ s.jsx(
          Ke,
          {
            label: "Got / Want h",
            value: j,
            min: 0,
            max: 24,
            unit: "h",
            target: M.lightHours ?? g,
            progress: !0,
            onClick: () => N("sensor.dsc_lights_on_today_4x8", "4×8 hours today", "numeric")
          }
        ),
        /* @__PURE__ */ s.jsx(Nt, { label: "Want hours", value: Pu(g, 0), unit: "h", onClick: () => N("sensor.dsc_expected_light_hours", "4×8 expected hours", "numeric") }),
        /* @__PURE__ */ s.jsx(
          to,
          {
            entityId: "binary_sensor.dsc_hub_4x8_window_open",
            hours: 24,
            label: "4×8 window 24h",
            onClick: () => N("binary_sensor.dsc_hub_4x8_window_open", "4×8 window", "binary")
          }
        ),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ s.jsx(Wp, { entityId: "time.dsc_hub_lights_on_time", label: "4×8 opens" }),
          /* @__PURE__ */ s.jsx(nt, { entityId: "number.dsc_hub_sunrise_duration", label: "Sunrise min" }),
          /* @__PURE__ */ s.jsx(nt, { entityId: "number.dsc_hub_sunset_duration", label: "Sunset min" }),
          /* @__PURE__ */ s.jsx(
            nt,
            {
              entityId: "number.dsc_hub_min_dark_hours",
              label: "Min dark h",
              hint: fe.label,
              tone: fe.tone,
              onLive: L
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass dsc-light-hero", title: "2×4 light", icon: "lighting", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
          /* @__PURE__ */ s.jsx(
            O,
            {
              label: p ? "SF1000 ON" : "SF1000 OFF",
              tone: p ? "ok" : "muted",
              onClick: () => N("light.dsc_hub_sf1000_dimmer", "SF1000", "binary")
            }
          ),
          /* @__PURE__ */ s.jsx(
            O,
            {
              label: v ? "WINDOW OPEN" : "DARK",
              tone: v ? "ok" : "muted",
              onClick: () => N("binary_sensor.dsc_hub_2x4_window_open", "2×4 window", "binary")
            }
          ),
          /* @__PURE__ */ s.jsx(
            O,
            {
              label: S.label,
              tone: z(S.tone),
              onClick: () => N("sensor.dsc_clone_expected_light_hours", "2×4 expected hours", "numeric")
            }
          )
        ] }),
        /* @__PURE__ */ s.jsx(
          Ke,
          {
            label: "Got / Want h",
            value: k,
            min: 0,
            max: 24,
            unit: "h",
            target: E.lightHours ?? y,
            progress: !0,
            onClick: () => N("sensor.dsc_lights_on_today_2x4", "2×4 hours today", "numeric")
          }
        ),
        /* @__PURE__ */ s.jsx(Nt, { label: "Want hours", value: Pu(y, 0), unit: "h", onClick: () => N("sensor.dsc_clone_expected_light_hours", "2×4 expected hours", "numeric") }),
        /* @__PURE__ */ s.jsx(
          to,
          {
            entityId: "light.dsc_hub_sf1000_dimmer",
            hours: 24,
            label: "SF1000 24h",
            onClick: () => N("light.dsc_hub_sf1000_dimmer", "SF1000", "binary")
          }
        ),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-demand-row", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ s.jsx(
            vt,
            {
              confirm: {
                title: p ? "Turn off SF1000" : "Turn on SF1000",
                body: "Manual lamp control during dark period can stress clones. Confirm only if you mean it.",
                confirmLabel: p ? "Turn off" : "Turn on"
              },
              entityId: "light.dsc_hub_sf1000_dimmer",
              label: "SF1000",
              icon: "lighting",
              showBrightness: !0
            }
          ),
          /* @__PURE__ */ s.jsx(vt, { confirm: !0, entityId: "switch.dsc_hub_auto_photoperiod", label: "Auto photoperiod" }),
          /* @__PURE__ */ s.jsx(vt, { confirm: !0, entityId: "switch.dsc_hub_manual_light_hold", label: "Manual light hold" })
        ] }),
        /* @__PURE__ */ s.jsx(Ha, { entityId: "select.dsc_hub_clone_photoperiod", label: "Window source", icon: "clone" }),
        oe ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
          /* @__PURE__ */ s.jsx(Wp, { entityId: "time.dsc_hub_clone_lights_on_time", label: "2×4 lights-on" }),
          /* @__PURE__ */ s.jsx(
            nt,
            {
              entityId: "number.dsc_hub_clone_light_hours",
              label: "2×4 hours",
              hint: S.label,
              tone: S.tone,
              onLive: ee
            }
          )
        ] }) : /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
          "2×4 follows 4×8 (",
          a("time.dsc_hub_lights_on_time", "—"),
          "). Switch Window source to Independent to unlock start/hours."
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(
        Nt,
        {
          label: "Deviation today",
          value: Pu(T, 2),
          unit: "h",
          sub: "Recorded by the hub",
          onClick: () => N("sensor.dsc_lights_deviation_today", "Lights deviation today", "numeric")
        }
      ) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(pi, {}) })
    ] })
  ] });
}
function Br(a, i = 1) {
  return Number.isFinite(a) ? a.toFixed(i) : "—";
}
function j_() {
  const a = pt(), { available: i, num: r } = Te(), o = mt("sensor.dsc_cfm_intake_main_allocated", "sensor.dsc_cfm_intake_main", {
    available: i,
    num: r
  }), d = mt("sensor.dsc_cfm_intake_2x4_allocated", "sensor.dsc_cfm_intake_2x4", {
    available: i,
    num: r
  }), h = mt("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available: i,
    num: r
  }), f = mt(
    "sensor.dsc_cfm_exhaust_recirc_allocated",
    "sensor.dsc_cfm_exhaust_recirc",
    { available: i, num: r }
  );
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page dsc-page--twin-chrome", children: [
    /* @__PURE__ */ s.jsx(
      Ct,
      {
        icon: "twin",
        title: "Twin",
        subtitle: "Cinematic digital twin — pick a pot to open Root seat.",
        primaryAction: /* @__PURE__ */ s.jsx(ae, { teal: !0, onClick: () => a("/live/climate"), children: "Set Climate Want" }),
        actions: /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(ae, { onClick: () => a("/live/4x8"), children: "4×8 cockpit" }),
          /* @__PURE__ */ s.jsx(ae, { onClick: () => a("/live/2x4"), children: "2×4 cockpit" })
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty dsc-muted", style: { marginTop: 0 }, children: "Pick a pot in the twin to open its seat. Twin stays warm across Twin / 4×8 / 2×4. Orbit the scene — it no longer snaps home on hass ticks. 4×8 fixture glow follows the photoperiod window until a main lamp is wired." }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", style: { marginTop: 12 }, children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(pi, {}) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ce, { className: "dsc-glass", title: "Air path", icon: "climate", children: /* @__PURE__ */ s.jsx(Od, { intakeClone: d, intakeMain: o, outCfm: h, recircCfm: f }) }) })
    ] })
  ] });
}
function Vb({ tent: a }) {
  const { state: i, entity: r, num: o, tick: d, callWS: h, available: f } = Te(), m = v0(a), p = pt(), b = Dn(), { setFocus: v } = Md(), [g, y] = oo(), [j, k] = x.useState([]), { hours: T, setHours: C, maxPoints: M } = ll(6);
  x.useEffect(() => {
    v(a);
  }, [a, v]);
  const E = mb(a, i, r), F = E.map((_e) => _e.pot).join(","), P = Number(g.get("pot") || 0), K = P >= 1 && P <= 4 && Kt(P, i) && E.some((_e) => _e.pot === P) ? P : null, L = a === "main" ? "sensor.dsc_hub_tent_temperature" : "sensor.dsc_hub_clone_temperature", G = a === "main" ? "sensor.dsc_hub_tent_humidity" : "sensor.dsc_hub_clone_humidity", ee = a === "main" ? "sensor.dsc_hub_vpd_kpa" : "sensor.dsc_hub_clone_vpd_kpa", le = je(L, { hours: T, maxPoints: M }), te = je(G, { hours: T, maxPoints: M }), ue = je(ee, { hours: T, maxPoints: M }), ie = ge(L), re = ge(G), fe = ge(ee), oe = Number.isFinite(ie.value) ? ie.value : m.temp_c, S = Number.isFinite(re.value) ? re.value : m.rh_pct, z = Number.isFinite(fe.value) ? fe.value : m.vpd_kpa, q = i(
    a === "main" ? "binary_sensor.dsc_hub_4x8_window_open" : "binary_sensor.dsc_hub_2x4_window_open"
  ) === "on", Y = i("light.dsc_hub_sf1000_dimmer") === "on", I = a === "clone" ? Y : q, N = a === "main" ? mt("sensor.dsc_cfm_intake_main_allocated", "sensor.dsc_cfm_intake_main", { available: f, num: o }) : mt("sensor.dsc_cfm_intake_2x4_allocated", "sensor.dsc_cfm_intake_2x4", { available: f, num: o }), H = mt(
    "sensor.dsc_cfm_exhaust_out_allocated",
    "sensor.dsc_cfm_exhaust_out",
    { available: f, num: o }
  ), Q = mt(
    "sensor.dsc_cfm_exhaust_recirc_allocated",
    "sensor.dsc_cfm_exhaust_recirc",
    { available: f, num: o }
  ), ne = mt("sensor.dsc_cfm_intake_2x4_allocated", "sensor.dsc_cfm_intake_2x4", {
    available: f,
    num: o
  }), pe = mt("sensor.dsc_cfm_intake_main_allocated", "sensor.dsc_cfm_intake_main", {
    available: f,
    num: o
  }), de = i("switch.dsc_hub_tent_manual_override") === "on", ve = a === "main" ? "4×8 tent" : "2×4 tent", $e = a === "main" ? "Only the 4×8 house in Twin. Cascade-in is a port stub from 2×4, not a second tent." : "Only the 2×4 house in Twin. Cascade-out is a port stub to 4×8.";
  x.useEffect(() => {
    let _e = !1;
    async function Ve() {
      const se = F ? F.split(",").map((We) => Number(We)).filter((We) => Number.isFinite(We) && We > 0) : [];
      if (!h || se.length === 0) {
        k([]);
        return;
      }
      const Qe = se.flatMap((We) => [
        `text.dsc_pot${We}_plant_name`,
        `input_select.dsc_pot${We}_tent`,
        `select.dsc_pot${We}_growth_stage`
      ]), xe = /* @__PURE__ */ new Date(), Pe = new Date(xe.getTime() - 48 * 3600 * 1e3);
      try {
        const We = await h({
          type: "history/history_during_period",
          start_time: Pe.toISOString(),
          end_time: xe.toISOString(),
          significant_changes_only: !0,
          minimal_response: !0,
          no_attributes: !0,
          entity_ids: Qe
        });
        if (_e || !We) return;
        const De = [];
        for (const [Ut, Bt] of Object.entries(We))
          for (const rn of Bt || []) {
            const Jt = typeof rn.lu == "number" ? rn.lu * 1e3 : rn.last_changed ? Date.parse(rn.last_changed) : NaN, it = String(rn.s ?? rn.state ?? "");
            !Number.isFinite(Jt) || !it || it === "unavailable" || De.push({ t: Jt, text: `${new Date(Jt).toLocaleString()} · ${Ut.split(".").pop()} → ${it}` });
          }
        De.sort((Ut, Bt) => Bt.t - Ut.t), k(De.map((Ut) => Ut.text));
      } catch {
        _e || k([]);
      }
    }
    return Ve(), () => {
      _e = !0;
    };
  }, [h, F, a]);
  const Z = o(a === "main" ? "number.dsc_hub_target_temp" : "number.dsc_hub_clone_target_temp"), ke = o(a === "main" ? "number.dsc_hub_rh_target_min" : "number.dsc_hub_clone_rh_min"), Be = o(a === "main" ? "number.dsc_hub_rh_target_max" : "number.dsc_hub_clone_rh_max");
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Ct,
      {
        icon: a === "main" ? "tent" : "clone",
        title: ve,
        subtitle: `Tent cockpit — ${E.length} seat(s). ${$e}`,
        primaryAction: /* @__PURE__ */ s.jsx(ae, { teal: !0, onClick: () => p("/live/twin"), children: "Both tents" }),
        actions: /* @__PURE__ */ s.jsx(ae, { primary: !0, onClick: () => p(`/live/climate?tent=${a}`), children: "Climate Want" })
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-tent-cockpit-strip", children: [
      /* @__PURE__ */ s.jsx(O, { label: `${E.length} plants`, tone: "ok" }),
      /* @__PURE__ */ s.jsx(
        O,
        {
          label: `T ${Br(oe)}°C`,
          tone: ie.stale && !m.online ? "warn" : "ok",
          onClick: () => b.open({ entityId: L, label: `${ve} T`, unit: "°C" })
        }
      ),
      /* @__PURE__ */ s.jsx(
        O,
        {
          label: `RH ${Br(S, 0)}%`,
          tone: re.stale && !m.online ? "warn" : "ok",
          onClick: () => b.open({ entityId: G, label: `${ve} RH`, unit: "%" })
        }
      ),
      /* @__PURE__ */ s.jsx(
        O,
        {
          label: `VPD ${Br(z, 2)}`,
          tone: fe.stale && !m.online ? "warn" : "ok",
          onClick: () => b.open({ entityId: ee, label: `${ve} VPD`, unit: "kPa" })
        }
      ),
      /* @__PURE__ */ s.jsx(
        O,
        {
          label: a === "clone" ? I ? "SF1000 ON" : "SF1000 OFF" : q ? "PHOTO ON" : "PHOTO OFF",
          tone: I ? "ok" : "muted",
          onClick: () => b.open({
            entityId: a === "clone" ? "light.dsc_hub_sf1000_dimmer" : "binary_sensor.dsc_hub_4x8_window_open",
            label: a === "clone" ? "SF1000" : "4×8 window",
            kind: "binary"
          })
        }
      ),
      /* @__PURE__ */ s.jsx(
        O,
        {
          label: `IN ${Br(N.value, 0)} cfm`,
          tone: "muted",
          onClick: () => b.open({
            entityId: N.entityId,
            label: `${ve} intake CFM`,
            unit: "cfm"
          })
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(Lb, { only: a, hero: !0 }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(pi, { compact: !0 }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ce, { className: "dsc-glass", title: "Air path", icon: "climate", children: /* @__PURE__ */ s.jsx(
        Od,
        {
          compact: !0,
          focus: a,
          intakeClone: ne,
          intakeMain: pe,
          outCfm: H,
          recircCfm: Q
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ce, { className: "dsc-glass", title: "Seat strip", icon: "seat", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: E.length === 0 ? /* @__PURE__ */ s.jsx("div", { className: "dsc-empty", children: "No pots assigned — Apply to tent from a seat." }) : E.map((_e) => {
        const Ve = Number(i(`sensor.dsc_pot${_e.pot}_dryback_pct`)), se = Number.isFinite(Ve) && Ve > 45, Qe = fo(_e.pot, i), xe = !Qe.blockNeedAct && se;
        return /* @__PURE__ */ s.jsxs(
          "button",
          {
            type: "button",
            className: `dsc-chip dsc-chip--ok${xe ? " dsc-chip--pulse" : ""}`,
            onClick: () => {
              const Pe = new URLSearchParams(g);
              Pe.set("pot", String(_e.pot)), y(Pe, { replace: !0 });
            },
            children: [
              /* @__PURE__ */ s.jsx(An, { spec: Ba(_e.pot, i, r), size: 16 }),
              " P",
              _e.pot,
              " ",
              _e.plantName,
              " · M ",
              _e.moisture,
              " · Need",
              " ",
              Qe.blockNeedAct ? `${_e.need} (no act)` : _e.need,
              se ? " · dryback warn" : ""
            ]
          },
          _e.pot
        );
      }) }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Tent history", icon: "climate", children: [
        /* @__PURE__ */ s.jsx(rl, { hours: T, setHours: C, extras: il }),
        /* @__PURE__ */ s.jsx(
          jn,
          {
            live: !0,
            lastSyncAt: Math.max(le.lastSyncAt ?? 0, te.lastSyncAt ?? 0, ue.lastSyncAt ?? 0) || void 0,
            series: [
              {
                id: "t",
                label: "Temp",
                series: le.series,
                color: "var(--dsc-blue)",
                axis: "left",
                unit: "°C",
                band: Number.isFinite(Z) ? { min: Z - 1.5, max: Z + 1.5 } : void 0
              },
              {
                id: "rh",
                label: "RH",
                series: te.series,
                color: "var(--dsc-teal)",
                axis: "right",
                unit: "%",
                band: { min: ke, max: Be }
              }
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Fans (this tent)", icon: "climate", children: [
        de ? null : /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Fan sliders locked until Fan override is on (Climate → Command)." }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-fan-stack", children: a === "main" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(
            La,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_main",
              label: "Intake 4×8",
              disabled: !de
            }
          ),
          /* @__PURE__ */ s.jsx(
            La,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_room",
              label: "Exhaust room (RECIRC)",
              disabled: !de
            }
          ),
          /* @__PURE__ */ s.jsx(
            La,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_outside",
              label: "Exhaust outside (OUT)",
              disabled: !de
            }
          )
        ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(
            La,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_2x4",
              label: "Intake 2×4",
              disabled: !de
            }
          ),
          /* @__PURE__ */ s.jsx(vt, { entityId: "light.dsc_hub_sf1000_dimmer", label: "SF1000", icon: "lighting" })
        ] }) })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ce, { className: "dsc-glass", title: "Plant log (48h)", icon: "roster", children: j.length === 0 ? /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: "Nothing logged in the last 48 hours." }) : /* @__PURE__ */ s.jsxs("ul", { className: "dsc-fault-list", children: [
        j.slice(0, 40).map((_e) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", style: { fontFamily: "var(--dsc-mono)", fontSize: 12 }, children: _e }) }, _e)),
        j.length > 40 ? /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsxs("span", { className: "dsc-muted", style: { fontFamily: "var(--dsc-mono)", fontSize: 12 }, children: [
          "+",
          j.length - 40,
          " more"
        ] }) }) : null
      ] }) }) })
    ] }),
    /* @__PURE__ */ s.jsx(
      us,
      {
        open: K != null,
        onClose: () => {
          const _e = new URLSearchParams(g);
          _e.delete("pot"), y(_e, { replace: !0 });
        },
        title: K != null ? `Plant seat · POT${K}` : "Plant seat",
        children: K != null ? /* @__PURE__ */ s.jsx(
          _o,
          {
            pot: K,
            onSelectPot: (_e) => {
              const Ve = new URLSearchParams(g);
              Ve.set("pot", String(_e)), y(Ve, { replace: !0 });
            }
          }
        ) : null
      }
    )
  ] });
}
function j2() {
  return /* @__PURE__ */ s.jsx(Vb, { tent: "main" });
}
function S2() {
  return /* @__PURE__ */ s.jsx(Vb, { tent: "clone" });
}
const k2 = x.createContext(null);
function N2() {
  const a = x.useContext(k2);
  if (!a)
    throw new Error("BrainProvider missing");
  return a;
}
function $a({
  seatId: a,
  label: i,
  icon: r,
  onPatched: o
}) {
  const d = xt(), h = N2(), f = d.inventory?.find((k) => k.seat_id === a), [m, p] = x.useState(null), [b, v] = x.useState(!1);
  if (!f) return null;
  const g = el(d, a, !!f.in_service), y = m ?? !g, j = async () => {
    v(!0);
    try {
      await nd(a, { in_service: y }), await h.refresh(), o?.();
    } finally {
      v(!1), p(null);
    }
  };
  return /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsxs(
      "button",
      {
        type: "button",
        className: `dsc-demand${g ? " is-on" : ""}`,
        onClick: () => p(!g),
        disabled: b,
        title: `${a} in service`,
        children: [
          r ? /* @__PURE__ */ s.jsx(Zt, { name: r, size: 22, color: "var(--dsc-teal)", className: "dsc-demand-icon" }) : null,
          /* @__PURE__ */ s.jsx("span", { className: "dsc-demand-label", children: i }),
          /* @__PURE__ */ s.jsx("span", { className: "dsc-demand-state", children: g ? "IN" : "OUT" })
        ]
      }
    ),
    /* @__PURE__ */ s.jsx(
      Je,
      {
        open: m !== null,
        onDismiss: () => p(null),
        onConfirm: () => void j(),
        title: y ? `Put ${i} in service` : `Take ${i} out of service`,
        confirmLabel: y ? "Enable" : "Disable",
        help: null,
        children: /* @__PURE__ */ s.jsx("p", { children: y ? `${i} will count toward kit gates and alerts.` : `${i} will be marked out of service — no fake readings.` })
      }
    )
  ] });
}
const C2 = [
  { label: "OUT", prefix: "dsc_cal_cfm_out", reset: "script.dsc_cal_reset_curve_out" },
  { label: "RECIRC", prefix: "dsc_cal_cfm_recirc", reset: "script.dsc_cal_reset_curve_recirc" },
  { label: "Intake Main", prefix: "dsc_cal_cfm_intake_main", reset: "script.dsc_cal_reset_curve_intake_main" },
  { label: "Intake 2×4", prefix: "dsc_cal_cfm_intake_clone", reset: "script.dsc_cal_reset_curve_intake_clone" }
], S_ = [25, 50, 75, 100];
function E2() {
  const { entity: a, state: i } = Te(), { callService: r } = $t(), [o, d] = x.useState(null), h = i("sensor.dsc_learn_status", "—"), f = i("binary_sensor.dsc_learn_gate_open") === "on", m = i("sensor.dsc_learn_activity", "—"), p = String(a("sensor.dsc_cfm_exhaust_out")?.attributes?.cal_curve ?? ""), b = i("sensor.dsc_cfm_curves_status", "—"), v = i("sensor.dsc_learn_phase_b_status", "—"), g = i("input_boolean.dsc_cal_active") === "on", y = String(a("sensor.dsc_learn_status")?.attributes?.trusted_levers ?? "none");
  return /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Anemometer / PPFD cal", icon: "learning", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ s.jsx(O, { label: `Curves ${b}`, tone: b === "—" ? "muted" : "ok" }),
        /* @__PURE__ */ s.jsx(O, { label: g ? "SESSION ON" : "Session idle", tone: g ? "ok" : "muted" })
      ] }),
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
        "Live airflow numbers are on the Climate page. This wizard records only the readings you enter.",
        p ? ` Curve: ${p}` : ""
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", children: [
        /* @__PURE__ */ s.jsx(ae, { variant: "primary", onClick: () => d("gate"), children: "Open gate" }),
        /* @__PURE__ */ s.jsx(ae, { variant: "secondary", onClick: () => d("sample"), children: "Sample points" }),
        /* @__PURE__ */ s.jsx(ae, { variant: "secondary", onClick: () => d("accept"), children: "Finish session" }),
        /* @__PURE__ */ s.jsx(ae, { variant: "secondary", onClick: () => d("curves"), children: "Stored curves" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Climate learn (Phase A/B)", icon: "learning", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ s.jsx(O, { label: `Status ${h}`, tone: h === "—" ? "muted" : "ok" }),
        /* @__PURE__ */ s.jsx(O, { label: f ? "GATE OPEN" : "GATE CLOSED", tone: f ? "ok" : "warn" }),
        /* @__PURE__ */ s.jsx(O, { label: `Activity ${m}`, tone: "muted" }),
        /* @__PURE__ */ s.jsx(O, { label: `B ${v}`, tone: v === "off" || v === "—" ? "muted" : "ok" }),
        /* @__PURE__ */ s.jsx(O, { label: `Trusted ${y}`, tone: "muted" })
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: "One air appliance runs at a time; fans and the heat mat may stay on. Watch the Activity chip — an open gate does not mean it is measuring yet. Phase B stays off until samples start climbing." }),
      /* @__PURE__ */ s.jsx(ae, { variant: "secondary", onClick: () => d("climate"), children: "Learn enable" })
    ] }),
    /* @__PURE__ */ s.jsxs(
      Je,
      {
        open: o === "gate",
        onDismiss: () => d(null),
        onConfirm: () => {
          r("script", "turn_on", { entity_id: "script.dsc_cal_start" }), d("sample");
        },
        title: "Learn gate",
        confirmLabel: "Start session",
        help: null,
        children: [
          /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Pick what to calibrate, then start the session. The hub holds each step steady while you measure." }),
          /* @__PURE__ */ s.jsx(Ha, { entityId: "input_select.dsc_cal_target", label: "Cal target" }),
          /* @__PURE__ */ s.jsx("p", { className: "dsc-kpi-sub", children: i("input_text.dsc_cal_status", "") })
        ]
      }
    ),
    /* @__PURE__ */ s.jsxs(Je, { open: o === "sample", onDismiss: () => d(null), title: "Sample", help: null, children: [
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Enter the anemometer reading in m/s or CFM. If you could not measure a step, skip it. Values save when you leave the field." }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
        /* @__PURE__ */ s.jsx(nt, { entityId: "input_number.dsc_cal_reading_ms", label: "m/s" }),
        /* @__PURE__ */ s.jsx(nt, { entityId: "input_number.dsc_cal_reading_cfm", label: "CFM" }),
        /* @__PURE__ */ s.jsx(nt, { entityId: "input_number.dsc_cal_reading_ppfd", label: "PPFD" }),
        /* @__PURE__ */ s.jsx(nt, { entityId: "input_number.dsc_cal_step_pct", label: "Step %" }),
        /* @__PURE__ */ s.jsx(nt, { entityId: "input_number.dsc_duct_out_cm", label: "OUT duct cm" }),
        /* @__PURE__ */ s.jsx(nt, { entityId: "input_number.dsc_duct_recirc_cm", label: "RECIRC cm" }),
        /* @__PURE__ */ s.jsx(nt, { entityId: "input_number.dsc_duct_intake_main_cm", label: "Intake main cm" }),
        /* @__PURE__ */ s.jsx(nt, { entityId: "input_number.dsc_duct_intake_clone_cm", label: "Intake 2×4 cm" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", children: [
        /* @__PURE__ */ s.jsx(ae, { variant: "secondary", onClick: () => void r("script", "turn_on", { entity_id: "script.dsc_cal_hold_next" }), children: "Re-hold" }),
        /* @__PURE__ */ s.jsx(ae, { variant: "primary", onClick: () => void r("script", "turn_on", { entity_id: "script.dsc_cal_save_point" }), children: "Save point" }),
        /* @__PURE__ */ s.jsx(ae, { variant: "secondary", onClick: () => void r("script", "turn_on", { entity_id: "script.dsc_cal_skip_point" }), children: "Skip" }),
        /* @__PURE__ */ s.jsx(ae, { variant: "danger", onClick: () => void r("script", "turn_on", { entity_id: "script.dsc_cal_abort" }), children: "Abort" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsx(
      Je,
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
      Je,
      {
        open: o === "climate",
        onDismiss: () => d(null),
        onConfirm: () => d(null),
        title: "Climate learn enable",
        confirmLabel: "Done",
        help: null,
        children: [
          /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Turns learning on or off. Learning pauses automatically during failsafe, manual takeover, or a fault." }),
          /* @__PURE__ */ s.jsx(vt, { entityId: "input_boolean.dsc_climate_learn_enabled", label: "Phase A enabled" }),
          /* @__PURE__ */ s.jsx(vt, { entityId: "input_boolean.dsc_climate_learn_phase_b_enabled", label: "Phase B enabled" }),
          /* @__PURE__ */ s.jsx(vt, { entityId: "input_boolean.dsc_learn_phase_b_locked", label: "Phase B lock" }),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
            /* @__PURE__ */ s.jsx(nt, { entityId: "input_number.dsc_learn_alpha", label: "EMA α" }),
            /* @__PURE__ */ s.jsx(nt, { entityId: "input_number.dsc_learn_min_samples", label: "Min samples" })
          ] }),
          /* @__PURE__ */ s.jsxs("p", { className: "dsc-kpi-sub", children: [
            "Gate ",
            f ? "open" : "closed",
            " · ",
            m,
            " · trusted ",
            y
          ] })
        ]
      }
    ),
    /* @__PURE__ */ s.jsxs(Je, { open: o === "curves", onDismiss: () => d(null), title: "Stored curves", help: null, children: [
      /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: "0 means not measured — the hub then estimates from the fan's rated output. Reset clears a curve back to not-measured; it never guesses." }),
      C2.map((j) => /* @__PURE__ */ s.jsxs("div", { className: "dsc-cal-curve", children: [
        /* @__PURE__ */ s.jsx("strong", { children: j.label }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-target-grid", children: S_.map((k) => /* @__PURE__ */ s.jsx(
          nt,
          {
            entityId: `input_number.${j.prefix}_${k}`,
            label: `@${k}%`
          },
          `${j.prefix}_${k}`
        )) }),
        /* @__PURE__ */ s.jsxs(
          ae,
          {
            variant: "danger",
            onClick: () => void r("script", "turn_on", { entity_id: j.reset }),
            children: [
              "Reset ",
              j.label
            ]
          }
        )
      ] }, j.prefix)),
      /* @__PURE__ */ s.jsx("strong", { children: "SF1000 PPFD" }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-target-grid", children: S_.map((j) => /* @__PURE__ */ s.jsx(nt, { entityId: `input_number.dsc_cal_ppfd_${j}`, label: `@${j}%` }, `ppfd_${j}`)) }),
      /* @__PURE__ */ s.jsx(
        ae,
        {
          variant: "danger",
          onClick: () => void r("script", "turn_on", { entity_id: "script.dsc_cal_reset_curve_sf1000" }),
          children: "Reset PPFD"
        }
      )
    ] })
  ] });
}
function T2() {
  const { available: a, num: i, state: r } = Te(), o = r("input_boolean.dsc_tank_in_service") === "on", d = a("input_number.dsc_tank_level_pct") || a("sensor.dsc_tank_level_pct"), h = a("sensor.dsc_tank_level_pct") ? i("sensor.dsc_tank_level_pct") : i("input_number.dsc_tank_level_pct"), f = d && Number.isFinite(h), m = a("sensor.dsc_tank_ec_normalized"), p = a("sensor.dsc_tank_ph_calibrated"), b = a("sensor.water_tester_temperature"), v = r("input_boolean.dsc_tank_pump_active") === "on", g = f ? Math.max(4, Math.min(100, h)) : 0;
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-tank-cutaway", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ s.jsx(O, { label: o ? "In service" : "Out of service", tone: o ? "ok" : "warn" }),
      f ? null : /* @__PURE__ */ s.jsx(O, { label: "Level not measured", tone: "warn" }),
      v ? /* @__PURE__ */ s.jsx(O, { label: "Pump ON", tone: "ok", pulse: !0 }) : /* @__PURE__ */ s.jsx(O, { label: "Pump off", tone: "muted" })
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
      /* @__PURE__ */ s.jsx("rect", { x: "24", y: "18", width: "132", height: "12", fill: "none", stroke: p ? "var(--dsc-purple)" : "var(--dsc-gray-5)", strokeWidth: "3" }),
      v ? [0, 1, 2].map((y) => /* @__PURE__ */ s.jsx("circle", { cx: 90 + (y - 1) * 18, cy: "188", r: "4", fill: "var(--dsc-teal)", opacity: 0.5 + y * 0.15 }, y)) : null
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-kpi-sub", children: [
      "EC ",
      m ? `${Math.round(i("sensor.dsc_tank_ec_normalized"))} µS` : "—",
      " · pH",
      " ",
      p ? i("sensor.dsc_tank_ph_calibrated").toFixed(2) : "—",
      " · T",
      " ",
      b ? `${i("sensor.water_tester_temperature").toFixed(1)} °C` : "—"
    ] })
  ] });
}
const k_ = ["var(--dsc-blue)", "var(--dsc-teal)", "var(--dsc-purple)", "var(--dsc-amber)"];
function M2() {
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Ct,
      {
        icon: "learning",
        title: "Learning",
        subtitle: "Measure fan output, review the sample, then accept it into the curve."
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(E2, {}) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ce, { className: "dsc-glass", title: "Kit / In service", icon: "settings", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-row", children: [
        /* @__PURE__ */ s.jsx($a, { seatId: "pot1", label: "Pot 1", icon: "root" }),
        /* @__PURE__ */ s.jsx($a, { seatId: "pot2", label: "Pot 2", icon: "root" }),
        /* @__PURE__ */ s.jsx($a, { seatId: "pot3", label: "Pot 3", icon: "root" }),
        /* @__PURE__ */ s.jsx($a, { seatId: "pot4", label: "Pot 4", icon: "root" })
      ] }) }) })
    ] })
  ] });
}
function R2() {
  const { state: a } = Te(), { hours: i, setHours: r, maxPoints: o } = ll(6), d = je("sensor.dsc_hub_tent_temperature", { maxPoints: o, hours: i }), h = je("sensor.dsc_hub_tent_humidity", { maxPoints: o, hours: i }), f = je(gn(1, "moisture", a), { maxPoints: o, hours: i }), m = je(gn(2, "moisture", a), { maxPoints: o, hours: i }), p = je(gn(3, "moisture", a), { maxPoints: o, hours: i }), b = je(gn(4, "moisture", a), { maxPoints: o, hours: i }), g = [
    { n: 1, series: f },
    { n: 2, series: m },
    { n: 3, series: p },
    { n: 4, series: b }
  ].filter((j) => Kt(j.n, a)), y = aa.filter((j) => Kt(j, a)).map((j) => ({ n: j, need: a(`sensor.dsc_pot${j}_need_summary`, "—") })).find((j) => j.need && j.need !== "—" && !/^ok$/i.test(j.need));
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Ct,
      {
        icon: "analytics",
        title: "Analytics",
        subtitle: "In-service pots. Climate charts live on Climate; this is the root pack."
      }
    ),
    /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: /* @__PURE__ */ s.jsx(
      rl,
      {
        hours: i,
        setHours: r,
        extras: il
      }
    ) }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Tent T + RH (secondary)", icon: "climate", children: [
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
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Root pack — moisture (in service)", icon: "root", children: [
        g.length ? /* @__PURE__ */ s.jsx(
          jn,
          {
            live: !0,
            unit: "%",
            lastSyncAt: Math.max(...g.map((j) => j.series.lastSyncAt ?? 0)) || void 0,
            series: g.map((j, k) => ({
              id: `p${j.n}`,
              label: y?.n === j.n ? `P${j.n} Need` : `P${j.n}`,
              series: j.series.series,
              color: k_[k % k_.length],
              unit: "%"
            }))
          }
        ) : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "No in-service pots." }),
        y ? /* @__PURE__ */ s.jsxs("p", { className: "dsc-kpi-sub", children: [
          "Worst Need P",
          y.n,
          ": ",
          y.need
        ] }) : null
      ] }) })
    ] })
  ] });
}
function A2() {
  const { state: a, available: i, num: r } = Te(), o = xt(), d = Dn(), h = Ad(o), f = zd(h), m = mt("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available: i,
    num: r
  }), p = (b) => d.open({
    entityId: b.entityId,
    label: b.label,
    kind: "kit",
    runtimeToday: b.runtimeToday,
    cyclesToday: b.cyclesToday,
    demandEntity: b.demandEntity
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Ct,
      {
        icon: "fleet",
        title: "Fleet",
        subtitle: `${f.inService} of ${f.total} devices in service. Device health, tank, and service toggles.`
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(Rd, {}) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(
        Nt,
        {
          label: "In service",
          value: `${f.inService}/${f.total}`,
          tone: f.dark > 0 ? "bad" : "ok"
        }
      ) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(
        Nt,
        {
          label: "Surface",
          value: o.surface || a("sensor.dsc_ha_surface_version", "7.2.0"),
          sub: "Panel product shell"
        }
      ) }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-col-4", children: [
        /* @__PURE__ */ s.jsx(
          Nt,
          {
            label: "Alerts",
            value: Number.isFinite(r("sensor.dsc_active_alert_count")) ? r("sensor.dsc_active_alert_count") : "—",
            tone: r("sensor.dsc_active_alert_count", 0) === 0 ? "ok" : "bad"
          }
        ),
        /* @__PURE__ */ s.jsx(bo, { readings: [m] })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Kit Pulse", icon: "system", children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Grey = offline or out of service. Every device shows its real state." }),
        /* @__PURE__ */ s.jsx(Dd, { nodes: h, onSelect: p })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Kit / In service", icon: "settings", children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "Inventory gates only — wired to Settings inventory PATCH, not dead input_boolean helpers." }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-row", children: [
          /* @__PURE__ */ s.jsx($a, { seatId: "pot1", label: "Pot 1", icon: "root" }),
          /* @__PURE__ */ s.jsx($a, { seatId: "pot2", label: "Pot 2", icon: "root" }),
          /* @__PURE__ */ s.jsx($a, { seatId: "pot3", label: "Pot 3", icon: "root" }),
          /* @__PURE__ */ s.jsx($a, { seatId: "pot4", label: "Pot 4", icon: "root" })
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Tank", icon: "tank", children: [
        /* @__PURE__ */ s.jsx(T2, {}),
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
const z2 = ["1", "6", "11"], D2 = ["ap_ssid", "ap_psk", "ap_channel"], O2 = [
  "ollama_base_url",
  "ollama_model",
  "cannalib_api_url",
  "cannalib_api_key",
  "cannalib_use_local_fallback"
];
function N_(a, i) {
  const r = {};
  for (const o of i)
    a[o] != null && (r[o] = a[o]);
  return r;
}
function H2(a) {
  const i = a.toLowerCase();
  return i === "hub" || i === "control" || i === "panel" ? "Brain & panel" : i.startsWith("pot") ? "Pots" : "Appliances";
}
function L2(a) {
  const i = a.toLowerCase();
  return i === "hub" ? "system" : i === "panel" || i.includes("control") ? "dash" : i.startsWith("pot") ? "root" : i.includes("tank") ? "tank" : i.includes("mister") || i.includes("clone") ? "clone" : i.includes("hum") || i.includes("heater") || i.includes("ac") ? "climate" : i.includes("fan") || i.includes("intake") || i.includes("exhaust") ? "fan" : i.includes("light") || i.includes("sf1000") ? "lighting" : i.includes("mat") ? "root" : "fleet";
}
function $2(a) {
  return a === "Router" ? "system" : "gauge";
}
function U2(a, i) {
  return i === "hub" ? a.hub : i === "panel" || i === "control" ? a.panel : a.pots[i] ? a.pots[i] : a.sonoffs[i] ? a.sonoffs[i] : null;
}
function B2(a) {
  return a == null || !Number.isFinite(a) ? "—" : new Date(a * 1e3).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
function za(a, i) {
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
function F2({
  row: a,
  onSave: i
}) {
  const r = String(a.seat_id ?? ""), [o, d] = x.useState(za(a, "function")), [h, f] = x.useState(za(a, "placement")), [m, p] = x.useState(String(za(a, "capability_max_pct") || ""));
  return x.useEffect(() => {
    d(za(a, "function")), f(za(a, "placement")), p(String(za(a, "capability_max_pct") || ""));
  }, [a]), /* @__PURE__ */ s.jsxs("tr", { children: [
    /* @__PURE__ */ s.jsx("td", { children: r }),
    /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("input", { type: "text", value: o, onChange: (b) => d(b.target.value), placeholder: "e.g. intake_temp" }) }),
    /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("input", { type: "text", value: h, onChange: (b) => f(b.target.value), placeholder: "e.g. 4x8 intake duct" }) }),
    /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("input", { type: "number", min: "1", max: "100", value: m, onChange: (b) => p(b.target.value), placeholder: "100" }) }),
    /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx(ae, { onClick: () => i(r, a, o, h, m), children: "Save" }) })
  ] });
}
function G2({
  row: a,
  seat: i
}) {
  const r = String(a.seat_id ?? "—"), o = String(
    a.role ?? (a.extra && typeof a.extra == "object" ? a.extra.role : "—")
  ), d = i?.online ?? !1, h = !!a.in_service, f = i?.values?.uptime, m = i?.values?.wifi_rssi ?? i?.values?.rssi, p = za(a, "function"), b = za(a, "placement");
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-card", children: [
    /* @__PURE__ */ s.jsxs("h3", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
      /* @__PURE__ */ s.jsx(Zt, { name: L2(r), size: 16, color: "var(--dsc-teal)" }),
      r,
      /* @__PURE__ */ s.jsx(O, { label: d ? "ONLINE" : "OFFLINE", tone: d ? "ok" : "bad" })
    ] }),
    /* @__PURE__ */ s.jsxs("dl", { className: "dsc-detail-list", children: [
      /* @__PURE__ */ s.jsx("dt", { children: "Role" }),
      /* @__PURE__ */ s.jsx("dd", { children: o }),
      /* @__PURE__ */ s.jsx("dt", { children: "IP / host" }),
      /* @__PURE__ */ s.jsx("dd", { children: String(a.host ?? i?.values?.host ?? "—") }),
      /* @__PURE__ */ s.jsx("dt", { children: "MAC" }),
      /* @__PURE__ */ s.jsx("dd", { children: String(a.mac ?? "—") }),
      /* @__PURE__ */ s.jsx("dt", { children: "Firmware" }),
      /* @__PURE__ */ s.jsx("dd", { children: String(i?.firmware ?? i?.values?.firmware_version ?? "—") }),
      /* @__PURE__ */ s.jsx("dt", { children: "Uptime" }),
      /* @__PURE__ */ s.jsx("dd", { children: typeof f == "number" ? `${Math.round(f / 60)} min` : "—" }),
      /* @__PURE__ */ s.jsx("dt", { children: "RSSI" }),
      /* @__PURE__ */ s.jsx("dd", { children: m != null ? `${m} dBm` : "—" }),
      /* @__PURE__ */ s.jsx("dt", { children: "Online" }),
      /* @__PURE__ */ s.jsx("dd", { children: d ? "yes" : "no" }),
      /* @__PURE__ */ s.jsx("dt", { children: "In service" }),
      /* @__PURE__ */ s.jsx("dd", { children: h ? "yes" : "no" }),
      /* @__PURE__ */ s.jsx("dt", { children: "Function" }),
      /* @__PURE__ */ s.jsx("dd", { children: p || "—" }),
      /* @__PURE__ */ s.jsx("dt", { children: "Placement" }),
      /* @__PURE__ */ s.jsx("dd", { children: b || "—" }),
      /* @__PURE__ */ s.jsx("dt", { children: "Last seen" }),
      /* @__PURE__ */ s.jsx("dd", { children: B2(i?.last_seen ?? null) })
    ] })
  ] });
}
function V2() {
  const [a, i] = x.useState({}), [r, o] = x.useState({}), [d, h] = x.useState([]), [f, m] = x.useState(null), [p, b] = x.useState(null), [v, g] = x.useState(null), [y, j] = x.useState([]), [k, T] = x.useState([]), [C, M] = x.useState([]), [E, F] = x.useState(""), [P, K] = x.useState(""), [L, G] = x.useState(""), [ee, le] = x.useState(""), [te, ue] = x.useState(!1), [ie, re] = x.useState(null), [fe, oe] = x.useState(null), [S, z] = x.useState(null), [q, Y] = x.useState(!1), [I, N] = x.useState(null), H = async () => {
    const [Z, ke, Be, _e, Ve, se, Qe] = await Promise.all([
      k0(),
      N0(),
      Vu(),
      T0(),
      R0(),
      S0().catch(() => null),
      O0().catch(() => ({ devices: [] }))
    ]);
    i(N_(Z.settings, D2)), o(N_(Z.settings, O2)), h(Z.inventory), b(ke), g(Be), j(_e.devices ?? []), T(Ve), m(se ? P_(se) : null), M(Qe.devices ?? []);
  };
  x.useEffect(() => {
    H().catch(() => {
    });
  }, []);
  const Q = async () => {
    await Pp(r), await H();
  }, ne = async () => {
    await Pp(a);
  }, pe = async (Z, ke) => {
    await nd(Z, { in_service: ke }), await H();
  }, de = async (Z, ke, Be, _e, Ve) => {
    const se = ke.extra && typeof ke.extra == "object" ? { ...ke.extra } : {};
    se.function = Be, se.placement = _e, Ve && (se.capability_max_pct = Number(Ve)), await nd(Z, { extra: se }), await H();
  }, ve = x.useMemo(
    () => d.map((Z) => ({
      ...Z,
      seat: f ? U2(f, String(Z.seat_id)) : null
    })),
    [d, f]
  ), $e = x.useMemo(() => {
    const Z = /* @__PURE__ */ new Map();
    for (const ke of ve) {
      const Be = H2(String(ke.seat_id)), _e = Z.get(Be) ?? [];
      _e.push(ke), Z.set(Be, _e);
    }
    return Array.from(Z.entries());
  }, [ve]);
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(Ct, { icon: "settings", title: "Settings", subtitle: "DSC-HUB 7.1.0 — Pi appliance" }),
    /* @__PURE__ */ s.jsxs("section", { className: "dsc-card", children: [
      /* @__PURE__ */ s.jsx("h3", { children: "Fleet inventory" }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Every device with its address, firmware, online state, and service status." }),
      $e.map(([Z, ke]) => /* @__PURE__ */ s.jsxs(
        "details",
        {
          className: "dsc-inventory-group",
          open: ke.some(({ seat: Be, in_service: _e }) => !(Be?.online ?? !1) || !_e),
          children: [
            /* @__PURE__ */ s.jsx("summary", { children: Z }),
            /* @__PURE__ */ s.jsx("div", { className: "dsc-grid", children: ke.map(({ seat: Be, ..._e }) => /* @__PURE__ */ s.jsxs("div", { className: "dsc-col-4", children: [
              /* @__PURE__ */ s.jsx(G2, { row: _e, seat: Be }),
              /* @__PURE__ */ s.jsxs("label", { style: { display: "block", marginTop: 8, fontSize: "0.85rem" }, children: [
                /* @__PURE__ */ s.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: !!_e.in_service,
                    onChange: (Ve) => re({ seatId: String(_e.seat_id), next: Ve.target.checked })
                  }
                ),
                " ",
                "In service"
              ] })
            ] }, String(_e.seat_id))) })
          ]
        },
        Z
      )),
      /* @__PURE__ */ s.jsx(
        Je,
        {
          open: ie != null,
          onDismiss: () => re(null),
          onConfirm: async () => {
            if (!ie) return;
            const { seatId: Z, next: ke } = ie;
            re(null), await pe(Z, ke);
          },
          title: ie?.next ? `Put ${ie.seatId} in service` : `Take ${ie?.seatId ?? "device"} out of service`,
          confirmLabel: ie?.next ? "Enable" : "Disable",
          help: null,
          children: /* @__PURE__ */ s.jsx("p", { children: ie?.next ? "The brain will treat this seat as part of the live kit." : "Out-of-service seats stay visible but never fake readings." })
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "dsc-card", children: [
      /* @__PURE__ */ s.jsx("h3", { children: "Device assignment" }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Function and placement tell the brain what each sensor/fan measures. Capability override caps max fan/light output when hardware differs from nameplate." }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-table-scroll", children: /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "Seat" }),
          /* @__PURE__ */ s.jsx("th", { children: "Function" }),
          /* @__PURE__ */ s.jsx("th", { children: "Placement" }),
          /* @__PURE__ */ s.jsx("th", { children: "Max %" }),
          /* @__PURE__ */ s.jsx("th", {})
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: d.map((Z) => /* @__PURE__ */ s.jsx(F2, { row: Z, onSave: de }, String(Z.seat_id))) })
      ] }) })
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "dsc-card", children: [
      /* @__PURE__ */ s.jsx("h3", { children: "Network" }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Channel is limited to 1, 6, or 11. Applying restarts the hub's Wi-Fi — devices reconnect on their own." }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "AP SSID",
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "text",
            value: a.ap_ssid ?? "",
            onChange: (Z) => i({ ...a, ap_ssid: Z.target.value })
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
            onChange: (Z) => i({ ...a, ap_psk: Z.target.value }),
            placeholder: p?.ap_psk_set ? "••••••••" : "set on first save"
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "Channel",
        /* @__PURE__ */ s.jsx(
          "select",
          {
            value: a.ap_channel ?? "6",
            onChange: (Z) => i({ ...a, ap_channel: Z.target.value }),
            children: z2.map((Z) => /* @__PURE__ */ s.jsx("option", { value: Z, children: Z }, Z))
          }
        )
      ] }),
      p?.dhcp_map ? /* @__PURE__ */ s.jsx("div", { className: "dsc-table-scroll", children: /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "Seat" }),
          /* @__PURE__ */ s.jsx("th", { children: "Host" }),
          /* @__PURE__ */ s.jsx("th", { children: "MAC" })
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: p.dhcp_map.map((Z) => /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("td", { children: String(Z.seat_id) }),
          /* @__PURE__ */ s.jsx("td", { children: String(Z.host ?? "—") }),
          /* @__PURE__ */ s.jsx("td", { children: String(Z.mac ?? "—") })
        ] }, String(Z.seat_id))) })
      ] }) }) : null,
      /* @__PURE__ */ s.jsx(ae, { variant: "danger", onClick: () => ue(!0), children: "Apply network" }),
      L ? /* @__PURE__ */ s.jsx("pre", { className: "dsc-honesty", children: L }) : null,
      /* @__PURE__ */ s.jsx(
        Je,
        {
          open: te,
          onDismiss: () => ue(!1),
          onConfirm: async () => {
            ue(!1), await ne();
            const Z = await C0();
            G(JSON.stringify(Z, null, 2)), await H();
          },
          title: "Apply network settings",
          confirmLabel: "Apply and restart Wi-Fi",
          help: null,
          children: /* @__PURE__ */ s.jsx("p", { children: "Saves AP SSID, PSK, and channel only — then restarts the hub's Wi-Fi. Devices drop off briefly and reconnect on their own." })
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
            type: "text",
            value: r.ollama_base_url ?? "",
            onChange: (Z) => o({ ...r, ollama_base_url: Z.target.value }),
            placeholder: "http://192.168.86.2:11434"
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "Ollama model",
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "text",
            value: r.ollama_model ?? "",
            onChange: (Z) => o({ ...r, ollama_model: Z.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ s.jsx(ae, { onClick: async () => F(JSON.stringify(await A0())), children: "Test Ollama" }),
      E ? /* @__PURE__ */ s.jsx("pre", { className: "dsc-honesty", children: E }) : null,
      /* @__PURE__ */ s.jsxs("label", { children: [
        "CannaLib API URL",
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "text",
            value: r.cannalib_api_url ?? "",
            onChange: (Z) => o({ ...r, cannalib_api_url: Z.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "CannaLib API key",
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "password",
            value: r.cannalib_api_key ?? "",
            onChange: (Z) => o({ ...r, cannalib_api_key: Z.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "checkbox",
            checked: (r.cannalib_use_local_fallback ?? "true") === "true",
            onChange: (Z) => o({
              ...r,
              cannalib_use_local_fallback: Z.target.checked ? "true" : "false"
            })
          }
        ),
        "Use on-Pi sqlite fallback when remote API is down"
      ] }),
      /* @__PURE__ */ s.jsx(ae, { onClick: async () => K(JSON.stringify(await z0())), children: "Test CannaLib" }),
      P ? /* @__PURE__ */ s.jsx("pre", { className: "dsc-honesty", children: P }) : null
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "dsc-card", children: [
      /* @__PURE__ */ s.jsx("h3", { children: "Catalog" }),
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
        v ? String(v.note ?? "—") : "Loading…",
        " (source:",
        " ",
        v ? String(v.source ?? "unknown") : "—",
        ")"
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Chemistry, height, and lineage come straight from the catalog — gaps are never filled with guesses." }),
      /* @__PURE__ */ s.jsx(ae, { onClick: async () => g(await Vu()), children: "Refresh status" }),
      /* @__PURE__ */ s.jsx(ae, { onClick: () => Y(!0), children: "Reload local catalogs" }),
      /* @__PURE__ */ s.jsx(
        Je,
        {
          open: q,
          onDismiss: () => Y(!1),
          onConfirm: async () => {
            Y(!1), await E0(), g(await Vu());
          },
          title: "Reload local catalogs",
          confirmLabel: "Reload",
          help: null,
          children: /* @__PURE__ */ s.jsx("p", { children: "Re-reads on-Pi catalog indexes. Compose and Research pick up changes after reload." })
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "dsc-card", children: [
      /* @__PURE__ */ s.jsx("h3", { children: "ESPHome" }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Updates are sent over the air. One build runs at a time, and nothing is flashed unless you queue it." }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Pot 5 and beyond are unavailable until their firmware exists." }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-table-scroll", children: /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "Seat" }),
          /* @__PURE__ */ s.jsx("th", { children: "YAML" }),
          /* @__PURE__ */ s.jsx("th", { children: "Expected" }),
          /* @__PURE__ */ s.jsx("th", { children: "Last seen" }),
          /* @__PURE__ */ s.jsx("th", {})
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: y.map((Z) => /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("td", { children: String(Z.seat_id) }),
          /* @__PURE__ */ s.jsx("td", { children: String(Z.yaml ?? "—") }),
          /* @__PURE__ */ s.jsx("td", { children: String(Z.expected_firmware ?? "—") }),
          /* @__PURE__ */ s.jsx("td", { children: Z.online ? String(Z.last_firmware ?? "online") : "offline" }),
          /* @__PURE__ */ s.jsxs("td", { children: [
            /* @__PURE__ */ s.jsx(ae, { onClick: () => oe({ seatId: String(Z.seat_id), action: "ota" }), children: "Queue OTA" }),
            /* @__PURE__ */ s.jsx(ae, { onClick: () => oe({ seatId: String(Z.seat_id), action: "compile" }), children: "Queue compile" })
          ] })
        ] }, String(Z.seat_id))) })
      ] }) }),
      /* @__PURE__ */ s.jsx(
        Je,
        {
          open: fe != null,
          onDismiss: () => oe(null),
          onConfirm: async () => {
            if (!fe) return;
            const Z = fe;
            oe(null), await M0(Z.seatId, Z.action), await H();
          },
          title: fe?.action === "compile" ? "Queue firmware compile" : "Queue OTA flash",
          confirmLabel: fe?.action === "compile" ? "Queue compile" : "Queue OTA",
          help: null,
          children: /* @__PURE__ */ s.jsxs("p", { children: [
            "Queues an ESPHome ",
            fe?.action === "compile" ? "compile" : "OTA",
            " job for",
            " ",
            /* @__PURE__ */ s.jsx("strong", { children: fe?.seatId ?? "device" }),
            ". Nothing flashes until the build worker runs."
          ] })
        }
      ),
      k.length ? /* @__PURE__ */ s.jsx("pre", { className: "dsc-honesty", children: JSON.stringify(k.slice(0, 3), null, 2) }) : null
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "dsc-card", children: [
      /* @__PURE__ */ s.jsx("h3", { children: "Zigbee (SkyConnect)" }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Extra canopy sensors and smart plugs — separate from climate control." }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", children: [
        /* @__PURE__ */ s.jsx(ae, { onClick: () => z(!0), children: "Permit join (2 min)" }),
        /* @__PURE__ */ s.jsx(ae, { onClick: () => z(!1), children: "Stop join" })
      ] }),
      /* @__PURE__ */ s.jsx(
        Je,
        {
          open: S != null,
          onDismiss: () => z(null),
          onConfirm: async () => {
            const Z = S === !0;
            z(null), await D0(Z), await H();
          },
          title: S ? "Permit Zigbee join" : "Stop Zigbee join",
          confirmLabel: S ? "Permit join" : "Stop join",
          help: null,
          children: /* @__PURE__ */ s.jsx("p", { children: S ? "Opens the coordinator for new devices for about two minutes." : "Closes join mode on the SkyConnect coordinator." })
        }
      ),
      C.length ? /* @__PURE__ */ s.jsx("div", { className: "dsc-table-scroll", children: /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", style: { marginTop: 12 }, children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "Name" }),
          /* @__PURE__ */ s.jsx("th", { children: "IEEE" }),
          /* @__PURE__ */ s.jsx("th", { children: "Type" }),
          /* @__PURE__ */ s.jsx("th", { children: "Model" })
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: C.filter((Z) => Z.type !== "Coordinator").map((Z) => /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsxs("td", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
            /* @__PURE__ */ s.jsx(Zt, { name: $2(String(Z.type ?? "")), size: 14, color: "var(--dsc-gray-5)" }),
            String(Z.friendly_name ?? "—")
          ] }),
          /* @__PURE__ */ s.jsx("td", { children: String(Z.ieee_address ?? "—") }),
          /* @__PURE__ */ s.jsx("td", { children: String(Z.type ?? "—") }),
          /* @__PURE__ */ s.jsxs("td", { children: [
            String(Z.vendor ?? ""),
            Z.model ? ` ${String(Z.model)}` : ""
          ] })
        ] }, String(Z.ieee_address ?? Z.friendly_name))) })
      ] }) }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 10 }, children: "No Zigbee devices reported yet — enable permit join, then refresh." })
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "dsc-card", children: [
      /* @__PURE__ */ s.jsx("h3", { children: "Backup" }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Export ops sqlite, manifest, optional .env and z2m data." }),
      /* @__PURE__ */ s.jsx("a", { className: "dsc-button", href: H0(), download: "dsc-hub-backup.zip", children: "Download backup" }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "Import backup",
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "file",
            accept: ".zip",
            onChange: (Z) => {
              const ke = Z.target.files?.[0];
              ke && N(ke), Z.target.value = "";
            }
          }
        )
      ] }),
      /* @__PURE__ */ s.jsx(
        Je,
        {
          open: I != null,
          onDismiss: () => N(null),
          onConfirm: async () => {
            const Z = I;
            N(null), Z && le(JSON.stringify(await L0(Z)));
          },
          title: "Import backup",
          confirmLabel: "Import",
          help: null,
          children: /* @__PURE__ */ s.jsxs("p", { children: [
            "Restores ops sqlite and related files from ",
            /* @__PURE__ */ s.jsx("strong", { children: I?.name ?? "backup" }),
            ". This overwrites live Pi state."
          ] })
        }
      ),
      ee ? /* @__PURE__ */ s.jsx("pre", { className: "dsc-honesty", children: ee }) : null
    ] }),
    /* @__PURE__ */ s.jsx(ae, { primary: !0, onClick: Q, children: "Save integrations" })
  ] });
}
function qb(a) {
  return !Number.isFinite(a) || a <= 0 ? "—" : a >= 86400 ? `${(a / 86400).toFixed(1)}d` : a >= 3600 ? `${(a / 3600).toFixed(1)}h` : `${Math.round(a / 60)}m`;
}
function C_(a, i, r) {
  return !Number.isFinite(a) || !Number.isFinite(i) || !Number.isFinite(r) ? "?—" : a < i ? `↓ low ${(a - i).toFixed(2)}` : a > r ? `↑ high +${(a - r).toFixed(2)}` : "→ on target";
}
function q2({
  hubOnline: a,
  panelOk: i,
  panelHaOnly: r,
  panelOffline: o,
  heartbeat: d,
  beatOk: h,
  uptimeSec: f,
  alerts: m,
  fleetStatus: p,
  fleetExpected: b,
  cannalibOnline: v,
  cannalibHits: g,
  cannalibSummary: y,
  inServiceLabel: j,
  activeFaultCount: k,
  onChip: T
}) {
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-status-strip", children: [
    /* @__PURE__ */ s.jsx(O, { icon: a ? "ok" : "alert", label: a ? "HUB ONLINE" : "HUB OFFLINE", tone: a ? "ok" : "bad", onClick: () => T?.("sensor.dsc_hub_uptime", "Hub") }),
    /* @__PURE__ */ s.jsx(
      O,
      {
        label: i ? "PANEL LINKED" : r ? "PANEL LIMITED LINK" : o ? "PANEL OFFLINE" : "PANEL…",
        tone: i ? "ok" : r ? "warn" : "bad",
        onClick: () => T?.("binary_sensor.dsc_hub_panel_link", "Panel")
      }
    ),
    /* @__PURE__ */ s.jsx(O, { icon: h ? "ok" : "alert", label: h ? `BEAT ${d}` : "NO BEAT", tone: h ? "ok" : "bad", onClick: () => T?.("sensor.dsc_hub_heartbeat", "Beat") }),
    /* @__PURE__ */ s.jsx(O, { label: qb(f), tone: a ? "ok" : "muted" }),
    /* @__PURE__ */ s.jsx(
      O,
      {
        icon: k === 0 ? "ok" : "alert",
        label: k === 0 ? "All clear" : `${k} alert(s)`,
        tone: k === 0 ? "ok" : "bad",
        pulse: k > 0,
        onClick: () => T?.("sensor.dsc_active_alert_count", "Alerts")
      }
    ),
    /* @__PURE__ */ s.jsx(
      O,
      {
        label: p === "ok" ? `FLEET ${b}` : "FLEET DRIFT",
        tone: p === "ok" ? "ok" : "warn",
        onClick: () => T?.("sensor.dsc_fleet_version_status", "Fleet")
      }
    ),
    /* @__PURE__ */ s.jsx(
      O,
      {
        label: v ? `CANNALIB ${g} hits` : "CANNALIB OFF",
        tone: v ? "ok" : "bad",
        onClick: () => T?.("sensor.dsc_cannalib_api_hits", "Cannalib")
      }
    ),
    /* @__PURE__ */ s.jsx(O, { label: v ? y : "— MB", tone: "muted" }),
    /* @__PURE__ */ s.jsx(O, { label: j, tone: "muted" })
  ] });
}
function Y2({ bus: a }) {
  const { num: i, available: r } = a, o = a.state("binary_sensor.dsc_cannalib_api_online") === "on", d = [
    { label: "Hits", id: "sensor.dsc_cannalib_api_hits", fmt: (h) => String(Math.round(h)) },
    { label: "Bandwidth in", id: "sensor.dsc_cannalib_bytes_in", fmt: (h) => `${(h / 1024).toFixed(1)} KB` },
    { label: "Bandwidth out", id: "sensor.dsc_cannalib_bytes_out", fmt: (h) => `${(h / 1024).toFixed(1)} KB` },
    { label: "Corpus strains", id: "sensor.dsc_cannalib_corpus_strains", fmt: (h) => String(Math.round(h)) }
  ];
  return /* @__PURE__ */ s.jsx(ce, { className: "dsc-glass", title: "Cannalib catalog API", icon: "research", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: d.map((h) => /* @__PURE__ */ s.jsx(
    Nt,
    {
      label: h.label,
      value: o && r(h.id) ? h.fmt(i(h.id, 0)) : "—",
      tone: o ? "ok" : "muted"
    },
    h.id
  )) }) });
}
function Yb({ bus: a, onNavigate: i }) {
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
function X2({ bus: a, onNavigate: i }) {
  return /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: [1, 2, 3, 4].map((r) => {
    const o = a.state(`binary_sensor.dsc_hub_pot${r}_esp_now_link`) === "on";
    return /* @__PURE__ */ s.jsx(
      O,
      {
        label: `P${r} ${o ? "direct" : "fallback"}`,
        tone: o ? "ok" : "muted",
        onClick: () => i("/live/root")
      },
      r
    );
  }) });
}
function Xb({ bus: a }) {
  const { state: i, num: r } = a, o = r("sensor.dsc_coldest_root_zone_temp", NaN), d = String(a.entity("sensor.dsc_coldest_root_zone_temp")?.attributes?.pot || ""), h = a.entity("light.dsc_hub_sf1000_dimmer"), f = Math.round(Number(h?.attributes?.brightness ?? 0) / 255 * 100), m = i("light.dsc_hub_sf1000_dimmer") === "on" && f >= 1, p = f, b = i("binary_sensor.dsc_ac_capacity_offline") === "on", v = i("binary_sensor.dsc_clone_humidifier_capacity_offline") === "on", g = !a.available("switch.dsc_de_humidifier_main_relay"), y = i("binary_sensor.dsc_hub_root_zone_sensor_fault") === "on", j = i("binary_sensor.dsc_clone_dark_period_violation") === "on", k = [
    { label: "Heat", icon: "climate", on: i("switch.dsc_hub_heater_demand") === "on", tone: i("switch.dsc_hub_heater_demand") === "on" ? "ok" : "muted" },
    { label: b ? "Cool ○" : "Cool", icon: "climate", on: i("switch.dsc_hub_ac_demand") === "on", tone: b ? "warn" : i("switch.dsc_hub_ac_demand") === "on" ? "ok" : "muted" },
    { label: "Hum", icon: "tank", on: i("switch.dsc_hub_humidifier_demand") === "on", tone: i("switch.dsc_hub_humidifier_demand") === "on" ? "ok" : "muted" },
    { label: g ? "Dehum offline" : "Dehum", icon: "tank", on: i("switch.dsc_hub_dehumidifier_demand") === "on", tone: g ? "bad" : i("switch.dsc_hub_dehumidifier_demand") === "on" ? "ok" : "muted" },
    {
      label: Number.isFinite(o) ? `Mat ${o.toFixed(1)}°C${d && d !== "none" ? ` P${d}` : ""}` : "Mat",
      icon: "root",
      on: i("switch.dsc_hub_grow_mat_demand") === "on",
      tone: y ? "bad" : i("switch.dsc_hub_grow_mat_demand") === "on" ? "ok" : "muted"
    },
    { label: v ? "C-Hum ○" : "C-Hum", icon: "clone", on: i("switch.dsc_hub_clone_humidifier_demand") === "on", tone: v ? "warn" : i("switch.dsc_hub_clone_humidifier_demand") === "on" ? "ok" : "muted" },
    { label: m ? `SF ${p}%` : "SF1000", icon: "lighting", on: m, tone: j ? "bad" : m ? "ok" : "muted" }
  ];
  return /* @__PURE__ */ s.jsx(ce, { className: "dsc-glass", title: "Running", icon: "lighting", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: k.map((T) => /* @__PURE__ */ s.jsx(O, { label: T.label, icon: T.icon, tone: T.tone, motion: T.on ? "duty" : void 0 }, T.label)) }) });
}
function Qb({ bus: a, onNavigate: i }) {
  const r = [
    ["IN 4×8", "sensor.dsc_fan_intake_main_pct"],
    ["IN 2×4", "sensor.dsc_fan_intake_2x4_pct"],
    ["EX ROOM", "sensor.dsc_fan_exhaust_room_pct"],
    ["EX OUT", "sensor.dsc_fan_exhaust_outside_pct"]
  ];
  return /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: r.map(([o, d]) => {
    const h = Math.round(a.num(d, 0));
    return /* @__PURE__ */ s.jsx(
      O,
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
function Fr(a, i) {
  const r = Number(a);
  if (Number.isFinite(r)) return r.toFixed(1);
  const o = Number(i);
  return Number.isFinite(o) ? o.toFixed(1) : a;
}
function Q2({ bus: a, onNavigate: i }) {
  const { state: r, num: o } = a, d = r("select.dsc_hub_clone_mode") === "Follow 4x8", h = r("select.dsc_hub_priority_tent", "—"), f = r("switch.dsc_hub_manual_takeover") === "on" ? "Takeover" : r("switch.dsc_hub_tent_manual_override") === "on" ? "Fan override" : r("switch.dsc_hub_tent_full_auto_mode") === "on" ? "Full Auto" : "Standby", m = Fr(r("sensor.dsc_hub_tent_temperature", "—"), o("sensor.dsc_hub_tent_temperature", NaN)), p = Fr(r("sensor.dsc_hub_tent_humidity", "—"), o("sensor.dsc_hub_tent_humidity", NaN)), b = o("sensor.dsc_hub_vpd_kpa", NaN), v = Fr(r("sensor.dsc_hub_clone_temperature", "—"), o("sensor.dsc_hub_clone_temperature", NaN)), g = Fr(r("sensor.dsc_hub_clone_humidity", "—"), o("sensor.dsc_hub_clone_humidity", NaN)), y = o("sensor.dsc_hub_clone_vpd_kpa", NaN), j = d ? o("number.dsc_hub_vpd_target_min", 0.8) : o("number.dsc_hub_clone_vpd_min", 0.6), k = d ? o("number.dsc_hub_vpd_target_max", 1.4) : o("number.dsc_hub_clone_vpd_max", 1.2), T = [
    ["Hum", "sensor.dsc_hub_humidifier_fire_countdown", "switch.dsc_hub_humidifier_demand"],
    ["Dehum", "sensor.dsc_hub_dehumidifier_fire_countdown", "switch.dsc_hub_dehumidifier_demand"],
    ["Heat", "sensor.dsc_hub_heater_fire_countdown", "switch.dsc_hub_heater_demand"],
    ["AC", "sensor.dsc_hub_ac_fire_countdown", "switch.dsc_hub_ac_demand"],
    ["Mat", "sensor.dsc_hub_grow_mat_fire_countdown", "switch.dsc_hub_grow_mat_demand"]
  ], C = Math.round(a.num("sensor.dsc_fan_exhaust_outside_pct", 0)), M = Math.round(a.num("sensor.dsc_fan_exhaust_room_pct", 0));
  return /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Operational now", icon: "climate", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 10 }, children: [
      /* @__PURE__ */ s.jsx(O, { label: r("select.dsc_hub_grow_stage", "—"), tone: "ok" }),
      /* @__PURE__ */ s.jsx(O, { label: r("select.dsc_hub_clone_mode", "—"), tone: "ok" }),
      /* @__PURE__ */ s.jsx(O, { label: r("select.dsc_hub_control_strategy", "—"), tone: "muted" }),
      /* @__PURE__ */ s.jsx(O, { label: `Priority ${h}`, tone: "muted" }),
      /* @__PURE__ */ s.jsx(O, { label: f, tone: f === "Full Auto" ? "ok" : f === "Standby" ? "muted" : "warn" })
    ] }),
    /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { fontSize: 13, lineHeight: 1.5 }, children: [
      /* @__PURE__ */ s.jsx("strong", { children: "4×8" }),
      " ",
      m,
      "°C / ",
      p,
      "% / VPD ",
      Number.isFinite(b) ? b.toFixed(2) : "—",
      " (",
      C_(b, o("number.dsc_hub_vpd_target_min", 0.8), o("number.dsc_hub_vpd_target_max", 1.4)),
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
      Number.isFinite(y) ? y.toFixed(2) : "—",
      d ? " (follows 4×8 bands)" : "",
      " (",
      C_(y, j, k),
      ")",
      /* @__PURE__ */ s.jsx("br", {}),
      "Room appliances chase ",
      /* @__PURE__ */ s.jsx("strong", { children: h }),
      " bands."
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginTop: 10 }, children: [
      T.map(([E, F, P]) => {
        const K = r(P) === "on", L = Math.round(a.num(F, 0)), G = K ? `${E} live` : L > 0 ? `${E} ${L}s` : `${E} idle`;
        return /* @__PURE__ */ s.jsx(
          O,
          {
            label: G,
            tone: K ? "ok" : L > 0 ? "warn" : "muted",
            motion: K ? "duty" : L > 0 ? "breathe" : void 0,
            onClick: () => i("/live/climate")
          },
          F
        );
      }),
      /* @__PURE__ */ s.jsx(
        O,
        {
          label: `Fans ${C}/${M}%`,
          tone: C > 0 || M > 0 ? "ok" : "muted",
          motion: C > 0 || M > 0 ? "fan" : void 0,
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
  const { points: m } = Td(a, 24, 96), p = mi({
    value: o,
    band: d,
    margin: mo(d, f),
    stale: !!(h && Number.isFinite(o)),
    available: Number.isFinite(o)
  });
  return /* @__PURE__ */ s.jsxs("div", { className: `dsc-band-cell${i ? ` dsc-band-cell--${i}` : ""}`, children: [
    r,
    /* @__PURE__ */ s.jsx(Tb, { series: m, color: Ed(p), width: 110, height: 26 })
  ] });
}
const Z2 = [
  { id: "compare", label: "All" },
  { id: "main", label: "4×8" },
  { id: "clone", label: "2×4" },
  { id: "room", label: "Room" }
];
function Zb({
  readings: a,
  onChartOpen: i
}) {
  const r = a, { focus: o, setFocus: d } = Md(), h = (f) => o === "compare" || o === f ? "dsc-gauge-row-3 is-lit" : "dsc-gauge-row-3";
  return /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Bands", icon: "gauge", children: [
    /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { fontSize: 12, margin: "0 0 10px" }, children: "Green = in band · amber = drifting · red = alert · grey = no data" }),
    /* @__PURE__ */ s.jsx("div", { className: "dsc-tent-segment", style: { marginBottom: 10 }, children: Z2.map((f) => /* @__PURE__ */ s.jsx(
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
            gauge: /* @__PURE__ */ s.jsx(Ke, { label: "4×8 T", value: r.tentT, min: 10, max: 40, unit: "°C", target: r.targetTemp, band: { min: r.targetTemp - 2, max: r.targetTemp + 2 }, segments: ii(r.targetTemp), stale: r.stale.tentT, onClick: () => i("temp") })
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
            gauge: /* @__PURE__ */ s.jsx(Ke, { label: "4×8 RH", value: r.tentRh, min: 0, max: 100, unit: "%", band: { min: r.rhMin, max: r.rhMax }, segments: ri(r.rhMin, r.rhMax), stale: r.stale.tentRh, onClick: () => i("rh") })
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
            gauge: /* @__PURE__ */ s.jsx(Ke, { label: "4×8 VPD", value: r.tentVpd, min: 0, max: 2.5, unit: "kPa", band: { min: r.vpdMin, max: r.vpdMax }, segments: ao(r.vpdMin, r.vpdMax), stale: r.stale.tentVpd, onClick: () => i("vpd") })
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
            gauge: /* @__PURE__ */ s.jsx(Ke, { label: "2×4 T", value: r.cloneT, min: 10, max: 40, unit: "°C", target: r.cloneTargetTemp, band: { min: r.cloneTargetTemp - 2, max: r.cloneTargetTemp + 2 }, segments: ii(r.cloneTargetTemp), stale: r.stale.cloneT, onClick: () => i("temp") })
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
            gauge: /* @__PURE__ */ s.jsx(Ke, { label: "2×4 RH", value: r.cloneRh, min: 0, max: 100, unit: "%", band: { min: r.cloneRhMin, max: r.cloneRhMax }, segments: ri(r.cloneRhMin, r.cloneRhMax), stale: r.stale.cloneRh, onClick: () => i("rh") })
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
            gauge: /* @__PURE__ */ s.jsx(Ke, { label: "2×4 VPD", value: r.cloneVpd, min: 0, max: 2, unit: "kPa", band: { min: r.cloneVpdMin, max: r.cloneVpdMax }, segments: ao(r.cloneVpdMin, r.cloneVpdMax), stale: r.stale.cloneVpd, onClick: () => i("vpd") })
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
            gauge: /* @__PURE__ */ s.jsx(Ke, { label: "Room T", value: r.roomT, min: 10, max: 40, unit: "°C", target: r.targetTemp, band: { min: r.targetTemp - 2, max: r.targetTemp + 2 }, segments: ii(r.targetTemp), stale: r.stale.roomT, onClick: () => i("temp") })
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
            gauge: /* @__PURE__ */ s.jsx(Ke, { label: "Room RH", value: r.roomRh, min: 0, max: 100, unit: "%", band: { min: r.rhMin, max: r.rhMax }, segments: ri(r.rhMin, r.rhMax), stale: r.stale.roomRh, onClick: () => i("rh") })
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
            gauge: /* @__PURE__ */ s.jsx(Ke, { label: "Root", value: r.rootT, min: 10, max: 32, unit: "°C", band: { min: r.matLo, max: r.matHi }, segments: m2(r.matLo, r.matHi), stale: r.stale.rootT, onClick: () => i("root") })
          }
        )
      ] })
    ] })
  ] });
}
function K2({ bus: a }) {
  const { num: i, state: r } = a, o = Math.round(i("sensor.dsc_humidifier_cycles_last_hour", 0)), d = o > 6 ? "bad" : o > 3 ? "warn" : "ok";
  return /* @__PURE__ */ s.jsx(ce, { className: "dsc-glass", title: "Today", icon: "lighting", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
    /* @__PURE__ */ s.jsx(
      O,
      {
        label: `4×8 ${i("sensor.dsc_lights_on_today_4x8", 0).toFixed(1)}h / ${Math.round(i("sensor.dsc_expected_light_hours", 12))}h`,
        tone: r("binary_sensor.dsc_hub_4x8_window_open") === "on" ? "ok" : "muted",
        onClick: () => {
        }
      }
    ),
    /* @__PURE__ */ s.jsx(
      O,
      {
        label: `2×4 ${i("sensor.dsc_lights_on_today_2x4", 0).toFixed(1)}h / ${Math.round(i("sensor.dsc_clone_expected_light_hours", 12))}h`,
        tone: r("binary_sensor.dsc_clone_dark_period_violation") === "on" ? "bad" : "ok"
      }
    ),
    /* @__PURE__ */ s.jsx(O, { label: `Heat ${i("sensor.dsc_heater_runtime_today", 0).toFixed(1)}h`, tone: r("switch.dsc_hub_heater_demand") === "on" ? "ok" : "muted" }),
    /* @__PURE__ */ s.jsx(O, { label: `Hum ${o}/h`, tone: d })
  ] }) });
}
function Kb({
  bus: a,
  rosterSlots: i,
  onNavigate: r,
  onPot: o,
  onPotChart: d
}) {
  const { state: h, num: f } = a, m = { min: 30, max: 70 };
  return /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Root & tank", icon: "root", children: [
    /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: [1, 2, 3, 4].map((p) => {
      const b = h(`text.dsc_pot${p}_plant_name`, "—"), v = !b || b === "unknown" || b === "unavailable" ? "—" : b;
      return /* @__PURE__ */ s.jsx(O, { label: `P${p} ${v}`, tone: v === "—" ? "muted" : "ok", onClick: () => o(p) }, p);
    }) }),
    i.some((p) => p.pot && p.pot !== "none") ? /* @__PURE__ */ s.jsx("div", { className: "dsc-muted", style: { fontSize: 13, margin: "8px 0" }, children: ["1", "2", "3", "4"].map((p) => {
      const b = i.find((v) => String(v.pot) === p);
      return b ? /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsxs("strong", { children: [
          "POT",
          p,
          " roster:"
        ] }),
        " ",
        b.nickname || b.strain || `slot ${b.slot}`,
        b.blend ? ` · ${b.blend}` : ""
      ] }, p) : null;
    }) }) : null,
    /* @__PURE__ */ s.jsx("div", { className: "dsc-gauge-matrix dsc-gauge-matrix--pots", children: [1, 2, 3, 4].map((p) => /* @__PURE__ */ s.jsx(
      Ke,
      {
        label: `P${p}`,
        value: f(`sensor.dsc_pot${p}_soil_moisture`, NaN),
        min: 0,
        max: 100,
        unit: "%",
        band: m,
        segments: rd(30, 70),
        onClick: () => d(`pot${p}`)
      },
      p
    )) }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginTop: 10 }, children: [
      a.available("sensor.water_tester_ph_current") ? /* @__PURE__ */ s.jsx(O, { label: `pH ${h("sensor.water_tester_ph_current")}`, tone: "ok", onClick: () => r("/fleet") }) : null,
      /* @__PURE__ */ s.jsx(O, { label: `EC ${h("sensor.dsc_tank_ec_normalized", "—")}`, tone: "muted" }),
      a.available("sensor.water_tester_temperature") ? /* @__PURE__ */ s.jsx(
        O,
        {
          label: `${h("sensor.water_tester_temperature")}°C${f("sensor.water_tester_temperature", 0) > 24 ? " ⚠ PYTHIUM" : ""}`,
          tone: f("sensor.water_tester_temperature", 0) > 24 ? "bad" : "ok"
        }
      ) : null,
      /* @__PURE__ */ s.jsx(O, { label: "Open Root Zone", tone: "ok", onClick: () => r("/live/root") })
    ] })
  ] });
}
function Jb({ bus: a }) {
  const { state: i } = a, [r, o] = x.useState([]), [d, h] = x.useState(!0);
  x.useEffect(() => {
    let m = !1;
    const p = () => {
      y0(24, 80).then((v) => {
        m || (o(v), h(!1));
      });
    };
    p();
    const b = window.setInterval(p, 45e3);
    return () => {
      m = !0, window.clearInterval(b);
    };
  }, [i("select.dsc_hub_grow_stage"), i("switch.dsc_hub_dehumidifier_demand")]);
  const f = [
    i("select.dsc_hub_grow_stage") !== "—" ? `Stage · ${i("select.dsc_hub_grow_stage")}` : null,
    i("binary_sensor.dsc_clone_dark_period_violation") === "on" ? "Dark period violation" : null
  ].filter(Boolean);
  return /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Grow log", icon: "roster", children: [
    d && r.length === 0 ? /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Loading…" }) : null,
    r.length ? /* @__PURE__ */ s.jsx("ul", { className: "dsc-grow-log", children: r.map((m) => /* @__PURE__ */ s.jsxs("li", { children: [
      /* @__PURE__ */ s.jsx("time", { className: "dsc-muted", dateTime: new Date(m.ts * 1e3).toISOString(), children: new Date(m.ts * 1e3).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }),
      " ",
      m.message
    ] }, m.id)) }) : f.length ? /* @__PURE__ */ s.jsx("ul", { className: "dsc-grow-log", children: f.map((m) => /* @__PURE__ */ s.jsx("li", { children: m }, m)) }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "No operational events yet today." })
  ] });
}
function Pb(a, i) {
  return Ob.filter((r) => a(r) === "on" && !i(r));
}
function J2() {
  const a = Te(), { num: i, state: r, entity: o, tick: d } = a, h = xt(), f = pt(), { isSnoozed: m } = po(), p = Ub(), b = (Y) => p.open({ kind: Y, title: Bb[Y] }), v = i("sensor.dsc_active_alert_count", 0), g = Pb(r, m), y = ge("sensor.dsc_hub_tent_temperature"), j = ge("sensor.dsc_hub_tent_humidity"), k = ge("sensor.dsc_hub_vpd_kpa"), T = ge("sensor.dsc_hub_clone_temperature"), C = ge("sensor.dsc_hub_clone_humidity"), M = ge("sensor.dsc_hub_clone_vpd_kpa"), E = ge("sensor.dsc_hub_room_temperature"), F = ge("sensor.dsc_hub_room_humidity"), P = ge("sensor.dsc_coldest_root_zone_temp"), K = i("number.dsc_hub_target_temp", 25), L = i("number.dsc_hub_rh_target_min", 45), G = i("number.dsc_hub_rh_target_max", 70), ee = i("number.dsc_hub_vpd_target_min", 0.8), le = i("number.dsc_hub_vpd_target_max", 1.4), te = i("number.dsc_hub_clone_target_temp", 24), ue = i("number.dsc_hub_clone_rh_min", 55), ie = i("number.dsc_hub_clone_rh_max", 75), re = i("number.dsc_hub_clone_vpd_min", 0.6), fe = i("number.dsc_hub_clone_vpd_max", 1.2), oe = i("number.dsc_hub_mat_root_zone_low", 20), S = i("number.dsc_hub_mat_root_zone_high", 24), z = o("sensor.dsc_plant_roster_summary")?.attributes?.slots || [], q = (Y) => {
    window.dispatchEvent(new CustomEvent("dsc-dash-select-pot", { detail: { pot: Y } })), f("/live/root");
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page dsc-dash-home", children: [
    /* @__PURE__ */ s.jsx(
      Ct,
      {
        icon: "home",
        title: "Overview",
        subtitle: "Operational glance — alerts, area vitals, duties, root strip, grow log.",
        primaryAction: /* @__PURE__ */ s.jsx(ae, { teal: !0, onClick: () => f("/live/climate"), children: "Climate" }),
        actions: /* @__PURE__ */ s.jsx(ae, { onClick: () => f("/live/mission"), children: "Mission" })
      }
    ),
    g.length > 0 || v > 0 ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-banner dsc-banner--bad", style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ s.jsx("strong", { children: g.length > 0 ? `${g.length} critical alert(s) active` : `${v} system alert(s)` }),
      /* @__PURE__ */ s.jsx("ul", { className: "dsc-fault-list", style: { marginTop: 8 }, children: g.slice(0, 6).map((Y) => {
        const I = D1(Y), N = Db(Y, "alert").title;
        return /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx(
          O,
          {
            label: N,
            tone: "bad",
            pulse: !0,
            icon: "alert",
            onClick: () => f(I.href)
          }
        ) }, Y);
      }) })
    ] }) : null,
    /* @__PURE__ */ s.jsx(Yb, { bus: a, onNavigate: f }),
    /* @__PURE__ */ s.jsx(
      Zb,
      {
        readings: {
          tentT: y.value,
          tentRh: j.value,
          tentVpd: k.value,
          cloneT: T.value,
          cloneRh: C.value,
          cloneVpd: M.value,
          roomT: E.value,
          roomRh: F.value,
          rootT: P.value,
          targetTemp: K,
          rhMin: L,
          rhMax: G,
          vpdMin: ee,
          vpdMax: le,
          cloneTargetTemp: te,
          cloneRhMin: ue,
          cloneRhMax: ie,
          cloneVpdMin: re,
          cloneVpdMax: fe,
          matLo: oe,
          matHi: S,
          stale: {
            tentT: y.stale,
            tentRh: j.stale,
            tentVpd: k.stale,
            cloneT: T.stale,
            cloneRh: C.stale,
            cloneVpd: M.stale,
            roomT: E.stale,
            roomRh: F.stale,
            rootT: P.stale
          }
        },
        onChartOpen: b
      }
    ),
    /* @__PURE__ */ s.jsx(ce, { className: "dsc-glass", title: "Fan duties", icon: "fan", children: /* @__PURE__ */ s.jsx(Qb, { bus: a, onNavigate: f }) }),
    /* @__PURE__ */ s.jsx(Xb, { bus: a }),
    /* @__PURE__ */ s.jsx(
      Kb,
      {
        bus: a,
        rosterSlots: z,
        onNavigate: f,
        onPot: q,
        onPotChart: b
      }
    ),
    /* @__PURE__ */ s.jsx(Jb, { bus: a }),
    /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { fontSize: 12, marginTop: 8 }, children: [
      "Fleet ",
      h.version,
      " · expected ",
      h.expected_firmware
    ] })
  ] });
}
const E_ = [
  { id: "out", label: "OUT exhaust", prefix: "dsc_cal_cfm_out", select: "OUT" },
  { id: "recirc", label: "RECIRC", prefix: "dsc_cal_cfm_recirc", select: "RECIRC" },
  { id: "intake_main", label: "Intake 4×8", prefix: "dsc_cal_cfm_intake_main", select: "Intake Main" },
  { id: "intake_clone", label: "Intake 2×4", prefix: "dsc_cal_cfm_intake_clone", select: "Intake 2×4" }
], Ra = [25, 50, 75, 100], os = [
  { key: "25", pct: 25, label: "25% dim" },
  { key: "50", pct: 50, label: "50% dim" },
  { key: "75", pct: 75, label: "75% dim" },
  { key: "100", pct: 100, label: "100% dim" }
];
function P2() {
  const { state: a, num: i } = Te(), { callService: r } = $t(), [o, d] = x.useState("pick"), [h, f] = x.useState(0), [m, p] = x.useState(0), [b, v] = x.useState(""), [g, y] = x.useState(!1), [j, k] = x.useState(""), [T, C] = x.useState(!1), M = E_[h], E = Ra[m], F = a("input_boolean.dsc_cal_active") === "on", P = a("sensor.dsc_cfm_curves_status", "—"), K = x.useCallback(() => {
    d("pick"), f(0), p(0), v(""), k("");
  }, []);
  x.useEffect(() => {
  }, [F, o, m, g]);
  const L = async () => {
    y(!0), k("Starting cal session…");
    try {
      await r("input_select", "select_option", {
        entity_id: "input_select.dsc_cal_target",
        option: M.select
      }), await r("script", "turn_on", { entity_id: "script.dsc_cal_start" }), d("session"), p(0), v(""), k(`Hold fan at ${Ra[0]}% — enter anemometer m/s.`);
    } catch (te) {
      k(te instanceof Error ? te.message : "Start failed");
    } finally {
      y(!1);
    }
  }, G = async () => {
    const te = Number(b);
    if (!Number.isFinite(te) || te <= 0) {
      k("Enter a valid m/s reading, or skip this step.");
      return;
    }
    y(!0), k(`Saving @${E}%…`);
    try {
      await r("input_number", "set_value", {
        entity_id: "input_number.dsc_cal_step_pct",
        value: E
      }), await r("input_number", "set_value", {
        entity_id: "input_number.dsc_cal_reading_ms",
        value: te
      }), await r("script", "turn_on", { entity_id: "script.dsc_cal_save_point" }), await r("input_number", "set_value", {
        entity_id: `input_number.${M.prefix}_${E}`,
        value: te
      }), await sb(M.prefix, "fan_cfm", [
        { step_key: String(E), measured_value: te, unit: "m/s" }
      ]);
      const ue = m + 1;
      ue >= Ra.length ? (await r("script", "turn_on", { entity_id: "script.dsc_cal_finish" }), d("done"), k(`Curve points saved for ${M.label}. Status: ${P}`)) : (p(ue), v(""), k(`Point @${E}% saved. Hold fan at ${Ra[ue]}% and measure.`), await r("script", "turn_on", { entity_id: "script.dsc_cal_hold_next" }));
    } catch (ue) {
      k(ue instanceof Error ? ue.message : "Save failed");
    } finally {
      y(!1);
    }
  }, ee = async () => {
    y(!0);
    try {
      await r("script", "turn_on", { entity_id: "script.dsc_cal_skip_point" });
      const te = m + 1;
      te >= Ra.length ? (await r("script", "turn_on", { entity_id: "script.dsc_cal_finish" }), d("done"), k("Session finished (skipped remaining).")) : (p(te), v(""), k(`Skipped @${E}%. Next: ${Ra[te]}%.`));
    } finally {
      y(!1);
    }
  }, le = async () => {
    y(!0);
    try {
      await r("script", "turn_on", { entity_id: "script.dsc_cal_abort" }), K(), k("Session aborted — fans restored.");
    } finally {
      y(!1);
    }
  };
  return /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-status-strip", children: [
      /* @__PURE__ */ s.jsx(O, { label: `Curves ${P}`, tone: P === "all_curves" ? "ok" : "warn" }),
      /* @__PURE__ */ s.jsx(O, { label: F ? "SESSION ON" : "Session idle", tone: F ? "ok" : "muted" }),
      o === "session" ? /* @__PURE__ */ s.jsx(O, { label: `Step ${m + 1}/${Ra.length} · ${E}%`, tone: "ok", pulse: !0 }) : null
    ] }),
    o === "pick" ? /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "1 · Select duct", icon: "fan", children: [
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Hold the anemometer at the centre of the duct at each fan step. At least two measured points per duct are needed before real curves replace the rated estimate." }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", style: { margin: "12px 0" }, children: E_.map((te, ue) => /* @__PURE__ */ s.jsx(
        "button",
        {
          type: "button",
          className: `dsc-chip${h === ue ? " dsc-chip--ok" : ""}`,
          onClick: () => f(ue),
          children: te.label
        },
        te.id
      )) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-row-actions", children: /* @__PURE__ */ s.jsxs(ae, { variant: "primary", disabled: g, onClick: () => C(!0), children: [
        "Start ",
        M.label,
        " session"
      ] }) }),
      /* @__PURE__ */ s.jsx(
        Je,
        {
          open: T,
          onDismiss: () => C(!1),
          onConfirm: () => {
            C(!1), L();
          },
          title: `Start ${M.label} calibration`,
          confirmLabel: "Start session",
          help: null,
          children: /* @__PURE__ */ s.jsxs("p", { children: [
            "The hub will hold the ",
            M.label,
            " fan at stepped duties while you measure. Fans run until you finish or abort."
          ] })
        }
      )
    ] }) : null,
    o === "session" ? /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: `2 · Sample ${M.label} @ ${E}%`, icon: "gauge", children: [
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
        "Set the fan to ",
        E,
        "%. Hold the anemometer at the duct centreline and enter the measured m/s — CFM is calculated for you."
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "Anemometer m/s @ ",
        E,
        "%",
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "number",
            step: "0.01",
            min: "0",
            value: b,
            onChange: (te) => v(te.target.value),
            placeholder: i("input_number.dsc_cal_reading_ms", 0) > 0 ? String(i("input_number.dsc_cal_reading_ms")) : "e.g. 3.2"
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-kpi-sub", children: [
        "Saved to the ",
        M.label,
        " curve at ",
        E,
        "%."
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-stage-track", children: Ra.map((te, ue) => /* @__PURE__ */ s.jsxs("span", { className: `dsc-stage-pill${ue === m ? " is-on" : ue > m ? "" : " is-next"}`, children: [
        te,
        "%"
      ] }, te)) }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", children: [
        /* @__PURE__ */ s.jsxs(ae, { variant: "primary", disabled: g, onClick: () => void G(), children: [
          "Save @ ",
          E,
          "%"
        ] }),
        /* @__PURE__ */ s.jsx(ae, { variant: "secondary", disabled: g, onClick: () => void ee(), children: "Skip step" }),
        /* @__PURE__ */ s.jsx(ae, { variant: "danger", disabled: g, onClick: () => void le(), children: "Abort" })
      ] })
    ] }) : null,
    o === "done" ? /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "3 · Done", icon: "ok", children: [
      /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: j || "Session complete." }),
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", children: [
        "Curve status: ",
        P,
        ". The Climate page uses this curve for its airflow numbers."
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-row-actions", children: /* @__PURE__ */ s.jsx(ae, { variant: "primary", onClick: K, children: "Calibrate another duct" }) })
    ] }) : null,
    j && o !== "done" ? /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: j }) : null
  ] });
}
function W2() {
  const { callService: a } = $t(), [i, r] = x.useState(0), [o, d] = x.useState(""), [h, f] = x.useState(""), [m, p] = x.useState("45"), [b, v] = x.useState(!1), [g, y] = x.useState(""), [j, k] = x.useState(!1), [T, C] = x.useState(!1), M = os[i], E = async (K) => {
    await a("light", "turn_on", {
      entity_id: "light.dsc_hub_sf1000_dimmer",
      brightness_pct: K
    });
  }, F = async () => {
    const K = Number(o), L = Number(h);
    if (!Number.isFinite(K) || K <= 0) {
      y("Enter the LUX reading at sensor height.");
      return;
    }
    v(!0);
    try {
      await E(M.pct), await sb("sf1000", "light_par", [
        { step_key: `${M.key}_lux`, measured_value: K, unit: "lux" },
        ...Number.isFinite(L) && L > 0 ? [{ step_key: `${M.key}_par`, measured_value: L, unit: "µmol/m²/s" }] : [],
        { step_key: `${M.key}_height_cm`, measured_value: Number(m) || 0, unit: "cm" }
      ]);
      const G = i + 1;
      G >= os.length ? (k(!0), y("Light response curve saved to brain — used for effective-off threshold."), await a("light", "turn_off", { entity_id: "light.dsc_hub_sf1000_dimmer" })) : (r(G), d(""), f(""), y(`Saved ${M.label}. Set fixture to ${os[G].label} and measure.`), await E(os[G].pct));
    } catch (G) {
      y(G instanceof Error ? G.message : "Save failed");
    } finally {
      v(!1);
    }
  }, P = async () => {
    v(!0);
    try {
      k(!1), r(0), d(""), f(""), await E(os[0].pct), y(`Fixture at ${os[0].label}. Measure LUX/PAR at canopy height.`);
    } finally {
      v(!1);
    }
  };
  return j ? /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Light curve saved", icon: "ok", children: [
    /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: g }),
    /* @__PURE__ */ s.jsx(ae, { variant: "secondary", onClick: () => C(!0), children: "Re-run light wizard" })
  ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "SF1000 brightness response", icon: "light", children: [
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "At fixed canopy height, ramp SF1000 25→100%. Enter meter readings at each step. PAR optional if meter supports it." }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "Sensor height (cm)",
        /* @__PURE__ */ s.jsx("input", { type: "number", min: "1", value: m, onChange: (K) => p(K.target.value) })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-stage-track", style: { margin: "12px 0" }, children: os.map((K, L) => /* @__PURE__ */ s.jsx("span", { className: `dsc-stage-pill${L === i ? " is-on" : L > i ? "" : " is-next"}`, children: K.label }, K.key)) }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "LUX @ ",
        M.label,
        /* @__PURE__ */ s.jsx("input", { type: "number", min: "0", value: o, onChange: (K) => d(K.target.value) })
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "PAR µmol/m²/s (optional)",
        /* @__PURE__ */ s.jsx("input", { type: "number", min: "0", value: h, onChange: (K) => f(K.target.value) })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-row-actions", children: i === 0 && !g ? /* @__PURE__ */ s.jsx(ae, { variant: "primary", disabled: b, onClick: () => C(!0), children: "Start light wizard" }) : /* @__PURE__ */ s.jsxs(ae, { variant: "primary", disabled: b, onClick: () => void F(), children: [
        "Save ",
        M.label
      ] }) })
    ] }),
    /* @__PURE__ */ s.jsx(
      Je,
      {
        open: T,
        onDismiss: () => C(!1),
        onConfirm: () => {
          C(!1), P();
        },
        title: "Start light calibration",
        confirmLabel: "Start session",
        help: null,
        children: /* @__PURE__ */ s.jsx("p", { children: "SF1000 will ramp through brightness steps while you measure LUX/PAR at canopy height. The fixture stays on until you finish or abort." })
      }
    ),
    g ? /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: g }) : null
  ] });
}
function I2() {
  const [a, i] = x.useState("fan");
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Ct,
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
    a === "fan" ? /* @__PURE__ */ s.jsx(P2, {}) : /* @__PURE__ */ s.jsx(W2, {})
  ] });
}
function ew({
  tag: a,
  config: i
}) {
  const r = x.useRef(null), { hass: o, tick: d } = hi(), [h, f] = x.useState("loading"), m = x.useRef(
    null
  ), p = x.useRef(i);
  return p.current = i, x.useEffect(() => {
    const b = r.current;
    if (!b) return;
    let v = !1;
    const g = p.current ?? {};
    return (async () => {
      f("loading"), b.innerHTML = "";
      const y = await ub(a);
      if (v || !r.current) return;
      if (!y) {
        f("missing");
        const k = document.createElement("div");
        k.className = "dsc-empty";
        const T = Z0(a).join(", ");
        k.innerHTML = `<strong>${a}</strong> did not register.<br/>Tried ${T}. Deploy the card IIFE under /config/www (or add a Lovelace resource), then hard-refresh.`, b.appendChild(k);
        return;
      }
      const j = document.createElement(a);
      typeof j.setConfig == "function" && j.setConfig({ type: `custom:${a}`, ...g }), o && (j.hass = o), b.appendChild(j), m.current = j, f("ready");
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
function Gr(a) {
  return Number.isFinite(a.value) ? `${Math.round(a.value)} CFM` : "—";
}
function tw(a) {
  return a("sensor.dsc_hub_room_vpd_kpa") ? "sensor.dsc_hub_room_vpd_kpa" : a("sensor.dsc_hub_room_vpd") ? "sensor.dsc_hub_room_vpd" : "sensor.dsc_hub_room_vpd_kpa";
}
function nw() {
  const a = Te(), { available: i, num: r, state: o, entity: d, tick: h } = a, f = xt(), m = pt(), p = Gb(), { isSnoozed: b } = po(), v = Dn(), g = Ub(), y = (ze) => g.open({ kind: ze, title: Bb[ze] });
  yb(), wb(), jb();
  const j = f.hub.online || p("sensor.dsc_hub_uptime"), k = r("sensor.dsc_hub_uptime", f.hub.values.uptime != null ? Number(f.hub.values.uptime) : 0), T = r("sensor.dsc_active_alert_count", 0), C = o("sensor.dsc_fleet_version_status", "ok"), M = String(d("sensor.dsc_fleet_version_status")?.attributes?.expected || f.expected_firmware || "7.0.0"), E = o("binary_sensor.dsc_cannalib_api_online") === "on", F = r("sensor.dsc_cannalib_api_hits", 0), P = o("sensor.dsc_cannalib_bandwidth_summary", "— MB"), K = f.panel.online ? "on" : o("binary_sensor.dsc_hub_panel_link"), L = f.panel.online || K === "on", G = p("binary_sensor.dsc_hub_panel_link") || L, ee = !L && i("sensor.dsc_control_wifi_rssi"), le = !L && !ee && !G, te = f.hub.values.heartbeat != null ? String(f.hub.values.heartbeat) : o("sensor.dsc_hub_heartbeat", "NO BEAT"), ue = f.hub.online && f.hub.values.heartbeat != null ? !0 : p("sensor.dsc_hub_heartbeat"), ie = ge("sensor.dsc_hub_tent_temperature"), re = ge("sensor.dsc_hub_tent_humidity"), fe = ge("sensor.dsc_hub_vpd_kpa"), oe = ge("sensor.dsc_hub_clone_temperature"), S = ge("sensor.dsc_hub_clone_humidity"), z = ge("sensor.dsc_hub_clone_vpd_kpa"), q = ge("sensor.dsc_hub_room_temperature"), Y = ge("sensor.dsc_hub_room_humidity"), I = tw(d);
  ge(I);
  const N = ge("sensor.dsc_coldest_root_zone_temp"), H = r("number.dsc_hub_target_temp", 25), Q = r("number.dsc_hub_rh_target_min", 45), ne = r("number.dsc_hub_rh_target_max", 70), pe = r("number.dsc_hub_vpd_target_min", 0.8), de = r("number.dsc_hub_vpd_target_max", 1.4), ve = r("number.dsc_hub_clone_target_temp", 24), $e = r("number.dsc_hub_clone_rh_min", 55), Z = r("number.dsc_hub_clone_rh_max", 75), ke = r("number.dsc_hub_clone_vpd_min", 0.6), Be = r("number.dsc_hub_clone_vpd_max", 1.2), _e = r("number.dsc_hub_mat_root_zone_low", 20), Ve = r("number.dsc_hub_mat_root_zone_high", 24), se = mt("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", { available: i, num: r }), Qe = mt("sensor.dsc_cfm_exhaust_recirc_allocated", "sensor.dsc_cfm_exhaust_recirc", { available: i, num: r }), xe = mt("sensor.dsc_cfm_intake_main", "sensor.dsc_cfm_intake_main", { available: i, num: r }), Pe = mt("sensor.dsc_cfm_intake_2x4", "sensor.dsc_cfm_intake_2x4", { available: i, num: r }), We = [se, Qe, xe, Pe], De = Ad(f), Ut = zd(De), Bt = d("sensor.dsc_plant_roster_summary")?.attributes?.slots || [], rn = o("sensor.dsc_plant_roster_summary", "—"), Jt = Pb(o, b), it = (ze) => v.open({
    entityId: ze.entityId,
    label: ze.label,
    kind: "kit",
    runtimeToday: ze.runtimeToday,
    cyclesToday: ze.cyclesToday,
    demandEntity: ze.demandEntity
  }), ol = (ze) => {
    window.dispatchEvent(new CustomEvent("dsc-dash-select-pot", { detail: { pot: ze } })), m("/live/root");
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page dsc-dash-home", children: [
    /* @__PURE__ */ s.jsx(
      Ct,
      {
        icon: "home",
        title: "Home",
        subtitle: "Everything running right now, at a glance.",
        primaryAction: /* @__PURE__ */ s.jsx(ae, { teal: !0, onClick: () => m("/live/twin"), children: "Open Twin" }),
        actions: /* @__PURE__ */ s.jsx(ae, { onClick: () => m("/live/climate"), children: "Climate" })
      }
    ),
    /* @__PURE__ */ s.jsx(
      q2,
      {
        hubOnline: j,
        panelOk: L,
        panelHaOnly: ee,
        panelOffline: le,
        heartbeat: te,
        beatOk: ue,
        uptimeSec: k,
        alerts: T,
        fleetStatus: C,
        fleetExpected: M,
        cannalibOnline: E,
        cannalibHits: F,
        cannalibSummary: P,
        inServiceLabel: `${Ut.inService} of ${Ut.total} in service`,
        activeFaultCount: Jt.length,
        onChip: (ze, hs) => v.open({ entityId: ze, label: hs, kind: ze.includes("alert") ? "alert" : "kit" })
      }
    ),
    /* @__PURE__ */ s.jsx(Y2, { bus: a }),
    /* @__PURE__ */ s.jsx(Yb, { bus: a, onNavigate: m }),
    Jt.length > 0 ? /* @__PURE__ */ s.jsx(ce, { className: "dsc-glass", title: "Active system alerts", icon: "alert", children: /* @__PURE__ */ s.jsx("ul", { className: "dsc-fault-list", children: Jt.map((ze) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx(ae, { onClick: () => v.open({ entityId: ze, label: ze, kind: "alert" }), children: ze.split(".").pop()?.replace(/dsc_/, "").replace(/_/g, " ") }) }, ze)) }) }) : null,
    /* @__PURE__ */ s.jsx(X2, { bus: a, onNavigate: m }),
    /* @__PURE__ */ s.jsx(Rd, {}),
    /* @__PURE__ */ s.jsx(Xb, { bus: a }),
    /* @__PURE__ */ s.jsx(Qb, { bus: a, onNavigate: m }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid dsc-grid--2", children: [
      /* @__PURE__ */ s.jsx(Jb, { bus: a }),
      /* @__PURE__ */ s.jsxs("details", { className: "dsc-narrator", children: [
        /* @__PURE__ */ s.jsx("summary", { children: "System narrator" }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-muted", style: { fontSize: 13, lineHeight: 1.55, padding: "8px 0" }, children: [
          /* @__PURE__ */ s.jsxs("p", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: "Hub:" }),
            " ",
            j ? "online" : "offline",
            " · uptime ",
            qb(k),
            " · beat ",
            te
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: "Climate:" }),
            " 4×8 ",
            Number.isFinite(ie.value) ? `${ie.value.toFixed(1)}°C` : "—",
            " /",
            " ",
            Number.isFinite(re.value) ? `${re.value.toFixed(0)}%` : "—",
            " RH · 2×4",
            " ",
            Number.isFinite(oe.value) ? `${oe.value.toFixed(1)}°C` : "—",
            " /",
            " ",
            Number.isFinite(S.value) ? `${S.value.toFixed(0)}%` : "—",
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
          Jt.length > 0 ? /* @__PURE__ */ s.jsxs("p", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: "Watchlist:" }),
            " ",
            Jt.length,
            " active alert(s)."
          ] }) : null
        ] })
      ] })
    ] }),
    /* @__PURE__ */ s.jsx(Q2, { bus: a, onNavigate: m }),
    /* @__PURE__ */ s.jsx(
      Zb,
      {
        readings: {
          tentT: ie.value,
          tentRh: re.value,
          tentVpd: fe.value,
          cloneT: oe.value,
          cloneRh: S.value,
          cloneVpd: z.value,
          roomT: q.value,
          roomRh: Y.value,
          rootT: N.value,
          targetTemp: H,
          rhMin: Q,
          rhMax: ne,
          vpdMin: pe,
          vpdMax: de,
          cloneTargetTemp: ve,
          cloneRhMin: $e,
          cloneRhMax: Z,
          cloneVpdMin: ke,
          cloneVpdMax: Be,
          matLo: _e,
          matHi: Ve,
          stale: {
            tentT: ie.stale,
            tentRh: re.stale,
            tentVpd: fe.stale,
            cloneT: oe.stale,
            cloneRh: S.stale,
            cloneVpd: z.stale,
            roomT: q.stale,
            roomRh: Y.stale,
            rootT: N.stale
          }
        },
        onChartOpen: y
      }
    ),
    /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Lung · CFM", icon: "climate", children: [
      /* @__PURE__ */ s.jsx(bo, { readings: We }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ s.jsx(Nt, { label: "Out alloc", value: Gr(se).replace(" CFM", ""), unit: "CFM" }),
        /* @__PURE__ */ s.jsx(Nt, { label: "Recirc alloc", value: Gr(Qe).replace(" CFM", ""), unit: "CFM" }),
        /* @__PURE__ */ s.jsx(Nt, { label: "Intake 4×8", value: Gr(xe).replace(" CFM", ""), unit: "CFM" }),
        /* @__PURE__ */ s.jsx(Nt, { label: "Intake 2×4", value: Gr(Pe).replace(" CFM", ""), unit: "CFM" })
      ] }),
      /* @__PURE__ */ s.jsx(ew, { tag: "dsc-airflow-map-card" })
    ] }),
    /* @__PURE__ */ s.jsx(K2, { bus: a }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid dsc-grid--2", children: [
      /* @__PURE__ */ s.jsxs(ce, { className: "dsc-glass", title: "Plant roster", icon: "roster", children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: rn }),
        Array.isArray(Bt) && Bt.length > 0 ? /* @__PURE__ */ s.jsx("ul", { className: "dsc-roster-list", children: Bt.slice(0, 8).map((ze) => /* @__PURE__ */ s.jsxs("li", { children: [
          /* @__PURE__ */ s.jsx("strong", { children: ze.nickname || ze.strain || `Slot ${ze.slot}` }),
          /* @__PURE__ */ s.jsxs("span", { className: "dsc-muted", children: [
            " ",
            "· ",
            ze.pot && ze.pot !== "none" ? `P${ze.pot}` : "stock",
            " · ",
            ze.status || "—",
            ze.blend ? ` · ${ze.blend}` : ""
          ] })
        ] }, ze.slot)) }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: "No occupied roster slots." })
      ] }),
      /* @__PURE__ */ s.jsx(ce, { className: "dsc-glass", title: "Kit pulse", icon: "fleet", children: /* @__PURE__ */ s.jsx(Dd, { nodes: De, onSelect: it }) })
    ] }),
    /* @__PURE__ */ s.jsx(Kb, { bus: a, rosterSlots: Bt, onNavigate: m, onPot: ol, onPotChart: y })
  ] });
}
const aw = [
  { id: "live", label: "Live", path: "/live/overview", icon: "live" },
  { id: "grow", label: "Grow", path: "/grow/roster", icon: "grow" },
  { id: "tune", label: "Tune", path: "/tune/learning", icon: "tune" },
  { id: "fleet", label: "Fleet", path: "/fleet", icon: "fleet" }
], sw = {
  live: [
    { id: "overview", label: "Overview", path: "/live/overview", icon: "home" },
    { id: "climate", label: "Climate", path: "/live/climate", icon: "climate" },
    { id: "main", label: "4×8", path: "/live/4x8", icon: "tent" },
    { id: "clone", label: "2×4", path: "/live/2x4", icon: "clone" },
    { id: "root", label: "Root", path: "/live/root", icon: "root" },
    { id: "light", label: "Light", path: "/live/light", icon: "lighting" },
    { id: "twin", label: "Twin", path: "/live/twin", icon: "twin", demoted: !0 },
    { id: "mission", label: "Mission", path: "/live/mission", icon: "mission", demoted: !0 },
    { id: "dash", label: "Dash", path: "/ops/home", icon: "dash", demoted: !0 }
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
}, lw = {
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
  "/system": "/fleet",
  "/settings": "/fleet/settings"
};
function iw(a) {
  return a.startsWith("/grow") || a.startsWith("/plant") ? "grow" : a.startsWith("/tune") || a.startsWith("/advanced") ? "tune" : a.startsWith("/fleet") || a.startsWith("/system") || a.startsWith("/settings") ? "fleet" : (a.startsWith("/ops"), "live");
}
function rw(a, i) {
  const r = lw[a];
  return r ? r.includes("?") ? r : `${r}${i || ""}` : null;
}
const ow = `:root,:host,.dsc-root{--dsc-black: #0b0e14;--dsc-black-2: #12171f;--dsc-gray-1: #12171f;--dsc-gray-2: #1a2230;--dsc-gray-3: #243044;--dsc-gray-4: #8b95a8;--dsc-gray-5: #8b95a8;--dsc-blue: #26c6da;--dsc-blue-dim: rgba(38, 198, 218, .4);--dsc-purple: #a78bfa;--dsc-purple-dim: rgba(167, 139, 250, .35);--dsc-neon: #66bb6a;--dsc-neon-dim: rgba(102, 187, 106, .32);--dsc-neon-glow: rgba(0, 230, 118, .4);--dsc-teal: #26c6da;--dsc-teal-dim: rgba(38, 198, 218, .45);--dsc-teal-glow: rgba(38, 198, 218, .55);--dsc-orange: #ff8a65;--dsc-amber: #ffb74d;--dsc-bad: #ef5350;--dsc-bad-soft: #ef5350;--dsc-soil-1: #5b9f6b;--dsc-soil-2: #4a8f9f;--dsc-soil-3: #c4a35a;--dsc-soil-4: #8d6e63;--dsc-glass: rgba(18, 23, 31, .78);--dsc-glass-border: rgba(36, 48, 68, .55);--dsc-white: #e8eef8;--dsc-shadow: 0 8px 24px rgba(0, 0, 0, .45);--dsc-shadow-tight: 0 2px 8px rgba(0, 0, 0, .55);--dsc-radius: 10px;--dsc-radius-lg: 14px;--dsc-font: "Segoe UI", "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;--dsc-mono: "Cascadia Code", "IBM Plex Mono", ui-monospace, monospace;color:var(--dsc-white);background:var(--dsc-black);font-family:var(--dsc-font);display:block;height:100%;box-sizing:border-box}*,*:before,*:after{box-sizing:border-box}html,body{height:100%;margin:0}body{background:var(--dsc-black);color:var(--dsc-white);font-family:var(--dsc-font)}#root{height:100%}.dsc-root{height:100%;min-height:100%;overflow:auto;background:radial-gradient(1100px 560px at 8% -12%,rgba(38,198,218,.12),transparent 55%),radial-gradient(900px 520px at 92% -8%,rgba(38,198,218,.08),transparent 50%),radial-gradient(700px 420px at 70% 100%,rgba(102,187,106,.04),transparent 55%),var(--dsc-black)}.dsc-honesty-rail{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}.dsc-next-rec{border-color:var(--dsc-blue-dim)}.dsc-twin-keepalive{position:fixed;inset:0;visibility:hidden;pointer-events:none;z-index:-1;overflow:hidden;margin:0;min-height:0}.dsc-twin-keepalive.is-active{position:relative;inset:auto;visibility:visible;pointer-events:auto;z-index:auto;overflow:visible;margin-bottom:12px;min-height:min(70vh,720px)}.dsc-twin-keepalive:not(.is-active),.dsc-twin-keepalive:not(.is-active) *{pointer-events:none!important}.dsc-twin-keepalive-host{min-height:min(68vh,700px)}.dsc-twin-keepalive.is-active .dsc-twin-keepalive-host,.dsc-twin-keepalive.is-active .dsc-twin-keepalive-host>*{min-height:min(68vh,700px);pointer-events:auto}.dsc-tab--live.active{color:var(--dsc-blue);border-color:var(--dsc-blue-dim)}.dsc-tab--grow.active{color:var(--dsc-teal);border-color:var(--dsc-teal-dim)}.dsc-tab--tune.active{color:var(--dsc-purple);border-color:var(--dsc-purple-dim)}.dsc-tab--fleet.active{color:var(--dsc-blue);border-color:var(--dsc-blue-dim)}.dsc-secondary-tabs .dsc-tab.active{color:var(--dsc-teal);border-color:var(--dsc-teal-dim);box-shadow:0 0 0 1px var(--dsc-blue-dim)}.dsc-tent-segment{display:inline-flex;gap:4px;padding:3px;border-radius:999px;background:var(--dsc-gray-1);border:1px solid var(--dsc-glass-border)}.dsc-tent-segment button{appearance:none;border:0;background:transparent;color:var(--dsc-gray-5);padding:6px 12px;border-radius:999px;cursor:pointer;font:inherit;font-size:.85rem}.dsc-tent-segment button.is-active{background:var(--dsc-gray-2);color:var(--dsc-white);box-shadow:var(--dsc-shadow-tight)}.dsc-tent-segment button[data-tent=main].is-active{color:var(--dsc-blue)}.dsc-tent-segment button[data-tent=clone].is-active{color:var(--dsc-purple)}.dsc-tent-segment button[data-tent=compare].is-active{color:var(--dsc-teal)}.dsc-shell{display:flex;flex-direction:column;min-height:100%;max-width:1600px;margin:0 auto;padding:16px 20px 28px}.dsc-brand-row{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:10px}.dsc-brand{display:flex;align-items:center;gap:12px;color:var(--dsc-white);text-decoration:none}.dsc-brand img,.dsc-brand svg{width:36px;height:36px;color:var(--dsc-neon)}.dsc-brand-title{display:flex;flex-direction:column;gap:2px}.dsc-brand-title strong{font-size:1.05rem;letter-spacing:.04em;font-weight:700;line-height:1.25;max-width:min(52vw,28rem)}.dsc-brand-wordmark{height:18px;width:auto;max-width:160px;display:block;color:var(--dsc-text, #eef1f8);line-height:0}.dsc-brand-wordmark svg{width:auto;height:18px;display:block}.dsc-icon svg{width:100%;height:100%;display:block}.dsc-brand-title span{font-size:.72rem;color:var(--dsc-gray-5);letter-spacing:.08em;text-transform:uppercase}.dsc-page-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px}.dsc-page-header-main{display:flex;align-items:flex-start;gap:10px}.dsc-page-header-actions{display:flex;align-items:center;gap:6px;flex-shrink:0}.dsc-card-title{display:inline-flex;align-items:center;gap:8px}.dsc-primary-tabs,.dsc-secondary-tabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:thin;padding-bottom:2px;-webkit-overflow-scrolling:touch}.dsc-primary-tabs{border-bottom:1px solid var(--dsc-gray-3);margin-bottom:8px}.dsc-secondary-tabs{margin-bottom:16px;mask-image:linear-gradient(90deg,#000 85%,transparent)}.dsc-secondary-tabs:after{content:"";flex:0 0 12px}.dsc-tab{appearance:none;border:1px solid transparent;background:transparent;color:var(--dsc-gray-5);padding:10px 14px;min-height:44px;border-radius:8px 8px 0 0;cursor:pointer;font:inherit;font-size:.92rem;letter-spacing:.04em;white-space:nowrap;display:inline-flex;align-items:center;gap:8px;transition:transform .1s ease,box-shadow .1s ease,color .15s ease,border-color .15s ease,background .15s ease;text-decoration:none}.dsc-tab span[role=img]{opacity:.9;flex-shrink:0}.dsc-tab:hover{color:var(--dsc-white);background:var(--dsc-gray-1)}.dsc-tab:focus-visible{outline:2px solid var(--dsc-neon);outline-offset:2px}.dsc-tab.active{color:var(--dsc-white);border-bottom:2px solid var(--dsc-neon);box-shadow:0 6px 18px #39ff1414}.dsc-secondary-tabs .dsc-tab{border-radius:999px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-1);min-height:40px;padding:8px 14px}.dsc-secondary-tabs .dsc-tab.active{border-color:var(--dsc-neon-dim);color:var(--dsc-neon);background:#39ff1414;box-shadow:var(--dsc-shadow-tight)}.dsc-btn{appearance:none;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);border-radius:8px;padding:10px 16px;min-height:40px;font:inherit;cursor:pointer;box-shadow:var(--dsc-shadow-tight);transition:transform .1s ease,box-shadow .1s ease,border-color .12s ease,background .12s ease}.dsc-btn:hover{border-color:var(--dsc-neon-dim)}.dsc-btn:active,.dsc-tab:active{transform:translateY(1px);box-shadow:0 1px 3px #000000a6}.dsc-btn.primary{border-color:var(--dsc-neon-dim);color:var(--dsc-black);background:var(--dsc-neon);font-weight:650}.dsc-page{animation:dsc-fade .18s ease}@keyframes dsc-fade{0%{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.dsc-page,.dsc-btn,.dsc-tab,.dsc-live-pulse{animation:none!important;transition:none!important}}.dsc-grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:14px}.dsc-grid--2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.dsc-table-scroll{overflow-x:auto;max-width:100%;-webkit-overflow-scrolling:touch}.dsc-secondary-tabs .dsc-tab--demoted{opacity:.62;font-size:.82rem}.dsc-secondary-tabs .dsc-tab--demoted:not(.active){border-style:dashed}.dsc-inventory-group{margin-bottom:12px;border:1px solid var(--dsc-gray-3);border-radius:var(--dsc-radius);padding:8px 12px}.dsc-inventory-group>summary{cursor:pointer;font-weight:600;letter-spacing:.08em;text-transform:uppercase;font-size:.78rem;color:var(--dsc-gray-5);margin-bottom:8px}.dsc-gauge.is-progress .dsc-gauge-value{color:var(--dsc-teal)}.dsc-col-3{grid-column:span 3}.dsc-col-4{grid-column:span 4}.dsc-col-6{grid-column:span 6}.dsc-col-8{grid-column:span 8}.dsc-col-12{grid-column:span 12}@media(max-width:1100px){.dsc-col-3,.dsc-col-4{grid-column:span 6}.dsc-col-8{grid-column:span 12}}@media(max-width:720px){.dsc-shell{padding:12px}.dsc-col-3,.dsc-col-4,.dsc-col-6,.dsc-col-8{grid-column:span 12}.dsc-grid--2{grid-template-columns:1fr}.dsc-dash-home .dsc-gauge-matrix--bands{gap:6px}.dsc-dash-home .dsc-gauge-matrix--bands .dsc-gauge-row-3{gap:4px}.dsc-dash-home .dsc-band-cell{padding:4px 2px 6px}.dsc-dash-home .dsc-band-cell .dsc-gauge svg{max-width:92px}.dsc-dash-home .dsc-band-zone-label{font-size:.62rem;letter-spacing:.08em}}.dsc-card{background:linear-gradient(165deg,var(--dsc-gray-1),var(--dsc-black-2));border:1px solid var(--dsc-gray-3);border-radius:var(--dsc-radius);box-shadow:var(--dsc-shadow);padding:14px 16px;min-height:88px}.dsc-card h2,.dsc-card h3{margin:0 0 8px;font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;color:var(--dsc-gray-5);font-weight:600}.dsc-kpi-value{font-size:1.85rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:.02em;color:var(--dsc-white)}.dsc-kpi-unit{margin-left:6px;font-size:.85rem;color:var(--dsc-gray-5)}.dsc-kpi-sub{margin-top:6px;color:var(--dsc-gray-5);font-size:.82rem}.dsc-status-ok{color:var(--dsc-neon)}.dsc-status-warn{color:var(--dsc-amber)}.dsc-status-bad{color:var(--dsc-bad)}.dsc-status-muted{color:var(--dsc-gray-5)}.dsc-page-title{margin:0 0 14px;font-size:1.35rem;letter-spacing:.04em}.dsc-muted{color:var(--dsc-gray-5)}.dsc-legacy-host{min-height:420px;border-radius:var(--dsc-radius);overflow:hidden;border:1px solid var(--dsc-gray-3);background:#000}.dsc-legacy-host--empty{background:var(--dsc-gray-1);min-height:160px}.dsc-legacy-host>*{display:block;width:100%}.dsc-status-strip{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}.dsc-chip-row{display:flex;flex-wrap:wrap;gap:8px}.dsc-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-1);font-size:.75rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-chip--ok{color:var(--dsc-neon);border-color:var(--dsc-neon-dim);background:#39ff1414;box-shadow:0 0 12px #39ff141f}.dsc-chip--bad{color:var(--dsc-bad-soft);border-color:color-mix(in srgb,var(--dsc-bad) 45%,transparent);background:color-mix(in srgb,var(--dsc-bad) 12%,transparent)}.dsc-chip--warn{color:var(--dsc-amber);border-color:color-mix(in srgb,var(--dsc-amber) 45%,transparent);background:color-mix(in srgb,var(--dsc-amber) 12%,transparent)}.dsc-chip--muted{color:var(--dsc-gray-5)}.dsc-chip--pulse{animation:dsc-chip-pulse 1.6s ease-in-out infinite}.dsc-chip--duty{animation:dsc-duty-pulse 1.8s ease-in-out infinite}.dsc-chip--breathe{animation:dsc-chip-breathe 2.4s ease-in-out infinite}.dsc-chip--fan{animation:dsc-chip-fan 1.3s linear infinite}@keyframes dsc-chip-pulse{0%,to{box-shadow:0 0 #39ff1400}50%{box-shadow:0 0 14px #39ff1459}}@keyframes dsc-duty-pulse{0%,to{box-shadow:0 0 #3dde7a0d;border-color:var(--dsc-neon-dim)}50%{box-shadow:0 0 16px #3dde7a52;border-color:var(--dsc-neon)}}@keyframes dsc-chip-breathe{0%,to{box-shadow:0 0 #ffb74d0d}50%{box-shadow:0 0 14px #ffb74d61}}@keyframes dsc-chip-fan{0%{box-shadow:0 0 #2ec4d60d}50%{box-shadow:0 0 12px #2ec4d66b}to{box-shadow:0 0 #2ec4d60d}}.dsc-demand-row{display:flex;flex-wrap:wrap;gap:8px}.dsc-demand-row--stack{flex-direction:column}.dsc-demand{appearance:none;flex:1 1 110px;min-height:52px;padding:10px 12px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);font:inherit;cursor:pointer;display:flex;flex-direction:column;align-items:flex-start;gap:4px;box-shadow:var(--dsc-shadow-tight);transition:transform .1s ease,box-shadow .1s ease,border-color .12s ease,background .12s ease}.dsc-demand:hover{border-color:var(--dsc-neon-dim)}.dsc-demand:active{transform:translateY(1px);box-shadow:0 1px 3px #000000a6}.dsc-demand.is-on{border-color:var(--dsc-neon);background:#39ff141a;box-shadow:0 0 0 1px #39ff1440,0 0 18px #39ff1433}.dsc-demand.is-missing{opacity:.55;cursor:not-allowed}.dsc-demand-label{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-demand.is-on .dsc-demand-label{color:var(--dsc-neon)}.dsc-demand-state{font-weight:700;font-variant-numeric:tabular-nums;font-size:1rem}.dsc-demand-icon{margin-bottom:4px;opacity:.95}.dsc-mode-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}.dsc-mode-selects{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}.dsc-entity-select{display:flex;flex-direction:column;gap:6px;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-entity-select-label{display:inline-flex;align-items:center;gap:6px}.dsc-entity-select select{appearance:none;min-height:40px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);padding:8px 12px;font:inherit;text-transform:none;letter-spacing:0}.dsc-entity-select.is-disabled{opacity:.55}.dsc-fan-stack{display:flex;flex-direction:column;gap:10px}.dsc-fan-slider{display:flex;flex-direction:column;gap:4px}.dsc-fan-slider-label{display:flex;align-items:baseline;gap:8px;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-fan-slider-label strong{color:var(--dsc-teal);font-variant-numeric:tabular-nums}.dsc-fan-slider input[type=range]{width:100%;accent-color:var(--dsc-teal)}.dsc-fan-slider.is-disabled{opacity:.5}.dsc-honesty{margin:10px 0 0;font-size:.85rem;color:var(--dsc-gray-5);display:flex;flex-wrap:wrap;align-items:center;gap:8px}.dsc-target-panel{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}.dsc-target-panel.is-compact .dsc-target-grid{grid-template-columns:repeat(auto-fit,minmax(90px,1fr))}.dsc-tent-targets{border:1px solid var(--dsc-glass-border);border-radius:var(--dsc-radius);padding:10px 12px;background:#0000002e}.dsc-tent-targets-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}.dsc-got-want{display:flex;flex-direction:column;gap:2px;font-size:.82rem;margin-bottom:10px}.dsc-target-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px}.dsc-target-num{display:flex;flex-direction:column;gap:4px;font-size:.7rem;letter-spacing:.06em;color:var(--dsc-gray-5)}.dsc-target-num-label{text-transform:uppercase}.dsc-target-num input,.dsc-target-num textarea{min-height:36px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);padding:6px 8px;font:inherit;font-variant-numeric:tabular-nums}.dsc-target-num textarea{text-transform:none;letter-spacing:0;min-height:56px;resize:vertical}.dsc-target-num.is-disabled{opacity:.55}.dsc-chart{position:relative}.dsc-chart-svg{cursor:crosshair;touch-action:none}.dsc-chart-tooltip{position:absolute;top:8px;transform:translate(-50%);pointer-events:none;z-index:2;min-width:120px;padding:8px 10px;border-radius:8px;border:1px solid var(--dsc-glass-border);background:var(--dsc-glass);backdrop-filter:blur(10px);box-shadow:var(--dsc-shadow-tight);font-size:.75rem}.dsc-chart-tooltip-time{color:var(--dsc-teal);font-family:var(--dsc-mono);margin-bottom:4px}.dsc-chart-tooltip-row{display:flex;align-items:center;gap:6px;color:var(--dsc-white)}.dsc-chart-tooltip-row i{width:7px;height:7px;border-radius:50%;display:inline-block}@keyframes dsc-sync-pulse{0%{stroke-dashoffset:1;opacity:.2}35%{opacity:1}to{stroke-dashoffset:0;opacity:0}}@media(prefers-reduced-motion:reduce){.dsc-chart-pulse{animation:none!important;opacity:.85}.dsc-gauge-value,.dsc-chip--pulse,.dsc-chip--duty,.dsc-chip--breathe,.dsc-chip--fan,.dsc-fan-spin,.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-warn),.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-bad){animation:none!important}}.dsc-gauge.is-warn .dsc-gauge-label{color:var(--dsc-amber)}.dsc-gauge.is-muted{opacity:.75}.dsc-gauge.is-muted .dsc-gauge-label{color:var(--dsc-gray-5)}.dsc-gauge.is-bad .dsc-gauge-label{color:var(--dsc-bad-soft)}.dsc-gauge.is-ok:not(.is-stale) .dsc-gauge-value{animation:dsc-gauge-live 3.2s ease-in-out infinite}.dsc-gauge.is-warn .dsc-gauge-value,.dsc-gauge.is-bad .dsc-gauge-value{animation:dsc-gauge-breathe 2.4s ease-in-out infinite}@keyframes dsc-gauge-live{0%,to{opacity:.92;filter:drop-shadow(0 0 4px rgba(46,196,214,.25))}50%{opacity:1;filter:drop-shadow(0 0 10px rgba(46,196,214,.55))}}@keyframes dsc-gauge-breathe{0%,to{opacity:.88;filter:drop-shadow(0 0 4px rgba(255,183,77,.25))}50%{opacity:1;filter:drop-shadow(0 0 12px rgba(255,107,138,.55))}}.dsc-gauge-row{display:flex;justify-content:space-around;flex-wrap:wrap;gap:8px}.dsc-gauge-matrix{display:flex;flex-direction:column;gap:8px}.dsc-gauge-row-3{display:grid;grid-template-columns:14px repeat(3,minmax(0,1fr));align-items:center;gap:2px 4px;border:1px solid transparent;border-radius:12px;padding:2px 4px 4px;transition:box-shadow .25s ease,border-color .25s ease,background .25s ease}.dsc-gauge-row-3.is-lit{border-color:#26c6da6b;background:linear-gradient(180deg,#26c6da14,#0c121c59);box-shadow:0 0 22px #26c6da29,inset 0 0 14px #26c6da0d}.dsc-gauge-row-tag{font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--dsc-gray-5);writing-mode:vertical-rl;transform:rotate(180deg);justify-self:center;padding:2px 0}.dsc-gauge-row-3 .dsc-gauge{min-width:0}.dsc-gauge-cell{min-width:0;display:flex;flex-direction:column;align-items:center;gap:2px}.dsc-gauge-cell .dsc-sparkline{width:100%;max-width:88px;opacity:.9}.dsc-gauge-row-3 .dsc-gauge svg{width:100%;max-width:96px;height:auto;max-height:72px}.dsc-gauge-row-3 .dsc-gauge-label{font-size:10px}.dsc-gauge-zone{border:1px solid transparent;border-radius:12px;padding:8px 6px 10px;transition:box-shadow .25s ease,border-color .25s ease,background .25s ease}.dsc-gauge-zone.is-lit{border-color:#26c6da6b;background:linear-gradient(180deg,#26c6da14,#0c121c59);box-shadow:0 0 22px #26c6da29,inset 0 0 14px #26c6da0d}.dsc-gauge-zone-label{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5);margin:0 4px 6px}.dsc-gauge{display:flex;flex-direction:column;align-items:center;gap:4px}.dsc-gauge-label{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-chart-legend{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:4px;min-height:20px}.dsc-chart-legend-item{display:inline-flex;align-items:center;gap:6px;font-size:.75rem;color:var(--dsc-gray-5)}.dsc-chart-legend-item i{width:8px;height:8px;border-radius:50%;display:inline-block;box-shadow:0 0 6px currentColor}.dsc-chart-last{margin-left:auto;font-variant-numeric:tabular-nums;color:var(--dsc-neon);font-size:13px;font-weight:650}.dsc-fault-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.dsc-fault-list li{display:flex;flex-wrap:wrap;align-items:center;gap:10px}.dsc-empty{padding:18px 14px;border:1px dashed var(--dsc-gray-3);border-radius:8px;color:var(--dsc-gray-5);background:#00000040;font-size:.9rem;line-height:1.45}.dsc-empty--ok{border-style:solid;border-color:var(--dsc-neon-dim);color:var(--dsc-neon)}.dsc-btn:disabled{opacity:.45;cursor:not-allowed}.dsc-glass{background:var(--dsc-glass);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid var(--dsc-glass-border);border-radius:var(--dsc-radius-lg);box-shadow:var(--dsc-shadow)}.dsc-glass--glow{border-color:var(--dsc-teal-dim);box-shadow:0 0 0 1px #26c6da26,0 0 24px #26c6da1f}.dsc-icon-btn{appearance:none;width:36px;height:36px;padding:0;display:inline-flex;align-items:center;justify-content:center;border-radius:10px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);cursor:pointer;box-shadow:var(--dsc-shadow-tight);transition:border-color .12s ease,background .12s ease,transform .1s ease}.dsc-icon-btn:hover{border-color:var(--dsc-teal-dim);color:var(--dsc-teal)}.dsc-icon-btn:active{transform:translateY(1px)}.dsc-result-chip{display:inline-flex;align-items:center;gap:8px;max-width:100%;padding:8px 12px;border-radius:999px;border:1px solid var(--dsc-teal-dim);background:#26c6da1a;color:var(--dsc-white);font-size:.9rem}.dsc-result-chip span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dsc-overflow{position:relative;display:inline-block}.dsc-overflow-menu{position:absolute;right:0;top:calc(100% + 6px);z-index:40;min-width:180px;padding:6px;background:var(--dsc-black-2);border:1px solid var(--dsc-gray-3);border-radius:10px;box-shadow:var(--dsc-shadow)}.dsc-overflow-menu button{appearance:none;width:100%;text-align:left;border:0;background:transparent;color:var(--dsc-white);font:inherit;font-size:.88rem;padding:10px 12px;border-radius:8px;cursor:pointer}.dsc-overflow-menu button:hover{background:#26c6da1f;color:var(--dsc-teal)}.dsc-drawer-root{position:fixed;inset:0;z-index:80;pointer-events:none;visibility:hidden}.dsc-drawer-root.is-open{pointer-events:auto;visibility:visible}.dsc-drawer-scrim{position:absolute;inset:0;background:#00000073;opacity:0;transition:opacity .18s ease}.dsc-drawer-root.is-open .dsc-drawer-scrim{opacity:1}.dsc-drawer-panel{position:absolute;top:0;bottom:0;width:min(380px,92vw);background:linear-gradient(165deg,#121a16,#0a100e);border:1px solid var(--dsc-glass-border);box-shadow:-12px 0 40px #0000008c;display:flex;flex-direction:column;transition:transform .22s ease}.dsc-drawer-panel.right{right:0;transform:translate(105%);border-radius:14px 0 0 14px}.dsc-drawer-panel.left{left:0;transform:translate(-105%);border-radius:0 14px 14px 0}.dsc-drawer-root.is-open .dsc-drawer-panel.right,.dsc-drawer-root.is-open .dsc-drawer-panel.left{transform:none}.dsc-drawer-rail{position:absolute;top:50%;transform:translateY(-50%);width:28px;height:64px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:2}.dsc-drawer-root:not(.is-open) .dsc-drawer-rail,.dsc-drawer-root:not(.is-open) .dsc-drawer-panel{display:none}.dsc-drawer-panel.right .dsc-drawer-rail{left:-28px;border-radius:10px 0 0 10px}.dsc-drawer-panel.left .dsc-drawer-rail{right:-28px;border-radius:0 10px 10px 0}.dsc-drawer-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid var(--dsc-gray-3)}.dsc-drawer-head h2{margin:0;font-size:.85rem;letter-spacing:.12em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-drawer-body{flex:1;overflow:auto;padding:14px 16px}.dsc-soil{width:100%;max-width:280px;margin:0 auto}.dsc-soil-pot{position:relative;width:100%;aspect-ratio:4 / 5;border-radius:12px 12px 28px 28px;border:2px solid rgba(120,160,130,.45);background:linear-gradient(180deg,#1a1410,#0e0c0a);overflow:hidden;box-shadow:inset 0 0 24px #0000008c,0 0 20px #26c6da14}.dsc-soil-pot.is-valid{border-color:var(--dsc-teal-dim);box-shadow:inset 0 0 24px #0000008c,0 0 28px #26c6da47,0 0 42px #39ff141f}.dsc-soil-layer{position:absolute;left:8%;right:8%;display:flex;align-items:center;justify-content:center;font-size:.72rem;letter-spacing:.04em;color:#f4f7f4eb;text-shadow:0 1px 2px rgba(0,0,0,.65);border-top:1px solid rgba(255,255,255,.08)}.dsc-soil-empty{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--dsc-gray-5);font-size:.85rem;padding:16px;text-align:center}.dsc-seat-layout{display:grid;grid-template-columns:minmax(200px,320px) 1fr;gap:18px;align-items:start}@media(max-width:900px){.dsc-seat-layout{grid-template-columns:1fr}}.dsc-seat-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.dsc-table{width:100%;border-collapse:collapse;font-size:.88rem}.dsc-table th,.dsc-table td{text-align:left;padding:8px 6px;border-bottom:1px solid var(--dsc-gray-3)}.dsc-table th{font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--dsc-gray-5);font-weight:600}.dsc-table tr{cursor:pointer}.dsc-table tr:hover td{background:#26c6da0f}.dsc-btn.teal{border-color:var(--dsc-teal-dim);background:#26c6da2e;color:var(--dsc-white);box-shadow:0 0 18px #26c6da33}.dsc-btn.teal.primary{background:var(--dsc-teal);color:#041018;font-weight:650}.dsc-held-tag{margin-left:8px;font-size:.65rem;letter-spacing:.08em;color:var(--dsc-amber);vertical-align:middle}.dsc-kpi-hit,.dsc-gauge-hit{appearance:none;border:0;background:transparent;padding:0;margin:0;color:inherit;font:inherit;text-align:left;cursor:pointer;width:100%;display:block}.dsc-card.is-stale,.dsc-gauge.is-stale{opacity:.88;border-color:var(--dsc-amber)}.dsc-gauge.is-clickable:hover,.dsc-kpi-hit:hover .dsc-card{border-color:var(--dsc-blue-dim)}.dsc-timespan{display:inline-flex;flex-wrap:wrap;gap:6px}.dsc-spark-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}.dsc-sparkline{display:block;margin-top:4px}.dsc-gotwant{display:flex;flex-direction:column;gap:10px}.dsc-gotwant-row{display:grid;grid-template-columns:64px 1fr;gap:6px 10px;align-items:center}.dsc-gotwant-label{font-size:.75rem;color:var(--dsc-gray-5);letter-spacing:.04em}.dsc-gotwant-track{position:relative;height:10px;border-radius:999px;background:#ffffff0f;overflow:hidden;grid-column:2}.dsc-gotwant-want{position:absolute;inset:0 auto 0 0;background:#2ec4d647;border-right:1px solid var(--dsc-teal)}.dsc-gotwant-got{position:absolute;inset:2px auto 2px 0;background:linear-gradient(90deg,var(--dsc-blue),var(--dsc-teal));border-radius:999px}.dsc-gotwant-vals{grid-column:2;display:flex;justify-content:space-between;font-size:.72rem;font-family:var(--dsc-mono)}.dsc-seat-editors{display:grid;gap:10px}.dsc-seat-editors label{display:flex;flex-direction:column;gap:4px;font-size:.75rem;color:var(--dsc-gray-5)}.dsc-seat-editors input,.dsc-seat-editors select,.dsc-seat-editors textarea{background:var(--dsc-gray-1);border:1px solid var(--dsc-glass-border);border-radius:8px;color:var(--dsc-white);padding:8px 10px;font:inherit}.dsc-root-matrix .dsc-tone-ok{color:var(--dsc-neon)}.dsc-root-matrix .dsc-tone-warn{color:var(--dsc-amber)}.dsc-root-matrix .dsc-tone-bad{color:var(--dsc-bad)}.dsc-root-matrix .dsc-tone-stale{color:var(--dsc-amber);opacity:.85}.dsc-tent-cockpit-strip{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}@media(prefers-reduced-motion:reduce){.dsc-drawer-panel,.dsc-drawer-scrim{transition:none!important}}.dsc-decision-root{position:fixed;inset:0;z-index:120;display:flex;align-items:center;justify-content:center}.dsc-decision-scrim{position:absolute;inset:0;background:#04080ab8;backdrop-filter:blur(6px)}.dsc-decision-panel{position:relative;z-index:1;width:min(720px,94vw);max-height:86vh;overflow:auto;background:linear-gradient(165deg,#121a16,#0a100e);border:1px solid var(--dsc-glass-border);border-radius:14px;box-shadow:0 24px 80px #0000008c;padding:16px 18px}.dsc-decision-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.dsc-decision-head h2{margin:0;font-size:.95rem;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-decision-help{min-height:8px;margin-top:10px}.dsc-decision-foot{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}.dsc-chart.is-stale .dsc-chart-core{opacity:.72;stroke-dasharray:4 3}.dsc-chart.is-stale .dsc-chart-tip{display:none}.dsc-chart.is-stale .dsc-chart-last:after{content:" · held";color:var(--dsc-amber);font-size:.85em}.dsc-result-chip.is-empty{border-color:#78a08247;background:#121c1673;color:var(--dsc-gray-5)}.dsc-result-chip-hit{appearance:none;border:0;background:transparent;padding:0;color:inherit;font:inherit;cursor:pointer;max-width:100%}.dsc-coupled-mix .dsc-mix-row{display:grid;grid-template-columns:minmax(140px,1.2fr) 140px 48px 64px auto;gap:8px;align-items:end;margin-bottom:8px}.dsc-nutrient-slot{display:grid;grid-template-columns:minmax(140px,1fr) 88px 64px auto;gap:8px;align-items:end;margin-top:8px}.dsc-catalog-hits{list-style:none;margin:8px 0 0;padding:0;max-height:280px;overflow:auto}.dsc-catalog-hits button{appearance:none;width:100%;text-align:left;background:transparent;border:0;color:inherit;font:inherit;padding:8px 4px;cursor:pointer;display:flex;gap:8px}.dsc-catalog-hits button:hover{background:#26c6da1a}.dsc-catalog-picker input[type=search]{width:100%;box-sizing:border-box;background:var(--dsc-gray-1);border:1px solid var(--dsc-glass-border);border-radius:8px;color:var(--dsc-white);padding:8px 10px}.dsc-vessel-glyph{display:inline-flex;flex-direction:column;align-items:center;gap:2px}.dsc-vessel-glyph-label{font-size:.65rem;color:var(--dsc-gray-5)}.dsc-kit-constellation{width:100%;max-height:420px;color:inherit;margin-bottom:8px}.dsc-kit-pulse-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px}.dsc-kit-node{display:flex;align-items:center;gap:8px;padding:8px;border:1px dashed var(--dsc-gray-3);border-radius:10px}.dsc-kit-node.is-ok{border-style:solid;border-color:var(--dsc-teal-dim)}.dsc-kit-node i{width:10px;height:10px;border-radius:50%;background:var(--dsc-gray-5)}.dsc-kit-node.is-ok i{background:var(--dsc-neon)}.dsc-kit-node.is-held i{background:var(--dsc-amber)}.dsc-kit-node.is-oos i,.dsc-kit-node.is-missing i,.dsc-kit-node.is-dark i{background:transparent;border:1px dashed var(--dsc-bad)}.dsc-lung-svg,.dsc-tank-svg{width:100%;height:auto;color:var(--dsc-white)}.dsc-cal-curve{margin:12px 0 16px}.dsc-cal-curve strong{display:block;margin-bottom:6px}.dsc-honesty-hit{appearance:none;border:0;background:transparent;padding:0;cursor:pointer}.dsc-row-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.dsc-detail-list dt{font-size:.7rem;color:var(--dsc-gray-5);margin-top:8px}.dsc-detail-list dd{margin:0}button.dsc-chip{font:inherit;letter-spacing:inherit;text-transform:inherit;cursor:pointer;color:inherit}button.dsc-chip.is-clickable:hover{border-color:var(--dsc-teal)}.dsc-duty-hit{appearance:none;border:0;background:transparent;padding:0;width:100%;text-align:left;cursor:pointer;color:inherit;font:inherit}.dsc-duty-strip{display:flex;flex-direction:column;gap:4px;margin:8px 0}.dsc-duty-meta{display:flex;justify-content:space-between;gap:8px;font-size:.72rem;letter-spacing:.04em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-duty-svg{width:100%;height:18px;display:block}.dsc-inspector-playbook{margin:10px 0;padding:10px 12px;border:1px solid var(--dsc-glass-border);border-radius:10px;background:#00000038}.dsc-inspector-playbook strong{display:block;margin-bottom:4px}.dsc-inspector-playbook p{margin:4px 0}.dsc-stage-track{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px}.dsc-stage-pill{font-size:.65rem;letter-spacing:.04em;text-transform:uppercase;padding:5px 8px;border-radius:6px;background:var(--dsc-gray-2);color:var(--dsc-gray-5)}.dsc-stage-pill.is-on{background:color-mix(in srgb,var(--dsc-blue) 45%,transparent);color:var(--dsc-white)}.dsc-stage-pill.is-next{background:color-mix(in srgb,var(--dsc-amber) 22%,transparent);color:var(--dsc-amber)}.dsc-scheduler-lanes{display:flex;flex-direction:column;gap:6px;margin-top:8px}.dsc-scheduler-lane{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:8px 10px;border:1px solid var(--dsc-gray-3);border-radius:10px;background:#00000029;color:inherit;font:inherit;text-align:left;cursor:pointer}.dsc-scheduler-lane:hover:not(:disabled){border-color:var(--dsc-teal)}.dsc-scheduler-lane.is-oos,.dsc-scheduler-lane:disabled{opacity:.45;cursor:default}.dsc-air-path{display:flex;flex-direction:column;gap:8px}.dsc-air-svg{width:100%;height:auto;display:block;color:var(--dsc-white)}.dsc-target-heroes{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px}.dsc-tent-targets.is-hero{border-color:var(--dsc-teal-dim);padding:14px 16px}.dsc-target-hint{font-size:.65rem;color:var(--dsc-gray-5);letter-spacing:.03em}.dsc-got-want-hit{appearance:none;border:0;background:transparent;padding:0;width:100%;text-align:left;cursor:pointer;color:inherit;font:inherit}.dsc-pot-card-head{display:flex;align-items:center;gap:10px;cursor:pointer;margin-bottom:8px}.dsc-pot-card.is-oos{opacity:.72}.dsc-npk-hit{appearance:none;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:inherit;font:inherit;font-size:.75rem;border-radius:8px;padding:6px 8px;cursor:pointer}.dsc-npk-hit:hover{border-color:var(--dsc-teal)}.dsc-light-hero .dsc-honesty{font-size:.78rem}.dsc-dash-home .dsc-gauge-matrix--dense{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px 10px}.dsc-gauge-matrix--bands{display:flex;flex-direction:column;gap:10px}.dsc-gauge-matrix--bands .dsc-gauge-row-3 .dsc-band-cell{min-width:0;padding:6px 2px 8px}.dsc-gauge-matrix--bands .dsc-gauge-row-3:not(.is-lit){opacity:.72}.dsc-gauge-matrix--bands .dsc-gauge-row-3.is-lit{opacity:1}@keyframes dsc-fan-spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.dsc-fan-spin{animation:dsc-fan-spin 1.3s linear infinite;transform-origin:center center}.dsc-chip--fan .dsc-fan-spin:nth-child(1){animation-duration:1.3s}.dsc-dash-home .dsc-band-cell{display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 4px 10px;border-radius:12px;background:#0c121c59;border:1px solid rgba(130,165,230,.12);transition:box-shadow .25s ease,border-color .25s ease,background .25s ease}.dsc-dash-home .dsc-band-cell--main,.dsc-dash-home .dsc-band-cell--clone,.dsc-dash-home .dsc-band-cell--room,.dsc-dash-home .dsc-band-cell--root{border-color:#82a5e61f;background:#0c121c59;box-shadow:none}.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-ok){border-color:#66bb6a6b;background:linear-gradient(180deg,#66bb6a14,#0c121c59)}.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-warn),.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-stale){border-color:#ffb74d80;background:linear-gradient(180deg,#ffb74d14,#0c121c59)}.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-bad){border-color:#ef53508c;background:linear-gradient(180deg,#ef535014,#0c121c59)}.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-muted){border-color:#8b95a838;background:#0c121c47}.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-warn),.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-bad){animation:dsc-band-warn 2.6s ease-in-out infinite}@keyframes dsc-band-warn{0%,to{box-shadow:inset 0 0 16px #ffb74d0f}50%{box-shadow:inset 0 0 22px #ffb74d2e,0 0 18px #ffb74d1f}}.dsc-dash-home .dsc-band-cell .dsc-gauge-hit{width:auto;display:flex;justify-content:center}.dsc-dash-home .dsc-band-cell .dsc-gauge svg{width:100%;max-width:118px;height:auto}.dsc-band-cell{display:flex;flex-direction:column;align-items:center;gap:4px}.dsc-band-cell .dsc-sparkline{opacity:.85}.dsc-dash-home .dsc-legacy-host{max-height:min(52vh,520px);overflow:hidden;border-radius:10px}.dsc-dash-home .dsc-status-strip{margin-bottom:4px}.dsc-dash-home .dsc-gauge-matrix--pots{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:8px}.dsc-banner{border-radius:10px;padding:12px 14px;border-left:3px solid rgba(148,163,184,.5);background:#0f172a8c}.dsc-banner--warn{border-left-color:#fbbf24d9;background:#fbbf2414}.dsc-banner--bad{border-left-color:#ef4444e6;background:#ef44441a}.dsc-banner strong{display:block;margin-bottom:4px}.dsc-narrator{margin-top:12px;border:1px solid rgba(56,189,248,.25);border-left:3px solid rgba(56,189,248,.45);border-radius:10px;padding:10px 14px;background:#0c121c73}.dsc-narrator summary{cursor:pointer;font-weight:600;letter-spacing:.02em}.dsc-grow-log{font-size:13px;line-height:1.5;max-height:220px;overflow-y:auto}.dsc-grow-log li{padding:4px 0;border-bottom:1px solid rgba(148,163,184,.12)}.dsc-btn.dsc-btn-primary{background:var(--dsc-teal);border-color:var(--dsc-teal);color:#041018;font-weight:650;box-shadow:0 0 16px #26c6da47,var(--dsc-shadow-tight)}.dsc-btn.dsc-btn-primary:hover:not(:disabled){filter:brightness(1.1);box-shadow:0 0 22px #26c6da73,var(--dsc-shadow-tight)}.dsc-btn.dsc-btn-secondary{background:var(--dsc-gray-2);border-color:var(--dsc-gray-3);color:var(--dsc-white)}.dsc-btn.dsc-btn-secondary:hover:not(:disabled){border-color:var(--dsc-teal-dim);color:var(--dsc-teal)}.dsc-btn.dsc-btn-danger{background:#ef535024;border-color:#ef53508c;color:#ff9e9b;font-weight:600}.dsc-btn.dsc-btn-danger:hover:not(:disabled){background:#ef535042;border-color:var(--dsc-bad);color:#ffd7d5}.dsc-btn:disabled{opacity:.5;cursor:not-allowed}.dsc-btn:focus-visible,.dsc-icon-btn:focus-visible,button:focus-visible,[role=button]:focus-visible,a:focus-visible,summary:focus-visible{outline:2px solid var(--dsc-teal);outline-offset:2px}select:focus-visible,input:focus-visible,textarea:focus-visible{outline:2px solid var(--dsc-teal);outline-offset:1px}input[type=range]{appearance:none;-webkit-appearance:none;width:100%;height:28px;margin:0;background:transparent;cursor:pointer}input[type=range]::-webkit-slider-runnable-track{height:6px;border-radius:999px;background:var(--dsc-gray-3);border:1px solid var(--dsc-glass-border)}input[type=range]::-webkit-slider-thumb{appearance:none;-webkit-appearance:none;width:18px;height:18px;margin-top:-7px;border-radius:50%;background:var(--dsc-teal);border:2px solid var(--dsc-black);box-shadow:0 0 8px var(--dsc-teal-dim)}input[type=range]:hover:not(:disabled)::-webkit-slider-thumb{box-shadow:0 0 14px var(--dsc-teal-glow)}input[type=range]::-moz-range-track{height:6px;border-radius:999px;background:var(--dsc-gray-3);border:1px solid var(--dsc-glass-border)}input[type=range]::-moz-range-progress{height:6px;border-radius:999px;background:var(--dsc-teal-dim)}input[type=range]::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:var(--dsc-teal);border:2px solid var(--dsc-black);box-shadow:0 0 8px var(--dsc-teal-dim)}input[type=range]:disabled{opacity:.45;cursor:not-allowed}input[type=range]:disabled::-webkit-slider-thumb{background:var(--dsc-gray-4);box-shadow:none}select{appearance:none;-webkit-appearance:none;min-height:38px;border-radius:8px;border:1px solid var(--dsc-gray-3);background-color:var(--dsc-gray-2);color:var(--dsc-white);font:inherit;padding:8px 32px 8px 12px;cursor:pointer;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' fill='none' stroke='%238b95a8' stroke-width='2' stroke-linecap='round'/></svg>");background-repeat:no-repeat;background-position:right 10px center}select:hover:not(:disabled){border-color:var(--dsc-teal-dim)}select:disabled{opacity:.5;cursor:not-allowed}select option{background:var(--dsc-gray-1);color:var(--dsc-white)}input:not([type]),input[type=text],input[type=number],input[type=search],input[type=password],input[type=time],input[type=date],input[type=datetime-local],textarea{min-height:36px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);font:inherit;padding:8px 10px}input:not([type]):hover:not(:disabled),input[type=text]:hover:not(:disabled),input[type=number]:hover:not(:disabled),input[type=search]:hover:not(:disabled),textarea:hover:not(:disabled){border-color:var(--dsc-teal-dim)}input:not([type]):focus,input[type=text]:focus,input[type=number]:focus,input[type=search]:focus,textarea:focus{border-color:var(--dsc-teal)}input::placeholder,textarea::placeholder{color:var(--dsc-gray-4);opacity:.8}input[type=checkbox]{appearance:none;-webkit-appearance:none;width:18px;height:18px;flex:none;margin:0 6px 0 0;border-radius:5px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);display:inline-block;vertical-align:middle;position:relative;cursor:pointer}input[type=checkbox]:hover:not(:disabled){border-color:var(--dsc-teal-dim)}input[type=checkbox]:checked{background:var(--dsc-teal);border-color:var(--dsc-teal)}input[type=checkbox]:checked:after{content:"";position:absolute;left:5px;top:1.5px;width:5px;height:9px;border:solid #06121a;border-width:0 2px 2px 0;transform:rotate(45deg)}input[type=checkbox]:disabled{opacity:.45;cursor:not-allowed}.dsc-kit-pulse .dsc-kit-constellation{display:block;width:100%;background:#0003;border:1px solid var(--dsc-glass-border);border-radius:var(--dsc-radius);margin-bottom:10px}@keyframes dsc-kit-node-pulse{0%,to{filter:drop-shadow(0 0 0 rgba(38,198,218,0))}50%{filter:drop-shadow(0 0 6px rgba(38,198,218,.65))}}.dsc-kit-node-running{animation:dsc-kit-node-pulse 2.4s ease-in-out infinite}.dsc-inspector-details{margin-top:14px;border-top:1px solid var(--dsc-gray-3);padding-top:10px}.dsc-inspector-details summary{cursor:pointer;color:var(--dsc-gray-5);font-size:.75rem;letter-spacing:.08em;text-transform:uppercase}@media(prefers-reduced-motion:reduce){.dsc-kit-node-running{animation:none!important}}`, cw = ow;
function Wb() {
  const a = zt(), i = pt();
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Ct,
      {
        icon: "alert",
        title: "Not found",
        subtitle: `${a.pathname} is not a DSC route.`
      }
    ),
    /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: "Unknown hash — not a silent Mission redirect." }),
    /* @__PURE__ */ s.jsx(ae, { primary: !0, onClick: () => i("/live/overview"), children: "Go Overview" })
  ] });
}
function Is() {
  const a = zt(), i = rw(a.pathname, a.search);
  return i ? /* @__PURE__ */ s.jsx(Aa, { to: i, replace: !0 }) : /* @__PURE__ */ s.jsx(Wb, {});
}
function uw({ surfaceVersion: a = "7.2.0" }) {
  const i = zt(), r = pt(), o = iw(i.pathname), d = sw[o];
  return x.useEffect(() => {
    if (i.pathname === "/live/climate" || i.pathname === "/ops/home") return;
    const h = new URLSearchParams(i.search);
    if (!h.has("tent") && !h.has("zone")) return;
    h.delete("tent"), h.delete("zone");
    const f = h.toString();
    r({ pathname: i.pathname, search: f ? `?${f}` : "" }, { replace: !0 });
  }, [i.pathname, i.search, r]), /* @__PURE__ */ s.jsxs("div", { className: "dsc-shell", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-brand-row", children: [
      /* @__PURE__ */ s.jsxs(Yr, { className: "dsc-brand", to: "/live/overview", children: [
        /* @__PURE__ */ s.jsx(Zt, { name: "brand", size: 36, color: "var(--dsc-blue)" }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-brand-title", children: /* @__PURE__ */ s.jsx("strong", { children: "DSC - A Plausible Deniability Project." }) })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-muted", style: { fontSize: 12, letterSpacing: "0.08em" }, children: [
        "SURFACE ",
        a
      ] })
    ] }),
    /* @__PURE__ */ s.jsx(Y0, {}),
    /* @__PURE__ */ s.jsx("nav", { className: "dsc-primary-tabs", "aria-label": "Primary", children: aw.map((h) => /* @__PURE__ */ s.jsxs(
      Yr,
      {
        to: h.path,
        className: ({ isActive: f }) => `dsc-tab dsc-tab--${h.id}${f || o === h.id ? " active" : ""}`,
        children: [
          /* @__PURE__ */ s.jsx(Zt, { name: h.icon, size: 15 }),
          h.label
        ]
      },
      h.id
    )) }),
    d.length > 1 ? /* @__PURE__ */ s.jsx("nav", { className: "dsc-secondary-tabs", "aria-label": "Section pages", children: d.map((h) => /* @__PURE__ */ s.jsxs(
      Yr,
      {
        to: h.path,
        end: h.path === "/fleet",
        className: ({ isActive: f }) => `dsc-tab${h.demoted ? " dsc-tab--demoted" : ""}${f ? " active" : ""}`,
        children: [
          /* @__PURE__ */ s.jsx(Zt, { name: h.icon, size: 14 }),
          h.label
        ]
      },
      h.id
    )) }) : null,
    /* @__PURE__ */ s.jsx(K1, {}),
    /* @__PURE__ */ s.jsx(lb, { children: /* @__PURE__ */ s.jsxs(yy, { children: [
      /* @__PURE__ */ s.jsx(Oe, { path: "/", element: /* @__PURE__ */ s.jsx(Aa, { to: "/live/overview", replace: !0 }) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/live", element: /* @__PURE__ */ s.jsx(Aa, { to: "/live/overview", replace: !0 }) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/live/overview", element: /* @__PURE__ */ s.jsx(J2, {}) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/live/mission", element: /* @__PURE__ */ s.jsx(o2, {}) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/live/twin", element: /* @__PURE__ */ s.jsx(j_, {}) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/live/climate", element: /* @__PURE__ */ s.jsx(b2, {}) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/live/4x8", element: /* @__PURE__ */ s.jsx(j2, {}) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/live/2x4", element: /* @__PURE__ */ s.jsx(S2, {}) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/live/main", element: /* @__PURE__ */ s.jsx(Aa, { to: "/live/4x8", replace: !0 }) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/live/clone", element: /* @__PURE__ */ s.jsx(Aa, { to: "/live/2x4", replace: !0 }) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/live/root", element: /* @__PURE__ */ s.jsx(v2, {}) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/live/light", element: /* @__PURE__ */ s.jsx(w2, {}) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/grow", element: /* @__PURE__ */ s.jsx(Aa, { to: "/grow/roster", replace: !0 }) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/grow/compose", element: /* @__PURE__ */ s.jsx(X1, {}) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/grow/research", element: /* @__PURE__ */ s.jsx(Q1, {}) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/grow/roster", element: /* @__PURE__ */ s.jsx(Z1, {}) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/tune", element: /* @__PURE__ */ s.jsx(Aa, { to: "/tune/learning", replace: !0 }) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/tune/learning", element: /* @__PURE__ */ s.jsx(M2, {}) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/tune/analytics", element: /* @__PURE__ */ s.jsx(R2, {}) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/fleet", element: /* @__PURE__ */ s.jsx(A2, {}) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/fleet/calibrate", element: /* @__PURE__ */ s.jsx(I2, {}) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/fleet/settings", element: /* @__PURE__ */ s.jsx(V2, {}) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/settings", element: /* @__PURE__ */ s.jsx(Aa, { to: "/fleet/settings", replace: !0 }) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/ops/home", element: /* @__PURE__ */ s.jsx(nw, {}) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/ops/dash", element: /* @__PURE__ */ s.jsx(j_, {}) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/ops/*", element: /* @__PURE__ */ s.jsx(Is, {}) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/plant/*", element: /* @__PURE__ */ s.jsx(Is, {}) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/plant", element: /* @__PURE__ */ s.jsx(Is, {}) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/advanced/*", element: /* @__PURE__ */ s.jsx(Is, {}) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/advanced", element: /* @__PURE__ */ s.jsx(Is, {}) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "/system", element: /* @__PURE__ */ s.jsx(Is, {}) }),
      /* @__PURE__ */ s.jsx(Oe, { path: "*", element: /* @__PURE__ */ s.jsx(Wb, {}) })
    ] }) }),
    /* @__PURE__ */ s.jsx(s1, {})
  ] });
}
function dw({
  hass: a,
  surfaceVersion: i = "7.2.0",
  hassRevision: r = 0,
  fleetSource: o = "ha"
}) {
  return /* @__PURE__ */ s.jsx(r0, { hass: a, revision: r, children: /* @__PURE__ */ s.jsx(I1, { children: /* @__PURE__ */ s.jsx(L1, { children: /* @__PURE__ */ s.jsx(P1, { children: /* @__PURE__ */ s.jsx(uw, { surfaceVersion: i }) }) }) }) });
}
function hw({
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
  }, [a]), /* @__PURE__ */ s.jsx(b0, { hass: i, tick: o, source: "ha", children: /* @__PURE__ */ s.jsx(Xy, { children: /* @__PURE__ */ s.jsx(dw, { hass: i, fleetSource: "ha" }) }) });
}
class fw extends HTMLElement {
  constructor() {
    super(...arguments);
    ti(this, "_root", null);
    ti(this, "_hass", null);
    ti(this, "_mounted", !1);
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
${cw}`, this.shadowRoot.appendChild(r);
      const o = document.createElement("div");
      o.className = "dsc-root", o.style.height = "100%", this.shadowRoot.appendChild(o), this._root = wx.createRoot(o), this._root.render(
        /* @__PURE__ */ s.jsx(lb, { children: /* @__PURE__ */ s.jsx(hw, { panel: this }) })
      ), this._mounted = !0;
    }
  }
  disconnectedCallback() {
    this._root?.unmount(), this._root = null, this._mounted = !1;
  }
}
customElements.get("dsc-hub-panel") || customElements.define("dsc-hub-panel", fw);
export {
  fw as default
};
//# sourceMappingURL=dsc-hub-panel.js.map
