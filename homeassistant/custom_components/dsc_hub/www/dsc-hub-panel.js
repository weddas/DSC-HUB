var Rx = Object.defineProperty;
var zx = (l, c, u) => c in l ? Rx(l, c, { enumerable: !0, configurable: !0, writable: !0, value: u }) : l[c] = u;
var sc = (l, c, u) => zx(l, typeof c != "symbol" ? c + "" : c, u);
var Io = { exports: {} }, Ms = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Dm;
function Ox() {
  if (Dm) return Ms;
  Dm = 1;
  var l = Symbol.for("react.transitional.element"), c = Symbol.for("react.fragment");
  function u(o, d, f) {
    var m = null;
    if (f !== void 0 && (m = "" + f), d.key !== void 0 && (m = "" + d.key), "key" in d) {
      f = {};
      for (var g in d)
        g !== "key" && (f[g] = d[g]);
    } else f = d;
    return d = f.ref, {
      $$typeof: l,
      type: o,
      key: m,
      ref: d !== void 0 ? d : null,
      props: f
    };
  }
  return Ms.Fragment = c, Ms.jsx = u, Ms.jsxs = u, Ms;
}
var Hm;
function Dx() {
  return Hm || (Hm = 1, Io.exports = Ox()), Io.exports;
}
var s = Dx(), eu = { exports: {} }, be = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Lm;
function Hx() {
  if (Lm) return be;
  Lm = 1;
  var l = Symbol.for("react.transitional.element"), c = Symbol.for("react.portal"), u = Symbol.for("react.fragment"), o = Symbol.for("react.strict_mode"), d = Symbol.for("react.profiler"), f = Symbol.for("react.consumer"), m = Symbol.for("react.context"), g = Symbol.for("react.forward_ref"), p = Symbol.for("react.suspense"), v = Symbol.for("react.memo"), b = Symbol.for("react.lazy"), x = Symbol.for("react.activity"), w = Symbol.iterator;
  function j(N) {
    return N === null || typeof N != "object" ? null : (N = w && N[w] || N["@@iterator"], typeof N == "function" ? N : null);
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
  }, T = Object.assign, k = {};
  function E(N, $, ee) {
    this.props = N, this.context = $, this.refs = k, this.updater = ee || M;
  }
  E.prototype.isReactComponent = {}, E.prototype.setState = function(N, $) {
    if (typeof N != "object" && typeof N != "function" && N != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, N, $, "setState");
  }, E.prototype.forceUpdate = function(N) {
    this.updater.enqueueForceUpdate(this, N, "forceUpdate");
  };
  function U() {
  }
  U.prototype = E.prototype;
  function Y(N, $, ee) {
    this.props = N, this.context = $, this.refs = k, this.updater = ee || M;
  }
  var P = Y.prototype = new U();
  P.constructor = Y, T(P, E.prototype), P.isPureReactComponent = !0;
  var Z = Array.isArray;
  function G() {
  }
  var Q = { H: null, A: null, T: null, S: null }, te = Object.prototype.hasOwnProperty;
  function ae(N, $, ee) {
    var ne = ee.ref;
    return {
      $$typeof: l,
      type: N,
      key: $,
      ref: ne !== void 0 ? ne : null,
      props: ee
    };
  }
  function xe(N, $) {
    return ae(N.type, $, N.props);
  }
  function z(N) {
    return typeof N == "object" && N !== null && N.$$typeof === l;
  }
  function W(N) {
    var $ = { "=": "=0", ":": "=2" };
    return "$" + N.replace(/[=:]/g, function(ee) {
      return $[ee];
    });
  }
  var se = /\/+/g;
  function K(N, $) {
    return typeof N == "object" && N !== null && N.key != null ? W("" + N.key) : $.toString(36);
  }
  function J(N) {
    switch (N.status) {
      case "fulfilled":
        return N.value;
      case "rejected":
        throw N.reason;
      default:
        switch (typeof N.status == "string" ? N.then(G, G) : (N.status = "pending", N.then(
          function($) {
            N.status === "pending" && (N.status = "fulfilled", N.value = $);
          },
          function($) {
            N.status === "pending" && (N.status = "rejected", N.reason = $);
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
  function A(N, $, ee, ne, re) {
    var ge = typeof N;
    (ge === "undefined" || ge === "boolean") && (N = null);
    var _e = !1;
    if (N === null) _e = !0;
    else
      switch (ge) {
        case "bigint":
        case "string":
        case "number":
          _e = !0;
          break;
        case "object":
          switch (N.$$typeof) {
            case l:
            case c:
              _e = !0;
              break;
            case b:
              return _e = N._init, A(
                _e(N._payload),
                $,
                ee,
                ne,
                re
              );
          }
      }
    if (_e)
      return re = re(N), _e = ne === "" ? "." + K(N, 0) : ne, Z(re) ? (ee = "", _e != null && (ee = _e.replace(se, "$&/") + "/"), A(re, $, ee, "", function(it) {
        return it;
      })) : re != null && (z(re) && (re = xe(
        re,
        ee + (re.key == null || N && N.key === re.key ? "" : ("" + re.key).replace(
          se,
          "$&/"
        ) + "/") + _e
      )), $.push(re)), 1;
    _e = 0;
    var de = ne === "" ? "." : ne + ":";
    if (Z(N))
      for (var we = 0; we < N.length; we++)
        ne = N[we], ge = de + K(ne, we), _e += A(
          ne,
          $,
          ee,
          ge,
          re
        );
    else if (we = j(N), typeof we == "function")
      for (N = we.call(N), we = 0; !(ne = N.next()).done; )
        ne = ne.value, ge = de + K(ne, we++), _e += A(
          ne,
          $,
          ee,
          ge,
          re
        );
    else if (ge === "object") {
      if (typeof N.then == "function")
        return A(
          J(N),
          $,
          ee,
          ne,
          re
        );
      throw $ = String(N), Error(
        "Objects are not valid as a React child (found: " + ($ === "[object Object]" ? "object with keys {" + Object.keys(N).join(", ") + "}" : $) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return _e;
  }
  function H(N, $, ee) {
    if (N == null) return N;
    var ne = [], re = 0;
    return A(N, ne, "", "", function(ge) {
      return $.call(ee, ge, re++);
    }), ne;
  }
  function I(N) {
    if (N._status === -1) {
      var $ = N._result;
      $ = $(), $.then(
        function(ee) {
          (N._status === 0 || N._status === -1) && (N._status = 1, N._result = ee);
        },
        function(ee) {
          (N._status === 0 || N._status === -1) && (N._status = 2, N._result = ee);
        }
      ), N._status === -1 && (N._status = 0, N._result = $);
    }
    if (N._status === 1) return N._result.default;
    throw N._result;
  }
  var ve = typeof reportError == "function" ? reportError : function(N) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var $ = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof N == "object" && N !== null && typeof N.message == "string" ? String(N.message) : String(N),
        error: N
      });
      if (!window.dispatchEvent($)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", N);
      return;
    }
    console.error(N);
  }, pe = {
    map: H,
    forEach: function(N, $, ee) {
      H(
        N,
        function() {
          $.apply(this, arguments);
        },
        ee
      );
    },
    count: function(N) {
      var $ = 0;
      return H(N, function() {
        $++;
      }), $;
    },
    toArray: function(N) {
      return H(N, function($) {
        return $;
      }) || [];
    },
    only: function(N) {
      if (!z(N))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return N;
    }
  };
  return be.Activity = x, be.Children = pe, be.Component = E, be.Fragment = u, be.Profiler = d, be.PureComponent = Y, be.StrictMode = o, be.Suspense = p, be.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Q, be.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(N) {
      return Q.H.useMemoCache(N);
    }
  }, be.cache = function(N) {
    return function() {
      return N.apply(null, arguments);
    };
  }, be.cacheSignal = function() {
    return null;
  }, be.cloneElement = function(N, $, ee) {
    if (N == null)
      throw Error(
        "The argument must be a React element, but you passed " + N + "."
      );
    var ne = T({}, N.props), re = N.key;
    if ($ != null)
      for (ge in $.key !== void 0 && (re = "" + $.key), $)
        !te.call($, ge) || ge === "key" || ge === "__self" || ge === "__source" || ge === "ref" && $.ref === void 0 || (ne[ge] = $[ge]);
    var ge = arguments.length - 2;
    if (ge === 1) ne.children = ee;
    else if (1 < ge) {
      for (var _e = Array(ge), de = 0; de < ge; de++)
        _e[de] = arguments[de + 2];
      ne.children = _e;
    }
    return ae(N.type, re, ne);
  }, be.createContext = function(N) {
    return N = {
      $$typeof: m,
      _currentValue: N,
      _currentValue2: N,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, N.Provider = N, N.Consumer = {
      $$typeof: f,
      _context: N
    }, N;
  }, be.createElement = function(N, $, ee) {
    var ne, re = {}, ge = null;
    if ($ != null)
      for (ne in $.key !== void 0 && (ge = "" + $.key), $)
        te.call($, ne) && ne !== "key" && ne !== "__self" && ne !== "__source" && (re[ne] = $[ne]);
    var _e = arguments.length - 2;
    if (_e === 1) re.children = ee;
    else if (1 < _e) {
      for (var de = Array(_e), we = 0; we < _e; we++)
        de[we] = arguments[we + 2];
      re.children = de;
    }
    if (N && N.defaultProps)
      for (ne in _e = N.defaultProps, _e)
        re[ne] === void 0 && (re[ne] = _e[ne]);
    return ae(N, ge, re);
  }, be.createRef = function() {
    return { current: null };
  }, be.forwardRef = function(N) {
    return { $$typeof: g, render: N };
  }, be.isValidElement = z, be.lazy = function(N) {
    return {
      $$typeof: b,
      _payload: { _status: -1, _result: N },
      _init: I
    };
  }, be.memo = function(N, $) {
    return {
      $$typeof: v,
      type: N,
      compare: $ === void 0 ? null : $
    };
  }, be.startTransition = function(N) {
    var $ = Q.T, ee = {};
    Q.T = ee;
    try {
      var ne = N(), re = Q.S;
      re !== null && re(ee, ne), typeof ne == "object" && ne !== null && typeof ne.then == "function" && ne.then(G, ve);
    } catch (ge) {
      ve(ge);
    } finally {
      $ !== null && ee.types !== null && ($.types = ee.types), Q.T = $;
    }
  }, be.unstable_useCacheRefresh = function() {
    return Q.H.useCacheRefresh();
  }, be.use = function(N) {
    return Q.H.use(N);
  }, be.useActionState = function(N, $, ee) {
    return Q.H.useActionState(N, $, ee);
  }, be.useCallback = function(N, $) {
    return Q.H.useCallback(N, $);
  }, be.useContext = function(N) {
    return Q.H.useContext(N);
  }, be.useDebugValue = function() {
  }, be.useDeferredValue = function(N, $) {
    return Q.H.useDeferredValue(N, $);
  }, be.useEffect = function(N, $) {
    return Q.H.useEffect(N, $);
  }, be.useEffectEvent = function(N) {
    return Q.H.useEffectEvent(N);
  }, be.useId = function() {
    return Q.H.useId();
  }, be.useImperativeHandle = function(N, $, ee) {
    return Q.H.useImperativeHandle(N, $, ee);
  }, be.useInsertionEffect = function(N, $) {
    return Q.H.useInsertionEffect(N, $);
  }, be.useLayoutEffect = function(N, $) {
    return Q.H.useLayoutEffect(N, $);
  }, be.useMemo = function(N, $) {
    return Q.H.useMemo(N, $);
  }, be.useOptimistic = function(N, $) {
    return Q.H.useOptimistic(N, $);
  }, be.useReducer = function(N, $, ee) {
    return Q.H.useReducer(N, $, ee);
  }, be.useRef = function(N) {
    return Q.H.useRef(N);
  }, be.useState = function(N) {
    return Q.H.useState(N);
  }, be.useSyncExternalStore = function(N, $, ee) {
    return Q.H.useSyncExternalStore(
      N,
      $,
      ee
    );
  }, be.useTransition = function() {
    return Q.H.useTransition();
  }, be.version = "19.2.8", be;
}
var Um;
function wu() {
  return Um || (Um = 1, eu.exports = Hx()), eu.exports;
}
var y = wu(), tu = { exports: {} }, Cs = {}, nu = { exports: {} }, au = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Bm;
function Lx() {
  return Bm || (Bm = 1, (function(l) {
    function c(A, H) {
      var I = A.length;
      A.push(H);
      e: for (; 0 < I; ) {
        var ve = I - 1 >>> 1, pe = A[ve];
        if (0 < d(pe, H))
          A[ve] = H, A[I] = pe, I = ve;
        else break e;
      }
    }
    function u(A) {
      return A.length === 0 ? null : A[0];
    }
    function o(A) {
      if (A.length === 0) return null;
      var H = A[0], I = A.pop();
      if (I !== H) {
        A[0] = I;
        e: for (var ve = 0, pe = A.length, N = pe >>> 1; ve < N; ) {
          var $ = 2 * (ve + 1) - 1, ee = A[$], ne = $ + 1, re = A[ne];
          if (0 > d(ee, I))
            ne < pe && 0 > d(re, ee) ? (A[ve] = re, A[ne] = I, ve = ne) : (A[ve] = ee, A[$] = I, ve = $);
          else if (ne < pe && 0 > d(re, I))
            A[ve] = re, A[ne] = I, ve = ne;
          else break e;
        }
      }
      return H;
    }
    function d(A, H) {
      var I = A.sortIndex - H.sortIndex;
      return I !== 0 ? I : A.id - H.id;
    }
    if (l.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var f = performance;
      l.unstable_now = function() {
        return f.now();
      };
    } else {
      var m = Date, g = m.now();
      l.unstable_now = function() {
        return m.now() - g;
      };
    }
    var p = [], v = [], b = 1, x = null, w = 3, j = !1, M = !1, T = !1, k = !1, E = typeof setTimeout == "function" ? setTimeout : null, U = typeof clearTimeout == "function" ? clearTimeout : null, Y = typeof setImmediate < "u" ? setImmediate : null;
    function P(A) {
      for (var H = u(v); H !== null; ) {
        if (H.callback === null) o(v);
        else if (H.startTime <= A)
          o(v), H.sortIndex = H.expirationTime, c(p, H);
        else break;
        H = u(v);
      }
    }
    function Z(A) {
      if (T = !1, P(A), !M)
        if (u(p) !== null)
          M = !0, G || (G = !0, W());
        else {
          var H = u(v);
          H !== null && J(Z, H.startTime - A);
        }
    }
    var G = !1, Q = -1, te = 5, ae = -1;
    function xe() {
      return k ? !0 : !(l.unstable_now() - ae < te);
    }
    function z() {
      if (k = !1, G) {
        var A = l.unstable_now();
        ae = A;
        var H = !0;
        try {
          e: {
            M = !1, T && (T = !1, U(Q), Q = -1), j = !0;
            var I = w;
            try {
              t: {
                for (P(A), x = u(p); x !== null && !(x.expirationTime > A && xe()); ) {
                  var ve = x.callback;
                  if (typeof ve == "function") {
                    x.callback = null, w = x.priorityLevel;
                    var pe = ve(
                      x.expirationTime <= A
                    );
                    if (A = l.unstable_now(), typeof pe == "function") {
                      x.callback = pe, P(A), H = !0;
                      break t;
                    }
                    x === u(p) && o(p), P(A);
                  } else o(p);
                  x = u(p);
                }
                if (x !== null) H = !0;
                else {
                  var N = u(v);
                  N !== null && J(
                    Z,
                    N.startTime - A
                  ), H = !1;
                }
              }
              break e;
            } finally {
              x = null, w = I, j = !1;
            }
            H = void 0;
          }
        } finally {
          H ? W() : G = !1;
        }
      }
    }
    var W;
    if (typeof Y == "function")
      W = function() {
        Y(z);
      };
    else if (typeof MessageChannel < "u") {
      var se = new MessageChannel(), K = se.port2;
      se.port1.onmessage = z, W = function() {
        K.postMessage(null);
      };
    } else
      W = function() {
        E(z, 0);
      };
    function J(A, H) {
      Q = E(function() {
        A(l.unstable_now());
      }, H);
    }
    l.unstable_IdlePriority = 5, l.unstable_ImmediatePriority = 1, l.unstable_LowPriority = 4, l.unstable_NormalPriority = 3, l.unstable_Profiling = null, l.unstable_UserBlockingPriority = 2, l.unstable_cancelCallback = function(A) {
      A.callback = null;
    }, l.unstable_forceFrameRate = function(A) {
      0 > A || 125 < A ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : te = 0 < A ? Math.floor(1e3 / A) : 5;
    }, l.unstable_getCurrentPriorityLevel = function() {
      return w;
    }, l.unstable_next = function(A) {
      switch (w) {
        case 1:
        case 2:
        case 3:
          var H = 3;
          break;
        default:
          H = w;
      }
      var I = w;
      w = H;
      try {
        return A();
      } finally {
        w = I;
      }
    }, l.unstable_requestPaint = function() {
      k = !0;
    }, l.unstable_runWithPriority = function(A, H) {
      switch (A) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          A = 3;
      }
      var I = w;
      w = A;
      try {
        return H();
      } finally {
        w = I;
      }
    }, l.unstable_scheduleCallback = function(A, H, I) {
      var ve = l.unstable_now();
      switch (typeof I == "object" && I !== null ? (I = I.delay, I = typeof I == "number" && 0 < I ? ve + I : ve) : I = ve, A) {
        case 1:
          var pe = -1;
          break;
        case 2:
          pe = 250;
          break;
        case 5:
          pe = 1073741823;
          break;
        case 4:
          pe = 1e4;
          break;
        default:
          pe = 5e3;
      }
      return pe = I + pe, A = {
        id: b++,
        callback: H,
        priorityLevel: A,
        startTime: I,
        expirationTime: pe,
        sortIndex: -1
      }, I > ve ? (A.sortIndex = I, c(v, A), u(p) === null && A === u(v) && (T ? (U(Q), Q = -1) : T = !0, J(Z, I - ve))) : (A.sortIndex = pe, c(p, A), M || j || (M = !0, G || (G = !0, W()))), A;
    }, l.unstable_shouldYield = xe, l.unstable_wrapCallback = function(A) {
      var H = w;
      return function() {
        var I = w;
        w = H;
        try {
          return A.apply(this, arguments);
        } finally {
          w = I;
        }
      };
    };
  })(au)), au;
}
var $m;
function Ux() {
  return $m || ($m = 1, nu.exports = Lx()), nu.exports;
}
var lu = { exports: {} }, _t = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Gm;
function Bx() {
  if (Gm) return _t;
  Gm = 1;
  var l = wu();
  function c(p) {
    var v = "https://react.dev/errors/" + p;
    if (1 < arguments.length) {
      v += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var b = 2; b < arguments.length; b++)
        v += "&args[]=" + encodeURIComponent(arguments[b]);
    }
    return "Minified React error #" + p + "; visit " + v + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function u() {
  }
  var o = {
    d: {
      f: u,
      r: function() {
        throw Error(c(522));
      },
      D: u,
      C: u,
      L: u,
      m: u,
      X: u,
      S: u,
      M: u
    },
    p: 0,
    findDOMNode: null
  }, d = Symbol.for("react.portal");
  function f(p, v, b) {
    var x = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: d,
      key: x == null ? null : "" + x,
      children: p,
      containerInfo: v,
      implementation: b
    };
  }
  var m = l.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function g(p, v) {
    if (p === "font") return "";
    if (typeof v == "string")
      return v === "use-credentials" ? v : "";
  }
  return _t.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o, _t.createPortal = function(p, v) {
    var b = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!v || v.nodeType !== 1 && v.nodeType !== 9 && v.nodeType !== 11)
      throw Error(c(299));
    return f(p, v, null, b);
  }, _t.flushSync = function(p) {
    var v = m.T, b = o.p;
    try {
      if (m.T = null, o.p = 2, p) return p();
    } finally {
      m.T = v, o.p = b, o.d.f();
    }
  }, _t.preconnect = function(p, v) {
    typeof p == "string" && (v ? (v = v.crossOrigin, v = typeof v == "string" ? v === "use-credentials" ? v : "" : void 0) : v = null, o.d.C(p, v));
  }, _t.prefetchDNS = function(p) {
    typeof p == "string" && o.d.D(p);
  }, _t.preinit = function(p, v) {
    if (typeof p == "string" && v && typeof v.as == "string") {
      var b = v.as, x = g(b, v.crossOrigin), w = typeof v.integrity == "string" ? v.integrity : void 0, j = typeof v.fetchPriority == "string" ? v.fetchPriority : void 0;
      b === "style" ? o.d.S(
        p,
        typeof v.precedence == "string" ? v.precedence : void 0,
        {
          crossOrigin: x,
          integrity: w,
          fetchPriority: j
        }
      ) : b === "script" && o.d.X(p, {
        crossOrigin: x,
        integrity: w,
        fetchPriority: j,
        nonce: typeof v.nonce == "string" ? v.nonce : void 0
      });
    }
  }, _t.preinitModule = function(p, v) {
    if (typeof p == "string")
      if (typeof v == "object" && v !== null) {
        if (v.as == null || v.as === "script") {
          var b = g(
            v.as,
            v.crossOrigin
          );
          o.d.M(p, {
            crossOrigin: b,
            integrity: typeof v.integrity == "string" ? v.integrity : void 0,
            nonce: typeof v.nonce == "string" ? v.nonce : void 0
          });
        }
      } else v == null && o.d.M(p);
  }, _t.preload = function(p, v) {
    if (typeof p == "string" && typeof v == "object" && v !== null && typeof v.as == "string") {
      var b = v.as, x = g(b, v.crossOrigin);
      o.d.L(p, b, {
        crossOrigin: x,
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
  }, _t.preloadModule = function(p, v) {
    if (typeof p == "string")
      if (v) {
        var b = g(v.as, v.crossOrigin);
        o.d.m(p, {
          as: typeof v.as == "string" && v.as !== "script" ? v.as : void 0,
          crossOrigin: b,
          integrity: typeof v.integrity == "string" ? v.integrity : void 0
        });
      } else o.d.m(p);
  }, _t.requestFormReset = function(p) {
    o.d.r(p);
  }, _t.unstable_batchedUpdates = function(p, v) {
    return p(v);
  }, _t.useFormState = function(p, v, b) {
    return m.H.useFormState(p, v, b);
  }, _t.useFormStatus = function() {
    return m.H.useHostTransitionStatus();
  }, _t.version = "19.2.8", _t;
}
var Fm;
function $x() {
  if (Fm) return lu.exports;
  Fm = 1;
  function l() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(l);
      } catch (c) {
        console.error(c);
      }
  }
  return l(), lu.exports = Bx(), lu.exports;
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
var qm;
function Gx() {
  if (qm) return Cs;
  qm = 1;
  var l = Ux(), c = wu(), u = $x();
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
  function m(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function g(e) {
    if (e.tag === 31) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function p(e) {
    if (f(e) !== e)
      throw Error(o(188));
  }
  function v(e) {
    var t = e.alternate;
    if (!t) {
      if (t = f(e), t === null) throw Error(o(188));
      return t !== e ? null : e;
    }
    for (var n = e, a = t; ; ) {
      var i = n.return;
      if (i === null) break;
      var r = i.alternate;
      if (r === null) {
        if (a = i.return, a !== null) {
          n = a;
          continue;
        }
        break;
      }
      if (i.child === r.child) {
        for (r = i.child; r; ) {
          if (r === n) return p(i), e;
          if (r === a) return p(i), t;
          r = r.sibling;
        }
        throw Error(o(188));
      }
      if (n.return !== a.return) n = i, a = r;
      else {
        for (var h = !1, _ = i.child; _; ) {
          if (_ === n) {
            h = !0, n = i, a = r;
            break;
          }
          if (_ === a) {
            h = !0, a = i, n = r;
            break;
          }
          _ = _.sibling;
        }
        if (!h) {
          for (_ = r.child; _; ) {
            if (_ === n) {
              h = !0, n = r, a = i;
              break;
            }
            if (_ === a) {
              h = !0, a = r, n = i;
              break;
            }
            _ = _.sibling;
          }
          if (!h) throw Error(o(189));
        }
      }
      if (n.alternate !== a) throw Error(o(190));
    }
    if (n.tag !== 3) throw Error(o(188));
    return n.stateNode.current === n ? e : t;
  }
  function b(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null; ) {
      if (t = b(e), t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var x = Object.assign, w = Symbol.for("react.element"), j = Symbol.for("react.transitional.element"), M = Symbol.for("react.portal"), T = Symbol.for("react.fragment"), k = Symbol.for("react.strict_mode"), E = Symbol.for("react.profiler"), U = Symbol.for("react.consumer"), Y = Symbol.for("react.context"), P = Symbol.for("react.forward_ref"), Z = Symbol.for("react.suspense"), G = Symbol.for("react.suspense_list"), Q = Symbol.for("react.memo"), te = Symbol.for("react.lazy"), ae = Symbol.for("react.activity"), xe = Symbol.for("react.memo_cache_sentinel"), z = Symbol.iterator;
  function W(e) {
    return e === null || typeof e != "object" ? null : (e = z && e[z] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var se = Symbol.for("react.client.reference");
  function K(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === se ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case T:
        return "Fragment";
      case E:
        return "Profiler";
      case k:
        return "StrictMode";
      case Z:
        return "Suspense";
      case G:
        return "SuspenseList";
      case ae:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case M:
          return "Portal";
        case Y:
          return e.displayName || "Context";
        case U:
          return (e._context.displayName || "Context") + ".Consumer";
        case P:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case Q:
          return t = e.displayName || null, t !== null ? t : K(e.type) || "Memo";
        case te:
          t = e._payload, e = e._init;
          try {
            return K(e(t));
          } catch {
          }
      }
    return null;
  }
  var J = Array.isArray, A = c.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, H = u.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, I = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, ve = [], pe = -1;
  function N(e) {
    return { current: e };
  }
  function $(e) {
    0 > pe || (e.current = ve[pe], ve[pe] = null, pe--);
  }
  function ee(e, t) {
    pe++, ve[pe] = e.current, e.current = t;
  }
  var ne = N(null), re = N(null), ge = N(null), _e = N(null);
  function de(e, t) {
    switch (ee(ge, t), ee(re, e), ee(ne, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? lm(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = lm(t), e = sm(t, e);
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
    $(ne), ee(ne, e);
  }
  function we() {
    $(ne), $(re), $(ge);
  }
  function it(e) {
    e.memoizedState !== null && ee(_e, e);
    var t = ne.current, n = sm(t, e.type);
    t !== n && (ee(re, e), ee(ne, n));
  }
  function ft(e) {
    re.current === e && ($(ne), $(re)), _e.current === e && ($(_e), Ss._currentValue = I);
  }
  var ce, tt;
  function oe(e) {
    if (ce === void 0)
      try {
        throw Error();
      } catch (n) {
        var t = n.stack.trim().match(/\n( *(at )?)/);
        ce = t && t[1] || "", tt = -1 < n.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < n.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + ce + e + tt;
  }
  var Ke = !1;
  function rt(e, t) {
    if (!e || Ke) return "";
    Ke = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var X = function() {
                throw Error();
              };
              if (Object.defineProperty(X.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(X, []);
                } catch (B) {
                  var L = B;
                }
                Reflect.construct(e, [], X);
              } else {
                try {
                  X.call();
                } catch (B) {
                  L = B;
                }
                e.call(X.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (B) {
                L = B;
              }
              (X = e()) && typeof X.catch == "function" && X.catch(function() {
              });
            }
          } catch (B) {
            if (B && L && typeof B.stack == "string")
              return [B.stack, L.stack];
          }
          return [null, null];
        }
      };
      a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var i = Object.getOwnPropertyDescriptor(
        a.DetermineComponentFrameRoot,
        "name"
      );
      i && i.configurable && Object.defineProperty(
        a.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var r = a.DetermineComponentFrameRoot(), h = r[0], _ = r[1];
      if (h && _) {
        var S = h.split(`
`), D = _.split(`
`);
        for (i = a = 0; a < S.length && !S[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; i < D.length && !D[i].includes(
          "DetermineComponentFrameRoot"
        ); )
          i++;
        if (a === S.length || i === D.length)
          for (a = S.length - 1, i = D.length - 1; 1 <= a && 0 <= i && S[a] !== D[i]; )
            i--;
        for (; 1 <= a && 0 <= i; a--, i--)
          if (S[a] !== D[i]) {
            if (a !== 1 || i !== 1)
              do
                if (a--, i--, 0 > i || S[a] !== D[i]) {
                  var q = `
` + S[a].replace(" at new ", " at ");
                  return e.displayName && q.includes("<anonymous>") && (q = q.replace("<anonymous>", e.displayName)), q;
                }
              while (1 <= a && 0 <= i);
            break;
          }
      }
    } finally {
      Ke = !1, Error.prepareStackTrace = n;
    }
    return (n = e ? e.displayName || e.name : "") ? oe(n) : "";
  }
  function He(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return oe(e.type);
      case 16:
        return oe("Lazy");
      case 13:
        return e.child !== t && t !== null ? oe("Suspense Fallback") : oe("Suspense");
      case 19:
        return oe("SuspenseList");
      case 0:
      case 15:
        return rt(e.type, !1);
      case 11:
        return rt(e.type.render, !1);
      case 1:
        return rt(e.type, !0);
      case 31:
        return oe("Activity");
      default:
        return "";
    }
  }
  function ln(e) {
    try {
      var t = "", n = null;
      do
        t += He(e, n), n = e, e = e.return;
      while (e);
      return t;
    } catch (a) {
      return `
Error generating stack: ` + a.message + `
` + a.stack;
    }
  }
  var _n = Object.prototype.hasOwnProperty, yn = l.unstable_scheduleCallback, Hl = l.unstable_cancelCallback, Rc = l.unstable_shouldYield, zc = l.unstable_requestPaint, St = l.unstable_now, Oc = l.unstable_getCurrentPriorityLevel, $s = l.unstable_ImmediatePriority, Gs = l.unstable_UserBlockingPriority, Qa = l.unstable_NormalPriority, Dc = l.unstable_LowPriority, Fs = l.unstable_IdlePriority, Hc = l.log, Lc = l.unstable_setDisableYieldValue, Vn = null, bt = null;
  function Vt(e) {
    if (typeof Hc == "function" && Lc(e), bt && typeof bt.setStrictMode == "function")
      try {
        bt.setStrictMode(Vn, e);
      } catch {
      }
  }
  var Je = Math.clz32 ? Math.clz32 : xv, Uc = Math.log, Bc = Math.LN2;
  function xv(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Uc(e) / Bc | 0) | 0;
  }
  var qs = 256, Ys = 262144, Vs = 4194304;
  function ya(e) {
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
  function Xs(e, t, n) {
    var a = e.pendingLanes;
    if (a === 0) return 0;
    var i = 0, r = e.suspendedLanes, h = e.pingedLanes;
    e = e.warmLanes;
    var _ = a & 134217727;
    return _ !== 0 ? (a = _ & ~r, a !== 0 ? i = ya(a) : (h &= _, h !== 0 ? i = ya(h) : n || (n = _ & ~e, n !== 0 && (i = ya(n))))) : (_ = a & ~r, _ !== 0 ? i = ya(_) : h !== 0 ? i = ya(h) : n || (n = a & ~e, n !== 0 && (i = ya(n)))), i === 0 ? 0 : t !== 0 && t !== i && (t & r) === 0 && (r = i & -i, n = t & -t, r >= n || r === 32 && (n & 4194048) !== 0) ? t : i;
  }
  function Ll(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function bv(e, t) {
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
  function Uu() {
    var e = Vs;
    return Vs <<= 1, (Vs & 62914560) === 0 && (Vs = 4194304), e;
  }
  function $c(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function Ul(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function _v(e, t, n, a, i, r) {
    var h = e.pendingLanes;
    e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
    var _ = e.entanglements, S = e.expirationTimes, D = e.hiddenUpdates;
    for (n = h & ~n; 0 < n; ) {
      var q = 31 - Je(n), X = 1 << q;
      _[q] = 0, S[q] = -1;
      var L = D[q];
      if (L !== null)
        for (D[q] = null, q = 0; q < L.length; q++) {
          var B = L[q];
          B !== null && (B.lane &= -536870913);
        }
      n &= ~X;
    }
    a !== 0 && Bu(e, a, 0), r !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= r & ~(h & ~t));
  }
  function Bu(e, t, n) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var a = 31 - Je(t);
    e.entangledLanes |= t, e.entanglements[a] = e.entanglements[a] | 1073741824 | n & 261930;
  }
  function $u(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var a = 31 - Je(n), i = 1 << a;
      i & t | e[a] & t && (e[a] |= t), n &= ~i;
    }
  }
  function Gu(e, t) {
    var n = t & -t;
    return n = (n & 42) !== 0 ? 1 : Gc(n), (n & (e.suspendedLanes | t)) !== 0 ? 0 : n;
  }
  function Gc(e) {
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
  function Fc(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Fu() {
    var e = H.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : Mm(e.type));
  }
  function qu(e, t) {
    var n = H.p;
    try {
      return H.p = e, t();
    } finally {
      H.p = n;
    }
  }
  var Xn = Math.random().toString(36).slice(2), ht = "__reactFiber$" + Xn, Et = "__reactProps$" + Xn, Za = "__reactContainer$" + Xn, qc = "__reactEvents$" + Xn, yv = "__reactListeners$" + Xn, wv = "__reactHandles$" + Xn, Yu = "__reactResources$" + Xn, Bl = "__reactMarker$" + Xn;
  function Yc(e) {
    delete e[ht], delete e[Et], delete e[qc], delete e[yv], delete e[wv];
  }
  function Ka(e) {
    var t = e[ht];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[Za] || n[ht]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null)
          for (e = fm(e); e !== null; ) {
            if (n = e[ht]) return n;
            e = fm(e);
          }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function Ja(e) {
    if (e = e[ht] || e[Za]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function $l(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(o(33));
  }
  function Wa(e) {
    var t = e[Yu];
    return t || (t = e[Yu] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function ot(e) {
    e[Bl] = !0;
  }
  var Vu = /* @__PURE__ */ new Set(), Xu = {};
  function wa(e, t) {
    Pa(e, t), Pa(e + "Capture", t);
  }
  function Pa(e, t) {
    for (Xu[e] = t, e = 0; e < t.length; e++)
      Vu.add(t[e]);
  }
  var jv = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Qu = {}, Zu = {};
  function Sv(e) {
    return _n.call(Zu, e) ? !0 : _n.call(Qu, e) ? !1 : jv.test(e) ? Zu[e] = !0 : (Qu[e] = !0, !1);
  }
  function Qs(e, t, n) {
    if (Sv(t))
      if (n === null) e.removeAttribute(t);
      else {
        switch (typeof n) {
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
        e.setAttribute(t, "" + n);
      }
  }
  function Zs(e, t, n) {
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
  function wn(e, t, n, a) {
    if (a === null) e.removeAttribute(n);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(n);
          return;
      }
      e.setAttributeNS(t, n, "" + a);
    }
  }
  function Xt(e) {
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
  function Ku(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Nv(e, t, n) {
    var a = Object.getOwnPropertyDescriptor(
      e.constructor.prototype,
      t
    );
    if (!e.hasOwnProperty(t) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
      var i = a.get, r = a.set;
      return Object.defineProperty(e, t, {
        configurable: !0,
        get: function() {
          return i.call(this);
        },
        set: function(h) {
          n = "" + h, r.call(this, h);
        }
      }), Object.defineProperty(e, t, {
        enumerable: a.enumerable
      }), {
        getValue: function() {
          return n;
        },
        setValue: function(h) {
          n = "" + h;
        },
        stopTracking: function() {
          e._valueTracker = null, delete e[t];
        }
      };
    }
  }
  function Vc(e) {
    if (!e._valueTracker) {
      var t = Ku(e) ? "checked" : "value";
      e._valueTracker = Nv(
        e,
        t,
        "" + e[t]
      );
    }
  }
  function Ju(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), a = "";
    return e && (a = Ku(e) ? e.checked ? "true" : "false" : e.value), e = a, e !== n ? (t.setValue(e), !0) : !1;
  }
  function Ks(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var kv = /[\n"\\]/g;
  function Qt(e) {
    return e.replace(
      kv,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Xc(e, t, n, a, i, r, h, _) {
    e.name = "", h != null && typeof h != "function" && typeof h != "symbol" && typeof h != "boolean" ? e.type = h : e.removeAttribute("type"), t != null ? h === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Xt(t)) : e.value !== "" + Xt(t) && (e.value = "" + Xt(t)) : h !== "submit" && h !== "reset" || e.removeAttribute("value"), t != null ? Qc(e, h, Xt(t)) : n != null ? Qc(e, h, Xt(n)) : a != null && e.removeAttribute("value"), i == null && r != null && (e.defaultChecked = !!r), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), _ != null && typeof _ != "function" && typeof _ != "symbol" && typeof _ != "boolean" ? e.name = "" + Xt(_) : e.removeAttribute("name");
  }
  function Wu(e, t, n, a, i, r, h, _) {
    if (r != null && typeof r != "function" && typeof r != "symbol" && typeof r != "boolean" && (e.type = r), t != null || n != null) {
      if (!(r !== "submit" && r !== "reset" || t != null)) {
        Vc(e);
        return;
      }
      n = n != null ? "" + Xt(n) : "", t = t != null ? "" + Xt(t) : n, _ || t === e.value || (e.value = t), e.defaultValue = t;
    }
    a = a ?? i, a = typeof a != "function" && typeof a != "symbol" && !!a, e.checked = _ ? e.checked : !!a, e.defaultChecked = !!a, h != null && typeof h != "function" && typeof h != "symbol" && typeof h != "boolean" && (e.name = h), Vc(e);
  }
  function Qc(e, t, n) {
    t === "number" && Ks(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
  }
  function Ia(e, t, n, a) {
    if (e = e.options, t) {
      t = {};
      for (var i = 0; i < n.length; i++)
        t["$" + n[i]] = !0;
      for (n = 0; n < e.length; n++)
        i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && a && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + Xt(n), t = null, i = 0; i < e.length; i++) {
        if (e[i].value === n) {
          e[i].selected = !0, a && (e[i].defaultSelected = !0);
          return;
        }
        t !== null || e[i].disabled || (t = e[i]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Pu(e, t, n) {
    if (t != null && (t = "" + Xt(t), t !== e.value && (e.value = t), n == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = n != null ? "" + Xt(n) : "";
  }
  function Iu(e, t, n, a) {
    if (t == null) {
      if (a != null) {
        if (n != null) throw Error(o(92));
        if (J(a)) {
          if (1 < a.length) throw Error(o(93));
          a = a[0];
        }
        n = a;
      }
      n == null && (n = ""), t = n;
    }
    n = Xt(t), e.defaultValue = n, a = e.textContent, a === n && a !== "" && a !== null && (e.value = a), Vc(e);
  }
  function el(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Ev = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function ed(e, t, n) {
    var a = t.indexOf("--") === 0;
    n == null || typeof n == "boolean" || n === "" ? a ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : a ? e.setProperty(t, n) : typeof n != "number" || n === 0 || Ev.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
  }
  function td(e, t, n) {
    if (t != null && typeof t != "object")
      throw Error(o(62));
    if (e = e.style, n != null) {
      for (var a in n)
        !n.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf("--") === 0 ? e.setProperty(a, "") : a === "float" ? e.cssFloat = "" : e[a] = "");
      for (var i in t)
        a = t[i], t.hasOwnProperty(i) && n[i] !== a && ed(e, i, a);
    } else
      for (var r in t)
        t.hasOwnProperty(r) && ed(e, r, t[r]);
  }
  function Zc(e) {
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
  var Mv = /* @__PURE__ */ new Map([
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
  ]), Cv = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Js(e) {
    return Cv.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  function jn() {
  }
  var Kc = null;
  function Jc(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var tl = null, nl = null;
  function nd(e) {
    var t = Ja(e);
    if (t && (e = t.stateNode)) {
      var n = e[Et] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (Xc(
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
              var a = n[t];
              if (a !== e && a.form === e.form) {
                var i = a[Et] || null;
                if (!i) throw Error(o(90));
                Xc(
                  a,
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
              a = n[t], a.form === e.form && Ju(a);
          }
          break e;
        case "textarea":
          Pu(e, n.value, n.defaultValue);
          break e;
        case "select":
          t = n.value, t != null && Ia(e, !!n.multiple, t, !1);
      }
    }
  }
  var Wc = !1;
  function ad(e, t, n) {
    if (Wc) return e(t, n);
    Wc = !0;
    try {
      var a = e(t);
      return a;
    } finally {
      if (Wc = !1, (tl !== null || nl !== null) && (Li(), tl && (t = tl, e = nl, nl = tl = null, nd(t), e)))
        for (t = 0; t < e.length; t++) nd(e[t]);
    }
  }
  function Gl(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var a = n[Et] || null;
    if (a === null) return null;
    n = a[t];
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
    if (n && typeof n != "function")
      throw Error(
        o(231, t, typeof n)
      );
    return n;
  }
  var Sn = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Pc = !1;
  if (Sn)
    try {
      var Fl = {};
      Object.defineProperty(Fl, "passive", {
        get: function() {
          Pc = !0;
        }
      }), window.addEventListener("test", Fl, Fl), window.removeEventListener("test", Fl, Fl);
    } catch {
      Pc = !1;
    }
  var Qn = null, Ic = null, Ws = null;
  function ld() {
    if (Ws) return Ws;
    var e, t = Ic, n = t.length, a, i = "value" in Qn ? Qn.value : Qn.textContent, r = i.length;
    for (e = 0; e < n && t[e] === i[e]; e++) ;
    var h = n - e;
    for (a = 1; a <= h && t[n - a] === i[r - a]; a++) ;
    return Ws = i.slice(e, 1 < a ? 1 - a : void 0);
  }
  function Ps(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Is() {
    return !0;
  }
  function sd() {
    return !1;
  }
  function Mt(e) {
    function t(n, a, i, r, h) {
      this._reactName = n, this._targetInst = i, this.type = a, this.nativeEvent = r, this.target = h, this.currentTarget = null;
      for (var _ in e)
        e.hasOwnProperty(_) && (n = e[_], this[_] = n ? n(r) : r[_]);
      return this.isDefaultPrevented = (r.defaultPrevented != null ? r.defaultPrevented : r.returnValue === !1) ? Is : sd, this.isPropagationStopped = sd, this;
    }
    return x(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Is);
      },
      stopPropagation: function() {
        var n = this.nativeEvent;
        n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Is);
      },
      persist: function() {
      },
      isPersistent: Is
    }), t;
  }
  var ja = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, ei = Mt(ja), ql = x({}, ja, { view: 0, detail: 0 }), Tv = Mt(ql), er, tr, Yl, ti = x({}, ql, {
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
    getModifierState: ar,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== Yl && (Yl && e.type === "mousemove" ? (er = e.screenX - Yl.screenX, tr = e.screenY - Yl.screenY) : tr = er = 0, Yl = e), er);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : tr;
    }
  }), id = Mt(ti), Av = x({}, ti, { dataTransfer: 0 }), Rv = Mt(Av), zv = x({}, ql, { relatedTarget: 0 }), nr = Mt(zv), Ov = x({}, ja, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Dv = Mt(Ov), Hv = x({}, ja, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), Lv = Mt(Hv), Uv = x({}, ja, { data: 0 }), cd = Mt(Uv), Bv = {
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
  }, $v = {
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
  }, Gv = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function Fv(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Gv[e]) ? !!t[e] : !1;
  }
  function ar() {
    return Fv;
  }
  var qv = x({}, ql, {
    key: function(e) {
      if (e.key) {
        var t = Bv[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = Ps(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? $v[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: ar,
    charCode: function(e) {
      return e.type === "keypress" ? Ps(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? Ps(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), Yv = Mt(qv), Vv = x({}, ti, {
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
  }), rd = Mt(Vv), Xv = x({}, ql, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: ar
  }), Qv = Mt(Xv), Zv = x({}, ja, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Kv = Mt(Zv), Jv = x({}, ti, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Wv = Mt(Jv), Pv = x({}, ja, {
    newState: 0,
    oldState: 0
  }), Iv = Mt(Pv), eg = [9, 13, 27, 32], lr = Sn && "CompositionEvent" in window, Vl = null;
  Sn && "documentMode" in document && (Vl = document.documentMode);
  var tg = Sn && "TextEvent" in window && !Vl, od = Sn && (!lr || Vl && 8 < Vl && 11 >= Vl), ud = " ", dd = !1;
  function fd(e, t) {
    switch (e) {
      case "keyup":
        return eg.indexOf(t.keyCode) !== -1;
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
  function hd(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var al = !1;
  function ng(e, t) {
    switch (e) {
      case "compositionend":
        return hd(t);
      case "keypress":
        return t.which !== 32 ? null : (dd = !0, ud);
      case "textInput":
        return e = t.data, e === ud && dd ? null : e;
      default:
        return null;
    }
  }
  function ag(e, t) {
    if (al)
      return e === "compositionend" || !lr && fd(e, t) ? (e = ld(), Ws = Ic = Qn = null, al = !1, e) : null;
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
        return od && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var lg = {
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
  function md(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!lg[e.type] : t === "textarea";
  }
  function pd(e, t, n, a) {
    tl ? nl ? nl.push(a) : nl = [a] : tl = a, t = Yi(t, "onChange"), 0 < t.length && (n = new ei(
      "onChange",
      "change",
      null,
      n,
      a
    ), e.push({ event: n, listeners: t }));
  }
  var Xl = null, Ql = null;
  function sg(e) {
    Ph(e, 0);
  }
  function ni(e) {
    var t = $l(e);
    if (Ju(t)) return e;
  }
  function vd(e, t) {
    if (e === "change") return t;
  }
  var gd = !1;
  if (Sn) {
    var sr;
    if (Sn) {
      var ir = "oninput" in document;
      if (!ir) {
        var xd = document.createElement("div");
        xd.setAttribute("oninput", "return;"), ir = typeof xd.oninput == "function";
      }
      sr = ir;
    } else sr = !1;
    gd = sr && (!document.documentMode || 9 < document.documentMode);
  }
  function bd() {
    Xl && (Xl.detachEvent("onpropertychange", _d), Ql = Xl = null);
  }
  function _d(e) {
    if (e.propertyName === "value" && ni(Ql)) {
      var t = [];
      pd(
        t,
        Ql,
        e,
        Jc(e)
      ), ad(sg, t);
    }
  }
  function ig(e, t, n) {
    e === "focusin" ? (bd(), Xl = t, Ql = n, Xl.attachEvent("onpropertychange", _d)) : e === "focusout" && bd();
  }
  function cg(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return ni(Ql);
  }
  function rg(e, t) {
    if (e === "click") return ni(t);
  }
  function og(e, t) {
    if (e === "input" || e === "change")
      return ni(t);
  }
  function ug(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var Dt = typeof Object.is == "function" ? Object.is : ug;
  function Zl(e, t) {
    if (Dt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var n = Object.keys(e), a = Object.keys(t);
    if (n.length !== a.length) return !1;
    for (a = 0; a < n.length; a++) {
      var i = n[a];
      if (!_n.call(t, i) || !Dt(e[i], t[i]))
        return !1;
    }
    return !0;
  }
  function yd(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function wd(e, t) {
    var n = yd(e);
    e = 0;
    for (var a; n; ) {
      if (n.nodeType === 3) {
        if (a = e + n.textContent.length, e <= t && a >= t)
          return { node: n, offset: t - e };
        e = a;
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
      n = yd(n);
    }
  }
  function jd(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? jd(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Sd(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = Ks(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = Ks(e.document);
    }
    return t;
  }
  function cr(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var dg = Sn && "documentMode" in document && 11 >= document.documentMode, ll = null, rr = null, Kl = null, or = !1;
  function Nd(e, t, n) {
    var a = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    or || ll == null || ll !== Ks(a) || (a = ll, "selectionStart" in a && cr(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), Kl && Zl(Kl, a) || (Kl = a, a = Yi(rr, "onSelect"), 0 < a.length && (t = new ei(
      "onSelect",
      "select",
      null,
      t,
      n
    ), e.push({ event: t, listeners: a }), t.target = ll)));
  }
  function Sa(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var sl = {
    animationend: Sa("Animation", "AnimationEnd"),
    animationiteration: Sa("Animation", "AnimationIteration"),
    animationstart: Sa("Animation", "AnimationStart"),
    transitionrun: Sa("Transition", "TransitionRun"),
    transitionstart: Sa("Transition", "TransitionStart"),
    transitioncancel: Sa("Transition", "TransitionCancel"),
    transitionend: Sa("Transition", "TransitionEnd")
  }, ur = {}, kd = {};
  Sn && (kd = document.createElement("div").style, "AnimationEvent" in window || (delete sl.animationend.animation, delete sl.animationiteration.animation, delete sl.animationstart.animation), "TransitionEvent" in window || delete sl.transitionend.transition);
  function Na(e) {
    if (ur[e]) return ur[e];
    if (!sl[e]) return e;
    var t = sl[e], n;
    for (n in t)
      if (t.hasOwnProperty(n) && n in kd)
        return ur[e] = t[n];
    return e;
  }
  var Ed = Na("animationend"), Md = Na("animationiteration"), Cd = Na("animationstart"), fg = Na("transitionrun"), hg = Na("transitionstart"), mg = Na("transitioncancel"), Td = Na("transitionend"), Ad = /* @__PURE__ */ new Map(), dr = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  dr.push("scrollEnd");
  function sn(e, t) {
    Ad.set(e, t), wa(t, [e]);
  }
  var ai = typeof reportError == "function" ? reportError : function(e) {
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
  }, Zt = [], il = 0, fr = 0;
  function li() {
    for (var e = il, t = fr = il = 0; t < e; ) {
      var n = Zt[t];
      Zt[t++] = null;
      var a = Zt[t];
      Zt[t++] = null;
      var i = Zt[t];
      Zt[t++] = null;
      var r = Zt[t];
      if (Zt[t++] = null, a !== null && i !== null) {
        var h = a.pending;
        h === null ? i.next = i : (i.next = h.next, h.next = i), a.pending = i;
      }
      r !== 0 && Rd(n, i, r);
    }
  }
  function si(e, t, n, a) {
    Zt[il++] = e, Zt[il++] = t, Zt[il++] = n, Zt[il++] = a, fr |= a, e.lanes |= a, e = e.alternate, e !== null && (e.lanes |= a);
  }
  function hr(e, t, n, a) {
    return si(e, t, n, a), ii(e);
  }
  function ka(e, t) {
    return si(e, null, null, t), ii(e);
  }
  function Rd(e, t, n) {
    e.lanes |= n;
    var a = e.alternate;
    a !== null && (a.lanes |= n);
    for (var i = !1, r = e.return; r !== null; )
      r.childLanes |= n, a = r.alternate, a !== null && (a.childLanes |= n), r.tag === 22 && (e = r.stateNode, e === null || e._visibility & 1 || (i = !0)), e = r, r = r.return;
    return e.tag === 3 ? (r = e.stateNode, i && t !== null && (i = 31 - Je(n), e = r.hiddenUpdates, a = e[i], a === null ? e[i] = [t] : a.push(t), t.lane = n | 536870912), r) : null;
  }
  function ii(e) {
    if (50 < gs)
      throw gs = 0, jo = null, Error(o(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var cl = {};
  function pg(e, t, n, a) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Ht(e, t, n, a) {
    return new pg(e, t, n, a);
  }
  function mr(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Nn(e, t) {
    var n = e.alternate;
    return n === null ? (n = Ht(
      e.tag,
      t,
      e.key,
      e.mode
    ), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 65011712, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
  }
  function zd(e, t) {
    e.flags &= 65011714;
    var n = e.alternate;
    return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function ci(e, t, n, a, i, r) {
    var h = 0;
    if (a = e, typeof e == "function") mr(e) && (h = 1);
    else if (typeof e == "string")
      h = _x(
        e,
        n,
        ne.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case ae:
          return e = Ht(31, n, t, i), e.elementType = ae, e.lanes = r, e;
        case T:
          return Ea(n.children, i, r, t);
        case k:
          h = 8, i |= 24;
          break;
        case E:
          return e = Ht(12, n, t, i | 2), e.elementType = E, e.lanes = r, e;
        case Z:
          return e = Ht(13, n, t, i), e.elementType = Z, e.lanes = r, e;
        case G:
          return e = Ht(19, n, t, i), e.elementType = G, e.lanes = r, e;
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case Y:
                h = 10;
                break e;
              case U:
                h = 9;
                break e;
              case P:
                h = 11;
                break e;
              case Q:
                h = 14;
                break e;
              case te:
                h = 16, a = null;
                break e;
            }
          h = 29, n = Error(
            o(130, e === null ? "null" : typeof e, "")
          ), a = null;
      }
    return t = Ht(h, n, t, i), t.elementType = e, t.type = a, t.lanes = r, t;
  }
  function Ea(e, t, n, a) {
    return e = Ht(7, e, a, t), e.lanes = n, e;
  }
  function pr(e, t, n) {
    return e = Ht(6, e, null, t), e.lanes = n, e;
  }
  function Od(e) {
    var t = Ht(18, null, null, 0);
    return t.stateNode = e, t;
  }
  function vr(e, t, n) {
    return t = Ht(
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
  var Dd = /* @__PURE__ */ new WeakMap();
  function Kt(e, t) {
    if (typeof e == "object" && e !== null) {
      var n = Dd.get(e);
      return n !== void 0 ? n : (t = {
        value: e,
        source: t,
        stack: ln(t)
      }, Dd.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: ln(t)
    };
  }
  var rl = [], ol = 0, ri = null, Jl = 0, Jt = [], Wt = 0, Zn = null, dn = 1, fn = "";
  function kn(e, t) {
    rl[ol++] = Jl, rl[ol++] = ri, ri = e, Jl = t;
  }
  function Hd(e, t, n) {
    Jt[Wt++] = dn, Jt[Wt++] = fn, Jt[Wt++] = Zn, Zn = e;
    var a = dn;
    e = fn;
    var i = 32 - Je(a) - 1;
    a &= ~(1 << i), n += 1;
    var r = 32 - Je(t) + i;
    if (30 < r) {
      var h = i - i % 5;
      r = (a & (1 << h) - 1).toString(32), a >>= h, i -= h, dn = 1 << 32 - Je(t) + i | n << i | a, fn = r + e;
    } else
      dn = 1 << r | n << i | a, fn = e;
  }
  function gr(e) {
    e.return !== null && (kn(e, 1), Hd(e, 1, 0));
  }
  function xr(e) {
    for (; e === ri; )
      ri = rl[--ol], rl[ol] = null, Jl = rl[--ol], rl[ol] = null;
    for (; e === Zn; )
      Zn = Jt[--Wt], Jt[Wt] = null, fn = Jt[--Wt], Jt[Wt] = null, dn = Jt[--Wt], Jt[Wt] = null;
  }
  function Ld(e, t) {
    Jt[Wt++] = dn, Jt[Wt++] = fn, Jt[Wt++] = Zn, dn = t.id, fn = t.overflow, Zn = e;
  }
  var mt = null, Ye = null, Ce = !1, Kn = null, Pt = !1, br = Error(o(519));
  function Jn(e) {
    var t = Error(
      o(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw Wl(Kt(t, e)), br;
  }
  function Ud(e) {
    var t = e.stateNode, n = e.type, a = e.memoizedProps;
    switch (t[ht] = e, t[Et] = a, n) {
      case "dialog":
        ke("cancel", t), ke("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        ke("load", t);
        break;
      case "video":
      case "audio":
        for (n = 0; n < bs.length; n++)
          ke(bs[n], t);
        break;
      case "source":
        ke("error", t);
        break;
      case "img":
      case "image":
      case "link":
        ke("error", t), ke("load", t);
        break;
      case "details":
        ke("toggle", t);
        break;
      case "input":
        ke("invalid", t), Wu(
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
        ke("invalid", t);
        break;
      case "textarea":
        ke("invalid", t), Iu(t, a.value, a.defaultValue, a.children);
    }
    n = a.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || a.suppressHydrationWarning === !0 || nm(t.textContent, n) ? (a.popover != null && (ke("beforetoggle", t), ke("toggle", t)), a.onScroll != null && ke("scroll", t), a.onScrollEnd != null && ke("scrollend", t), a.onClick != null && (t.onclick = jn), t = !0) : t = !1, t || Jn(e, !0);
  }
  function Bd(e) {
    for (mt = e.return; mt; )
      switch (mt.tag) {
        case 5:
        case 31:
        case 13:
          Pt = !1;
          return;
        case 27:
        case 3:
          Pt = !0;
          return;
        default:
          mt = mt.return;
      }
  }
  function ul(e) {
    if (e !== mt) return !1;
    if (!Ce) return Bd(e), Ce = !0, !1;
    var t = e.tag, n;
    if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = !(n !== "form" && n !== "button") || Uo(e.type, e.memoizedProps)), n = !n), n && Ye && Jn(e), Bd(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
      Ye = dm(e);
    } else if (t === 31) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
      Ye = dm(e);
    } else
      t === 27 ? (t = Ye, ua(e.type) ? (e = qo, qo = null, Ye = e) : Ye = t) : Ye = mt ? en(e.stateNode.nextSibling) : null;
    return !0;
  }
  function Ma() {
    Ye = mt = null, Ce = !1;
  }
  function _r() {
    var e = Kn;
    return e !== null && (Rt === null ? Rt = e : Rt.push.apply(
      Rt,
      e
    ), Kn = null), e;
  }
  function Wl(e) {
    Kn === null ? Kn = [e] : Kn.push(e);
  }
  var yr = N(null), Ca = null, En = null;
  function Wn(e, t, n) {
    ee(yr, t._currentValue), t._currentValue = n;
  }
  function Mn(e) {
    e._currentValue = yr.current, $(yr);
  }
  function wr(e, t, n) {
    for (; e !== null; ) {
      var a = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, a !== null && (a.childLanes |= t)) : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function jr(e, t, n, a) {
    var i = e.child;
    for (i !== null && (i.return = e); i !== null; ) {
      var r = i.dependencies;
      if (r !== null) {
        var h = i.child;
        r = r.firstContext;
        e: for (; r !== null; ) {
          var _ = r;
          r = i;
          for (var S = 0; S < t.length; S++)
            if (_.context === t[S]) {
              r.lanes |= n, _ = r.alternate, _ !== null && (_.lanes |= n), wr(
                r.return,
                n,
                e
              ), a || (h = null);
              break e;
            }
          r = _.next;
        }
      } else if (i.tag === 18) {
        if (h = i.return, h === null) throw Error(o(341));
        h.lanes |= n, r = h.alternate, r !== null && (r.lanes |= n), wr(h, n, e), h = null;
      } else h = i.child;
      if (h !== null) h.return = i;
      else
        for (h = i; h !== null; ) {
          if (h === e) {
            h = null;
            break;
          }
          if (i = h.sibling, i !== null) {
            i.return = h.return, h = i;
            break;
          }
          h = h.return;
        }
      i = h;
    }
  }
  function dl(e, t, n, a) {
    e = null;
    for (var i = t, r = !1; i !== null; ) {
      if (!r) {
        if ((i.flags & 524288) !== 0) r = !0;
        else if ((i.flags & 262144) !== 0) break;
      }
      if (i.tag === 10) {
        var h = i.alternate;
        if (h === null) throw Error(o(387));
        if (h = h.memoizedProps, h !== null) {
          var _ = i.type;
          Dt(i.pendingProps.value, h.value) || (e !== null ? e.push(_) : e = [_]);
        }
      } else if (i === _e.current) {
        if (h = i.alternate, h === null) throw Error(o(387));
        h.memoizedState.memoizedState !== i.memoizedState.memoizedState && (e !== null ? e.push(Ss) : e = [Ss]);
      }
      i = i.return;
    }
    e !== null && jr(
      t,
      e,
      n,
      a
    ), t.flags |= 262144;
  }
  function oi(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!Dt(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function Ta(e) {
    Ca = e, En = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function pt(e) {
    return $d(Ca, e);
  }
  function ui(e, t) {
    return Ca === null && Ta(e), $d(e, t);
  }
  function $d(e, t) {
    var n = t._currentValue;
    if (t = { context: t, memoizedValue: n, next: null }, En === null) {
      if (e === null) throw Error(o(308));
      En = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else En = En.next = t;
    return n;
  }
  var vg = typeof AbortController < "u" ? AbortController : function() {
    var e = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(n, a) {
        e.push(a);
      }
    };
    this.abort = function() {
      t.aborted = !0, e.forEach(function(n) {
        return n();
      });
    };
  }, gg = l.unstable_scheduleCallback, xg = l.unstable_NormalPriority, nt = {
    $$typeof: Y,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Sr() {
    return {
      controller: new vg(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Pl(e) {
    e.refCount--, e.refCount === 0 && gg(xg, function() {
      e.controller.abort();
    });
  }
  var Il = null, Nr = 0, fl = 0, hl = null;
  function bg(e, t) {
    if (Il === null) {
      var n = Il = [];
      Nr = 0, fl = Co(), hl = {
        status: "pending",
        value: void 0,
        then: function(a) {
          n.push(a);
        }
      };
    }
    return Nr++, t.then(Gd, Gd), t;
  }
  function Gd() {
    if (--Nr === 0 && Il !== null) {
      hl !== null && (hl.status = "fulfilled");
      var e = Il;
      Il = null, fl = 0, hl = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function _g(e, t) {
    var n = [], a = {
      status: "pending",
      value: null,
      reason: null,
      then: function(i) {
        n.push(i);
      }
    };
    return e.then(
      function() {
        a.status = "fulfilled", a.value = t;
        for (var i = 0; i < n.length; i++) (0, n[i])(t);
      },
      function(i) {
        for (a.status = "rejected", a.reason = i, i = 0; i < n.length; i++)
          (0, n[i])(void 0);
      }
    ), a;
  }
  var Fd = A.S;
  A.S = function(e, t) {
    kh = St(), typeof t == "object" && t !== null && typeof t.then == "function" && bg(e, t), Fd !== null && Fd(e, t);
  };
  var Aa = N(null);
  function kr() {
    var e = Aa.current;
    return e !== null ? e : Ge.pooledCache;
  }
  function di(e, t) {
    t === null ? ee(Aa, Aa.current) : ee(Aa, t.pool);
  }
  function qd() {
    var e = kr();
    return e === null ? null : { parent: nt._currentValue, pool: e };
  }
  var ml = Error(o(460)), Er = Error(o(474)), fi = Error(o(542)), hi = { then: function() {
  } };
  function Yd(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function Vd(e, t, n) {
    switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(jn, jn), t = n), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, Qd(e), e;
      default:
        if (typeof t.status == "string") t.then(jn, jn);
        else {
          if (e = Ge, e !== null && 100 < e.shellSuspendCounter)
            throw Error(o(482));
          e = t, e.status = "pending", e.then(
            function(a) {
              if (t.status === "pending") {
                var i = t;
                i.status = "fulfilled", i.value = a;
              }
            },
            function(a) {
              if (t.status === "pending") {
                var i = t;
                i.status = "rejected", i.reason = a;
              }
            }
          );
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw e = t.reason, Qd(e), e;
        }
        throw za = t, ml;
    }
  }
  function Ra(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (n) {
      throw n !== null && typeof n == "object" && typeof n.then == "function" ? (za = n, ml) : n;
    }
  }
  var za = null;
  function Xd() {
    if (za === null) throw Error(o(459));
    var e = za;
    return za = null, e;
  }
  function Qd(e) {
    if (e === ml || e === fi)
      throw Error(o(483));
  }
  var pl = null, es = 0;
  function mi(e) {
    var t = es;
    return es += 1, pl === null && (pl = []), Vd(pl, e, t);
  }
  function ts(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function pi(e, t) {
    throw t.$$typeof === w ? Error(o(525)) : (e = Object.prototype.toString.call(t), Error(
      o(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function Zd(e) {
    function t(R, C) {
      if (e) {
        var O = R.deletions;
        O === null ? (R.deletions = [C], R.flags |= 16) : O.push(C);
      }
    }
    function n(R, C) {
      if (!e) return null;
      for (; C !== null; )
        t(R, C), C = C.sibling;
      return null;
    }
    function a(R) {
      for (var C = /* @__PURE__ */ new Map(); R !== null; )
        R.key !== null ? C.set(R.key, R) : C.set(R.index, R), R = R.sibling;
      return C;
    }
    function i(R, C) {
      return R = Nn(R, C), R.index = 0, R.sibling = null, R;
    }
    function r(R, C, O) {
      return R.index = O, e ? (O = R.alternate, O !== null ? (O = O.index, O < C ? (R.flags |= 67108866, C) : O) : (R.flags |= 67108866, C)) : (R.flags |= 1048576, C);
    }
    function h(R) {
      return e && R.alternate === null && (R.flags |= 67108866), R;
    }
    function _(R, C, O, V) {
      return C === null || C.tag !== 6 ? (C = pr(O, R.mode, V), C.return = R, C) : (C = i(C, O), C.return = R, C);
    }
    function S(R, C, O, V) {
      var ue = O.type;
      return ue === T ? q(
        R,
        C,
        O.props.children,
        V,
        O.key
      ) : C !== null && (C.elementType === ue || typeof ue == "object" && ue !== null && ue.$$typeof === te && Ra(ue) === C.type) ? (C = i(C, O.props), ts(C, O), C.return = R, C) : (C = ci(
        O.type,
        O.key,
        O.props,
        null,
        R.mode,
        V
      ), ts(C, O), C.return = R, C);
    }
    function D(R, C, O, V) {
      return C === null || C.tag !== 4 || C.stateNode.containerInfo !== O.containerInfo || C.stateNode.implementation !== O.implementation ? (C = vr(O, R.mode, V), C.return = R, C) : (C = i(C, O.children || []), C.return = R, C);
    }
    function q(R, C, O, V, ue) {
      return C === null || C.tag !== 7 ? (C = Ea(
        O,
        R.mode,
        V,
        ue
      ), C.return = R, C) : (C = i(C, O), C.return = R, C);
    }
    function X(R, C, O) {
      if (typeof C == "string" && C !== "" || typeof C == "number" || typeof C == "bigint")
        return C = pr(
          "" + C,
          R.mode,
          O
        ), C.return = R, C;
      if (typeof C == "object" && C !== null) {
        switch (C.$$typeof) {
          case j:
            return O = ci(
              C.type,
              C.key,
              C.props,
              null,
              R.mode,
              O
            ), ts(O, C), O.return = R, O;
          case M:
            return C = vr(
              C,
              R.mode,
              O
            ), C.return = R, C;
          case te:
            return C = Ra(C), X(R, C, O);
        }
        if (J(C) || W(C))
          return C = Ea(
            C,
            R.mode,
            O,
            null
          ), C.return = R, C;
        if (typeof C.then == "function")
          return X(R, mi(C), O);
        if (C.$$typeof === Y)
          return X(
            R,
            ui(R, C),
            O
          );
        pi(R, C);
      }
      return null;
    }
    function L(R, C, O, V) {
      var ue = C !== null ? C.key : null;
      if (typeof O == "string" && O !== "" || typeof O == "number" || typeof O == "bigint")
        return ue !== null ? null : _(R, C, "" + O, V);
      if (typeof O == "object" && O !== null) {
        switch (O.$$typeof) {
          case j:
            return O.key === ue ? S(R, C, O, V) : null;
          case M:
            return O.key === ue ? D(R, C, O, V) : null;
          case te:
            return O = Ra(O), L(R, C, O, V);
        }
        if (J(O) || W(O))
          return ue !== null ? null : q(R, C, O, V, null);
        if (typeof O.then == "function")
          return L(
            R,
            C,
            mi(O),
            V
          );
        if (O.$$typeof === Y)
          return L(
            R,
            C,
            ui(R, O),
            V
          );
        pi(R, O);
      }
      return null;
    }
    function B(R, C, O, V, ue) {
      if (typeof V == "string" && V !== "" || typeof V == "number" || typeof V == "bigint")
        return R = R.get(O) || null, _(C, R, "" + V, ue);
      if (typeof V == "object" && V !== null) {
        switch (V.$$typeof) {
          case j:
            return R = R.get(
              V.key === null ? O : V.key
            ) || null, S(C, R, V, ue);
          case M:
            return R = R.get(
              V.key === null ? O : V.key
            ) || null, D(C, R, V, ue);
          case te:
            return V = Ra(V), B(
              R,
              C,
              O,
              V,
              ue
            );
        }
        if (J(V) || W(V))
          return R = R.get(O) || null, q(C, R, V, ue, null);
        if (typeof V.then == "function")
          return B(
            R,
            C,
            O,
            mi(V),
            ue
          );
        if (V.$$typeof === Y)
          return B(
            R,
            C,
            O,
            ui(C, V),
            ue
          );
        pi(C, V);
      }
      return null;
    }
    function le(R, C, O, V) {
      for (var ue = null, Ae = null, ie = C, je = C = 0, Me = null; ie !== null && je < O.length; je++) {
        ie.index > je ? (Me = ie, ie = null) : Me = ie.sibling;
        var Re = L(
          R,
          ie,
          O[je],
          V
        );
        if (Re === null) {
          ie === null && (ie = Me);
          break;
        }
        e && ie && Re.alternate === null && t(R, ie), C = r(Re, C, je), Ae === null ? ue = Re : Ae.sibling = Re, Ae = Re, ie = Me;
      }
      if (je === O.length)
        return n(R, ie), Ce && kn(R, je), ue;
      if (ie === null) {
        for (; je < O.length; je++)
          ie = X(R, O[je], V), ie !== null && (C = r(
            ie,
            C,
            je
          ), Ae === null ? ue = ie : Ae.sibling = ie, Ae = ie);
        return Ce && kn(R, je), ue;
      }
      for (ie = a(ie); je < O.length; je++)
        Me = B(
          ie,
          R,
          je,
          O[je],
          V
        ), Me !== null && (e && Me.alternate !== null && ie.delete(
          Me.key === null ? je : Me.key
        ), C = r(
          Me,
          C,
          je
        ), Ae === null ? ue = Me : Ae.sibling = Me, Ae = Me);
      return e && ie.forEach(function(pa) {
        return t(R, pa);
      }), Ce && kn(R, je), ue;
    }
    function me(R, C, O, V) {
      if (O == null) throw Error(o(151));
      for (var ue = null, Ae = null, ie = C, je = C = 0, Me = null, Re = O.next(); ie !== null && !Re.done; je++, Re = O.next()) {
        ie.index > je ? (Me = ie, ie = null) : Me = ie.sibling;
        var pa = L(R, ie, Re.value, V);
        if (pa === null) {
          ie === null && (ie = Me);
          break;
        }
        e && ie && pa.alternate === null && t(R, ie), C = r(pa, C, je), Ae === null ? ue = pa : Ae.sibling = pa, Ae = pa, ie = Me;
      }
      if (Re.done)
        return n(R, ie), Ce && kn(R, je), ue;
      if (ie === null) {
        for (; !Re.done; je++, Re = O.next())
          Re = X(R, Re.value, V), Re !== null && (C = r(Re, C, je), Ae === null ? ue = Re : Ae.sibling = Re, Ae = Re);
        return Ce && kn(R, je), ue;
      }
      for (ie = a(ie); !Re.done; je++, Re = O.next())
        Re = B(ie, R, je, Re.value, V), Re !== null && (e && Re.alternate !== null && ie.delete(Re.key === null ? je : Re.key), C = r(Re, C, je), Ae === null ? ue = Re : Ae.sibling = Re, Ae = Re);
      return e && ie.forEach(function(Ax) {
        return t(R, Ax);
      }), Ce && kn(R, je), ue;
    }
    function Be(R, C, O, V) {
      if (typeof O == "object" && O !== null && O.type === T && O.key === null && (O = O.props.children), typeof O == "object" && O !== null) {
        switch (O.$$typeof) {
          case j:
            e: {
              for (var ue = O.key; C !== null; ) {
                if (C.key === ue) {
                  if (ue = O.type, ue === T) {
                    if (C.tag === 7) {
                      n(
                        R,
                        C.sibling
                      ), V = i(
                        C,
                        O.props.children
                      ), V.return = R, R = V;
                      break e;
                    }
                  } else if (C.elementType === ue || typeof ue == "object" && ue !== null && ue.$$typeof === te && Ra(ue) === C.type) {
                    n(
                      R,
                      C.sibling
                    ), V = i(C, O.props), ts(V, O), V.return = R, R = V;
                    break e;
                  }
                  n(R, C);
                  break;
                } else t(R, C);
                C = C.sibling;
              }
              O.type === T ? (V = Ea(
                O.props.children,
                R.mode,
                V,
                O.key
              ), V.return = R, R = V) : (V = ci(
                O.type,
                O.key,
                O.props,
                null,
                R.mode,
                V
              ), ts(V, O), V.return = R, R = V);
            }
            return h(R);
          case M:
            e: {
              for (ue = O.key; C !== null; ) {
                if (C.key === ue)
                  if (C.tag === 4 && C.stateNode.containerInfo === O.containerInfo && C.stateNode.implementation === O.implementation) {
                    n(
                      R,
                      C.sibling
                    ), V = i(C, O.children || []), V.return = R, R = V;
                    break e;
                  } else {
                    n(R, C);
                    break;
                  }
                else t(R, C);
                C = C.sibling;
              }
              V = vr(O, R.mode, V), V.return = R, R = V;
            }
            return h(R);
          case te:
            return O = Ra(O), Be(
              R,
              C,
              O,
              V
            );
        }
        if (J(O))
          return le(
            R,
            C,
            O,
            V
          );
        if (W(O)) {
          if (ue = W(O), typeof ue != "function") throw Error(o(150));
          return O = ue.call(O), me(
            R,
            C,
            O,
            V
          );
        }
        if (typeof O.then == "function")
          return Be(
            R,
            C,
            mi(O),
            V
          );
        if (O.$$typeof === Y)
          return Be(
            R,
            C,
            ui(R, O),
            V
          );
        pi(R, O);
      }
      return typeof O == "string" && O !== "" || typeof O == "number" || typeof O == "bigint" ? (O = "" + O, C !== null && C.tag === 6 ? (n(R, C.sibling), V = i(C, O), V.return = R, R = V) : (n(R, C), V = pr(O, R.mode, V), V.return = R, R = V), h(R)) : n(R, C);
    }
    return function(R, C, O, V) {
      try {
        es = 0;
        var ue = Be(
          R,
          C,
          O,
          V
        );
        return pl = null, ue;
      } catch (ie) {
        if (ie === ml || ie === fi) throw ie;
        var Ae = Ht(29, ie, null, R.mode);
        return Ae.lanes = V, Ae.return = R, Ae;
      } finally {
      }
    };
  }
  var Oa = Zd(!0), Kd = Zd(!1), Pn = !1;
  function Mr(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Cr(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function In(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function ea(e, t, n) {
    var a = e.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (ze & 2) !== 0) {
      var i = a.pending;
      return i === null ? t.next = t : (t.next = i.next, i.next = t), a.pending = t, t = ii(e), Rd(e, null, n), t;
    }
    return si(e, a, t, n), ii(e);
  }
  function ns(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194048) !== 0)) {
      var a = t.lanes;
      a &= e.pendingLanes, n |= a, t.lanes = n, $u(e, n);
    }
  }
  function Tr(e, t) {
    var n = e.updateQueue, a = e.alternate;
    if (a !== null && (a = a.updateQueue, n === a)) {
      var i = null, r = null;
      if (n = n.firstBaseUpdate, n !== null) {
        do {
          var h = {
            lane: n.lane,
            tag: n.tag,
            payload: n.payload,
            callback: null,
            next: null
          };
          r === null ? i = r = h : r = r.next = h, n = n.next;
        } while (n !== null);
        r === null ? i = r = t : r = r.next = t;
      } else i = r = t;
      n = {
        baseState: a.baseState,
        firstBaseUpdate: i,
        lastBaseUpdate: r,
        shared: a.shared,
        callbacks: a.callbacks
      }, e.updateQueue = n;
      return;
    }
    e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
  }
  var Ar = !1;
  function as() {
    if (Ar) {
      var e = hl;
      if (e !== null) throw e;
    }
  }
  function ls(e, t, n, a) {
    Ar = !1;
    var i = e.updateQueue;
    Pn = !1;
    var r = i.firstBaseUpdate, h = i.lastBaseUpdate, _ = i.shared.pending;
    if (_ !== null) {
      i.shared.pending = null;
      var S = _, D = S.next;
      S.next = null, h === null ? r = D : h.next = D, h = S;
      var q = e.alternate;
      q !== null && (q = q.updateQueue, _ = q.lastBaseUpdate, _ !== h && (_ === null ? q.firstBaseUpdate = D : _.next = D, q.lastBaseUpdate = S));
    }
    if (r !== null) {
      var X = i.baseState;
      h = 0, q = D = S = null, _ = r;
      do {
        var L = _.lane & -536870913, B = L !== _.lane;
        if (B ? (Ee & L) === L : (a & L) === L) {
          L !== 0 && L === fl && (Ar = !0), q !== null && (q = q.next = {
            lane: 0,
            tag: _.tag,
            payload: _.payload,
            callback: null,
            next: null
          });
          e: {
            var le = e, me = _;
            L = t;
            var Be = n;
            switch (me.tag) {
              case 1:
                if (le = me.payload, typeof le == "function") {
                  X = le.call(Be, X, L);
                  break e;
                }
                X = le;
                break e;
              case 3:
                le.flags = le.flags & -65537 | 128;
              case 0:
                if (le = me.payload, L = typeof le == "function" ? le.call(Be, X, L) : le, L == null) break e;
                X = x({}, X, L);
                break e;
              case 2:
                Pn = !0;
            }
          }
          L = _.callback, L !== null && (e.flags |= 64, B && (e.flags |= 8192), B = i.callbacks, B === null ? i.callbacks = [L] : B.push(L));
        } else
          B = {
            lane: L,
            tag: _.tag,
            payload: _.payload,
            callback: _.callback,
            next: null
          }, q === null ? (D = q = B, S = X) : q = q.next = B, h |= L;
        if (_ = _.next, _ === null) {
          if (_ = i.shared.pending, _ === null)
            break;
          B = _, _ = B.next, B.next = null, i.lastBaseUpdate = B, i.shared.pending = null;
        }
      } while (!0);
      q === null && (S = X), i.baseState = S, i.firstBaseUpdate = D, i.lastBaseUpdate = q, r === null && (i.shared.lanes = 0), sa |= h, e.lanes = h, e.memoizedState = X;
    }
  }
  function Jd(e, t) {
    if (typeof e != "function")
      throw Error(o(191, e));
    e.call(t);
  }
  function Wd(e, t) {
    var n = e.callbacks;
    if (n !== null)
      for (e.callbacks = null, e = 0; e < n.length; e++)
        Jd(n[e], t);
  }
  var vl = N(null), vi = N(0);
  function Pd(e, t) {
    e = Ln, ee(vi, e), ee(vl, t), Ln = e | t.baseLanes;
  }
  function Rr() {
    ee(vi, Ln), ee(vl, vl.current);
  }
  function zr() {
    Ln = vi.current, $(vl), $(vi);
  }
  var Lt = N(null), It = null;
  function ta(e) {
    var t = e.alternate;
    ee(Ie, Ie.current & 1), ee(Lt, e), It === null && (t === null || vl.current !== null || t.memoizedState !== null) && (It = e);
  }
  function Or(e) {
    ee(Ie, Ie.current), ee(Lt, e), It === null && (It = e);
  }
  function Id(e) {
    e.tag === 22 ? (ee(Ie, Ie.current), ee(Lt, e), It === null && (It = e)) : na();
  }
  function na() {
    ee(Ie, Ie.current), ee(Lt, Lt.current);
  }
  function Ut(e) {
    $(Lt), It === e && (It = null), $(Ie);
  }
  var Ie = N(0);
  function gi(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var n = t.memoizedState;
        if (n !== null && (n = n.dehydrated, n === null || Go(n) || Fo(n)))
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
  var Cn = 0, ye = null, Le = null, at = null, xi = !1, gl = !1, Da = !1, bi = 0, ss = 0, xl = null, yg = 0;
  function We() {
    throw Error(o(321));
  }
  function Dr(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++)
      if (!Dt(e[n], t[n])) return !1;
    return !0;
  }
  function Hr(e, t, n, a, i, r) {
    return Cn = r, ye = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, A.H = e === null || e.memoizedState === null ? Lf : Wr, Da = !1, r = n(a, i), Da = !1, gl && (r = tf(
      t,
      n,
      a,
      i
    )), ef(e), r;
  }
  function ef(e) {
    A.H = rs;
    var t = Le !== null && Le.next !== null;
    if (Cn = 0, at = Le = ye = null, xi = !1, ss = 0, xl = null, t) throw Error(o(300));
    e === null || lt || (e = e.dependencies, e !== null && oi(e) && (lt = !0));
  }
  function tf(e, t, n, a) {
    ye = e;
    var i = 0;
    do {
      if (gl && (xl = null), ss = 0, gl = !1, 25 <= i) throw Error(o(301));
      if (i += 1, at = Le = null, e.updateQueue != null) {
        var r = e.updateQueue;
        r.lastEffect = null, r.events = null, r.stores = null, r.memoCache != null && (r.memoCache.index = 0);
      }
      A.H = Uf, r = t(n, a);
    } while (gl);
    return r;
  }
  function wg() {
    var e = A.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? is(t) : t, e = e.useState()[0], (Le !== null ? Le.memoizedState : null) !== e && (ye.flags |= 1024), t;
  }
  function Lr() {
    var e = bi !== 0;
    return bi = 0, e;
  }
  function Ur(e, t, n) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
  }
  function Br(e) {
    if (xi) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      xi = !1;
    }
    Cn = 0, at = Le = ye = null, gl = !1, ss = bi = 0, xl = null;
  }
  function Nt() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return at === null ? ye.memoizedState = at = e : at = at.next = e, at;
  }
  function et() {
    if (Le === null) {
      var e = ye.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Le.next;
    var t = at === null ? ye.memoizedState : at.next;
    if (t !== null)
      at = t, Le = e;
    else {
      if (e === null)
        throw ye.alternate === null ? Error(o(467)) : Error(o(310));
      Le = e, e = {
        memoizedState: Le.memoizedState,
        baseState: Le.baseState,
        baseQueue: Le.baseQueue,
        queue: Le.queue,
        next: null
      }, at === null ? ye.memoizedState = at = e : at = at.next = e;
    }
    return at;
  }
  function _i() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function is(e) {
    var t = ss;
    return ss += 1, xl === null && (xl = []), e = Vd(xl, e, t), t = ye, (at === null ? t.memoizedState : at.next) === null && (t = t.alternate, A.H = t === null || t.memoizedState === null ? Lf : Wr), e;
  }
  function yi(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return is(e);
      if (e.$$typeof === Y) return pt(e);
    }
    throw Error(o(438, String(e)));
  }
  function $r(e) {
    var t = null, n = ye.updateQueue;
    if (n !== null && (t = n.memoCache), t == null) {
      var a = ye.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (t = {
        data: a.data.map(function(i) {
          return i.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), n === null && (n = _i(), ye.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0)
      for (n = t.data[t.index] = Array(e), a = 0; a < e; a++)
        n[a] = xe;
    return t.index++, n;
  }
  function Tn(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function wi(e) {
    var t = et();
    return Gr(t, Le, e);
  }
  function Gr(e, t, n) {
    var a = e.queue;
    if (a === null) throw Error(o(311));
    a.lastRenderedReducer = n;
    var i = e.baseQueue, r = a.pending;
    if (r !== null) {
      if (i !== null) {
        var h = i.next;
        i.next = r.next, r.next = h;
      }
      t.baseQueue = i = r, a.pending = null;
    }
    if (r = e.baseState, i === null) e.memoizedState = r;
    else {
      t = i.next;
      var _ = h = null, S = null, D = t, q = !1;
      do {
        var X = D.lane & -536870913;
        if (X !== D.lane ? (Ee & X) === X : (Cn & X) === X) {
          var L = D.revertLane;
          if (L === 0)
            S !== null && (S = S.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: D.action,
              hasEagerState: D.hasEagerState,
              eagerState: D.eagerState,
              next: null
            }), X === fl && (q = !0);
          else if ((Cn & L) === L) {
            D = D.next, L === fl && (q = !0);
            continue;
          } else
            X = {
              lane: 0,
              revertLane: D.revertLane,
              gesture: null,
              action: D.action,
              hasEagerState: D.hasEagerState,
              eagerState: D.eagerState,
              next: null
            }, S === null ? (_ = S = X, h = r) : S = S.next = X, ye.lanes |= L, sa |= L;
          X = D.action, Da && n(r, X), r = D.hasEagerState ? D.eagerState : n(r, X);
        } else
          L = {
            lane: X,
            revertLane: D.revertLane,
            gesture: D.gesture,
            action: D.action,
            hasEagerState: D.hasEagerState,
            eagerState: D.eagerState,
            next: null
          }, S === null ? (_ = S = L, h = r) : S = S.next = L, ye.lanes |= X, sa |= X;
        D = D.next;
      } while (D !== null && D !== t);
      if (S === null ? h = r : S.next = _, !Dt(r, e.memoizedState) && (lt = !0, q && (n = hl, n !== null)))
        throw n;
      e.memoizedState = r, e.baseState = h, e.baseQueue = S, a.lastRenderedState = r;
    }
    return i === null && (a.lanes = 0), [e.memoizedState, a.dispatch];
  }
  function Fr(e) {
    var t = et(), n = t.queue;
    if (n === null) throw Error(o(311));
    n.lastRenderedReducer = e;
    var a = n.dispatch, i = n.pending, r = t.memoizedState;
    if (i !== null) {
      n.pending = null;
      var h = i = i.next;
      do
        r = e(r, h.action), h = h.next;
      while (h !== i);
      Dt(r, t.memoizedState) || (lt = !0), t.memoizedState = r, t.baseQueue === null && (t.baseState = r), n.lastRenderedState = r;
    }
    return [r, a];
  }
  function nf(e, t, n) {
    var a = ye, i = et(), r = Ce;
    if (r) {
      if (n === void 0) throw Error(o(407));
      n = n();
    } else n = t();
    var h = !Dt(
      (Le || i).memoizedState,
      n
    );
    if (h && (i.memoizedState = n, lt = !0), i = i.queue, Vr(sf.bind(null, a, i, e), [
      e
    ]), i.getSnapshot !== t || h || at !== null && at.memoizedState.tag & 1) {
      if (a.flags |= 2048, bl(
        9,
        { destroy: void 0 },
        lf.bind(
          null,
          a,
          i,
          n,
          t
        ),
        null
      ), Ge === null) throw Error(o(349));
      r || (Cn & 127) !== 0 || af(a, t, n);
    }
    return n;
  }
  function af(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = ye.updateQueue, t === null ? (t = _i(), ye.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function lf(e, t, n, a) {
    t.value = n, t.getSnapshot = a, cf(t) && rf(e);
  }
  function sf(e, t, n) {
    return n(function() {
      cf(t) && rf(e);
    });
  }
  function cf(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !Dt(e, n);
    } catch {
      return !0;
    }
  }
  function rf(e) {
    var t = ka(e, 2);
    t !== null && zt(t, e, 2);
  }
  function qr(e) {
    var t = Nt();
    if (typeof e == "function") {
      var n = e;
      if (e = n(), Da) {
        Vt(!0);
        try {
          n();
        } finally {
          Vt(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = e, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Tn,
      lastRenderedState: e
    }, t;
  }
  function of(e, t, n, a) {
    return e.baseState = n, Gr(
      e,
      Le,
      typeof a == "function" ? a : Tn
    );
  }
  function jg(e, t, n, a, i) {
    if (Ni(e)) throw Error(o(485));
    if (e = t.action, e !== null) {
      var r = {
        payload: i,
        action: e,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(h) {
          r.listeners.push(h);
        }
      };
      A.T !== null ? n(!0) : r.isTransition = !1, a(r), n = t.pending, n === null ? (r.next = t.pending = r, uf(t, r)) : (r.next = n.next, t.pending = n.next = r);
    }
  }
  function uf(e, t) {
    var n = t.action, a = t.payload, i = e.state;
    if (t.isTransition) {
      var r = A.T, h = {};
      A.T = h;
      try {
        var _ = n(i, a), S = A.S;
        S !== null && S(h, _), df(e, t, _);
      } catch (D) {
        Yr(e, t, D);
      } finally {
        r !== null && h.types !== null && (r.types = h.types), A.T = r;
      }
    } else
      try {
        r = n(i, a), df(e, t, r);
      } catch (D) {
        Yr(e, t, D);
      }
  }
  function df(e, t, n) {
    n !== null && typeof n == "object" && typeof n.then == "function" ? n.then(
      function(a) {
        ff(e, t, a);
      },
      function(a) {
        return Yr(e, t, a);
      }
    ) : ff(e, t, n);
  }
  function ff(e, t, n) {
    t.status = "fulfilled", t.value = n, hf(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, uf(e, n)));
  }
  function Yr(e, t, n) {
    var a = e.pending;
    if (e.pending = null, a !== null) {
      a = a.next;
      do
        t.status = "rejected", t.reason = n, hf(t), t = t.next;
      while (t !== a);
    }
    e.action = null;
  }
  function hf(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function mf(e, t) {
    return t;
  }
  function pf(e, t) {
    if (Ce) {
      var n = Ge.formState;
      if (n !== null) {
        e: {
          var a = ye;
          if (Ce) {
            if (Ye) {
              t: {
                for (var i = Ye, r = Pt; i.nodeType !== 8; ) {
                  if (!r) {
                    i = null;
                    break t;
                  }
                  if (i = en(
                    i.nextSibling
                  ), i === null) {
                    i = null;
                    break t;
                  }
                }
                r = i.data, i = r === "F!" || r === "F" ? i : null;
              }
              if (i) {
                Ye = en(
                  i.nextSibling
                ), a = i.data === "F!";
                break e;
              }
            }
            Jn(a);
          }
          a = !1;
        }
        a && (t = n[0]);
      }
    }
    return n = Nt(), n.memoizedState = n.baseState = t, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: mf,
      lastRenderedState: t
    }, n.queue = a, n = Of.bind(
      null,
      ye,
      a
    ), a.dispatch = n, a = qr(!1), r = Jr.bind(
      null,
      ye,
      !1,
      a.queue
    ), a = Nt(), i = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, a.queue = i, n = jg.bind(
      null,
      ye,
      i,
      r,
      n
    ), i.dispatch = n, a.memoizedState = e, [t, n, !1];
  }
  function vf(e) {
    var t = et();
    return gf(t, Le, e);
  }
  function gf(e, t, n) {
    if (t = Gr(
      e,
      t,
      mf
    )[0], e = wi(Tn)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var a = is(t);
      } catch (h) {
        throw h === ml ? fi : h;
      }
    else a = t;
    t = et();
    var i = t.queue, r = i.dispatch;
    return n !== t.memoizedState && (ye.flags |= 2048, bl(
      9,
      { destroy: void 0 },
      Sg.bind(null, i, n),
      null
    )), [a, r, e];
  }
  function Sg(e, t) {
    e.action = t;
  }
  function xf(e) {
    var t = et(), n = Le;
    if (n !== null)
      return gf(t, n, e);
    et(), t = t.memoizedState, n = et();
    var a = n.queue.dispatch;
    return n.memoizedState = e, [t, a, !1];
  }
  function bl(e, t, n, a) {
    return e = { tag: e, create: n, deps: a, inst: t, next: null }, t = ye.updateQueue, t === null && (t = _i(), ye.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (a = n.next, n.next = e, e.next = a, t.lastEffect = e), e;
  }
  function bf() {
    return et().memoizedState;
  }
  function ji(e, t, n, a) {
    var i = Nt();
    ye.flags |= e, i.memoizedState = bl(
      1 | t,
      { destroy: void 0 },
      n,
      a === void 0 ? null : a
    );
  }
  function Si(e, t, n, a) {
    var i = et();
    a = a === void 0 ? null : a;
    var r = i.memoizedState.inst;
    Le !== null && a !== null && Dr(a, Le.memoizedState.deps) ? i.memoizedState = bl(t, r, n, a) : (ye.flags |= e, i.memoizedState = bl(
      1 | t,
      r,
      n,
      a
    ));
  }
  function _f(e, t) {
    ji(8390656, 8, e, t);
  }
  function Vr(e, t) {
    Si(2048, 8, e, t);
  }
  function Ng(e) {
    ye.flags |= 4;
    var t = ye.updateQueue;
    if (t === null)
      t = _i(), ye.updateQueue = t, t.events = [e];
    else {
      var n = t.events;
      n === null ? t.events = [e] : n.push(e);
    }
  }
  function yf(e) {
    var t = et().memoizedState;
    return Ng({ ref: t, nextImpl: e }), function() {
      if ((ze & 2) !== 0) throw Error(o(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function wf(e, t) {
    return Si(4, 2, e, t);
  }
  function jf(e, t) {
    return Si(4, 4, e, t);
  }
  function Sf(e, t) {
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
  function Nf(e, t, n) {
    n = n != null ? n.concat([e]) : null, Si(4, 4, Sf.bind(null, t, e), n);
  }
  function Xr() {
  }
  function kf(e, t) {
    var n = et();
    t = t === void 0 ? null : t;
    var a = n.memoizedState;
    return t !== null && Dr(t, a[1]) ? a[0] : (n.memoizedState = [e, t], e);
  }
  function Ef(e, t) {
    var n = et();
    t = t === void 0 ? null : t;
    var a = n.memoizedState;
    if (t !== null && Dr(t, a[1]))
      return a[0];
    if (a = e(), Da) {
      Vt(!0);
      try {
        e();
      } finally {
        Vt(!1);
      }
    }
    return n.memoizedState = [a, t], a;
  }
  function Qr(e, t, n) {
    return n === void 0 || (Cn & 1073741824) !== 0 && (Ee & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = n, e = Mh(), ye.lanes |= e, sa |= e, n);
  }
  function Mf(e, t, n, a) {
    return Dt(n, t) ? n : vl.current !== null ? (e = Qr(e, n, a), Dt(e, t) || (lt = !0), e) : (Cn & 42) === 0 || (Cn & 1073741824) !== 0 && (Ee & 261930) === 0 ? (lt = !0, e.memoizedState = n) : (e = Mh(), ye.lanes |= e, sa |= e, t);
  }
  function Cf(e, t, n, a, i) {
    var r = H.p;
    H.p = r !== 0 && 8 > r ? r : 8;
    var h = A.T, _ = {};
    A.T = _, Jr(e, !1, t, n);
    try {
      var S = i(), D = A.S;
      if (D !== null && D(_, S), S !== null && typeof S == "object" && typeof S.then == "function") {
        var q = _g(
          S,
          a
        );
        cs(
          e,
          t,
          q,
          Gt(e)
        );
      } else
        cs(
          e,
          t,
          a,
          Gt(e)
        );
    } catch (X) {
      cs(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: X },
        Gt()
      );
    } finally {
      H.p = r, h !== null && _.types !== null && (h.types = _.types), A.T = h;
    }
  }
  function kg() {
  }
  function Zr(e, t, n, a) {
    if (e.tag !== 5) throw Error(o(476));
    var i = Tf(e).queue;
    Cf(
      e,
      i,
      t,
      I,
      n === null ? kg : function() {
        return Af(e), n(a);
      }
    );
  }
  function Tf(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: I,
      baseState: I,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Tn,
        lastRenderedState: I
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
        lastRenderedReducer: Tn,
        lastRenderedState: n
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function Af(e) {
    var t = Tf(e);
    t.next === null && (t = e.alternate.memoizedState), cs(
      e,
      t.next.queue,
      {},
      Gt()
    );
  }
  function Kr() {
    return pt(Ss);
  }
  function Rf() {
    return et().memoizedState;
  }
  function zf() {
    return et().memoizedState;
  }
  function Eg(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var n = Gt();
          e = In(n);
          var a = ea(t, e, n);
          a !== null && (zt(a, t, n), ns(a, t, n)), t = { cache: Sr() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function Mg(e, t, n) {
    var a = Gt();
    n = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Ni(e) ? Df(t, n) : (n = hr(e, t, n, a), n !== null && (zt(n, e, a), Hf(n, t, a)));
  }
  function Of(e, t, n) {
    var a = Gt();
    cs(e, t, n, a);
  }
  function cs(e, t, n, a) {
    var i = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (Ni(e)) Df(t, i);
    else {
      var r = e.alternate;
      if (e.lanes === 0 && (r === null || r.lanes === 0) && (r = t.lastRenderedReducer, r !== null))
        try {
          var h = t.lastRenderedState, _ = r(h, n);
          if (i.hasEagerState = !0, i.eagerState = _, Dt(_, h))
            return si(e, t, i, 0), Ge === null && li(), !1;
        } catch {
        } finally {
        }
      if (n = hr(e, t, i, a), n !== null)
        return zt(n, e, a), Hf(n, t, a), !0;
    }
    return !1;
  }
  function Jr(e, t, n, a) {
    if (a = {
      lane: 2,
      revertLane: Co(),
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Ni(e)) {
      if (t) throw Error(o(479));
    } else
      t = hr(
        e,
        n,
        a,
        2
      ), t !== null && zt(t, e, 2);
  }
  function Ni(e) {
    var t = e.alternate;
    return e === ye || t !== null && t === ye;
  }
  function Df(e, t) {
    gl = xi = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function Hf(e, t, n) {
    if ((n & 4194048) !== 0) {
      var a = t.lanes;
      a &= e.pendingLanes, n |= a, t.lanes = n, $u(e, n);
    }
  }
  var rs = {
    readContext: pt,
    use: yi,
    useCallback: We,
    useContext: We,
    useEffect: We,
    useImperativeHandle: We,
    useLayoutEffect: We,
    useInsertionEffect: We,
    useMemo: We,
    useReducer: We,
    useRef: We,
    useState: We,
    useDebugValue: We,
    useDeferredValue: We,
    useTransition: We,
    useSyncExternalStore: We,
    useId: We,
    useHostTransitionStatus: We,
    useFormState: We,
    useActionState: We,
    useOptimistic: We,
    useMemoCache: We,
    useCacheRefresh: We
  };
  rs.useEffectEvent = We;
  var Lf = {
    readContext: pt,
    use: yi,
    useCallback: function(e, t) {
      return Nt().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: pt,
    useEffect: _f,
    useImperativeHandle: function(e, t, n) {
      n = n != null ? n.concat([e]) : null, ji(
        4194308,
        4,
        Sf.bind(null, t, e),
        n
      );
    },
    useLayoutEffect: function(e, t) {
      return ji(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      ji(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var n = Nt();
      t = t === void 0 ? null : t;
      var a = e();
      if (Da) {
        Vt(!0);
        try {
          e();
        } finally {
          Vt(!1);
        }
      }
      return n.memoizedState = [a, t], a;
    },
    useReducer: function(e, t, n) {
      var a = Nt();
      if (n !== void 0) {
        var i = n(t);
        if (Da) {
          Vt(!0);
          try {
            n(t);
          } finally {
            Vt(!1);
          }
        }
      } else i = t;
      return a.memoizedState = a.baseState = i, e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: i
      }, a.queue = e, e = e.dispatch = Mg.bind(
        null,
        ye,
        e
      ), [a.memoizedState, e];
    },
    useRef: function(e) {
      var t = Nt();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = qr(e);
      var t = e.queue, n = Of.bind(null, ye, t);
      return t.dispatch = n, [e.memoizedState, n];
    },
    useDebugValue: Xr,
    useDeferredValue: function(e, t) {
      var n = Nt();
      return Qr(n, e, t);
    },
    useTransition: function() {
      var e = qr(!1);
      return e = Cf.bind(
        null,
        ye,
        e.queue,
        !0,
        !1
      ), Nt().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, n) {
      var a = ye, i = Nt();
      if (Ce) {
        if (n === void 0)
          throw Error(o(407));
        n = n();
      } else {
        if (n = t(), Ge === null)
          throw Error(o(349));
        (Ee & 127) !== 0 || af(a, t, n);
      }
      i.memoizedState = n;
      var r = { value: n, getSnapshot: t };
      return i.queue = r, _f(sf.bind(null, a, r, e), [
        e
      ]), a.flags |= 2048, bl(
        9,
        { destroy: void 0 },
        lf.bind(
          null,
          a,
          r,
          n,
          t
        ),
        null
      ), n;
    },
    useId: function() {
      var e = Nt(), t = Ge.identifierPrefix;
      if (Ce) {
        var n = fn, a = dn;
        n = (a & ~(1 << 32 - Je(a) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = bi++, 0 < n && (t += "H" + n.toString(32)), t += "_";
      } else
        n = yg++, t = "_" + t + "r_" + n.toString(32) + "_";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: Kr,
    useFormState: pf,
    useActionState: pf,
    useOptimistic: function(e) {
      var t = Nt();
      t.memoizedState = t.baseState = e;
      var n = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = n, t = Jr.bind(
        null,
        ye,
        !0,
        n
      ), n.dispatch = t, [e, t];
    },
    useMemoCache: $r,
    useCacheRefresh: function() {
      return Nt().memoizedState = Eg.bind(
        null,
        ye
      );
    },
    useEffectEvent: function(e) {
      var t = Nt(), n = { impl: e };
      return t.memoizedState = n, function() {
        if ((ze & 2) !== 0)
          throw Error(o(440));
        return n.impl.apply(void 0, arguments);
      };
    }
  }, Wr = {
    readContext: pt,
    use: yi,
    useCallback: kf,
    useContext: pt,
    useEffect: Vr,
    useImperativeHandle: Nf,
    useInsertionEffect: wf,
    useLayoutEffect: jf,
    useMemo: Ef,
    useReducer: wi,
    useRef: bf,
    useState: function() {
      return wi(Tn);
    },
    useDebugValue: Xr,
    useDeferredValue: function(e, t) {
      var n = et();
      return Mf(
        n,
        Le.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = wi(Tn)[0], t = et().memoizedState;
      return [
        typeof e == "boolean" ? e : is(e),
        t
      ];
    },
    useSyncExternalStore: nf,
    useId: Rf,
    useHostTransitionStatus: Kr,
    useFormState: vf,
    useActionState: vf,
    useOptimistic: function(e, t) {
      var n = et();
      return of(n, Le, e, t);
    },
    useMemoCache: $r,
    useCacheRefresh: zf
  };
  Wr.useEffectEvent = yf;
  var Uf = {
    readContext: pt,
    use: yi,
    useCallback: kf,
    useContext: pt,
    useEffect: Vr,
    useImperativeHandle: Nf,
    useInsertionEffect: wf,
    useLayoutEffect: jf,
    useMemo: Ef,
    useReducer: Fr,
    useRef: bf,
    useState: function() {
      return Fr(Tn);
    },
    useDebugValue: Xr,
    useDeferredValue: function(e, t) {
      var n = et();
      return Le === null ? Qr(n, e, t) : Mf(
        n,
        Le.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = Fr(Tn)[0], t = et().memoizedState;
      return [
        typeof e == "boolean" ? e : is(e),
        t
      ];
    },
    useSyncExternalStore: nf,
    useId: Rf,
    useHostTransitionStatus: Kr,
    useFormState: xf,
    useActionState: xf,
    useOptimistic: function(e, t) {
      var n = et();
      return Le !== null ? of(n, Le, e, t) : (n.baseState = e, [e, n.queue.dispatch]);
    },
    useMemoCache: $r,
    useCacheRefresh: zf
  };
  Uf.useEffectEvent = yf;
  function Pr(e, t, n, a) {
    t = e.memoizedState, n = n(a, t), n = n == null ? t : x({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var Ir = {
    enqueueSetState: function(e, t, n) {
      e = e._reactInternals;
      var a = Gt(), i = In(a);
      i.payload = t, n != null && (i.callback = n), t = ea(e, i, a), t !== null && (zt(t, e, a), ns(t, e, a));
    },
    enqueueReplaceState: function(e, t, n) {
      e = e._reactInternals;
      var a = Gt(), i = In(a);
      i.tag = 1, i.payload = t, n != null && (i.callback = n), t = ea(e, i, a), t !== null && (zt(t, e, a), ns(t, e, a));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var n = Gt(), a = In(n);
      a.tag = 2, t != null && (a.callback = t), t = ea(e, a, n), t !== null && (zt(t, e, n), ns(t, e, n));
    }
  };
  function Bf(e, t, n, a, i, r, h) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(a, r, h) : t.prototype && t.prototype.isPureReactComponent ? !Zl(n, a) || !Zl(i, r) : !0;
  }
  function $f(e, t, n, a) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, a), t.state !== e && Ir.enqueueReplaceState(t, t.state, null);
  }
  function Ha(e, t) {
    var n = t;
    if ("ref" in t) {
      n = {};
      for (var a in t)
        a !== "ref" && (n[a] = t[a]);
    }
    if (e = e.defaultProps) {
      n === t && (n = x({}, n));
      for (var i in e)
        n[i] === void 0 && (n[i] = e[i]);
    }
    return n;
  }
  function Gf(e) {
    ai(e);
  }
  function Ff(e) {
    console.error(e);
  }
  function qf(e) {
    ai(e);
  }
  function ki(e, t) {
    try {
      var n = e.onUncaughtError;
      n(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function Yf(e, t, n) {
    try {
      var a = e.onCaughtError;
      a(n.value, {
        componentStack: n.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (i) {
      setTimeout(function() {
        throw i;
      });
    }
  }
  function eo(e, t, n) {
    return n = In(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
      ki(e, t);
    }, n;
  }
  function Vf(e) {
    return e = In(e), e.tag = 3, e;
  }
  function Xf(e, t, n, a) {
    var i = n.type.getDerivedStateFromError;
    if (typeof i == "function") {
      var r = a.value;
      e.payload = function() {
        return i(r);
      }, e.callback = function() {
        Yf(t, n, a);
      };
    }
    var h = n.stateNode;
    h !== null && typeof h.componentDidCatch == "function" && (e.callback = function() {
      Yf(t, n, a), typeof i != "function" && (ia === null ? ia = /* @__PURE__ */ new Set([this]) : ia.add(this));
      var _ = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: _ !== null ? _ : ""
      });
    });
  }
  function Cg(e, t, n, a, i) {
    if (n.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (t = n.alternate, t !== null && dl(
        t,
        n,
        i,
        !0
      ), n = Lt.current, n !== null) {
        switch (n.tag) {
          case 31:
          case 13:
            return It === null ? Ui() : n.alternate === null && Pe === 0 && (Pe = 3), n.flags &= -257, n.flags |= 65536, n.lanes = i, a === hi ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), ko(e, a, i)), !1;
          case 22:
            return n.flags |= 65536, a === hi ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([a]) : n.add(a)), ko(e, a, i)), !1;
        }
        throw Error(o(435, n.tag));
      }
      return ko(e, a, i), Ui(), !1;
    }
    if (Ce)
      return t = Lt.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = i, a !== br && (e = Error(o(422), { cause: a }), Wl(Kt(e, n)))) : (a !== br && (t = Error(o(423), {
        cause: a
      }), Wl(
        Kt(t, n)
      )), e = e.current.alternate, e.flags |= 65536, i &= -i, e.lanes |= i, a = Kt(a, n), i = eo(
        e.stateNode,
        a,
        i
      ), Tr(e, i), Pe !== 4 && (Pe = 2)), !1;
    var r = Error(o(520), { cause: a });
    if (r = Kt(r, n), vs === null ? vs = [r] : vs.push(r), Pe !== 4 && (Pe = 2), t === null) return !0;
    a = Kt(a, n), n = t;
    do {
      switch (n.tag) {
        case 3:
          return n.flags |= 65536, e = i & -i, n.lanes |= e, e = eo(n.stateNode, a, e), Tr(n, e), !1;
        case 1:
          if (t = n.type, r = n.stateNode, (n.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || r !== null && typeof r.componentDidCatch == "function" && (ia === null || !ia.has(r))))
            return n.flags |= 65536, i &= -i, n.lanes |= i, i = Vf(i), Xf(
              i,
              e,
              n,
              a
            ), Tr(n, i), !1;
      }
      n = n.return;
    } while (n !== null);
    return !1;
  }
  var to = Error(o(461)), lt = !1;
  function vt(e, t, n, a) {
    t.child = e === null ? Kd(t, null, n, a) : Oa(
      t,
      e.child,
      n,
      a
    );
  }
  function Qf(e, t, n, a, i) {
    n = n.render;
    var r = t.ref;
    if ("ref" in a) {
      var h = {};
      for (var _ in a)
        _ !== "ref" && (h[_] = a[_]);
    } else h = a;
    return Ta(t), a = Hr(
      e,
      t,
      n,
      h,
      r,
      i
    ), _ = Lr(), e !== null && !lt ? (Ur(e, t, i), An(e, t, i)) : (Ce && _ && gr(t), t.flags |= 1, vt(e, t, a, i), t.child);
  }
  function Zf(e, t, n, a, i) {
    if (e === null) {
      var r = n.type;
      return typeof r == "function" && !mr(r) && r.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = r, Kf(
        e,
        t,
        r,
        a,
        i
      )) : (e = ci(
        n.type,
        null,
        a,
        t,
        t.mode,
        i
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (r = e.child, !oo(e, i)) {
      var h = r.memoizedProps;
      if (n = n.compare, n = n !== null ? n : Zl, n(h, a) && e.ref === t.ref)
        return An(e, t, i);
    }
    return t.flags |= 1, e = Nn(r, a), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Kf(e, t, n, a, i) {
    if (e !== null) {
      var r = e.memoizedProps;
      if (Zl(r, a) && e.ref === t.ref)
        if (lt = !1, t.pendingProps = a = r, oo(e, i))
          (e.flags & 131072) !== 0 && (lt = !0);
        else
          return t.lanes = e.lanes, An(e, t, i);
    }
    return no(
      e,
      t,
      n,
      a,
      i
    );
  }
  function Jf(e, t, n, a) {
    var i = a.children, r = e !== null ? e.memoizedState : null;
    if (e === null && t.stateNode === null && (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), a.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (r = r !== null ? r.baseLanes | n : n, e !== null) {
          for (a = t.child = e.child, i = 0; a !== null; )
            i = i | a.lanes | a.childLanes, a = a.sibling;
          a = i & ~r;
        } else a = 0, t.child = null;
        return Wf(
          e,
          t,
          r,
          n,
          a
        );
      }
      if ((n & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && di(
          t,
          r !== null ? r.cachePool : null
        ), r !== null ? Pd(t, r) : Rr(), Id(t);
      else
        return a = t.lanes = 536870912, Wf(
          e,
          t,
          r !== null ? r.baseLanes | n : n,
          n,
          a
        );
    } else
      r !== null ? (di(t, r.cachePool), Pd(t, r), na(), t.memoizedState = null) : (e !== null && di(t, null), Rr(), na());
    return vt(e, t, i, n), t.child;
  }
  function os(e, t) {
    return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function Wf(e, t, n, a, i) {
    var r = kr();
    return r = r === null ? null : { parent: nt._currentValue, pool: r }, t.memoizedState = {
      baseLanes: n,
      cachePool: r
    }, e !== null && di(t, null), Rr(), Id(t), e !== null && dl(e, t, a, !0), t.childLanes = i, null;
  }
  function Ei(e, t) {
    return t = Ci(
      { mode: t.mode, children: t.children },
      e.mode
    ), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function Pf(e, t, n) {
    return Oa(t, e.child, null, n), e = Ei(t, t.pendingProps), e.flags |= 2, Ut(t), t.memoizedState = null, e;
  }
  function Tg(e, t, n) {
    var a = t.pendingProps, i = (t.flags & 128) !== 0;
    if (t.flags &= -129, e === null) {
      if (Ce) {
        if (a.mode === "hidden")
          return e = Ei(t, a), t.lanes = 536870912, os(null, e);
        if (Or(t), (e = Ye) ? (e = um(
          e,
          Pt
        ), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: Zn !== null ? { id: dn, overflow: fn } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = Od(e), n.return = t, t.child = n, mt = t, Ye = null)) : e = null, e === null) throw Jn(t);
        return t.lanes = 536870912, null;
      }
      return Ei(t, a);
    }
    var r = e.memoizedState;
    if (r !== null) {
      var h = r.dehydrated;
      if (Or(t), i)
        if (t.flags & 256)
          t.flags &= -257, t = Pf(
            e,
            t,
            n
          );
        else if (t.memoizedState !== null)
          t.child = e.child, t.flags |= 128, t = null;
        else throw Error(o(558));
      else if (lt || dl(e, t, n, !1), i = (n & e.childLanes) !== 0, lt || i) {
        if (a = Ge, a !== null && (h = Gu(a, n), h !== 0 && h !== r.retryLane))
          throw r.retryLane = h, ka(e, h), zt(a, e, h), to;
        Ui(), t = Pf(
          e,
          t,
          n
        );
      } else
        e = r.treeContext, Ye = en(h.nextSibling), mt = t, Ce = !0, Kn = null, Pt = !1, e !== null && Ld(t, e), t = Ei(t, a), t.flags |= 4096;
      return t;
    }
    return e = Nn(e.child, {
      mode: a.mode,
      children: a.children
    }), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function Mi(e, t) {
    var n = t.ref;
    if (n === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof n != "function" && typeof n != "object")
        throw Error(o(284));
      (e === null || e.ref !== n) && (t.flags |= 4194816);
    }
  }
  function no(e, t, n, a, i) {
    return Ta(t), n = Hr(
      e,
      t,
      n,
      a,
      void 0,
      i
    ), a = Lr(), e !== null && !lt ? (Ur(e, t, i), An(e, t, i)) : (Ce && a && gr(t), t.flags |= 1, vt(e, t, n, i), t.child);
  }
  function If(e, t, n, a, i, r) {
    return Ta(t), t.updateQueue = null, n = tf(
      t,
      a,
      n,
      i
    ), ef(e), a = Lr(), e !== null && !lt ? (Ur(e, t, r), An(e, t, r)) : (Ce && a && gr(t), t.flags |= 1, vt(e, t, n, r), t.child);
  }
  function eh(e, t, n, a, i) {
    if (Ta(t), t.stateNode === null) {
      var r = cl, h = n.contextType;
      typeof h == "object" && h !== null && (r = pt(h)), r = new n(a, r), t.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = Ir, t.stateNode = r, r._reactInternals = t, r = t.stateNode, r.props = a, r.state = t.memoizedState, r.refs = {}, Mr(t), h = n.contextType, r.context = typeof h == "object" && h !== null ? pt(h) : cl, r.state = t.memoizedState, h = n.getDerivedStateFromProps, typeof h == "function" && (Pr(
        t,
        n,
        h,
        a
      ), r.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof r.getSnapshotBeforeUpdate == "function" || typeof r.UNSAFE_componentWillMount != "function" && typeof r.componentWillMount != "function" || (h = r.state, typeof r.componentWillMount == "function" && r.componentWillMount(), typeof r.UNSAFE_componentWillMount == "function" && r.UNSAFE_componentWillMount(), h !== r.state && Ir.enqueueReplaceState(r, r.state, null), ls(t, a, r, i), as(), r.state = t.memoizedState), typeof r.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (e === null) {
      r = t.stateNode;
      var _ = t.memoizedProps, S = Ha(n, _);
      r.props = S;
      var D = r.context, q = n.contextType;
      h = cl, typeof q == "object" && q !== null && (h = pt(q));
      var X = n.getDerivedStateFromProps;
      q = typeof X == "function" || typeof r.getSnapshotBeforeUpdate == "function", _ = t.pendingProps !== _, q || typeof r.UNSAFE_componentWillReceiveProps != "function" && typeof r.componentWillReceiveProps != "function" || (_ || D !== h) && $f(
        t,
        r,
        a,
        h
      ), Pn = !1;
      var L = t.memoizedState;
      r.state = L, ls(t, a, r, i), as(), D = t.memoizedState, _ || L !== D || Pn ? (typeof X == "function" && (Pr(
        t,
        n,
        X,
        a
      ), D = t.memoizedState), (S = Pn || Bf(
        t,
        n,
        S,
        a,
        L,
        D,
        h
      )) ? (q || typeof r.UNSAFE_componentWillMount != "function" && typeof r.componentWillMount != "function" || (typeof r.componentWillMount == "function" && r.componentWillMount(), typeof r.UNSAFE_componentWillMount == "function" && r.UNSAFE_componentWillMount()), typeof r.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof r.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = D), r.props = a, r.state = D, r.context = h, a = S) : (typeof r.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      r = t.stateNode, Cr(e, t), h = t.memoizedProps, q = Ha(n, h), r.props = q, X = t.pendingProps, L = r.context, D = n.contextType, S = cl, typeof D == "object" && D !== null && (S = pt(D)), _ = n.getDerivedStateFromProps, (D = typeof _ == "function" || typeof r.getSnapshotBeforeUpdate == "function") || typeof r.UNSAFE_componentWillReceiveProps != "function" && typeof r.componentWillReceiveProps != "function" || (h !== X || L !== S) && $f(
        t,
        r,
        a,
        S
      ), Pn = !1, L = t.memoizedState, r.state = L, ls(t, a, r, i), as();
      var B = t.memoizedState;
      h !== X || L !== B || Pn || e !== null && e.dependencies !== null && oi(e.dependencies) ? (typeof _ == "function" && (Pr(
        t,
        n,
        _,
        a
      ), B = t.memoizedState), (q = Pn || Bf(
        t,
        n,
        q,
        a,
        L,
        B,
        S
      ) || e !== null && e.dependencies !== null && oi(e.dependencies)) ? (D || typeof r.UNSAFE_componentWillUpdate != "function" && typeof r.componentWillUpdate != "function" || (typeof r.componentWillUpdate == "function" && r.componentWillUpdate(a, B, S), typeof r.UNSAFE_componentWillUpdate == "function" && r.UNSAFE_componentWillUpdate(
        a,
        B,
        S
      )), typeof r.componentDidUpdate == "function" && (t.flags |= 4), typeof r.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof r.componentDidUpdate != "function" || h === e.memoizedProps && L === e.memoizedState || (t.flags |= 4), typeof r.getSnapshotBeforeUpdate != "function" || h === e.memoizedProps && L === e.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = B), r.props = a, r.state = B, r.context = S, a = q) : (typeof r.componentDidUpdate != "function" || h === e.memoizedProps && L === e.memoizedState || (t.flags |= 4), typeof r.getSnapshotBeforeUpdate != "function" || h === e.memoizedProps && L === e.memoizedState || (t.flags |= 1024), a = !1);
    }
    return r = a, Mi(e, t), a = (t.flags & 128) !== 0, r || a ? (r = t.stateNode, n = a && typeof n.getDerivedStateFromError != "function" ? null : r.render(), t.flags |= 1, e !== null && a ? (t.child = Oa(
      t,
      e.child,
      null,
      i
    ), t.child = Oa(
      t,
      null,
      n,
      i
    )) : vt(e, t, n, i), t.memoizedState = r.state, e = t.child) : e = An(
      e,
      t,
      i
    ), e;
  }
  function th(e, t, n, a) {
    return Ma(), t.flags |= 256, vt(e, t, n, a), t.child;
  }
  var ao = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function lo(e) {
    return { baseLanes: e, cachePool: qd() };
  }
  function so(e, t, n) {
    return e = e !== null ? e.childLanes & ~n : 0, t && (e |= $t), e;
  }
  function nh(e, t, n) {
    var a = t.pendingProps, i = !1, r = (t.flags & 128) !== 0, h;
    if ((h = r) || (h = e !== null && e.memoizedState === null ? !1 : (Ie.current & 2) !== 0), h && (i = !0, t.flags &= -129), h = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (Ce) {
        if (i ? ta(t) : na(), (e = Ye) ? (e = um(
          e,
          Pt
        ), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: Zn !== null ? { id: dn, overflow: fn } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = Od(e), n.return = t, t.child = n, mt = t, Ye = null)) : e = null, e === null) throw Jn(t);
        return Fo(e) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      var _ = a.children;
      return a = a.fallback, i ? (na(), i = t.mode, _ = Ci(
        { mode: "hidden", children: _ },
        i
      ), a = Ea(
        a,
        i,
        n,
        null
      ), _.return = t, a.return = t, _.sibling = a, t.child = _, a = t.child, a.memoizedState = lo(n), a.childLanes = so(
        e,
        h,
        n
      ), t.memoizedState = ao, os(null, a)) : (ta(t), io(t, _));
    }
    var S = e.memoizedState;
    if (S !== null && (_ = S.dehydrated, _ !== null)) {
      if (r)
        t.flags & 256 ? (ta(t), t.flags &= -257, t = co(
          e,
          t,
          n
        )) : t.memoizedState !== null ? (na(), t.child = e.child, t.flags |= 128, t = null) : (na(), _ = a.fallback, i = t.mode, a = Ci(
          { mode: "visible", children: a.children },
          i
        ), _ = Ea(
          _,
          i,
          n,
          null
        ), _.flags |= 2, a.return = t, _.return = t, a.sibling = _, t.child = a, Oa(
          t,
          e.child,
          null,
          n
        ), a = t.child, a.memoizedState = lo(n), a.childLanes = so(
          e,
          h,
          n
        ), t.memoizedState = ao, t = os(null, a));
      else if (ta(t), Fo(_)) {
        if (h = _.nextSibling && _.nextSibling.dataset, h) var D = h.dgst;
        h = D, a = Error(o(419)), a.stack = "", a.digest = h, Wl({ value: a, source: null, stack: null }), t = co(
          e,
          t,
          n
        );
      } else if (lt || dl(e, t, n, !1), h = (n & e.childLanes) !== 0, lt || h) {
        if (h = Ge, h !== null && (a = Gu(h, n), a !== 0 && a !== S.retryLane))
          throw S.retryLane = a, ka(e, a), zt(h, e, a), to;
        Go(_) || Ui(), t = co(
          e,
          t,
          n
        );
      } else
        Go(_) ? (t.flags |= 192, t.child = e.child, t = null) : (e = S.treeContext, Ye = en(
          _.nextSibling
        ), mt = t, Ce = !0, Kn = null, Pt = !1, e !== null && Ld(t, e), t = io(
          t,
          a.children
        ), t.flags |= 4096);
      return t;
    }
    return i ? (na(), _ = a.fallback, i = t.mode, S = e.child, D = S.sibling, a = Nn(S, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = S.subtreeFlags & 65011712, D !== null ? _ = Nn(
      D,
      _
    ) : (_ = Ea(
      _,
      i,
      n,
      null
    ), _.flags |= 2), _.return = t, a.return = t, a.sibling = _, t.child = a, os(null, a), a = t.child, _ = e.child.memoizedState, _ === null ? _ = lo(n) : (i = _.cachePool, i !== null ? (S = nt._currentValue, i = i.parent !== S ? { parent: S, pool: S } : i) : i = qd(), _ = {
      baseLanes: _.baseLanes | n,
      cachePool: i
    }), a.memoizedState = _, a.childLanes = so(
      e,
      h,
      n
    ), t.memoizedState = ao, os(e.child, a)) : (ta(t), n = e.child, e = n.sibling, n = Nn(n, {
      mode: "visible",
      children: a.children
    }), n.return = t, n.sibling = null, e !== null && (h = t.deletions, h === null ? (t.deletions = [e], t.flags |= 16) : h.push(e)), t.child = n, t.memoizedState = null, n);
  }
  function io(e, t) {
    return t = Ci(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function Ci(e, t) {
    return e = Ht(22, e, null, t), e.lanes = 0, e;
  }
  function co(e, t, n) {
    return Oa(t, e.child, null, n), e = io(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function ah(e, t, n) {
    e.lanes |= t;
    var a = e.alternate;
    a !== null && (a.lanes |= t), wr(e.return, t, n);
  }
  function ro(e, t, n, a, i, r) {
    var h = e.memoizedState;
    h === null ? e.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: a,
      tail: n,
      tailMode: i,
      treeForkCount: r
    } : (h.isBackwards = t, h.rendering = null, h.renderingStartTime = 0, h.last = a, h.tail = n, h.tailMode = i, h.treeForkCount = r);
  }
  function lh(e, t, n) {
    var a = t.pendingProps, i = a.revealOrder, r = a.tail;
    a = a.children;
    var h = Ie.current, _ = (h & 2) !== 0;
    if (_ ? (h = h & 1 | 2, t.flags |= 128) : h &= 1, ee(Ie, h), vt(e, t, a, n), a = Ce ? Jl : 0, !_ && e !== null && (e.flags & 128) !== 0)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13)
          e.memoizedState !== null && ah(e, n, t);
        else if (e.tag === 19)
          ah(e, n, t);
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
          e = n.alternate, e !== null && gi(e) === null && (i = n), n = n.sibling;
        n = i, n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), ro(
          t,
          !1,
          i,
          n,
          r,
          a
        );
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (n = null, i = t.child, t.child = null; i !== null; ) {
          if (e = i.alternate, e !== null && gi(e) === null) {
            t.child = i;
            break;
          }
          e = i.sibling, i.sibling = n, n = i, i = e;
        }
        ro(
          t,
          !0,
          n,
          null,
          r,
          a
        );
        break;
      case "together":
        ro(
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
  function An(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), sa |= t.lanes, (n & t.childLanes) === 0)
      if (e !== null) {
        if (dl(
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
      for (e = t.child, n = Nn(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; )
        e = e.sibling, n = n.sibling = Nn(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function oo(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && oi(e)));
  }
  function Ag(e, t, n) {
    switch (t.tag) {
      case 3:
        de(t, t.stateNode.containerInfo), Wn(t, nt, e.memoizedState.cache), Ma();
        break;
      case 27:
      case 5:
        it(t);
        break;
      case 4:
        de(t, t.stateNode.containerInfo);
        break;
      case 10:
        Wn(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 31:
        if (t.memoizedState !== null)
          return t.flags |= 128, Or(t), null;
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null)
          return a.dehydrated !== null ? (ta(t), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? nh(e, t, n) : (ta(t), e = An(
            e,
            t,
            n
          ), e !== null ? e.sibling : null);
        ta(t);
        break;
      case 19:
        var i = (e.flags & 128) !== 0;
        if (a = (n & t.childLanes) !== 0, a || (dl(
          e,
          t,
          n,
          !1
        ), a = (n & t.childLanes) !== 0), i) {
          if (a)
            return lh(
              e,
              t,
              n
            );
          t.flags |= 128;
        }
        if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), ee(Ie, Ie.current), a) break;
        return null;
      case 22:
        return t.lanes = 0, Jf(
          e,
          t,
          n,
          t.pendingProps
        );
      case 24:
        Wn(t, nt, e.memoizedState.cache);
    }
    return An(e, t, n);
  }
  function sh(e, t, n) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        lt = !0;
      else {
        if (!oo(e, n) && (t.flags & 128) === 0)
          return lt = !1, Ag(
            e,
            t,
            n
          );
        lt = (e.flags & 131072) !== 0;
      }
    else
      lt = !1, Ce && (t.flags & 1048576) !== 0 && Hd(t, Jl, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          var a = t.pendingProps;
          if (e = Ra(t.elementType), t.type = e, typeof e == "function")
            mr(e) ? (a = Ha(e, a), t.tag = 1, t = eh(
              null,
              t,
              e,
              a,
              n
            )) : (t.tag = 0, t = no(
              null,
              t,
              e,
              a,
              n
            ));
          else {
            if (e != null) {
              var i = e.$$typeof;
              if (i === P) {
                t.tag = 11, t = Qf(
                  null,
                  t,
                  e,
                  a,
                  n
                );
                break e;
              } else if (i === Q) {
                t.tag = 14, t = Zf(
                  null,
                  t,
                  e,
                  a,
                  n
                );
                break e;
              }
            }
            throw t = K(e) || e, Error(o(306, t, ""));
          }
        }
        return t;
      case 0:
        return no(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 1:
        return a = t.type, i = Ha(
          a,
          t.pendingProps
        ), eh(
          e,
          t,
          a,
          i,
          n
        );
      case 3:
        e: {
          if (de(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(o(387));
          a = t.pendingProps;
          var r = t.memoizedState;
          i = r.element, Cr(e, t), ls(t, a, null, n);
          var h = t.memoizedState;
          if (a = h.cache, Wn(t, nt, a), a !== r.cache && jr(
            t,
            [nt],
            n,
            !0
          ), as(), a = h.element, r.isDehydrated)
            if (r = {
              element: a,
              isDehydrated: !1,
              cache: h.cache
            }, t.updateQueue.baseState = r, t.memoizedState = r, t.flags & 256) {
              t = th(
                e,
                t,
                a,
                n
              );
              break e;
            } else if (a !== i) {
              i = Kt(
                Error(o(424)),
                t
              ), Wl(i), t = th(
                e,
                t,
                a,
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
              for (Ye = en(e.firstChild), mt = t, Ce = !0, Kn = null, Pt = !0, n = Kd(
                t,
                null,
                a,
                n
              ), t.child = n; n; )
                n.flags = n.flags & -3 | 4096, n = n.sibling;
            }
          else {
            if (Ma(), a === i) {
              t = An(
                e,
                t,
                n
              );
              break e;
            }
            vt(e, t, a, n);
          }
          t = t.child;
        }
        return t;
      case 26:
        return Mi(e, t), e === null ? (n = vm(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = n : Ce || (n = t.type, e = t.pendingProps, a = Vi(
          ge.current
        ).createElement(n), a[ht] = t, a[Et] = e, gt(a, n, e), ot(a), t.stateNode = a) : t.memoizedState = vm(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return it(t), e === null && Ce && (a = t.stateNode = hm(
          t.type,
          t.pendingProps,
          ge.current
        ), mt = t, Pt = !0, i = Ye, ua(t.type) ? (qo = i, Ye = en(a.firstChild)) : Ye = i), vt(
          e,
          t,
          t.pendingProps.children,
          n
        ), Mi(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && Ce && ((i = a = Ye) && (a = cx(
          a,
          t.type,
          t.pendingProps,
          Pt
        ), a !== null ? (t.stateNode = a, mt = t, Ye = en(a.firstChild), Pt = !1, i = !0) : i = !1), i || Jn(t)), it(t), i = t.type, r = t.pendingProps, h = e !== null ? e.memoizedProps : null, a = r.children, Uo(i, r) ? a = null : h !== null && Uo(i, h) && (t.flags |= 32), t.memoizedState !== null && (i = Hr(
          e,
          t,
          wg,
          null,
          null,
          n
        ), Ss._currentValue = i), Mi(e, t), vt(e, t, a, n), t.child;
      case 6:
        return e === null && Ce && ((e = n = Ye) && (n = rx(
          n,
          t.pendingProps,
          Pt
        ), n !== null ? (t.stateNode = n, mt = t, Ye = null, e = !0) : e = !1), e || Jn(t)), null;
      case 13:
        return nh(e, t, n);
      case 4:
        return de(
          t,
          t.stateNode.containerInfo
        ), a = t.pendingProps, e === null ? t.child = Oa(
          t,
          null,
          a,
          n
        ) : vt(e, t, a, n), t.child;
      case 11:
        return Qf(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 7:
        return vt(
          e,
          t,
          t.pendingProps,
          n
        ), t.child;
      case 8:
        return vt(
          e,
          t,
          t.pendingProps.children,
          n
        ), t.child;
      case 12:
        return vt(
          e,
          t,
          t.pendingProps.children,
          n
        ), t.child;
      case 10:
        return a = t.pendingProps, Wn(t, t.type, a.value), vt(e, t, a.children, n), t.child;
      case 9:
        return i = t.type._context, a = t.pendingProps.children, Ta(t), i = pt(i), a = a(i), t.flags |= 1, vt(e, t, a, n), t.child;
      case 14:
        return Zf(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 15:
        return Kf(
          e,
          t,
          t.type,
          t.pendingProps,
          n
        );
      case 19:
        return lh(e, t, n);
      case 31:
        return Tg(e, t, n);
      case 22:
        return Jf(
          e,
          t,
          n,
          t.pendingProps
        );
      case 24:
        return Ta(t), a = pt(nt), e === null ? (i = kr(), i === null && (i = Ge, r = Sr(), i.pooledCache = r, r.refCount++, r !== null && (i.pooledCacheLanes |= n), i = r), t.memoizedState = { parent: a, cache: i }, Mr(t), Wn(t, nt, i)) : ((e.lanes & n) !== 0 && (Cr(e, t), ls(t, null, null, n), as()), i = e.memoizedState, r = t.memoizedState, i.parent !== a ? (i = { parent: a, cache: a }, t.memoizedState = i, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = i), Wn(t, nt, a)) : (a = r.cache, Wn(t, nt, a), a !== i.cache && jr(
          t,
          [nt],
          n,
          !0
        ))), vt(
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
  function Rn(e) {
    e.flags |= 4;
  }
  function uo(e, t, n, a, i) {
    if ((t = (e.mode & 32) !== 0) && (t = !1), t) {
      if (e.flags |= 16777216, (i & 335544128) === i)
        if (e.stateNode.complete) e.flags |= 8192;
        else if (Rh()) e.flags |= 8192;
        else
          throw za = hi, Er;
    } else e.flags &= -16777217;
  }
  function ih(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !ym(t))
      if (Rh()) e.flags |= 8192;
      else
        throw za = hi, Er;
  }
  function Ti(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? Uu() : 536870912, e.lanes |= t, jl |= t);
  }
  function us(e, t) {
    if (!Ce)
      switch (e.tailMode) {
        case "hidden":
          t = e.tail;
          for (var n = null; t !== null; )
            t.alternate !== null && (n = t), t = t.sibling;
          n === null ? e.tail = null : n.sibling = null;
          break;
        case "collapsed":
          n = e.tail;
          for (var a = null; n !== null; )
            n.alternate !== null && (a = n), n = n.sibling;
          a === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : a.sibling = null;
      }
  }
  function Ve(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, a = 0;
    if (t)
      for (var i = e.child; i !== null; )
        n |= i.lanes | i.childLanes, a |= i.subtreeFlags & 65011712, a |= i.flags & 65011712, i.return = e, i = i.sibling;
    else
      for (i = e.child; i !== null; )
        n |= i.lanes | i.childLanes, a |= i.subtreeFlags, a |= i.flags, i.return = e, i = i.sibling;
    return e.subtreeFlags |= a, e.childLanes = n, t;
  }
  function Rg(e, t, n) {
    var a = t.pendingProps;
    switch (xr(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Ve(t), null;
      case 1:
        return Ve(t), null;
      case 3:
        return n = t.stateNode, a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), Mn(nt), we(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (ul(t) ? Rn(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, _r())), Ve(t), null;
      case 26:
        var i = t.type, r = t.memoizedState;
        return e === null ? (Rn(t), r !== null ? (Ve(t), ih(t, r)) : (Ve(t), uo(
          t,
          i,
          null,
          a,
          n
        ))) : r ? r !== e.memoizedState ? (Rn(t), Ve(t), ih(t, r)) : (Ve(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== a && Rn(t), Ve(t), uo(
          t,
          i,
          e,
          a,
          n
        )), null;
      case 27:
        if (ft(t), n = ge.current, i = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && Rn(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(o(166));
            return Ve(t), null;
          }
          e = ne.current, ul(t) ? Ud(t) : (e = hm(i, a, n), t.stateNode = e, Rn(t));
        }
        return Ve(t), null;
      case 5:
        if (ft(t), i = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && Rn(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(o(166));
            return Ve(t), null;
          }
          if (r = ne.current, ul(t))
            Ud(t);
          else {
            var h = Vi(
              ge.current
            );
            switch (r) {
              case 1:
                r = h.createElementNS(
                  "http://www.w3.org/2000/svg",
                  i
                );
                break;
              case 2:
                r = h.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  i
                );
                break;
              default:
                switch (i) {
                  case "svg":
                    r = h.createElementNS(
                      "http://www.w3.org/2000/svg",
                      i
                    );
                    break;
                  case "math":
                    r = h.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      i
                    );
                    break;
                  case "script":
                    r = h.createElement("div"), r.innerHTML = "<script><\/script>", r = r.removeChild(
                      r.firstChild
                    );
                    break;
                  case "select":
                    r = typeof a.is == "string" ? h.createElement("select", {
                      is: a.is
                    }) : h.createElement("select"), a.multiple ? r.multiple = !0 : a.size && (r.size = a.size);
                    break;
                  default:
                    r = typeof a.is == "string" ? h.createElement(i, { is: a.is }) : h.createElement(i);
                }
            }
            r[ht] = t, r[Et] = a;
            e: for (h = t.child; h !== null; ) {
              if (h.tag === 5 || h.tag === 6)
                r.appendChild(h.stateNode);
              else if (h.tag !== 4 && h.tag !== 27 && h.child !== null) {
                h.child.return = h, h = h.child;
                continue;
              }
              if (h === t) break e;
              for (; h.sibling === null; ) {
                if (h.return === null || h.return === t)
                  break e;
                h = h.return;
              }
              h.sibling.return = h.return, h = h.sibling;
            }
            t.stateNode = r;
            e: switch (gt(r, i, a), i) {
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
            a && Rn(t);
          }
        }
        return Ve(t), uo(
          t,
          t.type,
          e === null ? null : e.memoizedProps,
          t.pendingProps,
          n
        ), null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== a && Rn(t);
        else {
          if (typeof a != "string" && t.stateNode === null)
            throw Error(o(166));
          if (e = ge.current, ul(t)) {
            if (e = t.stateNode, n = t.memoizedProps, a = null, i = mt, i !== null)
              switch (i.tag) {
                case 27:
                case 5:
                  a = i.memoizedProps;
              }
            e[ht] = t, e = !!(e.nodeValue === n || a !== null && a.suppressHydrationWarning === !0 || nm(e.nodeValue, n)), e || Jn(t, !0);
          } else
            e = Vi(e).createTextNode(
              a
            ), e[ht] = t, t.stateNode = e;
        }
        return Ve(t), null;
      case 31:
        if (n = t.memoizedState, e === null || e.memoizedState !== null) {
          if (a = ul(t), n !== null) {
            if (e === null) {
              if (!a) throw Error(o(318));
              if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(557));
              e[ht] = t;
            } else
              Ma(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Ve(t), e = !1;
          } else
            n = _r(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
          if (!e)
            return t.flags & 256 ? (Ut(t), t) : (Ut(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(o(558));
        }
        return Ve(t), null;
      case 13:
        if (a = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (i = ul(t), a !== null && a.dehydrated !== null) {
            if (e === null) {
              if (!i) throw Error(o(318));
              if (i = t.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(o(317));
              i[ht] = t;
            } else
              Ma(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Ve(t), i = !1;
          } else
            i = _r(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = i), i = !0;
          if (!i)
            return t.flags & 256 ? (Ut(t), t) : (Ut(t), null);
        }
        return Ut(t), (t.flags & 128) !== 0 ? (t.lanes = n, t) : (n = a !== null, e = e !== null && e.memoizedState !== null, n && (a = t.child, i = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (i = a.alternate.memoizedState.cachePool.pool), r = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (r = a.memoizedState.cachePool.pool), r !== i && (a.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), Ti(t, t.updateQueue), Ve(t), null);
      case 4:
        return we(), e === null && zo(t.stateNode.containerInfo), Ve(t), null;
      case 10:
        return Mn(t.type), Ve(t), null;
      case 19:
        if ($(Ie), a = t.memoizedState, a === null) return Ve(t), null;
        if (i = (t.flags & 128) !== 0, r = a.rendering, r === null)
          if (i) us(a, !1);
          else {
            if (Pe !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (r = gi(e), r !== null) {
                  for (t.flags |= 128, us(a, !1), e = r.updateQueue, t.updateQueue = e, Ti(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null; )
                    zd(n, e), n = n.sibling;
                  return ee(
                    Ie,
                    Ie.current & 1 | 2
                  ), Ce && kn(t, a.treeForkCount), t.child;
                }
                e = e.sibling;
              }
            a.tail !== null && St() > Di && (t.flags |= 128, i = !0, us(a, !1), t.lanes = 4194304);
          }
        else {
          if (!i)
            if (e = gi(r), e !== null) {
              if (t.flags |= 128, i = !0, e = e.updateQueue, t.updateQueue = e, Ti(t, e), us(a, !0), a.tail === null && a.tailMode === "hidden" && !r.alternate && !Ce)
                return Ve(t), null;
            } else
              2 * St() - a.renderingStartTime > Di && n !== 536870912 && (t.flags |= 128, i = !0, us(a, !1), t.lanes = 4194304);
          a.isBackwards ? (r.sibling = t.child, t.child = r) : (e = a.last, e !== null ? e.sibling = r : t.child = r, a.last = r);
        }
        return a.tail !== null ? (e = a.tail, a.rendering = e, a.tail = e.sibling, a.renderingStartTime = St(), e.sibling = null, n = Ie.current, ee(
          Ie,
          i ? n & 1 | 2 : n & 1
        ), Ce && kn(t, a.treeForkCount), e) : (Ve(t), null);
      case 22:
      case 23:
        return Ut(t), zr(), a = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (n & 536870912) !== 0 && (t.flags & 128) === 0 && (Ve(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Ve(t), n = t.updateQueue, n !== null && Ti(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== n && (t.flags |= 2048), e !== null && $(Aa), null;
      case 24:
        return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), Mn(nt), Ve(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(o(156, t.tag));
  }
  function zg(e, t) {
    switch (xr(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Mn(nt), we(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return ft(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (Ut(t), t.alternate === null)
            throw Error(o(340));
          Ma();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 13:
        if (Ut(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(o(340));
          Ma();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return $(Ie), null;
      case 4:
        return we(), null;
      case 10:
        return Mn(t.type), null;
      case 22:
      case 23:
        return Ut(t), zr(), e !== null && $(Aa), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return Mn(nt), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function ch(e, t) {
    switch (xr(t), t.tag) {
      case 3:
        Mn(nt), we();
        break;
      case 26:
      case 27:
      case 5:
        ft(t);
        break;
      case 4:
        we();
        break;
      case 31:
        t.memoizedState !== null && Ut(t);
        break;
      case 13:
        Ut(t);
        break;
      case 19:
        $(Ie);
        break;
      case 10:
        Mn(t.type);
        break;
      case 22:
      case 23:
        Ut(t), zr(), e !== null && $(Aa);
        break;
      case 24:
        Mn(nt);
    }
  }
  function ds(e, t) {
    try {
      var n = t.updateQueue, a = n !== null ? n.lastEffect : null;
      if (a !== null) {
        var i = a.next;
        n = i;
        do {
          if ((n.tag & e) === e) {
            a = void 0;
            var r = n.create, h = n.inst;
            a = r(), h.destroy = a;
          }
          n = n.next;
        } while (n !== i);
      }
    } catch (_) {
      De(t, t.return, _);
    }
  }
  function aa(e, t, n) {
    try {
      var a = t.updateQueue, i = a !== null ? a.lastEffect : null;
      if (i !== null) {
        var r = i.next;
        a = r;
        do {
          if ((a.tag & e) === e) {
            var h = a.inst, _ = h.destroy;
            if (_ !== void 0) {
              h.destroy = void 0, i = t;
              var S = n, D = _;
              try {
                D();
              } catch (q) {
                De(
                  i,
                  S,
                  q
                );
              }
            }
          }
          a = a.next;
        } while (a !== r);
      }
    } catch (q) {
      De(t, t.return, q);
    }
  }
  function rh(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var n = e.stateNode;
      try {
        Wd(t, n);
      } catch (a) {
        De(e, e.return, a);
      }
    }
  }
  function oh(e, t, n) {
    n.props = Ha(
      e.type,
      e.memoizedProps
    ), n.state = e.memoizedState;
    try {
      n.componentWillUnmount();
    } catch (a) {
      De(e, t, a);
    }
  }
  function fs(e, t) {
    try {
      var n = e.ref;
      if (n !== null) {
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
        typeof n == "function" ? e.refCleanup = n(a) : n.current = a;
      }
    } catch (i) {
      De(e, t, i);
    }
  }
  function hn(e, t) {
    var n = e.ref, a = e.refCleanup;
    if (n !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (i) {
          De(e, t, i);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof n == "function")
        try {
          n(null);
        } catch (i) {
          De(e, t, i);
        }
      else n.current = null;
  }
  function uh(e) {
    var t = e.type, n = e.memoizedProps, a = e.stateNode;
    try {
      e: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          n.autoFocus && a.focus();
          break e;
        case "img":
          n.src ? a.src = n.src : n.srcSet && (a.srcset = n.srcSet);
      }
    } catch (i) {
      De(e, e.return, i);
    }
  }
  function fo(e, t, n) {
    try {
      var a = e.stateNode;
      tx(a, e.type, n, t), a[Et] = t;
    } catch (i) {
      De(e, e.return, i);
    }
  }
  function dh(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && ua(e.type) || e.tag === 4;
  }
  function ho(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || dh(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && ua(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function mo(e, t, n) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(e, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(e), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = jn));
    else if (a !== 4 && (a === 27 && ua(e.type) && (n = e.stateNode, t = null), e = e.child, e !== null))
      for (mo(e, t, n), e = e.sibling; e !== null; )
        mo(e, t, n), e = e.sibling;
  }
  function Ai(e, t, n) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (a !== 4 && (a === 27 && ua(e.type) && (n = e.stateNode), e = e.child, e !== null))
      for (Ai(e, t, n), e = e.sibling; e !== null; )
        Ai(e, t, n), e = e.sibling;
  }
  function fh(e) {
    var t = e.stateNode, n = e.memoizedProps;
    try {
      for (var a = e.type, i = t.attributes; i.length; )
        t.removeAttributeNode(i[0]);
      gt(t, a, n), t[ht] = e, t[Et] = n;
    } catch (r) {
      De(e, e.return, r);
    }
  }
  var zn = !1, st = !1, po = !1, hh = typeof WeakSet == "function" ? WeakSet : Set, ut = null;
  function Og(e, t) {
    if (e = e.containerInfo, Ho = Pi, e = Sd(e), cr(e)) {
      if ("selectionStart" in e)
        var n = {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      else
        e: {
          n = (n = e.ownerDocument) && n.defaultView || window;
          var a = n.getSelection && n.getSelection();
          if (a && a.rangeCount !== 0) {
            n = a.anchorNode;
            var i = a.anchorOffset, r = a.focusNode;
            a = a.focusOffset;
            try {
              n.nodeType, r.nodeType;
            } catch {
              n = null;
              break e;
            }
            var h = 0, _ = -1, S = -1, D = 0, q = 0, X = e, L = null;
            t: for (; ; ) {
              for (var B; X !== n || i !== 0 && X.nodeType !== 3 || (_ = h + i), X !== r || a !== 0 && X.nodeType !== 3 || (S = h + a), X.nodeType === 3 && (h += X.nodeValue.length), (B = X.firstChild) !== null; )
                L = X, X = B;
              for (; ; ) {
                if (X === e) break t;
                if (L === n && ++D === i && (_ = h), L === r && ++q === a && (S = h), (B = X.nextSibling) !== null) break;
                X = L, L = X.parentNode;
              }
              X = B;
            }
            n = _ === -1 || S === -1 ? null : { start: _, end: S };
          } else n = null;
        }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (Lo = { focusedElem: e, selectionRange: n }, Pi = !1, ut = t; ut !== null; )
      if (t = ut, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null)
        e.return = t, ut = e;
      else
        for (; ut !== null; ) {
          switch (t = ut, r = t.alternate, e = t.flags, t.tag) {
            case 0:
              if ((e & 4) !== 0 && (e = t.updateQueue, e = e !== null ? e.events : null, e !== null))
                for (n = 0; n < e.length; n++)
                  i = e[n], i.ref.impl = i.nextImpl;
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && r !== null) {
                e = void 0, n = t, i = r.memoizedProps, r = r.memoizedState, a = n.stateNode;
                try {
                  var le = Ha(
                    n.type,
                    i
                  );
                  e = a.getSnapshotBeforeUpdate(
                    le,
                    r
                  ), a.__reactInternalSnapshotBeforeUpdate = e;
                } catch (me) {
                  De(
                    n,
                    n.return,
                    me
                  );
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (e = t.stateNode.containerInfo, n = e.nodeType, n === 9)
                  $o(e);
                else if (n === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      $o(e);
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
            e.return = t.return, ut = e;
            break;
          }
          ut = t.return;
        }
  }
  function mh(e, t, n) {
    var a = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        Dn(e, n), a & 4 && ds(5, n);
        break;
      case 1:
        if (Dn(e, n), a & 4)
          if (e = n.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (h) {
              De(n, n.return, h);
            }
          else {
            var i = Ha(
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
            } catch (h) {
              De(
                n,
                n.return,
                h
              );
            }
          }
        a & 64 && rh(n), a & 512 && fs(n, n.return);
        break;
      case 3:
        if (Dn(e, n), a & 64 && (e = n.updateQueue, e !== null)) {
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
            Wd(e, t);
          } catch (h) {
            De(n, n.return, h);
          }
        }
        break;
      case 27:
        t === null && a & 4 && fh(n);
      case 26:
      case 5:
        Dn(e, n), t === null && a & 4 && uh(n), a & 512 && fs(n, n.return);
        break;
      case 12:
        Dn(e, n);
        break;
      case 31:
        Dn(e, n), a & 4 && gh(e, n);
        break;
      case 13:
        Dn(e, n), a & 4 && xh(e, n), a & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = qg.bind(
          null,
          n
        ), ox(e, n))));
        break;
      case 22:
        if (a = n.memoizedState !== null || zn, !a) {
          t = t !== null && t.memoizedState !== null || st, i = zn;
          var r = st;
          zn = a, (st = t) && !r ? Hn(
            e,
            n,
            (n.subtreeFlags & 8772) !== 0
          ) : Dn(e, n), zn = i, st = r;
        }
        break;
      case 30:
        break;
      default:
        Dn(e, n);
    }
  }
  function ph(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, ph(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && Yc(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var Xe = null, Ct = !1;
  function On(e, t, n) {
    for (n = n.child; n !== null; )
      vh(e, t, n), n = n.sibling;
  }
  function vh(e, t, n) {
    if (bt && typeof bt.onCommitFiberUnmount == "function")
      try {
        bt.onCommitFiberUnmount(Vn, n);
      } catch {
      }
    switch (n.tag) {
      case 26:
        st || hn(n, t), On(
          e,
          t,
          n
        ), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (n = n.stateNode, n.parentNode.removeChild(n));
        break;
      case 27:
        st || hn(n, t);
        var a = Xe, i = Ct;
        ua(n.type) && (Xe = n.stateNode, Ct = !1), On(
          e,
          t,
          n
        ), ys(n.stateNode), Xe = a, Ct = i;
        break;
      case 5:
        st || hn(n, t);
      case 6:
        if (a = Xe, i = Ct, Xe = null, On(
          e,
          t,
          n
        ), Xe = a, Ct = i, Xe !== null)
          if (Ct)
            try {
              (Xe.nodeType === 9 ? Xe.body : Xe.nodeName === "HTML" ? Xe.ownerDocument.body : Xe).removeChild(n.stateNode);
            } catch (r) {
              De(
                n,
                t,
                r
              );
            }
          else
            try {
              Xe.removeChild(n.stateNode);
            } catch (r) {
              De(
                n,
                t,
                r
              );
            }
        break;
      case 18:
        Xe !== null && (Ct ? (e = Xe, rm(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          n.stateNode
        ), Al(e)) : rm(Xe, n.stateNode));
        break;
      case 4:
        a = Xe, i = Ct, Xe = n.stateNode.containerInfo, Ct = !0, On(
          e,
          t,
          n
        ), Xe = a, Ct = i;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        aa(2, n, t), st || aa(4, n, t), On(
          e,
          t,
          n
        );
        break;
      case 1:
        st || (hn(n, t), a = n.stateNode, typeof a.componentWillUnmount == "function" && oh(
          n,
          t,
          a
        )), On(
          e,
          t,
          n
        );
        break;
      case 21:
        On(
          e,
          t,
          n
        );
        break;
      case 22:
        st = (a = st) || n.memoizedState !== null, On(
          e,
          t,
          n
        ), st = a;
        break;
      default:
        On(
          e,
          t,
          n
        );
    }
  }
  function gh(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
      e = e.dehydrated;
      try {
        Al(e);
      } catch (n) {
        De(t, t.return, n);
      }
    }
  }
  function xh(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        Al(e);
      } catch (n) {
        De(t, t.return, n);
      }
  }
  function Dg(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new hh()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new hh()), t;
      default:
        throw Error(o(435, e.tag));
    }
  }
  function Ri(e, t) {
    var n = Dg(e);
    t.forEach(function(a) {
      if (!n.has(a)) {
        n.add(a);
        var i = Yg.bind(null, e, a);
        a.then(i, i);
      }
    });
  }
  function Tt(e, t) {
    var n = t.deletions;
    if (n !== null)
      for (var a = 0; a < n.length; a++) {
        var i = n[a], r = e, h = t, _ = h;
        e: for (; _ !== null; ) {
          switch (_.tag) {
            case 27:
              if (ua(_.type)) {
                Xe = _.stateNode, Ct = !1;
                break e;
              }
              break;
            case 5:
              Xe = _.stateNode, Ct = !1;
              break e;
            case 3:
            case 4:
              Xe = _.stateNode.containerInfo, Ct = !0;
              break e;
          }
          _ = _.return;
        }
        if (Xe === null) throw Error(o(160));
        vh(r, h, i), Xe = null, Ct = !1, r = i.alternate, r !== null && (r.return = null), i.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        bh(t, e), t = t.sibling;
  }
  var cn = null;
  function bh(e, t) {
    var n = e.alternate, a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        Tt(t, e), At(e), a & 4 && (aa(3, e, e.return), ds(3, e), aa(5, e, e.return));
        break;
      case 1:
        Tt(t, e), At(e), a & 512 && (st || n === null || hn(n, n.return)), a & 64 && zn && (e = e.updateQueue, e !== null && (a = e.callbacks, a !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? a : n.concat(a))));
        break;
      case 26:
        var i = cn;
        if (Tt(t, e), At(e), a & 512 && (st || n === null || hn(n, n.return)), a & 4) {
          var r = n !== null ? n.memoizedState : null;
          if (a = e.memoizedState, n === null)
            if (a === null)
              if (e.stateNode === null) {
                e: {
                  a = e.type, n = e.memoizedProps, i = i.ownerDocument || i;
                  t: switch (a) {
                    case "title":
                      r = i.getElementsByTagName("title")[0], (!r || r[Bl] || r[ht] || r.namespaceURI === "http://www.w3.org/2000/svg" || r.hasAttribute("itemprop")) && (r = i.createElement(a), i.head.insertBefore(
                        r,
                        i.querySelector("head > title")
                      )), gt(r, a, n), r[ht] = e, ot(r), a = r;
                      break e;
                    case "link":
                      var h = bm(
                        "link",
                        "href",
                        i
                      ).get(a + (n.href || ""));
                      if (h) {
                        for (var _ = 0; _ < h.length; _++)
                          if (r = h[_], r.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && r.getAttribute("rel") === (n.rel == null ? null : n.rel) && r.getAttribute("title") === (n.title == null ? null : n.title) && r.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
                            h.splice(_, 1);
                            break t;
                          }
                      }
                      r = i.createElement(a), gt(r, a, n), i.head.appendChild(r);
                      break;
                    case "meta":
                      if (h = bm(
                        "meta",
                        "content",
                        i
                      ).get(a + (n.content || ""))) {
                        for (_ = 0; _ < h.length; _++)
                          if (r = h[_], r.getAttribute("content") === (n.content == null ? null : "" + n.content) && r.getAttribute("name") === (n.name == null ? null : n.name) && r.getAttribute("property") === (n.property == null ? null : n.property) && r.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && r.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
                            h.splice(_, 1);
                            break t;
                          }
                      }
                      r = i.createElement(a), gt(r, a, n), i.head.appendChild(r);
                      break;
                    default:
                      throw Error(o(468, a));
                  }
                  r[ht] = e, ot(r), a = r;
                }
                e.stateNode = a;
              } else
                _m(
                  i,
                  e.type,
                  e.stateNode
                );
            else
              e.stateNode = xm(
                i,
                a,
                e.memoizedProps
              );
          else
            r !== a ? (r === null ? n.stateNode !== null && (n = n.stateNode, n.parentNode.removeChild(n)) : r.count--, a === null ? _m(
              i,
              e.type,
              e.stateNode
            ) : xm(
              i,
              a,
              e.memoizedProps
            )) : a === null && e.stateNode !== null && fo(
              e,
              e.memoizedProps,
              n.memoizedProps
            );
        }
        break;
      case 27:
        Tt(t, e), At(e), a & 512 && (st || n === null || hn(n, n.return)), n !== null && a & 4 && fo(
          e,
          e.memoizedProps,
          n.memoizedProps
        );
        break;
      case 5:
        if (Tt(t, e), At(e), a & 512 && (st || n === null || hn(n, n.return)), e.flags & 32) {
          i = e.stateNode;
          try {
            el(i, "");
          } catch (le) {
            De(e, e.return, le);
          }
        }
        a & 4 && e.stateNode != null && (i = e.memoizedProps, fo(
          e,
          i,
          n !== null ? n.memoizedProps : i
        )), a & 1024 && (po = !0);
        break;
      case 6:
        if (Tt(t, e), At(e), a & 4) {
          if (e.stateNode === null)
            throw Error(o(162));
          a = e.memoizedProps, n = e.stateNode;
          try {
            n.nodeValue = a;
          } catch (le) {
            De(e, e.return, le);
          }
        }
        break;
      case 3:
        if (Zi = null, i = cn, cn = Xi(t.containerInfo), Tt(t, e), cn = i, At(e), a & 4 && n !== null && n.memoizedState.isDehydrated)
          try {
            Al(t.containerInfo);
          } catch (le) {
            De(e, e.return, le);
          }
        po && (po = !1, _h(e));
        break;
      case 4:
        a = cn, cn = Xi(
          e.stateNode.containerInfo
        ), Tt(t, e), At(e), cn = a;
        break;
      case 12:
        Tt(t, e), At(e);
        break;
      case 31:
        Tt(t, e), At(e), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, Ri(e, a)));
        break;
      case 13:
        Tt(t, e), At(e), e.child.flags & 8192 && e.memoizedState !== null != (n !== null && n.memoizedState !== null) && (Oi = St()), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, Ri(e, a)));
        break;
      case 22:
        i = e.memoizedState !== null;
        var S = n !== null && n.memoizedState !== null, D = zn, q = st;
        if (zn = D || i, st = q || S, Tt(t, e), st = q, zn = D, At(e), a & 8192)
          e: for (t = e.stateNode, t._visibility = i ? t._visibility & -2 : t._visibility | 1, i && (n === null || S || zn || st || La(e)), n = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (n === null) {
                S = n = t;
                try {
                  if (r = S.stateNode, i)
                    h = r.style, typeof h.setProperty == "function" ? h.setProperty("display", "none", "important") : h.display = "none";
                  else {
                    _ = S.stateNode;
                    var X = S.memoizedProps.style, L = X != null && X.hasOwnProperty("display") ? X.display : null;
                    _.style.display = L == null || typeof L == "boolean" ? "" : ("" + L).trim();
                  }
                } catch (le) {
                  De(S, S.return, le);
                }
              }
            } else if (t.tag === 6) {
              if (n === null) {
                S = t;
                try {
                  S.stateNode.nodeValue = i ? "" : S.memoizedProps;
                } catch (le) {
                  De(S, S.return, le);
                }
              }
            } else if (t.tag === 18) {
              if (n === null) {
                S = t;
                try {
                  var B = S.stateNode;
                  i ? om(B, !0) : om(S.stateNode, !1);
                } catch (le) {
                  De(S, S.return, le);
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
        a & 4 && (a = e.updateQueue, a !== null && (n = a.retryQueue, n !== null && (a.retryQueue = null, Ri(e, n))));
        break;
      case 19:
        Tt(t, e), At(e), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, Ri(e, a)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        Tt(t, e), At(e);
    }
  }
  function At(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var n, a = e.return; a !== null; ) {
          if (dh(a)) {
            n = a;
            break;
          }
          a = a.return;
        }
        if (n == null) throw Error(o(160));
        switch (n.tag) {
          case 27:
            var i = n.stateNode, r = ho(e);
            Ai(e, r, i);
            break;
          case 5:
            var h = n.stateNode;
            n.flags & 32 && (el(h, ""), n.flags &= -33);
            var _ = ho(e);
            Ai(e, _, h);
            break;
          case 3:
          case 4:
            var S = n.stateNode.containerInfo, D = ho(e);
            mo(
              e,
              D,
              S
            );
            break;
          default:
            throw Error(o(161));
        }
      } catch (q) {
        De(e, e.return, q);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function _h(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        _h(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
  }
  function Dn(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        mh(e, t.alternate, t), t = t.sibling;
  }
  function La(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          aa(4, t, t.return), La(t);
          break;
        case 1:
          hn(t, t.return);
          var n = t.stateNode;
          typeof n.componentWillUnmount == "function" && oh(
            t,
            t.return,
            n
          ), La(t);
          break;
        case 27:
          ys(t.stateNode);
        case 26:
        case 5:
          hn(t, t.return), La(t);
          break;
        case 22:
          t.memoizedState === null && La(t);
          break;
        case 30:
          La(t);
          break;
        default:
          La(t);
      }
      e = e.sibling;
    }
  }
  function Hn(e, t, n) {
    for (n = n && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var a = t.alternate, i = e, r = t, h = r.flags;
      switch (r.tag) {
        case 0:
        case 11:
        case 15:
          Hn(
            i,
            r,
            n
          ), ds(4, r);
          break;
        case 1:
          if (Hn(
            i,
            r,
            n
          ), a = r, i = a.stateNode, typeof i.componentDidMount == "function")
            try {
              i.componentDidMount();
            } catch (D) {
              De(a, a.return, D);
            }
          if (a = r, i = a.updateQueue, i !== null) {
            var _ = a.stateNode;
            try {
              var S = i.shared.hiddenCallbacks;
              if (S !== null)
                for (i.shared.hiddenCallbacks = null, i = 0; i < S.length; i++)
                  Jd(S[i], _);
            } catch (D) {
              De(a, a.return, D);
            }
          }
          n && h & 64 && rh(r), fs(r, r.return);
          break;
        case 27:
          fh(r);
        case 26:
        case 5:
          Hn(
            i,
            r,
            n
          ), n && a === null && h & 4 && uh(r), fs(r, r.return);
          break;
        case 12:
          Hn(
            i,
            r,
            n
          );
          break;
        case 31:
          Hn(
            i,
            r,
            n
          ), n && h & 4 && gh(i, r);
          break;
        case 13:
          Hn(
            i,
            r,
            n
          ), n && h & 4 && xh(i, r);
          break;
        case 22:
          r.memoizedState === null && Hn(
            i,
            r,
            n
          ), fs(r, r.return);
          break;
        case 30:
          break;
        default:
          Hn(
            i,
            r,
            n
          );
      }
      t = t.sibling;
    }
  }
  function vo(e, t) {
    var n = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && Pl(n));
  }
  function go(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Pl(e));
  }
  function rn(e, t, n, a) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        yh(
          e,
          t,
          n,
          a
        ), t = t.sibling;
  }
  function yh(e, t, n, a) {
    var i = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        rn(
          e,
          t,
          n,
          a
        ), i & 2048 && ds(9, t);
        break;
      case 1:
        rn(
          e,
          t,
          n,
          a
        );
        break;
      case 3:
        rn(
          e,
          t,
          n,
          a
        ), i & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Pl(e)));
        break;
      case 12:
        if (i & 2048) {
          rn(
            e,
            t,
            n,
            a
          ), e = t.stateNode;
          try {
            var r = t.memoizedProps, h = r.id, _ = r.onPostCommit;
            typeof _ == "function" && _(
              h,
              t.alternate === null ? "mount" : "update",
              e.passiveEffectDuration,
              -0
            );
          } catch (S) {
            De(t, t.return, S);
          }
        } else
          rn(
            e,
            t,
            n,
            a
          );
        break;
      case 31:
        rn(
          e,
          t,
          n,
          a
        );
        break;
      case 13:
        rn(
          e,
          t,
          n,
          a
        );
        break;
      case 23:
        break;
      case 22:
        r = t.stateNode, h = t.alternate, t.memoizedState !== null ? r._visibility & 2 ? rn(
          e,
          t,
          n,
          a
        ) : hs(e, t) : r._visibility & 2 ? rn(
          e,
          t,
          n,
          a
        ) : (r._visibility |= 2, _l(
          e,
          t,
          n,
          a,
          (t.subtreeFlags & 10256) !== 0 || !1
        )), i & 2048 && vo(h, t);
        break;
      case 24:
        rn(
          e,
          t,
          n,
          a
        ), i & 2048 && go(t.alternate, t);
        break;
      default:
        rn(
          e,
          t,
          n,
          a
        );
    }
  }
  function _l(e, t, n, a, i) {
    for (i = i && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var r = e, h = t, _ = n, S = a, D = h.flags;
      switch (h.tag) {
        case 0:
        case 11:
        case 15:
          _l(
            r,
            h,
            _,
            S,
            i
          ), ds(8, h);
          break;
        case 23:
          break;
        case 22:
          var q = h.stateNode;
          h.memoizedState !== null ? q._visibility & 2 ? _l(
            r,
            h,
            _,
            S,
            i
          ) : hs(
            r,
            h
          ) : (q._visibility |= 2, _l(
            r,
            h,
            _,
            S,
            i
          )), i && D & 2048 && vo(
            h.alternate,
            h
          );
          break;
        case 24:
          _l(
            r,
            h,
            _,
            S,
            i
          ), i && D & 2048 && go(h.alternate, h);
          break;
        default:
          _l(
            r,
            h,
            _,
            S,
            i
          );
      }
      t = t.sibling;
    }
  }
  function hs(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var n = e, a = t, i = a.flags;
        switch (a.tag) {
          case 22:
            hs(n, a), i & 2048 && vo(
              a.alternate,
              a
            );
            break;
          case 24:
            hs(n, a), i & 2048 && go(a.alternate, a);
            break;
          default:
            hs(n, a);
        }
        t = t.sibling;
      }
  }
  var ms = 8192;
  function yl(e, t, n) {
    if (e.subtreeFlags & ms)
      for (e = e.child; e !== null; )
        wh(
          e,
          t,
          n
        ), e = e.sibling;
  }
  function wh(e, t, n) {
    switch (e.tag) {
      case 26:
        yl(
          e,
          t,
          n
        ), e.flags & ms && e.memoizedState !== null && yx(
          n,
          cn,
          e.memoizedState,
          e.memoizedProps
        );
        break;
      case 5:
        yl(
          e,
          t,
          n
        );
        break;
      case 3:
      case 4:
        var a = cn;
        cn = Xi(e.stateNode.containerInfo), yl(
          e,
          t,
          n
        ), cn = a;
        break;
      case 22:
        e.memoizedState === null && (a = e.alternate, a !== null && a.memoizedState !== null ? (a = ms, ms = 16777216, yl(
          e,
          t,
          n
        ), ms = a) : yl(
          e,
          t,
          n
        ));
        break;
      default:
        yl(
          e,
          t,
          n
        );
    }
  }
  function jh(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function ps(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var a = t[n];
          ut = a, Nh(
            a,
            e
          );
        }
      jh(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        Sh(e), e = e.sibling;
  }
  function Sh(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        ps(e), e.flags & 2048 && aa(9, e, e.return);
        break;
      case 3:
        ps(e);
        break;
      case 12:
        ps(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, zi(e)) : ps(e);
        break;
      default:
        ps(e);
    }
  }
  function zi(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var a = t[n];
          ut = a, Nh(
            a,
            e
          );
        }
      jh(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          aa(8, t, t.return), zi(t);
          break;
        case 22:
          n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, zi(t));
          break;
        default:
          zi(t);
      }
      e = e.sibling;
    }
  }
  function Nh(e, t) {
    for (; ut !== null; ) {
      var n = ut;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          aa(8, n, t);
          break;
        case 23:
        case 22:
          if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
            var a = n.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          Pl(n.memoizedState.cache);
      }
      if (a = n.child, a !== null) a.return = n, ut = a;
      else
        e: for (n = e; ut !== null; ) {
          a = ut;
          var i = a.sibling, r = a.return;
          if (ph(a), a === n) {
            ut = null;
            break e;
          }
          if (i !== null) {
            i.return = r, ut = i;
            break e;
          }
          ut = r;
        }
    }
  }
  var Hg = {
    getCacheForType: function(e) {
      var t = pt(nt), n = t.data.get(e);
      return n === void 0 && (n = e(), t.data.set(e, n)), n;
    },
    cacheSignal: function() {
      return pt(nt).controller.signal;
    }
  }, Lg = typeof WeakMap == "function" ? WeakMap : Map, ze = 0, Ge = null, Ne = null, Ee = 0, Oe = 0, Bt = null, la = !1, wl = !1, xo = !1, Ln = 0, Pe = 0, sa = 0, Ua = 0, bo = 0, $t = 0, jl = 0, vs = null, Rt = null, _o = !1, Oi = 0, kh = 0, Di = 1 / 0, Hi = null, ia = null, ct = 0, ca = null, Sl = null, Un = 0, yo = 0, wo = null, Eh = null, gs = 0, jo = null;
  function Gt() {
    return (ze & 2) !== 0 && Ee !== 0 ? Ee & -Ee : A.T !== null ? Co() : Fu();
  }
  function Mh() {
    if ($t === 0)
      if ((Ee & 536870912) === 0 || Ce) {
        var e = Ys;
        Ys <<= 1, (Ys & 3932160) === 0 && (Ys = 262144), $t = e;
      } else $t = 536870912;
    return e = Lt.current, e !== null && (e.flags |= 32), $t;
  }
  function zt(e, t, n) {
    (e === Ge && (Oe === 2 || Oe === 9) || e.cancelPendingCommit !== null) && (Nl(e, 0), ra(
      e,
      Ee,
      $t,
      !1
    )), Ul(e, n), ((ze & 2) === 0 || e !== Ge) && (e === Ge && ((ze & 2) === 0 && (Ua |= n), Pe === 4 && ra(
      e,
      Ee,
      $t,
      !1
    )), mn(e));
  }
  function Ch(e, t, n) {
    if ((ze & 6) !== 0) throw Error(o(327));
    var a = !n && (t & 127) === 0 && (t & e.expiredLanes) === 0 || Ll(e, t), i = a ? $g(e, t) : No(e, t, !0), r = a;
    do {
      if (i === 0) {
        wl && !a && ra(e, t, 0, !1);
        break;
      } else {
        if (n = e.current.alternate, r && !Ug(n)) {
          i = No(e, t, !1), r = !1;
          continue;
        }
        if (i === 2) {
          if (r = t, e.errorRecoveryDisabledLanes & r)
            var h = 0;
          else
            h = e.pendingLanes & -536870913, h = h !== 0 ? h : h & 536870912 ? 536870912 : 0;
          if (h !== 0) {
            t = h;
            e: {
              var _ = e;
              i = vs;
              var S = _.current.memoizedState.isDehydrated;
              if (S && (Nl(_, h).flags |= 256), h = No(
                _,
                h,
                !1
              ), h !== 2) {
                if (xo && !S) {
                  _.errorRecoveryDisabledLanes |= r, Ua |= r, i = 4;
                  break e;
                }
                r = Rt, Rt = i, r !== null && (Rt === null ? Rt = r : Rt.push.apply(
                  Rt,
                  r
                ));
              }
              i = h;
            }
            if (r = !1, i !== 2) continue;
          }
        }
        if (i === 1) {
          Nl(e, 0), ra(e, t, 0, !0);
          break;
        }
        e: {
          switch (a = e, r = i, r) {
            case 0:
            case 1:
              throw Error(o(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              ra(
                a,
                t,
                $t,
                !la
              );
              break e;
            case 2:
              Rt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(o(329));
          }
          if ((t & 62914560) === t && (i = Oi + 300 - St(), 10 < i)) {
            if (ra(
              a,
              t,
              $t,
              !la
            ), Xs(a, 0, !0) !== 0) break e;
            Un = t, a.timeoutHandle = im(
              Th.bind(
                null,
                a,
                n,
                Rt,
                Hi,
                _o,
                t,
                $t,
                Ua,
                jl,
                la,
                r,
                "Throttled",
                -0,
                0
              ),
              i
            );
            break e;
          }
          Th(
            a,
            n,
            Rt,
            Hi,
            _o,
            t,
            $t,
            Ua,
            jl,
            la,
            r,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    mn(e);
  }
  function Th(e, t, n, a, i, r, h, _, S, D, q, X, L, B) {
    if (e.timeoutHandle = -1, X = t.subtreeFlags, X & 8192 || (X & 16785408) === 16785408) {
      X = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: jn
      }, wh(
        t,
        r,
        X
      );
      var le = (r & 62914560) === r ? Oi - St() : (r & 4194048) === r ? kh - St() : 0;
      if (le = wx(
        X,
        le
      ), le !== null) {
        Un = r, e.cancelPendingCommit = le(
          Uh.bind(
            null,
            e,
            t,
            r,
            n,
            a,
            i,
            h,
            _,
            S,
            q,
            X,
            null,
            L,
            B
          )
        ), ra(e, r, h, !D);
        return;
      }
    }
    Uh(
      e,
      t,
      r,
      n,
      a,
      i,
      h,
      _,
      S
    );
  }
  function Ug(e) {
    for (var t = e; ; ) {
      var n = t.tag;
      if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null)))
        for (var a = 0; a < n.length; a++) {
          var i = n[a], r = i.getSnapshot;
          i = i.value;
          try {
            if (!Dt(r(), i)) return !1;
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
  function ra(e, t, n, a) {
    t &= ~bo, t &= ~Ua, e.suspendedLanes |= t, e.pingedLanes &= ~t, a && (e.warmLanes |= t), a = e.expirationTimes;
    for (var i = t; 0 < i; ) {
      var r = 31 - Je(i), h = 1 << r;
      a[r] = -1, i &= ~h;
    }
    n !== 0 && Bu(e, n, t);
  }
  function Li() {
    return (ze & 6) === 0 ? (xs(0), !1) : !0;
  }
  function So() {
    if (Ne !== null) {
      if (Oe === 0)
        var e = Ne.return;
      else
        e = Ne, En = Ca = null, Br(e), pl = null, es = 0, e = Ne;
      for (; e !== null; )
        ch(e.alternate, e), e = e.return;
      Ne = null;
    }
  }
  function Nl(e, t) {
    var n = e.timeoutHandle;
    n !== -1 && (e.timeoutHandle = -1, lx(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), Un = 0, So(), Ge = e, Ne = n = Nn(e.current, null), Ee = t, Oe = 0, Bt = null, la = !1, wl = Ll(e, t), xo = !1, jl = $t = bo = Ua = sa = Pe = 0, Rt = vs = null, _o = !1, (t & 8) !== 0 && (t |= t & 32);
    var a = e.entangledLanes;
    if (a !== 0)
      for (e = e.entanglements, a &= t; 0 < a; ) {
        var i = 31 - Je(a), r = 1 << i;
        t |= e[i], a &= ~r;
      }
    return Ln = t, li(), n;
  }
  function Ah(e, t) {
    ye = null, A.H = rs, t === ml || t === fi ? (t = Xd(), Oe = 3) : t === Er ? (t = Xd(), Oe = 4) : Oe = t === to ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, Bt = t, Ne === null && (Pe = 1, ki(
      e,
      Kt(t, e.current)
    ));
  }
  function Rh() {
    var e = Lt.current;
    return e === null ? !0 : (Ee & 4194048) === Ee ? It === null : (Ee & 62914560) === Ee || (Ee & 536870912) !== 0 ? e === It : !1;
  }
  function zh() {
    var e = A.H;
    return A.H = rs, e === null ? rs : e;
  }
  function Oh() {
    var e = A.A;
    return A.A = Hg, e;
  }
  function Ui() {
    Pe = 4, la || (Ee & 4194048) !== Ee && Lt.current !== null || (wl = !0), (sa & 134217727) === 0 && (Ua & 134217727) === 0 || Ge === null || ra(
      Ge,
      Ee,
      $t,
      !1
    );
  }
  function No(e, t, n) {
    var a = ze;
    ze |= 2;
    var i = zh(), r = Oh();
    (Ge !== e || Ee !== t) && (Hi = null, Nl(e, t)), t = !1;
    var h = Pe;
    e: do
      try {
        if (Oe !== 0 && Ne !== null) {
          var _ = Ne, S = Bt;
          switch (Oe) {
            case 8:
              So(), h = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              Lt.current === null && (t = !0);
              var D = Oe;
              if (Oe = 0, Bt = null, kl(e, _, S, D), n && wl) {
                h = 0;
                break e;
              }
              break;
            default:
              D = Oe, Oe = 0, Bt = null, kl(e, _, S, D);
          }
        }
        Bg(), h = Pe;
        break;
      } catch (q) {
        Ah(e, q);
      }
    while (!0);
    return t && e.shellSuspendCounter++, En = Ca = null, ze = a, A.H = i, A.A = r, Ne === null && (Ge = null, Ee = 0, li()), h;
  }
  function Bg() {
    for (; Ne !== null; ) Dh(Ne);
  }
  function $g(e, t) {
    var n = ze;
    ze |= 2;
    var a = zh(), i = Oh();
    Ge !== e || Ee !== t ? (Hi = null, Di = St() + 500, Nl(e, t)) : wl = Ll(
      e,
      t
    );
    e: do
      try {
        if (Oe !== 0 && Ne !== null) {
          t = Ne;
          var r = Bt;
          t: switch (Oe) {
            case 1:
              Oe = 0, Bt = null, kl(e, t, r, 1);
              break;
            case 2:
            case 9:
              if (Yd(r)) {
                Oe = 0, Bt = null, Hh(t);
                break;
              }
              t = function() {
                Oe !== 2 && Oe !== 9 || Ge !== e || (Oe = 7), mn(e);
              }, r.then(t, t);
              break e;
            case 3:
              Oe = 7;
              break e;
            case 4:
              Oe = 5;
              break e;
            case 7:
              Yd(r) ? (Oe = 0, Bt = null, Hh(t)) : (Oe = 0, Bt = null, kl(e, t, r, 7));
              break;
            case 5:
              var h = null;
              switch (Ne.tag) {
                case 26:
                  h = Ne.memoizedState;
                case 5:
                case 27:
                  var _ = Ne;
                  if (h ? ym(h) : _.stateNode.complete) {
                    Oe = 0, Bt = null;
                    var S = _.sibling;
                    if (S !== null) Ne = S;
                    else {
                      var D = _.return;
                      D !== null ? (Ne = D, Bi(D)) : Ne = null;
                    }
                    break t;
                  }
              }
              Oe = 0, Bt = null, kl(e, t, r, 5);
              break;
            case 6:
              Oe = 0, Bt = null, kl(e, t, r, 6);
              break;
            case 8:
              So(), Pe = 6;
              break e;
            default:
              throw Error(o(462));
          }
        }
        Gg();
        break;
      } catch (q) {
        Ah(e, q);
      }
    while (!0);
    return En = Ca = null, A.H = a, A.A = i, ze = n, Ne !== null ? 0 : (Ge = null, Ee = 0, li(), Pe);
  }
  function Gg() {
    for (; Ne !== null && !Rc(); )
      Dh(Ne);
  }
  function Dh(e) {
    var t = sh(e.alternate, e, Ln);
    e.memoizedProps = e.pendingProps, t === null ? Bi(e) : Ne = t;
  }
  function Hh(e) {
    var t = e, n = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = If(
          n,
          t,
          t.pendingProps,
          t.type,
          void 0,
          Ee
        );
        break;
      case 11:
        t = If(
          n,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          Ee
        );
        break;
      case 5:
        Br(t);
      default:
        ch(n, t), t = Ne = zd(t, Ln), t = sh(n, t, Ln);
    }
    e.memoizedProps = e.pendingProps, t === null ? Bi(e) : Ne = t;
  }
  function kl(e, t, n, a) {
    En = Ca = null, Br(t), pl = null, es = 0;
    var i = t.return;
    try {
      if (Cg(
        e,
        i,
        t,
        n,
        Ee
      )) {
        Pe = 1, ki(
          e,
          Kt(n, e.current)
        ), Ne = null;
        return;
      }
    } catch (r) {
      if (i !== null) throw Ne = i, r;
      Pe = 1, ki(
        e,
        Kt(n, e.current)
      ), Ne = null;
      return;
    }
    t.flags & 32768 ? (Ce || a === 1 ? e = !0 : wl || (Ee & 536870912) !== 0 ? e = !1 : (la = e = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = Lt.current, a !== null && a.tag === 13 && (a.flags |= 16384))), Lh(t, e)) : Bi(t);
  }
  function Bi(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        Lh(
          t,
          la
        );
        return;
      }
      e = t.return;
      var n = Rg(
        t.alternate,
        t,
        Ln
      );
      if (n !== null) {
        Ne = n;
        return;
      }
      if (t = t.sibling, t !== null) {
        Ne = t;
        return;
      }
      Ne = t = e;
    } while (t !== null);
    Pe === 0 && (Pe = 5);
  }
  function Lh(e, t) {
    do {
      var n = zg(e.alternate, e);
      if (n !== null) {
        n.flags &= 32767, Ne = n;
        return;
      }
      if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
        Ne = e;
        return;
      }
      Ne = e = n;
    } while (e !== null);
    Pe = 6, Ne = null;
  }
  function Uh(e, t, n, a, i, r, h, _, S) {
    e.cancelPendingCommit = null;
    do
      $i();
    while (ct !== 0);
    if ((ze & 6) !== 0) throw Error(o(327));
    if (t !== null) {
      if (t === e.current) throw Error(o(177));
      if (r = t.lanes | t.childLanes, r |= fr, _v(
        e,
        n,
        r,
        h,
        _,
        S
      ), e === Ge && (Ne = Ge = null, Ee = 0), Sl = t, ca = e, Un = n, yo = r, wo = i, Eh = a, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, Vg(Qa, function() {
        return qh(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
        a = A.T, A.T = null, i = H.p, H.p = 2, h = ze, ze |= 4;
        try {
          Og(e, t, n);
        } finally {
          ze = h, H.p = i, A.T = a;
        }
      }
      ct = 1, Bh(), $h(), Gh();
    }
  }
  function Bh() {
    if (ct === 1) {
      ct = 0;
      var e = ca, t = Sl, n = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || n) {
        n = A.T, A.T = null;
        var a = H.p;
        H.p = 2;
        var i = ze;
        ze |= 4;
        try {
          bh(t, e);
          var r = Lo, h = Sd(e.containerInfo), _ = r.focusedElem, S = r.selectionRange;
          if (h !== _ && _ && _.ownerDocument && jd(
            _.ownerDocument.documentElement,
            _
          )) {
            if (S !== null && cr(_)) {
              var D = S.start, q = S.end;
              if (q === void 0 && (q = D), "selectionStart" in _)
                _.selectionStart = D, _.selectionEnd = Math.min(
                  q,
                  _.value.length
                );
              else {
                var X = _.ownerDocument || document, L = X && X.defaultView || window;
                if (L.getSelection) {
                  var B = L.getSelection(), le = _.textContent.length, me = Math.min(S.start, le), Be = S.end === void 0 ? me : Math.min(S.end, le);
                  !B.extend && me > Be && (h = Be, Be = me, me = h);
                  var R = wd(
                    _,
                    me
                  ), C = wd(
                    _,
                    Be
                  );
                  if (R && C && (B.rangeCount !== 1 || B.anchorNode !== R.node || B.anchorOffset !== R.offset || B.focusNode !== C.node || B.focusOffset !== C.offset)) {
                    var O = X.createRange();
                    O.setStart(R.node, R.offset), B.removeAllRanges(), me > Be ? (B.addRange(O), B.extend(C.node, C.offset)) : (O.setEnd(C.node, C.offset), B.addRange(O));
                  }
                }
              }
            }
            for (X = [], B = _; B = B.parentNode; )
              B.nodeType === 1 && X.push({
                element: B,
                left: B.scrollLeft,
                top: B.scrollTop
              });
            for (typeof _.focus == "function" && _.focus(), _ = 0; _ < X.length; _++) {
              var V = X[_];
              V.element.scrollLeft = V.left, V.element.scrollTop = V.top;
            }
          }
          Pi = !!Ho, Lo = Ho = null;
        } finally {
          ze = i, H.p = a, A.T = n;
        }
      }
      e.current = t, ct = 2;
    }
  }
  function $h() {
    if (ct === 2) {
      ct = 0;
      var e = ca, t = Sl, n = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || n) {
        n = A.T, A.T = null;
        var a = H.p;
        H.p = 2;
        var i = ze;
        ze |= 4;
        try {
          mh(e, t.alternate, t);
        } finally {
          ze = i, H.p = a, A.T = n;
        }
      }
      ct = 3;
    }
  }
  function Gh() {
    if (ct === 4 || ct === 3) {
      ct = 0, zc();
      var e = ca, t = Sl, n = Un, a = Eh;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? ct = 5 : (ct = 0, Sl = ca = null, Fh(e, e.pendingLanes));
      var i = e.pendingLanes;
      if (i === 0 && (ia = null), Fc(n), t = t.stateNode, bt && typeof bt.onCommitFiberRoot == "function")
        try {
          bt.onCommitFiberRoot(
            Vn,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (a !== null) {
        t = A.T, i = H.p, H.p = 2, A.T = null;
        try {
          for (var r = e.onRecoverableError, h = 0; h < a.length; h++) {
            var _ = a[h];
            r(_.value, {
              componentStack: _.stack
            });
          }
        } finally {
          A.T = t, H.p = i;
        }
      }
      (Un & 3) !== 0 && $i(), mn(e), i = e.pendingLanes, (n & 261930) !== 0 && (i & 42) !== 0 ? e === jo ? gs++ : (gs = 0, jo = e) : gs = 0, xs(0);
    }
  }
  function Fh(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Pl(t)));
  }
  function $i() {
    return Bh(), $h(), Gh(), qh();
  }
  function qh() {
    if (ct !== 5) return !1;
    var e = ca, t = yo;
    yo = 0;
    var n = Fc(Un), a = A.T, i = H.p;
    try {
      H.p = 32 > n ? 32 : n, A.T = null, n = wo, wo = null;
      var r = ca, h = Un;
      if (ct = 0, Sl = ca = null, Un = 0, (ze & 6) !== 0) throw Error(o(331));
      var _ = ze;
      if (ze |= 4, Sh(r.current), yh(
        r,
        r.current,
        h,
        n
      ), ze = _, xs(0, !1), bt && typeof bt.onPostCommitFiberRoot == "function")
        try {
          bt.onPostCommitFiberRoot(Vn, r);
        } catch {
        }
      return !0;
    } finally {
      H.p = i, A.T = a, Fh(e, t);
    }
  }
  function Yh(e, t, n) {
    t = Kt(n, t), t = eo(e.stateNode, t, 2), e = ea(e, t, 2), e !== null && (Ul(e, 2), mn(e));
  }
  function De(e, t, n) {
    if (e.tag === 3)
      Yh(e, e, n);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Yh(
            t,
            e,
            n
          );
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (ia === null || !ia.has(a))) {
            e = Kt(n, e), n = Vf(2), a = ea(t, n, 2), a !== null && (Xf(
              n,
              a,
              t,
              e
            ), Ul(a, 2), mn(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function ko(e, t, n) {
    var a = e.pingCache;
    if (a === null) {
      a = e.pingCache = new Lg();
      var i = /* @__PURE__ */ new Set();
      a.set(t, i);
    } else
      i = a.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), a.set(t, i));
    i.has(n) || (xo = !0, i.add(n), e = Fg.bind(null, e, t, n), t.then(e, e));
  }
  function Fg(e, t, n) {
    var a = e.pingCache;
    a !== null && a.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, Ge === e && (Ee & n) === n && (Pe === 4 || Pe === 3 && (Ee & 62914560) === Ee && 300 > St() - Oi ? (ze & 2) === 0 && Nl(e, 0) : bo |= n, jl === Ee && (jl = 0)), mn(e);
  }
  function Vh(e, t) {
    t === 0 && (t = Uu()), e = ka(e, t), e !== null && (Ul(e, t), mn(e));
  }
  function qg(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), Vh(e, n);
  }
  function Yg(e, t) {
    var n = 0;
    switch (e.tag) {
      case 31:
      case 13:
        var a = e.stateNode, i = e.memoizedState;
        i !== null && (n = i.retryLane);
        break;
      case 19:
        a = e.stateNode;
        break;
      case 22:
        a = e.stateNode._retryCache;
        break;
      default:
        throw Error(o(314));
    }
    a !== null && a.delete(t), Vh(e, n);
  }
  function Vg(e, t) {
    return yn(e, t);
  }
  var Gi = null, El = null, Eo = !1, Fi = !1, Mo = !1, oa = 0;
  function mn(e) {
    e !== El && e.next === null && (El === null ? Gi = El = e : El = El.next = e), Fi = !0, Eo || (Eo = !0, Qg());
  }
  function xs(e, t) {
    if (!Mo && Fi) {
      Mo = !0;
      do
        for (var n = !1, a = Gi; a !== null; ) {
          if (e !== 0) {
            var i = a.pendingLanes;
            if (i === 0) var r = 0;
            else {
              var h = a.suspendedLanes, _ = a.pingedLanes;
              r = (1 << 31 - Je(42 | e) + 1) - 1, r &= i & ~(h & ~_), r = r & 201326741 ? r & 201326741 | 1 : r ? r | 2 : 0;
            }
            r !== 0 && (n = !0, Kh(a, r));
          } else
            r = Ee, r = Xs(
              a,
              a === Ge ? r : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (r & 3) === 0 || Ll(a, r) || (n = !0, Kh(a, r));
          a = a.next;
        }
      while (n);
      Mo = !1;
    }
  }
  function Xg() {
    Xh();
  }
  function Xh() {
    Fi = Eo = !1;
    var e = 0;
    oa !== 0 && ax() && (e = oa);
    for (var t = St(), n = null, a = Gi; a !== null; ) {
      var i = a.next, r = Qh(a, t);
      r === 0 ? (a.next = null, n === null ? Gi = i : n.next = i, i === null && (El = n)) : (n = a, (e !== 0 || (r & 3) !== 0) && (Fi = !0)), a = i;
    }
    ct !== 0 && ct !== 5 || xs(e), oa !== 0 && (oa = 0);
  }
  function Qh(e, t) {
    for (var n = e.suspendedLanes, a = e.pingedLanes, i = e.expirationTimes, r = e.pendingLanes & -62914561; 0 < r; ) {
      var h = 31 - Je(r), _ = 1 << h, S = i[h];
      S === -1 ? ((_ & n) === 0 || (_ & a) !== 0) && (i[h] = bv(_, t)) : S <= t && (e.expiredLanes |= _), r &= ~_;
    }
    if (t = Ge, n = Ee, n = Xs(
      e,
      e === t ? n : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a = e.callbackNode, n === 0 || e === t && (Oe === 2 || Oe === 9) || e.cancelPendingCommit !== null)
      return a !== null && a !== null && Hl(a), e.callbackNode = null, e.callbackPriority = 0;
    if ((n & 3) === 0 || Ll(e, n)) {
      if (t = n & -n, t === e.callbackPriority) return t;
      switch (a !== null && Hl(a), Fc(n)) {
        case 2:
        case 8:
          n = Gs;
          break;
        case 32:
          n = Qa;
          break;
        case 268435456:
          n = Fs;
          break;
        default:
          n = Qa;
      }
      return a = Zh.bind(null, e), n = yn(n, a), e.callbackPriority = t, e.callbackNode = n, t;
    }
    return a !== null && a !== null && Hl(a), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function Zh(e, t) {
    if (ct !== 0 && ct !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var n = e.callbackNode;
    if ($i() && e.callbackNode !== n)
      return null;
    var a = Ee;
    return a = Xs(
      e,
      e === Ge ? a : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a === 0 ? null : (Ch(e, a, t), Qh(e, St()), e.callbackNode != null && e.callbackNode === n ? Zh.bind(null, e) : null);
  }
  function Kh(e, t) {
    if ($i()) return null;
    Ch(e, t, !0);
  }
  function Qg() {
    sx(function() {
      (ze & 6) !== 0 ? yn(
        $s,
        Xg
      ) : Xh();
    });
  }
  function Co() {
    if (oa === 0) {
      var e = fl;
      e === 0 && (e = qs, qs <<= 1, (qs & 261888) === 0 && (qs = 256)), oa = e;
    }
    return oa;
  }
  function Jh(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Js("" + e);
  }
  function Wh(e, t) {
    var n = t.ownerDocument.createElement("input");
    return n.name = t.name, n.value = t.value, e.id && n.setAttribute("form", e.id), t.parentNode.insertBefore(n, t), e = new FormData(e), n.parentNode.removeChild(n), e;
  }
  function Zg(e, t, n, a, i) {
    if (t === "submit" && n && n.stateNode === i) {
      var r = Jh(
        (i[Et] || null).action
      ), h = a.submitter;
      h && (t = (t = h[Et] || null) ? Jh(t.formAction) : h.getAttribute("formAction"), t !== null && (r = t, h = null));
      var _ = new ei(
        "action",
        "action",
        null,
        a,
        i
      );
      e.push({
        event: _,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (oa !== 0) {
                  var S = h ? Wh(i, h) : new FormData(i);
                  Zr(
                    n,
                    {
                      pending: !0,
                      data: S,
                      method: i.method,
                      action: r
                    },
                    null,
                    S
                  );
                }
              } else
                typeof r == "function" && (_.preventDefault(), S = h ? Wh(i, h) : new FormData(i), Zr(
                  n,
                  {
                    pending: !0,
                    data: S,
                    method: i.method,
                    action: r
                  },
                  r,
                  S
                ));
            },
            currentTarget: i
          }
        ]
      });
    }
  }
  for (var To = 0; To < dr.length; To++) {
    var Ao = dr[To], Kg = Ao.toLowerCase(), Jg = Ao[0].toUpperCase() + Ao.slice(1);
    sn(
      Kg,
      "on" + Jg
    );
  }
  sn(Ed, "onAnimationEnd"), sn(Md, "onAnimationIteration"), sn(Cd, "onAnimationStart"), sn("dblclick", "onDoubleClick"), sn("focusin", "onFocus"), sn("focusout", "onBlur"), sn(fg, "onTransitionRun"), sn(hg, "onTransitionStart"), sn(mg, "onTransitionCancel"), sn(Td, "onTransitionEnd"), Pa("onMouseEnter", ["mouseout", "mouseover"]), Pa("onMouseLeave", ["mouseout", "mouseover"]), Pa("onPointerEnter", ["pointerout", "pointerover"]), Pa("onPointerLeave", ["pointerout", "pointerover"]), wa(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), wa(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), wa("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), wa(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), wa(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), wa(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var bs = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), Wg = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(bs)
  );
  function Ph(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var a = e[n], i = a.event;
      a = a.listeners;
      e: {
        var r = void 0;
        if (t)
          for (var h = a.length - 1; 0 <= h; h--) {
            var _ = a[h], S = _.instance, D = _.currentTarget;
            if (_ = _.listener, S !== r && i.isPropagationStopped())
              break e;
            r = _, i.currentTarget = D;
            try {
              r(i);
            } catch (q) {
              ai(q);
            }
            i.currentTarget = null, r = S;
          }
        else
          for (h = 0; h < a.length; h++) {
            if (_ = a[h], S = _.instance, D = _.currentTarget, _ = _.listener, S !== r && i.isPropagationStopped())
              break e;
            r = _, i.currentTarget = D;
            try {
              r(i);
            } catch (q) {
              ai(q);
            }
            i.currentTarget = null, r = S;
          }
      }
    }
  }
  function ke(e, t) {
    var n = t[qc];
    n === void 0 && (n = t[qc] = /* @__PURE__ */ new Set());
    var a = e + "__bubble";
    n.has(a) || (Ih(t, e, 2, !1), n.add(a));
  }
  function Ro(e, t, n) {
    var a = 0;
    t && (a |= 4), Ih(
      n,
      e,
      a,
      t
    );
  }
  var qi = "_reactListening" + Math.random().toString(36).slice(2);
  function zo(e) {
    if (!e[qi]) {
      e[qi] = !0, Vu.forEach(function(n) {
        n !== "selectionchange" && (Wg.has(n) || Ro(n, !1, e), Ro(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[qi] || (t[qi] = !0, Ro("selectionchange", !1, t));
    }
  }
  function Ih(e, t, n, a) {
    switch (Mm(t)) {
      case 2:
        var i = Nx;
        break;
      case 8:
        i = kx;
        break;
      default:
        i = Zo;
    }
    n = i.bind(
      null,
      t,
      n,
      e
    ), i = void 0, !Pc || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), a ? i !== void 0 ? e.addEventListener(t, n, {
      capture: !0,
      passive: i
    }) : e.addEventListener(t, n, !0) : i !== void 0 ? e.addEventListener(t, n, {
      passive: i
    }) : e.addEventListener(t, n, !1);
  }
  function Oo(e, t, n, a, i) {
    var r = a;
    if ((t & 1) === 0 && (t & 2) === 0 && a !== null)
      e: for (; ; ) {
        if (a === null) return;
        var h = a.tag;
        if (h === 3 || h === 4) {
          var _ = a.stateNode.containerInfo;
          if (_ === i) break;
          if (h === 4)
            for (h = a.return; h !== null; ) {
              var S = h.tag;
              if ((S === 3 || S === 4) && h.stateNode.containerInfo === i)
                return;
              h = h.return;
            }
          for (; _ !== null; ) {
            if (h = Ka(_), h === null) return;
            if (S = h.tag, S === 5 || S === 6 || S === 26 || S === 27) {
              a = r = h;
              continue e;
            }
            _ = _.parentNode;
          }
        }
        a = a.return;
      }
    ad(function() {
      var D = r, q = Jc(n), X = [];
      e: {
        var L = Ad.get(e);
        if (L !== void 0) {
          var B = ei, le = e;
          switch (e) {
            case "keypress":
              if (Ps(n) === 0) break e;
            case "keydown":
            case "keyup":
              B = Yv;
              break;
            case "focusin":
              le = "focus", B = nr;
              break;
            case "focusout":
              le = "blur", B = nr;
              break;
            case "beforeblur":
            case "afterblur":
              B = nr;
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
              B = id;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              B = Rv;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              B = Qv;
              break;
            case Ed:
            case Md:
            case Cd:
              B = Dv;
              break;
            case Td:
              B = Kv;
              break;
            case "scroll":
            case "scrollend":
              B = Tv;
              break;
            case "wheel":
              B = Wv;
              break;
            case "copy":
            case "cut":
            case "paste":
              B = Lv;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              B = rd;
              break;
            case "toggle":
            case "beforetoggle":
              B = Iv;
          }
          var me = (t & 4) !== 0, Be = !me && (e === "scroll" || e === "scrollend"), R = me ? L !== null ? L + "Capture" : null : L;
          me = [];
          for (var C = D, O; C !== null; ) {
            var V = C;
            if (O = V.stateNode, V = V.tag, V !== 5 && V !== 26 && V !== 27 || O === null || R === null || (V = Gl(C, R), V != null && me.push(
              _s(C, V, O)
            )), Be) break;
            C = C.return;
          }
          0 < me.length && (L = new B(
            L,
            le,
            null,
            n,
            q
          ), X.push({ event: L, listeners: me }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (L = e === "mouseover" || e === "pointerover", B = e === "mouseout" || e === "pointerout", L && n !== Kc && (le = n.relatedTarget || n.fromElement) && (Ka(le) || le[Za]))
            break e;
          if ((B || L) && (L = q.window === q ? q : (L = q.ownerDocument) ? L.defaultView || L.parentWindow : window, B ? (le = n.relatedTarget || n.toElement, B = D, le = le ? Ka(le) : null, le !== null && (Be = f(le), me = le.tag, le !== Be || me !== 5 && me !== 27 && me !== 6) && (le = null)) : (B = null, le = D), B !== le)) {
            if (me = id, V = "onMouseLeave", R = "onMouseEnter", C = "mouse", (e === "pointerout" || e === "pointerover") && (me = rd, V = "onPointerLeave", R = "onPointerEnter", C = "pointer"), Be = B == null ? L : $l(B), O = le == null ? L : $l(le), L = new me(
              V,
              C + "leave",
              B,
              n,
              q
            ), L.target = Be, L.relatedTarget = O, V = null, Ka(q) === D && (me = new me(
              R,
              C + "enter",
              le,
              n,
              q
            ), me.target = O, me.relatedTarget = Be, V = me), Be = V, B && le)
              t: {
                for (me = Pg, R = B, C = le, O = 0, V = R; V; V = me(V))
                  O++;
                V = 0;
                for (var ue = C; ue; ue = me(ue))
                  V++;
                for (; 0 < O - V; )
                  R = me(R), O--;
                for (; 0 < V - O; )
                  C = me(C), V--;
                for (; O--; ) {
                  if (R === C || C !== null && R === C.alternate) {
                    me = R;
                    break t;
                  }
                  R = me(R), C = me(C);
                }
                me = null;
              }
            else me = null;
            B !== null && em(
              X,
              L,
              B,
              me,
              !1
            ), le !== null && Be !== null && em(
              X,
              Be,
              le,
              me,
              !0
            );
          }
        }
        e: {
          if (L = D ? $l(D) : window, B = L.nodeName && L.nodeName.toLowerCase(), B === "select" || B === "input" && L.type === "file")
            var Ae = vd;
          else if (md(L))
            if (gd)
              Ae = og;
            else {
              Ae = cg;
              var ie = ig;
            }
          else
            B = L.nodeName, !B || B.toLowerCase() !== "input" || L.type !== "checkbox" && L.type !== "radio" ? D && Zc(D.elementType) && (Ae = vd) : Ae = rg;
          if (Ae && (Ae = Ae(e, D))) {
            pd(
              X,
              Ae,
              n,
              q
            );
            break e;
          }
          ie && ie(e, L, D), e === "focusout" && D && L.type === "number" && D.memoizedProps.value != null && Qc(L, "number", L.value);
        }
        switch (ie = D ? $l(D) : window, e) {
          case "focusin":
            (md(ie) || ie.contentEditable === "true") && (ll = ie, rr = D, Kl = null);
            break;
          case "focusout":
            Kl = rr = ll = null;
            break;
          case "mousedown":
            or = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            or = !1, Nd(X, n, q);
            break;
          case "selectionchange":
            if (dg) break;
          case "keydown":
          case "keyup":
            Nd(X, n, q);
        }
        var je;
        if (lr)
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
          al ? fd(e, n) && (Me = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (Me = "onCompositionStart");
        Me && (od && n.locale !== "ko" && (al || Me !== "onCompositionStart" ? Me === "onCompositionEnd" && al && (je = ld()) : (Qn = q, Ic = "value" in Qn ? Qn.value : Qn.textContent, al = !0)), ie = Yi(D, Me), 0 < ie.length && (Me = new cd(
          Me,
          e,
          null,
          n,
          q
        ), X.push({ event: Me, listeners: ie }), je ? Me.data = je : (je = hd(n), je !== null && (Me.data = je)))), (je = tg ? ng(e, n) : ag(e, n)) && (Me = Yi(D, "onBeforeInput"), 0 < Me.length && (ie = new cd(
          "onBeforeInput",
          "beforeinput",
          null,
          n,
          q
        ), X.push({
          event: ie,
          listeners: Me
        }), ie.data = je)), Zg(
          X,
          e,
          D,
          n,
          q
        );
      }
      Ph(X, t);
    });
  }
  function _s(e, t, n) {
    return {
      instance: e,
      listener: t,
      currentTarget: n
    };
  }
  function Yi(e, t) {
    for (var n = t + "Capture", a = []; e !== null; ) {
      var i = e, r = i.stateNode;
      if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || r === null || (i = Gl(e, n), i != null && a.unshift(
        _s(e, i, r)
      ), i = Gl(e, t), i != null && a.push(
        _s(e, i, r)
      )), e.tag === 3) return a;
      e = e.return;
    }
    return [];
  }
  function Pg(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function em(e, t, n, a, i) {
    for (var r = t._reactName, h = []; n !== null && n !== a; ) {
      var _ = n, S = _.alternate, D = _.stateNode;
      if (_ = _.tag, S !== null && S === a) break;
      _ !== 5 && _ !== 26 && _ !== 27 || D === null || (S = D, i ? (D = Gl(n, r), D != null && h.unshift(
        _s(n, D, S)
      )) : i || (D = Gl(n, r), D != null && h.push(
        _s(n, D, S)
      ))), n = n.return;
    }
    h.length !== 0 && e.push({ event: t, listeners: h });
  }
  var Ig = /\r\n?/g, ex = /\u0000|\uFFFD/g;
  function tm(e) {
    return (typeof e == "string" ? e : "" + e).replace(Ig, `
`).replace(ex, "");
  }
  function nm(e, t) {
    return t = tm(t), tm(e) === t;
  }
  function Ue(e, t, n, a, i, r) {
    switch (n) {
      case "children":
        typeof a == "string" ? t === "body" || t === "textarea" && a === "" || el(e, a) : (typeof a == "number" || typeof a == "bigint") && t !== "body" && el(e, "" + a);
        break;
      case "className":
        Zs(e, "class", a);
        break;
      case "tabIndex":
        Zs(e, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Zs(e, n, a);
        break;
      case "style":
        td(e, a, r);
        break;
      case "data":
        if (t !== "object") {
          Zs(e, "data", a);
          break;
        }
      case "src":
      case "href":
        if (a === "" && (t !== "a" || n !== "href")) {
          e.removeAttribute(n);
          break;
        }
        if (a == null || typeof a == "function" || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(n);
          break;
        }
        a = Js("" + a), e.setAttribute(n, a);
        break;
      case "action":
      case "formAction":
        if (typeof a == "function") {
          e.setAttribute(
            n,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof r == "function" && (n === "formAction" ? (t !== "input" && Ue(e, t, "name", i.name, i, null), Ue(
            e,
            t,
            "formEncType",
            i.formEncType,
            i,
            null
          ), Ue(
            e,
            t,
            "formMethod",
            i.formMethod,
            i,
            null
          ), Ue(
            e,
            t,
            "formTarget",
            i.formTarget,
            i,
            null
          )) : (Ue(e, t, "encType", i.encType, i, null), Ue(e, t, "method", i.method, i, null), Ue(e, t, "target", i.target, i, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(n);
          break;
        }
        a = Js("" + a), e.setAttribute(n, a);
        break;
      case "onClick":
        a != null && (e.onclick = jn);
        break;
      case "onScroll":
        a != null && ke("scroll", e);
        break;
      case "onScrollEnd":
        a != null && ke("scrollend", e);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(o(61));
          if (n = a.__html, n != null) {
            if (i.children != null) throw Error(o(60));
            e.innerHTML = n;
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
        n = Js("" + a), e.setAttributeNS(
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
        a != null && typeof a != "function" && typeof a != "symbol" ? e.setAttribute(n, "" + a) : e.removeAttribute(n);
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
        a && typeof a != "function" && typeof a != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
        break;
      case "capture":
      case "download":
        a === !0 ? e.setAttribute(n, "") : a !== !1 && a != null && typeof a != "function" && typeof a != "symbol" ? e.setAttribute(n, a) : e.removeAttribute(n);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        a != null && typeof a != "function" && typeof a != "symbol" && !isNaN(a) && 1 <= a ? e.setAttribute(n, a) : e.removeAttribute(n);
        break;
      case "rowSpan":
      case "start":
        a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a) ? e.removeAttribute(n) : e.setAttribute(n, a);
        break;
      case "popover":
        ke("beforetoggle", e), ke("toggle", e), Qs(e, "popover", a);
        break;
      case "xlinkActuate":
        wn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        wn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        wn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        wn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        wn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        wn(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        wn(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        wn(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        wn(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        Qs(e, "is", a);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = Mv.get(n) || n, Qs(e, n, a));
    }
  }
  function Do(e, t, n, a, i, r) {
    switch (n) {
      case "style":
        td(e, a, r);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(o(61));
          if (n = a.__html, n != null) {
            if (i.children != null) throw Error(o(60));
            e.innerHTML = n;
          }
        }
        break;
      case "children":
        typeof a == "string" ? el(e, a) : (typeof a == "number" || typeof a == "bigint") && el(e, "" + a);
        break;
      case "onScroll":
        a != null && ke("scroll", e);
        break;
      case "onScrollEnd":
        a != null && ke("scrollend", e);
        break;
      case "onClick":
        a != null && (e.onclick = jn);
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
        if (!Xu.hasOwnProperty(n))
          e: {
            if (n[0] === "o" && n[1] === "n" && (i = n.endsWith("Capture"), t = n.slice(2, i ? n.length - 7 : void 0), r = e[Et] || null, r = r != null ? r[n] : null, typeof r == "function" && e.removeEventListener(t, r, i), typeof a == "function")) {
              typeof r != "function" && r !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(t, a, i);
              break e;
            }
            n in e ? e[n] = a : a === !0 ? e.setAttribute(n, "") : Qs(e, n, a);
          }
    }
  }
  function gt(e, t, n) {
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
        ke("error", e), ke("load", e);
        var a = !1, i = !1, r;
        for (r in n)
          if (n.hasOwnProperty(r)) {
            var h = n[r];
            if (h != null)
              switch (r) {
                case "src":
                  a = !0;
                  break;
                case "srcSet":
                  i = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(o(137, t));
                default:
                  Ue(e, t, r, h, n, null);
              }
          }
        i && Ue(e, t, "srcSet", n.srcSet, n, null), a && Ue(e, t, "src", n.src, n, null);
        return;
      case "input":
        ke("invalid", e);
        var _ = r = h = i = null, S = null, D = null;
        for (a in n)
          if (n.hasOwnProperty(a)) {
            var q = n[a];
            if (q != null)
              switch (a) {
                case "name":
                  i = q;
                  break;
                case "type":
                  h = q;
                  break;
                case "checked":
                  S = q;
                  break;
                case "defaultChecked":
                  D = q;
                  break;
                case "value":
                  r = q;
                  break;
                case "defaultValue":
                  _ = q;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (q != null)
                    throw Error(o(137, t));
                  break;
                default:
                  Ue(e, t, a, q, n, null);
              }
          }
        Wu(
          e,
          r,
          _,
          S,
          D,
          h,
          i,
          !1
        );
        return;
      case "select":
        ke("invalid", e), a = h = r = null;
        for (i in n)
          if (n.hasOwnProperty(i) && (_ = n[i], _ != null))
            switch (i) {
              case "value":
                r = _;
                break;
              case "defaultValue":
                h = _;
                break;
              case "multiple":
                a = _;
              default:
                Ue(e, t, i, _, n, null);
            }
        t = r, n = h, e.multiple = !!a, t != null ? Ia(e, !!a, t, !1) : n != null && Ia(e, !!a, n, !0);
        return;
      case "textarea":
        ke("invalid", e), r = i = a = null;
        for (h in n)
          if (n.hasOwnProperty(h) && (_ = n[h], _ != null))
            switch (h) {
              case "value":
                a = _;
                break;
              case "defaultValue":
                i = _;
                break;
              case "children":
                r = _;
                break;
              case "dangerouslySetInnerHTML":
                if (_ != null) throw Error(o(91));
                break;
              default:
                Ue(e, t, h, _, n, null);
            }
        Iu(e, a, i, r);
        return;
      case "option":
        for (S in n)
          if (n.hasOwnProperty(S) && (a = n[S], a != null))
            switch (S) {
              case "selected":
                e.selected = a && typeof a != "function" && typeof a != "symbol";
                break;
              default:
                Ue(e, t, S, a, n, null);
            }
        return;
      case "dialog":
        ke("beforetoggle", e), ke("toggle", e), ke("cancel", e), ke("close", e);
        break;
      case "iframe":
      case "object":
        ke("load", e);
        break;
      case "video":
      case "audio":
        for (a = 0; a < bs.length; a++)
          ke(bs[a], e);
        break;
      case "image":
        ke("error", e), ke("load", e);
        break;
      case "details":
        ke("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        ke("error", e), ke("load", e);
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
        for (D in n)
          if (n.hasOwnProperty(D) && (a = n[D], a != null))
            switch (D) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(o(137, t));
              default:
                Ue(e, t, D, a, n, null);
            }
        return;
      default:
        if (Zc(t)) {
          for (q in n)
            n.hasOwnProperty(q) && (a = n[q], a !== void 0 && Do(
              e,
              t,
              q,
              a,
              n,
              void 0
            ));
          return;
        }
    }
    for (_ in n)
      n.hasOwnProperty(_) && (a = n[_], a != null && Ue(e, t, _, a, n, null));
  }
  function tx(e, t, n, a) {
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
        var i = null, r = null, h = null, _ = null, S = null, D = null, q = null;
        for (B in n) {
          var X = n[B];
          if (n.hasOwnProperty(B) && X != null)
            switch (B) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                S = X;
              default:
                a.hasOwnProperty(B) || Ue(e, t, B, null, a, X);
            }
        }
        for (var L in a) {
          var B = a[L];
          if (X = n[L], a.hasOwnProperty(L) && (B != null || X != null))
            switch (L) {
              case "type":
                r = B;
                break;
              case "name":
                i = B;
                break;
              case "checked":
                D = B;
                break;
              case "defaultChecked":
                q = B;
                break;
              case "value":
                h = B;
                break;
              case "defaultValue":
                _ = B;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (B != null)
                  throw Error(o(137, t));
                break;
              default:
                B !== X && Ue(
                  e,
                  t,
                  L,
                  B,
                  a,
                  X
                );
            }
        }
        Xc(
          e,
          h,
          _,
          S,
          D,
          q,
          r,
          i
        );
        return;
      case "select":
        B = h = _ = L = null;
        for (r in n)
          if (S = n[r], n.hasOwnProperty(r) && S != null)
            switch (r) {
              case "value":
                break;
              case "multiple":
                B = S;
              default:
                a.hasOwnProperty(r) || Ue(
                  e,
                  t,
                  r,
                  null,
                  a,
                  S
                );
            }
        for (i in a)
          if (r = a[i], S = n[i], a.hasOwnProperty(i) && (r != null || S != null))
            switch (i) {
              case "value":
                L = r;
                break;
              case "defaultValue":
                _ = r;
                break;
              case "multiple":
                h = r;
              default:
                r !== S && Ue(
                  e,
                  t,
                  i,
                  r,
                  a,
                  S
                );
            }
        t = _, n = h, a = B, L != null ? Ia(e, !!n, L, !1) : !!a != !!n && (t != null ? Ia(e, !!n, t, !0) : Ia(e, !!n, n ? [] : "", !1));
        return;
      case "textarea":
        B = L = null;
        for (_ in n)
          if (i = n[_], n.hasOwnProperty(_) && i != null && !a.hasOwnProperty(_))
            switch (_) {
              case "value":
                break;
              case "children":
                break;
              default:
                Ue(e, t, _, null, a, i);
            }
        for (h in a)
          if (i = a[h], r = n[h], a.hasOwnProperty(h) && (i != null || r != null))
            switch (h) {
              case "value":
                L = i;
                break;
              case "defaultValue":
                B = i;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (i != null) throw Error(o(91));
                break;
              default:
                i !== r && Ue(e, t, h, i, a, r);
            }
        Pu(e, L, B);
        return;
      case "option":
        for (var le in n)
          if (L = n[le], n.hasOwnProperty(le) && L != null && !a.hasOwnProperty(le))
            switch (le) {
              case "selected":
                e.selected = !1;
                break;
              default:
                Ue(
                  e,
                  t,
                  le,
                  null,
                  a,
                  L
                );
            }
        for (S in a)
          if (L = a[S], B = n[S], a.hasOwnProperty(S) && L !== B && (L != null || B != null))
            switch (S) {
              case "selected":
                e.selected = L && typeof L != "function" && typeof L != "symbol";
                break;
              default:
                Ue(
                  e,
                  t,
                  S,
                  L,
                  a,
                  B
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
        for (var me in n)
          L = n[me], n.hasOwnProperty(me) && L != null && !a.hasOwnProperty(me) && Ue(e, t, me, null, a, L);
        for (D in a)
          if (L = a[D], B = n[D], a.hasOwnProperty(D) && L !== B && (L != null || B != null))
            switch (D) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (L != null)
                  throw Error(o(137, t));
                break;
              default:
                Ue(
                  e,
                  t,
                  D,
                  L,
                  a,
                  B
                );
            }
        return;
      default:
        if (Zc(t)) {
          for (var Be in n)
            L = n[Be], n.hasOwnProperty(Be) && L !== void 0 && !a.hasOwnProperty(Be) && Do(
              e,
              t,
              Be,
              void 0,
              a,
              L
            );
          for (q in a)
            L = a[q], B = n[q], !a.hasOwnProperty(q) || L === B || L === void 0 && B === void 0 || Do(
              e,
              t,
              q,
              L,
              a,
              B
            );
          return;
        }
    }
    for (var R in n)
      L = n[R], n.hasOwnProperty(R) && L != null && !a.hasOwnProperty(R) && Ue(e, t, R, null, a, L);
    for (X in a)
      L = a[X], B = n[X], !a.hasOwnProperty(X) || L === B || L == null && B == null || Ue(e, t, X, L, a, B);
  }
  function am(e) {
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
  function nx() {
    if (typeof performance.getEntriesByType == "function") {
      for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), a = 0; a < n.length; a++) {
        var i = n[a], r = i.transferSize, h = i.initiatorType, _ = i.duration;
        if (r && _ && am(h)) {
          for (h = 0, _ = i.responseEnd, a += 1; a < n.length; a++) {
            var S = n[a], D = S.startTime;
            if (D > _) break;
            var q = S.transferSize, X = S.initiatorType;
            q && am(X) && (S = S.responseEnd, h += q * (S < _ ? 1 : (_ - D) / (S - D)));
          }
          if (--a, t += 8 * (r + h) / (i.duration / 1e3), e++, 10 < e) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
  }
  var Ho = null, Lo = null;
  function Vi(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function lm(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function sm(e, t) {
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
  function Uo(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Bo = null;
  function ax() {
    var e = window.event;
    return e && e.type === "popstate" ? e === Bo ? !1 : (Bo = e, !0) : (Bo = null, !1);
  }
  var im = typeof setTimeout == "function" ? setTimeout : void 0, lx = typeof clearTimeout == "function" ? clearTimeout : void 0, cm = typeof Promise == "function" ? Promise : void 0, sx = typeof queueMicrotask == "function" ? queueMicrotask : typeof cm < "u" ? function(e) {
    return cm.resolve(null).then(e).catch(ix);
  } : im;
  function ix(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function ua(e) {
    return e === "head";
  }
  function rm(e, t) {
    var n = t, a = 0;
    do {
      var i = n.nextSibling;
      if (e.removeChild(n), i && i.nodeType === 8)
        if (n = i.data, n === "/$" || n === "/&") {
          if (a === 0) {
            e.removeChild(i), Al(t);
            return;
          }
          a--;
        } else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&")
          a++;
        else if (n === "html")
          ys(e.ownerDocument.documentElement);
        else if (n === "head") {
          n = e.ownerDocument.head, ys(n);
          for (var r = n.firstChild; r; ) {
            var h = r.nextSibling, _ = r.nodeName;
            r[Bl] || _ === "SCRIPT" || _ === "STYLE" || _ === "LINK" && r.rel.toLowerCase() === "stylesheet" || n.removeChild(r), r = h;
          }
        } else
          n === "body" && ys(e.ownerDocument.body);
      n = i;
    } while (n);
    Al(t);
  }
  function om(e, t) {
    var n = e;
    e = 0;
    do {
      var a = n.nextSibling;
      if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), a && a.nodeType === 8)
        if (n = a.data, n === "/$") {
          if (e === 0) break;
          e--;
        } else
          n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || e++;
      n = a;
    } while (n);
  }
  function $o(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var n = t;
      switch (t = t.nextSibling, n.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          $o(n), Yc(n);
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
  function cx(e, t, n, a) {
    for (; e.nodeType === 1; ) {
      var i = n;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!a && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (a) {
        if (!e[Bl])
          switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (r = e.getAttribute("rel"), r === "stylesheet" && e.hasAttribute("data-precedence"))
                break;
              if (r !== i.rel || e.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || e.getAttribute("title") !== (i.title == null ? null : i.title))
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (r = e.getAttribute("src"), (r !== (i.src == null ? null : i.src) || e.getAttribute("type") !== (i.type == null ? null : i.type) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && r && e.hasAttribute("async") && !e.hasAttribute("itemprop"))
                break;
              return e;
            default:
              return e;
          }
      } else if (t === "input" && e.type === "hidden") {
        var r = i.name == null ? null : "" + i.name;
        if (i.type === "hidden" && e.getAttribute("name") === r)
          return e;
      } else return e;
      if (e = en(e.nextSibling), e === null) break;
    }
    return null;
  }
  function rx(e, t, n) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = en(e.nextSibling), e === null)) return null;
    return e;
  }
  function um(e, t) {
    for (; e.nodeType !== 8; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = en(e.nextSibling), e === null)) return null;
    return e;
  }
  function Go(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function Fo(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
  }
  function ox(e, t) {
    var n = e.ownerDocument;
    if (e.data === "$~") e._reactRetry = t;
    else if (e.data !== "$?" || n.readyState !== "loading")
      t();
    else {
      var a = function() {
        t(), n.removeEventListener("DOMContentLoaded", a);
      };
      n.addEventListener("DOMContentLoaded", a), e._reactRetry = a;
    }
  }
  function en(e) {
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
  var qo = null;
  function dm(e) {
    e = e.nextSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === "/$" || n === "/&") {
          if (t === 0)
            return en(e.nextSibling);
          t--;
        } else
          n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function fm(e) {
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
  function hm(e, t, n) {
    switch (t = Vi(n), e) {
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
  function ys(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    Yc(e);
  }
  var tn = /* @__PURE__ */ new Map(), mm = /* @__PURE__ */ new Set();
  function Xi(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var Bn = H.d;
  H.d = {
    f: ux,
    r: dx,
    D: fx,
    C: hx,
    L: mx,
    m: px,
    X: gx,
    S: vx,
    M: xx
  };
  function ux() {
    var e = Bn.f(), t = Li();
    return e || t;
  }
  function dx(e) {
    var t = Ja(e);
    t !== null && t.tag === 5 && t.type === "form" ? Af(t) : Bn.r(e);
  }
  var Ml = typeof document > "u" ? null : document;
  function pm(e, t, n) {
    var a = Ml;
    if (a && typeof t == "string" && t) {
      var i = Qt(t);
      i = 'link[rel="' + e + '"][href="' + i + '"]', typeof n == "string" && (i += '[crossorigin="' + n + '"]'), mm.has(i) || (mm.add(i), e = { rel: e, crossOrigin: n, href: t }, a.querySelector(i) === null && (t = a.createElement("link"), gt(t, "link", e), ot(t), a.head.appendChild(t)));
    }
  }
  function fx(e) {
    Bn.D(e), pm("dns-prefetch", e, null);
  }
  function hx(e, t) {
    Bn.C(e, t), pm("preconnect", e, t);
  }
  function mx(e, t, n) {
    Bn.L(e, t, n);
    var a = Ml;
    if (a && e && t) {
      var i = 'link[rel="preload"][as="' + Qt(t) + '"]';
      t === "image" && n && n.imageSrcSet ? (i += '[imagesrcset="' + Qt(
        n.imageSrcSet
      ) + '"]', typeof n.imageSizes == "string" && (i += '[imagesizes="' + Qt(
        n.imageSizes
      ) + '"]')) : i += '[href="' + Qt(e) + '"]';
      var r = i;
      switch (t) {
        case "style":
          r = Cl(e);
          break;
        case "script":
          r = Tl(e);
      }
      tn.has(r) || (e = x(
        {
          rel: "preload",
          href: t === "image" && n && n.imageSrcSet ? void 0 : e,
          as: t
        },
        n
      ), tn.set(r, e), a.querySelector(i) !== null || t === "style" && a.querySelector(ws(r)) || t === "script" && a.querySelector(js(r)) || (t = a.createElement("link"), gt(t, "link", e), ot(t), a.head.appendChild(t)));
    }
  }
  function px(e, t) {
    Bn.m(e, t);
    var n = Ml;
    if (n && e) {
      var a = t && typeof t.as == "string" ? t.as : "script", i = 'link[rel="modulepreload"][as="' + Qt(a) + '"][href="' + Qt(e) + '"]', r = i;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          r = Tl(e);
      }
      if (!tn.has(r) && (e = x({ rel: "modulepreload", href: e }, t), tn.set(r, e), n.querySelector(i) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (n.querySelector(js(r)))
              return;
        }
        a = n.createElement("link"), gt(a, "link", e), ot(a), n.head.appendChild(a);
      }
    }
  }
  function vx(e, t, n) {
    Bn.S(e, t, n);
    var a = Ml;
    if (a && e) {
      var i = Wa(a).hoistableStyles, r = Cl(e);
      t = t || "default";
      var h = i.get(r);
      if (!h) {
        var _ = { loading: 0, preload: null };
        if (h = a.querySelector(
          ws(r)
        ))
          _.loading = 5;
        else {
          e = x(
            { rel: "stylesheet", href: e, "data-precedence": t },
            n
          ), (n = tn.get(r)) && Yo(e, n);
          var S = h = a.createElement("link");
          ot(S), gt(S, "link", e), S._p = new Promise(function(D, q) {
            S.onload = D, S.onerror = q;
          }), S.addEventListener("load", function() {
            _.loading |= 1;
          }), S.addEventListener("error", function() {
            _.loading |= 2;
          }), _.loading |= 4, Qi(h, t, a);
        }
        h = {
          type: "stylesheet",
          instance: h,
          count: 1,
          state: _
        }, i.set(r, h);
      }
    }
  }
  function gx(e, t) {
    Bn.X(e, t);
    var n = Ml;
    if (n && e) {
      var a = Wa(n).hoistableScripts, i = Tl(e), r = a.get(i);
      r || (r = n.querySelector(js(i)), r || (e = x({ src: e, async: !0 }, t), (t = tn.get(i)) && Vo(e, t), r = n.createElement("script"), ot(r), gt(r, "link", e), n.head.appendChild(r)), r = {
        type: "script",
        instance: r,
        count: 1,
        state: null
      }, a.set(i, r));
    }
  }
  function xx(e, t) {
    Bn.M(e, t);
    var n = Ml;
    if (n && e) {
      var a = Wa(n).hoistableScripts, i = Tl(e), r = a.get(i);
      r || (r = n.querySelector(js(i)), r || (e = x({ src: e, async: !0, type: "module" }, t), (t = tn.get(i)) && Vo(e, t), r = n.createElement("script"), ot(r), gt(r, "link", e), n.head.appendChild(r)), r = {
        type: "script",
        instance: r,
        count: 1,
        state: null
      }, a.set(i, r));
    }
  }
  function vm(e, t, n, a) {
    var i = (i = ge.current) ? Xi(i) : null;
    if (!i) throw Error(o(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof n.precedence == "string" && typeof n.href == "string" ? (t = Cl(n.href), n = Wa(
          i
        ).hoistableStyles, a = n.get(t), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, n.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
          e = Cl(n.href);
          var r = Wa(
            i
          ).hoistableStyles, h = r.get(e);
          if (h || (i = i.ownerDocument || i, h = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, r.set(e, h), (r = i.querySelector(
            ws(e)
          )) && !r._p && (h.instance = r, h.state.loading = 5), tn.has(e) || (n = {
            rel: "preload",
            as: "style",
            href: n.href,
            crossOrigin: n.crossOrigin,
            integrity: n.integrity,
            media: n.media,
            hrefLang: n.hrefLang,
            referrerPolicy: n.referrerPolicy
          }, tn.set(e, n), r || bx(
            i,
            e,
            n,
            h.state
          ))), t && a === null)
            throw Error(o(528, ""));
          return h;
        }
        if (t && a !== null)
          throw Error(o(529, ""));
        return null;
      case "script":
        return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Tl(n), n = Wa(
          i
        ).hoistableScripts, a = n.get(t), a || (a = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, n.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(o(444, e));
    }
  }
  function Cl(e) {
    return 'href="' + Qt(e) + '"';
  }
  function ws(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function gm(e) {
    return x({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function bx(e, t, n, a) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? a.loading = 1 : (t = e.createElement("link"), a.preload = t, t.addEventListener("load", function() {
      return a.loading |= 1;
    }), t.addEventListener("error", function() {
      return a.loading |= 2;
    }), gt(t, "link", n), ot(t), e.head.appendChild(t));
  }
  function Tl(e) {
    return '[src="' + Qt(e) + '"]';
  }
  function js(e) {
    return "script[async]" + e;
  }
  function xm(e, t, n) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var a = e.querySelector(
            'style[data-href~="' + Qt(n.href) + '"]'
          );
          if (a)
            return t.instance = a, ot(a), a;
          var i = x({}, n, {
            "data-href": n.href,
            "data-precedence": n.precedence,
            href: null,
            precedence: null
          });
          return a = (e.ownerDocument || e).createElement(
            "style"
          ), ot(a), gt(a, "style", i), Qi(a, n.precedence, e), t.instance = a;
        case "stylesheet":
          i = Cl(n.href);
          var r = e.querySelector(
            ws(i)
          );
          if (r)
            return t.state.loading |= 4, t.instance = r, ot(r), r;
          a = gm(n), (i = tn.get(i)) && Yo(a, i), r = (e.ownerDocument || e).createElement("link"), ot(r);
          var h = r;
          return h._p = new Promise(function(_, S) {
            h.onload = _, h.onerror = S;
          }), gt(r, "link", a), t.state.loading |= 4, Qi(r, n.precedence, e), t.instance = r;
        case "script":
          return r = Tl(n.src), (i = e.querySelector(
            js(r)
          )) ? (t.instance = i, ot(i), i) : (a = n, (i = tn.get(r)) && (a = x({}, n), Vo(a, i)), e = e.ownerDocument || e, i = e.createElement("script"), ot(i), gt(i, "link", a), e.head.appendChild(i), t.instance = i);
        case "void":
          return null;
        default:
          throw Error(o(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (a = t.instance, t.state.loading |= 4, Qi(a, n.precedence, e));
    return t.instance;
  }
  function Qi(e, t, n) {
    for (var a = n.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), i = a.length ? a[a.length - 1] : null, r = i, h = 0; h < a.length; h++) {
      var _ = a[h];
      if (_.dataset.precedence === t) r = _;
      else if (r !== i) break;
    }
    r ? r.parentNode.insertBefore(e, r.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
  }
  function Yo(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function Vo(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var Zi = null;
  function bm(e, t, n) {
    if (Zi === null) {
      var a = /* @__PURE__ */ new Map(), i = Zi = /* @__PURE__ */ new Map();
      i.set(n, a);
    } else
      i = Zi, a = i.get(n), a || (a = /* @__PURE__ */ new Map(), i.set(n, a));
    if (a.has(e)) return a;
    for (a.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
      var r = n[i];
      if (!(r[Bl] || r[ht] || e === "link" && r.getAttribute("rel") === "stylesheet") && r.namespaceURI !== "http://www.w3.org/2000/svg") {
        var h = r.getAttribute(t) || "";
        h = e + h;
        var _ = a.get(h);
        _ ? _.push(r) : a.set(h, [r]);
      }
    }
    return a;
  }
  function _m(e, t, n) {
    e = e.ownerDocument || e, e.head.insertBefore(
      n,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function _x(e, t, n) {
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
  function ym(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function yx(e, t, n, a) {
    if (n.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && (n.state.loading & 4) === 0) {
      if (n.instance === null) {
        var i = Cl(a.href), r = t.querySelector(
          ws(i)
        );
        if (r) {
          t = r._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = Ki.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = r, ot(r);
          return;
        }
        r = t.ownerDocument || t, a = gm(a), (i = tn.get(i)) && Yo(a, i), r = r.createElement("link"), ot(r);
        var h = r;
        h._p = new Promise(function(_, S) {
          h.onload = _, h.onerror = S;
        }), gt(r, "link", a), n.instance = r;
      }
      e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && (n.state.loading & 3) === 0 && (e.count++, n = Ki.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
    }
  }
  var Xo = 0;
  function wx(e, t) {
    return e.stylesheets && e.count === 0 && Wi(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
      var a = setTimeout(function() {
        if (e.stylesheets && Wi(e, e.stylesheets), e.unsuspend) {
          var r = e.unsuspend;
          e.unsuspend = null, r();
        }
      }, 6e4 + t);
      0 < e.imgBytes && Xo === 0 && (Xo = 62500 * nx());
      var i = setTimeout(
        function() {
          if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && Wi(e, e.stylesheets), e.unsuspend)) {
            var r = e.unsuspend;
            e.unsuspend = null, r();
          }
        },
        (e.imgBytes > Xo ? 50 : 800) + t
      );
      return e.unsuspend = n, function() {
        e.unsuspend = null, clearTimeout(a), clearTimeout(i);
      };
    } : null;
  }
  function Ki() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) Wi(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var Ji = null;
  function Wi(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, Ji = /* @__PURE__ */ new Map(), t.forEach(jx, e), Ji = null, Ki.call(e));
  }
  function jx(e, t) {
    if (!(t.state.loading & 4)) {
      var n = Ji.get(e);
      if (n) var a = n.get(null);
      else {
        n = /* @__PURE__ */ new Map(), Ji.set(e, n);
        for (var i = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), r = 0; r < i.length; r++) {
          var h = i[r];
          (h.nodeName === "LINK" || h.getAttribute("media") !== "not all") && (n.set(h.dataset.precedence, h), a = h);
        }
        a && n.set(null, a);
      }
      i = t.instance, h = i.getAttribute("data-precedence"), r = n.get(h) || a, r === a && n.set(null, i), n.set(h, i), this.count++, a = Ki.bind(this), i.addEventListener("load", a), i.addEventListener("error", a), r ? r.parentNode.insertBefore(i, r.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
    }
  }
  var Ss = {
    $$typeof: Y,
    Provider: null,
    Consumer: null,
    _currentValue: I,
    _currentValue2: I,
    _threadCount: 0
  };
  function Sx(e, t, n, a, i, r, h, _, S) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = $c(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = $c(0), this.hiddenUpdates = $c(null), this.identifierPrefix = a, this.onUncaughtError = i, this.onCaughtError = r, this.onRecoverableError = h, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = S, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function wm(e, t, n, a, i, r, h, _, S, D, q, X) {
    return e = new Sx(
      e,
      t,
      n,
      h,
      S,
      D,
      q,
      X,
      _
    ), t = 1, r === !0 && (t |= 24), r = Ht(3, null, null, t), e.current = r, r.stateNode = e, t = Sr(), t.refCount++, e.pooledCache = t, t.refCount++, r.memoizedState = {
      element: a,
      isDehydrated: n,
      cache: t
    }, Mr(r), e;
  }
  function jm(e) {
    return e ? (e = cl, e) : cl;
  }
  function Sm(e, t, n, a, i, r) {
    i = jm(i), a.context === null ? a.context = i : a.pendingContext = i, a = In(t), a.payload = { element: n }, r = r === void 0 ? null : r, r !== null && (a.callback = r), n = ea(e, a, t), n !== null && (zt(n, e, t), ns(n, e, t));
  }
  function Nm(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Qo(e, t) {
    Nm(e, t), (e = e.alternate) && Nm(e, t);
  }
  function km(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = ka(e, 67108864);
      t !== null && zt(t, e, 67108864), Qo(e, 67108864);
    }
  }
  function Em(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Gt();
      t = Gc(t);
      var n = ka(e, t);
      n !== null && zt(n, e, t), Qo(e, t);
    }
  }
  var Pi = !0;
  function Nx(e, t, n, a) {
    var i = A.T;
    A.T = null;
    var r = H.p;
    try {
      H.p = 2, Zo(e, t, n, a);
    } finally {
      H.p = r, A.T = i;
    }
  }
  function kx(e, t, n, a) {
    var i = A.T;
    A.T = null;
    var r = H.p;
    try {
      H.p = 8, Zo(e, t, n, a);
    } finally {
      H.p = r, A.T = i;
    }
  }
  function Zo(e, t, n, a) {
    if (Pi) {
      var i = Ko(a);
      if (i === null)
        Oo(
          e,
          t,
          a,
          Ii,
          n
        ), Cm(e, a);
      else if (Mx(
        i,
        e,
        t,
        n,
        a
      ))
        a.stopPropagation();
      else if (Cm(e, a), t & 4 && -1 < Ex.indexOf(e)) {
        for (; i !== null; ) {
          var r = Ja(i);
          if (r !== null)
            switch (r.tag) {
              case 3:
                if (r = r.stateNode, r.current.memoizedState.isDehydrated) {
                  var h = ya(r.pendingLanes);
                  if (h !== 0) {
                    var _ = r;
                    for (_.pendingLanes |= 2, _.entangledLanes |= 2; h; ) {
                      var S = 1 << 31 - Je(h);
                      _.entanglements[1] |= S, h &= ~S;
                    }
                    mn(r), (ze & 6) === 0 && (Di = St() + 500, xs(0));
                  }
                }
                break;
              case 31:
              case 13:
                _ = ka(r, 2), _ !== null && zt(_, r, 2), Li(), Qo(r, 2);
            }
          if (r = Ko(a), r === null && Oo(
            e,
            t,
            a,
            Ii,
            n
          ), r === i) break;
          i = r;
        }
        i !== null && a.stopPropagation();
      } else
        Oo(
          e,
          t,
          a,
          null,
          n
        );
    }
  }
  function Ko(e) {
    return e = Jc(e), Jo(e);
  }
  var Ii = null;
  function Jo(e) {
    if (Ii = null, e = Ka(e), e !== null) {
      var t = f(e);
      if (t === null) e = null;
      else {
        var n = t.tag;
        if (n === 13) {
          if (e = m(t), e !== null) return e;
          e = null;
        } else if (n === 31) {
          if (e = g(t), e !== null) return e;
          e = null;
        } else if (n === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return Ii = e, null;
  }
  function Mm(e) {
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
        switch (Oc()) {
          case $s:
            return 2;
          case Gs:
            return 8;
          case Qa:
          case Dc:
            return 32;
          case Fs:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Wo = !1, da = null, fa = null, ha = null, Ns = /* @__PURE__ */ new Map(), ks = /* @__PURE__ */ new Map(), ma = [], Ex = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function Cm(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        da = null;
        break;
      case "dragenter":
      case "dragleave":
        fa = null;
        break;
      case "mouseover":
      case "mouseout":
        ha = null;
        break;
      case "pointerover":
      case "pointerout":
        Ns.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        ks.delete(t.pointerId);
    }
  }
  function Es(e, t, n, a, i, r) {
    return e === null || e.nativeEvent !== r ? (e = {
      blockedOn: t,
      domEventName: n,
      eventSystemFlags: a,
      nativeEvent: r,
      targetContainers: [i]
    }, t !== null && (t = Ja(t), t !== null && km(t)), e) : (e.eventSystemFlags |= a, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
  }
  function Mx(e, t, n, a, i) {
    switch (t) {
      case "focusin":
        return da = Es(
          da,
          e,
          t,
          n,
          a,
          i
        ), !0;
      case "dragenter":
        return fa = Es(
          fa,
          e,
          t,
          n,
          a,
          i
        ), !0;
      case "mouseover":
        return ha = Es(
          ha,
          e,
          t,
          n,
          a,
          i
        ), !0;
      case "pointerover":
        var r = i.pointerId;
        return Ns.set(
          r,
          Es(
            Ns.get(r) || null,
            e,
            t,
            n,
            a,
            i
          )
        ), !0;
      case "gotpointercapture":
        return r = i.pointerId, ks.set(
          r,
          Es(
            ks.get(r) || null,
            e,
            t,
            n,
            a,
            i
          )
        ), !0;
    }
    return !1;
  }
  function Tm(e) {
    var t = Ka(e.target);
    if (t !== null) {
      var n = f(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = m(n), t !== null) {
            e.blockedOn = t, qu(e.priority, function() {
              Em(n);
            });
            return;
          }
        } else if (t === 31) {
          if (t = g(n), t !== null) {
            e.blockedOn = t, qu(e.priority, function() {
              Em(n);
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
  function ec(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = Ko(e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var a = new n.constructor(
          n.type,
          n
        );
        Kc = a, n.target.dispatchEvent(a), Kc = null;
      } else
        return t = Ja(n), t !== null && km(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function Am(e, t, n) {
    ec(e) && n.delete(t);
  }
  function Cx() {
    Wo = !1, da !== null && ec(da) && (da = null), fa !== null && ec(fa) && (fa = null), ha !== null && ec(ha) && (ha = null), Ns.forEach(Am), ks.forEach(Am);
  }
  function tc(e, t) {
    e.blockedOn === t && (e.blockedOn = null, Wo || (Wo = !0, l.unstable_scheduleCallback(
      l.unstable_NormalPriority,
      Cx
    )));
  }
  var nc = null;
  function Rm(e) {
    nc !== e && (nc = e, l.unstable_scheduleCallback(
      l.unstable_NormalPriority,
      function() {
        nc === e && (nc = null);
        for (var t = 0; t < e.length; t += 3) {
          var n = e[t], a = e[t + 1], i = e[t + 2];
          if (typeof a != "function") {
            if (Jo(a || n) === null)
              continue;
            break;
          }
          var r = Ja(n);
          r !== null && (e.splice(t, 3), t -= 3, Zr(
            r,
            {
              pending: !0,
              data: i,
              method: n.method,
              action: a
            },
            a,
            i
          ));
        }
      }
    ));
  }
  function Al(e) {
    function t(S) {
      return tc(S, e);
    }
    da !== null && tc(da, e), fa !== null && tc(fa, e), ha !== null && tc(ha, e), Ns.forEach(t), ks.forEach(t);
    for (var n = 0; n < ma.length; n++) {
      var a = ma[n];
      a.blockedOn === e && (a.blockedOn = null);
    }
    for (; 0 < ma.length && (n = ma[0], n.blockedOn === null); )
      Tm(n), n.blockedOn === null && ma.shift();
    if (n = (e.ownerDocument || e).$$reactFormReplay, n != null)
      for (a = 0; a < n.length; a += 3) {
        var i = n[a], r = n[a + 1], h = i[Et] || null;
        if (typeof r == "function")
          h || Rm(n);
        else if (h) {
          var _ = null;
          if (r && r.hasAttribute("formAction")) {
            if (i = r, h = r[Et] || null)
              _ = h.formAction;
            else if (Jo(i) !== null) continue;
          } else _ = h.action;
          typeof _ == "function" ? n[a + 1] = _ : (n.splice(a, 3), a -= 3), Rm(n);
        }
      }
  }
  function zm() {
    function e(r) {
      r.canIntercept && r.info === "react-transition" && r.intercept({
        handler: function() {
          return new Promise(function(h) {
            return i = h;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function t() {
      i !== null && (i(), i = null), a || setTimeout(n, 20);
    }
    function n() {
      if (!a && !navigation.transition) {
        var r = navigation.currentEntry;
        r && r.url != null && navigation.navigate(r.url, {
          state: r.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var a = !1, i = null;
      return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
        a = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), i !== null && (i(), i = null);
      };
    }
  }
  function Po(e) {
    this._internalRoot = e;
  }
  ac.prototype.render = Po.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(o(409));
    var n = t.current, a = Gt();
    Sm(n, a, e, t, null, null);
  }, ac.prototype.unmount = Po.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      Sm(e.current, 2, null, e, null, null), Li(), t[Za] = null;
    }
  };
  function ac(e) {
    this._internalRoot = e;
  }
  ac.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Fu();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < ma.length && t !== 0 && t < ma[n].priority; n++) ;
      ma.splice(n, 0, e), n === 0 && Tm(e);
    }
  };
  var Om = c.version;
  if (Om !== "19.2.8")
    throw Error(
      o(
        527,
        Om,
        "19.2.8"
      )
    );
  H.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(o(188)) : (e = Object.keys(e).join(","), Error(o(268, e)));
    return e = v(t), e = e !== null ? b(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var Tx = {
    bundleType: 0,
    version: "19.2.8",
    rendererPackageName: "react-dom",
    currentDispatcherRef: A,
    reconcilerVersion: "19.2.8"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var lc = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!lc.isDisabled && lc.supportsFiber)
      try {
        Vn = lc.inject(
          Tx
        ), bt = lc;
      } catch {
      }
  }
  return Cs.createRoot = function(e, t) {
    if (!d(e)) throw Error(o(299));
    var n = !1, a = "", i = Gf, r = Ff, h = qf;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (i = t.onUncaughtError), t.onCaughtError !== void 0 && (r = t.onCaughtError), t.onRecoverableError !== void 0 && (h = t.onRecoverableError)), t = wm(
      e,
      1,
      !1,
      null,
      null,
      n,
      a,
      null,
      i,
      r,
      h,
      zm
    ), e[Za] = t.current, zo(e), new Po(t);
  }, Cs.hydrateRoot = function(e, t, n) {
    if (!d(e)) throw Error(o(299));
    var a = !1, i = "", r = Gf, h = Ff, _ = qf, S = null;
    return n != null && (n.unstable_strictMode === !0 && (a = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onUncaughtError !== void 0 && (r = n.onUncaughtError), n.onCaughtError !== void 0 && (h = n.onCaughtError), n.onRecoverableError !== void 0 && (_ = n.onRecoverableError), n.formState !== void 0 && (S = n.formState)), t = wm(
      e,
      1,
      !0,
      t,
      n ?? null,
      a,
      i,
      S,
      r,
      h,
      _,
      zm
    ), t.context = jm(null), n = t.current, a = Gt(), a = Gc(a), i = In(a), i.callback = null, ea(n, i, a), n = a, t.current.lanes = n, Ul(t, n), mn(t), e[Za] = t.current, zo(e), new ac(t);
  }, Cs.version = "19.2.8", Cs;
}
var Ym;
function Fx() {
  if (Ym) return tu.exports;
  Ym = 1;
  function l() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(l);
      } catch (c) {
        console.error(c);
      }
  }
  return l(), tu.exports = Gx(), tu.exports;
}
var qx = Fx();
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
var ju = /^(?:[a-z][a-z0-9+.-]*:|[\\/]{2})/i, yp = /^[\\/]{2}/;
function Yx(l, c) {
  return c + l.replace(/\\/g, "/");
}
var Vm = "popstate";
function Xm(l) {
  return typeof l == "object" && l != null && "pathname" in l && "search" in l && "hash" in l && "state" in l && "key" in l;
}
function Vx(l = {}) {
  function c(d, f) {
    let {
      pathname: m = "/",
      search: g = "",
      hash: p = ""
    } = Va(d.location.hash.substring(1));
    return !m.startsWith("/") && !m.startsWith(".") && (m = "/" + m), vu(
      "",
      { pathname: m, search: g, hash: p },
      // state defaults to `null` because `window.history.state` does
      f.state && f.state.usr || null,
      f.state && f.state.key || "default"
    );
  }
  function u(d, f) {
    let m = d.document.querySelector("base"), g = "";
    if (m && m.getAttribute("href")) {
      let p = d.location.href, v = p.indexOf("#");
      g = v === -1 ? p : p.slice(0, v);
    }
    return g + "#" + (typeof f == "string" ? f : As(f));
  }
  function o(d, f) {
    Ft(
      d.pathname.charAt(0) === "/",
      `relative pathnames are not supported in hash history.push(${JSON.stringify(
        f
      )})`
    );
  }
  return Qx(
    c,
    u,
    o,
    l
  );
}
function Ze(l, c) {
  if (l === !1 || l === null || typeof l > "u")
    throw new Error(c);
}
function Ft(l, c) {
  if (!l) {
    typeof console < "u" && console.warn(c);
    try {
      throw new Error(c);
    } catch {
    }
  }
}
function Xx() {
  return Math.random().toString(36).substring(2, 10);
}
function Qm(l, c) {
  return {
    usr: l.state,
    key: l.key,
    idx: c,
    masked: l.mask ? {
      pathname: l.pathname,
      search: l.search,
      hash: l.hash
    } : void 0
  };
}
function vu(l, c, u = null, o, d) {
  return {
    pathname: typeof l == "string" ? l : l.pathname,
    search: "",
    hash: "",
    ...typeof c == "string" ? Va(c) : c,
    state: u,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: c && c.key || o || Xx(),
    mask: d
  };
}
function As({
  pathname: l = "/",
  search: c = "",
  hash: u = ""
}) {
  return c && c !== "?" && (l += c.charAt(0) === "?" ? c : "?" + c), u && u !== "#" && (l += u.charAt(0) === "#" ? u : "#" + u), l;
}
function Va(l) {
  let c = {};
  if (l) {
    let u = l.indexOf("#");
    u >= 0 && (c.hash = l.substring(u), l = l.substring(0, u));
    let o = l.indexOf("?");
    o >= 0 && (c.search = l.substring(o), l = l.substring(0, o)), l && (c.pathname = l);
  }
  return c;
}
function Qx(l, c, u, o = {}) {
  let { window: d = document.defaultView, v5Compat: f = !1 } = o, m = d.history, g = "POP", p = null, v = b();
  v == null && (v = 0, m.replaceState({ ...m.state, idx: v }, ""));
  function b() {
    return (m.state || { idx: null }).idx;
  }
  function x() {
    g = "POP";
    let k = b(), E = k == null ? null : k - v;
    v = k, p && p({ action: g, location: T.location, delta: E });
  }
  function w(k, E) {
    g = "PUSH";
    let U = Xm(k) ? k : vu(T.location, k, E);
    u && u(U, k), v = b() + 1;
    let Y = Qm(U, v), P = T.createHref(U.mask || U);
    try {
      m.pushState(Y, "", P);
    } catch (Z) {
      if (Z instanceof DOMException && Z.name === "DataCloneError")
        throw Z;
      d.location.assign(P);
    }
    f && p && p({ action: g, location: T.location, delta: 1 });
  }
  function j(k, E) {
    g = "REPLACE";
    let U = Xm(k) ? k : vu(T.location, k, E);
    u && u(U, k), v = b();
    let Y = Qm(U, v), P = T.createHref(U.mask || U);
    m.replaceState(Y, "", P), f && p && p({ action: g, location: T.location, delta: 0 });
  }
  function M(k) {
    return Zx(d, k);
  }
  let T = {
    get action() {
      return g;
    },
    get location() {
      return l(d, m);
    },
    listen(k) {
      if (p)
        throw new Error("A history only accepts one active listener");
      return d.addEventListener(Vm, x), p = k, () => {
        d.removeEventListener(Vm, x), p = null;
      };
    },
    createHref(k) {
      return c(d, k);
    },
    createURL: M,
    encodeLocation(k) {
      let E = M(k);
      return {
        pathname: E.pathname,
        search: E.search,
        hash: E.hash
      };
    },
    push: w,
    replace: j,
    go(k) {
      return m.go(k);
    }
  };
  return T;
}
function Zx(l, c, u = !1) {
  let o = "http://localhost";
  l && (o = l.location.origin !== "null" ? l.location.origin : l.location.href), Ze(o, "No window.location.(origin|href) available to create URL");
  let d = typeof c == "string" ? c : As(c);
  return d = d.replace(/ $/, "%20"), !u && yp.test(d) && (d = o + d), new URL(d, o);
}
function wp(l, c, u = "/") {
  return Kx(l, c, u, !1);
}
function Kx(l, c, u, o, d) {
  let f = typeof c == "string" ? Va(c) : c, m = Fn(f.pathname || "/", u);
  if (m == null)
    return null;
  let g = Jx(l), p = null, v = cb(m);
  for (let b = 0; p == null && b < g.length; ++b)
    p = ib(
      g[b],
      v,
      o
    );
  return p;
}
function Jx(l) {
  let c = jp(l);
  return Wx(c), c;
}
function jp(l, c = [], u = [], o = "", d = !1) {
  let f = (m, g, p = d, v) => {
    let b = {
      relativePath: v === void 0 ? m.path || "" : v,
      caseSensitive: m.caseSensitive === !0,
      childrenIndex: g,
      route: m
    };
    if (b.relativePath.startsWith("/")) {
      if (!b.relativePath.startsWith(o) && p)
        return;
      Ze(
        b.relativePath.startsWith(o),
        `Absolute route path "${b.relativePath}" nested under path "${o}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
      ), b.relativePath = b.relativePath.slice(o.length);
    }
    let x = on([o, b.relativePath]), w = u.concat(b);
    m.children && m.children.length > 0 && (Ze(
      // Our types know better, but runtime JS may not!
      // @ts-expect-error
      m.index !== !0,
      `Index routes must not have child routes. Please remove all child routes from route path "${x}".`
    ), jp(
      m.children,
      c,
      w,
      x,
      p
    )), !(m.path == null && !m.index) && c.push({
      path: x,
      score: lb(x, m.index),
      routesMeta: w.map((j, M) => {
        let [T, k] = kp(
          j.relativePath,
          j.caseSensitive,
          M === w.length - 1
        );
        return {
          ...j,
          matcher: T,
          compiledParams: k
        };
      })
    });
  };
  return l.forEach((m, g) => {
    if (m.path === "" || !m.path?.includes("?"))
      f(m, g);
    else
      for (let p of Sp(m.path))
        f(m, g, !0, p);
  }), c;
}
function Sp(l) {
  let c = l.split("/");
  if (c.length === 0) return [];
  let [u, ...o] = c, d = u.endsWith("?"), f = u.replace(/\?$/, "");
  if (o.length === 0)
    return d ? [f, ""] : [f];
  let m = Sp(o.join("/")), g = [];
  return g.push(
    ...m.map(
      (p) => p === "" ? f : [f, p].join("/")
    )
  ), d && g.push(...m), g.map(
    (p) => l.startsWith("/") && p === "" ? "/" : p
  );
}
function Wx(l) {
  l.sort(
    (c, u) => c.score !== u.score ? u.score - c.score : sb(
      c.routesMeta.map((o) => o.childrenIndex),
      u.routesMeta.map((o) => o.childrenIndex)
    )
  );
}
var Px = /^:[\w-]+$/, Ix = 3, eb = 2, tb = 1, nb = 10, ab = -2, Zm = (l) => l === "*";
function lb(l, c) {
  let u = l.split("/"), o = u.length;
  return u.some(Zm) && (o += ab), c && (o += eb), u.filter((d) => !Zm(d)).reduce(
    (d, f) => d + (Px.test(f) ? Ix : f === "" ? tb : nb),
    o
  );
}
function sb(l, c) {
  return l.length === c.length && l.slice(0, -1).every((o, d) => o === c[d]) ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    l[l.length - 1] - c[c.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function ib(l, c, u = !1) {
  let { routesMeta: o } = l, d = {}, f = "/", m = [];
  for (let g = 0; g < o.length; ++g) {
    let p = o[g], v = g === o.length - 1, b = f === "/" ? c : c.slice(f.length) || "/", x = {
      path: p.relativePath,
      caseSensitive: p.caseSensitive,
      end: v
    }, w = (
      // Use precomputed matcher if it exists
      p.matcher && p.compiledParams ? Np(
        x,
        b,
        p.matcher,
        p.compiledParams
      ) : gc(x, b)
    ), j = p.route;
    if (!w && v && u && !o[o.length - 1].route.index && (w = gc(
      {
        path: p.relativePath,
        caseSensitive: p.caseSensitive,
        end: !1
      },
      b
    )), !w)
      return null;
    Object.assign(d, w.params), m.push({
      // TODO: Can this as be avoided?
      params: d,
      pathname: on([f, w.pathname]),
      pathnameBase: ub(
        on([f, w.pathnameBase])
      ),
      route: j
    }), w.pathnameBase !== "/" && (f = on([f, w.pathnameBase]));
  }
  return m;
}
function gc(l, c) {
  typeof l == "string" && (l = { path: l, caseSensitive: !1, end: !0 });
  let [u, o] = kp(
    l.path,
    l.caseSensitive,
    l.end
  );
  return Np(l, c, u, o);
}
function Np(l, c, u, o) {
  let d = c.match(u);
  if (!d) return null;
  let f = d[0], m = f.replace(/(.)\/+$/, "$1"), g = d.slice(1);
  return {
    params: o.reduce(
      (v, { paramName: b, isOptional: x }, w) => {
        if (b === "*") {
          let M = g[w] || "";
          m = f.slice(0, f.length - M.length).replace(/(.)\/+$/, "$1");
        }
        const j = g[w];
        return x && !j ? v[b] = void 0 : v[b] = (j || "").replace(/%2F/g, "/"), v;
      },
      {}
    ),
    pathname: f,
    pathnameBase: m,
    pattern: l
  };
}
function kp(l, c = !1, u = !0) {
  Ft(
    l === "*" || !l.endsWith("*") || l.endsWith("/*"),
    `Route path "${l}" will be treated as if it were "${l.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${l.replace(/\*$/, "/*")}".`
  );
  let o = [], d = "^" + l.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(
    /\/:([\w-]+)(\?)?/g,
    (m, g, p, v, b) => {
      if (o.push({ paramName: g, isOptional: p != null }), p) {
        let x = b.charAt(v + m.length);
        return x && x !== "/" ? "/([^\\/]*)" : "(?:/([^\\/]*))?";
      }
      return "/([^\\/]+)";
    }
  ).replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
  return l.endsWith("*") ? (o.push({ paramName: "*" }), d += l === "*" || l === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$") : u ? d += "\\/*$" : l !== "" && l !== "/" && (d += "(?:(?=\\/|$))"), [new RegExp(d, c ? void 0 : "i"), o];
}
function cb(l) {
  try {
    return l.split("/").map((c) => decodeURIComponent(c).replace(/\//g, "%2F")).join("/");
  } catch (c) {
    return Ft(
      !1,
      `The URL path "${l}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${c}).`
    ), l;
  }
}
function Fn(l, c) {
  if (c === "/") return l;
  if (!l.toLowerCase().startsWith(c.toLowerCase()))
    return null;
  let u = c.endsWith("/") ? c.length - 1 : c.length, o = l.charAt(u);
  return o && o !== "/" ? null : l.slice(u) || "/";
}
function rb(l, c = "/") {
  let {
    pathname: u,
    search: o = "",
    hash: d = ""
  } = typeof l == "string" ? Va(l) : l, f;
  return u ? (u = Ep(u), u.startsWith("/") ? f = Km(u.substring(1), "/") : f = Km(u, c)) : f = c, {
    pathname: f,
    search: db(o),
    hash: fb(d)
  };
}
function Km(l, c) {
  let u = xc(c).split("/");
  return l.split("/").forEach((d) => {
    d === ".." ? u.length > 1 && u.pop() : d !== "." && u.push(d);
  }), u.length > 1 ? u.join("/") : "/";
}
function su(l, c, u, o) {
  return `Cannot include a '${l}' character in a manually specified \`to.${c}\` field [${JSON.stringify(
    o
  )}].  Please separate it out to the \`to.${u}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function ob(l) {
  return l.filter(
    (c, u) => u === 0 || c.route.path && c.route.path.length > 0
  );
}
function Su(l) {
  let c = ob(l);
  return c.map(
    (u, o) => o === c.length - 1 ? u.pathname : u.pathnameBase
  );
}
function jc(l, c, u, o = !1) {
  let d;
  typeof l == "string" ? d = Va(l) : (d = { ...l }, Ze(
    !d.pathname || !d.pathname.includes("?"),
    su("?", "pathname", "search", d)
  ), Ze(
    !d.pathname || !d.pathname.includes("#"),
    su("#", "pathname", "hash", d)
  ), Ze(
    !d.search || !d.search.includes("#"),
    su("#", "search", "hash", d)
  ));
  let f = l === "" || d.pathname === "", m = f ? "/" : d.pathname, g;
  if (m == null)
    g = u;
  else {
    let x = c.length - 1;
    if (!o && m.startsWith("..")) {
      let w = m.split("/");
      for (; w[0] === ".."; )
        w.shift(), x -= 1;
      d.pathname = w.join("/");
    }
    g = x >= 0 ? c[x] : "/";
  }
  let p = rb(d, g), v = m && m !== "/" && m.endsWith("/"), b = (f || m === ".") && u.endsWith("/");
  return !p.pathname.endsWith("/") && (v || b) && (p.pathname += "/"), p;
}
var Ep = (l) => l.replace(/[\\/]{2,}/g, "/"), on = (l) => Ep(l.join("/")), xc = (l) => l.replace(/\/+$/, ""), ub = (l) => xc(l).replace(/^\/*/, "/"), db = (l) => !l || l === "?" ? "" : l.startsWith("?") ? l : "?" + l, fb = (l) => !l || l === "#" ? "" : l.startsWith("#") ? l : "#" + l, hb = class {
  constructor(l, c, u, o = !1) {
    this.status = l, this.statusText = c || "", this.internal = o, u instanceof Error ? (this.data = u.toString(), this.error = u) : this.data = u;
  }
};
function mb(l) {
  return l != null && typeof l.status == "number" && typeof l.statusText == "string" && typeof l.internal == "boolean" && "data" in l;
}
function pb(l) {
  let c = l.map((u) => u.route.path).filter(Boolean);
  return on(c) || "/";
}
var Mp = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
function Cp(l, c) {
  let u = l;
  if (typeof u != "string" || !ju.test(u))
    return {
      absoluteURL: void 0,
      isExternal: !1,
      to: u
    };
  let o = u, d = !1;
  if (Mp)
    try {
      let f = new URL(window.location.href), m = yp.test(u) ? new URL(Yx(u, f.protocol)) : new URL(u), g = Fn(m.pathname, c);
      m.origin === f.origin && g != null ? u = g + m.search + m.hash : d = !0;
    } catch {
      Ft(
        !1,
        `<Link to="${u}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`
      );
    }
  return {
    absoluteURL: o,
    isExternal: d,
    to: u
  };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
var Tp = [
  "POST",
  "PUT",
  "PATCH",
  "DELETE"
];
new Set(
  Tp
);
var vb = [
  "GET",
  ...Tp
];
new Set(vb);
var gb = [
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
function xb(l) {
  try {
    return gb.includes(new URL(l).protocol);
  } catch {
    return !1;
  }
}
var zl = y.createContext(null);
zl.displayName = "DataRouter";
var Sc = y.createContext(null);
Sc.displayName = "DataRouterState";
var Ap = y.createContext(!1);
function bb() {
  return y.useContext(Ap);
}
var Rp = y.createContext({
  isTransitioning: !1
});
Rp.displayName = "ViewTransition";
var _b = y.createContext(
  /* @__PURE__ */ new Map()
);
_b.displayName = "Fetchers";
var yb = y.createContext(null);
yb.displayName = "Await";
var qt = y.createContext(
  null
);
qt.displayName = "Navigation";
var zs = y.createContext(
  null
);
zs.displayName = "Location";
var bn = y.createContext({
  outlet: null,
  matches: [],
  isDataRoute: !1
});
bn.displayName = "Route";
var Nu = y.createContext(null);
Nu.displayName = "RouteError";
var zp = "REACT_ROUTER_ERROR", wb = "REDIRECT", jb = "ROUTE_ERROR_RESPONSE";
function Sb(l) {
  if (l.startsWith(`${zp}:${wb}:{`))
    try {
      let c = JSON.parse(l.slice(28));
      if (typeof c == "object" && c && typeof c.status == "number" && typeof c.statusText == "string" && typeof c.location == "string" && typeof c.reloadDocument == "boolean" && typeof c.replace == "boolean")
        return c;
    } catch {
    }
}
function Nb(l) {
  if (l.startsWith(
    `${zp}:${jb}:{`
  ))
    try {
      let c = JSON.parse(l.slice(40));
      if (typeof c == "object" && c && typeof c.status == "number" && typeof c.statusText == "string")
        return new hb(
          c.status,
          c.statusText,
          c.data
        );
    } catch {
    }
}
function kb(l, { relative: c } = {}) {
  Ze(
    Ol(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useHref() may be used only in the context of a <Router> component."
  );
  let { basename: u, navigator: o } = y.useContext(qt), { hash: d, pathname: f, search: m } = Os(l, { relative: c }), g = f;
  return u !== "/" && (g = f === "/" ? u : on([u, f])), o.createHref({ pathname: g, search: m, hash: d });
}
function Ol() {
  return y.useContext(zs) != null;
}
function jt() {
  return Ze(
    Ol(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useLocation() may be used only in the context of a <Router> component."
  ), y.useContext(zs).location;
}
var Op = "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function Dp(l) {
  y.useContext(qt).static || y.useLayoutEffect(l);
}
function dt() {
  let { isDataRoute: l } = y.useContext(bn);
  return l ? Bb() : Eb();
}
function Eb() {
  Ze(
    Ol(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useNavigate() may be used only in the context of a <Router> component."
  );
  let l = y.useContext(zl), { basename: c, navigator: u } = y.useContext(qt), { matches: o } = y.useContext(bn), { pathname: d } = jt(), f = JSON.stringify(Su(o)), m = y.useRef(!1);
  return Dp(() => {
    m.current = !0;
  }), y.useCallback(
    (p, v = {}) => {
      if (Ft(m.current, Op), !m.current) return;
      if (typeof p == "number") {
        u.go(p);
        return;
      }
      let b = jc(
        p,
        JSON.parse(f),
        d,
        v.relative === "path"
      );
      l == null && c !== "/" && (b.pathname = b.pathname === "/" ? c : on([c, b.pathname])), (v.replace ? u.replace : u.push)(
        b,
        v.state,
        v
      );
    },
    [
      c,
      u,
      f,
      d,
      l
    ]
  );
}
y.createContext(null);
function Os(l, { relative: c } = {}) {
  let { matches: u } = y.useContext(bn), { pathname: o } = jt(), d = JSON.stringify(Su(u));
  return y.useMemo(
    () => jc(
      l,
      JSON.parse(d),
      o,
      c === "path"
    ),
    [l, d, o, c]
  );
}
function Mb(l, c) {
  return Hp(l, c);
}
function Hp(l, c, u) {
  Ze(
    Ol(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useRoutes() may be used only in the context of a <Router> component."
  );
  let { navigator: o } = y.useContext(qt), { matches: d } = y.useContext(bn), f = d[d.length - 1], m = f ? f.params : {}, g = f ? f.pathname : "/", p = f ? f.pathnameBase : "/", v = f && f.route;
  {
    let k = v && v.path || "";
    Up(
      g,
      !v || k.endsWith("*") || k.endsWith("*?"),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${g}" (under <Route path="${k}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${k}"> to <Route path="${k === "/" ? "*" : `${k}/*`}">.`
    );
  }
  let b = jt(), x;
  if (c) {
    let k = typeof c == "string" ? Va(c) : c;
    Ze(
      p === "/" || k.pathname?.startsWith(p),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${p}" but pathname "${k.pathname}" was given in the \`location\` prop.`
    ), x = k;
  } else
    x = b;
  let w = x.pathname || "/", j = w;
  if (p !== "/") {
    let k = p.replace(/^\//, "").split("/");
    j = "/" + w.replace(/^\//, "").split("/").slice(k.length).join("/");
  }
  let M = u && u.state.matches.length ? (
    // If we're in a data router, use the matches we've already identified but ensure
    // we have the latest route instances from the manifest in case elements have changed
    u.state.matches.map(
      (k) => Object.assign(k, {
        route: u.manifest[k.route.id] || k.route
      })
    )
  ) : wp(l, { pathname: j });
  Ft(
    v || M != null,
    `No routes matched location "${x.pathname}${x.search}${x.hash}" `
  ), Ft(
    M == null || M[M.length - 1].route.element !== void 0 || M[M.length - 1].route.Component !== void 0 || M[M.length - 1].route.lazy !== void 0,
    `Matched leaf route at location "${x.pathname}${x.search}${x.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`
  );
  let T = zb(
    M && M.map(
      (k) => Object.assign({}, k, {
        params: Object.assign({}, m, k.params),
        pathname: on([
          p,
          // Re-encode pathnames that were decoded inside matchRoutes.
          // Pre-encode `%`, `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          o.encodeLocation ? o.encodeLocation(
            k.pathname.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : k.pathname
        ]),
        pathnameBase: k.pathnameBase === "/" ? p : on([
          p,
          // Re-encode pathnames that were decoded inside matchRoutes
          // Pre-encode `%`, `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          o.encodeLocation ? o.encodeLocation(
            k.pathnameBase.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : k.pathnameBase
        ])
      })
    ),
    d,
    u
  );
  return c && T ? /* @__PURE__ */ y.createElement(
    zs.Provider,
    {
      value: {
        location: {
          pathname: "/",
          search: "",
          hash: "",
          state: null,
          key: "default",
          mask: void 0,
          ...x
        },
        navigationType: "POP"
        /* Pop */
      }
    },
    T
  ) : T;
}
function Cb() {
  let l = Ub(), c = mb(l) ? `${l.status} ${l.statusText}` : l instanceof Error ? l.message : JSON.stringify(l), u = l instanceof Error ? l.stack : null, o = "rgba(200,200,200, 0.5)", d = { padding: "0.5rem", backgroundColor: o }, f = { padding: "2px 4px", backgroundColor: o }, m = null;
  return console.error(
    "Error handled by React Router default ErrorBoundary:",
    l
  ), m = /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("p", null, "💿 Hey developer 👋"), /* @__PURE__ */ y.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /* @__PURE__ */ y.createElement("code", { style: f }, "ErrorBoundary"), " or", " ", /* @__PURE__ */ y.createElement("code", { style: f }, "errorElement"), " prop on your route.")), /* @__PURE__ */ y.createElement(y.Fragment, null, /* @__PURE__ */ y.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ y.createElement("h3", { style: { fontStyle: "italic" } }, c), u ? /* @__PURE__ */ y.createElement("pre", { style: d }, u) : null, m);
}
var Tb = /* @__PURE__ */ y.createElement(Cb, null), Lp = class extends y.Component {
  constructor(l) {
    super(l), this.state = {
      location: l.location,
      revalidation: l.revalidation,
      error: l.error
    };
  }
  static getDerivedStateFromError(l) {
    return { error: l };
  }
  static getDerivedStateFromProps(l, c) {
    return c.location !== l.location || c.revalidation !== "idle" && l.revalidation === "idle" ? {
      error: l.error,
      location: l.location,
      revalidation: l.revalidation
    } : {
      error: l.error !== void 0 ? l.error : c.error,
      location: c.location,
      revalidation: l.revalidation || c.revalidation
    };
  }
  componentDidCatch(l, c) {
    this.props.onError ? this.props.onError(l, c) : console.error(
      "React Router caught the following error during render",
      l
    );
  }
  render() {
    let l = this.state.error;
    if (this.context && typeof l == "object" && l && "digest" in l && typeof l.digest == "string") {
      const u = Nb(l.digest);
      u && (l = u);
    }
    let c = l !== void 0 ? /* @__PURE__ */ y.createElement(bn.Provider, { value: this.props.routeContext }, /* @__PURE__ */ y.createElement(
      Nu.Provider,
      {
        value: l,
        children: this.props.component
      }
    )) : this.props.children;
    return this.context ? /* @__PURE__ */ y.createElement(Ab, { error: l }, c) : c;
  }
};
Lp.contextType = Ap;
var iu = /* @__PURE__ */ new WeakMap();
function Ab({
  children: l,
  error: c
}) {
  let { basename: u } = y.useContext(qt);
  if (typeof c == "object" && c && "digest" in c && typeof c.digest == "string") {
    let o = Sb(c.digest);
    if (o) {
      let d = iu.get(c);
      if (d) throw d;
      let f = Cp(o.location, u), m = f.absoluteURL || f.to;
      if (xb(m))
        throw new Error("Invalid redirect location");
      if (Mp && !iu.get(c))
        if (f.isExternal || o.reloadDocument)
          window.location.href = m;
        else {
          const g = Promise.resolve().then(
            () => window.__reactRouterDataRouter.navigate(f.to, {
              replace: o.replace
            })
          );
          throw iu.set(c, g), g;
        }
      return /* @__PURE__ */ y.createElement("meta", { httpEquiv: "refresh", content: `0;url=${m}` });
    }
  }
  return l;
}
function Rb({ routeContext: l, match: c, children: u }) {
  let o = y.useContext(zl);
  return o && o.static && o.staticContext && (c.route.errorElement || c.route.ErrorBoundary) && (o.staticContext._deepestRenderedBoundaryId = c.route.id), /* @__PURE__ */ y.createElement(bn.Provider, { value: l }, u);
}
function zb(l, c = [], u) {
  let o = u?.state;
  if (l == null) {
    if (!o)
      return null;
    if (o.errors)
      l = o.matches;
    else if (c.length === 0 && !o.initialized && o.matches.length > 0)
      l = o.matches;
    else
      return null;
  }
  let d = l, f = o?.errors;
  if (f != null) {
    let b = d.findIndex(
      (x) => x.route.id && f?.[x.route.id] !== void 0
    );
    Ze(
      b >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(
        f
      ).join(",")}`
    ), d = d.slice(
      0,
      Math.min(d.length, b + 1)
    );
  }
  let m = !1, g = -1;
  if (u && o) {
    m = o.renderFallback;
    for (let b = 0; b < d.length; b++) {
      let x = d[b];
      if ((x.route.HydrateFallback || x.route.hydrateFallbackElement) && (g = b), x.route.id) {
        let { loaderData: w, errors: j } = o, M = x.route.loader && !w.hasOwnProperty(x.route.id) && (!j || j[x.route.id] === void 0);
        if (x.route.lazy || M) {
          u.isStatic && (m = !0), g >= 0 ? d = d.slice(0, g + 1) : d = [d[0]];
          break;
        }
      }
    }
  }
  let p = u?.onError, v = o && p ? (b, x) => {
    p(b, {
      location: o.location,
      params: o.matches?.[0]?.params ?? {},
      pattern: pb(o.matches),
      errorInfo: x
    });
  } : void 0;
  return d.reduceRight(
    (b, x, w) => {
      let j, M = !1, T = null, k = null;
      o && (j = f && x.route.id ? f[x.route.id] : void 0, T = x.route.errorElement || Tb, m && (g < 0 && w === 0 ? (Up(
        "route-fallback",
        !1,
        "No `HydrateFallback` element provided to render during initial hydration"
      ), M = !0, k = null) : g === w && (M = !0, k = x.route.hydrateFallbackElement || null)));
      let E = c.concat(d.slice(0, w + 1)), U = () => {
        let Y;
        return j ? Y = T : M ? Y = k : x.route.Component ? Y = /* @__PURE__ */ y.createElement(x.route.Component, null) : x.route.element ? Y = x.route.element : Y = b, /* @__PURE__ */ y.createElement(
          Rb,
          {
            match: x,
            routeContext: {
              outlet: b,
              matches: E,
              isDataRoute: o != null
            },
            children: Y
          }
        );
      };
      return o && (x.route.ErrorBoundary || x.route.errorElement || w === 0) ? /* @__PURE__ */ y.createElement(
        Lp,
        {
          location: o.location,
          revalidation: o.revalidation,
          component: T,
          error: j,
          children: U(),
          routeContext: { outlet: null, matches: E, isDataRoute: !0 },
          onError: v
        }
      ) : U();
    },
    null
  );
}
function ku(l) {
  return `${l} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function Ob(l) {
  let c = y.useContext(zl);
  return Ze(c, ku(l)), c;
}
function Db(l) {
  let c = y.useContext(Sc);
  return Ze(c, ku(l)), c;
}
function Hb(l) {
  let c = y.useContext(bn);
  return Ze(c, ku(l)), c;
}
function Eu(l) {
  let c = Hb(l), u = c.matches[c.matches.length - 1];
  return Ze(
    u.route.id,
    `${l} can only be used on routes that contain a unique "id"`
  ), u.route.id;
}
function Lb() {
  return Eu(
    "useRouteId"
    /* UseRouteId */
  );
}
function Ub() {
  let l = y.useContext(Nu), c = Db(
    "useRouteError"
    /* UseRouteError */
  ), u = Eu(
    "useRouteError"
    /* UseRouteError */
  );
  return l !== void 0 ? l : c.errors?.[u];
}
function Bb() {
  let { router: l } = Ob(
    "useNavigate"
    /* UseNavigateStable */
  ), c = Eu(
    "useNavigate"
    /* UseNavigateStable */
  ), u = y.useRef(!1);
  return Dp(() => {
    u.current = !0;
  }), y.useCallback(
    async (d, f = {}) => {
      Ft(u.current, Op), u.current && (typeof d == "number" ? await l.navigate(d) : await l.navigate(d, { fromRouteId: c, ...f }));
    },
    [l, c]
  );
}
var Jm = {};
function Up(l, c, u) {
  !c && !Jm[l] && (Jm[l] = !0, Ft(!1, u));
}
y.memo($b);
function $b({
  routes: l,
  manifest: c,
  future: u,
  state: o,
  isStatic: d,
  onError: f
}) {
  return Hp(l, void 0, {
    manifest: c,
    state: o,
    isStatic: d,
    onError: f
  });
}
function Fa({
  to: l,
  replace: c,
  state: u,
  relative: o
}) {
  Ze(
    Ol(),
    // TODO: This error is probably because they somehow have 2 versions of
    // the router loaded. We can help them understand how to avoid that.
    "<Navigate> may be used only in the context of a <Router> component."
  );
  let { static: d } = y.useContext(qt);
  Ft(
    !d,
    "<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change."
  );
  let { matches: f } = y.useContext(bn), { pathname: m } = jt(), g = dt(), p = jc(
    l,
    Su(f),
    m,
    o === "path"
  ), v = JSON.stringify(p);
  return y.useEffect(() => {
    g(JSON.parse(v), { replace: c, state: u, relative: o });
  }, [g, v, o, c, u]), null;
}
function $e(l) {
  Ze(
    !1,
    "A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>."
  );
}
function Gb({
  basename: l = "/",
  children: c = null,
  location: u,
  navigationType: o = "POP",
  navigator: d,
  static: f = !1,
  useTransitions: m
}) {
  Ze(
    !Ol(),
    "You cannot render a <Router> inside another <Router>. You should never have more than one in your app."
  );
  let g = l.replace(/^\/*/, "/"), p = y.useMemo(
    () => ({
      basename: g,
      navigator: d,
      static: f,
      useTransitions: m,
      future: {}
    }),
    [g, d, f, m]
  );
  typeof u == "string" && (u = Va(u));
  let {
    pathname: v = "/",
    search: b = "",
    hash: x = "",
    state: w = null,
    key: j = "default",
    mask: M
  } = u, T = y.useMemo(() => {
    let k = Fn(v, g);
    return k == null ? null : {
      location: {
        pathname: k,
        search: b,
        hash: x,
        state: w,
        key: j,
        mask: M
      },
      navigationType: o
    };
  }, [g, v, b, x, w, j, o, M]);
  return Ft(
    T != null,
    `<Router basename="${g}"> is not able to match the URL "${v}${b}${x}" because it does not start with the basename, so the <Router> won't render anything.`
  ), T == null ? null : /* @__PURE__ */ y.createElement(qt.Provider, { value: p }, /* @__PURE__ */ y.createElement(zs.Provider, { children: c, value: T }));
}
function Fb({
  children: l,
  location: c
}) {
  return Mb(gu(l), c);
}
function gu(l, c = []) {
  let u = [];
  return y.Children.forEach(l, (o, d) => {
    if (!y.isValidElement(o))
      return;
    let f = [...c, d];
    if (o.type === y.Fragment) {
      u.push.apply(
        u,
        gu(o.props.children, f)
      );
      return;
    }
    Ze(
      o.type === $e,
      `[${typeof o.type == "string" ? o.type : o.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`
    ), Ze(
      !o.props.index || !o.props.children,
      "An index route cannot have child routes."
    );
    let m = {
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
    o.props.children && (m.children = gu(
      o.props.children,
      f
    )), u.push(m);
  }), u;
}
var hc = "get", mc = "application/x-www-form-urlencoded";
function Nc(l) {
  return typeof HTMLElement < "u" && l instanceof HTMLElement;
}
function qb(l) {
  return Nc(l) && l.tagName.toLowerCase() === "button";
}
function Yb(l) {
  return Nc(l) && l.tagName.toLowerCase() === "form";
}
function Vb(l) {
  return Nc(l) && l.tagName.toLowerCase() === "input";
}
function Xb(l) {
  return !!(l.metaKey || l.altKey || l.ctrlKey || l.shiftKey);
}
function Qb(l, c) {
  return l.button === 0 && // Ignore everything but left clicks
  (!c || c === "_self") && // Let browser handle "target=_blank" etc.
  !Xb(l);
}
function xu(l = "") {
  return new URLSearchParams(
    typeof l == "string" || Array.isArray(l) || l instanceof URLSearchParams ? l : Object.keys(l).reduce((c, u) => {
      let o = l[u];
      return c.concat(
        Array.isArray(o) ? o.map((d) => [u, d]) : [[u, o]]
      );
    }, [])
  );
}
function Zb(l, c) {
  let u = xu(l);
  return c && c.forEach((o, d) => {
    u.has(d) || c.getAll(d).forEach((f) => {
      u.append(d, f);
    });
  }), u;
}
var ic = null;
function Kb() {
  if (ic === null)
    try {
      new FormData(
        document.createElement("form"),
        // @ts-expect-error if FormData supports the submitter parameter, this will throw
        0
      ), ic = !1;
    } catch {
      ic = !0;
    }
  return ic;
}
var Jb = /* @__PURE__ */ new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
]);
function cu(l) {
  return l != null && !Jb.has(l) ? (Ft(
    !1,
    `"${l}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${mc}"`
  ), null) : l;
}
function Wb(l, c) {
  let u, o, d, f, m;
  if (Yb(l)) {
    let g = l.getAttribute("action");
    o = g ? Fn(g, c) : null, u = l.getAttribute("method") || hc, d = cu(l.getAttribute("enctype")) || mc, f = new FormData(l);
  } else if (qb(l) || Vb(l) && (l.type === "submit" || l.type === "image")) {
    let g = l.form;
    if (g == null)
      throw new Error(
        'Cannot submit a <button> or <input type="submit"> without a <form>'
      );
    let p = l.getAttribute("formaction") || g.getAttribute("action");
    if (o = p ? Fn(p, c) : null, u = l.getAttribute("formmethod") || g.getAttribute("method") || hc, d = cu(l.getAttribute("formenctype")) || cu(g.getAttribute("enctype")) || mc, f = new FormData(g, l), !Kb()) {
      let { name: v, type: b, value: x } = l;
      if (b === "image") {
        let w = v ? `${v}.` : "";
        f.append(`${w}x`, "0"), f.append(`${w}y`, "0");
      } else v && f.append(v, x);
    }
  } else {
    if (Nc(l))
      throw new Error(
        'Cannot submit element that is not <form>, <button>, or <input type="submit|image">'
      );
    u = hc, o = null, d = mc, m = l;
  }
  return f && d === "text/plain" && (m = f, f = void 0), { action: o, method: u.toLowerCase(), encType: d, formData: f, body: m };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function Mu(l, c) {
  if (l === !1 || l === null || typeof l > "u")
    throw new Error(c);
}
function Bp(l, c, u, o) {
  let d = typeof l == "string" ? new URL(
    l,
    // This can be called during the SSR flow via PrefetchPageLinksImpl so
    // don't assume window is available
    typeof window > "u" ? "server://singlefetch/" : window.location.origin
  ) : l;
  return u ? d.pathname.endsWith("/") ? d.pathname = `${d.pathname}_.${o}` : d.pathname = `${d.pathname}.${o}` : d.pathname === "/" ? d.pathname = `_root.${o}` : c && Fn(d.pathname, c) === "/" ? d.pathname = `${xc(c)}/_root.${o}` : d.pathname = `${xc(d.pathname)}.${o}`, d;
}
async function Pb(l, c) {
  if (l.id in c)
    return c[l.id];
  try {
    let u = await import(
      /* @vite-ignore */
      /* webpackIgnore: true */
      l.module
    );
    return c[l.id] = u, u;
  } catch (u) {
    return console.error(
      `Error loading route module \`${l.module}\`, reloading page...`
    ), console.error(u), window.__reactRouterContext && window.__reactRouterContext.isSpaMode, window.location.reload(), new Promise(() => {
    });
  }
}
function Ib(l) {
  return l == null ? !1 : l.href == null ? l.rel === "preload" && typeof l.imageSrcSet == "string" && typeof l.imageSizes == "string" : typeof l.rel == "string" && typeof l.href == "string";
}
async function e_(l, c, u) {
  let o = await Promise.all(
    l.map(async (d) => {
      let f = c.routes[d.route.id];
      if (f) {
        let m = await Pb(f, u);
        return m.links ? m.links() : [];
      }
      return [];
    })
  );
  return l_(
    o.flat(1).filter(Ib).filter((d) => d.rel === "stylesheet" || d.rel === "preload").map(
      (d) => d.rel === "stylesheet" ? { ...d, rel: "prefetch", as: "style" } : { ...d, rel: "prefetch" }
    )
  );
}
function Wm(l, c, u, o, d, f) {
  let m = (p, v) => u[v] ? p.route.id !== u[v].route.id : !0, g = (p, v) => (
    // param change, /users/123 -> /users/456
    u[v].pathname !== p.pathname || // splat param changed, which is not present in match.path
    // e.g. /files/images/avatar.jpg -> files/finances.xls
    u[v].route.path?.endsWith("*") && u[v].params["*"] !== p.params["*"]
  );
  return f === "assets" ? c.filter(
    (p, v) => m(p, v) || g(p, v)
  ) : f === "data" ? c.filter((p, v) => {
    let b = o.routes[p.route.id];
    if (!b || !b.hasLoader)
      return !1;
    if (m(p, v) || g(p, v))
      return !0;
    if (p.route.shouldRevalidate) {
      let x = p.route.shouldRevalidate({
        currentUrl: new URL(
          d.pathname + d.search + d.hash,
          window.origin
        ),
        currentParams: u[0]?.params || {},
        nextUrl: new URL(l, window.origin),
        nextParams: p.params,
        defaultShouldRevalidate: !0
      });
      if (typeof x == "boolean")
        return x;
    }
    return !0;
  }) : [];
}
function t_(l, c, { includeHydrateFallback: u } = {}) {
  return n_(
    l.map((o) => {
      let d = c.routes[o.route.id];
      if (!d) return [];
      let f = [d.module];
      return d.clientActionModule && (f = f.concat(d.clientActionModule)), d.clientLoaderModule && (f = f.concat(d.clientLoaderModule)), u && d.hydrateFallbackModule && (f = f.concat(d.hydrateFallbackModule)), d.imports && (f = f.concat(d.imports)), f;
    }).flat(1)
  );
}
function n_(l) {
  return [...new Set(l)];
}
function a_(l) {
  let c = {}, u = Object.keys(l).sort();
  for (let o of u)
    c[o] = l[o];
  return c;
}
function l_(l, c) {
  let u = /* @__PURE__ */ new Set();
  return new Set(c), l.reduce((o, d) => {
    let f = JSON.stringify(a_(d));
    return u.has(f) || (u.add(f), o.push({ key: f, link: d })), o;
  }, []);
}
function Cu() {
  let l = y.useContext(zl);
  return Mu(
    l,
    "You must render this element inside a <DataRouterContext.Provider> element"
  ), l;
}
function s_() {
  let l = y.useContext(Sc);
  return Mu(
    l,
    "You must render this element inside a <DataRouterStateContext.Provider> element"
  ), l;
}
var Tu = y.createContext(void 0);
Tu.displayName = "FrameworkContext";
function kc() {
  let l = y.useContext(Tu);
  return Mu(
    l,
    "You must render this element inside a <HydratedRouter> element"
  ), l;
}
function i_(l, c) {
  let u = y.useContext(Tu), [o, d] = y.useState(!1), [f, m] = y.useState(!1), { onFocus: g, onBlur: p, onMouseEnter: v, onMouseLeave: b, onTouchStart: x } = c, w = y.useRef(null);
  y.useEffect(() => {
    if (l === "render" && m(!0), l === "viewport") {
      let T = (E) => {
        E.forEach((U) => {
          m(U.isIntersecting);
        });
      }, k = new IntersectionObserver(T, { threshold: 0.5 });
      return w.current && k.observe(w.current), () => {
        k.disconnect();
      };
    }
  }, [l]), y.useEffect(() => {
    if (o) {
      let T = setTimeout(() => {
        m(!0);
      }, 100);
      return () => {
        clearTimeout(T);
      };
    }
  }, [o]);
  let j = () => {
    d(!0);
  }, M = () => {
    d(!1), m(!1);
  };
  return u ? l !== "intent" ? [f, w, {}] : [
    f,
    w,
    {
      onFocus: Ts(g, j),
      onBlur: Ts(p, M),
      onMouseEnter: Ts(v, j),
      onMouseLeave: Ts(b, M),
      onTouchStart: Ts(x, j)
    }
  ] : [!1, w, {}];
}
function Ts(l, c) {
  return (u) => {
    l && l(u), u.defaultPrevented || c(u);
  };
}
function c_({ page: l, ...c }) {
  let u = bb(), { nonce: o } = kc(), { router: d } = Cu(), f = y.useMemo(
    () => wp(d.routes, l, d.basename),
    [d.routes, l, d.basename]
  );
  return f ? (c.nonce == null && o && (c = { ...c, nonce: o }), u ? /* @__PURE__ */ y.createElement(o_, { page: l, matches: f, ...c }) : /* @__PURE__ */ y.createElement(u_, { page: l, matches: f, ...c })) : null;
}
function r_(l) {
  let { manifest: c, routeModules: u } = kc(), [o, d] = y.useState([]);
  return y.useEffect(() => {
    let f = !1;
    return e_(l, c, u).then(
      (m) => {
        f || d(m);
      }
    ), () => {
      f = !0;
    };
  }, [l, c, u]), o;
}
function o_({
  page: l,
  matches: c,
  ...u
}) {
  let o = jt(), { future: d } = kc(), { basename: f } = Cu(), m = y.useMemo(() => {
    if (l === o.pathname + o.search + o.hash)
      return [];
    let g = Bp(
      l,
      f,
      d.v8_trailingSlashAwareDataRequests,
      "rsc"
    ), p = !1, v = [];
    for (let b of c)
      typeof b.route.shouldRevalidate == "function" ? p = !0 : v.push(b.route.id);
    return p && v.length > 0 && g.searchParams.set("_routes", v.join(",")), [g.pathname + g.search];
  }, [
    f,
    d.v8_trailingSlashAwareDataRequests,
    l,
    o,
    c
  ]);
  return /* @__PURE__ */ y.createElement(y.Fragment, null, m.map((g) => /* @__PURE__ */ y.createElement("link", { key: g, rel: "prefetch", as: "fetch", href: g, ...u })));
}
function u_({
  page: l,
  matches: c,
  ...u
}) {
  let o = jt(), { future: d, manifest: f, routeModules: m } = kc(), { basename: g } = Cu(), { loaderData: p, matches: v } = s_(), b = y.useMemo(
    () => Wm(
      l,
      c,
      v,
      f,
      o,
      "data"
    ),
    [l, c, v, f, o]
  ), x = y.useMemo(
    () => Wm(
      l,
      c,
      v,
      f,
      o,
      "assets"
    ),
    [l, c, v, f, o]
  ), w = y.useMemo(() => {
    if (l === o.pathname + o.search + o.hash)
      return [];
    let T = /* @__PURE__ */ new Set(), k = !1;
    if (c.forEach((U) => {
      let Y = f.routes[U.route.id];
      !Y || !Y.hasLoader || (!b.some((P) => P.route.id === U.route.id) && U.route.id in p && m[U.route.id]?.shouldRevalidate || Y.hasClientLoader ? k = !0 : T.add(U.route.id));
    }), T.size === 0)
      return [];
    let E = Bp(
      l,
      g,
      d.v8_trailingSlashAwareDataRequests,
      "data"
    );
    return k && T.size > 0 && E.searchParams.set(
      "_routes",
      c.filter((U) => T.has(U.route.id)).map((U) => U.route.id).join(",")
    ), [E.pathname + E.search];
  }, [
    g,
    d.v8_trailingSlashAwareDataRequests,
    p,
    o,
    f,
    b,
    c,
    l,
    m
  ]), j = y.useMemo(
    () => t_(x, f),
    [x, f]
  ), M = r_(x);
  return /* @__PURE__ */ y.createElement(y.Fragment, null, w.map((T) => /* @__PURE__ */ y.createElement("link", { key: T, rel: "prefetch", as: "fetch", href: T, ...u })), j.map((T) => /* @__PURE__ */ y.createElement("link", { key: T, rel: "modulepreload", href: T, ...u })), M.map(({ key: T, link: k }) => (
    // these don't spread `linkProps` because they are full link descriptors
    // already with their own props
    /* @__PURE__ */ y.createElement(
      "link",
      {
        key: T,
        nonce: u.nonce,
        ...k,
        crossOrigin: k.crossOrigin ?? u.crossOrigin
      }
    )
  )));
}
function d_(...l) {
  return (c) => {
    l.forEach((u) => {
      typeof u == "function" ? u(c) : u != null && (u.current = c);
    });
  };
}
var f_ = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
try {
  f_ && (window.__reactRouterVersion = // @ts-expect-error
  "7.18.2");
} catch {
}
function h_({
  basename: l,
  children: c,
  useTransitions: u,
  window: o
}) {
  let d = y.useRef();
  d.current == null && (d.current = Vx({ window: o, v5Compat: !0 }));
  let f = d.current, [m, g] = y.useState({
    action: f.action,
    location: f.location
  }), p = y.useCallback(
    (v) => {
      u === !1 ? g(v) : y.startTransition(() => g(v));
    },
    [u]
  );
  return y.useLayoutEffect(() => f.listen(p), [f, p]), /* @__PURE__ */ y.createElement(
    Gb,
    {
      basename: l,
      children: c,
      location: m.location,
      navigationType: m.action,
      navigator: f,
      useTransitions: u
    }
  );
}
var Rs = y.forwardRef(
  function({
    onClick: c,
    discover: u = "render",
    prefetch: o = "none",
    relative: d,
    reloadDocument: f,
    replace: m,
    mask: g,
    state: p,
    target: v,
    to: b,
    preventScrollReset: x,
    viewTransition: w,
    defaultShouldRevalidate: j,
    ...M
  }, T) {
    let { basename: k, navigator: E, useTransitions: U } = y.useContext(qt), Y = typeof b == "string" && ju.test(b), P = Cp(b, k);
    b = P.to;
    let Z = kb(b, { relative: d }), G = jt(), Q = null;
    if (g) {
      let J = jc(
        g,
        [],
        G.mask ? G.mask.pathname : "/",
        !0
      );
      k !== "/" && (J.pathname = J.pathname === "/" ? k : on([k, J.pathname])), Q = E.createHref(J);
    }
    let [te, ae, xe] = i_(
      o,
      M
    ), z = v_(b, {
      replace: m,
      mask: g,
      state: p,
      target: v,
      preventScrollReset: x,
      relative: d,
      viewTransition: w,
      defaultShouldRevalidate: j,
      useTransitions: U
    });
    function W(J) {
      c && c(J), J.defaultPrevented || z(J);
    }
    let se = !(P.isExternal || f), K = (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      /* @__PURE__ */ y.createElement(
        "a",
        {
          ...M,
          ...xe,
          href: (se ? Q : void 0) || P.absoluteURL || Z,
          onClick: se ? W : c,
          ref: d_(T, ae),
          target: v,
          "data-discover": !Y && u === "render" ? "true" : void 0
        }
      )
    );
    return te && !Y ? /* @__PURE__ */ y.createElement(y.Fragment, null, K, /* @__PURE__ */ y.createElement(c_, { page: Z })) : K;
  }
);
Rs.displayName = "Link";
var pc = y.forwardRef(
  function({
    "aria-current": c = "page",
    caseSensitive: u = !1,
    className: o = "",
    end: d = !1,
    style: f,
    to: m,
    viewTransition: g,
    children: p,
    ...v
  }, b) {
    let x = Os(m, { relative: v.relative }), w = jt(), j = y.useContext(Sc), { navigator: M, basename: T } = y.useContext(qt), k = j != null && // Conditional usage is OK here because the usage of a data router is static
    // eslint-disable-next-line react-hooks/rules-of-hooks
    y_(x) && g === !0, E = M.encodeLocation ? M.encodeLocation(x).pathname : x.pathname, U = w.pathname, Y = j && j.navigation && j.navigation.location ? j.navigation.location.pathname : null;
    u || (U = U.toLowerCase(), Y = Y ? Y.toLowerCase() : null, E = E.toLowerCase()), Y && T && (Y = Fn(Y, T) || Y);
    const P = E !== "/" && E.endsWith("/") ? E.length - 1 : E.length;
    let Z = U === E || !d && U.startsWith(E) && U.charAt(P) === "/", G = Y != null && (Y === E || !d && Y.startsWith(E) && Y.charAt(E.length) === "/"), Q = {
      isActive: Z,
      isPending: G,
      isTransitioning: k
    }, te = Z ? c : void 0, ae;
    typeof o == "function" ? ae = o(Q) : ae = [
      o,
      Z ? "active" : null,
      G ? "pending" : null,
      k ? "transitioning" : null
    ].filter(Boolean).join(" ");
    let xe = typeof f == "function" ? f(Q) : f;
    return /* @__PURE__ */ y.createElement(
      Rs,
      {
        ...v,
        "aria-current": te,
        className: ae,
        ref: b,
        style: xe,
        to: m,
        viewTransition: g
      },
      typeof p == "function" ? p(Q) : p
    );
  }
);
pc.displayName = "NavLink";
var m_ = y.forwardRef(
  ({
    discover: l = "render",
    fetcherKey: c,
    navigate: u,
    reloadDocument: o,
    replace: d,
    state: f,
    method: m = hc,
    action: g,
    onSubmit: p,
    relative: v,
    preventScrollReset: b,
    viewTransition: x,
    defaultShouldRevalidate: w,
    ...j
  }, M) => {
    let { useTransitions: T } = y.useContext(qt), k = b_(), E = __(g, { relative: v }), U = m.toLowerCase() === "get" ? "get" : "post", Y = typeof g == "string" && ju.test(g), P = (Z) => {
      if (p && p(Z), Z.defaultPrevented) return;
      Z.preventDefault();
      let G = Z.nativeEvent.submitter, Q = G?.getAttribute("formmethod") || m, te = () => k(G || Z.currentTarget, {
        fetcherKey: c,
        method: Q,
        navigate: u,
        replace: d,
        state: f,
        relative: v,
        preventScrollReset: b,
        viewTransition: x,
        defaultShouldRevalidate: w
      });
      T && u !== !1 ? y.startTransition(() => te()) : te();
    };
    return /* @__PURE__ */ y.createElement(
      "form",
      {
        ref: M,
        method: U,
        action: E,
        onSubmit: o ? p : P,
        ...j,
        "data-discover": !Y && l === "render" ? "true" : void 0
      }
    );
  }
);
m_.displayName = "Form";
function p_(l) {
  return `${l} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function $p(l) {
  let c = y.useContext(zl);
  return Ze(c, p_(l)), c;
}
function v_(l, {
  target: c,
  replace: u,
  mask: o,
  state: d,
  preventScrollReset: f,
  relative: m,
  viewTransition: g,
  defaultShouldRevalidate: p,
  useTransitions: v
} = {}) {
  let b = dt(), x = jt(), w = Os(l, { relative: m });
  return y.useCallback(
    (j) => {
      if (Qb(j, c)) {
        j.preventDefault();
        let M = u !== void 0 ? u : As(x) === As(w), T = () => b(l, {
          replace: M,
          mask: o,
          state: d,
          preventScrollReset: f,
          relative: m,
          viewTransition: g,
          defaultShouldRevalidate: p
        });
        v ? y.startTransition(() => T()) : T();
      }
    },
    [
      x,
      b,
      w,
      u,
      o,
      d,
      c,
      l,
      f,
      m,
      g,
      p,
      v
    ]
  );
}
function Ec(l) {
  Ft(
    typeof URLSearchParams < "u",
    "You cannot use the `useSearchParams` hook in a browser that does not support the URLSearchParams API. If you need to support Internet Explorer 11, we recommend you load a polyfill such as https://github.com/ungap/url-search-params."
  );
  let c = y.useRef(xu(l)), u = y.useRef(!1), o = jt(), d = y.useMemo(
    () => (
      // Only merge in the defaults if we haven't yet called setSearchParams.
      // Once we call that we want those to take precedence, otherwise you can't
      // remove a param with setSearchParams({}) if it has an initial value
      Zb(
        o.search,
        u.current ? null : c.current
      )
    ),
    [o.search]
  ), f = dt(), m = y.useCallback(
    (g, p) => {
      const v = xu(
        typeof g == "function" ? g(new URLSearchParams(d)) : g
      );
      u.current = !0, f("?" + v, p);
    },
    [f, d]
  );
  return [d, m];
}
var g_ = 0, x_ = () => `__${String(++g_)}__`;
function b_() {
  let { router: l } = $p(
    "useSubmit"
    /* UseSubmit */
  ), { basename: c } = y.useContext(qt), u = Lb(), o = l.fetch, d = l.navigate;
  return y.useCallback(
    async (f, m = {}) => {
      let { action: g, method: p, encType: v, formData: b, body: x } = Wb(
        f,
        c
      );
      if (m.navigate === !1) {
        let w = m.fetcherKey || x_();
        await o(w, u, m.action || g, {
          defaultShouldRevalidate: m.defaultShouldRevalidate,
          preventScrollReset: m.preventScrollReset,
          formData: b,
          body: x,
          formMethod: m.method || p,
          formEncType: m.encType || v,
          flushSync: m.flushSync
        });
      } else
        await d(m.action || g, {
          defaultShouldRevalidate: m.defaultShouldRevalidate,
          preventScrollReset: m.preventScrollReset,
          formData: b,
          body: x,
          formMethod: m.method || p,
          formEncType: m.encType || v,
          replace: m.replace,
          state: m.state,
          fromRouteId: u,
          flushSync: m.flushSync,
          viewTransition: m.viewTransition
        });
    },
    [o, d, c, u]
  );
}
function __(l, { relative: c } = {}) {
  let { basename: u } = y.useContext(qt), o = y.useContext(bn);
  Ze(o, "useFormAction must be used inside a RouteContext");
  let [d] = o.matches.slice(-1), f = { ...Os(l || ".", { relative: c }) }, m = jt();
  if (l == null) {
    f.search = m.search;
    let g = new URLSearchParams(f.search), p = g.getAll("index");
    if (p.some((b) => b === "")) {
      g.delete("index"), p.filter((x) => x).forEach((x) => g.append("index", x));
      let b = g.toString();
      f.search = b ? `?${b}` : "";
    }
  }
  return (!l || l === ".") && d.route.index && (f.search = f.search ? f.search.replace(/^\?/, "?index&") : "?index"), u !== "/" && (f.pathname = f.pathname === "/" ? u : on([u, f.pathname])), As(f);
}
function y_(l, { relative: c } = {}) {
  let u = y.useContext(Rp);
  Ze(
    u != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?"
  );
  let { basename: o } = $p(
    "useViewTransitionState"
    /* useViewTransitionState */
  ), d = Os(l, { relative: c });
  if (!u.isTransitioning)
    return !1;
  let f = Fn(u.currentLocation.pathname, o) || u.currentLocation.pathname, m = Fn(u.nextLocation.pathname, o) || u.nextLocation.pathname;
  return gc(d.pathname, m) != null || gc(d.pathname, f) != null;
}
const w_ = {
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
function j_(l) {
  return w_[l];
}
const Gp = y.createContext(null), S_ = /* @__PURE__ */ new Set([
  "input_boolean",
  "input_number",
  "input_select",
  "input_text",
  "input_datetime",
  "input_button"
]);
function N_(l) {
  if (!l) return !1;
  const c = l.toLowerCase(), u = c.indexOf("."), o = u >= 0 ? c.slice(0, u) : "", d = u >= 0 ? c.slice(u + 1) : c;
  return d.startsWith("dsc_") || d.startsWith("dsc-") || d.includes("_dsc_") || c.includes("dsc_") || c.includes("dsc-") ? !0 : S_.has(o) ? d.startsWith("dsc_") || d.includes("dsc_") : c.startsWith("sensor.dsc") || c.startsWith("switch.dsc") || c.startsWith("binary_sensor.dsc") || c.startsWith("number.dsc") || c.startsWith("light.dsc") || c.startsWith("fan.dsc") || c.startsWith("select.dsc") || c.startsWith("text.dsc") || c.startsWith("datetime.dsc") || c.startsWith("time.dsc");
}
const k_ = 150;
function E_({
  hass: l,
  children: c
}) {
  const [u, o] = y.useState(0), d = y.useRef(null), f = y.useRef(l);
  f.current = l;
  const m = l?.connection, g = !!l, p = () => {
    d.current || (d.current = setTimeout(() => {
      d.current = null, o((w) => w + 1);
    }, k_));
  };
  y.useEffect(() => {
    g && p();
  }, [g]), y.useEffect(() => {
    if (!m?.subscribeEvents) return;
    let w, j = !1;
    const M = (T) => {
      const k = T.data?.entity_id;
      N_(k) && p();
    };
    return Promise.resolve(m.subscribeEvents(M, "state_changed")).then((T) => {
      if (j) {
        T();
        return;
      }
      w = T;
    }).catch(() => {
    }), () => {
      j = !0, w?.(), d.current && (clearTimeout(d.current), d.current = null);
    };
  }, [m]);
  const v = y.useMemo(
    () => (w, j, M) => {
      const T = f.current;
      return T?.callService ? T.callService(w, j, M) : Promise.resolve(null);
    },
    []
  ), b = y.useMemo(
    () => (w) => {
      const j = f.current;
      if (j?.callWS) return j.callWS(w);
      const M = j?.connection;
      return M?.sendMessagePromise ? M.sendMessagePromise(w) : Promise.resolve(null);
    },
    []
  ), x = y.useMemo(() => {
    const w = (k) => f.current?.states?.[k], j = (k) => {
      const E = w(k)?.state;
      return !!E && E !== "unavailable" && E !== "unknown";
    }, M = (k, E = "—") => j(k) ? w(k)?.state ?? E : E, T = (k, E = NaN) => {
      if (!j(k)) return E;
      const U = Number(w(k)?.state);
      return Number.isFinite(U) ? U : E;
    };
    return { hass: f.current, entity: w, state: M, num: T, available: j, callService: v, callWS: b, tick: u };
  }, [u, v, b]);
  return y.createElement(Gp.Provider, { value: x }, c);
}
function Se() {
  const l = y.useContext(Gp);
  if (!l) throw new Error("useHass outside HassProvider");
  return l;
}
function un({
  name: l,
  size: c = 16,
  className: u,
  color: o = "currentColor"
}) {
  return /* @__PURE__ */ s.jsx(
    "span",
    {
      className: `dsc-icon${u ? ` ${u}` : ""}`,
      role: "img",
      "aria-hidden": !0,
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: c,
        height: c,
        color: o,
        flexShrink: 0,
        lineHeight: 0
      },
      dangerouslySetInnerHTML: { __html: j_(l) }
    }
  );
}
function fe({
  title: l,
  children: c,
  className: u = "",
  style: o,
  icon: d
}) {
  return /* @__PURE__ */ s.jsxs("section", { className: `dsc-card ${u}`.trim(), style: o, children: [
    l ? /* @__PURE__ */ s.jsxs("h3", { className: "dsc-card-title", children: [
      d ? /* @__PURE__ */ s.jsx(un, { name: d, size: 14, color: "var(--dsc-teal)" }) : null,
      l
    ] }) : null,
    c
  ] });
}
function he({
  children: l,
  primary: c,
  teal: u,
  onClick: o,
  type: d = "button",
  disabled: f
}) {
  const m = ["dsc-btn"];
  return c && m.push("primary"), u && m.push("teal"), /* @__PURE__ */ s.jsx("button", { type: d, className: m.join(" "), onClick: o, disabled: f, children: l });
}
function an({
  label: l,
  value: c,
  unit: u,
  sub: o,
  tone: d = "normal",
  stale: f,
  onClick: m
}) {
  const g = (() => {
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
  })(), p = /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsxs("div", { className: `dsc-kpi-value ${g}`.trim(), children: [
      c,
      u ? /* @__PURE__ */ s.jsx("span", { className: "dsc-kpi-unit", children: u }) : null,
      f ? /* @__PURE__ */ s.jsx("span", { className: "dsc-held-tag", children: "HELD" }) : null
    ] }),
    o ? /* @__PURE__ */ s.jsx("div", { className: "dsc-kpi-sub", children: o }) : null
  ] });
  return m ? /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-kpi-hit", onClick: m, title: `History · ${l}`, children: /* @__PURE__ */ s.jsx(fe, { title: l, className: f ? "is-stale" : void 0, children: p }) }) : /* @__PURE__ */ s.jsx(fe, { title: l, className: f ? "is-stale" : void 0, children: p });
}
function Yt({
  title: l,
  subtitle: c,
  icon: u,
  primaryAction: o,
  actions: d
}) {
  const f = o || d ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-page-header-actions", children: [
    o,
    d
  ] }) : null;
  return /* @__PURE__ */ s.jsxs("header", { className: "dsc-page-header", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-page-header-main", children: [
      u ? /* @__PURE__ */ s.jsx(un, { name: u, size: 22, color: "var(--dsc-teal)" }) : null,
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("h1", { className: "dsc-page-title", children: l }),
        c ? /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: c }) : null
      ] })
    ] }),
    f
  ] });
}
function F({
  label: l,
  tone: c = "muted",
  pulse: u,
  icon: o,
  onClick: d
}) {
  const f = `dsc-chip dsc-chip--${c}${u ? " dsc-chip--pulse" : ""}`;
  return d ? /* @__PURE__ */ s.jsxs("button", { type: "button", className: `${f} is-clickable`, onClick: d, children: [
    o ? /* @__PURE__ */ s.jsx(un, { name: o, size: 11 }) : null,
    l
  ] }) : /* @__PURE__ */ s.jsxs("span", { className: f, children: [
    o ? /* @__PURE__ */ s.jsx(un, { name: o, size: 11 }) : null,
    l
  ] });
}
function Fe({
  entityId: l,
  label: c,
  warnWhenMissing: u,
  icon: o,
  showBrightness: d
}) {
  const { state: f, available: m, callService: g, entity: p } = Se(), v = f(l, "off") === "on", b = m(l), x = l.split(".")[0], w = () => {
    if (b) {
      if (x === "switch" || x === "input_boolean") {
        g("homeassistant", "toggle", { entity_id: l });
        return;
      }
      x === "light" && g("light", v ? "turn_off" : "turn_on", { entity_id: l });
    }
  }, j = d !== !1 && x === "light" && v ? Math.round(Number(p(l)?.attributes?.brightness ?? 0) / 255 * 100) : null;
  return /* @__PURE__ */ s.jsxs(
    "button",
    {
      type: "button",
      className: `dsc-demand${v ? " is-on" : ""}${b ? "" : " is-missing"}`,
      onClick: w,
      disabled: !b && !u,
      title: b ? l : u || `${l} unavailable`,
      children: [
        o ? /* @__PURE__ */ s.jsx(un, { name: o, size: 22, color: "var(--dsc-teal)", className: "dsc-demand-icon" }) : null,
        /* @__PURE__ */ s.jsx("span", { className: "dsc-demand-label", children: c }),
        /* @__PURE__ */ s.jsx("span", { className: "dsc-demand-state", children: b ? j != null ? `${j}%` : v ? "ON" : "OFF" : u || "—" })
      ]
    }
  );
}
function Ya({
  entityId: l,
  label: c,
  icon: u
}) {
  const { state: o, available: d, callService: f, entity: m } = Se(), g = d(l), p = o(l, ""), v = m(l)?.attributes?.options || [], b = l.split(".")[0], [x, w] = y.useState(!1), j = y.useRef(!1), [M, T] = y.useState(p);
  y.useEffect(() => {
    !j.current && !x && T(p);
  }, [p, x, l]);
  const k = (U) => {
    T(U), w(!1), !(!g || !U) && (b === "select" ? f("select", "select_option", { entity_id: l, option: U }) : b === "input_select" && f("input_select", "select_option", { entity_id: l, option: U }));
  }, E = x ? M : p;
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-entity-select${g ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ s.jsxs("span", { className: "dsc-entity-select-label", children: [
      u ? /* @__PURE__ */ s.jsx(un, { name: u, size: 13, color: "var(--dsc-teal)" }) : null,
      c
    ] }),
    /* @__PURE__ */ s.jsxs(
      "select",
      {
        value: E,
        disabled: !g,
        onFocus: () => {
          j.current = !0, w(!0);
        },
        onBlur: () => {
          j.current = !1, w(!1);
        },
        onChange: (U) => k(U.target.value),
        children: [
          !v.includes(E) && E ? /* @__PURE__ */ s.jsx("option", { value: E, children: E }) : null,
          v.map((U) => /* @__PURE__ */ s.jsx("option", { value: U, children: U }, U))
        ]
      }
    )
  ] });
}
function xa({
  entityId: l,
  label: c,
  disabled: u
}) {
  const { available: o, callService: d, entity: f, state: m } = Se(), g = o(l), p = Number(f(l)?.attributes?.percentage ?? 0), v = m(l) === "on", b = u || !g, [x, w] = y.useState(!1), j = y.useRef(!1), [M, T] = y.useState(Number.isFinite(p) ? p : 0);
  y.useEffect(() => {
    !j.current && !x && Number.isFinite(p) && T(p);
  }, [p, x, l]);
  const k = (U) => {
    b || d("fan", "set_percentage", { entity_id: l, percentage: U });
  }, E = x ? M : Number.isFinite(p) ? p : 0;
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-fan-slider${b ? " is-disabled" : ""}`, children: [
    /* @__PURE__ */ s.jsxs("span", { className: "dsc-fan-slider-label", children: [
      c,
      /* @__PURE__ */ s.jsx("strong", { children: g ? `${Math.round(E)}%` : "—" }),
      !v && g ? /* @__PURE__ */ s.jsx("em", { className: "dsc-muted", children: "off" }) : null
    ] }),
    /* @__PURE__ */ s.jsx(
      "input",
      {
        type: "range",
        min: 0,
        max: 100,
        step: 1,
        value: E,
        disabled: b,
        onPointerDown: (U) => {
          U.target.setPointerCapture(U.pointerId), j.current = !0, w(!0);
        },
        onPointerUp: (U) => {
          j.current = !1, w(!1), k(Number(U.target.value));
        },
        onPointerCancel: () => {
          j.current = !1, w(!1);
        },
        onLostPointerCapture: () => {
          j.current = !1, w(!1);
        },
        onChange: (U) => {
          const Y = Number(U.target.value);
          T(Y), j.current || k(Y);
        }
      }
    )
  ] });
}
function Au(l) {
  return !l || l === "unknown" || l === "unavailable" ? "" : l;
}
function vc({
  entityId: l,
  label: c,
  multiline: u = !1,
  rows: o = 2
}) {
  const { available: d, callService: f, state: m } = Se(), g = d(l), p = Au(m(l, "")), [v, b] = y.useState(p), x = y.useRef(!1);
  y.useEffect(() => {
    x.current || b(p);
  }, [p]);
  const w = () => {
    g && f("input_text", "set_value", { entity_id: l, value: v });
  }, j = {
    value: v,
    disabled: !g,
    onFocus: () => {
      x.current = !0;
    },
    onChange: (M) => b(M.target.value),
    onBlur: () => {
      x.current = !1, w();
    },
    onKeyDown: (M) => {
      M.key === "Enter" && !u && M.currentTarget.blur();
    }
  };
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-target-num${g ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ s.jsx("span", { className: "dsc-target-num-label", children: c }),
    u ? /* @__PURE__ */ s.jsx("textarea", { rows: o, ...j }) : /* @__PURE__ */ s.jsx("input", { type: "text", ...j })
  ] });
}
function M_(l) {
  const c = Au(l);
  return c ? c.slice(0, 5) : "";
}
function C_(l) {
  return l ? l.length === 5 ? `${l}:00` : l : "00:00:00";
}
function Pm({ entityId: l, label: c }) {
  const { available: u, callService: o, state: d } = Se(), f = u(l), m = M_(d(l, "")), [g, p] = y.useState(m), v = y.useRef(!1);
  y.useEffect(() => {
    v.current || p(m);
  }, [m]);
  const b = () => {
    !f || !g || o("time", "set_value", { entity_id: l, time: C_(g) });
  };
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-target-num${f ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ s.jsx("span", { className: "dsc-target-num-label", children: c }),
    /* @__PURE__ */ s.jsx(
      "input",
      {
        type: "time",
        value: g,
        disabled: !f,
        onFocus: () => {
          v.current = !0;
        },
        onChange: (x) => p(x.target.value),
        onBlur: () => {
          v.current = !1, b();
        }
      }
    )
  ] });
}
function T_({ entityId: l, label: c }) {
  const { available: u, callService: o, entity: d, state: f } = Se(), m = u(l), g = !!d(l)?.attributes?.has_time, p = Au(f(l, "")), v = (M) => M ? g ? M.slice(0, 16).replace(" ", "T") : M.slice(0, 10) : "", [b, x] = y.useState(v(p)), w = y.useRef(!1);
  y.useEffect(() => {
    w.current || x(v(p));
  }, [p, g]);
  const j = () => {
    if (!m || !b) return;
    const M = g ? b.replace("T", " ") : b;
    g ? o("input_datetime", "set_datetime", { entity_id: l, datetime: M }) : o("input_datetime", "set_datetime", { entity_id: l, date: b });
  };
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-target-num${m ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ s.jsx("span", { className: "dsc-target-num-label", children: c }),
    /* @__PURE__ */ s.jsx(
      "input",
      {
        type: g ? "datetime-local" : "date",
        value: b,
        disabled: !m,
        onFocus: () => {
          w.current = !0;
        },
        onChange: (M) => x(M.target.value),
        onBlur: () => {
          w.current = !1, j();
        }
      }
    )
  ] });
}
function cc({
  label: l,
  empty: c = !1,
  onClick: u
}) {
  const o = /* @__PURE__ */ s.jsx("span", { className: `dsc-result-chip${c ? " is-empty" : ""}`, children: /* @__PURE__ */ s.jsx("span", { children: l }) });
  return u ? /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-result-chip-hit", onClick: u, children: o }) : o;
}
function Ot({
  open: l,
  onDismiss: c,
  onConfirm: u,
  title: o,
  confirmLabel: d = "Confirm",
  help: f,
  children: m
}) {
  const g = y.useId(), p = y.useRef(null), v = y.useRef(null);
  return y.useEffect(() => {
    if (!l) return;
    v.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, p.current?.querySelector("button, input, select, textarea, [href]")?.focus();
    const w = (j) => {
      j.key === "Escape" && (j.preventDefault(), c());
    };
    return window.addEventListener("keydown", w), () => {
      window.removeEventListener("keydown", w), v.current?.focus?.();
    };
  }, [l, c]), l ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-decision-root is-open", role: "presentation", children: [
    /* @__PURE__ */ s.jsx("div", { className: "dsc-decision-scrim", onClick: c }),
    /* @__PURE__ */ s.jsxs(
      "aside",
      {
        ref: p,
        className: "dsc-decision-panel",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": g,
        children: [
          /* @__PURE__ */ s.jsxs("header", { className: "dsc-decision-head", children: [
            /* @__PURE__ */ s.jsx("h2", { id: g, children: o }),
            /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-icon-btn", "aria-label": "Dismiss", onClick: c, children: /* @__PURE__ */ s.jsx(un, { name: "close", size: 16 }) })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "dsc-decision-body", children: m }),
          f ? /* @__PURE__ */ s.jsx("div", { className: "dsc-decision-help", children: f }) : /* @__PURE__ */ s.jsx("div", { className: "dsc-decision-help is-empty" }),
          /* @__PURE__ */ s.jsxs("footer", { className: "dsc-decision-foot", children: [
            /* @__PURE__ */ s.jsx(he, { onClick: c, children: "Dismiss" }),
            u ? /* @__PURE__ */ s.jsx(he, { primary: !0, onClick: u, children: d }) : null
          ] })
        ]
      }
    )
  ] }) : null;
}
function A_(l) {
  const c = [], u = (m, g = "unknown") => l.state(m, g), o = (m) => u(m) === "on", d = l.entity?.("sensor.dsc_keepup_gaps")?.attributes ?? {}, f = String(d.full_auto_honesty ?? "").trim();
  if (l.available && l.available("binary_sensor.dsc_hub_link") && !o("binary_sensor.dsc_hub_link") && c.push({
    id: "hub-link",
    label: "Hub link down",
    detail: "binary_sensor.dsc_hub_link is off — Mission/Fleet show HELD, not last-good animation.",
    tone: "bad",
    href: "/fleet",
    cta: "Open Fleet",
    priority: 9
  }), l.available && !l.available("sensor.dsc_hub_uptime")) {
    const m = l.entity?.("sensor.dsc_hub_uptime")?.last_changed;
    let g = "";
    if (m) {
      const p = Date.now() - Date.parse(m);
      if (Number.isFinite(p) && p >= 0) {
        const v = Math.floor(p / 6e4);
        g = v < 60 ? ` · offline ${Math.max(1, v)}m` : ` · offline ${(v / 60).toFixed(1)}h`;
      }
    }
    c.push({
      id: "hub-dark",
      label: "Hub offline",
      detail: `Showing last good vitals${g}. Reconnect snaps to live.`,
      tone: "bad",
      href: "/fleet",
      cta: "Open Fleet",
      priority: 10
    });
  }
  if (l.available && !l.available("sensor.dsc_hub_heartbeat") && c.push({
    id: "beat-dark",
    label: "Beat dark",
    detail: "Hub heartbeat unavailable — Mission shows BEAT OFF duration; vitals stay held.",
    tone: "bad",
    href: "/live/mission",
    cta: "Mission",
    priority: 12
  }), l.available && !l.available("binary_sensor.dsc_hub_panel_link") && c.push({
    id: "panel-dark",
    label: "Panel link dark",
    detail: "Panel link dark — Mission shows PANEL OFF duration; do not invent Got.",
    tone: "warn",
    href: "/fleet",
    cta: "Open Fleet",
    priority: 14
  }), o("binary_sensor.dsc_reduced_kit")) {
    const m = l.entity?.("binary_sensor.dsc_reduced_kit")?.attributes ?? {}, g = String(m.offline ?? "").trim();
    c.push({
      id: "reduced-kit",
      label: "Unexpected OOS",
      detail: g || "A live lever is temp-OOS or lockout — planned holes are inventory.",
      tone: "warn",
      href: "/fleet",
      cta: "Review kit",
      priority: 20
    });
  }
  return f && o("switch.dsc_hub_tent_full_auto_mode") && c.push({
    id: "keepup",
    label: "Keep-up gaps",
    detail: f,
    tone: "warn",
    href: "/live/climate",
    cta: "Fix Climate",
    priority: 30
  }), o("binary_sensor.dsc_clone_dark_period_violation") && c.push({
    id: "dark-viol",
    label: "2×4 dark violation",
    detail: "Photoperiod honesty — check Light.",
    tone: "bad",
    href: "/live/light",
    cta: "Open Light",
    priority: 25
  }), o("binary_sensor.dsc_clone_light_missing_in_window") && c.push({
    id: "photo-missing",
    label: "Light missing in window",
    detail: "Photoperiod integrity — fixture did not deliver in the open window.",
    tone: "bad",
    href: "/live/light",
    cta: "Open Light",
    priority: 24
  }), o("binary_sensor.dsc_hub_light_catchup_active") && c.push({
    id: "photo-catchup",
    label: "Light catch-up",
    detail: "Catch-up photoperiod is active — hours gauge is the Got, not invented.",
    tone: "warn",
    href: "/live/light",
    cta: "Open Light",
    priority: 28
  }), o("binary_sensor.dsc_hub_climate_sensor_fault") && c.push({
    id: "climate-fault",
    label: "Climate sensor fault",
    detail: "Trust the honesty rail — do not invent Got.",
    tone: "bad",
    href: "/live/climate",
    cta: "Open Climate",
    priority: 15
  }), o("binary_sensor.dsc_hub_emergency_failsafe") && c.push({
    id: "failsafe",
    label: "Emergency failsafe",
    detail: "Hub failsafe active.",
    tone: "bad",
    href: "/live/mission",
    cta: "Mission",
    priority: 5
  }), c.sort((m, g) => m.priority - g.priority);
}
function R_(l) {
  return l[0] ?? null;
}
function Fp() {
  const l = Se();
  return y.useMemo(
    () => A_({
      state: l.state,
      available: l.available,
      entity: l.entity
    }),
    [l.state, l.available, l.entity, l.tick]
  );
}
function z_({ gaps: l }) {
  const c = Fp(), u = l ?? c, [o, d] = y.useState(null), f = dt();
  return u.length ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsx("div", { className: "dsc-honesty-rail", "aria-label": "Honesty gaps", children: u.slice(0, 6).map((m) => /* @__PURE__ */ s.jsx(
      "button",
      {
        type: "button",
        className: "dsc-honesty-hit",
        onClick: () => d(m),
        children: /* @__PURE__ */ s.jsx(F, { icon: "alert", label: m.label, tone: m.tone === "bad" ? "bad" : "warn" })
      },
      m.id
    )) }),
    /* @__PURE__ */ s.jsx(
      Ot,
      {
        open: o != null,
        onDismiss: () => d(null),
        onConfirm: o ? () => {
          f(o.href), d(null);
        } : void 0,
        title: o?.label ?? "Honesty",
        confirmLabel: o?.cta ?? "Go",
        help: null,
        children: /* @__PURE__ */ s.jsx("p", { children: o?.detail })
      }
    )
  ] }) : /* @__PURE__ */ s.jsx("div", { className: "dsc-honesty-rail", "aria-label": "Honesty", children: /* @__PURE__ */ s.jsx(F, { icon: "ok", label: "Kit honest", tone: "ok" }) });
}
function O_({ gaps: l }) {
  const c = Fp(), o = R_(l ?? c), d = dt();
  return o ? /* @__PURE__ */ s.jsxs(fe, { className: "dsc-glass dsc-next-rec", title: "Do this next", icon: "alert", children: [
    /* @__PURE__ */ s.jsxs("p", { style: { margin: "0 0 8px" }, children: [
      /* @__PURE__ */ s.jsx("strong", { children: o.label }),
      " — ",
      o.detail
    ] }),
    /* @__PURE__ */ s.jsx(he, { primary: !0, onClick: () => d(o.href), children: o.cta })
  ] }) : /* @__PURE__ */ s.jsxs(fe, { className: "dsc-glass dsc-next-rec", title: "Next", icon: "ok", children: [
    /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: "No critical gaps — fly Live or open Twin." }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", children: [
      /* @__PURE__ */ s.jsx(he, { primary: !0, onClick: () => d("/live/twin"), children: "Open Twin" }),
      /* @__PURE__ */ s.jsx(he, { teal: !0, onClick: () => d("/live/climate"), children: "Climate Want" })
    ] })
  ] });
}
const qa = "7.2.0", qp = [
  `/local/DSC-HUB.js?v=${qa}`,
  `/hacsfiles/DSC-HUB/DSC-HUB.js?v=${qa}`
], D_ = {
  "dsc-catalog-browse-card": [`/local/dsc-catalog-browse-card.js?v=${qa}`],
  "dsc-build-plant-card": [`/local/dsc-build-plant-card.js?v=${qa}`],
  "dsc-the-dash-card": [`/local/dsc-the-dash-card.js?v=${qa}`],
  "dsc-airflow-map-card": [`/local/dsc-airflow-map-card.js?v=${qa}`],
  "dsc-system-map-card": [
    `/local/dsc-system-map-card.js?v=${qa}`,
    ...qp
  ]
}, rc = /* @__PURE__ */ new Map();
function Im(l) {
  if (document.querySelector(`script[data-dsc-autoload="${l}"]`))
    return rc.get(l) ?? Promise.resolve();
  if (rc.has(l)) return rc.get(l);
  const u = new Promise((o, d) => {
    const f = document.createElement("script");
    f.src = l, f.async = !0, f.dataset.dscAutoload = l, f.onload = () => o(), f.onerror = () => d(new Error(`Failed to load ${l}`)), document.head.appendChild(f);
  });
  return rc.set(l, u), u;
}
async function H_(l, c = 12e3) {
  const u = D_[l] ?? [];
  for (const o of u)
    try {
      await Im(o);
    } catch {
    }
  if (customElements.get(l)) return !0;
  for (const o of qp) {
    try {
      await Im(o);
    } catch {
    }
    if (customElements.get(l)) return !0;
  }
  try {
    return await Promise.race([
      customElements.whenDefined(l),
      new Promise(
        (o, d) => window.setTimeout(() => d(new Error("timeout")), c)
      )
    ]), !!customElements.get(l);
  } catch {
    return !!customElements.get(l);
  }
}
const Ru = [
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
], Yp = new Map(Ru.map((l) => [l.id, l])), Ds = Ru[2];
function bu(l) {
  return `input_select.dsc_pot${l}_vessel`;
}
function L_(l) {
  const c = String(l || "").trim();
  return Yp.has(c) ? c : Ds.id;
}
function _u(l, c) {
  const u = Yp.get(L_(l)) ?? Ds;
  return Number.isFinite(c) && c > 0 ? { ...u, volumeL: c } : u;
}
function _a(l, c, u) {
  const o = bu(l), d = c(o, "");
  if (d && d !== "unknown" && d !== "unavailable")
    return _u(d);
  const f = u?.("sensor.dsc_plant_roster_summary")?.attributes?.slots;
  if (Array.isArray(f)) {
    const m = f.find((g) => String(g.pot) === String(l));
    if (m?.vessel) return _u(m.vessel);
  }
  return Ds;
}
function U_(l) {
  switch (l) {
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
      return l;
  }
}
const ep = [
  "var(--dsc-soil-1)",
  "var(--dsc-soil-2)",
  "var(--dsc-soil-3)",
  "var(--dsc-soil-4)"
];
function tp(l) {
  switch (l) {
    case "bag":
      return "M18 8 Q18 4 32 4 L68 4 Q82 4 82 8 L86 88 Q86 96 50 96 Q14 96 14 88 Z";
    case "taper":
      return "M24 6 L76 6 L88 92 Q88 98 50 98 Q12 98 12 92 Z";
    case "tall":
      return "M28 4 L72 4 L78 94 Q78 98 50 98 Q22 98 22 94 Z";
    case "airpot":
      return "M26 6 L74 6 L84 90 Q84 96 50 96 Q16 96 16 90 Z";
    default:
      return l;
  }
}
function xn({
  spec: l,
  layers: c = [],
  size: u = 56,
  label: o
}) {
  const d = `vclip-${l.id}-${l.silhouette}`, f = c.reduce((g, p) => g + p.pct, 0) || 1;
  let m = 0;
  return /* @__PURE__ */ s.jsxs("span", { className: "dsc-vessel-glyph", title: l.label, children: [
    /* @__PURE__ */ s.jsxs("svg", { width: u, height: u * 1.15, viewBox: "0 0 100 100", "aria-hidden": !0, children: [
      /* @__PURE__ */ s.jsx("defs", { children: /* @__PURE__ */ s.jsx("clipPath", { id: d, children: /* @__PURE__ */ s.jsx("path", { d: tp(l.silhouette) }) }) }),
      /* @__PURE__ */ s.jsx(
        "path",
        {
          d: tp(l.silhouette),
          fill: "rgba(8,12,10,0.85)",
          stroke: U_(l.material),
          strokeWidth: "2.4",
          strokeDasharray: l.silhouette === "airpot" ? "5 3" : void 0
        }
      ),
      /* @__PURE__ */ s.jsx("g", { clipPath: `url(#${d})`, children: c.map((g, p) => {
        const v = g.pct / f * 88, b = 96 - m - v;
        return m += v, /* @__PURE__ */ s.jsx(
          "rect",
          {
            x: "12",
            y: b,
            width: "76",
            height: v,
            fill: g.color || ep[p % ep.length]
          },
          `${g.name}-${p}`
        );
      }) })
    ] }),
    o ? /* @__PURE__ */ s.jsxs("span", { className: "dsc-vessel-glyph-label", children: [
      l.volumeL,
      "L"
    ] }) : null
  ] });
}
function zu({
  label: l,
  icon: c,
  onClick: u,
  className: o = "",
  expanded: d
}) {
  return /* @__PURE__ */ s.jsx(
    "button",
    {
      type: "button",
      className: `dsc-icon-btn ${o}`.trim(),
      "aria-label": l,
      title: l,
      "aria-expanded": d,
      onClick: u,
      children: /* @__PURE__ */ s.jsx(un, { name: c, size: 16 })
    }
  );
}
function B_(l) {
  return l instanceof Element ? !!l.closest(
    "ha-more-info-dialog, ha-dialog, ha-more-info-info, .ha-more-info, home-assistant-dialog"
  ) : !1;
}
function Mc({
  items: l,
  label: c = "More actions"
}) {
  const [u, o] = y.useState(!1), d = y.useRef(null);
  return y.useEffect(() => {
    if (!u) return;
    const f = (g) => {
      B_(g.target) || d.current?.contains(g.target) || o(!1);
    }, m = (g) => {
      g.key === "Escape" && o(!1);
    };
    return document.addEventListener("mousedown", f), window.addEventListener("keydown", m), () => {
      document.removeEventListener("mousedown", f), window.removeEventListener("keydown", m);
    };
  }, [u]), /* @__PURE__ */ s.jsxs("div", { className: "dsc-overflow", ref: d, children: [
    /* @__PURE__ */ s.jsx(
      zu,
      {
        label: c,
        icon: "more",
        expanded: u,
        onClick: () => o((f) => !f)
      }
    ),
    u ? /* @__PURE__ */ s.jsx("div", { className: "dsc-overflow-menu", role: "menu", children: l.map((f) => /* @__PURE__ */ s.jsx(
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
function np(l) {
  return Array.from(
    l.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((c) => !c.hasAttribute("disabled") && c.tabIndex !== -1);
}
function Dl({
  open: l,
  onClose: c,
  title: u,
  side: o = "right",
  children: d
}) {
  const f = y.useId(), m = y.useRef(null), g = y.useRef(null);
  return y.useEffect(() => {
    if (!l) return;
    g.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const p = m.current;
    (p ? np(p)[0] : null)?.focus();
    const b = (x) => {
      if (x.key === "Escape") {
        x.preventDefault(), c();
        return;
      }
      if (x.key !== "Tab" || !p) return;
      const w = np(p);
      if (!w.length) return;
      const j = w[0], M = w[w.length - 1];
      x.shiftKey && document.activeElement === j ? (x.preventDefault(), M.focus()) : !x.shiftKey && document.activeElement === M && (x.preventDefault(), j.focus());
    };
    return window.addEventListener("keydown", b), () => {
      window.removeEventListener("keydown", b), g.current?.focus?.();
    };
  }, [l, c]), /* @__PURE__ */ s.jsxs("div", { className: `dsc-drawer-root${l ? " is-open" : ""}`, "aria-hidden": !l, children: [
    /* @__PURE__ */ s.jsx("div", { className: "dsc-drawer-scrim", onClick: c }),
    /* @__PURE__ */ s.jsxs(
      "aside",
      {
        ref: m,
        className: `dsc-drawer-panel ${o}`,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": f,
        children: [
          /* @__PURE__ */ s.jsx(
            "button",
            {
              type: "button",
              className: "dsc-drawer-rail",
              "aria-label": "Close",
              title: "Close",
              onClick: c,
              children: "Close"
            }
          ),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-drawer-head", children: [
            /* @__PURE__ */ s.jsx("h2", { id: f, children: u }),
            /* @__PURE__ */ s.jsx(zu, { label: "Close", icon: "close", onClick: c })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "dsc-drawer-body", children: d })
        ]
      }
    )
  ] });
}
function $_(l) {
  if (!l || !l.trim()) return [];
  const c = l.split(/[|/·]/).map((o) => o.trim()).filter(Boolean), u = [];
  for (const o of c) {
    const d = o.match(/^(.+?)\s*[·:]?\s*(\d+(?:\.\d+)?)\s*%?$/);
    if (d) {
      u.push({ name: d[1].trim(), pct: Number(d[2]) });
      continue;
    }
    const f = o.match(/(\d+(?:\.\d+)?)\s*%\s*(.+)$/);
    if (f) {
      u.push({ name: f[2].trim(), pct: Number(f[1]) });
      continue;
    }
    o && u.push({ name: o, pct: 0 });
  }
  if (u.length && u.every((o) => o.pct === 0)) {
    const o = 100 / u.length;
    return u.map((d) => ({ ...d, pct: o }));
  }
  return u.filter((o) => o.pct > 0);
}
function G_({
  layers: l,
  valid: c,
  emptyLabel: u = "No blend on roster seat",
  spec: o
}) {
  const d = o ?? Ds, f = l.reduce((g, p) => g + p.pct, 0), m = c ?? (l.length > 0 && Math.round(f) === 100);
  return l.length ? /* @__PURE__ */ s.jsx("div", { className: `dsc-soil${m ? " is-valid" : ""}`, children: /* @__PURE__ */ s.jsx(xn, { spec: d, layers: l, size: 180, label: !0 }) }) : /* @__PURE__ */ s.jsxs("div", { className: "dsc-soil", children: [
    /* @__PURE__ */ s.jsx(xn, { spec: d, size: 160 }),
    /* @__PURE__ */ s.jsx("div", { className: "dsc-soil-empty", children: u })
  ] });
}
function yt(l, c = "—") {
  return !l || l === "unknown" || l === "unavailable" || l === "none" ? c : l;
}
function bc(l, c) {
  const u = l(`input_select.dsc_pot${c}_tent`, "unassigned");
  return u === "clone" || u === "main" || u === "unassigned" ? u : "unassigned";
}
function Cc(l) {
  switch (l) {
    case "clone":
      return "2×4";
    case "main":
      return "4×8";
    case "unassigned":
      return "Unassigned";
    default:
      return l;
  }
}
function Xa(l, c) {
  const { state: u, entity: o } = c, d = o("sensor.dsc_plant_roster_summary")?.attributes?.slots || [], f = Array.isArray(d) ? d.find((p) => String(p.pot) === String(l)) : void 0, m = (p, v) => {
    const b = yt(u(p, ""));
    return b !== "—" ? b : yt(u(v, ""));
  }, g = yt(f?.blend, "");
  return {
    pot: l,
    plantName: yt(u(`text.dsc_pot${l}_plant_name`, "")),
    strainDisplay: yt(u(`sensor.dsc_pot${l}_strain_display`, "")),
    sprout: yt(u(`datetime.dsc_pot${l}_sprout_date`, ""), "—").slice(0, 10),
    days: yt(u(`sensor.dsc_pot${l}_days_since_sprout`, "")),
    stage: yt(u(`sensor.dsc_pot${l}_expected_stage`, "")),
    growthStage: yt(u(`select.dsc_pot${l}_growth_stage`, "")),
    tent: bc(u, l),
    blend: g,
    recipe: yt(f?.recipe, ""),
    notes: yt(f?.notes, ""),
    layers: $_(g),
    moisture: m(`sensor.dsc_pot${l}_got_moisture`, `sensor.dsc_pot${l}_soil_moisture`),
    soilTemp: yt(u(`sensor.dsc_pot${l}_soil_temperature`, "")),
    ec: m(`sensor.dsc_pot${l}_got_ec`, `sensor.dsc_pot${l}_soil_conductivity`),
    ph: m(`sensor.dsc_pot${l}_got_ph`, `sensor.dsc_pot${l}_soil_ph`),
    n: yt(u(`sensor.dsc_pot${l}_soil_nitrogen`, "")),
    p: yt(u(`sensor.dsc_pot${l}_soil_phosphorus`, "")),
    k: yt(u(`sensor.dsc_pot${l}_soil_potassium`, "")),
    need: yt(u(`sensor.dsc_pot${l}_need_summary`, "")),
    rosterSlot: f?.slot ?? null
  };
}
function nn(l, c, u) {
  const o = `sensor.dsc_pot${l}_got_${c}`, d = c === "moisture" ? `sensor.dsc_pot${l}_soil_moisture` : c === "ec" ? `sensor.dsc_pot${l}_soil_conductivity` : `sensor.dsc_pot${l}_soil_ph`, f = u(o, "");
  return f && f !== "unavailable" && f !== "unknown" ? o : d;
}
function Vp(l, c, u) {
  return Ou(c).map((o) => Xa(o, { state: c, entity: u })).filter((o) => o.tent === l);
}
const qn = [1, 2, 3, 4];
function kt(l, c) {
  const u = `input_boolean.dsc_pot${l}_in_service`, o = c(u, "on");
  return o === "unavailable" || o === "unknown" || o === "" ? !0 : o === "on";
}
function Ou(l, c = [...qn]) {
  return c.filter((u) => kt(u, l));
}
function F_(l, c = [...qn]) {
  return { inService: Ou(l, c).length, total: c.length };
}
function q_(l) {
  const c = l("sensor.dsc_plant_roster_summary")?.attributes?.slots;
  return Array.isArray(c) ? c : [];
}
function Tc(l, c) {
  const u = kt(l, c), o = c(`binary_sensor.dsc_pot${l}_sensor_stuck`) === "on", d = c(`binary_sensor.dsc_pot${l}_untrusted`) === "on", f = c("sensor.dsc_peer_divergence_summary", ""), m = u && f !== "—" && f !== "ok" && f.toLowerCase() !== "none" && f !== "unknown" && f !== "unavailable" && f.length > 0 && f !== "0", g = [];
  o && g.push("stuck"), d && g.push("untrusted"), m && g.push("peer divergence");
  let p = "ok";
  return d || o ? p = "bad" : m && (p = "warn"), {
    stuck: o,
    untrusted: d,
    peerDivergence: m,
    blockNeedAct: d || o,
    tone: p,
    labels: g
  };
}
function ru(l, c) {
  return !Number.isFinite(l) || !Number.isFinite(c) ? NaN : 6.112 * Math.exp(17.67 * l / (l + 243.5)) * c * 2.1674 / (273.15 + l);
}
function Y_(l) {
  return l === "/live/main" || l === "/live/4x8" ? "main" : l === "/live/clone" || l === "/live/2x4" ? "clone" : null;
}
function V_(l) {
  return l === "/live/twin" || l === "/ops/dash" || l === "/live/main" || l === "/live/clone" || l === "/live/4x8" || l === "/live/2x4";
}
function X_() {
  const l = jt(), { hass: c, available: u, num: o, state: d, entity: f, tick: m } = Se(), g = y.useRef(null), p = y.useRef(null), [v, b] = y.useState("loading"), x = Y_(l.pathname), w = l.pathname === "/live/twin" || l.pathname === "/ops/dash" || l.pathname === "/live/main" || l.pathname === "/live/clone" || l.pathname === "/live/4x8" || l.pathname === "/live/2x4", j = u("binary_sensor.dsc_hub_link") ? d("binary_sensor.dsc_hub_link") !== "on" : !u("sensor.dsc_hub_uptime");
  return y.useEffect(() => {
    const M = g.current;
    if (!M || p.current) return;
    let T = !1;
    return (async () => {
      b("loading");
      const k = await H_("dsc-the-dash-card");
      if (T || !g.current) return;
      if (!k) {
        b("missing");
        return;
      }
      const E = document.createElement("dsc-the-dash-card");
      typeof E.setConfig == "function" && E.setConfig({ type: "custom:dsc-the-dash-card" }), c && (E.hass = c), M.appendChild(E), p.current = E, b("ready");
    })(), () => {
      T = !0;
    };
  }, []), y.useEffect(() => {
    p.current && c && (p.current.hass = c);
  }, [c, m]), y.useEffect(() => {
    const M = p.current;
    M && (M.setFocusTent?.(x), M.setUiChrome?.({ hideHud: V_(l.pathname) }));
  }, [x, l.pathname, v]), y.useEffect(() => {
    const M = p.current, T = () => {
      const k = !w || document.hidden;
      M?.pause?.(k);
    };
    return T(), document.addEventListener("visibilitychange", T), () => document.removeEventListener("visibilitychange", T);
  }, [w, v]), y.useEffect(() => {
    p.current?.setHeld?.(j);
  }, [j, v]), y.useEffect(() => {
    const M = p.current;
    if (!M?.setPots) return;
    const T = { clone: [], main: [] };
    qn.forEach((E) => {
      const U = bc(d, E);
      (U === "clone" || U === "main") && T[U].push(E);
    });
    const k = qn.map((E) => {
      const U = Xa(E, { state: d, entity: f }), Y = _a(E, d, f), P = Tc(E, d), Z = kt(E, d), G = bc(d, E), Q = G === "clone" || G === "main" ? Math.max(0, T[G].indexOf(E)) : 0;
      return {
        id: `pot${E}`,
        pot: E,
        tent: G,
        slot: Q,
        inService: Z,
        silhouette: Y.silhouette,
        moisture: Number(U.moisture),
        ec: Number(U.ec),
        ph: Number(U.ph),
        soilT: Number(U.soilTemp),
        dryback: o(`sensor.dsc_pot${E}_dryback_pct`),
        need: U.need,
        held: j,
        untrusted: P.untrusted
      };
    });
    M.setPots(k);
  }, [d, f, o, j, v]), /* @__PURE__ */ s.jsxs(
    "div",
    {
      className: `dsc-twin-keepalive${w ? " is-active" : ""}`,
      "aria-hidden": !w,
      inert: w ? void 0 : !0,
      "data-status": v,
      "data-focus-tent": x || "both",
      style: w ? void 0 : {
        pointerEvents: "none",
        position: "fixed",
        visibility: "hidden",
        inset: 0,
        zIndex: -1,
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ s.jsx("div", { className: "dsc-twin-keepalive-host", ref: g }),
        v === "missing" ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-empty", children: [
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
const Q_ = "https://cannalib.plausible-deniability.net", Z_ = {
  strain: "/local/dsc-catalog/dsc_strains_search_index.json",
  medium: "/local/dsc-catalog/dsc_mediums_search_index.json",
  nutrient: "/local/dsc-catalog/dsc_nutrients_search_index.json",
  light: "/local/dsc-catalog/dsc_lights_search_index.json"
}, K_ = {
  strain: "strains",
  medium: "mediums",
  nutrient: "nutrients",
  light: "lights"
};
function J_(l) {
  return (l("input_text.dsc_cannalib_base_url", "") || Q_).replace(/\/$/, "");
}
function W_(l) {
  const c = { Accept: "application/json" }, u = l("input_text.dsc_cannalib_api_key", "");
  return u && u !== "unknown" && u !== "unavailable" && (c["X-Cannalib-Key"] = u), c;
}
function Xp(l) {
  if (Array.isArray(l)) return l;
  if (l && typeof l == "object") {
    const c = l;
    if (Array.isArray(c.items)) return c.items;
    if (Array.isArray(c.strains)) return c.strains;
  }
  return [];
}
function Qp(l) {
  return String(l.name || l.id || "").trim();
}
function P_(l) {
  const c = String(l.kind ?? "").trim().toLowerCase();
  if (c && c !== "strain" && c !== "cultivar") return !1;
  const u = Qp(l), o = u.toLowerCase();
  return !(/\bcapsules?\b/.test(o) || /\brosin\b/.test(o) || /\blubricant\b/.test(o) || /\bthca\s+pebbles?\b/.test(o) || /\d+\s*mg\b/.test(o) || /^#+\s*\d+/.test(u.trim()));
}
function ap(l, c) {
  return l !== "strain" ? c : c.filter(P_);
}
function lp(l, c) {
  const u = c.trim().toLowerCase();
  if (!u || l.length < 2) return l;
  const o = (d) => {
    if (String(d.matched_via ?? "").toLowerCase() === "science_alias") return 0;
    const m = String(d.science_alias ?? "").toLowerCase();
    return m && m.split(/[,;/|]/).some((g) => g.trim() === u || g.trim().includes(u)) ? 1 : 2;
  };
  return [...l].sort((d, f) => o(d) - o(f));
}
async function I_(l, c) {
  const u = await fetch(Z_[l], { cache: "no-store" });
  if (!u.ok) return [];
  const o = Xp(await u.json()), d = c.trim().toLowerCase();
  return d ? o.filter((f) => Qp(f).toLowerCase().includes(d)) : o;
}
async function Zp(l, c, u, o = 100) {
  try {
    const f = K_[l], m = `${J_(u)}/v1/catalogs/${f}?q=${encodeURIComponent(c || "")}&limit=${o}`, g = await fetch(m, { headers: W_(u), cache: "no-store" });
    if (!g.ok) throw new Error(`cannalib ${g.status}`);
    const p = lp(ap(l, Xp(await g.json())), c);
    if (p.length || l === "strain")
      return {
        items: p,
        source: "cannalib",
        note: "CannaLib live"
      };
  } catch {
  }
  return {
    items: lp(ap(l, await I_(l, c)), c),
    source: "local",
    note: "CannaLib unreachable — local JSON index"
  };
}
function Kp({
  kind: l,
  onPick: c,
  placeholder: u
}) {
  const { state: o } = Se(), [d, f] = y.useState(""), [m, g] = y.useState([]), [p, v] = y.useState("local"), [b, x] = y.useState(""), [w, j] = y.useState(!1);
  y.useEffect(() => {
    let T = !1;
    const k = window.setTimeout(() => {
      j(!0), Zp(l, d, o, 100).then((E) => {
        T || (g(E.items), v(E.source), x(E.note), j(!1));
      });
    }, 200);
    return () => {
      T = !0, window.clearTimeout(k);
    };
  }, [l, d]);
  const M = y.useMemo(() => m, [m]);
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-catalog-picker", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ s.jsx(
        F,
        {
          label: p === "cannalib" ? "Cannalib" : "Local JSON",
          tone: p === "cannalib" ? "ok" : "warn"
        }
      ),
      b ? /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", style: { fontSize: 12 }, children: b }) : null
    ] }),
    /* @__PURE__ */ s.jsx(
      "input",
      {
        type: "search",
        value: d,
        placeholder: u || "Type to search — options are not culled",
        onChange: (T) => f(T.target.value),
        autoComplete: "off"
      }
    ),
    /* @__PURE__ */ s.jsxs("ul", { className: "dsc-catalog-hits", children: [
      w && !M.length ? /* @__PURE__ */ s.jsx("li", { className: "dsc-muted", children: "Searching…" }) : null,
      !w && !M.length ? /* @__PURE__ */ s.jsx("li", { className: "dsc-muted", children: "No catalog hits — empty is honesty, not a placeholder." }) : null,
      M.map((T, k) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsxs("button", { type: "button", onClick: () => c(T), children: [
        /* @__PURE__ */ s.jsx("strong", { children: T.name }),
        T.type ? /* @__PURE__ */ s.jsx("em", { children: String(T.type) }) : null,
        T.breeder ? /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", children: String(T.breeder) }) : null
      ] }) }, `${T.id || T.name}-${k}`))
    ] })
  ] });
}
const Gn = [1, 2, 3];
function Jp(l, c) {
  return Gn.find((o) => !l[o] && o !== c) ?? Gn.find((o) => !l[o]) ?? 3;
}
function ou(l, c, u, o) {
  const d = Jp(o, l), f = Gn.filter((x) => x !== l && x !== d), m = f.reduce((x, w) => x + (Number.isFinite(u[w]) ? Math.round(u[w]) : 0), 0), g = Math.max(0, 100 - m), p = Math.max(0, Math.min(g, Math.round(c))), v = g - p, b = { ...u, [l]: p, [d]: v };
  return f.forEach((x) => {
    b[x] = Math.round(Number.isFinite(u[x]) ? u[x] : 0);
  }), b;
}
function e0({ volumeL: l }) {
  const { state: c, num: u, available: o, callService: d } = Se(), [f, m] = y.useState({ 1: !1, 2: !1, 3: !1 }), [g, p] = y.useState(null), [v, b] = y.useState(null), x = {
    1: u("input_number.dsc_blend_pct_1", 0),
    2: u("input_number.dsc_blend_pct_2", 0),
    3: u("input_number.dsc_blend_pct_3", 0)
  }, w = v ?? x, j = Gn.map((G) => ({
    n: G,
    name: c(`input_text.dsc_blend_component_${G}_name`, ""),
    pct: Number.isFinite(w[G]) ? w[G] : 0
  })), M = Gn.filter((G) => f[G]).length, T = Jp(f), k = Number.isFinite(l) && l > 0 ? l : u("input_number.dsc_blend_total_l", 20), E = j.reduce((G, Q) => G + (Number.isFinite(Q.pct) ? Q.pct : 0), 0), U = (G) => {
    Gn.forEach((Q) => {
      o(`input_number.dsc_blend_pct_${Q}`) && d("input_number", "set_value", {
        entity_id: `input_number.dsc_blend_pct_${Q}`,
        value: G[Q]
      });
    });
  }, Y = (G, Q) => {
    const te = ou(G, Q, v ?? w, f);
    b(null), p(null), U(te);
  }, P = (G) => {
    m((Q) => {
      const te = { ...Q, [G]: !Q[G] };
      return Gn.filter((xe) => te[xe]).length >= Gn.length ? Q : te;
    });
  }, Z = y.useMemo(
    () => j.filter((G) => G.pct > 0 && G.name && G.name !== "unknown").map((G) => `${G.name} ${(k * G.pct / 100).toFixed(1)}L (${Math.round(G.pct)}%)`).join(" · "),
    [j, k]
  );
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-coupled-mix", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ s.jsx(F, { label: `Σ ${Math.round(E)}%`, tone: Math.round(E) === 100 ? "ok" : "warn" }),
      /* @__PURE__ */ s.jsx(F, { label: `${k} L vessel`, tone: "muted" }),
      /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", style: { fontSize: 12 }, children: "Lock any but one remainder. Remainder absorbs leftover so Σ stays 100." })
    ] }),
    Gn.map((G) => {
      const Q = j[G - 1], te = G === T && !f[G];
      return /* @__PURE__ */ s.jsxs("div", { className: "dsc-mix-row", children: [
        /* @__PURE__ */ s.jsx(vc, { entityId: `input_text.dsc_blend_component_${G}_name`, label: `Layer ${G}` }),
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "range",
            min: 0,
            max: 100,
            value: Math.round(Q.pct),
            disabled: f[G] || te,
            onPointerDown: (ae) => {
              f[G] || te || (ae.target.setPointerCapture(ae.pointerId), p(G), b({ ...w }));
            },
            onPointerUp: (ae) => {
              g === G && Y(G, Number(ae.target.value));
            },
            onPointerCancel: () => {
              b(null), p(null);
            },
            onLostPointerCapture: (ae) => {
              g === G && Y(G, Number(ae.target.value));
            },
            onChange: (ae) => {
              const xe = Number(ae.target.value);
              if (g === G) {
                b(ou(G, xe, v ?? w, f));
                return;
              }
              U(ou(G, xe, w, f));
            }
          }
        ),
        /* @__PURE__ */ s.jsxs("strong", { children: [
          Math.round(Q.pct),
          "%"
        ] }),
        /* @__PURE__ */ s.jsxs("span", { className: "dsc-mono", children: [
          (k * Q.pct / 100).toFixed(1),
          " L"
        ] }),
        /* @__PURE__ */ s.jsx(he, { disabled: M >= 2 && !f[G], onClick: () => P(G), children: f[G] ? "Unlock" : te ? "Remainder" : "Lock" })
      ] }, G);
    }),
    /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: [
      "Recipe: ",
      Z || "Empty layers — scripts still read pct entities."
    ] })
  ] });
}
const Wp = "sensor.dsc_hub_uptime", Pp = "sensor.dsc_hub_heartbeat";
function t0(l, c) {
  if (!c || l == null || l === "") return NaN;
  const u = l.trim().toLowerCase();
  if (u === "unavailable" || u === "unknown" || u === "none") return NaN;
  const o = Number(l);
  return Number.isFinite(o) ? o : NaN;
}
function Te(l) {
  const { available: c, tick: u, entity: o } = Se(), d = y.useRef(null), f = y.useRef(l), [, m] = y.useState(0);
  f.current !== l && (f.current = l, d.current = null);
  const g = !c(Wp) || !c(Pp), p = c(l), v = t0(o(l)?.state, p), b = g && v === 0;
  return y.useEffect(() => {
    if (p && Number.isFinite(v) && !b) {
      d.current = { value: v, at: Date.now() }, m((x) => x + 1);
      return;
    }
    m((x) => x + 1);
  }, [l, p, v, b, u, o]), p && Number.isFinite(v) && !b ? { value: v, stale: !1, heldAt: d.current?.at, live: !0 } : d.current != null ? {
    value: d.current.value,
    stale: !0,
    heldAt: d.current.at,
    live: !1
  } : { value: NaN, stale: !0, heldAt: void 0, live: !1 };
}
function Du(l) {
  const { available: c, entity: u, tick: o } = Se();
  if (c(l)) return null;
  const d = u(l)?.last_changed;
  if (!d) return null;
  const f = Date.parse(d);
  return Number.isFinite(f) ? Date.now() - f : null;
}
function n0() {
  return Du(Wp);
}
function a0() {
  return Du(Pp);
}
function l0() {
  return Du("binary_sensor.dsc_hub_panel_link");
}
function s0(l) {
  if (l.stale) return "stale";
  if (l.available === !1 || !Number.isFinite(l.value)) return "muted";
  if (l.fault) return "critical";
  if (l.band) {
    const c = l.margin ?? 0;
    if (l.value < l.band.min - c || l.value > l.band.max + c)
      return l.value < l.band.min - c * 3 || l.value > l.band.max + c * 3 ? "critical" : "warn";
  }
  return "ok";
}
const Ip = [
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
], uu = {
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
function oc(l, c) {
  const u = Number(l(c, ""));
  return Number.isFinite(u) && u > 0 ? u : NaN;
}
function sp(l) {
  if (!l || l === "—" || l === "Off" || l === "Custom") return null;
  const c = uu[l];
  if (c) return c;
  const u = Object.keys(uu).find((o) => l.indexOf(o) >= 0);
  return u ? uu[u] : null;
}
function du(l, c) {
  return !Number.isFinite(c.min) || !Number.isFinite(c.max) ? l : l ? {
    min: Math.max(l.min, c.min),
    max: Math.min(l.max, c.max),
    source: l.source === "plant" || c.source === "plant" ? "plant" : "stage",
    mixed: l.source !== c.source || l.mixed
  } : { ...c, mixed: !1 };
}
function yu(l, c) {
  const u = Vp(l, c.state, c.entity).filter((w) => kt(w.pot, c.state));
  let o = null, d = null, f = null, m = null;
  const g = [], p = [];
  let v = !1;
  for (const w of u) {
    w.stage && w.stage !== "—" && (g.length && !g.includes(w.stage) && (v = !0), g.includes(w.stage) || g.push(w.stage)), w.need && w.need !== "—" && w.need !== "ok" && !p.includes(w.need) && p.push(w.need);
    const j = oc(c.state, `sensor.dsc_pot${w.pot}_want_temp_min`), M = oc(c.state, `sensor.dsc_pot${w.pot}_want_temp_max`);
    Number.isFinite(j) && Number.isFinite(M) && (o = du(o, { min: j, max: M, source: "plant" }));
    const T = oc(c.state, `sensor.dsc_pot${w.pot}_want_rh_min`), k = oc(c.state, `sensor.dsc_pot${w.pot}_want_rh_max`);
    Number.isFinite(T) && Number.isFinite(k) && (d = du(d, { min: T, max: k, source: "plant" }));
    const E = sp(w.stage);
    E && (o || (o = { min: E.temp - 1.5, max: E.temp + 1.5, source: "stage", mixed: !1 }), d || (d = { min: E.rhMin, max: E.rhMax, source: "stage", mixed: !1 }), f = du(f, { min: E.vpdMin, max: E.vpdMax, source: "stage" }), m = m == null ? E.lightHours : Math.min(m, E.lightHours));
  }
  const b = l === "main" ? c.state("select.dsc_hub_grow_stage", "") : c.state("select.dsc_hub_clone_mode", "");
  if (!u.length || !o && !d && !f) {
    const w = l === "clone" ? b === "Clones & Seedlings" ? "Seedling" : b === "Mother" ? "Vegetative" : b === "Follow 4x8" ? c.state("select.dsc_hub_grow_stage", "") : "" : b, j = sp(w);
    j && (o || (o = { min: j.temp - 1.5, max: j.temp + 1.5, source: "stage", mixed: !1 }), d || (d = { min: j.rhMin, max: j.rhMax, source: "stage", mixed: !1 }), f || (f = { min: j.vpdMin, max: j.vpdMax, source: "stage", mixed: !1 }), m == null && (m = j.lightHours), w && !g.includes(w) && g.push(w));
  }
  return o && o.min > o.max && (o = { ...o, min: o.max, max: o.min, mixed: !0 }), d && d.min > d.max && (d = { ...d, min: d.max, max: d.min, mixed: !0 }), f && f.min > f.max && (f = { ...f, min: f.max, max: f.min, mixed: !0 }), {
    temp: o,
    rh: d,
    vpd: f,
    lightHours: m,
    mixed: v,
    stages: g,
    needs: p,
    emptyLabel: !o && !d && !f ? "no plant/stage rail" : null
  };
}
function ga(l, c, u) {
  if (u) return { tone: "critical", label: "min > max" };
  if (!c) return { tone: "muted", label: "no plant/stage rail" };
  const o = s0({ value: l, band: c, margin: (c.max - c.min) * 0.12 }), d = c.source === "plant" ? "plant Want" : "stage rail";
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
function fu(l, c, u) {
  const o = Number(u(`sensor.dsc_pot${l}_want_${c}_min`, "")), d = Number(u(`sensor.dsc_pot${l}_want_${c}_max`, ""));
  if (o > 0 && d > 0 && d >= o) return { min: o, max: d };
  if (c === "moisture") return { min: 0, max: 45 };
}
const ip = 2e3;
function ev(l, c = Date.now()) {
  if (!l.length) return [];
  const u = [...l].sort((f, m) => f.t - m.t), o = [];
  for (let f = 0; f < u.length; f++) {
    const m = u[f];
    if (!Number.isFinite(m.v)) continue;
    const g = o[o.length - 1];
    g && m.t - g.t > ip && o.push({ t: m.t - 1, v: g.v }), o.push(m);
  }
  const d = o[o.length - 1];
  return d && c - d.t > ip && o.push({ t: c, v: d.v }), o;
}
function i0(l) {
  if (l == null) return !0;
  const c = String(l).toLowerCase();
  return c === "" || c === "unavailable" || c === "unknown" || c === "none";
}
function tv(l) {
  if (i0(l)) return null;
  if (typeof l == "number") return Number.isFinite(l) ? l : null;
  const c = String(l).toLowerCase();
  if (c === "on" || c === "true" || c === "open") return 1;
  if (c === "off" || c === "false" || c === "closed") return 0;
  const u = Number(l);
  return Number.isFinite(u) ? u : null;
}
function c0(l) {
  if (typeof l.lu == "number" && Number.isFinite(l.lu))
    return l.lu * 1e3;
  const c = l.last_changed || l.last_updated;
  if (c) {
    const u = Date.parse(c);
    return Number.isFinite(u) ? u : null;
  }
  return null;
}
function r0(l) {
  return tv(l.s ?? l.state);
}
function o0(l, c) {
  if (l.length <= c) return l;
  const u = [], o = (l.length - 1) / (c - 1);
  for (let d = 0; d < c; d++)
    u.push(l[Math.round(d * o)]);
  return u;
}
function nv(l, c = 6, u = 96) {
  const { hass: o, callWS: d } = Se(), f = !!(o && (o.callWS || o.connection)), [m, g] = y.useState([]), [p, v] = y.useState(!0), [b, x] = y.useState(null);
  return y.useEffect(() => {
    let w = !1;
    async function j() {
      if (!l) {
        g([]), v(!1);
        return;
      }
      if (!f) {
        g([]), v(!1);
        return;
      }
      v(!0), x(null);
      const M = /* @__PURE__ */ new Date(), T = new Date(M.getTime() - c * 3600 * 1e3);
      try {
        const k = await d({
          type: "history/history_during_period",
          start_time: T.toISOString(),
          end_time: M.toISOString(),
          significant_changes_only: !1,
          minimal_response: !0,
          no_attributes: !0,
          entity_ids: [l]
        });
        if (w) return;
        if (k == null) {
          g([]), x("history unavailable");
          return;
        }
        let E = [];
        Array.isArray(k) ? E = k[0] || [] : k && typeof k == "object" && (E = k[l] || []);
        const U = [];
        for (const Y of E) {
          const P = c0(Y), Z = r0(Y);
          P == null || Z == null || U.push({ t: P, v: Z });
        }
        U.sort((Y, P) => Y.t - P.t), g(o0(U, u));
      } catch (k) {
        w || (x(k instanceof Error ? k.message : "history unavailable"), g([]));
      } finally {
        w || v(!1);
      }
    }
    return j(), () => {
      w = !0;
    };
  }, [f, l, c, u, d]), { points: m, loading: p, error: b };
}
function u0(l) {
  return l <= 18 ? l * 2 : Math.min(l + 24, 48);
}
function d0(l, c) {
  const u = c * 3600 * 1e3, o = Date.now() - u;
  return l.filter((d) => d.t < o && Number.isFinite(d.v)).map((d) => ({ t: d.t + u, v: d.v }));
}
function qe(l, c) {
  const u = c?.maxPoints ?? 96, o = c?.hours ?? 6, d = !!c?.withGhost, f = d ? u0(o) : o, m = d ? Math.min(Math.max(u * 2, u), 288) : u, { num: g, available: p, tick: v, state: b } = Se(), { points: x } = nv(l, f, m), [w, j] = y.useState([]), [M, T] = y.useState(void 0), k = y.useRef(null), E = y.useRef(!1);
  y.useEffect(() => {
    E.current = !1, j([]), k.current = null, T(void 0);
  }, [l, o, u, f, d]), y.useEffect(() => {
    if (x.length && !E.current) {
      E.current = !0;
      const Z = x[x.length - 1]?.v;
      Number.isFinite(Z) && (k.current = Z);
    }
  }, [x]), y.useEffect(() => {
    if (!l || !p(l)) return;
    const Z = g(l), G = Number.isFinite(Z) ? Z : tv(b(l, ""));
    if (G == null || !Number.isFinite(G)) return;
    if (k.current === G && w.length > 0) {
      const te = Date.now(), ae = w[w.length - 1]?.t ?? 0;
      if (te - ae < 4e3) return;
    }
    k.current = G;
    const Q = Date.now();
    j((te) => [...te, { t: Q, v: G }].slice(-u)), T(Q);
  }, [l, v, p, g, b, u]);
  const U = d ? Math.max(m, u * 2) : u * 2, { series: Y, ghost: P } = y.useMemo(() => {
    const Z = x.length ? x[x.length - 1].t : 0, G = w.filter((W) => W.t > Z + 250), Q = x.length ? [...x, ...G] : G, te = ev(Q), ae = te.length > U ? te.slice(-U) : te;
    if (!d) return { series: ae, ghost: [] };
    const xe = o * 3600 * 1e3, z = Date.now() - xe;
    return {
      series: ae.filter((W) => W.t >= z),
      ghost: d0(ae, o)
    };
  }, [x, w, U, d, o]);
  return { series: Y, lastSyncAt: M, ghost: P };
}
const f0 = [1, 6, 24, 48], av = "dsc_chart_hours";
function h0() {
  try {
    const l = sessionStorage.getItem(av), c = Number(l);
    if (Number.isFinite(c) && c > 0 && c <= 48) return c;
  } catch {
  }
  return 6;
}
function Hs(l = 6) {
  const [c, u] = y.useState(() => h0() || l), o = y.useCallback((f) => {
    u(f);
    try {
      sessionStorage.setItem(av, String(f));
    } catch {
    }
  }, []), d = c <= 1 ? 60 : c <= 6 ? 96 : c <= 24 ? 144 : 192;
  return { hours: c, setHours: o, maxPoints: d };
}
const lv = "dsc-hub-snooze:";
function hu(l) {
  try {
    const c = localStorage.getItem(lv + l);
    if (!c) return {};
    const u = JSON.parse(c);
    return !u || typeof u != "object" ? {} : u;
  } catch {
    return {};
  }
}
function cp(l, c) {
  try {
    localStorage.setItem(lv + l, JSON.stringify(c));
  } catch {
  }
}
function sv() {
  const { entity: l, tick: c } = Se(), u = l("sensor.dsc_hub_uptime")?.last_changed || "noboot", o = y.useMemo(() => hu(u), [u, c]), d = y.useCallback((g) => !!o[g], [o]), f = y.useCallback(
    (g) => {
      if (!g) return;
      const p = { ...hu(u), [g]: !0 };
      cp(u, p);
    },
    [u]
  ), m = y.useCallback(
    (g) => {
      const p = { ...hu(u) };
      delete p[g], cp(u, p);
    },
    [u]
  );
  return { bootKey: u, isSnoozed: d, snooze: f, unsnooze: m };
}
const uc = [
  "var(--dsc-neon)",
  "var(--dsc-teal)",
  "var(--dsc-amber)",
  "var(--dsc-gray-5)"
];
function rp(l) {
  const c = Math.max(...l, 1), u = 10 ** Math.floor(Math.log10(c));
  return Math.ceil(c / u) * u;
}
function op(l, c = !1) {
  const u = Math.min(...l);
  if (c && u >= 0) return 0;
  const o = Math.abs(u) || 1, d = 10 ** Math.floor(Math.log10(o));
  return Math.floor(u / d) * d;
}
function up(l, c, u = 0.08) {
  if (!Number.isFinite(l) || !Number.isFinite(c)) return { min: 0, max: 1 };
  if (c <= l) return { min: l - 1, max: c + 1 };
  const d = (c - l) * u || 1;
  return { min: l - d, max: c + d };
}
function _c(l, c, u, o, d, f, m, g) {
  const p = Math.max(f - d, 1e-6), v = Math.max(g - m, 1), b = c - o.l - o.r, x = u - o.t - o.b;
  return {
    x: o.l + (l.t - m) / v * b,
    y: o.t + (1 - (l.v - d) / p) * x
  };
}
function m0(l, c, u, o, d, f, m, g, p = !1) {
  return l.length ? l.map((v, b) => {
    const { x, y: w } = _c(v, c, u, o, d, f, m, g);
    if (b === 0) return `M${x.toFixed(1)} ${w.toFixed(1)}`;
    if (!p) return `L${x.toFixed(1)} ${w.toFixed(1)}`;
    const j = _c(l[b - 1], c, u, o, d, f, m, g);
    return `L${x.toFixed(1)} ${j.y.toFixed(1)} L${x.toFixed(1)} ${w.toFixed(1)}`;
  }).join(" ") : "";
}
function p0(l, c, u) {
  if (!c || !Number.isFinite(l)) return u;
  const d = Math.max(c.max - c.min, 1e-6) * 0.12;
  return l < c.min || l > c.max ? "var(--dsc-bad)" : l < c.min + d || l > c.max - d ? "var(--dsc-amber)" : u;
}
function v0(l, c, u, o, d, f, m, g, p, v, b = !1) {
  if (l.length < 2) return [];
  const x = [];
  for (let w = 1; w < l.length; w++) {
    const j = l[w - 1], M = l[w], T = _c(j, c, u, o, d, f, m, g), k = _c(M, c, u, o, d, f, m, g), E = p0(M.v, p, v), U = b ? `M${T.x.toFixed(1)} ${T.y.toFixed(1)} L${k.x.toFixed(1)} ${T.y.toFixed(1)} L${k.x.toFixed(1)} ${k.y.toFixed(1)}` : `M${T.x.toFixed(1)} ${T.y.toFixed(1)} L${k.x.toFixed(1)} ${k.y.toFixed(1)}`, Y = x[x.length - 1];
    Y && Y.color === E ? Y.d += U.slice(1) : x.push({ d: U, color: E });
  }
  return x;
}
function dp(l) {
  const c = new Date(l), u = String(c.getHours()).padStart(2, "0"), o = String(c.getMinutes()).padStart(2, "0");
  return `${u}:${o}`;
}
function Ba(l, c, u, o, d) {
  const f = Math.max(u - c, 1e-6);
  return d.t + (1 - (l - c) / f) * (o - d.t - d.b);
}
function fp(l, c, u) {
  if (u?.min != null && u?.max != null) return { min: u.min, max: u.max };
  const o = l.filter((d) => (d.axis || "left") === c).flatMap((d) => d.series.map((f) => f.v));
  if (!o.length)
    return c === "right" ? { min: 0, max: 100 } : { min: 0, max: 1 };
  if (c === "right") {
    const d = Math.min(...o, 0);
    return Math.max(...o, 100) <= 100 && d >= 0 ? { min: 0, max: 100 } : up(op(o, !0), rp(o));
  }
  return up(op(o), rp(o));
}
function gn({
  series: l,
  height: c = 180,
  unit: u = "",
  live: o = !0,
  emptyLabel: d = "thin recorder",
  lastSyncAt: f,
  targets: m = [],
  yDomain: g
}) {
  const p = y.useId().replace(/:/g, ""), v = 640, b = l.some((z) => z.axis === "right"), x = { l: 40, r: b ? 40 : 14, t: 16, b: 28 }, w = y.useRef(null), [j, M] = y.useState(null), [T, k] = y.useState(!1), E = y.useMemo(() => {
    const z = l.flatMap((H) => H.series);
    if (!z.length) return null;
    const W = fp(l, "left", g?.left), se = fp(l, "right", g?.right), K = Math.min(...z.map((H) => H.t)), J = Math.max(...z.map((H) => H.t), Date.now()), A = l.map((H, I) => {
      const ve = H.axis || "left", pe = ve === "right" ? se : W, N = H.color || uc[I % uc.length];
      return {
        ...H,
        axis: ve,
        color: N,
        d: m0(H.series, v, c, x, pe.min, pe.max, K, J, H.step),
        segs: H.ghost ? [] : v0(H.series, v, c, x, pe.min, pe.max, K, J, H.band, N, H.step),
        last: H.series.length ? H.series[H.series.length - 1] : null,
        ext: vn(H.series),
        dom: pe
      };
    });
    return { left: W, right: se, t0: K, t1: J, paths: A };
  }, [l, c, b, g]), U = y.useMemo(() => {
    if (!E) return [];
    const z = 4, W = [];
    for (let se = 0; se <= z; se++) {
      const K = se / z, J = E.left.max - K * (E.left.max - E.left.min), A = x.t + K * (c - x.t - x.b);
      W.push({ y: A, label: J.toFixed(Math.abs(J) >= 100 ? 0 : 1) });
    }
    return W;
  }, [E, c]), Y = y.useMemo(() => {
    if (!E || !b) return [];
    const z = 4, W = [];
    for (let se = 0; se <= z; se++) {
      const K = se / z, J = E.right.max - K * (E.right.max - E.right.min), A = x.t + K * (c - x.t - x.b);
      W.push({ y: A, label: J.toFixed(Math.abs(J) >= 100 ? 0 : 1) });
    }
    return W;
  }, [E, c, b]), P = y.useMemo(() => {
    if (!E) return [];
    const z = 5, W = [], se = Math.max(E.t1 - E.t0, 1), K = v - x.l - x.r;
    for (let J = 0; J < z; J++) {
      const A = J / (z - 1), H = E.t0 + A * se;
      W.push({ x: x.l + A * K, label: dp(H) });
    }
    return W;
  }, [E]), Z = y.useCallback(
    (z) => {
      const W = w.current;
      if (!W || !E) return null;
      const se = W.getBoundingClientRect(), K = (z - se.left) / Math.max(se.width, 1) * v, J = v - x.l - x.r, A = Math.min(v - x.r, Math.max(x.l, K)), H = (A - x.l) / Math.max(J, 1);
      return { t: E.t0 + H * Math.max(E.t1 - E.t0, 1), x: A };
    },
    [E]
  ), G = (z) => {
    if (T) return;
    const W = Z(z.clientX);
    W && M(W);
  }, Q = () => {
    T || M(null);
  }, te = (z) => {
    const W = Z(z.clientX);
    if (W) {
      if (T && j && Math.abs(j.x - W.x) < 8) {
        k(!1), M(null);
        return;
      }
      k(!0), M(W);
    }
  }, ae = y.useMemo(() => !E || !j ? [] : E.paths.map((z) => {
    if (!z.series.length) return { id: z.id, label: z.label, color: z.color, v: null, unit: z.unit || "" };
    let W = z.series[0], se = Math.abs(W.t - j.t);
    for (const J of z.series) {
      const A = Math.abs(J.t - j.t);
      A < se && (W = J, se = A);
    }
    const K = Ba(W.v, z.dom.min, z.dom.max, c, x);
    return {
      id: z.id,
      label: z.label,
      color: z.color,
      v: W.v,
      unit: z.unit || "",
      y: K,
      x: x.l + (W.t - E.t0) / Math.max(E.t1 - E.t0, 1) * (v - x.l - x.r)
    };
  }), [E, j, c]), xe = E?.paths[0]?.last?.v ?? null;
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-chart", style: { position: "relative", width: "100%" }, children: [
    /* @__PURE__ */ s.jsxs(
      "svg",
      {
        ref: w,
        viewBox: `0 0 ${v} ${c}`,
        width: "100%",
        height: c,
        role: "img",
        "aria-label": "Live chart",
        className: "dsc-chart-svg",
        onPointerMove: G,
        onPointerLeave: Q,
        onPointerDown: te,
        children: [
          /* @__PURE__ */ s.jsxs("defs", { children: [
            E?.paths.map((z) => /* @__PURE__ */ s.jsxs("linearGradient", { id: `fill-${p}-${z.id}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ s.jsx("stop", { offset: "0%", stopColor: z.color, stopOpacity: "0.28" }),
              /* @__PURE__ */ s.jsx("stop", { offset: "100%", stopColor: z.color, stopOpacity: "0" })
            ] }, z.id)),
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
          U.map((z) => /* @__PURE__ */ s.jsxs("g", { children: [
            /* @__PURE__ */ s.jsx(
              "line",
              {
                x1: x.l,
                x2: v - x.r,
                y1: z.y,
                y2: z.y,
                stroke: "var(--dsc-gray-3)",
                strokeWidth: "1",
                strokeDasharray: "3 4"
              }
            ),
            /* @__PURE__ */ s.jsx(
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
          ] }, `L${z.y}`)),
          Y.map((z) => /* @__PURE__ */ s.jsx(
            "text",
            {
              x: v - x.r + 6,
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
          P.map((z) => /* @__PURE__ */ s.jsx(
            "text",
            {
              x: z.x,
              y: c - 8,
              textAnchor: "middle",
              fill: "var(--dsc-gray-5)",
              fontSize: "9",
              fontFamily: "var(--dsc-mono)",
              children: z.label
            },
            z.x
          )),
          E ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
            m.map((z, W) => {
              const se = z.axis || "left", K = se === "right" ? E.right : E.left, J = z.color || (se === "right" ? "var(--dsc-teal)" : "var(--dsc-amber)");
              if (z.min != null && z.max != null) {
                const H = Ba(z.max, K.min, K.max, c, x), I = Ba(z.min, K.min, K.max, c, x);
                return /* @__PURE__ */ s.jsxs("g", { children: [
                  /* @__PURE__ */ s.jsx(
                    "rect",
                    {
                      x: x.l,
                      y: Math.min(H, I),
                      width: v - x.l - x.r,
                      height: Math.abs(I - H),
                      fill: J,
                      opacity: 0.08
                    }
                  ),
                  /* @__PURE__ */ s.jsx(
                    "line",
                    {
                      x1: x.l,
                      x2: v - x.r,
                      y1: H,
                      y2: H,
                      stroke: J,
                      strokeWidth: "1",
                      strokeDasharray: "4 4",
                      opacity: 0.7
                    }
                  ),
                  /* @__PURE__ */ s.jsx(
                    "line",
                    {
                      x1: x.l,
                      x2: v - x.r,
                      y1: I,
                      y2: I,
                      stroke: J,
                      strokeWidth: "1",
                      strokeDasharray: "4 4",
                      opacity: 0.7
                    }
                  )
                ] }, `tg-${W}`);
              }
              if (z.value == null || !Number.isFinite(z.value)) return null;
              const A = Ba(z.value, K.min, K.max, c, x);
              return /* @__PURE__ */ s.jsxs("g", { children: [
                /* @__PURE__ */ s.jsx(
                  "line",
                  {
                    x1: x.l,
                    x2: v - x.r,
                    y1: A,
                    y2: A,
                    stroke: J,
                    strokeWidth: "1.2",
                    strokeDasharray: "5 4",
                    opacity: 0.85
                  }
                ),
                z.label ? /* @__PURE__ */ s.jsx(
                  "text",
                  {
                    x: v - x.r - 2,
                    y: A - 4,
                    textAnchor: "end",
                    fill: J,
                    fontSize: "8",
                    fontFamily: "var(--dsc-mono)",
                    children: z.label
                  }
                ) : null
              ] }, `tg-${W}`);
            }),
            E.paths.map((z) => {
              if (!z.d || z.series.length === 0) return null;
              const W = z.last, se = W && E ? x.l + (W.t - E.t0) / Math.max(E.t1 - E.t0, 1) * (v - x.l - x.r) : 0, K = W ? Ba(W.v, z.dom.min, z.dom.max, c, x) : 0, J = z.segs.length ? z.segs : [{ d: z.d, color: z.color }];
              return /* @__PURE__ */ s.jsxs("g", { className: "dsc-chart-series", children: [
                z.ghost ? /* @__PURE__ */ s.jsx(
                  "path",
                  {
                    d: z.d,
                    fill: "none",
                    stroke: z.color,
                    strokeWidth: 1.6,
                    strokeLinejoin: "round",
                    strokeLinecap: "round",
                    strokeDasharray: "5 4",
                    opacity: 0.55,
                    className: "dsc-chart-core"
                  }
                ) : J.map((A, H) => /* @__PURE__ */ s.jsx(
                  "path",
                  {
                    d: A.d,
                    fill: "none",
                    stroke: A.color,
                    strokeWidth: 2.2,
                    strokeLinejoin: "round",
                    strokeLinecap: "round",
                    filter: `url(#glow-${p})`,
                    opacity: 0.95,
                    className: "dsc-chart-core"
                  },
                  `${z.id}-seg-${H}`
                )),
                o && W ? /* @__PURE__ */ s.jsx("circle", { cx: se, cy: K, r: 3, fill: z.color, opacity: 0.9, className: "dsc-chart-tip" }) : null,
                z.ext.min != null ? /* @__PURE__ */ s.jsxs(
                  "text",
                  {
                    x: x.l + 2,
                    y: Ba(z.ext.min, z.dom.min, z.dom.max, c, x) + 8,
                    fill: z.color,
                    fontSize: "8",
                    opacity: 0.7,
                    children: [
                      "min ",
                      z.ext.min.toFixed(z.ext.min >= 100 ? 0 : 1)
                    ]
                  }
                ) : null,
                z.ext.max != null ? /* @__PURE__ */ s.jsxs(
                  "text",
                  {
                    x: x.l + 2,
                    y: Ba(z.ext.max, z.dom.min, z.dom.max, c, x) - 3,
                    fill: z.color,
                    fontSize: "8",
                    opacity: 0.7,
                    children: [
                      "max ",
                      z.ext.max.toFixed(z.ext.max >= 100 ? 0 : 1)
                    ]
                  }
                ) : null
              ] }, z.id);
            }),
            j ? /* @__PURE__ */ s.jsxs("g", { className: "dsc-chart-crosshair", children: [
              /* @__PURE__ */ s.jsx(
                "line",
                {
                  x1: j.x,
                  x2: j.x,
                  y1: x.t,
                  y2: c - x.b,
                  stroke: "var(--dsc-white)",
                  strokeOpacity: 0.35,
                  strokeWidth: "1"
                }
              ),
              ae.map(
                (z) => z.v == null || z.y == null ? null : /* @__PURE__ */ s.jsx(
                  "circle",
                  {
                    cx: z.x ?? j.x,
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
          ] }) : /* @__PURE__ */ s.jsx(
            "text",
            {
              x: v / 2,
              y: c / 2,
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
          left: `${Math.min(92, Math.max(8, j.x / v * 100))}%`
        },
        children: [
          /* @__PURE__ */ s.jsx("div", { className: "dsc-chart-tooltip-time", children: dp(j.t) }),
          ae.map(
            (z) => z.v == null ? null : /* @__PURE__ */ s.jsxs("div", { className: "dsc-chart-tooltip-row", children: [
              /* @__PURE__ */ s.jsx("i", { style: { background: z.color } }),
              /* @__PURE__ */ s.jsxs("span", { children: [
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
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chart-legend", children: [
      l.filter((z) => z.label).map((z, W) => /* @__PURE__ */ s.jsxs("span", { className: "dsc-chart-legend-item", children: [
        /* @__PURE__ */ s.jsx("i", { style: { background: z.color || uc[W % uc.length] } }),
        z.label
      ] }, z.id)),
      xe != null ? /* @__PURE__ */ s.jsxs("span", { className: "dsc-chart-last", children: [
        xe.toFixed(1),
        u ? ` ${u}` : l[0]?.unit ? ` ${l[0].unit}` : ""
      ] }) : null
    ] })
  ] });
}
function g0(l, c = 280) {
  const [u, o] = y.useState(l);
  return y.useEffect(() => {
    if (!Number.isFinite(l)) {
      o(l);
      return;
    }
    const d = Number.isFinite(u) ? u : l, f = performance.now();
    let m = 0;
    const g = (p) => {
      const v = Math.min(1, (p - f) / c), b = 1 - (1 - v) ** 3;
      o(d + (l - d) * b), v < 1 && (m = requestAnimationFrame(g));
    };
    return m = requestAnimationFrame(g), () => cancelAnimationFrame(m);
  }, [l, c]), u;
}
function hp(l, c, u, o) {
  return { x: l + u * Math.cos(o), y: c + u * Math.sin(o) };
}
function xt({
  value: l,
  min: c = 0,
  max: u = 100,
  label: o,
  unit: d = "",
  target: f,
  band: m,
  extrema: g,
  stale: p,
  onClick: v
}) {
  const b = Number.isFinite(l) ? l : NaN, x = g0(Number.isFinite(b) ? b : c), w = Number.isFinite(b) ? x : c, j = Math.min(u, Math.max(c, w)), M = Math.max(u - c, 1e-6), T = Number.isFinite(b) ? (j - c) / M : 0, k = 46, E = 2 * Math.PI * k * 0.75, U = E * T, Y = (te) => {
    const ae = Math.min(1, Math.max(0, (te - c) / M));
    return Math.PI - ae * Math.PI;
  }, P = m && Number.isFinite(b) ? b >= m.min && b <= m.max : !0, Z = Number.isFinite(b) ? p ? "var(--dsc-amber)" : P ? "var(--dsc-teal)" : "var(--dsc-amber)" : "var(--dsc-gray-4)", G = [];
  m && G.push({ v: m.min, kind: "band" }, { v: m.max, kind: "band" }), g?.min != null && G.push({ v: g.min, kind: "ext" }), g?.max != null && G.push({ v: g.max, kind: "ext" }), f != null && Number.isFinite(f) && G.push({ v: f, kind: "target" });
  const Q = /* @__PURE__ */ s.jsxs(
    "div",
    {
      className: `dsc-gauge${!P && Number.isFinite(b) ? " is-warn" : ""}${p ? " is-stale" : ""}${v ? " is-clickable" : ""}`,
      children: [
        /* @__PURE__ */ s.jsxs("svg", { viewBox: "0 0 120 90", width: "140", height: "105", "aria-label": o, children: [
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
              stroke: Z,
              strokeWidth: "10",
              strokeLinecap: "round",
              strokeDasharray: `${U} ${E}`,
              filter: "url(#dsc-gauge-glow)",
              style: { transition: "stroke-dasharray 220ms ease, stroke 220ms ease" }
            }
          ),
          G.map((te, ae) => {
            const xe = Y(te.v), z = hp(60, 72, te.kind === "ext" ? k - 2 : k + 1, xe), W = hp(60, 72, k - (te.kind === "target" ? 14 : 10), xe), se = te.kind === "target" ? "var(--dsc-teal)" : te.kind === "band" ? "var(--dsc-amber)" : "var(--dsc-gray-5)";
            return /* @__PURE__ */ s.jsx(
              "line",
              {
                x1: W.x,
                y1: W.y,
                x2: z.x,
                y2: z.y,
                stroke: se,
                strokeWidth: te.kind === "target" ? 2.4 : 1.6,
                strokeLinecap: "round",
                opacity: te.kind === "ext" ? 0.65 : 0.95
              },
              `${te.kind}-${ae}`
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
              children: Number.isFinite(b) ? b.toFixed(b >= 100 ? 0 : b < 10 ? 2 : 1) : "—"
            }
          ),
          /* @__PURE__ */ s.jsx("text", { x: "60", y: "74", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: p ? "HELD" : d })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-gauge-label", children: o })
      ]
    }
  );
  return v ? /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-gauge-hit", onClick: v, title: `History · ${o}`, children: Q }) : Q;
}
function x0({
  series: l,
  color: c = "var(--dsc-blue)",
  width: u = 120,
  height: o = 28
}) {
  if (l.length < 2)
    return /* @__PURE__ */ s.jsx("div", { className: "dsc-sparkline dsc-muted", style: { width: u, height: o } });
  const d = l.map((w) => w.v), f = Math.min(...d), m = Math.max(...d), g = Math.max(m - f, 1e-6), p = l[0].t, v = l[l.length - 1].t, b = Math.max(v - p, 1), x = l.map((w, j) => {
    const M = (w.t - p) / b * u, T = o - (w.v - f) / g * (o - 4) - 2;
    return `${j === 0 ? "M" : "L"}${M.toFixed(1)} ${T.toFixed(1)}`;
  }).join(" ");
  return /* @__PURE__ */ s.jsx("svg", { className: "dsc-sparkline", width: u, height: o, "aria-hidden": !0, children: /* @__PURE__ */ s.jsx("path", { d: x, fill: "none", stroke: c, strokeWidth: "1.6", strokeLinecap: "round" }) });
}
function iv({
  rows: l
}) {
  return /* @__PURE__ */ s.jsx("div", { className: "dsc-gotwant", children: l.map((c) => {
    const u = c.want != null ? c.want : c.wantMin != null && c.wantMax != null ? (c.wantMin + c.wantMax) / 2 : NaN, o = !!c.stale || !Number.isFinite(c.got), d = Math.max(
      o ? 0 : c.got,
      Number.isFinite(u) ? u : 0,
      c.wantMax ?? 0,
      1
    ), f = o ? 0 : c.got / d * 100, m = Number.isFinite(u) ? u / d * 100 : 0;
    return /* @__PURE__ */ s.jsxs("div", { className: `dsc-gotwant-row${o ? " is-stale" : ""}`, children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-gotwant-label", children: c.label }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-gotwant-track", children: [
        Number.isFinite(u) ? /* @__PURE__ */ s.jsx("div", { className: "dsc-gotwant-want", style: { width: `${m}%` } }) : null,
        o ? null : /* @__PURE__ */ s.jsx("div", { className: "dsc-gotwant-got", style: { width: `${f}%` } })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-gotwant-vals", children: [
        /* @__PURE__ */ s.jsxs("span", { children: [
          "Got ",
          o ? "—" : c.got.toFixed(1),
          o ? "" : c.unit || ""
        ] }),
        /* @__PURE__ */ s.jsxs("span", { className: "dsc-muted", children: [
          "Want",
          " ",
          c.wantMin != null && c.wantMax != null ? `${c.wantMin}–${c.wantMax}` : Number.isFinite(u) ? u.toFixed(1) : "—"
        ] })
      ] })
    ] }, c.label);
  }) });
}
function vn(l) {
  if (!l.length) return {};
  let c = l[0].v, u = l[0].v;
  for (const o of l)
    o.v < c && (c = o.v), o.v > u && (u = o.v);
  return { min: c, max: u };
}
const Ls = [
  { label: "Cycle", hours: 12 },
  { label: "Photo", hours: 18 }
];
function Us({
  hours: l,
  setHours: c,
  extras: u
}) {
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-timespan", role: "group", "aria-label": "Chart timespan", children: [
    f0.map((o) => /* @__PURE__ */ s.jsxs(
      "button",
      {
        type: "button",
        className: `dsc-chip${l === o ? " dsc-chip--ok" : ""}`,
        onClick: () => c(o),
        children: [
          o,
          "h"
        ]
      },
      o
    )),
    (u || []).map((o) => /* @__PURE__ */ s.jsx(
      "button",
      {
        type: "button",
        className: `dsc-chip${l === o.hours ? " dsc-chip--ok" : ""}`,
        onClick: () => c(o.hours),
        children: o.label
      },
      o.label
    ))
  ] });
}
function b0({
  open: l,
  onClose: c,
  entityId: u,
  label: o,
  unit: d = "",
  color: f = "var(--dsc-blue)"
}) {
  const { hours: m, setHours: g, maxPoints: p } = Hs(6), v = qe(u || "", { hours: m, maxPoints: p }), b = m <= 18 ? m * 2 : Math.min(m + 24, 48), x = qe(u || "", { hours: b, maxPoints: p }), w = y.useMemo(() => {
    const M = m * 3600 * 1e3, T = Date.now() - M;
    return x.series.filter((k) => k.t < T).map((k) => ({ t: k.t + M, v: k.v }));
  }, [x.series, m]), j = !u || v.series.length < 2;
  return /* @__PURE__ */ s.jsxs(
    Dl,
    {
      open: l && !!u,
      onClose: c,
      title: o ? `History · ${o}` : "History",
      children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: [
          /* @__PURE__ */ s.jsx(Us, { hours: m, setHours: g, extras: Ls }),
          j ? /* @__PURE__ */ s.jsx(F, { label: "Thin recorder", tone: "warn" }) : null,
          w.length > 1 ? /* @__PURE__ */ s.jsx(F, { label: "Prior window ghost", tone: "muted" }) : null
        ] }),
        u ? /* @__PURE__ */ s.jsx(
          gn,
          {
            live: !0,
            unit: d,
            lastSyncAt: v.lastSyncAt,
            series: [
              {
                id: u,
                label: o,
                series: v.series,
                color: f,
                unit: d
              },
              ...w.length > 1 ? [
                {
                  id: `${u}-ghost`,
                  label: `${o} prior`,
                  series: w,
                  color: f,
                  unit: d,
                  ghost: !0
                }
              ] : []
            ]
          }
        ) : null,
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 10, fontSize: 12 }, children: u })
      ]
    }
  );
}
function yc({
  entityId: l,
  hours: c = 24,
  onClick: u,
  label: o = "24h on/off"
}) {
  const { state: d, entity: f } = Se(), { points: m, loading: g } = nv(l, c, 720), p = d(l, "off") === "on" ? 1 : 0, v = Date.now(), b = v - c * 3600 * 1e3, x = y.useMemo(() => {
    const U = m.filter((Y) => Number.isFinite(Y.v));
    return (d(l, "") === "on" || d(l, "") === "off") && U.push({ t: v, v: p }), ev(U, v);
  }, [m, v, p, d, l]), w = y.useMemo(() => {
    const U = [];
    let Y = null;
    for (let P = 0; P < x.length; P++) {
      const Z = x[P], G = Z.v >= 0.5;
      G && Y == null && (Y = Math.max(Z.t, b)), !G && Y != null && (U.push({ start: Y, end: Z.t }), Y = null);
    }
    return Y != null && U.push({ start: Y, end: v }), U.filter((P) => P.end > b && P.end > P.start);
  }, [x, v, b]), j = w.reduce((U, Y) => U + (Y.end - Y.start), 0), M = w.length ? w[w.length - 1].start : null, T = f(l)?.last_changed, k = M ? new Date(M).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : T ? new Date(T).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—", E = /* @__PURE__ */ s.jsxs("div", { className: "dsc-duty-strip", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-duty-meta", children: [
      /* @__PURE__ */ s.jsx("span", { children: o }),
      /* @__PURE__ */ s.jsxs("span", { className: "dsc-muted", children: [
        w.length,
        " cycle",
        w.length === 1 ? "" : "s",
        " · last ",
        k,
        " ·",
        " ",
        g ? "…" : `${(j / 36e5).toFixed(1)}h on`
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("svg", { viewBox: `0 0 ${c} 18`, className: "dsc-duty-svg", preserveAspectRatio: "none", "aria-hidden": !0, children: [
      /* @__PURE__ */ s.jsx("rect", { x: "0", y: "5", width: c, height: "8", rx: "2", fill: "var(--dsc-gray-3)" }),
      w.map((U) => {
        const Y = Math.max(0, (U.start - b) / 36e5), P = Math.max(0.04, (U.end - U.start) / 36e5);
        return /* @__PURE__ */ s.jsx("rect", { x: Y, y: "5", width: P, height: "8", rx: "1.5", fill: "var(--dsc-teal)" }, U.start);
      })
    ] })
  ] });
  return u ? /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-duty-hit", onClick: u, title: `History · ${o}`, children: E }) : E;
}
const _0 = {
  title: "Fleet version",
  what: "A reporting node is missing firmware or is off the expected major.minor train. Planned OOS nodes (AC, clone mister, POT3) are inventory, not this chip.",
  fix: "Open Fleet. Flash the drifted device. If the hole is unbuilt kit, leave in_service off — do not treat it as fail."
}, y0 = {
  title: "Out of service",
  what: "This lever is parked. Planned OOS (unbuilt AC / clone mister / POT3) is inventory. Unexpected OOS is a temp flag or operator lockout.",
  fix: "If the device is built and should run, turn in_service on from Fleet. Temp OOS / lockout: clear the flag after the soak. Unbuilt kit stays OOS — not an alarm."
}, w0 = {
  title: "Hub link",
  what: "The hub is not answering ESP-NOW / HA. Mission holds last-good vitals instead of inventing Got.",
  fix: "Check hub power, SoftAP/Nest channel, and Fleet firmware. Wait out a flap (25s cooldown) before chasing ghosts."
}, j0 = {
  title: "Panel link",
  what: "Control panel is not on ESP-NOW. HA-only is a degraded path, not a green wall.",
  fix: "Confirm Control firmware and ESP-NOW age on Fleet. If Wi-Fi RSSI is live, it is HA-only — not offline."
}, S0 = {
  title: "Heartbeat",
  what: "Hub heartbeat sensor is dark. Beat is the liveness pulse, separate from climate Got.",
  fix: "If hub link is also down, fix the hub first. If link is on but beat is dark, check sensor.dsc_hub_heartbeat and reboot the hub."
}, N0 = {
  title: "Kit node",
  what: "This spoke is inventory: running, idle, planned OOS, missing helper, or dark after the 25s offline cooldown.",
  fix: "OOS: leave it parked if unbuilt. Dark: wait the cooldown, then Fleet. Missing: the helper is not in HA yet."
}, wc = {
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
function dc(l) {
  return {
    [`binary_sensor.dsc_pot${l}_moisture_out_of_range`]: {
      title: `Pot ${l} moisture`,
      what: `Pot ${l} moisture left the Want/Need band.`,
      fix: "Open Root → that pot's inspector. OOS pots must not fake Got."
    },
    [`binary_sensor.dsc_pot${l}_ph_out_of_range`]: {
      title: `Pot ${l} pH`,
      what: `Pot ${l} pH left the Want band.`,
      fix: "Root inspector. Confirm the probe before dosing."
    },
    [`binary_sensor.dsc_pot${l}_root_zone_temp_out_of_range`]: {
      title: `Pot ${l} root T`,
      what: `Pot ${l} soil temperature left the trusted band.`,
      fix: "Mat / lung first. Do not run the mat if this pot is OOS."
    },
    [`binary_sensor.dsc_pot${l}_ec_salt_build_up`]: {
      title: `Pot ${l} salt build-up`,
      what: `Pot ${l} EC is high vs baseline.`,
      fix: "Root card. Flush vs feed from Need, not from a red chip."
    },
    [`binary_sensor.dsc_pot${l}_ec_depleted_vs_baseline`]: {
      title: `Pot ${l} EC depleted`,
      what: `Pot ${l} EC is low vs baseline.`,
      fix: "Feed from Need. Confirm the probe is trusted."
    },
    [`binary_sensor.dsc_pot${l}_nitrogen_below_baseline`]: {
      title: `Pot ${l} N below baseline`,
      what: `Pot ${l} nitrogen is below the rolling baseline.`,
      fix: "Root NPK. Do not act on an untrusted probe."
    },
    [`binary_sensor.dsc_pot${l}_nitrogen_depleting_fast`]: {
      title: `Pot ${l} N depleting`,
      what: `Pot ${l} nitrogen is falling faster than the rate band.`,
      fix: "Root rate spark. Check irrigation vs Need."
    }
  };
}
Object.assign(wc, dc(1), dc(2), dc(3), dc(4));
function k0(l, c) {
  return wc[l] ? wc[l] : c === "fleet" || l === "sensor.dsc_fleet_version_status" ? _0 : c === "kit" ? N0 : l.includes("in_service") || l.endsWith("_oos") ? y0 : l.includes("hub_link") || l.includes("hub_uptime") ? w0 : l.includes("panel_link") || l.includes("control_wifi") ? j0 : l.includes("heartbeat") ? S0 : {
    title: l.split(".").pop()?.replace(/_/g, " ") || "Entity",
    what: "Got from Home Assistant. Click timespan / ghost in this drawer — do not invent a second dashboard.",
    fix: "If the number is wrong, fix the sensor or the Want. If it is unavailable, that is a hole, not a zero."
  };
}
const E0 = Object.keys(wc);
function ba(l) {
  if (!Number.isFinite(l) || l < 0) return "—";
  const c = Math.floor(l / 1e3);
  if (c < 60) return `${Math.max(1, c)}S`;
  const u = Math.floor(c / 60);
  if (u < 60) return `${u}M`;
  const o = Math.floor(u / 60), d = u % 60;
  return o < 48 ? d > 0 ? `${o}H ${d}M` : `${o}H` : `${(o / 24).toFixed(1)}D`;
}
function M0(l, c, u) {
  if (c === "binary" || c === "alert" || l.startsWith("binary_sensor.") || l.startsWith("switch.") || l.startsWith("light."))
    return !0;
  const o = (u || "").toLowerCase();
  return o === "on" || o === "off";
}
function C0({
  target: l,
  onClose: c
}) {
  const { state: u, num: o, available: d, entity: f, callService: m } = Se(), { hours: g, setHours: p, maxPoints: v } = Hs(6), { isSnoozed: b, snooze: x, unsnooze: w } = sv(), j = l?.entityId ?? "", M = j ? u(j, "") : "", T = l ? M0(j, l.kind, M) : !1, k = qe(j, { hours: T ? 24 : g, maxPoints: T ? 288 : v }), E = g <= 18 ? g * 2 : Math.min(g + 24, 48), U = qe(j, { hours: E, maxPoints: v }), Y = y.useMemo(() => {
    const J = g * 3600 * 1e3, A = Date.now() - J;
    return U.series.filter((H) => H.t < A).map((H) => ({ t: H.t + J, v: H.v }));
  }, [U.series, g]);
  if (!l) return null;
  const P = k0(l.entityId, l.kind), Z = f(l.entityId), G = Z?.last_changed ? Date.parse(Z.last_changed) : NaN, Q = Number.isFinite(G) ? ba(Date.now() - G) + " ago" : "—", te = k.series.length < 2, ae = b(l.entityId), xe = l.runtimeToday ? o(l.runtimeToday) : NaN, z = l.cyclesToday ? o(l.cyclesToday) : NaN, W = l.demandEntity, se = l.entityId.split(".")[0], K = se === "switch" || se === "light" || se === "input_boolean";
  return /* @__PURE__ */ s.jsxs(Dl, { open: !!l.entityId, onClose: c, title: l.label, children: [
    /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { marginTop: 0, fontFamily: "var(--dsc-mono)", fontSize: 12 }, children: [
      l.entityId,
      d(l.entityId) ? "" : " · unavailable"
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: [
      /* @__PURE__ */ s.jsx(F, { label: `Last ${Q}`, tone: "muted" }),
      Number.isFinite(xe) ? /* @__PURE__ */ s.jsx(F, { label: `Today ${xe.toFixed(2)}h`, tone: "ok" }) : null,
      Number.isFinite(z) ? /* @__PURE__ */ s.jsx(F, { label: `${Math.round(z)} cycles`, tone: "muted" }) : null,
      /* @__PURE__ */ s.jsx(
        F,
        {
          label: M && M !== "—" ? String(M) : "no state",
          tone: M === "on" ? "ok" : M === "off" ? "muted" : "warn"
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-inspector-playbook", children: [
      /* @__PURE__ */ s.jsx("strong", { children: P.title }),
      /* @__PURE__ */ s.jsx("p", { children: P.what }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: P.fix })
    ] }),
    l.kind === "alert" || l.entityId.startsWith("binary_sensor.") ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { margin: "10px 0" }, children: [
      ae ? /* @__PURE__ */ s.jsx(he, { onClick: () => w(l.entityId), children: "Unsnooze" }) : /* @__PURE__ */ s.jsx(he, { onClick: () => x(l.entityId), children: "Acknowledge until hub reboot" }),
      ae ? /* @__PURE__ */ s.jsx(F, { label: "Snoozed this boot", tone: "warn" }) : null
    ] }) : null,
    K ? /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", style: { marginBottom: 10 }, children: /* @__PURE__ */ s.jsx(
      he,
      {
        primary: !0,
        onClick: () => void m(se, M === "on" ? "turn_off" : "turn_on", {
          entity_id: l.entityId
        }),
        children: M === "on" ? "Turn off" : "Turn on"
      }
    ) }) : null,
    T || W ? /* @__PURE__ */ s.jsx(yc, { entityId: W || l.entityId, hours: 24 }) : null,
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { margin: "12px 0" }, children: [
      /* @__PURE__ */ s.jsx(Us, { hours: g, setHours: p, extras: Ls }),
      te ? /* @__PURE__ */ s.jsx(F, { label: "Thin recorder", tone: "warn" }) : null,
      Y.length > 1 ? /* @__PURE__ */ s.jsx(F, { label: "Prior window ghost", tone: "muted" }) : null
    ] }),
    /* @__PURE__ */ s.jsx(
      gn,
      {
        live: !0,
        unit: T ? "" : l.unit || "",
        lastSyncAt: k.lastSyncAt,
        yDomain: T ? { left: { min: 0, max: 1 } } : void 0,
        emptyLabel: "thin recorder",
        series: [
          {
            id: l.entityId,
            label: l.label,
            series: k.series,
            color: l.color || "var(--dsc-teal)",
            unit: T ? "" : l.unit,
            step: T
          },
          ...Y.length > 1 ? [
            {
              id: `${l.entityId}-ghost`,
              label: `${l.label} prior`,
              series: Y,
              color: l.color || "var(--dsc-teal)",
              unit: l.unit,
              ghost: !0
            }
          ] : []
        ]
      }
    )
  ] });
}
const cv = y.createContext(null);
function T0({ children: l }) {
  const [c, u] = y.useState(null), o = y.useCallback(() => u(null), []), d = y.useCallback((m) => u(m), []), f = y.useMemo(() => ({ open: d, close: o }), [d, o]);
  return /* @__PURE__ */ s.jsxs(cv.Provider, { value: f, children: [
    l,
    /* @__PURE__ */ s.jsx(C0, { target: c, onClose: o })
  ] });
}
function Yn() {
  const l = y.useContext(cv);
  return l || {
    open: () => {
    },
    close: () => {
    }
  };
}
const A0 = {
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
  entityId: l,
  label: c,
  step: u,
  tone: o,
  hint: d,
  onLive: f
}) {
  const { num: m, available: g, callService: p, entity: v } = Se(), b = g(l), x = v(l), w = m(l, NaN), j = Number(x?.attributes?.min ?? 0), M = Number(x?.attributes?.max ?? 100), T = u ?? Number(x?.attributes?.step ?? 0.1), [k, E] = y.useState(String(Number.isFinite(w) ? w : "")), U = y.useRef(!1);
  y.useEffect(() => {
    !U.current && Number.isFinite(w) && E(String(w));
  }, [w]);
  const Y = () => {
    if (!b) return;
    const Z = Number(k);
    if (!Number.isFinite(Z)) {
      E(String(Number.isFinite(w) ? w : ""));
      return;
    }
    const G = Math.min(M, Math.max(j, Z)), te = l.split(".")[0] === "input_number" ? "input_number" : "number";
    p(te, "set_value", { entity_id: l, value: G }), E(String(G));
  }, P = o === "critical" ? "is-bad" : o === "warn" ? "is-warn" : o === "muted" ? "is-muted" : "";
  return /* @__PURE__ */ s.jsxs("label", { className: `dsc-target-num${b ? "" : " is-disabled"} ${P}`.trim(), children: [
    /* @__PURE__ */ s.jsx("span", { className: "dsc-target-num-label", children: c }),
    /* @__PURE__ */ s.jsx(
      "input",
      {
        type: "number",
        value: k,
        disabled: !b,
        min: j,
        max: M,
        step: T,
        onFocus: () => {
          U.current = !0;
        },
        onChange: (Z) => {
          E(Z.target.value);
          const G = Number(Z.target.value);
          Number.isFinite(G) && f?.(G);
        },
        onBlur: () => {
          U.current = !1, Y();
        },
        onKeyDown: (Z) => {
          Z.key === "Enter" && Z.target.blur();
        }
      }
    ),
    d ? /* @__PURE__ */ s.jsx("span", { className: "dsc-target-hint", children: d }) : null
  ] });
}
function mu({ tent: l, title: c, hero: u }) {
  const { num: o, state: d, entity: f } = Se(), m = Yn(), g = A0[l], p = yu(l, { state: d, entity: f }), v = Te(g.gotTemp), b = Te(g.gotRh), x = Te(g.gotVpd), w = v.stale ? NaN : v.value, j = b.stale ? NaN : b.value, M = x.stale ? NaN : x.value, T = o(g.temp), k = o(g.rhMin), E = o(g.rhMax), [U, Y] = y.useState(T), [P, Z] = y.useState(k), [G, Q] = y.useState(E), [te, ae] = y.useState(o(g.vpdMin)), [xe, z] = y.useState(o(g.vpdMax)), W = ga(U, p.temp), se = ga(P, p.rh, P > G), K = ga(G, p.rh, P > G), J = ga(te, p.vpd, te > xe), A = ga(xe, p.vpd, te > xe), H = (I, ve, pe) => {
    m.open({ entityId: I, label: ve, unit: pe });
  };
  return /* @__PURE__ */ s.jsxs("div", { className: `dsc-tent-targets${u ? " is-hero" : ""}`, children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-tent-targets-head", children: [
      /* @__PURE__ */ s.jsx("strong", { children: c }),
      p.mixed ? /* @__PURE__ */ s.jsx(F, { label: "mixed stages", tone: "warn" }) : null,
      p.emptyLabel ? /* @__PURE__ */ s.jsx(F, { label: p.emptyLabel, tone: "muted" }) : null,
      p.stages.map((I) => /* @__PURE__ */ s.jsx(F, { label: I, tone: "muted" }, I)),
      /* @__PURE__ */ s.jsx(
        Mc,
        {
          label: `${c} more`,
          items: [
            { id: "temp", label: "Inspector · temp", onSelect: () => H(g.temp, `${c} Want T`, "°C") },
            { id: "rh", label: "Inspector · RH", onSelect: () => H(g.rhMin, `${c} RH min`, "%") },
            { id: "vpd", label: "Inspector · VPD", onSelect: () => H(g.vpdMin, `${c} VPD min`, "kPa") }
          ]
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs(
      "button",
      {
        type: "button",
        className: "dsc-got-want dsc-got-want-hit",
        onClick: () => H(g.gotTemp, `${c} Got T`, "°C"),
        children: [
          /* @__PURE__ */ s.jsxs("span", { children: [
            "Got ",
            Number.isFinite(w) ? `${w.toFixed(1)}°C` : "—",
            " /",
            " ",
            Number.isFinite(j) ? `${j.toFixed(0)}%` : "—",
            Number.isFinite(M) ? ` / ${M.toFixed(2)} kPa` : ""
          ] }),
          /* @__PURE__ */ s.jsxs("span", { className: "dsc-muted", children: [
            "Want ",
            Number.isFinite(T) ? T.toFixed(1) : "—",
            "°C · RH",
            " ",
            Number.isFinite(k) ? k.toFixed(0) : "—",
            "–",
            Number.isFinite(E) ? E.toFixed(0) : "—",
            "%"
          ] })
        ]
      }
    ),
    p.needs.length ? /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: p.needs.map((I) => /* @__PURE__ */ s.jsx(F, { label: `Need ${I}`, tone: "warn" }, I)) }) : null,
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
      /* @__PURE__ */ s.jsx(Qe, { entityId: g.temp, label: "Temp °C", step: 0.5, tone: W.tone, hint: W.label, onLive: Y }),
      /* @__PURE__ */ s.jsx(Qe, { entityId: g.rhMin, label: "RH min %", step: 1, tone: se.tone, hint: se.label, onLive: Z }),
      /* @__PURE__ */ s.jsx(Qe, { entityId: g.rhMax, label: "RH max %", step: 1, tone: K.tone, hint: K.label, onLive: Q }),
      /* @__PURE__ */ s.jsx(Qe, { entityId: g.vpdMin, label: "VPD min", step: 0.01, tone: J.tone, hint: J.label, onLive: ae }),
      /* @__PURE__ */ s.jsx(Qe, { entityId: g.vpdMax, label: "VPD max", step: 0.01, tone: A.tone, hint: A.label, onLive: z })
    ] })
  ] });
}
function rv({
  compact: l,
  emphasize: c,
  only: u,
  hero: o
}) {
  const d = u ? [u] : c === "clone" ? ["clone", "main"] : ["main", "clone"];
  return o && !u ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-heroes", children: [
    /* @__PURE__ */ s.jsx(mu, { tent: "clone", title: "2×4 climate", hero: !0 }),
    /* @__PURE__ */ s.jsx(mu, { tent: "main", title: "4×8 climate", hero: !0 })
  ] }) : /* @__PURE__ */ s.jsx("div", { className: `dsc-target-panel${l ? " is-compact" : ""}`, children: d.map((f) => /* @__PURE__ */ s.jsx(mu, { tent: f, title: f === "main" ? "4×8 climate" : "2×4 climate", hero: o }, f)) });
}
const mp = [1, 2, 3, 4, 5, 6, 7, 8];
function R0() {
  const { available: l, callService: c, entity: u, num: o, state: d } = Se(), [f, m] = y.useState(null), [g, p] = y.useState(null), [v, b] = y.useState(null), [x, w] = y.useState(null), j = d("input_text.dsc_build_strain", ""), M = d("input_text.dsc_build_nickname", ""), T = d("input_select.dsc_build_assign_pot", "none"), k = o("input_number.dsc_blend_total_l", 20), E = d("input_select.dsc_light_fixture", ""), U = d("input_select.dsc_build_vessel", ""), Y = _u(U || void 0, k), P = o("input_number.dsc_mix_tank_liters", 20), Z = o("input_number.dsc_mix_strength_pct", 100), G = (Number.isFinite(Z) ? Z : 100) / 100, Q = Number.isFinite(P) && P > 0 ? P : 20, te = (K, J) => {
    if (K === "strain")
      b(J), c("input_text", "set_value", { entity_id: "input_text.dsc_build_strain", value: J.name });
    else if (K === "medium") {
      const A = J.composition && typeof J.composition == "object" ? Object.entries(J.composition).filter(([, H]) => Number.isFinite(Number(H)) && Number(H) > 0).slice(0, 3) : [];
      if (A.length)
        for (let H = 1; H <= 3; H++) {
          const I = A[H - 1];
          c("input_text", "set_value", {
            entity_id: `input_text.dsc_blend_component_${H}_name`,
            value: I ? String(I[0]) : ""
          }), c("input_number", "set_value", {
            entity_id: `input_number.dsc_blend_pct_${H}`,
            value: I ? Number(I[1]) : 0
          });
        }
      else
        c("input_text", "set_value", {
          entity_id: "input_text.dsc_blend_component_1_name",
          value: J.name
        });
    } else if (K === "nutrient")
      for (const A of mp) {
        const H = d(`input_text.dsc_nutrient_${A}_name`, ""), I = d(`input_boolean.dsc_nutrient_${A}_in_inventory`) === "on";
        if (!H || H === "unknown" || !I) {
          c("input_text", "set_value", {
            entity_id: `input_text.dsc_nutrient_${A}_name`,
            value: J.name
          }), J.dose_ml_l != null && Number.isFinite(Number(J.dose_ml_l)) && c("input_number", "set_value", {
            entity_id: `input_number.dsc_nutrient_${A}_dose_ml_l`,
            value: Number(J.dose_ml_l)
          }), c("input_boolean", "turn_on", { entity_id: `input_boolean.dsc_nutrient_${A}_in_inventory` });
          break;
        }
      }
    else if (K === "light") {
      w(J);
      const H = (u("input_select.dsc_light_fixture")?.attributes?.options || []).find((I) => I.toLowerCase().includes(String(J.name || "").toLowerCase().slice(0, 18)));
      H ? c("input_select", "select_option", { entity_id: "input_select.dsc_light_fixture", option: H }) : c("input_text", "set_value", { entity_id: "input_text.dsc_light_custom_name", value: J.name });
    }
    m(null);
  }, ae = (K) => {
    const J = Number(K);
    if (!Number.isFinite(J) || K === "none") return;
    const A = bu(J);
    l(A) && c("input_select", "select_option", { entity_id: A, option: Y.id });
  }, xe = () => {
    c("script", "turn_on", { entity_id: "script.dsc_build_plant_commit" });
  }, z = () => {
    if (ae(T), l("script.dsc_build_plant_commit_and_assign")) {
      c("script", "turn_on", { entity_id: "script.dsc_build_plant_commit_and_assign" });
      return;
    }
    c("script", "turn_on", { entity_id: "script.dsc_build_plant_commit" }), c("script", "turn_on", {
      entity_id: "script.dsc_plant_assign_to_pot",
      variables: { pot: T }
    });
  }, W = mp.map((K) => {
    const J = d(`input_text.dsc_nutrient_${K}_name`, ""), A = o(`input_number.dsc_nutrient_${K}_dose_ml_l`, 0), H = o(`input_number.dsc_nutrient_${K}_stock_ml`, 0), I = d(`input_boolean.dsc_nutrient_${K}_in_inventory`) === "on", ve = !J || J === "unknown" || J === "unavailable", pe = !ve && Number.isFinite(A) ? Math.round(A * Q * G * 10) / 10 : 0;
    return { n: K, name: J, dose: A, stock: H, inv: I, empty: ve, ml: pe, short: I && Number.isFinite(H) && H < pe && pe > 0 };
  }), se = W.reduce((K, J) => K + J.ml, 0);
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-compose", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(fe, { className: "dsc-glass", title: "Strain", icon: "roster", children: [
        /* @__PURE__ */ s.jsx(
          cc,
          {
            label: j && j !== "unknown" ? j : "No strain",
            empty: !j || j === "unknown",
            onClick: () => m("strain")
          }
        ),
        v ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { margin: "8px 0" }, children: [
          v.type ? /* @__PURE__ */ s.jsx(F, { label: String(v.type), tone: "muted" }) : null,
          v.height_cm_min != null ? /* @__PURE__ */ s.jsx(
            F,
            {
              label: `${v.height_cm_min}${v.height_cm_max != null ? `–${v.height_cm_max}` : ""}cm`,
              tone: "muted"
            }
          ) : null,
          v.thc_min != null ? /* @__PURE__ */ s.jsx(F, { label: `${v.thc_min}% THC`, tone: "muted" }) : null
        ] }) : null,
        /* @__PURE__ */ s.jsx(vc, { entityId: "input_text.dsc_build_nickname", label: "Nickname" }),
        /* @__PURE__ */ s.jsx(T_, { entityId: "input_datetime.dsc_build_sprout_date", label: "Sprout date" }),
        /* @__PURE__ */ s.jsx(Ya, { entityId: "input_select.dsc_build_custom_slot", label: "Custom strain slot" })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(fe, { className: "dsc-glass", title: "Vessel + mix", icon: "compose", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
          /* @__PURE__ */ s.jsx(xn, { spec: Y, size: 48, label: !0 }),
          /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-chip", onClick: () => m("vessel"), children: Y.label })
        ] }),
        /* @__PURE__ */ s.jsx(e0, { volumeL: Y.volumeL || k }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", style: { marginTop: 8 }, children: /* @__PURE__ */ s.jsx(cc, { label: "Medium search", onClick: () => m("medium"), empty: !0 }) })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(fe, { className: "dsc-glass", title: "Nutrition", icon: "nutrient", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
          /* @__PURE__ */ s.jsx(cc, { label: "Add from catalog", onClick: () => m("nutrient"), empty: !0 }),
          /* @__PURE__ */ s.jsx(F, { label: `Tank ${Q} L`, tone: "muted" }),
          /* @__PURE__ */ s.jsx(F, { label: `${Math.round(G * 100)}% strength`, tone: "muted" }),
          /* @__PURE__ */ s.jsx(F, { label: `${se.toFixed(1)} ml`, tone: se > 0 ? "ok" : "muted" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
          /* @__PURE__ */ s.jsx(Qe, { entityId: "input_number.dsc_mix_tank_liters", label: "Tank L", step: 0.5 }),
          /* @__PURE__ */ s.jsx(Qe, { entityId: "input_number.dsc_mix_strength_pct", label: "Strength %", step: 1 })
        ] }),
        W.map((K) => /* @__PURE__ */ s.jsxs("div", { className: "dsc-nutrient-slot", children: [
          /* @__PURE__ */ s.jsx(vc, { entityId: `input_text.dsc_nutrient_${K.n}_name`, label: `Slot ${K.n}` }),
          /* @__PURE__ */ s.jsx(Qe, { entityId: `input_number.dsc_nutrient_${K.n}_dose_ml_l`, label: "ml/L", step: 0.1 }),
          /* @__PURE__ */ s.jsx("span", { className: "dsc-mono", children: K.empty ? "—" : `${K.ml} ml` }),
          K.short ? /* @__PURE__ */ s.jsx(F, { label: "stock short", tone: "warn" }) : null
        ] }, K.n)),
        /* @__PURE__ */ s.jsx(vc, { entityId: "input_text.dsc_build_recipe_note", label: "Recipe note", multiline: !0 }),
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: "ml = dose × tank × strength. Empty names stay empty — Compose does not invent products." })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(fe, { className: "dsc-glass", title: "Light + assign", icon: "lighting", children: [
        /* @__PURE__ */ s.jsx(
          cc,
          {
            label: E && E !== "unknown" ? E : "No fixture",
            empty: !E || E === "unknown",
            onClick: () => m("light")
          }
        ),
        x ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { margin: "8px 0" }, children: [
          x.wattage_w != null ? /* @__PURE__ */ s.jsx(F, { label: `${x.wattage_w} W`, tone: "muted" }) : null,
          x.efficacy_umol_j != null ? /* @__PURE__ */ s.jsx(F, { label: `${x.efficacy_umol_j} µmol/J`, tone: "muted" }) : null,
          x.has_ppfd || x.ppfd_url ? /* @__PURE__ */ s.jsx(F, { label: "PPFD", tone: "ok" }) : /* @__PURE__ */ s.jsx(F, { label: "No PPFD URL", tone: "warn" })
        ] }) : null,
        /* @__PURE__ */ s.jsx(Ya, { entityId: "input_select.dsc_build_assign_pot", label: "Assign pot", icon: "root" }),
        /* @__PURE__ */ s.jsx(Ya, { entityId: "input_select.dsc_build_climate_pot", label: "Climate apply pot", icon: "climate" }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ s.jsx(he, { primary: !0, onClick: () => p("roster"), children: "Commit roster" }),
          /* @__PURE__ */ s.jsx(he, { teal: !0, onClick: () => p("assign"), children: "Commit + assign" }),
          /* @__PURE__ */ s.jsx(he, { onClick: () => p("seat"), children: "Assign seat" }),
          /* @__PURE__ */ s.jsx(he, { onClick: () => p("mix"), children: "Accept mix" }),
          /* @__PURE__ */ s.jsx(he, { onClick: () => p("climate"), children: "Apply climate Want" })
        ] }),
        /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", style: { marginBottom: 0 }, children: [
          "Confirm overlay writes HA scripts. Coupled mix stays on ",
          /* @__PURE__ */ s.jsx("code", { children: "input_number.dsc_blend_pct_N" }),
          "."
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ s.jsx(
      Ot,
      {
        open: f === "strain" || f === "medium" || f === "nutrient" || f === "light",
        onDismiss: () => m(null),
        title: f ? `Search ${f}` : "Search",
        help: null,
        children: f === "strain" || f === "medium" || f === "nutrient" || f === "light" ? /* @__PURE__ */ s.jsx(Kp, { kind: f, onPick: (K) => te(f, K) }) : null
      }
    ),
    /* @__PURE__ */ s.jsxs(Ot, { open: f === "vessel", onDismiss: () => m(null), title: "Vessel", help: null, children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: Ru.map((K) => /* @__PURE__ */ s.jsxs(
        "button",
        {
          type: "button",
          className: `dsc-chip${K.id === Y.id ? " dsc-chip--ok" : ""}`,
          onClick: () => {
            (u("input_select.dsc_build_vessel")?.attributes?.options || []).includes(K.id) && l("input_select.dsc_build_vessel") && c("input_select", "select_option", {
              entity_id: "input_select.dsc_build_vessel",
              option: K.id
            }), c("input_number", "set_value", {
              entity_id: "input_number.dsc_blend_total_l",
              value: K.volumeL
            }), m(null);
          },
          children: [
            /* @__PURE__ */ s.jsx(xn, { spec: K, size: 28 }),
            " ",
            K.label
          ]
        },
        K.id
      )) }),
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { fontSize: 12 }, children: [
        "Default if helper missing: ",
        Ds.label,
        ". Reload HA after packages load",
        " ",
        /* @__PURE__ */ s.jsx("code", { children: "dsc_v4_vessel.yaml" }),
        "."
      ] }),
      l("input_select.dsc_build_vessel") ? /* @__PURE__ */ s.jsx(F, { label: "Vessel helper", tone: "ok" }) : /* @__PURE__ */ s.jsx(F, { label: "Volume-only until vessel select exists", tone: "warn" })
    ] }),
    /* @__PURE__ */ s.jsx(
      Ot,
      {
        open: g === "roster",
        onDismiss: () => p(null),
        onConfirm: () => {
          xe(), p(null);
        },
        title: "Commit roster",
        confirmLabel: "Write roster",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          "Strain ",
          M || j || "—",
          ". Vessel ",
          Y.label,
          ". Assign helper stays ",
          T,
          ". Runs",
          " ",
          /* @__PURE__ */ s.jsx("code", { children: "script.dsc_build_plant_commit" }),
          "."
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx(
      Ot,
      {
        open: g === "assign",
        onDismiss: () => p(null),
        onConfirm: () => {
          z(), p(null);
        },
        title: "Commit + assign",
        confirmLabel: "Write + assign",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          "Writes roster then assigns pot ",
          T === "none" ? "(none — pick a pot first)" : T,
          ". Copies vessel",
          " ",
          Y.id,
          " onto ",
          /* @__PURE__ */ s.jsx("code", { children: T === "none" ? "—" : bu(Number(T)) }),
          " if that helper exists."
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx(
      Ot,
      {
        open: g === "seat",
        onDismiss: () => p(null),
        onConfirm: () => {
          ae(T), c("script", "turn_on", {
            entity_id: "script.dsc_plant_assign_to_pot",
            variables: { pot: T }
          }), p(null);
        },
        title: "Assign to pot",
        confirmLabel: "Assign now",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          "Assigns current roster plant to pot ",
          T === "none" ? "(none — pick a pot first)" : T,
          " via",
          " ",
          /* @__PURE__ */ s.jsx("code", { children: "script.dsc_plant_assign_to_pot" }),
          ". Does not invent a roster row."
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx(
      Ot,
      {
        open: g === "mix",
        onDismiss: () => p(null),
        onConfirm: () => {
          c("script", "turn_on", { entity_id: "script.dsc_accept_mix" }), p(null);
        },
        title: "Accept mix",
        confirmLabel: "Burn stock",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          se.toFixed(1),
          " ml from tank ",
          Q,
          " L × ",
          Math.round(G * 100),
          "% strength. Runs",
          " ",
          /* @__PURE__ */ s.jsx("code", { children: "script.dsc_accept_mix" }),
          ". Does not invent missing nutrients."
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx(
      Ot,
      {
        open: g === "climate",
        onDismiss: () => p(null),
        onConfirm: () => {
          c("script", "turn_on", { entity_id: "script.dsc_apply_climate_want" }), p(null);
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
const z0 = [
  { id: "strain", label: "Strains" },
  { id: "medium", label: "Mediums" },
  { id: "nutrient", label: "Nutrients" },
  { id: "light", label: "Lights" }
];
function O0(l, c) {
  return Array.isArray(l) && l.length >= 2 ? `${l[0]}–${l[1]}${c}` : l != null && l !== "" ? `${l}${c}` : "";
}
function pp(l, c) {
  const u = l;
  switch (c) {
    case "name":
      return u.name || "—";
    case "type":
      return u.type || "—";
    case "breeder":
      return u.breeder || u.brand || "—";
    case "wantTemp":
      return u.want?.temp_c ? u.want.temp_c.join("–") : "—";
    case "wantRh":
      return u.want?.rh_pct ? u.want.rh_pct.join("–") : "—";
    case "height":
      return O0(u.height_cm, "cm") || (u.height_cm_min != null ? `${u.height_cm_min}${u.height_cm_max != null ? `–${u.height_cm_max}` : ""}cm` : "—");
    case "thc":
      return u.thc_range ? `${u.thc_range.join("–")}%` : u.thc_min != null ? `${u.thc_min}%` : "—";
    case "flowering":
      return u.flowering_days_min != null ? `${u.flowering_days_min}${u.flowering_days_max != null ? `–${u.flowering_days_max}` : ""}d` : "—";
    case "brand":
      return u.brand || "—";
    case "category":
      return u.category || "—";
    case "dose":
      return u.dose_ml_l != null ? `${u.dose_ml_l} ml/L` : "—";
    case "stage":
      return u.stage || "—";
    case "wattage":
      return u.wattage_w != null ? `${u.wattage_w} W` : "—";
    case "ppe":
      return u.efficacy_umol_j != null ? String(u.efficacy_umol_j) : "—";
    case "ppfd":
      return u.has_ppfd || u.ppfd_url ? "yes" : "—";
    case "composition":
      return typeof u.composition == "string" ? u.composition : u.composition && typeof u.composition == "object" && Object.entries(u.composition).map(([o, d]) => `${o} ${d}%`).join(" · ") || "—";
    default: {
      const o = u[c];
      return o != null && o !== "" ? String(o) : "—";
    }
  }
}
function D0(l) {
  switch (l) {
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
      return l;
  }
}
function H0() {
  const { callService: l, state: c } = Se(), u = dt(), [o, d] = y.useState("strain"), [f, m] = y.useState(null), [g, p] = y.useState([]), [v, b] = y.useState(""), x = y.useMemo(() => D0(o), [o]);
  y.useEffect(() => {
    Zp(o, "", c, 8).then((j) => b(j.note));
  }, [o]);
  const w = (j) => {
    j && (o === "strain" ? l("input_text", "set_value", { entity_id: "input_text.dsc_build_strain", value: j.name }) : o === "medium" ? l("input_text", "set_value", {
      entity_id: "input_text.dsc_blend_component_1_name",
      value: j.name
    }) : o === "nutrient" ? l("input_text", "set_value", { entity_id: "input_text.dsc_nutrient_1_name", value: j.name }) : o === "light" && l("input_text", "set_value", { entity_id: "input_text.dsc_light_custom_name", value: j.name }), u("/grow/compose"));
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-research", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: [
      z0.map((j) => /* @__PURE__ */ s.jsx(
        "button",
        {
          type: "button",
          className: `dsc-chip${o === j.id ? " dsc-chip--ok" : ""}`,
          onClick: () => {
            d(j.id), m(null), p([]);
          },
          children: j.label
        },
        j.id
      )),
      /* @__PURE__ */ s.jsx(F, { label: v || "Catalog", tone: v.includes("local") ? "warn" : "ok" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(fe, { className: "dsc-glass", title: "Browse", icon: "research", children: /* @__PURE__ */ s.jsx(Kp, { kind: o, onPick: (j) => m(j) }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(fe, { className: "dsc-glass", title: "Detail", icon: "roster", children: f ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx("h3", { style: { marginTop: 0 }, children: f.name }),
        /* @__PURE__ */ s.jsx("dl", { className: "dsc-detail-list", children: x.map((j) => /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("dt", { children: j.label }),
          /* @__PURE__ */ s.jsx("dd", { children: pp(f, j.key) })
        ] }, j.key)) }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", children: [
          /* @__PURE__ */ s.jsx(he, { primary: !0, onClick: () => w(f), children: "Use in Compose" }),
          /* @__PURE__ */ s.jsx(
            he,
            {
              onClick: () => p(
                (j) => j.some((M) => (M.id || M.name) === (f.id || f.name)) ? j : [...j, f].slice(0, 3)
              ),
              children: "Add compare"
            }
          )
        ] })
      ] }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Pick a row. Missing fields stay blank." }) }) }),
      g.length ? /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(fe, { className: "dsc-glass", title: "Compare", icon: "analytics", children: [
        /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", children: [
          /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("th", { children: "Field" }),
            g.map((j) => /* @__PURE__ */ s.jsx("th", { children: j.name }, j.id || j.name))
          ] }) }),
          /* @__PURE__ */ s.jsx("tbody", { children: x.map((j) => /* @__PURE__ */ s.jsxs("tr", { children: [
            /* @__PURE__ */ s.jsx("td", { children: j.label }),
            g.map((M) => /* @__PURE__ */ s.jsx("td", { children: pp(M, j.key) }, M.id || M.name))
          ] }, j.key)) })
        ] }),
        /* @__PURE__ */ s.jsx(he, { onClick: () => p([]), children: "Clear compare" })
      ] }) }) : null
    ] })
  ] });
}
function L0({ pot: l }) {
  const { available: c, state: u, num: o } = Se(), d = u(`sensor.dsc_pot${l}_expected_stage`, "—"), f = u(`sensor.dsc_pot${l}_days_since_sprout`, "—"), m = u(`sensor.dsc_pot${l}_need_summary`, "—"), g = u(`binary_sensor.dsc_pot${l}_untrusted`) === "on", p = o(`sensor.dsc_pot${l}_dryback_pct`), v = u(`input_select.dsc_pot${l}_tent`, "unassigned"), b = v === "clone" ? u("light.dsc_hub_sf1000_dimmer") === "on" : u("binary_sensor.dsc_hub_4x8_window_open") === "on", x = v === "clone" || v === "main" ? b : !1, w = Number.isFinite(p) && p > 55 ? "dryback stress" : m !== "—" && m !== "ok" ? "Need" : "calm";
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-plant-extra", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
      /* @__PURE__ */ s.jsx(F, { label: x ? "Awake" : "Asleep", tone: x ? "ok" : "muted" }),
      /* @__PURE__ */ s.jsx(F, { label: `Day ${f}`, tone: "muted" }),
      /* @__PURE__ */ s.jsx(F, { label: d === "—" ? "No stage Got" : d, tone: d === "—" ? "muted" : "ok" }),
      /* @__PURE__ */ s.jsx(
        F,
        {
          label: g ? "Need blocked (untrusted)" : w,
          tone: g ? "warn" : w === "calm" ? "ok" : "warn"
        }
      )
    ] }),
    c(`sensor.dsc_pot${l}_expected_stage`) ? null : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: "No cultivar mesh. Missing fields stay empty." })
  ] });
}
function U0(l) {
  if (!l || l === "—") return -1;
  const c = Ip.findIndex((u) => l.indexOf(u) >= 0);
  return c >= 0 ? c : /flower/i.test(l) ? 6 : /veg/i.test(l) ? 3 : /seed/i.test(l) ? 1 : -1;
}
function Bs({ compact: l }) {
  const { state: c, entity: u } = Se(), o = qn.map((M) => ({
    seat: Xa(M, { state: c, entity: u }),
    oos: !kt(M, c)
  })), f = o.filter((M) => !M.oos).map((M) => U0(M.seat.stage)).filter((M) => M >= 0), m = new Set(f).size > 1, g = f.length ? Math.max(...f) : -1, p = c("binary_sensor.dsc_hub_4x8_window_open") === "on", v = c("binary_sensor.dsc_hub_2x4_window_open") === "on", b = c("binary_sensor.dsc_hub_light_catchup_active") === "on", x = c("binary_sensor.dsc_clone_dark_period_violation") === "on", w = c("sensor.dsc_expected_light_hours", "—"), j = c("sensor.dsc_clone_expected_light_hours", "—");
  return /* @__PURE__ */ s.jsxs(fe, { className: "dsc-glass", title: "Crop scheduler", icon: "roster", children: [
    /* @__PURE__ */ s.jsx("div", { className: "dsc-stage-track", "aria-label": "Stage track", children: Ip.map((M, T) => /* @__PURE__ */ s.jsx(
      "span",
      {
        className: `dsc-stage-pill${T === g ? " is-on" : ""}${T === g + 1 ? " is-next" : ""}`,
        children: M.replace("Late (Push) Vegetative", "Push Veg").replace("Final 48-72h Flowering", "Finish").replace("Early Vegetative", "Early Veg").replace("Early Flowering", "Early Flwr").replace("Late Flowering", "Late Flwr")
      },
      M
    )) }),
    m ? /* @__PURE__ */ s.jsx(F, { label: "Mixed stages in tents", tone: "warn" }) : null,
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { margin: "8px 0" }, children: [
      /* @__PURE__ */ s.jsx(F, { label: `4×8 ${p ? "window open" : "dark"} · Want ${w}h`, tone: p ? "ok" : "muted" }),
      /* @__PURE__ */ s.jsx(F, { label: `2×4 ${v ? "window open" : "dark"} · Want ${j}h`, tone: v ? "ok" : "muted" }),
      b ? /* @__PURE__ */ s.jsx(F, { label: "Catch-up", tone: "warn" }) : null,
      x ? /* @__PURE__ */ s.jsx(F, { label: "2×4 dark violation", tone: "bad", pulse: !0 }) : null
    ] }),
    /* @__PURE__ */ s.jsx("div", { className: `dsc-scheduler-lanes${l ? " is-compact" : ""}`, children: o.map(({ seat: M, oos: T }) => {
      const k = Number(M.days), E = Number.isFinite(k) ? Math.max(1, Math.ceil(k / 7)) : null;
      return /* @__PURE__ */ s.jsxs(
        "button",
        {
          type: "button",
          className: `dsc-scheduler-lane${T ? " is-oos" : ""}`,
          disabled: T,
          onClick: () => window.dispatchEvent(new CustomEvent("dsc-dash-select-pot", { detail: { pot: M.pot } })),
          children: [
            /* @__PURE__ */ s.jsx(xn, { spec: _a(M.pot, c, u), size: 16 }),
            /* @__PURE__ */ s.jsxs("strong", { children: [
              "P",
              M.pot
            ] }),
            /* @__PURE__ */ s.jsx("span", { children: T ? "OOS" : M.plantName }),
            /* @__PURE__ */ s.jsx(F, { label: Cc(M.tent), tone: T || M.tent === "unassigned" ? "muted" : "ok" }),
            /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", children: T ? "—" : `W${E ?? "—"} · ${Number.isFinite(k) ? `${k}d` : "—"} · ${M.stage} · Need ${M.need}` })
          ]
        },
        M.pot
      );
    }) })
  ] });
}
function Ac({
  pot: l,
  onSelectPot: c
}) {
  const { hass: u, state: o, entity: d, callService: f, available: m, tick: g, num: p } = Se(), v = dt(), b = Xa(l, { state: o, entity: d }), [x, w] = y.useState(b.plantName === "—" ? "" : b.plantName), [j, M] = y.useState(b.sprout === "—" ? "" : b.sprout), [T, k] = y.useState(b.growthStage === "—" ? "" : b.growthStage), [E, U] = y.useState(b.notes === "—" ? "" : b.notes), [Y, P] = y.useState(null), [Z, G] = y.useState(null);
  y.useEffect(() => {
    w(b.plantName === "—" ? "" : b.plantName), M(b.sprout === "—" ? "" : b.sprout), k(b.growthStage === "—" ? "" : b.growthStage), U(b.notes === "—" ? "" : b.notes), P(null);
  }, [l]);
  const Q = nn(l, "moisture", o), te = nn(l, "ec", o), ae = nn(l, "ph", o), xe = `sensor.dsc_pot${l}_dryback_pct`, z = Te(Q), W = Te(xe), se = Te(te), K = Te(ae), J = qe(Q, { hours: 6, maxPoints: 72 }), A = qe(te, { hours: 6, maxPoints: 72 }), H = p(`input_number.dsc_pot${l}_learned_ec_per_moisture`), I = m(`input_number.dsc_pot${l}_learned_ec_per_moisture`) && Number.isFinite(H) && H !== 0 ? H : NaN, ve = m(`sensor.dsc_pot${l}_want_moisture_min`) ? p(`sensor.dsc_pot${l}_want_moisture_min`) : p(`number.dsc_pot${l}_want_moisture_min`), pe = m(`sensor.dsc_pot${l}_want_moisture_max`) ? p(`sensor.dsc_pot${l}_want_moisture_max`) : p(`number.dsc_pot${l}_want_moisture_max`), N = p(`sensor.dsc_pot${l}_want_ec_min`), $ = p(`sensor.dsc_pot${l}_want_ec_max`), ee = p(`sensor.dsc_pot${l}_want_ph_min`), ne = p(`sensor.dsc_pot${l}_want_ph_max`), re = Number.isFinite(ve) && Number.isFinite(pe) && (m(`sensor.dsc_pot${l}_want_moisture_min`) || m(`number.dsc_pot${l}_want_moisture_min`)), ge = Number.isFinite(N) && Number.isFinite($), _e = Number.isFinite(ee) && Number.isFinite(ne), de = !b.strainDisplay || b.strainDisplay === "—" || /generic/i.test(b.strainDisplay), we = async (oe) => {
    P(null);
    try {
      await f("input_select", "select_option", {
        entity_id: `input_select.dsc_pot${l}_tent`,
        option: oe
      }), window.setTimeout(() => {
        (u?.states?.[`input_select.dsc_pot${l}_tent`]?.state || "") !== oe && P("Tent apply failed — check helper options (clone|main|unassigned).");
      }, 400);
    } catch {
      P("Tent apply failed — check helper options (clone|main|unassigned).");
    }
  }, it = () => {
    m(`text.dsc_pot${l}_plant_name`) && f("text", "set_value", {
      entity_id: `text.dsc_pot${l}_plant_name`,
      value: x
    });
  }, ft = () => {
    const oe = `datetime.dsc_pot${l}_sprout_date`;
    if (!m(oe) || !j) return;
    const Ke = j.length === 10 ? `${j}T00:00:00` : j;
    f("datetime", "set_value", { entity_id: oe, datetime: Ke });
  }, ce = () => {
    if (b.rosterSlot == null) return;
    const oe = `input_text.dsc_plant_roster_${b.rosterSlot}_notes`;
    !m(oe) && d(oe), f("input_text", "set_value", { entity_id: oe, value: E });
  }, tt = d(`select.dsc_pot${l}_growth_stage`)?.attributes?.options || [];
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-seat-panel", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 14 }, children: [
      Ou(o).map((oe) => /* @__PURE__ */ s.jsxs(
        "button",
        {
          type: "button",
          className: `dsc-chip${oe === l ? " dsc-chip--ok" : ""}`,
          onClick: () => c?.(oe),
          children: [
            /* @__PURE__ */ s.jsx(xn, { spec: _a(oe, o, d), size: 16 }),
            " P",
            oe
          ]
        },
        oe
      )),
      /* @__PURE__ */ s.jsx(F, { label: Cc(b.tent), tone: b.tent === "unassigned" ? "muted" : "ok" }),
      b.rosterSlot != null ? /* @__PURE__ */ s.jsx(F, { label: `Roster #${b.rosterSlot}`, tone: "muted" }) : /* @__PURE__ */ s.jsx(F, { label: "No roster join", tone: "warn" }),
      z.stale ? /* @__PURE__ */ s.jsx(F, { label: "HELD Got", tone: "warn" }) : null
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-seat-layout", children: [
      /* @__PURE__ */ s.jsxs(fe, { className: "dsc-glass dsc-glass--glow", title: "Medium", children: [
        /* @__PURE__ */ s.jsx(G_, { layers: b.layers, spec: _a(l, o, d) }),
        /* @__PURE__ */ s.jsx(L0, { pot: l }),
        /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 10, fontSize: 12 }, children: b.blend || "Blend lives on roster after commit — not invented here." })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", style: { gap: 14 }, children: [
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(fe, { className: "dsc-glass", title: "Identity", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-seat-editors", children: [
          /* @__PURE__ */ s.jsxs("label", { children: [
            "Nickname",
            /* @__PURE__ */ s.jsx(
              "input",
              {
                value: x,
                onChange: (oe) => w(oe.target.value),
                onBlur: it,
                disabled: !m(`text.dsc_pot${l}_plant_name`)
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
                onChange: (oe) => M(oe.target.value),
                onBlur: ft,
                disabled: !m(`datetime.dsc_pot${l}_sprout_date`)
              }
            )
          ] }),
          /* @__PURE__ */ s.jsxs("label", { children: [
            "Growth stage",
            /* @__PURE__ */ s.jsxs(
              "select",
              {
                value: T,
                onChange: (oe) => {
                  const Ke = oe.target.value;
                  if (k(Ke), !Ke) return;
                  const rt = `select.dsc_pot${l}_growth_stage`;
                  m(rt) && f("select", "select_option", { entity_id: rt, option: Ke });
                },
                disabled: !m(`select.dsc_pot${l}_growth_stage`),
                children: [
                  /* @__PURE__ */ s.jsx("option", { value: "", children: "—" }),
                  tt.map((oe) => /* @__PURE__ */ s.jsx("option", { value: oe, children: oe }, oe))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
            /* @__PURE__ */ s.jsx(F, { label: `Day ${b.days}`, tone: "ok" }),
            /* @__PURE__ */ s.jsx(F, { label: b.stage, tone: "muted" }),
            /* @__PURE__ */ s.jsx(F, { label: b.strainDisplay, tone: "muted" })
          ] }),
          /* @__PURE__ */ s.jsx(
            Mc,
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
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(fe, { className: "dsc-glass", title: "Want · Got · Need", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
            /* @__PURE__ */ s.jsx(
              F,
              {
                label: `Got M ${z.stale ? `${Number.isFinite(z.value) ? z.value.toFixed(0) : "—"}*` : b.moisture}`,
                tone: z.stale ? "warn" : "ok"
              }
            ),
            /* @__PURE__ */ s.jsx(F, { label: `EC ${b.ec}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(F, { label: `pH ${b.ph}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(
              F,
              {
                label: b.need,
                tone: b.need !== "—" && b.need !== "OK" ? "warn" : "ok"
              }
            )
          ] }),
          re && !de ? /* @__PURE__ */ s.jsx(
            iv,
            {
              rows: [
                {
                  label: "Moisture",
                  got: z.value,
                  stale: z.stale,
                  wantMin: ve,
                  wantMax: pe,
                  unit: "%"
                },
                {
                  label: "EC",
                  got: se.value,
                  stale: se.stale,
                  wantMin: ge ? N : void 0,
                  wantMax: ge ? $ : void 0
                },
                {
                  label: "pH",
                  got: K.value,
                  stale: K.stale,
                  wantMin: _e ? ee : void 0,
                  wantMax: _e ? ne : void 0
                }
              ]
            }
          ) : /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", style: { margin: "8px 0 0" }, children: [
            /* @__PURE__ */ s.jsx(F, { label: "No catalog Want", tone: "warn" }),
            " ",
            de ? "Generic / empty strain — Want bands not invented." : "Custom Want helpers missing — Got + Need only."
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "dsc-kpi-sub", children: "Need is derived (catalog vs Got), not a feed invent." })
        ] }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(fe, { className: "dsc-glass", title: "Dryback", children: /* @__PURE__ */ s.jsx(
          xt,
          {
            label: "Dryback",
            value: W.value,
            min: 0,
            max: 100,
            unit: "%",
            stale: W.stale,
            band: { min: 0, max: 45 },
            onClick: () => G({ id: xe, label: "Dryback", unit: "%" })
          }
        ) }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(fe, { className: "dsc-glass", title: "Got history", children: [
          /* @__PURE__ */ s.jsx(
            gn,
            {
              live: !0,
              lastSyncAt: Math.max(J.lastSyncAt ?? 0, A.lastSyncAt ?? 0) || void 0,
              series: [
                {
                  id: "m",
                  label: "Moisture",
                  series: J.series,
                  color: "var(--dsc-blue)",
                  axis: "left",
                  unit: "%"
                },
                {
                  id: "ec",
                  label: "EC",
                  series: A.series,
                  color: "var(--dsc-amber)",
                  axis: "right",
                  unit: ""
                }
              ]
            }
          ),
          /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: Number.isFinite(I) ? `EC consumption honesty: learned ${I.toFixed(3)} EC per moisture (not feed invent).` : "EC over time shown — no learned_ec_per_moisture yet (not invented)." }),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginTop: 8 }, children: [
            /* @__PURE__ */ s.jsx(he, { onClick: () => G({ id: Q, label: "Moisture", unit: "%" }), children: "Moisture hist" }),
            /* @__PURE__ */ s.jsx(he, { onClick: () => G({ id: te, label: "EC", unit: "" }), children: "EC hist" }),
            /* @__PURE__ */ s.jsx(he, { onClick: () => G({ id: ae, label: "pH", unit: "" }), children: "pH hist" })
          ] })
        ] }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(fe, { className: "dsc-glass", title: "Nutrition", children: [
          /* @__PURE__ */ s.jsx("p", { style: { margin: "0 0 6px" }, children: b.recipe || "No roster recipe — catalog doses only, never invented." }),
          /* @__PURE__ */ s.jsxs("label", { className: "dsc-seat-editors", children: [
            "Roster notes",
            /* @__PURE__ */ s.jsx(
              "textarea",
              {
                rows: 3,
                value: E,
                onChange: (oe) => U(oe.target.value),
                onBlur: ce,
                disabled: b.rosterSlot == null
              }
            )
          ] }),
          /* @__PURE__ */ s.jsx("div", { style: { marginTop: 10 }, children: /* @__PURE__ */ s.jsx(Rs, { to: "/grow/compose", children: /* @__PURE__ */ s.jsx(he, { teal: !0, children: "Mix in Compose" }) }) })
        ] }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(fe, { className: "dsc-glass", title: "Live Got chips", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
            /* @__PURE__ */ s.jsx(F, { label: `M ${b.moisture}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(F, { label: `T ${b.soilTemp}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(F, { label: `EC ${b.ec}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(F, { label: `pH ${b.ph}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(F, { label: `N ${b.n}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(F, { label: `P ${b.p}`, tone: "muted" }),
            /* @__PURE__ */ s.jsx(F, { label: `K ${b.k}`, tone: "muted" })
          ] }),
          /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: "NPK = trend indicators. Unavailable stays —. Held shows last good on blip." })
        ] }) }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(fe, { className: "dsc-glass", title: "Apply to tent", children: [
          /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "Digital-twin placement. Moves the plant on Twin; does not rewrite climate Want." }),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-seat-actions", children: [
            /* @__PURE__ */ s.jsx(he, { primary: b.tent === "clone", onClick: () => void we("clone"), children: "2×4" }),
            /* @__PURE__ */ s.jsx(he, { primary: b.tent === "main", onClick: () => void we("main"), children: "4×8" }),
            /* @__PURE__ */ s.jsx(he, { onClick: () => void we("unassigned"), children: "Unassigned" }),
            /* @__PURE__ */ s.jsx(Rs, { to: "/live/twin", children: /* @__PURE__ */ s.jsx(he, { children: "Open Twin" }) })
          ] }),
          Y ? /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
            /* @__PURE__ */ s.jsx(F, { label: "Tent apply failed", tone: "bad" }),
            " ",
            Y
          ] }) : null
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ s.jsx(
      b0,
      {
        open: Z != null,
        onClose: () => G(null),
        entityId: Z?.id ?? null,
        label: Z?.label ?? "",
        unit: Z?.unit
      }
    )
  ] });
}
function B0() {
  const l = dt();
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Yt,
      {
        icon: "compose",
        title: "Compose",
        subtitle: "Build soil blend, roster commit, and Want handoff.",
        primaryAction: /* @__PURE__ */ s.jsx(he, { teal: !0, onClick: () => l("/grow/roster"), children: "Open Roster / Seat" }),
        actions: /* @__PURE__ */ s.jsx(he, { primary: !0, onClick: () => l("/grow/research"), children: "Browse Catalog" })
      }
    ),
    /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Densified catalog traits (height / flowering / chem) show when the index has them. Empty catalog fields stay empty — Compose does not invent Want bands or strain genetics. After commit, open Roster to assign a seat." }),
    /* @__PURE__ */ s.jsx(R0, {})
  ] });
}
function $0() {
  const l = dt();
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Yt,
      {
        icon: "research",
        title: "Research",
        subtitle: "Live CannaLib catalog — strains, mediums, nutrients, and lights.",
        actions: /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(he, { primary: !0, onClick: () => l("/grow/compose"), children: "Use in Compose" }),
          /* @__PURE__ */ s.jsx(he, { teal: !0, onClick: () => l("/grow/roster"), children: "Open Seat" })
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Catalog gaps are honesty, not placeholders. Height / flowering / chem chips come from densified indexes when present. Use in Compose to draft a plant; Open Seat to assign an existing roster row — neither invents missing Want/Got." }),
    /* @__PURE__ */ s.jsx(H0, {})
  ] });
}
function G0() {
  const { entity: l, state: c, tick: u } = Se(), [o, d] = Ec(), f = q_(l), m = Number(o.get("pot") || 0), g = m >= 1 && m <= 4 && kt(m, c) ? m : null, p = (b) => {
    if (!kt(b, c)) return;
    const x = new URLSearchParams(o);
    x.set("pot", String(b)), d(x, { replace: !0 });
  }, v = () => {
    const b = new URLSearchParams(o);
    b.delete("pot"), d(b, { replace: !0 });
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Yt,
      {
        icon: "roster",
        title: "Roster",
        subtitle: "Seats — open a row for Plant Seat drawer. Nutrient mix lives in Compose.",
        primaryAction: /* @__PURE__ */ s.jsx(Rs, { to: "/grow/compose", children: /* @__PURE__ */ s.jsx(he, { primary: !0, children: "Use in Compose" }) })
      }
    ),
    /* @__PURE__ */ s.jsx("div", { style: { marginBottom: 14 }, children: /* @__PURE__ */ s.jsx(Bs, { compact: !0 }) }),
    /* @__PURE__ */ s.jsx(fe, { className: "dsc-glass", title: "Roster", icon: "roster", children: f.length ? /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", children: [
      /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
        /* @__PURE__ */ s.jsx("th", { children: "Slot" }),
        /* @__PURE__ */ s.jsx("th", { children: "Name" }),
        /* @__PURE__ */ s.jsx("th", { children: "Strain" }),
        /* @__PURE__ */ s.jsx("th", { children: "Status" }),
        /* @__PURE__ */ s.jsx("th", { children: "Pot" }),
        /* @__PURE__ */ s.jsx("th", { children: "Need" }),
        /* @__PURE__ */ s.jsx("th", { children: "Tent" })
      ] }) }),
      /* @__PURE__ */ s.jsx("tbody", { children: f.map((b) => {
        const x = Number(b.pot), w = x >= 1 && x <= 4, j = w && kt(x, c), M = w ? Cc(bc(c, x)) : "—", T = w ? c(`sensor.dsc_pot${x}_need_summary`, "—") : "—", k = w ? _a(x, c, l) : null;
        return /* @__PURE__ */ s.jsxs(
          "tr",
          {
            onClick: () => {
              j && p(x);
            },
            style: j ? { cursor: "pointer" } : void 0,
            children: [
              /* @__PURE__ */ s.jsxs("td", { children: [
                "#",
                b.slot
              ] }),
              /* @__PURE__ */ s.jsx("td", { children: b.nickname || "—" }),
              /* @__PURE__ */ s.jsx("td", { children: b.strain || "—" }),
              /* @__PURE__ */ s.jsx("td", { children: b.status || "—" }),
              /* @__PURE__ */ s.jsx("td", { children: w ? /* @__PURE__ */ s.jsxs("span", { className: "dsc-chip-row", children: [
                k ? /* @__PURE__ */ s.jsx(xn, { spec: k, size: 22 }) : null,
                "P",
                x,
                j ? null : /* @__PURE__ */ s.jsx(F, { label: "OOS", tone: "warn" })
              ] }) : "—" }),
              /* @__PURE__ */ s.jsx("td", { children: T }),
              /* @__PURE__ */ s.jsx("td", { children: /* @__PURE__ */ s.jsx(F, { label: M, tone: "muted" }) })
            ]
          },
          b.slot
        );
      }) })
    ] }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "No plants in roster yet. Commit from Compose, then assign a pot." }) }),
    /* @__PURE__ */ s.jsx(
      Dl,
      {
        open: g != null,
        onClose: v,
        title: g != null ? `Plant seat · POT${g}` : "Plant seat",
        children: g != null ? /* @__PURE__ */ s.jsx(Ac, { pot: g, onSelectPot: p }) : null
      }
    )
  ] });
}
function F0() {
  const [l, c] = y.useState(null), u = dt(), o = jt();
  y.useEffect(() => {
    const m = (g) => {
      const p = g.detail, v = Number(p?.pot);
      v >= 1 && v <= 4 && c(v);
    };
    return window.addEventListener("dsc-dash-select-pot", m), () => window.removeEventListener("dsc-dash-select-pot", m);
  }, []);
  const d = y.useCallback(() => c(null), []);
  return /* @__PURE__ */ s.jsx(
    Ot,
    {
      open: l != null,
      onDismiss: d,
      title: l != null ? `Plant seat · POT${l}` : "Plant seat",
      help: null,
      children: l != null ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx(Ac, { pot: l, onSelectPot: c }),
        o.pathname !== "/live/root" ? /* @__PURE__ */ s.jsx("div", { className: "dsc-row-actions", style: { marginTop: 12 }, children: /* @__PURE__ */ s.jsx(
          he,
          {
            teal: !0,
            onClick: () => {
              const m = l;
              d(), u(`/live/root?pot=${m}`);
            },
            children: "Open Root"
          }
        ) }) : null
      ] }) : null
    }
  );
}
const ov = y.createContext(null);
function q0(l) {
  return l === "clone" || l === "compare" || l === "room" || l === "main" ? l : "main";
}
function Y0({ children: l }) {
  const [c, u] = Ec(), o = q0(c.get("tent") ?? c.get("zone")), d = y.useCallback(
    (m) => {
      const g = new URLSearchParams(c);
      g.set("tent", m), g.delete("zone"), u(g, { replace: !0 });
    },
    [c, u]
  ), f = y.useMemo(() => ({ focus: o, setFocus: d }), [o, d]);
  return /* @__PURE__ */ s.jsx(ov.Provider, { value: f, children: l });
}
function uv() {
  const l = y.useContext(ov);
  return l || {
    focus: "main",
    setFocus: () => {
    }
  };
}
function dv() {
  const { available: l, state: c } = Se(), u = c("binary_sensor.dsc_hub_link") === "on", o = l("binary_sensor.dsc_hub_link"), d = c("sensor.dsc_hub_api_down_age", "—"), f = c("sensor.dsc_hub_link_recovery_bounces", "—"), m = c("sensor.dsc_hub_rf_status", "—"), g = c("sensor.dsc_hub_ha_handshake_age", "—");
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
    /* @__PURE__ */ s.jsx(
      F,
      {
        icon: u ? "ok" : "alert",
        label: o ? u ? "HUB LINK" : "HUB LINK DOWN" : "HUB LINK —",
        tone: u ? "ok" : "bad"
      }
    ),
    /* @__PURE__ */ s.jsx(F, { label: `Age ${d}`, tone: "muted" }),
    /* @__PURE__ */ s.jsx(F, { label: `Bounces ${f}`, tone: "muted" }),
    /* @__PURE__ */ s.jsx(F, { label: `RF ${m}`, tone: "muted" }),
    /* @__PURE__ */ s.jsx(F, { label: `Handshake ${g}`, tone: "muted" })
  ] });
}
const V0 = "_allocated";
function wt(l, c, u) {
  const o = u.num(c);
  return u.forceKind === "mass-balance" ? {
    value: u.num(l, o),
    kind: "mass-balance",
    entityId: l,
    nameplate: Number.isFinite(o) ? o : void 0
  } : u.available(l) && Number.isFinite(u.num(l)) ? {
    value: u.num(l),
    kind: l.endsWith(V0) ? "allocated" : "nameplate",
    entityId: l,
    nameplate: Number.isFinite(o) ? o : void 0
  } : {
    value: o,
    kind: "nameplate",
    entityId: c,
    nameplate: Number.isFinite(o) ? o : void 0
  };
}
function Hu({ readings: l }) {
  const c = l.some((o) => o.kind === "nameplate"), u = l.some((o) => o.kind === "allocated" || o.kind === "mass-balance");
  return c && !u ? /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { margin: "0 0 8px" }, children: "CFM guessed from fan % × nameplate — run Learning to measure." }) : c && u ? /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { margin: "0 0 8px" }, children: "Mixed CFM trust — some ducts from Learning, others still nameplate. Run Learning on the dashed paths." }) : /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { margin: "0 0 8px" }, children: "CFM from Learning (anemometer)." });
}
const X0 = [
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
  ...qn.map(
    (l) => ({
      id: `pot${l}`,
      label: `Pot ${l}`,
      inServiceEntity: `input_boolean.dsc_pot${l}_in_service`,
      plannedWhenOff: l === 3,
      firmwareEntity: `sensor.dsc_pot${l}_firmware_version`
    })
  ),
  {
    id: "tank",
    label: "Tank",
    inServiceEntity: "input_boolean.dsc_tank_in_service",
    plannedWhenOff: !0
  }
];
function Q0(l) {
  return l.linkEntity || l.relayEntity || l.demandEntity || l.inServiceEntity || l.firmwareEntity || "";
}
function Z0(l, c, u) {
  const o = Q0(l);
  if (l.id === "hub") {
    const p = c.available("binary_sensor.dsc_hub_link"), v = c.state("binary_sensor.dsc_hub_link") === "on", b = u("binary_sensor.dsc_hub_link");
    let x = "missing";
    return p && b || p && !b ? x = v ? "ok" : "dark" : x = "missing", {
      id: l.id,
      label: l.label,
      status: x,
      entityId: "binary_sensor.dsc_hub_link",
      firmwareEntity: l.firmwareEntity
    };
  }
  if (l.inServiceEntity) {
    const p = c.available(l.inServiceEntity), v = l.id.startsWith("pot") && l.id.length === 4 ? kt(Number(l.id.slice(3)), c.state) : c.state(l.inServiceEntity) === "on";
    if (p && !v)
      return {
        id: l.id,
        label: l.label,
        status: "oos",
        subtitle: l.plannedWhenOff ? "Not built / parked" : "Out of service",
        entityId: l.inServiceEntity,
        inServiceEntity: l.inServiceEntity,
        plannedOos: l.plannedWhenOff,
        runtimeToday: l.runtimeToday,
        cyclesToday: l.cyclesToday,
        demandEntity: l.demandEntity,
        firmwareEntity: l.firmwareEntity
      };
  }
  const d = l.relayEntity || l.demandEntity || l.firmwareEntity || l.inServiceEntity || "", f = d ? c.available(d) : !0, m = d ? u(d) : !0;
  if (!f && !m)
    return {
      id: l.id,
      label: l.label,
      status: "missing",
      entityId: d || o,
      inServiceEntity: l.inServiceEntity,
      runtimeToday: l.runtimeToday,
      cyclesToday: l.cyclesToday,
      demandEntity: l.demandEntity,
      firmwareEntity: l.firmwareEntity
    };
  if (d && !m)
    return {
      id: l.id,
      label: l.label,
      status: "dark",
      subtitle: "Dark",
      entityId: d,
      inServiceEntity: l.inServiceEntity,
      runtimeToday: l.runtimeToday,
      cyclesToday: l.cyclesToday,
      demandEntity: l.demandEntity,
      firmwareEntity: l.firmwareEntity
    };
  const g = l.demandEntity && c.state(l.demandEntity) === "on" || l.relayEntity && c.state(l.relayEntity) === "on";
  return {
    id: l.id,
    label: l.label,
    status: g ? "ok" : "idle",
    subtitle: g ? "Running" : "Idle",
    entityId: l.demandEntity || l.relayEntity || d || o,
    inServiceEntity: l.inServiceEntity,
    runtimeToday: l.runtimeToday,
    cyclesToday: l.cyclesToday,
    demandEntity: l.demandEntity,
    firmwareEntity: l.firmwareEntity
  };
}
function fv(l, c) {
  return X0.map((u) => Z0(u, l, c));
}
function hv(l) {
  const c = l.filter((d) => d.id !== "hub"), u = c.filter((d) => d.status === "oos" || d.status === "missing"), o = c.filter((d) => d.status === "dark").length;
  return {
    inService: c.length - u.length,
    total: c.length,
    dark: o
  };
}
function K0(l, c) {
  switch (l) {
    case "ok":
      return c;
    case "idle":
      return `${c} idle`;
    case "held":
      return `${c} HELD`;
    case "oos":
      return `${c} OOS`;
    case "missing":
      return `${c} missing`;
    case "dark":
      return `${c} dark`;
    default:
      return l;
  }
}
function J0(l) {
  switch (l) {
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
      return l;
  }
}
const vp = { w: 720, h: 400 }, Rl = { x: 360, y: 188 };
function gp(l, c, u) {
  if (l === "hub") return Rl;
  const o = 148, d = c / Math.max(u, 1) * Math.PI * 2 - Math.PI / 2;
  return { x: Rl.x + Math.cos(d) * o, y: Rl.y + Math.sin(d) * o };
}
function xp(l) {
  switch (l) {
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
      return l;
  }
}
function mv({
  nodes: l,
  onSelect: c
}) {
  const u = l.find((d) => d.id === "hub"), o = l.filter((d) => d.id !== "hub");
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-kit-pulse", children: [
    /* @__PURE__ */ s.jsxs("svg", { viewBox: `0 0 ${vp.w} ${vp.h}`, className: "dsc-kit-constellation", "aria-label": "Kit pulse", children: [
      o.map((d, f) => {
        const m = gp(d.id, f, o.length), g = d.status === "oos" || d.status === "missing" || d.status === "dark";
        return /* @__PURE__ */ s.jsx(
          "line",
          {
            x1: Rl.x,
            y1: Rl.y,
            x2: m.x,
            y2: m.y,
            stroke: xp(u?.status === "ok" && !g ? "ok" : d.status),
            strokeWidth: "1.2",
            strokeDasharray: g || u?.status !== "ok" ? "4 4" : void 0,
            opacity: 0.7
          },
          `edge-${d.id}`
        );
      }),
      l.map((d) => {
        const f = d.id === "hub" ? Rl : gp(d.id, o.findIndex((v) => v.id === d.id), o.length), m = d.status === "oos" || d.status === "missing" || d.status === "dark", g = d.status === "idle", p = d.label.replace("Pot ", "P").replace("Clone mister", "Mister").replace("Dehumidifier", "Dehum").replace("Humidifier", "Hum");
        return /* @__PURE__ */ s.jsxs(
          "g",
          {
            transform: `translate(${f.x},${f.y})`,
            role: c ? "button" : void 0,
            tabIndex: c ? 0 : void 0,
            style: { cursor: c ? "pointer" : void 0 },
            onClick: () => c?.(d),
            onKeyDown: (v) => {
              (v.key === "Enter" || v.key === " ") && (v.preventDefault(), c?.(d));
            },
            children: [
              /* @__PURE__ */ s.jsx(
                "circle",
                {
                  r: d.id === "hub" ? 22 : 16,
                  fill: m || g ? "none" : "rgba(38,198,218,0.12)",
                  stroke: xp(d.status),
                  strokeWidth: "1.8",
                  strokeDasharray: m ? "4 3" : void 0
                }
              ),
              /* @__PURE__ */ s.jsx("text", { textAnchor: "middle", y: "4", fill: "currentColor", fontSize: "9", children: p })
            ]
          },
          d.id
        );
      })
    ] }),
    /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: l.map((d) => /* @__PURE__ */ s.jsx(
      F,
      {
        label: K0(d.status, d.label),
        tone: J0(d.status),
        onClick: c ? () => c(d) : void 0
      },
      d.id
    )) })
  ] });
}
const W0 = 25e3;
function pv(l = W0) {
  const { available: c, tick: u } = Se(), o = y.useRef({}), [, d] = y.useState(() => Date.now());
  return y.useEffect(() => {
    const f = window.setInterval(() => d(Date.now()), 1e3);
    return () => window.clearInterval(f);
  }, []), y.useCallback(
    (f) => {
      if (!f) return !1;
      if (c(f))
        return o.current[f] = Date.now(), !0;
      const m = o.current[f];
      return m == null ? !1 : Date.now() - m < l;
    },
    [c, l, u]
  );
}
function P0() {
  const { state: l, num: c, available: u, entity: o, tick: d } = Se(), f = dt(), [m, g] = y.useState(!1), p = pv(), { isSnoozed: v } = sv(), b = Yn(), x = p("sensor.dsc_hub_uptime"), w = n0(), j = a0(), M = l0(), T = c("sensor.dsc_active_alert_count", 0), k = Te("sensor.dsc_hub_tent_temperature"), E = Te("sensor.dsc_hub_tent_humidity"), U = Te("sensor.dsc_hub_vpd_kpa"), Y = Te("sensor.dsc_hub_clone_temperature"), P = Te("sensor.dsc_hub_clone_humidity"), Z = Te("sensor.dsc_hub_clone_vpd_kpa"), G = Te("sensor.dsc_pot1_got_moisture"), Q = Te("sensor.dsc_pot2_got_moisture"), te = Te("sensor.dsc_pot3_got_moisture"), ae = Te("sensor.dsc_pot4_got_moisture"), xe = [G, Q, te, ae], W = l("binary_sensor.dsc_hub_panel_link") === "on", se = l("sensor.dsc_hub_heartbeat", "NO BEAT"), K = p("sensor.dsc_hub_heartbeat"), J = l("switch.dsc_hub_manual_takeover") === "on", A = l("switch.dsc_hub_tent_manual_override") === "on", H = l("switch.dsc_hub_tent_full_auto_mode") === "on", I = l("binary_sensor.dsc_reduced_kit") === "on", ve = String(o("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? ""), pe = H && !J, N = l("sensor.dsc_fleet_version_status", "—"), $ = E0.filter((ce) => l(ce) === "on" && !v(ce)).map((ce) => ({
    id: ce,
    label: ce.split(".").pop()?.replace(/dsc_/, "").replace(/_/g, " ") || ce
  })), ee = qn.map((ce) => Xa(ce, { state: l, entity: o })), ne = fv({ state: l, available: u }, p), re = hv(ne), ge = wt("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available: u,
    num: c
  }), _e = p("binary_sensor.dsc_hub_panel_link") || W, de = !W && u("sensor.dsc_control_wifi_rssi"), we = !W && !de && !_e, it = k.stale || E.stale || U.stale || Y.stale || P.stale || Z.stale, ft = (ce) => b.open({
    entityId: ce.entityId,
    label: ce.label,
    kind: "kit",
    runtimeToday: ce.runtimeToday,
    cyclesToday: ce.cyclesToday,
    demandEntity: ce.demandEntity
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Yt,
      {
        icon: "mission",
        title: "Mission",
        subtitle: "Triage glance — Next, faults, seats, lung. Command lives on Climate.",
        primaryAction: /* @__PURE__ */ s.jsx(he, { teal: !0, onClick: () => f("/live/twin"), children: "Open Twin" }),
        actions: /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(he, { primary: !0, onClick: () => f("/live/climate"), children: "Climate Want" }),
          /* @__PURE__ */ s.jsx(zu, { label: "Search", icon: "search", onClick: () => g(!0) }),
          /* @__PURE__ */ s.jsx(
            Mc,
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
        F,
        {
          icon: x ? "ok" : "alert",
          label: x ? "HUB ONLINE" : "HUB OFFLINE",
          tone: x ? "ok" : "bad",
          onClick: () => b.open({ entityId: "binary_sensor.dsc_hub_link", label: "Hub", kind: "kit" })
        }
      ),
      x ? null : /* @__PURE__ */ s.jsx(
        F,
        {
          label: `OFF ${w != null ? ba(w) : "—"}`,
          tone: "bad",
          pulse: !0
        }
      ),
      it ? /* @__PURE__ */ s.jsx(F, { label: "HELD VITALS", tone: "warn" }) : null,
      /* @__PURE__ */ s.jsx(
        F,
        {
          label: `${re.inService} of ${re.total} in service`,
          tone: re.dark > 0 ? "bad" : "ok",
          onClick: () => f("/fleet")
        }
      ),
      /* @__PURE__ */ s.jsx(
        F,
        {
          label: W ? "PANEL ESP-NOW" : de ? "PANEL HA-ONLY" : we ? "PANEL OFFLINE" : "PANEL…",
          tone: W ? "ok" : de ? "warn" : "bad",
          onClick: () => b.open({ entityId: "binary_sensor.dsc_hub_panel_link", label: "Panel link", kind: "kit" })
        }
      ),
      we ? /* @__PURE__ */ s.jsx(
        F,
        {
          label: `PANEL OFF ${M != null ? ba(M) : "—"}`,
          tone: "bad",
          pulse: !0
        }
      ) : null,
      /* @__PURE__ */ s.jsx(
        F,
        {
          icon: K ? "ok" : "alert",
          label: K ? `BEAT ${se}` : "NO BEAT",
          tone: K ? "ok" : "bad",
          onClick: () => b.open({ entityId: "sensor.dsc_hub_heartbeat", label: "Heartbeat", kind: "kit" })
        }
      ),
      K ? null : /* @__PURE__ */ s.jsx(F, { label: `BEAT OFF ${j != null ? ba(j) : "—"}`, tone: "bad", pulse: !0 }),
      /* @__PURE__ */ s.jsx(
        F,
        {
          icon: $.length === 0 ? "ok" : "alert",
          label: $.length === 0 ? "All clear" : `${$.length} alert(s)`,
          tone: $.length === 0 ? "ok" : "bad",
          pulse: $.length > 0,
          onClick: () => {
            const ce = $[0];
            b.open({
              entityId: ce?.id || "sensor.dsc_active_alert_count",
              label: ce?.label || "Alerts",
              kind: "alert"
            });
          }
        }
      ),
      /* @__PURE__ */ s.jsx(
        F,
        {
          label: N === "ok" ? "FLEET OK" : N === "warn" ? "FLEET WARN" : "FLEET DRIFT",
          tone: N === "ok" ? "ok" : N === "warn" ? "warn" : "bad",
          onClick: () => b.open({
            entityId: "sensor.dsc_fleet_version_status",
            label: "Fleet version",
            kind: "fleet"
          })
        }
      ),
      H ? /* @__PURE__ */ s.jsx(F, { icon: "ok", label: "FULL AUTO", tone: "ok", pulse: !0 }) : null,
      pe ? /* @__PURE__ */ s.jsx(F, { label: "AUTO-DRIVEN", tone: "ok" }) : null,
      J ? /* @__PURE__ */ s.jsx(F, { icon: "alert", label: "MANUAL TAKEOVER", tone: "warn", pulse: !0 }) : null,
      A ? /* @__PURE__ */ s.jsx(F, { icon: "alert", label: "FAN OVERRIDE", tone: "warn", pulse: !0 }) : null,
      H && I ? /* @__PURE__ */ s.jsx(
        F,
        {
          icon: "alert",
          label: ve || "UNEXPECTED OOS",
          tone: "warn",
          pulse: !0,
          onClick: () => b.open({
            entityId: "binary_sensor.dsc_reduced_kit",
            label: "Unexpected OOS",
            kind: "alert"
          })
        }
      ) : null
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid dsc-mission-modern", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(O_, {}) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(fe, { className: "dsc-glass", title: "Hub link", icon: "fleet", children: /* @__PURE__ */ s.jsx(dv, {}) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(fe, { className: "dsc-glass", title: "Kit pulse", icon: "ok", children: /* @__PURE__ */ s.jsx(mv, { nodes: ne, onSelect: ft }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(fe, { className: "dsc-glass", title: "Lung CFM", icon: "climate", children: [
        /* @__PURE__ */ s.jsx(Hu, { readings: [ge] }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: /* @__PURE__ */ s.jsxs("button", { type: "button", className: "dsc-chip", onClick: () => f("/live/climate"), children: [
          "OUT ",
          Number.isFinite(ge.value) ? Math.round(ge.value) : "—",
          " cfm → Climate"
        ] }) })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(fe, { className: "dsc-glass", title: "Plant seats", icon: "seat", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: ee.map((ce) => {
        const tt = !kt(ce.pot, l), oe = Tc(ce.pot, l), Ke = xe[ce.pot - 1], rt = !tt && !oe.blockNeedAct && ce.need && ce.need !== "—" && ce.need !== "ok";
        return /* @__PURE__ */ s.jsxs(
          "button",
          {
            type: "button",
            className: `dsc-chip${tt ? "" : " dsc-chip--ok"}${rt ? " dsc-chip--pulse" : ""}`,
            onClick: () => window.dispatchEvent(new CustomEvent("dsc-dash-select-pot", { detail: { pot: ce.pot } })),
            title: tt ? "OOS — no fake Got" : ce.need,
            children: [
              /* @__PURE__ */ s.jsx(xn, { spec: _a(ce.pot, l, o), size: 18 }),
              "P",
              ce.pot,
              " ",
              ce.plantName !== "—" ? ce.plantName : "—",
              " · Got M",
              " ",
              tt ? "—" : Ke.stale ? `${Number.isFinite(Ke.value) ? Ke.value.toFixed(0) : "—"}*` : ce.moisture,
              tt ? " · OOS" : ` · Need ${ce.need}`,
              Ke.stale && !tt ? " · HELD" : "",
              oe.labels.length ? ` · ${oe.labels.join("/")}` : ""
            ]
          },
          ce.pot
        );
      }) }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(fe, { className: "dsc-glass", title: "Faults / alerts", icon: "alert", children: $.length === 0 && T === 0 ? /* @__PURE__ */ s.jsx("div", { className: "dsc-empty dsc-empty--ok", children: "No active faults — all clear." }) : /* @__PURE__ */ s.jsxs("ul", { className: "dsc-fault-list", children: [
        $.map((ce) => /* @__PURE__ */ s.jsxs("li", { children: [
          /* @__PURE__ */ s.jsx(
            F,
            {
              label: ce.label,
              tone: "bad",
              pulse: !0,
              icon: "alert",
              onClick: () => b.open({ entityId: ce.id, label: ce.label, kind: "alert" })
            }
          ),
          /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", children: ce.id })
        ] }, ce.id)),
        T > 0 && $.length === 0 ? /* @__PURE__ */ s.jsxs("li", { children: [
          /* @__PURE__ */ s.jsx(F, { label: `${T} system alert(s)`, tone: "bad", pulse: !0, icon: "alert" }),
          /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", children: "See Fleet for entity detail" })
        ] }) : null
      ] }) }) })
    ] }),
    /* @__PURE__ */ s.jsx(Dl, { open: m, onClose: () => g(!1), title: "Quick jump", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: [
      { path: "/live/climate", label: "Climate" },
      { path: "/live/twin", label: "Twin" },
      { path: "/live/4x8", label: "4×8" },
      { path: "/live/2x4", label: "2×4" },
      { path: "/live/root", label: "Root" },
      { path: "/live/light", label: "Light" },
      { path: "/grow/compose", label: "Compose" },
      { path: "/fleet", label: "Fleet" }
    ].map((ce) => /* @__PURE__ */ s.jsx(
      "button",
      {
        type: "button",
        className: "dsc-btn teal",
        onClick: () => {
          g(!1), f(ce.path);
        },
        children: ce.label
      },
      ce.path
    )) }) })
  ] });
}
function I0(l) {
  return l.kind === "allocated" || l.kind === "mass-balance" ? void 0 : "6 5";
}
function va(l) {
  return Number.isFinite(l) ? String(Math.round(l)) : "—";
}
function ey(l) {
  return !Number.isFinite(l) || l <= 0 ? 0 : l < 40 ? 1 : l < 80 ? 2 : l < 140 ? 3 : l < 220 ? 4 : 5;
}
function $a({
  x1: l,
  y1: c,
  x2: u,
  y2: o,
  reading: d,
  color: f,
  onClick: m
}) {
  const g = ey(d.value), p = u - l, v = o - c, b = Math.hypot(p, v) || 1, x = -v / b * 3.2, w = p / b * 3.2, j = -Math.floor((g - 1) / 2);
  return /* @__PURE__ */ s.jsx(
    "g",
    {
      role: m ? "button" : void 0,
      style: { cursor: m ? "pointer" : void 0 },
      onClick: m,
      children: g === 0 ? /* @__PURE__ */ s.jsx(
        "line",
        {
          x1: l,
          y1: c,
          x2: u,
          y2: o,
          stroke: f,
          strokeWidth: "1.2",
          strokeDasharray: "2 6",
          opacity: 0.35
        }
      ) : Array.from({ length: g }, (M, T) => {
        const k = j + T;
        return /* @__PURE__ */ s.jsx(
          "line",
          {
            x1: l + x * k,
            y1: c + w * k,
            x2: u + x * k,
            y2: o + w * k,
            stroke: f,
            strokeWidth: 1.4 + Math.min(2.2, d.value / 120),
            strokeDasharray: I0(d),
            opacity: 0.85
          },
          T
        );
      })
    }
  );
}
function Lu({
  intakeClone: l,
  intakeMain: c,
  outCfm: u,
  recircCfm: o,
  compact: d,
  focus: f
}) {
  const m = Yn(), g = {
    value: Number.isFinite(l.value) ? l.value : 0,
    kind: l.kind,
    entityId: l.entityId,
    nameplate: l.nameplate
  }, p = (Number.isFinite(l.value) ? l.value : 0) + (Number.isFinite(c.value) ? c.value : 0), v = f !== "main", b = f !== "clone", x = f !== "clone", w = f === "clone" ? [l] : f === "main" ? [c, u, o] : [l, c, u, o], j = () => m.open({
    entityId: g.entityId,
    label: "Cascade 2×4 → 4×8",
    unit: "cfm"
  });
  return /* @__PURE__ */ s.jsxs("div", { className: `dsc-air-path${d ? " is-compact" : ""}`, children: [
    /* @__PURE__ */ s.jsx(Hu, { readings: w }),
    /* @__PURE__ */ s.jsxs("svg", { viewBox: "0 0 720 260", className: "dsc-air-svg", "aria-label": "Air path room to tents", children: [
      /* @__PURE__ */ s.jsx("rect", { x: "16", y: "78", width: "120", height: "110", rx: "12", fill: "none", stroke: "var(--dsc-teal)", strokeWidth: "1.8" }),
      /* @__PURE__ */ s.jsx("text", { x: "76", y: "122", textAnchor: "middle", fill: "currentColor", fontSize: "13", children: "Room" }),
      /* @__PURE__ */ s.jsx("text", { x: "76", y: "142", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: "umbrella lung" }),
      v ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx("rect", { x: "220", y: "28", width: "150", height: "88", rx: "10", fill: "none", stroke: "var(--dsc-teal)", strokeWidth: "1.8" }),
        /* @__PURE__ */ s.jsx("text", { x: "295", y: "64", textAnchor: "middle", fill: "currentColor", fontSize: "13", children: "2×4 tent" }),
        /* @__PURE__ */ s.jsxs("text", { x: "295", y: "84", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: [
          "in ",
          va(l.value),
          " cfm"
        ] }),
        /* @__PURE__ */ s.jsx(
          $a,
          {
            x1: 136,
            y1: 110,
            x2: 220,
            y2: 72,
            reading: l,
            color: "var(--dsc-teal)",
            onClick: () => m.open({
              entityId: l.entityId,
              label: "2×4 intake CFM",
              unit: "cfm"
            })
          }
        )
      ] }) : null,
      b ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx("rect", { x: "220", y: "150", width: "150", height: "88", rx: "10", fill: "none", stroke: "var(--dsc-blue)", strokeWidth: "1.8" }),
        /* @__PURE__ */ s.jsx("text", { x: "295", y: "186", textAnchor: "middle", fill: "currentColor", fontSize: "13", children: "4×8 tent" }),
        /* @__PURE__ */ s.jsxs("text", { x: "295", y: "206", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: [
          "in ",
          va(c.value),
          " cfm"
        ] }),
        /* @__PURE__ */ s.jsx(
          $a,
          {
            x1: 136,
            y1: 140,
            x2: 220,
            y2: 194,
            reading: c,
            color: "var(--dsc-blue)",
            onClick: () => m.open({
              entityId: c.entityId,
              label: "4×8 intake CFM",
              unit: "cfm"
            })
          }
        )
      ] }) : null,
      x ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx("rect", { x: "560", y: "150", width: "140", height: "88", rx: "10", fill: "none", stroke: "#ff8a65", strokeWidth: "1.6" }),
        /* @__PURE__ */ s.jsx("text", { x: "630", y: "186", textAnchor: "middle", fill: "currentColor", fontSize: "12", children: "Outdoors" }),
        /* @__PURE__ */ s.jsxs("text", { x: "630", y: "206", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: [
          "dump ",
          va(u.value)
        ] })
      ] }) : null,
      f ? null : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx(
          $a,
          {
            x1: 295,
            y1: 116,
            x2: 295,
            y2: 150,
            reading: g,
            color: "var(--dsc-amber)",
            onClick: j
          }
        ),
        /* @__PURE__ */ s.jsxs("text", { x: "370", y: "140", fill: "var(--dsc-amber)", fontSize: "10", children: [
          "cascade ",
          va(g.value)
        ] }),
        /* @__PURE__ */ s.jsx("text", { x: "370", y: "152", fill: "var(--dsc-gray-5)", fontSize: "9", children: "same air · not added to Σ" })
      ] }),
      f === "clone" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx(
          $a,
          {
            x1: 370,
            y1: 72,
            x2: 430,
            y2: 72,
            reading: g,
            color: "var(--dsc-amber)",
            onClick: j
          }
        ),
        /* @__PURE__ */ s.jsx("rect", { x: "430", y: "54", width: "88", height: "36", rx: "8", fill: "none", stroke: "var(--dsc-amber)", strokeWidth: "1.4", strokeDasharray: "5 4" }),
        /* @__PURE__ */ s.jsx("text", { x: "474", y: "76", textAnchor: "middle", fill: "var(--dsc-amber)", fontSize: "10", children: "to 4×8" }),
        /* @__PURE__ */ s.jsxs("text", { x: "474", y: "102", textAnchor: "middle", fill: "var(--dsc-amber)", fontSize: "9", children: [
          "cascade ",
          va(g.value)
        ] })
      ] }) : null,
      f === "main" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx(
          $a,
          {
            x1: 295,
            y1: 132,
            x2: 295,
            y2: 150,
            reading: g,
            color: "var(--dsc-amber)",
            onClick: j
          }
        ),
        /* @__PURE__ */ s.jsx("rect", { x: "251", y: "104", width: "88", height: "28", rx: "8", fill: "none", stroke: "var(--dsc-amber)", strokeWidth: "1.4", strokeDasharray: "5 4" }),
        /* @__PURE__ */ s.jsx("text", { x: "295", y: "122", textAnchor: "middle", fill: "var(--dsc-amber)", fontSize: "10", children: "from 2×4" }),
        /* @__PURE__ */ s.jsxs("text", { x: "390", y: "122", fill: "var(--dsc-amber)", fontSize: "9", children: [
          "cascade ",
          va(g.value)
        ] })
      ] }) : null,
      x ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        /* @__PURE__ */ s.jsx(
          $a,
          {
            x1: 370,
            y1: 194,
            x2: 560,
            y2: 194,
            reading: u,
            color: "#ff8a65",
            onClick: () => m.open({ entityId: u.entityId, label: "Dump OUT CFM", unit: "cfm" })
          }
        ),
        /* @__PURE__ */ s.jsx(
          $a,
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
          va(o.value)
        ] })
      ] }) : null
    ] }),
    f ? null : /* @__PURE__ */ s.jsx(
      F,
      {
        label: `Mass-balance exhaust = Σ intake ${va(p)} × dump/recirc split`,
        tone: "muted"
      }
    )
  ] });
}
function pn(l, c = 1) {
  return Number.isFinite(l) ? l.toFixed(c) : "—";
}
function ty(l) {
  return l("sensor.dsc_hub_room_vpd_kpa") ? "sensor.dsc_hub_room_vpd_kpa" : l("sensor.dsc_hub_room_vpd") ? "sensor.dsc_hub_room_vpd" : "sensor.dsc_hub_room_vpd_kpa";
}
function $n(l, c, u, o, d, f) {
  const m = { id: l, label: c, series: u.series, color: o, unit: d, ...f };
  return u.ghost.length <= 1 ? [m] : [
    m,
    { id: `${l}-ghost`, label: `${c} prior`, series: u.ghost, color: o, unit: d, ghost: !0 }
  ];
}
const ny = [
  { id: "compare", label: "All" },
  { id: "main", label: "4×8" },
  { id: "clone", label: "2×4" },
  { id: "room", label: "Room" }
];
function ay() {
  const { num: l, state: c, entity: u, available: o } = Se(), d = dt(), f = Yn(), { focus: m, setFocus: g } = uv(), { hours: p, setHours: v, maxPoints: b } = Hs(6), x = c("switch.dsc_hub_tent_manual_override") === "on", w = c("switch.dsc_hub_tent_full_auto_mode") === "on", j = String(u("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? ""), M = c("binary_sensor.dsc_reduced_kit") === "on", T = Te("sensor.dsc_hub_tent_temperature"), k = Te("sensor.dsc_hub_tent_humidity"), E = Te("sensor.dsc_hub_vpd_kpa"), U = Te("sensor.dsc_hub_clone_temperature"), Y = Te("sensor.dsc_hub_clone_humidity"), P = Te("sensor.dsc_hub_clone_vpd_kpa"), Z = Te("sensor.dsc_hub_room_temperature"), G = Te("sensor.dsc_hub_room_humidity"), Q = ty(u), te = Te(Q), ae = qe("sensor.dsc_hub_tent_temperature", { hours: p, maxPoints: b, withGhost: !0 }), xe = qe("sensor.dsc_hub_tent_humidity", { hours: p, maxPoints: b, withGhost: !0 }), z = qe("sensor.dsc_hub_vpd_kpa", { hours: p, maxPoints: b, withGhost: !0 }), W = qe("sensor.dsc_hub_clone_temperature", { hours: p, maxPoints: b, withGhost: !0 }), se = qe("sensor.dsc_hub_clone_humidity", { hours: p, maxPoints: b, withGhost: !0 }), K = qe("sensor.dsc_hub_clone_vpd_kpa", { hours: p, maxPoints: b, withGhost: !0 }), J = qe("sensor.dsc_hub_room_temperature", { hours: p, maxPoints: b, withGhost: !0 }), A = qe("sensor.dsc_hub_room_humidity", { hours: p, maxPoints: b, withGhost: !0 }), H = qe(Q, { hours: p, maxPoints: b, withGhost: !0 }), I = qe("sensor.dsc_fan_exhaust_outside_pct", { hours: p, maxPoints: b }), ve = qe("sensor.dsc_fan_exhaust_room_pct", { hours: p, maxPoints: b }), pe = wt("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available: o,
    num: l
  }), N = wt(
    "sensor.dsc_cfm_exhaust_recirc_allocated",
    "sensor.dsc_cfm_exhaust_recirc",
    { available: o, num: l }
  ), $ = wt(
    "sensor.dsc_cfm_intake_main_allocated",
    "sensor.dsc_cfm_intake_main",
    { available: o, num: l }
  ), ee = wt(
    "sensor.dsc_cfm_intake_2x4_allocated",
    "sensor.dsc_cfm_intake_2x4",
    { available: o, num: l }
  ), ne = ru(Z.value, G.value), re = ru(T.value, k.value), ge = ru(U.value, Y.value), _e = l("number.dsc_hub_target_temp"), de = l("number.dsc_hub_rh_target_min"), we = l("number.dsc_hub_rh_target_max"), it = l("number.dsc_hub_vpd_target_min"), ft = l("number.dsc_hub_vpd_target_max"), ce = l("number.dsc_hub_clone_target_temp"), tt = l("number.dsc_hub_clone_rh_min"), oe = l("number.dsc_hub_clone_rh_max"), Ke = l("number.dsc_hub_clone_vpd_min"), rt = l("number.dsc_hub_clone_vpd_max"), He = (Je, Uc, Bc) => f.open({ entityId: Je, label: Uc, unit: Bc }), ln = y.useMemo(() => vn(ae.series), [ae.series]), _n = y.useMemo(() => vn(xe.series), [xe.series]), yn = y.useMemo(() => vn(z.series), [z.series]), Hl = y.useMemo(() => vn(W.series), [W.series]), Rc = y.useMemo(() => vn(se.series), [se.series]), zc = y.useMemo(() => vn(K.series), [K.series]), St = y.useMemo(() => vn(J.series), [J.series]), Oc = y.useMemo(() => vn(A.series), [A.series]), $s = y.useMemo(() => vn(H.series), [H.series]), Gs = T.value - Z.value, Qa = re - ne, Dc = E.value - te.value, Fs = T.value - U.value, Hc = re - ge, Lc = ge - ne, Vn = l("sensor.dsc_bought_runtime_today"), bt = l("sensor.dsc_vent_heat_dump_btu"), Vt = (Je) => m === "compare" || m === Je ? "dsc-gauge-row-3 is-lit" : "dsc-gauge-row-3";
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Yt,
      {
        icon: "climate",
        title: "Climate",
        subtitle: "Room is the umbrella lung. 2×4 and 4×8 are grow rooms and transfer/storage. T, RH, VPD only together.",
        actions: /* @__PURE__ */ s.jsx(
          Mc,
          {
            label: "Climate settings",
            items: [
              { id: "mission", label: "Mission", onSelect: () => d("/live/mission") },
              { id: "main", label: "4×8 cockpit", onSelect: () => d("/live/4x8") },
              { id: "clone", label: "2×4 cockpit", onSelect: () => d("/live/2x4") },
              { id: "fleet", label: "Fleet kit", onSelect: () => d("/fleet") }
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 14 }, role: "group", "aria-label": "Zone emphasis", children: [
      ny.map((Je) => /* @__PURE__ */ s.jsx(
        "button",
        {
          type: "button",
          className: `dsc-chip${m === Je.id ? " dsc-chip--ok" : ""}`,
          onClick: () => g(Je.id),
          children: Je.label
        },
        Je.id
      )),
      /* @__PURE__ */ s.jsx(Us, { hours: p, setHours: v, extras: Ls }),
      /* @__PURE__ */ s.jsx(he, { teal: !0, onClick: () => d("/fleet"), children: "Kit / Fleet" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(fe, { className: "dsc-glass", title: "Command", icon: "climate", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-row", children: [
          /* @__PURE__ */ s.jsx(Fe, { entityId: "switch.dsc_hub_tent_full_auto_mode", label: "Full Auto", icon: "ok" }),
          /* @__PURE__ */ s.jsx(Fe, { entityId: "switch.dsc_hub_manual_takeover", label: "Master takeover", icon: "alert" }),
          /* @__PURE__ */ s.jsx(Fe, { entityId: "switch.dsc_hub_tent_manual_override", label: "Fan override", icon: "climate" }),
          /* @__PURE__ */ s.jsx(Fe, { entityId: "switch.dsc_hub_humidifier_intake_routing", label: "Hum intake routing", icon: "climate" }),
          /* @__PURE__ */ s.jsx(Fe, { entityId: "switch.dsc_hub_recirc_de_strat_pulse", label: "RECIRC de-strat", icon: "climate" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-selects", children: [
          /* @__PURE__ */ s.jsx(Ya, { entityId: "select.dsc_hub_control_strategy", label: "Strategy", icon: "climate" }),
          /* @__PURE__ */ s.jsx(Ya, { entityId: "select.dsc_hub_priority_tent", label: "Priority tent", icon: "tent" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-demand-row", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ s.jsx(Fe, { entityId: "switch.dsc_hub_heater_demand", label: "Heat", icon: "climate" }),
          /* @__PURE__ */ s.jsx(
            Fe,
            {
              entityId: "switch.dsc_hub_ac_demand",
              label: "Cool",
              icon: "climate",
              warnWhenMissing: c("binary_sensor.dsc_ac_capacity_offline") === "on" ? "AC ○" : void 0
            }
          ),
          /* @__PURE__ */ s.jsx(Fe, { entityId: "switch.dsc_hub_humidifier_demand", label: "Hum", icon: "climate" }),
          /* @__PURE__ */ s.jsx(Fe, { entityId: "switch.dsc_hub_dehumidifier_demand", label: "Dehum", icon: "climate" }),
          /* @__PURE__ */ s.jsx(Fe, { entityId: "switch.dsc_hub_grow_mat_demand", label: "Mat", icon: "root" }),
          /* @__PURE__ */ s.jsx(Fe, { entityId: "switch.dsc_hub_clone_humidifier_demand", label: "Mister", icon: "clone" })
        ] }),
        w ? /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
          /* @__PURE__ */ s.jsx(
            F,
            {
              icon: M ? "alert" : "ok",
              label: M ? "Unexpected OOS" : "Full Auto",
              tone: M ? "warn" : "ok",
              onClick: () => f.open({
                entityId: M ? "binary_sensor.dsc_reduced_kit" : "switch.dsc_hub_tent_full_auto_mode",
                label: M ? "Unexpected OOS" : "Full Auto",
                kind: M ? "alert" : "binary"
              })
            }
          ),
          " ",
          j || "Hub owns fans + appliance Autos when Full Auto is on."
        ] }) : null
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(fe, { className: "dsc-glass", title: "Room umbrella", icon: "climate", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
          /* @__PURE__ */ s.jsx(
            an,
            {
              label: "Room °C",
              value: pn(Z.value),
              unit: "°C",
              stale: Z.stale,
              onClick: () => He("sensor.dsc_hub_room_temperature", "Room T", "°C")
            }
          ),
          /* @__PURE__ */ s.jsx(
            an,
            {
              label: "Room RH",
              value: pn(G.value, 0),
              unit: "%",
              stale: G.stale,
              onClick: () => He("sensor.dsc_hub_room_humidity", "Room RH", "%")
            }
          ),
          /* @__PURE__ */ s.jsx(
            an,
            {
              label: "Room VPD",
              value: pn(te.value, 2),
              unit: "kPa",
              stale: te.stale,
              onClick: () => He(Q, "Room VPD", "kPa")
            }
          ),
          /* @__PURE__ */ s.jsx(
            an,
            {
              label: "Room AH",
              value: Number.isFinite(ne) ? ne.toFixed(1) : "—",
              unit: "g/m³",
              sub: Number.isFinite(ne) ? `24h ${pn(l("sensor.dsc_hub_room_temp_mean_24h"))}°C` : "Need T+RH",
              onClick: () => He("sensor.dsc_ah_room", "Room AH", "g/m³")
            }
          )
        ] }),
        /* @__PURE__ */ s.jsxs("p", { className: "dsc-muted", style: { marginTop: 8, fontSize: 12 }, children: [
          "ΔT room↔4×8 ",
          pn(Gs),
          "°C · ΔAH ",
          pn(Qa),
          " g/m³ · ΔVPD ",
          pn(Dc, 2),
          " · ΔT/ΔAH 2×4↔4×8",
          " ",
          pn(Fs),
          "°C / ",
          pn(Hc),
          " · ΔAH room↔2×4 ",
          pn(Lc),
          " g/m³. Early warn is the lung poisoning a tent before Want miss."
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(rv, { hero: !0 }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(fe, { className: "dsc-glass", title: "Triad · T / RH / VPD", icon: "gauge", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-gauge-matrix", children: [
          /* @__PURE__ */ s.jsxs("div", { className: Vt("room"), children: [
            /* @__PURE__ */ s.jsx("span", { className: "dsc-gauge-row-tag", children: "Room" }),
            /* @__PURE__ */ s.jsx(xt, { label: "T", value: Z.value, min: 10, max: 40, unit: "°C", extrema: St, stale: Z.stale, onClick: () => He("sensor.dsc_hub_room_temperature", "Room T", "°C") }),
            /* @__PURE__ */ s.jsx(xt, { label: "RH", value: G.value, min: 0, max: 100, unit: "%", extrema: Oc, stale: G.stale, onClick: () => He("sensor.dsc_hub_room_humidity", "Room RH", "%") }),
            /* @__PURE__ */ s.jsx(xt, { label: "VPD", value: te.value, min: 0, max: 2.5, unit: "kPa", extrema: $s, stale: te.stale, onClick: () => He(Q, "Room VPD", "kPa") })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: Vt("clone"), children: [
            /* @__PURE__ */ s.jsx("span", { className: "dsc-gauge-row-tag", children: "2×4" }),
            /* @__PURE__ */ s.jsx(xt, { label: "T", value: U.value, min: 15, max: 35, unit: "°C", target: ce, extrema: Hl, stale: U.stale, onClick: () => He("sensor.dsc_hub_clone_temperature", "2×4 T", "°C") }),
            /* @__PURE__ */ s.jsx(xt, { label: "RH", value: Y.value, min: 0, max: 100, unit: "%", band: { min: tt, max: oe }, extrema: Rc, stale: Y.stale, onClick: () => He("sensor.dsc_hub_clone_humidity", "2×4 RH", "%") }),
            /* @__PURE__ */ s.jsx(xt, { label: "VPD", value: P.value, min: 0, max: 2.5, unit: "kPa", band: { min: Ke, max: rt }, extrema: zc, stale: P.stale, onClick: () => He("sensor.dsc_hub_clone_vpd_kpa", "2×4 VPD", "kPa") })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: Vt("main"), children: [
            /* @__PURE__ */ s.jsx("span", { className: "dsc-gauge-row-tag", children: "4×8" }),
            /* @__PURE__ */ s.jsx(xt, { label: "T", value: T.value, min: 15, max: 35, unit: "°C", target: _e, extrema: ln, stale: T.stale, onClick: () => He("sensor.dsc_hub_tent_temperature", "4×8 T", "°C") }),
            /* @__PURE__ */ s.jsx(xt, { label: "RH", value: k.value, min: 0, max: 100, unit: "%", band: { min: de, max: we }, extrema: _n, stale: k.stale, onClick: () => He("sensor.dsc_hub_tent_humidity", "4×8 RH", "%") }),
            /* @__PURE__ */ s.jsx(xt, { label: "VPD", value: E.value, min: 0, max: 2.5, unit: "kPa", band: { min: it, max: ft }, extrema: yn, stale: E.stale, onClick: () => He("sensor.dsc_hub_vpd_kpa", "4×8 VPD", "kPa") })
          ] })
        ] }),
        /* @__PURE__ */ s.jsx(
          iv,
          {
            rows: [
              { label: "Room T", got: Z.value, stale: Z.stale, want: l("sensor.dsc_hub_room_temp_mean_24h"), unit: "°C" },
              { label: "2×4 T", got: U.value, stale: U.stale, want: ce, unit: "°C" },
              { label: "4×8 T", got: T.value, stale: T.stale, want: _e, unit: "°C" },
              { label: "2×4 RH", got: Y.value, stale: Y.stale, wantMin: tt, wantMax: oe, unit: "%" },
              { label: "4×8 RH", got: k.value, stale: k.stale, wantMin: de, wantMax: we, unit: "%" },
              { label: "2×4 VPD", got: P.value, stale: P.stale, wantMin: Ke, wantMax: rt, unit: "kPa" },
              { label: "4×8 VPD", got: E.value, stale: E.stale, wantMin: it, wantMax: ft, unit: "kPa" }
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(fe, { className: "dsc-glass", title: "Temperature", icon: "climate", children: /* @__PURE__ */ s.jsx(
        gn,
        {
          unit: "°C",
          lastSyncAt: Math.max(J.lastSyncAt ?? 0, W.lastSyncAt ?? 0, ae.lastSyncAt ?? 0) || void 0,
          series: [
            ...$n("rt", "Room", J, "var(--dsc-gray-5)", "°C"),
            ...$n("ct", "2×4", W, "var(--dsc-teal)", "°C", { band: { min: ce - 1.5, max: ce + 1.5 } }),
            ...$n("mt", "4×8", ae, "var(--dsc-blue)", "°C", { band: { min: _e - 1.5, max: _e + 1.5 } })
          ],
          targets: [{ axis: "left", value: _e, color: "var(--dsc-amber)", label: "4×8 Want T" }]
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(fe, { className: "dsc-glass", title: "Humidity", icon: "climate", children: /* @__PURE__ */ s.jsx(
        gn,
        {
          unit: "%",
          lastSyncAt: Math.max(A.lastSyncAt ?? 0, se.lastSyncAt ?? 0, xe.lastSyncAt ?? 0) || void 0,
          yDomain: { left: { min: 0, max: 100 } },
          series: [
            ...$n("rrh", "Room", A, "var(--dsc-gray-5)", "%"),
            ...$n("crh", "2×4", se, "var(--dsc-teal)", "%", { band: { min: tt, max: oe } }),
            ...$n("mrh", "4×8", xe, "var(--dsc-blue)", "%", { band: { min: de, max: we } })
          ],
          targets: [{ axis: "left", min: de, max: we, color: "var(--dsc-teal)" }]
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(fe, { className: "dsc-glass", title: "VPD", icon: "climate", children: /* @__PURE__ */ s.jsx(
        gn,
        {
          unit: "kPa",
          lastSyncAt: Math.max(H.lastSyncAt ?? 0, K.lastSyncAt ?? 0, z.lastSyncAt ?? 0) || void 0,
          series: [
            ...$n("rv", "Room", H, "var(--dsc-gray-5)", "kPa"),
            ...$n("cv", "2×4", K, "var(--dsc-teal)", "kPa", { band: { min: Ke, max: rt } }),
            ...$n("mv", "4×8", z, "var(--dsc-blue)", "kPa", { band: { min: it, max: ft } })
          ]
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(fe, { className: "dsc-glass", title: "Air path", icon: "climate", children: /* @__PURE__ */ s.jsx(
        Lu,
        {
          intakeClone: ee,
          intakeMain: $,
          outCfm: pe,
          recircCfm: N
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(fe, { className: "dsc-glass", title: "Fan duty %", icon: "climate", children: [
        /* @__PURE__ */ s.jsx(
          gn,
          {
            unit: "%",
            yDomain: { left: { min: 0, max: 100 } },
            lastSyncAt: Math.max(I.lastSyncAt ?? 0, ve.lastSyncAt ?? 0) || void 0,
            series: [
              { id: "fout", label: "OUT %", series: I.series, color: "var(--dsc-teal)", unit: "%", step: !0, band: { min: 0, max: 90 } },
              { id: "frec", label: "RECIRC %", series: ve.series, color: "var(--dsc-amber)", unit: "%", step: !0, band: { min: 0, max: 90 } }
            ]
          }
        ),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-fan-stack", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ s.jsx(xa, { entityId: "fan.dsc_hub_4_inch_intake_fan_main", label: "Intake 4×8", disabled: !x }),
          /* @__PURE__ */ s.jsx(xa, { entityId: "fan.dsc_hub_4_inch_intake_fan_2x4", label: "Intake 2×4", disabled: !x }),
          /* @__PURE__ */ s.jsx(xa, { entityId: "fan.dsc_hub_6_inch_exhaust_room", label: "Exhaust room", disabled: !x }),
          /* @__PURE__ */ s.jsx(xa, { entityId: "fan.dsc_hub_6_inch_exhaust_outside", label: "Exhaust outside", disabled: !x })
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(fe, { className: "dsc-glass", title: "Efficacy · buying kW because the lung could not transfer", icon: "alert", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ s.jsx(F, { label: `Heat ${c("switch.dsc_hub_heater_demand") === "on" ? "ON" : "off"}`, tone: c("switch.dsc_hub_heater_demand") === "on" ? "ok" : "muted", onClick: () => He("switch.dsc_hub_heater_demand", "Heater", void 0) }),
        /* @__PURE__ */ s.jsx(F, { label: `Cool ${c("switch.dsc_hub_ac_demand") === "on" ? "ON" : "off"}`, tone: c("switch.dsc_hub_ac_demand") === "on" ? "ok" : "muted", onClick: () => He("switch.dsc_hub_ac_demand", "Cool", void 0) }),
        /* @__PURE__ */ s.jsx(F, { label: `Hum ${c("switch.dsc_hub_humidifier_demand") === "on" ? "ON" : "off"}`, tone: c("switch.dsc_hub_humidifier_demand") === "on" ? "ok" : "muted", onClick: () => He("switch.dsc_hub_humidifier_demand", "Humidifier", void 0) }),
        /* @__PURE__ */ s.jsx(F, { label: `Dehum ${c("switch.dsc_hub_dehumidifier_demand") === "on" ? "ON" : "off"}`, tone: c("switch.dsc_hub_dehumidifier_demand") === "on" ? "ok" : "muted", onClick: () => He("switch.dsc_hub_dehumidifier_demand", "Dehumidifier", void 0) }),
        /* @__PURE__ */ s.jsx(
          F,
          {
            label: c("binary_sensor.dsc_humidifier_ineffective_suspect") === "on" ? "Hum ineffective" : "Hum ok",
            tone: c("binary_sensor.dsc_humidifier_ineffective_suspect") === "on" ? "warn" : "muted",
            onClick: () => He("binary_sensor.dsc_humidifier_ineffective_suspect", "Humidifier ineffective", void 0)
          }
        ),
        /* @__PURE__ */ s.jsx(
          F,
          {
            label: c("binary_sensor.dsc_heater_ineffective_suspect") === "on" ? "Heat ineffective" : "Heat ok",
            tone: c("binary_sensor.dsc_heater_ineffective_suspect") === "on" ? "warn" : "muted",
            onClick: () => He("binary_sensor.dsc_heater_ineffective_suspect", "Heater ineffective", void 0)
          }
        ),
        /* @__PURE__ */ s.jsx(
          F,
          {
            label: `Bought ${Number.isFinite(Vn) ? Vn.toFixed(1) : "—"}h today`,
            tone: "muted",
            onClick: () => He("sensor.dsc_bought_runtime_today", "Bought runtime today", "h")
          }
        ),
        /* @__PURE__ */ s.jsx(
          F,
          {
            label: `Dump ${Number.isFinite(bt) ? Math.round(bt) : "—"} BTU/h`,
            tone: "muted",
            onClick: () => He("sensor.dsc_vent_heat_dump_btu", "Vent heat dump", "BTU/h")
          }
        ),
        /* @__PURE__ */ s.jsx(
          F,
          {
            label: `Heater today ${ba(l("sensor.dsc_heater_runtime_today") * 36e5)}`,
            tone: "muted",
            onClick: () => He("sensor.dsc_heater_runtime_today", "Heater runtime today", "h")
          }
        )
      ] }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(Bs, { compact: !0 }) })
    ] })
  ] });
}
function ly(l, c = 1) {
  return Number.isFinite(l) ? l.toFixed(c) : "—";
}
function sy() {
  const { state: l, entity: c, tick: u, num: o } = Se(), d = Yn(), f = dt(), [m, g] = Ec(), p = [...qn].map((k) => ({ n: k, seat: Xa(k, { state: l, entity: c }), oos: !kt(k, l) })).sort((k, E) => Number(k.oos) - Number(E.oos)), v = F_(l), b = Number(m.get("pot") || 0), x = b >= 1 && b <= 4 && kt(b, l) ? b : null, w = o("sensor.dsc_growmat_runtime_today"), j = o("sensor.dsc_heatmat_relay_on_time"), M = (k) => {
    const E = new URLSearchParams(m);
    E.set("pot", String(k)), g(E, { replace: !0 });
  }, T = () => {
    const k = new URLSearchParams(m);
    k.delete("pot"), g(k, { replace: !0 });
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Yt,
      {
        icon: "root",
        title: "Root",
        subtitle: `${v.inService} of ${v.total} pots in service — OOS labeled, never fake Got.`
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(
        an,
        {
          label: "Coldest root",
          value: ly(o("sensor.dsc_coldest_root_zone_temp")),
          unit: "°C",
          onClick: () => d.open({
            entityId: "sensor.dsc_coldest_root_zone_temp",
            label: "Coldest root",
            unit: "°C"
          })
        }
      ) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(
        an,
        {
          label: "Heat mat today",
          value: Number.isFinite(w) ? w.toFixed(1) : ba(j * 1e3),
          unit: Number.isFinite(w) ? "h" : "",
          sub: Number.isFinite(j) ? `session ${ba(j * 1e3)}` : void 0,
          onClick: () => d.open({
            entityId: "switch.dsc_hub_grow_mat_demand",
            label: "Heat mat",
            kind: "binary",
            runtimeToday: "sensor.dsc_growmat_runtime_today",
            demandEntity: "switch.dsc_hub_grow_mat_demand"
          })
        }
      ) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(fe, { title: "Notes", children: /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: "Mat loop uses per-pot sense with plausibility filter. Metric click opens inspector; card chrome opens the seat." }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(
        yc,
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
      p.map(({ n: k, seat: E, oos: U }) => /* @__PURE__ */ s.jsxs("div", { className: "dsc-col-12", children: [
        /* @__PURE__ */ s.jsx(iy, { pot: k, oos: U, onOpenSeat: () => U ? void 0 : M(k) }),
        U ? null : /* @__PURE__ */ s.jsxs("button", { type: "button", className: "dsc-btn", style: { marginTop: 6 }, onClick: () => M(k), children: [
          "Open ",
          E.plantName !== "—" ? E.plantName : `POT${k}`,
          " seat"
        ] })
      ] }, k))
    ] }),
    /* @__PURE__ */ s.jsx(
      Dl,
      {
        open: x != null,
        onClose: T,
        title: x != null ? `Plant seat · POT${x}` : "Plant seat",
        children: x != null ? /* @__PURE__ */ s.jsx(Ac, { pot: x, onSelectPot: M }) : null
      }
    ),
    /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { marginTop: 8 }, children: /* @__PURE__ */ s.jsx("button", { type: "button", className: "dsc-chip", onClick: () => f("/live/climate"), children: "Climate Want" }) })
  ] });
}
function iy({ pot: l, oos: c, onOpenSeat: u }) {
  const { state: o, entity: d, available: f } = Se(), m = Yn(), g = Xa(l, { state: o, entity: d }), p = Tc(l, o), v = nn(l, "moisture", o), b = qe(v, { hours: 6, maxPoints: 48 }), x = Te(`sensor.dsc_pot${l}_dryback_pct`), w = Te(`sensor.dsc_pot${l}_soil_temperature`), j = Te(v), M = Te(nn(l, "ec", o)), T = Te(nn(l, "ph", o)), k = Te(`sensor.dsc_pot${l}_soil_moisture_rate`), E = fu(l, "moisture", o), U = fu(l, "ec", o), Y = fu(l, "ph", o), P = E && E.max !== 45 ? void 0 : { min: 0, max: 45 }, Z = (G, Q, te) => (ae) => {
    ae.stopPropagation(), m.open({ entityId: G, label: Q, unit: te });
  };
  return /* @__PURE__ */ s.jsxs(fe, { className: `dsc-glass dsc-pot-card${c ? " is-oos" : ""}`, title: `Pot ${l}`, icon: "root", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-pot-card-head", onClick: u, role: "presentation", children: [
      /* @__PURE__ */ s.jsx(xn, { spec: _a(l, o, d), size: 28 }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("strong", { children: c ? "OOS" : g.plantName }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
          /* @__PURE__ */ s.jsx(F, { label: Cc(g.tent), tone: c || g.tent === "unassigned" ? "muted" : "ok" }),
          /* @__PURE__ */ s.jsx(
            F,
            {
              label: c ? "OOS" : p.blockNeedAct ? `${g.need} (no act)` : `Need ${g.need}`,
              tone: c ? "muted" : g.need && g.need !== "ok" && g.need !== "—" ? "warn" : "ok"
            }
          ),
          p.labels.map((G) => /* @__PURE__ */ s.jsx(F, { label: G, tone: "warn" }, G))
        ] })
      ] }),
      /* @__PURE__ */ s.jsx(x0, { series: b.series, color: "var(--dsc-blue)", width: 140, height: 36 })
    ] }),
    c ? /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Parked — no fake Got." }) : /* @__PURE__ */ s.jsxs("div", { className: "dsc-gauge-row", children: [
      /* @__PURE__ */ s.jsx(xt, { label: "Moisture", value: j.value, min: 0, max: 100, unit: "%", band: E, stale: j.stale, onClick: () => m.open({ entityId: v, label: `P${l} moisture`, unit: "%" }) }),
      /* @__PURE__ */ s.jsx(xt, { label: "Soil °C", value: w.value, min: 10, max: 40, unit: "°C", stale: w.stale, onClick: () => m.open({ entityId: `sensor.dsc_pot${l}_soil_temperature`, label: `P${l} soil T`, unit: "°C" }) }),
      /* @__PURE__ */ s.jsx(xt, { label: "Dryback", value: x.value, min: 0, max: 100, unit: "%", band: P, stale: x.stale, onClick: () => m.open({ entityId: `sensor.dsc_pot${l}_dryback_pct`, label: `P${l} dryback`, unit: "%" }) }),
      /* @__PURE__ */ s.jsx(xt, { label: "EC", value: M.value, min: 0, max: 3e3, unit: "", band: U, stale: M.stale, onClick: () => m.open({ entityId: nn(l, "ec", o), label: `P${l} EC` }) }),
      /* @__PURE__ */ s.jsx(xt, { label: "pH", value: T.value, min: 4, max: 8, unit: "", band: Y, stale: T.stale, onClick: () => m.open({ entityId: nn(l, "ph", o), label: `P${l} pH` }) }),
      /* @__PURE__ */ s.jsxs("button", { type: "button", className: "dsc-npk-hit", onClick: Z(`sensor.dsc_pot${l}_soil_nitrogen`, `P${l} N`), children: [
        "N ",
        f(`sensor.dsc_pot${l}_soil_nitrogen`) ? g.n : "—"
      ] }),
      /* @__PURE__ */ s.jsxs("button", { type: "button", className: "dsc-npk-hit", onClick: Z(`sensor.dsc_pot${l}_soil_phosphorus`, `P${l} P`), children: [
        "P ",
        f(`sensor.dsc_pot${l}_soil_phosphorus`) ? g.p : "—"
      ] }),
      /* @__PURE__ */ s.jsxs("button", { type: "button", className: "dsc-npk-hit", onClick: Z(`sensor.dsc_pot${l}_soil_potassium`, `P${l} K`), children: [
        "K ",
        f(`sensor.dsc_pot${l}_soil_potassium`) ? g.k : "—"
      ] }),
      /* @__PURE__ */ s.jsxs(
        "button",
        {
          type: "button",
          className: "dsc-npk-hit",
          onClick: Z(`sensor.dsc_pot${l}_soil_moisture_rate`, `P${l} moisture rate`),
          children: [
            "Rate ",
            Number.isFinite(k.value) ? k.value.toFixed(2) : "—",
            k.stale ? " *" : ""
          ]
        }
      )
    ] })
  ] });
}
function pu(l, c = 1) {
  return Number.isFinite(l) ? l.toFixed(c) : "—";
}
function cy(l, c = Date.now()) {
  if (!l || l === "—" || l === "unknown" || l === "unavailable") return "—";
  const u = Date.parse(l);
  if (!Number.isFinite(u)) return l;
  const o = u - c, d = Math.abs(o), f = ba(d);
  return o >= 0 ? `in ${f}` : `${f} ago`;
}
function ry() {
  const { state: l, num: c, entity: u } = Se(), o = dt(), d = Yn(), f = l("binary_sensor.dsc_clone_dark_period_violation") === "on", m = l("binary_sensor.dsc_clone_light_missing_in_window") === "on", g = l("binary_sensor.dsc_hub_light_catchup_active") === "on", p = l("light.dsc_hub_sf1000_dimmer") === "on", v = l("binary_sensor.dsc_hub_4x8_window_open") === "on", b = l("binary_sensor.dsc_hub_2x4_window_open") === "on", x = c("sensor.dsc_expected_light_hours"), w = c("sensor.dsc_clone_expected_light_hours"), j = c("sensor.dsc_lights_on_today_4x8"), M = c("sensor.dsc_lights_on_today_2x4"), T = c("sensor.dsc_lights_deviation_today"), k = l("sensor.dsc_next_light_event", "—"), E = yu("main", { state: l, entity: u }), U = yu("clone", { state: l, entity: u }), Y = c("number.dsc_hub_min_dark_hours"), P = c("number.dsc_hub_clone_light_hours"), [Z, G] = y.useState(Y), [Q, te] = y.useState(P), ae = E.lightHours != null ? { min: E.lightHours - 0.5, max: E.lightHours + 0.5, source: "stage", mixed: E.mixed } : null, xe = U.lightHours != null ? { min: U.lightHours - 0.5, max: U.lightHours + 0.5, source: "stage", mixed: U.mixed } : null, z = E.lightHours != null ? {
    min: 24 - E.lightHours - 0.5,
    max: 24 - E.lightHours + 0.5,
    source: "stage",
    mixed: E.mixed
  } : null, W = Number.isFinite(Z) ? 24 - Z : x, se = ga(W, ae), K = ga(Number.isFinite(Z) ? Z : Y, z), J = l("select.dsc_hub_clone_photoperiod") === "Independent", A = ga(
    J && Number.isFinite(Q) ? Q : w,
    xe
  ), H = ($) => $ === "critical" ? "bad" : $ === "ok" ? "ok" : $ === "muted" ? "muted" : "warn", I = l("switch.dsc_hub_heater_demand") === "on", ve = c("sensor.dsc_vent_heat_dump_btu"), pe = (p || v) && (I || Number.isFinite(ve) && ve > 0), N = ($, ee, ne) => d.open({ entityId: $, label: ee, kind: ne || "numeric" });
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Yt,
      {
        icon: "lighting",
        title: "Light",
        subtitle: "Photoperiod desk — equal 4×8 / 2×4 cards. 4×8 Got is the window until a GPIO lamp exists.",
        primaryAction: /* @__PURE__ */ s.jsx(he, { teal: !0, onClick: () => o("/live/climate"), children: "Climate Want" })
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-status-strip", children: [
      /* @__PURE__ */ s.jsx(
        F,
        {
          icon: f ? "alert" : "ok",
          label: f ? "2×4 DARK VIOLATION" : "Dark period OK",
          tone: f ? "bad" : "ok",
          pulse: f,
          onClick: () => N("binary_sensor.dsc_clone_dark_period_violation", "2×4 dark violation", "alert")
        }
      ),
      m ? /* @__PURE__ */ s.jsx(
        F,
        {
          label: "Missing in window",
          tone: "bad",
          pulse: !0,
          onClick: () => N("binary_sensor.dsc_clone_light_missing_in_window", "Light missing in window", "alert")
        }
      ) : null,
      g ? /* @__PURE__ */ s.jsx(
        F,
        {
          label: "Catch-up",
          tone: "warn",
          onClick: () => N("binary_sensor.dsc_hub_light_catchup_active", "Light catch-up", "alert")
        }
      ) : null,
      /* @__PURE__ */ s.jsx(
        F,
        {
          label: `Next ${cy(k)}`,
          tone: "muted",
          onClick: () => N("sensor.dsc_next_light_event", "Next light event")
        }
      ),
      pe ? /* @__PURE__ */ s.jsx(F, { label: "This window is buying heat", tone: "warn", onClick: () => o("/live/climate") }) : null
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(fe, { className: "dsc-glass dsc-light-hero", title: "4×8 light", icon: "tent", children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "4×8 Got is the photoperiod window until a GPIO lamp exists — not a brightness." }),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
          /* @__PURE__ */ s.jsx(
            F,
            {
              label: v ? "WINDOW OPEN" : "DARK",
              tone: v ? "ok" : "muted",
              onClick: () => N("binary_sensor.dsc_hub_4x8_window_open", "4×8 window", "binary")
            }
          ),
          /* @__PURE__ */ s.jsx(
            F,
            {
              label: se.label,
              tone: H(se.tone),
              onClick: () => N("sensor.dsc_expected_light_hours", "4×8 expected hours", "numeric")
            }
          )
        ] }),
        /* @__PURE__ */ s.jsx(
          xt,
          {
            label: "Got / Want h",
            value: j,
            min: 0,
            max: 24,
            unit: "h",
            target: x,
            band: E.lightHours != null ? { min: E.lightHours - 0.5, max: E.lightHours + 0.5 } : void 0,
            onClick: () => N("sensor.dsc_lights_on_today_4x8", "4×8 hours today", "numeric")
          }
        ),
        /* @__PURE__ */ s.jsx(an, { label: "Want hours", value: pu(x, 0), unit: "h", onClick: () => N("sensor.dsc_expected_light_hours", "4×8 expected hours", "numeric") }),
        /* @__PURE__ */ s.jsx(
          yc,
          {
            entityId: "binary_sensor.dsc_hub_4x8_window_open",
            hours: 24,
            label: "4×8 window 24h",
            onClick: () => N("binary_sensor.dsc_hub_4x8_window_open", "4×8 window", "binary")
          }
        ),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ s.jsx(Pm, { entityId: "time.dsc_hub_lights_on_time", label: "4×8 opens" }),
          /* @__PURE__ */ s.jsx(Qe, { entityId: "number.dsc_hub_sunrise_duration", label: "Sunrise min" }),
          /* @__PURE__ */ s.jsx(Qe, { entityId: "number.dsc_hub_sunset_duration", label: "Sunset min" }),
          /* @__PURE__ */ s.jsx(
            Qe,
            {
              entityId: "number.dsc_hub_min_dark_hours",
              label: "Min dark h",
              hint: K.label,
              tone: K.tone,
              onLive: G
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(fe, { className: "dsc-glass dsc-light-hero", title: "2×4 light", icon: "lighting", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
          /* @__PURE__ */ s.jsx(
            F,
            {
              label: p ? "SF1000 ON" : "SF1000 OFF",
              tone: p ? "ok" : "muted",
              onClick: () => N("light.dsc_hub_sf1000_dimmer", "SF1000", "binary")
            }
          ),
          /* @__PURE__ */ s.jsx(
            F,
            {
              label: b ? "WINDOW OPEN" : "DARK",
              tone: b ? "ok" : "muted",
              onClick: () => N("binary_sensor.dsc_hub_2x4_window_open", "2×4 window", "binary")
            }
          ),
          /* @__PURE__ */ s.jsx(
            F,
            {
              label: A.label,
              tone: H(A.tone),
              onClick: () => N("sensor.dsc_clone_expected_light_hours", "2×4 expected hours", "numeric")
            }
          )
        ] }),
        /* @__PURE__ */ s.jsx(
          xt,
          {
            label: "Got / Want h",
            value: M,
            min: 0,
            max: 24,
            unit: "h",
            target: w,
            band: U.lightHours != null ? { min: U.lightHours - 0.5, max: U.lightHours + 0.5 } : void 0,
            onClick: () => N("sensor.dsc_lights_on_today_2x4", "2×4 hours today", "numeric")
          }
        ),
        /* @__PURE__ */ s.jsx(an, { label: "Want hours", value: pu(w, 0), unit: "h", onClick: () => N("sensor.dsc_clone_expected_light_hours", "2×4 expected hours", "numeric") }),
        /* @__PURE__ */ s.jsx(
          yc,
          {
            entityId: "light.dsc_hub_sf1000_dimmer",
            hours: 24,
            label: "SF1000 24h",
            onClick: () => N("light.dsc_hub_sf1000_dimmer", "SF1000", "binary")
          }
        ),
        /* @__PURE__ */ s.jsxs("div", { className: "dsc-demand-row", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ s.jsx(Fe, { entityId: "light.dsc_hub_sf1000_dimmer", label: "SF1000", icon: "lighting", showBrightness: !0 }),
          /* @__PURE__ */ s.jsx(Fe, { entityId: "switch.dsc_hub_auto_photoperiod", label: "Auto photoperiod" }),
          /* @__PURE__ */ s.jsx(Fe, { entityId: "switch.dsc_hub_manual_light_hold", label: "Manual light hold" })
        ] }),
        /* @__PURE__ */ s.jsx(Ya, { entityId: "select.dsc_hub_clone_photoperiod", label: "Window source", icon: "clone" }),
        J ? /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
          /* @__PURE__ */ s.jsx(Pm, { entityId: "time.dsc_hub_clone_lights_on_time", label: "2×4 lights-on" }),
          /* @__PURE__ */ s.jsx(
            Qe,
            {
              entityId: "number.dsc_hub_clone_light_hours",
              label: "2×4 hours",
              hint: A.label,
              tone: A.tone,
              onLive: te
            }
          )
        ] }) : /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
          "2×4 follows 4×8 (",
          l("time.dsc_hub_lights_on_time", "—"),
          "). Switch Window source to Independent to unlock start/hours."
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(
        an,
        {
          label: "Deviation today",
          value: pu(T, 2),
          unit: "h",
          sub: "Hub ledger — not a fake progress bar",
          onClick: () => N("sensor.dsc_lights_deviation_today", "Lights deviation today", "numeric")
        }
      ) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(Bs, {}) })
    ] })
  ] });
}
function fc(l, c = 1) {
  return Number.isFinite(l) ? l.toFixed(c) : "—";
}
function oy() {
  const l = dt(), { available: c, num: u } = Se(), o = wt("sensor.dsc_cfm_intake_main_allocated", "sensor.dsc_cfm_intake_main", {
    available: c,
    num: u
  }), d = wt("sensor.dsc_cfm_intake_2x4_allocated", "sensor.dsc_cfm_intake_2x4", {
    available: c,
    num: u
  }), f = wt("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available: c,
    num: u
  }), m = wt(
    "sensor.dsc_cfm_exhaust_recirc_allocated",
    "sensor.dsc_cfm_exhaust_recirc",
    { available: c, num: u }
  );
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page dsc-page--twin-chrome", children: [
    /* @__PURE__ */ s.jsx(
      Yt,
      {
        icon: "twin",
        title: "Twin",
        subtitle: "Cinematic digital twin — pick a pot to open Root seat.",
        primaryAction: /* @__PURE__ */ s.jsx(he, { teal: !0, onClick: () => l("/live/climate"), children: "Set Climate Want" }),
        actions: /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(he, { onClick: () => l("/live/4x8"), children: "4×8 cockpit" }),
          /* @__PURE__ */ s.jsx(he, { onClick: () => l("/live/2x4"), children: "2×4 cockpit" })
        ] })
      }
    ),
    /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty dsc-muted", style: { marginTop: 0 }, children: "Pick a pot in the twin to open its seat. Twin stays warm across Twin / 4×8 / 2×4. Orbit the scene — it no longer snaps home on hass ticks. 4×8 fixture glow follows the photoperiod window until a main lamp is wired." }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", style: { marginTop: 12 }, children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(Bs, {}) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(fe, { className: "dsc-glass", title: "Air path", icon: "climate", children: /* @__PURE__ */ s.jsx(Lu, { intakeClone: d, intakeMain: o, outCfm: f, recircCfm: m }) }) })
    ] })
  ] });
}
function vv({ tent: l }) {
  const { state: c, entity: u, num: o, tick: d, callWS: f, available: m } = Se(), g = dt(), p = Yn(), { setFocus: v } = uv(), [b, x] = Ec(), [w, j] = y.useState([]), { hours: M, setHours: T, maxPoints: k } = Hs(6);
  y.useEffect(() => {
    v(l);
  }, [l, v]);
  const E = Vp(l, c, u), U = E.map((de) => de.pot).join(","), Y = Number(b.get("pot") || 0), P = Y >= 1 && Y <= 4 && kt(Y, c) && E.some((de) => de.pot === Y) ? Y : null, Z = l === "main" ? "sensor.dsc_hub_tent_temperature" : "sensor.dsc_hub_clone_temperature", G = l === "main" ? "sensor.dsc_hub_tent_humidity" : "sensor.dsc_hub_clone_humidity", Q = l === "main" ? "sensor.dsc_hub_vpd_kpa" : "sensor.dsc_hub_clone_vpd_kpa", te = qe(Z, { hours: M, maxPoints: k }), ae = qe(G, { hours: M, maxPoints: k }), xe = qe(Q, { hours: M, maxPoints: k }), z = Te(Z), W = Te(G), se = Te(Q), K = c(
    l === "main" ? "binary_sensor.dsc_hub_4x8_window_open" : "binary_sensor.dsc_hub_2x4_window_open"
  ) === "on", J = c("light.dsc_hub_sf1000_dimmer") === "on", A = l === "clone" ? J : K, H = l === "main" ? wt("sensor.dsc_cfm_intake_main_allocated", "sensor.dsc_cfm_intake_main", { available: m, num: o }) : wt("sensor.dsc_cfm_intake_2x4_allocated", "sensor.dsc_cfm_intake_2x4", { available: m, num: o }), I = wt(
    "sensor.dsc_cfm_exhaust_out_allocated",
    "sensor.dsc_cfm_exhaust_out",
    { available: m, num: o }
  ), ve = wt(
    "sensor.dsc_cfm_exhaust_recirc_allocated",
    "sensor.dsc_cfm_exhaust_recirc",
    { available: m, num: o }
  ), pe = wt("sensor.dsc_cfm_intake_2x4_allocated", "sensor.dsc_cfm_intake_2x4", {
    available: m,
    num: o
  }), N = wt("sensor.dsc_cfm_intake_main_allocated", "sensor.dsc_cfm_intake_main", {
    available: m,
    num: o
  }), $ = c("switch.dsc_hub_tent_manual_override") === "on", ee = l === "main" ? "4×8 tent" : "2×4 tent", ne = l === "main" ? "Only the 4×8 house in Twin. Cascade-in is a port stub from 2×4, not a second tent." : "Only the 2×4 house in Twin. Cascade-out is a port stub to 4×8.";
  y.useEffect(() => {
    let de = !1;
    async function we() {
      const it = U ? U.split(",").map((oe) => Number(oe)).filter((oe) => Number.isFinite(oe) && oe > 0) : [];
      if (!f || it.length === 0) {
        j([]);
        return;
      }
      const ft = it.flatMap((oe) => [
        `text.dsc_pot${oe}_plant_name`,
        `input_select.dsc_pot${oe}_tent`,
        `select.dsc_pot${oe}_growth_stage`
      ]), ce = /* @__PURE__ */ new Date(), tt = new Date(ce.getTime() - 48 * 3600 * 1e3);
      try {
        const oe = await f({
          type: "history/history_during_period",
          start_time: tt.toISOString(),
          end_time: ce.toISOString(),
          significant_changes_only: !0,
          minimal_response: !0,
          no_attributes: !0,
          entity_ids: ft
        });
        if (de || !oe) return;
        const Ke = [];
        for (const [rt, He] of Object.entries(oe))
          for (const ln of He || []) {
            const _n = typeof ln.lu == "number" ? ln.lu * 1e3 : ln.last_changed ? Date.parse(ln.last_changed) : NaN, yn = String(ln.s ?? ln.state ?? "");
            !Number.isFinite(_n) || !yn || yn === "unavailable" || Ke.push({ t: _n, text: `${new Date(_n).toLocaleString()} · ${rt.split(".").pop()} → ${yn}` });
          }
        Ke.sort((rt, He) => He.t - rt.t), j(Ke.map((rt) => rt.text));
      } catch {
        de || j([]);
      }
    }
    return we(), () => {
      de = !0;
    };
  }, [f, U, l]);
  const re = o(l === "main" ? "number.dsc_hub_target_temp" : "number.dsc_hub_clone_target_temp"), ge = o(l === "main" ? "number.dsc_hub_rh_target_min" : "number.dsc_hub_clone_rh_min"), _e = o(l === "main" ? "number.dsc_hub_rh_target_max" : "number.dsc_hub_clone_rh_max");
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Yt,
      {
        icon: l === "main" ? "tent" : "clone",
        title: ee,
        subtitle: `Tent cockpit — ${E.length} seat(s). ${ne}`,
        primaryAction: /* @__PURE__ */ s.jsx(he, { teal: !0, onClick: () => g("/live/twin"), children: "Both tents" }),
        actions: /* @__PURE__ */ s.jsx(he, { primary: !0, onClick: () => g(`/live/climate?tent=${l}`), children: "Climate Want" })
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-tent-cockpit-strip", children: [
      /* @__PURE__ */ s.jsx(F, { label: `${E.length} plants`, tone: "ok" }),
      /* @__PURE__ */ s.jsx(
        F,
        {
          label: `T ${fc(z.value)}°C`,
          tone: z.stale ? "warn" : "ok",
          onClick: () => p.open({ entityId: Z, label: `${ee} T`, unit: "°C" })
        }
      ),
      /* @__PURE__ */ s.jsx(
        F,
        {
          label: `RH ${fc(W.value, 0)}%`,
          tone: W.stale ? "warn" : "ok",
          onClick: () => p.open({ entityId: G, label: `${ee} RH`, unit: "%" })
        }
      ),
      /* @__PURE__ */ s.jsx(
        F,
        {
          label: `VPD ${fc(se.value, 2)}`,
          tone: se.stale ? "warn" : "ok",
          onClick: () => p.open({ entityId: Q, label: `${ee} VPD`, unit: "kPa" })
        }
      ),
      /* @__PURE__ */ s.jsx(
        F,
        {
          label: l === "clone" ? A ? "SF1000 ON" : "SF1000 OFF" : K ? "PHOTO ON" : "PHOTO OFF",
          tone: A ? "ok" : "muted",
          onClick: () => p.open({
            entityId: l === "clone" ? "light.dsc_hub_sf1000_dimmer" : "binary_sensor.dsc_hub_4x8_window_open",
            label: l === "clone" ? "SF1000" : "4×8 window",
            kind: "binary"
          })
        }
      ),
      /* @__PURE__ */ s.jsx(
        F,
        {
          label: `IN ${fc(H.value, 0)} cfm`,
          tone: "muted",
          onClick: () => p.open({
            entityId: H.entityId,
            label: `${ee} intake CFM`,
            unit: "cfm"
          })
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(rv, { only: l, hero: !0 }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(Bs, { compact: !0 }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(fe, { className: "dsc-glass", title: "Air path", icon: "climate", children: /* @__PURE__ */ s.jsx(
        Lu,
        {
          compact: !0,
          focus: l,
          intakeClone: pe,
          intakeMain: N,
          outCfm: I,
          recircCfm: ve
        }
      ) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(fe, { className: "dsc-glass", title: "Seat strip", icon: "seat", children: /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", children: E.length === 0 ? /* @__PURE__ */ s.jsx("div", { className: "dsc-empty", children: "No pots assigned — Apply to tent from a seat." }) : E.map((de) => {
        const we = Number(c(`sensor.dsc_pot${de.pot}_dryback_pct`)), it = Number.isFinite(we) && we > 45, ft = Tc(de.pot, c), ce = !ft.blockNeedAct && it;
        return /* @__PURE__ */ s.jsxs(
          "button",
          {
            type: "button",
            className: `dsc-chip dsc-chip--ok${ce ? " dsc-chip--pulse" : ""}`,
            onClick: () => {
              const tt = new URLSearchParams(b);
              tt.set("pot", String(de.pot)), x(tt, { replace: !0 });
            },
            children: [
              /* @__PURE__ */ s.jsx(xn, { spec: _a(de.pot, c, u), size: 16 }),
              " P",
              de.pot,
              " ",
              de.plantName,
              " · M ",
              de.moisture,
              " · Need",
              " ",
              ft.blockNeedAct ? `${de.need} (no act)` : de.need,
              it ? " · dryback warn" : ""
            ]
          },
          de.pot
        );
      }) }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(fe, { className: "dsc-glass", title: "Tent history", icon: "climate", children: [
        /* @__PURE__ */ s.jsx(Us, { hours: M, setHours: T, extras: Ls }),
        /* @__PURE__ */ s.jsx(
          gn,
          {
            live: !0,
            lastSyncAt: Math.max(te.lastSyncAt ?? 0, ae.lastSyncAt ?? 0, xe.lastSyncAt ?? 0) || void 0,
            series: [
              {
                id: "t",
                label: "Temp",
                series: te.series,
                color: "var(--dsc-blue)",
                axis: "left",
                unit: "°C",
                band: Number.isFinite(re) ? { min: re - 1.5, max: re + 1.5 } : void 0
              },
              {
                id: "rh",
                label: "RH",
                series: ae.series,
                color: "var(--dsc-teal)",
                axis: "right",
                unit: "%",
                band: { min: ge, max: _e }
              }
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(fe, { className: "dsc-glass", title: "Fans (this tent)", icon: "climate", children: [
        $ ? null : /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Fan sliders locked until Fan override is on (Climate → Command)." }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-fan-stack", children: l === "main" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(
            xa,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_main",
              label: "Intake 4×8",
              disabled: !$
            }
          ),
          /* @__PURE__ */ s.jsx(
            xa,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_room",
              label: "Exhaust room (RECIRC)",
              disabled: !$
            }
          ),
          /* @__PURE__ */ s.jsx(
            xa,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_outside",
              label: "Exhaust outside (OUT)",
              disabled: !$
            }
          )
        ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx(
            xa,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_2x4",
              label: "Intake 2×4",
              disabled: !$
            }
          ),
          /* @__PURE__ */ s.jsx(Fe, { entityId: "light.dsc_hub_sf1000_dimmer", label: "SF1000", icon: "lighting" })
        ] }) })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(fe, { className: "dsc-glass", title: "Plant log (48h)", icon: "roster", children: w.length === 0 ? /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: "Thin recorder / no recent identity changes — honesty empty, not invented." }) : /* @__PURE__ */ s.jsxs("ul", { className: "dsc-fault-list", children: [
        w.slice(0, 40).map((de) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("span", { className: "dsc-muted", style: { fontFamily: "var(--dsc-mono)", fontSize: 12 }, children: de }) }, de)),
        w.length > 40 ? /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsxs("span", { className: "dsc-muted", style: { fontFamily: "var(--dsc-mono)", fontSize: 12 }, children: [
          "+",
          w.length - 40,
          " more"
        ] }) }) : null
      ] }) }) })
    ] }),
    /* @__PURE__ */ s.jsx(
      Dl,
      {
        open: P != null,
        onClose: () => {
          const de = new URLSearchParams(b);
          de.delete("pot"), x(de, { replace: !0 });
        },
        title: P != null ? `Plant seat · POT${P}` : "Plant seat",
        children: P != null ? /* @__PURE__ */ s.jsx(
          Ac,
          {
            pot: P,
            onSelectPot: (de) => {
              const we = new URLSearchParams(b);
              we.set("pot", String(de)), x(we, { replace: !0 });
            }
          }
        ) : null
      }
    )
  ] });
}
function uy() {
  return /* @__PURE__ */ s.jsx(vv, { tent: "main" });
}
function dy() {
  return /* @__PURE__ */ s.jsx(vv, { tent: "clone" });
}
const fy = [
  { label: "OUT", prefix: "dsc_cal_cfm_out", reset: "script.dsc_cal_reset_curve_out" },
  { label: "RECIRC", prefix: "dsc_cal_cfm_recirc", reset: "script.dsc_cal_reset_curve_recirc" },
  { label: "Intake Main", prefix: "dsc_cal_cfm_intake_main", reset: "script.dsc_cal_reset_curve_intake_main" },
  { label: "Intake 2×4", prefix: "dsc_cal_cfm_intake_clone", reset: "script.dsc_cal_reset_curve_intake_clone" }
], bp = [25, 50, 75, 100];
function hy() {
  const { callService: l, entity: c, state: u } = Se(), [o, d] = y.useState(null), f = u("sensor.dsc_learn_status", "—"), m = u("binary_sensor.dsc_learn_gate_open") === "on", g = u("sensor.dsc_learn_activity", "—"), p = String(c("sensor.dsc_cfm_exhaust_out")?.attributes?.cal_curve ?? ""), v = u("sensor.dsc_cfm_curves_status", "—"), b = u("sensor.dsc_learn_phase_b_status", "—"), x = u("input_boolean.dsc_cal_active") === "on", w = String(c("sensor.dsc_learn_status")?.attributes?.trusted_levers ?? "none");
  return /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsxs(fe, { className: "dsc-glass", title: "Anemometer / PPFD cal", icon: "learning", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ s.jsx(F, { label: `Curves ${v}`, tone: v === "—" ? "muted" : "ok" }),
        /* @__PURE__ */ s.jsx(F, { label: x ? "SESSION ON" : "Session idle", tone: x ? "ok" : "muted" })
      ] }),
      /* @__PURE__ */ s.jsxs("p", { className: "dsc-honesty", children: [
        "CFM live numbers live on Climate. This wizard writes cal points only — do not invent them.",
        p ? ` Curve: ${p}` : ""
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-row-actions", children: [
        /* @__PURE__ */ s.jsx(he, { onClick: () => d("gate"), children: "Open gate" }),
        /* @__PURE__ */ s.jsx(he, { onClick: () => d("sample"), children: "Sample points" }),
        /* @__PURE__ */ s.jsx(he, { teal: !0, onClick: () => d("accept"), children: "Finish session" }),
        /* @__PURE__ */ s.jsx(he, { onClick: () => d("curves"), children: "Stored curves" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs(fe, { className: "dsc-glass", title: "Climate learn (Phase A/B)", icon: "learning", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ s.jsx(F, { label: `Status ${f}`, tone: f === "—" ? "muted" : "ok" }),
        /* @__PURE__ */ s.jsx(F, { label: m ? "GATE OPEN" : "GATE CLOSED", tone: m ? "ok" : "warn" }),
        /* @__PURE__ */ s.jsx(F, { label: `Activity ${g}`, tone: "muted" }),
        /* @__PURE__ */ s.jsx(F, { label: `B ${b}`, tone: b === "off" || b === "—" ? "muted" : "ok" }),
        /* @__PURE__ */ s.jsx(F, { label: `Trusted ${w}`, tone: "muted" })
      ] }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: "One air appliance at a time. Fans/mat may stay on. Activity is SoT — gate open ≠ measuring. Phase B stays off until Activity shows samples climbing." }),
      /* @__PURE__ */ s.jsx(he, { onClick: () => d("climate"), children: "Learn enable" })
    ] }),
    /* @__PURE__ */ s.jsxs(Ot, { open: o === "gate", onDismiss: () => d(null), title: "Learn gate", help: null, children: [
      /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Target + session. Scripts own hold math." }),
      /* @__PURE__ */ s.jsx(Ya, { entityId: "input_select.dsc_cal_target", label: "Cal target" }),
      /* @__PURE__ */ s.jsx("p", { className: "dsc-kpi-sub", children: u("input_text.dsc_cal_status", "") }),
      /* @__PURE__ */ s.jsx(
        he,
        {
          primary: !0,
          onClick: () => {
            l("script", "turn_on", { entity_id: "script.dsc_cal_start" }), d("sample");
          },
          children: "Start session"
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs(Ot, { open: o === "sample", onDismiss: () => d(null), title: "Sample", help: null, children: [
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
        /* @__PURE__ */ s.jsx(he, { onClick: () => void l("script", "turn_on", { entity_id: "script.dsc_cal_hold_next" }), children: "Re-hold" }),
        /* @__PURE__ */ s.jsx(he, { primary: !0, onClick: () => void l("script", "turn_on", { entity_id: "script.dsc_cal_save_point" }), children: "Save point" }),
        /* @__PURE__ */ s.jsx(he, { onClick: () => void l("script", "turn_on", { entity_id: "script.dsc_cal_skip_point" }), children: "Skip" }),
        /* @__PURE__ */ s.jsx(he, { onClick: () => void l("script", "turn_on", { entity_id: "script.dsc_cal_abort" }), children: "Abort" })
      ] })
    ] }),
    /* @__PURE__ */ s.jsx(
      Ot,
      {
        open: o === "accept",
        onDismiss: () => d(null),
        onConfirm: () => {
          l("script", "turn_on", { entity_id: "script.dsc_cal_finish" }), d(null);
        },
        title: "Finish session",
        confirmLabel: "Finish",
        help: null,
        children: /* @__PURE__ */ s.jsxs("p", { children: [
          "Curve status ",
          v,
          ". Finish restores snapped fans/light. Points already saved at 25/50/75/100 stay; this does not invent a fit."
        ] })
      }
    ),
    /* @__PURE__ */ s.jsxs(
      Ot,
      {
        open: o === "climate",
        onDismiss: () => d(null),
        onConfirm: () => d(null),
        title: "Climate learn enable",
        confirmLabel: "Done",
        help: null,
        children: [
          /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "Toggles HA helpers. No invented samples. Blocked while failsafe/takeover/fault." }),
          /* @__PURE__ */ s.jsx(Fe, { entityId: "input_boolean.dsc_climate_learn_enabled", label: "Phase A enabled" }),
          /* @__PURE__ */ s.jsx(Fe, { entityId: "input_boolean.dsc_climate_learn_phase_b_enabled", label: "Phase B enabled" }),
          /* @__PURE__ */ s.jsx(Fe, { entityId: "input_boolean.dsc_learn_phase_b_locked", label: "Phase B lock" }),
          /* @__PURE__ */ s.jsxs("div", { className: "dsc-target-grid", children: [
            /* @__PURE__ */ s.jsx(Qe, { entityId: "input_number.dsc_learn_alpha", label: "EMA α" }),
            /* @__PURE__ */ s.jsx(Qe, { entityId: "input_number.dsc_learn_min_samples", label: "Min samples" })
          ] }),
          /* @__PURE__ */ s.jsxs("p", { className: "dsc-kpi-sub", children: [
            "Gate ",
            m ? "open" : "closed",
            " · ",
            g,
            " · trusted ",
            w
          ] })
        ]
      }
    ),
    /* @__PURE__ */ s.jsxs(Ot, { open: o === "curves", onDismiss: () => d(null), title: "Stored curves", help: null, children: [
      /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: "0 = unset → linear % × nameplate. Do not invent points. Reset scripts wipe a curve; they do not guess a fit." }),
      fy.map((j) => /* @__PURE__ */ s.jsxs("div", { className: "dsc-cal-curve", children: [
        /* @__PURE__ */ s.jsx("strong", { children: j.label }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-target-grid", children: bp.map((M) => /* @__PURE__ */ s.jsx(
          Qe,
          {
            entityId: `input_number.${j.prefix}_${M}`,
            label: `@${M}%`
          },
          `${j.prefix}_${M}`
        )) }),
        /* @__PURE__ */ s.jsxs(
          he,
          {
            onClick: () => void l("script", "turn_on", { entity_id: j.reset }),
            children: [
              "Reset ",
              j.label
            ]
          }
        )
      ] }, j.prefix)),
      /* @__PURE__ */ s.jsx("strong", { children: "SF1000 PPFD" }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-target-grid", children: bp.map((j) => /* @__PURE__ */ s.jsx(Qe, { entityId: `input_number.dsc_cal_ppfd_${j}`, label: `@${j}%` }, `ppfd_${j}`)) }),
      /* @__PURE__ */ s.jsx(
        he,
        {
          onClick: () => void l("script", "turn_on", { entity_id: "script.dsc_cal_reset_curve_sf1000" }),
          children: "Reset PPFD"
        }
      )
    ] })
  ] });
}
function my() {
  const { available: l, num: c, state: u } = Se(), o = u("input_boolean.dsc_tank_in_service") === "on", d = l("input_number.dsc_tank_level_pct") || l("sensor.dsc_tank_level_pct"), f = l("sensor.dsc_tank_level_pct") ? c("sensor.dsc_tank_level_pct") : c("input_number.dsc_tank_level_pct"), m = d && Number.isFinite(f), g = l("sensor.dsc_tank_ec_normalized"), p = l("sensor.dsc_tank_ph_calibrated"), v = l("sensor.water_tester_temperature"), b = u("input_boolean.dsc_tank_pump_active") === "on", x = m ? Math.max(4, Math.min(100, f)) : 0;
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-tank-cutaway", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: [
      /* @__PURE__ */ s.jsx(F, { label: o ? "In service" : "OOS", tone: o ? "ok" : "warn" }),
      m ? null : /* @__PURE__ */ s.jsx(F, { label: "Level unknown — empty, not guessed", tone: "warn" }),
      b ? /* @__PURE__ */ s.jsx(F, { label: "Pump ON", tone: "ok", pulse: !0 }) : /* @__PURE__ */ s.jsx(F, { label: "Pump off", tone: "muted" })
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
          y: 26 + 176 * (1 - x / 100),
          width: "124",
          height: 176 * x / 100,
          fill: "rgba(38,198,218,0.22)"
        }
      ) : null,
      g ? /* @__PURE__ */ s.jsx("rect", { x: "32", y: "36", width: "116", height: "10", fill: "rgba(255,183,77,0.55)" }) : null,
      /* @__PURE__ */ s.jsx("rect", { x: "24", y: "18", width: "132", height: "12", fill: "none", stroke: p ? "var(--dsc-purple)" : "var(--dsc-gray-5)", strokeWidth: "3" }),
      b ? [0, 1, 2].map((w) => /* @__PURE__ */ s.jsx("circle", { cx: 90 + (w - 1) * 18, cy: "188", r: "4", fill: "var(--dsc-teal)", opacity: 0.5 + w * 0.15 }, w)) : null
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-kpi-sub", children: [
      "EC ",
      g ? `${Math.round(c("sensor.dsc_tank_ec_normalized"))} µS` : "—",
      " · pH",
      " ",
      p ? c("sensor.dsc_tank_ph_calibrated").toFixed(2) : "—",
      " · T",
      " ",
      v ? `${c("sensor.water_tester_temperature").toFixed(1)} °C` : "—"
    ] })
  ] });
}
const _p = ["var(--dsc-blue)", "var(--dsc-teal)", "var(--dsc-purple)", "var(--dsc-amber)"];
function py() {
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Yt,
      {
        icon: "learning",
        title: "Learning",
        subtitle: "Anemometer gate, sample, accept — scripts own the math. No dsc-hub-pro."
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(hy, {}) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(fe, { className: "dsc-glass", title: "Kit / In service", icon: "settings", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-row", children: [
        /* @__PURE__ */ s.jsx(Fe, { entityId: "input_boolean.dsc_ac_in_service", label: "AC in service", icon: "climate" }),
        /* @__PURE__ */ s.jsx(
          Fe,
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
function vy() {
  const { state: l } = Se(), { hours: c, setHours: u, maxPoints: o } = Hs(6), d = qe("sensor.dsc_hub_tent_temperature", { maxPoints: o, hours: c }), f = qe("sensor.dsc_hub_tent_humidity", { maxPoints: o, hours: c }), m = qe(nn(1, "moisture", l), { maxPoints: o, hours: c }), g = qe(nn(2, "moisture", l), { maxPoints: o, hours: c }), p = qe(nn(3, "moisture", l), { maxPoints: o, hours: c }), v = qe(nn(4, "moisture", l), { maxPoints: o, hours: c }), x = [
    { n: 1, series: m },
    { n: 2, series: g },
    { n: 3, series: p },
    { n: 4, series: v }
  ].filter((j) => kt(j.n, l)), w = qn.filter((j) => kt(j, l)).map((j) => ({ n: j, need: l(`sensor.dsc_pot${j}_need_summary`, "—") })).find((j) => j.need && j.need !== "—" && !/^ok$/i.test(j.need));
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Yt,
      {
        icon: "analytics",
        title: "Analytics",
        subtitle: "In-service pots. Climate charts live on Climate; this is the root pack."
      }
    ),
    /* @__PURE__ */ s.jsx("div", { className: "dsc-chip-row", style: { marginBottom: 12 }, children: /* @__PURE__ */ s.jsx(
      Us,
      {
        hours: c,
        setHours: u,
        extras: Ls
      }
    ) }),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(fe, { className: "dsc-glass", title: "Tent T + RH (secondary)", icon: "climate", children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Primary traces sit on Climate. Ghost/compare there, not a second dashboard." }),
        /* @__PURE__ */ s.jsx(
          gn,
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
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(fe, { className: "dsc-glass", title: "Root pack — moisture (in service)", icon: "root", children: [
        x.length ? /* @__PURE__ */ s.jsx(
          gn,
          {
            live: !0,
            unit: "%",
            lastSyncAt: Math.max(...x.map((j) => j.series.lastSyncAt ?? 0)) || void 0,
            series: x.map((j, M) => ({
              id: `p${j.n}`,
              label: w?.n === j.n ? `P${j.n} Need` : `P${j.n}`,
              series: j.series.series,
              color: _p[M % _p.length],
              unit: "%"
            }))
          }
        ) : /* @__PURE__ */ s.jsx("p", { className: "dsc-muted", children: "No in-service pots." }),
        w ? /* @__PURE__ */ s.jsxs("p", { className: "dsc-kpi-sub", children: [
          "Worst Need P",
          w.n,
          ": ",
          w.need
        ] }) : null
      ] }) })
    ] })
  ] });
}
function gy() {
  const { state: l, available: c, num: u } = Se(), o = pv(), d = Yn(), f = fv({ state: l, available: c }, o), m = hv(f), g = wt("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available: c,
    num: u
  }), p = (b) => d.open({
    entityId: b.entityId,
    label: b.label,
    kind: "kit",
    runtimeToday: b.runtimeToday,
    cyclesToday: b.cyclesToday,
    demandEntity: b.demandEntity
  }), v = [
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
      Yt,
      {
        icon: "fleet",
        title: "Fleet",
        subtitle: `${m.inService} of ${m.total} in service. Kit Pulse holes, tank tester, bridge table.`
      }
    ),
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(dv, {}) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(
        an,
        {
          label: "In service",
          value: `${m.inService}/${m.total}`,
          tone: m.dark > 0 ? "bad" : "ok"
        }
      ) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ s.jsx(
        an,
        {
          label: "Surface",
          value: l("sensor.dsc_ha_surface_version", "7.2.0"),
          sub: "Panel product shell"
        }
      ) }),
      /* @__PURE__ */ s.jsxs("div", { className: "dsc-col-4", children: [
        /* @__PURE__ */ s.jsx(
          an,
          {
            label: "Alerts",
            value: Number.isFinite(u("sensor.dsc_active_alert_count")) ? u("sensor.dsc_active_alert_count") : "—",
            tone: u("sensor.dsc_active_alert_count", 0) === 0 ? "ok" : "bad"
          }
        ),
        /* @__PURE__ */ s.jsx(Hu, { readings: [g] })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsxs(fe, { className: "dsc-glass", title: "Kit Pulse", icon: "system", children: [
        /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", style: { marginTop: 0 }, children: "Holes are missing / planned OOS / dark after cooldown — not a greenwashed map." }),
        /* @__PURE__ */ s.jsx(mv, { nodes: f, onSelect: p })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ s.jsx(fe, { className: "dsc-glass", title: "Kit / In service", icon: "settings", children: /* @__PURE__ */ s.jsxs("div", { className: "dsc-mode-row", children: [
        /* @__PURE__ */ s.jsx(Fe, { entityId: "input_boolean.dsc_ac_in_service", label: "AC in service", icon: "climate" }),
        /* @__PURE__ */ s.jsx(
          Fe,
          {
            entityId: "input_boolean.dsc_clone_humidifier_in_service",
            label: "Clone mister",
            icon: "clone"
          }
        ),
        /* @__PURE__ */ s.jsx(Fe, { entityId: "input_boolean.dsc_pot1_in_service", label: "Pot 1", icon: "root" }),
        /* @__PURE__ */ s.jsx(Fe, { entityId: "input_boolean.dsc_pot2_in_service", label: "Pot 2", icon: "root" }),
        /* @__PURE__ */ s.jsx(Fe, { entityId: "input_boolean.dsc_pot3_in_service", label: "Pot 3", icon: "root" }),
        /* @__PURE__ */ s.jsx(Fe, { entityId: "input_boolean.dsc_pot4_in_service", label: "Pot 4", icon: "root" }),
        /* @__PURE__ */ s.jsx(Fe, { entityId: "input_boolean.dsc_tank_in_service", label: "Tank", icon: "tank" })
      ] }) }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsxs(fe, { className: "dsc-glass", title: "Tank", icon: "tank", children: [
        /* @__PURE__ */ s.jsx(my, {}),
        /* @__PURE__ */ s.jsxs("p", { className: "dsc-kpi-sub", children: [
          "Stage ",
          l("input_select.dsc_tank_stage", "—"),
          " · Type",
          " ",
          l("input_select.dsc_tank_plant_type", "—")
        ] })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ s.jsx(fe, { className: "dsc-glass", title: "Bridge / firmware", icon: "fleet", children: /* @__PURE__ */ s.jsxs("table", { className: "dsc-table", children: [
        /* @__PURE__ */ s.jsx("thead", { children: /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("th", { children: "Signal" }),
          /* @__PURE__ */ s.jsx("th", { children: "State" })
        ] }) }),
        /* @__PURE__ */ s.jsx("tbody", { children: v.map((b) => /* @__PURE__ */ s.jsxs("tr", { children: [
          /* @__PURE__ */ s.jsx("td", { children: b.label }),
          /* @__PURE__ */ s.jsx("td", { children: c(b.id) ? l(b.id, "—") : /* @__PURE__ */ s.jsx(F, { label: "hole", tone: "warn" }) })
        ] }, b.id)) })
      ] }) }) })
    ] })
  ] });
}
const xy = [
  { id: "live", label: "Live", path: "/live/mission", icon: "live" },
  { id: "grow", label: "Grow", path: "/grow/compose", icon: "grow" },
  { id: "tune", label: "Tune", path: "/tune/learning", icon: "tune" },
  { id: "fleet", label: "Fleet", path: "/fleet", icon: "fleet" }
], by = {
  live: [
    { id: "mission", label: "Mission", path: "/live/mission", icon: "mission" },
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
  fleet: [{ id: "overview", label: "Overview", path: "/fleet", icon: "fleet" }]
}, _y = {
  "/": "/live/mission",
  "/ops": "/live/mission",
  "/ops/home": "/live/mission",
  "/ops/dash": "/live/twin",
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
function yy(l) {
  return l.startsWith("/grow") || l.startsWith("/plant") ? "grow" : l.startsWith("/tune") || l.startsWith("/advanced") ? "tune" : l.startsWith("/fleet") || l.startsWith("/system") ? "fleet" : "live";
}
function wy(l, c) {
  const u = _y[l];
  return u ? u.includes("?") ? u : `${u}${c || ""}` : null;
}
const jy = ':host,.dsc-root{--dsc-black: #0c1220;--dsc-black-2: #121a2c;--dsc-gray-1: #182238;--dsc-gray-2: #22304c;--dsc-gray-3: #334566;--dsc-gray-4: #8b95ab;--dsc-gray-5: #b6bfd4;--dsc-blue: #5b9bff;--dsc-blue-dim: rgba(91, 155, 255, .4);--dsc-purple: #a78bfa;--dsc-purple-dim: rgba(167, 139, 250, .35);--dsc-neon: #3dde7a;--dsc-neon-dim: rgba(61, 222, 122, .32);--dsc-neon-glow: rgba(61, 222, 122, .4);--dsc-teal: #2ec4d6;--dsc-teal-dim: rgba(46, 196, 214, .45);--dsc-teal-glow: rgba(46, 196, 214, .55);--dsc-amber: #ffb74d;--dsc-bad: #ff6b8a;--dsc-bad-soft: #ff8aa3;--dsc-soil-1: #5b9f6b;--dsc-soil-2: #4a8f9f;--dsc-soil-3: #c4a35a;--dsc-soil-4: #8d6e63;--dsc-glass: rgba(18, 26, 44, .78);--dsc-glass-border: rgba(130, 165, 230, .34);--dsc-white: #f2f5fb;--dsc-shadow: 0 8px 24px rgba(0, 0, 0, .45);--dsc-shadow-tight: 0 2px 8px rgba(0, 0, 0, .55);--dsc-radius: 10px;--dsc-radius-lg: 14px;--dsc-font: "Segoe UI", "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;--dsc-mono: "Cascadia Code", "IBM Plex Mono", ui-monospace, monospace;color:var(--dsc-white);background:var(--dsc-black);font-family:var(--dsc-font);display:block;height:100%;box-sizing:border-box}*,*:before,*:after{box-sizing:border-box}.dsc-root{height:100%;min-height:100%;overflow:auto;background:radial-gradient(1100px 560px at 8% -12%,rgba(91,155,255,.18),transparent 55%),radial-gradient(900px 520px at 92% -8%,rgba(46,196,214,.12),transparent 50%),radial-gradient(700px 420px at 70% 100%,rgba(61,222,122,.05),transparent 55%),var(--dsc-black)}.dsc-honesty-rail{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}.dsc-next-rec{border-color:var(--dsc-blue-dim)}.dsc-twin-keepalive{position:fixed;inset:0;visibility:hidden;pointer-events:none;z-index:-1;overflow:hidden;margin:0;min-height:0}.dsc-twin-keepalive.is-active{position:relative;inset:auto;visibility:visible;pointer-events:auto;z-index:auto;overflow:visible;margin-bottom:12px;min-height:min(70vh,720px)}.dsc-twin-keepalive:not(.is-active),.dsc-twin-keepalive:not(.is-active) *{pointer-events:none!important}.dsc-twin-keepalive-host{min-height:min(68vh,700px)}.dsc-twin-keepalive.is-active .dsc-twin-keepalive-host,.dsc-twin-keepalive.is-active .dsc-twin-keepalive-host>*{min-height:min(68vh,700px);pointer-events:auto}.dsc-tab--live.active{color:var(--dsc-blue);border-color:var(--dsc-blue-dim)}.dsc-tab--grow.active{color:var(--dsc-teal);border-color:var(--dsc-teal-dim)}.dsc-tab--tune.active{color:var(--dsc-purple);border-color:var(--dsc-purple-dim)}.dsc-tab--fleet.active{color:var(--dsc-blue);border-color:var(--dsc-blue-dim)}.dsc-secondary-tabs .dsc-tab.active{color:var(--dsc-teal);border-color:var(--dsc-teal-dim);box-shadow:0 0 0 1px var(--dsc-blue-dim)}.dsc-tent-segment{display:inline-flex;gap:4px;padding:3px;border-radius:999px;background:var(--dsc-gray-1);border:1px solid var(--dsc-glass-border)}.dsc-tent-segment button{appearance:none;border:0;background:transparent;color:var(--dsc-gray-5);padding:6px 12px;border-radius:999px;cursor:pointer;font:inherit;font-size:.85rem}.dsc-tent-segment button.is-active{background:var(--dsc-gray-2);color:var(--dsc-white);box-shadow:var(--dsc-shadow-tight)}.dsc-tent-segment button[data-tent=main].is-active{color:var(--dsc-blue)}.dsc-tent-segment button[data-tent=clone].is-active{color:var(--dsc-purple)}.dsc-tent-segment button[data-tent=compare].is-active{color:var(--dsc-teal)}.dsc-shell{display:flex;flex-direction:column;min-height:100%;max-width:1600px;margin:0 auto;padding:16px 20px 28px}.dsc-brand-row{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:10px}.dsc-brand{display:flex;align-items:center;gap:12px;color:var(--dsc-white);text-decoration:none}.dsc-brand img,.dsc-brand svg{width:36px;height:36px;color:var(--dsc-neon)}.dsc-brand-title{display:flex;flex-direction:column;gap:2px}.dsc-brand-title strong{font-size:1.05rem;letter-spacing:.04em;font-weight:700;line-height:1.25;max-width:min(52vw,28rem)}.dsc-brand-wordmark{height:18px;width:auto;max-width:160px;display:block;color:var(--dsc-text, #eef1f8);line-height:0}.dsc-brand-wordmark svg{width:auto;height:18px;display:block}.dsc-icon svg{width:100%;height:100%;display:block}.dsc-brand-title span{font-size:.72rem;color:var(--dsc-gray-5);letter-spacing:.08em;text-transform:uppercase}.dsc-page-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px}.dsc-page-header-main{display:flex;align-items:flex-start;gap:10px}.dsc-page-header-actions{display:flex;align-items:center;gap:6px;flex-shrink:0}.dsc-card-title{display:inline-flex;align-items:center;gap:8px}.dsc-primary-tabs,.dsc-secondary-tabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:thin;padding-bottom:2px;-webkit-overflow-scrolling:touch}.dsc-primary-tabs{border-bottom:1px solid var(--dsc-gray-3);margin-bottom:8px}.dsc-secondary-tabs{margin-bottom:16px;mask-image:linear-gradient(90deg,#000 85%,transparent)}.dsc-secondary-tabs:after{content:"";flex:0 0 12px}.dsc-tab{appearance:none;border:1px solid transparent;background:transparent;color:var(--dsc-gray-5);padding:10px 14px;min-height:44px;border-radius:8px 8px 0 0;cursor:pointer;font:inherit;font-size:.92rem;letter-spacing:.04em;white-space:nowrap;display:inline-flex;align-items:center;gap:8px;transition:transform .1s ease,box-shadow .1s ease,color .15s ease,border-color .15s ease,background .15s ease;text-decoration:none}.dsc-tab span[role=img]{opacity:.9;flex-shrink:0}.dsc-tab:hover{color:var(--dsc-white);background:var(--dsc-gray-1)}.dsc-tab:focus-visible{outline:2px solid var(--dsc-neon);outline-offset:2px}.dsc-tab.active{color:var(--dsc-white);border-bottom:2px solid var(--dsc-neon);box-shadow:0 6px 18px #39ff1414}.dsc-secondary-tabs .dsc-tab{border-radius:999px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-1);min-height:40px;padding:8px 14px}.dsc-secondary-tabs .dsc-tab.active{border-color:var(--dsc-neon-dim);color:var(--dsc-neon);background:#39ff1414;box-shadow:var(--dsc-shadow-tight)}.dsc-btn{appearance:none;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);border-radius:8px;padding:10px 16px;min-height:40px;font:inherit;cursor:pointer;box-shadow:var(--dsc-shadow-tight);transition:transform .1s ease,box-shadow .1s ease,border-color .12s ease,background .12s ease}.dsc-btn:hover{border-color:var(--dsc-neon-dim)}.dsc-btn:active,.dsc-tab:active{transform:translateY(1px);box-shadow:0 1px 3px #000000a6}.dsc-btn.primary{border-color:var(--dsc-neon-dim);color:var(--dsc-black);background:var(--dsc-neon);font-weight:650}.dsc-page{animation:dsc-fade .18s ease}@keyframes dsc-fade{0%{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.dsc-page,.dsc-btn,.dsc-tab,.dsc-live-pulse{animation:none!important;transition:none!important}}.dsc-grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:14px}.dsc-col-3{grid-column:span 3}.dsc-col-4{grid-column:span 4}.dsc-col-6{grid-column:span 6}.dsc-col-8{grid-column:span 8}.dsc-col-12{grid-column:span 12}@media(max-width:1100px){.dsc-col-3,.dsc-col-4{grid-column:span 6}.dsc-col-8{grid-column:span 12}}@media(max-width:720px){.dsc-shell{padding:12px}.dsc-col-3,.dsc-col-4,.dsc-col-6,.dsc-col-8{grid-column:span 12}}.dsc-card{background:linear-gradient(165deg,var(--dsc-gray-1),var(--dsc-black-2));border:1px solid var(--dsc-gray-3);border-radius:var(--dsc-radius);box-shadow:var(--dsc-shadow);padding:14px 16px;min-height:88px}.dsc-card h2,.dsc-card h3{margin:0 0 8px;font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;color:var(--dsc-gray-5);font-weight:600}.dsc-kpi-value{font-size:1.85rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:.02em;color:var(--dsc-white)}.dsc-kpi-unit{margin-left:6px;font-size:.85rem;color:var(--dsc-gray-5)}.dsc-kpi-sub{margin-top:6px;color:var(--dsc-gray-5);font-size:.82rem}.dsc-status-ok{color:var(--dsc-neon)}.dsc-status-warn{color:var(--dsc-amber)}.dsc-status-bad{color:var(--dsc-bad)}.dsc-status-muted{color:var(--dsc-gray-5)}.dsc-page-title{margin:0 0 14px;font-size:1.35rem;letter-spacing:.04em}.dsc-muted{color:var(--dsc-gray-5)}.dsc-legacy-host{min-height:420px;border-radius:var(--dsc-radius);overflow:hidden;border:1px solid var(--dsc-gray-3);background:#000}.dsc-legacy-host--empty{background:var(--dsc-gray-1);min-height:160px}.dsc-legacy-host>*{display:block;width:100%}.dsc-status-strip{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}.dsc-chip-row{display:flex;flex-wrap:wrap;gap:8px}.dsc-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-1);font-size:.75rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-chip--ok{color:var(--dsc-neon);border-color:var(--dsc-neon-dim);background:#39ff1414;box-shadow:0 0 12px #39ff141f}.dsc-chip--bad{color:var(--dsc-bad-soft);border-color:color-mix(in srgb,var(--dsc-bad) 45%,transparent);background:color-mix(in srgb,var(--dsc-bad) 12%,transparent)}.dsc-chip--warn{color:var(--dsc-amber);border-color:color-mix(in srgb,var(--dsc-amber) 45%,transparent);background:color-mix(in srgb,var(--dsc-amber) 12%,transparent)}.dsc-chip--muted{color:var(--dsc-gray-5)}.dsc-chip--pulse{animation:dsc-chip-pulse 1.6s ease-in-out infinite}@keyframes dsc-chip-pulse{0%,to{box-shadow:0 0 #39ff1400}50%{box-shadow:0 0 14px #39ff1459}}.dsc-demand-row{display:flex;flex-wrap:wrap;gap:8px}.dsc-demand-row--stack{flex-direction:column}.dsc-demand{appearance:none;flex:1 1 110px;min-height:52px;padding:10px 12px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);font:inherit;cursor:pointer;display:flex;flex-direction:column;align-items:flex-start;gap:4px;box-shadow:var(--dsc-shadow-tight);transition:transform .1s ease,box-shadow .1s ease,border-color .12s ease,background .12s ease}.dsc-demand:hover{border-color:var(--dsc-neon-dim)}.dsc-demand:active{transform:translateY(1px);box-shadow:0 1px 3px #000000a6}.dsc-demand.is-on{border-color:var(--dsc-neon);background:#39ff141a;box-shadow:0 0 0 1px #39ff1440,0 0 18px #39ff1433}.dsc-demand.is-missing{opacity:.55;cursor:not-allowed}.dsc-demand-label{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-demand.is-on .dsc-demand-label{color:var(--dsc-neon)}.dsc-demand-state{font-weight:700;font-variant-numeric:tabular-nums;font-size:1rem}.dsc-demand-icon{margin-bottom:4px;opacity:.95}.dsc-mode-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}.dsc-mode-selects{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}.dsc-entity-select{display:flex;flex-direction:column;gap:6px;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-entity-select-label{display:inline-flex;align-items:center;gap:6px}.dsc-entity-select select{appearance:none;min-height:40px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);padding:8px 12px;font:inherit;text-transform:none;letter-spacing:0}.dsc-entity-select.is-disabled{opacity:.55}.dsc-fan-stack{display:flex;flex-direction:column;gap:10px}.dsc-fan-slider{display:flex;flex-direction:column;gap:4px}.dsc-fan-slider-label{display:flex;align-items:baseline;gap:8px;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-fan-slider-label strong{color:var(--dsc-teal);font-variant-numeric:tabular-nums}.dsc-fan-slider input[type=range]{width:100%;accent-color:var(--dsc-teal)}.dsc-fan-slider.is-disabled{opacity:.5}.dsc-honesty{margin:10px 0 0;font-size:.85rem;color:var(--dsc-gray-5);display:flex;flex-wrap:wrap;align-items:center;gap:8px}.dsc-target-panel{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}.dsc-target-panel.is-compact .dsc-target-grid{grid-template-columns:repeat(auto-fit,minmax(90px,1fr))}.dsc-tent-targets{border:1px solid var(--dsc-glass-border);border-radius:var(--dsc-radius);padding:10px 12px;background:#0000002e}.dsc-tent-targets-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}.dsc-got-want{display:flex;flex-direction:column;gap:2px;font-size:.82rem;margin-bottom:10px}.dsc-target-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px}.dsc-target-num{display:flex;flex-direction:column;gap:4px;font-size:.7rem;letter-spacing:.06em;color:var(--dsc-gray-5)}.dsc-target-num-label{text-transform:uppercase}.dsc-target-num input,.dsc-target-num textarea{min-height:36px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);padding:6px 8px;font:inherit;font-variant-numeric:tabular-nums}.dsc-target-num textarea{text-transform:none;letter-spacing:0;min-height:56px;resize:vertical}.dsc-target-num.is-disabled{opacity:.55}.dsc-chart{position:relative}.dsc-chart-svg{cursor:crosshair;touch-action:none}.dsc-chart-tooltip{position:absolute;top:8px;transform:translate(-50%);pointer-events:none;z-index:2;min-width:120px;padding:8px 10px;border-radius:8px;border:1px solid var(--dsc-glass-border);background:var(--dsc-glass);backdrop-filter:blur(10px);box-shadow:var(--dsc-shadow-tight);font-size:.75rem}.dsc-chart-tooltip-time{color:var(--dsc-teal);font-family:var(--dsc-mono);margin-bottom:4px}.dsc-chart-tooltip-row{display:flex;align-items:center;gap:6px;color:var(--dsc-white)}.dsc-chart-tooltip-row i{width:7px;height:7px;border-radius:50%;display:inline-block}@keyframes dsc-sync-pulse{0%{stroke-dashoffset:1;opacity:.2}35%{opacity:1}to{stroke-dashoffset:0;opacity:0}}@media(prefers-reduced-motion:reduce){.dsc-chart-pulse{animation:none!important;opacity:.85}}.dsc-gauge.is-warn .dsc-gauge-label{color:var(--dsc-amber)}.dsc-gauge-row{display:flex;justify-content:space-around;flex-wrap:wrap;gap:8px}.dsc-gauge-matrix{display:flex;flex-direction:column;gap:8px}.dsc-gauge-row-3{display:grid;grid-template-columns:14px repeat(3,minmax(0,1fr));align-items:center;gap:2px 4px;border:1px solid transparent;border-radius:12px;padding:2px 4px 4px;transition:box-shadow .25s ease,border-color .25s ease,background .25s ease}.dsc-gauge-row-3.is-lit{border-color:#ffd54f80;background:linear-gradient(180deg,#ffc1071a,#0c121c59);box-shadow:0 0 28px #ffc10747,inset 0 0 16px #ffd54f12}.dsc-gauge-row-tag{font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--dsc-gray-5);writing-mode:vertical-rl;transform:rotate(180deg);justify-self:center;padding:2px 0}.dsc-gauge-row-3 .dsc-gauge{min-width:0}.dsc-gauge-cell{min-width:0;display:flex;flex-direction:column;align-items:center;gap:2px}.dsc-gauge-cell .dsc-sparkline{width:100%;max-width:88px;opacity:.9}.dsc-gauge-row-3 .dsc-gauge svg{width:100%;max-width:96px;height:auto;max-height:72px}.dsc-gauge-row-3 .dsc-gauge-label{font-size:10px}.dsc-gauge-zone{border:1px solid transparent;border-radius:12px;padding:8px 6px 10px;transition:box-shadow .25s ease,border-color .25s ease,background .25s ease}.dsc-gauge-zone.is-lit{border-color:#ffd54f80;background:linear-gradient(180deg,#ffc1071a,#0c121c59);box-shadow:0 0 28px #ffc10747,inset 0 0 16px #ffd54f12}.dsc-gauge-zone-label{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5);margin:0 4px 6px}.dsc-gauge{display:flex;flex-direction:column;align-items:center;gap:4px}.dsc-gauge-label{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-chart-legend{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:4px;min-height:20px}.dsc-chart-legend-item{display:inline-flex;align-items:center;gap:6px;font-size:.75rem;color:var(--dsc-gray-5)}.dsc-chart-legend-item i{width:8px;height:8px;border-radius:50%;display:inline-block;box-shadow:0 0 6px currentColor}.dsc-chart-last{margin-left:auto;font-variant-numeric:tabular-nums;color:var(--dsc-neon);font-size:13px;font-weight:650}.dsc-fault-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.dsc-fault-list li{display:flex;flex-wrap:wrap;align-items:center;gap:10px}.dsc-empty{padding:18px 14px;border:1px dashed var(--dsc-gray-3);border-radius:8px;color:var(--dsc-gray-5);background:#00000040;font-size:.9rem;line-height:1.45}.dsc-empty--ok{border-style:solid;border-color:var(--dsc-neon-dim);color:var(--dsc-neon)}.dsc-btn:disabled{opacity:.45;cursor:not-allowed}.dsc-glass{background:var(--dsc-glass);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid var(--dsc-glass-border);border-radius:var(--dsc-radius-lg);box-shadow:var(--dsc-shadow)}.dsc-glass--glow{border-color:var(--dsc-teal-dim);box-shadow:0 0 0 1px #26c6da26,0 0 24px #26c6da1f}.dsc-icon-btn{appearance:none;width:36px;height:36px;padding:0;display:inline-flex;align-items:center;justify-content:center;border-radius:10px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);cursor:pointer;box-shadow:var(--dsc-shadow-tight);transition:border-color .12s ease,background .12s ease,transform .1s ease}.dsc-icon-btn:hover{border-color:var(--dsc-teal-dim);color:var(--dsc-teal)}.dsc-icon-btn:active{transform:translateY(1px)}.dsc-result-chip{display:inline-flex;align-items:center;gap:8px;max-width:100%;padding:8px 12px;border-radius:999px;border:1px solid var(--dsc-teal-dim);background:#26c6da1a;color:var(--dsc-white);font-size:.9rem}.dsc-result-chip span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dsc-overflow{position:relative;display:inline-block}.dsc-overflow-menu{position:absolute;right:0;top:calc(100% + 6px);z-index:40;min-width:180px;padding:6px;background:var(--dsc-black-2);border:1px solid var(--dsc-gray-3);border-radius:10px;box-shadow:var(--dsc-shadow)}.dsc-overflow-menu button{appearance:none;width:100%;text-align:left;border:0;background:transparent;color:var(--dsc-white);font:inherit;font-size:.88rem;padding:10px 12px;border-radius:8px;cursor:pointer}.dsc-overflow-menu button:hover{background:#26c6da1f;color:var(--dsc-teal)}.dsc-drawer-root{position:fixed;inset:0;z-index:80;pointer-events:none}.dsc-drawer-root.is-open{pointer-events:auto}.dsc-drawer-scrim{position:absolute;inset:0;background:#00000073;opacity:0;transition:opacity .18s ease}.dsc-drawer-root.is-open .dsc-drawer-scrim{opacity:1}.dsc-drawer-panel{position:absolute;top:0;bottom:0;width:min(380px,92vw);background:linear-gradient(165deg,#121a16,#0a100e);border:1px solid var(--dsc-glass-border);box-shadow:-12px 0 40px #0000008c;display:flex;flex-direction:column;transition:transform .22s ease}.dsc-drawer-panel.right{right:0;transform:translate(105%);border-radius:14px 0 0 14px}.dsc-drawer-panel.left{left:0;transform:translate(-105%);border-radius:0 14px 14px 0}.dsc-drawer-root.is-open .dsc-drawer-panel.right,.dsc-drawer-root.is-open .dsc-drawer-panel.left{transform:none}.dsc-drawer-rail{position:absolute;top:50%;transform:translateY(-50%);width:28px;height:64px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:2}.dsc-drawer-panel.right .dsc-drawer-rail{left:-28px;border-radius:10px 0 0 10px}.dsc-drawer-panel.left .dsc-drawer-rail{right:-28px;border-radius:0 10px 10px 0}.dsc-drawer-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid var(--dsc-gray-3)}.dsc-drawer-head h2{margin:0;font-size:.85rem;letter-spacing:.12em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-drawer-body{flex:1;overflow:auto;padding:14px 16px}.dsc-soil{width:100%;max-width:280px;margin:0 auto}.dsc-soil-pot{position:relative;width:100%;aspect-ratio:4 / 5;border-radius:12px 12px 28px 28px;border:2px solid rgba(120,160,130,.45);background:linear-gradient(180deg,#1a1410,#0e0c0a);overflow:hidden;box-shadow:inset 0 0 24px #0000008c,0 0 20px #26c6da14}.dsc-soil-pot.is-valid{border-color:var(--dsc-teal-dim);box-shadow:inset 0 0 24px #0000008c,0 0 28px #26c6da47,0 0 42px #39ff141f}.dsc-soil-layer{position:absolute;left:8%;right:8%;display:flex;align-items:center;justify-content:center;font-size:.72rem;letter-spacing:.04em;color:#f4f7f4eb;text-shadow:0 1px 2px rgba(0,0,0,.65);border-top:1px solid rgba(255,255,255,.08)}.dsc-soil-empty{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--dsc-gray-5);font-size:.85rem;padding:16px;text-align:center}.dsc-seat-layout{display:grid;grid-template-columns:minmax(200px,320px) 1fr;gap:18px;align-items:start}@media(max-width:900px){.dsc-seat-layout{grid-template-columns:1fr}}.dsc-seat-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.dsc-table{width:100%;border-collapse:collapse;font-size:.88rem}.dsc-table th,.dsc-table td{text-align:left;padding:8px 6px;border-bottom:1px solid var(--dsc-gray-3)}.dsc-table th{font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--dsc-gray-5);font-weight:600}.dsc-table tr{cursor:pointer}.dsc-table tr:hover td{background:#26c6da0f}.dsc-btn.teal{border-color:var(--dsc-teal-dim);background:#26c6da2e;color:var(--dsc-white);box-shadow:0 0 18px #26c6da33}.dsc-btn.teal.primary{background:var(--dsc-teal);color:#041018;font-weight:650}.dsc-held-tag{margin-left:8px;font-size:.65rem;letter-spacing:.08em;color:var(--dsc-amber);vertical-align:middle}.dsc-kpi-hit,.dsc-gauge-hit{appearance:none;border:0;background:transparent;padding:0;margin:0;color:inherit;font:inherit;text-align:left;cursor:pointer;width:100%;display:block}.dsc-card.is-stale,.dsc-gauge.is-stale{opacity:.88;border-color:var(--dsc-amber)}.dsc-gauge.is-clickable:hover,.dsc-kpi-hit:hover .dsc-card{border-color:var(--dsc-blue-dim)}.dsc-timespan{display:inline-flex;flex-wrap:wrap;gap:6px}.dsc-spark-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}.dsc-sparkline{display:block;margin-top:4px}.dsc-gotwant{display:flex;flex-direction:column;gap:10px}.dsc-gotwant-row{display:grid;grid-template-columns:64px 1fr;gap:6px 10px;align-items:center}.dsc-gotwant-label{font-size:.75rem;color:var(--dsc-gray-5);letter-spacing:.04em}.dsc-gotwant-track{position:relative;height:10px;border-radius:999px;background:#ffffff0f;overflow:hidden;grid-column:2}.dsc-gotwant-want{position:absolute;inset:0 auto 0 0;background:#2ec4d647;border-right:1px solid var(--dsc-teal)}.dsc-gotwant-got{position:absolute;inset:2px auto 2px 0;background:linear-gradient(90deg,var(--dsc-blue),var(--dsc-teal));border-radius:999px}.dsc-gotwant-vals{grid-column:2;display:flex;justify-content:space-between;font-size:.72rem;font-family:var(--dsc-mono)}.dsc-seat-editors{display:grid;gap:10px}.dsc-seat-editors label{display:flex;flex-direction:column;gap:4px;font-size:.75rem;color:var(--dsc-gray-5)}.dsc-seat-editors input,.dsc-seat-editors select,.dsc-seat-editors textarea{background:var(--dsc-gray-1);border:1px solid var(--dsc-glass-border);border-radius:8px;color:var(--dsc-white);padding:8px 10px;font:inherit}.dsc-root-matrix .dsc-tone-ok{color:var(--dsc-neon)}.dsc-root-matrix .dsc-tone-warn{color:var(--dsc-amber)}.dsc-root-matrix .dsc-tone-bad{color:var(--dsc-bad)}.dsc-root-matrix .dsc-tone-stale{color:var(--dsc-amber);opacity:.85}.dsc-tent-cockpit-strip{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}@media(prefers-reduced-motion:reduce){.dsc-drawer-panel,.dsc-drawer-scrim{transition:none!important}}.dsc-decision-root{position:fixed;inset:0;z-index:120;display:flex;align-items:center;justify-content:center}.dsc-decision-scrim{position:absolute;inset:0;background:#04080ab8;backdrop-filter:blur(6px)}.dsc-decision-panel{position:relative;z-index:1;width:min(720px,94vw);max-height:86vh;overflow:auto;background:linear-gradient(165deg,#121a16,#0a100e);border:1px solid var(--dsc-glass-border);border-radius:14px;box-shadow:0 24px 80px #0000008c;padding:16px 18px}.dsc-decision-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.dsc-decision-head h2{margin:0;font-size:.95rem;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-decision-help{min-height:8px;margin-top:10px}.dsc-decision-foot{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}.dsc-result-chip.is-empty{border-color:#78a08247;background:#121c1673;color:var(--dsc-gray-5)}.dsc-result-chip-hit{appearance:none;border:0;background:transparent;padding:0;color:inherit;font:inherit;cursor:pointer;max-width:100%}.dsc-coupled-mix .dsc-mix-row{display:grid;grid-template-columns:minmax(140px,1.2fr) 140px 48px 64px auto;gap:8px;align-items:end;margin-bottom:8px}.dsc-nutrient-slot{display:grid;grid-template-columns:minmax(140px,1fr) 88px 64px auto;gap:8px;align-items:end;margin-top:8px}.dsc-catalog-hits{list-style:none;margin:8px 0 0;padding:0;max-height:280px;overflow:auto}.dsc-catalog-hits button{appearance:none;width:100%;text-align:left;background:transparent;border:0;color:inherit;font:inherit;padding:8px 4px;cursor:pointer;display:flex;gap:8px}.dsc-catalog-hits button:hover{background:#26c6da1a}.dsc-catalog-picker input[type=search]{width:100%;box-sizing:border-box;background:var(--dsc-gray-1);border:1px solid var(--dsc-glass-border);border-radius:8px;color:var(--dsc-white);padding:8px 10px}.dsc-vessel-glyph{display:inline-flex;flex-direction:column;align-items:center;gap:2px}.dsc-vessel-glyph-label{font-size:.65rem;color:var(--dsc-gray-5)}.dsc-kit-constellation{width:100%;max-height:420px;color:inherit;margin-bottom:8px}.dsc-kit-pulse-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px}.dsc-kit-node{display:flex;align-items:center;gap:8px;padding:8px;border:1px dashed var(--dsc-gray-3);border-radius:10px}.dsc-kit-node.is-ok{border-style:solid;border-color:var(--dsc-teal-dim)}.dsc-kit-node i{width:10px;height:10px;border-radius:50%;background:var(--dsc-gray-5)}.dsc-kit-node.is-ok i{background:var(--dsc-neon)}.dsc-kit-node.is-held i{background:var(--dsc-amber)}.dsc-kit-node.is-oos i,.dsc-kit-node.is-missing i,.dsc-kit-node.is-dark i{background:transparent;border:1px dashed var(--dsc-bad)}.dsc-lung-svg,.dsc-tank-svg{width:100%;height:auto;color:var(--dsc-white)}.dsc-cal-curve{margin:12px 0 16px}.dsc-cal-curve strong{display:block;margin-bottom:6px}.dsc-honesty-hit{appearance:none;border:0;background:transparent;padding:0;cursor:pointer}.dsc-row-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.dsc-detail-list dt{font-size:.7rem;color:var(--dsc-gray-5);margin-top:8px}.dsc-detail-list dd{margin:0}button.dsc-chip{font:inherit;letter-spacing:inherit;text-transform:inherit;cursor:pointer;color:inherit}button.dsc-chip.is-clickable:hover{border-color:var(--dsc-teal)}.dsc-duty-hit{appearance:none;border:0;background:transparent;padding:0;width:100%;text-align:left;cursor:pointer;color:inherit;font:inherit}.dsc-duty-strip{display:flex;flex-direction:column;gap:4px;margin:8px 0}.dsc-duty-meta{display:flex;justify-content:space-between;gap:8px;font-size:.72rem;letter-spacing:.04em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-duty-svg{width:100%;height:18px;display:block}.dsc-inspector-playbook{margin:10px 0;padding:10px 12px;border:1px solid var(--dsc-glass-border);border-radius:10px;background:#00000038}.dsc-inspector-playbook strong{display:block;margin-bottom:4px}.dsc-inspector-playbook p{margin:4px 0}.dsc-stage-track{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px}.dsc-stage-pill{font-size:.65rem;letter-spacing:.04em;text-transform:uppercase;padding:5px 8px;border-radius:6px;background:var(--dsc-gray-2);color:var(--dsc-gray-5)}.dsc-stage-pill.is-on{background:color-mix(in srgb,var(--dsc-blue) 45%,transparent);color:var(--dsc-white)}.dsc-stage-pill.is-next{background:color-mix(in srgb,var(--dsc-amber) 22%,transparent);color:var(--dsc-amber)}.dsc-scheduler-lanes{display:flex;flex-direction:column;gap:6px;margin-top:8px}.dsc-scheduler-lane{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:8px 10px;border:1px solid var(--dsc-gray-3);border-radius:10px;background:#00000029;color:inherit;font:inherit;text-align:left;cursor:pointer}.dsc-scheduler-lane:hover:not(:disabled){border-color:var(--dsc-teal)}.dsc-scheduler-lane.is-oos,.dsc-scheduler-lane:disabled{opacity:.45;cursor:default}.dsc-air-path{display:flex;flex-direction:column;gap:8px}.dsc-air-svg{width:100%;height:auto;display:block;color:var(--dsc-white)}.dsc-target-heroes{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px}.dsc-tent-targets.is-hero{border-color:var(--dsc-teal-dim);padding:14px 16px}.dsc-target-hint{font-size:.65rem;color:var(--dsc-gray-5);letter-spacing:.03em}.dsc-got-want-hit{appearance:none;border:0;background:transparent;padding:0;width:100%;text-align:left;cursor:pointer;color:inherit;font:inherit}.dsc-pot-card-head{display:flex;align-items:center;gap:10px;cursor:pointer;margin-bottom:8px}.dsc-pot-card.is-oos{opacity:.72}.dsc-npk-hit{appearance:none;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:inherit;font:inherit;font-size:.75rem;border-radius:8px;padding:6px 8px;cursor:pointer}.dsc-npk-hit:hover{border-color:var(--dsc-teal)}.dsc-light-hero .dsc-honesty{font-size:.78rem}', Sy = jy;
function gv() {
  const l = jt(), c = dt();
  return /* @__PURE__ */ s.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ s.jsx(
      Yt,
      {
        icon: "alert",
        title: "Not found",
        subtitle: `${l.pathname} is not a DSC route.`
      }
    ),
    /* @__PURE__ */ s.jsx("p", { className: "dsc-honesty", children: "Unknown hash — not a silent Mission redirect." }),
    /* @__PURE__ */ s.jsx(he, { primary: !0, onClick: () => c("/live/mission"), children: "Go Mission" })
  ] });
}
function Ga() {
  const l = jt(), c = wy(l.pathname, l.search);
  return c ? /* @__PURE__ */ s.jsx(Fa, { to: c, replace: !0 }) : /* @__PURE__ */ s.jsx(gv, {});
}
function Ny() {
  const l = jt(), c = dt(), u = yy(l.pathname), o = by[u];
  return y.useEffect(() => {
    if (l.pathname === "/live/climate") return;
    const d = new URLSearchParams(l.search);
    if (!d.has("tent") && !d.has("zone")) return;
    d.delete("tent"), d.delete("zone");
    const f = d.toString();
    c({ pathname: l.pathname, search: f ? `?${f}` : "" }, { replace: !0 });
  }, [l.pathname, l.search, c]), /* @__PURE__ */ s.jsxs("div", { className: "dsc-shell", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "dsc-brand-row", children: [
      /* @__PURE__ */ s.jsxs(pc, { className: "dsc-brand", to: "/live/mission", children: [
        /* @__PURE__ */ s.jsx(un, { name: "brand", size: 36, color: "var(--dsc-blue)" }),
        /* @__PURE__ */ s.jsx("div", { className: "dsc-brand-title", children: /* @__PURE__ */ s.jsx("strong", { children: "DSC - A Plausible Deniability Project." }) })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "dsc-muted", style: { fontSize: 12, letterSpacing: "0.08em" }, children: "SURFACE 7.2.0" })
    ] }),
    /* @__PURE__ */ s.jsx(z_, {}),
    /* @__PURE__ */ s.jsx("nav", { className: "dsc-primary-tabs", "aria-label": "Primary", children: xy.map((d) => /* @__PURE__ */ s.jsxs(
      pc,
      {
        to: d.path,
        className: ({ isActive: f }) => `dsc-tab dsc-tab--${d.id}${f || u === d.id ? " active" : ""}`,
        children: [
          /* @__PURE__ */ s.jsx(un, { name: d.icon, size: 15 }),
          d.label
        ]
      },
      d.id
    )) }),
    o.length > 1 ? /* @__PURE__ */ s.jsx("nav", { className: "dsc-secondary-tabs", "aria-label": "Section pages", children: o.map((d) => /* @__PURE__ */ s.jsxs(
      pc,
      {
        to: d.path,
        end: d.path === "/fleet",
        className: ({ isActive: f }) => `dsc-tab${f ? " active" : ""}`,
        children: [
          /* @__PURE__ */ s.jsx(un, { name: d.icon, size: 14 }),
          d.label
        ]
      },
      d.id
    )) }) : null,
    /* @__PURE__ */ s.jsx(X_, {}),
    /* @__PURE__ */ s.jsx(F0, {}),
    /* @__PURE__ */ s.jsxs(Fb, { children: [
      /* @__PURE__ */ s.jsx($e, { path: "/", element: /* @__PURE__ */ s.jsx(Fa, { to: "/live/mission", replace: !0 }) }),
      /* @__PURE__ */ s.jsx($e, { path: "/live", element: /* @__PURE__ */ s.jsx(Fa, { to: "/live/mission", replace: !0 }) }),
      /* @__PURE__ */ s.jsx($e, { path: "/live/mission", element: /* @__PURE__ */ s.jsx(P0, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/live/twin", element: /* @__PURE__ */ s.jsx(oy, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/live/climate", element: /* @__PURE__ */ s.jsx(ay, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/live/4x8", element: /* @__PURE__ */ s.jsx(uy, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/live/2x4", element: /* @__PURE__ */ s.jsx(dy, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/live/main", element: /* @__PURE__ */ s.jsx(Fa, { to: "/live/4x8", replace: !0 }) }),
      /* @__PURE__ */ s.jsx($e, { path: "/live/clone", element: /* @__PURE__ */ s.jsx(Fa, { to: "/live/2x4", replace: !0 }) }),
      /* @__PURE__ */ s.jsx($e, { path: "/live/root", element: /* @__PURE__ */ s.jsx(sy, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/live/light", element: /* @__PURE__ */ s.jsx(ry, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/grow", element: /* @__PURE__ */ s.jsx(Fa, { to: "/grow/compose", replace: !0 }) }),
      /* @__PURE__ */ s.jsx($e, { path: "/grow/compose", element: /* @__PURE__ */ s.jsx(B0, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/grow/research", element: /* @__PURE__ */ s.jsx($0, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/grow/roster", element: /* @__PURE__ */ s.jsx(G0, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/tune", element: /* @__PURE__ */ s.jsx(Fa, { to: "/tune/learning", replace: !0 }) }),
      /* @__PURE__ */ s.jsx($e, { path: "/tune/learning", element: /* @__PURE__ */ s.jsx(py, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/tune/analytics", element: /* @__PURE__ */ s.jsx(vy, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/fleet", element: /* @__PURE__ */ s.jsx(gy, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/ops/*", element: /* @__PURE__ */ s.jsx(Ga, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/ops", element: /* @__PURE__ */ s.jsx(Ga, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/plant/*", element: /* @__PURE__ */ s.jsx(Ga, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/plant", element: /* @__PURE__ */ s.jsx(Ga, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/advanced/*", element: /* @__PURE__ */ s.jsx(Ga, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/advanced", element: /* @__PURE__ */ s.jsx(Ga, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "/system", element: /* @__PURE__ */ s.jsx(Ga, {}) }),
      /* @__PURE__ */ s.jsx($e, { path: "*", element: /* @__PURE__ */ s.jsx(gv, {}) })
    ] })
  ] });
}
function ky({ hass: l }) {
  return /* @__PURE__ */ s.jsx(E_, { hass: l, children: /* @__PURE__ */ s.jsx(Y0, { children: /* @__PURE__ */ s.jsx(T0, { children: /* @__PURE__ */ s.jsx(Ny, {}) }) }) });
}
function Ey({
  panel: l
}) {
  const [c, u] = y.useState(() => l.hass);
  return y.useEffect(() => {
    const o = () => u(l.hass);
    return o(), l.addEventListener("hass-updated", o), () => {
      l.removeEventListener("hass-updated", o);
    };
  }, [l]), /* @__PURE__ */ s.jsx(h_, { children: /* @__PURE__ */ s.jsx(ky, { hass: c }) });
}
class My extends HTMLElement {
  constructor() {
    super(...arguments);
    sc(this, "_root", null);
    sc(this, "_hass", null);
    sc(this, "_mounted", !1);
  }
  set hass(u) {
    this._hass = u, this.dispatchEvent(new Event("hass-updated"));
  }
  get hass() {
    return this._hass;
  }
  connectedCallback() {
    if (this.shadowRoot || this.attachShadow({ mode: "open" }), !this._mounted) {
      const u = document.createElement("style");
      u.textContent = `:host{display:block;height:100%;background:#0a0e18;color:#eef1f8;}
${Sy}`, this.shadowRoot.appendChild(u);
      const o = document.createElement("div");
      o.className = "dsc-root", o.style.height = "100%", this.shadowRoot.appendChild(o), this._root = qx.createRoot(o), this._root.render(/* @__PURE__ */ s.jsx(Ey, { panel: this })), this._mounted = !0;
    }
  }
  disconnectedCallback() {
    this._root?.unmount(), this._root = null, this._mounted = !1;
  }
}
customElements.get("dsc-hub-panel") || customElements.define("dsc-hub-panel", My);
export {
  My as default
};
//# sourceMappingURL=dsc-hub-panel.js.map
