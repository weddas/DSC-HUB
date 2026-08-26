var Jv = Object.defineProperty;
var Pv = (a, i, c) => i in a ? Jv(a, i, { enumerable: !0, configurable: !0, writable: !0, value: c }) : a[i] = c;
var Nc = (a, i, c) => Pv(a, typeof i != "symbol" ? i + "" : i, c);
var Eu = { exports: {} }, Wl = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var kp;
function Wv() {
  if (kp) return Wl;
  kp = 1;
  var a = Symbol.for("react.transitional.element"), i = Symbol.for("react.fragment");
  function c(o, d, f) {
    var h = null;
    if (f !== void 0 && (h = "" + f), d.key !== void 0 && (h = "" + d.key), "key" in d) {
      f = {};
      for (var m in d)
        m !== "key" && (f[m] = d[m]);
    } else f = d;
    return d = f.ref, {
      $$typeof: a,
      type: o,
      key: h,
      ref: d !== void 0 ? d : null,
      props: f
    };
  }
  return Wl.Fragment = i, Wl.jsx = c, Wl.jsxs = c, Wl;
}
var Np;
function Iv() {
  return Np || (Np = 1, Eu.exports = Wv()), Eu.exports;
}
var l = Iv(), Mu = { exports: {} }, ve = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Cp;
function ex() {
  if (Cp) return ve;
  Cp = 1;
  var a = Symbol.for("react.transitional.element"), i = Symbol.for("react.portal"), c = Symbol.for("react.fragment"), o = Symbol.for("react.strict_mode"), d = Symbol.for("react.profiler"), f = Symbol.for("react.consumer"), h = Symbol.for("react.context"), m = Symbol.for("react.forward_ref"), _ = Symbol.for("react.suspense"), b = Symbol.for("react.memo"), v = Symbol.for("react.lazy"), g = Symbol.for("react.activity"), j = Symbol.iterator;
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
  }, E = Object.assign, N = {};
  function C(k, F, I) {
    this.props = k, this.context = F, this.refs = N, this.updater = I || S;
  }
  C.prototype.isReactComponent = {}, C.prototype.setState = function(k, F) {
    if (typeof k != "object" && typeof k != "function" && k != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, k, F, "setState");
  }, C.prototype.forceUpdate = function(k) {
    this.updater.enqueueForceUpdate(this, k, "forceUpdate");
  };
  function O() {
  }
  O.prototype = C.prototype;
  function B(k, F, I) {
    this.props = k, this.context = F, this.refs = N, this.updater = I || S;
  }
  var J = B.prototype = new O();
  J.constructor = B, E(J, C.prototype), J.isPureReactComponent = !0;
  var P = Array.isArray;
  function G() {
  }
  var X = { H: null, A: null, T: null, S: null }, W = Object.prototype.hasOwnProperty;
  function se(k, F, I) {
    var ae = I.ref;
    return {
      $$typeof: a,
      type: k,
      key: F,
      ref: ae !== void 0 ? ae : null,
      props: I
    };
  }
  function ue(k, F) {
    return se(k.type, F, k.props);
  }
  function de(k) {
    return typeof k == "object" && k !== null && k.$$typeof === a;
  }
  function Y(k) {
    var F = { "=": "=0", ":": "=2" };
    return "$" + k.replace(/[=:]/g, function(I) {
      return F[I];
    });
  }
  var ie = /\/+/g;
  function te(k, F) {
    return typeof k == "object" && k !== null && k.key != null ? Y("" + k.key) : F.toString(36);
  }
  function A(k) {
    switch (k.status) {
      case "fulfilled":
        return k.value;
      case "rejected":
        throw k.reason;
      default:
        switch (typeof k.status == "string" ? k.then(G, G) : (k.status = "pending", k.then(
          function(F) {
            k.status === "pending" && (k.status = "fulfilled", k.value = F);
          },
          function(F) {
            k.status === "pending" && (k.status = "rejected", k.reason = F);
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
  function T(k, F, I, ae, me) {
    var he = typeof k;
    (he === "undefined" || he === "boolean") && (k = null);
    var ge = !1;
    if (k === null) ge = !0;
    else
      switch (he) {
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
              return ge = k._init, T(
                ge(k._payload),
                F,
                I,
                ae,
                me
              );
          }
      }
    if (ge)
      return me = me(k), ge = ae === "" ? "." + te(k, 0) : ae, P(me) ? (I = "", ge != null && (I = ge.replace(ie, "$&/") + "/"), T(me, F, I, "", function(lt) {
        return lt;
      })) : me != null && (de(me) && (me = ue(
        me,
        I + (me.key == null || k && k.key === me.key ? "" : ("" + me.key).replace(
          ie,
          "$&/"
        ) + "/") + ge
      )), F.push(me)), 1;
    ge = 0;
    var Le = ae === "" ? "." : ae + ":";
    if (P(k))
      for (var Se = 0; Se < k.length; Se++)
        ae = k[Se], he = Le + te(ae, Se), ge += T(
          ae,
          F,
          I,
          he,
          me
        );
    else if (Se = w(k), typeof Se == "function")
      for (k = Se.call(k), Se = 0; !(ae = k.next()).done; )
        ae = ae.value, he = Le + te(ae, Se++), ge += T(
          ae,
          F,
          I,
          he,
          me
        );
    else if (he === "object") {
      if (typeof k.then == "function")
        return T(
          A(k),
          F,
          I,
          ae,
          me
        );
      throw F = String(k), Error(
        "Objects are not valid as a React child (found: " + (F === "[object Object]" ? "object with keys {" + Object.keys(k).join(", ") + "}" : F) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return ge;
  }
  function $(k, F, I) {
    if (k == null) return k;
    var ae = [], me = 0;
    return T(k, ae, "", "", function(he) {
      return F.call(I, he, me++);
    }), ae;
  }
  function Q(k) {
    if (k._status === -1) {
      var F = k._result;
      F = F(), F.then(
        function(I) {
          (k._status === 0 || k._status === -1) && (k._status = 1, k._result = I);
        },
        function(I) {
          (k._status === 0 || k._status === -1) && (k._status = 2, k._result = I);
        }
      ), k._status === -1 && (k._status = 0, k._result = F);
    }
    if (k._status === 1) return k._result.default;
    throw k._result;
  }
  var ne = typeof reportError == "function" ? reportError : function(k) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var F = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof k == "object" && k !== null && typeof k.message == "string" ? String(k.message) : String(k),
        error: k
      });
      if (!window.dispatchEvent(F)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", k);
      return;
    }
    console.error(k);
  }, le = {
    map: $,
    forEach: function(k, F, I) {
      $(
        k,
        function() {
          F.apply(this, arguments);
        },
        I
      );
    },
    count: function(k) {
      var F = 0;
      return $(k, function() {
        F++;
      }), F;
    },
    toArray: function(k) {
      return $(k, function(F) {
        return F;
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
  return ve.Activity = g, ve.Children = le, ve.Component = C, ve.Fragment = c, ve.Profiler = d, ve.PureComponent = B, ve.StrictMode = o, ve.Suspense = _, ve.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = X, ve.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(k) {
      return X.H.useMemoCache(k);
    }
  }, ve.cache = function(k) {
    return function() {
      return k.apply(null, arguments);
    };
  }, ve.cacheSignal = function() {
    return null;
  }, ve.cloneElement = function(k, F, I) {
    if (k == null)
      throw Error(
        "The argument must be a React element, but you passed " + k + "."
      );
    var ae = E({}, k.props), me = k.key;
    if (F != null)
      for (he in F.key !== void 0 && (me = "" + F.key), F)
        !W.call(F, he) || he === "key" || he === "__self" || he === "__source" || he === "ref" && F.ref === void 0 || (ae[he] = F[he]);
    var he = arguments.length - 2;
    if (he === 1) ae.children = I;
    else if (1 < he) {
      for (var ge = Array(he), Le = 0; Le < he; Le++)
        ge[Le] = arguments[Le + 2];
      ae.children = ge;
    }
    return se(k.type, me, ae);
  }, ve.createContext = function(k) {
    return k = {
      $$typeof: h,
      _currentValue: k,
      _currentValue2: k,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, k.Provider = k, k.Consumer = {
      $$typeof: f,
      _context: k
    }, k;
  }, ve.createElement = function(k, F, I) {
    var ae, me = {}, he = null;
    if (F != null)
      for (ae in F.key !== void 0 && (he = "" + F.key), F)
        W.call(F, ae) && ae !== "key" && ae !== "__self" && ae !== "__source" && (me[ae] = F[ae]);
    var ge = arguments.length - 2;
    if (ge === 1) me.children = I;
    else if (1 < ge) {
      for (var Le = Array(ge), Se = 0; Se < ge; Se++)
        Le[Se] = arguments[Se + 2];
      me.children = Le;
    }
    if (k && k.defaultProps)
      for (ae in ge = k.defaultProps, ge)
        me[ae] === void 0 && (me[ae] = ge[ae]);
    return se(k, he, me);
  }, ve.createRef = function() {
    return { current: null };
  }, ve.forwardRef = function(k) {
    return { $$typeof: m, render: k };
  }, ve.isValidElement = de, ve.lazy = function(k) {
    return {
      $$typeof: v,
      _payload: { _status: -1, _result: k },
      _init: Q
    };
  }, ve.memo = function(k, F) {
    return {
      $$typeof: b,
      type: k,
      compare: F === void 0 ? null : F
    };
  }, ve.startTransition = function(k) {
    var F = X.T, I = {};
    X.T = I;
    try {
      var ae = k(), me = X.S;
      me !== null && me(I, ae), typeof ae == "object" && ae !== null && typeof ae.then == "function" && ae.then(G, ne);
    } catch (he) {
      ne(he);
    } finally {
      F !== null && I.types !== null && (F.types = I.types), X.T = F;
    }
  }, ve.unstable_useCacheRefresh = function() {
    return X.H.useCacheRefresh();
  }, ve.use = function(k) {
    return X.H.use(k);
  }, ve.useActionState = function(k, F, I) {
    return X.H.useActionState(k, F, I);
  }, ve.useCallback = function(k, F) {
    return X.H.useCallback(k, F);
  }, ve.useContext = function(k) {
    return X.H.useContext(k);
  }, ve.useDebugValue = function() {
  }, ve.useDeferredValue = function(k, F) {
    return X.H.useDeferredValue(k, F);
  }, ve.useEffect = function(k, F) {
    return X.H.useEffect(k, F);
  }, ve.useEffectEvent = function(k) {
    return X.H.useEffectEvent(k);
  }, ve.useId = function() {
    return X.H.useId();
  }, ve.useImperativeHandle = function(k, F, I) {
    return X.H.useImperativeHandle(k, F, I);
  }, ve.useInsertionEffect = function(k, F) {
    return X.H.useInsertionEffect(k, F);
  }, ve.useLayoutEffect = function(k, F) {
    return X.H.useLayoutEffect(k, F);
  }, ve.useMemo = function(k, F) {
    return X.H.useMemo(k, F);
  }, ve.useOptimistic = function(k, F) {
    return X.H.useOptimistic(k, F);
  }, ve.useReducer = function(k, F, I) {
    return X.H.useReducer(k, F, I);
  }, ve.useRef = function(k) {
    return X.H.useRef(k);
  }, ve.useState = function(k) {
    return X.H.useState(k);
  }, ve.useSyncExternalStore = function(k, F, I) {
    return X.H.useSyncExternalStore(
      k,
      F,
      I
    );
  }, ve.useTransition = function() {
    return X.H.useTransition();
  }, ve.version = "19.2.8", ve;
}
var Ep;
function nd() {
  return Ep || (Ep = 1, Mu.exports = ex()), Mu.exports;
}
var y = nd(), Tu = { exports: {} }, Il = {}, Au = { exports: {} }, Ru = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Mp;
function tx() {
  return Mp || (Mp = 1, (function(a) {
    function i(T, $) {
      var Q = T.length;
      T.push($);
      e: for (; 0 < Q; ) {
        var ne = Q - 1 >>> 1, le = T[ne];
        if (0 < d(le, $))
          T[ne] = $, T[Q] = le, Q = ne;
        else break e;
      }
    }
    function c(T) {
      return T.length === 0 ? null : T[0];
    }
    function o(T) {
      if (T.length === 0) return null;
      var $ = T[0], Q = T.pop();
      if (Q !== $) {
        T[0] = Q;
        e: for (var ne = 0, le = T.length, k = le >>> 1; ne < k; ) {
          var F = 2 * (ne + 1) - 1, I = T[F], ae = F + 1, me = T[ae];
          if (0 > d(I, Q))
            ae < le && 0 > d(me, I) ? (T[ne] = me, T[ae] = Q, ne = ae) : (T[ne] = I, T[F] = Q, ne = F);
          else if (ae < le && 0 > d(me, Q))
            T[ne] = me, T[ae] = Q, ne = ae;
          else break e;
        }
      }
      return $;
    }
    function d(T, $) {
      var Q = T.sortIndex - $.sortIndex;
      return Q !== 0 ? Q : T.id - $.id;
    }
    if (a.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var f = performance;
      a.unstable_now = function() {
        return f.now();
      };
    } else {
      var h = Date, m = h.now();
      a.unstable_now = function() {
        return h.now() - m;
      };
    }
    var _ = [], b = [], v = 1, g = null, j = 3, w = !1, S = !1, E = !1, N = !1, C = typeof setTimeout == "function" ? setTimeout : null, O = typeof clearTimeout == "function" ? clearTimeout : null, B = typeof setImmediate < "u" ? setImmediate : null;
    function J(T) {
      for (var $ = c(b); $ !== null; ) {
        if ($.callback === null) o(b);
        else if ($.startTime <= T)
          o(b), $.sortIndex = $.expirationTime, i(_, $);
        else break;
        $ = c(b);
      }
    }
    function P(T) {
      if (E = !1, J(T), !S)
        if (c(_) !== null)
          S = !0, G || (G = !0, Y());
        else {
          var $ = c(b);
          $ !== null && A(P, $.startTime - T);
        }
    }
    var G = !1, X = -1, W = 5, se = -1;
    function ue() {
      return N ? !0 : !(a.unstable_now() - se < W);
    }
    function de() {
      if (N = !1, G) {
        var T = a.unstable_now();
        se = T;
        var $ = !0;
        try {
          e: {
            S = !1, E && (E = !1, O(X), X = -1), w = !0;
            var Q = j;
            try {
              t: {
                for (J(T), g = c(_); g !== null && !(g.expirationTime > T && ue()); ) {
                  var ne = g.callback;
                  if (typeof ne == "function") {
                    g.callback = null, j = g.priorityLevel;
                    var le = ne(
                      g.expirationTime <= T
                    );
                    if (T = a.unstable_now(), typeof le == "function") {
                      g.callback = le, J(T), $ = !0;
                      break t;
                    }
                    g === c(_) && o(_), J(T);
                  } else o(_);
                  g = c(_);
                }
                if (g !== null) $ = !0;
                else {
                  var k = c(b);
                  k !== null && A(
                    P,
                    k.startTime - T
                  ), $ = !1;
                }
              }
              break e;
            } finally {
              g = null, j = Q, w = !1;
            }
            $ = void 0;
          }
        } finally {
          $ ? Y() : G = !1;
        }
      }
    }
    var Y;
    if (typeof B == "function")
      Y = function() {
        B(de);
      };
    else if (typeof MessageChannel < "u") {
      var ie = new MessageChannel(), te = ie.port2;
      ie.port1.onmessage = de, Y = function() {
        te.postMessage(null);
      };
    } else
      Y = function() {
        C(de, 0);
      };
    function A(T, $) {
      X = C(function() {
        T(a.unstable_now());
      }, $);
    }
    a.unstable_IdlePriority = 5, a.unstable_ImmediatePriority = 1, a.unstable_LowPriority = 4, a.unstable_NormalPriority = 3, a.unstable_Profiling = null, a.unstable_UserBlockingPriority = 2, a.unstable_cancelCallback = function(T) {
      T.callback = null;
    }, a.unstable_forceFrameRate = function(T) {
      0 > T || 125 < T ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : W = 0 < T ? Math.floor(1e3 / T) : 5;
    }, a.unstable_getCurrentPriorityLevel = function() {
      return j;
    }, a.unstable_next = function(T) {
      switch (j) {
        case 1:
        case 2:
        case 3:
          var $ = 3;
          break;
        default:
          $ = j;
      }
      var Q = j;
      j = $;
      try {
        return T();
      } finally {
        j = Q;
      }
    }, a.unstable_requestPaint = function() {
      N = !0;
    }, a.unstable_runWithPriority = function(T, $) {
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
      var Q = j;
      j = T;
      try {
        return $();
      } finally {
        j = Q;
      }
    }, a.unstable_scheduleCallback = function(T, $, Q) {
      var ne = a.unstable_now();
      switch (typeof Q == "object" && Q !== null ? (Q = Q.delay, Q = typeof Q == "number" && 0 < Q ? ne + Q : ne) : Q = ne, T) {
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
      return le = Q + le, T = {
        id: v++,
        callback: $,
        priorityLevel: T,
        startTime: Q,
        expirationTime: le,
        sortIndex: -1
      }, Q > ne ? (T.sortIndex = Q, i(b, T), c(_) === null && T === c(b) && (E ? (O(X), X = -1) : E = !0, A(P, Q - ne))) : (T.sortIndex = le, i(_, T), S || w || (S = !0, G || (G = !0, Y()))), T;
    }, a.unstable_shouldYield = ue, a.unstable_wrapCallback = function(T) {
      var $ = j;
      return function() {
        var Q = j;
        j = $;
        try {
          return T.apply(this, arguments);
        } finally {
          j = Q;
        }
      };
    };
  })(Ru)), Ru;
}
var Tp;
function nx() {
  return Tp || (Tp = 1, Au.exports = tx()), Au.exports;
}
var Ou = { exports: {} }, Et = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ap;
function ax() {
  if (Ap) return Et;
  Ap = 1;
  var a = nd();
  function i(_) {
    var b = "https://react.dev/errors/" + _;
    if (1 < arguments.length) {
      b += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var v = 2; v < arguments.length; v++)
        b += "&args[]=" + encodeURIComponent(arguments[v]);
    }
    return "Minified React error #" + _ + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function c() {
  }
  var o = {
    d: {
      f: c,
      r: function() {
        throw Error(i(522));
      },
      D: c,
      C: c,
      L: c,
      m: c,
      X: c,
      S: c,
      M: c
    },
    p: 0,
    findDOMNode: null
  }, d = Symbol.for("react.portal");
  function f(_, b, v) {
    var g = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: d,
      key: g == null ? null : "" + g,
      children: _,
      containerInfo: b,
      implementation: v
    };
  }
  var h = a.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function m(_, b) {
    if (_ === "font") return "";
    if (typeof b == "string")
      return b === "use-credentials" ? b : "";
  }
  return Et.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o, Et.createPortal = function(_, b) {
    var v = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!b || b.nodeType !== 1 && b.nodeType !== 9 && b.nodeType !== 11)
      throw Error(i(299));
    return f(_, b, null, v);
  }, Et.flushSync = function(_) {
    var b = h.T, v = o.p;
    try {
      if (h.T = null, o.p = 2, _) return _();
    } finally {
      h.T = b, o.p = v, o.d.f();
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
    return h.H.useFormState(_, b, v);
  }, Et.useFormStatus = function() {
    return h.H.useHostTransitionStatus();
  }, Et.version = "19.2.8", Et;
}
var Rp;
function sx() {
  if (Rp) return Ou.exports;
  Rp = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (i) {
        console.error(i);
      }
  }
  return a(), Ou.exports = ax(), Ou.exports;
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
var Op;
function lx() {
  if (Op) return Il;
  Op = 1;
  var a = nx(), i = nd(), c = sx();
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
  function f(e) {
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
  function h(e) {
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
    if (f(e) !== e)
      throw Error(o(188));
  }
  function b(e) {
    var t = e.alternate;
    if (!t) {
      if (t = f(e), t === null) throw Error(o(188));
      return t !== e ? null : e;
    }
    for (var n = e, s = t; ; ) {
      var r = n.return;
      if (r === null) break;
      var u = r.alternate;
      if (u === null) {
        if (s = r.return, s !== null) {
          n = s;
          continue;
        }
        break;
      }
      if (r.child === u.child) {
        for (u = r.child; u; ) {
          if (u === n) return _(r), e;
          if (u === s) return _(r), t;
          u = u.sibling;
        }
        throw Error(o(188));
      }
      if (n.return !== s.return) n = r, s = u;
      else {
        for (var p = !1, x = r.child; x; ) {
          if (x === n) {
            p = !0, n = r, s = u;
            break;
          }
          if (x === s) {
            p = !0, s = r, n = u;
            break;
          }
          x = x.sibling;
        }
        if (!p) {
          for (x = u.child; x; ) {
            if (x === n) {
              p = !0, n = u, s = r;
              break;
            }
            if (x === s) {
              p = !0, s = u, n = r;
              break;
            }
            x = x.sibling;
          }
          if (!p) throw Error(o(189));
        }
      }
      if (n.alternate !== s) throw Error(o(190));
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
  var g = Object.assign, j = Symbol.for("react.element"), w = Symbol.for("react.transitional.element"), S = Symbol.for("react.portal"), E = Symbol.for("react.fragment"), N = Symbol.for("react.strict_mode"), C = Symbol.for("react.profiler"), O = Symbol.for("react.consumer"), B = Symbol.for("react.context"), J = Symbol.for("react.forward_ref"), P = Symbol.for("react.suspense"), G = Symbol.for("react.suspense_list"), X = Symbol.for("react.memo"), W = Symbol.for("react.lazy"), se = Symbol.for("react.activity"), ue = Symbol.for("react.memo_cache_sentinel"), de = Symbol.iterator;
  function Y(e) {
    return e === null || typeof e != "object" ? null : (e = de && e[de] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var ie = Symbol.for("react.client.reference");
  function te(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === ie ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case E:
        return "Fragment";
      case C:
        return "Profiler";
      case N:
        return "StrictMode";
      case P:
        return "Suspense";
      case G:
        return "SuspenseList";
      case se:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case S:
          return "Portal";
        case B:
          return e.displayName || "Context";
        case O:
          return (e._context.displayName || "Context") + ".Consumer";
        case J:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case X:
          return t = e.displayName || null, t !== null ? t : te(e.type) || "Memo";
        case W:
          t = e._payload, e = e._init;
          try {
            return te(e(t));
          } catch {
          }
      }
    return null;
  }
  var A = Array.isArray, T = i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, $ = c.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Q = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, ne = [], le = -1;
  function k(e) {
    return { current: e };
  }
  function F(e) {
    0 > le || (e.current = ne[le], ne[le] = null, le--);
  }
  function I(e, t) {
    le++, ne[le] = e.current, e.current = t;
  }
  var ae = k(null), me = k(null), he = k(null), ge = k(null);
  function Le(e, t) {
    switch (I(he, t), I(me, e), I(ae, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? Zm(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = Zm(t), e = Km(t, e);
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
    F(ae), I(ae, e);
  }
  function Se() {
    F(ae), F(me), F(he);
  }
  function lt(e) {
    e.memoizedState !== null && I(ge, e);
    var t = ae.current, n = Km(t, e.type);
    t !== n && (I(me, e), I(ae, n));
  }
  function pt(e) {
    me.current === e && (F(ae), F(me)), ge.current === e && (F(ge), Zl._currentValue = Q);
  }
  var je, it;
  function ee(e) {
    if (je === void 0)
      try {
        throw Error();
      } catch (n) {
        var t = n.stack.trim().match(/\n( *(at )?)/);
        je = t && t[1] || "", it = -1 < n.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < n.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + je + e + it;
  }
  var $e = !1;
  function We(e, t) {
    if (!e || $e) return "";
    $e = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var s = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var K = function() {
                throw Error();
              };
              if (Object.defineProperty(K.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(K, []);
                } catch (V) {
                  var U = V;
                }
                Reflect.construct(e, [], K);
              } else {
                try {
                  K.call();
                } catch (V) {
                  U = V;
                }
                e.call(K.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (V) {
                U = V;
              }
              (K = e()) && typeof K.catch == "function" && K.catch(function() {
              });
            }
          } catch (V) {
            if (V && U && typeof V.stack == "string")
              return [V.stack, U.stack];
          }
          return [null, null];
        }
      };
      s.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var r = Object.getOwnPropertyDescriptor(
        s.DetermineComponentFrameRoot,
        "name"
      );
      r && r.configurable && Object.defineProperty(
        s.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var u = s.DetermineComponentFrameRoot(), p = u[0], x = u[1];
      if (p && x) {
        var M = p.split(`
`), L = x.split(`
`);
        for (r = s = 0; s < M.length && !M[s].includes("DetermineComponentFrameRoot"); )
          s++;
        for (; r < L.length && !L[r].includes(
          "DetermineComponentFrameRoot"
        ); )
          r++;
        if (s === M.length || r === L.length)
          for (s = M.length - 1, r = L.length - 1; 1 <= s && 0 <= r && M[s] !== L[r]; )
            r--;
        for (; 1 <= s && 0 <= r; s--, r--)
          if (M[s] !== L[r]) {
            if (s !== 1 || r !== 1)
              do
                if (s--, r--, 0 > r || M[s] !== L[r]) {
                  var q = `
` + M[s].replace(" at new ", " at ");
                  return e.displayName && q.includes("<anonymous>") && (q = q.replace("<anonymous>", e.displayName)), q;
                }
              while (1 <= s && 0 <= r);
            break;
          }
      }
    } finally {
      $e = !1, Error.prepareStackTrace = n;
    }
    return (n = e ? e.displayName || e.name : "") ? ee(n) : "";
  }
  function _t(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return ee(e.type);
      case 16:
        return ee("Lazy");
      case 13:
        return e.child !== t && t !== null ? ee("Suspense Fallback") : ee("Suspense");
      case 19:
        return ee("SuspenseList");
      case 0:
      case 15:
        return We(e.type, !1);
      case 11:
        return We(e.type.render, !1);
      case 1:
        return We(e.type, !0);
      case 31:
        return ee("Activity");
      default:
        return "";
    }
  }
  function Ie(e) {
    try {
      var t = "", n = null;
      do
        t += _t(e, n), n = e, e = e.return;
      while (e);
      return t;
    } catch (s) {
      return `
Error generating stack: ` + s.message + `
` + s.stack;
    }
  }
  var Re = Object.prototype.hasOwnProperty, Dt = a.unstable_scheduleCallback, Ht = a.unstable_cancelCallback, an = a.unstable_shouldYield, Qt = a.unstable_requestPaint, nt = a.unstable_now, ll = a.unstable_getCurrentPriorityLevel, Ae = a.unstable_ImmediatePriority, os = a.unstable_UserBlockingPriority, us = a.unstable_NormalPriority, dr = a.unstable_LowPriority, ui = a.unstable_IdlePriority, fr = a.log, hr = a.unstable_setDisableYieldValue, La = null, Rt = null;
  function gn(e) {
    if (typeof fr == "function" && hr(e), Rt && typeof Rt.setStrictMode == "function")
      try {
        Rt.setStrictMode(La, e);
      } catch {
      }
  }
  var Ct = Math.clz32 ? Math.clz32 : mr, il = Math.log, Nn = Math.LN2;
  function mr(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (il(e) / Nn | 0) | 0;
  }
  var ds = 256, di = 262144, fi = 4194304;
  function $a(e) {
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
  function hi(e, t, n) {
    var s = e.pendingLanes;
    if (s === 0) return 0;
    var r = 0, u = e.suspendedLanes, p = e.pingedLanes;
    e = e.warmLanes;
    var x = s & 134217727;
    return x !== 0 ? (s = x & ~u, s !== 0 ? r = $a(s) : (p &= x, p !== 0 ? r = $a(p) : n || (n = x & ~e, n !== 0 && (r = $a(n))))) : (x = s & ~u, x !== 0 ? r = $a(x) : p !== 0 ? r = $a(p) : n || (n = s & ~e, n !== 0 && (r = $a(n)))), r === 0 ? 0 : t !== 0 && t !== r && (t & u) === 0 && (u = r & -r, n = t & -t, u >= n || u === 32 && (n & 4194048) !== 0) ? t : r;
  }
  function cl(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function Lb(e, t) {
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
  function Ed() {
    var e = fi;
    return fi <<= 1, (fi & 62914560) === 0 && (fi = 4194304), e;
  }
  function pr(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function rl(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function $b(e, t, n, s, r, u) {
    var p = e.pendingLanes;
    e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
    var x = e.entanglements, M = e.expirationTimes, L = e.hiddenUpdates;
    for (n = p & ~n; 0 < n; ) {
      var q = 31 - Ct(n), K = 1 << q;
      x[q] = 0, M[q] = -1;
      var U = L[q];
      if (U !== null)
        for (L[q] = null, q = 0; q < U.length; q++) {
          var V = U[q];
          V !== null && (V.lane &= -536870913);
        }
      n &= ~K;
    }
    s !== 0 && Md(e, s, 0), u !== 0 && r === 0 && e.tag !== 0 && (e.suspendedLanes |= u & ~(p & ~t));
  }
  function Md(e, t, n) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var s = 31 - Ct(t);
    e.entangledLanes |= t, e.entanglements[s] = e.entanglements[s] | 1073741824 | n & 261930;
  }
  function Td(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var s = 31 - Ct(n), r = 1 << s;
      r & t | e[s] & t && (e[s] |= t), n &= ~r;
    }
  }
  function Ad(e, t) {
    var n = t & -t;
    return n = (n & 42) !== 0 ? 1 : _r(n), (n & (e.suspendedLanes | t)) !== 0 ? 0 : n;
  }
  function _r(e) {
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
  function br(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Rd() {
    var e = $.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : gp(e.type));
  }
  function Od(e, t) {
    var n = $.p;
    try {
      return $.p = e, t();
    } finally {
      $.p = n;
    }
  }
  var la = Math.random().toString(36).slice(2), vt = "__reactFiber$" + la, Lt = "__reactProps$" + la, fs = "__reactContainer$" + la, gr = "__reactEvents$" + la, Ub = "__reactListeners$" + la, Bb = "__reactHandles$" + la, zd = "__reactResources$" + la, ol = "__reactMarker$" + la;
  function vr(e) {
    delete e[vt], delete e[Lt], delete e[gr], delete e[Ub], delete e[Bb];
  }
  function hs(e) {
    var t = e[vt];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[fs] || n[vt]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null)
          for (e = np(e); e !== null; ) {
            if (n = e[vt]) return n;
            e = np(e);
          }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function ms(e) {
    if (e = e[vt] || e[fs]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function ul(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(o(33));
  }
  function ps(e) {
    var t = e[zd];
    return t || (t = e[zd] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function bt(e) {
    e[ol] = !0;
  }
  var Dd = /* @__PURE__ */ new Set(), Hd = {};
  function Ua(e, t) {
    _s(e, t), _s(e + "Capture", t);
  }
  function _s(e, t) {
    for (Hd[e] = t, e = 0; e < t.length; e++)
      Dd.add(t[e]);
  }
  var Fb = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Ld = {}, $d = {};
  function Gb(e) {
    return Re.call($d, e) ? !0 : Re.call(Ld, e) ? !1 : Fb.test(e) ? $d[e] = !0 : (Ld[e] = !0, !1);
  }
  function mi(e, t, n) {
    if (Gb(t))
      if (n === null) e.removeAttribute(t);
      else {
        switch (typeof n) {
          case "undefined":
          case "function":
          case "symbol":
            e.removeAttribute(t);
            return;
          case "boolean":
            var s = t.toLowerCase().slice(0, 5);
            if (s !== "data-" && s !== "aria-") {
              e.removeAttribute(t);
              return;
            }
        }
        e.setAttribute(t, "" + n);
      }
  }
  function pi(e, t, n) {
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
  function Dn(e, t, n, s) {
    if (s === null) e.removeAttribute(n);
    else {
      switch (typeof s) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(n);
          return;
      }
      e.setAttributeNS(t, n, "" + s);
    }
  }
  function sn(e) {
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
  function Ud(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Vb(e, t, n) {
    var s = Object.getOwnPropertyDescriptor(
      e.constructor.prototype,
      t
    );
    if (!e.hasOwnProperty(t) && typeof s < "u" && typeof s.get == "function" && typeof s.set == "function") {
      var r = s.get, u = s.set;
      return Object.defineProperty(e, t, {
        configurable: !0,
        get: function() {
          return r.call(this);
        },
        set: function(p) {
          n = "" + p, u.call(this, p);
        }
      }), Object.defineProperty(e, t, {
        enumerable: s.enumerable
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
  function xr(e) {
    if (!e._valueTracker) {
      var t = Ud(e) ? "checked" : "value";
      e._valueTracker = Vb(
        e,
        t,
        "" + e[t]
      );
    }
  }
  function Bd(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), s = "";
    return e && (s = Ud(e) ? e.checked ? "true" : "false" : e.value), e = s, e !== n ? (t.setValue(e), !0) : !1;
  }
  function _i(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var Yb = /[\n"\\]/g;
  function ln(e) {
    return e.replace(
      Yb,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function yr(e, t, n, s, r, u, p, x) {
    e.name = "", p != null && typeof p != "function" && typeof p != "symbol" && typeof p != "boolean" ? e.type = p : e.removeAttribute("type"), t != null ? p === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + sn(t)) : e.value !== "" + sn(t) && (e.value = "" + sn(t)) : p !== "submit" && p !== "reset" || e.removeAttribute("value"), t != null ? wr(e, p, sn(t)) : n != null ? wr(e, p, sn(n)) : s != null && e.removeAttribute("value"), r == null && u != null && (e.defaultChecked = !!u), r != null && (e.checked = r && typeof r != "function" && typeof r != "symbol"), x != null && typeof x != "function" && typeof x != "symbol" && typeof x != "boolean" ? e.name = "" + sn(x) : e.removeAttribute("name");
  }
  function Fd(e, t, n, s, r, u, p, x) {
    if (u != null && typeof u != "function" && typeof u != "symbol" && typeof u != "boolean" && (e.type = u), t != null || n != null) {
      if (!(u !== "submit" && u !== "reset" || t != null)) {
        xr(e);
        return;
      }
      n = n != null ? "" + sn(n) : "", t = t != null ? "" + sn(t) : n, x || t === e.value || (e.value = t), e.defaultValue = t;
    }
    s = s ?? r, s = typeof s != "function" && typeof s != "symbol" && !!s, e.checked = x ? e.checked : !!s, e.defaultChecked = !!s, p != null && typeof p != "function" && typeof p != "symbol" && typeof p != "boolean" && (e.name = p), xr(e);
  }
  function wr(e, t, n) {
    t === "number" && _i(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
  }
  function bs(e, t, n, s) {
    if (e = e.options, t) {
      t = {};
      for (var r = 0; r < n.length; r++)
        t["$" + n[r]] = !0;
      for (n = 0; n < e.length; n++)
        r = t.hasOwnProperty("$" + e[n].value), e[n].selected !== r && (e[n].selected = r), r && s && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + sn(n), t = null, r = 0; r < e.length; r++) {
        if (e[r].value === n) {
          e[r].selected = !0, s && (e[r].defaultSelected = !0);
          return;
        }
        t !== null || e[r].disabled || (t = e[r]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Gd(e, t, n) {
    if (t != null && (t = "" + sn(t), t !== e.value && (e.value = t), n == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = n != null ? "" + sn(n) : "";
  }
  function Vd(e, t, n, s) {
    if (t == null) {
      if (s != null) {
        if (n != null) throw Error(o(92));
        if (A(s)) {
          if (1 < s.length) throw Error(o(93));
          s = s[0];
        }
        n = s;
      }
      n == null && (n = ""), t = n;
    }
    n = sn(t), e.defaultValue = n, s = e.textContent, s === n && s !== "" && s !== null && (e.value = s), xr(e);
  }
  function gs(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var qb = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Yd(e, t, n) {
    var s = t.indexOf("--") === 0;
    n == null || typeof n == "boolean" || n === "" ? s ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : s ? e.setProperty(t, n) : typeof n != "number" || n === 0 || qb.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
  }
  function qd(e, t, n) {
    if (t != null && typeof t != "object")
      throw Error(o(62));
    if (e = e.style, n != null) {
      for (var s in n)
        !n.hasOwnProperty(s) || t != null && t.hasOwnProperty(s) || (s.indexOf("--") === 0 ? e.setProperty(s, "") : s === "float" ? e.cssFloat = "" : e[s] = "");
      for (var r in t)
        s = t[r], t.hasOwnProperty(r) && n[r] !== s && Yd(e, r, s);
    } else
      for (var u in t)
        t.hasOwnProperty(u) && Yd(e, u, t[u]);
  }
  function jr(e) {
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
  var Xb = /* @__PURE__ */ new Map([
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
  ]), Qb = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function bi(e) {
    return Qb.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  function Hn() {
  }
  var Sr = null;
  function kr(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var vs = null, xs = null;
  function Xd(e) {
    var t = ms(e);
    if (t && (e = t.stateNode)) {
      var n = e[Lt] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (yr(
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
              'input[name="' + ln(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < n.length; t++) {
              var s = n[t];
              if (s !== e && s.form === e.form) {
                var r = s[Lt] || null;
                if (!r) throw Error(o(90));
                yr(
                  s,
                  r.value,
                  r.defaultValue,
                  r.defaultValue,
                  r.checked,
                  r.defaultChecked,
                  r.type,
                  r.name
                );
              }
            }
            for (t = 0; t < n.length; t++)
              s = n[t], s.form === e.form && Bd(s);
          }
          break e;
        case "textarea":
          Gd(e, n.value, n.defaultValue);
          break e;
        case "select":
          t = n.value, t != null && bs(e, !!n.multiple, t, !1);
      }
    }
  }
  var Nr = !1;
  function Qd(e, t, n) {
    if (Nr) return e(t, n);
    Nr = !0;
    try {
      var s = e(t);
      return s;
    } finally {
      if (Nr = !1, (vs !== null || xs !== null) && (sc(), vs && (t = vs, e = xs, xs = vs = null, Xd(t), e)))
        for (t = 0; t < e.length; t++) Xd(e[t]);
    }
  }
  function dl(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var s = n[Lt] || null;
    if (s === null) return null;
    n = s[t];
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
        (s = !s.disabled) || (e = e.type, s = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !s;
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
  var Ln = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Cr = !1;
  if (Ln)
    try {
      var fl = {};
      Object.defineProperty(fl, "passive", {
        get: function() {
          Cr = !0;
        }
      }), window.addEventListener("test", fl, fl), window.removeEventListener("test", fl, fl);
    } catch {
      Cr = !1;
    }
  var ia = null, Er = null, gi = null;
  function Zd() {
    if (gi) return gi;
    var e, t = Er, n = t.length, s, r = "value" in ia ? ia.value : ia.textContent, u = r.length;
    for (e = 0; e < n && t[e] === r[e]; e++) ;
    var p = n - e;
    for (s = 1; s <= p && t[n - s] === r[u - s]; s++) ;
    return gi = r.slice(e, 1 < s ? 1 - s : void 0);
  }
  function vi(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function xi() {
    return !0;
  }
  function Kd() {
    return !1;
  }
  function $t(e) {
    function t(n, s, r, u, p) {
      this._reactName = n, this._targetInst = r, this.type = s, this.nativeEvent = u, this.target = p, this.currentTarget = null;
      for (var x in e)
        e.hasOwnProperty(x) && (n = e[x], this[x] = n ? n(u) : u[x]);
      return this.isDefaultPrevented = (u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1) ? xi : Kd, this.isPropagationStopped = Kd, this;
    }
    return g(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = xi);
      },
      stopPropagation: function() {
        var n = this.nativeEvent;
        n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = xi);
      },
      persist: function() {
      },
      isPersistent: xi
    }), t;
  }
  var Ba = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, yi = $t(Ba), hl = g({}, Ba, { view: 0, detail: 0 }), Zb = $t(hl), Mr, Tr, ml, wi = g({}, hl, {
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
    getModifierState: Rr,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== ml && (ml && e.type === "mousemove" ? (Mr = e.screenX - ml.screenX, Tr = e.screenY - ml.screenY) : Tr = Mr = 0, ml = e), Mr);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : Tr;
    }
  }), Jd = $t(wi), Kb = g({}, wi, { dataTransfer: 0 }), Jb = $t(Kb), Pb = g({}, hl, { relatedTarget: 0 }), Ar = $t(Pb), Wb = g({}, Ba, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Ib = $t(Wb), eg = g({}, Ba, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), tg = $t(eg), ng = g({}, Ba, { data: 0 }), Pd = $t(ng), ag = {
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
  }, sg = {
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
  }, lg = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function ig(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = lg[e]) ? !!t[e] : !1;
  }
  function Rr() {
    return ig;
  }
  var cg = g({}, hl, {
    key: function(e) {
      if (e.key) {
        var t = ag[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = vi(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? sg[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Rr,
    charCode: function(e) {
      return e.type === "keypress" ? vi(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? vi(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), rg = $t(cg), og = g({}, wi, {
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
  }), Wd = $t(og), ug = g({}, hl, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Rr
  }), dg = $t(ug), fg = g({}, Ba, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), hg = $t(fg), mg = g({}, wi, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), pg = $t(mg), _g = g({}, Ba, {
    newState: 0,
    oldState: 0
  }), bg = $t(_g), gg = [9, 13, 27, 32], Or = Ln && "CompositionEvent" in window, pl = null;
  Ln && "documentMode" in document && (pl = document.documentMode);
  var vg = Ln && "TextEvent" in window && !pl, Id = Ln && (!Or || pl && 8 < pl && 11 >= pl), ef = " ", tf = !1;
  function nf(e, t) {
    switch (e) {
      case "keyup":
        return gg.indexOf(t.keyCode) !== -1;
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
  function af(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var ys = !1;
  function xg(e, t) {
    switch (e) {
      case "compositionend":
        return af(t);
      case "keypress":
        return t.which !== 32 ? null : (tf = !0, ef);
      case "textInput":
        return e = t.data, e === ef && tf ? null : e;
      default:
        return null;
    }
  }
  function yg(e, t) {
    if (ys)
      return e === "compositionend" || !Or && nf(e, t) ? (e = Zd(), gi = Er = ia = null, ys = !1, e) : null;
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
        return Id && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var wg = {
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
  function sf(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!wg[e.type] : t === "textarea";
  }
  function lf(e, t, n, s) {
    vs ? xs ? xs.push(s) : xs = [s] : vs = s, t = dc(t, "onChange"), 0 < t.length && (n = new yi(
      "onChange",
      "change",
      null,
      n,
      s
    ), e.push({ event: n, listeners: t }));
  }
  var _l = null, bl = null;
  function jg(e) {
    Gm(e, 0);
  }
  function ji(e) {
    var t = ul(e);
    if (Bd(t)) return e;
  }
  function cf(e, t) {
    if (e === "change") return t;
  }
  var rf = !1;
  if (Ln) {
    var zr;
    if (Ln) {
      var Dr = "oninput" in document;
      if (!Dr) {
        var of = document.createElement("div");
        of.setAttribute("oninput", "return;"), Dr = typeof of.oninput == "function";
      }
      zr = Dr;
    } else zr = !1;
    rf = zr && (!document.documentMode || 9 < document.documentMode);
  }
  function uf() {
    _l && (_l.detachEvent("onpropertychange", df), bl = _l = null);
  }
  function df(e) {
    if (e.propertyName === "value" && ji(bl)) {
      var t = [];
      lf(
        t,
        bl,
        e,
        kr(e)
      ), Qd(jg, t);
    }
  }
  function Sg(e, t, n) {
    e === "focusin" ? (uf(), _l = t, bl = n, _l.attachEvent("onpropertychange", df)) : e === "focusout" && uf();
  }
  function kg(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return ji(bl);
  }
  function Ng(e, t) {
    if (e === "click") return ji(t);
  }
  function Cg(e, t) {
    if (e === "input" || e === "change")
      return ji(t);
  }
  function Eg(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var Zt = typeof Object.is == "function" ? Object.is : Eg;
  function gl(e, t) {
    if (Zt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var n = Object.keys(e), s = Object.keys(t);
    if (n.length !== s.length) return !1;
    for (s = 0; s < n.length; s++) {
      var r = n[s];
      if (!Re.call(t, r) || !Zt(e[r], t[r]))
        return !1;
    }
    return !0;
  }
  function ff(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function hf(e, t) {
    var n = ff(e);
    e = 0;
    for (var s; n; ) {
      if (n.nodeType === 3) {
        if (s = e + n.textContent.length, e <= t && s >= t)
          return { node: n, offset: t - e };
        e = s;
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
      n = ff(n);
    }
  }
  function mf(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? mf(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function pf(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = _i(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = _i(e.document);
    }
    return t;
  }
  function Hr(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var Mg = Ln && "documentMode" in document && 11 >= document.documentMode, ws = null, Lr = null, vl = null, $r = !1;
  function _f(e, t, n) {
    var s = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    $r || ws == null || ws !== _i(s) || (s = ws, "selectionStart" in s && Hr(s) ? s = { start: s.selectionStart, end: s.selectionEnd } : (s = (s.ownerDocument && s.ownerDocument.defaultView || window).getSelection(), s = {
      anchorNode: s.anchorNode,
      anchorOffset: s.anchorOffset,
      focusNode: s.focusNode,
      focusOffset: s.focusOffset
    }), vl && gl(vl, s) || (vl = s, s = dc(Lr, "onSelect"), 0 < s.length && (t = new yi(
      "onSelect",
      "select",
      null,
      t,
      n
    ), e.push({ event: t, listeners: s }), t.target = ws)));
  }
  function Fa(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var js = {
    animationend: Fa("Animation", "AnimationEnd"),
    animationiteration: Fa("Animation", "AnimationIteration"),
    animationstart: Fa("Animation", "AnimationStart"),
    transitionrun: Fa("Transition", "TransitionRun"),
    transitionstart: Fa("Transition", "TransitionStart"),
    transitioncancel: Fa("Transition", "TransitionCancel"),
    transitionend: Fa("Transition", "TransitionEnd")
  }, Ur = {}, bf = {};
  Ln && (bf = document.createElement("div").style, "AnimationEvent" in window || (delete js.animationend.animation, delete js.animationiteration.animation, delete js.animationstart.animation), "TransitionEvent" in window || delete js.transitionend.transition);
  function Ga(e) {
    if (Ur[e]) return Ur[e];
    if (!js[e]) return e;
    var t = js[e], n;
    for (n in t)
      if (t.hasOwnProperty(n) && n in bf)
        return Ur[e] = t[n];
    return e;
  }
  var gf = Ga("animationend"), vf = Ga("animationiteration"), xf = Ga("animationstart"), Tg = Ga("transitionrun"), Ag = Ga("transitionstart"), Rg = Ga("transitioncancel"), yf = Ga("transitionend"), wf = /* @__PURE__ */ new Map(), Br = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Br.push("scrollEnd");
  function vn(e, t) {
    wf.set(e, t), Ua(t, [e]);
  }
  var Si = typeof reportError == "function" ? reportError : function(e) {
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
  }, cn = [], Ss = 0, Fr = 0;
  function ki() {
    for (var e = Ss, t = Fr = Ss = 0; t < e; ) {
      var n = cn[t];
      cn[t++] = null;
      var s = cn[t];
      cn[t++] = null;
      var r = cn[t];
      cn[t++] = null;
      var u = cn[t];
      if (cn[t++] = null, s !== null && r !== null) {
        var p = s.pending;
        p === null ? r.next = r : (r.next = p.next, p.next = r), s.pending = r;
      }
      u !== 0 && jf(n, r, u);
    }
  }
  function Ni(e, t, n, s) {
    cn[Ss++] = e, cn[Ss++] = t, cn[Ss++] = n, cn[Ss++] = s, Fr |= s, e.lanes |= s, e = e.alternate, e !== null && (e.lanes |= s);
  }
  function Gr(e, t, n, s) {
    return Ni(e, t, n, s), Ci(e);
  }
  function Va(e, t) {
    return Ni(e, null, null, t), Ci(e);
  }
  function jf(e, t, n) {
    e.lanes |= n;
    var s = e.alternate;
    s !== null && (s.lanes |= n);
    for (var r = !1, u = e.return; u !== null; )
      u.childLanes |= n, s = u.alternate, s !== null && (s.childLanes |= n), u.tag === 22 && (e = u.stateNode, e === null || e._visibility & 1 || (r = !0)), e = u, u = u.return;
    return e.tag === 3 ? (u = e.stateNode, r && t !== null && (r = 31 - Ct(n), e = u.hiddenUpdates, s = e[r], s === null ? e[r] = [t] : s.push(t), t.lane = n | 536870912), u) : null;
  }
  function Ci(e) {
    if (50 < Fl)
      throw Fl = 0, Wo = null, Error(o(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var ks = {};
  function Og(e, t, n, s) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = s, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Kt(e, t, n, s) {
    return new Og(e, t, n, s);
  }
  function Vr(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function $n(e, t) {
    var n = e.alternate;
    return n === null ? (n = Kt(
      e.tag,
      t,
      e.key,
      e.mode
    ), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 65011712, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
  }
  function Sf(e, t) {
    e.flags &= 65011714;
    var n = e.alternate;
    return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function Ei(e, t, n, s, r, u) {
    var p = 0;
    if (s = e, typeof e == "function") Vr(e) && (p = 1);
    else if (typeof e == "string")
      p = $v(
        e,
        n,
        ae.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case se:
          return e = Kt(31, n, t, r), e.elementType = se, e.lanes = u, e;
        case E:
          return Ya(n.children, r, u, t);
        case N:
          p = 8, r |= 24;
          break;
        case C:
          return e = Kt(12, n, t, r | 2), e.elementType = C, e.lanes = u, e;
        case P:
          return e = Kt(13, n, t, r), e.elementType = P, e.lanes = u, e;
        case G:
          return e = Kt(19, n, t, r), e.elementType = G, e.lanes = u, e;
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case B:
                p = 10;
                break e;
              case O:
                p = 9;
                break e;
              case J:
                p = 11;
                break e;
              case X:
                p = 14;
                break e;
              case W:
                p = 16, s = null;
                break e;
            }
          p = 29, n = Error(
            o(130, e === null ? "null" : typeof e, "")
          ), s = null;
      }
    return t = Kt(p, n, t, r), t.elementType = e, t.type = s, t.lanes = u, t;
  }
  function Ya(e, t, n, s) {
    return e = Kt(7, e, s, t), e.lanes = n, e;
  }
  function Yr(e, t, n) {
    return e = Kt(6, e, null, t), e.lanes = n, e;
  }
  function kf(e) {
    var t = Kt(18, null, null, 0);
    return t.stateNode = e, t;
  }
  function qr(e, t, n) {
    return t = Kt(
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
  var Nf = /* @__PURE__ */ new WeakMap();
  function rn(e, t) {
    if (typeof e == "object" && e !== null) {
      var n = Nf.get(e);
      return n !== void 0 ? n : (t = {
        value: e,
        source: t,
        stack: Ie(t)
      }, Nf.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: Ie(t)
    };
  }
  var Ns = [], Cs = 0, Mi = null, xl = 0, on = [], un = 0, ca = null, Cn = 1, En = "";
  function Un(e, t) {
    Ns[Cs++] = xl, Ns[Cs++] = Mi, Mi = e, xl = t;
  }
  function Cf(e, t, n) {
    on[un++] = Cn, on[un++] = En, on[un++] = ca, ca = e;
    var s = Cn;
    e = En;
    var r = 32 - Ct(s) - 1;
    s &= ~(1 << r), n += 1;
    var u = 32 - Ct(t) + r;
    if (30 < u) {
      var p = r - r % 5;
      u = (s & (1 << p) - 1).toString(32), s >>= p, r -= p, Cn = 1 << 32 - Ct(t) + r | n << r | s, En = u + e;
    } else
      Cn = 1 << u | n << r | s, En = e;
  }
  function Xr(e) {
    e.return !== null && (Un(e, 1), Cf(e, 1, 0));
  }
  function Qr(e) {
    for (; e === Mi; )
      Mi = Ns[--Cs], Ns[Cs] = null, xl = Ns[--Cs], Ns[Cs] = null;
    for (; e === ca; )
      ca = on[--un], on[un] = null, En = on[--un], on[un] = null, Cn = on[--un], on[un] = null;
  }
  function Ef(e, t) {
    on[un++] = Cn, on[un++] = En, on[un++] = ca, Cn = t.id, En = t.overflow, ca = e;
  }
  var xt = null, Qe = null, Te = !1, ra = null, dn = !1, Zr = Error(o(519));
  function oa(e) {
    var t = Error(
      o(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw yl(rn(t, e)), Zr;
  }
  function Mf(e) {
    var t = e.stateNode, n = e.type, s = e.memoizedProps;
    switch (t[vt] = e, t[Lt] = s, n) {
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
        for (n = 0; n < Vl.length; n++)
          Ne(Vl[n], t);
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
        Ne("invalid", t), Fd(
          t,
          s.value,
          s.defaultValue,
          s.checked,
          s.defaultChecked,
          s.type,
          s.name,
          !0
        );
        break;
      case "select":
        Ne("invalid", t);
        break;
      case "textarea":
        Ne("invalid", t), Vd(t, s.value, s.defaultValue, s.children);
    }
    n = s.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || s.suppressHydrationWarning === !0 || Xm(t.textContent, n) ? (s.popover != null && (Ne("beforetoggle", t), Ne("toggle", t)), s.onScroll != null && Ne("scroll", t), s.onScrollEnd != null && Ne("scrollend", t), s.onClick != null && (t.onclick = Hn), t = !0) : t = !1, t || oa(e, !0);
  }
  function Tf(e) {
    for (xt = e.return; xt; )
      switch (xt.tag) {
        case 5:
        case 31:
        case 13:
          dn = !1;
          return;
        case 27:
        case 3:
          dn = !0;
          return;
        default:
          xt = xt.return;
      }
  }
  function Es(e) {
    if (e !== xt) return !1;
    if (!Te) return Tf(e), Te = !0, !1;
    var t = e.tag, n;
    if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = !(n !== "form" && n !== "button") || hu(e.type, e.memoizedProps)), n = !n), n && Qe && oa(e), Tf(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
      Qe = tp(e);
    } else if (t === 31) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
      Qe = tp(e);
    } else
      t === 27 ? (t = Qe, ja(e.type) ? (e = gu, gu = null, Qe = e) : Qe = t) : Qe = xt ? hn(e.stateNode.nextSibling) : null;
    return !0;
  }
  function qa() {
    Qe = xt = null, Te = !1;
  }
  function Kr() {
    var e = ra;
    return e !== null && (Gt === null ? Gt = e : Gt.push.apply(
      Gt,
      e
    ), ra = null), e;
  }
  function yl(e) {
    ra === null ? ra = [e] : ra.push(e);
  }
  var Jr = k(null), Xa = null, Bn = null;
  function ua(e, t, n) {
    I(Jr, t._currentValue), t._currentValue = n;
  }
  function Fn(e) {
    e._currentValue = Jr.current, F(Jr);
  }
  function Pr(e, t, n) {
    for (; e !== null; ) {
      var s = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, s !== null && (s.childLanes |= t)) : s !== null && (s.childLanes & t) !== t && (s.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function Wr(e, t, n, s) {
    var r = e.child;
    for (r !== null && (r.return = e); r !== null; ) {
      var u = r.dependencies;
      if (u !== null) {
        var p = r.child;
        u = u.firstContext;
        e: for (; u !== null; ) {
          var x = u;
          u = r;
          for (var M = 0; M < t.length; M++)
            if (x.context === t[M]) {
              u.lanes |= n, x = u.alternate, x !== null && (x.lanes |= n), Pr(
                u.return,
                n,
                e
              ), s || (p = null);
              break e;
            }
          u = x.next;
        }
      } else if (r.tag === 18) {
        if (p = r.return, p === null) throw Error(o(341));
        p.lanes |= n, u = p.alternate, u !== null && (u.lanes |= n), Pr(p, n, e), p = null;
      } else p = r.child;
      if (p !== null) p.return = r;
      else
        for (p = r; p !== null; ) {
          if (p === e) {
            p = null;
            break;
          }
          if (r = p.sibling, r !== null) {
            r.return = p.return, p = r;
            break;
          }
          p = p.return;
        }
      r = p;
    }
  }
  function Ms(e, t, n, s) {
    e = null;
    for (var r = t, u = !1; r !== null; ) {
      if (!u) {
        if ((r.flags & 524288) !== 0) u = !0;
        else if ((r.flags & 262144) !== 0) break;
      }
      if (r.tag === 10) {
        var p = r.alternate;
        if (p === null) throw Error(o(387));
        if (p = p.memoizedProps, p !== null) {
          var x = r.type;
          Zt(r.pendingProps.value, p.value) || (e !== null ? e.push(x) : e = [x]);
        }
      } else if (r === ge.current) {
        if (p = r.alternate, p === null) throw Error(o(387));
        p.memoizedState.memoizedState !== r.memoizedState.memoizedState && (e !== null ? e.push(Zl) : e = [Zl]);
      }
      r = r.return;
    }
    e !== null && Wr(
      t,
      e,
      n,
      s
    ), t.flags |= 262144;
  }
  function Ti(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!Zt(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function Qa(e) {
    Xa = e, Bn = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function yt(e) {
    return Af(Xa, e);
  }
  function Ai(e, t) {
    return Xa === null && Qa(e), Af(e, t);
  }
  function Af(e, t) {
    var n = t._currentValue;
    if (t = { context: t, memoizedValue: n, next: null }, Bn === null) {
      if (e === null) throw Error(o(308));
      Bn = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else Bn = Bn.next = t;
    return n;
  }
  var zg = typeof AbortController < "u" ? AbortController : function() {
    var e = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(n, s) {
        e.push(s);
      }
    };
    this.abort = function() {
      t.aborted = !0, e.forEach(function(n) {
        return n();
      });
    };
  }, Dg = a.unstable_scheduleCallback, Hg = a.unstable_NormalPriority, ct = {
    $$typeof: B,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Ir() {
    return {
      controller: new zg(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function wl(e) {
    e.refCount--, e.refCount === 0 && Dg(Hg, function() {
      e.controller.abort();
    });
  }
  var jl = null, eo = 0, Ts = 0, As = null;
  function Lg(e, t) {
    if (jl === null) {
      var n = jl = [];
      eo = 0, Ts = su(), As = {
        status: "pending",
        value: void 0,
        then: function(s) {
          n.push(s);
        }
      };
    }
    return eo++, t.then(Rf, Rf), t;
  }
  function Rf() {
    if (--eo === 0 && jl !== null) {
      As !== null && (As.status = "fulfilled");
      var e = jl;
      jl = null, Ts = 0, As = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function $g(e, t) {
    var n = [], s = {
      status: "pending",
      value: null,
      reason: null,
      then: function(r) {
        n.push(r);
      }
    };
    return e.then(
      function() {
        s.status = "fulfilled", s.value = t;
        for (var r = 0; r < n.length; r++) (0, n[r])(t);
      },
      function(r) {
        for (s.status = "rejected", s.reason = r, r = 0; r < n.length; r++)
          (0, n[r])(void 0);
      }
    ), s;
  }
  var Of = T.S;
  T.S = function(e, t) {
    _m = nt(), typeof t == "object" && t !== null && typeof t.then == "function" && Lg(e, t), Of !== null && Of(e, t);
  };
  var Za = k(null);
  function to() {
    var e = Za.current;
    return e !== null ? e : Ye.pooledCache;
  }
  function Ri(e, t) {
    t === null ? I(Za, Za.current) : I(Za, t.pool);
  }
  function zf() {
    var e = to();
    return e === null ? null : { parent: ct._currentValue, pool: e };
  }
  var Rs = Error(o(460)), no = Error(o(474)), Oi = Error(o(542)), zi = { then: function() {
  } };
  function Df(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function Hf(e, t, n) {
    switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(Hn, Hn), t = n), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, $f(e), e;
      default:
        if (typeof t.status == "string") t.then(Hn, Hn);
        else {
          if (e = Ye, e !== null && 100 < e.shellSuspendCounter)
            throw Error(o(482));
          e = t, e.status = "pending", e.then(
            function(s) {
              if (t.status === "pending") {
                var r = t;
                r.status = "fulfilled", r.value = s;
              }
            },
            function(s) {
              if (t.status === "pending") {
                var r = t;
                r.status = "rejected", r.reason = s;
              }
            }
          );
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw e = t.reason, $f(e), e;
        }
        throw Ja = t, Rs;
    }
  }
  function Ka(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (n) {
      throw n !== null && typeof n == "object" && typeof n.then == "function" ? (Ja = n, Rs) : n;
    }
  }
  var Ja = null;
  function Lf() {
    if (Ja === null) throw Error(o(459));
    var e = Ja;
    return Ja = null, e;
  }
  function $f(e) {
    if (e === Rs || e === Oi)
      throw Error(o(483));
  }
  var Os = null, Sl = 0;
  function Di(e) {
    var t = Sl;
    return Sl += 1, Os === null && (Os = []), Hf(Os, e, t);
  }
  function kl(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function Hi(e, t) {
    throw t.$$typeof === j ? Error(o(525)) : (e = Object.prototype.toString.call(t), Error(
      o(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function Uf(e) {
    function t(z, R) {
      if (e) {
        var H = z.deletions;
        H === null ? (z.deletions = [R], z.flags |= 16) : H.push(R);
      }
    }
    function n(z, R) {
      if (!e) return null;
      for (; R !== null; )
        t(z, R), R = R.sibling;
      return null;
    }
    function s(z) {
      for (var R = /* @__PURE__ */ new Map(); z !== null; )
        z.key !== null ? R.set(z.key, z) : R.set(z.index, z), z = z.sibling;
      return R;
    }
    function r(z, R) {
      return z = $n(z, R), z.index = 0, z.sibling = null, z;
    }
    function u(z, R, H) {
      return z.index = H, e ? (H = z.alternate, H !== null ? (H = H.index, H < R ? (z.flags |= 67108866, R) : H) : (z.flags |= 67108866, R)) : (z.flags |= 1048576, R);
    }
    function p(z) {
      return e && z.alternate === null && (z.flags |= 67108866), z;
    }
    function x(z, R, H, Z) {
      return R === null || R.tag !== 6 ? (R = Yr(H, z.mode, Z), R.return = z, R) : (R = r(R, H), R.return = z, R);
    }
    function M(z, R, H, Z) {
      var pe = H.type;
      return pe === E ? q(
        z,
        R,
        H.props.children,
        Z,
        H.key
      ) : R !== null && (R.elementType === pe || typeof pe == "object" && pe !== null && pe.$$typeof === W && Ka(pe) === R.type) ? (R = r(R, H.props), kl(R, H), R.return = z, R) : (R = Ei(
        H.type,
        H.key,
        H.props,
        null,
        z.mode,
        Z
      ), kl(R, H), R.return = z, R);
    }
    function L(z, R, H, Z) {
      return R === null || R.tag !== 4 || R.stateNode.containerInfo !== H.containerInfo || R.stateNode.implementation !== H.implementation ? (R = qr(H, z.mode, Z), R.return = z, R) : (R = r(R, H.children || []), R.return = z, R);
    }
    function q(z, R, H, Z, pe) {
      return R === null || R.tag !== 7 ? (R = Ya(
        H,
        z.mode,
        Z,
        pe
      ), R.return = z, R) : (R = r(R, H), R.return = z, R);
    }
    function K(z, R, H) {
      if (typeof R == "string" && R !== "" || typeof R == "number" || typeof R == "bigint")
        return R = Yr(
          "" + R,
          z.mode,
          H
        ), R.return = z, R;
      if (typeof R == "object" && R !== null) {
        switch (R.$$typeof) {
          case w:
            return H = Ei(
              R.type,
              R.key,
              R.props,
              null,
              z.mode,
              H
            ), kl(H, R), H.return = z, H;
          case S:
            return R = qr(
              R,
              z.mode,
              H
            ), R.return = z, R;
          case W:
            return R = Ka(R), K(z, R, H);
        }
        if (A(R) || Y(R))
          return R = Ya(
            R,
            z.mode,
            H,
            null
          ), R.return = z, R;
        if (typeof R.then == "function")
          return K(z, Di(R), H);
        if (R.$$typeof === B)
          return K(
            z,
            Ai(z, R),
            H
          );
        Hi(z, R);
      }
      return null;
    }
    function U(z, R, H, Z) {
      var pe = R !== null ? R.key : null;
      if (typeof H == "string" && H !== "" || typeof H == "number" || typeof H == "bigint")
        return pe !== null ? null : x(z, R, "" + H, Z);
      if (typeof H == "object" && H !== null) {
        switch (H.$$typeof) {
          case w:
            return H.key === pe ? M(z, R, H, Z) : null;
          case S:
            return H.key === pe ? L(z, R, H, Z) : null;
          case W:
            return H = Ka(H), U(z, R, H, Z);
        }
        if (A(H) || Y(H))
          return pe !== null ? null : q(z, R, H, Z, null);
        if (typeof H.then == "function")
          return U(
            z,
            R,
            Di(H),
            Z
          );
        if (H.$$typeof === B)
          return U(
            z,
            R,
            Ai(z, H),
            Z
          );
        Hi(z, H);
      }
      return null;
    }
    function V(z, R, H, Z, pe) {
      if (typeof Z == "string" && Z !== "" || typeof Z == "number" || typeof Z == "bigint")
        return z = z.get(H) || null, x(R, z, "" + Z, pe);
      if (typeof Z == "object" && Z !== null) {
        switch (Z.$$typeof) {
          case w:
            return z = z.get(
              Z.key === null ? H : Z.key
            ) || null, M(R, z, Z, pe);
          case S:
            return z = z.get(
              Z.key === null ? H : Z.key
            ) || null, L(R, z, Z, pe);
          case W:
            return Z = Ka(Z), V(
              z,
              R,
              H,
              Z,
              pe
            );
        }
        if (A(Z) || Y(Z))
          return z = z.get(H) || null, q(R, z, Z, pe, null);
        if (typeof Z.then == "function")
          return V(
            z,
            R,
            H,
            Di(Z),
            pe
          );
        if (Z.$$typeof === B)
          return V(
            z,
            R,
            H,
            Ai(R, Z),
            pe
          );
        Hi(R, Z);
      }
      return null;
    }
    function oe(z, R, H, Z) {
      for (var pe = null, Oe = null, fe = R, we = R = 0, Me = null; fe !== null && we < H.length; we++) {
        fe.index > we ? (Me = fe, fe = null) : Me = fe.sibling;
        var ze = U(
          z,
          fe,
          H[we],
          Z
        );
        if (ze === null) {
          fe === null && (fe = Me);
          break;
        }
        e && fe && ze.alternate === null && t(z, fe), R = u(ze, R, we), Oe === null ? pe = ze : Oe.sibling = ze, Oe = ze, fe = Me;
      }
      if (we === H.length)
        return n(z, fe), Te && Un(z, we), pe;
      if (fe === null) {
        for (; we < H.length; we++)
          fe = K(z, H[we], Z), fe !== null && (R = u(
            fe,
            R,
            we
          ), Oe === null ? pe = fe : Oe.sibling = fe, Oe = fe);
        return Te && Un(z, we), pe;
      }
      for (fe = s(fe); we < H.length; we++)
        Me = V(
          fe,
          z,
          we,
          H[we],
          Z
        ), Me !== null && (e && Me.alternate !== null && fe.delete(
          Me.key === null ? we : Me.key
        ), R = u(
          Me,
          R,
          we
        ), Oe === null ? pe = Me : Oe.sibling = Me, Oe = Me);
      return e && fe.forEach(function(Ea) {
        return t(z, Ea);
      }), Te && Un(z, we), pe;
    }
    function be(z, R, H, Z) {
      if (H == null) throw Error(o(151));
      for (var pe = null, Oe = null, fe = R, we = R = 0, Me = null, ze = H.next(); fe !== null && !ze.done; we++, ze = H.next()) {
        fe.index > we ? (Me = fe, fe = null) : Me = fe.sibling;
        var Ea = U(z, fe, ze.value, Z);
        if (Ea === null) {
          fe === null && (fe = Me);
          break;
        }
        e && fe && Ea.alternate === null && t(z, fe), R = u(Ea, R, we), Oe === null ? pe = Ea : Oe.sibling = Ea, Oe = Ea, fe = Me;
      }
      if (ze.done)
        return n(z, fe), Te && Un(z, we), pe;
      if (fe === null) {
        for (; !ze.done; we++, ze = H.next())
          ze = K(z, ze.value, Z), ze !== null && (R = u(ze, R, we), Oe === null ? pe = ze : Oe.sibling = ze, Oe = ze);
        return Te && Un(z, we), pe;
      }
      for (fe = s(fe); !ze.done; we++, ze = H.next())
        ze = V(fe, z, we, ze.value, Z), ze !== null && (e && ze.alternate !== null && fe.delete(ze.key === null ? we : ze.key), R = u(ze, R, we), Oe === null ? pe = ze : Oe.sibling = ze, Oe = ze);
      return e && fe.forEach(function(Kv) {
        return t(z, Kv);
      }), Te && Un(z, we), pe;
    }
    function Ve(z, R, H, Z) {
      if (typeof H == "object" && H !== null && H.type === E && H.key === null && (H = H.props.children), typeof H == "object" && H !== null) {
        switch (H.$$typeof) {
          case w:
            e: {
              for (var pe = H.key; R !== null; ) {
                if (R.key === pe) {
                  if (pe = H.type, pe === E) {
                    if (R.tag === 7) {
                      n(
                        z,
                        R.sibling
                      ), Z = r(
                        R,
                        H.props.children
                      ), Z.return = z, z = Z;
                      break e;
                    }
                  } else if (R.elementType === pe || typeof pe == "object" && pe !== null && pe.$$typeof === W && Ka(pe) === R.type) {
                    n(
                      z,
                      R.sibling
                    ), Z = r(R, H.props), kl(Z, H), Z.return = z, z = Z;
                    break e;
                  }
                  n(z, R);
                  break;
                } else t(z, R);
                R = R.sibling;
              }
              H.type === E ? (Z = Ya(
                H.props.children,
                z.mode,
                Z,
                H.key
              ), Z.return = z, z = Z) : (Z = Ei(
                H.type,
                H.key,
                H.props,
                null,
                z.mode,
                Z
              ), kl(Z, H), Z.return = z, z = Z);
            }
            return p(z);
          case S:
            e: {
              for (pe = H.key; R !== null; ) {
                if (R.key === pe)
                  if (R.tag === 4 && R.stateNode.containerInfo === H.containerInfo && R.stateNode.implementation === H.implementation) {
                    n(
                      z,
                      R.sibling
                    ), Z = r(R, H.children || []), Z.return = z, z = Z;
                    break e;
                  } else {
                    n(z, R);
                    break;
                  }
                else t(z, R);
                R = R.sibling;
              }
              Z = qr(H, z.mode, Z), Z.return = z, z = Z;
            }
            return p(z);
          case W:
            return H = Ka(H), Ve(
              z,
              R,
              H,
              Z
            );
        }
        if (A(H))
          return oe(
            z,
            R,
            H,
            Z
          );
        if (Y(H)) {
          if (pe = Y(H), typeof pe != "function") throw Error(o(150));
          return H = pe.call(H), be(
            z,
            R,
            H,
            Z
          );
        }
        if (typeof H.then == "function")
          return Ve(
            z,
            R,
            Di(H),
            Z
          );
        if (H.$$typeof === B)
          return Ve(
            z,
            R,
            Ai(z, H),
            Z
          );
        Hi(z, H);
      }
      return typeof H == "string" && H !== "" || typeof H == "number" || typeof H == "bigint" ? (H = "" + H, R !== null && R.tag === 6 ? (n(z, R.sibling), Z = r(R, H), Z.return = z, z = Z) : (n(z, R), Z = Yr(H, z.mode, Z), Z.return = z, z = Z), p(z)) : n(z, R);
    }
    return function(z, R, H, Z) {
      try {
        Sl = 0;
        var pe = Ve(
          z,
          R,
          H,
          Z
        );
        return Os = null, pe;
      } catch (fe) {
        if (fe === Rs || fe === Oi) throw fe;
        var Oe = Kt(29, fe, null, z.mode);
        return Oe.lanes = Z, Oe.return = z, Oe;
      } finally {
      }
    };
  }
  var Pa = Uf(!0), Bf = Uf(!1), da = !1;
  function ao(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function so(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function fa(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function ha(e, t, n) {
    var s = e.updateQueue;
    if (s === null) return null;
    if (s = s.shared, (He & 2) !== 0) {
      var r = s.pending;
      return r === null ? t.next = t : (t.next = r.next, r.next = t), s.pending = t, t = Ci(e), jf(e, null, n), t;
    }
    return Ni(e, s, t, n), Ci(e);
  }
  function Nl(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194048) !== 0)) {
      var s = t.lanes;
      s &= e.pendingLanes, n |= s, t.lanes = n, Td(e, n);
    }
  }
  function lo(e, t) {
    var n = e.updateQueue, s = e.alternate;
    if (s !== null && (s = s.updateQueue, n === s)) {
      var r = null, u = null;
      if (n = n.firstBaseUpdate, n !== null) {
        do {
          var p = {
            lane: n.lane,
            tag: n.tag,
            payload: n.payload,
            callback: null,
            next: null
          };
          u === null ? r = u = p : u = u.next = p, n = n.next;
        } while (n !== null);
        u === null ? r = u = t : u = u.next = t;
      } else r = u = t;
      n = {
        baseState: s.baseState,
        firstBaseUpdate: r,
        lastBaseUpdate: u,
        shared: s.shared,
        callbacks: s.callbacks
      }, e.updateQueue = n;
      return;
    }
    e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
  }
  var io = !1;
  function Cl() {
    if (io) {
      var e = As;
      if (e !== null) throw e;
    }
  }
  function El(e, t, n, s) {
    io = !1;
    var r = e.updateQueue;
    da = !1;
    var u = r.firstBaseUpdate, p = r.lastBaseUpdate, x = r.shared.pending;
    if (x !== null) {
      r.shared.pending = null;
      var M = x, L = M.next;
      M.next = null, p === null ? u = L : p.next = L, p = M;
      var q = e.alternate;
      q !== null && (q = q.updateQueue, x = q.lastBaseUpdate, x !== p && (x === null ? q.firstBaseUpdate = L : x.next = L, q.lastBaseUpdate = M));
    }
    if (u !== null) {
      var K = r.baseState;
      p = 0, q = L = M = null, x = u;
      do {
        var U = x.lane & -536870913, V = U !== x.lane;
        if (V ? (Ee & U) === U : (s & U) === U) {
          U !== 0 && U === Ts && (io = !0), q !== null && (q = q.next = {
            lane: 0,
            tag: x.tag,
            payload: x.payload,
            callback: null,
            next: null
          });
          e: {
            var oe = e, be = x;
            U = t;
            var Ve = n;
            switch (be.tag) {
              case 1:
                if (oe = be.payload, typeof oe == "function") {
                  K = oe.call(Ve, K, U);
                  break e;
                }
                K = oe;
                break e;
              case 3:
                oe.flags = oe.flags & -65537 | 128;
              case 0:
                if (oe = be.payload, U = typeof oe == "function" ? oe.call(Ve, K, U) : oe, U == null) break e;
                K = g({}, K, U);
                break e;
              case 2:
                da = !0;
            }
          }
          U = x.callback, U !== null && (e.flags |= 64, V && (e.flags |= 8192), V = r.callbacks, V === null ? r.callbacks = [U] : V.push(U));
        } else
          V = {
            lane: U,
            tag: x.tag,
            payload: x.payload,
            callback: x.callback,
            next: null
          }, q === null ? (L = q = V, M = K) : q = q.next = V, p |= U;
        if (x = x.next, x === null) {
          if (x = r.shared.pending, x === null)
            break;
          V = x, x = V.next, V.next = null, r.lastBaseUpdate = V, r.shared.pending = null;
        }
      } while (!0);
      q === null && (M = K), r.baseState = M, r.firstBaseUpdate = L, r.lastBaseUpdate = q, u === null && (r.shared.lanes = 0), ga |= p, e.lanes = p, e.memoizedState = K;
    }
  }
  function Ff(e, t) {
    if (typeof e != "function")
      throw Error(o(191, e));
    e.call(t);
  }
  function Gf(e, t) {
    var n = e.callbacks;
    if (n !== null)
      for (e.callbacks = null, e = 0; e < n.length; e++)
        Ff(n[e], t);
  }
  var zs = k(null), Li = k(0);
  function Vf(e, t) {
    e = Jn, I(Li, e), I(zs, t), Jn = e | t.baseLanes;
  }
  function co() {
    I(Li, Jn), I(zs, zs.current);
  }
  function ro() {
    Jn = Li.current, F(zs), F(Li);
  }
  var Jt = k(null), fn = null;
  function ma(e) {
    var t = e.alternate;
    I(at, at.current & 1), I(Jt, e), fn === null && (t === null || zs.current !== null || t.memoizedState !== null) && (fn = e);
  }
  function oo(e) {
    I(at, at.current), I(Jt, e), fn === null && (fn = e);
  }
  function Yf(e) {
    e.tag === 22 ? (I(at, at.current), I(Jt, e), fn === null && (fn = e)) : pa();
  }
  function pa() {
    I(at, at.current), I(Jt, Jt.current);
  }
  function Pt(e) {
    F(Jt), fn === e && (fn = null), F(at);
  }
  var at = k(0);
  function $i(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var n = t.memoizedState;
        if (n !== null && (n = n.dehydrated, n === null || _u(n) || bu(n)))
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
  var Gn = 0, ye = null, Fe = null, rt = null, Ui = !1, Ds = !1, Wa = !1, Bi = 0, Ml = 0, Hs = null, Ug = 0;
  function et() {
    throw Error(o(321));
  }
  function uo(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++)
      if (!Zt(e[n], t[n])) return !1;
    return !0;
  }
  function fo(e, t, n, s, r, u) {
    return Gn = u, ye = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, T.H = e === null || e.memoizedState === null ? Ch : Co, Wa = !1, u = n(s, r), Wa = !1, Ds && (u = Xf(
      t,
      n,
      s,
      r
    )), qf(e), u;
  }
  function qf(e) {
    T.H = Rl;
    var t = Fe !== null && Fe.next !== null;
    if (Gn = 0, rt = Fe = ye = null, Ui = !1, Ml = 0, Hs = null, t) throw Error(o(300));
    e === null || ot || (e = e.dependencies, e !== null && Ti(e) && (ot = !0));
  }
  function Xf(e, t, n, s) {
    ye = e;
    var r = 0;
    do {
      if (Ds && (Hs = null), Ml = 0, Ds = !1, 25 <= r) throw Error(o(301));
      if (r += 1, rt = Fe = null, e.updateQueue != null) {
        var u = e.updateQueue;
        u.lastEffect = null, u.events = null, u.stores = null, u.memoCache != null && (u.memoCache.index = 0);
      }
      T.H = Eh, u = t(n, s);
    } while (Ds);
    return u;
  }
  function Bg() {
    var e = T.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? Tl(t) : t, e = e.useState()[0], (Fe !== null ? Fe.memoizedState : null) !== e && (ye.flags |= 1024), t;
  }
  function ho() {
    var e = Bi !== 0;
    return Bi = 0, e;
  }
  function mo(e, t, n) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
  }
  function po(e) {
    if (Ui) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      Ui = !1;
    }
    Gn = 0, rt = Fe = ye = null, Ds = !1, Ml = Bi = 0, Hs = null;
  }
  function Ot() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return rt === null ? ye.memoizedState = rt = e : rt = rt.next = e, rt;
  }
  function st() {
    if (Fe === null) {
      var e = ye.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Fe.next;
    var t = rt === null ? ye.memoizedState : rt.next;
    if (t !== null)
      rt = t, Fe = e;
    else {
      if (e === null)
        throw ye.alternate === null ? Error(o(467)) : Error(o(310));
      Fe = e, e = {
        memoizedState: Fe.memoizedState,
        baseState: Fe.baseState,
        baseQueue: Fe.baseQueue,
        queue: Fe.queue,
        next: null
      }, rt === null ? ye.memoizedState = rt = e : rt = rt.next = e;
    }
    return rt;
  }
  function Fi() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Tl(e) {
    var t = Ml;
    return Ml += 1, Hs === null && (Hs = []), e = Hf(Hs, e, t), t = ye, (rt === null ? t.memoizedState : rt.next) === null && (t = t.alternate, T.H = t === null || t.memoizedState === null ? Ch : Co), e;
  }
  function Gi(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return Tl(e);
      if (e.$$typeof === B) return yt(e);
    }
    throw Error(o(438, String(e)));
  }
  function _o(e) {
    var t = null, n = ye.updateQueue;
    if (n !== null && (t = n.memoCache), t == null) {
      var s = ye.alternate;
      s !== null && (s = s.updateQueue, s !== null && (s = s.memoCache, s != null && (t = {
        data: s.data.map(function(r) {
          return r.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), n === null && (n = Fi(), ye.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0)
      for (n = t.data[t.index] = Array(e), s = 0; s < e; s++)
        n[s] = ue;
    return t.index++, n;
  }
  function Vn(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function Vi(e) {
    var t = st();
    return bo(t, Fe, e);
  }
  function bo(e, t, n) {
    var s = e.queue;
    if (s === null) throw Error(o(311));
    s.lastRenderedReducer = n;
    var r = e.baseQueue, u = s.pending;
    if (u !== null) {
      if (r !== null) {
        var p = r.next;
        r.next = u.next, u.next = p;
      }
      t.baseQueue = r = u, s.pending = null;
    }
    if (u = e.baseState, r === null) e.memoizedState = u;
    else {
      t = r.next;
      var x = p = null, M = null, L = t, q = !1;
      do {
        var K = L.lane & -536870913;
        if (K !== L.lane ? (Ee & K) === K : (Gn & K) === K) {
          var U = L.revertLane;
          if (U === 0)
            M !== null && (M = M.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: L.action,
              hasEagerState: L.hasEagerState,
              eagerState: L.eagerState,
              next: null
            }), K === Ts && (q = !0);
          else if ((Gn & U) === U) {
            L = L.next, U === Ts && (q = !0);
            continue;
          } else
            K = {
              lane: 0,
              revertLane: L.revertLane,
              gesture: null,
              action: L.action,
              hasEagerState: L.hasEagerState,
              eagerState: L.eagerState,
              next: null
            }, M === null ? (x = M = K, p = u) : M = M.next = K, ye.lanes |= U, ga |= U;
          K = L.action, Wa && n(u, K), u = L.hasEagerState ? L.eagerState : n(u, K);
        } else
          U = {
            lane: K,
            revertLane: L.revertLane,
            gesture: L.gesture,
            action: L.action,
            hasEagerState: L.hasEagerState,
            eagerState: L.eagerState,
            next: null
          }, M === null ? (x = M = U, p = u) : M = M.next = U, ye.lanes |= K, ga |= K;
        L = L.next;
      } while (L !== null && L !== t);
      if (M === null ? p = u : M.next = x, !Zt(u, e.memoizedState) && (ot = !0, q && (n = As, n !== null)))
        throw n;
      e.memoizedState = u, e.baseState = p, e.baseQueue = M, s.lastRenderedState = u;
    }
    return r === null && (s.lanes = 0), [e.memoizedState, s.dispatch];
  }
  function go(e) {
    var t = st(), n = t.queue;
    if (n === null) throw Error(o(311));
    n.lastRenderedReducer = e;
    var s = n.dispatch, r = n.pending, u = t.memoizedState;
    if (r !== null) {
      n.pending = null;
      var p = r = r.next;
      do
        u = e(u, p.action), p = p.next;
      while (p !== r);
      Zt(u, t.memoizedState) || (ot = !0), t.memoizedState = u, t.baseQueue === null && (t.baseState = u), n.lastRenderedState = u;
    }
    return [u, s];
  }
  function Qf(e, t, n) {
    var s = ye, r = st(), u = Te;
    if (u) {
      if (n === void 0) throw Error(o(407));
      n = n();
    } else n = t();
    var p = !Zt(
      (Fe || r).memoizedState,
      n
    );
    if (p && (r.memoizedState = n, ot = !0), r = r.queue, yo(Jf.bind(null, s, r, e), [
      e
    ]), r.getSnapshot !== t || p || rt !== null && rt.memoizedState.tag & 1) {
      if (s.flags |= 2048, Ls(
        9,
        { destroy: void 0 },
        Kf.bind(
          null,
          s,
          r,
          n,
          t
        ),
        null
      ), Ye === null) throw Error(o(349));
      u || (Gn & 127) !== 0 || Zf(s, t, n);
    }
    return n;
  }
  function Zf(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = ye.updateQueue, t === null ? (t = Fi(), ye.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function Kf(e, t, n, s) {
    t.value = n, t.getSnapshot = s, Pf(t) && Wf(e);
  }
  function Jf(e, t, n) {
    return n(function() {
      Pf(t) && Wf(e);
    });
  }
  function Pf(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !Zt(e, n);
    } catch {
      return !0;
    }
  }
  function Wf(e) {
    var t = Va(e, 2);
    t !== null && Vt(t, e, 2);
  }
  function vo(e) {
    var t = Ot();
    if (typeof e == "function") {
      var n = e;
      if (e = n(), Wa) {
        gn(!0);
        try {
          n();
        } finally {
          gn(!1);
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
  function If(e, t, n, s) {
    return e.baseState = n, bo(
      e,
      Fe,
      typeof s == "function" ? s : Vn
    );
  }
  function Fg(e, t, n, s, r) {
    if (Xi(e)) throw Error(o(485));
    if (e = t.action, e !== null) {
      var u = {
        payload: r,
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
      T.T !== null ? n(!0) : u.isTransition = !1, s(u), n = t.pending, n === null ? (u.next = t.pending = u, eh(t, u)) : (u.next = n.next, t.pending = n.next = u);
    }
  }
  function eh(e, t) {
    var n = t.action, s = t.payload, r = e.state;
    if (t.isTransition) {
      var u = T.T, p = {};
      T.T = p;
      try {
        var x = n(r, s), M = T.S;
        M !== null && M(p, x), th(e, t, x);
      } catch (L) {
        xo(e, t, L);
      } finally {
        u !== null && p.types !== null && (u.types = p.types), T.T = u;
      }
    } else
      try {
        u = n(r, s), th(e, t, u);
      } catch (L) {
        xo(e, t, L);
      }
  }
  function th(e, t, n) {
    n !== null && typeof n == "object" && typeof n.then == "function" ? n.then(
      function(s) {
        nh(e, t, s);
      },
      function(s) {
        return xo(e, t, s);
      }
    ) : nh(e, t, n);
  }
  function nh(e, t, n) {
    t.status = "fulfilled", t.value = n, ah(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, eh(e, n)));
  }
  function xo(e, t, n) {
    var s = e.pending;
    if (e.pending = null, s !== null) {
      s = s.next;
      do
        t.status = "rejected", t.reason = n, ah(t), t = t.next;
      while (t !== s);
    }
    e.action = null;
  }
  function ah(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function sh(e, t) {
    return t;
  }
  function lh(e, t) {
    if (Te) {
      var n = Ye.formState;
      if (n !== null) {
        e: {
          var s = ye;
          if (Te) {
            if (Qe) {
              t: {
                for (var r = Qe, u = dn; r.nodeType !== 8; ) {
                  if (!u) {
                    r = null;
                    break t;
                  }
                  if (r = hn(
                    r.nextSibling
                  ), r === null) {
                    r = null;
                    break t;
                  }
                }
                u = r.data, r = u === "F!" || u === "F" ? r : null;
              }
              if (r) {
                Qe = hn(
                  r.nextSibling
                ), s = r.data === "F!";
                break e;
              }
            }
            oa(s);
          }
          s = !1;
        }
        s && (t = n[0]);
      }
    }
    return n = Ot(), n.memoizedState = n.baseState = t, s = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: sh,
      lastRenderedState: t
    }, n.queue = s, n = Sh.bind(
      null,
      ye,
      s
    ), s.dispatch = n, s = vo(!1), u = No.bind(
      null,
      ye,
      !1,
      s.queue
    ), s = Ot(), r = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, s.queue = r, n = Fg.bind(
      null,
      ye,
      r,
      u,
      n
    ), r.dispatch = n, s.memoizedState = e, [t, n, !1];
  }
  function ih(e) {
    var t = st();
    return ch(t, Fe, e);
  }
  function ch(e, t, n) {
    if (t = bo(
      e,
      t,
      sh
    )[0], e = Vi(Vn)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var s = Tl(t);
      } catch (p) {
        throw p === Rs ? Oi : p;
      }
    else s = t;
    t = st();
    var r = t.queue, u = r.dispatch;
    return n !== t.memoizedState && (ye.flags |= 2048, Ls(
      9,
      { destroy: void 0 },
      Gg.bind(null, r, n),
      null
    )), [s, u, e];
  }
  function Gg(e, t) {
    e.action = t;
  }
  function rh(e) {
    var t = st(), n = Fe;
    if (n !== null)
      return ch(t, n, e);
    st(), t = t.memoizedState, n = st();
    var s = n.queue.dispatch;
    return n.memoizedState = e, [t, s, !1];
  }
  function Ls(e, t, n, s) {
    return e = { tag: e, create: n, deps: s, inst: t, next: null }, t = ye.updateQueue, t === null && (t = Fi(), ye.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (s = n.next, n.next = e, e.next = s, t.lastEffect = e), e;
  }
  function oh() {
    return st().memoizedState;
  }
  function Yi(e, t, n, s) {
    var r = Ot();
    ye.flags |= e, r.memoizedState = Ls(
      1 | t,
      { destroy: void 0 },
      n,
      s === void 0 ? null : s
    );
  }
  function qi(e, t, n, s) {
    var r = st();
    s = s === void 0 ? null : s;
    var u = r.memoizedState.inst;
    Fe !== null && s !== null && uo(s, Fe.memoizedState.deps) ? r.memoizedState = Ls(t, u, n, s) : (ye.flags |= e, r.memoizedState = Ls(
      1 | t,
      u,
      n,
      s
    ));
  }
  function uh(e, t) {
    Yi(8390656, 8, e, t);
  }
  function yo(e, t) {
    qi(2048, 8, e, t);
  }
  function Vg(e) {
    ye.flags |= 4;
    var t = ye.updateQueue;
    if (t === null)
      t = Fi(), ye.updateQueue = t, t.events = [e];
    else {
      var n = t.events;
      n === null ? t.events = [e] : n.push(e);
    }
  }
  function dh(e) {
    var t = st().memoizedState;
    return Vg({ ref: t, nextImpl: e }), function() {
      if ((He & 2) !== 0) throw Error(o(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function fh(e, t) {
    return qi(4, 2, e, t);
  }
  function hh(e, t) {
    return qi(4, 4, e, t);
  }
  function mh(e, t) {
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
  function ph(e, t, n) {
    n = n != null ? n.concat([e]) : null, qi(4, 4, mh.bind(null, t, e), n);
  }
  function wo() {
  }
  function _h(e, t) {
    var n = st();
    t = t === void 0 ? null : t;
    var s = n.memoizedState;
    return t !== null && uo(t, s[1]) ? s[0] : (n.memoizedState = [e, t], e);
  }
  function bh(e, t) {
    var n = st();
    t = t === void 0 ? null : t;
    var s = n.memoizedState;
    if (t !== null && uo(t, s[1]))
      return s[0];
    if (s = e(), Wa) {
      gn(!0);
      try {
        e();
      } finally {
        gn(!1);
      }
    }
    return n.memoizedState = [s, t], s;
  }
  function jo(e, t, n) {
    return n === void 0 || (Gn & 1073741824) !== 0 && (Ee & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = n, e = gm(), ye.lanes |= e, ga |= e, n);
  }
  function gh(e, t, n, s) {
    return Zt(n, t) ? n : zs.current !== null ? (e = jo(e, n, s), Zt(e, t) || (ot = !0), e) : (Gn & 42) === 0 || (Gn & 1073741824) !== 0 && (Ee & 261930) === 0 ? (ot = !0, e.memoizedState = n) : (e = gm(), ye.lanes |= e, ga |= e, t);
  }
  function vh(e, t, n, s, r) {
    var u = $.p;
    $.p = u !== 0 && 8 > u ? u : 8;
    var p = T.T, x = {};
    T.T = x, No(e, !1, t, n);
    try {
      var M = r(), L = T.S;
      if (L !== null && L(x, M), M !== null && typeof M == "object" && typeof M.then == "function") {
        var q = $g(
          M,
          s
        );
        Al(
          e,
          t,
          q,
          en(e)
        );
      } else
        Al(
          e,
          t,
          s,
          en(e)
        );
    } catch (K) {
      Al(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: K },
        en()
      );
    } finally {
      $.p = u, p !== null && x.types !== null && (p.types = x.types), T.T = p;
    }
  }
  function Yg() {
  }
  function So(e, t, n, s) {
    if (e.tag !== 5) throw Error(o(476));
    var r = xh(e).queue;
    vh(
      e,
      r,
      t,
      Q,
      n === null ? Yg : function() {
        return yh(e), n(s);
      }
    );
  }
  function xh(e) {
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
        lastRenderedReducer: Vn,
        lastRenderedState: Q
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
  function yh(e) {
    var t = xh(e);
    t.next === null && (t = e.alternate.memoizedState), Al(
      e,
      t.next.queue,
      {},
      en()
    );
  }
  function ko() {
    return yt(Zl);
  }
  function wh() {
    return st().memoizedState;
  }
  function jh() {
    return st().memoizedState;
  }
  function qg(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var n = en();
          e = fa(n);
          var s = ha(t, e, n);
          s !== null && (Vt(s, t, n), Nl(s, t, n)), t = { cache: Ir() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function Xg(e, t, n) {
    var s = en();
    n = {
      lane: s,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Xi(e) ? kh(t, n) : (n = Gr(e, t, n, s), n !== null && (Vt(n, e, s), Nh(n, t, s)));
  }
  function Sh(e, t, n) {
    var s = en();
    Al(e, t, n, s);
  }
  function Al(e, t, n, s) {
    var r = {
      lane: s,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (Xi(e)) kh(t, r);
    else {
      var u = e.alternate;
      if (e.lanes === 0 && (u === null || u.lanes === 0) && (u = t.lastRenderedReducer, u !== null))
        try {
          var p = t.lastRenderedState, x = u(p, n);
          if (r.hasEagerState = !0, r.eagerState = x, Zt(x, p))
            return Ni(e, t, r, 0), Ye === null && ki(), !1;
        } catch {
        } finally {
        }
      if (n = Gr(e, t, r, s), n !== null)
        return Vt(n, e, s), Nh(n, t, s), !0;
    }
    return !1;
  }
  function No(e, t, n, s) {
    if (s = {
      lane: 2,
      revertLane: su(),
      gesture: null,
      action: s,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Xi(e)) {
      if (t) throw Error(o(479));
    } else
      t = Gr(
        e,
        n,
        s,
        2
      ), t !== null && Vt(t, e, 2);
  }
  function Xi(e) {
    var t = e.alternate;
    return e === ye || t !== null && t === ye;
  }
  function kh(e, t) {
    Ds = Ui = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function Nh(e, t, n) {
    if ((n & 4194048) !== 0) {
      var s = t.lanes;
      s &= e.pendingLanes, n |= s, t.lanes = n, Td(e, n);
    }
  }
  var Rl = {
    readContext: yt,
    use: Gi,
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
  Rl.useEffectEvent = et;
  var Ch = {
    readContext: yt,
    use: Gi,
    useCallback: function(e, t) {
      return Ot().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: yt,
    useEffect: uh,
    useImperativeHandle: function(e, t, n) {
      n = n != null ? n.concat([e]) : null, Yi(
        4194308,
        4,
        mh.bind(null, t, e),
        n
      );
    },
    useLayoutEffect: function(e, t) {
      return Yi(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      Yi(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var n = Ot();
      t = t === void 0 ? null : t;
      var s = e();
      if (Wa) {
        gn(!0);
        try {
          e();
        } finally {
          gn(!1);
        }
      }
      return n.memoizedState = [s, t], s;
    },
    useReducer: function(e, t, n) {
      var s = Ot();
      if (n !== void 0) {
        var r = n(t);
        if (Wa) {
          gn(!0);
          try {
            n(t);
          } finally {
            gn(!1);
          }
        }
      } else r = t;
      return s.memoizedState = s.baseState = r, e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: r
      }, s.queue = e, e = e.dispatch = Xg.bind(
        null,
        ye,
        e
      ), [s.memoizedState, e];
    },
    useRef: function(e) {
      var t = Ot();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = vo(e);
      var t = e.queue, n = Sh.bind(null, ye, t);
      return t.dispatch = n, [e.memoizedState, n];
    },
    useDebugValue: wo,
    useDeferredValue: function(e, t) {
      var n = Ot();
      return jo(n, e, t);
    },
    useTransition: function() {
      var e = vo(!1);
      return e = vh.bind(
        null,
        ye,
        e.queue,
        !0,
        !1
      ), Ot().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, n) {
      var s = ye, r = Ot();
      if (Te) {
        if (n === void 0)
          throw Error(o(407));
        n = n();
      } else {
        if (n = t(), Ye === null)
          throw Error(o(349));
        (Ee & 127) !== 0 || Zf(s, t, n);
      }
      r.memoizedState = n;
      var u = { value: n, getSnapshot: t };
      return r.queue = u, uh(Jf.bind(null, s, u, e), [
        e
      ]), s.flags |= 2048, Ls(
        9,
        { destroy: void 0 },
        Kf.bind(
          null,
          s,
          u,
          n,
          t
        ),
        null
      ), n;
    },
    useId: function() {
      var e = Ot(), t = Ye.identifierPrefix;
      if (Te) {
        var n = En, s = Cn;
        n = (s & ~(1 << 32 - Ct(s) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = Bi++, 0 < n && (t += "H" + n.toString(32)), t += "_";
      } else
        n = Ug++, t = "_" + t + "r_" + n.toString(32) + "_";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: ko,
    useFormState: lh,
    useActionState: lh,
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
      return t.queue = n, t = No.bind(
        null,
        ye,
        !0,
        n
      ), n.dispatch = t, [e, t];
    },
    useMemoCache: _o,
    useCacheRefresh: function() {
      return Ot().memoizedState = qg.bind(
        null,
        ye
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
  }, Co = {
    readContext: yt,
    use: Gi,
    useCallback: _h,
    useContext: yt,
    useEffect: yo,
    useImperativeHandle: ph,
    useInsertionEffect: fh,
    useLayoutEffect: hh,
    useMemo: bh,
    useReducer: Vi,
    useRef: oh,
    useState: function() {
      return Vi(Vn);
    },
    useDebugValue: wo,
    useDeferredValue: function(e, t) {
      var n = st();
      return gh(
        n,
        Fe.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = Vi(Vn)[0], t = st().memoizedState;
      return [
        typeof e == "boolean" ? e : Tl(e),
        t
      ];
    },
    useSyncExternalStore: Qf,
    useId: wh,
    useHostTransitionStatus: ko,
    useFormState: ih,
    useActionState: ih,
    useOptimistic: function(e, t) {
      var n = st();
      return If(n, Fe, e, t);
    },
    useMemoCache: _o,
    useCacheRefresh: jh
  };
  Co.useEffectEvent = dh;
  var Eh = {
    readContext: yt,
    use: Gi,
    useCallback: _h,
    useContext: yt,
    useEffect: yo,
    useImperativeHandle: ph,
    useInsertionEffect: fh,
    useLayoutEffect: hh,
    useMemo: bh,
    useReducer: go,
    useRef: oh,
    useState: function() {
      return go(Vn);
    },
    useDebugValue: wo,
    useDeferredValue: function(e, t) {
      var n = st();
      return Fe === null ? jo(n, e, t) : gh(
        n,
        Fe.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = go(Vn)[0], t = st().memoizedState;
      return [
        typeof e == "boolean" ? e : Tl(e),
        t
      ];
    },
    useSyncExternalStore: Qf,
    useId: wh,
    useHostTransitionStatus: ko,
    useFormState: rh,
    useActionState: rh,
    useOptimistic: function(e, t) {
      var n = st();
      return Fe !== null ? If(n, Fe, e, t) : (n.baseState = e, [e, n.queue.dispatch]);
    },
    useMemoCache: _o,
    useCacheRefresh: jh
  };
  Eh.useEffectEvent = dh;
  function Eo(e, t, n, s) {
    t = e.memoizedState, n = n(s, t), n = n == null ? t : g({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var Mo = {
    enqueueSetState: function(e, t, n) {
      e = e._reactInternals;
      var s = en(), r = fa(s);
      r.payload = t, n != null && (r.callback = n), t = ha(e, r, s), t !== null && (Vt(t, e, s), Nl(t, e, s));
    },
    enqueueReplaceState: function(e, t, n) {
      e = e._reactInternals;
      var s = en(), r = fa(s);
      r.tag = 1, r.payload = t, n != null && (r.callback = n), t = ha(e, r, s), t !== null && (Vt(t, e, s), Nl(t, e, s));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var n = en(), s = fa(n);
      s.tag = 2, t != null && (s.callback = t), t = ha(e, s, n), t !== null && (Vt(t, e, n), Nl(t, e, n));
    }
  };
  function Mh(e, t, n, s, r, u, p) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(s, u, p) : t.prototype && t.prototype.isPureReactComponent ? !gl(n, s) || !gl(r, u) : !0;
  }
  function Th(e, t, n, s) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, s), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, s), t.state !== e && Mo.enqueueReplaceState(t, t.state, null);
  }
  function Ia(e, t) {
    var n = t;
    if ("ref" in t) {
      n = {};
      for (var s in t)
        s !== "ref" && (n[s] = t[s]);
    }
    if (e = e.defaultProps) {
      n === t && (n = g({}, n));
      for (var r in e)
        n[r] === void 0 && (n[r] = e[r]);
    }
    return n;
  }
  function Ah(e) {
    Si(e);
  }
  function Rh(e) {
    console.error(e);
  }
  function Oh(e) {
    Si(e);
  }
  function Qi(e, t) {
    try {
      var n = e.onUncaughtError;
      n(t.value, { componentStack: t.stack });
    } catch (s) {
      setTimeout(function() {
        throw s;
      });
    }
  }
  function zh(e, t, n) {
    try {
      var s = e.onCaughtError;
      s(n.value, {
        componentStack: n.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (r) {
      setTimeout(function() {
        throw r;
      });
    }
  }
  function To(e, t, n) {
    return n = fa(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
      Qi(e, t);
    }, n;
  }
  function Dh(e) {
    return e = fa(e), e.tag = 3, e;
  }
  function Hh(e, t, n, s) {
    var r = n.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var u = s.value;
      e.payload = function() {
        return r(u);
      }, e.callback = function() {
        zh(t, n, s);
      };
    }
    var p = n.stateNode;
    p !== null && typeof p.componentDidCatch == "function" && (e.callback = function() {
      zh(t, n, s), typeof r != "function" && (va === null ? va = /* @__PURE__ */ new Set([this]) : va.add(this));
      var x = s.stack;
      this.componentDidCatch(s.value, {
        componentStack: x !== null ? x : ""
      });
    });
  }
  function Qg(e, t, n, s, r) {
    if (n.flags |= 32768, s !== null && typeof s == "object" && typeof s.then == "function") {
      if (t = n.alternate, t !== null && Ms(
        t,
        n,
        r,
        !0
      ), n = Jt.current, n !== null) {
        switch (n.tag) {
          case 31:
          case 13:
            return fn === null ? lc() : n.alternate === null && tt === 0 && (tt = 3), n.flags &= -257, n.flags |= 65536, n.lanes = r, s === zi ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([s]) : t.add(s), tu(e, s, r)), !1;
          case 22:
            return n.flags |= 65536, s === zi ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([s])
            }, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([s]) : n.add(s)), tu(e, s, r)), !1;
        }
        throw Error(o(435, n.tag));
      }
      return tu(e, s, r), lc(), !1;
    }
    if (Te)
      return t = Jt.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = r, s !== Zr && (e = Error(o(422), { cause: s }), yl(rn(e, n)))) : (s !== Zr && (t = Error(o(423), {
        cause: s
      }), yl(
        rn(t, n)
      )), e = e.current.alternate, e.flags |= 65536, r &= -r, e.lanes |= r, s = rn(s, n), r = To(
        e.stateNode,
        s,
        r
      ), lo(e, r), tt !== 4 && (tt = 2)), !1;
    var u = Error(o(520), { cause: s });
    if (u = rn(u, n), Bl === null ? Bl = [u] : Bl.push(u), tt !== 4 && (tt = 2), t === null) return !0;
    s = rn(s, n), n = t;
    do {
      switch (n.tag) {
        case 3:
          return n.flags |= 65536, e = r & -r, n.lanes |= e, e = To(n.stateNode, s, e), lo(n, e), !1;
        case 1:
          if (t = n.type, u = n.stateNode, (n.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || u !== null && typeof u.componentDidCatch == "function" && (va === null || !va.has(u))))
            return n.flags |= 65536, r &= -r, n.lanes |= r, r = Dh(r), Hh(
              r,
              e,
              n,
              s
            ), lo(n, r), !1;
      }
      n = n.return;
    } while (n !== null);
    return !1;
  }
  var Ao = Error(o(461)), ot = !1;
  function wt(e, t, n, s) {
    t.child = e === null ? Bf(t, null, n, s) : Pa(
      t,
      e.child,
      n,
      s
    );
  }
  function Lh(e, t, n, s, r) {
    n = n.render;
    var u = t.ref;
    if ("ref" in s) {
      var p = {};
      for (var x in s)
        x !== "ref" && (p[x] = s[x]);
    } else p = s;
    return Qa(t), s = fo(
      e,
      t,
      n,
      p,
      u,
      r
    ), x = ho(), e !== null && !ot ? (mo(e, t, r), Yn(e, t, r)) : (Te && x && Xr(t), t.flags |= 1, wt(e, t, s, r), t.child);
  }
  function $h(e, t, n, s, r) {
    if (e === null) {
      var u = n.type;
      return typeof u == "function" && !Vr(u) && u.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = u, Uh(
        e,
        t,
        u,
        s,
        r
      )) : (e = Ei(
        n.type,
        null,
        s,
        t,
        t.mode,
        r
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (u = e.child, !Uo(e, r)) {
      var p = u.memoizedProps;
      if (n = n.compare, n = n !== null ? n : gl, n(p, s) && e.ref === t.ref)
        return Yn(e, t, r);
    }
    return t.flags |= 1, e = $n(u, s), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Uh(e, t, n, s, r) {
    if (e !== null) {
      var u = e.memoizedProps;
      if (gl(u, s) && e.ref === t.ref)
        if (ot = !1, t.pendingProps = s = u, Uo(e, r))
          (e.flags & 131072) !== 0 && (ot = !0);
        else
          return t.lanes = e.lanes, Yn(e, t, r);
    }
    return Ro(
      e,
      t,
      n,
      s,
      r
    );
  }
  function Bh(e, t, n, s) {
    var r = s.children, u = e !== null ? e.memoizedState : null;
    if (e === null && t.stateNode === null && (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), s.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (u = u !== null ? u.baseLanes | n : n, e !== null) {
          for (s = t.child = e.child, r = 0; s !== null; )
            r = r | s.lanes | s.childLanes, s = s.sibling;
          s = r & ~u;
        } else s = 0, t.child = null;
        return Fh(
          e,
          t,
          u,
          n,
          s
        );
      }
      if ((n & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && Ri(
          t,
          u !== null ? u.cachePool : null
        ), u !== null ? Vf(t, u) : co(), Yf(t);
      else
        return s = t.lanes = 536870912, Fh(
          e,
          t,
          u !== null ? u.baseLanes | n : n,
          n,
          s
        );
    } else
      u !== null ? (Ri(t, u.cachePool), Vf(t, u), pa(), t.memoizedState = null) : (e !== null && Ri(t, null), co(), pa());
    return wt(e, t, r, n), t.child;
  }
  function Ol(e, t) {
    return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function Fh(e, t, n, s, r) {
    var u = to();
    return u = u === null ? null : { parent: ct._currentValue, pool: u }, t.memoizedState = {
      baseLanes: n,
      cachePool: u
    }, e !== null && Ri(t, null), co(), Yf(t), e !== null && Ms(e, t, s, !0), t.childLanes = r, null;
  }
  function Zi(e, t) {
    return t = Ji(
      { mode: t.mode, children: t.children },
      e.mode
    ), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function Gh(e, t, n) {
    return Pa(t, e.child, null, n), e = Zi(t, t.pendingProps), e.flags |= 2, Pt(t), t.memoizedState = null, e;
  }
  function Zg(e, t, n) {
    var s = t.pendingProps, r = (t.flags & 128) !== 0;
    if (t.flags &= -129, e === null) {
      if (Te) {
        if (s.mode === "hidden")
          return e = Zi(t, s), t.lanes = 536870912, Ol(null, e);
        if (oo(t), (e = Qe) ? (e = ep(
          e,
          dn
        ), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: ca !== null ? { id: Cn, overflow: En } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = kf(e), n.return = t, t.child = n, xt = t, Qe = null)) : e = null, e === null) throw oa(t);
        return t.lanes = 536870912, null;
      }
      return Zi(t, s);
    }
    var u = e.memoizedState;
    if (u !== null) {
      var p = u.dehydrated;
      if (oo(t), r)
        if (t.flags & 256)
          t.flags &= -257, t = Gh(
            e,
            t,
            n
          );
        else if (t.memoizedState !== null)
          t.child = e.child, t.flags |= 128, t = null;
        else throw Error(o(558));
      else if (ot || Ms(e, t, n, !1), r = (n & e.childLanes) !== 0, ot || r) {
        if (s = Ye, s !== null && (p = Ad(s, n), p !== 0 && p !== u.retryLane))
          throw u.retryLane = p, Va(e, p), Vt(s, e, p), Ao;
        lc(), t = Gh(
          e,
          t,
          n
        );
      } else
        e = u.treeContext, Qe = hn(p.nextSibling), xt = t, Te = !0, ra = null, dn = !1, e !== null && Ef(t, e), t = Zi(t, s), t.flags |= 4096;
      return t;
    }
    return e = $n(e.child, {
      mode: s.mode,
      children: s.children
    }), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function Ki(e, t) {
    var n = t.ref;
    if (n === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof n != "function" && typeof n != "object")
        throw Error(o(284));
      (e === null || e.ref !== n) && (t.flags |= 4194816);
    }
  }
  function Ro(e, t, n, s, r) {
    return Qa(t), n = fo(
      e,
      t,
      n,
      s,
      void 0,
      r
    ), s = ho(), e !== null && !ot ? (mo(e, t, r), Yn(e, t, r)) : (Te && s && Xr(t), t.flags |= 1, wt(e, t, n, r), t.child);
  }
  function Vh(e, t, n, s, r, u) {
    return Qa(t), t.updateQueue = null, n = Xf(
      t,
      s,
      n,
      r
    ), qf(e), s = ho(), e !== null && !ot ? (mo(e, t, u), Yn(e, t, u)) : (Te && s && Xr(t), t.flags |= 1, wt(e, t, n, u), t.child);
  }
  function Yh(e, t, n, s, r) {
    if (Qa(t), t.stateNode === null) {
      var u = ks, p = n.contextType;
      typeof p == "object" && p !== null && (u = yt(p)), u = new n(s, u), t.memoizedState = u.state !== null && u.state !== void 0 ? u.state : null, u.updater = Mo, t.stateNode = u, u._reactInternals = t, u = t.stateNode, u.props = s, u.state = t.memoizedState, u.refs = {}, ao(t), p = n.contextType, u.context = typeof p == "object" && p !== null ? yt(p) : ks, u.state = t.memoizedState, p = n.getDerivedStateFromProps, typeof p == "function" && (Eo(
        t,
        n,
        p,
        s
      ), u.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof u.getSnapshotBeforeUpdate == "function" || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (p = u.state, typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount(), p !== u.state && Mo.enqueueReplaceState(u, u.state, null), El(t, s, u, r), Cl(), u.state = t.memoizedState), typeof u.componentDidMount == "function" && (t.flags |= 4194308), s = !0;
    } else if (e === null) {
      u = t.stateNode;
      var x = t.memoizedProps, M = Ia(n, x);
      u.props = M;
      var L = u.context, q = n.contextType;
      p = ks, typeof q == "object" && q !== null && (p = yt(q));
      var K = n.getDerivedStateFromProps;
      q = typeof K == "function" || typeof u.getSnapshotBeforeUpdate == "function", x = t.pendingProps !== x, q || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (x || L !== p) && Th(
        t,
        u,
        s,
        p
      ), da = !1;
      var U = t.memoizedState;
      u.state = U, El(t, s, u, r), Cl(), L = t.memoizedState, x || U !== L || da ? (typeof K == "function" && (Eo(
        t,
        n,
        K,
        s
      ), L = t.memoizedState), (M = da || Mh(
        t,
        n,
        M,
        s,
        U,
        L,
        p
      )) ? (q || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = s, t.memoizedState = L), u.props = s, u.state = L, u.context = p, s = M) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), s = !1);
    } else {
      u = t.stateNode, so(e, t), p = t.memoizedProps, q = Ia(n, p), u.props = q, K = t.pendingProps, U = u.context, L = n.contextType, M = ks, typeof L == "object" && L !== null && (M = yt(L)), x = n.getDerivedStateFromProps, (L = typeof x == "function" || typeof u.getSnapshotBeforeUpdate == "function") || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (p !== K || U !== M) && Th(
        t,
        u,
        s,
        M
      ), da = !1, U = t.memoizedState, u.state = U, El(t, s, u, r), Cl();
      var V = t.memoizedState;
      p !== K || U !== V || da || e !== null && e.dependencies !== null && Ti(e.dependencies) ? (typeof x == "function" && (Eo(
        t,
        n,
        x,
        s
      ), V = t.memoizedState), (q = da || Mh(
        t,
        n,
        q,
        s,
        U,
        V,
        M
      ) || e !== null && e.dependencies !== null && Ti(e.dependencies)) ? (L || typeof u.UNSAFE_componentWillUpdate != "function" && typeof u.componentWillUpdate != "function" || (typeof u.componentWillUpdate == "function" && u.componentWillUpdate(s, V, M), typeof u.UNSAFE_componentWillUpdate == "function" && u.UNSAFE_componentWillUpdate(
        s,
        V,
        M
      )), typeof u.componentDidUpdate == "function" && (t.flags |= 4), typeof u.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof u.componentDidUpdate != "function" || p === e.memoizedProps && U === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || p === e.memoizedProps && U === e.memoizedState || (t.flags |= 1024), t.memoizedProps = s, t.memoizedState = V), u.props = s, u.state = V, u.context = M, s = q) : (typeof u.componentDidUpdate != "function" || p === e.memoizedProps && U === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || p === e.memoizedProps && U === e.memoizedState || (t.flags |= 1024), s = !1);
    }
    return u = s, Ki(e, t), s = (t.flags & 128) !== 0, u || s ? (u = t.stateNode, n = s && typeof n.getDerivedStateFromError != "function" ? null : u.render(), t.flags |= 1, e !== null && s ? (t.child = Pa(
      t,
      e.child,
      null,
      r
    ), t.child = Pa(
      t,
      null,
      n,
      r
    )) : wt(e, t, n, r), t.memoizedState = u.state, e = t.child) : e = Yn(
      e,
      t,
      r
    ), e;
  }
  function qh(e, t, n, s) {
    return qa(), t.flags |= 256, wt(e, t, n, s), t.child;
  }
  var Oo = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function zo(e) {
    return { baseLanes: e, cachePool: zf() };
  }
  function Do(e, t, n) {
    return e = e !== null ? e.childLanes & ~n : 0, t && (e |= It), e;
  }
  function Xh(e, t, n) {
    var s = t.pendingProps, r = !1, u = (t.flags & 128) !== 0, p;
    if ((p = u) || (p = e !== null && e.memoizedState === null ? !1 : (at.current & 2) !== 0), p && (r = !0, t.flags &= -129), p = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (Te) {
        if (r ? ma(t) : pa(), (e = Qe) ? (e = ep(
          e,
          dn
        ), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: ca !== null ? { id: Cn, overflow: En } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = kf(e), n.return = t, t.child = n, xt = t, Qe = null)) : e = null, e === null) throw oa(t);
        return bu(e) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      var x = s.children;
      return s = s.fallback, r ? (pa(), r = t.mode, x = Ji(
        { mode: "hidden", children: x },
        r
      ), s = Ya(
        s,
        r,
        n,
        null
      ), x.return = t, s.return = t, x.sibling = s, t.child = x, s = t.child, s.memoizedState = zo(n), s.childLanes = Do(
        e,
        p,
        n
      ), t.memoizedState = Oo, Ol(null, s)) : (ma(t), Ho(t, x));
    }
    var M = e.memoizedState;
    if (M !== null && (x = M.dehydrated, x !== null)) {
      if (u)
        t.flags & 256 ? (ma(t), t.flags &= -257, t = Lo(
          e,
          t,
          n
        )) : t.memoizedState !== null ? (pa(), t.child = e.child, t.flags |= 128, t = null) : (pa(), x = s.fallback, r = t.mode, s = Ji(
          { mode: "visible", children: s.children },
          r
        ), x = Ya(
          x,
          r,
          n,
          null
        ), x.flags |= 2, s.return = t, x.return = t, s.sibling = x, t.child = s, Pa(
          t,
          e.child,
          null,
          n
        ), s = t.child, s.memoizedState = zo(n), s.childLanes = Do(
          e,
          p,
          n
        ), t.memoizedState = Oo, t = Ol(null, s));
      else if (ma(t), bu(x)) {
        if (p = x.nextSibling && x.nextSibling.dataset, p) var L = p.dgst;
        p = L, s = Error(o(419)), s.stack = "", s.digest = p, yl({ value: s, source: null, stack: null }), t = Lo(
          e,
          t,
          n
        );
      } else if (ot || Ms(e, t, n, !1), p = (n & e.childLanes) !== 0, ot || p) {
        if (p = Ye, p !== null && (s = Ad(p, n), s !== 0 && s !== M.retryLane))
          throw M.retryLane = s, Va(e, s), Vt(p, e, s), Ao;
        _u(x) || lc(), t = Lo(
          e,
          t,
          n
        );
      } else
        _u(x) ? (t.flags |= 192, t.child = e.child, t = null) : (e = M.treeContext, Qe = hn(
          x.nextSibling
        ), xt = t, Te = !0, ra = null, dn = !1, e !== null && Ef(t, e), t = Ho(
          t,
          s.children
        ), t.flags |= 4096);
      return t;
    }
    return r ? (pa(), x = s.fallback, r = t.mode, M = e.child, L = M.sibling, s = $n(M, {
      mode: "hidden",
      children: s.children
    }), s.subtreeFlags = M.subtreeFlags & 65011712, L !== null ? x = $n(
      L,
      x
    ) : (x = Ya(
      x,
      r,
      n,
      null
    ), x.flags |= 2), x.return = t, s.return = t, s.sibling = x, t.child = s, Ol(null, s), s = t.child, x = e.child.memoizedState, x === null ? x = zo(n) : (r = x.cachePool, r !== null ? (M = ct._currentValue, r = r.parent !== M ? { parent: M, pool: M } : r) : r = zf(), x = {
      baseLanes: x.baseLanes | n,
      cachePool: r
    }), s.memoizedState = x, s.childLanes = Do(
      e,
      p,
      n
    ), t.memoizedState = Oo, Ol(e.child, s)) : (ma(t), n = e.child, e = n.sibling, n = $n(n, {
      mode: "visible",
      children: s.children
    }), n.return = t, n.sibling = null, e !== null && (p = t.deletions, p === null ? (t.deletions = [e], t.flags |= 16) : p.push(e)), t.child = n, t.memoizedState = null, n);
  }
  function Ho(e, t) {
    return t = Ji(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function Ji(e, t) {
    return e = Kt(22, e, null, t), e.lanes = 0, e;
  }
  function Lo(e, t, n) {
    return Pa(t, e.child, null, n), e = Ho(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function Qh(e, t, n) {
    e.lanes |= t;
    var s = e.alternate;
    s !== null && (s.lanes |= t), Pr(e.return, t, n);
  }
  function $o(e, t, n, s, r, u) {
    var p = e.memoizedState;
    p === null ? e.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: s,
      tail: n,
      tailMode: r,
      treeForkCount: u
    } : (p.isBackwards = t, p.rendering = null, p.renderingStartTime = 0, p.last = s, p.tail = n, p.tailMode = r, p.treeForkCount = u);
  }
  function Zh(e, t, n) {
    var s = t.pendingProps, r = s.revealOrder, u = s.tail;
    s = s.children;
    var p = at.current, x = (p & 2) !== 0;
    if (x ? (p = p & 1 | 2, t.flags |= 128) : p &= 1, I(at, p), wt(e, t, s, n), s = Te ? xl : 0, !x && e !== null && (e.flags & 128) !== 0)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13)
          e.memoizedState !== null && Qh(e, n, t);
        else if (e.tag === 19)
          Qh(e, n, t);
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
    switch (r) {
      case "forwards":
        for (n = t.child, r = null; n !== null; )
          e = n.alternate, e !== null && $i(e) === null && (r = n), n = n.sibling;
        n = r, n === null ? (r = t.child, t.child = null) : (r = n.sibling, n.sibling = null), $o(
          t,
          !1,
          r,
          n,
          u,
          s
        );
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (n = null, r = t.child, t.child = null; r !== null; ) {
          if (e = r.alternate, e !== null && $i(e) === null) {
            t.child = r;
            break;
          }
          e = r.sibling, r.sibling = n, n = r, r = e;
        }
        $o(
          t,
          !0,
          n,
          null,
          u,
          s
        );
        break;
      case "together":
        $o(
          t,
          !1,
          null,
          null,
          void 0,
          s
        );
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Yn(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), ga |= t.lanes, (n & t.childLanes) === 0)
      if (e !== null) {
        if (Ms(
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
  function Uo(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && Ti(e)));
  }
  function Kg(e, t, n) {
    switch (t.tag) {
      case 3:
        Le(t, t.stateNode.containerInfo), ua(t, ct, e.memoizedState.cache), qa();
        break;
      case 27:
      case 5:
        lt(t);
        break;
      case 4:
        Le(t, t.stateNode.containerInfo);
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
          return t.flags |= 128, oo(t), null;
        break;
      case 13:
        var s = t.memoizedState;
        if (s !== null)
          return s.dehydrated !== null ? (ma(t), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? Xh(e, t, n) : (ma(t), e = Yn(
            e,
            t,
            n
          ), e !== null ? e.sibling : null);
        ma(t);
        break;
      case 19:
        var r = (e.flags & 128) !== 0;
        if (s = (n & t.childLanes) !== 0, s || (Ms(
          e,
          t,
          n,
          !1
        ), s = (n & t.childLanes) !== 0), r) {
          if (s)
            return Zh(
              e,
              t,
              n
            );
          t.flags |= 128;
        }
        if (r = t.memoizedState, r !== null && (r.rendering = null, r.tail = null, r.lastEffect = null), I(at, at.current), s) break;
        return null;
      case 22:
        return t.lanes = 0, Bh(
          e,
          t,
          n,
          t.pendingProps
        );
      case 24:
        ua(t, ct, e.memoizedState.cache);
    }
    return Yn(e, t, n);
  }
  function Kh(e, t, n) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        ot = !0;
      else {
        if (!Uo(e, n) && (t.flags & 128) === 0)
          return ot = !1, Kg(
            e,
            t,
            n
          );
        ot = (e.flags & 131072) !== 0;
      }
    else
      ot = !1, Te && (t.flags & 1048576) !== 0 && Cf(t, xl, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          var s = t.pendingProps;
          if (e = Ka(t.elementType), t.type = e, typeof e == "function")
            Vr(e) ? (s = Ia(e, s), t.tag = 1, t = Yh(
              null,
              t,
              e,
              s,
              n
            )) : (t.tag = 0, t = Ro(
              null,
              t,
              e,
              s,
              n
            ));
          else {
            if (e != null) {
              var r = e.$$typeof;
              if (r === J) {
                t.tag = 11, t = Lh(
                  null,
                  t,
                  e,
                  s,
                  n
                );
                break e;
              } else if (r === X) {
                t.tag = 14, t = $h(
                  null,
                  t,
                  e,
                  s,
                  n
                );
                break e;
              }
            }
            throw t = te(e) || e, Error(o(306, t, ""));
          }
        }
        return t;
      case 0:
        return Ro(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 1:
        return s = t.type, r = Ia(
          s,
          t.pendingProps
        ), Yh(
          e,
          t,
          s,
          r,
          n
        );
      case 3:
        e: {
          if (Le(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(o(387));
          s = t.pendingProps;
          var u = t.memoizedState;
          r = u.element, so(e, t), El(t, s, null, n);
          var p = t.memoizedState;
          if (s = p.cache, ua(t, ct, s), s !== u.cache && Wr(
            t,
            [ct],
            n,
            !0
          ), Cl(), s = p.element, u.isDehydrated)
            if (u = {
              element: s,
              isDehydrated: !1,
              cache: p.cache
            }, t.updateQueue.baseState = u, t.memoizedState = u, t.flags & 256) {
              t = qh(
                e,
                t,
                s,
                n
              );
              break e;
            } else if (s !== r) {
              r = rn(
                Error(o(424)),
                t
              ), yl(r), t = qh(
                e,
                t,
                s,
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
              for (Qe = hn(e.firstChild), xt = t, Te = !0, ra = null, dn = !0, n = Bf(
                t,
                null,
                s,
                n
              ), t.child = n; n; )
                n.flags = n.flags & -3 | 4096, n = n.sibling;
            }
          else {
            if (qa(), s === r) {
              t = Yn(
                e,
                t,
                n
              );
              break e;
            }
            wt(e, t, s, n);
          }
          t = t.child;
        }
        return t;
      case 26:
        return Ki(e, t), e === null ? (n = ip(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = n : Te || (n = t.type, e = t.pendingProps, s = fc(
          he.current
        ).createElement(n), s[vt] = t, s[Lt] = e, jt(s, n, e), bt(s), t.stateNode = s) : t.memoizedState = ip(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return lt(t), e === null && Te && (s = t.stateNode = ap(
          t.type,
          t.pendingProps,
          he.current
        ), xt = t, dn = !0, r = Qe, ja(t.type) ? (gu = r, Qe = hn(s.firstChild)) : Qe = r), wt(
          e,
          t,
          t.pendingProps.children,
          n
        ), Ki(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && Te && ((r = s = Qe) && (s = kv(
          s,
          t.type,
          t.pendingProps,
          dn
        ), s !== null ? (t.stateNode = s, xt = t, Qe = hn(s.firstChild), dn = !1, r = !0) : r = !1), r || oa(t)), lt(t), r = t.type, u = t.pendingProps, p = e !== null ? e.memoizedProps : null, s = u.children, hu(r, u) ? s = null : p !== null && hu(r, p) && (t.flags |= 32), t.memoizedState !== null && (r = fo(
          e,
          t,
          Bg,
          null,
          null,
          n
        ), Zl._currentValue = r), Ki(e, t), wt(e, t, s, n), t.child;
      case 6:
        return e === null && Te && ((e = n = Qe) && (n = Nv(
          n,
          t.pendingProps,
          dn
        ), n !== null ? (t.stateNode = n, xt = t, Qe = null, e = !0) : e = !1), e || oa(t)), null;
      case 13:
        return Xh(e, t, n);
      case 4:
        return Le(
          t,
          t.stateNode.containerInfo
        ), s = t.pendingProps, e === null ? t.child = Pa(
          t,
          null,
          s,
          n
        ) : wt(e, t, s, n), t.child;
      case 11:
        return Lh(
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
        return s = t.pendingProps, ua(t, t.type, s.value), wt(e, t, s.children, n), t.child;
      case 9:
        return r = t.type._context, s = t.pendingProps.children, Qa(t), r = yt(r), s = s(r), t.flags |= 1, wt(e, t, s, n), t.child;
      case 14:
        return $h(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 15:
        return Uh(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 19:
        return Zh(e, t, n);
      case 31:
        return Zg(e, t, n);
      case 22:
        return Bh(
          e,
          t,
          n,
          t.pendingProps
        );
      case 24:
        return Qa(t), s = yt(ct), e === null ? (r = to(), r === null && (r = Ye, u = Ir(), r.pooledCache = u, u.refCount++, u !== null && (r.pooledCacheLanes |= n), r = u), t.memoizedState = { parent: s, cache: r }, ao(t), ua(t, ct, r)) : ((e.lanes & n) !== 0 && (so(e, t), El(t, null, null, n), Cl()), r = e.memoizedState, u = t.memoizedState, r.parent !== s ? (r = { parent: s, cache: s }, t.memoizedState = r, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = r), ua(t, ct, s)) : (s = u.cache, ua(t, ct, s), s !== r.cache && Wr(
          t,
          [ct],
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
  function qn(e) {
    e.flags |= 4;
  }
  function Bo(e, t, n, s, r) {
    if ((t = (e.mode & 32) !== 0) && (t = !1), t) {
      if (e.flags |= 16777216, (r & 335544128) === r)
        if (e.stateNode.complete) e.flags |= 8192;
        else if (wm()) e.flags |= 8192;
        else
          throw Ja = zi, no;
    } else e.flags &= -16777217;
  }
  function Jh(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !dp(t))
      if (wm()) e.flags |= 8192;
      else
        throw Ja = zi, no;
  }
  function Pi(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? Ed() : 536870912, e.lanes |= t, Fs |= t);
  }
  function zl(e, t) {
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
          for (var s = null; n !== null; )
            n.alternate !== null && (s = n), n = n.sibling;
          s === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : s.sibling = null;
      }
  }
  function Ze(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, s = 0;
    if (t)
      for (var r = e.child; r !== null; )
        n |= r.lanes | r.childLanes, s |= r.subtreeFlags & 65011712, s |= r.flags & 65011712, r.return = e, r = r.sibling;
    else
      for (r = e.child; r !== null; )
        n |= r.lanes | r.childLanes, s |= r.subtreeFlags, s |= r.flags, r.return = e, r = r.sibling;
    return e.subtreeFlags |= s, e.childLanes = n, t;
  }
  function Jg(e, t, n) {
    var s = t.pendingProps;
    switch (Qr(t), t.tag) {
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
        return n = t.stateNode, s = null, e !== null && (s = e.memoizedState.cache), t.memoizedState.cache !== s && (t.flags |= 2048), Fn(ct), Se(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (Es(t) ? qn(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Kr())), Ze(t), null;
      case 26:
        var r = t.type, u = t.memoizedState;
        return e === null ? (qn(t), u !== null ? (Ze(t), Jh(t, u)) : (Ze(t), Bo(
          t,
          r,
          null,
          s,
          n
        ))) : u ? u !== e.memoizedState ? (qn(t), Ze(t), Jh(t, u)) : (Ze(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== s && qn(t), Ze(t), Bo(
          t,
          r,
          e,
          s,
          n
        )), null;
      case 27:
        if (pt(t), n = he.current, r = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== s && qn(t);
        else {
          if (!s) {
            if (t.stateNode === null)
              throw Error(o(166));
            return Ze(t), null;
          }
          e = ae.current, Es(t) ? Mf(t) : (e = ap(r, s, n), t.stateNode = e, qn(t));
        }
        return Ze(t), null;
      case 5:
        if (pt(t), r = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== s && qn(t);
        else {
          if (!s) {
            if (t.stateNode === null)
              throw Error(o(166));
            return Ze(t), null;
          }
          if (u = ae.current, Es(t))
            Mf(t);
          else {
            var p = fc(
              he.current
            );
            switch (u) {
              case 1:
                u = p.createElementNS(
                  "http://www.w3.org/2000/svg",
                  r
                );
                break;
              case 2:
                u = p.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  r
                );
                break;
              default:
                switch (r) {
                  case "svg":
                    u = p.createElementNS(
                      "http://www.w3.org/2000/svg",
                      r
                    );
                    break;
                  case "math":
                    u = p.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      r
                    );
                    break;
                  case "script":
                    u = p.createElement("div"), u.innerHTML = "<script><\/script>", u = u.removeChild(
                      u.firstChild
                    );
                    break;
                  case "select":
                    u = typeof s.is == "string" ? p.createElement("select", {
                      is: s.is
                    }) : p.createElement("select"), s.multiple ? u.multiple = !0 : s.size && (u.size = s.size);
                    break;
                  default:
                    u = typeof s.is == "string" ? p.createElement(r, { is: s.is }) : p.createElement(r);
                }
            }
            u[vt] = t, u[Lt] = s;
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
            e: switch (jt(u, r, s), r) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                s = !!s.autoFocus;
                break e;
              case "img":
                s = !0;
                break e;
              default:
                s = !1;
            }
            s && qn(t);
          }
        }
        return Ze(t), Bo(
          t,
          t.type,
          e === null ? null : e.memoizedProps,
          t.pendingProps,
          n
        ), null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== s && qn(t);
        else {
          if (typeof s != "string" && t.stateNode === null)
            throw Error(o(166));
          if (e = he.current, Es(t)) {
            if (e = t.stateNode, n = t.memoizedProps, s = null, r = xt, r !== null)
              switch (r.tag) {
                case 27:
                case 5:
                  s = r.memoizedProps;
              }
            e[vt] = t, e = !!(e.nodeValue === n || s !== null && s.suppressHydrationWarning === !0 || Xm(e.nodeValue, n)), e || oa(t, !0);
          } else
            e = fc(e).createTextNode(
              s
            ), e[vt] = t, t.stateNode = e;
        }
        return Ze(t), null;
      case 31:
        if (n = t.memoizedState, e === null || e.memoizedState !== null) {
          if (s = Es(t), n !== null) {
            if (e === null) {
              if (!s) throw Error(o(318));
              if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(557));
              e[vt] = t;
            } else
              qa(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Ze(t), e = !1;
          } else
            n = Kr(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
          if (!e)
            return t.flags & 256 ? (Pt(t), t) : (Pt(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(o(558));
        }
        return Ze(t), null;
      case 13:
        if (s = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (r = Es(t), s !== null && s.dehydrated !== null) {
            if (e === null) {
              if (!r) throw Error(o(318));
              if (r = t.memoizedState, r = r !== null ? r.dehydrated : null, !r) throw Error(o(317));
              r[vt] = t;
            } else
              qa(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Ze(t), r = !1;
          } else
            r = Kr(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = r), r = !0;
          if (!r)
            return t.flags & 256 ? (Pt(t), t) : (Pt(t), null);
        }
        return Pt(t), (t.flags & 128) !== 0 ? (t.lanes = n, t) : (n = s !== null, e = e !== null && e.memoizedState !== null, n && (s = t.child, r = null, s.alternate !== null && s.alternate.memoizedState !== null && s.alternate.memoizedState.cachePool !== null && (r = s.alternate.memoizedState.cachePool.pool), u = null, s.memoizedState !== null && s.memoizedState.cachePool !== null && (u = s.memoizedState.cachePool.pool), u !== r && (s.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), Pi(t, t.updateQueue), Ze(t), null);
      case 4:
        return Se(), e === null && ru(t.stateNode.containerInfo), Ze(t), null;
      case 10:
        return Fn(t.type), Ze(t), null;
      case 19:
        if (F(at), s = t.memoizedState, s === null) return Ze(t), null;
        if (r = (t.flags & 128) !== 0, u = s.rendering, u === null)
          if (r) zl(s, !1);
          else {
            if (tt !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (u = $i(e), u !== null) {
                  for (t.flags |= 128, zl(s, !1), e = u.updateQueue, t.updateQueue = e, Pi(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null; )
                    Sf(n, e), n = n.sibling;
                  return I(
                    at,
                    at.current & 1 | 2
                  ), Te && Un(t, s.treeForkCount), t.child;
                }
                e = e.sibling;
              }
            s.tail !== null && nt() > nc && (t.flags |= 128, r = !0, zl(s, !1), t.lanes = 4194304);
          }
        else {
          if (!r)
            if (e = $i(u), e !== null) {
              if (t.flags |= 128, r = !0, e = e.updateQueue, t.updateQueue = e, Pi(t, e), zl(s, !0), s.tail === null && s.tailMode === "hidden" && !u.alternate && !Te)
                return Ze(t), null;
            } else
              2 * nt() - s.renderingStartTime > nc && n !== 536870912 && (t.flags |= 128, r = !0, zl(s, !1), t.lanes = 4194304);
          s.isBackwards ? (u.sibling = t.child, t.child = u) : (e = s.last, e !== null ? e.sibling = u : t.child = u, s.last = u);
        }
        return s.tail !== null ? (e = s.tail, s.rendering = e, s.tail = e.sibling, s.renderingStartTime = nt(), e.sibling = null, n = at.current, I(
          at,
          r ? n & 1 | 2 : n & 1
        ), Te && Un(t, s.treeForkCount), e) : (Ze(t), null);
      case 22:
      case 23:
        return Pt(t), ro(), s = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== s && (t.flags |= 8192) : s && (t.flags |= 8192), s ? (n & 536870912) !== 0 && (t.flags & 128) === 0 && (Ze(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Ze(t), n = t.updateQueue, n !== null && Pi(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), s = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (s = t.memoizedState.cachePool.pool), s !== n && (t.flags |= 2048), e !== null && F(Za), null;
      case 24:
        return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), Fn(ct), Ze(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(o(156, t.tag));
  }
  function Pg(e, t) {
    switch (Qr(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Fn(ct), Se(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return pt(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (Pt(t), t.alternate === null)
            throw Error(o(340));
          qa();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 13:
        if (Pt(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(o(340));
          qa();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return F(at), null;
      case 4:
        return Se(), null;
      case 10:
        return Fn(t.type), null;
      case 22:
      case 23:
        return Pt(t), ro(), e !== null && F(Za), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return Fn(ct), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Ph(e, t) {
    switch (Qr(t), t.tag) {
      case 3:
        Fn(ct), Se();
        break;
      case 26:
      case 27:
      case 5:
        pt(t);
        break;
      case 4:
        Se();
        break;
      case 31:
        t.memoizedState !== null && Pt(t);
        break;
      case 13:
        Pt(t);
        break;
      case 19:
        F(at);
        break;
      case 10:
        Fn(t.type);
        break;
      case 22:
      case 23:
        Pt(t), ro(), e !== null && F(Za);
        break;
      case 24:
        Fn(ct);
    }
  }
  function Dl(e, t) {
    try {
      var n = t.updateQueue, s = n !== null ? n.lastEffect : null;
      if (s !== null) {
        var r = s.next;
        n = r;
        do {
          if ((n.tag & e) === e) {
            s = void 0;
            var u = n.create, p = n.inst;
            s = u(), p.destroy = s;
          }
          n = n.next;
        } while (n !== r);
      }
    } catch (x) {
      Be(t, t.return, x);
    }
  }
  function _a(e, t, n) {
    try {
      var s = t.updateQueue, r = s !== null ? s.lastEffect : null;
      if (r !== null) {
        var u = r.next;
        s = u;
        do {
          if ((s.tag & e) === e) {
            var p = s.inst, x = p.destroy;
            if (x !== void 0) {
              p.destroy = void 0, r = t;
              var M = n, L = x;
              try {
                L();
              } catch (q) {
                Be(
                  r,
                  M,
                  q
                );
              }
            }
          }
          s = s.next;
        } while (s !== u);
      }
    } catch (q) {
      Be(t, t.return, q);
    }
  }
  function Wh(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var n = e.stateNode;
      try {
        Gf(t, n);
      } catch (s) {
        Be(e, e.return, s);
      }
    }
  }
  function Ih(e, t, n) {
    n.props = Ia(
      e.type,
      e.memoizedProps
    ), n.state = e.memoizedState;
    try {
      n.componentWillUnmount();
    } catch (s) {
      Be(e, t, s);
    }
  }
  function Hl(e, t) {
    try {
      var n = e.ref;
      if (n !== null) {
        switch (e.tag) {
          case 26:
          case 27:
          case 5:
            var s = e.stateNode;
            break;
          case 30:
            s = e.stateNode;
            break;
          default:
            s = e.stateNode;
        }
        typeof n == "function" ? e.refCleanup = n(s) : n.current = s;
      }
    } catch (r) {
      Be(e, t, r);
    }
  }
  function Mn(e, t) {
    var n = e.ref, s = e.refCleanup;
    if (n !== null)
      if (typeof s == "function")
        try {
          s();
        } catch (r) {
          Be(e, t, r);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof n == "function")
        try {
          n(null);
        } catch (r) {
          Be(e, t, r);
        }
      else n.current = null;
  }
  function em(e) {
    var t = e.type, n = e.memoizedProps, s = e.stateNode;
    try {
      e: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          n.autoFocus && s.focus();
          break e;
        case "img":
          n.src ? s.src = n.src : n.srcSet && (s.srcset = n.srcSet);
      }
    } catch (r) {
      Be(e, e.return, r);
    }
  }
  function Fo(e, t, n) {
    try {
      var s = e.stateNode;
      vv(s, e.type, n, t), s[Lt] = t;
    } catch (r) {
      Be(e, e.return, r);
    }
  }
  function tm(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && ja(e.type) || e.tag === 4;
  }
  function Go(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || tm(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && ja(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Vo(e, t, n) {
    var s = e.tag;
    if (s === 5 || s === 6)
      e = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(e, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(e), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = Hn));
    else if (s !== 4 && (s === 27 && ja(e.type) && (n = e.stateNode, t = null), e = e.child, e !== null))
      for (Vo(e, t, n), e = e.sibling; e !== null; )
        Vo(e, t, n), e = e.sibling;
  }
  function Wi(e, t, n) {
    var s = e.tag;
    if (s === 5 || s === 6)
      e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (s !== 4 && (s === 27 && ja(e.type) && (n = e.stateNode), e = e.child, e !== null))
      for (Wi(e, t, n), e = e.sibling; e !== null; )
        Wi(e, t, n), e = e.sibling;
  }
  function nm(e) {
    var t = e.stateNode, n = e.memoizedProps;
    try {
      for (var s = e.type, r = t.attributes; r.length; )
        t.removeAttributeNode(r[0]);
      jt(t, s, n), t[vt] = e, t[Lt] = n;
    } catch (u) {
      Be(e, e.return, u);
    }
  }
  var Xn = !1, ut = !1, Yo = !1, am = typeof WeakSet == "function" ? WeakSet : Set, gt = null;
  function Wg(e, t) {
    if (e = e.containerInfo, du = vc, e = pf(e), Hr(e)) {
      if ("selectionStart" in e)
        var n = {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      else
        e: {
          n = (n = e.ownerDocument) && n.defaultView || window;
          var s = n.getSelection && n.getSelection();
          if (s && s.rangeCount !== 0) {
            n = s.anchorNode;
            var r = s.anchorOffset, u = s.focusNode;
            s = s.focusOffset;
            try {
              n.nodeType, u.nodeType;
            } catch {
              n = null;
              break e;
            }
            var p = 0, x = -1, M = -1, L = 0, q = 0, K = e, U = null;
            t: for (; ; ) {
              for (var V; K !== n || r !== 0 && K.nodeType !== 3 || (x = p + r), K !== u || s !== 0 && K.nodeType !== 3 || (M = p + s), K.nodeType === 3 && (p += K.nodeValue.length), (V = K.firstChild) !== null; )
                U = K, K = V;
              for (; ; ) {
                if (K === e) break t;
                if (U === n && ++L === r && (x = p), U === u && ++q === s && (M = p), (V = K.nextSibling) !== null) break;
                K = U, U = K.parentNode;
              }
              K = V;
            }
            n = x === -1 || M === -1 ? null : { start: x, end: M };
          } else n = null;
        }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (fu = { focusedElem: e, selectionRange: n }, vc = !1, gt = t; gt !== null; )
      if (t = gt, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null)
        e.return = t, gt = e;
      else
        for (; gt !== null; ) {
          switch (t = gt, u = t.alternate, e = t.flags, t.tag) {
            case 0:
              if ((e & 4) !== 0 && (e = t.updateQueue, e = e !== null ? e.events : null, e !== null))
                for (n = 0; n < e.length; n++)
                  r = e[n], r.ref.impl = r.nextImpl;
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && u !== null) {
                e = void 0, n = t, r = u.memoizedProps, u = u.memoizedState, s = n.stateNode;
                try {
                  var oe = Ia(
                    n.type,
                    r
                  );
                  e = s.getSnapshotBeforeUpdate(
                    oe,
                    u
                  ), s.__reactInternalSnapshotBeforeUpdate = e;
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
              if ((e & 1024) !== 0) throw Error(o(163));
          }
          if (e = t.sibling, e !== null) {
            e.return = t.return, gt = e;
            break;
          }
          gt = t.return;
        }
  }
  function sm(e, t, n) {
    var s = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        Zn(e, n), s & 4 && Dl(5, n);
        break;
      case 1:
        if (Zn(e, n), s & 4)
          if (e = n.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (p) {
              Be(n, n.return, p);
            }
          else {
            var r = Ia(
              n.type,
              t.memoizedProps
            );
            t = t.memoizedState;
            try {
              e.componentDidUpdate(
                r,
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
        s & 64 && Wh(n), s & 512 && Hl(n, n.return);
        break;
      case 3:
        if (Zn(e, n), s & 64 && (e = n.updateQueue, e !== null)) {
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
            Gf(e, t);
          } catch (p) {
            Be(n, n.return, p);
          }
        }
        break;
      case 27:
        t === null && s & 4 && nm(n);
      case 26:
      case 5:
        Zn(e, n), t === null && s & 4 && em(n), s & 512 && Hl(n, n.return);
        break;
      case 12:
        Zn(e, n);
        break;
      case 31:
        Zn(e, n), s & 4 && cm(e, n);
        break;
      case 13:
        Zn(e, n), s & 4 && rm(e, n), s & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = cv.bind(
          null,
          n
        ), Cv(e, n))));
        break;
      case 22:
        if (s = n.memoizedState !== null || Xn, !s) {
          t = t !== null && t.memoizedState !== null || ut, r = Xn;
          var u = ut;
          Xn = s, (ut = t) && !u ? Kn(
            e,
            n,
            (n.subtreeFlags & 8772) !== 0
          ) : Zn(e, n), Xn = r, ut = u;
        }
        break;
      case 30:
        break;
      default:
        Zn(e, n);
    }
  }
  function lm(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, lm(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && vr(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var Ke = null, Ut = !1;
  function Qn(e, t, n) {
    for (n = n.child; n !== null; )
      im(e, t, n), n = n.sibling;
  }
  function im(e, t, n) {
    if (Rt && typeof Rt.onCommitFiberUnmount == "function")
      try {
        Rt.onCommitFiberUnmount(La, n);
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
        var s = Ke, r = Ut;
        ja(n.type) && (Ke = n.stateNode, Ut = !1), Qn(
          e,
          t,
          n
        ), ql(n.stateNode), Ke = s, Ut = r;
        break;
      case 5:
        ut || Mn(n, t);
      case 6:
        if (s = Ke, r = Ut, Ke = null, Qn(
          e,
          t,
          n
        ), Ke = s, Ut = r, Ke !== null)
          if (Ut)
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
        Ke !== null && (Ut ? (e = Ke, Wm(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          n.stateNode
        ), Ks(e)) : Wm(Ke, n.stateNode));
        break;
      case 4:
        s = Ke, r = Ut, Ke = n.stateNode.containerInfo, Ut = !0, Qn(
          e,
          t,
          n
        ), Ke = s, Ut = r;
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
        ut || (Mn(n, t), s = n.stateNode, typeof s.componentWillUnmount == "function" && Ih(
          n,
          t,
          s
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
        ut = (s = ut) || n.memoizedState !== null, Qn(
          e,
          t,
          n
        ), ut = s;
        break;
      default:
        Qn(
          e,
          t,
          n
        );
    }
  }
  function cm(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
      e = e.dehydrated;
      try {
        Ks(e);
      } catch (n) {
        Be(t, t.return, n);
      }
    }
  }
  function rm(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        Ks(e);
      } catch (n) {
        Be(t, t.return, n);
      }
  }
  function Ig(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new am()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new am()), t;
      default:
        throw Error(o(435, e.tag));
    }
  }
  function Ii(e, t) {
    var n = Ig(e);
    t.forEach(function(s) {
      if (!n.has(s)) {
        n.add(s);
        var r = rv.bind(null, e, s);
        s.then(r, r);
      }
    });
  }
  function Bt(e, t) {
    var n = t.deletions;
    if (n !== null)
      for (var s = 0; s < n.length; s++) {
        var r = n[s], u = e, p = t, x = p;
        e: for (; x !== null; ) {
          switch (x.tag) {
            case 27:
              if (ja(x.type)) {
                Ke = x.stateNode, Ut = !1;
                break e;
              }
              break;
            case 5:
              Ke = x.stateNode, Ut = !1;
              break e;
            case 3:
            case 4:
              Ke = x.stateNode.containerInfo, Ut = !0;
              break e;
          }
          x = x.return;
        }
        if (Ke === null) throw Error(o(160));
        im(u, p, r), Ke = null, Ut = !1, u = r.alternate, u !== null && (u.return = null), r.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        om(t, e), t = t.sibling;
  }
  var xn = null;
  function om(e, t) {
    var n = e.alternate, s = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        Bt(t, e), Ft(e), s & 4 && (_a(3, e, e.return), Dl(3, e), _a(5, e, e.return));
        break;
      case 1:
        Bt(t, e), Ft(e), s & 512 && (ut || n === null || Mn(n, n.return)), s & 64 && Xn && (e = e.updateQueue, e !== null && (s = e.callbacks, s !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? s : n.concat(s))));
        break;
      case 26:
        var r = xn;
        if (Bt(t, e), Ft(e), s & 512 && (ut || n === null || Mn(n, n.return)), s & 4) {
          var u = n !== null ? n.memoizedState : null;
          if (s = e.memoizedState, n === null)
            if (s === null)
              if (e.stateNode === null) {
                e: {
                  s = e.type, n = e.memoizedProps, r = r.ownerDocument || r;
                  t: switch (s) {
                    case "title":
                      u = r.getElementsByTagName("title")[0], (!u || u[ol] || u[vt] || u.namespaceURI === "http://www.w3.org/2000/svg" || u.hasAttribute("itemprop")) && (u = r.createElement(s), r.head.insertBefore(
                        u,
                        r.querySelector("head > title")
                      )), jt(u, s, n), u[vt] = e, bt(u), s = u;
                      break e;
                    case "link":
                      var p = op(
                        "link",
                        "href",
                        r
                      ).get(s + (n.href || ""));
                      if (p) {
                        for (var x = 0; x < p.length; x++)
                          if (u = p[x], u.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && u.getAttribute("rel") === (n.rel == null ? null : n.rel) && u.getAttribute("title") === (n.title == null ? null : n.title) && u.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
                            p.splice(x, 1);
                            break t;
                          }
                      }
                      u = r.createElement(s), jt(u, s, n), r.head.appendChild(u);
                      break;
                    case "meta":
                      if (p = op(
                        "meta",
                        "content",
                        r
                      ).get(s + (n.content || ""))) {
                        for (x = 0; x < p.length; x++)
                          if (u = p[x], u.getAttribute("content") === (n.content == null ? null : "" + n.content) && u.getAttribute("name") === (n.name == null ? null : n.name) && u.getAttribute("property") === (n.property == null ? null : n.property) && u.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && u.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
                            p.splice(x, 1);
                            break t;
                          }
                      }
                      u = r.createElement(s), jt(u, s, n), r.head.appendChild(u);
                      break;
                    default:
                      throw Error(o(468, s));
                  }
                  u[vt] = e, bt(u), s = u;
                }
                e.stateNode = s;
              } else
                up(
                  r,
                  e.type,
                  e.stateNode
                );
            else
              e.stateNode = rp(
                r,
                s,
                e.memoizedProps
              );
          else
            u !== s ? (u === null ? n.stateNode !== null && (n = n.stateNode, n.parentNode.removeChild(n)) : u.count--, s === null ? up(
              r,
              e.type,
              e.stateNode
            ) : rp(
              r,
              s,
              e.memoizedProps
            )) : s === null && e.stateNode !== null && Fo(
              e,
              e.memoizedProps,
              n.memoizedProps
            );
        }
        break;
      case 27:
        Bt(t, e), Ft(e), s & 512 && (ut || n === null || Mn(n, n.return)), n !== null && s & 4 && Fo(
          e,
          e.memoizedProps,
          n.memoizedProps
        );
        break;
      case 5:
        if (Bt(t, e), Ft(e), s & 512 && (ut || n === null || Mn(n, n.return)), e.flags & 32) {
          r = e.stateNode;
          try {
            gs(r, "");
          } catch (oe) {
            Be(e, e.return, oe);
          }
        }
        s & 4 && e.stateNode != null && (r = e.memoizedProps, Fo(
          e,
          r,
          n !== null ? n.memoizedProps : r
        )), s & 1024 && (Yo = !0);
        break;
      case 6:
        if (Bt(t, e), Ft(e), s & 4) {
          if (e.stateNode === null)
            throw Error(o(162));
          s = e.memoizedProps, n = e.stateNode;
          try {
            n.nodeValue = s;
          } catch (oe) {
            Be(e, e.return, oe);
          }
        }
        break;
      case 3:
        if (pc = null, r = xn, xn = hc(t.containerInfo), Bt(t, e), xn = r, Ft(e), s & 4 && n !== null && n.memoizedState.isDehydrated)
          try {
            Ks(t.containerInfo);
          } catch (oe) {
            Be(e, e.return, oe);
          }
        Yo && (Yo = !1, um(e));
        break;
      case 4:
        s = xn, xn = hc(
          e.stateNode.containerInfo
        ), Bt(t, e), Ft(e), xn = s;
        break;
      case 12:
        Bt(t, e), Ft(e);
        break;
      case 31:
        Bt(t, e), Ft(e), s & 4 && (s = e.updateQueue, s !== null && (e.updateQueue = null, Ii(e, s)));
        break;
      case 13:
        Bt(t, e), Ft(e), e.child.flags & 8192 && e.memoizedState !== null != (n !== null && n.memoizedState !== null) && (tc = nt()), s & 4 && (s = e.updateQueue, s !== null && (e.updateQueue = null, Ii(e, s)));
        break;
      case 22:
        r = e.memoizedState !== null;
        var M = n !== null && n.memoizedState !== null, L = Xn, q = ut;
        if (Xn = L || r, ut = q || M, Bt(t, e), ut = q, Xn = L, Ft(e), s & 8192)
          e: for (t = e.stateNode, t._visibility = r ? t._visibility & -2 : t._visibility | 1, r && (n === null || M || Xn || ut || es(e)), n = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (n === null) {
                M = n = t;
                try {
                  if (u = M.stateNode, r)
                    p = u.style, typeof p.setProperty == "function" ? p.setProperty("display", "none", "important") : p.display = "none";
                  else {
                    x = M.stateNode;
                    var K = M.memoizedProps.style, U = K != null && K.hasOwnProperty("display") ? K.display : null;
                    x.style.display = U == null || typeof U == "boolean" ? "" : ("" + U).trim();
                  }
                } catch (oe) {
                  Be(M, M.return, oe);
                }
              }
            } else if (t.tag === 6) {
              if (n === null) {
                M = t;
                try {
                  M.stateNode.nodeValue = r ? "" : M.memoizedProps;
                } catch (oe) {
                  Be(M, M.return, oe);
                }
              }
            } else if (t.tag === 18) {
              if (n === null) {
                M = t;
                try {
                  var V = M.stateNode;
                  r ? Im(V, !0) : Im(M.stateNode, !1);
                } catch (oe) {
                  Be(M, M.return, oe);
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
        s & 4 && (s = e.updateQueue, s !== null && (n = s.retryQueue, n !== null && (s.retryQueue = null, Ii(e, n))));
        break;
      case 19:
        Bt(t, e), Ft(e), s & 4 && (s = e.updateQueue, s !== null && (e.updateQueue = null, Ii(e, s)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        Bt(t, e), Ft(e);
    }
  }
  function Ft(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var n, s = e.return; s !== null; ) {
          if (tm(s)) {
            n = s;
            break;
          }
          s = s.return;
        }
        if (n == null) throw Error(o(160));
        switch (n.tag) {
          case 27:
            var r = n.stateNode, u = Go(e);
            Wi(e, u, r);
            break;
          case 5:
            var p = n.stateNode;
            n.flags & 32 && (gs(p, ""), n.flags &= -33);
            var x = Go(e);
            Wi(e, x, p);
            break;
          case 3:
          case 4:
            var M = n.stateNode.containerInfo, L = Go(e);
            Vo(
              e,
              L,
              M
            );
            break;
          default:
            throw Error(o(161));
        }
      } catch (q) {
        Be(e, e.return, q);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function um(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        um(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
  }
  function Zn(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        sm(e, t.alternate, t), t = t.sibling;
  }
  function es(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          _a(4, t, t.return), es(t);
          break;
        case 1:
          Mn(t, t.return);
          var n = t.stateNode;
          typeof n.componentWillUnmount == "function" && Ih(
            t,
            t.return,
            n
          ), es(t);
          break;
        case 27:
          ql(t.stateNode);
        case 26:
        case 5:
          Mn(t, t.return), es(t);
          break;
        case 22:
          t.memoizedState === null && es(t);
          break;
        case 30:
          es(t);
          break;
        default:
          es(t);
      }
      e = e.sibling;
    }
  }
  function Kn(e, t, n) {
    for (n = n && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var s = t.alternate, r = e, u = t, p = u.flags;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          Kn(
            r,
            u,
            n
          ), Dl(4, u);
          break;
        case 1:
          if (Kn(
            r,
            u,
            n
          ), s = u, r = s.stateNode, typeof r.componentDidMount == "function")
            try {
              r.componentDidMount();
            } catch (L) {
              Be(s, s.return, L);
            }
          if (s = u, r = s.updateQueue, r !== null) {
            var x = s.stateNode;
            try {
              var M = r.shared.hiddenCallbacks;
              if (M !== null)
                for (r.shared.hiddenCallbacks = null, r = 0; r < M.length; r++)
                  Ff(M[r], x);
            } catch (L) {
              Be(s, s.return, L);
            }
          }
          n && p & 64 && Wh(u), Hl(u, u.return);
          break;
        case 27:
          nm(u);
        case 26:
        case 5:
          Kn(
            r,
            u,
            n
          ), n && s === null && p & 4 && em(u), Hl(u, u.return);
          break;
        case 12:
          Kn(
            r,
            u,
            n
          );
          break;
        case 31:
          Kn(
            r,
            u,
            n
          ), n && p & 4 && cm(r, u);
          break;
        case 13:
          Kn(
            r,
            u,
            n
          ), n && p & 4 && rm(r, u);
          break;
        case 22:
          u.memoizedState === null && Kn(
            r,
            u,
            n
          ), Hl(u, u.return);
          break;
        case 30:
          break;
        default:
          Kn(
            r,
            u,
            n
          );
      }
      t = t.sibling;
    }
  }
  function qo(e, t) {
    var n = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && wl(n));
  }
  function Xo(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && wl(e));
  }
  function yn(e, t, n, s) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        dm(
          e,
          t,
          n,
          s
        ), t = t.sibling;
  }
  function dm(e, t, n, s) {
    var r = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        yn(
          e,
          t,
          n,
          s
        ), r & 2048 && Dl(9, t);
        break;
      case 1:
        yn(
          e,
          t,
          n,
          s
        );
        break;
      case 3:
        yn(
          e,
          t,
          n,
          s
        ), r & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && wl(e)));
        break;
      case 12:
        if (r & 2048) {
          yn(
            e,
            t,
            n,
            s
          ), e = t.stateNode;
          try {
            var u = t.memoizedProps, p = u.id, x = u.onPostCommit;
            typeof x == "function" && x(
              p,
              t.alternate === null ? "mount" : "update",
              e.passiveEffectDuration,
              -0
            );
          } catch (M) {
            Be(t, t.return, M);
          }
        } else
          yn(
            e,
            t,
            n,
            s
          );
        break;
      case 31:
        yn(
          e,
          t,
          n,
          s
        );
        break;
      case 13:
        yn(
          e,
          t,
          n,
          s
        );
        break;
      case 23:
        break;
      case 22:
        u = t.stateNode, p = t.alternate, t.memoizedState !== null ? u._visibility & 2 ? yn(
          e,
          t,
          n,
          s
        ) : Ll(e, t) : u._visibility & 2 ? yn(
          e,
          t,
          n,
          s
        ) : (u._visibility |= 2, $s(
          e,
          t,
          n,
          s,
          (t.subtreeFlags & 10256) !== 0 || !1
        )), r & 2048 && qo(p, t);
        break;
      case 24:
        yn(
          e,
          t,
          n,
          s
        ), r & 2048 && Xo(t.alternate, t);
        break;
      default:
        yn(
          e,
          t,
          n,
          s
        );
    }
  }
  function $s(e, t, n, s, r) {
    for (r = r && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var u = e, p = t, x = n, M = s, L = p.flags;
      switch (p.tag) {
        case 0:
        case 11:
        case 15:
          $s(
            u,
            p,
            x,
            M,
            r
          ), Dl(8, p);
          break;
        case 23:
          break;
        case 22:
          var q = p.stateNode;
          p.memoizedState !== null ? q._visibility & 2 ? $s(
            u,
            p,
            x,
            M,
            r
          ) : Ll(
            u,
            p
          ) : (q._visibility |= 2, $s(
            u,
            p,
            x,
            M,
            r
          )), r && L & 2048 && qo(
            p.alternate,
            p
          );
          break;
        case 24:
          $s(
            u,
            p,
            x,
            M,
            r
          ), r && L & 2048 && Xo(p.alternate, p);
          break;
        default:
          $s(
            u,
            p,
            x,
            M,
            r
          );
      }
      t = t.sibling;
    }
  }
  function Ll(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var n = e, s = t, r = s.flags;
        switch (s.tag) {
          case 22:
            Ll(n, s), r & 2048 && qo(
              s.alternate,
              s
            );
            break;
          case 24:
            Ll(n, s), r & 2048 && Xo(s.alternate, s);
            break;
          default:
            Ll(n, s);
        }
        t = t.sibling;
      }
  }
  var $l = 8192;
  function Us(e, t, n) {
    if (e.subtreeFlags & $l)
      for (e = e.child; e !== null; )
        fm(
          e,
          t,
          n
        ), e = e.sibling;
  }
  function fm(e, t, n) {
    switch (e.tag) {
      case 26:
        Us(
          e,
          t,
          n
        ), e.flags & $l && e.memoizedState !== null && Uv(
          n,
          xn,
          e.memoizedState,
          e.memoizedProps
        );
        break;
      case 5:
        Us(
          e,
          t,
          n
        );
        break;
      case 3:
      case 4:
        var s = xn;
        xn = hc(e.stateNode.containerInfo), Us(
          e,
          t,
          n
        ), xn = s;
        break;
      case 22:
        e.memoizedState === null && (s = e.alternate, s !== null && s.memoizedState !== null ? (s = $l, $l = 16777216, Us(
          e,
          t,
          n
        ), $l = s) : Us(
          e,
          t,
          n
        ));
        break;
      default:
        Us(
          e,
          t,
          n
        );
    }
  }
  function hm(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function Ul(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var s = t[n];
          gt = s, pm(
            s,
            e
          );
        }
      hm(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        mm(e), e = e.sibling;
  }
  function mm(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        Ul(e), e.flags & 2048 && _a(9, e, e.return);
        break;
      case 3:
        Ul(e);
        break;
      case 12:
        Ul(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, ec(e)) : Ul(e);
        break;
      default:
        Ul(e);
    }
  }
  function ec(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var s = t[n];
          gt = s, pm(
            s,
            e
          );
        }
      hm(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          _a(8, t, t.return), ec(t);
          break;
        case 22:
          n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, ec(t));
          break;
        default:
          ec(t);
      }
      e = e.sibling;
    }
  }
  function pm(e, t) {
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
            var s = n.memoizedState.cachePool.pool;
            s != null && s.refCount++;
          }
          break;
        case 24:
          wl(n.memoizedState.cache);
      }
      if (s = n.child, s !== null) s.return = n, gt = s;
      else
        e: for (n = e; gt !== null; ) {
          s = gt;
          var r = s.sibling, u = s.return;
          if (lm(s), s === n) {
            gt = null;
            break e;
          }
          if (r !== null) {
            r.return = u, gt = r;
            break e;
          }
          gt = u;
        }
    }
  }
  var ev = {
    getCacheForType: function(e) {
      var t = yt(ct), n = t.data.get(e);
      return n === void 0 && (n = e(), t.data.set(e, n)), n;
    },
    cacheSignal: function() {
      return yt(ct).controller.signal;
    }
  }, tv = typeof WeakMap == "function" ? WeakMap : Map, He = 0, Ye = null, ke = null, Ee = 0, Ue = 0, Wt = null, ba = !1, Bs = !1, Qo = !1, Jn = 0, tt = 0, ga = 0, ts = 0, Zo = 0, It = 0, Fs = 0, Bl = null, Gt = null, Ko = !1, tc = 0, _m = 0, nc = 1 / 0, ac = null, va = null, mt = 0, xa = null, Gs = null, Pn = 0, Jo = 0, Po = null, bm = null, Fl = 0, Wo = null;
  function en() {
    return (He & 2) !== 0 && Ee !== 0 ? Ee & -Ee : T.T !== null ? su() : Rd();
  }
  function gm() {
    if (It === 0)
      if ((Ee & 536870912) === 0 || Te) {
        var e = di;
        di <<= 1, (di & 3932160) === 0 && (di = 262144), It = e;
      } else It = 536870912;
    return e = Jt.current, e !== null && (e.flags |= 32), It;
  }
  function Vt(e, t, n) {
    (e === Ye && (Ue === 2 || Ue === 9) || e.cancelPendingCommit !== null) && (Vs(e, 0), ya(
      e,
      Ee,
      It,
      !1
    )), rl(e, n), ((He & 2) === 0 || e !== Ye) && (e === Ye && ((He & 2) === 0 && (ts |= n), tt === 4 && ya(
      e,
      Ee,
      It,
      !1
    )), Tn(e));
  }
  function vm(e, t, n) {
    if ((He & 6) !== 0) throw Error(o(327));
    var s = !n && (t & 127) === 0 && (t & e.expiredLanes) === 0 || cl(e, t), r = s ? sv(e, t) : eu(e, t, !0), u = s;
    do {
      if (r === 0) {
        Bs && !s && ya(e, t, 0, !1);
        break;
      } else {
        if (n = e.current.alternate, u && !nv(n)) {
          r = eu(e, t, !1), u = !1;
          continue;
        }
        if (r === 2) {
          if (u = t, e.errorRecoveryDisabledLanes & u)
            var p = 0;
          else
            p = e.pendingLanes & -536870913, p = p !== 0 ? p : p & 536870912 ? 536870912 : 0;
          if (p !== 0) {
            t = p;
            e: {
              var x = e;
              r = Bl;
              var M = x.current.memoizedState.isDehydrated;
              if (M && (Vs(x, p).flags |= 256), p = eu(
                x,
                p,
                !1
              ), p !== 2) {
                if (Qo && !M) {
                  x.errorRecoveryDisabledLanes |= u, ts |= u, r = 4;
                  break e;
                }
                u = Gt, Gt = r, u !== null && (Gt === null ? Gt = u : Gt.push.apply(
                  Gt,
                  u
                ));
              }
              r = p;
            }
            if (u = !1, r !== 2) continue;
          }
        }
        if (r === 1) {
          Vs(e, 0), ya(e, t, 0, !0);
          break;
        }
        e: {
          switch (s = e, u = r, u) {
            case 0:
            case 1:
              throw Error(o(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              ya(
                s,
                t,
                It,
                !ba
              );
              break e;
            case 2:
              Gt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(o(329));
          }
          if ((t & 62914560) === t && (r = tc + 300 - nt(), 10 < r)) {
            if (ya(
              s,
              t,
              It,
              !ba
            ), hi(s, 0, !0) !== 0) break e;
            Pn = t, s.timeoutHandle = Jm(
              xm.bind(
                null,
                s,
                n,
                Gt,
                ac,
                Ko,
                t,
                It,
                ts,
                Fs,
                ba,
                u,
                "Throttled",
                -0,
                0
              ),
              r
            );
            break e;
          }
          xm(
            s,
            n,
            Gt,
            ac,
            Ko,
            t,
            It,
            ts,
            Fs,
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
  function xm(e, t, n, s, r, u, p, x, M, L, q, K, U, V) {
    if (e.timeoutHandle = -1, K = t.subtreeFlags, K & 8192 || (K & 16785408) === 16785408) {
      K = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: Hn
      }, fm(
        t,
        u,
        K
      );
      var oe = (u & 62914560) === u ? tc - nt() : (u & 4194048) === u ? _m - nt() : 0;
      if (oe = Bv(
        K,
        oe
      ), oe !== null) {
        Pn = u, e.cancelPendingCommit = oe(
          Em.bind(
            null,
            e,
            t,
            u,
            n,
            s,
            r,
            p,
            x,
            M,
            q,
            K,
            null,
            U,
            V
          )
        ), ya(e, u, p, !L);
        return;
      }
    }
    Em(
      e,
      t,
      u,
      n,
      s,
      r,
      p,
      x,
      M
    );
  }
  function nv(e) {
    for (var t = e; ; ) {
      var n = t.tag;
      if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null)))
        for (var s = 0; s < n.length; s++) {
          var r = n[s], u = r.getSnapshot;
          r = r.value;
          try {
            if (!Zt(u(), r)) return !1;
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
  function ya(e, t, n, s) {
    t &= ~Zo, t &= ~ts, e.suspendedLanes |= t, e.pingedLanes &= ~t, s && (e.warmLanes |= t), s = e.expirationTimes;
    for (var r = t; 0 < r; ) {
      var u = 31 - Ct(r), p = 1 << u;
      s[u] = -1, r &= ~p;
    }
    n !== 0 && Md(e, n, t);
  }
  function sc() {
    return (He & 6) === 0 ? (Gl(0), !1) : !0;
  }
  function Io() {
    if (ke !== null) {
      if (Ue === 0)
        var e = ke.return;
      else
        e = ke, Bn = Xa = null, po(e), Os = null, Sl = 0, e = ke;
      for (; e !== null; )
        Ph(e.alternate, e), e = e.return;
      ke = null;
    }
  }
  function Vs(e, t) {
    var n = e.timeoutHandle;
    n !== -1 && (e.timeoutHandle = -1, wv(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), Pn = 0, Io(), Ye = e, ke = n = $n(e.current, null), Ee = t, Ue = 0, Wt = null, ba = !1, Bs = cl(e, t), Qo = !1, Fs = It = Zo = ts = ga = tt = 0, Gt = Bl = null, Ko = !1, (t & 8) !== 0 && (t |= t & 32);
    var s = e.entangledLanes;
    if (s !== 0)
      for (e = e.entanglements, s &= t; 0 < s; ) {
        var r = 31 - Ct(s), u = 1 << r;
        t |= e[r], s &= ~u;
      }
    return Jn = t, ki(), n;
  }
  function ym(e, t) {
    ye = null, T.H = Rl, t === Rs || t === Oi ? (t = Lf(), Ue = 3) : t === no ? (t = Lf(), Ue = 4) : Ue = t === Ao ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, Wt = t, ke === null && (tt = 1, Qi(
      e,
      rn(t, e.current)
    ));
  }
  function wm() {
    var e = Jt.current;
    return e === null ? !0 : (Ee & 4194048) === Ee ? fn === null : (Ee & 62914560) === Ee || (Ee & 536870912) !== 0 ? e === fn : !1;
  }
  function jm() {
    var e = T.H;
    return T.H = Rl, e === null ? Rl : e;
  }
  function Sm() {
    var e = T.A;
    return T.A = ev, e;
  }
  function lc() {
    tt = 4, ba || (Ee & 4194048) !== Ee && Jt.current !== null || (Bs = !0), (ga & 134217727) === 0 && (ts & 134217727) === 0 || Ye === null || ya(
      Ye,
      Ee,
      It,
      !1
    );
  }
  function eu(e, t, n) {
    var s = He;
    He |= 2;
    var r = jm(), u = Sm();
    (Ye !== e || Ee !== t) && (ac = null, Vs(e, t)), t = !1;
    var p = tt;
    e: do
      try {
        if (Ue !== 0 && ke !== null) {
          var x = ke, M = Wt;
          switch (Ue) {
            case 8:
              Io(), p = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              Jt.current === null && (t = !0);
              var L = Ue;
              if (Ue = 0, Wt = null, Ys(e, x, M, L), n && Bs) {
                p = 0;
                break e;
              }
              break;
            default:
              L = Ue, Ue = 0, Wt = null, Ys(e, x, M, L);
          }
        }
        av(), p = tt;
        break;
      } catch (q) {
        ym(e, q);
      }
    while (!0);
    return t && e.shellSuspendCounter++, Bn = Xa = null, He = s, T.H = r, T.A = u, ke === null && (Ye = null, Ee = 0, ki()), p;
  }
  function av() {
    for (; ke !== null; ) km(ke);
  }
  function sv(e, t) {
    var n = He;
    He |= 2;
    var s = jm(), r = Sm();
    Ye !== e || Ee !== t ? (ac = null, nc = nt() + 500, Vs(e, t)) : Bs = cl(
      e,
      t
    );
    e: do
      try {
        if (Ue !== 0 && ke !== null) {
          t = ke;
          var u = Wt;
          t: switch (Ue) {
            case 1:
              Ue = 0, Wt = null, Ys(e, t, u, 1);
              break;
            case 2:
            case 9:
              if (Df(u)) {
                Ue = 0, Wt = null, Nm(t);
                break;
              }
              t = function() {
                Ue !== 2 && Ue !== 9 || Ye !== e || (Ue = 7), Tn(e);
              }, u.then(t, t);
              break e;
            case 3:
              Ue = 7;
              break e;
            case 4:
              Ue = 5;
              break e;
            case 7:
              Df(u) ? (Ue = 0, Wt = null, Nm(t)) : (Ue = 0, Wt = null, Ys(e, t, u, 7));
              break;
            case 5:
              var p = null;
              switch (ke.tag) {
                case 26:
                  p = ke.memoizedState;
                case 5:
                case 27:
                  var x = ke;
                  if (p ? dp(p) : x.stateNode.complete) {
                    Ue = 0, Wt = null;
                    var M = x.sibling;
                    if (M !== null) ke = M;
                    else {
                      var L = x.return;
                      L !== null ? (ke = L, ic(L)) : ke = null;
                    }
                    break t;
                  }
              }
              Ue = 0, Wt = null, Ys(e, t, u, 5);
              break;
            case 6:
              Ue = 0, Wt = null, Ys(e, t, u, 6);
              break;
            case 8:
              Io(), tt = 6;
              break e;
            default:
              throw Error(o(462));
          }
        }
        lv();
        break;
      } catch (q) {
        ym(e, q);
      }
    while (!0);
    return Bn = Xa = null, T.H = s, T.A = r, He = n, ke !== null ? 0 : (Ye = null, Ee = 0, ki(), tt);
  }
  function lv() {
    for (; ke !== null && !an(); )
      km(ke);
  }
  function km(e) {
    var t = Kh(e.alternate, e, Jn);
    e.memoizedProps = e.pendingProps, t === null ? ic(e) : ke = t;
  }
  function Nm(e) {
    var t = e, n = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = Vh(
          n,
          t,
          t.pendingProps,
          t.type,
          void 0,
          Ee
        );
        break;
      case 11:
        t = Vh(
          n,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          Ee
        );
        break;
      case 5:
        po(t);
      default:
        Ph(n, t), t = ke = Sf(t, Jn), t = Kh(n, t, Jn);
    }
    e.memoizedProps = e.pendingProps, t === null ? ic(e) : ke = t;
  }
  function Ys(e, t, n, s) {
    Bn = Xa = null, po(t), Os = null, Sl = 0;
    var r = t.return;
    try {
      if (Qg(
        e,
        r,
        t,
        n,
        Ee
      )) {
        tt = 1, Qi(
          e,
          rn(n, e.current)
        ), ke = null;
        return;
      }
    } catch (u) {
      if (r !== null) throw ke = r, u;
      tt = 1, Qi(
        e,
        rn(n, e.current)
      ), ke = null;
      return;
    }
    t.flags & 32768 ? (Te || s === 1 ? e = !0 : Bs || (Ee & 536870912) !== 0 ? e = !1 : (ba = e = !0, (s === 2 || s === 9 || s === 3 || s === 6) && (s = Jt.current, s !== null && s.tag === 13 && (s.flags |= 16384))), Cm(t, e)) : ic(t);
  }
  function ic(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        Cm(
          t,
          ba
        );
        return;
      }
      e = t.return;
      var n = Jg(
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
  function Cm(e, t) {
    do {
      var n = Pg(e.alternate, e);
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
  function Em(e, t, n, s, r, u, p, x, M) {
    e.cancelPendingCommit = null;
    do
      cc();
    while (mt !== 0);
    if ((He & 6) !== 0) throw Error(o(327));
    if (t !== null) {
      if (t === e.current) throw Error(o(177));
      if (u = t.lanes | t.childLanes, u |= Fr, $b(
        e,
        n,
        u,
        p,
        x,
        M
      ), e === Ye && (ke = Ye = null, Ee = 0), Gs = t, xa = e, Pn = n, Jo = u, Po = r, bm = s, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, ov(us, function() {
        return Om(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), s = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || s) {
        s = T.T, T.T = null, r = $.p, $.p = 2, p = He, He |= 4;
        try {
          Wg(e, t, n);
        } finally {
          He = p, $.p = r, T.T = s;
        }
      }
      mt = 1, Mm(), Tm(), Am();
    }
  }
  function Mm() {
    if (mt === 1) {
      mt = 0;
      var e = xa, t = Gs, n = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || n) {
        n = T.T, T.T = null;
        var s = $.p;
        $.p = 2;
        var r = He;
        He |= 4;
        try {
          om(t, e);
          var u = fu, p = pf(e.containerInfo), x = u.focusedElem, M = u.selectionRange;
          if (p !== x && x && x.ownerDocument && mf(
            x.ownerDocument.documentElement,
            x
          )) {
            if (M !== null && Hr(x)) {
              var L = M.start, q = M.end;
              if (q === void 0 && (q = L), "selectionStart" in x)
                x.selectionStart = L, x.selectionEnd = Math.min(
                  q,
                  x.value.length
                );
              else {
                var K = x.ownerDocument || document, U = K && K.defaultView || window;
                if (U.getSelection) {
                  var V = U.getSelection(), oe = x.textContent.length, be = Math.min(M.start, oe), Ve = M.end === void 0 ? be : Math.min(M.end, oe);
                  !V.extend && be > Ve && (p = Ve, Ve = be, be = p);
                  var z = hf(
                    x,
                    be
                  ), R = hf(
                    x,
                    Ve
                  );
                  if (z && R && (V.rangeCount !== 1 || V.anchorNode !== z.node || V.anchorOffset !== z.offset || V.focusNode !== R.node || V.focusOffset !== R.offset)) {
                    var H = K.createRange();
                    H.setStart(z.node, z.offset), V.removeAllRanges(), be > Ve ? (V.addRange(H), V.extend(R.node, R.offset)) : (H.setEnd(R.node, R.offset), V.addRange(H));
                  }
                }
              }
            }
            for (K = [], V = x; V = V.parentNode; )
              V.nodeType === 1 && K.push({
                element: V,
                left: V.scrollLeft,
                top: V.scrollTop
              });
            for (typeof x.focus == "function" && x.focus(), x = 0; x < K.length; x++) {
              var Z = K[x];
              Z.element.scrollLeft = Z.left, Z.element.scrollTop = Z.top;
            }
          }
          vc = !!du, fu = du = null;
        } finally {
          He = r, $.p = s, T.T = n;
        }
      }
      e.current = t, mt = 2;
    }
  }
  function Tm() {
    if (mt === 2) {
      mt = 0;
      var e = xa, t = Gs, n = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || n) {
        n = T.T, T.T = null;
        var s = $.p;
        $.p = 2;
        var r = He;
        He |= 4;
        try {
          sm(e, t.alternate, t);
        } finally {
          He = r, $.p = s, T.T = n;
        }
      }
      mt = 3;
    }
  }
  function Am() {
    if (mt === 4 || mt === 3) {
      mt = 0, Qt();
      var e = xa, t = Gs, n = Pn, s = bm;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? mt = 5 : (mt = 0, Gs = xa = null, Rm(e, e.pendingLanes));
      var r = e.pendingLanes;
      if (r === 0 && (va = null), br(n), t = t.stateNode, Rt && typeof Rt.onCommitFiberRoot == "function")
        try {
          Rt.onCommitFiberRoot(
            La,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (s !== null) {
        t = T.T, r = $.p, $.p = 2, T.T = null;
        try {
          for (var u = e.onRecoverableError, p = 0; p < s.length; p++) {
            var x = s[p];
            u(x.value, {
              componentStack: x.stack
            });
          }
        } finally {
          T.T = t, $.p = r;
        }
      }
      (Pn & 3) !== 0 && cc(), Tn(e), r = e.pendingLanes, (n & 261930) !== 0 && (r & 42) !== 0 ? e === Wo ? Fl++ : (Fl = 0, Wo = e) : Fl = 0, Gl(0);
    }
  }
  function Rm(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, wl(t)));
  }
  function cc() {
    return Mm(), Tm(), Am(), Om();
  }
  function Om() {
    if (mt !== 5) return !1;
    var e = xa, t = Jo;
    Jo = 0;
    var n = br(Pn), s = T.T, r = $.p;
    try {
      $.p = 32 > n ? 32 : n, T.T = null, n = Po, Po = null;
      var u = xa, p = Pn;
      if (mt = 0, Gs = xa = null, Pn = 0, (He & 6) !== 0) throw Error(o(331));
      var x = He;
      if (He |= 4, mm(u.current), dm(
        u,
        u.current,
        p,
        n
      ), He = x, Gl(0, !1), Rt && typeof Rt.onPostCommitFiberRoot == "function")
        try {
          Rt.onPostCommitFiberRoot(La, u);
        } catch {
        }
      return !0;
    } finally {
      $.p = r, T.T = s, Rm(e, t);
    }
  }
  function zm(e, t, n) {
    t = rn(n, t), t = To(e.stateNode, t, 2), e = ha(e, t, 2), e !== null && (rl(e, 2), Tn(e));
  }
  function Be(e, t, n) {
    if (e.tag === 3)
      zm(e, e, n);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          zm(
            t,
            e,
            n
          );
          break;
        } else if (t.tag === 1) {
          var s = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && (va === null || !va.has(s))) {
            e = rn(n, e), n = Dh(2), s = ha(t, n, 2), s !== null && (Hh(
              n,
              s,
              t,
              e
            ), rl(s, 2), Tn(s));
            break;
          }
        }
        t = t.return;
      }
  }
  function tu(e, t, n) {
    var s = e.pingCache;
    if (s === null) {
      s = e.pingCache = new tv();
      var r = /* @__PURE__ */ new Set();
      s.set(t, r);
    } else
      r = s.get(t), r === void 0 && (r = /* @__PURE__ */ new Set(), s.set(t, r));
    r.has(n) || (Qo = !0, r.add(n), e = iv.bind(null, e, t, n), t.then(e, e));
  }
  function iv(e, t, n) {
    var s = e.pingCache;
    s !== null && s.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, Ye === e && (Ee & n) === n && (tt === 4 || tt === 3 && (Ee & 62914560) === Ee && 300 > nt() - tc ? (He & 2) === 0 && Vs(e, 0) : Zo |= n, Fs === Ee && (Fs = 0)), Tn(e);
  }
  function Dm(e, t) {
    t === 0 && (t = Ed()), e = Va(e, t), e !== null && (rl(e, t), Tn(e));
  }
  function cv(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), Dm(e, n);
  }
  function rv(e, t) {
    var n = 0;
    switch (e.tag) {
      case 31:
      case 13:
        var s = e.stateNode, r = e.memoizedState;
        r !== null && (n = r.retryLane);
        break;
      case 19:
        s = e.stateNode;
        break;
      case 22:
        s = e.stateNode._retryCache;
        break;
      default:
        throw Error(o(314));
    }
    s !== null && s.delete(t), Dm(e, n);
  }
  function ov(e, t) {
    return Dt(e, t);
  }
  var rc = null, qs = null, nu = !1, oc = !1, au = !1, wa = 0;
  function Tn(e) {
    e !== qs && e.next === null && (qs === null ? rc = qs = e : qs = qs.next = e), oc = !0, nu || (nu = !0, dv());
  }
  function Gl(e, t) {
    if (!au && oc) {
      au = !0;
      do
        for (var n = !1, s = rc; s !== null; ) {
          if (e !== 0) {
            var r = s.pendingLanes;
            if (r === 0) var u = 0;
            else {
              var p = s.suspendedLanes, x = s.pingedLanes;
              u = (1 << 31 - Ct(42 | e) + 1) - 1, u &= r & ~(p & ~x), u = u & 201326741 ? u & 201326741 | 1 : u ? u | 2 : 0;
            }
            u !== 0 && (n = !0, Um(s, u));
          } else
            u = Ee, u = hi(
              s,
              s === Ye ? u : 0,
              s.cancelPendingCommit !== null || s.timeoutHandle !== -1
            ), (u & 3) === 0 || cl(s, u) || (n = !0, Um(s, u));
          s = s.next;
        }
      while (n);
      au = !1;
    }
  }
  function uv() {
    Hm();
  }
  function Hm() {
    oc = nu = !1;
    var e = 0;
    wa !== 0 && yv() && (e = wa);
    for (var t = nt(), n = null, s = rc; s !== null; ) {
      var r = s.next, u = Lm(s, t);
      u === 0 ? (s.next = null, n === null ? rc = r : n.next = r, r === null && (qs = n)) : (n = s, (e !== 0 || (u & 3) !== 0) && (oc = !0)), s = r;
    }
    mt !== 0 && mt !== 5 || Gl(e), wa !== 0 && (wa = 0);
  }
  function Lm(e, t) {
    for (var n = e.suspendedLanes, s = e.pingedLanes, r = e.expirationTimes, u = e.pendingLanes & -62914561; 0 < u; ) {
      var p = 31 - Ct(u), x = 1 << p, M = r[p];
      M === -1 ? ((x & n) === 0 || (x & s) !== 0) && (r[p] = Lb(x, t)) : M <= t && (e.expiredLanes |= x), u &= ~x;
    }
    if (t = Ye, n = Ee, n = hi(
      e,
      e === t ? n : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), s = e.callbackNode, n === 0 || e === t && (Ue === 2 || Ue === 9) || e.cancelPendingCommit !== null)
      return s !== null && s !== null && Ht(s), e.callbackNode = null, e.callbackPriority = 0;
    if ((n & 3) === 0 || cl(e, n)) {
      if (t = n & -n, t === e.callbackPriority) return t;
      switch (s !== null && Ht(s), br(n)) {
        case 2:
        case 8:
          n = os;
          break;
        case 32:
          n = us;
          break;
        case 268435456:
          n = ui;
          break;
        default:
          n = us;
      }
      return s = $m.bind(null, e), n = Dt(n, s), e.callbackPriority = t, e.callbackNode = n, t;
    }
    return s !== null && s !== null && Ht(s), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function $m(e, t) {
    if (mt !== 0 && mt !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var n = e.callbackNode;
    if (cc() && e.callbackNode !== n)
      return null;
    var s = Ee;
    return s = hi(
      e,
      e === Ye ? s : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), s === 0 ? null : (vm(e, s, t), Lm(e, nt()), e.callbackNode != null && e.callbackNode === n ? $m.bind(null, e) : null);
  }
  function Um(e, t) {
    if (cc()) return null;
    vm(e, t, !0);
  }
  function dv() {
    jv(function() {
      (He & 6) !== 0 ? Dt(
        Ae,
        uv
      ) : Hm();
    });
  }
  function su() {
    if (wa === 0) {
      var e = Ts;
      e === 0 && (e = ds, ds <<= 1, (ds & 261888) === 0 && (ds = 256)), wa = e;
    }
    return wa;
  }
  function Bm(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : bi("" + e);
  }
  function Fm(e, t) {
    var n = t.ownerDocument.createElement("input");
    return n.name = t.name, n.value = t.value, e.id && n.setAttribute("form", e.id), t.parentNode.insertBefore(n, t), e = new FormData(e), n.parentNode.removeChild(n), e;
  }
  function fv(e, t, n, s, r) {
    if (t === "submit" && n && n.stateNode === r) {
      var u = Bm(
        (r[Lt] || null).action
      ), p = s.submitter;
      p && (t = (t = p[Lt] || null) ? Bm(t.formAction) : p.getAttribute("formAction"), t !== null && (u = t, p = null));
      var x = new yi(
        "action",
        "action",
        null,
        s,
        r
      );
      e.push({
        event: x,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (s.defaultPrevented) {
                if (wa !== 0) {
                  var M = p ? Fm(r, p) : new FormData(r);
                  So(
                    n,
                    {
                      pending: !0,
                      data: M,
                      method: r.method,
                      action: u
                    },
                    null,
                    M
                  );
                }
              } else
                typeof u == "function" && (x.preventDefault(), M = p ? Fm(r, p) : new FormData(r), So(
                  n,
                  {
                    pending: !0,
                    data: M,
                    method: r.method,
                    action: u
                  },
                  u,
                  M
                ));
            },
            currentTarget: r
          }
        ]
      });
    }
  }
  for (var lu = 0; lu < Br.length; lu++) {
    var iu = Br[lu], hv = iu.toLowerCase(), mv = iu[0].toUpperCase() + iu.slice(1);
    vn(
      hv,
      "on" + mv
    );
  }
  vn(gf, "onAnimationEnd"), vn(vf, "onAnimationIteration"), vn(xf, "onAnimationStart"), vn("dblclick", "onDoubleClick"), vn("focusin", "onFocus"), vn("focusout", "onBlur"), vn(Tg, "onTransitionRun"), vn(Ag, "onTransitionStart"), vn(Rg, "onTransitionCancel"), vn(yf, "onTransitionEnd"), _s("onMouseEnter", ["mouseout", "mouseover"]), _s("onMouseLeave", ["mouseout", "mouseover"]), _s("onPointerEnter", ["pointerout", "pointerover"]), _s("onPointerLeave", ["pointerout", "pointerover"]), Ua(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), Ua(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), Ua("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), Ua(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), Ua(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), Ua(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var Vl = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), pv = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Vl)
  );
  function Gm(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var s = e[n], r = s.event;
      s = s.listeners;
      e: {
        var u = void 0;
        if (t)
          for (var p = s.length - 1; 0 <= p; p--) {
            var x = s[p], M = x.instance, L = x.currentTarget;
            if (x = x.listener, M !== u && r.isPropagationStopped())
              break e;
            u = x, r.currentTarget = L;
            try {
              u(r);
            } catch (q) {
              Si(q);
            }
            r.currentTarget = null, u = M;
          }
        else
          for (p = 0; p < s.length; p++) {
            if (x = s[p], M = x.instance, L = x.currentTarget, x = x.listener, M !== u && r.isPropagationStopped())
              break e;
            u = x, r.currentTarget = L;
            try {
              u(r);
            } catch (q) {
              Si(q);
            }
            r.currentTarget = null, u = M;
          }
      }
    }
  }
  function Ne(e, t) {
    var n = t[gr];
    n === void 0 && (n = t[gr] = /* @__PURE__ */ new Set());
    var s = e + "__bubble";
    n.has(s) || (Vm(t, e, 2, !1), n.add(s));
  }
  function cu(e, t, n) {
    var s = 0;
    t && (s |= 4), Vm(
      n,
      e,
      s,
      t
    );
  }
  var uc = "_reactListening" + Math.random().toString(36).slice(2);
  function ru(e) {
    if (!e[uc]) {
      e[uc] = !0, Dd.forEach(function(n) {
        n !== "selectionchange" && (pv.has(n) || cu(n, !1, e), cu(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[uc] || (t[uc] = !0, cu("selectionchange", !1, t));
    }
  }
  function Vm(e, t, n, s) {
    switch (gp(t)) {
      case 2:
        var r = Vv;
        break;
      case 8:
        r = Yv;
        break;
      default:
        r = ju;
    }
    n = r.bind(
      null,
      t,
      n,
      e
    ), r = void 0, !Cr || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (r = !0), s ? r !== void 0 ? e.addEventListener(t, n, {
      capture: !0,
      passive: r
    }) : e.addEventListener(t, n, !0) : r !== void 0 ? e.addEventListener(t, n, {
      passive: r
    }) : e.addEventListener(t, n, !1);
  }
  function ou(e, t, n, s, r) {
    var u = s;
    if ((t & 1) === 0 && (t & 2) === 0 && s !== null)
      e: for (; ; ) {
        if (s === null) return;
        var p = s.tag;
        if (p === 3 || p === 4) {
          var x = s.stateNode.containerInfo;
          if (x === r) break;
          if (p === 4)
            for (p = s.return; p !== null; ) {
              var M = p.tag;
              if ((M === 3 || M === 4) && p.stateNode.containerInfo === r)
                return;
              p = p.return;
            }
          for (; x !== null; ) {
            if (p = hs(x), p === null) return;
            if (M = p.tag, M === 5 || M === 6 || M === 26 || M === 27) {
              s = u = p;
              continue e;
            }
            x = x.parentNode;
          }
        }
        s = s.return;
      }
    Qd(function() {
      var L = u, q = kr(n), K = [];
      e: {
        var U = wf.get(e);
        if (U !== void 0) {
          var V = yi, oe = e;
          switch (e) {
            case "keypress":
              if (vi(n) === 0) break e;
            case "keydown":
            case "keyup":
              V = rg;
              break;
            case "focusin":
              oe = "focus", V = Ar;
              break;
            case "focusout":
              oe = "blur", V = Ar;
              break;
            case "beforeblur":
            case "afterblur":
              V = Ar;
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
              V = Jd;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              V = Jb;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              V = dg;
              break;
            case gf:
            case vf:
            case xf:
              V = Ib;
              break;
            case yf:
              V = hg;
              break;
            case "scroll":
            case "scrollend":
              V = Zb;
              break;
            case "wheel":
              V = pg;
              break;
            case "copy":
            case "cut":
            case "paste":
              V = tg;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              V = Wd;
              break;
            case "toggle":
            case "beforetoggle":
              V = bg;
          }
          var be = (t & 4) !== 0, Ve = !be && (e === "scroll" || e === "scrollend"), z = be ? U !== null ? U + "Capture" : null : U;
          be = [];
          for (var R = L, H; R !== null; ) {
            var Z = R;
            if (H = Z.stateNode, Z = Z.tag, Z !== 5 && Z !== 26 && Z !== 27 || H === null || z === null || (Z = dl(R, z), Z != null && be.push(
              Yl(R, Z, H)
            )), Ve) break;
            R = R.return;
          }
          0 < be.length && (U = new V(
            U,
            oe,
            null,
            n,
            q
          ), K.push({ event: U, listeners: be }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (U = e === "mouseover" || e === "pointerover", V = e === "mouseout" || e === "pointerout", U && n !== Sr && (oe = n.relatedTarget || n.fromElement) && (hs(oe) || oe[fs]))
            break e;
          if ((V || U) && (U = q.window === q ? q : (U = q.ownerDocument) ? U.defaultView || U.parentWindow : window, V ? (oe = n.relatedTarget || n.toElement, V = L, oe = oe ? hs(oe) : null, oe !== null && (Ve = f(oe), be = oe.tag, oe !== Ve || be !== 5 && be !== 27 && be !== 6) && (oe = null)) : (V = null, oe = L), V !== oe)) {
            if (be = Jd, Z = "onMouseLeave", z = "onMouseEnter", R = "mouse", (e === "pointerout" || e === "pointerover") && (be = Wd, Z = "onPointerLeave", z = "onPointerEnter", R = "pointer"), Ve = V == null ? U : ul(V), H = oe == null ? U : ul(oe), U = new be(
              Z,
              R + "leave",
              V,
              n,
              q
            ), U.target = Ve, U.relatedTarget = H, Z = null, hs(q) === L && (be = new be(
              z,
              R + "enter",
              oe,
              n,
              q
            ), be.target = H, be.relatedTarget = Ve, Z = be), Ve = Z, V && oe)
              t: {
                for (be = _v, z = V, R = oe, H = 0, Z = z; Z; Z = be(Z))
                  H++;
                Z = 0;
                for (var pe = R; pe; pe = be(pe))
                  Z++;
                for (; 0 < H - Z; )
                  z = be(z), H--;
                for (; 0 < Z - H; )
                  R = be(R), Z--;
                for (; H--; ) {
                  if (z === R || R !== null && z === R.alternate) {
                    be = z;
                    break t;
                  }
                  z = be(z), R = be(R);
                }
                be = null;
              }
            else be = null;
            V !== null && Ym(
              K,
              U,
              V,
              be,
              !1
            ), oe !== null && Ve !== null && Ym(
              K,
              Ve,
              oe,
              be,
              !0
            );
          }
        }
        e: {
          if (U = L ? ul(L) : window, V = U.nodeName && U.nodeName.toLowerCase(), V === "select" || V === "input" && U.type === "file")
            var Oe = cf;
          else if (sf(U))
            if (rf)
              Oe = Cg;
            else {
              Oe = kg;
              var fe = Sg;
            }
          else
            V = U.nodeName, !V || V.toLowerCase() !== "input" || U.type !== "checkbox" && U.type !== "radio" ? L && jr(L.elementType) && (Oe = cf) : Oe = Ng;
          if (Oe && (Oe = Oe(e, L))) {
            lf(
              K,
              Oe,
              n,
              q
            );
            break e;
          }
          fe && fe(e, U, L), e === "focusout" && L && U.type === "number" && L.memoizedProps.value != null && wr(U, "number", U.value);
        }
        switch (fe = L ? ul(L) : window, e) {
          case "focusin":
            (sf(fe) || fe.contentEditable === "true") && (ws = fe, Lr = L, vl = null);
            break;
          case "focusout":
            vl = Lr = ws = null;
            break;
          case "mousedown":
            $r = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            $r = !1, _f(K, n, q);
            break;
          case "selectionchange":
            if (Mg) break;
          case "keydown":
          case "keyup":
            _f(K, n, q);
        }
        var we;
        if (Or)
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
          ys ? nf(e, n) && (Me = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (Me = "onCompositionStart");
        Me && (Id && n.locale !== "ko" && (ys || Me !== "onCompositionStart" ? Me === "onCompositionEnd" && ys && (we = Zd()) : (ia = q, Er = "value" in ia ? ia.value : ia.textContent, ys = !0)), fe = dc(L, Me), 0 < fe.length && (Me = new Pd(
          Me,
          e,
          null,
          n,
          q
        ), K.push({ event: Me, listeners: fe }), we ? Me.data = we : (we = af(n), we !== null && (Me.data = we)))), (we = vg ? xg(e, n) : yg(e, n)) && (Me = dc(L, "onBeforeInput"), 0 < Me.length && (fe = new Pd(
          "onBeforeInput",
          "beforeinput",
          null,
          n,
          q
        ), K.push({
          event: fe,
          listeners: Me
        }), fe.data = we)), fv(
          K,
          e,
          L,
          n,
          q
        );
      }
      Gm(K, t);
    });
  }
  function Yl(e, t, n) {
    return {
      instance: e,
      listener: t,
      currentTarget: n
    };
  }
  function dc(e, t) {
    for (var n = t + "Capture", s = []; e !== null; ) {
      var r = e, u = r.stateNode;
      if (r = r.tag, r !== 5 && r !== 26 && r !== 27 || u === null || (r = dl(e, n), r != null && s.unshift(
        Yl(e, r, u)
      ), r = dl(e, t), r != null && s.push(
        Yl(e, r, u)
      )), e.tag === 3) return s;
      e = e.return;
    }
    return [];
  }
  function _v(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function Ym(e, t, n, s, r) {
    for (var u = t._reactName, p = []; n !== null && n !== s; ) {
      var x = n, M = x.alternate, L = x.stateNode;
      if (x = x.tag, M !== null && M === s) break;
      x !== 5 && x !== 26 && x !== 27 || L === null || (M = L, r ? (L = dl(n, u), L != null && p.unshift(
        Yl(n, L, M)
      )) : r || (L = dl(n, u), L != null && p.push(
        Yl(n, L, M)
      ))), n = n.return;
    }
    p.length !== 0 && e.push({ event: t, listeners: p });
  }
  var bv = /\r\n?/g, gv = /\u0000|\uFFFD/g;
  function qm(e) {
    return (typeof e == "string" ? e : "" + e).replace(bv, `
`).replace(gv, "");
  }
  function Xm(e, t) {
    return t = qm(t), qm(e) === t;
  }
  function Ge(e, t, n, s, r, u) {
    switch (n) {
      case "children":
        typeof s == "string" ? t === "body" || t === "textarea" && s === "" || gs(e, s) : (typeof s == "number" || typeof s == "bigint") && t !== "body" && gs(e, "" + s);
        break;
      case "className":
        pi(e, "class", s);
        break;
      case "tabIndex":
        pi(e, "tabindex", s);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        pi(e, n, s);
        break;
      case "style":
        qd(e, s, u);
        break;
      case "data":
        if (t !== "object") {
          pi(e, "data", s);
          break;
        }
      case "src":
      case "href":
        if (s === "" && (t !== "a" || n !== "href")) {
          e.removeAttribute(n);
          break;
        }
        if (s == null || typeof s == "function" || typeof s == "symbol" || typeof s == "boolean") {
          e.removeAttribute(n);
          break;
        }
        s = bi("" + s), e.setAttribute(n, s);
        break;
      case "action":
      case "formAction":
        if (typeof s == "function") {
          e.setAttribute(
            n,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof u == "function" && (n === "formAction" ? (t !== "input" && Ge(e, t, "name", r.name, r, null), Ge(
            e,
            t,
            "formEncType",
            r.formEncType,
            r,
            null
          ), Ge(
            e,
            t,
            "formMethod",
            r.formMethod,
            r,
            null
          ), Ge(
            e,
            t,
            "formTarget",
            r.formTarget,
            r,
            null
          )) : (Ge(e, t, "encType", r.encType, r, null), Ge(e, t, "method", r.method, r, null), Ge(e, t, "target", r.target, r, null)));
        if (s == null || typeof s == "symbol" || typeof s == "boolean") {
          e.removeAttribute(n);
          break;
        }
        s = bi("" + s), e.setAttribute(n, s);
        break;
      case "onClick":
        s != null && (e.onclick = Hn);
        break;
      case "onScroll":
        s != null && Ne("scroll", e);
        break;
      case "onScrollEnd":
        s != null && Ne("scrollend", e);
        break;
      case "dangerouslySetInnerHTML":
        if (s != null) {
          if (typeof s != "object" || !("__html" in s))
            throw Error(o(61));
          if (n = s.__html, n != null) {
            if (r.children != null) throw Error(o(60));
            e.innerHTML = n;
          }
        }
        break;
      case "multiple":
        e.multiple = s && typeof s != "function" && typeof s != "symbol";
        break;
      case "muted":
        e.muted = s && typeof s != "function" && typeof s != "symbol";
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
        if (s == null || typeof s == "function" || typeof s == "boolean" || typeof s == "symbol") {
          e.removeAttribute("xlink:href");
          break;
        }
        n = bi("" + s), e.setAttributeNS(
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
        s != null && typeof s != "function" && typeof s != "symbol" ? e.setAttribute(n, "" + s) : e.removeAttribute(n);
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
        s && typeof s != "function" && typeof s != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
        break;
      case "capture":
      case "download":
        s === !0 ? e.setAttribute(n, "") : s !== !1 && s != null && typeof s != "function" && typeof s != "symbol" ? e.setAttribute(n, s) : e.removeAttribute(n);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        s != null && typeof s != "function" && typeof s != "symbol" && !isNaN(s) && 1 <= s ? e.setAttribute(n, s) : e.removeAttribute(n);
        break;
      case "rowSpan":
      case "start":
        s == null || typeof s == "function" || typeof s == "symbol" || isNaN(s) ? e.removeAttribute(n) : e.setAttribute(n, s);
        break;
      case "popover":
        Ne("beforetoggle", e), Ne("toggle", e), mi(e, "popover", s);
        break;
      case "xlinkActuate":
        Dn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          s
        );
        break;
      case "xlinkArcrole":
        Dn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          s
        );
        break;
      case "xlinkRole":
        Dn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          s
        );
        break;
      case "xlinkShow":
        Dn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          s
        );
        break;
      case "xlinkTitle":
        Dn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          s
        );
        break;
      case "xlinkType":
        Dn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          s
        );
        break;
      case "xmlBase":
        Dn(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          s
        );
        break;
      case "xmlLang":
        Dn(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          s
        );
        break;
      case "xmlSpace":
        Dn(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          s
        );
        break;
      case "is":
        mi(e, "is", s);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = Xb.get(n) || n, mi(e, n, s));
    }
  }
  function uu(e, t, n, s, r, u) {
    switch (n) {
      case "style":
        qd(e, s, u);
        break;
      case "dangerouslySetInnerHTML":
        if (s != null) {
          if (typeof s != "object" || !("__html" in s))
            throw Error(o(61));
          if (n = s.__html, n != null) {
            if (r.children != null) throw Error(o(60));
            e.innerHTML = n;
          }
        }
        break;
      case "children":
        typeof s == "string" ? gs(e, s) : (typeof s == "number" || typeof s == "bigint") && gs(e, "" + s);
        break;
      case "onScroll":
        s != null && Ne("scroll", e);
        break;
      case "onScrollEnd":
        s != null && Ne("scrollend", e);
        break;
      case "onClick":
        s != null && (e.onclick = Hn);
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
        if (!Hd.hasOwnProperty(n))
          e: {
            if (n[0] === "o" && n[1] === "n" && (r = n.endsWith("Capture"), t = n.slice(2, r ? n.length - 7 : void 0), u = e[Lt] || null, u = u != null ? u[n] : null, typeof u == "function" && e.removeEventListener(t, u, r), typeof s == "function")) {
              typeof u != "function" && u !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(t, s, r);
              break e;
            }
            n in e ? e[n] = s : s === !0 ? e.setAttribute(n, "") : mi(e, n, s);
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
        var s = !1, r = !1, u;
        for (u in n)
          if (n.hasOwnProperty(u)) {
            var p = n[u];
            if (p != null)
              switch (u) {
                case "src":
                  s = !0;
                  break;
                case "srcSet":
                  r = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(o(137, t));
                default:
                  Ge(e, t, u, p, n, null);
              }
          }
        r && Ge(e, t, "srcSet", n.srcSet, n, null), s && Ge(e, t, "src", n.src, n, null);
        return;
      case "input":
        Ne("invalid", e);
        var x = u = p = r = null, M = null, L = null;
        for (s in n)
          if (n.hasOwnProperty(s)) {
            var q = n[s];
            if (q != null)
              switch (s) {
                case "name":
                  r = q;
                  break;
                case "type":
                  p = q;
                  break;
                case "checked":
                  M = q;
                  break;
                case "defaultChecked":
                  L = q;
                  break;
                case "value":
                  u = q;
                  break;
                case "defaultValue":
                  x = q;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (q != null)
                    throw Error(o(137, t));
                  break;
                default:
                  Ge(e, t, s, q, n, null);
              }
          }
        Fd(
          e,
          u,
          x,
          M,
          L,
          p,
          r,
          !1
        );
        return;
      case "select":
        Ne("invalid", e), s = p = u = null;
        for (r in n)
          if (n.hasOwnProperty(r) && (x = n[r], x != null))
            switch (r) {
              case "value":
                u = x;
                break;
              case "defaultValue":
                p = x;
                break;
              case "multiple":
                s = x;
              default:
                Ge(e, t, r, x, n, null);
            }
        t = u, n = p, e.multiple = !!s, t != null ? bs(e, !!s, t, !1) : n != null && bs(e, !!s, n, !0);
        return;
      case "textarea":
        Ne("invalid", e), u = r = s = null;
        for (p in n)
          if (n.hasOwnProperty(p) && (x = n[p], x != null))
            switch (p) {
              case "value":
                s = x;
                break;
              case "defaultValue":
                r = x;
                break;
              case "children":
                u = x;
                break;
              case "dangerouslySetInnerHTML":
                if (x != null) throw Error(o(91));
                break;
              default:
                Ge(e, t, p, x, n, null);
            }
        Vd(e, s, r, u);
        return;
      case "option":
        for (M in n)
          if (n.hasOwnProperty(M) && (s = n[M], s != null))
            switch (M) {
              case "selected":
                e.selected = s && typeof s != "function" && typeof s != "symbol";
                break;
              default:
                Ge(e, t, M, s, n, null);
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
        for (s = 0; s < Vl.length; s++)
          Ne(Vl[s], e);
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
        for (L in n)
          if (n.hasOwnProperty(L) && (s = n[L], s != null))
            switch (L) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(o(137, t));
              default:
                Ge(e, t, L, s, n, null);
            }
        return;
      default:
        if (jr(t)) {
          for (q in n)
            n.hasOwnProperty(q) && (s = n[q], s !== void 0 && uu(
              e,
              t,
              q,
              s,
              n,
              void 0
            ));
          return;
        }
    }
    for (x in n)
      n.hasOwnProperty(x) && (s = n[x], s != null && Ge(e, t, x, s, n, null));
  }
  function vv(e, t, n, s) {
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
        var r = null, u = null, p = null, x = null, M = null, L = null, q = null;
        for (V in n) {
          var K = n[V];
          if (n.hasOwnProperty(V) && K != null)
            switch (V) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                M = K;
              default:
                s.hasOwnProperty(V) || Ge(e, t, V, null, s, K);
            }
        }
        for (var U in s) {
          var V = s[U];
          if (K = n[U], s.hasOwnProperty(U) && (V != null || K != null))
            switch (U) {
              case "type":
                u = V;
                break;
              case "name":
                r = V;
                break;
              case "checked":
                L = V;
                break;
              case "defaultChecked":
                q = V;
                break;
              case "value":
                p = V;
                break;
              case "defaultValue":
                x = V;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (V != null)
                  throw Error(o(137, t));
                break;
              default:
                V !== K && Ge(
                  e,
                  t,
                  U,
                  V,
                  s,
                  K
                );
            }
        }
        yr(
          e,
          p,
          x,
          M,
          L,
          q,
          u,
          r
        );
        return;
      case "select":
        V = p = x = U = null;
        for (u in n)
          if (M = n[u], n.hasOwnProperty(u) && M != null)
            switch (u) {
              case "value":
                break;
              case "multiple":
                V = M;
              default:
                s.hasOwnProperty(u) || Ge(
                  e,
                  t,
                  u,
                  null,
                  s,
                  M
                );
            }
        for (r in s)
          if (u = s[r], M = n[r], s.hasOwnProperty(r) && (u != null || M != null))
            switch (r) {
              case "value":
                U = u;
                break;
              case "defaultValue":
                x = u;
                break;
              case "multiple":
                p = u;
              default:
                u !== M && Ge(
                  e,
                  t,
                  r,
                  u,
                  s,
                  M
                );
            }
        t = x, n = p, s = V, U != null ? bs(e, !!n, U, !1) : !!s != !!n && (t != null ? bs(e, !!n, t, !0) : bs(e, !!n, n ? [] : "", !1));
        return;
      case "textarea":
        V = U = null;
        for (x in n)
          if (r = n[x], n.hasOwnProperty(x) && r != null && !s.hasOwnProperty(x))
            switch (x) {
              case "value":
                break;
              case "children":
                break;
              default:
                Ge(e, t, x, null, s, r);
            }
        for (p in s)
          if (r = s[p], u = n[p], s.hasOwnProperty(p) && (r != null || u != null))
            switch (p) {
              case "value":
                U = r;
                break;
              case "defaultValue":
                V = r;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (r != null) throw Error(o(91));
                break;
              default:
                r !== u && Ge(e, t, p, r, s, u);
            }
        Gd(e, U, V);
        return;
      case "option":
        for (var oe in n)
          if (U = n[oe], n.hasOwnProperty(oe) && U != null && !s.hasOwnProperty(oe))
            switch (oe) {
              case "selected":
                e.selected = !1;
                break;
              default:
                Ge(
                  e,
                  t,
                  oe,
                  null,
                  s,
                  U
                );
            }
        for (M in s)
          if (U = s[M], V = n[M], s.hasOwnProperty(M) && U !== V && (U != null || V != null))
            switch (M) {
              case "selected":
                e.selected = U && typeof U != "function" && typeof U != "symbol";
                break;
              default:
                Ge(
                  e,
                  t,
                  M,
                  U,
                  s,
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
          U = n[be], n.hasOwnProperty(be) && U != null && !s.hasOwnProperty(be) && Ge(e, t, be, null, s, U);
        for (L in s)
          if (U = s[L], V = n[L], s.hasOwnProperty(L) && U !== V && (U != null || V != null))
            switch (L) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (U != null)
                  throw Error(o(137, t));
                break;
              default:
                Ge(
                  e,
                  t,
                  L,
                  U,
                  s,
                  V
                );
            }
        return;
      default:
        if (jr(t)) {
          for (var Ve in n)
            U = n[Ve], n.hasOwnProperty(Ve) && U !== void 0 && !s.hasOwnProperty(Ve) && uu(
              e,
              t,
              Ve,
              void 0,
              s,
              U
            );
          for (q in s)
            U = s[q], V = n[q], !s.hasOwnProperty(q) || U === V || U === void 0 && V === void 0 || uu(
              e,
              t,
              q,
              U,
              s,
              V
            );
          return;
        }
    }
    for (var z in n)
      U = n[z], n.hasOwnProperty(z) && U != null && !s.hasOwnProperty(z) && Ge(e, t, z, null, s, U);
    for (K in s)
      U = s[K], V = n[K], !s.hasOwnProperty(K) || U === V || U == null && V == null || Ge(e, t, K, U, s, V);
  }
  function Qm(e) {
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
      for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), s = 0; s < n.length; s++) {
        var r = n[s], u = r.transferSize, p = r.initiatorType, x = r.duration;
        if (u && x && Qm(p)) {
          for (p = 0, x = r.responseEnd, s += 1; s < n.length; s++) {
            var M = n[s], L = M.startTime;
            if (L > x) break;
            var q = M.transferSize, K = M.initiatorType;
            q && Qm(K) && (M = M.responseEnd, p += q * (M < x ? 1 : (x - L) / (M - L)));
          }
          if (--s, t += 8 * (u + p) / (r.duration / 1e3), e++, 10 < e) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
  }
  var du = null, fu = null;
  function fc(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function Zm(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Km(e, t) {
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
  function yv() {
    var e = window.event;
    return e && e.type === "popstate" ? e === mu ? !1 : (mu = e, !0) : (mu = null, !1);
  }
  var Jm = typeof setTimeout == "function" ? setTimeout : void 0, wv = typeof clearTimeout == "function" ? clearTimeout : void 0, Pm = typeof Promise == "function" ? Promise : void 0, jv = typeof queueMicrotask == "function" ? queueMicrotask : typeof Pm < "u" ? function(e) {
    return Pm.resolve(null).then(e).catch(Sv);
  } : Jm;
  function Sv(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function ja(e) {
    return e === "head";
  }
  function Wm(e, t) {
    var n = t, s = 0;
    do {
      var r = n.nextSibling;
      if (e.removeChild(n), r && r.nodeType === 8)
        if (n = r.data, n === "/$" || n === "/&") {
          if (s === 0) {
            e.removeChild(r), Ks(t);
            return;
          }
          s--;
        } else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&")
          s++;
        else if (n === "html")
          ql(e.ownerDocument.documentElement);
        else if (n === "head") {
          n = e.ownerDocument.head, ql(n);
          for (var u = n.firstChild; u; ) {
            var p = u.nextSibling, x = u.nodeName;
            u[ol] || x === "SCRIPT" || x === "STYLE" || x === "LINK" && u.rel.toLowerCase() === "stylesheet" || n.removeChild(u), u = p;
          }
        } else
          n === "body" && ql(e.ownerDocument.body);
      n = r;
    } while (n);
    Ks(t);
  }
  function Im(e, t) {
    var n = e;
    e = 0;
    do {
      var s = n.nextSibling;
      if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), s && s.nodeType === 8)
        if (n = s.data, n === "/$") {
          if (e === 0) break;
          e--;
        } else
          n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || e++;
      n = s;
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
          pu(n), vr(n);
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
  function kv(e, t, n, s) {
    for (; e.nodeType === 1; ) {
      var r = n;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!s && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (s) {
        if (!e[ol])
          switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (u = e.getAttribute("rel"), u === "stylesheet" && e.hasAttribute("data-precedence"))
                break;
              if (u !== r.rel || e.getAttribute("href") !== (r.href == null || r.href === "" ? null : r.href) || e.getAttribute("crossorigin") !== (r.crossOrigin == null ? null : r.crossOrigin) || e.getAttribute("title") !== (r.title == null ? null : r.title))
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (u = e.getAttribute("src"), (u !== (r.src == null ? null : r.src) || e.getAttribute("type") !== (r.type == null ? null : r.type) || e.getAttribute("crossorigin") !== (r.crossOrigin == null ? null : r.crossOrigin)) && u && e.hasAttribute("async") && !e.hasAttribute("itemprop"))
                break;
              return e;
            default:
              return e;
          }
      } else if (t === "input" && e.type === "hidden") {
        var u = r.name == null ? null : "" + r.name;
        if (r.type === "hidden" && e.getAttribute("name") === u)
          return e;
      } else return e;
      if (e = hn(e.nextSibling), e === null) break;
    }
    return null;
  }
  function Nv(e, t, n) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = hn(e.nextSibling), e === null)) return null;
    return e;
  }
  function ep(e, t) {
    for (; e.nodeType !== 8; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = hn(e.nextSibling), e === null)) return null;
    return e;
  }
  function _u(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function bu(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
  }
  function Cv(e, t) {
    var n = e.ownerDocument;
    if (e.data === "$~") e._reactRetry = t;
    else if (e.data !== "$?" || n.readyState !== "loading")
      t();
    else {
      var s = function() {
        t(), n.removeEventListener("DOMContentLoaded", s);
      };
      n.addEventListener("DOMContentLoaded", s), e._reactRetry = s;
    }
  }
  function hn(e) {
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
  var gu = null;
  function tp(e) {
    e = e.nextSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === "/$" || n === "/&") {
          if (t === 0)
            return hn(e.nextSibling);
          t--;
        } else
          n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function np(e) {
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
  function ap(e, t, n) {
    switch (t = fc(n), e) {
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
  function ql(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    vr(e);
  }
  var mn = /* @__PURE__ */ new Map(), sp = /* @__PURE__ */ new Set();
  function hc(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var Wn = $.d;
  $.d = {
    f: Ev,
    r: Mv,
    D: Tv,
    C: Av,
    L: Rv,
    m: Ov,
    X: Dv,
    S: zv,
    M: Hv
  };
  function Ev() {
    var e = Wn.f(), t = sc();
    return e || t;
  }
  function Mv(e) {
    var t = ms(e);
    t !== null && t.tag === 5 && t.type === "form" ? yh(t) : Wn.r(e);
  }
  var Xs = typeof document > "u" ? null : document;
  function lp(e, t, n) {
    var s = Xs;
    if (s && typeof t == "string" && t) {
      var r = ln(t);
      r = 'link[rel="' + e + '"][href="' + r + '"]', typeof n == "string" && (r += '[crossorigin="' + n + '"]'), sp.has(r) || (sp.add(r), e = { rel: e, crossOrigin: n, href: t }, s.querySelector(r) === null && (t = s.createElement("link"), jt(t, "link", e), bt(t), s.head.appendChild(t)));
    }
  }
  function Tv(e) {
    Wn.D(e), lp("dns-prefetch", e, null);
  }
  function Av(e, t) {
    Wn.C(e, t), lp("preconnect", e, t);
  }
  function Rv(e, t, n) {
    Wn.L(e, t, n);
    var s = Xs;
    if (s && e && t) {
      var r = 'link[rel="preload"][as="' + ln(t) + '"]';
      t === "image" && n && n.imageSrcSet ? (r += '[imagesrcset="' + ln(
        n.imageSrcSet
      ) + '"]', typeof n.imageSizes == "string" && (r += '[imagesizes="' + ln(
        n.imageSizes
      ) + '"]')) : r += '[href="' + ln(e) + '"]';
      var u = r;
      switch (t) {
        case "style":
          u = Qs(e);
          break;
        case "script":
          u = Zs(e);
      }
      mn.has(u) || (e = g(
        {
          rel: "preload",
          href: t === "image" && n && n.imageSrcSet ? void 0 : e,
          as: t
        },
        n
      ), mn.set(u, e), s.querySelector(r) !== null || t === "style" && s.querySelector(Xl(u)) || t === "script" && s.querySelector(Ql(u)) || (t = s.createElement("link"), jt(t, "link", e), bt(t), s.head.appendChild(t)));
    }
  }
  function Ov(e, t) {
    Wn.m(e, t);
    var n = Xs;
    if (n && e) {
      var s = t && typeof t.as == "string" ? t.as : "script", r = 'link[rel="modulepreload"][as="' + ln(s) + '"][href="' + ln(e) + '"]', u = r;
      switch (s) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          u = Zs(e);
      }
      if (!mn.has(u) && (e = g({ rel: "modulepreload", href: e }, t), mn.set(u, e), n.querySelector(r) === null)) {
        switch (s) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (n.querySelector(Ql(u)))
              return;
        }
        s = n.createElement("link"), jt(s, "link", e), bt(s), n.head.appendChild(s);
      }
    }
  }
  function zv(e, t, n) {
    Wn.S(e, t, n);
    var s = Xs;
    if (s && e) {
      var r = ps(s).hoistableStyles, u = Qs(e);
      t = t || "default";
      var p = r.get(u);
      if (!p) {
        var x = { loading: 0, preload: null };
        if (p = s.querySelector(
          Xl(u)
        ))
          x.loading = 5;
        else {
          e = g(
            { rel: "stylesheet", href: e, "data-precedence": t },
            n
          ), (n = mn.get(u)) && vu(e, n);
          var M = p = s.createElement("link");
          bt(M), jt(M, "link", e), M._p = new Promise(function(L, q) {
            M.onload = L, M.onerror = q;
          }), M.addEventListener("load", function() {
            x.loading |= 1;
          }), M.addEventListener("error", function() {
            x.loading |= 2;
          }), x.loading |= 4, mc(p, t, s);
        }
        p = {
          type: "stylesheet",
          instance: p,
          count: 1,
          state: x
        }, r.set(u, p);
      }
    }
  }
  function Dv(e, t) {
    Wn.X(e, t);
    var n = Xs;
    if (n && e) {
      var s = ps(n).hoistableScripts, r = Zs(e), u = s.get(r);
      u || (u = n.querySelector(Ql(r)), u || (e = g({ src: e, async: !0 }, t), (t = mn.get(r)) && xu(e, t), u = n.createElement("script"), bt(u), jt(u, "link", e), n.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, s.set(r, u));
    }
  }
  function Hv(e, t) {
    Wn.M(e, t);
    var n = Xs;
    if (n && e) {
      var s = ps(n).hoistableScripts, r = Zs(e), u = s.get(r);
      u || (u = n.querySelector(Ql(r)), u || (e = g({ src: e, async: !0, type: "module" }, t), (t = mn.get(r)) && xu(e, t), u = n.createElement("script"), bt(u), jt(u, "link", e), n.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, s.set(r, u));
    }
  }
  function ip(e, t, n, s) {
    var r = (r = he.current) ? hc(r) : null;
    if (!r) throw Error(o(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof n.precedence == "string" && typeof n.href == "string" ? (t = Qs(n.href), n = ps(
          r
        ).hoistableStyles, s = n.get(t), s || (s = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, n.set(t, s)), s) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
          e = Qs(n.href);
          var u = ps(
            r
          ).hoistableStyles, p = u.get(e);
          if (p || (r = r.ownerDocument || r, p = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, u.set(e, p), (u = r.querySelector(
            Xl(e)
          )) && !u._p && (p.instance = u, p.state.loading = 5), mn.has(e) || (n = {
            rel: "preload",
            as: "style",
            href: n.href,
            crossOrigin: n.crossOrigin,
            integrity: n.integrity,
            media: n.media,
            hrefLang: n.hrefLang,
            referrerPolicy: n.referrerPolicy
          }, mn.set(e, n), u || Lv(
            r,
            e,
            n,
            p.state
          ))), t && s === null)
            throw Error(o(528, ""));
          return p;
        }
        if (t && s !== null)
          throw Error(o(529, ""));
        return null;
      case "script":
        return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Zs(n), n = ps(
          r
        ).hoistableScripts, s = n.get(t), s || (s = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, n.set(t, s)), s) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(o(444, e));
    }
  }
  function Qs(e) {
    return 'href="' + ln(e) + '"';
  }
  function Xl(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function cp(e) {
    return g({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function Lv(e, t, n, s) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? s.loading = 1 : (t = e.createElement("link"), s.preload = t, t.addEventListener("load", function() {
      return s.loading |= 1;
    }), t.addEventListener("error", function() {
      return s.loading |= 2;
    }), jt(t, "link", n), bt(t), e.head.appendChild(t));
  }
  function Zs(e) {
    return '[src="' + ln(e) + '"]';
  }
  function Ql(e) {
    return "script[async]" + e;
  }
  function rp(e, t, n) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var s = e.querySelector(
            'style[data-href~="' + ln(n.href) + '"]'
          );
          if (s)
            return t.instance = s, bt(s), s;
          var r = g({}, n, {
            "data-href": n.href,
            "data-precedence": n.precedence,
            href: null,
            precedence: null
          });
          return s = (e.ownerDocument || e).createElement(
            "style"
          ), bt(s), jt(s, "style", r), mc(s, n.precedence, e), t.instance = s;
        case "stylesheet":
          r = Qs(n.href);
          var u = e.querySelector(
            Xl(r)
          );
          if (u)
            return t.state.loading |= 4, t.instance = u, bt(u), u;
          s = cp(n), (r = mn.get(r)) && vu(s, r), u = (e.ownerDocument || e).createElement("link"), bt(u);
          var p = u;
          return p._p = new Promise(function(x, M) {
            p.onload = x, p.onerror = M;
          }), jt(u, "link", s), t.state.loading |= 4, mc(u, n.precedence, e), t.instance = u;
        case "script":
          return u = Zs(n.src), (r = e.querySelector(
            Ql(u)
          )) ? (t.instance = r, bt(r), r) : (s = n, (r = mn.get(u)) && (s = g({}, n), xu(s, r)), e = e.ownerDocument || e, r = e.createElement("script"), bt(r), jt(r, "link", s), e.head.appendChild(r), t.instance = r);
        case "void":
          return null;
        default:
          throw Error(o(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (s = t.instance, t.state.loading |= 4, mc(s, n.precedence, e));
    return t.instance;
  }
  function mc(e, t, n) {
    for (var s = n.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), r = s.length ? s[s.length - 1] : null, u = r, p = 0; p < s.length; p++) {
      var x = s[p];
      if (x.dataset.precedence === t) u = x;
      else if (u !== r) break;
    }
    u ? u.parentNode.insertBefore(e, u.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
  }
  function vu(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function xu(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var pc = null;
  function op(e, t, n) {
    if (pc === null) {
      var s = /* @__PURE__ */ new Map(), r = pc = /* @__PURE__ */ new Map();
      r.set(n, s);
    } else
      r = pc, s = r.get(n), s || (s = /* @__PURE__ */ new Map(), r.set(n, s));
    if (s.has(e)) return s;
    for (s.set(e, null), n = n.getElementsByTagName(e), r = 0; r < n.length; r++) {
      var u = n[r];
      if (!(u[ol] || u[vt] || e === "link" && u.getAttribute("rel") === "stylesheet") && u.namespaceURI !== "http://www.w3.org/2000/svg") {
        var p = u.getAttribute(t) || "";
        p = e + p;
        var x = s.get(p);
        x ? x.push(u) : s.set(p, [u]);
      }
    }
    return s;
  }
  function up(e, t, n) {
    e = e.ownerDocument || e, e.head.insertBefore(
      n,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function $v(e, t, n) {
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
  function dp(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function Uv(e, t, n, s) {
    if (n.type === "stylesheet" && (typeof s.media != "string" || matchMedia(s.media).matches !== !1) && (n.state.loading & 4) === 0) {
      if (n.instance === null) {
        var r = Qs(s.href), u = t.querySelector(
          Xl(r)
        );
        if (u) {
          t = u._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = _c.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = u, bt(u);
          return;
        }
        u = t.ownerDocument || t, s = cp(s), (r = mn.get(r)) && vu(s, r), u = u.createElement("link"), bt(u);
        var p = u;
        p._p = new Promise(function(x, M) {
          p.onload = x, p.onerror = M;
        }), jt(u, "link", s), n.instance = u;
      }
      e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && (n.state.loading & 3) === 0 && (e.count++, n = _c.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
    }
  }
  var yu = 0;
  function Bv(e, t) {
    return e.stylesheets && e.count === 0 && gc(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
      var s = setTimeout(function() {
        if (e.stylesheets && gc(e, e.stylesheets), e.unsuspend) {
          var u = e.unsuspend;
          e.unsuspend = null, u();
        }
      }, 6e4 + t);
      0 < e.imgBytes && yu === 0 && (yu = 62500 * xv());
      var r = setTimeout(
        function() {
          if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && gc(e, e.stylesheets), e.unsuspend)) {
            var u = e.unsuspend;
            e.unsuspend = null, u();
          }
        },
        (e.imgBytes > yu ? 50 : 800) + t
      );
      return e.unsuspend = n, function() {
        e.unsuspend = null, clearTimeout(s), clearTimeout(r);
      };
    } : null;
  }
  function _c() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) gc(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var bc = null;
  function gc(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, bc = /* @__PURE__ */ new Map(), t.forEach(Fv, e), bc = null, _c.call(e));
  }
  function Fv(e, t) {
    if (!(t.state.loading & 4)) {
      var n = bc.get(e);
      if (n) var s = n.get(null);
      else {
        n = /* @__PURE__ */ new Map(), bc.set(e, n);
        for (var r = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), u = 0; u < r.length; u++) {
          var p = r[u];
          (p.nodeName === "LINK" || p.getAttribute("media") !== "not all") && (n.set(p.dataset.precedence, p), s = p);
        }
        s && n.set(null, s);
      }
      r = t.instance, p = r.getAttribute("data-precedence"), u = n.get(p) || s, u === s && n.set(null, r), n.set(p, r), this.count++, s = _c.bind(this), r.addEventListener("load", s), r.addEventListener("error", s), u ? u.parentNode.insertBefore(r, u.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(r, e.firstChild)), t.state.loading |= 4;
    }
  }
  var Zl = {
    $$typeof: B,
    Provider: null,
    Consumer: null,
    _currentValue: Q,
    _currentValue2: Q,
    _threadCount: 0
  };
  function Gv(e, t, n, s, r, u, p, x, M) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = pr(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = pr(0), this.hiddenUpdates = pr(null), this.identifierPrefix = s, this.onUncaughtError = r, this.onCaughtError = u, this.onRecoverableError = p, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = M, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function fp(e, t, n, s, r, u, p, x, M, L, q, K) {
    return e = new Gv(
      e,
      t,
      n,
      p,
      M,
      L,
      q,
      K,
      x
    ), t = 1, u === !0 && (t |= 24), u = Kt(3, null, null, t), e.current = u, u.stateNode = e, t = Ir(), t.refCount++, e.pooledCache = t, t.refCount++, u.memoizedState = {
      element: s,
      isDehydrated: n,
      cache: t
    }, ao(u), e;
  }
  function hp(e) {
    return e ? (e = ks, e) : ks;
  }
  function mp(e, t, n, s, r, u) {
    r = hp(r), s.context === null ? s.context = r : s.pendingContext = r, s = fa(t), s.payload = { element: n }, u = u === void 0 ? null : u, u !== null && (s.callback = u), n = ha(e, s, t), n !== null && (Vt(n, e, t), Nl(n, e, t));
  }
  function pp(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function wu(e, t) {
    pp(e, t), (e = e.alternate) && pp(e, t);
  }
  function _p(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Va(e, 67108864);
      t !== null && Vt(t, e, 67108864), wu(e, 67108864);
    }
  }
  function bp(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = en();
      t = _r(t);
      var n = Va(e, t);
      n !== null && Vt(n, e, t), wu(e, t);
    }
  }
  var vc = !0;
  function Vv(e, t, n, s) {
    var r = T.T;
    T.T = null;
    var u = $.p;
    try {
      $.p = 2, ju(e, t, n, s);
    } finally {
      $.p = u, T.T = r;
    }
  }
  function Yv(e, t, n, s) {
    var r = T.T;
    T.T = null;
    var u = $.p;
    try {
      $.p = 8, ju(e, t, n, s);
    } finally {
      $.p = u, T.T = r;
    }
  }
  function ju(e, t, n, s) {
    if (vc) {
      var r = Su(s);
      if (r === null)
        ou(
          e,
          t,
          s,
          xc,
          n
        ), vp(e, s);
      else if (Xv(
        r,
        e,
        t,
        n,
        s
      ))
        s.stopPropagation();
      else if (vp(e, s), t & 4 && -1 < qv.indexOf(e)) {
        for (; r !== null; ) {
          var u = ms(r);
          if (u !== null)
            switch (u.tag) {
              case 3:
                if (u = u.stateNode, u.current.memoizedState.isDehydrated) {
                  var p = $a(u.pendingLanes);
                  if (p !== 0) {
                    var x = u;
                    for (x.pendingLanes |= 2, x.entangledLanes |= 2; p; ) {
                      var M = 1 << 31 - Ct(p);
                      x.entanglements[1] |= M, p &= ~M;
                    }
                    Tn(u), (He & 6) === 0 && (nc = nt() + 500, Gl(0));
                  }
                }
                break;
              case 31:
              case 13:
                x = Va(u, 2), x !== null && Vt(x, u, 2), sc(), wu(u, 2);
            }
          if (u = Su(s), u === null && ou(
            e,
            t,
            s,
            xc,
            n
          ), u === r) break;
          r = u;
        }
        r !== null && s.stopPropagation();
      } else
        ou(
          e,
          t,
          s,
          null,
          n
        );
    }
  }
  function Su(e) {
    return e = kr(e), ku(e);
  }
  var xc = null;
  function ku(e) {
    if (xc = null, e = hs(e), e !== null) {
      var t = f(e);
      if (t === null) e = null;
      else {
        var n = t.tag;
        if (n === 13) {
          if (e = h(t), e !== null) return e;
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
    return xc = e, null;
  }
  function gp(e) {
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
        switch (ll()) {
          case Ae:
            return 2;
          case os:
            return 8;
          case us:
          case dr:
            return 32;
          case ui:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Nu = !1, Sa = null, ka = null, Na = null, Kl = /* @__PURE__ */ new Map(), Jl = /* @__PURE__ */ new Map(), Ca = [], qv = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function vp(e, t) {
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
        Kl.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Jl.delete(t.pointerId);
    }
  }
  function Pl(e, t, n, s, r, u) {
    return e === null || e.nativeEvent !== u ? (e = {
      blockedOn: t,
      domEventName: n,
      eventSystemFlags: s,
      nativeEvent: u,
      targetContainers: [r]
    }, t !== null && (t = ms(t), t !== null && _p(t)), e) : (e.eventSystemFlags |= s, t = e.targetContainers, r !== null && t.indexOf(r) === -1 && t.push(r), e);
  }
  function Xv(e, t, n, s, r) {
    switch (t) {
      case "focusin":
        return Sa = Pl(
          Sa,
          e,
          t,
          n,
          s,
          r
        ), !0;
      case "dragenter":
        return ka = Pl(
          ka,
          e,
          t,
          n,
          s,
          r
        ), !0;
      case "mouseover":
        return Na = Pl(
          Na,
          e,
          t,
          n,
          s,
          r
        ), !0;
      case "pointerover":
        var u = r.pointerId;
        return Kl.set(
          u,
          Pl(
            Kl.get(u) || null,
            e,
            t,
            n,
            s,
            r
          )
        ), !0;
      case "gotpointercapture":
        return u = r.pointerId, Jl.set(
          u,
          Pl(
            Jl.get(u) || null,
            e,
            t,
            n,
            s,
            r
          )
        ), !0;
    }
    return !1;
  }
  function xp(e) {
    var t = hs(e.target);
    if (t !== null) {
      var n = f(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = h(n), t !== null) {
            e.blockedOn = t, Od(e.priority, function() {
              bp(n);
            });
            return;
          }
        } else if (t === 31) {
          if (t = m(n), t !== null) {
            e.blockedOn = t, Od(e.priority, function() {
              bp(n);
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
  function yc(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = Su(e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var s = new n.constructor(
          n.type,
          n
        );
        Sr = s, n.target.dispatchEvent(s), Sr = null;
      } else
        return t = ms(n), t !== null && _p(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function yp(e, t, n) {
    yc(e) && n.delete(t);
  }
  function Qv() {
    Nu = !1, Sa !== null && yc(Sa) && (Sa = null), ka !== null && yc(ka) && (ka = null), Na !== null && yc(Na) && (Na = null), Kl.forEach(yp), Jl.forEach(yp);
  }
  function wc(e, t) {
    e.blockedOn === t && (e.blockedOn = null, Nu || (Nu = !0, a.unstable_scheduleCallback(
      a.unstable_NormalPriority,
      Qv
    )));
  }
  var jc = null;
  function wp(e) {
    jc !== e && (jc = e, a.unstable_scheduleCallback(
      a.unstable_NormalPriority,
      function() {
        jc === e && (jc = null);
        for (var t = 0; t < e.length; t += 3) {
          var n = e[t], s = e[t + 1], r = e[t + 2];
          if (typeof s != "function") {
            if (ku(s || n) === null)
              continue;
            break;
          }
          var u = ms(n);
          u !== null && (e.splice(t, 3), t -= 3, So(
            u,
            {
              pending: !0,
              data: r,
              method: n.method,
              action: s
            },
            s,
            r
          ));
        }
      }
    ));
  }
  function Ks(e) {
    function t(M) {
      return wc(M, e);
    }
    Sa !== null && wc(Sa, e), ka !== null && wc(ka, e), Na !== null && wc(Na, e), Kl.forEach(t), Jl.forEach(t);
    for (var n = 0; n < Ca.length; n++) {
      var s = Ca[n];
      s.blockedOn === e && (s.blockedOn = null);
    }
    for (; 0 < Ca.length && (n = Ca[0], n.blockedOn === null); )
      xp(n), n.blockedOn === null && Ca.shift();
    if (n = (e.ownerDocument || e).$$reactFormReplay, n != null)
      for (s = 0; s < n.length; s += 3) {
        var r = n[s], u = n[s + 1], p = r[Lt] || null;
        if (typeof u == "function")
          p || wp(n);
        else if (p) {
          var x = null;
          if (u && u.hasAttribute("formAction")) {
            if (r = u, p = u[Lt] || null)
              x = p.formAction;
            else if (ku(r) !== null) continue;
          } else x = p.action;
          typeof x == "function" ? n[s + 1] = x : (n.splice(s, 3), s -= 3), wp(n);
        }
      }
  }
  function jp() {
    function e(u) {
      u.canIntercept && u.info === "react-transition" && u.intercept({
        handler: function() {
          return new Promise(function(p) {
            return r = p;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function t() {
      r !== null && (r(), r = null), s || setTimeout(n, 20);
    }
    function n() {
      if (!s && !navigation.transition) {
        var u = navigation.currentEntry;
        u && u.url != null && navigation.navigate(u.url, {
          state: u.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var s = !1, r = null;
      return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
        s = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), r !== null && (r(), r = null);
      };
    }
  }
  function Cu(e) {
    this._internalRoot = e;
  }
  Sc.prototype.render = Cu.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(o(409));
    var n = t.current, s = en();
    mp(n, s, e, t, null, null);
  }, Sc.prototype.unmount = Cu.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      mp(e.current, 2, null, e, null, null), sc(), t[fs] = null;
    }
  };
  function Sc(e) {
    this._internalRoot = e;
  }
  Sc.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Rd();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < Ca.length && t !== 0 && t < Ca[n].priority; n++) ;
      Ca.splice(n, 0, e), n === 0 && xp(e);
    }
  };
  var Sp = i.version;
  if (Sp !== "19.2.8")
    throw Error(
      o(
        527,
        Sp,
        "19.2.8"
      )
    );
  $.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(o(188)) : (e = Object.keys(e).join(","), Error(o(268, e)));
    return e = b(t), e = e !== null ? v(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var Zv = {
    bundleType: 0,
    version: "19.2.8",
    rendererPackageName: "react-dom",
    currentDispatcherRef: T,
    reconcilerVersion: "19.2.8"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var kc = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!kc.isDisabled && kc.supportsFiber)
      try {
        La = kc.inject(
          Zv
        ), Rt = kc;
      } catch {
      }
  }
  return Il.createRoot = function(e, t) {
    if (!d(e)) throw Error(o(299));
    var n = !1, s = "", r = Ah, u = Rh, p = Oh;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (s = t.identifierPrefix), t.onUncaughtError !== void 0 && (r = t.onUncaughtError), t.onCaughtError !== void 0 && (u = t.onCaughtError), t.onRecoverableError !== void 0 && (p = t.onRecoverableError)), t = fp(
      e,
      1,
      !1,
      null,
      null,
      n,
      s,
      null,
      r,
      u,
      p,
      jp
    ), e[fs] = t.current, ru(e), new Cu(t);
  }, Il.hydrateRoot = function(e, t, n) {
    if (!d(e)) throw Error(o(299));
    var s = !1, r = "", u = Ah, p = Rh, x = Oh, M = null;
    return n != null && (n.unstable_strictMode === !0 && (s = !0), n.identifierPrefix !== void 0 && (r = n.identifierPrefix), n.onUncaughtError !== void 0 && (u = n.onUncaughtError), n.onCaughtError !== void 0 && (p = n.onCaughtError), n.onRecoverableError !== void 0 && (x = n.onRecoverableError), n.formState !== void 0 && (M = n.formState)), t = fp(
      e,
      1,
      !0,
      t,
      n ?? null,
      s,
      r,
      M,
      u,
      p,
      x,
      jp
    ), t.context = hp(null), n = t.current, s = en(), s = _r(s), r = fa(s), r.callback = null, ha(n, r, s), n = s, t.current.lanes = n, rl(t, n), Tn(t), e[fs] = t.current, ru(e), new Sc(t);
  }, Il.version = "19.2.8", Il;
}
var zp;
function ix() {
  if (zp) return Tu.exports;
  zp = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (i) {
        console.error(i);
      }
  }
  return a(), Tu.exports = lx(), Tu.exports;
}
var cx = ix();
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
var ad = /^(?:[a-z][a-z0-9+.-]*:|[\\/]{2})/i, v_ = /^[\\/]{2}/;
function rx(a, i) {
  return i + a.replace(/\\/g, "/");
}
var Dp = "popstate";
function Hp(a) {
  return typeof a == "object" && a != null && "pathname" in a && "search" in a && "hash" in a && "state" in a && "key" in a;
}
function ox(a = {}) {
  function i(d, f) {
    let {
      pathname: h = "/",
      search: m = "",
      hash: _ = ""
    } = is(d.location.hash.substring(1));
    return !h.startsWith("/") && !h.startsWith(".") && (h = "/" + h), Qu(
      "",
      { pathname: h, search: m, hash: _ },
      // state defaults to `null` because `window.history.state` does
      f.state && f.state.usr || null,
      f.state && f.state.key || "default"
    );
  }
  function c(d, f) {
    let h = d.document.querySelector("base"), m = "";
    if (h && h.getAttribute("href")) {
      let _ = d.location.href, b = _.indexOf("#");
      m = b === -1 ? _ : _.slice(0, b);
    }
    return m + "#" + (typeof f == "string" ? f : ni(f));
  }
  function o(d, f) {
    tn(
      d.pathname.charAt(0) === "/",
      `relative pathnames are not supported in hash history.push(${JSON.stringify(
        f
      )})`
    );
  }
  return dx(
    i,
    c,
    o,
    a
  );
}
function Pe(a, i) {
  if (a === !1 || a === null || typeof a > "u")
    throw new Error(i);
}
function tn(a, i) {
  if (!a) {
    typeof console < "u" && console.warn(i);
    try {
      throw new Error(i);
    } catch {
    }
  }
}
function ux() {
  return Math.random().toString(36).substring(2, 10);
}
function Lp(a, i) {
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
function Qu(a, i, c = null, o, d) {
  return {
    pathname: typeof a == "string" ? a : a.pathname,
    search: "",
    hash: "",
    ...typeof i == "string" ? is(i) : i,
    state: c,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: i && i.key || o || ux(),
    mask: d
  };
}
function ni({
  pathname: a = "/",
  search: i = "",
  hash: c = ""
}) {
  return i && i !== "?" && (a += i.charAt(0) === "?" ? i : "?" + i), c && c !== "#" && (a += c.charAt(0) === "#" ? c : "#" + c), a;
}
function is(a) {
  let i = {};
  if (a) {
    let c = a.indexOf("#");
    c >= 0 && (i.hash = a.substring(c), a = a.substring(0, c));
    let o = a.indexOf("?");
    o >= 0 && (i.search = a.substring(o), a = a.substring(0, o)), a && (i.pathname = a);
  }
  return i;
}
function dx(a, i, c, o = {}) {
  let { window: d = document.defaultView, v5Compat: f = !1 } = o, h = d.history, m = "POP", _ = null, b = v();
  b == null && (b = 0, h.replaceState({ ...h.state, idx: b }, ""));
  function v() {
    return (h.state || { idx: null }).idx;
  }
  function g() {
    m = "POP";
    let N = v(), C = N == null ? null : N - b;
    b = N, _ && _({ action: m, location: E.location, delta: C });
  }
  function j(N, C) {
    m = "PUSH";
    let O = Hp(N) ? N : Qu(E.location, N, C);
    c && c(O, N), b = v() + 1;
    let B = Lp(O, b), J = E.createHref(O.mask || O);
    try {
      h.pushState(B, "", J);
    } catch (P) {
      if (P instanceof DOMException && P.name === "DataCloneError")
        throw P;
      d.location.assign(J);
    }
    f && _ && _({ action: m, location: E.location, delta: 1 });
  }
  function w(N, C) {
    m = "REPLACE";
    let O = Hp(N) ? N : Qu(E.location, N, C);
    c && c(O, N), b = v();
    let B = Lp(O, b), J = E.createHref(O.mask || O);
    h.replaceState(B, "", J), f && _ && _({ action: m, location: E.location, delta: 0 });
  }
  function S(N) {
    return fx(d, N);
  }
  let E = {
    get action() {
      return m;
    },
    get location() {
      return a(d, h);
    },
    listen(N) {
      if (_)
        throw new Error("A history only accepts one active listener");
      return d.addEventListener(Dp, g), _ = N, () => {
        d.removeEventListener(Dp, g), _ = null;
      };
    },
    createHref(N) {
      return i(d, N);
    },
    createURL: S,
    encodeLocation(N) {
      let C = S(N);
      return {
        pathname: C.pathname,
        search: C.search,
        hash: C.hash
      };
    },
    push: j,
    replace: w,
    go(N) {
      return h.go(N);
    }
  };
  return E;
}
function fx(a, i, c = !1) {
  let o = "http://localhost";
  a && (o = a.location.origin !== "null" ? a.location.origin : a.location.href), Pe(o, "No window.location.(origin|href) available to create URL");
  let d = typeof i == "string" ? i : ni(i);
  return d = d.replace(/ $/, "%20"), !c && v_.test(d) && (d = o + d), new URL(d, o);
}
function x_(a, i, c = "/") {
  return hx(a, i, c, !1);
}
function hx(a, i, c, o, d) {
  let f = typeof i == "string" ? is(i) : i, h = na(f.pathname || "/", c);
  if (h == null)
    return null;
  let m = mx(a), _ = null, b = kx(h);
  for (let v = 0; _ == null && v < m.length; ++v)
    _ = Sx(
      m[v],
      b,
      o
    );
  return _;
}
function mx(a) {
  let i = y_(a);
  return px(i), i;
}
function y_(a, i = [], c = [], o = "", d = !1) {
  let f = (h, m, _ = d, b) => {
    let v = {
      relativePath: b === void 0 ? h.path || "" : b,
      caseSensitive: h.caseSensitive === !0,
      childrenIndex: m,
      route: h
    };
    if (v.relativePath.startsWith("/")) {
      if (!v.relativePath.startsWith(o) && _)
        return;
      Pe(
        v.relativePath.startsWith(o),
        `Absolute route path "${v.relativePath}" nested under path "${o}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
      ), v.relativePath = v.relativePath.slice(o.length);
    }
    let g = jn([o, v.relativePath]), j = c.concat(v);
    h.children && h.children.length > 0 && (Pe(
      // Our types know better, but runtime JS may not!
      // @ts-expect-error
      h.index !== !0,
      `Index routes must not have child routes. Please remove all child routes from route path "${g}".`
    ), y_(
      h.children,
      i,
      j,
      g,
      _
    )), !(h.path == null && !h.index) && i.push({
      path: g,
      score: wx(g, h.index),
      routesMeta: j.map((w, S) => {
        let [E, N] = S_(
          w.relativePath,
          w.caseSensitive,
          S === j.length - 1
        );
        return {
          ...w,
          matcher: E,
          compiledParams: N
        };
      })
    });
  };
  return a.forEach((h, m) => {
    if (h.path === "" || !h.path?.includes("?"))
      f(h, m);
    else
      for (let _ of w_(h.path))
        f(h, m, !0, _);
  }), i;
}
function w_(a) {
  let i = a.split("/");
  if (i.length === 0) return [];
  let [c, ...o] = i, d = c.endsWith("?"), f = c.replace(/\?$/, "");
  if (o.length === 0)
    return d ? [f, ""] : [f];
  let h = w_(o.join("/")), m = [];
  return m.push(
    ...h.map(
      (_) => _ === "" ? f : [f, _].join("/")
    )
  ), d && m.push(...h), m.map(
    (_) => a.startsWith("/") && _ === "" ? "/" : _
  );
}
function px(a) {
  a.sort(
    (i, c) => i.score !== c.score ? c.score - i.score : jx(
      i.routesMeta.map((o) => o.childrenIndex),
      c.routesMeta.map((o) => o.childrenIndex)
    )
  );
}
var _x = /^:[\w-]+$/, bx = 3, gx = 2, vx = 1, xx = 10, yx = -2, $p = (a) => a === "*";
function wx(a, i) {
  let c = a.split("/"), o = c.length;
  return c.some($p) && (o += yx), i && (o += gx), c.filter((d) => !$p(d)).reduce(
    (d, f) => d + (_x.test(f) ? bx : f === "" ? vx : xx),
    o
  );
}
function jx(a, i) {
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
function Sx(a, i, c = !1) {
  let { routesMeta: o } = a, d = {}, f = "/", h = [];
  for (let m = 0; m < o.length; ++m) {
    let _ = o[m], b = m === o.length - 1, v = f === "/" ? i : i.slice(f.length) || "/", g = {
      path: _.relativePath,
      caseSensitive: _.caseSensitive,
      end: b
    }, j = (
      // Use precomputed matcher if it exists
      _.matcher && _.compiledParams ? j_(
        g,
        v,
        _.matcher,
        _.compiledParams
      ) : Yc(g, v)
    ), w = _.route;
    if (!j && b && c && !o[o.length - 1].route.index && (j = Yc(
      {
        path: _.relativePath,
        caseSensitive: _.caseSensitive,
        end: !1
      },
      v
    )), !j)
      return null;
    Object.assign(d, j.params), h.push({
      // TODO: Can this as be avoided?
      params: d,
      pathname: jn([f, j.pathname]),
      pathnameBase: Ex(
        jn([f, j.pathnameBase])
      ),
      route: w
    }), j.pathnameBase !== "/" && (f = jn([f, j.pathnameBase]));
  }
  return h;
}
function Yc(a, i) {
  typeof a == "string" && (a = { path: a, caseSensitive: !1, end: !0 });
  let [c, o] = S_(
    a.path,
    a.caseSensitive,
    a.end
  );
  return j_(a, i, c, o);
}
function j_(a, i, c, o) {
  let d = i.match(c);
  if (!d) return null;
  let f = d[0], h = f.replace(/(.)\/+$/, "$1"), m = d.slice(1);
  return {
    params: o.reduce(
      (b, { paramName: v, isOptional: g }, j) => {
        if (v === "*") {
          let S = m[j] || "";
          h = f.slice(0, f.length - S.length).replace(/(.)\/+$/, "$1");
        }
        const w = m[j];
        return g && !w ? b[v] = void 0 : b[v] = (w || "").replace(/%2F/g, "/"), b;
      },
      {}
    ),
    pathname: f,
    pathnameBase: h,
    pattern: a
  };
}
function S_(a, i = !1, c = !0) {
  tn(
    a === "*" || !a.endsWith("*") || a.endsWith("/*"),
    `Route path "${a}" will be treated as if it were "${a.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${a.replace(/\*$/, "/*")}".`
  );
  let o = [], d = "^" + a.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(
    /\/:([\w-]+)(\?)?/g,
    (h, m, _, b, v) => {
      if (o.push({ paramName: m, isOptional: _ != null }), _) {
        let g = v.charAt(b + h.length);
        return g && g !== "/" ? "/([^\\/]*)" : "(?:/([^\\/]*))?";
      }
      return "/([^\\/]+)";
    }
  ).replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
  return a.endsWith("*") ? (o.push({ paramName: "*" }), d += a === "*" || a === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$") : c ? d += "\\/*$" : a !== "" && a !== "/" && (d += "(?:(?=\\/|$))"), [new RegExp(d, i ? void 0 : "i"), o];
}
function kx(a) {
  try {
    return a.split("/").map((i) => decodeURIComponent(i).replace(/\//g, "%2F")).join("/");
  } catch (i) {
    return tn(
      !1,
      `The URL path "${a}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${i}).`
    ), a;
  }
}
function na(a, i) {
  if (i === "/") return a;
  if (!a.toLowerCase().startsWith(i.toLowerCase()))
    return null;
  let c = i.endsWith("/") ? i.length - 1 : i.length, o = a.charAt(c);
  return o && o !== "/" ? null : a.slice(c) || "/";
}
function Nx(a, i = "/") {
  let {
    pathname: c,
    search: o = "",
    hash: d = ""
  } = typeof a == "string" ? is(a) : a, f;
  return c ? (c = k_(c), c.startsWith("/") ? f = Up(c.substring(1), "/") : f = Up(c, i)) : f = i, {
    pathname: f,
    search: Mx(o),
    hash: Tx(d)
  };
}
function Up(a, i) {
  let c = qc(i).split("/");
  return a.split("/").forEach((d) => {
    d === ".." ? c.length > 1 && c.pop() : d !== "." && c.push(d);
  }), c.length > 1 ? c.join("/") : "/";
}
function zu(a, i, c, o) {
  return `Cannot include a '${a}' character in a manually specified \`to.${i}\` field [${JSON.stringify(
    o
  )}].  Please separate it out to the \`to.${c}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function Cx(a) {
  return a.filter(
    (i, c) => c === 0 || i.route.path && i.route.path.length > 0
  );
}
function sd(a) {
  let i = Cx(a);
  return i.map(
    (c, o) => o === i.length - 1 ? c.pathname : c.pathnameBase
  );
}
function Wc(a, i, c, o = !1) {
  let d;
  typeof a == "string" ? d = is(a) : (d = { ...a }, Pe(
    !d.pathname || !d.pathname.includes("?"),
    zu("?", "pathname", "search", d)
  ), Pe(
    !d.pathname || !d.pathname.includes("#"),
    zu("#", "pathname", "hash", d)
  ), Pe(
    !d.search || !d.search.includes("#"),
    zu("#", "search", "hash", d)
  ));
  let f = a === "" || d.pathname === "", h = f ? "/" : d.pathname, m;
  if (h == null)
    m = c;
  else {
    let g = i.length - 1;
    if (!o && h.startsWith("..")) {
      let j = h.split("/");
      for (; j[0] === ".."; )
        j.shift(), g -= 1;
      d.pathname = j.join("/");
    }
    m = g >= 0 ? i[g] : "/";
  }
  let _ = Nx(d, m), b = h && h !== "/" && h.endsWith("/"), v = (f || h === ".") && c.endsWith("/");
  return !_.pathname.endsWith("/") && (b || v) && (_.pathname += "/"), _;
}
var k_ = (a) => a.replace(/[\\/]{2,}/g, "/"), jn = (a) => k_(a.join("/")), qc = (a) => a.replace(/\/+$/, ""), Ex = (a) => qc(a).replace(/^\/*/, "/"), Mx = (a) => !a || a === "?" ? "" : a.startsWith("?") ? a : "?" + a, Tx = (a) => !a || a === "#" ? "" : a.startsWith("#") ? a : "#" + a, Ax = class {
  constructor(a, i, c, o = !1) {
    this.status = a, this.statusText = i || "", this.internal = o, c instanceof Error ? (this.data = c.toString(), this.error = c) : this.data = c;
  }
};
function Rx(a) {
  return a != null && typeof a.status == "number" && typeof a.statusText == "string" && typeof a.internal == "boolean" && "data" in a;
}
function Ox(a) {
  let i = a.map((c) => c.route.path).filter(Boolean);
  return jn(i) || "/";
}
var N_ = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
function C_(a, i) {
  let c = a;
  if (typeof c != "string" || !ad.test(c))
    return {
      absoluteURL: void 0,
      isExternal: !1,
      to: c
    };
  let o = c, d = !1;
  if (N_)
    try {
      let f = new URL(window.location.href), h = v_.test(c) ? new URL(rx(c, f.protocol)) : new URL(c), m = na(h.pathname, i);
      h.origin === f.origin && m != null ? c = m + h.search + h.hash : d = !0;
    } catch {
      tn(
        !1,
        `<Link to="${c}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`
      );
    }
  return {
    absoluteURL: o,
    isExternal: d,
    to: c
  };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
var E_ = [
  "POST",
  "PUT",
  "PATCH",
  "DELETE"
];
new Set(
  E_
);
var zx = [
  "GET",
  ...E_
];
new Set(zx);
var Dx = [
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
function Hx(a) {
  try {
    return Dx.includes(new URL(a).protocol);
  } catch {
    return !1;
  }
}
var el = y.createContext(null);
el.displayName = "DataRouter";
var Ic = y.createContext(null);
Ic.displayName = "DataRouterState";
var M_ = y.createContext(!1);
function Lx() {
  return y.useContext(M_);
}
var T_ = y.createContext({
  isTransitioning: !1
});
T_.displayName = "ViewTransition";
var $x = y.createContext(
  /* @__PURE__ */ new Map()
);
$x.displayName = "Fetchers";
var Ux = y.createContext(null);
Ux.displayName = "Await";
var nn = y.createContext(
  null
);
nn.displayName = "Navigation";
var si = y.createContext(
  null
);
si.displayName = "Location";
var zn = y.createContext({
  outlet: null,
  matches: [],
  isDataRoute: !1
});
zn.displayName = "Route";
var ld = y.createContext(null);
ld.displayName = "RouteError";
var A_ = "REACT_ROUTER_ERROR", Bx = "REDIRECT", Fx = "ROUTE_ERROR_RESPONSE";
function Gx(a) {
  if (a.startsWith(`${A_}:${Bx}:{`))
    try {
      let i = JSON.parse(a.slice(28));
      if (typeof i == "object" && i && typeof i.status == "number" && typeof i.statusText == "string" && typeof i.location == "string" && typeof i.reloadDocument == "boolean" && typeof i.replace == "boolean")
        return i;
    } catch {
    }
}
function Vx(a) {
  if (a.startsWith(
    `${A_}:${Fx}:{`
  ))
    try {
      let i = JSON.parse(a.slice(40));
      if (typeof i == "object" && i && typeof i.status == "number" && typeof i.statusText == "string")
        return new Ax(
          i.status,
          i.statusText,
          i.data
        );
    } catch {
    }
}
function Yx(a, { relative: i } = {}) {
  Pe(
    tl(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useHref() may be used only in the context of a <Router> component."
  );
  let { basename: c, navigator: o } = y.useContext(nn), { hash: d, pathname: f, search: h } = li(a, { relative: i }), m = f;
  return c !== "/" && (m = f === "/" ? c : jn([c, f])), o.createHref({ pathname: m, search: h, hash: d });
}
function tl() {
  return y.useContext(si) != null;
}
function At() {
  return Pe(
    tl(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useLocation() may be used only in the context of a <Router> component."
  ), y.useContext(si).location;
}
var R_ = "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function O_(a) {
  y.useContext(nn).static || y.useLayoutEffect(a);
}
function ht() {
  let { isDataRoute: a } = y.useContext(zn);
  return a ? a0() : qx();
}
function qx() {
  Pe(
    tl(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useNavigate() may be used only in the context of a <Router> component."
  );
  let a = y.useContext(el), { basename: i, navigator: c } = y.useContext(nn), { matches: o } = y.useContext(zn), { pathname: d } = At(), f = JSON.stringify(sd(o)), h = y.useRef(!1);
  return O_(() => {
    h.current = !0;
  }), y.useCallback(
    (_, b = {}) => {
      if (tn(h.current, R_), !h.current) return;
      if (typeof _ == "number") {
        c.go(_);
        return;
      }
      let v = Wc(
        _,
        JSON.parse(f),
        d,
        b.relative === "path"
      );
      a == null && i !== "/" && (v.pathname = v.pathname === "/" ? i : jn([i, v.pathname])), (b.replace ? c.replace : c.push)(
        v,
        b.state,
        b
      );
    },
    [
      i,
      c,
      f,
      d,
      a
    ]
  );
}
y.createContext(null);
function li(a, { relative: i } = {}) {
  let { matches: c } = y.useContext(zn), { pathname: o } = At(), d = JSON.stringify(sd(c));
  return y.useMemo(
    () => Wc(
      a,
      JSON.parse(d),
      o,
      i === "path"
    ),
    [a, d, o, i]
  );
}
function Xx(a, i) {
  return z_(a, i);
}
function z_(a, i, c) {
  Pe(
    tl(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useRoutes() may be used only in the context of a <Router> component."
  );
  let { navigator: o } = y.useContext(nn), { matches: d } = y.useContext(zn), f = d[d.length - 1], h = f ? f.params : {}, m = f ? f.pathname : "/", _ = f ? f.pathnameBase : "/", b = f && f.route;
  {
    let N = b && b.path || "";
    H_(
      m,
      !b || N.endsWith("*") || N.endsWith("*?"),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${m}" (under <Route path="${N}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${N}"> to <Route path="${N === "/" ? "*" : `${N}/*`}">.`
    );
  }
  let v = At(), g;
  if (i) {
    let N = typeof i == "string" ? is(i) : i;
    Pe(
      _ === "/" || N.pathname?.startsWith(_),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${_}" but pathname "${N.pathname}" was given in the \`location\` prop.`
    ), g = N;
  } else
    g = v;
  let j = g.pathname || "/", w = j;
  if (_ !== "/") {
    let N = _.replace(/^\//, "").split("/");
    w = "/" + j.replace(/^\//, "").split("/").slice(N.length).join("/");
  }
  let S = c && c.state.matches.length ? (
    // If we're in a data router, use the matches we've already identified but ensure
    // we have the latest route instances from the manifest in case elements have changed
    c.state.matches.map(
      (N) => Object.assign(N, {
        route: c.manifest[N.route.id] || N.route
      })
    )
  ) : x_(a, { pathname: w });
  tn(
    b || S != null,
    `No routes matched location "${g.pathname}${g.search}${g.hash}" `
  ), tn(
    S == null || S[S.length - 1].route.element !== void 0 || S[S.length - 1].route.Component !== void 0 || S[S.length - 1].route.lazy !== void 0,
    `Matched leaf route at location "${g.pathname}${g.search}${g.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`
  );
  let E = Px(
    S && S.map(
      (N) => Object.assign({}, N, {
        params: Object.assign({}, h, N.params),
        pathname: jn([
          _,
          // Re-encode pathnames that were decoded inside matchRoutes.
          // Pre-encode `%`, `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          o.encodeLocation ? o.encodeLocation(
            N.pathname.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : N.pathname
        ]),
        pathnameBase: N.pathnameBase === "/" ? _ : jn([
          _,
          // Re-encode pathnames that were decoded inside matchRoutes
          // Pre-encode `%`, `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          o.encodeLocation ? o.encodeLocation(
            N.pathnameBase.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : N.pathnameBase
        ])
      })
    ),
    d,
    c
  );
  return i && E ? /* @__PURE__ */ y.createElement(
    si.Provider,
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
    E
  ) : E;
}
function Qx() {
  let a = n0(), i = Rx(a) ? `${a.status} ${a.statusText}` : a instanceof Error ? a.message : JSON.stringify(a), c = a instanceof Error ? a.stack : null, o = "rgba(200,200,200, 0.5)", d = { padding: "0.5rem", backgroundColor: o }, f = { padding: "2px 4px", backgroundColor: o }, h = null;
  return console.error(
    "Error handled by React Router default ErrorBoundary:",
    a
  ), h = /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("p", null, "💿 Hey developer 👋"), /* @__PURE__ */ y.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /* @__PURE__ */ y.createElement("code", { style: f }, "ErrorBoundary"), " or", " ", /* @__PURE__ */ y.createElement("code", { style: f }, "errorElement"), " prop on your route.")), /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ y.createElement("h3", { style: { fontStyle: "italic" } }, i), c ? /* @__PURE__ */ y.createElement("pre", { style: d }, c) : null, h);
}
var Zx = /* @__PURE__ */ y.createElement(Qx, null), D_ = class extends y.Component {
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
      const c = Vx(a.digest);
      c && (a = c);
    }
    let i = a !== void 0 ? /* @__PURE__ */ y.createElement(zn.Provider, { value: this.props.routeContext }, /* @__PURE__ */ y.createElement(
      ld.Provider,
      {
        value: a,
        children: this.props.component
      }
    )) : this.props.children;
    return this.context ? /* @__PURE__ */ y.createElement(Kx, { error: a }, i) : i;
  }
};
D_.contextType = M_;
var Du = /* @__PURE__ */ new WeakMap();
function Kx({
  children: a,
  error: i
}) {
  let { basename: c } = y.useContext(nn);
  if (typeof i == "object" && i && "digest" in i && typeof i.digest == "string") {
    let o = Gx(i.digest);
    if (o) {
      let d = Du.get(i);
      if (d) throw d;
      let f = C_(o.location, c), h = f.absoluteURL || f.to;
      if (Hx(h))
        throw new Error("Invalid redirect location");
      if (N_ && !Du.get(i))
        if (f.isExternal || o.reloadDocument)
          window.location.href = h;
        else {
          const m = Promise.resolve().then(
            () => window.__reactRouterDataRouter.navigate(f.to, {
              replace: o.replace
            })
          );
          throw Du.set(i, m), m;
        }
      return /* @__PURE__ */ y.createElement("meta", { httpEquiv: "refresh", content: `0;url=${h}` });
    }
  }
  return a;
}
function Jx({ routeContext: a, match: i, children: c }) {
  let o = y.useContext(el);
  return o && o.static && o.staticContext && (i.route.errorElement || i.route.ErrorBoundary) && (o.staticContext._deepestRenderedBoundaryId = i.route.id), /* @__PURE__ */ y.createElement(zn.Provider, { value: a }, c);
}
function Px(a, i = [], c) {
  let o = c?.state;
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
  let d = a, f = o?.errors;
  if (f != null) {
    let v = d.findIndex(
      (g) => g.route.id && f?.[g.route.id] !== void 0
    );
    Pe(
      v >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(
        f
      ).join(",")}`
    ), d = d.slice(
      0,
      Math.min(d.length, v + 1)
    );
  }
  let h = !1, m = -1;
  if (c && o) {
    h = o.renderFallback;
    for (let v = 0; v < d.length; v++) {
      let g = d[v];
      if ((g.route.HydrateFallback || g.route.hydrateFallbackElement) && (m = v), g.route.id) {
        let { loaderData: j, errors: w } = o, S = g.route.loader && !j.hasOwnProperty(g.route.id) && (!w || w[g.route.id] === void 0);
        if (g.route.lazy || S) {
          c.isStatic && (h = !0), m >= 0 ? d = d.slice(0, m + 1) : d = [d[0]];
          break;
        }
      }
    }
  }
  let _ = c?.onError, b = o && _ ? (v, g) => {
    _(v, {
      location: o.location,
      params: o.matches?.[0]?.params ?? {},
      pattern: Ox(o.matches),
      errorInfo: g
    });
  } : void 0;
  return d.reduceRight(
    (v, g, j) => {
      let w, S = !1, E = null, N = null;
      o && (w = f && g.route.id ? f[g.route.id] : void 0, E = g.route.errorElement || Zx, h && (m < 0 && j === 0 ? (H_(
        "route-fallback",
        !1,
        "No `HydrateFallback` element provided to render during initial hydration"
      ), S = !0, N = null) : m === j && (S = !0, N = g.route.hydrateFallbackElement || null)));
      let C = i.concat(d.slice(0, j + 1)), O = () => {
        let B;
        return w ? B = E : S ? B = N : g.route.Component ? B = /* @__PURE__ */ y.createElement(g.route.Component, null) : g.route.element ? B = g.route.element : B = v, /* @__PURE__ */ y.createElement(
          Jx,
          {
            match: g,
            routeContext: {
              outlet: v,
              matches: C,
              isDataRoute: o != null
            },
            children: B
          }
        );
      };
      return o && (g.route.ErrorBoundary || g.route.errorElement || j === 0) ? /* @__PURE__ */ y.createElement(
        D_,
        {
          location: o.location,
          revalidation: o.revalidation,
          component: E,
          error: w,
          children: O(),
          routeContext: { outlet: null, matches: C, isDataRoute: !0 },
          onError: b
        }
      ) : O();
    },
    null
  );
}
function id(a) {
  return `${a} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function Wx(a) {
  let i = y.useContext(el);
  return Pe(i, id(a)), i;
}
function Ix(a) {
  let i = y.useContext(Ic);
  return Pe(i, id(a)), i;
}
function e0(a) {
  let i = y.useContext(zn);
  return Pe(i, id(a)), i;
}
function cd(a) {
  let i = e0(a), c = i.matches[i.matches.length - 1];
  return Pe(
    c.route.id,
    `${a} can only be used on routes that contain a unique "id"`
  ), c.route.id;
}
function t0() {
  return cd(
    "useRouteId"
    /* UseRouteId */
  );
}
function n0() {
  let a = y.useContext(ld), i = Ix(
    "useRouteError"
    /* UseRouteError */
  ), c = cd(
    "useRouteError"
    /* UseRouteError */
  );
  return a !== void 0 ? a : i.errors?.[c];
}
function a0() {
  let { router: a } = Wx(
    "useNavigate"
    /* UseNavigateStable */
  ), i = cd(
    "useNavigate"
    /* UseNavigateStable */
  ), c = y.useRef(!1);
  return O_(() => {
    c.current = !0;
  }), y.useCallback(
    async (d, f = {}) => {
      tn(c.current, R_), c.current && (typeof d == "number" ? await a.navigate(d) : await a.navigate(d, { fromRouteId: i, ...f }));
    },
    [a, i]
  );
}
var Bp = {};
function H_(a, i, c) {
  !i && !Bp[a] && (Bp[a] = !0, tn(!1, c));
}
y.memo(s0);
function s0({
  routes: a,
  manifest: i,
  future: c,
  state: o,
  isStatic: d,
  onError: f
}) {
  return z_(a, void 0, {
    manifest: i,
    state: o,
    isStatic: d,
    onError: f
  });
}
function ss({
  to: a,
  replace: i,
  state: c,
  relative: o
}) {
  Pe(
    tl(),
    // TODO: This error is probably because they somehow have 2 versions of
    // the router loaded. We can help them understand how to avoid that.
    "<Navigate> may be used only in the context of a <Router> component."
  );
  let { static: d } = y.useContext(nn);
  tn(
    !d,
    "<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change."
  );
  let { matches: f } = y.useContext(zn), { pathname: h } = At(), m = ht(), _ = Wc(
    a,
    sd(f),
    h,
    o === "path"
  ), b = JSON.stringify(_);
  return y.useEffect(() => {
    m(JSON.parse(b), { replace: i, state: c, relative: o });
  }, [m, b, o, i, c]), null;
}
function De(a) {
  Pe(
    !1,
    "A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>."
  );
}
function l0({
  basename: a = "/",
  children: i = null,
  location: c,
  navigationType: o = "POP",
  navigator: d,
  static: f = !1,
  useTransitions: h
}) {
  Pe(
    !tl(),
    "You cannot render a <Router> inside another <Router>. You should never have more than one in your app."
  );
  let m = a.replace(/^\/*/, "/"), _ = y.useMemo(
    () => ({
      basename: m,
      navigator: d,
      static: f,
      useTransitions: h,
      future: {}
    }),
    [m, d, f, h]
  );
  typeof c == "string" && (c = is(c));
  let {
    pathname: b = "/",
    search: v = "",
    hash: g = "",
    state: j = null,
    key: w = "default",
    mask: S
  } = c, E = y.useMemo(() => {
    let N = na(b, m);
    return N == null ? null : {
      location: {
        pathname: N,
        search: v,
        hash: g,
        state: j,
        key: w,
        mask: S
      },
      navigationType: o
    };
  }, [m, b, v, g, j, w, o, S]);
  return tn(
    E != null,
    `<Router basename="${m}"> is not able to match the URL "${b}${v}${g}" because it does not start with the basename, so the <Router> won't render anything.`
  ), E == null ? null : /* @__PURE__ */ y.createElement(nn.Provider, { value: _ }, /* @__PURE__ */ y.createElement(si.Provider, { children: i, value: E }));
}
function i0({
  children: a,
  location: i
}) {
  return Xx(Zu(a), i);
}
function Zu(a, i = []) {
  let c = [];
  return y.Children.forEach(a, (o, d) => {
    if (!y.isValidElement(o))
      return;
    let f = [...i, d];
    if (o.type === y.Fragment) {
      c.push.apply(
        c,
        Zu(o.props.children, f)
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
    let h = {
      id: o.props.id || f.join("-"),
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
    o.props.children && (h.children = Zu(
      o.props.children,
      f
    )), c.push(h);
  }), c;
}
var $c = "get", Uc = "application/x-www-form-urlencoded";
function er(a) {
  return typeof HTMLElement < "u" && a instanceof HTMLElement;
}
function c0(a) {
  return er(a) && a.tagName.toLowerCase() === "button";
}
function r0(a) {
  return er(a) && a.tagName.toLowerCase() === "form";
}
function o0(a) {
  return er(a) && a.tagName.toLowerCase() === "input";
}
function u0(a) {
  return !!(a.metaKey || a.altKey || a.ctrlKey || a.shiftKey);
}
function d0(a, i) {
  return a.button === 0 && // Ignore everything but left clicks
  (!i || i === "_self") && // Let browser handle "target=_blank" etc.
  !u0(a);
}
function Ku(a = "") {
  return new URLSearchParams(
    typeof a == "string" || Array.isArray(a) || a instanceof URLSearchParams ? a : Object.keys(a).reduce((i, c) => {
      let o = a[c];
      return i.concat(
        Array.isArray(o) ? o.map((d) => [c, d]) : [[c, o]]
      );
    }, [])
  );
}
function f0(a, i) {
  let c = Ku(a);
  return i && i.forEach((o, d) => {
    c.has(d) || i.getAll(d).forEach((f) => {
      c.append(d, f);
    });
  }), c;
}
var Cc = null;
function h0() {
  if (Cc === null)
    try {
      new FormData(
        document.createElement("form"),
        // @ts-expect-error if FormData supports the submitter parameter, this will throw
        0
      ), Cc = !1;
    } catch {
      Cc = !0;
    }
  return Cc;
}
var m0 = /* @__PURE__ */ new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
]);
function Hu(a) {
  return a != null && !m0.has(a) ? (tn(
    !1,
    `"${a}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${Uc}"`
  ), null) : a;
}
function p0(a, i) {
  let c, o, d, f, h;
  if (r0(a)) {
    let m = a.getAttribute("action");
    o = m ? na(m, i) : null, c = a.getAttribute("method") || $c, d = Hu(a.getAttribute("enctype")) || Uc, f = new FormData(a);
  } else if (c0(a) || o0(a) && (a.type === "submit" || a.type === "image")) {
    let m = a.form;
    if (m == null)
      throw new Error(
        'Cannot submit a <button> or <input type="submit"> without a <form>'
      );
    let _ = a.getAttribute("formaction") || m.getAttribute("action");
    if (o = _ ? na(_, i) : null, c = a.getAttribute("formmethod") || m.getAttribute("method") || $c, d = Hu(a.getAttribute("formenctype")) || Hu(m.getAttribute("enctype")) || Uc, f = new FormData(m, a), !h0()) {
      let { name: b, type: v, value: g } = a;
      if (v === "image") {
        let j = b ? `${b}.` : "";
        f.append(`${j}x`, "0"), f.append(`${j}y`, "0");
      } else b && f.append(b, g);
    }
  } else {
    if (er(a))
      throw new Error(
        'Cannot submit element that is not <form>, <button>, or <input type="submit|image">'
      );
    c = $c, o = null, d = Uc, h = a;
  }
  return f && d === "text/plain" && (h = f, f = void 0), { action: o, method: c.toLowerCase(), encType: d, formData: f, body: h };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function rd(a, i) {
  if (a === !1 || a === null || typeof a > "u")
    throw new Error(i);
}
function L_(a, i, c, o) {
  let d = typeof a == "string" ? new URL(
    a,
    // This can be called during the SSR flow via PrefetchPageLinksImpl so
    // don't assume window is available
    typeof window > "u" ? "server://singlefetch/" : window.location.origin
  ) : a;
  return c ? d.pathname.endsWith("/") ? d.pathname = `${d.pathname}_.${o}` : d.pathname = `${d.pathname}.${o}` : d.pathname === "/" ? d.pathname = `_root.${o}` : i && na(d.pathname, i) === "/" ? d.pathname = `${qc(i)}/_root.${o}` : d.pathname = `${qc(d.pathname)}.${o}`, d;
}
async function _0(a, i) {
  if (a.id in i)
    return i[a.id];
  try {
    let c = await import(
      /* @vite-ignore */
      /* webpackIgnore: true */
      a.module
    );
    return i[a.id] = c, c;
  } catch (c) {
    return console.error(
      `Error loading route module \`${a.module}\`, reloading page...`
    ), console.error(c), window.__reactRouterContext && window.__reactRouterContext.isSpaMode, window.location.reload(), new Promise(() => {
    });
  }
}
function b0(a) {
  return a == null ? !1 : a.href == null ? a.rel === "preload" && typeof a.imageSrcSet == "string" && typeof a.imageSizes == "string" : typeof a.rel == "string" && typeof a.href == "string";
}
async function g0(a, i, c) {
  let o = await Promise.all(
    a.map(async (d) => {
      let f = i.routes[d.route.id];
      if (f) {
        let h = await _0(f, c);
        return h.links ? h.links() : [];
      }
      return [];
    })
  );
  return w0(
    o.flat(1).filter(b0).filter((d) => d.rel === "stylesheet" || d.rel === "preload").map(
      (d) => d.rel === "stylesheet" ? { ...d, rel: "prefetch", as: "style" } : { ...d, rel: "prefetch" }
    )
  );
}
function Fp(a, i, c, o, d, f) {
  let h = (_, b) => c[b] ? _.route.id !== c[b].route.id : !0, m = (_, b) => (
    // param change, /users/123 -> /users/456
    c[b].pathname !== _.pathname || // splat param changed, which is not present in match.path
    // e.g. /files/images/avatar.jpg -> files/finances.xls
    c[b].route.path?.endsWith("*") && c[b].params["*"] !== _.params["*"]
  );
  return f === "assets" ? i.filter(
    (_, b) => h(_, b) || m(_, b)
  ) : f === "data" ? i.filter((_, b) => {
    let v = o.routes[_.route.id];
    if (!v || !v.hasLoader)
      return !1;
    if (h(_, b) || m(_, b))
      return !0;
    if (_.route.shouldRevalidate) {
      let g = _.route.shouldRevalidate({
        currentUrl: new URL(
          d.pathname + d.search + d.hash,
          window.origin
        ),
        currentParams: c[0]?.params || {},
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
function v0(a, i, { includeHydrateFallback: c } = {}) {
  return x0(
    a.map((o) => {
      let d = i.routes[o.route.id];
      if (!d) return [];
      let f = [d.module];
      return d.clientActionModule && (f = f.concat(d.clientActionModule)), d.clientLoaderModule && (f = f.concat(d.clientLoaderModule)), c && d.hydrateFallbackModule && (f = f.concat(d.hydrateFallbackModule)), d.imports && (f = f.concat(d.imports)), f;
    }).flat(1)
  );
}
function x0(a) {
  return [...new Set(a)];
}
function y0(a) {
  let i = {}, c = Object.keys(a).sort();
  for (let o of c)
    i[o] = a[o];
  return i;
}
function w0(a, i) {
  let c = /* @__PURE__ */ new Set();
  return new Set(i), a.reduce((o, d) => {
    let f = JSON.stringify(y0(d));
    return c.has(f) || (c.add(f), o.push({ key: f, link: d })), o;
  }, []);
}
function od() {
  let a = y.useContext(el);
  return rd(
    a,
    "You must render this element inside a <DataRouterContext.Provider> element"
  ), a;
}
function j0() {
  let a = y.useContext(Ic);
  return rd(
    a,
    "You must render this element inside a <DataRouterStateContext.Provider> element"
  ), a;
}
var ud = y.createContext(void 0);
ud.displayName = "FrameworkContext";
function tr() {
  let a = y.useContext(ud);
  return rd(
    a,
    "You must render this element inside a <HydratedRouter> element"
  ), a;
}
function S0(a, i) {
  let c = y.useContext(ud), [o, d] = y.useState(!1), [f, h] = y.useState(!1), { onFocus: m, onBlur: _, onMouseEnter: b, onMouseLeave: v, onTouchStart: g } = i, j = y.useRef(null);
  y.useEffect(() => {
    if (a === "render" && h(!0), a === "viewport") {
      let E = (C) => {
        C.forEach((O) => {
          h(O.isIntersecting);
        });
      }, N = new IntersectionObserver(E, { threshold: 0.5 });
      return j.current && N.observe(j.current), () => {
        N.disconnect();
      };
    }
  }, [a]), y.useEffect(() => {
    if (o) {
      let E = setTimeout(() => {
        h(!0);
      }, 100);
      return () => {
        clearTimeout(E);
      };
    }
  }, [o]);
  let w = () => {
    d(!0);
  }, S = () => {
    d(!1), h(!1);
  };
  return c ? a !== "intent" ? [f, j, {}] : [
    f,
    j,
    {
      onFocus: ei(m, w),
      onBlur: ei(_, S),
      onMouseEnter: ei(b, w),
      onMouseLeave: ei(v, S),
      onTouchStart: ei(g, w)
    }
  ] : [!1, j, {}];
}
function ei(a, i) {
  return (c) => {
    a && a(c), c.defaultPrevented || i(c);
  };
}
function k0({ page: a, ...i }) {
  let c = Lx(), { nonce: o } = tr(), { router: d } = od(), f = y.useMemo(
    () => x_(d.routes, a, d.basename),
    [d.routes, a, d.basename]
  );
  return f ? (i.nonce == null && o && (i = { ...i, nonce: o }), c ? /* @__PURE__ */ y.createElement(C0, { page: a, matches: f, ...i }) : /* @__PURE__ */ y.createElement(E0, { page: a, matches: f, ...i })) : null;
}
function N0(a) {
  let { manifest: i, routeModules: c } = tr(), [o, d] = y.useState([]);
  return y.useEffect(() => {
    let f = !1;
    return g0(a, i, c).then(
      (h) => {
        f || d(h);
      }
    ), () => {
      f = !0;
    };
  }, [a, i, c]), o;
}
function C0({
  page: a,
  matches: i,
  ...c
}) {
  let o = At(), { future: d } = tr(), { basename: f } = od(), h = y.useMemo(() => {
    if (a === o.pathname + o.search + o.hash)
      return [];
    let m = L_(
      a,
      f,
      d.v8_trailingSlashAwareDataRequests,
      "rsc"
    ), _ = !1, b = [];
    for (let v of i)
      typeof v.route.shouldRevalidate == "function" ? _ = !0 : b.push(v.route.id);
    return _ && b.length > 0 && m.searchParams.set("_routes", b.join(",")), [m.pathname + m.search];
  }, [
    f,
    d.v8_trailingSlashAwareDataRequests,
    a,
    o,
    i
  ]);
  return /* @__PURE__ */ y.createElement(y.Fragment, null, h.map((m) => /* @__PURE__ */ y.createElement("link", { key: m, rel: "prefetch", as: "fetch", href: m, ...c })));
}
function E0({
  page: a,
  matches: i,
  ...c
}) {
  let o = At(), { future: d, manifest: f, routeModules: h } = tr(), { basename: m } = od(), { loaderData: _, matches: b } = j0(), v = y.useMemo(
    () => Fp(
      a,
      i,
      b,
      f,
      o,
      "data"
    ),
    [a, i, b, f, o]
  ), g = y.useMemo(
    () => Fp(
      a,
      i,
      b,
      f,
      o,
      "assets"
    ),
    [a, i, b, f, o]
  ), j = y.useMemo(() => {
    if (a === o.pathname + o.search + o.hash)
      return [];
    let E = /* @__PURE__ */ new Set(), N = !1;
    if (i.forEach((O) => {
      let B = f.routes[O.route.id];
      !B || !B.hasLoader || (!v.some((J) => J.route.id === O.route.id) && O.route.id in _ && h[O.route.id]?.shouldRevalidate || B.hasClientLoader ? N = !0 : E.add(O.route.id));
    }), E.size === 0)
      return [];
    let C = L_(
      a,
      m,
      d.v8_trailingSlashAwareDataRequests,
      "data"
    );
    return N && E.size > 0 && C.searchParams.set(
      "_routes",
      i.filter((O) => E.has(O.route.id)).map((O) => O.route.id).join(",")
    ), [C.pathname + C.search];
  }, [
    m,
    d.v8_trailingSlashAwareDataRequests,
    _,
    o,
    f,
    v,
    i,
    a,
    h
  ]), w = y.useMemo(
    () => v0(g, f),
    [g, f]
  ), S = N0(g);
  return /* @__PURE__ */ y.createElement(y.Fragment, null, j.map((E) => /* @__PURE__ */ y.createElement("link", { key: E, rel: "prefetch", as: "fetch", href: E, ...c })), w.map((E) => /* @__PURE__ */ y.createElement("link", { key: E, rel: "modulepreload", href: E, ...c })), S.map(({ key: E, link: N }) => (
    // these don't spread `linkProps` because they are full link descriptors
    // already with their own props
    /* @__PURE__ */ y.createElement(
      "link",
      {
        key: E,
        nonce: c.nonce,
        ...N,
        crossOrigin: N.crossOrigin ?? c.crossOrigin
      }
    )
  )));
}
function M0(...a) {
  return (i) => {
    a.forEach((c) => {
      typeof c == "function" ? c(i) : c != null && (c.current = i);
    });
  };
}
var T0 = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
try {
  T0 && (window.__reactRouterVersion = // @ts-expect-error
  "7.18.2");
} catch {
}
function A0({
  basename: a,
  children: i,
  useTransitions: c,
  window: o
}) {
  let d = y.useRef();
  d.current == null && (d.current = ox({ window: o, v5Compat: !0 }));
  let f = d.current, [h, m] = y.useState({
    action: f.action,
    location: f.location
  }), _ = y.useCallback(
    (b) => {
      c === !1 ? m(b) : y.startTransition(() => m(b));
    },
    [c]
  );
  return y.useLayoutEffect(() => f.listen(_), [f, _]), /* @__PURE__ */ y.createElement(
    l0,
    {
      basename: a,
      children: i,
      location: h.location,
      navigationType: h.action,
      navigator: f,
      useTransitions: c
    }
  );
}
var ai = y.forwardRef(
  function({
    onClick: i,
    discover: c = "render",
    prefetch: o = "none",
    relative: d,
    reloadDocument: f,
    replace: h,
    mask: m,
    state: _,
    target: b,
    to: v,
    preventScrollReset: g,
    viewTransition: j,
    defaultShouldRevalidate: w,
    ...S
  }, E) {
    let { basename: N, navigator: C, useTransitions: O } = y.useContext(nn), B = typeof v == "string" && ad.test(v), J = C_(v, N);
    v = J.to;
    let P = Yx(v, { relative: d }), G = At(), X = null;
    if (m) {
      let A = Wc(
        m,
        [],
        G.mask ? G.mask.pathname : "/",
        !0
      );
      N !== "/" && (A.pathname = A.pathname === "/" ? N : jn([N, A.pathname])), X = C.createHref(A);
    }
    let [W, se, ue] = S0(
      o,
      S
    ), de = z0(v, {
      replace: h,
      mask: m,
      state: _,
      target: b,
      preventScrollReset: g,
      relative: d,
      viewTransition: j,
      defaultShouldRevalidate: w,
      useTransitions: O
    });
    function Y(A) {
      i && i(A), A.defaultPrevented || de(A);
    }
    let ie = !(J.isExternal || f), te = (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      /* @__PURE__ */ y.createElement(
        "a",
        {
          ...S,
          ...ue,
          href: (ie ? X : void 0) || J.absoluteURL || P,
          onClick: ie ? Y : i,
          ref: M0(E, se),
          target: b,
          "data-discover": !B && c === "render" ? "true" : void 0
        }
      )
    );
    return W && !B ? /* @__PURE__ */ y.createElement(y.Fragment, null, te, /* @__PURE__ */ y.createElement(k0, { page: P })) : te;
  }
);
ai.displayName = "Link";
var Bc = y.forwardRef(
  function({
    "aria-current": i = "page",
    caseSensitive: c = !1,
    className: o = "",
    end: d = !1,
    style: f,
    to: h,
    viewTransition: m,
    children: _,
    ...b
  }, v) {
    let g = li(h, { relative: b.relative }), j = At(), w = y.useContext(Ic), { navigator: S, basename: E } = y.useContext(nn), N = w != null && // Conditional usage is OK here because the usage of a data router is static
    // eslint-disable-next-line react-hooks/rules-of-hooks
    U0(g) && m === !0, C = S.encodeLocation ? S.encodeLocation(g).pathname : g.pathname, O = j.pathname, B = w && w.navigation && w.navigation.location ? w.navigation.location.pathname : null;
    c || (O = O.toLowerCase(), B = B ? B.toLowerCase() : null, C = C.toLowerCase()), B && E && (B = na(B, E) || B);
    const J = C !== "/" && C.endsWith("/") ? C.length - 1 : C.length;
    let P = O === C || !d && O.startsWith(C) && O.charAt(J) === "/", G = B != null && (B === C || !d && B.startsWith(C) && B.charAt(C.length) === "/"), X = {
      isActive: P,
      isPending: G,
      isTransitioning: N
    }, W = P ? i : void 0, se;
    typeof o == "function" ? se = o(X) : se = [
      o,
      P ? "active" : null,
      G ? "pending" : null,
      N ? "transitioning" : null
    ].filter(Boolean).join(" ");
    let ue = typeof f == "function" ? f(X) : f;
    return /* @__PURE__ */ y.createElement(
      ai,
      {
        ...b,
        "aria-current": W,
        className: se,
        ref: v,
        style: ue,
        to: h,
        viewTransition: m
      },
      typeof _ == "function" ? _(X) : _
    );
  }
);
Bc.displayName = "NavLink";
var R0 = y.forwardRef(
  ({
    discover: a = "render",
    fetcherKey: i,
    navigate: c,
    reloadDocument: o,
    replace: d,
    state: f,
    method: h = $c,
    action: m,
    onSubmit: _,
    relative: b,
    preventScrollReset: v,
    viewTransition: g,
    defaultShouldRevalidate: j,
    ...w
  }, S) => {
    let { useTransitions: E } = y.useContext(nn), N = L0(), C = $0(m, { relative: b }), O = h.toLowerCase() === "get" ? "get" : "post", B = typeof m == "string" && ad.test(m), J = (P) => {
      if (_ && _(P), P.defaultPrevented) return;
      P.preventDefault();
      let G = P.nativeEvent.submitter, X = G?.getAttribute("formmethod") || h, W = () => N(G || P.currentTarget, {
        fetcherKey: i,
        method: X,
        navigate: c,
        replace: d,
        state: f,
        relative: b,
        preventScrollReset: v,
        viewTransition: g,
        defaultShouldRevalidate: j
      });
      E && c !== !1 ? y.startTransition(() => W()) : W();
    };
    return /* @__PURE__ */ y.createElement(
      "form",
      {
        ref: S,
        method: O,
        action: C,
        onSubmit: o ? _ : J,
        ...w,
        "data-discover": !B && a === "render" ? "true" : void 0
      }
    );
  }
);
R0.displayName = "Form";
function O0(a) {
  return `${a} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function $_(a) {
  let i = y.useContext(el);
  return Pe(i, O0(a)), i;
}
function z0(a, {
  target: i,
  replace: c,
  mask: o,
  state: d,
  preventScrollReset: f,
  relative: h,
  viewTransition: m,
  defaultShouldRevalidate: _,
  useTransitions: b
} = {}) {
  let v = ht(), g = At(), j = li(a, { relative: h });
  return y.useCallback(
    (w) => {
      if (d0(w, i)) {
        w.preventDefault();
        let S = c !== void 0 ? c : ni(g) === ni(j), E = () => v(a, {
          replace: S,
          mask: o,
          state: d,
          preventScrollReset: f,
          relative: h,
          viewTransition: m,
          defaultShouldRevalidate: _
        });
        b ? y.startTransition(() => E()) : E();
      }
    },
    [
      g,
      v,
      j,
      c,
      o,
      d,
      i,
      a,
      f,
      h,
      m,
      _,
      b
    ]
  );
}
function nr(a) {
  tn(
    typeof URLSearchParams < "u",
    "You cannot use the `useSearchParams` hook in a browser that does not support the URLSearchParams API. If you need to support Internet Explorer 11, we recommend you load a polyfill such as https://github.com/ungap/url-search-params."
  );
  let i = y.useRef(Ku(a)), c = y.useRef(!1), o = At(), d = y.useMemo(
    () => (
      // Only merge in the defaults if we haven't yet called setSearchParams.
      // Once we call that we want those to take precedence, otherwise you can't
      // remove a param with setSearchParams({}) if it has an initial value
      f0(
        o.search,
        c.current ? null : i.current
      )
    ),
    [o.search]
  ), f = ht(), h = y.useCallback(
    (m, _) => {
      const b = Ku(
        typeof m == "function" ? m(new URLSearchParams(d)) : m
      );
      c.current = !0, f("?" + b, _);
    },
    [f, d]
  );
  return [d, h];
}
var D0 = 0, H0 = () => `__${String(++D0)}__`;
function L0() {
  let { router: a } = $_(
    "useSubmit"
    /* UseSubmit */
  ), { basename: i } = y.useContext(nn), c = t0(), o = a.fetch, d = a.navigate;
  return y.useCallback(
    async (f, h = {}) => {
      let { action: m, method: _, encType: b, formData: v, body: g } = p0(
        f,
        i
      );
      if (h.navigate === !1) {
        let j = h.fetcherKey || H0();
        await o(j, c, h.action || m, {
          defaultShouldRevalidate: h.defaultShouldRevalidate,
          preventScrollReset: h.preventScrollReset,
          formData: v,
          body: g,
          formMethod: h.method || _,
          formEncType: h.encType || b,
          flushSync: h.flushSync
        });
      } else
        await d(h.action || m, {
          defaultShouldRevalidate: h.defaultShouldRevalidate,
          preventScrollReset: h.preventScrollReset,
          formData: v,
          body: g,
          formMethod: h.method || _,
          formEncType: h.encType || b,
          replace: h.replace,
          state: h.state,
          fromRouteId: c,
          flushSync: h.flushSync,
          viewTransition: h.viewTransition
        });
    },
    [o, d, i, c]
  );
}
function $0(a, { relative: i } = {}) {
  let { basename: c } = y.useContext(nn), o = y.useContext(zn);
  Pe(o, "useFormAction must be used inside a RouteContext");
  let [d] = o.matches.slice(-1), f = { ...li(a || ".", { relative: i }) }, h = At();
  if (a == null) {
    f.search = h.search;
    let m = new URLSearchParams(f.search), _ = m.getAll("index");
    if (_.some((v) => v === "")) {
      m.delete("index"), _.filter((g) => g).forEach((g) => m.append("index", g));
      let v = m.toString();
      f.search = v ? `?${v}` : "";
    }
  }
  return (!a || a === ".") && d.route.index && (f.search = f.search ? f.search.replace(/^\?/, "?index&") : "?index"), c !== "/" && (f.pathname = f.pathname === "/" ? c : jn([c, f.pathname])), ni(f);
}
function U0(a, { relative: i } = {}) {
  let c = y.useContext(T_);
  Pe(
    c != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?"
  );
  let { basename: o } = $_(
    "useViewTransitionState"
    /* useViewTransitionState */
  ), d = li(a, { relative: i });
  if (!c.isTransitioning)
    return !1;
  let f = na(c.currentLocation.pathname, o) || c.currentLocation.pathname, h = na(c.nextLocation.pathname, o) || c.nextLocation.pathname;
  return Yc(d.pathname, h) != null || Yc(d.pathname, f) != null;
}
const B0 = {
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
function F0(a) {
  return B0[a];
}
const U_ = y.createContext(null), G0 = /* @__PURE__ */ new Set([
  "input_boolean",
  "input_number",
  "input_select",
  "input_text",
  "input_datetime",
  "input_button"
]);
function V0(a) {
  if (!a) return !1;
  const i = a.toLowerCase(), c = i.indexOf("."), o = c >= 0 ? i.slice(0, c) : "", d = c >= 0 ? i.slice(c + 1) : i;
  return d.startsWith("dsc_") || d.startsWith("dsc-") || d.includes("_dsc_") || i.includes("dsc_") || i.includes("dsc-") ? !0 : G0.has(o) ? d.startsWith("dsc_") || d.includes("dsc_") : i.startsWith("sensor.dsc") || i.startsWith("switch.dsc") || i.startsWith("binary_sensor.dsc") || i.startsWith("number.dsc") || i.startsWith("light.dsc") || i.startsWith("fan.dsc") || i.startsWith("select.dsc") || i.startsWith("text.dsc") || i.startsWith("datetime.dsc") || i.startsWith("time.dsc");
}
const Y0 = 150;
function q0({
  hass: a,
  revision: i = 0,
  children: c
}) {
  const [o, d] = y.useState(0), f = y.useRef(null), h = y.useRef(a);
  h.current = a;
  const m = a?.connection, _ = !!a, b = () => {
    f.current || (f.current = setTimeout(() => {
      f.current = null, d((w) => w + 1);
    }, Y0));
  };
  y.useEffect(() => {
    _ && b();
  }, [_]), y.useEffect(() => {
    i > 0 && b();
  }, [i]), y.useEffect(() => {
    if (!m?.subscribeEvents) return;
    let w, S = !1;
    const E = (N) => {
      const C = N.data?.entity_id;
      V0(C) && b();
    };
    return Promise.resolve(m.subscribeEvents(E, "state_changed")).then((N) => {
      if (S) {
        N();
        return;
      }
      w = N;
    }).catch(() => {
    }), () => {
      S = !0, w?.(), f.current && (clearTimeout(f.current), f.current = null);
    };
  }, [m]);
  const v = y.useMemo(
    () => (w, S, E) => {
      const N = h.current;
      return N?.callService ? N.callService(w, S, E) : Promise.resolve(null);
    },
    []
  ), g = y.useMemo(
    () => (w) => {
      const S = h.current;
      if (S?.callWS) return S.callWS(w);
      const E = S?.connection;
      return E?.sendMessagePromise ? E.sendMessagePromise(w) : Promise.resolve(null);
    },
    []
  ), j = y.useMemo(() => {
    const w = (C) => h.current?.states?.[C], S = (C) => {
      const O = w(C)?.state;
      return O === void 0 ? !1 : O !== "unavailable" && O !== "unknown";
    }, E = (C, O = "—") => S(C) ? w(C)?.state ?? O : O, N = (C, O = NaN) => {
      if (!S(C)) return O;
      const B = Number(w(C)?.state);
      return Number.isFinite(B) ? B : O;
    };
    return { hass: h.current, entity: w, state: E, num: N, available: S, callService: v, callWS: g, tick: o };
  }, [o, v, g]);
  return y.createElement(U_.Provider, { value: j }, c);
}
function ii() {
  const a = y.useContext(U_);
  if (!a) throw new Error("useHass outside HassProvider");
  return a;
}
const Ju = (a) => ({
  seat_id: a,
  online: !1,
  firmware: null,
  values: {},
  last_seen: null
}), Oa = {
  version: "7.0.0.0",
  surface: "7.0.0",
  expected_firmware: "7.0.0.0",
  hub: Ju("hub"),
  panel: Ju("panel"),
  pots: {},
  sonoffs: {},
  canopy: {},
  system: {},
  updated_at: 0
};
function Ec(a, i) {
  if (!a || typeof a != "object") return Ju(i);
  const c = a;
  return {
    seat_id: String(c.seat_id ?? i),
    online: !!c.online,
    firmware: c.firmware != null ? String(c.firmware) : null,
    values: c.values ?? {},
    last_seen: typeof c.last_seen == "number" ? c.last_seen : null
  };
}
function B_(a) {
  if (!a) return { ...Oa };
  const i = {}, c = a.pots;
  if (c)
    for (const [h, m] of Object.entries(c))
      i[h] = Ec(m, h);
  const o = {}, d = a.sonoffs;
  if (d)
    for (const [h, m] of Object.entries(d))
      o[h] = Ec(m, h);
  const f = Array.isArray(a.inventory) ? a.inventory : void 0;
  return {
    version: String(a.version ?? Oa.version),
    surface: String(a.surface ?? Oa.surface),
    expected_firmware: String(a.expected_firmware ?? Oa.expected_firmware),
    hub: Ec(a.hub, "hub"),
    panel: Ec(a.panel, "panel"),
    pots: i,
    sonoffs: o,
    canopy: a.canopy ?? {},
    system: a.system ?? {},
    updated_at: typeof a.updated_at == "number" ? a.updated_at : 0,
    inventory: f
  };
}
function X0(a) {
  const i = a.hub.values;
  return {
    temp_c: i.temp_c != null ? Number(i.temp_c) : null,
    rh_pct: i.rh_pct != null ? Number(i.rh_pct) : null,
    vpd_kpa: i.vpd_kpa != null ? Number(i.vpd_kpa) : i.vd_kpa != null ? Number(i.vd_kpa) : null,
    heartbeat: i.heartbeat ?? null,
    uptime: i.uptime ?? null
  };
}
function Q0(a, i) {
  const c = a.hub.values;
  return i === "clone" ? {
    temp_c: c.clone_temp_c != null ? Number(c.clone_temp_c) : null,
    rh_pct: c.clone_rh_pct != null ? Number(c.clone_rh_pct) : null,
    vpd_kpa: c.clone_vpd_kpa != null ? Number(c.clone_vpd_kpa) : c.clone_vd_kpa != null ? Number(c.clone_vd_kpa) : null
  } : {
    temp_c: c.temp_c != null ? Number(c.temp_c) : null,
    rh_pct: c.rh_pct != null ? Number(c.rh_pct) : null,
    vpd_kpa: c.vpd_kpa != null ? Number(c.vpd_kpa) : c.vd_kpa != null ? Number(c.vd_kpa) : null
  };
}
function Mc(a, i, c = !0) {
  const o = a.inventory?.find((d) => d.seat_id === i);
  return o && o.in_service != null ? !!o.in_service : i === "ac" || i === "mister" || i === "tank" || i === "pot3" ? !1 : c;
}
const Z0 = {
  ac: "input_boolean.dsc_ac_in_service",
  mister: "input_boolean.dsc_clone_humidifier_in_service",
  pot1: "input_boolean.dsc_pot1_in_service",
  pot2: "input_boolean.dsc_pot2_in_service",
  pot3: "input_boolean.dsc_pot3_in_service",
  pot4: "input_boolean.dsc_pot4_in_service",
  tank: "input_boolean.dsc_tank_in_service"
}, K0 = {
  heater: "sensor.dsc_heater_firmware_version",
  heatmat: "sensor.dsc_heatmat_firmware_version",
  humidifier: "sensor.dsc_humidifier_firmware_version",
  dehumidifier: "sensor.dsc_dehumidifier_firmware_version"
};
function zt(a, i) {
  return a.states[i]?.state ?? "unavailable";
}
function Mt(a, i) {
  const c = a.states[i]?.state;
  return c != null && c !== "unavailable" && c !== "unknown";
}
function pn(a, i) {
  const c = Number(zt(a, i));
  return Number.isFinite(c) ? c : null;
}
function J0(a, i) {
  if (!a) return { ...Oa, inventory: i };
  const o = Mt(a, "binary_sensor.dsc_hub_link") && zt(a, "binary_sensor.dsc_hub_link") === "on", d = {
    seat_id: "hub",
    online: o,
    firmware: Mt(a, "sensor.dsc_hub_firmware_version") ? zt(a, "sensor.dsc_hub_firmware_version") : null,
    values: {
      temp_c: pn(a, "sensor.dsc_hub_tent_temperature") ?? pn(a, "sensor.dsc_hub_temperature"),
      rh_pct: pn(a, "sensor.dsc_hub_tent_humidity") ?? pn(a, "sensor.dsc_hub_humidity"),
      vpd_kpa: pn(a, "sensor.dsc_hub_vpd_kpa") ?? pn(a, "sensor.dsc_hub_vpd"),
      heartbeat: Mt(a, "sensor.dsc_hub_heartbeat") ? zt(a, "sensor.dsc_hub_heartbeat") : null,
      uptime: Mt(a, "sensor.dsc_hub_uptime") ? zt(a, "sensor.dsc_hub_uptime") : null
    },
    last_seen: o ? Date.now() / 1e3 : null
  }, f = Mt(a, "binary_sensor.dsc_hub_panel_link") && zt(a, "binary_sensor.dsc_hub_panel_link") === "on", h = {
    seat_id: "panel",
    online: f,
    firmware: Mt(a, "sensor.dsc_control_firmware_version") ? zt(a, "sensor.dsc_control_firmware_version") : null,
    values: {},
    last_seen: f ? Date.now() / 1e3 : null
  }, m = {};
  for (const j of [1, 2, 3, 4]) {
    const w = `pot${j}`, S = `sensor.dsc_pot${j}_firmware_version`, E = Mt(a, S);
    m[w] = {
      seat_id: w,
      online: E,
      firmware: E ? zt(a, S) : null,
      values: {
        moisture_pct: pn(a, `sensor.dsc_pot${j}_soil_moisture`),
        soil_temp_c: pn(a, `sensor.dsc_pot${j}_soil_temperature`),
        ec_us: pn(a, `sensor.dsc_pot${j}_soil_ec`),
        ph: pn(a, `sensor.dsc_pot${j}_soil_ph`)
      },
      last_seen: E ? Date.now() / 1e3 : null
    };
  }
  const _ = {}, b = {
    heater: "switch.dsc_heater_main_relay",
    heatmat: "switch.dsc_heatmat_main_relay",
    humidifier: "switch.dsc_humidifier_main_relay",
    dehumidifier: "switch.dsc_de_humidifier_main_relay"
  };
  for (const [j, w] of Object.entries(b)) {
    const S = K0[j], E = Mt(a, w) || Mt(a, S);
    _[j] = {
      seat_id: j,
      online: E,
      firmware: S && Mt(a, S) ? zt(a, S) : null,
      values: {
        relay_on: Mt(a, w) ? zt(a, w) === "on" : null
      },
      last_seen: E ? Date.now() / 1e3 : null
    };
  }
  const v = i ?? Object.entries(Z0).map(([j, w]) => ({
    seat_id: j,
    in_service: Mt(a, w) ? zt(a, w) === "on" : j.startsWith("pot") && j !== "pot3"
  })), g = {};
  return Mt(a, "sensor.dsc_canopy_temperature") && (g.temp_c = pn(a, "sensor.dsc_canopy_temperature")), Mt(a, "sensor.dsc_canopy_humidity") && (g.rh_pct = pn(a, "sensor.dsc_canopy_humidity")), {
    version: zt(a, "sensor.dsc_fleet_version_status") || Oa.version,
    surface: zt(a, "sensor.dsc_ha_surface_version") || Oa.surface,
    expected_firmware: Oa.expected_firmware,
    hub: d,
    panel: h,
    pots: m,
    sonoffs: _,
    canopy: g,
    system: {
      appliance_link: Mt(a, "binary_sensor.dsc_pi_appliance_link") && zt(a, "binary_sensor.dsc_pi_appliance_link") === "on",
      reduced_kit: Mt(a, "binary_sensor.dsc_reduced_kit") && zt(a, "binary_sensor.dsc_reduced_kit") === "on"
    },
    updated_at: Date.now() / 1e3,
    inventory: v
  };
}
const F_ = y.createContext(null);
function P0({
  children: a,
  fleetRaw: i,
  hass: c,
  tick: o = 0,
  source: d,
  loading: f = !1,
  error: h = null,
  refresh: m,
  inventory: _
}) {
  const b = y.useMemo(() => {
    if (d === "pi" && i) {
      const g = B_(i);
      return Array.isArray(i?.inventory) ? { ...g, inventory: i.inventory } : _?.length ? { ...g, inventory: _ } : g;
    }
    return J0(c ?? null, _);
  }, [d, i, c, _, o]), v = y.useMemo(
    () => ({ fleet: b, tick: o, source: d, loading: f, error: h, refresh: m }),
    [b, o, d, f, h, m]
  );
  return /* @__PURE__ */ l.jsx(F_.Provider, { value: v, children: a });
}
function dd() {
  const a = y.useContext(F_);
  if (!a) throw new Error("useFleet outside FleetProvider");
  return a;
}
function kt() {
  return dd().fleet;
}
function W0() {
  return dd().tick;
}
function sa() {
  return dd().source;
}
function G_() {
  const a = kt();
  return { ...X0(a), online: a.hub.online };
}
function I0(a) {
  const i = kt();
  return { ...Q0(i, a), online: i.hub.online };
}
function fd(a) {
  const i = a.hub.values.controls;
  if (!(!i || typeof i != "object"))
    return i;
}
function Fc(a, i) {
  return i.hub.online ? fd(i)?.[a]?.state ?? null : null;
}
function V_(a, i) {
  return i.hub.online && !!fd(i)?.[a];
}
function Y_(a, i) {
  const c = fd(i)?.[a];
  if (!c) return {};
  const o = {};
  return c.options?.length && (o.options = c.options), c.percentage != null && (o.percentage = c.percentage), c.brightness != null && (o.brightness = c.brightness), o;
}
const q_ = {
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
function ey(a, i) {
  return i === "hub" ? a.hub.values : i === "panel" ? a.panel.values : i.startsWith("pot") ? a.pots[i]?.values : a.sonoffs[i]?.values;
}
function Xc(a, i) {
  const c = q_[a];
  if (!c) return null;
  const o = ey(i, c.seatId);
  if (!o) return null;
  const d = o[c.metric];
  if (d == null) return null;
  if (c.binary) return d === !0 || d === "on" || d === 1 || d === "1" ? 1 : 0;
  const f = Number(d);
  return Number.isFinite(f) ? f : null;
}
function hd(a, i) {
  const c = q_[a];
  return c ? c.seatId === "hub" ? i.hub.online : c.seatId === "panel" ? i.panel.online : c.seatId.startsWith("pot") ? !!i.pots[c.seatId]?.online : !!i.sonoffs[c.seatId]?.online : !1;
}
function ty(a) {
  return !a.hub.online;
}
function Ce() {
  const a = ii(), i = kt(), c = sa();
  return y.useMemo(() => c !== "pi" ? a : { ...a, entity: (m) => {
    const _ = a.entity(m), b = Fc(m, i);
    return b != null ? {
      entity_id: m,
      state: b,
      attributes: Y_(m, i),
      last_changed: (/* @__PURE__ */ new Date()).toISOString()
    } : _;
  }, available: (m) => V_(m, i) || hd(m, i) ? !0 : a.available(m), state: (m, _ = "—") => {
    const b = Fc(m, i);
    if (b != null) return b;
    const v = Xc(m, i);
    return v != null && Number.isFinite(v) ? String(v) : a.state(m, _);
  }, num: (m, _ = NaN) => {
    const b = Fc(m, i);
    if (b != null) {
      const g = Number(b);
      if (Number.isFinite(g)) return g;
    }
    const v = Xc(m, i);
    return v != null && Number.isFinite(v) ? v : a.num(m, _);
  } }, [a, i, c]);
}
async function ny(a, i = 6) {
  const c = await fetch(`/history?entity_id=${encodeURIComponent(a)}&hours=${i}`);
  return c.ok ? (await c.json()).points ?? [] : [];
}
async function ay(a = 24, i = 100) {
  const c = await fetch(`/grow-log?hours=${a}&limit=${i}`);
  return c.ok ? (await c.json()).events ?? [] : [];
}
async function sy(a, i, c = {}) {
  const o = await fetch("/control/service", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain: a, service: i, data: c })
  });
  if (!o.ok) {
    const d = await o.text();
    throw new Error(d || "service call failed");
  }
  return o.json();
}
async function ly(a, i) {
  const c = await fetch("/control/demand", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ seat: a, on: i })
  });
  if (!c.ok) {
    const o = await c.text();
    throw new Error(o || "demand call failed");
  }
  return c.json();
}
async function iy() {
  const a = await fetch("/fleet");
  if (!a.ok) throw new Error("fleet fetch failed");
  return a.json();
}
async function cy() {
  const a = await fetch("/settings");
  if (!a.ok) throw new Error("settings fetch failed");
  return a.json();
}
async function ry(a) {
  if (!(await fetch("/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ settings: a })
  })).ok) throw new Error("settings patch failed");
}
async function oy(a, i) {
  const c = await fetch(`/settings/inventory/${a}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(i)
  });
  if (!c.ok) throw new Error("inventory patch failed");
  return c.json();
}
async function uy() {
  const a = await fetch("/settings/network");
  if (!a.ok) throw new Error("network status failed");
  return a.json();
}
async function dy() {
  const a = await fetch("/settings/network/apply", { method: "POST" });
  if (!a.ok) throw new Error("network apply failed");
  return a.json();
}
async function Gp() {
  const a = await fetch("/settings/catalog/status");
  if (!a.ok) throw new Error("catalog status failed");
  return a.json();
}
async function fy() {
  const a = await fetch("/admin/reload-catalogs", { method: "POST" });
  if (!a.ok) throw new Error("catalog reload failed");
  return a.json();
}
async function hy() {
  const a = await fetch("/settings/esphome/devices");
  if (!a.ok) throw new Error("esphome devices failed");
  return a.json();
}
async function Vp(a, i) {
  const c = await fetch("/settings/esphome/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ seat_id: a, action: i })
  });
  if (!c.ok) throw new Error("esphome job failed");
  return c.json();
}
async function my() {
  const a = await fetch("/settings/esphome/jobs");
  if (!a.ok) throw new Error("esphome jobs failed");
  return (await a.json()).jobs;
}
async function py() {
  return (await fetch("/settings/integrations/test-ollama", { method: "POST" })).json();
}
async function _y() {
  return (await fetch("/settings/integrations/test-cannalib", { method: "POST" })).json();
}
async function Yp(a) {
  await fetch("/settings/zigbee/permit-join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enabled: a })
  });
}
async function by() {
  const a = await fetch("/settings/zigbee/devices");
  if (!a.ok) throw new Error("zigbee devices failed");
  return a.json();
}
function gy() {
  return "/settings/backup/export";
}
async function vy(a) {
  const i = new FormData();
  i.append("file", a);
  const c = await fetch("/settings/backup/import", { method: "POST", body: i });
  if (!c.ok) throw new Error("backup import failed");
  return c.json();
}
const xy = {
  heater: "switch.dsc_hub_heater_demand",
  heatmat: "switch.dsc_hub_grow_mat_demand",
  humidifier: "switch.dsc_hub_humidifier_demand",
  dehumidifier: "switch.dsc_hub_dehumidifier_demand",
  ac: "switch.dsc_hub_ac_demand",
  clone_humidifier: "switch.dsc_hub_clone_humidifier_demand"
};
function Xt() {
  const a = ii(), i = sa(), c = y.useCallback(
    async (d, f, h) => i === "pi" ? sy(d, f, h ?? {}) : a.callService(d, f, h),
    [a, i]
  ), o = y.useCallback(
    async (d, f) => {
      if (i === "pi")
        return ly(d, f);
      const h = xy[d];
      return a.callService("switch", f ? "turn_on" : "turn_off", { entity_id: h });
    },
    [a, i]
  );
  return { callService: c, setDemand: o };
}
function Ws(a) {
  const { state: i, available: c, entity: o } = ii(), d = kt();
  if (sa() === "pi") {
    const h = Fc(a, d);
    if (h != null)
      return {
        state: h,
        available: V_(a, d),
        attributes: Y_(a, d)
      };
  }
  return {
    state: i(a, "unavailable"),
    available: c(a),
    attributes: o(a)?.attributes ?? {}
  };
}
function Sn({
  name: a,
  size: i = 16,
  className: c,
  color: o = "currentColor"
}) {
  return /* @__PURE__ */ l.jsx(
    "span",
    {
      className: `dsc-icon${c ? ` ${c}` : ""}`,
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
      dangerouslySetInnerHTML: { __html: F0(a) }
    }
  );
}
function re({
  title: a,
  children: i,
  className: c = "",
  style: o,
  icon: d
}) {
  return /* @__PURE__ */ l.jsxs("section", { className: `dsc-card ${c}`.trim(), style: o, children: [
    a ? /* @__PURE__ */ l.jsxs("h3", { className: "dsc-card-title", children: [
      d ? /* @__PURE__ */ l.jsx(Sn, { name: d, size: 14, color: "var(--dsc-teal)" }) : null,
      a
    ] }) : null,
    i
  ] });
}
function ce({
  children: a,
  primary: i,
  teal: c,
  onClick: o,
  type: d = "button",
  disabled: f
}) {
  const h = ["dsc-btn"];
  return i && h.push("primary"), c && h.push("teal"), /* @__PURE__ */ l.jsx("button", { type: d, className: h.join(" "), onClick: o, disabled: f, children: a });
}
function St({
  label: a,
  value: i,
  unit: c,
  sub: o,
  tone: d = "normal",
  stale: f,
  onClick: h
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
        return f ? "dsc-status-muted" : "";
      default:
        return d;
    }
  })(), _ = /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
    /* @__PURE__ */ l.jsxs("div", { className: `dsc-kpi-value ${m}`.trim(), children: [
      i,
      c ? /* @__PURE__ */ l.jsx("span", { className: "dsc-kpi-unit", children: c }) : null,
      f ? /* @__PURE__ */ l.jsx("span", { className: "dsc-held-tag", children: "HELD" }) : null
    ] }),
    o ? /* @__PURE__ */ l.jsx("div", { className: "dsc-kpi-sub", children: o }) : null
  ] });
  return h ? /* @__PURE__ */ l.jsx("button", { type: "button", className: "dsc-kpi-hit", onClick: h, title: `History · ${a}`, children: /* @__PURE__ */ l.jsx(re, { title: a, className: f ? "is-stale" : void 0, children: _ }) }) : /* @__PURE__ */ l.jsx(re, { title: a, className: f ? "is-stale" : void 0, children: _ });
}
function Nt({
  title: a,
  subtitle: i,
  icon: c,
  primaryAction: o,
  actions: d
}) {
  const f = o || d ? /* @__PURE__ */ l.jsxs("div", { className: "dsc-page-header-actions", children: [
    o,
    d
  ] }) : null;
  return /* @__PURE__ */ l.jsxs("header", { className: "dsc-page-header", children: [
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-page-header-main", children: [
      c ? /* @__PURE__ */ l.jsx(Sn, { name: c, size: 22, color: "var(--dsc-teal)" }) : null,
      /* @__PURE__ */ l.jsxs("div", { children: [
        /* @__PURE__ */ l.jsx("h1", { className: "dsc-page-title", children: a }),
        i ? /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: i }) : null
      ] })
    ] }),
    f
  ] });
}
function D({
  label: a,
  tone: i = "muted",
  pulse: c,
  motion: o,
  icon: d,
  onClick: f
}) {
  const h = o ?? (c ? "pulse" : void 0), m = `dsc-chip dsc-chip--${i}${h ? ` dsc-chip--${h}` : ""}`, _ = o === "fan" ? /* @__PURE__ */ l.jsx(Sn, { name: "fan", size: 11, className: "dsc-fan-spin" }) : d ? /* @__PURE__ */ l.jsx(Sn, { name: d, size: 11 }) : null;
  return f ? /* @__PURE__ */ l.jsxs("button", { type: "button", className: `${m} is-clickable`, onClick: f, children: [
    _,
    a
  ] }) : /* @__PURE__ */ l.jsxs("span", { className: m, children: [
    _,
    a
  ] });
}
function qe({
  entityId: a,
  label: i,
  warnWhenMissing: c,
  icon: o,
  showBrightness: d
}) {
  const { state: f, available: h, attributes: m } = Ws(a), { callService: _ } = Xt(), b = f === "on", v = h, g = a.split(".")[0], j = () => {
    if (v) {
      if (g === "switch" || g === "input_boolean") {
        _(g, b ? "turn_off" : "turn_on", { entity_id: a });
        return;
      }
      g === "light" && _("light", b ? "turn_off" : "turn_on", { entity_id: a });
    }
  }, w = d !== !1 && g === "light" && b ? Math.round(Number(m?.brightness ?? 0) / 255 * 100) : null;
  return /* @__PURE__ */ l.jsxs(
    "button",
    {
      type: "button",
      className: `dsc-demand${b ? " is-on" : ""}${v ? "" : " is-missing"}`,
      onClick: j,
      disabled: !v && !c,
      title: v ? a : c || `${a} unavailable`,
      children: [
        o ? /* @__PURE__ */ l.jsx(Sn, { name: o, size: 22, color: "var(--dsc-teal)", className: "dsc-demand-icon" }) : null,
        /* @__PURE__ */ l.jsx("span", { className: "dsc-demand-label", children: i }),
        /* @__PURE__ */ l.jsx("span", { className: "dsc-demand-state", children: v ? w != null ? `${w}%` : b ? "ON" : "OFF" : c || "—" })
      ]
    }
  );
}
function ls({
  entityId: a,
  label: i,
  icon: c
}) {
  const { state: o, available: d, attributes: f } = Ws(a), { callService: h } = Xt(), m = d, _ = o, b = f?.options || [], v = a.split(".")[0], [g, j] = y.useState(!1), w = y.useRef(!1), [S, E] = y.useState(_);
  y.useEffect(() => {
    !w.current && !g && E(_);
  }, [_, g, a]);
  const N = (O) => {
    E(O), j(!1), !(!m || !O) && (v === "select" ? h("select", "select_option", { entity_id: a, option: O }) : v === "input_select" && h("input_select", "select_option", { entity_id: a, option: O }));
  }, C = g ? S : _;
  return /* @__PURE__ */ l.jsxs("label", { className: `dsc-entity-select${m ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ l.jsxs("span", { className: "dsc-entity-select-label", children: [
      c ? /* @__PURE__ */ l.jsx(Sn, { name: c, size: 13, color: "var(--dsc-teal)" }) : null,
      i
    ] }),
    /* @__PURE__ */ l.jsxs(
      "select",
      {
        value: C,
        disabled: !m,
        onFocus: () => {
          w.current = !0, j(!0);
        },
        onBlur: () => {
          w.current = !1, j(!1);
        },
        onChange: (O) => N(O.target.value),
        children: [
          !b.includes(C) && C ? /* @__PURE__ */ l.jsx("option", { value: C, children: C }) : null,
          b.map((O) => /* @__PURE__ */ l.jsx("option", { value: O, children: O }, O))
        ]
      }
    )
  ] });
}
function za({
  entityId: a,
  label: i,
  disabled: c
}) {
  const { available: o, attributes: d, state: f } = Ws(a), { callService: h } = Xt(), m = o, _ = Number(d?.percentage ?? 0), b = f === "on", v = c || !m, [g, j] = y.useState(!1), w = y.useRef(!1), [S, E] = y.useState(Number.isFinite(_) ? _ : 0);
  y.useEffect(() => {
    !w.current && !g && Number.isFinite(_) && E(_);
  }, [_, g, a]);
  const N = (O) => {
    v || h("fan", "set_percentage", { entity_id: a, percentage: O });
  }, C = g ? S : Number.isFinite(_) ? _ : 0;
  return /* @__PURE__ */ l.jsxs("label", { className: `dsc-fan-slider${v ? " is-disabled" : ""}`, children: [
    /* @__PURE__ */ l.jsxs("span", { className: "dsc-fan-slider-label", children: [
      i,
      /* @__PURE__ */ l.jsx("strong", { children: m ? `${Math.round(C)}%` : "—" }),
      !b && m ? /* @__PURE__ */ l.jsx("em", { className: "dsc-muted", children: "off" }) : null
    ] }),
    /* @__PURE__ */ l.jsx(
      "input",
      {
        type: "range",
        min: 0,
        max: 100,
        step: 1,
        value: C,
        disabled: v,
        onPointerDown: (O) => {
          O.target.setPointerCapture(O.pointerId), w.current = !0, j(!0);
        },
        onPointerUp: (O) => {
          w.current = !1, j(!1), N(Number(O.target.value));
        },
        onPointerCancel: () => {
          w.current = !1, j(!1);
        },
        onLostPointerCapture: () => {
          w.current = !1, j(!1);
        },
        onChange: (O) => {
          const B = Number(O.target.value);
          E(B), w.current || N(B);
        }
      }
    )
  ] });
}
function md(a) {
  return !a || a === "unknown" || a === "unavailable" ? "" : a;
}
function Gc({
  entityId: a,
  label: i,
  multiline: c = !1,
  rows: o = 2
}) {
  const { available: d, state: f } = Ce(), { callService: h } = Xt(), m = d(a), _ = md(f(a, "")), [b, v] = y.useState(_), g = y.useRef(!1);
  y.useEffect(() => {
    g.current || v(_);
  }, [_]);
  const j = () => {
    m && h("input_text", "set_value", { entity_id: a, value: b });
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
      S.key === "Enter" && !c && S.currentTarget.blur();
    }
  };
  return /* @__PURE__ */ l.jsxs("label", { className: `dsc-target-num${m ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ l.jsx("span", { className: "dsc-target-num-label", children: i }),
    c ? /* @__PURE__ */ l.jsx("textarea", { rows: o, ...w }) : /* @__PURE__ */ l.jsx("input", { type: "text", ...w })
  ] });
}
function yy(a) {
  const i = md(a);
  return i ? i.slice(0, 5) : "";
}
function wy(a) {
  return a ? a.length === 5 ? `${a}:00` : a : "00:00:00";
}
function qp({ entityId: a, label: i }) {
  const { available: c, state: o } = Ce(), { callService: d } = Xt(), f = c(a), h = yy(o(a, "")), [m, _] = y.useState(h), b = y.useRef(!1);
  y.useEffect(() => {
    b.current || _(h);
  }, [h]);
  const v = () => {
    !f || !m || d("time", "set_value", { entity_id: a, time: wy(m) });
  };
  return /* @__PURE__ */ l.jsxs("label", { className: `dsc-target-num${f ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ l.jsx("span", { className: "dsc-target-num-label", children: i }),
    /* @__PURE__ */ l.jsx(
      "input",
      {
        type: "time",
        value: m,
        disabled: !f,
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
function jy({ entityId: a, label: i }) {
  const { available: c, entity: o, state: d } = Ce(), { callService: f } = Xt(), h = c(a), m = !!o(a)?.attributes?.has_time, _ = md(d(a, "")), b = (S) => S ? m ? S.slice(0, 16).replace(" ", "T") : S.slice(0, 10) : "", [v, g] = y.useState(b(_)), j = y.useRef(!1);
  y.useEffect(() => {
    j.current || g(b(_));
  }, [_, m]);
  const w = () => {
    if (!h || !v) return;
    const S = m ? v.replace("T", " ") : v;
    m ? f("input_datetime", "set_datetime", { entity_id: a, datetime: S }) : f("input_datetime", "set_datetime", { entity_id: a, date: v });
  };
  return /* @__PURE__ */ l.jsxs("label", { className: `dsc-target-num${h ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ l.jsx("span", { className: "dsc-target-num-label", children: i }),
    /* @__PURE__ */ l.jsx(
      "input",
      {
        type: m ? "datetime-local" : "date",
        value: v,
        disabled: !h,
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
function Tc({
  label: a,
  empty: i = !1,
  onClick: c
}) {
  const o = /* @__PURE__ */ l.jsx("span", { className: `dsc-result-chip${i ? " is-empty" : ""}`, children: /* @__PURE__ */ l.jsx("span", { children: a }) });
  return c ? /* @__PURE__ */ l.jsx("button", { type: "button", className: "dsc-result-chip-hit", onClick: c, children: o }) : o;
}
function Yt({
  open: a,
  onDismiss: i,
  onConfirm: c,
  title: o,
  confirmLabel: d = "Confirm",
  help: f,
  children: h
}) {
  const m = y.useId(), _ = y.useRef(null), b = y.useRef(null);
  return y.useEffect(() => {
    if (!a) return;
    b.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, _.current?.querySelector("button, input, select, textarea, [href]")?.focus();
    const j = (w) => {
      w.key === "Escape" && (w.preventDefault(), i());
    };
    return window.addEventListener("keydown", j), () => {
      window.removeEventListener("keydown", j), b.current?.focus?.();
    };
  }, [a, i]), a ? /* @__PURE__ */ l.jsxs("div", { className: "dsc-decision-root is-open", role: "presentation", children: [
    /* @__PURE__ */ l.jsx("div", { className: "dsc-decision-scrim", onClick: i }),
    /* @__PURE__ */ l.jsxs(
      "aside",
      {
        ref: _,
        className: "dsc-decision-panel",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": m,
        children: [
          /* @__PURE__ */ l.jsxs("header", { className: "dsc-decision-head", children: [
            /* @__PURE__ */ l.jsx("h2", { id: m, children: o }),
            /* @__PURE__ */ l.jsx("button", { type: "button", className: "dsc-icon-btn", "aria-label": "Dismiss", onClick: i, children: /* @__PURE__ */ l.jsx(Sn, { name: "close", size: 16 }) })
          ] }),
          /* @__PURE__ */ l.jsx("div", { className: "dsc-decision-body", children: h }),
          f ? /* @__PURE__ */ l.jsx("div", { className: "dsc-decision-help", children: f }) : /* @__PURE__ */ l.jsx("div", { className: "dsc-decision-help is-empty" }),
          /* @__PURE__ */ l.jsxs("footer", { className: "dsc-decision-foot", children: [
            /* @__PURE__ */ l.jsx(ce, { onClick: i, children: "Dismiss" }),
            c ? /* @__PURE__ */ l.jsx(ce, { primary: !0, onClick: c, children: d }) : null
          ] })
        ]
      }
    )
  ] }) : null;
}
function Sy(a) {
  const i = [], c = (h, m = "unknown") => a.state(h, m), o = (h) => c(h) === "on", d = a.entity?.("sensor.dsc_keepup_gaps")?.attributes ?? {}, f = String(d.full_auto_honesty ?? "").trim();
  if (a.available && a.available("binary_sensor.dsc_hub_link") && !o("binary_sensor.dsc_hub_link") && i.push({
    id: "hub-link",
    label: "Hub link down",
    detail: "binary_sensor.dsc_hub_link is off — Mission/Fleet show HELD, not last-good animation.",
    tone: "bad",
    href: "/fleet",
    cta: "Open Fleet",
    priority: 9
  }), a.available && !a.available("sensor.dsc_hub_uptime")) {
    const h = a.entity?.("sensor.dsc_hub_uptime")?.last_changed;
    let m = "";
    if (h) {
      const _ = Date.now() - Date.parse(h);
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
    label: "Beat dark",
    detail: "Hub heartbeat unavailable — Mission shows BEAT OFF duration; vitals stay held.",
    tone: "bad",
    href: "/live/mission",
    cta: "Mission",
    priority: 12
  }), a.available && !a.available("binary_sensor.dsc_hub_panel_link") && i.push({
    id: "panel-dark",
    label: "Panel link dark",
    detail: "Panel link dark — Mission shows PANEL OFF duration; do not invent Got.",
    tone: "warn",
    href: "/fleet",
    cta: "Open Fleet",
    priority: 14
  }), o("binary_sensor.dsc_reduced_kit")) {
    const h = a.entity?.("binary_sensor.dsc_reduced_kit")?.attributes ?? {}, m = String(h.offline ?? "").trim();
    i.push({
      id: "reduced-kit",
      label: "Unexpected OOS",
      detail: m || "A live lever is temp-OOS or lockout — planned holes are inventory.",
      tone: "warn",
      href: "/fleet",
      cta: "Review kit",
      priority: 20
    });
  }
  return f && o("switch.dsc_hub_tent_full_auto_mode") && i.push({
    id: "keepup",
    label: "Keep-up gaps",
    detail: f,
    tone: "warn",
    href: "/live/climate",
    cta: "Fix Climate",
    priority: 30
  }), o("binary_sensor.dsc_clone_dark_period_violation") && i.push({
    id: "dark-viol",
    label: "2×4 dark violation",
    detail: "Photoperiod honesty — check Light.",
    tone: "bad",
    href: "/live/light",
    cta: "Open Light",
    priority: 25
  }), o("binary_sensor.dsc_clone_light_missing_in_window") && i.push({
    id: "photo-missing",
    label: "Light missing in window",
    detail: "Photoperiod integrity — fixture did not deliver in the open window.",
    tone: "bad",
    href: "/live/light",
    cta: "Open Light",
    priority: 24
  }), o("binary_sensor.dsc_hub_light_catchup_active") && i.push({
    id: "photo-catchup",
    label: "Light catch-up",
    detail: "Catch-up photoperiod is active — hours gauge is the Got, not invented.",
    tone: "warn",
    href: "/live/light",
    cta: "Open Light",
    priority: 28
  }), o("binary_sensor.dsc_hub_climate_sensor_fault") && i.push({
    id: "climate-fault",
    label: "Climate sensor fault",
    detail: "Trust the honesty rail — do not invent Got.",
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
  }), i.sort((h, m) => h.priority - m.priority);
}
function ky(a, i) {
  const c = [];
  return a.hub.online || (c.push({
    id: "hub-link",
    label: "Hub link down",
    detail: "Hub offline on fleet bus — Mission/Fleet show HELD, not last-good animation.",
    tone: "bad",
    href: "/fleet",
    cta: "Open Fleet",
    priority: 9
  }), c.push({
    id: "hub-dark",
    label: "Hub offline",
    detail: "Showing last good vitals. Reconnect snaps to live.",
    tone: "bad",
    href: "/fleet",
    cta: "Open Fleet",
    priority: 10
  })), a.hub.online && a.hub.values.heartbeat == null && c.push({
    id: "beat-dark",
    label: "Beat dark",
    detail: "Hub heartbeat unavailable — Mission shows BEAT OFF duration; vitals stay held.",
    tone: "bad",
    href: "/live/mission",
    cta: "Mission",
    priority: 12
  }), a.panel.online || c.push({
    id: "panel-dark",
    label: "Panel link dark",
    detail: "Panel link dark — Mission shows PANEL OFF duration; do not invent Got.",
    tone: "warn",
    href: "/fleet",
    cta: "Open Fleet",
    priority: 14
  }), a.system.reduced_kit && c.push({
    id: "reduced-kit",
    label: "Unexpected OOS",
    detail: "A live lever is temp-OOS or lockout — planned holes are inventory.",
    tone: "warn",
    href: "/fleet",
    cta: "Review kit",
    priority: 20
  }), i && c.push(...Sy(i).filter(
    (o) => !["hub-link", "hub-dark", "beat-dark", "panel-dark", "reduced-kit"].includes(o.id)
  )), c.sort((o, d) => o.priority - d.priority);
}
function Ny(a) {
  return a[0] ?? null;
}
function X_() {
  const a = Ce(), i = kt();
  return y.useMemo(
    () => ky(i, {
      state: a.state,
      available: a.available,
      entity: a.entity
    }),
    [i, a.state, a.available, a.entity, a.tick]
  );
}
function Cy({ gaps: a }) {
  const i = X_(), c = a ?? i, [o, d] = y.useState(null), f = ht();
  return c.length ? /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
    /* @__PURE__ */ l.jsx("div", { className: "dsc-honesty-rail", "aria-label": "Honesty gaps", children: c.slice(0, 6).map((h) => /* @__PURE__ */ l.jsx(
      "button",
      {
        type: "button",
        className: "dsc-honesty-hit",
        onClick: () => d(h),
        children: /* @__PURE__ */ l.jsx(D, { icon: "alert", label: h.label, tone: h.tone === "bad" ? "bad" : "warn" })
      },
      h.id
    )) }),
    /* @__PURE__ */ l.jsx(
      Yt,
      {
        open: o != null,
        onDismiss: () => d(null),
        onConfirm: o ? () => {
          f(o.href), d(null);
        } : void 0,
        title: o?.label ?? "Honesty",
        confirmLabel: o?.cta ?? "Go",
        help: null,
        children: /* @__PURE__ */ l.jsx("p", { children: o?.detail })
      }
    )
  ] }) : /* @__PURE__ */ l.jsx("div", { className: "dsc-honesty-rail", "aria-label": "Honesty", children: /* @__PURE__ */ l.jsx(D, { icon: "ok", label: "Kit honest", tone: "ok" }) });
}
function Ey({ gaps: a }) {
  const i = X_(), o = Ny(a ?? i), d = ht();
  return o ? /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass dsc-next-rec", title: "Do this next", icon: "alert", children: [
    /* @__PURE__ */ l.jsxs("p", { style: { margin: "0 0 8px" }, children: [
      /* @__PURE__ */ l.jsx("strong", { children: o.label }),
      " — ",
      o.detail
    ] }),
    /* @__PURE__ */ l.jsx(ce, { primary: !0, onClick: () => d(o.href), children: o.cta })
  ] }) : /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass dsc-next-rec", title: "Next", icon: "ok", children: [
    /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: "No critical gaps — fly Live or open Twin." }),
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-row-actions", children: [
      /* @__PURE__ */ l.jsx(ce, { primary: !0, onClick: () => d("/live/twin"), children: "Open Twin" }),
      /* @__PURE__ */ l.jsx(ce, { teal: !0, onClick: () => d("/live/climate"), children: "Climate Want" })
    ] })
  ] });
}
const ta = "7.2.0", ar = [
  `/local/DSC-HUB.js?v=${ta}`,
  `/hacsfiles/DSC-HUB/DSC-HUB.js?v=${ta}`
], Q_ = `/local/vendor/three.min.js?v=${ta}`, Z_ = `/local/vendor/dsc-dash-fx.js?v=${ta}`, K_ = {
  "dsc-catalog-browse-card": [`/local/dsc-catalog-browse-card.js?v=${ta}`],
  "dsc-build-plant-card": [`/local/dsc-build-plant-card.js?v=${ta}`],
  "dsc-the-dash-card": [Q_, Z_, `/local/dsc-the-dash-card.js?v=${ta}`],
  "dsc-airflow-map-card": [`/local/dsc-airflow-map-card.js?v=${ta}`],
  "dsc-system-map-card": [`/local/dsc-system-map-card.js?v=${ta}`, ...ar]
};
function ti() {
  return typeof globalThis.THREE < "u";
}
const Ac = /* @__PURE__ */ new Map();
function Vc(a) {
  if (document.querySelector(`script[data-dsc-autoload="${a}"]`))
    return Ac.get(a) ?? Promise.resolve();
  if (Ac.has(a)) return Ac.get(a);
  const c = new Promise((o, d) => {
    const f = document.createElement("script");
    f.src = a, f.async = !0, f.dataset.dscAutoload = a, f.onload = () => o(), f.onerror = () => d(new Error(`Failed to load ${a}`)), document.head.appendChild(f);
  });
  return Ac.set(a, c), c;
}
function My(a) {
  const i = K_[a] ?? [], c = [];
  for (const o of [...i, ...ar])
    c.includes(o) || c.push(o);
  return c;
}
async function Xp() {
  if (ti()) return !0;
  for (const a of [Q_, ...ar])
    if (a) {
      try {
        await Vc(a);
      } catch {
      }
      if (ti()) return !0;
    }
  return ti();
}
async function J_(a, i = 12e3) {
  if (a === "dsc-the-dash-card" && (await Xp(), ti()))
    try {
      await Vc(Z_);
    } catch {
    }
  const c = K_[a] ?? [];
  for (const o of c)
    if (o)
      try {
        await Vc(o);
      } catch {
      }
  if (a === "dsc-the-dash-card" && !ti() && await Xp(), customElements.get(a)) return !0;
  for (const o of ar) {
    try {
      await Vc(o);
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
function Ty(a) {
  return My(a).map((i) => i.split("?")[0]);
}
const pd = [
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
], P_ = new Map(pd.map((a) => [a.id, a])), ci = pd[2];
function Pu(a) {
  return `input_select.dsc_pot${a}_vessel`;
}
function Ay(a) {
  const i = String(a || "").trim();
  return P_.has(i) ? i : ci.id;
}
function Wu(a, i) {
  const c = P_.get(Ay(a)) ?? ci;
  return Number.isFinite(i) && i > 0 ? { ...c, volumeL: i } : c;
}
function Ha(a, i, c) {
  const o = Pu(a), d = i(o, "");
  if (d && d !== "unknown" && d !== "unavailable")
    return Wu(d);
  const f = c?.("sensor.dsc_plant_roster_summary")?.attributes?.slots;
  if (Array.isArray(f)) {
    const h = f.find((m) => String(m.pot) === String(a));
    if (h?.vessel) return Wu(h.vessel);
  }
  return ci;
}
function Ry(a) {
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
const Qp = [
  "var(--dsc-soil-1)",
  "var(--dsc-soil-2)",
  "var(--dsc-soil-3)",
  "var(--dsc-soil-4)"
];
function Zp(a) {
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
  layers: i = [],
  size: c = 56,
  label: o
}) {
  const d = `vclip-${a.id}-${a.silhouette}`, f = i.reduce((m, _) => m + _.pct, 0) || 1;
  let h = 0;
  return /* @__PURE__ */ l.jsxs("span", { className: "dsc-vessel-glyph", title: a.label, children: [
    /* @__PURE__ */ l.jsxs("svg", { width: c, height: c * 1.15, viewBox: "0 0 100 100", "aria-hidden": !0, children: [
      /* @__PURE__ */ l.jsx("defs", { children: /* @__PURE__ */ l.jsx("clipPath", { id: d, children: /* @__PURE__ */ l.jsx("path", { d: Zp(a.silhouette) }) }) }),
      /* @__PURE__ */ l.jsx(
        "path",
        {
          d: Zp(a.silhouette),
          fill: "rgba(8,12,10,0.85)",
          stroke: Ry(a.material),
          strokeWidth: "2.4",
          strokeDasharray: a.silhouette === "airpot" ? "5 3" : void 0
        }
      ),
      /* @__PURE__ */ l.jsx("g", { clipPath: `url(#${d})`, children: i.map((m, _) => {
        const b = m.pct / f * 88, v = 96 - h - b;
        return h += b, /* @__PURE__ */ l.jsx(
          "rect",
          {
            x: "12",
            y: v,
            width: "76",
            height: b,
            fill: m.color || Qp[_ % Qp.length]
          },
          `${m.name}-${_}`
        );
      }) })
    ] }),
    o ? /* @__PURE__ */ l.jsxs("span", { className: "dsc-vessel-glyph-label", children: [
      a.volumeL,
      "L"
    ] }) : null
  ] });
}
function _d({
  label: a,
  icon: i,
  onClick: c,
  className: o = "",
  expanded: d
}) {
  return /* @__PURE__ */ l.jsx(
    "button",
    {
      type: "button",
      className: `dsc-icon-btn ${o}`.trim(),
      "aria-label": a,
      title: a,
      "aria-expanded": d,
      onClick: c,
      children: /* @__PURE__ */ l.jsx(Sn, { name: i, size: 16 })
    }
  );
}
function Oy(a) {
  return a instanceof Element ? !!a.closest(
    "ha-more-info-dialog, ha-dialog, ha-more-info-info, .ha-more-info, home-assistant-dialog"
  ) : !1;
}
function sr({
  items: a,
  label: i = "More actions"
}) {
  const [c, o] = y.useState(!1), d = y.useRef(null);
  return y.useEffect(() => {
    if (!c) return;
    const f = (m) => {
      Oy(m.target) || d.current?.contains(m.target) || o(!1);
    }, h = (m) => {
      m.key === "Escape" && o(!1);
    };
    return document.addEventListener("mousedown", f), window.addEventListener("keydown", h), () => {
      document.removeEventListener("mousedown", f), window.removeEventListener("keydown", h);
    };
  }, [c]), /* @__PURE__ */ l.jsxs("div", { className: "dsc-overflow", ref: d, children: [
    /* @__PURE__ */ l.jsx(
      _d,
      {
        label: i,
        icon: "more",
        expanded: c,
        onClick: () => o((f) => !f)
      }
    ),
    c ? /* @__PURE__ */ l.jsx("div", { className: "dsc-overflow-menu", role: "menu", children: a.map((f) => /* @__PURE__ */ l.jsx(
      "button",
      {
        type: "button",
        role: "menuitem",
        onClick: () => {
          o(!1), f.onSelect();
        },
        children: f.label
      },
      f.id
    )) }) : null
  ] });
}
function Kp(a) {
  return Array.from(
    a.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((i) => !i.hasAttribute("disabled") && i.tabIndex !== -1);
}
function cs({
  open: a,
  onClose: i,
  title: c,
  side: o = "right",
  children: d
}) {
  const f = y.useId(), h = y.useRef(null), m = y.useRef(null);
  return y.useEffect(() => {
    if (!a) return;
    m.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const _ = h.current;
    (_ ? Kp(_)[0] : null)?.focus();
    const v = (g) => {
      if (g.key === "Escape") {
        g.preventDefault(), i();
        return;
      }
      if (g.key !== "Tab" || !_) return;
      const j = Kp(_);
      if (!j.length) return;
      const w = j[0], S = j[j.length - 1];
      g.shiftKey && document.activeElement === w ? (g.preventDefault(), S.focus()) : !g.shiftKey && document.activeElement === S && (g.preventDefault(), w.focus());
    };
    return window.addEventListener("keydown", v), () => {
      window.removeEventListener("keydown", v), m.current?.focus?.();
    };
  }, [a, i]), /* @__PURE__ */ l.jsxs("div", { className: `dsc-drawer-root${a ? " is-open" : ""}`, "aria-hidden": !a, children: [
    /* @__PURE__ */ l.jsx("div", { className: "dsc-drawer-scrim", onClick: i }),
    /* @__PURE__ */ l.jsxs(
      "aside",
      {
        ref: h,
        className: `dsc-drawer-panel ${o}`,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": f,
        children: [
          /* @__PURE__ */ l.jsx(
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
          /* @__PURE__ */ l.jsxs("div", { className: "dsc-drawer-head", children: [
            /* @__PURE__ */ l.jsx("h2", { id: f, children: c }),
            /* @__PURE__ */ l.jsx(_d, { label: "Close", icon: "close", onClick: i })
          ] }),
          /* @__PURE__ */ l.jsx("div", { className: "dsc-drawer-body", children: d })
        ]
      }
    )
  ] });
}
function zy(a) {
  if (!a || !a.trim()) return [];
  const i = a.split(/[|/·]/).map((o) => o.trim()).filter(Boolean), c = [];
  for (const o of i) {
    const d = o.match(/^(.+?)\s*[·:]?\s*(\d+(?:\.\d+)?)\s*%?$/);
    if (d) {
      c.push({ name: d[1].trim(), pct: Number(d[2]) });
      continue;
    }
    const f = o.match(/(\d+(?:\.\d+)?)\s*%\s*(.+)$/);
    if (f) {
      c.push({ name: f[2].trim(), pct: Number(f[1]) });
      continue;
    }
    o && c.push({ name: o, pct: 0 });
  }
  if (c.length && c.every((o) => o.pct === 0)) {
    const o = 100 / c.length;
    return c.map((d) => ({ ...d, pct: o }));
  }
  return c.filter((o) => o.pct > 0);
}
function Dy({
  layers: a,
  valid: i,
  emptyLabel: c = "No blend on roster seat",
  spec: o
}) {
  const d = o ?? ci, f = a.reduce((m, _) => m + _.pct, 0), h = i ?? (a.length > 0 && Math.round(f) === 100);
  return a.length ? /* @__PURE__ */ l.jsx("div", { className: `dsc-soil${h ? " is-valid" : ""}`, children: /* @__PURE__ */ l.jsx(On, { spec: d, layers: a, size: 180, label: !0 }) }) : /* @__PURE__ */ l.jsxs("div", { className: "dsc-soil", children: [
    /* @__PURE__ */ l.jsx(On, { spec: d, size: 160 }),
    /* @__PURE__ */ l.jsx("div", { className: "dsc-soil-empty", children: c })
  ] });
}
function Tt(a, i = "—") {
  return !a || a === "unknown" || a === "unavailable" || a === "none" ? i : a;
}
function Qc(a, i) {
  const c = a(`input_select.dsc_pot${i}_tent`, "unassigned");
  return c === "clone" || c === "main" || c === "unassigned" ? c : "unassigned";
}
function lr(a) {
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
function rs(a, i) {
  const { state: c, entity: o } = i, d = o("sensor.dsc_plant_roster_summary")?.attributes?.slots || [], f = Array.isArray(d) ? d.find((_) => String(_.pot) === String(a)) : void 0, h = (_, b) => {
    const v = Tt(c(_, ""));
    return v !== "—" ? v : Tt(c(b, ""));
  }, m = Tt(f?.blend, "");
  return {
    pot: a,
    plantName: Tt(c(`text.dsc_pot${a}_plant_name`, "")),
    strainDisplay: Tt(c(`sensor.dsc_pot${a}_strain_display`, "")),
    sprout: Tt(c(`datetime.dsc_pot${a}_sprout_date`, ""), "—").slice(0, 10),
    days: Tt(c(`sensor.dsc_pot${a}_days_since_sprout`, "")),
    stage: Tt(c(`sensor.dsc_pot${a}_expected_stage`, "")),
    growthStage: Tt(c(`select.dsc_pot${a}_growth_stage`, "")),
    tent: Qc(c, a),
    blend: m,
    recipe: Tt(f?.recipe, ""),
    notes: Tt(f?.notes, ""),
    layers: zy(m),
    moisture: h(`sensor.dsc_pot${a}_got_moisture`, `sensor.dsc_pot${a}_soil_moisture`),
    soilTemp: Tt(c(`sensor.dsc_pot${a}_soil_temperature`, "")),
    ec: h(`sensor.dsc_pot${a}_got_ec`, `sensor.dsc_pot${a}_soil_conductivity`),
    ph: h(`sensor.dsc_pot${a}_got_ph`, `sensor.dsc_pot${a}_soil_ph`),
    n: Tt(c(`sensor.dsc_pot${a}_soil_nitrogen`, "")),
    p: Tt(c(`sensor.dsc_pot${a}_soil_phosphorus`, "")),
    k: Tt(c(`sensor.dsc_pot${a}_soil_potassium`, "")),
    need: Tt(c(`sensor.dsc_pot${a}_need_summary`, "")),
    rosterSlot: f?.slot ?? null
  };
}
function bn(a, i, c) {
  const o = `sensor.dsc_pot${a}_got_${i}`, d = i === "moisture" ? `sensor.dsc_pot${a}_soil_moisture` : i === "ec" ? `sensor.dsc_pot${a}_soil_conductivity` : `sensor.dsc_pot${a}_soil_ph`, f = c(o, "");
  return f && f !== "unavailable" && f !== "unknown" ? o : d;
}
function W_(a, i, c) {
  return bd(i).map((o) => rs(o, { state: i, entity: c })).filter((o) => o.tent === a);
}
const aa = [1, 2, 3, 4];
function qt(a, i) {
  const c = `input_boolean.dsc_pot${a}_in_service`, o = i(c, "on");
  return o === "unavailable" || o === "unknown" || o === "" ? !0 : o === "on";
}
function bd(a, i = [...aa]) {
  return i.filter((c) => qt(c, a));
}
function Hy(a, i = [...aa]) {
  return { inService: bd(a, i).length, total: i.length };
}
function Ly(a) {
  const i = a("sensor.dsc_plant_roster_summary")?.attributes?.slots;
  return Array.isArray(i) ? i : [];
}
function ir(a, i) {
  const c = qt(a, i), o = i(`binary_sensor.dsc_pot${a}_sensor_stuck`) === "on", d = i(`binary_sensor.dsc_pot${a}_untrusted`) === "on", f = i("sensor.dsc_peer_divergence_summary", ""), h = c && f !== "—" && f !== "ok" && f.toLowerCase() !== "none" && f !== "unknown" && f !== "unavailable" && f.length > 0 && f !== "0", m = [];
  o && m.push("stuck"), d && m.push("untrusted"), h && m.push("peer divergence");
  let _ = "ok";
  return d || o ? _ = "bad" : h && (_ = "warn"), {
    stuck: o,
    untrusted: d,
    peerDivergence: h,
    blockNeedAct: d || o,
    tone: _,
    labels: m
  };
}
function Lu(a, i) {
  return !Number.isFinite(a) || !Number.isFinite(i) ? NaN : 6.112 * Math.exp(17.67 * a / (a + 243.5)) * i * 2.1674 / (273.15 + a);
}
function $y(a) {
  return a === "/live/main" || a === "/live/4x8" ? "main" : a === "/live/clone" || a === "/live/2x4" ? "clone" : null;
}
function Uy(a) {
  return a === "/live/twin" || a === "/ops/dash" || a === "/live/main" || a === "/live/clone" || a === "/live/4x8" || a === "/live/2x4";
}
function By() {
  const a = At(), { hass: i, available: c, num: o, state: d, entity: f, tick: h } = Ce(), m = y.useRef(null), _ = y.useRef(null), [b, v] = y.useState("loading"), g = $y(a.pathname), j = a.pathname === "/live/twin" || a.pathname === "/ops/dash" || a.pathname === "/live/main" || a.pathname === "/live/clone" || a.pathname === "/live/4x8" || a.pathname === "/live/2x4", w = c("binary_sensor.dsc_hub_link") ? d("binary_sensor.dsc_hub_link") !== "on" : !c("sensor.dsc_hub_uptime");
  return y.useEffect(() => {
    const S = m.current;
    if (!S || _.current) return;
    let E = !1;
    return (async () => {
      v("loading");
      const N = await J_("dsc-the-dash-card");
      if (E || !m.current) return;
      if (!N) {
        v("missing");
        return;
      }
      const C = document.createElement("dsc-the-dash-card");
      typeof C.setConfig == "function" && C.setConfig({ type: "custom:dsc-the-dash-card" }), i && (C.hass = i), S.appendChild(C), _.current = C, v("ready");
    })(), () => {
      E = !0;
    };
  }, []), y.useEffect(() => {
    _.current && i && (_.current.hass = i);
  }, [i, h]), y.useEffect(() => {
    const S = _.current;
    S && (S.setFocusTent?.(g), S.setUiChrome?.({ hideHud: Uy(a.pathname) }));
  }, [g, a.pathname, b]), y.useEffect(() => {
    const S = _.current, E = () => {
      const N = !j || document.hidden;
      S?.pause?.(N);
    };
    return E(), document.addEventListener("visibilitychange", E), () => document.removeEventListener("visibilitychange", E);
  }, [j, b]), y.useEffect(() => {
    _.current?.setHeld?.(w);
  }, [w, b]), y.useEffect(() => {
    const S = _.current;
    if (!S?.setPots) return;
    const E = { clone: [], main: [] };
    aa.forEach((C) => {
      const O = Qc(d, C);
      (O === "clone" || O === "main") && E[O].push(C);
    });
    const N = aa.map((C) => {
      const O = rs(C, { state: d, entity: f }), B = Ha(C, d, f), J = ir(C, d), P = qt(C, d), G = Qc(d, C), X = G === "clone" || G === "main" ? Math.max(0, E[G].indexOf(C)) : 0;
      return {
        id: `pot${C}`,
        pot: C,
        tent: G,
        slot: X,
        inService: P,
        silhouette: B.silhouette,
        moisture: Number(O.moisture),
        ec: Number(O.ec),
        ph: Number(O.ph),
        soilT: Number(O.soilTemp),
        dryback: o(`sensor.dsc_pot${C}_dryback_pct`),
        need: O.need,
        held: w,
        untrusted: J.untrusted
      };
    });
    S.setPots(N);
  }, [d, f, o, w, b]), /* @__PURE__ */ l.jsxs(
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
        /* @__PURE__ */ l.jsx("div", { className: "dsc-twin-keepalive-host", ref: m }),
        b === "missing" ? /* @__PURE__ */ l.jsxs("div", { className: "dsc-empty", children: [
          /* @__PURE__ */ l.jsx("strong", { children: "dsc-the-dash-card" }),
          " did not register. Deploy",
          " ",
          /* @__PURE__ */ l.jsx("code", { children: "/local/dsc-the-dash-card.js" }),
          " ",
          "and hard-refresh."
        ] }) : null
      ]
    }
  );
}
const Fy = "https://cannalib.plausible-deniability.net", Gy = {
  strain: "/local/dsc-catalog/dsc_strains_search_index.json",
  medium: "/local/dsc-catalog/dsc_mediums_search_index.json",
  nutrient: "/local/dsc-catalog/dsc_nutrients_search_index.json",
  light: "/local/dsc-catalog/dsc_lights_search_index.json"
}, Vy = {
  strain: "strains",
  medium: "mediums",
  nutrient: "nutrients",
  light: "lights"
};
function Yy(a) {
  return (a("input_text.dsc_cannalib_base_url", "") || Fy).replace(/\/$/, "");
}
function qy(a) {
  const i = { Accept: "application/json" }, c = a("input_text.dsc_cannalib_api_key", "");
  return c && c !== "unknown" && c !== "unavailable" && (i["X-Cannalib-Key"] = c), i;
}
function I_(a) {
  if (Array.isArray(a)) return a;
  if (a && typeof a == "object") {
    const i = a;
    if (Array.isArray(i.items)) return i.items;
    if (Array.isArray(i.strains)) return i.strains;
  }
  return [];
}
function eb(a) {
  return String(a.name || a.id || "").trim();
}
function Xy(a) {
  const i = String(a.kind ?? "").trim().toLowerCase();
  if (i && i !== "strain" && i !== "cultivar") return !1;
  const c = eb(a), o = c.toLowerCase();
  return !(/\bcapsules?\b/.test(o) || /\brosin\b/.test(o) || /\blubricant\b/.test(o) || /\bthca\s+pebbles?\b/.test(o) || /\d+\s*mg\b/.test(o) || /^#+\s*\d+/.test(c.trim()));
}
function Jp(a, i) {
  return a !== "strain" ? i : i.filter(Xy);
}
function Pp(a, i) {
  const c = i.trim().toLowerCase();
  if (!c || a.length < 2) return a;
  const o = (d) => {
    if (String(d.matched_via ?? "").toLowerCase() === "science_alias") return 0;
    const h = String(d.science_alias ?? "").toLowerCase();
    return h && h.split(/[,;/|]/).some((m) => m.trim() === c || m.trim().includes(c)) ? 1 : 2;
  };
  return [...a].sort((d, f) => o(d) - o(f));
}
async function Qy(a, i) {
  const c = await fetch(Gy[a], { cache: "no-store" });
  if (!c.ok) return [];
  const o = I_(await c.json()), d = i.trim().toLowerCase();
  return d ? o.filter((f) => eb(f).toLowerCase().includes(d)) : o;
}
async function tb(a, i, c, o = 100) {
  try {
    const f = Vy[a], h = `${Yy(c)}/v1/catalogs/${f}?q=${encodeURIComponent(i || "")}&limit=${o}`, m = await fetch(h, { headers: qy(c), cache: "no-store" });
    if (!m.ok) throw new Error(`cannalib ${m.status}`);
    const _ = Pp(Jp(a, I_(await m.json())), i);
    if (_.length || a === "strain")
      return {
        items: _,
        source: "cannalib",
        note: "CannaLib live"
      };
  } catch {
  }
  return {
    items: Pp(Jp(a, await Qy(a, i)), i),
    source: "local",
    note: "CannaLib unreachable — local JSON index"
  };
}
function nb({
  kind: a,
  onPick: i,
  placeholder: c
}) {
  const { state: o } = Ce(), [d, f] = y.useState(""), [h, m] = y.useState([]), [_, b] = y.useState("local"), [v, g] = y.useState(""), [j, w] = y.useState(!1);
  y.useEffect(() => {
    let E = !1;
    const N = window.setTimeout(() => {
      w(!0), tb(a, d, o, 100).then((C) => {
        E || (m(C.items), b(C.source), g(C.note), w(!1));
      });
    }, 200);
    return () => {
      E = !0, window.clearTimeout(N);
    };
  }, [a, d]);
  const S = y.useMemo(() => h, [h]);
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-catalog-picker", children: [
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ l.jsx(
        D,
        {
          label: _ === "cannalib" ? "Cannalib" : "Local JSON",
          tone: _ === "cannalib" ? "ok" : "warn"
        }
      ),
      v ? /* @__PURE__ */ l.jsx("span", { className: "dsc-muted", style: { fontSize: 12 }, children: v }) : null
    ] }),
    /* @__PURE__ */ l.jsx(
      "input",
      {
        type: "search",
        value: d,
        placeholder: c || "Type to search — options are not culled",
        onChange: (E) => f(E.target.value),
        autoComplete: "off"
      }
    ),
    /* @__PURE__ */ l.jsxs("ul", { className: "dsc-catalog-hits", children: [
      j && !S.length ? /* @__PURE__ */ l.jsx("li", { className: "dsc-muted", children: "Searching…" }) : null,
      !j && !S.length ? /* @__PURE__ */ l.jsx("li", { className: "dsc-muted", children: "No catalog hits — empty is honesty, not a placeholder." }) : null,
      S.map((E, N) => /* @__PURE__ */ l.jsx("li", { children: /* @__PURE__ */ l.jsxs("button", { type: "button", onClick: () => i(E), children: [
        /* @__PURE__ */ l.jsx("strong", { children: E.name }),
        E.type ? /* @__PURE__ */ l.jsx("em", { children: String(E.type) }) : null,
        E.breeder ? /* @__PURE__ */ l.jsx("span", { className: "dsc-muted", children: String(E.breeder) }) : null
      ] }) }, `${E.id || E.name}-${N}`))
    ] })
  ] });
}
const ea = [1, 2, 3];
function ab(a, i) {
  return ea.find((o) => !a[o] && o !== i) ?? ea.find((o) => !a[o]) ?? 3;
}
function $u(a, i, c, o) {
  const d = ab(o, a), f = ea.filter((g) => g !== a && g !== d), h = f.reduce((g, j) => g + (Number.isFinite(c[j]) ? Math.round(c[j]) : 0), 0), m = Math.max(0, 100 - h), _ = Math.max(0, Math.min(m, Math.round(i))), b = m - _, v = { ...c, [a]: _, [d]: b };
  return f.forEach((g) => {
    v[g] = Math.round(Number.isFinite(c[g]) ? c[g] : 0);
  }), v;
}
function Zy({ volumeL: a }) {
  const { state: i, num: c, available: o } = Ce(), { callService: d } = Xt(), [f, h] = y.useState({ 1: !1, 2: !1, 3: !1 }), [m, _] = y.useState(null), [b, v] = y.useState(null), g = {
    1: c("input_number.dsc_blend_pct_1", 0),
    2: c("input_number.dsc_blend_pct_2", 0),
    3: c("input_number.dsc_blend_pct_3", 0)
  }, j = b ?? g, w = ea.map((G) => ({
    n: G,
    name: i(`input_text.dsc_blend_component_${G}_name`, ""),
    pct: Number.isFinite(j[G]) ? j[G] : 0
  })), S = ea.filter((G) => f[G]).length, E = ab(f), N = Number.isFinite(a) && a > 0 ? a : c("input_number.dsc_blend_total_l", 20), C = w.reduce((G, X) => G + (Number.isFinite(X.pct) ? X.pct : 0), 0), O = (G) => {
    ea.forEach((X) => {
      o(`input_number.dsc_blend_pct_${X}`) && d("input_number", "set_value", {
        entity_id: `input_number.dsc_blend_pct_${X}`,
        value: G[X]
      });
    });
  }, B = (G, X) => {
    const W = $u(G, X, b ?? j, f);
    v(null), _(null), O(W);
  }, J = (G) => {
    h((X) => {
      const W = { ...X, [G]: !X[G] };
      return ea.filter((ue) => W[ue]).length >= ea.length ? X : W;
    });
  }, P = y.useMemo(
    () => w.filter((G) => G.pct > 0 && G.name && G.name !== "unknown").map((G) => `${G.name} ${(N * G.pct / 100).toFixed(1)}L (${Math.round(G.pct)}%)`).join(" · "),
    [w, N]
  );
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-coupled-mix", children: [
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ l.jsx(D, { label: `Σ ${Math.round(C)}%`, tone: Math.round(C) === 100 ? "ok" : "warn" }),
      /* @__PURE__ */ l.jsx(D, { label: `${N} L vessel`, tone: "muted" }),
      /* @__PURE__ */ l.jsx("span", { className: "dsc-muted", style: { fontSize: 12 }, children: "Lock any but one remainder. Remainder absorbs leftover so Σ stays 100." })
    ] }),
    ea.map((G) => {
      const X = w[G - 1], W = G === E && !f[G];
      return /* @__PURE__ */ l.jsxs("div", { className: "dsc-mix-row", children: [
        /* @__PURE__ */ l.jsx(Gc, { entityId: `input_text.dsc_blend_component_${G}_name`, label: `Layer ${G}` }),
        /* @__PURE__ */ l.jsx(
          "input",
          {
            type: "range",
            min: 0,
            max: 100,
            value: Math.round(X.pct),
            disabled: f[G] || W,
            onPointerDown: (se) => {
              f[G] || W || (se.target.setPointerCapture(se.pointerId), _(G), v({ ...j }));
            },
            onPointerUp: (se) => {
              m === G && B(G, Number(se.target.value));
            },
            onPointerCancel: () => {
              v(null), _(null);
            },
            onLostPointerCapture: (se) => {
              m === G && B(G, Number(se.target.value));
            },
            onChange: (se) => {
              const ue = Number(se.target.value);
              if (m === G) {
                v($u(G, ue, b ?? j, f));
                return;
              }
              O($u(G, ue, j, f));
            }
          }
        ),
        /* @__PURE__ */ l.jsxs("strong", { children: [
          Math.round(X.pct),
          "%"
        ] }),
        /* @__PURE__ */ l.jsxs("span", { className: "dsc-mono", children: [
          (N * X.pct / 100).toFixed(1),
          " L"
        ] }),
        /* @__PURE__ */ l.jsx(ce, { disabled: S >= 2 && !f[G], onClick: () => J(G), children: f[G] ? "Unlock" : W ? "Remainder" : "Lock" })
      ] }, G);
    }),
    /* @__PURE__ */ l.jsxs("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: [
      "Recipe: ",
      P || "Empty layers — scripts still read pct entities."
    ] })
  ] });
}
const gd = "sensor.dsc_hub_uptime", sb = "sensor.dsc_hub_heartbeat";
function Ky(a, i) {
  if (!i || a == null || a === "") return NaN;
  const c = a.trim().toLowerCase();
  if (c === "unavailable" || c === "unknown" || c === "none") return NaN;
  const o = Number(a);
  return Number.isFinite(o) ? o : NaN;
}
function _e(a) {
  const { available: i, tick: c, entity: o } = Ce(), d = kt(), f = sa(), h = y.useRef(null), m = y.useRef(a), [, _] = y.useState(0);
  m.current !== a && (m.current = a, h.current = null);
  const b = f === "pi" ? Xc(a, d) : null, v = f === "pi" ? hd(a, d) : !1, g = f === "pi" ? ty(d) : !i(gd) || !i(sb), j = f === "pi" && v || i(a), w = b != null && Number.isFinite(b) ? b : Ky(o(a)?.state, j), S = g && w === 0;
  return y.useEffect(() => {
    if (j && Number.isFinite(w) && !S) {
      h.current = { value: w, at: Date.now() }, _((E) => E + 1);
      return;
    }
    _((E) => E + 1);
  }, [a, j, w, S, c, o]), j && Number.isFinite(w) && !S ? { value: w, stale: !1, heldAt: h.current?.at, live: !0 } : h.current != null ? {
    value: h.current.value,
    stale: !0,
    heldAt: h.current.at,
    live: !1
  } : { value: NaN, stale: !0, heldAt: void 0, live: !1 };
}
function vd(a) {
  const { available: i, entity: c, tick: o } = Ce(), d = kt();
  if (sa() === "pi" && a === gd && d.hub.online || i(a)) return null;
  const h = c(a)?.last_changed;
  if (!h) return null;
  const m = Date.parse(h);
  return Number.isFinite(m) ? Date.now() - m : null;
}
function lb() {
  const a = kt(), i = sa(), c = vd(gd);
  return i === "pi" && !a.hub.online && a.hub.last_seen ? Date.now() - a.hub.last_seen * 1e3 : c;
}
function ib() {
  return vd(sb);
}
function cb() {
  const a = kt();
  return sa() === "pi" && !a.panel.online && a.panel.last_seen ? Date.now() - a.panel.last_seen * 1e3 : vd("binary_sensor.dsc_hub_panel_link");
}
function rb(a) {
  if (a.stale) return "stale";
  if (a.available === !1 || !Number.isFinite(a.value)) return "muted";
  if (a.fault) return "critical";
  if (a.band) {
    const i = a.margin ?? 0;
    if (a.value < a.band.min - i || a.value > a.band.max + i)
      return a.value < a.band.min - i * 3 || a.value > a.band.max + i * 3 ? "critical" : "warn";
  }
  return "ok";
}
function Jy(a) {
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
const ob = [
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
], Uu = {
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
function Rc(a, i) {
  const c = Number(a(i, ""));
  return Number.isFinite(c) && c > 0 ? c : NaN;
}
function Wp(a) {
  if (!a || a === "—" || a === "Off" || a === "Custom") return null;
  const i = Uu[a];
  if (i) return i;
  const c = Object.keys(Uu).find((o) => a.indexOf(o) >= 0);
  return c ? Uu[c] : null;
}
function Bu(a, i) {
  return !Number.isFinite(i.min) || !Number.isFinite(i.max) ? a : a ? {
    min: Math.max(a.min, i.min),
    max: Math.min(a.max, i.max),
    source: a.source === "plant" || i.source === "plant" ? "plant" : "stage",
    mixed: a.source !== i.source || a.mixed
  } : { ...i, mixed: !1 };
}
function Iu(a, i) {
  const c = W_(a, i.state, i.entity).filter((j) => qt(j.pot, i.state));
  let o = null, d = null, f = null, h = null;
  const m = [], _ = [];
  let b = !1;
  for (const j of c) {
    j.stage && j.stage !== "—" && (m.length && !m.includes(j.stage) && (b = !0), m.includes(j.stage) || m.push(j.stage)), j.need && j.need !== "—" && j.need !== "ok" && !_.includes(j.need) && _.push(j.need);
    const w = Rc(i.state, `sensor.dsc_pot${j.pot}_want_temp_min`), S = Rc(i.state, `sensor.dsc_pot${j.pot}_want_temp_max`);
    Number.isFinite(w) && Number.isFinite(S) && (o = Bu(o, { min: w, max: S, source: "plant" }));
    const E = Rc(i.state, `sensor.dsc_pot${j.pot}_want_rh_min`), N = Rc(i.state, `sensor.dsc_pot${j.pot}_want_rh_max`);
    Number.isFinite(E) && Number.isFinite(N) && (d = Bu(d, { min: E, max: N, source: "plant" }));
    const C = Wp(j.stage);
    C && (o || (o = { min: C.temp - 1.5, max: C.temp + 1.5, source: "stage", mixed: !1 }), d || (d = { min: C.rhMin, max: C.rhMax, source: "stage", mixed: !1 }), f = Bu(f, { min: C.vpdMin, max: C.vpdMax, source: "stage" }), h = h == null ? C.lightHours : Math.min(h, C.lightHours));
  }
  const v = a === "main" ? i.state("select.dsc_hub_grow_stage", "") : i.state("select.dsc_hub_clone_mode", "");
  if (!c.length || !o && !d && !f) {
    const j = a === "clone" ? v === "Clones & Seedlings" ? "Seedling" : v === "Mother" ? "Vegetative" : v === "Follow 4x8" ? i.state("select.dsc_hub_grow_stage", "") : "" : v, w = Wp(j);
    w && (o || (o = { min: w.temp - 1.5, max: w.temp + 1.5, source: "stage", mixed: !1 }), d || (d = { min: w.rhMin, max: w.rhMax, source: "stage", mixed: !1 }), f || (f = { min: w.vpdMin, max: w.vpdMax, source: "stage", mixed: !1 }), h == null && (h = w.lightHours), j && !m.includes(j) && m.push(j));
  }
  return o && o.min > o.max && (o = { ...o, min: o.max, max: o.min, mixed: !0 }), d && d.min > d.max && (d = { ...d, min: d.max, max: d.min, mixed: !0 }), f && f.min > f.max && (f = { ...f, min: f.max, max: f.min, mixed: !0 }), {
    temp: o,
    rh: d,
    vpd: f,
    lightHours: h,
    mixed: b,
    stages: m,
    needs: _,
    emptyLabel: !o && !d && !f ? "no plant/stage rail" : null
  };
}
function Ra(a, i, c) {
  if (c) return { tone: "critical", label: "min > max" };
  if (!i) return { tone: "muted", label: "no plant/stage rail" };
  const o = rb({ value: a, band: i, margin: (i.max - i.min) * 0.12 }), d = i.source === "plant" ? "plant Want" : "stage rail";
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
function Fu(a, i, c) {
  const o = Number(c(`sensor.dsc_pot${a}_want_${i}_min`, "")), d = Number(c(`sensor.dsc_pot${a}_want_${i}_max`, ""));
  if (o > 0 && d > 0 && d >= o) return { min: o, max: d };
  if (i === "moisture") return { min: 0, max: 45 };
}
const Ip = 2e3;
function ub(a, i = Date.now()) {
  if (!a.length) return [];
  const c = [...a].sort((f, h) => f.t - h.t), o = [];
  for (let f = 0; f < c.length; f++) {
    const h = c[f];
    if (!Number.isFinite(h.v)) continue;
    const m = o[o.length - 1];
    m && h.t - m.t > Ip && o.push({ t: h.t - 1, v: m.v }), o.push(h);
  }
  const d = o[o.length - 1];
  return d && i - d.t > Ip && o.push({ t: i, v: d.v }), o;
}
function Py(a) {
  if (a == null) return !0;
  const i = String(a).toLowerCase();
  return i === "" || i === "unavailable" || i === "unknown" || i === "none";
}
function db(a) {
  if (Py(a)) return null;
  if (typeof a == "number") return Number.isFinite(a) ? a : null;
  const i = String(a).toLowerCase();
  if (i === "on" || i === "true" || i === "open") return 1;
  if (i === "off" || i === "false" || i === "closed") return 0;
  const c = Number(a);
  return Number.isFinite(c) ? c : null;
}
function Wy(a) {
  if (typeof a.lu == "number" && Number.isFinite(a.lu))
    return a.lu * 1e3;
  const i = a.last_changed || a.last_updated;
  if (i) {
    const c = Date.parse(i);
    return Number.isFinite(c) ? c : null;
  }
  return null;
}
function Iy(a) {
  return db(a.s ?? a.state);
}
function e_(a, i) {
  if (a.length <= i) return a;
  const c = [], o = (a.length - 1) / (i - 1);
  for (let d = 0; d < i; d++)
    c.push(a[Math.round(d * o)]);
  return c;
}
function xd(a, i = 6, c = 96) {
  const { hass: o, callWS: d } = ii(), f = sa(), h = !!(o && (o.callWS || o.connection)), [m, _] = y.useState([]), [b, v] = y.useState(!0), [g, j] = y.useState(null);
  return y.useEffect(() => {
    let w = !1;
    async function S() {
      v(!0), j(null);
      try {
        const N = await ny(a, i);
        if (w) return;
        const C = N.filter((O) => Number.isFinite(O.t) && Number.isFinite(O.v));
        C.sort((O, B) => O.t - B.t), _(e_(C, c));
      } catch (N) {
        w || (j(N instanceof Error ? N.message : "history unavailable"), _([]));
      } finally {
        w || v(!1);
      }
    }
    async function E() {
      if (!a) {
        _([]), v(!1);
        return;
      }
      if (!h) {
        _([]), v(!1);
        return;
      }
      v(!0), j(null);
      const N = /* @__PURE__ */ new Date(), C = new Date(N.getTime() - i * 3600 * 1e3);
      try {
        const O = await d({
          type: "history/history_during_period",
          start_time: C.toISOString(),
          end_time: N.toISOString(),
          significant_changes_only: !1,
          minimal_response: !0,
          no_attributes: !0,
          entity_ids: [a]
        });
        if (w) return;
        if (O == null) {
          _([]), j("history unavailable");
          return;
        }
        let B = [];
        Array.isArray(O) ? B = O[0] || [] : O && typeof O == "object" && (B = O[a] || []);
        const J = [];
        for (const P of B) {
          const G = Wy(P), X = Iy(P);
          G == null || X == null || J.push({ t: G, v: X });
        }
        J.sort((P, G) => P.t - G.t), _(e_(J, c));
      } catch (O) {
        w || (j(O instanceof Error ? O.message : "history unavailable"), _([]));
      } finally {
        w || v(!1);
      }
    }
    return f === "pi" ? S() : E(), () => {
      w = !0;
    };
  }, [f, h, a, i, c, d]), { points: m, loading: b, error: g };
}
function e1(a) {
  return a <= 18 ? a * 2 : Math.min(a + 24, 48);
}
function t1(a, i) {
  const c = i * 3600 * 1e3, o = Date.now() - c;
  return a.filter((d) => d.t < o && Number.isFinite(d.v)).map((d) => ({ t: d.t + c, v: d.v }));
}
function xe(a, i) {
  const c = i?.maxPoints ?? 96, o = i?.hours ?? 6, d = !!i?.withGhost, f = d ? e1(o) : o, h = d ? Math.min(Math.max(c * 2, c), 288) : c, { num: m, available: _, tick: b, state: v } = Ce(), g = kt(), j = sa(), w = W0(), { points: S } = xd(a, f, h), [E, N] = y.useState([]), [C, O] = y.useState(void 0), B = y.useRef(null), J = y.useRef(!1);
  y.useEffect(() => {
    J.current = !1, N([]), B.current = null, O(void 0);
  }, [a, o, c, f, d]), y.useEffect(() => {
    if (S.length && !J.current) {
      J.current = !0;
      const W = S[S.length - 1]?.v;
      Number.isFinite(W) && (B.current = W);
    }
  }, [S]), y.useEffect(() => {
    const W = j === "pi" ? hd(a, g) : _(a);
    if (!a || !W) return;
    const se = j === "pi" ? Xc(a, g) : null, ue = m(a), de = se != null && Number.isFinite(se) ? se : Number.isFinite(ue) ? ue : db(v(a, ""));
    if (de == null || !Number.isFinite(de)) return;
    if (B.current === de && E.length > 0) {
      const ie = Date.now(), te = E[E.length - 1]?.t ?? 0;
      if (ie - te < 4e3) return;
    }
    B.current = de;
    const Y = Date.now();
    N((ie) => [...ie, { t: Y, v: de }].slice(-c)), O(Y);
  }, [a, b, w, j, g, _, m, v, c]);
  const P = d ? Math.max(h, c * 2) : c * 2, { series: G, ghost: X } = y.useMemo(() => {
    const W = S.length ? S[S.length - 1].t : 0, se = E.filter((A) => A.t > W + 250), ue = S.length ? [...S, ...se] : se, de = ub(ue), Y = de.length > P ? de.slice(-P) : de;
    if (!d) return { series: Y, ghost: [] };
    const ie = o * 3600 * 1e3, te = Date.now() - ie;
    return {
      series: Y.filter((A) => A.t >= te),
      ghost: t1(Y, o)
    };
  }, [S, E, P, d, o]);
  return { series: G, lastSyncAt: C, ghost: X };
}
const n1 = [1, 6, 24, 48], fb = "dsc_chart_hours";
function a1() {
  try {
    const a = sessionStorage.getItem(fb), i = Number(a);
    if (Number.isFinite(i) && i > 0 && i <= 48) return i;
  } catch {
  }
  return 6;
}
function nl(a = 6) {
  const [i, c] = y.useState(() => a1() || a), o = y.useCallback((f) => {
    c(f);
    try {
      sessionStorage.setItem(fb, String(f));
    } catch {
    }
  }, []), d = i <= 1 ? 60 : i <= 6 ? 96 : i <= 24 ? 144 : 192;
  return { hours: i, setHours: o, maxPoints: d };
}
const hb = "dsc-hub-snooze:";
function Gu(a) {
  try {
    const i = localStorage.getItem(hb + a);
    if (!i) return {};
    const c = JSON.parse(i);
    return !c || typeof c != "object" ? {} : c;
  } catch {
    return {};
  }
}
function t_(a, i) {
  try {
    localStorage.setItem(hb + a, JSON.stringify(i));
  } catch {
  }
}
function cr() {
  const { entity: a, tick: i } = Ce(), c = a("sensor.dsc_hub_uptime")?.last_changed || "noboot", o = y.useMemo(() => Gu(c), [c, i]), d = y.useCallback((m) => !!o[m], [o]), f = y.useCallback(
    (m) => {
      if (!m) return;
      const _ = { ...Gu(c), [m]: !0 };
      t_(c, _);
    },
    [c]
  ), h = y.useCallback(
    (m) => {
      const _ = { ...Gu(c) };
      delete _[m], t_(c, _);
    },
    [c]
  );
  return { bootKey: c, isSnoozed: d, snooze: f, unsnooze: h };
}
const ri = "#66bb6a", mb = "#ffb74d", Is = "#ef5350", rr = "#26c6da", yd = "#8b95a8";
function Vu(a) {
  const i = Number.isFinite(a) ? a : 25;
  return [
    { from: 10, color: rr },
    { from: i - 2, color: ri },
    { from: i + 2, color: Is }
  ];
}
function Yu(a, i) {
  return !Number.isFinite(a) || !Number.isFinite(i) ? [{ from: 0, color: yd }] : [
    { from: 0, color: mb },
    { from: a, color: ri },
    { from: i, color: Is }
  ];
}
function n_(a, i) {
  return !Number.isFinite(a) || !Number.isFinite(i) ? [{ from: 0, color: yd }] : [
    { from: 0, color: rr },
    { from: a, color: ri },
    { from: i, color: Is }
  ];
}
function s1(a, i) {
  return !Number.isFinite(a) || !Number.isFinite(i) ? [{ from: 10, color: yd }] : [
    { from: 10, color: rr },
    { from: a, color: ri },
    { from: i, color: Is }
  ];
}
function l1(a = 30, i = 75) {
  return [
    { from: 0, color: Is },
    { from: a, color: mb },
    { from: 45, color: ri },
    { from: i, color: rr },
    { from: 90, color: Is }
  ];
}
function i1(a, i, c) {
  if (!a.length) return c;
  const o = [...a].sort((f, h) => f.from - h.from);
  let d = o[0].color;
  for (const f of o)
    i >= f.from && (d = f.color);
  return d;
}
const Oc = [
  "var(--dsc-neon)",
  "var(--dsc-teal)",
  "var(--dsc-amber)",
  "var(--dsc-gray-5)"
];
function a_(a) {
  const i = Math.max(...a, 1), c = 10 ** Math.floor(Math.log10(i));
  return Math.ceil(i / c) * c;
}
function s_(a, i = !1) {
  const c = Math.min(...a);
  if (i && c >= 0) return 0;
  const o = Math.abs(c) || 1, d = 10 ** Math.floor(Math.log10(o));
  return Math.floor(c / d) * d;
}
function l_(a, i, c = 0.08) {
  if (!Number.isFinite(a) || !Number.isFinite(i)) return { min: 0, max: 1 };
  if (i <= a) return { min: a - 1, max: i + 1 };
  const d = (i - a) * c || 1;
  return { min: a - d, max: i + d };
}
function Zc(a, i, c, o, d, f, h, m) {
  const _ = Math.max(f - d, 1e-6), b = Math.max(m - h, 1), v = i - o.l - o.r, g = c - o.t - o.b;
  return {
    x: o.l + (a.t - h) / b * v,
    y: o.t + (1 - (a.v - d) / _) * g
  };
}
function c1(a, i, c, o, d, f, h, m, _ = !1) {
  return a.length ? a.map((b, v) => {
    const { x: g, y: j } = Zc(b, i, c, o, d, f, h, m);
    if (v === 0) return `M${g.toFixed(1)} ${j.toFixed(1)}`;
    if (!_) return `L${g.toFixed(1)} ${j.toFixed(1)}`;
    const w = Zc(a[v - 1], i, c, o, d, f, h, m);
    return `L${g.toFixed(1)} ${w.y.toFixed(1)} L${g.toFixed(1)} ${j.toFixed(1)}`;
  }).join(" ") : "";
}
function r1(a, i, c) {
  if (!i || !Number.isFinite(a)) return c;
  const d = Math.max(i.max - i.min, 1e-6) * 0.12;
  return a < i.min || a > i.max ? "var(--dsc-bad)" : a < i.min + d || a > i.max - d ? "var(--dsc-amber)" : c;
}
function o1(a, i, c, o, d, f, h, m, _, b, v = !1) {
  if (a.length < 2) return [];
  const g = [];
  for (let j = 1; j < a.length; j++) {
    const w = a[j - 1], S = a[j], E = Zc(w, i, c, o, d, f, h, m), N = Zc(S, i, c, o, d, f, h, m), C = r1(S.v, _, b), O = v ? `M${E.x.toFixed(1)} ${E.y.toFixed(1)} L${N.x.toFixed(1)} ${E.y.toFixed(1)} L${N.x.toFixed(1)} ${N.y.toFixed(1)}` : `M${E.x.toFixed(1)} ${E.y.toFixed(1)} L${N.x.toFixed(1)} ${N.y.toFixed(1)}`, B = g[g.length - 1];
    B && B.color === C ? B.d += O.slice(1) : g.push({ d: O, color: C });
  }
  return g;
}
function i_(a) {
  const i = new Date(a), c = String(i.getHours()).padStart(2, "0"), o = String(i.getMinutes()).padStart(2, "0");
  return `${c}:${o}`;
}
function ns(a, i, c, o, d) {
  const f = Math.max(c - i, 1e-6);
  return d.t + (1 - (a - i) / f) * (o - d.t - d.b);
}
function c_(a, i, c) {
  if (c?.min != null && c?.max != null) return { min: c.min, max: c.max };
  const o = a.filter((d) => (d.axis || "left") === i).flatMap((d) => d.series.map((f) => f.v));
  if (!o.length)
    return i === "right" ? { min: 0, max: 100 } : { min: 0, max: 1 };
  if (i === "right") {
    const d = Math.min(...o, 0);
    return Math.max(...o, 100) <= 100 && d >= 0 ? { min: 0, max: 100 } : l_(s_(o, !0), a_(o));
  }
  return l_(s_(o), a_(o));
}
function wn({
  series: a,
  height: i = 180,
  unit: c = "",
  live: o = !0,
  emptyLabel: d = "thin recorder",
  lastSyncAt: f,
  targets: h = [],
  yDomain: m
}) {
  const _ = y.useId().replace(/:/g, ""), b = 640, v = a.some((A) => A.axis === "right"), g = { l: 40, r: v ? 40 : 14, t: 16, b: 28 }, j = y.useRef(null), [w, S] = y.useState(null), [E, N] = y.useState(!1), C = y.useMemo(() => {
    const A = a.flatMap((k) => k.series);
    if (!A.length) return null;
    const T = c_(a, "left", m?.left), $ = c_(a, "right", m?.right), Q = Math.min(...A.map((k) => k.t)), ne = Math.max(...A.map((k) => k.t), Date.now()), le = a.map((k, F) => {
      const I = k.axis || "left", ae = I === "right" ? $ : T, me = k.color || Oc[F % Oc.length];
      return {
        ...k,
        axis: I,
        color: me,
        d: c1(k.series, b, i, g, ae.min, ae.max, Q, ne, k.step),
        segs: k.ghost ? [] : o1(k.series, b, i, g, ae.min, ae.max, Q, ne, k.band, me, k.step),
        last: k.series.length ? k.series[k.series.length - 1] : null,
        ext: Rn(k.series),
        dom: ae
      };
    });
    return { left: T, right: $, t0: Q, t1: ne, paths: le };
  }, [a, i, v, m]), O = y.useMemo(() => {
    if (!C) return [];
    const A = 4, T = [];
    for (let $ = 0; $ <= A; $++) {
      const Q = $ / A, ne = C.left.max - Q * (C.left.max - C.left.min), le = g.t + Q * (i - g.t - g.b);
      T.push({ y: le, label: ne.toFixed(Math.abs(ne) >= 100 ? 0 : 1) });
    }
    return T;
  }, [C, i]), B = y.useMemo(() => {
    if (!C || !v) return [];
    const A = 4, T = [];
    for (let $ = 0; $ <= A; $++) {
      const Q = $ / A, ne = C.right.max - Q * (C.right.max - C.right.min), le = g.t + Q * (i - g.t - g.b);
      T.push({ y: le, label: ne.toFixed(Math.abs(ne) >= 100 ? 0 : 1) });
    }
    return T;
  }, [C, i, v]), J = y.useMemo(() => {
    if (!C) return [];
    const A = 5, T = [], $ = Math.max(C.t1 - C.t0, 1), Q = b - g.l - g.r;
    for (let ne = 0; ne < A; ne++) {
      const le = ne / (A - 1), k = C.t0 + le * $;
      T.push({ x: g.l + le * Q, label: i_(k) });
    }
    return T;
  }, [C]), P = y.useCallback(
    (A) => {
      const T = j.current;
      if (!T || !C) return null;
      const $ = T.getBoundingClientRect(), Q = (A - $.left) / Math.max($.width, 1) * b, ne = b - g.l - g.r, le = Math.min(b - g.r, Math.max(g.l, Q)), k = (le - g.l) / Math.max(ne, 1);
      return { t: C.t0 + k * Math.max(C.t1 - C.t0, 1), x: le };
    },
    [C]
  ), G = (A) => {
    if (E) return;
    const T = P(A.clientX);
    T && S(T);
  }, X = () => {
    E || S(null);
  }, W = (A) => {
    const T = P(A.clientX);
    if (T) {
      if (E && w && Math.abs(w.x - T.x) < 8) {
        N(!1), S(null);
        return;
      }
      N(!0), S(T);
    }
  }, se = y.useMemo(() => !C || !w ? [] : C.paths.map((A) => {
    if (!A.series.length) return { id: A.id, label: A.label, color: A.color, v: null, unit: A.unit || "" };
    let T = A.series[0], $ = Math.abs(T.t - w.t);
    for (const ne of A.series) {
      const le = Math.abs(ne.t - w.t);
      le < $ && (T = ne, $ = le);
    }
    const Q = ns(T.v, A.dom.min, A.dom.max, i, g);
    return {
      id: A.id,
      label: A.label,
      color: A.color,
      v: T.v,
      unit: A.unit || "",
      y: Q,
      x: g.l + (T.t - C.t0) / Math.max(C.t1 - C.t0, 1) * (b - g.l - g.r)
    };
  }), [C, w, i]), ue = C ? `${C.t0}-${C.t1}-${C.paths.map((A) => A.d).join("|")}` : "empty", de = pb(ue), Y = b * 1.4, ie = _b(Y, de), te = C?.paths[0]?.last?.v ?? null;
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-chart", style: { position: "relative", width: "100%" }, children: [
    /* @__PURE__ */ l.jsxs(
      "svg",
      {
        ref: j,
        viewBox: `0 0 ${b} ${i}`,
        width: "100%",
        height: i,
        role: "img",
        "aria-label": "Live chart",
        className: "dsc-chart-svg",
        onPointerMove: G,
        onPointerLeave: X,
        onPointerDown: W,
        children: [
          /* @__PURE__ */ l.jsxs("defs", { children: [
            C?.paths.map((A) => /* @__PURE__ */ l.jsxs("linearGradient", { id: `fill-${_}-${A.id}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ l.jsx("stop", { offset: "0%", stopColor: A.color, stopOpacity: "0.28" }),
              /* @__PURE__ */ l.jsx("stop", { offset: "100%", stopColor: A.color, stopOpacity: "0" })
            ] }, A.id)),
            /* @__PURE__ */ l.jsxs("filter", { id: `glow-${_}`, x: "-40%", y: "-40%", width: "180%", height: "180%", children: [
              /* @__PURE__ */ l.jsx("feGaussianBlur", { stdDeviation: "2.8", result: "b" }),
              /* @__PURE__ */ l.jsxs("feMerge", { children: [
                /* @__PURE__ */ l.jsx("feMergeNode", { in: "b" }),
                /* @__PURE__ */ l.jsx("feMergeNode", { in: "SourceGraphic" })
              ] })
            ] }),
            /* @__PURE__ */ l.jsxs("filter", { id: `glow-soft-${_}`, x: "-50%", y: "-50%", width: "200%", height: "200%", children: [
              /* @__PURE__ */ l.jsx("feGaussianBlur", { stdDeviation: "4.2", result: "b" }),
              /* @__PURE__ */ l.jsx("feMerge", { children: /* @__PURE__ */ l.jsx("feMergeNode", { in: "b" }) })
            ] })
          ] }),
          O.map((A) => /* @__PURE__ */ l.jsxs("g", { children: [
            /* @__PURE__ */ l.jsx(
              "line",
              {
                x1: g.l,
                x2: b - g.r,
                y1: A.y,
                y2: A.y,
                stroke: "var(--dsc-gray-3)",
                strokeWidth: "1",
                strokeDasharray: "3 4"
              }
            ),
            /* @__PURE__ */ l.jsx(
              "text",
              {
                x: g.l - 6,
                y: A.y + 3,
                textAnchor: "end",
                fill: "var(--dsc-gray-5)",
                fontSize: "9",
                fontFamily: "var(--dsc-mono)",
                children: A.label
              }
            )
          ] }, `L${A.y}`)),
          B.map((A) => /* @__PURE__ */ l.jsx(
            "text",
            {
              x: b - g.r + 6,
              y: A.y + 3,
              textAnchor: "start",
              fill: "var(--dsc-teal)",
              fontSize: "9",
              fontFamily: "var(--dsc-mono)",
              opacity: 0.85,
              children: A.label
            },
            `R${A.y}`
          )),
          J.map((A) => /* @__PURE__ */ l.jsx(
            "text",
            {
              x: A.x,
              y: i - 8,
              textAnchor: "middle",
              fill: "var(--dsc-gray-5)",
              fontSize: "9",
              fontFamily: "var(--dsc-mono)",
              children: A.label
            },
            A.x
          )),
          C ? /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
            h.map((A, T) => {
              const $ = A.axis || "left", Q = $ === "right" ? C.right : C.left, ne = A.color || ($ === "right" ? "var(--dsc-teal)" : "var(--dsc-amber)");
              if (A.min != null && A.max != null) {
                const k = ns(A.max, Q.min, Q.max, i, g), F = ns(A.min, Q.min, Q.max, i, g);
                return /* @__PURE__ */ l.jsxs("g", { children: [
                  /* @__PURE__ */ l.jsx(
                    "rect",
                    {
                      x: g.l,
                      y: Math.min(k, F),
                      width: b - g.l - g.r,
                      height: Math.abs(F - k),
                      fill: ne,
                      opacity: 0.08
                    }
                  ),
                  /* @__PURE__ */ l.jsx(
                    "line",
                    {
                      x1: g.l,
                      x2: b - g.r,
                      y1: k,
                      y2: k,
                      stroke: ne,
                      strokeWidth: "1",
                      strokeDasharray: "4 4",
                      opacity: 0.7
                    }
                  ),
                  /* @__PURE__ */ l.jsx(
                    "line",
                    {
                      x1: g.l,
                      x2: b - g.r,
                      y1: F,
                      y2: F,
                      stroke: ne,
                      strokeWidth: "1",
                      strokeDasharray: "4 4",
                      opacity: 0.7
                    }
                  )
                ] }, `tg-${T}`);
              }
              if (A.value == null || !Number.isFinite(A.value)) return null;
              const le = ns(A.value, Q.min, Q.max, i, g);
              return /* @__PURE__ */ l.jsxs("g", { children: [
                /* @__PURE__ */ l.jsx(
                  "line",
                  {
                    x1: g.l,
                    x2: b - g.r,
                    y1: le,
                    y2: le,
                    stroke: ne,
                    strokeWidth: "1.2",
                    strokeDasharray: "5 4",
                    opacity: 0.85
                  }
                ),
                A.label ? /* @__PURE__ */ l.jsx(
                  "text",
                  {
                    x: b - g.r - 2,
                    y: le - 4,
                    textAnchor: "end",
                    fill: ne,
                    fontSize: "8",
                    fontFamily: "var(--dsc-mono)",
                    children: A.label
                  }
                ) : null
              ] }, `tg-${T}`);
            }),
            C.paths.map((A) => {
              if (!A.d || A.series.length === 0) return null;
              const T = A.last, $ = T && C ? g.l + (T.t - C.t0) / Math.max(C.t1 - C.t0, 1) * (b - g.l - g.r) : 0, Q = T ? ns(T.v, A.dom.min, A.dom.max, i, g) : 0, ne = A.segs.length ? A.segs : [{ d: A.d, color: A.color }];
              return /* @__PURE__ */ l.jsxs("g", { className: "dsc-chart-series", children: [
                A.ghost ? /* @__PURE__ */ l.jsx(
                  "path",
                  {
                    d: A.d,
                    fill: "none",
                    stroke: A.color,
                    strokeWidth: 1.6,
                    strokeLinejoin: "round",
                    strokeLinecap: "round",
                    strokeDasharray: ie.dasharray,
                    strokeDashoffset: ie.dashoffset,
                    opacity: 0.55,
                    className: "dsc-chart-core"
                  }
                ) : ne.map((le, k) => /* @__PURE__ */ l.jsx(
                  "path",
                  {
                    d: le.d,
                    fill: "none",
                    stroke: le.color,
                    strokeWidth: 2.2,
                    strokeLinejoin: "round",
                    strokeLinecap: "round",
                    strokeDasharray: ie.dasharray,
                    strokeDashoffset: ie.dashoffset,
                    filter: `url(#glow-${_})`,
                    opacity: 0.95,
                    className: "dsc-chart-core"
                  },
                  `${A.id}-seg-${k}`
                )),
                o && T ? /* @__PURE__ */ l.jsx("circle", { cx: $, cy: Q, r: 3, fill: A.color, opacity: 0.9, className: "dsc-chart-tip" }) : null,
                A.ext.min != null ? /* @__PURE__ */ l.jsxs(
                  "text",
                  {
                    x: g.l + 2,
                    y: ns(A.ext.min, A.dom.min, A.dom.max, i, g) + 8,
                    fill: A.color,
                    fontSize: "8",
                    opacity: 0.7,
                    children: [
                      "min ",
                      A.ext.min.toFixed(A.ext.min >= 100 ? 0 : 1)
                    ]
                  }
                ) : null,
                A.ext.max != null ? /* @__PURE__ */ l.jsxs(
                  "text",
                  {
                    x: g.l + 2,
                    y: ns(A.ext.max, A.dom.min, A.dom.max, i, g) - 3,
                    fill: A.color,
                    fontSize: "8",
                    opacity: 0.7,
                    children: [
                      "max ",
                      A.ext.max.toFixed(A.ext.max >= 100 ? 0 : 1)
                    ]
                  }
                ) : null
              ] }, A.id);
            }),
            w ? /* @__PURE__ */ l.jsxs("g", { className: "dsc-chart-crosshair", children: [
              /* @__PURE__ */ l.jsx(
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
              se.map(
                (A) => A.v == null || A.y == null ? null : /* @__PURE__ */ l.jsx(
                  "circle",
                  {
                    cx: A.x ?? w.x,
                    cy: A.y,
                    r: 4,
                    fill: A.color,
                    stroke: "var(--dsc-black)",
                    strokeWidth: "1"
                  },
                  A.id
                )
              )
            ] }) : null
          ] }) : /* @__PURE__ */ l.jsx(
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
    w && C ? /* @__PURE__ */ l.jsxs(
      "div",
      {
        className: "dsc-chart-tooltip",
        style: {
          left: `${Math.min(92, Math.max(8, w.x / b * 100))}%`
        },
        children: [
          /* @__PURE__ */ l.jsx("div", { className: "dsc-chart-tooltip-time", children: i_(w.t) }),
          se.map(
            (A) => A.v == null ? null : /* @__PURE__ */ l.jsxs("div", { className: "dsc-chart-tooltip-row", children: [
              /* @__PURE__ */ l.jsx("i", { style: { background: A.color } }),
              /* @__PURE__ */ l.jsxs("span", { children: [
                A.label || A.id,
                " ",
                A.v.toFixed(A.v >= 100 ? 0 : 1),
                A.unit ? ` ${A.unit}` : ""
              ] })
            ] }, A.id)
          )
        ]
      }
    ) : null,
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-chart-legend", children: [
      a.filter((A) => A.label).map((A, T) => /* @__PURE__ */ l.jsxs("span", { className: "dsc-chart-legend-item", children: [
        /* @__PURE__ */ l.jsx("i", { style: { background: A.color || Oc[T % Oc.length] } }),
        A.label
      ] }, A.id)),
      te != null ? /* @__PURE__ */ l.jsxs("span", { className: "dsc-chart-last", children: [
        te.toFixed(1),
        c ? ` ${c}` : a[0]?.unit ? ` ${a[0].unit}` : ""
      ] }) : null
    ] })
  ] });
}
function ed(a, i = 280) {
  const [c, o] = y.useState(a);
  return y.useEffect(() => {
    if (!Number.isFinite(a)) {
      o(a);
      return;
    }
    if (typeof window < "u" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      o(a);
      return;
    }
    const d = Number.isFinite(c) ? c : a, f = performance.now();
    let h = 0;
    const m = (_) => {
      const b = Math.min(1, (_ - f) / i), v = 1 - (1 - b) ** 3;
      o(d + (a - d) * v), b < 1 && (h = requestAnimationFrame(m));
    };
    return h = requestAnimationFrame(m), () => cancelAnimationFrame(h);
  }, [a, i]), c;
}
function pb(a, i = 520) {
  const [c, o] = y.useState(0);
  return y.useEffect(() => {
    if (typeof window < "u" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      o(1);
      return;
    }
    o(0);
    const d = performance.now();
    let f = 0;
    const h = (m) => {
      const _ = Math.min(1, (m - d) / i);
      o(1 - (1 - _) ** 3), _ < 1 && (f = requestAnimationFrame(h));
    };
    return f = requestAnimationFrame(h), () => cancelAnimationFrame(f);
  }, [a, i]), c;
}
function _b(a, i) {
  const c = Math.max(a, 1);
  return { dasharray: `${c}`, dashoffset: c * (1 - i) };
}
function Kc(a, i, c, o) {
  return { x: a + c * Math.cos(o), y: i + c * Math.sin(o) };
}
function td(a, i, c) {
  const o = Math.min(1, Math.max(0, (a - i) / Math.max(c - i, 1e-6)));
  return Math.PI - o * Math.PI;
}
function u1(a, i, c, o, d, f, h) {
  const m = td(i, c, o), _ = td(a, c, o), b = Kc(d, f, h, m), v = Kc(d, f, h, _);
  return `M ${b.x.toFixed(2)} ${b.y.toFixed(2)} A ${h} ${h} 0 0 1 ${v.x.toFixed(2)} ${v.y.toFixed(2)}`;
}
function d1(a, i, c, o, d, f) {
  const h = [...a].sort((_, b) => _.from - b.from), m = [];
  for (let _ = 0; _ < h.length; _++) {
    const b = Math.max(i, h[_].from), v = Math.min(c, _ < h.length - 1 ? h[_ + 1].from : c);
    v <= b || m.push({
      d: u1(b, v, i, c, o, d, f),
      color: h[_].color
    });
  }
  return m;
}
const _n = {
  track: "#243044",
  teal: "#26c6da",
  amber: "#ffb74d",
  bad: "#ef5350",
  gray4: "#8b95a8",
  gray5: "#8b95a8",
  white: "#e8eef8"
};
function Xe({
  value: a,
  min: i = 0,
  max: c = 100,
  label: o,
  unit: d = "",
  target: f,
  band: h,
  segments: m,
  extrema: _,
  stale: b,
  onClick: v
}) {
  const g = Number.isFinite(a) ? a : NaN, j = ed(Number.isFinite(g) ? g : i), w = Number.isFinite(g) ? j : i, S = Math.min(c, Math.max(i, w)), E = Math.max(c - i, 1e-6), N = Number.isFinite(g) ? (S - i) / E : 0, C = 46, O = 2 * Math.PI * C * 0.75, B = O * N, J = (Y) => td(Y, i, c), P = rb({
    value: g,
    band: h,
    margin: h ? Math.max((h.max - h.min) * 0.12, 0.05) : void 0,
    stale: b,
    available: Number.isFinite(g)
  }), G = Jy(P), X = m?.length ? d1(m, i, c, 60, 72, C) : [], W = Number.isFinite(g) ? b ? _n.amber : m?.length ? i1(m, g, _n.teal) : P === "critical" ? _n.bad : P === "warn" ? _n.amber : _n.teal : _n.gray4, se = `dsc-gauge-glow-${y.useId().replace(/:/g, "")}`, ue = [];
  h && ue.push({ v: h.min, kind: "band" }, { v: h.max, kind: "band" }), _?.min != null && ue.push({ v: _.min, kind: "ext" }), _?.max != null && ue.push({ v: _.max, kind: "ext" }), f != null && Number.isFinite(f) && ue.push({ v: f, kind: "target" });
  const de = /* @__PURE__ */ l.jsxs(
    "div",
    {
      className: `dsc-gauge ${G}${b ? " is-stale" : ""}${v ? " is-clickable" : ""}`,
      children: [
        /* @__PURE__ */ l.jsxs("svg", { viewBox: "0 0 120 90", width: "140", height: "105", "aria-label": o, children: [
          /* @__PURE__ */ l.jsx("defs", { children: /* @__PURE__ */ l.jsxs("filter", { id: se, x: "-40%", y: "-40%", width: "180%", height: "180%", children: [
            /* @__PURE__ */ l.jsx("feGaussianBlur", { stdDeviation: "3.2", result: "b" }),
            /* @__PURE__ */ l.jsxs("feMerge", { children: [
              /* @__PURE__ */ l.jsx("feMergeNode", { in: "b" }),
              /* @__PURE__ */ l.jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] }) }),
          X.length ? X.map((Y, ie) => /* @__PURE__ */ l.jsx(
            "path",
            {
              d: Y.d,
              fill: "none",
              stroke: Y.color,
              strokeWidth: "10",
              strokeLinecap: "butt",
              opacity: 0.38
            },
            `seg-${ie}`
          )) : /* @__PURE__ */ l.jsx(
            "path",
            {
              d: "M18 72 A46 46 0 1 1 102 72",
              fill: "none",
              stroke: _n.track,
              strokeWidth: "10",
              strokeLinecap: "round"
            }
          ),
          /* @__PURE__ */ l.jsx(
            "path",
            {
              className: "dsc-gauge-value",
              d: "M18 72 A46 46 0 1 1 102 72",
              fill: "none",
              stroke: W,
              strokeWidth: "10",
              strokeLinecap: "round",
              strokeDasharray: `${B} ${O}`,
              filter: `url(#${se})`,
              style: { transition: "stroke-dasharray 280ms ease, stroke 280ms ease" }
            }
          ),
          ue.map((Y, ie) => {
            const te = J(Y.v), A = Kc(60, 72, Y.kind === "ext" ? C - 2 : C + 1, te), T = Kc(60, 72, C - (Y.kind === "target" ? 14 : 10), te), $ = Y.kind === "target" ? _n.teal : Y.kind === "band" ? _n.amber : _n.gray5;
            return /* @__PURE__ */ l.jsx(
              "line",
              {
                x1: T.x,
                y1: T.y,
                x2: A.x,
                y2: A.y,
                stroke: $,
                strokeWidth: Y.kind === "target" ? 2.4 : 1.6,
                strokeLinecap: "round",
                opacity: Y.kind === "ext" ? 0.65 : 0.95
              },
              `${Y.kind}-${ie}`
            );
          }),
          /* @__PURE__ */ l.jsx(
            "text",
            {
              x: "60",
              y: "58",
              textAnchor: "middle",
              fill: _n.white,
              fontSize: "20",
              fontWeight: "700",
              fontFamily: "var(--dsc-mono)",
              children: Number.isFinite(g) ? g.toFixed(g >= 100 ? 0 : g < 10 ? 2 : 1) : "—"
            }
          ),
          /* @__PURE__ */ l.jsx("text", { x: "60", y: "74", textAnchor: "middle", fill: _n.gray5, fontSize: "10", children: b ? "HELD" : d })
        ] }),
        /* @__PURE__ */ l.jsx("div", { className: "dsc-gauge-label", children: o })
      ]
    }
  );
  return v ? /* @__PURE__ */ l.jsx("button", { type: "button", className: "dsc-gauge-hit", onClick: v, title: `History · ${o}`, children: de }) : de;
}
function bb({
  series: a,
  color: i = "var(--dsc-blue)",
  width: c = 120,
  height: o = 28
}) {
  const d = a.length ? `${a[0].t}-${a[a.length - 1].t}-${a.length}` : "empty", f = pb(d, 420);
  if (a.length < 2)
    return /* @__PURE__ */ l.jsx("div", { className: "dsc-sparkline dsc-muted", style: { width: c, height: o } });
  const h = a.map((N) => N.v), m = Math.min(...h), _ = Math.max(...h), b = Math.max(_ - m, 1e-6), v = a[0].t, g = a[a.length - 1].t, j = Math.max(g - v, 1), w = a.map((N, C) => {
    const O = (N.t - v) / j * c, B = o - (N.v - m) / b * (o - 4) - 2;
    return `${C === 0 ? "M" : "L"}${O.toFixed(1)} ${B.toFixed(1)}`;
  }).join(" "), S = c * 1.25, E = _b(S, f);
  return /* @__PURE__ */ l.jsx("svg", { className: "dsc-sparkline", width: c, height: o, "aria-hidden": !0, children: /* @__PURE__ */ l.jsx(
    "path",
    {
      d: w,
      fill: "none",
      stroke: i,
      strokeWidth: "1.6",
      strokeLinecap: "round",
      strokeDasharray: E.dasharray,
      strokeDashoffset: E.dashoffset
    }
  ) });
}
function f1({
  row: a
}) {
  const i = a.want != null ? a.want : a.wantMin != null && a.wantMax != null ? (a.wantMin + a.wantMax) / 2 : NaN, c = !!a.stale || !Number.isFinite(a.got), o = Math.max(
    c ? 0 : a.got,
    Number.isFinite(i) ? i : 0,
    a.wantMax ?? 0,
    1
  ), d = c ? 0 : a.got / o * 100, f = Number.isFinite(i) ? i / o * 100 : 0, h = ed(d), m = ed(f);
  return /* @__PURE__ */ l.jsxs("div", { className: `dsc-gotwant-row${c ? " is-stale" : ""}`, children: [
    /* @__PURE__ */ l.jsx("div", { className: "dsc-gotwant-label", children: a.label }),
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-gotwant-track", children: [
      Number.isFinite(i) ? /* @__PURE__ */ l.jsx("div", { className: "dsc-gotwant-want", style: { width: `${m}%` } }) : null,
      c ? null : /* @__PURE__ */ l.jsx("div", { className: "dsc-gotwant-got", style: { width: `${h}%` } })
    ] }),
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-gotwant-vals", children: [
      /* @__PURE__ */ l.jsxs("span", { children: [
        "Got ",
        c ? "—" : a.got.toFixed(1),
        c ? "" : a.unit || ""
      ] }),
      /* @__PURE__ */ l.jsxs("span", { className: "dsc-muted", children: [
        "Want",
        " ",
        a.wantMin != null && a.wantMax != null ? `${a.wantMin}–${a.wantMax}` : Number.isFinite(i) ? i.toFixed(1) : "—"
      ] })
    ] })
  ] });
}
function gb({
  rows: a
}) {
  return /* @__PURE__ */ l.jsx("div", { className: "dsc-gotwant", children: a.map((i) => /* @__PURE__ */ l.jsx(f1, { row: i }, i.label)) });
}
function Rn(a) {
  if (!a.length) return {};
  let i = a[0].v, c = a[0].v;
  for (const o of a)
    o.v < i && (i = o.v), o.v > c && (c = o.v);
  return { min: i, max: c };
}
const al = [
  { label: "Cycle", hours: 12 },
  { label: "Photo", hours: 18 }
];
function sl({
  hours: a,
  setHours: i,
  extras: c
}) {
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-timespan", role: "group", "aria-label": "Chart timespan", children: [
    n1.map((o) => /* @__PURE__ */ l.jsxs(
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
    (c || []).map((o) => /* @__PURE__ */ l.jsx(
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
function h1({
  open: a,
  onClose: i,
  entityId: c,
  label: o,
  unit: d = "",
  color: f = "var(--dsc-blue)"
}) {
  const { hours: h, setHours: m, maxPoints: _ } = nl(6), b = xe(c || "", { hours: h, maxPoints: _ }), v = h <= 18 ? h * 2 : Math.min(h + 24, 48), g = xe(c || "", { hours: v, maxPoints: _ }), j = y.useMemo(() => {
    const S = h * 3600 * 1e3, E = Date.now() - S;
    return g.series.filter((N) => N.t < E).map((N) => ({ t: N.t + S, v: N.v }));
  }, [g.series, h]), w = !c || b.series.length < 2;
  return /* @__PURE__ */ l.jsxs(
    cs,
    {
      open: a && !!c,
      onClose: i,
      title: o ? `History · ${o}` : "History",
      children: [
        /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: [
          /* @__PURE__ */ l.jsx(sl, { hours: h, setHours: m, extras: al }),
          w ? /* @__PURE__ */ l.jsx(D, { label: "Thin recorder", tone: "warn" }) : null,
          j.length > 1 ? /* @__PURE__ */ l.jsx(D, { label: "Prior window ghost", tone: "muted" }) : null
        ] }),
        c ? /* @__PURE__ */ l.jsx(
          wn,
          {
            live: !0,
            unit: d,
            lastSyncAt: b.lastSyncAt,
            series: [
              {
                id: c,
                label: o,
                series: b.series,
                color: f,
                unit: d
              },
              ...j.length > 1 ? [
                {
                  id: `${c}-ghost`,
                  label: `${o} prior`,
                  series: j,
                  color: f,
                  unit: d,
                  ghost: !0
                }
              ] : []
            ]
          }
        ) : null,
        /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", style: { marginTop: 10, fontSize: 12 }, children: c })
      ]
    }
  );
}
function Jc({
  entityId: a,
  hours: i = 24,
  onClick: c,
  label: o = "24h on/off"
}) {
  const { state: d, entity: f } = Ce(), { points: h, loading: m } = xd(a, i, 720), _ = d(a, "off") === "on" ? 1 : 0, b = Date.now(), v = b - i * 3600 * 1e3, g = y.useMemo(() => {
    const O = h.filter((B) => Number.isFinite(B.v));
    return (d(a, "") === "on" || d(a, "") === "off") && O.push({ t: b, v: _ }), ub(O, b);
  }, [h, b, _, d, a]), j = y.useMemo(() => {
    const O = [];
    let B = null;
    for (let J = 0; J < g.length; J++) {
      const P = g[J], G = P.v >= 0.5;
      G && B == null && (B = Math.max(P.t, v)), !G && B != null && (O.push({ start: B, end: P.t }), B = null);
    }
    return B != null && O.push({ start: B, end: b }), O.filter((J) => J.end > v && J.end > J.start);
  }, [g, b, v]), w = j.reduce((O, B) => O + (B.end - B.start), 0), S = j.length ? j[j.length - 1].start : null, E = f(a)?.last_changed, N = S ? new Date(S).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : E ? new Date(E).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—", C = /* @__PURE__ */ l.jsxs("div", { className: "dsc-duty-strip", children: [
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-duty-meta", children: [
      /* @__PURE__ */ l.jsx("span", { children: o }),
      /* @__PURE__ */ l.jsxs("span", { className: "dsc-muted", children: [
        j.length,
        " cycle",
        j.length === 1 ? "" : "s",
        " · last ",
        N,
        " ·",
        " ",
        m ? "…" : `${(w / 36e5).toFixed(1)}h on`
      ] })
    ] }),
    /* @__PURE__ */ l.jsxs("svg", { viewBox: `0 0 ${i} 18`, className: "dsc-duty-svg", preserveAspectRatio: "none", "aria-hidden": !0, children: [
      /* @__PURE__ */ l.jsx("rect", { x: "0", y: "5", width: i, height: "8", rx: "2", fill: "var(--dsc-gray-3)" }),
      j.map((O) => {
        const B = Math.max(0, (O.start - v) / 36e5), J = Math.max(0.04, (O.end - O.start) / 36e5);
        return /* @__PURE__ */ l.jsx("rect", { x: B, y: "5", width: J, height: "8", rx: "1.5", fill: "var(--dsc-teal)" }, O.start);
      })
    ] })
  ] });
  return c ? /* @__PURE__ */ l.jsx("button", { type: "button", className: "dsc-duty-hit", onClick: c, title: `History · ${o}`, children: C }) : C;
}
const m1 = {
  title: "Fleet version",
  what: "A reporting node is missing firmware or is off the expected major.minor train. Planned OOS nodes (AC, clone mister, POT3) are inventory, not this chip.",
  fix: "Open Fleet. Flash the drifted device. If the hole is unbuilt kit, leave in_service off — do not treat it as fail."
}, p1 = {
  title: "Out of service",
  what: "This lever is parked. Planned OOS (unbuilt AC / clone mister / POT3) is inventory. Unexpected OOS is a temp flag or operator lockout.",
  fix: "If the device is built and should run, turn in_service on from Fleet. Temp OOS / lockout: clear the flag after the soak. Unbuilt kit stays OOS — not an alarm."
}, _1 = {
  title: "Hub link",
  what: "The hub is not answering ESP-NOW / HA. Mission holds last-good vitals instead of inventing Got.",
  fix: "Check hub power, SoftAP/Nest channel, and Fleet firmware. Wait out a flap (25s cooldown) before chasing ghosts."
}, b1 = {
  title: "Panel link",
  what: "Control panel is not on ESP-NOW. HA-only is a degraded path, not a green wall.",
  fix: "Confirm Control firmware and ESP-NOW age on Fleet. If Wi-Fi RSSI is live, it is HA-only — not offline."
}, g1 = {
  title: "Heartbeat",
  what: "Hub heartbeat sensor is dark. Beat is the liveness pulse, separate from climate Got.",
  fix: "If hub link is also down, fix the hub first. If link is on but beat is dark, check sensor.dsc_hub_heartbeat and reboot the hub."
}, v1 = {
  title: "Kit node",
  what: "This spoke is inventory: running, idle, planned OOS, missing helper, or dark after the 25s offline cooldown.",
  fix: "OOS: leave it parked if unbuilt. Dark: wait the cooldown, then Fleet. Missing: the helper is not in HA yet."
}, Pc = {
  "binary_sensor.dsc_hub_emergency_failsafe": {
    title: "Emergency failsafe",
    what: "Hub failsafe is armed — climate is in a protective path, not Full Auto keep-up.",
    fix: "Open Mission, clear the cause (sensor fault, runaway heat), then cycle failsafe from the hub."
  },
  "binary_sensor.dsc_hub_climate_sensor_fault": {
    title: "Climate sensor fault",
    what: "Tent/room T or RH is untrusted. Do not invent Got or chase Want.",
    fix: "Check the DHT/probe, hold vitals, then Climate once the sensor is live."
  },
  "binary_sensor.dsc_hub_aux_sensor_fault": {
    title: "Aux sensor fault",
    what: "An auxiliary climate probe failed. Coupled mix may be incomplete.",
    fix: "Fleet → sensor honesty. Do not turn Full Auto up to compensate."
  },
  "binary_sensor.dsc_hub_root_zone_sensor_fault": {
    title: "Root-zone probes",
    what: "A pot probe the mat votes on is untrusted or missing.",
    fix: "Open Root. OOS the bad pot if it is hardware. Do not let it vote."
  },
  "binary_sensor.dsc_clone_dark_period_violation": {
    title: "2×4 dark violation",
    what: "SF1000 is on while the 2×4 window is closed (and catch-up is not covering it). Herm risk.",
    fix: "Open Light. Turn the lamp off or wait catch-up. Manual hold / takeover are intentional dark paths."
  },
  "binary_sensor.dsc_clone_light_missing_in_window": {
    title: "Light missing in window",
    what: "2×4 window is open but the SF1000 did not deliver. Photoperiod ledger is honest debt, not a fake bar.",
    fix: "Check SF1000, Auto photoperiod, and Light catch-up. Clone Off / takeover / manual hold skip this alert."
  },
  "binary_sensor.dsc_hub_coherence_mismatch": {
    title: "Coherence mismatch",
    what: "Hub and HA disagree on a commanded lever.",
    fix: "Fleet heal / re-push. Do not double-tap the same switch from two UIs."
  },
  "binary_sensor.dsc_nest_channel_split": {
    title: "Nest channel split",
    what: "SoftAP preferred BSSID and the associated AP are on different channels (CHX).",
    fix: "This is F-004 — lock is out of scope. SoftAP-primary is the heal path; do not fight the Nest channel."
  },
  "binary_sensor.dsc_humidifier_vent_conflict": {
    title: "Humidifier vent conflict",
    what: "Buying moisture while dumping outside. Wasteful; newer firmware clamps OUT.",
    fix: "Drop OUT or stop humidifier demand. Check Climate dump/recirc split."
  },
  "binary_sensor.dsc_heater_vent_conflict": {
    title: "Heater vent conflict",
    what: "Buying heat while dumping outside. Should be rare (heater interlock).",
    fix: "Close OUT or stop heater. Confirm the interlock on Climate."
  },
  "binary_sensor.dsc_humidifier_ineffective_suspect": {
    title: "Humidifier ineffective",
    what: "Humidifier ran and RH did not move enough to believe the lever.",
    fix: "Check water, fan path, and room lung. Do not leave demand on as theatre."
  },
  "binary_sensor.dsc_heater_ineffective_suspect": {
    title: "Heater ineffective",
    what: "Heater ran and tent T did not climb.",
    fix: "Check relay, dump CFM, and room lung. Transfer before buying more kW."
  },
  "binary_sensor.dsc_grow_mat_ineffective_suspect": {
    title: "Heat mat ineffective",
    what: "Mat ran and root T did not climb on in-service pots.",
    fix: "Open Root. Confirm mat demand vs relay, and that voting pots are in service."
  },
  "binary_sensor.dsc_plant_specs_incomplete": {
    title: "Plant specs incomplete",
    what: "Nameplate or volume helpers the physics budget needs are empty.",
    fix: "Tune → plant specs / Learning. Empty specs are honesty, not default CFM."
  },
  "binary_sensor.dsc_plant_specs_intake_over_exhaust": {
    title: "Intake over exhaust",
    what: "Nameplate intakes exceed exhaust capacity — mass balance cannot hold.",
    fix: "Lower intake nameplates or raise exhaust. Learning allocated CFM is the Got."
  },
  "binary_sensor.dsc_plant_specs_ac_capacity_missing": {
    title: "AC capacity missing",
    what: "AC is in service (or assumed) without a capacity number.",
    fix: "If AC is unbuilt, leave in_service off. If built, set the capacity spec."
  },
  "binary_sensor.dsc_plant_specs_dehum_rate_zero": {
    title: "Dehum rate 0",
    what: "Dehumidifier rate helper is zero — Full Auto cannot budget moisture.",
    fix: "Set the L/day spec, or stop claiming dehum keep-up."
  },
  "binary_sensor.dsc_plant_specs_hum_rate_zero": {
    title: "Hum rate 0",
    what: "Humidifier rate helper is zero.",
    fix: "Set the rate spec. Do not run demand with a zero budget."
  },
  "binary_sensor.dsc_plant_specs_heater_zero": {
    title: "Heater spec 0",
    what: "Heater capacity helper is zero.",
    fix: "Set the watt/BTU spec or stop using heater demand as keep-up."
  },
  "binary_sensor.dsc_tank_ec_out_of_range": {
    title: "Tank EC out of range",
    what: "Tank EC is outside the tank stage band.",
    fix: "Fleet tank tester. Do not invent a mix from a stale probe."
  },
  "binary_sensor.dsc_tank_ph_out_of_range": {
    title: "Tank pH out of range",
    what: "Tank pH left the stage band.",
    fix: "Correct the tank. Confirm the probe before dosing."
  },
  "binary_sensor.dsc_tank_water_too_warm": {
    title: "Tank too warm",
    what: "Reservoir temperature is high enough to invite biology you do not want.",
    fix: "Cool the tank / room lung. Do not ignore a live number."
  },
  "binary_sensor.dsc_hub_light_catchup_active": {
    title: "Light catch-up",
    what: "2×4 is paying photoperiod debt from the hub ledger. Hours gauge is Got.",
    fix: "Let catch-up finish. Do not stack a second fake progress bar."
  },
  "binary_sensor.dsc_reduced_kit": {
    title: "Unexpected reduced kit",
    what: "A lever that should be in service is temp-OOS or lockout — not the unbuilt AC/mister/POT3 inventory.",
    fix: "Clear temp OOS / operator lockout, or restore the unexpected pot. Planned holes stay OOS and must not pulse this chip."
  }
};
function zc(a) {
  return {
    [`binary_sensor.dsc_pot${a}_moisture_out_of_range`]: {
      title: `Pot ${a} moisture`,
      what: `Pot ${a} moisture left the Want/Need band.`,
      fix: "Open Root → that pot's inspector. OOS pots must not fake Got."
    },
    [`binary_sensor.dsc_pot${a}_ph_out_of_range`]: {
      title: `Pot ${a} pH`,
      what: `Pot ${a} pH left the Want band.`,
      fix: "Root inspector. Confirm the probe before dosing."
    },
    [`binary_sensor.dsc_pot${a}_root_zone_temp_out_of_range`]: {
      title: `Pot ${a} root T`,
      what: `Pot ${a} soil temperature left the trusted band.`,
      fix: "Mat / lung first. Do not run the mat if this pot is OOS."
    },
    [`binary_sensor.dsc_pot${a}_ec_salt_build_up`]: {
      title: `Pot ${a} salt build-up`,
      what: `Pot ${a} EC is high vs baseline.`,
      fix: "Root card. Flush vs feed from Need, not from a red chip."
    },
    [`binary_sensor.dsc_pot${a}_ec_depleted_vs_baseline`]: {
      title: `Pot ${a} EC depleted`,
      what: `Pot ${a} EC is low vs baseline.`,
      fix: "Feed from Need. Confirm the probe is trusted."
    },
    [`binary_sensor.dsc_pot${a}_nitrogen_below_baseline`]: {
      title: `Pot ${a} N below baseline`,
      what: `Pot ${a} nitrogen is below the rolling baseline.`,
      fix: "Root NPK. Do not act on an untrusted probe."
    },
    [`binary_sensor.dsc_pot${a}_nitrogen_depleting_fast`]: {
      title: `Pot ${a} N depleting`,
      what: `Pot ${a} nitrogen is falling faster than the rate band.`,
      fix: "Root rate spark. Check irrigation vs Need."
    }
  };
}
Object.assign(Pc, zc(1), zc(2), zc(3), zc(4));
function x1(a, i) {
  return Pc[a] ? Pc[a] : i === "fleet" || a === "sensor.dsc_fleet_version_status" ? m1 : i === "kit" ? v1 : a.includes("in_service") || a.endsWith("_oos") ? p1 : a.includes("hub_link") || a.includes("hub_uptime") ? _1 : a.includes("panel_link") || a.includes("control_wifi") ? b1 : a.includes("heartbeat") ? g1 : {
    title: a.split(".").pop()?.replace(/_/g, " ") || "Entity",
    what: "Got from Home Assistant. Click timespan / ghost in this drawer — do not invent a second dashboard.",
    fix: "If the number is wrong, fix the sensor or the Want. If it is unavailable, that is a hole, not a zero."
  };
}
const vb = Object.keys(Pc);
function Da(a) {
  if (!Number.isFinite(a) || a < 0) return "—";
  const i = Math.floor(a / 1e3);
  if (i < 60) return `${Math.max(1, i)}S`;
  const c = Math.floor(i / 60);
  if (c < 60) return `${c}M`;
  const o = Math.floor(c / 60), d = c % 60;
  return o < 48 ? d > 0 ? `${o}H ${d}M` : `${o}H` : `${(o / 24).toFixed(1)}D`;
}
function y1(a, i, c) {
  if (i === "binary" || i === "alert" || a.startsWith("binary_sensor.") || a.startsWith("switch.") || a.startsWith("light."))
    return !0;
  const o = (c || "").toLowerCase();
  return o === "on" || o === "off";
}
function w1({
  target: a,
  onClose: i
}) {
  const { state: c, num: o, available: d, entity: f } = Ce(), { callService: h } = Xt(), { hours: m, setHours: _, maxPoints: b } = nl(6), { isSnoozed: v, snooze: g, unsnooze: j } = cr(), w = a?.entityId ?? "", S = w ? c(w, "") : "", E = a ? y1(w, a.kind, S) : !1, N = xe(w, { hours: E ? 24 : m, maxPoints: E ? 288 : b }), C = m <= 18 ? m * 2 : Math.min(m + 24, 48), O = xe(w, { hours: C, maxPoints: b }), B = y.useMemo(() => {
    const A = m * 3600 * 1e3, T = Date.now() - A;
    return O.series.filter(($) => $.t < T).map(($) => ({ t: $.t + A, v: $.v }));
  }, [O.series, m]);
  if (!a) return null;
  const J = x1(a.entityId, a.kind), P = f(a.entityId), G = P?.last_changed ? Date.parse(P.last_changed) : NaN, X = Number.isFinite(G) ? Da(Date.now() - G) + " ago" : "—", W = N.series.length < 2, se = v(a.entityId), ue = a.runtimeToday ? o(a.runtimeToday) : NaN, de = a.cyclesToday ? o(a.cyclesToday) : NaN, Y = a.demandEntity, ie = a.entityId.split(".")[0], te = ie === "switch" || ie === "light" || ie === "input_boolean";
  return /* @__PURE__ */ l.jsxs(cs, { open: !!a.entityId, onClose: i, title: a.label, children: [
    /* @__PURE__ */ l.jsxs("p", { className: "dsc-muted", style: { marginTop: 0, fontFamily: "var(--dsc-mono)", fontSize: 12 }, children: [
      a.entityId,
      d(a.entityId) ? "" : " · unavailable"
    ] }),
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ l.jsx(D, { label: `Last ${X}`, tone: "muted" }),
      Number.isFinite(ue) ? /* @__PURE__ */ l.jsx(D, { label: `Today ${ue.toFixed(2)}h`, tone: "ok" }) : null,
      Number.isFinite(de) ? /* @__PURE__ */ l.jsx(D, { label: `${Math.round(de)} cycles`, tone: "muted" }) : null,
      /* @__PURE__ */ l.jsx(
        D,
        {
          label: S && S !== "—" ? String(S) : "no state",
          tone: S === "on" ? "ok" : S === "off" ? "muted" : "warn"
        }
      )
    ] }),
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-inspector-playbook", children: [
      /* @__PURE__ */ l.jsx("strong", { children: J.title }),
      /* @__PURE__ */ l.jsx("p", { children: J.what }),
      /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", children: J.fix })
    ] }),
    a.kind === "alert" || a.entityId.startsWith("binary_sensor.") ? /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", style: { margin: "10px 0" }, children: [
      se ? /* @__PURE__ */ l.jsx(ce, { onClick: () => j(a.entityId), children: "Unsnooze" }) : /* @__PURE__ */ l.jsx(ce, { onClick: () => g(a.entityId), children: "Acknowledge until hub reboot" }),
      se ? /* @__PURE__ */ l.jsx(D, { label: "Snoozed this boot", tone: "warn" }) : null
    ] }) : null,
    te ? /* @__PURE__ */ l.jsx("div", { className: "dsc-chip-row", style: { marginBottom: 10 }, children: /* @__PURE__ */ l.jsx(
      ce,
      {
        primary: !0,
        onClick: () => void h(ie, S === "on" ? "turn_off" : "turn_on", {
          entity_id: a.entityId
        }),
        children: S === "on" ? "Turn off" : "Turn on"
      }
    ) }) : null,
    E || Y ? /* @__PURE__ */ l.jsx(Jc, { entityId: Y || a.entityId, hours: 24 }) : null,
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", style: { margin: "12px 0" }, children: [
      /* @__PURE__ */ l.jsx(sl, { hours: m, setHours: _, extras: al }),
      W ? /* @__PURE__ */ l.jsx(D, { label: "Thin recorder", tone: "warn" }) : null,
      B.length > 1 ? /* @__PURE__ */ l.jsx(D, { label: "Prior window ghost", tone: "muted" }) : null
    ] }),
    /* @__PURE__ */ l.jsx(
      wn,
      {
        live: !0,
        unit: E ? "" : a.unit || "",
        lastSyncAt: N.lastSyncAt,
        yDomain: E ? { left: { min: 0, max: 1 } } : void 0,
        emptyLabel: "thin recorder",
        series: [
          {
            id: a.entityId,
            label: a.label,
            series: N.series,
            color: a.color || "var(--dsc-teal)",
            unit: E ? "" : a.unit,
            step: E
          },
          ...B.length > 1 ? [
            {
              id: `${a.entityId}-ghost`,
              label: `${a.label} prior`,
              series: B,
              color: a.color || "var(--dsc-teal)",
              unit: a.unit,
              ghost: !0
            }
          ] : []
        ]
      }
    )
  ] });
}
const xb = y.createContext(null);
function j1({ children: a }) {
  const [i, c] = y.useState(null), o = y.useCallback(() => c(null), []), d = y.useCallback((h) => c(h), []), f = y.useMemo(() => ({ open: d, close: o }), [d, o]);
  return /* @__PURE__ */ l.jsxs(xb.Provider, { value: f, children: [
    a,
    /* @__PURE__ */ l.jsx(w1, { target: i, onClose: o })
  ] });
}
function kn() {
  const a = y.useContext(xb);
  return a || {
    open: () => {
    },
    close: () => {
    }
  };
}
const S1 = {
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
  step: c,
  tone: o,
  hint: d,
  onLive: f
}) {
  const { state: h, available: m, attributes: _ } = Ws(a), { callService: b } = Xt(), v = m, g = Number(h), j = Number(_?.min ?? 0), w = Number(_?.max ?? 100), S = c ?? Number(_?.step ?? 0.1), [E, N] = y.useState(String(Number.isFinite(g) ? g : "")), C = y.useRef(!1);
  y.useEffect(() => {
    !C.current && Number.isFinite(g) && N(String(g));
  }, [g]);
  const O = () => {
    if (!v) return;
    const J = Number(E);
    if (!Number.isFinite(J)) {
      N(String(Number.isFinite(g) ? g : ""));
      return;
    }
    const P = Math.min(w, Math.max(j, J)), X = a.split(".")[0] === "input_number" ? "input_number" : "number";
    b(X, "set_value", { entity_id: a, value: P }), N(String(P));
  }, B = o === "critical" ? "is-bad" : o === "warn" ? "is-warn" : o === "muted" ? "is-muted" : "";
  return /* @__PURE__ */ l.jsxs("label", { className: `dsc-target-num${v ? "" : " is-disabled"} ${B}`.trim(), children: [
    /* @__PURE__ */ l.jsx("span", { className: "dsc-target-num-label", children: i }),
    /* @__PURE__ */ l.jsx(
      "input",
      {
        type: "number",
        value: E,
        disabled: !v,
        min: j,
        max: w,
        step: S,
        onFocus: () => {
          C.current = !0;
        },
        onChange: (J) => {
          N(J.target.value);
          const P = Number(J.target.value);
          Number.isFinite(P) && f?.(P);
        },
        onBlur: () => {
          C.current = !1, O();
        },
        onKeyDown: (J) => {
          J.key === "Enter" && J.target.blur();
        }
      }
    ),
    d ? /* @__PURE__ */ l.jsx("span", { className: "dsc-target-hint", children: d }) : null
  ] });
}
function qu({ tent: a, title: i, hero: c }) {
  const { num: o, state: d, entity: f } = Ce(), h = kn(), m = S1[a], _ = Iu(a, { state: d, entity: f }), b = _e(m.gotTemp), v = _e(m.gotRh), g = _e(m.gotVpd), j = b.stale ? NaN : b.value, w = v.stale ? NaN : v.value, S = g.stale ? NaN : g.value, E = o(m.temp), N = o(m.rhMin), C = o(m.rhMax), [O, B] = y.useState(E), [J, P] = y.useState(N), [G, X] = y.useState(C), [W, se] = y.useState(o(m.vpdMin)), [ue, de] = y.useState(o(m.vpdMax)), Y = Ra(O, _.temp), ie = Ra(J, _.rh, J > G), te = Ra(G, _.rh, J > G), A = Ra(W, _.vpd, W > ue), T = Ra(ue, _.vpd, W > ue), $ = (Q, ne, le) => {
    h.open({ entityId: Q, label: ne, unit: le });
  };
  return /* @__PURE__ */ l.jsxs("div", { className: `dsc-tent-targets${c ? " is-hero" : ""}`, children: [
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-tent-targets-head", children: [
      /* @__PURE__ */ l.jsx("strong", { children: i }),
      _.mixed ? /* @__PURE__ */ l.jsx(D, { label: "mixed stages", tone: "warn" }) : null,
      _.emptyLabel ? /* @__PURE__ */ l.jsx(D, { label: _.emptyLabel, tone: "muted" }) : null,
      _.stages.map((Q) => /* @__PURE__ */ l.jsx(D, { label: Q, tone: "muted" }, Q)),
      /* @__PURE__ */ l.jsx(
        sr,
        {
          label: `${i} more`,
          items: [
            { id: "temp", label: "Inspector · temp", onSelect: () => $(m.temp, `${i} Want T`, "°C") },
            { id: "rh", label: "Inspector · RH", onSelect: () => $(m.rhMin, `${i} RH min`, "%") },
            { id: "vpd", label: "Inspector · VPD", onSelect: () => $(m.vpdMin, `${i} VPD min`, "kPa") }
          ]
        }
      )
    ] }),
    /* @__PURE__ */ l.jsxs(
      "button",
      {
        type: "button",
        className: "dsc-got-want dsc-got-want-hit",
        onClick: () => $(m.gotTemp, `${i} Got T`, "°C"),
        children: [
          /* @__PURE__ */ l.jsxs("span", { children: [
            "Got ",
            Number.isFinite(j) ? `${j.toFixed(1)}°C` : "—",
            " /",
            " ",
            Number.isFinite(w) ? `${w.toFixed(0)}%` : "—",
            Number.isFinite(S) ? ` / ${S.toFixed(2)} kPa` : ""
          ] }),
          /* @__PURE__ */ l.jsxs("span", { className: "dsc-muted", children: [
            "Want ",
            Number.isFinite(E) ? E.toFixed(1) : "—",
            "°C · RH",
            " ",
            Number.isFinite(N) ? N.toFixed(0) : "—",
            "–",
            Number.isFinite(C) ? C.toFixed(0) : "—",
            "%"
          ] })
        ]
      }
    ),
    _.needs.length ? /* @__PURE__ */ l.jsx("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: _.needs.map((Q) => /* @__PURE__ */ l.jsx(D, { label: `Need ${Q}`, tone: "warn" }, Q)) }) : null,
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-target-grid", children: [
      /* @__PURE__ */ l.jsx(Je, { entityId: m.temp, label: "Temp °C", step: 0.5, tone: Y.tone, hint: Y.label, onLive: B }),
      /* @__PURE__ */ l.jsx(Je, { entityId: m.rhMin, label: "RH min %", step: 1, tone: ie.tone, hint: ie.label, onLive: P }),
      /* @__PURE__ */ l.jsx(Je, { entityId: m.rhMax, label: "RH max %", step: 1, tone: te.tone, hint: te.label, onLive: X }),
      /* @__PURE__ */ l.jsx(Je, { entityId: m.vpdMin, label: "VPD min", step: 0.01, tone: A.tone, hint: A.label, onLive: se }),
      /* @__PURE__ */ l.jsx(Je, { entityId: m.vpdMax, label: "VPD max", step: 0.01, tone: T.tone, hint: T.label, onLive: de })
    ] })
  ] });
}
function yb({
  compact: a,
  emphasize: i,
  only: c,
  hero: o
}) {
  const d = c ? [c] : i === "clone" ? ["clone", "main"] : ["main", "clone"];
  return o && !c ? /* @__PURE__ */ l.jsxs("div", { className: "dsc-target-heroes", children: [
    /* @__PURE__ */ l.jsx(qu, { tent: "clone", title: "2×4 climate", hero: !0 }),
    /* @__PURE__ */ l.jsx(qu, { tent: "main", title: "4×8 climate", hero: !0 })
  ] }) : /* @__PURE__ */ l.jsx("div", { className: `dsc-target-panel${a ? " is-compact" : ""}`, children: d.map((f) => /* @__PURE__ */ l.jsx(qu, { tent: f, title: f === "main" ? "4×8 climate" : "2×4 climate", hero: o }, f)) });
}
const r_ = [1, 2, 3, 4, 5, 6, 7, 8];
function k1() {
  const { available: a, entity: i, num: c, state: o } = Ce(), { callService: d } = Xt(), [f, h] = y.useState(null), [m, _] = y.useState(null), [b, v] = y.useState(null), [g, j] = y.useState(null), w = o("input_text.dsc_build_strain", ""), S = o("input_text.dsc_build_nickname", ""), E = o("input_select.dsc_build_assign_pot", "none"), N = c("input_number.dsc_blend_total_l", 20), C = o("input_select.dsc_light_fixture", ""), O = o("input_select.dsc_build_vessel", ""), B = Wu(O || void 0, N), J = c("input_number.dsc_mix_tank_liters", 20), P = c("input_number.dsc_mix_strength_pct", 100), G = (Number.isFinite(P) ? P : 100) / 100, X = Number.isFinite(J) && J > 0 ? J : 20, W = (te, A) => {
    if (te === "strain")
      v(A), d("input_text", "set_value", { entity_id: "input_text.dsc_build_strain", value: A.name });
    else if (te === "medium") {
      const T = A.composition && typeof A.composition == "object" ? Object.entries(A.composition).filter(([, $]) => Number.isFinite(Number($)) && Number($) > 0).slice(0, 3) : [];
      if (T.length)
        for (let $ = 1; $ <= 3; $++) {
          const Q = T[$ - 1];
          d("input_text", "set_value", {
            entity_id: `input_text.dsc_blend_component_${$}_name`,
            value: Q ? String(Q[0]) : ""
          }), d("input_number", "set_value", {
            entity_id: `input_number.dsc_blend_pct_${$}`,
            value: Q ? Number(Q[1]) : 0
          });
        }
      else
        d("input_text", "set_value", {
          entity_id: "input_text.dsc_blend_component_1_name",
          value: A.name
        });
    } else if (te === "nutrient")
      for (const T of r_) {
        const $ = o(`input_text.dsc_nutrient_${T}_name`, ""), Q = o(`input_boolean.dsc_nutrient_${T}_in_inventory`) === "on";
        if (!$ || $ === "unknown" || !Q) {
          d("input_text", "set_value", {
            entity_id: `input_text.dsc_nutrient_${T}_name`,
            value: A.name
          }), A.dose_ml_l != null && Number.isFinite(Number(A.dose_ml_l)) && d("input_number", "set_value", {
            entity_id: `input_number.dsc_nutrient_${T}_dose_ml_l`,
            value: Number(A.dose_ml_l)
          }), d("input_boolean", "turn_on", { entity_id: `input_boolean.dsc_nutrient_${T}_in_inventory` });
          break;
        }
      }
    else if (te === "light") {
      j(A);
      const $ = (i("input_select.dsc_light_fixture")?.attributes?.options || []).find((Q) => Q.toLowerCase().includes(String(A.name || "").toLowerCase().slice(0, 18)));
      $ ? d("input_select", "select_option", { entity_id: "input_select.dsc_light_fixture", option: $ }) : d("input_text", "set_value", { entity_id: "input_text.dsc_light_custom_name", value: A.name });
    }
    h(null);
  }, se = (te) => {
    const A = Number(te);
    if (!Number.isFinite(A) || te === "none") return;
    const T = Pu(A);
    a(T) && d("input_select", "select_option", { entity_id: T, option: B.id });
  }, ue = () => {
    d("script", "turn_on", { entity_id: "script.dsc_build_plant_commit" });
  }, de = () => {
    if (se(E), a("script.dsc_build_plant_commit_and_assign")) {
      d("script", "turn_on", { entity_id: "script.dsc_build_plant_commit_and_assign" });
      return;
    }
    d("script", "turn_on", { entity_id: "script.dsc_build_plant_commit" }), d("script", "turn_on", {
      entity_id: "script.dsc_plant_assign_to_pot",
      variables: { pot: E }
    });
  }, Y = r_.map((te) => {
    const A = o(`input_text.dsc_nutrient_${te}_name`, ""), T = c(`input_number.dsc_nutrient_${te}_dose_ml_l`, 0), $ = c(`input_number.dsc_nutrient_${te}_stock_ml`, 0), Q = o(`input_boolean.dsc_nutrient_${te}_in_inventory`) === "on", ne = !A || A === "unknown" || A === "unavailable", le = !ne && Number.isFinite(T) ? Math.round(T * X * G * 10) / 10 : 0;
    return { n: te, name: A, dose: T, stock: $, inv: Q, empty: ne, ml: le, short: Q && Number.isFinite($) && $ < le && le > 0 };
  }), ie = Y.reduce((te, A) => te + A.ml, 0);
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-compose", children: [
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Strain", icon: "roster", children: [
        /* @__PURE__ */ l.jsx(
          Tc,
          {
            label: w && w !== "unknown" ? w : "No strain",
            empty: !w || w === "unknown",
            onClick: () => h("strain")
          }
        ),
        b ? /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", style: { margin: "8px 0" }, children: [
          b.type ? /* @__PURE__ */ l.jsx(D, { label: String(b.type), tone: "muted" }) : null,
          b.height_cm_min != null ? /* @__PURE__ */ l.jsx(
            D,
            {
              label: `${b.height_cm_min}${b.height_cm_max != null ? `–${b.height_cm_max}` : ""}cm`,
              tone: "muted"
            }
          ) : null,
          b.thc_min != null ? /* @__PURE__ */ l.jsx(D, { label: `${b.thc_min}% THC`, tone: "muted" }) : null
        ] }) : null,
        /* @__PURE__ */ l.jsx(Gc, { entityId: "input_text.dsc_build_nickname", label: "Nickname" }),
        /* @__PURE__ */ l.jsx(jy, { entityId: "input_datetime.dsc_build_sprout_date", label: "Sprout date" }),
        /* @__PURE__ */ l.jsx(ls, { entityId: "input_select.dsc_build_custom_slot", label: "Custom strain slot" })
      ] }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Vessel + mix", icon: "compose", children: [
        /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
          /* @__PURE__ */ l.jsx(On, { spec: B, size: 48, label: !0 }),
          /* @__PURE__ */ l.jsx("button", { type: "button", className: "dsc-chip", onClick: () => h("vessel"), children: B.label })
        ] }),
        /* @__PURE__ */ l.jsx(Zy, { volumeL: B.volumeL || N }),
        /* @__PURE__ */ l.jsx("div", { className: "dsc-chip-row", style: { marginTop: 8 }, children: /* @__PURE__ */ l.jsx(Tc, { label: "Medium search", onClick: () => h("medium"), empty: !0 }) })
      ] }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Nutrition", icon: "nutrient", children: [
        /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
          /* @__PURE__ */ l.jsx(Tc, { label: "Add from catalog", onClick: () => h("nutrient"), empty: !0 }),
          /* @__PURE__ */ l.jsx(D, { label: `Tank ${X} L`, tone: "muted" }),
          /* @__PURE__ */ l.jsx(D, { label: `${Math.round(G * 100)}% strength`, tone: "muted" }),
          /* @__PURE__ */ l.jsx(D, { label: `${ie.toFixed(1)} ml`, tone: ie > 0 ? "ok" : "muted" })
        ] }),
        /* @__PURE__ */ l.jsxs("div", { className: "dsc-target-grid", children: [
          /* @__PURE__ */ l.jsx(Je, { entityId: "input_number.dsc_mix_tank_liters", label: "Tank L", step: 0.5 }),
          /* @__PURE__ */ l.jsx(Je, { entityId: "input_number.dsc_mix_strength_pct", label: "Strength %", step: 1 })
        ] }),
        Y.map((te) => /* @__PURE__ */ l.jsxs("div", { className: "dsc-nutrient-slot", children: [
          /* @__PURE__ */ l.jsx(Gc, { entityId: `input_text.dsc_nutrient_${te.n}_name`, label: `Slot ${te.n}` }),
          /* @__PURE__ */ l.jsx(Je, { entityId: `input_number.dsc_nutrient_${te.n}_dose_ml_l`, label: "ml/L", step: 0.1 }),
          /* @__PURE__ */ l.jsx("span", { className: "dsc-mono", children: te.empty ? "—" : `${te.ml} ml` }),
          te.short ? /* @__PURE__ */ l.jsx(D, { label: "stock short", tone: "warn" }) : null
        ] }, te.n)),
        /* @__PURE__ */ l.jsx(Gc, { entityId: "input_text.dsc_build_recipe_note", label: "Recipe note", multiline: !0 }),
        /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: "ml = dose × tank × strength. Empty names stay empty — Compose does not invent products." })
      ] }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Light + assign", icon: "lighting", children: [
        /* @__PURE__ */ l.jsx(
          Tc,
          {
            label: C && C !== "unknown" ? C : "No fixture",
            empty: !C || C === "unknown",
            onClick: () => h("light")
          }
        ),
        g ? /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", style: { margin: "8px 0" }, children: [
          g.wattage_w != null ? /* @__PURE__ */ l.jsx(D, { label: `${g.wattage_w} W`, tone: "muted" }) : null,
          g.efficacy_umol_j != null ? /* @__PURE__ */ l.jsx(D, { label: `${g.efficacy_umol_j} µmol/J`, tone: "muted" }) : null,
          g.has_ppfd || g.ppfd_url ? /* @__PURE__ */ l.jsx(D, { label: "PPFD", tone: "ok" }) : /* @__PURE__ */ l.jsx(D, { label: "No PPFD URL", tone: "warn" })
        ] }) : null,
        /* @__PURE__ */ l.jsx(ls, { entityId: "input_select.dsc_build_assign_pot", label: "Assign pot", icon: "root" }),
        /* @__PURE__ */ l.jsx(ls, { entityId: "input_select.dsc_build_climate_pot", label: "Climate apply pot", icon: "climate" }),
        /* @__PURE__ */ l.jsxs("div", { className: "dsc-row-actions", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ l.jsx(ce, { primary: !0, onClick: () => _("roster"), children: "Commit roster" }),
          /* @__PURE__ */ l.jsx(ce, { teal: !0, onClick: () => _("assign"), children: "Commit + assign" }),
          /* @__PURE__ */ l.jsx(ce, { onClick: () => _("seat"), children: "Assign seat" }),
          /* @__PURE__ */ l.jsx(ce, { onClick: () => _("mix"), children: "Accept mix" }),
          /* @__PURE__ */ l.jsx(ce, { onClick: () => _("climate"), children: "Apply climate Want" })
        ] }),
        /* @__PURE__ */ l.jsxs("p", { className: "dsc-honesty", style: { marginBottom: 0 }, children: [
          "Confirm overlay writes HA scripts. Coupled mix stays on ",
          /* @__PURE__ */ l.jsx("code", { children: "input_number.dsc_blend_pct_N" }),
          "."
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ l.jsx(
      Yt,
      {
        open: f === "strain" || f === "medium" || f === "nutrient" || f === "light",
        onDismiss: () => h(null),
        title: f ? `Search ${f}` : "Search",
        help: null,
        children: f === "strain" || f === "medium" || f === "nutrient" || f === "light" ? /* @__PURE__ */ l.jsx(nb, { kind: f, onPick: (te) => W(f, te) }) : null
      }
    ),
    /* @__PURE__ */ l.jsxs(Yt, { open: f === "vessel", onDismiss: () => h(null), title: "Vessel", help: null, children: [
      /* @__PURE__ */ l.jsx("div", { className: "dsc-chip-row", children: pd.map((te) => /* @__PURE__ */ l.jsxs(
        "button",
        {
          type: "button",
          className: `dsc-chip${te.id === B.id ? " dsc-chip--ok" : ""}`,
          onClick: () => {
            (i("input_select.dsc_build_vessel")?.attributes?.options || []).includes(te.id) && a("input_select.dsc_build_vessel") && d("input_select", "select_option", {
              entity_id: "input_select.dsc_build_vessel",
              option: te.id
            }), d("input_number", "set_value", {
              entity_id: "input_number.dsc_blend_total_l",
              value: te.volumeL
            }), h(null);
          },
          children: [
            /* @__PURE__ */ l.jsx(On, { spec: te, size: 28 }),
            " ",
            te.label
          ]
        },
        te.id
      )) }),
      /* @__PURE__ */ l.jsxs("p", { className: "dsc-muted", style: { fontSize: 12 }, children: [
        "Default if helper missing: ",
        ci.label,
        ". Reload HA after packages load",
        " ",
        /* @__PURE__ */ l.jsx("code", { children: "dsc_v4_vessel.yaml" }),
        "."
      ] }),
      a("input_select.dsc_build_vessel") ? /* @__PURE__ */ l.jsx(D, { label: "Vessel helper", tone: "ok" }) : /* @__PURE__ */ l.jsx(D, { label: "Volume-only until vessel select exists", tone: "warn" })
    ] }),
    /* @__PURE__ */ l.jsx(
      Yt,
      {
        open: m === "roster",
        onDismiss: () => _(null),
        onConfirm: () => {
          ue(), _(null);
        },
        title: "Commit roster",
        confirmLabel: "Write roster",
        help: null,
        children: /* @__PURE__ */ l.jsxs("p", { children: [
          "Strain ",
          S || w || "—",
          ". Vessel ",
          B.label,
          ". Assign helper stays ",
          E,
          ". Runs",
          " ",
          /* @__PURE__ */ l.jsx("code", { children: "script.dsc_build_plant_commit" }),
          "."
        ] })
      }
    ),
    /* @__PURE__ */ l.jsx(
      Yt,
      {
        open: m === "assign",
        onDismiss: () => _(null),
        onConfirm: () => {
          de(), _(null);
        },
        title: "Commit + assign",
        confirmLabel: "Write + assign",
        help: null,
        children: /* @__PURE__ */ l.jsxs("p", { children: [
          "Writes roster then assigns pot ",
          E === "none" ? "(none — pick a pot first)" : E,
          ". Copies vessel",
          " ",
          B.id,
          " onto ",
          /* @__PURE__ */ l.jsx("code", { children: E === "none" ? "—" : Pu(Number(E)) }),
          " if that helper exists."
        ] })
      }
    ),
    /* @__PURE__ */ l.jsx(
      Yt,
      {
        open: m === "seat",
        onDismiss: () => _(null),
        onConfirm: () => {
          se(E), d("script", "turn_on", {
            entity_id: "script.dsc_plant_assign_to_pot",
            variables: { pot: E }
          }), _(null);
        },
        title: "Assign to pot",
        confirmLabel: "Assign now",
        help: null,
        children: /* @__PURE__ */ l.jsxs("p", { children: [
          "Assigns current roster plant to pot ",
          E === "none" ? "(none — pick a pot first)" : E,
          " via",
          " ",
          /* @__PURE__ */ l.jsx("code", { children: "script.dsc_plant_assign_to_pot" }),
          ". Does not invent a roster row."
        ] })
      }
    ),
    /* @__PURE__ */ l.jsx(
      Yt,
      {
        open: m === "mix",
        onDismiss: () => _(null),
        onConfirm: () => {
          d("script", "turn_on", { entity_id: "script.dsc_accept_mix" }), _(null);
        },
        title: "Accept mix",
        confirmLabel: "Burn stock",
        help: null,
        children: /* @__PURE__ */ l.jsxs("p", { children: [
          ie.toFixed(1),
          " ml from tank ",
          X,
          " L × ",
          Math.round(G * 100),
          "% strength. Runs",
          " ",
          /* @__PURE__ */ l.jsx("code", { children: "script.dsc_accept_mix" }),
          ". Does not invent missing nutrients."
        ] })
      }
    ),
    /* @__PURE__ */ l.jsx(
      Yt,
      {
        open: m === "climate",
        onDismiss: () => _(null),
        onConfirm: () => {
          d("script", "turn_on", { entity_id: "script.dsc_apply_climate_want" }), _(null);
        },
        title: "Apply climate Want",
        confirmLabel: "Write Want",
        help: null,
        children: /* @__PURE__ */ l.jsxs("p", { children: [
          "Applies custom temp/RH Want to pot",
          " ",
          o("input_select.dsc_build_climate_pot", "Fleet"),
          " via",
          " ",
          /* @__PURE__ */ l.jsx("code", { children: "script.dsc_apply_climate_want" }),
          ". Does not invent catalog bands."
        ] })
      }
    )
  ] });
}
const N1 = [
  { id: "strain", label: "Strains" },
  { id: "medium", label: "Mediums" },
  { id: "nutrient", label: "Nutrients" },
  { id: "light", label: "Lights" }
];
function C1(a, i) {
  return Array.isArray(a) && a.length >= 2 ? `${a[0]}–${a[1]}${i}` : a != null && a !== "" ? `${a}${i}` : "";
}
function o_(a, i) {
  const c = a;
  switch (i) {
    case "name":
      return c.name || "—";
    case "type":
      return c.type || "—";
    case "breeder":
      return c.breeder || c.brand || "—";
    case "wantTemp":
      return c.want?.temp_c ? c.want.temp_c.join("–") : "—";
    case "wantRh":
      return c.want?.rh_pct ? c.want.rh_pct.join("–") : "—";
    case "height":
      return C1(c.height_cm, "cm") || (c.height_cm_min != null ? `${c.height_cm_min}${c.height_cm_max != null ? `–${c.height_cm_max}` : ""}cm` : "—");
    case "thc":
      return c.thc_range ? `${c.thc_range.join("–")}%` : c.thc_min != null ? `${c.thc_min}%` : "—";
    case "flowering":
      return c.flowering_days_min != null ? `${c.flowering_days_min}${c.flowering_days_max != null ? `–${c.flowering_days_max}` : ""}d` : "—";
    case "brand":
      return c.brand || "—";
    case "category":
      return c.category || "—";
    case "dose":
      return c.dose_ml_l != null ? `${c.dose_ml_l} ml/L` : "—";
    case "stage":
      return c.stage || "—";
    case "wattage":
      return c.wattage_w != null ? `${c.wattage_w} W` : "—";
    case "ppe":
      return c.efficacy_umol_j != null ? String(c.efficacy_umol_j) : "—";
    case "ppfd":
      return c.has_ppfd || c.ppfd_url ? "yes" : "—";
    case "composition":
      return typeof c.composition == "string" ? c.composition : c.composition && typeof c.composition == "object" && Object.entries(c.composition).map(([o, d]) => `${o} ${d}%`).join(" · ") || "—";
    default: {
      const o = c[i];
      return o != null && o !== "" ? String(o) : "—";
    }
  }
}
function E1(a) {
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
function M1() {
  const { state: a } = Ce(), { callService: i } = Xt(), c = ht(), [o, d] = y.useState("strain"), [f, h] = y.useState(null), [m, _] = y.useState([]), [b, v] = y.useState(""), g = y.useMemo(() => E1(o), [o]);
  y.useEffect(() => {
    tb(o, "", a, 8).then((w) => v(w.note));
  }, [o]);
  const j = (w) => {
    w && (o === "strain" ? i("input_text", "set_value", { entity_id: "input_text.dsc_build_strain", value: w.name }) : o === "medium" ? i("input_text", "set_value", {
      entity_id: "input_text.dsc_blend_component_1_name",
      value: w.name
    }) : o === "nutrient" ? i("input_text", "set_value", { entity_id: "input_text.dsc_nutrient_1_name", value: w.name }) : o === "light" && i("input_text", "set_value", { entity_id: "input_text.dsc_light_custom_name", value: w.name }), c("/grow/compose"));
  };
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-research", children: [
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: [
      N1.map((w) => /* @__PURE__ */ l.jsx(
        "button",
        {
          type: "button",
          className: `dsc-chip${o === w.id ? " dsc-chip--ok" : ""}`,
          onClick: () => {
            d(w.id), h(null), _([]);
          },
          children: w.label
        },
        w.id
      )),
      /* @__PURE__ */ l.jsx(D, { label: b || "Catalog", tone: b.includes("local") ? "warn" : "ok" })
    ] }),
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ l.jsx(re, { className: "dsc-glass", title: "Browse", icon: "research", children: /* @__PURE__ */ l.jsx(nb, { kind: o, onPick: (w) => h(w) }) }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ l.jsx(re, { className: "dsc-glass", title: "Detail", icon: "roster", children: f ? /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
        /* @__PURE__ */ l.jsx("h3", { style: { marginTop: 0 }, children: f.name }),
        /* @__PURE__ */ l.jsx("dl", { className: "dsc-detail-list", children: g.map((w) => /* @__PURE__ */ l.jsxs("div", { children: [
          /* @__PURE__ */ l.jsx("dt", { children: w.label }),
          /* @__PURE__ */ l.jsx("dd", { children: o_(f, w.key) })
        ] }, w.key)) }),
        /* @__PURE__ */ l.jsxs("div", { className: "dsc-row-actions", children: [
          /* @__PURE__ */ l.jsx(ce, { primary: !0, onClick: () => j(f), children: "Use in Compose" }),
          /* @__PURE__ */ l.jsx(
            ce,
            {
              onClick: () => _(
                (w) => w.some((S) => (S.id || S.name) === (f.id || f.name)) ? w : [...w, f].slice(0, 3)
              ),
              children: "Add compare"
            }
          )
        ] })
      ] }) : /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", children: "Pick a row. Missing fields stay blank." }) }) }),
      m.length ? /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Compare", icon: "analytics", children: [
        /* @__PURE__ */ l.jsxs("table", { className: "dsc-table", children: [
          /* @__PURE__ */ l.jsx("thead", { children: /* @__PURE__ */ l.jsxs("tr", { children: [
            /* @__PURE__ */ l.jsx("th", { children: "Field" }),
            m.map((w) => /* @__PURE__ */ l.jsx("th", { children: w.name }, w.id || w.name))
          ] }) }),
          /* @__PURE__ */ l.jsx("tbody", { children: g.map((w) => /* @__PURE__ */ l.jsxs("tr", { children: [
            /* @__PURE__ */ l.jsx("td", { children: w.label }),
            m.map((S) => /* @__PURE__ */ l.jsx("td", { children: o_(S, w.key) }, S.id || S.name))
          ] }, w.key)) })
        ] }),
        /* @__PURE__ */ l.jsx(ce, { onClick: () => _([]), children: "Clear compare" })
      ] }) }) : null
    ] })
  ] });
}
function T1({ pot: a }) {
  const { available: i, state: c, num: o } = Ce(), d = c(`sensor.dsc_pot${a}_expected_stage`, "—"), f = c(`sensor.dsc_pot${a}_days_since_sprout`, "—"), h = c(`sensor.dsc_pot${a}_need_summary`, "—"), m = c(`binary_sensor.dsc_pot${a}_untrusted`) === "on", _ = o(`sensor.dsc_pot${a}_dryback_pct`), b = c(`input_select.dsc_pot${a}_tent`, "unassigned"), v = b === "clone" ? c("light.dsc_hub_sf1000_dimmer") === "on" : c("binary_sensor.dsc_hub_4x8_window_open") === "on", g = b === "clone" || b === "main" ? v : !1, j = Number.isFinite(_) && _ > 55 ? "dryback stress" : h !== "—" && h !== "ok" ? "Need" : "calm";
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-plant-extra", children: [
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", children: [
      /* @__PURE__ */ l.jsx(D, { label: g ? "Awake" : "Asleep", tone: g ? "ok" : "muted" }),
      /* @__PURE__ */ l.jsx(D, { label: `Day ${f}`, tone: "muted" }),
      /* @__PURE__ */ l.jsx(D, { label: d === "—" ? "No stage Got" : d, tone: d === "—" ? "muted" : "ok" }),
      /* @__PURE__ */ l.jsx(
        D,
        {
          label: m ? "Need blocked (untrusted)" : j,
          tone: m ? "warn" : j === "calm" ? "ok" : "warn"
        }
      )
    ] }),
    i(`sensor.dsc_pot${a}_expected_stage`) ? null : /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: "No cultivar mesh. Missing fields stay empty." })
  ] });
}
function A1(a) {
  if (!a || a === "—") return -1;
  const i = ob.findIndex((c) => a.indexOf(c) >= 0);
  return i >= 0 ? i : /flower/i.test(a) ? 6 : /veg/i.test(a) ? 3 : /seed/i.test(a) ? 1 : -1;
}
function oi({ compact: a }) {
  const { state: i, entity: c } = Ce(), o = aa.map((S) => ({
    seat: rs(S, { state: i, entity: c }),
    oos: !qt(S, i)
  })), f = o.filter((S) => !S.oos).map((S) => A1(S.seat.stage)).filter((S) => S >= 0), h = new Set(f).size > 1, m = f.length ? Math.max(...f) : -1, _ = i("binary_sensor.dsc_hub_4x8_window_open") === "on", b = i("binary_sensor.dsc_hub_2x4_window_open") === "on", v = i("binary_sensor.dsc_hub_light_catchup_active") === "on", g = i("binary_sensor.dsc_clone_dark_period_violation") === "on", j = i("sensor.dsc_expected_light_hours", "—"), w = i("sensor.dsc_clone_expected_light_hours", "—");
  return /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Crop scheduler", icon: "roster", children: [
    /* @__PURE__ */ l.jsx("div", { className: "dsc-stage-track", "aria-label": "Stage track", children: ob.map((S, E) => /* @__PURE__ */ l.jsx(
      "span",
      {
        className: `dsc-stage-pill${E === m ? " is-on" : ""}${E === m + 1 ? " is-next" : ""}`,
        children: S.replace("Late (Push) Vegetative", "Push Veg").replace("Final 48-72h Flowering", "Finish").replace("Early Vegetative", "Early Veg").replace("Early Flowering", "Early Flwr").replace("Late Flowering", "Late Flwr")
      },
      S
    )) }),
    h ? /* @__PURE__ */ l.jsx(D, { label: "Mixed stages in tents", tone: "warn" }) : null,
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", style: { margin: "8px 0" }, children: [
      /* @__PURE__ */ l.jsx(D, { label: `4×8 ${_ ? "window open" : "dark"} · Want ${j}h`, tone: _ ? "ok" : "muted" }),
      /* @__PURE__ */ l.jsx(D, { label: `2×4 ${b ? "window open" : "dark"} · Want ${w}h`, tone: b ? "ok" : "muted" }),
      v ? /* @__PURE__ */ l.jsx(D, { label: "Catch-up", tone: "warn" }) : null,
      g ? /* @__PURE__ */ l.jsx(D, { label: "2×4 dark violation", tone: "bad", pulse: !0 }) : null
    ] }),
    /* @__PURE__ */ l.jsx("div", { className: `dsc-scheduler-lanes${a ? " is-compact" : ""}`, children: o.map(({ seat: S, oos: E }) => {
      const N = Number(S.days), C = Number.isFinite(N) ? Math.max(1, Math.ceil(N / 7)) : null;
      return /* @__PURE__ */ l.jsxs(
        "button",
        {
          type: "button",
          className: `dsc-scheduler-lane${E ? " is-oos" : ""}`,
          disabled: E,
          onClick: () => window.dispatchEvent(new CustomEvent("dsc-dash-select-pot", { detail: { pot: S.pot } })),
          children: [
            /* @__PURE__ */ l.jsx(On, { spec: Ha(S.pot, i, c), size: 16 }),
            /* @__PURE__ */ l.jsxs("strong", { children: [
              "P",
              S.pot
            ] }),
            /* @__PURE__ */ l.jsx("span", { children: E ? "OOS" : S.plantName }),
            /* @__PURE__ */ l.jsx(D, { label: lr(S.tent), tone: E || S.tent === "unassigned" ? "muted" : "ok" }),
            /* @__PURE__ */ l.jsx("span", { className: "dsc-muted", children: E ? "—" : `W${C ?? "—"} · ${Number.isFinite(N) ? `${N}d` : "—"} · ${S.stage} · Need ${S.need}` })
          ]
        },
        S.pot
      );
    }) })
  ] });
}
function or({
  pot: a,
  onSelectPot: i
}) {
  const { hass: c, state: o, entity: d, available: f, tick: h, num: m } = Ce(), { callService: _ } = Xt(), b = ht(), v = rs(a, { state: o, entity: d }), [g, j] = y.useState(v.plantName === "—" ? "" : v.plantName), [w, S] = y.useState(v.sprout === "—" ? "" : v.sprout), [E, N] = y.useState(v.growthStage === "—" ? "" : v.growthStage), [C, O] = y.useState(v.notes === "—" ? "" : v.notes), [B, J] = y.useState(null), [P, G] = y.useState(null);
  y.useEffect(() => {
    j(v.plantName === "—" ? "" : v.plantName), S(v.sprout === "—" ? "" : v.sprout), N(v.growthStage === "—" ? "" : v.growthStage), O(v.notes === "—" ? "" : v.notes), J(null);
  }, [a]);
  const X = bn(a, "moisture", o), W = bn(a, "ec", o), se = bn(a, "ph", o), ue = `sensor.dsc_pot${a}_dryback_pct`, de = _e(X), Y = _e(ue), ie = _e(W), te = _e(se), A = xe(X, { hours: 6, maxPoints: 72 }), T = xe(W, { hours: 6, maxPoints: 72 }), $ = m(`input_number.dsc_pot${a}_learned_ec_per_moisture`), Q = f(`input_number.dsc_pot${a}_learned_ec_per_moisture`) && Number.isFinite($) && $ !== 0 ? $ : NaN, ne = f(`sensor.dsc_pot${a}_want_moisture_min`) ? m(`sensor.dsc_pot${a}_want_moisture_min`) : m(`number.dsc_pot${a}_want_moisture_min`), le = f(`sensor.dsc_pot${a}_want_moisture_max`) ? m(`sensor.dsc_pot${a}_want_moisture_max`) : m(`number.dsc_pot${a}_want_moisture_max`), k = m(`sensor.dsc_pot${a}_want_ec_min`), F = m(`sensor.dsc_pot${a}_want_ec_max`), I = m(`sensor.dsc_pot${a}_want_ph_min`), ae = m(`sensor.dsc_pot${a}_want_ph_max`), me = Number.isFinite(ne) && Number.isFinite(le) && (f(`sensor.dsc_pot${a}_want_moisture_min`) || f(`number.dsc_pot${a}_want_moisture_min`)), he = Number.isFinite(k) && Number.isFinite(F), ge = Number.isFinite(I) && Number.isFinite(ae), Le = !v.strainDisplay || v.strainDisplay === "—" || /generic/i.test(v.strainDisplay), Se = async (ee) => {
    J(null);
    try {
      await _("input_select", "select_option", {
        entity_id: `input_select.dsc_pot${a}_tent`,
        option: ee
      }), window.setTimeout(() => {
        (c?.states?.[`input_select.dsc_pot${a}_tent`]?.state || "") !== ee && J("Tent apply failed — check helper options (clone|main|unassigned).");
      }, 400);
    } catch {
      J("Tent apply failed — check helper options (clone|main|unassigned).");
    }
  }, lt = () => {
    f(`text.dsc_pot${a}_plant_name`) && _("text", "set_value", {
      entity_id: `text.dsc_pot${a}_plant_name`,
      value: g
    });
  }, pt = () => {
    const ee = `datetime.dsc_pot${a}_sprout_date`;
    if (!f(ee) || !w) return;
    const $e = w.length === 10 ? `${w}T00:00:00` : w;
    _("datetime", "set_value", { entity_id: ee, datetime: $e });
  }, je = () => {
    if (v.rosterSlot == null) return;
    const ee = `input_text.dsc_plant_roster_${v.rosterSlot}_notes`;
    !f(ee) && d(ee), _("input_text", "set_value", { entity_id: ee, value: C });
  }, it = d(`select.dsc_pot${a}_growth_stage`)?.attributes?.options || [];
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-seat-panel", children: [
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 14 }, children: [
      bd(o).map((ee) => /* @__PURE__ */ l.jsxs(
        "button",
        {
          type: "button",
          className: `dsc-chip${ee === a ? " dsc-chip--ok" : ""}`,
          onClick: () => i?.(ee),
          children: [
            /* @__PURE__ */ l.jsx(On, { spec: Ha(ee, o, d), size: 16 }),
            " P",
            ee
          ]
        },
        ee
      )),
      /* @__PURE__ */ l.jsx(D, { label: lr(v.tent), tone: v.tent === "unassigned" ? "muted" : "ok" }),
      v.rosterSlot != null ? /* @__PURE__ */ l.jsx(D, { label: `Roster #${v.rosterSlot}`, tone: "muted" }) : /* @__PURE__ */ l.jsx(D, { label: "No roster join", tone: "warn" }),
      de.stale ? /* @__PURE__ */ l.jsx(D, { label: "HELD Got", tone: "warn" }) : null
    ] }),
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-seat-layout", children: [
      /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass dsc-glass--glow", title: "Medium", children: [
        /* @__PURE__ */ l.jsx(Dy, { layers: v.layers, spec: Ha(a, o, d) }),
        /* @__PURE__ */ l.jsx(T1, { pot: a }),
        /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", style: { marginTop: 10, fontSize: 12 }, children: v.blend || "Blend lives on roster after commit — not invented here." })
      ] }),
      /* @__PURE__ */ l.jsxs("div", { className: "dsc-grid", style: { gap: 14 }, children: [
        /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsx(re, { className: "dsc-glass", title: "Identity", children: /* @__PURE__ */ l.jsxs("div", { className: "dsc-seat-editors", children: [
          /* @__PURE__ */ l.jsxs("label", { children: [
            "Nickname",
            /* @__PURE__ */ l.jsx(
              "input",
              {
                value: g,
                onChange: (ee) => j(ee.target.value),
                onBlur: lt,
                disabled: !f(`text.dsc_pot${a}_plant_name`)
              }
            )
          ] }),
          /* @__PURE__ */ l.jsxs("label", { children: [
            "Sprout date",
            /* @__PURE__ */ l.jsx(
              "input",
              {
                type: "date",
                value: w.slice(0, 10),
                onChange: (ee) => S(ee.target.value),
                onBlur: pt,
                disabled: !f(`datetime.dsc_pot${a}_sprout_date`)
              }
            )
          ] }),
          /* @__PURE__ */ l.jsxs("label", { children: [
            "Growth stage",
            /* @__PURE__ */ l.jsxs(
              "select",
              {
                value: E,
                onChange: (ee) => {
                  const $e = ee.target.value;
                  if (N($e), !$e) return;
                  const We = `select.dsc_pot${a}_growth_stage`;
                  f(We) && _("select", "select_option", { entity_id: We, option: $e });
                },
                disabled: !f(`select.dsc_pot${a}_growth_stage`),
                children: [
                  /* @__PURE__ */ l.jsx("option", { value: "", children: "—" }),
                  it.map((ee) => /* @__PURE__ */ l.jsx("option", { value: ee, children: ee }, ee))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", children: [
            /* @__PURE__ */ l.jsx(D, { label: `Day ${v.days}`, tone: "ok" }),
            /* @__PURE__ */ l.jsx(D, { label: v.stage, tone: "muted" }),
            /* @__PURE__ */ l.jsx(D, { label: v.strainDisplay, tone: "muted" })
          ] }),
          /* @__PURE__ */ l.jsx(
            sr,
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
        /* @__PURE__ */ l.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Want · Got · Need", children: [
          /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", children: [
            /* @__PURE__ */ l.jsx(
              D,
              {
                label: `Got M ${de.stale ? `${Number.isFinite(de.value) ? de.value.toFixed(0) : "—"}*` : v.moisture}`,
                tone: de.stale ? "warn" : "ok"
              }
            ),
            /* @__PURE__ */ l.jsx(D, { label: `EC ${v.ec}`, tone: "muted" }),
            /* @__PURE__ */ l.jsx(D, { label: `pH ${v.ph}`, tone: "muted" }),
            /* @__PURE__ */ l.jsx(
              D,
              {
                label: v.need,
                tone: v.need !== "—" && v.need !== "OK" ? "warn" : "ok"
              }
            )
          ] }),
          me && !Le ? /* @__PURE__ */ l.jsx(
            gb,
            {
              rows: [
                {
                  label: "Moisture",
                  got: de.value,
                  stale: de.stale,
                  wantMin: ne,
                  wantMax: le,
                  unit: "%"
                },
                {
                  label: "EC",
                  got: ie.value,
                  stale: ie.stale,
                  wantMin: he ? k : void 0,
                  wantMax: he ? F : void 0
                },
                {
                  label: "pH",
                  got: te.value,
                  stale: te.stale,
                  wantMin: ge ? I : void 0,
                  wantMax: ge ? ae : void 0
                }
              ]
            }
          ) : /* @__PURE__ */ l.jsxs("p", { className: "dsc-honesty", style: { margin: "8px 0 0" }, children: [
            /* @__PURE__ */ l.jsx(D, { label: "No catalog Want", tone: "warn" }),
            " ",
            Le ? "Generic / empty strain — Want bands not invented." : "Custom Want helpers missing — Got + Need only."
          ] }),
          /* @__PURE__ */ l.jsx("p", { className: "dsc-kpi-sub", children: "Need is derived (catalog vs Got), not a feed invent." })
        ] }) }),
        /* @__PURE__ */ l.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ l.jsx(re, { className: "dsc-glass", title: "Dryback", children: /* @__PURE__ */ l.jsx(
          Xe,
          {
            label: "Dryback",
            value: Y.value,
            min: 0,
            max: 100,
            unit: "%",
            stale: Y.stale,
            band: { min: 0, max: 45 },
            onClick: () => G({ id: ue, label: "Dryback", unit: "%" })
          }
        ) }) }),
        /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Got history", children: [
          /* @__PURE__ */ l.jsx(
            wn,
            {
              live: !0,
              lastSyncAt: Math.max(A.lastSyncAt ?? 0, T.lastSyncAt ?? 0) || void 0,
              series: [
                {
                  id: "m",
                  label: "Moisture",
                  series: A.series,
                  color: "var(--dsc-blue)",
                  axis: "left",
                  unit: "%"
                },
                {
                  id: "ec",
                  label: "EC",
                  series: T.series,
                  color: "var(--dsc-amber)",
                  axis: "right",
                  unit: ""
                }
              ]
            }
          ),
          /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: Number.isFinite(Q) ? `EC consumption honesty: learned ${Q.toFixed(3)} EC per moisture (not feed invent).` : "EC over time shown — no learned_ec_per_moisture yet (not invented)." }),
          /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", style: { marginTop: 8 }, children: [
            /* @__PURE__ */ l.jsx(ce, { onClick: () => G({ id: X, label: "Moisture", unit: "%" }), children: "Moisture hist" }),
            /* @__PURE__ */ l.jsx(ce, { onClick: () => G({ id: W, label: "EC", unit: "" }), children: "EC hist" }),
            /* @__PURE__ */ l.jsx(ce, { onClick: () => G({ id: se, label: "pH", unit: "" }), children: "pH hist" })
          ] })
        ] }) }),
        /* @__PURE__ */ l.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Nutrition", children: [
          /* @__PURE__ */ l.jsx("p", { style: { margin: "0 0 6px" }, children: v.recipe || "No roster recipe — catalog doses only, never invented." }),
          /* @__PURE__ */ l.jsxs("label", { className: "dsc-seat-editors", children: [
            "Roster notes",
            /* @__PURE__ */ l.jsx(
              "textarea",
              {
                rows: 3,
                value: C,
                onChange: (ee) => O(ee.target.value),
                onBlur: je,
                disabled: v.rosterSlot == null
              }
            )
          ] }),
          /* @__PURE__ */ l.jsx("div", { style: { marginTop: 10 }, children: /* @__PURE__ */ l.jsx(ai, { to: "/grow/compose", children: /* @__PURE__ */ l.jsx(ce, { teal: !0, children: "Mix in Compose" }) }) })
        ] }) }),
        /* @__PURE__ */ l.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Live Got chips", children: [
          /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", children: [
            /* @__PURE__ */ l.jsx(D, { label: `M ${v.moisture}`, tone: "muted" }),
            /* @__PURE__ */ l.jsx(D, { label: `T ${v.soilTemp}`, tone: "muted" }),
            /* @__PURE__ */ l.jsx(D, { label: `EC ${v.ec}`, tone: "muted" }),
            /* @__PURE__ */ l.jsx(D, { label: `pH ${v.ph}`, tone: "muted" }),
            /* @__PURE__ */ l.jsx(D, { label: `N ${v.n}`, tone: "muted" }),
            /* @__PURE__ */ l.jsx(D, { label: `P ${v.p}`, tone: "muted" }),
            /* @__PURE__ */ l.jsx(D, { label: `K ${v.k}`, tone: "muted" })
          ] }),
          /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: "NPK = trend indicators. Unavailable stays —. Held shows last good on blip." })
        ] }) }),
        /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Apply to tent", children: [
          /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "Digital-twin placement. Moves the plant on Twin; does not rewrite climate Want." }),
          /* @__PURE__ */ l.jsxs("div", { className: "dsc-seat-actions", children: [
            /* @__PURE__ */ l.jsx(ce, { primary: v.tent === "clone", onClick: () => void Se("clone"), children: "2×4" }),
            /* @__PURE__ */ l.jsx(ce, { primary: v.tent === "main", onClick: () => void Se("main"), children: "4×8" }),
            /* @__PURE__ */ l.jsx(ce, { onClick: () => void Se("unassigned"), children: "Unassigned" }),
            /* @__PURE__ */ l.jsx(ai, { to: "/live/twin", children: /* @__PURE__ */ l.jsx(ce, { children: "Open Twin" }) })
          ] }),
          B ? /* @__PURE__ */ l.jsxs("p", { className: "dsc-honesty", children: [
            /* @__PURE__ */ l.jsx(D, { label: "Tent apply failed", tone: "bad" }),
            " ",
            B
          ] }) : null
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ l.jsx(
      h1,
      {
        open: P != null,
        onClose: () => G(null),
        entityId: P?.id ?? null,
        label: P?.label ?? "",
        unit: P?.unit
      }
    )
  ] });
}
function R1() {
  const a = ht();
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ l.jsx(
      Nt,
      {
        icon: "compose",
        title: "Compose",
        subtitle: "Build soil blend, roster commit, and Want handoff.",
        primaryAction: /* @__PURE__ */ l.jsx(ce, { teal: !0, onClick: () => a("/grow/roster"), children: "Open Roster / Seat" }),
        actions: /* @__PURE__ */ l.jsx(ce, { primary: !0, onClick: () => a("/grow/research"), children: "Browse Catalog" })
      }
    ),
    /* @__PURE__ */ l.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Densified catalog traits (height / flowering / chem) show when the index has them. Empty catalog fields stay empty — Compose does not invent Want bands or strain genetics. After commit, open Roster to assign a seat." }),
    /* @__PURE__ */ l.jsx(k1, {})
  ] });
}
function O1() {
  const a = ht();
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ l.jsx(
      Nt,
      {
        icon: "research",
        title: "Research",
        subtitle: "Live CannaLib catalog — strains, mediums, nutrients, and lights.",
        actions: /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
          /* @__PURE__ */ l.jsx(ce, { primary: !0, onClick: () => a("/grow/compose"), children: "Use in Compose" }),
          /* @__PURE__ */ l.jsx(ce, { teal: !0, onClick: () => a("/grow/roster"), children: "Open Seat" })
        ] })
      }
    ),
    /* @__PURE__ */ l.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Catalog gaps are honesty, not placeholders. Height / flowering / chem chips come from densified indexes when present. Use in Compose to draft a plant; Open Seat to assign an existing roster row — neither invents missing Want/Got." }),
    /* @__PURE__ */ l.jsx(M1, {})
  ] });
}
function z1() {
  const { entity: a, state: i, tick: c } = Ce(), [o, d] = nr(), f = Ly(a), h = Number(o.get("pot") || 0), m = h >= 1 && h <= 4 && qt(h, i) ? h : null, _ = (v) => {
    if (!qt(v, i)) return;
    const g = new URLSearchParams(o);
    g.set("pot", String(v)), d(g, { replace: !0 });
  }, b = () => {
    const v = new URLSearchParams(o);
    v.delete("pot"), d(v, { replace: !0 });
  };
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ l.jsx(
      Nt,
      {
        icon: "roster",
        title: "Roster",
        subtitle: "Seats — open a row for Plant Seat drawer. Nutrient mix lives in Compose.",
        primaryAction: /* @__PURE__ */ l.jsx(ai, { to: "/grow/compose", children: /* @__PURE__ */ l.jsx(ce, { primary: !0, children: "Use in Compose" }) })
      }
    ),
    /* @__PURE__ */ l.jsx("div", { style: { marginBottom: 14 }, children: /* @__PURE__ */ l.jsx(oi, { compact: !0 }) }),
    /* @__PURE__ */ l.jsx(re, { className: "dsc-glass", title: "Roster", icon: "roster", children: f.length ? /* @__PURE__ */ l.jsxs("table", { className: "dsc-table", children: [
      /* @__PURE__ */ l.jsx("thead", { children: /* @__PURE__ */ l.jsxs("tr", { children: [
        /* @__PURE__ */ l.jsx("th", { children: "Slot" }),
        /* @__PURE__ */ l.jsx("th", { children: "Name" }),
        /* @__PURE__ */ l.jsx("th", { children: "Strain" }),
        /* @__PURE__ */ l.jsx("th", { children: "Status" }),
        /* @__PURE__ */ l.jsx("th", { children: "Pot" }),
        /* @__PURE__ */ l.jsx("th", { children: "Need" }),
        /* @__PURE__ */ l.jsx("th", { children: "Tent" })
      ] }) }),
      /* @__PURE__ */ l.jsx("tbody", { children: f.map((v) => {
        const g = Number(v.pot), j = g >= 1 && g <= 4, w = j && qt(g, i), S = j ? lr(Qc(i, g)) : "—", E = j ? i(`sensor.dsc_pot${g}_need_summary`, "—") : "—", N = j ? Ha(g, i, a) : null;
        return /* @__PURE__ */ l.jsxs(
          "tr",
          {
            onClick: () => {
              w && _(g);
            },
            style: w ? { cursor: "pointer" } : void 0,
            children: [
              /* @__PURE__ */ l.jsxs("td", { children: [
                "#",
                v.slot
              ] }),
              /* @__PURE__ */ l.jsx("td", { children: v.nickname || "—" }),
              /* @__PURE__ */ l.jsx("td", { children: v.strain || "—" }),
              /* @__PURE__ */ l.jsx("td", { children: v.status || "—" }),
              /* @__PURE__ */ l.jsx("td", { children: j ? /* @__PURE__ */ l.jsxs("span", { className: "dsc-chip-row", children: [
                N ? /* @__PURE__ */ l.jsx(On, { spec: N, size: 22 }) : null,
                "P",
                g,
                w ? null : /* @__PURE__ */ l.jsx(D, { label: "OOS", tone: "warn" })
              ] }) : "—" }),
              /* @__PURE__ */ l.jsx("td", { children: E }),
              /* @__PURE__ */ l.jsx("td", { children: /* @__PURE__ */ l.jsx(D, { label: S, tone: "muted" }) })
            ]
          },
          v.slot
        );
      }) })
    ] }) : /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "No plants in roster yet. Commit from Compose, then assign a pot." }) }),
    /* @__PURE__ */ l.jsx(
      cs,
      {
        open: m != null,
        onClose: b,
        title: m != null ? `Plant seat · POT${m}` : "Plant seat",
        children: m != null ? /* @__PURE__ */ l.jsx(or, { pot: m, onSelectPot: _ }) : null
      }
    )
  ] });
}
function D1() {
  const [a, i] = y.useState(null), c = ht(), o = At();
  y.useEffect(() => {
    const h = (m) => {
      const _ = m.detail, b = Number(_?.pot);
      b >= 1 && b <= 4 && i(b);
    };
    return window.addEventListener("dsc-dash-select-pot", h), () => window.removeEventListener("dsc-dash-select-pot", h);
  }, []);
  const d = y.useCallback(() => i(null), []);
  return /* @__PURE__ */ l.jsx(
    Yt,
    {
      open: a != null,
      onDismiss: d,
      title: a != null ? `Plant seat · POT${a}` : "Plant seat",
      help: null,
      children: a != null ? /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
        /* @__PURE__ */ l.jsx(or, { pot: a, onSelectPot: i }),
        o.pathname !== "/live/root" ? /* @__PURE__ */ l.jsx("div", { className: "dsc-row-actions", style: { marginTop: 12 }, children: /* @__PURE__ */ l.jsx(
          ce,
          {
            teal: !0,
            onClick: () => {
              const h = a;
              d(), c(`/live/root?pot=${h}`);
            },
            children: "Open Root"
          }
        ) }) : null
      ] }) : null
    }
  );
}
function dt(a, i, c, o, d, f) {
  const h = { id: a, label: i, series: c.series, color: o, unit: d, ...f };
  return c.ghost.length <= 1 ? [h] : [
    h,
    { id: `${a}-ghost`, label: `${i} prior`, series: c.ghost, color: o, unit: d, ghost: !0 }
  ];
}
const wb = y.createContext(null), Ma = {
  main: "#f97316",
  clone: "#22c55e",
  room: "#94a3b8"
};
function H1({ target: a, onClose: i }) {
  const { num: c } = Ce(), o = a?.kind.startsWith("pot") ? 48 : 24, { hours: d, setHours: f, maxPoints: h } = nl(o);
  y.useEffect(() => {
    a && f(o);
  }, [a, o, f]);
  const m = Math.min(Math.max(h, 96), 288), _ = xe("sensor.dsc_hub_tent_temperature", { hours: d, maxPoints: m, withGhost: !0 }), b = xe("sensor.dsc_hub_clone_temperature", { hours: d, maxPoints: m, withGhost: !0 }), v = xe("sensor.dsc_hub_room_temperature", { hours: d, maxPoints: m, withGhost: !0 }), g = xe("sensor.dsc_hub_tent_humidity", { hours: d, maxPoints: m, withGhost: !0 }), j = xe("sensor.dsc_hub_clone_humidity", { hours: d, maxPoints: m, withGhost: !0 }), w = xe("sensor.dsc_hub_room_humidity", { hours: d, maxPoints: m, withGhost: !0 }), S = xe("sensor.dsc_hub_vpd_kpa", { hours: d, maxPoints: m, withGhost: !0 }), E = xe("sensor.dsc_hub_clone_vpd_kpa", { hours: d, maxPoints: m, withGhost: !0 }), N = xe("sensor.dsc_coldest_root_zone_temp", { hours: d, maxPoints: m, withGhost: !0 }), C = xe("sensor.dsc_pot1_soil_moisture", { hours: d, maxPoints: m, withGhost: !0 }), O = xe("sensor.dsc_pot2_soil_moisture", { hours: d, maxPoints: m, withGhost: !0 }), B = xe("sensor.dsc_pot3_soil_moisture", { hours: d, maxPoints: m, withGhost: !0 }), J = xe("sensor.dsc_pot4_soil_moisture", { hours: d, maxPoints: m, withGhost: !0 }), P = xe("sensor.dsc_pot1_soil_temperature", { hours: d, maxPoints: m, withGhost: !0 }), G = xe("sensor.dsc_pot2_soil_temperature", { hours: d, maxPoints: m, withGhost: !0 }), X = xe("sensor.dsc_pot3_soil_temperature", { hours: d, maxPoints: m, withGhost: !0 }), W = xe("sensor.dsc_pot4_soil_temperature", { hours: d, maxPoints: m, withGhost: !0 }), se = c("number.dsc_hub_target_temp", 25), ue = c("number.dsc_hub_clone_target_temp", 24), de = c("number.dsc_hub_rh_target_min", 45), Y = c("number.dsc_hub_rh_target_max", 70);
  c("number.dsc_hub_clone_rh_min", 55), c("number.dsc_hub_clone_rh_max", 75);
  const ie = c("number.dsc_hub_vpd_target_min", 0.8), te = c("number.dsc_hub_vpd_target_max", 1.4), A = c("number.dsc_hub_clone_vpd_min", 0.6), T = c("number.dsc_hub_clone_vpd_max", 1.2), $ = c("number.dsc_hub_mat_root_zone_low", 20), Q = c("number.dsc_hub_mat_root_zone_high", 24), ne = y.useMemo(() => {
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
            { value: se, color: "#f9731688", label: "4×8 target" },
            { value: ue, color: "#22c55e88", label: "2×4 target" }
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
          targets: [{ min: de, max: Y, color: "#22c55e88" }]
        };
      case "vpd":
        return {
          unit: "kPa",
          height: 380,
          series: [
            ...dt("mv", "4×8 Tent", S, Ma.main, "kPa"),
            ...dt("cv", "2×4 Clone", E, Ma.clone, "kPa")
          ],
          targets: [
            { min: ie, max: te, color: "#f9731688" },
            { min: A, max: T, color: "#22c55e88" }
          ]
        };
      case "root":
        return {
          unit: "°C",
          height: 380,
          series: [...dt("root", "Root coldest", N, "#fbbf24", "°C")],
          targets: [{ min: $, max: Q, color: "#22c55e88" }]
        };
      default: {
        const F = Number(a.kind.replace("pot", "")), I = [C, O, B, J][F - 1], ae = [P, G, X, W][F - 1];
        return {
          unit: "%",
          height: 320,
          yDomain: { left: { min: 0, max: 100 }, right: { min: 10, max: 35 } },
          series: [
            ...dt(`pm${F}`, "Moisture", I, "#3b82f6", "%", { axis: "left" }),
            ...dt(`pt${F}`, "Soil °C", ae, Ma.main, "°C", { axis: "right" })
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
    E,
    N,
    C,
    O,
    B,
    J,
    P,
    G,
    X,
    W,
    se,
    ue,
    de,
    Y,
    ie,
    te,
    A,
    T,
    $,
    Q
  ]), le = ne ? ne.series.every((F) => F.series.length < 2) : !0, k = ne && Math.max(...ne.series.map((F) => F.series.at(-1)?.t ?? 0), 0) || void 0;
  return /* @__PURE__ */ l.jsxs(cs, { open: !!a, onClose: i, title: a?.title ?? "History", children: [
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ l.jsx(sl, { hours: d, setHours: f, extras: al }),
      le ? /* @__PURE__ */ l.jsx(D, { label: "Thin recorder", tone: "warn" }) : null
    ] }),
    ne ? /* @__PURE__ */ l.jsx(
      wn,
      {
        live: !0,
        height: ne.height,
        unit: ne.unit,
        lastSyncAt: k,
        series: ne.series,
        targets: ne.targets,
        yDomain: ne.yDomain
      }
    ) : null,
    /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", style: { marginTop: 10, fontSize: 12 }, children: "Multi-zone history — same series as HA Home gauge popups." })
  ] });
}
function L1({ children: a }) {
  const [i, c] = y.useState(null), o = y.useCallback(() => c(null), []), d = y.useCallback((h) => c(h), []), f = y.useMemo(() => ({ open: d, close: o }), [d, o]);
  return /* @__PURE__ */ l.jsxs(wb.Provider, { value: f, children: [
    a,
    /* @__PURE__ */ l.jsx(H1, { target: i, onClose: o })
  ] });
}
function jb() {
  const a = y.useContext(wb);
  return a || { open: () => {
  }, close: () => {
  } };
}
const Sb = {
  temp: "Temperature — 24h",
  rh: "Humidity — 24h",
  vpd: "VPD — 24h",
  root: "Soil temperature — 24h",
  pot1: "POT1 — moisture & soil temp",
  pot2: "POT2 — moisture & soil temp",
  pot3: "POT3 — moisture & soil temp",
  pot4: "POT4 — moisture & soil temp"
}, kb = y.createContext(null);
function $1(a) {
  return a === "clone" || a === "compare" || a === "room" || a === "main" ? a : "main";
}
function U1({ children: a }) {
  const [i, c] = nr(), o = $1(i.get("tent") ?? i.get("zone")), d = y.useCallback(
    (h) => {
      const m = new URLSearchParams(i);
      m.set("tent", h), m.delete("zone"), c(m, { replace: !0 });
    },
    [i, c]
  ), f = y.useMemo(() => ({ focus: o, setFocus: d }), [o, d]);
  return /* @__PURE__ */ l.jsx(kb.Provider, { value: f, children: a });
}
function wd() {
  const a = y.useContext(kb);
  return a || {
    focus: "main",
    setFocus: () => {
    }
  };
}
function jd() {
  const { online: a, uptime: i, heartbeat: c } = G_(), o = kt(), { state: d, available: f } = Ce(), h = f("sensor.dsc_hub_api_down_age") ? d("sensor.dsc_hub_api_down_age", "—") : i != null ? String(i) : "—", m = f("sensor.dsc_hub_link_recovery_bounces") ? d("sensor.dsc_hub_link_recovery_bounces", "—") : "—", _ = f("sensor.dsc_hub_rf_status") ? d("sensor.dsc_hub_rf_status", "—") : "—", b = f("sensor.dsc_hub_ha_handshake_age") ? d("sensor.dsc_hub_ha_handshake_age", "—") : c != null ? String(c) : "—";
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", children: [
    /* @__PURE__ */ l.jsx(
      D,
      {
        icon: a ? "ok" : "alert",
        label: a ? "HUB LINK" : "HUB LINK DOWN",
        tone: a ? "ok" : "bad"
      }
    ),
    /* @__PURE__ */ l.jsx(D, { label: `Age ${h}`, tone: "muted" }),
    /* @__PURE__ */ l.jsx(D, { label: `Bounces ${m}`, tone: "muted" }),
    /* @__PURE__ */ l.jsx(D, { label: `RF ${_}`, tone: "muted" }),
    /* @__PURE__ */ l.jsx(D, { label: `Beat ${b}`, tone: "muted" }),
    o.surface ? /* @__PURE__ */ l.jsx(D, { label: o.surface, tone: "muted" }) : null
  ] });
}
const B1 = "_allocated";
function ft(a, i, c) {
  const o = c.num(i);
  return c.forceKind === "mass-balance" ? {
    value: c.num(a, o),
    kind: "mass-balance",
    entityId: a,
    nameplate: Number.isFinite(o) ? o : void 0
  } : c.available(a) && Number.isFinite(c.num(a)) ? {
    value: c.num(a),
    kind: a.endsWith(B1) ? "allocated" : "nameplate",
    entityId: a,
    nameplate: Number.isFinite(o) ? o : void 0
  } : {
    value: o,
    kind: "nameplate",
    entityId: i,
    nameplate: Number.isFinite(o) ? o : void 0
  };
}
function ur({ readings: a }) {
  const i = a.some((o) => o.kind === "nameplate"), c = a.some((o) => o.kind === "allocated" || o.kind === "mass-balance");
  return i && !c ? /* @__PURE__ */ l.jsx("p", { className: "dsc-honesty", style: { margin: "0 0 8px" }, children: "CFM guessed from fan % × nameplate — run Learning to measure." }) : i && c ? /* @__PURE__ */ l.jsx("p", { className: "dsc-honesty", style: { margin: "0 0 8px" }, children: "Mixed CFM trust — some ducts from Learning, others still nameplate. Run Learning on the dashed paths." }) : /* @__PURE__ */ l.jsx("p", { className: "dsc-honesty", style: { margin: "0 0 8px" }, children: "CFM from Learning (anemometer)." });
}
const F1 = [
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
function G1(a) {
  return a.linkEntity || a.relayEntity || a.demandEntity || a.inServiceEntity || a.firmwareEntity || "";
}
function Sd(a) {
  return F1.map((i) => V1(i, a));
}
function V1(a, i) {
  const c = G1(a), o = i.hub.online;
  if (a.id === "hub")
    return {
      id: a.id,
      label: a.label,
      status: i.hub.online ? "ok" : "dark",
      entityId: "binary_sensor.dsc_hub_link",
      firmwareEntity: a.firmwareEntity
    };
  if (a.inServiceEntity && !(a.id.startsWith("pot") && a.id.length === 4, Mc(i, a.id)))
    return {
      id: a.id,
      label: a.label,
      status: "oos",
      subtitle: a.plannedWhenOff ? "Not built / parked" : "Out of service",
      entityId: a.inServiceEntity,
      inServiceEntity: a.inServiceEntity,
      plannedOos: a.plannedWhenOff,
      runtimeToday: a.runtimeToday,
      cyclesToday: a.cyclesToday,
      demandEntity: a.demandEntity,
      firmwareEntity: a.firmwareEntity
    };
  const d = i.sonoffs[a.id], f = i.pots[a.id], h = d?.online ?? f?.online ?? !1, m = a.inServiceEntity ? Mc(i, a.id) : !0;
  if (a.id.startsWith("pot"))
    return m ? h ? {
      id: a.id,
      label: a.label,
      status: "idle",
      subtitle: "Idle",
      entityId: a.firmwareEntity ?? c,
      inServiceEntity: a.inServiceEntity,
      firmwareEntity: a.firmwareEntity
    } : {
      id: a.id,
      label: a.label,
      status: m ? "dark" : "missing",
      subtitle: m ? "Dark" : void 0,
      entityId: a.firmwareEntity ?? c,
      inServiceEntity: a.inServiceEntity,
      firmwareEntity: a.firmwareEntity
    } : {
      id: a.id,
      label: a.label,
      status: "oos",
      subtitle: a.plannedWhenOff ? "Not built / parked" : "Out of service",
      entityId: a.inServiceEntity ?? c,
      inServiceEntity: a.inServiceEntity,
      plannedOos: a.plannedWhenOff,
      firmwareEntity: a.firmwareEntity
    };
  if (d) {
    if (!h)
      return {
        id: a.id,
        label: a.label,
        status: m ? "dark" : "missing",
        subtitle: m ? "Dark" : void 0,
        entityId: a.relayEntity ?? a.demandEntity ?? c,
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
      entityId: a.demandEntity || a.relayEntity || c,
      inServiceEntity: a.inServiceEntity,
      runtimeToday: a.runtimeToday,
      cyclesToday: a.cyclesToday,
      demandEntity: a.demandEntity,
      firmwareEntity: a.firmwareEntity
    };
  }
  return a.id === "tank" || a.id === "ac" || a.id === "mister" ? Mc(i, a.id) ? {
    id: a.id,
    label: a.label,
    status: "idle",
    subtitle: "Idle",
    entityId: a.inServiceEntity ?? c,
    inServiceEntity: a.inServiceEntity
  } : {
    id: a.id,
    label: a.label,
    status: "oos",
    subtitle: a.plannedWhenOff ? "Not built / parked" : "Out of service",
    entityId: a.inServiceEntity ?? c,
    inServiceEntity: a.inServiceEntity,
    plannedOos: a.plannedWhenOff
  } : {
    id: a.id,
    label: a.label,
    status: o ? "dark" : "missing",
    entityId: c,
    inServiceEntity: a.inServiceEntity,
    demandEntity: a.demandEntity,
    firmwareEntity: a.firmwareEntity
  };
}
function kd(a) {
  const i = a.filter((d) => d.id !== "hub"), c = i.filter((d) => d.status === "oos"), o = i.filter((d) => d.status === "dark").length;
  return {
    inService: i.length - c.length,
    total: i.length,
    dark: o
  };
}
function Y1(a, i) {
  switch (a) {
    case "ok":
      return i;
    case "idle":
      return `${i} idle`;
    case "held":
      return `${i} HELD`;
    case "oos":
      return `${i} OOS`;
    case "missing":
      return `${i} missing`;
    case "dark":
      return `${i} dark`;
    default:
      return a;
  }
}
function q1(a) {
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
const u_ = { w: 720, h: 400 }, Ps = { x: 360, y: 188 };
function d_(a, i, c) {
  if (a === "hub") return Ps;
  const o = 148, d = i / Math.max(c, 1) * Math.PI * 2 - Math.PI / 2;
  return { x: Ps.x + Math.cos(d) * o, y: Ps.y + Math.sin(d) * o };
}
function f_(a) {
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
function Nd({
  nodes: a,
  onSelect: i
}) {
  const c = a.find((d) => d.id === "hub"), o = a.filter((d) => d.id !== "hub");
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-kit-pulse", children: [
    /* @__PURE__ */ l.jsxs("svg", { viewBox: `0 0 ${u_.w} ${u_.h}`, className: "dsc-kit-constellation", "aria-label": "Kit pulse", children: [
      o.map((d, f) => {
        const h = d_(d.id, f, o.length), m = d.status === "oos" || d.status === "missing" || d.status === "dark";
        return /* @__PURE__ */ l.jsx(
          "line",
          {
            x1: Ps.x,
            y1: Ps.y,
            x2: h.x,
            y2: h.y,
            stroke: f_(c?.status === "ok" && !m ? "ok" : d.status),
            strokeWidth: "1.2",
            strokeDasharray: m || c?.status !== "ok" ? "4 4" : void 0,
            opacity: 0.7
          },
          `edge-${d.id}`
        );
      }),
      a.map((d) => {
        const f = d.id === "hub" ? Ps : d_(d.id, o.findIndex((b) => b.id === d.id), o.length), h = d.status === "oos" || d.status === "missing" || d.status === "dark", m = d.status === "idle", _ = d.label.replace("Pot ", "P").replace("Clone mister", "Mister").replace("Dehumidifier", "Dehum").replace("Humidifier", "Hum");
        return /* @__PURE__ */ l.jsxs(
          "g",
          {
            transform: `translate(${f.x},${f.y})`,
            role: i ? "button" : void 0,
            tabIndex: i ? 0 : void 0,
            style: { cursor: i ? "pointer" : void 0 },
            onClick: () => i?.(d),
            onKeyDown: (b) => {
              (b.key === "Enter" || b.key === " ") && (b.preventDefault(), i?.(d));
            },
            children: [
              /* @__PURE__ */ l.jsx(
                "circle",
                {
                  r: d.id === "hub" ? 22 : 16,
                  fill: h || m ? "none" : "rgba(38,198,218,0.12)",
                  stroke: f_(d.status),
                  strokeWidth: "1.8",
                  strokeDasharray: h ? "4 3" : void 0
                }
              ),
              /* @__PURE__ */ l.jsx("text", { textAnchor: "middle", y: "4", fill: "currentColor", fontSize: "9", children: _ })
            ]
          },
          d.id
        );
      })
    ] }),
    /* @__PURE__ */ l.jsx("div", { className: "dsc-chip-row", children: a.map((d) => /* @__PURE__ */ l.jsx(
      D,
      {
        label: Y1(d.status, d.label),
        tone: q1(d.status),
        onClick: i ? () => i(d) : void 0
      },
      d.id
    )) })
  ] });
}
const X1 = 25e3;
function Nb(a = X1) {
  const { available: i, tick: c } = Ce(), o = y.useRef({}), [, d] = y.useState(() => Date.now());
  return y.useEffect(() => {
    const f = window.setInterval(() => d(Date.now()), 1e3);
    return () => window.clearInterval(f);
  }, []), y.useCallback(
    (f) => {
      if (!f) return !1;
      if (i(f))
        return o.current[f] = Date.now(), !0;
      const h = o.current[f];
      return h == null ? !1 : Date.now() - h < a;
    },
    [i, a, c]
  );
}
function Q1() {
  const { state: a, num: i, available: c, entity: o, tick: d } = Ce(), f = kt(), h = ht(), [m, _] = y.useState(!1), b = Nb(), { isSnoozed: v } = cr(), g = kn(), j = f.hub.online || b("sensor.dsc_hub_uptime"), w = lb(), S = ib(), E = cb(), N = i("sensor.dsc_active_alert_count", 0), C = _e("sensor.dsc_hub_tent_temperature"), O = _e("sensor.dsc_hub_tent_humidity"), B = _e("sensor.dsc_hub_vpd_kpa"), J = _e("sensor.dsc_hub_clone_temperature"), P = _e("sensor.dsc_hub_clone_humidity"), G = _e("sensor.dsc_hub_clone_vpd_kpa"), X = _e("sensor.dsc_pot1_got_moisture"), W = _e("sensor.dsc_pot2_got_moisture"), se = _e("sensor.dsc_pot3_got_moisture"), ue = _e("sensor.dsc_pot4_got_moisture"), de = [X, W, se, ue], Y = f.panel.online ? "on" : a("binary_sensor.dsc_hub_panel_link"), ie = f.panel.online || Y === "on", te = f.hub.values.heartbeat != null ? String(f.hub.values.heartbeat) : a("sensor.dsc_hub_heartbeat", "NO BEAT"), A = f.hub.online && f.hub.values.heartbeat != null ? !0 : b("sensor.dsc_hub_heartbeat"), T = a("switch.dsc_hub_manual_takeover") === "on", $ = a("switch.dsc_hub_tent_manual_override") === "on", Q = a("switch.dsc_hub_tent_full_auto_mode") === "on", ne = !!f.system.reduced_kit, le = String(o("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? ""), k = Q && !T, F = a("sensor.dsc_fleet_version_status", f.expected_firmware || "—"), I = f.version === f.expected_firmware ? "ok" : F === "warn" ? "warn" : "drift", ae = vb.filter((ee) => a(ee) === "on" && !v(ee)).map((ee) => ({
    id: ee,
    label: ee.split(".").pop()?.replace(/dsc_/, "").replace(/_/g, " ") || ee
  })), me = aa.map((ee) => rs(ee, { state: a, entity: o })), he = Sd(f), ge = kd(he), Le = ft("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available: c,
    num: i
  }), Se = b("binary_sensor.dsc_hub_panel_link") || ie, lt = !ie && c("sensor.dsc_control_wifi_rssi"), pt = !ie && !lt && !Se, je = C.stale || O.stale || B.stale || J.stale || P.stale || G.stale, it = (ee) => g.open({
    entityId: ee.entityId,
    label: ee.label,
    kind: "kit",
    runtimeToday: ee.runtimeToday,
    cyclesToday: ee.cyclesToday,
    demandEntity: ee.demandEntity
  });
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ l.jsx(
      Nt,
      {
        icon: "mission",
        title: "Mission",
        subtitle: "Triage glance — Next, faults, seats, lung. Command lives on Climate.",
        primaryAction: /* @__PURE__ */ l.jsx(ce, { teal: !0, onClick: () => h("/live/twin"), children: "Open Twin" }),
        actions: /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
          /* @__PURE__ */ l.jsx(ce, { primary: !0, onClick: () => h("/live/climate"), children: "Climate Want" }),
          /* @__PURE__ */ l.jsx(_d, { label: "Search", icon: "search", onClick: () => _(!0) }),
          /* @__PURE__ */ l.jsx(
            sr,
            {
              label: "Mission settings",
              items: [
                {
                  id: "climate",
                  label: "Open Climate",
                  onSelect: () => h("/live/climate")
                },
                { id: "main", label: "4×8 cockpit", onSelect: () => h("/live/4x8") },
                { id: "clone", label: "2×4 cockpit", onSelect: () => h("/live/2x4") },
                { id: "fleet", label: "Open Fleet", onSelect: () => h("/fleet") }
              ]
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-status-strip", children: [
      /* @__PURE__ */ l.jsx(
        D,
        {
          icon: j ? "ok" : "alert",
          label: j ? "HUB ONLINE" : "HUB OFFLINE",
          tone: j ? "ok" : "bad",
          onClick: () => g.open({ entityId: "binary_sensor.dsc_hub_link", label: "Hub", kind: "kit" })
        }
      ),
      j ? null : /* @__PURE__ */ l.jsx(
        D,
        {
          label: `OFF ${w != null ? Da(w) : "—"}`,
          tone: "bad",
          pulse: !0
        }
      ),
      je ? /* @__PURE__ */ l.jsx(D, { label: "HELD VITALS", tone: "warn" }) : null,
      /* @__PURE__ */ l.jsx(
        D,
        {
          label: `${ge.inService} of ${ge.total} in service`,
          tone: ge.dark > 0 ? "bad" : "ok",
          onClick: () => h("/fleet")
        }
      ),
      /* @__PURE__ */ l.jsx(
        D,
        {
          label: ie ? "PANEL ESP-NOW" : lt ? "PANEL HA-ONLY" : pt ? "PANEL OFFLINE" : "PANEL…",
          tone: ie ? "ok" : lt ? "warn" : "bad",
          onClick: () => g.open({ entityId: "binary_sensor.dsc_hub_panel_link", label: "Panel link", kind: "kit" })
        }
      ),
      pt ? /* @__PURE__ */ l.jsx(
        D,
        {
          label: `PANEL OFF ${E != null ? Da(E) : "—"}`,
          tone: "bad",
          pulse: !0
        }
      ) : null,
      /* @__PURE__ */ l.jsx(
        D,
        {
          icon: A ? "ok" : "alert",
          label: A ? `BEAT ${te}` : "NO BEAT",
          tone: A ? "ok" : "bad",
          onClick: () => g.open({ entityId: "sensor.dsc_hub_heartbeat", label: "Heartbeat", kind: "kit" })
        }
      ),
      A ? null : /* @__PURE__ */ l.jsx(D, { label: `BEAT OFF ${S != null ? Da(S) : "—"}`, tone: "bad", pulse: !0 }),
      /* @__PURE__ */ l.jsx(
        D,
        {
          icon: ae.length === 0 ? "ok" : "alert",
          label: ae.length === 0 ? "All clear" : `${ae.length} alert(s)`,
          tone: ae.length === 0 ? "ok" : "bad",
          pulse: ae.length > 0,
          onClick: () => {
            const ee = ae[0];
            g.open({
              entityId: ee?.id || "sensor.dsc_active_alert_count",
              label: ee?.label || "Alerts",
              kind: "alert"
            });
          }
        }
      ),
      /* @__PURE__ */ l.jsx(
        D,
        {
          label: I === "ok" ? "FLEET OK" : I === "warn" ? "FLEET WARN" : "FLEET DRIFT",
          tone: I === "ok" ? "ok" : I === "warn" ? "warn" : "bad",
          onClick: () => g.open({
            entityId: "sensor.dsc_fleet_version_status",
            label: `Fleet ${f.expected_firmware}`,
            kind: "fleet"
          })
        }
      ),
      Q ? /* @__PURE__ */ l.jsx(D, { icon: "ok", label: "FULL AUTO", tone: "ok", pulse: !0 }) : null,
      k ? /* @__PURE__ */ l.jsx(D, { label: "AUTO-DRIVEN", tone: "ok" }) : null,
      T ? /* @__PURE__ */ l.jsx(D, { icon: "alert", label: "MANUAL TAKEOVER", tone: "warn", pulse: !0 }) : null,
      $ ? /* @__PURE__ */ l.jsx(D, { icon: "alert", label: "FAN OVERRIDE", tone: "warn", pulse: !0 }) : null,
      Q && ne ? /* @__PURE__ */ l.jsx(
        D,
        {
          icon: "alert",
          label: le || "UNEXPECTED OOS",
          tone: "warn",
          pulse: !0,
          onClick: () => g.open({
            entityId: "binary_sensor.dsc_reduced_kit",
            label: "Unexpected OOS",
            kind: "alert"
          })
        }
      ) : null
    ] }),
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-grid dsc-mission-modern", children: [
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsx(Ey, {}) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsx(re, { className: "dsc-glass", title: "Hub link", icon: "fleet", children: /* @__PURE__ */ l.jsx(jd, {}) }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsx(re, { className: "dsc-glass", title: "Kit pulse", icon: "ok", children: /* @__PURE__ */ l.jsx(Nd, { nodes: he, onSelect: it }) }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Lung CFM", icon: "climate", children: [
        /* @__PURE__ */ l.jsx(ur, { readings: [Le] }),
        /* @__PURE__ */ l.jsx("div", { className: "dsc-chip-row", children: /* @__PURE__ */ l.jsxs("button", { type: "button", className: "dsc-chip", onClick: () => h("/live/climate"), children: [
          "OUT ",
          Number.isFinite(Le.value) ? Math.round(Le.value) : "—",
          " cfm → Climate"
        ] }) })
      ] }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsx(re, { className: "dsc-glass", title: "Plant seats", icon: "seat", children: /* @__PURE__ */ l.jsx("div", { className: "dsc-chip-row", children: me.map((ee) => {
        const $e = !qt(ee.pot, a), We = ir(ee.pot, a), _t = de[ee.pot - 1], Ie = !$e && !We.blockNeedAct && ee.need && ee.need !== "—" && ee.need !== "ok";
        return /* @__PURE__ */ l.jsxs(
          "button",
          {
            type: "button",
            className: `dsc-chip${$e ? "" : " dsc-chip--ok"}${Ie ? " dsc-chip--pulse" : ""}`,
            onClick: () => window.dispatchEvent(new CustomEvent("dsc-dash-select-pot", { detail: { pot: ee.pot } })),
            title: $e ? "OOS — no fake Got" : ee.need,
            children: [
              /* @__PURE__ */ l.jsx(On, { spec: Ha(ee.pot, a, o), size: 18 }),
              "P",
              ee.pot,
              " ",
              ee.plantName !== "—" ? ee.plantName : "—",
              " · Got M",
              " ",
              $e ? "—" : _t.stale ? `${Number.isFinite(_t.value) ? _t.value.toFixed(0) : "—"}*` : ee.moisture,
              $e ? " · OOS" : ` · Need ${ee.need}`,
              _t.stale && !$e ? " · HELD" : "",
              We.labels.length ? ` · ${We.labels.join("/")}` : ""
            ]
          },
          ee.pot
        );
      }) }) }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ l.jsx(re, { className: "dsc-glass", title: "Faults / alerts", icon: "alert", children: ae.length === 0 && N === 0 ? /* @__PURE__ */ l.jsx("div", { className: "dsc-empty dsc-empty--ok", children: "No active faults — all clear." }) : /* @__PURE__ */ l.jsxs("ul", { className: "dsc-fault-list", children: [
        ae.map((ee) => /* @__PURE__ */ l.jsxs("li", { children: [
          /* @__PURE__ */ l.jsx(
            D,
            {
              label: ee.label,
              tone: "bad",
              pulse: !0,
              icon: "alert",
              onClick: () => g.open({ entityId: ee.id, label: ee.label, kind: "alert" })
            }
          ),
          /* @__PURE__ */ l.jsx("span", { className: "dsc-muted", children: ee.id })
        ] }, ee.id)),
        N > 0 && ae.length === 0 ? /* @__PURE__ */ l.jsxs("li", { children: [
          /* @__PURE__ */ l.jsx(D, { label: `${N} system alert(s)`, tone: "bad", pulse: !0, icon: "alert" }),
          /* @__PURE__ */ l.jsx("span", { className: "dsc-muted", children: "See Fleet for entity detail" })
        ] }) : null
      ] }) }) })
    ] }),
    /* @__PURE__ */ l.jsx(cs, { open: m, onClose: () => _(!1), title: "Quick jump", children: /* @__PURE__ */ l.jsx("div", { className: "dsc-chip-row", children: [
      { path: "/live/climate", label: "Climate" },
      { path: "/live/twin", label: "Twin" },
      { path: "/live/4x8", label: "4×8" },
      { path: "/live/2x4", label: "2×4" },
      { path: "/live/root", label: "Root" },
      { path: "/live/light", label: "Light" },
      { path: "/grow/compose", label: "Compose" },
      { path: "/fleet", label: "Fleet" }
    ].map((ee) => /* @__PURE__ */ l.jsx(
      "button",
      {
        type: "button",
        className: "dsc-btn teal",
        onClick: () => {
          _(!1), h(ee.path);
        },
        children: ee.label
      },
      ee.path
    )) }) })
  ] });
}
function Z1(a) {
  return a.kind === "allocated" || a.kind === "mass-balance" ? void 0 : "6 5";
}
function Ta(a) {
  return Number.isFinite(a) ? String(Math.round(a)) : "—";
}
function K1(a) {
  return !Number.isFinite(a) || a <= 0 ? 0 : a < 40 ? 1 : a < 80 ? 2 : a < 140 ? 3 : a < 220 ? 4 : 5;
}
function as({
  x1: a,
  y1: i,
  x2: c,
  y2: o,
  reading: d,
  color: f,
  onClick: h
}) {
  const m = K1(d.value), _ = c - a, b = o - i, v = Math.hypot(_, b) || 1, g = -b / v * 3.2, j = _ / v * 3.2, w = -Math.floor((m - 1) / 2);
  return /* @__PURE__ */ l.jsx(
    "g",
    {
      role: h ? "button" : void 0,
      style: { cursor: h ? "pointer" : void 0 },
      onClick: h,
      children: m === 0 ? /* @__PURE__ */ l.jsx(
        "line",
        {
          x1: a,
          y1: i,
          x2: c,
          y2: o,
          stroke: f,
          strokeWidth: "1.2",
          strokeDasharray: "2 6",
          opacity: 0.35
        }
      ) : Array.from({ length: m }, (S, E) => {
        const N = w + E;
        return /* @__PURE__ */ l.jsx(
          "line",
          {
            x1: a + g * N,
            y1: i + j * N,
            x2: c + g * N,
            y2: o + j * N,
            stroke: f,
            strokeWidth: 1.4 + Math.min(2.2, d.value / 120),
            strokeDasharray: Z1(d),
            opacity: 0.85
          },
          E
        );
      })
    }
  );
}
function Cd({
  intakeClone: a,
  intakeMain: i,
  outCfm: c,
  recircCfm: o,
  compact: d,
  focus: f
}) {
  const h = kn(), m = {
    value: Number.isFinite(a.value) ? a.value : 0,
    kind: a.kind,
    entityId: a.entityId,
    nameplate: a.nameplate
  }, _ = (Number.isFinite(a.value) ? a.value : 0) + (Number.isFinite(i.value) ? i.value : 0), b = f !== "main", v = f !== "clone", g = f !== "clone", j = f === "clone" ? [a] : f === "main" ? [i, c, o] : [a, i, c, o], w = () => h.open({
    entityId: m.entityId,
    label: "Cascade 2×4 → 4×8",
    unit: "cfm"
  });
  return /* @__PURE__ */ l.jsxs("div", { className: `dsc-air-path${d ? " is-compact" : ""}`, children: [
    /* @__PURE__ */ l.jsx(ur, { readings: j }),
    /* @__PURE__ */ l.jsxs("svg", { viewBox: "0 0 720 260", className: "dsc-air-svg", "aria-label": "Air path room to tents", children: [
      /* @__PURE__ */ l.jsx("rect", { x: "16", y: "78", width: "120", height: "110", rx: "12", fill: "none", stroke: "var(--dsc-teal)", strokeWidth: "1.8" }),
      /* @__PURE__ */ l.jsx("text", { x: "76", y: "122", textAnchor: "middle", fill: "currentColor", fontSize: "13", children: "Room" }),
      /* @__PURE__ */ l.jsx("text", { x: "76", y: "142", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: "umbrella lung" }),
      b ? /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
        /* @__PURE__ */ l.jsx("rect", { x: "220", y: "28", width: "150", height: "88", rx: "10", fill: "none", stroke: "var(--dsc-teal)", strokeWidth: "1.8" }),
        /* @__PURE__ */ l.jsx("text", { x: "295", y: "64", textAnchor: "middle", fill: "currentColor", fontSize: "13", children: "2×4 tent" }),
        /* @__PURE__ */ l.jsxs("text", { x: "295", y: "84", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: [
          "in ",
          Ta(a.value),
          " cfm"
        ] }),
        /* @__PURE__ */ l.jsx(
          as,
          {
            x1: 136,
            y1: 110,
            x2: 220,
            y2: 72,
            reading: a,
            color: "var(--dsc-teal)",
            onClick: () => h.open({
              entityId: a.entityId,
              label: "2×4 intake CFM",
              unit: "cfm"
            })
          }
        )
      ] }) : null,
      v ? /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
        /* @__PURE__ */ l.jsx("rect", { x: "220", y: "150", width: "150", height: "88", rx: "10", fill: "none", stroke: "var(--dsc-blue)", strokeWidth: "1.8" }),
        /* @__PURE__ */ l.jsx("text", { x: "295", y: "186", textAnchor: "middle", fill: "currentColor", fontSize: "13", children: "4×8 tent" }),
        /* @__PURE__ */ l.jsxs("text", { x: "295", y: "206", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: [
          "in ",
          Ta(i.value),
          " cfm"
        ] }),
        /* @__PURE__ */ l.jsx(
          as,
          {
            x1: 136,
            y1: 140,
            x2: 220,
            y2: 194,
            reading: i,
            color: "var(--dsc-blue)",
            onClick: () => h.open({
              entityId: i.entityId,
              label: "4×8 intake CFM",
              unit: "cfm"
            })
          }
        )
      ] }) : null,
      g ? /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
        /* @__PURE__ */ l.jsx("rect", { x: "560", y: "150", width: "140", height: "88", rx: "10", fill: "none", stroke: "#ff8a65", strokeWidth: "1.6" }),
        /* @__PURE__ */ l.jsx("text", { x: "630", y: "186", textAnchor: "middle", fill: "currentColor", fontSize: "12", children: "Outdoors" }),
        /* @__PURE__ */ l.jsxs("text", { x: "630", y: "206", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: [
          "dump ",
          Ta(c.value)
        ] })
      ] }) : null,
      f ? null : /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
        /* @__PURE__ */ l.jsx(
          as,
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
        /* @__PURE__ */ l.jsxs("text", { x: "370", y: "140", fill: "var(--dsc-amber)", fontSize: "10", children: [
          "cascade ",
          Ta(m.value)
        ] }),
        /* @__PURE__ */ l.jsx("text", { x: "370", y: "152", fill: "var(--dsc-gray-5)", fontSize: "9", children: "same air · not added to Σ" })
      ] }),
      f === "clone" ? /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
        /* @__PURE__ */ l.jsx(
          as,
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
        /* @__PURE__ */ l.jsx("rect", { x: "430", y: "54", width: "88", height: "36", rx: "8", fill: "none", stroke: "var(--dsc-amber)", strokeWidth: "1.4", strokeDasharray: "5 4" }),
        /* @__PURE__ */ l.jsx("text", { x: "474", y: "76", textAnchor: "middle", fill: "var(--dsc-amber)", fontSize: "10", children: "to 4×8" }),
        /* @__PURE__ */ l.jsxs("text", { x: "474", y: "102", textAnchor: "middle", fill: "var(--dsc-amber)", fontSize: "9", children: [
          "cascade ",
          Ta(m.value)
        ] })
      ] }) : null,
      f === "main" ? /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
        /* @__PURE__ */ l.jsx(
          as,
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
        /* @__PURE__ */ l.jsx("rect", { x: "251", y: "104", width: "88", height: "28", rx: "8", fill: "none", stroke: "var(--dsc-amber)", strokeWidth: "1.4", strokeDasharray: "5 4" }),
        /* @__PURE__ */ l.jsx("text", { x: "295", y: "122", textAnchor: "middle", fill: "var(--dsc-amber)", fontSize: "10", children: "from 2×4" }),
        /* @__PURE__ */ l.jsxs("text", { x: "390", y: "122", fill: "var(--dsc-amber)", fontSize: "9", children: [
          "cascade ",
          Ta(m.value)
        ] })
      ] }) : null,
      g ? /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
        /* @__PURE__ */ l.jsx(
          as,
          {
            x1: 370,
            y1: 194,
            x2: 560,
            y2: 194,
            reading: c,
            color: "#ff8a65",
            onClick: () => h.open({ entityId: c.entityId, label: "Dump OUT CFM", unit: "cfm" })
          }
        ),
        /* @__PURE__ */ l.jsx(
          as,
          {
            x1: 370,
            y1: 220,
            x2: 136,
            y2: 168,
            reading: o,
            color: "#b388ff",
            onClick: () => h.open({ entityId: o.entityId, label: "Recirc CFM", unit: "cfm" })
          }
        ),
        /* @__PURE__ */ l.jsxs("text", { x: "80", y: "200", fill: "#b388ff", fontSize: "10", children: [
          "recirc ",
          Ta(o.value)
        ] })
      ] }) : null
    ] }),
    f ? null : /* @__PURE__ */ l.jsx(
      D,
      {
        label: `Mass-balance exhaust = Σ intake ${Ta(_)} × dump/recirc split`,
        tone: "muted"
      }
    )
  ] });
}
function J1(a) {
  return a("sensor.dsc_hub_room_vpd_kpa") ? "sensor.dsc_hub_room_vpd_kpa" : a("sensor.dsc_hub_room_vpd") ? "sensor.dsc_hub_room_vpd" : "sensor.dsc_hub_room_vpd_kpa";
}
function An(a, i = 1) {
  return Number.isFinite(a) ? a.toFixed(i) : "—";
}
const P1 = [
  { id: "compare", label: "All" },
  { id: "main", label: "4×8" },
  { id: "clone", label: "2×4" },
  { id: "room", label: "Room" }
];
function W1() {
  const { num: a, state: i, entity: c, available: o } = Ce(), d = kt(), f = G_(), h = ht(), m = kn(), { focus: _, setFocus: b } = wd(), { hours: v, setHours: g, maxPoints: j } = nl(6), w = Ws("switch.dsc_hub_tent_manual_override").state === "on", S = Ws("switch.dsc_hub_tent_full_auto_mode").state === "on", E = String(c("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? ""), N = !!d.system.reduced_kit, C = _e("sensor.dsc_hub_tent_temperature"), O = _e("sensor.dsc_hub_tent_humidity"), B = _e("sensor.dsc_hub_vpd_kpa"), J = _e("sensor.dsc_hub_clone_temperature"), P = _e("sensor.dsc_hub_clone_humidity"), G = _e("sensor.dsc_hub_clone_vpd_kpa"), X = _e("sensor.dsc_hub_room_temperature"), W = _e("sensor.dsc_hub_room_humidity"), se = J1(c), ue = _e(se), de = xe("sensor.dsc_hub_tent_temperature", { hours: v, maxPoints: j, withGhost: !0 }), Y = xe("sensor.dsc_hub_tent_humidity", { hours: v, maxPoints: j, withGhost: !0 }), ie = xe("sensor.dsc_hub_vpd_kpa", { hours: v, maxPoints: j, withGhost: !0 }), te = xe("sensor.dsc_hub_clone_temperature", { hours: v, maxPoints: j, withGhost: !0 }), A = xe("sensor.dsc_hub_clone_humidity", { hours: v, maxPoints: j, withGhost: !0 }), T = xe("sensor.dsc_hub_clone_vpd_kpa", { hours: v, maxPoints: j, withGhost: !0 }), $ = xe("sensor.dsc_hub_room_temperature", { hours: v, maxPoints: j, withGhost: !0 }), Q = xe("sensor.dsc_hub_room_humidity", { hours: v, maxPoints: j, withGhost: !0 }), ne = xe(se, { hours: v, maxPoints: j, withGhost: !0 }), le = xe("sensor.dsc_fan_exhaust_outside_pct", { hours: v, maxPoints: j }), k = xe("sensor.dsc_fan_exhaust_room_pct", { hours: v, maxPoints: j }), F = ft("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available: o,
    num: a
  }), I = ft(
    "sensor.dsc_cfm_exhaust_recirc_allocated",
    "sensor.dsc_cfm_exhaust_recirc",
    { available: o, num: a }
  ), ae = ft(
    "sensor.dsc_cfm_intake_main_allocated",
    "sensor.dsc_cfm_intake_main",
    { available: o, num: a }
  ), me = ft(
    "sensor.dsc_cfm_intake_2x4_allocated",
    "sensor.dsc_cfm_intake_2x4",
    { available: o, num: a }
  ), he = Lu(X.value, W.value), ge = Lu(C.value, O.value), Le = Lu(J.value, P.value), Se = a("number.dsc_hub_target_temp"), lt = a("number.dsc_hub_rh_target_min"), pt = a("number.dsc_hub_rh_target_max"), je = a("number.dsc_hub_vpd_target_min"), it = a("number.dsc_hub_vpd_target_max"), ee = a("number.dsc_hub_clone_target_temp"), $e = a("number.dsc_hub_clone_rh_min"), We = a("number.dsc_hub_clone_rh_max"), _t = a("number.dsc_hub_clone_vpd_min"), Ie = a("number.dsc_hub_clone_vpd_max"), Re = (Nn, mr, ds) => m.open({ entityId: Nn, label: mr, unit: ds }), Dt = y.useMemo(() => Rn(de.series), [de.series]), Ht = y.useMemo(() => Rn(Y.series), [Y.series]), an = y.useMemo(() => Rn(ie.series), [ie.series]), Qt = y.useMemo(() => Rn(te.series), [te.series]), nt = y.useMemo(() => Rn(A.series), [A.series]), ll = y.useMemo(() => Rn(T.series), [T.series]), Ae = y.useMemo(() => Rn($.series), [$.series]), os = y.useMemo(() => Rn(Q.series), [Q.series]), us = y.useMemo(() => Rn(ne.series), [ne.series]), dr = C.value - X.value, ui = ge - he, fr = B.value - ue.value, hr = C.value - J.value, La = ge - Le, Rt = Le - he, gn = a("sensor.dsc_bought_runtime_today"), Ct = a("sensor.dsc_vent_heat_dump_btu"), il = (Nn) => _ === "compare" || _ === Nn ? "dsc-gauge-row-3 is-lit" : "dsc-gauge-row-3";
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ l.jsx(
      Nt,
      {
        icon: "climate",
        title: "Climate",
        subtitle: "Room is the umbrella lung. 2×4 and 4×8 are grow rooms and transfer/storage. T, RH, VPD only together.",
        actions: /* @__PURE__ */ l.jsx(
          sr,
          {
            label: "Climate settings",
            items: [
              { id: "mission", label: "Mission", onSelect: () => h("/live/mission") },
              { id: "main", label: "4×8 cockpit", onSelect: () => h("/live/4x8") },
              { id: "clone", label: "2×4 cockpit", onSelect: () => h("/live/2x4") },
              { id: "fleet", label: "Fleet kit", onSelect: () => h("/fleet") }
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 14 }, role: "group", "aria-label": "Zone emphasis", children: [
      /* @__PURE__ */ l.jsx(
        D,
        {
          icon: f.online ? "ok" : "alert",
          label: f.online ? `Hub ${f.temp_c != null ? `${f.temp_c.toFixed(1)}°C` : "live"}` : "Hub offline",
          tone: f.online ? "ok" : "bad"
        }
      ),
      P1.map((Nn) => /* @__PURE__ */ l.jsx(
        "button",
        {
          type: "button",
          className: `dsc-chip${_ === Nn.id ? " dsc-chip--ok" : ""}`,
          onClick: () => b(Nn.id),
          children: Nn.label
        },
        Nn.id
      )),
      /* @__PURE__ */ l.jsx(sl, { hours: v, setHours: g, extras: al }),
      /* @__PURE__ */ l.jsx(ce, { teal: !0, onClick: () => h("/fleet"), children: "Kit / Fleet" })
    ] }),
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Command", icon: "climate", children: [
        /* @__PURE__ */ l.jsxs("div", { className: "dsc-mode-row", children: [
          /* @__PURE__ */ l.jsx(qe, { entityId: "switch.dsc_hub_tent_full_auto_mode", label: "Full Auto", icon: "ok" }),
          /* @__PURE__ */ l.jsx(qe, { entityId: "switch.dsc_hub_manual_takeover", label: "Master takeover", icon: "alert" }),
          /* @__PURE__ */ l.jsx(qe, { entityId: "switch.dsc_hub_tent_manual_override", label: "Fan override", icon: "climate" }),
          /* @__PURE__ */ l.jsx(qe, { entityId: "switch.dsc_hub_humidifier_intake_routing", label: "Hum intake routing", icon: "climate" }),
          /* @__PURE__ */ l.jsx(qe, { entityId: "switch.dsc_hub_recirc_de_strat_pulse", label: "RECIRC de-strat", icon: "climate" })
        ] }),
        /* @__PURE__ */ l.jsxs("div", { className: "dsc-mode-selects", children: [
          /* @__PURE__ */ l.jsx(ls, { entityId: "select.dsc_hub_control_strategy", label: "Strategy", icon: "climate" }),
          /* @__PURE__ */ l.jsx(ls, { entityId: "select.dsc_hub_priority_tent", label: "Priority tent", icon: "tent" })
        ] }),
        /* @__PURE__ */ l.jsxs("div", { className: "dsc-demand-row", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ l.jsx(qe, { entityId: "switch.dsc_hub_heater_demand", label: "Heat", icon: "climate" }),
          /* @__PURE__ */ l.jsx(
            qe,
            {
              entityId: "switch.dsc_hub_ac_demand",
              label: "Cool",
              icon: "climate",
              warnWhenMissing: i("binary_sensor.dsc_ac_capacity_offline") === "on" ? "AC ○" : void 0
            }
          ),
          /* @__PURE__ */ l.jsx(qe, { entityId: "switch.dsc_hub_humidifier_demand", label: "Hum", icon: "climate" }),
          /* @__PURE__ */ l.jsx(qe, { entityId: "switch.dsc_hub_dehumidifier_demand", label: "Dehum", icon: "climate" }),
          /* @__PURE__ */ l.jsx(qe, { entityId: "switch.dsc_hub_grow_mat_demand", label: "Mat", icon: "root" }),
          /* @__PURE__ */ l.jsx(qe, { entityId: "switch.dsc_hub_clone_humidifier_demand", label: "Mister", icon: "clone" })
        ] }),
        S ? /* @__PURE__ */ l.jsxs("p", { className: "dsc-honesty", children: [
          /* @__PURE__ */ l.jsx(
            D,
            {
              icon: N ? "alert" : "ok",
              label: N ? "Unexpected OOS" : "Full Auto",
              tone: N ? "warn" : "ok",
              onClick: () => m.open({
                entityId: N ? "binary_sensor.dsc_reduced_kit" : "switch.dsc_hub_tent_full_auto_mode",
                label: N ? "Unexpected OOS" : "Full Auto",
                kind: N ? "alert" : "binary"
              })
            }
          ),
          " ",
          E || "Hub owns fans + appliance Autos when Full Auto is on."
        ] }) : null
      ] }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Room umbrella", icon: "climate", children: [
        /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", children: [
          /* @__PURE__ */ l.jsx(
            St,
            {
              label: "Room °C",
              value: An(X.value),
              unit: "°C",
              stale: X.stale,
              onClick: () => Re("sensor.dsc_hub_room_temperature", "Room T", "°C")
            }
          ),
          /* @__PURE__ */ l.jsx(
            St,
            {
              label: "Room RH",
              value: An(W.value, 0),
              unit: "%",
              stale: W.stale,
              onClick: () => Re("sensor.dsc_hub_room_humidity", "Room RH", "%")
            }
          ),
          /* @__PURE__ */ l.jsx(
            St,
            {
              label: "Room VPD",
              value: An(ue.value, 2),
              unit: "kPa",
              stale: ue.stale,
              onClick: () => Re(se, "Room VPD", "kPa")
            }
          ),
          /* @__PURE__ */ l.jsx(
            St,
            {
              label: "Room AH",
              value: Number.isFinite(he) ? he.toFixed(1) : "—",
              unit: "g/m³",
              sub: Number.isFinite(he) ? `24h ${An(a("sensor.dsc_hub_room_temp_mean_24h"))}°C` : "Need T+RH",
              onClick: () => Re("sensor.dsc_ah_room", "Room AH", "g/m³")
            }
          )
        ] }),
        /* @__PURE__ */ l.jsxs("p", { className: "dsc-muted", style: { marginTop: 8, fontSize: 12 }, children: [
          "ΔT room↔4×8 ",
          An(dr),
          "°C · ΔAH ",
          An(ui),
          " g/m³ · ΔVPD ",
          An(fr, 2),
          " · ΔT/ΔAH 2×4↔4×8",
          " ",
          An(hr),
          "°C / ",
          An(La),
          " · ΔAH room↔2×4 ",
          An(Rt),
          " g/m³. Early warn is the lung poisoning a tent before Want miss."
        ] })
      ] }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsx(yb, { hero: !0 }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Triad · T / RH / VPD", icon: "gauge", children: [
        /* @__PURE__ */ l.jsxs("div", { className: "dsc-gauge-matrix", children: [
          /* @__PURE__ */ l.jsxs("div", { className: il("room"), children: [
            /* @__PURE__ */ l.jsx("span", { className: "dsc-gauge-row-tag", children: "Room" }),
            /* @__PURE__ */ l.jsx(Xe, { label: "T", value: X.value, min: 10, max: 40, unit: "°C", extrema: Ae, stale: X.stale, onClick: () => Re("sensor.dsc_hub_room_temperature", "Room T", "°C") }),
            /* @__PURE__ */ l.jsx(Xe, { label: "RH", value: W.value, min: 0, max: 100, unit: "%", extrema: os, stale: W.stale, onClick: () => Re("sensor.dsc_hub_room_humidity", "Room RH", "%") }),
            /* @__PURE__ */ l.jsx(Xe, { label: "VPD", value: ue.value, min: 0, max: 2.5, unit: "kPa", extrema: us, stale: ue.stale, onClick: () => Re(se, "Room VPD", "kPa") })
          ] }),
          /* @__PURE__ */ l.jsxs("div", { className: il("clone"), children: [
            /* @__PURE__ */ l.jsx("span", { className: "dsc-gauge-row-tag", children: "2×4" }),
            /* @__PURE__ */ l.jsx(Xe, { label: "T", value: J.value, min: 15, max: 35, unit: "°C", target: ee, extrema: Qt, stale: J.stale, onClick: () => Re("sensor.dsc_hub_clone_temperature", "2×4 T", "°C") }),
            /* @__PURE__ */ l.jsx(Xe, { label: "RH", value: P.value, min: 0, max: 100, unit: "%", band: { min: $e, max: We }, extrema: nt, stale: P.stale, onClick: () => Re("sensor.dsc_hub_clone_humidity", "2×4 RH", "%") }),
            /* @__PURE__ */ l.jsx(Xe, { label: "VPD", value: G.value, min: 0, max: 2.5, unit: "kPa", band: { min: _t, max: Ie }, extrema: ll, stale: G.stale, onClick: () => Re("sensor.dsc_hub_clone_vpd_kpa", "2×4 VPD", "kPa") })
          ] }),
          /* @__PURE__ */ l.jsxs("div", { className: il("main"), children: [
            /* @__PURE__ */ l.jsx("span", { className: "dsc-gauge-row-tag", children: "4×8" }),
            /* @__PURE__ */ l.jsx(Xe, { label: "T", value: C.value, min: 15, max: 35, unit: "°C", target: Se, extrema: Dt, stale: C.stale, onClick: () => Re("sensor.dsc_hub_tent_temperature", "4×8 T", "°C") }),
            /* @__PURE__ */ l.jsx(Xe, { label: "RH", value: O.value, min: 0, max: 100, unit: "%", band: { min: lt, max: pt }, extrema: Ht, stale: O.stale, onClick: () => Re("sensor.dsc_hub_tent_humidity", "4×8 RH", "%") }),
            /* @__PURE__ */ l.jsx(Xe, { label: "VPD", value: B.value, min: 0, max: 2.5, unit: "kPa", band: { min: je, max: it }, extrema: an, stale: B.stale, onClick: () => Re("sensor.dsc_hub_vpd_kpa", "4×8 VPD", "kPa") })
          ] })
        ] }),
        /* @__PURE__ */ l.jsx(
          gb,
          {
            rows: [
              { label: "Room T", got: X.value, stale: X.stale, want: a("sensor.dsc_hub_room_temp_mean_24h"), unit: "°C" },
              { label: "2×4 T", got: J.value, stale: J.stale, want: ee, unit: "°C" },
              { label: "4×8 T", got: C.value, stale: C.stale, want: Se, unit: "°C" },
              { label: "2×4 RH", got: P.value, stale: P.stale, wantMin: $e, wantMax: We, unit: "%" },
              { label: "4×8 RH", got: O.value, stale: O.stale, wantMin: lt, wantMax: pt, unit: "%" },
              { label: "2×4 VPD", got: G.value, stale: G.stale, wantMin: _t, wantMax: Ie, unit: "kPa" },
              { label: "4×8 VPD", got: B.value, stale: B.stale, wantMin: je, wantMax: it, unit: "kPa" }
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsx(re, { className: "dsc-glass", title: "Temperature", icon: "climate", children: /* @__PURE__ */ l.jsx(
        wn,
        {
          unit: "°C",
          lastSyncAt: Math.max($.lastSyncAt ?? 0, te.lastSyncAt ?? 0, de.lastSyncAt ?? 0) || void 0,
          series: [
            ...dt("rt", "Room", $, "var(--dsc-gray-5)", "°C"),
            ...dt("ct", "2×4", te, "var(--dsc-teal)", "°C", { band: { min: ee - 1.5, max: ee + 1.5 } }),
            ...dt("mt", "4×8", de, "var(--dsc-blue)", "°C", { band: { min: Se - 1.5, max: Se + 1.5 } })
          ],
          targets: [{ axis: "left", value: Se, color: "var(--dsc-amber)", label: "4×8 Want T" }]
        }
      ) }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsx(re, { className: "dsc-glass", title: "Humidity", icon: "climate", children: /* @__PURE__ */ l.jsx(
        wn,
        {
          unit: "%",
          lastSyncAt: Math.max(Q.lastSyncAt ?? 0, A.lastSyncAt ?? 0, Y.lastSyncAt ?? 0) || void 0,
          yDomain: { left: { min: 0, max: 100 } },
          series: [
            ...dt("rrh", "Room", Q, "var(--dsc-gray-5)", "%"),
            ...dt("crh", "2×4", A, "var(--dsc-teal)", "%", { band: { min: $e, max: We } }),
            ...dt("mrh", "4×8", Y, "var(--dsc-blue)", "%", { band: { min: lt, max: pt } })
          ],
          targets: [{ axis: "left", min: lt, max: pt, color: "var(--dsc-teal)" }]
        }
      ) }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsx(re, { className: "dsc-glass", title: "VPD", icon: "climate", children: /* @__PURE__ */ l.jsx(
        wn,
        {
          unit: "kPa",
          lastSyncAt: Math.max(ne.lastSyncAt ?? 0, T.lastSyncAt ?? 0, ie.lastSyncAt ?? 0) || void 0,
          series: [
            ...dt("rv", "Room", ne, "var(--dsc-gray-5)", "kPa"),
            ...dt("cv", "2×4", T, "var(--dsc-teal)", "kPa", { band: { min: _t, max: Ie } }),
            ...dt("mv", "4×8", ie, "var(--dsc-blue)", "kPa", { band: { min: je, max: it } })
          ]
        }
      ) }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsx(re, { className: "dsc-glass", title: "Air path", icon: "climate", children: /* @__PURE__ */ l.jsx(
        Cd,
        {
          intakeClone: me,
          intakeMain: ae,
          outCfm: F,
          recircCfm: I
        }
      ) }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Fan duty %", icon: "climate", children: [
        /* @__PURE__ */ l.jsx(
          wn,
          {
            unit: "%",
            yDomain: { left: { min: 0, max: 100 } },
            lastSyncAt: Math.max(le.lastSyncAt ?? 0, k.lastSyncAt ?? 0) || void 0,
            series: [
              { id: "fout", label: "OUT %", series: le.series, color: "var(--dsc-teal)", unit: "%", step: !0, band: { min: 0, max: 90 } },
              { id: "frec", label: "RECIRC %", series: k.series, color: "var(--dsc-amber)", unit: "%", step: !0, band: { min: 0, max: 90 } }
            ]
          }
        ),
        /* @__PURE__ */ l.jsxs("div", { className: "dsc-fan-stack", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ l.jsx(za, { entityId: "fan.dsc_hub_4_inch_intake_fan_main", label: "Intake 4×8", disabled: !w }),
          /* @__PURE__ */ l.jsx(za, { entityId: "fan.dsc_hub_4_inch_intake_fan_2x4", label: "Intake 2×4", disabled: !w }),
          /* @__PURE__ */ l.jsx(za, { entityId: "fan.dsc_hub_6_inch_exhaust_room", label: "Exhaust room", disabled: !w }),
          /* @__PURE__ */ l.jsx(za, { entityId: "fan.dsc_hub_6_inch_exhaust_outside", label: "Exhaust outside", disabled: !w })
        ] })
      ] }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsx(re, { className: "dsc-glass", title: "Efficacy · buying kW because the lung could not transfer", icon: "alert", children: /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ l.jsx(D, { label: `Heat ${i("switch.dsc_hub_heater_demand") === "on" ? "ON" : "off"}`, tone: i("switch.dsc_hub_heater_demand") === "on" ? "ok" : "muted", onClick: () => Re("switch.dsc_hub_heater_demand", "Heater", void 0) }),
        /* @__PURE__ */ l.jsx(D, { label: `Cool ${i("switch.dsc_hub_ac_demand") === "on" ? "ON" : "off"}`, tone: i("switch.dsc_hub_ac_demand") === "on" ? "ok" : "muted", onClick: () => Re("switch.dsc_hub_ac_demand", "Cool", void 0) }),
        /* @__PURE__ */ l.jsx(D, { label: `Hum ${i("switch.dsc_hub_humidifier_demand") === "on" ? "ON" : "off"}`, tone: i("switch.dsc_hub_humidifier_demand") === "on" ? "ok" : "muted", onClick: () => Re("switch.dsc_hub_humidifier_demand", "Humidifier", void 0) }),
        /* @__PURE__ */ l.jsx(D, { label: `Dehum ${i("switch.dsc_hub_dehumidifier_demand") === "on" ? "ON" : "off"}`, tone: i("switch.dsc_hub_dehumidifier_demand") === "on" ? "ok" : "muted", onClick: () => Re("switch.dsc_hub_dehumidifier_demand", "Dehumidifier", void 0) }),
        /* @__PURE__ */ l.jsx(
          D,
          {
            label: i("binary_sensor.dsc_humidifier_ineffective_suspect") === "on" ? "Hum ineffective" : "Hum ok",
            tone: i("binary_sensor.dsc_humidifier_ineffective_suspect") === "on" ? "warn" : "muted",
            onClick: () => Re("binary_sensor.dsc_humidifier_ineffective_suspect", "Humidifier ineffective", void 0)
          }
        ),
        /* @__PURE__ */ l.jsx(
          D,
          {
            label: i("binary_sensor.dsc_heater_ineffective_suspect") === "on" ? "Heat ineffective" : "Heat ok",
            tone: i("binary_sensor.dsc_heater_ineffective_suspect") === "on" ? "warn" : "muted",
            onClick: () => Re("binary_sensor.dsc_heater_ineffective_suspect", "Heater ineffective", void 0)
          }
        ),
        /* @__PURE__ */ l.jsx(
          D,
          {
            label: `Bought ${Number.isFinite(gn) ? gn.toFixed(1) : "—"}h today`,
            tone: "muted",
            onClick: () => Re("sensor.dsc_bought_runtime_today", "Bought runtime today", "h")
          }
        ),
        /* @__PURE__ */ l.jsx(
          D,
          {
            label: `Dump ${Number.isFinite(Ct) ? Math.round(Ct) : "—"} BTU/h`,
            tone: "muted",
            onClick: () => Re("sensor.dsc_vent_heat_dump_btu", "Vent heat dump", "BTU/h")
          }
        ),
        /* @__PURE__ */ l.jsx(
          D,
          {
            label: `Heater today ${Da(a("sensor.dsc_heater_runtime_today") * 36e5)}`,
            tone: "muted",
            onClick: () => Re("sensor.dsc_heater_runtime_today", "Heater runtime today", "h")
          }
        )
      ] }) }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsx(oi, { compact: !0 }) })
    ] })
  ] });
}
function I1(a, i = 1) {
  return Number.isFinite(a) ? a.toFixed(i) : "—";
}
function e2() {
  const { state: a, entity: i, tick: c, num: o } = Ce();
  kt();
  const d = kn(), f = ht(), [h, m] = nr(), _ = [...aa].map((N) => ({ n: N, seat: rs(N, { state: a, entity: i }), oos: !qt(N, a) })).sort((N, C) => Number(N.oos) - Number(C.oos)), b = Hy(a), v = Number(h.get("pot") || 0), g = v >= 1 && v <= 4 && qt(v, a) ? v : null, j = o("sensor.dsc_growmat_runtime_today"), w = o("sensor.dsc_heatmat_relay_on_time"), S = (N) => {
    const C = new URLSearchParams(h);
    C.set("pot", String(N)), m(C, { replace: !0 });
  }, E = () => {
    const N = new URLSearchParams(h);
    N.delete("pot"), m(N, { replace: !0 });
  };
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ l.jsx(
      Nt,
      {
        icon: "root",
        title: "Root",
        subtitle: `${b.inService} of ${b.total} pots in service — OOS labeled, never fake Got.`
      }
    ),
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ l.jsx(
        St,
        {
          label: "Coldest root",
          value: I1(o("sensor.dsc_coldest_root_zone_temp")),
          unit: "°C",
          onClick: () => d.open({
            entityId: "sensor.dsc_coldest_root_zone_temp",
            label: "Coldest root",
            unit: "°C"
          })
        }
      ) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ l.jsx(
        St,
        {
          label: "Heat mat today",
          value: Number.isFinite(j) ? j.toFixed(1) : Da(w * 1e3),
          unit: Number.isFinite(j) ? "h" : "",
          sub: Number.isFinite(w) ? `session ${Da(w * 1e3)}` : void 0,
          onClick: () => d.open({
            entityId: "switch.dsc_hub_grow_mat_demand",
            label: "Heat mat",
            kind: "binary",
            runtimeToday: "sensor.dsc_growmat_runtime_today",
            demandEntity: "switch.dsc_hub_grow_mat_demand"
          })
        }
      ) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ l.jsx(re, { title: "Notes", children: /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: "Mat loop uses per-pot sense with plausibility filter. Metric click opens inspector; card chrome opens the seat." }) }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsx(
        Jc,
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
      _.map(({ n: N, seat: C, oos: O }) => /* @__PURE__ */ l.jsxs("div", { className: "dsc-col-12", children: [
        /* @__PURE__ */ l.jsx(t2, { pot: N, oos: O, onOpenSeat: () => O ? void 0 : S(N) }),
        O ? null : /* @__PURE__ */ l.jsxs("button", { type: "button", className: "dsc-btn", style: { marginTop: 6 }, onClick: () => S(N), children: [
          "Open ",
          C.plantName !== "—" ? C.plantName : `POT${N}`,
          " seat"
        ] })
      ] }, N))
    ] }),
    /* @__PURE__ */ l.jsx(
      cs,
      {
        open: g != null,
        onClose: E,
        title: g != null ? `Plant seat · POT${g}` : "Plant seat",
        children: g != null ? /* @__PURE__ */ l.jsx(or, { pot: g, onSelectPot: S }) : null
      }
    ),
    /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", style: { marginTop: 8 }, children: /* @__PURE__ */ l.jsx("button", { type: "button", className: "dsc-chip", onClick: () => f("/live/climate"), children: "Climate Want" }) })
  ] });
}
function t2({ pot: a, oos: i, onOpenSeat: c }) {
  const { state: o, entity: d, available: f } = Ce(), h = kn(), m = rs(a, { state: o, entity: d }), _ = ir(a, o), b = bn(a, "moisture", o), v = xe(b, { hours: 6, maxPoints: 48 }), g = _e(`sensor.dsc_pot${a}_dryback_pct`), j = _e(`sensor.dsc_pot${a}_soil_temperature`), w = _e(b), S = _e(bn(a, "ec", o)), E = _e(bn(a, "ph", o)), N = _e(`sensor.dsc_pot${a}_soil_moisture_rate`), C = Fu(a, "moisture", o), O = Fu(a, "ec", o), B = Fu(a, "ph", o), J = C && C.max !== 45 ? void 0 : { min: 0, max: 45 }, P = (G, X, W) => (se) => {
    se.stopPropagation(), h.open({ entityId: G, label: X, unit: W });
  };
  return /* @__PURE__ */ l.jsxs(re, { className: `dsc-glass dsc-pot-card${i ? " is-oos" : ""}`, title: `Pot ${a}`, icon: "root", children: [
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-pot-card-head", onClick: c, role: "presentation", children: [
      /* @__PURE__ */ l.jsx(On, { spec: Ha(a, o, d), size: 28 }),
      /* @__PURE__ */ l.jsxs("div", { children: [
        /* @__PURE__ */ l.jsx("strong", { children: i ? "OOS" : m.plantName }),
        /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", children: [
          /* @__PURE__ */ l.jsx(D, { label: lr(m.tent), tone: i || m.tent === "unassigned" ? "muted" : "ok" }),
          /* @__PURE__ */ l.jsx(
            D,
            {
              label: i ? "OOS" : _.blockNeedAct ? `${m.need} (no act)` : `Need ${m.need}`,
              tone: i ? "muted" : m.need && m.need !== "ok" && m.need !== "—" ? "warn" : "ok"
            }
          ),
          _.labels.map((G) => /* @__PURE__ */ l.jsx(D, { label: G, tone: "warn" }, G))
        ] })
      ] }),
      /* @__PURE__ */ l.jsx(bb, { series: v.series, color: "var(--dsc-blue)", width: 140, height: 36 })
    ] }),
    i ? /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", children: "Parked — no fake Got." }) : /* @__PURE__ */ l.jsxs("div", { className: "dsc-gauge-row", children: [
      /* @__PURE__ */ l.jsx(Xe, { label: "Moisture", value: w.value, min: 0, max: 100, unit: "%", band: C, stale: w.stale, onClick: () => h.open({ entityId: b, label: `P${a} moisture`, unit: "%" }) }),
      /* @__PURE__ */ l.jsx(Xe, { label: "Soil °C", value: j.value, min: 10, max: 40, unit: "°C", stale: j.stale, onClick: () => h.open({ entityId: `sensor.dsc_pot${a}_soil_temperature`, label: `P${a} soil T`, unit: "°C" }) }),
      /* @__PURE__ */ l.jsx(Xe, { label: "Dryback", value: g.value, min: 0, max: 100, unit: "%", band: J, stale: g.stale, onClick: () => h.open({ entityId: `sensor.dsc_pot${a}_dryback_pct`, label: `P${a} dryback`, unit: "%" }) }),
      /* @__PURE__ */ l.jsx(Xe, { label: "EC", value: S.value, min: 0, max: 3e3, unit: "", band: O, stale: S.stale, onClick: () => h.open({ entityId: bn(a, "ec", o), label: `P${a} EC` }) }),
      /* @__PURE__ */ l.jsx(Xe, { label: "pH", value: E.value, min: 4, max: 8, unit: "", band: B, stale: E.stale, onClick: () => h.open({ entityId: bn(a, "ph", o), label: `P${a} pH` }) }),
      /* @__PURE__ */ l.jsxs("button", { type: "button", className: "dsc-npk-hit", onClick: P(`sensor.dsc_pot${a}_soil_nitrogen`, `P${a} N`), children: [
        "N ",
        f(`sensor.dsc_pot${a}_soil_nitrogen`) ? m.n : "—"
      ] }),
      /* @__PURE__ */ l.jsxs("button", { type: "button", className: "dsc-npk-hit", onClick: P(`sensor.dsc_pot${a}_soil_phosphorus`, `P${a} P`), children: [
        "P ",
        f(`sensor.dsc_pot${a}_soil_phosphorus`) ? m.p : "—"
      ] }),
      /* @__PURE__ */ l.jsxs("button", { type: "button", className: "dsc-npk-hit", onClick: P(`sensor.dsc_pot${a}_soil_potassium`, `P${a} K`), children: [
        "K ",
        f(`sensor.dsc_pot${a}_soil_potassium`) ? m.k : "—"
      ] }),
      /* @__PURE__ */ l.jsxs(
        "button",
        {
          type: "button",
          className: "dsc-npk-hit",
          onClick: P(`sensor.dsc_pot${a}_soil_moisture_rate`, `P${a} moisture rate`),
          children: [
            "Rate ",
            Number.isFinite(N.value) ? N.value.toFixed(2) : "—",
            N.stale ? " *" : ""
          ]
        }
      )
    ] })
  ] });
}
function Xu(a, i = 1) {
  return Number.isFinite(a) ? a.toFixed(i) : "—";
}
function n2(a, i = Date.now()) {
  if (!a || a === "—" || a === "unknown" || a === "unavailable") return "—";
  const c = Date.parse(a);
  if (!Number.isFinite(c)) return a;
  const o = c - i, d = Math.abs(o), f = Da(d);
  return o >= 0 ? `in ${f}` : `${f} ago`;
}
function a2() {
  const { state: a, num: i, entity: c } = Ce(), o = ht(), d = kn(), f = a("binary_sensor.dsc_clone_dark_period_violation") === "on", h = a("binary_sensor.dsc_clone_light_missing_in_window") === "on", m = a("binary_sensor.dsc_hub_light_catchup_active") === "on", _ = a("light.dsc_hub_sf1000_dimmer") === "on", b = a("binary_sensor.dsc_hub_4x8_window_open") === "on", v = a("binary_sensor.dsc_hub_2x4_window_open") === "on", g = i("sensor.dsc_expected_light_hours"), j = i("sensor.dsc_clone_expected_light_hours"), w = i("sensor.dsc_lights_on_today_4x8"), S = i("sensor.dsc_lights_on_today_2x4"), E = i("sensor.dsc_lights_deviation_today"), N = a("sensor.dsc_next_light_event", "—"), C = Iu("main", { state: a, entity: c }), O = Iu("clone", { state: a, entity: c }), B = i("number.dsc_hub_min_dark_hours"), J = i("number.dsc_hub_clone_light_hours"), [P, G] = y.useState(B), [X, W] = y.useState(J), se = C.lightHours != null ? { min: C.lightHours - 0.5, max: C.lightHours + 0.5, source: "stage", mixed: C.mixed } : null, ue = O.lightHours != null ? { min: O.lightHours - 0.5, max: O.lightHours + 0.5, source: "stage", mixed: O.mixed } : null, de = C.lightHours != null ? {
    min: 24 - C.lightHours - 0.5,
    max: 24 - C.lightHours + 0.5,
    source: "stage",
    mixed: C.mixed
  } : null, Y = Number.isFinite(P) ? 24 - P : g, ie = Ra(Y, se), te = Ra(Number.isFinite(P) ? P : B, de), A = a("select.dsc_hub_clone_photoperiod") === "Independent", T = Ra(
    A && Number.isFinite(X) ? X : j,
    ue
  ), $ = (F) => F === "critical" ? "bad" : F === "ok" ? "ok" : F === "muted" ? "muted" : "warn", Q = a("switch.dsc_hub_heater_demand") === "on", ne = i("sensor.dsc_vent_heat_dump_btu"), le = (_ || b) && (Q || Number.isFinite(ne) && ne > 0), k = (F, I, ae) => d.open({ entityId: F, label: I, kind: ae || "numeric" });
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ l.jsx(
      Nt,
      {
        icon: "lighting",
        title: "Light",
        subtitle: "Photoperiod desk — equal 4×8 / 2×4 cards. 4×8 Got is the window until a GPIO lamp exists.",
        primaryAction: /* @__PURE__ */ l.jsx(ce, { teal: !0, onClick: () => o("/live/climate"), children: "Climate Want" })
      }
    ),
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-status-strip", children: [
      /* @__PURE__ */ l.jsx(
        D,
        {
          icon: f ? "alert" : "ok",
          label: f ? "2×4 DARK VIOLATION" : "Dark period OK",
          tone: f ? "bad" : "ok",
          pulse: f,
          onClick: () => k("binary_sensor.dsc_clone_dark_period_violation", "2×4 dark violation", "alert")
        }
      ),
      h ? /* @__PURE__ */ l.jsx(
        D,
        {
          label: "Missing in window",
          tone: "bad",
          pulse: !0,
          onClick: () => k("binary_sensor.dsc_clone_light_missing_in_window", "Light missing in window", "alert")
        }
      ) : null,
      m ? /* @__PURE__ */ l.jsx(
        D,
        {
          label: "Catch-up",
          tone: "warn",
          onClick: () => k("binary_sensor.dsc_hub_light_catchup_active", "Light catch-up", "alert")
        }
      ) : null,
      /* @__PURE__ */ l.jsx(
        D,
        {
          label: `Next ${n2(N)}`,
          tone: "muted",
          onClick: () => k("sensor.dsc_next_light_event", "Next light event")
        }
      ),
      le ? /* @__PURE__ */ l.jsx(D, { label: "This window is buying heat", tone: "warn", onClick: () => o("/live/climate") }) : null
    ] }),
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass dsc-light-hero", title: "4×8 light", icon: "tent", children: [
        /* @__PURE__ */ l.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "4×8 Got is the photoperiod window until a GPIO lamp exists — not a brightness." }),
        /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", children: [
          /* @__PURE__ */ l.jsx(
            D,
            {
              label: b ? "WINDOW OPEN" : "DARK",
              tone: b ? "ok" : "muted",
              onClick: () => k("binary_sensor.dsc_hub_4x8_window_open", "4×8 window", "binary")
            }
          ),
          /* @__PURE__ */ l.jsx(
            D,
            {
              label: ie.label,
              tone: $(ie.tone),
              onClick: () => k("sensor.dsc_expected_light_hours", "4×8 expected hours", "numeric")
            }
          )
        ] }),
        /* @__PURE__ */ l.jsx(
          Xe,
          {
            label: "Got / Want h",
            value: w,
            min: 0,
            max: 24,
            unit: "h",
            target: g,
            band: C.lightHours != null ? { min: C.lightHours - 0.5, max: C.lightHours + 0.5 } : void 0,
            onClick: () => k("sensor.dsc_lights_on_today_4x8", "4×8 hours today", "numeric")
          }
        ),
        /* @__PURE__ */ l.jsx(St, { label: "Want hours", value: Xu(g, 0), unit: "h", onClick: () => k("sensor.dsc_expected_light_hours", "4×8 expected hours", "numeric") }),
        /* @__PURE__ */ l.jsx(
          Jc,
          {
            entityId: "binary_sensor.dsc_hub_4x8_window_open",
            hours: 24,
            label: "4×8 window 24h",
            onClick: () => k("binary_sensor.dsc_hub_4x8_window_open", "4×8 window", "binary")
          }
        ),
        /* @__PURE__ */ l.jsxs("div", { className: "dsc-target-grid", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ l.jsx(qp, { entityId: "time.dsc_hub_lights_on_time", label: "4×8 opens" }),
          /* @__PURE__ */ l.jsx(Je, { entityId: "number.dsc_hub_sunrise_duration", label: "Sunrise min" }),
          /* @__PURE__ */ l.jsx(Je, { entityId: "number.dsc_hub_sunset_duration", label: "Sunset min" }),
          /* @__PURE__ */ l.jsx(
            Je,
            {
              entityId: "number.dsc_hub_min_dark_hours",
              label: "Min dark h",
              hint: te.label,
              tone: te.tone,
              onLive: G
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass dsc-light-hero", title: "2×4 light", icon: "lighting", children: [
        /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", children: [
          /* @__PURE__ */ l.jsx(
            D,
            {
              label: _ ? "SF1000 ON" : "SF1000 OFF",
              tone: _ ? "ok" : "muted",
              onClick: () => k("light.dsc_hub_sf1000_dimmer", "SF1000", "binary")
            }
          ),
          /* @__PURE__ */ l.jsx(
            D,
            {
              label: v ? "WINDOW OPEN" : "DARK",
              tone: v ? "ok" : "muted",
              onClick: () => k("binary_sensor.dsc_hub_2x4_window_open", "2×4 window", "binary")
            }
          ),
          /* @__PURE__ */ l.jsx(
            D,
            {
              label: T.label,
              tone: $(T.tone),
              onClick: () => k("sensor.dsc_clone_expected_light_hours", "2×4 expected hours", "numeric")
            }
          )
        ] }),
        /* @__PURE__ */ l.jsx(
          Xe,
          {
            label: "Got / Want h",
            value: S,
            min: 0,
            max: 24,
            unit: "h",
            target: j,
            band: O.lightHours != null ? { min: O.lightHours - 0.5, max: O.lightHours + 0.5 } : void 0,
            onClick: () => k("sensor.dsc_lights_on_today_2x4", "2×4 hours today", "numeric")
          }
        ),
        /* @__PURE__ */ l.jsx(St, { label: "Want hours", value: Xu(j, 0), unit: "h", onClick: () => k("sensor.dsc_clone_expected_light_hours", "2×4 expected hours", "numeric") }),
        /* @__PURE__ */ l.jsx(
          Jc,
          {
            entityId: "light.dsc_hub_sf1000_dimmer",
            hours: 24,
            label: "SF1000 24h",
            onClick: () => k("light.dsc_hub_sf1000_dimmer", "SF1000", "binary")
          }
        ),
        /* @__PURE__ */ l.jsxs("div", { className: "dsc-demand-row", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ l.jsx(qe, { entityId: "light.dsc_hub_sf1000_dimmer", label: "SF1000", icon: "lighting", showBrightness: !0 }),
          /* @__PURE__ */ l.jsx(qe, { entityId: "switch.dsc_hub_auto_photoperiod", label: "Auto photoperiod" }),
          /* @__PURE__ */ l.jsx(qe, { entityId: "switch.dsc_hub_manual_light_hold", label: "Manual light hold" })
        ] }),
        /* @__PURE__ */ l.jsx(ls, { entityId: "select.dsc_hub_clone_photoperiod", label: "Window source", icon: "clone" }),
        A ? /* @__PURE__ */ l.jsxs("div", { className: "dsc-target-grid", children: [
          /* @__PURE__ */ l.jsx(qp, { entityId: "time.dsc_hub_clone_lights_on_time", label: "2×4 lights-on" }),
          /* @__PURE__ */ l.jsx(
            Je,
            {
              entityId: "number.dsc_hub_clone_light_hours",
              label: "2×4 hours",
              hint: T.label,
              tone: T.tone,
              onLive: W
            }
          )
        ] }) : /* @__PURE__ */ l.jsxs("p", { className: "dsc-honesty", children: [
          "2×4 follows 4×8 (",
          a("time.dsc_hub_lights_on_time", "—"),
          "). Switch Window source to Independent to unlock start/hours."
        ] })
      ] }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsx(
        St,
        {
          label: "Deviation today",
          value: Xu(E, 2),
          unit: "h",
          sub: "Hub ledger — not a fake progress bar",
          onClick: () => k("sensor.dsc_lights_deviation_today", "Lights deviation today", "numeric")
        }
      ) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsx(oi, {}) })
    ] })
  ] });
}
function Dc(a, i = 1) {
  return Number.isFinite(a) ? a.toFixed(i) : "—";
}
function h_() {
  const a = ht(), { available: i, num: c } = Ce(), o = ft("sensor.dsc_cfm_intake_main_allocated", "sensor.dsc_cfm_intake_main", {
    available: i,
    num: c
  }), d = ft("sensor.dsc_cfm_intake_2x4_allocated", "sensor.dsc_cfm_intake_2x4", {
    available: i,
    num: c
  }), f = ft("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available: i,
    num: c
  }), h = ft(
    "sensor.dsc_cfm_exhaust_recirc_allocated",
    "sensor.dsc_cfm_exhaust_recirc",
    { available: i, num: c }
  );
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-page dsc-page--twin-chrome", children: [
    /* @__PURE__ */ l.jsx(
      Nt,
      {
        icon: "twin",
        title: "Twin",
        subtitle: "Cinematic digital twin — pick a pot to open Root seat.",
        primaryAction: /* @__PURE__ */ l.jsx(ce, { teal: !0, onClick: () => a("/live/climate"), children: "Set Climate Want" }),
        actions: /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
          /* @__PURE__ */ l.jsx(ce, { onClick: () => a("/live/4x8"), children: "4×8 cockpit" }),
          /* @__PURE__ */ l.jsx(ce, { onClick: () => a("/live/2x4"), children: "2×4 cockpit" })
        ] })
      }
    ),
    /* @__PURE__ */ l.jsx("p", { className: "dsc-honesty dsc-muted", style: { marginTop: 0 }, children: "Pick a pot in the twin to open its seat. Twin stays warm across Twin / 4×8 / 2×4. Orbit the scene — it no longer snaps home on hass ticks. 4×8 fixture glow follows the photoperiod window until a main lamp is wired." }),
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-grid", style: { marginTop: 12 }, children: [
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsx(oi, {}) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsx(re, { className: "dsc-glass", title: "Air path", icon: "climate", children: /* @__PURE__ */ l.jsx(Cd, { intakeClone: d, intakeMain: o, outCfm: f, recircCfm: h }) }) })
    ] })
  ] });
}
function Cb({ tent: a }) {
  const { state: i, entity: c, num: o, tick: d, callWS: f, available: h } = Ce(), m = I0(a), _ = ht(), b = kn(), { setFocus: v } = wd(), [g, j] = nr(), [w, S] = y.useState([]), { hours: E, setHours: N, maxPoints: C } = nl(6);
  y.useEffect(() => {
    v(a);
  }, [a, v]);
  const O = W_(a, i, c), B = O.map((je) => je.pot).join(","), J = Number(g.get("pot") || 0), P = J >= 1 && J <= 4 && qt(J, i) && O.some((je) => je.pot === J) ? J : null, G = a === "main" ? "sensor.dsc_hub_tent_temperature" : "sensor.dsc_hub_clone_temperature", X = a === "main" ? "sensor.dsc_hub_tent_humidity" : "sensor.dsc_hub_clone_humidity", W = a === "main" ? "sensor.dsc_hub_vpd_kpa" : "sensor.dsc_hub_clone_vpd_kpa", se = xe(G, { hours: E, maxPoints: C }), ue = xe(X, { hours: E, maxPoints: C }), de = xe(W, { hours: E, maxPoints: C }), Y = _e(G), ie = _e(X), te = _e(W), A = Number.isFinite(Y.value) ? Y.value : m.temp_c, T = Number.isFinite(ie.value) ? ie.value : m.rh_pct, $ = Number.isFinite(te.value) ? te.value : m.vpd_kpa, Q = i(
    a === "main" ? "binary_sensor.dsc_hub_4x8_window_open" : "binary_sensor.dsc_hub_2x4_window_open"
  ) === "on", ne = i("light.dsc_hub_sf1000_dimmer") === "on", le = a === "clone" ? ne : Q, k = a === "main" ? ft("sensor.dsc_cfm_intake_main_allocated", "sensor.dsc_cfm_intake_main", { available: h, num: o }) : ft("sensor.dsc_cfm_intake_2x4_allocated", "sensor.dsc_cfm_intake_2x4", { available: h, num: o }), F = ft(
    "sensor.dsc_cfm_exhaust_out_allocated",
    "sensor.dsc_cfm_exhaust_out",
    { available: h, num: o }
  ), I = ft(
    "sensor.dsc_cfm_exhaust_recirc_allocated",
    "sensor.dsc_cfm_exhaust_recirc",
    { available: h, num: o }
  ), ae = ft("sensor.dsc_cfm_intake_2x4_allocated", "sensor.dsc_cfm_intake_2x4", {
    available: h,
    num: o
  }), me = ft("sensor.dsc_cfm_intake_main_allocated", "sensor.dsc_cfm_intake_main", {
    available: h,
    num: o
  }), he = i("switch.dsc_hub_tent_manual_override") === "on", ge = a === "main" ? "4×8 tent" : "2×4 tent", Le = a === "main" ? "Only the 4×8 house in Twin. Cascade-in is a port stub from 2×4, not a second tent." : "Only the 2×4 house in Twin. Cascade-out is a port stub to 4×8.";
  y.useEffect(() => {
    let je = !1;
    async function it() {
      const ee = B ? B.split(",").map((Ie) => Number(Ie)).filter((Ie) => Number.isFinite(Ie) && Ie > 0) : [];
      if (!f || ee.length === 0) {
        S([]);
        return;
      }
      const $e = ee.flatMap((Ie) => [
        `text.dsc_pot${Ie}_plant_name`,
        `input_select.dsc_pot${Ie}_tent`,
        `select.dsc_pot${Ie}_growth_stage`
      ]), We = /* @__PURE__ */ new Date(), _t = new Date(We.getTime() - 48 * 3600 * 1e3);
      try {
        const Ie = await f({
          type: "history/history_during_period",
          start_time: _t.toISOString(),
          end_time: We.toISOString(),
          significant_changes_only: !0,
          minimal_response: !0,
          no_attributes: !0,
          entity_ids: $e
        });
        if (je || !Ie) return;
        const Re = [];
        for (const [Dt, Ht] of Object.entries(Ie))
          for (const an of Ht || []) {
            const Qt = typeof an.lu == "number" ? an.lu * 1e3 : an.last_changed ? Date.parse(an.last_changed) : NaN, nt = String(an.s ?? an.state ?? "");
            !Number.isFinite(Qt) || !nt || nt === "unavailable" || Re.push({ t: Qt, text: `${new Date(Qt).toLocaleString()} · ${Dt.split(".").pop()} → ${nt}` });
          }
        Re.sort((Dt, Ht) => Ht.t - Dt.t), S(Re.map((Dt) => Dt.text));
      } catch {
        je || S([]);
      }
    }
    return it(), () => {
      je = !0;
    };
  }, [f, B, a]);
  const Se = o(a === "main" ? "number.dsc_hub_target_temp" : "number.dsc_hub_clone_target_temp"), lt = o(a === "main" ? "number.dsc_hub_rh_target_min" : "number.dsc_hub_clone_rh_min"), pt = o(a === "main" ? "number.dsc_hub_rh_target_max" : "number.dsc_hub_clone_rh_max");
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ l.jsx(
      Nt,
      {
        icon: a === "main" ? "tent" : "clone",
        title: ge,
        subtitle: `Tent cockpit — ${O.length} seat(s). ${Le}`,
        primaryAction: /* @__PURE__ */ l.jsx(ce, { teal: !0, onClick: () => _("/live/twin"), children: "Both tents" }),
        actions: /* @__PURE__ */ l.jsx(ce, { primary: !0, onClick: () => _(`/live/climate?tent=${a}`), children: "Climate Want" })
      }
    ),
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-tent-cockpit-strip", children: [
      /* @__PURE__ */ l.jsx(D, { label: `${O.length} plants`, tone: "ok" }),
      /* @__PURE__ */ l.jsx(
        D,
        {
          label: `T ${Dc(A)}°C`,
          tone: Y.stale && !m.online ? "warn" : "ok",
          onClick: () => b.open({ entityId: G, label: `${ge} T`, unit: "°C" })
        }
      ),
      /* @__PURE__ */ l.jsx(
        D,
        {
          label: `RH ${Dc(T, 0)}%`,
          tone: ie.stale && !m.online ? "warn" : "ok",
          onClick: () => b.open({ entityId: X, label: `${ge} RH`, unit: "%" })
        }
      ),
      /* @__PURE__ */ l.jsx(
        D,
        {
          label: `VPD ${Dc($, 2)}`,
          tone: te.stale && !m.online ? "warn" : "ok",
          onClick: () => b.open({ entityId: W, label: `${ge} VPD`, unit: "kPa" })
        }
      ),
      /* @__PURE__ */ l.jsx(
        D,
        {
          label: a === "clone" ? le ? "SF1000 ON" : "SF1000 OFF" : Q ? "PHOTO ON" : "PHOTO OFF",
          tone: le ? "ok" : "muted",
          onClick: () => b.open({
            entityId: a === "clone" ? "light.dsc_hub_sf1000_dimmer" : "binary_sensor.dsc_hub_4x8_window_open",
            label: a === "clone" ? "SF1000" : "4×8 window",
            kind: "binary"
          })
        }
      ),
      /* @__PURE__ */ l.jsx(
        D,
        {
          label: `IN ${Dc(k.value, 0)} cfm`,
          tone: "muted",
          onClick: () => b.open({
            entityId: k.entityId,
            label: `${ge} intake CFM`,
            unit: "cfm"
          })
        }
      )
    ] }),
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsx(yb, { only: a, hero: !0 }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsx(oi, { compact: !0 }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsx(re, { className: "dsc-glass", title: "Air path", icon: "climate", children: /* @__PURE__ */ l.jsx(
        Cd,
        {
          compact: !0,
          focus: a,
          intakeClone: ae,
          intakeMain: me,
          outCfm: F,
          recircCfm: I
        }
      ) }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsx(re, { className: "dsc-glass", title: "Seat strip", icon: "seat", children: /* @__PURE__ */ l.jsx("div", { className: "dsc-chip-row", children: O.length === 0 ? /* @__PURE__ */ l.jsx("div", { className: "dsc-empty", children: "No pots assigned — Apply to tent from a seat." }) : O.map((je) => {
        const it = Number(i(`sensor.dsc_pot${je.pot}_dryback_pct`)), ee = Number.isFinite(it) && it > 45, $e = ir(je.pot, i), We = !$e.blockNeedAct && ee;
        return /* @__PURE__ */ l.jsxs(
          "button",
          {
            type: "button",
            className: `dsc-chip dsc-chip--ok${We ? " dsc-chip--pulse" : ""}`,
            onClick: () => {
              const _t = new URLSearchParams(g);
              _t.set("pot", String(je.pot)), j(_t, { replace: !0 });
            },
            children: [
              /* @__PURE__ */ l.jsx(On, { spec: Ha(je.pot, i, c), size: 16 }),
              " P",
              je.pot,
              " ",
              je.plantName,
              " · M ",
              je.moisture,
              " · Need",
              " ",
              $e.blockNeedAct ? `${je.need} (no act)` : je.need,
              ee ? " · dryback warn" : ""
            ]
          },
          je.pot
        );
      }) }) }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Tent history", icon: "climate", children: [
        /* @__PURE__ */ l.jsx(sl, { hours: E, setHours: N, extras: al }),
        /* @__PURE__ */ l.jsx(
          wn,
          {
            live: !0,
            lastSyncAt: Math.max(se.lastSyncAt ?? 0, ue.lastSyncAt ?? 0, de.lastSyncAt ?? 0) || void 0,
            series: [
              {
                id: "t",
                label: "Temp",
                series: se.series,
                color: "var(--dsc-blue)",
                axis: "left",
                unit: "°C",
                band: Number.isFinite(Se) ? { min: Se - 1.5, max: Se + 1.5 } : void 0
              },
              {
                id: "rh",
                label: "RH",
                series: ue.series,
                color: "var(--dsc-teal)",
                axis: "right",
                unit: "%",
                band: { min: lt, max: pt }
              }
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Fans (this tent)", icon: "climate", children: [
        he ? null : /* @__PURE__ */ l.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Fan sliders locked until Fan override is on (Climate → Command)." }),
        /* @__PURE__ */ l.jsx("div", { className: "dsc-fan-stack", children: a === "main" ? /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
          /* @__PURE__ */ l.jsx(
            za,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_main",
              label: "Intake 4×8",
              disabled: !he
            }
          ),
          /* @__PURE__ */ l.jsx(
            za,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_room",
              label: "Exhaust room (RECIRC)",
              disabled: !he
            }
          ),
          /* @__PURE__ */ l.jsx(
            za,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_outside",
              label: "Exhaust outside (OUT)",
              disabled: !he
            }
          )
        ] }) : /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
          /* @__PURE__ */ l.jsx(
            za,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_2x4",
              label: "Intake 2×4",
              disabled: !he
            }
          ),
          /* @__PURE__ */ l.jsx(qe, { entityId: "light.dsc_hub_sf1000_dimmer", label: "SF1000", icon: "lighting" })
        ] }) })
      ] }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsx(re, { className: "dsc-glass", title: "Plant log (48h)", icon: "roster", children: w.length === 0 ? /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: "Thin recorder / no recent identity changes — honesty empty, not invented." }) : /* @__PURE__ */ l.jsxs("ul", { className: "dsc-fault-list", children: [
        w.slice(0, 40).map((je) => /* @__PURE__ */ l.jsx("li", { children: /* @__PURE__ */ l.jsx("span", { className: "dsc-muted", style: { fontFamily: "var(--dsc-mono)", fontSize: 12 }, children: je }) }, je)),
        w.length > 40 ? /* @__PURE__ */ l.jsx("li", { children: /* @__PURE__ */ l.jsxs("span", { className: "dsc-muted", style: { fontFamily: "var(--dsc-mono)", fontSize: 12 }, children: [
          "+",
          w.length - 40,
          " more"
        ] }) }) : null
      ] }) }) })
    ] }),
    /* @__PURE__ */ l.jsx(
      cs,
      {
        open: P != null,
        onClose: () => {
          const je = new URLSearchParams(g);
          je.delete("pot"), j(je, { replace: !0 });
        },
        title: P != null ? `Plant seat · POT${P}` : "Plant seat",
        children: P != null ? /* @__PURE__ */ l.jsx(
          or,
          {
            pot: P,
            onSelectPot: (je) => {
              const it = new URLSearchParams(g);
              it.set("pot", String(je)), j(it, { replace: !0 });
            }
          }
        ) : null
      }
    )
  ] });
}
function s2() {
  return /* @__PURE__ */ l.jsx(Cb, { tent: "main" });
}
function l2() {
  return /* @__PURE__ */ l.jsx(Cb, { tent: "clone" });
}
const i2 = [
  { label: "OUT", prefix: "dsc_cal_cfm_out", reset: "script.dsc_cal_reset_curve_out" },
  { label: "RECIRC", prefix: "dsc_cal_cfm_recirc", reset: "script.dsc_cal_reset_curve_recirc" },
  { label: "Intake Main", prefix: "dsc_cal_cfm_intake_main", reset: "script.dsc_cal_reset_curve_intake_main" },
  { label: "Intake 2×4", prefix: "dsc_cal_cfm_intake_clone", reset: "script.dsc_cal_reset_curve_intake_clone" }
], m_ = [25, 50, 75, 100];
function c2() {
  const { entity: a, state: i } = Ce(), { callService: c } = Xt(), [o, d] = y.useState(null), f = i("sensor.dsc_learn_status", "—"), h = i("binary_sensor.dsc_learn_gate_open") === "on", m = i("sensor.dsc_learn_activity", "—"), _ = String(a("sensor.dsc_cfm_exhaust_out")?.attributes?.cal_curve ?? ""), b = i("sensor.dsc_cfm_curves_status", "—"), v = i("sensor.dsc_learn_phase_b_status", "—"), g = i("input_boolean.dsc_cal_active") === "on", j = String(a("sensor.dsc_learn_status")?.attributes?.trusted_levers ?? "none");
  return /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
    /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Anemometer / PPFD cal", icon: "learning", children: [
      /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ l.jsx(D, { label: `Curves ${b}`, tone: b === "—" ? "muted" : "ok" }),
        /* @__PURE__ */ l.jsx(D, { label: g ? "SESSION ON" : "Session idle", tone: g ? "ok" : "muted" })
      ] }),
      /* @__PURE__ */ l.jsxs("p", { className: "dsc-honesty", children: [
        "CFM live numbers live on Climate. This wizard writes cal points only — do not invent them.",
        _ ? ` Curve: ${_}` : ""
      ] }),
      /* @__PURE__ */ l.jsxs("div", { className: "dsc-row-actions", children: [
        /* @__PURE__ */ l.jsx(ce, { onClick: () => d("gate"), children: "Open gate" }),
        /* @__PURE__ */ l.jsx(ce, { onClick: () => d("sample"), children: "Sample points" }),
        /* @__PURE__ */ l.jsx(ce, { teal: !0, onClick: () => d("accept"), children: "Finish session" }),
        /* @__PURE__ */ l.jsx(ce, { onClick: () => d("curves"), children: "Stored curves" })
      ] })
    ] }),
    /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Climate learn (Phase A/B)", icon: "learning", children: [
      /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ l.jsx(D, { label: `Status ${f}`, tone: f === "—" ? "muted" : "ok" }),
        /* @__PURE__ */ l.jsx(D, { label: h ? "GATE OPEN" : "GATE CLOSED", tone: h ? "ok" : "warn" }),
        /* @__PURE__ */ l.jsx(D, { label: `Activity ${m}`, tone: "muted" }),
        /* @__PURE__ */ l.jsx(D, { label: `B ${v}`, tone: v === "off" || v === "—" ? "muted" : "ok" }),
        /* @__PURE__ */ l.jsx(D, { label: `Trusted ${j}`, tone: "muted" })
      ] }),
      /* @__PURE__ */ l.jsx("p", { className: "dsc-honesty", children: "One air appliance at a time. Fans/mat may stay on. Activity is SoT — gate open ≠ measuring. Phase B stays off until Activity shows samples climbing." }),
      /* @__PURE__ */ l.jsx(ce, { onClick: () => d("climate"), children: "Learn enable" })
    ] }),
    /* @__PURE__ */ l.jsxs(Yt, { open: o === "gate", onDismiss: () => d(null), title: "Learn gate", help: null, children: [
      /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", children: "Target + session. Scripts own hold math." }),
      /* @__PURE__ */ l.jsx(ls, { entityId: "input_select.dsc_cal_target", label: "Cal target" }),
      /* @__PURE__ */ l.jsx("p", { className: "dsc-kpi-sub", children: i("input_text.dsc_cal_status", "") }),
      /* @__PURE__ */ l.jsx(
        ce,
        {
          primary: !0,
          onClick: () => {
            c("script", "turn_on", { entity_id: "script.dsc_cal_start" }), d("sample");
          },
          children: "Start session"
        }
      )
    ] }),
    /* @__PURE__ */ l.jsxs(Yt, { open: o === "sample", onDismiss: () => d(null), title: "Sample", help: null, children: [
      /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", children: "Enter anemometer m/s or CFM. Skip rather than invent. Drafts hold until blur." }),
      /* @__PURE__ */ l.jsxs("div", { className: "dsc-target-grid", children: [
        /* @__PURE__ */ l.jsx(Je, { entityId: "input_number.dsc_cal_reading_ms", label: "m/s" }),
        /* @__PURE__ */ l.jsx(Je, { entityId: "input_number.dsc_cal_reading_cfm", label: "CFM" }),
        /* @__PURE__ */ l.jsx(Je, { entityId: "input_number.dsc_cal_reading_ppfd", label: "PPFD" }),
        /* @__PURE__ */ l.jsx(Je, { entityId: "input_number.dsc_cal_step_pct", label: "Step %" }),
        /* @__PURE__ */ l.jsx(Je, { entityId: "input_number.dsc_duct_out_cm", label: "OUT duct cm" }),
        /* @__PURE__ */ l.jsx(Je, { entityId: "input_number.dsc_duct_recirc_cm", label: "RECIRC cm" }),
        /* @__PURE__ */ l.jsx(Je, { entityId: "input_number.dsc_duct_intake_main_cm", label: "Intake main cm" }),
        /* @__PURE__ */ l.jsx(Je, { entityId: "input_number.dsc_duct_intake_clone_cm", label: "Intake 2×4 cm" })
      ] }),
      /* @__PURE__ */ l.jsxs("div", { className: "dsc-row-actions", children: [
        /* @__PURE__ */ l.jsx(ce, { onClick: () => void c("script", "turn_on", { entity_id: "script.dsc_cal_hold_next" }), children: "Re-hold" }),
        /* @__PURE__ */ l.jsx(ce, { primary: !0, onClick: () => void c("script", "turn_on", { entity_id: "script.dsc_cal_save_point" }), children: "Save point" }),
        /* @__PURE__ */ l.jsx(ce, { onClick: () => void c("script", "turn_on", { entity_id: "script.dsc_cal_skip_point" }), children: "Skip" }),
        /* @__PURE__ */ l.jsx(ce, { onClick: () => void c("script", "turn_on", { entity_id: "script.dsc_cal_abort" }), children: "Abort" })
      ] })
    ] }),
    /* @__PURE__ */ l.jsx(
      Yt,
      {
        open: o === "accept",
        onDismiss: () => d(null),
        onConfirm: () => {
          c("script", "turn_on", { entity_id: "script.dsc_cal_finish" }), d(null);
        },
        title: "Finish session",
        confirmLabel: "Finish",
        help: null,
        children: /* @__PURE__ */ l.jsxs("p", { children: [
          "Curve status ",
          b,
          ". Finish restores snapped fans/light. Points already saved at 25/50/75/100 stay; this does not invent a fit."
        ] })
      }
    ),
    /* @__PURE__ */ l.jsxs(
      Yt,
      {
        open: o === "climate",
        onDismiss: () => d(null),
        onConfirm: () => d(null),
        title: "Climate learn enable",
        confirmLabel: "Done",
        help: null,
        children: [
          /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", children: "Toggles HA helpers. No invented samples. Blocked while failsafe/takeover/fault." }),
          /* @__PURE__ */ l.jsx(qe, { entityId: "input_boolean.dsc_climate_learn_enabled", label: "Phase A enabled" }),
          /* @__PURE__ */ l.jsx(qe, { entityId: "input_boolean.dsc_climate_learn_phase_b_enabled", label: "Phase B enabled" }),
          /* @__PURE__ */ l.jsx(qe, { entityId: "input_boolean.dsc_learn_phase_b_locked", label: "Phase B lock" }),
          /* @__PURE__ */ l.jsxs("div", { className: "dsc-target-grid", children: [
            /* @__PURE__ */ l.jsx(Je, { entityId: "input_number.dsc_learn_alpha", label: "EMA α" }),
            /* @__PURE__ */ l.jsx(Je, { entityId: "input_number.dsc_learn_min_samples", label: "Min samples" })
          ] }),
          /* @__PURE__ */ l.jsxs("p", { className: "dsc-kpi-sub", children: [
            "Gate ",
            h ? "open" : "closed",
            " · ",
            m,
            " · trusted ",
            j
          ] })
        ]
      }
    ),
    /* @__PURE__ */ l.jsxs(Yt, { open: o === "curves", onDismiss: () => d(null), title: "Stored curves", help: null, children: [
      /* @__PURE__ */ l.jsx("p", { className: "dsc-honesty", children: "0 = unset → linear % × nameplate. Do not invent points. Reset scripts wipe a curve; they do not guess a fit." }),
      i2.map((w) => /* @__PURE__ */ l.jsxs("div", { className: "dsc-cal-curve", children: [
        /* @__PURE__ */ l.jsx("strong", { children: w.label }),
        /* @__PURE__ */ l.jsx("div", { className: "dsc-target-grid", children: m_.map((S) => /* @__PURE__ */ l.jsx(
          Je,
          {
            entityId: `input_number.${w.prefix}_${S}`,
            label: `@${S}%`
          },
          `${w.prefix}_${S}`
        )) }),
        /* @__PURE__ */ l.jsxs(
          ce,
          {
            onClick: () => void c("script", "turn_on", { entity_id: w.reset }),
            children: [
              "Reset ",
              w.label
            ]
          }
        )
      ] }, w.prefix)),
      /* @__PURE__ */ l.jsx("strong", { children: "SF1000 PPFD" }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-target-grid", children: m_.map((w) => /* @__PURE__ */ l.jsx(Je, { entityId: `input_number.dsc_cal_ppfd_${w}`, label: `@${w}%` }, `ppfd_${w}`)) }),
      /* @__PURE__ */ l.jsx(
        ce,
        {
          onClick: () => void c("script", "turn_on", { entity_id: "script.dsc_cal_reset_curve_sf1000" }),
          children: "Reset PPFD"
        }
      )
    ] })
  ] });
}
function r2() {
  const { available: a, num: i, state: c } = Ce(), o = c("input_boolean.dsc_tank_in_service") === "on", d = a("input_number.dsc_tank_level_pct") || a("sensor.dsc_tank_level_pct"), f = a("sensor.dsc_tank_level_pct") ? i("sensor.dsc_tank_level_pct") : i("input_number.dsc_tank_level_pct"), h = d && Number.isFinite(f), m = a("sensor.dsc_tank_ec_normalized"), _ = a("sensor.dsc_tank_ph_calibrated"), b = a("sensor.water_tester_temperature"), v = c("input_boolean.dsc_tank_pump_active") === "on", g = h ? Math.max(4, Math.min(100, f)) : 0;
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-tank-cutaway", children: [
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ l.jsx(D, { label: o ? "In service" : "OOS", tone: o ? "ok" : "warn" }),
      h ? null : /* @__PURE__ */ l.jsx(D, { label: "Level unknown — empty, not guessed", tone: "warn" }),
      v ? /* @__PURE__ */ l.jsx(D, { label: "Pump ON", tone: "ok", pulse: !0 }) : /* @__PURE__ */ l.jsx(D, { label: "Pump off", tone: "muted" })
    ] }),
    /* @__PURE__ */ l.jsxs("svg", { viewBox: "0 0 180 220", className: "dsc-tank-svg", "aria-label": "Tank cutaway", children: [
      /* @__PURE__ */ l.jsx(
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
          strokeDasharray: h ? void 0 : "7 5"
        }
      ),
      h ? /* @__PURE__ */ l.jsx(
        "rect",
        {
          x: "28",
          y: 26 + 176 * (1 - g / 100),
          width: "124",
          height: 176 * g / 100,
          fill: "rgba(38,198,218,0.22)"
        }
      ) : null,
      m ? /* @__PURE__ */ l.jsx("rect", { x: "32", y: "36", width: "116", height: "10", fill: "rgba(255,183,77,0.55)" }) : null,
      /* @__PURE__ */ l.jsx("rect", { x: "24", y: "18", width: "132", height: "12", fill: "none", stroke: _ ? "var(--dsc-purple)" : "var(--dsc-gray-5)", strokeWidth: "3" }),
      v ? [0, 1, 2].map((j) => /* @__PURE__ */ l.jsx("circle", { cx: 90 + (j - 1) * 18, cy: "188", r: "4", fill: "var(--dsc-teal)", opacity: 0.5 + j * 0.15 }, j)) : null
    ] }),
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-kpi-sub", children: [
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
const p_ = ["var(--dsc-blue)", "var(--dsc-teal)", "var(--dsc-purple)", "var(--dsc-amber)"];
function o2() {
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ l.jsx(
      Nt,
      {
        icon: "learning",
        title: "Learning",
        subtitle: "Anemometer gate, sample, accept — scripts own the math. No dsc-hub-pro."
      }
    ),
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsx(c2, {}) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsx(re, { className: "dsc-glass", title: "Kit / In service", icon: "settings", children: /* @__PURE__ */ l.jsxs("div", { className: "dsc-mode-row", children: [
        /* @__PURE__ */ l.jsx(qe, { entityId: "input_boolean.dsc_ac_in_service", label: "AC in service", icon: "climate" }),
        /* @__PURE__ */ l.jsx(
          qe,
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
function u2() {
  const { state: a } = Ce(), { hours: i, setHours: c, maxPoints: o } = nl(6), d = xe("sensor.dsc_hub_tent_temperature", { maxPoints: o, hours: i }), f = xe("sensor.dsc_hub_tent_humidity", { maxPoints: o, hours: i }), h = xe(bn(1, "moisture", a), { maxPoints: o, hours: i }), m = xe(bn(2, "moisture", a), { maxPoints: o, hours: i }), _ = xe(bn(3, "moisture", a), { maxPoints: o, hours: i }), b = xe(bn(4, "moisture", a), { maxPoints: o, hours: i }), g = [
    { n: 1, series: h },
    { n: 2, series: m },
    { n: 3, series: _ },
    { n: 4, series: b }
  ].filter((w) => qt(w.n, a)), j = aa.filter((w) => qt(w, a)).map((w) => ({ n: w, need: a(`sensor.dsc_pot${w}_need_summary`, "—") })).find((w) => w.need && w.need !== "—" && !/^ok$/i.test(w.need));
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ l.jsx(
      Nt,
      {
        icon: "analytics",
        title: "Analytics",
        subtitle: "In-service pots. Climate charts live on Climate; this is the root pack."
      }
    ),
    /* @__PURE__ */ l.jsx("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: /* @__PURE__ */ l.jsx(
      sl,
      {
        hours: i,
        setHours: c,
        extras: al
      }
    ) }),
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Tent T + RH (secondary)", icon: "climate", children: [
        /* @__PURE__ */ l.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Primary traces sit on Climate. Ghost/compare there, not a second dashboard." }),
        /* @__PURE__ */ l.jsx(
          wn,
          {
            live: !0,
            lastSyncAt: Math.max(d.lastSyncAt ?? 0, f.lastSyncAt ?? 0) || void 0,
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
                series: f.series,
                color: "var(--dsc-teal)",
                axis: "right",
                unit: "%"
              }
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Root pack — moisture (in service)", icon: "root", children: [
        g.length ? /* @__PURE__ */ l.jsx(
          wn,
          {
            live: !0,
            unit: "%",
            lastSyncAt: Math.max(...g.map((w) => w.series.lastSyncAt ?? 0)) || void 0,
            series: g.map((w, S) => ({
              id: `p${w.n}`,
              label: j?.n === w.n ? `P${w.n} Need` : `P${w.n}`,
              series: w.series.series,
              color: p_[S % p_.length],
              unit: "%"
            }))
          }
        ) : /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", children: "No in-service pots." }),
        j ? /* @__PURE__ */ l.jsxs("p", { className: "dsc-kpi-sub", children: [
          "Worst Need P",
          j.n,
          ": ",
          j.need
        ] }) : null
      ] }) })
    ] })
  ] });
}
function d2() {
  const { state: a, available: i, num: c } = Ce(), o = kt(), d = kn(), f = Sd(o), h = kd(f), m = ft("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available: i,
    num: c
  }), _ = (v) => d.open({
    entityId: v.entityId,
    label: v.label,
    kind: "kit",
    runtimeToday: v.runtimeToday,
    cyclesToday: v.cyclesToday,
    demandEntity: v.demandEntity
  }), b = [
    { label: "Pi appliance link", id: "binary_sensor.dsc_pi_appliance_link" },
    { label: "Hub firmware", id: "sensor.dsc_hub_firmware_version" },
    { label: "Control firmware", id: "sensor.dsc_control_firmware_version" },
    { label: "Pot1 firmware", id: "sensor.dsc_pot1_firmware_version" },
    { label: "Pot2 firmware", id: "sensor.dsc_pot2_firmware_version" },
    { label: "Pot3 firmware", id: "sensor.dsc_pot3_firmware_version" },
    { label: "Pot4 firmware", id: "sensor.dsc_pot4_firmware_version" },
    { label: "Nest / SoftAP channel", id: "sensor.dsc_hub_wifi_channel" }
  ];
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ l.jsx(
      Nt,
      {
        icon: "fleet",
        title: "Fleet",
        subtitle: `${h.inService} of ${h.total} in service. Kit Pulse holes, tank tester, fleet table.`
      }
    ),
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsx(jd, {}) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ l.jsx(
        St,
        {
          label: "In service",
          value: `${h.inService}/${h.total}`,
          tone: h.dark > 0 ? "bad" : "ok"
        }
      ) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ l.jsx(
        St,
        {
          label: "Surface",
          value: o.surface || a("sensor.dsc_ha_surface_version", "7.2.0"),
          sub: "Panel product shell"
        }
      ) }),
      /* @__PURE__ */ l.jsxs("div", { className: "dsc-col-4", children: [
        /* @__PURE__ */ l.jsx(
          St,
          {
            label: "Alerts",
            value: Number.isFinite(c("sensor.dsc_active_alert_count")) ? c("sensor.dsc_active_alert_count") : "—",
            tone: c("sensor.dsc_active_alert_count", 0) === 0 ? "ok" : "bad"
          }
        ),
        /* @__PURE__ */ l.jsx(ur, { readings: [m] })
      ] }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Kit Pulse", icon: "system", children: [
        /* @__PURE__ */ l.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Holes are missing / planned OOS / dark after cooldown — not a greenwashed map." }),
        /* @__PURE__ */ l.jsx(Nd, { nodes: f, onSelect: _ })
      ] }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ l.jsx(re, { className: "dsc-glass", title: "Kit / In service", icon: "settings", children: /* @__PURE__ */ l.jsxs("div", { className: "dsc-mode-row", children: [
        /* @__PURE__ */ l.jsx(qe, { entityId: "input_boolean.dsc_ac_in_service", label: "AC in service", icon: "climate" }),
        /* @__PURE__ */ l.jsx(
          qe,
          {
            entityId: "input_boolean.dsc_clone_humidifier_in_service",
            label: "Clone mister",
            icon: "clone"
          }
        ),
        /* @__PURE__ */ l.jsx(qe, { entityId: "input_boolean.dsc_pot1_in_service", label: "Pot 1", icon: "root" }),
        /* @__PURE__ */ l.jsx(qe, { entityId: "input_boolean.dsc_pot2_in_service", label: "Pot 2", icon: "root" }),
        /* @__PURE__ */ l.jsx(qe, { entityId: "input_boolean.dsc_pot3_in_service", label: "Pot 3", icon: "root" }),
        /* @__PURE__ */ l.jsx(qe, { entityId: "input_boolean.dsc_pot4_in_service", label: "Pot 4", icon: "root" }),
        /* @__PURE__ */ l.jsx(qe, { entityId: "input_boolean.dsc_tank_in_service", label: "Tank", icon: "tank" })
      ] }) }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Tank", icon: "tank", children: [
        /* @__PURE__ */ l.jsx(r2, {}),
        /* @__PURE__ */ l.jsxs("p", { className: "dsc-kpi-sub", children: [
          "Stage ",
          a("input_select.dsc_tank_stage", "—"),
          " · Type",
          " ",
          a("input_select.dsc_tank_plant_type", "—")
        ] })
      ] }) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ l.jsx(re, { className: "dsc-glass", title: "Bridge / firmware", icon: "fleet", children: /* @__PURE__ */ l.jsxs("table", { className: "dsc-table", children: [
        /* @__PURE__ */ l.jsx("thead", { children: /* @__PURE__ */ l.jsxs("tr", { children: [
          /* @__PURE__ */ l.jsx("th", { children: "Signal" }),
          /* @__PURE__ */ l.jsx("th", { children: "State" })
        ] }) }),
        /* @__PURE__ */ l.jsx("tbody", { children: b.map((v) => /* @__PURE__ */ l.jsxs("tr", { children: [
          /* @__PURE__ */ l.jsx("td", { children: v.label }),
          /* @__PURE__ */ l.jsx("td", { children: i(v.id) ? a(v.id, "—") : /* @__PURE__ */ l.jsx(D, { label: "hole", tone: "warn" }) })
        ] }, v.id)) })
      ] }) }) })
    ] })
  ] });
}
const f2 = ["1", "6", "11"];
function h2(a, i) {
  return i === "hub" ? a.hub : i === "panel" ? a.panel : a.pots[i] ? a.pots[i] : a.sonoffs[i] ? a.sonoffs[i] : null;
}
function m2(a) {
  return a == null || !Number.isFinite(a) ? "—" : new Date(a * 1e3).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
function p2({
  row: a,
  seat: i
}) {
  const c = String(a.seat_id ?? "—"), o = String(
    a.role ?? (a.extra && typeof a.extra == "object" ? a.extra.role : "—")
  ), d = i?.online ?? !1, f = !!a.in_service;
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-card", children: [
    /* @__PURE__ */ l.jsxs("h3", { children: [
      c,
      /* @__PURE__ */ l.jsx(D, { label: d ? "ONLINE" : "OFFLINE", tone: d ? "ok" : "bad" })
    ] }),
    /* @__PURE__ */ l.jsxs("dl", { className: "dsc-detail-list", children: [
      /* @__PURE__ */ l.jsx("dt", { children: "Role" }),
      /* @__PURE__ */ l.jsx("dd", { children: o }),
      /* @__PURE__ */ l.jsx("dt", { children: "IP / host" }),
      /* @__PURE__ */ l.jsx("dd", { children: String(a.host ?? "—") }),
      /* @__PURE__ */ l.jsx("dt", { children: "MAC" }),
      /* @__PURE__ */ l.jsx("dd", { children: String(a.mac ?? "—") }),
      /* @__PURE__ */ l.jsx("dt", { children: "Firmware" }),
      /* @__PURE__ */ l.jsx("dd", { children: i?.firmware ?? "—" }),
      /* @__PURE__ */ l.jsx("dt", { children: "Online" }),
      /* @__PURE__ */ l.jsx("dd", { children: d ? "yes" : "no" }),
      /* @__PURE__ */ l.jsx("dt", { children: "In service" }),
      /* @__PURE__ */ l.jsx("dd", { children: f ? "yes" : "no" }),
      /* @__PURE__ */ l.jsx("dt", { children: "Last seen" }),
      /* @__PURE__ */ l.jsx("dd", { children: m2(i?.last_seen ?? null) })
    ] })
  ] });
}
function _2() {
  const [a, i] = y.useState({}), [c, o] = y.useState([]), [d, f] = y.useState(null), [h, m] = y.useState(null), [_, b] = y.useState(null), [v, g] = y.useState([]), [j, w] = y.useState([]), [S, E] = y.useState([]), [N, C] = y.useState(""), [O, B] = y.useState(""), [J, P] = y.useState(""), [G, X] = y.useState(""), W = async () => {
    const [Y, ie, te, A, T, $, Q] = await Promise.all([
      cy(),
      uy(),
      Gp(),
      hy(),
      my(),
      iy().catch(() => null),
      by().catch(() => ({ devices: [] }))
    ]);
    i(Y.settings), o(Y.inventory), m(ie), b(te), g(A.devices ?? []), w(T), f($ ? B_($) : null), E(Q.devices ?? []);
  };
  y.useEffect(() => {
    W().catch(() => {
    });
  }, []);
  const se = async () => {
    await ry(a), await W();
  }, ue = async (Y, ie) => {
    await oy(Y, { in_service: ie }), await W();
  }, de = y.useMemo(
    () => c.map((Y) => ({
      ...Y,
      seat: d ? h2(d, String(Y.seat_id)) : null
    })),
    [c, d]
  );
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ l.jsx(Nt, { icon: "settings", title: "Settings", subtitle: "DSC-HUB 7.0.0 — Pi appliance" }),
    /* @__PURE__ */ l.jsxs("section", { className: "dsc-card", children: [
      /* @__PURE__ */ l.jsx("h3", { children: "Fleet inventory" }),
      /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", children: "Per-seat detail from /fleet + inventory — IP, MAC, firmware, online, in_service, last_seen." }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-grid", children: de.map(({ seat: Y, ...ie }) => /* @__PURE__ */ l.jsxs("div", { className: "dsc-col-4", children: [
        /* @__PURE__ */ l.jsx(p2, { row: ie, seat: Y }),
        /* @__PURE__ */ l.jsxs("label", { style: { display: "block", marginTop: 8, fontSize: "0.85rem" }, children: [
          /* @__PURE__ */ l.jsx(
            "input",
            {
              type: "checkbox",
              checked: !!ie.in_service,
              onChange: (te) => ue(String(ie.seat_id), te.target.checked)
            }
          ),
          " ",
          "In service"
        ] })
      ] }, String(ie.seat_id))) })
    ] }),
    /* @__PURE__ */ l.jsxs("section", { className: "dsc-card", children: [
      /* @__PURE__ */ l.jsx("h3", { children: "Network" }),
      /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", children: "AP channel locked to 1 / 6 / 11. Apply restarts AP — fleet reconnects." }),
      /* @__PURE__ */ l.jsxs("label", { children: [
        "AP SSID",
        /* @__PURE__ */ l.jsx(
          "input",
          {
            value: a.ap_ssid ?? "",
            onChange: (Y) => i({ ...a, ap_ssid: Y.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ l.jsxs("label", { children: [
        "AP PSK",
        /* @__PURE__ */ l.jsx(
          "input",
          {
            type: "password",
            value: a.ap_psk ?? "",
            onChange: (Y) => i({ ...a, ap_psk: Y.target.value }),
            placeholder: h?.ap_psk_set ? "••••••••" : "set on first save"
          }
        )
      ] }),
      /* @__PURE__ */ l.jsxs("label", { children: [
        "Channel",
        /* @__PURE__ */ l.jsx(
          "select",
          {
            value: a.ap_channel ?? "6",
            onChange: (Y) => i({ ...a, ap_channel: Y.target.value }),
            children: f2.map((Y) => /* @__PURE__ */ l.jsx("option", { value: Y, children: Y }, Y))
          }
        )
      ] }),
      h?.dhcp_map ? /* @__PURE__ */ l.jsxs("table", { className: "dsc-table", children: [
        /* @__PURE__ */ l.jsx("thead", { children: /* @__PURE__ */ l.jsxs("tr", { children: [
          /* @__PURE__ */ l.jsx("th", { children: "Seat" }),
          /* @__PURE__ */ l.jsx("th", { children: "Host" }),
          /* @__PURE__ */ l.jsx("th", { children: "MAC" })
        ] }) }),
        /* @__PURE__ */ l.jsx("tbody", { children: h.dhcp_map.map((Y) => /* @__PURE__ */ l.jsxs("tr", { children: [
          /* @__PURE__ */ l.jsx("td", { children: String(Y.seat_id) }),
          /* @__PURE__ */ l.jsx("td", { children: String(Y.host ?? "—") }),
          /* @__PURE__ */ l.jsx("td", { children: String(Y.mac ?? "—") })
        ] }, String(Y.seat_id))) })
      ] }) : null,
      /* @__PURE__ */ l.jsx(
        ce,
        {
          onClick: async () => {
            await se();
            const Y = await dy();
            P(JSON.stringify(Y, null, 2));
          },
          children: "Apply network"
        }
      ),
      J ? /* @__PURE__ */ l.jsx("pre", { className: "dsc-honesty", children: J }) : null
    ] }),
    /* @__PURE__ */ l.jsxs("section", { className: "dsc-card", children: [
      /* @__PURE__ */ l.jsx("h3", { children: "Integrations" }),
      /* @__PURE__ */ l.jsxs("label", { children: [
        "Ollama URL",
        /* @__PURE__ */ l.jsx(
          "input",
          {
            value: a.ollama_base_url ?? "",
            onChange: (Y) => i({ ...a, ollama_base_url: Y.target.value }),
            placeholder: "http://192.168.86.2:11434"
          }
        )
      ] }),
      /* @__PURE__ */ l.jsxs("label", { children: [
        "Ollama model",
        /* @__PURE__ */ l.jsx(
          "input",
          {
            value: a.ollama_model ?? "",
            onChange: (Y) => i({ ...a, ollama_model: Y.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ l.jsx(ce, { onClick: async () => C(JSON.stringify(await py())), children: "Test Ollama" }),
      N ? /* @__PURE__ */ l.jsx("pre", { className: "dsc-honesty", children: N }) : null,
      /* @__PURE__ */ l.jsxs("label", { children: [
        "CannaLib API URL",
        /* @__PURE__ */ l.jsx(
          "input",
          {
            value: a.cannalib_api_url ?? "",
            onChange: (Y) => i({ ...a, cannalib_api_url: Y.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ l.jsxs("label", { children: [
        "CannaLib API key",
        /* @__PURE__ */ l.jsx(
          "input",
          {
            type: "password",
            value: a.cannalib_api_key ?? "",
            onChange: (Y) => i({ ...a, cannalib_api_key: Y.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ l.jsxs("label", { children: [
        /* @__PURE__ */ l.jsx(
          "input",
          {
            type: "checkbox",
            checked: (a.cannalib_use_local_fallback ?? "true") === "true",
            onChange: (Y) => i({
              ...a,
              cannalib_use_local_fallback: Y.target.checked ? "true" : "false"
            })
          }
        ),
        "Use on-Pi sqlite fallback when remote API is down"
      ] }),
      /* @__PURE__ */ l.jsx(ce, { onClick: async () => B(JSON.stringify(await _y())), children: "Test CannaLib" }),
      O ? /* @__PURE__ */ l.jsx("pre", { className: "dsc-honesty", children: O }) : null
    ] }),
    /* @__PURE__ */ l.jsxs("section", { className: "dsc-card", children: [
      /* @__PURE__ */ l.jsx("h3", { children: "Catalog" }),
      /* @__PURE__ */ l.jsxs("p", { className: "dsc-honesty", children: [
        _ ? String(_.note ?? "—") : "Loading…",
        " (source:",
        " ",
        _ ? String(_.source ?? "unknown") : "—",
        ")"
      ] }),
      /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", children: "Chem / height / lineage stay CannaLib-honest — LLM does not invent." }),
      /* @__PURE__ */ l.jsx(ce, { onClick: async () => b(await Gp()), children: "Refresh status" }),
      /* @__PURE__ */ l.jsx(ce, { onClick: async () => fy(), children: "Reload local catalogs" })
    ] }),
    /* @__PURE__ */ l.jsxs("section", { className: "dsc-card", children: [
      /* @__PURE__ */ l.jsx("h3", { children: "ESPHome" }),
      /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", children: "OTA preferred. Compile on Pi is one job at a time — swap warning applies. No silent auto-flash." }),
      /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", children: "Pot 5+ is out until firmware exists." }),
      /* @__PURE__ */ l.jsxs("table", { className: "dsc-table", children: [
        /* @__PURE__ */ l.jsx("thead", { children: /* @__PURE__ */ l.jsxs("tr", { children: [
          /* @__PURE__ */ l.jsx("th", { children: "Seat" }),
          /* @__PURE__ */ l.jsx("th", { children: "YAML" }),
          /* @__PURE__ */ l.jsx("th", { children: "Expected" }),
          /* @__PURE__ */ l.jsx("th", { children: "Last seen" }),
          /* @__PURE__ */ l.jsx("th", {})
        ] }) }),
        /* @__PURE__ */ l.jsx("tbody", { children: v.map((Y) => /* @__PURE__ */ l.jsxs("tr", { children: [
          /* @__PURE__ */ l.jsx("td", { children: String(Y.seat_id) }),
          /* @__PURE__ */ l.jsx("td", { children: String(Y.yaml ?? "—") }),
          /* @__PURE__ */ l.jsx("td", { children: String(Y.expected_firmware ?? "—") }),
          /* @__PURE__ */ l.jsx("td", { children: Y.online ? String(Y.last_firmware ?? "online") : "offline" }),
          /* @__PURE__ */ l.jsxs("td", { children: [
            /* @__PURE__ */ l.jsx(ce, { onClick: () => Vp(String(Y.seat_id), "ota").then(W), children: "Queue OTA" }),
            /* @__PURE__ */ l.jsx(ce, { onClick: () => Vp(String(Y.seat_id), "compile").then(W), children: "Queue compile" })
          ] })
        ] }, String(Y.seat_id))) })
      ] }),
      j.length ? /* @__PURE__ */ l.jsx("pre", { className: "dsc-honesty", children: JSON.stringify(j.slice(0, 3), null, 2) }) : null
    ] }),
    /* @__PURE__ */ l.jsxs("section", { className: "dsc-card", children: [
      /* @__PURE__ */ l.jsx("h3", { children: "Zigbee (SkyConnect)" }),
      /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", children: "Additive canopy / plugs — not climate ladder legs." }),
      /* @__PURE__ */ l.jsxs("div", { className: "dsc-row-actions", children: [
        /* @__PURE__ */ l.jsx(ce, { onClick: () => Yp(!0).then(W), children: "Permit join (2 min)" }),
        /* @__PURE__ */ l.jsx(ce, { onClick: () => Yp(!1).then(W), children: "Stop join" })
      ] }),
      S.length ? /* @__PURE__ */ l.jsxs("table", { className: "dsc-table", style: { marginTop: 12 }, children: [
        /* @__PURE__ */ l.jsx("thead", { children: /* @__PURE__ */ l.jsxs("tr", { children: [
          /* @__PURE__ */ l.jsx("th", { children: "Name" }),
          /* @__PURE__ */ l.jsx("th", { children: "IEEE" }),
          /* @__PURE__ */ l.jsx("th", { children: "Type" }),
          /* @__PURE__ */ l.jsx("th", { children: "Model" })
        ] }) }),
        /* @__PURE__ */ l.jsx("tbody", { children: S.filter((Y) => Y.type !== "Coordinator").map((Y) => /* @__PURE__ */ l.jsxs("tr", { children: [
          /* @__PURE__ */ l.jsx("td", { children: String(Y.friendly_name ?? "—") }),
          /* @__PURE__ */ l.jsx("td", { children: String(Y.ieee_address ?? "—") }),
          /* @__PURE__ */ l.jsx("td", { children: String(Y.type ?? "—") }),
          /* @__PURE__ */ l.jsxs("td", { children: [
            String(Y.vendor ?? ""),
            Y.model ? ` ${String(Y.model)}` : ""
          ] })
        ] }, String(Y.ieee_address ?? Y.friendly_name))) })
      ] }) : /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", style: { marginTop: 10 }, children: "No Zigbee devices reported yet — enable permit join, then refresh. List from GET /settings/zigbee/devices." })
    ] }),
    /* @__PURE__ */ l.jsxs("section", { className: "dsc-card", children: [
      /* @__PURE__ */ l.jsx("h3", { children: "Backup" }),
      /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", children: "Export ops sqlite, manifest, optional .env and z2m data." }),
      /* @__PURE__ */ l.jsx("a", { className: "dsc-button", href: gy(), download: "dsc-hub-backup.zip", children: "Download backup" }),
      /* @__PURE__ */ l.jsxs("label", { children: [
        "Import backup",
        /* @__PURE__ */ l.jsx(
          "input",
          {
            type: "file",
            accept: ".zip",
            onChange: async (Y) => {
              const ie = Y.target.files?.[0];
              ie && X(JSON.stringify(await vy(ie)));
            }
          }
        )
      ] }),
      G ? /* @__PURE__ */ l.jsx("pre", { className: "dsc-honesty", children: G }) : null
    ] }),
    /* @__PURE__ */ l.jsx(ce, { primary: !0, onClick: se, children: "Save settings" })
  ] });
}
function Eb(a) {
  return !Number.isFinite(a) || a <= 0 ? "—" : a >= 86400 ? `${(a / 86400).toFixed(1)}d` : a >= 3600 ? `${(a / 3600).toFixed(1)}h` : `${Math.round(a / 60)}m`;
}
function __(a, i, c) {
  return !Number.isFinite(a) || !Number.isFinite(i) || !Number.isFinite(c) ? "?—" : a < i ? `↓ low ${(a - i).toFixed(2)}` : a > c ? `↑ high +${(a - c).toFixed(2)}` : "→ on target";
}
function b2({
  hubOnline: a,
  panelOk: i,
  panelHaOnly: c,
  panelOffline: o,
  heartbeat: d,
  beatOk: f,
  uptimeSec: h,
  alerts: m,
  fleetStatus: _,
  fleetExpected: b,
  cannalibOnline: v,
  cannalibHits: g,
  cannalibSummary: j,
  inServiceLabel: w,
  activeFaultCount: S,
  onChip: E
}) {
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-status-strip", children: [
    /* @__PURE__ */ l.jsx(D, { icon: a ? "ok" : "alert", label: a ? "HUB ONLINE" : "HUB OFFLINE", tone: a ? "ok" : "bad", onClick: () => E?.("sensor.dsc_hub_uptime", "Hub") }),
    /* @__PURE__ */ l.jsx(
      D,
      {
        label: i ? "PANEL ESP-NOW" : c ? "PANEL HA-ONLY" : o ? "PANEL OFFLINE" : "PANEL…",
        tone: i ? "ok" : c ? "warn" : "bad",
        onClick: () => E?.("binary_sensor.dsc_hub_panel_link", "Panel")
      }
    ),
    /* @__PURE__ */ l.jsx(D, { icon: f ? "ok" : "alert", label: f ? `BEAT ${d}` : "NO BEAT", tone: f ? "ok" : "bad", onClick: () => E?.("sensor.dsc_hub_heartbeat", "Beat") }),
    /* @__PURE__ */ l.jsx(D, { label: Eb(h), tone: a ? "ok" : "muted" }),
    /* @__PURE__ */ l.jsx(
      D,
      {
        icon: S === 0 ? "ok" : "alert",
        label: S === 0 ? "All clear" : `${S} alert(s)`,
        tone: S === 0 ? "ok" : "bad",
        pulse: S > 0,
        onClick: () => E?.("sensor.dsc_active_alert_count", "Alerts")
      }
    ),
    /* @__PURE__ */ l.jsx(
      D,
      {
        label: _ === "ok" ? `FLEET ${b}` : "FLEET DRIFT",
        tone: _ === "ok" ? "ok" : "warn",
        onClick: () => E?.("sensor.dsc_fleet_version_status", "Fleet")
      }
    ),
    /* @__PURE__ */ l.jsx(
      D,
      {
        label: v ? `CANNALIB ${g} hits` : "CANNALIB OFF",
        tone: v ? "ok" : "bad",
        onClick: () => E?.("sensor.dsc_cannalib_api_hits", "Cannalib")
      }
    ),
    /* @__PURE__ */ l.jsx(D, { label: v ? j : "— MB", tone: "muted" }),
    /* @__PURE__ */ l.jsx(D, { label: w, tone: "muted" })
  ] });
}
function g2({ bus: a }) {
  const { num: i, available: c } = a, o = a.state("binary_sensor.dsc_cannalib_api_online") === "on", d = [
    { label: "Hits", id: "sensor.dsc_cannalib_api_hits", fmt: (f) => String(Math.round(f)) },
    { label: "Bandwidth in", id: "sensor.dsc_cannalib_bytes_in", fmt: (f) => `${(f / 1024).toFixed(1)} KB` },
    { label: "Bandwidth out", id: "sensor.dsc_cannalib_bytes_out", fmt: (f) => `${(f / 1024).toFixed(1)} KB` },
    { label: "Corpus strains", id: "sensor.dsc_cannalib_corpus_strains", fmt: (f) => String(Math.round(f)) }
  ];
  return /* @__PURE__ */ l.jsx(re, { className: "dsc-glass", title: "Cannalib catalog API", icon: "research", children: /* @__PURE__ */ l.jsx("div", { className: "dsc-chip-row", children: d.map((f) => /* @__PURE__ */ l.jsx(
    St,
    {
      label: f.label,
      value: o && c(f.id) ? f.fmt(i(f.id, 0)) : "—",
      tone: o ? "ok" : "muted"
    },
    f.id
  )) }) });
}
function Mb({ bus: a, onNavigate: i }) {
  const { state: c, entity: o } = a, d = [];
  if (c("binary_sensor.dsc_reduced_kit") === "on") {
    const f = o("binary_sensor.dsc_reduced_kit")?.attributes || {};
    d.push({
      show: !0,
      title: "Unexpected OOS — capacity offline",
      body: `${f.offline || "a live lever is parked"} — Full Auto uses next-best in-service levers. Planned holes (${f.planned_oos || "—"}) are inventory, not this card.`,
      tone: "warn"
    });
  }
  return c("switch.dsc_hub_manual_takeover") === "on" && d.push({ show: !0, title: "MASTER MANUAL TAKEOVER ACTIVE", body: "Automation frozen — hub obeys HA only", tone: "warn" }), c("switch.dsc_hub_tent_manual_override") === "on" && d.push({ show: !0, title: "MANUAL FAN OVERRIDE ACTIVE", body: "Fan values held — photoperiod still driving the SF1000", tone: "warn" }), c("binary_sensor.dsc_clone_dark_period_violation") === "on" && d.push({ show: !0, title: "LIGHT ON IN 2x4 DARK PERIOD", body: "SF1000 commanded on outside the clone window — herm risk", tone: "bad" }), c("binary_sensor.dsc_hub_root_zone_sensor_fault") === "on" && d.push({ show: !0, title: "ROOT-ZONE PROBES OFFLINE", body: "Grow mat fell back to clone-air control (v2.3 behaviour)", tone: "warn" }), d.length ? /* @__PURE__ */ l.jsx("div", { className: "dsc-stack", children: d.map((f) => /* @__PURE__ */ l.jsxs("div", { className: `dsc-banner dsc-banner--${f.tone}`, children: [
    /* @__PURE__ */ l.jsx("strong", { children: f.title }),
    /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", children: f.body }),
    f.title.includes("OOS") ? /* @__PURE__ */ l.jsx("button", { type: "button", className: "dsc-chip", onClick: () => i("/live/climate"), children: "Open Climate" }) : null
  ] }, f.title)) }) : null;
}
function v2({ bus: a, onNavigate: i }) {
  return /* @__PURE__ */ l.jsx("div", { className: "dsc-chip-row", children: [1, 2, 3, 4].map((c) => {
    const o = a.state(`binary_sensor.dsc_hub_pot${c}_esp_now_link`) === "on";
    return /* @__PURE__ */ l.jsx(
      D,
      {
        label: `P${c} ${o ? "ESP" : "HA"}`,
        tone: o ? "ok" : "muted",
        onClick: () => i("/live/root")
      },
      c
    );
  }) });
}
function Tb({ bus: a }) {
  const { state: i, num: c } = a, o = c("sensor.dsc_coldest_root_zone_temp", NaN), d = String(a.entity("sensor.dsc_coldest_root_zone_temp")?.attributes?.pot || ""), f = a.entity("light.dsc_hub_sf1000_dimmer"), h = Math.round(Number(f?.attributes?.brightness ?? 0) / 255 * 100), m = i("light.dsc_hub_sf1000_dimmer") === "on" && h >= 1, _ = h, b = i("binary_sensor.dsc_ac_capacity_offline") === "on", v = i("binary_sensor.dsc_clone_humidifier_capacity_offline") === "on", g = !a.available("switch.dsc_de_humidifier_main_relay"), j = i("binary_sensor.dsc_hub_root_zone_sensor_fault") === "on", w = i("binary_sensor.dsc_clone_dark_period_violation") === "on", S = [
    { label: "Heat", on: i("switch.dsc_hub_heater_demand") === "on", tone: i("switch.dsc_hub_heater_demand") === "on" ? "ok" : "muted" },
    { label: b ? "Cool ○" : "Cool", on: i("switch.dsc_hub_ac_demand") === "on", tone: b ? "warn" : i("switch.dsc_hub_ac_demand") === "on" ? "ok" : "muted" },
    { label: "Hum", on: i("switch.dsc_hub_humidifier_demand") === "on", tone: i("switch.dsc_hub_humidifier_demand") === "on" ? "ok" : "muted" },
    { label: g ? "Dehum offline" : "Dehum", on: i("switch.dsc_hub_dehumidifier_demand") === "on", tone: g ? "bad" : i("switch.dsc_hub_dehumidifier_demand") === "on" ? "ok" : "muted" },
    {
      label: Number.isFinite(o) ? `Mat ${o.toFixed(1)}°C${d && d !== "none" ? ` P${d}` : ""}` : "Mat",
      on: i("switch.dsc_hub_grow_mat_demand") === "on",
      tone: j ? "bad" : i("switch.dsc_hub_grow_mat_demand") === "on" ? "ok" : "muted"
    },
    { label: v ? "C-Hum ○" : "C-Hum", on: i("switch.dsc_hub_clone_humidifier_demand") === "on", tone: v ? "warn" : i("switch.dsc_hub_clone_humidifier_demand") === "on" ? "ok" : "muted" },
    { label: m ? `SF ${_}%` : "SF1000", on: m, tone: w ? "bad" : m ? "ok" : "muted" }
  ];
  return /* @__PURE__ */ l.jsx(re, { className: "dsc-glass", title: "Running", icon: "lighting", children: /* @__PURE__ */ l.jsx("div", { className: "dsc-chip-row", children: S.map((E) => /* @__PURE__ */ l.jsx(D, { label: E.label, tone: E.tone, motion: E.on ? "duty" : void 0 }, E.label)) }) });
}
function Ab({ bus: a, onNavigate: i }) {
  const c = [
    ["IN 4×8", "sensor.dsc_fan_intake_main_pct"],
    ["IN 2×4", "sensor.dsc_fan_intake_2x4_pct"],
    ["EX ROOM", "sensor.dsc_fan_exhaust_room_pct"],
    ["EX OUT", "sensor.dsc_fan_exhaust_outside_pct"]
  ];
  return /* @__PURE__ */ l.jsx("div", { className: "dsc-chip-row", children: c.map(([o, d]) => {
    const f = Math.round(a.num(d, 0));
    return /* @__PURE__ */ l.jsx(
      D,
      {
        label: `${o} ${f}%`,
        tone: f > 0 ? "ok" : "muted",
        motion: f > 0 ? "fan" : void 0,
        onClick: () => i("/live/climate")
      },
      d
    );
  }) });
}
function Hc(a, i) {
  const c = Number(a);
  if (Number.isFinite(c)) return c.toFixed(1);
  const o = Number(i);
  return Number.isFinite(o) ? o.toFixed(1) : a;
}
function x2({ bus: a, onNavigate: i }) {
  const { state: c, num: o } = a, d = c("select.dsc_hub_clone_mode") === "Follow 4x8", f = c("select.dsc_hub_priority_tent", "—"), h = c("switch.dsc_hub_manual_takeover") === "on" ? "Takeover" : c("switch.dsc_hub_tent_manual_override") === "on" ? "Fan override" : c("switch.dsc_hub_tent_full_auto_mode") === "on" ? "Full Auto" : "Standby", m = Hc(c("sensor.dsc_hub_tent_temperature", "—"), o("sensor.dsc_hub_tent_temperature", NaN)), _ = Hc(c("sensor.dsc_hub_tent_humidity", "—"), o("sensor.dsc_hub_tent_humidity", NaN)), b = o("sensor.dsc_hub_vpd_kpa", NaN), v = Hc(c("sensor.dsc_hub_clone_temperature", "—"), o("sensor.dsc_hub_clone_temperature", NaN)), g = Hc(c("sensor.dsc_hub_clone_humidity", "—"), o("sensor.dsc_hub_clone_humidity", NaN)), j = o("sensor.dsc_hub_clone_vpd_kpa", NaN), w = d ? o("number.dsc_hub_vpd_target_min", 0.8) : o("number.dsc_hub_clone_vpd_min", 0.6), S = d ? o("number.dsc_hub_vpd_target_max", 1.4) : o("number.dsc_hub_clone_vpd_max", 1.2), E = [
    ["Hum", "sensor.dsc_hub_humidifier_fire_countdown", "switch.dsc_hub_humidifier_demand"],
    ["Dehum", "sensor.dsc_hub_dehumidifier_fire_countdown", "switch.dsc_hub_dehumidifier_demand"],
    ["Heat", "sensor.dsc_hub_heater_fire_countdown", "switch.dsc_hub_heater_demand"],
    ["AC", "sensor.dsc_hub_ac_fire_countdown", "switch.dsc_hub_ac_demand"],
    ["Mat", "sensor.dsc_hub_grow_mat_fire_countdown", "switch.dsc_hub_grow_mat_demand"]
  ], N = Math.round(a.num("sensor.dsc_fan_exhaust_outside_pct", 0)), C = Math.round(a.num("sensor.dsc_fan_exhaust_room_pct", 0));
  return /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Operational now", icon: "climate", children: [
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 10 }, children: [
      /* @__PURE__ */ l.jsx(D, { label: c("select.dsc_hub_grow_stage", "—"), tone: "ok" }),
      /* @__PURE__ */ l.jsx(D, { label: c("select.dsc_hub_clone_mode", "—"), tone: "ok" }),
      /* @__PURE__ */ l.jsx(D, { label: c("select.dsc_hub_control_strategy", "—"), tone: "muted" }),
      /* @__PURE__ */ l.jsx(D, { label: `Priority ${f}`, tone: "muted" }),
      /* @__PURE__ */ l.jsx(D, { label: h, tone: h === "Full Auto" ? "ok" : h === "Standby" ? "muted" : "warn" })
    ] }),
    /* @__PURE__ */ l.jsxs("p", { className: "dsc-muted", style: { fontSize: 13, lineHeight: 1.5 }, children: [
      /* @__PURE__ */ l.jsx("strong", { children: "4×8" }),
      " ",
      m,
      "°C / ",
      _,
      "% / VPD ",
      Number.isFinite(b) ? b.toFixed(2) : "—",
      " (",
      __(b, o("number.dsc_hub_vpd_target_min", 0.8), o("number.dsc_hub_vpd_target_max", 1.4)),
      ") · band",
      " ",
      c("number.dsc_hub_vpd_target_min"),
      "–",
      c("number.dsc_hub_vpd_target_max"),
      /* @__PURE__ */ l.jsx("br", {}),
      /* @__PURE__ */ l.jsx("strong", { children: "2×4" }),
      " ",
      v,
      "°C / ",
      g,
      "% / VPD ",
      Number.isFinite(j) ? j.toFixed(2) : "—",
      d ? " (follows 4×8 bands)" : "",
      " (",
      __(j, w, S),
      ")",
      /* @__PURE__ */ l.jsx("br", {}),
      "Room appliances chase ",
      /* @__PURE__ */ l.jsx("strong", { children: f }),
      " bands."
    ] }),
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", style: { marginTop: 10 }, children: [
      E.map(([O, B, J]) => {
        const P = c(J) === "on", G = Math.round(a.num(B, 0)), X = P ? `${O} live` : G > 0 ? `${O} ${G}s` : `${O} idle`;
        return /* @__PURE__ */ l.jsx(
          D,
          {
            label: X,
            tone: P ? "ok" : G > 0 ? "warn" : "muted",
            motion: P ? "duty" : G > 0 ? "breathe" : void 0,
            onClick: () => i("/live/climate")
          },
          B
        );
      }),
      /* @__PURE__ */ l.jsx(
        D,
        {
          label: `Fans ${N}/${C}%`,
          tone: N > 0 || C > 0 ? "ok" : "muted",
          motion: N > 0 || C > 0 ? "fan" : void 0,
          onClick: () => i("/live/climate")
        }
      )
    ] })
  ] });
}
function In({
  entityId: a,
  sparkColor: i,
  zone: c,
  gauge: o
}) {
  const { points: d } = xd(a, 24, 96);
  return /* @__PURE__ */ l.jsxs("div", { className: `dsc-band-cell${c ? ` dsc-band-cell--${c}` : ""}`, children: [
    o,
    /* @__PURE__ */ l.jsx(bb, { series: d, color: i, width: 110, height: 26 })
  ] });
}
const y2 = [
  { id: "compare", label: "All" },
  { id: "main", label: "4×8" },
  { id: "clone", label: "2×4" },
  { id: "room", label: "Room" }
];
function Rb({
  readings: a,
  onChartOpen: i
}) {
  const c = a, { focus: o, setFocus: d } = wd(), f = (h) => o === "compare" || o === h ? "dsc-gauge-row-3 is-lit" : "dsc-gauge-row-3";
  return /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Bands", icon: "gauge", children: [
    /* @__PURE__ */ l.jsx("div", { className: "dsc-tent-segment", style: { marginBottom: 10 }, children: y2.map((h) => /* @__PURE__ */ l.jsx(
      "button",
      {
        type: "button",
        className: o === h.id ? "is-active" : "",
        "data-tent": h.id === "main" ? "main" : h.id === "clone" ? "clone" : h.id === "compare" ? "compare" : "room",
        onClick: () => d(h.id),
        children: h.label
      },
      h.id
    )) }),
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-gauge-matrix dsc-gauge-matrix--bands", children: [
      /* @__PURE__ */ l.jsxs("div", { className: f("main"), children: [
        /* @__PURE__ */ l.jsx("span", { className: "dsc-gauge-row-tag", children: "4×8" }),
        /* @__PURE__ */ l.jsx(
          In,
          {
            entityId: "sensor.dsc_hub_tent_temperature",
            sparkColor: "#f97316",
            zone: "main",
            gauge: /* @__PURE__ */ l.jsx(Xe, { label: "4×8 T", value: c.tentT, min: 10, max: 40, unit: "°C", target: c.targetTemp, segments: Vu(c.targetTemp), stale: c.stale.tentT, onClick: () => i("temp") })
          }
        ),
        /* @__PURE__ */ l.jsx(
          In,
          {
            entityId: "sensor.dsc_hub_tent_humidity",
            sparkColor: "#38bdf8",
            zone: "main",
            gauge: /* @__PURE__ */ l.jsx(Xe, { label: "4×8 RH", value: c.tentRh, min: 0, max: 100, unit: "%", band: { min: c.rhMin, max: c.rhMax }, segments: Yu(c.rhMin, c.rhMax), stale: c.stale.tentRh, onClick: () => i("rh") })
          }
        ),
        /* @__PURE__ */ l.jsx(
          In,
          {
            entityId: "sensor.dsc_hub_vpd_kpa",
            sparkColor: "#a78bfa",
            zone: "main",
            gauge: /* @__PURE__ */ l.jsx(Xe, { label: "4×8 VPD", value: c.tentVpd, min: 0, max: 2.5, unit: "kPa", band: { min: c.vpdMin, max: c.vpdMax }, segments: n_(c.vpdMin, c.vpdMax), stale: c.stale.tentVpd, onClick: () => i("vpd") })
          }
        )
      ] }),
      /* @__PURE__ */ l.jsxs("div", { className: f("clone"), children: [
        /* @__PURE__ */ l.jsx("span", { className: "dsc-gauge-row-tag", children: "2×4" }),
        /* @__PURE__ */ l.jsx(
          In,
          {
            entityId: "sensor.dsc_hub_clone_temperature",
            sparkColor: "#22c55e",
            zone: "clone",
            gauge: /* @__PURE__ */ l.jsx(Xe, { label: "2×4 T", value: c.cloneT, min: 10, max: 40, unit: "°C", target: c.cloneTargetTemp, segments: Vu(c.cloneTargetTemp), stale: c.stale.cloneT, onClick: () => i("temp") })
          }
        ),
        /* @__PURE__ */ l.jsx(
          In,
          {
            entityId: "sensor.dsc_hub_clone_humidity",
            sparkColor: "#2dd4bf",
            zone: "clone",
            gauge: /* @__PURE__ */ l.jsx(Xe, { label: "2×4 RH", value: c.cloneRh, min: 0, max: 100, unit: "%", band: { min: c.cloneRhMin, max: c.cloneRhMax }, segments: Yu(c.cloneRhMin, c.cloneRhMax), stale: c.stale.cloneRh, onClick: () => i("rh") })
          }
        ),
        /* @__PURE__ */ l.jsx(
          In,
          {
            entityId: "sensor.dsc_hub_clone_vpd_kpa",
            sparkColor: "#818cf8",
            zone: "clone",
            gauge: /* @__PURE__ */ l.jsx(Xe, { label: "2×4 VPD", value: c.cloneVpd, min: 0, max: 2, unit: "kPa", band: { min: c.cloneVpdMin, max: c.cloneVpdMax }, segments: n_(c.cloneVpdMin, c.cloneVpdMax), stale: c.stale.cloneVpd, onClick: () => i("vpd") })
          }
        )
      ] }),
      /* @__PURE__ */ l.jsxs("div", { className: f("room"), children: [
        /* @__PURE__ */ l.jsx("span", { className: "dsc-gauge-row-tag", children: "Room" }),
        /* @__PURE__ */ l.jsx(
          In,
          {
            entityId: "sensor.dsc_hub_room_temperature",
            sparkColor: "#94a3b8",
            zone: "room",
            gauge: /* @__PURE__ */ l.jsx(Xe, { label: "Room T", value: c.roomT, min: 10, max: 40, unit: "°C", target: c.targetTemp, segments: Vu(c.targetTemp), stale: c.stale.roomT, onClick: () => i("temp") })
          }
        ),
        /* @__PURE__ */ l.jsx(
          In,
          {
            entityId: "sensor.dsc_hub_room_humidity",
            sparkColor: "#64748b",
            zone: "room",
            gauge: /* @__PURE__ */ l.jsx(Xe, { label: "Room RH", value: c.roomRh, min: 0, max: 100, unit: "%", band: { min: c.rhMin, max: c.rhMax }, segments: Yu(c.rhMin, c.rhMax), stale: c.stale.roomRh, onClick: () => i("rh") })
          }
        ),
        /* @__PURE__ */ l.jsx(
          In,
          {
            entityId: "sensor.dsc_coldest_root_zone_temp",
            sparkColor: "#fbbf24",
            zone: "root",
            gauge: /* @__PURE__ */ l.jsx(Xe, { label: "Root", value: c.rootT, min: 10, max: 32, unit: "°C", band: { min: c.matLo, max: c.matHi }, segments: s1(c.matLo, c.matHi), stale: c.stale.rootT, onClick: () => i("root") })
          }
        )
      ] })
    ] })
  ] });
}
function w2({ bus: a }) {
  const { num: i, state: c } = a, o = Math.round(i("sensor.dsc_humidifier_cycles_last_hour", 0)), d = o > 6 ? "bad" : o > 3 ? "warn" : "ok";
  return /* @__PURE__ */ l.jsx(re, { className: "dsc-glass", title: "Today", icon: "lighting", children: /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", children: [
    /* @__PURE__ */ l.jsx(
      D,
      {
        label: `4×8 ${i("sensor.dsc_lights_on_today_4x8", 0).toFixed(1)}h / ${Math.round(i("sensor.dsc_expected_light_hours", 12))}h`,
        tone: c("binary_sensor.dsc_hub_4x8_window_open") === "on" ? "ok" : "muted",
        onClick: () => {
        }
      }
    ),
    /* @__PURE__ */ l.jsx(
      D,
      {
        label: `2×4 ${i("sensor.dsc_lights_on_today_2x4", 0).toFixed(1)}h / ${Math.round(i("sensor.dsc_clone_expected_light_hours", 12))}h`,
        tone: c("binary_sensor.dsc_clone_dark_period_violation") === "on" ? "bad" : "ok"
      }
    ),
    /* @__PURE__ */ l.jsx(D, { label: `Heat ${i("sensor.dsc_heater_runtime_today", 0).toFixed(1)}h`, tone: c("switch.dsc_hub_heater_demand") === "on" ? "ok" : "muted" }),
    /* @__PURE__ */ l.jsx(D, { label: `Hum ${o}/h`, tone: d })
  ] }) });
}
function Ob({
  bus: a,
  rosterSlots: i,
  onNavigate: c,
  onPot: o,
  onPotChart: d
}) {
  const { state: f, num: h } = a, m = { min: 30, max: 70 };
  return /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Root & tank", icon: "root", children: [
    /* @__PURE__ */ l.jsx("div", { className: "dsc-chip-row", children: [1, 2, 3, 4].map((_) => {
      const b = f(`text.dsc_pot${_}_plant_name`, "—"), v = !b || b === "unknown" || b === "unavailable" ? "—" : b;
      return /* @__PURE__ */ l.jsx(D, { label: `P${_} ${v}`, tone: _ === 3 ? "muted" : "ok", onClick: () => o(_) }, _);
    }) }),
    i.some((_) => _.pot && _.pot !== "none") ? /* @__PURE__ */ l.jsx("div", { className: "dsc-muted", style: { fontSize: 13, margin: "8px 0" }, children: ["1", "2", "3", "4"].map((_) => {
      const b = i.find((v) => String(v.pot) === _);
      return b ? /* @__PURE__ */ l.jsxs("div", { children: [
        /* @__PURE__ */ l.jsxs("strong", { children: [
          "POT",
          _,
          " roster:"
        ] }),
        " ",
        b.nickname || b.strain || `slot ${b.slot}`,
        b.blend ? ` · ${b.blend}` : ""
      ] }, _) : null;
    }) }) : null,
    /* @__PURE__ */ l.jsx("div", { className: "dsc-gauge-matrix dsc-gauge-matrix--pots", children: [1, 2, 3, 4].map((_) => /* @__PURE__ */ l.jsx(
      Xe,
      {
        label: `P${_}`,
        value: h(`sensor.dsc_pot${_}_soil_moisture`, NaN),
        min: 0,
        max: 100,
        unit: "%",
        band: m,
        segments: l1(),
        onClick: () => d(`pot${_}`)
      },
      _
    )) }),
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", style: { marginTop: 10 }, children: [
      a.available("sensor.water_tester_ph_current") ? /* @__PURE__ */ l.jsx(D, { label: `pH ${f("sensor.water_tester_ph_current")}`, tone: "ok", onClick: () => c("/fleet") }) : null,
      /* @__PURE__ */ l.jsx(D, { label: `EC ${f("sensor.dsc_tank_ec_normalized", "—")}`, tone: "muted" }),
      a.available("sensor.water_tester_temperature") ? /* @__PURE__ */ l.jsx(
        D,
        {
          label: `${f("sensor.water_tester_temperature")}°C${h("sensor.water_tester_temperature", 0) > 24 ? " ⚠ PYTHIUM" : ""}`,
          tone: h("sensor.water_tester_temperature", 0) > 24 ? "bad" : "ok"
        }
      ) : null,
      /* @__PURE__ */ l.jsx(D, { label: "Open Root Zone", tone: "ok", onClick: () => c("/live/root") })
    ] })
  ] });
}
function zb({ bus: a }) {
  const { state: i } = a, [c, o] = y.useState([]), [d, f] = y.useState(!0);
  y.useEffect(() => {
    let m = !1;
    const _ = () => {
      ay(24, 80).then((v) => {
        m || (o(v), f(!1));
      });
    };
    _();
    const b = window.setInterval(_, 45e3);
    return () => {
      m = !0, window.clearInterval(b);
    };
  }, [i("select.dsc_hub_grow_stage"), i("switch.dsc_hub_dehumidifier_demand")]);
  const h = [
    i("select.dsc_hub_grow_stage") !== "—" ? `Stage · ${i("select.dsc_hub_grow_stage")}` : null,
    i("binary_sensor.dsc_clone_dark_period_violation") === "on" ? "Dark period violation" : null
  ].filter(Boolean);
  return /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Grow log", icon: "roster", children: [
    d && c.length === 0 ? /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", children: "Loading…" }) : null,
    c.length ? /* @__PURE__ */ l.jsx("ul", { className: "dsc-grow-log", children: c.map((m) => /* @__PURE__ */ l.jsxs("li", { children: [
      /* @__PURE__ */ l.jsx("time", { className: "dsc-muted", dateTime: new Date(m.ts * 1e3).toISOString(), children: new Date(m.ts * 1e3).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }),
      " ",
      m.message
    ] }, m.id)) }) : h.length ? /* @__PURE__ */ l.jsx("ul", { className: "dsc-grow-log", children: h.map((m) => /* @__PURE__ */ l.jsx("li", { children: m }, m)) }) : /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", children: "No operational events yet today." })
  ] });
}
function Db(a, i) {
  return vb.filter((c) => a(c) === "on" && !i(c));
}
function j2() {
  const a = Ce(), { num: i, state: c, entity: o, tick: d } = a, f = kt(), h = ht(), { isSnoozed: m } = cr(), _ = kn(), b = jb(), v = (le) => b.open({ kind: le, title: Sb[le] }), g = i("sensor.dsc_active_alert_count", 0), j = Db(c, m), w = _e("sensor.dsc_hub_tent_temperature"), S = _e("sensor.dsc_hub_tent_humidity"), E = _e("sensor.dsc_hub_vpd_kpa"), N = _e("sensor.dsc_hub_clone_temperature"), C = _e("sensor.dsc_hub_clone_humidity"), O = _e("sensor.dsc_hub_clone_vpd_kpa"), B = _e("sensor.dsc_hub_room_temperature"), J = _e("sensor.dsc_hub_room_humidity"), P = _e("sensor.dsc_coldest_root_zone_temp"), G = i("number.dsc_hub_target_temp", 25), X = i("number.dsc_hub_rh_target_min", 45), W = i("number.dsc_hub_rh_target_max", 70), se = i("number.dsc_hub_vpd_target_min", 0.8), ue = i("number.dsc_hub_vpd_target_max", 1.4), de = i("number.dsc_hub_clone_target_temp", 24), Y = i("number.dsc_hub_clone_rh_min", 55), ie = i("number.dsc_hub_clone_rh_max", 75), te = i("number.dsc_hub_clone_vpd_min", 0.6), A = i("number.dsc_hub_clone_vpd_max", 1.2), T = i("number.dsc_hub_mat_root_zone_low", 20), $ = i("number.dsc_hub_mat_root_zone_high", 24), Q = o("sensor.dsc_plant_roster_summary")?.attributes?.slots || [], ne = (le) => {
    window.dispatchEvent(new CustomEvent("dsc-dash-select-pot", { detail: { pot: le } })), h("/live/root");
  };
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-page dsc-dash-home", children: [
    /* @__PURE__ */ l.jsx(
      Nt,
      {
        icon: "home",
        title: "Overview",
        subtitle: "Operational glance — alerts, area vitals, duties, root strip, grow log.",
        primaryAction: /* @__PURE__ */ l.jsx(ce, { teal: !0, onClick: () => h("/live/climate"), children: "Climate" }),
        actions: /* @__PURE__ */ l.jsx(ce, { onClick: () => h("/live/mission"), children: "Mission" })
      }
    ),
    j.length > 0 || g > 0 ? /* @__PURE__ */ l.jsxs("div", { className: "dsc-banner dsc-banner--bad", style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ l.jsx("strong", { children: j.length > 0 ? `${j.length} critical alert(s) active` : `${g} system alert(s)` }),
      /* @__PURE__ */ l.jsx("ul", { className: "dsc-fault-list", style: { marginTop: 8 }, children: j.slice(0, 6).map((le) => /* @__PURE__ */ l.jsx("li", { children: /* @__PURE__ */ l.jsx(
        D,
        {
          label: le.split(".").pop()?.replace(/dsc_/, "").replace(/_/g, " ") || le,
          tone: "bad",
          pulse: !0,
          icon: "alert",
          onClick: () => _.open({ entityId: le, label: le, kind: "alert" })
        }
      ) }, le)) })
    ] }) : null,
    /* @__PURE__ */ l.jsx(Mb, { bus: a, onNavigate: h }),
    /* @__PURE__ */ l.jsx(
      Rb,
      {
        readings: {
          tentT: w.value,
          tentRh: S.value,
          tentVpd: E.value,
          cloneT: N.value,
          cloneRh: C.value,
          cloneVpd: O.value,
          roomT: B.value,
          roomRh: J.value,
          rootT: P.value,
          targetTemp: G,
          rhMin: X,
          rhMax: W,
          vpdMin: se,
          vpdMax: ue,
          cloneTargetTemp: de,
          cloneRhMin: Y,
          cloneRhMax: ie,
          cloneVpdMin: te,
          cloneVpdMax: A,
          matLo: T,
          matHi: $,
          stale: {
            tentT: w.stale,
            tentRh: S.stale,
            tentVpd: E.stale,
            cloneT: N.stale,
            cloneRh: C.stale,
            cloneVpd: O.stale,
            roomT: B.stale,
            roomRh: J.stale,
            rootT: P.stale
          }
        },
        onChartOpen: v
      }
    ),
    /* @__PURE__ */ l.jsx(re, { className: "dsc-glass", title: "Fan duties", icon: "fan", children: /* @__PURE__ */ l.jsx(Ab, { bus: a, onNavigate: h }) }),
    /* @__PURE__ */ l.jsx(Tb, { bus: a }),
    /* @__PURE__ */ l.jsx(
      Ob,
      {
        bus: a,
        rosterSlots: Q,
        onNavigate: h,
        onPot: ne,
        onPotChart: v
      }
    ),
    /* @__PURE__ */ l.jsx(zb, { bus: a }),
    /* @__PURE__ */ l.jsxs("p", { className: "dsc-muted", style: { fontSize: 12, marginTop: 8 }, children: [
      "Fleet ",
      f.version,
      " · expected ",
      f.expected_firmware
    ] })
  ] });
}
const b_ = [
  { id: "out", label: "OUT exhaust", prefix: "dsc_cal_cfm_out", select: "OUT" },
  { id: "recirc", label: "RECIRC", prefix: "dsc_cal_cfm_recirc", select: "RECIRC" },
  { id: "intake_main", label: "Intake 4×8", prefix: "dsc_cal_cfm_intake_main", select: "Intake Main" },
  { id: "intake_clone", label: "Intake 2×4", prefix: "dsc_cal_cfm_intake_clone", select: "Intake 2×4" }
], Aa = [25, 50, 75, 100];
function S2() {
  const { state: a, num: i } = Ce(), { callService: c } = Xt(), [o, d] = y.useState("pick"), [f, h] = y.useState(0), [m, _] = y.useState(0), [b, v] = y.useState(""), [g, j] = y.useState(!1), [w, S] = y.useState(""), E = b_[f], N = Aa[m], C = a("input_boolean.dsc_cal_active") === "on", O = a("sensor.dsc_cfm_curves_status", "—"), B = y.useCallback(() => {
    d("pick"), h(0), _(0), v(""), S("");
  }, []);
  y.useEffect(() => {
  }, [C, o, m, g]);
  const J = async () => {
    j(!0), S("Starting cal session…");
    try {
      await c("input_select", "select_option", {
        entity_id: "input_select.dsc_cal_target",
        option: E.select
      }), await c("script", "turn_on", { entity_id: "script.dsc_cal_start" }), d("session"), _(0), v(""), S(`Hold fan at ${Aa[0]}% — enter anemometer m/s.`);
    } catch (W) {
      S(W instanceof Error ? W.message : "Start failed");
    } finally {
      j(!1);
    }
  }, P = async () => {
    const W = Number(b);
    if (!Number.isFinite(W) || W <= 0) {
      S("Enter a valid m/s reading — skip rather than invent.");
      return;
    }
    j(!0), S(`Saving @${N}%…`);
    try {
      await c("input_number", "set_value", {
        entity_id: "input_number.dsc_cal_step_pct",
        value: N
      }), await c("input_number", "set_value", {
        entity_id: "input_number.dsc_cal_reading_ms",
        value: W
      }), await c("script", "turn_on", { entity_id: "script.dsc_cal_save_point" }), await c("input_number", "set_value", {
        entity_id: `input_number.${E.prefix}_${N}`,
        value: W
      });
      const se = m + 1;
      se >= Aa.length ? (await c("script", "turn_on", { entity_id: "script.dsc_cal_finish" }), d("done"), S(`Curve points saved for ${E.label}. Status: ${O}`)) : (_(se), v(""), S(`Point @${N}% saved. Hold fan at ${Aa[se]}% and measure.`), await c("script", "turn_on", { entity_id: "script.dsc_cal_hold_next" }));
    } catch (se) {
      S(se instanceof Error ? se.message : "Save failed");
    } finally {
      j(!1);
    }
  }, G = async () => {
    j(!0);
    try {
      await c("script", "turn_on", { entity_id: "script.dsc_cal_skip_point" });
      const W = m + 1;
      W >= Aa.length ? (await c("script", "turn_on", { entity_id: "script.dsc_cal_finish" }), d("done"), S("Session finished (skipped remaining).")) : (_(W), v(""), S(`Skipped @${N}%. Next: ${Aa[W]}%.`));
    } finally {
      j(!1);
    }
  }, X = async () => {
    j(!0);
    try {
      await c("script", "turn_on", { entity_id: "script.dsc_cal_abort" }), B(), S("Session aborted — fans restored.");
    } finally {
      j(!1);
    }
  };
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ l.jsx(
      Nt,
      {
        icon: "learning",
        title: "Calibrate CFM",
        subtitle: "Anemometer wizard — 25/50/75/100% steps per duct. No invented points."
      }
    ),
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-status-strip", children: [
      /* @__PURE__ */ l.jsx(D, { label: `Curves ${O}`, tone: O === "all_curves" ? "ok" : "warn" }),
      /* @__PURE__ */ l.jsx(D, { label: C ? "SESSION ON" : "Session idle", tone: C ? "ok" : "muted" }),
      o === "session" ? /* @__PURE__ */ l.jsx(D, { label: `Step ${m + 1}/${Aa.length} · ${N}%`, tone: "ok", pulse: !0 }) : null
    ] }),
    o === "pick" ? /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "1 · Select duct", icon: "fan", children: [
      /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", children: "Per docs/ANEMOMETER-CFM: hold anemometer centerline at each fan step. Need ≥2 points per duct to leave nameplate mode." }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-chip-row", style: { margin: "12px 0" }, children: b_.map((W, se) => /* @__PURE__ */ l.jsx(
        "button",
        {
          type: "button",
          className: `dsc-chip${f === se ? " dsc-chip--ok" : ""}`,
          onClick: () => h(se),
          children: W.label
        },
        W.id
      )) }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-row-actions", children: /* @__PURE__ */ l.jsxs(ce, { primary: !0, disabled: g, onClick: () => void J(), children: [
        "Start ",
        E.label,
        " session"
      ] }) })
    ] }) : null,
    o === "session" ? /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: `2 · Sample ${E.label} @ ${N}%`, icon: "gauge", children: [
      /* @__PURE__ */ l.jsxs("p", { className: "dsc-honesty", children: [
        "Set fan to ",
        N,
        "% via hub/control. Hold anemometer in duct centerline. Enter measured m/s — CFM is computed by scripts."
      ] }),
      /* @__PURE__ */ l.jsxs("label", { children: [
        "Anemometer m/s @ ",
        N,
        "%",
        /* @__PURE__ */ l.jsx(
          "input",
          {
            type: "number",
            step: "0.01",
            min: "0",
            value: b,
            onChange: (W) => v(W.target.value),
            placeholder: i("input_number.dsc_cal_reading_ms", 0) > 0 ? String(i("input_number.dsc_cal_reading_ms")) : "e.g. 3.2"
          }
        )
      ] }),
      /* @__PURE__ */ l.jsxs("p", { className: "dsc-kpi-sub", children: [
        "Stored helpers: input_number.",
        E.prefix,
        "_",
        N
      ] }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-stage-track", children: Aa.map((W, se) => /* @__PURE__ */ l.jsxs("span", { className: `dsc-stage-pill${se === m ? " is-on" : se > m ? "" : " is-next"}`, children: [
        W,
        "%"
      ] }, W)) }),
      /* @__PURE__ */ l.jsxs("div", { className: "dsc-row-actions", children: [
        /* @__PURE__ */ l.jsxs(ce, { primary: !0, disabled: g, onClick: () => void P(), children: [
          "Save @ ",
          N,
          "%"
        ] }),
        /* @__PURE__ */ l.jsx(ce, { disabled: g, onClick: () => void G(), children: "Skip step" }),
        /* @__PURE__ */ l.jsx(ce, { disabled: g, onClick: () => void X(), children: "Abort" })
      ] })
    ] }) : null,
    o === "done" ? /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "3 · Done", icon: "ok", children: [
      /* @__PURE__ */ l.jsx("p", { className: "dsc-honesty", children: w || "Session complete." }),
      /* @__PURE__ */ l.jsxs("p", { className: "dsc-muted", children: [
        "Curve status: ",
        O,
        ". Allocated CFM on Climate uses curve when hub fans online."
      ] }),
      /* @__PURE__ */ l.jsx("div", { className: "dsc-row-actions", children: /* @__PURE__ */ l.jsx(ce, { primary: !0, onClick: B, children: "Calibrate another duct" }) })
    ] }) : null,
    w && o !== "done" ? /* @__PURE__ */ l.jsx("p", { className: "dsc-honesty", children: w }) : null
  ] });
}
function g_({
  tag: a,
  config: i
}) {
  const c = y.useRef(null), { hass: o, tick: d } = ii(), [f, h] = y.useState("loading"), m = y.useRef(
    null
  ), _ = y.useRef(i);
  return _.current = i, y.useEffect(() => {
    const b = c.current;
    if (!b) return;
    let v = !1;
    const g = _.current ?? {};
    return (async () => {
      h("loading"), b.innerHTML = "";
      const j = await J_(a);
      if (v || !c.current) return;
      if (!j) {
        h("missing");
        const S = document.createElement("div");
        S.className = "dsc-empty";
        const E = Ty(a).join(", ");
        S.innerHTML = `<strong>${a}</strong> did not register.<br/>Tried ${E}. Deploy the card IIFE under /config/www (or add a Lovelace resource), then hard-refresh.`, b.appendChild(S);
        return;
      }
      const w = document.createElement(a);
      typeof w.setConfig == "function" && w.setConfig({ type: `custom:${a}`, ...g }), o && (w.hass = o), b.appendChild(w), m.current = w, h("ready");
    })(), () => {
      v = !0, m.current = null, b.innerHTML = "";
    };
  }, [a]), y.useEffect(() => {
    m.current && o && (m.current.hass = o);
  }, [o, d]), /* @__PURE__ */ l.jsx(
    "div",
    {
      className: `dsc-legacy-host${f === "missing" ? " dsc-legacy-host--empty" : ""}`,
      ref: c,
      "data-status": f
    }
  );
}
function Lc(a) {
  return Number.isFinite(a.value) ? `${Math.round(a.value)} CFM` : "—";
}
function k2(a) {
  return a("sensor.dsc_hub_room_vpd_kpa") ? "sensor.dsc_hub_room_vpd_kpa" : a("sensor.dsc_hub_room_vpd") ? "sensor.dsc_hub_room_vpd" : "sensor.dsc_hub_room_vpd_kpa";
}
function N2() {
  const a = Ce(), { available: i, num: c, state: o, entity: d, tick: f } = a, h = kt(), m = ht(), _ = Nb(), { isSnoozed: b } = cr(), v = kn(), g = jb(), j = (Ae) => g.open({ kind: Ae, title: Sb[Ae] });
  lb(), ib(), cb();
  const w = h.hub.online || _("sensor.dsc_hub_uptime"), S = c("sensor.dsc_hub_uptime", h.hub.values.uptime != null ? Number(h.hub.values.uptime) : 0), E = c("sensor.dsc_active_alert_count", 0), N = o("sensor.dsc_fleet_version_status", "ok"), C = String(d("sensor.dsc_fleet_version_status")?.attributes?.expected || h.expected_firmware || "7.0.0"), O = o("binary_sensor.dsc_cannalib_api_online") === "on", B = c("sensor.dsc_cannalib_api_hits", 0), J = o("sensor.dsc_cannalib_bandwidth_summary", "— MB"), P = h.panel.online ? "on" : o("binary_sensor.dsc_hub_panel_link"), G = h.panel.online || P === "on", X = _("binary_sensor.dsc_hub_panel_link") || G, W = !G && i("sensor.dsc_control_wifi_rssi"), se = !G && !W && !X, ue = h.hub.values.heartbeat != null ? String(h.hub.values.heartbeat) : o("sensor.dsc_hub_heartbeat", "NO BEAT"), de = h.hub.online && h.hub.values.heartbeat != null ? !0 : _("sensor.dsc_hub_heartbeat"), Y = _e("sensor.dsc_hub_tent_temperature"), ie = _e("sensor.dsc_hub_tent_humidity"), te = _e("sensor.dsc_hub_vpd_kpa"), A = _e("sensor.dsc_hub_clone_temperature"), T = _e("sensor.dsc_hub_clone_humidity"), $ = _e("sensor.dsc_hub_clone_vpd_kpa"), Q = _e("sensor.dsc_hub_room_temperature"), ne = _e("sensor.dsc_hub_room_humidity"), le = k2(d);
  _e(le);
  const k = _e("sensor.dsc_coldest_root_zone_temp"), F = c("number.dsc_hub_target_temp", 25), I = c("number.dsc_hub_rh_target_min", 45), ae = c("number.dsc_hub_rh_target_max", 70), me = c("number.dsc_hub_vpd_target_min", 0.8), he = c("number.dsc_hub_vpd_target_max", 1.4), ge = c("number.dsc_hub_clone_target_temp", 24), Le = c("number.dsc_hub_clone_rh_min", 55), Se = c("number.dsc_hub_clone_rh_max", 75), lt = c("number.dsc_hub_clone_vpd_min", 0.6), pt = c("number.dsc_hub_clone_vpd_max", 1.2), je = c("number.dsc_hub_mat_root_zone_low", 20), it = c("number.dsc_hub_mat_root_zone_high", 24), ee = ft("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", { available: i, num: c }), $e = ft("sensor.dsc_cfm_exhaust_recirc_allocated", "sensor.dsc_cfm_exhaust_recirc", { available: i, num: c }), We = ft("sensor.dsc_cfm_intake_main", "sensor.dsc_cfm_intake_main", { available: i, num: c }), _t = ft("sensor.dsc_cfm_intake_2x4", "sensor.dsc_cfm_intake_2x4", { available: i, num: c }), Ie = [ee, $e, We, _t], Re = Sd(h), Dt = kd(Re), Ht = d("sensor.dsc_plant_roster_summary")?.attributes?.slots || [], an = o("sensor.dsc_plant_roster_summary", "—"), Qt = Db(o, b), nt = (Ae) => v.open({
    entityId: Ae.entityId,
    label: Ae.label,
    kind: "kit",
    runtimeToday: Ae.runtimeToday,
    cyclesToday: Ae.cyclesToday,
    demandEntity: Ae.demandEntity
  }), ll = (Ae) => {
    window.dispatchEvent(new CustomEvent("dsc-dash-select-pot", { detail: { pot: Ae } })), m("/live/root");
  };
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-page dsc-dash-home", children: [
    /* @__PURE__ */ l.jsx(
      Nt,
      {
        icon: "home",
        title: "Home",
        subtitle: "Operational dash — same story as the HA Home view, native on Pi.",
        primaryAction: /* @__PURE__ */ l.jsx(ce, { teal: !0, onClick: () => m("/live/twin"), children: "Open Twin" }),
        actions: /* @__PURE__ */ l.jsx(ce, { onClick: () => m("/live/climate"), children: "Climate" })
      }
    ),
    /* @__PURE__ */ l.jsx(
      b2,
      {
        hubOnline: w,
        panelOk: G,
        panelHaOnly: W,
        panelOffline: se,
        heartbeat: ue,
        beatOk: de,
        uptimeSec: S,
        alerts: E,
        fleetStatus: N,
        fleetExpected: C,
        cannalibOnline: O,
        cannalibHits: B,
        cannalibSummary: J,
        inServiceLabel: `${Dt.inService} of ${Dt.total} in service`,
        activeFaultCount: Qt.length,
        onChip: (Ae, os) => v.open({ entityId: Ae, label: os, kind: Ae.includes("alert") ? "alert" : "kit" })
      }
    ),
    /* @__PURE__ */ l.jsx(g2, { bus: a }),
    /* @__PURE__ */ l.jsx(Mb, { bus: a, onNavigate: m }),
    Qt.length > 0 ? /* @__PURE__ */ l.jsx(re, { className: "dsc-glass", title: "Active system alerts", icon: "alert", children: /* @__PURE__ */ l.jsx("ul", { className: "dsc-fault-list", children: Qt.map((Ae) => /* @__PURE__ */ l.jsx("li", { children: /* @__PURE__ */ l.jsx(ce, { onClick: () => v.open({ entityId: Ae, label: Ae, kind: "alert" }), children: Ae.split(".").pop()?.replace(/dsc_/, "").replace(/_/g, " ") }) }, Ae)) }) }) : null,
    /* @__PURE__ */ l.jsx(v2, { bus: a, onNavigate: m }),
    /* @__PURE__ */ l.jsx(jd, {}),
    /* @__PURE__ */ l.jsx(re, { className: "dsc-glass", title: "System map", icon: "fleet", children: /* @__PURE__ */ l.jsx(g_, { tag: "dsc-system-map-card" }) }),
    /* @__PURE__ */ l.jsx(Tb, { bus: a }),
    /* @__PURE__ */ l.jsx(Ab, { bus: a, onNavigate: m }),
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-grid dsc-grid--2", children: [
      /* @__PURE__ */ l.jsx(zb, { bus: a }),
      /* @__PURE__ */ l.jsxs("details", { className: "dsc-narrator", children: [
        /* @__PURE__ */ l.jsx("summary", { children: "System narrator" }),
        /* @__PURE__ */ l.jsxs("div", { className: "dsc-muted", style: { fontSize: 13, lineHeight: 1.55, padding: "8px 0" }, children: [
          /* @__PURE__ */ l.jsxs("p", { children: [
            /* @__PURE__ */ l.jsx("strong", { children: "Hub:" }),
            " ",
            w ? "online" : "offline",
            " · uptime ",
            Eb(S),
            " · beat ",
            ue
          ] }),
          /* @__PURE__ */ l.jsxs("p", { children: [
            /* @__PURE__ */ l.jsx("strong", { children: "Climate:" }),
            " 4×8 ",
            Number.isFinite(Y.value) ? `${Y.value.toFixed(1)}°C` : "—",
            " /",
            " ",
            Number.isFinite(ie.value) ? `${ie.value.toFixed(0)}%` : "—",
            " RH · 2×4",
            " ",
            Number.isFinite(A.value) ? `${A.value.toFixed(1)}°C` : "—",
            " /",
            " ",
            Number.isFinite(T.value) ? `${T.value.toFixed(0)}%` : "—",
            " RH"
          ] }),
          /* @__PURE__ */ l.jsxs("p", { children: [
            /* @__PURE__ */ l.jsx("strong", { children: "Airflow:" }),
            " OUT ",
            Math.round(c("sensor.dsc_fan_exhaust_outside_pct", 0)),
            "% · RECIRC",
            " ",
            Math.round(c("sensor.dsc_fan_exhaust_room_pct", 0)),
            "% · intakes",
            " ",
            Math.round(c("sensor.dsc_fan_intake_main_pct", 0)),
            "/",
            Math.round(c("sensor.dsc_fan_intake_2x4_pct", 0)),
            "%"
          ] }),
          Qt.length > 0 ? /* @__PURE__ */ l.jsxs("p", { children: [
            /* @__PURE__ */ l.jsx("strong", { children: "Watchlist:" }),
            " ",
            Qt.length,
            " active alert(s)."
          ] }) : null
        ] })
      ] })
    ] }),
    /* @__PURE__ */ l.jsx(x2, { bus: a, onNavigate: m }),
    /* @__PURE__ */ l.jsx(
      Rb,
      {
        readings: {
          tentT: Y.value,
          tentRh: ie.value,
          tentVpd: te.value,
          cloneT: A.value,
          cloneRh: T.value,
          cloneVpd: $.value,
          roomT: Q.value,
          roomRh: ne.value,
          rootT: k.value,
          targetTemp: F,
          rhMin: I,
          rhMax: ae,
          vpdMin: me,
          vpdMax: he,
          cloneTargetTemp: ge,
          cloneRhMin: Le,
          cloneRhMax: Se,
          cloneVpdMin: lt,
          cloneVpdMax: pt,
          matLo: je,
          matHi: it,
          stale: {
            tentT: Y.stale,
            tentRh: ie.stale,
            tentVpd: te.stale,
            cloneT: A.stale,
            cloneRh: T.stale,
            cloneVpd: $.stale,
            roomT: Q.stale,
            roomRh: ne.stale,
            rootT: k.stale
          }
        },
        onChartOpen: j
      }
    ),
    /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Lung · CFM", icon: "climate", children: [
      /* @__PURE__ */ l.jsx(ur, { readings: Ie }),
      /* @__PURE__ */ l.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ l.jsx(St, { label: "Out alloc", value: Lc(ee).replace(" CFM", ""), unit: "CFM" }),
        /* @__PURE__ */ l.jsx(St, { label: "Recirc alloc", value: Lc($e).replace(" CFM", ""), unit: "CFM" }),
        /* @__PURE__ */ l.jsx(St, { label: "Intake 4×8", value: Lc(We).replace(" CFM", ""), unit: "CFM" }),
        /* @__PURE__ */ l.jsx(St, { label: "Intake 2×4", value: Lc(_t).replace(" CFM", ""), unit: "CFM" })
      ] }),
      /* @__PURE__ */ l.jsx(g_, { tag: "dsc-airflow-map-card" })
    ] }),
    /* @__PURE__ */ l.jsx(w2, { bus: a }),
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-grid dsc-grid--2", children: [
      /* @__PURE__ */ l.jsxs(re, { className: "dsc-glass", title: "Plant roster", icon: "roster", children: [
        /* @__PURE__ */ l.jsx("p", { className: "dsc-muted", children: an }),
        Array.isArray(Ht) && Ht.length > 0 ? /* @__PURE__ */ l.jsx("ul", { className: "dsc-roster-list", children: Ht.slice(0, 8).map((Ae) => /* @__PURE__ */ l.jsxs("li", { children: [
          /* @__PURE__ */ l.jsx("strong", { children: Ae.nickname || Ae.strain || `Slot ${Ae.slot}` }),
          /* @__PURE__ */ l.jsxs("span", { className: "dsc-muted", children: [
            " ",
            "· ",
            Ae.pot && Ae.pot !== "none" ? `P${Ae.pot}` : "stock",
            " · ",
            Ae.status || "—",
            Ae.blend ? ` · ${Ae.blend}` : ""
          ] })
        ] }, Ae.slot)) }) : /* @__PURE__ */ l.jsx("p", { className: "dsc-honesty", children: "No occupied roster slots." })
      ] }),
      /* @__PURE__ */ l.jsx(re, { className: "dsc-glass", title: "Kit pulse", icon: "fleet", children: /* @__PURE__ */ l.jsx(Nd, { nodes: Re, onSelect: nt }) })
    ] }),
    /* @__PURE__ */ l.jsx(Ob, { bus: a, rosterSlots: Ht, onNavigate: m, onPot: ll, onPotChart: j })
  ] });
}
const C2 = [
  { id: "live", label: "Live", path: "/live/overview", icon: "live" },
  { id: "grow", label: "Grow", path: "/grow/compose", icon: "grow" },
  { id: "tune", label: "Tune", path: "/tune/learning", icon: "tune" },
  { id: "fleet", label: "Fleet", path: "/fleet", icon: "fleet" }
], E2 = {
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
}, M2 = {
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
function T2(a) {
  return a.startsWith("/grow") || a.startsWith("/plant") ? "grow" : a.startsWith("/tune") || a.startsWith("/advanced") ? "tune" : a.startsWith("/fleet") || a.startsWith("/system") ? "fleet" : (a.startsWith("/ops"), "live");
}
function A2(a, i) {
  const c = M2[a];
  return c ? c.includes("?") ? c : `${c}${i || ""}` : null;
}
const R2 = ':host,.dsc-root{--dsc-black: #0b0e14;--dsc-black-2: #12171f;--dsc-gray-1: #12171f;--dsc-gray-2: #1a2230;--dsc-gray-3: #243044;--dsc-gray-4: #8b95a8;--dsc-gray-5: #8b95a8;--dsc-blue: #26c6da;--dsc-blue-dim: rgba(38, 198, 218, .4);--dsc-purple: #a78bfa;--dsc-purple-dim: rgba(167, 139, 250, .35);--dsc-neon: #66bb6a;--dsc-neon-dim: rgba(102, 187, 106, .32);--dsc-neon-glow: rgba(0, 230, 118, .4);--dsc-teal: #26c6da;--dsc-teal-dim: rgba(38, 198, 218, .45);--dsc-teal-glow: rgba(38, 198, 218, .55);--dsc-orange: #ff8a65;--dsc-amber: #ffb74d;--dsc-bad: #ef5350;--dsc-bad-soft: #ef5350;--dsc-soil-1: #5b9f6b;--dsc-soil-2: #4a8f9f;--dsc-soil-3: #c4a35a;--dsc-soil-4: #8d6e63;--dsc-glass: rgba(18, 23, 31, .78);--dsc-glass-border: rgba(36, 48, 68, .55);--dsc-white: #e8eef8;--dsc-shadow: 0 8px 24px rgba(0, 0, 0, .45);--dsc-shadow-tight: 0 2px 8px rgba(0, 0, 0, .55);--dsc-radius: 10px;--dsc-radius-lg: 14px;--dsc-font: "Segoe UI", "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;--dsc-mono: "Cascadia Code", "IBM Plex Mono", ui-monospace, monospace;color:var(--dsc-white);background:var(--dsc-black);font-family:var(--dsc-font);display:block;height:100%;box-sizing:border-box}*,*:before,*:after{box-sizing:border-box}.dsc-root{height:100%;min-height:100%;overflow:auto;background:radial-gradient(1100px 560px at 8% -12%,rgba(38,198,218,.12),transparent 55%),radial-gradient(900px 520px at 92% -8%,rgba(38,198,218,.08),transparent 50%),radial-gradient(700px 420px at 70% 100%,rgba(102,187,106,.04),transparent 55%),var(--dsc-black)}.dsc-honesty-rail{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}.dsc-next-rec{border-color:var(--dsc-blue-dim)}.dsc-twin-keepalive{position:fixed;inset:0;visibility:hidden;pointer-events:none;z-index:-1;overflow:hidden;margin:0;min-height:0}.dsc-twin-keepalive.is-active{position:relative;inset:auto;visibility:visible;pointer-events:auto;z-index:auto;overflow:visible;margin-bottom:12px;min-height:min(70vh,720px)}.dsc-twin-keepalive:not(.is-active),.dsc-twin-keepalive:not(.is-active) *{pointer-events:none!important}.dsc-twin-keepalive-host{min-height:min(68vh,700px)}.dsc-twin-keepalive.is-active .dsc-twin-keepalive-host,.dsc-twin-keepalive.is-active .dsc-twin-keepalive-host>*{min-height:min(68vh,700px);pointer-events:auto}.dsc-tab--live.active{color:var(--dsc-blue);border-color:var(--dsc-blue-dim)}.dsc-tab--grow.active{color:var(--dsc-teal);border-color:var(--dsc-teal-dim)}.dsc-tab--tune.active{color:var(--dsc-purple);border-color:var(--dsc-purple-dim)}.dsc-tab--fleet.active{color:var(--dsc-blue);border-color:var(--dsc-blue-dim)}.dsc-secondary-tabs .dsc-tab.active{color:var(--dsc-teal);border-color:var(--dsc-teal-dim);box-shadow:0 0 0 1px var(--dsc-blue-dim)}.dsc-tent-segment{display:inline-flex;gap:4px;padding:3px;border-radius:999px;background:var(--dsc-gray-1);border:1px solid var(--dsc-glass-border)}.dsc-tent-segment button{appearance:none;border:0;background:transparent;color:var(--dsc-gray-5);padding:6px 12px;border-radius:999px;cursor:pointer;font:inherit;font-size:.85rem}.dsc-tent-segment button.is-active{background:var(--dsc-gray-2);color:var(--dsc-white);box-shadow:var(--dsc-shadow-tight)}.dsc-tent-segment button[data-tent=main].is-active{color:var(--dsc-blue)}.dsc-tent-segment button[data-tent=clone].is-active{color:var(--dsc-purple)}.dsc-tent-segment button[data-tent=compare].is-active{color:var(--dsc-teal)}.dsc-shell{display:flex;flex-direction:column;min-height:100%;max-width:1600px;margin:0 auto;padding:16px 20px 28px}.dsc-brand-row{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:10px}.dsc-brand{display:flex;align-items:center;gap:12px;color:var(--dsc-white);text-decoration:none}.dsc-brand img,.dsc-brand svg{width:36px;height:36px;color:var(--dsc-neon)}.dsc-brand-title{display:flex;flex-direction:column;gap:2px}.dsc-brand-title strong{font-size:1.05rem;letter-spacing:.04em;font-weight:700;line-height:1.25;max-width:min(52vw,28rem)}.dsc-brand-wordmark{height:18px;width:auto;max-width:160px;display:block;color:var(--dsc-text, #eef1f8);line-height:0}.dsc-brand-wordmark svg{width:auto;height:18px;display:block}.dsc-icon svg{width:100%;height:100%;display:block}.dsc-brand-title span{font-size:.72rem;color:var(--dsc-gray-5);letter-spacing:.08em;text-transform:uppercase}.dsc-page-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px}.dsc-page-header-main{display:flex;align-items:flex-start;gap:10px}.dsc-page-header-actions{display:flex;align-items:center;gap:6px;flex-shrink:0}.dsc-card-title{display:inline-flex;align-items:center;gap:8px}.dsc-primary-tabs,.dsc-secondary-tabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:thin;padding-bottom:2px;-webkit-overflow-scrolling:touch}.dsc-primary-tabs{border-bottom:1px solid var(--dsc-gray-3);margin-bottom:8px}.dsc-secondary-tabs{margin-bottom:16px;mask-image:linear-gradient(90deg,#000 85%,transparent)}.dsc-secondary-tabs:after{content:"";flex:0 0 12px}.dsc-tab{appearance:none;border:1px solid transparent;background:transparent;color:var(--dsc-gray-5);padding:10px 14px;min-height:44px;border-radius:8px 8px 0 0;cursor:pointer;font:inherit;font-size:.92rem;letter-spacing:.04em;white-space:nowrap;display:inline-flex;align-items:center;gap:8px;transition:transform .1s ease,box-shadow .1s ease,color .15s ease,border-color .15s ease,background .15s ease;text-decoration:none}.dsc-tab span[role=img]{opacity:.9;flex-shrink:0}.dsc-tab:hover{color:var(--dsc-white);background:var(--dsc-gray-1)}.dsc-tab:focus-visible{outline:2px solid var(--dsc-neon);outline-offset:2px}.dsc-tab.active{color:var(--dsc-white);border-bottom:2px solid var(--dsc-neon);box-shadow:0 6px 18px #39ff1414}.dsc-secondary-tabs .dsc-tab{border-radius:999px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-1);min-height:40px;padding:8px 14px}.dsc-secondary-tabs .dsc-tab.active{border-color:var(--dsc-neon-dim);color:var(--dsc-neon);background:#39ff1414;box-shadow:var(--dsc-shadow-tight)}.dsc-btn{appearance:none;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);border-radius:8px;padding:10px 16px;min-height:40px;font:inherit;cursor:pointer;box-shadow:var(--dsc-shadow-tight);transition:transform .1s ease,box-shadow .1s ease,border-color .12s ease,background .12s ease}.dsc-btn:hover{border-color:var(--dsc-neon-dim)}.dsc-btn:active,.dsc-tab:active{transform:translateY(1px);box-shadow:0 1px 3px #000000a6}.dsc-btn.primary{border-color:var(--dsc-neon-dim);color:var(--dsc-black);background:var(--dsc-neon);font-weight:650}.dsc-page{animation:dsc-fade .18s ease}@keyframes dsc-fade{0%{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.dsc-page,.dsc-btn,.dsc-tab,.dsc-live-pulse{animation:none!important;transition:none!important}}.dsc-grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:14px}.dsc-col-3{grid-column:span 3}.dsc-col-4{grid-column:span 4}.dsc-col-6{grid-column:span 6}.dsc-col-8{grid-column:span 8}.dsc-col-12{grid-column:span 12}@media(max-width:1100px){.dsc-col-3,.dsc-col-4{grid-column:span 6}.dsc-col-8{grid-column:span 12}}@media(max-width:720px){.dsc-shell{padding:12px}.dsc-col-3,.dsc-col-4,.dsc-col-6,.dsc-col-8{grid-column:span 12}}.dsc-card{background:linear-gradient(165deg,var(--dsc-gray-1),var(--dsc-black-2));border:1px solid var(--dsc-gray-3);border-radius:var(--dsc-radius);box-shadow:var(--dsc-shadow);padding:14px 16px;min-height:88px}.dsc-card h2,.dsc-card h3{margin:0 0 8px;font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;color:var(--dsc-gray-5);font-weight:600}.dsc-kpi-value{font-size:1.85rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:.02em;color:var(--dsc-white)}.dsc-kpi-unit{margin-left:6px;font-size:.85rem;color:var(--dsc-gray-5)}.dsc-kpi-sub{margin-top:6px;color:var(--dsc-gray-5);font-size:.82rem}.dsc-status-ok{color:var(--dsc-neon)}.dsc-status-warn{color:var(--dsc-amber)}.dsc-status-bad{color:var(--dsc-bad)}.dsc-status-muted{color:var(--dsc-gray-5)}.dsc-page-title{margin:0 0 14px;font-size:1.35rem;letter-spacing:.04em}.dsc-muted{color:var(--dsc-gray-5)}.dsc-legacy-host{min-height:420px;border-radius:var(--dsc-radius);overflow:hidden;border:1px solid var(--dsc-gray-3);background:#000}.dsc-legacy-host--empty{background:var(--dsc-gray-1);min-height:160px}.dsc-legacy-host>*{display:block;width:100%}.dsc-status-strip{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}.dsc-chip-row{display:flex;flex-wrap:wrap;gap:8px}.dsc-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-1);font-size:.75rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-chip--ok{color:var(--dsc-neon);border-color:var(--dsc-neon-dim);background:#39ff1414;box-shadow:0 0 12px #39ff141f}.dsc-chip--bad{color:var(--dsc-bad-soft);border-color:color-mix(in srgb,var(--dsc-bad) 45%,transparent);background:color-mix(in srgb,var(--dsc-bad) 12%,transparent)}.dsc-chip--warn{color:var(--dsc-amber);border-color:color-mix(in srgb,var(--dsc-amber) 45%,transparent);background:color-mix(in srgb,var(--dsc-amber) 12%,transparent)}.dsc-chip--muted{color:var(--dsc-gray-5)}.dsc-chip--pulse{animation:dsc-chip-pulse 1.6s ease-in-out infinite}.dsc-chip--duty{animation:dsc-duty-pulse 1.8s ease-in-out infinite}.dsc-chip--breathe{animation:dsc-chip-breathe 2.4s ease-in-out infinite}.dsc-chip--fan{animation:dsc-chip-fan 1.3s linear infinite}@keyframes dsc-chip-pulse{0%,to{box-shadow:0 0 #39ff1400}50%{box-shadow:0 0 14px #39ff1459}}@keyframes dsc-duty-pulse{0%,to{box-shadow:0 0 #3dde7a0d;border-color:var(--dsc-neon-dim)}50%{box-shadow:0 0 16px #3dde7a52;border-color:var(--dsc-neon)}}@keyframes dsc-chip-breathe{0%,to{box-shadow:0 0 #ffb74d0d}50%{box-shadow:0 0 14px #ffb74d61}}@keyframes dsc-chip-fan{0%{box-shadow:0 0 #2ec4d60d}50%{box-shadow:0 0 12px #2ec4d66b}to{box-shadow:0 0 #2ec4d60d}}.dsc-demand-row{display:flex;flex-wrap:wrap;gap:8px}.dsc-demand-row--stack{flex-direction:column}.dsc-demand{appearance:none;flex:1 1 110px;min-height:52px;padding:10px 12px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);font:inherit;cursor:pointer;display:flex;flex-direction:column;align-items:flex-start;gap:4px;box-shadow:var(--dsc-shadow-tight);transition:transform .1s ease,box-shadow .1s ease,border-color .12s ease,background .12s ease}.dsc-demand:hover{border-color:var(--dsc-neon-dim)}.dsc-demand:active{transform:translateY(1px);box-shadow:0 1px 3px #000000a6}.dsc-demand.is-on{border-color:var(--dsc-neon);background:#39ff141a;box-shadow:0 0 0 1px #39ff1440,0 0 18px #39ff1433}.dsc-demand.is-missing{opacity:.55;cursor:not-allowed}.dsc-demand-label{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-demand.is-on .dsc-demand-label{color:var(--dsc-neon)}.dsc-demand-state{font-weight:700;font-variant-numeric:tabular-nums;font-size:1rem}.dsc-demand-icon{margin-bottom:4px;opacity:.95}.dsc-mode-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}.dsc-mode-selects{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}.dsc-entity-select{display:flex;flex-direction:column;gap:6px;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-entity-select-label{display:inline-flex;align-items:center;gap:6px}.dsc-entity-select select{appearance:none;min-height:40px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);padding:8px 12px;font:inherit;text-transform:none;letter-spacing:0}.dsc-entity-select.is-disabled{opacity:.55}.dsc-fan-stack{display:flex;flex-direction:column;gap:10px}.dsc-fan-slider{display:flex;flex-direction:column;gap:4px}.dsc-fan-slider-label{display:flex;align-items:baseline;gap:8px;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-fan-slider-label strong{color:var(--dsc-teal);font-variant-numeric:tabular-nums}.dsc-fan-slider input[type=range]{width:100%;accent-color:var(--dsc-teal)}.dsc-fan-slider.is-disabled{opacity:.5}.dsc-honesty{margin:10px 0 0;font-size:.85rem;color:var(--dsc-gray-5);display:flex;flex-wrap:wrap;align-items:center;gap:8px}.dsc-target-panel{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}.dsc-target-panel.is-compact .dsc-target-grid{grid-template-columns:repeat(auto-fit,minmax(90px,1fr))}.dsc-tent-targets{border:1px solid var(--dsc-glass-border);border-radius:var(--dsc-radius);padding:10px 12px;background:#0000002e}.dsc-tent-targets-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}.dsc-got-want{display:flex;flex-direction:column;gap:2px;font-size:.82rem;margin-bottom:10px}.dsc-target-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px}.dsc-target-num{display:flex;flex-direction:column;gap:4px;font-size:.7rem;letter-spacing:.06em;color:var(--dsc-gray-5)}.dsc-target-num-label{text-transform:uppercase}.dsc-target-num input,.dsc-target-num textarea{min-height:36px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);padding:6px 8px;font:inherit;font-variant-numeric:tabular-nums}.dsc-target-num textarea{text-transform:none;letter-spacing:0;min-height:56px;resize:vertical}.dsc-target-num.is-disabled{opacity:.55}.dsc-chart{position:relative}.dsc-chart-svg{cursor:crosshair;touch-action:none}.dsc-chart-tooltip{position:absolute;top:8px;transform:translate(-50%);pointer-events:none;z-index:2;min-width:120px;padding:8px 10px;border-radius:8px;border:1px solid var(--dsc-glass-border);background:var(--dsc-glass);backdrop-filter:blur(10px);box-shadow:var(--dsc-shadow-tight);font-size:.75rem}.dsc-chart-tooltip-time{color:var(--dsc-teal);font-family:var(--dsc-mono);margin-bottom:4px}.dsc-chart-tooltip-row{display:flex;align-items:center;gap:6px;color:var(--dsc-white)}.dsc-chart-tooltip-row i{width:7px;height:7px;border-radius:50%;display:inline-block}@keyframes dsc-sync-pulse{0%{stroke-dashoffset:1;opacity:.2}35%{opacity:1}to{stroke-dashoffset:0;opacity:0}}@media(prefers-reduced-motion:reduce){.dsc-chart-pulse{animation:none!important;opacity:.85}.dsc-gauge-value,.dsc-chip--pulse,.dsc-chip--duty,.dsc-chip--breathe,.dsc-chip--fan,.dsc-fan-spin,.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-warn),.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-bad){animation:none!important}}.dsc-gauge.is-warn .dsc-gauge-label{color:var(--dsc-amber)}.dsc-gauge.is-bad .dsc-gauge-label{color:var(--dsc-bad-soft)}.dsc-gauge.is-ok:not(.is-stale) .dsc-gauge-value{animation:dsc-gauge-live 3.2s ease-in-out infinite}.dsc-gauge.is-warn .dsc-gauge-value,.dsc-gauge.is-bad .dsc-gauge-value{animation:dsc-gauge-breathe 2.4s ease-in-out infinite}@keyframes dsc-gauge-live{0%,to{opacity:.92;filter:drop-shadow(0 0 4px rgba(46,196,214,.25))}50%{opacity:1;filter:drop-shadow(0 0 10px rgba(46,196,214,.55))}}@keyframes dsc-gauge-breathe{0%,to{opacity:.88;filter:drop-shadow(0 0 4px rgba(255,183,77,.25))}50%{opacity:1;filter:drop-shadow(0 0 12px rgba(255,107,138,.55))}}.dsc-gauge-row{display:flex;justify-content:space-around;flex-wrap:wrap;gap:8px}.dsc-gauge-matrix{display:flex;flex-direction:column;gap:8px}.dsc-gauge-row-3{display:grid;grid-template-columns:14px repeat(3,minmax(0,1fr));align-items:center;gap:2px 4px;border:1px solid transparent;border-radius:12px;padding:2px 4px 4px;transition:box-shadow .25s ease,border-color .25s ease,background .25s ease}.dsc-gauge-row-3.is-lit{border-color:#ffd54f80;background:linear-gradient(180deg,#ffc1071a,#0c121c59);box-shadow:0 0 28px #ffc10747,inset 0 0 16px #ffd54f12}.dsc-gauge-row-tag{font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--dsc-gray-5);writing-mode:vertical-rl;transform:rotate(180deg);justify-self:center;padding:2px 0}.dsc-gauge-row-3 .dsc-gauge{min-width:0}.dsc-gauge-cell{min-width:0;display:flex;flex-direction:column;align-items:center;gap:2px}.dsc-gauge-cell .dsc-sparkline{width:100%;max-width:88px;opacity:.9}.dsc-gauge-row-3 .dsc-gauge svg{width:100%;max-width:96px;height:auto;max-height:72px}.dsc-gauge-row-3 .dsc-gauge-label{font-size:10px}.dsc-gauge-zone{border:1px solid transparent;border-radius:12px;padding:8px 6px 10px;transition:box-shadow .25s ease,border-color .25s ease,background .25s ease}.dsc-gauge-zone.is-lit{border-color:#ffd54f80;background:linear-gradient(180deg,#ffc1071a,#0c121c59);box-shadow:0 0 28px #ffc10747,inset 0 0 16px #ffd54f12}.dsc-gauge-zone-label{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5);margin:0 4px 6px}.dsc-gauge{display:flex;flex-direction:column;align-items:center;gap:4px}.dsc-gauge-label{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-chart-legend{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:4px;min-height:20px}.dsc-chart-legend-item{display:inline-flex;align-items:center;gap:6px;font-size:.75rem;color:var(--dsc-gray-5)}.dsc-chart-legend-item i{width:8px;height:8px;border-radius:50%;display:inline-block;box-shadow:0 0 6px currentColor}.dsc-chart-last{margin-left:auto;font-variant-numeric:tabular-nums;color:var(--dsc-neon);font-size:13px;font-weight:650}.dsc-fault-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.dsc-fault-list li{display:flex;flex-wrap:wrap;align-items:center;gap:10px}.dsc-empty{padding:18px 14px;border:1px dashed var(--dsc-gray-3);border-radius:8px;color:var(--dsc-gray-5);background:#00000040;font-size:.9rem;line-height:1.45}.dsc-empty--ok{border-style:solid;border-color:var(--dsc-neon-dim);color:var(--dsc-neon)}.dsc-btn:disabled{opacity:.45;cursor:not-allowed}.dsc-glass{background:var(--dsc-glass);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid var(--dsc-glass-border);border-radius:var(--dsc-radius-lg);box-shadow:var(--dsc-shadow)}.dsc-glass--glow{border-color:var(--dsc-teal-dim);box-shadow:0 0 0 1px #26c6da26,0 0 24px #26c6da1f}.dsc-icon-btn{appearance:none;width:36px;height:36px;padding:0;display:inline-flex;align-items:center;justify-content:center;border-radius:10px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);cursor:pointer;box-shadow:var(--dsc-shadow-tight);transition:border-color .12s ease,background .12s ease,transform .1s ease}.dsc-icon-btn:hover{border-color:var(--dsc-teal-dim);color:var(--dsc-teal)}.dsc-icon-btn:active{transform:translateY(1px)}.dsc-result-chip{display:inline-flex;align-items:center;gap:8px;max-width:100%;padding:8px 12px;border-radius:999px;border:1px solid var(--dsc-teal-dim);background:#26c6da1a;color:var(--dsc-white);font-size:.9rem}.dsc-result-chip span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dsc-overflow{position:relative;display:inline-block}.dsc-overflow-menu{position:absolute;right:0;top:calc(100% + 6px);z-index:40;min-width:180px;padding:6px;background:var(--dsc-black-2);border:1px solid var(--dsc-gray-3);border-radius:10px;box-shadow:var(--dsc-shadow)}.dsc-overflow-menu button{appearance:none;width:100%;text-align:left;border:0;background:transparent;color:var(--dsc-white);font:inherit;font-size:.88rem;padding:10px 12px;border-radius:8px;cursor:pointer}.dsc-overflow-menu button:hover{background:#26c6da1f;color:var(--dsc-teal)}.dsc-drawer-root{position:fixed;inset:0;z-index:80;pointer-events:none}.dsc-drawer-root.is-open{pointer-events:auto}.dsc-drawer-scrim{position:absolute;inset:0;background:#00000073;opacity:0;transition:opacity .18s ease}.dsc-drawer-root.is-open .dsc-drawer-scrim{opacity:1}.dsc-drawer-panel{position:absolute;top:0;bottom:0;width:min(380px,92vw);background:linear-gradient(165deg,#121a16,#0a100e);border:1px solid var(--dsc-glass-border);box-shadow:-12px 0 40px #0000008c;display:flex;flex-direction:column;transition:transform .22s ease}.dsc-drawer-panel.right{right:0;transform:translate(105%);border-radius:14px 0 0 14px}.dsc-drawer-panel.left{left:0;transform:translate(-105%);border-radius:0 14px 14px 0}.dsc-drawer-root.is-open .dsc-drawer-panel.right,.dsc-drawer-root.is-open .dsc-drawer-panel.left{transform:none}.dsc-drawer-rail{position:absolute;top:50%;transform:translateY(-50%);width:28px;height:64px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:2}.dsc-drawer-panel.right .dsc-drawer-rail{left:-28px;border-radius:10px 0 0 10px}.dsc-drawer-panel.left .dsc-drawer-rail{right:-28px;border-radius:0 10px 10px 0}.dsc-drawer-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid var(--dsc-gray-3)}.dsc-drawer-head h2{margin:0;font-size:.85rem;letter-spacing:.12em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-drawer-body{flex:1;overflow:auto;padding:14px 16px}.dsc-soil{width:100%;max-width:280px;margin:0 auto}.dsc-soil-pot{position:relative;width:100%;aspect-ratio:4 / 5;border-radius:12px 12px 28px 28px;border:2px solid rgba(120,160,130,.45);background:linear-gradient(180deg,#1a1410,#0e0c0a);overflow:hidden;box-shadow:inset 0 0 24px #0000008c,0 0 20px #26c6da14}.dsc-soil-pot.is-valid{border-color:var(--dsc-teal-dim);box-shadow:inset 0 0 24px #0000008c,0 0 28px #26c6da47,0 0 42px #39ff141f}.dsc-soil-layer{position:absolute;left:8%;right:8%;display:flex;align-items:center;justify-content:center;font-size:.72rem;letter-spacing:.04em;color:#f4f7f4eb;text-shadow:0 1px 2px rgba(0,0,0,.65);border-top:1px solid rgba(255,255,255,.08)}.dsc-soil-empty{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--dsc-gray-5);font-size:.85rem;padding:16px;text-align:center}.dsc-seat-layout{display:grid;grid-template-columns:minmax(200px,320px) 1fr;gap:18px;align-items:start}@media(max-width:900px){.dsc-seat-layout{grid-template-columns:1fr}}.dsc-seat-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.dsc-table{width:100%;border-collapse:collapse;font-size:.88rem}.dsc-table th,.dsc-table td{text-align:left;padding:8px 6px;border-bottom:1px solid var(--dsc-gray-3)}.dsc-table th{font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--dsc-gray-5);font-weight:600}.dsc-table tr{cursor:pointer}.dsc-table tr:hover td{background:#26c6da0f}.dsc-btn.teal{border-color:var(--dsc-teal-dim);background:#26c6da2e;color:var(--dsc-white);box-shadow:0 0 18px #26c6da33}.dsc-btn.teal.primary{background:var(--dsc-teal);color:#041018;font-weight:650}.dsc-held-tag{margin-left:8px;font-size:.65rem;letter-spacing:.08em;color:var(--dsc-amber);vertical-align:middle}.dsc-kpi-hit,.dsc-gauge-hit{appearance:none;border:0;background:transparent;padding:0;margin:0;color:inherit;font:inherit;text-align:left;cursor:pointer;width:100%;display:block}.dsc-card.is-stale,.dsc-gauge.is-stale{opacity:.88;border-color:var(--dsc-amber)}.dsc-gauge.is-clickable:hover,.dsc-kpi-hit:hover .dsc-card{border-color:var(--dsc-blue-dim)}.dsc-timespan{display:inline-flex;flex-wrap:wrap;gap:6px}.dsc-spark-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}.dsc-sparkline{display:block;margin-top:4px}.dsc-gotwant{display:flex;flex-direction:column;gap:10px}.dsc-gotwant-row{display:grid;grid-template-columns:64px 1fr;gap:6px 10px;align-items:center}.dsc-gotwant-label{font-size:.75rem;color:var(--dsc-gray-5);letter-spacing:.04em}.dsc-gotwant-track{position:relative;height:10px;border-radius:999px;background:#ffffff0f;overflow:hidden;grid-column:2}.dsc-gotwant-want{position:absolute;inset:0 auto 0 0;background:#2ec4d647;border-right:1px solid var(--dsc-teal)}.dsc-gotwant-got{position:absolute;inset:2px auto 2px 0;background:linear-gradient(90deg,var(--dsc-blue),var(--dsc-teal));border-radius:999px}.dsc-gotwant-vals{grid-column:2;display:flex;justify-content:space-between;font-size:.72rem;font-family:var(--dsc-mono)}.dsc-seat-editors{display:grid;gap:10px}.dsc-seat-editors label{display:flex;flex-direction:column;gap:4px;font-size:.75rem;color:var(--dsc-gray-5)}.dsc-seat-editors input,.dsc-seat-editors select,.dsc-seat-editors textarea{background:var(--dsc-gray-1);border:1px solid var(--dsc-glass-border);border-radius:8px;color:var(--dsc-white);padding:8px 10px;font:inherit}.dsc-root-matrix .dsc-tone-ok{color:var(--dsc-neon)}.dsc-root-matrix .dsc-tone-warn{color:var(--dsc-amber)}.dsc-root-matrix .dsc-tone-bad{color:var(--dsc-bad)}.dsc-root-matrix .dsc-tone-stale{color:var(--dsc-amber);opacity:.85}.dsc-tent-cockpit-strip{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}@media(prefers-reduced-motion:reduce){.dsc-drawer-panel,.dsc-drawer-scrim{transition:none!important}}.dsc-decision-root{position:fixed;inset:0;z-index:120;display:flex;align-items:center;justify-content:center}.dsc-decision-scrim{position:absolute;inset:0;background:#04080ab8;backdrop-filter:blur(6px)}.dsc-decision-panel{position:relative;z-index:1;width:min(720px,94vw);max-height:86vh;overflow:auto;background:linear-gradient(165deg,#121a16,#0a100e);border:1px solid var(--dsc-glass-border);border-radius:14px;box-shadow:0 24px 80px #0000008c;padding:16px 18px}.dsc-decision-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.dsc-decision-head h2{margin:0;font-size:.95rem;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-decision-help{min-height:8px;margin-top:10px}.dsc-decision-foot{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}.dsc-result-chip.is-empty{border-color:#78a08247;background:#121c1673;color:var(--dsc-gray-5)}.dsc-result-chip-hit{appearance:none;border:0;background:transparent;padding:0;color:inherit;font:inherit;cursor:pointer;max-width:100%}.dsc-coupled-mix .dsc-mix-row{display:grid;grid-template-columns:minmax(140px,1.2fr) 140px 48px 64px auto;gap:8px;align-items:end;margin-bottom:8px}.dsc-nutrient-slot{display:grid;grid-template-columns:minmax(140px,1fr) 88px 64px auto;gap:8px;align-items:end;margin-top:8px}.dsc-catalog-hits{list-style:none;margin:8px 0 0;padding:0;max-height:280px;overflow:auto}.dsc-catalog-hits button{appearance:none;width:100%;text-align:left;background:transparent;border:0;color:inherit;font:inherit;padding:8px 4px;cursor:pointer;display:flex;gap:8px}.dsc-catalog-hits button:hover{background:#26c6da1a}.dsc-catalog-picker input[type=search]{width:100%;box-sizing:border-box;background:var(--dsc-gray-1);border:1px solid var(--dsc-glass-border);border-radius:8px;color:var(--dsc-white);padding:8px 10px}.dsc-vessel-glyph{display:inline-flex;flex-direction:column;align-items:center;gap:2px}.dsc-vessel-glyph-label{font-size:.65rem;color:var(--dsc-gray-5)}.dsc-kit-constellation{width:100%;max-height:420px;color:inherit;margin-bottom:8px}.dsc-kit-pulse-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px}.dsc-kit-node{display:flex;align-items:center;gap:8px;padding:8px;border:1px dashed var(--dsc-gray-3);border-radius:10px}.dsc-kit-node.is-ok{border-style:solid;border-color:var(--dsc-teal-dim)}.dsc-kit-node i{width:10px;height:10px;border-radius:50%;background:var(--dsc-gray-5)}.dsc-kit-node.is-ok i{background:var(--dsc-neon)}.dsc-kit-node.is-held i{background:var(--dsc-amber)}.dsc-kit-node.is-oos i,.dsc-kit-node.is-missing i,.dsc-kit-node.is-dark i{background:transparent;border:1px dashed var(--dsc-bad)}.dsc-lung-svg,.dsc-tank-svg{width:100%;height:auto;color:var(--dsc-white)}.dsc-cal-curve{margin:12px 0 16px}.dsc-cal-curve strong{display:block;margin-bottom:6px}.dsc-honesty-hit{appearance:none;border:0;background:transparent;padding:0;cursor:pointer}.dsc-row-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.dsc-detail-list dt{font-size:.7rem;color:var(--dsc-gray-5);margin-top:8px}.dsc-detail-list dd{margin:0}button.dsc-chip{font:inherit;letter-spacing:inherit;text-transform:inherit;cursor:pointer;color:inherit}button.dsc-chip.is-clickable:hover{border-color:var(--dsc-teal)}.dsc-duty-hit{appearance:none;border:0;background:transparent;padding:0;width:100%;text-align:left;cursor:pointer;color:inherit;font:inherit}.dsc-duty-strip{display:flex;flex-direction:column;gap:4px;margin:8px 0}.dsc-duty-meta{display:flex;justify-content:space-between;gap:8px;font-size:.72rem;letter-spacing:.04em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-duty-svg{width:100%;height:18px;display:block}.dsc-inspector-playbook{margin:10px 0;padding:10px 12px;border:1px solid var(--dsc-glass-border);border-radius:10px;background:#00000038}.dsc-inspector-playbook strong{display:block;margin-bottom:4px}.dsc-inspector-playbook p{margin:4px 0}.dsc-stage-track{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px}.dsc-stage-pill{font-size:.65rem;letter-spacing:.04em;text-transform:uppercase;padding:5px 8px;border-radius:6px;background:var(--dsc-gray-2);color:var(--dsc-gray-5)}.dsc-stage-pill.is-on{background:color-mix(in srgb,var(--dsc-blue) 45%,transparent);color:var(--dsc-white)}.dsc-stage-pill.is-next{background:color-mix(in srgb,var(--dsc-amber) 22%,transparent);color:var(--dsc-amber)}.dsc-scheduler-lanes{display:flex;flex-direction:column;gap:6px;margin-top:8px}.dsc-scheduler-lane{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:8px 10px;border:1px solid var(--dsc-gray-3);border-radius:10px;background:#00000029;color:inherit;font:inherit;text-align:left;cursor:pointer}.dsc-scheduler-lane:hover:not(:disabled){border-color:var(--dsc-teal)}.dsc-scheduler-lane.is-oos,.dsc-scheduler-lane:disabled{opacity:.45;cursor:default}.dsc-air-path{display:flex;flex-direction:column;gap:8px}.dsc-air-svg{width:100%;height:auto;display:block;color:var(--dsc-white)}.dsc-target-heroes{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px}.dsc-tent-targets.is-hero{border-color:var(--dsc-teal-dim);padding:14px 16px}.dsc-target-hint{font-size:.65rem;color:var(--dsc-gray-5);letter-spacing:.03em}.dsc-got-want-hit{appearance:none;border:0;background:transparent;padding:0;width:100%;text-align:left;cursor:pointer;color:inherit;font:inherit}.dsc-pot-card-head{display:flex;align-items:center;gap:10px;cursor:pointer;margin-bottom:8px}.dsc-pot-card.is-oos{opacity:.72}.dsc-npk-hit{appearance:none;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:inherit;font:inherit;font-size:.75rem;border-radius:8px;padding:6px 8px;cursor:pointer}.dsc-npk-hit:hover{border-color:var(--dsc-teal)}.dsc-light-hero .dsc-honesty{font-size:.78rem}.dsc-dash-home .dsc-gauge-matrix--dense{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px 10px}.dsc-gauge-matrix--bands{display:flex;flex-direction:column;gap:10px}.dsc-gauge-matrix--bands .dsc-gauge-row-3 .dsc-band-cell{min-width:0;padding:6px 2px 8px}.dsc-gauge-matrix--bands .dsc-gauge-row-3:not(.is-lit){opacity:.72}.dsc-gauge-matrix--bands .dsc-gauge-row-3.is-lit{opacity:1}@keyframes dsc-fan-spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.dsc-fan-spin{animation:dsc-fan-spin 1.3s linear infinite;transform-origin:center center}.dsc-chip--fan .dsc-fan-spin:nth-child(1){animation-duration:1.3s}.dsc-dash-home .dsc-band-cell{display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 4px 10px;border-radius:12px;background:#0c121c59;border:1px solid rgba(130,165,230,.12);transition:box-shadow .25s ease,border-color .25s ease,background .25s ease}.dsc-dash-home .dsc-band-cell--main{border-color:#f9731647;background:linear-gradient(180deg,#f9731612,#0c121c59);box-shadow:inset 0 0 20px #f973160d}.dsc-dash-home .dsc-band-cell--clone{border-color:#22c55e47;background:linear-gradient(180deg,#22c55e12,#0c121c59);box-shadow:inset 0 0 20px #22c55e0d}.dsc-dash-home .dsc-band-cell--room{border-color:#94a3b83d;background:linear-gradient(180deg,#94a3b80f,#0c121c59)}.dsc-dash-home .dsc-band-cell--root{border-color:#fbbf2447;background:linear-gradient(180deg,#fbbf2412,#0c121c59);box-shadow:inset 0 0 20px #fbbf240d}.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-warn),.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-bad){animation:dsc-band-warn 2.6s ease-in-out infinite}@keyframes dsc-band-warn{0%,to{box-shadow:inset 0 0 16px #ffb74d0f}50%{box-shadow:inset 0 0 22px #ffb74d2e,0 0 18px #ffb74d1f}}.dsc-dash-home .dsc-band-cell .dsc-gauge-hit{width:auto;display:flex;justify-content:center}.dsc-dash-home .dsc-band-cell .dsc-gauge svg{width:100%;max-width:118px;height:auto}.dsc-band-cell{display:flex;flex-direction:column;align-items:center;gap:4px}.dsc-band-cell .dsc-sparkline{opacity:.85}.dsc-dash-home .dsc-legacy-host{max-height:min(52vh,520px);overflow:hidden;border-radius:10px}.dsc-dash-home .dsc-status-strip{margin-bottom:4px}.dsc-dash-home .dsc-gauge-matrix--pots{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:8px}.dsc-banner{border-radius:10px;padding:12px 14px;border-left:3px solid rgba(148,163,184,.5);background:#0f172a8c}.dsc-banner--warn{border-left-color:#fbbf24d9;background:#fbbf2414}.dsc-banner--bad{border-left-color:#ef4444e6;background:#ef44441a}.dsc-banner strong{display:block;margin-bottom:4px}.dsc-narrator{margin-top:12px;border:1px solid rgba(56,189,248,.25);border-left:3px solid rgba(56,189,248,.45);border-radius:10px;padding:10px 14px;background:#0c121c73}.dsc-narrator summary{cursor:pointer;font-weight:600;letter-spacing:.02em}.dsc-grow-log{font-size:13px;line-height:1.5;max-height:220px;overflow-y:auto}.dsc-grow-log li{padding:4px 0;border-bottom:1px solid rgba(148,163,184,.12)}', O2 = R2;
function Hb() {
  const a = At(), i = ht();
  return /* @__PURE__ */ l.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ l.jsx(
      Nt,
      {
        icon: "alert",
        title: "Not found",
        subtitle: `${a.pathname} is not a DSC route.`
      }
    ),
    /* @__PURE__ */ l.jsx("p", { className: "dsc-honesty", children: "Unknown hash — not a silent Mission redirect." }),
    /* @__PURE__ */ l.jsx(ce, { primary: !0, onClick: () => i("/live/overview"), children: "Go Overview" })
  ] });
}
function Js() {
  const a = At(), i = A2(a.pathname, a.search);
  return i ? /* @__PURE__ */ l.jsx(ss, { to: i, replace: !0 }) : /* @__PURE__ */ l.jsx(Hb, {});
}
function z2({ surfaceVersion: a = "7.2.0" }) {
  const i = At(), c = ht(), o = T2(i.pathname), d = E2[o];
  return y.useEffect(() => {
    if (i.pathname === "/live/climate" || i.pathname === "/ops/home") return;
    const f = new URLSearchParams(i.search);
    if (!f.has("tent") && !f.has("zone")) return;
    f.delete("tent"), f.delete("zone");
    const h = f.toString();
    c({ pathname: i.pathname, search: h ? `?${h}` : "" }, { replace: !0 });
  }, [i.pathname, i.search, c]), /* @__PURE__ */ l.jsxs("div", { className: "dsc-shell", children: [
    /* @__PURE__ */ l.jsxs("div", { className: "dsc-brand-row", children: [
      /* @__PURE__ */ l.jsxs(Bc, { className: "dsc-brand", to: "/live/overview", children: [
        /* @__PURE__ */ l.jsx(Sn, { name: "brand", size: 36, color: "var(--dsc-blue)" }),
        /* @__PURE__ */ l.jsx("div", { className: "dsc-brand-title", children: /* @__PURE__ */ l.jsx("strong", { children: "DSC - A Plausible Deniability Project." }) })
      ] }),
      /* @__PURE__ */ l.jsxs("div", { className: "dsc-muted", style: { fontSize: 12, letterSpacing: "0.08em" }, children: [
        "SURFACE ",
        a
      ] })
    ] }),
    /* @__PURE__ */ l.jsx(Cy, {}),
    /* @__PURE__ */ l.jsx("nav", { className: "dsc-primary-tabs", "aria-label": "Primary", children: C2.map((f) => /* @__PURE__ */ l.jsxs(
      Bc,
      {
        to: f.path,
        className: ({ isActive: h }) => `dsc-tab dsc-tab--${f.id}${h || o === f.id ? " active" : ""}`,
        children: [
          /* @__PURE__ */ l.jsx(Sn, { name: f.icon, size: 15 }),
          f.label
        ]
      },
      f.id
    )) }),
    d.length > 1 ? /* @__PURE__ */ l.jsx("nav", { className: "dsc-secondary-tabs", "aria-label": "Section pages", children: d.map((f) => /* @__PURE__ */ l.jsxs(
      Bc,
      {
        to: f.path,
        end: f.path === "/fleet",
        className: ({ isActive: h }) => `dsc-tab${h ? " active" : ""}`,
        children: [
          /* @__PURE__ */ l.jsx(Sn, { name: f.icon, size: 14 }),
          f.label
        ]
      },
      f.id
    )) }) : null,
    /* @__PURE__ */ l.jsx(By, {}),
    /* @__PURE__ */ l.jsx(D1, {}),
    /* @__PURE__ */ l.jsxs(i0, { children: [
      /* @__PURE__ */ l.jsx(De, { path: "/", element: /* @__PURE__ */ l.jsx(ss, { to: "/live/overview", replace: !0 }) }),
      /* @__PURE__ */ l.jsx(De, { path: "/live", element: /* @__PURE__ */ l.jsx(ss, { to: "/live/overview", replace: !0 }) }),
      /* @__PURE__ */ l.jsx(De, { path: "/live/overview", element: /* @__PURE__ */ l.jsx(j2, {}) }),
      /* @__PURE__ */ l.jsx(De, { path: "/live/mission", element: /* @__PURE__ */ l.jsx(Q1, {}) }),
      /* @__PURE__ */ l.jsx(De, { path: "/live/twin", element: /* @__PURE__ */ l.jsx(h_, {}) }),
      /* @__PURE__ */ l.jsx(De, { path: "/live/climate", element: /* @__PURE__ */ l.jsx(W1, {}) }),
      /* @__PURE__ */ l.jsx(De, { path: "/live/4x8", element: /* @__PURE__ */ l.jsx(s2, {}) }),
      /* @__PURE__ */ l.jsx(De, { path: "/live/2x4", element: /* @__PURE__ */ l.jsx(l2, {}) }),
      /* @__PURE__ */ l.jsx(De, { path: "/live/main", element: /* @__PURE__ */ l.jsx(ss, { to: "/live/4x8", replace: !0 }) }),
      /* @__PURE__ */ l.jsx(De, { path: "/live/clone", element: /* @__PURE__ */ l.jsx(ss, { to: "/live/2x4", replace: !0 }) }),
      /* @__PURE__ */ l.jsx(De, { path: "/live/root", element: /* @__PURE__ */ l.jsx(e2, {}) }),
      /* @__PURE__ */ l.jsx(De, { path: "/live/light", element: /* @__PURE__ */ l.jsx(a2, {}) }),
      /* @__PURE__ */ l.jsx(De, { path: "/grow", element: /* @__PURE__ */ l.jsx(ss, { to: "/grow/compose", replace: !0 }) }),
      /* @__PURE__ */ l.jsx(De, { path: "/grow/compose", element: /* @__PURE__ */ l.jsx(R1, {}) }),
      /* @__PURE__ */ l.jsx(De, { path: "/grow/research", element: /* @__PURE__ */ l.jsx(O1, {}) }),
      /* @__PURE__ */ l.jsx(De, { path: "/grow/roster", element: /* @__PURE__ */ l.jsx(z1, {}) }),
      /* @__PURE__ */ l.jsx(De, { path: "/tune", element: /* @__PURE__ */ l.jsx(ss, { to: "/tune/learning", replace: !0 }) }),
      /* @__PURE__ */ l.jsx(De, { path: "/tune/learning", element: /* @__PURE__ */ l.jsx(o2, {}) }),
      /* @__PURE__ */ l.jsx(De, { path: "/tune/analytics", element: /* @__PURE__ */ l.jsx(u2, {}) }),
      /* @__PURE__ */ l.jsx(De, { path: "/fleet", element: /* @__PURE__ */ l.jsx(d2, {}) }),
      /* @__PURE__ */ l.jsx(De, { path: "/fleet/calibrate", element: /* @__PURE__ */ l.jsx(S2, {}) }),
      /* @__PURE__ */ l.jsx(De, { path: "/fleet/settings", element: /* @__PURE__ */ l.jsx(_2, {}) }),
      /* @__PURE__ */ l.jsx(De, { path: "/ops/home", element: /* @__PURE__ */ l.jsx(N2, {}) }),
      /* @__PURE__ */ l.jsx(De, { path: "/ops/dash", element: /* @__PURE__ */ l.jsx(h_, {}) }),
      /* @__PURE__ */ l.jsx(De, { path: "/ops/*", element: /* @__PURE__ */ l.jsx(Js, {}) }),
      /* @__PURE__ */ l.jsx(De, { path: "/plant/*", element: /* @__PURE__ */ l.jsx(Js, {}) }),
      /* @__PURE__ */ l.jsx(De, { path: "/plant", element: /* @__PURE__ */ l.jsx(Js, {}) }),
      /* @__PURE__ */ l.jsx(De, { path: "/advanced/*", element: /* @__PURE__ */ l.jsx(Js, {}) }),
      /* @__PURE__ */ l.jsx(De, { path: "/advanced", element: /* @__PURE__ */ l.jsx(Js, {}) }),
      /* @__PURE__ */ l.jsx(De, { path: "/system", element: /* @__PURE__ */ l.jsx(Js, {}) }),
      /* @__PURE__ */ l.jsx(De, { path: "*", element: /* @__PURE__ */ l.jsx(Hb, {}) })
    ] })
  ] });
}
function D2({
  hass: a,
  surfaceVersion: i = "7.2.0",
  hassRevision: c = 0,
  fleetSource: o = "ha"
}) {
  return /* @__PURE__ */ l.jsx(q0, { hass: a, revision: c, children: /* @__PURE__ */ l.jsx(U1, { children: /* @__PURE__ */ l.jsx(j1, { children: /* @__PURE__ */ l.jsx(L1, { children: /* @__PURE__ */ l.jsx(z2, { surfaceVersion: i }) }) }) }) });
}
function H2({
  panel: a
}) {
  const [i, c] = y.useState(() => a.hass), [o, d] = y.useState(0);
  return y.useEffect(() => {
    const f = () => {
      c(a.hass), d((h) => h + 1);
    };
    return f(), a.addEventListener("hass-updated", f), () => {
      a.removeEventListener("hass-updated", f);
    };
  }, [a]), /* @__PURE__ */ l.jsx(P0, { hass: i, tick: o, source: "ha", children: /* @__PURE__ */ l.jsx(A0, { children: /* @__PURE__ */ l.jsx(D2, { hass: i, fleetSource: "ha" }) }) });
}
class L2 extends HTMLElement {
  constructor() {
    super(...arguments);
    Nc(this, "_root", null);
    Nc(this, "_hass", null);
    Nc(this, "_mounted", !1);
  }
  set hass(c) {
    this._hass = c, this.dispatchEvent(new Event("hass-updated"));
  }
  get hass() {
    return this._hass;
  }
  connectedCallback() {
    if (this.shadowRoot || this.attachShadow({ mode: "open" }), !this._mounted) {
      const c = document.createElement("style");
      c.textContent = `:host{display:block;height:100%;background:#0a0e18;color:#eef1f8;}
${O2}`, this.shadowRoot.appendChild(c);
      const o = document.createElement("div");
      o.className = "dsc-root", o.style.height = "100%", this.shadowRoot.appendChild(o), this._root = cx.createRoot(o), this._root.render(/* @__PURE__ */ l.jsx(H2, { panel: this })), this._mounted = !0;
    }
  }
  disconnectedCallback() {
    this._root?.unmount(), this._root = null, this._mounted = !1;
  }
}
customElements.get("dsc-hub-panel") || customElements.define("dsc-hub-panel", L2);
export {
  L2 as default
};
//# sourceMappingURL=dsc-hub-panel.js.map
