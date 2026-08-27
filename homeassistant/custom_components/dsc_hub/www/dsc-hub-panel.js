var yv = Object.defineProperty;
var jv = (n, i, r) => i in n ? yv(n, i, { enumerable: !0, configurable: !0, writable: !0, value: r }) : n[i] = r;
var ci = (n, i, r) => jv(n, typeof i != "symbol" ? i + "" : i, r);
var Lu = { exports: {} }, ui = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Up;
function wv() {
  if (Up) return ui;
  Up = 1;
  var n = Symbol.for("react.transitional.element"), i = Symbol.for("react.fragment");
  function r(o, d, h) {
    var m = null;
    if (h !== void 0 && (m = "" + h), d.key !== void 0 && (m = "" + d.key), "key" in d) {
      h = {};
      for (var p in d)
        p !== "key" && (h[p] = d[p]);
    } else h = d;
    return d = h.ref, {
      $$typeof: n,
      type: o,
      key: m,
      ref: d !== void 0 ? d : null,
      props: h
    };
  }
  return ui.Fragment = i, ui.jsx = r, ui.jsxs = r, ui;
}
var Fp;
function Sv() {
  return Fp || (Fp = 1, Lu.exports = wv()), Lu.exports;
}
var s = Sv(), Hu = { exports: {} }, Ce = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Gp;
function kv() {
  if (Gp) return Ce;
  Gp = 1;
  var n = Symbol.for("react.transitional.element"), i = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), o = Symbol.for("react.strict_mode"), d = Symbol.for("react.profiler"), h = Symbol.for("react.consumer"), m = Symbol.for("react.context"), p = Symbol.for("react.forward_ref"), f = Symbol.for("react.suspense"), _ = Symbol.for("react.memo"), x = Symbol.for("react.lazy"), g = Symbol.for("react.activity"), y = Symbol.iterator;
  function w(k) {
    return k === null || typeof k != "object" ? null : (k = y && k[y] || k["@@iterator"], typeof k == "function" ? k : null);
  }
  var N = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, T = Object.assign, E = {};
  function M(k, $, Z) {
    this.props = k, this.context = $, this.refs = E, this.updater = Z || N;
  }
  M.prototype.isReactComponent = {}, M.prototype.setState = function(k, $) {
    if (typeof k != "object" && typeof k != "function" && k != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, k, $, "setState");
  }, M.prototype.forceUpdate = function(k) {
    this.updater.enqueueForceUpdate(this, k, "forceUpdate");
  };
  function C() {
  }
  C.prototype = M.prototype;
  function U(k, $, Z) {
    this.props = k, this.context = $, this.refs = E, this.updater = Z || N;
  }
  var G = U.prototype = new C();
  G.constructor = U, T(G, M.prototype), G.isPureReactComponent = !0;
  var X = Array.isArray;
  function L() {
  }
  var V = { H: null, A: null, T: null, S: null }, te = Object.prototype.hasOwnProperty;
  function re(k, $, Z) {
    var ne = Z.ref;
    return {
      $$typeof: n,
      type: k,
      key: $,
      ref: ne !== void 0 ? ne : null,
      props: Z
    };
  }
  function se(k, $) {
    return re(k.type, $, k.props);
  }
  function ce(k) {
    return typeof k == "object" && k !== null && k.$$typeof === n;
  }
  function me(k) {
    var $ = { "=": "=0", ":": "=2" };
    return "$" + k.replace(/[=:]/g, function(Z) {
      return $[Z];
    });
  }
  var oe = /\/+/g;
  function ge(k, $) {
    return typeof k == "object" && k !== null && k.key != null ? me("" + k.key) : $.toString(36);
  }
  function ue(k) {
    switch (k.status) {
      case "fulfilled":
        return k.value;
      case "rejected":
        throw k.reason;
      default:
        switch (typeof k.status == "string" ? k.then(L, L) : (k.status = "pending", k.then(
          function($) {
            k.status === "pending" && (k.status = "fulfilled", k.value = $);
          },
          function($) {
            k.status === "pending" && (k.status = "rejected", k.reason = $);
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
  function S(k, $, Z, ne, de) {
    var Q = typeof k;
    (Q === "undefined" || Q === "boolean") && (k = null);
    var le = !1;
    if (k === null) le = !0;
    else
      switch (Q) {
        case "bigint":
        case "string":
        case "number":
          le = !0;
          break;
        case "object":
          switch (k.$$typeof) {
            case n:
            case i:
              le = !0;
              break;
            case x:
              return le = k._init, S(
                le(k._payload),
                $,
                Z,
                ne,
                de
              );
          }
      }
    if (le)
      return de = de(k), le = ne === "" ? "." + ge(k, 0) : ne, X(de) ? (Z = "", le != null && (Z = le.replace(oe, "$&/") + "/"), S(de, $, Z, "", function(st) {
        return st;
      })) : de != null && (ce(de) && (de = se(
        de,
        Z + (de.key == null || k && k.key === de.key ? "" : ("" + de.key).replace(
          oe,
          "$&/"
        ) + "/") + le
      )), $.push(de)), 1;
    le = 0;
    var xe = ne === "" ? "." : ne + ":";
    if (X(k))
      for (var je = 0; je < k.length; je++)
        ne = k[je], Q = xe + ge(ne, je), le += S(
          ne,
          $,
          Z,
          Q,
          de
        );
    else if (je = w(k), typeof je == "function")
      for (k = je.call(k), je = 0; !(ne = k.next()).done; )
        ne = ne.value, Q = xe + ge(ne, je++), le += S(
          ne,
          $,
          Z,
          Q,
          de
        );
    else if (Q === "object") {
      if (typeof k.then == "function")
        return S(
          ue(k),
          $,
          Z,
          ne,
          de
        );
      throw $ = String(k), Error(
        "Objects are not valid as a React child (found: " + ($ === "[object Object]" ? "object with keys {" + Object.keys(k).join(", ") + "}" : $) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return le;
  }
  function O(k, $, Z) {
    if (k == null) return k;
    var ne = [], de = 0;
    return S(k, ne, "", "", function(Q) {
      return $.call(Z, Q, de++);
    }), ne;
  }
  function q(k) {
    if (k._status === -1) {
      var $ = k._result;
      $ = $(), $.then(
        function(Z) {
          (k._status === 0 || k._status === -1) && (k._status = 1, k._result = Z);
        },
        function(Z) {
          (k._status === 0 || k._status === -1) && (k._status = 2, k._result = Z);
        }
      ), k._status === -1 && (k._status = 0, k._result = $);
    }
    if (k._status === 1) return k._result.default;
    throw k._result;
  }
  var J = typeof reportError == "function" ? reportError : function(k) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var $ = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof k == "object" && k !== null && typeof k.message == "string" ? String(k.message) : String(k),
        error: k
      });
      if (!window.dispatchEvent($)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", k);
      return;
    }
    console.error(k);
  }, I = {
    map: O,
    forEach: function(k, $, Z) {
      O(
        k,
        function() {
          $.apply(this, arguments);
        },
        Z
      );
    },
    count: function(k) {
      var $ = 0;
      return O(k, function() {
        $++;
      }), $;
    },
    toArray: function(k) {
      return O(k, function($) {
        return $;
      }) || [];
    },
    only: function(k) {
      if (!ce(k))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return k;
    }
  };
  return Ce.Activity = g, Ce.Children = I, Ce.Component = M, Ce.Fragment = r, Ce.Profiler = d, Ce.PureComponent = U, Ce.StrictMode = o, Ce.Suspense = f, Ce.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = V, Ce.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(k) {
      return V.H.useMemoCache(k);
    }
  }, Ce.cache = function(k) {
    return function() {
      return k.apply(null, arguments);
    };
  }, Ce.cacheSignal = function() {
    return null;
  }, Ce.cloneElement = function(k, $, Z) {
    if (k == null)
      throw Error(
        "The argument must be a React element, but you passed " + k + "."
      );
    var ne = T({}, k.props), de = k.key;
    if ($ != null)
      for (Q in $.key !== void 0 && (de = "" + $.key), $)
        !te.call($, Q) || Q === "key" || Q === "__self" || Q === "__source" || Q === "ref" && $.ref === void 0 || (ne[Q] = $[Q]);
    var Q = arguments.length - 2;
    if (Q === 1) ne.children = Z;
    else if (1 < Q) {
      for (var le = Array(Q), xe = 0; xe < Q; xe++)
        le[xe] = arguments[xe + 2];
      ne.children = le;
    }
    return re(k.type, de, ne);
  }, Ce.createContext = function(k) {
    return k = {
      $$typeof: m,
      _currentValue: k,
      _currentValue2: k,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, k.Provider = k, k.Consumer = {
      $$typeof: h,
      _context: k
    }, k;
  }, Ce.createElement = function(k, $, Z) {
    var ne, de = {}, Q = null;
    if ($ != null)
      for (ne in $.key !== void 0 && (Q = "" + $.key), $)
        te.call($, ne) && ne !== "key" && ne !== "__self" && ne !== "__source" && (de[ne] = $[ne]);
    var le = arguments.length - 2;
    if (le === 1) de.children = Z;
    else if (1 < le) {
      for (var xe = Array(le), je = 0; je < le; je++)
        xe[je] = arguments[je + 2];
      de.children = xe;
    }
    if (k && k.defaultProps)
      for (ne in le = k.defaultProps, le)
        de[ne] === void 0 && (de[ne] = le[ne]);
    return re(k, Q, de);
  }, Ce.createRef = function() {
    return { current: null };
  }, Ce.forwardRef = function(k) {
    return { $$typeof: p, render: k };
  }, Ce.isValidElement = ce, Ce.lazy = function(k) {
    return {
      $$typeof: x,
      _payload: { _status: -1, _result: k },
      _init: q
    };
  }, Ce.memo = function(k, $) {
    return {
      $$typeof: _,
      type: k,
      compare: $ === void 0 ? null : $
    };
  }, Ce.startTransition = function(k) {
    var $ = V.T, Z = {};
    V.T = Z;
    try {
      var ne = k(), de = V.S;
      de !== null && de(Z, ne), typeof ne == "object" && ne !== null && typeof ne.then == "function" && ne.then(L, J);
    } catch (Q) {
      J(Q);
    } finally {
      $ !== null && Z.types !== null && ($.types = Z.types), V.T = $;
    }
  }, Ce.unstable_useCacheRefresh = function() {
    return V.H.useCacheRefresh();
  }, Ce.use = function(k) {
    return V.H.use(k);
  }, Ce.useActionState = function(k, $, Z) {
    return V.H.useActionState(k, $, Z);
  }, Ce.useCallback = function(k, $) {
    return V.H.useCallback(k, $);
  }, Ce.useContext = function(k) {
    return V.H.useContext(k);
  }, Ce.useDebugValue = function() {
  }, Ce.useDeferredValue = function(k, $) {
    return V.H.useDeferredValue(k, $);
  }, Ce.useEffect = function(k, $) {
    return V.H.useEffect(k, $);
  }, Ce.useEffectEvent = function(k) {
    return V.H.useEffectEvent(k);
  }, Ce.useId = function() {
    return V.H.useId();
  }, Ce.useImperativeHandle = function(k, $, Z) {
    return V.H.useImperativeHandle(k, $, Z);
  }, Ce.useInsertionEffect = function(k, $) {
    return V.H.useInsertionEffect(k, $);
  }, Ce.useLayoutEffect = function(k, $) {
    return V.H.useLayoutEffect(k, $);
  }, Ce.useMemo = function(k, $) {
    return V.H.useMemo(k, $);
  }, Ce.useOptimistic = function(k, $) {
    return V.H.useOptimistic(k, $);
  }, Ce.useReducer = function(k, $, Z) {
    return V.H.useReducer(k, $, Z);
  }, Ce.useRef = function(k) {
    return V.H.useRef(k);
  }, Ce.useState = function(k) {
    return V.H.useState(k);
  }, Ce.useSyncExternalStore = function(k, $, Z) {
    return V.H.useSyncExternalStore(
      k,
      $,
      Z
    );
  }, Ce.useTransition = function() {
    return V.H.useTransition();
  }, Ce.version = "19.2.8", Ce;
}
var Vp;
function hd() {
  return Vp || (Vp = 1, Hu.exports = kv()), Hu.exports;
}
var v = hd(), $u = { exports: {} }, di = {}, Bu = { exports: {} }, Uu = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var qp;
function Nv() {
  return qp || (qp = 1, (function(n) {
    function i(S, O) {
      var q = S.length;
      S.push(O);
      e: for (; 0 < q; ) {
        var J = q - 1 >>> 1, I = S[J];
        if (0 < d(I, O))
          S[J] = O, S[q] = I, q = J;
        else break e;
      }
    }
    function r(S) {
      return S.length === 0 ? null : S[0];
    }
    function o(S) {
      if (S.length === 0) return null;
      var O = S[0], q = S.pop();
      if (q !== O) {
        S[0] = q;
        e: for (var J = 0, I = S.length, k = I >>> 1; J < k; ) {
          var $ = 2 * (J + 1) - 1, Z = S[$], ne = $ + 1, de = S[ne];
          if (0 > d(Z, q))
            ne < I && 0 > d(de, Z) ? (S[J] = de, S[ne] = q, J = ne) : (S[J] = Z, S[$] = q, J = $);
          else if (ne < I && 0 > d(de, q))
            S[J] = de, S[ne] = q, J = ne;
          else break e;
        }
      }
      return O;
    }
    function d(S, O) {
      var q = S.sortIndex - O.sortIndex;
      return q !== 0 ? q : S.id - O.id;
    }
    if (n.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var h = performance;
      n.unstable_now = function() {
        return h.now();
      };
    } else {
      var m = Date, p = m.now();
      n.unstable_now = function() {
        return m.now() - p;
      };
    }
    var f = [], _ = [], x = 1, g = null, y = 3, w = !1, N = !1, T = !1, E = !1, M = typeof setTimeout == "function" ? setTimeout : null, C = typeof clearTimeout == "function" ? clearTimeout : null, U = typeof setImmediate < "u" ? setImmediate : null;
    function G(S) {
      for (var O = r(_); O !== null; ) {
        if (O.callback === null) o(_);
        else if (O.startTime <= S)
          o(_), O.sortIndex = O.expirationTime, i(f, O);
        else break;
        O = r(_);
      }
    }
    function X(S) {
      if (T = !1, G(S), !N)
        if (r(f) !== null)
          N = !0, L || (L = !0, me());
        else {
          var O = r(_);
          O !== null && ue(X, O.startTime - S);
        }
    }
    var L = !1, V = -1, te = 5, re = -1;
    function se() {
      return E ? !0 : !(n.unstable_now() - re < te);
    }
    function ce() {
      if (E = !1, L) {
        var S = n.unstable_now();
        re = S;
        var O = !0;
        try {
          e: {
            N = !1, T && (T = !1, C(V), V = -1), w = !0;
            var q = y;
            try {
              t: {
                for (G(S), g = r(f); g !== null && !(g.expirationTime > S && se()); ) {
                  var J = g.callback;
                  if (typeof J == "function") {
                    g.callback = null, y = g.priorityLevel;
                    var I = J(
                      g.expirationTime <= S
                    );
                    if (S = n.unstable_now(), typeof I == "function") {
                      g.callback = I, G(S), O = !0;
                      break t;
                    }
                    g === r(f) && o(f), G(S);
                  } else o(f);
                  g = r(f);
                }
                if (g !== null) O = !0;
                else {
                  var k = r(_);
                  k !== null && ue(
                    X,
                    k.startTime - S
                  ), O = !1;
                }
              }
              break e;
            } finally {
              g = null, y = q, w = !1;
            }
            O = void 0;
          }
        } finally {
          O ? me() : L = !1;
        }
      }
    }
    var me;
    if (typeof U == "function")
      me = function() {
        U(ce);
      };
    else if (typeof MessageChannel < "u") {
      var oe = new MessageChannel(), ge = oe.port2;
      oe.port1.onmessage = ce, me = function() {
        ge.postMessage(null);
      };
    } else
      me = function() {
        M(ce, 0);
      };
    function ue(S, O) {
      V = M(function() {
        S(n.unstable_now());
      }, O);
    }
    n.unstable_IdlePriority = 5, n.unstable_ImmediatePriority = 1, n.unstable_LowPriority = 4, n.unstable_NormalPriority = 3, n.unstable_Profiling = null, n.unstable_UserBlockingPriority = 2, n.unstable_cancelCallback = function(S) {
      S.callback = null;
    }, n.unstable_forceFrameRate = function(S) {
      0 > S || 125 < S ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : te = 0 < S ? Math.floor(1e3 / S) : 5;
    }, n.unstable_getCurrentPriorityLevel = function() {
      return y;
    }, n.unstable_next = function(S) {
      switch (y) {
        case 1:
        case 2:
        case 3:
          var O = 3;
          break;
        default:
          O = y;
      }
      var q = y;
      y = O;
      try {
        return S();
      } finally {
        y = q;
      }
    }, n.unstable_requestPaint = function() {
      E = !0;
    }, n.unstable_runWithPriority = function(S, O) {
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
        return O();
      } finally {
        y = q;
      }
    }, n.unstable_scheduleCallback = function(S, O, q) {
      var J = n.unstable_now();
      switch (typeof q == "object" && q !== null ? (q = q.delay, q = typeof q == "number" && 0 < q ? J + q : J) : q = J, S) {
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
        id: x++,
        callback: O,
        priorityLevel: S,
        startTime: q,
        expirationTime: I,
        sortIndex: -1
      }, q > J ? (S.sortIndex = q, i(_, S), r(f) === null && S === r(_) && (T ? (C(V), V = -1) : T = !0, ue(X, q - J))) : (S.sortIndex = I, i(f, S), N || w || (N = !0, L || (L = !0, me()))), S;
    }, n.unstable_shouldYield = se, n.unstable_wrapCallback = function(S) {
      var O = y;
      return function() {
        var q = y;
        y = O;
        try {
          return S.apply(this, arguments);
        } finally {
          y = q;
        }
      };
    };
  })(Uu)), Uu;
}
var Yp;
function Cv() {
  return Yp || (Yp = 1, Bu.exports = Nv()), Bu.exports;
}
var Fu = { exports: {} }, Ht = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Xp;
function Tv() {
  if (Xp) return Ht;
  Xp = 1;
  var n = hd();
  function i(f) {
    var _ = "https://react.dev/errors/" + f;
    if (1 < arguments.length) {
      _ += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var x = 2; x < arguments.length; x++)
        _ += "&args[]=" + encodeURIComponent(arguments[x]);
    }
    return "Minified React error #" + f + "; visit " + _ + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
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
  function h(f, _, x) {
    var g = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: d,
      key: g == null ? null : "" + g,
      children: f,
      containerInfo: _,
      implementation: x
    };
  }
  var m = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function p(f, _) {
    if (f === "font") return "";
    if (typeof _ == "string")
      return _ === "use-credentials" ? _ : "";
  }
  return Ht.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o, Ht.createPortal = function(f, _) {
    var x = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!_ || _.nodeType !== 1 && _.nodeType !== 9 && _.nodeType !== 11)
      throw Error(i(299));
    return h(f, _, null, x);
  }, Ht.flushSync = function(f) {
    var _ = m.T, x = o.p;
    try {
      if (m.T = null, o.p = 2, f) return f();
    } finally {
      m.T = _, o.p = x, o.d.f();
    }
  }, Ht.preconnect = function(f, _) {
    typeof f == "string" && (_ ? (_ = _.crossOrigin, _ = typeof _ == "string" ? _ === "use-credentials" ? _ : "" : void 0) : _ = null, o.d.C(f, _));
  }, Ht.prefetchDNS = function(f) {
    typeof f == "string" && o.d.D(f);
  }, Ht.preinit = function(f, _) {
    if (typeof f == "string" && _ && typeof _.as == "string") {
      var x = _.as, g = p(x, _.crossOrigin), y = typeof _.integrity == "string" ? _.integrity : void 0, w = typeof _.fetchPriority == "string" ? _.fetchPriority : void 0;
      x === "style" ? o.d.S(
        f,
        typeof _.precedence == "string" ? _.precedence : void 0,
        {
          crossOrigin: g,
          integrity: y,
          fetchPriority: w
        }
      ) : x === "script" && o.d.X(f, {
        crossOrigin: g,
        integrity: y,
        fetchPriority: w,
        nonce: typeof _.nonce == "string" ? _.nonce : void 0
      });
    }
  }, Ht.preinitModule = function(f, _) {
    if (typeof f == "string")
      if (typeof _ == "object" && _ !== null) {
        if (_.as == null || _.as === "script") {
          var x = p(
            _.as,
            _.crossOrigin
          );
          o.d.M(f, {
            crossOrigin: x,
            integrity: typeof _.integrity == "string" ? _.integrity : void 0,
            nonce: typeof _.nonce == "string" ? _.nonce : void 0
          });
        }
      } else _ == null && o.d.M(f);
  }, Ht.preload = function(f, _) {
    if (typeof f == "string" && typeof _ == "object" && _ !== null && typeof _.as == "string") {
      var x = _.as, g = p(x, _.crossOrigin);
      o.d.L(f, x, {
        crossOrigin: g,
        integrity: typeof _.integrity == "string" ? _.integrity : void 0,
        nonce: typeof _.nonce == "string" ? _.nonce : void 0,
        type: typeof _.type == "string" ? _.type : void 0,
        fetchPriority: typeof _.fetchPriority == "string" ? _.fetchPriority : void 0,
        referrerPolicy: typeof _.referrerPolicy == "string" ? _.referrerPolicy : void 0,
        imageSrcSet: typeof _.imageSrcSet == "string" ? _.imageSrcSet : void 0,
        imageSizes: typeof _.imageSizes == "string" ? _.imageSizes : void 0,
        media: typeof _.media == "string" ? _.media : void 0
      });
    }
  }, Ht.preloadModule = function(f, _) {
    if (typeof f == "string")
      if (_) {
        var x = p(_.as, _.crossOrigin);
        o.d.m(f, {
          as: typeof _.as == "string" && _.as !== "script" ? _.as : void 0,
          crossOrigin: x,
          integrity: typeof _.integrity == "string" ? _.integrity : void 0
        });
      } else o.d.m(f);
  }, Ht.requestFormReset = function(f) {
    o.d.r(f);
  }, Ht.unstable_batchedUpdates = function(f, _) {
    return f(_);
  }, Ht.useFormState = function(f, _, x) {
    return m.H.useFormState(f, _, x);
  }, Ht.useFormStatus = function() {
    return m.H.useHostTransitionStatus();
  }, Ht.version = "19.2.8", Ht;
}
var Qp;
function L_() {
  if (Qp) return Fu.exports;
  Qp = 1;
  function n() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
      } catch (i) {
        console.error(i);
      }
  }
  return n(), Fu.exports = Tv(), Fu.exports;
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
var Pp;
function Ev() {
  if (Pp) return di;
  Pp = 1;
  var n = Cv(), i = hd(), r = L_();
  function o(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var a = 2; a < arguments.length; a++)
        t += "&args[]=" + encodeURIComponent(arguments[a]);
    }
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function d(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function h(e) {
    var t = e, a = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
      e = t;
      do
        t = e, (t.flags & 4098) !== 0 && (a = t.return), e = t.return;
      while (e);
    }
    return t.tag === 3 ? a : null;
  }
  function m(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function p(e) {
    if (e.tag === 31) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function f(e) {
    if (h(e) !== e)
      throw Error(o(188));
  }
  function _(e) {
    var t = e.alternate;
    if (!t) {
      if (t = h(e), t === null) throw Error(o(188));
      return t !== e ? null : e;
    }
    for (var a = e, l = t; ; ) {
      var c = a.return;
      if (c === null) break;
      var u = c.alternate;
      if (u === null) {
        if (l = c.return, l !== null) {
          a = l;
          continue;
        }
        break;
      }
      if (c.child === u.child) {
        for (u = c.child; u; ) {
          if (u === a) return f(c), e;
          if (u === l) return f(c), t;
          u = u.sibling;
        }
        throw Error(o(188));
      }
      if (a.return !== l.return) a = c, l = u;
      else {
        for (var b = !1, j = c.child; j; ) {
          if (j === a) {
            b = !0, a = c, l = u;
            break;
          }
          if (j === l) {
            b = !0, l = c, a = u;
            break;
          }
          j = j.sibling;
        }
        if (!b) {
          for (j = u.child; j; ) {
            if (j === a) {
              b = !0, a = u, l = c;
              break;
            }
            if (j === l) {
              b = !0, l = u, a = c;
              break;
            }
            j = j.sibling;
          }
          if (!b) throw Error(o(189));
        }
      }
      if (a.alternate !== l) throw Error(o(190));
    }
    if (a.tag !== 3) throw Error(o(188));
    return a.stateNode.current === a ? e : t;
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
  var g = Object.assign, y = Symbol.for("react.element"), w = Symbol.for("react.transitional.element"), N = Symbol.for("react.portal"), T = Symbol.for("react.fragment"), E = Symbol.for("react.strict_mode"), M = Symbol.for("react.profiler"), C = Symbol.for("react.consumer"), U = Symbol.for("react.context"), G = Symbol.for("react.forward_ref"), X = Symbol.for("react.suspense"), L = Symbol.for("react.suspense_list"), V = Symbol.for("react.memo"), te = Symbol.for("react.lazy"), re = Symbol.for("react.activity"), se = Symbol.for("react.memo_cache_sentinel"), ce = Symbol.iterator;
  function me(e) {
    return e === null || typeof e != "object" ? null : (e = ce && e[ce] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var oe = Symbol.for("react.client.reference");
  function ge(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === oe ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case T:
        return "Fragment";
      case M:
        return "Profiler";
      case E:
        return "StrictMode";
      case X:
        return "Suspense";
      case L:
        return "SuspenseList";
      case re:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case N:
          return "Portal";
        case U:
          return e.displayName || "Context";
        case C:
          return (e._context.displayName || "Context") + ".Consumer";
        case G:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case V:
          return t = e.displayName || null, t !== null ? t : ge(e.type) || "Memo";
        case te:
          t = e._payload, e = e._init;
          try {
            return ge(e(t));
          } catch {
          }
      }
    return null;
  }
  var ue = Array.isArray, S = i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, O = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, q = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, J = [], I = -1;
  function k(e) {
    return { current: e };
  }
  function $(e) {
    0 > I || (e.current = J[I], J[I] = null, I--);
  }
  function Z(e, t) {
    I++, J[I] = e.current, e.current = t;
  }
  var ne = k(null), de = k(null), Q = k(null), le = k(null);
  function xe(e, t) {
    switch (Z(Q, t), Z(de, e), Z(ne, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? cp(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = cp(t), e = up(t, e);
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
    $(ne), Z(ne, e);
  }
  function je() {
    $(ne), $(de), $(Q);
  }
  function st(e) {
    e.memoizedState !== null && Z(le, e);
    var t = ne.current, a = up(t, e.type);
    t !== a && (Z(de, e), Z(ne, a));
  }
  function et(e) {
    de.current === e && ($(ne), $(de)), le.current === e && ($(le), li._currentValue = q);
  }
  var ke, rt;
  function he(e) {
    if (ke === void 0)
      try {
        throw Error();
      } catch (a) {
        var t = a.stack.trim().match(/\n( *(at )?)/);
        ke = t && t[1] || "", rt = -1 < a.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < a.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + ke + e + rt;
  }
  var Fe = !1;
  function _e(e, t) {
    if (!e || Fe) return "";
    Fe = !0;
    var a = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var l = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var ee = function() {
                throw Error();
              };
              if (Object.defineProperty(ee.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(ee, []);
                } catch (Y) {
                  var F = Y;
                }
                Reflect.construct(e, [], ee);
              } else {
                try {
                  ee.call();
                } catch (Y) {
                  F = Y;
                }
                e.call(ee.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (Y) {
                F = Y;
              }
              (ee = e()) && typeof ee.catch == "function" && ee.catch(function() {
              });
            }
          } catch (Y) {
            if (Y && F && typeof Y.stack == "string")
              return [Y.stack, F.stack];
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
      var u = l.DetermineComponentFrameRoot(), b = u[0], j = u[1];
      if (b && j) {
        var R = b.split(`
`), B = j.split(`
`);
        for (c = l = 0; l < R.length && !R[l].includes("DetermineComponentFrameRoot"); )
          l++;
        for (; c < B.length && !B[c].includes(
          "DetermineComponentFrameRoot"
        ); )
          c++;
        if (l === R.length || c === B.length)
          for (l = R.length - 1, c = B.length - 1; 1 <= l && 0 <= c && R[l] !== B[c]; )
            c--;
        for (; 1 <= l && 0 <= c; l--, c--)
          if (R[l] !== B[c]) {
            if (l !== 1 || c !== 1)
              do
                if (l--, c--, 0 > c || R[l] !== B[c]) {
                  var K = `
` + R[l].replace(" at new ", " at ");
                  return e.displayName && K.includes("<anonymous>") && (K = K.replace("<anonymous>", e.displayName)), K;
                }
              while (1 <= l && 0 <= c);
            break;
          }
      }
    } finally {
      Fe = !1, Error.prepareStackTrace = a;
    }
    return (a = e ? e.displayName || e.name : "") ? he(a) : "";
  }
  function Ye(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return he(e.type);
      case 16:
        return he("Lazy");
      case 13:
        return e.child !== t && t !== null ? he("Suspense Fallback") : he("Suspense");
      case 19:
        return he("SuspenseList");
      case 0:
      case 15:
        return _e(e.type, !1);
      case 11:
        return _e(e.type.render, !1);
      case 1:
        return _e(e.type, !0);
      case 31:
        return he("Activity");
      default:
        return "";
    }
  }
  function Xe(e) {
    try {
      var t = "", a = null;
      do
        t += Ye(e, a), a = e, e = e.return;
      while (e);
      return t;
    } catch (l) {
      return `
Error generating stack: ` + l.message + `
` + l.stack;
    }
  }
  var De = Object.prototype.hasOwnProperty, Dt = n.unstable_scheduleCallback, kt = n.unstable_cancelCallback, Xt = n.unstable_shouldYield, P = n.unstable_requestPaint, ve = n.unstable_now, tt = n.unstable_getCurrentPriorityLevel, pe = n.unstable_ImmediatePriority, xt = n.unstable_UserBlockingPriority, Qt = n.unstable_NormalPriority, _l = n.unstable_LowPriority, bs = n.unstable_IdlePriority, gs = n.log, xs = n.unstable_setDisableYieldValue, Un = null, vt = null;
  function Nt(e) {
    if (typeof gs == "function" && xs(e), vt && typeof vt.setStrictMode == "function")
      try {
        vt.setStrictMode(Un, e);
      } catch {
      }
  }
  var Lt = Math.clz32 ? Math.clz32 : bl, vs = Math.log, Si = Math.LN2;
  function bl(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (vs(e) / Si | 0) | 0;
  }
  var We = 256, mn = 262144, ys = 4194304;
  function Qa(e) {
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
  function ki(e, t, a) {
    var l = e.pendingLanes;
    if (l === 0) return 0;
    var c = 0, u = e.suspendedLanes, b = e.pingedLanes;
    e = e.warmLanes;
    var j = l & 134217727;
    return j !== 0 ? (l = j & ~u, l !== 0 ? c = Qa(l) : (b &= j, b !== 0 ? c = Qa(b) : a || (a = j & ~e, a !== 0 && (c = Qa(a))))) : (j = l & ~u, j !== 0 ? c = Qa(j) : b !== 0 ? c = Qa(b) : a || (a = l & ~e, a !== 0 && (c = Qa(a)))), c === 0 ? 0 : t !== 0 && t !== c && (t & u) === 0 && (u = c & -c, a = t & -t, u >= a || u === 32 && (a & 4194048) !== 0) ? t : c;
  }
  function gl(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function og(e, t) {
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
  function Vd() {
    var e = ys;
    return ys <<= 1, (ys & 62914560) === 0 && (ys = 4194304), e;
  }
  function So(e) {
    for (var t = [], a = 0; 31 > a; a++) t.push(e);
    return t;
  }
  function xl(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function cg(e, t, a, l, c, u) {
    var b = e.pendingLanes;
    e.pendingLanes = a, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= a, e.entangledLanes &= a, e.errorRecoveryDisabledLanes &= a, e.shellSuspendCounter = 0;
    var j = e.entanglements, R = e.expirationTimes, B = e.hiddenUpdates;
    for (a = b & ~a; 0 < a; ) {
      var K = 31 - Lt(a), ee = 1 << K;
      j[K] = 0, R[K] = -1;
      var F = B[K];
      if (F !== null)
        for (B[K] = null, K = 0; K < F.length; K++) {
          var Y = F[K];
          Y !== null && (Y.lane &= -536870913);
        }
      a &= ~ee;
    }
    l !== 0 && qd(e, l, 0), u !== 0 && c === 0 && e.tag !== 0 && (e.suspendedLanes |= u & ~(b & ~t));
  }
  function qd(e, t, a) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var l = 31 - Lt(t);
    e.entangledLanes |= t, e.entanglements[l] = e.entanglements[l] | 1073741824 | a & 261930;
  }
  function Yd(e, t) {
    var a = e.entangledLanes |= t;
    for (e = e.entanglements; a; ) {
      var l = 31 - Lt(a), c = 1 << l;
      c & t | e[l] & t && (e[l] |= t), a &= ~c;
    }
  }
  function Xd(e, t) {
    var a = t & -t;
    return a = (a & 42) !== 0 ? 1 : ko(a), (a & (e.suspendedLanes | t)) !== 0 ? 0 : a;
  }
  function ko(e) {
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
  function No(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Qd() {
    var e = O.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : Op(e.type));
  }
  function Pd(e, t) {
    var a = O.p;
    try {
      return O.p = e, t();
    } finally {
      O.p = a;
    }
  }
  var da = Math.random().toString(36).slice(2), Ct = "__reactFiber$" + da, Pt = "__reactProps$" + da, js = "__reactContainer$" + da, Co = "__reactEvents$" + da, ug = "__reactListeners$" + da, dg = "__reactHandles$" + da, Zd = "__reactResources$" + da, vl = "__reactMarker$" + da;
  function To(e) {
    delete e[Ct], delete e[Pt], delete e[Co], delete e[ug], delete e[dg];
  }
  function ws(e) {
    var t = e[Ct];
    if (t) return t;
    for (var a = e.parentNode; a; ) {
      if (t = a[js] || a[Ct]) {
        if (a = t.alternate, t.child !== null || a !== null && a.child !== null)
          for (e = bp(e); e !== null; ) {
            if (a = e[Ct]) return a;
            e = bp(e);
          }
        return t;
      }
      e = a, a = e.parentNode;
    }
    return null;
  }
  function Ss(e) {
    if (e = e[Ct] || e[js]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function yl(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(o(33));
  }
  function ks(e) {
    var t = e[Zd];
    return t || (t = e[Zd] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function jt(e) {
    e[vl] = !0;
  }
  var Kd = /* @__PURE__ */ new Set(), Jd = {};
  function Pa(e, t) {
    Ns(e, t), Ns(e + "Capture", t);
  }
  function Ns(e, t) {
    for (Jd[e] = t, e = 0; e < t.length; e++)
      Kd.add(t[e]);
  }
  var hg = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Id = {}, Wd = {};
  function mg(e) {
    return De.call(Wd, e) ? !0 : De.call(Id, e) ? !1 : hg.test(e) ? Wd[e] = !0 : (Id[e] = !0, !1);
  }
  function Ni(e, t, a) {
    if (mg(t))
      if (a === null) e.removeAttribute(t);
      else {
        switch (typeof a) {
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
        e.setAttribute(t, "" + a);
      }
  }
  function Ci(e, t, a) {
    if (a === null) e.removeAttribute(t);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(t);
          return;
      }
      e.setAttribute(t, "" + a);
    }
  }
  function Fn(e, t, a, l) {
    if (l === null) e.removeAttribute(a);
    else {
      switch (typeof l) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(a);
          return;
      }
      e.setAttributeNS(t, a, "" + l);
    }
  }
  function fn(e) {
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
  function eh(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function fg(e, t, a) {
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
        set: function(b) {
          a = "" + b, u.call(this, b);
        }
      }), Object.defineProperty(e, t, {
        enumerable: l.enumerable
      }), {
        getValue: function() {
          return a;
        },
        setValue: function(b) {
          a = "" + b;
        },
        stopTracking: function() {
          e._valueTracker = null, delete e[t];
        }
      };
    }
  }
  function Eo(e) {
    if (!e._valueTracker) {
      var t = eh(e) ? "checked" : "value";
      e._valueTracker = fg(
        e,
        t,
        "" + e[t]
      );
    }
  }
  function th(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var a = t.getValue(), l = "";
    return e && (l = eh(e) ? e.checked ? "true" : "false" : e.value), e = l, e !== a ? (t.setValue(e), !0) : !1;
  }
  function Ti(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var pg = /[\n"\\]/g;
  function pn(e) {
    return e.replace(
      pg,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Mo(e, t, a, l, c, u, b, j) {
    e.name = "", b != null && typeof b != "function" && typeof b != "symbol" && typeof b != "boolean" ? e.type = b : e.removeAttribute("type"), t != null ? b === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + fn(t)) : e.value !== "" + fn(t) && (e.value = "" + fn(t)) : b !== "submit" && b !== "reset" || e.removeAttribute("value"), t != null ? Ro(e, b, fn(t)) : a != null ? Ro(e, b, fn(a)) : l != null && e.removeAttribute("value"), c == null && u != null && (e.defaultChecked = !!u), c != null && (e.checked = c && typeof c != "function" && typeof c != "symbol"), j != null && typeof j != "function" && typeof j != "symbol" && typeof j != "boolean" ? e.name = "" + fn(j) : e.removeAttribute("name");
  }
  function nh(e, t, a, l, c, u, b, j) {
    if (u != null && typeof u != "function" && typeof u != "symbol" && typeof u != "boolean" && (e.type = u), t != null || a != null) {
      if (!(u !== "submit" && u !== "reset" || t != null)) {
        Eo(e);
        return;
      }
      a = a != null ? "" + fn(a) : "", t = t != null ? "" + fn(t) : a, j || t === e.value || (e.value = t), e.defaultValue = t;
    }
    l = l ?? c, l = typeof l != "function" && typeof l != "symbol" && !!l, e.checked = j ? e.checked : !!l, e.defaultChecked = !!l, b != null && typeof b != "function" && typeof b != "symbol" && typeof b != "boolean" && (e.name = b), Eo(e);
  }
  function Ro(e, t, a) {
    t === "number" && Ti(e.ownerDocument) === e || e.defaultValue === "" + a || (e.defaultValue = "" + a);
  }
  function Cs(e, t, a, l) {
    if (e = e.options, t) {
      t = {};
      for (var c = 0; c < a.length; c++)
        t["$" + a[c]] = !0;
      for (a = 0; a < e.length; a++)
        c = t.hasOwnProperty("$" + e[a].value), e[a].selected !== c && (e[a].selected = c), c && l && (e[a].defaultSelected = !0);
    } else {
      for (a = "" + fn(a), t = null, c = 0; c < e.length; c++) {
        if (e[c].value === a) {
          e[c].selected = !0, l && (e[c].defaultSelected = !0);
          return;
        }
        t !== null || e[c].disabled || (t = e[c]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function ah(e, t, a) {
    if (t != null && (t = "" + fn(t), t !== e.value && (e.value = t), a == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = a != null ? "" + fn(a) : "";
  }
  function sh(e, t, a, l) {
    if (t == null) {
      if (l != null) {
        if (a != null) throw Error(o(92));
        if (ue(l)) {
          if (1 < l.length) throw Error(o(93));
          l = l[0];
        }
        a = l;
      }
      a == null && (a = ""), t = a;
    }
    a = fn(t), e.defaultValue = a, l = e.textContent, l === a && l !== "" && l !== null && (e.value = l), Eo(e);
  }
  function Ts(e, t) {
    if (t) {
      var a = e.firstChild;
      if (a && a === e.lastChild && a.nodeType === 3) {
        a.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var _g = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function lh(e, t, a) {
    var l = t.indexOf("--") === 0;
    a == null || typeof a == "boolean" || a === "" ? l ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : l ? e.setProperty(t, a) : typeof a != "number" || a === 0 || _g.has(t) ? t === "float" ? e.cssFloat = a : e[t] = ("" + a).trim() : e[t] = a + "px";
  }
  function ih(e, t, a) {
    if (t != null && typeof t != "object")
      throw Error(o(62));
    if (e = e.style, a != null) {
      for (var l in a)
        !a.hasOwnProperty(l) || t != null && t.hasOwnProperty(l) || (l.indexOf("--") === 0 ? e.setProperty(l, "") : l === "float" ? e.cssFloat = "" : e[l] = "");
      for (var c in t)
        l = t[c], t.hasOwnProperty(c) && a[c] !== l && lh(e, c, l);
    } else
      for (var u in t)
        t.hasOwnProperty(u) && lh(e, u, t[u]);
  }
  function Ao(e) {
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
  var bg = /* @__PURE__ */ new Map([
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
  ]), gg = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Ei(e) {
    return gg.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  function Gn() {
  }
  var Oo = null;
  function zo(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Es = null, Ms = null;
  function rh(e) {
    var t = Ss(e);
    if (t && (e = t.stateNode)) {
      var a = e[Pt] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (Mo(
            e,
            a.value,
            a.defaultValue,
            a.defaultValue,
            a.checked,
            a.defaultChecked,
            a.type,
            a.name
          ), t = a.name, a.type === "radio" && t != null) {
            for (a = e; a.parentNode; ) a = a.parentNode;
            for (a = a.querySelectorAll(
              'input[name="' + pn(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < a.length; t++) {
              var l = a[t];
              if (l !== e && l.form === e.form) {
                var c = l[Pt] || null;
                if (!c) throw Error(o(90));
                Mo(
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
            for (t = 0; t < a.length; t++)
              l = a[t], l.form === e.form && th(l);
          }
          break e;
        case "textarea":
          ah(e, a.value, a.defaultValue);
          break e;
        case "select":
          t = a.value, t != null && Cs(e, !!a.multiple, t, !1);
      }
    }
  }
  var Do = !1;
  function oh(e, t, a) {
    if (Do) return e(t, a);
    Do = !0;
    try {
      var l = e(t);
      return l;
    } finally {
      if (Do = !1, (Es !== null || Ms !== null) && (_r(), Es && (t = Es, e = Ms, Ms = Es = null, rh(t), e)))
        for (t = 0; t < e.length; t++) rh(e[t]);
    }
  }
  function jl(e, t) {
    var a = e.stateNode;
    if (a === null) return null;
    var l = a[Pt] || null;
    if (l === null) return null;
    a = l[t];
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
    if (a && typeof a != "function")
      throw Error(
        o(231, t, typeof a)
      );
    return a;
  }
  var Vn = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Lo = !1;
  if (Vn)
    try {
      var wl = {};
      Object.defineProperty(wl, "passive", {
        get: function() {
          Lo = !0;
        }
      }), window.addEventListener("test", wl, wl), window.removeEventListener("test", wl, wl);
    } catch {
      Lo = !1;
    }
  var ha = null, Ho = null, Mi = null;
  function ch() {
    if (Mi) return Mi;
    var e, t = Ho, a = t.length, l, c = "value" in ha ? ha.value : ha.textContent, u = c.length;
    for (e = 0; e < a && t[e] === c[e]; e++) ;
    var b = a - e;
    for (l = 1; l <= b && t[a - l] === c[u - l]; l++) ;
    return Mi = c.slice(e, 1 < l ? 1 - l : void 0);
  }
  function Ri(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Ai() {
    return !0;
  }
  function uh() {
    return !1;
  }
  function Zt(e) {
    function t(a, l, c, u, b) {
      this._reactName = a, this._targetInst = c, this.type = l, this.nativeEvent = u, this.target = b, this.currentTarget = null;
      for (var j in e)
        e.hasOwnProperty(j) && (a = e[j], this[j] = a ? a(u) : u[j]);
      return this.isDefaultPrevented = (u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1) ? Ai : uh, this.isPropagationStopped = uh, this;
    }
    return g(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var a = this.nativeEvent;
        a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = Ai);
      },
      stopPropagation: function() {
        var a = this.nativeEvent;
        a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = Ai);
      },
      persist: function() {
      },
      isPersistent: Ai
    }), t;
  }
  var Za = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, Oi = Zt(Za), Sl = g({}, Za, { view: 0, detail: 0 }), xg = Zt(Sl), $o, Bo, kl, zi = g({}, Sl, {
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
    getModifierState: Fo,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== kl && (kl && e.type === "mousemove" ? ($o = e.screenX - kl.screenX, Bo = e.screenY - kl.screenY) : Bo = $o = 0, kl = e), $o);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : Bo;
    }
  }), dh = Zt(zi), vg = g({}, zi, { dataTransfer: 0 }), yg = Zt(vg), jg = g({}, Sl, { relatedTarget: 0 }), Uo = Zt(jg), wg = g({}, Za, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Sg = Zt(wg), kg = g({}, Za, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), Ng = Zt(kg), Cg = g({}, Za, { data: 0 }), hh = Zt(Cg), Tg = {
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
  }, Eg = {
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
  }, Mg = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function Rg(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Mg[e]) ? !!t[e] : !1;
  }
  function Fo() {
    return Rg;
  }
  var Ag = g({}, Sl, {
    key: function(e) {
      if (e.key) {
        var t = Tg[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = Ri(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Eg[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Fo,
    charCode: function(e) {
      return e.type === "keypress" ? Ri(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? Ri(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), Og = Zt(Ag), zg = g({}, zi, {
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
  }), mh = Zt(zg), Dg = g({}, Sl, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Fo
  }), Lg = Zt(Dg), Hg = g({}, Za, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), $g = Zt(Hg), Bg = g({}, zi, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Ug = Zt(Bg), Fg = g({}, Za, {
    newState: 0,
    oldState: 0
  }), Gg = Zt(Fg), Vg = [9, 13, 27, 32], Go = Vn && "CompositionEvent" in window, Nl = null;
  Vn && "documentMode" in document && (Nl = document.documentMode);
  var qg = Vn && "TextEvent" in window && !Nl, fh = Vn && (!Go || Nl && 8 < Nl && 11 >= Nl), ph = " ", _h = !1;
  function bh(e, t) {
    switch (e) {
      case "keyup":
        return Vg.indexOf(t.keyCode) !== -1;
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
  function gh(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Rs = !1;
  function Yg(e, t) {
    switch (e) {
      case "compositionend":
        return gh(t);
      case "keypress":
        return t.which !== 32 ? null : (_h = !0, ph);
      case "textInput":
        return e = t.data, e === ph && _h ? null : e;
      default:
        return null;
    }
  }
  function Xg(e, t) {
    if (Rs)
      return e === "compositionend" || !Go && bh(e, t) ? (e = ch(), Mi = Ho = ha = null, Rs = !1, e) : null;
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
        return fh && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Qg = {
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
  function xh(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Qg[e.type] : t === "textarea";
  }
  function vh(e, t, a, l) {
    Es ? Ms ? Ms.push(l) : Ms = [l] : Es = l, t = wr(t, "onChange"), 0 < t.length && (a = new Oi(
      "onChange",
      "change",
      null,
      a,
      l
    ), e.push({ event: a, listeners: t }));
  }
  var Cl = null, Tl = null;
  function Pg(e) {
    ap(e, 0);
  }
  function Di(e) {
    var t = yl(e);
    if (th(t)) return e;
  }
  function yh(e, t) {
    if (e === "change") return t;
  }
  var jh = !1;
  if (Vn) {
    var Vo;
    if (Vn) {
      var qo = "oninput" in document;
      if (!qo) {
        var wh = document.createElement("div");
        wh.setAttribute("oninput", "return;"), qo = typeof wh.oninput == "function";
      }
      Vo = qo;
    } else Vo = !1;
    jh = Vo && (!document.documentMode || 9 < document.documentMode);
  }
  function Sh() {
    Cl && (Cl.detachEvent("onpropertychange", kh), Tl = Cl = null);
  }
  function kh(e) {
    if (e.propertyName === "value" && Di(Tl)) {
      var t = [];
      vh(
        t,
        Tl,
        e,
        zo(e)
      ), oh(Pg, t);
    }
  }
  function Zg(e, t, a) {
    e === "focusin" ? (Sh(), Cl = t, Tl = a, Cl.attachEvent("onpropertychange", kh)) : e === "focusout" && Sh();
  }
  function Kg(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return Di(Tl);
  }
  function Jg(e, t) {
    if (e === "click") return Di(t);
  }
  function Ig(e, t) {
    if (e === "input" || e === "change")
      return Di(t);
  }
  function Wg(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var an = typeof Object.is == "function" ? Object.is : Wg;
  function El(e, t) {
    if (an(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var a = Object.keys(e), l = Object.keys(t);
    if (a.length !== l.length) return !1;
    for (l = 0; l < a.length; l++) {
      var c = a[l];
      if (!De.call(t, c) || !an(e[c], t[c]))
        return !1;
    }
    return !0;
  }
  function Nh(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Ch(e, t) {
    var a = Nh(e);
    e = 0;
    for (var l; a; ) {
      if (a.nodeType === 3) {
        if (l = e + a.textContent.length, e <= t && l >= t)
          return { node: a, offset: t - e };
        e = l;
      }
      e: {
        for (; a; ) {
          if (a.nextSibling) {
            a = a.nextSibling;
            break e;
          }
          a = a.parentNode;
        }
        a = void 0;
      }
      a = Nh(a);
    }
  }
  function Th(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Th(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Eh(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = Ti(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var a = typeof t.contentWindow.location.href == "string";
      } catch {
        a = !1;
      }
      if (a) e = t.contentWindow;
      else break;
      t = Ti(e.document);
    }
    return t;
  }
  function Yo(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var ex = Vn && "documentMode" in document && 11 >= document.documentMode, As = null, Xo = null, Ml = null, Qo = !1;
  function Mh(e, t, a) {
    var l = a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
    Qo || As == null || As !== Ti(l) || (l = As, "selectionStart" in l && Yo(l) ? l = { start: l.selectionStart, end: l.selectionEnd } : (l = (l.ownerDocument && l.ownerDocument.defaultView || window).getSelection(), l = {
      anchorNode: l.anchorNode,
      anchorOffset: l.anchorOffset,
      focusNode: l.focusNode,
      focusOffset: l.focusOffset
    }), Ml && El(Ml, l) || (Ml = l, l = wr(Xo, "onSelect"), 0 < l.length && (t = new Oi(
      "onSelect",
      "select",
      null,
      t,
      a
    ), e.push({ event: t, listeners: l }), t.target = As)));
  }
  function Ka(e, t) {
    var a = {};
    return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
  }
  var Os = {
    animationend: Ka("Animation", "AnimationEnd"),
    animationiteration: Ka("Animation", "AnimationIteration"),
    animationstart: Ka("Animation", "AnimationStart"),
    transitionrun: Ka("Transition", "TransitionRun"),
    transitionstart: Ka("Transition", "TransitionStart"),
    transitioncancel: Ka("Transition", "TransitionCancel"),
    transitionend: Ka("Transition", "TransitionEnd")
  }, Po = {}, Rh = {};
  Vn && (Rh = document.createElement("div").style, "AnimationEvent" in window || (delete Os.animationend.animation, delete Os.animationiteration.animation, delete Os.animationstart.animation), "TransitionEvent" in window || delete Os.transitionend.transition);
  function Ja(e) {
    if (Po[e]) return Po[e];
    if (!Os[e]) return e;
    var t = Os[e], a;
    for (a in t)
      if (t.hasOwnProperty(a) && a in Rh)
        return Po[e] = t[a];
    return e;
  }
  var Ah = Ja("animationend"), Oh = Ja("animationiteration"), zh = Ja("animationstart"), tx = Ja("transitionrun"), nx = Ja("transitionstart"), ax = Ja("transitioncancel"), Dh = Ja("transitionend"), Lh = /* @__PURE__ */ new Map(), Zo = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Zo.push("scrollEnd");
  function kn(e, t) {
    Lh.set(e, t), Pa(t, [e]);
  }
  var Li = typeof reportError == "function" ? reportError : function(e) {
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
  }, _n = [], zs = 0, Ko = 0;
  function Hi() {
    for (var e = zs, t = Ko = zs = 0; t < e; ) {
      var a = _n[t];
      _n[t++] = null;
      var l = _n[t];
      _n[t++] = null;
      var c = _n[t];
      _n[t++] = null;
      var u = _n[t];
      if (_n[t++] = null, l !== null && c !== null) {
        var b = l.pending;
        b === null ? c.next = c : (c.next = b.next, b.next = c), l.pending = c;
      }
      u !== 0 && Hh(a, c, u);
    }
  }
  function $i(e, t, a, l) {
    _n[zs++] = e, _n[zs++] = t, _n[zs++] = a, _n[zs++] = l, Ko |= l, e.lanes |= l, e = e.alternate, e !== null && (e.lanes |= l);
  }
  function Jo(e, t, a, l) {
    return $i(e, t, a, l), Bi(e);
  }
  function Ia(e, t) {
    return $i(e, null, null, t), Bi(e);
  }
  function Hh(e, t, a) {
    e.lanes |= a;
    var l = e.alternate;
    l !== null && (l.lanes |= a);
    for (var c = !1, u = e.return; u !== null; )
      u.childLanes |= a, l = u.alternate, l !== null && (l.childLanes |= a), u.tag === 22 && (e = u.stateNode, e === null || e._visibility & 1 || (c = !0)), e = u, u = u.return;
    return e.tag === 3 ? (u = e.stateNode, c && t !== null && (c = 31 - Lt(a), e = u.hiddenUpdates, l = e[c], l === null ? e[c] = [t] : l.push(t), t.lane = a | 536870912), u) : null;
  }
  function Bi(e) {
    if (50 < Il)
      throw Il = 0, iu = null, Error(o(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var Ds = {};
  function sx(e, t, a, l) {
    this.tag = e, this.key = a, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = l, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function sn(e, t, a, l) {
    return new sx(e, t, a, l);
  }
  function Io(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function qn(e, t) {
    var a = e.alternate;
    return a === null ? (a = sn(
      e.tag,
      t,
      e.key,
      e.mode
    ), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = 0, a.subtreeFlags = 0, a.deletions = null), a.flags = e.flags & 65011712, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue, t = e.dependencies, a.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.refCleanup = e.refCleanup, a;
  }
  function $h(e, t) {
    e.flags &= 65011714;
    var a = e.alternate;
    return a === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type, t = a.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function Ui(e, t, a, l, c, u) {
    var b = 0;
    if (l = e, typeof e == "function") Io(e) && (b = 1);
    else if (typeof e == "string")
      b = cv(
        e,
        a,
        ne.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case re:
          return e = sn(31, a, t, c), e.elementType = re, e.lanes = u, e;
        case T:
          return Wa(a.children, c, u, t);
        case E:
          b = 8, c |= 24;
          break;
        case M:
          return e = sn(12, a, t, c | 2), e.elementType = M, e.lanes = u, e;
        case X:
          return e = sn(13, a, t, c), e.elementType = X, e.lanes = u, e;
        case L:
          return e = sn(19, a, t, c), e.elementType = L, e.lanes = u, e;
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case U:
                b = 10;
                break e;
              case C:
                b = 9;
                break e;
              case G:
                b = 11;
                break e;
              case V:
                b = 14;
                break e;
              case te:
                b = 16, l = null;
                break e;
            }
          b = 29, a = Error(
            o(130, e === null ? "null" : typeof e, "")
          ), l = null;
      }
    return t = sn(b, a, t, c), t.elementType = e, t.type = l, t.lanes = u, t;
  }
  function Wa(e, t, a, l) {
    return e = sn(7, e, l, t), e.lanes = a, e;
  }
  function Wo(e, t, a) {
    return e = sn(6, e, null, t), e.lanes = a, e;
  }
  function Bh(e) {
    var t = sn(18, null, null, 0);
    return t.stateNode = e, t;
  }
  function ec(e, t, a) {
    return t = sn(
      4,
      e.children !== null ? e.children : [],
      e.key,
      t
    ), t.lanes = a, t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation
    }, t;
  }
  var Uh = /* @__PURE__ */ new WeakMap();
  function bn(e, t) {
    if (typeof e == "object" && e !== null) {
      var a = Uh.get(e);
      return a !== void 0 ? a : (t = {
        value: e,
        source: t,
        stack: Xe(t)
      }, Uh.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: Xe(t)
    };
  }
  var Ls = [], Hs = 0, Fi = null, Rl = 0, gn = [], xn = 0, ma = null, Mn = 1, Rn = "";
  function Yn(e, t) {
    Ls[Hs++] = Rl, Ls[Hs++] = Fi, Fi = e, Rl = t;
  }
  function Fh(e, t, a) {
    gn[xn++] = Mn, gn[xn++] = Rn, gn[xn++] = ma, ma = e;
    var l = Mn;
    e = Rn;
    var c = 32 - Lt(l) - 1;
    l &= ~(1 << c), a += 1;
    var u = 32 - Lt(t) + c;
    if (30 < u) {
      var b = c - c % 5;
      u = (l & (1 << b) - 1).toString(32), l >>= b, c -= b, Mn = 1 << 32 - Lt(t) + c | a << c | l, Rn = u + e;
    } else
      Mn = 1 << u | a << c | l, Rn = e;
  }
  function tc(e) {
    e.return !== null && (Yn(e, 1), Fh(e, 1, 0));
  }
  function nc(e) {
    for (; e === Fi; )
      Fi = Ls[--Hs], Ls[Hs] = null, Rl = Ls[--Hs], Ls[Hs] = null;
    for (; e === ma; )
      ma = gn[--xn], gn[xn] = null, Rn = gn[--xn], gn[xn] = null, Mn = gn[--xn], gn[xn] = null;
  }
  function Gh(e, t) {
    gn[xn++] = Mn, gn[xn++] = Rn, gn[xn++] = ma, Mn = t.id, Rn = t.overflow, ma = e;
  }
  var Tt = null, nt = null, Le = !1, fa = null, vn = !1, ac = Error(o(519));
  function pa(e) {
    var t = Error(
      o(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw Al(bn(t, e)), ac;
  }
  function Vh(e) {
    var t = e.stateNode, a = e.type, l = e.memoizedProps;
    switch (t[Ct] = e, t[Pt] = l, a) {
      case "dialog":
        Ae("cancel", t), Ae("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        Ae("load", t);
        break;
      case "video":
      case "audio":
        for (a = 0; a < ei.length; a++)
          Ae(ei[a], t);
        break;
      case "source":
        Ae("error", t);
        break;
      case "img":
      case "image":
      case "link":
        Ae("error", t), Ae("load", t);
        break;
      case "details":
        Ae("toggle", t);
        break;
      case "input":
        Ae("invalid", t), nh(
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
        Ae("invalid", t);
        break;
      case "textarea":
        Ae("invalid", t), sh(t, l.value, l.defaultValue, l.children);
    }
    a = l.children, typeof a != "string" && typeof a != "number" && typeof a != "bigint" || t.textContent === "" + a || l.suppressHydrationWarning === !0 || rp(t.textContent, a) ? (l.popover != null && (Ae("beforetoggle", t), Ae("toggle", t)), l.onScroll != null && Ae("scroll", t), l.onScrollEnd != null && Ae("scrollend", t), l.onClick != null && (t.onclick = Gn), t = !0) : t = !1, t || pa(e, !0);
  }
  function qh(e) {
    for (Tt = e.return; Tt; )
      switch (Tt.tag) {
        case 5:
        case 31:
        case 13:
          vn = !1;
          return;
        case 27:
        case 3:
          vn = !0;
          return;
        default:
          Tt = Tt.return;
      }
  }
  function $s(e) {
    if (e !== Tt) return !1;
    if (!Le) return qh(e), Le = !0, !1;
    var t = e.tag, a;
    if ((a = t !== 3 && t !== 27) && ((a = t === 5) && (a = e.type, a = !(a !== "form" && a !== "button") || yu(e.type, e.memoizedProps)), a = !a), a && nt && pa(e), qh(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
      nt = _p(e);
    } else if (t === 31) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
      nt = _p(e);
    } else
      t === 27 ? (t = nt, Ea(e.type) ? (e = Nu, Nu = null, nt = e) : nt = t) : nt = Tt ? jn(e.stateNode.nextSibling) : null;
    return !0;
  }
  function es() {
    nt = Tt = null, Le = !1;
  }
  function sc() {
    var e = fa;
    return e !== null && (Wt === null ? Wt = e : Wt.push.apply(
      Wt,
      e
    ), fa = null), e;
  }
  function Al(e) {
    fa === null ? fa = [e] : fa.push(e);
  }
  var lc = k(null), ts = null, Xn = null;
  function _a(e, t, a) {
    Z(lc, t._currentValue), t._currentValue = a;
  }
  function Qn(e) {
    e._currentValue = lc.current, $(lc);
  }
  function ic(e, t, a) {
    for (; e !== null; ) {
      var l = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, l !== null && (l.childLanes |= t)) : l !== null && (l.childLanes & t) !== t && (l.childLanes |= t), e === a) break;
      e = e.return;
    }
  }
  function rc(e, t, a, l) {
    var c = e.child;
    for (c !== null && (c.return = e); c !== null; ) {
      var u = c.dependencies;
      if (u !== null) {
        var b = c.child;
        u = u.firstContext;
        e: for (; u !== null; ) {
          var j = u;
          u = c;
          for (var R = 0; R < t.length; R++)
            if (j.context === t[R]) {
              u.lanes |= a, j = u.alternate, j !== null && (j.lanes |= a), ic(
                u.return,
                a,
                e
              ), l || (b = null);
              break e;
            }
          u = j.next;
        }
      } else if (c.tag === 18) {
        if (b = c.return, b === null) throw Error(o(341));
        b.lanes |= a, u = b.alternate, u !== null && (u.lanes |= a), ic(b, a, e), b = null;
      } else b = c.child;
      if (b !== null) b.return = c;
      else
        for (b = c; b !== null; ) {
          if (b === e) {
            b = null;
            break;
          }
          if (c = b.sibling, c !== null) {
            c.return = b.return, b = c;
            break;
          }
          b = b.return;
        }
      c = b;
    }
  }
  function Bs(e, t, a, l) {
    e = null;
    for (var c = t, u = !1; c !== null; ) {
      if (!u) {
        if ((c.flags & 524288) !== 0) u = !0;
        else if ((c.flags & 262144) !== 0) break;
      }
      if (c.tag === 10) {
        var b = c.alternate;
        if (b === null) throw Error(o(387));
        if (b = b.memoizedProps, b !== null) {
          var j = c.type;
          an(c.pendingProps.value, b.value) || (e !== null ? e.push(j) : e = [j]);
        }
      } else if (c === le.current) {
        if (b = c.alternate, b === null) throw Error(o(387));
        b.memoizedState.memoizedState !== c.memoizedState.memoizedState && (e !== null ? e.push(li) : e = [li]);
      }
      c = c.return;
    }
    e !== null && rc(
      t,
      e,
      a,
      l
    ), t.flags |= 262144;
  }
  function Gi(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!an(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function ns(e) {
    ts = e, Xn = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function Et(e) {
    return Yh(ts, e);
  }
  function Vi(e, t) {
    return ts === null && ns(e), Yh(e, t);
  }
  function Yh(e, t) {
    var a = t._currentValue;
    if (t = { context: t, memoizedValue: a, next: null }, Xn === null) {
      if (e === null) throw Error(o(308));
      Xn = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else Xn = Xn.next = t;
    return a;
  }
  var lx = typeof AbortController < "u" ? AbortController : function() {
    var e = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(a, l) {
        e.push(l);
      }
    };
    this.abort = function() {
      t.aborted = !0, e.forEach(function(a) {
        return a();
      });
    };
  }, ix = n.unstable_scheduleCallback, rx = n.unstable_NormalPriority, mt = {
    $$typeof: U,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function oc() {
    return {
      controller: new lx(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Ol(e) {
    e.refCount--, e.refCount === 0 && ix(rx, function() {
      e.controller.abort();
    });
  }
  var zl = null, cc = 0, Us = 0, Fs = null;
  function ox(e, t) {
    if (zl === null) {
      var a = zl = [];
      cc = 0, Us = hu(), Fs = {
        status: "pending",
        value: void 0,
        then: function(l) {
          a.push(l);
        }
      };
    }
    return cc++, t.then(Xh, Xh), t;
  }
  function Xh() {
    if (--cc === 0 && zl !== null) {
      Fs !== null && (Fs.status = "fulfilled");
      var e = zl;
      zl = null, Us = 0, Fs = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function cx(e, t) {
    var a = [], l = {
      status: "pending",
      value: null,
      reason: null,
      then: function(c) {
        a.push(c);
      }
    };
    return e.then(
      function() {
        l.status = "fulfilled", l.value = t;
        for (var c = 0; c < a.length; c++) (0, a[c])(t);
      },
      function(c) {
        for (l.status = "rejected", l.reason = c, c = 0; c < a.length; c++)
          (0, a[c])(void 0);
      }
    ), l;
  }
  var Qh = S.S;
  S.S = function(e, t) {
    Rf = ve(), typeof t == "object" && t !== null && typeof t.then == "function" && ox(e, t), Qh !== null && Qh(e, t);
  };
  var as = k(null);
  function uc() {
    var e = as.current;
    return e !== null ? e : Ke.pooledCache;
  }
  function qi(e, t) {
    t === null ? Z(as, as.current) : Z(as, t.pool);
  }
  function Ph() {
    var e = uc();
    return e === null ? null : { parent: mt._currentValue, pool: e };
  }
  var Gs = Error(o(460)), dc = Error(o(474)), Yi = Error(o(542)), Xi = { then: function() {
  } };
  function Zh(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function Kh(e, t, a) {
    switch (a = e[a], a === void 0 ? e.push(t) : a !== t && (t.then(Gn, Gn), t = a), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, Ih(e), e;
      default:
        if (typeof t.status == "string") t.then(Gn, Gn);
        else {
          if (e = Ke, e !== null && 100 < e.shellSuspendCounter)
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
            throw e = t.reason, Ih(e), e;
        }
        throw ls = t, Gs;
    }
  }
  function ss(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (a) {
      throw a !== null && typeof a == "object" && typeof a.then == "function" ? (ls = a, Gs) : a;
    }
  }
  var ls = null;
  function Jh() {
    if (ls === null) throw Error(o(459));
    var e = ls;
    return ls = null, e;
  }
  function Ih(e) {
    if (e === Gs || e === Yi)
      throw Error(o(483));
  }
  var Vs = null, Dl = 0;
  function Qi(e) {
    var t = Dl;
    return Dl += 1, Vs === null && (Vs = []), Kh(Vs, e, t);
  }
  function Ll(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function Pi(e, t) {
    throw t.$$typeof === y ? Error(o(525)) : (e = Object.prototype.toString.call(t), Error(
      o(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function Wh(e) {
    function t(D, A) {
      if (e) {
        var H = D.deletions;
        H === null ? (D.deletions = [A], D.flags |= 16) : H.push(A);
      }
    }
    function a(D, A) {
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
      return D = qn(D, A), D.index = 0, D.sibling = null, D;
    }
    function u(D, A, H) {
      return D.index = H, e ? (H = D.alternate, H !== null ? (H = H.index, H < A ? (D.flags |= 67108866, A) : H) : (D.flags |= 67108866, A)) : (D.flags |= 1048576, A);
    }
    function b(D) {
      return e && D.alternate === null && (D.flags |= 67108866), D;
    }
    function j(D, A, H, W) {
      return A === null || A.tag !== 6 ? (A = Wo(H, D.mode, W), A.return = D, A) : (A = c(A, H), A.return = D, A);
    }
    function R(D, A, H, W) {
      var ye = H.type;
      return ye === T ? K(
        D,
        A,
        H.props.children,
        W,
        H.key
      ) : A !== null && (A.elementType === ye || typeof ye == "object" && ye !== null && ye.$$typeof === te && ss(ye) === A.type) ? (A = c(A, H.props), Ll(A, H), A.return = D, A) : (A = Ui(
        H.type,
        H.key,
        H.props,
        null,
        D.mode,
        W
      ), Ll(A, H), A.return = D, A);
    }
    function B(D, A, H, W) {
      return A === null || A.tag !== 4 || A.stateNode.containerInfo !== H.containerInfo || A.stateNode.implementation !== H.implementation ? (A = ec(H, D.mode, W), A.return = D, A) : (A = c(A, H.children || []), A.return = D, A);
    }
    function K(D, A, H, W, ye) {
      return A === null || A.tag !== 7 ? (A = Wa(
        H,
        D.mode,
        W,
        ye
      ), A.return = D, A) : (A = c(A, H), A.return = D, A);
    }
    function ee(D, A, H) {
      if (typeof A == "string" && A !== "" || typeof A == "number" || typeof A == "bigint")
        return A = Wo(
          "" + A,
          D.mode,
          H
        ), A.return = D, A;
      if (typeof A == "object" && A !== null) {
        switch (A.$$typeof) {
          case w:
            return H = Ui(
              A.type,
              A.key,
              A.props,
              null,
              D.mode,
              H
            ), Ll(H, A), H.return = D, H;
          case N:
            return A = ec(
              A,
              D.mode,
              H
            ), A.return = D, A;
          case te:
            return A = ss(A), ee(D, A, H);
        }
        if (ue(A) || me(A))
          return A = Wa(
            A,
            D.mode,
            H,
            null
          ), A.return = D, A;
        if (typeof A.then == "function")
          return ee(D, Qi(A), H);
        if (A.$$typeof === U)
          return ee(
            D,
            Vi(D, A),
            H
          );
        Pi(D, A);
      }
      return null;
    }
    function F(D, A, H, W) {
      var ye = A !== null ? A.key : null;
      if (typeof H == "string" && H !== "" || typeof H == "number" || typeof H == "bigint")
        return ye !== null ? null : j(D, A, "" + H, W);
      if (typeof H == "object" && H !== null) {
        switch (H.$$typeof) {
          case w:
            return H.key === ye ? R(D, A, H, W) : null;
          case N:
            return H.key === ye ? B(D, A, H, W) : null;
          case te:
            return H = ss(H), F(D, A, H, W);
        }
        if (ue(H) || me(H))
          return ye !== null ? null : K(D, A, H, W, null);
        if (typeof H.then == "function")
          return F(
            D,
            A,
            Qi(H),
            W
          );
        if (H.$$typeof === U)
          return F(
            D,
            A,
            Vi(D, H),
            W
          );
        Pi(D, H);
      }
      return null;
    }
    function Y(D, A, H, W, ye) {
      if (typeof W == "string" && W !== "" || typeof W == "number" || typeof W == "bigint")
        return D = D.get(H) || null, j(A, D, "" + W, ye);
      if (typeof W == "object" && W !== null) {
        switch (W.$$typeof) {
          case w:
            return D = D.get(
              W.key === null ? H : W.key
            ) || null, R(A, D, W, ye);
          case N:
            return D = D.get(
              W.key === null ? H : W.key
            ) || null, B(A, D, W, ye);
          case te:
            return W = ss(W), Y(
              D,
              A,
              H,
              W,
              ye
            );
        }
        if (ue(W) || me(W))
          return D = D.get(H) || null, K(A, D, W, ye, null);
        if (typeof W.then == "function")
          return Y(
            D,
            A,
            H,
            Qi(W),
            ye
          );
        if (W.$$typeof === U)
          return Y(
            D,
            A,
            H,
            Vi(A, W),
            ye
          );
        Pi(A, W);
      }
      return null;
    }
    function fe(D, A, H, W) {
      for (var ye = null, $e = null, be = A, Ee = A = 0, ze = null; be !== null && Ee < H.length; Ee++) {
        be.index > Ee ? (ze = be, be = null) : ze = be.sibling;
        var Be = F(
          D,
          be,
          H[Ee],
          W
        );
        if (Be === null) {
          be === null && (be = ze);
          break;
        }
        e && be && Be.alternate === null && t(D, be), A = u(Be, A, Ee), $e === null ? ye = Be : $e.sibling = Be, $e = Be, be = ze;
      }
      if (Ee === H.length)
        return a(D, be), Le && Yn(D, Ee), ye;
      if (be === null) {
        for (; Ee < H.length; Ee++)
          be = ee(D, H[Ee], W), be !== null && (A = u(
            be,
            A,
            Ee
          ), $e === null ? ye = be : $e.sibling = be, $e = be);
        return Le && Yn(D, Ee), ye;
      }
      for (be = l(be); Ee < H.length; Ee++)
        ze = Y(
          be,
          D,
          Ee,
          H[Ee],
          W
        ), ze !== null && (e && ze.alternate !== null && be.delete(
          ze.key === null ? Ee : ze.key
        ), A = u(
          ze,
          A,
          Ee
        ), $e === null ? ye = ze : $e.sibling = ze, $e = ze);
      return e && be.forEach(function(za) {
        return t(D, za);
      }), Le && Yn(D, Ee), ye;
    }
    function Se(D, A, H, W) {
      if (H == null) throw Error(o(151));
      for (var ye = null, $e = null, be = A, Ee = A = 0, ze = null, Be = H.next(); be !== null && !Be.done; Ee++, Be = H.next()) {
        be.index > Ee ? (ze = be, be = null) : ze = be.sibling;
        var za = F(D, be, Be.value, W);
        if (za === null) {
          be === null && (be = ze);
          break;
        }
        e && be && za.alternate === null && t(D, be), A = u(za, A, Ee), $e === null ? ye = za : $e.sibling = za, $e = za, be = ze;
      }
      if (Be.done)
        return a(D, be), Le && Yn(D, Ee), ye;
      if (be === null) {
        for (; !Be.done; Ee++, Be = H.next())
          Be = ee(D, Be.value, W), Be !== null && (A = u(Be, A, Ee), $e === null ? ye = Be : $e.sibling = Be, $e = Be);
        return Le && Yn(D, Ee), ye;
      }
      for (be = l(be); !Be.done; Ee++, Be = H.next())
        Be = Y(be, D, Ee, Be.value, W), Be !== null && (e && Be.alternate !== null && be.delete(Be.key === null ? Ee : Be.key), A = u(Be, A, Ee), $e === null ? ye = Be : $e.sibling = Be, $e = Be);
      return e && be.forEach(function(vv) {
        return t(D, vv);
      }), Le && Yn(D, Ee), ye;
    }
    function Ze(D, A, H, W) {
      if (typeof H == "object" && H !== null && H.type === T && H.key === null && (H = H.props.children), typeof H == "object" && H !== null) {
        switch (H.$$typeof) {
          case w:
            e: {
              for (var ye = H.key; A !== null; ) {
                if (A.key === ye) {
                  if (ye = H.type, ye === T) {
                    if (A.tag === 7) {
                      a(
                        D,
                        A.sibling
                      ), W = c(
                        A,
                        H.props.children
                      ), W.return = D, D = W;
                      break e;
                    }
                  } else if (A.elementType === ye || typeof ye == "object" && ye !== null && ye.$$typeof === te && ss(ye) === A.type) {
                    a(
                      D,
                      A.sibling
                    ), W = c(A, H.props), Ll(W, H), W.return = D, D = W;
                    break e;
                  }
                  a(D, A);
                  break;
                } else t(D, A);
                A = A.sibling;
              }
              H.type === T ? (W = Wa(
                H.props.children,
                D.mode,
                W,
                H.key
              ), W.return = D, D = W) : (W = Ui(
                H.type,
                H.key,
                H.props,
                null,
                D.mode,
                W
              ), Ll(W, H), W.return = D, D = W);
            }
            return b(D);
          case N:
            e: {
              for (ye = H.key; A !== null; ) {
                if (A.key === ye)
                  if (A.tag === 4 && A.stateNode.containerInfo === H.containerInfo && A.stateNode.implementation === H.implementation) {
                    a(
                      D,
                      A.sibling
                    ), W = c(A, H.children || []), W.return = D, D = W;
                    break e;
                  } else {
                    a(D, A);
                    break;
                  }
                else t(D, A);
                A = A.sibling;
              }
              W = ec(H, D.mode, W), W.return = D, D = W;
            }
            return b(D);
          case te:
            return H = ss(H), Ze(
              D,
              A,
              H,
              W
            );
        }
        if (ue(H))
          return fe(
            D,
            A,
            H,
            W
          );
        if (me(H)) {
          if (ye = me(H), typeof ye != "function") throw Error(o(150));
          return H = ye.call(H), Se(
            D,
            A,
            H,
            W
          );
        }
        if (typeof H.then == "function")
          return Ze(
            D,
            A,
            Qi(H),
            W
          );
        if (H.$$typeof === U)
          return Ze(
            D,
            A,
            Vi(D, H),
            W
          );
        Pi(D, H);
      }
      return typeof H == "string" && H !== "" || typeof H == "number" || typeof H == "bigint" ? (H = "" + H, A !== null && A.tag === 6 ? (a(D, A.sibling), W = c(A, H), W.return = D, D = W) : (a(D, A), W = Wo(H, D.mode, W), W.return = D, D = W), b(D)) : a(D, A);
    }
    return function(D, A, H, W) {
      try {
        Dl = 0;
        var ye = Ze(
          D,
          A,
          H,
          W
        );
        return Vs = null, ye;
      } catch (be) {
        if (be === Gs || be === Yi) throw be;
        var $e = sn(29, be, null, D.mode);
        return $e.lanes = W, $e.return = D, $e;
      } finally {
      }
    };
  }
  var is = Wh(!0), em = Wh(!1), ba = !1;
  function hc(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function mc(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function ga(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function xa(e, t, a) {
    var l = e.updateQueue;
    if (l === null) return null;
    if (l = l.shared, (Ue & 2) !== 0) {
      var c = l.pending;
      return c === null ? t.next = t : (t.next = c.next, c.next = t), l.pending = t, t = Bi(e), Hh(e, null, a), t;
    }
    return $i(e, l, t, a), Bi(e);
  }
  function Hl(e, t, a) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (a & 4194048) !== 0)) {
      var l = t.lanes;
      l &= e.pendingLanes, a |= l, t.lanes = a, Yd(e, a);
    }
  }
  function fc(e, t) {
    var a = e.updateQueue, l = e.alternate;
    if (l !== null && (l = l.updateQueue, a === l)) {
      var c = null, u = null;
      if (a = a.firstBaseUpdate, a !== null) {
        do {
          var b = {
            lane: a.lane,
            tag: a.tag,
            payload: a.payload,
            callback: null,
            next: null
          };
          u === null ? c = u = b : u = u.next = b, a = a.next;
        } while (a !== null);
        u === null ? c = u = t : u = u.next = t;
      } else c = u = t;
      a = {
        baseState: l.baseState,
        firstBaseUpdate: c,
        lastBaseUpdate: u,
        shared: l.shared,
        callbacks: l.callbacks
      }, e.updateQueue = a;
      return;
    }
    e = a.lastBaseUpdate, e === null ? a.firstBaseUpdate = t : e.next = t, a.lastBaseUpdate = t;
  }
  var pc = !1;
  function $l() {
    if (pc) {
      var e = Fs;
      if (e !== null) throw e;
    }
  }
  function Bl(e, t, a, l) {
    pc = !1;
    var c = e.updateQueue;
    ba = !1;
    var u = c.firstBaseUpdate, b = c.lastBaseUpdate, j = c.shared.pending;
    if (j !== null) {
      c.shared.pending = null;
      var R = j, B = R.next;
      R.next = null, b === null ? u = B : b.next = B, b = R;
      var K = e.alternate;
      K !== null && (K = K.updateQueue, j = K.lastBaseUpdate, j !== b && (j === null ? K.firstBaseUpdate = B : j.next = B, K.lastBaseUpdate = R));
    }
    if (u !== null) {
      var ee = c.baseState;
      b = 0, K = B = R = null, j = u;
      do {
        var F = j.lane & -536870913, Y = F !== j.lane;
        if (Y ? (Oe & F) === F : (l & F) === F) {
          F !== 0 && F === Us && (pc = !0), K !== null && (K = K.next = {
            lane: 0,
            tag: j.tag,
            payload: j.payload,
            callback: null,
            next: null
          });
          e: {
            var fe = e, Se = j;
            F = t;
            var Ze = a;
            switch (Se.tag) {
              case 1:
                if (fe = Se.payload, typeof fe == "function") {
                  ee = fe.call(Ze, ee, F);
                  break e;
                }
                ee = fe;
                break e;
              case 3:
                fe.flags = fe.flags & -65537 | 128;
              case 0:
                if (fe = Se.payload, F = typeof fe == "function" ? fe.call(Ze, ee, F) : fe, F == null) break e;
                ee = g({}, ee, F);
                break e;
              case 2:
                ba = !0;
            }
          }
          F = j.callback, F !== null && (e.flags |= 64, Y && (e.flags |= 8192), Y = c.callbacks, Y === null ? c.callbacks = [F] : Y.push(F));
        } else
          Y = {
            lane: F,
            tag: j.tag,
            payload: j.payload,
            callback: j.callback,
            next: null
          }, K === null ? (B = K = Y, R = ee) : K = K.next = Y, b |= F;
        if (j = j.next, j === null) {
          if (j = c.shared.pending, j === null)
            break;
          Y = j, j = Y.next, Y.next = null, c.lastBaseUpdate = Y, c.shared.pending = null;
        }
      } while (!0);
      K === null && (R = ee), c.baseState = R, c.firstBaseUpdate = B, c.lastBaseUpdate = K, u === null && (c.shared.lanes = 0), Sa |= b, e.lanes = b, e.memoizedState = ee;
    }
  }
  function tm(e, t) {
    if (typeof e != "function")
      throw Error(o(191, e));
    e.call(t);
  }
  function nm(e, t) {
    var a = e.callbacks;
    if (a !== null)
      for (e.callbacks = null, e = 0; e < a.length; e++)
        tm(a[e], t);
  }
  var qs = k(null), Zi = k(0);
  function am(e, t) {
    e = na, Z(Zi, e), Z(qs, t), na = e | t.baseLanes;
  }
  function _c() {
    Z(Zi, na), Z(qs, qs.current);
  }
  function bc() {
    na = Zi.current, $(qs), $(Zi);
  }
  var ln = k(null), yn = null;
  function va(e) {
    var t = e.alternate;
    Z(ut, ut.current & 1), Z(ln, e), yn === null && (t === null || qs.current !== null || t.memoizedState !== null) && (yn = e);
  }
  function gc(e) {
    Z(ut, ut.current), Z(ln, e), yn === null && (yn = e);
  }
  function sm(e) {
    e.tag === 22 ? (Z(ut, ut.current), Z(ln, e), yn === null && (yn = e)) : ya();
  }
  function ya() {
    Z(ut, ut.current), Z(ln, ln.current);
  }
  function rn(e) {
    $(ln), yn === e && (yn = null), $(ut);
  }
  var ut = k(0);
  function Ki(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var a = t.memoizedState;
        if (a !== null && (a = a.dehydrated, a === null || Su(a) || ku(a)))
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
  var Pn = 0, Te = null, Qe = null, ft = null, Ji = !1, Ys = !1, rs = !1, Ii = 0, Ul = 0, Xs = null, ux = 0;
  function ot() {
    throw Error(o(321));
  }
  function xc(e, t) {
    if (t === null) return !1;
    for (var a = 0; a < t.length && a < e.length; a++)
      if (!an(e[a], t[a])) return !1;
    return !0;
  }
  function vc(e, t, a, l, c, u) {
    return Pn = u, Te = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, S.H = e === null || e.memoizedState === null ? Fm : Dc, rs = !1, u = a(l, c), rs = !1, Ys && (u = im(
      t,
      a,
      l,
      c
    )), lm(e), u;
  }
  function lm(e) {
    S.H = Vl;
    var t = Qe !== null && Qe.next !== null;
    if (Pn = 0, ft = Qe = Te = null, Ji = !1, Ul = 0, Xs = null, t) throw Error(o(300));
    e === null || pt || (e = e.dependencies, e !== null && Gi(e) && (pt = !0));
  }
  function im(e, t, a, l) {
    Te = e;
    var c = 0;
    do {
      if (Ys && (Xs = null), Ul = 0, Ys = !1, 25 <= c) throw Error(o(301));
      if (c += 1, ft = Qe = null, e.updateQueue != null) {
        var u = e.updateQueue;
        u.lastEffect = null, u.events = null, u.stores = null, u.memoCache != null && (u.memoCache.index = 0);
      }
      S.H = Gm, u = t(a, l);
    } while (Ys);
    return u;
  }
  function dx() {
    var e = S.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? Fl(t) : t, e = e.useState()[0], (Qe !== null ? Qe.memoizedState : null) !== e && (Te.flags |= 1024), t;
  }
  function yc() {
    var e = Ii !== 0;
    return Ii = 0, e;
  }
  function jc(e, t, a) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~a;
  }
  function wc(e) {
    if (Ji) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      Ji = !1;
    }
    Pn = 0, ft = Qe = Te = null, Ys = !1, Ul = Ii = 0, Xs = null;
  }
  function Vt() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return ft === null ? Te.memoizedState = ft = e : ft = ft.next = e, ft;
  }
  function dt() {
    if (Qe === null) {
      var e = Te.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Qe.next;
    var t = ft === null ? Te.memoizedState : ft.next;
    if (t !== null)
      ft = t, Qe = e;
    else {
      if (e === null)
        throw Te.alternate === null ? Error(o(467)) : Error(o(310));
      Qe = e, e = {
        memoizedState: Qe.memoizedState,
        baseState: Qe.baseState,
        baseQueue: Qe.baseQueue,
        queue: Qe.queue,
        next: null
      }, ft === null ? Te.memoizedState = ft = e : ft = ft.next = e;
    }
    return ft;
  }
  function Wi() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Fl(e) {
    var t = Ul;
    return Ul += 1, Xs === null && (Xs = []), e = Kh(Xs, e, t), t = Te, (ft === null ? t.memoizedState : ft.next) === null && (t = t.alternate, S.H = t === null || t.memoizedState === null ? Fm : Dc), e;
  }
  function er(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return Fl(e);
      if (e.$$typeof === U) return Et(e);
    }
    throw Error(o(438, String(e)));
  }
  function Sc(e) {
    var t = null, a = Te.updateQueue;
    if (a !== null && (t = a.memoCache), t == null) {
      var l = Te.alternate;
      l !== null && (l = l.updateQueue, l !== null && (l = l.memoCache, l != null && (t = {
        data: l.data.map(function(c) {
          return c.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), a === null && (a = Wi(), Te.updateQueue = a), a.memoCache = t, a = t.data[t.index], a === void 0)
      for (a = t.data[t.index] = Array(e), l = 0; l < e; l++)
        a[l] = se;
    return t.index++, a;
  }
  function Zn(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function tr(e) {
    var t = dt();
    return kc(t, Qe, e);
  }
  function kc(e, t, a) {
    var l = e.queue;
    if (l === null) throw Error(o(311));
    l.lastRenderedReducer = a;
    var c = e.baseQueue, u = l.pending;
    if (u !== null) {
      if (c !== null) {
        var b = c.next;
        c.next = u.next, u.next = b;
      }
      t.baseQueue = c = u, l.pending = null;
    }
    if (u = e.baseState, c === null) e.memoizedState = u;
    else {
      t = c.next;
      var j = b = null, R = null, B = t, K = !1;
      do {
        var ee = B.lane & -536870913;
        if (ee !== B.lane ? (Oe & ee) === ee : (Pn & ee) === ee) {
          var F = B.revertLane;
          if (F === 0)
            R !== null && (R = R.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: B.action,
              hasEagerState: B.hasEagerState,
              eagerState: B.eagerState,
              next: null
            }), ee === Us && (K = !0);
          else if ((Pn & F) === F) {
            B = B.next, F === Us && (K = !0);
            continue;
          } else
            ee = {
              lane: 0,
              revertLane: B.revertLane,
              gesture: null,
              action: B.action,
              hasEagerState: B.hasEagerState,
              eagerState: B.eagerState,
              next: null
            }, R === null ? (j = R = ee, b = u) : R = R.next = ee, Te.lanes |= F, Sa |= F;
          ee = B.action, rs && a(u, ee), u = B.hasEagerState ? B.eagerState : a(u, ee);
        } else
          F = {
            lane: ee,
            revertLane: B.revertLane,
            gesture: B.gesture,
            action: B.action,
            hasEagerState: B.hasEagerState,
            eagerState: B.eagerState,
            next: null
          }, R === null ? (j = R = F, b = u) : R = R.next = F, Te.lanes |= ee, Sa |= ee;
        B = B.next;
      } while (B !== null && B !== t);
      if (R === null ? b = u : R.next = j, !an(u, e.memoizedState) && (pt = !0, K && (a = Fs, a !== null)))
        throw a;
      e.memoizedState = u, e.baseState = b, e.baseQueue = R, l.lastRenderedState = u;
    }
    return c === null && (l.lanes = 0), [e.memoizedState, l.dispatch];
  }
  function Nc(e) {
    var t = dt(), a = t.queue;
    if (a === null) throw Error(o(311));
    a.lastRenderedReducer = e;
    var l = a.dispatch, c = a.pending, u = t.memoizedState;
    if (c !== null) {
      a.pending = null;
      var b = c = c.next;
      do
        u = e(u, b.action), b = b.next;
      while (b !== c);
      an(u, t.memoizedState) || (pt = !0), t.memoizedState = u, t.baseQueue === null && (t.baseState = u), a.lastRenderedState = u;
    }
    return [u, l];
  }
  function rm(e, t, a) {
    var l = Te, c = dt(), u = Le;
    if (u) {
      if (a === void 0) throw Error(o(407));
      a = a();
    } else a = t();
    var b = !an(
      (Qe || c).memoizedState,
      a
    );
    if (b && (c.memoizedState = a, pt = !0), c = c.queue, Ec(um.bind(null, l, c, e), [
      e
    ]), c.getSnapshot !== t || b || ft !== null && ft.memoizedState.tag & 1) {
      if (l.flags |= 2048, Qs(
        9,
        { destroy: void 0 },
        cm.bind(
          null,
          l,
          c,
          a,
          t
        ),
        null
      ), Ke === null) throw Error(o(349));
      u || (Pn & 127) !== 0 || om(l, t, a);
    }
    return a;
  }
  function om(e, t, a) {
    e.flags |= 16384, e = { getSnapshot: t, value: a }, t = Te.updateQueue, t === null ? (t = Wi(), Te.updateQueue = t, t.stores = [e]) : (a = t.stores, a === null ? t.stores = [e] : a.push(e));
  }
  function cm(e, t, a, l) {
    t.value = a, t.getSnapshot = l, dm(t) && hm(e);
  }
  function um(e, t, a) {
    return a(function() {
      dm(t) && hm(e);
    });
  }
  function dm(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var a = t();
      return !an(e, a);
    } catch {
      return !0;
    }
  }
  function hm(e) {
    var t = Ia(e, 2);
    t !== null && en(t, e, 2);
  }
  function Cc(e) {
    var t = Vt();
    if (typeof e == "function") {
      var a = e;
      if (e = a(), rs) {
        Nt(!0);
        try {
          a();
        } finally {
          Nt(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = e, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Zn,
      lastRenderedState: e
    }, t;
  }
  function mm(e, t, a, l) {
    return e.baseState = a, kc(
      e,
      Qe,
      typeof l == "function" ? l : Zn
    );
  }
  function hx(e, t, a, l, c) {
    if (sr(e)) throw Error(o(485));
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
        then: function(b) {
          u.listeners.push(b);
        }
      };
      S.T !== null ? a(!0) : u.isTransition = !1, l(u), a = t.pending, a === null ? (u.next = t.pending = u, fm(t, u)) : (u.next = a.next, t.pending = a.next = u);
    }
  }
  function fm(e, t) {
    var a = t.action, l = t.payload, c = e.state;
    if (t.isTransition) {
      var u = S.T, b = {};
      S.T = b;
      try {
        var j = a(c, l), R = S.S;
        R !== null && R(b, j), pm(e, t, j);
      } catch (B) {
        Tc(e, t, B);
      } finally {
        u !== null && b.types !== null && (u.types = b.types), S.T = u;
      }
    } else
      try {
        u = a(c, l), pm(e, t, u);
      } catch (B) {
        Tc(e, t, B);
      }
  }
  function pm(e, t, a) {
    a !== null && typeof a == "object" && typeof a.then == "function" ? a.then(
      function(l) {
        _m(e, t, l);
      },
      function(l) {
        return Tc(e, t, l);
      }
    ) : _m(e, t, a);
  }
  function _m(e, t, a) {
    t.status = "fulfilled", t.value = a, bm(t), e.state = a, t = e.pending, t !== null && (a = t.next, a === t ? e.pending = null : (a = a.next, t.next = a, fm(e, a)));
  }
  function Tc(e, t, a) {
    var l = e.pending;
    if (e.pending = null, l !== null) {
      l = l.next;
      do
        t.status = "rejected", t.reason = a, bm(t), t = t.next;
      while (t !== l);
    }
    e.action = null;
  }
  function bm(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function gm(e, t) {
    return t;
  }
  function xm(e, t) {
    if (Le) {
      var a = Ke.formState;
      if (a !== null) {
        e: {
          var l = Te;
          if (Le) {
            if (nt) {
              t: {
                for (var c = nt, u = vn; c.nodeType !== 8; ) {
                  if (!u) {
                    c = null;
                    break t;
                  }
                  if (c = jn(
                    c.nextSibling
                  ), c === null) {
                    c = null;
                    break t;
                  }
                }
                u = c.data, c = u === "F!" || u === "F" ? c : null;
              }
              if (c) {
                nt = jn(
                  c.nextSibling
                ), l = c.data === "F!";
                break e;
              }
            }
            pa(l);
          }
          l = !1;
        }
        l && (t = a[0]);
      }
    }
    return a = Vt(), a.memoizedState = a.baseState = t, l = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: gm,
      lastRenderedState: t
    }, a.queue = l, a = $m.bind(
      null,
      Te,
      l
    ), l.dispatch = a, l = Cc(!1), u = zc.bind(
      null,
      Te,
      !1,
      l.queue
    ), l = Vt(), c = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, l.queue = c, a = hx.bind(
      null,
      Te,
      c,
      u,
      a
    ), c.dispatch = a, l.memoizedState = e, [t, a, !1];
  }
  function vm(e) {
    var t = dt();
    return ym(t, Qe, e);
  }
  function ym(e, t, a) {
    if (t = kc(
      e,
      t,
      gm
    )[0], e = tr(Zn)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var l = Fl(t);
      } catch (b) {
        throw b === Gs ? Yi : b;
      }
    else l = t;
    t = dt();
    var c = t.queue, u = c.dispatch;
    return a !== t.memoizedState && (Te.flags |= 2048, Qs(
      9,
      { destroy: void 0 },
      mx.bind(null, c, a),
      null
    )), [l, u, e];
  }
  function mx(e, t) {
    e.action = t;
  }
  function jm(e) {
    var t = dt(), a = Qe;
    if (a !== null)
      return ym(t, a, e);
    dt(), t = t.memoizedState, a = dt();
    var l = a.queue.dispatch;
    return a.memoizedState = e, [t, l, !1];
  }
  function Qs(e, t, a, l) {
    return e = { tag: e, create: a, deps: l, inst: t, next: null }, t = Te.updateQueue, t === null && (t = Wi(), Te.updateQueue = t), a = t.lastEffect, a === null ? t.lastEffect = e.next = e : (l = a.next, a.next = e, e.next = l, t.lastEffect = e), e;
  }
  function wm() {
    return dt().memoizedState;
  }
  function nr(e, t, a, l) {
    var c = Vt();
    Te.flags |= e, c.memoizedState = Qs(
      1 | t,
      { destroy: void 0 },
      a,
      l === void 0 ? null : l
    );
  }
  function ar(e, t, a, l) {
    var c = dt();
    l = l === void 0 ? null : l;
    var u = c.memoizedState.inst;
    Qe !== null && l !== null && xc(l, Qe.memoizedState.deps) ? c.memoizedState = Qs(t, u, a, l) : (Te.flags |= e, c.memoizedState = Qs(
      1 | t,
      u,
      a,
      l
    ));
  }
  function Sm(e, t) {
    nr(8390656, 8, e, t);
  }
  function Ec(e, t) {
    ar(2048, 8, e, t);
  }
  function fx(e) {
    Te.flags |= 4;
    var t = Te.updateQueue;
    if (t === null)
      t = Wi(), Te.updateQueue = t, t.events = [e];
    else {
      var a = t.events;
      a === null ? t.events = [e] : a.push(e);
    }
  }
  function km(e) {
    var t = dt().memoizedState;
    return fx({ ref: t, nextImpl: e }), function() {
      if ((Ue & 2) !== 0) throw Error(o(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function Nm(e, t) {
    return ar(4, 2, e, t);
  }
  function Cm(e, t) {
    return ar(4, 4, e, t);
  }
  function Tm(e, t) {
    if (typeof t == "function") {
      e = e();
      var a = t(e);
      return function() {
        typeof a == "function" ? a() : t(null);
      };
    }
    if (t != null)
      return e = e(), t.current = e, function() {
        t.current = null;
      };
  }
  function Em(e, t, a) {
    a = a != null ? a.concat([e]) : null, ar(4, 4, Tm.bind(null, t, e), a);
  }
  function Mc() {
  }
  function Mm(e, t) {
    var a = dt();
    t = t === void 0 ? null : t;
    var l = a.memoizedState;
    return t !== null && xc(t, l[1]) ? l[0] : (a.memoizedState = [e, t], e);
  }
  function Rm(e, t) {
    var a = dt();
    t = t === void 0 ? null : t;
    var l = a.memoizedState;
    if (t !== null && xc(t, l[1]))
      return l[0];
    if (l = e(), rs) {
      Nt(!0);
      try {
        e();
      } finally {
        Nt(!1);
      }
    }
    return a.memoizedState = [l, t], l;
  }
  function Rc(e, t, a) {
    return a === void 0 || (Pn & 1073741824) !== 0 && (Oe & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = a, e = Of(), Te.lanes |= e, Sa |= e, a);
  }
  function Am(e, t, a, l) {
    return an(a, t) ? a : qs.current !== null ? (e = Rc(e, a, l), an(e, t) || (pt = !0), e) : (Pn & 42) === 0 || (Pn & 1073741824) !== 0 && (Oe & 261930) === 0 ? (pt = !0, e.memoizedState = a) : (e = Of(), Te.lanes |= e, Sa |= e, t);
  }
  function Om(e, t, a, l, c) {
    var u = O.p;
    O.p = u !== 0 && 8 > u ? u : 8;
    var b = S.T, j = {};
    S.T = j, zc(e, !1, t, a);
    try {
      var R = c(), B = S.S;
      if (B !== null && B(j, R), R !== null && typeof R == "object" && typeof R.then == "function") {
        var K = cx(
          R,
          l
        );
        Gl(
          e,
          t,
          K,
          un(e)
        );
      } else
        Gl(
          e,
          t,
          l,
          un(e)
        );
    } catch (ee) {
      Gl(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: ee },
        un()
      );
    } finally {
      O.p = u, b !== null && j.types !== null && (b.types = j.types), S.T = b;
    }
  }
  function px() {
  }
  function Ac(e, t, a, l) {
    if (e.tag !== 5) throw Error(o(476));
    var c = zm(e).queue;
    Om(
      e,
      c,
      t,
      q,
      a === null ? px : function() {
        return Dm(e), a(l);
      }
    );
  }
  function zm(e) {
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
        lastRenderedReducer: Zn,
        lastRenderedState: q
      },
      next: null
    };
    var a = {};
    return t.next = {
      memoizedState: a,
      baseState: a,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Zn,
        lastRenderedState: a
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function Dm(e) {
    var t = zm(e);
    t.next === null && (t = e.alternate.memoizedState), Gl(
      e,
      t.next.queue,
      {},
      un()
    );
  }
  function Oc() {
    return Et(li);
  }
  function Lm() {
    return dt().memoizedState;
  }
  function Hm() {
    return dt().memoizedState;
  }
  function _x(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var a = un();
          e = ga(a);
          var l = xa(t, e, a);
          l !== null && (en(l, t, a), Hl(l, t, a)), t = { cache: oc() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function bx(e, t, a) {
    var l = un();
    a = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, sr(e) ? Bm(t, a) : (a = Jo(e, t, a, l), a !== null && (en(a, e, l), Um(a, t, l)));
  }
  function $m(e, t, a) {
    var l = un();
    Gl(e, t, a, l);
  }
  function Gl(e, t, a, l) {
    var c = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (sr(e)) Bm(t, c);
    else {
      var u = e.alternate;
      if (e.lanes === 0 && (u === null || u.lanes === 0) && (u = t.lastRenderedReducer, u !== null))
        try {
          var b = t.lastRenderedState, j = u(b, a);
          if (c.hasEagerState = !0, c.eagerState = j, an(j, b))
            return $i(e, t, c, 0), Ke === null && Hi(), !1;
        } catch {
        } finally {
        }
      if (a = Jo(e, t, c, l), a !== null)
        return en(a, e, l), Um(a, t, l), !0;
    }
    return !1;
  }
  function zc(e, t, a, l) {
    if (l = {
      lane: 2,
      revertLane: hu(),
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, sr(e)) {
      if (t) throw Error(o(479));
    } else
      t = Jo(
        e,
        a,
        l,
        2
      ), t !== null && en(t, e, 2);
  }
  function sr(e) {
    var t = e.alternate;
    return e === Te || t !== null && t === Te;
  }
  function Bm(e, t) {
    Ys = Ji = !0;
    var a = e.pending;
    a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
  }
  function Um(e, t, a) {
    if ((a & 4194048) !== 0) {
      var l = t.lanes;
      l &= e.pendingLanes, a |= l, t.lanes = a, Yd(e, a);
    }
  }
  var Vl = {
    readContext: Et,
    use: er,
    useCallback: ot,
    useContext: ot,
    useEffect: ot,
    useImperativeHandle: ot,
    useLayoutEffect: ot,
    useInsertionEffect: ot,
    useMemo: ot,
    useReducer: ot,
    useRef: ot,
    useState: ot,
    useDebugValue: ot,
    useDeferredValue: ot,
    useTransition: ot,
    useSyncExternalStore: ot,
    useId: ot,
    useHostTransitionStatus: ot,
    useFormState: ot,
    useActionState: ot,
    useOptimistic: ot,
    useMemoCache: ot,
    useCacheRefresh: ot
  };
  Vl.useEffectEvent = ot;
  var Fm = {
    readContext: Et,
    use: er,
    useCallback: function(e, t) {
      return Vt().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: Et,
    useEffect: Sm,
    useImperativeHandle: function(e, t, a) {
      a = a != null ? a.concat([e]) : null, nr(
        4194308,
        4,
        Tm.bind(null, t, e),
        a
      );
    },
    useLayoutEffect: function(e, t) {
      return nr(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      nr(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var a = Vt();
      t = t === void 0 ? null : t;
      var l = e();
      if (rs) {
        Nt(!0);
        try {
          e();
        } finally {
          Nt(!1);
        }
      }
      return a.memoizedState = [l, t], l;
    },
    useReducer: function(e, t, a) {
      var l = Vt();
      if (a !== void 0) {
        var c = a(t);
        if (rs) {
          Nt(!0);
          try {
            a(t);
          } finally {
            Nt(!1);
          }
        }
      } else c = t;
      return l.memoizedState = l.baseState = c, e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: c
      }, l.queue = e, e = e.dispatch = bx.bind(
        null,
        Te,
        e
      ), [l.memoizedState, e];
    },
    useRef: function(e) {
      var t = Vt();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = Cc(e);
      var t = e.queue, a = $m.bind(null, Te, t);
      return t.dispatch = a, [e.memoizedState, a];
    },
    useDebugValue: Mc,
    useDeferredValue: function(e, t) {
      var a = Vt();
      return Rc(a, e, t);
    },
    useTransition: function() {
      var e = Cc(!1);
      return e = Om.bind(
        null,
        Te,
        e.queue,
        !0,
        !1
      ), Vt().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, a) {
      var l = Te, c = Vt();
      if (Le) {
        if (a === void 0)
          throw Error(o(407));
        a = a();
      } else {
        if (a = t(), Ke === null)
          throw Error(o(349));
        (Oe & 127) !== 0 || om(l, t, a);
      }
      c.memoizedState = a;
      var u = { value: a, getSnapshot: t };
      return c.queue = u, Sm(um.bind(null, l, u, e), [
        e
      ]), l.flags |= 2048, Qs(
        9,
        { destroy: void 0 },
        cm.bind(
          null,
          l,
          u,
          a,
          t
        ),
        null
      ), a;
    },
    useId: function() {
      var e = Vt(), t = Ke.identifierPrefix;
      if (Le) {
        var a = Rn, l = Mn;
        a = (l & ~(1 << 32 - Lt(l) - 1)).toString(32) + a, t = "_" + t + "R_" + a, a = Ii++, 0 < a && (t += "H" + a.toString(32)), t += "_";
      } else
        a = ux++, t = "_" + t + "r_" + a.toString(32) + "_";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: Oc,
    useFormState: xm,
    useActionState: xm,
    useOptimistic: function(e) {
      var t = Vt();
      t.memoizedState = t.baseState = e;
      var a = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = a, t = zc.bind(
        null,
        Te,
        !0,
        a
      ), a.dispatch = t, [e, t];
    },
    useMemoCache: Sc,
    useCacheRefresh: function() {
      return Vt().memoizedState = _x.bind(
        null,
        Te
      );
    },
    useEffectEvent: function(e) {
      var t = Vt(), a = { impl: e };
      return t.memoizedState = a, function() {
        if ((Ue & 2) !== 0)
          throw Error(o(440));
        return a.impl.apply(void 0, arguments);
      };
    }
  }, Dc = {
    readContext: Et,
    use: er,
    useCallback: Mm,
    useContext: Et,
    useEffect: Ec,
    useImperativeHandle: Em,
    useInsertionEffect: Nm,
    useLayoutEffect: Cm,
    useMemo: Rm,
    useReducer: tr,
    useRef: wm,
    useState: function() {
      return tr(Zn);
    },
    useDebugValue: Mc,
    useDeferredValue: function(e, t) {
      var a = dt();
      return Am(
        a,
        Qe.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = tr(Zn)[0], t = dt().memoizedState;
      return [
        typeof e == "boolean" ? e : Fl(e),
        t
      ];
    },
    useSyncExternalStore: rm,
    useId: Lm,
    useHostTransitionStatus: Oc,
    useFormState: vm,
    useActionState: vm,
    useOptimistic: function(e, t) {
      var a = dt();
      return mm(a, Qe, e, t);
    },
    useMemoCache: Sc,
    useCacheRefresh: Hm
  };
  Dc.useEffectEvent = km;
  var Gm = {
    readContext: Et,
    use: er,
    useCallback: Mm,
    useContext: Et,
    useEffect: Ec,
    useImperativeHandle: Em,
    useInsertionEffect: Nm,
    useLayoutEffect: Cm,
    useMemo: Rm,
    useReducer: Nc,
    useRef: wm,
    useState: function() {
      return Nc(Zn);
    },
    useDebugValue: Mc,
    useDeferredValue: function(e, t) {
      var a = dt();
      return Qe === null ? Rc(a, e, t) : Am(
        a,
        Qe.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = Nc(Zn)[0], t = dt().memoizedState;
      return [
        typeof e == "boolean" ? e : Fl(e),
        t
      ];
    },
    useSyncExternalStore: rm,
    useId: Lm,
    useHostTransitionStatus: Oc,
    useFormState: jm,
    useActionState: jm,
    useOptimistic: function(e, t) {
      var a = dt();
      return Qe !== null ? mm(a, Qe, e, t) : (a.baseState = e, [e, a.queue.dispatch]);
    },
    useMemoCache: Sc,
    useCacheRefresh: Hm
  };
  Gm.useEffectEvent = km;
  function Lc(e, t, a, l) {
    t = e.memoizedState, a = a(l, t), a = a == null ? t : g({}, t, a), e.memoizedState = a, e.lanes === 0 && (e.updateQueue.baseState = a);
  }
  var Hc = {
    enqueueSetState: function(e, t, a) {
      e = e._reactInternals;
      var l = un(), c = ga(l);
      c.payload = t, a != null && (c.callback = a), t = xa(e, c, l), t !== null && (en(t, e, l), Hl(t, e, l));
    },
    enqueueReplaceState: function(e, t, a) {
      e = e._reactInternals;
      var l = un(), c = ga(l);
      c.tag = 1, c.payload = t, a != null && (c.callback = a), t = xa(e, c, l), t !== null && (en(t, e, l), Hl(t, e, l));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var a = un(), l = ga(a);
      l.tag = 2, t != null && (l.callback = t), t = xa(e, l, a), t !== null && (en(t, e, a), Hl(t, e, a));
    }
  };
  function Vm(e, t, a, l, c, u, b) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(l, u, b) : t.prototype && t.prototype.isPureReactComponent ? !El(a, l) || !El(c, u) : !0;
  }
  function qm(e, t, a, l) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, l), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, l), t.state !== e && Hc.enqueueReplaceState(t, t.state, null);
  }
  function os(e, t) {
    var a = t;
    if ("ref" in t) {
      a = {};
      for (var l in t)
        l !== "ref" && (a[l] = t[l]);
    }
    if (e = e.defaultProps) {
      a === t && (a = g({}, a));
      for (var c in e)
        a[c] === void 0 && (a[c] = e[c]);
    }
    return a;
  }
  function Ym(e) {
    Li(e);
  }
  function Xm(e) {
    console.error(e);
  }
  function Qm(e) {
    Li(e);
  }
  function lr(e, t) {
    try {
      var a = e.onUncaughtError;
      a(t.value, { componentStack: t.stack });
    } catch (l) {
      setTimeout(function() {
        throw l;
      });
    }
  }
  function Pm(e, t, a) {
    try {
      var l = e.onCaughtError;
      l(a.value, {
        componentStack: a.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (c) {
      setTimeout(function() {
        throw c;
      });
    }
  }
  function $c(e, t, a) {
    return a = ga(a), a.tag = 3, a.payload = { element: null }, a.callback = function() {
      lr(e, t);
    }, a;
  }
  function Zm(e) {
    return e = ga(e), e.tag = 3, e;
  }
  function Km(e, t, a, l) {
    var c = a.type.getDerivedStateFromError;
    if (typeof c == "function") {
      var u = l.value;
      e.payload = function() {
        return c(u);
      }, e.callback = function() {
        Pm(t, a, l);
      };
    }
    var b = a.stateNode;
    b !== null && typeof b.componentDidCatch == "function" && (e.callback = function() {
      Pm(t, a, l), typeof c != "function" && (ka === null ? ka = /* @__PURE__ */ new Set([this]) : ka.add(this));
      var j = l.stack;
      this.componentDidCatch(l.value, {
        componentStack: j !== null ? j : ""
      });
    });
  }
  function gx(e, t, a, l, c) {
    if (a.flags |= 32768, l !== null && typeof l == "object" && typeof l.then == "function") {
      if (t = a.alternate, t !== null && Bs(
        t,
        a,
        c,
        !0
      ), a = ln.current, a !== null) {
        switch (a.tag) {
          case 31:
          case 13:
            return yn === null ? br() : a.alternate === null && ct === 0 && (ct = 3), a.flags &= -257, a.flags |= 65536, a.lanes = c, l === Xi ? a.flags |= 16384 : (t = a.updateQueue, t === null ? a.updateQueue = /* @__PURE__ */ new Set([l]) : t.add(l), cu(e, l, c)), !1;
          case 22:
            return a.flags |= 65536, l === Xi ? a.flags |= 16384 : (t = a.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([l])
            }, a.updateQueue = t) : (a = t.retryQueue, a === null ? t.retryQueue = /* @__PURE__ */ new Set([l]) : a.add(l)), cu(e, l, c)), !1;
        }
        throw Error(o(435, a.tag));
      }
      return cu(e, l, c), br(), !1;
    }
    if (Le)
      return t = ln.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = c, l !== ac && (e = Error(o(422), { cause: l }), Al(bn(e, a)))) : (l !== ac && (t = Error(o(423), {
        cause: l
      }), Al(
        bn(t, a)
      )), e = e.current.alternate, e.flags |= 65536, c &= -c, e.lanes |= c, l = bn(l, a), c = $c(
        e.stateNode,
        l,
        c
      ), fc(e, c), ct !== 4 && (ct = 2)), !1;
    var u = Error(o(520), { cause: l });
    if (u = bn(u, a), Jl === null ? Jl = [u] : Jl.push(u), ct !== 4 && (ct = 2), t === null) return !0;
    l = bn(l, a), a = t;
    do {
      switch (a.tag) {
        case 3:
          return a.flags |= 65536, e = c & -c, a.lanes |= e, e = $c(a.stateNode, l, e), fc(a, e), !1;
        case 1:
          if (t = a.type, u = a.stateNode, (a.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || u !== null && typeof u.componentDidCatch == "function" && (ka === null || !ka.has(u))))
            return a.flags |= 65536, c &= -c, a.lanes |= c, c = Zm(c), Km(
              c,
              e,
              a,
              l
            ), fc(a, c), !1;
      }
      a = a.return;
    } while (a !== null);
    return !1;
  }
  var Bc = Error(o(461)), pt = !1;
  function Mt(e, t, a, l) {
    t.child = e === null ? em(t, null, a, l) : is(
      t,
      e.child,
      a,
      l
    );
  }
  function Jm(e, t, a, l, c) {
    a = a.render;
    var u = t.ref;
    if ("ref" in l) {
      var b = {};
      for (var j in l)
        j !== "ref" && (b[j] = l[j]);
    } else b = l;
    return ns(t), l = vc(
      e,
      t,
      a,
      b,
      u,
      c
    ), j = yc(), e !== null && !pt ? (jc(e, t, c), Kn(e, t, c)) : (Le && j && tc(t), t.flags |= 1, Mt(e, t, l, c), t.child);
  }
  function Im(e, t, a, l, c) {
    if (e === null) {
      var u = a.type;
      return typeof u == "function" && !Io(u) && u.defaultProps === void 0 && a.compare === null ? (t.tag = 15, t.type = u, Wm(
        e,
        t,
        u,
        l,
        c
      )) : (e = Ui(
        a.type,
        null,
        l,
        t,
        t.mode,
        c
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (u = e.child, !Qc(e, c)) {
      var b = u.memoizedProps;
      if (a = a.compare, a = a !== null ? a : El, a(b, l) && e.ref === t.ref)
        return Kn(e, t, c);
    }
    return t.flags |= 1, e = qn(u, l), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Wm(e, t, a, l, c) {
    if (e !== null) {
      var u = e.memoizedProps;
      if (El(u, l) && e.ref === t.ref)
        if (pt = !1, t.pendingProps = l = u, Qc(e, c))
          (e.flags & 131072) !== 0 && (pt = !0);
        else
          return t.lanes = e.lanes, Kn(e, t, c);
    }
    return Uc(
      e,
      t,
      a,
      l,
      c
    );
  }
  function ef(e, t, a, l) {
    var c = l.children, u = e !== null ? e.memoizedState : null;
    if (e === null && t.stateNode === null && (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), l.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (u = u !== null ? u.baseLanes | a : a, e !== null) {
          for (l = t.child = e.child, c = 0; l !== null; )
            c = c | l.lanes | l.childLanes, l = l.sibling;
          l = c & ~u;
        } else l = 0, t.child = null;
        return tf(
          e,
          t,
          u,
          a,
          l
        );
      }
      if ((a & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && qi(
          t,
          u !== null ? u.cachePool : null
        ), u !== null ? am(t, u) : _c(), sm(t);
      else
        return l = t.lanes = 536870912, tf(
          e,
          t,
          u !== null ? u.baseLanes | a : a,
          a,
          l
        );
    } else
      u !== null ? (qi(t, u.cachePool), am(t, u), ya(), t.memoizedState = null) : (e !== null && qi(t, null), _c(), ya());
    return Mt(e, t, c, a), t.child;
  }
  function ql(e, t) {
    return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function tf(e, t, a, l, c) {
    var u = uc();
    return u = u === null ? null : { parent: mt._currentValue, pool: u }, t.memoizedState = {
      baseLanes: a,
      cachePool: u
    }, e !== null && qi(t, null), _c(), sm(t), e !== null && Bs(e, t, l, !0), t.childLanes = c, null;
  }
  function ir(e, t) {
    return t = or(
      { mode: t.mode, children: t.children },
      e.mode
    ), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function nf(e, t, a) {
    return is(t, e.child, null, a), e = ir(t, t.pendingProps), e.flags |= 2, rn(t), t.memoizedState = null, e;
  }
  function xx(e, t, a) {
    var l = t.pendingProps, c = (t.flags & 128) !== 0;
    if (t.flags &= -129, e === null) {
      if (Le) {
        if (l.mode === "hidden")
          return e = ir(t, l), t.lanes = 536870912, ql(null, e);
        if (gc(t), (e = nt) ? (e = pp(
          e,
          vn
        ), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: ma !== null ? { id: Mn, overflow: Rn } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, a = Bh(e), a.return = t, t.child = a, Tt = t, nt = null)) : e = null, e === null) throw pa(t);
        return t.lanes = 536870912, null;
      }
      return ir(t, l);
    }
    var u = e.memoizedState;
    if (u !== null) {
      var b = u.dehydrated;
      if (gc(t), c)
        if (t.flags & 256)
          t.flags &= -257, t = nf(
            e,
            t,
            a
          );
        else if (t.memoizedState !== null)
          t.child = e.child, t.flags |= 128, t = null;
        else throw Error(o(558));
      else if (pt || Bs(e, t, a, !1), c = (a & e.childLanes) !== 0, pt || c) {
        if (l = Ke, l !== null && (b = Xd(l, a), b !== 0 && b !== u.retryLane))
          throw u.retryLane = b, Ia(e, b), en(l, e, b), Bc;
        br(), t = nf(
          e,
          t,
          a
        );
      } else
        e = u.treeContext, nt = jn(b.nextSibling), Tt = t, Le = !0, fa = null, vn = !1, e !== null && Gh(t, e), t = ir(t, l), t.flags |= 4096;
      return t;
    }
    return e = qn(e.child, {
      mode: l.mode,
      children: l.children
    }), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function rr(e, t) {
    var a = t.ref;
    if (a === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof a != "function" && typeof a != "object")
        throw Error(o(284));
      (e === null || e.ref !== a) && (t.flags |= 4194816);
    }
  }
  function Uc(e, t, a, l, c) {
    return ns(t), a = vc(
      e,
      t,
      a,
      l,
      void 0,
      c
    ), l = yc(), e !== null && !pt ? (jc(e, t, c), Kn(e, t, c)) : (Le && l && tc(t), t.flags |= 1, Mt(e, t, a, c), t.child);
  }
  function af(e, t, a, l, c, u) {
    return ns(t), t.updateQueue = null, a = im(
      t,
      l,
      a,
      c
    ), lm(e), l = yc(), e !== null && !pt ? (jc(e, t, u), Kn(e, t, u)) : (Le && l && tc(t), t.flags |= 1, Mt(e, t, a, u), t.child);
  }
  function sf(e, t, a, l, c) {
    if (ns(t), t.stateNode === null) {
      var u = Ds, b = a.contextType;
      typeof b == "object" && b !== null && (u = Et(b)), u = new a(l, u), t.memoizedState = u.state !== null && u.state !== void 0 ? u.state : null, u.updater = Hc, t.stateNode = u, u._reactInternals = t, u = t.stateNode, u.props = l, u.state = t.memoizedState, u.refs = {}, hc(t), b = a.contextType, u.context = typeof b == "object" && b !== null ? Et(b) : Ds, u.state = t.memoizedState, b = a.getDerivedStateFromProps, typeof b == "function" && (Lc(
        t,
        a,
        b,
        l
      ), u.state = t.memoizedState), typeof a.getDerivedStateFromProps == "function" || typeof u.getSnapshotBeforeUpdate == "function" || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (b = u.state, typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount(), b !== u.state && Hc.enqueueReplaceState(u, u.state, null), Bl(t, l, u, c), $l(), u.state = t.memoizedState), typeof u.componentDidMount == "function" && (t.flags |= 4194308), l = !0;
    } else if (e === null) {
      u = t.stateNode;
      var j = t.memoizedProps, R = os(a, j);
      u.props = R;
      var B = u.context, K = a.contextType;
      b = Ds, typeof K == "object" && K !== null && (b = Et(K));
      var ee = a.getDerivedStateFromProps;
      K = typeof ee == "function" || typeof u.getSnapshotBeforeUpdate == "function", j = t.pendingProps !== j, K || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (j || B !== b) && qm(
        t,
        u,
        l,
        b
      ), ba = !1;
      var F = t.memoizedState;
      u.state = F, Bl(t, l, u, c), $l(), B = t.memoizedState, j || F !== B || ba ? (typeof ee == "function" && (Lc(
        t,
        a,
        ee,
        l
      ), B = t.memoizedState), (R = ba || Vm(
        t,
        a,
        R,
        l,
        F,
        B,
        b
      )) ? (K || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = l, t.memoizedState = B), u.props = l, u.state = B, u.context = b, l = R) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), l = !1);
    } else {
      u = t.stateNode, mc(e, t), b = t.memoizedProps, K = os(a, b), u.props = K, ee = t.pendingProps, F = u.context, B = a.contextType, R = Ds, typeof B == "object" && B !== null && (R = Et(B)), j = a.getDerivedStateFromProps, (B = typeof j == "function" || typeof u.getSnapshotBeforeUpdate == "function") || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (b !== ee || F !== R) && qm(
        t,
        u,
        l,
        R
      ), ba = !1, F = t.memoizedState, u.state = F, Bl(t, l, u, c), $l();
      var Y = t.memoizedState;
      b !== ee || F !== Y || ba || e !== null && e.dependencies !== null && Gi(e.dependencies) ? (typeof j == "function" && (Lc(
        t,
        a,
        j,
        l
      ), Y = t.memoizedState), (K = ba || Vm(
        t,
        a,
        K,
        l,
        F,
        Y,
        R
      ) || e !== null && e.dependencies !== null && Gi(e.dependencies)) ? (B || typeof u.UNSAFE_componentWillUpdate != "function" && typeof u.componentWillUpdate != "function" || (typeof u.componentWillUpdate == "function" && u.componentWillUpdate(l, Y, R), typeof u.UNSAFE_componentWillUpdate == "function" && u.UNSAFE_componentWillUpdate(
        l,
        Y,
        R
      )), typeof u.componentDidUpdate == "function" && (t.flags |= 4), typeof u.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof u.componentDidUpdate != "function" || b === e.memoizedProps && F === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || b === e.memoizedProps && F === e.memoizedState || (t.flags |= 1024), t.memoizedProps = l, t.memoizedState = Y), u.props = l, u.state = Y, u.context = R, l = K) : (typeof u.componentDidUpdate != "function" || b === e.memoizedProps && F === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || b === e.memoizedProps && F === e.memoizedState || (t.flags |= 1024), l = !1);
    }
    return u = l, rr(e, t), l = (t.flags & 128) !== 0, u || l ? (u = t.stateNode, a = l && typeof a.getDerivedStateFromError != "function" ? null : u.render(), t.flags |= 1, e !== null && l ? (t.child = is(
      t,
      e.child,
      null,
      c
    ), t.child = is(
      t,
      null,
      a,
      c
    )) : Mt(e, t, a, c), t.memoizedState = u.state, e = t.child) : e = Kn(
      e,
      t,
      c
    ), e;
  }
  function lf(e, t, a, l) {
    return es(), t.flags |= 256, Mt(e, t, a, l), t.child;
  }
  var Fc = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function Gc(e) {
    return { baseLanes: e, cachePool: Ph() };
  }
  function Vc(e, t, a) {
    return e = e !== null ? e.childLanes & ~a : 0, t && (e |= cn), e;
  }
  function rf(e, t, a) {
    var l = t.pendingProps, c = !1, u = (t.flags & 128) !== 0, b;
    if ((b = u) || (b = e !== null && e.memoizedState === null ? !1 : (ut.current & 2) !== 0), b && (c = !0, t.flags &= -129), b = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (Le) {
        if (c ? va(t) : ya(), (e = nt) ? (e = pp(
          e,
          vn
        ), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: ma !== null ? { id: Mn, overflow: Rn } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, a = Bh(e), a.return = t, t.child = a, Tt = t, nt = null)) : e = null, e === null) throw pa(t);
        return ku(e) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      var j = l.children;
      return l = l.fallback, c ? (ya(), c = t.mode, j = or(
        { mode: "hidden", children: j },
        c
      ), l = Wa(
        l,
        c,
        a,
        null
      ), j.return = t, l.return = t, j.sibling = l, t.child = j, l = t.child, l.memoizedState = Gc(a), l.childLanes = Vc(
        e,
        b,
        a
      ), t.memoizedState = Fc, ql(null, l)) : (va(t), qc(t, j));
    }
    var R = e.memoizedState;
    if (R !== null && (j = R.dehydrated, j !== null)) {
      if (u)
        t.flags & 256 ? (va(t), t.flags &= -257, t = Yc(
          e,
          t,
          a
        )) : t.memoizedState !== null ? (ya(), t.child = e.child, t.flags |= 128, t = null) : (ya(), j = l.fallback, c = t.mode, l = or(
          { mode: "visible", children: l.children },
          c
        ), j = Wa(
          j,
          c,
          a,
          null
        ), j.flags |= 2, l.return = t, j.return = t, l.sibling = j, t.child = l, is(
          t,
          e.child,
          null,
          a
        ), l = t.child, l.memoizedState = Gc(a), l.childLanes = Vc(
          e,
          b,
          a
        ), t.memoizedState = Fc, t = ql(null, l));
      else if (va(t), ku(j)) {
        if (b = j.nextSibling && j.nextSibling.dataset, b) var B = b.dgst;
        b = B, l = Error(o(419)), l.stack = "", l.digest = b, Al({ value: l, source: null, stack: null }), t = Yc(
          e,
          t,
          a
        );
      } else if (pt || Bs(e, t, a, !1), b = (a & e.childLanes) !== 0, pt || b) {
        if (b = Ke, b !== null && (l = Xd(b, a), l !== 0 && l !== R.retryLane))
          throw R.retryLane = l, Ia(e, l), en(b, e, l), Bc;
        Su(j) || br(), t = Yc(
          e,
          t,
          a
        );
      } else
        Su(j) ? (t.flags |= 192, t.child = e.child, t = null) : (e = R.treeContext, nt = jn(
          j.nextSibling
        ), Tt = t, Le = !0, fa = null, vn = !1, e !== null && Gh(t, e), t = qc(
          t,
          l.children
        ), t.flags |= 4096);
      return t;
    }
    return c ? (ya(), j = l.fallback, c = t.mode, R = e.child, B = R.sibling, l = qn(R, {
      mode: "hidden",
      children: l.children
    }), l.subtreeFlags = R.subtreeFlags & 65011712, B !== null ? j = qn(
      B,
      j
    ) : (j = Wa(
      j,
      c,
      a,
      null
    ), j.flags |= 2), j.return = t, l.return = t, l.sibling = j, t.child = l, ql(null, l), l = t.child, j = e.child.memoizedState, j === null ? j = Gc(a) : (c = j.cachePool, c !== null ? (R = mt._currentValue, c = c.parent !== R ? { parent: R, pool: R } : c) : c = Ph(), j = {
      baseLanes: j.baseLanes | a,
      cachePool: c
    }), l.memoizedState = j, l.childLanes = Vc(
      e,
      b,
      a
    ), t.memoizedState = Fc, ql(e.child, l)) : (va(t), a = e.child, e = a.sibling, a = qn(a, {
      mode: "visible",
      children: l.children
    }), a.return = t, a.sibling = null, e !== null && (b = t.deletions, b === null ? (t.deletions = [e], t.flags |= 16) : b.push(e)), t.child = a, t.memoizedState = null, a);
  }
  function qc(e, t) {
    return t = or(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function or(e, t) {
    return e = sn(22, e, null, t), e.lanes = 0, e;
  }
  function Yc(e, t, a) {
    return is(t, e.child, null, a), e = qc(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function of(e, t, a) {
    e.lanes |= t;
    var l = e.alternate;
    l !== null && (l.lanes |= t), ic(e.return, t, a);
  }
  function Xc(e, t, a, l, c, u) {
    var b = e.memoizedState;
    b === null ? e.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: l,
      tail: a,
      tailMode: c,
      treeForkCount: u
    } : (b.isBackwards = t, b.rendering = null, b.renderingStartTime = 0, b.last = l, b.tail = a, b.tailMode = c, b.treeForkCount = u);
  }
  function cf(e, t, a) {
    var l = t.pendingProps, c = l.revealOrder, u = l.tail;
    l = l.children;
    var b = ut.current, j = (b & 2) !== 0;
    if (j ? (b = b & 1 | 2, t.flags |= 128) : b &= 1, Z(ut, b), Mt(e, t, l, a), l = Le ? Rl : 0, !j && e !== null && (e.flags & 128) !== 0)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13)
          e.memoizedState !== null && of(e, a, t);
        else if (e.tag === 19)
          of(e, a, t);
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
        for (a = t.child, c = null; a !== null; )
          e = a.alternate, e !== null && Ki(e) === null && (c = a), a = a.sibling;
        a = c, a === null ? (c = t.child, t.child = null) : (c = a.sibling, a.sibling = null), Xc(
          t,
          !1,
          c,
          a,
          u,
          l
        );
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (a = null, c = t.child, t.child = null; c !== null; ) {
          if (e = c.alternate, e !== null && Ki(e) === null) {
            t.child = c;
            break;
          }
          e = c.sibling, c.sibling = a, a = c, c = e;
        }
        Xc(
          t,
          !0,
          a,
          null,
          u,
          l
        );
        break;
      case "together":
        Xc(
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
  function Kn(e, t, a) {
    if (e !== null && (t.dependencies = e.dependencies), Sa |= t.lanes, (a & t.childLanes) === 0)
      if (e !== null) {
        if (Bs(
          e,
          t,
          a,
          !1
        ), (a & t.childLanes) === 0)
          return null;
      } else return null;
    if (e !== null && t.child !== e.child)
      throw Error(o(153));
    if (t.child !== null) {
      for (e = t.child, a = qn(e, e.pendingProps), t.child = a, a.return = t; e.sibling !== null; )
        e = e.sibling, a = a.sibling = qn(e, e.pendingProps), a.return = t;
      a.sibling = null;
    }
    return t.child;
  }
  function Qc(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && Gi(e)));
  }
  function vx(e, t, a) {
    switch (t.tag) {
      case 3:
        xe(t, t.stateNode.containerInfo), _a(t, mt, e.memoizedState.cache), es();
        break;
      case 27:
      case 5:
        st(t);
        break;
      case 4:
        xe(t, t.stateNode.containerInfo);
        break;
      case 10:
        _a(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 31:
        if (t.memoizedState !== null)
          return t.flags |= 128, gc(t), null;
        break;
      case 13:
        var l = t.memoizedState;
        if (l !== null)
          return l.dehydrated !== null ? (va(t), t.flags |= 128, null) : (a & t.child.childLanes) !== 0 ? rf(e, t, a) : (va(t), e = Kn(
            e,
            t,
            a
          ), e !== null ? e.sibling : null);
        va(t);
        break;
      case 19:
        var c = (e.flags & 128) !== 0;
        if (l = (a & t.childLanes) !== 0, l || (Bs(
          e,
          t,
          a,
          !1
        ), l = (a & t.childLanes) !== 0), c) {
          if (l)
            return cf(
              e,
              t,
              a
            );
          t.flags |= 128;
        }
        if (c = t.memoizedState, c !== null && (c.rendering = null, c.tail = null, c.lastEffect = null), Z(ut, ut.current), l) break;
        return null;
      case 22:
        return t.lanes = 0, ef(
          e,
          t,
          a,
          t.pendingProps
        );
      case 24:
        _a(t, mt, e.memoizedState.cache);
    }
    return Kn(e, t, a);
  }
  function uf(e, t, a) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        pt = !0;
      else {
        if (!Qc(e, a) && (t.flags & 128) === 0)
          return pt = !1, vx(
            e,
            t,
            a
          );
        pt = (e.flags & 131072) !== 0;
      }
    else
      pt = !1, Le && (t.flags & 1048576) !== 0 && Fh(t, Rl, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          var l = t.pendingProps;
          if (e = ss(t.elementType), t.type = e, typeof e == "function")
            Io(e) ? (l = os(e, l), t.tag = 1, t = sf(
              null,
              t,
              e,
              l,
              a
            )) : (t.tag = 0, t = Uc(
              null,
              t,
              e,
              l,
              a
            ));
          else {
            if (e != null) {
              var c = e.$$typeof;
              if (c === G) {
                t.tag = 11, t = Jm(
                  null,
                  t,
                  e,
                  l,
                  a
                );
                break e;
              } else if (c === V) {
                t.tag = 14, t = Im(
                  null,
                  t,
                  e,
                  l,
                  a
                );
                break e;
              }
            }
            throw t = ge(e) || e, Error(o(306, t, ""));
          }
        }
        return t;
      case 0:
        return Uc(
          e,
          t,
          t.type,
          t.pendingProps,
          a
        );
      case 1:
        return l = t.type, c = os(
          l,
          t.pendingProps
        ), sf(
          e,
          t,
          l,
          c,
          a
        );
      case 3:
        e: {
          if (xe(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(o(387));
          l = t.pendingProps;
          var u = t.memoizedState;
          c = u.element, mc(e, t), Bl(t, l, null, a);
          var b = t.memoizedState;
          if (l = b.cache, _a(t, mt, l), l !== u.cache && rc(
            t,
            [mt],
            a,
            !0
          ), $l(), l = b.element, u.isDehydrated)
            if (u = {
              element: l,
              isDehydrated: !1,
              cache: b.cache
            }, t.updateQueue.baseState = u, t.memoizedState = u, t.flags & 256) {
              t = lf(
                e,
                t,
                l,
                a
              );
              break e;
            } else if (l !== c) {
              c = bn(
                Error(o(424)),
                t
              ), Al(c), t = lf(
                e,
                t,
                l,
                a
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
              for (nt = jn(e.firstChild), Tt = t, Le = !0, fa = null, vn = !0, a = em(
                t,
                null,
                l,
                a
              ), t.child = a; a; )
                a.flags = a.flags & -3 | 4096, a = a.sibling;
            }
          else {
            if (es(), l === c) {
              t = Kn(
                e,
                t,
                a
              );
              break e;
            }
            Mt(e, t, l, a);
          }
          t = t.child;
        }
        return t;
      case 26:
        return rr(e, t), e === null ? (a = yp(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = a : Le || (a = t.type, e = t.pendingProps, l = Sr(
          Q.current
        ).createElement(a), l[Ct] = t, l[Pt] = e, Rt(l, a, e), jt(l), t.stateNode = l) : t.memoizedState = yp(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return st(t), e === null && Le && (l = t.stateNode = gp(
          t.type,
          t.pendingProps,
          Q.current
        ), Tt = t, vn = !0, c = nt, Ea(t.type) ? (Nu = c, nt = jn(l.firstChild)) : nt = c), Mt(
          e,
          t,
          t.pendingProps.children,
          a
        ), rr(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && Le && ((c = l = nt) && (l = Kx(
          l,
          t.type,
          t.pendingProps,
          vn
        ), l !== null ? (t.stateNode = l, Tt = t, nt = jn(l.firstChild), vn = !1, c = !0) : c = !1), c || pa(t)), st(t), c = t.type, u = t.pendingProps, b = e !== null ? e.memoizedProps : null, l = u.children, yu(c, u) ? l = null : b !== null && yu(c, b) && (t.flags |= 32), t.memoizedState !== null && (c = vc(
          e,
          t,
          dx,
          null,
          null,
          a
        ), li._currentValue = c), rr(e, t), Mt(e, t, l, a), t.child;
      case 6:
        return e === null && Le && ((e = a = nt) && (a = Jx(
          a,
          t.pendingProps,
          vn
        ), a !== null ? (t.stateNode = a, Tt = t, nt = null, e = !0) : e = !1), e || pa(t)), null;
      case 13:
        return rf(e, t, a);
      case 4:
        return xe(
          t,
          t.stateNode.containerInfo
        ), l = t.pendingProps, e === null ? t.child = is(
          t,
          null,
          l,
          a
        ) : Mt(e, t, l, a), t.child;
      case 11:
        return Jm(
          e,
          t,
          t.type,
          t.pendingProps,
          a
        );
      case 7:
        return Mt(
          e,
          t,
          t.pendingProps,
          a
        ), t.child;
      case 8:
        return Mt(
          e,
          t,
          t.pendingProps.children,
          a
        ), t.child;
      case 12:
        return Mt(
          e,
          t,
          t.pendingProps.children,
          a
        ), t.child;
      case 10:
        return l = t.pendingProps, _a(t, t.type, l.value), Mt(e, t, l.children, a), t.child;
      case 9:
        return c = t.type._context, l = t.pendingProps.children, ns(t), c = Et(c), l = l(c), t.flags |= 1, Mt(e, t, l, a), t.child;
      case 14:
        return Im(
          e,
          t,
          t.type,
          t.pendingProps,
          a
        );
      case 15:
        return Wm(
          e,
          t,
          t.type,
          t.pendingProps,
          a
        );
      case 19:
        return cf(e, t, a);
      case 31:
        return xx(e, t, a);
      case 22:
        return ef(
          e,
          t,
          a,
          t.pendingProps
        );
      case 24:
        return ns(t), l = Et(mt), e === null ? (c = uc(), c === null && (c = Ke, u = oc(), c.pooledCache = u, u.refCount++, u !== null && (c.pooledCacheLanes |= a), c = u), t.memoizedState = { parent: l, cache: c }, hc(t), _a(t, mt, c)) : ((e.lanes & a) !== 0 && (mc(e, t), Bl(t, null, null, a), $l()), c = e.memoizedState, u = t.memoizedState, c.parent !== l ? (c = { parent: l, cache: l }, t.memoizedState = c, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = c), _a(t, mt, l)) : (l = u.cache, _a(t, mt, l), l !== c.cache && rc(
          t,
          [mt],
          a,
          !0
        ))), Mt(
          e,
          t,
          t.pendingProps.children,
          a
        ), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(o(156, t.tag));
  }
  function Jn(e) {
    e.flags |= 4;
  }
  function Pc(e, t, a, l, c) {
    if ((t = (e.mode & 32) !== 0) && (t = !1), t) {
      if (e.flags |= 16777216, (c & 335544128) === c)
        if (e.stateNode.complete) e.flags |= 8192;
        else if (Hf()) e.flags |= 8192;
        else
          throw ls = Xi, dc;
    } else e.flags &= -16777217;
  }
  function df(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !Np(t))
      if (Hf()) e.flags |= 8192;
      else
        throw ls = Xi, dc;
  }
  function cr(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? Vd() : 536870912, e.lanes |= t, Js |= t);
  }
  function Yl(e, t) {
    if (!Le)
      switch (e.tailMode) {
        case "hidden":
          t = e.tail;
          for (var a = null; t !== null; )
            t.alternate !== null && (a = t), t = t.sibling;
          a === null ? e.tail = null : a.sibling = null;
          break;
        case "collapsed":
          a = e.tail;
          for (var l = null; a !== null; )
            a.alternate !== null && (l = a), a = a.sibling;
          l === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : l.sibling = null;
      }
  }
  function at(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, a = 0, l = 0;
    if (t)
      for (var c = e.child; c !== null; )
        a |= c.lanes | c.childLanes, l |= c.subtreeFlags & 65011712, l |= c.flags & 65011712, c.return = e, c = c.sibling;
    else
      for (c = e.child; c !== null; )
        a |= c.lanes | c.childLanes, l |= c.subtreeFlags, l |= c.flags, c.return = e, c = c.sibling;
    return e.subtreeFlags |= l, e.childLanes = a, t;
  }
  function yx(e, t, a) {
    var l = t.pendingProps;
    switch (nc(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return at(t), null;
      case 1:
        return at(t), null;
      case 3:
        return a = t.stateNode, l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), Qn(mt), je(), a.pendingContext && (a.context = a.pendingContext, a.pendingContext = null), (e === null || e.child === null) && ($s(t) ? Jn(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, sc())), at(t), null;
      case 26:
        var c = t.type, u = t.memoizedState;
        return e === null ? (Jn(t), u !== null ? (at(t), df(t, u)) : (at(t), Pc(
          t,
          c,
          null,
          l,
          a
        ))) : u ? u !== e.memoizedState ? (Jn(t), at(t), df(t, u)) : (at(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== l && Jn(t), at(t), Pc(
          t,
          c,
          e,
          l,
          a
        )), null;
      case 27:
        if (et(t), a = Q.current, c = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== l && Jn(t);
        else {
          if (!l) {
            if (t.stateNode === null)
              throw Error(o(166));
            return at(t), null;
          }
          e = ne.current, $s(t) ? Vh(t) : (e = gp(c, l, a), t.stateNode = e, Jn(t));
        }
        return at(t), null;
      case 5:
        if (et(t), c = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== l && Jn(t);
        else {
          if (!l) {
            if (t.stateNode === null)
              throw Error(o(166));
            return at(t), null;
          }
          if (u = ne.current, $s(t))
            Vh(t);
          else {
            var b = Sr(
              Q.current
            );
            switch (u) {
              case 1:
                u = b.createElementNS(
                  "http://www.w3.org/2000/svg",
                  c
                );
                break;
              case 2:
                u = b.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  c
                );
                break;
              default:
                switch (c) {
                  case "svg":
                    u = b.createElementNS(
                      "http://www.w3.org/2000/svg",
                      c
                    );
                    break;
                  case "math":
                    u = b.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      c
                    );
                    break;
                  case "script":
                    u = b.createElement("div"), u.innerHTML = "<script><\/script>", u = u.removeChild(
                      u.firstChild
                    );
                    break;
                  case "select":
                    u = typeof l.is == "string" ? b.createElement("select", {
                      is: l.is
                    }) : b.createElement("select"), l.multiple ? u.multiple = !0 : l.size && (u.size = l.size);
                    break;
                  default:
                    u = typeof l.is == "string" ? b.createElement(c, { is: l.is }) : b.createElement(c);
                }
            }
            u[Ct] = t, u[Pt] = l;
            e: for (b = t.child; b !== null; ) {
              if (b.tag === 5 || b.tag === 6)
                u.appendChild(b.stateNode);
              else if (b.tag !== 4 && b.tag !== 27 && b.child !== null) {
                b.child.return = b, b = b.child;
                continue;
              }
              if (b === t) break e;
              for (; b.sibling === null; ) {
                if (b.return === null || b.return === t)
                  break e;
                b = b.return;
              }
              b.sibling.return = b.return, b = b.sibling;
            }
            t.stateNode = u;
            e: switch (Rt(u, c, l), c) {
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
            l && Jn(t);
          }
        }
        return at(t), Pc(
          t,
          t.type,
          e === null ? null : e.memoizedProps,
          t.pendingProps,
          a
        ), null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== l && Jn(t);
        else {
          if (typeof l != "string" && t.stateNode === null)
            throw Error(o(166));
          if (e = Q.current, $s(t)) {
            if (e = t.stateNode, a = t.memoizedProps, l = null, c = Tt, c !== null)
              switch (c.tag) {
                case 27:
                case 5:
                  l = c.memoizedProps;
              }
            e[Ct] = t, e = !!(e.nodeValue === a || l !== null && l.suppressHydrationWarning === !0 || rp(e.nodeValue, a)), e || pa(t, !0);
          } else
            e = Sr(e).createTextNode(
              l
            ), e[Ct] = t, t.stateNode = e;
        }
        return at(t), null;
      case 31:
        if (a = t.memoizedState, e === null || e.memoizedState !== null) {
          if (l = $s(t), a !== null) {
            if (e === null) {
              if (!l) throw Error(o(318));
              if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(557));
              e[Ct] = t;
            } else
              es(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            at(t), e = !1;
          } else
            a = sc(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), e = !0;
          if (!e)
            return t.flags & 256 ? (rn(t), t) : (rn(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(o(558));
        }
        return at(t), null;
      case 13:
        if (l = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (c = $s(t), l !== null && l.dehydrated !== null) {
            if (e === null) {
              if (!c) throw Error(o(318));
              if (c = t.memoizedState, c = c !== null ? c.dehydrated : null, !c) throw Error(o(317));
              c[Ct] = t;
            } else
              es(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            at(t), c = !1;
          } else
            c = sc(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = c), c = !0;
          if (!c)
            return t.flags & 256 ? (rn(t), t) : (rn(t), null);
        }
        return rn(t), (t.flags & 128) !== 0 ? (t.lanes = a, t) : (a = l !== null, e = e !== null && e.memoizedState !== null, a && (l = t.child, c = null, l.alternate !== null && l.alternate.memoizedState !== null && l.alternate.memoizedState.cachePool !== null && (c = l.alternate.memoizedState.cachePool.pool), u = null, l.memoizedState !== null && l.memoizedState.cachePool !== null && (u = l.memoizedState.cachePool.pool), u !== c && (l.flags |= 2048)), a !== e && a && (t.child.flags |= 8192), cr(t, t.updateQueue), at(t), null);
      case 4:
        return je(), e === null && _u(t.stateNode.containerInfo), at(t), null;
      case 10:
        return Qn(t.type), at(t), null;
      case 19:
        if ($(ut), l = t.memoizedState, l === null) return at(t), null;
        if (c = (t.flags & 128) !== 0, u = l.rendering, u === null)
          if (c) Yl(l, !1);
          else {
            if (ct !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (u = Ki(e), u !== null) {
                  for (t.flags |= 128, Yl(l, !1), e = u.updateQueue, t.updateQueue = e, cr(t, e), t.subtreeFlags = 0, e = a, a = t.child; a !== null; )
                    $h(a, e), a = a.sibling;
                  return Z(
                    ut,
                    ut.current & 1 | 2
                  ), Le && Yn(t, l.treeForkCount), t.child;
                }
                e = e.sibling;
              }
            l.tail !== null && ve() > fr && (t.flags |= 128, c = !0, Yl(l, !1), t.lanes = 4194304);
          }
        else {
          if (!c)
            if (e = Ki(u), e !== null) {
              if (t.flags |= 128, c = !0, e = e.updateQueue, t.updateQueue = e, cr(t, e), Yl(l, !0), l.tail === null && l.tailMode === "hidden" && !u.alternate && !Le)
                return at(t), null;
            } else
              2 * ve() - l.renderingStartTime > fr && a !== 536870912 && (t.flags |= 128, c = !0, Yl(l, !1), t.lanes = 4194304);
          l.isBackwards ? (u.sibling = t.child, t.child = u) : (e = l.last, e !== null ? e.sibling = u : t.child = u, l.last = u);
        }
        return l.tail !== null ? (e = l.tail, l.rendering = e, l.tail = e.sibling, l.renderingStartTime = ve(), e.sibling = null, a = ut.current, Z(
          ut,
          c ? a & 1 | 2 : a & 1
        ), Le && Yn(t, l.treeForkCount), e) : (at(t), null);
      case 22:
      case 23:
        return rn(t), bc(), l = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== l && (t.flags |= 8192) : l && (t.flags |= 8192), l ? (a & 536870912) !== 0 && (t.flags & 128) === 0 && (at(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : at(t), a = t.updateQueue, a !== null && cr(t, a.retryQueue), a = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (a = e.memoizedState.cachePool.pool), l = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), l !== a && (t.flags |= 2048), e !== null && $(as), null;
      case 24:
        return a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), Qn(mt), at(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(o(156, t.tag));
  }
  function jx(e, t) {
    switch (nc(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Qn(mt), je(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return et(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (rn(t), t.alternate === null)
            throw Error(o(340));
          es();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 13:
        if (rn(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(o(340));
          es();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return $(ut), null;
      case 4:
        return je(), null;
      case 10:
        return Qn(t.type), null;
      case 22:
      case 23:
        return rn(t), bc(), e !== null && $(as), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return Qn(mt), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function hf(e, t) {
    switch (nc(t), t.tag) {
      case 3:
        Qn(mt), je();
        break;
      case 26:
      case 27:
      case 5:
        et(t);
        break;
      case 4:
        je();
        break;
      case 31:
        t.memoizedState !== null && rn(t);
        break;
      case 13:
        rn(t);
        break;
      case 19:
        $(ut);
        break;
      case 10:
        Qn(t.type);
        break;
      case 22:
      case 23:
        rn(t), bc(), e !== null && $(as);
        break;
      case 24:
        Qn(mt);
    }
  }
  function Xl(e, t) {
    try {
      var a = t.updateQueue, l = a !== null ? a.lastEffect : null;
      if (l !== null) {
        var c = l.next;
        a = c;
        do {
          if ((a.tag & e) === e) {
            l = void 0;
            var u = a.create, b = a.inst;
            l = u(), b.destroy = l;
          }
          a = a.next;
        } while (a !== c);
      }
    } catch (j) {
      Ve(t, t.return, j);
    }
  }
  function ja(e, t, a) {
    try {
      var l = t.updateQueue, c = l !== null ? l.lastEffect : null;
      if (c !== null) {
        var u = c.next;
        l = u;
        do {
          if ((l.tag & e) === e) {
            var b = l.inst, j = b.destroy;
            if (j !== void 0) {
              b.destroy = void 0, c = t;
              var R = a, B = j;
              try {
                B();
              } catch (K) {
                Ve(
                  c,
                  R,
                  K
                );
              }
            }
          }
          l = l.next;
        } while (l !== u);
      }
    } catch (K) {
      Ve(t, t.return, K);
    }
  }
  function mf(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var a = e.stateNode;
      try {
        nm(t, a);
      } catch (l) {
        Ve(e, e.return, l);
      }
    }
  }
  function ff(e, t, a) {
    a.props = os(
      e.type,
      e.memoizedProps
    ), a.state = e.memoizedState;
    try {
      a.componentWillUnmount();
    } catch (l) {
      Ve(e, t, l);
    }
  }
  function Ql(e, t) {
    try {
      var a = e.ref;
      if (a !== null) {
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
        typeof a == "function" ? e.refCleanup = a(l) : a.current = l;
      }
    } catch (c) {
      Ve(e, t, c);
    }
  }
  function An(e, t) {
    var a = e.ref, l = e.refCleanup;
    if (a !== null)
      if (typeof l == "function")
        try {
          l();
        } catch (c) {
          Ve(e, t, c);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof a == "function")
        try {
          a(null);
        } catch (c) {
          Ve(e, t, c);
        }
      else a.current = null;
  }
  function pf(e) {
    var t = e.type, a = e.memoizedProps, l = e.stateNode;
    try {
      e: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          a.autoFocus && l.focus();
          break e;
        case "img":
          a.src ? l.src = a.src : a.srcSet && (l.srcset = a.srcSet);
      }
    } catch (c) {
      Ve(e, e.return, c);
    }
  }
  function Zc(e, t, a) {
    try {
      var l = e.stateNode;
      qx(l, e.type, a, t), l[Pt] = t;
    } catch (c) {
      Ve(e, e.return, c);
    }
  }
  function _f(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Ea(e.type) || e.tag === 4;
  }
  function Kc(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || _f(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && Ea(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Jc(e, t, a) {
    var l = e.tag;
    if (l === 5 || l === 6)
      e = e.stateNode, t ? (a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a).insertBefore(e, t) : (t = a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a, t.appendChild(e), a = a._reactRootContainer, a != null || t.onclick !== null || (t.onclick = Gn));
    else if (l !== 4 && (l === 27 && Ea(e.type) && (a = e.stateNode, t = null), e = e.child, e !== null))
      for (Jc(e, t, a), e = e.sibling; e !== null; )
        Jc(e, t, a), e = e.sibling;
  }
  function ur(e, t, a) {
    var l = e.tag;
    if (l === 5 || l === 6)
      e = e.stateNode, t ? a.insertBefore(e, t) : a.appendChild(e);
    else if (l !== 4 && (l === 27 && Ea(e.type) && (a = e.stateNode), e = e.child, e !== null))
      for (ur(e, t, a), e = e.sibling; e !== null; )
        ur(e, t, a), e = e.sibling;
  }
  function bf(e) {
    var t = e.stateNode, a = e.memoizedProps;
    try {
      for (var l = e.type, c = t.attributes; c.length; )
        t.removeAttributeNode(c[0]);
      Rt(t, l, a), t[Ct] = e, t[Pt] = a;
    } catch (u) {
      Ve(e, e.return, u);
    }
  }
  var In = !1, _t = !1, Ic = !1, gf = typeof WeakSet == "function" ? WeakSet : Set, wt = null;
  function wx(e, t) {
    if (e = e.containerInfo, xu = Rr, e = Eh(e), Yo(e)) {
      if ("selectionStart" in e)
        var a = {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      else
        e: {
          a = (a = e.ownerDocument) && a.defaultView || window;
          var l = a.getSelection && a.getSelection();
          if (l && l.rangeCount !== 0) {
            a = l.anchorNode;
            var c = l.anchorOffset, u = l.focusNode;
            l = l.focusOffset;
            try {
              a.nodeType, u.nodeType;
            } catch {
              a = null;
              break e;
            }
            var b = 0, j = -1, R = -1, B = 0, K = 0, ee = e, F = null;
            t: for (; ; ) {
              for (var Y; ee !== a || c !== 0 && ee.nodeType !== 3 || (j = b + c), ee !== u || l !== 0 && ee.nodeType !== 3 || (R = b + l), ee.nodeType === 3 && (b += ee.nodeValue.length), (Y = ee.firstChild) !== null; )
                F = ee, ee = Y;
              for (; ; ) {
                if (ee === e) break t;
                if (F === a && ++B === c && (j = b), F === u && ++K === l && (R = b), (Y = ee.nextSibling) !== null) break;
                ee = F, F = ee.parentNode;
              }
              ee = Y;
            }
            a = j === -1 || R === -1 ? null : { start: j, end: R };
          } else a = null;
        }
      a = a || { start: 0, end: 0 };
    } else a = null;
    for (vu = { focusedElem: e, selectionRange: a }, Rr = !1, wt = t; wt !== null; )
      if (t = wt, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null)
        e.return = t, wt = e;
      else
        for (; wt !== null; ) {
          switch (t = wt, u = t.alternate, e = t.flags, t.tag) {
            case 0:
              if ((e & 4) !== 0 && (e = t.updateQueue, e = e !== null ? e.events : null, e !== null))
                for (a = 0; a < e.length; a++)
                  c = e[a], c.ref.impl = c.nextImpl;
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && u !== null) {
                e = void 0, a = t, c = u.memoizedProps, u = u.memoizedState, l = a.stateNode;
                try {
                  var fe = os(
                    a.type,
                    c
                  );
                  e = l.getSnapshotBeforeUpdate(
                    fe,
                    u
                  ), l.__reactInternalSnapshotBeforeUpdate = e;
                } catch (Se) {
                  Ve(
                    a,
                    a.return,
                    Se
                  );
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (e = t.stateNode.containerInfo, a = e.nodeType, a === 9)
                  wu(e);
                else if (a === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      wu(e);
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
            e.return = t.return, wt = e;
            break;
          }
          wt = t.return;
        }
  }
  function xf(e, t, a) {
    var l = a.flags;
    switch (a.tag) {
      case 0:
      case 11:
      case 15:
        ea(e, a), l & 4 && Xl(5, a);
        break;
      case 1:
        if (ea(e, a), l & 4)
          if (e = a.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (b) {
              Ve(a, a.return, b);
            }
          else {
            var c = os(
              a.type,
              t.memoizedProps
            );
            t = t.memoizedState;
            try {
              e.componentDidUpdate(
                c,
                t,
                e.__reactInternalSnapshotBeforeUpdate
              );
            } catch (b) {
              Ve(
                a,
                a.return,
                b
              );
            }
          }
        l & 64 && mf(a), l & 512 && Ql(a, a.return);
        break;
      case 3:
        if (ea(e, a), l & 64 && (e = a.updateQueue, e !== null)) {
          if (t = null, a.child !== null)
            switch (a.child.tag) {
              case 27:
              case 5:
                t = a.child.stateNode;
                break;
              case 1:
                t = a.child.stateNode;
            }
          try {
            nm(e, t);
          } catch (b) {
            Ve(a, a.return, b);
          }
        }
        break;
      case 27:
        t === null && l & 4 && bf(a);
      case 26:
      case 5:
        ea(e, a), t === null && l & 4 && pf(a), l & 512 && Ql(a, a.return);
        break;
      case 12:
        ea(e, a);
        break;
      case 31:
        ea(e, a), l & 4 && jf(e, a);
        break;
      case 13:
        ea(e, a), l & 4 && wf(e, a), l & 64 && (e = a.memoizedState, e !== null && (e = e.dehydrated, e !== null && (a = Ax.bind(
          null,
          a
        ), Ix(e, a))));
        break;
      case 22:
        if (l = a.memoizedState !== null || In, !l) {
          t = t !== null && t.memoizedState !== null || _t, c = In;
          var u = _t;
          In = l, (_t = t) && !u ? ta(
            e,
            a,
            (a.subtreeFlags & 8772) !== 0
          ) : ea(e, a), In = c, _t = u;
        }
        break;
      case 30:
        break;
      default:
        ea(e, a);
    }
  }
  function vf(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, vf(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && To(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var lt = null, Kt = !1;
  function Wn(e, t, a) {
    for (a = a.child; a !== null; )
      yf(e, t, a), a = a.sibling;
  }
  function yf(e, t, a) {
    if (vt && typeof vt.onCommitFiberUnmount == "function")
      try {
        vt.onCommitFiberUnmount(Un, a);
      } catch {
      }
    switch (a.tag) {
      case 26:
        _t || An(a, t), Wn(
          e,
          t,
          a
        ), a.memoizedState ? a.memoizedState.count-- : a.stateNode && (a = a.stateNode, a.parentNode.removeChild(a));
        break;
      case 27:
        _t || An(a, t);
        var l = lt, c = Kt;
        Ea(a.type) && (lt = a.stateNode, Kt = !1), Wn(
          e,
          t,
          a
        ), ni(a.stateNode), lt = l, Kt = c;
        break;
      case 5:
        _t || An(a, t);
      case 6:
        if (l = lt, c = Kt, lt = null, Wn(
          e,
          t,
          a
        ), lt = l, Kt = c, lt !== null)
          if (Kt)
            try {
              (lt.nodeType === 9 ? lt.body : lt.nodeName === "HTML" ? lt.ownerDocument.body : lt).removeChild(a.stateNode);
            } catch (u) {
              Ve(
                a,
                t,
                u
              );
            }
          else
            try {
              lt.removeChild(a.stateNode);
            } catch (u) {
              Ve(
                a,
                t,
                u
              );
            }
        break;
      case 18:
        lt !== null && (Kt ? (e = lt, mp(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          a.stateNode
        ), ll(e)) : mp(lt, a.stateNode));
        break;
      case 4:
        l = lt, c = Kt, lt = a.stateNode.containerInfo, Kt = !0, Wn(
          e,
          t,
          a
        ), lt = l, Kt = c;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        ja(2, a, t), _t || ja(4, a, t), Wn(
          e,
          t,
          a
        );
        break;
      case 1:
        _t || (An(a, t), l = a.stateNode, typeof l.componentWillUnmount == "function" && ff(
          a,
          t,
          l
        )), Wn(
          e,
          t,
          a
        );
        break;
      case 21:
        Wn(
          e,
          t,
          a
        );
        break;
      case 22:
        _t = (l = _t) || a.memoizedState !== null, Wn(
          e,
          t,
          a
        ), _t = l;
        break;
      default:
        Wn(
          e,
          t,
          a
        );
    }
  }
  function jf(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
      e = e.dehydrated;
      try {
        ll(e);
      } catch (a) {
        Ve(t, t.return, a);
      }
    }
  }
  function wf(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        ll(e);
      } catch (a) {
        Ve(t, t.return, a);
      }
  }
  function Sx(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new gf()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new gf()), t;
      default:
        throw Error(o(435, e.tag));
    }
  }
  function dr(e, t) {
    var a = Sx(e);
    t.forEach(function(l) {
      if (!a.has(l)) {
        a.add(l);
        var c = Ox.bind(null, e, l);
        l.then(c, c);
      }
    });
  }
  function Jt(e, t) {
    var a = t.deletions;
    if (a !== null)
      for (var l = 0; l < a.length; l++) {
        var c = a[l], u = e, b = t, j = b;
        e: for (; j !== null; ) {
          switch (j.tag) {
            case 27:
              if (Ea(j.type)) {
                lt = j.stateNode, Kt = !1;
                break e;
              }
              break;
            case 5:
              lt = j.stateNode, Kt = !1;
              break e;
            case 3:
            case 4:
              lt = j.stateNode.containerInfo, Kt = !0;
              break e;
          }
          j = j.return;
        }
        if (lt === null) throw Error(o(160));
        yf(u, b, c), lt = null, Kt = !1, u = c.alternate, u !== null && (u.return = null), c.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        Sf(t, e), t = t.sibling;
  }
  var Nn = null;
  function Sf(e, t) {
    var a = e.alternate, l = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        Jt(t, e), It(e), l & 4 && (ja(3, e, e.return), Xl(3, e), ja(5, e, e.return));
        break;
      case 1:
        Jt(t, e), It(e), l & 512 && (_t || a === null || An(a, a.return)), l & 64 && In && (e = e.updateQueue, e !== null && (l = e.callbacks, l !== null && (a = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = a === null ? l : a.concat(l))));
        break;
      case 26:
        var c = Nn;
        if (Jt(t, e), It(e), l & 512 && (_t || a === null || An(a, a.return)), l & 4) {
          var u = a !== null ? a.memoizedState : null;
          if (l = e.memoizedState, a === null)
            if (l === null)
              if (e.stateNode === null) {
                e: {
                  l = e.type, a = e.memoizedProps, c = c.ownerDocument || c;
                  t: switch (l) {
                    case "title":
                      u = c.getElementsByTagName("title")[0], (!u || u[vl] || u[Ct] || u.namespaceURI === "http://www.w3.org/2000/svg" || u.hasAttribute("itemprop")) && (u = c.createElement(l), c.head.insertBefore(
                        u,
                        c.querySelector("head > title")
                      )), Rt(u, l, a), u[Ct] = e, jt(u), l = u;
                      break e;
                    case "link":
                      var b = Sp(
                        "link",
                        "href",
                        c
                      ).get(l + (a.href || ""));
                      if (b) {
                        for (var j = 0; j < b.length; j++)
                          if (u = b[j], u.getAttribute("href") === (a.href == null || a.href === "" ? null : a.href) && u.getAttribute("rel") === (a.rel == null ? null : a.rel) && u.getAttribute("title") === (a.title == null ? null : a.title) && u.getAttribute("crossorigin") === (a.crossOrigin == null ? null : a.crossOrigin)) {
                            b.splice(j, 1);
                            break t;
                          }
                      }
                      u = c.createElement(l), Rt(u, l, a), c.head.appendChild(u);
                      break;
                    case "meta":
                      if (b = Sp(
                        "meta",
                        "content",
                        c
                      ).get(l + (a.content || ""))) {
                        for (j = 0; j < b.length; j++)
                          if (u = b[j], u.getAttribute("content") === (a.content == null ? null : "" + a.content) && u.getAttribute("name") === (a.name == null ? null : a.name) && u.getAttribute("property") === (a.property == null ? null : a.property) && u.getAttribute("http-equiv") === (a.httpEquiv == null ? null : a.httpEquiv) && u.getAttribute("charset") === (a.charSet == null ? null : a.charSet)) {
                            b.splice(j, 1);
                            break t;
                          }
                      }
                      u = c.createElement(l), Rt(u, l, a), c.head.appendChild(u);
                      break;
                    default:
                      throw Error(o(468, l));
                  }
                  u[Ct] = e, jt(u), l = u;
                }
                e.stateNode = l;
              } else
                kp(
                  c,
                  e.type,
                  e.stateNode
                );
            else
              e.stateNode = wp(
                c,
                l,
                e.memoizedProps
              );
          else
            u !== l ? (u === null ? a.stateNode !== null && (a = a.stateNode, a.parentNode.removeChild(a)) : u.count--, l === null ? kp(
              c,
              e.type,
              e.stateNode
            ) : wp(
              c,
              l,
              e.memoizedProps
            )) : l === null && e.stateNode !== null && Zc(
              e,
              e.memoizedProps,
              a.memoizedProps
            );
        }
        break;
      case 27:
        Jt(t, e), It(e), l & 512 && (_t || a === null || An(a, a.return)), a !== null && l & 4 && Zc(
          e,
          e.memoizedProps,
          a.memoizedProps
        );
        break;
      case 5:
        if (Jt(t, e), It(e), l & 512 && (_t || a === null || An(a, a.return)), e.flags & 32) {
          c = e.stateNode;
          try {
            Ts(c, "");
          } catch (fe) {
            Ve(e, e.return, fe);
          }
        }
        l & 4 && e.stateNode != null && (c = e.memoizedProps, Zc(
          e,
          c,
          a !== null ? a.memoizedProps : c
        )), l & 1024 && (Ic = !0);
        break;
      case 6:
        if (Jt(t, e), It(e), l & 4) {
          if (e.stateNode === null)
            throw Error(o(162));
          l = e.memoizedProps, a = e.stateNode;
          try {
            a.nodeValue = l;
          } catch (fe) {
            Ve(e, e.return, fe);
          }
        }
        break;
      case 3:
        if (Cr = null, c = Nn, Nn = kr(t.containerInfo), Jt(t, e), Nn = c, It(e), l & 4 && a !== null && a.memoizedState.isDehydrated)
          try {
            ll(t.containerInfo);
          } catch (fe) {
            Ve(e, e.return, fe);
          }
        Ic && (Ic = !1, kf(e));
        break;
      case 4:
        l = Nn, Nn = kr(
          e.stateNode.containerInfo
        ), Jt(t, e), It(e), Nn = l;
        break;
      case 12:
        Jt(t, e), It(e);
        break;
      case 31:
        Jt(t, e), It(e), l & 4 && (l = e.updateQueue, l !== null && (e.updateQueue = null, dr(e, l)));
        break;
      case 13:
        Jt(t, e), It(e), e.child.flags & 8192 && e.memoizedState !== null != (a !== null && a.memoizedState !== null) && (mr = ve()), l & 4 && (l = e.updateQueue, l !== null && (e.updateQueue = null, dr(e, l)));
        break;
      case 22:
        c = e.memoizedState !== null;
        var R = a !== null && a.memoizedState !== null, B = In, K = _t;
        if (In = B || c, _t = K || R, Jt(t, e), _t = K, In = B, It(e), l & 8192)
          e: for (t = e.stateNode, t._visibility = c ? t._visibility & -2 : t._visibility | 1, c && (a === null || R || In || _t || cs(e)), a = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (a === null) {
                R = a = t;
                try {
                  if (u = R.stateNode, c)
                    b = u.style, typeof b.setProperty == "function" ? b.setProperty("display", "none", "important") : b.display = "none";
                  else {
                    j = R.stateNode;
                    var ee = R.memoizedProps.style, F = ee != null && ee.hasOwnProperty("display") ? ee.display : null;
                    j.style.display = F == null || typeof F == "boolean" ? "" : ("" + F).trim();
                  }
                } catch (fe) {
                  Ve(R, R.return, fe);
                }
              }
            } else if (t.tag === 6) {
              if (a === null) {
                R = t;
                try {
                  R.stateNode.nodeValue = c ? "" : R.memoizedProps;
                } catch (fe) {
                  Ve(R, R.return, fe);
                }
              }
            } else if (t.tag === 18) {
              if (a === null) {
                R = t;
                try {
                  var Y = R.stateNode;
                  c ? fp(Y, !0) : fp(R.stateNode, !1);
                } catch (fe) {
                  Ve(R, R.return, fe);
                }
              }
            } else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === e) && t.child !== null) {
              t.child.return = t, t = t.child;
              continue;
            }
            if (t === e) break e;
            for (; t.sibling === null; ) {
              if (t.return === null || t.return === e) break e;
              a === t && (a = null), t = t.return;
            }
            a === t && (a = null), t.sibling.return = t.return, t = t.sibling;
          }
        l & 4 && (l = e.updateQueue, l !== null && (a = l.retryQueue, a !== null && (l.retryQueue = null, dr(e, a))));
        break;
      case 19:
        Jt(t, e), It(e), l & 4 && (l = e.updateQueue, l !== null && (e.updateQueue = null, dr(e, l)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        Jt(t, e), It(e);
    }
  }
  function It(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var a, l = e.return; l !== null; ) {
          if (_f(l)) {
            a = l;
            break;
          }
          l = l.return;
        }
        if (a == null) throw Error(o(160));
        switch (a.tag) {
          case 27:
            var c = a.stateNode, u = Kc(e);
            ur(e, u, c);
            break;
          case 5:
            var b = a.stateNode;
            a.flags & 32 && (Ts(b, ""), a.flags &= -33);
            var j = Kc(e);
            ur(e, j, b);
            break;
          case 3:
          case 4:
            var R = a.stateNode.containerInfo, B = Kc(e);
            Jc(
              e,
              B,
              R
            );
            break;
          default:
            throw Error(o(161));
        }
      } catch (K) {
        Ve(e, e.return, K);
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
  function ea(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        xf(e, t.alternate, t), t = t.sibling;
  }
  function cs(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          ja(4, t, t.return), cs(t);
          break;
        case 1:
          An(t, t.return);
          var a = t.stateNode;
          typeof a.componentWillUnmount == "function" && ff(
            t,
            t.return,
            a
          ), cs(t);
          break;
        case 27:
          ni(t.stateNode);
        case 26:
        case 5:
          An(t, t.return), cs(t);
          break;
        case 22:
          t.memoizedState === null && cs(t);
          break;
        case 30:
          cs(t);
          break;
        default:
          cs(t);
      }
      e = e.sibling;
    }
  }
  function ta(e, t, a) {
    for (a = a && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var l = t.alternate, c = e, u = t, b = u.flags;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          ta(
            c,
            u,
            a
          ), Xl(4, u);
          break;
        case 1:
          if (ta(
            c,
            u,
            a
          ), l = u, c = l.stateNode, typeof c.componentDidMount == "function")
            try {
              c.componentDidMount();
            } catch (B) {
              Ve(l, l.return, B);
            }
          if (l = u, c = l.updateQueue, c !== null) {
            var j = l.stateNode;
            try {
              var R = c.shared.hiddenCallbacks;
              if (R !== null)
                for (c.shared.hiddenCallbacks = null, c = 0; c < R.length; c++)
                  tm(R[c], j);
            } catch (B) {
              Ve(l, l.return, B);
            }
          }
          a && b & 64 && mf(u), Ql(u, u.return);
          break;
        case 27:
          bf(u);
        case 26:
        case 5:
          ta(
            c,
            u,
            a
          ), a && l === null && b & 4 && pf(u), Ql(u, u.return);
          break;
        case 12:
          ta(
            c,
            u,
            a
          );
          break;
        case 31:
          ta(
            c,
            u,
            a
          ), a && b & 4 && jf(c, u);
          break;
        case 13:
          ta(
            c,
            u,
            a
          ), a && b & 4 && wf(c, u);
          break;
        case 22:
          u.memoizedState === null && ta(
            c,
            u,
            a
          ), Ql(u, u.return);
          break;
        case 30:
          break;
        default:
          ta(
            c,
            u,
            a
          );
      }
      t = t.sibling;
    }
  }
  function Wc(e, t) {
    var a = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (a = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== a && (e != null && e.refCount++, a != null && Ol(a));
  }
  function eu(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Ol(e));
  }
  function Cn(e, t, a, l) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        Nf(
          e,
          t,
          a,
          l
        ), t = t.sibling;
  }
  function Nf(e, t, a, l) {
    var c = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Cn(
          e,
          t,
          a,
          l
        ), c & 2048 && Xl(9, t);
        break;
      case 1:
        Cn(
          e,
          t,
          a,
          l
        );
        break;
      case 3:
        Cn(
          e,
          t,
          a,
          l
        ), c & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Ol(e)));
        break;
      case 12:
        if (c & 2048) {
          Cn(
            e,
            t,
            a,
            l
          ), e = t.stateNode;
          try {
            var u = t.memoizedProps, b = u.id, j = u.onPostCommit;
            typeof j == "function" && j(
              b,
              t.alternate === null ? "mount" : "update",
              e.passiveEffectDuration,
              -0
            );
          } catch (R) {
            Ve(t, t.return, R);
          }
        } else
          Cn(
            e,
            t,
            a,
            l
          );
        break;
      case 31:
        Cn(
          e,
          t,
          a,
          l
        );
        break;
      case 13:
        Cn(
          e,
          t,
          a,
          l
        );
        break;
      case 23:
        break;
      case 22:
        u = t.stateNode, b = t.alternate, t.memoizedState !== null ? u._visibility & 2 ? Cn(
          e,
          t,
          a,
          l
        ) : Pl(e, t) : u._visibility & 2 ? Cn(
          e,
          t,
          a,
          l
        ) : (u._visibility |= 2, Ps(
          e,
          t,
          a,
          l,
          (t.subtreeFlags & 10256) !== 0 || !1
        )), c & 2048 && Wc(b, t);
        break;
      case 24:
        Cn(
          e,
          t,
          a,
          l
        ), c & 2048 && eu(t.alternate, t);
        break;
      default:
        Cn(
          e,
          t,
          a,
          l
        );
    }
  }
  function Ps(e, t, a, l, c) {
    for (c = c && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var u = e, b = t, j = a, R = l, B = b.flags;
      switch (b.tag) {
        case 0:
        case 11:
        case 15:
          Ps(
            u,
            b,
            j,
            R,
            c
          ), Xl(8, b);
          break;
        case 23:
          break;
        case 22:
          var K = b.stateNode;
          b.memoizedState !== null ? K._visibility & 2 ? Ps(
            u,
            b,
            j,
            R,
            c
          ) : Pl(
            u,
            b
          ) : (K._visibility |= 2, Ps(
            u,
            b,
            j,
            R,
            c
          )), c && B & 2048 && Wc(
            b.alternate,
            b
          );
          break;
        case 24:
          Ps(
            u,
            b,
            j,
            R,
            c
          ), c && B & 2048 && eu(b.alternate, b);
          break;
        default:
          Ps(
            u,
            b,
            j,
            R,
            c
          );
      }
      t = t.sibling;
    }
  }
  function Pl(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var a = e, l = t, c = l.flags;
        switch (l.tag) {
          case 22:
            Pl(a, l), c & 2048 && Wc(
              l.alternate,
              l
            );
            break;
          case 24:
            Pl(a, l), c & 2048 && eu(l.alternate, l);
            break;
          default:
            Pl(a, l);
        }
        t = t.sibling;
      }
  }
  var Zl = 8192;
  function Zs(e, t, a) {
    if (e.subtreeFlags & Zl)
      for (e = e.child; e !== null; )
        Cf(
          e,
          t,
          a
        ), e = e.sibling;
  }
  function Cf(e, t, a) {
    switch (e.tag) {
      case 26:
        Zs(
          e,
          t,
          a
        ), e.flags & Zl && e.memoizedState !== null && uv(
          a,
          Nn,
          e.memoizedState,
          e.memoizedProps
        );
        break;
      case 5:
        Zs(
          e,
          t,
          a
        );
        break;
      case 3:
      case 4:
        var l = Nn;
        Nn = kr(e.stateNode.containerInfo), Zs(
          e,
          t,
          a
        ), Nn = l;
        break;
      case 22:
        e.memoizedState === null && (l = e.alternate, l !== null && l.memoizedState !== null ? (l = Zl, Zl = 16777216, Zs(
          e,
          t,
          a
        ), Zl = l) : Zs(
          e,
          t,
          a
        ));
        break;
      default:
        Zs(
          e,
          t,
          a
        );
    }
  }
  function Tf(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function Kl(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var a = 0; a < t.length; a++) {
          var l = t[a];
          wt = l, Mf(
            l,
            e
          );
        }
      Tf(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        Ef(e), e = e.sibling;
  }
  function Ef(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        Kl(e), e.flags & 2048 && ja(9, e, e.return);
        break;
      case 3:
        Kl(e);
        break;
      case 12:
        Kl(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, hr(e)) : Kl(e);
        break;
      default:
        Kl(e);
    }
  }
  function hr(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var a = 0; a < t.length; a++) {
          var l = t[a];
          wt = l, Mf(
            l,
            e
          );
        }
      Tf(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          ja(8, t, t.return), hr(t);
          break;
        case 22:
          a = t.stateNode, a._visibility & 2 && (a._visibility &= -3, hr(t));
          break;
        default:
          hr(t);
      }
      e = e.sibling;
    }
  }
  function Mf(e, t) {
    for (; wt !== null; ) {
      var a = wt;
      switch (a.tag) {
        case 0:
        case 11:
        case 15:
          ja(8, a, t);
          break;
        case 23:
        case 22:
          if (a.memoizedState !== null && a.memoizedState.cachePool !== null) {
            var l = a.memoizedState.cachePool.pool;
            l != null && l.refCount++;
          }
          break;
        case 24:
          Ol(a.memoizedState.cache);
      }
      if (l = a.child, l !== null) l.return = a, wt = l;
      else
        e: for (a = e; wt !== null; ) {
          l = wt;
          var c = l.sibling, u = l.return;
          if (vf(l), l === a) {
            wt = null;
            break e;
          }
          if (c !== null) {
            c.return = u, wt = c;
            break e;
          }
          wt = u;
        }
    }
  }
  var kx = {
    getCacheForType: function(e) {
      var t = Et(mt), a = t.data.get(e);
      return a === void 0 && (a = e(), t.data.set(e, a)), a;
    },
    cacheSignal: function() {
      return Et(mt).controller.signal;
    }
  }, Nx = typeof WeakMap == "function" ? WeakMap : Map, Ue = 0, Ke = null, Re = null, Oe = 0, Ge = 0, on = null, wa = !1, Ks = !1, tu = !1, na = 0, ct = 0, Sa = 0, us = 0, nu = 0, cn = 0, Js = 0, Jl = null, Wt = null, au = !1, mr = 0, Rf = 0, fr = 1 / 0, pr = null, ka = null, yt = 0, Na = null, Is = null, aa = 0, su = 0, lu = null, Af = null, Il = 0, iu = null;
  function un() {
    return (Ue & 2) !== 0 && Oe !== 0 ? Oe & -Oe : S.T !== null ? hu() : Qd();
  }
  function Of() {
    if (cn === 0)
      if ((Oe & 536870912) === 0 || Le) {
        var e = mn;
        mn <<= 1, (mn & 3932160) === 0 && (mn = 262144), cn = e;
      } else cn = 536870912;
    return e = ln.current, e !== null && (e.flags |= 32), cn;
  }
  function en(e, t, a) {
    (e === Ke && (Ge === 2 || Ge === 9) || e.cancelPendingCommit !== null) && (Ws(e, 0), Ca(
      e,
      Oe,
      cn,
      !1
    )), xl(e, a), ((Ue & 2) === 0 || e !== Ke) && (e === Ke && ((Ue & 2) === 0 && (us |= a), ct === 4 && Ca(
      e,
      Oe,
      cn,
      !1
    )), On(e));
  }
  function zf(e, t, a) {
    if ((Ue & 6) !== 0) throw Error(o(327));
    var l = !a && (t & 127) === 0 && (t & e.expiredLanes) === 0 || gl(e, t), c = l ? Ex(e, t) : ou(e, t, !0), u = l;
    do {
      if (c === 0) {
        Ks && !l && Ca(e, t, 0, !1);
        break;
      } else {
        if (a = e.current.alternate, u && !Cx(a)) {
          c = ou(e, t, !1), u = !1;
          continue;
        }
        if (c === 2) {
          if (u = t, e.errorRecoveryDisabledLanes & u)
            var b = 0;
          else
            b = e.pendingLanes & -536870913, b = b !== 0 ? b : b & 536870912 ? 536870912 : 0;
          if (b !== 0) {
            t = b;
            e: {
              var j = e;
              c = Jl;
              var R = j.current.memoizedState.isDehydrated;
              if (R && (Ws(j, b).flags |= 256), b = ou(
                j,
                b,
                !1
              ), b !== 2) {
                if (tu && !R) {
                  j.errorRecoveryDisabledLanes |= u, us |= u, c = 4;
                  break e;
                }
                u = Wt, Wt = c, u !== null && (Wt === null ? Wt = u : Wt.push.apply(
                  Wt,
                  u
                ));
              }
              c = b;
            }
            if (u = !1, c !== 2) continue;
          }
        }
        if (c === 1) {
          Ws(e, 0), Ca(e, t, 0, !0);
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
              Ca(
                l,
                t,
                cn,
                !wa
              );
              break e;
            case 2:
              Wt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(o(329));
          }
          if ((t & 62914560) === t && (c = mr + 300 - ve(), 10 < c)) {
            if (Ca(
              l,
              t,
              cn,
              !wa
            ), ki(l, 0, !0) !== 0) break e;
            aa = t, l.timeoutHandle = dp(
              Df.bind(
                null,
                l,
                a,
                Wt,
                pr,
                au,
                t,
                cn,
                us,
                Js,
                wa,
                u,
                "Throttled",
                -0,
                0
              ),
              c
            );
            break e;
          }
          Df(
            l,
            a,
            Wt,
            pr,
            au,
            t,
            cn,
            us,
            Js,
            wa,
            u,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    On(e);
  }
  function Df(e, t, a, l, c, u, b, j, R, B, K, ee, F, Y) {
    if (e.timeoutHandle = -1, ee = t.subtreeFlags, ee & 8192 || (ee & 16785408) === 16785408) {
      ee = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: Gn
      }, Cf(
        t,
        u,
        ee
      );
      var fe = (u & 62914560) === u ? mr - ve() : (u & 4194048) === u ? Rf - ve() : 0;
      if (fe = dv(
        ee,
        fe
      ), fe !== null) {
        aa = u, e.cancelPendingCommit = fe(
          Vf.bind(
            null,
            e,
            t,
            u,
            a,
            l,
            c,
            b,
            j,
            R,
            K,
            ee,
            null,
            F,
            Y
          )
        ), Ca(e, u, b, !B);
        return;
      }
    }
    Vf(
      e,
      t,
      u,
      a,
      l,
      c,
      b,
      j,
      R
    );
  }
  function Cx(e) {
    for (var t = e; ; ) {
      var a = t.tag;
      if ((a === 0 || a === 11 || a === 15) && t.flags & 16384 && (a = t.updateQueue, a !== null && (a = a.stores, a !== null)))
        for (var l = 0; l < a.length; l++) {
          var c = a[l], u = c.getSnapshot;
          c = c.value;
          try {
            if (!an(u(), c)) return !1;
          } catch {
            return !1;
          }
        }
      if (a = t.child, t.subtreeFlags & 16384 && a !== null)
        a.return = t, t = a;
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
  function Ca(e, t, a, l) {
    t &= ~nu, t &= ~us, e.suspendedLanes |= t, e.pingedLanes &= ~t, l && (e.warmLanes |= t), l = e.expirationTimes;
    for (var c = t; 0 < c; ) {
      var u = 31 - Lt(c), b = 1 << u;
      l[u] = -1, c &= ~b;
    }
    a !== 0 && qd(e, a, t);
  }
  function _r() {
    return (Ue & 6) === 0 ? (Wl(0), !1) : !0;
  }
  function ru() {
    if (Re !== null) {
      if (Ge === 0)
        var e = Re.return;
      else
        e = Re, Xn = ts = null, wc(e), Vs = null, Dl = 0, e = Re;
      for (; e !== null; )
        hf(e.alternate, e), e = e.return;
      Re = null;
    }
  }
  function Ws(e, t) {
    var a = e.timeoutHandle;
    a !== -1 && (e.timeoutHandle = -1, Qx(a)), a = e.cancelPendingCommit, a !== null && (e.cancelPendingCommit = null, a()), aa = 0, ru(), Ke = e, Re = a = qn(e.current, null), Oe = t, Ge = 0, on = null, wa = !1, Ks = gl(e, t), tu = !1, Js = cn = nu = us = Sa = ct = 0, Wt = Jl = null, au = !1, (t & 8) !== 0 && (t |= t & 32);
    var l = e.entangledLanes;
    if (l !== 0)
      for (e = e.entanglements, l &= t; 0 < l; ) {
        var c = 31 - Lt(l), u = 1 << c;
        t |= e[c], l &= ~u;
      }
    return na = t, Hi(), a;
  }
  function Lf(e, t) {
    Te = null, S.H = Vl, t === Gs || t === Yi ? (t = Jh(), Ge = 3) : t === dc ? (t = Jh(), Ge = 4) : Ge = t === Bc ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, on = t, Re === null && (ct = 1, lr(
      e,
      bn(t, e.current)
    ));
  }
  function Hf() {
    var e = ln.current;
    return e === null ? !0 : (Oe & 4194048) === Oe ? yn === null : (Oe & 62914560) === Oe || (Oe & 536870912) !== 0 ? e === yn : !1;
  }
  function $f() {
    var e = S.H;
    return S.H = Vl, e === null ? Vl : e;
  }
  function Bf() {
    var e = S.A;
    return S.A = kx, e;
  }
  function br() {
    ct = 4, wa || (Oe & 4194048) !== Oe && ln.current !== null || (Ks = !0), (Sa & 134217727) === 0 && (us & 134217727) === 0 || Ke === null || Ca(
      Ke,
      Oe,
      cn,
      !1
    );
  }
  function ou(e, t, a) {
    var l = Ue;
    Ue |= 2;
    var c = $f(), u = Bf();
    (Ke !== e || Oe !== t) && (pr = null, Ws(e, t)), t = !1;
    var b = ct;
    e: do
      try {
        if (Ge !== 0 && Re !== null) {
          var j = Re, R = on;
          switch (Ge) {
            case 8:
              ru(), b = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              ln.current === null && (t = !0);
              var B = Ge;
              if (Ge = 0, on = null, el(e, j, R, B), a && Ks) {
                b = 0;
                break e;
              }
              break;
            default:
              B = Ge, Ge = 0, on = null, el(e, j, R, B);
          }
        }
        Tx(), b = ct;
        break;
      } catch (K) {
        Lf(e, K);
      }
    while (!0);
    return t && e.shellSuspendCounter++, Xn = ts = null, Ue = l, S.H = c, S.A = u, Re === null && (Ke = null, Oe = 0, Hi()), b;
  }
  function Tx() {
    for (; Re !== null; ) Uf(Re);
  }
  function Ex(e, t) {
    var a = Ue;
    Ue |= 2;
    var l = $f(), c = Bf();
    Ke !== e || Oe !== t ? (pr = null, fr = ve() + 500, Ws(e, t)) : Ks = gl(
      e,
      t
    );
    e: do
      try {
        if (Ge !== 0 && Re !== null) {
          t = Re;
          var u = on;
          t: switch (Ge) {
            case 1:
              Ge = 0, on = null, el(e, t, u, 1);
              break;
            case 2:
            case 9:
              if (Zh(u)) {
                Ge = 0, on = null, Ff(t);
                break;
              }
              t = function() {
                Ge !== 2 && Ge !== 9 || Ke !== e || (Ge = 7), On(e);
              }, u.then(t, t);
              break e;
            case 3:
              Ge = 7;
              break e;
            case 4:
              Ge = 5;
              break e;
            case 7:
              Zh(u) ? (Ge = 0, on = null, Ff(t)) : (Ge = 0, on = null, el(e, t, u, 7));
              break;
            case 5:
              var b = null;
              switch (Re.tag) {
                case 26:
                  b = Re.memoizedState;
                case 5:
                case 27:
                  var j = Re;
                  if (b ? Np(b) : j.stateNode.complete) {
                    Ge = 0, on = null;
                    var R = j.sibling;
                    if (R !== null) Re = R;
                    else {
                      var B = j.return;
                      B !== null ? (Re = B, gr(B)) : Re = null;
                    }
                    break t;
                  }
              }
              Ge = 0, on = null, el(e, t, u, 5);
              break;
            case 6:
              Ge = 0, on = null, el(e, t, u, 6);
              break;
            case 8:
              ru(), ct = 6;
              break e;
            default:
              throw Error(o(462));
          }
        }
        Mx();
        break;
      } catch (K) {
        Lf(e, K);
      }
    while (!0);
    return Xn = ts = null, S.H = l, S.A = c, Ue = a, Re !== null ? 0 : (Ke = null, Oe = 0, Hi(), ct);
  }
  function Mx() {
    for (; Re !== null && !Xt(); )
      Uf(Re);
  }
  function Uf(e) {
    var t = uf(e.alternate, e, na);
    e.memoizedProps = e.pendingProps, t === null ? gr(e) : Re = t;
  }
  function Ff(e) {
    var t = e, a = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = af(
          a,
          t,
          t.pendingProps,
          t.type,
          void 0,
          Oe
        );
        break;
      case 11:
        t = af(
          a,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          Oe
        );
        break;
      case 5:
        wc(t);
      default:
        hf(a, t), t = Re = $h(t, na), t = uf(a, t, na);
    }
    e.memoizedProps = e.pendingProps, t === null ? gr(e) : Re = t;
  }
  function el(e, t, a, l) {
    Xn = ts = null, wc(t), Vs = null, Dl = 0;
    var c = t.return;
    try {
      if (gx(
        e,
        c,
        t,
        a,
        Oe
      )) {
        ct = 1, lr(
          e,
          bn(a, e.current)
        ), Re = null;
        return;
      }
    } catch (u) {
      if (c !== null) throw Re = c, u;
      ct = 1, lr(
        e,
        bn(a, e.current)
      ), Re = null;
      return;
    }
    t.flags & 32768 ? (Le || l === 1 ? e = !0 : Ks || (Oe & 536870912) !== 0 ? e = !1 : (wa = e = !0, (l === 2 || l === 9 || l === 3 || l === 6) && (l = ln.current, l !== null && l.tag === 13 && (l.flags |= 16384))), Gf(t, e)) : gr(t);
  }
  function gr(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        Gf(
          t,
          wa
        );
        return;
      }
      e = t.return;
      var a = yx(
        t.alternate,
        t,
        na
      );
      if (a !== null) {
        Re = a;
        return;
      }
      if (t = t.sibling, t !== null) {
        Re = t;
        return;
      }
      Re = t = e;
    } while (t !== null);
    ct === 0 && (ct = 5);
  }
  function Gf(e, t) {
    do {
      var a = jx(e.alternate, e);
      if (a !== null) {
        a.flags &= 32767, Re = a;
        return;
      }
      if (a = e.return, a !== null && (a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null), !t && (e = e.sibling, e !== null)) {
        Re = e;
        return;
      }
      Re = e = a;
    } while (e !== null);
    ct = 6, Re = null;
  }
  function Vf(e, t, a, l, c, u, b, j, R) {
    e.cancelPendingCommit = null;
    do
      xr();
    while (yt !== 0);
    if ((Ue & 6) !== 0) throw Error(o(327));
    if (t !== null) {
      if (t === e.current) throw Error(o(177));
      if (u = t.lanes | t.childLanes, u |= Ko, cg(
        e,
        a,
        u,
        b,
        j,
        R
      ), e === Ke && (Re = Ke = null, Oe = 0), Is = t, Na = e, aa = a, su = u, lu = c, Af = l, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, zx(Qt, function() {
        return Pf(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), l = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || l) {
        l = S.T, S.T = null, c = O.p, O.p = 2, b = Ue, Ue |= 4;
        try {
          wx(e, t, a);
        } finally {
          Ue = b, O.p = c, S.T = l;
        }
      }
      yt = 1, qf(), Yf(), Xf();
    }
  }
  function qf() {
    if (yt === 1) {
      yt = 0;
      var e = Na, t = Is, a = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || a) {
        a = S.T, S.T = null;
        var l = O.p;
        O.p = 2;
        var c = Ue;
        Ue |= 4;
        try {
          Sf(t, e);
          var u = vu, b = Eh(e.containerInfo), j = u.focusedElem, R = u.selectionRange;
          if (b !== j && j && j.ownerDocument && Th(
            j.ownerDocument.documentElement,
            j
          )) {
            if (R !== null && Yo(j)) {
              var B = R.start, K = R.end;
              if (K === void 0 && (K = B), "selectionStart" in j)
                j.selectionStart = B, j.selectionEnd = Math.min(
                  K,
                  j.value.length
                );
              else {
                var ee = j.ownerDocument || document, F = ee && ee.defaultView || window;
                if (F.getSelection) {
                  var Y = F.getSelection(), fe = j.textContent.length, Se = Math.min(R.start, fe), Ze = R.end === void 0 ? Se : Math.min(R.end, fe);
                  !Y.extend && Se > Ze && (b = Ze, Ze = Se, Se = b);
                  var D = Ch(
                    j,
                    Se
                  ), A = Ch(
                    j,
                    Ze
                  );
                  if (D && A && (Y.rangeCount !== 1 || Y.anchorNode !== D.node || Y.anchorOffset !== D.offset || Y.focusNode !== A.node || Y.focusOffset !== A.offset)) {
                    var H = ee.createRange();
                    H.setStart(D.node, D.offset), Y.removeAllRanges(), Se > Ze ? (Y.addRange(H), Y.extend(A.node, A.offset)) : (H.setEnd(A.node, A.offset), Y.addRange(H));
                  }
                }
              }
            }
            for (ee = [], Y = j; Y = Y.parentNode; )
              Y.nodeType === 1 && ee.push({
                element: Y,
                left: Y.scrollLeft,
                top: Y.scrollTop
              });
            for (typeof j.focus == "function" && j.focus(), j = 0; j < ee.length; j++) {
              var W = ee[j];
              W.element.scrollLeft = W.left, W.element.scrollTop = W.top;
            }
          }
          Rr = !!xu, vu = xu = null;
        } finally {
          Ue = c, O.p = l, S.T = a;
        }
      }
      e.current = t, yt = 2;
    }
  }
  function Yf() {
    if (yt === 2) {
      yt = 0;
      var e = Na, t = Is, a = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || a) {
        a = S.T, S.T = null;
        var l = O.p;
        O.p = 2;
        var c = Ue;
        Ue |= 4;
        try {
          xf(e, t.alternate, t);
        } finally {
          Ue = c, O.p = l, S.T = a;
        }
      }
      yt = 3;
    }
  }
  function Xf() {
    if (yt === 4 || yt === 3) {
      yt = 0, P();
      var e = Na, t = Is, a = aa, l = Af;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? yt = 5 : (yt = 0, Is = Na = null, Qf(e, e.pendingLanes));
      var c = e.pendingLanes;
      if (c === 0 && (ka = null), No(a), t = t.stateNode, vt && typeof vt.onCommitFiberRoot == "function")
        try {
          vt.onCommitFiberRoot(
            Un,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (l !== null) {
        t = S.T, c = O.p, O.p = 2, S.T = null;
        try {
          for (var u = e.onRecoverableError, b = 0; b < l.length; b++) {
            var j = l[b];
            u(j.value, {
              componentStack: j.stack
            });
          }
        } finally {
          S.T = t, O.p = c;
        }
      }
      (aa & 3) !== 0 && xr(), On(e), c = e.pendingLanes, (a & 261930) !== 0 && (c & 42) !== 0 ? e === iu ? Il++ : (Il = 0, iu = e) : Il = 0, Wl(0);
    }
  }
  function Qf(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Ol(t)));
  }
  function xr() {
    return qf(), Yf(), Xf(), Pf();
  }
  function Pf() {
    if (yt !== 5) return !1;
    var e = Na, t = su;
    su = 0;
    var a = No(aa), l = S.T, c = O.p;
    try {
      O.p = 32 > a ? 32 : a, S.T = null, a = lu, lu = null;
      var u = Na, b = aa;
      if (yt = 0, Is = Na = null, aa = 0, (Ue & 6) !== 0) throw Error(o(331));
      var j = Ue;
      if (Ue |= 4, Ef(u.current), Nf(
        u,
        u.current,
        b,
        a
      ), Ue = j, Wl(0, !1), vt && typeof vt.onPostCommitFiberRoot == "function")
        try {
          vt.onPostCommitFiberRoot(Un, u);
        } catch {
        }
      return !0;
    } finally {
      O.p = c, S.T = l, Qf(e, t);
    }
  }
  function Zf(e, t, a) {
    t = bn(a, t), t = $c(e.stateNode, t, 2), e = xa(e, t, 2), e !== null && (xl(e, 2), On(e));
  }
  function Ve(e, t, a) {
    if (e.tag === 3)
      Zf(e, e, a);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Zf(
            t,
            e,
            a
          );
          break;
        } else if (t.tag === 1) {
          var l = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof l.componentDidCatch == "function" && (ka === null || !ka.has(l))) {
            e = bn(a, e), a = Zm(2), l = xa(t, a, 2), l !== null && (Km(
              a,
              l,
              t,
              e
            ), xl(l, 2), On(l));
            break;
          }
        }
        t = t.return;
      }
  }
  function cu(e, t, a) {
    var l = e.pingCache;
    if (l === null) {
      l = e.pingCache = new Nx();
      var c = /* @__PURE__ */ new Set();
      l.set(t, c);
    } else
      c = l.get(t), c === void 0 && (c = /* @__PURE__ */ new Set(), l.set(t, c));
    c.has(a) || (tu = !0, c.add(a), e = Rx.bind(null, e, t, a), t.then(e, e));
  }
  function Rx(e, t, a) {
    var l = e.pingCache;
    l !== null && l.delete(t), e.pingedLanes |= e.suspendedLanes & a, e.warmLanes &= ~a, Ke === e && (Oe & a) === a && (ct === 4 || ct === 3 && (Oe & 62914560) === Oe && 300 > ve() - mr ? (Ue & 2) === 0 && Ws(e, 0) : nu |= a, Js === Oe && (Js = 0)), On(e);
  }
  function Kf(e, t) {
    t === 0 && (t = Vd()), e = Ia(e, t), e !== null && (xl(e, t), On(e));
  }
  function Ax(e) {
    var t = e.memoizedState, a = 0;
    t !== null && (a = t.retryLane), Kf(e, a);
  }
  function Ox(e, t) {
    var a = 0;
    switch (e.tag) {
      case 31:
      case 13:
        var l = e.stateNode, c = e.memoizedState;
        c !== null && (a = c.retryLane);
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
    l !== null && l.delete(t), Kf(e, a);
  }
  function zx(e, t) {
    return Dt(e, t);
  }
  var vr = null, tl = null, uu = !1, yr = !1, du = !1, Ta = 0;
  function On(e) {
    e !== tl && e.next === null && (tl === null ? vr = tl = e : tl = tl.next = e), yr = !0, uu || (uu = !0, Lx());
  }
  function Wl(e, t) {
    if (!du && yr) {
      du = !0;
      do
        for (var a = !1, l = vr; l !== null; ) {
          if (e !== 0) {
            var c = l.pendingLanes;
            if (c === 0) var u = 0;
            else {
              var b = l.suspendedLanes, j = l.pingedLanes;
              u = (1 << 31 - Lt(42 | e) + 1) - 1, u &= c & ~(b & ~j), u = u & 201326741 ? u & 201326741 | 1 : u ? u | 2 : 0;
            }
            u !== 0 && (a = !0, ep(l, u));
          } else
            u = Oe, u = ki(
              l,
              l === Ke ? u : 0,
              l.cancelPendingCommit !== null || l.timeoutHandle !== -1
            ), (u & 3) === 0 || gl(l, u) || (a = !0, ep(l, u));
          l = l.next;
        }
      while (a);
      du = !1;
    }
  }
  function Dx() {
    Jf();
  }
  function Jf() {
    yr = uu = !1;
    var e = 0;
    Ta !== 0 && Xx() && (e = Ta);
    for (var t = ve(), a = null, l = vr; l !== null; ) {
      var c = l.next, u = If(l, t);
      u === 0 ? (l.next = null, a === null ? vr = c : a.next = c, c === null && (tl = a)) : (a = l, (e !== 0 || (u & 3) !== 0) && (yr = !0)), l = c;
    }
    yt !== 0 && yt !== 5 || Wl(e), Ta !== 0 && (Ta = 0);
  }
  function If(e, t) {
    for (var a = e.suspendedLanes, l = e.pingedLanes, c = e.expirationTimes, u = e.pendingLanes & -62914561; 0 < u; ) {
      var b = 31 - Lt(u), j = 1 << b, R = c[b];
      R === -1 ? ((j & a) === 0 || (j & l) !== 0) && (c[b] = og(j, t)) : R <= t && (e.expiredLanes |= j), u &= ~j;
    }
    if (t = Ke, a = Oe, a = ki(
      e,
      e === t ? a : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), l = e.callbackNode, a === 0 || e === t && (Ge === 2 || Ge === 9) || e.cancelPendingCommit !== null)
      return l !== null && l !== null && kt(l), e.callbackNode = null, e.callbackPriority = 0;
    if ((a & 3) === 0 || gl(e, a)) {
      if (t = a & -a, t === e.callbackPriority) return t;
      switch (l !== null && kt(l), No(a)) {
        case 2:
        case 8:
          a = xt;
          break;
        case 32:
          a = Qt;
          break;
        case 268435456:
          a = bs;
          break;
        default:
          a = Qt;
      }
      return l = Wf.bind(null, e), a = Dt(a, l), e.callbackPriority = t, e.callbackNode = a, t;
    }
    return l !== null && l !== null && kt(l), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function Wf(e, t) {
    if (yt !== 0 && yt !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var a = e.callbackNode;
    if (xr() && e.callbackNode !== a)
      return null;
    var l = Oe;
    return l = ki(
      e,
      e === Ke ? l : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), l === 0 ? null : (zf(e, l, t), If(e, ve()), e.callbackNode != null && e.callbackNode === a ? Wf.bind(null, e) : null);
  }
  function ep(e, t) {
    if (xr()) return null;
    zf(e, t, !0);
  }
  function Lx() {
    Px(function() {
      (Ue & 6) !== 0 ? Dt(
        pe,
        Dx
      ) : Jf();
    });
  }
  function hu() {
    if (Ta === 0) {
      var e = Us;
      e === 0 && (e = We, We <<= 1, (We & 261888) === 0 && (We = 256)), Ta = e;
    }
    return Ta;
  }
  function tp(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Ei("" + e);
  }
  function np(e, t) {
    var a = t.ownerDocument.createElement("input");
    return a.name = t.name, a.value = t.value, e.id && a.setAttribute("form", e.id), t.parentNode.insertBefore(a, t), e = new FormData(e), a.parentNode.removeChild(a), e;
  }
  function Hx(e, t, a, l, c) {
    if (t === "submit" && a && a.stateNode === c) {
      var u = tp(
        (c[Pt] || null).action
      ), b = l.submitter;
      b && (t = (t = b[Pt] || null) ? tp(t.formAction) : b.getAttribute("formAction"), t !== null && (u = t, b = null));
      var j = new Oi(
        "action",
        "action",
        null,
        l,
        c
      );
      e.push({
        event: j,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (l.defaultPrevented) {
                if (Ta !== 0) {
                  var R = b ? np(c, b) : new FormData(c);
                  Ac(
                    a,
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
                typeof u == "function" && (j.preventDefault(), R = b ? np(c, b) : new FormData(c), Ac(
                  a,
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
  for (var mu = 0; mu < Zo.length; mu++) {
    var fu = Zo[mu], $x = fu.toLowerCase(), Bx = fu[0].toUpperCase() + fu.slice(1);
    kn(
      $x,
      "on" + Bx
    );
  }
  kn(Ah, "onAnimationEnd"), kn(Oh, "onAnimationIteration"), kn(zh, "onAnimationStart"), kn("dblclick", "onDoubleClick"), kn("focusin", "onFocus"), kn("focusout", "onBlur"), kn(tx, "onTransitionRun"), kn(nx, "onTransitionStart"), kn(ax, "onTransitionCancel"), kn(Dh, "onTransitionEnd"), Ns("onMouseEnter", ["mouseout", "mouseover"]), Ns("onMouseLeave", ["mouseout", "mouseover"]), Ns("onPointerEnter", ["pointerout", "pointerover"]), Ns("onPointerLeave", ["pointerout", "pointerover"]), Pa(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), Pa(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), Pa("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), Pa(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), Pa(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), Pa(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var ei = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), Ux = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(ei)
  );
  function ap(e, t) {
    t = (t & 4) !== 0;
    for (var a = 0; a < e.length; a++) {
      var l = e[a], c = l.event;
      l = l.listeners;
      e: {
        var u = void 0;
        if (t)
          for (var b = l.length - 1; 0 <= b; b--) {
            var j = l[b], R = j.instance, B = j.currentTarget;
            if (j = j.listener, R !== u && c.isPropagationStopped())
              break e;
            u = j, c.currentTarget = B;
            try {
              u(c);
            } catch (K) {
              Li(K);
            }
            c.currentTarget = null, u = R;
          }
        else
          for (b = 0; b < l.length; b++) {
            if (j = l[b], R = j.instance, B = j.currentTarget, j = j.listener, R !== u && c.isPropagationStopped())
              break e;
            u = j, c.currentTarget = B;
            try {
              u(c);
            } catch (K) {
              Li(K);
            }
            c.currentTarget = null, u = R;
          }
      }
    }
  }
  function Ae(e, t) {
    var a = t[Co];
    a === void 0 && (a = t[Co] = /* @__PURE__ */ new Set());
    var l = e + "__bubble";
    a.has(l) || (sp(t, e, 2, !1), a.add(l));
  }
  function pu(e, t, a) {
    var l = 0;
    t && (l |= 4), sp(
      a,
      e,
      l,
      t
    );
  }
  var jr = "_reactListening" + Math.random().toString(36).slice(2);
  function _u(e) {
    if (!e[jr]) {
      e[jr] = !0, Kd.forEach(function(a) {
        a !== "selectionchange" && (Ux.has(a) || pu(a, !1, e), pu(a, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[jr] || (t[jr] = !0, pu("selectionchange", !1, t));
    }
  }
  function sp(e, t, a, l) {
    switch (Op(t)) {
      case 2:
        var c = fv;
        break;
      case 8:
        c = pv;
        break;
      default:
        c = Ru;
    }
    a = c.bind(
      null,
      t,
      a,
      e
    ), c = void 0, !Lo || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (c = !0), l ? c !== void 0 ? e.addEventListener(t, a, {
      capture: !0,
      passive: c
    }) : e.addEventListener(t, a, !0) : c !== void 0 ? e.addEventListener(t, a, {
      passive: c
    }) : e.addEventListener(t, a, !1);
  }
  function bu(e, t, a, l, c) {
    var u = l;
    if ((t & 1) === 0 && (t & 2) === 0 && l !== null)
      e: for (; ; ) {
        if (l === null) return;
        var b = l.tag;
        if (b === 3 || b === 4) {
          var j = l.stateNode.containerInfo;
          if (j === c) break;
          if (b === 4)
            for (b = l.return; b !== null; ) {
              var R = b.tag;
              if ((R === 3 || R === 4) && b.stateNode.containerInfo === c)
                return;
              b = b.return;
            }
          for (; j !== null; ) {
            if (b = ws(j), b === null) return;
            if (R = b.tag, R === 5 || R === 6 || R === 26 || R === 27) {
              l = u = b;
              continue e;
            }
            j = j.parentNode;
          }
        }
        l = l.return;
      }
    oh(function() {
      var B = u, K = zo(a), ee = [];
      e: {
        var F = Lh.get(e);
        if (F !== void 0) {
          var Y = Oi, fe = e;
          switch (e) {
            case "keypress":
              if (Ri(a) === 0) break e;
            case "keydown":
            case "keyup":
              Y = Og;
              break;
            case "focusin":
              fe = "focus", Y = Uo;
              break;
            case "focusout":
              fe = "blur", Y = Uo;
              break;
            case "beforeblur":
            case "afterblur":
              Y = Uo;
              break;
            case "click":
              if (a.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              Y = dh;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              Y = yg;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              Y = Lg;
              break;
            case Ah:
            case Oh:
            case zh:
              Y = Sg;
              break;
            case Dh:
              Y = $g;
              break;
            case "scroll":
            case "scrollend":
              Y = xg;
              break;
            case "wheel":
              Y = Ug;
              break;
            case "copy":
            case "cut":
            case "paste":
              Y = Ng;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              Y = mh;
              break;
            case "toggle":
            case "beforetoggle":
              Y = Gg;
          }
          var Se = (t & 4) !== 0, Ze = !Se && (e === "scroll" || e === "scrollend"), D = Se ? F !== null ? F + "Capture" : null : F;
          Se = [];
          for (var A = B, H; A !== null; ) {
            var W = A;
            if (H = W.stateNode, W = W.tag, W !== 5 && W !== 26 && W !== 27 || H === null || D === null || (W = jl(A, D), W != null && Se.push(
              ti(A, W, H)
            )), Ze) break;
            A = A.return;
          }
          0 < Se.length && (F = new Y(
            F,
            fe,
            null,
            a,
            K
          ), ee.push({ event: F, listeners: Se }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (F = e === "mouseover" || e === "pointerover", Y = e === "mouseout" || e === "pointerout", F && a !== Oo && (fe = a.relatedTarget || a.fromElement) && (ws(fe) || fe[js]))
            break e;
          if ((Y || F) && (F = K.window === K ? K : (F = K.ownerDocument) ? F.defaultView || F.parentWindow : window, Y ? (fe = a.relatedTarget || a.toElement, Y = B, fe = fe ? ws(fe) : null, fe !== null && (Ze = h(fe), Se = fe.tag, fe !== Ze || Se !== 5 && Se !== 27 && Se !== 6) && (fe = null)) : (Y = null, fe = B), Y !== fe)) {
            if (Se = dh, W = "onMouseLeave", D = "onMouseEnter", A = "mouse", (e === "pointerout" || e === "pointerover") && (Se = mh, W = "onPointerLeave", D = "onPointerEnter", A = "pointer"), Ze = Y == null ? F : yl(Y), H = fe == null ? F : yl(fe), F = new Se(
              W,
              A + "leave",
              Y,
              a,
              K
            ), F.target = Ze, F.relatedTarget = H, W = null, ws(K) === B && (Se = new Se(
              D,
              A + "enter",
              fe,
              a,
              K
            ), Se.target = H, Se.relatedTarget = Ze, W = Se), Ze = W, Y && fe)
              t: {
                for (Se = Fx, D = Y, A = fe, H = 0, W = D; W; W = Se(W))
                  H++;
                W = 0;
                for (var ye = A; ye; ye = Se(ye))
                  W++;
                for (; 0 < H - W; )
                  D = Se(D), H--;
                for (; 0 < W - H; )
                  A = Se(A), W--;
                for (; H--; ) {
                  if (D === A || A !== null && D === A.alternate) {
                    Se = D;
                    break t;
                  }
                  D = Se(D), A = Se(A);
                }
                Se = null;
              }
            else Se = null;
            Y !== null && lp(
              ee,
              F,
              Y,
              Se,
              !1
            ), fe !== null && Ze !== null && lp(
              ee,
              Ze,
              fe,
              Se,
              !0
            );
          }
        }
        e: {
          if (F = B ? yl(B) : window, Y = F.nodeName && F.nodeName.toLowerCase(), Y === "select" || Y === "input" && F.type === "file")
            var $e = yh;
          else if (xh(F))
            if (jh)
              $e = Ig;
            else {
              $e = Kg;
              var be = Zg;
            }
          else
            Y = F.nodeName, !Y || Y.toLowerCase() !== "input" || F.type !== "checkbox" && F.type !== "radio" ? B && Ao(B.elementType) && ($e = yh) : $e = Jg;
          if ($e && ($e = $e(e, B))) {
            vh(
              ee,
              $e,
              a,
              K
            );
            break e;
          }
          be && be(e, F, B), e === "focusout" && B && F.type === "number" && B.memoizedProps.value != null && Ro(F, "number", F.value);
        }
        switch (be = B ? yl(B) : window, e) {
          case "focusin":
            (xh(be) || be.contentEditable === "true") && (As = be, Xo = B, Ml = null);
            break;
          case "focusout":
            Ml = Xo = As = null;
            break;
          case "mousedown":
            Qo = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Qo = !1, Mh(ee, a, K);
            break;
          case "selectionchange":
            if (ex) break;
          case "keydown":
          case "keyup":
            Mh(ee, a, K);
        }
        var Ee;
        if (Go)
          e: {
            switch (e) {
              case "compositionstart":
                var ze = "onCompositionStart";
                break e;
              case "compositionend":
                ze = "onCompositionEnd";
                break e;
              case "compositionupdate":
                ze = "onCompositionUpdate";
                break e;
            }
            ze = void 0;
          }
        else
          Rs ? bh(e, a) && (ze = "onCompositionEnd") : e === "keydown" && a.keyCode === 229 && (ze = "onCompositionStart");
        ze && (fh && a.locale !== "ko" && (Rs || ze !== "onCompositionStart" ? ze === "onCompositionEnd" && Rs && (Ee = ch()) : (ha = K, Ho = "value" in ha ? ha.value : ha.textContent, Rs = !0)), be = wr(B, ze), 0 < be.length && (ze = new hh(
          ze,
          e,
          null,
          a,
          K
        ), ee.push({ event: ze, listeners: be }), Ee ? ze.data = Ee : (Ee = gh(a), Ee !== null && (ze.data = Ee)))), (Ee = qg ? Yg(e, a) : Xg(e, a)) && (ze = wr(B, "onBeforeInput"), 0 < ze.length && (be = new hh(
          "onBeforeInput",
          "beforeinput",
          null,
          a,
          K
        ), ee.push({
          event: be,
          listeners: ze
        }), be.data = Ee)), Hx(
          ee,
          e,
          B,
          a,
          K
        );
      }
      ap(ee, t);
    });
  }
  function ti(e, t, a) {
    return {
      instance: e,
      listener: t,
      currentTarget: a
    };
  }
  function wr(e, t) {
    for (var a = t + "Capture", l = []; e !== null; ) {
      var c = e, u = c.stateNode;
      if (c = c.tag, c !== 5 && c !== 26 && c !== 27 || u === null || (c = jl(e, a), c != null && l.unshift(
        ti(e, c, u)
      ), c = jl(e, t), c != null && l.push(
        ti(e, c, u)
      )), e.tag === 3) return l;
      e = e.return;
    }
    return [];
  }
  function Fx(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function lp(e, t, a, l, c) {
    for (var u = t._reactName, b = []; a !== null && a !== l; ) {
      var j = a, R = j.alternate, B = j.stateNode;
      if (j = j.tag, R !== null && R === l) break;
      j !== 5 && j !== 26 && j !== 27 || B === null || (R = B, c ? (B = jl(a, u), B != null && b.unshift(
        ti(a, B, R)
      )) : c || (B = jl(a, u), B != null && b.push(
        ti(a, B, R)
      ))), a = a.return;
    }
    b.length !== 0 && e.push({ event: t, listeners: b });
  }
  var Gx = /\r\n?/g, Vx = /\u0000|\uFFFD/g;
  function ip(e) {
    return (typeof e == "string" ? e : "" + e).replace(Gx, `
`).replace(Vx, "");
  }
  function rp(e, t) {
    return t = ip(t), ip(e) === t;
  }
  function Pe(e, t, a, l, c, u) {
    switch (a) {
      case "children":
        typeof l == "string" ? t === "body" || t === "textarea" && l === "" || Ts(e, l) : (typeof l == "number" || typeof l == "bigint") && t !== "body" && Ts(e, "" + l);
        break;
      case "className":
        Ci(e, "class", l);
        break;
      case "tabIndex":
        Ci(e, "tabindex", l);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Ci(e, a, l);
        break;
      case "style":
        ih(e, l, u);
        break;
      case "data":
        if (t !== "object") {
          Ci(e, "data", l);
          break;
        }
      case "src":
      case "href":
        if (l === "" && (t !== "a" || a !== "href")) {
          e.removeAttribute(a);
          break;
        }
        if (l == null || typeof l == "function" || typeof l == "symbol" || typeof l == "boolean") {
          e.removeAttribute(a);
          break;
        }
        l = Ei("" + l), e.setAttribute(a, l);
        break;
      case "action":
      case "formAction":
        if (typeof l == "function") {
          e.setAttribute(
            a,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof u == "function" && (a === "formAction" ? (t !== "input" && Pe(e, t, "name", c.name, c, null), Pe(
            e,
            t,
            "formEncType",
            c.formEncType,
            c,
            null
          ), Pe(
            e,
            t,
            "formMethod",
            c.formMethod,
            c,
            null
          ), Pe(
            e,
            t,
            "formTarget",
            c.formTarget,
            c,
            null
          )) : (Pe(e, t, "encType", c.encType, c, null), Pe(e, t, "method", c.method, c, null), Pe(e, t, "target", c.target, c, null)));
        if (l == null || typeof l == "symbol" || typeof l == "boolean") {
          e.removeAttribute(a);
          break;
        }
        l = Ei("" + l), e.setAttribute(a, l);
        break;
      case "onClick":
        l != null && (e.onclick = Gn);
        break;
      case "onScroll":
        l != null && Ae("scroll", e);
        break;
      case "onScrollEnd":
        l != null && Ae("scrollend", e);
        break;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l))
            throw Error(o(61));
          if (a = l.__html, a != null) {
            if (c.children != null) throw Error(o(60));
            e.innerHTML = a;
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
        a = Ei("" + l), e.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          a
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
        l != null && typeof l != "function" && typeof l != "symbol" ? e.setAttribute(a, "" + l) : e.removeAttribute(a);
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
        l && typeof l != "function" && typeof l != "symbol" ? e.setAttribute(a, "") : e.removeAttribute(a);
        break;
      case "capture":
      case "download":
        l === !0 ? e.setAttribute(a, "") : l !== !1 && l != null && typeof l != "function" && typeof l != "symbol" ? e.setAttribute(a, l) : e.removeAttribute(a);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        l != null && typeof l != "function" && typeof l != "symbol" && !isNaN(l) && 1 <= l ? e.setAttribute(a, l) : e.removeAttribute(a);
        break;
      case "rowSpan":
      case "start":
        l == null || typeof l == "function" || typeof l == "symbol" || isNaN(l) ? e.removeAttribute(a) : e.setAttribute(a, l);
        break;
      case "popover":
        Ae("beforetoggle", e), Ae("toggle", e), Ni(e, "popover", l);
        break;
      case "xlinkActuate":
        Fn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          l
        );
        break;
      case "xlinkArcrole":
        Fn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          l
        );
        break;
      case "xlinkRole":
        Fn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          l
        );
        break;
      case "xlinkShow":
        Fn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          l
        );
        break;
      case "xlinkTitle":
        Fn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          l
        );
        break;
      case "xlinkType":
        Fn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          l
        );
        break;
      case "xmlBase":
        Fn(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          l
        );
        break;
      case "xmlLang":
        Fn(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          l
        );
        break;
      case "xmlSpace":
        Fn(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          l
        );
        break;
      case "is":
        Ni(e, "is", l);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < a.length) || a[0] !== "o" && a[0] !== "O" || a[1] !== "n" && a[1] !== "N") && (a = bg.get(a) || a, Ni(e, a, l));
    }
  }
  function gu(e, t, a, l, c, u) {
    switch (a) {
      case "style":
        ih(e, l, u);
        break;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l))
            throw Error(o(61));
          if (a = l.__html, a != null) {
            if (c.children != null) throw Error(o(60));
            e.innerHTML = a;
          }
        }
        break;
      case "children":
        typeof l == "string" ? Ts(e, l) : (typeof l == "number" || typeof l == "bigint") && Ts(e, "" + l);
        break;
      case "onScroll":
        l != null && Ae("scroll", e);
        break;
      case "onScrollEnd":
        l != null && Ae("scrollend", e);
        break;
      case "onClick":
        l != null && (e.onclick = Gn);
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
        if (!Jd.hasOwnProperty(a))
          e: {
            if (a[0] === "o" && a[1] === "n" && (c = a.endsWith("Capture"), t = a.slice(2, c ? a.length - 7 : void 0), u = e[Pt] || null, u = u != null ? u[a] : null, typeof u == "function" && e.removeEventListener(t, u, c), typeof l == "function")) {
              typeof u != "function" && u !== null && (a in e ? e[a] = null : e.hasAttribute(a) && e.removeAttribute(a)), e.addEventListener(t, l, c);
              break e;
            }
            a in e ? e[a] = l : l === !0 ? e.setAttribute(a, "") : Ni(e, a, l);
          }
    }
  }
  function Rt(e, t, a) {
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
        Ae("error", e), Ae("load", e);
        var l = !1, c = !1, u;
        for (u in a)
          if (a.hasOwnProperty(u)) {
            var b = a[u];
            if (b != null)
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
                  Pe(e, t, u, b, a, null);
              }
          }
        c && Pe(e, t, "srcSet", a.srcSet, a, null), l && Pe(e, t, "src", a.src, a, null);
        return;
      case "input":
        Ae("invalid", e);
        var j = u = b = c = null, R = null, B = null;
        for (l in a)
          if (a.hasOwnProperty(l)) {
            var K = a[l];
            if (K != null)
              switch (l) {
                case "name":
                  c = K;
                  break;
                case "type":
                  b = K;
                  break;
                case "checked":
                  R = K;
                  break;
                case "defaultChecked":
                  B = K;
                  break;
                case "value":
                  u = K;
                  break;
                case "defaultValue":
                  j = K;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (K != null)
                    throw Error(o(137, t));
                  break;
                default:
                  Pe(e, t, l, K, a, null);
              }
          }
        nh(
          e,
          u,
          j,
          R,
          B,
          b,
          c,
          !1
        );
        return;
      case "select":
        Ae("invalid", e), l = b = u = null;
        for (c in a)
          if (a.hasOwnProperty(c) && (j = a[c], j != null))
            switch (c) {
              case "value":
                u = j;
                break;
              case "defaultValue":
                b = j;
                break;
              case "multiple":
                l = j;
              default:
                Pe(e, t, c, j, a, null);
            }
        t = u, a = b, e.multiple = !!l, t != null ? Cs(e, !!l, t, !1) : a != null && Cs(e, !!l, a, !0);
        return;
      case "textarea":
        Ae("invalid", e), u = c = l = null;
        for (b in a)
          if (a.hasOwnProperty(b) && (j = a[b], j != null))
            switch (b) {
              case "value":
                l = j;
                break;
              case "defaultValue":
                c = j;
                break;
              case "children":
                u = j;
                break;
              case "dangerouslySetInnerHTML":
                if (j != null) throw Error(o(91));
                break;
              default:
                Pe(e, t, b, j, a, null);
            }
        sh(e, l, c, u);
        return;
      case "option":
        for (R in a)
          if (a.hasOwnProperty(R) && (l = a[R], l != null))
            switch (R) {
              case "selected":
                e.selected = l && typeof l != "function" && typeof l != "symbol";
                break;
              default:
                Pe(e, t, R, l, a, null);
            }
        return;
      case "dialog":
        Ae("beforetoggle", e), Ae("toggle", e), Ae("cancel", e), Ae("close", e);
        break;
      case "iframe":
      case "object":
        Ae("load", e);
        break;
      case "video":
      case "audio":
        for (l = 0; l < ei.length; l++)
          Ae(ei[l], e);
        break;
      case "image":
        Ae("error", e), Ae("load", e);
        break;
      case "details":
        Ae("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        Ae("error", e), Ae("load", e);
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
        for (B in a)
          if (a.hasOwnProperty(B) && (l = a[B], l != null))
            switch (B) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(o(137, t));
              default:
                Pe(e, t, B, l, a, null);
            }
        return;
      default:
        if (Ao(t)) {
          for (K in a)
            a.hasOwnProperty(K) && (l = a[K], l !== void 0 && gu(
              e,
              t,
              K,
              l,
              a,
              void 0
            ));
          return;
        }
    }
    for (j in a)
      a.hasOwnProperty(j) && (l = a[j], l != null && Pe(e, t, j, l, a, null));
  }
  function qx(e, t, a, l) {
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
        var c = null, u = null, b = null, j = null, R = null, B = null, K = null;
        for (Y in a) {
          var ee = a[Y];
          if (a.hasOwnProperty(Y) && ee != null)
            switch (Y) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                R = ee;
              default:
                l.hasOwnProperty(Y) || Pe(e, t, Y, null, l, ee);
            }
        }
        for (var F in l) {
          var Y = l[F];
          if (ee = a[F], l.hasOwnProperty(F) && (Y != null || ee != null))
            switch (F) {
              case "type":
                u = Y;
                break;
              case "name":
                c = Y;
                break;
              case "checked":
                B = Y;
                break;
              case "defaultChecked":
                K = Y;
                break;
              case "value":
                b = Y;
                break;
              case "defaultValue":
                j = Y;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (Y != null)
                  throw Error(o(137, t));
                break;
              default:
                Y !== ee && Pe(
                  e,
                  t,
                  F,
                  Y,
                  l,
                  ee
                );
            }
        }
        Mo(
          e,
          b,
          j,
          R,
          B,
          K,
          u,
          c
        );
        return;
      case "select":
        Y = b = j = F = null;
        for (u in a)
          if (R = a[u], a.hasOwnProperty(u) && R != null)
            switch (u) {
              case "value":
                break;
              case "multiple":
                Y = R;
              default:
                l.hasOwnProperty(u) || Pe(
                  e,
                  t,
                  u,
                  null,
                  l,
                  R
                );
            }
        for (c in l)
          if (u = l[c], R = a[c], l.hasOwnProperty(c) && (u != null || R != null))
            switch (c) {
              case "value":
                F = u;
                break;
              case "defaultValue":
                j = u;
                break;
              case "multiple":
                b = u;
              default:
                u !== R && Pe(
                  e,
                  t,
                  c,
                  u,
                  l,
                  R
                );
            }
        t = j, a = b, l = Y, F != null ? Cs(e, !!a, F, !1) : !!l != !!a && (t != null ? Cs(e, !!a, t, !0) : Cs(e, !!a, a ? [] : "", !1));
        return;
      case "textarea":
        Y = F = null;
        for (j in a)
          if (c = a[j], a.hasOwnProperty(j) && c != null && !l.hasOwnProperty(j))
            switch (j) {
              case "value":
                break;
              case "children":
                break;
              default:
                Pe(e, t, j, null, l, c);
            }
        for (b in l)
          if (c = l[b], u = a[b], l.hasOwnProperty(b) && (c != null || u != null))
            switch (b) {
              case "value":
                F = c;
                break;
              case "defaultValue":
                Y = c;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (c != null) throw Error(o(91));
                break;
              default:
                c !== u && Pe(e, t, b, c, l, u);
            }
        ah(e, F, Y);
        return;
      case "option":
        for (var fe in a)
          if (F = a[fe], a.hasOwnProperty(fe) && F != null && !l.hasOwnProperty(fe))
            switch (fe) {
              case "selected":
                e.selected = !1;
                break;
              default:
                Pe(
                  e,
                  t,
                  fe,
                  null,
                  l,
                  F
                );
            }
        for (R in l)
          if (F = l[R], Y = a[R], l.hasOwnProperty(R) && F !== Y && (F != null || Y != null))
            switch (R) {
              case "selected":
                e.selected = F && typeof F != "function" && typeof F != "symbol";
                break;
              default:
                Pe(
                  e,
                  t,
                  R,
                  F,
                  l,
                  Y
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
        for (var Se in a)
          F = a[Se], a.hasOwnProperty(Se) && F != null && !l.hasOwnProperty(Se) && Pe(e, t, Se, null, l, F);
        for (B in l)
          if (F = l[B], Y = a[B], l.hasOwnProperty(B) && F !== Y && (F != null || Y != null))
            switch (B) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (F != null)
                  throw Error(o(137, t));
                break;
              default:
                Pe(
                  e,
                  t,
                  B,
                  F,
                  l,
                  Y
                );
            }
        return;
      default:
        if (Ao(t)) {
          for (var Ze in a)
            F = a[Ze], a.hasOwnProperty(Ze) && F !== void 0 && !l.hasOwnProperty(Ze) && gu(
              e,
              t,
              Ze,
              void 0,
              l,
              F
            );
          for (K in l)
            F = l[K], Y = a[K], !l.hasOwnProperty(K) || F === Y || F === void 0 && Y === void 0 || gu(
              e,
              t,
              K,
              F,
              l,
              Y
            );
          return;
        }
    }
    for (var D in a)
      F = a[D], a.hasOwnProperty(D) && F != null && !l.hasOwnProperty(D) && Pe(e, t, D, null, l, F);
    for (ee in l)
      F = l[ee], Y = a[ee], !l.hasOwnProperty(ee) || F === Y || F == null && Y == null || Pe(e, t, ee, F, l, Y);
  }
  function op(e) {
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
  function Yx() {
    if (typeof performance.getEntriesByType == "function") {
      for (var e = 0, t = 0, a = performance.getEntriesByType("resource"), l = 0; l < a.length; l++) {
        var c = a[l], u = c.transferSize, b = c.initiatorType, j = c.duration;
        if (u && j && op(b)) {
          for (b = 0, j = c.responseEnd, l += 1; l < a.length; l++) {
            var R = a[l], B = R.startTime;
            if (B > j) break;
            var K = R.transferSize, ee = R.initiatorType;
            K && op(ee) && (R = R.responseEnd, b += K * (R < j ? 1 : (j - B) / (R - B)));
          }
          if (--l, t += 8 * (u + b) / (c.duration / 1e3), e++, 10 < e) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
  }
  var xu = null, vu = null;
  function Sr(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function cp(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function up(e, t) {
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
  function yu(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var ju = null;
  function Xx() {
    var e = window.event;
    return e && e.type === "popstate" ? e === ju ? !1 : (ju = e, !0) : (ju = null, !1);
  }
  var dp = typeof setTimeout == "function" ? setTimeout : void 0, Qx = typeof clearTimeout == "function" ? clearTimeout : void 0, hp = typeof Promise == "function" ? Promise : void 0, Px = typeof queueMicrotask == "function" ? queueMicrotask : typeof hp < "u" ? function(e) {
    return hp.resolve(null).then(e).catch(Zx);
  } : dp;
  function Zx(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Ea(e) {
    return e === "head";
  }
  function mp(e, t) {
    var a = t, l = 0;
    do {
      var c = a.nextSibling;
      if (e.removeChild(a), c && c.nodeType === 8)
        if (a = c.data, a === "/$" || a === "/&") {
          if (l === 0) {
            e.removeChild(c), ll(t);
            return;
          }
          l--;
        } else if (a === "$" || a === "$?" || a === "$~" || a === "$!" || a === "&")
          l++;
        else if (a === "html")
          ni(e.ownerDocument.documentElement);
        else if (a === "head") {
          a = e.ownerDocument.head, ni(a);
          for (var u = a.firstChild; u; ) {
            var b = u.nextSibling, j = u.nodeName;
            u[vl] || j === "SCRIPT" || j === "STYLE" || j === "LINK" && u.rel.toLowerCase() === "stylesheet" || a.removeChild(u), u = b;
          }
        } else
          a === "body" && ni(e.ownerDocument.body);
      a = c;
    } while (a);
    ll(t);
  }
  function fp(e, t) {
    var a = e;
    e = 0;
    do {
      var l = a.nextSibling;
      if (a.nodeType === 1 ? t ? (a._stashedDisplay = a.style.display, a.style.display = "none") : (a.style.display = a._stashedDisplay || "", a.getAttribute("style") === "" && a.removeAttribute("style")) : a.nodeType === 3 && (t ? (a._stashedText = a.nodeValue, a.nodeValue = "") : a.nodeValue = a._stashedText || ""), l && l.nodeType === 8)
        if (a = l.data, a === "/$") {
          if (e === 0) break;
          e--;
        } else
          a !== "$" && a !== "$?" && a !== "$~" && a !== "$!" || e++;
      a = l;
    } while (a);
  }
  function wu(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var a = t;
      switch (t = t.nextSibling, a.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          wu(a), To(a);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (a.rel.toLowerCase() === "stylesheet") continue;
      }
      e.removeChild(a);
    }
  }
  function Kx(e, t, a, l) {
    for (; e.nodeType === 1; ) {
      var c = a;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!l && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (l) {
        if (!e[vl])
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
      if (e = jn(e.nextSibling), e === null) break;
    }
    return null;
  }
  function Jx(e, t, a) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !a || (e = jn(e.nextSibling), e === null)) return null;
    return e;
  }
  function pp(e, t) {
    for (; e.nodeType !== 8; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = jn(e.nextSibling), e === null)) return null;
    return e;
  }
  function Su(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function ku(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
  }
  function Ix(e, t) {
    var a = e.ownerDocument;
    if (e.data === "$~") e._reactRetry = t;
    else if (e.data !== "$?" || a.readyState !== "loading")
      t();
    else {
      var l = function() {
        t(), a.removeEventListener("DOMContentLoaded", l);
      };
      a.addEventListener("DOMContentLoaded", l), e._reactRetry = l;
    }
  }
  function jn(e) {
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
  var Nu = null;
  function _p(e) {
    e = e.nextSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var a = e.data;
        if (a === "/$" || a === "/&") {
          if (t === 0)
            return jn(e.nextSibling);
          t--;
        } else
          a !== "$" && a !== "$!" && a !== "$?" && a !== "$~" && a !== "&" || t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function bp(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var a = e.data;
        if (a === "$" || a === "$!" || a === "$?" || a === "$~" || a === "&") {
          if (t === 0) return e;
          t--;
        } else a !== "/$" && a !== "/&" || t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  function gp(e, t, a) {
    switch (t = Sr(a), e) {
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
  function ni(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    To(e);
  }
  var wn = /* @__PURE__ */ new Map(), xp = /* @__PURE__ */ new Set();
  function kr(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var sa = O.d;
  O.d = {
    f: Wx,
    r: ev,
    D: tv,
    C: nv,
    L: av,
    m: sv,
    X: iv,
    S: lv,
    M: rv
  };
  function Wx() {
    var e = sa.f(), t = _r();
    return e || t;
  }
  function ev(e) {
    var t = Ss(e);
    t !== null && t.tag === 5 && t.type === "form" ? Dm(t) : sa.r(e);
  }
  var nl = typeof document > "u" ? null : document;
  function vp(e, t, a) {
    var l = nl;
    if (l && typeof t == "string" && t) {
      var c = pn(t);
      c = 'link[rel="' + e + '"][href="' + c + '"]', typeof a == "string" && (c += '[crossorigin="' + a + '"]'), xp.has(c) || (xp.add(c), e = { rel: e, crossOrigin: a, href: t }, l.querySelector(c) === null && (t = l.createElement("link"), Rt(t, "link", e), jt(t), l.head.appendChild(t)));
    }
  }
  function tv(e) {
    sa.D(e), vp("dns-prefetch", e, null);
  }
  function nv(e, t) {
    sa.C(e, t), vp("preconnect", e, t);
  }
  function av(e, t, a) {
    sa.L(e, t, a);
    var l = nl;
    if (l && e && t) {
      var c = 'link[rel="preload"][as="' + pn(t) + '"]';
      t === "image" && a && a.imageSrcSet ? (c += '[imagesrcset="' + pn(
        a.imageSrcSet
      ) + '"]', typeof a.imageSizes == "string" && (c += '[imagesizes="' + pn(
        a.imageSizes
      ) + '"]')) : c += '[href="' + pn(e) + '"]';
      var u = c;
      switch (t) {
        case "style":
          u = al(e);
          break;
        case "script":
          u = sl(e);
      }
      wn.has(u) || (e = g(
        {
          rel: "preload",
          href: t === "image" && a && a.imageSrcSet ? void 0 : e,
          as: t
        },
        a
      ), wn.set(u, e), l.querySelector(c) !== null || t === "style" && l.querySelector(ai(u)) || t === "script" && l.querySelector(si(u)) || (t = l.createElement("link"), Rt(t, "link", e), jt(t), l.head.appendChild(t)));
    }
  }
  function sv(e, t) {
    sa.m(e, t);
    var a = nl;
    if (a && e) {
      var l = t && typeof t.as == "string" ? t.as : "script", c = 'link[rel="modulepreload"][as="' + pn(l) + '"][href="' + pn(e) + '"]', u = c;
      switch (l) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          u = sl(e);
      }
      if (!wn.has(u) && (e = g({ rel: "modulepreload", href: e }, t), wn.set(u, e), a.querySelector(c) === null)) {
        switch (l) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (a.querySelector(si(u)))
              return;
        }
        l = a.createElement("link"), Rt(l, "link", e), jt(l), a.head.appendChild(l);
      }
    }
  }
  function lv(e, t, a) {
    sa.S(e, t, a);
    var l = nl;
    if (l && e) {
      var c = ks(l).hoistableStyles, u = al(e);
      t = t || "default";
      var b = c.get(u);
      if (!b) {
        var j = { loading: 0, preload: null };
        if (b = l.querySelector(
          ai(u)
        ))
          j.loading = 5;
        else {
          e = g(
            { rel: "stylesheet", href: e, "data-precedence": t },
            a
          ), (a = wn.get(u)) && Cu(e, a);
          var R = b = l.createElement("link");
          jt(R), Rt(R, "link", e), R._p = new Promise(function(B, K) {
            R.onload = B, R.onerror = K;
          }), R.addEventListener("load", function() {
            j.loading |= 1;
          }), R.addEventListener("error", function() {
            j.loading |= 2;
          }), j.loading |= 4, Nr(b, t, l);
        }
        b = {
          type: "stylesheet",
          instance: b,
          count: 1,
          state: j
        }, c.set(u, b);
      }
    }
  }
  function iv(e, t) {
    sa.X(e, t);
    var a = nl;
    if (a && e) {
      var l = ks(a).hoistableScripts, c = sl(e), u = l.get(c);
      u || (u = a.querySelector(si(c)), u || (e = g({ src: e, async: !0 }, t), (t = wn.get(c)) && Tu(e, t), u = a.createElement("script"), jt(u), Rt(u, "link", e), a.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, l.set(c, u));
    }
  }
  function rv(e, t) {
    sa.M(e, t);
    var a = nl;
    if (a && e) {
      var l = ks(a).hoistableScripts, c = sl(e), u = l.get(c);
      u || (u = a.querySelector(si(c)), u || (e = g({ src: e, async: !0, type: "module" }, t), (t = wn.get(c)) && Tu(e, t), u = a.createElement("script"), jt(u), Rt(u, "link", e), a.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, l.set(c, u));
    }
  }
  function yp(e, t, a, l) {
    var c = (c = Q.current) ? kr(c) : null;
    if (!c) throw Error(o(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof a.precedence == "string" && typeof a.href == "string" ? (t = al(a.href), a = ks(
          c
        ).hoistableStyles, l = a.get(t), l || (l = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, a.set(t, l)), l) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (a.rel === "stylesheet" && typeof a.href == "string" && typeof a.precedence == "string") {
          e = al(a.href);
          var u = ks(
            c
          ).hoistableStyles, b = u.get(e);
          if (b || (c = c.ownerDocument || c, b = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, u.set(e, b), (u = c.querySelector(
            ai(e)
          )) && !u._p && (b.instance = u, b.state.loading = 5), wn.has(e) || (a = {
            rel: "preload",
            as: "style",
            href: a.href,
            crossOrigin: a.crossOrigin,
            integrity: a.integrity,
            media: a.media,
            hrefLang: a.hrefLang,
            referrerPolicy: a.referrerPolicy
          }, wn.set(e, a), u || ov(
            c,
            e,
            a,
            b.state
          ))), t && l === null)
            throw Error(o(528, ""));
          return b;
        }
        if (t && l !== null)
          throw Error(o(529, ""));
        return null;
      case "script":
        return t = a.async, a = a.src, typeof a == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = sl(a), a = ks(
          c
        ).hoistableScripts, l = a.get(t), l || (l = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, a.set(t, l)), l) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(o(444, e));
    }
  }
  function al(e) {
    return 'href="' + pn(e) + '"';
  }
  function ai(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function jp(e) {
    return g({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function ov(e, t, a, l) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? l.loading = 1 : (t = e.createElement("link"), l.preload = t, t.addEventListener("load", function() {
      return l.loading |= 1;
    }), t.addEventListener("error", function() {
      return l.loading |= 2;
    }), Rt(t, "link", a), jt(t), e.head.appendChild(t));
  }
  function sl(e) {
    return '[src="' + pn(e) + '"]';
  }
  function si(e) {
    return "script[async]" + e;
  }
  function wp(e, t, a) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var l = e.querySelector(
            'style[data-href~="' + pn(a.href) + '"]'
          );
          if (l)
            return t.instance = l, jt(l), l;
          var c = g({}, a, {
            "data-href": a.href,
            "data-precedence": a.precedence,
            href: null,
            precedence: null
          });
          return l = (e.ownerDocument || e).createElement(
            "style"
          ), jt(l), Rt(l, "style", c), Nr(l, a.precedence, e), t.instance = l;
        case "stylesheet":
          c = al(a.href);
          var u = e.querySelector(
            ai(c)
          );
          if (u)
            return t.state.loading |= 4, t.instance = u, jt(u), u;
          l = jp(a), (c = wn.get(c)) && Cu(l, c), u = (e.ownerDocument || e).createElement("link"), jt(u);
          var b = u;
          return b._p = new Promise(function(j, R) {
            b.onload = j, b.onerror = R;
          }), Rt(u, "link", l), t.state.loading |= 4, Nr(u, a.precedence, e), t.instance = u;
        case "script":
          return u = sl(a.src), (c = e.querySelector(
            si(u)
          )) ? (t.instance = c, jt(c), c) : (l = a, (c = wn.get(u)) && (l = g({}, a), Tu(l, c)), e = e.ownerDocument || e, c = e.createElement("script"), jt(c), Rt(c, "link", l), e.head.appendChild(c), t.instance = c);
        case "void":
          return null;
        default:
          throw Error(o(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (l = t.instance, t.state.loading |= 4, Nr(l, a.precedence, e));
    return t.instance;
  }
  function Nr(e, t, a) {
    for (var l = a.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), c = l.length ? l[l.length - 1] : null, u = c, b = 0; b < l.length; b++) {
      var j = l[b];
      if (j.dataset.precedence === t) u = j;
      else if (u !== c) break;
    }
    u ? u.parentNode.insertBefore(e, u.nextSibling) : (t = a.nodeType === 9 ? a.head : a, t.insertBefore(e, t.firstChild));
  }
  function Cu(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function Tu(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var Cr = null;
  function Sp(e, t, a) {
    if (Cr === null) {
      var l = /* @__PURE__ */ new Map(), c = Cr = /* @__PURE__ */ new Map();
      c.set(a, l);
    } else
      c = Cr, l = c.get(a), l || (l = /* @__PURE__ */ new Map(), c.set(a, l));
    if (l.has(e)) return l;
    for (l.set(e, null), a = a.getElementsByTagName(e), c = 0; c < a.length; c++) {
      var u = a[c];
      if (!(u[vl] || u[Ct] || e === "link" && u.getAttribute("rel") === "stylesheet") && u.namespaceURI !== "http://www.w3.org/2000/svg") {
        var b = u.getAttribute(t) || "";
        b = e + b;
        var j = l.get(b);
        j ? j.push(u) : l.set(b, [u]);
      }
    }
    return l;
  }
  function kp(e, t, a) {
    e = e.ownerDocument || e, e.head.insertBefore(
      a,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function cv(e, t, a) {
    if (a === 1 || t.itemProp != null) return !1;
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
  function Np(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function uv(e, t, a, l) {
    if (a.type === "stylesheet" && (typeof l.media != "string" || matchMedia(l.media).matches !== !1) && (a.state.loading & 4) === 0) {
      if (a.instance === null) {
        var c = al(l.href), u = t.querySelector(
          ai(c)
        );
        if (u) {
          t = u._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = Tr.bind(e), t.then(e, e)), a.state.loading |= 4, a.instance = u, jt(u);
          return;
        }
        u = t.ownerDocument || t, l = jp(l), (c = wn.get(c)) && Cu(l, c), u = u.createElement("link"), jt(u);
        var b = u;
        b._p = new Promise(function(j, R) {
          b.onload = j, b.onerror = R;
        }), Rt(u, "link", l), a.instance = u;
      }
      e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(a, t), (t = a.state.preload) && (a.state.loading & 3) === 0 && (e.count++, a = Tr.bind(e), t.addEventListener("load", a), t.addEventListener("error", a));
    }
  }
  var Eu = 0;
  function dv(e, t) {
    return e.stylesheets && e.count === 0 && Mr(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(a) {
      var l = setTimeout(function() {
        if (e.stylesheets && Mr(e, e.stylesheets), e.unsuspend) {
          var u = e.unsuspend;
          e.unsuspend = null, u();
        }
      }, 6e4 + t);
      0 < e.imgBytes && Eu === 0 && (Eu = 62500 * Yx());
      var c = setTimeout(
        function() {
          if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && Mr(e, e.stylesheets), e.unsuspend)) {
            var u = e.unsuspend;
            e.unsuspend = null, u();
          }
        },
        (e.imgBytes > Eu ? 50 : 800) + t
      );
      return e.unsuspend = a, function() {
        e.unsuspend = null, clearTimeout(l), clearTimeout(c);
      };
    } : null;
  }
  function Tr() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) Mr(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var Er = null;
  function Mr(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, Er = /* @__PURE__ */ new Map(), t.forEach(hv, e), Er = null, Tr.call(e));
  }
  function hv(e, t) {
    if (!(t.state.loading & 4)) {
      var a = Er.get(e);
      if (a) var l = a.get(null);
      else {
        a = /* @__PURE__ */ new Map(), Er.set(e, a);
        for (var c = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), u = 0; u < c.length; u++) {
          var b = c[u];
          (b.nodeName === "LINK" || b.getAttribute("media") !== "not all") && (a.set(b.dataset.precedence, b), l = b);
        }
        l && a.set(null, l);
      }
      c = t.instance, b = c.getAttribute("data-precedence"), u = a.get(b) || l, u === l && a.set(null, c), a.set(b, c), this.count++, l = Tr.bind(this), c.addEventListener("load", l), c.addEventListener("error", l), u ? u.parentNode.insertBefore(c, u.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(c, e.firstChild)), t.state.loading |= 4;
    }
  }
  var li = {
    $$typeof: U,
    Provider: null,
    Consumer: null,
    _currentValue: q,
    _currentValue2: q,
    _threadCount: 0
  };
  function mv(e, t, a, l, c, u, b, j, R) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = So(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = So(0), this.hiddenUpdates = So(null), this.identifierPrefix = l, this.onUncaughtError = c, this.onCaughtError = u, this.onRecoverableError = b, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = R, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function Cp(e, t, a, l, c, u, b, j, R, B, K, ee) {
    return e = new mv(
      e,
      t,
      a,
      b,
      R,
      B,
      K,
      ee,
      j
    ), t = 1, u === !0 && (t |= 24), u = sn(3, null, null, t), e.current = u, u.stateNode = e, t = oc(), t.refCount++, e.pooledCache = t, t.refCount++, u.memoizedState = {
      element: l,
      isDehydrated: a,
      cache: t
    }, hc(u), e;
  }
  function Tp(e) {
    return e ? (e = Ds, e) : Ds;
  }
  function Ep(e, t, a, l, c, u) {
    c = Tp(c), l.context === null ? l.context = c : l.pendingContext = c, l = ga(t), l.payload = { element: a }, u = u === void 0 ? null : u, u !== null && (l.callback = u), a = xa(e, l, t), a !== null && (en(a, e, t), Hl(a, e, t));
  }
  function Mp(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var a = e.retryLane;
      e.retryLane = a !== 0 && a < t ? a : t;
    }
  }
  function Mu(e, t) {
    Mp(e, t), (e = e.alternate) && Mp(e, t);
  }
  function Rp(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Ia(e, 67108864);
      t !== null && en(t, e, 67108864), Mu(e, 67108864);
    }
  }
  function Ap(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = un();
      t = ko(t);
      var a = Ia(e, t);
      a !== null && en(a, e, t), Mu(e, t);
    }
  }
  var Rr = !0;
  function fv(e, t, a, l) {
    var c = S.T;
    S.T = null;
    var u = O.p;
    try {
      O.p = 2, Ru(e, t, a, l);
    } finally {
      O.p = u, S.T = c;
    }
  }
  function pv(e, t, a, l) {
    var c = S.T;
    S.T = null;
    var u = O.p;
    try {
      O.p = 8, Ru(e, t, a, l);
    } finally {
      O.p = u, S.T = c;
    }
  }
  function Ru(e, t, a, l) {
    if (Rr) {
      var c = Au(l);
      if (c === null)
        bu(
          e,
          t,
          l,
          Ar,
          a
        ), zp(e, l);
      else if (bv(
        c,
        e,
        t,
        a,
        l
      ))
        l.stopPropagation();
      else if (zp(e, l), t & 4 && -1 < _v.indexOf(e)) {
        for (; c !== null; ) {
          var u = Ss(c);
          if (u !== null)
            switch (u.tag) {
              case 3:
                if (u = u.stateNode, u.current.memoizedState.isDehydrated) {
                  var b = Qa(u.pendingLanes);
                  if (b !== 0) {
                    var j = u;
                    for (j.pendingLanes |= 2, j.entangledLanes |= 2; b; ) {
                      var R = 1 << 31 - Lt(b);
                      j.entanglements[1] |= R, b &= ~R;
                    }
                    On(u), (Ue & 6) === 0 && (fr = ve() + 500, Wl(0));
                  }
                }
                break;
              case 31:
              case 13:
                j = Ia(u, 2), j !== null && en(j, u, 2), _r(), Mu(u, 2);
            }
          if (u = Au(l), u === null && bu(
            e,
            t,
            l,
            Ar,
            a
          ), u === c) break;
          c = u;
        }
        c !== null && l.stopPropagation();
      } else
        bu(
          e,
          t,
          l,
          null,
          a
        );
    }
  }
  function Au(e) {
    return e = zo(e), Ou(e);
  }
  var Ar = null;
  function Ou(e) {
    if (Ar = null, e = ws(e), e !== null) {
      var t = h(e);
      if (t === null) e = null;
      else {
        var a = t.tag;
        if (a === 13) {
          if (e = m(t), e !== null) return e;
          e = null;
        } else if (a === 31) {
          if (e = p(t), e !== null) return e;
          e = null;
        } else if (a === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return Ar = e, null;
  }
  function Op(e) {
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
        switch (tt()) {
          case pe:
            return 2;
          case xt:
            return 8;
          case Qt:
          case _l:
            return 32;
          case bs:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var zu = !1, Ma = null, Ra = null, Aa = null, ii = /* @__PURE__ */ new Map(), ri = /* @__PURE__ */ new Map(), Oa = [], _v = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function zp(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Ma = null;
        break;
      case "dragenter":
      case "dragleave":
        Ra = null;
        break;
      case "mouseover":
      case "mouseout":
        Aa = null;
        break;
      case "pointerover":
      case "pointerout":
        ii.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        ri.delete(t.pointerId);
    }
  }
  function oi(e, t, a, l, c, u) {
    return e === null || e.nativeEvent !== u ? (e = {
      blockedOn: t,
      domEventName: a,
      eventSystemFlags: l,
      nativeEvent: u,
      targetContainers: [c]
    }, t !== null && (t = Ss(t), t !== null && Rp(t)), e) : (e.eventSystemFlags |= l, t = e.targetContainers, c !== null && t.indexOf(c) === -1 && t.push(c), e);
  }
  function bv(e, t, a, l, c) {
    switch (t) {
      case "focusin":
        return Ma = oi(
          Ma,
          e,
          t,
          a,
          l,
          c
        ), !0;
      case "dragenter":
        return Ra = oi(
          Ra,
          e,
          t,
          a,
          l,
          c
        ), !0;
      case "mouseover":
        return Aa = oi(
          Aa,
          e,
          t,
          a,
          l,
          c
        ), !0;
      case "pointerover":
        var u = c.pointerId;
        return ii.set(
          u,
          oi(
            ii.get(u) || null,
            e,
            t,
            a,
            l,
            c
          )
        ), !0;
      case "gotpointercapture":
        return u = c.pointerId, ri.set(
          u,
          oi(
            ri.get(u) || null,
            e,
            t,
            a,
            l,
            c
          )
        ), !0;
    }
    return !1;
  }
  function Dp(e) {
    var t = ws(e.target);
    if (t !== null) {
      var a = h(t);
      if (a !== null) {
        if (t = a.tag, t === 13) {
          if (t = m(a), t !== null) {
            e.blockedOn = t, Pd(e.priority, function() {
              Ap(a);
            });
            return;
          }
        } else if (t === 31) {
          if (t = p(a), t !== null) {
            e.blockedOn = t, Pd(e.priority, function() {
              Ap(a);
            });
            return;
          }
        } else if (t === 3 && a.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = a.tag === 3 ? a.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function Or(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var a = Au(e.nativeEvent);
      if (a === null) {
        a = e.nativeEvent;
        var l = new a.constructor(
          a.type,
          a
        );
        Oo = l, a.target.dispatchEvent(l), Oo = null;
      } else
        return t = Ss(a), t !== null && Rp(t), e.blockedOn = a, !1;
      t.shift();
    }
    return !0;
  }
  function Lp(e, t, a) {
    Or(e) && a.delete(t);
  }
  function gv() {
    zu = !1, Ma !== null && Or(Ma) && (Ma = null), Ra !== null && Or(Ra) && (Ra = null), Aa !== null && Or(Aa) && (Aa = null), ii.forEach(Lp), ri.forEach(Lp);
  }
  function zr(e, t) {
    e.blockedOn === t && (e.blockedOn = null, zu || (zu = !0, n.unstable_scheduleCallback(
      n.unstable_NormalPriority,
      gv
    )));
  }
  var Dr = null;
  function Hp(e) {
    Dr !== e && (Dr = e, n.unstable_scheduleCallback(
      n.unstable_NormalPriority,
      function() {
        Dr === e && (Dr = null);
        for (var t = 0; t < e.length; t += 3) {
          var a = e[t], l = e[t + 1], c = e[t + 2];
          if (typeof l != "function") {
            if (Ou(l || a) === null)
              continue;
            break;
          }
          var u = Ss(a);
          u !== null && (e.splice(t, 3), t -= 3, Ac(
            u,
            {
              pending: !0,
              data: c,
              method: a.method,
              action: l
            },
            l,
            c
          ));
        }
      }
    ));
  }
  function ll(e) {
    function t(R) {
      return zr(R, e);
    }
    Ma !== null && zr(Ma, e), Ra !== null && zr(Ra, e), Aa !== null && zr(Aa, e), ii.forEach(t), ri.forEach(t);
    for (var a = 0; a < Oa.length; a++) {
      var l = Oa[a];
      l.blockedOn === e && (l.blockedOn = null);
    }
    for (; 0 < Oa.length && (a = Oa[0], a.blockedOn === null); )
      Dp(a), a.blockedOn === null && Oa.shift();
    if (a = (e.ownerDocument || e).$$reactFormReplay, a != null)
      for (l = 0; l < a.length; l += 3) {
        var c = a[l], u = a[l + 1], b = c[Pt] || null;
        if (typeof u == "function")
          b || Hp(a);
        else if (b) {
          var j = null;
          if (u && u.hasAttribute("formAction")) {
            if (c = u, b = u[Pt] || null)
              j = b.formAction;
            else if (Ou(c) !== null) continue;
          } else j = b.action;
          typeof j == "function" ? a[l + 1] = j : (a.splice(l, 3), l -= 3), Hp(a);
        }
      }
  }
  function $p() {
    function e(u) {
      u.canIntercept && u.info === "react-transition" && u.intercept({
        handler: function() {
          return new Promise(function(b) {
            return c = b;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function t() {
      c !== null && (c(), c = null), l || setTimeout(a, 20);
    }
    function a() {
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
      return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(a, 100), function() {
        l = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), c !== null && (c(), c = null);
      };
    }
  }
  function Du(e) {
    this._internalRoot = e;
  }
  Lr.prototype.render = Du.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(o(409));
    var a = t.current, l = un();
    Ep(a, l, e, t, null, null);
  }, Lr.prototype.unmount = Du.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      Ep(e.current, 2, null, e, null, null), _r(), t[js] = null;
    }
  };
  function Lr(e) {
    this._internalRoot = e;
  }
  Lr.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Qd();
      e = { blockedOn: null, target: e, priority: t };
      for (var a = 0; a < Oa.length && t !== 0 && t < Oa[a].priority; a++) ;
      Oa.splice(a, 0, e), a === 0 && Dp(e);
    }
  };
  var Bp = i.version;
  if (Bp !== "19.2.8")
    throw Error(
      o(
        527,
        Bp,
        "19.2.8"
      )
    );
  O.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(o(188)) : (e = Object.keys(e).join(","), Error(o(268, e)));
    return e = _(t), e = e !== null ? x(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var xv = {
    bundleType: 0,
    version: "19.2.8",
    rendererPackageName: "react-dom",
    currentDispatcherRef: S,
    reconcilerVersion: "19.2.8"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Hr = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Hr.isDisabled && Hr.supportsFiber)
      try {
        Un = Hr.inject(
          xv
        ), vt = Hr;
      } catch {
      }
  }
  return di.createRoot = function(e, t) {
    if (!d(e)) throw Error(o(299));
    var a = !1, l = "", c = Ym, u = Xm, b = Qm;
    return t != null && (t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (l = t.identifierPrefix), t.onUncaughtError !== void 0 && (c = t.onUncaughtError), t.onCaughtError !== void 0 && (u = t.onCaughtError), t.onRecoverableError !== void 0 && (b = t.onRecoverableError)), t = Cp(
      e,
      1,
      !1,
      null,
      null,
      a,
      l,
      null,
      c,
      u,
      b,
      $p
    ), e[js] = t.current, _u(e), new Du(t);
  }, di.hydrateRoot = function(e, t, a) {
    if (!d(e)) throw Error(o(299));
    var l = !1, c = "", u = Ym, b = Xm, j = Qm, R = null;
    return a != null && (a.unstable_strictMode === !0 && (l = !0), a.identifierPrefix !== void 0 && (c = a.identifierPrefix), a.onUncaughtError !== void 0 && (u = a.onUncaughtError), a.onCaughtError !== void 0 && (b = a.onCaughtError), a.onRecoverableError !== void 0 && (j = a.onRecoverableError), a.formState !== void 0 && (R = a.formState)), t = Cp(
      e,
      1,
      !0,
      t,
      a ?? null,
      l,
      c,
      R,
      u,
      b,
      j,
      $p
    ), t.context = Tp(null), a = t.current, l = un(), l = ko(l), c = ga(l), c.callback = null, xa(a, c, l), a = l, t.current.lanes = a, xl(t, a), On(t), e[js] = t.current, _u(e), new Lr(t);
  }, di.version = "19.2.8", di;
}
var Zp;
function Mv() {
  if (Zp) return $u.exports;
  Zp = 1;
  function n() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
      } catch (i) {
        console.error(i);
      }
  }
  return n(), $u.exports = Ev(), $u.exports;
}
var Rv = Mv();
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
var md = /^(?:[a-z][a-z0-9+.-]*:|[\\/]{2})/i, H_ = /^[\\/]{2}/;
function Av(n, i) {
  return i + n.replace(/\\/g, "/");
}
var Kp = "popstate";
function Jp(n) {
  return typeof n == "object" && n != null && "pathname" in n && "search" in n && "hash" in n && "state" in n && "key" in n;
}
function Ov(n = {}) {
  function i(d, h) {
    let {
      pathname: m = "/",
      search: p = "",
      hash: f = ""
    } = ps(d.location.hash.substring(1));
    return !m.startsWith("/") && !m.startsWith(".") && (m = "/" + m), td(
      "",
      { pathname: m, search: p, hash: f },
      // state defaults to `null` because `window.history.state` does
      h.state && h.state.usr || null,
      h.state && h.state.key || "default"
    );
  }
  function r(d, h) {
    let m = d.document.querySelector("base"), p = "";
    if (m && m.getAttribute("href")) {
      let f = d.location.href, _ = f.indexOf("#");
      p = _ === -1 ? f : f.slice(0, _);
    }
    return p + "#" + (typeof h == "string" ? h : _i(h));
  }
  function o(d, h) {
    dn(
      d.pathname.charAt(0) === "/",
      `relative pathnames are not supported in hash history.push(${JSON.stringify(
        h
      )})`
    );
  }
  return Dv(
    i,
    r,
    o,
    n
  );
}
function it(n, i) {
  if (n === !1 || n === null || typeof n > "u")
    throw new Error(i);
}
function dn(n, i) {
  if (!n) {
    typeof console < "u" && console.warn(i);
    try {
      throw new Error(i);
    } catch {
    }
  }
}
function zv() {
  return Math.random().toString(36).substring(2, 10);
}
function Ip(n, i) {
  return {
    usr: n.state,
    key: n.key,
    idx: i,
    masked: n.mask ? {
      pathname: n.pathname,
      search: n.search,
      hash: n.hash
    } : void 0
  };
}
function td(n, i, r = null, o, d) {
  return {
    pathname: typeof n == "string" ? n : n.pathname,
    search: "",
    hash: "",
    ...typeof i == "string" ? ps(i) : i,
    state: r,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: i && i.key || o || zv(),
    mask: d
  };
}
function _i({
  pathname: n = "/",
  search: i = "",
  hash: r = ""
}) {
  return i && i !== "?" && (n += i.charAt(0) === "?" ? i : "?" + i), r && r !== "#" && (n += r.charAt(0) === "#" ? r : "#" + r), n;
}
function ps(n) {
  let i = {};
  if (n) {
    let r = n.indexOf("#");
    r >= 0 && (i.hash = n.substring(r), n = n.substring(0, r));
    let o = n.indexOf("?");
    o >= 0 && (i.search = n.substring(o), n = n.substring(0, o)), n && (i.pathname = n);
  }
  return i;
}
function Dv(n, i, r, o = {}) {
  let { window: d = document.defaultView, v5Compat: h = !1 } = o, m = d.history, p = "POP", f = null, _ = x();
  _ == null && (_ = 0, m.replaceState({ ...m.state, idx: _ }, ""));
  function x() {
    return (m.state || { idx: null }).idx;
  }
  function g() {
    p = "POP";
    let E = x(), M = E == null ? null : E - _;
    _ = E, f && f({ action: p, location: T.location, delta: M });
  }
  function y(E, M) {
    p = "PUSH";
    let C = Jp(E) ? E : td(T.location, E, M);
    r && r(C, E), _ = x() + 1;
    let U = Ip(C, _), G = T.createHref(C.mask || C);
    try {
      m.pushState(U, "", G);
    } catch (X) {
      if (X instanceof DOMException && X.name === "DataCloneError")
        throw X;
      d.location.assign(G);
    }
    h && f && f({ action: p, location: T.location, delta: 1 });
  }
  function w(E, M) {
    p = "REPLACE";
    let C = Jp(E) ? E : td(T.location, E, M);
    r && r(C, E), _ = x();
    let U = Ip(C, _), G = T.createHref(C.mask || C);
    m.replaceState(U, "", G), h && f && f({ action: p, location: T.location, delta: 0 });
  }
  function N(E) {
    return Lv(d, E);
  }
  let T = {
    get action() {
      return p;
    },
    get location() {
      return n(d, m);
    },
    listen(E) {
      if (f)
        throw new Error("A history only accepts one active listener");
      return d.addEventListener(Kp, g), f = E, () => {
        d.removeEventListener(Kp, g), f = null;
      };
    },
    createHref(E) {
      return i(d, E);
    },
    createURL: N,
    encodeLocation(E) {
      let M = N(E);
      return {
        pathname: M.pathname,
        search: M.search,
        hash: M.hash
      };
    },
    push: y,
    replace: w,
    go(E) {
      return m.go(E);
    }
  };
  return T;
}
function Lv(n, i, r = !1) {
  let o = "http://localhost";
  n && (o = n.location.origin !== "null" ? n.location.origin : n.location.href), it(o, "No window.location.(origin|href) available to create URL");
  let d = typeof i == "string" ? i : _i(i);
  return d = d.replace(/ $/, "%20"), !r && H_.test(d) && (d = o + d), new URL(d, o);
}
function $_(n, i, r = "/") {
  return Hv(n, i, r, !1);
}
function Hv(n, i, r, o, d) {
  let h = typeof i == "string" ? ps(i) : i, m = oa(h.pathname || "/", r);
  if (m == null)
    return null;
  let p = $v(n), f = null, _ = Zv(m);
  for (let x = 0; f == null && x < p.length; ++x)
    f = Pv(
      p[x],
      _,
      o
    );
  return f;
}
function $v(n) {
  let i = B_(n);
  return Bv(i), i;
}
function B_(n, i = [], r = [], o = "", d = !1) {
  let h = (m, p, f = d, _) => {
    let x = {
      relativePath: _ === void 0 ? m.path || "" : _,
      caseSensitive: m.caseSensitive === !0,
      childrenIndex: p,
      route: m
    };
    if (x.relativePath.startsWith("/")) {
      if (!x.relativePath.startsWith(o) && f)
        return;
      it(
        x.relativePath.startsWith(o),
        `Absolute route path "${x.relativePath}" nested under path "${o}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
      ), x.relativePath = x.relativePath.slice(o.length);
    }
    let g = En([o, x.relativePath]), y = r.concat(x);
    m.children && m.children.length > 0 && (it(
      // Our types know better, but runtime JS may not!
      // @ts-expect-error
      m.index !== !0,
      `Index routes must not have child routes. Please remove all child routes from route path "${g}".`
    ), B_(
      m.children,
      i,
      y,
      g,
      f
    )), !(m.path == null && !m.index) && i.push({
      path: g,
      score: Xv(g, m.index),
      routesMeta: y.map((w, N) => {
        let [T, E] = G_(
          w.relativePath,
          w.caseSensitive,
          N === y.length - 1
        );
        return {
          ...w,
          matcher: T,
          compiledParams: E
        };
      })
    });
  };
  return n.forEach((m, p) => {
    if (m.path === "" || !m.path?.includes("?"))
      h(m, p);
    else
      for (let f of U_(m.path))
        h(m, p, !0, f);
  }), i;
}
function U_(n) {
  let i = n.split("/");
  if (i.length === 0) return [];
  let [r, ...o] = i, d = r.endsWith("?"), h = r.replace(/\?$/, "");
  if (o.length === 0)
    return d ? [h, ""] : [h];
  let m = U_(o.join("/")), p = [];
  return p.push(
    ...m.map(
      (f) => f === "" ? h : [h, f].join("/")
    )
  ), d && p.push(...m), p.map(
    (f) => n.startsWith("/") && f === "" ? "/" : f
  );
}
function Bv(n) {
  n.sort(
    (i, r) => i.score !== r.score ? r.score - i.score : Qv(
      i.routesMeta.map((o) => o.childrenIndex),
      r.routesMeta.map((o) => o.childrenIndex)
    )
  );
}
var Uv = /^:[\w-]+$/, Fv = 3, Gv = 2, Vv = 1, qv = 10, Yv = -2, Wp = (n) => n === "*";
function Xv(n, i) {
  let r = n.split("/"), o = r.length;
  return r.some(Wp) && (o += Yv), i && (o += Gv), r.filter((d) => !Wp(d)).reduce(
    (d, h) => d + (Uv.test(h) ? Fv : h === "" ? Vv : qv),
    o
  );
}
function Qv(n, i) {
  return n.length === i.length && n.slice(0, -1).every((o, d) => o === i[d]) ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    n[n.length - 1] - i[i.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function Pv(n, i, r = !1) {
  let { routesMeta: o } = n, d = {}, h = "/", m = [];
  for (let p = 0; p < o.length; ++p) {
    let f = o[p], _ = p === o.length - 1, x = h === "/" ? i : i.slice(h.length) || "/", g = {
      path: f.relativePath,
      caseSensitive: f.caseSensitive,
      end: _
    }, y = (
      // Use precomputed matcher if it exists
      f.matcher && f.compiledParams ? F_(
        g,
        x,
        f.matcher,
        f.compiledParams
      ) : to(g, x)
    ), w = f.route;
    if (!y && _ && r && !o[o.length - 1].route.index && (y = to(
      {
        path: f.relativePath,
        caseSensitive: f.caseSensitive,
        end: !1
      },
      x
    )), !y)
      return null;
    Object.assign(d, y.params), m.push({
      // TODO: Can this as be avoided?
      params: d,
      pathname: En([h, y.pathname]),
      pathnameBase: Iv(
        En([h, y.pathnameBase])
      ),
      route: w
    }), y.pathnameBase !== "/" && (h = En([h, y.pathnameBase]));
  }
  return m;
}
function to(n, i) {
  typeof n == "string" && (n = { path: n, caseSensitive: !1, end: !0 });
  let [r, o] = G_(
    n.path,
    n.caseSensitive,
    n.end
  );
  return F_(n, i, r, o);
}
function F_(n, i, r, o) {
  let d = i.match(r);
  if (!d) return null;
  let h = d[0], m = h.replace(/(.)\/+$/, "$1"), p = d.slice(1);
  return {
    params: o.reduce(
      (_, { paramName: x, isOptional: g }, y) => {
        if (x === "*") {
          let N = p[y] || "";
          m = h.slice(0, h.length - N.length).replace(/(.)\/+$/, "$1");
        }
        const w = p[y];
        return g && !w ? _[x] = void 0 : _[x] = (w || "").replace(/%2F/g, "/"), _;
      },
      {}
    ),
    pathname: h,
    pathnameBase: m,
    pattern: n
  };
}
function G_(n, i = !1, r = !0) {
  dn(
    n === "*" || !n.endsWith("*") || n.endsWith("/*"),
    `Route path "${n}" will be treated as if it were "${n.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${n.replace(/\*$/, "/*")}".`
  );
  let o = [], d = "^" + n.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(
    /\/:([\w-]+)(\?)?/g,
    (m, p, f, _, x) => {
      if (o.push({ paramName: p, isOptional: f != null }), f) {
        let g = x.charAt(_ + m.length);
        return g && g !== "/" ? "/([^\\/]*)" : "(?:/([^\\/]*))?";
      }
      return "/([^\\/]+)";
    }
  ).replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
  return n.endsWith("*") ? (o.push({ paramName: "*" }), d += n === "*" || n === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$") : r ? d += "\\/*$" : n !== "" && n !== "/" && (d += "(?:(?=\\/|$))"), [new RegExp(d, i ? void 0 : "i"), o];
}
function Zv(n) {
  try {
    return n.split("/").map((i) => decodeURIComponent(i).replace(/\//g, "%2F")).join("/");
  } catch (i) {
    return dn(
      !1,
      `The URL path "${n}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${i}).`
    ), n;
  }
}
function oa(n, i) {
  if (i === "/") return n;
  if (!n.toLowerCase().startsWith(i.toLowerCase()))
    return null;
  let r = i.endsWith("/") ? i.length - 1 : i.length, o = n.charAt(r);
  return o && o !== "/" ? null : n.slice(r) || "/";
}
function Kv(n, i = "/") {
  let {
    pathname: r,
    search: o = "",
    hash: d = ""
  } = typeof n == "string" ? ps(n) : n, h;
  return r ? (r = V_(r), r.startsWith("/") ? h = e_(r.substring(1), "/") : h = e_(r, i)) : h = i, {
    pathname: h,
    search: Wv(o),
    hash: ey(d)
  };
}
function e_(n, i) {
  let r = no(i).split("/");
  return n.split("/").forEach((d) => {
    d === ".." ? r.length > 1 && r.pop() : d !== "." && r.push(d);
  }), r.length > 1 ? r.join("/") : "/";
}
function Gu(n, i, r, o) {
  return `Cannot include a '${n}' character in a manually specified \`to.${i}\` field [${JSON.stringify(
    o
  )}].  Please separate it out to the \`to.${r}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function Jv(n) {
  return n.filter(
    (i, r) => r === 0 || i.route.path && i.route.path.length > 0
  );
}
function fd(n) {
  let i = Jv(n);
  return i.map(
    (r, o) => o === i.length - 1 ? r.pathname : r.pathnameBase
  );
}
function uo(n, i, r, o = !1) {
  let d;
  typeof n == "string" ? d = ps(n) : (d = { ...n }, it(
    !d.pathname || !d.pathname.includes("?"),
    Gu("?", "pathname", "search", d)
  ), it(
    !d.pathname || !d.pathname.includes("#"),
    Gu("#", "pathname", "hash", d)
  ), it(
    !d.search || !d.search.includes("#"),
    Gu("#", "search", "hash", d)
  ));
  let h = n === "" || d.pathname === "", m = h ? "/" : d.pathname, p;
  if (m == null)
    p = r;
  else {
    let g = i.length - 1;
    if (!o && m.startsWith("..")) {
      let y = m.split("/");
      for (; y[0] === ".."; )
        y.shift(), g -= 1;
      d.pathname = y.join("/");
    }
    p = g >= 0 ? i[g] : "/";
  }
  let f = Kv(d, p), _ = m && m !== "/" && m.endsWith("/"), x = (h || m === ".") && r.endsWith("/");
  return !f.pathname.endsWith("/") && (_ || x) && (f.pathname += "/"), f;
}
var V_ = (n) => n.replace(/[\\/]{2,}/g, "/"), En = (n) => V_(n.join("/")), no = (n) => n.replace(/\/+$/, ""), Iv = (n) => no(n).replace(/^\/*/, "/"), Wv = (n) => !n || n === "?" ? "" : n.startsWith("?") ? n : "?" + n, ey = (n) => !n || n === "#" ? "" : n.startsWith("#") ? n : "#" + n, ty = class {
  constructor(n, i, r, o = !1) {
    this.status = n, this.statusText = i || "", this.internal = o, r instanceof Error ? (this.data = r.toString(), this.error = r) : this.data = r;
  }
};
function ny(n) {
  return n != null && typeof n.status == "number" && typeof n.statusText == "string" && typeof n.internal == "boolean" && "data" in n;
}
function ay(n) {
  let i = n.map((r) => r.route.path).filter(Boolean);
  return En(i) || "/";
}
var q_ = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
function Y_(n, i) {
  let r = n;
  if (typeof r != "string" || !md.test(r))
    return {
      absoluteURL: void 0,
      isExternal: !1,
      to: r
    };
  let o = r, d = !1;
  if (q_)
    try {
      let h = new URL(window.location.href), m = H_.test(r) ? new URL(Av(r, h.protocol)) : new URL(r), p = oa(m.pathname, i);
      m.origin === h.origin && p != null ? r = p + m.search + m.hash : d = !0;
    } catch {
      dn(
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
var X_ = [
  "POST",
  "PUT",
  "PATCH",
  "DELETE"
];
new Set(
  X_
);
var sy = [
  "GET",
  ...X_
];
new Set(sy);
var ly = [
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
function iy(n) {
  try {
    return ly.includes(new URL(n).protocol);
  } catch {
    return !1;
  }
}
var dl = v.createContext(null);
dl.displayName = "DataRouter";
var ho = v.createContext(null);
ho.displayName = "DataRouterState";
var Q_ = v.createContext(!1);
function ry() {
  return v.useContext(Q_);
}
var P_ = v.createContext({
  isTransitioning: !1
});
P_.displayName = "ViewTransition";
var oy = v.createContext(
  /* @__PURE__ */ new Map()
);
oy.displayName = "Fetchers";
var cy = v.createContext(null);
cy.displayName = "Await";
var hn = v.createContext(
  null
);
hn.displayName = "Navigation";
var bi = v.createContext(
  null
);
bi.displayName = "Location";
var $n = v.createContext({
  outlet: null,
  matches: [],
  isDataRoute: !1
});
$n.displayName = "Route";
var pd = v.createContext(null);
pd.displayName = "RouteError";
var Z_ = "REACT_ROUTER_ERROR", uy = "REDIRECT", dy = "ROUTE_ERROR_RESPONSE";
function hy(n) {
  if (n.startsWith(`${Z_}:${uy}:{`))
    try {
      let i = JSON.parse(n.slice(28));
      if (typeof i == "object" && i && typeof i.status == "number" && typeof i.statusText == "string" && typeof i.location == "string" && typeof i.reloadDocument == "boolean" && typeof i.replace == "boolean")
        return i;
    } catch {
    }
}
function my(n) {
  if (n.startsWith(
    `${Z_}:${dy}:{`
  ))
    try {
      let i = JSON.parse(n.slice(40));
      if (typeof i == "object" && i && typeof i.status == "number" && typeof i.statusText == "string")
        return new ty(
          i.status,
          i.statusText,
          i.data
        );
    } catch {
    }
}
function fy(n, { relative: i } = {}) {
  it(
    hl(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useHref() may be used only in the context of a <Router> component."
  );
  let { basename: r, navigator: o } = v.useContext(hn), { hash: d, pathname: h, search: m } = gi(n, { relative: i }), p = h;
  return r !== "/" && (p = h === "/" ? r : En([r, h])), o.createHref({ pathname: p, search: m, hash: d });
}
function hl() {
  return v.useContext(bi) != null;
}
function Ft() {
  return it(
    hl(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useLocation() may be used only in the context of a <Router> component."
  ), v.useContext(bi).location;
}
var K_ = "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function J_(n) {
  v.useContext(hn).static || v.useLayoutEffect(n);
}
function gt() {
  let { isDataRoute: n } = v.useContext($n);
  return n ? Cy() : py();
}
function py() {
  it(
    hl(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useNavigate() may be used only in the context of a <Router> component."
  );
  let n = v.useContext(dl), { basename: i, navigator: r } = v.useContext(hn), { matches: o } = v.useContext($n), { pathname: d } = Ft(), h = JSON.stringify(fd(o)), m = v.useRef(!1);
  return J_(() => {
    m.current = !0;
  }), v.useCallback(
    (f, _ = {}) => {
      if (dn(m.current, K_), !m.current) return;
      if (typeof f == "number") {
        r.go(f);
        return;
      }
      let x = uo(
        f,
        JSON.parse(h),
        d,
        _.relative === "path"
      );
      n == null && i !== "/" && (x.pathname = x.pathname === "/" ? i : En([i, x.pathname])), (_.replace ? r.replace : r.push)(
        x,
        _.state,
        _
      );
    },
    [
      i,
      r,
      h,
      d,
      n
    ]
  );
}
v.createContext(null);
function gi(n, { relative: i } = {}) {
  let { matches: r } = v.useContext($n), { pathname: o } = Ft(), d = JSON.stringify(fd(r));
  return v.useMemo(
    () => uo(
      n,
      JSON.parse(d),
      o,
      i === "path"
    ),
    [n, d, o, i]
  );
}
function _y(n, i) {
  return I_(n, i);
}
function I_(n, i, r) {
  it(
    hl(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useRoutes() may be used only in the context of a <Router> component."
  );
  let { navigator: o } = v.useContext(hn), { matches: d } = v.useContext($n), h = d[d.length - 1], m = h ? h.params : {}, p = h ? h.pathname : "/", f = h ? h.pathnameBase : "/", _ = h && h.route;
  {
    let E = _ && _.path || "";
    eb(
      p,
      !_ || E.endsWith("*") || E.endsWith("*?"),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${p}" (under <Route path="${E}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${E}"> to <Route path="${E === "/" ? "*" : `${E}/*`}">.`
    );
  }
  let x = Ft(), g;
  if (i) {
    let E = typeof i == "string" ? ps(i) : i;
    it(
      f === "/" || E.pathname?.startsWith(f),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${f}" but pathname "${E.pathname}" was given in the \`location\` prop.`
    ), g = E;
  } else
    g = x;
  let y = g.pathname || "/", w = y;
  if (f !== "/") {
    let E = f.replace(/^\//, "").split("/");
    w = "/" + y.replace(/^\//, "").split("/").slice(E.length).join("/");
  }
  let N = r && r.state.matches.length ? (
    // If we're in a data router, use the matches we've already identified but ensure
    // we have the latest route instances from the manifest in case elements have changed
    r.state.matches.map(
      (E) => Object.assign(E, {
        route: r.manifest[E.route.id] || E.route
      })
    )
  ) : $_(n, { pathname: w });
  dn(
    _ || N != null,
    `No routes matched location "${g.pathname}${g.search}${g.hash}" `
  ), dn(
    N == null || N[N.length - 1].route.element !== void 0 || N[N.length - 1].route.Component !== void 0 || N[N.length - 1].route.lazy !== void 0,
    `Matched leaf route at location "${g.pathname}${g.search}${g.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`
  );
  let T = yy(
    N && N.map(
      (E) => Object.assign({}, E, {
        params: Object.assign({}, m, E.params),
        pathname: En([
          f,
          // Re-encode pathnames that were decoded inside matchRoutes.
          // Pre-encode `%`, `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          o.encodeLocation ? o.encodeLocation(
            E.pathname.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : E.pathname
        ]),
        pathnameBase: E.pathnameBase === "/" ? f : En([
          f,
          // Re-encode pathnames that were decoded inside matchRoutes
          // Pre-encode `%`, `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          o.encodeLocation ? o.encodeLocation(
            E.pathnameBase.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : E.pathnameBase
        ])
      })
    ),
    d,
    r
  );
  return i && T ? /* @__PURE__ */ v.createElement(
    bi.Provider,
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
function by() {
  let n = Ny(), i = ny(n) ? `${n.status} ${n.statusText}` : n instanceof Error ? n.message : JSON.stringify(n), r = n instanceof Error ? n.stack : null, o = "rgba(200,200,200, 0.5)", d = { padding: "0.5rem", backgroundColor: o }, h = { padding: "2px 4px", backgroundColor: o }, m = null;
  return console.error(
    "Error handled by React Router default ErrorBoundary:",
    n
  ), m = /* @__PURE__ */ v.createElement(v.Fragment, null, /* @__PURE__ */ v.createElement("p", null, "💿 Hey developer 👋"), /* @__PURE__ */ v.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /* @__PURE__ */ v.createElement("code", { style: h }, "ErrorBoundary"), " or", " ", /* @__PURE__ */ v.createElement("code", { style: h }, "errorElement"), " prop on your route.")), /* @__PURE__ */ v.createElement(v.Fragment, null, /* @__PURE__ */ v.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ v.createElement("h3", { style: { fontStyle: "italic" } }, i), r ? /* @__PURE__ */ v.createElement("pre", { style: d }, r) : null, m);
}
var gy = /* @__PURE__ */ v.createElement(by, null), W_ = class extends v.Component {
  constructor(n) {
    super(n), this.state = {
      location: n.location,
      revalidation: n.revalidation,
      error: n.error
    };
  }
  static getDerivedStateFromError(n) {
    return { error: n };
  }
  static getDerivedStateFromProps(n, i) {
    return i.location !== n.location || i.revalidation !== "idle" && n.revalidation === "idle" ? {
      error: n.error,
      location: n.location,
      revalidation: n.revalidation
    } : {
      error: n.error !== void 0 ? n.error : i.error,
      location: i.location,
      revalidation: n.revalidation || i.revalidation
    };
  }
  componentDidCatch(n, i) {
    this.props.onError ? this.props.onError(n, i) : console.error(
      "React Router caught the following error during render",
      n
    );
  }
  render() {
    let n = this.state.error;
    if (this.context && typeof n == "object" && n && "digest" in n && typeof n.digest == "string") {
      const r = my(n.digest);
      r && (n = r);
    }
    let i = n !== void 0 ? /* @__PURE__ */ v.createElement($n.Provider, { value: this.props.routeContext }, /* @__PURE__ */ v.createElement(
      pd.Provider,
      {
        value: n,
        children: this.props.component
      }
    )) : this.props.children;
    return this.context ? /* @__PURE__ */ v.createElement(xy, { error: n }, i) : i;
  }
};
W_.contextType = Q_;
var Vu = /* @__PURE__ */ new WeakMap();
function xy({
  children: n,
  error: i
}) {
  let { basename: r } = v.useContext(hn);
  if (typeof i == "object" && i && "digest" in i && typeof i.digest == "string") {
    let o = hy(i.digest);
    if (o) {
      let d = Vu.get(i);
      if (d) throw d;
      let h = Y_(o.location, r), m = h.absoluteURL || h.to;
      if (iy(m))
        throw new Error("Invalid redirect location");
      if (q_ && !Vu.get(i))
        if (h.isExternal || o.reloadDocument)
          window.location.href = m;
        else {
          const p = Promise.resolve().then(
            () => window.__reactRouterDataRouter.navigate(h.to, {
              replace: o.replace
            })
          );
          throw Vu.set(i, p), p;
        }
      return /* @__PURE__ */ v.createElement("meta", { httpEquiv: "refresh", content: `0;url=${m}` });
    }
  }
  return n;
}
function vy({ routeContext: n, match: i, children: r }) {
  let o = v.useContext(dl);
  return o && o.static && o.staticContext && (i.route.errorElement || i.route.ErrorBoundary) && (o.staticContext._deepestRenderedBoundaryId = i.route.id), /* @__PURE__ */ v.createElement($n.Provider, { value: n }, r);
}
function yy(n, i = [], r) {
  let o = r?.state;
  if (n == null) {
    if (!o)
      return null;
    if (o.errors)
      n = o.matches;
    else if (i.length === 0 && !o.initialized && o.matches.length > 0)
      n = o.matches;
    else
      return null;
  }
  let d = n, h = o?.errors;
  if (h != null) {
    let x = d.findIndex(
      (g) => g.route.id && h?.[g.route.id] !== void 0
    );
    it(
      x >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(
        h
      ).join(",")}`
    ), d = d.slice(
      0,
      Math.min(d.length, x + 1)
    );
  }
  let m = !1, p = -1;
  if (r && o) {
    m = o.renderFallback;
    for (let x = 0; x < d.length; x++) {
      let g = d[x];
      if ((g.route.HydrateFallback || g.route.hydrateFallbackElement) && (p = x), g.route.id) {
        let { loaderData: y, errors: w } = o, N = g.route.loader && !y.hasOwnProperty(g.route.id) && (!w || w[g.route.id] === void 0);
        if (g.route.lazy || N) {
          r.isStatic && (m = !0), p >= 0 ? d = d.slice(0, p + 1) : d = [d[0]];
          break;
        }
      }
    }
  }
  let f = r?.onError, _ = o && f ? (x, g) => {
    f(x, {
      location: o.location,
      params: o.matches?.[0]?.params ?? {},
      pattern: ay(o.matches),
      errorInfo: g
    });
  } : void 0;
  return d.reduceRight(
    (x, g, y) => {
      let w, N = !1, T = null, E = null;
      o && (w = h && g.route.id ? h[g.route.id] : void 0, T = g.route.errorElement || gy, m && (p < 0 && y === 0 ? (eb(
        "route-fallback",
        !1,
        "No `HydrateFallback` element provided to render during initial hydration"
      ), N = !0, E = null) : p === y && (N = !0, E = g.route.hydrateFallbackElement || null)));
      let M = i.concat(d.slice(0, y + 1)), C = () => {
        let U;
        return w ? U = T : N ? U = E : g.route.Component ? U = /* @__PURE__ */ v.createElement(g.route.Component, null) : g.route.element ? U = g.route.element : U = x, /* @__PURE__ */ v.createElement(
          vy,
          {
            match: g,
            routeContext: {
              outlet: x,
              matches: M,
              isDataRoute: o != null
            },
            children: U
          }
        );
      };
      return o && (g.route.ErrorBoundary || g.route.errorElement || y === 0) ? /* @__PURE__ */ v.createElement(
        W_,
        {
          location: o.location,
          revalidation: o.revalidation,
          component: T,
          error: w,
          children: C(),
          routeContext: { outlet: null, matches: M, isDataRoute: !0 },
          onError: _
        }
      ) : C();
    },
    null
  );
}
function _d(n) {
  return `${n} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function jy(n) {
  let i = v.useContext(dl);
  return it(i, _d(n)), i;
}
function wy(n) {
  let i = v.useContext(ho);
  return it(i, _d(n)), i;
}
function Sy(n) {
  let i = v.useContext($n);
  return it(i, _d(n)), i;
}
function bd(n) {
  let i = Sy(n), r = i.matches[i.matches.length - 1];
  return it(
    r.route.id,
    `${n} can only be used on routes that contain a unique "id"`
  ), r.route.id;
}
function ky() {
  return bd(
    "useRouteId"
    /* UseRouteId */
  );
}
function Ny() {
  let n = v.useContext(pd), i = wy(
    "useRouteError"
    /* UseRouteError */
  ), r = bd(
    "useRouteError"
    /* UseRouteError */
  );
  return n !== void 0 ? n : i.errors?.[r];
}
function Cy() {
  let { router: n } = jy(
    "useNavigate"
    /* UseNavigateStable */
  ), i = bd(
    "useNavigate"
    /* UseNavigateStable */
  ), r = v.useRef(!1);
  return J_(() => {
    r.current = !0;
  }), v.useCallback(
    async (d, h = {}) => {
      dn(r.current, K_), r.current && (typeof d == "number" ? await n.navigate(d) : await n.navigate(d, { fromRouteId: i, ...h }));
    },
    [n, i]
  );
}
var t_ = {};
function eb(n, i, r) {
  !i && !t_[n] && (t_[n] = !0, dn(!1, r));
}
v.memo(Ty);
function Ty({
  routes: n,
  manifest: i,
  future: r,
  state: o,
  isStatic: d,
  onError: h
}) {
  return I_(n, void 0, {
    manifest: i,
    state: o,
    isStatic: d,
    onError: h
  });
}
function Ha({
  to: n,
  replace: i,
  state: r,
  relative: o
}) {
  it(
    hl(),
    // TODO: This error is probably because they somehow have 2 versions of
    // the router loaded. We can help them understand how to avoid that.
    "<Navigate> may be used only in the context of a <Router> component."
  );
  let { static: d } = v.useContext(hn);
  dn(
    !d,
    "<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change."
  );
  let { matches: h } = v.useContext($n), { pathname: m } = Ft(), p = gt(), f = uo(
    n,
    fd(h),
    m,
    o === "path"
  ), _ = JSON.stringify(f);
  return v.useEffect(() => {
    p(JSON.parse(_), { replace: i, state: r, relative: o });
  }, [p, _, o, i, r]), null;
}
function He(n) {
  it(
    !1,
    "A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>."
  );
}
function Ey({
  basename: n = "/",
  children: i = null,
  location: r,
  navigationType: o = "POP",
  navigator: d,
  static: h = !1,
  useTransitions: m
}) {
  it(
    !hl(),
    "You cannot render a <Router> inside another <Router>. You should never have more than one in your app."
  );
  let p = n.replace(/^\/*/, "/"), f = v.useMemo(
    () => ({
      basename: p,
      navigator: d,
      static: h,
      useTransitions: m,
      future: {}
    }),
    [p, d, h, m]
  );
  typeof r == "string" && (r = ps(r));
  let {
    pathname: _ = "/",
    search: x = "",
    hash: g = "",
    state: y = null,
    key: w = "default",
    mask: N
  } = r, T = v.useMemo(() => {
    let E = oa(_, p);
    return E == null ? null : {
      location: {
        pathname: E,
        search: x,
        hash: g,
        state: y,
        key: w,
        mask: N
      },
      navigationType: o
    };
  }, [p, _, x, g, y, w, o, N]);
  return dn(
    T != null,
    `<Router basename="${p}"> is not able to match the URL "${_}${x}${g}" because it does not start with the basename, so the <Router> won't render anything.`
  ), T == null ? null : /* @__PURE__ */ v.createElement(hn.Provider, { value: f }, /* @__PURE__ */ v.createElement(bi.Provider, { children: i, value: T }));
}
function My({
  children: n,
  location: i
}) {
  return _y(nd(n), i);
}
function nd(n, i = []) {
  let r = [];
  return v.Children.forEach(n, (o, d) => {
    if (!v.isValidElement(o))
      return;
    let h = [...i, d];
    if (o.type === v.Fragment) {
      r.push.apply(
        r,
        nd(o.props.children, h)
      );
      return;
    }
    it(
      o.type === He,
      `[${typeof o.type == "string" ? o.type : o.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`
    ), it(
      !o.props.index || !o.props.children,
      "An index route cannot have child routes."
    );
    let m = {
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
    o.props.children && (m.children = nd(
      o.props.children,
      h
    )), r.push(m);
  }), r;
}
var Zr = "get", Kr = "application/x-www-form-urlencoded";
function mo(n) {
  return typeof HTMLElement < "u" && n instanceof HTMLElement;
}
function Ry(n) {
  return mo(n) && n.tagName.toLowerCase() === "button";
}
function Ay(n) {
  return mo(n) && n.tagName.toLowerCase() === "form";
}
function Oy(n) {
  return mo(n) && n.tagName.toLowerCase() === "input";
}
function zy(n) {
  return !!(n.metaKey || n.altKey || n.ctrlKey || n.shiftKey);
}
function Dy(n, i) {
  return n.button === 0 && // Ignore everything but left clicks
  (!i || i === "_self") && // Let browser handle "target=_blank" etc.
  !zy(n);
}
function ad(n = "") {
  return new URLSearchParams(
    typeof n == "string" || Array.isArray(n) || n instanceof URLSearchParams ? n : Object.keys(n).reduce((i, r) => {
      let o = n[r];
      return i.concat(
        Array.isArray(o) ? o.map((d) => [r, d]) : [[r, o]]
      );
    }, [])
  );
}
function Ly(n, i) {
  let r = ad(n);
  return i && i.forEach((o, d) => {
    r.has(d) || i.getAll(d).forEach((h) => {
      r.append(d, h);
    });
  }), r;
}
var $r = null;
function Hy() {
  if ($r === null)
    try {
      new FormData(
        document.createElement("form"),
        // @ts-expect-error if FormData supports the submitter parameter, this will throw
        0
      ), $r = !1;
    } catch {
      $r = !0;
    }
  return $r;
}
var $y = /* @__PURE__ */ new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
]);
function qu(n) {
  return n != null && !$y.has(n) ? (dn(
    !1,
    `"${n}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${Kr}"`
  ), null) : n;
}
function By(n, i) {
  let r, o, d, h, m;
  if (Ay(n)) {
    let p = n.getAttribute("action");
    o = p ? oa(p, i) : null, r = n.getAttribute("method") || Zr, d = qu(n.getAttribute("enctype")) || Kr, h = new FormData(n);
  } else if (Ry(n) || Oy(n) && (n.type === "submit" || n.type === "image")) {
    let p = n.form;
    if (p == null)
      throw new Error(
        'Cannot submit a <button> or <input type="submit"> without a <form>'
      );
    let f = n.getAttribute("formaction") || p.getAttribute("action");
    if (o = f ? oa(f, i) : null, r = n.getAttribute("formmethod") || p.getAttribute("method") || Zr, d = qu(n.getAttribute("formenctype")) || qu(p.getAttribute("enctype")) || Kr, h = new FormData(p, n), !Hy()) {
      let { name: _, type: x, value: g } = n;
      if (x === "image") {
        let y = _ ? `${_}.` : "";
        h.append(`${y}x`, "0"), h.append(`${y}y`, "0");
      } else _ && h.append(_, g);
    }
  } else {
    if (mo(n))
      throw new Error(
        'Cannot submit element that is not <form>, <button>, or <input type="submit|image">'
      );
    r = Zr, o = null, d = Kr, m = n;
  }
  return h && d === "text/plain" && (m = h, h = void 0), { action: o, method: r.toLowerCase(), encType: d, formData: h, body: m };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function gd(n, i) {
  if (n === !1 || n === null || typeof n > "u")
    throw new Error(i);
}
function tb(n, i, r, o) {
  let d = typeof n == "string" ? new URL(
    n,
    // This can be called during the SSR flow via PrefetchPageLinksImpl so
    // don't assume window is available
    typeof window > "u" ? "server://singlefetch/" : window.location.origin
  ) : n;
  return r ? d.pathname.endsWith("/") ? d.pathname = `${d.pathname}_.${o}` : d.pathname = `${d.pathname}.${o}` : d.pathname === "/" ? d.pathname = `_root.${o}` : i && oa(d.pathname, i) === "/" ? d.pathname = `${no(i)}/_root.${o}` : d.pathname = `${no(d.pathname)}.${o}`, d;
}
async function Uy(n, i) {
  if (n.id in i)
    return i[n.id];
  try {
    let r = await import(
      /* @vite-ignore */
      /* webpackIgnore: true */
      n.module
    );
    return i[n.id] = r, r;
  } catch (r) {
    return console.error(
      `Error loading route module \`${n.module}\`, reloading page...`
    ), console.error(r), window.__reactRouterContext && window.__reactRouterContext.isSpaMode, window.location.reload(), new Promise(() => {
    });
  }
}
function Fy(n) {
  return n == null ? !1 : n.href == null ? n.rel === "preload" && typeof n.imageSrcSet == "string" && typeof n.imageSizes == "string" : typeof n.rel == "string" && typeof n.href == "string";
}
async function Gy(n, i, r) {
  let o = await Promise.all(
    n.map(async (d) => {
      let h = i.routes[d.route.id];
      if (h) {
        let m = await Uy(h, r);
        return m.links ? m.links() : [];
      }
      return [];
    })
  );
  return Xy(
    o.flat(1).filter(Fy).filter((d) => d.rel === "stylesheet" || d.rel === "preload").map(
      (d) => d.rel === "stylesheet" ? { ...d, rel: "prefetch", as: "style" } : { ...d, rel: "prefetch" }
    )
  );
}
function n_(n, i, r, o, d, h) {
  let m = (f, _) => r[_] ? f.route.id !== r[_].route.id : !0, p = (f, _) => (
    // param change, /users/123 -> /users/456
    r[_].pathname !== f.pathname || // splat param changed, which is not present in match.path
    // e.g. /files/images/avatar.jpg -> files/finances.xls
    r[_].route.path?.endsWith("*") && r[_].params["*"] !== f.params["*"]
  );
  return h === "assets" ? i.filter(
    (f, _) => m(f, _) || p(f, _)
  ) : h === "data" ? i.filter((f, _) => {
    let x = o.routes[f.route.id];
    if (!x || !x.hasLoader)
      return !1;
    if (m(f, _) || p(f, _))
      return !0;
    if (f.route.shouldRevalidate) {
      let g = f.route.shouldRevalidate({
        currentUrl: new URL(
          d.pathname + d.search + d.hash,
          window.origin
        ),
        currentParams: r[0]?.params || {},
        nextUrl: new URL(n, window.origin),
        nextParams: f.params,
        defaultShouldRevalidate: !0
      });
      if (typeof g == "boolean")
        return g;
    }
    return !0;
  }) : [];
}
function Vy(n, i, { includeHydrateFallback: r } = {}) {
  return qy(
    n.map((o) => {
      let d = i.routes[o.route.id];
      if (!d) return [];
      let h = [d.module];
      return d.clientActionModule && (h = h.concat(d.clientActionModule)), d.clientLoaderModule && (h = h.concat(d.clientLoaderModule)), r && d.hydrateFallbackModule && (h = h.concat(d.hydrateFallbackModule)), d.imports && (h = h.concat(d.imports)), h;
    }).flat(1)
  );
}
function qy(n) {
  return [...new Set(n)];
}
function Yy(n) {
  let i = {}, r = Object.keys(n).sort();
  for (let o of r)
    i[o] = n[o];
  return i;
}
function Xy(n, i) {
  let r = /* @__PURE__ */ new Set();
  return new Set(i), n.reduce((o, d) => {
    let h = JSON.stringify(Yy(d));
    return r.has(h) || (r.add(h), o.push({ key: h, link: d })), o;
  }, []);
}
function xd() {
  let n = v.useContext(dl);
  return gd(
    n,
    "You must render this element inside a <DataRouterContext.Provider> element"
  ), n;
}
function Qy() {
  let n = v.useContext(ho);
  return gd(
    n,
    "You must render this element inside a <DataRouterStateContext.Provider> element"
  ), n;
}
var vd = v.createContext(void 0);
vd.displayName = "FrameworkContext";
function fo() {
  let n = v.useContext(vd);
  return gd(
    n,
    "You must render this element inside a <HydratedRouter> element"
  ), n;
}
function Py(n, i) {
  let r = v.useContext(vd), [o, d] = v.useState(!1), [h, m] = v.useState(!1), { onFocus: p, onBlur: f, onMouseEnter: _, onMouseLeave: x, onTouchStart: g } = i, y = v.useRef(null);
  v.useEffect(() => {
    if (n === "render" && m(!0), n === "viewport") {
      let T = (M) => {
        M.forEach((C) => {
          m(C.isIntersecting);
        });
      }, E = new IntersectionObserver(T, { threshold: 0.5 });
      return y.current && E.observe(y.current), () => {
        E.disconnect();
      };
    }
  }, [n]), v.useEffect(() => {
    if (o) {
      let T = setTimeout(() => {
        m(!0);
      }, 100);
      return () => {
        clearTimeout(T);
      };
    }
  }, [o]);
  let w = () => {
    d(!0);
  }, N = () => {
    d(!1), m(!1);
  };
  return r ? n !== "intent" ? [h, y, {}] : [
    h,
    y,
    {
      onFocus: hi(p, w),
      onBlur: hi(f, N),
      onMouseEnter: hi(_, w),
      onMouseLeave: hi(x, N),
      onTouchStart: hi(g, w)
    }
  ] : [!1, y, {}];
}
function hi(n, i) {
  return (r) => {
    n && n(r), r.defaultPrevented || i(r);
  };
}
function Zy({ page: n, ...i }) {
  let r = ry(), { nonce: o } = fo(), { router: d } = xd(), h = v.useMemo(
    () => $_(d.routes, n, d.basename),
    [d.routes, n, d.basename]
  );
  return h ? (i.nonce == null && o && (i = { ...i, nonce: o }), r ? /* @__PURE__ */ v.createElement(Jy, { page: n, matches: h, ...i }) : /* @__PURE__ */ v.createElement(Iy, { page: n, matches: h, ...i })) : null;
}
function Ky(n) {
  let { manifest: i, routeModules: r } = fo(), [o, d] = v.useState([]);
  return v.useEffect(() => {
    let h = !1;
    return Gy(n, i, r).then(
      (m) => {
        h || d(m);
      }
    ), () => {
      h = !0;
    };
  }, [n, i, r]), o;
}
function Jy({
  page: n,
  matches: i,
  ...r
}) {
  let o = Ft(), { future: d } = fo(), { basename: h } = xd(), m = v.useMemo(() => {
    if (n === o.pathname + o.search + o.hash)
      return [];
    let p = tb(
      n,
      h,
      d.v8_trailingSlashAwareDataRequests,
      "rsc"
    ), f = !1, _ = [];
    for (let x of i)
      typeof x.route.shouldRevalidate == "function" ? f = !0 : _.push(x.route.id);
    return f && _.length > 0 && p.searchParams.set("_routes", _.join(",")), [p.pathname + p.search];
  }, [
    h,
    d.v8_trailingSlashAwareDataRequests,
    n,
    o,
    i
  ]);
  return /* @__PURE__ */ v.createElement(v.Fragment, null, m.map((p) => /* @__PURE__ */ v.createElement("link", { key: p, rel: "prefetch", as: "fetch", href: p, ...r })));
}
function Iy({
  page: n,
  matches: i,
  ...r
}) {
  let o = Ft(), { future: d, manifest: h, routeModules: m } = fo(), { basename: p } = xd(), { loaderData: f, matches: _ } = Qy(), x = v.useMemo(
    () => n_(
      n,
      i,
      _,
      h,
      o,
      "data"
    ),
    [n, i, _, h, o]
  ), g = v.useMemo(
    () => n_(
      n,
      i,
      _,
      h,
      o,
      "assets"
    ),
    [n, i, _, h, o]
  ), y = v.useMemo(() => {
    if (n === o.pathname + o.search + o.hash)
      return [];
    let T = /* @__PURE__ */ new Set(), E = !1;
    if (i.forEach((C) => {
      let U = h.routes[C.route.id];
      !U || !U.hasLoader || (!x.some((G) => G.route.id === C.route.id) && C.route.id in f && m[C.route.id]?.shouldRevalidate || U.hasClientLoader ? E = !0 : T.add(C.route.id));
    }), T.size === 0)
      return [];
    let M = tb(
      n,
      p,
      d.v8_trailingSlashAwareDataRequests,
      "data"
    );
    return E && T.size > 0 && M.searchParams.set(
      "_routes",
      i.filter((C) => T.has(C.route.id)).map((C) => C.route.id).join(",")
    ), [M.pathname + M.search];
  }, [
    p,
    d.v8_trailingSlashAwareDataRequests,
    f,
    o,
    h,
    x,
    i,
    n,
    m
  ]), w = v.useMemo(
    () => Vy(g, h),
    [g, h]
  ), N = Ky(g);
  return /* @__PURE__ */ v.createElement(v.Fragment, null, y.map((T) => /* @__PURE__ */ v.createElement("link", { key: T, rel: "prefetch", as: "fetch", href: T, ...r })), w.map((T) => /* @__PURE__ */ v.createElement("link", { key: T, rel: "modulepreload", href: T, ...r })), N.map(({ key: T, link: E }) => (
    // these don't spread `linkProps` because they are full link descriptors
    // already with their own props
    /* @__PURE__ */ v.createElement(
      "link",
      {
        key: T,
        nonce: r.nonce,
        ...E,
        crossOrigin: E.crossOrigin ?? r.crossOrigin
      }
    )
  )));
}
function Wy(...n) {
  return (i) => {
    n.forEach((r) => {
      typeof r == "function" ? r(i) : r != null && (r.current = i);
    });
  };
}
var e0 = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
try {
  e0 && (window.__reactRouterVersion = // @ts-expect-error
  "7.18.2");
} catch {
}
function t0({
  basename: n,
  children: i,
  useTransitions: r,
  window: o
}) {
  let d = v.useRef();
  d.current == null && (d.current = Ov({ window: o, v5Compat: !0 }));
  let h = d.current, [m, p] = v.useState({
    action: h.action,
    location: h.location
  }), f = v.useCallback(
    (_) => {
      r === !1 ? p(_) : v.startTransition(() => p(_));
    },
    [r]
  );
  return v.useLayoutEffect(() => h.listen(f), [h, f]), /* @__PURE__ */ v.createElement(
    Ey,
    {
      basename: n,
      children: i,
      location: m.location,
      navigationType: m.action,
      navigator: h,
      useTransitions: r
    }
  );
}
var cl = v.forwardRef(
  function({
    onClick: i,
    discover: r = "render",
    prefetch: o = "none",
    relative: d,
    reloadDocument: h,
    replace: m,
    mask: p,
    state: f,
    target: _,
    to: x,
    preventScrollReset: g,
    viewTransition: y,
    defaultShouldRevalidate: w,
    ...N
  }, T) {
    let { basename: E, navigator: M, useTransitions: C } = v.useContext(hn), U = typeof x == "string" && md.test(x), G = Y_(x, E);
    x = G.to;
    let X = fy(x, { relative: d }), L = Ft(), V = null;
    if (p) {
      let ue = uo(
        p,
        [],
        L.mask ? L.mask.pathname : "/",
        !0
      );
      E !== "/" && (ue.pathname = ue.pathname === "/" ? E : En([E, ue.pathname])), V = M.createHref(ue);
    }
    let [te, re, se] = Py(
      o,
      N
    ), ce = s0(x, {
      replace: m,
      mask: p,
      state: f,
      target: _,
      preventScrollReset: g,
      relative: d,
      viewTransition: y,
      defaultShouldRevalidate: w,
      useTransitions: C
    });
    function me(ue) {
      i && i(ue), ue.defaultPrevented || ce(ue);
    }
    let oe = !(G.isExternal || h), ge = (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      /* @__PURE__ */ v.createElement(
        "a",
        {
          ...N,
          ...se,
          href: (oe ? V : void 0) || G.absoluteURL || X,
          onClick: oe ? me : i,
          ref: Wy(T, re),
          target: _,
          "data-discover": !U && r === "render" ? "true" : void 0
        }
      )
    );
    return te && !U ? /* @__PURE__ */ v.createElement(v.Fragment, null, ge, /* @__PURE__ */ v.createElement(Zy, { page: X })) : ge;
  }
);
cl.displayName = "Link";
var Jr = v.forwardRef(
  function({
    "aria-current": i = "page",
    caseSensitive: r = !1,
    className: o = "",
    end: d = !1,
    style: h,
    to: m,
    viewTransition: p,
    children: f,
    ..._
  }, x) {
    let g = gi(m, { relative: _.relative }), y = Ft(), w = v.useContext(ho), { navigator: N, basename: T } = v.useContext(hn), E = w != null && // Conditional usage is OK here because the usage of a data router is static
    // eslint-disable-next-line react-hooks/rules-of-hooks
    c0(g) && p === !0, M = N.encodeLocation ? N.encodeLocation(g).pathname : g.pathname, C = y.pathname, U = w && w.navigation && w.navigation.location ? w.navigation.location.pathname : null;
    r || (C = C.toLowerCase(), U = U ? U.toLowerCase() : null, M = M.toLowerCase()), U && T && (U = oa(U, T) || U);
    const G = M !== "/" && M.endsWith("/") ? M.length - 1 : M.length;
    let X = C === M || !d && C.startsWith(M) && C.charAt(G) === "/", L = U != null && (U === M || !d && U.startsWith(M) && U.charAt(M.length) === "/"), V = {
      isActive: X,
      isPending: L,
      isTransitioning: E
    }, te = X ? i : void 0, re;
    typeof o == "function" ? re = o(V) : re = [
      o,
      X ? "active" : null,
      L ? "pending" : null,
      E ? "transitioning" : null
    ].filter(Boolean).join(" ");
    let se = typeof h == "function" ? h(V) : h;
    return /* @__PURE__ */ v.createElement(
      cl,
      {
        ..._,
        "aria-current": te,
        className: re,
        ref: x,
        style: se,
        to: m,
        viewTransition: p
      },
      typeof f == "function" ? f(V) : f
    );
  }
);
Jr.displayName = "NavLink";
var n0 = v.forwardRef(
  ({
    discover: n = "render",
    fetcherKey: i,
    navigate: r,
    reloadDocument: o,
    replace: d,
    state: h,
    method: m = Zr,
    action: p,
    onSubmit: f,
    relative: _,
    preventScrollReset: x,
    viewTransition: g,
    defaultShouldRevalidate: y,
    ...w
  }, N) => {
    let { useTransitions: T } = v.useContext(hn), E = r0(), M = o0(p, { relative: _ }), C = m.toLowerCase() === "get" ? "get" : "post", U = typeof p == "string" && md.test(p), G = (X) => {
      if (f && f(X), X.defaultPrevented) return;
      X.preventDefault();
      let L = X.nativeEvent.submitter, V = L?.getAttribute("formmethod") || m, te = () => E(L || X.currentTarget, {
        fetcherKey: i,
        method: V,
        navigate: r,
        replace: d,
        state: h,
        relative: _,
        preventScrollReset: x,
        viewTransition: g,
        defaultShouldRevalidate: y
      });
      T && r !== !1 ? v.startTransition(() => te()) : te();
    };
    return /* @__PURE__ */ v.createElement(
      "form",
      {
        ref: N,
        method: C,
        action: M,
        onSubmit: o ? f : G,
        ...w,
        "data-discover": !U && n === "render" ? "true" : void 0
      }
    );
  }
);
n0.displayName = "Form";
function a0(n) {
  return `${n} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function nb(n) {
  let i = v.useContext(dl);
  return it(i, a0(n)), i;
}
function s0(n, {
  target: i,
  replace: r,
  mask: o,
  state: d,
  preventScrollReset: h,
  relative: m,
  viewTransition: p,
  defaultShouldRevalidate: f,
  useTransitions: _
} = {}) {
  let x = gt(), g = Ft(), y = gi(n, { relative: m });
  return v.useCallback(
    (w) => {
      if (Dy(w, i)) {
        w.preventDefault();
        let N = r !== void 0 ? r : _i(g) === _i(y), T = () => x(n, {
          replace: N,
          mask: o,
          state: d,
          preventScrollReset: h,
          relative: m,
          viewTransition: p,
          defaultShouldRevalidate: f
        });
        _ ? v.startTransition(() => T()) : T();
      }
    },
    [
      g,
      x,
      y,
      r,
      o,
      d,
      i,
      n,
      h,
      m,
      p,
      f,
      _
    ]
  );
}
function po(n) {
  dn(
    typeof URLSearchParams < "u",
    "You cannot use the `useSearchParams` hook in a browser that does not support the URLSearchParams API. If you need to support Internet Explorer 11, we recommend you load a polyfill such as https://github.com/ungap/url-search-params."
  );
  let i = v.useRef(ad(n)), r = v.useRef(!1), o = Ft(), d = v.useMemo(
    () => (
      // Only merge in the defaults if we haven't yet called setSearchParams.
      // Once we call that we want those to take precedence, otherwise you can't
      // remove a param with setSearchParams({}) if it has an initial value
      Ly(
        o.search,
        r.current ? null : i.current
      )
    ),
    [o.search]
  ), h = gt(), m = v.useCallback(
    (p, f) => {
      const _ = ad(
        typeof p == "function" ? p(new URLSearchParams(d)) : p
      );
      r.current = !0, h("?" + _, f);
    },
    [h, d]
  );
  return [d, m];
}
var l0 = 0, i0 = () => `__${String(++l0)}__`;
function r0() {
  let { router: n } = nb(
    "useSubmit"
    /* UseSubmit */
  ), { basename: i } = v.useContext(hn), r = ky(), o = n.fetch, d = n.navigate;
  return v.useCallback(
    async (h, m = {}) => {
      let { action: p, method: f, encType: _, formData: x, body: g } = By(
        h,
        i
      );
      if (m.navigate === !1) {
        let y = m.fetcherKey || i0();
        await o(y, r, m.action || p, {
          defaultShouldRevalidate: m.defaultShouldRevalidate,
          preventScrollReset: m.preventScrollReset,
          formData: x,
          body: g,
          formMethod: m.method || f,
          formEncType: m.encType || _,
          flushSync: m.flushSync
        });
      } else
        await d(m.action || p, {
          defaultShouldRevalidate: m.defaultShouldRevalidate,
          preventScrollReset: m.preventScrollReset,
          formData: x,
          body: g,
          formMethod: m.method || f,
          formEncType: m.encType || _,
          replace: m.replace,
          state: m.state,
          fromRouteId: r,
          flushSync: m.flushSync,
          viewTransition: m.viewTransition
        });
    },
    [o, d, i, r]
  );
}
function o0(n, { relative: i } = {}) {
  let { basename: r } = v.useContext(hn), o = v.useContext($n);
  it(o, "useFormAction must be used inside a RouteContext");
  let [d] = o.matches.slice(-1), h = { ...gi(n || ".", { relative: i }) }, m = Ft();
  if (n == null) {
    h.search = m.search;
    let p = new URLSearchParams(h.search), f = p.getAll("index");
    if (f.some((x) => x === "")) {
      p.delete("index"), f.filter((g) => g).forEach((g) => p.append("index", g));
      let x = p.toString();
      h.search = x ? `?${x}` : "";
    }
  }
  return (!n || n === ".") && d.route.index && (h.search = h.search ? h.search.replace(/^\?/, "?index&") : "?index"), r !== "/" && (h.pathname = h.pathname === "/" ? r : En([r, h.pathname])), _i(h);
}
function c0(n, { relative: i } = {}) {
  let r = v.useContext(P_);
  it(
    r != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?"
  );
  let { basename: o } = nb(
    "useViewTransitionState"
    /* useViewTransitionState */
  ), d = gi(n, { relative: i });
  if (!r.isTransitioning)
    return !1;
  let h = oa(r.currentLocation.pathname, o) || r.currentLocation.pathname, m = oa(r.nextLocation.pathname, o) || r.nextLocation.pathname;
  return to(d.pathname, m) != null || to(d.pathname, h) != null;
}
var u0 = L_();
function Br({
  label: n,
  empty: i = !1,
  onClick: r
}) {
  const o = /* @__PURE__ */ s.jsx("span", { className: `dsc-result-chip${i ? " is-empty" : ""}`, children: /* @__PURE__ */ s.jsx("span", { children: n }) });
  return r ? /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-result-chip-hit", onClick: r, children: o }) : o;
}
function a_(n) {
  return Array.from(
    n.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((i) => !i.hasAttribute("disabled") && i.tabIndex !== -1);
}
function qe({
  open: n,
  onDismiss: i,
  onConfirm: r,
  title: o,
  confirmLabel: d = "Confirm",
  help: h,
  children: m
}) {
  const p = v.useId(), f = v.useRef(null), _ = v.useRef(null);
  if (v.useEffect(() => {
    if (!n) return;
    _.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const g = document.querySelector(".dsc-shell");
    g instanceof HTMLElement && (g.inert = !0);
    const y = f.current;
    (y ? a_(y)[0] : null)?.focus();
    const N = (T) => {
      if (T.key === "Escape") {
        T.preventDefault(), i();
        return;
      }
      if (T.key !== "Tab" || !y) return;
      const E = a_(y);
      if (!E.length) return;
      const M = E[0], C = E[E.length - 1];
      T.shiftKey && document.activeElement === M ? (T.preventDefault(), C.focus()) : !T.shiftKey && document.activeElement === C && (T.preventDefault(), M.focus());
    };
    return window.addEventListener("keydown", N), () => {
      window.removeEventListener("keydown", N), g instanceof HTMLElement && (g.inert = !1), _.current?.focus?.();
    };
  }, [n, i]), !n) return null;
  const x = /* @__PURE__ */ s.jsxs("div", { className: "dsc-decision-root is-open", role: "presentation", children: [
    /* @__PURE__ */ s.jsx("div", { className: "dsc-decision-scrim", onClick: i }),
    /* @__PURE__ */ s.jsxs(
      "aside",
      {
        ref: f,
        className: "dsc-decision-panel",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": p,
        children: [
          /* @__PURE__ */ s.jsxs("header", { className: "dsc-decision-head", children: [
            /* @__PURE__ */ s.jsx("h2", { id: p, children: o }),
            /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-icon-btn", "aria-label": "Dismiss", onClick: i, children: /* @__PURE__ */ s.jsx(tn, { name: "close", size: 16 }) })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "dsc-decision-body", children: m }),
          h ? /* @__PURE__ */ s.jsx("div", { className: "dsc-decision-help", children: h }) : /* @__PURE__ */ s.jsx("div", { className: "dsc-decision-help is-empty" }),
          /* @__PURE__ */ s.jsxs("footer", { className: "dsc-decision-foot", children: [
            /* @__PURE__ */ s.jsx(ae, { onClick: i, children: "Dismiss" }),
            r ? /* @__PURE__ */ s.jsx(ae, { primary: !0, onClick: r, children: d }) : null
          ] })
        ]
      }
    )
  ] });
  return u0.createPortal(x, document.body);
}
const d0 = {
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
function h0(n) {
  return d0[n];
}
const ab = v.createContext(null), m0 = /* @__PURE__ */ new Set([
  "input_boolean",
  "input_number",
  "input_select",
  "input_text",
  "input_datetime",
  "input_button"
]);
function f0(n) {
  if (!n) return !1;
  const i = n.toLowerCase(), r = i.indexOf("."), o = r >= 0 ? i.slice(0, r) : "", d = r >= 0 ? i.slice(r + 1) : i;
  return d.startsWith("dsc_") || d.startsWith("dsc-") || d.includes("_dsc_") || i.includes("dsc_") || i.includes("dsc-") ? !0 : m0.has(o) ? d.startsWith("dsc_") || d.includes("dsc_") : i.startsWith("sensor.dsc") || i.startsWith("switch.dsc") || i.startsWith("binary_sensor.dsc") || i.startsWith("number.dsc") || i.startsWith("light.dsc") || i.startsWith("fan.dsc") || i.startsWith("select.dsc") || i.startsWith("text.dsc") || i.startsWith("datetime.dsc") || i.startsWith("time.dsc");
}
const p0 = 150;
function _0({
  hass: n,
  revision: i = 0,
  children: r
}) {
  const [o, d] = v.useState(0), h = v.useRef(null), m = v.useRef(n);
  m.current = n;
  const p = n?.connection, f = !!n, _ = () => {
    h.current || (h.current = setTimeout(() => {
      h.current = null, d((w) => w + 1);
    }, p0));
  };
  v.useEffect(() => {
    f && _();
  }, [f]), v.useEffect(() => {
    i > 0 && _();
  }, [i]), v.useEffect(() => {
    if (!p?.subscribeEvents) return;
    let w, N = !1;
    const T = (E) => {
      const M = E.data?.entity_id;
      f0(M) && _();
    };
    return Promise.resolve(p.subscribeEvents(T, "state_changed")).then((E) => {
      if (N) {
        E();
        return;
      }
      w = E;
    }).catch(() => {
    }), () => {
      N = !0, w?.(), h.current && (clearTimeout(h.current), h.current = null);
    };
  }, [p]);
  const x = v.useMemo(
    () => (w, N, T) => {
      const E = m.current;
      return E?.callService ? E.callService(w, N, T) : Promise.resolve(null);
    },
    []
  ), g = v.useMemo(
    () => (w) => {
      const N = m.current;
      if (N?.callWS) return N.callWS(w);
      const T = N?.connection;
      return T?.sendMessagePromise ? T.sendMessagePromise(w) : Promise.resolve(null);
    },
    []
  ), y = v.useMemo(() => {
    const w = (M) => m.current?.states?.[M], N = (M) => {
      const C = w(M)?.state;
      return C === void 0 ? !1 : C !== "unavailable" && C !== "unknown";
    }, T = (M, C = "—") => N(M) ? w(M)?.state ?? C : C, E = (M, C = NaN) => {
      if (!N(M)) return C;
      const U = Number(w(M)?.state);
      return Number.isFinite(U) ? U : C;
    };
    return { hass: m.current, entity: w, state: T, num: E, available: N, callService: x, callWS: g, tick: o };
  }, [o, x, g]);
  return v.createElement(ab.Provider, { value: y }, r);
}
function xi() {
  const n = v.useContext(ab);
  if (!n) throw new Error("useHass outside HassProvider");
  return n;
}
const sd = (n) => ({
  seat_id: n,
  online: !1,
  firmware: null,
  values: {},
  last_seen: null
}), Ua = {
  version: "7.0.0.0",
  surface: "7.0.0",
  expected_firmware: "7.0.0.0",
  hub: sd("hub"),
  panel: sd("panel"),
  pots: {},
  sonoffs: {},
  canopy: {},
  system: {},
  updated_at: 0
};
function Ur(n, i) {
  if (!n || typeof n != "object") return sd(i);
  const r = n;
  return {
    seat_id: String(r.seat_id ?? i),
    online: !!r.online,
    firmware: r.firmware != null ? String(r.firmware) : null,
    values: r.values ?? {},
    last_seen: typeof r.last_seen == "number" ? r.last_seen : null
  };
}
function sb(n) {
  if (!n) return { ...Ua };
  const i = {}, r = n.pots;
  if (r)
    for (const [m, p] of Object.entries(r))
      i[m] = Ur(p, m);
  const o = {}, d = n.sonoffs;
  if (d)
    for (const [m, p] of Object.entries(d))
      o[m] = Ur(p, m);
  const h = Array.isArray(n.inventory) ? n.inventory : void 0;
  return {
    version: String(n.version ?? Ua.version),
    surface: String(n.surface ?? Ua.surface),
    expected_firmware: String(n.expected_firmware ?? Ua.expected_firmware),
    hub: Ur(n.hub, "hub"),
    panel: Ur(n.panel, "panel"),
    pots: i,
    sonoffs: o,
    canopy: n.canopy ?? {},
    system: n.system ?? {},
    updated_at: typeof n.updated_at == "number" ? n.updated_at : 0,
    inventory: h
  };
}
function b0(n) {
  const i = n.hub.values;
  return {
    temp_c: i.temp_c != null ? Number(i.temp_c) : null,
    rh_pct: i.rh_pct != null ? Number(i.rh_pct) : null,
    vpd_kpa: i.vpd_kpa != null ? Number(i.vpd_kpa) : i.vd_kpa != null ? Number(i.vd_kpa) : null,
    heartbeat: i.heartbeat ?? null,
    uptime: i.uptime ?? null
  };
}
function g0(n, i) {
  const r = n.hub.values;
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
function rl(n, i, r = !1) {
  const o = n.inventory?.find((d) => d.seat_id === i);
  return o && o.in_service != null ? !!o.in_service : r;
}
const yd = {
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
  "binary_sensor.dsc_pot1_clock_valid": { seatId: "pot1", metric: "clock_valid", binary: !0 },
  "binary_sensor.dsc_pot2_clock_valid": { seatId: "pot2", metric: "clock_valid", binary: !0 },
  "binary_sensor.dsc_pot3_clock_valid": { seatId: "pot3", metric: "clock_valid", binary: !0 },
  "binary_sensor.dsc_pot4_clock_valid": { seatId: "pot4", metric: "clock_valid", binary: !0 },
  "binary_sensor.dsc_pot1_modbus_probe_online": { seatId: "pot1", metric: "modbus_probe_online", binary: !0 },
  "binary_sensor.dsc_pot2_modbus_probe_online": { seatId: "pot2", metric: "modbus_probe_online", binary: !0 },
  "binary_sensor.dsc_pot3_modbus_probe_online": { seatId: "pot3", metric: "modbus_probe_online", binary: !0 },
  "binary_sensor.dsc_pot4_modbus_probe_online": { seatId: "pot4", metric: "modbus_probe_online", binary: !0 },
  "binary_sensor.dsc_pot1_sensor_fault": { seatId: "pot1", metric: "sensor_fault", binary: !0 },
  "binary_sensor.dsc_pot2_sensor_fault": { seatId: "pot2", metric: "sensor_fault", binary: !0 },
  "binary_sensor.dsc_pot3_sensor_fault": { seatId: "pot3", metric: "sensor_fault", binary: !0 },
  "binary_sensor.dsc_pot4_sensor_fault": { seatId: "pot4", metric: "sensor_fault", binary: !0 },
  "switch.dsc_heater_main_relay": { seatId: "heater", metric: "relay_on", binary: !0 },
  "switch.dsc_heatmat_main_relay": { seatId: "heatmat", metric: "relay_on", binary: !0 },
  "switch.dsc_humidifier_main_relay": { seatId: "humidifier", metric: "relay_on", binary: !0 },
  "switch.dsc_de_humidifier_main_relay": { seatId: "dehumidifier", metric: "relay_on", binary: !0 }
};
function x0(n, i) {
  return i === "hub" ? n.hub.values : i === "panel" ? n.panel.values : i.startsWith("pot") ? n.pots[i]?.values : n.sonoffs[i]?.values;
}
function ao(n, i) {
  const r = yd[n];
  if (!r) return null;
  const o = x0(i, r.seatId);
  if (!o) return null;
  let d = o[r.metric];
  if (r.binary && r.seatId.startsWith("pot") && d == null && (d = o.binaries?.[r.metric]), d == null) return null;
  if (r.binary) return d === !0 || d === "on" || d === 1 || d === "1" ? 1 : 0;
  const h = Number(d);
  return Number.isFinite(h) ? h : null;
}
function jd(n, i) {
  const r = yd[n];
  return r ? r.seatId === "hub" ? i.hub.online : r.seatId === "panel" ? i.panel.online : r.seatId.startsWith("pot") ? !!i.pots[r.seatId]?.online : !!i.sonoffs[r.seatId]?.online : !1;
}
function v0(n) {
  return !n.hub.online;
}
const lb = {
  ac: "input_boolean.dsc_ac_in_service",
  mister: "input_boolean.dsc_clone_humidifier_in_service",
  pot1: "input_boolean.dsc_pot1_in_service",
  pot2: "input_boolean.dsc_pot2_in_service",
  pot3: "input_boolean.dsc_pot3_in_service",
  pot4: "input_boolean.dsc_pot4_in_service",
  tank: "input_boolean.dsc_tank_in_service"
}, ib = {
  heater: "sensor.dsc_heater_firmware_version",
  heatmat: "sensor.dsc_heatmat_firmware_version",
  humidifier: "sensor.dsc_humidifier_firmware_version",
  dehumidifier: "sensor.dsc_dehumidifier_firmware_version"
};
function Yt(n, i) {
  return n.states[i]?.state ?? "unavailable";
}
function $t(n, i) {
  const r = n.states[i]?.state;
  return r != null && r !== "unavailable" && r !== "unknown";
}
function Bt(n, i) {
  const r = Number(Yt(n, i));
  return Number.isFinite(r) ? r : null;
}
function y0(n, i) {
  if (!n) return { ...Ua, inventory: i };
  const o = $t(n, "binary_sensor.dsc_hub_link") && Yt(n, "binary_sensor.dsc_hub_link") === "on", d = {
    seat_id: "hub",
    online: o,
    firmware: $t(n, "sensor.dsc_hub_firmware_version") ? Yt(n, "sensor.dsc_hub_firmware_version") : null,
    values: {
      temp_c: Bt(n, "sensor.dsc_hub_tent_temperature") ?? Bt(n, "sensor.dsc_hub_temperature"),
      rh_pct: Bt(n, "sensor.dsc_hub_tent_humidity") ?? Bt(n, "sensor.dsc_hub_humidity"),
      vpd_kpa: Bt(n, "sensor.dsc_hub_vpd_kpa") ?? Bt(n, "sensor.dsc_hub_vpd"),
      heartbeat: $t(n, "sensor.dsc_hub_heartbeat") ? Yt(n, "sensor.dsc_hub_heartbeat") : null,
      uptime: $t(n, "sensor.dsc_hub_uptime") ? Yt(n, "sensor.dsc_hub_uptime") : null
    },
    last_seen: o ? Date.now() / 1e3 : null
  }, h = $t(n, "binary_sensor.dsc_hub_panel_link") && Yt(n, "binary_sensor.dsc_hub_panel_link") === "on", m = {
    seat_id: "panel",
    online: h,
    firmware: $t(n, "sensor.dsc_control_firmware_version") ? Yt(n, "sensor.dsc_control_firmware_version") : null,
    values: {},
    last_seen: h ? Date.now() / 1e3 : null
  }, p = {};
  for (const y of [1, 2, 3, 4]) {
    const w = `pot${y}`, N = `sensor.dsc_pot${y}_firmware_version`, T = $t(n, N);
    p[w] = {
      seat_id: w,
      online: T,
      firmware: T ? Yt(n, N) : null,
      values: {
        moisture_pct: Bt(n, `sensor.dsc_pot${y}_got_moisture`) ?? Bt(n, `sensor.dsc_pot${y}_soil_moisture`),
        soil_temp_c: Bt(n, `sensor.dsc_pot${y}_soil_temperature`),
        ec_us: Bt(n, `sensor.dsc_pot${y}_got_ec`) ?? Bt(n, `sensor.dsc_pot${y}_soil_conductivity`) ?? Bt(n, `sensor.dsc_pot${y}_soil_ec`),
        ph: Bt(n, `sensor.dsc_pot${y}_got_ph`) ?? Bt(n, `sensor.dsc_pot${y}_soil_ph`)
      },
      last_seen: T ? Date.now() / 1e3 : null
    };
  }
  const f = {}, _ = {
    heater: "switch.dsc_heater_main_relay",
    heatmat: "switch.dsc_heatmat_main_relay",
    humidifier: "switch.dsc_humidifier_main_relay",
    dehumidifier: "switch.dsc_de_humidifier_main_relay"
  };
  for (const [y, w] of Object.entries(_)) {
    const N = ib[y], T = $t(n, w) || $t(n, N);
    f[y] = {
      seat_id: y,
      online: T,
      firmware: N && $t(n, N) ? Yt(n, N) : null,
      values: {
        relay_on: $t(n, w) ? Yt(n, w) === "on" : null
      },
      last_seen: T ? Date.now() / 1e3 : null
    };
  }
  const x = i ?? Object.entries(lb).map(([y, w]) => ({
    seat_id: y,
    in_service: $t(n, w) ? Yt(n, w) === "on" : !1
  })), g = {};
  return $t(n, "sensor.dsc_canopy_temperature") && (g.temp_c = Bt(n, "sensor.dsc_canopy_temperature")), $t(n, "sensor.dsc_canopy_humidity") && (g.rh_pct = Bt(n, "sensor.dsc_canopy_humidity")), {
    version: Yt(n, "sensor.dsc_fleet_version_status") || Ua.version,
    surface: Yt(n, "sensor.dsc_ha_surface_version") || Ua.surface,
    expected_firmware: Ua.expected_firmware,
    hub: d,
    panel: m,
    pots: p,
    sonoffs: f,
    canopy: g,
    system: {
      appliance_link: $t(n, "binary_sensor.dsc_pi_appliance_link") && Yt(n, "binary_sensor.dsc_pi_appliance_link") === "on",
      reduced_kit: $t(n, "binary_sensor.dsc_reduced_kit") && Yt(n, "binary_sensor.dsc_reduced_kit") === "on"
    },
    updated_at: Date.now() / 1e3,
    inventory: x
  };
}
function j0(n) {
  const i = {}, r = (p, f, _ = !0) => {
    i[p] = {
      entity_id: p,
      state: _ ? f : "unavailable",
      attributes: {},
      last_changed: (/* @__PURE__ */ new Date()).toISOString()
    };
  }, o = n.hub.values;
  r("binary_sensor.dsc_hub_link", n.hub.online ? "on" : "off", !0), r("binary_sensor.dsc_hub_panel_link", n.panel.online ? "on" : "off", !0), o.temp_c != null && (r("sensor.dsc_hub_tent_temperature", String(o.temp_c), n.hub.online), r("sensor.dsc_hub_temperature", String(o.temp_c), n.hub.online)), o.rh_pct != null && (r("sensor.dsc_hub_tent_humidity", String(o.rh_pct), n.hub.online), r("sensor.dsc_hub_humidity", String(o.rh_pct), n.hub.online)), o.vpd_kpa != null && (r("sensor.dsc_hub_vpd_kpa", String(o.vpd_kpa), n.hub.online), r("sensor.dsc_hub_vpd", String(o.vpd_kpa), n.hub.online)), o.heartbeat != null && r("sensor.dsc_hub_heartbeat", String(o.heartbeat), n.hub.online), o.uptime != null && r("sensor.dsc_hub_uptime", String(o.uptime), n.hub.online), n.hub.firmware && r("sensor.dsc_hub_firmware_version", n.hub.firmware, n.hub.online), n.panel.firmware && r("sensor.dsc_control_firmware_version", n.panel.firmware, n.panel.online), r("sensor.dsc_ha_surface_version", n.surface), r("sensor.dsc_fleet_version_status", n.version), r("sensor.dsc_active_alert_count", "0"), r("binary_sensor.dsc_pi_appliance_link", n.system.appliance_link ? "on" : "off", !0), r("binary_sensor.dsc_reduced_kit", n.system.reduced_kit ? "on" : "off", !0);
  const d = n.hub.online;
  if (o.room_temp_c != null && r("sensor.dsc_hub_room_temperature", String(o.room_temp_c), d), o.room_rh_pct != null && r("sensor.dsc_hub_room_humidity", String(o.room_rh_pct), d), o.room_temp_c != null && o.room_rh_pct != null) {
    const p = w0(Number(o.room_temp_c), Number(o.room_rh_pct));
    Number.isFinite(p) && (r("sensor.dsc_hub_room_vpd_kpa", p.toFixed(2), d), r("sensor.dsc_hub_room_vpd", p.toFixed(2), d));
  }
  o.clone_temp_c != null && r("sensor.dsc_hub_clone_temperature", String(o.clone_temp_c), d), o.clone_rh_pct != null && r("sensor.dsc_hub_clone_humidity", String(o.clone_rh_pct), d), o.clone_vpd_kpa != null && (r("sensor.dsc_hub_clone_vpd_kpa", String(o.clone_vpd_kpa), d), r("sensor.dsc_hub_clone_vpd", String(o.clone_vpd_kpa), d));
  const h = o.binaries;
  if (h)
    for (const [p, f] of Object.entries(h))
      r(p, f ? "on" : "off", d);
  for (const [p, f] of Object.entries(lb)) {
    const _ = S0(n, p);
    r(f, _ ? "on" : "off");
  }
  for (const [p, f] of Object.entries(n.pots)) {
    const _ = p.replace("pot", ""), x = f.online, g = f.values.moisture_pct;
    if (g != null) {
      const E = String(g);
      r(`sensor.dsc_pot${_}_soil_moisture`, E, x), r(`sensor.dsc_pot${_}_got_moisture`, E, x);
    }
    const y = f.values.soil_temp_c;
    y != null && r(`sensor.dsc_pot${_}_soil_temperature`, String(y), x);
    const w = f.values.ec_us;
    w != null && (r(`sensor.dsc_pot${_}_soil_ec`, String(w), x), r(`sensor.dsc_pot${_}_soil_conductivity`, String(w), x), r(`sensor.dsc_pot${_}_got_ec`, String(w), x));
    const N = f.values.ph;
    N != null && (r(`sensor.dsc_pot${_}_soil_ph`, String(N), x), r(`sensor.dsc_pot${_}_got_ph`, String(N), x)), f.firmware && r(`sensor.dsc_pot${_}_firmware_version`, f.firmware, x);
    const T = f.values.binaries;
    T && (T.clock_valid != null && r(`binary_sensor.dsc_pot${_}_clock_valid`, T.clock_valid ? "on" : "off", x), T.modbus_probe_online != null && r(
      `binary_sensor.dsc_pot${_}_modbus_probe_online`,
      T.modbus_probe_online ? "on" : "off",
      x
    ), T.sensor_fault != null && r(`binary_sensor.dsc_pot${_}_sensor_fault`, T.sensor_fault ? "on" : "off", x));
  }
  for (const [p, f] of Object.entries(n.sonoffs)) {
    const x = {
      heater: "switch.dsc_heater_main_relay",
      heatmat: "switch.dsc_heatmat_main_relay",
      humidifier: "switch.dsc_humidifier_main_relay",
      dehumidifier: "switch.dsc_de_humidifier_main_relay"
    }[p];
    x && f.values.relay_on != null && r(x, f.values.relay_on ? "on" : "off", f.online);
    const g = ib[p];
    g && f.firmware && r(g, f.firmware, f.online);
  }
  const m = n.hub.values.controls;
  if (m)
    for (const [p, f] of Object.entries(m)) {
      const _ = {};
      f.options?.length && (_.options = f.options), f.percentage != null && (_.percentage = f.percentage), f.brightness != null && (_.brightness = f.brightness), i[p] = {
        entity_id: p,
        state: n.hub.online ? f.state : "unavailable",
        attributes: _,
        last_changed: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
  return i;
}
function w0(n, i) {
  if (!Number.isFinite(n) || !Number.isFinite(i) || i <= 0) return NaN;
  const r = 0.6108 * Math.exp(17.27 * n / (n + 237.3)), o = r * (i / 100);
  return r - o;
}
function S0(n, i) {
  return rl(n, i, !1);
}
function k0(n, i) {
  if (!i) return n;
  const r = { ...n.hub.values }, o = { ...n.pots };
  for (const [d, h] of Object.entries(yd)) {
    const m = i[d];
    if (!m || m.state === "unavailable" || m.state === "unknown") continue;
    const p = m.state, f = Number(p);
    if (!Number.isFinite(f) && h.binary !== !0) continue;
    const _ = h.binary ? p === "on" || p === "1" || p === "true" : f;
    if (h.seatId === "hub") {
      r[h.metric] == null && (r[h.metric] = _);
      continue;
    }
    if (h.seatId.startsWith("pot")) {
      const x = o[h.seatId];
      if (!x || x.values[h.metric] != null) continue;
      o[h.seatId] = {
        ...x,
        values: { ...x.values, [h.metric]: _ }
      };
    }
  }
  return {
    ...n,
    hub: { ...n.hub, values: r },
    pots: o
  };
}
const rb = v.createContext(null);
function N0({
  children: n,
  fleetRaw: i,
  hass: r,
  tick: o = 0,
  source: d,
  loading: h = !1,
  error: m = null,
  refresh: p,
  inventory: f
}) {
  const _ = v.useMemo(() => {
    if (d === "pi" && i) {
      let g = sb(i);
      const y = i.hass_states;
      return g = k0(g, y), Array.isArray(i?.inventory) ? { ...g, inventory: i.inventory } : f?.length ? { ...g, inventory: f } : g;
    }
    return y0(r ?? null, f);
  }, [d, i, r, f, o]), x = v.useMemo(
    () => ({ fleet: _, tick: o, source: d, loading: h, error: m, refresh: p }),
    [_, o, d, h, m, p]
  );
  return /* @__PURE__ */ s.jsx(rb.Provider, { value: x, children: n });
}
function wd() {
  const n = v.useContext(rb);
  if (!n) throw new Error("useFleet outside FleetProvider");
  return n;
}
function Ot() {
  return wd().fleet;
}
function C0() {
  return wd().tick;
}
function ua() {
  return wd().source;
}
function ob() {
  const n = Ot();
  return { ...b0(n), online: n.hub.online };
}
function T0(n) {
  const i = Ot();
  return { ...g0(i, n), online: i.hub.online };
}
function Sd(n) {
  const i = n.hub.values.controls;
  if (!(!i || typeof i != "object"))
    return i;
}
function Ir(n, i) {
  return i.hub.online ? Sd(i)?.[n]?.state ?? null : null;
}
function cb(n, i) {
  return i.hub.online && !!Sd(i)?.[n];
}
function ub(n, i) {
  const r = Sd(i)?.[n];
  if (!r) return {};
  const o = {};
  return r.options?.length && (o.options = r.options), r.percentage != null && (o.percentage = r.percentage), r.brightness != null && (o.brightness = r.brightness), o;
}
function Me() {
  const n = xi(), i = Ot(), r = ua(), o = v.useMemo(
    () => r === "pi" ? j0(i) : null,
    [r, i]
  );
  return v.useMemo(() => r !== "pi" ? n : { ...n, entity: (f) => {
    const _ = n.entity(f);
    if (_) return _;
    const x = Ir(f, i);
    return x != null ? {
      entity_id: f,
      state: x,
      attributes: ub(f, i),
      last_changed: (/* @__PURE__ */ new Date()).toISOString()
    } : o?.[f];
  }, available: (f) => cb(f, i) || jd(f, i) ? !0 : n.available(f), state: (f, _ = "—") => {
    const x = Ir(f, i);
    if (x != null) return x;
    const g = ao(f, i);
    return g != null && Number.isFinite(g) ? String(g) : n.state(f, _);
  }, num: (f, _ = NaN) => {
    const x = Ir(f, i);
    if (x != null) {
      const y = Number(x);
      if (Number.isFinite(y)) return y;
    }
    const g = ao(f, i);
    return g != null && Number.isFinite(g) ? g : n.num(f, _);
  } }, [n, i, r, o]);
}
async function E0(n, i = 6) {
  const r = await fetch(`/history?entity_id=${encodeURIComponent(n)}&hours=${i}`);
  return r.ok ? (await r.json()).points ?? [] : [];
}
async function M0(n = 24, i = 100) {
  const r = await fetch(`/grow-log?hours=${n}&limit=${i}`);
  return r.ok ? (await r.json()).events ?? [] : [];
}
async function R0(n, i, r = {}) {
  const o = await fetch("/control/service", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain: n, service: i, data: r })
  });
  if (!o.ok) {
    const d = await o.text();
    throw new Error(d || "service call failed");
  }
  return o.json();
}
async function A0(n, i) {
  const r = await fetch("/control/demand", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ seat: n, on: i })
  });
  if (!r.ok) {
    const o = await r.text();
    throw new Error(o || "demand call failed");
  }
  return r.json();
}
async function O0() {
  const n = await fetch("/fleet");
  if (!n.ok) throw new Error("fleet fetch failed");
  return n.json();
}
async function z0() {
  const n = await fetch("/settings");
  if (!n.ok) throw new Error("settings fetch failed");
  return n.json();
}
async function Yu(n) {
  if (!(await fetch("/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ settings: n })
  })).ok) throw new Error("settings patch failed");
}
async function ld(n, i) {
  const r = await fetch(`/settings/inventory/${n}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(i)
  });
  if (!r.ok) throw new Error("inventory patch failed");
  return r.json();
}
async function D0() {
  const n = await fetch("/settings/network");
  if (!n.ok) throw new Error("network status failed");
  return n.json();
}
async function L0() {
  const n = await fetch("/settings/network/apply", { method: "POST" });
  if (!n.ok) throw new Error("network apply failed");
  return n.json();
}
async function Xu() {
  const n = await fetch("/settings/catalog/status");
  if (!n.ok) throw new Error("catalog status failed");
  return n.json();
}
async function H0() {
  const n = await fetch("/admin/reload-catalogs", { method: "POST" });
  if (!n.ok) throw new Error("catalog reload failed");
  return n.json();
}
async function $0() {
  const n = await fetch("/settings/esphome/devices");
  if (!n.ok) throw new Error("esphome devices failed");
  return n.json();
}
async function B0(n, i) {
  const r = await fetch("/settings/esphome/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ seat_id: n, action: i })
  });
  if (!r.ok) throw new Error("esphome job failed");
  return r.json();
}
async function U0() {
  const n = await fetch("/settings/esphome/jobs");
  if (!n.ok) throw new Error("esphome jobs failed");
  return (await n.json()).jobs;
}
async function F0() {
  return (await fetch("/settings/integrations/test-ollama", { method: "POST" })).json();
}
async function G0() {
  return (await fetch("/settings/integrations/test-cannalib", { method: "POST" })).json();
}
async function V0(n) {
  await fetch("/settings/zigbee/permit-join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enabled: n })
  });
}
async function q0() {
  const n = await fetch("/settings/zigbee/devices");
  if (!n.ok) throw new Error("zigbee devices failed");
  return n.json();
}
async function Y0() {
  const n = await fetch("/settings/zigbee/health");
  if (!n.ok) throw new Error("zigbee health failed");
  return n.json();
}
async function db(n, i, r) {
  const o = await fetch(`/settings/calibration/${encodeURIComponent(n)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cal_type: i, steps: r })
  });
  if (!o.ok) throw new Error("calibration save failed");
  return o.json();
}
function X0() {
  return "/settings/backup/export";
}
async function Q0(n) {
  const i = new FormData();
  i.append("file", n);
  const r = await fetch("/settings/backup/import", { method: "POST", body: i });
  if (!r.ok) throw new Error("backup import failed");
  return r.json();
}
async function P0() {
  const n = await fetch("/settings/global-modifiers");
  if (!n.ok) throw new Error("global modifiers fetch failed");
  return (await n.json()).modifiers;
}
async function Z0(n) {
  const i = await fetch("/settings/global-modifiers", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(n)
  });
  if (!i.ok) throw new Error("global modifiers patch failed");
  return (await i.json()).modifiers;
}
async function kd() {
  const n = await fetch("/settings/probe-stations");
  if (!n.ok) throw new Error("probe stations fetch failed");
  return (await n.json()).stations ?? [];
}
async function K0(n, i) {
  const r = await fetch(`/settings/probe-stations/${encodeURIComponent(n)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(i)
  });
  if (!r.ok) throw new Error("probe station patch failed");
  return r.json();
}
async function J0(n) {
  const i = await fetch("/soil-tests/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(n)
  });
  if (!i.ok) {
    const r = await i.text();
    throw new Error(r || "soil test start failed");
  }
  return i.json();
}
async function I0(n) {
  const i = await fetch(`/soil-tests/${encodeURIComponent(n)}`);
  if (!i.ok) throw new Error("soil test poll failed");
  return i.json();
}
async function W0(n) {
  const i = await fetch(`/soil-tests/${encodeURIComponent(n)}/confirm`, { method: "POST" });
  if (!i.ok) {
    const r = await i.text();
    throw new Error(r || "soil test confirm failed");
  }
  return i.json();
}
async function e1(n) {
  const i = await fetch(`/soil-tests/${encodeURIComponent(n)}/cancel`, { method: "POST" });
  if (!i.ok) throw new Error("soil test cancel failed");
  return i.json();
}
const t1 = {
  heater: "switch.dsc_hub_heater_demand",
  heatmat: "switch.dsc_hub_grow_mat_demand",
  humidifier: "switch.dsc_hub_humidifier_demand",
  dehumidifier: "switch.dsc_hub_dehumidifier_demand",
  ac: "switch.dsc_hub_ac_demand",
  clone_humidifier: "switch.dsc_hub_clone_humidifier_demand"
};
function Gt() {
  const n = xi(), i = ua(), r = v.useCallback(
    async (d, h, m) => i === "pi" ? R0(d, h, m ?? {}) : n.callService(d, h, m),
    [n, i]
  ), o = v.useCallback(
    async (d, h) => {
      if (i === "pi")
        return A0(d, h);
      const m = t1[d];
      return n.callService("switch", h ? "turn_on" : "turn_off", { entity_id: m });
    },
    [n, i]
  );
  return { callService: r, setDemand: o };
}
function ul(n) {
  const { state: i, available: r, entity: o } = xi(), d = Ot();
  if (ua() === "pi") {
    const m = Ir(n, d);
    if (m != null)
      return {
        state: m,
        available: cb(n, d),
        attributes: ub(n, d)
      };
  }
  return {
    state: i(n, "unavailable"),
    available: r(n),
    attributes: o(n)?.attributes ?? {}
  };
}
function tn({
  name: n,
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
      dangerouslySetInnerHTML: { __html: h0(n) }
    }
  );
}
function ie({
  title: n,
  children: i,
  className: r = "",
  style: o,
  icon: d
}) {
  return /* @__PURE__ */ s.jsxs("section", { className: `dsc-card ${r}`.trim(), style: o, children: [
    n ? /* @__PURE__ */ s.jsxs("h3", { className: "dsc-card-title", children: [
      d ? /* @__PURE__ */ s.jsx(tn, { name: d, size: 14, color: "var(--dsc-teal)" }) : null,
      n
    ] }) : null,
    i
  ] });
}
function ae({
  children: n,
  primary: i,
  teal: r,
  variant: o,
  onClick: d,
  type: h = "button",
  disabled: m
}) {
  const p = ["dsc-btn"];
  if (i && p.push("primary"), r && p.push("teal"), o)
    switch (o) {
      case "primary":
        p.push("dsc-btn-primary");
        break;
      case "secondary":
        p.push("dsc-btn-secondary");
        break;
      case "danger":
        p.push("dsc-btn-danger");
        break;
    }
  return /* @__PURE__ */ s.jsx("button", { type: h, className: p.join(" "), onClick: d, disabled: m, children: n });
}
function At({
  label: n,
  value: i,
  unit: r,
  sub: o,
  tone: d = "normal",
  stale: h,
  onClick: m
}) {
  const p = (() => {
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
  })(), f = /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsxs("div", { className: `dsc-kpi-value ${p}`.trim(), children: [
      i,
      r ? /* @__PURE__ */ s.jsx("span", { className: "dsc-kpi-unit", children: r }) : null,
      h ? /* @__PURE__ */ s.jsx("span", { className: "dsc-held-tag", children: "HELD" }) : null
    ] }),
    o ? /* @__PURE__ */ s.jsx("div", { className: "dsc-kpi-sub", children: o }) : null
  ] });
  return m ? /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-kpi-hit", onClick: m, title: `History · ${n}`, children: /* @__PURE__ */ s.jsx(ie, { title: n, className: h ? "is-stale" : void 0, children: f }) }) : /* @__PURE__ */ s.jsx(ie, { title: n, className: h ? "is-stale" : void 0, children: f });
}
function zt({
  title: n,
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
      r ? /* @__PURE__ */ s.jsx(tn, { name: r, size: 22, color: "var(--dsc-teal)" }) : null,
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("h1", { className: "dsc-page-title", children: n }),
        i ? /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: i }) : null
      ] })
    ] }),
    h
  ] });
}
function z({
  label: n,
  tone: i = "muted",
  pulse: r,
  motion: o,
  icon: d,
  onClick: h
}) {
  const m = o ?? (r ? "pulse" : void 0), p = `dsc-chip dsc-chip--${i}${m ? ` dsc-chip--${m}` : ""}`, f = o === "fan" ? /* @__PURE__ */ s.jsx(tn, { name: "fan", size: 11, className: "dsc-fan-spin" }) : d ? /* @__PURE__ */ s.jsx(tn, { name: d, size: 11 }) : null;
  return h ? /* @__PURE__ */ s.jsxs("button", { type: "button", className: `${p} is-clickable`, onClick: h, children: [
    f,
    n
  ] }) : /* @__PURE__ */ s.jsxs("span", { className: p, children: [
    f,
    n
  ] });
}
function St({
  entityId: n,
  label: i,
  warnWhenMissing: r,
  icon: o,
  showBrightness: d,
  confirm: h
}) {
  const { state: m, available: p, attributes: f } = ul(n), { callService: _ } = Gt(), [x, g] = v.useState(!1), y = m === "on", w = p, N = n.split(".")[0], T = () => {
    if (w) {
      if (N === "switch" || N === "input_boolean") {
        _(N, y ? "turn_off" : "turn_on", { entity_id: n });
        return;
      }
      N === "light" && _("light", y ? "turn_off" : "turn_on", { entity_id: n });
    }
  }, E = () => {
    if (!(!w && !r)) {
      if (h) {
        g(!0);
        return;
      }
      T();
    }
  }, M = h === !0 ? {
    title: y ? `Turn off ${i}` : `Turn on ${i}`,
    body: `This writes ${n} on the hub immediately.`,
    confirmLabel: y ? "Turn off" : "Turn on"
  } : h ? {
    title: h.title ?? (y ? `Turn off ${i}` : `Turn on ${i}`),
    body: h.body ?? `This writes ${n} on the hub immediately.`,
    confirmLabel: h.confirmLabel ?? (y ? "Turn off" : "Turn on")
  } : null, C = d !== !1 && N === "light" && y ? Math.round(Number(f?.brightness ?? 0) / 255 * 100) : null;
  return /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsxs(
      "button",
      {
        type: "button",
        className: `dsc-demand${y ? " is-on" : ""}${w ? "" : " is-missing"}`,
        onClick: E,
        disabled: !w && !r,
        title: w ? n : r || `${n} unavailable`,
        children: [
          o ? /* @__PURE__ */ s.jsx(tn, { name: o, size: 22, color: "var(--dsc-teal)", className: "dsc-demand-icon" }) : null,
          /* @__PURE__ */ s.jsx("span", { className: "dsc-demand-label", children: i }),
          /* @__PURE__ */ s.jsx("span", { className: "dsc-demand-state", children: w ? C != null ? `${C}%` : y ? "ON" : "OFF" : r || "—" })
        ]
      }
    ),
    M ? /* @__PURE__ */ s.jsx(
      qe,
      {
        open: x,
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
function Fa({
  entityId: n,
  label: i,
  icon: r
}) {
  const { state: o, available: d, attributes: h } = ul(n), { callService: m } = Gt(), p = d, f = o, _ = h?.options || [], x = n.split(".")[0], [g, y] = v.useState(!1), w = v.useRef(!1), [N, T] = v.useState(f);
  v.useEffect(() => {
    !w.current && !g && T(f);
  }, [f, g, n]);
  const E = (C) => {
    T(C), y(!1), !(!p || !C) && (x === "select" ? m("select", "select_option", { entity_id: n, option: C }) : x === "input_select" && m("input_select", "select_option", { entity_id: n, option: C }));
  }, M = g ? N : f;
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-entity-select${p ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ s.jsxs("span", { className: "dsc-entity-select-label", children: [
      r ? /* @__PURE__ */ s.jsx(tn, { name: r, size: 13, color: "var(--dsc-teal)" }) : null,
      i
    ] }),
    /* @__PURE__ */ s.jsxs(
      "select",
      {
        value: M,
        disabled: !p,
        onFocus: () => {
          w.current = !0, y(!0);
        },
        onBlur: () => {
          w.current = !1, y(!1);
        },
        onChange: (C) => E(C.target.value),
        children: [
          !_.includes(M) && M ? /* @__PURE__ */ s.jsx("option", { value: M, children: M }) : null,
          _.map((C) => /* @__PURE__ */ s.jsx("option", { value: C, children: C }, C))
        ]
      }
    )
  ] });
}
function Ga({
  entityId: n,
  label: i,
  disabled: r
}) {
  const { available: o, attributes: d, state: h } = ul(n), { callService: m } = Gt(), p = o, f = Number(d?.percentage ?? 0), _ = h === "on", x = r || !p, [g, y] = v.useState(!1), w = v.useRef(!1), [N, T] = v.useState(Number.isFinite(f) ? f : 0);
  v.useEffect(() => {
    !w.current && !g && Number.isFinite(f) && T(f);
  }, [f, g, n]);
  const E = (C) => {
    x || m("fan", "set_percentage", { entity_id: n, percentage: C });
  }, M = g ? N : Number.isFinite(f) ? f : 0;
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-fan-slider${x ? " is-disabled" : ""}`, children: [
    /* @__PURE__ */ s.jsxs("span", { className: "dsc-fan-slider-label", children: [
      i,
      /* @__PURE__ */ s.jsx("strong", { children: p ? `${Math.round(M)}%` : "—" }),
      !_ && p ? /* @__PURE__ */ s.jsx("em", { className: "dsc-muted", children: "off" }) : null
    ] }),
    /* @__PURE__ */ s.jsx(
      "input",
      {
        type: "range",
        min: 0,
        max: 100,
        step: 1,
        value: M,
        disabled: x,
        onPointerDown: (C) => {
          C.target.setPointerCapture(C.pointerId), w.current = !0, y(!0);
        },
        onPointerUp: (C) => {
          w.current = !1, y(!1), E(Number(C.target.value));
        },
        onPointerCancel: () => {
          w.current = !1, y(!1);
        },
        onLostPointerCapture: () => {
          w.current = !1, y(!1);
        },
        onChange: (C) => {
          const U = Number(C.target.value);
          T(U), w.current || E(U);
        }
      }
    )
  ] });
}
function Nd(n) {
  return !n || n === "unknown" || n === "unavailable" ? "" : n;
}
function Wr({
  entityId: n,
  label: i,
  multiline: r = !1,
  rows: o = 2
}) {
  const { available: d, state: h } = Me(), { callService: m } = Gt(), p = d(n), f = Nd(h(n, "")), [_, x] = v.useState(f), g = v.useRef(!1);
  v.useEffect(() => {
    g.current || x(f);
  }, [f]);
  const y = () => {
    p && m("input_text", "set_value", { entity_id: n, value: _ });
  }, w = {
    value: _,
    disabled: !p,
    onFocus: () => {
      g.current = !0;
    },
    onChange: (N) => x(N.target.value),
    onBlur: () => {
      g.current = !1, y();
    },
    onKeyDown: (N) => {
      N.key === "Enter" && !r && N.currentTarget.blur();
    }
  };
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-target-num${p ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ s.jsx("span", { className: "dsc-target-num-label", children: i }),
    r ? /* @__PURE__ */ s.jsx("textarea", { rows: o, ...w }) : /* @__PURE__ */ s.jsx("input", { type: "text", ...w })
  ] });
}
function n1(n) {
  const i = Nd(n);
  return i ? i.slice(0, 5) : "";
}
function a1(n) {
  return n ? n.length === 5 ? `${n}:00` : n : "00:00:00";
}
function s_({ entityId: n, label: i }) {
  const { available: r, state: o } = Me(), { callService: d } = Gt(), h = r(n), m = n1(o(n, "")), [p, f] = v.useState(m), _ = v.useRef(!1);
  v.useEffect(() => {
    _.current || f(m);
  }, [m]);
  const x = () => {
    !h || !p || d("time", "set_value", { entity_id: n, time: a1(p) });
  };
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-target-num${h ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ s.jsx("span", { className: "dsc-target-num-label", children: i }),
    /* @__PURE__ */ s.jsx(
      "input",
      {
        type: "time",
        value: p,
        disabled: !h,
        onFocus: () => {
          _.current = !0;
        },
        onChange: (g) => f(g.target.value),
        onBlur: () => {
          _.current = !1, x();
        }
      }
    )
  ] });
}
function s1({ entityId: n, label: i }) {
  const { available: r, entity: o, state: d } = Me(), { callService: h } = Gt(), m = r(n), p = !!o(n)?.attributes?.has_time, f = Nd(d(n, "")), _ = (N) => N ? p ? N.slice(0, 16).replace(" ", "T") : N.slice(0, 10) : "", [x, g] = v.useState(_(f)), y = v.useRef(!1);
  v.useEffect(() => {
    y.current || g(_(f));
  }, [f, p]);
  const w = () => {
    if (!m || !x) return;
    const N = p ? x.replace("T", " ") : x;
    p ? h("input_datetime", "set_datetime", { entity_id: n, datetime: N }) : h("input_datetime", "set_datetime", { entity_id: n, date: x });
  };
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-target-num${m ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ s.jsx("span", { className: "dsc-target-num-label", children: i }),
    /* @__PURE__ */ s.jsx(
      "input",
      {
        type: p ? "datetime-local" : "date",
        value: x,
        disabled: !m,
        onFocus: () => {
          y.current = !0;
        },
        onChange: (N) => g(N.target.value),
        onBlur: () => {
          y.current = !1, w();
        }
      }
    )
  ] });
}
class hb extends v.Component {
  constructor() {
    super(...arguments);
    ci(this, "state", { error: null });
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
function l1(n) {
  const i = [], r = (m, p = "unknown") => n.state(m, p), o = (m) => r(m) === "on", d = n.entity?.("sensor.dsc_keepup_gaps")?.attributes ?? {}, h = String(d.full_auto_honesty ?? "").trim();
  if (n.available && n.available("binary_sensor.dsc_hub_link") && !o("binary_sensor.dsc_hub_link") && i.push({
    id: "hub-link",
    label: "Hub link down",
    detail: "The hub link is down — readings are held at their last known values.",
    tone: "bad",
    href: "/fleet",
    cta: "Open Fleet",
    priority: 9
  }), n.available && !n.available("sensor.dsc_hub_uptime")) {
    const m = n.entity?.("sensor.dsc_hub_uptime")?.last_changed;
    let p = "";
    if (m) {
      const f = Date.now() - Date.parse(m);
      if (Number.isFinite(f) && f >= 0) {
        const _ = Math.floor(f / 6e4);
        p = _ < 60 ? ` · offline ${Math.max(1, _)}m` : ` · offline ${(_ / 60).toFixed(1)}h`;
      }
    }
    i.push({
      id: "hub-dark",
      label: "Hub offline",
      detail: `Showing last good vitals${p}. Reconnect snaps to live.`,
      tone: "bad",
      href: "/fleet",
      cta: "Open Fleet",
      priority: 10
    });
  }
  if (n.available && !n.available("sensor.dsc_hub_heartbeat") && i.push({
    id: "beat-dark",
    label: "Heartbeat missing",
    detail: "The hub's heartbeat has stopped arriving — readings stay held until it returns.",
    tone: "bad",
    href: "/live/mission",
    cta: "Mission",
    priority: 12
  }), n.available && !n.available("binary_sensor.dsc_hub_panel_link") && i.push({
    id: "panel-dark",
    label: "Panel link down",
    detail: "The control panel link is down — Mission shows how long it has been out.",
    tone: "warn",
    href: "/fleet",
    cta: "Open Fleet",
    priority: 14
  }), o("binary_sensor.dsc_reduced_kit")) {
    const m = n.entity?.("binary_sensor.dsc_reduced_kit")?.attributes ?? {}, p = String(m.offline ?? "").trim();
    i.push({
      id: "reduced-kit",
      label: "Capacity offline",
      detail: p || "A device that should be running is temporarily out of service or locked out.",
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
  }), i.sort((m, p) => m.priority - p.priority);
}
function i1(n, i) {
  const r = [];
  return n.hub.online || (r.push({
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
  })), n.hub.online && n.hub.values.heartbeat == null && r.push({
    id: "beat-dark",
    label: "Heartbeat missing",
    detail: "The hub's heartbeat has stopped arriving — readings stay held until it returns.",
    tone: "bad",
    href: "/live/mission",
    cta: "Mission",
    priority: 12
  }), n.panel.online || r.push({
    id: "panel-dark",
    label: "Panel link down",
    detail: "The control panel link is down — Mission shows how long it has been out.",
    tone: "warn",
    href: "/fleet",
    cta: "Open Fleet",
    priority: 14
  }), n.system.reduced_kit && r.push({
    id: "reduced-kit",
    label: "Capacity offline",
    detail: "A device that should be running is temporarily out of service or locked out.",
    tone: "warn",
    href: "/fleet",
    cta: "Review kit",
    priority: 20
  }), i && r.push(...l1(i).filter(
    (o) => !["hub-link", "hub-dark", "beat-dark", "panel-dark", "reduced-kit"].includes(o.id)
  )), r.sort((o, d) => o.priority - d.priority);
}
function r1(n) {
  return n[0] ?? null;
}
function mb() {
  const n = Me(), i = Ot();
  return v.useMemo(
    () => i1(i, {
      state: n.state,
      available: n.available,
      entity: n.entity
    }),
    [i, n.state, n.available, n.entity, n.tick]
  );
}
function o1({ gaps: n }) {
  const i = mb(), r = n ?? i, [o, d] = v.useState(null), h = gt();
  return r.length ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsx("div", { className: "dsc-honesty-rail", "aria-label": "Honesty gaps", children: r.slice(0, 6).map((m) => /* @__PURE__ */ s.jsx(
      "button",
      {
        type: "button",
        className: "dsc-honesty-hit",
        onClick: () => d(m),
        children: /* @__PURE__ */ s.jsx(z, { icon: "alert", label: m.label, tone: m.tone === "bad" ? "bad" : "warn" })
      },
      m.id
    )) }),
    /* @__PURE__ */ s.jsx(
      qe,
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
  ] }) : /* @__PURE__ */ s.jsx("div", { className: "dsc-honesty-rail", "aria-label": "Honesty", children: /* @__PURE__ */ s.jsx(z, { icon: "ok", label: "Kit honest", tone: "ok" }) });
}
function c1({ gaps: n }) {
  const i = mb(), o = r1(n ?? i), d = gt();
  return o ? /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass dsc-next-rec", title: "Do this next", icon: "alert", children: [
    /* @__PURE__ */ s.jsxs("p", { style: { margin: "0 0 8px" }, children: [
      /* @__PURE__ */ s.jsx("strong", { children: o.label }),
      " — ",
      o.detail
    ] }),
    /* @__PURE__ */ s.jsx(ae, { primary: !0, onClick: () => d(o.href), children: o.cta })
  ] }) : /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass dsc-next-rec", title: "Next", icon: "ok", children: [
    /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: "No critical gaps — fly Live or open Twin." }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", children: [
      /* @__PURE__ */ s.jsx(ae, { primary: !0, onClick: () => d("/live/twin"), children: "Open Twin" }),
      /* @__PURE__ */ s.jsx(ae, { teal: !0, onClick: () => d("/live/climate"), children: "Climate Want" })
    ] })
  ] });
}
const ra = "7.2.0", u1 = !1, _o = [
  `/local/DSC-HUB.js?v=${ra}`,
  `/hacsfiles/DSC-HUB/DSC-HUB.js?v=${ra}`
], fb = `/local/vendor/three.min.js?v=${ra}`, pb = `/local/vendor/dsc-dash-fx.js?v=${ra}`, _b = {
  "dsc-catalog-browse-card": [`/local/dsc-catalog-browse-card.js?v=${ra}`],
  "dsc-build-plant-card": [`/local/dsc-build-plant-card.js?v=${ra}`],
  "dsc-the-dash-card": [fb, pb, `/local/dsc-the-dash-card.js?v=${ra}`],
  "dsc-airflow-map-card": [`/local/dsc-airflow-map-card.js?v=${ra}`],
  "dsc-system-map-card": [`/local/dsc-system-map-card.js?v=${ra}`, ..._o]
};
function mi() {
  return typeof globalThis.THREE < "u";
}
const Fr = /* @__PURE__ */ new Map();
function eo(n) {
  if (document.querySelector(`script[data-dsc-autoload="${n}"]`))
    return Fr.get(n) ?? Promise.resolve();
  if (Fr.has(n)) return Fr.get(n);
  const r = new Promise((o, d) => {
    const h = document.createElement("script");
    h.src = n, h.async = !0, h.dataset.dscAutoload = n, h.onload = () => o(), h.onerror = () => d(new Error(`Failed to load ${n}`)), document.head.appendChild(h);
  });
  return Fr.set(n, r), r;
}
function d1(n) {
  const i = _b[n] ?? [], r = [];
  for (const o of [...i, ..._o])
    r.includes(o) || r.push(o);
  return r;
}
async function l_() {
  if (mi()) return !0;
  for (const n of [fb, ..._o])
    if (n) {
      try {
        await eo(n);
      } catch {
      }
      if (mi()) return !0;
    }
  return mi();
}
async function bb(n, i = 12e3) {
  if (n === "dsc-the-dash-card" && (await l_(), mi()))
    try {
      await eo(pb);
    } catch {
    }
  const r = _b[n] ?? [];
  for (const o of r)
    if (o)
      try {
        await eo(o);
      } catch {
      }
  if (n === "dsc-the-dash-card" && !mi() && await l_(), customElements.get(n)) return !0;
  for (const o of _o) {
    try {
      await eo(o);
    } catch {
    }
    if (customElements.get(n)) return !0;
  }
  try {
    return await Promise.race([
      customElements.whenDefined(n),
      new Promise(
        (o, d) => window.setTimeout(() => d(new Error("timeout")), i)
      )
    ]), !!customElements.get(n);
  } catch {
    return !!customElements.get(n);
  }
}
function h1(n) {
  return d1(n).map((i) => i.split("?")[0]);
}
function m1(n) {
  return u1;
}
const Cd = [
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
], gb = new Map(Cd.map((n) => [n.id, n])), vi = Cd[2];
function xb(n) {
  return `input_select.dsc_pot${n}_vessel`;
}
function f1(n) {
  const i = String(n || "").trim();
  return gb.has(i) ? i : vi.id;
}
function id(n, i) {
  const r = gb.get(f1(n)) ?? vi;
  return Number.isFinite(i) && i > 0 ? { ...r, volumeL: i } : r;
}
function Ya(n, i, r) {
  const o = xb(n), d = i(o, "");
  if (d && d !== "unknown" && d !== "unavailable")
    return id(d);
  const h = r?.("sensor.dsc_plant_roster_summary")?.attributes?.slots;
  if (Array.isArray(h)) {
    const m = h.find((p) => String(p.pot) === String(n));
    if (m?.vessel) return id(m.vessel);
  }
  return vi;
}
function p1(n) {
  switch (n) {
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
      return n;
  }
}
const i_ = [
  "var(--dsc-soil-1)",
  "var(--dsc-soil-2)",
  "var(--dsc-soil-3)",
  "var(--dsc-soil-4)"
];
function r_(n) {
  switch (n) {
    case "bag":
      return "M18 8 Q18 4 32 4 L68 4 Q82 4 82 8 L86 88 Q86 96 50 96 Q14 96 14 88 Z";
    case "taper":
      return "M24 6 L76 6 L88 92 Q88 98 50 98 Q12 98 12 92 Z";
    case "tall":
      return "M28 4 L72 4 L78 94 Q78 98 50 98 Q22 98 22 94 Z";
    case "airpot":
      return "M26 6 L74 6 L84 90 Q84 96 50 96 Q16 96 16 90 Z";
    default:
      return n;
  }
}
function Hn({
  spec: n,
  layers: i = [],
  size: r = 56,
  label: o
}) {
  const d = `vclip-${n.id}-${n.silhouette}`, h = i.reduce((p, f) => p + f.pct, 0) || 1;
  let m = 0;
  return /* @__PURE__ */ s.jsxs("span", { className: "dsc-vessel-glyph", title: n.label, children: [
    /* @__PURE__ */ s.jsxs("svg", { width: r, height: r * 1.15, viewBox: "0 0 100 100", "aria-hidden": !0, children: [
      /* @__PURE__ */ s.jsx("defs", { children: /* @__PURE__ */ s.jsx("clipPath", { id: d, children: /* @__PURE__ */ s.jsx("path", { d: r_(n.silhouette) }) }) }),
      /* @__PURE__ */ s.jsx(
        "path",
        {
          d: r_(n.silhouette),
          fill: "rgba(8,12,10,0.85)",
          stroke: p1(n.material),
          strokeWidth: "2.4",
          strokeDasharray: n.silhouette === "airpot" ? "5 3" : void 0
        }
      ),
      /* @__PURE__ */ s.jsx("g", { clipPath: `url(#${d})`, children: i.map((p, f) => {
        const _ = p.pct / h * 88, x = 96 - m - _;
        return m += _, /* @__PURE__ */ s.jsx(
          "rect",
          {
            x: "12",
            y: x,
            width: "76",
            height: _,
            fill: p.color || i_[f % i_.length]
          },
          `${p.name}-${f}`
        );
      }) })
    ] }),
    o ? /* @__PURE__ */ s.jsxs("span", { className: "dsc-vessel-glyph-label", children: [
      n.volumeL,
      "L"
    ] }) : null
  ] });
}
function Td({
  label: n,
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
      "aria-label": n,
      title: n,
      "aria-expanded": d,
      onClick: r,
      children: /* @__PURE__ */ s.jsx(tn, { name: i, size: 16 })
    }
  );
}
function _1(n) {
  return n instanceof Element ? !!n.closest(
    "ha-more-info-dialog, ha-dialog, ha-more-info-info, .ha-more-info, home-assistant-dialog"
  ) : !1;
}
function bo({
  items: n,
  label: i = "More actions"
}) {
  const [r, o] = v.useState(!1), d = v.useRef(null);
  return v.useEffect(() => {
    if (!r) return;
    const h = (p) => {
      _1(p.target) || d.current?.contains(p.target) || o(!1);
    }, m = (p) => {
      p.key === "Escape" && o(!1);
    };
    return document.addEventListener("mousedown", h), window.addEventListener("keydown", m), () => {
      document.removeEventListener("mousedown", h), window.removeEventListener("keydown", m);
    };
  }, [r]), /* @__PURE__ */ s.jsxs("div", { className: "dsc-overflow", ref: d, children: [
    /* @__PURE__ */ s.jsx(
      Td,
      {
        label: i,
        icon: "more",
        expanded: r,
        onClick: () => o((h) => !h)
      }
    ),
    r ? /* @__PURE__ */ s.jsx("div", { className: "dsc-overflow-menu", role: "menu", children: n.map((h) => /* @__PURE__ */ s.jsx(
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
function o_(n) {
  return Array.from(
    n.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((i) => !i.hasAttribute("disabled") && i.tabIndex !== -1);
}
function Xa({
  open: n,
  onClose: i,
  title: r,
  side: o = "right",
  children: d
}) {
  const h = v.useId(), m = v.useRef(null), p = v.useRef(null);
  return v.useEffect(() => {
    if (!n) return;
    p.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const f = m.current;
    (f ? o_(f)[0] : null)?.focus();
    const x = (g) => {
      if (g.key === "Escape") {
        g.preventDefault(), i();
        return;
      }
      if (g.key !== "Tab" || !f) return;
      const y = o_(f);
      if (!y.length) return;
      const w = y[0], N = y[y.length - 1];
      g.shiftKey && document.activeElement === w ? (g.preventDefault(), N.focus()) : !g.shiftKey && document.activeElement === N && (g.preventDefault(), w.focus());
    };
    return window.addEventListener("keydown", x), () => {
      window.removeEventListener("keydown", x), p.current?.focus?.();
    };
  }, [n, i]), /* @__PURE__ */ s.jsxs(
    "div",
    {
      className: `dsc-drawer-root${n ? " is-open" : ""}`,
      "aria-hidden": !n,
      inert: n ? void 0 : !0,
      children: [
        /* @__PURE__ */ s.jsx("div", { className: "dsc-drawer-scrim", onClick: i }),
        /* @__PURE__ */ s.jsxs(
          "aside",
          {
            ref: m,
            className: `dsc-drawer-panel ${o}`,
            role: "dialog",
            "aria-modal": n ? "true" : void 0,
            "aria-labelledby": h,
            "aria-hidden": !n,
            inert: n ? void 0 : !0,
            hidden: n ? void 0 : !0,
            children: [
              n ? /* @__PURE__ */ s.jsx(
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
                /* @__PURE__ */ s.jsx(Td, { label: "Close", icon: "close", onClick: i })
              ] }),
              /* @__PURE__ */ s.jsx("div", { className: "dsc-drawer-body", children: d })
            ]
          }
        )
      ]
    }
  );
}
function b1(n) {
  if (!n || !n.trim()) return [];
  const i = n.split(/[|/·]/).map((o) => o.trim()).filter(Boolean), r = [];
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
function g1({
  layers: n,
  valid: i,
  emptyLabel: r = "No blend on roster seat",
  spec: o
}) {
  const d = o ?? vi, h = n.reduce((p, f) => p + f.pct, 0), m = i ?? (n.length > 0 && Math.round(h) === 100);
  return n.length ? /* @__PURE__ */ s.jsx("div", { className: `dsc-soil${m ? " is-valid" : ""}`, children: /* @__PURE__ */ s.jsx(Hn, { spec: d, layers: n, size: 180, label: !0 }) }) : /* @__PURE__ */ s.jsxs("div", { className: "dsc-soil", children: [
    /* @__PURE__ */ s.jsx(Hn, { spec: d, size: 160 }),
    /* @__PURE__ */ s.jsx("div", { className: "dsc-soil-empty", children: r })
  ] });
}
function Ut(n, i = "—") {
  return !n || n === "unknown" || n === "unavailable" || n === "none" ? i : n;
}
function vb(n) {
  const i = String(n || "").trim().toLowerCase();
  return i === "clone" || i === "2x4" || i === "2×4" ? "clone" : i === "main" || i === "4x8" || i === "4×8" ? "main" : "unassigned";
}
function so(n, i) {
  return vb(n(`input_select.dsc_pot${i}_tent`, "unassigned"));
}
function go(n) {
  switch (n) {
    case "clone":
      return "2×4";
    case "main":
      return "4×8";
    case "unassigned":
      return "Unassigned";
    default:
      return n;
  }
}
function _s(n, i) {
  const { state: r, entity: o } = i, d = o("sensor.dsc_plant_roster_summary")?.attributes?.slots || [], h = Array.isArray(d) ? d.find((f) => String(f.pot) === String(n)) : void 0, m = (f, _) => {
    const x = Ut(r(f, ""));
    return x !== "—" ? x : Ut(r(_, ""));
  }, p = Ut(h?.blend, "");
  return {
    pot: n,
    plantName: Ut(r(`text.dsc_pot${n}_plant_name`, "")),
    strainDisplay: Ut(r(`sensor.dsc_pot${n}_strain_display`, "")),
    sprout: Ut(r(`datetime.dsc_pot${n}_sprout_date`, ""), "—").slice(0, 10),
    days: Ut(r(`sensor.dsc_pot${n}_days_since_sprout`, "")),
    stage: Ut(r(`sensor.dsc_pot${n}_expected_stage`, "")),
    growthStage: Ut(r(`select.dsc_pot${n}_growth_stage`, "")),
    tent: so(r, n),
    blend: p,
    recipe: Ut(h?.recipe, ""),
    notes: Ut(h?.notes, ""),
    layers: b1(p),
    moisture: m(`sensor.dsc_pot${n}_got_moisture`, `sensor.dsc_pot${n}_soil_moisture`),
    soilTemp: Ut(r(`sensor.dsc_pot${n}_soil_temperature`, "")),
    ec: m(`sensor.dsc_pot${n}_got_ec`, `sensor.dsc_pot${n}_soil_conductivity`),
    ph: m(`sensor.dsc_pot${n}_got_ph`, `sensor.dsc_pot${n}_soil_ph`),
    n: Ut(r(`sensor.dsc_pot${n}_soil_nitrogen`, "")),
    p: Ut(r(`sensor.dsc_pot${n}_soil_phosphorus`, "")),
    k: Ut(r(`sensor.dsc_pot${n}_soil_potassium`, "")),
    need: Ut(r(`sensor.dsc_pot${n}_need_summary`, "")),
    rosterSlot: h?.slot ?? null
  };
}
function Sn(n, i, r) {
  const o = `sensor.dsc_pot${n}_got_${i}`, d = i === "moisture" ? `sensor.dsc_pot${n}_soil_moisture` : i === "ec" ? `sensor.dsc_pot${n}_soil_conductivity` : `sensor.dsc_pot${n}_soil_ph`, h = r(o, "");
  return h && h !== "unavailable" && h !== "unknown" ? o : d;
}
function yb(n, i, r) {
  return Ed(i).map((o) => _s(o, { state: i, entity: r })).filter((o) => o.tent === n && o.plantName !== "—" && o.plantName.trim() !== "");
}
const ca = [1, 2, 3, 4];
function nn(n, i) {
  const r = `input_boolean.dsc_pot${n}_in_service`, o = i(r, "off");
  return o === "unavailable" || o === "unknown" || o === "" ? !1 : o === "on";
}
function Ed(n, i = [...ca]) {
  return i.filter((r) => nn(r, n));
}
function x1(n, i = [...ca]) {
  return { inService: Ed(n, i).length, total: i.length };
}
function jb(n) {
  const i = n("sensor.dsc_plant_roster_summary")?.attributes?.slots;
  return Array.isArray(i) ? i : [];
}
function xo(n, i) {
  const r = nn(n, i), o = i(`binary_sensor.dsc_pot${n}_sensor_stuck`) === "on", d = i(`binary_sensor.dsc_pot${n}_untrusted`) === "on", h = i("sensor.dsc_peer_divergence_summary", ""), m = r && h !== "—" && h !== "ok" && h.toLowerCase() !== "none" && h !== "unknown" && h !== "unavailable" && h.length > 0 && h !== "0", p = [];
  o && p.push("stuck"), d && p.push("untrusted"), m && p.push("peer divergence");
  let f = "ok";
  return d || o ? f = "bad" : m && (f = "warn"), {
    stuck: o,
    untrusted: d,
    peerDivergence: m,
    blockNeedAct: d || o,
    tone: f,
    labels: p
  };
}
function Qu(n, i) {
  return !Number.isFinite(n) || !Number.isFinite(i) ? NaN : 6.112 * Math.exp(17.67 * n / (n + 243.5)) * i * 2.1674 / (273.15 + n);
}
function v1(n) {
  return n === "/live/main" || n === "/live/4x8" ? "main" : n === "/live/clone" || n === "/live/2x4" ? "clone" : null;
}
function y1(n) {
  return n === "/live/twin" || n === "/ops/dash" || n === "/live/main" || n === "/live/clone" || n === "/live/4x8" || n === "/live/2x4";
}
function j1() {
  const n = Ft(), { hass: i, available: r, num: o, state: d, entity: h, tick: m } = Me(), p = v.useRef(null), f = v.useRef(null), [_, x] = v.useState("loading"), g = v1(n.pathname), y = n.pathname === "/live/twin" || n.pathname === "/ops/dash", w = y || n.pathname === "/live/main" || n.pathname === "/live/clone" || n.pathname === "/live/4x8" || n.pathname === "/live/2x4", N = r("binary_sensor.dsc_hub_link") ? d("binary_sensor.dsc_hub_link") !== "on" : !r("sensor.dsc_hub_uptime");
  return v.useEffect(() => {
    const T = p.current;
    if (!T || f.current) return;
    let E = !1;
    return (async () => {
      x("loading");
      const M = await bb("dsc-the-dash-card");
      if (E || !p.current) return;
      if (!M) {
        x("missing");
        return;
      }
      const C = document.createElement("dsc-the-dash-card");
      typeof C.setConfig == "function" && C.setConfig({ type: "custom:dsc-the-dash-card" }), i && (C.hass = i), T.appendChild(C), f.current = C, x("ready");
    })(), () => {
      E = !0;
    };
  }, []), v.useEffect(() => {
    f.current && i && (f.current.hass = i);
  }, [i, m]), v.useEffect(() => {
    const T = f.current;
    T && (T.setFocusTent?.(g), T.setUiChrome?.({ hideHud: y1(n.pathname) }));
  }, [g, n.pathname, _]), v.useEffect(() => {
    const T = f.current, E = () => {
      const M = !w || document.hidden;
      T?.pause?.(M);
    };
    return E(), document.addEventListener("visibilitychange", E), () => document.removeEventListener("visibilitychange", E);
  }, [w, _]), v.useEffect(() => {
    f.current?.setHeld?.(N);
  }, [N, _]), v.useEffect(() => {
    const T = f.current;
    if (!T?.setPots) return;
    const E = { clone: [], main: [] };
    ca.forEach((C) => {
      const U = so(d, C);
      (U === "clone" || U === "main") && E[U].push(C);
    });
    const M = ca.map((C) => {
      const U = _s(C, { state: d, entity: h }), G = Ya(C, d, h), X = xo(C, d), L = nn(C, d), V = so(d, C), te = V === "clone" || V === "main" ? Math.max(0, E[V].indexOf(C)) : 0;
      return {
        id: `pot${C}`,
        pot: C,
        tent: V,
        slot: te,
        inService: L,
        silhouette: G.silhouette,
        moisture: Number(U.moisture),
        ec: Number(U.ec),
        ph: Number(U.ph),
        soilT: Number(U.soilTemp),
        dryback: o(`sensor.dsc_pot${C}_dryback_pct`),
        need: U.need,
        held: N,
        untrusted: X.untrusted
      };
    });
    T.setPots(M);
  }, [d, h, o, N, _]), /* @__PURE__ */ s.jsxs(
    "div",
    {
      className: `dsc-twin-keepalive${y ? " is-active" : ""}`,
      "aria-hidden": !y,
      inert: y ? void 0 : !0,
      "data-status": _,
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
        /* @__PURE__ */ s.jsx("div", { className: "dsc-twin-keepalive-host", ref: p, style: y ? void 0 : { pointerEvents: "none" } }),
        _ === "missing" ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-empty", children: [
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
const w1 = "https://cannalib.plausible-deniability.net", S1 = {
  strain: "/local/dsc-catalog/dsc_strains_search_index.json",
  medium: "/local/dsc-catalog/dsc_mediums_search_index.json",
  nutrient: "/local/dsc-catalog/dsc_nutrients_search_index.json",
  light: "/local/dsc-catalog/dsc_lights_search_index.json"
}, k1 = {
  strain: "strains",
  medium: "mediums",
  nutrient: "nutrients",
  light: "lights"
};
function N1(n) {
  return (n("input_text.dsc_cannalib_base_url", "") || w1).replace(/\/$/, "");
}
function C1(n) {
  const i = { Accept: "application/json" }, r = n("input_text.dsc_cannalib_api_key", "");
  return r && r !== "unknown" && r !== "unavailable" && (i["X-Cannalib-Key"] = r), i;
}
function wb(n) {
  if (Array.isArray(n)) return n;
  if (n && typeof n == "object") {
    const i = n;
    if (Array.isArray(i.items)) return i.items;
    if (Array.isArray(i.strains)) return i.strains;
  }
  return [];
}
function Sb(n) {
  return String(n.name || n.id || "").trim();
}
function T1(n) {
  const i = String(n.kind ?? "").trim().toLowerCase();
  if (i && i !== "strain" && i !== "cultivar") return !1;
  const r = Sb(n), o = r.toLowerCase();
  return !(/\bcapsules?\b/.test(o) || /\brosin\b/.test(o) || /\blubricant\b/.test(o) || /\bthca\s+pebbles?\b/.test(o) || /\d+\s*mg\b/.test(o) || /^#+\s*\d+/.test(r.trim()));
}
function c_(n, i) {
  return n !== "strain" ? i : i.filter(T1);
}
function u_(n, i) {
  const r = i.trim().toLowerCase();
  if (!r || n.length < 2) return n;
  const o = (d) => {
    if (String(d.matched_via ?? "").toLowerCase() === "science_alias") return 0;
    const m = String(d.science_alias ?? "").toLowerCase();
    return m && m.split(/[,;/|]/).some((p) => p.trim() === r || p.trim().includes(r)) ? 1 : 2;
  };
  return [...n].sort((d, h) => o(d) - o(h));
}
async function E1(n, i) {
  const r = await fetch(S1[n], { cache: "no-store" });
  if (!r.ok) return [];
  const o = wb(await r.json()), d = i.trim().toLowerCase();
  return d ? o.filter((h) => Sb(h).toLowerCase().includes(d)) : o;
}
async function kb(n, i, r, o = 100) {
  try {
    const h = k1[n], m = `${N1(r)}/v1/catalogs/${h}?q=${encodeURIComponent(i || "")}&limit=${o}`, p = await fetch(m, { headers: C1(r), cache: "no-store" });
    if (!p.ok) throw new Error(`cannalib ${p.status}`);
    const f = u_(c_(n, wb(await p.json())), i);
    if (f.length || n === "strain")
      return {
        items: f,
        source: "cannalib",
        note: "CannaLib live"
      };
  } catch {
  }
  return {
    items: u_(c_(n, await E1(n, i)), i),
    source: "local",
    note: "CannaLib unreachable — local JSON index"
  };
}
function Nb({
  kind: n,
  onPick: i,
  placeholder: r
}) {
  const { state: o } = Me(), [d, h] = v.useState(""), [m, p] = v.useState([]), [f, _] = v.useState("local"), [x, g] = v.useState(""), [y, w] = v.useState(!1);
  v.useEffect(() => {
    let T = !1;
    const E = window.setTimeout(() => {
      w(!0), kb(n, d, o, 100).then((M) => {
        T || (p(M.items), _(M.source), g(M.note), w(!1));
      }).catch(() => {
        T || (p([]), g("Catalog search failed — try again."), w(!1));
      });
    }, 200);
    return () => {
      T = !0, window.clearTimeout(E);
    };
  }, [n, d]);
  const N = v.useMemo(() => m, [m]);
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-catalog-picker", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ s.jsx(
        z,
        {
          label: f === "cannalib" ? "Cannalib" : "Local JSON",
          tone: f === "cannalib" ? "ok" : "warn"
        }
      ),
      x ? /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", style: { fontSize: 12 }, children: x }) : null
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
      y && !N.length ? /* @__PURE__ */ s.jsx("li", { className: "dsc-muted", children: "Searching…" }) : null,
      !y && !N.length ? /* @__PURE__ */ s.jsx("li", { className: "dsc-muted", children: "No catalog hits — empty is honesty, not a placeholder." }) : null,
      N.map((T, E) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsxs("button", { type: "button", onClick: () => i(T), children: [
        /* @__PURE__ */ s.jsx("strong", { children: T.name }),
        T.type ? /* @__PURE__ */ s.jsx("em", { children: String(T.type) }) : null,
        T.breeder ? /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", children: String(T.breeder) }) : null
      ] }) }, `${T.id || T.name}-${E}`))
    ] })
  ] });
}
const ia = [1, 2, 3];
function Cb(n, i) {
  return ia.find((o) => !n[o] && o !== i) ?? ia.find((o) => !n[o]) ?? 3;
}
function Pu(n, i, r, o) {
  const d = Cb(o, n), h = ia.filter((g) => g !== n && g !== d), m = h.reduce((g, y) => g + (Number.isFinite(r[y]) ? Math.round(r[y]) : 0), 0), p = Math.max(0, 100 - m), f = Math.max(0, Math.min(p, Math.round(i))), _ = p - f, x = { ...r, [n]: f, [d]: _ };
  return h.forEach((g) => {
    x[g] = Math.round(Number.isFinite(r[g]) ? r[g] : 0);
  }), x;
}
function M1({ volumeL: n }) {
  const { state: i, num: r, available: o } = Me(), { callService: d } = Gt(), [h, m] = v.useState({ 1: !1, 2: !1, 3: !1 }), [p, f] = v.useState(null), [_, x] = v.useState(null), g = {
    1: r("input_number.dsc_blend_pct_1", 0),
    2: r("input_number.dsc_blend_pct_2", 0),
    3: r("input_number.dsc_blend_pct_3", 0)
  }, y = _ ?? g, w = ia.map((L) => ({
    n: L,
    name: i(`input_text.dsc_blend_component_${L}_name`, ""),
    pct: Number.isFinite(y[L]) ? y[L] : 0
  })), N = ia.filter((L) => h[L]).length, T = Cb(h), E = Number.isFinite(n) && n > 0 ? n : r("input_number.dsc_blend_total_l", 20), M = w.reduce((L, V) => L + (Number.isFinite(V.pct) ? V.pct : 0), 0), C = (L) => {
    ia.forEach((V) => {
      o(`input_number.dsc_blend_pct_${V}`) && d("input_number", "set_value", {
        entity_id: `input_number.dsc_blend_pct_${V}`,
        value: L[V]
      });
    });
  }, U = (L, V) => {
    const te = Pu(L, V, _ ?? y, h);
    x(null), f(null), C(te);
  }, G = (L) => {
    m((V) => {
      const te = { ...V, [L]: !V[L] };
      return ia.filter((se) => te[se]).length >= ia.length ? V : te;
    });
  }, X = v.useMemo(
    () => w.filter((L) => L.pct > 0 && L.name && L.name !== "unknown").map((L) => `${L.name} ${(E * L.pct / 100).toFixed(1)}L (${Math.round(L.pct)}%)`).join(" · "),
    [w, E]
  );
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-coupled-mix", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ s.jsx(z, { label: `Σ ${Math.round(M)}%`, tone: Math.round(M) === 100 ? "ok" : "warn" }),
      /* @__PURE__ */ s.jsx(z, { label: `${E} L vessel`, tone: "muted" }),
      /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", style: { fontSize: 12 }, children: "Lock the layers you want to keep — the remainder layer soaks up the rest so the total is always 100%." })
    ] }),
    ia.map((L) => {
      const V = w[L - 1], te = L === T && !h[L];
      return /* @__PURE__ */ s.jsxs("div", { className: "dsc-mix-row", children: [
        /* @__PURE__ */ s.jsx(Wr, { entityId: `input_text.dsc_blend_component_${L}_name`, label: `Layer ${L}` }),
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "range",
            min: 0,
            max: 100,
            value: Math.round(V.pct),
            disabled: h[L] || te,
            onPointerDown: (re) => {
              h[L] || te || (re.target.setPointerCapture(re.pointerId), f(L), x({ ...y }));
            },
            onPointerUp: (re) => {
              p === L && U(L, Number(re.target.value));
            },
            onPointerCancel: () => {
              x(null), f(null);
            },
            onLostPointerCapture: (re) => {
              p === L && U(L, Number(re.target.value));
            },
            onChange: (re) => {
              const se = Number(re.target.value);
              if (p === L) {
                x(Pu(L, se, _ ?? y, h));
                return;
              }
              C(Pu(L, se, y, h));
            }
          }
        ),
        /* @__PURE__ */ s.jsxs("strong", { children: [
          Math.round(V.pct),
          "%"
        ] }),
        /* @__PURE__ */ s.jsxs("span", { className: "dsc-mono", children: [
          (E * V.pct / 100).toFixed(1),
          " L"
        ] }),
        /* @__PURE__ */ s.jsx(ae, { disabled: N >= 2 && !h[L], onClick: () => G(L), children: h[L] ? "Unlock" : te ? "Remainder" : "Lock" })
      ] }, L);
    }),
    /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: [
      "Recipe: ",
      X || "Mix not set yet."
    ] })
  ] });
}
const Md = "sensor.dsc_hub_uptime", Tb = "sensor.dsc_hub_heartbeat";
function R1(n, i) {
  if (!i || n == null || n === "") return NaN;
  const r = n.trim().toLowerCase();
  if (r === "unavailable" || r === "unknown" || r === "none") return NaN;
  const o = Number(n);
  return Number.isFinite(o) ? o : NaN;
}
function we(n) {
  const { available: i, tick: r, entity: o } = Me(), d = Ot(), h = ua(), m = v.useRef(null), p = v.useRef(n), [, f] = v.useState(0);
  p.current !== n && (p.current = n, m.current = null);
  const _ = h === "pi" ? ao(n, d) : null, x = h === "pi" ? jd(n, d) : !1, g = h === "pi" ? v0(d) : !i(Md) || !i(Tb), y = h === "pi" && x || i(n), w = _ != null && Number.isFinite(_) ? _ : R1(o(n)?.state, y), N = g && w === 0;
  return v.useEffect(() => {
    if (y && Number.isFinite(w) && !N) {
      m.current = { value: w, at: Date.now() }, f((T) => T + 1);
      return;
    }
    f((T) => T + 1);
  }, [n, y, w, N, r, o]), y && Number.isFinite(w) && !N ? { value: w, stale: !1, heldAt: m.current?.at, live: !0 } : m.current != null ? {
    value: m.current.value,
    stale: !0,
    heldAt: m.current.at,
    live: !1
  } : { value: NaN, stale: !1, heldAt: void 0, live: !1 };
}
function Rd(n) {
  const { available: i, entity: r, tick: o } = Me(), d = Ot();
  if (ua() === "pi" && n === Md && d.hub.online || i(n)) return null;
  const m = r(n)?.last_changed;
  if (!m) return null;
  const p = Date.parse(m);
  return Number.isFinite(p) ? Date.now() - p : null;
}
function Eb() {
  const n = Ot(), i = ua(), r = Rd(Md);
  return i === "pi" && !n.hub.online && n.hub.last_seen ? Date.now() - n.hub.last_seen * 1e3 : r;
}
function Mb() {
  return Rd(Tb);
}
function Rb() {
  const n = Ot();
  return ua() === "pi" && !n.panel.online && n.panel.last_seen ? Date.now() - n.panel.last_seen * 1e3 : Rd("binary_sensor.dsc_hub_panel_link");
}
function Ad(n) {
  return !!n && Number.isFinite(n.min) && Number.isFinite(n.max) && n.max > n.min;
}
function yi(n) {
  if (n.available === !1 || !Number.isFinite(n.value)) return "muted";
  if (n.stale) return "stale";
  if (n.fault) return "critical";
  if (Ad(n.band)) {
    const i = n.margin ?? 0;
    if (n.value < n.band.min - i || n.value > n.band.max + i)
      return n.value < n.band.min - i * 3 || n.value > n.band.max + i * 3 ? "critical" : "warn";
  }
  return "ok";
}
function A1(n) {
  switch (n) {
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
      return n;
  }
}
function Od(n) {
  switch (n) {
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
      return n;
  }
}
function vo(n, i) {
  if (!Ad(n)) return;
  const r = i === "°C" ? 1 : 0.05;
  return Math.max((n.max - n.min) * 0.12, r);
}
const Ab = [
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
], Zu = {
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
function Gr(n, i) {
  const r = Number(n(i, ""));
  return Number.isFinite(r) && r > 0 ? r : NaN;
}
function d_(n) {
  if (!n || n === "—" || n === "Off" || n === "Custom") return null;
  const i = Zu[n];
  if (i) return i;
  const r = Object.keys(Zu).find((o) => n.indexOf(o) >= 0);
  return r ? Zu[r] : null;
}
function Ku(n, i) {
  return !Number.isFinite(i.min) || !Number.isFinite(i.max) ? n : n ? {
    min: Math.max(n.min, i.min),
    max: Math.min(n.max, i.max),
    source: n.source === "plant" || i.source === "plant" ? "plant" : "stage",
    mixed: n.source !== i.source || n.mixed
  } : { ...i, mixed: !1 };
}
function rd(n, i) {
  const r = yb(n, i.state, i.entity).filter((y) => nn(y.pot, i.state));
  let o = null, d = null, h = null, m = null;
  const p = [], f = [];
  let _ = !1;
  for (const y of r) {
    y.stage && y.stage !== "—" && (p.length && !p.includes(y.stage) && (_ = !0), p.includes(y.stage) || p.push(y.stage)), y.need && y.need !== "—" && y.need !== "ok" && !f.includes(y.need) && f.push(y.need);
    const w = Gr(i.state, `sensor.dsc_pot${y.pot}_want_temp_min`), N = Gr(i.state, `sensor.dsc_pot${y.pot}_want_temp_max`);
    Number.isFinite(w) && Number.isFinite(N) && (o = Ku(o, { min: w, max: N, source: "plant" }));
    const T = Gr(i.state, `sensor.dsc_pot${y.pot}_want_rh_min`), E = Gr(i.state, `sensor.dsc_pot${y.pot}_want_rh_max`);
    Number.isFinite(T) && Number.isFinite(E) && (d = Ku(d, { min: T, max: E, source: "plant" }));
    const M = d_(y.stage);
    M && (o || (o = { min: M.temp - 1.5, max: M.temp + 1.5, source: "stage", mixed: !1 }), d || (d = { min: M.rhMin, max: M.rhMax, source: "stage", mixed: !1 }), h = Ku(h, { min: M.vpdMin, max: M.vpdMax, source: "stage" }), m = m == null ? M.lightHours : Math.min(m, M.lightHours));
  }
  const x = n === "main" ? i.state("select.dsc_hub_grow_stage", "") : i.state("select.dsc_hub_clone_mode", "");
  if (!r.length || !o && !d && !h) {
    const y = n === "clone" ? x === "Clones & Seedlings" ? "Seedling" : x === "Mother" ? "Vegetative" : x === "Follow 4x8" ? i.state("select.dsc_hub_grow_stage", "") : "" : x, w = d_(y);
    w && (o || (o = { min: w.temp - 1.5, max: w.temp + 1.5, source: "stage", mixed: !1 }), d || (d = { min: w.rhMin, max: w.rhMax, source: "stage", mixed: !1 }), h || (h = { min: w.vpdMin, max: w.vpdMax, source: "stage", mixed: !1 }), m == null && (m = w.lightHours), y && !p.includes(y) && p.push(y));
  }
  return o && o.min > o.max && (o = { ...o, min: o.max, max: o.min, mixed: !0 }), d && d.min > d.max && (d = { ...d, min: d.max, max: d.min, mixed: !0 }), h && h.min > h.max && (h = { ...h, min: h.max, max: h.min, mixed: !0 }), {
    temp: o,
    rh: d,
    vpd: h,
    lightHours: m,
    mixed: _,
    stages: p,
    needs: f,
    emptyLabel: !o && !d && !h ? "no plant/stage rail" : null
  };
}
function Ba(n, i, r) {
  if (r) return { tone: "critical", label: "min > max" };
  if (!i) return { tone: "muted", label: "no plant/stage rail" };
  const o = yi({ value: n, band: i, margin: (i.max - i.min) * 0.12 }), d = i.source === "plant" ? "plant Want" : "stage rail";
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
function Ju(n, i, r) {
  const o = Number(r(`sensor.dsc_pot${n}_want_${i}_min`, "")), d = Number(r(`sensor.dsc_pot${n}_want_${i}_max`, ""));
  if (o > 0 && d > 0 && d >= o) return { min: o, max: d };
  if (i === "moisture") return { min: 0, max: 45 };
}
const h_ = 2e3, Ob = 300 * 1e3;
function zb(n, i = Date.now(), r) {
  if (!n.length) return [];
  const o = [...n].sort((m, p) => m.t - p.t), d = [];
  for (let m = 0; m < o.length; m++) {
    const p = o[m];
    if (!Number.isFinite(p.v)) continue;
    const f = d[d.length - 1];
    f && p.t - f.t > h_ && d.push({ t: p.t - 1, v: f.v }), d.push(p);
  }
  const h = d[d.length - 1];
  if (h && i - h.t > h_) {
    const m = i - h.t;
    (r?.markStale || m <= Ob) && d.push({ t: i, v: h.v });
  }
  return d;
}
const Vr = [
  "var(--dsc-neon)",
  "var(--dsc-teal)",
  "var(--dsc-amber)",
  "var(--dsc-gray-5)"
];
function m_(n) {
  const i = Math.max(...n, 1), r = 10 ** Math.floor(Math.log10(i));
  return Math.ceil(i / r) * r;
}
function f_(n, i = !1) {
  const r = Math.min(...n);
  if (i && r >= 0) return 0;
  const o = Math.abs(r) || 1, d = 10 ** Math.floor(Math.log10(o));
  return Math.floor(r / d) * d;
}
function p_(n, i, r = 0.08) {
  if (!Number.isFinite(n) || !Number.isFinite(i)) return { min: 0, max: 1 };
  if (i <= n) return { min: n - 1, max: i + 1 };
  const d = (i - n) * r || 1;
  return { min: n - d, max: i + d };
}
function lo(n, i, r, o, d, h, m, p) {
  const f = Math.max(h - d, 1e-6), _ = Math.max(p - m, 1), x = i - o.l - o.r, g = r - o.t - o.b;
  return {
    x: o.l + (n.t - m) / _ * x,
    y: o.t + (1 - (n.v - d) / f) * g
  };
}
function O1(n, i, r, o, d, h, m, p, f = !1) {
  return n.length ? n.map((_, x) => {
    const { x: g, y } = lo(_, i, r, o, d, h, m, p);
    if (x === 0) return `M${g.toFixed(1)} ${y.toFixed(1)}`;
    if (!f) return `L${g.toFixed(1)} ${y.toFixed(1)}`;
    const w = lo(n[x - 1], i, r, o, d, h, m, p);
    return `L${g.toFixed(1)} ${w.y.toFixed(1)} L${g.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ") : "";
}
function z1(n, i, r) {
  if (!i || !Number.isFinite(n)) return r;
  const o = Math.max(i.max - i.min, 1e-6), d = Math.max(o * 0.12, 0.05);
  return n < i.min - 3 * d || n > i.max + 3 * d ? "var(--dsc-bad)" : n < i.min - d || n > i.max + d ? "var(--dsc-amber)" : r;
}
function D1(n, i, r, o, d, h, m, p, f, _, x = !1) {
  if (n.length < 2) return [];
  const g = [];
  for (let y = 1; y < n.length; y++) {
    const w = n[y - 1], N = n[y], T = lo(w, i, r, o, d, h, m, p), E = lo(N, i, r, o, d, h, m, p), M = z1(N.v, f, _), C = x ? `M${T.x.toFixed(1)} ${T.y.toFixed(1)} L${E.x.toFixed(1)} ${T.y.toFixed(1)} L${E.x.toFixed(1)} ${E.y.toFixed(1)}` : `M${T.x.toFixed(1)} ${T.y.toFixed(1)} L${E.x.toFixed(1)} ${E.y.toFixed(1)}`, U = g[g.length - 1];
    U && U.color === M ? U.d += C.slice(1) : g.push({ d: C, color: M });
  }
  return g;
}
function __(n) {
  const i = new Date(n), r = String(i.getHours()).padStart(2, "0"), o = String(i.getMinutes()).padStart(2, "0");
  return `${r}:${o}`;
}
function ds(n, i, r, o, d) {
  const h = Math.max(r - i, 1e-6);
  return d.t + (1 - (n - i) / h) * (o - d.t - d.b);
}
function b_(n, i, r) {
  if (r?.min != null && r?.max != null) return { min: r.min, max: r.max };
  const o = n.filter((d) => (d.axis || "left") === i).flatMap((d) => d.series.map((h) => h.v));
  if (!o.length)
    return i === "right" ? { min: 0, max: 100 } : { min: 0, max: 1 };
  if (i === "right") {
    const d = Math.min(...o, 0);
    return Math.max(...o, 100) <= 100 && d >= 0 ? { min: 0, max: 100 } : p_(f_(o, !0), m_(o));
  }
  return p_(f_(o), m_(o));
}
function Tn({
  series: n,
  height: i = 180,
  unit: r = "",
  live: o = !0,
  emptyLabel: d = "thin recorder",
  lastSyncAt: h,
  targets: m = [],
  yDomain: p
}) {
  const f = v.useId().replace(/:/g, ""), _ = 640, x = n.some((S) => S.axis === "right"), g = { l: 40, r: x ? 40 : 14, t: 16, b: 28 }, y = v.useRef(null), [w, N] = v.useState(null), [T, E] = v.useState(!1), M = v.useMemo(() => {
    if (!n.length) return !1;
    const S = n.flatMap((J) => J.series);
    if (!S.length) return !1;
    const O = Math.max(...S.map((J) => J.t));
    return (h != null ? Date.now() - h : Date.now() - O) > Ob;
  }, [n, h]), C = v.useMemo(() => {
    const S = n.flatMap((Z) => Z.series);
    if (!S.length) return null;
    const O = b_(n, "left", p?.left), q = b_(n, "right", p?.right), J = Math.min(...S.map((Z) => Z.t)), I = Math.max(...S.map((Z) => Z.t)), k = M ? I : Math.max(I, Date.now()), $ = n.map((Z, ne) => {
      const de = Z.axis || "left", Q = de === "right" ? q : O, le = Z.color || Vr[ne % Vr.length];
      return {
        ...Z,
        axis: de,
        color: le,
        d: O1(Z.series, _, i, g, Q.min, Q.max, J, k, Z.step),
        segs: Z.ghost ? [] : D1(Z.series, _, i, g, Q.min, Q.max, J, k, Z.band, le, Z.step),
        last: Z.series.length ? Z.series[Z.series.length - 1] : null,
        ext: Ln(Z.series),
        dom: Q
      };
    });
    return { left: O, right: q, t0: J, t1: k, paths: $ };
  }, [n, i, x, p, M]), U = v.useMemo(() => {
    if (!C) return [];
    const S = 4, O = [];
    for (let q = 0; q <= S; q++) {
      const J = q / S, I = C.left.max - J * (C.left.max - C.left.min), k = g.t + J * (i - g.t - g.b);
      O.push({ y: k, label: I.toFixed(Math.abs(I) >= 100 ? 0 : 1) });
    }
    return O;
  }, [C, i]), G = v.useMemo(() => {
    if (!C || !x) return [];
    const S = 4, O = [];
    for (let q = 0; q <= S; q++) {
      const J = q / S, I = C.right.max - J * (C.right.max - C.right.min), k = g.t + J * (i - g.t - g.b);
      O.push({ y: k, label: I.toFixed(Math.abs(I) >= 100 ? 0 : 1) });
    }
    return O;
  }, [C, i, x]), X = v.useMemo(() => {
    if (!C) return [];
    const S = 5, O = [], q = Math.max(C.t1 - C.t0, 1), J = _ - g.l - g.r;
    for (let I = 0; I < S; I++) {
      const k = I / (S - 1), $ = C.t0 + k * q;
      O.push({ x: g.l + k * J, label: __($) });
    }
    return O;
  }, [C]), L = v.useCallback(
    (S) => {
      const O = y.current;
      if (!O || !C) return null;
      const q = O.getBoundingClientRect(), J = (S - q.left) / Math.max(q.width, 1) * _, I = _ - g.l - g.r, k = Math.min(_ - g.r, Math.max(g.l, J)), $ = (k - g.l) / Math.max(I, 1);
      return { t: C.t0 + $ * Math.max(C.t1 - C.t0, 1), x: k };
    },
    [C]
  ), V = (S) => {
    if (T) return;
    const O = L(S.clientX);
    O && N(O);
  }, te = () => {
    T || N(null);
  }, re = (S) => {
    const O = L(S.clientX);
    if (O) {
      if (T && w && Math.abs(w.x - O.x) < 8) {
        E(!1), N(null);
        return;
      }
      E(!0), N(O);
    }
  }, se = v.useMemo(() => !C || !w ? [] : C.paths.map((S) => {
    if (!S.series.length) return { id: S.id, label: S.label, color: S.color, v: null, unit: S.unit || "" };
    let O = S.series[0], q = Math.abs(O.t - w.t);
    for (const I of S.series) {
      const k = Math.abs(I.t - w.t);
      k < q && (O = I, q = k);
    }
    const J = ds(O.v, S.dom.min, S.dom.max, i, g);
    return {
      id: S.id,
      label: S.label,
      color: S.color,
      v: O.v,
      unit: S.unit || "",
      y: J,
      x: g.l + (O.t - C.t0) / Math.max(C.t1 - C.t0, 1) * (_ - g.l - g.r)
    };
  }), [C, w, i]), ce = C ? `${C.t0}-${C.t1}-${C.paths.map((S) => S.d).join("|")}` : "empty", me = Db(ce), oe = _ * 1.4, ge = Lb(oe, me), ue = C?.paths[0]?.last?.v ?? null;
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
            viewBox: `0 0 ${_} ${i}`,
            width: "100%",
            height: i,
            role: "img",
            "aria-label": "Live chart",
            className: "dsc-chart-svg",
            onPointerMove: V,
            onPointerLeave: te,
            onPointerDown: re,
            children: [
              /* @__PURE__ */ s.jsxs("defs", { children: [
                C?.paths.map((S) => /* @__PURE__ */ s.jsxs("linearGradient", { id: `fill-${f}-${S.id}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
                  /* @__PURE__ */ s.jsx("stop", { offset: "0%", stopColor: S.color, stopOpacity: "0.28" }),
                  /* @__PURE__ */ s.jsx("stop", { offset: "100%", stopColor: S.color, stopOpacity: "0" })
                ] }, S.id)),
                /* @__PURE__ */ s.jsxs("filter", { id: `glow-${f}`, x: "-40%", y: "-40%", width: "180%", height: "180%", children: [
                  /* @__PURE__ */ s.jsx("feGaussianBlur", { stdDeviation: "2.8", result: "b" }),
                  /* @__PURE__ */ s.jsxs("feMerge", { children: [
                    /* @__PURE__ */ s.jsx("feMergeNode", { in: "b" }),
                    /* @__PURE__ */ s.jsx("feMergeNode", { in: "SourceGraphic" })
                  ] })
                ] }),
                /* @__PURE__ */ s.jsxs("filter", { id: `glow-soft-${f}`, x: "-50%", y: "-50%", width: "200%", height: "200%", children: [
                  /* @__PURE__ */ s.jsx("feGaussianBlur", { stdDeviation: "4.2", result: "b" }),
                  /* @__PURE__ */ s.jsx("feMerge", { children: /* @__PURE__ */ s.jsx("feMergeNode", { in: "b" }) })
                ] })
              ] }),
              U.map((S) => /* @__PURE__ */ s.jsxs("g", { children: [
                /* @__PURE__ */ s.jsx(
                  "line",
                  {
                    x1: g.l,
                    x2: _ - g.r,
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
              G.map((S) => /* @__PURE__ */ s.jsx(
                "text",
                {
                  x: _ - g.r + 6,
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
              X.map((S) => /* @__PURE__ */ s.jsx(
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
              C ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
                m.map((S, O) => {
                  const q = S.axis || "left", J = q === "right" ? C.right : C.left, I = S.color || (q === "right" ? "var(--dsc-teal)" : "var(--dsc-amber)");
                  if (S.min != null && S.max != null) {
                    const $ = ds(S.max, J.min, J.max, i, g), Z = ds(S.min, J.min, J.max, i, g);
                    return /* @__PURE__ */ s.jsxs("g", { children: [
                      /* @__PURE__ */ s.jsx(
                        "rect",
                        {
                          x: g.l,
                          y: Math.min($, Z),
                          width: _ - g.l - g.r,
                          height: Math.abs(Z - $),
                          fill: I,
                          opacity: 0.08
                        }
                      ),
                      /* @__PURE__ */ s.jsx(
                        "line",
                        {
                          x1: g.l,
                          x2: _ - g.r,
                          y1: $,
                          y2: $,
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
                          x2: _ - g.r,
                          y1: Z,
                          y2: Z,
                          stroke: I,
                          strokeWidth: "1",
                          strokeDasharray: "4 4",
                          opacity: 0.7
                        }
                      )
                    ] }, `tg-${O}`);
                  }
                  if (S.value == null || !Number.isFinite(S.value)) return null;
                  const k = ds(S.value, J.min, J.max, i, g);
                  return /* @__PURE__ */ s.jsxs("g", { children: [
                    /* @__PURE__ */ s.jsx(
                      "line",
                      {
                        x1: g.l,
                        x2: _ - g.r,
                        y1: k,
                        y2: k,
                        stroke: I,
                        strokeWidth: "1.2",
                        strokeDasharray: "5 4",
                        opacity: 0.85
                      }
                    ),
                    S.label ? /* @__PURE__ */ s.jsx(
                      "text",
                      {
                        x: _ - g.r - 2,
                        y: k - 4,
                        textAnchor: "end",
                        fill: I,
                        fontSize: "8",
                        fontFamily: "var(--dsc-mono)",
                        children: S.label
                      }
                    ) : null
                  ] }, `tg-${O}`);
                }),
                C.paths.map((S) => {
                  if (!S.d || S.series.length === 0) return null;
                  const O = S.last, q = O && C ? g.l + (O.t - C.t0) / Math.max(C.t1 - C.t0, 1) * (_ - g.l - g.r) : 0, J = O ? ds(O.v, S.dom.min, S.dom.max, i, g) : 0, I = S.segs.length ? S.segs : [{ d: S.d, color: S.color }];
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
                        strokeDasharray: ge.dasharray,
                        strokeDashoffset: ge.dashoffset,
                        opacity: 0.55,
                        className: "dsc-chart-core"
                      }
                    ) : I.map((k, $) => /* @__PURE__ */ s.jsx(
                      "path",
                      {
                        d: k.d,
                        fill: "none",
                        stroke: k.color,
                        strokeWidth: 2.2,
                        strokeLinejoin: "round",
                        strokeLinecap: "round",
                        strokeDasharray: ge.dasharray,
                        strokeDashoffset: ge.dashoffset,
                        filter: `url(#glow-${f})`,
                        opacity: 0.95,
                        className: "dsc-chart-core"
                      },
                      `${S.id}-seg-${$}`
                    )),
                    o && O && !M ? /* @__PURE__ */ s.jsx("circle", { cx: q, cy: J, r: 3, fill: S.color, opacity: 0.9, className: "dsc-chart-tip" }) : null,
                    S.ext.min != null ? /* @__PURE__ */ s.jsxs(
                      "text",
                      {
                        x: g.l + 2,
                        y: ds(S.ext.min, S.dom.min, S.dom.max, i, g) + 8,
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
                        y: ds(S.ext.max, S.dom.min, S.dom.max, i, g) - 3,
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
                  se.map(
                    (S) => S.v == null || S.y == null ? null : /* @__PURE__ */ s.jsx(
                      "circle",
                      {
                        cx: S.x ?? w.x,
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
                  x: _ / 2,
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
        w && C ? /* @__PURE__ */ s.jsxs(
          "div",
          {
            className: "dsc-chart-tooltip",
            style: {
              left: `${Math.min(92, Math.max(8, w.x / _ * 100))}%`
            },
            children: [
              /* @__PURE__ */ s.jsx("div", { className: "dsc-chart-tooltip-time", children: __(w.t) }),
              se.map(
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
          n.filter((S) => S.label).map((S, O) => /* @__PURE__ */ s.jsxs("span", { className: "dsc-chart-legend-item", children: [
            /* @__PURE__ */ s.jsx("i", { style: { background: S.color || Vr[O % Vr.length] } }),
            S.label
          ] }, S.id)),
          ue != null ? /* @__PURE__ */ s.jsxs("span", { className: "dsc-chart-last", children: [
            ue.toFixed(1),
            r ? ` ${r}` : n[0]?.unit ? ` ${n[0].unit}` : ""
          ] }) : null
        ] })
      ]
    }
  );
}
function od(n, i = 280) {
  const [r, o] = v.useState(n);
  return v.useEffect(() => {
    if (!Number.isFinite(n)) {
      o(n);
      return;
    }
    if (typeof window < "u" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      o(n);
      return;
    }
    const d = Number.isFinite(r) ? r : n, h = performance.now();
    let m = 0;
    const p = (f) => {
      const _ = Math.min(1, (f - h) / i), x = 1 - (1 - _) ** 3;
      o(d + (n - d) * x), _ < 1 && (m = requestAnimationFrame(p));
    };
    return m = requestAnimationFrame(p), () => cancelAnimationFrame(m);
  }, [n, i]), r;
}
function Db(n, i = 520) {
  const [r, o] = v.useState(0);
  return v.useEffect(() => {
    if (typeof window < "u" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      o(1);
      return;
    }
    o(0);
    const d = performance.now();
    let h = 0;
    const m = (p) => {
      const f = Math.min(1, (p - d) / i);
      o(1 - (1 - f) ** 3), f < 1 && (h = requestAnimationFrame(m));
    };
    return h = requestAnimationFrame(m), () => cancelAnimationFrame(h);
  }, [n, i]), r;
}
function Lb(n, i) {
  const r = Math.max(n, 1);
  return { dasharray: `${r}`, dashoffset: r * (1 - i) };
}
function io(n, i, r, o) {
  return { x: n + r * Math.cos(o), y: i - r * Math.sin(o) };
}
function cd(n, i, r) {
  const o = Math.min(1, Math.max(0, (n - i) / Math.max(r - i, 1e-6)));
  return Math.PI - o * Math.PI;
}
function L1(n, i, r, o, d, h, m) {
  const p = io(d, h, m, cd(n, r, o)), f = io(d, h, m, cd(i, r, o));
  return `M ${p.x.toFixed(2)} ${p.y.toFixed(2)} A ${m} ${m} 0 0 0 ${f.x.toFixed(2)} ${f.y.toFixed(2)}`;
}
const qt = {
  track: "#243044",
  teal: "#26c6da",
  ok: "#66bb6a",
  amber: "#ffb74d",
  bad: "#ef5350",
  gray4: "#8b95a8",
  gray5: "#8b95a8",
  white: "#e8eef8"
};
function Ie({
  value: n,
  min: i = 0,
  max: r = 100,
  label: o,
  unit: d = "",
  target: h,
  band: m,
  extrema: p,
  stale: f,
  onClick: _,
  /** Progress counter — teal arc, never wears in-band green. */
  progress: x
}) {
  const g = Number.isFinite(n) ? n : NaN, y = Number.isFinite(g), w = od(y ? g : i), T = Math.min(r, Math.max(i, y ? w : i)), E = Math.max(r - i, 1e-6), M = y ? (T - i) / E : 0, C = 46, U = 2 * Math.PI * C * 0.75, G = U * M, X = (S) => cd(S, i, r), L = !x && Ad(m) ? m : void 0, V = !!(y && f), te = x ? "muted" : yi({
    value: g,
    band: L,
    margin: vo(L, d),
    stale: V,
    available: y
  }), re = x ? "is-progress" : A1(te), se = y && L ? L1(L.min, L.max, i, r, 60, 72, C) : "", ce = y ? x ? qt.teal : V ? qt.amber : te === "critical" ? qt.bad : te === "warn" ? qt.amber : L ? qt.ok : qt.teal : qt.gray4, me = `dsc-gauge-glow-${v.useId().replace(/:/g, "")}`, oe = [];
  y && (L && oe.push({ v: L.min, kind: "band" }, { v: L.max, kind: "band" }), p?.min != null && oe.push({ v: p.min, kind: "ext" }), p?.max != null && oe.push({ v: p.max, kind: "ext" }), h != null && Number.isFinite(h) && oe.push({ v: h, kind: "target" }));
  const ge = y ? V ? `${g.toFixed(g >= 100 ? 0 : g < 10 ? 2 : 1)} ${d} held` : `${g.toFixed(g >= 100 ? 0 : g < 10 ? 2 : 1)} ${d}` : "No data", ue = /* @__PURE__ */ s.jsxs(
    "div",
    {
      className: `dsc-gauge ${re}${V ? " is-stale" : ""}${_ ? " is-clickable" : ""}`,
      role: "img",
      "aria-label": o,
      "aria-valuetext": ge,
      children: [
        /* @__PURE__ */ s.jsxs("svg", { viewBox: "0 0 120 90", width: "140", height: "105", "aria-hidden": "true", children: [
          /* @__PURE__ */ s.jsx("defs", { children: /* @__PURE__ */ s.jsxs("filter", { id: me, x: "-40%", y: "-40%", width: "180%", height: "180%", children: [
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
              stroke: qt.track,
              strokeWidth: "10",
              strokeLinecap: "butt"
            }
          ),
          se ? /* @__PURE__ */ s.jsx(
            "path",
            {
              d: se,
              fill: "none",
              stroke: qt.ok,
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
              stroke: ce,
              strokeWidth: "10",
              strokeLinecap: "round",
              strokeDasharray: `${G} ${U}`,
              filter: `url(#${me})`,
              style: { transition: "stroke-dasharray 280ms ease, stroke 280ms ease" }
            }
          ) : null,
          oe.map((S, O) => {
            const q = X(S.v), J = io(60, 72, S.kind === "ext" ? C - 2 : C + 1, q), I = io(60, 72, C - (S.kind === "target" ? 14 : 10), q), k = S.kind === "target" ? qt.teal : S.kind === "band" ? qt.amber : qt.gray5, $ = S.kind === "target" ? "Target" : S.kind === "band" ? "Want edge" : "Session extreme";
            return /* @__PURE__ */ s.jsx(
              "line",
              {
                x1: I.x,
                y1: I.y,
                x2: J.x,
                y2: J.y,
                stroke: k,
                strokeWidth: S.kind === "target" ? 2.4 : 1.6,
                strokeLinecap: "round",
                opacity: S.kind === "ext" ? 0.65 : 0.95,
                children: /* @__PURE__ */ s.jsx("title", { children: $ })
              },
              `${S.kind}-${O}`
            );
          }),
          /* @__PURE__ */ s.jsx(
            "text",
            {
              x: "60",
              y: "58",
              textAnchor: "middle",
              fill: qt.white,
              fontSize: "20",
              fontWeight: "700",
              fontFamily: "var(--dsc-mono)",
              children: Number.isFinite(g) ? g.toFixed(g >= 100 ? 0 : g < 10 ? 2 : 1) : "—"
            }
          ),
          /* @__PURE__ */ s.jsx("text", { x: "60", y: "74", textAnchor: "middle", fill: V ? qt.amber : qt.gray5, fontSize: "10", children: V ? "HELD" : y ? d : "no data" })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-gauge-label", children: o })
      ]
    }
  );
  return _ ? /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-gauge-hit", onClick: _, title: `History · ${o}`, children: ue }) : ue;
}
function Hb({
  series: n,
  color: i = "var(--dsc-teal)",
  width: r = 120,
  height: o = 28
}) {
  const d = n.length ? `${n[0].t}-${n[n.length - 1].t}-${n.length}` : "empty", h = Db(d, 420);
  if (n.length < 2)
    return /* @__PURE__ */ s.jsx("div", { className: "dsc-sparkline dsc-muted", style: { width: r, height: o } });
  const m = n.map((E) => E.v), p = Math.min(...m), f = Math.max(...m), _ = Math.max(f - p, 1e-6), x = n[0].t, g = n[n.length - 1].t, y = Math.max(g - x, 1), w = n.map((E, M) => {
    const C = (E.t - x) / y * r, U = o - (E.v - p) / _ * (o - 4) - 2;
    return `${M === 0 ? "M" : "L"}${C.toFixed(1)} ${U.toFixed(1)}`;
  }).join(" "), N = r * 1.25, T = Lb(N, h);
  return /* @__PURE__ */ s.jsx("svg", { className: "dsc-sparkline", width: r, height: o, "aria-hidden": !0, children: /* @__PURE__ */ s.jsx(
    "path",
    {
      d: w,
      fill: "none",
      stroke: i,
      strokeWidth: "1.6",
      strokeLinecap: "round",
      strokeDasharray: T.dasharray,
      strokeDashoffset: T.dashoffset
    }
  ) });
}
function H1({
  row: n
}) {
  const i = n.want != null ? n.want : n.wantMin != null && n.wantMax != null && n.wantMax > n.wantMin ? (n.wantMin + n.wantMax) / 2 : NaN, r = !Number.isFinite(n.got), o = !!(!r && n.stale), d = n.wantMin != null && n.wantMax != null && Number.isFinite(n.wantMin) && Number.isFinite(n.wantMax) && n.wantMax > n.wantMin ? { min: n.wantMin, max: n.wantMax } : void 0, h = yi({
    value: n.got,
    band: d,
    margin: vo(d, n.unit),
    stale: o,
    available: !r
  }), m = Math.max(
    r ? 0 : n.got,
    Number.isFinite(i) ? i : 0,
    n.wantMax ?? 0,
    1
  ), p = r ? 0 : n.got / m * 100, f = Number.isFinite(i) ? i / m * 100 : 0, _ = od(p), x = od(f);
  return /* @__PURE__ */ s.jsxs("div", { className: `dsc-gotwant-row${o ? " is-stale" : r ? " is-muted" : ""}`, children: [
    /* @__PURE__ */ s.jsx("div", { className: "dsc-gotwant-label", children: n.label }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-gotwant-track", children: [
      Number.isFinite(i) ? /* @__PURE__ */ s.jsx("div", { className: "dsc-gotwant-want", style: { width: `${x}%` } }) : null,
      r ? null : /* @__PURE__ */ s.jsx(
        "div",
        {
          className: "dsc-gotwant-got",
          style: { width: `${_}%`, background: Od(h) }
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-gotwant-vals", children: [
      /* @__PURE__ */ s.jsxs("span", { children: [
        "Got ",
        r ? "—" : n.got.toFixed(1),
        r ? "" : n.unit || ""
      ] }),
      /* @__PURE__ */ s.jsxs("span", { className: "dsc-muted", children: [
        "Want",
        " ",
        n.wantMin != null && n.wantMax != null ? `${n.wantMin}–${n.wantMax}` : Number.isFinite(i) ? i.toFixed(1) : "—"
      ] })
    ] })
  ] });
}
function $b({
  rows: n
}) {
  return /* @__PURE__ */ s.jsx("div", { className: "dsc-gotwant", children: n.map((i) => /* @__PURE__ */ s.jsx(H1, { row: i }, i.label)) });
}
function Ln(n) {
  if (!n.length) return {};
  let i = n[0].v, r = n[0].v;
  for (const o of n)
    o.v < i && (i = o.v), o.v > r && (r = o.v);
  return { min: i, max: r };
}
function $1(n) {
  if (n == null) return !0;
  const i = String(n).toLowerCase();
  return i === "" || i === "unavailable" || i === "unknown" || i === "none";
}
function Bb(n) {
  if ($1(n)) return null;
  if (typeof n == "number") return Number.isFinite(n) ? n : null;
  const i = String(n).toLowerCase();
  if (i === "on" || i === "true" || i === "open") return 1;
  if (i === "off" || i === "false" || i === "closed") return 0;
  const r = Number(n);
  return Number.isFinite(r) ? r : null;
}
function B1(n) {
  if (typeof n.lu == "number" && Number.isFinite(n.lu))
    return n.lu * 1e3;
  const i = n.last_changed || n.last_updated;
  if (i) {
    const r = Date.parse(i);
    return Number.isFinite(r) ? r : null;
  }
  return null;
}
function U1(n) {
  return Bb(n.s ?? n.state);
}
function g_(n, i) {
  if (n.length <= i) return n;
  const r = [], o = (n.length - 1) / (i - 1);
  for (let d = 0; d < i; d++)
    r.push(n[Math.round(d * o)]);
  return r;
}
function zd(n, i = 6, r = 96) {
  const { hass: o, callWS: d } = xi(), h = ua(), m = !!(o && (o.callWS || o.connection)), [p, f] = v.useState([]), [_, x] = v.useState(!0), [g, y] = v.useState(null);
  return v.useEffect(() => {
    let w = !1;
    async function N() {
      x(!0), y(null);
      try {
        const E = await E0(n, i);
        if (w) return;
        const M = E.filter((C) => Number.isFinite(C.t) && Number.isFinite(C.v));
        M.sort((C, U) => C.t - U.t), f(g_(M, r));
      } catch (E) {
        w || (y(E instanceof Error ? E.message : "history unavailable"), f([]));
      } finally {
        w || x(!1);
      }
    }
    async function T() {
      if (!n) {
        f([]), x(!1);
        return;
      }
      if (!m) {
        f([]), x(!1);
        return;
      }
      x(!0), y(null);
      const E = /* @__PURE__ */ new Date(), M = new Date(E.getTime() - i * 3600 * 1e3);
      try {
        const C = await d({
          type: "history/history_during_period",
          start_time: M.toISOString(),
          end_time: E.toISOString(),
          significant_changes_only: !1,
          minimal_response: !0,
          no_attributes: !0,
          entity_ids: [n]
        });
        if (w) return;
        if (C == null) {
          f([]), y("history unavailable");
          return;
        }
        let U = [];
        Array.isArray(C) ? U = C[0] || [] : C && typeof C == "object" && (U = C[n] || []);
        const G = [];
        for (const X of U) {
          const L = B1(X), V = U1(X);
          L == null || V == null || G.push({ t: L, v: V });
        }
        G.sort((X, L) => X.t - L.t), f(g_(G, r));
      } catch (C) {
        w || (y(C instanceof Error ? C.message : "history unavailable"), f([]));
      } finally {
        w || x(!1);
      }
    }
    return h === "pi" ? N() : T(), () => {
      w = !0;
    };
  }, [h, m, n, i, r, d]), { points: p, loading: _, error: g };
}
function F1(n) {
  return n <= 18 ? n * 2 : Math.min(n + 24, 48);
}
function G1(n, i) {
  const r = i * 3600 * 1e3, o = Date.now() - r;
  return n.filter((d) => d.t < o && Number.isFinite(d.v)).map((d) => ({ t: d.t + r, v: d.v }));
}
function Ne(n, i) {
  const r = i?.maxPoints ?? 96, o = i?.hours ?? 6, d = !!i?.withGhost, h = d ? F1(o) : o, m = d ? Math.min(Math.max(r * 2, r), 288) : r, { num: p, available: f, tick: _, state: x } = Me(), g = Ot(), y = ua(), w = C0(), { points: N } = zd(n, h, m), [T, E] = v.useState([]), M = v.useRef(null), C = v.useRef(!1);
  v.useEffect(() => {
    C.current = !1, E([]), M.current = null;
  }, [n, o, r, h, d]), v.useEffect(() => {
    if (N.length && !C.current) {
      C.current = !0;
      const V = N[N.length - 1]?.v;
      Number.isFinite(V) && (M.current = V);
    }
  }, [N]), v.useEffect(() => {
    const V = y === "pi" ? jd(n, g) : f(n);
    if (!n || !V) return;
    const te = y === "pi" ? ao(n, g) : null, re = p(n), se = te != null && Number.isFinite(te) ? te : Number.isFinite(re) ? re : Bb(x(n, ""));
    if (se == null || !Number.isFinite(se)) return;
    if (M.current === se && T.length > 0) {
      const me = Date.now(), oe = T[T.length - 1]?.t ?? 0;
      if (me - oe < 4e3) return;
    }
    M.current = se;
    const ce = Date.now();
    E((me) => [...me, { t: ce, v: se }].slice(-r));
  }, [n, _, w, y, g, f, p, x, r]);
  const U = d ? Math.max(m, r * 2) : r * 2, { series: G, ghost: X, lastSyncAt: L } = v.useMemo(() => {
    const V = N.length ? N[N.length - 1].t : 0, te = T.filter((S) => S.t > V + 250), re = N.length ? [...N, ...te] : te, se = re.length ? re[re.length - 1].t : void 0, ce = se != null && Date.now() - se > 300 * 1e3, me = zb(re, Date.now(), { markStale: ce }), oe = me.length > U ? me.slice(-U) : me;
    if (!d) return { series: oe, ghost: [], lastSyncAt: se };
    const ge = o * 3600 * 1e3, ue = Date.now() - ge;
    return {
      series: oe.filter((S) => S.t >= ue),
      ghost: G1(oe, o),
      lastSyncAt: se
    };
  }, [N, T, U, d, o]);
  return { series: G, lastSyncAt: L, ghost: X };
}
const V1 = [1, 6, 24, 48], Ub = "dsc_chart_hours";
function q1() {
  try {
    const n = sessionStorage.getItem(Ub), i = Number(n);
    if (Number.isFinite(i) && i > 0 && i <= 48) return i;
  } catch {
  }
  return 6;
}
function ml(n = 6) {
  const [i, r] = v.useState(() => q1() || n), o = v.useCallback((h) => {
    r(h);
    try {
      sessionStorage.setItem(Ub, String(h));
    } catch {
    }
  }, []), d = i <= 1 ? 60 : i <= 6 ? 96 : i <= 24 ? 144 : 192;
  return { hours: i, setHours: o, maxPoints: d };
}
const Fb = "dsc-hub-snooze:";
function Iu(n) {
  try {
    const i = localStorage.getItem(Fb + n);
    if (!i) return {};
    const r = JSON.parse(i);
    return !r || typeof r != "object" ? {} : r;
  } catch {
    return {};
  }
}
function x_(n, i) {
  try {
    localStorage.setItem(Fb + n, JSON.stringify(i));
  } catch {
  }
}
function yo() {
  const { entity: n, tick: i } = Me(), r = n("sensor.dsc_hub_uptime")?.last_changed || "noboot", o = v.useMemo(() => Iu(r), [r, i]), d = v.useCallback((p) => !!o[p], [o]), h = v.useCallback(
    (p) => {
      if (!p) return;
      const f = { ...Iu(r), [p]: !0 };
      x_(r, f);
    },
    [r]
  ), m = v.useCallback(
    (p) => {
      const f = { ...Iu(r) };
      delete f[p], x_(r, f);
    },
    [r]
  );
  return { bootKey: r, isSnoozed: d, snooze: h, unsnooze: m };
}
const fl = [
  { label: "Cycle", hours: 12 },
  { label: "Photo", hours: 18 }
];
function pl({
  hours: n,
  setHours: i,
  extras: r
}) {
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-timespan", role: "group", "aria-label": "Chart timespan", children: [
    V1.map((o) => /* @__PURE__ */ s.jsxs(
      "button",
      {
        type: "button",
        className: `dsc-chip${n === o ? " dsc-chip--ok" : ""}`,
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
        className: `dsc-chip${n === o.hours ? " dsc-chip--ok" : ""}`,
        onClick: () => i(o.hours),
        children: o.label
      },
      o.label
    ))
  ] });
}
function Y1({
  open: n,
  onClose: i,
  entityId: r,
  label: o,
  unit: d = "",
  color: h = "var(--dsc-blue)"
}) {
  const { hours: m, setHours: p, maxPoints: f } = ml(6), _ = Ne(r || "", { hours: m, maxPoints: f }), x = m <= 18 ? m * 2 : Math.min(m + 24, 48), g = Ne(r || "", { hours: x, maxPoints: f }), y = v.useMemo(() => {
    const N = m * 3600 * 1e3, T = Date.now() - N;
    return g.series.filter((E) => E.t < T).map((E) => ({ t: E.t + N, v: E.v }));
  }, [g.series, m]), w = !r || _.series.length < 2;
  return /* @__PURE__ */ s.jsxs(
    Xa,
    {
      open: n && !!r,
      onClose: i,
      title: o ? `History · ${o}` : "History",
      children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: [
          /* @__PURE__ */ s.jsx(pl, { hours: m, setHours: p, extras: fl }),
          w ? /* @__PURE__ */ s.jsx(z, { label: "Thin recorder", tone: "warn" }) : null,
          y.length > 1 ? /* @__PURE__ */ s.jsx(z, { label: "Prior window ghost", tone: "muted" }) : null
        ] }),
        r ? /* @__PURE__ */ s.jsx(
          Tn,
          {
            live: !0,
            unit: d,
            lastSyncAt: _.lastSyncAt,
            series: [
              {
                id: r,
                label: o,
                series: _.series,
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
function ro({
  entityId: n,
  hours: i = 24,
  onClick: r,
  label: o = "24h on/off"
}) {
  const { state: d, entity: h } = Me(), { points: m, loading: p } = zd(n, i, 720), f = d(n, "off") === "on" ? 1 : 0, _ = Date.now(), x = _ - i * 3600 * 1e3, g = v.useMemo(() => {
    const C = m.filter((U) => Number.isFinite(U.v));
    return (d(n, "") === "on" || d(n, "") === "off") && C.push({ t: _, v: f }), zb(C, _);
  }, [m, _, f, d, n]), y = v.useMemo(() => {
    const C = [];
    let U = null;
    for (let G = 0; G < g.length; G++) {
      const X = g[G], L = X.v >= 0.5;
      L && U == null && (U = Math.max(X.t, x)), !L && U != null && (C.push({ start: U, end: X.t }), U = null);
    }
    return U != null && C.push({ start: U, end: _ }), C.filter((G) => G.end > x && G.end > G.start);
  }, [g, _, x]), w = y.reduce((C, U) => C + (U.end - U.start), 0), N = y.length ? y[y.length - 1].start : null, T = h(n)?.last_changed, E = N ? new Date(N).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : T ? new Date(T).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—", M = /* @__PURE__ */ s.jsxs("div", { className: "dsc-duty-strip", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-duty-meta", children: [
      /* @__PURE__ */ s.jsx("span", { children: o }),
      /* @__PURE__ */ s.jsxs("span", { className: "dsc-muted", children: [
        y.length,
        " cycle",
        y.length === 1 ? "" : "s",
        " · last ",
        E,
        " ·",
        " ",
        p ? "…" : `${(w / 36e5).toFixed(1)}h on`
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("svg", { viewBox: `0 0 ${i} 18`, className: "dsc-duty-svg", preserveAspectRatio: "none", "aria-hidden": !0, children: [
      /* @__PURE__ */ s.jsx("rect", { x: "0", y: "5", width: i, height: "8", rx: "2", fill: "var(--dsc-gray-3)" }),
      y.map((C) => {
        const U = Math.max(0, (C.start - x) / 36e5), G = Math.max(0.04, (C.end - C.start) / 36e5);
        return /* @__PURE__ */ s.jsx("rect", { x: U, y: "5", width: G, height: "8", rx: "1.5", fill: "var(--dsc-teal)" }, C.start);
      })
    ] })
  ] });
  return r ? /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-duty-hit", onClick: r, title: `History · ${o}`, children: M }) : M;
}
const X1 = {
  title: "Fleet version",
  what: "A device is missing firmware or running a different version than expected. Devices deliberately out of service (AC, clone mister, pot 3) are not counted here.",
  fix: "Open Fleet and update the outdated device. If the device is not built yet, leave it out of service — that is not a failure."
}, Q1 = {
  title: "Out of service",
  what: "This device is not running. It may be deliberately out of service (not built yet), temporarily paused, or locked out by an operator.",
  fix: "If the device is built and should run, switch it back in service from Fleet. If it was paused temporarily, clear that once the pause is over. Unbuilt devices stay out of service — not an alarm."
}, P1 = {
  title: "Hub link",
  what: "The hub is not responding. The display holds the last good readings instead of showing made-up values.",
  fix: "Check hub power, the Wi-Fi channel, and firmware on Fleet. Brief dropouts recover on their own within about half a minute."
}, Z1 = {
  title: "Panel link",
  what: "The control panel has lost its direct radio link. A limited fallback link may still be working — slower, but not offline.",
  fix: "Check the panel's firmware and link age on Fleet. If its Wi-Fi signal is still reporting, the panel is on the fallback link, not offline."
}, K1 = {
  title: "Heartbeat",
  what: "The hub's regular liveness pulse has stopped arriving. This is separate from the climate readings.",
  fix: "If the hub link is also down, fix the hub first. If the link is up but the heartbeat is missing, restart the hub."
}, J1 = {
  title: "Device",
  what: "This shows the device's real state: running, idle, deliberately out of service, not set up yet, or offline after a short grace period.",
  fix: "Out of service: leave it if the device is not built. Offline: give it a moment, then check Fleet. Not set up: the device has not been added yet."
}, oo = {
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
  "binary_sensor.dsc_peer_mad_alert": {
    title: "Peer probe divergence",
    what: "In-service pot probes disagree beyond the MAD threshold — one may be stuck or outlier.",
    fix: "Open Root. Check stuck/untrusted pots before trusting mat vote."
  },
  "binary_sensor.dsc_dht_disagreement": {
    title: "DHT disagreement",
    what: "Tent, room, and clone temperature or humidity spans exceed threshold for 15+ minutes.",
    fix: "Climate cue only — check DHT placement and ventilation. Not a failsafe trip."
  },
  "binary_sensor.dsc_pot1_sensor_stuck": {
    title: "Pot 1 stuck",
    what: "Pot 1 soil moisture has not moved for the stuck window.",
    fix: "Probe may be wedged or offline. Exclude from mat vote if untrusted."
  },
  "binary_sensor.dsc_pot2_sensor_stuck": {
    title: "Pot 2 stuck",
    what: "Pot 2 soil moisture has not moved for the stuck window.",
    fix: "Probe may be wedged or offline. Exclude from mat vote if untrusted."
  },
  "binary_sensor.dsc_pot3_sensor_stuck": {
    title: "Pot 3 stuck",
    what: "Pot 3 soil moisture has not moved for the stuck window.",
    fix: "Probe may be wedged or offline. Exclude from mat vote if untrusted."
  },
  "binary_sensor.dsc_pot4_sensor_stuck": {
    title: "Pot 4 stuck",
    what: "Pot 4 soil moisture has not moved for the stuck window.",
    fix: "Probe may be wedged or offline. Exclude from mat vote if untrusted."
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
function qr(n) {
  return {
    [`binary_sensor.dsc_pot${n}_moisture_out_of_range`]: {
      title: `Pot ${n} moisture`,
      what: `Pot ${n} moisture has left its target band.`,
      fix: "Open Root and check that pot. Pots out of service never show made-up readings."
    },
    [`binary_sensor.dsc_pot${n}_ph_out_of_range`]: {
      title: `Pot ${n} pH`,
      what: `Pot ${n} pH has left its target band.`,
      fix: "Check the pot on Root. Confirm the probe before dosing."
    },
    [`binary_sensor.dsc_pot${n}_root_zone_temp_out_of_range`]: {
      title: `Pot ${n} root T`,
      what: `Pot ${n} soil temperature has left its trusted band.`,
      fix: "Check the heat mat and airflow first. The mat should not run for a pot that is out of service."
    },
    [`binary_sensor.dsc_pot${n}_ec_salt_build_up`]: {
      title: `Pot ${n} salt build-up`,
      what: `Pot ${n} nutrient strength is high compared with its baseline.`,
      fix: "Check the pot on Root. Decide flush vs feed from the pot's Need reading, not just this alert."
    },
    [`binary_sensor.dsc_pot${n}_ec_depleted_vs_baseline`]: {
      title: `Pot ${n} EC depleted`,
      what: `Pot ${n} nutrient strength is low compared with its baseline.`,
      fix: "Feed based on the pot's Need reading. Confirm the probe is trusted."
    },
    [`binary_sensor.dsc_pot${n}_nitrogen_below_baseline`]: {
      title: `Pot ${n} N below baseline`,
      what: `Pot ${n} nitrogen is below its rolling baseline.`,
      fix: "Check the NPK readings on Root. Do not act on an untrusted probe."
    },
    [`binary_sensor.dsc_pot${n}_nitrogen_depleting_fast`]: {
      title: `Pot ${n} N depleting`,
      what: `Pot ${n} nitrogen is falling faster than expected.`,
      fix: "Check the trend on Root and compare irrigation against the pot's Need."
    }
  };
}
Object.assign(oo, qr(1), qr(2), qr(3), qr(4));
function I1(n) {
  return n.includes("dark") || n.includes("light") || n.includes("photo") || n.includes("catchup") ? { href: "/live/light", cta: "Open Light" } : n.includes("root") || n.includes("pot") || n.includes("grow_mat") || n.includes("tank_") ? { href: "/live/root", cta: "Open Root" } : n.includes("climate") || n.includes("humidifier") || n.includes("heater") || n.includes("vent") || n.includes("coherence") || n.includes("plant_specs") ? { href: "/live/climate", cta: "Open Climate" } : n.includes("failsafe") || n.includes("emergency") ? { href: "/live/mission", cta: "Mission" } : n.includes("reduced_kit") || n.includes("nest_channel") ? { href: "/fleet", cta: "Open Fleet" } : { href: "/live/overview", cta: "Overview" };
}
function Gb(n, i) {
  return oo[n] ? oo[n] : i === "fleet" || n === "sensor.dsc_fleet_version_status" ? X1 : i === "kit" ? J1 : n.includes("in_service") || n.endsWith("_oos") ? Q1 : n.includes("hub_link") || n.includes("hub_uptime") ? P1 : n.includes("panel_link") || n.includes("control_wifi") ? Z1 : n.includes("heartbeat") ? K1 : {
    title: n.split(".").pop()?.replace(/_/g, " ") || "Reading",
    what: "A live reading recorded by the hub. Use the timespan buttons here to explore its history.",
    fix: "If the number looks wrong, check the sensor or its target. If it shows no value, nothing was measured — it is not a zero."
  };
}
const Vb = Object.keys(oo);
function qa(n) {
  if (!Number.isFinite(n) || n < 0) return "—";
  const i = Math.floor(n / 1e3);
  if (i < 60) return `${Math.max(1, i)}S`;
  const r = Math.floor(i / 60);
  if (r < 60) return `${r}M`;
  const o = Math.floor(r / 60), d = r % 60;
  return o < 48 ? d > 0 ? `${o}H ${d}M` : `${o}H` : `${(o / 24).toFixed(1)}D`;
}
function W1(n, i, r) {
  if (i === "binary" || i === "alert" || n.startsWith("binary_sensor.") || n.startsWith("switch.") || n.startsWith("light."))
    return !0;
  const o = (r || "").toLowerCase();
  return o === "on" || o === "off";
}
function ej({
  target: n,
  onClose: i
}) {
  const { state: r, num: o, available: d, entity: h } = Me(), { callService: m } = Gt(), { hours: p, setHours: f, maxPoints: _ } = ml(6), { isSnoozed: x, snooze: g, unsnooze: y } = yo(), [w, N] = v.useState(!1), T = n?.entityId ?? "", E = T ? r(T, "") : "", M = n ? W1(T, n.kind, E) : !1, C = Ne(T, { hours: M ? 24 : p, maxPoints: M ? 288 : _ }), U = p <= 18 ? p * 2 : Math.min(p + 24, 48), G = Ne(T, { hours: U, maxPoints: _ }), X = v.useMemo(() => {
    const O = p * 3600 * 1e3, q = Date.now() - O;
    return G.series.filter((J) => J.t < q).map((J) => ({ t: J.t + O, v: J.v }));
  }, [G.series, p]);
  if (!n) return null;
  const L = Gb(n.entityId, n.kind), V = h(n.entityId), te = V?.last_changed ? Date.parse(V.last_changed) : NaN, re = Number.isFinite(te) ? qa(Date.now() - te) + " ago" : "—", se = C.series.length < 2, ce = x(n.entityId), me = n.runtimeToday ? o(n.runtimeToday) : NaN, oe = n.cyclesToday ? o(n.cyclesToday) : NaN, ge = n.demandEntity, ue = n.entityId.split(".")[0], S = ue === "switch" || ue === "light" || ue === "input_boolean";
  return /* @__PURE__ */ s.jsxs(Xa, { open: !!n.entityId, onClose: i, title: n.label, children: [
    d(n.entityId) ? null : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "No data — this reading is not reporting right now." }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ s.jsx(z, { label: `Last ${re}`, tone: "muted" }),
      Number.isFinite(me) ? /* @__PURE__ */ s.jsx(z, { label: `Today ${me.toFixed(2)}h`, tone: "ok" }) : null,
      Number.isFinite(oe) ? /* @__PURE__ */ s.jsx(z, { label: `${Math.round(oe)} cycles`, tone: "muted" }) : null,
      /* @__PURE__ */ s.jsx(
        z,
        {
          label: E && E !== "—" ? String(E) : "no state",
          tone: E === "on" ? "ok" : E === "off" ? "muted" : "warn"
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-inspector-playbook", children: [
      /* @__PURE__ */ s.jsx("strong", { children: L.title }),
      /* @__PURE__ */ s.jsx("p", { children: L.what }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: L.fix })
    ] }),
    n.kind === "alert" || n.entityId.startsWith("binary_sensor.") ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { margin: "10px 0" }, children: [
      ce ? /* @__PURE__ */ s.jsx(ae, { onClick: () => y(n.entityId), children: "Unsnooze" }) : /* @__PURE__ */ s.jsx(ae, { onClick: () => g(n.entityId), children: "Acknowledge until hub reboot" }),
      ce ? /* @__PURE__ */ s.jsx(z, { label: "Snoozed this boot", tone: "warn" }) : null
    ] }) : null,
    S ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 10 }, children: [
      /* @__PURE__ */ s.jsx(ae, { primary: !0, onClick: () => N(!0), children: E === "on" ? "Turn off" : "Turn on" }),
      /* @__PURE__ */ s.jsx(
        qe,
        {
          open: w,
          onDismiss: () => N(!1),
          onConfirm: () => {
            N(!1), m(ue, E === "on" ? "turn_off" : "turn_on", {
              entity_id: n.entityId
            });
          },
          title: E === "on" ? `Turn off ${n.label}` : `Turn on ${n.label}`,
          confirmLabel: E === "on" ? "Turn off" : "Turn on",
          help: null,
          children: /* @__PURE__ */ s.jsxs("p", { children: [
            "This writes ",
            n.entityId,
            " on the hub immediately."
          ] })
        }
      )
    ] }) : null,
    M || ge ? /* @__PURE__ */ s.jsx(ro, { entityId: ge || n.entityId, hours: 24 }) : null,
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { margin: "12px 0" }, children: [
      /* @__PURE__ */ s.jsx(pl, { hours: p, setHours: f, extras: fl }),
      se ? /* @__PURE__ */ s.jsx(z, { label: "Limited history", tone: "warn" }) : null,
      X.length > 1 ? /* @__PURE__ */ s.jsx(z, { label: "Previous period (faded)", tone: "muted" }) : null
    ] }),
    /* @__PURE__ */ s.jsx(
      Tn,
      {
        live: !0,
        unit: M ? "" : n.unit || "",
        lastSyncAt: C.lastSyncAt,
        yDomain: M ? { left: { min: 0, max: 1 } } : void 0,
        emptyLabel: "no history yet",
        series: [
          {
            id: n.entityId,
            label: n.label,
            series: C.series,
            color: n.color || "var(--dsc-teal)",
            unit: M ? "" : n.unit,
            step: M
          },
          ...X.length > 1 ? [
            {
              id: `${n.entityId}-ghost`,
              label: `${n.label} prior`,
              series: X,
              color: n.color || "var(--dsc-teal)",
              unit: n.unit,
              ghost: !0
            }
          ] : []
        ]
      }
    ),
    /* @__PURE__ */ s.jsxs("details", { className: "dsc-inspector-details", children: [
      /* @__PURE__ */ s.jsx("summary", { children: "Details" }),
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { fontFamily: "var(--dsc-mono)", fontSize: 12 }, children: [
        n.entityId,
        d(n.entityId) ? "" : " · unavailable"
      ] })
    ] })
  ] });
}
const qb = v.createContext(null);
function tj({ children: n }) {
  const [i, r] = v.useState(null), o = v.useCallback(() => r(null), []), d = v.useCallback((m) => r(m), []), h = v.useMemo(() => ({ open: d, close: o }), [d, o]);
  return /* @__PURE__ */ s.jsxs(qb.Provider, { value: h, children: [
    n,
    /* @__PURE__ */ s.jsx(ej, { target: i, onClose: o })
  ] });
}
function Bn() {
  const n = v.useContext(qb);
  return n || {
    open: () => {
    },
    close: () => {
    }
  };
}
const nj = {
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
  entityId: n,
  label: i,
  step: r,
  tone: o,
  hint: d,
  onLive: h
}) {
  const { state: m, available: p, attributes: f } = ul(n), { callService: _ } = Gt(), x = p, g = Number(m), y = Number(f?.min ?? 0), w = Number(f?.max ?? 100), N = r ?? Number(f?.step ?? 0.1), [T, E] = v.useState(String(Number.isFinite(g) ? g : "")), M = v.useRef(!1);
  v.useEffect(() => {
    !M.current && Number.isFinite(g) && E(String(g));
  }, [g]);
  const C = () => {
    if (!x) return;
    const G = Number(T);
    if (!Number.isFinite(G)) {
      E(String(Number.isFinite(g) ? g : ""));
      return;
    }
    const X = Math.min(w, Math.max(y, G)), V = n.split(".")[0] === "input_number" ? "input_number" : "number";
    _(V, "set_value", { entity_id: n, value: X }), E(String(X));
  }, U = o === "critical" ? "is-bad" : o === "warn" ? "is-warn" : o === "muted" ? "is-muted" : "";
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-target-num${x ? "" : " is-disabled"} ${U}`.trim(), children: [
    /* @__PURE__ */ s.jsx("span", { className: "dsc-target-num-label", children: i }),
    /* @__PURE__ */ s.jsx(
      "input",
      {
        type: "number",
        value: T,
        disabled: !x,
        min: y,
        max: w,
        step: N,
        onFocus: () => {
          M.current = !0;
        },
        onChange: (G) => {
          E(G.target.value);
          const X = Number(G.target.value);
          Number.isFinite(X) && h?.(X);
        },
        onBlur: () => {
          M.current = !1, C();
        },
        onKeyDown: (G) => {
          G.key === "Enter" && G.target.blur();
        }
      }
    ),
    d ? /* @__PURE__ */ s.jsx("span", { className: "dsc-target-hint", children: d }) : null
  ] });
}
function Wu({ tent: n, title: i, hero: r }) {
  const { num: o, state: d, entity: h } = Me(), m = Bn(), p = nj[n], f = rd(n, { state: d, entity: h }), _ = we(p.gotTemp), x = we(p.gotRh), g = we(p.gotVpd), y = _.stale ? NaN : _.value, w = x.stale ? NaN : x.value, N = g.stale ? NaN : g.value, T = o(p.temp), E = o(p.rhMin), M = o(p.rhMax), [C, U] = v.useState(T), [G, X] = v.useState(E), [L, V] = v.useState(M), [te, re] = v.useState(o(p.vpdMin)), [se, ce] = v.useState(o(p.vpdMax)), me = Ba(C, f.temp), oe = Ba(G, f.rh, G > L), ge = Ba(L, f.rh, G > L), ue = Ba(te, f.vpd, te > se), S = Ba(se, f.vpd, te > se), O = (q, J, I) => {
    m.open({ entityId: q, label: J, unit: I });
  };
  return /* @__PURE__ */ s.jsxs("div", { className: `dsc-tent-targets${r ? " is-hero" : ""}`, children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-tent-targets-head", children: [
      /* @__PURE__ */ s.jsx("strong", { children: i }),
      f.mixed ? /* @__PURE__ */ s.jsx(z, { label: "mixed stages", tone: "warn" }) : null,
      f.emptyLabel ? /* @__PURE__ */ s.jsx(z, { label: f.emptyLabel, tone: "muted" }) : null,
      f.stages.map((q) => /* @__PURE__ */ s.jsx(z, { label: q, tone: "muted" }, q)),
      /* @__PURE__ */ s.jsx(
        bo,
        {
          label: `${i} more`,
          items: [
            { id: "temp", label: "Inspector · temp", onSelect: () => O(p.temp, `${i} Want T`, "°C") },
            { id: "rh", label: "Inspector · RH", onSelect: () => O(p.rhMin, `${i} RH min`, "%") },
            { id: "vpd", label: "Inspector · VPD", onSelect: () => O(p.vpdMin, `${i} VPD min`, "kPa") }
          ]
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs(
      "button",
      {
        type: "button",
        className: "dsc-got-want dsc-got-want-hit",
        onClick: () => O(p.gotTemp, `${i} Got T`, "°C"),
        children: [
          /* @__PURE__ */ s.jsxs("span", { children: [
            "Got ",
            Number.isFinite(y) ? `${y.toFixed(1)}°C` : "—",
            " /",
            " ",
            Number.isFinite(w) ? `${w.toFixed(0)}%` : "—",
            Number.isFinite(N) ? ` / ${N.toFixed(2)} kPa` : ""
          ] }),
          /* @__PURE__ */ s.jsxs("span", { className: "dsc-muted", children: [
            "Want ",
            Number.isFinite(T) ? T.toFixed(1) : "—",
            "°C · RH",
            " ",
            Number.isFinite(E) ? E.toFixed(0) : "—",
            "–",
            Number.isFinite(M) ? M.toFixed(0) : "—",
            "%"
          ] })
        ]
      }
    ),
    f.needs.length ? /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: f.needs.map((q) => /* @__PURE__ */ s.jsx(z, { label: `Need ${q}`, tone: "warn" }, q)) }) : null,
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
      /* @__PURE__ */ s.jsx(Je, { entityId: p.temp, label: "Temp °C", step: 0.5, tone: me.tone, hint: me.label, onLive: U }),
      /* @__PURE__ */ s.jsx(Je, { entityId: p.rhMin, label: "RH min %", step: 1, tone: oe.tone, hint: oe.label, onLive: X }),
      /* @__PURE__ */ s.jsx(Je, { entityId: p.rhMax, label: "RH max %", step: 1, tone: ge.tone, hint: ge.label, onLive: V }),
      /* @__PURE__ */ s.jsx(Je, { entityId: p.vpdMin, label: "VPD min", step: 0.01, tone: ue.tone, hint: ue.label, onLive: re }),
      /* @__PURE__ */ s.jsx(Je, { entityId: p.vpdMax, label: "VPD max", step: 0.01, tone: S.tone, hint: S.label, onLive: ce })
    ] })
  ] });
}
function Yb({
  compact: n,
  emphasize: i,
  only: r,
  hero: o
}) {
  const d = r ? [r] : i === "clone" ? ["clone", "main"] : ["main", "clone"];
  return o && !r ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-heroes", children: [
    /* @__PURE__ */ s.jsx(Wu, { tent: "clone", title: "2×4 climate", hero: !0 }),
    /* @__PURE__ */ s.jsx(Wu, { tent: "main", title: "4×8 climate", hero: !0 })
  ] }) : /* @__PURE__ */ s.jsx("div", { className: `dsc-target-panel${n ? " is-compact" : ""}`, children: d.map((h) => /* @__PURE__ */ s.jsx(Wu, { tent: h, title: h === "main" ? "4×8 climate" : "2×4 climate", hero: o }, h)) });
}
const v_ = [1, 2, 3, 4, 5, 6, 7, 8];
function aj() {
  const { available: n, entity: i, num: r, state: o } = Me(), { callService: d } = Gt(), [h, m] = v.useState(null), [p, f] = v.useState(null), [_, x] = v.useState(null), [g, y] = v.useState(null), w = o("input_text.dsc_build_strain", ""), N = o("input_text.dsc_build_nickname", ""), T = o("input_select.dsc_build_assign_pot", "none"), E = o("input_select.dsc_build_tent", "4x8"), M = o("sensor.dsc_build_expected_stage", ""), C = o("sensor.dsc_build_days_since_sprout", ""), U = r("input_number.dsc_blend_total_l", 20), G = o("input_select.dsc_light_fixture", ""), X = o("input_select.dsc_build_vessel", ""), L = id(X || void 0, U), V = r("input_number.dsc_mix_tank_liters", 20), te = r("input_number.dsc_mix_strength_pct", 100), re = (Number.isFinite(te) ? te : 100) / 100, se = Number.isFinite(V) && V > 0 ? V : 20, ce = (O, q) => {
    if (O === "strain")
      x(q), d("input_text", "set_value", { entity_id: "input_text.dsc_build_strain", value: q.name });
    else if (O === "medium") {
      const J = q.composition && typeof q.composition == "object" ? Object.entries(q.composition).filter(([, I]) => Number.isFinite(Number(I)) && Number(I) > 0).slice(0, 3) : [];
      if (J.length)
        for (let I = 1; I <= 3; I++) {
          const k = J[I - 1];
          d("input_text", "set_value", {
            entity_id: `input_text.dsc_blend_component_${I}_name`,
            value: k ? String(k[0]) : ""
          }), d("input_number", "set_value", {
            entity_id: `input_number.dsc_blend_pct_${I}`,
            value: k ? Number(k[1]) : 0
          });
        }
      else
        d("input_text", "set_value", {
          entity_id: "input_text.dsc_blend_component_1_name",
          value: q.name
        });
    } else if (O === "nutrient")
      for (const J of v_) {
        const I = o(`input_text.dsc_nutrient_${J}_name`, ""), k = o(`input_boolean.dsc_nutrient_${J}_in_inventory`) === "on";
        if (!I || I === "unknown" || !k) {
          d("input_text", "set_value", {
            entity_id: `input_text.dsc_nutrient_${J}_name`,
            value: q.name
          }), q.dose_ml_l != null && Number.isFinite(Number(q.dose_ml_l)) && d("input_number", "set_value", {
            entity_id: `input_number.dsc_nutrient_${J}_dose_ml_l`,
            value: Number(q.dose_ml_l)
          }), d("input_boolean", "turn_on", { entity_id: `input_boolean.dsc_nutrient_${J}_in_inventory` });
          break;
        }
      }
    else if (O === "light") {
      y(q);
      const I = (i("input_select.dsc_light_fixture")?.attributes?.options || []).find((k) => k.toLowerCase().includes(String(q.name || "").toLowerCase().slice(0, 18)));
      I ? d("input_select", "select_option", { entity_id: "input_select.dsc_light_fixture", option: I }) : d("input_text", "set_value", { entity_id: "input_text.dsc_light_custom_name", value: q.name });
    }
    m(null);
  }, me = (O) => {
    const q = Number(O);
    if (!Number.isFinite(q) || O === "none") return;
    const J = xb(q);
    n(J) && d("input_select", "select_option", { entity_id: J, option: L.id });
  }, oe = () => {
    d("script", "turn_on", { entity_id: "script.dsc_build_plant_commit" });
  }, ge = () => {
    if (me(T), n("script.dsc_build_plant_commit_and_assign")) {
      d("script", "turn_on", { entity_id: "script.dsc_build_plant_commit_and_assign" });
      return;
    }
    d("script", "turn_on", { entity_id: "script.dsc_build_plant_commit" }), d("script", "turn_on", {
      entity_id: "script.dsc_plant_assign_to_pot",
      pot: T,
      variables: { pot: T }
    });
  }, ue = v_.map((O) => {
    const q = o(`input_text.dsc_nutrient_${O}_name`, ""), J = r(`input_number.dsc_nutrient_${O}_dose_ml_l`, 0), I = r(`input_number.dsc_nutrient_${O}_stock_ml`, 0), k = o(`input_boolean.dsc_nutrient_${O}_in_inventory`) === "on", $ = !q || q === "unknown" || q === "unavailable", Z = !$ && Number.isFinite(J) ? Math.round(J * se * re * 10) / 10 : 0;
    return { n: O, name: q, dose: J, stock: I, inv: k, empty: $, ml: Z, short: k && Number.isFinite(I) && I < Z && Z > 0 };
  }), S = ue.reduce((O, q) => O + q.ml, 0);
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-compose", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Strain", icon: "roster", children: [
        /* @__PURE__ */ s.jsx(
          Br,
          {
            label: w && w !== "unknown" ? w : "No strain",
            empty: !w || w === "unknown",
            onClick: () => m("strain")
          }
        ),
        _ ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { margin: "8px 0" }, children: [
          _.type ? /* @__PURE__ */ s.jsx(z, { label: String(_.type), tone: "muted" }) : null,
          _.height_cm_min != null ? /* @__PURE__ */ s.jsx(
            z,
            {
              label: `${_.height_cm_min}${_.height_cm_max != null ? `–${_.height_cm_max}` : ""}cm`,
              tone: "muted"
            }
          ) : null,
          _.thc_min != null ? /* @__PURE__ */ s.jsx(z, { label: `${_.thc_min}% THC`, tone: "muted" }) : null
        ] }) : null,
        /* @__PURE__ */ s.jsx(Wr, { entityId: "input_text.dsc_build_nickname", label: "Nickname" }),
        /* @__PURE__ */ s.jsx(s1, { entityId: "input_datetime.dsc_build_sprout_date", label: "Sprout date" }),
        M ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { margin: "8px 0" }, children: [
          /* @__PURE__ */ s.jsx(z, { label: `Auto stage · ${M}`, tone: "ok" }),
          C ? /* @__PURE__ */ s.jsx(z, { label: `Day ${C}`, tone: "muted" }) : null
        ] }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: "6px 0 0", fontSize: 12 }, children: "Set a sprout date and the growth stage is calculated from it." }),
        /* @__PURE__ */ s.jsx(Fa, { entityId: "input_select.dsc_build_custom_slot", label: "Custom strain slot" })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Vessel + mix", icon: "compose", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
          /* @__PURE__ */ s.jsx(Hn, { spec: L, size: 48, label: !0 }),
          /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-chip", onClick: () => m("vessel"), children: L.label })
        ] }),
        /* @__PURE__ */ s.jsx(M1, { volumeL: L.volumeL || U }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", style: { marginTop: 8 }, children: /* @__PURE__ */ s.jsx(Br, { label: "Medium search", onClick: () => m("medium"), empty: !0 }) })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Nutrition", icon: "nutrient", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
          /* @__PURE__ */ s.jsx(Br, { label: "Add from catalog", onClick: () => m("nutrient"), empty: !0 }),
          /* @__PURE__ */ s.jsx(z, { label: `Tank ${se} L`, tone: "muted" }),
          /* @__PURE__ */ s.jsx(z, { label: `${Math.round(re * 100)}% strength`, tone: "muted" }),
          /* @__PURE__ */ s.jsx(z, { label: `${S.toFixed(1)} ml`, tone: S > 0 ? "ok" : "muted" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
          /* @__PURE__ */ s.jsx(Je, { entityId: "input_number.dsc_mix_tank_liters", label: "Tank L", step: 0.5 }),
          /* @__PURE__ */ s.jsx(Je, { entityId: "input_number.dsc_mix_strength_pct", label: "Strength %", step: 1 })
        ] }),
        ue.map((O) => /* @__PURE__ */ s.jsxs("div", { className: "dsc-nutrient-slot", children: [
          /* @__PURE__ */ s.jsx(Wr, { entityId: `input_text.dsc_nutrient_${O.n}_name`, label: `Slot ${O.n}` }),
          /* @__PURE__ */ s.jsx(Je, { entityId: `input_number.dsc_nutrient_${O.n}_dose_ml_l`, label: "ml/L", step: 0.1 }),
          /* @__PURE__ */ s.jsx("span", { className: "dsc-mono", children: O.empty ? "—" : `${O.ml} ml` }),
          O.short ? /* @__PURE__ */ s.jsx(z, { label: "stock short", tone: "warn" }) : null
        ] }, O.n)),
        /* @__PURE__ */ s.jsx(Wr, { entityId: "input_text.dsc_build_recipe_note", label: "Recipe note", multiline: !0 }),
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: "ml = dose × tank × strength. Empty slots stay empty." })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Light + assign", icon: "lighting", children: [
        /* @__PURE__ */ s.jsx(
          Br,
          {
            label: G && G !== "unknown" ? G : "No fixture",
            empty: !G || G === "unknown",
            onClick: () => m("light")
          }
        ),
        g ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { margin: "8px 0" }, children: [
          g.wattage_w != null ? /* @__PURE__ */ s.jsx(z, { label: `${g.wattage_w} W`, tone: "muted" }) : null,
          g.efficacy_umol_j != null ? /* @__PURE__ */ s.jsx(z, { label: `${g.efficacy_umol_j} µmol/J`, tone: "muted" }) : null,
          g.has_ppfd || g.ppfd_url ? /* @__PURE__ */ s.jsx(z, { label: "PPFD", tone: "ok" }) : /* @__PURE__ */ s.jsx(z, { label: "No PPFD URL", tone: "warn" })
        ] }) : null,
        /* @__PURE__ */ s.jsx(Fa, { entityId: "input_select.dsc_build_assign_pot", label: "Assign pot", icon: "root" }),
        /* @__PURE__ */ s.jsx(Fa, { entityId: "input_select.dsc_build_tent", label: "Tent", icon: "tent" }),
        /* @__PURE__ */ s.jsx(Fa, { entityId: "input_select.dsc_build_climate_pot", label: "Climate apply pot", icon: "climate" }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ s.jsx(ae, { variant: "primary", onClick: () => f("assign"), children: "Commit + assign" }),
          /* @__PURE__ */ s.jsx(ae, { variant: "secondary", onClick: () => f("roster"), children: "Commit roster" }),
          /* @__PURE__ */ s.jsx(ae, { variant: "secondary", onClick: () => f("seat"), children: "Assign seat" }),
          /* @__PURE__ */ s.jsx(ae, { variant: "danger", onClick: () => f("mix"), children: "Accept mix" }),
          /* @__PURE__ */ s.jsx(ae, { variant: "secondary", onClick: () => f("climate"), children: "Apply climate Want" }),
          /* @__PURE__ */ s.jsx(ae, { variant: "danger", onClick: () => f("retire"), children: "Retire pot" })
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginBottom: 0 }, children: "Each action asks you to confirm before anything is saved." })
      ] }) })
    ] }),
    /* @__PURE__ */ s.jsx(
      qe,
      {
        open: h === "strain" || h === "medium" || h === "nutrient" || h === "light",
        onDismiss: () => m(null),
        title: h ? `Search ${h}` : "Search",
        help: null,
        children: h === "strain" || h === "medium" || h === "nutrient" || h === "light" ? /* @__PURE__ */ s.jsx(Nb, { kind: h, onPick: (O) => ce(h, O) }) : null
      }
    ),
    /* @__PURE__ */ s.jsxs(qe, { open: h === "vessel", onDismiss: () => m(null), title: "Vessel", help: null, children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: Cd.map((O) => /* @__PURE__ */ s.jsxs(
        "button",
        {
          type: "button",
          className: `dsc-chip${O.id === L.id ? " dsc-chip--ok" : ""}`,
          onClick: () => {
            (i("input_select.dsc_build_vessel")?.attributes?.options || []).includes(O.id) && n("input_select.dsc_build_vessel") && d("input_select", "select_option", {
              entity_id: "input_select.dsc_build_vessel",
              option: O.id
            }), d("input_number", "set_value", {
              entity_id: "input_number.dsc_blend_total_l",
              value: O.volumeL
            }), m(null);
          },
          children: [
            /* @__PURE__ */ s.jsx(Hn, { spec: O, size: 28 }),
            " ",
            O.label
          ]
        },
        O.id
      )) }),
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { fontSize: 12 }, children: [
        "Default vessel: ",
        vi.label,
        "."
      ] }),
      n("input_select.dsc_build_vessel") ? /* @__PURE__ */ s.jsx(z, { label: "Vessel saved to hub", tone: "ok" }) : /* @__PURE__ */ s.jsx(z, { label: "Volume only — vessel presets unavailable", tone: "warn" })
    ] }),
    /* @__PURE__ */ s.jsx(
      qe,
      {
        open: p === "roster",
        onDismiss: () => f(null),
        onConfirm: () => {
          oe(), f(null);
        },
        title: "Commit roster",
        confirmLabel: "Write roster",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          "Saves ",
          N || w || "this plant",
          " with vessel ",
          L.label,
          " to the roster",
          E ? ` in the ${E} tent` : "",
          ". Pot assignment stays ",
          T === "none" ? "unset" : T,
          "."
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx(
      qe,
      {
        open: p === "assign",
        onDismiss: () => f(null),
        onConfirm: () => {
          ge(), f(null);
        },
        title: "Commit + assign",
        confirmLabel: "Write + assign",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          "Saves the roster entry, then assigns it to pot ",
          T === "none" ? "(none — pick a pot first)" : T,
          " in the ",
          E || "4x8",
          " tent and applies the ",
          L.label,
          " vessel to that pot.",
          M ? ` Stage is auto-set to ${M}.` : ""
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx(
      qe,
      {
        open: p === "seat",
        onDismiss: () => f(null),
        onConfirm: () => {
          me(T), d("script", "turn_on", {
            entity_id: "script.dsc_plant_assign_to_pot",
            pot: T,
            variables: { pot: T }
          }), f(null);
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
      qe,
      {
        open: p === "mix",
        onDismiss: () => f(null),
        onConfirm: () => {
          d("script", "turn_on", { entity_id: "script.dsc_accept_mix" }), f(null);
        },
        title: "Accept mix",
        confirmLabel: "Burn stock",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          "Deducts ",
          S.toFixed(1),
          " ml from nutrient stock — tank ",
          se,
          " L × ",
          Math.round(re * 100),
          "% strength. Empty slots are left untouched."
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx(
      qe,
      {
        open: p === "retire",
        onDismiss: () => f(null),
        onConfirm: () => {
          d("script", "turn_on", {
            entity_id: "script.dsc_plant_retire",
            pot: T,
            variables: { pot: T }
          }), f(null);
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
      qe,
      {
        open: p === "climate",
        onDismiss: () => f(null),
        onConfirm: () => {
          d("script", "turn_on", { entity_id: "script.dsc_apply_climate_want" }), f(null);
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
const sj = [
  { id: "strain", label: "Strains" },
  { id: "medium", label: "Mediums" },
  { id: "nutrient", label: "Nutrients" },
  { id: "light", label: "Lights" }
];
function lj(n, i) {
  return Array.isArray(n) && n.length >= 2 ? `${n[0]}–${n[1]}${i}` : n != null && n !== "" ? `${n}${i}` : "";
}
function y_(n, i) {
  const r = n;
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
      return lj(r.height_cm, "cm") || (r.height_cm_min != null ? `${r.height_cm_min}${r.height_cm_max != null ? `–${r.height_cm_max}` : ""}cm` : "—");
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
function ij(n) {
  switch (n) {
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
      return n;
  }
}
function rj() {
  const { state: n } = Me(), { callService: i } = Gt(), r = gt(), [o, d] = v.useState("strain"), [h, m] = v.useState(null), [p, f] = v.useState([]), [_, x] = v.useState(""), g = v.useMemo(() => ij(o), [o]);
  v.useEffect(() => {
    kb(o, "", n, 8).then((w) => x(w.note));
  }, [o]);
  const y = (w) => {
    w && (o === "strain" ? i("input_text", "set_value", { entity_id: "input_text.dsc_build_strain", value: w.name }) : o === "medium" ? i("input_text", "set_value", {
      entity_id: "input_text.dsc_blend_component_1_name",
      value: w.name
    }) : o === "nutrient" ? i("input_text", "set_value", { entity_id: "input_text.dsc_nutrient_1_name", value: w.name }) : o === "light" && i("input_text", "set_value", { entity_id: "input_text.dsc_light_custom_name", value: w.name }), r("/grow/compose"));
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-research", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: [
      sj.map((w) => /* @__PURE__ */ s.jsx(
        "button",
        {
          type: "button",
          className: `dsc-chip${o === w.id ? " dsc-chip--ok" : ""}`,
          onClick: () => {
            d(w.id), m(null), f([]);
          },
          children: w.label
        },
        w.id
      )),
      /* @__PURE__ */ s.jsx(z, { label: _ || "Catalog", tone: _.includes("local") ? "warn" : "ok" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(ie, { className: "dsc-glass", title: "Browse", icon: "research", children: /* @__PURE__ */ s.jsx(Nb, { kind: o, onPick: (w) => m(w) }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(ie, { className: "dsc-glass", title: "Detail", icon: "roster", children: h ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx("h3", { style: { marginTop: 0 }, children: h.name }),
        /* @__PURE__ */ s.jsx("dl", { className: "dsc-detail-list", children: g.map((w) => /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("dt", { children: w.label }),
          /* @__PURE__ */ s.jsx("dd", { children: y_(h, w.key) })
        ] }, w.key)) }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", children: [
          /* @__PURE__ */ s.jsx(ae, { primary: !0, onClick: () => y(h), children: "Use in Compose" }),
          /* @__PURE__ */ s.jsx(
            ae,
            {
              onClick: () => f(
                (w) => w.some((N) => (N.id || N.name) === (h.id || h.name)) ? w : [...w, h].slice(0, 3)
              ),
              children: "Add compare"
            }
          )
        ] })
      ] }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Pick an item to see its details. Fields without data stay blank." }) }) }),
      p.length ? /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Compare", icon: "analytics", children: [
        /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "Field" }),
            p.map((w) => /* @__PURE__ */ s.jsx("th", { children: w.name }, w.id || w.name))
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: g.map((w) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: w.label }),
            p.map((N) => /* @__PURE__ */ s.jsx("td", { children: y_(N, w.key) }, N.id || N.name))
          ] }, w.key)) })
        ] }),
        /* @__PURE__ */ s.jsx(ae, { onClick: () => f([]), children: "Clear compare" })
      ] }) }) : null
    ] })
  ] });
}
function oj({ pot: n }) {
  const { available: i, state: r, num: o } = Me(), d = r(`sensor.dsc_pot${n}_expected_stage`, "—"), h = r(`sensor.dsc_pot${n}_days_since_sprout`, "—"), m = r(`sensor.dsc_pot${n}_need_summary`, "—"), p = r(`binary_sensor.dsc_pot${n}_untrusted`) === "on", f = o(`sensor.dsc_pot${n}_dryback_pct`), _ = r(`input_select.dsc_pot${n}_tent`, "unassigned"), x = _ === "clone" ? r("light.dsc_hub_sf1000_dimmer") === "on" : r("binary_sensor.dsc_hub_4x8_window_open") === "on", g = _ === "clone" || _ === "main" ? x : !1, y = Number.isFinite(f) && f > 55 ? "dryback stress" : m !== "—" && m !== "ok" ? "Need" : "calm";
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-plant-extra", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
      /* @__PURE__ */ s.jsx(z, { label: g ? "Awake" : "Asleep", tone: g ? "ok" : "muted" }),
      /* @__PURE__ */ s.jsx(z, { label: `Day ${h}`, tone: "muted" }),
      /* @__PURE__ */ s.jsx(z, { label: d === "—" ? "No stage Got" : d, tone: d === "—" ? "muted" : "ok" }),
      /* @__PURE__ */ s.jsx(
        z,
        {
          label: p ? "Need blocked (untrusted)" : y,
          tone: p ? "warn" : y === "calm" ? "ok" : "warn"
        }
      )
    ] }),
    i(`sensor.dsc_pot${n}_expected_stage`) ? null : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: "No cultivar mesh. Missing fields stay empty." })
  ] });
}
function cj(n) {
  if (!n || n === "—") return -1;
  const i = Ab.findIndex((r) => n.indexOf(r) >= 0);
  return i >= 0 ? i : /flower/i.test(n) ? 6 : /veg/i.test(n) ? 3 : /seed/i.test(n) ? 1 : -1;
}
function ji({ compact: n }) {
  const { state: i, entity: r } = Me(), o = ca.map((N) => ({
    seat: _s(N, { state: i, entity: r }),
    oos: !nn(N, i)
  })), h = o.filter((N) => !N.oos).map((N) => cj(N.seat.stage)).filter((N) => N >= 0), m = new Set(h).size > 1, p = h.length ? Math.max(...h) : -1, f = i("binary_sensor.dsc_hub_4x8_window_open") === "on", _ = i("binary_sensor.dsc_hub_2x4_window_open") === "on", x = i("binary_sensor.dsc_hub_light_catchup_active") === "on", g = i("binary_sensor.dsc_clone_dark_period_violation") === "on", y = i("sensor.dsc_expected_light_hours", "—"), w = i("sensor.dsc_clone_expected_light_hours", "—");
  return /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Crop scheduler", icon: "roster", children: [
    /* @__PURE__ */ s.jsx("div", { className: "dsc-stage-track", "aria-label": "Stage track", children: Ab.map((N, T) => /* @__PURE__ */ s.jsx(
      "span",
      {
        className: `dsc-stage-pill${T === p ? " is-on" : ""}${T === p + 1 ? " is-next" : ""}`,
        children: N.replace("Late (Push) Vegetative", "Push Veg").replace("Final 48-72h Flowering", "Finish").replace("Early Vegetative", "Early Veg").replace("Early Flowering", "Early Flwr").replace("Late Flowering", "Late Flwr")
      },
      N
    )) }),
    m ? /* @__PURE__ */ s.jsx(z, { label: "Mixed stages in tents", tone: "warn" }) : null,
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { margin: "8px 0" }, children: [
      /* @__PURE__ */ s.jsx(z, { label: `4×8 ${f ? "window open" : "dark"} · Want ${y}h`, tone: f ? "ok" : "muted" }),
      /* @__PURE__ */ s.jsx(z, { label: `2×4 ${_ ? "window open" : "dark"} · Want ${w}h`, tone: _ ? "ok" : "muted" }),
      x ? /* @__PURE__ */ s.jsx(z, { label: "Catch-up", tone: "warn" }) : null,
      g ? /* @__PURE__ */ s.jsx(z, { label: "2×4 dark violation", tone: "bad", pulse: !0 }) : null
    ] }),
    /* @__PURE__ */ s.jsx("div", { className: `dsc-scheduler-lanes${n ? " is-compact" : ""}`, children: o.map(({ seat: N, oos: T }) => {
      const E = Number(N.days), M = Number.isFinite(E) ? Math.max(1, Math.ceil(E / 7)) : null;
      return /* @__PURE__ */ s.jsxs(
        "button",
        {
          type: "button",
          className: `dsc-scheduler-lane${T ? " is-oos" : ""}`,
          disabled: T,
          onClick: () => window.dispatchEvent(new CustomEvent("dsc-dash-select-pot", { detail: { pot: N.pot } })),
          children: [
            /* @__PURE__ */ s.jsx(Hn, { spec: Ya(N.pot, i, r), size: 16 }),
            /* @__PURE__ */ s.jsxs("strong", { children: [
              "P",
              N.pot
            ] }),
            /* @__PURE__ */ s.jsx("span", { children: T ? "Out of service" : N.plantName }),
            /* @__PURE__ */ s.jsx(z, { label: go(N.tent), tone: T || N.tent === "unassigned" ? "muted" : "ok" }),
            /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", children: T ? "—" : `W${M ?? "—"} · ${Number.isFinite(E) ? `${E}d` : "—"} · ${N.stage} · Need ${N.need}` })
          ]
        },
        N.pot
      );
    }) })
  ] });
}
function jo({
  pot: n,
  onSelectPot: i
}) {
  const { hass: r, state: o, entity: d, available: h, tick: m, num: p } = Me(), { callService: f } = Gt(), _ = gt(), x = _s(n, { state: o, entity: d }), [g, y] = v.useState(x.plantName === "—" ? "" : x.plantName), [w, N] = v.useState(x.sprout === "—" ? "" : x.sprout), [T, E] = v.useState(x.growthStage === "—" ? "" : x.growthStage), [M, C] = v.useState(x.notes === "—" ? "" : x.notes), [U, G] = v.useState(null), [X, L] = v.useState(null), [V, te] = v.useState(null);
  v.useEffect(() => {
    y(x.plantName === "—" ? "" : x.plantName), N(x.sprout === "—" ? "" : x.sprout), E(x.growthStage === "—" ? "" : x.growthStage), C(x.notes === "—" ? "" : x.notes), G(null);
  }, [n]);
  const re = Sn(n, "moisture", o), se = Sn(n, "ec", o), ce = Sn(n, "ph", o), me = `sensor.dsc_pot${n}_dryback_pct`, oe = we(re), ge = we(me), ue = we(se), S = we(ce), O = Ne(re, { hours: 6, maxPoints: 72 }), q = Ne(se, { hours: 6, maxPoints: 72 }), J = p(`input_number.dsc_pot${n}_learned_ec_per_moisture`), I = h(`input_number.dsc_pot${n}_learned_ec_per_moisture`) && Number.isFinite(J) && J !== 0 ? J : NaN, k = h(`sensor.dsc_pot${n}_want_moisture_min`) ? p(`sensor.dsc_pot${n}_want_moisture_min`) : p(`number.dsc_pot${n}_want_moisture_min`), $ = h(`sensor.dsc_pot${n}_want_moisture_max`) ? p(`sensor.dsc_pot${n}_want_moisture_max`) : p(`number.dsc_pot${n}_want_moisture_max`), Z = p(`sensor.dsc_pot${n}_want_ec_min`), ne = p(`sensor.dsc_pot${n}_want_ec_max`), de = p(`sensor.dsc_pot${n}_want_ph_min`), Q = p(`sensor.dsc_pot${n}_want_ph_max`), le = Number.isFinite(k) && Number.isFinite($) && (h(`sensor.dsc_pot${n}_want_moisture_min`) || h(`number.dsc_pot${n}_want_moisture_min`)), xe = Number.isFinite(Z) && Number.isFinite(ne), je = Number.isFinite(de) && Number.isFinite(Q), st = !x.strainDisplay || x.strainDisplay === "—" || /generic/i.test(x.strainDisplay), et = async (_e) => {
    G(null);
    try {
      await f("input_select", "select_option", {
        entity_id: `input_select.dsc_pot${n}_tent`,
        option: _e
      }), window.setTimeout(() => {
        (r?.states?.[`input_select.dsc_pot${n}_tent`]?.state || "") !== _e && G("Tent change did not stick — the hub rejected it. Try again.");
      }, 400);
    } catch {
      G("Tent change did not stick — the hub rejected it. Try again.");
    }
  }, ke = () => {
    h(`text.dsc_pot${n}_plant_name`) && f("text", "set_value", {
      entity_id: `text.dsc_pot${n}_plant_name`,
      value: g
    });
  }, rt = () => {
    const _e = `datetime.dsc_pot${n}_sprout_date`;
    if (!h(_e) || !w) return;
    const Ye = w.length === 10 ? `${w}T00:00:00` : w;
    f("datetime", "set_value", { entity_id: _e, datetime: Ye });
  }, he = () => {
    if (x.rosterSlot == null) return;
    const _e = `input_text.dsc_plant_roster_${x.rosterSlot}_notes`;
    !h(_e) && d(_e), f("input_text", "set_value", { entity_id: _e, value: M });
  }, Fe = d(`select.dsc_pot${n}_growth_stage`)?.attributes?.options || [];
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-seat-panel", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 14 }, children: [
      Ed(o).map((_e) => /* @__PURE__ */ s.jsxs(
        "button",
        {
          type: "button",
          className: `dsc-chip${_e === n ? " dsc-chip--ok" : ""}`,
          onClick: () => i?.(_e),
          children: [
            /* @__PURE__ */ s.jsx(Hn, { spec: Ya(_e, o, d), size: 16 }),
            " P",
            _e
          ]
        },
        _e
      )),
      /* @__PURE__ */ s.jsx(z, { label: go(x.tent), tone: x.tent === "unassigned" ? "muted" : "ok" }),
      x.rosterSlot != null ? /* @__PURE__ */ s.jsx(z, { label: `Roster #${x.rosterSlot}`, tone: "muted" }) : /* @__PURE__ */ s.jsx(z, { label: "Not on roster", tone: "warn" }),
      oe.stale ? /* @__PURE__ */ s.jsx(z, { label: "Reading held", tone: "warn" }) : null
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-seat-layout", children: [
      /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass dsc-glass--glow", title: "Medium", children: [
        /* @__PURE__ */ s.jsx(g1, { layers: x.layers, spec: Ya(n, o, d) }),
        /* @__PURE__ */ s.jsx(oj, { pot: n }),
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 10, fontSize: 12 }, children: x.blend || "No blend recorded yet — it appears here after you commit the plant." })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", style: { gap: 14 }, children: [
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ie, { className: "dsc-glass", title: "Identity", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-seat-editors", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "Nickname",
            /* @__PURE__ */ s.jsx(
              "input",
              {
                value: g,
                onChange: (_e) => y(_e.target.value),
                onBlur: ke,
                disabled: !h(`text.dsc_pot${n}_plant_name`)
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
                onChange: (_e) => N(_e.target.value),
                onBlur: rt,
                disabled: !h(`datetime.dsc_pot${n}_sprout_date`)
              }
            )
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "Growth stage",
            /* @__PURE__ */ s.jsxs(
              "select",
              {
                value: T,
                onChange: (_e) => {
                  const Ye = _e.target.value;
                  if (E(Ye), !Ye) return;
                  const Xe = `select.dsc_pot${n}_growth_stage`;
                  h(Xe) && f("select", "select_option", { entity_id: Xe, option: Ye });
                },
                disabled: !h(`select.dsc_pot${n}_growth_stage`),
                children: [
                  /* @__PURE__ */ s.jsx("option", { value: "", children: "—" }),
                  Fe.map((_e) => /* @__PURE__ */ s.jsx("option", { value: _e, children: _e }, _e))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
            /* @__PURE__ */ s.jsx(z, { label: `Day ${x.days}`, tone: "ok" }),
            /* @__PURE__ */ s.jsx(z, { label: x.stage, tone: "muted" }),
            /* @__PURE__ */ s.jsx(z, { label: x.strainDisplay, tone: "muted" })
          ] }),
          /* @__PURE__ */ s.jsx(
            bo,
            {
              items: [
                {
                  id: "compose",
                  label: "Open Compose (strain/catalog)",
                  onSelect: () => _("/grow/compose")
                },
                {
                  id: "root",
                  label: "Root zone",
                  onSelect: () => _("/live/root")
                },
                {
                  id: "twin",
                  label: "Open Twin",
                  onSelect: () => _("/live/twin")
                }
              ]
            }
          )
        ] }) }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Want · Got · Need", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
            /* @__PURE__ */ s.jsx(
              z,
              {
                label: `Got M ${oe.stale ? `${Number.isFinite(oe.value) ? oe.value.toFixed(0) : "—"}*` : x.moisture}`,
                tone: oe.stale ? "warn" : "ok"
              }
            ),
            /* @__PURE__ */ s.jsx(z, { label: `EC ${x.ec}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(z, { label: `pH ${x.ph}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(
              z,
              {
                label: x.need,
                tone: x.need !== "—" && x.need !== "OK" ? "warn" : "ok"
              }
            )
          ] }),
          le && !st ? /* @__PURE__ */ s.jsx(
            $b,
            {
              rows: [
                {
                  label: "Moisture",
                  got: oe.value,
                  stale: oe.stale,
                  wantMin: k,
                  wantMax: $,
                  unit: "%"
                },
                {
                  label: "EC",
                  got: ue.value,
                  stale: ue.stale,
                  wantMin: xe ? Z : void 0,
                  wantMax: xe ? ne : void 0
                },
                {
                  label: "pH",
                  got: S.value,
                  stale: S.stale,
                  wantMin: je ? de : void 0,
                  wantMax: je ? Q : void 0
                }
              ]
            }
          ) : /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", style: { margin: "8px 0 0" }, children: [
            /* @__PURE__ */ s.jsx(z, { label: "No target bands", tone: "warn" }),
            " ",
            st ? "No strain selected — target bands are unknown." : "Custom targets not set — showing measurements only."
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "dsc-kpi-sub", children: "Need compares the catalog targets against what was measured." })
        ] }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(ie, { className: "dsc-glass", title: "Dryback", children: /* @__PURE__ */ s.jsx(
          Ie,
          {
            label: "Dryback",
            value: ge.value,
            min: 0,
            max: 100,
            unit: "%",
            stale: ge.stale,
            band: { min: 0, max: 45 },
            onClick: () => te({ id: me, label: "Dryback", unit: "%" })
          }
        ) }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Got history", children: [
          /* @__PURE__ */ s.jsx(
            Tn,
            {
              live: !0,
              lastSyncAt: Math.max(O.lastSyncAt ?? 0, q.lastSyncAt ?? 0) || void 0,
              series: [
                {
                  id: "m",
                  label: "Moisture",
                  series: O.series,
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
            /* @__PURE__ */ s.jsx(ae, { onClick: () => te({ id: re, label: "Moisture", unit: "%" }), children: "Moisture hist" }),
            /* @__PURE__ */ s.jsx(ae, { onClick: () => te({ id: se, label: "EC", unit: "" }), children: "EC hist" }),
            /* @__PURE__ */ s.jsx(ae, { onClick: () => te({ id: ce, label: "pH", unit: "" }), children: "pH hist" })
          ] })
        ] }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Nutrition", children: [
          /* @__PURE__ */ s.jsx("p", { style: { margin: "0 0 6px" }, children: x.recipe || "No recipe recorded for this plant — catalog doses shown only." }),
          /* @__PURE__ */ s.jsxs("label", { className: "dsc-seat-editors", children: [
            "Roster notes",
            /* @__PURE__ */ s.jsx(
              "textarea",
              {
                rows: 3,
                value: M,
                onChange: (_e) => C(_e.target.value),
                onBlur: he,
                disabled: x.rosterSlot == null
              }
            )
          ] }),
          /* @__PURE__ */ s.jsx("div", { style: { marginTop: 10 }, children: /* @__PURE__ */ s.jsx(cl, { to: "/grow/compose", children: /* @__PURE__ */ s.jsx(ae, { teal: !0, children: "Mix in Compose" }) }) })
        ] }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Live Got chips", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
            /* @__PURE__ */ s.jsx(z, { label: `M ${x.moisture}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(z, { label: `T ${x.soilTemp}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(z, { label: `EC ${x.ec}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(z, { label: `pH ${x.ph}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(z, { label: `N ${x.n}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(z, { label: `P ${x.p}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(z, { label: `K ${x.k}`, tone: "muted" })
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: "NPK = trend indicators. Unavailable stays —. Held shows last good on blip." })
        ] }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Apply to tent", children: [
          /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "Digital-twin placement. Moves the plant on Twin; does not rewrite climate Want." }),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-seat-actions", children: [
            /* @__PURE__ */ s.jsx(ae, { primary: x.tent === "clone", onClick: () => L("clone"), children: "2×4" }),
            /* @__PURE__ */ s.jsx(ae, { primary: x.tent === "main", onClick: () => L("main"), children: "4×8" }),
            /* @__PURE__ */ s.jsx(ae, { onClick: () => L("unassigned"), children: "Unassigned" }),
            /* @__PURE__ */ s.jsx(cl, { to: "/live/twin", children: /* @__PURE__ */ s.jsx(ae, { children: "Open Twin" }) })
          ] }),
          /* @__PURE__ */ s.jsx(
            qe,
            {
              open: X != null,
              onDismiss: () => L(null),
              onConfirm: () => {
                const _e = X;
                L(null), _e && et(_e);
              },
              title: X === "clone" ? "Move plant to 2×4" : X === "main" ? "Move plant to 4×8" : "Unassign tent",
              confirmLabel: "Apply tent",
              help: null,
              children: /* @__PURE__ */ s.jsxs("p", { children: [
                "Updates pot ",
                n,
                " placement on the Twin. Climate Want is unchanged — use Climate or Compose for targets."
              ] })
            }
          ),
          U ? /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
            /* @__PURE__ */ s.jsx(z, { label: "Tent apply failed", tone: "bad" }),
            " ",
            U
          ] }) : null
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ s.jsx(
      Y1,
      {
        open: V != null,
        onClose: () => te(null),
        entityId: V?.id ?? null,
        label: V?.label ?? "",
        unit: V?.unit
      }
    )
  ] });
}
function uj() {
  const n = gt();
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      zt,
      {
        icon: "compose",
        title: "Compose",
        subtitle: "Build soil blend, roster commit, and Want handoff.",
        primaryAction: /* @__PURE__ */ s.jsx(ae, { teal: !0, onClick: () => n("/grow/roster"), children: "Open Roster / Seat" }),
        actions: /* @__PURE__ */ s.jsx(ae, { primary: !0, onClick: () => n("/grow/research"), children: "Browse Catalog" })
      }
    ),
    /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Catalog traits (height, flowering, chemistry) appear when the catalog has real data — empty fields stay empty. After committing, open Roster to assign a seat." }),
    /* @__PURE__ */ s.jsx(aj, {})
  ] });
}
function dj() {
  const n = gt();
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      zt,
      {
        icon: "research",
        title: "Research",
        subtitle: "Live CannaLib catalog — strains, mediums, nutrients, and lights.",
        actions: /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(ae, { primary: !0, onClick: () => n("/grow/compose"), children: "Use in Compose" }),
          /* @__PURE__ */ s.jsx(ae, { teal: !0, onClick: () => n("/grow/roster"), children: "Open Seat" })
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Height, flowering, and chemistry chips appear only when the catalog has real data — gaps are shown as gaps. Use in Compose to draft a plant, or Open Seat to work with a plant already on the roster." }),
    /* @__PURE__ */ s.jsx(rj, {})
  ] });
}
function hj() {
  const { entity: n, state: i, tick: r } = Me(), [o, d] = po(), h = jb(n), m = Number(o.get("pot") || 0), p = m >= 1 && m <= 4 && nn(m, i) ? m : null, f = (x) => {
    if (!nn(x, i)) return;
    const g = new URLSearchParams(o);
    g.set("pot", String(x)), d(g, { replace: !0 });
  }, _ = () => {
    const x = new URLSearchParams(o);
    x.delete("pot"), d(x, { replace: !0 });
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      zt,
      {
        icon: "roster",
        title: "Roster",
        subtitle: "Seats — open a row for Plant Seat drawer. Nutrient mix lives in Compose.",
        primaryAction: /* @__PURE__ */ s.jsx(cl, { to: "/grow/compose", children: /* @__PURE__ */ s.jsx(ae, { primary: !0, children: "Use in Compose" }) })
      }
    ),
    /* @__PURE__ */ s.jsx("div", { style: { marginBottom: 14 }, children: /* @__PURE__ */ s.jsx(ji, { compact: !0 }) }),
    /* @__PURE__ */ s.jsx(ie, { className: "dsc-glass", title: "Roster", icon: "roster", children: h.length ? /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", children: [
      /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
        /* @__PURE__ */ s.jsx("th", { children: "Slot" }),
        /* @__PURE__ */ s.jsx("th", { children: "Name" }),
        /* @__PURE__ */ s.jsx("th", { children: "Strain" }),
        /* @__PURE__ */ s.jsx("th", { children: "Status" }),
        /* @__PURE__ */ s.jsx("th", { children: "Pot" }),
        /* @__PURE__ */ s.jsx("th", { children: "Need" }),
        /* @__PURE__ */ s.jsx("th", { children: "Tent" })
      ] }) }),
      /* @__PURE__ */ s.jsx("tbody", { children: h.map((x) => {
        const g = Number(x.pot), y = g >= 1 && g <= 4, w = y && nn(g, i), N = y ? so(i, g) : "unassigned", T = go(N !== "unassigned" ? N : vb(x.tent)), E = y ? i(`sensor.dsc_pot${g}_need_summary`, "—") : "—", M = y ? Ya(g, i, n) : null;
        return /* @__PURE__ */ s.jsxs(
          "tr",
          {
            onClick: () => {
              w && f(g);
            },
            style: w ? { cursor: "pointer" } : void 0,
            children: [
              /* @__PURE__ */ s.jsxs("td", { children: [
                "#",
                x.slot
              ] }),
              /* @__PURE__ */ s.jsx("td", { children: x.nickname || "—" }),
              /* @__PURE__ */ s.jsx("td", { children: x.strain || "—" }),
              /* @__PURE__ */ s.jsx("td", { children: x.status || "—" }),
              /* @__PURE__ */ s.jsx("td", { children: y ? /* @__PURE__ */ s.jsxs("span", { className: "dsc-chip-row", children: [
                M ? /* @__PURE__ */ s.jsx(Hn, { spec: M, size: 22 }) : null,
                "P",
                g,
                w ? null : /* @__PURE__ */ s.jsx(z, { label: "Out of service", tone: "warn" })
              ] }) : "—" }),
              /* @__PURE__ */ s.jsx("td", { children: E }),
              /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx(z, { label: T, tone: "muted" }) })
            ]
          },
          x.slot
        );
      }) })
    ] }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "No plants in roster yet. Commit from Compose, then assign a pot." }) }),
    /* @__PURE__ */ s.jsx(
      Xa,
      {
        open: p != null,
        onClose: _,
        title: p != null ? `Plant seat · POT${p}` : "Plant seat",
        children: p != null ? /* @__PURE__ */ s.jsx(jo, { pot: p, onSelectPot: f }) : null
      }
    )
  ] });
}
function mj() {
  const [n, i] = v.useState(null), r = gt(), o = Ft();
  v.useEffect(() => {
    const m = (p) => {
      const f = p.detail, _ = Number(f?.pot);
      _ >= 1 && _ <= 4 && i(_);
    };
    return window.addEventListener("dsc-dash-select-pot", m), () => window.removeEventListener("dsc-dash-select-pot", m);
  }, []);
  const d = v.useCallback(() => i(null), []);
  return /* @__PURE__ */ s.jsx(
    qe,
    {
      open: n != null,
      onDismiss: d,
      title: n != null ? `Plant seat · POT${n}` : "Plant seat",
      help: null,
      children: n != null ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx(jo, { pot: n, onSelectPot: i }),
        o.pathname !== "/live/root" ? /* @__PURE__ */ s.jsx("div", { className: "dsc-row-actions", style: { marginTop: 12 }, children: /* @__PURE__ */ s.jsx(
          ae,
          {
            teal: !0,
            onClick: () => {
              const m = n;
              d(), r(`/live/root?pot=${m}`);
            },
            children: "Open Root"
          }
        ) }) : null
      ] }) : null
    }
  );
}
function ht(n, i, r, o, d, h) {
  const m = { id: n, label: i, series: r.series, color: o, unit: d, ...h };
  return r.ghost.length <= 1 ? [m] : [
    m,
    { id: `${n}-ghost`, label: `${i} prior`, series: r.ghost, color: o, unit: d, ghost: !0 }
  ];
}
const Xb = v.createContext(null), zn = {
  main: "var(--dsc-blue)",
  clone: "var(--dsc-teal)",
  room: "var(--dsc-gray-5)"
};
function fj(n) {
  return n("sensor.dsc_hub_room_vpd_kpa") ? "sensor.dsc_hub_room_vpd_kpa" : n("sensor.dsc_hub_room_vpd") ? "sensor.dsc_hub_room_vpd" : "sensor.dsc_hub_room_vpd_kpa";
}
function pj({ target: n, onClose: i }) {
  const { num: r, entity: o } = Me(), d = n?.kind.startsWith("pot") ? 48 : 24, { hours: h, setHours: m, maxPoints: p } = ml(d);
  v.useEffect(() => {
    n && m(d);
  }, [n, d, m]);
  const f = Math.min(Math.max(p, 96), 288), _ = Ne("sensor.dsc_hub_tent_temperature", { hours: h, maxPoints: f, withGhost: !0 }), x = Ne("sensor.dsc_hub_clone_temperature", { hours: h, maxPoints: f, withGhost: !0 }), g = Ne("sensor.dsc_hub_room_temperature", { hours: h, maxPoints: f, withGhost: !0 }), y = Ne("sensor.dsc_hub_tent_humidity", { hours: h, maxPoints: f, withGhost: !0 }), w = Ne("sensor.dsc_hub_clone_humidity", { hours: h, maxPoints: f, withGhost: !0 }), N = Ne("sensor.dsc_hub_room_humidity", { hours: h, maxPoints: f, withGhost: !0 }), T = Ne("sensor.dsc_hub_vpd_kpa", { hours: h, maxPoints: f, withGhost: !0 }), E = Ne("sensor.dsc_hub_clone_vpd_kpa", { hours: h, maxPoints: f, withGhost: !0 }), M = fj(o), C = Ne(M, { hours: h, maxPoints: f, withGhost: !0 }), U = Ne("sensor.dsc_coldest_root_zone_temp", { hours: h, maxPoints: f, withGhost: !0 }), G = Ne("sensor.dsc_pot1_soil_moisture", { hours: h, maxPoints: f, withGhost: !0 }), X = Ne("sensor.dsc_pot2_soil_moisture", { hours: h, maxPoints: f, withGhost: !0 }), L = Ne("sensor.dsc_pot3_soil_moisture", { hours: h, maxPoints: f, withGhost: !0 }), V = Ne("sensor.dsc_pot4_soil_moisture", { hours: h, maxPoints: f, withGhost: !0 }), te = Ne("sensor.dsc_pot1_soil_temperature", { hours: h, maxPoints: f, withGhost: !0 }), re = Ne("sensor.dsc_pot2_soil_temperature", { hours: h, maxPoints: f, withGhost: !0 }), se = Ne("sensor.dsc_pot3_soil_temperature", { hours: h, maxPoints: f, withGhost: !0 }), ce = Ne("sensor.dsc_pot4_soil_temperature", { hours: h, maxPoints: f, withGhost: !0 }), me = r("number.dsc_hub_target_temp", 25), oe = r("number.dsc_hub_clone_target_temp", 24), ge = r("number.dsc_hub_rh_target_min", 45), ue = r("number.dsc_hub_rh_target_max", 70), S = r("number.dsc_hub_clone_rh_min", 55), O = r("number.dsc_hub_clone_rh_max", 75), q = r("number.dsc_hub_vpd_target_min", 0.8), J = r("number.dsc_hub_vpd_target_max", 1.4), I = r("number.dsc_hub_clone_vpd_min", 0.6), k = r("number.dsc_hub_clone_vpd_max", 1.2), $ = r("number.dsc_hub_mat_root_zone_low", 20), Z = r("number.dsc_hub_mat_root_zone_high", 24), ne = v.useMemo(() => {
    if (!n) return null;
    switch (n.kind) {
      case "temp":
        return {
          unit: "°C",
          height: 380,
          series: [
            ...ht("mt", "4×8 Tent", _, zn.main, "°C"),
            ...ht("ct", "2×4 Clone", x, zn.clone, "°C"),
            ...ht("rt", "Room", g, zn.room, "°C")
          ],
          targets: [
            { value: me, color: "var(--dsc-blue-dim)", label: "4×8 target" },
            { value: oe, color: "var(--dsc-teal-dim)", label: "2×4 target" }
          ]
        };
      case "rh":
        return {
          unit: "%",
          height: 380,
          yDomain: { left: { min: 0, max: 100 } },
          series: [
            ...ht("mrh", "4×8 Tent", y, zn.main, "%"),
            ...ht("crh", "2×4 Clone", w, zn.clone, "%"),
            ...ht("rrh", "Room", N, zn.room, "%")
          ],
          targets: [
            { min: ge, max: ue, color: "var(--dsc-blue-dim)" },
            { min: S, max: O, color: "var(--dsc-teal-dim)" }
          ]
        };
      case "vpd":
        return {
          unit: "kPa",
          height: 380,
          series: [
            ...ht("rv", "Room", C, zn.room, "kPa"),
            ...ht("mv", "4×8 Tent", T, zn.main, "kPa"),
            ...ht("cv", "2×4 Clone", E, zn.clone, "kPa")
          ],
          targets: [
            { min: q, max: J, color: "var(--dsc-blue-dim)" },
            { min: I, max: k, color: "var(--dsc-teal-dim)" }
          ]
        };
      case "root":
        return {
          unit: "°C",
          height: 380,
          series: [...ht("root", "Root coldest", U, "#fbbf24", "°C")],
          targets: [{ min: $, max: Z, color: "#22c55e88" }]
        };
      default: {
        const le = Number(n.kind.replace("pot", "")), xe = [G, X, L, V][le - 1], je = [te, re, se, ce][le - 1];
        return {
          unit: "%",
          height: 320,
          yDomain: { left: { min: 0, max: 100 }, right: { min: 10, max: 35 } },
          series: [
            ...ht(`pm${le}`, "Moisture", xe, "#3b82f6", "%", { axis: "left" }),
            ...ht(`pt${le}`, "Soil °C", je, zn.main, "°C", { axis: "right" })
          ],
          targets: [{ value: 30, color: "#ef444488", label: "dry 30%" }]
        };
      }
    }
  }, [
    n,
    _,
    x,
    g,
    y,
    w,
    N,
    T,
    E,
    C,
    U,
    G,
    X,
    L,
    V,
    te,
    re,
    se,
    ce,
    me,
    oe,
    ge,
    ue,
    S,
    O,
    q,
    J,
    I,
    k,
    $,
    Z
  ]), de = ne ? ne.series.every((le) => le.series.length < 2) : !0, Q = ne && Math.max(
    ...ne.series.map((le) => le.series[le.series.length - 1]?.t ?? 0),
    0
  ) || void 0;
  return /* @__PURE__ */ s.jsxs(Xa, { open: !!n, onClose: i, title: n?.title ?? "History", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ s.jsx(pl, { hours: h, setHours: m, extras: fl }),
      de ? /* @__PURE__ */ s.jsx(z, { label: "Thin recorder", tone: "warn" }) : null
    ] }),
    ne ? /* @__PURE__ */ s.jsx(
      Tn,
      {
        live: !0,
        height: ne.height,
        unit: ne.unit,
        lastSyncAt: Q,
        series: ne.series,
        targets: ne.targets,
        yDomain: ne.yDomain
      }
    ) : null,
    /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 10, fontSize: 12 }, children: "Multi-zone history — same series as HA Home gauge popups." })
  ] });
}
function _j({ children: n }) {
  const [i, r] = v.useState(null), o = v.useCallback(() => r(null), []), d = v.useCallback((m) => r(m), []), h = v.useMemo(() => ({ open: d, close: o }), [d, o]);
  return /* @__PURE__ */ s.jsxs(Xb.Provider, { value: h, children: [
    n,
    /* @__PURE__ */ s.jsx(pj, { target: i, onClose: o })
  ] });
}
function Qb() {
  const n = v.useContext(Xb);
  return n || { open: () => {
  }, close: () => {
  } };
}
const Pb = {
  temp: "Temperature — 24h",
  rh: "Humidity — 24h",
  vpd: "VPD — 24h",
  root: "Soil temperature — 24h",
  pot1: "POT1 — moisture & soil temp",
  pot2: "POT2 — moisture & soil temp",
  pot3: "POT3 — moisture & soil temp",
  pot4: "POT4 — moisture & soil temp"
}, Zb = v.createContext(null);
function bj(n) {
  return n === "clone" || n === "compare" || n === "room" || n === "main" ? n : "main";
}
function gj({ children: n }) {
  const [i, r] = po(), o = bj(i.get("tent") ?? i.get("zone")), d = v.useCallback(
    (m) => {
      const p = new URLSearchParams(i);
      p.set("tent", m), p.delete("zone"), r(p, { replace: !0 });
    },
    [i, r]
  ), h = v.useMemo(() => ({ focus: o, setFocus: d }), [o, d]);
  return /* @__PURE__ */ s.jsx(Zb.Provider, { value: h, children: n });
}
function Dd() {
  const n = v.useContext(Zb);
  return n || {
    focus: "main",
    setFocus: () => {
    }
  };
}
function Ld() {
  const { online: n, uptime: i, heartbeat: r } = ob(), o = Ot(), { state: d, available: h } = Me(), m = h("sensor.dsc_hub_api_down_age") ? d("sensor.dsc_hub_api_down_age", "—") : i != null ? String(i) : "—", p = h("sensor.dsc_hub_link_recovery_bounces") ? d("sensor.dsc_hub_link_recovery_bounces", "—") : "—", f = h("sensor.dsc_hub_rf_status") ? d("sensor.dsc_hub_rf_status", "—") : "—", _ = h("sensor.dsc_hub_ha_handshake_age") ? d("sensor.dsc_hub_ha_handshake_age", "—") : r != null ? String(r) : "—";
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
    /* @__PURE__ */ s.jsx(
      z,
      {
        icon: n ? "ok" : "alert",
        label: n ? "HUB LINK" : "HUB LINK DOWN",
        tone: n ? "ok" : "bad"
      }
    ),
    /* @__PURE__ */ s.jsx(z, { label: `Age ${m}`, tone: "muted" }),
    /* @__PURE__ */ s.jsx(z, { label: `Bounces ${p}`, tone: "muted" }),
    /* @__PURE__ */ s.jsx(z, { label: `RF ${f}`, tone: "muted" }),
    /* @__PURE__ */ s.jsx(z, { label: `Beat ${_}`, tone: "muted" }),
    o.surface ? /* @__PURE__ */ s.jsx(z, { label: o.surface, tone: "muted" }) : null
  ] });
}
const xj = "_allocated";
function bt(n, i, r) {
  const o = r.num(i);
  return r.forceKind === "mass-balance" ? {
    value: r.num(n, o),
    kind: "mass-balance",
    entityId: n,
    nameplate: Number.isFinite(o) ? o : void 0
  } : r.available(n) && Number.isFinite(r.num(n)) ? {
    value: r.num(n),
    kind: n.endsWith(xj) ? "allocated" : "nameplate",
    entityId: n,
    nameplate: Number.isFinite(o) ? o : void 0
  } : {
    value: o,
    kind: "nameplate",
    entityId: i,
    nameplate: Number.isFinite(o) ? o : void 0
  };
}
function vj(n) {
  switch (n) {
    case "allocated":
      return "Allocated";
    case "nameplate":
      return "Nameplate";
    case "mass-balance":
      return "Mass-balance";
    default:
      return n;
  }
}
function wo({ readings: n }) {
  const i = n.some((o) => o.kind === "nameplate"), r = n.some((o) => o.kind === "allocated" || o.kind === "mass-balance");
  return i && !r ? /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { margin: "0 0 8px" }, children: "CFM guessed from fan % × nameplate — run Learning to measure." }) : i && r ? /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { margin: "0 0 8px" }, children: "Mixed CFM trust — some ducts from Learning, others still nameplate. Run Learning on the dashed paths." }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { margin: "0 0 8px" }, children: "CFM from Learning (anemometer)." });
}
const yj = [
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
  ...ca.map(
    (n) => ({
      id: `pot${n}`,
      label: `Pot ${n}`,
      inServiceEntity: `input_boolean.dsc_pot${n}_in_service`,
      plannedWhenOff: n === 3,
      firmwareEntity: `sensor.dsc_pot${n}_firmware_version`
    })
  ),
  {
    id: "tank",
    label: "Tank",
    inServiceEntity: "input_boolean.dsc_tank_in_service",
    plannedWhenOff: !0
  }
];
function jj(n) {
  return n.linkEntity || n.relayEntity || n.demandEntity || n.inServiceEntity || n.firmwareEntity || "";
}
function Hd(n) {
  return yj.map((i) => wj(i, n));
}
function wj(n, i) {
  const r = jj(n), o = i.hub.online;
  if (n.id === "hub")
    return {
      id: n.id,
      label: n.label,
      status: i.hub.online ? "ok" : "dark",
      entityId: "binary_sensor.dsc_hub_link",
      firmwareEntity: n.firmwareEntity
    };
  if (n.inServiceEntity && !(n.id.startsWith("pot") && n.id.length === 4, rl(i, n.id)))
    return {
      id: n.id,
      label: n.label,
      status: "oos",
      subtitle: n.plannedWhenOff ? "Not installed" : "Out of service",
      entityId: n.inServiceEntity,
      inServiceEntity: n.inServiceEntity,
      plannedOos: n.plannedWhenOff,
      runtimeToday: n.runtimeToday,
      cyclesToday: n.cyclesToday,
      demandEntity: n.demandEntity,
      firmwareEntity: n.firmwareEntity
    };
  const d = i.sonoffs[n.id], h = i.pots[n.id], m = d?.online ?? h?.online ?? !1, p = n.inServiceEntity ? rl(i, n.id) : !0;
  if (n.id.startsWith("pot"))
    return p ? m ? {
      id: n.id,
      label: n.label,
      status: "idle",
      subtitle: "Idle",
      entityId: n.firmwareEntity ?? r,
      inServiceEntity: n.inServiceEntity,
      firmwareEntity: n.firmwareEntity
    } : {
      id: n.id,
      label: n.label,
      status: p ? "dark" : "missing",
      subtitle: p ? "No data" : void 0,
      entityId: n.firmwareEntity ?? r,
      inServiceEntity: n.inServiceEntity,
      firmwareEntity: n.firmwareEntity
    } : {
      id: n.id,
      label: n.label,
      status: "oos",
      subtitle: n.plannedWhenOff ? "Not installed" : "Out of service",
      entityId: n.inServiceEntity ?? r,
      inServiceEntity: n.inServiceEntity,
      plannedOos: n.plannedWhenOff,
      firmwareEntity: n.firmwareEntity
    };
  if (d) {
    if (!m)
      return {
        id: n.id,
        label: n.label,
        status: p ? "dark" : "missing",
        subtitle: p ? "No data" : void 0,
        entityId: n.relayEntity ?? n.demandEntity ?? r,
        inServiceEntity: n.inServiceEntity,
        runtimeToday: n.runtimeToday,
        cyclesToday: n.cyclesToday,
        demandEntity: n.demandEntity,
        firmwareEntity: n.firmwareEntity
      };
    const f = d.values.relay_on === !0;
    return {
      id: n.id,
      label: n.label,
      status: f ? "ok" : "idle",
      subtitle: f ? "Running" : "Idle",
      entityId: n.demandEntity || n.relayEntity || r,
      inServiceEntity: n.inServiceEntity,
      runtimeToday: n.runtimeToday,
      cyclesToday: n.cyclesToday,
      demandEntity: n.demandEntity,
      firmwareEntity: n.firmwareEntity
    };
  }
  return n.id === "tank" || n.id === "ac" || n.id === "mister" ? rl(i, n.id) ? {
    id: n.id,
    label: n.label,
    status: "idle",
    subtitle: "Idle",
    entityId: n.inServiceEntity ?? r,
    inServiceEntity: n.inServiceEntity
  } : {
    id: n.id,
    label: n.label,
    status: "oos",
    subtitle: n.plannedWhenOff ? "Not installed" : "Out of service",
    entityId: n.inServiceEntity ?? r,
    inServiceEntity: n.inServiceEntity,
    plannedOos: n.plannedWhenOff
  } : {
    id: n.id,
    label: n.label,
    status: o ? "dark" : "missing",
    entityId: r,
    inServiceEntity: n.inServiceEntity,
    demandEntity: n.demandEntity,
    firmwareEntity: n.firmwareEntity
  };
}
function $d(n) {
  const i = n.filter((d) => d.id !== "hub"), r = i.filter((d) => d.status === "oos"), o = i.filter((d) => d.status === "dark").length;
  return {
    inService: i.length - r.length,
    total: i.length,
    dark: o
  };
}
function Sj(n, i) {
  switch (n) {
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
      return n;
  }
}
function kj(n) {
  switch (n) {
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
      return n;
  }
}
const j_ = { w: 720, h: 400 }, ol = { x: 360, y: 188 }, Nj = /* @__PURE__ */ new Set(["heater", "heatmat", "humidifier", "dehumidifier", "ac", "mister"]);
function w_(n) {
  return Nj.has(n.id) && n.status === "ok";
}
function S_(n, i, r) {
  if (n === "hub") return ol;
  const o = 148, d = i / Math.max(r, 1) * Math.PI * 2 - Math.PI / 2;
  return { x: ol.x + Math.cos(d) * o, y: ol.y + Math.sin(d) * o };
}
function k_(n) {
  switch (n) {
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
      return n;
  }
}
function Bd({
  nodes: n,
  onSelect: i
}) {
  const r = n.find((d) => d.id === "hub"), o = n.filter((d) => d.id !== "hub");
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-kit-pulse", children: [
    /* @__PURE__ */ s.jsxs("svg", { viewBox: `0 0 ${j_.w} ${j_.h}`, className: "dsc-kit-constellation", "aria-label": "Kit pulse", children: [
      o.map((d, h) => {
        const m = S_(d.id, h, o.length), p = d.status === "oos" || d.status === "missing" || d.status === "dark";
        return /* @__PURE__ */ s.jsx(
          "line",
          {
            x1: ol.x,
            y1: ol.y,
            x2: m.x,
            y2: m.y,
            stroke: k_(r?.status === "ok" && !p ? "ok" : d.status),
            strokeWidth: "1.2",
            strokeDasharray: p || r?.status !== "ok" ? "4 4" : void 0,
            opacity: 0.7
          },
          `edge-${d.id}`
        );
      }),
      n.map((d) => {
        const h = d.id === "hub" ? ol : S_(d.id, o.findIndex((_) => _.id === d.id), o.length), m = d.status === "oos" || d.status === "missing" || d.status === "dark", p = d.status === "idle", f = d.label.replace("Pot ", "P").replace("Clone mister", "Mister").replace("Dehumidifier", "Dehum").replace("Humidifier", "Hum");
        return /* @__PURE__ */ s.jsxs(
          "g",
          {
            transform: `translate(${h.x},${h.y})`,
            role: i ? "button" : void 0,
            tabIndex: i ? 0 : void 0,
            style: { cursor: i ? "pointer" : void 0 },
            onClick: () => i?.(d),
            onKeyDown: (_) => {
              (_.key === "Enter" || _.key === " ") && (_.preventDefault(), i?.(d));
            },
            children: [
              /* @__PURE__ */ s.jsx(
                "circle",
                {
                  r: d.id === "hub" ? 22 : 16,
                  className: w_(d) ? "dsc-kit-node-running" : void 0,
                  fill: m || p ? "none" : "rgba(38,198,218,0.12)",
                  stroke: k_(d.status),
                  strokeWidth: "1.8",
                  strokeDasharray: m ? "4 3" : void 0
                }
              ),
              /* @__PURE__ */ s.jsx("text", { textAnchor: "middle", y: "4", fill: "currentColor", fontSize: "9", children: f })
            ]
          },
          d.id
        );
      })
    ] }),
    /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: n.map((d) => /* @__PURE__ */ s.jsx(
      z,
      {
        label: Sj(d.status, d.label),
        tone: kj(d.status),
        motion: w_(d) ? "duty" : void 0,
        onClick: i ? () => i(d) : void 0
      },
      d.id
    )) })
  ] });
}
const Cj = 25e3;
function Kb(n = Cj) {
  const { available: i, tick: r } = Me(), o = v.useRef({}), [, d] = v.useState(() => Date.now());
  return v.useEffect(() => {
    const h = window.setInterval(() => d(Date.now()), 1e3);
    return () => window.clearInterval(h);
  }, []), v.useCallback(
    (h) => {
      if (!h) return !1;
      if (i(h))
        return o.current[h] = Date.now(), !0;
      const m = o.current[h];
      return m == null ? !1 : Date.now() - m < n;
    },
    [i, n, r]
  );
}
function Tj() {
  const { state: n, num: i, available: r, entity: o, tick: d } = Me(), h = Ot(), m = gt(), [p, f] = v.useState(!1), _ = Kb(), { isSnoozed: x } = yo(), g = Bn(), y = h.hub.online || _("sensor.dsc_hub_uptime"), w = Eb(), N = Mb(), T = Rb(), E = i("sensor.dsc_active_alert_count", 0), M = we("sensor.dsc_hub_tent_temperature"), C = we("sensor.dsc_hub_tent_humidity"), U = we("sensor.dsc_hub_vpd_kpa"), G = we("sensor.dsc_hub_clone_temperature"), X = we("sensor.dsc_hub_clone_humidity"), L = we("sensor.dsc_hub_clone_vpd_kpa"), V = we("sensor.dsc_pot1_got_moisture"), te = we("sensor.dsc_pot2_got_moisture"), re = we("sensor.dsc_pot3_got_moisture"), se = we("sensor.dsc_pot4_got_moisture"), ce = [V, te, re, se], me = h.panel.online ? "on" : n("binary_sensor.dsc_hub_panel_link"), oe = h.panel.online || me === "on", ge = h.hub.values.heartbeat != null ? String(h.hub.values.heartbeat) : n("sensor.dsc_hub_heartbeat", "NO BEAT"), ue = h.hub.online && h.hub.values.heartbeat != null ? !0 : _("sensor.dsc_hub_heartbeat"), S = n("switch.dsc_hub_manual_takeover") === "on", O = n("switch.dsc_hub_tent_manual_override") === "on", q = n("switch.dsc_hub_tent_full_auto_mode") === "on", J = !!h.system.reduced_kit, I = String(o("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? ""), k = q && !S, $ = n("sensor.dsc_fleet_version_status", h.expected_firmware || "—"), Z = h.version === h.expected_firmware ? "ok" : $ === "warn" ? "warn" : "drift", ne = Vb.filter((he) => n(he) === "on" && !x(he)).map((he) => ({
    id: he,
    label: he.split(".").pop()?.replace(/dsc_/, "").replace(/_/g, " ") || he
  })), de = ca.map((he) => _s(he, { state: n, entity: o })), Q = Hd(h), le = $d(Q), xe = bt("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available: r,
    num: i
  }), je = _("binary_sensor.dsc_hub_panel_link") || oe, st = !oe && r("sensor.dsc_control_wifi_rssi"), et = !oe && !st && !je, ke = M.stale || C.stale || U.stale || G.stale || X.stale || L.stale, rt = (he) => g.open({
    entityId: he.entityId,
    label: he.label,
    kind: "kit",
    runtimeToday: he.runtimeToday,
    cyclesToday: he.cyclesToday,
    demandEntity: he.demandEntity
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      zt,
      {
        icon: "mission",
        title: "Mission",
        subtitle: "Triage glance — Next, faults, seats, lung. Command lives on Climate.",
        primaryAction: /* @__PURE__ */ s.jsx(ae, { teal: !0, onClick: () => m("/live/twin"), children: "Open Twin" }),
        actions: /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(ae, { primary: !0, onClick: () => m("/live/climate"), children: "Climate Want" }),
          /* @__PURE__ */ s.jsx(Td, { label: "Search", icon: "search", onClick: () => f(!0) }),
          /* @__PURE__ */ s.jsx(
            bo,
            {
              label: "Mission settings",
              items: [
                {
                  id: "climate",
                  label: "Open Climate",
                  onSelect: () => m("/live/climate")
                },
                { id: "main", label: "4×8 cockpit", onSelect: () => m("/live/4x8") },
                { id: "clone", label: "2×4 cockpit", onSelect: () => m("/live/2x4") },
                { id: "fleet", label: "Open Fleet", onSelect: () => m("/fleet") }
              ]
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-status-strip", children: [
      /* @__PURE__ */ s.jsx(
        z,
        {
          icon: y ? "ok" : "alert",
          label: y ? "HUB ONLINE" : "HUB OFFLINE",
          tone: y ? "ok" : "bad",
          onClick: () => g.open({ entityId: "binary_sensor.dsc_hub_link", label: "Hub", kind: "kit" })
        }
      ),
      y ? null : /* @__PURE__ */ s.jsx(
        z,
        {
          label: `OFF ${w != null ? qa(w) : "—"}`,
          tone: "bad",
          pulse: !0
        }
      ),
      ke ? /* @__PURE__ */ s.jsx(z, { label: "HELD VITALS", tone: "warn" }) : null,
      /* @__PURE__ */ s.jsx(
        z,
        {
          label: `${le.inService} of ${le.total} in service`,
          tone: le.dark > 0 ? "bad" : "ok",
          onClick: () => m("/fleet")
        }
      ),
      /* @__PURE__ */ s.jsx(
        z,
        {
          label: oe ? "PANEL LINKED" : st ? "PANEL LIMITED LINK" : et ? "PANEL OFFLINE" : "PANEL…",
          tone: oe ? "ok" : st ? "warn" : "bad",
          onClick: () => g.open({ entityId: "binary_sensor.dsc_hub_panel_link", label: "Panel link", kind: "kit" })
        }
      ),
      et ? /* @__PURE__ */ s.jsx(
        z,
        {
          label: `PANEL OFF ${T != null ? qa(T) : "—"}`,
          tone: "bad",
          pulse: !0
        }
      ) : null,
      /* @__PURE__ */ s.jsx(
        z,
        {
          icon: ue ? "ok" : "alert",
          label: ue ? `BEAT ${ge}` : "NO BEAT",
          tone: ue ? "ok" : "bad",
          onClick: () => g.open({ entityId: "sensor.dsc_hub_heartbeat", label: "Heartbeat", kind: "kit" })
        }
      ),
      ue ? null : /* @__PURE__ */ s.jsx(z, { label: `BEAT OFF ${N != null ? qa(N) : "—"}`, tone: "bad", pulse: !0 }),
      /* @__PURE__ */ s.jsx(
        z,
        {
          icon: ne.length === 0 ? "ok" : "alert",
          label: ne.length === 0 ? "All clear" : `${ne.length} alert(s)`,
          tone: ne.length === 0 ? "ok" : "bad",
          pulse: ne.length > 0,
          onClick: () => {
            const he = ne[0];
            g.open({
              entityId: he?.id || "sensor.dsc_active_alert_count",
              label: he?.label || "Alerts",
              kind: "alert"
            });
          }
        }
      ),
      /* @__PURE__ */ s.jsx(
        z,
        {
          label: Z === "ok" ? "FLEET OK" : Z === "warn" ? "FLEET WARN" : "FLEET DRIFT",
          tone: Z === "ok" ? "ok" : Z === "warn" ? "warn" : "bad",
          onClick: () => g.open({
            entityId: "sensor.dsc_fleet_version_status",
            label: `Fleet ${h.expected_firmware}`,
            kind: "fleet"
          })
        }
      ),
      q ? /* @__PURE__ */ s.jsx(z, { icon: "ok", label: "FULL AUTO", tone: "ok", pulse: !0 }) : null,
      k ? /* @__PURE__ */ s.jsx(z, { label: "AUTO-DRIVEN", tone: "ok" }) : null,
      S ? /* @__PURE__ */ s.jsx(z, { icon: "alert", label: "MANUAL TAKEOVER", tone: "warn", pulse: !0 }) : null,
      O ? /* @__PURE__ */ s.jsx(z, { icon: "alert", label: "FAN OVERRIDE", tone: "warn", pulse: !0 }) : null,
      q && J ? /* @__PURE__ */ s.jsx(
        z,
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
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(c1, {}) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ie, { className: "dsc-glass", title: "Hub link", icon: "fleet", children: /* @__PURE__ */ s.jsx(Ld, {}) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ie, { className: "dsc-glass", title: "Kit pulse", icon: "ok", children: /* @__PURE__ */ s.jsx(Bd, { nodes: Q, onSelect: rt }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Lung CFM", icon: "climate", children: [
        /* @__PURE__ */ s.jsx(wo, { readings: [xe] }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: /* @__PURE__ */ s.jsxs("button", { type: "button", className: "dsc-chip", onClick: () => m("/live/climate"), children: [
          "OUT ",
          Number.isFinite(xe.value) ? Math.round(xe.value) : "—",
          " cfm → Climate"
        ] }) })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ie, { className: "dsc-glass", title: "Plant seats", icon: "seat", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: de.map((he) => {
        const Fe = !nn(he.pot, n), _e = xo(he.pot, n), Ye = ce[he.pot - 1], Xe = !Fe && !_e.blockNeedAct && he.need && he.need !== "—" && he.need !== "ok";
        return /* @__PURE__ */ s.jsxs(
          "button",
          {
            type: "button",
            className: `dsc-chip${Fe ? "" : " dsc-chip--ok"}${Xe ? " dsc-chip--pulse" : ""}`,
            onClick: () => window.dispatchEvent(new CustomEvent("dsc-dash-select-pot", { detail: { pot: he.pot } })),
            title: Fe ? "Out of service — no data" : he.need,
            children: [
              /* @__PURE__ */ s.jsx(Hn, { spec: Ya(he.pot, n, o), size: 18 }),
              "P",
              he.pot,
              " ",
              he.plantName !== "—" ? he.plantName : "—",
              " · Got M",
              " ",
              Fe ? "—" : Ye.stale ? `${Number.isFinite(Ye.value) ? Ye.value.toFixed(0) : "—"}*` : he.moisture,
              Fe ? " · Out of service" : ` · Need ${he.need}`,
              Ye.stale && !Fe ? " · HELD" : "",
              _e.labels.length ? ` · ${_e.labels.join("/")}` : ""
            ]
          },
          he.pot
        );
      }) }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(ie, { className: "dsc-glass", title: "Faults / alerts", icon: "alert", children: ne.length === 0 && E === 0 ? /* @__PURE__ */ s.jsx("div", { className: "dsc-empty dsc-empty--ok", children: "No active faults — all clear." }) : /* @__PURE__ */ s.jsxs("ul", { className: "dsc-fault-list", children: [
        ne.map((he) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx(
          z,
          {
            label: he.label,
            tone: "bad",
            pulse: !0,
            icon: "alert",
            onClick: () => g.open({ entityId: he.id, label: he.label, kind: "alert" })
          }
        ) }, he.id)),
        E > 0 && ne.length === 0 ? /* @__PURE__ */ s.jsxs("li", { children: [
          /* @__PURE__ */ s.jsx(z, { label: `${E} system alert(s)`, tone: "bad", pulse: !0, icon: "alert" }),
          /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", children: "See Fleet for details" })
        ] }) : null
      ] }) }) })
    ] }),
    /* @__PURE__ */ s.jsx(Xa, { open: p, onClose: () => f(!1), title: "Quick jump", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: [
      { path: "/live/climate", label: "Climate" },
      { path: "/live/twin", label: "Twin" },
      { path: "/live/4x8", label: "4×8" },
      { path: "/live/2x4", label: "2×4" },
      { path: "/live/root", label: "Root" },
      { path: "/live/light", label: "Light" },
      { path: "/grow/compose", label: "Compose" },
      { path: "/fleet", label: "Fleet" }
    ].map((he) => /* @__PURE__ */ s.jsx(
      "button",
      {
        type: "button",
        className: "dsc-btn teal",
        onClick: () => {
          f(!1), m(he.path);
        },
        children: he.label
      },
      he.path
    )) }) })
  ] });
}
function Ej(n) {
  return n.kind === "allocated" || n.kind === "mass-balance" ? void 0 : "6 5";
}
function Da(n) {
  return Number.isFinite(n) ? String(Math.round(n)) : "—";
}
function Mj(n) {
  return !Number.isFinite(n) || n <= 0 ? 0 : n < 40 ? 1 : n < 80 ? 2 : n < 140 ? 3 : n < 220 ? 4 : 5;
}
function hs({
  x1: n,
  y1: i,
  x2: r,
  y2: o,
  reading: d,
  color: h,
  onClick: m
}) {
  const p = Mj(d.value), f = r - n, _ = o - i, x = Math.hypot(f, _) || 1, g = -_ / x * 3.2, y = f / x * 3.2, w = -Math.floor((p - 1) / 2);
  return /* @__PURE__ */ s.jsx(
    "g",
    {
      role: m ? "button" : void 0,
      style: { cursor: m ? "pointer" : void 0 },
      onClick: m,
      children: p === 0 ? /* @__PURE__ */ s.jsx(
        "line",
        {
          x1: n,
          y1: i,
          x2: r,
          y2: o,
          stroke: h,
          strokeWidth: "1.2",
          strokeDasharray: "2 6",
          opacity: 0.35
        }
      ) : Array.from({ length: p }, (N, T) => {
        const E = w + T;
        return /* @__PURE__ */ s.jsx(
          "line",
          {
            x1: n + g * E,
            y1: i + y * E,
            x2: r + g * E,
            y2: o + y * E,
            stroke: h,
            strokeWidth: 1.4 + Math.min(2.2, d.value / 120),
            strokeDasharray: Ej(d),
            opacity: 0.85
          },
          T
        );
      })
    }
  );
}
function Ud({
  intakeClone: n,
  intakeMain: i,
  outCfm: r,
  recircCfm: o,
  compact: d,
  focus: h
}) {
  const m = Bn(), p = {
    value: Number.isFinite(n.value) ? n.value : 0,
    kind: n.kind,
    entityId: n.entityId,
    nameplate: n.nameplate
  }, f = (Number.isFinite(n.value) ? n.value : 0) + (Number.isFinite(i.value) ? i.value : 0), _ = h !== "main", x = h !== "clone", g = h !== "clone", y = h === "clone" ? [n] : h === "main" ? [i, r, o] : [n, i, r, o], w = () => m.open({
    entityId: p.entityId,
    label: "Cascade 2×4 → 4×8",
    unit: "cfm"
  });
  return /* @__PURE__ */ s.jsxs("div", { className: `dsc-air-path${d ? " is-compact" : ""}`, children: [
    /* @__PURE__ */ s.jsx(wo, { readings: y }),
    /* @__PURE__ */ s.jsxs("svg", { viewBox: "0 0 720 260", className: "dsc-air-svg", "aria-label": "Air path room to tents", children: [
      /* @__PURE__ */ s.jsx("rect", { x: "16", y: "78", width: "120", height: "110", rx: "12", fill: "none", stroke: "var(--dsc-teal)", strokeWidth: "1.8" }),
      /* @__PURE__ */ s.jsx("text", { x: "76", y: "122", textAnchor: "middle", fill: "currentColor", fontSize: "13", children: "Room" }),
      /* @__PURE__ */ s.jsx("text", { x: "76", y: "142", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: "umbrella lung" }),
      _ ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx("rect", { x: "220", y: "28", width: "150", height: "88", rx: "10", fill: "none", stroke: "var(--dsc-teal)", strokeWidth: "1.8" }),
        /* @__PURE__ */ s.jsx("text", { x: "295", y: "64", textAnchor: "middle", fill: "currentColor", fontSize: "13", children: "2×4 tent" }),
        /* @__PURE__ */ s.jsxs("text", { x: "295", y: "84", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: [
          "in ",
          Da(n.value),
          " cfm"
        ] }),
        /* @__PURE__ */ s.jsx(
          hs,
          {
            x1: 136,
            y1: 110,
            x2: 220,
            y2: 72,
            reading: n,
            color: "var(--dsc-teal)",
            onClick: () => m.open({
              entityId: n.entityId,
              label: "2×4 intake CFM",
              unit: "cfm"
            })
          }
        )
      ] }) : null,
      x ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx("rect", { x: "220", y: "150", width: "150", height: "88", rx: "10", fill: "none", stroke: "var(--dsc-blue)", strokeWidth: "1.8" }),
        /* @__PURE__ */ s.jsx("text", { x: "295", y: "186", textAnchor: "middle", fill: "currentColor", fontSize: "13", children: "4×8 tent" }),
        /* @__PURE__ */ s.jsxs("text", { x: "295", y: "206", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: [
          "in ",
          Da(i.value),
          " cfm"
        ] }),
        /* @__PURE__ */ s.jsx(
          hs,
          {
            x1: 136,
            y1: 140,
            x2: 220,
            y2: 194,
            reading: i,
            color: "var(--dsc-blue)",
            onClick: () => m.open({
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
          Da(r.value)
        ] })
      ] }) : null,
      h ? null : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx(
          hs,
          {
            x1: 295,
            y1: 116,
            x2: 295,
            y2: 150,
            reading: p,
            color: "var(--dsc-amber)",
            onClick: w
          }
        ),
        /* @__PURE__ */ s.jsxs("text", { x: "370", y: "140", fill: "var(--dsc-amber)", fontSize: "10", children: [
          "cascade ",
          Da(p.value)
        ] }),
        /* @__PURE__ */ s.jsx("text", { x: "370", y: "152", fill: "var(--dsc-gray-5)", fontSize: "9", children: "same air · not added to Σ" })
      ] }),
      h === "clone" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx(
          hs,
          {
            x1: 370,
            y1: 72,
            x2: 430,
            y2: 72,
            reading: p,
            color: "var(--dsc-amber)",
            onClick: w
          }
        ),
        /* @__PURE__ */ s.jsx("rect", { x: "430", y: "54", width: "88", height: "36", rx: "8", fill: "none", stroke: "var(--dsc-amber)", strokeWidth: "1.4", strokeDasharray: "5 4" }),
        /* @__PURE__ */ s.jsx("text", { x: "474", y: "76", textAnchor: "middle", fill: "var(--dsc-amber)", fontSize: "10", children: "to 4×8" }),
        /* @__PURE__ */ s.jsxs("text", { x: "474", y: "102", textAnchor: "middle", fill: "var(--dsc-amber)", fontSize: "9", children: [
          "cascade ",
          Da(p.value)
        ] })
      ] }) : null,
      h === "main" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx(
          hs,
          {
            x1: 295,
            y1: 132,
            x2: 295,
            y2: 150,
            reading: p,
            color: "var(--dsc-amber)",
            onClick: w
          }
        ),
        /* @__PURE__ */ s.jsx("rect", { x: "251", y: "104", width: "88", height: "28", rx: "8", fill: "none", stroke: "var(--dsc-amber)", strokeWidth: "1.4", strokeDasharray: "5 4" }),
        /* @__PURE__ */ s.jsx("text", { x: "295", y: "122", textAnchor: "middle", fill: "var(--dsc-amber)", fontSize: "10", children: "from 2×4" }),
        /* @__PURE__ */ s.jsxs("text", { x: "390", y: "122", fill: "var(--dsc-amber)", fontSize: "9", children: [
          "cascade ",
          Da(p.value)
        ] })
      ] }) : null,
      g ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx(
          hs,
          {
            x1: 370,
            y1: 194,
            x2: 560,
            y2: 194,
            reading: r,
            color: "#ff8a65",
            onClick: () => m.open({ entityId: r.entityId, label: "Dump OUT CFM", unit: "cfm" })
          }
        ),
        /* @__PURE__ */ s.jsx(
          hs,
          {
            x1: 370,
            y1: 220,
            x2: 136,
            y2: 168,
            reading: o,
            color: "#b388ff",
            onClick: () => m.open({ entityId: o.entityId, label: "Recirc CFM", unit: "cfm" })
          }
        ),
        /* @__PURE__ */ s.jsxs("text", { x: "80", y: "200", fill: "#b388ff", fontSize: "10", children: [
          "recirc ",
          Da(o.value)
        ] })
      ] }) : null
    ] }),
    h ? null : /* @__PURE__ */ s.jsx(
      z,
      {
        label: `Mass-balance exhaust = Σ intake ${Da(f)} × dump/recirc split`,
        tone: "muted"
      }
    )
  ] });
}
function Rj(n) {
  return Number.isFinite(n) ? String(Math.round(n)) : "0";
}
function Aj(n, i) {
  return !Number.isFinite(n) || n <= 0 || i <= 0 ? 2 : Math.max(2, Math.min(28, n / i * 28));
}
function Oj(n, i, r, o) {
  const d = (n + r) / 2;
  return `M ${n} ${i} C ${d} ${i}, ${d} ${o}, ${r} ${o}`;
}
function Jb({
  intakeClone: n,
  intakeMain: i,
  outCfm: r,
  recircCfm: o
}) {
  const d = n, h = [
    n.value,
    i.value,
    d.value,
    r.value,
    o.value
  ], m = Math.max(...h.filter(Number.isFinite), 1), p = [
    { id: "room", label: "Room", x: 24, y: 100, w: 88, h: 56, color: "var(--dsc-gray-3)" },
    { id: "clone", label: "2×4", x: 200, y: 36, w: 88, h: 48, color: "var(--dsc-teal-dim)" },
    { id: "main", label: "4×8", x: 200, y: 148, w: 88, h: 48, color: "var(--dsc-blue-dim)" },
    { id: "out", label: "Outside", x: 400, y: 120, w: 88, h: 48, color: "var(--dsc-orange)" },
    { id: "recirc", label: "Room recirc", x: 200, y: 228, w: 88, h: 40, color: "var(--dsc-purple-dim)" }
  ], f = [
    {
      from: p[0],
      to: p[1],
      reading: n,
      label: "intake 2×4",
      y1: 118,
      y2: 60,
      color: "var(--dsc-teal)"
    },
    {
      from: p[0],
      to: p[2],
      reading: i,
      label: "intake 4×8",
      y1: 132,
      y2: 172,
      color: "var(--dsc-blue)"
    },
    {
      from: p[1],
      to: p[2],
      reading: d,
      label: "cascade",
      y1: 84,
      y2: 148,
      color: "var(--dsc-amber)"
    },
    {
      from: p[2],
      to: p[3],
      reading: r,
      label: "dump",
      y1: 168,
      y2: 144,
      color: "var(--dsc-orange)"
    },
    {
      from: p[2],
      to: p[4],
      reading: o,
      label: "recirc",
      y1: 188,
      y2: 248,
      color: "var(--dsc-purple)"
    }
  ];
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-sankey-proto", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 10 }, children: [
      /* @__PURE__ */ s.jsx(z, { label: "EXPERIMENTAL", tone: "warn" }),
      /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", style: { fontSize: 12 }, children: "Prototype mass-flow view — same CFM provenance as Air path; not yet wired to control." })
    ] }),
    /* @__PURE__ */ s.jsxs("svg", { viewBox: "0 0 520 290", className: "dsc-air-svg", "aria-label": "CFM sankey prototype", children: [
      f.map((_) => {
        const x = Aj(_.reading.value, m), g = _.from.x + _.from.w, y = _.to.x;
        return /* @__PURE__ */ s.jsxs("g", { children: [
          /* @__PURE__ */ s.jsx(
            "path",
            {
              d: Oj(g, _.y1, y, _.y2),
              fill: "none",
              stroke: _.color,
              strokeWidth: x,
              strokeLinecap: "round",
              opacity: _.reading.value > 0 ? 0.75 : 0.2
            }
          ),
          /* @__PURE__ */ s.jsxs("text", { x: (g + y) / 2, y: (_.y1 + _.y2) / 2 - x / 2 - 4, textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "9", children: [
            _.label,
            " ",
            Rj(_.reading.value),
            " (",
            vj(_.reading.kind),
            ")"
          ] })
        ] }, _.label);
      }),
      p.map((_) => /* @__PURE__ */ s.jsxs("g", { children: [
        /* @__PURE__ */ s.jsx("rect", { x: _.x, y: _.y, width: _.w, height: _.h, rx: "8", fill: "none", stroke: _.color, strokeWidth: "1.6" }),
        /* @__PURE__ */ s.jsx("text", { x: _.x + _.w / 2, y: _.y + _.h / 2 + 4, textAnchor: "middle", fill: "currentColor", fontSize: "12", children: _.label })
      ] }, _.id))
    ] })
  ] });
}
const zj = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SankeyFlowPrototype: Jb
}, Symbol.toStringTag, { value: "Module" })), Dj = "#66bb6a", N_ = "#ffb74d", C_ = "#ef5350", Lj = "#8b95a8", T_ = -1e9;
function Hj(n, i, r) {
  const o = r === "°C" ? 1 : 0.05;
  return Math.max((i - n) * 0.12, o);
}
function wi(n, i, r) {
  if (!Number.isFinite(n) || !Number.isFinite(i) || i <= n)
    return [{ from: T_, color: Lj }];
  const o = Hj(n, i, r);
  return [
    { from: T_, color: C_ },
    { from: n - 3 * o, color: N_ },
    { from: n - o, color: Dj },
    { from: i + o, color: N_ },
    { from: i + 3 * o, color: C_ }
  ];
}
function fi(n) {
  const i = Number.isFinite(n) ? n : 25;
  return wi(i - 2, i + 2, "°C");
}
function pi(n, i) {
  return wi(n, i);
}
function co(n, i) {
  return wi(n, i);
}
function $j(n, i) {
  return wi(n, i, "°C");
}
function ud(n = 30, i = 75) {
  return wi(n, i);
}
function Bj(n) {
  return n("sensor.dsc_hub_room_vpd_kpa") ? "sensor.dsc_hub_room_vpd_kpa" : n("sensor.dsc_hub_room_vpd") ? "sensor.dsc_hub_room_vpd" : "sensor.dsc_hub_room_vpd_kpa";
}
function Dn(n, i = 1) {
  return Number.isFinite(n) ? n.toFixed(i) : "—";
}
const Uj = [
  { id: "compare", label: "All" },
  { id: "main", label: "4×8" },
  { id: "clone", label: "2×4" },
  { id: "room", label: "Room" }
];
function Fj() {
  const { num: n, state: i, entity: r, available: o } = Me(), d = Ot(), h = ob(), m = gt(), p = Bn(), { focus: f, setFocus: _ } = Dd(), { hours: x, setHours: g, maxPoints: y } = ml(6), w = ul("switch.dsc_hub_tent_manual_override").state === "on", N = ul("switch.dsc_hub_tent_full_auto_mode").state === "on", T = String(r("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? ""), E = !!d.system.reduced_kit, M = we("sensor.dsc_hub_tent_temperature"), C = we("sensor.dsc_hub_tent_humidity"), U = we("sensor.dsc_hub_vpd_kpa"), G = we("sensor.dsc_hub_clone_temperature"), X = we("sensor.dsc_hub_clone_humidity"), L = we("sensor.dsc_hub_clone_vpd_kpa"), V = we("sensor.dsc_hub_room_temperature"), te = we("sensor.dsc_hub_room_humidity"), re = Bj(r), se = we(re), ce = Ne("sensor.dsc_hub_tent_temperature", { hours: x, maxPoints: y, withGhost: !0 }), me = Ne("sensor.dsc_hub_tent_humidity", { hours: x, maxPoints: y, withGhost: !0 }), oe = Ne("sensor.dsc_hub_vpd_kpa", { hours: x, maxPoints: y, withGhost: !0 }), ge = Ne("sensor.dsc_hub_clone_temperature", { hours: x, maxPoints: y, withGhost: !0 }), ue = Ne("sensor.dsc_hub_clone_humidity", { hours: x, maxPoints: y, withGhost: !0 }), S = Ne("sensor.dsc_hub_clone_vpd_kpa", { hours: x, maxPoints: y, withGhost: !0 }), O = Ne("sensor.dsc_hub_room_temperature", { hours: x, maxPoints: y, withGhost: !0 }), q = Ne("sensor.dsc_hub_room_humidity", { hours: x, maxPoints: y, withGhost: !0 }), J = Ne(re, { hours: x, maxPoints: y, withGhost: !0 }), I = Ne("sensor.dsc_fan_exhaust_outside_pct", { hours: x, maxPoints: y }), k = Ne("sensor.dsc_fan_exhaust_room_pct", { hours: x, maxPoints: y }), $ = bt("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available: o,
    num: n
  }), Z = bt(
    "sensor.dsc_cfm_exhaust_recirc_allocated",
    "sensor.dsc_cfm_exhaust_recirc",
    { available: o, num: n }
  ), ne = bt(
    "sensor.dsc_cfm_intake_main_allocated",
    "sensor.dsc_cfm_intake_main",
    { available: o, num: n }
  ), de = bt(
    "sensor.dsc_cfm_intake_2x4_allocated",
    "sensor.dsc_cfm_intake_2x4",
    { available: o, num: n }
  ), Q = Qu(V.value, te.value), le = Qu(M.value, C.value), xe = Qu(G.value, X.value), je = n("number.dsc_hub_target_temp"), st = n("number.dsc_hub_rh_target_min"), et = n("number.dsc_hub_rh_target_max"), ke = n("number.dsc_hub_vpd_target_min"), rt = n("number.dsc_hub_vpd_target_max"), he = n("number.dsc_hub_clone_target_temp"), Fe = n("number.dsc_hub_clone_rh_min"), _e = n("number.dsc_hub_clone_rh_max"), Ye = n("number.dsc_hub_clone_vpd_min"), Xe = n("number.dsc_hub_clone_vpd_max"), De = (We, mn, ys) => p.open({ entityId: We, label: mn, unit: ys }), Dt = v.useMemo(() => Ln(ce.series), [ce.series]), kt = v.useMemo(() => Ln(me.series), [me.series]), Xt = v.useMemo(() => Ln(oe.series), [oe.series]), P = v.useMemo(() => Ln(ge.series), [ge.series]), ve = v.useMemo(() => Ln(ue.series), [ue.series]), tt = v.useMemo(() => Ln(S.series), [S.series]), pe = v.useMemo(() => Ln(O.series), [O.series]), xt = v.useMemo(() => Ln(q.series), [q.series]), Qt = v.useMemo(() => Ln(J.series), [J.series]), _l = M.value - V.value, bs = le - Q, gs = U.value - se.value, xs = M.value - G.value, Un = le - xe, vt = xe - Q, Nt = n("sensor.dsc_bought_runtime_today"), Lt = n("sensor.dsc_vent_heat_dump_btu"), vs = d.system.zigbee_by_placement, Si = v.useMemo(() => !vs || typeof vs != "object" ? [] : Object.entries(vs).map(([We, mn]) => ({
    placement: We,
    temp: mn.temperature,
    rh: mn.humidity,
    name: String(mn.friendly_name ?? We),
    updatedAt: typeof mn.updated_at == "number" ? mn.updated_at : null
  })), [vs]), bl = (We) => f === "compare" || f === We ? "dsc-gauge-row-3 is-lit" : "dsc-gauge-row-3";
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      zt,
      {
        icon: "climate",
        title: "Climate",
        subtitle: "Room is the umbrella lung. 2×4 and 4×8 are grow rooms and transfer/storage. T, RH, VPD only together.",
        actions: /* @__PURE__ */ s.jsx(
          bo,
          {
            label: "Climate settings",
            items: [
              { id: "mission", label: "Mission", onSelect: () => m("/live/mission") },
              { id: "main", label: "4×8 cockpit", onSelect: () => m("/live/4x8") },
              { id: "clone", label: "2×4 cockpit", onSelect: () => m("/live/2x4") },
              { id: "fleet", label: "Fleet kit", onSelect: () => m("/fleet") }
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 14 }, role: "group", "aria-label": "Zone emphasis", children: [
      /* @__PURE__ */ s.jsx(
        z,
        {
          icon: h.online ? "ok" : "alert",
          label: h.online ? `Hub ${h.temp_c != null ? `${h.temp_c.toFixed(1)}°C` : "live"}` : "Hub offline",
          tone: h.online ? "ok" : "bad"
        }
      ),
      Uj.map((We) => /* @__PURE__ */ s.jsx(
        "button",
        {
          type: "button",
          className: `dsc-chip${f === We.id ? " dsc-chip--ok" : ""}`,
          onClick: () => _(We.id),
          children: We.label
        },
        We.id
      )),
      /* @__PURE__ */ s.jsx(pl, { hours: x, setHours: g, extras: fl }),
      /* @__PURE__ */ s.jsx(ae, { teal: !0, onClick: () => m("/fleet"), children: "Kit / Fleet" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Command", icon: "climate", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-row", children: [
          /* @__PURE__ */ s.jsx(St, { confirm: !0, entityId: "switch.dsc_hub_tent_full_auto_mode", label: "Full Auto", icon: "ok" }),
          /* @__PURE__ */ s.jsx(St, { confirm: !0, entityId: "switch.dsc_hub_manual_takeover", label: "Master takeover", icon: "alert" }),
          /* @__PURE__ */ s.jsx(St, { confirm: !0, entityId: "switch.dsc_hub_tent_manual_override", label: "Fan override", icon: "climate" }),
          /* @__PURE__ */ s.jsx(St, { confirm: !0, entityId: "switch.dsc_hub_humidifier_intake_routing", label: "Hum intake routing", icon: "climate" }),
          /* @__PURE__ */ s.jsx(St, { confirm: !0, entityId: "switch.dsc_hub_recirc_de_strat_pulse", label: "RECIRC de-strat", icon: "climate" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-selects", children: [
          /* @__PURE__ */ s.jsx(Fa, { entityId: "select.dsc_hub_control_strategy", label: "Strategy", icon: "climate" }),
          /* @__PURE__ */ s.jsx(Fa, { entityId: "select.dsc_hub_priority_tent", label: "Priority tent", icon: "tent" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-demand-row", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ s.jsx(St, { confirm: !0, entityId: "switch.dsc_hub_heater_demand", label: "Heat", icon: "climate" }),
          /* @__PURE__ */ s.jsx(
            St,
            {
              confirm: !0,
              entityId: "switch.dsc_hub_ac_demand",
              label: "Cool",
              icon: "climate",
              warnWhenMissing: i("binary_sensor.dsc_ac_capacity_offline") === "on" ? "AC ○" : void 0
            }
          ),
          /* @__PURE__ */ s.jsx(St, { confirm: !0, entityId: "switch.dsc_hub_humidifier_demand", label: "Hum", icon: "climate" }),
          /* @__PURE__ */ s.jsx(St, { confirm: !0, entityId: "switch.dsc_hub_dehumidifier_demand", label: "Dehum", icon: "climate" }),
          /* @__PURE__ */ s.jsx(St, { confirm: !0, entityId: "switch.dsc_hub_grow_mat_demand", label: "Mat", icon: "root" }),
          /* @__PURE__ */ s.jsx(St, { confirm: !0, entityId: "switch.dsc_hub_clone_humidifier_demand", label: "Mister", icon: "clone" })
        ] }),
        N ? /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
          /* @__PURE__ */ s.jsx(
            z,
            {
              icon: E ? "alert" : "ok",
              label: E ? "Capacity offline" : "Full Auto",
              tone: E ? "warn" : "ok",
              onClick: () => p.open({
                entityId: E ? "binary_sensor.dsc_reduced_kit" : "switch.dsc_hub_tent_full_auto_mode",
                label: E ? "Capacity offline" : "Full Auto",
                kind: E ? "alert" : "binary"
              })
            }
          ),
          " ",
          T || "The hub drives fans and appliances automatically while Full Auto is on."
        ] }) : null
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Room umbrella", icon: "climate", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
          /* @__PURE__ */ s.jsx(
            At,
            {
              label: "Room °C",
              value: Dn(V.value),
              unit: "°C",
              stale: V.stale,
              onClick: () => De("sensor.dsc_hub_room_temperature", "Room T", "°C")
            }
          ),
          /* @__PURE__ */ s.jsx(
            At,
            {
              label: "Room RH",
              value: Dn(te.value, 0),
              unit: "%",
              stale: te.stale,
              onClick: () => De("sensor.dsc_hub_room_humidity", "Room RH", "%")
            }
          ),
          /* @__PURE__ */ s.jsx(
            At,
            {
              label: "Room VPD",
              value: Dn(se.value, 2),
              unit: "kPa",
              stale: se.stale,
              onClick: () => De(re, "Room VPD", "kPa")
            }
          ),
          /* @__PURE__ */ s.jsx(
            At,
            {
              label: "Room AH",
              value: Number.isFinite(Q) ? Q.toFixed(1) : "—",
              unit: "g/m³",
              sub: Number.isFinite(Q) ? `24h ${Dn(n("sensor.dsc_hub_room_temp_mean_24h"))}°C` : "Need T+RH",
              onClick: () => De("sensor.dsc_ah_room", "Room AH", "g/m³")
            }
          )
        ] }),
        /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { marginTop: 8, fontSize: 12 }, children: [
          "ΔT room↔4×8 ",
          Dn(_l),
          "°C · ΔAH ",
          Dn(bs),
          " g/m³ · ΔVPD ",
          Dn(gs, 2),
          " · ΔT/ΔAH 2×4↔4×8",
          " ",
          Dn(xs),
          "°C / ",
          Dn(Un),
          " · ΔAH room↔2×4 ",
          Dn(vt),
          " g/m³. Early warn is the lung poisoning a tent before Want miss."
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(Yb, { hero: !0 }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Triad · T / RH / VPD", icon: "gauge", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-gauge-matrix", children: [
          /* @__PURE__ */ s.jsxs("div", { className: bl("room"), children: [
            /* @__PURE__ */ s.jsx("span", { className: "dsc-gauge-row-tag", children: "Room" }),
            /* @__PURE__ */ s.jsx(Ie, { label: "T", value: V.value, min: 10, max: 40, unit: "°C", extrema: pe, stale: V.stale, onClick: () => De("sensor.dsc_hub_room_temperature", "Room T", "°C") }),
            /* @__PURE__ */ s.jsx(Ie, { label: "RH", value: te.value, min: 0, max: 100, unit: "%", extrema: xt, stale: te.stale, onClick: () => De("sensor.dsc_hub_room_humidity", "Room RH", "%") }),
            /* @__PURE__ */ s.jsx(Ie, { label: "VPD", value: se.value, min: 0, max: 2.5, unit: "kPa", extrema: Qt, stale: se.stale, onClick: () => De(re, "Room VPD", "kPa") })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: bl("clone"), children: [
            /* @__PURE__ */ s.jsx("span", { className: "dsc-gauge-row-tag", children: "2×4" }),
            /* @__PURE__ */ s.jsx(Ie, { label: "T", value: G.value, min: 15, max: 35, unit: "°C", target: he, band: { min: he - 2, max: he + 2 }, segments: fi(he), extrema: P, stale: G.stale, onClick: () => De("sensor.dsc_hub_clone_temperature", "2×4 T", "°C") }),
            /* @__PURE__ */ s.jsx(Ie, { label: "RH", value: X.value, min: 0, max: 100, unit: "%", band: { min: Fe, max: _e }, segments: pi(Fe, _e), extrema: ve, stale: X.stale, onClick: () => De("sensor.dsc_hub_clone_humidity", "2×4 RH", "%") }),
            /* @__PURE__ */ s.jsx(Ie, { label: "VPD", value: L.value, min: 0, max: 2.5, unit: "kPa", band: { min: Ye, max: Xe }, segments: co(Ye, Xe), extrema: tt, stale: L.stale, onClick: () => De("sensor.dsc_hub_clone_vpd_kpa", "2×4 VPD", "kPa") })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: bl("main"), children: [
            /* @__PURE__ */ s.jsx("span", { className: "dsc-gauge-row-tag", children: "4×8" }),
            /* @__PURE__ */ s.jsx(Ie, { label: "T", value: M.value, min: 15, max: 35, unit: "°C", target: je, band: { min: je - 2, max: je + 2 }, segments: fi(je), extrema: Dt, stale: M.stale, onClick: () => De("sensor.dsc_hub_tent_temperature", "4×8 T", "°C") }),
            /* @__PURE__ */ s.jsx(Ie, { label: "RH", value: C.value, min: 0, max: 100, unit: "%", band: { min: st, max: et }, segments: pi(st, et), extrema: kt, stale: C.stale, onClick: () => De("sensor.dsc_hub_tent_humidity", "4×8 RH", "%") }),
            /* @__PURE__ */ s.jsx(Ie, { label: "VPD", value: U.value, min: 0, max: 2.5, unit: "kPa", band: { min: ke, max: rt }, segments: co(ke, rt), extrema: Xt, stale: U.stale, onClick: () => De("sensor.dsc_hub_vpd_kpa", "4×8 VPD", "kPa") })
          ] })
        ] }),
        /* @__PURE__ */ s.jsx(
          $b,
          {
            rows: [
              { label: "Room T", got: V.value, stale: V.stale, want: n("sensor.dsc_hub_room_temp_mean_24h"), unit: "°C" },
              { label: "2×4 T", got: G.value, stale: G.stale, want: he, unit: "°C" },
              { label: "4×8 T", got: M.value, stale: M.stale, want: je, unit: "°C" },
              { label: "2×4 RH", got: X.value, stale: X.stale, wantMin: Fe, wantMax: _e, unit: "%" },
              { label: "4×8 RH", got: C.value, stale: C.stale, wantMin: st, wantMax: et, unit: "%" },
              { label: "2×4 VPD", got: L.value, stale: L.stale, wantMin: Ye, wantMax: Xe, unit: "kPa" },
              { label: "4×8 VPD", got: U.value, stale: U.stale, wantMin: ke, wantMax: rt, unit: "kPa" }
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ie, { className: "dsc-glass", title: "Temperature", icon: "climate", children: /* @__PURE__ */ s.jsx(
        Tn,
        {
          unit: "°C",
          lastSyncAt: Math.max(O.lastSyncAt ?? 0, ge.lastSyncAt ?? 0, ce.lastSyncAt ?? 0) || void 0,
          series: [
            ...ht("rt", "Room", O, "var(--dsc-gray-5)", "°C"),
            ...ht("ct", "2×4", ge, "var(--dsc-teal)", "°C", { band: { min: he - 1.5, max: he + 1.5 } }),
            ...ht("mt", "4×8", ce, "var(--dsc-blue)", "°C", { band: { min: je - 1.5, max: je + 1.5 } })
          ],
          targets: [{ axis: "left", value: je, color: "var(--dsc-amber)", label: "4×8 Want T" }]
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ie, { className: "dsc-glass", title: "Humidity", icon: "climate", children: /* @__PURE__ */ s.jsx(
        Tn,
        {
          unit: "%",
          lastSyncAt: Math.max(q.lastSyncAt ?? 0, ue.lastSyncAt ?? 0, me.lastSyncAt ?? 0) || void 0,
          yDomain: { left: { min: 0, max: 100 } },
          series: [
            ...ht("rrh", "Room", q, "var(--dsc-gray-5)", "%"),
            ...ht("crh", "2×4", ue, "var(--dsc-teal)", "%", { band: { min: Fe, max: _e } }),
            ...ht("mrh", "4×8", me, "var(--dsc-blue)", "%", { band: { min: st, max: et } })
          ],
          targets: [{ axis: "left", min: st, max: et, color: "var(--dsc-teal)" }]
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ie, { className: "dsc-glass", title: "VPD", icon: "climate", children: /* @__PURE__ */ s.jsx(
        Tn,
        {
          unit: "kPa",
          lastSyncAt: Math.max(J.lastSyncAt ?? 0, S.lastSyncAt ?? 0, oe.lastSyncAt ?? 0) || void 0,
          series: [
            ...ht("rv", "Room", J, "var(--dsc-gray-5)", "kPa"),
            ...ht("cv", "2×4", S, "var(--dsc-teal)", "kPa", { band: { min: Ye, max: Xe } }),
            ...ht("mv", "4×8", oe, "var(--dsc-blue)", "kPa", { band: { min: ke, max: rt } })
          ]
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Air path", icon: "climate", children: [
        /* @__PURE__ */ s.jsx(
          Ud,
          {
            intakeClone: de,
            intakeMain: ne,
            outCfm: $,
            recircCfm: Z
          }
        ),
        /* @__PURE__ */ s.jsx(
          Jb,
          {
            intakeClone: de,
            intakeMain: ne,
            outCfm: $,
            recircCfm: Z
          }
        )
      ] }) }),
      Si.length ? /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Zigbee by placement", icon: "gauge", children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { fontSize: 12, marginBottom: 8 }, children: "Canopy / duct sensors mapped in Settings → Zigbee placements. Offsets from global tuning apply." }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-table-scroll", children: /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "Placement" }),
            /* @__PURE__ */ s.jsx("th", { children: "Device" }),
            /* @__PURE__ */ s.jsx("th", { children: "°C" }),
            /* @__PURE__ */ s.jsx("th", { children: "RH %" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: Si.map((We) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: We.placement }),
            /* @__PURE__ */ s.jsx("td", { children: We.name }),
            /* @__PURE__ */ s.jsx("td", { children: We.temp != null && Number.isFinite(Number(We.temp)) ? Number(We.temp).toFixed(1) : "—" }),
            /* @__PURE__ */ s.jsx("td", { children: We.rh != null && Number.isFinite(Number(We.rh)) ? Number(We.rh).toFixed(0) : "—" })
          ] }, We.placement)) })
        ] }) })
      ] }) }) : null,
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Fan duty %", icon: "climate", children: [
        /* @__PURE__ */ s.jsx(
          Tn,
          {
            unit: "%",
            yDomain: { left: { min: 0, max: 100 } },
            lastSyncAt: Math.max(I.lastSyncAt ?? 0, k.lastSyncAt ?? 0) || void 0,
            series: [
              { id: "fout", label: "OUT %", series: I.series, color: "var(--dsc-teal)", unit: "%", step: !0, band: { min: 0, max: 90 } },
              { id: "frec", label: "RECIRC %", series: k.series, color: "var(--dsc-amber)", unit: "%", step: !0, band: { min: 0, max: 90 } }
            ]
          }
        ),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-fan-stack", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ s.jsx(Ga, { entityId: "fan.dsc_hub_4_inch_intake_fan_main", label: "Intake 4×8", disabled: !w }),
          /* @__PURE__ */ s.jsx(Ga, { entityId: "fan.dsc_hub_4_inch_intake_fan_2x4", label: "Intake 2×4", disabled: !w }),
          /* @__PURE__ */ s.jsx(Ga, { entityId: "fan.dsc_hub_6_inch_exhaust_room", label: "Exhaust room", disabled: !w }),
          /* @__PURE__ */ s.jsx(Ga, { entityId: "fan.dsc_hub_6_inch_exhaust_outside", label: "Exhaust outside", disabled: !w })
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ie, { className: "dsc-glass", title: "Efficacy · buying kW because the lung could not transfer", icon: "alert", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ s.jsx(z, { label: `Heat ${i("switch.dsc_hub_heater_demand") === "on" ? "ON" : "off"}`, tone: i("switch.dsc_hub_heater_demand") === "on" ? "ok" : "muted", onClick: () => De("switch.dsc_hub_heater_demand", "Heater", void 0) }),
        /* @__PURE__ */ s.jsx(z, { label: `Cool ${i("switch.dsc_hub_ac_demand") === "on" ? "ON" : "off"}`, tone: i("switch.dsc_hub_ac_demand") === "on" ? "ok" : "muted", onClick: () => De("switch.dsc_hub_ac_demand", "Cool", void 0) }),
        /* @__PURE__ */ s.jsx(z, { label: `Hum ${i("switch.dsc_hub_humidifier_demand") === "on" ? "ON" : "off"}`, tone: i("switch.dsc_hub_humidifier_demand") === "on" ? "ok" : "muted", onClick: () => De("switch.dsc_hub_humidifier_demand", "Humidifier", void 0) }),
        /* @__PURE__ */ s.jsx(z, { label: `Dehum ${i("switch.dsc_hub_dehumidifier_demand") === "on" ? "ON" : "off"}`, tone: i("switch.dsc_hub_dehumidifier_demand") === "on" ? "ok" : "muted", onClick: () => De("switch.dsc_hub_dehumidifier_demand", "Dehumidifier", void 0) }),
        /* @__PURE__ */ s.jsx(
          z,
          {
            label: i("binary_sensor.dsc_humidifier_ineffective_suspect") === "on" ? "Hum ineffective" : "Hum ok",
            tone: i("binary_sensor.dsc_humidifier_ineffective_suspect") === "on" ? "warn" : "muted",
            onClick: () => De("binary_sensor.dsc_humidifier_ineffective_suspect", "Humidifier ineffective", void 0)
          }
        ),
        /* @__PURE__ */ s.jsx(
          z,
          {
            label: i("binary_sensor.dsc_heater_ineffective_suspect") === "on" ? "Heat ineffective" : "Heat ok",
            tone: i("binary_sensor.dsc_heater_ineffective_suspect") === "on" ? "warn" : "muted",
            onClick: () => De("binary_sensor.dsc_heater_ineffective_suspect", "Heater ineffective", void 0)
          }
        ),
        /* @__PURE__ */ s.jsx(
          z,
          {
            label: `Bought ${Number.isFinite(Nt) ? Nt.toFixed(1) : "—"}h today`,
            tone: "muted",
            onClick: () => De("sensor.dsc_bought_runtime_today", "Bought runtime today", "h")
          }
        ),
        /* @__PURE__ */ s.jsx(
          z,
          {
            label: `Dump ${Number.isFinite(Lt) ? Math.round(Lt) : "—"} BTU/h`,
            tone: "muted",
            onClick: () => De("sensor.dsc_vent_heat_dump_btu", "Vent heat dump", "BTU/h")
          }
        ),
        /* @__PURE__ */ s.jsx(
          z,
          {
            label: `Heater today ${qa(n("sensor.dsc_heater_runtime_today") * 36e5)}`,
            tone: "muted",
            onClick: () => De("sensor.dsc_heater_runtime_today", "Heater runtime today", "h")
          }
        )
      ] }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ji, { compact: !0 }) })
    ] })
  ] });
}
const Gj = [
  { id: "before_water", label: "Before water" },
  { id: "after_water", label: "After water" },
  { id: "during_water", label: "During water" },
  { id: "outside_water", label: "Outside water window" },
  { id: "adhoc", label: "Ad hoc" }
], E_ = ["pot1", "pot2", "pot3", "pot4"];
function ms(n, i = 1) {
  return n != null && Number.isFinite(n) ? n.toFixed(i) : "—";
}
function Yr({ readings: n }) {
  if (!n) return null;
  const i = [
    ["Moisture", `${ms(n.moisture_pct)} %`],
    ["Soil °C", `${ms(n.soil_temp_c)} °C`],
    ["EC", ms(n.ec_us, 0)],
    ["pH", ms(n.ph, 2)],
    ["N / P / K", `${ms(n.nitrogen, 0)} / ${ms(n.phosphorus, 0)} / ${ms(n.potassium, 0)}`]
  ];
  return /* @__PURE__ */ s.jsx("dl", { className: "dsc-detail-list", children: i.map(([r, o]) => /* @__PURE__ */ s.jsxs("span", { style: { display: "contents" }, children: [
    /* @__PURE__ */ s.jsx("dt", { children: r }),
    /* @__PURE__ */ s.jsx("dd", { children: o })
  ] }, r)) });
}
function Fd({ initialStationId: n, onClose: i, compact: r }) {
  const { entity: o } = Me(), [d, h] = v.useState("station"), [m, p] = v.useState([]), [f, _] = v.useState(n ?? ""), [x, g] = v.useState("roster"), [y, w] = v.useState("pot1"), [N, T] = v.useState(""), [E, M] = v.useState(""), [C, U] = v.useState("adhoc"), [G, X] = v.useState(""), [L, V] = v.useState(null), [te, re] = v.useState(null), [se, ce] = v.useState(""), [me, oe] = v.useState(!1), [ge, ue] = v.useState(null), [S, O] = v.useState(!1), q = v.useMemo(() => jb(o), [o]), J = v.useCallback(async () => {
    try {
      const Q = await kd();
      if (p(Q), !f && Q.length) {
        const le = n ? Q.find((xe) => xe.seat_id === n) ?? Q[0] : Q[0];
        _(le.seat_id);
      }
    } catch {
      ce("Could not load probe stations.");
    }
  }, [n, f]);
  v.useEffect(() => {
    J();
  }, [J]);
  const I = m.find((Q) => Q.seat_id === f), k = v.useMemo(
    () => q.filter((Q) => {
      const le = String(Q.pot ?? "");
      return le && le !== "none" && E_.includes(le);
    }),
    [q]
  );
  v.useEffect(() => {
    if (x !== "roster" || !k.length) return;
    const Q = k.find((le) => String(le.pot) === y) ?? k[0];
    T(String(Q.slot)), M(String(Q.nickname || Q.strain || "")), w(String(Q.pot));
  }, [x, k, y]);
  const $ = async () => {
    if (!(!f || !y)) {
      oe(!0), ce("Starting capture session…");
      try {
        const Q = await J0({
          probe_seat_id: f,
          target_pot_id: y,
          roster_seat_id: x === "roster" && N ? N : null,
          plant_label: E,
          mode: x,
          timing_note: C,
          notes: G,
          tent: I?.tent ?? null
        });
        V(Q.id), h("capture"), ce("Hold probe steady in the target pot.");
      } catch (Q) {
        ce(Q instanceof Error ? Q.message : "Start failed");
      } finally {
        oe(!1);
      }
    }
  };
  v.useEffect(() => {
    if (d !== "capture" || !L) return;
    let Q = !1;
    const le = async () => {
      try {
        const je = await I0(L);
        if (Q) return;
        re(je), (je.status === "stable" || je.stable) && (h("confirm"), ce("Readings stable — confirm to save snapshot."));
      } catch {
        Q || ce("Poll failed — check probe is on target pot.");
      }
    };
    le();
    const xe = window.setInterval(() => void le(), 3e3);
    return () => {
      Q = !0, window.clearInterval(xe);
    };
  }, [d, L]);
  const Z = async () => {
    if (L) {
      oe(!0), ce("Confirming snapshot…");
      try {
        const Q = await W0(L);
        ue(Q.return_home_pot_id ?? I?.idle_home_pot_id ?? null), re({ id: L, status: "confirmed", test: Q.test }), h("done"), ce(Q.message ?? "Snapshot saved."), await J();
      } catch (Q) {
        ce(Q instanceof Error ? Q.message : "Confirm failed — wait for stability.");
      } finally {
        oe(!1);
      }
    }
  }, ne = async () => {
    if (!L) {
      h("station"), i?.();
      return;
    }
    oe(!0);
    try {
      await e1(L), V(null), re(null), h("station"), ce("Session cancelled — probe returned to idle mode."), await J();
    } catch (Q) {
      ce(Q instanceof Error ? Q.message : "Cancel failed");
    } finally {
      oe(!1), O(!1);
    }
  }, de = (Q, le) => /* @__PURE__ */ s.jsx("span", { className: `dsc-stage-pill${d === Q ? " is-on" : ""}`, children: le });
  return /* @__PURE__ */ s.jsxs("div", { className: r ? "" : "dsc-soil-wizard", children: [
    r ? null : /* @__PURE__ */ s.jsx(ie, { className: "dsc-glass", title: "Soil test wizard", icon: "root", children: /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Mobile probe stations capture a confirmed soil snapshot at a target pot. Return the probe to its idle home pot when finished." }) }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-stage-track", style: { margin: "12px 0", flexWrap: "wrap" }, children: [
      de("station", "Station"),
      de("target", "Plant"),
      de("timing", "Timing"),
      de("move", "Move"),
      de("capture", "Capture"),
      de("confirm", "Confirm"),
      de("done", "Home")
    ] }),
    d === "station" ? /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "1 · Probe station", icon: "root", children: [
      m.length ? /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: m.map((Q) => /* @__PURE__ */ s.jsxs(
        "button",
        {
          type: "button",
          className: `dsc-chip${f === Q.seat_id ? " dsc-chip--ok" : ""}`,
          onClick: () => _(Q.seat_id),
          children: [
            Q.seat_id,
            " · ",
            Q.tent
          ]
        },
        Q.seat_id
      )) }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: "No probe stations configured — set role in Settings → Probe stations." }),
      I ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ s.jsx(
          z,
          {
            label: I.reading_mode === "idle" ? "IDLE" : I.reading_mode.toUpperCase(),
            tone: I.reading_mode === "idle" ? "ok" : "warn"
          }
        ),
        /* @__PURE__ */ s.jsx(z, { label: I.online ? "ONLINE" : "OFFLINE", tone: I.online ? "ok" : "bad" }),
        /* @__PURE__ */ s.jsx(z, { label: `Home ${I.idle_home_pot_id || "—"}`, tone: "muted" })
      ] }) : null,
      I?.thereabouts ? /* @__PURE__ */ s.jsxs("div", { style: { marginTop: 10 }, children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { fontSize: 12 }, children: "Thereabouts @ idle home:" }),
        /* @__PURE__ */ s.jsx(Yr, { readings: I.thereabouts })
      ] }) : null,
      /* @__PURE__ */ s.jsx("div", { className: "dsc-row-actions", style: { marginTop: 12 }, children: /* @__PURE__ */ s.jsx(ae, { variant: "primary", disabled: !f, onClick: () => h("target"), children: "Next" }) })
    ] }) : null,
    d === "target" ? /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "2 · Target plant", icon: "roster", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ s.jsx(
          "button",
          {
            type: "button",
            className: `dsc-chip${x === "roster" ? " dsc-chip--ok" : ""}`,
            onClick: () => g("roster"),
            children: "Roster plant"
          }
        ),
        /* @__PURE__ */ s.jsx(
          "button",
          {
            type: "button",
            className: `dsc-chip${x === "adhoc" ? " dsc-chip--ok" : ""}`,
            onClick: () => g("adhoc"),
            children: "Ad hoc pot"
          }
        )
      ] }),
      x === "roster" ? k.length ? /* @__PURE__ */ s.jsxs("label", { children: [
        "Roster slot",
        /* @__PURE__ */ s.jsx(
          "select",
          {
            value: N,
            onChange: (Q) => {
              const le = k.find((xe) => String(xe.slot) === Q.target.value);
              le && (T(String(le.slot)), w(String(le.pot)), M(String(le.nickname || le.strain || "")));
            },
            children: k.map((Q) => /* @__PURE__ */ s.jsxs("option", { value: String(Q.slot), children: [
              "#",
              Q.slot,
              " ",
              String(Q.nickname || Q.strain || "plant"),
              " → ",
              String(Q.pot)
            ] }, String(Q.slot)))
          }
        )
      ] }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: "No roster plants on pots — use ad hoc or commit from Compose." }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("label", { children: [
          "Target pot",
          /* @__PURE__ */ s.jsx("select", { value: y, onChange: (Q) => w(Q.target.value), children: E_.map((Q) => /* @__PURE__ */ s.jsx("option", { value: Q, children: Q.toUpperCase() }, Q)) })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "Label (optional)",
          /* @__PURE__ */ s.jsx("input", { type: "text", value: E, onChange: (Q) => M(Q.target.value), placeholder: "e.g. Blue Dream #2" })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", style: { marginTop: 12 }, children: [
        /* @__PURE__ */ s.jsx(ae, { variant: "secondary", onClick: () => h("station"), children: "Back" }),
        /* @__PURE__ */ s.jsx(ae, { variant: "primary", onClick: () => h("timing"), children: "Next" })
      ] })
    ] }) : null,
    d === "timing" ? /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "3 · Timing", icon: "root", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", style: { flexWrap: "wrap", marginBottom: 12 }, children: Gj.map((Q) => /* @__PURE__ */ s.jsx(
        "button",
        {
          type: "button",
          className: `dsc-chip${C === Q.id ? " dsc-chip--ok" : ""}`,
          onClick: () => U(Q.id),
          children: Q.label
        },
        Q.id
      )) }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "Notes",
        /* @__PURE__ */ s.jsx("input", { type: "text", value: G, onChange: (Q) => X(Q.target.value), placeholder: "Optional operator note" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", style: { marginTop: 12 }, children: [
        /* @__PURE__ */ s.jsx(ae, { variant: "secondary", onClick: () => h("target"), children: "Back" }),
        /* @__PURE__ */ s.jsx(ae, { variant: "primary", onClick: () => h("move"), children: "Next" })
      ] })
    ] }) : null,
    d === "move" ? /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "4 · Move probe", icon: "root", children: [
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
        "Move the probe from ",
        /* @__PURE__ */ s.jsx("strong", { children: I?.idle_home_pot_id || f }),
        " to",
        " ",
        /* @__PURE__ */ s.jsx("strong", { children: y.toUpperCase() }),
        E ? ` (${E})` : "",
        ". Seat it at the same depth you use for routine checks."
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", style: { marginTop: 12 }, children: [
        /* @__PURE__ */ s.jsx(ae, { variant: "secondary", onClick: () => h("timing"), children: "Back" }),
        /* @__PURE__ */ s.jsx(ae, { variant: "primary", disabled: me, onClick: () => void $(), children: "Probe seated — start capture" })
      ] })
    ] }) : null,
    d === "capture" || d === "confirm" ? /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "5 · Capture", icon: "gauge", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ s.jsx(
          z,
          {
            label: te?.stable ? "STABLE" : "CAPTURING",
            tone: te?.stable ? "ok" : "warn",
            pulse: !te?.stable
          }
        ),
        te?.elapsed_s != null ? /* @__PURE__ */ s.jsx(z, { label: `${te.elapsed_s}s`, tone: "muted" }) : null,
        te?.variance != null ? /* @__PURE__ */ s.jsx(z, { label: `σ ${te.variance.toFixed(2)}`, tone: te.variance <= 2.5 ? "ok" : "warn" }) : null
      ] }),
      /* @__PURE__ */ s.jsx(Yr, { readings: te?.current }),
      te?.average ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 8, fontSize: 12 }, children: "Rolling average:" }),
        /* @__PURE__ */ s.jsx(Yr, { readings: te.average })
      ] }) : null,
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", style: { marginTop: 12 }, children: [
        /* @__PURE__ */ s.jsx(ae, { variant: "danger", onClick: () => O(!0), children: "Cancel" }),
        d === "confirm" ? /* @__PURE__ */ s.jsx(ae, { variant: "primary", disabled: me, onClick: () => void Z(), children: "Confirm snapshot" }) : /* @__PURE__ */ s.jsx(ae, { variant: "secondary", disabled: !0, children: "Waiting for stability…" })
      ] })
    ] }) : null,
    d === "done" ? /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "6 · Return home", icon: "ok", children: [
      /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: se }),
      te?.test ? /* @__PURE__ */ s.jsx(Yr, { readings: te.test.readings }) : null,
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", children: [
        "Return the probe to ",
        /* @__PURE__ */ s.jsx("strong", { children: ge ?? I?.idle_home_pot_id ?? "idle home" }),
        " ",
        "for safety before the next reading."
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", style: { marginTop: 12 }, children: [
        /* @__PURE__ */ s.jsx(
          ae,
          {
            variant: "primary",
            onClick: () => {
              h("station"), V(null), re(null), i?.();
            },
            children: "Done"
          }
        ),
        /* @__PURE__ */ s.jsx(
          ae,
          {
            variant: "secondary",
            onClick: () => {
              h("station"), V(null), re(null);
            },
            children: "Run another test"
          }
        )
      ] })
    ] }) : null,
    se && d !== "done" ? /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: se }) : null,
    /* @__PURE__ */ s.jsx(
      qe,
      {
        open: S,
        onDismiss: () => O(!1),
        onConfirm: () => void ne(),
        title: "Cancel soil test",
        confirmLabel: "Cancel session",
        help: null,
        children: /* @__PURE__ */ s.jsx("p", { children: "Aborts capture and sets the probe station back to idle mode." })
      }
    )
  ] });
}
const Vj = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SoilTestWizard: Fd
}, Symbol.toStringTag, { value: "Module" }));
function qj(n, i = 1) {
  return Number.isFinite(n) ? n.toFixed(i) : "—";
}
function Yj() {
  const { state: n, entity: i, tick: r, num: o } = Me(), d = Bn(), h = gt(), [m, p] = po(), f = [...ca].map((G) => ({ n: G, seat: _s(G, { state: n, entity: i }), oos: !nn(G, n) })).sort((G, X) => Number(G.oos) - Number(X.oos)), _ = x1(n), x = Number(m.get("pot") || 0), g = x >= 1 && x <= 4 && nn(x, n) ? x : null, y = o("sensor.dsc_growmat_runtime_today"), w = o("sensor.dsc_heatmat_relay_on_time"), [N, T] = v.useState([]), [E, M] = v.useState(!1);
  v.useEffect(() => {
    kd().then(T).catch(() => T([]));
  }, [E]);
  const C = (G) => {
    const X = new URLSearchParams(m);
    X.set("pot", String(G)), p(X, { replace: !0 });
  }, U = () => {
    const G = new URLSearchParams(m);
    G.delete("pot"), p(G, { replace: !0 });
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      zt,
      {
        icon: "root",
        title: "Root",
        subtitle: `${_.inService} of ${_.total} pots in service. Pots without sensors show no data.`
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(
        At,
        {
          label: "Coldest root",
          value: qj(o("sensor.dsc_coldest_root_zone_temp")),
          unit: "°C",
          onClick: () => d.open({
            entityId: "sensor.dsc_coldest_root_zone_temp",
            label: "Coldest root",
            unit: "°C"
          })
        }
      ) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(
        At,
        {
          label: "Heat mat today",
          value: Number.isFinite(y) ? y.toFixed(1) : qa(w * 1e3),
          unit: Number.isFinite(y) ? "h" : "",
          sub: Number.isFinite(w) ? `session ${qa(w * 1e3)}` : void 0,
          onClick: () => d.open({
            entityId: "switch.dsc_hub_grow_mat_demand",
            label: "Heat mat",
            kind: "binary",
            runtimeToday: "sensor.dsc_growmat_runtime_today",
            demandEntity: "switch.dsc_hub_grow_mat_demand"
          })
        }
      ) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(ie, { title: "Notes", children: /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: "Mat loop uses per-pot sense with plausibility filter. Metric click opens inspector; card chrome opens the seat." }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(
        ro,
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
      N.length ? /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Probe stations · thereabouts", icon: "root", children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "Idle mobile probes report last-known soil at their home pot — not the plant under test." }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-grid", children: N.map((G) => {
          const X = G.thereabouts?.moisture_pct, L = G.thereabouts?.soil_temp_c;
          return /* @__PURE__ */ s.jsxs("div", { className: "dsc-col-6", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
              /* @__PURE__ */ s.jsx("strong", { children: G.seat_id }),
              /* @__PURE__ */ s.jsx(z, { label: G.tent, tone: "muted" }),
              /* @__PURE__ */ s.jsx(
                z,
                {
                  label: G.reading_mode === "idle" ? "IDLE" : G.reading_mode.toUpperCase(),
                  tone: G.reading_mode === "idle" ? "ok" : "warn"
                }
              ),
              /* @__PURE__ */ s.jsx(z, { label: G.online ? "ONLINE" : "OFFLINE", tone: G.online ? "ok" : "bad" })
            ] }),
            /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { margin: 0, fontSize: 12 }, children: [
              "Home ",
              G.idle_home_pot_id || "—",
              " · moisture",
              " ",
              X != null && Number.isFinite(Number(X)) ? `${Number(X).toFixed(1)} %` : "—",
              " · soil",
              " ",
              L != null && Number.isFinite(Number(L)) ? `${Number(L).toFixed(1)} °C` : "—"
            ] })
          ] }, G.seat_id);
        }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ s.jsx(ae, { variant: "primary", onClick: () => M(!0), children: "Run soil test" }),
          /* @__PURE__ */ s.jsx(ae, { variant: "secondary", onClick: () => h("/fleet/calibrate"), children: "Soil cal" })
        ] })
      ] }) }) : null,
      f.map(({ n: G, seat: X, oos: L }) => /* @__PURE__ */ s.jsxs("div", { className: "dsc-col-12", children: [
        /* @__PURE__ */ s.jsx(Xj, { pot: G, oos: L, onOpenSeat: () => L ? void 0 : C(G) }),
        L ? null : /* @__PURE__ */ s.jsxs("button", { type: "button", className: "dsc-btn", style: { marginTop: 6 }, onClick: () => C(G), children: [
          "Open ",
          X.plantName !== "—" ? X.plantName : `POT${G}`,
          " seat"
        ] })
      ] }, G))
    ] }),
    /* @__PURE__ */ s.jsx(
      Xa,
      {
        open: g != null,
        onClose: U,
        title: g != null ? `Plant seat · POT${g}` : "Plant seat",
        children: g != null ? /* @__PURE__ */ s.jsx(jo, { pot: g, onSelectPot: C }) : null
      }
    ),
    /* @__PURE__ */ s.jsx(Xa, { open: E, onClose: () => M(!1), title: "Soil test", children: /* @__PURE__ */ s.jsx(Fd, { onClose: () => M(!1) }) }),
    /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 8 }, children: /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-chip", onClick: () => h("/live/climate"), children: "Climate Want" }) })
  ] });
}
function Xj({ pot: n, oos: i, onOpenSeat: r }) {
  const { state: o, entity: d, available: h } = Me(), m = Bn(), p = _s(n, { state: o, entity: d }), f = xo(n, o), _ = Sn(n, "moisture", o), x = Ne(_, { hours: 6, maxPoints: 48 }), g = we(`sensor.dsc_pot${n}_dryback_pct`), y = we(`sensor.dsc_pot${n}_soil_temperature`), w = we(_), N = we(Sn(n, "ec", o)), T = we(Sn(n, "ph", o)), E = we(`sensor.dsc_pot${n}_soil_moisture_rate`), M = Ju(n, "moisture", o), C = Ju(n, "ec", o), U = Ju(n, "ph", o), G = M && M.max !== 45 ? void 0 : { min: 0, max: 45 }, X = (L, V, te) => (re) => {
    re.stopPropagation(), m.open({ entityId: L, label: V, unit: te });
  };
  return /* @__PURE__ */ s.jsxs(ie, { className: `dsc-glass dsc-pot-card${i ? " is-oos" : ""}`, title: `Pot ${n}`, icon: "root", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-pot-card-head", onClick: r, role: "presentation", children: [
      /* @__PURE__ */ s.jsx(Hn, { spec: Ya(n, o, d), size: 28 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: i ? "Out of service" : p.plantName }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
          /* @__PURE__ */ s.jsx(z, { label: go(p.tent), tone: i || p.tent === "unassigned" ? "muted" : "ok" }),
          /* @__PURE__ */ s.jsx(
            z,
            {
              label: i ? "No data" : f.blockNeedAct ? `${p.need} (no act)` : `Need ${p.need}`,
              tone: i ? "muted" : p.need && p.need !== "ok" && p.need !== "—" ? "warn" : "ok"
            }
          ),
          f.labels.map((L) => /* @__PURE__ */ s.jsx(z, { label: L, tone: "warn" }, L))
        ] })
      ] }),
      /* @__PURE__ */ s.jsx(
        Hb,
        {
          series: x.series,
          color: Od(
            yi({
              value: w.value,
              band: M,
              margin: vo(M),
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
      /* @__PURE__ */ s.jsx(Ie, { label: "Moisture", value: w.value, min: 0, max: 100, unit: "%", band: M, segments: M ? ud(M.min, M.max) : ud(), stale: w.stale, onClick: () => m.open({ entityId: _, label: `P${n} moisture`, unit: "%" }) }),
      /* @__PURE__ */ s.jsx(Ie, { label: "Soil °C", value: y.value, min: 10, max: 40, unit: "°C", stale: y.stale, onClick: () => m.open({ entityId: `sensor.dsc_pot${n}_soil_temperature`, label: `P${n} soil T`, unit: "°C" }) }),
      /* @__PURE__ */ s.jsx(Ie, { label: "Dryback", value: g.value, min: 0, max: 100, unit: "%", band: G, stale: g.stale, onClick: () => m.open({ entityId: `sensor.dsc_pot${n}_dryback_pct`, label: `P${n} dryback`, unit: "%" }) }),
      /* @__PURE__ */ s.jsx(Ie, { label: "EC", value: N.value, min: 0, max: 3e3, unit: "", band: C, stale: N.stale, onClick: () => m.open({ entityId: Sn(n, "ec", o), label: `P${n} EC` }) }),
      /* @__PURE__ */ s.jsx(Ie, { label: "pH", value: T.value, min: 4, max: 8, unit: "", band: U, stale: T.stale, onClick: () => m.open({ entityId: Sn(n, "ph", o), label: `P${n} pH` }) }),
      /* @__PURE__ */ s.jsxs("button", { type: "button", className: "dsc-npk-hit", onClick: X(`sensor.dsc_pot${n}_soil_nitrogen`, `P${n} N`), children: [
        "N ",
        h(`sensor.dsc_pot${n}_soil_nitrogen`) ? p.n : "—"
      ] }),
      /* @__PURE__ */ s.jsxs("button", { type: "button", className: "dsc-npk-hit", onClick: X(`sensor.dsc_pot${n}_soil_phosphorus`, `P${n} P`), children: [
        "P ",
        h(`sensor.dsc_pot${n}_soil_phosphorus`) ? p.p : "—"
      ] }),
      /* @__PURE__ */ s.jsxs("button", { type: "button", className: "dsc-npk-hit", onClick: X(`sensor.dsc_pot${n}_soil_potassium`, `P${n} K`), children: [
        "K ",
        h(`sensor.dsc_pot${n}_soil_potassium`) ? p.k : "—"
      ] }),
      /* @__PURE__ */ s.jsxs(
        "button",
        {
          type: "button",
          className: "dsc-npk-hit",
          onClick: X(`sensor.dsc_pot${n}_soil_moisture_rate`, `P${n} moisture rate`),
          children: [
            "Rate ",
            Number.isFinite(E.value) ? E.value.toFixed(2) : "—",
            E.stale ? " *" : ""
          ]
        }
      )
    ] })
  ] });
}
function ed(n, i = 1) {
  return Number.isFinite(n) ? n.toFixed(i) : "—";
}
function Qj(n, i = Date.now()) {
  if (!n || n === "—" || n === "unknown" || n === "unavailable") return "—";
  const r = Date.parse(n);
  if (!Number.isFinite(r)) return n;
  const o = r - i, d = Math.abs(o), h = qa(d);
  return o >= 0 ? `in ${h}` : `${h} ago`;
}
function Pj() {
  const { state: n, num: i, entity: r } = Me(), o = gt(), d = Bn(), h = n("binary_sensor.dsc_clone_dark_period_violation") === "on", m = n("binary_sensor.dsc_clone_light_missing_in_window") === "on", p = n("binary_sensor.dsc_hub_light_catchup_active") === "on", f = n("light.dsc_hub_sf1000_dimmer") === "on", _ = n("binary_sensor.dsc_hub_4x8_window_open") === "on", x = n("binary_sensor.dsc_hub_2x4_window_open") === "on", g = i("sensor.dsc_expected_light_hours"), y = i("sensor.dsc_clone_expected_light_hours"), w = i("sensor.dsc_lights_on_today_4x8"), N = i("sensor.dsc_lights_on_today_2x4"), T = i("sensor.dsc_lights_deviation_today"), E = n("sensor.dsc_next_light_event", "—"), M = rd("main", { state: n, entity: r }), C = rd("clone", { state: n, entity: r }), U = i("number.dsc_hub_min_dark_hours"), G = i("number.dsc_hub_clone_light_hours"), [X, L] = v.useState(U), [V, te] = v.useState(G), re = M.lightHours != null ? { min: M.lightHours - 0.5, max: M.lightHours + 0.5, source: "stage", mixed: M.mixed } : null, se = C.lightHours != null ? { min: C.lightHours - 0.5, max: C.lightHours + 0.5, source: "stage", mixed: C.mixed } : null, ce = M.lightHours != null ? {
    min: 24 - M.lightHours - 0.5,
    max: 24 - M.lightHours + 0.5,
    source: "stage",
    mixed: M.mixed
  } : null, me = Number.isFinite(X) ? 24 - X : g, oe = Ba(me, re), ge = Ba(Number.isFinite(X) ? X : U, ce), ue = n("select.dsc_hub_clone_photoperiod") === "Independent", S = Ba(
    ue && Number.isFinite(V) ? V : y,
    se
  ), O = ($) => $ === "critical" ? "bad" : $ === "ok" ? "ok" : $ === "muted" ? "muted" : "warn", q = n("switch.dsc_hub_heater_demand") === "on", J = i("sensor.dsc_vent_heat_dump_btu"), I = (f || _) && (q || Number.isFinite(J) && J > 0), k = ($, Z, ne) => d.open({ entityId: $, label: Z, kind: ne || "numeric" });
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      zt,
      {
        icon: "lighting",
        title: "Light",
        subtitle: "Photoperiod desk — equal 4×8 / 2×4 cards. 4×8 Got is the window until a GPIO lamp exists.",
        primaryAction: /* @__PURE__ */ s.jsx(ae, { teal: !0, onClick: () => o("/live/climate"), children: "Climate Want" })
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-status-strip", children: [
      /* @__PURE__ */ s.jsx(
        z,
        {
          icon: h ? "alert" : "ok",
          label: h ? "2×4 DARK VIOLATION" : "Dark period OK",
          tone: h ? "bad" : "ok",
          pulse: h,
          onClick: () => k("binary_sensor.dsc_clone_dark_period_violation", "2×4 dark violation", "alert")
        }
      ),
      m ? /* @__PURE__ */ s.jsx(
        z,
        {
          label: "Missing in window",
          tone: "bad",
          pulse: !0,
          onClick: () => k("binary_sensor.dsc_clone_light_missing_in_window", "Light missing in window", "alert")
        }
      ) : null,
      p ? /* @__PURE__ */ s.jsx(
        z,
        {
          label: "Catch-up",
          tone: "warn",
          onClick: () => k("binary_sensor.dsc_hub_light_catchup_active", "Light catch-up", "alert")
        }
      ) : null,
      /* @__PURE__ */ s.jsx(
        z,
        {
          label: `Next ${Qj(E)}`,
          tone: "muted",
          onClick: () => k("sensor.dsc_next_light_event", "Next light event")
        }
      ),
      I ? /* @__PURE__ */ s.jsx(z, { label: "This window is buying heat", tone: "warn", onClick: () => o("/live/climate") }) : null
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass dsc-light-hero", title: "4×8 light", icon: "tent", children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "4×8 Got is the photoperiod window until a GPIO lamp exists — not a brightness." }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
          /* @__PURE__ */ s.jsx(
            z,
            {
              label: _ ? "WINDOW OPEN" : "DARK",
              tone: _ ? "ok" : "muted",
              onClick: () => k("binary_sensor.dsc_hub_4x8_window_open", "4×8 window", "binary")
            }
          ),
          /* @__PURE__ */ s.jsx(
            z,
            {
              label: oe.label,
              tone: O(oe.tone),
              onClick: () => k("sensor.dsc_expected_light_hours", "4×8 expected hours", "numeric")
            }
          )
        ] }),
        /* @__PURE__ */ s.jsx(
          Ie,
          {
            label: "Got / Want h",
            value: w,
            min: 0,
            max: 24,
            unit: "h",
            target: M.lightHours ?? g,
            progress: !0,
            onClick: () => k("sensor.dsc_lights_on_today_4x8", "4×8 hours today", "numeric")
          }
        ),
        /* @__PURE__ */ s.jsx(At, { label: "Want hours", value: ed(g, 0), unit: "h", onClick: () => k("sensor.dsc_expected_light_hours", "4×8 expected hours", "numeric") }),
        /* @__PURE__ */ s.jsx(
          ro,
          {
            entityId: "binary_sensor.dsc_hub_4x8_window_open",
            hours: 24,
            label: "4×8 window 24h",
            onClick: () => k("binary_sensor.dsc_hub_4x8_window_open", "4×8 window", "binary")
          }
        ),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ s.jsx(s_, { entityId: "time.dsc_hub_lights_on_time", label: "4×8 opens" }),
          /* @__PURE__ */ s.jsx(Je, { entityId: "number.dsc_hub_sunrise_duration", label: "Sunrise min" }),
          /* @__PURE__ */ s.jsx(Je, { entityId: "number.dsc_hub_sunset_duration", label: "Sunset min" }),
          /* @__PURE__ */ s.jsx(
            Je,
            {
              entityId: "number.dsc_hub_min_dark_hours",
              label: "Min dark h",
              hint: ge.label,
              tone: ge.tone,
              onLive: L
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass dsc-light-hero", title: "2×4 light", icon: "lighting", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
          /* @__PURE__ */ s.jsx(
            z,
            {
              label: f ? "SF1000 ON" : "SF1000 OFF",
              tone: f ? "ok" : "muted",
              onClick: () => k("light.dsc_hub_sf1000_dimmer", "SF1000", "binary")
            }
          ),
          /* @__PURE__ */ s.jsx(
            z,
            {
              label: x ? "WINDOW OPEN" : "DARK",
              tone: x ? "ok" : "muted",
              onClick: () => k("binary_sensor.dsc_hub_2x4_window_open", "2×4 window", "binary")
            }
          ),
          /* @__PURE__ */ s.jsx(
            z,
            {
              label: S.label,
              tone: O(S.tone),
              onClick: () => k("sensor.dsc_clone_expected_light_hours", "2×4 expected hours", "numeric")
            }
          )
        ] }),
        /* @__PURE__ */ s.jsx(
          Ie,
          {
            label: "Got / Want h",
            value: N,
            min: 0,
            max: 24,
            unit: "h",
            target: C.lightHours ?? y,
            progress: !0,
            onClick: () => k("sensor.dsc_lights_on_today_2x4", "2×4 hours today", "numeric")
          }
        ),
        /* @__PURE__ */ s.jsx(At, { label: "Want hours", value: ed(y, 0), unit: "h", onClick: () => k("sensor.dsc_clone_expected_light_hours", "2×4 expected hours", "numeric") }),
        /* @__PURE__ */ s.jsx(
          ro,
          {
            entityId: "light.dsc_hub_sf1000_dimmer",
            hours: 24,
            label: "SF1000 24h",
            onClick: () => k("light.dsc_hub_sf1000_dimmer", "SF1000", "binary")
          }
        ),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-demand-row", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ s.jsx(
            St,
            {
              confirm: {
                title: f ? "Turn off SF1000" : "Turn on SF1000",
                body: "Manual lamp control during dark period can stress clones. Confirm only if you mean it.",
                confirmLabel: f ? "Turn off" : "Turn on"
              },
              entityId: "light.dsc_hub_sf1000_dimmer",
              label: "SF1000",
              icon: "lighting",
              showBrightness: !0
            }
          ),
          /* @__PURE__ */ s.jsx(St, { confirm: !0, entityId: "switch.dsc_hub_auto_photoperiod", label: "Auto photoperiod" }),
          /* @__PURE__ */ s.jsx(St, { confirm: !0, entityId: "switch.dsc_hub_manual_light_hold", label: "Manual light hold" })
        ] }),
        /* @__PURE__ */ s.jsx(Fa, { entityId: "select.dsc_hub_clone_photoperiod", label: "Window source", icon: "clone" }),
        ue ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
          /* @__PURE__ */ s.jsx(s_, { entityId: "time.dsc_hub_clone_lights_on_time", label: "2×4 lights-on" }),
          /* @__PURE__ */ s.jsx(
            Je,
            {
              entityId: "number.dsc_hub_clone_light_hours",
              label: "2×4 hours",
              hint: S.label,
              tone: S.tone,
              onLive: te
            }
          )
        ] }) : /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
          "2×4 follows 4×8 (",
          n("time.dsc_hub_lights_on_time", "—"),
          "). Switch Window source to Independent to unlock start/hours."
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(
        At,
        {
          label: "Deviation today",
          value: ed(T, 2),
          unit: "h",
          sub: "Recorded by the hub",
          onClick: () => k("sensor.dsc_lights_deviation_today", "Lights deviation today", "numeric")
        }
      ) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ji, {}) })
    ] })
  ] });
}
function Xr(n, i = 1) {
  return Number.isFinite(n) ? n.toFixed(i) : "—";
}
function M_() {
  const n = gt(), { available: i, num: r } = Me(), o = bt("sensor.dsc_cfm_intake_main_allocated", "sensor.dsc_cfm_intake_main", {
    available: i,
    num: r
  }), d = bt("sensor.dsc_cfm_intake_2x4_allocated", "sensor.dsc_cfm_intake_2x4", {
    available: i,
    num: r
  }), h = bt("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available: i,
    num: r
  }), m = bt(
    "sensor.dsc_cfm_exhaust_recirc_allocated",
    "sensor.dsc_cfm_exhaust_recirc",
    { available: i, num: r }
  );
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page dsc-page--twin-chrome", children: [
    /* @__PURE__ */ s.jsx(
      zt,
      {
        icon: "twin",
        title: "Twin",
        subtitle: "Cinematic digital twin — pick a pot to open Root seat.",
        primaryAction: /* @__PURE__ */ s.jsx(ae, { teal: !0, onClick: () => n("/live/climate"), children: "Set Climate Want" }),
        actions: /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(ae, { onClick: () => n("/live/4x8"), children: "4×8 cockpit" }),
          /* @__PURE__ */ s.jsx(ae, { onClick: () => n("/live/2x4"), children: "2×4 cockpit" })
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty dsc-muted", style: { marginTop: 0 }, children: "Pick a pot in the twin to open its seat. Twin stays warm across Twin / 4×8 / 2×4. Orbit the scene — it no longer snaps home on hass ticks. 4×8 fixture glow follows the photoperiod window until a main lamp is wired." }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", style: { marginTop: 12 }, children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ji, {}) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ie, { className: "dsc-glass", title: "Air path", icon: "climate", children: /* @__PURE__ */ s.jsx(Ud, { intakeClone: d, intakeMain: o, outCfm: h, recircCfm: m }) }) })
    ] })
  ] });
}
function Ib({ tent: n }) {
  const { state: i, entity: r, num: o, tick: d, callWS: h, available: m } = Me(), p = T0(n), f = gt(), _ = Bn(), { setFocus: x } = Dd(), [g, y] = po(), [w, N] = v.useState([]), { hours: T, setHours: E, maxPoints: M } = ml(6);
  v.useEffect(() => {
    x(n);
  }, [n, x]);
  const C = yb(n, i, r), U = C.map((ke) => ke.pot).join(","), G = Number(g.get("pot") || 0), X = G >= 1 && G <= 4 && nn(G, i) && C.some((ke) => ke.pot === G) ? G : null, L = n === "main" ? "sensor.dsc_hub_tent_temperature" : "sensor.dsc_hub_clone_temperature", V = n === "main" ? "sensor.dsc_hub_tent_humidity" : "sensor.dsc_hub_clone_humidity", te = n === "main" ? "sensor.dsc_hub_vpd_kpa" : "sensor.dsc_hub_clone_vpd_kpa", re = Ne(L, { hours: T, maxPoints: M }), se = Ne(V, { hours: T, maxPoints: M }), ce = Ne(te, { hours: T, maxPoints: M }), me = we(L), oe = we(V), ge = we(te), ue = Number.isFinite(me.value) ? me.value : p.temp_c, S = Number.isFinite(oe.value) ? oe.value : p.rh_pct, O = Number.isFinite(ge.value) ? ge.value : p.vpd_kpa, q = i(
    n === "main" ? "binary_sensor.dsc_hub_4x8_window_open" : "binary_sensor.dsc_hub_2x4_window_open"
  ) === "on", J = i("light.dsc_hub_sf1000_dimmer") === "on", I = n === "clone" ? J : q, k = n === "main" ? bt("sensor.dsc_cfm_intake_main_allocated", "sensor.dsc_cfm_intake_main", { available: m, num: o }) : bt("sensor.dsc_cfm_intake_2x4_allocated", "sensor.dsc_cfm_intake_2x4", { available: m, num: o }), $ = bt(
    "sensor.dsc_cfm_exhaust_out_allocated",
    "sensor.dsc_cfm_exhaust_out",
    { available: m, num: o }
  ), Z = bt(
    "sensor.dsc_cfm_exhaust_recirc_allocated",
    "sensor.dsc_cfm_exhaust_recirc",
    { available: m, num: o }
  ), ne = bt("sensor.dsc_cfm_intake_2x4_allocated", "sensor.dsc_cfm_intake_2x4", {
    available: m,
    num: o
  }), de = bt("sensor.dsc_cfm_intake_main_allocated", "sensor.dsc_cfm_intake_main", {
    available: m,
    num: o
  }), Q = i("switch.dsc_hub_tent_manual_override") === "on", le = n === "main" ? "4×8 tent" : "2×4 tent", xe = n === "main" ? "Only the 4×8 house in Twin. Cascade-in is a port stub from 2×4, not a second tent." : "Only the 2×4 house in Twin. Cascade-out is a port stub to 4×8.";
  v.useEffect(() => {
    let ke = !1;
    async function rt() {
      const he = U ? U.split(",").map((Xe) => Number(Xe)).filter((Xe) => Number.isFinite(Xe) && Xe > 0) : [];
      if (!h || he.length === 0) {
        N([]);
        return;
      }
      const Fe = he.flatMap((Xe) => [
        `text.dsc_pot${Xe}_plant_name`,
        `input_select.dsc_pot${Xe}_tent`,
        `select.dsc_pot${Xe}_growth_stage`
      ]), _e = /* @__PURE__ */ new Date(), Ye = new Date(_e.getTime() - 48 * 3600 * 1e3);
      try {
        const Xe = await h({
          type: "history/history_during_period",
          start_time: Ye.toISOString(),
          end_time: _e.toISOString(),
          significant_changes_only: !0,
          minimal_response: !0,
          no_attributes: !0,
          entity_ids: Fe
        });
        if (ke || !Xe) return;
        const De = [];
        for (const [Dt, kt] of Object.entries(Xe))
          for (const Xt of kt || []) {
            const P = typeof Xt.lu == "number" ? Xt.lu * 1e3 : Xt.last_changed ? Date.parse(Xt.last_changed) : NaN, ve = String(Xt.s ?? Xt.state ?? "");
            !Number.isFinite(P) || !ve || ve === "unavailable" || De.push({ t: P, text: `${new Date(P).toLocaleString()} · ${Dt.split(".").pop()} → ${ve}` });
          }
        De.sort((Dt, kt) => kt.t - Dt.t), N(De.map((Dt) => Dt.text));
      } catch {
        ke || N([]);
      }
    }
    return rt(), () => {
      ke = !0;
    };
  }, [h, U, n]);
  const je = o(n === "main" ? "number.dsc_hub_target_temp" : "number.dsc_hub_clone_target_temp"), st = o(n === "main" ? "number.dsc_hub_rh_target_min" : "number.dsc_hub_clone_rh_min"), et = o(n === "main" ? "number.dsc_hub_rh_target_max" : "number.dsc_hub_clone_rh_max");
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      zt,
      {
        icon: n === "main" ? "tent" : "clone",
        title: le,
        subtitle: `Tent cockpit — ${C.length} seat(s). ${xe}`,
        primaryAction: /* @__PURE__ */ s.jsx(ae, { teal: !0, onClick: () => f("/live/twin"), children: "Both tents" }),
        actions: /* @__PURE__ */ s.jsx(ae, { primary: !0, onClick: () => f(`/live/climate?tent=${n}`), children: "Climate Want" })
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-tent-cockpit-strip", children: [
      /* @__PURE__ */ s.jsx(z, { label: `${C.length} plants`, tone: "ok" }),
      /* @__PURE__ */ s.jsx(
        z,
        {
          label: `T ${Xr(ue ?? NaN)}°C`,
          tone: me.stale && !p.online ? "warn" : "ok",
          onClick: () => _.open({ entityId: L, label: `${le} T`, unit: "°C" })
        }
      ),
      /* @__PURE__ */ s.jsx(
        z,
        {
          label: `RH ${Xr(S ?? NaN, 0)}%`,
          tone: oe.stale && !p.online ? "warn" : "ok",
          onClick: () => _.open({ entityId: V, label: `${le} RH`, unit: "%" })
        }
      ),
      /* @__PURE__ */ s.jsx(
        z,
        {
          label: `VPD ${Xr(O ?? NaN, 2)}`,
          tone: ge.stale && !p.online ? "warn" : "ok",
          onClick: () => _.open({ entityId: te, label: `${le} VPD`, unit: "kPa" })
        }
      ),
      /* @__PURE__ */ s.jsx(
        z,
        {
          label: n === "clone" ? I ? "SF1000 ON" : "SF1000 OFF" : q ? "PHOTO ON" : "PHOTO OFF",
          tone: I ? "ok" : "muted",
          onClick: () => _.open({
            entityId: n === "clone" ? "light.dsc_hub_sf1000_dimmer" : "binary_sensor.dsc_hub_4x8_window_open",
            label: n === "clone" ? "SF1000" : "4×8 window",
            kind: "binary"
          })
        }
      ),
      /* @__PURE__ */ s.jsx(
        z,
        {
          label: `IN ${Xr(k.value, 0)} cfm`,
          tone: "muted",
          onClick: () => _.open({
            entityId: k.entityId,
            label: `${le} intake CFM`,
            unit: "cfm"
          })
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(Yb, { only: n, hero: !0 }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ji, { compact: !0 }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ie, { className: "dsc-glass", title: "Air path", icon: "climate", children: /* @__PURE__ */ s.jsx(
        Ud,
        {
          compact: !0,
          focus: n,
          intakeClone: ne,
          intakeMain: de,
          outCfm: $,
          recircCfm: Z
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ie, { className: "dsc-glass", title: "Seat strip", icon: "seat", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: C.length === 0 ? /* @__PURE__ */ s.jsx("div", { className: "dsc-empty", children: "No pots assigned — Apply to tent from a seat." }) : C.map((ke) => {
        const rt = Number(i(`sensor.dsc_pot${ke.pot}_dryback_pct`)), he = Number.isFinite(rt) && rt > 45, Fe = xo(ke.pot, i), _e = !Fe.blockNeedAct && he;
        return /* @__PURE__ */ s.jsxs(
          "button",
          {
            type: "button",
            className: `dsc-chip dsc-chip--ok${_e ? " dsc-chip--pulse" : ""}`,
            onClick: () => {
              const Ye = new URLSearchParams(g);
              Ye.set("pot", String(ke.pot)), y(Ye, { replace: !0 });
            },
            children: [
              /* @__PURE__ */ s.jsx(Hn, { spec: Ya(ke.pot, i, r), size: 16 }),
              " P",
              ke.pot,
              " ",
              ke.plantName,
              " · M ",
              ke.moisture,
              " · Need",
              " ",
              Fe.blockNeedAct ? `${ke.need} (no act)` : ke.need,
              he ? " · dryback warn" : ""
            ]
          },
          ke.pot
        );
      }) }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Tent history", icon: "climate", children: [
        /* @__PURE__ */ s.jsx(pl, { hours: T, setHours: E, extras: fl }),
        /* @__PURE__ */ s.jsx(
          Tn,
          {
            live: !0,
            lastSyncAt: Math.max(re.lastSyncAt ?? 0, se.lastSyncAt ?? 0, ce.lastSyncAt ?? 0) || void 0,
            series: [
              {
                id: "t",
                label: "Temp",
                series: re.series,
                color: "var(--dsc-blue)",
                axis: "left",
                unit: "°C",
                band: Number.isFinite(je) ? { min: je - 1.5, max: je + 1.5 } : void 0
              },
              {
                id: "rh",
                label: "RH",
                series: se.series,
                color: "var(--dsc-teal)",
                axis: "right",
                unit: "%",
                band: { min: st, max: et }
              }
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Fans (this tent)", icon: "climate", children: [
        Q ? null : /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Fan sliders locked until Fan override is on (Climate → Command)." }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-fan-stack", children: n === "main" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(
            Ga,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_main",
              label: "Intake 4×8",
              disabled: !Q
            }
          ),
          /* @__PURE__ */ s.jsx(
            Ga,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_room",
              label: "Exhaust room (RECIRC)",
              disabled: !Q
            }
          ),
          /* @__PURE__ */ s.jsx(
            Ga,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_outside",
              label: "Exhaust outside (OUT)",
              disabled: !Q
            }
          )
        ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(
            Ga,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_2x4",
              label: "Intake 2×4",
              disabled: !Q
            }
          ),
          /* @__PURE__ */ s.jsx(St, { entityId: "light.dsc_hub_sf1000_dimmer", label: "SF1000", icon: "lighting" })
        ] }) })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ie, { className: "dsc-glass", title: "Plant log (48h)", icon: "roster", children: w.length === 0 ? /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: "Nothing logged in the last 48 hours." }) : /* @__PURE__ */ s.jsxs("ul", { className: "dsc-fault-list", children: [
        w.slice(0, 40).map((ke) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", style: { fontFamily: "var(--dsc-mono)", fontSize: 12 }, children: ke }) }, ke)),
        w.length > 40 ? /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsxs("span", { className: "dsc-muted", style: { fontFamily: "var(--dsc-mono)", fontSize: 12 }, children: [
          "+",
          w.length - 40,
          " more"
        ] }) }) : null
      ] }) }) })
    ] }),
    /* @__PURE__ */ s.jsx(
      Xa,
      {
        open: X != null,
        onClose: () => {
          const ke = new URLSearchParams(g);
          ke.delete("pot"), y(ke, { replace: !0 });
        },
        title: X != null ? `Plant seat · POT${X}` : "Plant seat",
        children: X != null ? /* @__PURE__ */ s.jsx(
          jo,
          {
            pot: X,
            onSelectPot: (ke) => {
              const rt = new URLSearchParams(g);
              rt.set("pot", String(ke)), y(rt, { replace: !0 });
            }
          }
        ) : null
      }
    )
  ] });
}
function Zj() {
  return /* @__PURE__ */ s.jsx(Ib, { tent: "main" });
}
function Kj() {
  return /* @__PURE__ */ s.jsx(Ib, { tent: "clone" });
}
const Jj = v.lazy(
  () => Promise.resolve().then(() => Gd).then((n) => ({ default: n.TuneLearningPage }))
), Ij = v.lazy(
  () => Promise.resolve().then(() => Gd).then((n) => ({ default: n.TuneAnalyticsPage }))
), Wj = v.lazy(
  () => Promise.resolve().then(() => Gd).then((n) => ({ default: n.FleetOverviewPage }))
), ew = v.lazy(
  () => Promise.resolve().then(() => a2).then((n) => ({ default: n.CalibratePage }))
);
v.lazy(
  () => Promise.resolve().then(() => Vj).then((n) => ({ default: n.SoilTestWizard }))
);
v.lazy(
  () => Promise.resolve().then(() => zj).then((n) => ({ default: n.SankeyFlowPrototype }))
);
const tw = [
  { id: "live", label: "Live", path: "/live/overview", icon: "live" },
  { id: "grow", label: "Grow", path: "/grow/roster", icon: "grow" },
  { id: "tune", label: "Tune", path: "/tune/learning", icon: "tune" },
  { id: "fleet", label: "Fleet", path: "/fleet", icon: "fleet" }
], nw = {
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
}, aw = {
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
function sw(n) {
  return n.startsWith("/grow") || n.startsWith("/plant") ? "grow" : n.startsWith("/tune") || n.startsWith("/advanced") ? "tune" : n.startsWith("/fleet") || n.startsWith("/system") || n.startsWith("/settings") ? "fleet" : (n.startsWith("/ops"), "live");
}
function lw(n, i) {
  const r = aw[n];
  return r ? r.includes("?") ? r : `${r}${i || ""}` : null;
}
const iw = ["1", "6", "11"], rw = ["room", "clone", "main"], ow = {
  room: "Room",
  clone: "2×4",
  main: "4×8"
}, cw = ["pot1", "pot2", "pot3", "pot4"], uw = ["2x4", "4x8"], dw = ["ap_ssid", "ap_psk", "ap_channel"], hw = [
  "ollama_base_url",
  "ollama_model",
  "cannalib_api_url",
  "cannalib_api_key",
  "cannalib_use_local_fallback"
];
function R_(n, i) {
  const r = {};
  for (const o of i)
    n[o] != null && (r[o] = n[o]);
  return r;
}
function mw(n) {
  const i = n.toLowerCase();
  return i === "hub" || i === "control" || i === "panel" ? "Brain & panel" : i.startsWith("pot") ? "Pots" : "Appliances";
}
function fw(n) {
  const i = n.toLowerCase();
  return i === "hub" ? "system" : i === "panel" || i.includes("control") ? "dash" : i.startsWith("pot") ? "root" : i.includes("tank") ? "tank" : i.includes("mister") || i.includes("clone") ? "clone" : i.includes("hum") || i.includes("heater") || i.includes("ac") ? "climate" : i.includes("fan") || i.includes("intake") || i.includes("exhaust") ? "fan" : i.includes("light") || i.includes("sf1000") ? "lighting" : i.includes("mat") ? "root" : "fleet";
}
function pw(n) {
  return n === "Router" ? "system" : "gauge";
}
function _w(n) {
  if (!n) return {};
  try {
    const i = JSON.parse(n);
    if (!i || typeof i != "object" || Array.isArray(i)) return {};
    const r = {};
    for (const [o, d] of Object.entries(i))
      o && d && (r[String(o)] = String(d));
    return r;
  } catch {
    return {};
  }
}
function bw({
  friendlyName: n,
  placement: i,
  onChange: r
}) {
  return /* @__PURE__ */ s.jsxs("tr", { children: [
    /* @__PURE__ */ s.jsx("td", { children: n }),
    /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx(
      "input",
      {
        type: "text",
        value: i,
        onChange: (o) => r(n, o.target.value),
        placeholder: "e.g. canopy center, 4x8 intake duct"
      }
    ) })
  ] });
}
function gw(n, i) {
  return i === "hub" ? n.hub : i === "panel" || i === "control" ? n.panel : n.pots[i] ? n.pots[i] : n.sonoffs[i] ? n.sonoffs[i] : null;
}
function xw(n) {
  return n == null || !Number.isFinite(n) ? "—" : new Date(n * 1e3).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
function $a(n, i) {
  const r = n.extra;
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
function vw({
  row: n,
  onSave: i
}) {
  const r = String(n.seat_id ?? ""), [o, d] = v.useState($a(n, "function")), [h, m] = v.useState($a(n, "placement")), [p, f] = v.useState(String($a(n, "capability_max_pct") || ""));
  return v.useEffect(() => {
    d($a(n, "function")), m($a(n, "placement")), f(String($a(n, "capability_max_pct") || ""));
  }, [n]), /* @__PURE__ */ s.jsxs("tr", { children: [
    /* @__PURE__ */ s.jsx("td", { children: r }),
    /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("input", { type: "text", value: o, onChange: (_) => d(_.target.value), placeholder: "e.g. intake_temp" }) }),
    /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("input", { type: "text", value: h, onChange: (_) => m(_.target.value), placeholder: "e.g. 4x8 intake duct" }) }),
    /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx("input", { type: "number", min: "1", max: "100", value: p, onChange: (_) => f(_.target.value), placeholder: "100" }) }),
    /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx(ae, { onClick: () => i(r, n, o, h, p), children: "Save" }) })
  ] });
}
function yw({
  row: n,
  seat: i
}) {
  const r = String(n.seat_id ?? "—"), o = String(
    n.role ?? (n.extra && typeof n.extra == "object" ? n.extra.role : "—")
  ), d = i?.online ?? !1, h = !!n.in_service, m = i?.values?.uptime, p = i?.values?.wifi_rssi ?? i?.values?.rssi, f = $a(n, "function"), _ = $a(n, "placement");
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-card", children: [
    /* @__PURE__ */ s.jsxs("h3", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
      /* @__PURE__ */ s.jsx(tn, { name: fw(r), size: 16, color: "var(--dsc-teal)" }),
      r,
      /* @__PURE__ */ s.jsx(z, { label: d ? "ONLINE" : "OFFLINE", tone: d ? "ok" : "bad" })
    ] }),
    /* @__PURE__ */ s.jsxs("dl", { className: "dsc-detail-list", children: [
      /* @__PURE__ */ s.jsx("dt", { children: "Role" }),
      /* @__PURE__ */ s.jsx("dd", { children: o }),
      /* @__PURE__ */ s.jsx("dt", { children: "IP / host" }),
      /* @__PURE__ */ s.jsx("dd", { children: String(n.host ?? i?.values?.host ?? "—") }),
      /* @__PURE__ */ s.jsx("dt", { children: "MAC" }),
      /* @__PURE__ */ s.jsx("dd", { children: String(n.mac ?? "—") }),
      /* @__PURE__ */ s.jsx("dt", { children: "Firmware" }),
      /* @__PURE__ */ s.jsx("dd", { children: String(i?.firmware ?? i?.values?.firmware_version ?? "—") }),
      /* @__PURE__ */ s.jsx("dt", { children: "Uptime" }),
      /* @__PURE__ */ s.jsx("dd", { children: typeof m == "number" ? `${Math.round(m / 60)} min` : "—" }),
      /* @__PURE__ */ s.jsx("dt", { children: "RSSI" }),
      /* @__PURE__ */ s.jsx("dd", { children: p != null ? `${p} dBm` : "—" }),
      /* @__PURE__ */ s.jsx("dt", { children: "Online" }),
      /* @__PURE__ */ s.jsx("dd", { children: d ? "yes" : "no" }),
      /* @__PURE__ */ s.jsx("dt", { children: "In service" }),
      /* @__PURE__ */ s.jsx("dd", { children: h ? "yes" : "no" }),
      /* @__PURE__ */ s.jsx("dt", { children: "Function" }),
      /* @__PURE__ */ s.jsx("dd", { children: f || "—" }),
      /* @__PURE__ */ s.jsx("dt", { children: "Placement" }),
      /* @__PURE__ */ s.jsx("dd", { children: _ || "—" }),
      /* @__PURE__ */ s.jsx("dt", { children: "Last seen" }),
      /* @__PURE__ */ s.jsx("dd", { children: xw(i?.last_seen ?? null) })
    ] })
  ] });
}
function jw() {
  const [n, i] = v.useState({}), [r, o] = v.useState({}), [d, h] = v.useState([]), [m, p] = v.useState(null), [f, _] = v.useState(null), [x, g] = v.useState(null), [y, w] = v.useState([]), [N, T] = v.useState([]), [E, M] = v.useState([]), [C, U] = v.useState(null), [G, X] = v.useState({}), [L, V] = v.useState(!1), [te, re] = v.useState(""), [se, ce] = v.useState(""), [me, oe] = v.useState(""), [ge, ue] = v.useState(""), [S, O] = v.useState(!1), [q, J] = v.useState(null), [I, k] = v.useState(null), [$, Z] = v.useState(null), [ne, de] = v.useState(!1), [Q, le] = v.useState(null), [xe, je] = v.useState(null), [st, et] = v.useState(!1), [ke, rt] = v.useState([]), [he, Fe] = v.useState({}), _e = async () => {
    const [P, ve, tt, pe, xt, Qt, _l, bs, gs, xs] = await Promise.all([
      z0(),
      D0(),
      Xu(),
      $0(),
      U0(),
      O0().catch(() => null),
      q0().catch(() => ({ devices: [] })),
      Y0().catch(() => null),
      P0().catch(() => null),
      kd().catch(() => [])
    ]);
    i(R_(P.settings, dw)), o(R_(P.settings, hw)), h(P.inventory), _(ve), g(tt), w(pe.devices ?? []), T(xt), p(Qt ? sb(Qt) : null), M(_l.devices ?? []), U(bs), L || X(_w(P.settings.zigbee_placements)), !st && gs && je(gs), rt(xs), Fe((Un) => {
      const vt = { ...Un };
      for (const Nt of xs)
        vt[Nt.seat_id] || (vt[Nt.seat_id] = {
          idle_home_pot_id: Nt.idle_home_pot_id || Nt.seat_id,
          tent: Nt.tent || "2x4"
        });
      return vt;
    });
  };
  v.useEffect(() => {
    _e().catch(() => {
    });
  }, []);
  const Ye = async () => {
    await Yu(r), await _e();
  }, Xe = async () => {
    await Yu(n);
  }, De = async (P, ve) => {
    await ld(P, { in_service: ve }), await _e();
  }, Dt = async (P, ve, tt, pe, xt) => {
    const Qt = ve.extra && typeof ve.extra == "object" ? { ...ve.extra } : {};
    Qt.function = tt, Qt.placement = pe, xt && (Qt.capability_max_pct = Number(xt)), await ld(P, { extra: Qt }), await _e();
  }, kt = v.useMemo(
    () => d.map((P) => ({
      ...P,
      seat: m ? gw(m, String(P.seat_id)) : null
    })),
    [d, m]
  ), Xt = v.useMemo(() => {
    const P = /* @__PURE__ */ new Map();
    for (const ve of kt) {
      const tt = mw(String(ve.seat_id)), pe = P.get(tt) ?? [];
      pe.push(ve), P.set(tt, pe);
    }
    return Array.from(P.entries());
  }, [kt]);
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(zt, { icon: "settings", title: "Settings", subtitle: "DSC-HUB 7.1.0 — Pi appliance" }),
    /* @__PURE__ */ s.jsxs("section", { className: "dsc-card", children: [
      /* @__PURE__ */ s.jsx("h3", { children: "Fleet inventory" }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Every device with its address, firmware, online state, and service status." }),
      Xt.map(([P, ve]) => /* @__PURE__ */ s.jsxs(
        "details",
        {
          className: "dsc-inventory-group",
          open: ve.some(({ seat: tt, in_service: pe }) => !(tt?.online ?? !1) || !pe),
          children: [
            /* @__PURE__ */ s.jsx("summary", { children: P }),
            /* @__PURE__ */ s.jsx("div", { className: "dsc-grid", children: ve.map(({ seat: tt, ...pe }) => /* @__PURE__ */ s.jsxs("div", { className: "dsc-col-4", children: [
              /* @__PURE__ */ s.jsx(yw, { row: pe, seat: tt }),
              /* @__PURE__ */ s.jsxs("label", { style: { display: "block", marginTop: 8, fontSize: "0.85rem" }, children: [
                /* @__PURE__ */ s.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: !!pe.in_service,
                    onChange: (xt) => J({ seatId: String(pe.seat_id), next: xt.target.checked })
                  }
                ),
                " ",
                "In service"
              ] })
            ] }, String(pe.seat_id))) })
          ]
        },
        P
      )),
      /* @__PURE__ */ s.jsx(
        qe,
        {
          open: q != null,
          onDismiss: () => J(null),
          onConfirm: async () => {
            if (!q) return;
            const { seatId: P, next: ve } = q;
            J(null), await De(P, ve);
          },
          title: q?.next ? `Put ${q.seatId} in service` : `Take ${q?.seatId ?? "device"} out of service`,
          confirmLabel: q?.next ? "Enable" : "Disable",
          help: null,
          children: /* @__PURE__ */ s.jsx("p", { children: q?.next ? "The brain will treat this seat as part of the live kit." : "Out-of-service seats stay visible but never fake readings." })
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
        /* @__PURE__ */ s.jsx("tbody", { children: d.map((P) => /* @__PURE__ */ s.jsx(vw, { row: P, onSave: Dt }, String(P.seat_id))) })
      ] }) })
    ] }),
    /* @__PURE__ */ s.jsx("section", { className: "dsc-card", children: /* @__PURE__ */ s.jsxs("details", { className: "dsc-inventory-group", open: !0, children: [
      /* @__PURE__ */ s.jsx("summary", { children: "Global tuning" }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Fleet-wide fan/light demand scale (0.5–1.5) and per-zone temperature / RH sensor offsets applied before control and ingest." }),
      xe ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsxs("label", { children: [
          "Fan demand scale",
          /* @__PURE__ */ s.jsx(
            "input",
            {
              type: "range",
              min: "0.5",
              max: "1.5",
              step: "0.05",
              value: xe.fan_demand_scale,
              onChange: (P) => {
                et(!0), je({
                  ...xe,
                  fan_demand_scale: Number(P.target.value)
                });
              }
            }
          ),
          /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", children: xe.fan_demand_scale.toFixed(2) })
        ] }),
        /* @__PURE__ */ s.jsxs("label", { children: [
          "Light brightness scale",
          /* @__PURE__ */ s.jsx(
            "input",
            {
              type: "range",
              min: "0.5",
              max: "1.5",
              step: "0.05",
              value: xe.light_brightness_scale,
              onChange: (P) => {
                et(!0), je({
                  ...xe,
                  light_brightness_scale: Number(P.target.value)
                });
              }
            }
          ),
          /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", children: xe.light_brightness_scale.toFixed(2) })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-table-scroll", children: /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "Zone" }),
            /* @__PURE__ */ s.jsx("th", { children: "Temp offset °C" }),
            /* @__PURE__ */ s.jsx("th", { children: "RH offset %" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: rw.map((P) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: ow[P] }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx(
              "input",
              {
                type: "number",
                step: "0.1",
                value: xe.temp_offset_c[P],
                onChange: (ve) => {
                  et(!0), je({
                    ...xe,
                    temp_offset_c: {
                      ...xe.temp_offset_c,
                      [P]: Number(ve.target.value)
                    }
                  });
                }
              }
            ) }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx(
              "input",
              {
                type: "number",
                step: "0.5",
                value: xe.rh_offset_pct[P],
                onChange: (ve) => {
                  et(!0), je({
                    ...xe,
                    rh_offset_pct: {
                      ...xe.rh_offset_pct,
                      [P]: Number(ve.target.value)
                    }
                  });
                }
              }
            ) })
          ] }, P)) })
        ] }) }),
        /* @__PURE__ */ s.jsx(
          ae,
          {
            onClick: async () => {
              if (!xe) return;
              const P = await Z0({
                fan_demand_scale: xe.fan_demand_scale,
                light_brightness_scale: xe.light_brightness_scale,
                temp_offset_c: xe.temp_offset_c,
                rh_offset_pct: xe.rh_offset_pct
              });
              je(P), et(!1);
            },
            children: "Save global tuning"
          }
        )
      ] }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Loading modifiers…" })
    ] }) }),
    /* @__PURE__ */ s.jsx("section", { className: "dsc-card", children: /* @__PURE__ */ s.jsxs("details", { className: "dsc-inventory-group", open: ke.some((P) => P.reading_mode !== "idle"), children: [
      /* @__PURE__ */ s.jsx("summary", { children: "Probe stations" }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Mobile soil probes idle at a home pot and publish thereabouts readings until a soil test moves them." }),
      ke.length ? /* @__PURE__ */ s.jsx("div", { className: "dsc-table-scroll", children: /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "Seat" }),
          /* @__PURE__ */ s.jsx("th", { children: "Mode" }),
          /* @__PURE__ */ s.jsx("th", { children: "Idle home pot" }),
          /* @__PURE__ */ s.jsx("th", { children: "Tent" }),
          /* @__PURE__ */ s.jsx("th", { children: "Thereabouts moisture" }),
          /* @__PURE__ */ s.jsx("th", {})
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: ke.map((P) => {
          const ve = he[P.seat_id] ?? {
            idle_home_pot_id: P.idle_home_pot_id,
            tent: P.tent
          }, tt = P.thereabouts?.moisture_pct;
          return /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsxs("td", { children: [
              P.seat_id,
              /* @__PURE__ */ s.jsx(
                z,
                {
                  label: P.online ? "ONLINE" : "OFFLINE",
                  tone: P.online ? "ok" : "bad"
                }
              )
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: P.reading_mode }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx(
              "select",
              {
                value: ve.idle_home_pot_id,
                onChange: (pe) => Fe((xt) => ({
                  ...xt,
                  [P.seat_id]: { ...ve, idle_home_pot_id: pe.target.value }
                })),
                children: cw.map((pe) => /* @__PURE__ */ s.jsx("option", { value: pe, children: pe }, pe))
              }
            ) }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx(
              "select",
              {
                value: ve.tent,
                onChange: (pe) => Fe((xt) => ({
                  ...xt,
                  [P.seat_id]: { ...ve, tent: pe.target.value }
                })),
                children: uw.map((pe) => /* @__PURE__ */ s.jsx("option", { value: pe, children: pe }, pe))
              }
            ) }),
            /* @__PURE__ */ s.jsx("td", { children: tt != null && Number.isFinite(Number(tt)) ? `${Number(tt).toFixed(1)} %` : "—" }),
            /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx(
              ae,
              {
                onClick: async () => {
                  await K0(P.seat_id, ve), await _e();
                },
                children: "Save"
              }
            ) })
          ] }, P.seat_id);
        }) })
      ] }) }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: "No probe stations — assign role probe_station on a pot in inventory." })
    ] }) }),
    /* @__PURE__ */ s.jsxs("section", { className: "dsc-card", children: [
      /* @__PURE__ */ s.jsx("h3", { children: "Network" }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Channel is limited to 1, 6, or 11. Applying restarts the hub's Wi-Fi — devices reconnect on their own." }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "AP SSID",
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "text",
            value: n.ap_ssid ?? "",
            onChange: (P) => i({ ...n, ap_ssid: P.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "AP PSK",
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "password",
            value: n.ap_psk ?? "",
            onChange: (P) => i({ ...n, ap_psk: P.target.value }),
            placeholder: f?.ap_psk_set ? "••••••••" : "set on first save"
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "Channel",
        /* @__PURE__ */ s.jsx(
          "select",
          {
            value: n.ap_channel ?? "6",
            onChange: (P) => i({ ...n, ap_channel: P.target.value }),
            children: iw.map((P) => /* @__PURE__ */ s.jsx("option", { value: P, children: P }, P))
          }
        )
      ] }),
      f?.dhcp_map ? /* @__PURE__ */ s.jsx("div", { className: "dsc-table-scroll", children: /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "Seat" }),
          /* @__PURE__ */ s.jsx("th", { children: "Host" }),
          /* @__PURE__ */ s.jsx("th", { children: "MAC" })
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: f.dhcp_map.map((P) => /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("td", { children: String(P.seat_id) }),
          /* @__PURE__ */ s.jsx("td", { children: String(P.host ?? "—") }),
          /* @__PURE__ */ s.jsx("td", { children: String(P.mac ?? "—") })
        ] }, String(P.seat_id))) })
      ] }) }) : null,
      /* @__PURE__ */ s.jsx(ae, { variant: "danger", onClick: () => O(!0), children: "Apply network" }),
      me ? /* @__PURE__ */ s.jsx("pre", { className: "dsc-honesty", children: me }) : null,
      /* @__PURE__ */ s.jsx(
        qe,
        {
          open: S,
          onDismiss: () => O(!1),
          onConfirm: async () => {
            O(!1), await Xe();
            const P = await L0();
            oe(JSON.stringify(P, null, 2)), await _e();
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
            onChange: (P) => o({ ...r, ollama_base_url: P.target.value }),
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
            onChange: (P) => o({ ...r, ollama_model: P.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ s.jsx(ae, { onClick: async () => re(JSON.stringify(await F0())), children: "Test Ollama" }),
      te ? /* @__PURE__ */ s.jsx("pre", { className: "dsc-honesty", children: te }) : null,
      /* @__PURE__ */ s.jsxs("label", { children: [
        "CannaLib API URL",
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "text",
            value: r.cannalib_api_url ?? "",
            onChange: (P) => o({ ...r, cannalib_api_url: P.target.value })
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
            onChange: (P) => o({ ...r, cannalib_api_key: P.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "checkbox",
            checked: (r.cannalib_use_local_fallback ?? "true") === "true",
            onChange: (P) => o({
              ...r,
              cannalib_use_local_fallback: P.target.checked ? "true" : "false"
            })
          }
        ),
        "Use on-Pi sqlite fallback when remote API is down"
      ] }),
      /* @__PURE__ */ s.jsx(ae, { onClick: async () => ce(JSON.stringify(await G0())), children: "Test CannaLib" }),
      se ? /* @__PURE__ */ s.jsx("pre", { className: "dsc-honesty", children: se }) : null
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "dsc-card", children: [
      /* @__PURE__ */ s.jsx("h3", { children: "Catalog" }),
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
        x ? String(x.note ?? "—") : "Loading…",
        " (source:",
        " ",
        x ? String(x.source ?? "unknown") : "—",
        ")",
        x?.cannalib_api_url ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          " ",
          "— URL: ",
          /* @__PURE__ */ s.jsx("code", { children: String(x.cannalib_api_url) })
        ] }) : null
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Chemistry, height, and lineage come straight from the catalog — gaps are never filled with guesses." }),
      /* @__PURE__ */ s.jsx(ae, { onClick: async () => g(await Xu()), children: "Refresh status" }),
      /* @__PURE__ */ s.jsx(ae, { onClick: () => de(!0), children: "Reload local catalogs" }),
      /* @__PURE__ */ s.jsx(
        qe,
        {
          open: ne,
          onDismiss: () => de(!1),
          onConfirm: async () => {
            de(!1), await H0(), g(await Xu());
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
        /* @__PURE__ */ s.jsx("tbody", { children: y.map((P) => /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("td", { children: String(P.seat_id) }),
          /* @__PURE__ */ s.jsx("td", { children: String(P.yaml ?? "—") }),
          /* @__PURE__ */ s.jsx("td", { children: String(P.expected_firmware ?? "—") }),
          /* @__PURE__ */ s.jsx("td", { children: P.online ? String(P.last_firmware ?? "online") : "offline" }),
          /* @__PURE__ */ s.jsxs("td", { children: [
            /* @__PURE__ */ s.jsx(ae, { onClick: () => k({ seatId: String(P.seat_id), action: "ota" }), children: "Queue OTA" }),
            /* @__PURE__ */ s.jsx(ae, { onClick: () => k({ seatId: String(P.seat_id), action: "compile" }), children: "Queue compile" })
          ] })
        ] }, String(P.seat_id))) })
      ] }) }),
      /* @__PURE__ */ s.jsx(
        qe,
        {
          open: I != null,
          onDismiss: () => k(null),
          onConfirm: async () => {
            if (!I) return;
            const P = I;
            k(null), await B0(P.seatId, P.action), await _e();
          },
          title: I?.action === "compile" ? "Queue firmware compile" : "Queue OTA flash",
          confirmLabel: I?.action === "compile" ? "Queue compile" : "Queue OTA",
          help: null,
          children: /* @__PURE__ */ s.jsxs("p", { children: [
            "Queues an ESPHome ",
            I?.action === "compile" ? "compile" : "OTA",
            " job for",
            " ",
            /* @__PURE__ */ s.jsx("strong", { children: I?.seatId ?? "device" }),
            ". Nothing flashes until the build worker runs."
          ] })
        }
      ),
      N.length ? /* @__PURE__ */ s.jsx("pre", { className: "dsc-honesty", children: JSON.stringify(N.slice(0, 3), null, 2) }) : null
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "dsc-card", children: [
      /* @__PURE__ */ s.jsx("h3", { children: "Zigbee (SkyConnect)" }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Extra canopy sensors and smart plugs — separate from climate control." }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 10 }, children: [
        /* @__PURE__ */ s.jsx(
          z,
          {
            label: C?.radio_up === !0 ? "RADIO UP" : "RADIO DOWN",
            tone: C?.radio_up === !0 ? "ok" : "bad"
          }
        ),
        C?.mqtt_connected === !1 ? /* @__PURE__ */ s.jsx(z, { label: "MQTT OFFLINE", tone: "bad" }) : null,
        C?.permit_join === !0 ? /* @__PURE__ */ s.jsx(z, { label: "JOIN OPEN", tone: "warn" }) : null,
        C?.radio_note ? /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", style: { fontSize: 12 }, children: String(C.radio_note) }) : null
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", children: [
        /* @__PURE__ */ s.jsx(ae, { onClick: () => Z(!0), disabled: C?.radio_up !== !0, children: "Permit join (2 min)" }),
        /* @__PURE__ */ s.jsx(ae, { onClick: () => Z(!1), children: "Stop join" })
      ] }),
      /* @__PURE__ */ s.jsx(
        qe,
        {
          open: $ != null,
          onDismiss: () => Z(null),
          onConfirm: async () => {
            const P = $ === !0;
            Z(null), await V0(P), await _e();
          },
          title: $ ? "Permit Zigbee join" : "Stop Zigbee join",
          confirmLabel: $ ? "Permit join" : "Stop join",
          help: null,
          children: /* @__PURE__ */ s.jsx("p", { children: $ ? "Opens the coordinator for new devices for about two minutes." : "Closes join mode on the SkyConnect coordinator." })
        }
      ),
      E.filter((P) => P.type !== "Coordinator").length ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx("div", { className: "dsc-table-scroll", children: /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "Name" }),
            /* @__PURE__ */ s.jsx("th", { children: "IEEE" }),
            /* @__PURE__ */ s.jsx("th", { children: "Type" }),
            /* @__PURE__ */ s.jsx("th", { children: "Model" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: E.filter((P) => P.type !== "Coordinator").map((P) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsxs("td", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
              /* @__PURE__ */ s.jsx(tn, { name: pw(String(P.type ?? "")), size: 14, color: "var(--dsc-gray-5)" }),
              String(P.friendly_name ?? "—")
            ] }),
            /* @__PURE__ */ s.jsx("td", { children: String(P.ieee_address ?? "—") }),
            /* @__PURE__ */ s.jsx("td", { children: String(P.type ?? "—") }),
            /* @__PURE__ */ s.jsxs("td", { children: [
              String(P.vendor ?? ""),
              P.model ? ` ${String(P.model)}` : ""
            ] })
          ] }, String(P.ieee_address ?? P.friendly_name))) })
        ] }) }),
        /* @__PURE__ */ s.jsx("h4", { style: { marginTop: 16 }, children: "Placements" }),
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Map each Zigbee friendly name to a tent placement label (e.g. canopy, intake). Climate and canopy ingest use these labels." }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-table-scroll", children: /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "Friendly name" }),
            /* @__PURE__ */ s.jsx("th", { children: "Placement label" })
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: E.filter((P) => P.type !== "Coordinator").map((P) => {
            const ve = String(P.friendly_name ?? "");
            return /* @__PURE__ */ s.jsx(
              bw,
              {
                friendlyName: ve,
                placement: G[ve] ?? "",
                onChange: (tt, pe) => {
                  V(!0), X((xt) => ({ ...xt, [tt]: pe }));
                }
              },
              ve
            );
          }) })
        ] }) }),
        /* @__PURE__ */ s.jsx(
          ae,
          {
            onClick: async () => {
              const P = {};
              for (const [ve, tt] of Object.entries(G))
                ve && tt.trim() && (P[ve] = tt.trim());
              await Yu({ zigbee_placements: JSON.stringify(P) }), V(!1), await _e();
            },
            children: "Save placements"
          }
        )
      ] }) : C?.radio_up === !0 ? /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 10 }, children: "Coordinator is online but no end devices are paired yet — permit join when you are ready to add sensors or plugs." }) : /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { marginTop: 10 }, children: [
        "SkyConnect coordinator is not online — fix USB, power, and ",
        /* @__PURE__ */ s.jsx("code", { children: "dsc-hub-z2m" }),
        " logs before pairing. An empty device list here means the radio is down, not that you have a clean network."
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("section", { className: "dsc-card", children: [
      /* @__PURE__ */ s.jsx("h3", { children: "Backup" }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Export ops sqlite, manifest, optional .env and z2m data." }),
      /* @__PURE__ */ s.jsx("a", { className: "dsc-button", href: X0(), download: "dsc-hub-backup.zip", children: "Download backup" }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "Import backup",
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "file",
            accept: ".zip",
            onChange: (P) => {
              const ve = P.target.files?.[0];
              ve && le(ve), P.target.value = "";
            }
          }
        )
      ] }),
      /* @__PURE__ */ s.jsx(
        qe,
        {
          open: Q != null,
          onDismiss: () => le(null),
          onConfirm: async () => {
            const P = Q;
            le(null), P && ue(JSON.stringify(await Q0(P)));
          },
          title: "Import backup",
          confirmLabel: "Import",
          help: null,
          children: /* @__PURE__ */ s.jsxs("p", { children: [
            "Restores ops sqlite and related files from ",
            /* @__PURE__ */ s.jsx("strong", { children: Q?.name ?? "backup" }),
            ". This overwrites live Pi state."
          ] })
        }
      ),
      ge ? /* @__PURE__ */ s.jsx("pre", { className: "dsc-honesty", children: ge }) : null
    ] }),
    /* @__PURE__ */ s.jsx(ae, { primary: !0, onClick: Ye, children: "Save integrations" })
  ] });
}
const ww = /Stage\s*-\s*Off\s*;\s*Clone\s*-\s*Custom/i, Sw = /^Stage\s*-\s*.+;\s*Clone\s*-\s*.+$/, dd = /dark[- ]period/i;
function kw(n) {
  let i = !1;
  const r = [];
  for (const h of n)
    if (!ww.test(h.message)) {
      if (Sw.test(h.message)) {
        if (i) continue;
        i = !0;
      }
      r.push(h);
    }
  const o = r.filter((h) => dd.test(h.message)), d = r.filter((h) => !dd.test(h.message));
  return [...o, ...d];
}
function Nw(n) {
  return dd.test(n) ? "alert" : "normal";
}
function Wb(n) {
  return !Number.isFinite(n) || n <= 0 ? "—" : n >= 86400 ? `${(n / 86400).toFixed(1)}d` : n >= 3600 ? `${(n / 3600).toFixed(1)}h` : `${Math.round(n / 60)}m`;
}
function A_(n, i, r) {
  return !Number.isFinite(n) || !Number.isFinite(i) || !Number.isFinite(r) ? "?—" : n < i ? `↓ low ${(n - i).toFixed(2)}` : n > r ? `↑ high +${(n - r).toFixed(2)}` : "→ on target";
}
function Cw({
  hubOnline: n,
  panelOk: i,
  panelHaOnly: r,
  panelOffline: o,
  heartbeat: d,
  beatOk: h,
  uptimeSec: m,
  alerts: p,
  fleetStatus: f,
  fleetExpected: _,
  cannalibOnline: x,
  cannalibHits: g,
  cannalibSummary: y,
  inServiceLabel: w,
  activeFaultCount: N,
  onChip: T
}) {
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-status-strip", children: [
    /* @__PURE__ */ s.jsx(z, { icon: n ? "ok" : "alert", label: n ? "HUB ONLINE" : "HUB OFFLINE", tone: n ? "ok" : "bad", onClick: () => T?.("sensor.dsc_hub_uptime", "Hub") }),
    /* @__PURE__ */ s.jsx(
      z,
      {
        label: i ? "PANEL LINKED" : r ? "PANEL LIMITED LINK" : o ? "PANEL OFFLINE" : "PANEL…",
        tone: i ? "ok" : r ? "warn" : "bad",
        onClick: () => T?.("binary_sensor.dsc_hub_panel_link", "Panel")
      }
    ),
    /* @__PURE__ */ s.jsx(z, { icon: h ? "ok" : "alert", label: h ? `BEAT ${d}` : "NO BEAT", tone: h ? "ok" : "bad", onClick: () => T?.("sensor.dsc_hub_heartbeat", "Beat") }),
    /* @__PURE__ */ s.jsx(z, { label: Wb(m), tone: n ? "ok" : "muted" }),
    /* @__PURE__ */ s.jsx(
      z,
      {
        icon: N === 0 ? "ok" : "alert",
        label: N === 0 ? "All clear" : `${N} alert(s)`,
        tone: N === 0 ? "ok" : "bad",
        pulse: N > 0,
        onClick: () => T?.("sensor.dsc_active_alert_count", "Alerts")
      }
    ),
    /* @__PURE__ */ s.jsx(
      z,
      {
        label: f === "ok" ? `FLEET ${_}` : "FLEET DRIFT",
        tone: f === "ok" ? "ok" : "warn",
        onClick: () => T?.("sensor.dsc_fleet_version_status", "Fleet")
      }
    ),
    /* @__PURE__ */ s.jsx(
      z,
      {
        label: x ? `CANNALIB ${g} hits` : "CANNALIB OFF",
        tone: x ? "ok" : "bad",
        onClick: () => T?.("sensor.dsc_cannalib_api_hits", "Cannalib")
      }
    ),
    /* @__PURE__ */ s.jsx(z, { label: x ? y : "— MB", tone: "muted" }),
    /* @__PURE__ */ s.jsx(z, { label: w, tone: "muted" })
  ] });
}
function Tw({ bus: n }) {
  const { num: i, available: r } = n, o = n.state("binary_sensor.dsc_cannalib_api_online") === "on", d = [
    { label: "Hits", id: "sensor.dsc_cannalib_api_hits", fmt: (h) => String(Math.round(h)) },
    { label: "Bandwidth in", id: "sensor.dsc_cannalib_bytes_in", fmt: (h) => `${(h / 1024).toFixed(1)} KB` },
    { label: "Bandwidth out", id: "sensor.dsc_cannalib_bytes_out", fmt: (h) => `${(h / 1024).toFixed(1)} KB` },
    { label: "Corpus strains", id: "sensor.dsc_cannalib_corpus_strains", fmt: (h) => String(Math.round(h)) }
  ];
  return /* @__PURE__ */ s.jsx(ie, { className: "dsc-glass", title: "Cannalib catalog API", icon: "research", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: d.map((h) => /* @__PURE__ */ s.jsx(
    At,
    {
      label: h.label,
      value: o && r(h.id) ? h.fmt(i(h.id, 0)) : "—",
      tone: o ? "ok" : "muted"
    },
    h.id
  )) }) });
}
function eg({ bus: n, onNavigate: i }) {
  const { state: r, entity: o } = n, d = [];
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
function Ew({ bus: n, onNavigate: i }) {
  return /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: [1, 2, 3, 4].map((r) => {
    const o = n.state(`binary_sensor.dsc_hub_pot${r}_esp_now_link`) === "on";
    return /* @__PURE__ */ s.jsx(
      z,
      {
        label: `P${r} ${o ? "direct" : "fallback"}`,
        tone: o ? "ok" : "muted",
        onClick: () => i("/live/root")
      },
      r
    );
  }) });
}
function tg({ bus: n }) {
  const { state: i, num: r } = n, o = r("sensor.dsc_coldest_root_zone_temp", NaN), d = String(n.entity("sensor.dsc_coldest_root_zone_temp")?.attributes?.pot || ""), h = n.entity("light.dsc_hub_sf1000_dimmer"), m = Math.round(Number(h?.attributes?.brightness ?? 0) / 255 * 100), p = i("light.dsc_hub_sf1000_dimmer") === "on" && m >= 1, f = m, _ = i("binary_sensor.dsc_ac_capacity_offline") === "on", x = i("binary_sensor.dsc_clone_humidifier_capacity_offline") === "on", g = !n.available("switch.dsc_de_humidifier_main_relay"), y = i("binary_sensor.dsc_hub_root_zone_sensor_fault") === "on", w = i("binary_sensor.dsc_clone_dark_period_violation") === "on", N = [
    { label: "Heat", icon: "climate", on: i("switch.dsc_hub_heater_demand") === "on", tone: i("switch.dsc_hub_heater_demand") === "on" ? "ok" : "muted" },
    { label: _ ? "Cool ○" : "Cool", icon: "climate", on: i("switch.dsc_hub_ac_demand") === "on", tone: _ ? "warn" : i("switch.dsc_hub_ac_demand") === "on" ? "ok" : "muted" },
    { label: "Hum", icon: "tank", on: i("switch.dsc_hub_humidifier_demand") === "on", tone: i("switch.dsc_hub_humidifier_demand") === "on" ? "ok" : "muted" },
    { label: g ? "Dehum offline" : "Dehum", icon: "tank", on: i("switch.dsc_hub_dehumidifier_demand") === "on", tone: g ? "bad" : i("switch.dsc_hub_dehumidifier_demand") === "on" ? "ok" : "muted" },
    {
      label: Number.isFinite(o) ? `Mat ${o.toFixed(1)}°C${d && d !== "none" ? ` P${d}` : ""}` : "Mat",
      icon: "root",
      on: i("switch.dsc_hub_grow_mat_demand") === "on",
      tone: y ? "bad" : i("switch.dsc_hub_grow_mat_demand") === "on" ? "ok" : "muted"
    },
    { label: x ? "C-Hum ○" : "C-Hum", icon: "clone", on: i("switch.dsc_hub_clone_humidifier_demand") === "on", tone: x ? "warn" : i("switch.dsc_hub_clone_humidifier_demand") === "on" ? "ok" : "muted" },
    { label: p ? `SF ${f}%` : "SF1000", icon: "lighting", on: p, tone: w ? "bad" : p ? "ok" : "muted" }
  ];
  return /* @__PURE__ */ s.jsx(ie, { className: "dsc-glass", title: "Running", icon: "lighting", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: N.map((T) => /* @__PURE__ */ s.jsx(z, { label: T.label, icon: T.icon, tone: T.tone, motion: T.on ? "duty" : void 0 }, T.label)) }) });
}
function ng({ bus: n, onNavigate: i }) {
  const r = [
    ["IN 4×8", "sensor.dsc_fan_intake_main_pct"],
    ["IN 2×4", "sensor.dsc_fan_intake_2x4_pct"],
    ["EX ROOM", "sensor.dsc_fan_exhaust_room_pct"],
    ["EX OUT", "sensor.dsc_fan_exhaust_outside_pct"]
  ];
  return /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: r.map(([o, d]) => {
    const h = Math.round(n.num(d, 0));
    return /* @__PURE__ */ s.jsx(
      z,
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
function Qr(n, i) {
  const r = Number(n);
  if (Number.isFinite(r)) return r.toFixed(1);
  const o = Number(i);
  return Number.isFinite(o) ? o.toFixed(1) : n;
}
function Mw({ bus: n, onNavigate: i }) {
  const { state: r, num: o } = n, d = r("select.dsc_hub_clone_mode") === "Follow 4x8", h = r("select.dsc_hub_priority_tent", "—"), m = r("switch.dsc_hub_manual_takeover") === "on" ? "Takeover" : r("switch.dsc_hub_tent_manual_override") === "on" ? "Fan override" : r("switch.dsc_hub_tent_full_auto_mode") === "on" ? "Full Auto" : "Standby", p = Qr(r("sensor.dsc_hub_tent_temperature", "—"), o("sensor.dsc_hub_tent_temperature", NaN)), f = Qr(r("sensor.dsc_hub_tent_humidity", "—"), o("sensor.dsc_hub_tent_humidity", NaN)), _ = o("sensor.dsc_hub_vpd_kpa", NaN), x = Qr(r("sensor.dsc_hub_clone_temperature", "—"), o("sensor.dsc_hub_clone_temperature", NaN)), g = Qr(r("sensor.dsc_hub_clone_humidity", "—"), o("sensor.dsc_hub_clone_humidity", NaN)), y = o("sensor.dsc_hub_clone_vpd_kpa", NaN), w = d ? o("number.dsc_hub_vpd_target_min", 0.8) : o("number.dsc_hub_clone_vpd_min", 0.6), N = d ? o("number.dsc_hub_vpd_target_max", 1.4) : o("number.dsc_hub_clone_vpd_max", 1.2), T = [
    ["Hum", "sensor.dsc_hub_humidifier_fire_countdown", "switch.dsc_hub_humidifier_demand"],
    ["Dehum", "sensor.dsc_hub_dehumidifier_fire_countdown", "switch.dsc_hub_dehumidifier_demand"],
    ["Heat", "sensor.dsc_hub_heater_fire_countdown", "switch.dsc_hub_heater_demand"],
    ["AC", "sensor.dsc_hub_ac_fire_countdown", "switch.dsc_hub_ac_demand"],
    ["Mat", "sensor.dsc_hub_grow_mat_fire_countdown", "switch.dsc_hub_grow_mat_demand"]
  ], E = Math.round(n.num("sensor.dsc_fan_exhaust_outside_pct", 0)), M = Math.round(n.num("sensor.dsc_fan_exhaust_room_pct", 0));
  return /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Operational now", icon: "climate", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 10 }, children: [
      /* @__PURE__ */ s.jsx(z, { label: r("select.dsc_hub_grow_stage", "—"), tone: "ok" }),
      /* @__PURE__ */ s.jsx(z, { label: r("select.dsc_hub_clone_mode", "—"), tone: "ok" }),
      /* @__PURE__ */ s.jsx(z, { label: r("select.dsc_hub_control_strategy", "—"), tone: "muted" }),
      /* @__PURE__ */ s.jsx(z, { label: `Priority ${h}`, tone: "muted" }),
      /* @__PURE__ */ s.jsx(z, { label: m, tone: m === "Full Auto" ? "ok" : m === "Standby" ? "muted" : "warn" })
    ] }),
    /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { fontSize: 13, lineHeight: 1.5 }, children: [
      /* @__PURE__ */ s.jsx("strong", { children: "4×8" }),
      " ",
      p,
      "°C / ",
      f,
      "% / VPD ",
      Number.isFinite(_) ? _.toFixed(2) : "—",
      " (",
      A_(_, o("number.dsc_hub_vpd_target_min", 0.8), o("number.dsc_hub_vpd_target_max", 1.4)),
      ") · band",
      " ",
      r("number.dsc_hub_vpd_target_min"),
      "–",
      r("number.dsc_hub_vpd_target_max"),
      /* @__PURE__ */ s.jsx("br", {}),
      /* @__PURE__ */ s.jsx("strong", { children: "2×4" }),
      " ",
      x,
      "°C / ",
      g,
      "% / VPD ",
      Number.isFinite(y) ? y.toFixed(2) : "—",
      d ? " (follows 4×8 bands)" : "",
      " (",
      A_(y, w, N),
      ")",
      /* @__PURE__ */ s.jsx("br", {}),
      "Room appliances chase ",
      /* @__PURE__ */ s.jsx("strong", { children: h }),
      " bands."
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginTop: 10 }, children: [
      T.map(([C, U, G]) => {
        const X = r(G) === "on", L = Math.round(n.num(U, 0)), V = X ? `${C} live` : L > 0 ? `${C} ${L}s` : `${C} idle`;
        return /* @__PURE__ */ s.jsx(
          z,
          {
            label: V,
            tone: X ? "ok" : L > 0 ? "warn" : "muted",
            motion: X ? "duty" : L > 0 ? "breathe" : void 0,
            onClick: () => i("/live/climate")
          },
          U
        );
      }),
      /* @__PURE__ */ s.jsx(
        z,
        {
          label: `Fans ${E}/${M}%`,
          tone: E > 0 || M > 0 ? "ok" : "muted",
          motion: E > 0 || M > 0 ? "fan" : void 0,
          onClick: () => i("/live/climate")
        }
      )
    ] })
  ] });
}
function la({
  entityId: n,
  zone: i,
  gauge: r,
  value: o,
  band: d,
  stale: h,
  unit: m
}) {
  const { points: p } = zd(n, 24, 96), f = yi({
    value: o,
    band: d,
    margin: vo(d, m),
    stale: !!(h && Number.isFinite(o)),
    available: Number.isFinite(o)
  });
  return /* @__PURE__ */ s.jsxs("div", { className: `dsc-band-cell${i ? ` dsc-band-cell--${i}` : ""}`, children: [
    r,
    /* @__PURE__ */ s.jsx(Hb, { series: p, color: Od(f), width: 110, height: 26 })
  ] });
}
const Rw = [
  { id: "compare", label: "All" },
  { id: "main", label: "4×8" },
  { id: "clone", label: "2×4" },
  { id: "room", label: "Room" }
];
function ag({
  readings: n,
  onChartOpen: i
}) {
  const r = n, { focus: o, setFocus: d } = Dd(), h = (m) => o === "compare" || o === m ? "dsc-gauge-row-3 is-lit" : "dsc-gauge-row-3";
  return /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Bands", icon: "gauge", children: [
    /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { fontSize: 12, margin: "0 0 10px" }, children: "Green = in band · amber = drifting · red = alert · grey = no data" }),
    /* @__PURE__ */ s.jsx("div", { className: "dsc-tent-segment", style: { marginBottom: 10 }, children: Rw.map((m) => /* @__PURE__ */ s.jsx(
      "button",
      {
        type: "button",
        className: o === m.id ? "is-active" : "",
        "data-tent": m.id === "main" ? "main" : m.id === "clone" ? "clone" : m.id === "compare" ? "compare" : "room",
        onClick: () => d(m.id),
        children: m.label
      },
      m.id
    )) }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-gauge-matrix dsc-gauge-matrix--bands", children: [
      /* @__PURE__ */ s.jsxs("div", { className: h("main"), children: [
        /* @__PURE__ */ s.jsx("span", { className: "dsc-gauge-row-tag", children: "4×8" }),
        /* @__PURE__ */ s.jsx(
          la,
          {
            entityId: "sensor.dsc_hub_tent_temperature",
            zone: "main",
            value: r.tentT,
            band: { min: r.targetTemp - 2, max: r.targetTemp + 2 },
            stale: r.stale.tentT,
            unit: "°C",
            gauge: /* @__PURE__ */ s.jsx(Ie, { label: "4×8 T", value: r.tentT, min: 10, max: 40, unit: "°C", target: r.targetTemp, band: { min: r.targetTemp - 2, max: r.targetTemp + 2 }, segments: fi(r.targetTemp), stale: r.stale.tentT, onClick: () => i("temp") })
          }
        ),
        /* @__PURE__ */ s.jsx(
          la,
          {
            entityId: "sensor.dsc_hub_tent_humidity",
            zone: "main",
            value: r.tentRh,
            band: { min: r.rhMin, max: r.rhMax },
            stale: r.stale.tentRh,
            gauge: /* @__PURE__ */ s.jsx(Ie, { label: "4×8 RH", value: r.tentRh, min: 0, max: 100, unit: "%", band: { min: r.rhMin, max: r.rhMax }, segments: pi(r.rhMin, r.rhMax), stale: r.stale.tentRh, onClick: () => i("rh") })
          }
        ),
        /* @__PURE__ */ s.jsx(
          la,
          {
            entityId: "sensor.dsc_hub_vpd_kpa",
            zone: "main",
            value: r.tentVpd,
            band: { min: r.vpdMin, max: r.vpdMax },
            stale: r.stale.tentVpd,
            gauge: /* @__PURE__ */ s.jsx(Ie, { label: "4×8 VPD", value: r.tentVpd, min: 0, max: 2.5, unit: "kPa", band: { min: r.vpdMin, max: r.vpdMax }, segments: co(r.vpdMin, r.vpdMax), stale: r.stale.tentVpd, onClick: () => i("vpd") })
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: h("clone"), children: [
        /* @__PURE__ */ s.jsx("span", { className: "dsc-gauge-row-tag", children: "2×4" }),
        /* @__PURE__ */ s.jsx(
          la,
          {
            entityId: "sensor.dsc_hub_clone_temperature",
            zone: "clone",
            value: r.cloneT,
            band: { min: r.cloneTargetTemp - 2, max: r.cloneTargetTemp + 2 },
            stale: r.stale.cloneT,
            unit: "°C",
            gauge: /* @__PURE__ */ s.jsx(Ie, { label: "2×4 T", value: r.cloneT, min: 10, max: 40, unit: "°C", target: r.cloneTargetTemp, band: { min: r.cloneTargetTemp - 2, max: r.cloneTargetTemp + 2 }, segments: fi(r.cloneTargetTemp), stale: r.stale.cloneT, onClick: () => i("temp") })
          }
        ),
        /* @__PURE__ */ s.jsx(
          la,
          {
            entityId: "sensor.dsc_hub_clone_humidity",
            zone: "clone",
            value: r.cloneRh,
            band: { min: r.cloneRhMin, max: r.cloneRhMax },
            stale: r.stale.cloneRh,
            gauge: /* @__PURE__ */ s.jsx(Ie, { label: "2×4 RH", value: r.cloneRh, min: 0, max: 100, unit: "%", band: { min: r.cloneRhMin, max: r.cloneRhMax }, segments: pi(r.cloneRhMin, r.cloneRhMax), stale: r.stale.cloneRh, onClick: () => i("rh") })
          }
        ),
        /* @__PURE__ */ s.jsx(
          la,
          {
            entityId: "sensor.dsc_hub_clone_vpd_kpa",
            zone: "clone",
            value: r.cloneVpd,
            band: { min: r.cloneVpdMin, max: r.cloneVpdMax },
            stale: r.stale.cloneVpd,
            gauge: /* @__PURE__ */ s.jsx(Ie, { label: "2×4 VPD", value: r.cloneVpd, min: 0, max: 2, unit: "kPa", band: { min: r.cloneVpdMin, max: r.cloneVpdMax }, segments: co(r.cloneVpdMin, r.cloneVpdMax), stale: r.stale.cloneVpd, onClick: () => i("vpd") })
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: h("room"), children: [
        /* @__PURE__ */ s.jsx("span", { className: "dsc-gauge-row-tag", children: "Room" }),
        /* @__PURE__ */ s.jsx(
          la,
          {
            entityId: "sensor.dsc_hub_room_temperature",
            zone: "room",
            value: r.roomT,
            band: { min: r.targetTemp - 2, max: r.targetTemp + 2 },
            stale: r.stale.roomT,
            unit: "°C",
            gauge: /* @__PURE__ */ s.jsx(Ie, { label: "Room T", value: r.roomT, min: 10, max: 40, unit: "°C", target: r.targetTemp, band: { min: r.targetTemp - 2, max: r.targetTemp + 2 }, segments: fi(r.targetTemp), stale: r.stale.roomT, onClick: () => i("temp") })
          }
        ),
        /* @__PURE__ */ s.jsx(
          la,
          {
            entityId: "sensor.dsc_hub_room_humidity",
            zone: "room",
            value: r.roomRh,
            band: { min: r.rhMin, max: r.rhMax },
            stale: r.stale.roomRh,
            gauge: /* @__PURE__ */ s.jsx(Ie, { label: "Room RH", value: r.roomRh, min: 0, max: 100, unit: "%", band: { min: r.rhMin, max: r.rhMax }, segments: pi(r.rhMin, r.rhMax), stale: r.stale.roomRh, onClick: () => i("rh") })
          }
        ),
        /* @__PURE__ */ s.jsx(
          la,
          {
            entityId: "sensor.dsc_coldest_root_zone_temp",
            zone: "root",
            value: r.rootT,
            band: { min: r.matLo, max: r.matHi },
            stale: r.stale.rootT,
            unit: "°C",
            gauge: /* @__PURE__ */ s.jsx(Ie, { label: "Root", value: r.rootT, min: 10, max: 32, unit: "°C", band: { min: r.matLo, max: r.matHi }, segments: $j(r.matLo, r.matHi), stale: r.stale.rootT, onClick: () => i("root") })
          }
        )
      ] })
    ] })
  ] });
}
function Aw({ bus: n }) {
  const { num: i, state: r } = n, o = Math.round(i("sensor.dsc_humidifier_cycles_last_hour", 0)), d = o > 6 ? "bad" : o > 3 ? "warn" : "ok";
  return /* @__PURE__ */ s.jsx(ie, { className: "dsc-glass", title: "Today", icon: "lighting", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
    /* @__PURE__ */ s.jsx(
      z,
      {
        label: `4×8 ${i("sensor.dsc_lights_on_today_4x8", 0).toFixed(1)}h / ${Math.round(i("sensor.dsc_expected_light_hours", 12))}h`,
        tone: r("binary_sensor.dsc_hub_4x8_window_open") === "on" ? "ok" : "muted",
        onClick: () => {
        }
      }
    ),
    /* @__PURE__ */ s.jsx(
      z,
      {
        label: `2×4 ${i("sensor.dsc_lights_on_today_2x4", 0).toFixed(1)}h / ${Math.round(i("sensor.dsc_clone_expected_light_hours", 12))}h`,
        tone: r("binary_sensor.dsc_clone_dark_period_violation") === "on" ? "bad" : "ok"
      }
    ),
    /* @__PURE__ */ s.jsx(z, { label: `Heat ${i("sensor.dsc_heater_runtime_today", 0).toFixed(1)}h`, tone: r("switch.dsc_hub_heater_demand") === "on" ? "ok" : "muted" }),
    /* @__PURE__ */ s.jsx(z, { label: `Hum ${o}/h`, tone: d })
  ] }) });
}
function sg({
  bus: n,
  rosterSlots: i,
  onNavigate: r,
  onPot: o,
  onPotChart: d
}) {
  const { state: h, num: m } = n, p = { min: 30, max: 70 };
  return /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Root & tank", icon: "root", children: [
    /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: [1, 2, 3, 4].map((f) => {
      const _ = h(`text.dsc_pot${f}_plant_name`, "—"), x = !_ || _ === "unknown" || _ === "unavailable" ? "—" : _;
      return /* @__PURE__ */ s.jsx(z, { label: `P${f} ${x}`, tone: x === "—" ? "muted" : "ok", onClick: () => o(f) }, f);
    }) }),
    i.some((f) => f.pot && f.pot !== "none") ? /* @__PURE__ */ s.jsx("div", { className: "dsc-muted", style: { fontSize: 13, margin: "8px 0" }, children: ["1", "2", "3", "4"].map((f) => {
      const _ = i.find((x) => String(x.pot) === f);
      return _ ? /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsxs("strong", { children: [
          "POT",
          f,
          " roster:"
        ] }),
        " ",
        _.nickname || _.strain || `slot ${_.slot}`,
        _.blend ? ` · ${_.blend}` : ""
      ] }, f) : null;
    }) }) : null,
    /* @__PURE__ */ s.jsx("div", { className: "dsc-gauge-matrix dsc-gauge-matrix--pots", children: [1, 2, 3, 4].map((f) => /* @__PURE__ */ s.jsx(
      Ie,
      {
        label: `P${f}`,
        value: m(`sensor.dsc_pot${f}_soil_moisture`, NaN),
        min: 0,
        max: 100,
        unit: "%",
        band: p,
        segments: ud(30, 70),
        onClick: () => d(`pot${f}`)
      },
      f
    )) }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginTop: 10 }, children: [
      n.available("sensor.water_tester_ph_current") ? /* @__PURE__ */ s.jsx(z, { label: `pH ${h("sensor.water_tester_ph_current")}`, tone: "ok", onClick: () => r("/fleet") }) : null,
      /* @__PURE__ */ s.jsx(z, { label: `EC ${h("sensor.dsc_tank_ec_normalized", "—")}`, tone: "muted" }),
      n.available("sensor.water_tester_temperature") ? /* @__PURE__ */ s.jsx(
        z,
        {
          label: `${h("sensor.water_tester_temperature")}°C${m("sensor.water_tester_temperature", 0) > 24 ? " ⚠ PYTHIUM" : ""}`,
          tone: m("sensor.water_tester_temperature", 0) > 24 ? "bad" : "ok"
        }
      ) : null,
      /* @__PURE__ */ s.jsx(z, { label: "Open Root Zone", tone: "ok", onClick: () => r("/live/root") })
    ] })
  ] });
}
function lg({ bus: n }) {
  const { state: i } = n, [r, o] = v.useState([]), [d, h] = v.useState(!0);
  v.useEffect(() => {
    let p = !1;
    const f = () => {
      M0(24, 80).then((x) => {
        p || (o(kw(x)), h(!1));
      });
    };
    f();
    const _ = window.setInterval(f, 45e3);
    return () => {
      p = !0, window.clearInterval(_);
    };
  }, [i("select.dsc_hub_grow_stage"), i("switch.dsc_hub_dehumidifier_demand")]);
  const m = [
    i("select.dsc_hub_grow_stage") !== "—" ? `Stage · ${i("select.dsc_hub_grow_stage")}` : null,
    i("binary_sensor.dsc_clone_dark_period_violation") === "on" ? "Dark period violation" : null
  ].filter(Boolean);
  return /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Grow log", icon: "roster", children: [
    d && r.length === 0 ? /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Loading…" }) : null,
    r.length ? /* @__PURE__ */ s.jsx("ul", { className: "dsc-grow-log", children: r.map((p) => /* @__PURE__ */ s.jsxs(
      "li",
      {
        className: Nw(p.message) === "alert" ? "dsc-grow-log--alert" : void 0,
        children: [
          /* @__PURE__ */ s.jsx("time", { className: "dsc-muted", dateTime: new Date(p.ts * 1e3).toISOString(), children: new Date(p.ts * 1e3).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }),
          " ",
          p.message
        ]
      },
      p.id
    )) }) : m.length ? /* @__PURE__ */ s.jsx("ul", { className: "dsc-grow-log", children: m.map((p) => /* @__PURE__ */ s.jsx("li", { children: p }, p)) }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "No operational events yet today." })
  ] });
}
function ig(n, i) {
  return Vb.filter((r) => n(r) === "on" && !i(r));
}
function Ow() {
  const n = Me(), { num: i, state: r, entity: o, tick: d } = n, h = Ot(), m = gt(), { isSnoozed: p } = yo(), f = Qb(), _ = (J) => f.open({ kind: J, title: Pb[J] }), x = i("sensor.dsc_active_alert_count", 0), g = ig(r, p), y = we("sensor.dsc_hub_tent_temperature"), w = we("sensor.dsc_hub_tent_humidity"), N = we("sensor.dsc_hub_vpd_kpa"), T = we("sensor.dsc_hub_clone_temperature"), E = we("sensor.dsc_hub_clone_humidity"), M = we("sensor.dsc_hub_clone_vpd_kpa"), C = we("sensor.dsc_hub_room_temperature"), U = we("sensor.dsc_hub_room_humidity"), G = we("sensor.dsc_coldest_root_zone_temp"), X = i("number.dsc_hub_target_temp", 25), L = i("number.dsc_hub_rh_target_min", 45), V = i("number.dsc_hub_rh_target_max", 70), te = i("number.dsc_hub_vpd_target_min", 0.8), re = i("number.dsc_hub_vpd_target_max", 1.4), se = i("number.dsc_hub_clone_target_temp", 24), ce = i("number.dsc_hub_clone_rh_min", 55), me = i("number.dsc_hub_clone_rh_max", 75), oe = i("number.dsc_hub_clone_vpd_min", 0.6), ge = i("number.dsc_hub_clone_vpd_max", 1.2), ue = i("number.dsc_hub_mat_root_zone_low", 20), S = i("number.dsc_hub_mat_root_zone_high", 24), O = o("sensor.dsc_plant_roster_summary")?.attributes?.slots || [], q = (J) => {
    window.dispatchEvent(new CustomEvent("dsc-dash-select-pot", { detail: { pot: J } })), m("/live/root");
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page dsc-dash-home", children: [
    /* @__PURE__ */ s.jsx(
      zt,
      {
        icon: "home",
        title: "Overview",
        subtitle: "Operational glance — alerts, area vitals, duties, root strip, grow log.",
        primaryAction: /* @__PURE__ */ s.jsx(ae, { teal: !0, onClick: () => m("/live/climate"), children: "Climate" }),
        actions: /* @__PURE__ */ s.jsx(ae, { onClick: () => m("/live/mission"), children: "Mission" })
      }
    ),
    g.length > 0 || x > 0 ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-banner dsc-banner--bad", style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ s.jsx("strong", { children: g.length > 0 ? `${g.length} critical alert(s) active` : `${x} system alert(s)` }),
      /* @__PURE__ */ s.jsx("ul", { className: "dsc-fault-list", style: { marginTop: 8 }, children: g.slice(0, 6).map((J) => {
        const I = I1(J), k = Gb(J, "alert").title;
        return /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx(
          z,
          {
            label: k,
            tone: "bad",
            pulse: !0,
            icon: "alert",
            onClick: () => m(I.href)
          }
        ) }, J);
      }) })
    ] }) : null,
    /* @__PURE__ */ s.jsx(eg, { bus: n, onNavigate: m }),
    /* @__PURE__ */ s.jsx(
      ag,
      {
        readings: {
          tentT: y.value,
          tentRh: w.value,
          tentVpd: N.value,
          cloneT: T.value,
          cloneRh: E.value,
          cloneVpd: M.value,
          roomT: C.value,
          roomRh: U.value,
          rootT: G.value,
          targetTemp: X,
          rhMin: L,
          rhMax: V,
          vpdMin: te,
          vpdMax: re,
          cloneTargetTemp: se,
          cloneRhMin: ce,
          cloneRhMax: me,
          cloneVpdMin: oe,
          cloneVpdMax: ge,
          matLo: ue,
          matHi: S,
          stale: {
            tentT: y.stale,
            tentRh: w.stale,
            tentVpd: N.stale,
            cloneT: T.stale,
            cloneRh: E.stale,
            cloneVpd: M.stale,
            roomT: C.stale,
            roomRh: U.stale,
            rootT: G.stale
          }
        },
        onChartOpen: _
      }
    ),
    /* @__PURE__ */ s.jsx(ie, { className: "dsc-glass", title: "Fan duties", icon: "fan", children: /* @__PURE__ */ s.jsx(ng, { bus: n, onNavigate: m }) }),
    /* @__PURE__ */ s.jsx(tg, { bus: n }),
    /* @__PURE__ */ s.jsx(
      sg,
      {
        bus: n,
        rosterSlots: O,
        onNavigate: m,
        onPot: q,
        onPotChart: _
      }
    ),
    /* @__PURE__ */ s.jsx(lg, { bus: n }),
    /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { fontSize: 12, marginTop: 8 }, children: [
      "Fleet ",
      h.version,
      " · expected ",
      h.expected_firmware
    ] })
  ] });
}
function zw({
  tag: n,
  config: i
}) {
  const r = v.useRef(null), { hass: o, tick: d } = xi(), [h, m] = v.useState("loading"), p = v.useRef(
    null
  ), f = v.useRef(i);
  return f.current = i, v.useEffect(() => {
    const _ = r.current;
    if (!_) return;
    let x = !1;
    const g = f.current ?? {};
    return (async () => {
      m("loading"), _.innerHTML = "";
      const y = await bb(n);
      if (x || !r.current) return;
      if (!y) {
        m("missing");
        const N = document.createElement("div");
        N.className = "dsc-empty";
        const T = h1(n).join(", ");
        N.innerHTML = `<strong>${n}</strong> did not register.<br/>Tried ${T}. Deploy the card IIFE under /config/www (or add a Lovelace resource), then hard-refresh.`, _.appendChild(N);
        return;
      }
      const w = document.createElement(n);
      typeof w.setConfig == "function" && w.setConfig({ type: `custom:${n}`, ...g }), o && (w.hass = o), _.appendChild(w), p.current = w, m("ready");
    })(), () => {
      x = !0, p.current = null, _.innerHTML = "";
    };
  }, [n]), v.useEffect(() => {
    p.current && o && (p.current.hass = o);
  }, [o, d]), /* @__PURE__ */ s.jsx(
    "div",
    {
      className: `dsc-legacy-host${h === "missing" ? " dsc-legacy-host--empty" : ""}`,
      ref: r,
      "data-status": h
    }
  );
}
function Pr(n) {
  return Number.isFinite(n.value) ? `${Math.round(n.value)} CFM` : "—";
}
function Dw(n) {
  return n("sensor.dsc_hub_room_vpd_kpa") ? "sensor.dsc_hub_room_vpd_kpa" : n("sensor.dsc_hub_room_vpd") ? "sensor.dsc_hub_room_vpd" : "sensor.dsc_hub_room_vpd_kpa";
}
function Lw() {
  const n = Me(), { available: i, num: r, state: o, entity: d, tick: h } = n, m = Ot(), p = gt(), f = Kb(), { isSnoozed: _ } = yo(), x = Bn(), g = Qb(), y = (pe) => g.open({ kind: pe, title: Pb[pe] });
  Eb(), Mb(), Rb();
  const w = m.hub.online || f("sensor.dsc_hub_uptime"), N = r("sensor.dsc_hub_uptime", m.hub.values.uptime != null ? Number(m.hub.values.uptime) : 0), T = r("sensor.dsc_active_alert_count", 0), E = o("sensor.dsc_fleet_version_status", "ok"), M = String(d("sensor.dsc_fleet_version_status")?.attributes?.expected || m.expected_firmware || "7.0.0"), C = o("binary_sensor.dsc_cannalib_api_online") === "on", U = r("sensor.dsc_cannalib_api_hits", 0), G = o("sensor.dsc_cannalib_bandwidth_summary", "— MB"), X = m.panel.online ? "on" : o("binary_sensor.dsc_hub_panel_link"), L = m.panel.online || X === "on", V = f("binary_sensor.dsc_hub_panel_link") || L, te = !L && i("sensor.dsc_control_wifi_rssi"), re = !L && !te && !V, se = m.hub.values.heartbeat != null ? String(m.hub.values.heartbeat) : o("sensor.dsc_hub_heartbeat", "NO BEAT"), ce = m.hub.online && m.hub.values.heartbeat != null ? !0 : f("sensor.dsc_hub_heartbeat"), me = we("sensor.dsc_hub_tent_temperature"), oe = we("sensor.dsc_hub_tent_humidity"), ge = we("sensor.dsc_hub_vpd_kpa"), ue = we("sensor.dsc_hub_clone_temperature"), S = we("sensor.dsc_hub_clone_humidity"), O = we("sensor.dsc_hub_clone_vpd_kpa"), q = we("sensor.dsc_hub_room_temperature"), J = we("sensor.dsc_hub_room_humidity"), I = Dw(d);
  we(I);
  const k = we("sensor.dsc_coldest_root_zone_temp"), $ = r("number.dsc_hub_target_temp", 25), Z = r("number.dsc_hub_rh_target_min", 45), ne = r("number.dsc_hub_rh_target_max", 70), de = r("number.dsc_hub_vpd_target_min", 0.8), Q = r("number.dsc_hub_vpd_target_max", 1.4), le = r("number.dsc_hub_clone_target_temp", 24), xe = r("number.dsc_hub_clone_rh_min", 55), je = r("number.dsc_hub_clone_rh_max", 75), st = r("number.dsc_hub_clone_vpd_min", 0.6), et = r("number.dsc_hub_clone_vpd_max", 1.2), ke = r("number.dsc_hub_mat_root_zone_low", 20), rt = r("number.dsc_hub_mat_root_zone_high", 24), he = bt("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", { available: i, num: r }), Fe = bt("sensor.dsc_cfm_exhaust_recirc_allocated", "sensor.dsc_cfm_exhaust_recirc", { available: i, num: r }), _e = bt("sensor.dsc_cfm_intake_main", "sensor.dsc_cfm_intake_main", { available: i, num: r }), Ye = bt("sensor.dsc_cfm_intake_2x4", "sensor.dsc_cfm_intake_2x4", { available: i, num: r }), Xe = [he, Fe, _e, Ye], De = Hd(m), Dt = $d(De), kt = d("sensor.dsc_plant_roster_summary")?.attributes?.slots || [], Xt = o("sensor.dsc_plant_roster_summary", "—"), P = ig(o, _), ve = (pe) => x.open({
    entityId: pe.entityId,
    label: pe.label,
    kind: "kit",
    runtimeToday: pe.runtimeToday,
    cyclesToday: pe.cyclesToday,
    demandEntity: pe.demandEntity
  }), tt = (pe) => {
    window.dispatchEvent(new CustomEvent("dsc-dash-select-pot", { detail: { pot: pe } })), p("/live/root");
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page dsc-dash-home", children: [
    /* @__PURE__ */ s.jsx(
      zt,
      {
        icon: "home",
        title: "Home",
        subtitle: "Everything running right now, at a glance.",
        primaryAction: /* @__PURE__ */ s.jsx(ae, { teal: !0, onClick: () => p("/live/twin"), children: "Open Twin" }),
        actions: /* @__PURE__ */ s.jsx(ae, { onClick: () => p("/live/climate"), children: "Climate" })
      }
    ),
    /* @__PURE__ */ s.jsx(
      Cw,
      {
        hubOnline: w,
        panelOk: L,
        panelHaOnly: te,
        panelOffline: re,
        heartbeat: se,
        beatOk: ce,
        uptimeSec: N,
        alerts: T,
        fleetStatus: E,
        fleetExpected: M,
        cannalibOnline: C,
        cannalibHits: U,
        cannalibSummary: G,
        inServiceLabel: `${Dt.inService} of ${Dt.total} in service`,
        activeFaultCount: P.length,
        onChip: (pe, xt) => x.open({ entityId: pe, label: xt, kind: pe.includes("alert") ? "alert" : "kit" })
      }
    ),
    /* @__PURE__ */ s.jsx(Tw, { bus: n }),
    /* @__PURE__ */ s.jsx(eg, { bus: n, onNavigate: p }),
    P.length > 0 ? /* @__PURE__ */ s.jsx(ie, { className: "dsc-glass", title: "Active system alerts", icon: "alert", children: /* @__PURE__ */ s.jsx("ul", { className: "dsc-fault-list", children: P.map((pe) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx(ae, { onClick: () => x.open({ entityId: pe, label: pe, kind: "alert" }), children: pe.split(".").pop()?.replace(/dsc_/, "").replace(/_/g, " ") }) }, pe)) }) }) : null,
    /* @__PURE__ */ s.jsx(Ew, { bus: n, onNavigate: p }),
    /* @__PURE__ */ s.jsx(Ld, {}),
    /* @__PURE__ */ s.jsx(tg, { bus: n }),
    /* @__PURE__ */ s.jsx(ng, { bus: n, onNavigate: p }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid dsc-grid--2", children: [
      /* @__PURE__ */ s.jsx(lg, { bus: n }),
      /* @__PURE__ */ s.jsxs("details", { className: "dsc-narrator", children: [
        /* @__PURE__ */ s.jsx("summary", { children: "System narrator" }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-muted", style: { fontSize: 13, lineHeight: 1.55, padding: "8px 0" }, children: [
          /* @__PURE__ */ s.jsxs("p", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: "Hub:" }),
            " ",
            w ? "online" : "offline",
            " · uptime ",
            Wb(N),
            " · beat ",
            se
          ] }),
          /* @__PURE__ */ s.jsxs("p", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: "Climate:" }),
            " 4×8 ",
            Number.isFinite(me.value) ? `${me.value.toFixed(1)}°C` : "—",
            " /",
            " ",
            Number.isFinite(oe.value) ? `${oe.value.toFixed(0)}%` : "—",
            " RH · 2×4",
            " ",
            Number.isFinite(ue.value) ? `${ue.value.toFixed(1)}°C` : "—",
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
          P.length > 0 ? /* @__PURE__ */ s.jsxs("p", { children: [
            /* @__PURE__ */ s.jsx("strong", { children: "Watchlist:" }),
            " ",
            P.length,
            " active alert(s)."
          ] }) : null
        ] })
      ] })
    ] }),
    /* @__PURE__ */ s.jsx(Mw, { bus: n, onNavigate: p }),
    /* @__PURE__ */ s.jsx(
      ag,
      {
        readings: {
          tentT: me.value,
          tentRh: oe.value,
          tentVpd: ge.value,
          cloneT: ue.value,
          cloneRh: S.value,
          cloneVpd: O.value,
          roomT: q.value,
          roomRh: J.value,
          rootT: k.value,
          targetTemp: $,
          rhMin: Z,
          rhMax: ne,
          vpdMin: de,
          vpdMax: Q,
          cloneTargetTemp: le,
          cloneRhMin: xe,
          cloneRhMax: je,
          cloneVpdMin: st,
          cloneVpdMax: et,
          matLo: ke,
          matHi: rt,
          stale: {
            tentT: me.stale,
            tentRh: oe.stale,
            tentVpd: ge.stale,
            cloneT: ue.stale,
            cloneRh: S.stale,
            cloneVpd: O.stale,
            roomT: q.stale,
            roomRh: J.stale,
            rootT: k.stale
          }
        },
        onChartOpen: y
      }
    ),
    /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Lung · CFM", icon: "climate", children: [
      /* @__PURE__ */ s.jsx(wo, { readings: Xe }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ s.jsx(At, { label: "Out alloc", value: Pr(he).replace(" CFM", ""), unit: "CFM" }),
        /* @__PURE__ */ s.jsx(At, { label: "Recirc alloc", value: Pr(Fe).replace(" CFM", ""), unit: "CFM" }),
        /* @__PURE__ */ s.jsx(At, { label: "Intake 4×8", value: Pr(_e).replace(" CFM", ""), unit: "CFM" }),
        /* @__PURE__ */ s.jsx(At, { label: "Intake 2×4", value: Pr(Ye).replace(" CFM", ""), unit: "CFM" })
      ] }),
      /* @__PURE__ */ s.jsx(zw, { tag: "dsc-airflow-map-card" })
    ] }),
    /* @__PURE__ */ s.jsx(Aw, { bus: n }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid dsc-grid--2", children: [
      /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Plant roster", icon: "roster", children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: Xt }),
        Array.isArray(kt) && kt.length > 0 ? /* @__PURE__ */ s.jsx("ul", { className: "dsc-roster-list", children: kt.slice(0, 8).map((pe) => /* @__PURE__ */ s.jsxs("li", { children: [
          /* @__PURE__ */ s.jsx("strong", { children: pe.nickname || pe.strain || `Slot ${pe.slot}` }),
          /* @__PURE__ */ s.jsxs("span", { className: "dsc-muted", children: [
            " ",
            "· ",
            pe.pot && pe.pot !== "none" ? `P${pe.pot}` : "stock",
            " · ",
            pe.status || "—",
            pe.blend ? ` · ${pe.blend}` : ""
          ] })
        ] }, pe.slot)) }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: "No occupied roster slots." })
      ] }),
      /* @__PURE__ */ s.jsx(ie, { className: "dsc-glass", title: "Kit pulse", icon: "fleet", children: /* @__PURE__ */ s.jsx(Bd, { nodes: De, onSelect: ve }) })
    ] }),
    /* @__PURE__ */ s.jsx(sg, { bus: n, rosterSlots: kt, onNavigate: p, onPot: tt, onPotChart: y })
  ] });
}
const Hw = `:root,:host,.dsc-root{--dsc-black: #0b0e14;--dsc-black-2: #12171f;--dsc-gray-1: #12171f;--dsc-gray-2: #1a2230;--dsc-gray-3: #243044;--dsc-gray-4: #8b95a8;--dsc-gray-5: #8b95a8;--dsc-blue: #26c6da;--dsc-blue-dim: rgba(38, 198, 218, .4);--dsc-purple: #a78bfa;--dsc-purple-dim: rgba(167, 139, 250, .35);--dsc-neon: #66bb6a;--dsc-neon-dim: rgba(102, 187, 106, .32);--dsc-neon-glow: rgba(0, 230, 118, .4);--dsc-teal: #26c6da;--dsc-teal-dim: rgba(38, 198, 218, .45);--dsc-teal-glow: rgba(38, 198, 218, .55);--dsc-orange: #ff8a65;--dsc-amber: #ffb74d;--dsc-bad: #ef5350;--dsc-bad-soft: #ef5350;--dsc-soil-1: #5b9f6b;--dsc-soil-2: #4a8f9f;--dsc-soil-3: #c4a35a;--dsc-soil-4: #8d6e63;--dsc-glass: rgba(18, 23, 31, .78);--dsc-glass-border: rgba(36, 48, 68, .55);--dsc-white: #e8eef8;--dsc-shadow: 0 8px 24px rgba(0, 0, 0, .45);--dsc-shadow-tight: 0 2px 8px rgba(0, 0, 0, .55);--dsc-radius: 10px;--dsc-radius-lg: 14px;--dsc-font: "Segoe UI", "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;--dsc-mono: "Cascadia Code", "IBM Plex Mono", ui-monospace, monospace;color:var(--dsc-white);background:var(--dsc-black);font-family:var(--dsc-font);display:block;height:100%;box-sizing:border-box}*,*:before,*:after{box-sizing:border-box}html,body{height:100%;margin:0}body{background:var(--dsc-black);color:var(--dsc-white);font-family:var(--dsc-font)}#root{height:100%}.dsc-root{height:100%;min-height:100%;overflow:auto;background:radial-gradient(1100px 560px at 8% -12%,rgba(38,198,218,.12),transparent 55%),radial-gradient(900px 520px at 92% -8%,rgba(38,198,218,.08),transparent 50%),radial-gradient(700px 420px at 70% 100%,rgba(102,187,106,.04),transparent 55%),var(--dsc-black)}.dsc-honesty-rail{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}.dsc-next-rec{border-color:var(--dsc-blue-dim)}.dsc-twin-keepalive{position:fixed;inset:0;visibility:hidden;pointer-events:none;z-index:-1;overflow:hidden;margin:0;min-height:0}.dsc-twin-keepalive.is-active{position:relative;inset:auto;visibility:visible;pointer-events:auto;z-index:auto;overflow:visible;margin-bottom:12px;min-height:min(70vh,720px)}.dsc-twin-keepalive:not(.is-active),.dsc-twin-keepalive:not(.is-active) *{pointer-events:none!important}.dsc-twin-keepalive-host{min-height:min(68vh,700px)}.dsc-twin-keepalive.is-active .dsc-twin-keepalive-host,.dsc-twin-keepalive.is-active .dsc-twin-keepalive-host>*{min-height:min(68vh,700px);pointer-events:auto}.dsc-tab--live.active{color:var(--dsc-blue);border-color:var(--dsc-blue-dim)}.dsc-tab--grow.active{color:var(--dsc-teal);border-color:var(--dsc-teal-dim)}.dsc-tab--tune.active{color:var(--dsc-purple);border-color:var(--dsc-purple-dim)}.dsc-tab--fleet.active{color:var(--dsc-blue);border-color:var(--dsc-blue-dim)}.dsc-secondary-tabs .dsc-tab.active{color:var(--dsc-teal);border-color:var(--dsc-teal-dim);box-shadow:0 0 0 1px var(--dsc-blue-dim)}.dsc-tent-segment{display:inline-flex;gap:4px;padding:3px;border-radius:999px;background:var(--dsc-gray-1);border:1px solid var(--dsc-glass-border)}.dsc-tent-segment button{appearance:none;border:0;background:transparent;color:var(--dsc-gray-5);padding:6px 12px;border-radius:999px;cursor:pointer;font:inherit;font-size:.85rem}.dsc-tent-segment button.is-active{background:var(--dsc-gray-2);color:var(--dsc-white);box-shadow:var(--dsc-shadow-tight)}.dsc-tent-segment button[data-tent=main].is-active{color:var(--dsc-blue)}.dsc-tent-segment button[data-tent=clone].is-active{color:var(--dsc-purple)}.dsc-tent-segment button[data-tent=compare].is-active{color:var(--dsc-teal)}.dsc-shell{display:flex;flex-direction:column;min-height:100%;max-width:1600px;margin:0 auto;padding:16px 20px 28px}.dsc-brand-row{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:10px}.dsc-brand{display:flex;align-items:center;gap:12px;color:var(--dsc-white);text-decoration:none}.dsc-brand img,.dsc-brand svg{width:36px;height:36px;color:var(--dsc-neon)}.dsc-brand-title{display:flex;flex-direction:column;gap:2px}.dsc-brand-title strong{font-size:1.05rem;letter-spacing:.04em;font-weight:700;line-height:1.25;max-width:min(52vw,28rem)}.dsc-brand-wordmark{height:18px;width:auto;max-width:160px;display:block;color:var(--dsc-text, #eef1f8);line-height:0}.dsc-brand-wordmark svg{width:auto;height:18px;display:block}.dsc-icon svg{width:100%;height:100%;display:block}.dsc-brand-title span{font-size:.72rem;color:var(--dsc-gray-5);letter-spacing:.08em;text-transform:uppercase}.dsc-page-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px}.dsc-page-header-main{display:flex;align-items:flex-start;gap:10px}.dsc-page-header-actions{display:flex;align-items:center;gap:6px;flex-shrink:0}.dsc-card-title{display:inline-flex;align-items:center;gap:8px}.dsc-primary-tabs,.dsc-secondary-tabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:thin;padding-bottom:2px;-webkit-overflow-scrolling:touch}.dsc-primary-tabs{border-bottom:1px solid var(--dsc-gray-3);margin-bottom:8px}.dsc-secondary-tabs{margin-bottom:16px;mask-image:linear-gradient(90deg,#000 85%,transparent)}.dsc-secondary-tabs:after{content:"";flex:0 0 12px}.dsc-tab{appearance:none;border:1px solid transparent;background:transparent;color:var(--dsc-gray-5);padding:10px 14px;min-height:44px;border-radius:8px 8px 0 0;cursor:pointer;font:inherit;font-size:.92rem;letter-spacing:.04em;white-space:nowrap;display:inline-flex;align-items:center;gap:8px;transition:transform .1s ease,box-shadow .1s ease,color .15s ease,border-color .15s ease,background .15s ease;text-decoration:none}.dsc-tab span[role=img]{opacity:.9;flex-shrink:0}.dsc-tab:hover{color:var(--dsc-white);background:var(--dsc-gray-1)}.dsc-tab:focus-visible{outline:2px solid var(--dsc-neon);outline-offset:2px}.dsc-tab.active{color:var(--dsc-white);border-bottom:2px solid var(--dsc-neon);box-shadow:0 6px 18px #39ff1414}.dsc-secondary-tabs .dsc-tab{border-radius:999px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-1);min-height:40px;padding:8px 14px}.dsc-secondary-tabs .dsc-tab.active{border-color:var(--dsc-neon-dim);color:var(--dsc-neon);background:#39ff1414;box-shadow:var(--dsc-shadow-tight)}.dsc-btn{appearance:none;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);border-radius:8px;padding:10px 16px;min-height:40px;font:inherit;cursor:pointer;box-shadow:var(--dsc-shadow-tight);transition:transform .1s ease,box-shadow .1s ease,border-color .12s ease,background .12s ease}.dsc-btn:hover{border-color:var(--dsc-neon-dim)}.dsc-btn:active,.dsc-tab:active{transform:translateY(1px);box-shadow:0 1px 3px #000000a6}.dsc-btn.primary{border-color:var(--dsc-neon-dim);color:var(--dsc-black);background:var(--dsc-neon);font-weight:650}.dsc-page{animation:dsc-fade .18s ease}@keyframes dsc-fade{0%{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.dsc-page,.dsc-btn,.dsc-tab,.dsc-live-pulse{animation:none!important;transition:none!important}}.dsc-grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:14px}.dsc-grid--2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.dsc-table-scroll{overflow-x:auto;max-width:100%;-webkit-overflow-scrolling:touch}.dsc-secondary-tabs .dsc-tab--demoted{opacity:.62;font-size:.82rem}.dsc-secondary-tabs .dsc-tab--demoted:not(.active){border-style:dashed}.dsc-inventory-group{margin-bottom:12px;border:1px solid var(--dsc-gray-3);border-radius:var(--dsc-radius);padding:8px 12px}.dsc-inventory-group>summary{cursor:pointer;font-weight:600;letter-spacing:.08em;text-transform:uppercase;font-size:.78rem;color:var(--dsc-gray-5);margin-bottom:8px}.dsc-gauge.is-progress .dsc-gauge-value{color:var(--dsc-teal)}.dsc-col-3{grid-column:span 3}.dsc-col-4{grid-column:span 4}.dsc-col-6{grid-column:span 6}.dsc-col-8{grid-column:span 8}.dsc-col-12{grid-column:span 12}@media(max-width:1100px){.dsc-col-3,.dsc-col-4{grid-column:span 6}.dsc-col-8{grid-column:span 12}}@media(max-width:720px){.dsc-shell{padding:12px}.dsc-col-3,.dsc-col-4,.dsc-col-6,.dsc-col-8{grid-column:span 12}.dsc-grid--2{grid-template-columns:1fr}.dsc-dash-home .dsc-gauge-matrix--bands{gap:6px}.dsc-dash-home .dsc-gauge-matrix--bands .dsc-gauge-row-3{gap:4px}.dsc-dash-home .dsc-band-cell{padding:4px 2px 6px}.dsc-dash-home .dsc-band-cell .dsc-gauge svg{max-width:92px}.dsc-dash-home .dsc-band-zone-label{font-size:.62rem;letter-spacing:.08em}}.dsc-card{background:linear-gradient(165deg,var(--dsc-gray-1),var(--dsc-black-2));border:1px solid var(--dsc-gray-3);border-radius:var(--dsc-radius);box-shadow:var(--dsc-shadow);padding:14px 16px;min-height:88px}.dsc-card h2,.dsc-card h3{margin:0 0 8px;font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;color:var(--dsc-gray-5);font-weight:600}.dsc-kpi-value{font-size:1.85rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:.02em;color:var(--dsc-white)}.dsc-kpi-unit{margin-left:6px;font-size:.85rem;color:var(--dsc-gray-5)}.dsc-kpi-sub{margin-top:6px;color:var(--dsc-gray-5);font-size:.82rem}.dsc-status-ok{color:var(--dsc-neon)}.dsc-status-warn{color:var(--dsc-amber)}.dsc-status-bad{color:var(--dsc-bad)}.dsc-status-muted{color:var(--dsc-gray-5)}.dsc-page-title{margin:0 0 14px;font-size:1.35rem;letter-spacing:.04em}.dsc-muted{color:var(--dsc-gray-5)}.dsc-legacy-host{min-height:420px;border-radius:var(--dsc-radius);overflow:hidden;border:1px solid var(--dsc-gray-3);background:#000}.dsc-legacy-host--empty{background:var(--dsc-gray-1);min-height:160px}.dsc-legacy-host>*{display:block;width:100%}.dsc-status-strip{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}.dsc-chip-row{display:flex;flex-wrap:wrap;gap:8px}.dsc-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-1);font-size:.75rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-chip--ok{color:var(--dsc-neon);border-color:var(--dsc-neon-dim);background:#39ff1414;box-shadow:0 0 12px #39ff141f}.dsc-chip--bad{color:var(--dsc-bad-soft);border-color:color-mix(in srgb,var(--dsc-bad) 45%,transparent);background:color-mix(in srgb,var(--dsc-bad) 12%,transparent)}.dsc-chip--warn{color:var(--dsc-amber);border-color:color-mix(in srgb,var(--dsc-amber) 45%,transparent);background:color-mix(in srgb,var(--dsc-amber) 12%,transparent)}.dsc-chip--muted{color:var(--dsc-gray-5)}.dsc-chip--pulse{animation:dsc-chip-pulse 1.6s ease-in-out infinite}.dsc-chip--duty{animation:dsc-duty-pulse 1.8s ease-in-out infinite}.dsc-chip--breathe{animation:dsc-chip-breathe 2.4s ease-in-out infinite}.dsc-chip--fan{animation:dsc-chip-fan 1.3s linear infinite}@keyframes dsc-chip-pulse{0%,to{box-shadow:0 0 #39ff1400}50%{box-shadow:0 0 14px #39ff1459}}@keyframes dsc-duty-pulse{0%,to{box-shadow:0 0 #3dde7a0d;border-color:var(--dsc-neon-dim)}50%{box-shadow:0 0 16px #3dde7a52;border-color:var(--dsc-neon)}}@keyframes dsc-chip-breathe{0%,to{box-shadow:0 0 #ffb74d0d}50%{box-shadow:0 0 14px #ffb74d61}}@keyframes dsc-chip-fan{0%{box-shadow:0 0 #2ec4d60d}50%{box-shadow:0 0 12px #2ec4d66b}to{box-shadow:0 0 #2ec4d60d}}.dsc-demand-row{display:flex;flex-wrap:wrap;gap:8px}.dsc-demand-row--stack{flex-direction:column}.dsc-demand{appearance:none;flex:1 1 110px;min-height:52px;padding:10px 12px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);font:inherit;cursor:pointer;display:flex;flex-direction:column;align-items:flex-start;gap:4px;box-shadow:var(--dsc-shadow-tight);transition:transform .1s ease,box-shadow .1s ease,border-color .12s ease,background .12s ease}.dsc-demand:hover{border-color:var(--dsc-neon-dim)}.dsc-demand:active{transform:translateY(1px);box-shadow:0 1px 3px #000000a6}.dsc-demand.is-on{border-color:var(--dsc-neon);background:#39ff141a;box-shadow:0 0 0 1px #39ff1440,0 0 18px #39ff1433}.dsc-demand.is-missing{opacity:.55;cursor:not-allowed}.dsc-demand-label{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-demand.is-on .dsc-demand-label{color:var(--dsc-neon)}.dsc-demand-state{font-weight:700;font-variant-numeric:tabular-nums;font-size:1rem}.dsc-demand-icon{margin-bottom:4px;opacity:.95}.dsc-mode-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}.dsc-mode-selects{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}.dsc-entity-select{display:flex;flex-direction:column;gap:6px;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-entity-select-label{display:inline-flex;align-items:center;gap:6px}.dsc-entity-select select{appearance:none;min-height:40px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);padding:8px 12px;font:inherit;text-transform:none;letter-spacing:0}.dsc-entity-select.is-disabled{opacity:.55}.dsc-fan-stack{display:flex;flex-direction:column;gap:10px}.dsc-fan-slider{display:flex;flex-direction:column;gap:4px}.dsc-fan-slider-label{display:flex;align-items:baseline;gap:8px;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-fan-slider-label strong{color:var(--dsc-teal);font-variant-numeric:tabular-nums}.dsc-fan-slider input[type=range]{width:100%;accent-color:var(--dsc-teal)}.dsc-fan-slider.is-disabled{opacity:.5}.dsc-honesty{margin:10px 0 0;font-size:.85rem;color:var(--dsc-gray-5);display:flex;flex-wrap:wrap;align-items:center;gap:8px}.dsc-target-panel{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}.dsc-target-panel.is-compact .dsc-target-grid{grid-template-columns:repeat(auto-fit,minmax(90px,1fr))}.dsc-tent-targets{border:1px solid var(--dsc-glass-border);border-radius:var(--dsc-radius);padding:10px 12px;background:#0000002e}.dsc-tent-targets-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}.dsc-got-want{display:flex;flex-direction:column;gap:2px;font-size:.82rem;margin-bottom:10px}.dsc-target-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px}.dsc-target-num{display:flex;flex-direction:column;gap:4px;font-size:.7rem;letter-spacing:.06em;color:var(--dsc-gray-5)}.dsc-target-num-label{text-transform:uppercase}.dsc-target-num input,.dsc-target-num textarea{min-height:36px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);padding:6px 8px;font:inherit;font-variant-numeric:tabular-nums}.dsc-target-num textarea{text-transform:none;letter-spacing:0;min-height:56px;resize:vertical}.dsc-target-num.is-disabled{opacity:.55}.dsc-chart{position:relative}.dsc-chart-svg{cursor:crosshair;touch-action:none}.dsc-chart-tooltip{position:absolute;top:8px;transform:translate(-50%);pointer-events:none;z-index:2;min-width:120px;padding:8px 10px;border-radius:8px;border:1px solid var(--dsc-glass-border);background:var(--dsc-glass);backdrop-filter:blur(10px);box-shadow:var(--dsc-shadow-tight);font-size:.75rem}.dsc-chart-tooltip-time{color:var(--dsc-teal);font-family:var(--dsc-mono);margin-bottom:4px}.dsc-chart-tooltip-row{display:flex;align-items:center;gap:6px;color:var(--dsc-white)}.dsc-chart-tooltip-row i{width:7px;height:7px;border-radius:50%;display:inline-block}@keyframes dsc-sync-pulse{0%{stroke-dashoffset:1;opacity:.2}35%{opacity:1}to{stroke-dashoffset:0;opacity:0}}@media(prefers-reduced-motion:reduce){.dsc-chart-pulse{animation:none!important;opacity:.85}.dsc-gauge-value,.dsc-chip--pulse,.dsc-chip--duty,.dsc-chip--breathe,.dsc-chip--fan,.dsc-fan-spin,.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-warn),.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-bad){animation:none!important}}.dsc-gauge.is-warn .dsc-gauge-label{color:var(--dsc-amber)}.dsc-gauge.is-muted{opacity:.75}.dsc-gauge.is-muted .dsc-gauge-label{color:var(--dsc-gray-5)}.dsc-gauge.is-bad .dsc-gauge-label{color:var(--dsc-bad-soft)}.dsc-gauge.is-ok:not(.is-stale) .dsc-gauge-value{animation:dsc-gauge-live 3.2s ease-in-out infinite}.dsc-gauge.is-warn .dsc-gauge-value,.dsc-gauge.is-bad .dsc-gauge-value{animation:dsc-gauge-breathe 2.4s ease-in-out infinite}@keyframes dsc-gauge-live{0%,to{opacity:.92;filter:drop-shadow(0 0 4px rgba(46,196,214,.25))}50%{opacity:1;filter:drop-shadow(0 0 10px rgba(46,196,214,.55))}}@keyframes dsc-gauge-breathe{0%,to{opacity:.88;filter:drop-shadow(0 0 4px rgba(255,183,77,.25))}50%{opacity:1;filter:drop-shadow(0 0 12px rgba(255,107,138,.55))}}.dsc-gauge-row{display:flex;justify-content:space-around;flex-wrap:wrap;gap:8px}.dsc-gauge-matrix{display:flex;flex-direction:column;gap:8px}.dsc-gauge-row-3{display:grid;grid-template-columns:14px repeat(3,minmax(0,1fr));align-items:center;gap:2px 4px;border:1px solid transparent;border-radius:12px;padding:2px 4px 4px;transition:box-shadow .25s ease,border-color .25s ease,background .25s ease}.dsc-gauge-row-3.is-lit{border-color:#26c6da6b;background:linear-gradient(180deg,#26c6da14,#0c121c59);box-shadow:0 0 22px #26c6da29,inset 0 0 14px #26c6da0d}.dsc-gauge-row-tag{font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--dsc-gray-5);writing-mode:vertical-rl;transform:rotate(180deg);justify-self:center;padding:2px 0}.dsc-gauge-row-3 .dsc-gauge{min-width:0}.dsc-gauge-cell{min-width:0;display:flex;flex-direction:column;align-items:center;gap:2px}.dsc-gauge-cell .dsc-sparkline{width:100%;max-width:88px;opacity:.9}.dsc-gauge-row-3 .dsc-gauge svg{width:100%;max-width:96px;height:auto;max-height:72px}.dsc-gauge-row-3 .dsc-gauge-label{font-size:10px}.dsc-gauge-zone{border:1px solid transparent;border-radius:12px;padding:8px 6px 10px;transition:box-shadow .25s ease,border-color .25s ease,background .25s ease}.dsc-gauge-zone.is-lit{border-color:#26c6da6b;background:linear-gradient(180deg,#26c6da14,#0c121c59);box-shadow:0 0 22px #26c6da29,inset 0 0 14px #26c6da0d}.dsc-gauge-zone-label{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5);margin:0 4px 6px}.dsc-gauge{display:flex;flex-direction:column;align-items:center;gap:4px}.dsc-gauge-label{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-chart-legend{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:4px;min-height:20px}.dsc-chart-legend-item{display:inline-flex;align-items:center;gap:6px;font-size:.75rem;color:var(--dsc-gray-5)}.dsc-chart-legend-item i{width:8px;height:8px;border-radius:50%;display:inline-block;box-shadow:0 0 6px currentColor}.dsc-chart-last{margin-left:auto;font-variant-numeric:tabular-nums;color:var(--dsc-neon);font-size:13px;font-weight:650}.dsc-fault-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.dsc-fault-list li{display:flex;flex-wrap:wrap;align-items:center;gap:10px}.dsc-empty{padding:18px 14px;border:1px dashed var(--dsc-gray-3);border-radius:8px;color:var(--dsc-gray-5);background:#00000040;font-size:.9rem;line-height:1.45}.dsc-empty--ok{border-style:solid;border-color:var(--dsc-neon-dim);color:var(--dsc-neon)}.dsc-btn:disabled{opacity:.45;cursor:not-allowed}.dsc-glass{background:var(--dsc-glass);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid var(--dsc-glass-border);border-radius:var(--dsc-radius-lg);box-shadow:var(--dsc-shadow)}.dsc-glass--glow{border-color:var(--dsc-teal-dim);box-shadow:0 0 0 1px #26c6da26,0 0 24px #26c6da1f}.dsc-icon-btn{appearance:none;width:36px;height:36px;padding:0;display:inline-flex;align-items:center;justify-content:center;border-radius:10px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);cursor:pointer;box-shadow:var(--dsc-shadow-tight);transition:border-color .12s ease,background .12s ease,transform .1s ease}.dsc-icon-btn:hover{border-color:var(--dsc-teal-dim);color:var(--dsc-teal)}.dsc-icon-btn:active{transform:translateY(1px)}.dsc-result-chip{display:inline-flex;align-items:center;gap:8px;max-width:100%;padding:8px 12px;border-radius:999px;border:1px solid var(--dsc-teal-dim);background:#26c6da1a;color:var(--dsc-white);font-size:.9rem}.dsc-result-chip span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dsc-overflow{position:relative;display:inline-block}.dsc-overflow-menu{position:absolute;right:0;top:calc(100% + 6px);z-index:40;min-width:180px;padding:6px;background:var(--dsc-black-2);border:1px solid var(--dsc-gray-3);border-radius:10px;box-shadow:var(--dsc-shadow)}.dsc-overflow-menu button{appearance:none;width:100%;text-align:left;border:0;background:transparent;color:var(--dsc-white);font:inherit;font-size:.88rem;padding:10px 12px;border-radius:8px;cursor:pointer}.dsc-overflow-menu button:hover{background:#26c6da1f;color:var(--dsc-teal)}.dsc-drawer-root{position:fixed;inset:0;z-index:80;pointer-events:none;visibility:hidden}.dsc-drawer-root.is-open{pointer-events:auto;visibility:visible}.dsc-drawer-scrim{position:absolute;inset:0;background:#00000073;opacity:0;transition:opacity .18s ease}.dsc-drawer-root.is-open .dsc-drawer-scrim{opacity:1}.dsc-drawer-panel{position:absolute;top:0;bottom:0;width:min(380px,92vw);background:linear-gradient(165deg,#121a16,#0a100e);border:1px solid var(--dsc-glass-border);box-shadow:-12px 0 40px #0000008c;display:flex;flex-direction:column;transition:transform .22s ease}.dsc-drawer-panel.right{right:0;transform:translate(105%);border-radius:14px 0 0 14px}.dsc-drawer-panel.left{left:0;transform:translate(-105%);border-radius:0 14px 14px 0}.dsc-drawer-root.is-open .dsc-drawer-panel.right,.dsc-drawer-root.is-open .dsc-drawer-panel.left{transform:none}.dsc-drawer-rail{position:absolute;top:50%;transform:translateY(-50%);width:28px;height:64px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:2}.dsc-drawer-root:not(.is-open) .dsc-drawer-rail,.dsc-drawer-root:not(.is-open) .dsc-drawer-panel{display:none}.dsc-drawer-panel.right .dsc-drawer-rail{left:-28px;border-radius:10px 0 0 10px}.dsc-drawer-panel.left .dsc-drawer-rail{right:-28px;border-radius:0 10px 10px 0}.dsc-drawer-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid var(--dsc-gray-3)}.dsc-drawer-head h2{margin:0;font-size:.85rem;letter-spacing:.12em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-drawer-body{flex:1;overflow:auto;padding:14px 16px}.dsc-soil{width:100%;max-width:280px;margin:0 auto}.dsc-soil-pot{position:relative;width:100%;aspect-ratio:4 / 5;border-radius:12px 12px 28px 28px;border:2px solid rgba(120,160,130,.45);background:linear-gradient(180deg,#1a1410,#0e0c0a);overflow:hidden;box-shadow:inset 0 0 24px #0000008c,0 0 20px #26c6da14}.dsc-soil-pot.is-valid{border-color:var(--dsc-teal-dim);box-shadow:inset 0 0 24px #0000008c,0 0 28px #26c6da47,0 0 42px #39ff141f}.dsc-soil-layer{position:absolute;left:8%;right:8%;display:flex;align-items:center;justify-content:center;font-size:.72rem;letter-spacing:.04em;color:#f4f7f4eb;text-shadow:0 1px 2px rgba(0,0,0,.65);border-top:1px solid rgba(255,255,255,.08)}.dsc-soil-empty{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--dsc-gray-5);font-size:.85rem;padding:16px;text-align:center}.dsc-seat-layout{display:grid;grid-template-columns:minmax(200px,320px) 1fr;gap:18px;align-items:start}@media(max-width:900px){.dsc-seat-layout{grid-template-columns:1fr}}.dsc-seat-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.dsc-table{width:100%;border-collapse:collapse;font-size:.88rem}.dsc-table th,.dsc-table td{text-align:left;padding:8px 6px;border-bottom:1px solid var(--dsc-gray-3)}.dsc-table th{font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--dsc-gray-5);font-weight:600}.dsc-table tr{cursor:pointer}.dsc-table tr:hover td{background:#26c6da0f}.dsc-btn.teal{border-color:var(--dsc-teal-dim);background:#26c6da2e;color:var(--dsc-white);box-shadow:0 0 18px #26c6da33}.dsc-btn.teal.primary{background:var(--dsc-teal);color:#041018;font-weight:650}.dsc-held-tag{margin-left:8px;font-size:.65rem;letter-spacing:.08em;color:var(--dsc-amber);vertical-align:middle}.dsc-kpi-hit,.dsc-gauge-hit{appearance:none;border:0;background:transparent;padding:0;margin:0;color:inherit;font:inherit;text-align:left;cursor:pointer;width:100%;display:block}.dsc-card.is-stale,.dsc-gauge.is-stale{opacity:.88;border-color:var(--dsc-amber)}.dsc-gauge.is-clickable:hover,.dsc-kpi-hit:hover .dsc-card{border-color:var(--dsc-blue-dim)}.dsc-timespan{display:inline-flex;flex-wrap:wrap;gap:6px}.dsc-spark-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}.dsc-sparkline{display:block;margin-top:4px}.dsc-gotwant{display:flex;flex-direction:column;gap:10px}.dsc-gotwant-row{display:grid;grid-template-columns:64px 1fr;gap:6px 10px;align-items:center}.dsc-gotwant-label{font-size:.75rem;color:var(--dsc-gray-5);letter-spacing:.04em}.dsc-gotwant-track{position:relative;height:10px;border-radius:999px;background:#ffffff0f;overflow:hidden;grid-column:2}.dsc-gotwant-want{position:absolute;inset:0 auto 0 0;background:#2ec4d647;border-right:1px solid var(--dsc-teal)}.dsc-gotwant-got{position:absolute;inset:2px auto 2px 0;background:linear-gradient(90deg,var(--dsc-blue),var(--dsc-teal));border-radius:999px}.dsc-gotwant-vals{grid-column:2;display:flex;justify-content:space-between;font-size:.72rem;font-family:var(--dsc-mono)}.dsc-seat-editors{display:grid;gap:10px}.dsc-seat-editors label{display:flex;flex-direction:column;gap:4px;font-size:.75rem;color:var(--dsc-gray-5)}.dsc-seat-editors input,.dsc-seat-editors select,.dsc-seat-editors textarea{background:var(--dsc-gray-1);border:1px solid var(--dsc-glass-border);border-radius:8px;color:var(--dsc-white);padding:8px 10px;font:inherit}.dsc-root-matrix .dsc-tone-ok{color:var(--dsc-neon)}.dsc-root-matrix .dsc-tone-warn{color:var(--dsc-amber)}.dsc-root-matrix .dsc-tone-bad{color:var(--dsc-bad)}.dsc-root-matrix .dsc-tone-stale{color:var(--dsc-amber);opacity:.85}.dsc-tent-cockpit-strip{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}@media(prefers-reduced-motion:reduce){.dsc-drawer-panel,.dsc-drawer-scrim{transition:none!important}}.dsc-decision-root{position:fixed;inset:0;z-index:120;display:flex;align-items:center;justify-content:center}.dsc-decision-scrim{position:absolute;inset:0;background:#04080ab8;backdrop-filter:blur(6px)}.dsc-decision-panel{position:relative;z-index:1;width:min(720px,94vw);max-height:86vh;overflow:auto;background:linear-gradient(165deg,#121a16,#0a100e);border:1px solid var(--dsc-glass-border);border-radius:14px;box-shadow:0 24px 80px #0000008c;padding:16px 18px}.dsc-decision-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.dsc-decision-head h2{margin:0;font-size:.95rem;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-decision-help{min-height:8px;margin-top:10px}.dsc-decision-foot{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}.dsc-chart.is-stale .dsc-chart-core{opacity:.72;stroke-dasharray:4 3}.dsc-chart.is-stale .dsc-chart-tip{display:none}.dsc-chart.is-stale .dsc-chart-last:after{content:" · held";color:var(--dsc-amber);font-size:.85em}.dsc-result-chip.is-empty{border-color:#78a08247;background:#121c1673;color:var(--dsc-gray-5)}.dsc-result-chip-hit{appearance:none;border:0;background:transparent;padding:0;color:inherit;font:inherit;cursor:pointer;max-width:100%}.dsc-coupled-mix .dsc-mix-row{display:grid;grid-template-columns:minmax(140px,1.2fr) 140px 48px 64px auto;gap:8px;align-items:end;margin-bottom:8px}.dsc-nutrient-slot{display:grid;grid-template-columns:minmax(140px,1fr) 88px 64px auto;gap:8px;align-items:end;margin-top:8px}.dsc-catalog-hits{list-style:none;margin:8px 0 0;padding:0;max-height:280px;overflow:auto}.dsc-catalog-hits button{appearance:none;width:100%;text-align:left;background:transparent;border:0;color:inherit;font:inherit;padding:8px 4px;cursor:pointer;display:flex;gap:8px}.dsc-catalog-hits button:hover{background:#26c6da1a}.dsc-catalog-picker input[type=search]{width:100%;box-sizing:border-box;background:var(--dsc-gray-1);border:1px solid var(--dsc-glass-border);border-radius:8px;color:var(--dsc-white);padding:8px 10px}.dsc-vessel-glyph{display:inline-flex;flex-direction:column;align-items:center;gap:2px}.dsc-vessel-glyph-label{font-size:.65rem;color:var(--dsc-gray-5)}.dsc-kit-constellation{width:100%;max-height:420px;color:inherit;margin-bottom:8px}.dsc-kit-pulse-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px}.dsc-kit-node{display:flex;align-items:center;gap:8px;padding:8px;border:1px dashed var(--dsc-gray-3);border-radius:10px}.dsc-kit-node.is-ok{border-style:solid;border-color:var(--dsc-teal-dim)}.dsc-kit-node i{width:10px;height:10px;border-radius:50%;background:var(--dsc-gray-5)}.dsc-kit-node.is-ok i{background:var(--dsc-neon)}.dsc-kit-node.is-held i{background:var(--dsc-amber)}.dsc-kit-node.is-oos i,.dsc-kit-node.is-missing i,.dsc-kit-node.is-dark i{background:transparent;border:1px dashed var(--dsc-bad)}.dsc-lung-svg,.dsc-tank-svg{width:100%;height:auto;color:var(--dsc-white)}.dsc-cal-curve{margin:12px 0 16px}.dsc-cal-curve strong{display:block;margin-bottom:6px}.dsc-honesty-hit{appearance:none;border:0;background:transparent;padding:0;cursor:pointer}.dsc-row-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.dsc-detail-list dt{font-size:.7rem;color:var(--dsc-gray-5);margin-top:8px}.dsc-detail-list dd{margin:0}button.dsc-chip{font:inherit;letter-spacing:inherit;text-transform:inherit;cursor:pointer;color:inherit}button.dsc-chip.is-clickable:hover{border-color:var(--dsc-teal)}.dsc-duty-hit{appearance:none;border:0;background:transparent;padding:0;width:100%;text-align:left;cursor:pointer;color:inherit;font:inherit}.dsc-duty-strip{display:flex;flex-direction:column;gap:4px;margin:8px 0}.dsc-duty-meta{display:flex;justify-content:space-between;gap:8px;font-size:.72rem;letter-spacing:.04em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-duty-svg{width:100%;height:18px;display:block}.dsc-inspector-playbook{margin:10px 0;padding:10px 12px;border:1px solid var(--dsc-glass-border);border-radius:10px;background:#00000038}.dsc-inspector-playbook strong{display:block;margin-bottom:4px}.dsc-inspector-playbook p{margin:4px 0}.dsc-stage-track{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px}.dsc-stage-pill{font-size:.65rem;letter-spacing:.04em;text-transform:uppercase;padding:5px 8px;border-radius:6px;background:var(--dsc-gray-2);color:var(--dsc-gray-5)}.dsc-stage-pill.is-on{background:color-mix(in srgb,var(--dsc-blue) 45%,transparent);color:var(--dsc-white)}.dsc-stage-pill.is-next{background:color-mix(in srgb,var(--dsc-amber) 22%,transparent);color:var(--dsc-amber)}.dsc-scheduler-lanes{display:flex;flex-direction:column;gap:6px;margin-top:8px}.dsc-scheduler-lane{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:8px 10px;border:1px solid var(--dsc-gray-3);border-radius:10px;background:#00000029;color:inherit;font:inherit;text-align:left;cursor:pointer}.dsc-scheduler-lane:hover:not(:disabled){border-color:var(--dsc-teal)}.dsc-scheduler-lane.is-oos,.dsc-scheduler-lane:disabled{opacity:.45;cursor:default}.dsc-air-path{display:flex;flex-direction:column;gap:8px}.dsc-air-svg{width:100%;height:auto;display:block;color:var(--dsc-white)}.dsc-target-heroes{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px}.dsc-tent-targets.is-hero{border-color:var(--dsc-teal-dim);padding:14px 16px}.dsc-target-hint{font-size:.65rem;color:var(--dsc-gray-5);letter-spacing:.03em}.dsc-got-want-hit{appearance:none;border:0;background:transparent;padding:0;width:100%;text-align:left;cursor:pointer;color:inherit;font:inherit}.dsc-pot-card-head{display:flex;align-items:center;gap:10px;cursor:pointer;margin-bottom:8px}.dsc-pot-card.is-oos{opacity:.72}.dsc-npk-hit{appearance:none;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:inherit;font:inherit;font-size:.75rem;border-radius:8px;padding:6px 8px;cursor:pointer}.dsc-npk-hit:hover{border-color:var(--dsc-teal)}.dsc-light-hero .dsc-honesty{font-size:.78rem}.dsc-dash-home .dsc-gauge-matrix--dense{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px 10px}.dsc-gauge-matrix--bands{display:flex;flex-direction:column;gap:10px}.dsc-gauge-matrix--bands .dsc-gauge-row-3 .dsc-band-cell{min-width:0;padding:6px 2px 8px}.dsc-gauge-matrix--bands .dsc-gauge-row-3:not(.is-lit){opacity:.72}.dsc-gauge-matrix--bands .dsc-gauge-row-3.is-lit{opacity:1}@keyframes dsc-fan-spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.dsc-fan-spin{animation:dsc-fan-spin 1.3s linear infinite;transform-origin:center center}.dsc-chip--fan .dsc-fan-spin:nth-child(1){animation-duration:1.3s}.dsc-dash-home .dsc-band-cell{display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 4px 10px;border-radius:12px;background:#0c121c59;border:1px solid rgba(130,165,230,.12);transition:box-shadow .25s ease,border-color .25s ease,background .25s ease}.dsc-dash-home .dsc-band-cell--main,.dsc-dash-home .dsc-band-cell--clone,.dsc-dash-home .dsc-band-cell--room,.dsc-dash-home .dsc-band-cell--root{border-color:#82a5e61f;background:#0c121c59;box-shadow:none}.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-ok){border-color:#66bb6a6b;background:linear-gradient(180deg,#66bb6a14,#0c121c59)}.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-warn),.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-stale){border-color:#ffb74d80;background:linear-gradient(180deg,#ffb74d14,#0c121c59)}.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-bad){border-color:#ef53508c;background:linear-gradient(180deg,#ef535014,#0c121c59)}.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-muted){border-color:#8b95a838;background:#0c121c47}.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-warn),.dsc-dash-home .dsc-band-cell:has(.dsc-gauge.is-bad){animation:dsc-band-warn 2.6s ease-in-out infinite}@keyframes dsc-band-warn{0%,to{box-shadow:inset 0 0 16px #ffb74d0f}50%{box-shadow:inset 0 0 22px #ffb74d2e,0 0 18px #ffb74d1f}}.dsc-dash-home .dsc-band-cell .dsc-gauge-hit{width:auto;display:flex;justify-content:center}.dsc-dash-home .dsc-band-cell .dsc-gauge svg{width:100%;max-width:118px;height:auto}.dsc-band-cell{display:flex;flex-direction:column;align-items:center;gap:4px}.dsc-band-cell .dsc-sparkline{opacity:.85}.dsc-dash-home .dsc-legacy-host{max-height:min(52vh,520px);overflow:hidden;border-radius:10px}.dsc-dash-home .dsc-status-strip{margin-bottom:4px}.dsc-dash-home .dsc-gauge-matrix--pots{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:8px}.dsc-banner{border-radius:10px;padding:12px 14px;border-left:3px solid rgba(148,163,184,.5);background:#0f172a8c}.dsc-banner--warn{border-left-color:#fbbf24d9;background:#fbbf2414}.dsc-banner--bad{border-left-color:#ef4444e6;background:#ef44441a}.dsc-banner strong{display:block;margin-bottom:4px}.dsc-narrator{margin-top:12px;border:1px solid rgba(56,189,248,.25);border-left:3px solid rgba(56,189,248,.45);border-radius:10px;padding:10px 14px;background:#0c121c73}.dsc-narrator summary{cursor:pointer;font-weight:600;letter-spacing:.02em}.dsc-grow-log{font-size:13px;line-height:1.5;max-height:220px;overflow-y:auto}.dsc-grow-log li{padding:4px 0;border-bottom:1px solid rgba(148,163,184,.12)}.dsc-grow-log--alert{color:var(--dsc-amber, #f59e0b);font-weight:600;background:#f59e0b14;margin:0 -8px;padding:4px 8px!important;border-radius:6px}.dsc-btn.dsc-btn-primary{background:var(--dsc-teal);border-color:var(--dsc-teal);color:#041018;font-weight:650;box-shadow:0 0 16px #26c6da47,var(--dsc-shadow-tight)}.dsc-btn.dsc-btn-primary:hover:not(:disabled){filter:brightness(1.1);box-shadow:0 0 22px #26c6da73,var(--dsc-shadow-tight)}.dsc-btn.dsc-btn-secondary{background:var(--dsc-gray-2);border-color:var(--dsc-gray-3);color:var(--dsc-white)}.dsc-btn.dsc-btn-secondary:hover:not(:disabled){border-color:var(--dsc-teal-dim);color:var(--dsc-teal)}.dsc-btn.dsc-btn-danger{background:#ef535024;border-color:#ef53508c;color:#ff9e9b;font-weight:600}.dsc-btn.dsc-btn-danger:hover:not(:disabled){background:#ef535042;border-color:var(--dsc-bad);color:#ffd7d5}.dsc-btn:disabled{opacity:.5;cursor:not-allowed}.dsc-btn:focus-visible,.dsc-icon-btn:focus-visible,button:focus-visible,[role=button]:focus-visible,a:focus-visible,summary:focus-visible{outline:2px solid var(--dsc-teal);outline-offset:2px}select:focus-visible,input:focus-visible,textarea:focus-visible{outline:2px solid var(--dsc-teal);outline-offset:1px}input[type=range]{appearance:none;-webkit-appearance:none;width:100%;height:28px;margin:0;background:transparent;cursor:pointer}input[type=range]::-webkit-slider-runnable-track{height:6px;border-radius:999px;background:var(--dsc-gray-3);border:1px solid var(--dsc-glass-border)}input[type=range]::-webkit-slider-thumb{appearance:none;-webkit-appearance:none;width:18px;height:18px;margin-top:-7px;border-radius:50%;background:var(--dsc-teal);border:2px solid var(--dsc-black);box-shadow:0 0 8px var(--dsc-teal-dim)}input[type=range]:hover:not(:disabled)::-webkit-slider-thumb{box-shadow:0 0 14px var(--dsc-teal-glow)}input[type=range]::-moz-range-track{height:6px;border-radius:999px;background:var(--dsc-gray-3);border:1px solid var(--dsc-glass-border)}input[type=range]::-moz-range-progress{height:6px;border-radius:999px;background:var(--dsc-teal-dim)}input[type=range]::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:var(--dsc-teal);border:2px solid var(--dsc-black);box-shadow:0 0 8px var(--dsc-teal-dim)}input[type=range]:disabled{opacity:.45;cursor:not-allowed}input[type=range]:disabled::-webkit-slider-thumb{background:var(--dsc-gray-4);box-shadow:none}select{appearance:none;-webkit-appearance:none;min-height:38px;border-radius:8px;border:1px solid var(--dsc-gray-3);background-color:var(--dsc-gray-2);color:var(--dsc-white);font:inherit;padding:8px 32px 8px 12px;cursor:pointer;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' fill='none' stroke='%238b95a8' stroke-width='2' stroke-linecap='round'/></svg>");background-repeat:no-repeat;background-position:right 10px center}select:hover:not(:disabled){border-color:var(--dsc-teal-dim)}select:disabled{opacity:.5;cursor:not-allowed}select option{background:var(--dsc-gray-1);color:var(--dsc-white)}input:not([type]),input[type=text],input[type=number],input[type=search],input[type=password],input[type=time],input[type=date],input[type=datetime-local],textarea{min-height:36px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);font:inherit;padding:8px 10px}input:not([type]):hover:not(:disabled),input[type=text]:hover:not(:disabled),input[type=number]:hover:not(:disabled),input[type=search]:hover:not(:disabled),textarea:hover:not(:disabled){border-color:var(--dsc-teal-dim)}input:not([type]):focus,input[type=text]:focus,input[type=number]:focus,input[type=search]:focus,textarea:focus{border-color:var(--dsc-teal)}input::placeholder,textarea::placeholder{color:var(--dsc-gray-4);opacity:.8}input[type=checkbox]{appearance:none;-webkit-appearance:none;width:18px;height:18px;flex:none;margin:0 6px 0 0;border-radius:5px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);display:inline-block;vertical-align:middle;position:relative;cursor:pointer}input[type=checkbox]:hover:not(:disabled){border-color:var(--dsc-teal-dim)}input[type=checkbox]:checked{background:var(--dsc-teal);border-color:var(--dsc-teal)}input[type=checkbox]:checked:after{content:"";position:absolute;left:5px;top:1.5px;width:5px;height:9px;border:solid #06121a;border-width:0 2px 2px 0;transform:rotate(45deg)}input[type=checkbox]:disabled{opacity:.45;cursor:not-allowed}.dsc-kit-pulse .dsc-kit-constellation{display:block;width:100%;background:#0003;border:1px solid var(--dsc-glass-border);border-radius:var(--dsc-radius);margin-bottom:10px}@keyframes dsc-kit-node-pulse{0%,to{filter:drop-shadow(0 0 0 rgba(38,198,218,0))}50%{filter:drop-shadow(0 0 6px rgba(38,198,218,.65))}}.dsc-kit-node-running{animation:dsc-kit-node-pulse 2.4s ease-in-out infinite}.dsc-inspector-details{margin-top:14px;border-top:1px solid var(--dsc-gray-3);padding-top:10px}.dsc-inspector-details summary{cursor:pointer;color:var(--dsc-gray-5);font-size:.75rem;letter-spacing:.08em;text-transform:uppercase}@media(prefers-reduced-motion:reduce){.dsc-kit-node-running{animation:none!important}}`, $w = Hw;
function rg() {
  const n = Ft(), i = gt();
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      zt,
      {
        icon: "alert",
        title: "Not found",
        subtitle: `${n.pathname} is not a DSC route.`
      }
    ),
    /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: "Unknown hash — not a silent Mission redirect." }),
    /* @__PURE__ */ s.jsx(ae, { primary: !0, onClick: () => i("/live/overview"), children: "Go Overview" })
  ] });
}
function il() {
  const n = Ft(), i = lw(n.pathname, n.search);
  return i ? /* @__PURE__ */ s.jsx(Ha, { to: i, replace: !0 }) : /* @__PURE__ */ s.jsx(rg, {});
}
function Bw() {
  return /* @__PURE__ */ s.jsx("div", { className: "dsc-page", children: /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Loading…" }) });
}
function Uw({ surfaceVersion: n = "7.2.0" }) {
  const i = Ft(), r = gt(), o = sw(i.pathname), d = nw[o];
  return v.useEffect(() => {
    m1(i.pathname);
  }, [i.pathname]), v.useEffect(() => {
    if (i.pathname === "/live/climate" || i.pathname === "/ops/home") return;
    const h = new URLSearchParams(i.search);
    if (!h.has("tent") && !h.has("zone")) return;
    h.delete("tent"), h.delete("zone");
    const m = h.toString();
    r({ pathname: i.pathname, search: m ? `?${m}` : "" }, { replace: !0 });
  }, [i.pathname, i.search, r]), /* @__PURE__ */ s.jsxs("div", { className: "dsc-shell", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-brand-row", children: [
      /* @__PURE__ */ s.jsxs(Jr, { className: "dsc-brand", to: "/live/overview", children: [
        /* @__PURE__ */ s.jsx(tn, { name: "brand", size: 36, color: "var(--dsc-blue)" }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-brand-title", children: /* @__PURE__ */ s.jsx("strong", { children: "DSC - A Plausible Deniability Project." }) })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-muted", style: { fontSize: 12, letterSpacing: "0.08em" }, children: [
        "SURFACE ",
        n
      ] })
    ] }),
    /* @__PURE__ */ s.jsx(o1, {}),
    /* @__PURE__ */ s.jsx("nav", { className: "dsc-primary-tabs", "aria-label": "Primary", children: tw.map((h) => /* @__PURE__ */ s.jsxs(
      Jr,
      {
        to: h.path,
        className: ({ isActive: m }) => `dsc-tab dsc-tab--${h.id}${m || o === h.id ? " active" : ""}`,
        children: [
          /* @__PURE__ */ s.jsx(tn, { name: h.icon, size: 15 }),
          h.label
        ]
      },
      h.id
    )) }),
    d.length > 1 ? /* @__PURE__ */ s.jsx("nav", { className: "dsc-secondary-tabs", "aria-label": "Section pages", children: d.map((h) => /* @__PURE__ */ s.jsxs(
      Jr,
      {
        to: h.path,
        end: h.path === "/fleet",
        className: ({ isActive: m }) => `dsc-tab${h.demoted ? " dsc-tab--demoted" : ""}${m ? " active" : ""}`,
        children: [
          /* @__PURE__ */ s.jsx(tn, { name: h.icon, size: 14 }),
          h.label
        ]
      },
      h.id
    )) }) : null,
    /* @__PURE__ */ s.jsx(mj, {}),
    /* @__PURE__ */ s.jsx(hb, { children: /* @__PURE__ */ s.jsx(v.Suspense, { fallback: /* @__PURE__ */ s.jsx(Bw, {}), children: /* @__PURE__ */ s.jsxs(My, { children: [
      /* @__PURE__ */ s.jsx(He, { path: "/", element: /* @__PURE__ */ s.jsx(Ha, { to: "/live/overview", replace: !0 }) }),
      /* @__PURE__ */ s.jsx(He, { path: "/live", element: /* @__PURE__ */ s.jsx(Ha, { to: "/live/overview", replace: !0 }) }),
      /* @__PURE__ */ s.jsx(He, { path: "/live/overview", element: /* @__PURE__ */ s.jsx(Ow, {}) }),
      /* @__PURE__ */ s.jsx(He, { path: "/live/mission", element: /* @__PURE__ */ s.jsx(Tj, {}) }),
      /* @__PURE__ */ s.jsx(He, { path: "/live/twin", element: /* @__PURE__ */ s.jsx(M_, {}) }),
      /* @__PURE__ */ s.jsx(He, { path: "/live/climate", element: /* @__PURE__ */ s.jsx(Fj, {}) }),
      /* @__PURE__ */ s.jsx(He, { path: "/live/4x8", element: /* @__PURE__ */ s.jsx(Zj, {}) }),
      /* @__PURE__ */ s.jsx(He, { path: "/live/2x4", element: /* @__PURE__ */ s.jsx(Kj, {}) }),
      /* @__PURE__ */ s.jsx(He, { path: "/live/main", element: /* @__PURE__ */ s.jsx(Ha, { to: "/live/4x8", replace: !0 }) }),
      /* @__PURE__ */ s.jsx(He, { path: "/live/clone", element: /* @__PURE__ */ s.jsx(Ha, { to: "/live/2x4", replace: !0 }) }),
      /* @__PURE__ */ s.jsx(He, { path: "/live/root", element: /* @__PURE__ */ s.jsx(Yj, {}) }),
      /* @__PURE__ */ s.jsx(He, { path: "/live/light", element: /* @__PURE__ */ s.jsx(Pj, {}) }),
      /* @__PURE__ */ s.jsx(He, { path: "/grow", element: /* @__PURE__ */ s.jsx(Ha, { to: "/grow/roster", replace: !0 }) }),
      /* @__PURE__ */ s.jsx(He, { path: "/grow/compose", element: /* @__PURE__ */ s.jsx(uj, {}) }),
      /* @__PURE__ */ s.jsx(He, { path: "/grow/research", element: /* @__PURE__ */ s.jsx(dj, {}) }),
      /* @__PURE__ */ s.jsx(He, { path: "/grow/roster", element: /* @__PURE__ */ s.jsx(hj, {}) }),
      /* @__PURE__ */ s.jsx(He, { path: "/tune", element: /* @__PURE__ */ s.jsx(Ha, { to: "/tune/learning", replace: !0 }) }),
      /* @__PURE__ */ s.jsx(He, { path: "/tune/learning", element: /* @__PURE__ */ s.jsx(Jj, {}) }),
      /* @__PURE__ */ s.jsx(He, { path: "/tune/analytics", element: /* @__PURE__ */ s.jsx(Ij, {}) }),
      /* @__PURE__ */ s.jsx(He, { path: "/fleet", element: /* @__PURE__ */ s.jsx(Wj, {}) }),
      /* @__PURE__ */ s.jsx(He, { path: "/fleet/calibrate", element: /* @__PURE__ */ s.jsx(ew, {}) }),
      /* @__PURE__ */ s.jsx(He, { path: "/fleet/settings", element: /* @__PURE__ */ s.jsx(jw, {}) }),
      /* @__PURE__ */ s.jsx(He, { path: "/settings", element: /* @__PURE__ */ s.jsx(Ha, { to: "/fleet/settings", replace: !0 }) }),
      /* @__PURE__ */ s.jsx(He, { path: "/ops/home", element: /* @__PURE__ */ s.jsx(Lw, {}) }),
      /* @__PURE__ */ s.jsx(He, { path: "/ops/dash", element: /* @__PURE__ */ s.jsx(M_, {}) }),
      /* @__PURE__ */ s.jsx(He, { path: "/ops/*", element: /* @__PURE__ */ s.jsx(il, {}) }),
      /* @__PURE__ */ s.jsx(He, { path: "/plant/*", element: /* @__PURE__ */ s.jsx(il, {}) }),
      /* @__PURE__ */ s.jsx(He, { path: "/plant", element: /* @__PURE__ */ s.jsx(il, {}) }),
      /* @__PURE__ */ s.jsx(He, { path: "/advanced/*", element: /* @__PURE__ */ s.jsx(il, {}) }),
      /* @__PURE__ */ s.jsx(He, { path: "/advanced", element: /* @__PURE__ */ s.jsx(il, {}) }),
      /* @__PURE__ */ s.jsx(He, { path: "/system", element: /* @__PURE__ */ s.jsx(il, {}) }),
      /* @__PURE__ */ s.jsx(He, { path: "*", element: /* @__PURE__ */ s.jsx(rg, {}) })
    ] }) }) }),
    /* @__PURE__ */ s.jsx(j1, {})
  ] });
}
function Fw({
  hass: n,
  surfaceVersion: i = "7.2.0",
  hassRevision: r = 0,
  fleetSource: o = "ha"
}) {
  return /* @__PURE__ */ s.jsx(_0, { hass: n, revision: r, children: /* @__PURE__ */ s.jsx(gj, { children: /* @__PURE__ */ s.jsx(tj, { children: /* @__PURE__ */ s.jsx(_j, { children: /* @__PURE__ */ s.jsx(Uw, { surfaceVersion: i }) }) }) }) });
}
function Gw({
  panel: n
}) {
  const [i, r] = v.useState(() => n.hass), [o, d] = v.useState(0);
  return v.useEffect(() => {
    const h = () => {
      r(n.hass), d((m) => m + 1);
    };
    return h(), n.addEventListener("hass-updated", h), () => {
      n.removeEventListener("hass-updated", h);
    };
  }, [n]), /* @__PURE__ */ s.jsx(N0, { hass: i, tick: o, source: "ha", children: /* @__PURE__ */ s.jsx(t0, { children: /* @__PURE__ */ s.jsx(Fw, { hass: i, fleetSource: "ha" }) }) });
}
class Vw extends HTMLElement {
  constructor() {
    super(...arguments);
    ci(this, "_root", null);
    ci(this, "_hass", null);
    ci(this, "_mounted", !1);
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
${$w}`, this.shadowRoot.appendChild(r);
      const o = document.createElement("div");
      o.className = "dsc-root", o.style.height = "100%", this.shadowRoot.appendChild(o), this._root = Rv.createRoot(o), this._root.render(
        /* @__PURE__ */ s.jsx(hb, { children: /* @__PURE__ */ s.jsx(Gw, { panel: this }) })
      ), this._mounted = !0;
    }
  }
  disconnectedCallback() {
    this._root?.unmount(), this._root = null, this._mounted = !1;
  }
}
customElements.get("dsc-hub-panel") || customElements.define("dsc-hub-panel", Vw);
const qw = v.createContext(null);
function Yw() {
  const n = v.useContext(qw);
  if (!n)
    throw new Error("BrainProvider missing");
  return n;
}
function Va({
  seatId: n,
  label: i,
  icon: r,
  onPatched: o
}) {
  const d = Ot(), h = Yw(), m = d.inventory?.find((N) => N.seat_id === n), [p, f] = v.useState(null), [_, x] = v.useState(!1);
  if (!m) return null;
  const g = rl(d, n, !!m.in_service), y = p ?? !g, w = async () => {
    x(!0);
    try {
      await ld(n, { in_service: y }), await h.refresh(), o?.();
    } finally {
      x(!1), f(null);
    }
  };
  return /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsxs(
      "button",
      {
        type: "button",
        className: `dsc-demand${g ? " is-on" : ""}`,
        onClick: () => f(!g),
        disabled: _,
        title: `${n} in service`,
        children: [
          r ? /* @__PURE__ */ s.jsx(tn, { name: r, size: 22, color: "var(--dsc-teal)", className: "dsc-demand-icon" }) : null,
          /* @__PURE__ */ s.jsx("span", { className: "dsc-demand-label", children: i }),
          /* @__PURE__ */ s.jsx("span", { className: "dsc-demand-state", children: g ? "IN" : "OUT" })
        ]
      }
    ),
    /* @__PURE__ */ s.jsx(
      qe,
      {
        open: p !== null,
        onDismiss: () => f(null),
        onConfirm: () => void w(),
        title: y ? `Put ${i} in service` : `Take ${i} out of service`,
        confirmLabel: y ? "Enable" : "Disable",
        help: null,
        children: /* @__PURE__ */ s.jsx("p", { children: y ? `${i} will count toward kit gates and alerts.` : `${i} will be marked out of service — no fake readings.` })
      }
    )
  ] });
}
const Xw = [
  { label: "OUT", prefix: "dsc_cal_cfm_out", reset: "script.dsc_cal_reset_curve_out" },
  { label: "RECIRC", prefix: "dsc_cal_cfm_recirc", reset: "script.dsc_cal_reset_curve_recirc" },
  { label: "Intake Main", prefix: "dsc_cal_cfm_intake_main", reset: "script.dsc_cal_reset_curve_intake_main" },
  { label: "Intake 2×4", prefix: "dsc_cal_cfm_intake_clone", reset: "script.dsc_cal_reset_curve_intake_clone" }
], O_ = [25, 50, 75, 100];
function Qw() {
  const { entity: n, state: i } = Me(), { callService: r } = Gt(), [o, d] = v.useState(null), h = i("sensor.dsc_learn_status", "—"), m = i("binary_sensor.dsc_learn_gate_open") === "on", p = i("sensor.dsc_learn_activity", "—"), f = String(n("sensor.dsc_cfm_exhaust_out")?.attributes?.cal_curve ?? ""), _ = i("sensor.dsc_cfm_curves_status", "—"), x = i("sensor.dsc_learn_phase_b_status", "—"), g = i("input_boolean.dsc_cal_active") === "on", y = String(n("sensor.dsc_learn_status")?.attributes?.trusted_levers ?? "none");
  return /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsx(ie, { className: "dsc-glass", title: "CFM cal ownership", icon: "learning", children: /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
      /* @__PURE__ */ s.jsx(cl, { to: "/fleet/calibrate", children: "Fleet → Calibrate" }),
      " owns the guided fan CFM session (",
      /* @__PURE__ */ s.jsx("code", { children: "input_number.dsc_cal_*" }),
      ", ",
      /* @__PURE__ */ s.jsx("code", { children: "script.dsc_cal_save_point" }),
      "). This wizard uses the same entities — blur-commit here vs save-point flow there. Pick one surface per session."
    ] }) }),
    /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Anemometer / PPFD cal", icon: "learning", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ s.jsx(z, { label: `Curves ${_}`, tone: _ === "—" ? "muted" : "ok" }),
        /* @__PURE__ */ s.jsx(z, { label: g ? "SESSION ON" : "Session idle", tone: g ? "ok" : "muted" })
      ] }),
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
        "Live airflow numbers are on the Climate page. This wizard records only the readings you enter.",
        f ? ` Curve: ${f}` : ""
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", children: [
        /* @__PURE__ */ s.jsx(ae, { variant: "primary", onClick: () => d("gate"), children: "Open gate" }),
        /* @__PURE__ */ s.jsx(ae, { variant: "secondary", onClick: () => d("sample"), children: "Sample points" }),
        /* @__PURE__ */ s.jsx(ae, { variant: "secondary", onClick: () => d("accept"), children: "Finish session" }),
        /* @__PURE__ */ s.jsx(ae, { variant: "secondary", onClick: () => d("curves"), children: "Stored curves" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Climate learn (Phase A/B)", icon: "learning", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ s.jsx(z, { label: `Status ${h}`, tone: h === "—" ? "muted" : "ok" }),
        /* @__PURE__ */ s.jsx(z, { label: m ? "GATE OPEN" : "GATE CLOSED", tone: m ? "ok" : "warn" }),
        /* @__PURE__ */ s.jsx(z, { label: `Activity ${p}`, tone: "muted" }),
        /* @__PURE__ */ s.jsx(z, { label: `B ${x}`, tone: x === "off" || x === "—" ? "muted" : "ok" }),
        /* @__PURE__ */ s.jsx(z, { label: `Trusted ${y}`, tone: "muted" })
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: "One air appliance runs at a time; fans and the heat mat may stay on. Watch the Activity chip — an open gate does not mean it is measuring yet. Phase B stays off until samples start climbing." }),
      /* @__PURE__ */ s.jsx(ae, { variant: "secondary", onClick: () => d("climate"), children: "Learn enable" })
    ] }),
    /* @__PURE__ */ s.jsxs(
      qe,
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
          /* @__PURE__ */ s.jsx(Fa, { entityId: "input_select.dsc_cal_target", label: "Cal target" }),
          /* @__PURE__ */ s.jsx("p", { className: "dsc-kpi-sub", children: i("input_text.dsc_cal_status", "") })
        ]
      }
    ),
    /* @__PURE__ */ s.jsxs(qe, { open: o === "sample", onDismiss: () => d(null), title: "Sample", help: null, children: [
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
        /* @__PURE__ */ s.jsx(ae, { variant: "secondary", onClick: () => void r("script", "turn_on", { entity_id: "script.dsc_cal_hold_next" }), children: "Re-hold" }),
        /* @__PURE__ */ s.jsx(ae, { variant: "primary", onClick: () => void r("script", "turn_on", { entity_id: "script.dsc_cal_save_point" }), children: "Save point" }),
        /* @__PURE__ */ s.jsx(ae, { variant: "secondary", onClick: () => void r("script", "turn_on", { entity_id: "script.dsc_cal_skip_point" }), children: "Skip" }),
        /* @__PURE__ */ s.jsx(ae, { variant: "danger", onClick: () => void r("script", "turn_on", { entity_id: "script.dsc_cal_abort" }), children: "Abort" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsx(
      qe,
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
          _,
          ". Finishing returns fans and light to their previous settings. Points already saved at 25/50/75/100% are kept."
        ] })
      }
    ),
    /* @__PURE__ */ s.jsxs(
      qe,
      {
        open: o === "climate",
        onDismiss: () => d(null),
        onConfirm: () => d(null),
        title: "Climate learn enable",
        confirmLabel: "Done",
        help: null,
        children: [
          /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Turns learning on or off. Learning pauses automatically during failsafe, manual takeover, or a fault." }),
          /* @__PURE__ */ s.jsx(St, { entityId: "input_boolean.dsc_climate_learn_enabled", label: "Phase A enabled" }),
          /* @__PURE__ */ s.jsx(St, { entityId: "input_boolean.dsc_climate_learn_phase_b_enabled", label: "Phase B enabled" }),
          /* @__PURE__ */ s.jsx(St, { entityId: "input_boolean.dsc_learn_phase_b_locked", label: "Phase B lock" }),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
            /* @__PURE__ */ s.jsx(Je, { entityId: "input_number.dsc_learn_alpha", label: "EMA α" }),
            /* @__PURE__ */ s.jsx(Je, { entityId: "input_number.dsc_learn_min_samples", label: "Min samples" })
          ] }),
          /* @__PURE__ */ s.jsxs("p", { className: "dsc-kpi-sub", children: [
            "Gate ",
            m ? "open" : "closed",
            " · ",
            p,
            " · trusted ",
            y
          ] })
        ]
      }
    ),
    /* @__PURE__ */ s.jsxs(qe, { open: o === "curves", onDismiss: () => d(null), title: "Stored curves", help: null, children: [
      /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: "0 means not measured — the hub then estimates from the fan's rated output. Reset clears a curve back to not-measured; it never guesses." }),
      Xw.map((w) => /* @__PURE__ */ s.jsxs("div", { className: "dsc-cal-curve", children: [
        /* @__PURE__ */ s.jsx("strong", { children: w.label }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-target-grid", children: O_.map((N) => /* @__PURE__ */ s.jsx(
          Je,
          {
            entityId: `input_number.${w.prefix}_${N}`,
            label: `@${N}%`
          },
          `${w.prefix}_${N}`
        )) }),
        /* @__PURE__ */ s.jsxs(
          ae,
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
      /* @__PURE__ */ s.jsx("div", { className: "dsc-target-grid", children: O_.map((w) => /* @__PURE__ */ s.jsx(Je, { entityId: `input_number.dsc_cal_ppfd_${w}`, label: `@${w}%` }, `ppfd_${w}`)) }),
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
function Pw() {
  const { available: n, num: i, state: r } = Me(), o = r("input_boolean.dsc_tank_in_service") === "on", d = n("input_number.dsc_tank_level_pct") || n("sensor.dsc_tank_level_pct"), h = n("sensor.dsc_tank_level_pct") ? i("sensor.dsc_tank_level_pct") : i("input_number.dsc_tank_level_pct"), m = d && Number.isFinite(h), p = n("sensor.dsc_tank_ec_normalized"), f = n("sensor.dsc_tank_ph_calibrated"), _ = n("sensor.water_tester_temperature"), x = r("input_boolean.dsc_tank_pump_active") === "on", g = m ? Math.max(4, Math.min(100, h)) : 0;
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-tank-cutaway", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ s.jsx(z, { label: o ? "In service" : "Out of service", tone: o ? "ok" : "warn" }),
      m ? null : /* @__PURE__ */ s.jsx(z, { label: "Level not measured", tone: "warn" }),
      x ? /* @__PURE__ */ s.jsx(z, { label: "Pump ON", tone: "ok", pulse: !0 }) : /* @__PURE__ */ s.jsx(z, { label: "Pump off", tone: "muted" })
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
          y: 26 + 176 * (1 - g / 100),
          width: "124",
          height: 176 * g / 100,
          fill: "rgba(38,198,218,0.22)"
        }
      ) : null,
      p ? /* @__PURE__ */ s.jsx("rect", { x: "32", y: "36", width: "116", height: "10", fill: "rgba(255,183,77,0.55)" }) : null,
      /* @__PURE__ */ s.jsx("rect", { x: "24", y: "18", width: "132", height: "12", fill: "none", stroke: f ? "var(--dsc-purple)" : "var(--dsc-gray-5)", strokeWidth: "3" }),
      x ? [0, 1, 2].map((y) => /* @__PURE__ */ s.jsx("circle", { cx: 90 + (y - 1) * 18, cy: "188", r: "4", fill: "var(--dsc-teal)", opacity: 0.5 + y * 0.15 }, y)) : null
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-kpi-sub", children: [
      "EC ",
      p ? `${Math.round(i("sensor.dsc_tank_ec_normalized"))} µS` : "—",
      " · pH",
      " ",
      f ? i("sensor.dsc_tank_ph_calibrated").toFixed(2) : "—",
      " · T",
      " ",
      _ ? `${i("sensor.water_tester_temperature").toFixed(1)} °C` : "—"
    ] })
  ] });
}
const z_ = ["var(--dsc-blue)", "var(--dsc-teal)", "var(--dsc-purple)", "var(--dsc-amber)"];
function Zw() {
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      zt,
      {
        icon: "learning",
        title: "Learning",
        subtitle: "Measure fan output, review the sample, then accept it into the curve."
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(Qw, {}) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(ie, { className: "dsc-glass", title: "Kit / In service", icon: "settings", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-row", children: [
        /* @__PURE__ */ s.jsx(Va, { seatId: "pot1", label: "Pot 1", icon: "root" }),
        /* @__PURE__ */ s.jsx(Va, { seatId: "pot2", label: "Pot 2", icon: "root" }),
        /* @__PURE__ */ s.jsx(Va, { seatId: "pot3", label: "Pot 3", icon: "root" }),
        /* @__PURE__ */ s.jsx(Va, { seatId: "pot4", label: "Pot 4", icon: "root" })
      ] }) }) })
    ] })
  ] });
}
function Kw() {
  const { state: n } = Me(), { hours: i, setHours: r, maxPoints: o } = ml(6), d = Ne("sensor.dsc_hub_tent_temperature", { maxPoints: o, hours: i }), h = Ne("sensor.dsc_hub_tent_humidity", { maxPoints: o, hours: i }), m = Ne(Sn(1, "moisture", n), { maxPoints: o, hours: i }), p = Ne(Sn(2, "moisture", n), { maxPoints: o, hours: i }), f = Ne(Sn(3, "moisture", n), { maxPoints: o, hours: i }), _ = Ne(Sn(4, "moisture", n), { maxPoints: o, hours: i }), g = [
    { n: 1, series: m },
    { n: 2, series: p },
    { n: 3, series: f },
    { n: 4, series: _ }
  ].filter((w) => nn(w.n, n)), y = ca.filter((w) => nn(w, n)).map((w) => ({ n: w, need: n(`sensor.dsc_pot${w}_need_summary`, "—") })).find((w) => w.need && w.need !== "—" && !/^ok$/i.test(w.need));
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      zt,
      {
        icon: "analytics",
        title: "Analytics",
        subtitle: "In-service pots. Climate charts live on Climate; this is the root pack."
      }
    ),
    /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: /* @__PURE__ */ s.jsx(
      pl,
      {
        hours: i,
        setHours: r,
        extras: fl
      }
    ) }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Tent T + RH (secondary)", icon: "climate", children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "The full climate charts live on the Climate page." }),
        /* @__PURE__ */ s.jsx(
          Tn,
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
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Root pack — moisture (in service)", icon: "root", children: [
        g.length ? /* @__PURE__ */ s.jsx(
          Tn,
          {
            live: !0,
            unit: "%",
            lastSyncAt: Math.max(...g.map((w) => w.series.lastSyncAt ?? 0)) || void 0,
            series: g.map((w, N) => ({
              id: `p${w.n}`,
              label: y?.n === w.n ? `P${w.n} Need` : `P${w.n}`,
              series: w.series.series,
              color: z_[N % z_.length],
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
function Jw() {
  const { state: n, available: i, num: r } = Me(), o = Ot(), d = Bn(), h = Hd(o), m = $d(h), p = bt("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available: i,
    num: r
  }), f = (_) => d.open({
    entityId: _.entityId,
    label: _.label,
    kind: "kit",
    runtimeToday: _.runtimeToday,
    cyclesToday: _.cyclesToday,
    demandEntity: _.demandEntity
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      zt,
      {
        icon: "fleet",
        title: "Fleet",
        subtitle: `${m.inService} of ${m.total} devices in service. Device health, tank, and service toggles.`
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(Ld, {}) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(
        At,
        {
          label: "In service",
          value: `${m.inService}/${m.total}`,
          tone: m.dark > 0 ? "bad" : "ok"
        }
      ) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(
        At,
        {
          label: "Surface",
          value: o.surface || n("sensor.dsc_ha_surface_version", "7.2.0"),
          sub: "Panel product shell"
        }
      ) }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-col-4", children: [
        /* @__PURE__ */ s.jsx(
          At,
          {
            label: "Alerts",
            value: Number.isFinite(r("sensor.dsc_active_alert_count")) ? r("sensor.dsc_active_alert_count") : "—",
            tone: r("sensor.dsc_active_alert_count", 0) === 0 ? "ok" : "bad"
          }
        ),
        /* @__PURE__ */ s.jsx(wo, { readings: [p] })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Kit Pulse", icon: "system", children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Grey = offline or out of service. Every device shows its real state." }),
        /* @__PURE__ */ s.jsx(Bd, { nodes: h, onSelect: f })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Kit / In service", icon: "settings", children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "Inventory gates only — wired to Settings inventory PATCH, not dead input_boolean helpers." }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-row", children: [
          /* @__PURE__ */ s.jsx(Va, { seatId: "pot1", label: "Pot 1", icon: "root" }),
          /* @__PURE__ */ s.jsx(Va, { seatId: "pot2", label: "Pot 2", icon: "root" }),
          /* @__PURE__ */ s.jsx(Va, { seatId: "pot3", label: "Pot 3", icon: "root" }),
          /* @__PURE__ */ s.jsx(Va, { seatId: "pot4", label: "Pot 4", icon: "root" })
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Tank", icon: "tank", children: [
        /* @__PURE__ */ s.jsx(Pw, {}),
        /* @__PURE__ */ s.jsxs("p", { className: "dsc-kpi-sub", children: [
          "Stage ",
          n("input_select.dsc_tank_stage", "—"),
          " · Type",
          " ",
          n("input_select.dsc_tank_plant_type", "—")
        ] })
      ] }) })
    ] })
  ] });
}
const Gd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  FleetOverviewPage: Jw,
  TuneAnalyticsPage: Kw,
  TuneLearningPage: Zw
}, Symbol.toStringTag, { value: "Module" })), D_ = [
  { id: "out", label: "OUT exhaust", prefix: "dsc_cal_cfm_out", select: "OUT" },
  { id: "recirc", label: "RECIRC", prefix: "dsc_cal_cfm_recirc", select: "RECIRC" },
  { id: "intake_main", label: "Intake 4×8", prefix: "dsc_cal_cfm_intake_main", select: "Intake Main" },
  { id: "intake_clone", label: "Intake 2×4", prefix: "dsc_cal_cfm_intake_clone", select: "Intake 2×4" }
], La = [25, 50, 75, 100], fs = [
  { key: "25", pct: 25, label: "25% dim" },
  { key: "50", pct: 50, label: "50% dim" },
  { key: "75", pct: 75, label: "75% dim" },
  { key: "100", pct: 100, label: "100% dim" }
];
function Iw() {
  const { state: n, num: i } = Me(), { callService: r } = Gt(), [o, d] = v.useState("pick"), [h, m] = v.useState(0), [p, f] = v.useState(0), [_, x] = v.useState(""), [g, y] = v.useState(!1), [w, N] = v.useState(""), [T, E] = v.useState(!1), M = D_[h], C = La[p], U = n("input_boolean.dsc_cal_active") === "on", G = n("sensor.dsc_cfm_curves_status", "—"), X = v.useCallback(() => {
    d("pick"), m(0), f(0), x(""), N("");
  }, []);
  v.useEffect(() => {
  }, [U, o, p, g]);
  const L = async () => {
    y(!0), N("Starting cal session…");
    try {
      await r("input_select", "select_option", {
        entity_id: "input_select.dsc_cal_target",
        option: M.select
      }), await r("script", "turn_on", { entity_id: "script.dsc_cal_start" }), d("session"), f(0), x(""), N(`Hold fan at ${La[0]}% — enter anemometer m/s.`);
    } catch (se) {
      N(se instanceof Error ? se.message : "Start failed");
    } finally {
      y(!1);
    }
  }, V = async () => {
    const se = Number(_);
    if (!Number.isFinite(se) || se <= 0) {
      N("Enter a valid m/s reading, or skip this step.");
      return;
    }
    y(!0), N(`Saving @${C}%…`);
    try {
      await r("input_number", "set_value", {
        entity_id: "input_number.dsc_cal_step_pct",
        value: C
      }), await r("input_number", "set_value", {
        entity_id: "input_number.dsc_cal_reading_ms",
        value: se
      }), await r("script", "turn_on", { entity_id: "script.dsc_cal_save_point" }), await r("input_number", "set_value", {
        entity_id: `input_number.${M.prefix}_${C}`,
        value: se
      }), await db(M.prefix, "fan_cfm", [
        { step_key: String(C), measured_value: se, unit: "m/s" }
      ]);
      const ce = p + 1;
      ce >= La.length ? (await r("script", "turn_on", { entity_id: "script.dsc_cal_finish" }), d("done"), N(`Curve points saved for ${M.label}. Status: ${G}`)) : (f(ce), x(""), N(`Point @${C}% saved. Hold fan at ${La[ce]}% and measure.`), await r("script", "turn_on", { entity_id: "script.dsc_cal_hold_next" }));
    } catch (ce) {
      N(ce instanceof Error ? ce.message : "Save failed");
    } finally {
      y(!1);
    }
  }, te = async () => {
    y(!0);
    try {
      await r("script", "turn_on", { entity_id: "script.dsc_cal_skip_point" });
      const se = p + 1;
      se >= La.length ? (await r("script", "turn_on", { entity_id: "script.dsc_cal_finish" }), d("done"), N("Session finished (skipped remaining).")) : (f(se), x(""), N(`Skipped @${C}%. Next: ${La[se]}%.`));
    } finally {
      y(!1);
    }
  }, re = async () => {
    y(!0);
    try {
      await r("script", "turn_on", { entity_id: "script.dsc_cal_abort" }), X(), N("Session aborted — fans restored.");
    } finally {
      y(!1);
    }
  };
  return /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-status-strip", children: [
      /* @__PURE__ */ s.jsx(z, { label: `Curves ${G}`, tone: G === "all_curves" ? "ok" : "warn" }),
      /* @__PURE__ */ s.jsx(z, { label: U ? "SESSION ON" : "Session idle", tone: U ? "ok" : "muted" }),
      o === "session" ? /* @__PURE__ */ s.jsx(z, { label: `Step ${p + 1}/${La.length} · ${C}%`, tone: "ok", pulse: !0 }) : null
    ] }),
    o === "pick" ? /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "1 · Select duct", icon: "fan", children: [
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Hold the anemometer at the centre of the duct at each fan step. At least two measured points per duct are needed before real curves replace the rated estimate." }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", style: { margin: "12px 0" }, children: D_.map((se, ce) => /* @__PURE__ */ s.jsx(
        "button",
        {
          type: "button",
          className: `dsc-chip${h === ce ? " dsc-chip--ok" : ""}`,
          onClick: () => m(ce),
          children: se.label
        },
        se.id
      )) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-row-actions", children: /* @__PURE__ */ s.jsxs(ae, { variant: "primary", disabled: g, onClick: () => E(!0), children: [
        "Start ",
        M.label,
        " session"
      ] }) }),
      /* @__PURE__ */ s.jsx(
        qe,
        {
          open: T,
          onDismiss: () => E(!1),
          onConfirm: () => {
            E(!1), L();
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
    o === "session" ? /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: `2 · Sample ${M.label} @ ${C}%`, icon: "gauge", children: [
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
            value: _,
            onChange: (se) => x(se.target.value),
            placeholder: i("input_number.dsc_cal_reading_ms", 0) > 0 ? String(i("input_number.dsc_cal_reading_ms")) : "e.g. 3.2"
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-kpi-sub", children: [
        "Saved to the ",
        M.label,
        " curve at ",
        C,
        "%."
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-stage-track", children: La.map((se, ce) => /* @__PURE__ */ s.jsxs("span", { className: `dsc-stage-pill${ce === p ? " is-on" : ce > p ? "" : " is-next"}`, children: [
        se,
        "%"
      ] }, se)) }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", children: [
        /* @__PURE__ */ s.jsxs(ae, { variant: "primary", disabled: g, onClick: () => void V(), children: [
          "Save @ ",
          C,
          "%"
        ] }),
        /* @__PURE__ */ s.jsx(ae, { variant: "secondary", disabled: g, onClick: () => void te(), children: "Skip step" }),
        /* @__PURE__ */ s.jsx(ae, { variant: "danger", disabled: g, onClick: () => void re(), children: "Abort" })
      ] })
    ] }) : null,
    o === "done" ? /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "3 · Done", icon: "ok", children: [
      /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: w || "Session complete." }),
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", children: [
        "Curve status: ",
        G,
        ". The Climate page uses this curve for its airflow numbers."
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-row-actions", children: /* @__PURE__ */ s.jsx(ae, { variant: "primary", onClick: X, children: "Calibrate another duct" }) })
    ] }) : null,
    w && o !== "done" ? /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: w }) : null
  ] });
}
function Ww() {
  const { callService: n } = Gt(), [i, r] = v.useState(0), [o, d] = v.useState(""), [h, m] = v.useState(""), [p, f] = v.useState("45"), [_, x] = v.useState(!1), [g, y] = v.useState(""), [w, N] = v.useState(!1), [T, E] = v.useState(!1), M = fs[i], C = async (X) => {
    await n("light", "turn_on", {
      entity_id: "light.dsc_hub_sf1000_dimmer",
      brightness_pct: X
    });
  }, U = async () => {
    const X = Number(o), L = Number(h);
    if (!Number.isFinite(X) || X <= 0) {
      y("Enter the LUX reading at sensor height.");
      return;
    }
    x(!0);
    try {
      await C(M.pct), await db("sf1000", "light_par", [
        { step_key: `${M.key}_lux`, measured_value: X, unit: "lux" },
        ...Number.isFinite(L) && L > 0 ? [{ step_key: `${M.key}_par`, measured_value: L, unit: "µmol/m²/s" }] : [],
        { step_key: `${M.key}_height_cm`, measured_value: Number(p) || 0, unit: "cm" }
      ]);
      const V = i + 1;
      V >= fs.length ? (N(!0), y("Light response curve saved to brain — used for effective-off threshold."), await n("light", "turn_off", { entity_id: "light.dsc_hub_sf1000_dimmer" })) : (r(V), d(""), m(""), y(`Saved ${M.label}. Set fixture to ${fs[V].label} and measure.`), await C(fs[V].pct));
    } catch (V) {
      y(V instanceof Error ? V.message : "Save failed");
    } finally {
      x(!1);
    }
  }, G = async () => {
    x(!0);
    try {
      N(!1), r(0), d(""), m(""), await C(fs[0].pct), y(`Fixture at ${fs[0].label}. Measure LUX/PAR at canopy height.`);
    } finally {
      x(!1);
    }
  };
  return w ? /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Light curve saved", icon: "ok", children: [
    /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: g }),
    /* @__PURE__ */ s.jsx(ae, { variant: "secondary", onClick: () => E(!0), children: "Re-run light wizard" })
  ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "SF1000 brightness response", icon: "lighting", children: [
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "At fixed canopy height, ramp SF1000 25→100%. Enter meter readings at each step. PAR optional if meter supports it." }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "Sensor height (cm)",
        /* @__PURE__ */ s.jsx("input", { type: "number", min: "1", value: p, onChange: (X) => f(X.target.value) })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-stage-track", style: { margin: "12px 0" }, children: fs.map((X, L) => /* @__PURE__ */ s.jsx("span", { className: `dsc-stage-pill${L === i ? " is-on" : L > i ? "" : " is-next"}`, children: X.label }, X.key)) }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "LUX @ ",
        M.label,
        /* @__PURE__ */ s.jsx("input", { type: "number", min: "0", value: o, onChange: (X) => d(X.target.value) })
      ] }),
      /* @__PURE__ */ s.jsxs("label", { children: [
        "PAR µmol/m²/s (optional)",
        /* @__PURE__ */ s.jsx("input", { type: "number", min: "0", value: h, onChange: (X) => m(X.target.value) })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-row-actions", children: i === 0 && !g ? /* @__PURE__ */ s.jsx(ae, { variant: "primary", disabled: _, onClick: () => E(!0), children: "Start light wizard" }) : /* @__PURE__ */ s.jsxs(ae, { variant: "primary", disabled: _, onClick: () => void U(), children: [
        "Save ",
        M.label
      ] }) })
    ] }),
    /* @__PURE__ */ s.jsx(
      qe,
      {
        open: T,
        onDismiss: () => E(!1),
        onConfirm: () => {
          E(!1), G();
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
function e2() {
  const { state: n } = Me(), i = n("sensor.dsc_tank_ec_normalized", "—"), r = n("sensor.dsc_tank_ph_calibrated", "—");
  return /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Tank EC / pH bias (N-023)", icon: "learning", children: [
    /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: "Raw Water Tester readings pass through a unit multiplier and additive bias before stage-band checks. Adjust bias after a probe rinse and a known reference sample — not to chase a drifting probe." }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-col-6", children: [
        /* @__PURE__ */ s.jsx(Je, { entityId: "input_number.dsc_tank_ec_multiplier", label: "EC unit multiplier (1 or 1000)", step: 999 }),
        /* @__PURE__ */ s.jsx(Je, { entityId: "input_number.dsc_tank_ec_bias", label: "EC bias µS/cm", step: 1 })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(Je, { entityId: "input_number.dsc_tank_ph_bias", label: "pH bias", step: 0.01 }) })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
      /* @__PURE__ */ s.jsx(z, { label: `Normalized EC ${i} µS/cm`, tone: i === "—" ? "muted" : "ok" }),
      /* @__PURE__ */ s.jsx(z, { label: `Calibrated pH ${r}`, tone: r === "—" ? "muted" : "ok" })
    ] })
  ] });
}
function t2() {
  const { callService: n } = Gt(), [i, r] = v.useState(!1), [o, d] = v.useState(""), [h, m] = v.useState(""), [p, f] = v.useState(!1), [_, x] = v.useState(!1), g = async () => {
    x(!0), d("Running peer median capture…");
    try {
      await n("script", "turn_on", { entity_id: "script.dsc_pots_capture_peer_baseline" }), d("Capture script triggered — check Root / Strains for updated offsets.");
    } catch (w) {
      d(w instanceof Error ? w.message : "Capture failed");
    } finally {
      x(!1);
    }
  }, y = async () => {
    x(!0), m("Pushing peer offsets to ESP…");
    try {
      await n("script", "turn_on", { entity_id: "script.dsc_pots_push_peer_offsets_to_esp" }), m("Push script triggered — verify dual-stack clears on pots.");
    } catch (w) {
      m(w instanceof Error ? w.message : "Push failed");
    } finally {
      x(!1), f(!1);
    }
  };
  return /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Soil test wizard", icon: "root", children: [
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Confirmed mobile-probe snapshots for roster plants — separate from peer median calibration below." }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-row-actions", children: /* @__PURE__ */ s.jsx(ae, { variant: "primary", onClick: () => r((w) => !w), children: i ? "Hide wizard" : "Open soil test wizard" }) }),
      i ? /* @__PURE__ */ s.jsx(Fd, { compact: !0 }) : null
    ] }),
    /* @__PURE__ */ s.jsxs(ie, { className: "dsc-glass", title: "Soil cal — peer median vs lab buffer (N-016)", icon: "learning", children: [
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
        /* @__PURE__ */ s.jsx("strong", { children: "Peer median" }),
        " aligns in-service pots to the fleet median. Fast for relative drift and mat vote coherence — but it is ",
        /* @__PURE__ */ s.jsx("em", { children: "not" }),
        " lab truth. Use Mark Peer Median on Root Zone when probes agree directionally but one pot is an outlier."
      ] }),
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
        /* @__PURE__ */ s.jsx("strong", { children: "Lab buffer (lab wet)" }),
        " stamps a single channel with a known buffer solution on the pot ESP. After lab wet, treat that channel as buffer-calibrated until Reset. Peer median does not substitute for a wet cal pass — see ",
        /* @__PURE__ */ s.jsx("code", { children: "docs/LAB-WET-CAL.md" }),
        " for the operator procedure."
      ] }),
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
        "Fan CFM and light PAR sessions on this page own ",
        /* @__PURE__ */ s.jsx("code", { children: "input_number.dsc_cal_*" }),
        " and",
        " ",
        /* @__PURE__ */ s.jsx("code", { children: "script.dsc_cal_*" }),
        ". Tune → Learning shares those entities with a different commit model (blur vs guided save-point)."
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", children: [
        /* @__PURE__ */ s.jsx(ae, { variant: "secondary", disabled: _, onClick: () => void g(), children: "Capture peer median" }),
        /* @__PURE__ */ s.jsx(ae, { variant: "danger", disabled: _, onClick: () => f(!0), children: "Push offsets to ESP" })
      ] }),
      o ? /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: o }) : null,
      h ? /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: h }) : null,
      /* @__PURE__ */ s.jsx(
        qe,
        {
          open: p,
          onDismiss: () => f(!1),
          onConfirm: () => void y(),
          title: "Push peer offsets to ESP",
          confirmLabel: "Push to ESP",
          help: null,
          children: /* @__PURE__ */ s.jsx("p", { children: "Merges HA peer offsets into each pot's ESP Cal Offset and clears HA offsets. Refuses if scale ≠ 1 unless forced in HA." })
        }
      )
    ] })
  ] });
}
function n2() {
  const [n, i] = v.useState("fan");
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      zt,
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
          className: `dsc-chip${n === "fan" ? " dsc-chip--ok" : ""}`,
          onClick: () => i("fan"),
          children: "Fan CFM"
        }
      ),
      /* @__PURE__ */ s.jsx(
        "button",
        {
          type: "button",
          className: `dsc-chip${n === "light" ? " dsc-chip--ok" : ""}`,
          onClick: () => i("light"),
          children: "Light PAR/LUX"
        }
      ),
      /* @__PURE__ */ s.jsx(
        "button",
        {
          type: "button",
          className: `dsc-chip${n === "tank" ? " dsc-chip--ok" : ""}`,
          onClick: () => i("tank"),
          children: "Tank bias"
        }
      ),
      /* @__PURE__ */ s.jsx(
        "button",
        {
          type: "button",
          className: `dsc-chip${n === "soil" ? " dsc-chip--ok" : ""}`,
          onClick: () => i("soil"),
          children: "Soil cal"
        }
      )
    ] }),
    n === "fan" ? /* @__PURE__ */ s.jsx(Iw, {}) : null,
    n === "light" ? /* @__PURE__ */ s.jsx(Ww, {}) : null,
    n === "tank" ? /* @__PURE__ */ s.jsx(e2, {}) : null,
    n === "soil" ? /* @__PURE__ */ s.jsx(t2, {}) : null
  ] });
}
const a2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CalibratePage: n2
}, Symbol.toStringTag, { value: "Module" }));
export {
  Vw as default
};
//# sourceMappingURL=dsc-hub-panel.js.map
