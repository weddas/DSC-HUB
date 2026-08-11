var tg = Object.defineProperty;
var lg = (u, r, f) => r in u ? tg(u, r, { enumerable: !0, configurable: !0, writable: !0, value: f }) : u[r] = f;
var ju = (u, r, f) => lg(u, typeof r != "symbol" ? r + "" : r, f);
var ar = { exports: {} }, $n = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Om;
function ag() {
  if (Om) return $n;
  Om = 1;
  var u = Symbol.for("react.transitional.element"), r = Symbol.for("react.fragment");
  function f(s, d, h) {
    var y = null;
    if (h !== void 0 && (y = "" + h), d.key !== void 0 && (y = "" + d.key), "key" in d) {
      h = {};
      for (var g in d)
        g !== "key" && (h[g] = d[g]);
    } else h = d;
    return d = h.ref, {
      $$typeof: u,
      type: s,
      key: y,
      ref: d !== void 0 ? d : null,
      props: h
    };
  }
  return $n.Fragment = r, $n.jsx = f, $n.jsxs = f, $n;
}
var wm;
function ng() {
  return wm || (wm = 1, ar.exports = ag()), ar.exports;
}
var c = ng(), nr = { exports: {} }, ae = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Dm;
function ig() {
  if (Dm) return ae;
  Dm = 1;
  var u = Symbol.for("react.transitional.element"), r = Symbol.for("react.portal"), f = Symbol.for("react.fragment"), s = Symbol.for("react.strict_mode"), d = Symbol.for("react.profiler"), h = Symbol.for("react.consumer"), y = Symbol.for("react.context"), g = Symbol.for("react.forward_ref"), v = Symbol.for("react.suspense"), p = Symbol.for("react.memo"), b = Symbol.for("react.lazy"), _ = Symbol.for("react.activity"), T = Symbol.iterator;
  function Y(j) {
    return j === null || typeof j != "object" ? null : (j = T && j[T] || j["@@iterator"], typeof j == "function" ? j : null);
  }
  var G = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, k = Object.assign, U = {};
  function X(j, H, Q) {
    this.props = j, this.context = H, this.refs = U, this.updater = Q || G;
  }
  X.prototype.isReactComponent = {}, X.prototype.setState = function(j, H) {
    if (typeof j != "object" && typeof j != "function" && j != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, j, H, "setState");
  }, X.prototype.forceUpdate = function(j) {
    this.updater.enqueueForceUpdate(this, j, "forceUpdate");
  };
  function V() {
  }
  V.prototype = X.prototype;
  function B(j, H, Q) {
    this.props = j, this.context = H, this.refs = U, this.updater = Q || G;
  }
  var le = B.prototype = new V();
  le.constructor = B, k(le, X.prototype), le.isPureReactComponent = !0;
  var ce = Array.isArray;
  function se() {
  }
  var F = { H: null, A: null, T: null, S: null }, xe = Object.prototype.hasOwnProperty;
  function we(j, H, Q) {
    var J = Q.ref;
    return {
      $$typeof: u,
      type: j,
      key: H,
      ref: J !== void 0 ? J : null,
      props: Q
    };
  }
  function Fe(j, H) {
    return we(j.type, H, j.props);
  }
  function Ye(j) {
    return typeof j == "object" && j !== null && j.$$typeof === u;
  }
  function Le(j) {
    var H = { "=": "=0", ":": "=2" };
    return "$" + j.replace(/[=:]/g, function(Q) {
      return H[Q];
    });
  }
  var C = /\/+/g;
  function I(j, H) {
    return typeof j == "object" && j !== null && j.key != null ? Le("" + j.key) : H.toString(36);
  }
  function P(j) {
    switch (j.status) {
      case "fulfilled":
        return j.value;
      case "rejected":
        throw j.reason;
      default:
        switch (typeof j.status == "string" ? j.then(se, se) : (j.status = "pending", j.then(
          function(H) {
            j.status === "pending" && (j.status = "fulfilled", j.value = H);
          },
          function(H) {
            j.status === "pending" && (j.status = "rejected", j.reason = H);
          }
        )), j.status) {
          case "fulfilled":
            return j.value;
          case "rejected":
            throw j.reason;
        }
    }
    throw j;
  }
  function M(j, H, Q, J, ne) {
    var re = typeof j;
    (re === "undefined" || re === "boolean") && (j = null);
    var Se = !1;
    if (j === null) Se = !0;
    else
      switch (re) {
        case "bigint":
        case "string":
        case "number":
          Se = !0;
          break;
        case "object":
          switch (j.$$typeof) {
            case u:
            case r:
              Se = !0;
              break;
            case b:
              return Se = j._init, M(
                Se(j._payload),
                H,
                Q,
                J,
                ne
              );
          }
      }
    if (Se)
      return ne = ne(j), Se = J === "" ? "." + I(j, 0) : J, ce(ne) ? (Q = "", Se != null && (Q = Se.replace(C, "$&/") + "/"), M(ne, H, Q, "", function(tn) {
        return tn;
      })) : ne != null && (Ye(ne) && (ne = Fe(
        ne,
        Q + (ne.key == null || j && j.key === ne.key ? "" : ("" + ne.key).replace(
          C,
          "$&/"
        ) + "/") + Se
      )), H.push(ne)), 1;
    Se = 0;
    var st = J === "" ? "." : J + ":";
    if (ce(j))
      for (var ke = 0; ke < j.length; ke++)
        J = j[ke], re = st + I(J, ke), Se += M(
          J,
          H,
          Q,
          re,
          ne
        );
    else if (ke = Y(j), typeof ke == "function")
      for (j = ke.call(j), ke = 0; !(J = j.next()).done; )
        J = J.value, re = st + I(J, ke++), Se += M(
          J,
          H,
          Q,
          re,
          ne
        );
    else if (re === "object") {
      if (typeof j.then == "function")
        return M(
          P(j),
          H,
          Q,
          J,
          ne
        );
      throw H = String(j), Error(
        "Objects are not valid as a React child (found: " + (H === "[object Object]" ? "object with keys {" + Object.keys(j).join(", ") + "}" : H) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return Se;
  }
  function q(j, H, Q) {
    if (j == null) return j;
    var J = [], ne = 0;
    return M(j, J, "", "", function(re) {
      return H.call(Q, re, ne++);
    }), J;
  }
  function Z(j) {
    if (j._status === -1) {
      var H = j._result;
      H = H(), H.then(
        function(Q) {
          (j._status === 0 || j._status === -1) && (j._status = 1, j._result = Q);
        },
        function(Q) {
          (j._status === 0 || j._status === -1) && (j._status = 2, j._result = Q);
        }
      ), j._status === -1 && (j._status = 0, j._result = H);
    }
    if (j._status === 1) return j._result.default;
    throw j._result;
  }
  var ee = typeof reportError == "function" ? reportError : function(j) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var H = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof j == "object" && j !== null && typeof j.message == "string" ? String(j.message) : String(j),
        error: j
      });
      if (!window.dispatchEvent(H)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", j);
      return;
    }
    console.error(j);
  }, pe = {
    map: q,
    forEach: function(j, H, Q) {
      q(
        j,
        function() {
          H.apply(this, arguments);
        },
        Q
      );
    },
    count: function(j) {
      var H = 0;
      return q(j, function() {
        H++;
      }), H;
    },
    toArray: function(j) {
      return q(j, function(H) {
        return H;
      }) || [];
    },
    only: function(j) {
      if (!Ye(j))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return j;
    }
  };
  return ae.Activity = _, ae.Children = pe, ae.Component = X, ae.Fragment = f, ae.Profiler = d, ae.PureComponent = B, ae.StrictMode = s, ae.Suspense = v, ae.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = F, ae.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(j) {
      return F.H.useMemoCache(j);
    }
  }, ae.cache = function(j) {
    return function() {
      return j.apply(null, arguments);
    };
  }, ae.cacheSignal = function() {
    return null;
  }, ae.cloneElement = function(j, H, Q) {
    if (j == null)
      throw Error(
        "The argument must be a React element, but you passed " + j + "."
      );
    var J = k({}, j.props), ne = j.key;
    if (H != null)
      for (re in H.key !== void 0 && (ne = "" + H.key), H)
        !xe.call(H, re) || re === "key" || re === "__self" || re === "__source" || re === "ref" && H.ref === void 0 || (J[re] = H[re]);
    var re = arguments.length - 2;
    if (re === 1) J.children = Q;
    else if (1 < re) {
      for (var Se = Array(re), st = 0; st < re; st++)
        Se[st] = arguments[st + 2];
      J.children = Se;
    }
    return we(j.type, ne, J);
  }, ae.createContext = function(j) {
    return j = {
      $$typeof: y,
      _currentValue: j,
      _currentValue2: j,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, j.Provider = j, j.Consumer = {
      $$typeof: h,
      _context: j
    }, j;
  }, ae.createElement = function(j, H, Q) {
    var J, ne = {}, re = null;
    if (H != null)
      for (J in H.key !== void 0 && (re = "" + H.key), H)
        xe.call(H, J) && J !== "key" && J !== "__self" && J !== "__source" && (ne[J] = H[J]);
    var Se = arguments.length - 2;
    if (Se === 1) ne.children = Q;
    else if (1 < Se) {
      for (var st = Array(Se), ke = 0; ke < Se; ke++)
        st[ke] = arguments[ke + 2];
      ne.children = st;
    }
    if (j && j.defaultProps)
      for (J in Se = j.defaultProps, Se)
        ne[J] === void 0 && (ne[J] = Se[J]);
    return we(j, re, ne);
  }, ae.createRef = function() {
    return { current: null };
  }, ae.forwardRef = function(j) {
    return { $$typeof: g, render: j };
  }, ae.isValidElement = Ye, ae.lazy = function(j) {
    return {
      $$typeof: b,
      _payload: { _status: -1, _result: j },
      _init: Z
    };
  }, ae.memo = function(j, H) {
    return {
      $$typeof: p,
      type: j,
      compare: H === void 0 ? null : H
    };
  }, ae.startTransition = function(j) {
    var H = F.T, Q = {};
    F.T = Q;
    try {
      var J = j(), ne = F.S;
      ne !== null && ne(Q, J), typeof J == "object" && J !== null && typeof J.then == "function" && J.then(se, ee);
    } catch (re) {
      ee(re);
    } finally {
      H !== null && Q.types !== null && (H.types = Q.types), F.T = H;
    }
  }, ae.unstable_useCacheRefresh = function() {
    return F.H.useCacheRefresh();
  }, ae.use = function(j) {
    return F.H.use(j);
  }, ae.useActionState = function(j, H, Q) {
    return F.H.useActionState(j, H, Q);
  }, ae.useCallback = function(j, H) {
    return F.H.useCallback(j, H);
  }, ae.useContext = function(j) {
    return F.H.useContext(j);
  }, ae.useDebugValue = function() {
  }, ae.useDeferredValue = function(j, H) {
    return F.H.useDeferredValue(j, H);
  }, ae.useEffect = function(j, H) {
    return F.H.useEffect(j, H);
  }, ae.useEffectEvent = function(j) {
    return F.H.useEffectEvent(j);
  }, ae.useId = function() {
    return F.H.useId();
  }, ae.useImperativeHandle = function(j, H, Q) {
    return F.H.useImperativeHandle(j, H, Q);
  }, ae.useInsertionEffect = function(j, H) {
    return F.H.useInsertionEffect(j, H);
  }, ae.useLayoutEffect = function(j, H) {
    return F.H.useLayoutEffect(j, H);
  }, ae.useMemo = function(j, H) {
    return F.H.useMemo(j, H);
  }, ae.useOptimistic = function(j, H) {
    return F.H.useOptimistic(j, H);
  }, ae.useReducer = function(j, H, Q) {
    return F.H.useReducer(j, H, Q);
  }, ae.useRef = function(j) {
    return F.H.useRef(j);
  }, ae.useState = function(j) {
    return F.H.useState(j);
  }, ae.useSyncExternalStore = function(j, H, Q) {
    return F.H.useSyncExternalStore(
      j,
      H,
      Q
    );
  }, ae.useTransition = function() {
    return F.H.useTransition();
  }, ae.version = "19.2.8", ae;
}
var Um;
function pr() {
  return Um || (Um = 1, nr.exports = ig()), nr.exports;
}
var E = pr(), ir = { exports: {} }, Fn = {}, ur = { exports: {} }, cr = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Hm;
function ug() {
  return Hm || (Hm = 1, (function(u) {
    function r(M, q) {
      var Z = M.length;
      M.push(q);
      e: for (; 0 < Z; ) {
        var ee = Z - 1 >>> 1, pe = M[ee];
        if (0 < d(pe, q))
          M[ee] = q, M[Z] = pe, Z = ee;
        else break e;
      }
    }
    function f(M) {
      return M.length === 0 ? null : M[0];
    }
    function s(M) {
      if (M.length === 0) return null;
      var q = M[0], Z = M.pop();
      if (Z !== q) {
        M[0] = Z;
        e: for (var ee = 0, pe = M.length, j = pe >>> 1; ee < j; ) {
          var H = 2 * (ee + 1) - 1, Q = M[H], J = H + 1, ne = M[J];
          if (0 > d(Q, Z))
            J < pe && 0 > d(ne, Q) ? (M[ee] = ne, M[J] = Z, ee = J) : (M[ee] = Q, M[H] = Z, ee = H);
          else if (J < pe && 0 > d(ne, Z))
            M[ee] = ne, M[J] = Z, ee = J;
          else break e;
        }
      }
      return q;
    }
    function d(M, q) {
      var Z = M.sortIndex - q.sortIndex;
      return Z !== 0 ? Z : M.id - q.id;
    }
    if (u.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var h = performance;
      u.unstable_now = function() {
        return h.now();
      };
    } else {
      var y = Date, g = y.now();
      u.unstable_now = function() {
        return y.now() - g;
      };
    }
    var v = [], p = [], b = 1, _ = null, T = 3, Y = !1, G = !1, k = !1, U = !1, X = typeof setTimeout == "function" ? setTimeout : null, V = typeof clearTimeout == "function" ? clearTimeout : null, B = typeof setImmediate < "u" ? setImmediate : null;
    function le(M) {
      for (var q = f(p); q !== null; ) {
        if (q.callback === null) s(p);
        else if (q.startTime <= M)
          s(p), q.sortIndex = q.expirationTime, r(v, q);
        else break;
        q = f(p);
      }
    }
    function ce(M) {
      if (k = !1, le(M), !G)
        if (f(v) !== null)
          G = !0, se || (se = !0, Le());
        else {
          var q = f(p);
          q !== null && P(ce, q.startTime - M);
        }
    }
    var se = !1, F = -1, xe = 5, we = -1;
    function Fe() {
      return U ? !0 : !(u.unstable_now() - we < xe);
    }
    function Ye() {
      if (U = !1, se) {
        var M = u.unstable_now();
        we = M;
        var q = !0;
        try {
          e: {
            G = !1, k && (k = !1, V(F), F = -1), Y = !0;
            var Z = T;
            try {
              t: {
                for (le(M), _ = f(v); _ !== null && !(_.expirationTime > M && Fe()); ) {
                  var ee = _.callback;
                  if (typeof ee == "function") {
                    _.callback = null, T = _.priorityLevel;
                    var pe = ee(
                      _.expirationTime <= M
                    );
                    if (M = u.unstable_now(), typeof pe == "function") {
                      _.callback = pe, le(M), q = !0;
                      break t;
                    }
                    _ === f(v) && s(v), le(M);
                  } else s(v);
                  _ = f(v);
                }
                if (_ !== null) q = !0;
                else {
                  var j = f(p);
                  j !== null && P(
                    ce,
                    j.startTime - M
                  ), q = !1;
                }
              }
              break e;
            } finally {
              _ = null, T = Z, Y = !1;
            }
            q = void 0;
          }
        } finally {
          q ? Le() : se = !1;
        }
      }
    }
    var Le;
    if (typeof B == "function")
      Le = function() {
        B(Ye);
      };
    else if (typeof MessageChannel < "u") {
      var C = new MessageChannel(), I = C.port2;
      C.port1.onmessage = Ye, Le = function() {
        I.postMessage(null);
      };
    } else
      Le = function() {
        X(Ye, 0);
      };
    function P(M, q) {
      F = X(function() {
        M(u.unstable_now());
      }, q);
    }
    u.unstable_IdlePriority = 5, u.unstable_ImmediatePriority = 1, u.unstable_LowPriority = 4, u.unstable_NormalPriority = 3, u.unstable_Profiling = null, u.unstable_UserBlockingPriority = 2, u.unstable_cancelCallback = function(M) {
      M.callback = null;
    }, u.unstable_forceFrameRate = function(M) {
      0 > M || 125 < M ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : xe = 0 < M ? Math.floor(1e3 / M) : 5;
    }, u.unstable_getCurrentPriorityLevel = function() {
      return T;
    }, u.unstable_next = function(M) {
      switch (T) {
        case 1:
        case 2:
        case 3:
          var q = 3;
          break;
        default:
          q = T;
      }
      var Z = T;
      T = q;
      try {
        return M();
      } finally {
        T = Z;
      }
    }, u.unstable_requestPaint = function() {
      U = !0;
    }, u.unstable_runWithPriority = function(M, q) {
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
      var Z = T;
      T = M;
      try {
        return q();
      } finally {
        T = Z;
      }
    }, u.unstable_scheduleCallback = function(M, q, Z) {
      var ee = u.unstable_now();
      switch (typeof Z == "object" && Z !== null ? (Z = Z.delay, Z = typeof Z == "number" && 0 < Z ? ee + Z : ee) : Z = ee, M) {
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
      return pe = Z + pe, M = {
        id: b++,
        callback: q,
        priorityLevel: M,
        startTime: Z,
        expirationTime: pe,
        sortIndex: -1
      }, Z > ee ? (M.sortIndex = Z, r(p, M), f(v) === null && M === f(p) && (k ? (V(F), F = -1) : k = !0, P(ce, Z - ee))) : (M.sortIndex = pe, r(v, M), G || Y || (G = !0, se || (se = !0, Le()))), M;
    }, u.unstable_shouldYield = Fe, u.unstable_wrapCallback = function(M) {
      var q = T;
      return function() {
        var Z = T;
        T = q;
        try {
          return M.apply(this, arguments);
        } finally {
          T = Z;
        }
      };
    };
  })(cr)), cr;
}
var Lm;
function cg() {
  return Lm || (Lm = 1, ur.exports = ug()), ur.exports;
}
var sr = { exports: {} }, ct = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Bm;
function sg() {
  if (Bm) return ct;
  Bm = 1;
  var u = pr();
  function r(v) {
    var p = "https://react.dev/errors/" + v;
    if (1 < arguments.length) {
      p += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var b = 2; b < arguments.length; b++)
        p += "&args[]=" + encodeURIComponent(arguments[b]);
    }
    return "Minified React error #" + v + "; visit " + p + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function f() {
  }
  var s = {
    d: {
      f,
      r: function() {
        throw Error(r(522));
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
  }, d = Symbol.for("react.portal");
  function h(v, p, b) {
    var _ = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: d,
      key: _ == null ? null : "" + _,
      children: v,
      containerInfo: p,
      implementation: b
    };
  }
  var y = u.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function g(v, p) {
    if (v === "font") return "";
    if (typeof p == "string")
      return p === "use-credentials" ? p : "";
  }
  return ct.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = s, ct.createPortal = function(v, p) {
    var b = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!p || p.nodeType !== 1 && p.nodeType !== 9 && p.nodeType !== 11)
      throw Error(r(299));
    return h(v, p, null, b);
  }, ct.flushSync = function(v) {
    var p = y.T, b = s.p;
    try {
      if (y.T = null, s.p = 2, v) return v();
    } finally {
      y.T = p, s.p = b, s.d.f();
    }
  }, ct.preconnect = function(v, p) {
    typeof v == "string" && (p ? (p = p.crossOrigin, p = typeof p == "string" ? p === "use-credentials" ? p : "" : void 0) : p = null, s.d.C(v, p));
  }, ct.prefetchDNS = function(v) {
    typeof v == "string" && s.d.D(v);
  }, ct.preinit = function(v, p) {
    if (typeof v == "string" && p && typeof p.as == "string") {
      var b = p.as, _ = g(b, p.crossOrigin), T = typeof p.integrity == "string" ? p.integrity : void 0, Y = typeof p.fetchPriority == "string" ? p.fetchPriority : void 0;
      b === "style" ? s.d.S(
        v,
        typeof p.precedence == "string" ? p.precedence : void 0,
        {
          crossOrigin: _,
          integrity: T,
          fetchPriority: Y
        }
      ) : b === "script" && s.d.X(v, {
        crossOrigin: _,
        integrity: T,
        fetchPriority: Y,
        nonce: typeof p.nonce == "string" ? p.nonce : void 0
      });
    }
  }, ct.preinitModule = function(v, p) {
    if (typeof v == "string")
      if (typeof p == "object" && p !== null) {
        if (p.as == null || p.as === "script") {
          var b = g(
            p.as,
            p.crossOrigin
          );
          s.d.M(v, {
            crossOrigin: b,
            integrity: typeof p.integrity == "string" ? p.integrity : void 0,
            nonce: typeof p.nonce == "string" ? p.nonce : void 0
          });
        }
      } else p == null && s.d.M(v);
  }, ct.preload = function(v, p) {
    if (typeof v == "string" && typeof p == "object" && p !== null && typeof p.as == "string") {
      var b = p.as, _ = g(b, p.crossOrigin);
      s.d.L(v, b, {
        crossOrigin: _,
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
  }, ct.preloadModule = function(v, p) {
    if (typeof v == "string")
      if (p) {
        var b = g(p.as, p.crossOrigin);
        s.d.m(v, {
          as: typeof p.as == "string" && p.as !== "script" ? p.as : void 0,
          crossOrigin: b,
          integrity: typeof p.integrity == "string" ? p.integrity : void 0
        });
      } else s.d.m(v);
  }, ct.requestFormReset = function(v) {
    s.d.r(v);
  }, ct.unstable_batchedUpdates = function(v, p) {
    return v(p);
  }, ct.useFormState = function(v, p, b) {
    return y.H.useFormState(v, p, b);
  }, ct.useFormStatus = function() {
    return y.H.useHostTransitionStatus();
  }, ct.version = "19.2.8", ct;
}
var qm;
function rg() {
  if (qm) return sr.exports;
  qm = 1;
  function u() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u);
      } catch (r) {
        console.error(r);
      }
  }
  return u(), sr.exports = sg(), sr.exports;
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
var Ym;
function og() {
  if (Ym) return Fn;
  Ym = 1;
  var u = cg(), r = pr(), f = rg();
  function s(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var l = 2; l < arguments.length; l++)
        t += "&args[]=" + encodeURIComponent(arguments[l]);
    }
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function d(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function h(e) {
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
  function y(e) {
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
  function v(e) {
    if (h(e) !== e)
      throw Error(s(188));
  }
  function p(e) {
    var t = e.alternate;
    if (!t) {
      if (t = h(e), t === null) throw Error(s(188));
      return t !== e ? null : e;
    }
    for (var l = e, a = t; ; ) {
      var n = l.return;
      if (n === null) break;
      var i = n.alternate;
      if (i === null) {
        if (a = n.return, a !== null) {
          l = a;
          continue;
        }
        break;
      }
      if (n.child === i.child) {
        for (i = n.child; i; ) {
          if (i === l) return v(n), e;
          if (i === a) return v(n), t;
          i = i.sibling;
        }
        throw Error(s(188));
      }
      if (l.return !== a.return) l = n, a = i;
      else {
        for (var o = !1, m = n.child; m; ) {
          if (m === l) {
            o = !0, l = n, a = i;
            break;
          }
          if (m === a) {
            o = !0, a = n, l = i;
            break;
          }
          m = m.sibling;
        }
        if (!o) {
          for (m = i.child; m; ) {
            if (m === l) {
              o = !0, l = i, a = n;
              break;
            }
            if (m === a) {
              o = !0, a = i, l = n;
              break;
            }
            m = m.sibling;
          }
          if (!o) throw Error(s(189));
        }
      }
      if (l.alternate !== a) throw Error(s(190));
    }
    if (l.tag !== 3) throw Error(s(188));
    return l.stateNode.current === l ? e : t;
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
  var _ = Object.assign, T = Symbol.for("react.element"), Y = Symbol.for("react.transitional.element"), G = Symbol.for("react.portal"), k = Symbol.for("react.fragment"), U = Symbol.for("react.strict_mode"), X = Symbol.for("react.profiler"), V = Symbol.for("react.consumer"), B = Symbol.for("react.context"), le = Symbol.for("react.forward_ref"), ce = Symbol.for("react.suspense"), se = Symbol.for("react.suspense_list"), F = Symbol.for("react.memo"), xe = Symbol.for("react.lazy"), we = Symbol.for("react.activity"), Fe = Symbol.for("react.memo_cache_sentinel"), Ye = Symbol.iterator;
  function Le(e) {
    return e === null || typeof e != "object" ? null : (e = Ye && e[Ye] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var C = Symbol.for("react.client.reference");
  function I(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === C ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case k:
        return "Fragment";
      case X:
        return "Profiler";
      case U:
        return "StrictMode";
      case ce:
        return "Suspense";
      case se:
        return "SuspenseList";
      case we:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case G:
          return "Portal";
        case B:
          return e.displayName || "Context";
        case V:
          return (e._context.displayName || "Context") + ".Consumer";
        case le:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case F:
          return t = e.displayName || null, t !== null ? t : I(e.type) || "Memo";
        case xe:
          t = e._payload, e = e._init;
          try {
            return I(e(t));
          } catch {
          }
      }
    return null;
  }
  var P = Array.isArray, M = r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, q = f.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Z = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, ee = [], pe = -1;
  function j(e) {
    return { current: e };
  }
  function H(e) {
    0 > pe || (e.current = ee[pe], ee[pe] = null, pe--);
  }
  function Q(e, t) {
    pe++, ee[pe] = e.current, e.current = t;
  }
  var J = j(null), ne = j(null), re = j(null), Se = j(null);
  function st(e, t) {
    switch (Q(re, t), Q(ne, e), Q(J, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? tm(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = tm(t), e = lm(t, e);
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
    H(J), Q(J, e);
  }
  function ke() {
    H(J), H(ne), H(re);
  }
  function tn(e) {
    e.memoizedState !== null && Q(Se, e);
    var t = J.current, l = lm(t, e.type);
    t !== l && (Q(ne, e), Q(J, l));
  }
  function ii(e) {
    ne.current === e && (H(J), H(ne)), Se.current === e && (H(Se), Zn._currentValue = Z);
  }
  var qu, Ar;
  function Ql(e) {
    if (qu === void 0)
      try {
        throw Error();
      } catch (l) {
        var t = l.stack.trim().match(/\n( *(at )?)/);
        qu = t && t[1] || "", Ar = -1 < l.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < l.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + qu + e + Ar;
  }
  var Yu = !1;
  function ku(e, t) {
    if (!e || Yu) return "";
    Yu = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var L = function() {
                throw Error();
              };
              if (Object.defineProperty(L.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(L, []);
                } catch (O) {
                  var A = O;
                }
                Reflect.construct(e, [], L);
              } else {
                try {
                  L.call();
                } catch (O) {
                  A = O;
                }
                e.call(L.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (O) {
                A = O;
              }
              (L = e()) && typeof L.catch == "function" && L.catch(function() {
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
      var i = a.DetermineComponentFrameRoot(), o = i[0], m = i[1];
      if (o && m) {
        var x = o.split(`
`), z = m.split(`
`);
        for (n = a = 0; a < x.length && !x[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; n < z.length && !z[n].includes(
          "DetermineComponentFrameRoot"
        ); )
          n++;
        if (a === x.length || n === z.length)
          for (a = x.length - 1, n = z.length - 1; 1 <= a && 0 <= n && x[a] !== z[n]; )
            n--;
        for (; 1 <= a && 0 <= n; a--, n--)
          if (x[a] !== z[n]) {
            if (a !== 1 || n !== 1)
              do
                if (a--, n--, 0 > n || x[a] !== z[n]) {
                  var w = `
` + x[a].replace(" at new ", " at ");
                  return e.displayName && w.includes("<anonymous>") && (w = w.replace("<anonymous>", e.displayName)), w;
                }
              while (1 <= a && 0 <= n);
            break;
          }
      }
    } finally {
      Yu = !1, Error.prepareStackTrace = l;
    }
    return (l = e ? e.displayName || e.name : "") ? Ql(l) : "";
  }
  function Oh(e, t) {
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
        return ku(e.type, !1);
      case 11:
        return ku(e.type.render, !1);
      case 1:
        return ku(e.type, !0);
      case 31:
        return Ql("Activity");
      default:
        return "";
    }
  }
  function Cr(e) {
    try {
      var t = "", l = null;
      do
        t += Oh(e, l), l = e, e = e.return;
      while (e);
      return t;
    } catch (a) {
      return `
Error generating stack: ` + a.message + `
` + a.stack;
    }
  }
  var Gu = Object.prototype.hasOwnProperty, Xu = u.unstable_scheduleCallback, Qu = u.unstable_cancelCallback, wh = u.unstable_shouldYield, Dh = u.unstable_requestPaint, yt = u.unstable_now, Uh = u.unstable_getCurrentPriorityLevel, Mr = u.unstable_ImmediatePriority, Or = u.unstable_UserBlockingPriority, ui = u.unstable_NormalPriority, Hh = u.unstable_LowPriority, wr = u.unstable_IdlePriority, Lh = u.log, Bh = u.unstable_setDisableYieldValue, ln = null, bt = null;
  function yl(e) {
    if (typeof Lh == "function" && Bh(e), bt && typeof bt.setStrictMode == "function")
      try {
        bt.setStrictMode(ln, e);
      } catch {
      }
  }
  var xt = Math.clz32 ? Math.clz32 : kh, qh = Math.log, Yh = Math.LN2;
  function kh(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (qh(e) / Yh | 0) | 0;
  }
  var ci = 256, si = 262144, ri = 4194304;
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
  function oi(e, t, l) {
    var a = e.pendingLanes;
    if (a === 0) return 0;
    var n = 0, i = e.suspendedLanes, o = e.pingedLanes;
    e = e.warmLanes;
    var m = a & 134217727;
    return m !== 0 ? (a = m & ~i, a !== 0 ? n = Zl(a) : (o &= m, o !== 0 ? n = Zl(o) : l || (l = m & ~e, l !== 0 && (n = Zl(l))))) : (m = a & ~i, m !== 0 ? n = Zl(m) : o !== 0 ? n = Zl(o) : l || (l = a & ~e, l !== 0 && (n = Zl(l)))), n === 0 ? 0 : t !== 0 && t !== n && (t & i) === 0 && (i = n & -n, l = t & -t, i >= l || i === 32 && (l & 4194048) !== 0) ? t : n;
  }
  function an(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function Gh(e, t) {
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
  function Dr() {
    var e = ri;
    return ri <<= 1, (ri & 62914560) === 0 && (ri = 4194304), e;
  }
  function Zu(e) {
    for (var t = [], l = 0; 31 > l; l++) t.push(e);
    return t;
  }
  function nn(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function Xh(e, t, l, a, n, i) {
    var o = e.pendingLanes;
    e.pendingLanes = l, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= l, e.entangledLanes &= l, e.errorRecoveryDisabledLanes &= l, e.shellSuspendCounter = 0;
    var m = e.entanglements, x = e.expirationTimes, z = e.hiddenUpdates;
    for (l = o & ~l; 0 < l; ) {
      var w = 31 - xt(l), L = 1 << w;
      m[w] = 0, x[w] = -1;
      var A = z[w];
      if (A !== null)
        for (z[w] = null, w = 0; w < A.length; w++) {
          var O = A[w];
          O !== null && (O.lane &= -536870913);
        }
      l &= ~L;
    }
    a !== 0 && Ur(e, a, 0), i !== 0 && n === 0 && e.tag !== 0 && (e.suspendedLanes |= i & ~(o & ~t));
  }
  function Ur(e, t, l) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var a = 31 - xt(t);
    e.entangledLanes |= t, e.entanglements[a] = e.entanglements[a] | 1073741824 | l & 261930;
  }
  function Hr(e, t) {
    var l = e.entangledLanes |= t;
    for (e = e.entanglements; l; ) {
      var a = 31 - xt(l), n = 1 << a;
      n & t | e[a] & t && (e[a] |= t), l &= ~n;
    }
  }
  function Lr(e, t) {
    var l = t & -t;
    return l = (l & 42) !== 0 ? 1 : Vu(l), (l & (e.suspendedLanes | t)) !== 0 ? 0 : l;
  }
  function Vu(e) {
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
  function Ku(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Br() {
    var e = q.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : Nm(e.type));
  }
  function qr(e, t) {
    var l = q.p;
    try {
      return q.p = e, t();
    } finally {
      q.p = l;
    }
  }
  var bl = Math.random().toString(36).slice(2), Ie = "__reactFiber$" + bl, ot = "__reactProps$" + bl, da = "__reactContainer$" + bl, Ju = "__reactEvents$" + bl, Qh = "__reactListeners$" + bl, Zh = "__reactHandles$" + bl, Yr = "__reactResources$" + bl, un = "__reactMarker$" + bl;
  function $u(e) {
    delete e[Ie], delete e[ot], delete e[Ju], delete e[Qh], delete e[Zh];
  }
  function ma(e) {
    var t = e[Ie];
    if (t) return t;
    for (var l = e.parentNode; l; ) {
      if (t = l[da] || l[Ie]) {
        if (l = t.alternate, t.child !== null || l !== null && l.child !== null)
          for (e = rm(e); e !== null; ) {
            if (l = e[Ie]) return l;
            e = rm(e);
          }
        return t;
      }
      e = l, l = e.parentNode;
    }
    return null;
  }
  function ha(e) {
    if (e = e[Ie] || e[da]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function cn(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(s(33));
  }
  function pa(e) {
    var t = e[Yr];
    return t || (t = e[Yr] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function We(e) {
    e[un] = !0;
  }
  var kr = /* @__PURE__ */ new Set(), Gr = {};
  function Vl(e, t) {
    va(e, t), va(e + "Capture", t);
  }
  function va(e, t) {
    for (Gr[e] = t, e = 0; e < t.length; e++)
      kr.add(t[e]);
  }
  var Vh = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Xr = {}, Qr = {};
  function Kh(e) {
    return Gu.call(Qr, e) ? !0 : Gu.call(Xr, e) ? !1 : Vh.test(e) ? Qr[e] = !0 : (Xr[e] = !0, !1);
  }
  function fi(e, t, l) {
    if (Kh(t))
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
  function di(e, t, l) {
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
  function It(e, t, l, a) {
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
  function Ct(e) {
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
  function Zr(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Jh(e, t, l) {
    var a = Object.getOwnPropertyDescriptor(
      e.constructor.prototype,
      t
    );
    if (!e.hasOwnProperty(t) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
      var n = a.get, i = a.set;
      return Object.defineProperty(e, t, {
        configurable: !0,
        get: function() {
          return n.call(this);
        },
        set: function(o) {
          l = "" + o, i.call(this, o);
        }
      }), Object.defineProperty(e, t, {
        enumerable: a.enumerable
      }), {
        getValue: function() {
          return l;
        },
        setValue: function(o) {
          l = "" + o;
        },
        stopTracking: function() {
          e._valueTracker = null, delete e[t];
        }
      };
    }
  }
  function Fu(e) {
    if (!e._valueTracker) {
      var t = Zr(e) ? "checked" : "value";
      e._valueTracker = Jh(
        e,
        t,
        "" + e[t]
      );
    }
  }
  function Vr(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var l = t.getValue(), a = "";
    return e && (a = Zr(e) ? e.checked ? "true" : "false" : e.value), e = a, e !== l ? (t.setValue(e), !0) : !1;
  }
  function mi(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var $h = /[\n"\\]/g;
  function Mt(e) {
    return e.replace(
      $h,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Wu(e, t, l, a, n, i, o, m) {
    e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t != null ? o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Ct(t)) : e.value !== "" + Ct(t) && (e.value = "" + Ct(t)) : o !== "submit" && o !== "reset" || e.removeAttribute("value"), t != null ? Pu(e, o, Ct(t)) : l != null ? Pu(e, o, Ct(l)) : a != null && e.removeAttribute("value"), n == null && i != null && (e.defaultChecked = !!i), n != null && (e.checked = n && typeof n != "function" && typeof n != "symbol"), m != null && typeof m != "function" && typeof m != "symbol" && typeof m != "boolean" ? e.name = "" + Ct(m) : e.removeAttribute("name");
  }
  function Kr(e, t, l, a, n, i, o, m) {
    if (i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" && (e.type = i), t != null || l != null) {
      if (!(i !== "submit" && i !== "reset" || t != null)) {
        Fu(e);
        return;
      }
      l = l != null ? "" + Ct(l) : "", t = t != null ? "" + Ct(t) : l, m || t === e.value || (e.value = t), e.defaultValue = t;
    }
    a = a ?? n, a = typeof a != "function" && typeof a != "symbol" && !!a, e.checked = m ? e.checked : !!a, e.defaultChecked = !!a, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), Fu(e);
  }
  function Pu(e, t, l) {
    t === "number" && mi(e.ownerDocument) === e || e.defaultValue === "" + l || (e.defaultValue = "" + l);
  }
  function ga(e, t, l, a) {
    if (e = e.options, t) {
      t = {};
      for (var n = 0; n < l.length; n++)
        t["$" + l[n]] = !0;
      for (l = 0; l < e.length; l++)
        n = t.hasOwnProperty("$" + e[l].value), e[l].selected !== n && (e[l].selected = n), n && a && (e[l].defaultSelected = !0);
    } else {
      for (l = "" + Ct(l), t = null, n = 0; n < e.length; n++) {
        if (e[n].value === l) {
          e[n].selected = !0, a && (e[n].defaultSelected = !0);
          return;
        }
        t !== null || e[n].disabled || (t = e[n]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Jr(e, t, l) {
    if (t != null && (t = "" + Ct(t), t !== e.value && (e.value = t), l == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = l != null ? "" + Ct(l) : "";
  }
  function $r(e, t, l, a) {
    if (t == null) {
      if (a != null) {
        if (l != null) throw Error(s(92));
        if (P(a)) {
          if (1 < a.length) throw Error(s(93));
          a = a[0];
        }
        l = a;
      }
      l == null && (l = ""), t = l;
    }
    l = Ct(t), e.defaultValue = l, a = e.textContent, a === l && a !== "" && a !== null && (e.value = a), Fu(e);
  }
  function ya(e, t) {
    if (t) {
      var l = e.firstChild;
      if (l && l === e.lastChild && l.nodeType === 3) {
        l.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Fh = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Fr(e, t, l) {
    var a = t.indexOf("--") === 0;
    l == null || typeof l == "boolean" || l === "" ? a ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : a ? e.setProperty(t, l) : typeof l != "number" || l === 0 || Fh.has(t) ? t === "float" ? e.cssFloat = l : e[t] = ("" + l).trim() : e[t] = l + "px";
  }
  function Wr(e, t, l) {
    if (t != null && typeof t != "object")
      throw Error(s(62));
    if (e = e.style, l != null) {
      for (var a in l)
        !l.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf("--") === 0 ? e.setProperty(a, "") : a === "float" ? e.cssFloat = "" : e[a] = "");
      for (var n in t)
        a = t[n], t.hasOwnProperty(n) && l[n] !== a && Fr(e, n, a);
    } else
      for (var i in t)
        t.hasOwnProperty(i) && Fr(e, i, t[i]);
  }
  function Iu(e) {
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
  var Wh = /* @__PURE__ */ new Map([
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
  ]), Ph = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function hi(e) {
    return Ph.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  function el() {
  }
  var ec = null;
  function tc(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var ba = null, xa = null;
  function Pr(e) {
    var t = ha(e);
    if (t && (e = t.stateNode)) {
      var l = e[ot] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (Wu(
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
              'input[name="' + Mt(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < l.length; t++) {
              var a = l[t];
              if (a !== e && a.form === e.form) {
                var n = a[ot] || null;
                if (!n) throw Error(s(90));
                Wu(
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
              a = l[t], a.form === e.form && Vr(a);
          }
          break e;
        case "textarea":
          Jr(e, l.value, l.defaultValue);
          break e;
        case "select":
          t = l.value, t != null && ga(e, !!l.multiple, t, !1);
      }
    }
  }
  var lc = !1;
  function Ir(e, t, l) {
    if (lc) return e(t, l);
    lc = !0;
    try {
      var a = e(t);
      return a;
    } finally {
      if (lc = !1, (ba !== null || xa !== null) && (tu(), ba && (t = ba, e = xa, xa = ba = null, Pr(t), e)))
        for (t = 0; t < e.length; t++) Pr(e[t]);
    }
  }
  function sn(e, t) {
    var l = e.stateNode;
    if (l === null) return null;
    var a = l[ot] || null;
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
  var tl = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), ac = !1;
  if (tl)
    try {
      var rn = {};
      Object.defineProperty(rn, "passive", {
        get: function() {
          ac = !0;
        }
      }), window.addEventListener("test", rn, rn), window.removeEventListener("test", rn, rn);
    } catch {
      ac = !1;
    }
  var xl = null, nc = null, pi = null;
  function eo() {
    if (pi) return pi;
    var e, t = nc, l = t.length, a, n = "value" in xl ? xl.value : xl.textContent, i = n.length;
    for (e = 0; e < l && t[e] === n[e]; e++) ;
    var o = l - e;
    for (a = 1; a <= o && t[l - a] === n[i - a]; a++) ;
    return pi = n.slice(e, 1 < a ? 1 - a : void 0);
  }
  function vi(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function gi() {
    return !0;
  }
  function to() {
    return !1;
  }
  function ft(e) {
    function t(l, a, n, i, o) {
      this._reactName = l, this._targetInst = n, this.type = a, this.nativeEvent = i, this.target = o, this.currentTarget = null;
      for (var m in e)
        e.hasOwnProperty(m) && (l = e[m], this[m] = l ? l(i) : i[m]);
      return this.isDefaultPrevented = (i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1) ? gi : to, this.isPropagationStopped = to, this;
    }
    return _(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var l = this.nativeEvent;
        l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = gi);
      },
      stopPropagation: function() {
        var l = this.nativeEvent;
        l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = gi);
      },
      persist: function() {
      },
      isPersistent: gi
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
  }, yi = ft(Kl), on = _({}, Kl, { view: 0, detail: 0 }), Ih = ft(on), ic, uc, fn, bi = _({}, on, {
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
    getModifierState: sc,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== fn && (fn && e.type === "mousemove" ? (ic = e.screenX - fn.screenX, uc = e.screenY - fn.screenY) : uc = ic = 0, fn = e), ic);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : uc;
    }
  }), lo = ft(bi), ep = _({}, bi, { dataTransfer: 0 }), tp = ft(ep), lp = _({}, on, { relatedTarget: 0 }), cc = ft(lp), ap = _({}, Kl, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), np = ft(ap), ip = _({}, Kl, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), up = ft(ip), cp = _({}, Kl, { data: 0 }), ao = ft(cp), sp = {
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
  }, rp = {
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
  }, op = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function fp(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = op[e]) ? !!t[e] : !1;
  }
  function sc() {
    return fp;
  }
  var dp = _({}, on, {
    key: function(e) {
      if (e.key) {
        var t = sp[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = vi(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? rp[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: sc,
    charCode: function(e) {
      return e.type === "keypress" ? vi(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? vi(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), mp = ft(dp), hp = _({}, bi, {
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
  }), no = ft(hp), pp = _({}, on, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: sc
  }), vp = ft(pp), gp = _({}, Kl, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), yp = ft(gp), bp = _({}, bi, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), xp = ft(bp), _p = _({}, Kl, {
    newState: 0,
    oldState: 0
  }), Sp = ft(_p), jp = [9, 13, 27, 32], rc = tl && "CompositionEvent" in window, dn = null;
  tl && "documentMode" in document && (dn = document.documentMode);
  var Ep = tl && "TextEvent" in window && !dn, io = tl && (!rc || dn && 8 < dn && 11 >= dn), uo = " ", co = !1;
  function so(e, t) {
    switch (e) {
      case "keyup":
        return jp.indexOf(t.keyCode) !== -1;
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
  function ro(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var _a = !1;
  function Np(e, t) {
    switch (e) {
      case "compositionend":
        return ro(t);
      case "keypress":
        return t.which !== 32 ? null : (co = !0, uo);
      case "textInput":
        return e = t.data, e === uo && co ? null : e;
      default:
        return null;
    }
  }
  function Tp(e, t) {
    if (_a)
      return e === "compositionend" || !rc && so(e, t) ? (e = eo(), pi = nc = xl = null, _a = !1, e) : null;
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
        return io && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Rp = {
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
  function oo(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Rp[e.type] : t === "textarea";
  }
  function fo(e, t, l, a) {
    ba ? xa ? xa.push(a) : xa = [a] : ba = a, t = su(t, "onChange"), 0 < t.length && (l = new yi(
      "onChange",
      "change",
      null,
      l,
      a
    ), e.push({ event: l, listeners: t }));
  }
  var mn = null, hn = null;
  function zp(e) {
    $d(e, 0);
  }
  function xi(e) {
    var t = cn(e);
    if (Vr(t)) return e;
  }
  function mo(e, t) {
    if (e === "change") return t;
  }
  var ho = !1;
  if (tl) {
    var oc;
    if (tl) {
      var fc = "oninput" in document;
      if (!fc) {
        var po = document.createElement("div");
        po.setAttribute("oninput", "return;"), fc = typeof po.oninput == "function";
      }
      oc = fc;
    } else oc = !1;
    ho = oc && (!document.documentMode || 9 < document.documentMode);
  }
  function vo() {
    mn && (mn.detachEvent("onpropertychange", go), hn = mn = null);
  }
  function go(e) {
    if (e.propertyName === "value" && xi(hn)) {
      var t = [];
      fo(
        t,
        hn,
        e,
        tc(e)
      ), Ir(zp, t);
    }
  }
  function Ap(e, t, l) {
    e === "focusin" ? (vo(), mn = t, hn = l, mn.attachEvent("onpropertychange", go)) : e === "focusout" && vo();
  }
  function Cp(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return xi(hn);
  }
  function Mp(e, t) {
    if (e === "click") return xi(t);
  }
  function Op(e, t) {
    if (e === "input" || e === "change")
      return xi(t);
  }
  function wp(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var _t = typeof Object.is == "function" ? Object.is : wp;
  function pn(e, t) {
    if (_t(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var l = Object.keys(e), a = Object.keys(t);
    if (l.length !== a.length) return !1;
    for (a = 0; a < l.length; a++) {
      var n = l[a];
      if (!Gu.call(t, n) || !_t(e[n], t[n]))
        return !1;
    }
    return !0;
  }
  function yo(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function bo(e, t) {
    var l = yo(e);
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
      l = yo(l);
    }
  }
  function xo(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? xo(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function _o(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = mi(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var l = typeof t.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) e = t.contentWindow;
      else break;
      t = mi(e.document);
    }
    return t;
  }
  function dc(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var Dp = tl && "documentMode" in document && 11 >= document.documentMode, Sa = null, mc = null, vn = null, hc = !1;
  function So(e, t, l) {
    var a = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    hc || Sa == null || Sa !== mi(a) || (a = Sa, "selectionStart" in a && dc(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), vn && pn(vn, a) || (vn = a, a = su(mc, "onSelect"), 0 < a.length && (t = new yi(
      "onSelect",
      "select",
      null,
      t,
      l
    ), e.push({ event: t, listeners: a }), t.target = Sa)));
  }
  function Jl(e, t) {
    var l = {};
    return l[e.toLowerCase()] = t.toLowerCase(), l["Webkit" + e] = "webkit" + t, l["Moz" + e] = "moz" + t, l;
  }
  var ja = {
    animationend: Jl("Animation", "AnimationEnd"),
    animationiteration: Jl("Animation", "AnimationIteration"),
    animationstart: Jl("Animation", "AnimationStart"),
    transitionrun: Jl("Transition", "TransitionRun"),
    transitionstart: Jl("Transition", "TransitionStart"),
    transitioncancel: Jl("Transition", "TransitionCancel"),
    transitionend: Jl("Transition", "TransitionEnd")
  }, pc = {}, jo = {};
  tl && (jo = document.createElement("div").style, "AnimationEvent" in window || (delete ja.animationend.animation, delete ja.animationiteration.animation, delete ja.animationstart.animation), "TransitionEvent" in window || delete ja.transitionend.transition);
  function $l(e) {
    if (pc[e]) return pc[e];
    if (!ja[e]) return e;
    var t = ja[e], l;
    for (l in t)
      if (t.hasOwnProperty(l) && l in jo)
        return pc[e] = t[l];
    return e;
  }
  var Eo = $l("animationend"), No = $l("animationiteration"), To = $l("animationstart"), Up = $l("transitionrun"), Hp = $l("transitionstart"), Lp = $l("transitioncancel"), Ro = $l("transitionend"), zo = /* @__PURE__ */ new Map(), vc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  vc.push("scrollEnd");
  function Gt(e, t) {
    zo.set(e, t), Vl(t, [e]);
  }
  var _i = typeof reportError == "function" ? reportError : function(e) {
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
  }, Ot = [], Ea = 0, gc = 0;
  function Si() {
    for (var e = Ea, t = gc = Ea = 0; t < e; ) {
      var l = Ot[t];
      Ot[t++] = null;
      var a = Ot[t];
      Ot[t++] = null;
      var n = Ot[t];
      Ot[t++] = null;
      var i = Ot[t];
      if (Ot[t++] = null, a !== null && n !== null) {
        var o = a.pending;
        o === null ? n.next = n : (n.next = o.next, o.next = n), a.pending = n;
      }
      i !== 0 && Ao(l, n, i);
    }
  }
  function ji(e, t, l, a) {
    Ot[Ea++] = e, Ot[Ea++] = t, Ot[Ea++] = l, Ot[Ea++] = a, gc |= a, e.lanes |= a, e = e.alternate, e !== null && (e.lanes |= a);
  }
  function yc(e, t, l, a) {
    return ji(e, t, l, a), Ei(e);
  }
  function Fl(e, t) {
    return ji(e, null, null, t), Ei(e);
  }
  function Ao(e, t, l) {
    e.lanes |= l;
    var a = e.alternate;
    a !== null && (a.lanes |= l);
    for (var n = !1, i = e.return; i !== null; )
      i.childLanes |= l, a = i.alternate, a !== null && (a.childLanes |= l), i.tag === 22 && (e = i.stateNode, e === null || e._visibility & 1 || (n = !0)), e = i, i = i.return;
    return e.tag === 3 ? (i = e.stateNode, n && t !== null && (n = 31 - xt(l), e = i.hiddenUpdates, a = e[n], a === null ? e[n] = [t] : a.push(t), t.lane = l | 536870912), i) : null;
  }
  function Ei(e) {
    if (50 < Bn)
      throw Bn = 0, Rs = null, Error(s(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var Na = {};
  function Bp(e, t, l, a) {
    this.tag = e, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function St(e, t, l, a) {
    return new Bp(e, t, l, a);
  }
  function bc(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function ll(e, t) {
    var l = e.alternate;
    return l === null ? (l = St(
      e.tag,
      t,
      e.key,
      e.mode
    ), l.elementType = e.elementType, l.type = e.type, l.stateNode = e.stateNode, l.alternate = e, e.alternate = l) : (l.pendingProps = t, l.type = e.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = e.flags & 65011712, l.childLanes = e.childLanes, l.lanes = e.lanes, l.child = e.child, l.memoizedProps = e.memoizedProps, l.memoizedState = e.memoizedState, l.updateQueue = e.updateQueue, t = e.dependencies, l.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, l.sibling = e.sibling, l.index = e.index, l.ref = e.ref, l.refCleanup = e.refCleanup, l;
  }
  function Co(e, t) {
    e.flags &= 65011714;
    var l = e.alternate;
    return l === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = l.childLanes, e.lanes = l.lanes, e.child = l.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = l.memoizedProps, e.memoizedState = l.memoizedState, e.updateQueue = l.updateQueue, e.type = l.type, t = l.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function Ni(e, t, l, a, n, i) {
    var o = 0;
    if (a = e, typeof e == "function") bc(e) && (o = 1);
    else if (typeof e == "string")
      o = Xv(
        e,
        l,
        J.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case we:
          return e = St(31, l, t, n), e.elementType = we, e.lanes = i, e;
        case k:
          return Wl(l.children, n, i, t);
        case U:
          o = 8, n |= 24;
          break;
        case X:
          return e = St(12, l, t, n | 2), e.elementType = X, e.lanes = i, e;
        case ce:
          return e = St(13, l, t, n), e.elementType = ce, e.lanes = i, e;
        case se:
          return e = St(19, l, t, n), e.elementType = se, e.lanes = i, e;
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case B:
                o = 10;
                break e;
              case V:
                o = 9;
                break e;
              case le:
                o = 11;
                break e;
              case F:
                o = 14;
                break e;
              case xe:
                o = 16, a = null;
                break e;
            }
          o = 29, l = Error(
            s(130, e === null ? "null" : typeof e, "")
          ), a = null;
      }
    return t = St(o, l, t, n), t.elementType = e, t.type = a, t.lanes = i, t;
  }
  function Wl(e, t, l, a) {
    return e = St(7, e, a, t), e.lanes = l, e;
  }
  function xc(e, t, l) {
    return e = St(6, e, null, t), e.lanes = l, e;
  }
  function Mo(e) {
    var t = St(18, null, null, 0);
    return t.stateNode = e, t;
  }
  function _c(e, t, l) {
    return t = St(
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
  var Oo = /* @__PURE__ */ new WeakMap();
  function wt(e, t) {
    if (typeof e == "object" && e !== null) {
      var l = Oo.get(e);
      return l !== void 0 ? l : (t = {
        value: e,
        source: t,
        stack: Cr(t)
      }, Oo.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: Cr(t)
    };
  }
  var Ta = [], Ra = 0, Ti = null, gn = 0, Dt = [], Ut = 0, _l = null, Jt = 1, $t = "";
  function al(e, t) {
    Ta[Ra++] = gn, Ta[Ra++] = Ti, Ti = e, gn = t;
  }
  function wo(e, t, l) {
    Dt[Ut++] = Jt, Dt[Ut++] = $t, Dt[Ut++] = _l, _l = e;
    var a = Jt;
    e = $t;
    var n = 32 - xt(a) - 1;
    a &= ~(1 << n), l += 1;
    var i = 32 - xt(t) + n;
    if (30 < i) {
      var o = n - n % 5;
      i = (a & (1 << o) - 1).toString(32), a >>= o, n -= o, Jt = 1 << 32 - xt(t) + n | l << n | a, $t = i + e;
    } else
      Jt = 1 << i | l << n | a, $t = e;
  }
  function Sc(e) {
    e.return !== null && (al(e, 1), wo(e, 1, 0));
  }
  function jc(e) {
    for (; e === Ti; )
      Ti = Ta[--Ra], Ta[Ra] = null, gn = Ta[--Ra], Ta[Ra] = null;
    for (; e === _l; )
      _l = Dt[--Ut], Dt[Ut] = null, $t = Dt[--Ut], Dt[Ut] = null, Jt = Dt[--Ut], Dt[Ut] = null;
  }
  function Do(e, t) {
    Dt[Ut++] = Jt, Dt[Ut++] = $t, Dt[Ut++] = _l, Jt = t.id, $t = t.overflow, _l = e;
  }
  var et = null, Me = null, ve = !1, Sl = null, Ht = !1, Ec = Error(s(519));
  function jl(e) {
    var t = Error(
      s(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw yn(wt(t, e)), Ec;
  }
  function Uo(e) {
    var t = e.stateNode, l = e.type, a = e.memoizedProps;
    switch (t[Ie] = e, t[ot] = a, l) {
      case "dialog":
        fe("cancel", t), fe("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        fe("load", t);
        break;
      case "video":
      case "audio":
        for (l = 0; l < Yn.length; l++)
          fe(Yn[l], t);
        break;
      case "source":
        fe("error", t);
        break;
      case "img":
      case "image":
      case "link":
        fe("error", t), fe("load", t);
        break;
      case "details":
        fe("toggle", t);
        break;
      case "input":
        fe("invalid", t), Kr(
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
        fe("invalid", t);
        break;
      case "textarea":
        fe("invalid", t), $r(t, a.value, a.defaultValue, a.children);
    }
    l = a.children, typeof l != "string" && typeof l != "number" && typeof l != "bigint" || t.textContent === "" + l || a.suppressHydrationWarning === !0 || Id(t.textContent, l) ? (a.popover != null && (fe("beforetoggle", t), fe("toggle", t)), a.onScroll != null && fe("scroll", t), a.onScrollEnd != null && fe("scrollend", t), a.onClick != null && (t.onclick = el), t = !0) : t = !1, t || jl(e, !0);
  }
  function Ho(e) {
    for (et = e.return; et; )
      switch (et.tag) {
        case 5:
        case 31:
        case 13:
          Ht = !1;
          return;
        case 27:
        case 3:
          Ht = !0;
          return;
        default:
          et = et.return;
      }
  }
  function za(e) {
    if (e !== et) return !1;
    if (!ve) return Ho(e), ve = !0, !1;
    var t = e.tag, l;
    if ((l = t !== 3 && t !== 27) && ((l = t === 5) && (l = e.type, l = !(l !== "form" && l !== "button") || Gs(e.type, e.memoizedProps)), l = !l), l && Me && jl(e), Ho(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(s(317));
      Me = sm(e);
    } else if (t === 31) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(s(317));
      Me = sm(e);
    } else
      t === 27 ? (t = Me, Ll(e.type) ? (e = Ks, Ks = null, Me = e) : Me = t) : Me = et ? Bt(e.stateNode.nextSibling) : null;
    return !0;
  }
  function Pl() {
    Me = et = null, ve = !1;
  }
  function Nc() {
    var e = Sl;
    return e !== null && (pt === null ? pt = e : pt.push.apply(
      pt,
      e
    ), Sl = null), e;
  }
  function yn(e) {
    Sl === null ? Sl = [e] : Sl.push(e);
  }
  var Tc = j(null), Il = null, nl = null;
  function El(e, t, l) {
    Q(Tc, t._currentValue), t._currentValue = l;
  }
  function il(e) {
    e._currentValue = Tc.current, H(Tc);
  }
  function Rc(e, t, l) {
    for (; e !== null; ) {
      var a = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, a !== null && (a.childLanes |= t)) : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t), e === l) break;
      e = e.return;
    }
  }
  function zc(e, t, l, a) {
    var n = e.child;
    for (n !== null && (n.return = e); n !== null; ) {
      var i = n.dependencies;
      if (i !== null) {
        var o = n.child;
        i = i.firstContext;
        e: for (; i !== null; ) {
          var m = i;
          i = n;
          for (var x = 0; x < t.length; x++)
            if (m.context === t[x]) {
              i.lanes |= l, m = i.alternate, m !== null && (m.lanes |= l), Rc(
                i.return,
                l,
                e
              ), a || (o = null);
              break e;
            }
          i = m.next;
        }
      } else if (n.tag === 18) {
        if (o = n.return, o === null) throw Error(s(341));
        o.lanes |= l, i = o.alternate, i !== null && (i.lanes |= l), Rc(o, l, e), o = null;
      } else o = n.child;
      if (o !== null) o.return = n;
      else
        for (o = n; o !== null; ) {
          if (o === e) {
            o = null;
            break;
          }
          if (n = o.sibling, n !== null) {
            n.return = o.return, o = n;
            break;
          }
          o = o.return;
        }
      n = o;
    }
  }
  function Aa(e, t, l, a) {
    e = null;
    for (var n = t, i = !1; n !== null; ) {
      if (!i) {
        if ((n.flags & 524288) !== 0) i = !0;
        else if ((n.flags & 262144) !== 0) break;
      }
      if (n.tag === 10) {
        var o = n.alternate;
        if (o === null) throw Error(s(387));
        if (o = o.memoizedProps, o !== null) {
          var m = n.type;
          _t(n.pendingProps.value, o.value) || (e !== null ? e.push(m) : e = [m]);
        }
      } else if (n === Se.current) {
        if (o = n.alternate, o === null) throw Error(s(387));
        o.memoizedState.memoizedState !== n.memoizedState.memoizedState && (e !== null ? e.push(Zn) : e = [Zn]);
      }
      n = n.return;
    }
    e !== null && zc(
      t,
      e,
      l,
      a
    ), t.flags |= 262144;
  }
  function Ri(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!_t(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function ea(e) {
    Il = e, nl = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function tt(e) {
    return Lo(Il, e);
  }
  function zi(e, t) {
    return Il === null && ea(e), Lo(e, t);
  }
  function Lo(e, t) {
    var l = t._currentValue;
    if (t = { context: t, memoizedValue: l, next: null }, nl === null) {
      if (e === null) throw Error(s(308));
      nl = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else nl = nl.next = t;
    return l;
  }
  var qp = typeof AbortController < "u" ? AbortController : function() {
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
  }, Yp = u.unstable_scheduleCallback, kp = u.unstable_NormalPriority, Qe = {
    $$typeof: B,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Ac() {
    return {
      controller: new qp(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function bn(e) {
    e.refCount--, e.refCount === 0 && Yp(kp, function() {
      e.controller.abort();
    });
  }
  var xn = null, Cc = 0, Ca = 0, Ma = null;
  function Gp(e, t) {
    if (xn === null) {
      var l = xn = [];
      Cc = 0, Ca = ws(), Ma = {
        status: "pending",
        value: void 0,
        then: function(a) {
          l.push(a);
        }
      };
    }
    return Cc++, t.then(Bo, Bo), t;
  }
  function Bo() {
    if (--Cc === 0 && xn !== null) {
      Ma !== null && (Ma.status = "fulfilled");
      var e = xn;
      xn = null, Ca = 0, Ma = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function Xp(e, t) {
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
  var qo = M.S;
  M.S = function(e, t) {
    jd = yt(), typeof t == "object" && t !== null && typeof t.then == "function" && Gp(e, t), qo !== null && qo(e, t);
  };
  var ta = j(null);
  function Mc() {
    var e = ta.current;
    return e !== null ? e : ze.pooledCache;
  }
  function Ai(e, t) {
    t === null ? Q(ta, ta.current) : Q(ta, t.pool);
  }
  function Yo() {
    var e = Mc();
    return e === null ? null : { parent: Qe._currentValue, pool: e };
  }
  var Oa = Error(s(460)), Oc = Error(s(474)), Ci = Error(s(542)), Mi = { then: function() {
  } };
  function ko(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function Go(e, t, l) {
    switch (l = e[l], l === void 0 ? e.push(t) : l !== t && (t.then(el, el), t = l), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, Qo(e), e;
      default:
        if (typeof t.status == "string") t.then(el, el);
        else {
          if (e = ze, e !== null && 100 < e.shellSuspendCounter)
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
            throw e = t.reason, Qo(e), e;
        }
        throw aa = t, Oa;
    }
  }
  function la(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (l) {
      throw l !== null && typeof l == "object" && typeof l.then == "function" ? (aa = l, Oa) : l;
    }
  }
  var aa = null;
  function Xo() {
    if (aa === null) throw Error(s(459));
    var e = aa;
    return aa = null, e;
  }
  function Qo(e) {
    if (e === Oa || e === Ci)
      throw Error(s(483));
  }
  var wa = null, _n = 0;
  function Oi(e) {
    var t = _n;
    return _n += 1, wa === null && (wa = []), Go(wa, e, t);
  }
  function Sn(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function wi(e, t) {
    throw t.$$typeof === T ? Error(s(525)) : (e = Object.prototype.toString.call(t), Error(
      s(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function Zo(e) {
    function t(N, S) {
      if (e) {
        var R = N.deletions;
        R === null ? (N.deletions = [S], N.flags |= 16) : R.push(S);
      }
    }
    function l(N, S) {
      if (!e) return null;
      for (; S !== null; )
        t(N, S), S = S.sibling;
      return null;
    }
    function a(N) {
      for (var S = /* @__PURE__ */ new Map(); N !== null; )
        N.key !== null ? S.set(N.key, N) : S.set(N.index, N), N = N.sibling;
      return S;
    }
    function n(N, S) {
      return N = ll(N, S), N.index = 0, N.sibling = null, N;
    }
    function i(N, S, R) {
      return N.index = R, e ? (R = N.alternate, R !== null ? (R = R.index, R < S ? (N.flags |= 67108866, S) : R) : (N.flags |= 67108866, S)) : (N.flags |= 1048576, S);
    }
    function o(N) {
      return e && N.alternate === null && (N.flags |= 67108866), N;
    }
    function m(N, S, R, D) {
      return S === null || S.tag !== 6 ? (S = xc(R, N.mode, D), S.return = N, S) : (S = n(S, R), S.return = N, S);
    }
    function x(N, S, R, D) {
      var W = R.type;
      return W === k ? w(
        N,
        S,
        R.props.children,
        D,
        R.key
      ) : S !== null && (S.elementType === W || typeof W == "object" && W !== null && W.$$typeof === xe && la(W) === S.type) ? (S = n(S, R.props), Sn(S, R), S.return = N, S) : (S = Ni(
        R.type,
        R.key,
        R.props,
        null,
        N.mode,
        D
      ), Sn(S, R), S.return = N, S);
    }
    function z(N, S, R, D) {
      return S === null || S.tag !== 4 || S.stateNode.containerInfo !== R.containerInfo || S.stateNode.implementation !== R.implementation ? (S = _c(R, N.mode, D), S.return = N, S) : (S = n(S, R.children || []), S.return = N, S);
    }
    function w(N, S, R, D, W) {
      return S === null || S.tag !== 7 ? (S = Wl(
        R,
        N.mode,
        D,
        W
      ), S.return = N, S) : (S = n(S, R), S.return = N, S);
    }
    function L(N, S, R) {
      if (typeof S == "string" && S !== "" || typeof S == "number" || typeof S == "bigint")
        return S = xc(
          "" + S,
          N.mode,
          R
        ), S.return = N, S;
      if (typeof S == "object" && S !== null) {
        switch (S.$$typeof) {
          case Y:
            return R = Ni(
              S.type,
              S.key,
              S.props,
              null,
              N.mode,
              R
            ), Sn(R, S), R.return = N, R;
          case G:
            return S = _c(
              S,
              N.mode,
              R
            ), S.return = N, S;
          case xe:
            return S = la(S), L(N, S, R);
        }
        if (P(S) || Le(S))
          return S = Wl(
            S,
            N.mode,
            R,
            null
          ), S.return = N, S;
        if (typeof S.then == "function")
          return L(N, Oi(S), R);
        if (S.$$typeof === B)
          return L(
            N,
            zi(N, S),
            R
          );
        wi(N, S);
      }
      return null;
    }
    function A(N, S, R, D) {
      var W = S !== null ? S.key : null;
      if (typeof R == "string" && R !== "" || typeof R == "number" || typeof R == "bigint")
        return W !== null ? null : m(N, S, "" + R, D);
      if (typeof R == "object" && R !== null) {
        switch (R.$$typeof) {
          case Y:
            return R.key === W ? x(N, S, R, D) : null;
          case G:
            return R.key === W ? z(N, S, R, D) : null;
          case xe:
            return R = la(R), A(N, S, R, D);
        }
        if (P(R) || Le(R))
          return W !== null ? null : w(N, S, R, D, null);
        if (typeof R.then == "function")
          return A(
            N,
            S,
            Oi(R),
            D
          );
        if (R.$$typeof === B)
          return A(
            N,
            S,
            zi(N, R),
            D
          );
        wi(N, R);
      }
      return null;
    }
    function O(N, S, R, D, W) {
      if (typeof D == "string" && D !== "" || typeof D == "number" || typeof D == "bigint")
        return N = N.get(R) || null, m(S, N, "" + D, W);
      if (typeof D == "object" && D !== null) {
        switch (D.$$typeof) {
          case Y:
            return N = N.get(
              D.key === null ? R : D.key
            ) || null, x(S, N, D, W);
          case G:
            return N = N.get(
              D.key === null ? R : D.key
            ) || null, z(S, N, D, W);
          case xe:
            return D = la(D), O(
              N,
              S,
              R,
              D,
              W
            );
        }
        if (P(D) || Le(D))
          return N = N.get(R) || null, w(S, N, D, W, null);
        if (typeof D.then == "function")
          return O(
            N,
            S,
            R,
            Oi(D),
            W
          );
        if (D.$$typeof === B)
          return O(
            N,
            S,
            R,
            zi(S, D),
            W
          );
        wi(S, D);
      }
      return null;
    }
    function K(N, S, R, D) {
      for (var W = null, ye = null, $ = S, ue = S = 0, he = null; $ !== null && ue < R.length; ue++) {
        $.index > ue ? (he = $, $ = null) : he = $.sibling;
        var be = A(
          N,
          $,
          R[ue],
          D
        );
        if (be === null) {
          $ === null && ($ = he);
          break;
        }
        e && $ && be.alternate === null && t(N, $), S = i(be, S, ue), ye === null ? W = be : ye.sibling = be, ye = be, $ = he;
      }
      if (ue === R.length)
        return l(N, $), ve && al(N, ue), W;
      if ($ === null) {
        for (; ue < R.length; ue++)
          $ = L(N, R[ue], D), $ !== null && (S = i(
            $,
            S,
            ue
          ), ye === null ? W = $ : ye.sibling = $, ye = $);
        return ve && al(N, ue), W;
      }
      for ($ = a($); ue < R.length; ue++)
        he = O(
          $,
          N,
          ue,
          R[ue],
          D
        ), he !== null && (e && he.alternate !== null && $.delete(
          he.key === null ? ue : he.key
        ), S = i(
          he,
          S,
          ue
        ), ye === null ? W = he : ye.sibling = he, ye = he);
      return e && $.forEach(function(Gl) {
        return t(N, Gl);
      }), ve && al(N, ue), W;
    }
    function te(N, S, R, D) {
      if (R == null) throw Error(s(151));
      for (var W = null, ye = null, $ = S, ue = S = 0, he = null, be = R.next(); $ !== null && !be.done; ue++, be = R.next()) {
        $.index > ue ? (he = $, $ = null) : he = $.sibling;
        var Gl = A(N, $, be.value, D);
        if (Gl === null) {
          $ === null && ($ = he);
          break;
        }
        e && $ && Gl.alternate === null && t(N, $), S = i(Gl, S, ue), ye === null ? W = Gl : ye.sibling = Gl, ye = Gl, $ = he;
      }
      if (be.done)
        return l(N, $), ve && al(N, ue), W;
      if ($ === null) {
        for (; !be.done; ue++, be = R.next())
          be = L(N, be.value, D), be !== null && (S = i(be, S, ue), ye === null ? W = be : ye.sibling = be, ye = be);
        return ve && al(N, ue), W;
      }
      for ($ = a($); !be.done; ue++, be = R.next())
        be = O($, N, ue, be.value, D), be !== null && (e && be.alternate !== null && $.delete(be.key === null ? ue : be.key), S = i(be, S, ue), ye === null ? W = be : ye.sibling = be, ye = be);
      return e && $.forEach(function(eg) {
        return t(N, eg);
      }), ve && al(N, ue), W;
    }
    function Re(N, S, R, D) {
      if (typeof R == "object" && R !== null && R.type === k && R.key === null && (R = R.props.children), typeof R == "object" && R !== null) {
        switch (R.$$typeof) {
          case Y:
            e: {
              for (var W = R.key; S !== null; ) {
                if (S.key === W) {
                  if (W = R.type, W === k) {
                    if (S.tag === 7) {
                      l(
                        N,
                        S.sibling
                      ), D = n(
                        S,
                        R.props.children
                      ), D.return = N, N = D;
                      break e;
                    }
                  } else if (S.elementType === W || typeof W == "object" && W !== null && W.$$typeof === xe && la(W) === S.type) {
                    l(
                      N,
                      S.sibling
                    ), D = n(S, R.props), Sn(D, R), D.return = N, N = D;
                    break e;
                  }
                  l(N, S);
                  break;
                } else t(N, S);
                S = S.sibling;
              }
              R.type === k ? (D = Wl(
                R.props.children,
                N.mode,
                D,
                R.key
              ), D.return = N, N = D) : (D = Ni(
                R.type,
                R.key,
                R.props,
                null,
                N.mode,
                D
              ), Sn(D, R), D.return = N, N = D);
            }
            return o(N);
          case G:
            e: {
              for (W = R.key; S !== null; ) {
                if (S.key === W)
                  if (S.tag === 4 && S.stateNode.containerInfo === R.containerInfo && S.stateNode.implementation === R.implementation) {
                    l(
                      N,
                      S.sibling
                    ), D = n(S, R.children || []), D.return = N, N = D;
                    break e;
                  } else {
                    l(N, S);
                    break;
                  }
                else t(N, S);
                S = S.sibling;
              }
              D = _c(R, N.mode, D), D.return = N, N = D;
            }
            return o(N);
          case xe:
            return R = la(R), Re(
              N,
              S,
              R,
              D
            );
        }
        if (P(R))
          return K(
            N,
            S,
            R,
            D
          );
        if (Le(R)) {
          if (W = Le(R), typeof W != "function") throw Error(s(150));
          return R = W.call(R), te(
            N,
            S,
            R,
            D
          );
        }
        if (typeof R.then == "function")
          return Re(
            N,
            S,
            Oi(R),
            D
          );
        if (R.$$typeof === B)
          return Re(
            N,
            S,
            zi(N, R),
            D
          );
        wi(N, R);
      }
      return typeof R == "string" && R !== "" || typeof R == "number" || typeof R == "bigint" ? (R = "" + R, S !== null && S.tag === 6 ? (l(N, S.sibling), D = n(S, R), D.return = N, N = D) : (l(N, S), D = xc(R, N.mode, D), D.return = N, N = D), o(N)) : l(N, S);
    }
    return function(N, S, R, D) {
      try {
        _n = 0;
        var W = Re(
          N,
          S,
          R,
          D
        );
        return wa = null, W;
      } catch ($) {
        if ($ === Oa || $ === Ci) throw $;
        var ye = St(29, $, null, N.mode);
        return ye.lanes = D, ye.return = N, ye;
      } finally {
      }
    };
  }
  var na = Zo(!0), Vo = Zo(!1), Nl = !1;
  function wc(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Dc(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function Tl(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function Rl(e, t, l) {
    var a = e.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (_e & 2) !== 0) {
      var n = a.pending;
      return n === null ? t.next = t : (t.next = n.next, n.next = t), a.pending = t, t = Ei(e), Ao(e, null, l), t;
    }
    return ji(e, a, t, l), Ei(e);
  }
  function jn(e, t, l) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (l & 4194048) !== 0)) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, Hr(e, l);
    }
  }
  function Uc(e, t) {
    var l = e.updateQueue, a = e.alternate;
    if (a !== null && (a = a.updateQueue, l === a)) {
      var n = null, i = null;
      if (l = l.firstBaseUpdate, l !== null) {
        do {
          var o = {
            lane: l.lane,
            tag: l.tag,
            payload: l.payload,
            callback: null,
            next: null
          };
          i === null ? n = i = o : i = i.next = o, l = l.next;
        } while (l !== null);
        i === null ? n = i = t : i = i.next = t;
      } else n = i = t;
      l = {
        baseState: a.baseState,
        firstBaseUpdate: n,
        lastBaseUpdate: i,
        shared: a.shared,
        callbacks: a.callbacks
      }, e.updateQueue = l;
      return;
    }
    e = l.lastBaseUpdate, e === null ? l.firstBaseUpdate = t : e.next = t, l.lastBaseUpdate = t;
  }
  var Hc = !1;
  function En() {
    if (Hc) {
      var e = Ma;
      if (e !== null) throw e;
    }
  }
  function Nn(e, t, l, a) {
    Hc = !1;
    var n = e.updateQueue;
    Nl = !1;
    var i = n.firstBaseUpdate, o = n.lastBaseUpdate, m = n.shared.pending;
    if (m !== null) {
      n.shared.pending = null;
      var x = m, z = x.next;
      x.next = null, o === null ? i = z : o.next = z, o = x;
      var w = e.alternate;
      w !== null && (w = w.updateQueue, m = w.lastBaseUpdate, m !== o && (m === null ? w.firstBaseUpdate = z : m.next = z, w.lastBaseUpdate = x));
    }
    if (i !== null) {
      var L = n.baseState;
      o = 0, w = z = x = null, m = i;
      do {
        var A = m.lane & -536870913, O = A !== m.lane;
        if (O ? (me & A) === A : (a & A) === A) {
          A !== 0 && A === Ca && (Hc = !0), w !== null && (w = w.next = {
            lane: 0,
            tag: m.tag,
            payload: m.payload,
            callback: null,
            next: null
          });
          e: {
            var K = e, te = m;
            A = t;
            var Re = l;
            switch (te.tag) {
              case 1:
                if (K = te.payload, typeof K == "function") {
                  L = K.call(Re, L, A);
                  break e;
                }
                L = K;
                break e;
              case 3:
                K.flags = K.flags & -65537 | 128;
              case 0:
                if (K = te.payload, A = typeof K == "function" ? K.call(Re, L, A) : K, A == null) break e;
                L = _({}, L, A);
                break e;
              case 2:
                Nl = !0;
            }
          }
          A = m.callback, A !== null && (e.flags |= 64, O && (e.flags |= 8192), O = n.callbacks, O === null ? n.callbacks = [A] : O.push(A));
        } else
          O = {
            lane: A,
            tag: m.tag,
            payload: m.payload,
            callback: m.callback,
            next: null
          }, w === null ? (z = w = O, x = L) : w = w.next = O, o |= A;
        if (m = m.next, m === null) {
          if (m = n.shared.pending, m === null)
            break;
          O = m, m = O.next, O.next = null, n.lastBaseUpdate = O, n.shared.pending = null;
        }
      } while (!0);
      w === null && (x = L), n.baseState = x, n.firstBaseUpdate = z, n.lastBaseUpdate = w, i === null && (n.shared.lanes = 0), Ol |= o, e.lanes = o, e.memoizedState = L;
    }
  }
  function Ko(e, t) {
    if (typeof e != "function")
      throw Error(s(191, e));
    e.call(t);
  }
  function Jo(e, t) {
    var l = e.callbacks;
    if (l !== null)
      for (e.callbacks = null, e = 0; e < l.length; e++)
        Ko(l[e], t);
  }
  var Da = j(null), Di = j(0);
  function $o(e, t) {
    e = hl, Q(Di, e), Q(Da, t), hl = e | t.baseLanes;
  }
  function Lc() {
    Q(Di, hl), Q(Da, Da.current);
  }
  function Bc() {
    hl = Di.current, H(Da), H(Di);
  }
  var jt = j(null), Lt = null;
  function zl(e) {
    var t = e.alternate;
    Q(Ge, Ge.current & 1), Q(jt, e), Lt === null && (t === null || Da.current !== null || t.memoizedState !== null) && (Lt = e);
  }
  function qc(e) {
    Q(Ge, Ge.current), Q(jt, e), Lt === null && (Lt = e);
  }
  function Fo(e) {
    e.tag === 22 ? (Q(Ge, Ge.current), Q(jt, e), Lt === null && (Lt = e)) : Al();
  }
  function Al() {
    Q(Ge, Ge.current), Q(jt, jt.current);
  }
  function Et(e) {
    H(jt), Lt === e && (Lt = null), H(Ge);
  }
  var Ge = j(0);
  function Ui(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var l = t.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || Zs(l) || Vs(l)))
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
  var ul = 0, ie = null, Ne = null, Ze = null, Hi = !1, Ua = !1, ia = !1, Li = 0, Tn = 0, Ha = null, Qp = 0;
  function Be() {
    throw Error(s(321));
  }
  function Yc(e, t) {
    if (t === null) return !1;
    for (var l = 0; l < t.length && l < e.length; l++)
      if (!_t(e[l], t[l])) return !1;
    return !0;
  }
  function kc(e, t, l, a, n, i) {
    return ul = i, ie = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, M.H = e === null || e.memoizedState === null ? Df : ls, ia = !1, i = l(a, n), ia = !1, Ua && (i = Po(
      t,
      l,
      a,
      n
    )), Wo(e), i;
  }
  function Wo(e) {
    M.H = An;
    var t = Ne !== null && Ne.next !== null;
    if (ul = 0, Ze = Ne = ie = null, Hi = !1, Tn = 0, Ha = null, t) throw Error(s(300));
    e === null || Ve || (e = e.dependencies, e !== null && Ri(e) && (Ve = !0));
  }
  function Po(e, t, l, a) {
    ie = e;
    var n = 0;
    do {
      if (Ua && (Ha = null), Tn = 0, Ua = !1, 25 <= n) throw Error(s(301));
      if (n += 1, Ze = Ne = null, e.updateQueue != null) {
        var i = e.updateQueue;
        i.lastEffect = null, i.events = null, i.stores = null, i.memoCache != null && (i.memoCache.index = 0);
      }
      M.H = Uf, i = t(l, a);
    } while (Ua);
    return i;
  }
  function Zp() {
    var e = M.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? Rn(t) : t, e = e.useState()[0], (Ne !== null ? Ne.memoizedState : null) !== e && (ie.flags |= 1024), t;
  }
  function Gc() {
    var e = Li !== 0;
    return Li = 0, e;
  }
  function Xc(e, t, l) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l;
  }
  function Qc(e) {
    if (Hi) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      Hi = !1;
    }
    ul = 0, Ze = Ne = ie = null, Ua = !1, Tn = Li = 0, Ha = null;
  }
  function rt() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Ze === null ? ie.memoizedState = Ze = e : Ze = Ze.next = e, Ze;
  }
  function Xe() {
    if (Ne === null) {
      var e = ie.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Ne.next;
    var t = Ze === null ? ie.memoizedState : Ze.next;
    if (t !== null)
      Ze = t, Ne = e;
    else {
      if (e === null)
        throw ie.alternate === null ? Error(s(467)) : Error(s(310));
      Ne = e, e = {
        memoizedState: Ne.memoizedState,
        baseState: Ne.baseState,
        baseQueue: Ne.baseQueue,
        queue: Ne.queue,
        next: null
      }, Ze === null ? ie.memoizedState = Ze = e : Ze = Ze.next = e;
    }
    return Ze;
  }
  function Bi() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Rn(e) {
    var t = Tn;
    return Tn += 1, Ha === null && (Ha = []), e = Go(Ha, e, t), t = ie, (Ze === null ? t.memoizedState : Ze.next) === null && (t = t.alternate, M.H = t === null || t.memoizedState === null ? Df : ls), e;
  }
  function qi(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return Rn(e);
      if (e.$$typeof === B) return tt(e);
    }
    throw Error(s(438, String(e)));
  }
  function Zc(e) {
    var t = null, l = ie.updateQueue;
    if (l !== null && (t = l.memoCache), t == null) {
      var a = ie.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (t = {
        data: a.data.map(function(n) {
          return n.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), l === null && (l = Bi(), ie.updateQueue = l), l.memoCache = t, l = t.data[t.index], l === void 0)
      for (l = t.data[t.index] = Array(e), a = 0; a < e; a++)
        l[a] = Fe;
    return t.index++, l;
  }
  function cl(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function Yi(e) {
    var t = Xe();
    return Vc(t, Ne, e);
  }
  function Vc(e, t, l) {
    var a = e.queue;
    if (a === null) throw Error(s(311));
    a.lastRenderedReducer = l;
    var n = e.baseQueue, i = a.pending;
    if (i !== null) {
      if (n !== null) {
        var o = n.next;
        n.next = i.next, i.next = o;
      }
      t.baseQueue = n = i, a.pending = null;
    }
    if (i = e.baseState, n === null) e.memoizedState = i;
    else {
      t = n.next;
      var m = o = null, x = null, z = t, w = !1;
      do {
        var L = z.lane & -536870913;
        if (L !== z.lane ? (me & L) === L : (ul & L) === L) {
          var A = z.revertLane;
          if (A === 0)
            x !== null && (x = x.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: z.action,
              hasEagerState: z.hasEagerState,
              eagerState: z.eagerState,
              next: null
            }), L === Ca && (w = !0);
          else if ((ul & A) === A) {
            z = z.next, A === Ca && (w = !0);
            continue;
          } else
            L = {
              lane: 0,
              revertLane: z.revertLane,
              gesture: null,
              action: z.action,
              hasEagerState: z.hasEagerState,
              eagerState: z.eagerState,
              next: null
            }, x === null ? (m = x = L, o = i) : x = x.next = L, ie.lanes |= A, Ol |= A;
          L = z.action, ia && l(i, L), i = z.hasEagerState ? z.eagerState : l(i, L);
        } else
          A = {
            lane: L,
            revertLane: z.revertLane,
            gesture: z.gesture,
            action: z.action,
            hasEagerState: z.hasEagerState,
            eagerState: z.eagerState,
            next: null
          }, x === null ? (m = x = A, o = i) : x = x.next = A, ie.lanes |= L, Ol |= L;
        z = z.next;
      } while (z !== null && z !== t);
      if (x === null ? o = i : x.next = m, !_t(i, e.memoizedState) && (Ve = !0, w && (l = Ma, l !== null)))
        throw l;
      e.memoizedState = i, e.baseState = o, e.baseQueue = x, a.lastRenderedState = i;
    }
    return n === null && (a.lanes = 0), [e.memoizedState, a.dispatch];
  }
  function Kc(e) {
    var t = Xe(), l = t.queue;
    if (l === null) throw Error(s(311));
    l.lastRenderedReducer = e;
    var a = l.dispatch, n = l.pending, i = t.memoizedState;
    if (n !== null) {
      l.pending = null;
      var o = n = n.next;
      do
        i = e(i, o.action), o = o.next;
      while (o !== n);
      _t(i, t.memoizedState) || (Ve = !0), t.memoizedState = i, t.baseQueue === null && (t.baseState = i), l.lastRenderedState = i;
    }
    return [i, a];
  }
  function Io(e, t, l) {
    var a = ie, n = Xe(), i = ve;
    if (i) {
      if (l === void 0) throw Error(s(407));
      l = l();
    } else l = t();
    var o = !_t(
      (Ne || n).memoizedState,
      l
    );
    if (o && (n.memoizedState = l, Ve = !0), n = n.queue, Fc(lf.bind(null, a, n, e), [
      e
    ]), n.getSnapshot !== t || o || Ze !== null && Ze.memoizedState.tag & 1) {
      if (a.flags |= 2048, La(
        9,
        { destroy: void 0 },
        tf.bind(
          null,
          a,
          n,
          l,
          t
        ),
        null
      ), ze === null) throw Error(s(349));
      i || (ul & 127) !== 0 || ef(a, t, l);
    }
    return l;
  }
  function ef(e, t, l) {
    e.flags |= 16384, e = { getSnapshot: t, value: l }, t = ie.updateQueue, t === null ? (t = Bi(), ie.updateQueue = t, t.stores = [e]) : (l = t.stores, l === null ? t.stores = [e] : l.push(e));
  }
  function tf(e, t, l, a) {
    t.value = l, t.getSnapshot = a, af(t) && nf(e);
  }
  function lf(e, t, l) {
    return l(function() {
      af(t) && nf(e);
    });
  }
  function af(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var l = t();
      return !_t(e, l);
    } catch {
      return !0;
    }
  }
  function nf(e) {
    var t = Fl(e, 2);
    t !== null && vt(t, e, 2);
  }
  function Jc(e) {
    var t = rt();
    if (typeof e == "function") {
      var l = e;
      if (e = l(), ia) {
        yl(!0);
        try {
          l();
        } finally {
          yl(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = e, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: cl,
      lastRenderedState: e
    }, t;
  }
  function uf(e, t, l, a) {
    return e.baseState = l, Vc(
      e,
      Ne,
      typeof a == "function" ? a : cl
    );
  }
  function Vp(e, t, l, a, n) {
    if (Xi(e)) throw Error(s(485));
    if (e = t.action, e !== null) {
      var i = {
        payload: n,
        action: e,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(o) {
          i.listeners.push(o);
        }
      };
      M.T !== null ? l(!0) : i.isTransition = !1, a(i), l = t.pending, l === null ? (i.next = t.pending = i, cf(t, i)) : (i.next = l.next, t.pending = l.next = i);
    }
  }
  function cf(e, t) {
    var l = t.action, a = t.payload, n = e.state;
    if (t.isTransition) {
      var i = M.T, o = {};
      M.T = o;
      try {
        var m = l(n, a), x = M.S;
        x !== null && x(o, m), sf(e, t, m);
      } catch (z) {
        $c(e, t, z);
      } finally {
        i !== null && o.types !== null && (i.types = o.types), M.T = i;
      }
    } else
      try {
        i = l(n, a), sf(e, t, i);
      } catch (z) {
        $c(e, t, z);
      }
  }
  function sf(e, t, l) {
    l !== null && typeof l == "object" && typeof l.then == "function" ? l.then(
      function(a) {
        rf(e, t, a);
      },
      function(a) {
        return $c(e, t, a);
      }
    ) : rf(e, t, l);
  }
  function rf(e, t, l) {
    t.status = "fulfilled", t.value = l, of(t), e.state = l, t = e.pending, t !== null && (l = t.next, l === t ? e.pending = null : (l = l.next, t.next = l, cf(e, l)));
  }
  function $c(e, t, l) {
    var a = e.pending;
    if (e.pending = null, a !== null) {
      a = a.next;
      do
        t.status = "rejected", t.reason = l, of(t), t = t.next;
      while (t !== a);
    }
    e.action = null;
  }
  function of(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function ff(e, t) {
    return t;
  }
  function df(e, t) {
    if (ve) {
      var l = ze.formState;
      if (l !== null) {
        e: {
          var a = ie;
          if (ve) {
            if (Me) {
              t: {
                for (var n = Me, i = Ht; n.nodeType !== 8; ) {
                  if (!i) {
                    n = null;
                    break t;
                  }
                  if (n = Bt(
                    n.nextSibling
                  ), n === null) {
                    n = null;
                    break t;
                  }
                }
                i = n.data, n = i === "F!" || i === "F" ? n : null;
              }
              if (n) {
                Me = Bt(
                  n.nextSibling
                ), a = n.data === "F!";
                break e;
              }
            }
            jl(a);
          }
          a = !1;
        }
        a && (t = l[0]);
      }
    }
    return l = rt(), l.memoizedState = l.baseState = t, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: ff,
      lastRenderedState: t
    }, l.queue = a, l = Mf.bind(
      null,
      ie,
      a
    ), a.dispatch = l, a = Jc(!1), i = ts.bind(
      null,
      ie,
      !1,
      a.queue
    ), a = rt(), n = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, a.queue = n, l = Vp.bind(
      null,
      ie,
      n,
      i,
      l
    ), n.dispatch = l, a.memoizedState = e, [t, l, !1];
  }
  function mf(e) {
    var t = Xe();
    return hf(t, Ne, e);
  }
  function hf(e, t, l) {
    if (t = Vc(
      e,
      t,
      ff
    )[0], e = Yi(cl)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var a = Rn(t);
      } catch (o) {
        throw o === Oa ? Ci : o;
      }
    else a = t;
    t = Xe();
    var n = t.queue, i = n.dispatch;
    return l !== t.memoizedState && (ie.flags |= 2048, La(
      9,
      { destroy: void 0 },
      Kp.bind(null, n, l),
      null
    )), [a, i, e];
  }
  function Kp(e, t) {
    e.action = t;
  }
  function pf(e) {
    var t = Xe(), l = Ne;
    if (l !== null)
      return hf(t, l, e);
    Xe(), t = t.memoizedState, l = Xe();
    var a = l.queue.dispatch;
    return l.memoizedState = e, [t, a, !1];
  }
  function La(e, t, l, a) {
    return e = { tag: e, create: l, deps: a, inst: t, next: null }, t = ie.updateQueue, t === null && (t = Bi(), ie.updateQueue = t), l = t.lastEffect, l === null ? t.lastEffect = e.next = e : (a = l.next, l.next = e, e.next = a, t.lastEffect = e), e;
  }
  function vf() {
    return Xe().memoizedState;
  }
  function ki(e, t, l, a) {
    var n = rt();
    ie.flags |= e, n.memoizedState = La(
      1 | t,
      { destroy: void 0 },
      l,
      a === void 0 ? null : a
    );
  }
  function Gi(e, t, l, a) {
    var n = Xe();
    a = a === void 0 ? null : a;
    var i = n.memoizedState.inst;
    Ne !== null && a !== null && Yc(a, Ne.memoizedState.deps) ? n.memoizedState = La(t, i, l, a) : (ie.flags |= e, n.memoizedState = La(
      1 | t,
      i,
      l,
      a
    ));
  }
  function gf(e, t) {
    ki(8390656, 8, e, t);
  }
  function Fc(e, t) {
    Gi(2048, 8, e, t);
  }
  function Jp(e) {
    ie.flags |= 4;
    var t = ie.updateQueue;
    if (t === null)
      t = Bi(), ie.updateQueue = t, t.events = [e];
    else {
      var l = t.events;
      l === null ? t.events = [e] : l.push(e);
    }
  }
  function yf(e) {
    var t = Xe().memoizedState;
    return Jp({ ref: t, nextImpl: e }), function() {
      if ((_e & 2) !== 0) throw Error(s(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function bf(e, t) {
    return Gi(4, 2, e, t);
  }
  function xf(e, t) {
    return Gi(4, 4, e, t);
  }
  function _f(e, t) {
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
  function Sf(e, t, l) {
    l = l != null ? l.concat([e]) : null, Gi(4, 4, _f.bind(null, t, e), l);
  }
  function Wc() {
  }
  function jf(e, t) {
    var l = Xe();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    return t !== null && Yc(t, a[1]) ? a[0] : (l.memoizedState = [e, t], e);
  }
  function Ef(e, t) {
    var l = Xe();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    if (t !== null && Yc(t, a[1]))
      return a[0];
    if (a = e(), ia) {
      yl(!0);
      try {
        e();
      } finally {
        yl(!1);
      }
    }
    return l.memoizedState = [a, t], a;
  }
  function Pc(e, t, l) {
    return l === void 0 || (ul & 1073741824) !== 0 && (me & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = l, e = Nd(), ie.lanes |= e, Ol |= e, l);
  }
  function Nf(e, t, l, a) {
    return _t(l, t) ? l : Da.current !== null ? (e = Pc(e, l, a), _t(e, t) || (Ve = !0), e) : (ul & 42) === 0 || (ul & 1073741824) !== 0 && (me & 261930) === 0 ? (Ve = !0, e.memoizedState = l) : (e = Nd(), ie.lanes |= e, Ol |= e, t);
  }
  function Tf(e, t, l, a, n) {
    var i = q.p;
    q.p = i !== 0 && 8 > i ? i : 8;
    var o = M.T, m = {};
    M.T = m, ts(e, !1, t, l);
    try {
      var x = n(), z = M.S;
      if (z !== null && z(m, x), x !== null && typeof x == "object" && typeof x.then == "function") {
        var w = Xp(
          x,
          a
        );
        zn(
          e,
          t,
          w,
          Rt(e)
        );
      } else
        zn(
          e,
          t,
          a,
          Rt(e)
        );
    } catch (L) {
      zn(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: L },
        Rt()
      );
    } finally {
      q.p = i, o !== null && m.types !== null && (o.types = m.types), M.T = o;
    }
  }
  function $p() {
  }
  function Ic(e, t, l, a) {
    if (e.tag !== 5) throw Error(s(476));
    var n = Rf(e).queue;
    Tf(
      e,
      n,
      t,
      Z,
      l === null ? $p : function() {
        return zf(e), l(a);
      }
    );
  }
  function Rf(e) {
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
        lastRenderedReducer: cl,
        lastRenderedState: Z
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
        lastRenderedReducer: cl,
        lastRenderedState: l
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function zf(e) {
    var t = Rf(e);
    t.next === null && (t = e.alternate.memoizedState), zn(
      e,
      t.next.queue,
      {},
      Rt()
    );
  }
  function es() {
    return tt(Zn);
  }
  function Af() {
    return Xe().memoizedState;
  }
  function Cf() {
    return Xe().memoizedState;
  }
  function Fp(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var l = Rt();
          e = Tl(l);
          var a = Rl(t, e, l);
          a !== null && (vt(a, t, l), jn(a, t, l)), t = { cache: Ac() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function Wp(e, t, l) {
    var a = Rt();
    l = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Xi(e) ? Of(t, l) : (l = yc(e, t, l, a), l !== null && (vt(l, e, a), wf(l, t, a)));
  }
  function Mf(e, t, l) {
    var a = Rt();
    zn(e, t, l, a);
  }
  function zn(e, t, l, a) {
    var n = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (Xi(e)) Of(t, n);
    else {
      var i = e.alternate;
      if (e.lanes === 0 && (i === null || i.lanes === 0) && (i = t.lastRenderedReducer, i !== null))
        try {
          var o = t.lastRenderedState, m = i(o, l);
          if (n.hasEagerState = !0, n.eagerState = m, _t(m, o))
            return ji(e, t, n, 0), ze === null && Si(), !1;
        } catch {
        } finally {
        }
      if (l = yc(e, t, n, a), l !== null)
        return vt(l, e, a), wf(l, t, a), !0;
    }
    return !1;
  }
  function ts(e, t, l, a) {
    if (a = {
      lane: 2,
      revertLane: ws(),
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, Xi(e)) {
      if (t) throw Error(s(479));
    } else
      t = yc(
        e,
        l,
        a,
        2
      ), t !== null && vt(t, e, 2);
  }
  function Xi(e) {
    var t = e.alternate;
    return e === ie || t !== null && t === ie;
  }
  function Of(e, t) {
    Ua = Hi = !0;
    var l = e.pending;
    l === null ? t.next = t : (t.next = l.next, l.next = t), e.pending = t;
  }
  function wf(e, t, l) {
    if ((l & 4194048) !== 0) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, Hr(e, l);
    }
  }
  var An = {
    readContext: tt,
    use: qi,
    useCallback: Be,
    useContext: Be,
    useEffect: Be,
    useImperativeHandle: Be,
    useLayoutEffect: Be,
    useInsertionEffect: Be,
    useMemo: Be,
    useReducer: Be,
    useRef: Be,
    useState: Be,
    useDebugValue: Be,
    useDeferredValue: Be,
    useTransition: Be,
    useSyncExternalStore: Be,
    useId: Be,
    useHostTransitionStatus: Be,
    useFormState: Be,
    useActionState: Be,
    useOptimistic: Be,
    useMemoCache: Be,
    useCacheRefresh: Be
  };
  An.useEffectEvent = Be;
  var Df = {
    readContext: tt,
    use: qi,
    useCallback: function(e, t) {
      return rt().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: tt,
    useEffect: gf,
    useImperativeHandle: function(e, t, l) {
      l = l != null ? l.concat([e]) : null, ki(
        4194308,
        4,
        _f.bind(null, t, e),
        l
      );
    },
    useLayoutEffect: function(e, t) {
      return ki(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      ki(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var l = rt();
      t = t === void 0 ? null : t;
      var a = e();
      if (ia) {
        yl(!0);
        try {
          e();
        } finally {
          yl(!1);
        }
      }
      return l.memoizedState = [a, t], a;
    },
    useReducer: function(e, t, l) {
      var a = rt();
      if (l !== void 0) {
        var n = l(t);
        if (ia) {
          yl(!0);
          try {
            l(t);
          } finally {
            yl(!1);
          }
        }
      } else n = t;
      return a.memoizedState = a.baseState = n, e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: n
      }, a.queue = e, e = e.dispatch = Wp.bind(
        null,
        ie,
        e
      ), [a.memoizedState, e];
    },
    useRef: function(e) {
      var t = rt();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = Jc(e);
      var t = e.queue, l = Mf.bind(null, ie, t);
      return t.dispatch = l, [e.memoizedState, l];
    },
    useDebugValue: Wc,
    useDeferredValue: function(e, t) {
      var l = rt();
      return Pc(l, e, t);
    },
    useTransition: function() {
      var e = Jc(!1);
      return e = Tf.bind(
        null,
        ie,
        e.queue,
        !0,
        !1
      ), rt().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, l) {
      var a = ie, n = rt();
      if (ve) {
        if (l === void 0)
          throw Error(s(407));
        l = l();
      } else {
        if (l = t(), ze === null)
          throw Error(s(349));
        (me & 127) !== 0 || ef(a, t, l);
      }
      n.memoizedState = l;
      var i = { value: l, getSnapshot: t };
      return n.queue = i, gf(lf.bind(null, a, i, e), [
        e
      ]), a.flags |= 2048, La(
        9,
        { destroy: void 0 },
        tf.bind(
          null,
          a,
          i,
          l,
          t
        ),
        null
      ), l;
    },
    useId: function() {
      var e = rt(), t = ze.identifierPrefix;
      if (ve) {
        var l = $t, a = Jt;
        l = (a & ~(1 << 32 - xt(a) - 1)).toString(32) + l, t = "_" + t + "R_" + l, l = Li++, 0 < l && (t += "H" + l.toString(32)), t += "_";
      } else
        l = Qp++, t = "_" + t + "r_" + l.toString(32) + "_";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: es,
    useFormState: df,
    useActionState: df,
    useOptimistic: function(e) {
      var t = rt();
      t.memoizedState = t.baseState = e;
      var l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = l, t = ts.bind(
        null,
        ie,
        !0,
        l
      ), l.dispatch = t, [e, t];
    },
    useMemoCache: Zc,
    useCacheRefresh: function() {
      return rt().memoizedState = Fp.bind(
        null,
        ie
      );
    },
    useEffectEvent: function(e) {
      var t = rt(), l = { impl: e };
      return t.memoizedState = l, function() {
        if ((_e & 2) !== 0)
          throw Error(s(440));
        return l.impl.apply(void 0, arguments);
      };
    }
  }, ls = {
    readContext: tt,
    use: qi,
    useCallback: jf,
    useContext: tt,
    useEffect: Fc,
    useImperativeHandle: Sf,
    useInsertionEffect: bf,
    useLayoutEffect: xf,
    useMemo: Ef,
    useReducer: Yi,
    useRef: vf,
    useState: function() {
      return Yi(cl);
    },
    useDebugValue: Wc,
    useDeferredValue: function(e, t) {
      var l = Xe();
      return Nf(
        l,
        Ne.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = Yi(cl)[0], t = Xe().memoizedState;
      return [
        typeof e == "boolean" ? e : Rn(e),
        t
      ];
    },
    useSyncExternalStore: Io,
    useId: Af,
    useHostTransitionStatus: es,
    useFormState: mf,
    useActionState: mf,
    useOptimistic: function(e, t) {
      var l = Xe();
      return uf(l, Ne, e, t);
    },
    useMemoCache: Zc,
    useCacheRefresh: Cf
  };
  ls.useEffectEvent = yf;
  var Uf = {
    readContext: tt,
    use: qi,
    useCallback: jf,
    useContext: tt,
    useEffect: Fc,
    useImperativeHandle: Sf,
    useInsertionEffect: bf,
    useLayoutEffect: xf,
    useMemo: Ef,
    useReducer: Kc,
    useRef: vf,
    useState: function() {
      return Kc(cl);
    },
    useDebugValue: Wc,
    useDeferredValue: function(e, t) {
      var l = Xe();
      return Ne === null ? Pc(l, e, t) : Nf(
        l,
        Ne.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = Kc(cl)[0], t = Xe().memoizedState;
      return [
        typeof e == "boolean" ? e : Rn(e),
        t
      ];
    },
    useSyncExternalStore: Io,
    useId: Af,
    useHostTransitionStatus: es,
    useFormState: pf,
    useActionState: pf,
    useOptimistic: function(e, t) {
      var l = Xe();
      return Ne !== null ? uf(l, Ne, e, t) : (l.baseState = e, [e, l.queue.dispatch]);
    },
    useMemoCache: Zc,
    useCacheRefresh: Cf
  };
  Uf.useEffectEvent = yf;
  function as(e, t, l, a) {
    t = e.memoizedState, l = l(a, t), l = l == null ? t : _({}, t, l), e.memoizedState = l, e.lanes === 0 && (e.updateQueue.baseState = l);
  }
  var ns = {
    enqueueSetState: function(e, t, l) {
      e = e._reactInternals;
      var a = Rt(), n = Tl(a);
      n.payload = t, l != null && (n.callback = l), t = Rl(e, n, a), t !== null && (vt(t, e, a), jn(t, e, a));
    },
    enqueueReplaceState: function(e, t, l) {
      e = e._reactInternals;
      var a = Rt(), n = Tl(a);
      n.tag = 1, n.payload = t, l != null && (n.callback = l), t = Rl(e, n, a), t !== null && (vt(t, e, a), jn(t, e, a));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var l = Rt(), a = Tl(l);
      a.tag = 2, t != null && (a.callback = t), t = Rl(e, a, l), t !== null && (vt(t, e, l), jn(t, e, l));
    }
  };
  function Hf(e, t, l, a, n, i, o) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(a, i, o) : t.prototype && t.prototype.isPureReactComponent ? !pn(l, a) || !pn(n, i) : !0;
  }
  function Lf(e, t, l, a) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(l, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(l, a), t.state !== e && ns.enqueueReplaceState(t, t.state, null);
  }
  function ua(e, t) {
    var l = t;
    if ("ref" in t) {
      l = {};
      for (var a in t)
        a !== "ref" && (l[a] = t[a]);
    }
    if (e = e.defaultProps) {
      l === t && (l = _({}, l));
      for (var n in e)
        l[n] === void 0 && (l[n] = e[n]);
    }
    return l;
  }
  function Bf(e) {
    _i(e);
  }
  function qf(e) {
    console.error(e);
  }
  function Yf(e) {
    _i(e);
  }
  function Qi(e, t) {
    try {
      var l = e.onUncaughtError;
      l(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function kf(e, t, l) {
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
  function is(e, t, l) {
    return l = Tl(l), l.tag = 3, l.payload = { element: null }, l.callback = function() {
      Qi(e, t);
    }, l;
  }
  function Gf(e) {
    return e = Tl(e), e.tag = 3, e;
  }
  function Xf(e, t, l, a) {
    var n = l.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var i = a.value;
      e.payload = function() {
        return n(i);
      }, e.callback = function() {
        kf(t, l, a);
      };
    }
    var o = l.stateNode;
    o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
      kf(t, l, a), typeof n != "function" && (wl === null ? wl = /* @__PURE__ */ new Set([this]) : wl.add(this));
      var m = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: m !== null ? m : ""
      });
    });
  }
  function Pp(e, t, l, a, n) {
    if (l.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (t = l.alternate, t !== null && Aa(
        t,
        l,
        n,
        !0
      ), l = jt.current, l !== null) {
        switch (l.tag) {
          case 31:
          case 13:
            return Lt === null ? lu() : l.alternate === null && qe === 0 && (qe = 3), l.flags &= -257, l.flags |= 65536, l.lanes = n, a === Mi ? l.flags |= 16384 : (t = l.updateQueue, t === null ? l.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), Cs(e, a, n)), !1;
          case 22:
            return l.flags |= 65536, a === Mi ? l.flags |= 16384 : (t = l.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, l.updateQueue = t) : (l = t.retryQueue, l === null ? t.retryQueue = /* @__PURE__ */ new Set([a]) : l.add(a)), Cs(e, a, n)), !1;
        }
        throw Error(s(435, l.tag));
      }
      return Cs(e, a, n), lu(), !1;
    }
    if (ve)
      return t = jt.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = n, a !== Ec && (e = Error(s(422), { cause: a }), yn(wt(e, l)))) : (a !== Ec && (t = Error(s(423), {
        cause: a
      }), yn(
        wt(t, l)
      )), e = e.current.alternate, e.flags |= 65536, n &= -n, e.lanes |= n, a = wt(a, l), n = is(
        e.stateNode,
        a,
        n
      ), Uc(e, n), qe !== 4 && (qe = 2)), !1;
    var i = Error(s(520), { cause: a });
    if (i = wt(i, l), Ln === null ? Ln = [i] : Ln.push(i), qe !== 4 && (qe = 2), t === null) return !0;
    a = wt(a, l), l = t;
    do {
      switch (l.tag) {
        case 3:
          return l.flags |= 65536, e = n & -n, l.lanes |= e, e = is(l.stateNode, a, e), Uc(l, e), !1;
        case 1:
          if (t = l.type, i = l.stateNode, (l.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || i !== null && typeof i.componentDidCatch == "function" && (wl === null || !wl.has(i))))
            return l.flags |= 65536, n &= -n, l.lanes |= n, n = Gf(n), Xf(
              n,
              e,
              l,
              a
            ), Uc(l, n), !1;
      }
      l = l.return;
    } while (l !== null);
    return !1;
  }
  var us = Error(s(461)), Ve = !1;
  function lt(e, t, l, a) {
    t.child = e === null ? Vo(t, null, l, a) : na(
      t,
      e.child,
      l,
      a
    );
  }
  function Qf(e, t, l, a, n) {
    l = l.render;
    var i = t.ref;
    if ("ref" in a) {
      var o = {};
      for (var m in a)
        m !== "ref" && (o[m] = a[m]);
    } else o = a;
    return ea(t), a = kc(
      e,
      t,
      l,
      o,
      i,
      n
    ), m = Gc(), e !== null && !Ve ? (Xc(e, t, n), sl(e, t, n)) : (ve && m && Sc(t), t.flags |= 1, lt(e, t, a, n), t.child);
  }
  function Zf(e, t, l, a, n) {
    if (e === null) {
      var i = l.type;
      return typeof i == "function" && !bc(i) && i.defaultProps === void 0 && l.compare === null ? (t.tag = 15, t.type = i, Vf(
        e,
        t,
        i,
        a,
        n
      )) : (e = Ni(
        l.type,
        null,
        a,
        t,
        t.mode,
        n
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (i = e.child, !hs(e, n)) {
      var o = i.memoizedProps;
      if (l = l.compare, l = l !== null ? l : pn, l(o, a) && e.ref === t.ref)
        return sl(e, t, n);
    }
    return t.flags |= 1, e = ll(i, a), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Vf(e, t, l, a, n) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (pn(i, a) && e.ref === t.ref)
        if (Ve = !1, t.pendingProps = a = i, hs(e, n))
          (e.flags & 131072) !== 0 && (Ve = !0);
        else
          return t.lanes = e.lanes, sl(e, t, n);
    }
    return cs(
      e,
      t,
      l,
      a,
      n
    );
  }
  function Kf(e, t, l, a) {
    var n = a.children, i = e !== null ? e.memoizedState : null;
    if (e === null && t.stateNode === null && (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), a.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (i = i !== null ? i.baseLanes | l : l, e !== null) {
          for (a = t.child = e.child, n = 0; a !== null; )
            n = n | a.lanes | a.childLanes, a = a.sibling;
          a = n & ~i;
        } else a = 0, t.child = null;
        return Jf(
          e,
          t,
          i,
          l,
          a
        );
      }
      if ((l & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && Ai(
          t,
          i !== null ? i.cachePool : null
        ), i !== null ? $o(t, i) : Lc(), Fo(t);
      else
        return a = t.lanes = 536870912, Jf(
          e,
          t,
          i !== null ? i.baseLanes | l : l,
          l,
          a
        );
    } else
      i !== null ? (Ai(t, i.cachePool), $o(t, i), Al(), t.memoizedState = null) : (e !== null && Ai(t, null), Lc(), Al());
    return lt(e, t, n, l), t.child;
  }
  function Cn(e, t) {
    return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function Jf(e, t, l, a, n) {
    var i = Mc();
    return i = i === null ? null : { parent: Qe._currentValue, pool: i }, t.memoizedState = {
      baseLanes: l,
      cachePool: i
    }, e !== null && Ai(t, null), Lc(), Fo(t), e !== null && Aa(e, t, a, !0), t.childLanes = n, null;
  }
  function Zi(e, t) {
    return t = Ki(
      { mode: t.mode, children: t.children },
      e.mode
    ), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function $f(e, t, l) {
    return na(t, e.child, null, l), e = Zi(t, t.pendingProps), e.flags |= 2, Et(t), t.memoizedState = null, e;
  }
  function Ip(e, t, l) {
    var a = t.pendingProps, n = (t.flags & 128) !== 0;
    if (t.flags &= -129, e === null) {
      if (ve) {
        if (a.mode === "hidden")
          return e = Zi(t, a), t.lanes = 536870912, Cn(null, e);
        if (qc(t), (e = Me) ? (e = cm(
          e,
          Ht
        ), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: _l !== null ? { id: Jt, overflow: $t } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, l = Mo(e), l.return = t, t.child = l, et = t, Me = null)) : e = null, e === null) throw jl(t);
        return t.lanes = 536870912, null;
      }
      return Zi(t, a);
    }
    var i = e.memoizedState;
    if (i !== null) {
      var o = i.dehydrated;
      if (qc(t), n)
        if (t.flags & 256)
          t.flags &= -257, t = $f(
            e,
            t,
            l
          );
        else if (t.memoizedState !== null)
          t.child = e.child, t.flags |= 128, t = null;
        else throw Error(s(558));
      else if (Ve || Aa(e, t, l, !1), n = (l & e.childLanes) !== 0, Ve || n) {
        if (a = ze, a !== null && (o = Lr(a, l), o !== 0 && o !== i.retryLane))
          throw i.retryLane = o, Fl(e, o), vt(a, e, o), us;
        lu(), t = $f(
          e,
          t,
          l
        );
      } else
        e = i.treeContext, Me = Bt(o.nextSibling), et = t, ve = !0, Sl = null, Ht = !1, e !== null && Do(t, e), t = Zi(t, a), t.flags |= 4096;
      return t;
    }
    return e = ll(e.child, {
      mode: a.mode,
      children: a.children
    }), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function Vi(e, t) {
    var l = t.ref;
    if (l === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof l != "function" && typeof l != "object")
        throw Error(s(284));
      (e === null || e.ref !== l) && (t.flags |= 4194816);
    }
  }
  function cs(e, t, l, a, n) {
    return ea(t), l = kc(
      e,
      t,
      l,
      a,
      void 0,
      n
    ), a = Gc(), e !== null && !Ve ? (Xc(e, t, n), sl(e, t, n)) : (ve && a && Sc(t), t.flags |= 1, lt(e, t, l, n), t.child);
  }
  function Ff(e, t, l, a, n, i) {
    return ea(t), t.updateQueue = null, l = Po(
      t,
      a,
      l,
      n
    ), Wo(e), a = Gc(), e !== null && !Ve ? (Xc(e, t, i), sl(e, t, i)) : (ve && a && Sc(t), t.flags |= 1, lt(e, t, l, i), t.child);
  }
  function Wf(e, t, l, a, n) {
    if (ea(t), t.stateNode === null) {
      var i = Na, o = l.contextType;
      typeof o == "object" && o !== null && (i = tt(o)), i = new l(a, i), t.memoizedState = i.state !== null && i.state !== void 0 ? i.state : null, i.updater = ns, t.stateNode = i, i._reactInternals = t, i = t.stateNode, i.props = a, i.state = t.memoizedState, i.refs = {}, wc(t), o = l.contextType, i.context = typeof o == "object" && o !== null ? tt(o) : Na, i.state = t.memoizedState, o = l.getDerivedStateFromProps, typeof o == "function" && (as(
        t,
        l,
        o,
        a
      ), i.state = t.memoizedState), typeof l.getDerivedStateFromProps == "function" || typeof i.getSnapshotBeforeUpdate == "function" || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (o = i.state, typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount(), o !== i.state && ns.enqueueReplaceState(i, i.state, null), Nn(t, a, i, n), En(), i.state = t.memoizedState), typeof i.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (e === null) {
      i = t.stateNode;
      var m = t.memoizedProps, x = ua(l, m);
      i.props = x;
      var z = i.context, w = l.contextType;
      o = Na, typeof w == "object" && w !== null && (o = tt(w));
      var L = l.getDerivedStateFromProps;
      w = typeof L == "function" || typeof i.getSnapshotBeforeUpdate == "function", m = t.pendingProps !== m, w || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (m || z !== o) && Lf(
        t,
        i,
        a,
        o
      ), Nl = !1;
      var A = t.memoizedState;
      i.state = A, Nn(t, a, i, n), En(), z = t.memoizedState, m || A !== z || Nl ? (typeof L == "function" && (as(
        t,
        l,
        L,
        a
      ), z = t.memoizedState), (x = Nl || Hf(
        t,
        l,
        x,
        a,
        A,
        z,
        o
      )) ? (w || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = z), i.props = a, i.state = z, i.context = o, a = x) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      i = t.stateNode, Dc(e, t), o = t.memoizedProps, w = ua(l, o), i.props = w, L = t.pendingProps, A = i.context, z = l.contextType, x = Na, typeof z == "object" && z !== null && (x = tt(z)), m = l.getDerivedStateFromProps, (z = typeof m == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (o !== L || A !== x) && Lf(
        t,
        i,
        a,
        x
      ), Nl = !1, A = t.memoizedState, i.state = A, Nn(t, a, i, n), En();
      var O = t.memoizedState;
      o !== L || A !== O || Nl || e !== null && e.dependencies !== null && Ri(e.dependencies) ? (typeof m == "function" && (as(
        t,
        l,
        m,
        a
      ), O = t.memoizedState), (w = Nl || Hf(
        t,
        l,
        w,
        a,
        A,
        O,
        x
      ) || e !== null && e.dependencies !== null && Ri(e.dependencies)) ? (z || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(a, O, x), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(
        a,
        O,
        x
      )), typeof i.componentDidUpdate == "function" && (t.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof i.componentDidUpdate != "function" || o === e.memoizedProps && A === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && A === e.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = O), i.props = a, i.state = O, i.context = x, a = w) : (typeof i.componentDidUpdate != "function" || o === e.memoizedProps && A === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && A === e.memoizedState || (t.flags |= 1024), a = !1);
    }
    return i = a, Vi(e, t), a = (t.flags & 128) !== 0, i || a ? (i = t.stateNode, l = a && typeof l.getDerivedStateFromError != "function" ? null : i.render(), t.flags |= 1, e !== null && a ? (t.child = na(
      t,
      e.child,
      null,
      n
    ), t.child = na(
      t,
      null,
      l,
      n
    )) : lt(e, t, l, n), t.memoizedState = i.state, e = t.child) : e = sl(
      e,
      t,
      n
    ), e;
  }
  function Pf(e, t, l, a) {
    return Pl(), t.flags |= 256, lt(e, t, l, a), t.child;
  }
  var ss = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function rs(e) {
    return { baseLanes: e, cachePool: Yo() };
  }
  function os(e, t, l) {
    return e = e !== null ? e.childLanes & ~l : 0, t && (e |= Tt), e;
  }
  function If(e, t, l) {
    var a = t.pendingProps, n = !1, i = (t.flags & 128) !== 0, o;
    if ((o = i) || (o = e !== null && e.memoizedState === null ? !1 : (Ge.current & 2) !== 0), o && (n = !0, t.flags &= -129), o = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (ve) {
        if (n ? zl(t) : Al(), (e = Me) ? (e = cm(
          e,
          Ht
        ), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: _l !== null ? { id: Jt, overflow: $t } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, l = Mo(e), l.return = t, t.child = l, et = t, Me = null)) : e = null, e === null) throw jl(t);
        return Vs(e) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      var m = a.children;
      return a = a.fallback, n ? (Al(), n = t.mode, m = Ki(
        { mode: "hidden", children: m },
        n
      ), a = Wl(
        a,
        n,
        l,
        null
      ), m.return = t, a.return = t, m.sibling = a, t.child = m, a = t.child, a.memoizedState = rs(l), a.childLanes = os(
        e,
        o,
        l
      ), t.memoizedState = ss, Cn(null, a)) : (zl(t), fs(t, m));
    }
    var x = e.memoizedState;
    if (x !== null && (m = x.dehydrated, m !== null)) {
      if (i)
        t.flags & 256 ? (zl(t), t.flags &= -257, t = ds(
          e,
          t,
          l
        )) : t.memoizedState !== null ? (Al(), t.child = e.child, t.flags |= 128, t = null) : (Al(), m = a.fallback, n = t.mode, a = Ki(
          { mode: "visible", children: a.children },
          n
        ), m = Wl(
          m,
          n,
          l,
          null
        ), m.flags |= 2, a.return = t, m.return = t, a.sibling = m, t.child = a, na(
          t,
          e.child,
          null,
          l
        ), a = t.child, a.memoizedState = rs(l), a.childLanes = os(
          e,
          o,
          l
        ), t.memoizedState = ss, t = Cn(null, a));
      else if (zl(t), Vs(m)) {
        if (o = m.nextSibling && m.nextSibling.dataset, o) var z = o.dgst;
        o = z, a = Error(s(419)), a.stack = "", a.digest = o, yn({ value: a, source: null, stack: null }), t = ds(
          e,
          t,
          l
        );
      } else if (Ve || Aa(e, t, l, !1), o = (l & e.childLanes) !== 0, Ve || o) {
        if (o = ze, o !== null && (a = Lr(o, l), a !== 0 && a !== x.retryLane))
          throw x.retryLane = a, Fl(e, a), vt(o, e, a), us;
        Zs(m) || lu(), t = ds(
          e,
          t,
          l
        );
      } else
        Zs(m) ? (t.flags |= 192, t.child = e.child, t = null) : (e = x.treeContext, Me = Bt(
          m.nextSibling
        ), et = t, ve = !0, Sl = null, Ht = !1, e !== null && Do(t, e), t = fs(
          t,
          a.children
        ), t.flags |= 4096);
      return t;
    }
    return n ? (Al(), m = a.fallback, n = t.mode, x = e.child, z = x.sibling, a = ll(x, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = x.subtreeFlags & 65011712, z !== null ? m = ll(
      z,
      m
    ) : (m = Wl(
      m,
      n,
      l,
      null
    ), m.flags |= 2), m.return = t, a.return = t, a.sibling = m, t.child = a, Cn(null, a), a = t.child, m = e.child.memoizedState, m === null ? m = rs(l) : (n = m.cachePool, n !== null ? (x = Qe._currentValue, n = n.parent !== x ? { parent: x, pool: x } : n) : n = Yo(), m = {
      baseLanes: m.baseLanes | l,
      cachePool: n
    }), a.memoizedState = m, a.childLanes = os(
      e,
      o,
      l
    ), t.memoizedState = ss, Cn(e.child, a)) : (zl(t), l = e.child, e = l.sibling, l = ll(l, {
      mode: "visible",
      children: a.children
    }), l.return = t, l.sibling = null, e !== null && (o = t.deletions, o === null ? (t.deletions = [e], t.flags |= 16) : o.push(e)), t.child = l, t.memoizedState = null, l);
  }
  function fs(e, t) {
    return t = Ki(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function Ki(e, t) {
    return e = St(22, e, null, t), e.lanes = 0, e;
  }
  function ds(e, t, l) {
    return na(t, e.child, null, l), e = fs(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function ed(e, t, l) {
    e.lanes |= t;
    var a = e.alternate;
    a !== null && (a.lanes |= t), Rc(e.return, t, l);
  }
  function ms(e, t, l, a, n, i) {
    var o = e.memoizedState;
    o === null ? e.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: a,
      tail: l,
      tailMode: n,
      treeForkCount: i
    } : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = a, o.tail = l, o.tailMode = n, o.treeForkCount = i);
  }
  function td(e, t, l) {
    var a = t.pendingProps, n = a.revealOrder, i = a.tail;
    a = a.children;
    var o = Ge.current, m = (o & 2) !== 0;
    if (m ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, Q(Ge, o), lt(e, t, a, l), a = ve ? gn : 0, !m && e !== null && (e.flags & 128) !== 0)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13)
          e.memoizedState !== null && ed(e, l, t);
        else if (e.tag === 19)
          ed(e, l, t);
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
          e = l.alternate, e !== null && Ui(e) === null && (n = l), l = l.sibling;
        l = n, l === null ? (n = t.child, t.child = null) : (n = l.sibling, l.sibling = null), ms(
          t,
          !1,
          n,
          l,
          i,
          a
        );
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (l = null, n = t.child, t.child = null; n !== null; ) {
          if (e = n.alternate, e !== null && Ui(e) === null) {
            t.child = n;
            break;
          }
          e = n.sibling, n.sibling = l, l = n, n = e;
        }
        ms(
          t,
          !0,
          l,
          null,
          i,
          a
        );
        break;
      case "together":
        ms(
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
  function sl(e, t, l) {
    if (e !== null && (t.dependencies = e.dependencies), Ol |= t.lanes, (l & t.childLanes) === 0)
      if (e !== null) {
        if (Aa(
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
      for (e = t.child, l = ll(e, e.pendingProps), t.child = l, l.return = t; e.sibling !== null; )
        e = e.sibling, l = l.sibling = ll(e, e.pendingProps), l.return = t;
      l.sibling = null;
    }
    return t.child;
  }
  function hs(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && Ri(e)));
  }
  function ev(e, t, l) {
    switch (t.tag) {
      case 3:
        st(t, t.stateNode.containerInfo), El(t, Qe, e.memoizedState.cache), Pl();
        break;
      case 27:
      case 5:
        tn(t);
        break;
      case 4:
        st(t, t.stateNode.containerInfo);
        break;
      case 10:
        El(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 31:
        if (t.memoizedState !== null)
          return t.flags |= 128, qc(t), null;
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null)
          return a.dehydrated !== null ? (zl(t), t.flags |= 128, null) : (l & t.child.childLanes) !== 0 ? If(e, t, l) : (zl(t), e = sl(
            e,
            t,
            l
          ), e !== null ? e.sibling : null);
        zl(t);
        break;
      case 19:
        var n = (e.flags & 128) !== 0;
        if (a = (l & t.childLanes) !== 0, a || (Aa(
          e,
          t,
          l,
          !1
        ), a = (l & t.childLanes) !== 0), n) {
          if (a)
            return td(
              e,
              t,
              l
            );
          t.flags |= 128;
        }
        if (n = t.memoizedState, n !== null && (n.rendering = null, n.tail = null, n.lastEffect = null), Q(Ge, Ge.current), a) break;
        return null;
      case 22:
        return t.lanes = 0, Kf(
          e,
          t,
          l,
          t.pendingProps
        );
      case 24:
        El(t, Qe, e.memoizedState.cache);
    }
    return sl(e, t, l);
  }
  function ld(e, t, l) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        Ve = !0;
      else {
        if (!hs(e, l) && (t.flags & 128) === 0)
          return Ve = !1, ev(
            e,
            t,
            l
          );
        Ve = (e.flags & 131072) !== 0;
      }
    else
      Ve = !1, ve && (t.flags & 1048576) !== 0 && wo(t, gn, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          var a = t.pendingProps;
          if (e = la(t.elementType), t.type = e, typeof e == "function")
            bc(e) ? (a = ua(e, a), t.tag = 1, t = Wf(
              null,
              t,
              e,
              a,
              l
            )) : (t.tag = 0, t = cs(
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
                t.tag = 11, t = Qf(
                  null,
                  t,
                  e,
                  a,
                  l
                );
                break e;
              } else if (n === F) {
                t.tag = 14, t = Zf(
                  null,
                  t,
                  e,
                  a,
                  l
                );
                break e;
              }
            }
            throw t = I(e) || e, Error(s(306, t, ""));
          }
        }
        return t;
      case 0:
        return cs(
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
        ), Wf(
          e,
          t,
          a,
          n,
          l
        );
      case 3:
        e: {
          if (st(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(s(387));
          a = t.pendingProps;
          var i = t.memoizedState;
          n = i.element, Dc(e, t), Nn(t, a, null, l);
          var o = t.memoizedState;
          if (a = o.cache, El(t, Qe, a), a !== i.cache && zc(
            t,
            [Qe],
            l,
            !0
          ), En(), a = o.element, i.isDehydrated)
            if (i = {
              element: a,
              isDehydrated: !1,
              cache: o.cache
            }, t.updateQueue.baseState = i, t.memoizedState = i, t.flags & 256) {
              t = Pf(
                e,
                t,
                a,
                l
              );
              break e;
            } else if (a !== n) {
              n = wt(
                Error(s(424)),
                t
              ), yn(n), t = Pf(
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
              for (Me = Bt(e.firstChild), et = t, ve = !0, Sl = null, Ht = !0, l = Vo(
                t,
                null,
                a,
                l
              ), t.child = l; l; )
                l.flags = l.flags & -3 | 4096, l = l.sibling;
            }
          else {
            if (Pl(), a === n) {
              t = sl(
                e,
                t,
                l
              );
              break e;
            }
            lt(e, t, a, l);
          }
          t = t.child;
        }
        return t;
      case 26:
        return Vi(e, t), e === null ? (l = mm(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = l : ve || (l = t.type, e = t.pendingProps, a = ru(
          re.current
        ).createElement(l), a[Ie] = t, a[ot] = e, at(a, l, e), We(a), t.stateNode = a) : t.memoizedState = mm(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return tn(t), e === null && ve && (a = t.stateNode = om(
          t.type,
          t.pendingProps,
          re.current
        ), et = t, Ht = !0, n = Me, Ll(t.type) ? (Ks = n, Me = Bt(a.firstChild)) : Me = n), lt(
          e,
          t,
          t.pendingProps.children,
          l
        ), Vi(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && ve && ((n = a = Me) && (a = Cv(
          a,
          t.type,
          t.pendingProps,
          Ht
        ), a !== null ? (t.stateNode = a, et = t, Me = Bt(a.firstChild), Ht = !1, n = !0) : n = !1), n || jl(t)), tn(t), n = t.type, i = t.pendingProps, o = e !== null ? e.memoizedProps : null, a = i.children, Gs(n, i) ? a = null : o !== null && Gs(n, o) && (t.flags |= 32), t.memoizedState !== null && (n = kc(
          e,
          t,
          Zp,
          null,
          null,
          l
        ), Zn._currentValue = n), Vi(e, t), lt(e, t, a, l), t.child;
      case 6:
        return e === null && ve && ((e = l = Me) && (l = Mv(
          l,
          t.pendingProps,
          Ht
        ), l !== null ? (t.stateNode = l, et = t, Me = null, e = !0) : e = !1), e || jl(t)), null;
      case 13:
        return If(e, t, l);
      case 4:
        return st(
          t,
          t.stateNode.containerInfo
        ), a = t.pendingProps, e === null ? t.child = na(
          t,
          null,
          a,
          l
        ) : lt(e, t, a, l), t.child;
      case 11:
        return Qf(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 7:
        return lt(
          e,
          t,
          t.pendingProps,
          l
        ), t.child;
      case 8:
        return lt(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 12:
        return lt(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 10:
        return a = t.pendingProps, El(t, t.type, a.value), lt(e, t, a.children, l), t.child;
      case 9:
        return n = t.type._context, a = t.pendingProps.children, ea(t), n = tt(n), a = a(n), t.flags |= 1, lt(e, t, a, l), t.child;
      case 14:
        return Zf(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 15:
        return Vf(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 19:
        return td(e, t, l);
      case 31:
        return Ip(e, t, l);
      case 22:
        return Kf(
          e,
          t,
          l,
          t.pendingProps
        );
      case 24:
        return ea(t), a = tt(Qe), e === null ? (n = Mc(), n === null && (n = ze, i = Ac(), n.pooledCache = i, i.refCount++, i !== null && (n.pooledCacheLanes |= l), n = i), t.memoizedState = { parent: a, cache: n }, wc(t), El(t, Qe, n)) : ((e.lanes & l) !== 0 && (Dc(e, t), Nn(t, null, null, l), En()), n = e.memoizedState, i = t.memoizedState, n.parent !== a ? (n = { parent: a, cache: a }, t.memoizedState = n, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = n), El(t, Qe, a)) : (a = i.cache, El(t, Qe, a), a !== n.cache && zc(
          t,
          [Qe],
          l,
          !0
        ))), lt(
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
  function rl(e) {
    e.flags |= 4;
  }
  function ps(e, t, l, a, n) {
    if ((t = (e.mode & 32) !== 0) && (t = !1), t) {
      if (e.flags |= 16777216, (n & 335544128) === n)
        if (e.stateNode.complete) e.flags |= 8192;
        else if (Ad()) e.flags |= 8192;
        else
          throw aa = Mi, Oc;
    } else e.flags &= -16777217;
  }
  function ad(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !ym(t))
      if (Ad()) e.flags |= 8192;
      else
        throw aa = Mi, Oc;
  }
  function Ji(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? Dr() : 536870912, e.lanes |= t, ka |= t);
  }
  function Mn(e, t) {
    if (!ve)
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
  function Oe(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, l = 0, a = 0;
    if (t)
      for (var n = e.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags & 65011712, a |= n.flags & 65011712, n.return = e, n = n.sibling;
    else
      for (n = e.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags, a |= n.flags, n.return = e, n = n.sibling;
    return e.subtreeFlags |= a, e.childLanes = l, t;
  }
  function tv(e, t, l) {
    var a = t.pendingProps;
    switch (jc(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Oe(t), null;
      case 1:
        return Oe(t), null;
      case 3:
        return l = t.stateNode, a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), il(Qe), ke(), l.pendingContext && (l.context = l.pendingContext, l.pendingContext = null), (e === null || e.child === null) && (za(t) ? rl(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Nc())), Oe(t), null;
      case 26:
        var n = t.type, i = t.memoizedState;
        return e === null ? (rl(t), i !== null ? (Oe(t), ad(t, i)) : (Oe(t), ps(
          t,
          n,
          null,
          a,
          l
        ))) : i ? i !== e.memoizedState ? (rl(t), Oe(t), ad(t, i)) : (Oe(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== a && rl(t), Oe(t), ps(
          t,
          n,
          e,
          a,
          l
        )), null;
      case 27:
        if (ii(t), l = re.current, n = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && rl(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(s(166));
            return Oe(t), null;
          }
          e = J.current, za(t) ? Uo(t) : (e = om(n, a, l), t.stateNode = e, rl(t));
        }
        return Oe(t), null;
      case 5:
        if (ii(t), n = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && rl(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(s(166));
            return Oe(t), null;
          }
          if (i = J.current, za(t))
            Uo(t);
          else {
            var o = ru(
              re.current
            );
            switch (i) {
              case 1:
                i = o.createElementNS(
                  "http://www.w3.org/2000/svg",
                  n
                );
                break;
              case 2:
                i = o.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  n
                );
                break;
              default:
                switch (n) {
                  case "svg":
                    i = o.createElementNS(
                      "http://www.w3.org/2000/svg",
                      n
                    );
                    break;
                  case "math":
                    i = o.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      n
                    );
                    break;
                  case "script":
                    i = o.createElement("div"), i.innerHTML = "<script><\/script>", i = i.removeChild(
                      i.firstChild
                    );
                    break;
                  case "select":
                    i = typeof a.is == "string" ? o.createElement("select", {
                      is: a.is
                    }) : o.createElement("select"), a.multiple ? i.multiple = !0 : a.size && (i.size = a.size);
                    break;
                  default:
                    i = typeof a.is == "string" ? o.createElement(n, { is: a.is }) : o.createElement(n);
                }
            }
            i[Ie] = t, i[ot] = a;
            e: for (o = t.child; o !== null; ) {
              if (o.tag === 5 || o.tag === 6)
                i.appendChild(o.stateNode);
              else if (o.tag !== 4 && o.tag !== 27 && o.child !== null) {
                o.child.return = o, o = o.child;
                continue;
              }
              if (o === t) break e;
              for (; o.sibling === null; ) {
                if (o.return === null || o.return === t)
                  break e;
                o = o.return;
              }
              o.sibling.return = o.return, o = o.sibling;
            }
            t.stateNode = i;
            e: switch (at(i, n, a), n) {
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
            a && rl(t);
          }
        }
        return Oe(t), ps(
          t,
          t.type,
          e === null ? null : e.memoizedProps,
          t.pendingProps,
          l
        ), null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== a && rl(t);
        else {
          if (typeof a != "string" && t.stateNode === null)
            throw Error(s(166));
          if (e = re.current, za(t)) {
            if (e = t.stateNode, l = t.memoizedProps, a = null, n = et, n !== null)
              switch (n.tag) {
                case 27:
                case 5:
                  a = n.memoizedProps;
              }
            e[Ie] = t, e = !!(e.nodeValue === l || a !== null && a.suppressHydrationWarning === !0 || Id(e.nodeValue, l)), e || jl(t, !0);
          } else
            e = ru(e).createTextNode(
              a
            ), e[Ie] = t, t.stateNode = e;
        }
        return Oe(t), null;
      case 31:
        if (l = t.memoizedState, e === null || e.memoizedState !== null) {
          if (a = za(t), l !== null) {
            if (e === null) {
              if (!a) throw Error(s(318));
              if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(s(557));
              e[Ie] = t;
            } else
              Pl(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Oe(t), e = !1;
          } else
            l = Nc(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = l), e = !0;
          if (!e)
            return t.flags & 256 ? (Et(t), t) : (Et(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(s(558));
        }
        return Oe(t), null;
      case 13:
        if (a = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (n = za(t), a !== null && a.dehydrated !== null) {
            if (e === null) {
              if (!n) throw Error(s(318));
              if (n = t.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(s(317));
              n[Ie] = t;
            } else
              Pl(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Oe(t), n = !1;
          } else
            n = Nc(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), n = !0;
          if (!n)
            return t.flags & 256 ? (Et(t), t) : (Et(t), null);
        }
        return Et(t), (t.flags & 128) !== 0 ? (t.lanes = l, t) : (l = a !== null, e = e !== null && e.memoizedState !== null, l && (a = t.child, n = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (n = a.alternate.memoizedState.cachePool.pool), i = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (i = a.memoizedState.cachePool.pool), i !== n && (a.flags |= 2048)), l !== e && l && (t.child.flags |= 8192), Ji(t, t.updateQueue), Oe(t), null);
      case 4:
        return ke(), e === null && Ls(t.stateNode.containerInfo), Oe(t), null;
      case 10:
        return il(t.type), Oe(t), null;
      case 19:
        if (H(Ge), a = t.memoizedState, a === null) return Oe(t), null;
        if (n = (t.flags & 128) !== 0, i = a.rendering, i === null)
          if (n) Mn(a, !1);
          else {
            if (qe !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (i = Ui(e), i !== null) {
                  for (t.flags |= 128, Mn(a, !1), e = i.updateQueue, t.updateQueue = e, Ji(t, e), t.subtreeFlags = 0, e = l, l = t.child; l !== null; )
                    Co(l, e), l = l.sibling;
                  return Q(
                    Ge,
                    Ge.current & 1 | 2
                  ), ve && al(t, a.treeForkCount), t.child;
                }
                e = e.sibling;
              }
            a.tail !== null && yt() > Ii && (t.flags |= 128, n = !0, Mn(a, !1), t.lanes = 4194304);
          }
        else {
          if (!n)
            if (e = Ui(i), e !== null) {
              if (t.flags |= 128, n = !0, e = e.updateQueue, t.updateQueue = e, Ji(t, e), Mn(a, !0), a.tail === null && a.tailMode === "hidden" && !i.alternate && !ve)
                return Oe(t), null;
            } else
              2 * yt() - a.renderingStartTime > Ii && l !== 536870912 && (t.flags |= 128, n = !0, Mn(a, !1), t.lanes = 4194304);
          a.isBackwards ? (i.sibling = t.child, t.child = i) : (e = a.last, e !== null ? e.sibling = i : t.child = i, a.last = i);
        }
        return a.tail !== null ? (e = a.tail, a.rendering = e, a.tail = e.sibling, a.renderingStartTime = yt(), e.sibling = null, l = Ge.current, Q(
          Ge,
          n ? l & 1 | 2 : l & 1
        ), ve && al(t, a.treeForkCount), e) : (Oe(t), null);
      case 22:
      case 23:
        return Et(t), Bc(), a = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (l & 536870912) !== 0 && (t.flags & 128) === 0 && (Oe(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Oe(t), l = t.updateQueue, l !== null && Ji(t, l.retryQueue), l = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== l && (t.flags |= 2048), e !== null && H(ta), null;
      case 24:
        return l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), il(Qe), Oe(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(s(156, t.tag));
  }
  function lv(e, t) {
    switch (jc(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return il(Qe), ke(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return ii(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (Et(t), t.alternate === null)
            throw Error(s(340));
          Pl();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 13:
        if (Et(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(s(340));
          Pl();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return H(Ge), null;
      case 4:
        return ke(), null;
      case 10:
        return il(t.type), null;
      case 22:
      case 23:
        return Et(t), Bc(), e !== null && H(ta), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return il(Qe), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function nd(e, t) {
    switch (jc(t), t.tag) {
      case 3:
        il(Qe), ke();
        break;
      case 26:
      case 27:
      case 5:
        ii(t);
        break;
      case 4:
        ke();
        break;
      case 31:
        t.memoizedState !== null && Et(t);
        break;
      case 13:
        Et(t);
        break;
      case 19:
        H(Ge);
        break;
      case 10:
        il(t.type);
        break;
      case 22:
      case 23:
        Et(t), Bc(), e !== null && H(ta);
        break;
      case 24:
        il(Qe);
    }
  }
  function On(e, t) {
    try {
      var l = t.updateQueue, a = l !== null ? l.lastEffect : null;
      if (a !== null) {
        var n = a.next;
        l = n;
        do {
          if ((l.tag & e) === e) {
            a = void 0;
            var i = l.create, o = l.inst;
            a = i(), o.destroy = a;
          }
          l = l.next;
        } while (l !== n);
      }
    } catch (m) {
      Ee(t, t.return, m);
    }
  }
  function Cl(e, t, l) {
    try {
      var a = t.updateQueue, n = a !== null ? a.lastEffect : null;
      if (n !== null) {
        var i = n.next;
        a = i;
        do {
          if ((a.tag & e) === e) {
            var o = a.inst, m = o.destroy;
            if (m !== void 0) {
              o.destroy = void 0, n = t;
              var x = l, z = m;
              try {
                z();
              } catch (w) {
                Ee(
                  n,
                  x,
                  w
                );
              }
            }
          }
          a = a.next;
        } while (a !== i);
      }
    } catch (w) {
      Ee(t, t.return, w);
    }
  }
  function id(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var l = e.stateNode;
      try {
        Jo(t, l);
      } catch (a) {
        Ee(e, e.return, a);
      }
    }
  }
  function ud(e, t, l) {
    l.props = ua(
      e.type,
      e.memoizedProps
    ), l.state = e.memoizedState;
    try {
      l.componentWillUnmount();
    } catch (a) {
      Ee(e, t, a);
    }
  }
  function wn(e, t) {
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
      Ee(e, t, n);
    }
  }
  function Ft(e, t) {
    var l = e.ref, a = e.refCleanup;
    if (l !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (n) {
          Ee(e, t, n);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof l == "function")
        try {
          l(null);
        } catch (n) {
          Ee(e, t, n);
        }
      else l.current = null;
  }
  function cd(e) {
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
      Ee(e, e.return, n);
    }
  }
  function vs(e, t, l) {
    try {
      var a = e.stateNode;
      Ev(a, e.type, l, t), a[ot] = t;
    } catch (n) {
      Ee(e, e.return, n);
    }
  }
  function sd(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Ll(e.type) || e.tag === 4;
  }
  function gs(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || sd(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && Ll(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function ys(e, t, l) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? (l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l).insertBefore(e, t) : (t = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, t.appendChild(e), l = l._reactRootContainer, l != null || t.onclick !== null || (t.onclick = el));
    else if (a !== 4 && (a === 27 && Ll(e.type) && (l = e.stateNode, t = null), e = e.child, e !== null))
      for (ys(e, t, l), e = e.sibling; e !== null; )
        ys(e, t, l), e = e.sibling;
  }
  function $i(e, t, l) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? l.insertBefore(e, t) : l.appendChild(e);
    else if (a !== 4 && (a === 27 && Ll(e.type) && (l = e.stateNode), e = e.child, e !== null))
      for ($i(e, t, l), e = e.sibling; e !== null; )
        $i(e, t, l), e = e.sibling;
  }
  function rd(e) {
    var t = e.stateNode, l = e.memoizedProps;
    try {
      for (var a = e.type, n = t.attributes; n.length; )
        t.removeAttributeNode(n[0]);
      at(t, a, l), t[Ie] = e, t[ot] = l;
    } catch (i) {
      Ee(e, e.return, i);
    }
  }
  var ol = !1, Ke = !1, bs = !1, od = typeof WeakSet == "function" ? WeakSet : Set, Pe = null;
  function av(e, t) {
    if (e = e.containerInfo, Ys = vu, e = _o(e), dc(e)) {
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
            var n = a.anchorOffset, i = a.focusNode;
            a = a.focusOffset;
            try {
              l.nodeType, i.nodeType;
            } catch {
              l = null;
              break e;
            }
            var o = 0, m = -1, x = -1, z = 0, w = 0, L = e, A = null;
            t: for (; ; ) {
              for (var O; L !== l || n !== 0 && L.nodeType !== 3 || (m = o + n), L !== i || a !== 0 && L.nodeType !== 3 || (x = o + a), L.nodeType === 3 && (o += L.nodeValue.length), (O = L.firstChild) !== null; )
                A = L, L = O;
              for (; ; ) {
                if (L === e) break t;
                if (A === l && ++z === n && (m = o), A === i && ++w === a && (x = o), (O = L.nextSibling) !== null) break;
                L = A, A = L.parentNode;
              }
              L = O;
            }
            l = m === -1 || x === -1 ? null : { start: m, end: x };
          } else l = null;
        }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (ks = { focusedElem: e, selectionRange: l }, vu = !1, Pe = t; Pe !== null; )
      if (t = Pe, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null)
        e.return = t, Pe = e;
      else
        for (; Pe !== null; ) {
          switch (t = Pe, i = t.alternate, e = t.flags, t.tag) {
            case 0:
              if ((e & 4) !== 0 && (e = t.updateQueue, e = e !== null ? e.events : null, e !== null))
                for (l = 0; l < e.length; l++)
                  n = e[l], n.ref.impl = n.nextImpl;
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && i !== null) {
                e = void 0, l = t, n = i.memoizedProps, i = i.memoizedState, a = l.stateNode;
                try {
                  var K = ua(
                    l.type,
                    n
                  );
                  e = a.getSnapshotBeforeUpdate(
                    K,
                    i
                  ), a.__reactInternalSnapshotBeforeUpdate = e;
                } catch (te) {
                  Ee(
                    l,
                    l.return,
                    te
                  );
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (e = t.stateNode.containerInfo, l = e.nodeType, l === 9)
                  Qs(e);
                else if (l === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      Qs(e);
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
            e.return = t.return, Pe = e;
            break;
          }
          Pe = t.return;
        }
  }
  function fd(e, t, l) {
    var a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        dl(e, l), a & 4 && On(5, l);
        break;
      case 1:
        if (dl(e, l), a & 4)
          if (e = l.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (o) {
              Ee(l, l.return, o);
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
            } catch (o) {
              Ee(
                l,
                l.return,
                o
              );
            }
          }
        a & 64 && id(l), a & 512 && wn(l, l.return);
        break;
      case 3:
        if (dl(e, l), a & 64 && (e = l.updateQueue, e !== null)) {
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
            Jo(e, t);
          } catch (o) {
            Ee(l, l.return, o);
          }
        }
        break;
      case 27:
        t === null && a & 4 && rd(l);
      case 26:
      case 5:
        dl(e, l), t === null && a & 4 && cd(l), a & 512 && wn(l, l.return);
        break;
      case 12:
        dl(e, l);
        break;
      case 31:
        dl(e, l), a & 4 && hd(e, l);
        break;
      case 13:
        dl(e, l), a & 4 && pd(e, l), a & 64 && (e = l.memoizedState, e !== null && (e = e.dehydrated, e !== null && (l = dv.bind(
          null,
          l
        ), Ov(e, l))));
        break;
      case 22:
        if (a = l.memoizedState !== null || ol, !a) {
          t = t !== null && t.memoizedState !== null || Ke, n = ol;
          var i = Ke;
          ol = a, (Ke = t) && !i ? ml(
            e,
            l,
            (l.subtreeFlags & 8772) !== 0
          ) : dl(e, l), ol = n, Ke = i;
        }
        break;
      case 30:
        break;
      default:
        dl(e, l);
    }
  }
  function dd(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, dd(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && $u(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var De = null, dt = !1;
  function fl(e, t, l) {
    for (l = l.child; l !== null; )
      md(e, t, l), l = l.sibling;
  }
  function md(e, t, l) {
    if (bt && typeof bt.onCommitFiberUnmount == "function")
      try {
        bt.onCommitFiberUnmount(ln, l);
      } catch {
      }
    switch (l.tag) {
      case 26:
        Ke || Ft(l, t), fl(
          e,
          t,
          l
        ), l.memoizedState ? l.memoizedState.count-- : l.stateNode && (l = l.stateNode, l.parentNode.removeChild(l));
        break;
      case 27:
        Ke || Ft(l, t);
        var a = De, n = dt;
        Ll(l.type) && (De = l.stateNode, dt = !1), fl(
          e,
          t,
          l
        ), Gn(l.stateNode), De = a, dt = n;
        break;
      case 5:
        Ke || Ft(l, t);
      case 6:
        if (a = De, n = dt, De = null, fl(
          e,
          t,
          l
        ), De = a, dt = n, De !== null)
          if (dt)
            try {
              (De.nodeType === 9 ? De.body : De.nodeName === "HTML" ? De.ownerDocument.body : De).removeChild(l.stateNode);
            } catch (i) {
              Ee(
                l,
                t,
                i
              );
            }
          else
            try {
              De.removeChild(l.stateNode);
            } catch (i) {
              Ee(
                l,
                t,
                i
              );
            }
        break;
      case 18:
        De !== null && (dt ? (e = De, im(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          l.stateNode
        ), $a(e)) : im(De, l.stateNode));
        break;
      case 4:
        a = De, n = dt, De = l.stateNode.containerInfo, dt = !0, fl(
          e,
          t,
          l
        ), De = a, dt = n;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Cl(2, l, t), Ke || Cl(4, l, t), fl(
          e,
          t,
          l
        );
        break;
      case 1:
        Ke || (Ft(l, t), a = l.stateNode, typeof a.componentWillUnmount == "function" && ud(
          l,
          t,
          a
        )), fl(
          e,
          t,
          l
        );
        break;
      case 21:
        fl(
          e,
          t,
          l
        );
        break;
      case 22:
        Ke = (a = Ke) || l.memoizedState !== null, fl(
          e,
          t,
          l
        ), Ke = a;
        break;
      default:
        fl(
          e,
          t,
          l
        );
    }
  }
  function hd(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
      e = e.dehydrated;
      try {
        $a(e);
      } catch (l) {
        Ee(t, t.return, l);
      }
    }
  }
  function pd(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        $a(e);
      } catch (l) {
        Ee(t, t.return, l);
      }
  }
  function nv(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new od()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new od()), t;
      default:
        throw Error(s(435, e.tag));
    }
  }
  function Fi(e, t) {
    var l = nv(e);
    t.forEach(function(a) {
      if (!l.has(a)) {
        l.add(a);
        var n = mv.bind(null, e, a);
        a.then(n, n);
      }
    });
  }
  function mt(e, t) {
    var l = t.deletions;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var n = l[a], i = e, o = t, m = o;
        e: for (; m !== null; ) {
          switch (m.tag) {
            case 27:
              if (Ll(m.type)) {
                De = m.stateNode, dt = !1;
                break e;
              }
              break;
            case 5:
              De = m.stateNode, dt = !1;
              break e;
            case 3:
            case 4:
              De = m.stateNode.containerInfo, dt = !0;
              break e;
          }
          m = m.return;
        }
        if (De === null) throw Error(s(160));
        md(i, o, n), De = null, dt = !1, i = n.alternate, i !== null && (i.return = null), n.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        vd(t, e), t = t.sibling;
  }
  var Xt = null;
  function vd(e, t) {
    var l = e.alternate, a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        mt(t, e), ht(e), a & 4 && (Cl(3, e, e.return), On(3, e), Cl(5, e, e.return));
        break;
      case 1:
        mt(t, e), ht(e), a & 512 && (Ke || l === null || Ft(l, l.return)), a & 64 && ol && (e = e.updateQueue, e !== null && (a = e.callbacks, a !== null && (l = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = l === null ? a : l.concat(a))));
        break;
      case 26:
        var n = Xt;
        if (mt(t, e), ht(e), a & 512 && (Ke || l === null || Ft(l, l.return)), a & 4) {
          var i = l !== null ? l.memoizedState : null;
          if (a = e.memoizedState, l === null)
            if (a === null)
              if (e.stateNode === null) {
                e: {
                  a = e.type, l = e.memoizedProps, n = n.ownerDocument || n;
                  t: switch (a) {
                    case "title":
                      i = n.getElementsByTagName("title")[0], (!i || i[un] || i[Ie] || i.namespaceURI === "http://www.w3.org/2000/svg" || i.hasAttribute("itemprop")) && (i = n.createElement(a), n.head.insertBefore(
                        i,
                        n.querySelector("head > title")
                      )), at(i, a, l), i[Ie] = e, We(i), a = i;
                      break e;
                    case "link":
                      var o = vm(
                        "link",
                        "href",
                        n
                      ).get(a + (l.href || ""));
                      if (o) {
                        for (var m = 0; m < o.length; m++)
                          if (i = o[m], i.getAttribute("href") === (l.href == null || l.href === "" ? null : l.href) && i.getAttribute("rel") === (l.rel == null ? null : l.rel) && i.getAttribute("title") === (l.title == null ? null : l.title) && i.getAttribute("crossorigin") === (l.crossOrigin == null ? null : l.crossOrigin)) {
                            o.splice(m, 1);
                            break t;
                          }
                      }
                      i = n.createElement(a), at(i, a, l), n.head.appendChild(i);
                      break;
                    case "meta":
                      if (o = vm(
                        "meta",
                        "content",
                        n
                      ).get(a + (l.content || ""))) {
                        for (m = 0; m < o.length; m++)
                          if (i = o[m], i.getAttribute("content") === (l.content == null ? null : "" + l.content) && i.getAttribute("name") === (l.name == null ? null : l.name) && i.getAttribute("property") === (l.property == null ? null : l.property) && i.getAttribute("http-equiv") === (l.httpEquiv == null ? null : l.httpEquiv) && i.getAttribute("charset") === (l.charSet == null ? null : l.charSet)) {
                            o.splice(m, 1);
                            break t;
                          }
                      }
                      i = n.createElement(a), at(i, a, l), n.head.appendChild(i);
                      break;
                    default:
                      throw Error(s(468, a));
                  }
                  i[Ie] = e, We(i), a = i;
                }
                e.stateNode = a;
              } else
                gm(
                  n,
                  e.type,
                  e.stateNode
                );
            else
              e.stateNode = pm(
                n,
                a,
                e.memoizedProps
              );
          else
            i !== a ? (i === null ? l.stateNode !== null && (l = l.stateNode, l.parentNode.removeChild(l)) : i.count--, a === null ? gm(
              n,
              e.type,
              e.stateNode
            ) : pm(
              n,
              a,
              e.memoizedProps
            )) : a === null && e.stateNode !== null && vs(
              e,
              e.memoizedProps,
              l.memoizedProps
            );
        }
        break;
      case 27:
        mt(t, e), ht(e), a & 512 && (Ke || l === null || Ft(l, l.return)), l !== null && a & 4 && vs(
          e,
          e.memoizedProps,
          l.memoizedProps
        );
        break;
      case 5:
        if (mt(t, e), ht(e), a & 512 && (Ke || l === null || Ft(l, l.return)), e.flags & 32) {
          n = e.stateNode;
          try {
            ya(n, "");
          } catch (K) {
            Ee(e, e.return, K);
          }
        }
        a & 4 && e.stateNode != null && (n = e.memoizedProps, vs(
          e,
          n,
          l !== null ? l.memoizedProps : n
        )), a & 1024 && (bs = !0);
        break;
      case 6:
        if (mt(t, e), ht(e), a & 4) {
          if (e.stateNode === null)
            throw Error(s(162));
          a = e.memoizedProps, l = e.stateNode;
          try {
            l.nodeValue = a;
          } catch (K) {
            Ee(e, e.return, K);
          }
        }
        break;
      case 3:
        if (du = null, n = Xt, Xt = ou(t.containerInfo), mt(t, e), Xt = n, ht(e), a & 4 && l !== null && l.memoizedState.isDehydrated)
          try {
            $a(t.containerInfo);
          } catch (K) {
            Ee(e, e.return, K);
          }
        bs && (bs = !1, gd(e));
        break;
      case 4:
        a = Xt, Xt = ou(
          e.stateNode.containerInfo
        ), mt(t, e), ht(e), Xt = a;
        break;
      case 12:
        mt(t, e), ht(e);
        break;
      case 31:
        mt(t, e), ht(e), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, Fi(e, a)));
        break;
      case 13:
        mt(t, e), ht(e), e.child.flags & 8192 && e.memoizedState !== null != (l !== null && l.memoizedState !== null) && (Pi = yt()), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, Fi(e, a)));
        break;
      case 22:
        n = e.memoizedState !== null;
        var x = l !== null && l.memoizedState !== null, z = ol, w = Ke;
        if (ol = z || n, Ke = w || x, mt(t, e), Ke = w, ol = z, ht(e), a & 8192)
          e: for (t = e.stateNode, t._visibility = n ? t._visibility & -2 : t._visibility | 1, n && (l === null || x || ol || Ke || ca(e)), l = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (l === null) {
                x = l = t;
                try {
                  if (i = x.stateNode, n)
                    o = i.style, typeof o.setProperty == "function" ? o.setProperty("display", "none", "important") : o.display = "none";
                  else {
                    m = x.stateNode;
                    var L = x.memoizedProps.style, A = L != null && L.hasOwnProperty("display") ? L.display : null;
                    m.style.display = A == null || typeof A == "boolean" ? "" : ("" + A).trim();
                  }
                } catch (K) {
                  Ee(x, x.return, K);
                }
              }
            } else if (t.tag === 6) {
              if (l === null) {
                x = t;
                try {
                  x.stateNode.nodeValue = n ? "" : x.memoizedProps;
                } catch (K) {
                  Ee(x, x.return, K);
                }
              }
            } else if (t.tag === 18) {
              if (l === null) {
                x = t;
                try {
                  var O = x.stateNode;
                  n ? um(O, !0) : um(x.stateNode, !1);
                } catch (K) {
                  Ee(x, x.return, K);
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
        a & 4 && (a = e.updateQueue, a !== null && (l = a.retryQueue, l !== null && (a.retryQueue = null, Fi(e, l))));
        break;
      case 19:
        mt(t, e), ht(e), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, Fi(e, a)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        mt(t, e), ht(e);
    }
  }
  function ht(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var l, a = e.return; a !== null; ) {
          if (sd(a)) {
            l = a;
            break;
          }
          a = a.return;
        }
        if (l == null) throw Error(s(160));
        switch (l.tag) {
          case 27:
            var n = l.stateNode, i = gs(e);
            $i(e, i, n);
            break;
          case 5:
            var o = l.stateNode;
            l.flags & 32 && (ya(o, ""), l.flags &= -33);
            var m = gs(e);
            $i(e, m, o);
            break;
          case 3:
          case 4:
            var x = l.stateNode.containerInfo, z = gs(e);
            ys(
              e,
              z,
              x
            );
            break;
          default:
            throw Error(s(161));
        }
      } catch (w) {
        Ee(e, e.return, w);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function gd(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        gd(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
  }
  function dl(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        fd(e, t.alternate, t), t = t.sibling;
  }
  function ca(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Cl(4, t, t.return), ca(t);
          break;
        case 1:
          Ft(t, t.return);
          var l = t.stateNode;
          typeof l.componentWillUnmount == "function" && ud(
            t,
            t.return,
            l
          ), ca(t);
          break;
        case 27:
          Gn(t.stateNode);
        case 26:
        case 5:
          Ft(t, t.return), ca(t);
          break;
        case 22:
          t.memoizedState === null && ca(t);
          break;
        case 30:
          ca(t);
          break;
        default:
          ca(t);
      }
      e = e.sibling;
    }
  }
  function ml(e, t, l) {
    for (l = l && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var a = t.alternate, n = e, i = t, o = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          ml(
            n,
            i,
            l
          ), On(4, i);
          break;
        case 1:
          if (ml(
            n,
            i,
            l
          ), a = i, n = a.stateNode, typeof n.componentDidMount == "function")
            try {
              n.componentDidMount();
            } catch (z) {
              Ee(a, a.return, z);
            }
          if (a = i, n = a.updateQueue, n !== null) {
            var m = a.stateNode;
            try {
              var x = n.shared.hiddenCallbacks;
              if (x !== null)
                for (n.shared.hiddenCallbacks = null, n = 0; n < x.length; n++)
                  Ko(x[n], m);
            } catch (z) {
              Ee(a, a.return, z);
            }
          }
          l && o & 64 && id(i), wn(i, i.return);
          break;
        case 27:
          rd(i);
        case 26:
        case 5:
          ml(
            n,
            i,
            l
          ), l && a === null && o & 4 && cd(i), wn(i, i.return);
          break;
        case 12:
          ml(
            n,
            i,
            l
          );
          break;
        case 31:
          ml(
            n,
            i,
            l
          ), l && o & 4 && hd(n, i);
          break;
        case 13:
          ml(
            n,
            i,
            l
          ), l && o & 4 && pd(n, i);
          break;
        case 22:
          i.memoizedState === null && ml(
            n,
            i,
            l
          ), wn(i, i.return);
          break;
        case 30:
          break;
        default:
          ml(
            n,
            i,
            l
          );
      }
      t = t.sibling;
    }
  }
  function xs(e, t) {
    var l = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== l && (e != null && e.refCount++, l != null && bn(l));
  }
  function _s(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && bn(e));
  }
  function Qt(e, t, l, a) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        yd(
          e,
          t,
          l,
          a
        ), t = t.sibling;
  }
  function yd(e, t, l, a) {
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
        ), n & 2048 && On(9, t);
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
        ), n & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && bn(e)));
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
            var i = t.memoizedProps, o = i.id, m = i.onPostCommit;
            typeof m == "function" && m(
              o,
              t.alternate === null ? "mount" : "update",
              e.passiveEffectDuration,
              -0
            );
          } catch (x) {
            Ee(t, t.return, x);
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
        i = t.stateNode, o = t.alternate, t.memoizedState !== null ? i._visibility & 2 ? Qt(
          e,
          t,
          l,
          a
        ) : Dn(e, t) : i._visibility & 2 ? Qt(
          e,
          t,
          l,
          a
        ) : (i._visibility |= 2, Ba(
          e,
          t,
          l,
          a,
          (t.subtreeFlags & 10256) !== 0 || !1
        )), n & 2048 && xs(o, t);
        break;
      case 24:
        Qt(
          e,
          t,
          l,
          a
        ), n & 2048 && _s(t.alternate, t);
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
  function Ba(e, t, l, a, n) {
    for (n = n && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var i = e, o = t, m = l, x = a, z = o.flags;
      switch (o.tag) {
        case 0:
        case 11:
        case 15:
          Ba(
            i,
            o,
            m,
            x,
            n
          ), On(8, o);
          break;
        case 23:
          break;
        case 22:
          var w = o.stateNode;
          o.memoizedState !== null ? w._visibility & 2 ? Ba(
            i,
            o,
            m,
            x,
            n
          ) : Dn(
            i,
            o
          ) : (w._visibility |= 2, Ba(
            i,
            o,
            m,
            x,
            n
          )), n && z & 2048 && xs(
            o.alternate,
            o
          );
          break;
        case 24:
          Ba(
            i,
            o,
            m,
            x,
            n
          ), n && z & 2048 && _s(o.alternate, o);
          break;
        default:
          Ba(
            i,
            o,
            m,
            x,
            n
          );
      }
      t = t.sibling;
    }
  }
  function Dn(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var l = e, a = t, n = a.flags;
        switch (a.tag) {
          case 22:
            Dn(l, a), n & 2048 && xs(
              a.alternate,
              a
            );
            break;
          case 24:
            Dn(l, a), n & 2048 && _s(a.alternate, a);
            break;
          default:
            Dn(l, a);
        }
        t = t.sibling;
      }
  }
  var Un = 8192;
  function qa(e, t, l) {
    if (e.subtreeFlags & Un)
      for (e = e.child; e !== null; )
        bd(
          e,
          t,
          l
        ), e = e.sibling;
  }
  function bd(e, t, l) {
    switch (e.tag) {
      case 26:
        qa(
          e,
          t,
          l
        ), e.flags & Un && e.memoizedState !== null && Qv(
          l,
          Xt,
          e.memoizedState,
          e.memoizedProps
        );
        break;
      case 5:
        qa(
          e,
          t,
          l
        );
        break;
      case 3:
      case 4:
        var a = Xt;
        Xt = ou(e.stateNode.containerInfo), qa(
          e,
          t,
          l
        ), Xt = a;
        break;
      case 22:
        e.memoizedState === null && (a = e.alternate, a !== null && a.memoizedState !== null ? (a = Un, Un = 16777216, qa(
          e,
          t,
          l
        ), Un = a) : qa(
          e,
          t,
          l
        ));
        break;
      default:
        qa(
          e,
          t,
          l
        );
    }
  }
  function xd(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function Hn(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          Pe = a, Sd(
            a,
            e
          );
        }
      xd(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        _d(e), e = e.sibling;
  }
  function _d(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        Hn(e), e.flags & 2048 && Cl(9, e, e.return);
        break;
      case 3:
        Hn(e);
        break;
      case 12:
        Hn(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Wi(e)) : Hn(e);
        break;
      default:
        Hn(e);
    }
  }
  function Wi(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          Pe = a, Sd(
            a,
            e
          );
        }
      xd(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          Cl(8, t, t.return), Wi(t);
          break;
        case 22:
          l = t.stateNode, l._visibility & 2 && (l._visibility &= -3, Wi(t));
          break;
        default:
          Wi(t);
      }
      e = e.sibling;
    }
  }
  function Sd(e, t) {
    for (; Pe !== null; ) {
      var l = Pe;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          Cl(8, l, t);
          break;
        case 23:
        case 22:
          if (l.memoizedState !== null && l.memoizedState.cachePool !== null) {
            var a = l.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          bn(l.memoizedState.cache);
      }
      if (a = l.child, a !== null) a.return = l, Pe = a;
      else
        e: for (l = e; Pe !== null; ) {
          a = Pe;
          var n = a.sibling, i = a.return;
          if (dd(a), a === l) {
            Pe = null;
            break e;
          }
          if (n !== null) {
            n.return = i, Pe = n;
            break e;
          }
          Pe = i;
        }
    }
  }
  var iv = {
    getCacheForType: function(e) {
      var t = tt(Qe), l = t.data.get(e);
      return l === void 0 && (l = e(), t.data.set(e, l)), l;
    },
    cacheSignal: function() {
      return tt(Qe).controller.signal;
    }
  }, uv = typeof WeakMap == "function" ? WeakMap : Map, _e = 0, ze = null, oe = null, me = 0, je = 0, Nt = null, Ml = !1, Ya = !1, Ss = !1, hl = 0, qe = 0, Ol = 0, sa = 0, js = 0, Tt = 0, ka = 0, Ln = null, pt = null, Es = !1, Pi = 0, jd = 0, Ii = 1 / 0, eu = null, wl = null, Je = 0, Dl = null, Ga = null, pl = 0, Ns = 0, Ts = null, Ed = null, Bn = 0, Rs = null;
  function Rt() {
    return (_e & 2) !== 0 && me !== 0 ? me & -me : M.T !== null ? ws() : Br();
  }
  function Nd() {
    if (Tt === 0)
      if ((me & 536870912) === 0 || ve) {
        var e = si;
        si <<= 1, (si & 3932160) === 0 && (si = 262144), Tt = e;
      } else Tt = 536870912;
    return e = jt.current, e !== null && (e.flags |= 32), Tt;
  }
  function vt(e, t, l) {
    (e === ze && (je === 2 || je === 9) || e.cancelPendingCommit !== null) && (Xa(e, 0), Ul(
      e,
      me,
      Tt,
      !1
    )), nn(e, l), ((_e & 2) === 0 || e !== ze) && (e === ze && ((_e & 2) === 0 && (sa |= l), qe === 4 && Ul(
      e,
      me,
      Tt,
      !1
    )), Wt(e));
  }
  function Td(e, t, l) {
    if ((_e & 6) !== 0) throw Error(s(327));
    var a = !l && (t & 127) === 0 && (t & e.expiredLanes) === 0 || an(e, t), n = a ? rv(e, t) : As(e, t, !0), i = a;
    do {
      if (n === 0) {
        Ya && !a && Ul(e, t, 0, !1);
        break;
      } else {
        if (l = e.current.alternate, i && !cv(l)) {
          n = As(e, t, !1), i = !1;
          continue;
        }
        if (n === 2) {
          if (i = t, e.errorRecoveryDisabledLanes & i)
            var o = 0;
          else
            o = e.pendingLanes & -536870913, o = o !== 0 ? o : o & 536870912 ? 536870912 : 0;
          if (o !== 0) {
            t = o;
            e: {
              var m = e;
              n = Ln;
              var x = m.current.memoizedState.isDehydrated;
              if (x && (Xa(m, o).flags |= 256), o = As(
                m,
                o,
                !1
              ), o !== 2) {
                if (Ss && !x) {
                  m.errorRecoveryDisabledLanes |= i, sa |= i, n = 4;
                  break e;
                }
                i = pt, pt = n, i !== null && (pt === null ? pt = i : pt.push.apply(
                  pt,
                  i
                ));
              }
              n = o;
            }
            if (i = !1, n !== 2) continue;
          }
        }
        if (n === 1) {
          Xa(e, 0), Ul(e, t, 0, !0);
          break;
        }
        e: {
          switch (a = e, i = n, i) {
            case 0:
            case 1:
              throw Error(s(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              Ul(
                a,
                t,
                Tt,
                !Ml
              );
              break e;
            case 2:
              pt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(s(329));
          }
          if ((t & 62914560) === t && (n = Pi + 300 - yt(), 10 < n)) {
            if (Ul(
              a,
              t,
              Tt,
              !Ml
            ), oi(a, 0, !0) !== 0) break e;
            pl = t, a.timeoutHandle = am(
              Rd.bind(
                null,
                a,
                l,
                pt,
                eu,
                Es,
                t,
                Tt,
                sa,
                ka,
                Ml,
                i,
                "Throttled",
                -0,
                0
              ),
              n
            );
            break e;
          }
          Rd(
            a,
            l,
            pt,
            eu,
            Es,
            t,
            Tt,
            sa,
            ka,
            Ml,
            i,
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
  function Rd(e, t, l, a, n, i, o, m, x, z, w, L, A, O) {
    if (e.timeoutHandle = -1, L = t.subtreeFlags, L & 8192 || (L & 16785408) === 16785408) {
      L = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: el
      }, bd(
        t,
        i,
        L
      );
      var K = (i & 62914560) === i ? Pi - yt() : (i & 4194048) === i ? jd - yt() : 0;
      if (K = Zv(
        L,
        K
      ), K !== null) {
        pl = i, e.cancelPendingCommit = K(
          Ud.bind(
            null,
            e,
            t,
            i,
            l,
            a,
            n,
            o,
            m,
            x,
            w,
            L,
            null,
            A,
            O
          )
        ), Ul(e, i, o, !z);
        return;
      }
    }
    Ud(
      e,
      t,
      i,
      l,
      a,
      n,
      o,
      m,
      x
    );
  }
  function cv(e) {
    for (var t = e; ; ) {
      var l = t.tag;
      if ((l === 0 || l === 11 || l === 15) && t.flags & 16384 && (l = t.updateQueue, l !== null && (l = l.stores, l !== null)))
        for (var a = 0; a < l.length; a++) {
          var n = l[a], i = n.getSnapshot;
          n = n.value;
          try {
            if (!_t(i(), n)) return !1;
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
  function Ul(e, t, l, a) {
    t &= ~js, t &= ~sa, e.suspendedLanes |= t, e.pingedLanes &= ~t, a && (e.warmLanes |= t), a = e.expirationTimes;
    for (var n = t; 0 < n; ) {
      var i = 31 - xt(n), o = 1 << i;
      a[i] = -1, n &= ~o;
    }
    l !== 0 && Ur(e, l, t);
  }
  function tu() {
    return (_e & 6) === 0 ? (qn(0), !1) : !0;
  }
  function zs() {
    if (oe !== null) {
      if (je === 0)
        var e = oe.return;
      else
        e = oe, nl = Il = null, Qc(e), wa = null, _n = 0, e = oe;
      for (; e !== null; )
        nd(e.alternate, e), e = e.return;
      oe = null;
    }
  }
  function Xa(e, t) {
    var l = e.timeoutHandle;
    l !== -1 && (e.timeoutHandle = -1, Rv(l)), l = e.cancelPendingCommit, l !== null && (e.cancelPendingCommit = null, l()), pl = 0, zs(), ze = e, oe = l = ll(e.current, null), me = t, je = 0, Nt = null, Ml = !1, Ya = an(e, t), Ss = !1, ka = Tt = js = sa = Ol = qe = 0, pt = Ln = null, Es = !1, (t & 8) !== 0 && (t |= t & 32);
    var a = e.entangledLanes;
    if (a !== 0)
      for (e = e.entanglements, a &= t; 0 < a; ) {
        var n = 31 - xt(a), i = 1 << n;
        t |= e[n], a &= ~i;
      }
    return hl = t, Si(), l;
  }
  function zd(e, t) {
    ie = null, M.H = An, t === Oa || t === Ci ? (t = Xo(), je = 3) : t === Oc ? (t = Xo(), je = 4) : je = t === us ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, Nt = t, oe === null && (qe = 1, Qi(
      e,
      wt(t, e.current)
    ));
  }
  function Ad() {
    var e = jt.current;
    return e === null ? !0 : (me & 4194048) === me ? Lt === null : (me & 62914560) === me || (me & 536870912) !== 0 ? e === Lt : !1;
  }
  function Cd() {
    var e = M.H;
    return M.H = An, e === null ? An : e;
  }
  function Md() {
    var e = M.A;
    return M.A = iv, e;
  }
  function lu() {
    qe = 4, Ml || (me & 4194048) !== me && jt.current !== null || (Ya = !0), (Ol & 134217727) === 0 && (sa & 134217727) === 0 || ze === null || Ul(
      ze,
      me,
      Tt,
      !1
    );
  }
  function As(e, t, l) {
    var a = _e;
    _e |= 2;
    var n = Cd(), i = Md();
    (ze !== e || me !== t) && (eu = null, Xa(e, t)), t = !1;
    var o = qe;
    e: do
      try {
        if (je !== 0 && oe !== null) {
          var m = oe, x = Nt;
          switch (je) {
            case 8:
              zs(), o = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              jt.current === null && (t = !0);
              var z = je;
              if (je = 0, Nt = null, Qa(e, m, x, z), l && Ya) {
                o = 0;
                break e;
              }
              break;
            default:
              z = je, je = 0, Nt = null, Qa(e, m, x, z);
          }
        }
        sv(), o = qe;
        break;
      } catch (w) {
        zd(e, w);
      }
    while (!0);
    return t && e.shellSuspendCounter++, nl = Il = null, _e = a, M.H = n, M.A = i, oe === null && (ze = null, me = 0, Si()), o;
  }
  function sv() {
    for (; oe !== null; ) Od(oe);
  }
  function rv(e, t) {
    var l = _e;
    _e |= 2;
    var a = Cd(), n = Md();
    ze !== e || me !== t ? (eu = null, Ii = yt() + 500, Xa(e, t)) : Ya = an(
      e,
      t
    );
    e: do
      try {
        if (je !== 0 && oe !== null) {
          t = oe;
          var i = Nt;
          t: switch (je) {
            case 1:
              je = 0, Nt = null, Qa(e, t, i, 1);
              break;
            case 2:
            case 9:
              if (ko(i)) {
                je = 0, Nt = null, wd(t);
                break;
              }
              t = function() {
                je !== 2 && je !== 9 || ze !== e || (je = 7), Wt(e);
              }, i.then(t, t);
              break e;
            case 3:
              je = 7;
              break e;
            case 4:
              je = 5;
              break e;
            case 7:
              ko(i) ? (je = 0, Nt = null, wd(t)) : (je = 0, Nt = null, Qa(e, t, i, 7));
              break;
            case 5:
              var o = null;
              switch (oe.tag) {
                case 26:
                  o = oe.memoizedState;
                case 5:
                case 27:
                  var m = oe;
                  if (o ? ym(o) : m.stateNode.complete) {
                    je = 0, Nt = null;
                    var x = m.sibling;
                    if (x !== null) oe = x;
                    else {
                      var z = m.return;
                      z !== null ? (oe = z, au(z)) : oe = null;
                    }
                    break t;
                  }
              }
              je = 0, Nt = null, Qa(e, t, i, 5);
              break;
            case 6:
              je = 0, Nt = null, Qa(e, t, i, 6);
              break;
            case 8:
              zs(), qe = 6;
              break e;
            default:
              throw Error(s(462));
          }
        }
        ov();
        break;
      } catch (w) {
        zd(e, w);
      }
    while (!0);
    return nl = Il = null, M.H = a, M.A = n, _e = l, oe !== null ? 0 : (ze = null, me = 0, Si(), qe);
  }
  function ov() {
    for (; oe !== null && !wh(); )
      Od(oe);
  }
  function Od(e) {
    var t = ld(e.alternate, e, hl);
    e.memoizedProps = e.pendingProps, t === null ? au(e) : oe = t;
  }
  function wd(e) {
    var t = e, l = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = Ff(
          l,
          t,
          t.pendingProps,
          t.type,
          void 0,
          me
        );
        break;
      case 11:
        t = Ff(
          l,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          me
        );
        break;
      case 5:
        Qc(t);
      default:
        nd(l, t), t = oe = Co(t, hl), t = ld(l, t, hl);
    }
    e.memoizedProps = e.pendingProps, t === null ? au(e) : oe = t;
  }
  function Qa(e, t, l, a) {
    nl = Il = null, Qc(t), wa = null, _n = 0;
    var n = t.return;
    try {
      if (Pp(
        e,
        n,
        t,
        l,
        me
      )) {
        qe = 1, Qi(
          e,
          wt(l, e.current)
        ), oe = null;
        return;
      }
    } catch (i) {
      if (n !== null) throw oe = n, i;
      qe = 1, Qi(
        e,
        wt(l, e.current)
      ), oe = null;
      return;
    }
    t.flags & 32768 ? (ve || a === 1 ? e = !0 : Ya || (me & 536870912) !== 0 ? e = !1 : (Ml = e = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = jt.current, a !== null && a.tag === 13 && (a.flags |= 16384))), Dd(t, e)) : au(t);
  }
  function au(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        Dd(
          t,
          Ml
        );
        return;
      }
      e = t.return;
      var l = tv(
        t.alternate,
        t,
        hl
      );
      if (l !== null) {
        oe = l;
        return;
      }
      if (t = t.sibling, t !== null) {
        oe = t;
        return;
      }
      oe = t = e;
    } while (t !== null);
    qe === 0 && (qe = 5);
  }
  function Dd(e, t) {
    do {
      var l = lv(e.alternate, e);
      if (l !== null) {
        l.flags &= 32767, oe = l;
        return;
      }
      if (l = e.return, l !== null && (l.flags |= 32768, l.subtreeFlags = 0, l.deletions = null), !t && (e = e.sibling, e !== null)) {
        oe = e;
        return;
      }
      oe = e = l;
    } while (e !== null);
    qe = 6, oe = null;
  }
  function Ud(e, t, l, a, n, i, o, m, x) {
    e.cancelPendingCommit = null;
    do
      nu();
    while (Je !== 0);
    if ((_e & 6) !== 0) throw Error(s(327));
    if (t !== null) {
      if (t === e.current) throw Error(s(177));
      if (i = t.lanes | t.childLanes, i |= gc, Xh(
        e,
        l,
        i,
        o,
        m,
        x
      ), e === ze && (oe = ze = null, me = 0), Ga = t, Dl = e, pl = l, Ns = i, Ts = n, Ed = a, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, hv(ui, function() {
        return Yd(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
        a = M.T, M.T = null, n = q.p, q.p = 2, o = _e, _e |= 4;
        try {
          av(e, t, l);
        } finally {
          _e = o, q.p = n, M.T = a;
        }
      }
      Je = 1, Hd(), Ld(), Bd();
    }
  }
  function Hd() {
    if (Je === 1) {
      Je = 0;
      var e = Dl, t = Ga, l = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || l) {
        l = M.T, M.T = null;
        var a = q.p;
        q.p = 2;
        var n = _e;
        _e |= 4;
        try {
          vd(t, e);
          var i = ks, o = _o(e.containerInfo), m = i.focusedElem, x = i.selectionRange;
          if (o !== m && m && m.ownerDocument && xo(
            m.ownerDocument.documentElement,
            m
          )) {
            if (x !== null && dc(m)) {
              var z = x.start, w = x.end;
              if (w === void 0 && (w = z), "selectionStart" in m)
                m.selectionStart = z, m.selectionEnd = Math.min(
                  w,
                  m.value.length
                );
              else {
                var L = m.ownerDocument || document, A = L && L.defaultView || window;
                if (A.getSelection) {
                  var O = A.getSelection(), K = m.textContent.length, te = Math.min(x.start, K), Re = x.end === void 0 ? te : Math.min(x.end, K);
                  !O.extend && te > Re && (o = Re, Re = te, te = o);
                  var N = bo(
                    m,
                    te
                  ), S = bo(
                    m,
                    Re
                  );
                  if (N && S && (O.rangeCount !== 1 || O.anchorNode !== N.node || O.anchorOffset !== N.offset || O.focusNode !== S.node || O.focusOffset !== S.offset)) {
                    var R = L.createRange();
                    R.setStart(N.node, N.offset), O.removeAllRanges(), te > Re ? (O.addRange(R), O.extend(S.node, S.offset)) : (R.setEnd(S.node, S.offset), O.addRange(R));
                  }
                }
              }
            }
            for (L = [], O = m; O = O.parentNode; )
              O.nodeType === 1 && L.push({
                element: O,
                left: O.scrollLeft,
                top: O.scrollTop
              });
            for (typeof m.focus == "function" && m.focus(), m = 0; m < L.length; m++) {
              var D = L[m];
              D.element.scrollLeft = D.left, D.element.scrollTop = D.top;
            }
          }
          vu = !!Ys, ks = Ys = null;
        } finally {
          _e = n, q.p = a, M.T = l;
        }
      }
      e.current = t, Je = 2;
    }
  }
  function Ld() {
    if (Je === 2) {
      Je = 0;
      var e = Dl, t = Ga, l = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || l) {
        l = M.T, M.T = null;
        var a = q.p;
        q.p = 2;
        var n = _e;
        _e |= 4;
        try {
          fd(e, t.alternate, t);
        } finally {
          _e = n, q.p = a, M.T = l;
        }
      }
      Je = 3;
    }
  }
  function Bd() {
    if (Je === 4 || Je === 3) {
      Je = 0, Dh();
      var e = Dl, t = Ga, l = pl, a = Ed;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? Je = 5 : (Je = 0, Ga = Dl = null, qd(e, e.pendingLanes));
      var n = e.pendingLanes;
      if (n === 0 && (wl = null), Ku(l), t = t.stateNode, bt && typeof bt.onCommitFiberRoot == "function")
        try {
          bt.onCommitFiberRoot(
            ln,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (a !== null) {
        t = M.T, n = q.p, q.p = 2, M.T = null;
        try {
          for (var i = e.onRecoverableError, o = 0; o < a.length; o++) {
            var m = a[o];
            i(m.value, {
              componentStack: m.stack
            });
          }
        } finally {
          M.T = t, q.p = n;
        }
      }
      (pl & 3) !== 0 && nu(), Wt(e), n = e.pendingLanes, (l & 261930) !== 0 && (n & 42) !== 0 ? e === Rs ? Bn++ : (Bn = 0, Rs = e) : Bn = 0, qn(0);
    }
  }
  function qd(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, bn(t)));
  }
  function nu() {
    return Hd(), Ld(), Bd(), Yd();
  }
  function Yd() {
    if (Je !== 5) return !1;
    var e = Dl, t = Ns;
    Ns = 0;
    var l = Ku(pl), a = M.T, n = q.p;
    try {
      q.p = 32 > l ? 32 : l, M.T = null, l = Ts, Ts = null;
      var i = Dl, o = pl;
      if (Je = 0, Ga = Dl = null, pl = 0, (_e & 6) !== 0) throw Error(s(331));
      var m = _e;
      if (_e |= 4, _d(i.current), yd(
        i,
        i.current,
        o,
        l
      ), _e = m, qn(0, !1), bt && typeof bt.onPostCommitFiberRoot == "function")
        try {
          bt.onPostCommitFiberRoot(ln, i);
        } catch {
        }
      return !0;
    } finally {
      q.p = n, M.T = a, qd(e, t);
    }
  }
  function kd(e, t, l) {
    t = wt(l, t), t = is(e.stateNode, t, 2), e = Rl(e, t, 2), e !== null && (nn(e, 2), Wt(e));
  }
  function Ee(e, t, l) {
    if (e.tag === 3)
      kd(e, e, l);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          kd(
            t,
            e,
            l
          );
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (wl === null || !wl.has(a))) {
            e = wt(l, e), l = Gf(2), a = Rl(t, l, 2), a !== null && (Xf(
              l,
              a,
              t,
              e
            ), nn(a, 2), Wt(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function Cs(e, t, l) {
    var a = e.pingCache;
    if (a === null) {
      a = e.pingCache = new uv();
      var n = /* @__PURE__ */ new Set();
      a.set(t, n);
    } else
      n = a.get(t), n === void 0 && (n = /* @__PURE__ */ new Set(), a.set(t, n));
    n.has(l) || (Ss = !0, n.add(l), e = fv.bind(null, e, t, l), t.then(e, e));
  }
  function fv(e, t, l) {
    var a = e.pingCache;
    a !== null && a.delete(t), e.pingedLanes |= e.suspendedLanes & l, e.warmLanes &= ~l, ze === e && (me & l) === l && (qe === 4 || qe === 3 && (me & 62914560) === me && 300 > yt() - Pi ? (_e & 2) === 0 && Xa(e, 0) : js |= l, ka === me && (ka = 0)), Wt(e);
  }
  function Gd(e, t) {
    t === 0 && (t = Dr()), e = Fl(e, t), e !== null && (nn(e, t), Wt(e));
  }
  function dv(e) {
    var t = e.memoizedState, l = 0;
    t !== null && (l = t.retryLane), Gd(e, l);
  }
  function mv(e, t) {
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
    a !== null && a.delete(t), Gd(e, l);
  }
  function hv(e, t) {
    return Xu(e, t);
  }
  var iu = null, Za = null, Ms = !1, uu = !1, Os = !1, Hl = 0;
  function Wt(e) {
    e !== Za && e.next === null && (Za === null ? iu = Za = e : Za = Za.next = e), uu = !0, Ms || (Ms = !0, vv());
  }
  function qn(e, t) {
    if (!Os && uu) {
      Os = !0;
      do
        for (var l = !1, a = iu; a !== null; ) {
          if (e !== 0) {
            var n = a.pendingLanes;
            if (n === 0) var i = 0;
            else {
              var o = a.suspendedLanes, m = a.pingedLanes;
              i = (1 << 31 - xt(42 | e) + 1) - 1, i &= n & ~(o & ~m), i = i & 201326741 ? i & 201326741 | 1 : i ? i | 2 : 0;
            }
            i !== 0 && (l = !0, Vd(a, i));
          } else
            i = me, i = oi(
              a,
              a === ze ? i : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (i & 3) === 0 || an(a, i) || (l = !0, Vd(a, i));
          a = a.next;
        }
      while (l);
      Os = !1;
    }
  }
  function pv() {
    Xd();
  }
  function Xd() {
    uu = Ms = !1;
    var e = 0;
    Hl !== 0 && Tv() && (e = Hl);
    for (var t = yt(), l = null, a = iu; a !== null; ) {
      var n = a.next, i = Qd(a, t);
      i === 0 ? (a.next = null, l === null ? iu = n : l.next = n, n === null && (Za = l)) : (l = a, (e !== 0 || (i & 3) !== 0) && (uu = !0)), a = n;
    }
    Je !== 0 && Je !== 5 || qn(e), Hl !== 0 && (Hl = 0);
  }
  function Qd(e, t) {
    for (var l = e.suspendedLanes, a = e.pingedLanes, n = e.expirationTimes, i = e.pendingLanes & -62914561; 0 < i; ) {
      var o = 31 - xt(i), m = 1 << o, x = n[o];
      x === -1 ? ((m & l) === 0 || (m & a) !== 0) && (n[o] = Gh(m, t)) : x <= t && (e.expiredLanes |= m), i &= ~m;
    }
    if (t = ze, l = me, l = oi(
      e,
      e === t ? l : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a = e.callbackNode, l === 0 || e === t && (je === 2 || je === 9) || e.cancelPendingCommit !== null)
      return a !== null && a !== null && Qu(a), e.callbackNode = null, e.callbackPriority = 0;
    if ((l & 3) === 0 || an(e, l)) {
      if (t = l & -l, t === e.callbackPriority) return t;
      switch (a !== null && Qu(a), Ku(l)) {
        case 2:
        case 8:
          l = Or;
          break;
        case 32:
          l = ui;
          break;
        case 268435456:
          l = wr;
          break;
        default:
          l = ui;
      }
      return a = Zd.bind(null, e), l = Xu(l, a), e.callbackPriority = t, e.callbackNode = l, t;
    }
    return a !== null && a !== null && Qu(a), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function Zd(e, t) {
    if (Je !== 0 && Je !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var l = e.callbackNode;
    if (nu() && e.callbackNode !== l)
      return null;
    var a = me;
    return a = oi(
      e,
      e === ze ? a : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a === 0 ? null : (Td(e, a, t), Qd(e, yt()), e.callbackNode != null && e.callbackNode === l ? Zd.bind(null, e) : null);
  }
  function Vd(e, t) {
    if (nu()) return null;
    Td(e, t, !0);
  }
  function vv() {
    zv(function() {
      (_e & 6) !== 0 ? Xu(
        Mr,
        pv
      ) : Xd();
    });
  }
  function ws() {
    if (Hl === 0) {
      var e = Ca;
      e === 0 && (e = ci, ci <<= 1, (ci & 261888) === 0 && (ci = 256)), Hl = e;
    }
    return Hl;
  }
  function Kd(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : hi("" + e);
  }
  function Jd(e, t) {
    var l = t.ownerDocument.createElement("input");
    return l.name = t.name, l.value = t.value, e.id && l.setAttribute("form", e.id), t.parentNode.insertBefore(l, t), e = new FormData(e), l.parentNode.removeChild(l), e;
  }
  function gv(e, t, l, a, n) {
    if (t === "submit" && l && l.stateNode === n) {
      var i = Kd(
        (n[ot] || null).action
      ), o = a.submitter;
      o && (t = (t = o[ot] || null) ? Kd(t.formAction) : o.getAttribute("formAction"), t !== null && (i = t, o = null));
      var m = new yi(
        "action",
        "action",
        null,
        a,
        n
      );
      e.push({
        event: m,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (Hl !== 0) {
                  var x = o ? Jd(n, o) : new FormData(n);
                  Ic(
                    l,
                    {
                      pending: !0,
                      data: x,
                      method: n.method,
                      action: i
                    },
                    null,
                    x
                  );
                }
              } else
                typeof i == "function" && (m.preventDefault(), x = o ? Jd(n, o) : new FormData(n), Ic(
                  l,
                  {
                    pending: !0,
                    data: x,
                    method: n.method,
                    action: i
                  },
                  i,
                  x
                ));
            },
            currentTarget: n
          }
        ]
      });
    }
  }
  for (var Ds = 0; Ds < vc.length; Ds++) {
    var Us = vc[Ds], yv = Us.toLowerCase(), bv = Us[0].toUpperCase() + Us.slice(1);
    Gt(
      yv,
      "on" + bv
    );
  }
  Gt(Eo, "onAnimationEnd"), Gt(No, "onAnimationIteration"), Gt(To, "onAnimationStart"), Gt("dblclick", "onDoubleClick"), Gt("focusin", "onFocus"), Gt("focusout", "onBlur"), Gt(Up, "onTransitionRun"), Gt(Hp, "onTransitionStart"), Gt(Lp, "onTransitionCancel"), Gt(Ro, "onTransitionEnd"), va("onMouseEnter", ["mouseout", "mouseover"]), va("onMouseLeave", ["mouseout", "mouseover"]), va("onPointerEnter", ["pointerout", "pointerover"]), va("onPointerLeave", ["pointerout", "pointerover"]), Vl(
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
  var Yn = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), xv = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Yn)
  );
  function $d(e, t) {
    t = (t & 4) !== 0;
    for (var l = 0; l < e.length; l++) {
      var a = e[l], n = a.event;
      a = a.listeners;
      e: {
        var i = void 0;
        if (t)
          for (var o = a.length - 1; 0 <= o; o--) {
            var m = a[o], x = m.instance, z = m.currentTarget;
            if (m = m.listener, x !== i && n.isPropagationStopped())
              break e;
            i = m, n.currentTarget = z;
            try {
              i(n);
            } catch (w) {
              _i(w);
            }
            n.currentTarget = null, i = x;
          }
        else
          for (o = 0; o < a.length; o++) {
            if (m = a[o], x = m.instance, z = m.currentTarget, m = m.listener, x !== i && n.isPropagationStopped())
              break e;
            i = m, n.currentTarget = z;
            try {
              i(n);
            } catch (w) {
              _i(w);
            }
            n.currentTarget = null, i = x;
          }
      }
    }
  }
  function fe(e, t) {
    var l = t[Ju];
    l === void 0 && (l = t[Ju] = /* @__PURE__ */ new Set());
    var a = e + "__bubble";
    l.has(a) || (Fd(t, e, 2, !1), l.add(a));
  }
  function Hs(e, t, l) {
    var a = 0;
    t && (a |= 4), Fd(
      l,
      e,
      a,
      t
    );
  }
  var cu = "_reactListening" + Math.random().toString(36).slice(2);
  function Ls(e) {
    if (!e[cu]) {
      e[cu] = !0, kr.forEach(function(l) {
        l !== "selectionchange" && (xv.has(l) || Hs(l, !1, e), Hs(l, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[cu] || (t[cu] = !0, Hs("selectionchange", !1, t));
    }
  }
  function Fd(e, t, l, a) {
    switch (Nm(t)) {
      case 2:
        var n = Jv;
        break;
      case 8:
        n = $v;
        break;
      default:
        n = Ps;
    }
    l = n.bind(
      null,
      t,
      l,
      e
    ), n = void 0, !ac || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (n = !0), a ? n !== void 0 ? e.addEventListener(t, l, {
      capture: !0,
      passive: n
    }) : e.addEventListener(t, l, !0) : n !== void 0 ? e.addEventListener(t, l, {
      passive: n
    }) : e.addEventListener(t, l, !1);
  }
  function Bs(e, t, l, a, n) {
    var i = a;
    if ((t & 1) === 0 && (t & 2) === 0 && a !== null)
      e: for (; ; ) {
        if (a === null) return;
        var o = a.tag;
        if (o === 3 || o === 4) {
          var m = a.stateNode.containerInfo;
          if (m === n) break;
          if (o === 4)
            for (o = a.return; o !== null; ) {
              var x = o.tag;
              if ((x === 3 || x === 4) && o.stateNode.containerInfo === n)
                return;
              o = o.return;
            }
          for (; m !== null; ) {
            if (o = ma(m), o === null) return;
            if (x = o.tag, x === 5 || x === 6 || x === 26 || x === 27) {
              a = i = o;
              continue e;
            }
            m = m.parentNode;
          }
        }
        a = a.return;
      }
    Ir(function() {
      var z = i, w = tc(l), L = [];
      e: {
        var A = zo.get(e);
        if (A !== void 0) {
          var O = yi, K = e;
          switch (e) {
            case "keypress":
              if (vi(l) === 0) break e;
            case "keydown":
            case "keyup":
              O = mp;
              break;
            case "focusin":
              K = "focus", O = cc;
              break;
            case "focusout":
              K = "blur", O = cc;
              break;
            case "beforeblur":
            case "afterblur":
              O = cc;
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
              O = lo;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              O = tp;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              O = vp;
              break;
            case Eo:
            case No:
            case To:
              O = np;
              break;
            case Ro:
              O = yp;
              break;
            case "scroll":
            case "scrollend":
              O = Ih;
              break;
            case "wheel":
              O = xp;
              break;
            case "copy":
            case "cut":
            case "paste":
              O = up;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              O = no;
              break;
            case "toggle":
            case "beforetoggle":
              O = Sp;
          }
          var te = (t & 4) !== 0, Re = !te && (e === "scroll" || e === "scrollend"), N = te ? A !== null ? A + "Capture" : null : A;
          te = [];
          for (var S = z, R; S !== null; ) {
            var D = S;
            if (R = D.stateNode, D = D.tag, D !== 5 && D !== 26 && D !== 27 || R === null || N === null || (D = sn(S, N), D != null && te.push(
              kn(S, D, R)
            )), Re) break;
            S = S.return;
          }
          0 < te.length && (A = new O(
            A,
            K,
            null,
            l,
            w
          ), L.push({ event: A, listeners: te }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (A = e === "mouseover" || e === "pointerover", O = e === "mouseout" || e === "pointerout", A && l !== ec && (K = l.relatedTarget || l.fromElement) && (ma(K) || K[da]))
            break e;
          if ((O || A) && (A = w.window === w ? w : (A = w.ownerDocument) ? A.defaultView || A.parentWindow : window, O ? (K = l.relatedTarget || l.toElement, O = z, K = K ? ma(K) : null, K !== null && (Re = h(K), te = K.tag, K !== Re || te !== 5 && te !== 27 && te !== 6) && (K = null)) : (O = null, K = z), O !== K)) {
            if (te = lo, D = "onMouseLeave", N = "onMouseEnter", S = "mouse", (e === "pointerout" || e === "pointerover") && (te = no, D = "onPointerLeave", N = "onPointerEnter", S = "pointer"), Re = O == null ? A : cn(O), R = K == null ? A : cn(K), A = new te(
              D,
              S + "leave",
              O,
              l,
              w
            ), A.target = Re, A.relatedTarget = R, D = null, ma(w) === z && (te = new te(
              N,
              S + "enter",
              K,
              l,
              w
            ), te.target = R, te.relatedTarget = Re, D = te), Re = D, O && K)
              t: {
                for (te = _v, N = O, S = K, R = 0, D = N; D; D = te(D))
                  R++;
                D = 0;
                for (var W = S; W; W = te(W))
                  D++;
                for (; 0 < R - D; )
                  N = te(N), R--;
                for (; 0 < D - R; )
                  S = te(S), D--;
                for (; R--; ) {
                  if (N === S || S !== null && N === S.alternate) {
                    te = N;
                    break t;
                  }
                  N = te(N), S = te(S);
                }
                te = null;
              }
            else te = null;
            O !== null && Wd(
              L,
              A,
              O,
              te,
              !1
            ), K !== null && Re !== null && Wd(
              L,
              Re,
              K,
              te,
              !0
            );
          }
        }
        e: {
          if (A = z ? cn(z) : window, O = A.nodeName && A.nodeName.toLowerCase(), O === "select" || O === "input" && A.type === "file")
            var ye = mo;
          else if (oo(A))
            if (ho)
              ye = Op;
            else {
              ye = Cp;
              var $ = Ap;
            }
          else
            O = A.nodeName, !O || O.toLowerCase() !== "input" || A.type !== "checkbox" && A.type !== "radio" ? z && Iu(z.elementType) && (ye = mo) : ye = Mp;
          if (ye && (ye = ye(e, z))) {
            fo(
              L,
              ye,
              l,
              w
            );
            break e;
          }
          $ && $(e, A, z), e === "focusout" && z && A.type === "number" && z.memoizedProps.value != null && Pu(A, "number", A.value);
        }
        switch ($ = z ? cn(z) : window, e) {
          case "focusin":
            (oo($) || $.contentEditable === "true") && (Sa = $, mc = z, vn = null);
            break;
          case "focusout":
            vn = mc = Sa = null;
            break;
          case "mousedown":
            hc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            hc = !1, So(L, l, w);
            break;
          case "selectionchange":
            if (Dp) break;
          case "keydown":
          case "keyup":
            So(L, l, w);
        }
        var ue;
        if (rc)
          e: {
            switch (e) {
              case "compositionstart":
                var he = "onCompositionStart";
                break e;
              case "compositionend":
                he = "onCompositionEnd";
                break e;
              case "compositionupdate":
                he = "onCompositionUpdate";
                break e;
            }
            he = void 0;
          }
        else
          _a ? so(e, l) && (he = "onCompositionEnd") : e === "keydown" && l.keyCode === 229 && (he = "onCompositionStart");
        he && (io && l.locale !== "ko" && (_a || he !== "onCompositionStart" ? he === "onCompositionEnd" && _a && (ue = eo()) : (xl = w, nc = "value" in xl ? xl.value : xl.textContent, _a = !0)), $ = su(z, he), 0 < $.length && (he = new ao(
          he,
          e,
          null,
          l,
          w
        ), L.push({ event: he, listeners: $ }), ue ? he.data = ue : (ue = ro(l), ue !== null && (he.data = ue)))), (ue = Ep ? Np(e, l) : Tp(e, l)) && (he = su(z, "onBeforeInput"), 0 < he.length && ($ = new ao(
          "onBeforeInput",
          "beforeinput",
          null,
          l,
          w
        ), L.push({
          event: $,
          listeners: he
        }), $.data = ue)), gv(
          L,
          e,
          z,
          l,
          w
        );
      }
      $d(L, t);
    });
  }
  function kn(e, t, l) {
    return {
      instance: e,
      listener: t,
      currentTarget: l
    };
  }
  function su(e, t) {
    for (var l = t + "Capture", a = []; e !== null; ) {
      var n = e, i = n.stateNode;
      if (n = n.tag, n !== 5 && n !== 26 && n !== 27 || i === null || (n = sn(e, l), n != null && a.unshift(
        kn(e, n, i)
      ), n = sn(e, t), n != null && a.push(
        kn(e, n, i)
      )), e.tag === 3) return a;
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
  function Wd(e, t, l, a, n) {
    for (var i = t._reactName, o = []; l !== null && l !== a; ) {
      var m = l, x = m.alternate, z = m.stateNode;
      if (m = m.tag, x !== null && x === a) break;
      m !== 5 && m !== 26 && m !== 27 || z === null || (x = z, n ? (z = sn(l, i), z != null && o.unshift(
        kn(l, z, x)
      )) : n || (z = sn(l, i), z != null && o.push(
        kn(l, z, x)
      ))), l = l.return;
    }
    o.length !== 0 && e.push({ event: t, listeners: o });
  }
  var Sv = /\r\n?/g, jv = /\u0000|\uFFFD/g;
  function Pd(e) {
    return (typeof e == "string" ? e : "" + e).replace(Sv, `
`).replace(jv, "");
  }
  function Id(e, t) {
    return t = Pd(t), Pd(e) === t;
  }
  function Te(e, t, l, a, n, i) {
    switch (l) {
      case "children":
        typeof a == "string" ? t === "body" || t === "textarea" && a === "" || ya(e, a) : (typeof a == "number" || typeof a == "bigint") && t !== "body" && ya(e, "" + a);
        break;
      case "className":
        di(e, "class", a);
        break;
      case "tabIndex":
        di(e, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        di(e, l, a);
        break;
      case "style":
        Wr(e, a, i);
        break;
      case "data":
        if (t !== "object") {
          di(e, "data", a);
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
        a = hi("" + a), e.setAttribute(l, a);
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
          typeof i == "function" && (l === "formAction" ? (t !== "input" && Te(e, t, "name", n.name, n, null), Te(
            e,
            t,
            "formEncType",
            n.formEncType,
            n,
            null
          ), Te(
            e,
            t,
            "formMethod",
            n.formMethod,
            n,
            null
          ), Te(
            e,
            t,
            "formTarget",
            n.formTarget,
            n,
            null
          )) : (Te(e, t, "encType", n.encType, n, null), Te(e, t, "method", n.method, n, null), Te(e, t, "target", n.target, n, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(l);
          break;
        }
        a = hi("" + a), e.setAttribute(l, a);
        break;
      case "onClick":
        a != null && (e.onclick = el);
        break;
      case "onScroll":
        a != null && fe("scroll", e);
        break;
      case "onScrollEnd":
        a != null && fe("scrollend", e);
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
        l = hi("" + a), e.setAttributeNS(
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
        fe("beforetoggle", e), fe("toggle", e), fi(e, "popover", a);
        break;
      case "xlinkActuate":
        It(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        It(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        It(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        It(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        It(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        It(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        It(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        It(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        It(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        fi(e, "is", a);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < l.length) || l[0] !== "o" && l[0] !== "O" || l[1] !== "n" && l[1] !== "N") && (l = Wh.get(l) || l, fi(e, l, a));
    }
  }
  function qs(e, t, l, a, n, i) {
    switch (l) {
      case "style":
        Wr(e, a, i);
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
        typeof a == "string" ? ya(e, a) : (typeof a == "number" || typeof a == "bigint") && ya(e, "" + a);
        break;
      case "onScroll":
        a != null && fe("scroll", e);
        break;
      case "onScrollEnd":
        a != null && fe("scrollend", e);
        break;
      case "onClick":
        a != null && (e.onclick = el);
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
        if (!Gr.hasOwnProperty(l))
          e: {
            if (l[0] === "o" && l[1] === "n" && (n = l.endsWith("Capture"), t = l.slice(2, n ? l.length - 7 : void 0), i = e[ot] || null, i = i != null ? i[l] : null, typeof i == "function" && e.removeEventListener(t, i, n), typeof a == "function")) {
              typeof i != "function" && i !== null && (l in e ? e[l] = null : e.hasAttribute(l) && e.removeAttribute(l)), e.addEventListener(t, a, n);
              break e;
            }
            l in e ? e[l] = a : a === !0 ? e.setAttribute(l, "") : fi(e, l, a);
          }
    }
  }
  function at(e, t, l) {
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
        fe("error", e), fe("load", e);
        var a = !1, n = !1, i;
        for (i in l)
          if (l.hasOwnProperty(i)) {
            var o = l[i];
            if (o != null)
              switch (i) {
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
                  Te(e, t, i, o, l, null);
              }
          }
        n && Te(e, t, "srcSet", l.srcSet, l, null), a && Te(e, t, "src", l.src, l, null);
        return;
      case "input":
        fe("invalid", e);
        var m = i = o = n = null, x = null, z = null;
        for (a in l)
          if (l.hasOwnProperty(a)) {
            var w = l[a];
            if (w != null)
              switch (a) {
                case "name":
                  n = w;
                  break;
                case "type":
                  o = w;
                  break;
                case "checked":
                  x = w;
                  break;
                case "defaultChecked":
                  z = w;
                  break;
                case "value":
                  i = w;
                  break;
                case "defaultValue":
                  m = w;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (w != null)
                    throw Error(s(137, t));
                  break;
                default:
                  Te(e, t, a, w, l, null);
              }
          }
        Kr(
          e,
          i,
          m,
          x,
          z,
          o,
          n,
          !1
        );
        return;
      case "select":
        fe("invalid", e), a = o = i = null;
        for (n in l)
          if (l.hasOwnProperty(n) && (m = l[n], m != null))
            switch (n) {
              case "value":
                i = m;
                break;
              case "defaultValue":
                o = m;
                break;
              case "multiple":
                a = m;
              default:
                Te(e, t, n, m, l, null);
            }
        t = i, l = o, e.multiple = !!a, t != null ? ga(e, !!a, t, !1) : l != null && ga(e, !!a, l, !0);
        return;
      case "textarea":
        fe("invalid", e), i = n = a = null;
        for (o in l)
          if (l.hasOwnProperty(o) && (m = l[o], m != null))
            switch (o) {
              case "value":
                a = m;
                break;
              case "defaultValue":
                n = m;
                break;
              case "children":
                i = m;
                break;
              case "dangerouslySetInnerHTML":
                if (m != null) throw Error(s(91));
                break;
              default:
                Te(e, t, o, m, l, null);
            }
        $r(e, a, n, i);
        return;
      case "option":
        for (x in l)
          if (l.hasOwnProperty(x) && (a = l[x], a != null))
            switch (x) {
              case "selected":
                e.selected = a && typeof a != "function" && typeof a != "symbol";
                break;
              default:
                Te(e, t, x, a, l, null);
            }
        return;
      case "dialog":
        fe("beforetoggle", e), fe("toggle", e), fe("cancel", e), fe("close", e);
        break;
      case "iframe":
      case "object":
        fe("load", e);
        break;
      case "video":
      case "audio":
        for (a = 0; a < Yn.length; a++)
          fe(Yn[a], e);
        break;
      case "image":
        fe("error", e), fe("load", e);
        break;
      case "details":
        fe("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        fe("error", e), fe("load", e);
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
                Te(e, t, z, a, l, null);
            }
        return;
      default:
        if (Iu(t)) {
          for (w in l)
            l.hasOwnProperty(w) && (a = l[w], a !== void 0 && qs(
              e,
              t,
              w,
              a,
              l,
              void 0
            ));
          return;
        }
    }
    for (m in l)
      l.hasOwnProperty(m) && (a = l[m], a != null && Te(e, t, m, a, l, null));
  }
  function Ev(e, t, l, a) {
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
        var n = null, i = null, o = null, m = null, x = null, z = null, w = null;
        for (O in l) {
          var L = l[O];
          if (l.hasOwnProperty(O) && L != null)
            switch (O) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                x = L;
              default:
                a.hasOwnProperty(O) || Te(e, t, O, null, a, L);
            }
        }
        for (var A in a) {
          var O = a[A];
          if (L = l[A], a.hasOwnProperty(A) && (O != null || L != null))
            switch (A) {
              case "type":
                i = O;
                break;
              case "name":
                n = O;
                break;
              case "checked":
                z = O;
                break;
              case "defaultChecked":
                w = O;
                break;
              case "value":
                o = O;
                break;
              case "defaultValue":
                m = O;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (O != null)
                  throw Error(s(137, t));
                break;
              default:
                O !== L && Te(
                  e,
                  t,
                  A,
                  O,
                  a,
                  L
                );
            }
        }
        Wu(
          e,
          o,
          m,
          x,
          z,
          w,
          i,
          n
        );
        return;
      case "select":
        O = o = m = A = null;
        for (i in l)
          if (x = l[i], l.hasOwnProperty(i) && x != null)
            switch (i) {
              case "value":
                break;
              case "multiple":
                O = x;
              default:
                a.hasOwnProperty(i) || Te(
                  e,
                  t,
                  i,
                  null,
                  a,
                  x
                );
            }
        for (n in a)
          if (i = a[n], x = l[n], a.hasOwnProperty(n) && (i != null || x != null))
            switch (n) {
              case "value":
                A = i;
                break;
              case "defaultValue":
                m = i;
                break;
              case "multiple":
                o = i;
              default:
                i !== x && Te(
                  e,
                  t,
                  n,
                  i,
                  a,
                  x
                );
            }
        t = m, l = o, a = O, A != null ? ga(e, !!l, A, !1) : !!a != !!l && (t != null ? ga(e, !!l, t, !0) : ga(e, !!l, l ? [] : "", !1));
        return;
      case "textarea":
        O = A = null;
        for (m in l)
          if (n = l[m], l.hasOwnProperty(m) && n != null && !a.hasOwnProperty(m))
            switch (m) {
              case "value":
                break;
              case "children":
                break;
              default:
                Te(e, t, m, null, a, n);
            }
        for (o in a)
          if (n = a[o], i = l[o], a.hasOwnProperty(o) && (n != null || i != null))
            switch (o) {
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
                n !== i && Te(e, t, o, n, a, i);
            }
        Jr(e, A, O);
        return;
      case "option":
        for (var K in l)
          if (A = l[K], l.hasOwnProperty(K) && A != null && !a.hasOwnProperty(K))
            switch (K) {
              case "selected":
                e.selected = !1;
                break;
              default:
                Te(
                  e,
                  t,
                  K,
                  null,
                  a,
                  A
                );
            }
        for (x in a)
          if (A = a[x], O = l[x], a.hasOwnProperty(x) && A !== O && (A != null || O != null))
            switch (x) {
              case "selected":
                e.selected = A && typeof A != "function" && typeof A != "symbol";
                break;
              default:
                Te(
                  e,
                  t,
                  x,
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
        for (var te in l)
          A = l[te], l.hasOwnProperty(te) && A != null && !a.hasOwnProperty(te) && Te(e, t, te, null, a, A);
        for (z in a)
          if (A = a[z], O = l[z], a.hasOwnProperty(z) && A !== O && (A != null || O != null))
            switch (z) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (A != null)
                  throw Error(s(137, t));
                break;
              default:
                Te(
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
        if (Iu(t)) {
          for (var Re in l)
            A = l[Re], l.hasOwnProperty(Re) && A !== void 0 && !a.hasOwnProperty(Re) && qs(
              e,
              t,
              Re,
              void 0,
              a,
              A
            );
          for (w in a)
            A = a[w], O = l[w], !a.hasOwnProperty(w) || A === O || A === void 0 && O === void 0 || qs(
              e,
              t,
              w,
              A,
              a,
              O
            );
          return;
        }
    }
    for (var N in l)
      A = l[N], l.hasOwnProperty(N) && A != null && !a.hasOwnProperty(N) && Te(e, t, N, null, a, A);
    for (L in a)
      A = a[L], O = l[L], !a.hasOwnProperty(L) || A === O || A == null && O == null || Te(e, t, L, A, a, O);
  }
  function em(e) {
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
  function Nv() {
    if (typeof performance.getEntriesByType == "function") {
      for (var e = 0, t = 0, l = performance.getEntriesByType("resource"), a = 0; a < l.length; a++) {
        var n = l[a], i = n.transferSize, o = n.initiatorType, m = n.duration;
        if (i && m && em(o)) {
          for (o = 0, m = n.responseEnd, a += 1; a < l.length; a++) {
            var x = l[a], z = x.startTime;
            if (z > m) break;
            var w = x.transferSize, L = x.initiatorType;
            w && em(L) && (x = x.responseEnd, o += w * (x < m ? 1 : (m - z) / (x - z)));
          }
          if (--a, t += 8 * (i + o) / (n.duration / 1e3), e++, 10 < e) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
  }
  var Ys = null, ks = null;
  function ru(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function tm(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function lm(e, t) {
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
  function Gs(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Xs = null;
  function Tv() {
    var e = window.event;
    return e && e.type === "popstate" ? e === Xs ? !1 : (Xs = e, !0) : (Xs = null, !1);
  }
  var am = typeof setTimeout == "function" ? setTimeout : void 0, Rv = typeof clearTimeout == "function" ? clearTimeout : void 0, nm = typeof Promise == "function" ? Promise : void 0, zv = typeof queueMicrotask == "function" ? queueMicrotask : typeof nm < "u" ? function(e) {
    return nm.resolve(null).then(e).catch(Av);
  } : am;
  function Av(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Ll(e) {
    return e === "head";
  }
  function im(e, t) {
    var l = t, a = 0;
    do {
      var n = l.nextSibling;
      if (e.removeChild(l), n && n.nodeType === 8)
        if (l = n.data, l === "/$" || l === "/&") {
          if (a === 0) {
            e.removeChild(n), $a(t);
            return;
          }
          a--;
        } else if (l === "$" || l === "$?" || l === "$~" || l === "$!" || l === "&")
          a++;
        else if (l === "html")
          Gn(e.ownerDocument.documentElement);
        else if (l === "head") {
          l = e.ownerDocument.head, Gn(l);
          for (var i = l.firstChild; i; ) {
            var o = i.nextSibling, m = i.nodeName;
            i[un] || m === "SCRIPT" || m === "STYLE" || m === "LINK" && i.rel.toLowerCase() === "stylesheet" || l.removeChild(i), i = o;
          }
        } else
          l === "body" && Gn(e.ownerDocument.body);
      l = n;
    } while (l);
    $a(t);
  }
  function um(e, t) {
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
  function Qs(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var l = t;
      switch (t = t.nextSibling, l.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Qs(l), $u(l);
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
  function Cv(e, t, l, a) {
    for (; e.nodeType === 1; ) {
      var n = l;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!a && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (a) {
        if (!e[un])
          switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (i = e.getAttribute("rel"), i === "stylesheet" && e.hasAttribute("data-precedence"))
                break;
              if (i !== n.rel || e.getAttribute("href") !== (n.href == null || n.href === "" ? null : n.href) || e.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin) || e.getAttribute("title") !== (n.title == null ? null : n.title))
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (i = e.getAttribute("src"), (i !== (n.src == null ? null : n.src) || e.getAttribute("type") !== (n.type == null ? null : n.type) || e.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin)) && i && e.hasAttribute("async") && !e.hasAttribute("itemprop"))
                break;
              return e;
            default:
              return e;
          }
      } else if (t === "input" && e.type === "hidden") {
        var i = n.name == null ? null : "" + n.name;
        if (n.type === "hidden" && e.getAttribute("name") === i)
          return e;
      } else return e;
      if (e = Bt(e.nextSibling), e === null) break;
    }
    return null;
  }
  function Mv(e, t, l) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !l || (e = Bt(e.nextSibling), e === null)) return null;
    return e;
  }
  function cm(e, t) {
    for (; e.nodeType !== 8; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = Bt(e.nextSibling), e === null)) return null;
    return e;
  }
  function Zs(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function Vs(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
  }
  function Ov(e, t) {
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
  function Bt(e) {
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
  var Ks = null;
  function sm(e) {
    e = e.nextSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var l = e.data;
        if (l === "/$" || l === "/&") {
          if (t === 0)
            return Bt(e.nextSibling);
          t--;
        } else
          l !== "$" && l !== "$!" && l !== "$?" && l !== "$~" && l !== "&" || t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function rm(e) {
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
  function om(e, t, l) {
    switch (t = ru(l), e) {
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
  function Gn(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    $u(e);
  }
  var qt = /* @__PURE__ */ new Map(), fm = /* @__PURE__ */ new Set();
  function ou(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var vl = q.d;
  q.d = {
    f: wv,
    r: Dv,
    D: Uv,
    C: Hv,
    L: Lv,
    m: Bv,
    X: Yv,
    S: qv,
    M: kv
  };
  function wv() {
    var e = vl.f(), t = tu();
    return e || t;
  }
  function Dv(e) {
    var t = ha(e);
    t !== null && t.tag === 5 && t.type === "form" ? zf(t) : vl.r(e);
  }
  var Va = typeof document > "u" ? null : document;
  function dm(e, t, l) {
    var a = Va;
    if (a && typeof t == "string" && t) {
      var n = Mt(t);
      n = 'link[rel="' + e + '"][href="' + n + '"]', typeof l == "string" && (n += '[crossorigin="' + l + '"]'), fm.has(n) || (fm.add(n), e = { rel: e, crossOrigin: l, href: t }, a.querySelector(n) === null && (t = a.createElement("link"), at(t, "link", e), We(t), a.head.appendChild(t)));
    }
  }
  function Uv(e) {
    vl.D(e), dm("dns-prefetch", e, null);
  }
  function Hv(e, t) {
    vl.C(e, t), dm("preconnect", e, t);
  }
  function Lv(e, t, l) {
    vl.L(e, t, l);
    var a = Va;
    if (a && e && t) {
      var n = 'link[rel="preload"][as="' + Mt(t) + '"]';
      t === "image" && l && l.imageSrcSet ? (n += '[imagesrcset="' + Mt(
        l.imageSrcSet
      ) + '"]', typeof l.imageSizes == "string" && (n += '[imagesizes="' + Mt(
        l.imageSizes
      ) + '"]')) : n += '[href="' + Mt(e) + '"]';
      var i = n;
      switch (t) {
        case "style":
          i = Ka(e);
          break;
        case "script":
          i = Ja(e);
      }
      qt.has(i) || (e = _(
        {
          rel: "preload",
          href: t === "image" && l && l.imageSrcSet ? void 0 : e,
          as: t
        },
        l
      ), qt.set(i, e), a.querySelector(n) !== null || t === "style" && a.querySelector(Xn(i)) || t === "script" && a.querySelector(Qn(i)) || (t = a.createElement("link"), at(t, "link", e), We(t), a.head.appendChild(t)));
    }
  }
  function Bv(e, t) {
    vl.m(e, t);
    var l = Va;
    if (l && e) {
      var a = t && typeof t.as == "string" ? t.as : "script", n = 'link[rel="modulepreload"][as="' + Mt(a) + '"][href="' + Mt(e) + '"]', i = n;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          i = Ja(e);
      }
      if (!qt.has(i) && (e = _({ rel: "modulepreload", href: e }, t), qt.set(i, e), l.querySelector(n) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (l.querySelector(Qn(i)))
              return;
        }
        a = l.createElement("link"), at(a, "link", e), We(a), l.head.appendChild(a);
      }
    }
  }
  function qv(e, t, l) {
    vl.S(e, t, l);
    var a = Va;
    if (a && e) {
      var n = pa(a).hoistableStyles, i = Ka(e);
      t = t || "default";
      var o = n.get(i);
      if (!o) {
        var m = { loading: 0, preload: null };
        if (o = a.querySelector(
          Xn(i)
        ))
          m.loading = 5;
        else {
          e = _(
            { rel: "stylesheet", href: e, "data-precedence": t },
            l
          ), (l = qt.get(i)) && Js(e, l);
          var x = o = a.createElement("link");
          We(x), at(x, "link", e), x._p = new Promise(function(z, w) {
            x.onload = z, x.onerror = w;
          }), x.addEventListener("load", function() {
            m.loading |= 1;
          }), x.addEventListener("error", function() {
            m.loading |= 2;
          }), m.loading |= 4, fu(o, t, a);
        }
        o = {
          type: "stylesheet",
          instance: o,
          count: 1,
          state: m
        }, n.set(i, o);
      }
    }
  }
  function Yv(e, t) {
    vl.X(e, t);
    var l = Va;
    if (l && e) {
      var a = pa(l).hoistableScripts, n = Ja(e), i = a.get(n);
      i || (i = l.querySelector(Qn(n)), i || (e = _({ src: e, async: !0 }, t), (t = qt.get(n)) && $s(e, t), i = l.createElement("script"), We(i), at(i, "link", e), l.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, a.set(n, i));
    }
  }
  function kv(e, t) {
    vl.M(e, t);
    var l = Va;
    if (l && e) {
      var a = pa(l).hoistableScripts, n = Ja(e), i = a.get(n);
      i || (i = l.querySelector(Qn(n)), i || (e = _({ src: e, async: !0, type: "module" }, t), (t = qt.get(n)) && $s(e, t), i = l.createElement("script"), We(i), at(i, "link", e), l.head.appendChild(i)), i = {
        type: "script",
        instance: i,
        count: 1,
        state: null
      }, a.set(n, i));
    }
  }
  function mm(e, t, l, a) {
    var n = (n = re.current) ? ou(n) : null;
    if (!n) throw Error(s(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof l.precedence == "string" && typeof l.href == "string" ? (t = Ka(l.href), l = pa(
          n
        ).hoistableStyles, a = l.get(t), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, l.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (l.rel === "stylesheet" && typeof l.href == "string" && typeof l.precedence == "string") {
          e = Ka(l.href);
          var i = pa(
            n
          ).hoistableStyles, o = i.get(e);
          if (o || (n = n.ownerDocument || n, o = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, i.set(e, o), (i = n.querySelector(
            Xn(e)
          )) && !i._p && (o.instance = i, o.state.loading = 5), qt.has(e) || (l = {
            rel: "preload",
            as: "style",
            href: l.href,
            crossOrigin: l.crossOrigin,
            integrity: l.integrity,
            media: l.media,
            hrefLang: l.hrefLang,
            referrerPolicy: l.referrerPolicy
          }, qt.set(e, l), i || Gv(
            n,
            e,
            l,
            o.state
          ))), t && a === null)
            throw Error(s(528, ""));
          return o;
        }
        if (t && a !== null)
          throw Error(s(529, ""));
        return null;
      case "script":
        return t = l.async, l = l.src, typeof l == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Ja(l), l = pa(
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
  function Ka(e) {
    return 'href="' + Mt(e) + '"';
  }
  function Xn(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function hm(e) {
    return _({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function Gv(e, t, l, a) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? a.loading = 1 : (t = e.createElement("link"), a.preload = t, t.addEventListener("load", function() {
      return a.loading |= 1;
    }), t.addEventListener("error", function() {
      return a.loading |= 2;
    }), at(t, "link", l), We(t), e.head.appendChild(t));
  }
  function Ja(e) {
    return '[src="' + Mt(e) + '"]';
  }
  function Qn(e) {
    return "script[async]" + e;
  }
  function pm(e, t, l) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var a = e.querySelector(
            'style[data-href~="' + Mt(l.href) + '"]'
          );
          if (a)
            return t.instance = a, We(a), a;
          var n = _({}, l, {
            "data-href": l.href,
            "data-precedence": l.precedence,
            href: null,
            precedence: null
          });
          return a = (e.ownerDocument || e).createElement(
            "style"
          ), We(a), at(a, "style", n), fu(a, l.precedence, e), t.instance = a;
        case "stylesheet":
          n = Ka(l.href);
          var i = e.querySelector(
            Xn(n)
          );
          if (i)
            return t.state.loading |= 4, t.instance = i, We(i), i;
          a = hm(l), (n = qt.get(n)) && Js(a, n), i = (e.ownerDocument || e).createElement("link"), We(i);
          var o = i;
          return o._p = new Promise(function(m, x) {
            o.onload = m, o.onerror = x;
          }), at(i, "link", a), t.state.loading |= 4, fu(i, l.precedence, e), t.instance = i;
        case "script":
          return i = Ja(l.src), (n = e.querySelector(
            Qn(i)
          )) ? (t.instance = n, We(n), n) : (a = l, (n = qt.get(i)) && (a = _({}, l), $s(a, n)), e = e.ownerDocument || e, n = e.createElement("script"), We(n), at(n, "link", a), e.head.appendChild(n), t.instance = n);
        case "void":
          return null;
        default:
          throw Error(s(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (a = t.instance, t.state.loading |= 4, fu(a, l.precedence, e));
    return t.instance;
  }
  function fu(e, t, l) {
    for (var a = l.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), n = a.length ? a[a.length - 1] : null, i = n, o = 0; o < a.length; o++) {
      var m = a[o];
      if (m.dataset.precedence === t) i = m;
      else if (i !== n) break;
    }
    i ? i.parentNode.insertBefore(e, i.nextSibling) : (t = l.nodeType === 9 ? l.head : l, t.insertBefore(e, t.firstChild));
  }
  function Js(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function $s(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var du = null;
  function vm(e, t, l) {
    if (du === null) {
      var a = /* @__PURE__ */ new Map(), n = du = /* @__PURE__ */ new Map();
      n.set(l, a);
    } else
      n = du, a = n.get(l), a || (a = /* @__PURE__ */ new Map(), n.set(l, a));
    if (a.has(e)) return a;
    for (a.set(e, null), l = l.getElementsByTagName(e), n = 0; n < l.length; n++) {
      var i = l[n];
      if (!(i[un] || i[Ie] || e === "link" && i.getAttribute("rel") === "stylesheet") && i.namespaceURI !== "http://www.w3.org/2000/svg") {
        var o = i.getAttribute(t) || "";
        o = e + o;
        var m = a.get(o);
        m ? m.push(i) : a.set(o, [i]);
      }
    }
    return a;
  }
  function gm(e, t, l) {
    e = e.ownerDocument || e, e.head.insertBefore(
      l,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function Xv(e, t, l) {
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
  function ym(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function Qv(e, t, l, a) {
    if (l.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && (l.state.loading & 4) === 0) {
      if (l.instance === null) {
        var n = Ka(a.href), i = t.querySelector(
          Xn(n)
        );
        if (i) {
          t = i._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = mu.bind(e), t.then(e, e)), l.state.loading |= 4, l.instance = i, We(i);
          return;
        }
        i = t.ownerDocument || t, a = hm(a), (n = qt.get(n)) && Js(a, n), i = i.createElement("link"), We(i);
        var o = i;
        o._p = new Promise(function(m, x) {
          o.onload = m, o.onerror = x;
        }), at(i, "link", a), l.instance = i;
      }
      e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(l, t), (t = l.state.preload) && (l.state.loading & 3) === 0 && (e.count++, l = mu.bind(e), t.addEventListener("load", l), t.addEventListener("error", l));
    }
  }
  var Fs = 0;
  function Zv(e, t) {
    return e.stylesheets && e.count === 0 && pu(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(l) {
      var a = setTimeout(function() {
        if (e.stylesheets && pu(e, e.stylesheets), e.unsuspend) {
          var i = e.unsuspend;
          e.unsuspend = null, i();
        }
      }, 6e4 + t);
      0 < e.imgBytes && Fs === 0 && (Fs = 62500 * Nv());
      var n = setTimeout(
        function() {
          if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && pu(e, e.stylesheets), e.unsuspend)) {
            var i = e.unsuspend;
            e.unsuspend = null, i();
          }
        },
        (e.imgBytes > Fs ? 50 : 800) + t
      );
      return e.unsuspend = l, function() {
        e.unsuspend = null, clearTimeout(a), clearTimeout(n);
      };
    } : null;
  }
  function mu() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) pu(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var hu = null;
  function pu(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, hu = /* @__PURE__ */ new Map(), t.forEach(Vv, e), hu = null, mu.call(e));
  }
  function Vv(e, t) {
    if (!(t.state.loading & 4)) {
      var l = hu.get(e);
      if (l) var a = l.get(null);
      else {
        l = /* @__PURE__ */ new Map(), hu.set(e, l);
        for (var n = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), i = 0; i < n.length; i++) {
          var o = n[i];
          (o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (l.set(o.dataset.precedence, o), a = o);
        }
        a && l.set(null, a);
      }
      n = t.instance, o = n.getAttribute("data-precedence"), i = l.get(o) || a, i === a && l.set(null, n), l.set(o, n), this.count++, a = mu.bind(this), n.addEventListener("load", a), n.addEventListener("error", a), i ? i.parentNode.insertBefore(n, i.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(n, e.firstChild)), t.state.loading |= 4;
    }
  }
  var Zn = {
    $$typeof: B,
    Provider: null,
    Consumer: null,
    _currentValue: Z,
    _currentValue2: Z,
    _threadCount: 0
  };
  function Kv(e, t, l, a, n, i, o, m, x) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Zu(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Zu(0), this.hiddenUpdates = Zu(null), this.identifierPrefix = a, this.onUncaughtError = n, this.onCaughtError = i, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = x, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function bm(e, t, l, a, n, i, o, m, x, z, w, L) {
    return e = new Kv(
      e,
      t,
      l,
      o,
      x,
      z,
      w,
      L,
      m
    ), t = 1, i === !0 && (t |= 24), i = St(3, null, null, t), e.current = i, i.stateNode = e, t = Ac(), t.refCount++, e.pooledCache = t, t.refCount++, i.memoizedState = {
      element: a,
      isDehydrated: l,
      cache: t
    }, wc(i), e;
  }
  function xm(e) {
    return e ? (e = Na, e) : Na;
  }
  function _m(e, t, l, a, n, i) {
    n = xm(n), a.context === null ? a.context = n : a.pendingContext = n, a = Tl(t), a.payload = { element: l }, i = i === void 0 ? null : i, i !== null && (a.callback = i), l = Rl(e, a, t), l !== null && (vt(l, e, t), jn(l, e, t));
  }
  function Sm(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var l = e.retryLane;
      e.retryLane = l !== 0 && l < t ? l : t;
    }
  }
  function Ws(e, t) {
    Sm(e, t), (e = e.alternate) && Sm(e, t);
  }
  function jm(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Fl(e, 67108864);
      t !== null && vt(t, e, 67108864), Ws(e, 67108864);
    }
  }
  function Em(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Rt();
      t = Vu(t);
      var l = Fl(e, t);
      l !== null && vt(l, e, t), Ws(e, t);
    }
  }
  var vu = !0;
  function Jv(e, t, l, a) {
    var n = M.T;
    M.T = null;
    var i = q.p;
    try {
      q.p = 2, Ps(e, t, l, a);
    } finally {
      q.p = i, M.T = n;
    }
  }
  function $v(e, t, l, a) {
    var n = M.T;
    M.T = null;
    var i = q.p;
    try {
      q.p = 8, Ps(e, t, l, a);
    } finally {
      q.p = i, M.T = n;
    }
  }
  function Ps(e, t, l, a) {
    if (vu) {
      var n = Is(a);
      if (n === null)
        Bs(
          e,
          t,
          a,
          gu,
          l
        ), Tm(e, a);
      else if (Wv(
        n,
        e,
        t,
        l,
        a
      ))
        a.stopPropagation();
      else if (Tm(e, a), t & 4 && -1 < Fv.indexOf(e)) {
        for (; n !== null; ) {
          var i = ha(n);
          if (i !== null)
            switch (i.tag) {
              case 3:
                if (i = i.stateNode, i.current.memoizedState.isDehydrated) {
                  var o = Zl(i.pendingLanes);
                  if (o !== 0) {
                    var m = i;
                    for (m.pendingLanes |= 2, m.entangledLanes |= 2; o; ) {
                      var x = 1 << 31 - xt(o);
                      m.entanglements[1] |= x, o &= ~x;
                    }
                    Wt(i), (_e & 6) === 0 && (Ii = yt() + 500, qn(0));
                  }
                }
                break;
              case 31:
              case 13:
                m = Fl(i, 2), m !== null && vt(m, i, 2), tu(), Ws(i, 2);
            }
          if (i = Is(a), i === null && Bs(
            e,
            t,
            a,
            gu,
            l
          ), i === n) break;
          n = i;
        }
        n !== null && a.stopPropagation();
      } else
        Bs(
          e,
          t,
          a,
          null,
          l
        );
    }
  }
  function Is(e) {
    return e = tc(e), er(e);
  }
  var gu = null;
  function er(e) {
    if (gu = null, e = ma(e), e !== null) {
      var t = h(e);
      if (t === null) e = null;
      else {
        var l = t.tag;
        if (l === 13) {
          if (e = y(t), e !== null) return e;
          e = null;
        } else if (l === 31) {
          if (e = g(t), e !== null) return e;
          e = null;
        } else if (l === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return gu = e, null;
  }
  function Nm(e) {
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
        switch (Uh()) {
          case Mr:
            return 2;
          case Or:
            return 8;
          case ui:
          case Hh:
            return 32;
          case wr:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var tr = !1, Bl = null, ql = null, Yl = null, Vn = /* @__PURE__ */ new Map(), Kn = /* @__PURE__ */ new Map(), kl = [], Fv = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function Tm(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Bl = null;
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
        Vn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Kn.delete(t.pointerId);
    }
  }
  function Jn(e, t, l, a, n, i) {
    return e === null || e.nativeEvent !== i ? (e = {
      blockedOn: t,
      domEventName: l,
      eventSystemFlags: a,
      nativeEvent: i,
      targetContainers: [n]
    }, t !== null && (t = ha(t), t !== null && jm(t)), e) : (e.eventSystemFlags |= a, t = e.targetContainers, n !== null && t.indexOf(n) === -1 && t.push(n), e);
  }
  function Wv(e, t, l, a, n) {
    switch (t) {
      case "focusin":
        return Bl = Jn(
          Bl,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "dragenter":
        return ql = Jn(
          ql,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "mouseover":
        return Yl = Jn(
          Yl,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "pointerover":
        var i = n.pointerId;
        return Vn.set(
          i,
          Jn(
            Vn.get(i) || null,
            e,
            t,
            l,
            a,
            n
          )
        ), !0;
      case "gotpointercapture":
        return i = n.pointerId, Kn.set(
          i,
          Jn(
            Kn.get(i) || null,
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
  function Rm(e) {
    var t = ma(e.target);
    if (t !== null) {
      var l = h(t);
      if (l !== null) {
        if (t = l.tag, t === 13) {
          if (t = y(l), t !== null) {
            e.blockedOn = t, qr(e.priority, function() {
              Em(l);
            });
            return;
          }
        } else if (t === 31) {
          if (t = g(l), t !== null) {
            e.blockedOn = t, qr(e.priority, function() {
              Em(l);
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
  function yu(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var l = Is(e.nativeEvent);
      if (l === null) {
        l = e.nativeEvent;
        var a = new l.constructor(
          l.type,
          l
        );
        ec = a, l.target.dispatchEvent(a), ec = null;
      } else
        return t = ha(l), t !== null && jm(t), e.blockedOn = l, !1;
      t.shift();
    }
    return !0;
  }
  function zm(e, t, l) {
    yu(e) && l.delete(t);
  }
  function Pv() {
    tr = !1, Bl !== null && yu(Bl) && (Bl = null), ql !== null && yu(ql) && (ql = null), Yl !== null && yu(Yl) && (Yl = null), Vn.forEach(zm), Kn.forEach(zm);
  }
  function bu(e, t) {
    e.blockedOn === t && (e.blockedOn = null, tr || (tr = !0, u.unstable_scheduleCallback(
      u.unstable_NormalPriority,
      Pv
    )));
  }
  var xu = null;
  function Am(e) {
    xu !== e && (xu = e, u.unstable_scheduleCallback(
      u.unstable_NormalPriority,
      function() {
        xu === e && (xu = null);
        for (var t = 0; t < e.length; t += 3) {
          var l = e[t], a = e[t + 1], n = e[t + 2];
          if (typeof a != "function") {
            if (er(a || l) === null)
              continue;
            break;
          }
          var i = ha(l);
          i !== null && (e.splice(t, 3), t -= 3, Ic(
            i,
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
  function $a(e) {
    function t(x) {
      return bu(x, e);
    }
    Bl !== null && bu(Bl, e), ql !== null && bu(ql, e), Yl !== null && bu(Yl, e), Vn.forEach(t), Kn.forEach(t);
    for (var l = 0; l < kl.length; l++) {
      var a = kl[l];
      a.blockedOn === e && (a.blockedOn = null);
    }
    for (; 0 < kl.length && (l = kl[0], l.blockedOn === null); )
      Rm(l), l.blockedOn === null && kl.shift();
    if (l = (e.ownerDocument || e).$$reactFormReplay, l != null)
      for (a = 0; a < l.length; a += 3) {
        var n = l[a], i = l[a + 1], o = n[ot] || null;
        if (typeof i == "function")
          o || Am(l);
        else if (o) {
          var m = null;
          if (i && i.hasAttribute("formAction")) {
            if (n = i, o = i[ot] || null)
              m = o.formAction;
            else if (er(n) !== null) continue;
          } else m = o.action;
          typeof m == "function" ? l[a + 1] = m : (l.splice(a, 3), a -= 3), Am(l);
        }
      }
  }
  function Cm() {
    function e(i) {
      i.canIntercept && i.info === "react-transition" && i.intercept({
        handler: function() {
          return new Promise(function(o) {
            return n = o;
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
        var i = navigation.currentEntry;
        i && i.url != null && navigation.navigate(i.url, {
          state: i.getState(),
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
  function lr(e) {
    this._internalRoot = e;
  }
  _u.prototype.render = lr.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(s(409));
    var l = t.current, a = Rt();
    _m(l, a, e, t, null, null);
  }, _u.prototype.unmount = lr.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      _m(e.current, 2, null, e, null, null), tu(), t[da] = null;
    }
  };
  function _u(e) {
    this._internalRoot = e;
  }
  _u.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Br();
      e = { blockedOn: null, target: e, priority: t };
      for (var l = 0; l < kl.length && t !== 0 && t < kl[l].priority; l++) ;
      kl.splice(l, 0, e), l === 0 && Rm(e);
    }
  };
  var Mm = r.version;
  if (Mm !== "19.2.8")
    throw Error(
      s(
        527,
        Mm,
        "19.2.8"
      )
    );
  q.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(s(188)) : (e = Object.keys(e).join(","), Error(s(268, e)));
    return e = p(t), e = e !== null ? b(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var Iv = {
    bundleType: 0,
    version: "19.2.8",
    rendererPackageName: "react-dom",
    currentDispatcherRef: M,
    reconcilerVersion: "19.2.8"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Su = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Su.isDisabled && Su.supportsFiber)
      try {
        ln = Su.inject(
          Iv
        ), bt = Su;
      } catch {
      }
  }
  return Fn.createRoot = function(e, t) {
    if (!d(e)) throw Error(s(299));
    var l = !1, a = "", n = Bf, i = qf, o = Yf;
    return t != null && (t.unstable_strictMode === !0 && (l = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (n = t.onUncaughtError), t.onCaughtError !== void 0 && (i = t.onCaughtError), t.onRecoverableError !== void 0 && (o = t.onRecoverableError)), t = bm(
      e,
      1,
      !1,
      null,
      null,
      l,
      a,
      null,
      n,
      i,
      o,
      Cm
    ), e[da] = t.current, Ls(e), new lr(t);
  }, Fn.hydrateRoot = function(e, t, l) {
    if (!d(e)) throw Error(s(299));
    var a = !1, n = "", i = Bf, o = qf, m = Yf, x = null;
    return l != null && (l.unstable_strictMode === !0 && (a = !0), l.identifierPrefix !== void 0 && (n = l.identifierPrefix), l.onUncaughtError !== void 0 && (i = l.onUncaughtError), l.onCaughtError !== void 0 && (o = l.onCaughtError), l.onRecoverableError !== void 0 && (m = l.onRecoverableError), l.formState !== void 0 && (x = l.formState)), t = bm(
      e,
      1,
      !0,
      t,
      l ?? null,
      a,
      n,
      x,
      i,
      o,
      m,
      Cm
    ), t.context = xm(null), l = t.current, a = Rt(), a = Vu(a), n = Tl(a), n.callback = null, Rl(l, n, a), l = a, t.current.lanes = l, nn(t, l), Wt(t), e[da] = t.current, Ls(e), new _u(t);
  }, Fn.version = "19.2.8", Fn;
}
var km;
function fg() {
  if (km) return ir.exports;
  km = 1;
  function u() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u);
      } catch (r) {
        console.error(r);
      }
  }
  return u(), ir.exports = og(), ir.exports;
}
var dg = fg();
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
var vr = /^(?:[a-z][a-z0-9+.-]*:|[\\/]{2})/i, ih = /^[\\/]{2}/;
function mg(u, r) {
  return r + u.replace(/\\/g, "/");
}
var Gm = "popstate";
function Xm(u) {
  return typeof u == "object" && u != null && "pathname" in u && "search" in u && "hash" in u && "state" in u && "key" in u;
}
function hg(u = {}) {
  function r(d, h) {
    let {
      pathname: y = "/",
      search: g = "",
      hash: v = ""
    } = fa(d.location.hash.substring(1));
    return !y.startsWith("/") && !y.startsWith(".") && (y = "/" + y), dr(
      "",
      { pathname: y, search: g, hash: v },
      // state defaults to `null` because `window.history.state` does
      h.state && h.state.usr || null,
      h.state && h.state.key || "default"
    );
  }
  function f(d, h) {
    let y = d.document.querySelector("base"), g = "";
    if (y && y.getAttribute("href")) {
      let v = d.location.href, p = v.indexOf("#");
      g = p === -1 ? v : v.slice(0, p);
    }
    return g + "#" + (typeof h == "string" ? h : ti(h));
  }
  function s(d, h) {
    zt(
      d.pathname.charAt(0) === "/",
      `relative pathnames are not supported in hash history.push(${JSON.stringify(
        h
      )})`
    );
  }
  return vg(
    r,
    f,
    s,
    u
  );
}
function He(u, r) {
  if (u === !1 || u === null || typeof u > "u")
    throw new Error(r);
}
function zt(u, r) {
  if (!u) {
    typeof console < "u" && console.warn(r);
    try {
      throw new Error(r);
    } catch {
    }
  }
}
function pg() {
  return Math.random().toString(36).substring(2, 10);
}
function Qm(u, r) {
  return {
    usr: u.state,
    key: u.key,
    idx: r,
    masked: u.mask ? {
      pathname: u.pathname,
      search: u.search,
      hash: u.hash
    } : void 0
  };
}
function dr(u, r, f = null, s, d) {
  return {
    pathname: typeof u == "string" ? u : u.pathname,
    search: "",
    hash: "",
    ...typeof r == "string" ? fa(r) : r,
    state: f,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: r && r.key || s || pg(),
    mask: d
  };
}
function ti({
  pathname: u = "/",
  search: r = "",
  hash: f = ""
}) {
  return r && r !== "?" && (u += r.charAt(0) === "?" ? r : "?" + r), f && f !== "#" && (u += f.charAt(0) === "#" ? f : "#" + f), u;
}
function fa(u) {
  let r = {};
  if (u) {
    let f = u.indexOf("#");
    f >= 0 && (r.hash = u.substring(f), u = u.substring(0, f));
    let s = u.indexOf("?");
    s >= 0 && (r.search = u.substring(s), u = u.substring(0, s)), u && (r.pathname = u);
  }
  return r;
}
function vg(u, r, f, s = {}) {
  let { window: d = document.defaultView, v5Compat: h = !1 } = s, y = d.history, g = "POP", v = null, p = b();
  p == null && (p = 0, y.replaceState({ ...y.state, idx: p }, ""));
  function b() {
    return (y.state || { idx: null }).idx;
  }
  function _() {
    g = "POP";
    let U = b(), X = U == null ? null : U - p;
    p = U, v && v({ action: g, location: k.location, delta: X });
  }
  function T(U, X) {
    g = "PUSH";
    let V = Xm(U) ? U : dr(k.location, U, X);
    f && f(V, U), p = b() + 1;
    let B = Qm(V, p), le = k.createHref(V.mask || V);
    try {
      y.pushState(B, "", le);
    } catch (ce) {
      if (ce instanceof DOMException && ce.name === "DataCloneError")
        throw ce;
      d.location.assign(le);
    }
    h && v && v({ action: g, location: k.location, delta: 1 });
  }
  function Y(U, X) {
    g = "REPLACE";
    let V = Xm(U) ? U : dr(k.location, U, X);
    f && f(V, U), p = b();
    let B = Qm(V, p), le = k.createHref(V.mask || V);
    y.replaceState(B, "", le), h && v && v({ action: g, location: k.location, delta: 0 });
  }
  function G(U) {
    return gg(d, U);
  }
  let k = {
    get action() {
      return g;
    },
    get location() {
      return u(d, y);
    },
    listen(U) {
      if (v)
        throw new Error("A history only accepts one active listener");
      return d.addEventListener(Gm, _), v = U, () => {
        d.removeEventListener(Gm, _), v = null;
      };
    },
    createHref(U) {
      return r(d, U);
    },
    createURL: G,
    encodeLocation(U) {
      let X = G(U);
      return {
        pathname: X.pathname,
        search: X.search,
        hash: X.hash
      };
    },
    push: T,
    replace: Y,
    go(U) {
      return y.go(U);
    }
  };
  return k;
}
function gg(u, r, f = !1) {
  let s = "http://localhost";
  u && (s = u.location.origin !== "null" ? u.location.origin : u.location.href), He(s, "No window.location.(origin|href) available to create URL");
  let d = typeof r == "string" ? r : ti(r);
  return d = d.replace(/ $/, "%20"), !f && ih.test(d) && (d = s + d), new URL(d, s);
}
function uh(u, r, f = "/") {
  return yg(u, r, f, !1);
}
function yg(u, r, f, s, d) {
  let h = typeof r == "string" ? fa(r) : r, y = gl(h.pathname || "/", f);
  if (y == null)
    return null;
  let g = bg(u), v = null, p = Cg(y);
  for (let b = 0; v == null && b < g.length; ++b)
    v = Ag(
      g[b],
      p,
      s
    );
  return v;
}
function bg(u) {
  let r = ch(u);
  return xg(r), r;
}
function ch(u, r = [], f = [], s = "", d = !1) {
  let h = (y, g, v = d, p) => {
    let b = {
      relativePath: p === void 0 ? y.path || "" : p,
      caseSensitive: y.caseSensitive === !0,
      childrenIndex: g,
      route: y
    };
    if (b.relativePath.startsWith("/")) {
      if (!b.relativePath.startsWith(s) && v)
        return;
      He(
        b.relativePath.startsWith(s),
        `Absolute route path "${b.relativePath}" nested under path "${s}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
      ), b.relativePath = b.relativePath.slice(s.length);
    }
    let _ = Zt([s, b.relativePath]), T = f.concat(b);
    y.children && y.children.length > 0 && (He(
      // Our types know better, but runtime JS may not!
      // @ts-expect-error
      y.index !== !0,
      `Index routes must not have child routes. Please remove all child routes from route path "${_}".`
    ), ch(
      y.children,
      r,
      T,
      _,
      v
    )), !(y.path == null && !y.index) && r.push({
      path: _,
      score: Rg(_, y.index),
      routesMeta: T.map((Y, G) => {
        let [k, U] = oh(
          Y.relativePath,
          Y.caseSensitive,
          G === T.length - 1
        );
        return {
          ...Y,
          matcher: k,
          compiledParams: U
        };
      })
    });
  };
  return u.forEach((y, g) => {
    if (y.path === "" || !y.path?.includes("?"))
      h(y, g);
    else
      for (let v of sh(y.path))
        h(y, g, !0, v);
  }), r;
}
function sh(u) {
  let r = u.split("/");
  if (r.length === 0) return [];
  let [f, ...s] = r, d = f.endsWith("?"), h = f.replace(/\?$/, "");
  if (s.length === 0)
    return d ? [h, ""] : [h];
  let y = sh(s.join("/")), g = [];
  return g.push(
    ...y.map(
      (v) => v === "" ? h : [h, v].join("/")
    )
  ), d && g.push(...y), g.map(
    (v) => u.startsWith("/") && v === "" ? "/" : v
  );
}
function xg(u) {
  u.sort(
    (r, f) => r.score !== f.score ? f.score - r.score : zg(
      r.routesMeta.map((s) => s.childrenIndex),
      f.routesMeta.map((s) => s.childrenIndex)
    )
  );
}
var _g = /^:[\w-]+$/, Sg = 3, jg = 2, Eg = 1, Ng = 10, Tg = -2, Zm = (u) => u === "*";
function Rg(u, r) {
  let f = u.split("/"), s = f.length;
  return f.some(Zm) && (s += Tg), r && (s += jg), f.filter((d) => !Zm(d)).reduce(
    (d, h) => d + (_g.test(h) ? Sg : h === "" ? Eg : Ng),
    s
  );
}
function zg(u, r) {
  return u.length === r.length && u.slice(0, -1).every((s, d) => s === r[d]) ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    u[u.length - 1] - r[r.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function Ag(u, r, f = !1) {
  let { routesMeta: s } = u, d = {}, h = "/", y = [];
  for (let g = 0; g < s.length; ++g) {
    let v = s[g], p = g === s.length - 1, b = h === "/" ? r : r.slice(h.length) || "/", _ = {
      path: v.relativePath,
      caseSensitive: v.caseSensitive,
      end: p
    }, T = (
      // Use precomputed matcher if it exists
      v.matcher && v.compiledParams ? rh(
        _,
        b,
        v.matcher,
        v.compiledParams
      ) : Cu(_, b)
    ), Y = v.route;
    if (!T && p && f && !s[s.length - 1].route.index && (T = Cu(
      {
        path: v.relativePath,
        caseSensitive: v.caseSensitive,
        end: !1
      },
      b
    )), !T)
      return null;
    Object.assign(d, T.params), y.push({
      // TODO: Can this as be avoided?
      params: d,
      pathname: Zt([h, T.pathname]),
      pathnameBase: wg(
        Zt([h, T.pathnameBase])
      ),
      route: Y
    }), T.pathnameBase !== "/" && (h = Zt([h, T.pathnameBase]));
  }
  return y;
}
function Cu(u, r) {
  typeof u == "string" && (u = { path: u, caseSensitive: !1, end: !0 });
  let [f, s] = oh(
    u.path,
    u.caseSensitive,
    u.end
  );
  return rh(u, r, f, s);
}
function rh(u, r, f, s) {
  let d = r.match(f);
  if (!d) return null;
  let h = d[0], y = h.replace(/(.)\/+$/, "$1"), g = d.slice(1);
  return {
    params: s.reduce(
      (p, { paramName: b, isOptional: _ }, T) => {
        if (b === "*") {
          let G = g[T] || "";
          y = h.slice(0, h.length - G.length).replace(/(.)\/+$/, "$1");
        }
        const Y = g[T];
        return _ && !Y ? p[b] = void 0 : p[b] = (Y || "").replace(/%2F/g, "/"), p;
      },
      {}
    ),
    pathname: h,
    pathnameBase: y,
    pattern: u
  };
}
function oh(u, r = !1, f = !0) {
  zt(
    u === "*" || !u.endsWith("*") || u.endsWith("/*"),
    `Route path "${u}" will be treated as if it were "${u.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${u.replace(/\*$/, "/*")}".`
  );
  let s = [], d = "^" + u.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(
    /\/:([\w-]+)(\?)?/g,
    (y, g, v, p, b) => {
      if (s.push({ paramName: g, isOptional: v != null }), v) {
        let _ = b.charAt(p + y.length);
        return _ && _ !== "/" ? "/([^\\/]*)" : "(?:/([^\\/]*))?";
      }
      return "/([^\\/]+)";
    }
  ).replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
  return u.endsWith("*") ? (s.push({ paramName: "*" }), d += u === "*" || u === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$") : f ? d += "\\/*$" : u !== "" && u !== "/" && (d += "(?:(?=\\/|$))"), [new RegExp(d, r ? void 0 : "i"), s];
}
function Cg(u) {
  try {
    return u.split("/").map((r) => decodeURIComponent(r).replace(/\//g, "%2F")).join("/");
  } catch (r) {
    return zt(
      !1,
      `The URL path "${u}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${r}).`
    ), u;
  }
}
function gl(u, r) {
  if (r === "/") return u;
  if (!u.toLowerCase().startsWith(r.toLowerCase()))
    return null;
  let f = r.endsWith("/") ? r.length - 1 : r.length, s = u.charAt(f);
  return s && s !== "/" ? null : u.slice(f) || "/";
}
function Mg(u, r = "/") {
  let {
    pathname: f,
    search: s = "",
    hash: d = ""
  } = typeof u == "string" ? fa(u) : u, h;
  return f ? (f = fh(f), f.startsWith("/") ? h = Vm(f.substring(1), "/") : h = Vm(f, r)) : h = r, {
    pathname: h,
    search: Dg(s),
    hash: Ug(d)
  };
}
function Vm(u, r) {
  let f = Mu(r).split("/");
  return u.split("/").forEach((d) => {
    d === ".." ? f.length > 1 && f.pop() : d !== "." && f.push(d);
  }), f.length > 1 ? f.join("/") : "/";
}
function rr(u, r, f, s) {
  return `Cannot include a '${u}' character in a manually specified \`to.${r}\` field [${JSON.stringify(
    s
  )}].  Please separate it out to the \`to.${f}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function Og(u) {
  return u.filter(
    (r, f) => f === 0 || r.route.path && r.route.path.length > 0
  );
}
function gr(u) {
  let r = Og(u);
  return r.map(
    (f, s) => s === r.length - 1 ? f.pathname : f.pathnameBase
  );
}
function wu(u, r, f, s = !1) {
  let d;
  typeof u == "string" ? d = fa(u) : (d = { ...u }, He(
    !d.pathname || !d.pathname.includes("?"),
    rr("?", "pathname", "search", d)
  ), He(
    !d.pathname || !d.pathname.includes("#"),
    rr("#", "pathname", "hash", d)
  ), He(
    !d.search || !d.search.includes("#"),
    rr("#", "search", "hash", d)
  ));
  let h = u === "" || d.pathname === "", y = h ? "/" : d.pathname, g;
  if (y == null)
    g = f;
  else {
    let _ = r.length - 1;
    if (!s && y.startsWith("..")) {
      let T = y.split("/");
      for (; T[0] === ".."; )
        T.shift(), _ -= 1;
      d.pathname = T.join("/");
    }
    g = _ >= 0 ? r[_] : "/";
  }
  let v = Mg(d, g), p = y && y !== "/" && y.endsWith("/"), b = (h || y === ".") && f.endsWith("/");
  return !v.pathname.endsWith("/") && (p || b) && (v.pathname += "/"), v;
}
var fh = (u) => u.replace(/[\\/]{2,}/g, "/"), Zt = (u) => fh(u.join("/")), Mu = (u) => u.replace(/\/+$/, ""), wg = (u) => Mu(u).replace(/^\/*/, "/"), Dg = (u) => !u || u === "?" ? "" : u.startsWith("?") ? u : "?" + u, Ug = (u) => !u || u === "#" ? "" : u.startsWith("#") ? u : "#" + u, Hg = class {
  constructor(u, r, f, s = !1) {
    this.status = u, this.statusText = r || "", this.internal = s, f instanceof Error ? (this.data = f.toString(), this.error = f) : this.data = f;
  }
};
function Lg(u) {
  return u != null && typeof u.status == "number" && typeof u.statusText == "string" && typeof u.internal == "boolean" && "data" in u;
}
function Bg(u) {
  let r = u.map((f) => f.route.path).filter(Boolean);
  return Zt(r) || "/";
}
var dh = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
function mh(u, r) {
  let f = u;
  if (typeof f != "string" || !vr.test(f))
    return {
      absoluteURL: void 0,
      isExternal: !1,
      to: f
    };
  let s = f, d = !1;
  if (dh)
    try {
      let h = new URL(window.location.href), y = ih.test(f) ? new URL(mg(f, h.protocol)) : new URL(f), g = gl(y.pathname, r);
      y.origin === h.origin && g != null ? f = g + y.search + y.hash : d = !0;
    } catch {
      zt(
        !1,
        `<Link to="${f}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`
      );
    }
  return {
    absoluteURL: s,
    isExternal: d,
    to: f
  };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
var hh = [
  "POST",
  "PUT",
  "PATCH",
  "DELETE"
];
new Set(
  hh
);
var qg = [
  "GET",
  ...hh
];
new Set(qg);
var Yg = [
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
function kg(u) {
  try {
    return Yg.includes(new URL(u).protocol);
  } catch {
    return !1;
  }
}
var Ia = E.createContext(null);
Ia.displayName = "DataRouter";
var Du = E.createContext(null);
Du.displayName = "DataRouterState";
var ph = E.createContext(!1);
function Gg() {
  return E.useContext(ph);
}
var vh = E.createContext({
  isTransitioning: !1
});
vh.displayName = "ViewTransition";
var Xg = E.createContext(
  /* @__PURE__ */ new Map()
);
Xg.displayName = "Fetchers";
var Qg = E.createContext(null);
Qg.displayName = "Await";
var At = E.createContext(
  null
);
At.displayName = "Navigation";
var ai = E.createContext(
  null
);
ai.displayName = "Location";
var Pt = E.createContext({
  outlet: null,
  matches: [],
  isDataRoute: !1
});
Pt.displayName = "Route";
var yr = E.createContext(null);
yr.displayName = "RouteError";
var gh = "REACT_ROUTER_ERROR", Zg = "REDIRECT", Vg = "ROUTE_ERROR_RESPONSE";
function Kg(u) {
  if (u.startsWith(`${gh}:${Zg}:{`))
    try {
      let r = JSON.parse(u.slice(28));
      if (typeof r == "object" && r && typeof r.status == "number" && typeof r.statusText == "string" && typeof r.location == "string" && typeof r.reloadDocument == "boolean" && typeof r.replace == "boolean")
        return r;
    } catch {
    }
}
function Jg(u) {
  if (u.startsWith(
    `${gh}:${Vg}:{`
  ))
    try {
      let r = JSON.parse(u.slice(40));
      if (typeof r == "object" && r && typeof r.status == "number" && typeof r.statusText == "string")
        return new Hg(
          r.status,
          r.statusText,
          r.data
        );
    } catch {
    }
}
function $g(u, { relative: r } = {}) {
  He(
    en(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useHref() may be used only in the context of a <Router> component."
  );
  let { basename: f, navigator: s } = E.useContext(At), { hash: d, pathname: h, search: y } = ni(u, { relative: r }), g = h;
  return f !== "/" && (g = h === "/" ? f : Zt([f, h])), s.createHref({ pathname: g, search: y, hash: d });
}
function en() {
  return E.useContext(ai) != null;
}
function gt() {
  return He(
    en(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useLocation() may be used only in the context of a <Router> component."
  ), E.useContext(ai).location;
}
var yh = "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function bh(u) {
  E.useContext(At).static || E.useLayoutEffect(u);
}
function kt() {
  let { isDataRoute: u } = E.useContext(Pt);
  return u ? sy() : Fg();
}
function Fg() {
  He(
    en(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useNavigate() may be used only in the context of a <Router> component."
  );
  let u = E.useContext(Ia), { basename: r, navigator: f } = E.useContext(At), { matches: s } = E.useContext(Pt), { pathname: d } = gt(), h = JSON.stringify(gr(s)), y = E.useRef(!1);
  return bh(() => {
    y.current = !0;
  }), E.useCallback(
    (v, p = {}) => {
      if (zt(y.current, yh), !y.current) return;
      if (typeof v == "number") {
        f.go(v);
        return;
      }
      let b = wu(
        v,
        JSON.parse(h),
        d,
        p.relative === "path"
      );
      u == null && r !== "/" && (b.pathname = b.pathname === "/" ? r : Zt([r, b.pathname])), (p.replace ? f.replace : f.push)(
        b,
        p.state,
        p
      );
    },
    [
      r,
      f,
      h,
      d,
      u
    ]
  );
}
E.createContext(null);
function ni(u, { relative: r } = {}) {
  let { matches: f } = E.useContext(Pt), { pathname: s } = gt(), d = JSON.stringify(gr(f));
  return E.useMemo(
    () => wu(
      u,
      JSON.parse(d),
      s,
      r === "path"
    ),
    [u, d, s, r]
  );
}
function Wg(u, r) {
  return xh(u, r);
}
function xh(u, r, f) {
  He(
    en(),
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useRoutes() may be used only in the context of a <Router> component."
  );
  let { navigator: s } = E.useContext(At), { matches: d } = E.useContext(Pt), h = d[d.length - 1], y = h ? h.params : {}, g = h ? h.pathname : "/", v = h ? h.pathnameBase : "/", p = h && h.route;
  {
    let U = p && p.path || "";
    Sh(
      g,
      !p || U.endsWith("*") || U.endsWith("*?"),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${g}" (under <Route path="${U}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${U}"> to <Route path="${U === "/" ? "*" : `${U}/*`}">.`
    );
  }
  let b = gt(), _;
  if (r) {
    let U = typeof r == "string" ? fa(r) : r;
    He(
      v === "/" || U.pathname?.startsWith(v),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${v}" but pathname "${U.pathname}" was given in the \`location\` prop.`
    ), _ = U;
  } else
    _ = b;
  let T = _.pathname || "/", Y = T;
  if (v !== "/") {
    let U = v.replace(/^\//, "").split("/");
    Y = "/" + T.replace(/^\//, "").split("/").slice(U.length).join("/");
  }
  let G = f && f.state.matches.length ? (
    // If we're in a data router, use the matches we've already identified but ensure
    // we have the latest route instances from the manifest in case elements have changed
    f.state.matches.map(
      (U) => Object.assign(U, {
        route: f.manifest[U.route.id] || U.route
      })
    )
  ) : uh(u, { pathname: Y });
  zt(
    p || G != null,
    `No routes matched location "${_.pathname}${_.search}${_.hash}" `
  ), zt(
    G == null || G[G.length - 1].route.element !== void 0 || G[G.length - 1].route.Component !== void 0 || G[G.length - 1].route.lazy !== void 0,
    `Matched leaf route at location "${_.pathname}${_.search}${_.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`
  );
  let k = ly(
    G && G.map(
      (U) => Object.assign({}, U, {
        params: Object.assign({}, y, U.params),
        pathname: Zt([
          v,
          // Re-encode pathnames that were decoded inside matchRoutes.
          // Pre-encode `%`, `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          s.encodeLocation ? s.encodeLocation(
            U.pathname.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : U.pathname
        ]),
        pathnameBase: U.pathnameBase === "/" ? v : Zt([
          v,
          // Re-encode pathnames that were decoded inside matchRoutes
          // Pre-encode `%`, `?` and `#` ahead of `encodeLocation` because it uses
          // `new URL()` internally and we need to prevent it from treating
          // them as separators
          s.encodeLocation ? s.encodeLocation(
            U.pathnameBase.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")
          ).pathname : U.pathnameBase
        ])
      })
    ),
    d,
    f
  );
  return r && k ? /* @__PURE__ */ E.createElement(
    ai.Provider,
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
    k
  ) : k;
}
function Pg() {
  let u = cy(), r = Lg(u) ? `${u.status} ${u.statusText}` : u instanceof Error ? u.message : JSON.stringify(u), f = u instanceof Error ? u.stack : null, s = "rgba(200,200,200, 0.5)", d = { padding: "0.5rem", backgroundColor: s }, h = { padding: "2px 4px", backgroundColor: s }, y = null;
  return console.error(
    "Error handled by React Router default ErrorBoundary:",
    u
  ), y = /* @__PURE__ */ E.createElement(E.Fragment, null, /* @__PURE__ */ E.createElement("p", null, "💿 Hey developer 👋"), /* @__PURE__ */ E.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /* @__PURE__ */ E.createElement("code", { style: h }, "ErrorBoundary"), " or", " ", /* @__PURE__ */ E.createElement("code", { style: h }, "errorElement"), " prop on your route.")), /* @__PURE__ */ E.createElement(E.Fragment, null, /* @__PURE__ */ E.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ E.createElement("h3", { style: { fontStyle: "italic" } }, r), f ? /* @__PURE__ */ E.createElement("pre", { style: d }, f) : null, y);
}
var Ig = /* @__PURE__ */ E.createElement(Pg, null), _h = class extends E.Component {
  constructor(u) {
    super(u), this.state = {
      location: u.location,
      revalidation: u.revalidation,
      error: u.error
    };
  }
  static getDerivedStateFromError(u) {
    return { error: u };
  }
  static getDerivedStateFromProps(u, r) {
    return r.location !== u.location || r.revalidation !== "idle" && u.revalidation === "idle" ? {
      error: u.error,
      location: u.location,
      revalidation: u.revalidation
    } : {
      error: u.error !== void 0 ? u.error : r.error,
      location: r.location,
      revalidation: u.revalidation || r.revalidation
    };
  }
  componentDidCatch(u, r) {
    this.props.onError ? this.props.onError(u, r) : console.error(
      "React Router caught the following error during render",
      u
    );
  }
  render() {
    let u = this.state.error;
    if (this.context && typeof u == "object" && u && "digest" in u && typeof u.digest == "string") {
      const f = Jg(u.digest);
      f && (u = f);
    }
    let r = u !== void 0 ? /* @__PURE__ */ E.createElement(Pt.Provider, { value: this.props.routeContext }, /* @__PURE__ */ E.createElement(
      yr.Provider,
      {
        value: u,
        children: this.props.component
      }
    )) : this.props.children;
    return this.context ? /* @__PURE__ */ E.createElement(ey, { error: u }, r) : r;
  }
};
_h.contextType = ph;
var or = /* @__PURE__ */ new WeakMap();
function ey({
  children: u,
  error: r
}) {
  let { basename: f } = E.useContext(At);
  if (typeof r == "object" && r && "digest" in r && typeof r.digest == "string") {
    let s = Kg(r.digest);
    if (s) {
      let d = or.get(r);
      if (d) throw d;
      let h = mh(s.location, f), y = h.absoluteURL || h.to;
      if (kg(y))
        throw new Error("Invalid redirect location");
      if (dh && !or.get(r))
        if (h.isExternal || s.reloadDocument)
          window.location.href = y;
        else {
          const g = Promise.resolve().then(
            () => window.__reactRouterDataRouter.navigate(h.to, {
              replace: s.replace
            })
          );
          throw or.set(r, g), g;
        }
      return /* @__PURE__ */ E.createElement("meta", { httpEquiv: "refresh", content: `0;url=${y}` });
    }
  }
  return u;
}
function ty({ routeContext: u, match: r, children: f }) {
  let s = E.useContext(Ia);
  return s && s.static && s.staticContext && (r.route.errorElement || r.route.ErrorBoundary) && (s.staticContext._deepestRenderedBoundaryId = r.route.id), /* @__PURE__ */ E.createElement(Pt.Provider, { value: u }, f);
}
function ly(u, r = [], f) {
  let s = f?.state;
  if (u == null) {
    if (!s)
      return null;
    if (s.errors)
      u = s.matches;
    else if (r.length === 0 && !s.initialized && s.matches.length > 0)
      u = s.matches;
    else
      return null;
  }
  let d = u, h = s?.errors;
  if (h != null) {
    let b = d.findIndex(
      (_) => _.route.id && h?.[_.route.id] !== void 0
    );
    He(
      b >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(
        h
      ).join(",")}`
    ), d = d.slice(
      0,
      Math.min(d.length, b + 1)
    );
  }
  let y = !1, g = -1;
  if (f && s) {
    y = s.renderFallback;
    for (let b = 0; b < d.length; b++) {
      let _ = d[b];
      if ((_.route.HydrateFallback || _.route.hydrateFallbackElement) && (g = b), _.route.id) {
        let { loaderData: T, errors: Y } = s, G = _.route.loader && !T.hasOwnProperty(_.route.id) && (!Y || Y[_.route.id] === void 0);
        if (_.route.lazy || G) {
          f.isStatic && (y = !0), g >= 0 ? d = d.slice(0, g + 1) : d = [d[0]];
          break;
        }
      }
    }
  }
  let v = f?.onError, p = s && v ? (b, _) => {
    v(b, {
      location: s.location,
      params: s.matches?.[0]?.params ?? {},
      pattern: Bg(s.matches),
      errorInfo: _
    });
  } : void 0;
  return d.reduceRight(
    (b, _, T) => {
      let Y, G = !1, k = null, U = null;
      s && (Y = h && _.route.id ? h[_.route.id] : void 0, k = _.route.errorElement || Ig, y && (g < 0 && T === 0 ? (Sh(
        "route-fallback",
        !1,
        "No `HydrateFallback` element provided to render during initial hydration"
      ), G = !0, U = null) : g === T && (G = !0, U = _.route.hydrateFallbackElement || null)));
      let X = r.concat(d.slice(0, T + 1)), V = () => {
        let B;
        return Y ? B = k : G ? B = U : _.route.Component ? B = /* @__PURE__ */ E.createElement(_.route.Component, null) : _.route.element ? B = _.route.element : B = b, /* @__PURE__ */ E.createElement(
          ty,
          {
            match: _,
            routeContext: {
              outlet: b,
              matches: X,
              isDataRoute: s != null
            },
            children: B
          }
        );
      };
      return s && (_.route.ErrorBoundary || _.route.errorElement || T === 0) ? /* @__PURE__ */ E.createElement(
        _h,
        {
          location: s.location,
          revalidation: s.revalidation,
          component: k,
          error: Y,
          children: V(),
          routeContext: { outlet: null, matches: X, isDataRoute: !0 },
          onError: p
        }
      ) : V();
    },
    null
  );
}
function br(u) {
  return `${u} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function ay(u) {
  let r = E.useContext(Ia);
  return He(r, br(u)), r;
}
function ny(u) {
  let r = E.useContext(Du);
  return He(r, br(u)), r;
}
function iy(u) {
  let r = E.useContext(Pt);
  return He(r, br(u)), r;
}
function xr(u) {
  let r = iy(u), f = r.matches[r.matches.length - 1];
  return He(
    f.route.id,
    `${u} can only be used on routes that contain a unique "id"`
  ), f.route.id;
}
function uy() {
  return xr(
    "useRouteId"
    /* UseRouteId */
  );
}
function cy() {
  let u = E.useContext(yr), r = ny(
    "useRouteError"
    /* UseRouteError */
  ), f = xr(
    "useRouteError"
    /* UseRouteError */
  );
  return u !== void 0 ? u : r.errors?.[f];
}
function sy() {
  let { router: u } = ay(
    "useNavigate"
    /* UseNavigateStable */
  ), r = xr(
    "useNavigate"
    /* UseNavigateStable */
  ), f = E.useRef(!1);
  return bh(() => {
    f.current = !0;
  }), E.useCallback(
    async (d, h = {}) => {
      zt(f.current, yh), f.current && (typeof d == "number" ? await u.navigate(d) : await u.navigate(d, { fromRouteId: r, ...h }));
    },
    [u, r]
  );
}
var Km = {};
function Sh(u, r, f) {
  !r && !Km[u] && (Km[u] = !0, zt(!1, f));
}
E.memo(ry);
function ry({
  routes: u,
  manifest: r,
  future: f,
  state: s,
  isStatic: d,
  onError: h
}) {
  return xh(u, void 0, {
    manifest: r,
    state: s,
    isStatic: d,
    onError: h
  });
}
function oa({
  to: u,
  replace: r,
  state: f,
  relative: s
}) {
  He(
    en(),
    // TODO: This error is probably because they somehow have 2 versions of
    // the router loaded. We can help them understand how to avoid that.
    "<Navigate> may be used only in the context of a <Router> component."
  );
  let { static: d } = E.useContext(At);
  zt(
    !d,
    "<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change."
  );
  let { matches: h } = E.useContext(Pt), { pathname: y } = gt(), g = kt(), v = wu(
    u,
    gr(h),
    y,
    s === "path"
  ), p = JSON.stringify(v);
  return E.useEffect(() => {
    g(JSON.parse(p), { replace: r, state: f, relative: s });
  }, [g, p, s, r, f]), null;
}
function Ue(u) {
  He(
    !1,
    "A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>."
  );
}
function oy({
  basename: u = "/",
  children: r = null,
  location: f,
  navigationType: s = "POP",
  navigator: d,
  static: h = !1,
  useTransitions: y
}) {
  He(
    !en(),
    "You cannot render a <Router> inside another <Router>. You should never have more than one in your app."
  );
  let g = u.replace(/^\/*/, "/"), v = E.useMemo(
    () => ({
      basename: g,
      navigator: d,
      static: h,
      useTransitions: y,
      future: {}
    }),
    [g, d, h, y]
  );
  typeof f == "string" && (f = fa(f));
  let {
    pathname: p = "/",
    search: b = "",
    hash: _ = "",
    state: T = null,
    key: Y = "default",
    mask: G
  } = f, k = E.useMemo(() => {
    let U = gl(p, g);
    return U == null ? null : {
      location: {
        pathname: U,
        search: b,
        hash: _,
        state: T,
        key: Y,
        mask: G
      },
      navigationType: s
    };
  }, [g, p, b, _, T, Y, s, G]);
  return zt(
    k != null,
    `<Router basename="${g}"> is not able to match the URL "${p}${b}${_}" because it does not start with the basename, so the <Router> won't render anything.`
  ), k == null ? null : /* @__PURE__ */ E.createElement(At.Provider, { value: v }, /* @__PURE__ */ E.createElement(ai.Provider, { children: r, value: k }));
}
function fy({
  children: u,
  location: r
}) {
  return Wg(mr(u), r);
}
function mr(u, r = []) {
  let f = [];
  return E.Children.forEach(u, (s, d) => {
    if (!E.isValidElement(s))
      return;
    let h = [...r, d];
    if (s.type === E.Fragment) {
      f.push.apply(
        f,
        mr(s.props.children, h)
      );
      return;
    }
    He(
      s.type === Ue,
      `[${typeof s.type == "string" ? s.type : s.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`
    ), He(
      !s.props.index || !s.props.children,
      "An index route cannot have child routes."
    );
    let y = {
      id: s.props.id || h.join("-"),
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
    s.props.children && (y.children = mr(
      s.props.children,
      h
    )), f.push(y);
  }), f;
}
var Ru = "get", zu = "application/x-www-form-urlencoded";
function Uu(u) {
  return typeof HTMLElement < "u" && u instanceof HTMLElement;
}
function dy(u) {
  return Uu(u) && u.tagName.toLowerCase() === "button";
}
function my(u) {
  return Uu(u) && u.tagName.toLowerCase() === "form";
}
function hy(u) {
  return Uu(u) && u.tagName.toLowerCase() === "input";
}
function py(u) {
  return !!(u.metaKey || u.altKey || u.ctrlKey || u.shiftKey);
}
function vy(u, r) {
  return u.button === 0 && // Ignore everything but left clicks
  (!r || r === "_self") && // Let browser handle "target=_blank" etc.
  !py(u);
}
function hr(u = "") {
  return new URLSearchParams(
    typeof u == "string" || Array.isArray(u) || u instanceof URLSearchParams ? u : Object.keys(u).reduce((r, f) => {
      let s = u[f];
      return r.concat(
        Array.isArray(s) ? s.map((d) => [f, d]) : [[f, s]]
      );
    }, [])
  );
}
function gy(u, r) {
  let f = hr(u);
  return r && r.forEach((s, d) => {
    f.has(d) || r.getAll(d).forEach((h) => {
      f.append(d, h);
    });
  }), f;
}
var Eu = null;
function yy() {
  if (Eu === null)
    try {
      new FormData(
        document.createElement("form"),
        // @ts-expect-error if FormData supports the submitter parameter, this will throw
        0
      ), Eu = !1;
    } catch {
      Eu = !0;
    }
  return Eu;
}
var by = /* @__PURE__ */ new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
]);
function fr(u) {
  return u != null && !by.has(u) ? (zt(
    !1,
    `"${u}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${zu}"`
  ), null) : u;
}
function xy(u, r) {
  let f, s, d, h, y;
  if (my(u)) {
    let g = u.getAttribute("action");
    s = g ? gl(g, r) : null, f = u.getAttribute("method") || Ru, d = fr(u.getAttribute("enctype")) || zu, h = new FormData(u);
  } else if (dy(u) || hy(u) && (u.type === "submit" || u.type === "image")) {
    let g = u.form;
    if (g == null)
      throw new Error(
        'Cannot submit a <button> or <input type="submit"> without a <form>'
      );
    let v = u.getAttribute("formaction") || g.getAttribute("action");
    if (s = v ? gl(v, r) : null, f = u.getAttribute("formmethod") || g.getAttribute("method") || Ru, d = fr(u.getAttribute("formenctype")) || fr(g.getAttribute("enctype")) || zu, h = new FormData(g, u), !yy()) {
      let { name: p, type: b, value: _ } = u;
      if (b === "image") {
        let T = p ? `${p}.` : "";
        h.append(`${T}x`, "0"), h.append(`${T}y`, "0");
      } else p && h.append(p, _);
    }
  } else {
    if (Uu(u))
      throw new Error(
        'Cannot submit element that is not <form>, <button>, or <input type="submit|image">'
      );
    f = Ru, s = null, d = zu, y = u;
  }
  return h && d === "text/plain" && (y = h, h = void 0), { action: s, method: f.toLowerCase(), encType: d, formData: h, body: y };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function _r(u, r) {
  if (u === !1 || u === null || typeof u > "u")
    throw new Error(r);
}
function jh(u, r, f, s) {
  let d = typeof u == "string" ? new URL(
    u,
    // This can be called during the SSR flow via PrefetchPageLinksImpl so
    // don't assume window is available
    typeof window > "u" ? "server://singlefetch/" : window.location.origin
  ) : u;
  return f ? d.pathname.endsWith("/") ? d.pathname = `${d.pathname}_.${s}` : d.pathname = `${d.pathname}.${s}` : d.pathname === "/" ? d.pathname = `_root.${s}` : r && gl(d.pathname, r) === "/" ? d.pathname = `${Mu(r)}/_root.${s}` : d.pathname = `${Mu(d.pathname)}.${s}`, d;
}
async function _y(u, r) {
  if (u.id in r)
    return r[u.id];
  try {
    let f = await import(
      /* @vite-ignore */
      /* webpackIgnore: true */
      u.module
    );
    return r[u.id] = f, f;
  } catch (f) {
    return console.error(
      `Error loading route module \`${u.module}\`, reloading page...`
    ), console.error(f), window.__reactRouterContext && window.__reactRouterContext.isSpaMode, window.location.reload(), new Promise(() => {
    });
  }
}
function Sy(u) {
  return u == null ? !1 : u.href == null ? u.rel === "preload" && typeof u.imageSrcSet == "string" && typeof u.imageSizes == "string" : typeof u.rel == "string" && typeof u.href == "string";
}
async function jy(u, r, f) {
  let s = await Promise.all(
    u.map(async (d) => {
      let h = r.routes[d.route.id];
      if (h) {
        let y = await _y(h, f);
        return y.links ? y.links() : [];
      }
      return [];
    })
  );
  return Ry(
    s.flat(1).filter(Sy).filter((d) => d.rel === "stylesheet" || d.rel === "preload").map(
      (d) => d.rel === "stylesheet" ? { ...d, rel: "prefetch", as: "style" } : { ...d, rel: "prefetch" }
    )
  );
}
function Jm(u, r, f, s, d, h) {
  let y = (v, p) => f[p] ? v.route.id !== f[p].route.id : !0, g = (v, p) => (
    // param change, /users/123 -> /users/456
    f[p].pathname !== v.pathname || // splat param changed, which is not present in match.path
    // e.g. /files/images/avatar.jpg -> files/finances.xls
    f[p].route.path?.endsWith("*") && f[p].params["*"] !== v.params["*"]
  );
  return h === "assets" ? r.filter(
    (v, p) => y(v, p) || g(v, p)
  ) : h === "data" ? r.filter((v, p) => {
    let b = s.routes[v.route.id];
    if (!b || !b.hasLoader)
      return !1;
    if (y(v, p) || g(v, p))
      return !0;
    if (v.route.shouldRevalidate) {
      let _ = v.route.shouldRevalidate({
        currentUrl: new URL(
          d.pathname + d.search + d.hash,
          window.origin
        ),
        currentParams: f[0]?.params || {},
        nextUrl: new URL(u, window.origin),
        nextParams: v.params,
        defaultShouldRevalidate: !0
      });
      if (typeof _ == "boolean")
        return _;
    }
    return !0;
  }) : [];
}
function Ey(u, r, { includeHydrateFallback: f } = {}) {
  return Ny(
    u.map((s) => {
      let d = r.routes[s.route.id];
      if (!d) return [];
      let h = [d.module];
      return d.clientActionModule && (h = h.concat(d.clientActionModule)), d.clientLoaderModule && (h = h.concat(d.clientLoaderModule)), f && d.hydrateFallbackModule && (h = h.concat(d.hydrateFallbackModule)), d.imports && (h = h.concat(d.imports)), h;
    }).flat(1)
  );
}
function Ny(u) {
  return [...new Set(u)];
}
function Ty(u) {
  let r = {}, f = Object.keys(u).sort();
  for (let s of f)
    r[s] = u[s];
  return r;
}
function Ry(u, r) {
  let f = /* @__PURE__ */ new Set();
  return new Set(r), u.reduce((s, d) => {
    let h = JSON.stringify(Ty(d));
    return f.has(h) || (f.add(h), s.push({ key: h, link: d })), s;
  }, []);
}
function Sr() {
  let u = E.useContext(Ia);
  return _r(
    u,
    "You must render this element inside a <DataRouterContext.Provider> element"
  ), u;
}
function zy() {
  let u = E.useContext(Du);
  return _r(
    u,
    "You must render this element inside a <DataRouterStateContext.Provider> element"
  ), u;
}
var jr = E.createContext(void 0);
jr.displayName = "FrameworkContext";
function Hu() {
  let u = E.useContext(jr);
  return _r(
    u,
    "You must render this element inside a <HydratedRouter> element"
  ), u;
}
function Ay(u, r) {
  let f = E.useContext(jr), [s, d] = E.useState(!1), [h, y] = E.useState(!1), { onFocus: g, onBlur: v, onMouseEnter: p, onMouseLeave: b, onTouchStart: _ } = r, T = E.useRef(null);
  E.useEffect(() => {
    if (u === "render" && y(!0), u === "viewport") {
      let k = (X) => {
        X.forEach((V) => {
          y(V.isIntersecting);
        });
      }, U = new IntersectionObserver(k, { threshold: 0.5 });
      return T.current && U.observe(T.current), () => {
        U.disconnect();
      };
    }
  }, [u]), E.useEffect(() => {
    if (s) {
      let k = setTimeout(() => {
        y(!0);
      }, 100);
      return () => {
        clearTimeout(k);
      };
    }
  }, [s]);
  let Y = () => {
    d(!0);
  }, G = () => {
    d(!1), y(!1);
  };
  return f ? u !== "intent" ? [h, T, {}] : [
    h,
    T,
    {
      onFocus: Wn(g, Y),
      onBlur: Wn(v, G),
      onMouseEnter: Wn(p, Y),
      onMouseLeave: Wn(b, G),
      onTouchStart: Wn(_, Y)
    }
  ] : [!1, T, {}];
}
function Wn(u, r) {
  return (f) => {
    u && u(f), f.defaultPrevented || r(f);
  };
}
function Cy({ page: u, ...r }) {
  let f = Gg(), { nonce: s } = Hu(), { router: d } = Sr(), h = E.useMemo(
    () => uh(d.routes, u, d.basename),
    [d.routes, u, d.basename]
  );
  return h ? (r.nonce == null && s && (r = { ...r, nonce: s }), f ? /* @__PURE__ */ E.createElement(Oy, { page: u, matches: h, ...r }) : /* @__PURE__ */ E.createElement(wy, { page: u, matches: h, ...r })) : null;
}
function My(u) {
  let { manifest: r, routeModules: f } = Hu(), [s, d] = E.useState([]);
  return E.useEffect(() => {
    let h = !1;
    return jy(u, r, f).then(
      (y) => {
        h || d(y);
      }
    ), () => {
      h = !0;
    };
  }, [u, r, f]), s;
}
function Oy({
  page: u,
  matches: r,
  ...f
}) {
  let s = gt(), { future: d } = Hu(), { basename: h } = Sr(), y = E.useMemo(() => {
    if (u === s.pathname + s.search + s.hash)
      return [];
    let g = jh(
      u,
      h,
      d.v8_trailingSlashAwareDataRequests,
      "rsc"
    ), v = !1, p = [];
    for (let b of r)
      typeof b.route.shouldRevalidate == "function" ? v = !0 : p.push(b.route.id);
    return v && p.length > 0 && g.searchParams.set("_routes", p.join(",")), [g.pathname + g.search];
  }, [
    h,
    d.v8_trailingSlashAwareDataRequests,
    u,
    s,
    r
  ]);
  return /* @__PURE__ */ E.createElement(E.Fragment, null, y.map((g) => /* @__PURE__ */ E.createElement("link", { key: g, rel: "prefetch", as: "fetch", href: g, ...f })));
}
function wy({
  page: u,
  matches: r,
  ...f
}) {
  let s = gt(), { future: d, manifest: h, routeModules: y } = Hu(), { basename: g } = Sr(), { loaderData: v, matches: p } = zy(), b = E.useMemo(
    () => Jm(
      u,
      r,
      p,
      h,
      s,
      "data"
    ),
    [u, r, p, h, s]
  ), _ = E.useMemo(
    () => Jm(
      u,
      r,
      p,
      h,
      s,
      "assets"
    ),
    [u, r, p, h, s]
  ), T = E.useMemo(() => {
    if (u === s.pathname + s.search + s.hash)
      return [];
    let k = /* @__PURE__ */ new Set(), U = !1;
    if (r.forEach((V) => {
      let B = h.routes[V.route.id];
      !B || !B.hasLoader || (!b.some((le) => le.route.id === V.route.id) && V.route.id in v && y[V.route.id]?.shouldRevalidate || B.hasClientLoader ? U = !0 : k.add(V.route.id));
    }), k.size === 0)
      return [];
    let X = jh(
      u,
      g,
      d.v8_trailingSlashAwareDataRequests,
      "data"
    );
    return U && k.size > 0 && X.searchParams.set(
      "_routes",
      r.filter((V) => k.has(V.route.id)).map((V) => V.route.id).join(",")
    ), [X.pathname + X.search];
  }, [
    g,
    d.v8_trailingSlashAwareDataRequests,
    v,
    s,
    h,
    b,
    r,
    u,
    y
  ]), Y = E.useMemo(
    () => Ey(_, h),
    [_, h]
  ), G = My(_);
  return /* @__PURE__ */ E.createElement(E.Fragment, null, T.map((k) => /* @__PURE__ */ E.createElement("link", { key: k, rel: "prefetch", as: "fetch", href: k, ...f })), Y.map((k) => /* @__PURE__ */ E.createElement("link", { key: k, rel: "modulepreload", href: k, ...f })), G.map(({ key: k, link: U }) => (
    // these don't spread `linkProps` because they are full link descriptors
    // already with their own props
    /* @__PURE__ */ E.createElement(
      "link",
      {
        key: k,
        nonce: f.nonce,
        ...U,
        crossOrigin: U.crossOrigin ?? f.crossOrigin
      }
    )
  )));
}
function Dy(...u) {
  return (r) => {
    u.forEach((f) => {
      typeof f == "function" ? f(r) : f != null && (f.current = r);
    });
  };
}
var Uy = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
try {
  Uy && (window.__reactRouterVersion = // @ts-expect-error
  "7.18.2");
} catch {
}
function Hy({
  basename: u,
  children: r,
  useTransitions: f,
  window: s
}) {
  let d = E.useRef();
  d.current == null && (d.current = hg({ window: s, v5Compat: !0 }));
  let h = d.current, [y, g] = E.useState({
    action: h.action,
    location: h.location
  }), v = E.useCallback(
    (p) => {
      f === !1 ? g(p) : E.startTransition(() => g(p));
    },
    [f]
  );
  return E.useLayoutEffect(() => h.listen(v), [h, v]), /* @__PURE__ */ E.createElement(
    oy,
    {
      basename: u,
      children: r,
      location: y.location,
      navigationType: y.action,
      navigator: h,
      useTransitions: f
    }
  );
}
var li = E.forwardRef(
  function({
    onClick: r,
    discover: f = "render",
    prefetch: s = "none",
    relative: d,
    reloadDocument: h,
    replace: y,
    mask: g,
    state: v,
    target: p,
    to: b,
    preventScrollReset: _,
    viewTransition: T,
    defaultShouldRevalidate: Y,
    ...G
  }, k) {
    let { basename: U, navigator: X, useTransitions: V } = E.useContext(At), B = typeof b == "string" && vr.test(b), le = mh(b, U);
    b = le.to;
    let ce = $g(b, { relative: d }), se = gt(), F = null;
    if (g) {
      let P = wu(
        g,
        [],
        se.mask ? se.mask.pathname : "/",
        !0
      );
      U !== "/" && (P.pathname = P.pathname === "/" ? U : Zt([U, P.pathname])), F = X.createHref(P);
    }
    let [xe, we, Fe] = Ay(
      s,
      G
    ), Ye = qy(b, {
      replace: y,
      mask: g,
      state: v,
      target: p,
      preventScrollReset: _,
      relative: d,
      viewTransition: T,
      defaultShouldRevalidate: Y,
      useTransitions: V
    });
    function Le(P) {
      r && r(P), P.defaultPrevented || Ye(P);
    }
    let C = !(le.isExternal || h), I = (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      /* @__PURE__ */ E.createElement(
        "a",
        {
          ...G,
          ...Fe,
          href: (C ? F : void 0) || le.absoluteURL || ce,
          onClick: C ? Le : r,
          ref: Dy(k, we),
          target: p,
          "data-discover": !B && f === "render" ? "true" : void 0
        }
      )
    );
    return xe && !B ? /* @__PURE__ */ E.createElement(E.Fragment, null, I, /* @__PURE__ */ E.createElement(Cy, { page: ce })) : I;
  }
);
li.displayName = "Link";
var Au = E.forwardRef(
  function({
    "aria-current": r = "page",
    caseSensitive: f = !1,
    className: s = "",
    end: d = !1,
    style: h,
    to: y,
    viewTransition: g,
    children: v,
    ...p
  }, b) {
    let _ = ni(y, { relative: p.relative }), T = gt(), Y = E.useContext(Du), { navigator: G, basename: k } = E.useContext(At), U = Y != null && // Conditional usage is OK here because the usage of a data router is static
    // eslint-disable-next-line react-hooks/rules-of-hooks
    Qy(_) && g === !0, X = G.encodeLocation ? G.encodeLocation(_).pathname : _.pathname, V = T.pathname, B = Y && Y.navigation && Y.navigation.location ? Y.navigation.location.pathname : null;
    f || (V = V.toLowerCase(), B = B ? B.toLowerCase() : null, X = X.toLowerCase()), B && k && (B = gl(B, k) || B);
    const le = X !== "/" && X.endsWith("/") ? X.length - 1 : X.length;
    let ce = V === X || !d && V.startsWith(X) && V.charAt(le) === "/", se = B != null && (B === X || !d && B.startsWith(X) && B.charAt(X.length) === "/"), F = {
      isActive: ce,
      isPending: se,
      isTransitioning: U
    }, xe = ce ? r : void 0, we;
    typeof s == "function" ? we = s(F) : we = [
      s,
      ce ? "active" : null,
      se ? "pending" : null,
      U ? "transitioning" : null
    ].filter(Boolean).join(" ");
    let Fe = typeof h == "function" ? h(F) : h;
    return /* @__PURE__ */ E.createElement(
      li,
      {
        ...p,
        "aria-current": xe,
        className: we,
        ref: b,
        style: Fe,
        to: y,
        viewTransition: g
      },
      typeof v == "function" ? v(F) : v
    );
  }
);
Au.displayName = "NavLink";
var Ly = E.forwardRef(
  ({
    discover: u = "render",
    fetcherKey: r,
    navigate: f,
    reloadDocument: s,
    replace: d,
    state: h,
    method: y = Ru,
    action: g,
    onSubmit: v,
    relative: p,
    preventScrollReset: b,
    viewTransition: _,
    defaultShouldRevalidate: T,
    ...Y
  }, G) => {
    let { useTransitions: k } = E.useContext(At), U = Gy(), X = Xy(g, { relative: p }), V = y.toLowerCase() === "get" ? "get" : "post", B = typeof g == "string" && vr.test(g), le = (ce) => {
      if (v && v(ce), ce.defaultPrevented) return;
      ce.preventDefault();
      let se = ce.nativeEvent.submitter, F = se?.getAttribute("formmethod") || y, xe = () => U(se || ce.currentTarget, {
        fetcherKey: r,
        method: F,
        navigate: f,
        replace: d,
        state: h,
        relative: p,
        preventScrollReset: b,
        viewTransition: _,
        defaultShouldRevalidate: T
      });
      k && f !== !1 ? E.startTransition(() => xe()) : xe();
    };
    return /* @__PURE__ */ E.createElement(
      "form",
      {
        ref: G,
        method: V,
        action: X,
        onSubmit: s ? v : le,
        ...Y,
        "data-discover": !B && u === "render" ? "true" : void 0
      }
    );
  }
);
Ly.displayName = "Form";
function By(u) {
  return `${u} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function Eh(u) {
  let r = E.useContext(Ia);
  return He(r, By(u)), r;
}
function qy(u, {
  target: r,
  replace: f,
  mask: s,
  state: d,
  preventScrollReset: h,
  relative: y,
  viewTransition: g,
  defaultShouldRevalidate: v,
  useTransitions: p
} = {}) {
  let b = kt(), _ = gt(), T = ni(u, { relative: y });
  return E.useCallback(
    (Y) => {
      if (vy(Y, r)) {
        Y.preventDefault();
        let G = f !== void 0 ? f : ti(_) === ti(T), k = () => b(u, {
          replace: G,
          mask: s,
          state: d,
          preventScrollReset: h,
          relative: y,
          viewTransition: g,
          defaultShouldRevalidate: v
        });
        p ? E.startTransition(() => k()) : k();
      }
    },
    [
      _,
      b,
      T,
      f,
      s,
      d,
      r,
      u,
      h,
      y,
      g,
      v,
      p
    ]
  );
}
function Er(u) {
  zt(
    typeof URLSearchParams < "u",
    "You cannot use the `useSearchParams` hook in a browser that does not support the URLSearchParams API. If you need to support Internet Explorer 11, we recommend you load a polyfill such as https://github.com/ungap/url-search-params."
  );
  let r = E.useRef(hr(u)), f = E.useRef(!1), s = gt(), d = E.useMemo(
    () => (
      // Only merge in the defaults if we haven't yet called setSearchParams.
      // Once we call that we want those to take precedence, otherwise you can't
      // remove a param with setSearchParams({}) if it has an initial value
      gy(
        s.search,
        f.current ? null : r.current
      )
    ),
    [s.search]
  ), h = kt(), y = E.useCallback(
    (g, v) => {
      const p = hr(
        typeof g == "function" ? g(new URLSearchParams(d)) : g
      );
      f.current = !0, h("?" + p, v);
    },
    [h, d]
  );
  return [d, y];
}
var Yy = 0, ky = () => `__${String(++Yy)}__`;
function Gy() {
  let { router: u } = Eh(
    "useSubmit"
    /* UseSubmit */
  ), { basename: r } = E.useContext(At), f = uy(), s = u.fetch, d = u.navigate;
  return E.useCallback(
    async (h, y = {}) => {
      let { action: g, method: v, encType: p, formData: b, body: _ } = xy(
        h,
        r
      );
      if (y.navigate === !1) {
        let T = y.fetcherKey || ky();
        await s(T, f, y.action || g, {
          defaultShouldRevalidate: y.defaultShouldRevalidate,
          preventScrollReset: y.preventScrollReset,
          formData: b,
          body: _,
          formMethod: y.method || v,
          formEncType: y.encType || p,
          flushSync: y.flushSync
        });
      } else
        await d(y.action || g, {
          defaultShouldRevalidate: y.defaultShouldRevalidate,
          preventScrollReset: y.preventScrollReset,
          formData: b,
          body: _,
          formMethod: y.method || v,
          formEncType: y.encType || p,
          replace: y.replace,
          state: y.state,
          fromRouteId: f,
          flushSync: y.flushSync,
          viewTransition: y.viewTransition
        });
    },
    [s, d, r, f]
  );
}
function Xy(u, { relative: r } = {}) {
  let { basename: f } = E.useContext(At), s = E.useContext(Pt);
  He(s, "useFormAction must be used inside a RouteContext");
  let [d] = s.matches.slice(-1), h = { ...ni(u || ".", { relative: r }) }, y = gt();
  if (u == null) {
    h.search = y.search;
    let g = new URLSearchParams(h.search), v = g.getAll("index");
    if (v.some((b) => b === "")) {
      g.delete("index"), v.filter((_) => _).forEach((_) => g.append("index", _));
      let b = g.toString();
      h.search = b ? `?${b}` : "";
    }
  }
  return (!u || u === ".") && d.route.index && (h.search = h.search ? h.search.replace(/^\?/, "?index&") : "?index"), f !== "/" && (h.pathname = h.pathname === "/" ? f : Zt([f, h.pathname])), ti(h);
}
function Qy(u, { relative: r } = {}) {
  let f = E.useContext(vh);
  He(
    f != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?"
  );
  let { basename: s } = Eh(
    "useViewTransitionState"
    /* useViewTransitionState */
  ), d = ni(u, { relative: r });
  if (!f.isTransitioning)
    return !1;
  let h = gl(f.currentLocation.pathname, s) || f.currentLocation.pathname, y = gl(f.nextLocation.pathname, s) || f.nextLocation.pathname;
  return Cu(d.pathname, y) != null || Cu(d.pathname, h) != null;
}
const Zy = "/dsc_hub/assets", Vy = {
  // Primary 7.0
  live: "icons/dsc-icon-ops.svg",
  grow: "icons/dsc-icon-plant.svg",
  tune: "icons/dsc-icon-advanced.svg",
  fleet: "icons/dsc-icon-system.svg",
  // Live
  mission: "icons/dsc-icon-home.svg",
  twin: "icons/dsc-icon-dash.svg",
  climate: "icons/dsc-icon-climate.svg",
  root: "icons/dsc-icon-root.svg",
  lighting: "icons/dsc-icon-lighting.svg",
  tent: "icons/dsc-icon-tent.svg",
  clone: "icons/dsc-icon-clone.svg",
  tank: "icons/dsc-icon-tank.svg",
  seat: "icons/dsc-icon-seat.svg",
  // Grow
  compose: "icons/dsc-icon-build.svg",
  research: "icons/dsc-icon-catalog.svg",
  roster: "icons/dsc-icon-strains.svg",
  nutrient: "icons/dsc-icon-nutrient.svg",
  // Tune
  learning: "icons/dsc-icon-learning.svg",
  analytics: "icons/dsc-icon-trends.svg",
  history: "icons/dsc-icon-history.svg",
  // Chrome
  alert: "icons/dsc-icon-alert.svg",
  ok: "icons/dsc-icon-ok.svg",
  settings: "icons/dsc-icon-settings.svg",
  brand: "brand/dsc-brand-mark.svg",
  wordmark: "brand/dsc-brand-wordmark.svg",
  gauge: "gauges/dsc-gauge-arc.svg",
  more: "icons/dsc-icon-more.svg",
  search: "icons/dsc-icon-search.svg",
  close: "icons/dsc-icon-close.svg",
  // Legacy aliases (redirect era / old call sites)
  ops: "icons/dsc-icon-ops.svg",
  plant: "icons/dsc-icon-plant.svg",
  advanced: "icons/dsc-icon-advanced.svg",
  system: "icons/dsc-icon-system.svg",
  home: "icons/dsc-icon-home.svg",
  dash: "icons/dsc-icon-dash.svg",
  build: "icons/dsc-icon-build.svg",
  catalog: "icons/dsc-icon-catalog.svg",
  strains: "icons/dsc-icon-strains.svg",
  trends: "icons/dsc-icon-trends.svg"
};
function $m(u) {
  return `${Zy}/${Vy[u]}`;
}
const Nh = E.createContext(null);
function Ky(u) {
  if (!u) return !1;
  const r = u.toLowerCase();
  return r.includes("dsc_") || r.includes("dsc-") || r.startsWith("sensor.dsc") || r.startsWith("switch.dsc") || r.startsWith("binary_sensor.dsc") || r.startsWith("number.dsc") || r.startsWith("light.dsc") || r.startsWith("fan.dsc") || r.startsWith("select.dsc") || r.startsWith("input_");
}
function Jy({
  hass: u,
  children: r
}) {
  const [f, s] = E.useState(0);
  E.useEffect(() => {
    if (!u) return;
    s((p) => p + 1);
    const h = u.connection;
    if (!h?.subscribeEvents) return;
    let y, g = !1;
    const v = (p) => {
      const b = p.data?.entity_id;
      Ky(b) && s((_) => _ + 1);
    };
    return Promise.resolve(h.subscribeEvents(v, "state_changed")).then((p) => {
      if (g) {
        p();
        return;
      }
      y = p;
    }).catch(() => {
    }), () => {
      g = !0, y?.();
    };
  }, [u]);
  const d = E.useMemo(() => {
    const h = (_) => u?.states?.[_], y = (_) => {
      const T = h(_)?.state;
      return !!T && T !== "unavailable" && T !== "unknown";
    }, g = (_, T = "—") => y(_) ? h(_)?.state ?? T : T;
    return { hass: u, entity: h, state: g, num: (_, T = NaN) => {
      const Y = Number(g(_, ""));
      return Number.isFinite(Y) ? Y : T;
    }, available: y, callService: (_, T, Y) => u?.callService ? u.callService(_, T, Y) : Promise.resolve(null), callWS: (_) => u?.callWS ? u.callWS(_) : Promise.resolve(null), tick: f };
  }, [u, f]);
  return E.createElement(Nh.Provider, { value: d }, r);
}
function $e() {
  const u = E.useContext(Nh);
  if (!u) throw new Error("useHass outside HassProvider");
  return u;
}
function Vt({
  name: u,
  size: r = 16,
  className: f,
  color: s = "currentColor"
}) {
  return /* @__PURE__ */ c.jsx(
    "span",
    {
      className: f,
      role: "img",
      "aria-hidden": !0,
      style: {
        display: "inline-block",
        width: r,
        height: r,
        backgroundColor: s,
        WebkitMaskImage: `url(${$m(u)})`,
        maskImage: `url(${$m(u)})`,
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
function ge({
  title: u,
  children: r,
  className: f = "",
  style: s,
  icon: d
}) {
  return /* @__PURE__ */ c.jsxs("section", { className: `dsc-card ${f}`.trim(), style: s, children: [
    u ? /* @__PURE__ */ c.jsxs("h3", { className: "dsc-card-title", children: [
      d ? /* @__PURE__ */ c.jsx(Vt, { name: d, size: 14, color: "var(--dsc-teal)" }) : null,
      u
    ] }) : null,
    r
  ] });
}
function ut({
  children: u,
  primary: r,
  teal: f,
  onClick: s,
  type: d = "button",
  disabled: h
}) {
  const y = ["dsc-btn"];
  return r && y.push("primary"), f && y.push("teal"), /* @__PURE__ */ c.jsx("button", { type: d, className: y.join(" "), onClick: s, disabled: h, children: u });
}
function Ae({
  label: u,
  value: r,
  unit: f,
  sub: s,
  tone: d = "normal"
}) {
  const h = d === "ok" ? "dsc-status-ok" : d === "bad" ? "dsc-status-bad" : d === "muted" ? "dsc-status-muted" : "";
  return /* @__PURE__ */ c.jsxs(ge, { title: u, children: [
    /* @__PURE__ */ c.jsxs("div", { className: `dsc-kpi-value ${h}`.trim(), children: [
      r,
      f ? /* @__PURE__ */ c.jsx("span", { className: "dsc-kpi-unit", children: f }) : null
    ] }),
    s ? /* @__PURE__ */ c.jsx("div", { className: "dsc-kpi-sub", children: s }) : null
  ] });
}
function Kt({
  title: u,
  subtitle: r,
  icon: f,
  primaryAction: s,
  actions: d
}) {
  const h = s || d ? /* @__PURE__ */ c.jsxs("div", { className: "dsc-page-header-actions", children: [
    s,
    d
  ] }) : null;
  return /* @__PURE__ */ c.jsxs("header", { className: "dsc-page-header", children: [
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-page-header-main", children: [
      f ? /* @__PURE__ */ c.jsx(Vt, { name: f, size: 22, color: "var(--dsc-teal)" }) : null,
      /* @__PURE__ */ c.jsxs("div", { children: [
        /* @__PURE__ */ c.jsx("h1", { className: "dsc-page-title", children: u }),
        r ? /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: r }) : null
      ] })
    ] }),
    h
  ] });
}
function de({
  label: u,
  tone: r = "muted",
  pulse: f,
  icon: s
}) {
  return /* @__PURE__ */ c.jsxs("span", { className: `dsc-chip dsc-chip--${r}${f ? " dsc-chip--pulse" : ""}`, children: [
    s ? /* @__PURE__ */ c.jsx(Vt, { name: s, size: 11 }) : null,
    u
  ] });
}
function Ce({
  entityId: u,
  label: r,
  warnWhenMissing: f,
  icon: s,
  showBrightness: d
}) {
  const { state: h, available: y, callService: g, entity: v } = $e(), p = h(u, "off") === "on", b = y(u), _ = u.split(".")[0], T = () => {
    if (b) {
      if (_ === "switch" || _ === "input_boolean") {
        g("homeassistant", "toggle", { entity_id: u });
        return;
      }
      _ === "light" && g("light", p ? "turn_off" : "turn_on", { entity_id: u });
    }
  }, Y = d !== !1 && _ === "light" && p ? Math.round(Number(v(u)?.attributes?.brightness ?? 0) / 255 * 100) : null;
  return /* @__PURE__ */ c.jsxs(
    "button",
    {
      type: "button",
      className: `dsc-demand${p ? " is-on" : ""}${b ? "" : " is-missing"}`,
      onClick: T,
      disabled: !b && !f,
      title: b ? u : f || `${u} unavailable`,
      children: [
        s ? /* @__PURE__ */ c.jsx(Vt, { name: s, size: 14, className: "dsc-demand-icon" }) : null,
        /* @__PURE__ */ c.jsx("span", { className: "dsc-demand-label", children: r }),
        /* @__PURE__ */ c.jsx("span", { className: "dsc-demand-state", children: b ? Y != null ? `${Y}%` : p ? "ON" : "OFF" : f || "—" })
      ]
    }
  );
}
function Ou({
  entityId: u,
  label: r,
  icon: f
}) {
  const { state: s, available: d, callService: h, entity: y } = $e(), g = d(u), v = s(u, ""), p = y(u)?.attributes?.options || [], b = u.split(".")[0], _ = (T) => {
    !g || !T || (b === "select" ? h("select", "select_option", { entity_id: u, option: T }) : b === "input_select" && h("input_select", "select_option", { entity_id: u, option: T }));
  };
  return /* @__PURE__ */ c.jsxs("label", { className: `dsc-entity-select${g ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ c.jsxs("span", { className: "dsc-entity-select-label", children: [
      f ? /* @__PURE__ */ c.jsx(Vt, { name: f, size: 13, color: "var(--dsc-teal)" }) : null,
      r
    ] }),
    /* @__PURE__ */ c.jsxs("select", { value: v, disabled: !g, onChange: (T) => _(T.target.value), children: [
      !p.includes(v) && v ? /* @__PURE__ */ c.jsx("option", { value: v, children: v }) : null,
      p.map((T) => /* @__PURE__ */ c.jsx("option", { value: T, children: T }, T))
    ] })
  ] });
}
function Xl({
  entityId: u,
  label: r,
  disabled: f
}) {
  const { available: s, callService: d, entity: h, state: y } = $e(), g = s(u), v = Number(h(u)?.attributes?.percentage ?? 0), p = y(u) === "on", b = f || !g, _ = (T) => {
    b || d("fan", "set_percentage", { entity_id: u, percentage: T });
  };
  return /* @__PURE__ */ c.jsxs("label", { className: `dsc-fan-slider${b ? " is-disabled" : ""}`, children: [
    /* @__PURE__ */ c.jsxs("span", { className: "dsc-fan-slider-label", children: [
      r,
      /* @__PURE__ */ c.jsx("strong", { children: g ? `${Math.round(v)}%` : "—" }),
      !p && g ? /* @__PURE__ */ c.jsx("em", { className: "dsc-muted", children: "off" }) : null
    ] }),
    /* @__PURE__ */ c.jsx(
      "input",
      {
        type: "range",
        min: 0,
        max: 100,
        step: 1,
        value: Number.isFinite(v) ? v : 0,
        disabled: b,
        onChange: (T) => _(Number(T.target.value))
      }
    )
  ] });
}
function Nu({
  entityId: u,
  label: r,
  icon: f
}) {
  const { state: s, available: d } = $e(), h = d(u) && s(u) === "on";
  return /* @__PURE__ */ c.jsxs("span", { className: `dsc-chip ${h ? "dsc-chip--ok dsc-chip--pulse" : "dsc-chip--muted"}`, children: [
    f ? /* @__PURE__ */ c.jsx(Vt, { name: f, size: 11 }) : null,
    r,
    " ",
    h ? "ESP" : "HA"
  ] });
}
function $y(u) {
  const r = [], f = (y, g = "unknown") => u.state(y, g), s = (y) => f(y) === "on", d = u.entity?.("sensor.dsc_keepup_gaps")?.attributes ?? {}, h = String(d.full_auto_honesty ?? "").trim();
  return u.available && !u.available("sensor.dsc_hub_uptime") && r.push({
    id: "hub-dark",
    label: "Hub offline",
    detail: "Hub sensors unavailable — Live vitals may be stale.",
    tone: "bad",
    href: "/fleet",
    cta: "Open Fleet",
    priority: 10
  }), s("binary_sensor.dsc_reduced_kit") && r.push({
    id: "reduced-kit",
    label: "Reduced kit",
    detail: "Full Auto keep-up is honesty-limited while kit is reduced.",
    tone: "warn",
    href: "/fleet",
    cta: "Review kit",
    priority: 20
  }), h && s("switch.dsc_hub_tent_full_auto_mode") && r.push({
    id: "keepup",
    label: "Keep-up gaps",
    detail: h,
    tone: "warn",
    href: "/live/climate",
    cta: "Fix Climate",
    priority: 30
  }), f("input_boolean.dsc_pot3_in_service") === "off" && r.push({
    id: "pot3-oos",
    label: "POT3 out of service",
    detail: "Probe fault path — mat vote excluded while OOS.",
    tone: "warn",
    href: "/live/root?pot=3",
    cta: "Inspect Root",
    priority: 40
  }), s("binary_sensor.dsc_clone_dark_period_violation") && r.push({
    id: "dark-viol",
    label: "Clone dark violation",
    detail: "Photoperiod honesty — check Light Cycle.",
    tone: "bad",
    href: "/live/light",
    cta: "Open Light",
    priority: 25
  }), s("binary_sensor.dsc_hub_climate_sensor_fault") && r.push({
    id: "climate-fault",
    label: "Climate sensor fault",
    detail: "Trust the honesty rail — do not invent Got.",
    tone: "bad",
    href: "/live/climate",
    cta: "Open Climate",
    priority: 15
  }), s("binary_sensor.dsc_hub_emergency_failsafe") && r.push({
    id: "failsafe",
    label: "Emergency failsafe",
    detail: "Hub failsafe active.",
    tone: "bad",
    href: "/live/mission",
    cta: "Mission",
    priority: 5
  }), r.sort((y, g) => y.priority - g.priority);
}
function Fy(u) {
  return u[0] ?? null;
}
function Th() {
  const u = $e();
  return E.useMemo(
    () => $y({
      state: u.state,
      available: u.available,
      entity: u.entity
    }),
    [u.state, u.available, u.entity, u.tick]
  );
}
function Wy({ gaps: u }) {
  const r = Th(), f = u ?? r;
  return f.length ? /* @__PURE__ */ c.jsx("div", { className: "dsc-honesty-rail", "aria-label": "Honesty gaps", children: f.slice(0, 6).map((s) => /* @__PURE__ */ c.jsx(de, { icon: "alert", label: s.label, tone: s.tone === "bad" ? "bad" : "warn" }, s.id)) }) : /* @__PURE__ */ c.jsx("div", { className: "dsc-honesty-rail", "aria-label": "Honesty", children: /* @__PURE__ */ c.jsx(de, { icon: "ok", label: "Kit honest", tone: "ok" }) });
}
function Py({ gaps: u }) {
  const r = Th(), s = Fy(u ?? r), d = kt();
  return s ? /* @__PURE__ */ c.jsxs(ge, { className: "dsc-glass dsc-next-rec", title: "Do this next", icon: "alert", children: [
    /* @__PURE__ */ c.jsxs("p", { style: { margin: "0 0 8px" }, children: [
      /* @__PURE__ */ c.jsx("strong", { children: s.label }),
      " — ",
      s.detail
    ] }),
    /* @__PURE__ */ c.jsx(ut, { primary: !0, onClick: () => d(s.href), children: s.cta })
  ] }) : /* @__PURE__ */ c.jsxs(ge, { className: "dsc-glass dsc-next-rec", title: "Next", icon: "ok", children: [
    /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: "No critical gaps — fly Live or open Twin." }),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-row-actions", children: [
      /* @__PURE__ */ c.jsx(ut, { primary: !0, onClick: () => d("/live/twin"), children: "Open Twin" }),
      /* @__PURE__ */ c.jsx(ut, { teal: !0, onClick: () => d("/live/climate"), children: "Climate Want" })
    ] })
  ] });
}
const Iy = [
  "/local/DSC-HUB.js",
  "/local/dsc-system-map-card.js",
  "/hacsfiles/DSC-HUB/DSC-HUB.js"
], ei = /* @__PURE__ */ new Map();
let Fm = !1;
function e0(u) {
  if (document.querySelector(`script[data-dsc-autoload="${u}"]`))
    return ei.get(u) ?? Promise.resolve();
  if (ei.has(u)) return ei.get(u);
  const f = new Promise((s, d) => {
    const h = document.createElement("script");
    h.src = u, h.async = !0, h.dataset.dscAutoload = u, h.onload = () => s(), h.onerror = () => d(new Error(`Failed to load ${u}`)), document.head.appendChild(h);
  });
  return ei.set(u, f), f;
}
async function Rh(u, r = 12e3) {
  if (customElements.get(u)) return !0;
  if (Fm)
    await Promise.allSettled([...ei.values()]);
  else {
    Fm = !0;
    for (const f of Iy)
      try {
        if (await e0(f), customElements.get(u)) return !0;
      } catch {
      }
  }
  try {
    return await Promise.race([
      customElements.whenDefined(u),
      new Promise(
        (f, s) => window.setTimeout(() => s(new Error("timeout")), r)
      )
    ]), !!customElements.get(u);
  } catch {
    return !!customElements.get(u);
  }
}
function t0() {
  const u = gt(), { hass: r } = $e(), f = E.useRef(null), s = E.useRef(
    null
  ), [d, h] = E.useState("loading"), y = u.pathname === "/live/twin" || u.pathname === "/ops/dash";
  return E.useEffect(() => {
    const g = f.current;
    if (!g || s.current) return;
    let v = !1;
    return (async () => {
      h("loading");
      const p = await Rh("dsc-the-dash-card");
      if (v || !f.current) return;
      if (!p) {
        h("missing");
        return;
      }
      const b = document.createElement("dsc-the-dash-card");
      typeof b.setConfig == "function" && b.setConfig({ type: "custom:dsc-the-dash-card" }), r && (b.hass = r), g.appendChild(b), s.current = b, h("ready");
    })(), () => {
      v = !0;
    };
  }, []), E.useEffect(() => {
    s.current && r && (s.current.hass = r);
  }, [r]), /* @__PURE__ */ c.jsxs(
    "div",
    {
      className: `dsc-twin-keepalive${y ? " is-active" : ""}`,
      "aria-hidden": !y,
      "data-status": d,
      children: [
        /* @__PURE__ */ c.jsx("div", { className: "dsc-twin-keepalive-host", ref: f }),
        d === "missing" ? /* @__PURE__ */ c.jsxs("div", { className: "dsc-empty", children: [
          /* @__PURE__ */ c.jsx("strong", { children: "dsc-the-dash-card" }),
          " did not register. Deploy /local/DSC-HUB.js and hard-refresh."
        ] }) : null
      ]
    }
  );
}
const zh = E.createContext(null);
function l0(u) {
  return u === "clone" || u === "compare" || u === "room" || u === "main" ? u : "main";
}
function a0({ children: u }) {
  const [r, f] = Er(), s = l0(r.get("tent") ?? r.get("zone")), d = E.useCallback(
    (y) => {
      const g = new URLSearchParams(r);
      g.set("tent", y), g.delete("zone"), f(g, { replace: !0 });
    },
    [r, f]
  ), h = E.useMemo(() => ({ focus: s, setFocus: d }), [s, d]);
  return /* @__PURE__ */ c.jsx(zh.Provider, { value: h, children: u });
}
function n0() {
  const u = E.useContext(zh);
  return u || {
    focus: "main",
    setFocus: () => {
    }
  };
}
function Nr({
  label: u,
  icon: r,
  onClick: f,
  className: s = ""
}) {
  return /* @__PURE__ */ c.jsx(
    "button",
    {
      type: "button",
      className: `dsc-icon-btn ${s}`.trim(),
      "aria-label": u,
      title: u,
      onClick: f,
      children: /* @__PURE__ */ c.jsx(Vt, { name: r, size: 16 })
    }
  );
}
function Lu({
  items: u,
  label: r = "More actions"
}) {
  const [f, s] = E.useState(!1), d = E.useRef(null);
  return E.useEffect(() => {
    if (!f) return;
    const h = (y) => {
      d.current?.contains(y.target) || s(!1);
    };
    return document.addEventListener("mousedown", h), () => document.removeEventListener("mousedown", h);
  }, [f]), /* @__PURE__ */ c.jsxs("div", { className: "dsc-overflow", ref: d, children: [
    /* @__PURE__ */ c.jsx(Nr, { label: r, icon: "more", onClick: () => s((h) => !h) }),
    f ? /* @__PURE__ */ c.jsx("div", { className: "dsc-overflow-menu", role: "menu", children: u.map((h) => /* @__PURE__ */ c.jsx(
      "button",
      {
        type: "button",
        role: "menuitem",
        onClick: () => {
          s(!1), h.onSelect();
        },
        children: h.label
      },
      h.id
    )) }) : null
  ] });
}
function Tr({
  open: u,
  onClose: r,
  title: f,
  side: s = "right",
  children: d
}) {
  const h = E.useId();
  return E.useEffect(() => {
    if (!u) return;
    const y = (g) => {
      g.key === "Escape" && r();
    };
    return window.addEventListener("keydown", y), () => window.removeEventListener("keydown", y);
  }, [u, r]), /* @__PURE__ */ c.jsxs("div", { className: `dsc-drawer-root${u ? " is-open" : ""}`, "aria-hidden": !u, children: [
    /* @__PURE__ */ c.jsx("div", { className: "dsc-drawer-scrim", onClick: r }),
    /* @__PURE__ */ c.jsxs(
      "aside",
      {
        className: `dsc-drawer-panel ${s}`,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": h,
        children: [
          /* @__PURE__ */ c.jsx(
            "button",
            {
              type: "button",
              className: "dsc-drawer-rail",
              "aria-label": "Close panel",
              onClick: r,
              children: s === "right" ? ">" : "<"
            }
          ),
          /* @__PURE__ */ c.jsxs("div", { className: "dsc-drawer-head", children: [
            /* @__PURE__ */ c.jsx("h2", { id: h, children: f }),
            /* @__PURE__ */ c.jsx(Nr, { label: "Close", icon: "close", onClick: r })
          ] }),
          /* @__PURE__ */ c.jsx("div", { className: "dsc-drawer-body", children: d })
        ]
      }
    )
  ] });
}
const Wm = [
  "var(--dsc-soil-1)",
  "var(--dsc-soil-2)",
  "var(--dsc-soil-3)",
  "var(--dsc-soil-4)"
];
function i0(u) {
  if (!u || !u.trim()) return [];
  const r = u.split(/[|/·]/).map((s) => s.trim()).filter(Boolean), f = [];
  for (const s of r) {
    const d = s.match(/^(.+?)\s*[·:]?\s*(\d+(?:\.\d+)?)\s*%?$/);
    if (d) {
      f.push({ name: d[1].trim(), pct: Number(d[2]) });
      continue;
    }
    const h = s.match(/(\d+(?:\.\d+)?)\s*%\s*(.+)$/);
    if (h) {
      f.push({ name: h[2].trim(), pct: Number(h[1]) });
      continue;
    }
    s && f.push({ name: s, pct: 0 });
  }
  if (f.length && f.every((s) => s.pct === 0)) {
    const s = 100 / f.length;
    return f.map((d) => ({ ...d, pct: s }));
  }
  return f.filter((s) => s.pct > 0);
}
function u0({
  layers: u,
  valid: r,
  emptyLabel: f = "No blend on roster seat"
}) {
  const s = u.reduce((y, g) => y + g.pct, 0), d = r ?? (u.length > 0 && Math.round(s) === 100);
  let h = 0;
  return /* @__PURE__ */ c.jsx("div", { className: "dsc-soil", children: /* @__PURE__ */ c.jsx("div", { className: `dsc-soil-pot${d && u.length ? " is-valid" : ""}`, children: u.length ? u.map((y, g) => {
    const v = h;
    return h += y.pct, /* @__PURE__ */ c.jsx(
      "div",
      {
        className: "dsc-soil-layer",
        style: {
          bottom: `${v}%`,
          height: `${y.pct}%`,
          background: y.color || Wm[g % Wm.length]
        },
        title: `${y.name} ${y.pct}%`,
        children: y.pct >= 12 ? `${y.name} ${Math.round(y.pct)}%` : ""
      },
      `${y.name}-${g}`
    );
  }) : /* @__PURE__ */ c.jsx("div", { className: "dsc-soil-empty", children: f }) }) });
}
const c0 = {
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
function Pn({
  entityId: u,
  label: r,
  step: f
}) {
  const { num: s, available: d, callService: h, entity: y } = $e(), g = d(u), v = y(u), p = s(u, NaN), b = Number(v?.attributes?.min ?? 0), _ = Number(v?.attributes?.max ?? 100), T = f ?? Number(v?.attributes?.step ?? 0.1), [Y, G] = E.useState(String(Number.isFinite(p) ? p : ""));
  E.useEffect(() => {
    Number.isFinite(p) && G(String(p));
  }, [p]);
  const k = () => {
    if (!g) return;
    const U = Number(Y);
    if (!Number.isFinite(U)) {
      G(String(Number.isFinite(p) ? p : ""));
      return;
    }
    const X = Math.min(_, Math.max(b, U));
    h("number", "set_value", { entity_id: u, value: X }), G(String(X));
  };
  return /* @__PURE__ */ c.jsxs("label", { className: `dsc-target-num${g ? "" : " is-disabled"}`, children: [
    /* @__PURE__ */ c.jsx("span", { className: "dsc-target-num-label", children: r }),
    /* @__PURE__ */ c.jsx(
      "input",
      {
        type: "number",
        value: Y,
        disabled: !g,
        min: b,
        max: _,
        step: T,
        onChange: (U) => G(U.target.value),
        onBlur: k,
        onKeyDown: (U) => {
          U.key === "Enter" && U.target.blur();
        }
      }
    )
  ] });
}
function s0({ tent: u, title: r }) {
  const { num: f, available: s } = $e(), d = c0[u], h = f(d.gotTemp), y = f(d.gotRh), g = s(d.gotVpd) ? f(d.gotVpd) : NaN, v = f(d.temp), p = f(d.rhMin), b = f(d.rhMax), _ = (T) => {
    const Y = new CustomEvent("hass-more-info", {
      detail: { entityId: T },
      bubbles: !0,
      composed: !0
    });
    document.querySelector("home-assistant")?.dispatchEvent(Y);
  };
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-tent-targets", children: [
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-tent-targets-head", children: [
      /* @__PURE__ */ c.jsx("strong", { children: r }),
      /* @__PURE__ */ c.jsx(
        Lu,
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
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-got-want", children: [
      /* @__PURE__ */ c.jsxs("span", { children: [
        "Got ",
        Number.isFinite(h) ? h.toFixed(1) : "—",
        "°C /",
        " ",
        Number.isFinite(y) ? y.toFixed(0) : "—",
        "%",
        Number.isFinite(g) ? ` / ${g.toFixed(2)} kPa` : ""
      ] }),
      /* @__PURE__ */ c.jsxs("span", { className: "dsc-muted", children: [
        "Want ",
        Number.isFinite(v) ? v.toFixed(1) : "—",
        "°C · RH",
        " ",
        Number.isFinite(p) ? p.toFixed(0) : "—",
        "–",
        Number.isFinite(b) ? b.toFixed(0) : "—",
        "%"
      ] })
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-target-grid", children: [
      /* @__PURE__ */ c.jsx(Pn, { entityId: d.temp, label: "Temp °C", step: 0.5 }),
      /* @__PURE__ */ c.jsx(Pn, { entityId: d.rhMin, label: "RH min %", step: 1 }),
      /* @__PURE__ */ c.jsx(Pn, { entityId: d.rhMax, label: "RH max %", step: 1 }),
      /* @__PURE__ */ c.jsx(Pn, { entityId: d.vpdMin, label: "VPD min", step: 0.01 }),
      /* @__PURE__ */ c.jsx(Pn, { entityId: d.vpdMax, label: "VPD max", step: 0.01 })
    ] })
  ] });
}
function Ah({
  compact: u,
  emphasize: r
}) {
  const f = r === "clone" ? ["clone", "main"] : ["main", "clone"];
  return /* @__PURE__ */ c.jsx("div", { className: `dsc-target-panel${u ? " is-compact" : ""}`, children: f.map((s) => /* @__PURE__ */ c.jsx(s0, { tent: s, title: s === "main" ? "Main 4×8" : "Clone 2×4" }, s)) });
}
function nt(u, r = "—") {
  return !u || u === "unknown" || u === "unavailable" || u === "none" ? r : u;
}
function Ch(u, r) {
  const f = u(`input_select.dsc_pot${r}_tent`, "unassigned");
  return f === "clone" || f === "main" || f === "unassigned" ? f : "unassigned";
}
function Bu(u) {
  switch (u) {
    case "clone":
      return "Clone 2×4";
    case "main":
      return "Main 4×8";
    case "unassigned":
      return "Unassigned";
    default:
      return u;
  }
}
function Rr(u, r) {
  const { state: f, entity: s } = r, d = s("sensor.dsc_plant_roster_summary")?.attributes?.slots || [], h = Array.isArray(d) ? d.find((g) => String(g.pot) === String(u)) : void 0, y = nt(h?.blend, "");
  return {
    pot: u,
    plantName: nt(f(`text.dsc_pot${u}_plant_name`, "")),
    strainDisplay: nt(f(`sensor.dsc_pot${u}_strain_display`, "")),
    sprout: nt(f(`datetime.dsc_pot${u}_sprout_date`, ""), "—").slice(0, 10),
    days: nt(f(`sensor.dsc_pot${u}_days_since_sprout`, "")),
    stage: nt(f(`sensor.dsc_pot${u}_expected_stage`, "")),
    growthStage: nt(f(`select.dsc_pot${u}_growth_stage`, "")),
    tent: Ch(f, u),
    blend: y,
    recipe: nt(h?.recipe, ""),
    notes: nt(h?.notes, ""),
    layers: i0(y),
    moisture: nt(f(`sensor.dsc_pot${u}_soil_moisture`, "")),
    soilTemp: nt(f(`sensor.dsc_pot${u}_soil_temperature`, "")),
    ec: nt(f(`sensor.dsc_pot${u}_soil_conductivity`, "")),
    ph: nt(f(`sensor.dsc_pot${u}_soil_ph`, "")),
    n: nt(f(`sensor.dsc_pot${u}_soil_nitrogen`, "")),
    p: nt(f(`sensor.dsc_pot${u}_soil_phosphorus`, "")),
    k: nt(f(`sensor.dsc_pot${u}_soil_potassium`, "")),
    need: nt(f(`sensor.dsc_pot${u}_need_summary`, "")),
    rosterSlot: h?.slot ?? null
  };
}
function r0(u) {
  const r = u("sensor.dsc_plant_roster_summary")?.attributes?.slots;
  return Array.isArray(r) ? r : [];
}
function o0(u) {
  return !Number.isFinite(u) || u <= 0 ? "—" : u >= 86400 ? `${(u / 86400).toFixed(1)}d` : u >= 3600 ? `${(u / 3600).toFixed(1)}h` : `${Math.round(u / 60)}m`;
}
const f0 = [
  { id: "binary_sensor.dsc_hub_emergency_failsafe", label: "Emergency failsafe" },
  { id: "binary_sensor.dsc_hub_climate_sensor_fault", label: "Climate sensor fault" },
  { id: "binary_sensor.dsc_hub_aux_sensor_fault", label: "Aux sensor fault" },
  { id: "binary_sensor.dsc_hub_root_zone_sensor_fault", label: "Root-zone probes" },
  { id: "binary_sensor.dsc_clone_dark_period_violation", label: "Clone dark violation" },
  { id: "binary_sensor.dsc_reduced_kit", label: "Reduced kit" }
];
function d0() {
  const { state: u, num: r, available: f, entity: s, tick: d } = $e(), h = kt(), [y, g] = E.useState(!1), v = f("sensor.dsc_hub_uptime"), p = r("sensor.dsc_active_alert_count", 0), b = r("sensor.dsc_hub_tent_temperature"), _ = r("sensor.dsc_hub_tent_humidity"), T = r("sensor.dsc_hub_vpd_kpa"), Y = r("sensor.dsc_hub_room_temperature"), G = r("sensor.dsc_hub_clone_temperature"), k = r("sensor.dsc_hub_clone_humidity"), X = u("binary_sensor.dsc_hub_panel_link") === "on", V = u("sensor.dsc_hub_heartbeat", "NO BEAT"), B = f("sensor.dsc_hub_heartbeat"), le = u("sensor.dsc_fleet_version_status", "—"), ce = u("switch.dsc_hub_manual_takeover") === "on", se = u("switch.dsc_hub_tent_manual_override") === "on", F = u("switch.dsc_hub_tent_full_auto_mode") === "on", xe = u("binary_sensor.dsc_reduced_kit") === "on", we = String(s("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? ""), Fe = F && !ce, Ye = f0.filter((C) => u(C.id) === "on"), Le = [1, 2, 3, 4].map((C) => Rr(C, { state: u, entity: s }));
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      Kt,
      {
        icon: "mission",
        title: "Mission",
        subtitle: "Job line — mode, vitals, seats, demands, faults. Charts live on Climate.",
        primaryAction: /* @__PURE__ */ c.jsx(ut, { teal: !0, onClick: () => h("/live/twin"), children: "Open Twin" }),
        actions: /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsx(ut, { primary: !0, onClick: () => h("/live/climate"), children: "Climate Want" }),
          /* @__PURE__ */ c.jsx(Nr, { label: "Search", icon: "search", onClick: () => g(!0) }),
          /* @__PURE__ */ c.jsx(
            Lu,
            {
              label: "Mission settings",
              items: [
                {
                  id: "climate",
                  label: "Open Climate",
                  onSelect: () => h("/live/climate")
                },
                {
                  id: "fleet",
                  label: "Open Fleet",
                  onSelect: () => h("/fleet")
                }
              ]
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-status-strip", children: [
      /* @__PURE__ */ c.jsx(
        de,
        {
          icon: v ? "ok" : "alert",
          label: v ? "HUB ONLINE" : "HUB OFFLINE",
          tone: v ? "ok" : "bad"
        }
      ),
      /* @__PURE__ */ c.jsx(
        de,
        {
          label: X ? "PANEL ESP-NOW" : f("sensor.dsc_control_wifi_rssi") ? "PANEL HA-ONLY" : "PANEL OFFLINE",
          tone: X ? "ok" : f("sensor.dsc_control_wifi_rssi") ? "warn" : "bad"
        }
      ),
      /* @__PURE__ */ c.jsx(
        de,
        {
          icon: B ? "ok" : "alert",
          label: B ? `BEAT ${V}` : "NO BEAT",
          tone: B ? "ok" : "bad"
        }
      ),
      /* @__PURE__ */ c.jsx(
        de,
        {
          label: `UP ${o0(r("sensor.dsc_hub_uptime"))}`,
          tone: v ? "ok" : "muted"
        }
      ),
      /* @__PURE__ */ c.jsx(
        de,
        {
          icon: p === 0 ? "ok" : "alert",
          label: p === 0 ? "All clear" : `${p} alert(s)`,
          tone: p === 0 ? "ok" : "bad",
          pulse: p > 0
        }
      ),
      /* @__PURE__ */ c.jsx(
        de,
        {
          label: le === "ok" ? "FLEET OK" : le === "warn" ? "FLEET WARN" : "FLEET DRIFT",
          tone: le === "ok" ? "ok" : le === "warn" ? "warn" : "bad"
        }
      ),
      F ? /* @__PURE__ */ c.jsx(de, { icon: "ok", label: "FULL AUTO", tone: "ok", pulse: !0 }) : null,
      Fe ? /* @__PURE__ */ c.jsx(de, { label: "AUTO-DRIVEN", tone: "ok" }) : null,
      ce ? /* @__PURE__ */ c.jsx(de, { icon: "alert", label: "MANUAL TAKEOVER", tone: "warn", pulse: !0 }) : null,
      se ? /* @__PURE__ */ c.jsx(de, { icon: "alert", label: "FAN OVERRIDE", tone: "warn", pulse: !0 }) : null,
      F && xe ? /* @__PURE__ */ c.jsx(de, { icon: "alert", label: we || "REDUCED KIT", tone: "warn", pulse: !0 }) : null
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(
        Ae,
        {
          label: "Tent temp",
          value: Number.isFinite(b) ? b.toFixed(1) : "—",
          unit: "°C",
          sub: `Room ${Number.isFinite(Y) ? Y.toFixed(1) : "—"} °C`
        }
      ) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(
        Ae,
        {
          label: "Tent RH",
          value: Number.isFinite(_) ? _.toFixed(0) : "—",
          unit: "%",
          sub: `VPD ${Number.isFinite(T) ? T.toFixed(2) : "—"} kPa`
        }
      ) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(
        Ae,
        {
          label: "Clone",
          value: Number.isFinite(G) ? G.toFixed(1) : "—",
          unit: "°C",
          sub: `RH ${Number.isFinite(k) ? k.toFixed(0) : "—"}%`
        }
      ) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(
        Ae,
        {
          label: "Surface",
          value: u("sensor.dsc_ha_surface_version", "7.0.0"),
          sub: `Fleet ${le}`,
          tone: "ok"
        }
      ) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(Py, {}) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsxs(ge, { className: "dsc-glass", title: "Mode", icon: "climate", children: [
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-mode-row", children: [
          /* @__PURE__ */ c.jsx(
            Ce,
            {
              entityId: "switch.dsc_hub_tent_full_auto_mode",
              label: "Full Auto",
              icon: "ok"
            }
          ),
          /* @__PURE__ */ c.jsx(
            Ce,
            {
              entityId: "switch.dsc_hub_manual_takeover",
              label: "Manual takeover",
              icon: "alert"
            }
          ),
          /* @__PURE__ */ c.jsx(
            Ce,
            {
              entityId: "switch.dsc_hub_tent_manual_override",
              label: "Fan override",
              icon: "climate"
            }
          ),
          /* @__PURE__ */ c.jsx(
            Ce,
            {
              entityId: "switch.dsc_hub_humidifier_intake_routing",
              label: "Hum intake routing",
              icon: "climate"
            }
          ),
          /* @__PURE__ */ c.jsx(
            Ce,
            {
              entityId: "switch.dsc_hub_recirc_de_strat_pulse",
              label: "RECIRC de-strat",
              icon: "climate"
            }
          )
        ] }),
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-mode-selects", children: [
          /* @__PURE__ */ c.jsx(
            Ou,
            {
              entityId: "select.dsc_hub_control_strategy",
              label: "Strategy",
              icon: "climate"
            }
          ),
          /* @__PURE__ */ c.jsx(
            Ou,
            {
              entityId: "select.dsc_hub_priority_tent",
              label: "Priority tent",
              icon: "tent"
            }
          )
        ] }),
        F && (xe || we) ? /* @__PURE__ */ c.jsxs("p", { className: "dsc-honesty", children: [
          /* @__PURE__ */ c.jsx(de, { icon: "alert", label: "Honesty", tone: "warn" }),
          " ",
          we || "Full Auto armed on reduced kit — capacity offline paths apply."
        ] }) : null
      ] }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ge, { className: "dsc-glass", title: "Targets", icon: "gauge", children: /* @__PURE__ */ c.jsx(Ah, { compact: !0 }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ge, { className: "dsc-glass", title: "Plant seats", icon: "seat", children: /* @__PURE__ */ c.jsx("div", { className: "dsc-chip-row", children: Le.map((C) => /* @__PURE__ */ c.jsxs(
        "button",
        {
          type: "button",
          className: "dsc-chip dsc-chip--ok",
          onClick: () => h(`/live/root?pot=${C.pot}`),
          title: C.blend || "Open plant seat",
          children: [
            "P",
            C.pot,
            " ",
            C.plantName !== "—" ? C.plantName : "—",
            " · ",
            Bu(C.tent),
            C.blend ? ` · ${C.blend.slice(0, 28)}` : ""
          ]
        },
        C.pot
      )) }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsxs(ge, { className: `dsc-glass${Fe ? " is-auto" : ""}`, title: "Demands", icon: "climate", children: [
        Fe ? /* @__PURE__ */ c.jsx("div", { className: "dsc-chip-row", style: { marginBottom: 8 }, children: /* @__PURE__ */ c.jsx(de, { label: "AUTO", tone: "ok", icon: "ok" }) }) : null,
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-demand-row", children: [
          /* @__PURE__ */ c.jsx(Ce, { entityId: "switch.dsc_hub_heater_demand", label: "Heat", icon: "climate" }),
          /* @__PURE__ */ c.jsx(
            Ce,
            {
              entityId: "switch.dsc_hub_ac_demand",
              label: "Cool",
              icon: "climate",
              warnWhenMissing: u("binary_sensor.dsc_ac_capacity_offline") === "on" ? "AC ○" : void 0
            }
          ),
          /* @__PURE__ */ c.jsx(Ce, { entityId: "switch.dsc_hub_humidifier_demand", label: "Hum", icon: "climate" }),
          /* @__PURE__ */ c.jsx(
            Ce,
            {
              entityId: "switch.dsc_hub_dehumidifier_demand",
              label: "Dehum",
              icon: "climate"
            }
          ),
          /* @__PURE__ */ c.jsx(Ce, { entityId: "switch.dsc_hub_grow_mat_demand", label: "Mat", icon: "root" }),
          /* @__PURE__ */ c.jsx(
            Ce,
            {
              entityId: "switch.dsc_hub_clone_humidifier_demand",
              label: "C-Hum",
              icon: "clone"
            }
          ),
          /* @__PURE__ */ c.jsx(
            Ce,
            {
              entityId: "light.dsc_hub_sf1000_dimmer",
              label: "SF1000",
              icon: "lighting",
              showBrightness: !0
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsxs(ge, { className: "dsc-glass", title: "Fans", icon: "climate", children: [
        /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { margin: "0 0 8px" }, children: se ? "Fan override ON — sliders write percentage." : "Enable Fan override to set duty." }),
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-fan-stack", children: [
          /* @__PURE__ */ c.jsx(
            Xl,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_main",
              label: "Intake Main",
              disabled: !se
            }
          ),
          /* @__PURE__ */ c.jsx(
            Xl,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_2x4",
              label: "Intake 2×4",
              disabled: !se
            }
          ),
          /* @__PURE__ */ c.jsx(
            Xl,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_room",
              label: "Exhaust room",
              disabled: !se
            }
          ),
          /* @__PURE__ */ c.jsx(
            Xl,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_outside",
              label: "Exhaust outside",
              disabled: !se
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsx(ge, { className: "dsc-glass", title: "Pot ESP-NOW", icon: "root", children: /* @__PURE__ */ c.jsxs("div", { className: "dsc-chip-row", children: [
        /* @__PURE__ */ c.jsx(Nu, { entityId: "binary_sensor.dsc_hub_pot1_esp_now_link", label: "P1", icon: "ok" }),
        /* @__PURE__ */ c.jsx(Nu, { entityId: "binary_sensor.dsc_hub_pot2_esp_now_link", label: "P2", icon: "ok" }),
        /* @__PURE__ */ c.jsx(Nu, { entityId: "binary_sensor.dsc_hub_pot3_esp_now_link", label: "P3", icon: "ok" }),
        /* @__PURE__ */ c.jsx(Nu, { entityId: "binary_sensor.dsc_hub_pot4_esp_now_link", label: "P4", icon: "ok" })
      ] }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsx(ge, { className: "dsc-glass", title: "Faults / alerts", icon: "alert", children: Ye.length === 0 && p === 0 ? /* @__PURE__ */ c.jsx("div", { className: "dsc-empty dsc-empty--ok", children: "No active faults — all clear." }) : /* @__PURE__ */ c.jsxs("ul", { className: "dsc-fault-list", children: [
        Ye.map((C) => /* @__PURE__ */ c.jsxs("li", { children: [
          /* @__PURE__ */ c.jsx(de, { label: C.label, tone: "bad", pulse: !0, icon: "alert" }),
          /* @__PURE__ */ c.jsx("span", { className: "dsc-muted", children: C.id })
        ] }, C.id)),
        p > 0 && Ye.length === 0 ? /* @__PURE__ */ c.jsxs("li", { children: [
          /* @__PURE__ */ c.jsx(de, { label: `${p} system alert(s)`, tone: "bad", pulse: !0, icon: "alert" }),
          /* @__PURE__ */ c.jsx("span", { className: "dsc-muted", children: "See Fleet for entity detail" })
        ] }) : null
      ] }) }) })
    ] }),
    /* @__PURE__ */ c.jsx(Tr, { open: y, onClose: () => g(!1), title: "Quick jump", children: /* @__PURE__ */ c.jsx("div", { className: "dsc-chip-row", children: [
      { path: "/live/climate", label: "Climate" },
      { path: "/live/twin", label: "Twin" },
      { path: "/live/root", label: "Root" },
      { path: "/live/light", label: "Light" },
      { path: "/grow/compose", label: "Compose" },
      { path: "/grow/roster", label: "Roster" },
      { path: "/fleet", label: "Fleet" }
    ].map((C) => /* @__PURE__ */ c.jsx(
      "button",
      {
        type: "button",
        className: "dsc-btn teal",
        onClick: () => {
          g(!1), h(C.path);
        },
        children: C.label
      },
      C.path
    )) }) })
  ] });
}
function m0(u) {
  if (typeof u.lu == "number" && Number.isFinite(u.lu))
    return u.lu * 1e3;
  const r = u.last_changed || u.last_updated;
  if (r) {
    const f = Date.parse(r);
    return Number.isFinite(f) ? f : null;
  }
  return null;
}
function h0(u) {
  const r = u.s ?? u.state, f = typeof r == "number" ? r : Number(r);
  return Number.isFinite(f) ? f : null;
}
function p0(u, r) {
  if (u.length <= r) return u;
  const f = [], s = (u.length - 1) / (r - 1);
  for (let d = 0; d < r; d++)
    f.push(u[Math.round(d * s)]);
  return f;
}
function v0(u, r = 6, f = 96) {
  const { hass: s, callWS: d, available: h } = $e(), [y, g] = E.useState([]), [v, p] = E.useState(!0), [b, _] = E.useState(null);
  return E.useEffect(() => {
    let T = !1;
    async function Y() {
      if (!s?.callWS || !u) {
        g([]), p(!1);
        return;
      }
      p(!0), _(null);
      const G = /* @__PURE__ */ new Date(), k = new Date(G.getTime() - r * 3600 * 1e3);
      try {
        const U = await d({
          type: "history/history_during_period",
          start_time: k.toISOString(),
          end_time: G.toISOString(),
          significant_changes_only: !1,
          minimal_response: !0,
          no_attributes: !0,
          entity_ids: [u]
        });
        if (T) return;
        let X = [];
        Array.isArray(U) ? X = U[0] || [] : U && typeof U == "object" && (X = U[u] || []);
        const V = [];
        for (const B of X) {
          const le = m0(B), ce = h0(B);
          le == null || ce == null || V.push({ t: le, v: ce });
        }
        V.sort((B, le) => B.t - le.t), g(p0(V, f));
      } catch (U) {
        T || (_(U instanceof Error ? U.message : "history unavailable"), g([]));
      } finally {
        T || p(!1);
      }
    }
    return Y(), () => {
      T = !0;
    };
  }, [s, d, u, r, f, h]), { points: y, loading: v, error: b };
}
function Yt(u, r) {
  const f = r?.maxPoints ?? 96, s = r?.hours ?? 6, { num: d, available: h, tick: y } = $e(), { points: g } = v0(u, s, f), [v, p] = E.useState([]), [b, _] = E.useState(void 0), T = E.useRef(null), Y = E.useRef(!1);
  return E.useEffect(() => {
    Y.current = !1, p([]), T.current = null, _(void 0);
  }, [u]), E.useEffect(() => {
    if (g.length && !Y.current) {
      Y.current = !0;
      const k = g[g.length - 1]?.v;
      Number.isFinite(k) && (T.current = k);
    }
  }, [g]), E.useEffect(() => {
    if (!u || !h(u)) return;
    const k = d(u);
    if (!Number.isFinite(k)) return;
    if (T.current === k && v.length > 0) {
      const X = Date.now(), V = v[v.length - 1]?.t ?? 0;
      if (X - V < 4e3) return;
    }
    T.current = k;
    const U = Date.now();
    p((X) => [...X, { t: U, v: k }].slice(-f)), _(U);
  }, [u, y, h, d, f]), { series: E.useMemo(() => {
    if (!g.length && !v.length) return v;
    if (!v.length) return g;
    if (!g.length) return v;
    const k = v[0]?.t ?? 0, X = [...g.filter((V) => V.t < k - 500), ...v];
    return X.length > f ? X.slice(-f) : X;
  }, [g, v, f]), lastSyncAt: b };
}
const Tu = [
  "var(--dsc-neon)",
  "var(--dsc-teal)",
  "var(--dsc-amber)",
  "var(--dsc-gray-5)"
];
function Pm(u) {
  const r = Math.max(...u, 1), f = 10 ** Math.floor(Math.log10(r));
  return Math.ceil(r / f) * f;
}
function Im(u, r = !1) {
  const f = Math.min(...u);
  if (r && f >= 0) return 0;
  const s = Math.abs(f) || 1, d = 10 ** Math.floor(Math.log10(s));
  return Math.floor(f / d) * d;
}
function eh(u, r, f = 0.08) {
  if (!Number.isFinite(u) || !Number.isFinite(r)) return { min: 0, max: 1 };
  if (r <= u) return { min: u - 1, max: r + 1 };
  const d = (r - u) * f || 1;
  return { min: u - d, max: r + d };
}
function g0(u, r, f, s, d, h, y, g) {
  if (!u.length) return "";
  const v = Math.max(h - d, 1e-6), p = Math.max(g - y, 1), b = r - s.l - s.r, _ = f - s.t - s.b;
  return u.map((T, Y) => {
    const G = s.l + (T.t - y) / p * b, k = s.t + (1 - (T.v - d) / v) * _;
    return `${Y === 0 ? "M" : "L"}${G.toFixed(1)} ${k.toFixed(1)}`;
  }).join(" ");
}
function th(u) {
  const r = new Date(u), f = String(r.getHours()).padStart(2, "0"), s = String(r.getMinutes()).padStart(2, "0");
  return `${f}:${s}`;
}
function In(u, r, f, s, d) {
  const h = Math.max(f - r, 1e-6);
  return d.t + (1 - (u - r) / h) * (s - d.t - d.b);
}
function lh(u, r, f) {
  const s = u.filter((d) => (d.axis || "left") === r).flatMap((d) => d.series.map((h) => h.v));
  if (!s.length)
    return r === "right" ? { min: 0, max: 100 } : { min: 0, max: 1 };
  if (r === "right") {
    const d = Math.min(...s, 0);
    return Math.max(...s, 100) <= 100 && d >= 0 ? { min: 0, max: 100 } : eh(Im(s, !0), Pm(s));
  }
  return eh(Im(s), Pm(s));
}
function Pa({
  series: u,
  height: r = 180,
  unit: f = "",
  live: s = !0,
  emptyLabel: d = "No history yet",
  lastSyncAt: h,
  targets: y = []
}) {
  const g = E.useId().replace(/:/g, ""), v = 640, p = u.some((C) => C.axis === "right"), b = { l: 40, r: p ? 40 : 14, t: 16, b: 28 }, _ = E.useRef(null), [T, Y] = E.useState(null), [G, k] = E.useState(!1), [U, X] = E.useState(0), V = E.useRef(void 0);
  E.useEffect(() => {
    h != null && V.current !== h && (V.current = h, X((C) => C + 1));
  }, [h]);
  const B = E.useMemo(() => {
    const C = u.flatMap((ee) => ee.series);
    if (!C.length) return null;
    const I = lh(u, "left"), P = lh(u, "right"), M = Math.min(...C.map((ee) => ee.t)), q = Math.max(...C.map((ee) => ee.t)), Z = u.map((ee, pe) => {
      const j = ee.axis || "left", H = j === "right" ? P : I;
      return {
        ...ee,
        axis: j,
        color: ee.color || Tu[pe % Tu.length],
        d: g0(ee.series, v, r, b, H.min, H.max, M, q),
        last: ee.series.length ? ee.series[ee.series.length - 1] : null,
        dom: H
      };
    });
    return { left: I, right: P, t0: M, t1: q, paths: Z };
  }, [u, r, p]), le = E.useMemo(() => {
    if (!B) return [];
    const C = 4, I = [];
    for (let P = 0; P <= C; P++) {
      const M = P / C, q = B.left.max - M * (B.left.max - B.left.min), Z = b.t + M * (r - b.t - b.b);
      I.push({ y: Z, label: q.toFixed(Math.abs(q) >= 100 ? 0 : 1) });
    }
    return I;
  }, [B, r]), ce = E.useMemo(() => {
    if (!B || !p) return [];
    const C = 4, I = [];
    for (let P = 0; P <= C; P++) {
      const M = P / C, q = B.right.max - M * (B.right.max - B.right.min), Z = b.t + M * (r - b.t - b.b);
      I.push({ y: Z, label: q.toFixed(Math.abs(q) >= 100 ? 0 : 1) });
    }
    return I;
  }, [B, r, p]), se = E.useMemo(() => {
    if (!B) return [];
    const C = 5, I = [], P = Math.max(B.t1 - B.t0, 1), M = v - b.l - b.r;
    for (let q = 0; q < C; q++) {
      const Z = q / (C - 1), ee = B.t0 + Z * P;
      I.push({ x: b.l + Z * M, label: th(ee) });
    }
    return I;
  }, [B]), F = E.useCallback(
    (C) => {
      const I = _.current;
      if (!I || !B) return null;
      const P = I.getBoundingClientRect(), M = (C - P.left) / Math.max(P.width, 1) * v, q = v - b.l - b.r, Z = Math.min(v - b.r, Math.max(b.l, M)), ee = (Z - b.l) / Math.max(q, 1);
      return { t: B.t0 + ee * Math.max(B.t1 - B.t0, 1), x: Z };
    },
    [B]
  ), xe = (C) => {
    if (G) return;
    const I = F(C.clientX);
    I && Y(I);
  }, we = () => {
    G || Y(null);
  }, Fe = (C) => {
    const I = F(C.clientX);
    if (I) {
      if (G && T && Math.abs(T.x - I.x) < 8) {
        k(!1), Y(null);
        return;
      }
      k(!0), Y(I);
    }
  }, Ye = E.useMemo(() => !B || !T ? [] : B.paths.map((C) => {
    if (!C.series.length) return { id: C.id, label: C.label, color: C.color, v: null, unit: C.unit || "" };
    let I = C.series[0], P = Math.abs(I.t - T.t);
    for (const q of C.series) {
      const Z = Math.abs(q.t - T.t);
      Z < P && (I = q, P = Z);
    }
    const M = In(I.v, C.dom.min, C.dom.max, r, b);
    return {
      id: C.id,
      label: C.label,
      color: C.color,
      v: I.v,
      unit: C.unit || "",
      y: M,
      x: b.l + (I.t - B.t0) / Math.max(B.t1 - B.t0, 1) * (v - b.l - b.r)
    };
  }), [B, T, r]), Le = B?.paths[0]?.last?.v ?? null;
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-chart", style: { position: "relative", width: "100%" }, children: [
    /* @__PURE__ */ c.jsxs(
      "svg",
      {
        ref: _,
        viewBox: `0 0 ${v} ${r}`,
        width: "100%",
        height: r,
        role: "img",
        "aria-label": "Live chart",
        className: "dsc-chart-svg",
        onPointerMove: xe,
        onPointerLeave: we,
        onPointerDown: Fe,
        children: [
          /* @__PURE__ */ c.jsxs("defs", { children: [
            B?.paths.map((C) => /* @__PURE__ */ c.jsxs("linearGradient", { id: `fill-${g}-${C.id}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ c.jsx("stop", { offset: "0%", stopColor: C.color, stopOpacity: "0.28" }),
              /* @__PURE__ */ c.jsx("stop", { offset: "100%", stopColor: C.color, stopOpacity: "0" })
            ] }, C.id)),
            /* @__PURE__ */ c.jsxs("filter", { id: `glow-${g}`, x: "-40%", y: "-40%", width: "180%", height: "180%", children: [
              /* @__PURE__ */ c.jsx("feGaussianBlur", { stdDeviation: "2.8", result: "b" }),
              /* @__PURE__ */ c.jsxs("feMerge", { children: [
                /* @__PURE__ */ c.jsx("feMergeNode", { in: "b" }),
                /* @__PURE__ */ c.jsx("feMergeNode", { in: "SourceGraphic" })
              ] })
            ] }),
            /* @__PURE__ */ c.jsxs("filter", { id: `glow-soft-${g}`, x: "-50%", y: "-50%", width: "200%", height: "200%", children: [
              /* @__PURE__ */ c.jsx("feGaussianBlur", { stdDeviation: "4.2", result: "b" }),
              /* @__PURE__ */ c.jsx("feMerge", { children: /* @__PURE__ */ c.jsx("feMergeNode", { in: "b" }) })
            ] })
          ] }),
          le.map((C) => /* @__PURE__ */ c.jsxs("g", { children: [
            /* @__PURE__ */ c.jsx(
              "line",
              {
                x1: b.l,
                x2: v - b.r,
                y1: C.y,
                y2: C.y,
                stroke: "var(--dsc-gray-3)",
                strokeWidth: "1",
                strokeDasharray: "3 4"
              }
            ),
            /* @__PURE__ */ c.jsx(
              "text",
              {
                x: b.l - 6,
                y: C.y + 3,
                textAnchor: "end",
                fill: "var(--dsc-gray-5)",
                fontSize: "9",
                fontFamily: "var(--dsc-mono)",
                children: C.label
              }
            )
          ] }, `L${C.y}`)),
          ce.map((C) => /* @__PURE__ */ c.jsx(
            "text",
            {
              x: v - b.r + 6,
              y: C.y + 3,
              textAnchor: "start",
              fill: "var(--dsc-teal)",
              fontSize: "9",
              fontFamily: "var(--dsc-mono)",
              opacity: 0.85,
              children: C.label
            },
            `R${C.y}`
          )),
          se.map((C) => /* @__PURE__ */ c.jsx(
            "text",
            {
              x: C.x,
              y: r - 8,
              textAnchor: "middle",
              fill: "var(--dsc-gray-5)",
              fontSize: "9",
              fontFamily: "var(--dsc-mono)",
              children: C.label
            },
            C.x
          )),
          B ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
            y.map((C, I) => {
              const P = C.axis || "left", M = P === "right" ? B.right : B.left, q = C.color || (P === "right" ? "var(--dsc-teal)" : "var(--dsc-amber)");
              if (C.min != null && C.max != null) {
                const ee = In(C.max, M.min, M.max, r, b), pe = In(C.min, M.min, M.max, r, b);
                return /* @__PURE__ */ c.jsxs("g", { children: [
                  /* @__PURE__ */ c.jsx(
                    "rect",
                    {
                      x: b.l,
                      y: Math.min(ee, pe),
                      width: v - b.l - b.r,
                      height: Math.abs(pe - ee),
                      fill: q,
                      opacity: 0.08
                    }
                  ),
                  /* @__PURE__ */ c.jsx(
                    "line",
                    {
                      x1: b.l,
                      x2: v - b.r,
                      y1: ee,
                      y2: ee,
                      stroke: q,
                      strokeWidth: "1",
                      strokeDasharray: "4 4",
                      opacity: 0.7
                    }
                  ),
                  /* @__PURE__ */ c.jsx(
                    "line",
                    {
                      x1: b.l,
                      x2: v - b.r,
                      y1: pe,
                      y2: pe,
                      stroke: q,
                      strokeWidth: "1",
                      strokeDasharray: "4 4",
                      opacity: 0.7
                    }
                  )
                ] }, `tg-${I}`);
              }
              if (C.value == null || !Number.isFinite(C.value)) return null;
              const Z = In(C.value, M.min, M.max, r, b);
              return /* @__PURE__ */ c.jsxs("g", { children: [
                /* @__PURE__ */ c.jsx(
                  "line",
                  {
                    x1: b.l,
                    x2: v - b.r,
                    y1: Z,
                    y2: Z,
                    stroke: q,
                    strokeWidth: "1.2",
                    strokeDasharray: "5 4",
                    opacity: 0.85
                  }
                ),
                C.label ? /* @__PURE__ */ c.jsx(
                  "text",
                  {
                    x: v - b.r - 2,
                    y: Z - 4,
                    textAnchor: "end",
                    fill: q,
                    fontSize: "8",
                    fontFamily: "var(--dsc-mono)",
                    children: C.label
                  }
                ) : null
              ] }, `tg-${I}`);
            }),
            B.paths.map((C) => {
              if (!C.d || C.series.length === 0) return null;
              const I = C.series.length >= 2 ? `${C.d} L${v - b.r} ${r - b.b} L${b.l} ${r - b.b} Z` : "", P = C.last, M = P && B ? b.l + (P.t - B.t0) / Math.max(B.t1 - B.t0, 1) * (v - b.l - b.r) : 0, q = P ? In(P.v, C.dom.min, C.dom.max, r, b) : 0;
              return /* @__PURE__ */ c.jsxs("g", { className: "dsc-chart-series", children: [
                I ? /* @__PURE__ */ c.jsx("path", { d: I, fill: `url(#fill-${g}-${C.id})`, opacity: 0.9, className: "dsc-chart-fill" }) : null,
                /* @__PURE__ */ c.jsx(
                  "path",
                  {
                    d: C.d,
                    fill: "none",
                    stroke: C.color,
                    strokeWidth: "4.5",
                    strokeLinejoin: "round",
                    strokeLinecap: "round",
                    filter: `url(#glow-soft-${g})`,
                    opacity: 0.35,
                    className: "dsc-chart-glow"
                  }
                ),
                /* @__PURE__ */ c.jsx(
                  "path",
                  {
                    d: C.d,
                    fill: "none",
                    stroke: C.color,
                    strokeWidth: "2.2",
                    strokeLinejoin: "round",
                    strokeLinecap: "round",
                    filter: `url(#glow-${g})`,
                    opacity: 0.95,
                    className: "dsc-chart-core"
                  }
                ),
                s && P && C.series.length >= 2 ? /* @__PURE__ */ c.jsxs("g", { className: "dsc-chart-pulse-wrap", children: [
                  /* @__PURE__ */ c.jsx(
                    "path",
                    {
                      className: "dsc-chart-pulse",
                      d: C.d,
                      fill: "none",
                      stroke: C.color,
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
                  /* @__PURE__ */ c.jsx(
                    "circle",
                    {
                      cx: M,
                      cy: q,
                      r: 4,
                      fill: C.color,
                      className: "dsc-chart-tip",
                      filter: `url(#glow-${g})`
                    }
                  )
                ] }, `pulse-${U}-${C.id}`) : P ? /* @__PURE__ */ c.jsx("circle", { cx: M, cy: q, r: 3.2, fill: C.color, opacity: 0.9 }) : null
              ] }, C.id);
            }),
            T ? /* @__PURE__ */ c.jsxs("g", { className: "dsc-chart-crosshair", children: [
              /* @__PURE__ */ c.jsx(
                "line",
                {
                  x1: T.x,
                  x2: T.x,
                  y1: b.t,
                  y2: r - b.b,
                  stroke: "var(--dsc-white)",
                  strokeOpacity: 0.35,
                  strokeWidth: "1"
                }
              ),
              Ye.map(
                (C) => C.v == null || C.y == null ? null : /* @__PURE__ */ c.jsx(
                  "circle",
                  {
                    cx: C.x ?? T.x,
                    cy: C.y,
                    r: 4,
                    fill: C.color,
                    stroke: "var(--dsc-black)",
                    strokeWidth: "1"
                  },
                  C.id
                )
              )
            ] }) : null
          ] }) : /* @__PURE__ */ c.jsx(
            "text",
            {
              x: v / 2,
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
    T && B ? /* @__PURE__ */ c.jsxs(
      "div",
      {
        className: "dsc-chart-tooltip",
        style: {
          left: `${Math.min(92, Math.max(8, T.x / v * 100))}%`
        },
        children: [
          /* @__PURE__ */ c.jsx("div", { className: "dsc-chart-tooltip-time", children: th(T.t) }),
          Ye.map(
            (C) => C.v == null ? null : /* @__PURE__ */ c.jsxs("div", { className: "dsc-chart-tooltip-row", children: [
              /* @__PURE__ */ c.jsx("i", { style: { background: C.color } }),
              /* @__PURE__ */ c.jsxs("span", { children: [
                C.label || C.id,
                " ",
                C.v.toFixed(C.v >= 100 ? 0 : 1),
                C.unit ? ` ${C.unit}` : ""
              ] })
            ] }, C.id)
          )
        ]
      }
    ) : null,
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-chart-legend", children: [
      u.filter((C) => C.label).map((C, I) => /* @__PURE__ */ c.jsxs("span", { className: "dsc-chart-legend-item", children: [
        /* @__PURE__ */ c.jsx("i", { style: { background: C.color || Tu[I % Tu.length] } }),
        C.label
      ] }, C.id)),
      Le != null ? /* @__PURE__ */ c.jsxs("span", { className: "dsc-chart-last", children: [
        Le.toFixed(1),
        f ? ` ${f}` : u[0]?.unit ? ` ${u[0].unit}` : ""
      ] }) : null
    ] })
  ] });
}
function y0(u, r = 280) {
  const [f, s] = E.useState(u);
  return E.useEffect(() => {
    if (!Number.isFinite(u)) {
      s(u);
      return;
    }
    const d = Number.isFinite(f) ? f : u, h = performance.now();
    let y = 0;
    const g = (v) => {
      const p = Math.min(1, (v - h) / r), b = 1 - (1 - p) ** 3;
      s(d + (u - d) * b), p < 1 && (y = requestAnimationFrame(g));
    };
    return y = requestAnimationFrame(g), () => cancelAnimationFrame(y);
  }, [u, r]), f;
}
function ah(u, r, f, s) {
  return { x: u + f * Math.cos(s), y: r + f * Math.sin(s) };
}
function Fa({
  value: u,
  min: r = 0,
  max: f = 100,
  label: s,
  unit: d = "",
  target: h,
  band: y,
  extrema: g
}) {
  const v = y0(Number.isFinite(u) ? u : r), p = Math.min(f, Math.max(r, Number.isFinite(v) ? v : r)), b = Math.max(f - r, 1e-6), _ = (p - r) / b, T = 46, Y = 2 * Math.PI * T * 0.75, G = Y * _, k = (B) => {
    const le = Math.min(1, Math.max(0, (B - r) / b));
    return Math.PI - le * Math.PI;
  }, U = y && Number.isFinite(u) ? u >= y.min && u <= y.max : !0, X = Number.isFinite(u) ? U ? "var(--dsc-neon)" : "var(--dsc-amber)" : "var(--dsc-gray-4)", V = [];
  return y && V.push({ v: y.min, kind: "band" }, { v: y.max, kind: "band" }), g?.min != null && V.push({ v: g.min, kind: "ext" }), g?.max != null && V.push({ v: g.max, kind: "ext" }), h != null && Number.isFinite(h) && V.push({ v: h, kind: "target" }), /* @__PURE__ */ c.jsxs("div", { className: `dsc-gauge${!U && Number.isFinite(u) ? " is-warn" : ""}`, children: [
    /* @__PURE__ */ c.jsxs("svg", { viewBox: "0 0 120 90", width: "140", height: "105", "aria-label": s, children: [
      /* @__PURE__ */ c.jsx("defs", { children: /* @__PURE__ */ c.jsxs("filter", { id: "dsc-gauge-glow", x: "-40%", y: "-40%", width: "180%", height: "180%", children: [
        /* @__PURE__ */ c.jsx("feGaussianBlur", { stdDeviation: "3.2", result: "b" }),
        /* @__PURE__ */ c.jsxs("feMerge", { children: [
          /* @__PURE__ */ c.jsx("feMergeNode", { in: "b" }),
          /* @__PURE__ */ c.jsx("feMergeNode", { in: "SourceGraphic" })
        ] })
      ] }) }),
      /* @__PURE__ */ c.jsx(
        "path",
        {
          d: "M18 72 A46 46 0 1 1 102 72",
          fill: "none",
          stroke: "var(--dsc-gray-3)",
          strokeWidth: "10",
          strokeLinecap: "round"
        }
      ),
      /* @__PURE__ */ c.jsx(
        "path",
        {
          d: "M18 72 A46 46 0 1 1 102 72",
          fill: "none",
          stroke: X,
          strokeWidth: "10",
          strokeLinecap: "round",
          strokeDasharray: `${G} ${Y}`,
          filter: "url(#dsc-gauge-glow)",
          style: { transition: "stroke-dasharray 220ms ease, stroke 220ms ease" }
        }
      ),
      V.map((B, le) => {
        const ce = k(B.v), se = ah(60, 72, B.kind === "ext" ? T - 2 : T + 1, ce), F = ah(60, 72, T - (B.kind === "target" ? 14 : 10), ce), xe = B.kind === "target" ? "var(--dsc-teal)" : B.kind === "band" ? "var(--dsc-amber)" : "var(--dsc-gray-5)";
        return /* @__PURE__ */ c.jsx(
          "line",
          {
            x1: F.x,
            y1: F.y,
            x2: se.x,
            y2: se.y,
            stroke: xe,
            strokeWidth: B.kind === "target" ? 2.4 : 1.6,
            strokeLinecap: "round",
            opacity: B.kind === "ext" ? 0.65 : 0.95
          },
          `${B.kind}-${le}`
        );
      }),
      /* @__PURE__ */ c.jsx(
        "text",
        {
          x: "60",
          y: "58",
          textAnchor: "middle",
          fill: "var(--dsc-white)",
          fontSize: "20",
          fontWeight: "700",
          fontFamily: "var(--dsc-mono)",
          children: Number.isFinite(u) ? u.toFixed(u >= 100 ? 0 : u < 10 ? 2 : 1) : "—"
        }
      ),
      /* @__PURE__ */ c.jsx("text", { x: "60", y: "74", textAnchor: "middle", fill: "var(--dsc-gray-5)", fontSize: "10", children: d })
    ] }),
    /* @__PURE__ */ c.jsx("div", { className: "dsc-gauge-label", children: s })
  ] });
}
function nh(u) {
  if (!u.length) return {};
  let r = u[0].v, f = u[0].v;
  for (const s of u)
    s.v < r && (r = s.v), s.v > f && (f = s.v);
  return { min: r, max: f };
}
function zr({
  tag: u,
  config: r
}) {
  const f = E.useRef(null), { hass: s } = $e(), [d, h] = E.useState("loading"), y = E.useRef(
    null
  ), g = JSON.stringify(r ?? {});
  return E.useEffect(() => {
    const v = f.current;
    if (!v) return;
    let p = !1;
    const b = g ? JSON.parse(g) : {};
    return (async () => {
      h("loading"), v.innerHTML = "";
      const _ = await Rh(u);
      if (p || !f.current) return;
      if (!_) {
        h("missing");
        const Y = document.createElement("div");
        Y.className = "dsc-empty", Y.innerHTML = `<strong>${u}</strong> did not register.<br/>Tried /local/DSC-HUB.js and /local/dsc-system-map-card.js. Deploy the IIFE bundle or add it as a Lovelace resource, then hard-refresh.`, v.appendChild(Y);
        return;
      }
      const T = document.createElement(u);
      typeof T.setConfig == "function" && T.setConfig({ type: `custom:${u}`, ...b }), s && (T.hass = s), v.appendChild(T), y.current = T, h("ready");
    })(), () => {
      p = !0, y.current = null, v.innerHTML = "";
    };
  }, [u, g]), E.useEffect(() => {
    y.current && s && (y.current.hass = s);
  }, [s]), /* @__PURE__ */ c.jsx(
    "div",
    {
      className: `dsc-legacy-host${d === "missing" ? " dsc-legacy-host--empty" : ""}`,
      ref: f,
      "data-status": d
    }
  );
}
function Mh({
  pot: u,
  onSelectPot: r
}) {
  const { state: f, entity: s, callService: d, tick: h } = $e(), y = kt(), g = Rr(u, { state: f, entity: s }), v = (p) => {
    d("script", "turn_on", {
      entity_id: "script.dsc_apply_pot_to_tent",
      variables: { pot: String(u), tent: p }
    });
  };
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-seat-panel", children: [
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 14 }, children: [
      [1, 2, 3, 4].map((p) => /* @__PURE__ */ c.jsxs(
        "button",
        {
          type: "button",
          className: `dsc-chip${p === u ? " dsc-chip--ok" : ""}`,
          onClick: () => r?.(p),
          children: [
            "P",
            p
          ]
        },
        p
      )),
      /* @__PURE__ */ c.jsx(de, { label: Bu(g.tent), tone: g.tent === "unassigned" ? "muted" : "ok" }),
      g.rosterSlot != null ? /* @__PURE__ */ c.jsx(de, { label: `Roster #${g.rosterSlot}`, tone: "muted" }) : /* @__PURE__ */ c.jsx(de, { label: "No roster join", tone: "warn" })
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-seat-layout", children: [
      /* @__PURE__ */ c.jsxs(ge, { className: "dsc-glass dsc-glass--glow", title: "Medium", children: [
        /* @__PURE__ */ c.jsx(u0, { layers: g.layers }),
        /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { marginTop: 10, fontSize: 12 }, children: g.blend || "Blend lives on roster after commit — not invented here." })
      ] }),
      /* @__PURE__ */ c.jsxs("div", { className: "dsc-grid", style: { gap: 14 }, children: [
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ge, { className: "dsc-glass", title: "Identity", children: /* @__PURE__ */ c.jsxs("div", { style: { display: "flex", justifyContent: "space-between", gap: 12 }, children: [
          /* @__PURE__ */ c.jsxs("div", { children: [
            /* @__PURE__ */ c.jsx("div", { className: "dsc-kpi-value", style: { fontSize: "1.45rem" }, children: g.plantName !== "—" ? g.plantName : `POT${u}` }),
            /* @__PURE__ */ c.jsx("div", { className: "dsc-kpi-sub", children: g.strainDisplay }),
            /* @__PURE__ */ c.jsxs("div", { className: "dsc-chip-row", style: { marginTop: 10 }, children: [
              /* @__PURE__ */ c.jsx(de, { label: `Day ${g.days}`, tone: "ok" }),
              /* @__PURE__ */ c.jsx(de, { label: g.stage, tone: "muted" }),
              /* @__PURE__ */ c.jsx(de, { label: `Sprout ${g.sprout}`, tone: "muted" })
            ] })
          ] }),
          /* @__PURE__ */ c.jsx(
            Lu,
            {
              items: [
                {
                  id: "compose",
                  label: "Open Compose",
                  onSelect: () => y("/grow/compose")
                },
                {
                  id: "root",
                  label: "Root zone",
                  onSelect: () => y("/live/root")
                },
                {
                  id: "twin",
                  label: "Open Twin",
                  onSelect: () => y("/live/twin")
                }
              ]
            }
          )
        ] }) }) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsxs(ge, { title: "Nutrition", children: [
          /* @__PURE__ */ c.jsx("p", { style: { margin: "0 0 6px" }, children: g.recipe || "No roster recipe — catalog doses only, never invented." }),
          g.notes ? /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { margin: 0 }, children: g.notes }) : null,
          /* @__PURE__ */ c.jsx("div", { style: { marginTop: 10 }, children: /* @__PURE__ */ c.jsx(li, { to: "/grow/compose", children: /* @__PURE__ */ c.jsx(ut, { teal: !0, children: "Mix in Compose" }) }) })
        ] }) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsxs(ge, { title: "Live Got", children: [
          /* @__PURE__ */ c.jsxs("div", { className: "dsc-chip-row", children: [
            /* @__PURE__ */ c.jsx(de, { label: `M ${g.moisture}`, tone: "muted" }),
            /* @__PURE__ */ c.jsx(de, { label: `T ${g.soilTemp}`, tone: "muted" }),
            /* @__PURE__ */ c.jsx(de, { label: `EC ${g.ec}`, tone: "muted" }),
            /* @__PURE__ */ c.jsx(de, { label: `pH ${g.ph}`, tone: "muted" }),
            /* @__PURE__ */ c.jsx(de, { label: `N ${g.n}`, tone: "muted" }),
            /* @__PURE__ */ c.jsx(de, { label: `P ${g.p}`, tone: "muted" }),
            /* @__PURE__ */ c.jsx(de, { label: `K ${g.k}`, tone: "muted" }),
            /* @__PURE__ */ c.jsx(
              de,
              {
                label: g.need,
                tone: g.need !== "—" && g.need !== "OK" ? "warn" : "ok"
              }
            )
          ] }),
          /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { margin: "8px 0 0", fontSize: 12 }, children: "NPK = trend indicators. Unavailable stays —." })
        ] }) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsxs(ge, { className: "dsc-glass", title: "Apply to tent", children: [
          /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "Digital-twin placement. Moves the plant on Twin; does not rewrite climate Want." }),
          /* @__PURE__ */ c.jsxs("div", { className: "dsc-seat-actions", children: [
            /* @__PURE__ */ c.jsx(ut, { primary: g.tent === "clone", onClick: () => v("clone"), children: "Clone 2×4" }),
            /* @__PURE__ */ c.jsx(ut, { primary: g.tent === "main", onClick: () => v("main"), children: "Main 4×8" }),
            /* @__PURE__ */ c.jsx(ut, { onClick: () => v("unassigned"), children: "Unassigned" }),
            /* @__PURE__ */ c.jsx(li, { to: "/live/twin", children: /* @__PURE__ */ c.jsx(ut, { children: "Open Twin" }) })
          ] })
        ] }) })
      ] })
    ] })
  ] });
}
function b0() {
  const u = kt();
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      Kt,
      {
        icon: "compose",
        title: "Compose",
        subtitle: "Build soil blend, roster commit, and Want handoff.",
        primaryAction: /* @__PURE__ */ c.jsx(ut, { teal: !0, onClick: () => u("/grow/roster"), children: "Open Roster" })
      }
    ),
    /* @__PURE__ */ c.jsx(zr, { tag: "dsc-build-plant-card", config: {} })
  ] });
}
function x0() {
  const u = kt();
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      Kt,
      {
        icon: "research",
        title: "Research",
        subtitle: "Catalog browser over /local/dsc-catalog indexes.",
        actions: /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsx(ut, { primary: !0, onClick: () => u("/grow/compose"), children: "Use in Compose" }),
          /* @__PURE__ */ c.jsx(ut, { teal: !0, onClick: () => u("/grow/roster"), children: "Open Seat" })
        ] })
      }
    ),
    /* @__PURE__ */ c.jsx(zr, { tag: "dsc-catalog-browse-card", config: {} })
  ] });
}
function _0() {
  const { entity: u, state: r, tick: f } = $e(), [s, d] = Er(), h = r0(u), y = Number(s.get("pot") || 0), g = y >= 1 && y <= 4 ? y : null, v = (b) => {
    const _ = new URLSearchParams(s);
    _.set("pot", String(b)), d(_, { replace: !0 });
  }, p = () => {
    const b = new URLSearchParams(s);
    b.delete("pot"), d(b, { replace: !0 });
  };
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      Kt,
      {
        icon: "roster",
        title: "Roster",
        subtitle: "Seats — open a row for Plant Seat drawer. Nutrient mix lives in Compose.",
        primaryAction: /* @__PURE__ */ c.jsx(li, { to: "/grow/compose", children: /* @__PURE__ */ c.jsx(ut, { primary: !0, children: /* @__PURE__ */ c.jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: 8 }, children: [
          /* @__PURE__ */ c.jsx(Vt, { name: "compose", size: 14 }),
          " Use in Compose"
        ] }) }) })
      }
    ),
    /* @__PURE__ */ c.jsx(ge, { className: "dsc-glass", title: "Roster", icon: "roster", children: h.length ? /* @__PURE__ */ c.jsxs("table", { className: "dsc-table", children: [
      /* @__PURE__ */ c.jsx("thead", { children: /* @__PURE__ */ c.jsxs("tr", { children: [
        /* @__PURE__ */ c.jsx("th", { children: "Slot" }),
        /* @__PURE__ */ c.jsx("th", { children: "Name" }),
        /* @__PURE__ */ c.jsx("th", { children: "Strain" }),
        /* @__PURE__ */ c.jsx("th", { children: "Status" }),
        /* @__PURE__ */ c.jsx("th", { children: "Pot" }),
        /* @__PURE__ */ c.jsx("th", { children: "Tent" })
      ] }) }),
      /* @__PURE__ */ c.jsx("tbody", { children: h.map((b) => {
        const _ = Number(b.pot), T = _ >= 1 && _ <= 4 ? Bu(Ch(r, _)) : "—";
        return /* @__PURE__ */ c.jsxs(
          "tr",
          {
            onClick: () => {
              _ >= 1 && _ <= 4 && v(_);
            },
            style: _ >= 1 && _ <= 4 ? { cursor: "pointer" } : void 0,
            children: [
              /* @__PURE__ */ c.jsxs("td", { children: [
                "#",
                b.slot
              ] }),
              /* @__PURE__ */ c.jsx("td", { children: b.nickname || "—" }),
              /* @__PURE__ */ c.jsx("td", { children: b.strain || "—" }),
              /* @__PURE__ */ c.jsx("td", { children: b.status || "—" }),
              /* @__PURE__ */ c.jsx("td", { children: _ >= 1 && _ <= 4 ? `P${_}` : "—" }),
              /* @__PURE__ */ c.jsx("td", { children: /* @__PURE__ */ c.jsx(de, { label: T, tone: "muted" }) })
            ]
          },
          b.slot
        );
      }) })
    ] }) : /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "No plants in roster yet. Commit from Compose, then assign a pot." }) }),
    /* @__PURE__ */ c.jsx(
      Tr,
      {
        open: g != null,
        onClose: p,
        title: g != null ? `Plant seat · POT${g}` : "Plant seat",
        children: g != null ? /* @__PURE__ */ c.jsx(Mh, { pot: g, onSelectPot: v }) : null
      }
    )
  ] });
}
function it(u, r = 1) {
  return Number.isFinite(u) ? u.toFixed(r) : "—";
}
const S0 = [
  { id: "main", label: "Main" },
  { id: "clone", label: "Clone" },
  { id: "compare", label: "Compare" }
];
function j0() {
  const u = kt();
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page dsc-page--twin-chrome", children: [
    /* @__PURE__ */ c.jsx(
      Kt,
      {
        icon: "twin",
        title: "Twin",
        subtitle: "Cinematic digital twin — pick a pot to open Root seat.",
        primaryAction: /* @__PURE__ */ c.jsx(ut, { teal: !0, onClick: () => u("/live/climate"), children: "Set Climate Want" })
      }
    ),
    /* @__PURE__ */ c.jsx("p", { className: "dsc-honesty dsc-muted", style: { marginTop: 0 }, children: "Pick a pot in the twin to open its seat. Twin stays warm across tabs (keep-alive)." })
  ] });
}
function E0() {
  const { num: u, state: r, entity: f } = $e(), s = kt(), { focus: d, setFocus: h } = n0(), y = r("switch.dsc_hub_tent_manual_override") === "on", g = r("switch.dsc_hub_tent_full_auto_mode") === "on", v = String(f("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? ""), p = Yt("sensor.dsc_hub_tent_temperature"), b = Yt("sensor.dsc_hub_tent_humidity"), _ = Yt("sensor.dsc_hub_clone_temperature"), T = Yt("sensor.dsc_hub_clone_humidity"), Y = Yt("sensor.dsc_cfm_exhaust_out"), G = Yt("sensor.dsc_cfm_exhaust_recirc"), k = Yt("sensor.dsc_fan_exhaust_outside_pct"), U = Yt("sensor.dsc_fan_exhaust_room_pct"), X = u("number.dsc_hub_target_temp"), V = u("number.dsc_hub_rh_target_min"), B = u("number.dsc_hub_rh_target_max"), le = u("number.dsc_hub_vpd_target_min"), ce = u("number.dsc_hub_vpd_target_max"), se = u("number.dsc_hub_clone_target_temp"), F = u("number.dsc_hub_clone_rh_min"), xe = u("number.dsc_hub_clone_rh_max"), we = u("number.dsc_hub_clone_vpd_min"), Fe = u("number.dsc_hub_clone_vpd_max"), Ye = E.useMemo(() => nh(p.series), [p.series]), Le = E.useMemo(() => nh(b.series), [b.series]), C = d === "main" || d === "compare" || d === "room", I = d === "clone" || d === "compare";
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      Kt,
      {
        icon: "climate",
        title: "Climate",
        subtitle: "Command, Want targets, zone traces, VPD, airflow.",
        actions: /* @__PURE__ */ c.jsx(
          Lu,
          {
            label: "Climate settings",
            items: [
              { id: "mission", label: "Mission", onSelect: () => s("/live/mission") },
              { id: "fleet", label: "Fleet kit", onSelect: () => s("/fleet") },
              { id: "twin", label: "Twin", onSelect: () => s("/live/twin") }
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-chip-row", style: { marginBottom: 14 }, role: "group", "aria-label": "Tent focus", children: [
      S0.map((P) => /* @__PURE__ */ c.jsx(
        "button",
        {
          type: "button",
          className: `dsc-chip${d === P.id ? " dsc-chip--ok" : ""}`,
          onClick: () => h(P.id),
          children: P.label
        },
        P.id
      )),
      /* @__PURE__ */ c.jsx(ut, { teal: !0, onClick: () => s("/fleet"), children: "Kit / Fleet" })
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsxs(ge, { className: "dsc-glass", title: "Command", icon: "climate", children: [
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-mode-row", children: [
          /* @__PURE__ */ c.jsx(Ce, { entityId: "switch.dsc_hub_tent_full_auto_mode", label: "Full Auto", icon: "ok" }),
          /* @__PURE__ */ c.jsx(Ce, { entityId: "switch.dsc_hub_manual_takeover", label: "Master takeover", icon: "alert" }),
          /* @__PURE__ */ c.jsx(Ce, { entityId: "switch.dsc_hub_tent_manual_override", label: "Fan override", icon: "climate" }),
          /* @__PURE__ */ c.jsx(
            Ce,
            {
              entityId: "switch.dsc_hub_humidifier_intake_routing",
              label: "Hum intake routing",
              icon: "climate"
            }
          ),
          /* @__PURE__ */ c.jsx(
            Ce,
            {
              entityId: "switch.dsc_hub_recirc_de_strat_pulse",
              label: "RECIRC de-strat",
              icon: "climate"
            }
          )
        ] }),
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-mode-selects", children: [
          /* @__PURE__ */ c.jsx(Ou, { entityId: "select.dsc_hub_control_strategy", label: "Strategy", icon: "climate" }),
          /* @__PURE__ */ c.jsx(Ou, { entityId: "select.dsc_hub_priority_tent", label: "Priority tent", icon: "tent" })
        ] }),
        g ? /* @__PURE__ */ c.jsxs("p", { className: "dsc-honesty", children: [
          /* @__PURE__ */ c.jsx(
            de,
            {
              icon: "alert",
              label: r("binary_sensor.dsc_reduced_kit") === "on" ? "Reduced kit" : "Full Auto",
              tone: r("binary_sensor.dsc_reduced_kit") === "on" ? "warn" : "ok"
            }
          ),
          " ",
          v || "Hub owns fans + appliance Autos when Full Auto is on."
        ] }) : null
      ] }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ge, { className: "dsc-glass", title: "Targets", icon: "gauge", children: /* @__PURE__ */ c.jsx(
        Ah,
        {
          emphasize: d === "clone" ? "clone" : "main"
        }
      ) }) }),
      C ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(Ae, { label: "Tent °C", value: it(u("sensor.dsc_hub_tent_temperature")), unit: "°C" }) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(Ae, { label: "Tent RH", value: it(u("sensor.dsc_hub_tent_humidity"), 0), unit: "%" }) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(Ae, { label: "VPD", value: it(u("sensor.dsc_hub_vpd_kpa"), 2), unit: "kPa" }) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(Ae, { label: "Room °C", value: it(u("sensor.dsc_hub_room_temperature")), unit: "°C" }) })
      ] }) : null,
      I ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(Ae, { label: "Clone °C", value: it(u("sensor.dsc_hub_clone_temperature")), unit: "°C" }) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(Ae, { label: "Clone RH", value: it(u("sensor.dsc_hub_clone_humidity"), 0), unit: "%" }) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(Ae, { label: "Clone VPD", value: it(u("sensor.dsc_hub_clone_vpd_kpa"), 2), unit: "kPa" }) }),
        /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(Ae, { label: "Room °C", value: it(u("sensor.dsc_hub_room_temperature")), unit: "°C" }) })
      ] }) : null,
      C ? /* @__PURE__ */ c.jsx("div", { className: I ? "dsc-col-6" : "dsc-col-12", children: /* @__PURE__ */ c.jsx(ge, { className: "dsc-glass", title: "Main tent T + RH", icon: "tent", children: /* @__PURE__ */ c.jsx(
        Pa,
        {
          lastSyncAt: Math.max(p.lastSyncAt ?? 0, b.lastSyncAt ?? 0) || void 0,
          series: [
            {
              id: "t",
              label: "Temp °C",
              series: p.series,
              color: "var(--dsc-neon)",
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
          ],
          targets: [
            { axis: "left", value: X, color: "var(--dsc-amber)", label: "Want T" },
            { axis: "right", min: V, max: B, color: "var(--dsc-teal)" }
          ]
        }
      ) }) }) : null,
      I ? /* @__PURE__ */ c.jsx("div", { className: C ? "dsc-col-6" : "dsc-col-12", children: /* @__PURE__ */ c.jsx(ge, { className: "dsc-glass", title: "Clone tent T + RH", icon: "clone", children: /* @__PURE__ */ c.jsx(
        Pa,
        {
          lastSyncAt: Math.max(_.lastSyncAt ?? 0, T.lastSyncAt ?? 0) || void 0,
          series: [
            {
              id: "t",
              label: "Temp °C",
              series: _.series,
              color: "var(--dsc-neon)",
              axis: "left",
              unit: "°C"
            },
            {
              id: "rh",
              label: "RH %",
              series: T.series,
              color: "var(--dsc-teal)",
              axis: "right",
              unit: "%"
            }
          ],
          targets: [
            {
              axis: "left",
              value: se,
              color: "var(--dsc-amber)",
              label: "Want T"
            },
            { axis: "right", min: F, max: xe, color: "var(--dsc-teal)" }
          ]
        }
      ) }) }) : null,
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(
        Ae,
        {
          label: "CFM OUT",
          value: it(u("sensor.dsc_cfm_exhaust_out"), 0),
          unit: "cfm",
          sub: `Fan ${it(u("sensor.dsc_fan_exhaust_outside_pct"), 0)}%`
        }
      ) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(
        Ae,
        {
          label: "CFM RECIRC",
          value: it(u("sensor.dsc_cfm_exhaust_recirc"), 0),
          unit: "cfm",
          sub: `Fan ${it(u("sensor.dsc_fan_exhaust_room_pct"), 0)}%`
        }
      ) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(Ae, { label: "Intake main", value: it(u("sensor.dsc_cfm_intake_main"), 0), unit: "cfm" }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(Ae, { label: "Intake 2×4", value: it(u("sensor.dsc_cfm_intake_2x4"), 0), unit: "cfm" }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsx(ge, { className: "dsc-glass", title: "Exhaust CFM", icon: "climate", children: /* @__PURE__ */ c.jsx(
        Pa,
        {
          unit: "cfm",
          lastSyncAt: Math.max(Y.lastSyncAt ?? 0, G.lastSyncAt ?? 0) || void 0,
          series: [
            {
              id: "out",
              label: "OUT",
              series: Y.series,
              color: "var(--dsc-neon)",
              unit: "cfm"
            },
            {
              id: "recirc",
              label: "RECIRC",
              series: G.series,
              color: "var(--dsc-amber)",
              unit: "cfm"
            }
          ]
        }
      ) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsxs(ge, { className: "dsc-glass", title: "Fan duty %", icon: "climate", children: [
        /* @__PURE__ */ c.jsx(
          Pa,
          {
            unit: "%",
            lastSyncAt: Math.max(k.lastSyncAt ?? 0, U.lastSyncAt ?? 0) || void 0,
            series: [
              {
                id: "fout",
                label: "OUT %",
                series: k.series,
                color: "var(--dsc-teal)",
                unit: "%"
              },
              {
                id: "frec",
                label: "RECIRC %",
                series: U.series,
                color: "var(--dsc-amber)",
                unit: "%"
              }
            ]
          }
        ),
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-fan-stack", style: { marginTop: 12 }, children: [
          /* @__PURE__ */ c.jsx(
            Xl,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_main",
              label: "Intake Main",
              disabled: !y
            }
          ),
          /* @__PURE__ */ c.jsx(
            Xl,
            {
              entityId: "fan.dsc_hub_4_inch_intake_fan_2x4",
              label: "Intake 2×4",
              disabled: !y
            }
          ),
          /* @__PURE__ */ c.jsx(
            Xl,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_room",
              label: "Exhaust room",
              disabled: !y
            }
          ),
          /* @__PURE__ */ c.jsx(
            Xl,
            {
              entityId: "fan.dsc_hub_6_inch_exhaust_outside",
              label: "Exhaust outside",
              disabled: !y
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ge, { className: "dsc-glass", title: "Zone gauges", icon: "gauge", children: /* @__PURE__ */ c.jsxs("div", { className: "dsc-gauge-row", children: [
        C ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsx(
            Fa,
            {
              label: "Tent T",
              value: u("sensor.dsc_hub_tent_temperature"),
              min: 15,
              max: 35,
              unit: "°C",
              target: X,
              extrema: Ye
            }
          ),
          /* @__PURE__ */ c.jsx(
            Fa,
            {
              label: "Tent RH",
              value: u("sensor.dsc_hub_tent_humidity"),
              min: 0,
              max: 100,
              unit: "%",
              band: { min: V, max: B },
              extrema: Le
            }
          ),
          /* @__PURE__ */ c.jsx(
            Fa,
            {
              label: "VPD",
              value: u("sensor.dsc_hub_vpd_kpa"),
              min: 0,
              max: 2.5,
              unit: "kPa",
              band: { min: le, max: ce }
            }
          )
        ] }) : null,
        I ? /* @__PURE__ */ c.jsxs(c.Fragment, { children: [
          /* @__PURE__ */ c.jsx(
            Fa,
            {
              label: "Clone T",
              value: u("sensor.dsc_hub_clone_temperature"),
              min: 15,
              max: 35,
              unit: "°C",
              target: se
            }
          ),
          /* @__PURE__ */ c.jsx(
            Fa,
            {
              label: "Clone RH",
              value: u("sensor.dsc_hub_clone_humidity"),
              min: 0,
              max: 100,
              unit: "%",
              band: { min: F, max: xe }
            }
          ),
          /* @__PURE__ */ c.jsx(
            Fa,
            {
              label: "Clone VPD",
              value: u("sensor.dsc_hub_clone_vpd_kpa"),
              min: 0,
              max: 2.5,
              unit: "kPa",
              band: { min: we, max: Fe }
            }
          )
        ] }) : null
      ] }) }) })
    ] })
  ] });
}
function N0() {
  const { num: u, state: r, entity: f, tick: s } = $e(), [d, h] = Er(), y = [1, 2, 3, 4].map((_) => Rr(_, { state: r, entity: f })), g = Number(d.get("pot") || 0), v = g >= 1 && g <= 4 ? g : null, p = (_) => {
    const T = new URLSearchParams(d);
    T.set("pot", String(_)), h(T, { replace: !0 });
  }, b = () => {
    const _ = new URLSearchParams(d);
    _.delete("pot"), h(_, { replace: !0 });
  };
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      Kt,
      {
        icon: "root",
        title: "Root",
        subtitle: "Per-pot soil Got + roster blend — click a row for seat drawer."
      }
    ),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ c.jsx(Ae, { label: "Coldest root", value: it(u("sensor.dsc_coldest_root_zone_temp")), unit: "°C" }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ c.jsx(Ae, { label: "Heat mat on time", value: it(u("sensor.dsc_heatmat_relay_on_time"), 0), unit: "s" }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ c.jsx(ge, { title: "Notes", children: /* @__PURE__ */ c.jsxs("p", { className: "dsc-muted", style: { margin: 0 }, children: [
        "Mat loop uses per-pot sense with plausibility filter. State:",
        " ",
        r("sensor.dsc_coldest_root_zone_temp", "—")
      ] }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ge, { className: "dsc-glass", title: "Pots", icon: "root", children: /* @__PURE__ */ c.jsxs("table", { className: "dsc-table", children: [
        /* @__PURE__ */ c.jsx("thead", { children: /* @__PURE__ */ c.jsxs("tr", { children: [
          /* @__PURE__ */ c.jsx("th", { children: "Pot" }),
          /* @__PURE__ */ c.jsx("th", { children: "Name" }),
          /* @__PURE__ */ c.jsx("th", { children: "Tent" }),
          /* @__PURE__ */ c.jsx("th", { children: "M" }),
          /* @__PURE__ */ c.jsx("th", { children: "T" }),
          /* @__PURE__ */ c.jsx("th", { children: "EC" }),
          /* @__PURE__ */ c.jsx("th", { children: "pH" }),
          /* @__PURE__ */ c.jsx("th", { children: "NPK" }),
          /* @__PURE__ */ c.jsx("th", { children: "Blend" })
        ] }) }),
        /* @__PURE__ */ c.jsx("tbody", { children: y.map((_) => /* @__PURE__ */ c.jsxs("tr", { onClick: () => p(_.pot), style: { cursor: "pointer" }, children: [
          /* @__PURE__ */ c.jsxs("td", { children: [
            "P",
            _.pot
          ] }),
          /* @__PURE__ */ c.jsx("td", { children: _.plantName }),
          /* @__PURE__ */ c.jsx("td", { children: /* @__PURE__ */ c.jsx(
            de,
            {
              label: Bu(_.tent),
              tone: _.tent === "unassigned" ? "muted" : "ok"
            }
          ) }),
          /* @__PURE__ */ c.jsx("td", { children: _.moisture }),
          /* @__PURE__ */ c.jsx("td", { children: _.soilTemp }),
          /* @__PURE__ */ c.jsx("td", { children: _.ec }),
          /* @__PURE__ */ c.jsx("td", { children: _.ph }),
          /* @__PURE__ */ c.jsxs("td", { children: [
            _.n,
            "/",
            _.p,
            "/",
            _.k
          ] }),
          /* @__PURE__ */ c.jsx("td", { className: "dsc-muted", children: _.blend || "—" })
        ] }, _.pot)) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ c.jsx(
      Tr,
      {
        open: v != null,
        onClose: b,
        title: v != null ? `Plant seat · POT${v}` : "Plant seat",
        children: v != null ? /* @__PURE__ */ c.jsx(Mh, { pot: v, onSelectPot: p }) : null
      }
    )
  ] });
}
function T0() {
  const { state: u, num: r } = $e(), f = kt(), s = u("binary_sensor.dsc_clone_dark_period_violation") === "on", d = u("light.dsc_hub_sf1000_dimmer") === "on";
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      Kt,
      {
        icon: "lighting",
        title: "Light",
        subtitle: "Photoperiod, SF1000, expected hours — Want stays on Climate.",
        primaryAction: /* @__PURE__ */ c.jsx(ut, { teal: !0, onClick: () => f("/live/climate"), children: "Climate Want" })
      }
    ),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-status-strip", children: [
      /* @__PURE__ */ c.jsx(
        de,
        {
          icon: s ? "alert" : "ok",
          label: s ? "CLONE DARK VIOLATION" : "Dark period OK",
          tone: s ? "bad" : "ok",
          pulse: s
        }
      ),
      /* @__PURE__ */ c.jsx(
        de,
        {
          label: d ? "SF1000 ON" : "SF1000 OFF",
          tone: d ? "ok" : "muted"
        }
      )
    ] }),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ c.jsx(
        Ae,
        {
          label: "Expected light hours",
          value: it(r("sensor.dsc_expected_light_hours"), 1),
          unit: "h"
        }
      ) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-8", children: /* @__PURE__ */ c.jsxs(ge, { className: "dsc-glass", title: "SF1000", icon: "lighting", children: [
        /* @__PURE__ */ c.jsx("div", { className: "dsc-demand-row", children: /* @__PURE__ */ c.jsx(
          Ce,
          {
            entityId: "light.dsc_hub_sf1000_dimmer",
            label: "SF1000",
            icon: "lighting",
            showBrightness: !0
          }
        ) }),
        /* @__PURE__ */ c.jsxs("p", { className: "dsc-muted", style: { margin: "8px 0 0" }, children: [
          "Expected: ",
          u("sensor.dsc_expected_light_hours", "—"),
          ". Clone dark violation is binary — schedule edits belong on Climate / packages, not invented here."
        ] })
      ] }) })
    ] })
  ] });
}
function Wa(u, r = 1) {
  return Number.isFinite(u) ? u.toFixed(r) : "—";
}
function R0() {
  const { state: u, num: r } = $e();
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      Kt,
      {
        icon: "learning",
        title: "Learning",
        subtitle: "Densify stub — CFM KPIs and kit honesty. Durable math lives in brain/."
      }
    ),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(
        Ae,
        {
          label: "CFM OUT",
          value: Wa(r("sensor.dsc_cfm_exhaust_out"), 0),
          unit: "cfm",
          sub: `Fan ${Wa(r("sensor.dsc_fan_exhaust_outside_pct"), 0)}%`
        }
      ) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(
        Ae,
        {
          label: "CFM RECIRC",
          value: Wa(r("sensor.dsc_cfm_exhaust_recirc"), 0),
          unit: "cfm",
          sub: `Fan ${Wa(r("sensor.dsc_fan_exhaust_room_pct"), 0)}%`
        }
      ) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(Ae, { label: "Intake main", value: Wa(r("sensor.dsc_cfm_intake_main"), 0), unit: "cfm" }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-3", children: /* @__PURE__ */ c.jsx(Ae, { label: "Intake 2×4", value: Wa(r("sensor.dsc_cfm_intake_2x4"), 0), unit: "cfm" }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsxs(ge, { className: "dsc-glass", title: "Status", icon: "learning", children: [
        /* @__PURE__ */ c.jsxs("p", { className: "dsc-muted", style: { marginTop: 0 }, children: [
          "Surface: ",
          u("sensor.dsc_ha_surface_version", "7.0.0"),
          ". Hub beat:",
          " ",
          u("sensor.dsc_hub_heartbeat", "—"),
          "."
        ] }),
        /* @__PURE__ */ c.jsxs("p", { className: "dsc-honesty", style: { marginBottom: 0 }, children: [
          /* @__PURE__ */ c.jsx(de, { icon: "alert", label: "Nameplate", tone: "warn" }),
          " CFM figures are nameplate / model estimates unless a calibrated flow sensor is in kit — treat as relative, not lab truth."
        ] })
      ] }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsx(ge, { className: "dsc-glass", title: "Kit / In service", icon: "settings", children: /* @__PURE__ */ c.jsxs("div", { className: "dsc-mode-row", children: [
        /* @__PURE__ */ c.jsx(Ce, { entityId: "input_boolean.dsc_ac_in_service", label: "AC in service", icon: "climate" }),
        /* @__PURE__ */ c.jsx(
          Ce,
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
function z0() {
  const u = Yt("sensor.dsc_hub_tent_temperature", { maxPoints: 96 }), r = Yt("sensor.dsc_hub_tent_humidity", { maxPoints: 96 }), f = Yt("sensor.dsc_cfm_exhaust_out", { maxPoints: 96 }), s = Yt("sensor.dsc_cfm_exhaust_recirc", { maxPoints: 96 });
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      Kt,
      {
        icon: "analytics",
        title: "Analytics",
        subtitle: "History-seeded trends with live append — MultiLine traces."
      }
    ),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ge, { className: "dsc-glass", title: "Tent T + RH", icon: "climate", children: /* @__PURE__ */ c.jsx(
        Pa,
        {
          live: !0,
          lastSyncAt: Math.max(u.lastSyncAt ?? 0, r.lastSyncAt ?? 0) || void 0,
          series: [
            {
              id: "t",
              label: "Temp °C",
              series: u.series,
              color: "var(--dsc-neon)",
              axis: "left",
              unit: "°C"
            },
            {
              id: "rh",
              label: "RH %",
              series: r.series,
              color: "var(--dsc-teal)",
              axis: "right",
              unit: "%"
            }
          ]
        }
      ) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ge, { className: "dsc-glass", title: "Exhaust CFM", icon: "climate", children: /* @__PURE__ */ c.jsx(
        Pa,
        {
          live: !0,
          unit: "cfm",
          lastSyncAt: Math.max(f.lastSyncAt ?? 0, s.lastSyncAt ?? 0) || void 0,
          series: [
            {
              id: "out",
              label: "OUT",
              series: f.series,
              color: "var(--dsc-neon)",
              unit: "cfm"
            },
            {
              id: "recirc",
              label: "RECIRC",
              series: s.series,
              color: "var(--dsc-amber)",
              unit: "cfm"
            }
          ]
        }
      ) }) })
    ] })
  ] });
}
function A0() {
  const { state: u, available: r, num: f } = $e(), s = r("sensor.dsc_hub_uptime");
  return /* @__PURE__ */ c.jsxs("div", { className: "dsc-page", children: [
    /* @__PURE__ */ c.jsx(
      Kt,
      {
        icon: "fleet",
        title: "Fleet",
        subtitle: "Diagnostics, versions, kit densify, system map, tank note."
      }
    ),
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-grid", children: [
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ c.jsx(
        Ae,
        {
          label: "Hub link",
          value: s ? "OK" : "DOWN",
          tone: s ? "ok" : "bad",
          sub: `Uptime raw ${u("sensor.dsc_hub_uptime", "—")}`
        }
      ) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ c.jsx(
        Ae,
        {
          label: "Surface",
          value: u("sensor.dsc_ha_surface_version", "7.0.0"),
          sub: "Panel product shell"
        }
      ) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-4", children: /* @__PURE__ */ c.jsx(
        Ae,
        {
          label: "Alerts",
          value: Number.isFinite(f("sensor.dsc_active_alert_count")) ? f("sensor.dsc_active_alert_count") : "—",
          tone: f("sensor.dsc_active_alert_count", 0) === 0 ? "ok" : "bad"
        }
      ) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ge, { className: "dsc-glass", title: "Kit / In service", icon: "settings", children: /* @__PURE__ */ c.jsxs("div", { className: "dsc-mode-row", children: [
        /* @__PURE__ */ c.jsx(Ce, { entityId: "input_boolean.dsc_ac_in_service", label: "AC in service", icon: "climate" }),
        /* @__PURE__ */ c.jsx(
          Ce,
          {
            entityId: "input_boolean.dsc_clone_humidifier_in_service",
            label: "Clone mister",
            icon: "clone"
          }
        ),
        /* @__PURE__ */ c.jsx(Ce, { entityId: "input_boolean.dsc_pot1_in_service", label: "Pot 1", icon: "root" }),
        /* @__PURE__ */ c.jsx(Ce, { entityId: "input_boolean.dsc_pot2_in_service", label: "Pot 2", icon: "root" }),
        /* @__PURE__ */ c.jsx(Ce, { entityId: "input_boolean.dsc_pot3_in_service", label: "Pot 3", icon: "root" }),
        /* @__PURE__ */ c.jsx(Ce, { entityId: "input_boolean.dsc_pot4_in_service", label: "Pot 4", icon: "root" })
      ] }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ge, { className: "dsc-glass", title: "System map", icon: "system", children: /* @__PURE__ */ c.jsx(zr, { tag: "dsc-system-map-card", config: {} }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsx(ge, { className: "dsc-glass", title: "Fleet version", icon: "fleet", children: /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: u("sensor.dsc_fleet_version_status", "—") }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-6", children: /* @__PURE__ */ c.jsx(ge, { className: "dsc-glass", title: "Tank", icon: "tank", children: /* @__PURE__ */ c.jsx("p", { className: "dsc-muted", style: { marginTop: 0 }, children: "Reservoir / tank vitals land here as hardware comes online. Map above stays the topology view; do not invent tank sensors." }) }) }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-col-12", children: /* @__PURE__ */ c.jsx(ge, { className: "dsc-glass", title: "Panel", icon: "system", children: /* @__PURE__ */ c.jsxs("p", { className: "dsc-muted", style: { marginTop: 0 }, children: [
        "Custom panel ",
        /* @__PURE__ */ c.jsx("code", { children: "/dsc-hub" }),
        " · React + Vite · assets under",
        " ",
        /* @__PURE__ */ c.jsx("code", { children: "/dsc_hub/assets" }),
        "."
      ] }) }) })
    ] })
  ] });
}
const C0 = [
  { id: "live", label: "Live", path: "/live/mission", icon: "live" },
  { id: "grow", label: "Grow", path: "/grow/compose", icon: "grow" },
  { id: "tune", label: "Tune", path: "/tune/learning", icon: "tune" },
  { id: "fleet", label: "Fleet", path: "/fleet", icon: "fleet" }
], M0 = {
  live: [
    { id: "mission", label: "Mission", path: "/live/mission", icon: "mission" },
    { id: "twin", label: "Twin", path: "/live/twin", icon: "twin" },
    { id: "climate", label: "Climate", path: "/live/climate", icon: "climate" },
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
}, O0 = {
  "/": "/live/mission",
  "/ops": "/live/mission",
  "/ops/home": "/live/mission",
  "/ops/dash": "/live/twin",
  "/ops/climate": "/live/climate",
  "/ops/main-4x8": "/live/climate?tent=main",
  "/ops/clone-2x4": "/live/climate?tent=clone",
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
function w0(u) {
  return u.startsWith("/grow") || u.startsWith("/plant") ? "grow" : u.startsWith("/tune") || u.startsWith("/advanced") ? "tune" : u.startsWith("/fleet") || u.startsWith("/system") ? "fleet" : "live";
}
function D0(u, r) {
  const f = O0[u];
  return f ? f.includes("?") ? f : `${f}${r || ""}` : null;
}
const U0 = ':host,.dsc-root{--dsc-black: #0a0e18;--dsc-black-2: #0f1524;--dsc-gray-1: #151c2e;--dsc-gray-2: #1c2540;--dsc-gray-3: #2a3555;--dsc-gray-4: #7a8499;--dsc-gray-5: #a8b0c4;--dsc-blue: #4f8cff;--dsc-blue-dim: rgba(79, 140, 255, .35);--dsc-purple: #9b7bff;--dsc-purple-dim: rgba(155, 123, 255, .35);--dsc-neon: #3dde7a;--dsc-neon-dim: rgba(61, 222, 122, .35);--dsc-neon-glow: rgba(61, 222, 122, .45);--dsc-teal: #2ec4d6;--dsc-teal-dim: rgba(46, 196, 214, .4);--dsc-teal-glow: rgba(46, 196, 214, .5);--dsc-amber: #ffb74d;--dsc-bad: #ff6b8a;--dsc-bad-soft: #ff8aa3;--dsc-soil-1: #5b9f6b;--dsc-soil-2: #4a8f9f;--dsc-soil-3: #c4a35a;--dsc-soil-4: #8d6e63;--dsc-glass: rgba(16, 22, 40, .72);--dsc-glass-border: rgba(120, 150, 220, .28);--dsc-white: #eef1f8;--dsc-shadow: 0 8px 24px rgba(0, 0, 0, .45);--dsc-shadow-tight: 0 2px 8px rgba(0, 0, 0, .55);--dsc-radius: 10px;--dsc-radius-lg: 14px;--dsc-font: "Segoe UI", "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;--dsc-mono: "Cascadia Code", "IBM Plex Mono", ui-monospace, monospace;color:var(--dsc-white);background:var(--dsc-black);font-family:var(--dsc-font);display:block;height:100%;box-sizing:border-box}*,*:before,*:after{box-sizing:border-box}.dsc-root{height:100%;min-height:100%;overflow:auto;background:radial-gradient(1100px 560px at 8% -12%,rgba(79,140,255,.14),transparent 55%),radial-gradient(900px 520px at 92% -8%,rgba(155,123,255,.12),transparent 50%),radial-gradient(700px 420px at 70% 100%,rgba(61,222,122,.06),transparent 55%),var(--dsc-black)}.dsc-honesty-rail{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}.dsc-row-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.dsc-next-rec{border-color:var(--dsc-blue-dim)}.dsc-twin-keepalive{display:none;margin-bottom:12px;min-height:0}.dsc-twin-keepalive.is-active{display:block;min-height:min(70vh,720px)}.dsc-twin-keepalive-host{min-height:min(68vh,700px)}.dsc-twin-keepalive-host>*{min-height:min(68vh,700px)}.dsc-tab--live.active{color:var(--dsc-neon);border-color:var(--dsc-neon-dim)}.dsc-tab--grow.active{color:var(--dsc-teal);border-color:var(--dsc-teal-dim)}.dsc-tab--tune.active{color:var(--dsc-purple);border-color:var(--dsc-purple-dim)}.dsc-tab--fleet.active{color:var(--dsc-blue);border-color:var(--dsc-blue-dim)}.dsc-tent-segment{display:inline-flex;gap:4px;padding:3px;border-radius:999px;background:var(--dsc-gray-1);border:1px solid var(--dsc-glass-border)}.dsc-tent-segment button{appearance:none;border:0;background:transparent;color:var(--dsc-gray-5);padding:6px 12px;border-radius:999px;cursor:pointer;font:inherit;font-size:.85rem}.dsc-tent-segment button.is-active{background:var(--dsc-gray-2);color:var(--dsc-white);box-shadow:var(--dsc-shadow-tight)}.dsc-tent-segment button[data-tent=main].is-active{color:var(--dsc-blue)}.dsc-tent-segment button[data-tent=clone].is-active{color:var(--dsc-purple)}.dsc-tent-segment button[data-tent=compare].is-active{color:var(--dsc-teal)}.dsc-shell{display:flex;flex-direction:column;min-height:100%;max-width:1600px;margin:0 auto;padding:16px 20px 28px}.dsc-brand-row{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:10px}.dsc-brand{display:flex;align-items:center;gap:12px;color:var(--dsc-white);text-decoration:none}.dsc-brand img,.dsc-brand svg{width:36px;height:36px;color:var(--dsc-neon)}.dsc-brand-title{display:flex;flex-direction:column;gap:2px}.dsc-brand-title strong{font-size:1.15rem;letter-spacing:.14em;font-weight:700}.dsc-brand-wordmark{height:18px;width:auto;max-width:160px;display:block;filter:brightness(0) invert(1)}.dsc-brand-title span{font-size:.72rem;color:var(--dsc-gray-5);letter-spacing:.08em;text-transform:uppercase}.dsc-page-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px}.dsc-page-header-main{display:flex;align-items:flex-start;gap:10px}.dsc-page-header-actions{display:flex;align-items:center;gap:6px;flex-shrink:0}.dsc-card-title{display:inline-flex;align-items:center;gap:8px}.dsc-primary-tabs,.dsc-secondary-tabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:thin;padding-bottom:2px;-webkit-overflow-scrolling:touch}.dsc-primary-tabs{border-bottom:1px solid var(--dsc-gray-3);margin-bottom:8px}.dsc-secondary-tabs{margin-bottom:16px;mask-image:linear-gradient(90deg,#000 85%,transparent)}.dsc-secondary-tabs:after{content:"";flex:0 0 12px}.dsc-tab{appearance:none;border:1px solid transparent;background:transparent;color:var(--dsc-gray-5);padding:10px 14px;min-height:44px;border-radius:8px 8px 0 0;cursor:pointer;font:inherit;font-size:.92rem;letter-spacing:.04em;white-space:nowrap;display:inline-flex;align-items:center;gap:8px;transition:transform .1s ease,box-shadow .1s ease,color .15s ease,border-color .15s ease,background .15s ease;text-decoration:none}.dsc-tab span[role=img]{opacity:.9;flex-shrink:0}.dsc-tab:hover{color:var(--dsc-white);background:var(--dsc-gray-1)}.dsc-tab:focus-visible{outline:2px solid var(--dsc-neon);outline-offset:2px}.dsc-tab.active{color:var(--dsc-white);border-bottom:2px solid var(--dsc-neon);box-shadow:0 6px 18px #39ff1414}.dsc-secondary-tabs .dsc-tab{border-radius:999px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-1);min-height:40px;padding:8px 14px}.dsc-secondary-tabs .dsc-tab.active{border-color:var(--dsc-neon-dim);color:var(--dsc-neon);background:#39ff1414;box-shadow:var(--dsc-shadow-tight)}.dsc-btn{appearance:none;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);border-radius:8px;padding:10px 16px;min-height:40px;font:inherit;cursor:pointer;box-shadow:var(--dsc-shadow-tight);transition:transform .1s ease,box-shadow .1s ease,border-color .12s ease,background .12s ease}.dsc-btn:hover{border-color:var(--dsc-neon-dim)}.dsc-btn:active,.dsc-tab:active{transform:translateY(1px);box-shadow:0 1px 3px #000000a6}.dsc-btn.primary{border-color:var(--dsc-neon-dim);color:var(--dsc-black);background:var(--dsc-neon);font-weight:650}.dsc-page{animation:dsc-fade .18s ease}@keyframes dsc-fade{0%{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.dsc-page,.dsc-btn,.dsc-tab,.dsc-live-pulse{animation:none!important;transition:none!important}}.dsc-grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:14px}.dsc-col-3{grid-column:span 3}.dsc-col-4{grid-column:span 4}.dsc-col-6{grid-column:span 6}.dsc-col-8{grid-column:span 8}.dsc-col-12{grid-column:span 12}@media(max-width:1100px){.dsc-col-3,.dsc-col-4{grid-column:span 6}.dsc-col-8{grid-column:span 12}}@media(max-width:720px){.dsc-shell{padding:12px}.dsc-col-3,.dsc-col-4,.dsc-col-6,.dsc-col-8{grid-column:span 12}}.dsc-card{background:linear-gradient(165deg,var(--dsc-gray-1),var(--dsc-black-2));border:1px solid var(--dsc-gray-3);border-radius:var(--dsc-radius);box-shadow:var(--dsc-shadow);padding:14px 16px;min-height:88px}.dsc-card h2,.dsc-card h3{margin:0 0 8px;font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;color:var(--dsc-gray-5);font-weight:600}.dsc-kpi-value{font-size:1.85rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:.02em;color:var(--dsc-white)}.dsc-kpi-unit{margin-left:6px;font-size:.85rem;color:var(--dsc-gray-5)}.dsc-kpi-sub{margin-top:6px;color:var(--dsc-gray-5);font-size:.82rem}.dsc-status-ok{color:var(--dsc-neon)}.dsc-status-bad{color:var(--dsc-bad)}.dsc-status-muted{color:var(--dsc-gray-5)}.dsc-page-title{margin:0 0 14px;font-size:1.35rem;letter-spacing:.04em}.dsc-muted{color:var(--dsc-gray-5)}.dsc-legacy-host{min-height:420px;border-radius:var(--dsc-radius);overflow:hidden;border:1px solid var(--dsc-gray-3);background:#000}.dsc-legacy-host--empty{background:var(--dsc-gray-1);min-height:160px}.dsc-legacy-host>*{display:block;width:100%}.dsc-status-strip{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}.dsc-chip-row{display:flex;flex-wrap:wrap;gap:8px}.dsc-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-1);font-size:.75rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-chip--ok{color:var(--dsc-neon);border-color:var(--dsc-neon-dim);background:#39ff1414;box-shadow:0 0 12px #39ff141f}.dsc-chip--bad{color:var(--dsc-bad-soft);border-color:color-mix(in srgb,var(--dsc-bad) 45%,transparent);background:color-mix(in srgb,var(--dsc-bad) 12%,transparent)}.dsc-chip--warn{color:var(--dsc-amber);border-color:color-mix(in srgb,var(--dsc-amber) 45%,transparent);background:color-mix(in srgb,var(--dsc-amber) 12%,transparent)}.dsc-chip--muted{color:var(--dsc-gray-5)}.dsc-chip--pulse{animation:dsc-chip-pulse 1.6s ease-in-out infinite}@keyframes dsc-chip-pulse{0%,to{box-shadow:0 0 #39ff1400}50%{box-shadow:0 0 14px #39ff1459}}.dsc-demand-row{display:flex;flex-wrap:wrap;gap:8px}.dsc-demand-row--stack{flex-direction:column}.dsc-demand{appearance:none;flex:1 1 110px;min-height:52px;padding:10px 12px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);font:inherit;cursor:pointer;display:flex;flex-direction:column;align-items:flex-start;gap:4px;box-shadow:var(--dsc-shadow-tight);transition:transform .1s ease,box-shadow .1s ease,border-color .12s ease,background .12s ease}.dsc-demand:hover{border-color:var(--dsc-neon-dim)}.dsc-demand:active{transform:translateY(1px);box-shadow:0 1px 3px #000000a6}.dsc-demand.is-on{border-color:var(--dsc-neon);background:#39ff141a;box-shadow:0 0 0 1px #39ff1440,0 0 18px #39ff1433}.dsc-demand.is-missing{opacity:.55;cursor:not-allowed}.dsc-demand-label{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-demand.is-on .dsc-demand-label{color:var(--dsc-neon)}.dsc-demand-state{font-weight:700;font-variant-numeric:tabular-nums;font-size:1rem}.dsc-demand-icon{margin-bottom:2px}.dsc-mode-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}.dsc-mode-selects{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}.dsc-entity-select{display:flex;flex-direction:column;gap:6px;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-entity-select-label{display:inline-flex;align-items:center;gap:6px}.dsc-entity-select select{appearance:none;min-height:40px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);padding:8px 12px;font:inherit;text-transform:none;letter-spacing:0}.dsc-entity-select.is-disabled{opacity:.55}.dsc-fan-stack{display:flex;flex-direction:column;gap:10px}.dsc-fan-slider{display:flex;flex-direction:column;gap:4px}.dsc-fan-slider-label{display:flex;align-items:baseline;gap:8px;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-fan-slider-label strong{color:var(--dsc-teal);font-variant-numeric:tabular-nums}.dsc-fan-slider input[type=range]{width:100%;accent-color:var(--dsc-teal)}.dsc-fan-slider.is-disabled{opacity:.5}.dsc-honesty{margin:10px 0 0;font-size:.85rem;color:var(--dsc-gray-5);display:flex;flex-wrap:wrap;align-items:center;gap:8px}.dsc-target-panel{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}.dsc-target-panel.is-compact .dsc-target-grid{grid-template-columns:repeat(auto-fit,minmax(90px,1fr))}.dsc-tent-targets{border:1px solid var(--dsc-glass-border);border-radius:var(--dsc-radius);padding:10px 12px;background:#0000002e}.dsc-tent-targets-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}.dsc-got-want{display:flex;flex-direction:column;gap:2px;font-size:.82rem;margin-bottom:10px}.dsc-target-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px}.dsc-target-num{display:flex;flex-direction:column;gap:4px;font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-target-num input{min-height:36px;border-radius:8px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);padding:6px 8px;font:inherit;font-variant-numeric:tabular-nums}.dsc-target-num.is-disabled{opacity:.55}.dsc-chart{position:relative}.dsc-chart-svg{cursor:crosshair;touch-action:none}.dsc-chart-tooltip{position:absolute;top:8px;transform:translate(-50%);pointer-events:none;z-index:2;min-width:120px;padding:8px 10px;border-radius:8px;border:1px solid var(--dsc-glass-border);background:var(--dsc-glass);backdrop-filter:blur(10px);box-shadow:var(--dsc-shadow-tight);font-size:.75rem}.dsc-chart-tooltip-time{color:var(--dsc-teal);font-family:var(--dsc-mono);margin-bottom:4px}.dsc-chart-tooltip-row{display:flex;align-items:center;gap:6px;color:var(--dsc-white)}.dsc-chart-tooltip-row i{width:7px;height:7px;border-radius:50%;display:inline-block}@keyframes dsc-sync-pulse{0%{stroke-dashoffset:1;opacity:.2}35%{opacity:1}to{stroke-dashoffset:0;opacity:0}}@media(prefers-reduced-motion:reduce){.dsc-chart-pulse{animation:none!important;opacity:.85}}.dsc-gauge.is-warn .dsc-gauge-label{color:var(--dsc-amber)}.dsc-gauge-row{display:flex;justify-content:space-around;flex-wrap:wrap;gap:8px}.dsc-gauge{display:flex;flex-direction:column;align-items:center;gap:4px}.dsc-gauge-label{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-chart-legend{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:4px;min-height:20px}.dsc-chart-legend-item{display:inline-flex;align-items:center;gap:6px;font-size:.75rem;color:var(--dsc-gray-5)}.dsc-chart-legend-item i{width:8px;height:8px;border-radius:50%;display:inline-block;box-shadow:0 0 6px currentColor}.dsc-chart-last{margin-left:auto;font-variant-numeric:tabular-nums;color:var(--dsc-neon);font-size:13px;font-weight:650}.dsc-fault-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.dsc-fault-list li{display:flex;flex-wrap:wrap;align-items:center;gap:10px}.dsc-empty{padding:18px 14px;border:1px dashed var(--dsc-gray-3);border-radius:8px;color:var(--dsc-gray-5);background:#00000040;font-size:.9rem;line-height:1.45}.dsc-empty--ok{border-style:solid;border-color:var(--dsc-neon-dim);color:var(--dsc-neon)}.dsc-btn:disabled{opacity:.45;cursor:not-allowed}.dsc-glass{background:var(--dsc-glass);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid var(--dsc-glass-border);border-radius:var(--dsc-radius-lg);box-shadow:var(--dsc-shadow)}.dsc-glass--glow{border-color:var(--dsc-teal-dim);box-shadow:0 0 0 1px #26c6da26,0 0 24px #26c6da1f}.dsc-icon-btn{appearance:none;width:36px;height:36px;padding:0;display:inline-flex;align-items:center;justify-content:center;border-radius:10px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);cursor:pointer;box-shadow:var(--dsc-shadow-tight);transition:border-color .12s ease,background .12s ease,transform .1s ease}.dsc-icon-btn:hover{border-color:var(--dsc-teal-dim);color:var(--dsc-teal)}.dsc-icon-btn:active{transform:translateY(1px)}.dsc-result-chip{display:inline-flex;align-items:center;gap:8px;max-width:100%;padding:8px 12px;border-radius:999px;border:1px solid var(--dsc-teal-dim);background:#26c6da1a;color:var(--dsc-white);font-size:.9rem}.dsc-result-chip span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dsc-overflow{position:relative;display:inline-block}.dsc-overflow-menu{position:absolute;right:0;top:calc(100% + 6px);z-index:40;min-width:180px;padding:6px;background:var(--dsc-black-2);border:1px solid var(--dsc-gray-3);border-radius:10px;box-shadow:var(--dsc-shadow)}.dsc-overflow-menu button{appearance:none;width:100%;text-align:left;border:0;background:transparent;color:var(--dsc-white);font:inherit;font-size:.88rem;padding:10px 12px;border-radius:8px;cursor:pointer}.dsc-overflow-menu button:hover{background:#26c6da1f;color:var(--dsc-teal)}.dsc-drawer-root{position:fixed;inset:0;z-index:80;pointer-events:none}.dsc-drawer-root.is-open{pointer-events:auto}.dsc-drawer-scrim{position:absolute;inset:0;background:#00000073;opacity:0;transition:opacity .18s ease}.dsc-drawer-root.is-open .dsc-drawer-scrim{opacity:1}.dsc-drawer-panel{position:absolute;top:0;bottom:0;width:min(380px,92vw);background:linear-gradient(165deg,#121a16,#0a100e);border:1px solid var(--dsc-glass-border);box-shadow:-12px 0 40px #0000008c;display:flex;flex-direction:column;transition:transform .22s ease}.dsc-drawer-panel.right{right:0;transform:translate(105%);border-radius:14px 0 0 14px}.dsc-drawer-panel.left{left:0;transform:translate(-105%);border-radius:0 14px 14px 0}.dsc-drawer-root.is-open .dsc-drawer-panel.right,.dsc-drawer-root.is-open .dsc-drawer-panel.left{transform:none}.dsc-drawer-rail{position:absolute;top:50%;transform:translateY(-50%);width:28px;height:64px;border:1px solid var(--dsc-gray-3);background:var(--dsc-gray-2);color:var(--dsc-white);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:2}.dsc-drawer-panel.right .dsc-drawer-rail{left:-28px;border-radius:10px 0 0 10px}.dsc-drawer-panel.left .dsc-drawer-rail{right:-28px;border-radius:0 10px 10px 0}.dsc-drawer-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid var(--dsc-gray-3)}.dsc-drawer-head h2{margin:0;font-size:.85rem;letter-spacing:.12em;text-transform:uppercase;color:var(--dsc-gray-5)}.dsc-drawer-body{flex:1;overflow:auto;padding:14px 16px}.dsc-soil{width:100%;max-width:280px;margin:0 auto}.dsc-soil-pot{position:relative;width:100%;aspect-ratio:4 / 5;border-radius:12px 12px 28px 28px;border:2px solid rgba(120,160,130,.45);background:linear-gradient(180deg,#1a1410,#0e0c0a);overflow:hidden;box-shadow:inset 0 0 24px #0000008c,0 0 20px #26c6da14}.dsc-soil-pot.is-valid{border-color:var(--dsc-teal-dim);box-shadow:inset 0 0 24px #0000008c,0 0 28px #26c6da47,0 0 42px #39ff141f}.dsc-soil-layer{position:absolute;left:8%;right:8%;display:flex;align-items:center;justify-content:center;font-size:.72rem;letter-spacing:.04em;color:#f4f7f4eb;text-shadow:0 1px 2px rgba(0,0,0,.65);border-top:1px solid rgba(255,255,255,.08)}.dsc-soil-empty{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--dsc-gray-5);font-size:.85rem;padding:16px;text-align:center}.dsc-seat-layout{display:grid;grid-template-columns:minmax(200px,320px) 1fr;gap:18px;align-items:start}@media(max-width:900px){.dsc-seat-layout{grid-template-columns:1fr}}.dsc-seat-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.dsc-table{width:100%;border-collapse:collapse;font-size:.88rem}.dsc-table th,.dsc-table td{text-align:left;padding:8px 6px;border-bottom:1px solid var(--dsc-gray-3)}.dsc-table th{font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--dsc-gray-5);font-weight:600}.dsc-table tr{cursor:pointer}.dsc-table tr:hover td{background:#26c6da0f}.dsc-btn.teal{border-color:var(--dsc-teal-dim);background:#26c6da2e;color:var(--dsc-white);box-shadow:0 0 18px #26c6da33}.dsc-btn.teal.primary{background:var(--dsc-teal);color:#041018;font-weight:650}@media(prefers-reduced-motion:reduce){.dsc-drawer-panel,.dsc-drawer-scrim{transition:none!important}}', H0 = U0;
function ra() {
  const u = gt(), r = D0(u.pathname, u.search);
  return r ? /* @__PURE__ */ c.jsx(oa, { to: r, replace: !0 }) : /* @__PURE__ */ c.jsx(oa, { to: "/live/mission", replace: !0 });
}
function L0() {
  const u = gt(), r = kt(), f = w0(u.pathname), s = M0[f];
  return E.useEffect(() => {
    const d = (h) => {
      const y = h.detail, g = Number(y?.pot);
      g >= 1 && g <= 4 && r(`/live/root?pot=${g}`);
    };
    return window.addEventListener("dsc-dash-select-pot", d), () => window.removeEventListener("dsc-dash-select-pot", d);
  }, [r]), /* @__PURE__ */ c.jsxs("div", { className: "dsc-shell", children: [
    /* @__PURE__ */ c.jsxs("div", { className: "dsc-brand-row", children: [
      /* @__PURE__ */ c.jsxs(Au, { className: "dsc-brand", to: "/live/mission", children: [
        /* @__PURE__ */ c.jsx(Vt, { name: "brand", size: 36, color: "var(--dsc-blue)" }),
        /* @__PURE__ */ c.jsxs("div", { className: "dsc-brand-title", children: [
          /* @__PURE__ */ c.jsx(
            "img",
            {
              className: "dsc-brand-wordmark",
              src: "/dsc_hub/assets/brand/dsc-brand-wordmark.svg",
              alt: "DSC-HUB"
            }
          ),
          /* @__PURE__ */ c.jsx("span", { children: "DSC-Dashboard" })
        ] })
      ] }),
      /* @__PURE__ */ c.jsx("div", { className: "dsc-muted", style: { fontSize: 12, letterSpacing: "0.08em" }, children: "SURFACE 7.0.0" })
    ] }),
    /* @__PURE__ */ c.jsx(Wy, {}),
    /* @__PURE__ */ c.jsx("nav", { className: "dsc-primary-tabs", "aria-label": "Primary", children: C0.map((d) => /* @__PURE__ */ c.jsxs(
      Au,
      {
        to: d.path,
        className: ({ isActive: h }) => `dsc-tab dsc-tab--${d.id}${h || f === d.id ? " active" : ""}`,
        children: [
          /* @__PURE__ */ c.jsx(Vt, { name: d.icon, size: 15 }),
          d.label
        ]
      },
      d.id
    )) }),
    s.length > 1 ? /* @__PURE__ */ c.jsx("nav", { className: "dsc-secondary-tabs", "aria-label": "Section pages", children: s.map((d) => /* @__PURE__ */ c.jsxs(
      Au,
      {
        to: d.path,
        end: d.path === "/fleet",
        className: ({ isActive: h }) => `dsc-tab${h ? " active" : ""}`,
        children: [
          /* @__PURE__ */ c.jsx(Vt, { name: d.icon, size: 14 }),
          d.label
        ]
      },
      d.id
    )) }) : null,
    /* @__PURE__ */ c.jsxs(fy, { children: [
      /* @__PURE__ */ c.jsx(Ue, { path: "/", element: /* @__PURE__ */ c.jsx(oa, { to: "/live/mission", replace: !0 }) }),
      /* @__PURE__ */ c.jsx(Ue, { path: "/live", element: /* @__PURE__ */ c.jsx(oa, { to: "/live/mission", replace: !0 }) }),
      /* @__PURE__ */ c.jsx(Ue, { path: "/live/mission", element: /* @__PURE__ */ c.jsx(d0, {}) }),
      /* @__PURE__ */ c.jsx(Ue, { path: "/live/twin", element: /* @__PURE__ */ c.jsx(j0, {}) }),
      /* @__PURE__ */ c.jsx(Ue, { path: "/live/climate", element: /* @__PURE__ */ c.jsx(E0, {}) }),
      /* @__PURE__ */ c.jsx(Ue, { path: "/live/root", element: /* @__PURE__ */ c.jsx(N0, {}) }),
      /* @__PURE__ */ c.jsx(Ue, { path: "/live/light", element: /* @__PURE__ */ c.jsx(T0, {}) }),
      /* @__PURE__ */ c.jsx(Ue, { path: "/grow", element: /* @__PURE__ */ c.jsx(oa, { to: "/grow/compose", replace: !0 }) }),
      /* @__PURE__ */ c.jsx(Ue, { path: "/grow/compose", element: /* @__PURE__ */ c.jsx(b0, {}) }),
      /* @__PURE__ */ c.jsx(Ue, { path: "/grow/research", element: /* @__PURE__ */ c.jsx(x0, {}) }),
      /* @__PURE__ */ c.jsx(Ue, { path: "/grow/roster", element: /* @__PURE__ */ c.jsx(_0, {}) }),
      /* @__PURE__ */ c.jsx(Ue, { path: "/tune", element: /* @__PURE__ */ c.jsx(oa, { to: "/tune/learning", replace: !0 }) }),
      /* @__PURE__ */ c.jsx(Ue, { path: "/tune/learning", element: /* @__PURE__ */ c.jsx(R0, {}) }),
      /* @__PURE__ */ c.jsx(Ue, { path: "/tune/analytics", element: /* @__PURE__ */ c.jsx(z0, {}) }),
      /* @__PURE__ */ c.jsx(Ue, { path: "/fleet", element: /* @__PURE__ */ c.jsx(A0, {}) }),
      /* @__PURE__ */ c.jsx(Ue, { path: "/ops/*", element: /* @__PURE__ */ c.jsx(ra, {}) }),
      /* @__PURE__ */ c.jsx(Ue, { path: "/ops", element: /* @__PURE__ */ c.jsx(ra, {}) }),
      /* @__PURE__ */ c.jsx(Ue, { path: "/plant/*", element: /* @__PURE__ */ c.jsx(ra, {}) }),
      /* @__PURE__ */ c.jsx(Ue, { path: "/plant", element: /* @__PURE__ */ c.jsx(ra, {}) }),
      /* @__PURE__ */ c.jsx(Ue, { path: "/advanced/*", element: /* @__PURE__ */ c.jsx(ra, {}) }),
      /* @__PURE__ */ c.jsx(Ue, { path: "/advanced", element: /* @__PURE__ */ c.jsx(ra, {}) }),
      /* @__PURE__ */ c.jsx(Ue, { path: "/system", element: /* @__PURE__ */ c.jsx(ra, {}) }),
      /* @__PURE__ */ c.jsx(Ue, { path: "*", element: /* @__PURE__ */ c.jsx(oa, { to: "/live/mission", replace: !0 }) })
    ] }),
    /* @__PURE__ */ c.jsx(t0, {})
  ] });
}
function B0({ hass: u }) {
  return /* @__PURE__ */ c.jsx(Jy, { hass: u, children: /* @__PURE__ */ c.jsx(a0, { children: /* @__PURE__ */ c.jsx(L0, {}) }) });
}
function q0({
  panel: u
}) {
  const [r, f] = E.useState(() => u.hass);
  return E.useEffect(() => {
    const s = () => f(u.hass);
    return s(), u.addEventListener("hass-updated", s), () => {
      u.removeEventListener("hass-updated", s);
    };
  }, [u]), /* @__PURE__ */ c.jsx(Hy, { children: /* @__PURE__ */ c.jsx(B0, { hass: r }) });
}
class Y0 extends HTMLElement {
  constructor() {
    super(...arguments);
    ju(this, "_root", null);
    ju(this, "_hass", null);
    ju(this, "_mounted", !1);
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
      f.textContent = `:host{display:block;height:100%;background:#0a0e18;color:#eef1f8;}
${H0}`, this.shadowRoot.appendChild(f);
      const s = document.createElement("div");
      s.className = "dsc-root", s.style.height = "100%", this.shadowRoot.appendChild(s), this._root = dg.createRoot(s), this._root.render(/* @__PURE__ */ c.jsx(q0, { panel: this })), this._mounted = !0;
    }
  }
  disconnectedCallback() {
    this._root?.unmount(), this._root = null, this._mounted = !1;
  }
}
customElements.get("dsc-hub-panel") || customElements.define("dsc-hub-panel", Y0);
export {
  Y0 as default
};
//# sourceMappingURL=dsc-hub-panel.js.map
