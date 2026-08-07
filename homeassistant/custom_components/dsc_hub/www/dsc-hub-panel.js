var Ey = Object.defineProperty;
var _y = (i, s, o) => s in i ? Ey(i, s, { enumerable: !0, configurable: !0, writable: !0, value: o }) : i[s] = o;
var oi = (i, s, o) => _y(i, typeof s != "symbol" ? s + "" : s, o);
var Vf = { exports: {} }, Gn = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var dh;
function Ty() {
  if (dh) return Gn;
  dh = 1;
  var i = Symbol.for("react.transitional.element"), s = Symbol.for("react.fragment");
  function o(f, h, m) {
    var S = null;
    if (m !== void 0 && (S = "" + m), h.key !== void 0 && (S = "" + h.key), "key" in h) {
      m = {};
      for (var T in h)
        T !== "key" && (m[T] = h[T]);
    } else m = h;
    return h = m.ref, {
      $$typeof: i,
      type: f,
      key: S,
      ref: h !== void 0 ? h : null,
      props: m
    };
  }
  return Gn.Fragment = s, Gn.jsx = o, Gn.jsxs = o, Gn;
}
var hh;
function zy() {
  return hh || (hh = 1, Vf.exports = Ty()), Vf.exports;
}
var d = zy(), wf = { exports: {} }, I = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var mh;
function Ay() {
  if (mh) return I;
  mh = 1;
  var i = Symbol.for("react.transitional.element"), s = Symbol.for("react.portal"), o = Symbol.for("react.fragment"), f = Symbol.for("react.strict_mode"), h = Symbol.for("react.profiler"), m = Symbol.for("react.consumer"), S = Symbol.for("react.context"), T = Symbol.for("react.forward_ref"), b = Symbol.for("react.suspense"), y = Symbol.for("react.memo"), O = Symbol.for("react.lazy"), A = Symbol.for("react.activity"), B = Symbol.iterator;
  function Z(g) {
    return g === null || typeof g != "object" ? null : (g = B && g[B] || g["@@iterator"], typeof g == "function" ? g : null);
  }
  var V = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, Y = Object.assign, H = {};
  function K(g, U, L) {
    this.props = g, this.context = U, this.refs = H, this.updater = L || V;
  }
  K.prototype.isReactComponent = {}, K.prototype.setState = function(g, U) {
    if (typeof g != "object" && typeof g != "function" && g != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, g, U, "setState");
  }, K.prototype.forceUpdate = function(g) {
    this.updater.enqueueForceUpdate(this, g, "forceUpdate");
  };
  function W() {
  }
  W.prototype = K.prototype;
  function $(g, U, L) {
    this.props = g, this.context = U, this.refs = H, this.updater = L || V;
  }
  var dt = $.prototype = new W();
  dt.constructor = $, Y(dt, K.prototype), dt.isPureReactComponent = !0;
  var bt = Array.isArray;
  function Rt() {
  }
  var F = { H: null, A: null, T: null, S: null }, Mt = Object.prototype.hasOwnProperty;
  function kt(g, U, L) {
    var X = L.ref;
    return {
      $$typeof: i,
      type: g,
      key: U,
      ref: X !== void 0 ? X : null,
      props: L
    };
  }
  function qe(g, U) {
    return kt(g.type, U, g.props);
  }
  function be(g) {
    return typeof g == "object" && g !== null && g.$$typeof === i;
  }
  function Wt(g) {
    var U = { "=": "=0", ":": "=2" };
    return "$" + g.replace(/[=:]/g, function(L) {
      return U[L];
    });
  }
  var Le = /\/+/g;
  function Se(g, U) {
    return typeof g == "object" && g !== null && g.key != null ? Wt("" + g.key) : U.toString(36);
  }
  function Ht(g) {
    switch (g.status) {
      case "fulfilled":
        return g.value;
      case "rejected":
        throw g.reason;
      default:
        switch (typeof g.status == "string" ? g.then(Rt, Rt) : (g.status = "pending", g.then(
          function(U) {
            g.status === "pending" && (g.status = "fulfilled", g.value = U);
          },
          function(U) {
            g.status === "pending" && (g.status = "rejected", g.reason = U);
          }
        )), g.status) {
          case "fulfilled":
            return g.value;
          case "rejected":
            throw g.reason;
        }
    }
    throw g;
  }
  function M(g, U, L, X, P) {
    var lt = typeof g;
    (lt === "undefined" || lt === "boolean") && (g = null);
    var ot = !1;
    if (g === null) ot = !0;
    else
      switch (lt) {
        case "bigint":
        case "string":
        case "number":
          ot = !0;
          break;
        case "object":
          switch (g.$$typeof) {
            case i:
            case s:
              ot = !0;
              break;
            case O:
              return ot = g._init, M(
                ot(g._payload),
                U,
                L,
                X,
                P
              );
          }
      }
    if (ot)
      return P = P(g), ot = X === "" ? "." + Se(g, 0) : X, bt(P) ? (L = "", ot != null && (L = ot.replace(Le, "$&/") + "/"), M(P, U, L, "", function(Ka) {
        return Ka;
      })) : P != null && (be(P) && (P = qe(
        P,
        L + (P.key == null || g && g.key === P.key ? "" : ("" + P.key).replace(
          Le,
          "$&/"
        ) + "/") + ot
      )), U.push(P)), 1;
    ot = 0;
    var Pt = X === "" ? "." : X + ":";
    if (bt(g))
      for (var Ct = 0; Ct < g.length; Ct++)
        X = g[Ct], lt = Pt + Se(X, Ct), ot += M(
          X,
          U,
          L,
          lt,
          P
        );
    else if (Ct = Z(g), typeof Ct == "function")
      for (g = Ct.call(g), Ct = 0; !(X = g.next()).done; )
        X = X.value, lt = Pt + Se(X, Ct++), ot += M(
          X,
          U,
          L,
          lt,
          P
        );
    else if (lt === "object") {
      if (typeof g.then == "function")
        return M(
          Ht(g),
          U,
          L,
          X,
          P
        );
      throw U = String(g), Error(
        "Objects are not valid as a React child (found: " + (U === "[object Object]" ? "object with keys {" + Object.keys(g).join(", ") + "}" : U) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return ot;
  }
  function q(g, U, L) {
    if (g == null) return g;
    var X = [], P = 0;
    return M(g, X, "", "", function(lt) {
      return U.call(L, lt, P++);
    }), X;
  }
  function k(g) {
    if (g._status === -1) {
      var U = g._result;
      U = U(), U.then(
        function(L) {
          (g._status === 0 || g._status === -1) && (g._status = 1, g._result = L);
        },
        function(L) {
          (g._status === 0 || g._status === -1) && (g._status = 2, g._result = L);
        }
      ), g._status === -1 && (g._status = 0, g._result = U);
    }
    if (g._status === 1) return g._result.default;
    throw g._result;
  }
  var vt = typeof reportError == "function" ? reportError : function(g) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var U = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof g == "object" && g !== null && typeof g.message == "string" ? String(g.message) : String(g),
        error: g
      });
      if (!window.dispatchEvent(U)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", g);
      return;
    }
    console.error(g);
  }, St = {
    map: q,
    forEach: function(g, U, L) {
      q(
        g,
        function() {
          U.apply(this, arguments);
        },
        L
      );
    },
    count: function(g) {
      var U = 0;
      return q(g, function() {
        U++;
      }), U;
    },
    toArray: function(g) {
      return q(g, function(U) {
        return U;
      }) || [];
    },
    only: function(g) {
      if (!be(g))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return g;
    }
  };
  return I.Activity = A, I.Children = St, I.Component = K, I.Fragment = o, I.Profiler = h, I.PureComponent = $, I.StrictMode = f, I.Suspense = b, I.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = F, I.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(g) {
      return F.H.useMemoCache(g);
    }
  }, I.cache = function(g) {
    return function() {
      return g.apply(null, arguments);
    };
  }, I.cacheSignal = function() {
    return null;
  }, I.cloneElement = function(g, U, L) {
    if (g == null)
      throw Error(
        "The argument must be a React element, but you passed " + g + "."
      );
    var X = Y({}, g.props), P = g.key;
    if (U != null)
      for (lt in U.key !== void 0 && (P = "" + U.key), U)
        !Mt.call(U, lt) || lt === "key" || lt === "__self" || lt === "__source" || lt === "ref" && U.ref === void 0 || (X[lt] = U[lt]);
    var lt = arguments.length - 2;
    if (lt === 1) X.children = L;
    else if (1 < lt) {
      for (var ot = Array(lt), Pt = 0; Pt < lt; Pt++)
        ot[Pt] = arguments[Pt + 2];
      X.children = ot;
    }
    return kt(g.type, P, X);
  }, I.createContext = function(g) {
    return g = {
      $$typeof: S,
      _currentValue: g,
      _currentValue2: g,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, g.Provider = g, g.Consumer = {
      $$typeof: m,
      _context: g
    }, g;
  }, I.createElement = function(g, U, L) {
    var X, P = {}, lt = null;
    if (U != null)
      for (X in U.key !== void 0 && (lt = "" + U.key), U)
        Mt.call(U, X) && X !== "key" && X !== "__self" && X !== "__source" && (P[X] = U[X]);
    var ot = arguments.length - 2;
    if (ot === 1) P.children = L;
    else if (1 < ot) {
      for (var Pt = Array(ot), Ct = 0; Ct < ot; Ct++)
        Pt[Ct] = arguments[Ct + 2];
      P.children = Pt;
    }
    if (g && g.defaultProps)
      for (X in ot = g.defaultProps, ot)
        P[X] === void 0 && (P[X] = ot[X]);
    return kt(g, lt, P);
  }, I.createRef = function() {
    return { current: null };
  }, I.forwardRef = function(g) {
    return { $$typeof: T, render: g };
  }, I.isValidElement = be, I.lazy = function(g) {
    return {
      $$typeof: O,
      _payload: { _status: -1, _result: g },
      _init: k
    };
  }, I.memo = function(g, U) {
    return {
      $$typeof: y,
      type: g,
      compare: U === void 0 ? null : U
    };
  }, I.startTransition = function(g) {
    var U = F.T, L = {};
    F.T = L;
    try {
      var X = g(), P = F.S;
      P !== null && P(L, X), typeof X == "object" && X !== null && typeof X.then == "function" && X.then(Rt, vt);
    } catch (lt) {
      vt(lt);
    } finally {
      U !== null && L.types !== null && (U.types = L.types), F.T = U;
    }
  }, I.unstable_useCacheRefresh = function() {
    return F.H.useCacheRefresh();
  }, I.use = function(g) {
    return F.H.use(g);
  }, I.useActionState = function(g, U, L) {
    return F.H.useActionState(g, U, L);
  }, I.useCallback = function(g, U) {
    return F.H.useCallback(g, U);
  }, I.useContext = function(g) {
    return F.H.useContext(g);
  }, I.useDebugValue = function() {
  }, I.useDeferredValue = function(g, U) {
    return F.H.useDeferredValue(g, U);
  }, I.useEffect = function(g, U) {
    return F.H.useEffect(g, U);
  }, I.useEffectEvent = function(g) {
    return F.H.useEffectEvent(g);
  }, I.useId = function() {
    return F.H.useId();
  }, I.useImperativeHandle = function(g, U, L) {
    return F.H.useImperativeHandle(g, U, L);
  }, I.useInsertionEffect = function(g, U) {
    return F.H.useInsertionEffect(g, U);
  }, I.useLayoutEffect = function(g, U) {
    return F.H.useLayoutEffect(g, U);
  }, I.useMemo = function(g, U) {
    return F.H.useMemo(g, U);
  }, I.useOptimistic = function(g, U) {
    return F.H.useOptimistic(g, U);
  }, I.useReducer = function(g, U, L) {
    return F.H.useReducer(g, U, L);
  }, I.useRef = function(g) {
    return F.H.useRef(g);
  }, I.useState = function(g) {
    return F.H.useState(g);
  }, I.useSyncExternalStore = function(g, U, L) {
    return F.H.useSyncExternalStore(
      g,
      U,
      L
    );
  }, I.useTransition = function() {
    return F.H.useTransition();
  }, I.version = "19.2.8", I;
}
var vh;
function es() {
  return vh || (vh = 1, wf.exports = Ay()), wf.exports;
}
var j = es(), Kf = { exports: {} }, Xn = {}, Jf = { exports: {} }, $f = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var yh;
function Ry() {
  return yh || (yh = 1, (function(i) {
    function s(M, q) {
      var k = M.length;
      M.push(q);
      t: for (; 0 < k; ) {
        var vt = k - 1 >>> 1, St = M[vt];
        if (0 < h(St, q))
          M[vt] = q, M[k] = St, k = vt;
        else break t;
      }
    }
    function o(M) {
      return M.length === 0 ? null : M[0];
    }
    function f(M) {
      if (M.length === 0) return null;
      var q = M[0], k = M.pop();
      if (k !== q) {
        M[0] = k;
        t: for (var vt = 0, St = M.length, g = St >>> 1; vt < g; ) {
          var U = 2 * (vt + 1) - 1, L = M[U], X = U + 1, P = M[X];
          if (0 > h(L, k))
            X < St && 0 > h(P, L) ? (M[vt] = P, M[X] = k, vt = X) : (M[vt] = L, M[U] = k, vt = U);
          else if (X < St && 0 > h(P, k))
            M[vt] = P, M[X] = k, vt = X;
          else break t;
        }
      }
      return q;
    }
    function h(M, q) {
      var k = M.sortIndex - q.sortIndex;
      return k !== 0 ? k : M.id - q.id;
    }
    if (i.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var m = performance;
      i.unstable_now = function() {
        return m.now();
      };
    } else {
      var S = Date, T = S.now();
      i.unstable_now = function() {
        return S.now() - T;
      };
    }
    var b = [], y = [], O = 1, A = null, B = 3, Z = !1, V = !1, Y = !1, H = !1, K = typeof setTimeout == "function" ? setTimeout : null, W = typeof clearTimeout == "function" ? clearTimeout : null, $ = typeof setImmediate < "u" ? setImmediate : null;
    function dt(M) {
      for (var q = o(y); q !== null; ) {
        if (q.callback === null) f(y);
        else if (q.startTime <= M)
          f(y), q.sortIndex = q.expirationTime, s(b, q);
        else break;
        q = o(y);
      }
    }
    function bt(M) {
      if (Y = !1, dt(M), !V)
        if (o(b) !== null)
          V = !0, Rt || (Rt = !0, Wt());
        else {
          var q = o(y);
          q !== null && Ht(bt, q.startTime - M);
        }
    }
    var Rt = !1, F = -1, Mt = 5, kt = -1;
    function qe() {
      return H ? !0 : !(i.unstable_now() - kt < Mt);
    }
    function be() {
      if (H = !1, Rt) {
        var M = i.unstable_now();
        kt = M;
        var q = !0;
        try {
          t: {
            V = !1, Y && (Y = !1, W(F), F = -1), Z = !0;
            var k = B;
            try {
              e: {
                for (dt(M), A = o(b); A !== null && !(A.expirationTime > M && qe()); ) {
                  var vt = A.callback;
                  if (typeof vt == "function") {
                    A.callback = null, B = A.priorityLevel;
                    var St = vt(
                      A.expirationTime <= M
                    );
                    if (M = i.unstable_now(), typeof St == "function") {
                      A.callback = St, dt(M), q = !0;
                      break e;
                    }
                    A === o(b) && f(b), dt(M);
                  } else f(b);
                  A = o(b);
                }
                if (A !== null) q = !0;
                else {
                  var g = o(y);
                  g !== null && Ht(
                    bt,
                    g.startTime - M
                  ), q = !1;
                }
              }
              break t;
            } finally {
              A = null, B = k, Z = !1;
            }
            q = void 0;
          }
        } finally {
          q ? Wt() : Rt = !1;
        }
      }
    }
    var Wt;
    if (typeof $ == "function")
      Wt = function() {
        $(be);
      };
    else if (typeof MessageChannel < "u") {
      var Le = new MessageChannel(), Se = Le.port2;
      Le.port1.onmessage = be, Wt = function() {
        Se.postMessage(null);
      };
    } else
      Wt = function() {
        K(be, 0);
      };
    function Ht(M, q) {
      F = K(function() {
        M(i.unstable_now());
      }, q);
    }
    i.unstable_IdlePriority = 5, i.unstable_ImmediatePriority = 1, i.unstable_LowPriority = 4, i.unstable_NormalPriority = 3, i.unstable_Profiling = null, i.unstable_UserBlockingPriority = 2, i.unstable_cancelCallback = function(M) {
      M.callback = null;
    }, i.unstable_forceFrameRate = function(M) {
      0 > M || 125 < M ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : Mt = 0 < M ? Math.floor(1e3 / M) : 5;
    }, i.unstable_getCurrentPriorityLevel = function() {
      return B;
    }, i.unstable_next = function(M) {
      switch (B) {
        case 1:
        case 2:
        case 3:
          var q = 3;
          break;
        default:
          q = B;
      }
      var k = B;
      B = q;
      try {
        return M();
      } finally {
        B = k;
      }
    }, i.unstable_requestPaint = function() {
      H = !0;
    }, i.unstable_runWithPriority = function(M, q) {
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
      var k = B;
      B = M;
      try {
        return q();
      } finally {
        B = k;
      }
    }, i.unstable_scheduleCallback = function(M, q, k) {
      var vt = i.unstable_now();
      switch (typeof k == "object" && k !== null ? (k = k.delay, k = typeof k == "number" && 0 < k ? vt + k : vt) : k = vt, M) {
        case 1:
          var St = -1;
          break;
        case 2:
          St = 250;
          break;
        case 5:
          St = 1073741823;
          break;
        case 4:
          St = 1e4;
          break;
        default:
          St = 5e3;
      }
      return St = k + St, M = {
        id: O++,
        callback: q,
        priorityLevel: M,
        startTime: k,
        expirationTime: St,
        sortIndex: -1
      }, k > vt ? (M.sortIndex = k, s(y, M), o(b) === null && M === o(y) && (Y ? (W(F), F = -1) : Y = !0, Ht(bt, k - vt))) : (M.sortIndex = St, s(b, M), V || Z || (V = !0, Rt || (Rt = !0, Wt()))), M;
    }, i.unstable_shouldYield = qe, i.unstable_wrapCallback = function(M) {
      var q = B;
      return function() {
        var k = B;
        B = q;
        try {
          return M.apply(this, arguments);
        } finally {
          B = k;
        }
      };
    };
  })($f)), $f;
}
var ph;
function jy() {
  return ph || (ph = 1, Jf.exports = Ry()), Jf.exports;
}
var kf = { exports: {} }, Ft = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var gh;
function Oy() {
  if (gh) return Ft;
  gh = 1;
  var i = es();
  function s(b) {
    var y = "https://react.dev/errors/" + b;
    if (1 < arguments.length) {
      y += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var O = 2; O < arguments.length; O++)
        y += "&args[]=" + encodeURIComponent(arguments[O]);
    }
    return "Minified React error #" + b + "; visit " + y + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function o() {
  }
  var f = {
    d: {
      f: o,
      r: function() {
        throw Error(s(522));
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
  }, h = Symbol.for("react.portal");
  function m(b, y, O) {
    var A = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: h,
      key: A == null ? null : "" + A,
      children: b,
      containerInfo: y,
      implementation: O
    };
  }
  var S = i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function T(b, y) {
    if (b === "font") return "";
    if (typeof y == "string")
      return y === "use-credentials" ? y : "";
  }
  return Ft.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = f, Ft.createPortal = function(b, y) {
    var O = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!y || y.nodeType !== 1 && y.nodeType !== 9 && y.nodeType !== 11)
      throw Error(s(299));
    return m(b, y, null, O);
  }, Ft.flushSync = function(b) {
    var y = S.T, O = f.p;
    try {
      if (S.T = null, f.p = 2, b) return b();
    } finally {
      S.T = y, f.p = O, f.d.f();
    }
  }, Ft.preconnect = function(b, y) {
    typeof b == "string" && (y ? (y = y.crossOrigin, y = typeof y == "string" ? y === "use-credentials" ? y : "" : void 0) : y = null, f.d.C(b, y));
  }, Ft.prefetchDNS = function(b) {
    typeof b == "string" && f.d.D(b);
  }, Ft.preinit = function(b, y) {
    if (typeof b == "string" && y && typeof y.as == "string") {
      var O = y.as, A = T(O, y.crossOrigin), B = typeof y.integrity == "string" ? y.integrity : void 0, Z = typeof y.fetchPriority == "string" ? y.fetchPriority : void 0;
      O === "style" ? f.d.S(
        b,
        typeof y.precedence == "string" ? y.precedence : void 0,
        {
          crossOrigin: A,
          integrity: B,
          fetchPriority: Z
        }
      ) : O === "script" && f.d.X(b, {
        crossOrigin: A,
        integrity: B,
        fetchPriority: Z,
        nonce: typeof y.nonce == "string" ? y.nonce : void 0
      });
    }
  }, Ft.preinitModule = function(b, y) {
    if (typeof b == "string")
      if (typeof y == "object" && y !== null) {
        if (y.as == null || y.as === "script") {
          var O = T(
            y.as,
            y.crossOrigin
          );
          f.d.M(b, {
            crossOrigin: O,
            integrity: typeof y.integrity == "string" ? y.integrity : void 0,
            nonce: typeof y.nonce == "string" ? y.nonce : void 0
          });
        }
      } else y == null && f.d.M(b);
  }, Ft.preload = function(b, y) {
    if (typeof b == "string" && typeof y == "object" && y !== null && typeof y.as == "string") {
      var O = y.as, A = T(O, y.crossOrigin);
      f.d.L(b, O, {
        crossOrigin: A,
        integrity: typeof y.integrity == "string" ? y.integrity : void 0,
        nonce: typeof y.nonce == "string" ? y.nonce : void 0,
        type: typeof y.type == "string" ? y.type : void 0,
        fetchPriority: typeof y.fetchPriority == "string" ? y.fetchPriority : void 0,
        referrerPolicy: typeof y.referrerPolicy == "string" ? y.referrerPolicy : void 0,
        imageSrcSet: typeof y.imageSrcSet == "string" ? y.imageSrcSet : void 0,
        imageSizes: typeof y.imageSizes == "string" ? y.imageSizes : void 0,
        media: typeof y.media == "string" ? y.media : void 0
      });
    }
  }, Ft.preloadModule = function(b, y) {
    if (typeof b == "string")
      if (y) {
        var O = T(y.as, y.crossOrigin);
        f.d.m(b, {
          as: typeof y.as == "string" && y.as !== "script" ? y.as : void 0,
          crossOrigin: O,
          integrity: typeof y.integrity == "string" ? y.integrity : void 0
        });
      } else f.d.m(b);
  }, Ft.requestFormReset = function(b) {
    f.d.r(b);
  }, Ft.unstable_batchedUpdates = function(b, y) {
    return b(y);
  }, Ft.useFormState = function(b, y, O) {
    return S.H.useFormState(b, y, O);
  }, Ft.useFormStatus = function() {
    return S.H.useHostTransitionStatus();
  }, Ft.version = "19.2.8", Ft;
}
var bh;
function Ny() {
  if (bh) return kf.exports;
  bh = 1;
  function i() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i);
      } catch (s) {
        console.error(s);
      }
  }
  return i(), kf.exports = Oy(), kf.exports;
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
var Sh;
function My() {
  if (Sh) return Xn;
  Sh = 1;
  var i = jy(), s = es(), o = Ny();
  function f(t) {
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
  function S(t) {
    if (t.tag === 13) {
      var e = t.memoizedState;
      if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
    }
    return null;
  }
  function T(t) {
    if (t.tag === 31) {
      var e = t.memoizedState;
      if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
    }
    return null;
  }
  function b(t) {
    if (m(t) !== t)
      throw Error(f(188));
  }
  function y(t) {
    var e = t.alternate;
    if (!e) {
      if (e = m(t), e === null) throw Error(f(188));
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
          if (u === l) return b(n), t;
          if (u === a) return b(n), e;
          u = u.sibling;
        }
        throw Error(f(188));
      }
      if (l.return !== a.return) l = n, a = u;
      else {
        for (var c = !1, r = n.child; r; ) {
          if (r === l) {
            c = !0, l = n, a = u;
            break;
          }
          if (r === a) {
            c = !0, a = n, l = u;
            break;
          }
          r = r.sibling;
        }
        if (!c) {
          for (r = u.child; r; ) {
            if (r === l) {
              c = !0, l = u, a = n;
              break;
            }
            if (r === a) {
              c = !0, a = u, l = n;
              break;
            }
            r = r.sibling;
          }
          if (!c) throw Error(f(189));
        }
      }
      if (l.alternate !== a) throw Error(f(190));
    }
    if (l.tag !== 3) throw Error(f(188));
    return l.stateNode.current === l ? t : e;
  }
  function O(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t;
    for (t = t.child; t !== null; ) {
      if (e = O(t), e !== null) return e;
      t = t.sibling;
    }
    return null;
  }
  var A = Object.assign, B = Symbol.for("react.element"), Z = Symbol.for("react.transitional.element"), V = Symbol.for("react.portal"), Y = Symbol.for("react.fragment"), H = Symbol.for("react.strict_mode"), K = Symbol.for("react.profiler"), W = Symbol.for("react.consumer"), $ = Symbol.for("react.context"), dt = Symbol.for("react.forward_ref"), bt = Symbol.for("react.suspense"), Rt = Symbol.for("react.suspense_list"), F = Symbol.for("react.memo"), Mt = Symbol.for("react.lazy"), kt = Symbol.for("react.activity"), qe = Symbol.for("react.memo_cache_sentinel"), be = Symbol.iterator;
  function Wt(t) {
    return t === null || typeof t != "object" ? null : (t = be && t[be] || t["@@iterator"], typeof t == "function" ? t : null);
  }
  var Le = Symbol.for("react.client.reference");
  function Se(t) {
    if (t == null) return null;
    if (typeof t == "function")
      return t.$$typeof === Le ? null : t.displayName || t.name || null;
    if (typeof t == "string") return t;
    switch (t) {
      case Y:
        return "Fragment";
      case K:
        return "Profiler";
      case H:
        return "StrictMode";
      case bt:
        return "Suspense";
      case Rt:
        return "SuspenseList";
      case kt:
        return "Activity";
    }
    if (typeof t == "object")
      switch (t.$$typeof) {
        case V:
          return "Portal";
        case $:
          return t.displayName || "Context";
        case W:
          return (t._context.displayName || "Context") + ".Consumer";
        case dt:
          var e = t.render;
          return t = t.displayName, t || (t = e.displayName || e.name || "", t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"), t;
        case F:
          return e = t.displayName || null, e !== null ? e : Se(t.type) || "Memo";
        case Mt:
          e = t._payload, t = t._init;
          try {
            return Se(t(e));
          } catch {
          }
      }
    return null;
  }
  var Ht = Array.isArray, M = s.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, q = o.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, k = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, vt = [], St = -1;
  function g(t) {
    return { current: t };
  }
  function U(t) {
    0 > St || (t.current = vt[St], vt[St] = null, St--);
  }
  function L(t, e) {
    St++, vt[St] = t.current, t.current = e;
  }
  var X = g(null), P = g(null), lt = g(null), ot = g(null);
  function Pt(t, e) {
    switch (L(lt, e), L(P, t), L(X, null), e.nodeType) {
      case 9:
      case 11:
        t = (t = e.documentElement) && (t = t.namespaceURI) ? Hd(t) : 0;
        break;
      default:
        if (t = e.tagName, e = e.namespaceURI)
          e = Hd(e), t = Bd(e, t);
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
    U(X), L(X, t);
  }
  function Ct() {
    U(X), U(P), U(lt);
  }
  function Ka(t) {
    t.memoizedState !== null && L(ot, t);
    var e = X.current, l = Bd(e, t.type);
    e !== l && (L(P, t), L(X, l));
  }
  function Jn(t) {
    P.current === t && (U(X), U(P)), ot.current === t && (U(ot), Bn._currentValue = k);
  }
  var zi, rs;
  function ql(t) {
    if (zi === void 0)
      try {
        throw Error();
      } catch (l) {
        var e = l.stack.trim().match(/\n( *(at )?)/);
        zi = e && e[1] || "", rs = -1 < l.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < l.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + zi + t + rs;
  }
  var Ai = !1;
  function Ri(t, e) {
    if (!t || Ai) return "";
    Ai = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (e) {
              var D = function() {
                throw Error();
              };
              if (Object.defineProperty(D.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(D, []);
                } catch (R) {
                  var z = R;
                }
                Reflect.construct(t, [], D);
              } else {
                try {
                  D.call();
                } catch (R) {
                  z = R;
                }
                t.call(D.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (R) {
                z = R;
              }
              (D = t()) && typeof D.catch == "function" && D.catch(function() {
              });
            }
          } catch (R) {
            if (R && z && typeof R.stack == "string")
              return [R.stack, z.stack];
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
      var u = a.DetermineComponentFrameRoot(), c = u[0], r = u[1];
      if (c && r) {
        var v = c.split(`
`), _ = r.split(`
`);
        for (n = a = 0; a < v.length && !v[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; n < _.length && !_[n].includes(
          "DetermineComponentFrameRoot"
        ); )
          n++;
        if (a === v.length || n === _.length)
          for (a = v.length - 1, n = _.length - 1; 1 <= a && 0 <= n && v[a] !== _[n]; )
            n--;
        for (; 1 <= a && 0 <= n; a--, n--)
          if (v[a] !== _[n]) {
            if (a !== 1 || n !== 1)
              do
                if (a--, n--, 0 > n || v[a] !== _[n]) {
                  var N = `
` + v[a].replace(" at new ", " at ");
                  return t.displayName && N.includes("<anonymous>") && (N = N.replace("<anonymous>", t.displayName)), N;
                }
              while (1 <= a && 0 <= n);
            break;
          }
      }
    } finally {
      Ai = !1, Error.prepareStackTrace = l;
    }
    return (l = t ? t.displayName || t.name : "") ? ql(l) : "";
  }
  function Ph(t, e) {
    switch (t.tag) {
      case 26:
      case 27:
      case 5:
        return ql(t.type);
      case 16:
        return ql("Lazy");
      case 13:
        return t.child !== e && e !== null ? ql("Suspense Fallback") : ql("Suspense");
      case 19:
        return ql("SuspenseList");
      case 0:
      case 15:
        return Ri(t.type, !1);
      case 11:
        return Ri(t.type.render, !1);
      case 1:
        return Ri(t.type, !0);
      case 31:
        return ql("Activity");
      default:
        return "";
    }
  }
  function os(t) {
    try {
      var e = "", l = null;
      do
        e += Ph(t, l), l = t, t = t.return;
      while (t);
      return e;
    } catch (a) {
      return `
Error generating stack: ` + a.message + `
` + a.stack;
    }
  }
  var ji = Object.prototype.hasOwnProperty, Oi = i.unstable_scheduleCallback, Ni = i.unstable_cancelCallback, tm = i.unstable_shouldYield, em = i.unstable_requestPaint, fe = i.unstable_now, lm = i.unstable_getCurrentPriorityLevel, ds = i.unstable_ImmediatePriority, hs = i.unstable_UserBlockingPriority, $n = i.unstable_NormalPriority, am = i.unstable_LowPriority, ms = i.unstable_IdlePriority, nm = i.log, um = i.unstable_setDisableYieldValue, Ja = null, se = null;
  function ol(t) {
    if (typeof nm == "function" && um(t), se && typeof se.setStrictMode == "function")
      try {
        se.setStrictMode(Ja, t);
      } catch {
      }
  }
  var re = Math.clz32 ? Math.clz32 : fm, im = Math.log, cm = Math.LN2;
  function fm(t) {
    return t >>>= 0, t === 0 ? 32 : 31 - (im(t) / cm | 0) | 0;
  }
  var kn = 256, Wn = 262144, Fn = 4194304;
  function Ll(t) {
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
  function In(t, e, l) {
    var a = t.pendingLanes;
    if (a === 0) return 0;
    var n = 0, u = t.suspendedLanes, c = t.pingedLanes;
    t = t.warmLanes;
    var r = a & 134217727;
    return r !== 0 ? (a = r & ~u, a !== 0 ? n = Ll(a) : (c &= r, c !== 0 ? n = Ll(c) : l || (l = r & ~t, l !== 0 && (n = Ll(l))))) : (r = a & ~u, r !== 0 ? n = Ll(r) : c !== 0 ? n = Ll(c) : l || (l = a & ~t, l !== 0 && (n = Ll(l)))), n === 0 ? 0 : e !== 0 && e !== n && (e & u) === 0 && (u = n & -n, l = e & -e, u >= l || u === 32 && (l & 4194048) !== 0) ? e : n;
  }
  function $a(t, e) {
    return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0;
  }
  function sm(t, e) {
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
  function vs() {
    var t = Fn;
    return Fn <<= 1, (Fn & 62914560) === 0 && (Fn = 4194304), t;
  }
  function Mi(t) {
    for (var e = [], l = 0; 31 > l; l++) e.push(t);
    return e;
  }
  function ka(t, e) {
    t.pendingLanes |= e, e !== 268435456 && (t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0);
  }
  function rm(t, e, l, a, n, u) {
    var c = t.pendingLanes;
    t.pendingLanes = l, t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0, t.expiredLanes &= l, t.entangledLanes &= l, t.errorRecoveryDisabledLanes &= l, t.shellSuspendCounter = 0;
    var r = t.entanglements, v = t.expirationTimes, _ = t.hiddenUpdates;
    for (l = c & ~l; 0 < l; ) {
      var N = 31 - re(l), D = 1 << N;
      r[N] = 0, v[N] = -1;
      var z = _[N];
      if (z !== null)
        for (_[N] = null, N = 0; N < z.length; N++) {
          var R = z[N];
          R !== null && (R.lane &= -536870913);
        }
      l &= ~D;
    }
    a !== 0 && ys(t, a, 0), u !== 0 && n === 0 && t.tag !== 0 && (t.suspendedLanes |= u & ~(c & ~e));
  }
  function ys(t, e, l) {
    t.pendingLanes |= e, t.suspendedLanes &= ~e;
    var a = 31 - re(e);
    t.entangledLanes |= e, t.entanglements[a] = t.entanglements[a] | 1073741824 | l & 261930;
  }
  function ps(t, e) {
    var l = t.entangledLanes |= e;
    for (t = t.entanglements; l; ) {
      var a = 31 - re(l), n = 1 << a;
      n & e | t[a] & e && (t[a] |= e), l &= ~n;
    }
  }
  function gs(t, e) {
    var l = e & -e;
    return l = (l & 42) !== 0 ? 1 : Ci(l), (l & (t.suspendedLanes | e)) !== 0 ? 0 : l;
  }
  function Ci(t) {
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
  function Di(t) {
    return t &= -t, 2 < t ? 8 < t ? (t & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function bs() {
    var t = q.p;
    return t !== 0 ? t : (t = window.event, t === void 0 ? 32 : uh(t.type));
  }
  function Ss(t, e) {
    var l = q.p;
    try {
      return q.p = t, e();
    } finally {
      q.p = l;
    }
  }
  var dl = Math.random().toString(36).slice(2), Vt = "__reactFiber$" + dl, ee = "__reactProps$" + dl, ia = "__reactContainer$" + dl, Ui = "__reactEvents$" + dl, om = "__reactListeners$" + dl, dm = "__reactHandles$" + dl, xs = "__reactResources$" + dl, Wa = "__reactMarker$" + dl;
  function Hi(t) {
    delete t[Vt], delete t[ee], delete t[Ui], delete t[om], delete t[dm];
  }
  function ca(t) {
    var e = t[Vt];
    if (e) return e;
    for (var l = t.parentNode; l; ) {
      if (e = l[ia] || l[Vt]) {
        if (l = e.alternate, e.child !== null || l !== null && l.child !== null)
          for (t = Zd(t); t !== null; ) {
            if (l = t[Vt]) return l;
            t = Zd(t);
          }
        return e;
      }
      t = l, l = t.parentNode;
    }
    return null;
  }
  function fa(t) {
    if (t = t[Vt] || t[ia]) {
      var e = t.tag;
      if (e === 5 || e === 6 || e === 13 || e === 31 || e === 26 || e === 27 || e === 3)
        return t;
    }
    return null;
  }
  function Fa(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t.stateNode;
    throw Error(f(33));
  }
  function sa(t) {
    var e = t[xs];
    return e || (e = t[xs] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), e;
  }
  function Xt(t) {
    t[Wa] = !0;
  }
  var Es = /* @__PURE__ */ new Set(), _s = {};
  function Yl(t, e) {
    ra(t, e), ra(t + "Capture", e);
  }
  function ra(t, e) {
    for (_s[t] = e, t = 0; t < e.length; t++)
      Es.add(e[t]);
  }
  var hm = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Ts = {}, zs = {};
  function mm(t) {
    return ji.call(zs, t) ? !0 : ji.call(Ts, t) ? !1 : hm.test(t) ? zs[t] = !0 : (Ts[t] = !0, !1);
  }
  function Pn(t, e, l) {
    if (mm(e))
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
  function tu(t, e, l) {
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
  function Ve(t, e, l, a) {
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
  function xe(t) {
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
  function As(t) {
    var e = t.type;
    return (t = t.nodeName) && t.toLowerCase() === "input" && (e === "checkbox" || e === "radio");
  }
  function vm(t, e, l) {
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
  function Bi(t) {
    if (!t._valueTracker) {
      var e = As(t) ? "checked" : "value";
      t._valueTracker = vm(
        t,
        e,
        "" + t[e]
      );
    }
  }
  function Rs(t) {
    if (!t) return !1;
    var e = t._valueTracker;
    if (!e) return !0;
    var l = e.getValue(), a = "";
    return t && (a = As(t) ? t.checked ? "true" : "false" : t.value), t = a, t !== l ? (e.setValue(t), !0) : !1;
  }
  function eu(t) {
    if (t = t || (typeof document < "u" ? document : void 0), typeof t > "u") return null;
    try {
      return t.activeElement || t.body;
    } catch {
      return t.body;
    }
  }
  var ym = /[\n"\\]/g;
  function Ee(t) {
    return t.replace(
      ym,
      function(e) {
        return "\\" + e.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function qi(t, e, l, a, n, u, c, r) {
    t.name = "", c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" ? t.type = c : t.removeAttribute("type"), e != null ? c === "number" ? (e === 0 && t.value === "" || t.value != e) && (t.value = "" + xe(e)) : t.value !== "" + xe(e) && (t.value = "" + xe(e)) : c !== "submit" && c !== "reset" || t.removeAttribute("value"), e != null ? Li(t, c, xe(e)) : l != null ? Li(t, c, xe(l)) : a != null && t.removeAttribute("value"), n == null && u != null && (t.defaultChecked = !!u), n != null && (t.checked = n && typeof n != "function" && typeof n != "symbol"), r != null && typeof r != "function" && typeof r != "symbol" && typeof r != "boolean" ? t.name = "" + xe(r) : t.removeAttribute("name");
  }
  function js(t, e, l, a, n, u, c, r) {
    if (u != null && typeof u != "function" && typeof u != "symbol" && typeof u != "boolean" && (t.type = u), e != null || l != null) {
      if (!(u !== "submit" && u !== "reset" || e != null)) {
        Bi(t);
        return;
      }
      l = l != null ? "" + xe(l) : "", e = e != null ? "" + xe(e) : l, r || e === t.value || (t.value = e), t.defaultValue = e;
    }
    a = a ?? n, a = typeof a != "function" && typeof a != "symbol" && !!a, t.checked = r ? t.checked : !!a, t.defaultChecked = !!a, c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" && (t.name = c), Bi(t);
  }
  function Li(t, e, l) {
    e === "number" && eu(t.ownerDocument) === t || t.defaultValue === "" + l || (t.defaultValue = "" + l);
  }
  function oa(t, e, l, a) {
    if (t = t.options, e) {
      e = {};
      for (var n = 0; n < l.length; n++)
        e["$" + l[n]] = !0;
      for (l = 0; l < t.length; l++)
        n = e.hasOwnProperty("$" + t[l].value), t[l].selected !== n && (t[l].selected = n), n && a && (t[l].defaultSelected = !0);
    } else {
      for (l = "" + xe(l), e = null, n = 0; n < t.length; n++) {
        if (t[n].value === l) {
          t[n].selected = !0, a && (t[n].defaultSelected = !0);
          return;
        }
        e !== null || t[n].disabled || (e = t[n]);
      }
      e !== null && (e.selected = !0);
    }
  }
  function Os(t, e, l) {
    if (e != null && (e = "" + xe(e), e !== t.value && (t.value = e), l == null)) {
      t.defaultValue !== e && (t.defaultValue = e);
      return;
    }
    t.defaultValue = l != null ? "" + xe(l) : "";
  }
  function Ns(t, e, l, a) {
    if (e == null) {
      if (a != null) {
        if (l != null) throw Error(f(92));
        if (Ht(a)) {
          if (1 < a.length) throw Error(f(93));
          a = a[0];
        }
        l = a;
      }
      l == null && (l = ""), e = l;
    }
    l = xe(e), t.defaultValue = l, a = t.textContent, a === l && a !== "" && a !== null && (t.value = a), Bi(t);
  }
  function da(t, e) {
    if (e) {
      var l = t.firstChild;
      if (l && l === t.lastChild && l.nodeType === 3) {
        l.nodeValue = e;
        return;
      }
    }
    t.textContent = e;
  }
  var pm = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Ms(t, e, l) {
    var a = e.indexOf("--") === 0;
    l == null || typeof l == "boolean" || l === "" ? a ? t.setProperty(e, "") : e === "float" ? t.cssFloat = "" : t[e] = "" : a ? t.setProperty(e, l) : typeof l != "number" || l === 0 || pm.has(e) ? e === "float" ? t.cssFloat = l : t[e] = ("" + l).trim() : t[e] = l + "px";
  }
  function Cs(t, e, l) {
    if (e != null && typeof e != "object")
      throw Error(f(62));
    if (t = t.style, l != null) {
      for (var a in l)
        !l.hasOwnProperty(a) || e != null && e.hasOwnProperty(a) || (a.indexOf("--") === 0 ? t.setProperty(a, "") : a === "float" ? t.cssFloat = "" : t[a] = "");
      for (var n in e)
        a = e[n], e.hasOwnProperty(n) && l[n] !== a && Ms(t, n, a);
    } else
      for (var u in e)
        e.hasOwnProperty(u) && Ms(t, u, e[u]);
  }
  function Yi(t) {
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
  var gm = /* @__PURE__ */ new Map([
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
  ]), bm = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function lu(t) {
    return bm.test("" + t) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : t;
  }
  function we() {
  }
  var Gi = null;
  function Xi(t) {
    return t = t.target || t.srcElement || window, t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === 3 ? t.parentNode : t;
  }
  var ha = null, ma = null;
  function Ds(t) {
    var e = fa(t);
    if (e && (t = e.stateNode)) {
      var l = t[ee] || null;
      t: switch (t = e.stateNode, e.type) {
        case "input":
          if (qi(
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
                var n = a[ee] || null;
                if (!n) throw Error(f(90));
                qi(
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
              a = l[e], a.form === t.form && Rs(a);
          }
          break t;
        case "textarea":
          Os(t, l.value, l.defaultValue);
          break t;
        case "select":
          e = l.value, e != null && oa(t, !!l.multiple, e, !1);
      }
    }
  }
  var Qi = !1;
  function Us(t, e, l) {
    if (Qi) return t(e, l);
    Qi = !0;
    try {
      var a = t(e);
      return a;
    } finally {
      if (Qi = !1, (ha !== null || ma !== null) && (Zu(), ha && (e = ha, t = ma, ma = ha = null, Ds(e), t)))
        for (e = 0; e < t.length; e++) Ds(t[e]);
    }
  }
  function Ia(t, e) {
    var l = t.stateNode;
    if (l === null) return null;
    var a = l[ee] || null;
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
        f(231, e, typeof l)
      );
    return l;
  }
  var Ke = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Zi = !1;
  if (Ke)
    try {
      var Pa = {};
      Object.defineProperty(Pa, "passive", {
        get: function() {
          Zi = !0;
        }
      }), window.addEventListener("test", Pa, Pa), window.removeEventListener("test", Pa, Pa);
    } catch {
      Zi = !1;
    }
  var hl = null, Vi = null, au = null;
  function Hs() {
    if (au) return au;
    var t, e = Vi, l = e.length, a, n = "value" in hl ? hl.value : hl.textContent, u = n.length;
    for (t = 0; t < l && e[t] === n[t]; t++) ;
    var c = l - t;
    for (a = 1; a <= c && e[l - a] === n[u - a]; a++) ;
    return au = n.slice(t, 1 < a ? 1 - a : void 0);
  }
  function nu(t) {
    var e = t.keyCode;
    return "charCode" in t ? (t = t.charCode, t === 0 && e === 13 && (t = 13)) : t = e, t === 10 && (t = 13), 32 <= t || t === 13 ? t : 0;
  }
  function uu() {
    return !0;
  }
  function Bs() {
    return !1;
  }
  function le(t) {
    function e(l, a, n, u, c) {
      this._reactName = l, this._targetInst = n, this.type = a, this.nativeEvent = u, this.target = c, this.currentTarget = null;
      for (var r in t)
        t.hasOwnProperty(r) && (l = t[r], this[r] = l ? l(u) : u[r]);
      return this.isDefaultPrevented = (u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1) ? uu : Bs, this.isPropagationStopped = Bs, this;
    }
    return A(e.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var l = this.nativeEvent;
        l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = uu);
      },
      stopPropagation: function() {
        var l = this.nativeEvent;
        l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = uu);
      },
      persist: function() {
      },
      isPersistent: uu
    }), e;
  }
  var Gl = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(t) {
      return t.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, iu = le(Gl), tn = A({}, Gl, { view: 0, detail: 0 }), Sm = le(tn), wi, Ki, en, cu = A({}, tn, {
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
    getModifierState: $i,
    button: 0,
    buttons: 0,
    relatedTarget: function(t) {
      return t.relatedTarget === void 0 ? t.fromElement === t.srcElement ? t.toElement : t.fromElement : t.relatedTarget;
    },
    movementX: function(t) {
      return "movementX" in t ? t.movementX : (t !== en && (en && t.type === "mousemove" ? (wi = t.screenX - en.screenX, Ki = t.screenY - en.screenY) : Ki = wi = 0, en = t), wi);
    },
    movementY: function(t) {
      return "movementY" in t ? t.movementY : Ki;
    }
  }), qs = le(cu), xm = A({}, cu, { dataTransfer: 0 }), Em = le(xm), _m = A({}, tn, { relatedTarget: 0 }), Ji = le(_m), Tm = A({}, Gl, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), zm = le(Tm), Am = A({}, Gl, {
    clipboardData: function(t) {
      return "clipboardData" in t ? t.clipboardData : window.clipboardData;
    }
  }), Rm = le(Am), jm = A({}, Gl, { data: 0 }), Ls = le(jm), Om = {
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
  }, Nm = {
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
  }, Mm = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function Cm(t) {
    var e = this.nativeEvent;
    return e.getModifierState ? e.getModifierState(t) : (t = Mm[t]) ? !!e[t] : !1;
  }
  function $i() {
    return Cm;
  }
  var Dm = A({}, tn, {
    key: function(t) {
      if (t.key) {
        var e = Om[t.key] || t.key;
        if (e !== "Unidentified") return e;
      }
      return t.type === "keypress" ? (t = nu(t), t === 13 ? "Enter" : String.fromCharCode(t)) : t.type === "keydown" || t.type === "keyup" ? Nm[t.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: $i,
    charCode: function(t) {
      return t.type === "keypress" ? nu(t) : 0;
    },
    keyCode: function(t) {
      return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    },
    which: function(t) {
      return t.type === "keypress" ? nu(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    }
  }), Um = le(Dm), Hm = A({}, cu, {
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
  }), Ys = le(Hm), Bm = A({}, tn, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: $i
  }), qm = le(Bm), Lm = A({}, Gl, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Ym = le(Lm), Gm = A({}, cu, {
    deltaX: function(t) {
      return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
    },
    deltaY: function(t) {
      return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Xm = le(Gm), Qm = A({}, Gl, {
    newState: 0,
    oldState: 0
  }), Zm = le(Qm), Vm = [9, 13, 27, 32], ki = Ke && "CompositionEvent" in window, ln = null;
  Ke && "documentMode" in document && (ln = document.documentMode);
  var wm = Ke && "TextEvent" in window && !ln, Gs = Ke && (!ki || ln && 8 < ln && 11 >= ln), Xs = " ", Qs = !1;
  function Zs(t, e) {
    switch (t) {
      case "keyup":
        return Vm.indexOf(e.keyCode) !== -1;
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
  function Vs(t) {
    return t = t.detail, typeof t == "object" && "data" in t ? t.data : null;
  }
  var va = !1;
  function Km(t, e) {
    switch (t) {
      case "compositionend":
        return Vs(e);
      case "keypress":
        return e.which !== 32 ? null : (Qs = !0, Xs);
      case "textInput":
        return t = e.data, t === Xs && Qs ? null : t;
      default:
        return null;
    }
  }
  function Jm(t, e) {
    if (va)
      return t === "compositionend" || !ki && Zs(t, e) ? (t = Hs(), au = Vi = hl = null, va = !1, t) : null;
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
        return Gs && e.locale !== "ko" ? null : e.data;
      default:
        return null;
    }
  }
  var $m = {
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
  function ws(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e === "input" ? !!$m[t.type] : e === "textarea";
  }
  function Ks(t, e, l, a) {
    ha ? ma ? ma.push(a) : ma = [a] : ha = a, e = Wu(e, "onChange"), 0 < e.length && (l = new iu(
      "onChange",
      "change",
      null,
      l,
      a
    ), t.push({ event: l, listeners: e }));
  }
  var an = null, nn = null;
  function km(t) {
    Od(t, 0);
  }
  function fu(t) {
    var e = Fa(t);
    if (Rs(e)) return t;
  }
  function Js(t, e) {
    if (t === "change") return e;
  }
  var $s = !1;
  if (Ke) {
    var Wi;
    if (Ke) {
      var Fi = "oninput" in document;
      if (!Fi) {
        var ks = document.createElement("div");
        ks.setAttribute("oninput", "return;"), Fi = typeof ks.oninput == "function";
      }
      Wi = Fi;
    } else Wi = !1;
    $s = Wi && (!document.documentMode || 9 < document.documentMode);
  }
  function Ws() {
    an && (an.detachEvent("onpropertychange", Fs), nn = an = null);
  }
  function Fs(t) {
    if (t.propertyName === "value" && fu(nn)) {
      var e = [];
      Ks(
        e,
        nn,
        t,
        Xi(t)
      ), Us(km, e);
    }
  }
  function Wm(t, e, l) {
    t === "focusin" ? (Ws(), an = e, nn = l, an.attachEvent("onpropertychange", Fs)) : t === "focusout" && Ws();
  }
  function Fm(t) {
    if (t === "selectionchange" || t === "keyup" || t === "keydown")
      return fu(nn);
  }
  function Im(t, e) {
    if (t === "click") return fu(e);
  }
  function Pm(t, e) {
    if (t === "input" || t === "change")
      return fu(e);
  }
  function tv(t, e) {
    return t === e && (t !== 0 || 1 / t === 1 / e) || t !== t && e !== e;
  }
  var oe = typeof Object.is == "function" ? Object.is : tv;
  function un(t, e) {
    if (oe(t, e)) return !0;
    if (typeof t != "object" || t === null || typeof e != "object" || e === null)
      return !1;
    var l = Object.keys(t), a = Object.keys(e);
    if (l.length !== a.length) return !1;
    for (a = 0; a < l.length; a++) {
      var n = l[a];
      if (!ji.call(e, n) || !oe(t[n], e[n]))
        return !1;
    }
    return !0;
  }
  function Is(t) {
    for (; t && t.firstChild; ) t = t.firstChild;
    return t;
  }
  function Ps(t, e) {
    var l = Is(t);
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
      l = Is(l);
    }
  }
  function tr(t, e) {
    return t && e ? t === e ? !0 : t && t.nodeType === 3 ? !1 : e && e.nodeType === 3 ? tr(t, e.parentNode) : "contains" in t ? t.contains(e) : t.compareDocumentPosition ? !!(t.compareDocumentPosition(e) & 16) : !1 : !1;
  }
  function er(t) {
    t = t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null ? t.ownerDocument.defaultView : window;
    for (var e = eu(t.document); e instanceof t.HTMLIFrameElement; ) {
      try {
        var l = typeof e.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) t = e.contentWindow;
      else break;
      e = eu(t.document);
    }
    return e;
  }
  function Ii(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e && (e === "input" && (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password") || e === "textarea" || t.contentEditable === "true");
  }
  var ev = Ke && "documentMode" in document && 11 >= document.documentMode, ya = null, Pi = null, cn = null, tc = !1;
  function lr(t, e, l) {
    var a = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    tc || ya == null || ya !== eu(a) || (a = ya, "selectionStart" in a && Ii(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), cn && un(cn, a) || (cn = a, a = Wu(Pi, "onSelect"), 0 < a.length && (e = new iu(
      "onSelect",
      "select",
      null,
      e,
      l
    ), t.push({ event: e, listeners: a }), e.target = ya)));
  }
  function Xl(t, e) {
    var l = {};
    return l[t.toLowerCase()] = e.toLowerCase(), l["Webkit" + t] = "webkit" + e, l["Moz" + t] = "moz" + e, l;
  }
  var pa = {
    animationend: Xl("Animation", "AnimationEnd"),
    animationiteration: Xl("Animation", "AnimationIteration"),
    animationstart: Xl("Animation", "AnimationStart"),
    transitionrun: Xl("Transition", "TransitionRun"),
    transitionstart: Xl("Transition", "TransitionStart"),
    transitioncancel: Xl("Transition", "TransitionCancel"),
    transitionend: Xl("Transition", "TransitionEnd")
  }, ec = {}, ar = {};
  Ke && (ar = document.createElement("div").style, "AnimationEvent" in window || (delete pa.animationend.animation, delete pa.animationiteration.animation, delete pa.animationstart.animation), "TransitionEvent" in window || delete pa.transitionend.transition);
  function Ql(t) {
    if (ec[t]) return ec[t];
    if (!pa[t]) return t;
    var e = pa[t], l;
    for (l in e)
      if (e.hasOwnProperty(l) && l in ar)
        return ec[t] = e[l];
    return t;
  }
  var nr = Ql("animationend"), ur = Ql("animationiteration"), ir = Ql("animationstart"), lv = Ql("transitionrun"), av = Ql("transitionstart"), nv = Ql("transitioncancel"), cr = Ql("transitionend"), fr = /* @__PURE__ */ new Map(), lc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  lc.push("scrollEnd");
  function Ce(t, e) {
    fr.set(t, e), Yl(e, [t]);
  }
  var su = typeof reportError == "function" ? reportError : function(t) {
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
  }, _e = [], ga = 0, ac = 0;
  function ru() {
    for (var t = ga, e = ac = ga = 0; e < t; ) {
      var l = _e[e];
      _e[e++] = null;
      var a = _e[e];
      _e[e++] = null;
      var n = _e[e];
      _e[e++] = null;
      var u = _e[e];
      if (_e[e++] = null, a !== null && n !== null) {
        var c = a.pending;
        c === null ? n.next = n : (n.next = c.next, c.next = n), a.pending = n;
      }
      u !== 0 && sr(l, n, u);
    }
  }
  function ou(t, e, l, a) {
    _e[ga++] = t, _e[ga++] = e, _e[ga++] = l, _e[ga++] = a, ac |= a, t.lanes |= a, t = t.alternate, t !== null && (t.lanes |= a);
  }
  function nc(t, e, l, a) {
    return ou(t, e, l, a), du(t);
  }
  function Zl(t, e) {
    return ou(t, null, null, e), du(t);
  }
  function sr(t, e, l) {
    t.lanes |= l;
    var a = t.alternate;
    a !== null && (a.lanes |= l);
    for (var n = !1, u = t.return; u !== null; )
      u.childLanes |= l, a = u.alternate, a !== null && (a.childLanes |= l), u.tag === 22 && (t = u.stateNode, t === null || t._visibility & 1 || (n = !0)), t = u, u = u.return;
    return t.tag === 3 ? (u = t.stateNode, n && e !== null && (n = 31 - re(l), t = u.hiddenUpdates, a = t[n], a === null ? t[n] = [e] : a.push(e), e.lane = l | 536870912), u) : null;
  }
  function du(t) {
    if (50 < On)
      throw On = 0, mf = null, Error(f(185));
    for (var e = t.return; e !== null; )
      t = e, e = t.return;
    return t.tag === 3 ? t.stateNode : null;
  }
  var ba = {};
  function uv(t, e, l, a) {
    this.tag = t, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = e, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function de(t, e, l, a) {
    return new uv(t, e, l, a);
  }
  function uc(t) {
    return t = t.prototype, !(!t || !t.isReactComponent);
  }
  function Je(t, e) {
    var l = t.alternate;
    return l === null ? (l = de(
      t.tag,
      e,
      t.key,
      t.mode
    ), l.elementType = t.elementType, l.type = t.type, l.stateNode = t.stateNode, l.alternate = t, t.alternate = l) : (l.pendingProps = e, l.type = t.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = t.flags & 65011712, l.childLanes = t.childLanes, l.lanes = t.lanes, l.child = t.child, l.memoizedProps = t.memoizedProps, l.memoizedState = t.memoizedState, l.updateQueue = t.updateQueue, e = t.dependencies, l.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }, l.sibling = t.sibling, l.index = t.index, l.ref = t.ref, l.refCleanup = t.refCleanup, l;
  }
  function rr(t, e) {
    t.flags &= 65011714;
    var l = t.alternate;
    return l === null ? (t.childLanes = 0, t.lanes = e, t.child = null, t.subtreeFlags = 0, t.memoizedProps = null, t.memoizedState = null, t.updateQueue = null, t.dependencies = null, t.stateNode = null) : (t.childLanes = l.childLanes, t.lanes = l.lanes, t.child = l.child, t.subtreeFlags = 0, t.deletions = null, t.memoizedProps = l.memoizedProps, t.memoizedState = l.memoizedState, t.updateQueue = l.updateQueue, t.type = l.type, e = l.dependencies, t.dependencies = e === null ? null : {
      lanes: e.lanes,
      firstContext: e.firstContext
    }), t;
  }
  function hu(t, e, l, a, n, u) {
    var c = 0;
    if (a = t, typeof t == "function") uc(t) && (c = 1);
    else if (typeof t == "string")
      c = ry(
        t,
        l,
        X.current
      ) ? 26 : t === "html" || t === "head" || t === "body" ? 27 : 5;
    else
      t: switch (t) {
        case kt:
          return t = de(31, l, e, n), t.elementType = kt, t.lanes = u, t;
        case Y:
          return Vl(l.children, n, u, e);
        case H:
          c = 8, n |= 24;
          break;
        case K:
          return t = de(12, l, e, n | 2), t.elementType = K, t.lanes = u, t;
        case bt:
          return t = de(13, l, e, n), t.elementType = bt, t.lanes = u, t;
        case Rt:
          return t = de(19, l, e, n), t.elementType = Rt, t.lanes = u, t;
        default:
          if (typeof t == "object" && t !== null)
            switch (t.$$typeof) {
              case $:
                c = 10;
                break t;
              case W:
                c = 9;
                break t;
              case dt:
                c = 11;
                break t;
              case F:
                c = 14;
                break t;
              case Mt:
                c = 16, a = null;
                break t;
            }
          c = 29, l = Error(
            f(130, t === null ? "null" : typeof t, "")
          ), a = null;
      }
    return e = de(c, l, e, n), e.elementType = t, e.type = a, e.lanes = u, e;
  }
  function Vl(t, e, l, a) {
    return t = de(7, t, a, e), t.lanes = l, t;
  }
  function ic(t, e, l) {
    return t = de(6, t, null, e), t.lanes = l, t;
  }
  function or(t) {
    var e = de(18, null, null, 0);
    return e.stateNode = t, e;
  }
  function cc(t, e, l) {
    return e = de(
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
  var dr = /* @__PURE__ */ new WeakMap();
  function Te(t, e) {
    if (typeof t == "object" && t !== null) {
      var l = dr.get(t);
      return l !== void 0 ? l : (e = {
        value: t,
        source: e,
        stack: os(e)
      }, dr.set(t, e), e);
    }
    return {
      value: t,
      source: e,
      stack: os(e)
    };
  }
  var Sa = [], xa = 0, mu = null, fn = 0, ze = [], Ae = 0, ml = null, Ye = 1, Ge = "";
  function $e(t, e) {
    Sa[xa++] = fn, Sa[xa++] = mu, mu = t, fn = e;
  }
  function hr(t, e, l) {
    ze[Ae++] = Ye, ze[Ae++] = Ge, ze[Ae++] = ml, ml = t;
    var a = Ye;
    t = Ge;
    var n = 32 - re(a) - 1;
    a &= ~(1 << n), l += 1;
    var u = 32 - re(e) + n;
    if (30 < u) {
      var c = n - n % 5;
      u = (a & (1 << c) - 1).toString(32), a >>= c, n -= c, Ye = 1 << 32 - re(e) + n | l << n | a, Ge = u + t;
    } else
      Ye = 1 << u | l << n | a, Ge = t;
  }
  function fc(t) {
    t.return !== null && ($e(t, 1), hr(t, 1, 0));
  }
  function sc(t) {
    for (; t === mu; )
      mu = Sa[--xa], Sa[xa] = null, fn = Sa[--xa], Sa[xa] = null;
    for (; t === ml; )
      ml = ze[--Ae], ze[Ae] = null, Ge = ze[--Ae], ze[Ae] = null, Ye = ze[--Ae], ze[Ae] = null;
  }
  function mr(t, e) {
    ze[Ae++] = Ye, ze[Ae++] = Ge, ze[Ae++] = ml, Ye = e.id, Ge = e.overflow, ml = t;
  }
  var wt = null, Et = null, ct = !1, vl = null, Re = !1, rc = Error(f(519));
  function yl(t) {
    var e = Error(
      f(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw sn(Te(e, t)), rc;
  }
  function vr(t) {
    var e = t.stateNode, l = t.type, a = t.memoizedProps;
    switch (e[Vt] = t, e[ee] = a, l) {
      case "dialog":
        nt("cancel", e), nt("close", e);
        break;
      case "iframe":
      case "object":
      case "embed":
        nt("load", e);
        break;
      case "video":
      case "audio":
        for (l = 0; l < Mn.length; l++)
          nt(Mn[l], e);
        break;
      case "source":
        nt("error", e);
        break;
      case "img":
      case "image":
      case "link":
        nt("error", e), nt("load", e);
        break;
      case "details":
        nt("toggle", e);
        break;
      case "input":
        nt("invalid", e), js(
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
        nt("invalid", e);
        break;
      case "textarea":
        nt("invalid", e), Ns(e, a.value, a.defaultValue, a.children);
    }
    l = a.children, typeof l != "string" && typeof l != "number" && typeof l != "bigint" || e.textContent === "" + l || a.suppressHydrationWarning === !0 || Dd(e.textContent, l) ? (a.popover != null && (nt("beforetoggle", e), nt("toggle", e)), a.onScroll != null && nt("scroll", e), a.onScrollEnd != null && nt("scrollend", e), a.onClick != null && (e.onclick = we), e = !0) : e = !1, e || yl(t, !0);
  }
  function yr(t) {
    for (wt = t.return; wt; )
      switch (wt.tag) {
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
          wt = wt.return;
      }
  }
  function Ea(t) {
    if (t !== wt) return !1;
    if (!ct) return yr(t), ct = !0, !1;
    var e = t.tag, l;
    if ((l = e !== 3 && e !== 27) && ((l = e === 5) && (l = t.type, l = !(l !== "form" && l !== "button") || Of(t.type, t.memoizedProps)), l = !l), l && Et && yl(t), yr(t), e === 13) {
      if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(f(317));
      Et = Qd(t);
    } else if (e === 31) {
      if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(f(317));
      Et = Qd(t);
    } else
      e === 27 ? (e = Et, Nl(t.type) ? (t = Uf, Uf = null, Et = t) : Et = e) : Et = wt ? Oe(t.stateNode.nextSibling) : null;
    return !0;
  }
  function wl() {
    Et = wt = null, ct = !1;
  }
  function oc() {
    var t = vl;
    return t !== null && (ie === null ? ie = t : ie.push.apply(
      ie,
      t
    ), vl = null), t;
  }
  function sn(t) {
    vl === null ? vl = [t] : vl.push(t);
  }
  var dc = g(null), Kl = null, ke = null;
  function pl(t, e, l) {
    L(dc, e._currentValue), e._currentValue = l;
  }
  function We(t) {
    t._currentValue = dc.current, U(dc);
  }
  function hc(t, e, l) {
    for (; t !== null; ) {
      var a = t.alternate;
      if ((t.childLanes & e) !== e ? (t.childLanes |= e, a !== null && (a.childLanes |= e)) : a !== null && (a.childLanes & e) !== e && (a.childLanes |= e), t === l) break;
      t = t.return;
    }
  }
  function mc(t, e, l, a) {
    var n = t.child;
    for (n !== null && (n.return = t); n !== null; ) {
      var u = n.dependencies;
      if (u !== null) {
        var c = n.child;
        u = u.firstContext;
        t: for (; u !== null; ) {
          var r = u;
          u = n;
          for (var v = 0; v < e.length; v++)
            if (r.context === e[v]) {
              u.lanes |= l, r = u.alternate, r !== null && (r.lanes |= l), hc(
                u.return,
                l,
                t
              ), a || (c = null);
              break t;
            }
          u = r.next;
        }
      } else if (n.tag === 18) {
        if (c = n.return, c === null) throw Error(f(341));
        c.lanes |= l, u = c.alternate, u !== null && (u.lanes |= l), hc(c, l, t), c = null;
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
  function _a(t, e, l, a) {
    t = null;
    for (var n = e, u = !1; n !== null; ) {
      if (!u) {
        if ((n.flags & 524288) !== 0) u = !0;
        else if ((n.flags & 262144) !== 0) break;
      }
      if (n.tag === 10) {
        var c = n.alternate;
        if (c === null) throw Error(f(387));
        if (c = c.memoizedProps, c !== null) {
          var r = n.type;
          oe(n.pendingProps.value, c.value) || (t !== null ? t.push(r) : t = [r]);
        }
      } else if (n === ot.current) {
        if (c = n.alternate, c === null) throw Error(f(387));
        c.memoizedState.memoizedState !== n.memoizedState.memoizedState && (t !== null ? t.push(Bn) : t = [Bn]);
      }
      n = n.return;
    }
    t !== null && mc(
      e,
      t,
      l,
      a
    ), e.flags |= 262144;
  }
  function vu(t) {
    for (t = t.firstContext; t !== null; ) {
      if (!oe(
        t.context._currentValue,
        t.memoizedValue
      ))
        return !0;
      t = t.next;
    }
    return !1;
  }
  function Jl(t) {
    Kl = t, ke = null, t = t.dependencies, t !== null && (t.firstContext = null);
  }
  function Kt(t) {
    return pr(Kl, t);
  }
  function yu(t, e) {
    return Kl === null && Jl(t), pr(t, e);
  }
  function pr(t, e) {
    var l = e._currentValue;
    if (e = { context: e, memoizedValue: l, next: null }, ke === null) {
      if (t === null) throw Error(f(308));
      ke = e, t.dependencies = { lanes: 0, firstContext: e }, t.flags |= 524288;
    } else ke = ke.next = e;
    return l;
  }
  var iv = typeof AbortController < "u" ? AbortController : function() {
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
  }, cv = i.unstable_scheduleCallback, fv = i.unstable_NormalPriority, Bt = {
    $$typeof: $,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function vc() {
    return {
      controller: new iv(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function rn(t) {
    t.refCount--, t.refCount === 0 && cv(fv, function() {
      t.controller.abort();
    });
  }
  var on = null, yc = 0, Ta = 0, za = null;
  function sv(t, e) {
    if (on === null) {
      var l = on = [];
      yc = 0, Ta = Sf(), za = {
        status: "pending",
        value: void 0,
        then: function(a) {
          l.push(a);
        }
      };
    }
    return yc++, e.then(gr, gr), e;
  }
  function gr() {
    if (--yc === 0 && on !== null) {
      za !== null && (za.status = "fulfilled");
      var t = on;
      on = null, Ta = 0, za = null;
      for (var e = 0; e < t.length; e++) (0, t[e])();
    }
  }
  function rv(t, e) {
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
  var br = M.S;
  M.S = function(t, e) {
    ad = fe(), typeof e == "object" && e !== null && typeof e.then == "function" && sv(t, e), br !== null && br(t, e);
  };
  var $l = g(null);
  function pc() {
    var t = $l.current;
    return t !== null ? t : xt.pooledCache;
  }
  function pu(t, e) {
    e === null ? L($l, $l.current) : L($l, e.pool);
  }
  function Sr() {
    var t = pc();
    return t === null ? null : { parent: Bt._currentValue, pool: t };
  }
  var Aa = Error(f(460)), gc = Error(f(474)), gu = Error(f(542)), bu = { then: function() {
  } };
  function xr(t) {
    return t = t.status, t === "fulfilled" || t === "rejected";
  }
  function Er(t, e, l) {
    switch (l = t[l], l === void 0 ? t.push(e) : l !== e && (e.then(we, we), e = l), e.status) {
      case "fulfilled":
        return e.value;
      case "rejected":
        throw t = e.reason, Tr(t), t;
      default:
        if (typeof e.status == "string") e.then(we, we);
        else {
          if (t = xt, t !== null && 100 < t.shellSuspendCounter)
            throw Error(f(482));
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
            throw t = e.reason, Tr(t), t;
        }
        throw Wl = e, Aa;
    }
  }
  function kl(t) {
    try {
      var e = t._init;
      return e(t._payload);
    } catch (l) {
      throw l !== null && typeof l == "object" && typeof l.then == "function" ? (Wl = l, Aa) : l;
    }
  }
  var Wl = null;
  function _r() {
    if (Wl === null) throw Error(f(459));
    var t = Wl;
    return Wl = null, t;
  }
  function Tr(t) {
    if (t === Aa || t === gu)
      throw Error(f(483));
  }
  var Ra = null, dn = 0;
  function Su(t) {
    var e = dn;
    return dn += 1, Ra === null && (Ra = []), Er(Ra, t, e);
  }
  function hn(t, e) {
    e = e.props.ref, t.ref = e !== void 0 ? e : null;
  }
  function xu(t, e) {
    throw e.$$typeof === B ? Error(f(525)) : (t = Object.prototype.toString.call(e), Error(
      f(
        31,
        t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t
      )
    ));
  }
  function zr(t) {
    function e(x, p) {
      if (t) {
        var E = x.deletions;
        E === null ? (x.deletions = [p], x.flags |= 16) : E.push(p);
      }
    }
    function l(x, p) {
      if (!t) return null;
      for (; p !== null; )
        e(x, p), p = p.sibling;
      return null;
    }
    function a(x) {
      for (var p = /* @__PURE__ */ new Map(); x !== null; )
        x.key !== null ? p.set(x.key, x) : p.set(x.index, x), x = x.sibling;
      return p;
    }
    function n(x, p) {
      return x = Je(x, p), x.index = 0, x.sibling = null, x;
    }
    function u(x, p, E) {
      return x.index = E, t ? (E = x.alternate, E !== null ? (E = E.index, E < p ? (x.flags |= 67108866, p) : E) : (x.flags |= 67108866, p)) : (x.flags |= 1048576, p);
    }
    function c(x) {
      return t && x.alternate === null && (x.flags |= 67108866), x;
    }
    function r(x, p, E, C) {
      return p === null || p.tag !== 6 ? (p = ic(E, x.mode, C), p.return = x, p) : (p = n(p, E), p.return = x, p);
    }
    function v(x, p, E, C) {
      var w = E.type;
      return w === Y ? N(
        x,
        p,
        E.props.children,
        C,
        E.key
      ) : p !== null && (p.elementType === w || typeof w == "object" && w !== null && w.$$typeof === Mt && kl(w) === p.type) ? (p = n(p, E.props), hn(p, E), p.return = x, p) : (p = hu(
        E.type,
        E.key,
        E.props,
        null,
        x.mode,
        C
      ), hn(p, E), p.return = x, p);
    }
    function _(x, p, E, C) {
      return p === null || p.tag !== 4 || p.stateNode.containerInfo !== E.containerInfo || p.stateNode.implementation !== E.implementation ? (p = cc(E, x.mode, C), p.return = x, p) : (p = n(p, E.children || []), p.return = x, p);
    }
    function N(x, p, E, C, w) {
      return p === null || p.tag !== 7 ? (p = Vl(
        E,
        x.mode,
        C,
        w
      ), p.return = x, p) : (p = n(p, E), p.return = x, p);
    }
    function D(x, p, E) {
      if (typeof p == "string" && p !== "" || typeof p == "number" || typeof p == "bigint")
        return p = ic(
          "" + p,
          x.mode,
          E
        ), p.return = x, p;
      if (typeof p == "object" && p !== null) {
        switch (p.$$typeof) {
          case Z:
            return E = hu(
              p.type,
              p.key,
              p.props,
              null,
              x.mode,
              E
            ), hn(E, p), E.return = x, E;
          case V:
            return p = cc(
              p,
              x.mode,
              E
            ), p.return = x, p;
          case Mt:
            return p = kl(p), D(x, p, E);
        }
        if (Ht(p) || Wt(p))
          return p = Vl(
            p,
            x.mode,
            E,
            null
          ), p.return = x, p;
        if (typeof p.then == "function")
          return D(x, Su(p), E);
        if (p.$$typeof === $)
          return D(
            x,
            yu(x, p),
            E
          );
        xu(x, p);
      }
      return null;
    }
    function z(x, p, E, C) {
      var w = p !== null ? p.key : null;
      if (typeof E == "string" && E !== "" || typeof E == "number" || typeof E == "bigint")
        return w !== null ? null : r(x, p, "" + E, C);
      if (typeof E == "object" && E !== null) {
        switch (E.$$typeof) {
          case Z:
            return E.key === w ? v(x, p, E, C) : null;
          case V:
            return E.key === w ? _(x, p, E, C) : null;
          case Mt:
            return E = kl(E), z(x, p, E, C);
        }
        if (Ht(E) || Wt(E))
          return w !== null ? null : N(x, p, E, C, null);
        if (typeof E.then == "function")
          return z(
            x,
            p,
            Su(E),
            C
          );
        if (E.$$typeof === $)
          return z(
            x,
            p,
            yu(x, E),
            C
          );
        xu(x, E);
      }
      return null;
    }
    function R(x, p, E, C, w) {
      if (typeof C == "string" && C !== "" || typeof C == "number" || typeof C == "bigint")
        return x = x.get(E) || null, r(p, x, "" + C, w);
      if (typeof C == "object" && C !== null) {
        switch (C.$$typeof) {
          case Z:
            return x = x.get(
              C.key === null ? E : C.key
            ) || null, v(p, x, C, w);
          case V:
            return x = x.get(
              C.key === null ? E : C.key
            ) || null, _(p, x, C, w);
          case Mt:
            return C = kl(C), R(
              x,
              p,
              E,
              C,
              w
            );
        }
        if (Ht(C) || Wt(C))
          return x = x.get(E) || null, N(p, x, C, w, null);
        if (typeof C.then == "function")
          return R(
            x,
            p,
            E,
            Su(C),
            w
          );
        if (C.$$typeof === $)
          return R(
            x,
            p,
            E,
            yu(p, C),
            w
          );
        xu(p, C);
      }
      return null;
    }
    function G(x, p, E, C) {
      for (var w = null, ft = null, Q = p, et = p = 0, it = null; Q !== null && et < E.length; et++) {
        Q.index > et ? (it = Q, Q = null) : it = Q.sibling;
        var st = z(
          x,
          Q,
          E[et],
          C
        );
        if (st === null) {
          Q === null && (Q = it);
          break;
        }
        t && Q && st.alternate === null && e(x, Q), p = u(st, p, et), ft === null ? w = st : ft.sibling = st, ft = st, Q = it;
      }
      if (et === E.length)
        return l(x, Q), ct && $e(x, et), w;
      if (Q === null) {
        for (; et < E.length; et++)
          Q = D(x, E[et], C), Q !== null && (p = u(
            Q,
            p,
            et
          ), ft === null ? w = Q : ft.sibling = Q, ft = Q);
        return ct && $e(x, et), w;
      }
      for (Q = a(Q); et < E.length; et++)
        it = R(
          Q,
          x,
          et,
          E[et],
          C
        ), it !== null && (t && it.alternate !== null && Q.delete(
          it.key === null ? et : it.key
        ), p = u(
          it,
          p,
          et
        ), ft === null ? w = it : ft.sibling = it, ft = it);
      return t && Q.forEach(function(Hl) {
        return e(x, Hl);
      }), ct && $e(x, et), w;
    }
    function J(x, p, E, C) {
      if (E == null) throw Error(f(151));
      for (var w = null, ft = null, Q = p, et = p = 0, it = null, st = E.next(); Q !== null && !st.done; et++, st = E.next()) {
        Q.index > et ? (it = Q, Q = null) : it = Q.sibling;
        var Hl = z(x, Q, st.value, C);
        if (Hl === null) {
          Q === null && (Q = it);
          break;
        }
        t && Q && Hl.alternate === null && e(x, Q), p = u(Hl, p, et), ft === null ? w = Hl : ft.sibling = Hl, ft = Hl, Q = it;
      }
      if (st.done)
        return l(x, Q), ct && $e(x, et), w;
      if (Q === null) {
        for (; !st.done; et++, st = E.next())
          st = D(x, st.value, C), st !== null && (p = u(st, p, et), ft === null ? w = st : ft.sibling = st, ft = st);
        return ct && $e(x, et), w;
      }
      for (Q = a(Q); !st.done; et++, st = E.next())
        st = R(Q, x, et, st.value, C), st !== null && (t && st.alternate !== null && Q.delete(st.key === null ? et : st.key), p = u(st, p, et), ft === null ? w = st : ft.sibling = st, ft = st);
      return t && Q.forEach(function(xy) {
        return e(x, xy);
      }), ct && $e(x, et), w;
    }
    function gt(x, p, E, C) {
      if (typeof E == "object" && E !== null && E.type === Y && E.key === null && (E = E.props.children), typeof E == "object" && E !== null) {
        switch (E.$$typeof) {
          case Z:
            t: {
              for (var w = E.key; p !== null; ) {
                if (p.key === w) {
                  if (w = E.type, w === Y) {
                    if (p.tag === 7) {
                      l(
                        x,
                        p.sibling
                      ), C = n(
                        p,
                        E.props.children
                      ), C.return = x, x = C;
                      break t;
                    }
                  } else if (p.elementType === w || typeof w == "object" && w !== null && w.$$typeof === Mt && kl(w) === p.type) {
                    l(
                      x,
                      p.sibling
                    ), C = n(p, E.props), hn(C, E), C.return = x, x = C;
                    break t;
                  }
                  l(x, p);
                  break;
                } else e(x, p);
                p = p.sibling;
              }
              E.type === Y ? (C = Vl(
                E.props.children,
                x.mode,
                C,
                E.key
              ), C.return = x, x = C) : (C = hu(
                E.type,
                E.key,
                E.props,
                null,
                x.mode,
                C
              ), hn(C, E), C.return = x, x = C);
            }
            return c(x);
          case V:
            t: {
              for (w = E.key; p !== null; ) {
                if (p.key === w)
                  if (p.tag === 4 && p.stateNode.containerInfo === E.containerInfo && p.stateNode.implementation === E.implementation) {
                    l(
                      x,
                      p.sibling
                    ), C = n(p, E.children || []), C.return = x, x = C;
                    break t;
                  } else {
                    l(x, p);
                    break;
                  }
                else e(x, p);
                p = p.sibling;
              }
              C = cc(E, x.mode, C), C.return = x, x = C;
            }
            return c(x);
          case Mt:
            return E = kl(E), gt(
              x,
              p,
              E,
              C
            );
        }
        if (Ht(E))
          return G(
            x,
            p,
            E,
            C
          );
        if (Wt(E)) {
          if (w = Wt(E), typeof w != "function") throw Error(f(150));
          return E = w.call(E), J(
            x,
            p,
            E,
            C
          );
        }
        if (typeof E.then == "function")
          return gt(
            x,
            p,
            Su(E),
            C
          );
        if (E.$$typeof === $)
          return gt(
            x,
            p,
            yu(x, E),
            C
          );
        xu(x, E);
      }
      return typeof E == "string" && E !== "" || typeof E == "number" || typeof E == "bigint" ? (E = "" + E, p !== null && p.tag === 6 ? (l(x, p.sibling), C = n(p, E), C.return = x, x = C) : (l(x, p), C = ic(E, x.mode, C), C.return = x, x = C), c(x)) : l(x, p);
    }
    return function(x, p, E, C) {
      try {
        dn = 0;
        var w = gt(
          x,
          p,
          E,
          C
        );
        return Ra = null, w;
      } catch (Q) {
        if (Q === Aa || Q === gu) throw Q;
        var ft = de(29, Q, null, x.mode);
        return ft.lanes = C, ft.return = x, ft;
      } finally {
      }
    };
  }
  var Fl = zr(!0), Ar = zr(!1), gl = !1;
  function bc(t) {
    t.updateQueue = {
      baseState: t.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Sc(t, e) {
    t = t.updateQueue, e.updateQueue === t && (e.updateQueue = {
      baseState: t.baseState,
      firstBaseUpdate: t.firstBaseUpdate,
      lastBaseUpdate: t.lastBaseUpdate,
      shared: t.shared,
      callbacks: null
    });
  }
  function bl(t) {
    return { lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Sl(t, e, l) {
    var a = t.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (rt & 2) !== 0) {
      var n = a.pending;
      return n === null ? e.next = e : (e.next = n.next, n.next = e), a.pending = e, e = du(t), sr(t, null, l), e;
    }
    return ou(t, a, e, l), du(t);
  }
  function mn(t, e, l) {
    if (e = e.updateQueue, e !== null && (e = e.shared, (l & 4194048) !== 0)) {
      var a = e.lanes;
      a &= t.pendingLanes, l |= a, e.lanes = l, ps(t, l);
    }
  }
  function xc(t, e) {
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
  var Ec = !1;
  function vn() {
    if (Ec) {
      var t = za;
      if (t !== null) throw t;
    }
  }
  function yn(t, e, l, a) {
    Ec = !1;
    var n = t.updateQueue;
    gl = !1;
    var u = n.firstBaseUpdate, c = n.lastBaseUpdate, r = n.shared.pending;
    if (r !== null) {
      n.shared.pending = null;
      var v = r, _ = v.next;
      v.next = null, c === null ? u = _ : c.next = _, c = v;
      var N = t.alternate;
      N !== null && (N = N.updateQueue, r = N.lastBaseUpdate, r !== c && (r === null ? N.firstBaseUpdate = _ : r.next = _, N.lastBaseUpdate = v));
    }
    if (u !== null) {
      var D = n.baseState;
      c = 0, N = _ = v = null, r = u;
      do {
        var z = r.lane & -536870913, R = z !== r.lane;
        if (R ? (ut & z) === z : (a & z) === z) {
          z !== 0 && z === Ta && (Ec = !0), N !== null && (N = N.next = {
            lane: 0,
            tag: r.tag,
            payload: r.payload,
            callback: null,
            next: null
          });
          t: {
            var G = t, J = r;
            z = e;
            var gt = l;
            switch (J.tag) {
              case 1:
                if (G = J.payload, typeof G == "function") {
                  D = G.call(gt, D, z);
                  break t;
                }
                D = G;
                break t;
              case 3:
                G.flags = G.flags & -65537 | 128;
              case 0:
                if (G = J.payload, z = typeof G == "function" ? G.call(gt, D, z) : G, z == null) break t;
                D = A({}, D, z);
                break t;
              case 2:
                gl = !0;
            }
          }
          z = r.callback, z !== null && (t.flags |= 64, R && (t.flags |= 8192), R = n.callbacks, R === null ? n.callbacks = [z] : R.push(z));
        } else
          R = {
            lane: z,
            tag: r.tag,
            payload: r.payload,
            callback: r.callback,
            next: null
          }, N === null ? (_ = N = R, v = D) : N = N.next = R, c |= z;
        if (r = r.next, r === null) {
          if (r = n.shared.pending, r === null)
            break;
          R = r, r = R.next, R.next = null, n.lastBaseUpdate = R, n.shared.pending = null;
        }
      } while (!0);
      N === null && (v = D), n.baseState = v, n.firstBaseUpdate = _, n.lastBaseUpdate = N, u === null && (n.shared.lanes = 0), zl |= c, t.lanes = c, t.memoizedState = D;
    }
  }
  function Rr(t, e) {
    if (typeof t != "function")
      throw Error(f(191, t));
    t.call(e);
  }
  function jr(t, e) {
    var l = t.callbacks;
    if (l !== null)
      for (t.callbacks = null, t = 0; t < l.length; t++)
        Rr(l[t], e);
  }
  var ja = g(null), Eu = g(0);
  function Or(t, e) {
    t = ul, L(Eu, t), L(ja, e), ul = t | e.baseLanes;
  }
  function _c() {
    L(Eu, ul), L(ja, ja.current);
  }
  function Tc() {
    ul = Eu.current, U(ja), U(Eu);
  }
  var he = g(null), je = null;
  function xl(t) {
    var e = t.alternate;
    L(Dt, Dt.current & 1), L(he, t), je === null && (e === null || ja.current !== null || e.memoizedState !== null) && (je = t);
  }
  function zc(t) {
    L(Dt, Dt.current), L(he, t), je === null && (je = t);
  }
  function Nr(t) {
    t.tag === 22 ? (L(Dt, Dt.current), L(he, t), je === null && (je = t)) : El();
  }
  function El() {
    L(Dt, Dt.current), L(he, he.current);
  }
  function me(t) {
    U(he), je === t && (je = null), U(Dt);
  }
  var Dt = g(0);
  function _u(t) {
    for (var e = t; e !== null; ) {
      if (e.tag === 13) {
        var l = e.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || Cf(l) || Df(l)))
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
  var Fe = 0, tt = null, yt = null, qt = null, Tu = !1, Oa = !1, Il = !1, zu = 0, pn = 0, Na = null, ov = 0;
  function jt() {
    throw Error(f(321));
  }
  function Ac(t, e) {
    if (e === null) return !1;
    for (var l = 0; l < e.length && l < t.length; l++)
      if (!oe(t[l], e[l])) return !1;
    return !0;
  }
  function Rc(t, e, l, a, n, u) {
    return Fe = u, tt = e, e.memoizedState = null, e.updateQueue = null, e.lanes = 0, M.H = t === null || t.memoizedState === null ? mo : Qc, Il = !1, u = l(a, n), Il = !1, Oa && (u = Cr(
      e,
      l,
      a,
      n
    )), Mr(t), u;
  }
  function Mr(t) {
    M.H = Sn;
    var e = yt !== null && yt.next !== null;
    if (Fe = 0, qt = yt = tt = null, Tu = !1, pn = 0, Na = null, e) throw Error(f(300));
    t === null || Lt || (t = t.dependencies, t !== null && vu(t) && (Lt = !0));
  }
  function Cr(t, e, l, a) {
    tt = t;
    var n = 0;
    do {
      if (Oa && (Na = null), pn = 0, Oa = !1, 25 <= n) throw Error(f(301));
      if (n += 1, qt = yt = null, t.updateQueue != null) {
        var u = t.updateQueue;
        u.lastEffect = null, u.events = null, u.stores = null, u.memoCache != null && (u.memoCache.index = 0);
      }
      M.H = vo, u = e(l, a);
    } while (Oa);
    return u;
  }
  function dv() {
    var t = M.H, e = t.useState()[0];
    return e = typeof e.then == "function" ? gn(e) : e, t = t.useState()[0], (yt !== null ? yt.memoizedState : null) !== t && (tt.flags |= 1024), e;
  }
  function jc() {
    var t = zu !== 0;
    return zu = 0, t;
  }
  function Oc(t, e, l) {
    e.updateQueue = t.updateQueue, e.flags &= -2053, t.lanes &= ~l;
  }
  function Nc(t) {
    if (Tu) {
      for (t = t.memoizedState; t !== null; ) {
        var e = t.queue;
        e !== null && (e.pending = null), t = t.next;
      }
      Tu = !1;
    }
    Fe = 0, qt = yt = tt = null, Oa = !1, pn = zu = 0, Na = null;
  }
  function te() {
    var t = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return qt === null ? tt.memoizedState = qt = t : qt = qt.next = t, qt;
  }
  function Ut() {
    if (yt === null) {
      var t = tt.alternate;
      t = t !== null ? t.memoizedState : null;
    } else t = yt.next;
    var e = qt === null ? tt.memoizedState : qt.next;
    if (e !== null)
      qt = e, yt = t;
    else {
      if (t === null)
        throw tt.alternate === null ? Error(f(467)) : Error(f(310));
      yt = t, t = {
        memoizedState: yt.memoizedState,
        baseState: yt.baseState,
        baseQueue: yt.baseQueue,
        queue: yt.queue,
        next: null
      }, qt === null ? tt.memoizedState = qt = t : qt = qt.next = t;
    }
    return qt;
  }
  function Au() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function gn(t) {
    var e = pn;
    return pn += 1, Na === null && (Na = []), t = Er(Na, t, e), e = tt, (qt === null ? e.memoizedState : qt.next) === null && (e = e.alternate, M.H = e === null || e.memoizedState === null ? mo : Qc), t;
  }
  function Ru(t) {
    if (t !== null && typeof t == "object") {
      if (typeof t.then == "function") return gn(t);
      if (t.$$typeof === $) return Kt(t);
    }
    throw Error(f(438, String(t)));
  }
  function Mc(t) {
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
    if (e == null && (e = { data: [], index: 0 }), l === null && (l = Au(), tt.updateQueue = l), l.memoCache = e, l = e.data[e.index], l === void 0)
      for (l = e.data[e.index] = Array(t), a = 0; a < t; a++)
        l[a] = qe;
    return e.index++, l;
  }
  function Ie(t, e) {
    return typeof e == "function" ? e(t) : e;
  }
  function ju(t) {
    var e = Ut();
    return Cc(e, yt, t);
  }
  function Cc(t, e, l) {
    var a = t.queue;
    if (a === null) throw Error(f(311));
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
      var r = c = null, v = null, _ = e, N = !1;
      do {
        var D = _.lane & -536870913;
        if (D !== _.lane ? (ut & D) === D : (Fe & D) === D) {
          var z = _.revertLane;
          if (z === 0)
            v !== null && (v = v.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: _.action,
              hasEagerState: _.hasEagerState,
              eagerState: _.eagerState,
              next: null
            }), D === Ta && (N = !0);
          else if ((Fe & z) === z) {
            _ = _.next, z === Ta && (N = !0);
            continue;
          } else
            D = {
              lane: 0,
              revertLane: _.revertLane,
              gesture: null,
              action: _.action,
              hasEagerState: _.hasEagerState,
              eagerState: _.eagerState,
              next: null
            }, v === null ? (r = v = D, c = u) : v = v.next = D, tt.lanes |= z, zl |= z;
          D = _.action, Il && l(u, D), u = _.hasEagerState ? _.eagerState : l(u, D);
        } else
          z = {
            lane: D,
            revertLane: _.revertLane,
            gesture: _.gesture,
            action: _.action,
            hasEagerState: _.hasEagerState,
            eagerState: _.eagerState,
            next: null
          }, v === null ? (r = v = z, c = u) : v = v.next = z, tt.lanes |= D, zl |= D;
        _ = _.next;
      } while (_ !== null && _ !== e);
      if (v === null ? c = u : v.next = r, !oe(u, t.memoizedState) && (Lt = !0, N && (l = za, l !== null)))
        throw l;
      t.memoizedState = u, t.baseState = c, t.baseQueue = v, a.lastRenderedState = u;
    }
    return n === null && (a.lanes = 0), [t.memoizedState, a.dispatch];
  }
  function Dc(t) {
    var e = Ut(), l = e.queue;
    if (l === null) throw Error(f(311));
    l.lastRenderedReducer = t;
    var a = l.dispatch, n = l.pending, u = e.memoizedState;
    if (n !== null) {
      l.pending = null;
      var c = n = n.next;
      do
        u = t(u, c.action), c = c.next;
      while (c !== n);
      oe(u, e.memoizedState) || (Lt = !0), e.memoizedState = u, e.baseQueue === null && (e.baseState = u), l.lastRenderedState = u;
    }
    return [u, a];
  }
  function Dr(t, e, l) {
    var a = tt, n = Ut(), u = ct;
    if (u) {
      if (l === void 0) throw Error(f(407));
      l = l();
    } else l = e();
    var c = !oe(
      (yt || n).memoizedState,
      l
    );
    if (c && (n.memoizedState = l, Lt = !0), n = n.queue, Bc(Br.bind(null, a, n, t), [
      t
    ]), n.getSnapshot !== e || c || qt !== null && qt.memoizedState.tag & 1) {
      if (a.flags |= 2048, Ma(
        9,
        { destroy: void 0 },
        Hr.bind(
          null,
          a,
          n,
          l,
          e
        ),
        null
      ), xt === null) throw Error(f(349));
      u || (Fe & 127) !== 0 || Ur(a, e, l);
    }
    return l;
  }
  function Ur(t, e, l) {
    t.flags |= 16384, t = { getSnapshot: e, value: l }, e = tt.updateQueue, e === null ? (e = Au(), tt.updateQueue = e, e.stores = [t]) : (l = e.stores, l === null ? e.stores = [t] : l.push(t));
  }
  function Hr(t, e, l, a) {
    e.value = l, e.getSnapshot = a, qr(e) && Lr(t);
  }
  function Br(t, e, l) {
    return l(function() {
      qr(e) && Lr(t);
    });
  }
  function qr(t) {
    var e = t.getSnapshot;
    t = t.value;
    try {
      var l = e();
      return !oe(t, l);
    } catch {
      return !0;
    }
  }
  function Lr(t) {
    var e = Zl(t, 2);
    e !== null && ce(e, t, 2);
  }
  function Uc(t) {
    var e = te();
    if (typeof t == "function") {
      var l = t;
      if (t = l(), Il) {
        ol(!0);
        try {
          l();
        } finally {
          ol(!1);
        }
      }
    }
    return e.memoizedState = e.baseState = t, e.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Ie,
      lastRenderedState: t
    }, e;
  }
  function Yr(t, e, l, a) {
    return t.baseState = l, Cc(
      t,
      yt,
      typeof a == "function" ? a : Ie
    );
  }
  function hv(t, e, l, a, n) {
    if (Mu(t)) throw Error(f(485));
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
      M.T !== null ? l(!0) : u.isTransition = !1, a(u), l = e.pending, l === null ? (u.next = e.pending = u, Gr(e, u)) : (u.next = l.next, e.pending = l.next = u);
    }
  }
  function Gr(t, e) {
    var l = e.action, a = e.payload, n = t.state;
    if (e.isTransition) {
      var u = M.T, c = {};
      M.T = c;
      try {
        var r = l(n, a), v = M.S;
        v !== null && v(c, r), Xr(t, e, r);
      } catch (_) {
        Hc(t, e, _);
      } finally {
        u !== null && c.types !== null && (u.types = c.types), M.T = u;
      }
    } else
      try {
        u = l(n, a), Xr(t, e, u);
      } catch (_) {
        Hc(t, e, _);
      }
  }
  function Xr(t, e, l) {
    l !== null && typeof l == "object" && typeof l.then == "function" ? l.then(
      function(a) {
        Qr(t, e, a);
      },
      function(a) {
        return Hc(t, e, a);
      }
    ) : Qr(t, e, l);
  }
  function Qr(t, e, l) {
    e.status = "fulfilled", e.value = l, Zr(e), t.state = l, e = t.pending, e !== null && (l = e.next, l === e ? t.pending = null : (l = l.next, e.next = l, Gr(t, l)));
  }
  function Hc(t, e, l) {
    var a = t.pending;
    if (t.pending = null, a !== null) {
      a = a.next;
      do
        e.status = "rejected", e.reason = l, Zr(e), e = e.next;
      while (e !== a);
    }
    t.action = null;
  }
  function Zr(t) {
    t = t.listeners;
    for (var e = 0; e < t.length; e++) (0, t[e])();
  }
  function Vr(t, e) {
    return e;
  }
  function wr(t, e) {
    if (ct) {
      var l = xt.formState;
      if (l !== null) {
        t: {
          var a = tt;
          if (ct) {
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
            yl(a);
          }
          a = !1;
        }
        a && (e = l[0]);
      }
    }
    return l = te(), l.memoizedState = l.baseState = e, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Vr,
      lastRenderedState: e
    }, l.queue = a, l = ro.bind(
      null,
      tt,
      a
    ), a.dispatch = l, a = Uc(!1), u = Xc.bind(
      null,
      tt,
      !1,
      a.queue
    ), a = te(), n = {
      state: e,
      dispatch: null,
      action: t,
      pending: null
    }, a.queue = n, l = hv.bind(
      null,
      tt,
      n,
      u,
      l
    ), n.dispatch = l, a.memoizedState = t, [e, l, !1];
  }
  function Kr(t) {
    var e = Ut();
    return Jr(e, yt, t);
  }
  function Jr(t, e, l) {
    if (e = Cc(
      t,
      e,
      Vr
    )[0], t = ju(Ie)[0], typeof e == "object" && e !== null && typeof e.then == "function")
      try {
        var a = gn(e);
      } catch (c) {
        throw c === Aa ? gu : c;
      }
    else a = e;
    e = Ut();
    var n = e.queue, u = n.dispatch;
    return l !== e.memoizedState && (tt.flags |= 2048, Ma(
      9,
      { destroy: void 0 },
      mv.bind(null, n, l),
      null
    )), [a, u, t];
  }
  function mv(t, e) {
    t.action = e;
  }
  function $r(t) {
    var e = Ut(), l = yt;
    if (l !== null)
      return Jr(e, l, t);
    Ut(), e = e.memoizedState, l = Ut();
    var a = l.queue.dispatch;
    return l.memoizedState = t, [e, a, !1];
  }
  function Ma(t, e, l, a) {
    return t = { tag: t, create: l, deps: a, inst: e, next: null }, e = tt.updateQueue, e === null && (e = Au(), tt.updateQueue = e), l = e.lastEffect, l === null ? e.lastEffect = t.next = t : (a = l.next, l.next = t, t.next = a, e.lastEffect = t), t;
  }
  function kr() {
    return Ut().memoizedState;
  }
  function Ou(t, e, l, a) {
    var n = te();
    tt.flags |= t, n.memoizedState = Ma(
      1 | e,
      { destroy: void 0 },
      l,
      a === void 0 ? null : a
    );
  }
  function Nu(t, e, l, a) {
    var n = Ut();
    a = a === void 0 ? null : a;
    var u = n.memoizedState.inst;
    yt !== null && a !== null && Ac(a, yt.memoizedState.deps) ? n.memoizedState = Ma(e, u, l, a) : (tt.flags |= t, n.memoizedState = Ma(
      1 | e,
      u,
      l,
      a
    ));
  }
  function Wr(t, e) {
    Ou(8390656, 8, t, e);
  }
  function Bc(t, e) {
    Nu(2048, 8, t, e);
  }
  function vv(t) {
    tt.flags |= 4;
    var e = tt.updateQueue;
    if (e === null)
      e = Au(), tt.updateQueue = e, e.events = [t];
    else {
      var l = e.events;
      l === null ? e.events = [t] : l.push(t);
    }
  }
  function Fr(t) {
    var e = Ut().memoizedState;
    return vv({ ref: e, nextImpl: t }), function() {
      if ((rt & 2) !== 0) throw Error(f(440));
      return e.impl.apply(void 0, arguments);
    };
  }
  function Ir(t, e) {
    return Nu(4, 2, t, e);
  }
  function Pr(t, e) {
    return Nu(4, 4, t, e);
  }
  function to(t, e) {
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
  function eo(t, e, l) {
    l = l != null ? l.concat([t]) : null, Nu(4, 4, to.bind(null, e, t), l);
  }
  function qc() {
  }
  function lo(t, e) {
    var l = Ut();
    e = e === void 0 ? null : e;
    var a = l.memoizedState;
    return e !== null && Ac(e, a[1]) ? a[0] : (l.memoizedState = [t, e], t);
  }
  function ao(t, e) {
    var l = Ut();
    e = e === void 0 ? null : e;
    var a = l.memoizedState;
    if (e !== null && Ac(e, a[1]))
      return a[0];
    if (a = t(), Il) {
      ol(!0);
      try {
        t();
      } finally {
        ol(!1);
      }
    }
    return l.memoizedState = [a, e], a;
  }
  function Lc(t, e, l) {
    return l === void 0 || (Fe & 1073741824) !== 0 && (ut & 261930) === 0 ? t.memoizedState = e : (t.memoizedState = l, t = ud(), tt.lanes |= t, zl |= t, l);
  }
  function no(t, e, l, a) {
    return oe(l, e) ? l : ja.current !== null ? (t = Lc(t, l, a), oe(t, e) || (Lt = !0), t) : (Fe & 42) === 0 || (Fe & 1073741824) !== 0 && (ut & 261930) === 0 ? (Lt = !0, t.memoizedState = l) : (t = ud(), tt.lanes |= t, zl |= t, e);
  }
  function uo(t, e, l, a, n) {
    var u = q.p;
    q.p = u !== 0 && 8 > u ? u : 8;
    var c = M.T, r = {};
    M.T = r, Xc(t, !1, e, l);
    try {
      var v = n(), _ = M.S;
      if (_ !== null && _(r, v), v !== null && typeof v == "object" && typeof v.then == "function") {
        var N = rv(
          v,
          a
        );
        bn(
          t,
          e,
          N,
          pe(t)
        );
      } else
        bn(
          t,
          e,
          a,
          pe(t)
        );
    } catch (D) {
      bn(
        t,
        e,
        { then: function() {
        }, status: "rejected", reason: D },
        pe()
      );
    } finally {
      q.p = u, c !== null && r.types !== null && (c.types = r.types), M.T = c;
    }
  }
  function yv() {
  }
  function Yc(t, e, l, a) {
    if (t.tag !== 5) throw Error(f(476));
    var n = io(t).queue;
    uo(
      t,
      n,
      e,
      k,
      l === null ? yv : function() {
        return co(t), l(a);
      }
    );
  }
  function io(t) {
    var e = t.memoizedState;
    if (e !== null) return e;
    e = {
      memoizedState: k,
      baseState: k,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Ie,
        lastRenderedState: k
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
        lastRenderedReducer: Ie,
        lastRenderedState: l
      },
      next: null
    }, t.memoizedState = e, t = t.alternate, t !== null && (t.memoizedState = e), e;
  }
  function co(t) {
    var e = io(t);
    e.next === null && (e = t.alternate.memoizedState), bn(
      t,
      e.next.queue,
      {},
      pe()
    );
  }
  function Gc() {
    return Kt(Bn);
  }
  function fo() {
    return Ut().memoizedState;
  }
  function so() {
    return Ut().memoizedState;
  }
  function pv(t) {
    for (var e = t.return; e !== null; ) {
      switch (e.tag) {
        case 24:
        case 3:
          var l = pe();
          t = bl(l);
          var a = Sl(e, t, l);
          a !== null && (ce(a, e, l), mn(a, e, l)), e = { cache: vc() }, t.payload = e;
          return;
      }
      e = e.return;
    }
  }
  function gv(t, e, l) {
    var a = pe();
    l = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Mu(t) ? oo(e, l) : (l = nc(t, e, l, a), l !== null && (ce(l, t, a), ho(l, e, a)));
  }
  function ro(t, e, l) {
    var a = pe();
    bn(t, e, l, a);
  }
  function bn(t, e, l, a) {
    var n = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (Mu(t)) oo(e, n);
    else {
      var u = t.alternate;
      if (t.lanes === 0 && (u === null || u.lanes === 0) && (u = e.lastRenderedReducer, u !== null))
        try {
          var c = e.lastRenderedState, r = u(c, l);
          if (n.hasEagerState = !0, n.eagerState = r, oe(r, c))
            return ou(t, e, n, 0), xt === null && ru(), !1;
        } catch {
        } finally {
        }
      if (l = nc(t, e, n, a), l !== null)
        return ce(l, t, a), ho(l, e, a), !0;
    }
    return !1;
  }
  function Xc(t, e, l, a) {
    if (a = {
      lane: 2,
      revertLane: Sf(),
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Mu(t)) {
      if (e) throw Error(f(479));
    } else
      e = nc(
        t,
        l,
        a,
        2
      ), e !== null && ce(e, t, 2);
  }
  function Mu(t) {
    var e = t.alternate;
    return t === tt || e !== null && e === tt;
  }
  function oo(t, e) {
    Oa = Tu = !0;
    var l = t.pending;
    l === null ? e.next = e : (e.next = l.next, l.next = e), t.pending = e;
  }
  function ho(t, e, l) {
    if ((l & 4194048) !== 0) {
      var a = e.lanes;
      a &= t.pendingLanes, l |= a, e.lanes = l, ps(t, l);
    }
  }
  var Sn = {
    readContext: Kt,
    use: Ru,
    useCallback: jt,
    useContext: jt,
    useEffect: jt,
    useImperativeHandle: jt,
    useLayoutEffect: jt,
    useInsertionEffect: jt,
    useMemo: jt,
    useReducer: jt,
    useRef: jt,
    useState: jt,
    useDebugValue: jt,
    useDeferredValue: jt,
    useTransition: jt,
    useSyncExternalStore: jt,
    useId: jt,
    useHostTransitionStatus: jt,
    useFormState: jt,
    useActionState: jt,
    useOptimistic: jt,
    useMemoCache: jt,
    useCacheRefresh: jt
  };
  Sn.useEffectEvent = jt;
  var mo = {
    readContext: Kt,
    use: Ru,
    useCallback: function(t, e) {
      return te().memoizedState = [
        t,
        e === void 0 ? null : e
      ], t;
    },
    useContext: Kt,
    useEffect: Wr,
    useImperativeHandle: function(t, e, l) {
      l = l != null ? l.concat([t]) : null, Ou(
        4194308,
        4,
        to.bind(null, e, t),
        l
      );
    },
    useLayoutEffect: function(t, e) {
      return Ou(4194308, 4, t, e);
    },
    useInsertionEffect: function(t, e) {
      Ou(4, 2, t, e);
    },
    useMemo: function(t, e) {
      var l = te();
      e = e === void 0 ? null : e;
      var a = t();
      if (Il) {
        ol(!0);
        try {
          t();
        } finally {
          ol(!1);
        }
      }
      return l.memoizedState = [a, e], a;
    },
    useReducer: function(t, e, l) {
      var a = te();
      if (l !== void 0) {
        var n = l(e);
        if (Il) {
          ol(!0);
          try {
            l(e);
          } finally {
            ol(!1);
          }
        }
      } else n = e;
      return a.memoizedState = a.baseState = n, t = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: t,
        lastRenderedState: n
      }, a.queue = t, t = t.dispatch = gv.bind(
        null,
        tt,
        t
      ), [a.memoizedState, t];
    },
    useRef: function(t) {
      var e = te();
      return t = { current: t }, e.memoizedState = t;
    },
    useState: function(t) {
      t = Uc(t);
      var e = t.queue, l = ro.bind(null, tt, e);
      return e.dispatch = l, [t.memoizedState, l];
    },
    useDebugValue: qc,
    useDeferredValue: function(t, e) {
      var l = te();
      return Lc(l, t, e);
    },
    useTransition: function() {
      var t = Uc(!1);
      return t = uo.bind(
        null,
        tt,
        t.queue,
        !0,
        !1
      ), te().memoizedState = t, [!1, t];
    },
    useSyncExternalStore: function(t, e, l) {
      var a = tt, n = te();
      if (ct) {
        if (l === void 0)
          throw Error(f(407));
        l = l();
      } else {
        if (l = e(), xt === null)
          throw Error(f(349));
        (ut & 127) !== 0 || Ur(a, e, l);
      }
      n.memoizedState = l;
      var u = { value: l, getSnapshot: e };
      return n.queue = u, Wr(Br.bind(null, a, u, t), [
        t
      ]), a.flags |= 2048, Ma(
        9,
        { destroy: void 0 },
        Hr.bind(
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
      var t = te(), e = xt.identifierPrefix;
      if (ct) {
        var l = Ge, a = Ye;
        l = (a & ~(1 << 32 - re(a) - 1)).toString(32) + l, e = "_" + e + "R_" + l, l = zu++, 0 < l && (e += "H" + l.toString(32)), e += "_";
      } else
        l = ov++, e = "_" + e + "r_" + l.toString(32) + "_";
      return t.memoizedState = e;
    },
    useHostTransitionStatus: Gc,
    useFormState: wr,
    useActionState: wr,
    useOptimistic: function(t) {
      var e = te();
      e.memoizedState = e.baseState = t;
      var l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return e.queue = l, e = Xc.bind(
        null,
        tt,
        !0,
        l
      ), l.dispatch = e, [t, e];
    },
    useMemoCache: Mc,
    useCacheRefresh: function() {
      return te().memoizedState = pv.bind(
        null,
        tt
      );
    },
    useEffectEvent: function(t) {
      var e = te(), l = { impl: t };
      return e.memoizedState = l, function() {
        if ((rt & 2) !== 0)
          throw Error(f(440));
        return l.impl.apply(void 0, arguments);
      };
    }
  }, Qc = {
    readContext: Kt,
    use: Ru,
    useCallback: lo,
    useContext: Kt,
    useEffect: Bc,
    useImperativeHandle: eo,
    useInsertionEffect: Ir,
    useLayoutEffect: Pr,
    useMemo: ao,
    useReducer: ju,
    useRef: kr,
    useState: function() {
      return ju(Ie);
    },
    useDebugValue: qc,
    useDeferredValue: function(t, e) {
      var l = Ut();
      return no(
        l,
        yt.memoizedState,
        t,
        e
      );
    },
    useTransition: function() {
      var t = ju(Ie)[0], e = Ut().memoizedState;
      return [
        typeof t == "boolean" ? t : gn(t),
        e
      ];
    },
    useSyncExternalStore: Dr,
    useId: fo,
    useHostTransitionStatus: Gc,
    useFormState: Kr,
    useActionState: Kr,
    useOptimistic: function(t, e) {
      var l = Ut();
      return Yr(l, yt, t, e);
    },
    useMemoCache: Mc,
    useCacheRefresh: so
  };
  Qc.useEffectEvent = Fr;
  var vo = {
    readContext: Kt,
    use: Ru,
    useCallback: lo,
    useContext: Kt,
    useEffect: Bc,
    useImperativeHandle: eo,
    useInsertionEffect: Ir,
    useLayoutEffect: Pr,
    useMemo: ao,
    useReducer: Dc,
    useRef: kr,
    useState: function() {
      return Dc(Ie);
    },
    useDebugValue: qc,
    useDeferredValue: function(t, e) {
      var l = Ut();
      return yt === null ? Lc(l, t, e) : no(
        l,
        yt.memoizedState,
        t,
        e
      );
    },
    useTransition: function() {
      var t = Dc(Ie)[0], e = Ut().memoizedState;
      return [
        typeof t == "boolean" ? t : gn(t),
        e
      ];
    },
    useSyncExternalStore: Dr,
    useId: fo,
    useHostTransitionStatus: Gc,
    useFormState: $r,
    useActionState: $r,
    useOptimistic: function(t, e) {
      var l = Ut();
      return yt !== null ? Yr(l, yt, t, e) : (l.baseState = t, [t, l.queue.dispatch]);
    },
    useMemoCache: Mc,
    useCacheRefresh: so
  };
  vo.useEffectEvent = Fr;
  function Zc(t, e, l, a) {
    e = t.memoizedState, l = l(a, e), l = l == null ? e : A({}, e, l), t.memoizedState = l, t.lanes === 0 && (t.updateQueue.baseState = l);
  }
  var Vc = {
    enqueueSetState: function(t, e, l) {
      t = t._reactInternals;
      var a = pe(), n = bl(a);
      n.payload = e, l != null && (n.callback = l), e = Sl(t, n, a), e !== null && (ce(e, t, a), mn(e, t, a));
    },
    enqueueReplaceState: function(t, e, l) {
      t = t._reactInternals;
      var a = pe(), n = bl(a);
      n.tag = 1, n.payload = e, l != null && (n.callback = l), e = Sl(t, n, a), e !== null && (ce(e, t, a), mn(e, t, a));
    },
    enqueueForceUpdate: function(t, e) {
      t = t._reactInternals;
      var l = pe(), a = bl(l);
      a.tag = 2, e != null && (a.callback = e), e = Sl(t, a, l), e !== null && (ce(e, t, l), mn(e, t, l));
    }
  };
  function yo(t, e, l, a, n, u, c) {
    return t = t.stateNode, typeof t.shouldComponentUpdate == "function" ? t.shouldComponentUpdate(a, u, c) : e.prototype && e.prototype.isPureReactComponent ? !un(l, a) || !un(n, u) : !0;
  }
  function po(t, e, l, a) {
    t = e.state, typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps(l, a), typeof e.UNSAFE_componentWillReceiveProps == "function" && e.UNSAFE_componentWillReceiveProps(l, a), e.state !== t && Vc.enqueueReplaceState(e, e.state, null);
  }
  function Pl(t, e) {
    var l = e;
    if ("ref" in e) {
      l = {};
      for (var a in e)
        a !== "ref" && (l[a] = e[a]);
    }
    if (t = t.defaultProps) {
      l === e && (l = A({}, l));
      for (var n in t)
        l[n] === void 0 && (l[n] = t[n]);
    }
    return l;
  }
  function go(t) {
    su(t);
  }
  function bo(t) {
    console.error(t);
  }
  function So(t) {
    su(t);
  }
  function Cu(t, e) {
    try {
      var l = t.onUncaughtError;
      l(e.value, { componentStack: e.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function xo(t, e, l) {
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
  function wc(t, e, l) {
    return l = bl(l), l.tag = 3, l.payload = { element: null }, l.callback = function() {
      Cu(t, e);
    }, l;
  }
  function Eo(t) {
    return t = bl(t), t.tag = 3, t;
  }
  function _o(t, e, l, a) {
    var n = l.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var u = a.value;
      t.payload = function() {
        return n(u);
      }, t.callback = function() {
        xo(e, l, a);
      };
    }
    var c = l.stateNode;
    c !== null && typeof c.componentDidCatch == "function" && (t.callback = function() {
      xo(e, l, a), typeof n != "function" && (Al === null ? Al = /* @__PURE__ */ new Set([this]) : Al.add(this));
      var r = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: r !== null ? r : ""
      });
    });
  }
  function bv(t, e, l, a, n) {
    if (l.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (e = l.alternate, e !== null && _a(
        e,
        l,
        n,
        !0
      ), l = he.current, l !== null) {
        switch (l.tag) {
          case 31:
          case 13:
            return je === null ? Vu() : l.alternate === null && Ot === 0 && (Ot = 3), l.flags &= -257, l.flags |= 65536, l.lanes = n, a === bu ? l.flags |= 16384 : (e = l.updateQueue, e === null ? l.updateQueue = /* @__PURE__ */ new Set([a]) : e.add(a), pf(t, a, n)), !1;
          case 22:
            return l.flags |= 65536, a === bu ? l.flags |= 16384 : (e = l.updateQueue, e === null ? (e = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, l.updateQueue = e) : (l = e.retryQueue, l === null ? e.retryQueue = /* @__PURE__ */ new Set([a]) : l.add(a)), pf(t, a, n)), !1;
        }
        throw Error(f(435, l.tag));
      }
      return pf(t, a, n), Vu(), !1;
    }
    if (ct)
      return e = he.current, e !== null ? ((e.flags & 65536) === 0 && (e.flags |= 256), e.flags |= 65536, e.lanes = n, a !== rc && (t = Error(f(422), { cause: a }), sn(Te(t, l)))) : (a !== rc && (e = Error(f(423), {
        cause: a
      }), sn(
        Te(e, l)
      )), t = t.current.alternate, t.flags |= 65536, n &= -n, t.lanes |= n, a = Te(a, l), n = wc(
        t.stateNode,
        a,
        n
      ), xc(t, n), Ot !== 4 && (Ot = 2)), !1;
    var u = Error(f(520), { cause: a });
    if (u = Te(u, l), jn === null ? jn = [u] : jn.push(u), Ot !== 4 && (Ot = 2), e === null) return !0;
    a = Te(a, l), l = e;
    do {
      switch (l.tag) {
        case 3:
          return l.flags |= 65536, t = n & -n, l.lanes |= t, t = wc(l.stateNode, a, t), xc(l, t), !1;
        case 1:
          if (e = l.type, u = l.stateNode, (l.flags & 128) === 0 && (typeof e.getDerivedStateFromError == "function" || u !== null && typeof u.componentDidCatch == "function" && (Al === null || !Al.has(u))))
            return l.flags |= 65536, n &= -n, l.lanes |= n, n = Eo(n), _o(
              n,
              t,
              l,
              a
            ), xc(l, n), !1;
      }
      l = l.return;
    } while (l !== null);
    return !1;
  }
  var Kc = Error(f(461)), Lt = !1;
  function Jt(t, e, l, a) {
    e.child = t === null ? Ar(e, null, l, a) : Fl(
      e,
      t.child,
      l,
      a
    );
  }
  function To(t, e, l, a, n) {
    l = l.render;
    var u = e.ref;
    if ("ref" in a) {
      var c = {};
      for (var r in a)
        r !== "ref" && (c[r] = a[r]);
    } else c = a;
    return Jl(e), a = Rc(
      t,
      e,
      l,
      c,
      u,
      n
    ), r = jc(), t !== null && !Lt ? (Oc(t, e, n), Pe(t, e, n)) : (ct && r && fc(e), e.flags |= 1, Jt(t, e, a, n), e.child);
  }
  function zo(t, e, l, a, n) {
    if (t === null) {
      var u = l.type;
      return typeof u == "function" && !uc(u) && u.defaultProps === void 0 && l.compare === null ? (e.tag = 15, e.type = u, Ao(
        t,
        e,
        u,
        a,
        n
      )) : (t = hu(
        l.type,
        null,
        a,
        e,
        e.mode,
        n
      ), t.ref = e.ref, t.return = e, e.child = t);
    }
    if (u = t.child, !tf(t, n)) {
      var c = u.memoizedProps;
      if (l = l.compare, l = l !== null ? l : un, l(c, a) && t.ref === e.ref)
        return Pe(t, e, n);
    }
    return e.flags |= 1, t = Je(u, a), t.ref = e.ref, t.return = e, e.child = t;
  }
  function Ao(t, e, l, a, n) {
    if (t !== null) {
      var u = t.memoizedProps;
      if (un(u, a) && t.ref === e.ref)
        if (Lt = !1, e.pendingProps = a = u, tf(t, n))
          (t.flags & 131072) !== 0 && (Lt = !0);
        else
          return e.lanes = t.lanes, Pe(t, e, n);
    }
    return Jc(
      t,
      e,
      l,
      a,
      n
    );
  }
  function Ro(t, e, l, a) {
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
        return jo(
          t,
          e,
          u,
          l,
          a
        );
      }
      if ((l & 536870912) !== 0)
        e.memoizedState = { baseLanes: 0, cachePool: null }, t !== null && pu(
          e,
          u !== null ? u.cachePool : null
        ), u !== null ? Or(e, u) : _c(), Nr(e);
      else
        return a = e.lanes = 536870912, jo(
          t,
          e,
          u !== null ? u.baseLanes | l : l,
          l,
          a
        );
    } else
      u !== null ? (pu(e, u.cachePool), Or(e, u), El(), e.memoizedState = null) : (t !== null && pu(e, null), _c(), El());
    return Jt(t, e, n, l), e.child;
  }
  function xn(t, e) {
    return t !== null && t.tag === 22 || e.stateNode !== null || (e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), e.sibling;
  }
  function jo(t, e, l, a, n) {
    var u = pc();
    return u = u === null ? null : { parent: Bt._currentValue, pool: u }, e.memoizedState = {
      baseLanes: l,
      cachePool: u
    }, t !== null && pu(e, null), _c(), Nr(e), t !== null && _a(t, e, a, !0), e.childLanes = n, null;
  }
  function Du(t, e) {
    return e = Hu(
      { mode: e.mode, children: e.children },
      t.mode
    ), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function Oo(t, e, l) {
    return Fl(e, t.child, null, l), t = Du(e, e.pendingProps), t.flags |= 2, me(e), e.memoizedState = null, t;
  }
  function Sv(t, e, l) {
    var a = e.pendingProps, n = (e.flags & 128) !== 0;
    if (e.flags &= -129, t === null) {
      if (ct) {
        if (a.mode === "hidden")
          return t = Du(e, a), e.lanes = 536870912, xn(null, t);
        if (zc(e), (t = Et) ? (t = Xd(
          t,
          Re
        ), t = t !== null && t.data === "&" ? t : null, t !== null && (e.memoizedState = {
          dehydrated: t,
          treeContext: ml !== null ? { id: Ye, overflow: Ge } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, l = or(t), l.return = e, e.child = l, wt = e, Et = null)) : t = null, t === null) throw yl(e);
        return e.lanes = 536870912, null;
      }
      return Du(e, a);
    }
    var u = t.memoizedState;
    if (u !== null) {
      var c = u.dehydrated;
      if (zc(e), n)
        if (e.flags & 256)
          e.flags &= -257, e = Oo(
            t,
            e,
            l
          );
        else if (e.memoizedState !== null)
          e.child = t.child, e.flags |= 128, e = null;
        else throw Error(f(558));
      else if (Lt || _a(t, e, l, !1), n = (l & t.childLanes) !== 0, Lt || n) {
        if (a = xt, a !== null && (c = gs(a, l), c !== 0 && c !== u.retryLane))
          throw u.retryLane = c, Zl(t, c), ce(a, t, c), Kc;
        Vu(), e = Oo(
          t,
          e,
          l
        );
      } else
        t = u.treeContext, Et = Oe(c.nextSibling), wt = e, ct = !0, vl = null, Re = !1, t !== null && mr(e, t), e = Du(e, a), e.flags |= 4096;
      return e;
    }
    return t = Je(t.child, {
      mode: a.mode,
      children: a.children
    }), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function Uu(t, e) {
    var l = e.ref;
    if (l === null)
      t !== null && t.ref !== null && (e.flags |= 4194816);
    else {
      if (typeof l != "function" && typeof l != "object")
        throw Error(f(284));
      (t === null || t.ref !== l) && (e.flags |= 4194816);
    }
  }
  function Jc(t, e, l, a, n) {
    return Jl(e), l = Rc(
      t,
      e,
      l,
      a,
      void 0,
      n
    ), a = jc(), t !== null && !Lt ? (Oc(t, e, n), Pe(t, e, n)) : (ct && a && fc(e), e.flags |= 1, Jt(t, e, l, n), e.child);
  }
  function No(t, e, l, a, n, u) {
    return Jl(e), e.updateQueue = null, l = Cr(
      e,
      a,
      l,
      n
    ), Mr(t), a = jc(), t !== null && !Lt ? (Oc(t, e, u), Pe(t, e, u)) : (ct && a && fc(e), e.flags |= 1, Jt(t, e, l, u), e.child);
  }
  function Mo(t, e, l, a, n) {
    if (Jl(e), e.stateNode === null) {
      var u = ba, c = l.contextType;
      typeof c == "object" && c !== null && (u = Kt(c)), u = new l(a, u), e.memoizedState = u.state !== null && u.state !== void 0 ? u.state : null, u.updater = Vc, e.stateNode = u, u._reactInternals = e, u = e.stateNode, u.props = a, u.state = e.memoizedState, u.refs = {}, bc(e), c = l.contextType, u.context = typeof c == "object" && c !== null ? Kt(c) : ba, u.state = e.memoizedState, c = l.getDerivedStateFromProps, typeof c == "function" && (Zc(
        e,
        l,
        c,
        a
      ), u.state = e.memoizedState), typeof l.getDerivedStateFromProps == "function" || typeof u.getSnapshotBeforeUpdate == "function" || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (c = u.state, typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount(), c !== u.state && Vc.enqueueReplaceState(u, u.state, null), yn(e, a, u, n), vn(), u.state = e.memoizedState), typeof u.componentDidMount == "function" && (e.flags |= 4194308), a = !0;
    } else if (t === null) {
      u = e.stateNode;
      var r = e.memoizedProps, v = Pl(l, r);
      u.props = v;
      var _ = u.context, N = l.contextType;
      c = ba, typeof N == "object" && N !== null && (c = Kt(N));
      var D = l.getDerivedStateFromProps;
      N = typeof D == "function" || typeof u.getSnapshotBeforeUpdate == "function", r = e.pendingProps !== r, N || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (r || _ !== c) && po(
        e,
        u,
        a,
        c
      ), gl = !1;
      var z = e.memoizedState;
      u.state = z, yn(e, a, u, n), vn(), _ = e.memoizedState, r || z !== _ || gl ? (typeof D == "function" && (Zc(
        e,
        l,
        D,
        a
      ), _ = e.memoizedState), (v = gl || yo(
        e,
        l,
        v,
        a,
        z,
        _,
        c
      )) ? (N || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function" && (e.flags |= 4194308)) : (typeof u.componentDidMount == "function" && (e.flags |= 4194308), e.memoizedProps = a, e.memoizedState = _), u.props = a, u.state = _, u.context = c, a = v) : (typeof u.componentDidMount == "function" && (e.flags |= 4194308), a = !1);
    } else {
      u = e.stateNode, Sc(t, e), c = e.memoizedProps, N = Pl(l, c), u.props = N, D = e.pendingProps, z = u.context, _ = l.contextType, v = ba, typeof _ == "object" && _ !== null && (v = Kt(_)), r = l.getDerivedStateFromProps, (_ = typeof r == "function" || typeof u.getSnapshotBeforeUpdate == "function") || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (c !== D || z !== v) && po(
        e,
        u,
        a,
        v
      ), gl = !1, z = e.memoizedState, u.state = z, yn(e, a, u, n), vn();
      var R = e.memoizedState;
      c !== D || z !== R || gl || t !== null && t.dependencies !== null && vu(t.dependencies) ? (typeof r == "function" && (Zc(
        e,
        l,
        r,
        a
      ), R = e.memoizedState), (N = gl || yo(
        e,
        l,
        N,
        a,
        z,
        R,
        v
      ) || t !== null && t.dependencies !== null && vu(t.dependencies)) ? (_ || typeof u.UNSAFE_componentWillUpdate != "function" && typeof u.componentWillUpdate != "function" || (typeof u.componentWillUpdate == "function" && u.componentWillUpdate(a, R, v), typeof u.UNSAFE_componentWillUpdate == "function" && u.UNSAFE_componentWillUpdate(
        a,
        R,
        v
      )), typeof u.componentDidUpdate == "function" && (e.flags |= 4), typeof u.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024)) : (typeof u.componentDidUpdate != "function" || c === t.memoizedProps && z === t.memoizedState || (e.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || c === t.memoizedProps && z === t.memoizedState || (e.flags |= 1024), e.memoizedProps = a, e.memoizedState = R), u.props = a, u.state = R, u.context = v, a = N) : (typeof u.componentDidUpdate != "function" || c === t.memoizedProps && z === t.memoizedState || (e.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || c === t.memoizedProps && z === t.memoizedState || (e.flags |= 1024), a = !1);
    }
    return u = a, Uu(t, e), a = (e.flags & 128) !== 0, u || a ? (u = e.stateNode, l = a && typeof l.getDerivedStateFromError != "function" ? null : u.render(), e.flags |= 1, t !== null && a ? (e.child = Fl(
      e,
      t.child,
      null,
      n
    ), e.child = Fl(
      e,
      null,
      l,
      n
    )) : Jt(t, e, l, n), e.memoizedState = u.state, t = e.child) : t = Pe(
      t,
      e,
      n
    ), t;
  }
  function Co(t, e, l, a) {
    return wl(), e.flags |= 256, Jt(t, e, l, a), e.child;
  }
  var $c = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function kc(t) {
    return { baseLanes: t, cachePool: Sr() };
  }
  function Wc(t, e, l) {
    return t = t !== null ? t.childLanes & ~l : 0, e && (t |= ye), t;
  }
  function Do(t, e, l) {
    var a = e.pendingProps, n = !1, u = (e.flags & 128) !== 0, c;
    if ((c = u) || (c = t !== null && t.memoizedState === null ? !1 : (Dt.current & 2) !== 0), c && (n = !0, e.flags &= -129), c = (e.flags & 32) !== 0, e.flags &= -33, t === null) {
      if (ct) {
        if (n ? xl(e) : El(), (t = Et) ? (t = Xd(
          t,
          Re
        ), t = t !== null && t.data !== "&" ? t : null, t !== null && (e.memoizedState = {
          dehydrated: t,
          treeContext: ml !== null ? { id: Ye, overflow: Ge } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, l = or(t), l.return = e, e.child = l, wt = e, Et = null)) : t = null, t === null) throw yl(e);
        return Df(t) ? e.lanes = 32 : e.lanes = 536870912, null;
      }
      var r = a.children;
      return a = a.fallback, n ? (El(), n = e.mode, r = Hu(
        { mode: "hidden", children: r },
        n
      ), a = Vl(
        a,
        n,
        l,
        null
      ), r.return = e, a.return = e, r.sibling = a, e.child = r, a = e.child, a.memoizedState = kc(l), a.childLanes = Wc(
        t,
        c,
        l
      ), e.memoizedState = $c, xn(null, a)) : (xl(e), Fc(e, r));
    }
    var v = t.memoizedState;
    if (v !== null && (r = v.dehydrated, r !== null)) {
      if (u)
        e.flags & 256 ? (xl(e), e.flags &= -257, e = Ic(
          t,
          e,
          l
        )) : e.memoizedState !== null ? (El(), e.child = t.child, e.flags |= 128, e = null) : (El(), r = a.fallback, n = e.mode, a = Hu(
          { mode: "visible", children: a.children },
          n
        ), r = Vl(
          r,
          n,
          l,
          null
        ), r.flags |= 2, a.return = e, r.return = e, a.sibling = r, e.child = a, Fl(
          e,
          t.child,
          null,
          l
        ), a = e.child, a.memoizedState = kc(l), a.childLanes = Wc(
          t,
          c,
          l
        ), e.memoizedState = $c, e = xn(null, a));
      else if (xl(e), Df(r)) {
        if (c = r.nextSibling && r.nextSibling.dataset, c) var _ = c.dgst;
        c = _, a = Error(f(419)), a.stack = "", a.digest = c, sn({ value: a, source: null, stack: null }), e = Ic(
          t,
          e,
          l
        );
      } else if (Lt || _a(t, e, l, !1), c = (l & t.childLanes) !== 0, Lt || c) {
        if (c = xt, c !== null && (a = gs(c, l), a !== 0 && a !== v.retryLane))
          throw v.retryLane = a, Zl(t, a), ce(c, t, a), Kc;
        Cf(r) || Vu(), e = Ic(
          t,
          e,
          l
        );
      } else
        Cf(r) ? (e.flags |= 192, e.child = t.child, e = null) : (t = v.treeContext, Et = Oe(
          r.nextSibling
        ), wt = e, ct = !0, vl = null, Re = !1, t !== null && mr(e, t), e = Fc(
          e,
          a.children
        ), e.flags |= 4096);
      return e;
    }
    return n ? (El(), r = a.fallback, n = e.mode, v = t.child, _ = v.sibling, a = Je(v, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = v.subtreeFlags & 65011712, _ !== null ? r = Je(
      _,
      r
    ) : (r = Vl(
      r,
      n,
      l,
      null
    ), r.flags |= 2), r.return = e, a.return = e, a.sibling = r, e.child = a, xn(null, a), a = e.child, r = t.child.memoizedState, r === null ? r = kc(l) : (n = r.cachePool, n !== null ? (v = Bt._currentValue, n = n.parent !== v ? { parent: v, pool: v } : n) : n = Sr(), r = {
      baseLanes: r.baseLanes | l,
      cachePool: n
    }), a.memoizedState = r, a.childLanes = Wc(
      t,
      c,
      l
    ), e.memoizedState = $c, xn(t.child, a)) : (xl(e), l = t.child, t = l.sibling, l = Je(l, {
      mode: "visible",
      children: a.children
    }), l.return = e, l.sibling = null, t !== null && (c = e.deletions, c === null ? (e.deletions = [t], e.flags |= 16) : c.push(t)), e.child = l, e.memoizedState = null, l);
  }
  function Fc(t, e) {
    return e = Hu(
      { mode: "visible", children: e },
      t.mode
    ), e.return = t, t.child = e;
  }
  function Hu(t, e) {
    return t = de(22, t, null, e), t.lanes = 0, t;
  }
  function Ic(t, e, l) {
    return Fl(e, t.child, null, l), t = Fc(
      e,
      e.pendingProps.children
    ), t.flags |= 2, e.memoizedState = null, t;
  }
  function Uo(t, e, l) {
    t.lanes |= e;
    var a = t.alternate;
    a !== null && (a.lanes |= e), hc(t.return, e, l);
  }
  function Pc(t, e, l, a, n, u) {
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
  function Ho(t, e, l) {
    var a = e.pendingProps, n = a.revealOrder, u = a.tail;
    a = a.children;
    var c = Dt.current, r = (c & 2) !== 0;
    if (r ? (c = c & 1 | 2, e.flags |= 128) : c &= 1, L(Dt, c), Jt(t, e, a, l), a = ct ? fn : 0, !r && t !== null && (t.flags & 128) !== 0)
      t: for (t = e.child; t !== null; ) {
        if (t.tag === 13)
          t.memoizedState !== null && Uo(t, l, e);
        else if (t.tag === 19)
          Uo(t, l, e);
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
          t = l.alternate, t !== null && _u(t) === null && (n = l), l = l.sibling;
        l = n, l === null ? (n = e.child, e.child = null) : (n = l.sibling, l.sibling = null), Pc(
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
          if (t = n.alternate, t !== null && _u(t) === null) {
            e.child = n;
            break;
          }
          t = n.sibling, n.sibling = l, l = n, n = t;
        }
        Pc(
          e,
          !0,
          l,
          null,
          u,
          a
        );
        break;
      case "together":
        Pc(
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
  function Pe(t, e, l) {
    if (t !== null && (e.dependencies = t.dependencies), zl |= e.lanes, (l & e.childLanes) === 0)
      if (t !== null) {
        if (_a(
          t,
          e,
          l,
          !1
        ), (l & e.childLanes) === 0)
          return null;
      } else return null;
    if (t !== null && e.child !== t.child)
      throw Error(f(153));
    if (e.child !== null) {
      for (t = e.child, l = Je(t, t.pendingProps), e.child = l, l.return = e; t.sibling !== null; )
        t = t.sibling, l = l.sibling = Je(t, t.pendingProps), l.return = e;
      l.sibling = null;
    }
    return e.child;
  }
  function tf(t, e) {
    return (t.lanes & e) !== 0 ? !0 : (t = t.dependencies, !!(t !== null && vu(t)));
  }
  function xv(t, e, l) {
    switch (e.tag) {
      case 3:
        Pt(e, e.stateNode.containerInfo), pl(e, Bt, t.memoizedState.cache), wl();
        break;
      case 27:
      case 5:
        Ka(e);
        break;
      case 4:
        Pt(e, e.stateNode.containerInfo);
        break;
      case 10:
        pl(
          e,
          e.type,
          e.memoizedProps.value
        );
        break;
      case 31:
        if (e.memoizedState !== null)
          return e.flags |= 128, zc(e), null;
        break;
      case 13:
        var a = e.memoizedState;
        if (a !== null)
          return a.dehydrated !== null ? (xl(e), e.flags |= 128, null) : (l & e.child.childLanes) !== 0 ? Do(t, e, l) : (xl(e), t = Pe(
            t,
            e,
            l
          ), t !== null ? t.sibling : null);
        xl(e);
        break;
      case 19:
        var n = (t.flags & 128) !== 0;
        if (a = (l & e.childLanes) !== 0, a || (_a(
          t,
          e,
          l,
          !1
        ), a = (l & e.childLanes) !== 0), n) {
          if (a)
            return Ho(
              t,
              e,
              l
            );
          e.flags |= 128;
        }
        if (n = e.memoizedState, n !== null && (n.rendering = null, n.tail = null, n.lastEffect = null), L(Dt, Dt.current), a) break;
        return null;
      case 22:
        return e.lanes = 0, Ro(
          t,
          e,
          l,
          e.pendingProps
        );
      case 24:
        pl(e, Bt, t.memoizedState.cache);
    }
    return Pe(t, e, l);
  }
  function Bo(t, e, l) {
    if (t !== null)
      if (t.memoizedProps !== e.pendingProps)
        Lt = !0;
      else {
        if (!tf(t, l) && (e.flags & 128) === 0)
          return Lt = !1, xv(
            t,
            e,
            l
          );
        Lt = (t.flags & 131072) !== 0;
      }
    else
      Lt = !1, ct && (e.flags & 1048576) !== 0 && hr(e, fn, e.index);
    switch (e.lanes = 0, e.tag) {
      case 16:
        t: {
          var a = e.pendingProps;
          if (t = kl(e.elementType), e.type = t, typeof t == "function")
            uc(t) ? (a = Pl(t, a), e.tag = 1, e = Mo(
              null,
              e,
              t,
              a,
              l
            )) : (e.tag = 0, e = Jc(
              null,
              e,
              t,
              a,
              l
            ));
          else {
            if (t != null) {
              var n = t.$$typeof;
              if (n === dt) {
                e.tag = 11, e = To(
                  null,
                  e,
                  t,
                  a,
                  l
                );
                break t;
              } else if (n === F) {
                e.tag = 14, e = zo(
                  null,
                  e,
                  t,
                  a,
                  l
                );
                break t;
              }
            }
            throw e = Se(t) || t, Error(f(306, e, ""));
          }
        }
        return e;
      case 0:
        return Jc(
          t,
          e,
          e.type,
          e.pendingProps,
          l
        );
      case 1:
        return a = e.type, n = Pl(
          a,
          e.pendingProps
        ), Mo(
          t,
          e,
          a,
          n,
          l
        );
      case 3:
        t: {
          if (Pt(
            e,
            e.stateNode.containerInfo
          ), t === null) throw Error(f(387));
          a = e.pendingProps;
          var u = e.memoizedState;
          n = u.element, Sc(t, e), yn(e, a, null, l);
          var c = e.memoizedState;
          if (a = c.cache, pl(e, Bt, a), a !== u.cache && mc(
            e,
            [Bt],
            l,
            !0
          ), vn(), a = c.element, u.isDehydrated)
            if (u = {
              element: a,
              isDehydrated: !1,
              cache: c.cache
            }, e.updateQueue.baseState = u, e.memoizedState = u, e.flags & 256) {
              e = Co(
                t,
                e,
                a,
                l
              );
              break t;
            } else if (a !== n) {
              n = Te(
                Error(f(424)),
                e
              ), sn(n), e = Co(
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
              for (Et = Oe(t.firstChild), wt = e, ct = !0, vl = null, Re = !0, l = Ar(
                e,
                null,
                a,
                l
              ), e.child = l; l; )
                l.flags = l.flags & -3 | 4096, l = l.sibling;
            }
          else {
            if (wl(), a === n) {
              e = Pe(
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
        return Uu(t, e), t === null ? (l = Jd(
          e.type,
          null,
          e.pendingProps,
          null
        )) ? e.memoizedState = l : ct || (l = e.type, t = e.pendingProps, a = Fu(
          lt.current
        ).createElement(l), a[Vt] = e, a[ee] = t, $t(a, l, t), Xt(a), e.stateNode = a) : e.memoizedState = Jd(
          e.type,
          t.memoizedProps,
          e.pendingProps,
          t.memoizedState
        ), null;
      case 27:
        return Ka(e), t === null && ct && (a = e.stateNode = Vd(
          e.type,
          e.pendingProps,
          lt.current
        ), wt = e, Re = !0, n = Et, Nl(e.type) ? (Uf = n, Et = Oe(a.firstChild)) : Et = n), Jt(
          t,
          e,
          e.pendingProps.children,
          l
        ), Uu(t, e), t === null && (e.flags |= 4194304), e.child;
      case 5:
        return t === null && ct && ((n = a = Et) && (a = Fv(
          a,
          e.type,
          e.pendingProps,
          Re
        ), a !== null ? (e.stateNode = a, wt = e, Et = Oe(a.firstChild), Re = !1, n = !0) : n = !1), n || yl(e)), Ka(e), n = e.type, u = e.pendingProps, c = t !== null ? t.memoizedProps : null, a = u.children, Of(n, u) ? a = null : c !== null && Of(n, c) && (e.flags |= 32), e.memoizedState !== null && (n = Rc(
          t,
          e,
          dv,
          null,
          null,
          l
        ), Bn._currentValue = n), Uu(t, e), Jt(t, e, a, l), e.child;
      case 6:
        return t === null && ct && ((t = l = Et) && (l = Iv(
          l,
          e.pendingProps,
          Re
        ), l !== null ? (e.stateNode = l, wt = e, Et = null, t = !0) : t = !1), t || yl(e)), null;
      case 13:
        return Do(t, e, l);
      case 4:
        return Pt(
          e,
          e.stateNode.containerInfo
        ), a = e.pendingProps, t === null ? e.child = Fl(
          e,
          null,
          a,
          l
        ) : Jt(t, e, a, l), e.child;
      case 11:
        return To(
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
        return a = e.pendingProps, pl(e, e.type, a.value), Jt(t, e, a.children, l), e.child;
      case 9:
        return n = e.type._context, a = e.pendingProps.children, Jl(e), n = Kt(n), a = a(n), e.flags |= 1, Jt(t, e, a, l), e.child;
      case 14:
        return zo(
          t,
          e,
          e.type,
          e.pendingProps,
          l
        );
      case 15:
        return Ao(
          t,
          e,
          e.type,
          e.pendingProps,
          l
        );
      case 19:
        return Ho(t, e, l);
      case 31:
        return Sv(t, e, l);
      case 22:
        return Ro(
          t,
          e,
          l,
          e.pendingProps
        );
      case 24:
        return Jl(e), a = Kt(Bt), t === null ? (n = pc(), n === null && (n = xt, u = vc(), n.pooledCache = u, u.refCount++, u !== null && (n.pooledCacheLanes |= l), n = u), e.memoizedState = { parent: a, cache: n }, bc(e), pl(e, Bt, n)) : ((t.lanes & l) !== 0 && (Sc(t, e), yn(e, null, null, l), vn()), n = t.memoizedState, u = e.memoizedState, n.parent !== a ? (n = { parent: a, cache: a }, e.memoizedState = n, e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = n), pl(e, Bt, a)) : (a = u.cache, pl(e, Bt, a), a !== n.cache && mc(
          e,
          [Bt],
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
    throw Error(f(156, e.tag));
  }
  function tl(t) {
    t.flags |= 4;
  }
  function ef(t, e, l, a, n) {
    if ((e = (t.mode & 32) !== 0) && (e = !1), e) {
      if (t.flags |= 16777216, (n & 335544128) === n)
        if (t.stateNode.complete) t.flags |= 8192;
        else if (sd()) t.flags |= 8192;
        else
          throw Wl = bu, gc;
    } else t.flags &= -16777217;
  }
  function qo(t, e) {
    if (e.type !== "stylesheet" || (e.state.loading & 4) !== 0)
      t.flags &= -16777217;
    else if (t.flags |= 16777216, !Id(e))
      if (sd()) t.flags |= 8192;
      else
        throw Wl = bu, gc;
  }
  function Bu(t, e) {
    e !== null && (t.flags |= 4), t.flags & 16384 && (e = t.tag !== 22 ? vs() : 536870912, t.lanes |= e, Ha |= e);
  }
  function En(t, e) {
    if (!ct)
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
  function _t(t) {
    var e = t.alternate !== null && t.alternate.child === t.child, l = 0, a = 0;
    if (e)
      for (var n = t.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags & 65011712, a |= n.flags & 65011712, n.return = t, n = n.sibling;
    else
      for (n = t.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags, a |= n.flags, n.return = t, n = n.sibling;
    return t.subtreeFlags |= a, t.childLanes = l, e;
  }
  function Ev(t, e, l) {
    var a = e.pendingProps;
    switch (sc(e), e.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return _t(e), null;
      case 1:
        return _t(e), null;
      case 3:
        return l = e.stateNode, a = null, t !== null && (a = t.memoizedState.cache), e.memoizedState.cache !== a && (e.flags |= 2048), We(Bt), Ct(), l.pendingContext && (l.context = l.pendingContext, l.pendingContext = null), (t === null || t.child === null) && (Ea(e) ? tl(e) : t === null || t.memoizedState.isDehydrated && (e.flags & 256) === 0 || (e.flags |= 1024, oc())), _t(e), null;
      case 26:
        var n = e.type, u = e.memoizedState;
        return t === null ? (tl(e), u !== null ? (_t(e), qo(e, u)) : (_t(e), ef(
          e,
          n,
          null,
          a,
          l
        ))) : u ? u !== t.memoizedState ? (tl(e), _t(e), qo(e, u)) : (_t(e), e.flags &= -16777217) : (t = t.memoizedProps, t !== a && tl(e), _t(e), ef(
          e,
          n,
          t,
          a,
          l
        )), null;
      case 27:
        if (Jn(e), l = lt.current, n = e.type, t !== null && e.stateNode != null)
          t.memoizedProps !== a && tl(e);
        else {
          if (!a) {
            if (e.stateNode === null)
              throw Error(f(166));
            return _t(e), null;
          }
          t = X.current, Ea(e) ? vr(e) : (t = Vd(n, a, l), e.stateNode = t, tl(e));
        }
        return _t(e), null;
      case 5:
        if (Jn(e), n = e.type, t !== null && e.stateNode != null)
          t.memoizedProps !== a && tl(e);
        else {
          if (!a) {
            if (e.stateNode === null)
              throw Error(f(166));
            return _t(e), null;
          }
          if (u = X.current, Ea(e))
            vr(e);
          else {
            var c = Fu(
              lt.current
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
            u[Vt] = e, u[ee] = a;
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
            t: switch ($t(u, n, a), n) {
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
            a && tl(e);
          }
        }
        return _t(e), ef(
          e,
          e.type,
          t === null ? null : t.memoizedProps,
          e.pendingProps,
          l
        ), null;
      case 6:
        if (t && e.stateNode != null)
          t.memoizedProps !== a && tl(e);
        else {
          if (typeof a != "string" && e.stateNode === null)
            throw Error(f(166));
          if (t = lt.current, Ea(e)) {
            if (t = e.stateNode, l = e.memoizedProps, a = null, n = wt, n !== null)
              switch (n.tag) {
                case 27:
                case 5:
                  a = n.memoizedProps;
              }
            t[Vt] = e, t = !!(t.nodeValue === l || a !== null && a.suppressHydrationWarning === !0 || Dd(t.nodeValue, l)), t || yl(e, !0);
          } else
            t = Fu(t).createTextNode(
              a
            ), t[Vt] = e, e.stateNode = t;
        }
        return _t(e), null;
      case 31:
        if (l = e.memoizedState, t === null || t.memoizedState !== null) {
          if (a = Ea(e), l !== null) {
            if (t === null) {
              if (!a) throw Error(f(318));
              if (t = e.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(f(557));
              t[Vt] = e;
            } else
              wl(), (e.flags & 128) === 0 && (e.memoizedState = null), e.flags |= 4;
            _t(e), t = !1;
          } else
            l = oc(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = l), t = !0;
          if (!t)
            return e.flags & 256 ? (me(e), e) : (me(e), null);
          if ((e.flags & 128) !== 0)
            throw Error(f(558));
        }
        return _t(e), null;
      case 13:
        if (a = e.memoizedState, t === null || t.memoizedState !== null && t.memoizedState.dehydrated !== null) {
          if (n = Ea(e), a !== null && a.dehydrated !== null) {
            if (t === null) {
              if (!n) throw Error(f(318));
              if (n = e.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(f(317));
              n[Vt] = e;
            } else
              wl(), (e.flags & 128) === 0 && (e.memoizedState = null), e.flags |= 4;
            _t(e), n = !1;
          } else
            n = oc(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = n), n = !0;
          if (!n)
            return e.flags & 256 ? (me(e), e) : (me(e), null);
        }
        return me(e), (e.flags & 128) !== 0 ? (e.lanes = l, e) : (l = a !== null, t = t !== null && t.memoizedState !== null, l && (a = e.child, n = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (n = a.alternate.memoizedState.cachePool.pool), u = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (u = a.memoizedState.cachePool.pool), u !== n && (a.flags |= 2048)), l !== t && l && (e.child.flags |= 8192), Bu(e, e.updateQueue), _t(e), null);
      case 4:
        return Ct(), t === null && Tf(e.stateNode.containerInfo), _t(e), null;
      case 10:
        return We(e.type), _t(e), null;
      case 19:
        if (U(Dt), a = e.memoizedState, a === null) return _t(e), null;
        if (n = (e.flags & 128) !== 0, u = a.rendering, u === null)
          if (n) En(a, !1);
          else {
            if (Ot !== 0 || t !== null && (t.flags & 128) !== 0)
              for (t = e.child; t !== null; ) {
                if (u = _u(t), u !== null) {
                  for (e.flags |= 128, En(a, !1), t = u.updateQueue, e.updateQueue = t, Bu(e, t), e.subtreeFlags = 0, t = l, l = e.child; l !== null; )
                    rr(l, t), l = l.sibling;
                  return L(
                    Dt,
                    Dt.current & 1 | 2
                  ), ct && $e(e, a.treeForkCount), e.child;
                }
                t = t.sibling;
              }
            a.tail !== null && fe() > Xu && (e.flags |= 128, n = !0, En(a, !1), e.lanes = 4194304);
          }
        else {
          if (!n)
            if (t = _u(u), t !== null) {
              if (e.flags |= 128, n = !0, t = t.updateQueue, e.updateQueue = t, Bu(e, t), En(a, !0), a.tail === null && a.tailMode === "hidden" && !u.alternate && !ct)
                return _t(e), null;
            } else
              2 * fe() - a.renderingStartTime > Xu && l !== 536870912 && (e.flags |= 128, n = !0, En(a, !1), e.lanes = 4194304);
          a.isBackwards ? (u.sibling = e.child, e.child = u) : (t = a.last, t !== null ? t.sibling = u : e.child = u, a.last = u);
        }
        return a.tail !== null ? (t = a.tail, a.rendering = t, a.tail = t.sibling, a.renderingStartTime = fe(), t.sibling = null, l = Dt.current, L(
          Dt,
          n ? l & 1 | 2 : l & 1
        ), ct && $e(e, a.treeForkCount), t) : (_t(e), null);
      case 22:
      case 23:
        return me(e), Tc(), a = e.memoizedState !== null, t !== null ? t.memoizedState !== null !== a && (e.flags |= 8192) : a && (e.flags |= 8192), a ? (l & 536870912) !== 0 && (e.flags & 128) === 0 && (_t(e), e.subtreeFlags & 6 && (e.flags |= 8192)) : _t(e), l = e.updateQueue, l !== null && Bu(e, l.retryQueue), l = null, t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), a = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (a = e.memoizedState.cachePool.pool), a !== l && (e.flags |= 2048), t !== null && U($l), null;
      case 24:
        return l = null, t !== null && (l = t.memoizedState.cache), e.memoizedState.cache !== l && (e.flags |= 2048), We(Bt), _t(e), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(f(156, e.tag));
  }
  function _v(t, e) {
    switch (sc(e), e.tag) {
      case 1:
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 3:
        return We(Bt), Ct(), t = e.flags, (t & 65536) !== 0 && (t & 128) === 0 ? (e.flags = t & -65537 | 128, e) : null;
      case 26:
      case 27:
      case 5:
        return Jn(e), null;
      case 31:
        if (e.memoizedState !== null) {
          if (me(e), e.alternate === null)
            throw Error(f(340));
          wl();
        }
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 13:
        if (me(e), t = e.memoizedState, t !== null && t.dehydrated !== null) {
          if (e.alternate === null)
            throw Error(f(340));
          wl();
        }
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 19:
        return U(Dt), null;
      case 4:
        return Ct(), null;
      case 10:
        return We(e.type), null;
      case 22:
      case 23:
        return me(e), Tc(), t !== null && U($l), t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 24:
        return We(Bt), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Lo(t, e) {
    switch (sc(e), e.tag) {
      case 3:
        We(Bt), Ct();
        break;
      case 26:
      case 27:
      case 5:
        Jn(e);
        break;
      case 4:
        Ct();
        break;
      case 31:
        e.memoizedState !== null && me(e);
        break;
      case 13:
        me(e);
        break;
      case 19:
        U(Dt);
        break;
      case 10:
        We(e.type);
        break;
      case 22:
      case 23:
        me(e), Tc(), t !== null && U($l);
        break;
      case 24:
        We(Bt);
    }
  }
  function _n(t, e) {
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
    } catch (r) {
      mt(e, e.return, r);
    }
  }
  function _l(t, e, l) {
    try {
      var a = e.updateQueue, n = a !== null ? a.lastEffect : null;
      if (n !== null) {
        var u = n.next;
        a = u;
        do {
          if ((a.tag & t) === t) {
            var c = a.inst, r = c.destroy;
            if (r !== void 0) {
              c.destroy = void 0, n = e;
              var v = l, _ = r;
              try {
                _();
              } catch (N) {
                mt(
                  n,
                  v,
                  N
                );
              }
            }
          }
          a = a.next;
        } while (a !== u);
      }
    } catch (N) {
      mt(e, e.return, N);
    }
  }
  function Yo(t) {
    var e = t.updateQueue;
    if (e !== null) {
      var l = t.stateNode;
      try {
        jr(e, l);
      } catch (a) {
        mt(t, t.return, a);
      }
    }
  }
  function Go(t, e, l) {
    l.props = Pl(
      t.type,
      t.memoizedProps
    ), l.state = t.memoizedState;
    try {
      l.componentWillUnmount();
    } catch (a) {
      mt(t, e, a);
    }
  }
  function Tn(t, e) {
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
      mt(t, e, n);
    }
  }
  function Xe(t, e) {
    var l = t.ref, a = t.refCleanup;
    if (l !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (n) {
          mt(t, e, n);
        } finally {
          t.refCleanup = null, t = t.alternate, t != null && (t.refCleanup = null);
        }
      else if (typeof l == "function")
        try {
          l(null);
        } catch (n) {
          mt(t, e, n);
        }
      else l.current = null;
  }
  function Xo(t) {
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
      mt(t, t.return, n);
    }
  }
  function lf(t, e, l) {
    try {
      var a = t.stateNode;
      wv(a, t.type, l, e), a[ee] = e;
    } catch (n) {
      mt(t, t.return, n);
    }
  }
  function Qo(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 26 || t.tag === 27 && Nl(t.type) || t.tag === 4;
  }
  function af(t) {
    t: for (; ; ) {
      for (; t.sibling === null; ) {
        if (t.return === null || Qo(t.return)) return null;
        t = t.return;
      }
      for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18; ) {
        if (t.tag === 27 && Nl(t.type) || t.flags & 2 || t.child === null || t.tag === 4) continue t;
        t.child.return = t, t = t.child;
      }
      if (!(t.flags & 2)) return t.stateNode;
    }
  }
  function nf(t, e, l) {
    var a = t.tag;
    if (a === 5 || a === 6)
      t = t.stateNode, e ? (l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l).insertBefore(t, e) : (e = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, e.appendChild(t), l = l._reactRootContainer, l != null || e.onclick !== null || (e.onclick = we));
    else if (a !== 4 && (a === 27 && Nl(t.type) && (l = t.stateNode, e = null), t = t.child, t !== null))
      for (nf(t, e, l), t = t.sibling; t !== null; )
        nf(t, e, l), t = t.sibling;
  }
  function qu(t, e, l) {
    var a = t.tag;
    if (a === 5 || a === 6)
      t = t.stateNode, e ? l.insertBefore(t, e) : l.appendChild(t);
    else if (a !== 4 && (a === 27 && Nl(t.type) && (l = t.stateNode), t = t.child, t !== null))
      for (qu(t, e, l), t = t.sibling; t !== null; )
        qu(t, e, l), t = t.sibling;
  }
  function Zo(t) {
    var e = t.stateNode, l = t.memoizedProps;
    try {
      for (var a = t.type, n = e.attributes; n.length; )
        e.removeAttributeNode(n[0]);
      $t(e, a, l), e[Vt] = t, e[ee] = l;
    } catch (u) {
      mt(t, t.return, u);
    }
  }
  var el = !1, Yt = !1, uf = !1, Vo = typeof WeakSet == "function" ? WeakSet : Set, Qt = null;
  function Tv(t, e) {
    if (t = t.containerInfo, Rf = ni, t = er(t), Ii(t)) {
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
            var c = 0, r = -1, v = -1, _ = 0, N = 0, D = t, z = null;
            e: for (; ; ) {
              for (var R; D !== l || n !== 0 && D.nodeType !== 3 || (r = c + n), D !== u || a !== 0 && D.nodeType !== 3 || (v = c + a), D.nodeType === 3 && (c += D.nodeValue.length), (R = D.firstChild) !== null; )
                z = D, D = R;
              for (; ; ) {
                if (D === t) break e;
                if (z === l && ++_ === n && (r = c), z === u && ++N === a && (v = c), (R = D.nextSibling) !== null) break;
                D = z, z = D.parentNode;
              }
              D = R;
            }
            l = r === -1 || v === -1 ? null : { start: r, end: v };
          } else l = null;
        }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (jf = { focusedElem: t, selectionRange: l }, ni = !1, Qt = e; Qt !== null; )
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
                  var G = Pl(
                    l.type,
                    n
                  );
                  t = a.getSnapshotBeforeUpdate(
                    G,
                    u
                  ), a.__reactInternalSnapshotBeforeUpdate = t;
                } catch (J) {
                  mt(
                    l,
                    l.return,
                    J
                  );
                }
              }
              break;
            case 3:
              if ((t & 1024) !== 0) {
                if (t = e.stateNode.containerInfo, l = t.nodeType, l === 9)
                  Mf(t);
                else if (l === 1)
                  switch (t.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      Mf(t);
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
              if ((t & 1024) !== 0) throw Error(f(163));
          }
          if (t = e.sibling, t !== null) {
            t.return = e.return, Qt = t;
            break;
          }
          Qt = e.return;
        }
  }
  function wo(t, e, l) {
    var a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        al(t, l), a & 4 && _n(5, l);
        break;
      case 1:
        if (al(t, l), a & 4)
          if (t = l.stateNode, e === null)
            try {
              t.componentDidMount();
            } catch (c) {
              mt(l, l.return, c);
            }
          else {
            var n = Pl(
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
              mt(
                l,
                l.return,
                c
              );
            }
          }
        a & 64 && Yo(l), a & 512 && Tn(l, l.return);
        break;
      case 3:
        if (al(t, l), a & 64 && (t = l.updateQueue, t !== null)) {
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
            jr(t, e);
          } catch (c) {
            mt(l, l.return, c);
          }
        }
        break;
      case 27:
        e === null && a & 4 && Zo(l);
      case 26:
      case 5:
        al(t, l), e === null && a & 4 && Xo(l), a & 512 && Tn(l, l.return);
        break;
      case 12:
        al(t, l);
        break;
      case 31:
        al(t, l), a & 4 && $o(t, l);
        break;
      case 13:
        al(t, l), a & 4 && ko(t, l), a & 64 && (t = l.memoizedState, t !== null && (t = t.dehydrated, t !== null && (l = Dv.bind(
          null,
          l
        ), Pv(t, l))));
        break;
      case 22:
        if (a = l.memoizedState !== null || el, !a) {
          e = e !== null && e.memoizedState !== null || Yt, n = el;
          var u = Yt;
          el = a, (Yt = e) && !u ? nl(
            t,
            l,
            (l.subtreeFlags & 8772) !== 0
          ) : al(t, l), el = n, Yt = u;
        }
        break;
      case 30:
        break;
      default:
        al(t, l);
    }
  }
  function Ko(t) {
    var e = t.alternate;
    e !== null && (t.alternate = null, Ko(e)), t.child = null, t.deletions = null, t.sibling = null, t.tag === 5 && (e = t.stateNode, e !== null && Hi(e)), t.stateNode = null, t.return = null, t.dependencies = null, t.memoizedProps = null, t.memoizedState = null, t.pendingProps = null, t.stateNode = null, t.updateQueue = null;
  }
  var Tt = null, ae = !1;
  function ll(t, e, l) {
    for (l = l.child; l !== null; )
      Jo(t, e, l), l = l.sibling;
  }
  function Jo(t, e, l) {
    if (se && typeof se.onCommitFiberUnmount == "function")
      try {
        se.onCommitFiberUnmount(Ja, l);
      } catch {
      }
    switch (l.tag) {
      case 26:
        Yt || Xe(l, e), ll(
          t,
          e,
          l
        ), l.memoizedState ? l.memoizedState.count-- : l.stateNode && (l = l.stateNode, l.parentNode.removeChild(l));
        break;
      case 27:
        Yt || Xe(l, e);
        var a = Tt, n = ae;
        Nl(l.type) && (Tt = l.stateNode, ae = !1), ll(
          t,
          e,
          l
        ), Dn(l.stateNode), Tt = a, ae = n;
        break;
      case 5:
        Yt || Xe(l, e);
      case 6:
        if (a = Tt, n = ae, Tt = null, ll(
          t,
          e,
          l
        ), Tt = a, ae = n, Tt !== null)
          if (ae)
            try {
              (Tt.nodeType === 9 ? Tt.body : Tt.nodeName === "HTML" ? Tt.ownerDocument.body : Tt).removeChild(l.stateNode);
            } catch (u) {
              mt(
                l,
                e,
                u
              );
            }
          else
            try {
              Tt.removeChild(l.stateNode);
            } catch (u) {
              mt(
                l,
                e,
                u
              );
            }
        break;
      case 18:
        Tt !== null && (ae ? (t = Tt, Yd(
          t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t,
          l.stateNode
        ), Za(t)) : Yd(Tt, l.stateNode));
        break;
      case 4:
        a = Tt, n = ae, Tt = l.stateNode.containerInfo, ae = !0, ll(
          t,
          e,
          l
        ), Tt = a, ae = n;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        _l(2, l, e), Yt || _l(4, l, e), ll(
          t,
          e,
          l
        );
        break;
      case 1:
        Yt || (Xe(l, e), a = l.stateNode, typeof a.componentWillUnmount == "function" && Go(
          l,
          e,
          a
        )), ll(
          t,
          e,
          l
        );
        break;
      case 21:
        ll(
          t,
          e,
          l
        );
        break;
      case 22:
        Yt = (a = Yt) || l.memoizedState !== null, ll(
          t,
          e,
          l
        ), Yt = a;
        break;
      default:
        ll(
          t,
          e,
          l
        );
    }
  }
  function $o(t, e) {
    if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null))) {
      t = t.dehydrated;
      try {
        Za(t);
      } catch (l) {
        mt(e, e.return, l);
      }
    }
  }
  function ko(t, e) {
    if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null && (t = t.dehydrated, t !== null))))
      try {
        Za(t);
      } catch (l) {
        mt(e, e.return, l);
      }
  }
  function zv(t) {
    switch (t.tag) {
      case 31:
      case 13:
      case 19:
        var e = t.stateNode;
        return e === null && (e = t.stateNode = new Vo()), e;
      case 22:
        return t = t.stateNode, e = t._retryCache, e === null && (e = t._retryCache = new Vo()), e;
      default:
        throw Error(f(435, t.tag));
    }
  }
  function Lu(t, e) {
    var l = zv(t);
    e.forEach(function(a) {
      if (!l.has(a)) {
        l.add(a);
        var n = Uv.bind(null, t, a);
        a.then(n, n);
      }
    });
  }
  function ne(t, e) {
    var l = e.deletions;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var n = l[a], u = t, c = e, r = c;
        t: for (; r !== null; ) {
          switch (r.tag) {
            case 27:
              if (Nl(r.type)) {
                Tt = r.stateNode, ae = !1;
                break t;
              }
              break;
            case 5:
              Tt = r.stateNode, ae = !1;
              break t;
            case 3:
            case 4:
              Tt = r.stateNode.containerInfo, ae = !0;
              break t;
          }
          r = r.return;
        }
        if (Tt === null) throw Error(f(160));
        Jo(u, c, n), Tt = null, ae = !1, u = n.alternate, u !== null && (u.return = null), n.return = null;
      }
    if (e.subtreeFlags & 13886)
      for (e = e.child; e !== null; )
        Wo(e, t), e = e.sibling;
  }
  var De = null;
  function Wo(t, e) {
    var l = t.alternate, a = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        ne(e, t), ue(t), a & 4 && (_l(3, t, t.return), _n(3, t), _l(5, t, t.return));
        break;
      case 1:
        ne(e, t), ue(t), a & 512 && (Yt || l === null || Xe(l, l.return)), a & 64 && el && (t = t.updateQueue, t !== null && (a = t.callbacks, a !== null && (l = t.shared.hiddenCallbacks, t.shared.hiddenCallbacks = l === null ? a : l.concat(a))));
        break;
      case 26:
        var n = De;
        if (ne(e, t), ue(t), a & 512 && (Yt || l === null || Xe(l, l.return)), a & 4) {
          var u = l !== null ? l.memoizedState : null;
          if (a = t.memoizedState, l === null)
            if (a === null)
              if (t.stateNode === null) {
                t: {
                  a = t.type, l = t.memoizedProps, n = n.ownerDocument || n;
                  e: switch (a) {
                    case "title":
                      u = n.getElementsByTagName("title")[0], (!u || u[Wa] || u[Vt] || u.namespaceURI === "http://www.w3.org/2000/svg" || u.hasAttribute("itemprop")) && (u = n.createElement(a), n.head.insertBefore(
                        u,
                        n.querySelector("head > title")
                      )), $t(u, a, l), u[Vt] = t, Xt(u), a = u;
                      break t;
                    case "link":
                      var c = Wd(
                        "link",
                        "href",
                        n
                      ).get(a + (l.href || ""));
                      if (c) {
                        for (var r = 0; r < c.length; r++)
                          if (u = c[r], u.getAttribute("href") === (l.href == null || l.href === "" ? null : l.href) && u.getAttribute("rel") === (l.rel == null ? null : l.rel) && u.getAttribute("title") === (l.title == null ? null : l.title) && u.getAttribute("crossorigin") === (l.crossOrigin == null ? null : l.crossOrigin)) {
                            c.splice(r, 1);
                            break e;
                          }
                      }
                      u = n.createElement(a), $t(u, a, l), n.head.appendChild(u);
                      break;
                    case "meta":
                      if (c = Wd(
                        "meta",
                        "content",
                        n
                      ).get(a + (l.content || ""))) {
                        for (r = 0; r < c.length; r++)
                          if (u = c[r], u.getAttribute("content") === (l.content == null ? null : "" + l.content) && u.getAttribute("name") === (l.name == null ? null : l.name) && u.getAttribute("property") === (l.property == null ? null : l.property) && u.getAttribute("http-equiv") === (l.httpEquiv == null ? null : l.httpEquiv) && u.getAttribute("charset") === (l.charSet == null ? null : l.charSet)) {
                            c.splice(r, 1);
                            break e;
                          }
                      }
                      u = n.createElement(a), $t(u, a, l), n.head.appendChild(u);
                      break;
                    default:
                      throw Error(f(468, a));
                  }
                  u[Vt] = t, Xt(u), a = u;
                }
                t.stateNode = a;
              } else
                Fd(
                  n,
                  t.type,
                  t.stateNode
                );
            else
              t.stateNode = kd(
                n,
                a,
                t.memoizedProps
              );
          else
            u !== a ? (u === null ? l.stateNode !== null && (l = l.stateNode, l.parentNode.removeChild(l)) : u.count--, a === null ? Fd(
              n,
              t.type,
              t.stateNode
            ) : kd(
              n,
              a,
              t.memoizedProps
            )) : a === null && t.stateNode !== null && lf(
              t,
              t.memoizedProps,
              l.memoizedProps
            );
        }
        break;
      case 27:
        ne(e, t), ue(t), a & 512 && (Yt || l === null || Xe(l, l.return)), l !== null && a & 4 && lf(
          t,
          t.memoizedProps,
          l.memoizedProps
        );
        break;
      case 5:
        if (ne(e, t), ue(t), a & 512 && (Yt || l === null || Xe(l, l.return)), t.flags & 32) {
          n = t.stateNode;
          try {
            da(n, "");
          } catch (G) {
            mt(t, t.return, G);
          }
        }
        a & 4 && t.stateNode != null && (n = t.memoizedProps, lf(
          t,
          n,
          l !== null ? l.memoizedProps : n
        )), a & 1024 && (uf = !0);
        break;
      case 6:
        if (ne(e, t), ue(t), a & 4) {
          if (t.stateNode === null)
            throw Error(f(162));
          a = t.memoizedProps, l = t.stateNode;
          try {
            l.nodeValue = a;
          } catch (G) {
            mt(t, t.return, G);
          }
        }
        break;
      case 3:
        if (ti = null, n = De, De = Iu(e.containerInfo), ne(e, t), De = n, ue(t), a & 4 && l !== null && l.memoizedState.isDehydrated)
          try {
            Za(e.containerInfo);
          } catch (G) {
            mt(t, t.return, G);
          }
        uf && (uf = !1, Fo(t));
        break;
      case 4:
        a = De, De = Iu(
          t.stateNode.containerInfo
        ), ne(e, t), ue(t), De = a;
        break;
      case 12:
        ne(e, t), ue(t);
        break;
      case 31:
        ne(e, t), ue(t), a & 4 && (a = t.updateQueue, a !== null && (t.updateQueue = null, Lu(t, a)));
        break;
      case 13:
        ne(e, t), ue(t), t.child.flags & 8192 && t.memoizedState !== null != (l !== null && l.memoizedState !== null) && (Gu = fe()), a & 4 && (a = t.updateQueue, a !== null && (t.updateQueue = null, Lu(t, a)));
        break;
      case 22:
        n = t.memoizedState !== null;
        var v = l !== null && l.memoizedState !== null, _ = el, N = Yt;
        if (el = _ || n, Yt = N || v, ne(e, t), Yt = N, el = _, ue(t), a & 8192)
          t: for (e = t.stateNode, e._visibility = n ? e._visibility & -2 : e._visibility | 1, n && (l === null || v || el || Yt || ta(t)), l = null, e = t; ; ) {
            if (e.tag === 5 || e.tag === 26) {
              if (l === null) {
                v = l = e;
                try {
                  if (u = v.stateNode, n)
                    c = u.style, typeof c.setProperty == "function" ? c.setProperty("display", "none", "important") : c.display = "none";
                  else {
                    r = v.stateNode;
                    var D = v.memoizedProps.style, z = D != null && D.hasOwnProperty("display") ? D.display : null;
                    r.style.display = z == null || typeof z == "boolean" ? "" : ("" + z).trim();
                  }
                } catch (G) {
                  mt(v, v.return, G);
                }
              }
            } else if (e.tag === 6) {
              if (l === null) {
                v = e;
                try {
                  v.stateNode.nodeValue = n ? "" : v.memoizedProps;
                } catch (G) {
                  mt(v, v.return, G);
                }
              }
            } else if (e.tag === 18) {
              if (l === null) {
                v = e;
                try {
                  var R = v.stateNode;
                  n ? Gd(R, !0) : Gd(v.stateNode, !1);
                } catch (G) {
                  mt(v, v.return, G);
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
        a & 4 && (a = t.updateQueue, a !== null && (l = a.retryQueue, l !== null && (a.retryQueue = null, Lu(t, l))));
        break;
      case 19:
        ne(e, t), ue(t), a & 4 && (a = t.updateQueue, a !== null && (t.updateQueue = null, Lu(t, a)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        ne(e, t), ue(t);
    }
  }
  function ue(t) {
    var e = t.flags;
    if (e & 2) {
      try {
        for (var l, a = t.return; a !== null; ) {
          if (Qo(a)) {
            l = a;
            break;
          }
          a = a.return;
        }
        if (l == null) throw Error(f(160));
        switch (l.tag) {
          case 27:
            var n = l.stateNode, u = af(t);
            qu(t, u, n);
            break;
          case 5:
            var c = l.stateNode;
            l.flags & 32 && (da(c, ""), l.flags &= -33);
            var r = af(t);
            qu(t, r, c);
            break;
          case 3:
          case 4:
            var v = l.stateNode.containerInfo, _ = af(t);
            nf(
              t,
              _,
              v
            );
            break;
          default:
            throw Error(f(161));
        }
      } catch (N) {
        mt(t, t.return, N);
      }
      t.flags &= -3;
    }
    e & 4096 && (t.flags &= -4097);
  }
  function Fo(t) {
    if (t.subtreeFlags & 1024)
      for (t = t.child; t !== null; ) {
        var e = t;
        Fo(e), e.tag === 5 && e.flags & 1024 && e.stateNode.reset(), t = t.sibling;
      }
  }
  function al(t, e) {
    if (e.subtreeFlags & 8772)
      for (e = e.child; e !== null; )
        wo(t, e.alternate, e), e = e.sibling;
  }
  function ta(t) {
    for (t = t.child; t !== null; ) {
      var e = t;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          _l(4, e, e.return), ta(e);
          break;
        case 1:
          Xe(e, e.return);
          var l = e.stateNode;
          typeof l.componentWillUnmount == "function" && Go(
            e,
            e.return,
            l
          ), ta(e);
          break;
        case 27:
          Dn(e.stateNode);
        case 26:
        case 5:
          Xe(e, e.return), ta(e);
          break;
        case 22:
          e.memoizedState === null && ta(e);
          break;
        case 30:
          ta(e);
          break;
        default:
          ta(e);
      }
      t = t.sibling;
    }
  }
  function nl(t, e, l) {
    for (l = l && (e.subtreeFlags & 8772) !== 0, e = e.child; e !== null; ) {
      var a = e.alternate, n = t, u = e, c = u.flags;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          nl(
            n,
            u,
            l
          ), _n(4, u);
          break;
        case 1:
          if (nl(
            n,
            u,
            l
          ), a = u, n = a.stateNode, typeof n.componentDidMount == "function")
            try {
              n.componentDidMount();
            } catch (_) {
              mt(a, a.return, _);
            }
          if (a = u, n = a.updateQueue, n !== null) {
            var r = a.stateNode;
            try {
              var v = n.shared.hiddenCallbacks;
              if (v !== null)
                for (n.shared.hiddenCallbacks = null, n = 0; n < v.length; n++)
                  Rr(v[n], r);
            } catch (_) {
              mt(a, a.return, _);
            }
          }
          l && c & 64 && Yo(u), Tn(u, u.return);
          break;
        case 27:
          Zo(u);
        case 26:
        case 5:
          nl(
            n,
            u,
            l
          ), l && a === null && c & 4 && Xo(u), Tn(u, u.return);
          break;
        case 12:
          nl(
            n,
            u,
            l
          );
          break;
        case 31:
          nl(
            n,
            u,
            l
          ), l && c & 4 && $o(n, u);
          break;
        case 13:
          nl(
            n,
            u,
            l
          ), l && c & 4 && ko(n, u);
          break;
        case 22:
          u.memoizedState === null && nl(
            n,
            u,
            l
          ), Tn(u, u.return);
          break;
        case 30:
          break;
        default:
          nl(
            n,
            u,
            l
          );
      }
      e = e.sibling;
    }
  }
  function cf(t, e) {
    var l = null;
    t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), t = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (t = e.memoizedState.cachePool.pool), t !== l && (t != null && t.refCount++, l != null && rn(l));
  }
  function ff(t, e) {
    t = null, e.alternate !== null && (t = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== t && (e.refCount++, t != null && rn(t));
  }
  function Ue(t, e, l, a) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        Io(
          t,
          e,
          l,
          a
        ), e = e.sibling;
  }
  function Io(t, e, l, a) {
    var n = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        Ue(
          t,
          e,
          l,
          a
        ), n & 2048 && _n(9, e);
        break;
      case 1:
        Ue(
          t,
          e,
          l,
          a
        );
        break;
      case 3:
        Ue(
          t,
          e,
          l,
          a
        ), n & 2048 && (t = null, e.alternate !== null && (t = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== t && (e.refCount++, t != null && rn(t)));
        break;
      case 12:
        if (n & 2048) {
          Ue(
            t,
            e,
            l,
            a
          ), t = e.stateNode;
          try {
            var u = e.memoizedProps, c = u.id, r = u.onPostCommit;
            typeof r == "function" && r(
              c,
              e.alternate === null ? "mount" : "update",
              t.passiveEffectDuration,
              -0
            );
          } catch (v) {
            mt(e, e.return, v);
          }
        } else
          Ue(
            t,
            e,
            l,
            a
          );
        break;
      case 31:
        Ue(
          t,
          e,
          l,
          a
        );
        break;
      case 13:
        Ue(
          t,
          e,
          l,
          a
        );
        break;
      case 23:
        break;
      case 22:
        u = e.stateNode, c = e.alternate, e.memoizedState !== null ? u._visibility & 2 ? Ue(
          t,
          e,
          l,
          a
        ) : zn(t, e) : u._visibility & 2 ? Ue(
          t,
          e,
          l,
          a
        ) : (u._visibility |= 2, Ca(
          t,
          e,
          l,
          a,
          (e.subtreeFlags & 10256) !== 0 || !1
        )), n & 2048 && cf(c, e);
        break;
      case 24:
        Ue(
          t,
          e,
          l,
          a
        ), n & 2048 && ff(e.alternate, e);
        break;
      default:
        Ue(
          t,
          e,
          l,
          a
        );
    }
  }
  function Ca(t, e, l, a, n) {
    for (n = n && ((e.subtreeFlags & 10256) !== 0 || !1), e = e.child; e !== null; ) {
      var u = t, c = e, r = l, v = a, _ = c.flags;
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          Ca(
            u,
            c,
            r,
            v,
            n
          ), _n(8, c);
          break;
        case 23:
          break;
        case 22:
          var N = c.stateNode;
          c.memoizedState !== null ? N._visibility & 2 ? Ca(
            u,
            c,
            r,
            v,
            n
          ) : zn(
            u,
            c
          ) : (N._visibility |= 2, Ca(
            u,
            c,
            r,
            v,
            n
          )), n && _ & 2048 && cf(
            c.alternate,
            c
          );
          break;
        case 24:
          Ca(
            u,
            c,
            r,
            v,
            n
          ), n && _ & 2048 && ff(c.alternate, c);
          break;
        default:
          Ca(
            u,
            c,
            r,
            v,
            n
          );
      }
      e = e.sibling;
    }
  }
  function zn(t, e) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; ) {
        var l = t, a = e, n = a.flags;
        switch (a.tag) {
          case 22:
            zn(l, a), n & 2048 && cf(
              a.alternate,
              a
            );
            break;
          case 24:
            zn(l, a), n & 2048 && ff(a.alternate, a);
            break;
          default:
            zn(l, a);
        }
        e = e.sibling;
      }
  }
  var An = 8192;
  function Da(t, e, l) {
    if (t.subtreeFlags & An)
      for (t = t.child; t !== null; )
        Po(
          t,
          e,
          l
        ), t = t.sibling;
  }
  function Po(t, e, l) {
    switch (t.tag) {
      case 26:
        Da(
          t,
          e,
          l
        ), t.flags & An && t.memoizedState !== null && oy(
          l,
          De,
          t.memoizedState,
          t.memoizedProps
        );
        break;
      case 5:
        Da(
          t,
          e,
          l
        );
        break;
      case 3:
      case 4:
        var a = De;
        De = Iu(t.stateNode.containerInfo), Da(
          t,
          e,
          l
        ), De = a;
        break;
      case 22:
        t.memoizedState === null && (a = t.alternate, a !== null && a.memoizedState !== null ? (a = An, An = 16777216, Da(
          t,
          e,
          l
        ), An = a) : Da(
          t,
          e,
          l
        ));
        break;
      default:
        Da(
          t,
          e,
          l
        );
    }
  }
  function td(t) {
    var e = t.alternate;
    if (e !== null && (t = e.child, t !== null)) {
      e.child = null;
      do
        e = t.sibling, t.sibling = null, t = e;
      while (t !== null);
    }
  }
  function Rn(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var l = 0; l < e.length; l++) {
          var a = e[l];
          Qt = a, ld(
            a,
            t
          );
        }
      td(t);
    }
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        ed(t), t = t.sibling;
  }
  function ed(t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Rn(t), t.flags & 2048 && _l(9, t, t.return);
        break;
      case 3:
        Rn(t);
        break;
      case 12:
        Rn(t);
        break;
      case 22:
        var e = t.stateNode;
        t.memoizedState !== null && e._visibility & 2 && (t.return === null || t.return.tag !== 13) ? (e._visibility &= -3, Yu(t)) : Rn(t);
        break;
      default:
        Rn(t);
    }
  }
  function Yu(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var l = 0; l < e.length; l++) {
          var a = e[l];
          Qt = a, ld(
            a,
            t
          );
        }
      td(t);
    }
    for (t = t.child; t !== null; ) {
      switch (e = t, e.tag) {
        case 0:
        case 11:
        case 15:
          _l(8, e, e.return), Yu(e);
          break;
        case 22:
          l = e.stateNode, l._visibility & 2 && (l._visibility &= -3, Yu(e));
          break;
        default:
          Yu(e);
      }
      t = t.sibling;
    }
  }
  function ld(t, e) {
    for (; Qt !== null; ) {
      var l = Qt;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          _l(8, l, e);
          break;
        case 23:
        case 22:
          if (l.memoizedState !== null && l.memoizedState.cachePool !== null) {
            var a = l.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          rn(l.memoizedState.cache);
      }
      if (a = l.child, a !== null) a.return = l, Qt = a;
      else
        t: for (l = t; Qt !== null; ) {
          a = Qt;
          var n = a.sibling, u = a.return;
          if (Ko(a), a === l) {
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
  var Av = {
    getCacheForType: function(t) {
      var e = Kt(Bt), l = e.data.get(t);
      return l === void 0 && (l = t(), e.data.set(t, l)), l;
    },
    cacheSignal: function() {
      return Kt(Bt).controller.signal;
    }
  }, Rv = typeof WeakMap == "function" ? WeakMap : Map, rt = 0, xt = null, at = null, ut = 0, ht = 0, ve = null, Tl = !1, Ua = !1, sf = !1, ul = 0, Ot = 0, zl = 0, ea = 0, rf = 0, ye = 0, Ha = 0, jn = null, ie = null, of = !1, Gu = 0, ad = 0, Xu = 1 / 0, Qu = null, Al = null, Gt = 0, Rl = null, Ba = null, il = 0, df = 0, hf = null, nd = null, On = 0, mf = null;
  function pe() {
    return (rt & 2) !== 0 && ut !== 0 ? ut & -ut : M.T !== null ? Sf() : bs();
  }
  function ud() {
    if (ye === 0)
      if ((ut & 536870912) === 0 || ct) {
        var t = Wn;
        Wn <<= 1, (Wn & 3932160) === 0 && (Wn = 262144), ye = t;
      } else ye = 536870912;
    return t = he.current, t !== null && (t.flags |= 32), ye;
  }
  function ce(t, e, l) {
    (t === xt && (ht === 2 || ht === 9) || t.cancelPendingCommit !== null) && (qa(t, 0), jl(
      t,
      ut,
      ye,
      !1
    )), ka(t, l), ((rt & 2) === 0 || t !== xt) && (t === xt && ((rt & 2) === 0 && (ea |= l), Ot === 4 && jl(
      t,
      ut,
      ye,
      !1
    )), Qe(t));
  }
  function id(t, e, l) {
    if ((rt & 6) !== 0) throw Error(f(327));
    var a = !l && (e & 127) === 0 && (e & t.expiredLanes) === 0 || $a(t, e), n = a ? Nv(t, e) : yf(t, e, !0), u = a;
    do {
      if (n === 0) {
        Ua && !a && jl(t, e, 0, !1);
        break;
      } else {
        if (l = t.current.alternate, u && !jv(l)) {
          n = yf(t, e, !1), u = !1;
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
              var r = t;
              n = jn;
              var v = r.current.memoizedState.isDehydrated;
              if (v && (qa(r, c).flags |= 256), c = yf(
                r,
                c,
                !1
              ), c !== 2) {
                if (sf && !v) {
                  r.errorRecoveryDisabledLanes |= u, ea |= u, n = 4;
                  break t;
                }
                u = ie, ie = n, u !== null && (ie === null ? ie = u : ie.push.apply(
                  ie,
                  u
                ));
              }
              n = c;
            }
            if (u = !1, n !== 2) continue;
          }
        }
        if (n === 1) {
          qa(t, 0), jl(t, e, 0, !0);
          break;
        }
        t: {
          switch (a = t, u = n, u) {
            case 0:
            case 1:
              throw Error(f(345));
            case 4:
              if ((e & 4194048) !== e) break;
            case 6:
              jl(
                a,
                e,
                ye,
                !Tl
              );
              break t;
            case 2:
              ie = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(f(329));
          }
          if ((e & 62914560) === e && (n = Gu + 300 - fe(), 10 < n)) {
            if (jl(
              a,
              e,
              ye,
              !Tl
            ), In(a, 0, !0) !== 0) break t;
            il = e, a.timeoutHandle = qd(
              cd.bind(
                null,
                a,
                l,
                ie,
                Qu,
                of,
                e,
                ye,
                ea,
                Ha,
                Tl,
                u,
                "Throttled",
                -0,
                0
              ),
              n
            );
            break t;
          }
          cd(
            a,
            l,
            ie,
            Qu,
            of,
            e,
            ye,
            ea,
            Ha,
            Tl,
            u,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Qe(t);
  }
  function cd(t, e, l, a, n, u, c, r, v, _, N, D, z, R) {
    if (t.timeoutHandle = -1, D = e.subtreeFlags, D & 8192 || (D & 16785408) === 16785408) {
      D = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: we
      }, Po(
        e,
        u,
        D
      );
      var G = (u & 62914560) === u ? Gu - fe() : (u & 4194048) === u ? ad - fe() : 0;
      if (G = dy(
        D,
        G
      ), G !== null) {
        il = u, t.cancelPendingCommit = G(
          vd.bind(
            null,
            t,
            e,
            u,
            l,
            a,
            n,
            c,
            r,
            v,
            N,
            D,
            null,
            z,
            R
          )
        ), jl(t, u, c, !_);
        return;
      }
    }
    vd(
      t,
      e,
      u,
      l,
      a,
      n,
      c,
      r,
      v
    );
  }
  function jv(t) {
    for (var e = t; ; ) {
      var l = e.tag;
      if ((l === 0 || l === 11 || l === 15) && e.flags & 16384 && (l = e.updateQueue, l !== null && (l = l.stores, l !== null)))
        for (var a = 0; a < l.length; a++) {
          var n = l[a], u = n.getSnapshot;
          n = n.value;
          try {
            if (!oe(u(), n)) return !1;
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
  function jl(t, e, l, a) {
    e &= ~rf, e &= ~ea, t.suspendedLanes |= e, t.pingedLanes &= ~e, a && (t.warmLanes |= e), a = t.expirationTimes;
    for (var n = e; 0 < n; ) {
      var u = 31 - re(n), c = 1 << u;
      a[u] = -1, n &= ~c;
    }
    l !== 0 && ys(t, l, e);
  }
  function Zu() {
    return (rt & 6) === 0 ? (Nn(0), !1) : !0;
  }
  function vf() {
    if (at !== null) {
      if (ht === 0)
        var t = at.return;
      else
        t = at, ke = Kl = null, Nc(t), Ra = null, dn = 0, t = at;
      for (; t !== null; )
        Lo(t.alternate, t), t = t.return;
      at = null;
    }
  }
  function qa(t, e) {
    var l = t.timeoutHandle;
    l !== -1 && (t.timeoutHandle = -1, $v(l)), l = t.cancelPendingCommit, l !== null && (t.cancelPendingCommit = null, l()), il = 0, vf(), xt = t, at = l = Je(t.current, null), ut = e, ht = 0, ve = null, Tl = !1, Ua = $a(t, e), sf = !1, Ha = ye = rf = ea = zl = Ot = 0, ie = jn = null, of = !1, (e & 8) !== 0 && (e |= e & 32);
    var a = t.entangledLanes;
    if (a !== 0)
      for (t = t.entanglements, a &= e; 0 < a; ) {
        var n = 31 - re(a), u = 1 << n;
        e |= t[n], a &= ~u;
      }
    return ul = e, ru(), l;
  }
  function fd(t, e) {
    tt = null, M.H = Sn, e === Aa || e === gu ? (e = _r(), ht = 3) : e === gc ? (e = _r(), ht = 4) : ht = e === Kc ? 8 : e !== null && typeof e == "object" && typeof e.then == "function" ? 6 : 1, ve = e, at === null && (Ot = 1, Cu(
      t,
      Te(e, t.current)
    ));
  }
  function sd() {
    var t = he.current;
    return t === null ? !0 : (ut & 4194048) === ut ? je === null : (ut & 62914560) === ut || (ut & 536870912) !== 0 ? t === je : !1;
  }
  function rd() {
    var t = M.H;
    return M.H = Sn, t === null ? Sn : t;
  }
  function od() {
    var t = M.A;
    return M.A = Av, t;
  }
  function Vu() {
    Ot = 4, Tl || (ut & 4194048) !== ut && he.current !== null || (Ua = !0), (zl & 134217727) === 0 && (ea & 134217727) === 0 || xt === null || jl(
      xt,
      ut,
      ye,
      !1
    );
  }
  function yf(t, e, l) {
    var a = rt;
    rt |= 2;
    var n = rd(), u = od();
    (xt !== t || ut !== e) && (Qu = null, qa(t, e)), e = !1;
    var c = Ot;
    t: do
      try {
        if (ht !== 0 && at !== null) {
          var r = at, v = ve;
          switch (ht) {
            case 8:
              vf(), c = 6;
              break t;
            case 3:
            case 2:
            case 9:
            case 6:
              he.current === null && (e = !0);
              var _ = ht;
              if (ht = 0, ve = null, La(t, r, v, _), l && Ua) {
                c = 0;
                break t;
              }
              break;
            default:
              _ = ht, ht = 0, ve = null, La(t, r, v, _);
          }
        }
        Ov(), c = Ot;
        break;
      } catch (N) {
        fd(t, N);
      }
    while (!0);
    return e && t.shellSuspendCounter++, ke = Kl = null, rt = a, M.H = n, M.A = u, at === null && (xt = null, ut = 0, ru()), c;
  }
  function Ov() {
    for (; at !== null; ) dd(at);
  }
  function Nv(t, e) {
    var l = rt;
    rt |= 2;
    var a = rd(), n = od();
    xt !== t || ut !== e ? (Qu = null, Xu = fe() + 500, qa(t, e)) : Ua = $a(
      t,
      e
    );
    t: do
      try {
        if (ht !== 0 && at !== null) {
          e = at;
          var u = ve;
          e: switch (ht) {
            case 1:
              ht = 0, ve = null, La(t, e, u, 1);
              break;
            case 2:
            case 9:
              if (xr(u)) {
                ht = 0, ve = null, hd(e);
                break;
              }
              e = function() {
                ht !== 2 && ht !== 9 || xt !== t || (ht = 7), Qe(t);
              }, u.then(e, e);
              break t;
            case 3:
              ht = 7;
              break t;
            case 4:
              ht = 5;
              break t;
            case 7:
              xr(u) ? (ht = 0, ve = null, hd(e)) : (ht = 0, ve = null, La(t, e, u, 7));
              break;
            case 5:
              var c = null;
              switch (at.tag) {
                case 26:
                  c = at.memoizedState;
                case 5:
                case 27:
                  var r = at;
                  if (c ? Id(c) : r.stateNode.complete) {
                    ht = 0, ve = null;
                    var v = r.sibling;
                    if (v !== null) at = v;
                    else {
                      var _ = r.return;
                      _ !== null ? (at = _, wu(_)) : at = null;
                    }
                    break e;
                  }
              }
              ht = 0, ve = null, La(t, e, u, 5);
              break;
            case 6:
              ht = 0, ve = null, La(t, e, u, 6);
              break;
            case 8:
              vf(), Ot = 6;
              break t;
            default:
              throw Error(f(462));
          }
        }
        Mv();
        break;
      } catch (N) {
        fd(t, N);
      }
    while (!0);
    return ke = Kl = null, M.H = a, M.A = n, rt = l, at !== null ? 0 : (xt = null, ut = 0, ru(), Ot);
  }
  function Mv() {
    for (; at !== null && !tm(); )
      dd(at);
  }
  function dd(t) {
    var e = Bo(t.alternate, t, ul);
    t.memoizedProps = t.pendingProps, e === null ? wu(t) : at = e;
  }
  function hd(t) {
    var e = t, l = e.alternate;
    switch (e.tag) {
      case 15:
      case 0:
        e = No(
          l,
          e,
          e.pendingProps,
          e.type,
          void 0,
          ut
        );
        break;
      case 11:
        e = No(
          l,
          e,
          e.pendingProps,
          e.type.render,
          e.ref,
          ut
        );
        break;
      case 5:
        Nc(e);
      default:
        Lo(l, e), e = at = rr(e, ul), e = Bo(l, e, ul);
    }
    t.memoizedProps = t.pendingProps, e === null ? wu(t) : at = e;
  }
  function La(t, e, l, a) {
    ke = Kl = null, Nc(e), Ra = null, dn = 0;
    var n = e.return;
    try {
      if (bv(
        t,
        n,
        e,
        l,
        ut
      )) {
        Ot = 1, Cu(
          t,
          Te(l, t.current)
        ), at = null;
        return;
      }
    } catch (u) {
      if (n !== null) throw at = n, u;
      Ot = 1, Cu(
        t,
        Te(l, t.current)
      ), at = null;
      return;
    }
    e.flags & 32768 ? (ct || a === 1 ? t = !0 : Ua || (ut & 536870912) !== 0 ? t = !1 : (Tl = t = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = he.current, a !== null && a.tag === 13 && (a.flags |= 16384))), md(e, t)) : wu(e);
  }
  function wu(t) {
    var e = t;
    do {
      if ((e.flags & 32768) !== 0) {
        md(
          e,
          Tl
        );
        return;
      }
      t = e.return;
      var l = Ev(
        e.alternate,
        e,
        ul
      );
      if (l !== null) {
        at = l;
        return;
      }
      if (e = e.sibling, e !== null) {
        at = e;
        return;
      }
      at = e = t;
    } while (e !== null);
    Ot === 0 && (Ot = 5);
  }
  function md(t, e) {
    do {
      var l = _v(t.alternate, t);
      if (l !== null) {
        l.flags &= 32767, at = l;
        return;
      }
      if (l = t.return, l !== null && (l.flags |= 32768, l.subtreeFlags = 0, l.deletions = null), !e && (t = t.sibling, t !== null)) {
        at = t;
        return;
      }
      at = t = l;
    } while (t !== null);
    Ot = 6, at = null;
  }
  function vd(t, e, l, a, n, u, c, r, v) {
    t.cancelPendingCommit = null;
    do
      Ku();
    while (Gt !== 0);
    if ((rt & 6) !== 0) throw Error(f(327));
    if (e !== null) {
      if (e === t.current) throw Error(f(177));
      if (u = e.lanes | e.childLanes, u |= ac, rm(
        t,
        l,
        u,
        c,
        r,
        v
      ), t === xt && (at = xt = null, ut = 0), Ba = e, Rl = t, il = l, df = u, hf = n, nd = a, (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0 ? (t.callbackNode = null, t.callbackPriority = 0, Hv($n, function() {
        return Sd(), null;
      })) : (t.callbackNode = null, t.callbackPriority = 0), a = (e.flags & 13878) !== 0, (e.subtreeFlags & 13878) !== 0 || a) {
        a = M.T, M.T = null, n = q.p, q.p = 2, c = rt, rt |= 4;
        try {
          Tv(t, e, l);
        } finally {
          rt = c, q.p = n, M.T = a;
        }
      }
      Gt = 1, yd(), pd(), gd();
    }
  }
  function yd() {
    if (Gt === 1) {
      Gt = 0;
      var t = Rl, e = Ba, l = (e.flags & 13878) !== 0;
      if ((e.subtreeFlags & 13878) !== 0 || l) {
        l = M.T, M.T = null;
        var a = q.p;
        q.p = 2;
        var n = rt;
        rt |= 4;
        try {
          Wo(e, t);
          var u = jf, c = er(t.containerInfo), r = u.focusedElem, v = u.selectionRange;
          if (c !== r && r && r.ownerDocument && tr(
            r.ownerDocument.documentElement,
            r
          )) {
            if (v !== null && Ii(r)) {
              var _ = v.start, N = v.end;
              if (N === void 0 && (N = _), "selectionStart" in r)
                r.selectionStart = _, r.selectionEnd = Math.min(
                  N,
                  r.value.length
                );
              else {
                var D = r.ownerDocument || document, z = D && D.defaultView || window;
                if (z.getSelection) {
                  var R = z.getSelection(), G = r.textContent.length, J = Math.min(v.start, G), gt = v.end === void 0 ? J : Math.min(v.end, G);
                  !R.extend && J > gt && (c = gt, gt = J, J = c);
                  var x = Ps(
                    r,
                    J
                  ), p = Ps(
                    r,
                    gt
                  );
                  if (x && p && (R.rangeCount !== 1 || R.anchorNode !== x.node || R.anchorOffset !== x.offset || R.focusNode !== p.node || R.focusOffset !== p.offset)) {
                    var E = D.createRange();
                    E.setStart(x.node, x.offset), R.removeAllRanges(), J > gt ? (R.addRange(E), R.extend(p.node, p.offset)) : (E.setEnd(p.node, p.offset), R.addRange(E));
                  }
                }
              }
            }
            for (D = [], R = r; R = R.parentNode; )
              R.nodeType === 1 && D.push({
                element: R,
                left: R.scrollLeft,
                top: R.scrollTop
              });
            for (typeof r.focus == "function" && r.focus(), r = 0; r < D.length; r++) {
              var C = D[r];
              C.element.scrollLeft = C.left, C.element.scrollTop = C.top;
            }
          }
          ni = !!Rf, jf = Rf = null;
        } finally {
          rt = n, q.p = a, M.T = l;
        }
      }
      t.current = e, Gt = 2;
    }
  }
  function pd() {
    if (Gt === 2) {
      Gt = 0;
      var t = Rl, e = Ba, l = (e.flags & 8772) !== 0;
      if ((e.subtreeFlags & 8772) !== 0 || l) {
        l = M.T, M.T = null;
        var a = q.p;
        q.p = 2;
        var n = rt;
        rt |= 4;
        try {
          wo(t, e.alternate, e);
        } finally {
          rt = n, q.p = a, M.T = l;
        }
      }
      Gt = 3;
    }
  }
  function gd() {
    if (Gt === 4 || Gt === 3) {
      Gt = 0, em();
      var t = Rl, e = Ba, l = il, a = nd;
      (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0 ? Gt = 5 : (Gt = 0, Ba = Rl = null, bd(t, t.pendingLanes));
      var n = t.pendingLanes;
      if (n === 0 && (Al = null), Di(l), e = e.stateNode, se && typeof se.onCommitFiberRoot == "function")
        try {
          se.onCommitFiberRoot(
            Ja,
            e,
            void 0,
            (e.current.flags & 128) === 128
          );
        } catch {
        }
      if (a !== null) {
        e = M.T, n = q.p, q.p = 2, M.T = null;
        try {
          for (var u = t.onRecoverableError, c = 0; c < a.length; c++) {
            var r = a[c];
            u(r.value, {
              componentStack: r.stack
            });
          }
        } finally {
          M.T = e, q.p = n;
        }
      }
      (il & 3) !== 0 && Ku(), Qe(t), n = t.pendingLanes, (l & 261930) !== 0 && (n & 42) !== 0 ? t === mf ? On++ : (On = 0, mf = t) : On = 0, Nn(0);
    }
  }
  function bd(t, e) {
    (t.pooledCacheLanes &= e) === 0 && (e = t.pooledCache, e != null && (t.pooledCache = null, rn(e)));
  }
  function Ku() {
    return yd(), pd(), gd(), Sd();
  }
  function Sd() {
    if (Gt !== 5) return !1;
    var t = Rl, e = df;
    df = 0;
    var l = Di(il), a = M.T, n = q.p;
    try {
      q.p = 32 > l ? 32 : l, M.T = null, l = hf, hf = null;
      var u = Rl, c = il;
      if (Gt = 0, Ba = Rl = null, il = 0, (rt & 6) !== 0) throw Error(f(331));
      var r = rt;
      if (rt |= 4, ed(u.current), Io(
        u,
        u.current,
        c,
        l
      ), rt = r, Nn(0, !1), se && typeof se.onPostCommitFiberRoot == "function")
        try {
          se.onPostCommitFiberRoot(Ja, u);
        } catch {
        }
      return !0;
    } finally {
      q.p = n, M.T = a, bd(t, e);
    }
  }
  function xd(t, e, l) {
    e = Te(l, e), e = wc(t.stateNode, e, 2), t = Sl(t, e, 2), t !== null && (ka(t, 2), Qe(t));
  }
  function mt(t, e, l) {
    if (t.tag === 3)
      xd(t, t, l);
    else
      for (; e !== null; ) {
        if (e.tag === 3) {
          xd(
            e,
            t,
            l
          );
          break;
        } else if (e.tag === 1) {
          var a = e.stateNode;
          if (typeof e.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (Al === null || !Al.has(a))) {
            t = Te(l, t), l = Eo(2), a = Sl(e, l, 2), a !== null && (_o(
              l,
              a,
              e,
              t
            ), ka(a, 2), Qe(a));
            break;
          }
        }
        e = e.return;
      }
  }
  function pf(t, e, l) {
    var a = t.pingCache;
    if (a === null) {
      a = t.pingCache = new Rv();
      var n = /* @__PURE__ */ new Set();
      a.set(e, n);
    } else
      n = a.get(e), n === void 0 && (n = /* @__PURE__ */ new Set(), a.set(e, n));
    n.has(l) || (sf = !0, n.add(l), t = Cv.bind(null, t, e, l), e.then(t, t));
  }
  function Cv(t, e, l) {
    var a = t.pingCache;
    a !== null && a.delete(e), t.pingedLanes |= t.suspendedLanes & l, t.warmLanes &= ~l, xt === t && (ut & l) === l && (Ot === 4 || Ot === 3 && (ut & 62914560) === ut && 300 > fe() - Gu ? (rt & 2) === 0 && qa(t, 0) : rf |= l, Ha === ut && (Ha = 0)), Qe(t);
  }
  function Ed(t, e) {
    e === 0 && (e = vs()), t = Zl(t, e), t !== null && (ka(t, e), Qe(t));
  }
  function Dv(t) {
    var e = t.memoizedState, l = 0;
    e !== null && (l = e.retryLane), Ed(t, l);
  }
  function Uv(t, e) {
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
        throw Error(f(314));
    }
    a !== null && a.delete(e), Ed(t, l);
  }
  function Hv(t, e) {
    return Oi(t, e);
  }
  var Ju = null, Ya = null, gf = !1, $u = !1, bf = !1, Ol = 0;
  function Qe(t) {
    t !== Ya && t.next === null && (Ya === null ? Ju = Ya = t : Ya = Ya.next = t), $u = !0, gf || (gf = !0, qv());
  }
  function Nn(t, e) {
    if (!bf && $u) {
      bf = !0;
      do
        for (var l = !1, a = Ju; a !== null; ) {
          if (t !== 0) {
            var n = a.pendingLanes;
            if (n === 0) var u = 0;
            else {
              var c = a.suspendedLanes, r = a.pingedLanes;
              u = (1 << 31 - re(42 | t) + 1) - 1, u &= n & ~(c & ~r), u = u & 201326741 ? u & 201326741 | 1 : u ? u | 2 : 0;
            }
            u !== 0 && (l = !0, Ad(a, u));
          } else
            u = ut, u = In(
              a,
              a === xt ? u : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (u & 3) === 0 || $a(a, u) || (l = !0, Ad(a, u));
          a = a.next;
        }
      while (l);
      bf = !1;
    }
  }
  function Bv() {
    _d();
  }
  function _d() {
    $u = gf = !1;
    var t = 0;
    Ol !== 0 && Jv() && (t = Ol);
    for (var e = fe(), l = null, a = Ju; a !== null; ) {
      var n = a.next, u = Td(a, e);
      u === 0 ? (a.next = null, l === null ? Ju = n : l.next = n, n === null && (Ya = l)) : (l = a, (t !== 0 || (u & 3) !== 0) && ($u = !0)), a = n;
    }
    Gt !== 0 && Gt !== 5 || Nn(t), Ol !== 0 && (Ol = 0);
  }
  function Td(t, e) {
    for (var l = t.suspendedLanes, a = t.pingedLanes, n = t.expirationTimes, u = t.pendingLanes & -62914561; 0 < u; ) {
      var c = 31 - re(u), r = 1 << c, v = n[c];
      v === -1 ? ((r & l) === 0 || (r & a) !== 0) && (n[c] = sm(r, e)) : v <= e && (t.expiredLanes |= r), u &= ~r;
    }
    if (e = xt, l = ut, l = In(
      t,
      t === e ? l : 0,
      t.cancelPendingCommit !== null || t.timeoutHandle !== -1
    ), a = t.callbackNode, l === 0 || t === e && (ht === 2 || ht === 9) || t.cancelPendingCommit !== null)
      return a !== null && a !== null && Ni(a), t.callbackNode = null, t.callbackPriority = 0;
    if ((l & 3) === 0 || $a(t, l)) {
      if (e = l & -l, e === t.callbackPriority) return e;
      switch (a !== null && Ni(a), Di(l)) {
        case 2:
        case 8:
          l = hs;
          break;
        case 32:
          l = $n;
          break;
        case 268435456:
          l = ms;
          break;
        default:
          l = $n;
      }
      return a = zd.bind(null, t), l = Oi(l, a), t.callbackPriority = e, t.callbackNode = l, e;
    }
    return a !== null && a !== null && Ni(a), t.callbackPriority = 2, t.callbackNode = null, 2;
  }
  function zd(t, e) {
    if (Gt !== 0 && Gt !== 5)
      return t.callbackNode = null, t.callbackPriority = 0, null;
    var l = t.callbackNode;
    if (Ku() && t.callbackNode !== l)
      return null;
    var a = ut;
    return a = In(
      t,
      t === xt ? a : 0,
      t.cancelPendingCommit !== null || t.timeoutHandle !== -1
    ), a === 0 ? null : (id(t, a, e), Td(t, fe()), t.callbackNode != null && t.callbackNode === l ? zd.bind(null, t) : null);
  }
  function Ad(t, e) {
    if (Ku()) return null;
    id(t, e, !0);
  }
  function qv() {
    kv(function() {
      (rt & 6) !== 0 ? Oi(
        ds,
        Bv
      ) : _d();
    });
  }
  function Sf() {
    if (Ol === 0) {
      var t = Ta;
      t === 0 && (t = kn, kn <<= 1, (kn & 261888) === 0 && (kn = 256)), Ol = t;
    }
    return Ol;
  }
  function Rd(t) {
    return t == null || typeof t == "symbol" || typeof t == "boolean" ? null : typeof t == "function" ? t : lu("" + t);
  }
  function jd(t, e) {
    var l = e.ownerDocument.createElement("input");
    return l.name = e.name, l.value = e.value, t.id && l.setAttribute("form", t.id), e.parentNode.insertBefore(l, e), t = new FormData(t), l.parentNode.removeChild(l), t;
  }
  function Lv(t, e, l, a, n) {
    if (e === "submit" && l && l.stateNode === n) {
      var u = Rd(
        (n[ee] || null).action
      ), c = a.submitter;
      c && (e = (e = c[ee] || null) ? Rd(e.formAction) : c.getAttribute("formAction"), e !== null && (u = e, c = null));
      var r = new iu(
        "action",
        "action",
        null,
        a,
        n
      );
      t.push({
        event: r,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (Ol !== 0) {
                  var v = c ? jd(n, c) : new FormData(n);
                  Yc(
                    l,
                    {
                      pending: !0,
                      data: v,
                      method: n.method,
                      action: u
                    },
                    null,
                    v
                  );
                }
              } else
                typeof u == "function" && (r.preventDefault(), v = c ? jd(n, c) : new FormData(n), Yc(
                  l,
                  {
                    pending: !0,
                    data: v,
                    method: n.method,
                    action: u
                  },
                  u,
                  v
                ));
            },
            currentTarget: n
          }
        ]
      });
    }
  }
  for (var xf = 0; xf < lc.length; xf++) {
    var Ef = lc[xf], Yv = Ef.toLowerCase(), Gv = Ef[0].toUpperCase() + Ef.slice(1);
    Ce(
      Yv,
      "on" + Gv
    );
  }
  Ce(nr, "onAnimationEnd"), Ce(ur, "onAnimationIteration"), Ce(ir, "onAnimationStart"), Ce("dblclick", "onDoubleClick"), Ce("focusin", "onFocus"), Ce("focusout", "onBlur"), Ce(lv, "onTransitionRun"), Ce(av, "onTransitionStart"), Ce(nv, "onTransitionCancel"), Ce(cr, "onTransitionEnd"), ra("onMouseEnter", ["mouseout", "mouseover"]), ra("onMouseLeave", ["mouseout", "mouseover"]), ra("onPointerEnter", ["pointerout", "pointerover"]), ra("onPointerLeave", ["pointerout", "pointerover"]), Yl(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), Yl(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), Yl("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), Yl(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), Yl(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), Yl(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var Mn = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), Xv = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Mn)
  );
  function Od(t, e) {
    e = (e & 4) !== 0;
    for (var l = 0; l < t.length; l++) {
      var a = t[l], n = a.event;
      a = a.listeners;
      t: {
        var u = void 0;
        if (e)
          for (var c = a.length - 1; 0 <= c; c--) {
            var r = a[c], v = r.instance, _ = r.currentTarget;
            if (r = r.listener, v !== u && n.isPropagationStopped())
              break t;
            u = r, n.currentTarget = _;
            try {
              u(n);
            } catch (N) {
              su(N);
            }
            n.currentTarget = null, u = v;
          }
        else
          for (c = 0; c < a.length; c++) {
            if (r = a[c], v = r.instance, _ = r.currentTarget, r = r.listener, v !== u && n.isPropagationStopped())
              break t;
            u = r, n.currentTarget = _;
            try {
              u(n);
            } catch (N) {
              su(N);
            }
            n.currentTarget = null, u = v;
          }
      }
    }
  }
  function nt(t, e) {
    var l = e[Ui];
    l === void 0 && (l = e[Ui] = /* @__PURE__ */ new Set());
    var a = t + "__bubble";
    l.has(a) || (Nd(e, t, 2, !1), l.add(a));
  }
  function _f(t, e, l) {
    var a = 0;
    e && (a |= 4), Nd(
      l,
      t,
      a,
      e
    );
  }
  var ku = "_reactListening" + Math.random().toString(36).slice(2);
  function Tf(t) {
    if (!t[ku]) {
      t[ku] = !0, Es.forEach(function(l) {
        l !== "selectionchange" && (Xv.has(l) || _f(l, !1, t), _f(l, !0, t));
      });
      var e = t.nodeType === 9 ? t : t.ownerDocument;
      e === null || e[ku] || (e[ku] = !0, _f("selectionchange", !1, e));
    }
  }
  function Nd(t, e, l, a) {
    switch (uh(e)) {
      case 2:
        var n = vy;
        break;
      case 8:
        n = yy;
        break;
      default:
        n = Yf;
    }
    l = n.bind(
      null,
      e,
      l,
      t
    ), n = void 0, !Zi || e !== "touchstart" && e !== "touchmove" && e !== "wheel" || (n = !0), a ? n !== void 0 ? t.addEventListener(e, l, {
      capture: !0,
      passive: n
    }) : t.addEventListener(e, l, !0) : n !== void 0 ? t.addEventListener(e, l, {
      passive: n
    }) : t.addEventListener(e, l, !1);
  }
  function zf(t, e, l, a, n) {
    var u = a;
    if ((e & 1) === 0 && (e & 2) === 0 && a !== null)
      t: for (; ; ) {
        if (a === null) return;
        var c = a.tag;
        if (c === 3 || c === 4) {
          var r = a.stateNode.containerInfo;
          if (r === n) break;
          if (c === 4)
            for (c = a.return; c !== null; ) {
              var v = c.tag;
              if ((v === 3 || v === 4) && c.stateNode.containerInfo === n)
                return;
              c = c.return;
            }
          for (; r !== null; ) {
            if (c = ca(r), c === null) return;
            if (v = c.tag, v === 5 || v === 6 || v === 26 || v === 27) {
              a = u = c;
              continue t;
            }
            r = r.parentNode;
          }
        }
        a = a.return;
      }
    Us(function() {
      var _ = u, N = Xi(l), D = [];
      t: {
        var z = fr.get(t);
        if (z !== void 0) {
          var R = iu, G = t;
          switch (t) {
            case "keypress":
              if (nu(l) === 0) break t;
            case "keydown":
            case "keyup":
              R = Um;
              break;
            case "focusin":
              G = "focus", R = Ji;
              break;
            case "focusout":
              G = "blur", R = Ji;
              break;
            case "beforeblur":
            case "afterblur":
              R = Ji;
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
              R = qs;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              R = Em;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              R = qm;
              break;
            case nr:
            case ur:
            case ir:
              R = zm;
              break;
            case cr:
              R = Ym;
              break;
            case "scroll":
            case "scrollend":
              R = Sm;
              break;
            case "wheel":
              R = Xm;
              break;
            case "copy":
            case "cut":
            case "paste":
              R = Rm;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              R = Ys;
              break;
            case "toggle":
            case "beforetoggle":
              R = Zm;
          }
          var J = (e & 4) !== 0, gt = !J && (t === "scroll" || t === "scrollend"), x = J ? z !== null ? z + "Capture" : null : z;
          J = [];
          for (var p = _, E; p !== null; ) {
            var C = p;
            if (E = C.stateNode, C = C.tag, C !== 5 && C !== 26 && C !== 27 || E === null || x === null || (C = Ia(p, x), C != null && J.push(
              Cn(p, C, E)
            )), gt) break;
            p = p.return;
          }
          0 < J.length && (z = new R(
            z,
            G,
            null,
            l,
            N
          ), D.push({ event: z, listeners: J }));
        }
      }
      if ((e & 7) === 0) {
        t: {
          if (z = t === "mouseover" || t === "pointerover", R = t === "mouseout" || t === "pointerout", z && l !== Gi && (G = l.relatedTarget || l.fromElement) && (ca(G) || G[ia]))
            break t;
          if ((R || z) && (z = N.window === N ? N : (z = N.ownerDocument) ? z.defaultView || z.parentWindow : window, R ? (G = l.relatedTarget || l.toElement, R = _, G = G ? ca(G) : null, G !== null && (gt = m(G), J = G.tag, G !== gt || J !== 5 && J !== 27 && J !== 6) && (G = null)) : (R = null, G = _), R !== G)) {
            if (J = qs, C = "onMouseLeave", x = "onMouseEnter", p = "mouse", (t === "pointerout" || t === "pointerover") && (J = Ys, C = "onPointerLeave", x = "onPointerEnter", p = "pointer"), gt = R == null ? z : Fa(R), E = G == null ? z : Fa(G), z = new J(
              C,
              p + "leave",
              R,
              l,
              N
            ), z.target = gt, z.relatedTarget = E, C = null, ca(N) === _ && (J = new J(
              x,
              p + "enter",
              G,
              l,
              N
            ), J.target = E, J.relatedTarget = gt, C = J), gt = C, R && G)
              e: {
                for (J = Qv, x = R, p = G, E = 0, C = x; C; C = J(C))
                  E++;
                C = 0;
                for (var w = p; w; w = J(w))
                  C++;
                for (; 0 < E - C; )
                  x = J(x), E--;
                for (; 0 < C - E; )
                  p = J(p), C--;
                for (; E--; ) {
                  if (x === p || p !== null && x === p.alternate) {
                    J = x;
                    break e;
                  }
                  x = J(x), p = J(p);
                }
                J = null;
              }
            else J = null;
            R !== null && Md(
              D,
              z,
              R,
              J,
              !1
            ), G !== null && gt !== null && Md(
              D,
              gt,
              G,
              J,
              !0
            );
          }
        }
        t: {
          if (z = _ ? Fa(_) : window, R = z.nodeName && z.nodeName.toLowerCase(), R === "select" || R === "input" && z.type === "file")
            var ft = Js;
          else if (ws(z))
            if ($s)
              ft = Pm;
            else {
              ft = Fm;
              var Q = Wm;
            }
          else
            R = z.nodeName, !R || R.toLowerCase() !== "input" || z.type !== "checkbox" && z.type !== "radio" ? _ && Yi(_.elementType) && (ft = Js) : ft = Im;
          if (ft && (ft = ft(t, _))) {
            Ks(
              D,
              ft,
              l,
              N
            );
            break t;
          }
          Q && Q(t, z, _), t === "focusout" && _ && z.type === "number" && _.memoizedProps.value != null && Li(z, "number", z.value);
        }
        switch (Q = _ ? Fa(_) : window, t) {
          case "focusin":
            (ws(Q) || Q.contentEditable === "true") && (ya = Q, Pi = _, cn = null);
            break;
          case "focusout":
            cn = Pi = ya = null;
            break;
          case "mousedown":
            tc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            tc = !1, lr(D, l, N);
            break;
          case "selectionchange":
            if (ev) break;
          case "keydown":
          case "keyup":
            lr(D, l, N);
        }
        var et;
        if (ki)
          t: {
            switch (t) {
              case "compositionstart":
                var it = "onCompositionStart";
                break t;
              case "compositionend":
                it = "onCompositionEnd";
                break t;
              case "compositionupdate":
                it = "onCompositionUpdate";
                break t;
            }
            it = void 0;
          }
        else
          va ? Zs(t, l) && (it = "onCompositionEnd") : t === "keydown" && l.keyCode === 229 && (it = "onCompositionStart");
        it && (Gs && l.locale !== "ko" && (va || it !== "onCompositionStart" ? it === "onCompositionEnd" && va && (et = Hs()) : (hl = N, Vi = "value" in hl ? hl.value : hl.textContent, va = !0)), Q = Wu(_, it), 0 < Q.length && (it = new Ls(
          it,
          t,
          null,
          l,
          N
        ), D.push({ event: it, listeners: Q }), et ? it.data = et : (et = Vs(l), et !== null && (it.data = et)))), (et = wm ? Km(t, l) : Jm(t, l)) && (it = Wu(_, "onBeforeInput"), 0 < it.length && (Q = new Ls(
          "onBeforeInput",
          "beforeinput",
          null,
          l,
          N
        ), D.push({
          event: Q,
          listeners: it
        }), Q.data = et)), Lv(
          D,
          t,
          _,
          l,
          N
        );
      }
      Od(D, e);
    });
  }
  function Cn(t, e, l) {
    return {
      instance: t,
      listener: e,
      currentTarget: l
    };
  }
  function Wu(t, e) {
    for (var l = e + "Capture", a = []; t !== null; ) {
      var n = t, u = n.stateNode;
      if (n = n.tag, n !== 5 && n !== 26 && n !== 27 || u === null || (n = Ia(t, l), n != null && a.unshift(
        Cn(t, n, u)
      ), n = Ia(t, e), n != null && a.push(
        Cn(t, n, u)
      )), t.tag === 3) return a;
      t = t.return;
    }
    return [];
  }
  function Qv(t) {
    if (t === null) return null;
    do
      t = t.return;
    while (t && t.tag !== 5 && t.tag !== 27);
    return t || null;
  }
  function Md(t, e, l, a, n) {
    for (var u = e._reactName, c = []; l !== null && l !== a; ) {
      var r = l, v = r.alternate, _ = r.stateNode;
      if (r = r.tag, v !== null && v === a) break;
      r !== 5 && r !== 26 && r !== 27 || _ === null || (v = _, n ? (_ = Ia(l, u), _ != null && c.unshift(
        Cn(l, _, v)
      )) : n || (_ = Ia(l, u), _ != null && c.push(
        Cn(l, _, v)
      ))), l = l.return;
    }
    c.length !== 0 && t.push({ event: e, listeners: c });
  }
  var Zv = /\r\n?/g, Vv = /\u0000|\uFFFD/g;
  function Cd(t) {
    return (typeof t == "string" ? t : "" + t).replace(Zv, `
`).replace(Vv, "");
  }
  function Dd(t, e) {
    return e = Cd(e), Cd(t) === e;
  }
  function pt(t, e, l, a, n, u) {
    switch (l) {
      case "children":
        typeof a == "string" ? e === "body" || e === "textarea" && a === "" || da(t, a) : (typeof a == "number" || typeof a == "bigint") && e !== "body" && da(t, "" + a);
        break;
      case "className":
        tu(t, "class", a);
        break;
      case "tabIndex":
        tu(t, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        tu(t, l, a);
        break;
      case "style":
        Cs(t, a, u);
        break;
      case "data":
        if (e !== "object") {
          tu(t, "data", a);
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
        a = lu("" + a), t.setAttribute(l, a);
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
          typeof u == "function" && (l === "formAction" ? (e !== "input" && pt(t, e, "name", n.name, n, null), pt(
            t,
            e,
            "formEncType",
            n.formEncType,
            n,
            null
          ), pt(
            t,
            e,
            "formMethod",
            n.formMethod,
            n,
            null
          ), pt(
            t,
            e,
            "formTarget",
            n.formTarget,
            n,
            null
          )) : (pt(t, e, "encType", n.encType, n, null), pt(t, e, "method", n.method, n, null), pt(t, e, "target", n.target, n, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          t.removeAttribute(l);
          break;
        }
        a = lu("" + a), t.setAttribute(l, a);
        break;
      case "onClick":
        a != null && (t.onclick = we);
        break;
      case "onScroll":
        a != null && nt("scroll", t);
        break;
      case "onScrollEnd":
        a != null && nt("scrollend", t);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(f(61));
          if (l = a.__html, l != null) {
            if (n.children != null) throw Error(f(60));
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
        l = lu("" + a), t.setAttributeNS(
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
        nt("beforetoggle", t), nt("toggle", t), Pn(t, "popover", a);
        break;
      case "xlinkActuate":
        Ve(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        Ve(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        Ve(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        Ve(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        Ve(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        Ve(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        Ve(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        Ve(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        Ve(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        Pn(t, "is", a);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < l.length) || l[0] !== "o" && l[0] !== "O" || l[1] !== "n" && l[1] !== "N") && (l = gm.get(l) || l, Pn(t, l, a));
    }
  }
  function Af(t, e, l, a, n, u) {
    switch (l) {
      case "style":
        Cs(t, a, u);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(f(61));
          if (l = a.__html, l != null) {
            if (n.children != null) throw Error(f(60));
            t.innerHTML = l;
          }
        }
        break;
      case "children":
        typeof a == "string" ? da(t, a) : (typeof a == "number" || typeof a == "bigint") && da(t, "" + a);
        break;
      case "onScroll":
        a != null && nt("scroll", t);
        break;
      case "onScrollEnd":
        a != null && nt("scrollend", t);
        break;
      case "onClick":
        a != null && (t.onclick = we);
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
        if (!_s.hasOwnProperty(l))
          t: {
            if (l[0] === "o" && l[1] === "n" && (n = l.endsWith("Capture"), e = l.slice(2, n ? l.length - 7 : void 0), u = t[ee] || null, u = u != null ? u[l] : null, typeof u == "function" && t.removeEventListener(e, u, n), typeof a == "function")) {
              typeof u != "function" && u !== null && (l in t ? t[l] = null : t.hasAttribute(l) && t.removeAttribute(l)), t.addEventListener(e, a, n);
              break t;
            }
            l in t ? t[l] = a : a === !0 ? t.setAttribute(l, "") : Pn(t, l, a);
          }
    }
  }
  function $t(t, e, l) {
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
        nt("error", t), nt("load", t);
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
                  throw Error(f(137, e));
                default:
                  pt(t, e, u, c, l, null);
              }
          }
        n && pt(t, e, "srcSet", l.srcSet, l, null), a && pt(t, e, "src", l.src, l, null);
        return;
      case "input":
        nt("invalid", t);
        var r = u = c = n = null, v = null, _ = null;
        for (a in l)
          if (l.hasOwnProperty(a)) {
            var N = l[a];
            if (N != null)
              switch (a) {
                case "name":
                  n = N;
                  break;
                case "type":
                  c = N;
                  break;
                case "checked":
                  v = N;
                  break;
                case "defaultChecked":
                  _ = N;
                  break;
                case "value":
                  u = N;
                  break;
                case "defaultValue":
                  r = N;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (N != null)
                    throw Error(f(137, e));
                  break;
                default:
                  pt(t, e, a, N, l, null);
              }
          }
        js(
          t,
          u,
          r,
          v,
          _,
          c,
          n,
          !1
        );
        return;
      case "select":
        nt("invalid", t), a = c = u = null;
        for (n in l)
          if (l.hasOwnProperty(n) && (r = l[n], r != null))
            switch (n) {
              case "value":
                u = r;
                break;
              case "defaultValue":
                c = r;
                break;
              case "multiple":
                a = r;
              default:
                pt(t, e, n, r, l, null);
            }
        e = u, l = c, t.multiple = !!a, e != null ? oa(t, !!a, e, !1) : l != null && oa(t, !!a, l, !0);
        return;
      case "textarea":
        nt("invalid", t), u = n = a = null;
        for (c in l)
          if (l.hasOwnProperty(c) && (r = l[c], r != null))
            switch (c) {
              case "value":
                a = r;
                break;
              case "defaultValue":
                n = r;
                break;
              case "children":
                u = r;
                break;
              case "dangerouslySetInnerHTML":
                if (r != null) throw Error(f(91));
                break;
              default:
                pt(t, e, c, r, l, null);
            }
        Ns(t, a, n, u);
        return;
      case "option":
        for (v in l)
          if (l.hasOwnProperty(v) && (a = l[v], a != null))
            switch (v) {
              case "selected":
                t.selected = a && typeof a != "function" && typeof a != "symbol";
                break;
              default:
                pt(t, e, v, a, l, null);
            }
        return;
      case "dialog":
        nt("beforetoggle", t), nt("toggle", t), nt("cancel", t), nt("close", t);
        break;
      case "iframe":
      case "object":
        nt("load", t);
        break;
      case "video":
      case "audio":
        for (a = 0; a < Mn.length; a++)
          nt(Mn[a], t);
        break;
      case "image":
        nt("error", t), nt("load", t);
        break;
      case "details":
        nt("toggle", t);
        break;
      case "embed":
      case "source":
      case "link":
        nt("error", t), nt("load", t);
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
        for (_ in l)
          if (l.hasOwnProperty(_) && (a = l[_], a != null))
            switch (_) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(f(137, e));
              default:
                pt(t, e, _, a, l, null);
            }
        return;
      default:
        if (Yi(e)) {
          for (N in l)
            l.hasOwnProperty(N) && (a = l[N], a !== void 0 && Af(
              t,
              e,
              N,
              a,
              l,
              void 0
            ));
          return;
        }
    }
    for (r in l)
      l.hasOwnProperty(r) && (a = l[r], a != null && pt(t, e, r, a, l, null));
  }
  function wv(t, e, l, a) {
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
        var n = null, u = null, c = null, r = null, v = null, _ = null, N = null;
        for (R in l) {
          var D = l[R];
          if (l.hasOwnProperty(R) && D != null)
            switch (R) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                v = D;
              default:
                a.hasOwnProperty(R) || pt(t, e, R, null, a, D);
            }
        }
        for (var z in a) {
          var R = a[z];
          if (D = l[z], a.hasOwnProperty(z) && (R != null || D != null))
            switch (z) {
              case "type":
                u = R;
                break;
              case "name":
                n = R;
                break;
              case "checked":
                _ = R;
                break;
              case "defaultChecked":
                N = R;
                break;
              case "value":
                c = R;
                break;
              case "defaultValue":
                r = R;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (R != null)
                  throw Error(f(137, e));
                break;
              default:
                R !== D && pt(
                  t,
                  e,
                  z,
                  R,
                  a,
                  D
                );
            }
        }
        qi(
          t,
          c,
          r,
          v,
          _,
          N,
          u,
          n
        );
        return;
      case "select":
        R = c = r = z = null;
        for (u in l)
          if (v = l[u], l.hasOwnProperty(u) && v != null)
            switch (u) {
              case "value":
                break;
              case "multiple":
                R = v;
              default:
                a.hasOwnProperty(u) || pt(
                  t,
                  e,
                  u,
                  null,
                  a,
                  v
                );
            }
        for (n in a)
          if (u = a[n], v = l[n], a.hasOwnProperty(n) && (u != null || v != null))
            switch (n) {
              case "value":
                z = u;
                break;
              case "defaultValue":
                r = u;
                break;
              case "multiple":
                c = u;
              default:
                u !== v && pt(
                  t,
                  e,
                  n,
                  u,
                  a,
                  v
                );
            }
        e = r, l = c, a = R, z != null ? oa(t, !!l, z, !1) : !!a != !!l && (e != null ? oa(t, !!l, e, !0) : oa(t, !!l, l ? [] : "", !1));
        return;
      case "textarea":
        R = z = null;
        for (r in l)
          if (n = l[r], l.hasOwnProperty(r) && n != null && !a.hasOwnProperty(r))
            switch (r) {
              case "value":
                break;
              case "children":
                break;
              default:
                pt(t, e, r, null, a, n);
            }
        for (c in a)
          if (n = a[c], u = l[c], a.hasOwnProperty(c) && (n != null || u != null))
            switch (c) {
              case "value":
                z = n;
                break;
              case "defaultValue":
                R = n;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (n != null) throw Error(f(91));
                break;
              default:
                n !== u && pt(t, e, c, n, a, u);
            }
        Os(t, z, R);
        return;
      case "option":
        for (var G in l)
          if (z = l[G], l.hasOwnProperty(G) && z != null && !a.hasOwnProperty(G))
            switch (G) {
              case "selected":
                t.selected = !1;
                break;
              default:
                pt(
                  t,
                  e,
                  G,
                  null,
                  a,
                  z
                );
            }
        for (v in a)
          if (z = a[v], R = l[v], a.hasOwnProperty(v) && z !== R && (z != null || R != null))
            switch (v) {
              case "selected":
                t.selected = z && typeof z != "function" && typeof z != "symbol";
                break;
              default:
                pt(
                  t,
                  e,
                  v,
                  z,
                  a,
                  R
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
        for (var J in l)
          z = l[J], l.hasOwnProperty(J) && z != null && !a.hasOwnProperty(J) && pt(t, e, J, null, a, z);
        for (_ in a)
          if (z = a[_], R = l[_], a.hasOwnProperty(_) && z !== R && (z != null || R != null))
            switch (_) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (z != null)
                  throw Error(f(137, e));
                break;
              default:
                pt(
                  t,
                  e,
                  _,
                  z,
                  a,
                  R
                );
            }
        return;
      default:
        if (Yi(e)) {
          for (var gt in l)
            z = l[gt], l.hasOwnProperty(gt) && z !== void 0 && !a.hasOwnProperty(gt) && Af(
              t,
              e,
              gt,
              void 0,
              a,
              z
            );
          for (N in a)
            z = a[N], R = l[N], !a.hasOwnProperty(N) || z === R || z === void 0 && R === void 0 || Af(
              t,
              e,
              N,
              z,
              a,
              R
            );
          return;
        }
    }
    for (var x in l)
      z = l[x], l.hasOwnProperty(x) && z != null && !a.hasOwnProperty(x) && pt(t, e, x, null, a, z);
    for (D in a)
      z = a[D], R = l[D], !a.hasOwnProperty(D) || z === R || z == null && R == null || pt(t, e, D, z, a, R);
  }
  function Ud(t) {
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
  function Kv() {
    if (typeof performance.getEntriesByType == "function") {
      for (var t = 0, e = 0, l = performance.getEntriesByType("resource"), a = 0; a < l.length; a++) {
        var n = l[a], u = n.transferSize, c = n.initiatorType, r = n.duration;
        if (u && r && Ud(c)) {
          for (c = 0, r = n.responseEnd, a += 1; a < l.length; a++) {
            var v = l[a], _ = v.startTime;
            if (_ > r) break;
            var N = v.transferSize, D = v.initiatorType;
            N && Ud(D) && (v = v.responseEnd, c += N * (v < r ? 1 : (r - _) / (v - _)));
          }
          if (--a, e += 8 * (u + c) / (n.duration / 1e3), t++, 10 < t) break;
        }
      }
      if (0 < t) return e / t / 1e6;
    }
    return navigator.connection && (t = navigator.connection.downlink, typeof t == "number") ? t : 5;
  }
  var Rf = null, jf = null;
  function Fu(t) {
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  function Hd(t) {
    switch (t) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Bd(t, e) {
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
  function Of(t, e) {
    return t === "textarea" || t === "noscript" || typeof e.children == "string" || typeof e.children == "number" || typeof e.children == "bigint" || typeof e.dangerouslySetInnerHTML == "object" && e.dangerouslySetInnerHTML !== null && e.dangerouslySetInnerHTML.__html != null;
  }
  var Nf = null;
  function Jv() {
    var t = window.event;
    return t && t.type === "popstate" ? t === Nf ? !1 : (Nf = t, !0) : (Nf = null, !1);
  }
  var qd = typeof setTimeout == "function" ? setTimeout : void 0, $v = typeof clearTimeout == "function" ? clearTimeout : void 0, Ld = typeof Promise == "function" ? Promise : void 0, kv = typeof queueMicrotask == "function" ? queueMicrotask : typeof Ld < "u" ? function(t) {
    return Ld.resolve(null).then(t).catch(Wv);
  } : qd;
  function Wv(t) {
    setTimeout(function() {
      throw t;
    });
  }
  function Nl(t) {
    return t === "head";
  }
  function Yd(t, e) {
    var l = e, a = 0;
    do {
      var n = l.nextSibling;
      if (t.removeChild(l), n && n.nodeType === 8)
        if (l = n.data, l === "/$" || l === "/&") {
          if (a === 0) {
            t.removeChild(n), Za(e);
            return;
          }
          a--;
        } else if (l === "$" || l === "$?" || l === "$~" || l === "$!" || l === "&")
          a++;
        else if (l === "html")
          Dn(t.ownerDocument.documentElement);
        else if (l === "head") {
          l = t.ownerDocument.head, Dn(l);
          for (var u = l.firstChild; u; ) {
            var c = u.nextSibling, r = u.nodeName;
            u[Wa] || r === "SCRIPT" || r === "STYLE" || r === "LINK" && u.rel.toLowerCase() === "stylesheet" || l.removeChild(u), u = c;
          }
        } else
          l === "body" && Dn(t.ownerDocument.body);
      l = n;
    } while (l);
    Za(e);
  }
  function Gd(t, e) {
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
  function Mf(t) {
    var e = t.firstChild;
    for (e && e.nodeType === 10 && (e = e.nextSibling); e; ) {
      var l = e;
      switch (e = e.nextSibling, l.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Mf(l), Hi(l);
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
  function Fv(t, e, l, a) {
    for (; t.nodeType === 1; ) {
      var n = l;
      if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
        if (!a && (t.nodeName !== "INPUT" || t.type !== "hidden"))
          break;
      } else if (a) {
        if (!t[Wa])
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
  function Iv(t, e, l) {
    if (e === "") return null;
    for (; t.nodeType !== 3; )
      if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !l || (t = Oe(t.nextSibling), t === null)) return null;
    return t;
  }
  function Xd(t, e) {
    for (; t.nodeType !== 8; )
      if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !e || (t = Oe(t.nextSibling), t === null)) return null;
    return t;
  }
  function Cf(t) {
    return t.data === "$?" || t.data === "$~";
  }
  function Df(t) {
    return t.data === "$!" || t.data === "$?" && t.ownerDocument.readyState !== "loading";
  }
  function Pv(t, e) {
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
  var Uf = null;
  function Qd(t) {
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
  function Zd(t) {
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
  function Vd(t, e, l) {
    switch (e = Fu(l), t) {
      case "html":
        if (t = e.documentElement, !t) throw Error(f(452));
        return t;
      case "head":
        if (t = e.head, !t) throw Error(f(453));
        return t;
      case "body":
        if (t = e.body, !t) throw Error(f(454));
        return t;
      default:
        throw Error(f(451));
    }
  }
  function Dn(t) {
    for (var e = t.attributes; e.length; )
      t.removeAttributeNode(e[0]);
    Hi(t);
  }
  var Ne = /* @__PURE__ */ new Map(), wd = /* @__PURE__ */ new Set();
  function Iu(t) {
    return typeof t.getRootNode == "function" ? t.getRootNode() : t.nodeType === 9 ? t : t.ownerDocument;
  }
  var cl = q.d;
  q.d = {
    f: ty,
    r: ey,
    D: ly,
    C: ay,
    L: ny,
    m: uy,
    X: cy,
    S: iy,
    M: fy
  };
  function ty() {
    var t = cl.f(), e = Zu();
    return t || e;
  }
  function ey(t) {
    var e = fa(t);
    e !== null && e.tag === 5 && e.type === "form" ? co(e) : cl.r(t);
  }
  var Ga = typeof document > "u" ? null : document;
  function Kd(t, e, l) {
    var a = Ga;
    if (a && typeof e == "string" && e) {
      var n = Ee(e);
      n = 'link[rel="' + t + '"][href="' + n + '"]', typeof l == "string" && (n += '[crossorigin="' + l + '"]'), wd.has(n) || (wd.add(n), t = { rel: t, crossOrigin: l, href: e }, a.querySelector(n) === null && (e = a.createElement("link"), $t(e, "link", t), Xt(e), a.head.appendChild(e)));
    }
  }
  function ly(t) {
    cl.D(t), Kd("dns-prefetch", t, null);
  }
  function ay(t, e) {
    cl.C(t, e), Kd("preconnect", t, e);
  }
  function ny(t, e, l) {
    cl.L(t, e, l);
    var a = Ga;
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
          u = Xa(t);
          break;
        case "script":
          u = Qa(t);
      }
      Ne.has(u) || (t = A(
        {
          rel: "preload",
          href: e === "image" && l && l.imageSrcSet ? void 0 : t,
          as: e
        },
        l
      ), Ne.set(u, t), a.querySelector(n) !== null || e === "style" && a.querySelector(Un(u)) || e === "script" && a.querySelector(Hn(u)) || (e = a.createElement("link"), $t(e, "link", t), Xt(e), a.head.appendChild(e)));
    }
  }
  function uy(t, e) {
    cl.m(t, e);
    var l = Ga;
    if (l && t) {
      var a = e && typeof e.as == "string" ? e.as : "script", n = 'link[rel="modulepreload"][as="' + Ee(a) + '"][href="' + Ee(t) + '"]', u = n;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          u = Qa(t);
      }
      if (!Ne.has(u) && (t = A({ rel: "modulepreload", href: t }, e), Ne.set(u, t), l.querySelector(n) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (l.querySelector(Hn(u)))
              return;
        }
        a = l.createElement("link"), $t(a, "link", t), Xt(a), l.head.appendChild(a);
      }
    }
  }
  function iy(t, e, l) {
    cl.S(t, e, l);
    var a = Ga;
    if (a && t) {
      var n = sa(a).hoistableStyles, u = Xa(t);
      e = e || "default";
      var c = n.get(u);
      if (!c) {
        var r = { loading: 0, preload: null };
        if (c = a.querySelector(
          Un(u)
        ))
          r.loading = 5;
        else {
          t = A(
            { rel: "stylesheet", href: t, "data-precedence": e },
            l
          ), (l = Ne.get(u)) && Hf(t, l);
          var v = c = a.createElement("link");
          Xt(v), $t(v, "link", t), v._p = new Promise(function(_, N) {
            v.onload = _, v.onerror = N;
          }), v.addEventListener("load", function() {
            r.loading |= 1;
          }), v.addEventListener("error", function() {
            r.loading |= 2;
          }), r.loading |= 4, Pu(c, e, a);
        }
        c = {
          type: "stylesheet",
          instance: c,
          count: 1,
          state: r
        }, n.set(u, c);
      }
    }
  }
  function cy(t, e) {
    cl.X(t, e);
    var l = Ga;
    if (l && t) {
      var a = sa(l).hoistableScripts, n = Qa(t), u = a.get(n);
      u || (u = l.querySelector(Hn(n)), u || (t = A({ src: t, async: !0 }, e), (e = Ne.get(n)) && Bf(t, e), u = l.createElement("script"), Xt(u), $t(u, "link", t), l.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, a.set(n, u));
    }
  }
  function fy(t, e) {
    cl.M(t, e);
    var l = Ga;
    if (l && t) {
      var a = sa(l).hoistableScripts, n = Qa(t), u = a.get(n);
      u || (u = l.querySelector(Hn(n)), u || (t = A({ src: t, async: !0, type: "module" }, e), (e = Ne.get(n)) && Bf(t, e), u = l.createElement("script"), Xt(u), $t(u, "link", t), l.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, a.set(n, u));
    }
  }
  function Jd(t, e, l, a) {
    var n = (n = lt.current) ? Iu(n) : null;
    if (!n) throw Error(f(446));
    switch (t) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof l.precedence == "string" && typeof l.href == "string" ? (e = Xa(l.href), l = sa(
          n
        ).hoistableStyles, a = l.get(e), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, l.set(e, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (l.rel === "stylesheet" && typeof l.href == "string" && typeof l.precedence == "string") {
          t = Xa(l.href);
          var u = sa(
            n
          ).hoistableStyles, c = u.get(t);
          if (c || (n = n.ownerDocument || n, c = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, u.set(t, c), (u = n.querySelector(
            Un(t)
          )) && !u._p && (c.instance = u, c.state.loading = 5), Ne.has(t) || (l = {
            rel: "preload",
            as: "style",
            href: l.href,
            crossOrigin: l.crossOrigin,
            integrity: l.integrity,
            media: l.media,
            hrefLang: l.hrefLang,
            referrerPolicy: l.referrerPolicy
          }, Ne.set(t, l), u || sy(
            n,
            t,
            l,
            c.state
          ))), e && a === null)
            throw Error(f(528, ""));
          return c;
        }
        if (e && a !== null)
          throw Error(f(529, ""));
        return null;
      case "script":
        return e = l.async, l = l.src, typeof l == "string" && e && typeof e != "function" && typeof e != "symbol" ? (e = Qa(l), l = sa(
          n
        ).hoistableScripts, a = l.get(e), a || (a = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, l.set(e, a)), a) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(f(444, t));
    }
  }
  function Xa(t) {
    return 'href="' + Ee(t) + '"';
  }
  function Un(t) {
    return 'link[rel="stylesheet"][' + t + "]";
  }
  function $d(t) {
    return A({}, t, {
      "data-precedence": t.precedence,
      precedence: null
    });
  }
  function sy(t, e, l, a) {
    t.querySelector('link[rel="preload"][as="style"][' + e + "]") ? a.loading = 1 : (e = t.createElement("link"), a.preload = e, e.addEventListener("load", function() {
      return a.loading |= 1;
    }), e.addEventListener("error", function() {
      return a.loading |= 2;
    }), $t(e, "link", l), Xt(e), t.head.appendChild(e));
  }
  function Qa(t) {
    return '[src="' + Ee(t) + '"]';
  }
  function Hn(t) {
    return "script[async]" + t;
  }
  function kd(t, e, l) {
    if (e.count++, e.instance === null)
      switch (e.type) {
        case "style":
          var a = t.querySelector(
            'style[data-href~="' + Ee(l.href) + '"]'
          );
          if (a)
            return e.instance = a, Xt(a), a;
          var n = A({}, l, {
            "data-href": l.href,
            "data-precedence": l.precedence,
            href: null,
            precedence: null
          });
          return a = (t.ownerDocument || t).createElement(
            "style"
          ), Xt(a), $t(a, "style", n), Pu(a, l.precedence, t), e.instance = a;
        case "stylesheet":
          n = Xa(l.href);
          var u = t.querySelector(
            Un(n)
          );
          if (u)
            return e.state.loading |= 4, e.instance = u, Xt(u), u;
          a = $d(l), (n = Ne.get(n)) && Hf(a, n), u = (t.ownerDocument || t).createElement("link"), Xt(u);
          var c = u;
          return c._p = new Promise(function(r, v) {
            c.onload = r, c.onerror = v;
          }), $t(u, "link", a), e.state.loading |= 4, Pu(u, l.precedence, t), e.instance = u;
        case "script":
          return u = Qa(l.src), (n = t.querySelector(
            Hn(u)
          )) ? (e.instance = n, Xt(n), n) : (a = l, (n = Ne.get(u)) && (a = A({}, l), Bf(a, n)), t = t.ownerDocument || t, n = t.createElement("script"), Xt(n), $t(n, "link", a), t.head.appendChild(n), e.instance = n);
        case "void":
          return null;
        default:
          throw Error(f(443, e.type));
      }
    else
      e.type === "stylesheet" && (e.state.loading & 4) === 0 && (a = e.instance, e.state.loading |= 4, Pu(a, l.precedence, t));
    return e.instance;
  }
  function Pu(t, e, l) {
    for (var a = l.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), n = a.length ? a[a.length - 1] : null, u = n, c = 0; c < a.length; c++) {
      var r = a[c];
      if (r.dataset.precedence === e) u = r;
      else if (u !== n) break;
    }
    u ? u.parentNode.insertBefore(t, u.nextSibling) : (e = l.nodeType === 9 ? l.head : l, e.insertBefore(t, e.firstChild));
  }
  function Hf(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.title == null && (t.title = e.title);
  }
  function Bf(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.integrity == null && (t.integrity = e.integrity);
  }
  var ti = null;
  function Wd(t, e, l) {
    if (ti === null) {
      var a = /* @__PURE__ */ new Map(), n = ti = /* @__PURE__ */ new Map();
      n.set(l, a);
    } else
      n = ti, a = n.get(l), a || (a = /* @__PURE__ */ new Map(), n.set(l, a));
    if (a.has(t)) return a;
    for (a.set(t, null), l = l.getElementsByTagName(t), n = 0; n < l.length; n++) {
      var u = l[n];
      if (!(u[Wa] || u[Vt] || t === "link" && u.getAttribute("rel") === "stylesheet") && u.namespaceURI !== "http://www.w3.org/2000/svg") {
        var c = u.getAttribute(e) || "";
        c = t + c;
        var r = a.get(c);
        r ? r.push(u) : a.set(c, [u]);
      }
    }
    return a;
  }
  function Fd(t, e, l) {
    t = t.ownerDocument || t, t.head.insertBefore(
      l,
      e === "title" ? t.querySelector("head > title") : null
    );
  }
  function ry(t, e, l) {
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
  function Id(t) {
    return !(t.type === "stylesheet" && (t.state.loading & 3) === 0);
  }
  function oy(t, e, l, a) {
    if (l.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && (l.state.loading & 4) === 0) {
      if (l.instance === null) {
        var n = Xa(a.href), u = e.querySelector(
          Un(n)
        );
        if (u) {
          e = u._p, e !== null && typeof e == "object" && typeof e.then == "function" && (t.count++, t = ei.bind(t), e.then(t, t)), l.state.loading |= 4, l.instance = u, Xt(u);
          return;
        }
        u = e.ownerDocument || e, a = $d(a), (n = Ne.get(n)) && Hf(a, n), u = u.createElement("link"), Xt(u);
        var c = u;
        c._p = new Promise(function(r, v) {
          c.onload = r, c.onerror = v;
        }), $t(u, "link", a), l.instance = u;
      }
      t.stylesheets === null && (t.stylesheets = /* @__PURE__ */ new Map()), t.stylesheets.set(l, e), (e = l.state.preload) && (l.state.loading & 3) === 0 && (t.count++, l = ei.bind(t), e.addEventListener("load", l), e.addEventListener("error", l));
    }
  }
  var qf = 0;
  function dy(t, e) {
    return t.stylesheets && t.count === 0 && ai(t, t.stylesheets), 0 < t.count || 0 < t.imgCount ? function(l) {
      var a = setTimeout(function() {
        if (t.stylesheets && ai(t, t.stylesheets), t.unsuspend) {
          var u = t.unsuspend;
          t.unsuspend = null, u();
        }
      }, 6e4 + e);
      0 < t.imgBytes && qf === 0 && (qf = 62500 * Kv());
      var n = setTimeout(
        function() {
          if (t.waitingForImages = !1, t.count === 0 && (t.stylesheets && ai(t, t.stylesheets), t.unsuspend)) {
            var u = t.unsuspend;
            t.unsuspend = null, u();
          }
        },
        (t.imgBytes > qf ? 50 : 800) + e
      );
      return t.unsuspend = l, function() {
        t.unsuspend = null, clearTimeout(a), clearTimeout(n);
      };
    } : null;
  }
  function ei() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) ai(this, this.stylesheets);
      else if (this.unsuspend) {
        var t = this.unsuspend;
        this.unsuspend = null, t();
      }
    }
  }
  var li = null;
  function ai(t, e) {
    t.stylesheets = null, t.unsuspend !== null && (t.count++, li = /* @__PURE__ */ new Map(), e.forEach(hy, t), li = null, ei.call(t));
  }
  function hy(t, e) {
    if (!(e.state.loading & 4)) {
      var l = li.get(t);
      if (l) var a = l.get(null);
      else {
        l = /* @__PURE__ */ new Map(), li.set(t, l);
        for (var n = t.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), u = 0; u < n.length; u++) {
          var c = n[u];
          (c.nodeName === "LINK" || c.getAttribute("media") !== "not all") && (l.set(c.dataset.precedence, c), a = c);
        }
        a && l.set(null, a);
      }
      n = e.instance, c = n.getAttribute("data-precedence"), u = l.get(c) || a, u === a && l.set(null, n), l.set(c, n), this.count++, a = ei.bind(this), n.addEventListener("load", a), n.addEventListener("error", a), u ? u.parentNode.insertBefore(n, u.nextSibling) : (t = t.nodeType === 9 ? t.head : t, t.insertBefore(n, t.firstChild)), e.state.loading |= 4;
    }
  }
  var Bn = {
    $$typeof: $,
    Provider: null,
    Consumer: null,
    _currentValue: k,
    _currentValue2: k,
    _threadCount: 0
  };
  function my(t, e, l, a, n, u, c, r, v) {
    this.tag = 1, this.containerInfo = t, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Mi(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Mi(0), this.hiddenUpdates = Mi(null), this.identifierPrefix = a, this.onUncaughtError = n, this.onCaughtError = u, this.onRecoverableError = c, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = v, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function Pd(t, e, l, a, n, u, c, r, v, _, N, D) {
    return t = new my(
      t,
      e,
      l,
      c,
      v,
      _,
      N,
      D,
      r
    ), e = 1, u === !0 && (e |= 24), u = de(3, null, null, e), t.current = u, u.stateNode = t, e = vc(), e.refCount++, t.pooledCache = e, e.refCount++, u.memoizedState = {
      element: a,
      isDehydrated: l,
      cache: e
    }, bc(u), t;
  }
  function th(t) {
    return t ? (t = ba, t) : ba;
  }
  function eh(t, e, l, a, n, u) {
    n = th(n), a.context === null ? a.context = n : a.pendingContext = n, a = bl(e), a.payload = { element: l }, u = u === void 0 ? null : u, u !== null && (a.callback = u), l = Sl(t, a, e), l !== null && (ce(l, t, e), mn(l, t, e));
  }
  function lh(t, e) {
    if (t = t.memoizedState, t !== null && t.dehydrated !== null) {
      var l = t.retryLane;
      t.retryLane = l !== 0 && l < e ? l : e;
    }
  }
  function Lf(t, e) {
    lh(t, e), (t = t.alternate) && lh(t, e);
  }
  function ah(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = Zl(t, 67108864);
      e !== null && ce(e, t, 67108864), Lf(t, 67108864);
    }
  }
  function nh(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = pe();
      e = Ci(e);
      var l = Zl(t, e);
      l !== null && ce(l, t, e), Lf(t, e);
    }
  }
  var ni = !0;
  function vy(t, e, l, a) {
    var n = M.T;
    M.T = null;
    var u = q.p;
    try {
      q.p = 2, Yf(t, e, l, a);
    } finally {
      q.p = u, M.T = n;
    }
  }
  function yy(t, e, l, a) {
    var n = M.T;
    M.T = null;
    var u = q.p;
    try {
      q.p = 8, Yf(t, e, l, a);
    } finally {
      q.p = u, M.T = n;
    }
  }
  function Yf(t, e, l, a) {
    if (ni) {
      var n = Gf(a);
      if (n === null)
        zf(
          t,
          e,
          a,
          ui,
          l
        ), ih(t, a);
      else if (gy(
        n,
        t,
        e,
        l,
        a
      ))
        a.stopPropagation();
      else if (ih(t, a), e & 4 && -1 < py.indexOf(t)) {
        for (; n !== null; ) {
          var u = fa(n);
          if (u !== null)
            switch (u.tag) {
              case 3:
                if (u = u.stateNode, u.current.memoizedState.isDehydrated) {
                  var c = Ll(u.pendingLanes);
                  if (c !== 0) {
                    var r = u;
                    for (r.pendingLanes |= 2, r.entangledLanes |= 2; c; ) {
                      var v = 1 << 31 - re(c);
                      r.entanglements[1] |= v, c &= ~v;
                    }
                    Qe(u), (rt & 6) === 0 && (Xu = fe() + 500, Nn(0));
                  }
                }
                break;
              case 31:
              case 13:
                r = Zl(u, 2), r !== null && ce(r, u, 2), Zu(), Lf(u, 2);
            }
          if (u = Gf(a), u === null && zf(
            t,
            e,
            a,
            ui,
            l
          ), u === n) break;
          n = u;
        }
        n !== null && a.stopPropagation();
      } else
        zf(
          t,
          e,
          a,
          null,
          l
        );
    }
  }
  function Gf(t) {
    return t = Xi(t), Xf(t);
  }
  var ui = null;
  function Xf(t) {
    if (ui = null, t = ca(t), t !== null) {
      var e = m(t);
      if (e === null) t = null;
      else {
        var l = e.tag;
        if (l === 13) {
          if (t = S(e), t !== null) return t;
          t = null;
        } else if (l === 31) {
          if (t = T(e), t !== null) return t;
          t = null;
        } else if (l === 3) {
          if (e.stateNode.current.memoizedState.isDehydrated)
            return e.tag === 3 ? e.stateNode.containerInfo : null;
          t = null;
        } else e !== t && (t = null);
      }
    }
    return ui = t, null;
  }
  function uh(t) {
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
        switch (lm()) {
          case ds:
            return 2;
          case hs:
            return 8;
          case $n:
          case am:
            return 32;
          case ms:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Qf = !1, Ml = null, Cl = null, Dl = null, qn = /* @__PURE__ */ new Map(), Ln = /* @__PURE__ */ new Map(), Ul = [], py = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function ih(t, e) {
    switch (t) {
      case "focusin":
      case "focusout":
        Ml = null;
        break;
      case "dragenter":
      case "dragleave":
        Cl = null;
        break;
      case "mouseover":
      case "mouseout":
        Dl = null;
        break;
      case "pointerover":
      case "pointerout":
        qn.delete(e.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Ln.delete(e.pointerId);
    }
  }
  function Yn(t, e, l, a, n, u) {
    return t === null || t.nativeEvent !== u ? (t = {
      blockedOn: e,
      domEventName: l,
      eventSystemFlags: a,
      nativeEvent: u,
      targetContainers: [n]
    }, e !== null && (e = fa(e), e !== null && ah(e)), t) : (t.eventSystemFlags |= a, e = t.targetContainers, n !== null && e.indexOf(n) === -1 && e.push(n), t);
  }
  function gy(t, e, l, a, n) {
    switch (e) {
      case "focusin":
        return Ml = Yn(
          Ml,
          t,
          e,
          l,
          a,
          n
        ), !0;
      case "dragenter":
        return Cl = Yn(
          Cl,
          t,
          e,
          l,
          a,
          n
        ), !0;
      case "mouseover":
        return Dl = Yn(
          Dl,
          t,
          e,
          l,
          a,
          n
        ), !0;
      case "pointerover":
        var u = n.pointerId;
        return qn.set(
          u,
          Yn(
            qn.get(u) || null,
            t,
            e,
            l,
            a,
            n
          )
        ), !0;
      case "gotpointercapture":
        return u = n.pointerId, Ln.set(
          u,
          Yn(
            Ln.get(u) || null,
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
  function ch(t) {
    var e = ca(t.target);
    if (e !== null) {
      var l = m(e);
      if (l !== null) {
        if (e = l.tag, e === 13) {
          if (e = S(l), e !== null) {
            t.blockedOn = e, Ss(t.priority, function() {
              nh(l);
            });
            return;
          }
        } else if (e === 31) {
          if (e = T(l), e !== null) {
            t.blockedOn = e, Ss(t.priority, function() {
              nh(l);
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
  function ii(t) {
    if (t.blockedOn !== null) return !1;
    for (var e = t.targetContainers; 0 < e.length; ) {
      var l = Gf(t.nativeEvent);
      if (l === null) {
        l = t.nativeEvent;
        var a = new l.constructor(
          l.type,
          l
        );
        Gi = a, l.target.dispatchEvent(a), Gi = null;
      } else
        return e = fa(l), e !== null && ah(e), t.blockedOn = l, !1;
      e.shift();
    }
    return !0;
  }
  function fh(t, e, l) {
    ii(t) && l.delete(e);
  }
  function by() {
    Qf = !1, Ml !== null && ii(Ml) && (Ml = null), Cl !== null && ii(Cl) && (Cl = null), Dl !== null && ii(Dl) && (Dl = null), qn.forEach(fh), Ln.forEach(fh);
  }
  function ci(t, e) {
    t.blockedOn === e && (t.blockedOn = null, Qf || (Qf = !0, i.unstable_scheduleCallback(
      i.unstable_NormalPriority,
      by
    )));
  }
  var fi = null;
  function sh(t) {
    fi !== t && (fi = t, i.unstable_scheduleCallback(
      i.unstable_NormalPriority,
      function() {
        fi === t && (fi = null);
        for (var e = 0; e < t.length; e += 3) {
          var l = t[e], a = t[e + 1], n = t[e + 2];
          if (typeof a != "function") {
            if (Xf(a || l) === null)
              continue;
            break;
          }
          var u = fa(l);
          u !== null && (t.splice(e, 3), e -= 3, Yc(
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
  function Za(t) {
    function e(v) {
      return ci(v, t);
    }
    Ml !== null && ci(Ml, t), Cl !== null && ci(Cl, t), Dl !== null && ci(Dl, t), qn.forEach(e), Ln.forEach(e);
    for (var l = 0; l < Ul.length; l++) {
      var a = Ul[l];
      a.blockedOn === t && (a.blockedOn = null);
    }
    for (; 0 < Ul.length && (l = Ul[0], l.blockedOn === null); )
      ch(l), l.blockedOn === null && Ul.shift();
    if (l = (t.ownerDocument || t).$$reactFormReplay, l != null)
      for (a = 0; a < l.length; a += 3) {
        var n = l[a], u = l[a + 1], c = n[ee] || null;
        if (typeof u == "function")
          c || sh(l);
        else if (c) {
          var r = null;
          if (u && u.hasAttribute("formAction")) {
            if (n = u, c = u[ee] || null)
              r = c.formAction;
            else if (Xf(n) !== null) continue;
          } else r = c.action;
          typeof r == "function" ? l[a + 1] = r : (l.splice(a, 3), a -= 3), sh(l);
        }
      }
  }
  function rh() {
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
  function Zf(t) {
    this._internalRoot = t;
  }
  si.prototype.render = Zf.prototype.render = function(t) {
    var e = this._internalRoot;
    if (e === null) throw Error(f(409));
    var l = e.current, a = pe();
    eh(l, a, t, e, null, null);
  }, si.prototype.unmount = Zf.prototype.unmount = function() {
    var t = this._internalRoot;
    if (t !== null) {
      this._internalRoot = null;
      var e = t.containerInfo;
      eh(t.current, 2, null, t, null, null), Zu(), e[ia] = null;
    }
  };
  function si(t) {
    this._internalRoot = t;
  }
  si.prototype.unstable_scheduleHydration = function(t) {
    if (t) {
      var e = bs();
      t = { blockedOn: null, target: t, priority: e };
      for (var l = 0; l < Ul.length && e !== 0 && e < Ul[l].priority; l++) ;
      Ul.splice(l, 0, t), l === 0 && ch(t);
    }
  };
  var oh = s.version;
  if (oh !== "19.2.8")
    throw Error(
      f(
        527,
        oh,
        "19.2.8"
      )
    );
  q.findDOMNode = function(t) {
    var e = t._reactInternals;
    if (e === void 0)
      throw typeof t.render == "function" ? Error(f(188)) : (t = Object.keys(t).join(","), Error(f(268, t)));
    return t = y(e), t = t !== null ? O(t) : null, t = t === null ? null : t.stateNode, t;
  };
  var Sy = {
    bundleType: 0,
    version: "19.2.8",
    rendererPackageName: "react-dom",
    currentDispatcherRef: M,
    reconcilerVersion: "19.2.8"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var ri = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!ri.isDisabled && ri.supportsFiber)
      try {
        Ja = ri.inject(
          Sy
        ), se = ri;
      } catch {
      }
  }
  return Xn.createRoot = function(t, e) {
    if (!h(t)) throw Error(f(299));
    var l = !1, a = "", n = go, u = bo, c = So;
    return e != null && (e.unstable_strictMode === !0 && (l = !0), e.identifierPrefix !== void 0 && (a = e.identifierPrefix), e.onUncaughtError !== void 0 && (n = e.onUncaughtError), e.onCaughtError !== void 0 && (u = e.onCaughtError), e.onRecoverableError !== void 0 && (c = e.onRecoverableError)), e = Pd(
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
      rh
    ), t[ia] = e.current, Tf(t), new Zf(e);
  }, Xn.hydrateRoot = function(t, e, l) {
    if (!h(t)) throw Error(f(299));
    var a = !1, n = "", u = go, c = bo, r = So, v = null;
    return l != null && (l.unstable_strictMode === !0 && (a = !0), l.identifierPrefix !== void 0 && (n = l.identifierPrefix), l.onUncaughtError !== void 0 && (u = l.onUncaughtError), l.onCaughtError !== void 0 && (c = l.onCaughtError), l.onRecoverableError !== void 0 && (r = l.onRecoverableError), l.formState !== void 0 && (v = l.formState)), e = Pd(
      t,
      1,
      !0,
      e,
      l ?? null,
      a,
      n,
      v,
      u,
      c,
      r,
      rh
    ), e.context = th(null), l = e.current, a = pe(), a = Ci(a), n = bl(a), n.callback = null, Sl(l, n, a), l = a, e.current.lanes = l, ka(e, l), Qe(e), t[ia] = e.current, Tf(t), new si(e);
  }, Xn.version = "19.2.8", Xn;
}
var xh;
function Cy() {
  if (xh) return Kf.exports;
  xh = 1;
  function i() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i);
      } catch (s) {
        console.error(s);
      }
  }
  return i(), Kf.exports = My(), Kf.exports;
}
var Dy = Cy();
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
var ls = /^(?:[a-z][a-z0-9+.-]*:|[\\/]{2})/i, Nh = /^[\\/]{2}/;
function Uy(i, s) {
  return s + i.replace(/\\/g, "/");
}
var Eh = "popstate";
function _h(i) {
  return typeof i == "object" && i != null && "pathname" in i && "search" in i && "hash" in i && "state" in i && "key" in i;
}
function Hy(i = {}) {
  function s(h, m) {
    let {
      pathname: S = "/",
      search: T = "",
      hash: b = ""
    } = ua(h.location.hash.substring(1));
    return !S.startsWith("/") && !S.startsWith(".") && (S = "/" + S), Pf(
      "",
      { pathname: S, search: T, hash: b },
      // state defaults to `null` because `window.history.state` does
      m.state && m.state.usr || null,
      m.state && m.state.key || "default"
    );
  }
  function o(h, m) {
    let S = h.document.querySelector("base"), T = "";
    if (S && S.getAttribute("href")) {
      let b = h.location.href, y = b.indexOf("#");
      T = y === -1 ? b : b.slice(0, y);
    }
    return T + "#" + (typeof m == "string" ? m : Vn(m));
  }
  function f(h, m) {
    Me(
      h.pathname.charAt(0) === "/",
      `relative pathnames are not supported in hash history.push(${JSON.stringify(
        m
      )})`
    );
  }
  return qy(
    s,
    o,
    f,
    i
  );
}
function At(i, s) {
  if (i === !1 || i === null || typeof i > "u")
    throw new Error(s);
}
function Me(i, s) {
  if (!i) {
    typeof console < "u" && console.warn(s);
    try {
      throw new Error(s);
    } catch {
    }
  }
}
function By() {
  return Math.random().toString(36).substring(2, 10);
}
function Th(i, s) {
  return {
    usr: i.state,
    key: i.key,
    idx: s,
    masked: i.mask ? {
      pathname: i.pathname,
      search: i.search,
      hash: i.hash
    } : void 0
  };
}
function Pf(i, s, o = null, f, h) {
  return {
    pathname: typeof i == "string" ? i : i.pathname,
    search: "",
    hash: "",
    ...typeof s == "string" ? ua(s) : s,
    state: o,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: s && s.key || f || By(),
    mask: h
  };
}
function Vn({
  pathname: i = "/",
  search: s = "",
  hash: o = ""
}) {
  return s && s !== "?" && (i += s.charAt(0) === "?" ? s : "?" + s), o && o !== "#" && (i += o.charAt(0) === "#" ? o : "#" + o), i;
}
function ua(i) {
  let s = {};
  if (i) {
    let o = i.indexOf("#");
    o >= 0 && (s.hash = i.substring(o), i = i.substring(0, o));
    let f = i.indexOf("?");
    f >= 0 && (s.search = i.substring(f), i = i.substring(0, f)), i && (s.pathname = i);
  }
  return s;
}
function qy(i, s, o, f = {}) {
  let { window: h = document.defaultView, v5Compat: m = !1 } = f, S = h.history, T = "POP", b = null, y = O();
  y == null && (y = 0, S.replaceState({ ...S.state, idx: y }, ""));
  function O() {
    return (S.state || { idx: null }).idx;
  }
  function A() {
    T = "POP";
    let H = O(), K = H == null ? null : H - y;
    y = H, b && b({ action: T, location: Y.location, delta: K });
  }
  function B(H, K) {
    T = "PUSH";
    let W = _h(H) ? H : Pf(Y.location, H, K);
    o && o(W, H), y = O() + 1;
    let $ = Th(W, y), dt = Y.createHref(W.mask || W);
    try {
      S.pushState($, "", dt);
    } catch (bt) {
      if (bt instanceof DOMException && bt.name === "DataCloneError")
        throw bt;
      h.location.assign(dt);
    }
    m && b && b({ action: T, location: Y.location, delta: 1 });
  }
  function Z(H, K) {
    T = "REPLACE";
    let W = _h(H) ? H : Pf(Y.location, H, K);
    o && o(W, H), y = O();
    let $ = Th(W, y), dt = Y.createHref(W.mask || W);
    S.replaceState($, "", dt), m && b && b({ action: T, location: Y.location, delta: 0 });
  }
  function V(H) {
    return Ly(h, H);
  }
  let Y = {
    get action() {
      return T;
    },
    get location() {
      return i(h, S);
    },
    listen(H) {
      if (b)
        throw new Error("A history only accepts one active listener");
      return h.addEventListener(Eh, A), b = H, () => {
        h.removeEventListener(Eh, A), b = null;
      };
    },
    createHref(H) {
      return s(h, H);
    },
    createURL: V,
    encodeLocation(H) {
      let K = V(H);
      return {
        pathname: K.pathname,
        search: K.search,
        hash: K.hash
      };
    },
    push: B,
    replace: Z,
    go(H) {
      return S.go(H);
    }
  };
  return Y;
}
function Ly(i, s, o = !1) {
  let f = "http://localhost";
  i && (f = i.location.origin !== "null" ? i.location.origin : i.location.href), At(f, "No window.location.(origin|href) available to create URL");
  let h = typeof s == "string" ? s : Vn(s);
  return h = h.replace(/ $/, "%20"), !o && Nh.test(h) && (h = f + h), new URL(h, f);
}
function Mh(i, s, o = "/") {
  return Yy(i, s, o, !1);
}
function Yy(i, s, o, f, h) {
  let m = typeof s == "string" ? ua(s) : s, S = rl(m.pathname || "/", o);
  if (S == null)
    return null;
  let T = Gy(i), b = null, y = Fy(S);
  for (let O = 0; b == null && O < T.length; ++O)
    b = Wy(
      T[O],
      y,
      f
    );
  return b;
}
function Gy(i) {
  let s = Ch(i);
  return Xy(s), s;
}
function Ch(i, s = [], o = [], f = "", h = !1) {
  let m = (S, T, b = h, y) => {
    let O = {
      relativePath: y === void 0 ? S.path || "" : y,
      caseSensitive: S.caseSensitive === !0,
      childrenIndex: T,
      route: S
    };
    if (O.relativePath.startsWith("/")) {
      if (!O.relativePath.startsWith(f) && b)
        return;
      At(
        O.relativePath.startsWith(f),
        `Absolute route path "${O.relativePath}" nested under path "${f}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
      ), O.relativePath = O.relativePath.slice(f.length);
    }
    let A = He([f, O.relativePath]), B = o.concat(O);
    S.children && S.children.length > 0 && (At(
      // Our types know better, but runtime JS may not!
      // @ts-expect-error
      S.index !== !0,
      `Index routes must not have child routes. Please remove all child routes from route path "${A}".`
    ), Ch(
      S.children,
      s,
      B,
      A,
      b
    )), !(S.path == null && !S.index) && s.push({
      path: A,
      score: $y(A, S.index),
      routesMeta: B.map((Z, V) => {
        let [Y, H] = Hh(
          Z.relativePath,
          Z.caseSensitive,
          V === B.length - 1
        );
        return {
          ...Z,
          matcher: Y,
          compiledParams: H
        };
      })
    });
  };
  return i.forEach((S, T) => {
    if (S.path === "" || !S.path?.includes("?"))
      m(S, T);
    else
      for (let b of Dh(S.path))
        m(S, T, !0, b);
  }), s;
}
function Dh(i) {
  let s = i.split("/");
  if (s.length === 0) return [];
  let [o, ...f] = s, h = o.endsWith("?"), m = o.replace(/\?$/, "");
  if (f.length === 0)
    return h ? [m, ""] : [m];
  let S = Dh(f.join("/")), T = [];
  return T.push(
    ...S.map(
      (b) => b === "" ? m : [m, b].join("/")
    )
  ), h && T.push(...S), T.map(
    (b) => i.startsWith("/") && b === "" ? "/" : b
  );
}
function Xy(i) {
  i.sort(
    (s, o) => s.score !== o.score ? o.score - s.score : ky(
      s.routesMeta.map((f) => f.childrenIndex),
      o.routesMeta.map((f) => f.childrenIndex)
    )
  );
}
var Qy = /^:[\w-]+$/, Zy = 3, Vy = 2, wy = 1, Ky = 10, Jy = -2, zh = (i) => i === "*";
function $y(i, s) {
  let o = i.split("/"), f = o.length;
  return o.some(zh) && (f += Jy), s && (f += Vy), o.filter((h) => !zh(h)).reduce(
    (h, m) => h + (Qy.test(m) ? Zy : m === "" ? wy : Ky),
    f
  );
}
function ky(i, s) {
  return i.length === s.length && i.slice(0, -1).every((f, h) => f === s[h]) ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    i[i.length - 1] - s[s.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function Wy(i, s, o = !1) {
  let { routesMeta: f } = i, h = {}, m = "/", S = [];
  for (let T = 0; T < f.length; ++T) {
    let b = f[T], y = T === f.length - 1, O = m === "/" ? s : s.slice(m.length) || "/", A = {
      path: b.relativePath,
      caseSensitive: b.caseSensitive,
      end: y
    }, B = (
      // Use precomputed matcher if it exists
      b.matcher && b.compiledParams ? Uh(
        A,
        O,
        b.matcher,
        b.compiledParams
      ) : gi(A, O)
    ), Z = b.route;
    if (!B && y && o && !f[f.length - 1].route.index && (B = gi(
      {
        path: b.relativePath,
        caseSensitive: b.caseSensitive,
        end: !1
      },
      O
    )), !B)
      return null;
    Object.assign(h, B.params), S.push({
      // TODO: Can this as be avoided?
      params: h,
      pathname: He([m, B.pathname]),
      pathnameBase: t0(
        He([m, B.pathnameBase])
      ),
      route: Z
    }), B.pathnameBase !== "/" && (m = He([m, B.pathnameBase]));
  }
  return S;
}
function gi(i, s) {
  typeof i == "string" && (i = { path: i, caseSensitive: !1, end: !0 });
  let [o, f] = Hh(
    i.path,
    i.caseSensitive,
    i.end
  );
  return Uh(i, s, o, f);
}
function Uh(i, s, o, f) {
  let h = s.match(o);
  if (!h) return null;
  let m = h[0], S = m.replace(/(.)\/+$/, "$1"), T = h.slice(1);
  return {
    params: f.reduce(
      (y, { paramName: O, isOptional: A }, B) => {
        if (O === "*") {
          let V = T[B] || "";
          S = m.slice(0, m.length - V.length).replace(/(.)\/+$/, "$1");
        }
        const Z = T[B];
        return A && !Z ? y[O] = void 0 : y[O] = (Z || "").replace(/%2F/g, "/"), y;
      },
      {}
    ),
    pathname: m,
    pathnameBase: S,
    pattern: i
  };
}
function Hh(i, s = !1, o = !0) {
  Me(
    i === "*" || !i.endsWith("*") || i.endsWith("/*"),
    `Route path "${i}" will be treated as if it were "${i.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${i.replace(/\*$/, "/*")}".`
  );
  let f = [], h = "^" + i.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(
    /\/:([\w-]+)(\?)?/g,
    (S, T, b, y, O) => {
      if (f.push({ paramName: T, isOptional: b != null }), b) {
        let A = O.charAt(y + S.length);
        return A && A !== "/" ? "/([^\\/]*)" : "(?:/([^\\/]*))?";
      }
      return "/([^\\/]+)";
    }
  ).replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
  return i.endsWith("*") ? (f.push({ paramName: "*" }), h += i === "*" || i === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$") : o ? h += "\\/*$" : i !== "" && i !== "/" && (h += "(?:(?=\\/|$))"), [new RegExp(h, s ? void 0 : "i"), f];
}
function Fy(i) {
  try {
    return i.split("/").map((s) => decodeURIComponent(s).replace(/\//g, "%2F")).join("/");
  } catch (s) {
    return Me(
      !1,
      `The URL path "${i}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${s}).`
    ), i;
  }
}
function rl(i, s) {
  if (s === "/") return i;
  if (!i.toLowerCase().startsWith(s.toLowerCase()))
    return null;
  let o = s.endsWith("/") ? s.length - 1 : s.length, f = i.charAt(o);
  return f && f !== "/" ? null : i.slice(o) || "/";
}
function Iy(i, s = "/") {
  let {
    pathname: o,
    search: f = "",
    hash: h = ""
  } = typeof i == "string" ? ua(i) : i, m;
  return o ? (o = Bh(o), o.startsWith("/") ? m = Ah(o.substring(1), "/") : m = Ah(o, s)) : m = s, {
    pathname: m,
    search: e0(f),
    hash: l0(h)
  };
}
function Ah(i, s) {
  let o = bi(s).split("/");
  return i.split("/").forEach((h) => {
    h === ".." ? o.length > 1 && o.pop() : h !== "." && o.push(h);
  }), o.length > 1 ? o.join("/") : "/";
}
function Wf(i, s, o, f) {
  return `Cannot include a '${i}' character in a manually specified \`to.${s}\` field [${JSON.stringify(
    f
  )}].  Please separate it out to the \`to.${o}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function Py(i) {
  return i.filter(
    (s, o) => o === 0 || s.route.path && s.route.path.length > 0
  );
}
function as(i) {
  let s = Py(i);
  return s.map(
    (o, f) => f === s.length - 1 ? o.pathname : o.pathnameBase
  );
}
function Si(i, s, o, f = !1) {
  let h;
  typeof i == "string" ? h = ua(i) : (h = { ...i }, At(
    !h.pathname || !h.pathname.includes("?"),
    Wf("?", "pathname", "search", h)
  ), At(
    !h.pathname || !h.pathname.includes("#"),
    Wf("#", "pathname", "hash", h)
  ), At(
    !h.search || !h.search.includes("#"),
    Wf("#", "search", "hash", h)
  ));
  let m = i === "" || h.pathname === "", S = m ? "/" : h.pathname, T;
  if (S == null)
    T = o;
  else {
    let A = s.length - 1;
    if (!f && S.startsWith("..")) {
      let B = S.split("/");
      for (; B[0] === ".."; )
        B.shift(), A -= 1;
      h.pathname = B.join("/");
    }
    T = A >= 0 ? s[A] : "/";
  }
  let b = Iy(h, T), y = S && S !== "/" && S.endsWith("/"), O = (m || S === ".") && o.endsWith("/");
  return !b.pathname.endsWith("/") && (y || O) && (b.pathname += "/"), b;
}
var Bh = (i) => i.replace(/[\\/]{2,}/g, "/"), He = (i) => Bh(i.join("/")), bi = (i) => i.replace(/\/+$/, ""), t0 = (i) => bi(i).replace(/^\/*/, "/"), e0 = (i) => !i || i === "?" ? "" : i.startsWith("?") ? i : "?" + i, l0 = (i) => !i || i === "#" ? "" : i.startsWith("#") ? i : "#" + i, a0 = class {
  constructor(i, s, o, f = !1) {
    this.status = i, this.statusText = s || "", this.internal = f, o instanceof Error ? (this.data = o.toString(), this.error = o) : this.data = o;
  }
};
function n0(i) {
  return i != null && typeof i.status == "number" && typeof i.statusText == "string" && typeof i.internal == "boolean" && "data" in i;
}
function u0(i) {
  let s = i.map((o) => o.route.path).filter(Boolean);
  return He(s) || "/";
}
var qh = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
function Lh(i, s) {
  let o = i;
  if (typeof o != "string" || !ls.test(o))
    return {
      absoluteURL: void 0,
      isExternal: !1,
      to: o
    };
  let f = o, h = !1;
  if (qh)
    try {
      let m = new URL(window.location.href), S = Nh.test(o) ? new URL(Uy(o, m.protocol)) : new URL(o), T = rl(S.pathname, s);
      S.origin === m.origin && T != null ? o = T + S.search + S.hash : h = !0;
    } catch {
      Me(
        !1,
        `<Link to="${o}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`
      );
    }
  return {
    absoluteURL: f,
    isExternal: h,
    to: o
  };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
var Yh = [
  "POST",
  "PUT",
  "PATCH",
  "DELETE"
];
new Set(
  Yh
);
var i0 = [
  "GET",
  ...Yh
];
new Set(i0);
var c0 = [
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
function f0(i) {
  try {
    return c0.includes(new URL(i).protocol);
  } catch {
    return !1;
  }
}
var Va = j.createContext(null);
Va.displayName = "DataRouter";
var xi = j.createContext(null);
xi.displayName = "DataRouterState";
var Gh = j.createContext(!1);
function s0() {
  return j.useContext(Gh);
}
var Xh = j.createContext({
  isTransitioning: !1
});
Xh.displayName = "ViewTransition";
var r0 = j.createContext(
  /* @__PURE__ */ new Map()
);
r0.displayName = "Fetchers";
var o0 = j.createContext(null);
o0.displayName = "Await";
var ge = j.createContext(
  null
);
ge.displayName = "Navigation";
var wn = j.createContext(
  null
);
wn.displayName = "Location";
var Ze = j.createContext({
  outlet: null,
  matches: [],
  isDataRoute: !1
});
Ze.displayName = "Route";
var ns = j.createContext(null);
ns.displayName = "RouteError";
var Qh = "REACT_ROUTER_ERROR", d0 = "REDIRECT", h0 = "ROUTE_ERROR_RESPONSE";
function m0(i) {
  if (i.startsWith(`${Qh}:${d0}:{`))
    try {
      let s = JSON.parse(i.slice(28));
      if (typeof s == "object" && s && typeof s.status == "number" && typeof s.statusText == "string" && typeof s.location == "string" && typeof s.reloadDocument == "boolean" && typeof s.replace == "boolean")
        return s;
    } catch {
    }
}
function v0(i) {
  if (i.startsWith(
    `${Qh}:${h0}:{`
  ))
    try {
      let s = JSON.parse(i.slice(40));
      if (typeof s == "object" && s && typeof s.status == "number" && typeof s.statusText == "string")
        return new a0(
          s.status,
          s.statusText,
          s.data
        );
    } catch {
    }
}
function y0(i, { relative: s } = {}) {
  At(
    wa(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useHref() may be used only in the context of a <Router> component."
  );
  let { basename: o, navigator: f } = j.useContext(ge), { hash: h, pathname: m, search: S } = Kn(i, { relative: s }), T = m;
  return o !== "/" && (T = m === "/" ? o : He([o, m])), f.createHref({ pathname: T, search: S, hash: h });
}
function wa() {
  return j.useContext(wn) != null;
}
function Be() {
  return At(
    wa(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useLocation() may be used only in the context of a <Router> component."
  ), j.useContext(wn).location;
}
var Zh = "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function Vh(i) {
  j.useContext(ge).static || j.useLayoutEffect(i);
}
function wh() {
  let { isDataRoute: i } = j.useContext(Ze);
  return i ? O0() : p0();
}
function p0() {
  At(
    wa(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useNavigate() may be used only in the context of a <Router> component."
  );
  let i = j.useContext(Va), { basename: s, navigator: o } = j.useContext(ge), { matches: f } = j.useContext(Ze), { pathname: h } = Be(), m = JSON.stringify(as(f)), S = j.useRef(!1);
  return Vh(() => {
    S.current = !0;
  }), j.useCallback(
    (b, y = {}) => {
      if (Me(S.current, Zh), !S.current) return;
      if (typeof b == "number") {
        o.go(b);
        return;
      }
      let O = Si(
        b,
        JSON.parse(m),
        h,
        y.relative === "path"
      );
      i == null && s !== "/" && (O.pathname = O.pathname === "/" ? s : He([s, O.pathname])), (y.replace ? o.replace : o.push)(
        O,
        y.state,
        y
      );
    },
    [
      s,
      o,
      m,
      h,
      i
    ]
  );
}
j.createContext(null);
function Kn(i, { relative: s } = {}) {
  let { matches: o } = j.useContext(Ze), { pathname: f } = Be(), h = JSON.stringify(as(o));
  return j.useMemo(
    () => Si(
      i,
      JSON.parse(h),
      f,
      s === "path"
    ),
    [i, h, f, s]
  );
}
function g0(i, s) {
  return Kh(i, s);
}
function Kh(i, s, o) {
  At(
    wa(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useRoutes() may be used only in the context of a <Router> component."
  );
  let { navigator: f } = j.useContext(ge), { matches: h } = j.useContext(Ze), m = h[h.length - 1], S = m ? m.params : {}, T = m ? m.pathname : "/", b = m ? m.pathnameBase : "/", y = m && m.route;
  {
    let H = y && y.path || "";
    $h(
      T,
      !y || H.endsWith("*") || H.endsWith("*?"),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${T}" (under <Route path="${H}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${H}"> to <Route path="${H === "/" ? "*" : `${H}/*`}">.`
    );
  }
  let O = Be(), A;
  if (s) {
    let H = typeof s == "string" ? ua(s) : s;
    At(
      b === "/" || H.pathname?.startsWith(b),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${b}" but pathname "${H.pathname}" was given in the \`location\` prop.`
    ), A = H;
  } else
    A = O;
  let B = A.pathname || "/", Z = B;
  if (b !== "/") {
    let H = b.replace(/^\//, "").split("/");
    Z = "/" + B.replace(/^\//, "").split("/").slice(H.length).join("/");
  }
  let V = o && o.state.matches.length ? (
    // If we're in a data router, use the matches we've already identified but ensure
    // we have the latest route instances from the manifest in case elements have changed
    o.state.matches.map(
      (H) => Object.assign(H, {
        route: o.manifest[H.route.id] || H.route
      })
    )
  ) : Mh(i, { pathname: Z });
  Me(
    y || V != null,
    `No routes matched location "${A.pathname}${A.search}${A.hash}" `
  ), Me(
    V == null || V[V.length - 1].route.element !== void 0 || V[V.length - 1].route.Component !== void 0 || V[V.length - 1].route.lazy !== void 0,
    `Matched leaf route at location "${A.pathname}${A.search}${A.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`
  );
  let Y = _0(
    V && V.map(
      (H) => Object.assign({}, H, {
        params: Object.assign({}, S, H.params),
        pathname: He([
          b,
          // Re-encode pathnames that were decoded inside matchRoutes.
          // Pre-encode `%`, `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          f.encodeLocation ? f.encodeLocation(
            H.pathname.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : H.pathname
        ]),
        pathnameBase: H.pathnameBase === "/" ? b : He([
          b,
          // Re-encode pathnames that were decoded inside matchRoutes
          // Pre-encode `%`, `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          f.encodeLocation ? f.encodeLocation(
            H.pathnameBase.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : H.pathnameBase
        ])
      })
    ),
    h,
    o
  );
  return s && Y ? /* @__PURE__ */ j.createElement(
    wn.Provider,
    {
      value: {
        location: {
          pathname: "/",
          search: "",
          hash: "",
          state: null,
          key: "default",
          mask: void 0,
          ...A
        },
        navigationType: "POP"
        /* Pop */
      }
    },
    Y
  ) : Y;
}
function b0() {
  let i = j0(), s = n0(i) ? `${i.status} ${i.statusText}` : i instanceof Error ? i.message : JSON.stringify(i), o = i instanceof Error ? i.stack : null, f = "rgba(200,200,200, 0.5)", h = { padding: "0.5rem", backgroundColor: f }, m = { padding: "2px 4px", backgroundColor: f }, S = null;
  return console.error(
    "Error handled by React Router default ErrorBoundary:",
    i
  ), S = /* @__PURE__ */ j.createElement(j.Fragment, null, /* @__PURE__ */ j.createElement("p", null, "💿 Hey developer 👋"), /* @__PURE__ */ j.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /* @__PURE__ */ j.createElement("code", { style: m }, "ErrorBoundary"), " or", " ", /* @__PURE__ */ j.createElement("code", { style: m }, "errorElement"), " prop on your route.")), /* @__PURE__ */ j.createElement(j.Fragment, null, /* @__PURE__ */ j.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ j.createElement("h3", { style: { fontStyle: "italic" } }, s), o ? /* @__PURE__ */ j.createElement("pre", { style: h }, o) : null, S);
}
var S0 = /* @__PURE__ */ j.createElement(b0, null), Jh = class extends j.Component {
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
  static getDerivedStateFromProps(i, s) {
    return s.location !== i.location || s.revalidation !== "idle" && i.revalidation === "idle" ? {
      error: i.error,
      location: i.location,
      revalidation: i.revalidation
    } : {
      error: i.error !== void 0 ? i.error : s.error,
      location: s.location,
      revalidation: i.revalidation || s.revalidation
    };
  }
  componentDidCatch(i, s) {
    this.props.onError ? this.props.onError(i, s) : console.error(
      "React Router caught the following error during render",
      i
    );
  }
  render() {
    let i = this.state.error;
    if (this.context && typeof i == "object" && i && "digest" in i && typeof i.digest == "string") {
      const o = v0(i.digest);
      o && (i = o);
    }
    let s = i !== void 0 ? /* @__PURE__ */ j.createElement(Ze.Provider, { value: this.props.routeContext }, /* @__PURE__ */ j.createElement(
      ns.Provider,
      {
        value: i,
        children: this.props.component
      }
    )) : this.props.children;
    return this.context ? /* @__PURE__ */ j.createElement(x0, { error: i }, s) : s;
  }
};
Jh.contextType = Gh;
var Ff = /* @__PURE__ */ new WeakMap();
function x0({
  children: i,
  error: s
}) {
  let { basename: o } = j.useContext(ge);
  if (typeof s == "object" && s && "digest" in s && typeof s.digest == "string") {
    let f = m0(s.digest);
    if (f) {
      let h = Ff.get(s);
      if (h) throw h;
      let m = Lh(f.location, o), S = m.absoluteURL || m.to;
      if (f0(S))
        throw new Error("Invalid redirect location");
      if (qh && !Ff.get(s))
        if (m.isExternal || f.reloadDocument)
          window.location.href = S;
        else {
          const T = Promise.resolve().then(
            () => window.__reactRouterDataRouter.navigate(m.to, {
              replace: f.replace
            })
          );
          throw Ff.set(s, T), T;
        }
      return /* @__PURE__ */ j.createElement("meta", { httpEquiv: "refresh", content: `0;url=${S}` });
    }
  }
  return i;
}
function E0({ routeContext: i, match: s, children: o }) {
  let f = j.useContext(Va);
  return f && f.static && f.staticContext && (s.route.errorElement || s.route.ErrorBoundary) && (f.staticContext._deepestRenderedBoundaryId = s.route.id), /* @__PURE__ */ j.createElement(Ze.Provider, { value: i }, o);
}
function _0(i, s = [], o) {
  let f = o?.state;
  if (i == null) {
    if (!f)
      return null;
    if (f.errors)
      i = f.matches;
    else if (s.length === 0 && !f.initialized && f.matches.length > 0)
      i = f.matches;
    else
      return null;
  }
  let h = i, m = f?.errors;
  if (m != null) {
    let O = h.findIndex(
      (A) => A.route.id && m?.[A.route.id] !== void 0
    );
    At(
      O >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(
        m
      ).join(",")}`
    ), h = h.slice(
      0,
      Math.min(h.length, O + 1)
    );
  }
  let S = !1, T = -1;
  if (o && f) {
    S = f.renderFallback;
    for (let O = 0; O < h.length; O++) {
      let A = h[O];
      if ((A.route.HydrateFallback || A.route.hydrateFallbackElement) && (T = O), A.route.id) {
        let { loaderData: B, errors: Z } = f, V = A.route.loader && !B.hasOwnProperty(A.route.id) && (!Z || Z[A.route.id] === void 0);
        if (A.route.lazy || V) {
          o.isStatic && (S = !0), T >= 0 ? h = h.slice(0, T + 1) : h = [h[0]];
          break;
        }
      }
    }
  }
  let b = o?.onError, y = f && b ? (O, A) => {
    b(O, {
      location: f.location,
      params: f.matches?.[0]?.params ?? {},
      pattern: u0(f.matches),
      errorInfo: A
    });
  } : void 0;
  return h.reduceRight(
    (O, A, B) => {
      let Z, V = !1, Y = null, H = null;
      f && (Z = m && A.route.id ? m[A.route.id] : void 0, Y = A.route.errorElement || S0, S && (T < 0 && B === 0 ? ($h(
        "route-fallback",
        !1,
        "No `HydrateFallback` element provided to render during initial hydration"
      ), V = !0, H = null) : T === B && (V = !0, H = A.route.hydrateFallbackElement || null)));
      let K = s.concat(h.slice(0, B + 1)), W = () => {
        let $;
        return Z ? $ = Y : V ? $ = H : A.route.Component ? $ = /* @__PURE__ */ j.createElement(A.route.Component, null) : A.route.element ? $ = A.route.element : $ = O, /* @__PURE__ */ j.createElement(
          E0,
          {
            match: A,
            routeContext: {
              outlet: O,
              matches: K,
              isDataRoute: f != null
            },
            children: $
          }
        );
      };
      return f && (A.route.ErrorBoundary || A.route.errorElement || B === 0) ? /* @__PURE__ */ j.createElement(
        Jh,
        {
          location: f.location,
          revalidation: f.revalidation,
          component: Y,
          error: Z,
          children: W(),
          routeContext: { outlet: null, matches: K, isDataRoute: !0 },
          onError: y
        }
      ) : W();
    },
    null
  );
}
function us(i) {
  return `${i} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function T0(i) {
  let s = j.useContext(Va);
  return At(s, us(i)), s;
}
function z0(i) {
  let s = j.useContext(xi);
  return At(s, us(i)), s;
}
function A0(i) {
  let s = j.useContext(Ze);
  return At(s, us(i)), s;
}
function is(i) {
  let s = A0(i), o = s.matches[s.matches.length - 1];
  return At(
    o.route.id,
    `${i} can only be used on routes that contain a unique "id"`
  ), o.route.id;
}
function R0() {
  return is(
    "useRouteId"
    /* UseRouteId */
  );
}
function j0() {
  let i = j.useContext(ns), s = z0(
    "useRouteError"
    /* UseRouteError */
  ), o = is(
    "useRouteError"
    /* UseRouteError */
  );
  return i !== void 0 ? i : s.errors?.[o];
}
function O0() {
  let { router: i } = T0(
    "useNavigate"
    /* UseNavigateStable */
  ), s = is(
    "useNavigate"
    /* UseNavigateStable */
  ), o = j.useRef(!1);
  return Vh(() => {
    o.current = !0;
  }), j.useCallback(
    async (h, m = {}) => {
      Me(o.current, Zh), o.current && (typeof h == "number" ? await i.navigate(h) : await i.navigate(h, { fromRouteId: s, ...m }));
    },
    [i, s]
  );
}
var Rh = {};
function $h(i, s, o) {
  !s && !Rh[i] && (Rh[i] = !0, Me(!1, o));
}
j.memo(N0);
function N0({
  routes: i,
  manifest: s,
  future: o,
  state: f,
  isStatic: h,
  onError: m
}) {
  return Kh(i, void 0, {
    manifest: s,
    state: f,
    isStatic: h,
    onError: m
  });
}
function di({
  to: i,
  replace: s,
  state: o,
  relative: f
}) {
  At(
    wa(),
    // TODO: This error is probably because they somehow have 2 versions of
    // the router loaded. We can help them understand how to avoid that.
    "<Navigate> may be used only in the context of a <Router> component."
  );
  let { static: h } = j.useContext(ge);
  Me(
    !h,
    "<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change."
  );
  let { matches: m } = j.useContext(Ze), { pathname: S } = Be(), T = wh(), b = Si(
    i,
    as(m),
    S,
    f === "path"
  ), y = JSON.stringify(b);
  return j.useEffect(() => {
    T(JSON.parse(y), { replace: s, state: o, relative: f });
  }, [T, y, f, s, o]), null;
}
function Nt(i) {
  At(
    !1,
    "A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>."
  );
}
function M0({
  basename: i = "/",
  children: s = null,
  location: o,
  navigationType: f = "POP",
  navigator: h,
  static: m = !1,
  useTransitions: S
}) {
  At(
    !wa(),
    "You cannot render a <Router> inside another <Router>. You should never have more than one in your app."
  );
  let T = i.replace(/^\/*/, "/"), b = j.useMemo(
    () => ({
      basename: T,
      navigator: h,
      static: m,
      useTransitions: S,
      future: {}
    }),
    [T, h, m, S]
  );
  typeof o == "string" && (o = ua(o));
  let {
    pathname: y = "/",
    search: O = "",
    hash: A = "",
    state: B = null,
    key: Z = "default",
    mask: V
  } = o, Y = j.useMemo(() => {
    let H = rl(y, T);
    return H == null ? null : {
      location: {
        pathname: H,
        search: O,
        hash: A,
        state: B,
        key: Z,
        mask: V
      },
      navigationType: f
    };
  }, [T, y, O, A, B, Z, f, V]);
  return Me(
    Y != null,
    `<Router basename="${T}"> is not able to match the URL "${y}${O}${A}" because it does not start with the basename, so the <Router> won't render anything.`
  ), Y == null ? null : /* @__PURE__ */ j.createElement(ge.Provider, { value: b }, /* @__PURE__ */ j.createElement(wn.Provider, { children: s, value: Y }));
}
function C0({
  children: i,
  location: s
}) {
  return g0(ts(i), s);
}
function ts(i, s = []) {
  let o = [];
  return j.Children.forEach(i, (f, h) => {
    if (!j.isValidElement(f))
      return;
    let m = [...s, h];
    if (f.type === j.Fragment) {
      o.push.apply(
        o,
        ts(f.props.children, m)
      );
      return;
    }
    At(
      f.type === Nt,
      `[${typeof f.type == "string" ? f.type : f.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`
    ), At(
      !f.props.index || !f.props.children,
      "An index route cannot have child routes."
    );
    let S = {
      id: f.props.id || m.join("-"),
      caseSensitive: f.props.caseSensitive,
      element: f.props.element,
      Component: f.props.Component,
      index: f.props.index,
      path: f.props.path,
      middleware: f.props.middleware,
      loader: f.props.loader,
      action: f.props.action,
      hydrateFallbackElement: f.props.hydrateFallbackElement,
      HydrateFallback: f.props.HydrateFallback,
      errorElement: f.props.errorElement,
      ErrorBoundary: f.props.ErrorBoundary,
      hasErrorBoundary: f.props.hasErrorBoundary === !0 || f.props.ErrorBoundary != null || f.props.errorElement != null,
      shouldRevalidate: f.props.shouldRevalidate,
      handle: f.props.handle,
      lazy: f.props.lazy
    };
    f.props.children && (S.children = ts(
      f.props.children,
      m
    )), o.push(S);
  }), o;
}
var mi = "get", vi = "application/x-www-form-urlencoded";
function Ei(i) {
  return typeof HTMLElement < "u" && i instanceof HTMLElement;
}
function D0(i) {
  return Ei(i) && i.tagName.toLowerCase() === "button";
}
function U0(i) {
  return Ei(i) && i.tagName.toLowerCase() === "form";
}
function H0(i) {
  return Ei(i) && i.tagName.toLowerCase() === "input";
}
function B0(i) {
  return !!(i.metaKey || i.altKey || i.ctrlKey || i.shiftKey);
}
function q0(i, s) {
  return i.button === 0 && // Ignore everything but left clicks
  (!s || s === "_self") && // Let browser handle "target=_blank" etc.
  !B0(i);
}
var hi = null;
function L0() {
  if (hi === null)
    try {
      new FormData(
        document.createElement("form"),
        // @ts-expect-error if FormData supports the submitter parameter, this will throw
        0
      ), hi = !1;
    } catch {
      hi = !0;
    }
  return hi;
}
var Y0 = /* @__PURE__ */ new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
]);
function If(i) {
  return i != null && !Y0.has(i) ? (Me(
    !1,
    `"${i}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${vi}"`
  ), null) : i;
}
function G0(i, s) {
  let o, f, h, m, S;
  if (U0(i)) {
    let T = i.getAttribute("action");
    f = T ? rl(T, s) : null, o = i.getAttribute("method") || mi, h = If(i.getAttribute("enctype")) || vi, m = new FormData(i);
  } else if (D0(i) || H0(i) && (i.type === "submit" || i.type === "image")) {
    let T = i.form;
    if (T == null)
      throw new Error(
        'Cannot submit a <button> or <input type="submit"> without a <form>'
      );
    let b = i.getAttribute("formaction") || T.getAttribute("action");
    if (f = b ? rl(b, s) : null, o = i.getAttribute("formmethod") || T.getAttribute("method") || mi, h = If(i.getAttribute("formenctype")) || If(T.getAttribute("enctype")) || vi, m = new FormData(T, i), !L0()) {
      let { name: y, type: O, value: A } = i;
      if (O === "image") {
        let B = y ? `${y}.` : "";
        m.append(`${B}x`, "0"), m.append(`${B}y`, "0");
      } else y && m.append(y, A);
    }
  } else {
    if (Ei(i))
      throw new Error(
        'Cannot submit element that is not <form>, <button>, or <input type="submit|image">'
      );
    o = mi, f = null, h = vi, S = i;
  }
  return m && h === "text/plain" && (S = m, m = void 0), { action: f, method: o.toLowerCase(), encType: h, formData: m, body: S };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function cs(i, s) {
  if (i === !1 || i === null || typeof i > "u")
    throw new Error(s);
}
function kh(i, s, o, f) {
  let h = typeof i == "string" ? new URL(
    i,
    // This can be called during the SSR flow via PrefetchPageLinksImpl so
    // don't assume window is available
    typeof window > "u" ? "server://singlefetch/" : window.location.origin
  ) : i;
  return o ? h.pathname.endsWith("/") ? h.pathname = `${h.pathname}_.${f}` : h.pathname = `${h.pathname}.${f}` : h.pathname === "/" ? h.pathname = `_root.${f}` : s && rl(h.pathname, s) === "/" ? h.pathname = `${bi(s)}/_root.${f}` : h.pathname = `${bi(h.pathname)}.${f}`, h;
}
async function X0(i, s) {
  if (i.id in s)
    return s[i.id];
  try {
    let o = await import(
      /* @vite-ignore */
      /* webpackIgnore: true */
      i.module
    );
    return s[i.id] = o, o;
  } catch (o) {
    return console.error(
      `Error loading route module \`${i.module}\`, reloading page...`
    ), console.error(o), window.__reactRouterContext && window.__reactRouterContext.isSpaMode, window.location.reload(), new Promise(() => {
    });
  }
}
function Q0(i) {
  return i == null ? !1 : i.href == null ? i.rel === "preload" && typeof i.imageSrcSet == "string" && typeof i.imageSizes == "string" : typeof i.rel == "string" && typeof i.href == "string";
}
async function Z0(i, s, o) {
  let f = await Promise.all(
    i.map(async (h) => {
      let m = s.routes[h.route.id];
      if (m) {
        let S = await X0(m, o);
        return S.links ? S.links() : [];
      }
      return [];
    })
  );
  return J0(
    f.flat(1).filter(Q0).filter((h) => h.rel === "stylesheet" || h.rel === "preload").map(
      (h) => h.rel === "stylesheet" ? { ...h, rel: "prefetch", as: "style" } : { ...h, rel: "prefetch" }
    )
  );
}
function jh(i, s, o, f, h, m) {
  let S = (b, y) => o[y] ? b.route.id !== o[y].route.id : !0, T = (b, y) => (
    // param change, /users/123 -> /users/456
    o[y].pathname !== b.pathname || // splat param changed, which is not present in match.path
    // e.g. /files/images/avatar.jpg -> files/finances.xls
    o[y].route.path?.endsWith("*") && o[y].params["*"] !== b.params["*"]
  );
  return m === "assets" ? s.filter(
    (b, y) => S(b, y) || T(b, y)
  ) : m === "data" ? s.filter((b, y) => {
    let O = f.routes[b.route.id];
    if (!O || !O.hasLoader)
      return !1;
    if (S(b, y) || T(b, y))
      return !0;
    if (b.route.shouldRevalidate) {
      let A = b.route.shouldRevalidate({
        currentUrl: new URL(
          h.pathname + h.search + h.hash,
          window.origin
        ),
        currentParams: o[0]?.params || {},
        nextUrl: new URL(i, window.origin),
        nextParams: b.params,
        defaultShouldRevalidate: !0
      });
      if (typeof A == "boolean")
        return A;
    }
    return !0;
  }) : [];
}
function V0(i, s, { includeHydrateFallback: o } = {}) {
  return w0(
    i.map((f) => {
      let h = s.routes[f.route.id];
      if (!h) return [];
      let m = [h.module];
      return h.clientActionModule && (m = m.concat(h.clientActionModule)), h.clientLoaderModule && (m = m.concat(h.clientLoaderModule)), o && h.hydrateFallbackModule && (m = m.concat(h.hydrateFallbackModule)), h.imports && (m = m.concat(h.imports)), m;
    }).flat(1)
  );
}
function w0(i) {
  return [...new Set(i)];
}
function K0(i) {
  let s = {}, o = Object.keys(i).sort();
  for (let f of o)
    s[f] = i[f];
  return s;
}
function J0(i, s) {
  let o = /* @__PURE__ */ new Set();
  return new Set(s), i.reduce((f, h) => {
    let m = JSON.stringify(K0(h));
    return o.has(m) || (o.add(m), f.push({ key: m, link: h })), f;
  }, []);
}
function fs() {
  let i = j.useContext(Va);
  return cs(
    i,
    "You must render this element inside a <DataRouterContext.Provider> element"
  ), i;
}
function $0() {
  let i = j.useContext(xi);
  return cs(
    i,
    "You must render this element inside a <DataRouterStateContext.Provider> element"
  ), i;
}
var ss = j.createContext(void 0);
ss.displayName = "FrameworkContext";
function _i() {
  let i = j.useContext(ss);
  return cs(
    i,
    "You must render this element inside a <HydratedRouter> element"
  ), i;
}
function k0(i, s) {
  let o = j.useContext(ss), [f, h] = j.useState(!1), [m, S] = j.useState(!1), { onFocus: T, onBlur: b, onMouseEnter: y, onMouseLeave: O, onTouchStart: A } = s, B = j.useRef(null);
  j.useEffect(() => {
    if (i === "render" && S(!0), i === "viewport") {
      let Y = (K) => {
        K.forEach((W) => {
          S(W.isIntersecting);
        });
      }, H = new IntersectionObserver(Y, { threshold: 0.5 });
      return B.current && H.observe(B.current), () => {
        H.disconnect();
      };
    }
  }, [i]), j.useEffect(() => {
    if (f) {
      let Y = setTimeout(() => {
        S(!0);
      }, 100);
      return () => {
        clearTimeout(Y);
      };
    }
  }, [f]);
  let Z = () => {
    h(!0);
  }, V = () => {
    h(!1), S(!1);
  };
  return o ? i !== "intent" ? [m, B, {}] : [
    m,
    B,
    {
      onFocus: Qn(T, Z),
      onBlur: Qn(b, V),
      onMouseEnter: Qn(y, Z),
      onMouseLeave: Qn(O, V),
      onTouchStart: Qn(A, Z)
    }
  ] : [!1, B, {}];
}
function Qn(i, s) {
  return (o) => {
    i && i(o), o.defaultPrevented || s(o);
  };
}
function W0({ page: i, ...s }) {
  let o = s0(), { nonce: f } = _i(), { router: h } = fs(), m = j.useMemo(
    () => Mh(h.routes, i, h.basename),
    [h.routes, i, h.basename]
  );
  return m ? (s.nonce == null && f && (s = { ...s, nonce: f }), o ? /* @__PURE__ */ j.createElement(I0, { page: i, matches: m, ...s }) : /* @__PURE__ */ j.createElement(P0, { page: i, matches: m, ...s })) : null;
}
function F0(i) {
  let { manifest: s, routeModules: o } = _i(), [f, h] = j.useState([]);
  return j.useEffect(() => {
    let m = !1;
    return Z0(i, s, o).then(
      (S) => {
        m || h(S);
      }
    ), () => {
      m = !0;
    };
  }, [i, s, o]), f;
}
function I0({
  page: i,
  matches: s,
  ...o
}) {
  let f = Be(), { future: h } = _i(), { basename: m } = fs(), S = j.useMemo(() => {
    if (i === f.pathname + f.search + f.hash)
      return [];
    let T = kh(
      i,
      m,
      h.v8_trailingSlashAwareDataRequests,
      "rsc"
    ), b = !1, y = [];
    for (let O of s)
      typeof O.route.shouldRevalidate == "function" ? b = !0 : y.push(O.route.id);
    return b && y.length > 0 && T.searchParams.set("_routes", y.join(",")), [T.pathname + T.search];
  }, [
    m,
    h.v8_trailingSlashAwareDataRequests,
    i,
    f,
    s
  ]);
  return /* @__PURE__ */ j.createElement(j.Fragment, null, S.map((T) => /* @__PURE__ */ j.createElement("link", { key: T, rel: "prefetch", as: "fetch", href: T, ...o })));
}
function P0({
  page: i,
  matches: s,
  ...o
}) {
  let f = Be(), { future: h, manifest: m, routeModules: S } = _i(), { basename: T } = fs(), { loaderData: b, matches: y } = $0(), O = j.useMemo(
    () => jh(
      i,
      s,
      y,
      m,
      f,
      "data"
    ),
    [i, s, y, m, f]
  ), A = j.useMemo(
    () => jh(
      i,
      s,
      y,
      m,
      f,
      "assets"
    ),
    [i, s, y, m, f]
  ), B = j.useMemo(() => {
    if (i === f.pathname + f.search + f.hash)
      return [];
    let Y = /* @__PURE__ */ new Set(), H = !1;
    if (s.forEach((W) => {
      let $ = m.routes[W.route.id];
      !$ || !$.hasLoader || (!O.some((dt) => dt.route.id === W.route.id) && W.route.id in b && S[W.route.id]?.shouldRevalidate || $.hasClientLoader ? H = !0 : Y.add(W.route.id));
    }), Y.size === 0)
      return [];
    let K = kh(
      i,
      T,
      h.v8_trailingSlashAwareDataRequests,
      "data"
    );
    return H && Y.size > 0 && K.searchParams.set(
      "_routes",
      s.filter((W) => Y.has(W.route.id)).map((W) => W.route.id).join(",")
    ), [K.pathname + K.search];
  }, [
    T,
    h.v8_trailingSlashAwareDataRequests,
    b,
    f,
    m,
    O,
    s,
    i,
    S
  ]), Z = j.useMemo(
    () => V0(A, m),
    [A, m]
  ), V = F0(A);
  return /* @__PURE__ */ j.createElement(j.Fragment, null, B.map((Y) => /* @__PURE__ */ j.createElement("link", { key: Y, rel: "prefetch", as: "fetch", href: Y, ...o })), Z.map((Y) => /* @__PURE__ */ j.createElement("link", { key: Y, rel: "modulepreload", href: Y, ...o })), V.map(({ key: Y, link: H }) => (
    // these don't spread `linkProps` because they are full link descriptors
    // already with their own props
    /* @__PURE__ */ j.createElement(
      "link",
      {
        key: Y,
        nonce: o.nonce,
        ...H,
        crossOrigin: H.crossOrigin ?? o.crossOrigin
      }
    )
  )));
}
function tp(...i) {
  return (s) => {
    i.forEach((o) => {
      typeof o == "function" ? o(s) : o != null && (o.current = s);
    });
  };
}
var ep = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
try {
  ep && (window.__reactRouterVersion = // @ts-expect-error
  "7.18.2");
} catch {
}
function lp({
  basename: i,
  children: s,
  useTransitions: o,
  window: f
}) {
  let h = j.useRef();
  h.current == null && (h.current = Hy({ window: f, v5Compat: !0 }));
  let m = h.current, [S, T] = j.useState({
    action: m.action,
    location: m.location
  }), b = j.useCallback(
    (y) => {
      o === !1 ? T(y) : j.startTransition(() => T(y));
    },
    [o]
  );
  return j.useLayoutEffect(() => m.listen(b), [m, b]), /* @__PURE__ */ j.createElement(
    M0,
    {
      basename: i,
      children: s,
      location: S.location,
      navigationType: S.action,
      navigator: m,
      useTransitions: o
    }
  );
}
var fl = j.forwardRef(
  function({
    onClick: s,
    discover: o = "render",
    prefetch: f = "none",
    relative: h,
    reloadDocument: m,
    replace: S,
    mask: T,
    state: b,
    target: y,
    to: O,
    preventScrollReset: A,
    viewTransition: B,
    defaultShouldRevalidate: Z,
    ...V
  }, Y) {
    let { basename: H, navigator: K, useTransitions: W } = j.useContext(ge), $ = typeof O == "string" && ls.test(O), dt = Lh(O, H);
    O = dt.to;
    let bt = y0(O, { relative: h }), Rt = Be(), F = null;
    if (T) {
      let Ht = Si(
        T,
        [],
        Rt.mask ? Rt.mask.pathname : "/",
        !0
      );
      H !== "/" && (Ht.pathname = Ht.pathname === "/" ? H : He([H, Ht.pathname])), F = K.createHref(Ht);
    }
    let [Mt, kt, qe] = k0(
      f,
      V
    ), be = up(O, {
      replace: S,
      mask: T,
      state: b,
      target: y,
      preventScrollReset: A,
      relative: h,
      viewTransition: B,
      defaultShouldRevalidate: Z,
      useTransitions: W
    });
    function Wt(Ht) {
      s && s(Ht), Ht.defaultPrevented || be(Ht);
    }
    let Le = !(dt.isExternal || m), Se = (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      /* @__PURE__ */ j.createElement(
        "a",
        {
          ...V,
          ...qe,
          href: (Le ? F : void 0) || dt.absoluteURL || bt,
          onClick: Le ? Wt : s,
          ref: tp(Y, kt),
          target: y,
          "data-discover": !$ && o === "render" ? "true" : void 0
        }
      )
    );
    return Mt && !$ ? /* @__PURE__ */ j.createElement(j.Fragment, null, Se, /* @__PURE__ */ j.createElement(W0, { page: bt })) : Se;
  }
);
fl.displayName = "Link";
var yi = j.forwardRef(
  function({
    "aria-current": s = "page",
    caseSensitive: o = !1,
    className: f = "",
    end: h = !1,
    style: m,
    to: S,
    viewTransition: T,
    children: b,
    ...y
  }, O) {
    let A = Kn(S, { relative: y.relative }), B = Be(), Z = j.useContext(xi), { navigator: V, basename: Y } = j.useContext(ge), H = Z != null && // Conditional usage is OK here because the usage of a data router is static
    // eslint-disable-next-line react-hooks/rules-of-hooks
    rp(A) && T === !0, K = V.encodeLocation ? V.encodeLocation(A).pathname : A.pathname, W = B.pathname, $ = Z && Z.navigation && Z.navigation.location ? Z.navigation.location.pathname : null;
    o || (W = W.toLowerCase(), $ = $ ? $.toLowerCase() : null, K = K.toLowerCase()), $ && Y && ($ = rl($, Y) || $);
    const dt = K !== "/" && K.endsWith("/") ? K.length - 1 : K.length;
    let bt = W === K || !h && W.startsWith(K) && W.charAt(dt) === "/", Rt = $ != null && ($ === K || !h && $.startsWith(K) && $.charAt(K.length) === "/"), F = {
      isActive: bt,
      isPending: Rt,
      isTransitioning: H
    }, Mt = bt ? s : void 0, kt;
    typeof f == "function" ? kt = f(F) : kt = [
      f,
      bt ? "active" : null,
      Rt ? "pending" : null,
      H ? "transitioning" : null
    ].filter(Boolean).join(" ");
    let qe = typeof m == "function" ? m(F) : m;
    return /* @__PURE__ */ j.createElement(
      fl,
      {
        ...y,
        "aria-current": Mt,
        className: kt,
        ref: O,
        style: qe,
        to: S,
        viewTransition: T
      },
      typeof b == "function" ? b(F) : b
    );
  }
);
yi.displayName = "NavLink";
var ap = j.forwardRef(
  ({
    discover: i = "render",
    fetcherKey: s,
    navigate: o,
    reloadDocument: f,
    replace: h,
    state: m,
    method: S = mi,
    action: T,
    onSubmit: b,
    relative: y,
    preventScrollReset: O,
    viewTransition: A,
    defaultShouldRevalidate: B,
    ...Z
  }, V) => {
    let { useTransitions: Y } = j.useContext(ge), H = fp(), K = sp(T, { relative: y }), W = S.toLowerCase() === "get" ? "get" : "post", $ = typeof T == "string" && ls.test(T), dt = (bt) => {
      if (b && b(bt), bt.defaultPrevented) return;
      bt.preventDefault();
      let Rt = bt.nativeEvent.submitter, F = Rt?.getAttribute("formmethod") || S, Mt = () => H(Rt || bt.currentTarget, {
        fetcherKey: s,
        method: F,
        navigate: o,
        replace: h,
        state: m,
        relative: y,
        preventScrollReset: O,
        viewTransition: A,
        defaultShouldRevalidate: B
      });
      Y && o !== !1 ? j.startTransition(() => Mt()) : Mt();
    };
    return /* @__PURE__ */ j.createElement(
      "form",
      {
        ref: V,
        method: W,
        action: K,
        onSubmit: f ? b : dt,
        ...Z,
        "data-discover": !$ && i === "render" ? "true" : void 0
      }
    );
  }
);
ap.displayName = "Form";
function np(i) {
  return `${i} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function Wh(i) {
  let s = j.useContext(Va);
  return At(s, np(i)), s;
}
function up(i, {
  target: s,
  replace: o,
  mask: f,
  state: h,
  preventScrollReset: m,
  relative: S,
  viewTransition: T,
  defaultShouldRevalidate: b,
  useTransitions: y
} = {}) {
  let O = wh(), A = Be(), B = Kn(i, { relative: S });
  return j.useCallback(
    (Z) => {
      if (q0(Z, s)) {
        Z.preventDefault();
        let V = o !== void 0 ? o : Vn(A) === Vn(B), Y = () => O(i, {
          replace: V,
          mask: f,
          state: h,
          preventScrollReset: m,
          relative: S,
          viewTransition: T,
          defaultShouldRevalidate: b
        });
        y ? j.startTransition(() => Y()) : Y();
      }
    },
    [
      A,
      O,
      B,
      o,
      f,
      h,
      s,
      i,
      m,
      S,
      T,
      b,
      y
    ]
  );
}
var ip = 0, cp = () => `__${String(++ip)}__`;
function fp() {
  let { router: i } = Wh(
    "useSubmit"
    /* UseSubmit */
  ), { basename: s } = j.useContext(ge), o = R0(), f = i.fetch, h = i.navigate;
  return j.useCallback(
    async (m, S = {}) => {
      let { action: T, method: b, encType: y, formData: O, body: A } = G0(
        m,
        s
      );
      if (S.navigate === !1) {
        let B = S.fetcherKey || cp();
        await f(B, o, S.action || T, {
          defaultShouldRevalidate: S.defaultShouldRevalidate,
          preventScrollReset: S.preventScrollReset,
          formData: O,
          body: A,
          formMethod: S.method || b,
          formEncType: S.encType || y,
          flushSync: S.flushSync
        });
      } else
        await h(S.action || T, {
          defaultShouldRevalidate: S.defaultShouldRevalidate,
          preventScrollReset: S.preventScrollReset,
          formData: O,
          body: A,
          formMethod: S.method || b,
          formEncType: S.encType || y,
          replace: S.replace,
          state: S.state,
          fromRouteId: o,
          flushSync: S.flushSync,
          viewTransition: S.viewTransition
        });
    },
    [f, h, s, o]
  );
}
function sp(i, { relative: s } = {}) {
  let { basename: o } = j.useContext(ge), f = j.useContext(Ze);
  At(f, "useFormAction must be used inside a RouteContext");
  let [h] = f.matches.slice(-1), m = { ...Kn(i || ".", { relative: s }) }, S = Be();
  if (i == null) {
    m.search = S.search;
    let T = new URLSearchParams(m.search), b = T.getAll("index");
    if (b.some((O) => O === "")) {
      T.delete("index"), b.filter((A) => A).forEach((A) => T.append("index", A));
      let O = T.toString();
      m.search = O ? `?${O}` : "";
    }
  }
  return (!i || i === ".") && h.route.index && (m.search = m.search ? m.search.replace(/^\?/, "?index&") : "?index"), o !== "/" && (m.pathname = m.pathname === "/" ? o : He([o, m.pathname])), Vn(m);
}
function rp(i, { relative: s } = {}) {
  let o = j.useContext(Xh);
  At(
    o != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?"
  );
  let { basename: f } = Wh(
    "useViewTransitionState"
    /* useViewTransitionState */
  ), h = Kn(i, { relative: s });
  if (!o.isTransitioning)
    return !1;
  let m = rl(o.currentLocation.pathname, f) || o.currentLocation.pathname, S = rl(o.nextLocation.pathname, f) || o.nextLocation.pathname;
  return gi(h.pathname, S) != null || gi(h.pathname, m) != null;
}
const op = "/dsc_hub/assets", dp = {
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
function Oh(i) {
  return `${op}/${dp[i]}`;
}
function pi({
  name: i,
  size: s = 16,
  className: o,
  color: f = "currentColor"
}) {
  return /* @__PURE__ */ d.jsx(
    "span",
    {
      className: o,
      role: "img",
      "aria-hidden": !0,
      style: {
        display: "inline-block",
        width: s,
        height: s,
        backgroundColor: f,
        WebkitMaskImage: `url(${Oh(i)})`,
        maskImage: `url(${Oh(i)})`,
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
function zt({
  title: i,
  children: s,
  className: o = "",
  style: f
}) {
  return /* @__PURE__ */ d.jsxs("section", { className: `dsc-card ${o}`.trim(), style: f, children: [
    i ? /* @__PURE__ */ d.jsx("h3", { children: i }) : null,
    s
  ] });
}
function la({
  children: i,
  primary: s,
  onClick: o,
  type: f = "button"
}) {
  return /* @__PURE__ */ d.jsx(
    "button",
    {
      type: f,
      className: `dsc-btn${s ? " primary" : ""}`,
      onClick: o,
      children: i
    }
  );
}
function Zt({
  label: i,
  value: s,
  unit: o,
  sub: f,
  tone: h = "normal"
}) {
  const m = h === "ok" ? "dsc-status-ok" : h === "bad" ? "dsc-status-bad" : h === "muted" ? "dsc-status-muted" : "";
  return /* @__PURE__ */ d.jsxs(zt, { title: i, children: [
    /* @__PURE__ */ d.jsxs("div", { className: `dsc-kpi-value ${m}`.trim(), children: [
      s,
      o ? /* @__PURE__ */ d.jsx("span", { className: "dsc-kpi-unit", children: o }) : null
    ] }),
    f ? /* @__PURE__ */ d.jsx("div", { className: "dsc-kpi-sub", children: f }) : null
  ] });
}
function It({
  title: i,
  subtitle: s
}) {
  return /* @__PURE__ */ d.jsxs("header", { style: { marginBottom: 14 }, children: [
    /* @__PURE__ */ d.jsx("h1", { className: "dsc-page-title", children: i }),
    s ? /* @__PURE__ */ d.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: s }) : null
  ] });
}
const Fh = j.createContext(null);
function hp({
  hass: i,
  children: s
}) {
  const [o, f] = j.useState(0);
  j.useEffect(() => {
    if (!i) return;
    const m = window.setInterval(() => f((S) => S + 1), 1e3);
    return () => window.clearInterval(m);
  }, [i]);
  const h = j.useMemo(() => {
    const m = (O) => i?.states?.[O], S = (O) => {
      const A = m(O)?.state;
      return !!A && A !== "unavailable" && A !== "unknown";
    }, T = (O, A = "—") => S(O) ? m(O)?.state ?? A : A;
    return { hass: i, entity: m, state: T, num: (O, A = NaN) => {
      const B = Number(T(O, ""));
      return Number.isFinite(B) ? B : A;
    }, available: S, callService: (O, A, B) => i?.callService ? i.callService(O, A, B) : Promise.resolve(null), tick: o };
  }, [i, o]);
  return j.createElement(Fh.Provider, { value: h }, s);
}
function Bl() {
  const i = j.useContext(Fh);
  if (!i) throw new Error("useHass outside HassProvider");
  return i;
}
function aa(i, s = 48) {
  const { num: o, available: f, tick: h } = Bl(), [m, S] = j.useState([]), T = j.useRef(null);
  return j.useEffect(() => {
    if (!f(i)) return;
    const b = o(i);
    Number.isFinite(b) && (T.current === b && m.length > 0 || (T.current = b, S((y) => [...y, { t: Date.now(), v: b }].slice(-s))));
  }, [i, h, f, o, s]), m;
}
function mp(i) {
  const s = Math.max(...i, 1), o = 10 ** Math.floor(Math.log10(s));
  return Math.ceil(s / o) * o;
}
function na({
  series: i,
  height: s = 160,
  unit: o = "",
  live: f = !0,
  color: h = "var(--dsc-neon)"
}) {
  const m = j.useId().replace(/:/g, ""), S = 640, T = { l: 8, r: 8, t: 12, b: 18 }, b = j.useMemo(() => {
    if (!i.length) return "";
    const A = i.map((K) => K.v), B = mp(A), Z = Math.min(0, ...A), V = Math.max(B - Z, 1e-6), Y = S - T.l - T.r, H = s - T.t - T.b;
    return i.map((K, W) => {
      const $ = T.l + W / Math.max(i.length - 1, 1) * Y, dt = T.t + (1 - (K.v - Z) / V) * H;
      return `${W === 0 ? "M" : "L"}${$.toFixed(1)} ${dt.toFixed(1)}`;
    }).join(" ");
  }, [i, s]), y = b ? `${b} L${S - T.r} ${s - T.b} L${T.l} ${s - T.b} Z` : "", O = i.length ? i[i.length - 1].v : null;
  return /* @__PURE__ */ d.jsxs("div", { style: { position: "relative", width: "100%" }, children: [
    /* @__PURE__ */ d.jsxs(
      "svg",
      {
        viewBox: `0 0 ${S} ${s}`,
        width: "100%",
        height: s,
        role: "img",
        "aria-label": "Live chart",
        children: [
          /* @__PURE__ */ d.jsxs("defs", { children: [
            /* @__PURE__ */ d.jsxs("linearGradient", { id: `fill-${m}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ d.jsx("stop", { offset: "0%", stopColor: h, stopOpacity: "0.35" }),
              /* @__PURE__ */ d.jsx("stop", { offset: "100%", stopColor: h, stopOpacity: "0" })
            ] }),
            /* @__PURE__ */ d.jsxs("filter", { id: `glow-${m}`, x: "-20%", y: "-20%", width: "140%", height: "140%", children: [
              /* @__PURE__ */ d.jsx("feGaussianBlur", { stdDeviation: "2.2", result: "b" }),
              /* @__PURE__ */ d.jsxs("feMerge", { children: [
                /* @__PURE__ */ d.jsx("feMergeNode", { in: "b" }),
                /* @__PURE__ */ d.jsx("feMergeNode", { in: "SourceGraphic" })
              ] })
            ] })
          ] }),
          y ? /* @__PURE__ */ d.jsx("path", { d: y, fill: `url(#fill-${m})` }) : null,
          b ? /* @__PURE__ */ d.jsx(
            "path",
            {
              className: f ? "dsc-live-pulse" : void 0,
              d: b,
              fill: "none",
              stroke: h,
              strokeWidth: "2.4",
              strokeLinejoin: "round",
              strokeLinecap: "round",
              filter: `url(#glow-${m})`,
              style: f ? {
                animation: "dsc-line-pulse 2.4s ease-in-out infinite"
              } : void 0
            }
          ) : /* @__PURE__ */ d.jsx("text", { x: S / 2, y: s / 2, textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "12", children: "Waiting for data" })
        ]
      }
    ),
    O != null ? /* @__PURE__ */ d.jsxs(
      "div",
      {
        style: {
          position: "absolute",
          right: 8,
          top: 4,
          fontVariantNumeric: "tabular-nums",
          color: "var(--dsc-neon)",
          fontSize: 13,
          fontWeight: 650
        },
        children: [
          O.toFixed(1),
          o ? ` ${o}` : ""
        ]
      }
    ) : null,
    /* @__PURE__ */ d.jsx("style", { children: `
        @keyframes dsc-line-pulse {
          0%, 100% { opacity: 0.82; filter: url(#glow-${m}) brightness(1); }
          50% { opacity: 1; filter: url(#glow-${m}) brightness(1.25); }
        }
        @media (prefers-reduced-motion: reduce) {
          .dsc-live-pulse { animation: none !important; }
        }
      ` })
  ] });
}
function Zn({
  value: i,
  min: s = 0,
  max: o = 100,
  label: f,
  unit: h = ""
}) {
  const S = (Math.min(o, Math.max(s, Number.isFinite(i) ? i : s)) - s) / Math.max(o - s, 1e-6), b = 2 * Math.PI * 46 * 0.75, y = b * S;
  return /* @__PURE__ */ d.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }, children: [
    /* @__PURE__ */ d.jsxs("svg", { viewBox: "0 0 120 90", width: "140", height: "105", "aria-label": f, children: [
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
          strokeDasharray: `${y} ${b}`,
          filter: "drop-shadow(0 0 6px rgba(57,255,20,0.55))",
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
    /* @__PURE__ */ d.jsx("div", { style: { fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--dsc-gray-5)" }, children: f })
  ] });
}
function vp(i) {
  return !Number.isFinite(i) || i <= 0 ? "—" : i >= 86400 ? `${(i / 86400).toFixed(1)}d` : i >= 3600 ? `${(i / 3600).toFixed(1)}h` : `${Math.round(i / 60)}m`;
}
function yp() {
  const { state: i, num: s, available: o } = Bl(), f = o("sensor.dsc_hub_uptime"), h = s("sensor.dsc_active_alert_count", 0), m = s("sensor.dsc_hub_tent_temperature"), S = s("sensor.dsc_hub_tent_humidity"), T = s("sensor.dsc_hub_vpd_kpa"), b = s("sensor.dsc_hub_room_temperature"), y = aa("sensor.dsc_hub_tent_temperature");
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(
      It,
      {
        title: "Ops · Home",
        subtitle: "Live vitals board — hub health, climate, alerts."
      }
    ),
    /* @__PURE__ */ d.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ d.jsx(
        Zt,
        {
          label: "Hub",
          value: f ? "ONLINE" : "OFFLINE",
          tone: f ? "ok" : "bad",
          sub: `Uptime ${vp(s("sensor.dsc_hub_uptime"))}`
        }
      ) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ d.jsx(
        Zt,
        {
          label: "Alerts",
          value: Number.isFinite(h) ? h : "—",
          tone: h === 0 ? "ok" : "bad",
          sub: h === 0 ? "All clear" : "Open System for detail"
        }
      ) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ d.jsx(
        Zt,
        {
          label: "Tent temp",
          value: Number.isFinite(m) ? m.toFixed(1) : "—",
          unit: "°C",
          sub: `Room ${Number.isFinite(b) ? b.toFixed(1) : "—"} °C`
        }
      ) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ d.jsx(
        Zt,
        {
          label: "Tent RH",
          value: Number.isFinite(S) ? S.toFixed(0) : "—",
          unit: "%",
          sub: `VPD ${Number.isFinite(T) ? T.toFixed(2) : "—"} kPa`
        }
      ) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-8", children: /* @__PURE__ */ d.jsx(zt, { title: "Live tent temperature", children: /* @__PURE__ */ d.jsx(na, { series: y, unit: "°C", live: !0 }) }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ d.jsx(zt, { title: "Climate gauges", children: /* @__PURE__ */ d.jsxs("div", { style: { display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 8 }, children: [
        /* @__PURE__ */ d.jsx(Zn, { label: "Temp", value: m, min: 10, max: 40, unit: "°C" }),
        /* @__PURE__ */ d.jsx(Zn, { label: "RH", value: S, min: 0, max: 100, unit: "%" })
      ] }) }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ d.jsxs(zt, { title: "Heartbeat", children: [
        /* @__PURE__ */ d.jsx("div", { className: "dsc-kpi-value", style: { fontSize: "1.2rem" }, children: i("sensor.dsc_hub_heartbeat", "NO BEAT") }),
        /* @__PURE__ */ d.jsxs("div", { className: "dsc-kpi-sub", children: [
          "Panel link: ",
          i("binary_sensor.dsc_hub_panel_link", "unknown")
        ] })
      ] }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ d.jsxs(zt, { title: "Fleet / surface", children: [
        /* @__PURE__ */ d.jsxs("div", { className: "dsc-kpi-sub", children: [
          "Fleet: ",
          i("sensor.dsc_fleet_version_status", "—")
        ] }),
        /* @__PURE__ */ d.jsxs("div", { className: "dsc-kpi-sub", children: [
          "HA surface: ",
          i("sensor.dsc_ha_surface_version", "6.0.0")
        ] })
      ] }) })
    ] })
  ] });
}
function Ti({
  tag: i,
  config: s
}) {
  const o = j.useRef(null);
  return j.useEffect(() => {
    const f = o.current;
    if (!f) return;
    if (f.innerHTML = "", !customElements.get(i)) {
      const b = document.createElement("div");
      b.className = "dsc-muted", b.style.padding = "24px", b.textContent = `${i} not loaded yet — open once from Lovelace or ensure /local bundle is registered.`, f.appendChild(b);
      return;
    }
    const h = document.createElement(i);
    s && typeof h.setConfig == "function" && h.setConfig({ type: `custom:${i}`, ...s }), f.appendChild(h);
    const m = document.querySelector("home-assistant"), S = () => {
      m?.hass && (h.hass = m.hass);
    };
    S();
    const T = window.setInterval(S, 1e3);
    return () => {
      window.clearInterval(T), f.innerHTML = "";
    };
  }, [i, s]), /* @__PURE__ */ d.jsx("div", { className: "dsc-legacy-host", ref: o });
}
function sl(i, s = 1) {
  return Number.isFinite(i) ? i.toFixed(s) : "—";
}
function pp() {
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(
      It,
      {
        title: "Ops · Dash",
        subtitle: "Cinematic digital twin — legacy Three.js card mounted in-panel."
      }
    ),
    /* @__PURE__ */ d.jsx(Ti, { tag: "dsc-the-dash-card", config: {} })
  ] });
}
function gp() {
  const { num: i } = Bl(), s = aa("sensor.dsc_hub_tent_temperature"), o = aa("sensor.dsc_hub_tent_humidity");
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(It, { title: "Ops · Climate", subtitle: "Environment control readouts and live traces." }),
    /* @__PURE__ */ d.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ d.jsx(Zt, { label: "Tent °C", value: sl(i("sensor.dsc_hub_tent_temperature")), unit: "°C" }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ d.jsx(Zt, { label: "Tent RH", value: sl(i("sensor.dsc_hub_tent_humidity"), 0), unit: "%" }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ d.jsx(Zt, { label: "VPD", value: sl(i("sensor.dsc_hub_vpd_kpa"), 2), unit: "kPa" }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ d.jsx(Zt, { label: "Room °C", value: sl(i("sensor.dsc_hub_room_temperature")), unit: "°C" }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ d.jsx(zt, { title: "Temperature", children: /* @__PURE__ */ d.jsx(na, { series: s, unit: "°C" }) }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ d.jsx(zt, { title: "Humidity", children: /* @__PURE__ */ d.jsx(na, { series: o, unit: "%" }) }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ d.jsx(zt, { title: "Targets", children: /* @__PURE__ */ d.jsxs("div", { style: { display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "space-around" }, children: [
        /* @__PURE__ */ d.jsx(Zn, { label: "Temp", value: i("sensor.dsc_hub_tent_temperature"), min: 15, max: 35, unit: "°C" }),
        /* @__PURE__ */ d.jsx(Zn, { label: "RH", value: i("sensor.dsc_hub_tent_humidity"), min: 0, max: 100, unit: "%" }),
        /* @__PURE__ */ d.jsx(Zn, { label: "VPD×10", value: i("sensor.dsc_hub_vpd_kpa") * 10, min: 0, max: 20, unit: "" })
      ] }) }) })
    ] })
  ] });
}
function Ih({
  title: i,
  tempId: s,
  rhId: o
}) {
  const { num: f } = Bl(), h = aa(s), m = aa(o);
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(It, { title: i }),
    /* @__PURE__ */ d.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ d.jsx(Zt, { label: "Temperature", value: sl(f(s)), unit: "°C" }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ d.jsx(Zt, { label: "Humidity", value: sl(f(o), 0), unit: "%" }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ d.jsx(zt, { title: "Temp trace", children: /* @__PURE__ */ d.jsx(na, { series: h, unit: "°C" }) }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ d.jsx(zt, { title: "RH trace", children: /* @__PURE__ */ d.jsx(na, { series: m, unit: "%" }) }) })
    ] })
  ] });
}
function bp() {
  return /* @__PURE__ */ d.jsx(
    Ih,
    {
      title: "Ops · Main 4×8",
      tempId: "sensor.dsc_hub_tent_temperature",
      rhId: "sensor.dsc_hub_tent_humidity"
    }
  );
}
function Sp() {
  return /* @__PURE__ */ d.jsx(
    Ih,
    {
      title: "Ops · Clone 2×4",
      tempId: "sensor.dsc_hub_clone_temperature",
      rhId: "sensor.dsc_hub_clone_humidity"
    }
  );
}
function xp() {
  const { num: i, state: s } = Bl();
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(It, { title: "Ops · Root zone", subtitle: "Coldest root and heat-mat context." }),
    /* @__PURE__ */ d.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ d.jsx(Zt, { label: "Coldest root", value: sl(i("sensor.dsc_coldest_root_zone_temp")), unit: "°C" }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ d.jsx(Zt, { label: "Heat mat on time", value: sl(i("sensor.dsc_heatmat_relay_on_time"), 0), unit: "s" }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ d.jsx(zt, { title: "Notes", children: /* @__PURE__ */ d.jsxs("p", { className: "dsc-muted", style: { margin: 0 }, children: [
        "Mat loop uses per-pot sense with plausibility filter. State:",
        " ",
        s("sensor.dsc_coldest_root_zone_temp", "—")
      ] }) }) })
    ] })
  ] });
}
function Ep() {
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(It, { title: "Ops · Tank", subtitle: "Reservoir / tank vitals." }),
    /* @__PURE__ */ d.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ d.jsx(Zt, { label: "Status", value: "Live", tone: "ok", sub: "Wire additional tank sensors as they land." }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ d.jsx(zt, { title: "System map", children: /* @__PURE__ */ d.jsx(Ti, { tag: "dsc-system-map-card", config: {} }) }) })
    ] })
  ] });
}
function _p() {
  const { state: i, num: s } = Bl();
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(It, { title: "Ops · Lighting", subtitle: "Photoperiod and expected light hours." }),
    /* @__PURE__ */ d.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ d.jsx(Zt, { label: "Expected light hours", value: sl(s("sensor.dsc_expected_light_hours"), 1), unit: "h" }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-8", children: /* @__PURE__ */ d.jsx(zt, { title: "Notes", children: /* @__PURE__ */ d.jsxs("p", { className: "dsc-muted", style: { margin: 0 }, children: [
        "Expected: ",
        i("sensor.dsc_expected_light_hours", "—"),
        ". Fixture detail remains on firmware / packages."
      ] }) }) })
    ] })
  ] });
}
function Tp() {
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(
      It,
      {
        title: "Plant",
        subtitle: "Build, catalog research, roster seats, and mix tools."
      }
    ),
    /* @__PURE__ */ d.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ d.jsxs(zt, { title: "Build a Plant", children: [
        /* @__PURE__ */ d.jsx("p", { className: "dsc-muted", children: "Compose soil blend, roster, and climate Want." }),
        /* @__PURE__ */ d.jsx(fl, { to: "/plant/build", children: /* @__PURE__ */ d.jsx(la, { primary: !0, children: "Open Build" }) })
      ] }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ d.jsxs(zt, { title: "Catalog Explorer", children: [
        /* @__PURE__ */ d.jsx("p", { className: "dsc-muted", children: "Browse strains, nutrients, mediums, lights." }),
        /* @__PURE__ */ d.jsx(fl, { to: "/plant/catalog", children: /* @__PURE__ */ d.jsx(la, { primary: !0, children: "Open Catalog" }) })
      ] }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ d.jsxs(zt, { title: "Fleet seats", children: [
        /* @__PURE__ */ d.jsx("p", { className: "dsc-muted", children: "Want–Need–Got seats and nutrient science." }),
        /* @__PURE__ */ d.jsxs("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ d.jsx(fl, { to: "/plant/strains", children: /* @__PURE__ */ d.jsx(la, { children: "Strains" }) }),
          /* @__PURE__ */ d.jsx(fl, { to: "/plant/nutrient", children: /* @__PURE__ */ d.jsx(la, { children: "Nutrient" }) })
        ] })
      ] }) })
    ] })
  ] });
}
function zp() {
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(It, { title: "Plant · Build", subtitle: "Compose mode — legacy card hosted in panel chrome." }),
    /* @__PURE__ */ d.jsx(Ti, { tag: "dsc-build-plant-card", config: {} })
  ] });
}
function Ap() {
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(It, { title: "Plant · Catalog", subtitle: "Research browser over /local/dsc-catalog indexes." }),
    /* @__PURE__ */ d.jsx(Ti, { tag: "dsc-catalog-browse-card", config: {} })
  ] });
}
function Rp() {
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(It, { title: "Plant · Strains", subtitle: "Fleet seats / Want–Need–Got." }),
    /* @__PURE__ */ d.jsxs(zt, { title: "Roster", children: [
      /* @__PURE__ */ d.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "Strain seat management still lands via HA helpers for lab soak. Prefer brain catalog APIs for durable logic." }),
      /* @__PURE__ */ d.jsx(fl, { to: "/plant/build", children: /* @__PURE__ */ d.jsx(la, { primary: !0, children: /* @__PURE__ */ d.jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ d.jsx(pi, { name: "build", size: 14 }),
        " Use in Build"
      ] }) }) })
    ] })
  ] });
}
function jp() {
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(It, { title: "Plant · Nutrient science", subtitle: "Mix lab / dose tools." }),
    /* @__PURE__ */ d.jsxs(zt, { title: "Mix lab", children: [
      /* @__PURE__ */ d.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "Nutrient dose and stage tools — open Build for the interactive mixer, Catalog for SKU research." }),
      /* @__PURE__ */ d.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ d.jsx(fl, { to: "/plant/build", children: /* @__PURE__ */ d.jsx(la, { primary: !0, children: "Build mixer" }) }),
        /* @__PURE__ */ d.jsx(fl, { to: "/plant/catalog", children: /* @__PURE__ */ d.jsx(la, { children: "Catalog nutrients" }) })
      ] })
    ] })
  ] });
}
function Op() {
  const { state: i } = Bl();
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(It, { title: "Advanced · Learning", subtitle: "Learning loop status and notes." }),
    /* @__PURE__ */ d.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ d.jsx(zt, { title: "Status", children: /* @__PURE__ */ d.jsxs("p", { className: "dsc-muted", style: { marginTop: 0 }, children: [
        "Surface: ",
        i("sensor.dsc_ha_surface_version", "6.0.0"),
        ". Durable learning math belongs in brain/."
      ] }) }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ d.jsx(Zt, { label: "Hub beat", value: i("sensor.dsc_hub_heartbeat", "—") }) })
    ] })
  ] });
}
function Np() {
  const i = aa("sensor.dsc_hub_tent_temperature", 64), s = aa("sensor.dsc_hub_tent_humidity", 64);
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(It, { title: "Advanced · Trends", subtitle: "Live rolling trends (session buffer)." }),
    /* @__PURE__ */ d.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ d.jsx(zt, { title: "Tent temperature", children: /* @__PURE__ */ d.jsx(na, { series: i, unit: "°C", live: !0 }) }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ d.jsx(zt, { title: "Tent humidity", children: /* @__PURE__ */ d.jsx(na, { series: s, unit: "%", live: !0 }) }) })
    ] })
  ] });
}
function Mp() {
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(
      It,
      {
        title: "Advanced · History",
        subtitle: "HA Recorder remains the lab history store for now."
      }
    ),
    /* @__PURE__ */ d.jsx(zt, { title: "History", children: /* @__PURE__ */ d.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "Deep history charts stay on HA recorder / Trends while brain history matures. Use Trends for live session traces." }) })
  ] });
}
function Cp() {
  const { state: i, available: s, num: o } = Bl(), f = s("sensor.dsc_hub_uptime");
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ d.jsx(It, { title: "System", subtitle: "Diagnostics, versions, and panel health." }),
    /* @__PURE__ */ d.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ d.jsx(
        Zt,
        {
          label: "Hub link",
          value: f ? "OK" : "DOWN",
          tone: f ? "ok" : "bad",
          sub: `Uptime raw ${i("sensor.dsc_hub_uptime", "—")}`
        }
      ) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ d.jsx(Zt, { label: "Surface", value: i("sensor.dsc_ha_surface_version", "6.0.0"), sub: "Panel product shell" }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ d.jsx(
        Zt,
        {
          label: "Alerts",
          value: Number.isFinite(o("sensor.dsc_active_alert_count")) ? o("sensor.dsc_active_alert_count") : "—",
          tone: o("sensor.dsc_active_alert_count", 0) === 0 ? "ok" : "bad"
        }
      ) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ d.jsx(zt, { title: "Fleet", children: /* @__PURE__ */ d.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: i("sensor.dsc_fleet_version_status", "—") }) }) }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ d.jsx(zt, { title: "Panel", children: /* @__PURE__ */ d.jsxs("p", { className: "dsc-muted", style: { marginTop: 0 }, children: [
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
const Dp = [
  { id: "ops", label: "Ops", path: "/ops", icon: "ops" },
  { id: "plant", label: "Plant", path: "/plant", icon: "plant" },
  { id: "advanced", label: "Advanced", path: "/advanced", icon: "advanced" },
  { id: "system", label: "System", path: "/system", icon: "system" }
], Up = {
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
function Hp(i) {
  return i.includes("/plant") ? "plant" : i.includes("/advanced") ? "advanced" : i.includes("/system") ? "system" : "ops";
}
const Bp = ':host,.dsc-root{--dsc-black: #070907;--dsc-black-2: #0c100d;--dsc-gray-1: #151a16;--dsc-gray-2: #1c241e;--dsc-gray-3: #2a342c;--dsc-gray-4: #6b7a6e;--dsc-gray-5: #9aab9e;--dsc-neon: #39ff14;--dsc-neon-dim: rgba(57, 255, 20, .35);--dsc-neon-glow: rgba(57, 255, 20, .55);--dsc-white: #f4f7f4;--dsc-shadow: 0 8px 24px rgba(0, 0, 0, .45);--dsc-shadow-tight: 0 2px 8px rgba(0, 0, 0, .55);--dsc-radius: 10px;--dsc-font: "Segoe UI", "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;--dsc-mono: "Cascadia Code", "IBM Plex Mono", ui-monospace, monospace;color:var(--dsc-white);background:var(--dsc-black);font-family:var(--dsc-font);display:block;height:100%;box-sizing:border-box}*,*:before,*:after{box-sizing:border-box}.dsc-root{height:100%;min-height:100%;overflow:auto;background:radial-gradient(1200px 600px at 10% -10%,rgba(57,255,20,.06),transparent 55%),radial-gradient(900px 500px at 90% 0%,rgba(255,255,255,.03),transparent 50%),var(--dsc-black)}.dsc-shell{display:flex;flex-direction:column;min-height:100%;max-width:1600px;margin:0 auto;padding:16px 20px 28px}.dsc-brand-row{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:10px}.dsc-brand{display:flex;align-items:center;gap:12px;color:var(--dsc-white);text-decoration:none}.dsc-brand img,.dsc-brand svg{width:36px;height:36px;color:var(--dsc-neon)}.dsc-brand-title{display:flex;flex-direction:column;gap:2px}.dsc-brand-title strong{font-size:1.15rem;letter-spacing:.14em;font-weight:700}.dsc-brand-title span{font-size:.72rem;color:var(--dsc-gray-5);letter-spacing:.08em;text-transform:uppercase}.dsc-primary-tabs,.dsc-secondary-tabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:thin;padding-bottom:2px;-webkit-overflow-scrolling:touch}.dsc-primary-tabs{border-bottom:1px solid var(--dsc-gray-3);margin-bottom:8px}.dsc-secondary-tabs{margin-bottom:16px}.dsc-tab{appearance:none;border:1px solid transparent;background:transparent;color:var(--dsc-gray-5);padding:10px 14px;min-height:44px;border-radius:8px 8px 0 0;cursor:pointer;font:inherit;font-size:.92rem;letter-spacing:.04em;white-space:nowrap;display:inline-flex;align-items:center;gap:8px;transition:transform .1s ease,box-shadow .1s ease,color .15s ease,border-color .15s ease,background .15s ease;text-decoration:none}.dsc-tab img{width:16px;height:16px;opacity:.85}.dsc-tab:hover{color:var(--dsc-white);background:var(--dsc-gray-1)}.dsc-tab:focus-visible{outline:2px solid var(--dsc-neon);outline-offset:2px}.dsc-tab.active{color:var(--dsc-white);border-bottom:2px solid var(--dsc-neon);box-shadow:0 6px 18px #39ff1414}.dsc-secondary-tabs .dsc-tab{border-radius:999px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-1);min-height:40px;padding:8px 14px}.dsc-secondary-tabs .dsc-tab.active{border-color:var(--dsc-neon-dim);color:var(--dsc-neon);background:#39ff1414;box-shadow:var(--dsc-shadow-tight)}.dsc-btn{appearance:none;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);border-radius:8px;padding:10px 16px;min-height:40px;font:inherit;cursor:pointer;box-shadow:var(--dsc-shadow-tight);transition:transform .1s ease,box-shadow .1s ease,border-color .12s ease,background .12s ease}.dsc-btn:hover{border-color:var(--dsc-neon-dim)}.dsc-btn:active,.dsc-tab:active{transform:translateY(1px);box-shadow:0 1px 3px #000000a6}.dsc-btn.primary{border-color:var(--dsc-neon-dim);color:var(--dsc-black);background:var(--dsc-neon);font-weight:650}.dsc-page{animation:dsc-fade .18s ease}@keyframes dsc-fade{0%{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.dsc-page,.dsc-btn,.dsc-tab,.dsc-live-pulse{animation:none!important;transition:none!important}}.dsc-grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:14px}.dsc-col-3{grid-column:span 3}.dsc-col-4{grid-column:span 4}.dsc-col-6{grid-column:span 6}.dsc-col-8{grid-column:span 8}.dsc-col-12{grid-column:span 12}@media(max-width:1100px){.dsc-col-3,.dsc-col-4{grid-column:span 6}.dsc-col-8{grid-column:span 12}}@media(max-width:720px){.dsc-shell{padding:12px}.dsc-col-3,.dsc-col-4,.dsc-col-6,.dsc-col-8{grid-column:span 12}}.dsc-card{background:linear-gradient(165deg,var(--dsc-gray-1),var(--dsc-black-2));border:1px solid var(--dsc-gray-3);border-radius:var(--dsc-radius);box-shadow:var(--dsc-shadow);padding:14px 16px;min-height:88px}.dsc-card h2,.dsc-card h3{margin:0 0 8px;font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;color:var(--dsc-gray-5);font-weight:600}.dsc-kpi-value{font-size:1.85rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:.02em;color:var(--dsc-white)}.dsc-kpi-unit{margin-left:6px;font-size:.85rem;color:var(--dsc-gray-5)}.dsc-kpi-sub{margin-top:6px;color:var(--dsc-gray-5);font-size:.82rem}.dsc-status-ok{color:var(--dsc-neon)}.dsc-status-bad{color:#ff6b6b}.dsc-status-muted{color:var(--dsc-gray-5)}.dsc-page-title{margin:0 0 14px;font-size:1.35rem;letter-spacing:.04em}.dsc-muted{color:var(--dsc-gray-5)}.dsc-legacy-host{min-height:420px;border-radius:var(--dsc-radius);overflow:hidden;border:1px solid var(--dsc-gray-3);background:#000}.dsc-legacy-host>*{display:block;width:100%}', qp = Bp;
function Lp() {
  const i = Be(), s = Hp(i.pathname), o = Up[s];
  return /* @__PURE__ */ d.jsxs("div", { className: "dsc-shell", children: [
    /* @__PURE__ */ d.jsxs("div", { className: "dsc-brand-row", children: [
      /* @__PURE__ */ d.jsxs(yi, { className: "dsc-brand", to: "/ops/home", children: [
        /* @__PURE__ */ d.jsx(pi, { name: "brand", size: 36, color: "var(--dsc-neon)" }),
        /* @__PURE__ */ d.jsxs("div", { className: "dsc-brand-title", children: [
          /* @__PURE__ */ d.jsx("strong", { children: "DSC-HUB" }),
          /* @__PURE__ */ d.jsx("span", { children: "Grow operations panel" })
        ] })
      ] }),
      /* @__PURE__ */ d.jsx("div", { className: "dsc-muted", style: { fontSize: 12, letterSpacing: "0.08em" }, children: "SURFACE 6.0.0" })
    ] }),
    /* @__PURE__ */ d.jsx("nav", { className: "dsc-primary-tabs", "aria-label": "Primary", children: Dp.map((f) => /* @__PURE__ */ d.jsxs(
      yi,
      {
        to: f.path,
        className: ({ isActive: h }) => `dsc-tab${h || s === f.id ? " active" : ""}`,
        children: [
          /* @__PURE__ */ d.jsx(pi, { name: f.icon, size: 15 }),
          f.label
        ]
      },
      f.id
    )) }),
    /* @__PURE__ */ d.jsx("nav", { className: "dsc-secondary-tabs", "aria-label": "Section pages", children: o.map((f) => /* @__PURE__ */ d.jsxs(
      yi,
      {
        to: f.path,
        end: f.path === "/plant" || f.path === "/system",
        className: ({ isActive: h }) => `dsc-tab${h ? " active" : ""}`,
        children: [
          /* @__PURE__ */ d.jsx(pi, { name: f.icon, size: 14 }),
          f.label
        ]
      },
      f.id
    )) }),
    /* @__PURE__ */ d.jsxs(C0, { children: [
      /* @__PURE__ */ d.jsx(Nt, { path: "/", element: /* @__PURE__ */ d.jsx(di, { to: "/ops/home", replace: !0 }) }),
      /* @__PURE__ */ d.jsx(Nt, { path: "/ops", element: /* @__PURE__ */ d.jsx(di, { to: "/ops/home", replace: !0 }) }),
      /* @__PURE__ */ d.jsx(Nt, { path: "/ops/home", element: /* @__PURE__ */ d.jsx(yp, {}) }),
      /* @__PURE__ */ d.jsx(Nt, { path: "/ops/dash", element: /* @__PURE__ */ d.jsx(pp, {}) }),
      /* @__PURE__ */ d.jsx(Nt, { path: "/ops/climate", element: /* @__PURE__ */ d.jsx(gp, {}) }),
      /* @__PURE__ */ d.jsx(Nt, { path: "/ops/main-4x8", element: /* @__PURE__ */ d.jsx(bp, {}) }),
      /* @__PURE__ */ d.jsx(Nt, { path: "/ops/clone-2x4", element: /* @__PURE__ */ d.jsx(Sp, {}) }),
      /* @__PURE__ */ d.jsx(Nt, { path: "/ops/root-zone", element: /* @__PURE__ */ d.jsx(xp, {}) }),
      /* @__PURE__ */ d.jsx(Nt, { path: "/ops/tank", element: /* @__PURE__ */ d.jsx(Ep, {}) }),
      /* @__PURE__ */ d.jsx(Nt, { path: "/ops/lighting", element: /* @__PURE__ */ d.jsx(_p, {}) }),
      /* @__PURE__ */ d.jsx(Nt, { path: "/plant", element: /* @__PURE__ */ d.jsx(Tp, {}) }),
      /* @__PURE__ */ d.jsx(Nt, { path: "/plant/build", element: /* @__PURE__ */ d.jsx(zp, {}) }),
      /* @__PURE__ */ d.jsx(Nt, { path: "/plant/catalog", element: /* @__PURE__ */ d.jsx(Ap, {}) }),
      /* @__PURE__ */ d.jsx(Nt, { path: "/plant/strains", element: /* @__PURE__ */ d.jsx(Rp, {}) }),
      /* @__PURE__ */ d.jsx(Nt, { path: "/plant/nutrient", element: /* @__PURE__ */ d.jsx(jp, {}) }),
      /* @__PURE__ */ d.jsx(Nt, { path: "/advanced", element: /* @__PURE__ */ d.jsx(di, { to: "/advanced/learning", replace: !0 }) }),
      /* @__PURE__ */ d.jsx(Nt, { path: "/advanced/learning", element: /* @__PURE__ */ d.jsx(Op, {}) }),
      /* @__PURE__ */ d.jsx(Nt, { path: "/advanced/trends", element: /* @__PURE__ */ d.jsx(Np, {}) }),
      /* @__PURE__ */ d.jsx(Nt, { path: "/advanced/history", element: /* @__PURE__ */ d.jsx(Mp, {}) }),
      /* @__PURE__ */ d.jsx(Nt, { path: "/system", element: /* @__PURE__ */ d.jsx(Cp, {}) }),
      /* @__PURE__ */ d.jsx(Nt, { path: "*", element: /* @__PURE__ */ d.jsx(di, { to: "/ops/home", replace: !0 }) })
    ] })
  ] });
}
function Yp({ hass: i }) {
  return /* @__PURE__ */ d.jsx(hp, { hass: i, children: /* @__PURE__ */ d.jsx(Lp, {}) });
}
function Gp({
  panel: i
}) {
  const [s, o] = j.useState(() => i.hass);
  return j.useEffect(() => {
    const f = () => o(i.hass);
    f();
    const h = window.setInterval(f, 500);
    return i.addEventListener("hass-updated", f), () => {
      window.clearInterval(h), i.removeEventListener("hass-updated", f);
    };
  }, [i]), /* @__PURE__ */ d.jsx(lp, { children: /* @__PURE__ */ d.jsx(Yp, { hass: s }) });
}
class Xp extends HTMLElement {
  constructor() {
    super(...arguments);
    oi(this, "_root", null);
    oi(this, "_hass", null);
    oi(this, "_mounted", !1);
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
      o.textContent = `:host{display:block;height:100%;background:#070907;color:#f4f7f4;}
${qp}`, this.shadowRoot.appendChild(o);
      const f = document.createElement("div");
      f.className = "dsc-root", f.style.height = "100%", this.shadowRoot.appendChild(f), this._root = Dy.createRoot(f), this._root.render(/* @__PURE__ */ d.jsx(Gp, { panel: this })), this._mounted = !0;
    }
  }
  disconnectedCallback() {
    this._root?.unmount(), this._root = null, this._mounted = !1;
  }
}
customElements.get("dsc-hub-panel") || customElements.define("dsc-hub-panel", Xp);
export {
  Xp as default
};
//# sourceMappingURL=dsc-hub-panel.js.map
